# DataHarmonizer User Manual

DataHarmonizer is a browser-based spreadsheet editor for standardised data collection and validation. It presents one or more data-entry templates as tabbed spreadsheets, enforces schema constraints during editing, and can export data to multiple formats.

---

## Running DataHarmonizer

DataHarmonizer is designed to be a **stand-alone web browser application** — no server-side software is required to use it. There are three standard ways to run it.

### 1. Stand-alone (open index.html directly)

The simplest way. After a distribution build (see below), open the `web/dist/index.html` file directly in any modern browser. No installation, no server, no network access required.

- The default menu of templates is loaded from the bundled `menu.json`.
- The **first template in the menu** is loaded automatically on startup.
- All template data (schema, picklists, validation rules) is bundled into the distribution at compile time.

**What "compile time" means:**
Each template originates as a set of LinkML class definitions stored in `web/templates/<name>/schema.yaml` within the DataHarmonizer GitHub repository. Running `yarn build:web` in the project root compiles these into the self-contained `web/dist/` distribution folder. The resulting `web/dist/` folder (containing `index.html`, bundled JavaScript, and the template files) is what gets distributed or deployed.

### 2. Served from a web server

For team or public deployment, copy the `web/dist/` folder to any standard web server (Apache, Nginx, GitHub Pages, etc.) as the site root or a subfolder. No server-side code is needed — the server only serves static files.

Users navigate to the URL, and the application loads exactly as in the stand-alone case. This mode also enables the YAML schema loading path (described in the next section).

### 3. Development environment (`yarn dev`)

For schema developers and contributors:

1. Clone the repository and run `yarn install` to install dependencies.
2. Run `yarn dev` in a console window.
3. Open a browser and navigate to `http://localhost:8080` (the port may differ; webpack prints the exact URL).

The dev server uses webpack's hot-module-replacement so edits to templates, schema files, or application code are reflected in the browser immediately without a full rebuild.

---

## Schema Loading: YAML and JSON

### Background

Each template's schema is defined in `schema.yaml`. DataHarmonizer can load this file **directly at runtime** (no Python build step required), making it possible to edit `schema.yaml` and see the changes immediately by refreshing the browser. A pre-compiled `schema.json` can also be present as a fallback; it is produced either by the Python `script/linkml.py` tool or by the Node utility `script/induce_schema.cjs`.

### How schema loading works in each run mode

**Served from a web server (modes 2 and 3)**

When the application is running under any `http://` or `https://` origin (including `localhost`), schema loading follows this order:

1. **Try `schema.yaml`** — fetched directly from the server at `templates/<name>/schema.yaml`. The browser parses and processes it using `schema_induction.js`, which resolves `linkml:types` built-ins and merges the full inheritance chain (`is_a` / `slot_usage`) into each class's `attributes`. This is the preferred path and requires no pre-build step.
2. **Fall back to `schema.json`** — if the YAML fetch fails (file absent, server error, etc.), the application fetches `templates/<name>/schema.json` instead. This file must have been generated previously by `script/linkml.py` or `script/induce_schema.cjs`.

Both files are copied into `web/dist/templates/<name>/` by the build process whenever they exist in the repository.

**Stand-alone / `file://` protocol (mode 1)**

When `index.html` is opened directly from the filesystem, browsers block `fetch()` requests to other local files, so the HTTP path above is unavailable. Instead the application uses webpack-bundled copies loaded at build time:

1. **Try bundled `schema.json`** — if `schema.json` was present at the time `yarn build:web` ran, webpack includes it as a lazy JavaScript chunk. This is the preferred file:// path.
2. **Fall back to bundled `schema.yaml`** — if `schema.json` is absent, webpack also bundles `schema.yaml` as a raw-text chunk (via webpack `asset/source`). The application processes it synchronously using the same induction logic (resolving `linkml:types` and computing class attributes). This means templates can be used stand-alone even if only `schema.yaml` is present in the repository — the next `yarn build:web` will bundle it.

> **Tip:** To test a newly edited `schema.yaml` in stand-alone mode without committing or running `script/linkml.py`, simply run `yarn build:web` again. The updated `schema.yaml` will be rebundled. For quicker iteration, use mode 3 (`yarn dev`) where YAML is fetched live on every page reload.

### Uploading a template at runtime

**File → Upload Template** accepts both `.json` and `.yaml` schema files from your local machine. A `.yaml` file is processed through the same induction logic, so the schema is fully resolved before being used — no separate build step is needed.

---

## Templates and the Template Selector

