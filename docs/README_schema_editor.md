# DataHarmonizer Schema Editor

The Schema Editor is a special DataHarmonizer template that lets you **load, inspect, edit, and save LinkML `schema.yaml` files** directly in the browser, using the same tabbed spreadsheet interface used for data entry. Each tab represents a structural component of a schema: tables (classes), fields (slots), picklists (enumerations), and so on.

---

## Loading the Schema Editor

The Schema Editor is a template like any other, but it is accessed via a dedicated shortcut in the toolbar.

1. Open the **File** menu in the toolbar.
2. Click **Load Schema Editor**.
   - This entry is shown only when the `schema_editor/Schema` template is present in the deployed DataHarmonizer instance.
3. The interface reloads with the Schema Editor template active. A new set of **Schema Editor options** appears in the File menu.

---

## Tabs: Standard vs. Expert Mode

By default the Schema Editor shows the tabs needed for routine schema authoring:

| Tab | LinkML concept | Purpose |
|-----|---------------|---------|
| **Schema** | `schema` | Name, version, default language, translation locales, imports |
| **Table** | `class` | One row per class (data table) in the schema |
| **Table section** | `slot_group` | Named column groups within a table |
| **Field** | `slot` | Schema-level and class-level field definitions |
| **Enum** | `enum` | Picklist definitions |
| **Enum value** | `permissible_value` | Individual picklist entries |

### Enabling Expert Mode

Some advanced structural tabs are hidden by default. To reveal them:

1. Open the **File** menu.
2. Under **Schema Editor options**, tick the **Toggle expert user mode** checkbox.

The following additional tabs appear:

| Tab | LinkML concept | Purpose |
|-----|---------------|---------|
| **Prefix** | `prefix` | Namespace prefix/URI pairs used in the schema |
| **Table key** | `unique_key` | Single and composite unique-key declarations |
| **Annotation** | `annotation` | Arbitrary key/value annotations on schema elements |
| **Enum source** | `enum` → `reachable_from` | External ontology sources for dynamic enumeration loading |
| **Extension** | `extension` | Custom extension entries |

Expert mode also **unlocks editing** of schema-level `slot` rows in the Field tab. Without expert mode those rows are read-only (only `slot_usage` rows, which customise a schema field for a specific table, remain editable).

---

## Loading a Schema

You can load any `schema.yaml` file into the Schema Editor from two places.

### Via the File menu

1. Open the **File** menu.
2. Click **Upload Schema** (or the equivalent schema file input).
3. Select a `schema.yaml` file from your local filesystem.
4. The schema is parsed and its contents are distributed across the Schema Editor tabs — one row per schema element.

### Via the right-click context menu

1. While on the **Schema** tab, right-click on any row.
2. Select **Load schema.yaml** from the context menu.
3. A file picker appears; select the `schema.yaml` to load.

When a schema is loaded, the Schema Editor dynamically rebuilds its internal menus (class names, slot names, enum names) so that picklist fields in other tabs reflect the content of the loaded schema.

---

## Saving a Schema

Once you have edited schema content across the tabs, you can save the result as a `schema.yaml` file.

### Via the File menu

1. Open the **File** menu.
2. Click **Save Schema**.
3. A dialog prompts for the output filename (default: `schema.yaml`).
4. The file is downloaded to your browser's default download location.

### Via the right-click context menu

1. On the **Schema** tab, right-click on the row for the schema you want to save.
2. Select **Save as LinkML schema.yaml**.
3. Enter a filename when prompted.

The save routine collects data from all Schema Editor tabs and assembles a valid LinkML `schema.yaml`. Changes made since the last save are summarised in the prompt message before download.

---

## Previewing a Schema

The **Preview** feature lets you test a schema in a live DataHarmonizer instance directly from the Schema Editor, without first saving the file and running a build pipeline.

### How to preview

1. On the **Schema** tab, right-click on the row for the schema you want to preview.
2. Select **Preview** from the context menu.
3. A popup window opens containing a fully functional DataHarmonizer instance loaded with that schema.

### What the preview does

