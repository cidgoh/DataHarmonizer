# Loading schema.yaml Directly in the Browser

This document analyses the feasibility of replacing DataHarmonizer's pre-built `schema.json` with a runtime load-and-process pipeline that reads `schema.yaml` directly in the browser, and proposes the implementation steps required to do so.

---

## Background: The Current Pipeline

DataHarmonizer currently requires a build step before a schema can be used in the browser.

```
schema.yaml  ──►  script/linkml.py  ──►  schema.json  ──►  webpack bundle / HTTP serve
```

1. `script/linkml.py` opens `schema.yaml`, passes it through the Python `linkml-runtime` library, and writes `schema.json`.
2. Webpack's dynamic-import picks up `schema.json` from `web/templates/<folder>/schema.json` (localhost path) or the file is fetched via HTTP from the `dist/` directory (hosted path).
3. `lib/utils/templates.js → TemplateProxy.create()` calls `fetchSchema()`, which returns the parsed JSON object.
4. The schema object is stored in `template.default.schema` and accessed throughout `AppContext.js`, `DataHarmonizer.js`, and `Validator.js`.

The `schema.yaml` files are **already copied to dist** by `webpack.schemas.js` via CopyPlugin, so they are already available at `/templates/<folder>/schema.yaml` at runtime. The missing piece is processing.

---

## What `linkml.py` Does

`script/linkml.py` performs three key transformations, in order:

### 1. YAML parsing

```python
SCHEMA = yaml.safe_load(schema_handle)
schema_view = SchemaView(yaml.dump(SCHEMA))
```

