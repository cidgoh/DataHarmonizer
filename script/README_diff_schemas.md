# diff_schemas.py

A command-line tool that compares DataHarmonizer `schema.yaml` files across git
commits and produces a structured change report.  Changes are classified by
significance and, in detail mode, are grouped by schema file and section so that
the history of any template can be read at a glance.

---

## Requirements

```
pip install deepdiff pyyaml
```

Must be run from inside the DataHarmonizer git repository.

---

## Usage

```
python3 script/diff_schemas.py [old_ref [new_ref]] [options]
```

### Positional arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `old_ref` | Starting point — a git ref (`HEAD~N`) **or** a start date (`yyyy-mm-dd`) | `HEAD~1` |
| `new_ref` | Ending point — a git ref **or** an end date (`yyyy-mm-dd`); omit for working tree / up to today | *(working tree)* |

Both positional arguments should be the same kind (both HEAD~N refs, or both
dates).  Mixing a date with a HEAD~N ref is not supported.

### Options

| Flag | Description |
|------|-------------|
| `-d`, `--detail` | Schema-grouped detail report (see below) |
| `-s STR`, `--schema STR` | Limit to schemas whose path contains `STR` (case-insensitive) |
| `-c`, `--concise` | In each table, suppress the VERSION/DATE/AUTHOR/CHG columns when all four are identical to the previous row |
| `-f`, `--full` | Show full field values without truncation (default truncates long strings) |
| `-h`, `--help` | Show help and exit |

---

## Change classification

Every detected difference is classified into one of three categories:

| Category | Meaning |
|----------|---------|
| **SUBSTANTIVE** | A value changed, a key was added or removed, a type changed, or a key was renamed with a case change |
| **ENRICHMENT** | A `title` field was added to a permissible value (bulk metadata pass — no semantic change) |
| **COSMETIC** | Reordering, redundant `name` fields added by the serialiser, or whitespace-only string wrapping |

Only SUBSTANTIVE and ENRICHMENT changes appear in the detail report.
COSMETIC changes are suppressed and counted in the summary total.

---

## Summary mode (default)

Without `-d`, the tool prints one block per schema file listing SUBSTANTIVE and
ENRICHMENT changes as raw deepdiff paths with OLD / NEW values.

```
python3 script/diff_schemas.py              # HEAD~1 vs working tree
python3 script/diff_schemas.py HEAD~5       # HEAD~5 vs working tree
python3 script/diff_schemas.py HEAD~3 HEAD~1
python3 script/diff_schemas.py HEAD~1 --full
```

A totals line is printed at the end counting all categories across all schemas.

---

## Detail mode (`-d`)

The detail report walks every commit step between `old_ref` and `new_ref` (or
HEAD), accumulates all changes, and prints them grouped by schema file.  Within
each schema the output is organised into four sections.

### Report sections

#### 1. Schema Attributes
Root-level fields of the schema (`version`, `name`, `id`, `description`, …).

Columns: `VERSION  DATE  AUTHOR  CHG  FIELD  VALUE`

#### 2. Classes
Changes grouped by class name.  Each class shows the current class version
(`C VERSION`) instead of the schema version.  Sub-tables within each class:

| Sub-table | Contents |
|-----------|----------|
| **Class Attributes** | Class-level fields (`title`, `description`, `annotations`, …) |
| **Slots (list membership)** | Slots added to or removed from a class's `slots` list |
| **Slot Usage** | Overrides in `slot_usage` (range, required, recommended, …) |
| **Slot Attributes (inline definitions)** | Inline slot definitions under `attributes` |

Columns for slot tables: `C VERSION  DATE  AUTHOR  CHG  SLOT  ATTRIBUTE  VALUE`

#### 3. Slots
Schema-level slot definitions (`slots.<name>.<field>`).

Columns: `VERSION  DATE  AUTHOR  CHG  SLOT  ATTRIBUTE  VALUE`

#### 4. Enums
Two sub-tables:

