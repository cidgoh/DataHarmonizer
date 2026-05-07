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

## `tabular_to_schema.py` — Legacy Schema Build Tool

`script/tabular_to_schema.py` was the previous way of assembling a complete DataHarmonizer `schema.yaml` from spreadsheet-based source files. It combines three inputs:

| Input file | Contents |
|------------|----------|
| `schema_core.yaml` | Base schema skeleton: class definitions, shared slot stubs, enum stubs, prefixes, types, and settings |
| `schema_slots.tsv` | One row per slot (field), with columns for all slot attributes (title, range, required, pattern, etc.) |
| `schema_enums.tsv` | One row per permissible value, with columns for enum name, value text, title, and description |

The script reads the TSV files, populates the slot and enum structures from `schema_core.yaml`, and writes a single combined `schema.yaml` that the DH runtime (or `linkml-runtime SchemaView`) can consume.

This approach is being superseded by the **built-in Schema Editor** — a DataHarmonizer template that lets authors load, edit, and save `schema.yaml` files directly in the browser without any Python build step. See `README_schema_editor.md` for usage.