A **template** is a single data-entry view built from one LinkML class. A schema can define multiple templates from different classes, each appearing as a separate entry in the template selector. The toolbar's template dropdown lets you switch between them.

### Example: Mpox — two templates, one schema

The Mpox schema (`web/templates/mpox/schema.yaml`) contains two classes that each produce a distinct template:

| Template | Class | Purpose |
|----------|-------|---------|
| **Mpox** | `Mpox` | Canadian national specification |
| **MpoxInternational** | `MpoxInternational` | International submission specification |

Both classes `is_a: dh_interface` — they are independent siblings, not parent and child, so they do not share data across tabs. They do share many of the same underlying schema-level slots (fields), but each class selects its own subset and can override field properties (order, constraints, picklist options) through `slot_usage`. For example, `MpoxInternational` adds fields like `geo_loc_latitude`, `geo_loc_longitude`, `lineage_clade_name`, and `pathoplexus_accession` that the Canadian template omits, while both share core fields like `specimen_collector_sample_id`, `sample_collected_by`, and `organism`.

Selecting a template from the dropdown reloads the spreadsheet columns for that class. Data already in the grid is replaced, so save before switching.

---

## The Spreadsheet Interface

Each template is displayed as a **Handsontable** spreadsheet. Column headers appear in two rows:

- **Top row (section):** the `slot_group` name that groups related fields — e.g. "Database Identifiers", "Sample collection and processing", "Host information".
- **Bottom row (field):** the field title. Required fields are highlighted. Hovering over a header shows the field description, examples, and comments from the schema.

The **first column is frozen** (pinned) so it remains visible while scrolling horizontally.

---

## CRUD Operations

### Creating rows

**Add rows at the bottom** — click the **+** button in the footer, or type in the last empty row. The footer lets you specify how many rows to add.

**Insert a row above or below a specific row** — right-click any cell and choose **Insert row above** or **Insert row below**. In 1-to-many (multi-table) schemas, newly inserted rows in a child table are automatically pre-filled with the foreign-key value from the currently selected parent row.

**Paste from clipboard** — standard Ctrl/Cmd-V paste works across any selected range. Paste from an Excel selection to fill multiple rows and columns at once.

### Reading and navigating data

**Jump to a field** — use the **Settings** menu → **Jump to field** to open a search-as-you-type field picker. Selecting a field name scrolls the grid to that column.

**Show/hide columns** — the **Settings** menu offers:
- **Show all columns** — restores all hidden columns.
- **Show required columns only** — hides optional columns.
- **Show recommended columns** — shows required plus recommended columns.
- Individual **section toggles** — show or hide the columns belonging to a named section.

**Filter within a column** — click the dropdown arrow in any column header to filter rows by condition or value. This uses Handsontable's built-in filter panel.

**Help sidebar** — click the **?** button (or the field name in the header) to open a side panel with the full description, examples, and comments for the focused column.

### Updating cells

**Type directly** in any cell. Cells with picklist values open a dropdown showing all permissible values; start typing to filter the list.

**Fill a column** — open **Settings** → **Fill column** to select a field and a value; every row in the grid is set to that value. Useful for batch-applying a common value (e.g. `sample_collected_by` when all samples are from one lab).

**Modify a primary or unique key** — key fields that form a record's unique identifier cannot be edited inline. Right-click the row and choose **Change primary key** (if present) to enter the corrected value safely. DataHarmonizer checks for duplicates and, in 1-to-many schemas, cascades the change to dependent child rows.

**Undo / Redo** — Ctrl/Cmd-Z and Ctrl/Cmd-Y undo and redo individual cell changes.

### Deleting rows

Right-click any row → **Remove row**. If the schema has 1-to-many relationships and the row has dependent child records, a warning dialog lists the records that would also be deleted. Confirm to proceed; this action cannot be undone.

---

## Validation

Click the **Validate** button in the toolbar. DataHarmonizer checks every cell against the schema rules:

- **Required** fields must not be empty.
- **Pattern** constraints (regular expressions) must match.
- **Range** constraints (numeric min/max, date formats) must be satisfied.
- **Picklist** fields must contain a value from the enumeration.
- **Identifier uniqueness** — columns with `identifier: true` must contain unique values.
- **Unique key combinations** — composite keys declared in `unique_keys` must be unique across rows.
- **Foreign key references** (in 1-to-many schemas) — child values must exist in the parent table.

Invalid cells are highlighted in red. Click a highlighted cell to see the validation error in the status bar. Validation runs against the full dataset, not just visible rows.

