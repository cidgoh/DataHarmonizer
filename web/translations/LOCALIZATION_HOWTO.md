# DataHarmonizer Localization

"Localisation" or "internationalisation" refers to the replacement of _labels_ or _descriptions_ with its translation to a different language, driven by a user's location or choice.

In the context of the DataHarmonizer, there are three kinds of information in a template which can be localized: classes, slots, and picklists (otherwise called "enums"). Importantly, these translations do **not** affect the underlying data.

For instance, if given a dataset in English, that is localized in French, and using DataHarmonizer's picklists to change the value of a field within a translated controlled vocabulary, the dataset will maintain its corresponding English value when exported. This approach is chosen to ensure the integrity and provenance of the data remains intact. However, when loaded back into DataHarmonizer, and given it is localized into French, the French values in the application and picklist will still be displayed.

To translate classes, slots and enums, a schema-maintainer has two options: provide a _partialy or fully translated LinkML schema_ for each language a template is localized to, or create a _property-mapping_ for a template with a collection of field-language associations. Both ways of translating templates are supported, as each has pros and cons. To decide which approach to take with your instance of DataHamornizer, you can read the brief guide below.

## Translations are Combined Schemas

Before going into how to write a translated schema, or create a mapping for it, there are two things that need to be understood:

1. All schemas have a default language, defined _implicitly_.
2. All alternative schemas or mappings _override_ the default schema.
3. Schemas and mappings translate properties that are subsets of the default schema.

This leads to two gotchas to keep in mind.

- Translations cannot have more properties than those of the original schema.
- You can't translate a translation.

Although the default schema is "overriden" in the DataHarmonizer interface, it is untouched on your hard drive. Localizing the interface is also reversible: the language is picked from a menu.

## Providing a Translated Schema

Let's take a small schema.

```yaml
classes:
  Sample:
    name: 'Biological Sample'
    description: 'A biological sample'
    slots:
      - id
      - name
      - collection_date

slots:
  id:g
    description: 'The unique identifier for a sample'
  name:
    description: 'The name of the sample'
  collection_date:
    description: 'The date the sample was collected'
```

You can translate it like this, into French:

```yaml
classes:
  Sample:
    description: 'Un échantillon biologique'
slots:
  id:
    description: "L'identifiant unique pour un échantillon"
  name:
    description: "Le nom de l'échantillon"
  collection_date:
    description: "La date de collecte de l'échantillon"
```

As you can see, such a translation is _partial_. Not all class or slot descriptions were translated! But when these two translations are merged, the DataHarmonizer interface will take all the descriptions from the French translation.

If you are using templates under the `web/template` folder of the DataHarmonizer project, it must be placed into the folder of that template, under `<template name>/locales/`. The sub-folders need to have names that obey [IETF Cultural tags](https://www.venea.net/web/culture_code). For instance, a French translation for the AMBR template will be under `templates/ambr/locales/fr/schema.yaml`. For dialects or region-specific localizations, the full code works: `templates/ambr/locales/fr-CA/schema.yaml`.

DataHarmonizer will resolve to the most applicable localization, and failing that, the nearest localization that satisfies the language over the region code if not in the region. So if looking for a Canadian French localization, it will resolve to International French if only `ambr/locales/fr/schema.yaml` is available.

## Using a Property Mapping

The main tradeoff of providing a translated schema for each language-and-template is duplication. Although you can write a translation of only _some_ of the schema, to do so for many languages requires keeping track of several files at once. This is cumbersome, particularly if these translations are small, or ad-hoc to your DataHarmonizer instance.

Instead, you can use a property-mapping, like so:

```json
{
  // approach one: dot notation, reference the property you want to translate using <a>.<b>.<c> etc
  "fr": {
    "classes.Sample.description": "Un échantillon biologique",
    "slots.id.description": "L'identifiant unique pour un échantillon",
    "slots.name.description": "Le nom de l'échantillon",
    "slots.collection_date.description": "La date de collecte de l'échantillon"
  },
  // approach two: nested object gets flattened out to dot notation
  "fr-CA": {
    "classes": {
      "Sample": {
        "description": "Un échantillon biologique"
      }
    },
    "slots": {
      "id": {
        "description": "Le numéro d'identification unique d'un échantillon"
      },
      "collection_date": {
        "description": "La date à laquelle l'échantillon a été recueilli"
      }
    }
  }
}
```

Note that this approach keeps all the translations in one file. This is good when the number of properties being translated is small, but many languages must be translated.

In this case, the file for translations will be in `web/translations/translations.json`. If the translation is specific for

#### Constraints on translations

- a translation can't add more properties than the original schema has
- a translation can't modify any reference paths inside of the schema that aren't translation-related
- translations cannot be merged together (they must be direct)

### Open issues

- [ ] Should all translations be centralized in a translation folder?
- [ ] How to make the translation system use LinkML fully?
  - [ ] Schemas contain their language?
  - [ ] Schemas contain translation fields in metamodel?
  - [ ] Use inheritance mechanism for Translated Schemas instead?
  - [ ] What to use for schema m
- [ ] Use LinkML tools for reifying default schemas against translated ones or mappings?
- [ ] Which directory should `translations.json` sit in?
- [ ] Translation for DataHarmonizer interface buttons?
