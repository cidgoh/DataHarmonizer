# DataHarmonizer Developer Notes

Technical reference for developers working on the DataHarmonizer codebase.

---

## Schema Induction (`schema_induction.js`)

### Objective

A raw LinkML `schema.yaml` file stores field definitions in a normalized, reusable form. Global slot definitions live in a top-level `slots` dictionary; per-class customisations live in each class's `slot_usage`; and inherited properties flow down through `is_a` chains. Before the DH runtime can render a spreadsheet, every class needs a **self-contained `attributes` dictionary** where all of these layers have been resolved into one merged definition per field.

`lib/utils/schema_induction.js` performs this resolution in the browser at schema-load time, replacing the Python `linkml-runtime SchemaView` build step that previously produced `schema.json`.

### Entry points

| Function | When used |
|----------|-----------|
| `fetchAndProcessYaml(url)` | Async. Called for HTTP/HTTPS loads (dev server, production). Fetches the YAML, resolves imports by fetching sibling files, induces all classes. |
| `processYamlSchema(yamlText)` | Sync. Called when a schema file is uploaded via "Load Template" or when the bundled YAML text is used in `file://` mode. Handles only `linkml:types` imports (no fetch is available). |

Both functions produce the same structure: a fully-induced schema object with `schema.classes[name].attributes` populated for every class.

### Processing pipeline

#### Step 1 — Parse YAML

The raw YAML text is parsed into a plain JavaScript object using the `yaml` npm library. The result reflects the file as written — global `slots`, per-class `slot_usage`, and `is_a` chains are all separate.

#### Step 2 — Resolve imports (`resolveImports`)

`schema.imports[]` is walked in order. Two kinds of import are handled:

- **`linkml:types`** — a built-in map of all standard LinkML scalar types (`string`, `integer`, `boolean`, `date`, `uri`, etc.) is merged into `schema.types` non-destructively; schema-defined types are never overwritten.
- **Relative YAML paths** — the file is fetched from the same directory as the parent schema, parsed, and recursively resolved. Its `slots`, `enums`, `types`, `prefixes`, `subsets`, and `classes` sections are merged into the main schema non-destructively. This is the mechanism by which a shared base YAML file can supply global slot definitions to a schema that imports it.

#### Step 3 — Induce classes (`induceAllClasses` / `induceClass`)

For every class that has a `slots` list or a direct `attributes` block, `induceClass` is called. It walks the `is_a` inheritance chain **from the root ancestor down to the target class**, accumulating a merged `attributes` dict in two sub-steps per ancestor:

**a. Slots list → global definition merged with slot_usage**

The class's `slots: [...]` is a **list of names** of slots that the class reuses from the top-level `schema.slots` dictionary. For each name in this list, the induction performs a three-way spread merge:

```
accumulated[slotName] = {
  ...accumulated[slotName],      // any definition already built up from is_a ancestors
  ...schema.slots[slotName],     // full global slot definition: range, annotations,
                                 // required, pattern, examples, foreign_key, etc.
  ...cls.slot_usage[slotName],   // class-specific overrides: rank, title, required,
                                 // description, slot_group, pattern, etc.
}
```

The global `schema.slots` entry is the authoritative source for all properties shared across every class that references that slot — including `annotations` such as `foreign_key`. The `slot_usage` layer adds or overwrites individual scalar properties for this class's context (display rank, column title, required flag, validation pattern, etc.) without altering the shared global definition.

Note: because `slot_usage` is merged via object spread, if it supplies an `annotations` object, that object **replaces** the global slot's `annotations` entirely for this class — it does not deep-merge individual annotation entries. A `slot_usage` that needs to add a new annotation while preserving existing ones must repeat all annotations explicitly.

**b. Direct attributes overlay**

After all `slots` entries have been processed, any fields defined directly in the class's `attributes: {}` block are spread on top of whatever `accumulated` already holds for that name:

```
accumulated[attrName] = {
  ...accumulated[attrName],   // result from the slots pass (if the name appeared there)
  ...attrDef,                 // the inline attribute definition
}
```

Direct `attributes` entries are **not sourced from the global `slots` dictionary** — they carry precisely the properties written in the class definition and nothing more.

**c. Name guarantee**

After each merge step, if the resulting entry lacks a `name` field, the slot/attribute key name is written in.

#### Step 4 — Replace class attributes