- The schema is compiled in the browser (slots and slot_usage are merged into class attributes) and passed directly to the DataHarmonizer runtime (one no longer needs the build step of running linkml.py or tabular_to_schema.py to generate `schema.json`).
- The popup uses the schema's first non-Container, non-infrastructure class as the active template tab.  If a class in the schema is marked `tree_root: true` (and is not `Container`), that class is preferred.
- You can load a data file into the preview, enter data, and run **Validate** — the full validation pipeline runs against the in-browser schema.
- The popup window is named after the schema. Clicking **Preview** again for the same schema row reloads that popup with the current schema content — any edits you have made since the last preview are reflected immediately. A second popup is never opened for the same schema.

### Limitations

- Export formats (xlsx, csv, json, etc.) are available for download, but the preview schema is not processed through the normal build pipeline, and does not have access to the `export.js` file where customized options are specified for each export target.
- The preview reflects the schema content at the moment **Preview** was clicked. Subsequent edits in the Schema Editor are not automatically pushed to an already-open preview window; close and reopen it to pick up changes.

---

## Copying content from other schemas

The Schema Editor lets you copy one or more rows from any tab into a different schema in the same editing session. This is useful when building a new schema that reuses tables, fields, or picklists that are already defined elsewhere.

### How to copy rows to another schema

1. Navigate to any Schema Editor tab (Table, Field, Enum, Enum value, etc.).
2. **Select the rows** you want to copy.
   - Click a single row to select it.
   - Hold **Shift** and click another row to extend the selection across a contiguous range.
   - Hold **Ctrl** (Windows / Linux) or **Cmd** (macOS) and click individual rows to add non-contiguous rows to the selection.
   - Right-click **within the highlighted selection** to preserve the multi-row selection while opening the context menu.
3. Right-click the selection and choose **Copy to schema**.
4. In the dialog that appears:
   - Choose the **target schema** from the **Copy to schema** drop-down. The source schema(s) are shown as disabled and cannot be chosen as a target.
   - Review the three optional sections described below.
5. Click **Copy**. The rows are appended to the appropriate tabs of the target schema, and a confirmation message reports how many rows were written.

#### Dialog sections

**Section 1 — Selected rows and their parents (always copied)**
This section is always visible. The selected rows are listed first, grouped under their tab name. Below them, any structural items they depend on that are not yet present in the target schema (e.g. a Table row that a Field refers to, or a base slot that a slot_usage customises) are listed. Everything in this section is always copied and cannot be individually deselected.

**Section 2 — Dependent table records (optional)**
Child records that belong to the selected rows — for example, Field rows that belong to a selected Table, or Enum value rows that belong to a selected Enum — are listed here. Uncheck the section to skip copying them entirely.

**Section 3 — Copy picklists and picklist choices (optional)**
Enumerations (picklists) referenced by the `range` attribute of selected or subordinate fields are listed here. Each enumeration has its own checkbox; expanding an enumeration shows a checkbox for each individual permissible value. All items are checked by default.

- Uncheck an **enumeration** to skip that entire picklist and all its values.
- Uncheck individual **permissible value** rows to copy the enumeration but exclude specific choices.

> **Note:** If you choose not to copy a picklist that one or more fields reference in their `range`, those fields will show a validation error on the Field tab (broken enumeration reference). This is expected — you can resolve it later by either copying the missing picklist separately or updating the field's `range` to point to a picklist that already exists in the target schema.

### What gets copied automatically (dependencies)

Before appending the selected rows, the editor checks whether any structural items they reference are already present in the target schema. Items that are missing are copied along automatically:

| Situation | Auto-copied dependency |
|-----------|------------------------|
| A **slot_usage** or **attribute** row references a class (`class_id`) not in the target | That **Table** (class) row |
| A **slot** row's `range` names an **Enum** not in the target | That **Enum** row and all its **Enum values** |
| An **Enum value** row references an **Enum** not in the target | That **Enum** row and all its **Enum values** |
| A **slot_usage** row references a base **slot** (schema-level field) not in the target | That base **Field** (slot) row |
| **Enum** rows are directly selected | All **Enum values** for those enums (if the target has none yet) |

Only `schema_id` is changed in copied rows; all other attributes — names, descriptions, constraints, `class_id`, `enum_id`, `range`, etc. — are preserved exactly as they appear in the source.

### A note on accidental duplicates

If a row you copy happens to have the same primary key (name) as a row that already exists in the target schema, both rows will be present after the copy. This is intentional: the editor cannot know whether the duplicate is an error or a deliberate variation. In such cases you may want to:

