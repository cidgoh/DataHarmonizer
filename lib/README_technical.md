# DataHarmonizer — Technical Notes

## Slot `minimum_value` / `maximum_value` constraint system

This document describes how numeric and date range constraints are expressed in schemas and enforced at runtime. There are four distinct mechanisms; they are parallel rather than unified.

---

### 1. Literal values directly in `minimum_value` / `maximum_value`

The simplest form. A slot carries the constraint directly in the LinkML slot definition:

```yaml
slots:
  passage_number:
    range: integer
    minimum_value: 0
    maximum_value: 100
```

At validation time `Validator.js#parseMinMaxConstraint` reads these values, parses them to the slot's data type, and the generated validator function compares each cell value against them.

**`{today}` is also supported here.** If `minimum_value` or `maximum_value` is the literal string `{today}`, `#parseMinMaxConstraint` substitutes `new Date()` at the moment validation runs, so the constraint is always relative to the current date.

```yaml
slots:
  sample_collection_date:
    range: date
    maximum_value: "{today}"
```

---

### 2. `any_of` nested pattern (preferred for mixed decimal + enum slots)

When a slot accepts either a numeric value **or** a categorical enum (e.g. `NullValueMenu`), constraints should be nested inside the `any_of` entry for the numeric range rather than placed at the top level:

```yaml
slots:
  measured_value:
    any_of:
      - range: decimal
        minimum_value: 0
        maximum_value: 100
      - range: NullValueMenu
```

`Validator.js#getValidatorForSlot` is recursive: it calls itself on each `any_of` sub-slot, so `minimum_value`/`maximum_value` inside a sub-slot are naturally enforced for that branch. A `NullValueMenu` string passes because the enum branch validator accepts it; an out-of-range decimal fails because both branches reject it.

The top-level pattern (constraints on the parent slot alongside `any_of`) also works and is supported for backward compatibility. `getNumericConstraints()` in `lib/utils/fields.js` is the shared utility used by `SchemaEditor` and `DataHarmonizer` to find constraints from either location:

```js
// lib/utils/fields.js
export function getNumericConstraints(slotDef, schema) { ... }
```

The **Schema Editor saves the nested pattern** when a slot has multiple ranges: on save, `minimum_value`/`maximum_value` are moved from the top-level record into the `any_of` entry whose `range` resolves to a `schema.types` numeric type.

---

### 3. `todos` convention for date min/max (DH-specific)

LinkML's `minimum_value`/`maximum_value` were historically defined as numeric-only. DataHarmonizer works around this for **date** slots using a convention in the `todos` array:

| Todo string | Effect |
|---|---|
| `>=2020-01-01` | Sets `minimum_value: "2020-01-01"` on the slot at runtime |
| `<={today}` | Sets `maximum_value: "{today}"` on the slot at runtime |

`Validator.js#processTodos` runs at `Validator` construction time. For any slot whose resolved type is `xsd:date`, it scans `todos` for entries with a `>=` or `<=` prefix and writes the remainder into `minimum_value` / `maximum_value` on the slot definition object in memory. The propagation also recurses into `any_of` / `all_of` etc. sub-slots so that date+NullValueMenu combinations work correctly.

This is a **schema-authoring convenience** — the schema stays valid LinkML while still expressing date bounds. The resulting runtime `minimum_value`/`maximum_value` values are then handled by mechanism 1 above.

---

### 4. Cross-column field references via `todos` (DH-specific)

A separate convention allows a slot's min or max to be the **value of another column in the same row**, rather than a constant:

| Todo string | Meaning |
|---|---|
| `>={end_date}` | This slot's value must be ≥ the value in the `end_date` column |
| `<={start_date}` | This slot's value must be ≤ the value in the `start_date` column |

The regex `^([><])={(.*?)}$` (Validator.js:100) detects these during construction and indexes them into `#dependantMinimumValuesMap` / `#dependantMaximumValuesMap`. During full-sheet validation, `#doDependantComparisonValidation` walks those maps, looks up the referenced column value in each data row, parses both values to the slot's type, and compares them.

