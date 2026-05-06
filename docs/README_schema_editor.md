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