- **Delete** the newly appended duplicate and leave the existing row unchanged, or
- **Merge** the two rows manually by reviewing which attributes differ and deciding which values to keep, or
- **Change the field type** — for example, if you copied a `slot_usage` row (a field that customises a schema-level slot for a specific table) but the target schema should treat it as a standalone `attribute` instead (or vice versa), simply edit the `slot_type` cell of the row you just copied from `slot_usage` to `attribute`. No other changes are needed; the field name, constraints, and class association remain the same.

The **Display > Record(s) by selected key** filter (active by default) is useful here: select the target schema row, then navigate to the relevant tab to see all rows for that schema and spot duplicates quickly.

---

## Multilingual Text Editing

The Schema Editor provides a structured workflow for adding translations of schema metadata (titles, descriptions, examples, comments) into additional languages. This workflow has two parts: configuring which languages are supported, and then entering or fetching the translated text.

### Step 1: Set the Schema's Default Language

Every schema has one primary language in which its labels and descriptions are authored. This is declared in the **Schema** tab.

1. Navigate to the **Schema** tab.
2. Select (click) the row for your schema.
3. In the **in_language** column, enter the BCP 47 language code for the default content language — for example `en` for English, `fr` for French.

This value tells the translation system which language the source text is written in, and is used as the "from" language when launching Google Translate.

### Step 2: Add Translation Locales

1. Still on the **Schema** tab, in the **locales** column, enter a semicolon-separated list of language codes for the languages you want to support — for example `fr;es;de`.
2. Press Enter or click away from the cell.
3. A confirmation dialog appears listing the locales to be created (or deleted if you removed one). Confirm to proceed.

Each listed locale gets an empty translation branch in the schema's locale data. Removing a locale from the list and confirming **permanently deletes all stored translations for that locale**.

### Step 3: Entering Translations via the Translation Popup

Once a schema has at least one locale defined, translatable tabs gain a **Translations** option in their right-click context menu.

Translatable tabs and the fields they expose for translation:

| Tab | Translatable fields |
|-----|---------------------|
| Schema | `description` |
| Table | `title`, `description` |
| Field (slot / slot usage) | `title`, `description`, `comments`, `examples` |
| Enum | `title`, `description` |
| Enum value | `title`, `description` |

To open the translation form:

1. Navigate to a translatable tab (e.g. **Table**).
2. Select one or more rows whose text you want to translate (click a row; hold Shift or Ctrl/Cmd for multiple rows).
3. Right-click → **Translations**.

The popup form that appears contains one block per selected row. Each block shows:

- **Header row**: the element's key (e.g. class name or slot name).
- **Source row**: the text as it currently exists in the default language, displayed read-only in the left-most column.
- **One editable row per locale**: each locale is labelled by its full language name (e.g. "French"). The fields for the translatable columns are editable textareas where you can type or paste the translated text directly.

When you close the form, any text you entered is saved into the schema's locale data for that element and will be included in the next `schema.yaml` download.

### Using the Google Translate Button

Each locale row in the translation popup includes a **google** button on the right.

- Clicking **google** opens a Google Translate popup window with the source text pre-loaded, translating **from** the schema's default language **to** that locale's language.
- Because the Google Translate page is a different origin, its output cannot be injected automatically into the form. Copy the translated text from the Google Translate result and paste it into the corresponding textarea in the DataHarmonizer translation popup.

---

## Notes on Workflow

- The Schema Editor is itself a DataHarmonizer 1-to-many schema. The **Schema** tab is the root parent; all other tabs (Table, Field, Enum, etc.) are child tabs linked to it by a `schema_id` foreign key. See `README_1_to_many.md` for the general 1-to-many model.
- Selecting a row in the **Schema** tab filters all other tabs to show only elements belonging to that schema — useful when multiple schemas are loaded simultaneously.
- Fields marked with `slot_group: technical` in the underlying schema definition (e.g. `class_uri`, `is_a`, `tree_root`) are grouped into a "technical" section within their tab and are only editable in expert mode.
- The schema editor does not run `tabular_to_schema.py` or any build pipeline step. After saving `schema.yaml`, run the standard DataHarmonizer build process (`update_templates.py` or equivalent) to produce the `schema.json` consumed by the DH JavaScript runtime.

For technical details on how `schema.yaml` files are loaded and resolved at runtime, see `README_developer.md`.