This mechanism is distinct from the `{field_name}` lookup inside `testDateRange` (DataHarmonizer.js, mechanism 5 below) — they are parallel implementations covering similar ground.

---

### 5. `{field_name}` references inside `minimum_value` / `maximum_value` — legacy (DataHarmonizer.js)

An older code path in `DataHarmonizer.testDateRange` supports a brace-syntax field lookup directly inside `minimum_value` / `maximum_value` string values:

```yaml
minimum_value: "{sample_collection_date}"
```

`testDateRange` splits the value on `;`, detects the `{` prefix, strips the braces to get a column name, and looks up the live cell value from Handsontable for the current row. This predates the Validator rewrite and is specific to date fields rendered through the Handsontable cell renderer path.

---

### Summary table

| Mechanism | Where expressed | Types supported | Code location |
|---|---|---|---|
| Literal constant | `minimum_value` / `maximum_value` directly | numeric, date | `Validator.js#parseMinMaxConstraint` |
| `{today}` literal | `minimum_value` / `maximum_value` directly | date | `Validator.js#parseMinMaxConstraint` |
| Nested in `any_of` entry | `any_of[n].minimum_value` / `any_of[n].maximum_value` | numeric | `Validator.js#getValidatorForSlot` (recursive) |
| `>= / <=` prefix in `todos` | `todos` array | date only | `Validator.js#processTodos` → promotes to `minimum_value`/`maximum_value` |
| `>={slot} / <={slot}` in `todos` | `todos` array | numeric, date | `Validator.js#doDependantComparisonValidation` |
| `{field_name}` in `minimum_value` | `minimum_value` / `maximum_value` directly | date (legacy) | `DataHarmonizer.js#testDateRange` |

---

## Schema Editor — Delete/Backspace key row removal

In Schema Editor mode, pressing Delete or Backspace behaves differently depending on what is selected:

| Selection | Key behaviour |
|---|---|
| **Whole row(s)** (row-number header clicked) | Cascade-confirm dialog → row(s) removed |
| **Individual cell(s)** | HOT default — cell contents cleared |
| **Cell editor open** (user is typing) | HOT default — character deleted in editor |

### Implementation

The interception is registered in `SchemaEditor.hotSettingsMenuHooks()` via `dh.hot.addHook('beforeKeyDown', ...)`. The hook:

