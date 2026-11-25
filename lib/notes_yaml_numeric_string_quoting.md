# YAML Numeric / String Quoting in DataHarmonizer Read & Write

## Background

LinkML `permissible_values` dictionaries frequently use numeric-looking strings as keys and
field values (e.g. software version numbers `6.02`, integer codes `1`).  YAML's type-inference
rules mean that unquoted scalars like `6.02` are parsed as floating-point numbers, not strings.
This causes runtime errors in DataHarmonizer when downstream code expects `pv.text` to be a
string.

---

## yaml npm package quoting behaviour (empirically verified)

Schema files are written with `YAML.stringify(obj, { singleQuote: true })`.
The table below shows how the package treats JS string values:

| JS value (string) | Written to YAML | Re-read as |
|---|---|---|
| `'1'` | `'1'` ← single-quoted | string `'1'` ✓ |
| `'6.02'` | `'6.02'` ← single-quoted | string `'6.02'` ✓ |
| `'1.6.9'` | `1.6.9` ← unquoted | string `'1.6.9'` ✓ |
| `'2.0.0'` | `2.0.0` ← unquoted | string `'2.0.0'` ✓ |
| `'true'` / `'false'` | `'true'` ← single-quoted | string ✓ |
| `'null'` | `'null'` ← single-quoted | string ✓ |
| `'yes'` / `'no'` | `yes` / `no` ← unquoted | string ✓ (yaml v2 uses YAML 1.2; `yes`/`no` are not booleans) |
| `'hello world'` | `hello world` ← unquoted | string ✓ |
| `'1abc'` | `1abc` ← unquoted | string ✓ |

The same quoting rules apply to **dictionary keys**:

| JS string key | Written as YAML key |
|---|---|
| `'1'` | `'1':` |
| `'6.02'` | `'6.02':` |
| `'1.6.9'` | `1.6.9:` |
| `'2.0.0'` | `2.0.0:` |
| `'true'` | `'true':` |
| `'hello'` | `hello:` |

**Key insight**: the yaml package is selective — it only quotes strings that would be
parsed back as a different type (integer, float, boolean, null).  Multi-part version
strings (`1.6.9`, `2.0.0`) have two dots and cannot be parsed as IEEE floats, so they
are safely left unquoted with no information loss.

---

## The actual bug and fix

The yaml package writes a JS **number** as an unquoted scalar (correct representation of
that number).  The bug occurs when a numeric-looking value is stored in the schema object
as a JS number rather than a string — typically caused by round-tripping through YAML
without quotes:

```
YAML file:  text: 6.02          ← no quotes → yaml.parse → pv.text = 6.02 (number)
Re-save:    YAML.stringify({text: 6.02}) → text: 6.02   ← still no quotes
Re-read:    pv.text = 6.02 (number) → typeof pv.text !== 'string' → runtime error
```

### Fixes applied

**`lib/AppContext.js` — `reload()` permissible-value backfill**

The old condition `else if (!pv.text)` only triggered when `pv.text` was falsy.  Numbers
like `6.02` and `1` are truthy, so they bypassed the coercion.  Fixed to:

```javascript
} else if (typeof pv.text !== 'string') {
    pv.text = (pv.text != null && pv.text !== '') ? String(pv.text) : pv_key;
}
```

**`lib/AppContext.js` — `setSlotRangeLookup()`**

Added a last-resort coercion for numeric `pv.text` values that survive the backfill, so
they are silently fixed rather than skipped.  Retained the separate `badKeys` path for
truly null entries (duplicate YAML keys), with a distinct message for each case.

**`lib/SchemaEditor.js` — `_buildSchemaYaml()` PermissibleValue case**

```javascript
record.text = String(record.text ?? '');
```

Added before `record.text` is used as the dict key and before `copyAttributes` writes it
to `target_obj.text`.  This ensures the yaml package sees a JS string and quotes it
when necessary, breaking the bad round-trip cycle.

---

## Summary rule

> As long as a field value is a **JS string**, `YAML.stringify` with `singleQuote: true`
> handles quoting automatically and conservatively.  No manual quoting logic is needed.
> The only failure mode is when a value is stored as a JS **number** — the fix is to
> `String()` it before it enters the schema object or the YAML serialiser.