---

## Exporting Data

Open the **File** menu → **Export To...** to choose a format:

- **TSV** — tab-separated values, one header row of field titles.
- **CSV** — comma-separated values.
- **XLSX** — Excel workbook. Multi-table (1-to-many) schemas export each template as a separate sheet.
- **JSON** — structured JSON matching the schema's Container class.
- Template-specific **custom export** formats may also appear (defined in the template's `export.js`).

If the grid contains invalid cells, DataHarmonizer warns you before exporting. You can choose to export anyway or return and fix errors first.

---

## Loading Data Files

Open the **File** menu → **Open** (or drag a file onto the grid) to load an existing data file. Supported formats: `.tsv`, `.csv`, `.xlsx`, `.xls`, `.json`.

DataHarmonizer matches the incoming file's column headers to the schema's field names (by `slot.name` first, then by `slot.title`). If all headers match, the data loads directly. If any columns cannot be matched automatically, the **Field Mapper** popup opens.

---

## Field Mapper: Resolving Header Mismatches

When a loaded file has column headers that do not exactly match the schema's field names or titles, the Field Mapper dialog appears automatically. This happens when:

- A data file was created against an older or different schema version.
- The file uses different column naming conventions.
- Columns have been reordered.

### Reading the mapping table

The dialog displays a two-column table for each template in the schema:

| Left column (schema) | Right column (data file) |
|----------------------|--------------------------|
| Each schema field, numbered in order, grouped by section | The corresponding data-file column header, if matched |

Rows are colour-coded:
- **Matched rows** — both columns have a value; a matched column shown with a different number from the schema position is highlighted to indicate a reordering.
- **Mismatched schema rows** — the left side has a field name but the right side is empty — no data column was found for this schema field.
- **Mismatched data rows** — the right side has a column name that could not be matched to any schema field.

A **"Concise view"** checkbox hides matched rows so you can focus only on the mismatches.

### Resolving mismatches by drag and drop

Unmatched data-file column names appear on the right side as **draggable items** (highlighted in a different colour). To map a data column to a schema field:

1. Locate the schema field row (left column) that should receive the data.
2. Find the data column name (right column) in the mismatched area.
3. **Drag** the data column name vertically and **drop** it onto the target schema row's right-side cell.

On drop, the two cell labels swap — the data column name moves into the schema field's row, and the schema field's row now shows the data column it will be read from. A successful drop is confirmed by a colour change on the dropped cell (light blue).

Only right-column (data-file) items are draggable. Schema-field names on the left are fixed anchors.

### Loading the mapped data

Once you have assigned data columns to all schema fields you care about (unmapped fields will be left empty), click **Mapping complete**. DataHarmonizer reads the file using the drag-drop assignments and loads the result into the spreadsheet tabs.

Not all fields need to be mapped; any schema field left without a data-column assignment simply imports as blank.

### Saving a mapping profile

If you expect to load similarly structured files in the future, save the current drag-drop arrangement as a named profile:

1. Type a name in the **Profile name** text field (e.g. `LabSystemA_v2 to Mpox_8.5`).
2. Click **Save profile**.

The profile is stored in the browser's `localStorage` under a key scoped to the current schema name. It persists across browser sessions on the same machine.

### Loading a saved profile

When the Field Mapper opens for a subsequent file load:

1. The **Saved profiles** dropdown lists all profiles previously saved for this schema.
2. Select a profile name. The drag-drop table is immediately re-arranged to reflect the saved mappings.
3. Verify that the mappings still make sense for the new file, adjust as needed, then click **Mapping complete**.

### Deleting a profile

Select the profile in the dropdown, then click **Delete profile**. The profile is removed from `localStorage`. This does not affect any data currently in the grid.

### Resetting the mapping

Click **Reset** to discard any drag-drop changes made in the current session and restore the table to its auto-detected state (as it appeared when the file was first loaded).

---

## Clearing Data

**File** → **New** clears all data from the active template's grid. A confirmation dialog appears first. In a 1-to-many multi-table schema, **New** clears only the currently active template's tab; use it on each tab in turn to clear all tables.

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | Ctrl/Cmd-Z |
| Redo | Ctrl/Cmd-Y |
| Copy | Ctrl/Cmd-C |
| Paste | Ctrl/Cmd-V |
| Select all | Ctrl/Cmd-A |
| Move between cells | Arrow keys, Tab, Enter |
| Open cell picklist | Enter or F2 while cell is selected |
