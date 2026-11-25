# Viability: list_delimiter as Internal Delimiter

## Background

`list_delimiter` is a LinkML schema-level annotation (e.g. `annotations: list_delimiter: '|'`) that
declares the multivalued delimiter for a schema's files.  As of this writing DataHarmonizer uses it
only at the **save boundary**: the internal representation always uses `;`, data files are normalised
to `;` on load, and converted back to `|` on save via `dh._saveDelimiter`.

The question is whether `list_delimiter` could instead drive the **internal** delimiter so that grid
cells display the declared separator directly.

---

## Current Architecture

```
MULTIVALUED_DELIMITER = ';'   ← module-level constant in lib/utils/fields.js
dh._schemaDelimiter            ← set at schema load from list_delimiter annotation
dh._saveDelimiter              ← controls save path only ('|' or undefined ≡ ';')
```

Load pipeline: `|`-delimited cells → normalised to `;` → stored in HOT grid
Save pipeline: `;` in grid → converted to `dh._saveDelimiter` (or `;`) in output file

---

## Where Internal `;` Is Controlled

| Location | Mechanism | Notes |
|---|---|---|
| `lib/utils/fields.js:8` | Constant definition | Single source |
| `lib/DataHarmonizer.js` (most uses) | Import of constant | ~6 usages |
| `lib/DataHarmonizer.js:316` | **Hardcoded `';'`** | Search/filter split |
| `lib/DataHarmonizer.js:3286` | **Hardcoded `';'`** | Explicitly flagged `// ISSUE: relying on semicolon delimiter in input` |
| `lib/DataHarmonizer.js:3372, 3376` | **Hardcoded `'; '`** | With trailing space — inconsistent |
| `lib/DataHarmonizer.js:3971` | **Hardcoded `';'`** | Date range validation |
| `lib/Validator.js` | Constructor parameter | **Already parameterised** — DH passes `MULTIVALUED_DELIMITER` at init |
| `lib/editors/KeyValueEditor.js` | Import of constant | Both renderer and editor split/join on it |
| `lib/utils/i18n.js:95` | Import of constant | Default value splitting |
| `web/templates/*/export.js` | **All hardcoded `';'`** | Schema-specific files outside core |

---

## Required Changes for Full Refactor

1. **Module constant → per-instance property**
   Replace every `MULTIVALUED_DELIMITER` reference in `DataHarmonizer.js` with `this.delimiter`
   (or a getter that returns `this._schemaDelimiter ?? ';'`).  Most call sites already have a `dh`
   reference so the threading is straightforward.

2. **Fix 4 hardcoded `';'` in DataHarmonizer.js**
   Lines 316, 3286, 3372/3376, 3971 — easy once located.

3. **KeyValueEditor / renderers**
   Registered as HOT cell types, not per-DH instances.  The delimiter would need to be injected via
   cell metadata or a closure at registration time.  Requires care but no fundamental redesign.

4. **Validator**
   Already parameterised — pass `dh.delimiter` instead of the constant.  One-line change.

5. **Schema `export.js` files**
   Owned by schema maintainers.  Would need a migration guide or a compatibility import of the
   constant from `fields.js`.  Outside the core codebase.

---

## Viability: Medium Effort

The refactor is feasible but non-trivial — roughly 20+ locations across 6+ files plus all
schema-specific export files.

**When the full refactor is NOT needed:**
The current load-normalise / save-convert approach is fully correct for round-tripping files.
The only observable difference is cosmetic: grid cells show `termA;termB` instead of `termA|termB`.

**When the full refactor IS worthwhile:**
If users editing in the grid should see the separator declared by the schema (e.g. `|`) rather than
the internal `;`, the refactor is required.

---

## Recommended Incremental Path (if pursued)

1. Add `get delimiter() { return this._schemaDelimiter ?? MULTIVALUED_DELIMITER; }` to
   `DataHarmonizer.js`.
2. Fix the 4 hardcoded `;` spots in `DataHarmonizer.js`.
3. Pass `dh.delimiter` to `Validator` constructor instead of `MULTIVALUED_DELIMITER`.
4. Update `KeyValueEditor` to accept delimiter via cell metadata.
5. Update load normalisation in `Toolbar.js` to normalise to `dh.delimiter` instead of always `;`.
6. Update save conversion in `Toolbar.js` to use `dh.delimiter` as the baseline.
7. Document the change for schema export.js maintainers.
