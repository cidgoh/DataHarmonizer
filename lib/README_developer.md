# DataHarmonizer — Developer Notes

Architectural decisions, design patterns, and non-obvious implementation details
for contributors working on the DataHarmonizer codebase.

See also:
- `README_technical.md` — deep-dives on specific subsystems (min/max constraints,
  delete-key behaviour, application modes, FieldMapper, …)
- `README_tests.md` — Playwright test patterns and HOT DOM interaction guide

---

## The Container class and `tree_root` in LinkML schemas

### LinkML background

LinkML allows exactly one class per schema to carry `tree_root: true`. This flag
designates the single hierarchic top-level class: every other class in the schema
is either nested under it or exists as a free-floating definition with no direct
relationship to the loaded data. Practically, `tree_root` tells LinkML tooling
(validators, code generators, serialisers) where the document root is.

### How DataHarmonizer uses it

DataHarmonizer uses a class named **`Container`** as the `tree_root`. Its sole
job is to act as the envelope that holds all user-visible data tabs. Concretely,
`Container` gets one `multivalued`, `inlined_as_list` attribute per non-root class
in the schema — one per tab the user sees. This matches the LinkML-prescribed
idiom for a document that contains a list of records from one or more classes.

Example (auto-generated on schema save):

```yaml
classes:
  Container:
    name: Container
    tree_root: true
    attributes:
      CanCOGeNCovid19:
        name: CanCOGeNCovid19
        range: CanCOGeNCovid19
        multivalued: true
        inlined_as_list: true
```

### Automatic management

The `Container` class and its attributes are **fully managed by the Schema
Editor** — users never see or edit it directly. On every schema save
(`SchemaEditor._buildSchemaYaml()`), the Container class is rebuilt from scratch
based on which classes exist in the schema. No manual maintenance is needed.

The only user-visible surface is the **"Root Table" column** on the Schema tab
(the rightmost column). This lets a user rename the container class from
`Container` to something else if their organisation has a naming convention that
requires it. The value defaults to `Container` via an `ifabsent` declaration on
the `root_class` slot and is injected at runtime by
`SchemaEditor._injectRootClassSlot()` — it does not live in the on-disk DH_LinkML
schema files.

### Why `root_class` is runtime-injected, not on disk

`root_class` is a DataHarmonizer UI convenience field. It has no equivalent in
the LinkML meta-model for a `Schema` object, so storing it in the DH_LinkML
schema YAML files would produce an invalid LinkML meta-schema. Instead,
`SchemaEditor._injectRootClassSlot()` inserts the attribute definition directly
into `schema.classes.Schema.attributes` during the `SchemaEditor` constructor,
before `AppContext.makeDHsFromRelations()` builds the Handsontable columns. This
means `useTemplate()` sees the slot as if it had always been in the schema, with
no HOT re-render required.

### Summary

| Concern | Behaviour |
|---|---|
| Default container class name | `Container` (via `ifabsent: string(Container)`) |
| `tree_root: true` placement | Set on the Container class on every schema save |
| User control | "Root Table" column on Schema tab |
| Container attributes (one per tab) | Auto-generated on save; never stored between saves |
| `root_class` slot definition | Runtime-injected by `_injectRootClassSlot()`; absent from disk |

---
