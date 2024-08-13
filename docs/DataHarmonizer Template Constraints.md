# DataHarmonizer Constraints on Templates

DataHarmonizer interoperates with LinkML in several ways. Its templates employ LinkML-derived schemas, and it can save datasets in formats compatible with LinkML, including LinkML schemas themselves! Further, templates contain internationalized

Not all of these features are supported directly by the LinkML metamodel.

The JSONPath queries are written in [Jayway JSONPath](https://github.com/json-path/JsonPath/).

## General constraints
This section documents important anti-assumptions made in the schema, particularly regarding string formats and their relation to other. It also documents DataHarmonizer specific concepts such as `dh_interface` and `Container` which is present within our templates.
- When the `range` in a slot is generalized to multiple concepts in `classes`, it is replaced with an `any_of` property with a list referencing several concepts, in both `attributes` and `slot_usage`.
```json
{
"any_of": [
        {
            "range": "GRDISample"
        },
        {
            "range": "null value menu"
        }
    ]
}
```

## File Export
- [ ] JSON Saving:
    - "Save As... JSON" files have the following top-level properties, marked necessary or optional below:
        - in_language (optional)
        - Container   (necessary)
        - schema      ()
        - version
        - location
    - Documented in the function `importJsonFile` in `@/lib/utils/files`.
    - DataHarmonizer should support importing array of structs nonetheless.

## Internationalisation constraints
- Currently, the constraint on permissible_values in enums where the key must equal "text" in the metamodel is lifted.
  - This is to make our current internationalisation strategy simple without having to code for many corner cases.
  - In the future, this will be enforced again, separating e.g. French and default language values into "title" and "text", where text matches the key in the enum.
  - Example templates: 
    - canada_covid19/CanCOGeN_Covid-19/locales/fr/schema.json

## 1-M enabling constraints
- In a child class, a `range` in slots documented in `slot_usage` and `attributes` for a class in `classes` is 1-M when it references another class in `classes`.
```jsonpath
$.classes.*.slot_usage[?(@.range in $.classes.keys())]
```
  - The reference is singular.
  - Example templates: 
    - grdi/GRDISample
    - schema/SchemaEditor