---

## The Container Class

### What it is

A **Container** is a special LinkML class that acts as the top-level envelope for a schema's data. It is defined with `tree_root: true`, which tells LinkML validators and serialisers that this class is the outermost object — the root of the data tree. It holds one multivalued, inlined-as-list slot per data table in the schema, each slot pointing (`range:`) to the corresponding table class.

The canonical pattern (from the [LinkML tutorial](https://linkml.io/linkml/intro/tutorial02.html)):

```yaml
classes:

  Container:
    tree_root: true
    attributes:
      persons:
        range: Person
        multivalued: true
        inlined_as_list: true

  Person:
    attributes:
      id:
      full_name:
      age:
```

Key attributes on each Container slot:

| Attribute | Required | Purpose |
|-----------|----------|---------|
| `range` | yes | Names the table class that this slot holds |
| `multivalued: true` | yes | Declares that the slot holds a list of instances, not just one |
| `inlined_as_list: true` | yes | Serialises the instances as a YAML/JSON list nested under this key |

The slot name is conventional; it is typically the **plural form** of the class name (e.g. `persons` for `Person`, `isolates` for `Isolate`), but any name is valid.

### Why DataHarmonizer requires it for multi-table schemas

When a schema has more than one table class (class linked by a foreign key), DataHarmonizer uses the `Container` class to discover those tables and determine how data should be structured for JSON export and import. Specifically:

- On **JSON export**, DataHarmonizer writes a JSON object whose top-level keys are the Container slot names, each containing the list of records for that table.
- On **JSON import**, DataHarmonizer reads those same top-level keys to reconstruct the per-table data.
- The `range` on each Container slot maps a key back to the correct schema class, so the right column headers are applied to each list.

A schema that defines only a single, flat (non-linked) table class does not strictly need a Container — DataHarmonizer will construct a virtual one at runtime for backwards compatibility. Any schema that defines **two or more table classes** should include an explicit Container.

### Defining a Container for a multi-table template

Suppose a schema has three linked classes — `Sample`, `Isolate`, and `AMRTest` — forming a parent/child/grandchild chain. The Container should list all three:

```yaml
classes:

  Container:
    tree_root: true
    attributes:
      samples:
        range: Sample
        multivalued: true
        inlined_as_list: true
      isolates:
        range: Isolate
        multivalued: true
        inlined_as_list: true
      amr_tests:
        range: AMRTest
        multivalued: true
        inlined_as_list: true

  Sample:
    tree_root: false   # only Container carries tree_root
    attributes:
      sample_id:
        identifier: true
      ...

  Isolate:
    attributes:
      isolate_id:
        identifier: true
      sample_id:
        foreign_key: Sample.sample_id
      ...

  AMRTest:
    attributes:
      amr_test_id:
        identifier: true
      isolate_id:
        foreign_key: Isolate.isolate_id
      ...
```

In the Schema Editor, the Container class is created on the **Table** tab just like any other class, with `tree_root` set to `true` in the technical fields (visible in expert mode). Its slots are added on the **Field** tab as schema-level `slot` rows whose `range` points to each table class.

### Complications with multiple independent multi-table templates

LinkML's specification states that **only one class per schema should carry `tree_root: true`**. This works cleanly when a schema contains a single multi-table template (one Container, one hierarchy of linked classes).

Difficulties arise when a schema is designed to offer **several independent multi-table templates** — for example, two separate data-collection workflows that each have their own parent/child tables but share common slot definitions. In this situation:

- There is still only one Container class, so all table classes from every template must be listed as Container slots. This couples templates that are conceptually independent.
- LinkML validators (`linkml-validate`) treat the single Container as the document root and expect every data file to conform to it. A data file produced from template A will contain only template A's keys, which the validator will accept (missing keys on multivalued slots are valid). However, spurious validation warnings may appear if the validator is strict about unexpected or absent container keys.
- Some LinkML-based tooling (code generators, JSON Schema export) may generate a single combined class that does not cleanly separate the two templates.

**Practical workaround:** If two independent templates must coexist in one schema file, list all of their table classes in the shared Container and document which slots belong to which workflow. If strict separation is required, consider splitting the schema into two separate `schema.yaml` files, each with its own Container and `tree_root` class, and loading them as independent DataHarmonizer templates.