**Enum / Collection Changes** — whole-enum adds/deletes and permissible-value
collection-level changes (e.g. when many PV keys changed at once):

Columns: `VERSION  DATE  AUTHOR  CHG  ENUM  ATTRIBUTE  VALUE`

**Enum: `<name>`** — field-level changes within a specific enum's
`permissible_values`, one table per enum, sorted by date then permissible value:

Columns: `VERSION  DATE  AUTHOR  CHG  PERMISSIBLE VALUE  VALUE`

The `VALUE` column is omitted from a row when its content would be redundant
with the permissible value name.

### Version display

The `SCHEMA:` header shows the version range spanned by the report, e.g.
`(1.4.2 - 1.7.0)`.  Class-level tables use the class's own annotation version
(`C VERSION`) rather than the schema version.

---

## Specifying commit ranges

### HEAD~N refs

Walk every individual commit step from `old_ref` up to `new_ref` (or HEAD):

```bash
# Last 5 commits → HEAD
python3 script/diff_schemas.py HEAD~5 -d

# Between two specific refs
python3 script/diff_schemas.py HEAD~10 HEAD~3 -d
```

### Date ranges (yyyy-mm-dd)

Walk every commit whose author date falls within the given range.  The parent of
the first matching commit is included automatically so that commit's own changes
are captured.

```bash
# All commits since a date up to HEAD
python3 script/diff_schemas.py 2024-11-01 -d -s wastewater

# Commits within an explicit date range
python3 script/diff_schemas.py 2024-11-01 2025-03-31 -d

# Date range + schema filter + concise output
python3 script/diff_schemas.py 2024-11-01 2025-03-31 -d -s canada_covid19 -c
```

When `new_ref` is a date, the end of day (`23:59:59`) is used so that commits
on the end date itself are included.

---

## Concise mode (`-c`)

The `-c` flag reduces visual noise in busy tables.  The four prefix columns
(`VERSION`, `DATE`, `AUTHOR`, `CHG`) are blanked on a row **only when all four
are identical to the previous row**.  If any one of the four differs, all four
are shown.  The first row of every table always shows all values.

This works well in combination with the date-sorted enum tables, where many
consecutive rows often share the same commit metadata.

---

## Schema filter (`-s`)

The `-s` option limits processing to schemas whose file path contains the given
substring (case-insensitive).  It applies to both summary and detail modes.

```bash
python3 script/diff_schemas.py HEAD~5 -d -s wastewater
python3 script/diff_schemas.py HEAD~5 -d -s canada_covid19
```

Available schemas are listed if the filter matches nothing.

---

## Suppressed attributes

Some attribute changes are filtered out because they carry no semantic
information.  The current suppression list is defined in `IGNORED_ATTRIBUTES`
near the top of the script:

| Key | Reason |
|-----|--------|
| `class.slot_usage.rank` | Ordering metadata, not a semantic change |

Additional suppressions can be added by extending that dictionary.  Keys follow
the pattern `<section>.<subsection>.<field>`, for example:

```
schema.<field>             # root-level schema attribute
class.<field>              # class-level attribute
class.slots.<slot>         # slot list membership
class.slot_usage.<field>   # slot_usage override
class.attributes.<field>   # inline slot attribute definition
slot.<field>               # schema-level slot attribute
enum.<field>               # field inside an enum
```

---

## Examples

```bash
# Quick summary of last commit:
python3 script/diff_schemas.py

# Full detail report for the last 25 commits, wastewater schema only:
python3 script/diff_schemas.py HEAD~25 -d -s wastewater

# Same, concise output:
python3 script/diff_schemas.py HEAD~25 -d -s wastewater -c

# All changes since November 2024:
python3 script/diff_schemas.py 2024-11-01 -d

# Changes in Q1 2025, CanCOGeN schema, full values:
python3 script/diff_schemas.py 2025-01-01 2025-03-31 -d -s canada_covid19 -f
```