`schema.classes[className].attributes` is replaced with the fully-resolved dict produced by the above steps. The original `slots` list and `slot_usage` entries remain in place (they are used by the Schema Editor's own display and save logic), but the DH runtime reads only from `attributes` when building column definitions, validation rules, and picklists.

### Design principles

- **`slots:`** is a list of names pointing into the top-level `schema.slots` dictionary. Adding a slot name here brings in all global properties for that slot, including any `annotations` (such as `foreign_key`). The order of names in this list controls the order in which slots are accumulated.
- **`slot_usage:`** is an override layer applied on top of the global definition for a specific class. It can add new properties or overwrite scalar values but, because the merge uses a shallow object spread, it cannot selectively extend a nested object (such as `annotations`) without replacing it entirely.
- **`attributes:`** is a standalone definition layer merged last. Properties written here are not sourced from `schema.slots`, so they carry none of the global slot's annotations. This layer is used for slots that are intrinsic to a single class and not shared across the schema.

---

## CRUD Operations (`AppContext.js`)

DataHarmonizer's 1-to-many mode links multiple Handsontable tabs in a parent–child hierarchy driven by foreign-key annotations in the schema. `AppContext.js` implements all CRUD coordination across those tabs.

### Relation map (`crudGetRelations`)

At load time, `crudGetRelations(schema)` walks every class's `attributes` and looks for slots annotated with `foreign_key: OtherClass.slot_name`. For each such slot it builds a symmetric entry in `this.relations`:

```
relations[childClass].parent[parentClass][childSlot]  = parentSlot
relations[childClass].dependent_slots[childSlot]      = { foreign_class, foreign_slot }
relations[parentClass].child[childClass][parentSlot]  = childSlot
relations[parentClass].target_slots[parentSlot][childClass] = childSlot
```

`relations[cls].dependents` is then populated by `crudGetDependents`, which walks the child graph breadth-first to collect every transitive descendant of a class.

### Dependent-row state (`dependent_rows`)

`this.dependent_rows` is a `Map` keyed by class name. Each entry records the current cascade context for that class:

| Field | Meaning |
|-------|---------|
| `fkey_vals` | Foreign-key slot values used to filter this class's rows |
| `fkey_status` | 0 = unsatisfied, 1 = partial, 2 = no FKs, 3 = fully satisfied |
| `key_vals` | The class's own key slot values (used by children as their FK values) |
| `key_changed_vals` | Which key slots are changing and to what new value |

### Refreshing tab display (`refreshTabDisplay`)

Called whenever the user selects a row in any tab. It calls `crudGetDependentRows` to recompute `dependent_rows` for the selected class and all its descendants, then:

- Calls `setDHTabStatus` on each descendant — enabling or disabling the tab based on `fkey_status`.
- Calls `tabFilter` on each descendant — hiding rows whose FK values do not match the cascade context.

`tabFilter` uses Handsontable's HiddenRows plugin so that hidden rows remain in the source data and are not deleted.

### Cascade update (`getChangeReport` + `beforeChange` hook)

When a user edits a key slot in a tab's row, `DataHarmonizer.js`'s `beforeChange` hook fires. It calls `getChangeReport` which in turn calls `crudGetDependentRows` with the pending change. If any descendant rows would be affected, a confirmation dialog lists them. On confirmation, each affected row in each descendant tab has its FK slot updated via `setSourceDataAtCell` (physical row index, reaches hidden rows).

#### How cascade FK values are built for dependents

`crudGetDependentRows` iterates the `dependents` map of the changed class in dependency order. For each dependent class it derives `fkey_vals` **purely from the cascade chain already recorded in `dependent_rows`** — not from the user's current tab selection. This ensures the cascade scope is determined only by the record being changed:

- If `start_name = 'Schema'` and Schema.name is being renamed, every descendant (Class, Slot, UniqueKey, Enum, etc.) is searched using only `{schema_id: oldName}`. A currently selected Class row does **not** narrow the search to that class's rows.
- If `start_name = 'Class'` and Class.name is being renamed, descendants are searched using `{class_id: oldName, schema_id: <value from Schema's cascade entry>}`.

Null FK values (parents not in the cascade chain) are excluded from the row search, so only the keys that actually flow from the changed record are applied as filters.

`key_vals` stored for intermediate classes in `dependent_rows` contains only FK-chain values (no user-selection values), preventing user selections from leaking into downstream FK lookups.

### Cascade delete (`getChangeReport` + right-click Delete)

The same `getChangeReport` machinery is used. On confirmation, dependent rows are removed via `crudDeleteRowsByPhysical`, which filters the source data array and calls `hot.loadData()` — removing all matching rows (visible or hidden) without needing visual-row index conversion.

### Row search (`crudFindRowByKeyVals` / `crudFindAllRowsByKeyVals`)

Searches are done on physical (source) row indices using `getSourceDataAtCell`, so hidden rows are always included. Null values in the search filter are treated as "match any" by being excluded from the filter before the search.

### Current scope and future directions

The cascade system currently operates in **single-hierarchy** mode: a rename or delete on a given class propagates to all descendants of that class using only the changed record's key values as the filter. The user's selections in other tabs do not influence the cascade scope.

A future option could support **multi-focus cascading**, where the user first narrows one or more intermediate tabs (e.g., selects a specific Class row) and the cascade is then scoped to that focused subset — for example, renaming only the UniqueKey rows that belong to the selected class, rather than all UniqueKey rows for the schema. This would require extending `crudGetDependentRows` to optionally incorporate user-selection values from non-start-class tabs into the `fkey_vals` chain.

---

## `tabular_to_schema.py` — Legacy Schema Build Tool

`script/tabular_to_schema.py` was the previous way of assembling a complete DataHarmonizer `schema.yaml` from spreadsheet-based source files. It combines three inputs:

| Input file | Contents |
|------------|----------|
| `schema_core.yaml` | Base schema skeleton: class definitions, shared slot stubs, enum stubs, prefixes, types, and settings |
| `schema_slots.tsv` | One row per slot (field), with columns for all slot attributes (title, range, required, pattern, etc.) |
| `schema_enums.tsv` | One row per permissible value, with columns for enum name, value text, title, and description |

The script reads the TSV files, populates the slot and enum structures from `schema_core.yaml`, and writes a single combined `schema.yaml` that the DH runtime (or `linkml-runtime SchemaView`) can consume.

This approach is being superseded by the **built-in Schema Editor** — a DataHarmonizer template that lets authors load, edit, and save `schema.yaml` files directly in the browser without any Python build step. See `README_schema_editor.md` for usage.