1. Returns immediately if a cell editor is open (user is mid-edit).
2. Checks whether the current selection spans **all columns** (`minCol === 0 && maxCol === countCols() - 1`). When clicking a row-number header HOT sets exactly this range. A partial cell selection fails this check and the key is passed through to HOT's normal `emptySelectedCells` handler.
3. For whole-row selections: sets `event.isImmediatePropagationEnabled = false` (HOT's own flag — not the native `stopImmediatePropagation`) to block `emptySelectedCells`, then calls `dh.removeSelectedRows()` which handles the cascade-confirm dialog and uses `hot.loadData()` to apply the deletion.

### Known limitation — key-field cell clearing

If the user selects an **individual cell** in a key field (one that drives dependent records in another tab) and presses Delete, the cascade-confirm popup still appears. This is not from the row-deletion hook — the hook passes the key through to HOT's `emptySelectedCells`, which clears the cell value and fires `afterChange`. The existing `afterChange` cascade-dependency check then detects that a key field was cleared and shows the prompt. The behaviour is the same as manually clearing that cell via the editor. Fixing this would require suppressing the cascade check for single-cell clears, which is a separate concern.

### macOS keyboard note

On macOS, the physical ⌫ Delete key (top-right of the main keyboard) sends `e.key = 'Backspace'`, **not** `'Delete'`. The forward-delete key (Fn+Delete) sends `'Delete'`. HOT registers both `[['Backspace'], ['Delete']]` for its built-in `emptySelectedCells` shortcut, so the `beforeKeyDown` hook must guard against both:

```js
if (e.key !== 'Delete' && e.key !== 'Backspace') return;
```

Guarding only `'Delete'` silently misses every keypress on macOS, allowing HOT's default cell-clearing behaviour to run instead.

---

## Application modes: DataHarmonizer vs. Schema Editor

The app runs in one of two modes determined entirely by which schema is loaded. The mode badge in the toolbar (`#dh-mode-badge`) reflects the current state.

### DataHarmonizer mode (normal data-entry mode)

When any schema other than `DH_LinkML` is loaded, the app is in DataHarmonizer mode. `AppContext.schemaEditor` is `null`. Each class in the schema gets a Handsontable tab built by `AppContext.makeDHsFromRelations()`, and the user edits, validates, and exports structured data against that schema.

### Schema Editor mode

When the `schema_editor/Schema` template is selected, the loaded schema has `name: DH_LinkML`. `AppContext.reload()` detects this at line 637:

```js
// AppContext.js
this.schemaEditor = schema.name === 'DH_LinkML' ? new SchemaEditor(schema, this) : null;
```

A `SchemaEditor` instance is constructed and attached to `AppContext`. The DH_LinkML schema defines classes named `Class`, `Slot`, `Enum`, etc., so the same Handsontable grid infrastructure renders those as editable rows — but `SchemaEditor` intercepts saves and writes a LinkML YAML file rather than a data file. The toolbar switches from the standard file menu to the schema-editor-specific menu (`#schema-editor-menu`).

**Switching between modes** is handled by two toolbar buttons:

- **"Run schema editor"** (`#load-schema-editor-button`) — selects `schema_editor/Schema` and calls `loadSelectedTemplate()`. Shown only when `schema_editor/Schema` is present in `menu.json`.
- **"Switch to DataHarmonizer"** (`#load-data-manager-button`) — selects the first non-schema-editor `display:true` template and reloads.

Both buttons prompt the user to confirm if there is unsaved data in the current workspace.

---

## FieldMapper — column mapping on file load

`FieldMapper` (`lib/FieldMapper.js`) handles the case where an incoming data file's column names do not exactly match the schema's slot names. It is invoked by `Toolbar.loadTabularData()` every time a file is opened.

### When it activates

For each tab/class in the schema, `Toolbar.loadTabularData()` compares the number of matched columns against two thresholds (Toolbar.js:862):

```js
const needs_modal = (data.matches != data.header.length) && (data.matches != dh.slots.length);
```

If any tab has unresolved columns on either side, `FieldMapper` builds a mapping modal. If all tabs match cleanly, it calls `fieldMapper.loadMappedData()` directly with no modal.

### The mapping modal

The modal shows a table of the schema's expected slot names alongside the incoming file's column names, with drag-and-drop realignment. The user can leave slots unmapped (those columns load as empty) or drag an incoming column header onto any schema slot.

### Mapping profiles (persistent)

Named mapping profiles are saved to `localStorage` under the key `dataharmonizer_settings`, keyed by schema name. The structure is:

```
localStorage["dataharmonizer_settings"]
  .schema[schema_name]
    [profile_name]
      .tables[class_name]
        .map: [{from: "incoming_col", to: "schema_slot"}, ...]
```

Users can save, load, and delete profiles across sessions. On load, if a saved profile is selected, its `from → to` mappings overwrite the automatic column-index matches before data is pushed into Handsontable.

### `loadMappedData()`

After mapping is resolved (either automatically or via the modal), `FieldMapper.loadMappedData()` iterates each class tab, builds a correctly-ordered row array from `slot_to_data_col_matches` (auto-matched indices) plus any user-specified `map` overrides, and calls `dh.hot.loadData()` to populate the grid.

### Limitations

- Only handles column reordering and renaming — not value transformation.
- Duplicate column names in the incoming file are not resolved (see comment in FieldMapper.js header).
- The equivalent command-line tool for schema-to-schema mapping is [`linkml-map`](https://pypi.org/project/linkml-map/).