Parses the YAML text and constructs a `SchemaView` object (the LinkML runtime's schema-aware wrapper).

### 2. Import resolution

```python
schema_view.merge_imports()
```

Follows every entry in the schema's `imports:` list, fetches and merges those schemas recursively. Common imports in DataHarmonizer templates:

- `linkml:types` — defines the built-in scalar types (`String`, `Integer`, `Date`, `Boolean`, etc.)
- Shared parent schemas (e.g. `grdi_core` for the GRDI template family)

After `merge_imports()`, `schema_view.schema` contains all slot, type, class, and prefix definitions from every imported schema as if they were written inline.

### 3. Inheritance flattening (induced classes)

```python
for name, class_obj in schema_view.all_classes().items():
    if schema_view.class_slots(name):
        new_obj = schema_view.induced_class(name)
        schema_view.add_class(new_obj)
```

`induced_class(name)` is the critical transformation. For each class it:

- Walks the full `is_a` ancestry chain (parent, grandparent, …)
- Collects every slot defined at each level in the hierarchy via the class's `slots:` list
- Applies each level's `slot_usage:` overrides on top of the global `slots:` definition
- Emits the result as a flat `attributes: { slot_name: { merged_definition } }` dictionary

**Before induction (schema.yaml structure)**:
```yaml
classes:
  MpoxInternational:
    is_a: dh_interface
    slots:
      - specimen_collector_sample_id
      - sample_collected_by
    slot_usage:
      specimen_collector_sample_id:
        required: true
        rank: 1
```

**After induction (schema.json structure)**:
```json
"classes": {
  "MpoxInternational": {
    "attributes": {
      "specimen_collector_sample_id": {
        "name": "specimen_collector_sample_id",
        "title": "Specimen Collector Sample ID",
        "range": "WhitespaceMinimizedString",
        "required": true,
        "rank": 1,
        "description": "...",
        ...
      },
      "sample_collected_by": { ... }
    }
  }
}
```

The `attributes` dict is what every consumer inside DataHarmonizer iterates:

| Consumer | Access pattern |
|----------|---------------|
| `AppContext.js` | `schema.classes[template_name].attributes` |
| `AppContext.js` | `schema.classes['Container'].attributes` (to discover all template classes) |
| `Validator.js` | `this.#targetClass.attributes` (iterated to build induced slot map) |
| `DataHarmonizer.js` | `this.schema.classes[this.template_name]` (columns) |

Additionally:

- `schema.slots` — global slot registry, used as base layer in `Validator.js`'s manual re-merge
- `schema.enums[name].permissible_values` — picklist validation and dropdowns
- `schema.types[name].uri` — XSD type URIs for `Datatypes` parser
- `schema.prefixes[name].prefix_reference` — CURIE expansion in `DataHarmonizer.js`
- `schema.extensions.locales.value` — DH-specific locale/translation extension data

---

## What Already Exists on the JavaScript Side

### `yaml` npm package

The project already depends on `yaml` v2.8.0 (listed in `package.json`). `DataHarmonizer.js` already imports it:

```javascript
import YAML from 'yaml';
```

Parsing a schema.yaml text string in the browser is therefore a one-liner:

```javascript
const schema = YAML.parse(text);
```

### `buildTemplateFromUploadedSchema()` in `templates.js`

This function (used when the Schema Editor uploads a file) already accepts a raw schema object (no induction required for the upload path, because the Schema Editor works with the raw YAML structure). For normal data templates, however, the calling code paths depend on `attributes` being fully induced.

### `Validator.js` partial re-merge

`Validator.useTargetClass()` already performs a three-way merge at runtime:

```javascript
this.#targetClassInducedSlots[slotName] = Object.assign(
  {},
  this.#schema.slots?.[slotName],          // global slot definition
  this.#targetClass.slot_usage?.[slotName], // class-level override
  this.#targetClass.attributes[slotName]   // induced attributes (from JSON)
);
```

This code was added because `gen-linkml --materialize-attributes` did not merge correctly from the LinkML side. It shows the pattern already exists in JS — the challenge is doing the equivalent for `AppContext.js`'s column-building path, which relies on `attributes` being pre-populated.

---

## Required Transformations to Implement in JavaScript

### Step 1 — Fetch and parse YAML

```javascript
async function loadYamlSchema(folder) {
  const text = await fetch(`/templates/${folder}/schema.yaml`).then(r => r.text());
  return YAML.parse(text);
}
```

The schema YAML text is already served from dist (via webpack CopyPlugin). No changes to webpack are needed for fetching.

### Step 2 — Resolve imports

`merge_imports()` is the most complex transformation to reproduce. Most DataHarmonizer schemas import from two sources:

**a. `linkml:types`** — defines `String`, `Integer`, `Float`, `Boolean`, `Date`, `Datetime`, `Time`, `Uri`, `Uriorcurie`, and related scalars. Because these are needed frequently and never change, they can be **baked into a JS constant** rather than fetched:

```javascript
// lib/utils/linkml_types.js
export const LINKML_BUILTIN_TYPES = {
  string:  { uri: 'xsd:string',   base: 'str' },
  integer: { uri: 'xsd:integer',  base: 'int' },
  float:   { uri: 'xsd:float',    base: 'float' },
  boolean: { uri: 'xsd:boolean',  base: 'Bool' },
  date:    { uri: 'xsd:date',     base: 'XSDDate' },
  datetime:{ uri: 'xsd:dateTime', base: 'XSDDateTime' },
  time:    { uri: 'xsd:time',     base: 'XSDTime' },
  uri:     { uri: 'xsd:anyURI',   base: 'URI' },
  // ... (full list from linkml-model/types.yaml)
};
```

**b. Schema-relative imports** — e.g. `imports: [../../grdi_core/schema]`. These need to be fetched relative to the current schema's URL, parsed, and merged. A simple recursive fetch resolves these:

```javascript
async function resolveImports(schema, baseUrl) {
  for (const imp of (schema.imports || [])) {
    if (imp === 'linkml:types') {
      // merge LINKML_BUILTIN_TYPES into schema.types
      continue;
    }
    const importUrl = new URL(imp.replace(/\.(yaml)?$/, '') + '.yaml', baseUrl).href;
    const importedSchema = YAML.parse(await fetch(importUrl).then(r => r.text()));
    await resolveImports(importedSchema, importUrl); // recurse
    mergeSchemas(schema, importedSchema);
  }
}
```

`mergeSchemas()` needs to combine `slots`, `enums`, `types`, `prefixes`, and `subsets` from the imported schema into the main one (not overwriting, since the main schema's own definitions take precedence).

### Step 3 — Induce classes (flatten inheritance)

This is the core transformation. For each class with slots, produce an `attributes` dictionary equivalent to `SchemaView.induced_class()`:

```javascript
function induceClass(schema, className) {
  // Collect the is_a chain: [GreatGrandparent, ..., Parent, ClassName]
  const chain = [];
  let current = className;
  while (current) {
    chain.unshift(current);
    current = schema.classes[current]?.is_a ?? null;
  }

  const attributes = {};

  for (const ancestorName of chain) {
    const ancestor = schema.classes[ancestorName];
    if (!ancestor) continue;

    // Each slot listed in this class's 'slots:' array gets merged
    for (const slotName of (ancestor.slots || [])) {
      const globalSlot  = schema.slots?.[slotName] ?? {};
      const slotUsage   = ancestor.slot_usage?.[slotName] ?? {};
      attributes[slotName] = Object.assign(
        {},
        attributes[slotName] ?? {},   // already accumulated from ancestors
        globalSlot,
        slotUsage
      );
      attributes[slotName].name = slotName;
    }

    // Class-level attributes (defined directly, not via slots list) are merged as-is
    for (const [name, def] of Object.entries(ancestor.attributes ?? {})) {
      attributes[name] = Object.assign({}, attributes[name] ?? {}, def);
      attributes[name].name = name;
    }
  }

  return attributes;
}
```

Then for each class in the schema:

```javascript
function induceAllClasses(schema) {
  for (const className of Object.keys(schema.classes)) {
    if (schema.classes[className].slots?.length ||
        Object.keys(schema.classes[className].attributes ?? {}).length) {
      schema.classes[className].attributes = induceClass(schema, className);
    }
  }
}
```

### Step 4 — Handle `in_language` coercion

`linkml.py` has an explicit workaround for this:

```python
if 'in_language' in SCHEMA:
    schema_view.schema['in_language'] = SCHEMA['in_language']
```

In JS, YAML.parse preserves arrays faithfully, so no workaround is needed — this issue is Python-library-specific.

---

## Where to Hook Into the Existing Code

The single integration point is `fetchSchema()` in `lib/utils/templates.js`. Currently:

```javascript
async function fetchSchema(path) {
  if (window.location.href.startsWith('http://localhost:') || ...) {
    const schema_path = path.replace(/\/templates\/(.+)\/schema.json/, '$1');
    return await getSchema(schema_path);   // webpack dynamic import of .json
  } else {
    return await fetchFileAsync(path);     // HTTP fetch of .json
  }
}
```

**Proposed change**: attempt to load `schema.yaml`, process it, and fall back to `schema.json` if YAML is not available:

```javascript
async function fetchSchema(path) {
  const yamlPath = path.replace(/schema\.json$/, 'schema.yaml');
  try {
    const text = await fetch(yamlPath).then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
    const schema = YAML.parse(text);
    const baseUrl = new URL(yamlPath, window.location.href).href;
    await resolveImports(schema, baseUrl);
    induceAllClasses(schema);
    return schema;
  } catch (_) {
    // Fall back to pre-built schema.json
    if (window.location.href.startsWith('http://localhost:') || ...) {
      const schema_path = path.replace(/\/templates\/(.+)\/schema.json/, '$1');
      return await getSchema(schema_path);
    } else {
      return await fetchFileAsync(path);
    }
  }
}
```

No other file needs to change — `template.default.schema` downstream is consumed identically regardless of source.

---

## Known Gaps and Edge Cases

| Area | Status | Notes |
|------|--------|-------|
| YAML parsing | Ready | `yaml` npm package already imported |
| `linkml:types` import | Requires a baked-in constant | The canonical types list is stable; rarely changes |
| Schema-relative imports | Requires async fetch loop | URL resolution works with standard `URL()` |
| `is_a` chain flattening | Requires JS implementation | Single-level and two-level `is_a` cover 99% of DH schemas |
| `slot_usage` override merge | Requires JS implementation | Same merge pattern Validator.js already uses |
| `unique_keys` on classes | No change needed | YAML structure matches JSON; no transformation required |
| `foreign_key` annotations | No change needed | Passed through as-is in both formats |
| `extensions.locales.value` | No change needed | YAML structure matches JSON |
| `in_language` array | No change needed | YAML.parse preserves arrays; Python issue does not apply |
| Circular `is_a` references | Edge case | Guard against infinite loops in chain-walking |
| Remote imports (URLs) | Requires CORS-compliant server | Schemas importing from external HTTPS URLs need CORS headers |

---

## Benefits of the Direct YAML Approach

1. **Eliminates the build step** for schema authors: edit `schema.yaml`, reload the browser — no `linkml.py` run needed.
2. **Removes Python `linkml-runtime` as a build dependency** for end-users deploying their own schemas.
3. **Simpler schema distribution**: ship only `schema.yaml`; the `.json` is no longer required in the dist package.
4. **Live schema editing**: the Schema Editor could save a `schema.yaml` and reload it immediately without a Python step (useful for local development mode).
5. **Consistency**: the same schema source file is used for both browser display and any downstream LinkML tooling.

## Costs and Risks

1. **Increased initial page load time**: YAML fetch + import resolution + induction runs on every page load vs. one pre-built JSON import.
2. **Import fetch failures**: if an imported schema URL is unreachable (e.g. offline use, CORS), induction fails. The fallback to `schema.json` mitigates this.
3. **JS induction vs Python induction gap**: the Python `SchemaView.induced_class()` handles edge cases (multiple inheritance via `mixins:`, `apply_to:`, abstract classes). A JS re-implementation would need to be validated against the full DH schema corpus.
4. **`linkml:types` baked-in constant** must be kept in sync with the upstream `linkml-model` project if types are added or changed.

---

## Recommended Implementation Order

1. **Add `lib/utils/schema_induction.js`** containing `resolveImports()`, `induceAllClasses()`, `induceClass()`, and the `LINKML_BUILTIN_TYPES` constant.
2. **Modify `fetchSchema()` in `lib/utils/templates.js`** to try YAML first, fall back to JSON.
3. **Validate** by running the existing test suite with the YAML load path active on the `grdi`, `mpox`, and `grdi_1m` schemas (these cover single-class, multi-class, and 1-to-many hierarchies).
4. **Optionally deprecate** the `script/linkml.py` step from the schema publishing workflow once the YAML path has been validated against all production schemas.
