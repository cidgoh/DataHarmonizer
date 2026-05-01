# update_templates.py

Automates the process of propagating template changes from the **DataHarmonizer Templates** Google Sheet into the local repository. It compares the two most recent Pathogen Genomics Package (PGP) releases listed in the sheet's **Version Control** tab, identifies which templates changed version, and for each changed template:

1. Updates `schema_core.yaml` with the new version annotation
2. Exports `schema_slots.tsv` and `schema_enums.tsv` from the corresponding Google Sheet tabs
3. Runs `tabular_to_schema.py` to regenerate `schema.yaml` and `schema.json`

---

## Prerequisites

### Python packages

```
pip install pandas gspread oauth2client requests python-semver openpyxl
```

### Google API setup (required only for authenticated download via `gspread`)

The simpler `--download` flag uses a public export URL and requires no API credentials. The `gspread`-based `refresh_cache()` function (currently not called by default) requires a service account key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project (e.g. `dataharmonizer`)
3. Enable the **Google Sheets API**
4. Go to **APIs & Services > Credentials > Service Accounts**
5. Create a service account, then under its **Keys** tab add a JSON key
6. Save the downloaded key file as `script/google_api_key.json`

---

## Usage

Run from the `script/` directory:

```bash
cd script/

# Step 1 — Download the latest Google Sheet (required before first run or to refresh)
python update_templates.py --download

# Step 2 — Process version changes and update affected templates
python update_templates.py
```

Both steps can be combined:

```bash
python update_templates.py --download && python update_templates.py
```

### Options

| Flag | Description |
|------|-------------|
| `-d` / `--download` | Download the latest Google Sheet as `dataharmonizer_templates.xlsx` |
| `-s <name>` / `--schema <name>` | Regenerate a single template by name, bypassing version comparison (see below) |
| `-m` / `--menu` | Also regenerate `menu.js` entries for updated templates (passed through to `tabular_to_schema.py`) |

### Single-schema update (`-s`)

To regenerate `schema.yaml` and `schema.json` for one template without running a full release comparison:

```bash
python update_templates.py -s grdi
python update_templates.py -s "GRDI"
python update_templates.py -s "Canada Covid-19"
```

The name is matched **case-insensitively** against the **Template Name**, **Folder**, or **Class** columns in the `Files` tab. If no match is found the script prints all available template names, folders, and classes.

This mode exports fresh `schema_slots.tsv` and `schema_enums.tsv` from the spreadsheet and calls `tabular_to_schema` — it does **not** modify `schema_core.yaml` or version numbers.

---

## How it works

### Google Sheet structure

The script reads from a Google Sheet named **DataHarmonizer Templates** with (at minimum) two tabs:

| Tab | Purpose |
|-----|---------|
| `Version Control` | Lists PGP releases, with one row-block per release containing template names and their `x.y.z` semantic versions |
| `Files` | Maps each Template Name to its `Tab` prefix, `Folder` (under `web/templates/`), and `Class` name in the schema |
| `<Tab>-slots` | Slot definitions for a template (e.g. `GRDI-slots`) |
| `<Tab>-enums` | Enum definitions for a template (e.g. `GRDI-enums`) |

### Version comparison logic

The script finds the **last two PGP Release entries** in the `Version Control` tab and compares the template versions listed under each:

- If a template's version is **unchanged** → skipped
- If a template is **new** or has a **higher version** → processed

### Per-template update steps

For each changed template the script:

1. **Reads** `web/templates/<folder>/schema_core.yaml`
2. **Sets** `classes.<Class>.annotations.version` to the new version string
3. **Updates** the top-level `schema.version` if the new version is higher than the current value
4. **Writes** `schema_core.yaml` back to disk
5. **Exports** the `<Tab>-slots` sheet to `web/templates/<folder>/schema_slots.tsv`
6. **Exports** the `<Tab>-enums` sheet to `web/templates/<folder>/schema_enums.tsv`
7. **Calls** `tabular_to_schema.make_linkml_schema()` to regenerate `schema.yaml` and `schema.json`

### Boolean normalisation

When reading slots from Excel, pandas reads `TRUE`/`FALSE` boolean columns (`identifier`, `multivalued`, `required`, `recommended`) as `1.0`/`NaN`. The script normalises `1.0` → `'TRUE'` before writing the TSV.

### Date columns

To prevent Excel from reformatting date values in the `examples` column, ensure that column is set to **Format → Number → Plain text** in the Google Sheet before exporting.

---

## Output files (per changed template)

| File | Description |
|------|-------------|
| `web/templates/<folder>/schema_core.yaml` | Updated with new version annotation |
| `web/templates/<folder>/schema_slots.tsv` | Slot definitions exported from Google Sheet |
| `web/templates/<folder>/schema_enums.tsv` | Enum definitions exported from Google Sheet |
| `web/templates/<folder>/schema.yaml` | Regenerated by `tabular_to_schema.py` |
| `web/templates/<folder>/schema.json` | Regenerated by `tabular_to_schema.py` |

---

## Local cache file

`script/dataharmonizer_templates.xlsx` — the downloaded snapshot of the Google Sheet. The script will not run without this file; use `--download` to create or refresh it.

---

## Related scripts

| Script | Role |
|--------|------|
| `tabular_to_schema.py` | Converts `schema_slots.tsv` + `schema_enums.tsv` + `schema_core.yaml` into `schema.yaml` and `schema.json` |
| `diff_schemas.py` | Compares `schema.yaml` files between git commits to report substantive vs cosmetic changes |
