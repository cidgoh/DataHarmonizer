# compare_schemas.py

A command-line tool that compares two DataHarmonizer `schema.yaml` files
directly by file path and reports content differences, ignoring key and
list ordering.  Use this when you have two files on disk and want to know
what actually changed rather than just how keys were rearranged.

For comparing schemas across git commits see `diff_schemas.py`.

---

## Requirements

```
pip install deepdiff pyyaml
```

---

## Usage

```
python3 script/compare_schemas.py <file_a> <file_b> [options]
```

### Positional arguments

| Argument | Description |
|----------|-------------|
| `file_a` | Baseline schema YAML (the "old" version) |
| `file_b` | Schema YAML to compare against (the "new" version) |

### Options

| Flag | Description |
|------|-------------|
| `-f`, `--full` | Show full field values without truncation (default truncates at 120 chars) |
| `-e`, `--enrichment` | Show enrichment changes (permissible_value title additions; suppressed by default) |
| `-c`, `--cosmetic` | Show cosmetic changes (suppressed by default) |
| `-h`, `--help` | Show help and exit |

---

## Change classification

Every detected difference is classified into one of three categories:

| Category | Meaning |
|----------|---------|
| **SUBSTANTIVE** | A value changed, a key was added or removed, a type changed, or a key was renamed with a case change |
| **ENRICHMENT** | A `title` field was added to a permissible value (bulk metadata pass — no semantic change) |
| **COSMETIC** | Redundant `name` fields added by the serialiser, or whitespace-only string-to-single-item-list wrapping |

SUBSTANTIVE changes are always shown.  ENRICHMENT and COSMETIC changes are
counted in the summary line and can be shown with `-e` / `-c`.

---

## Output format

Each SUBSTANTIVE change is printed as:

```
  root['classes']['Container']['tree_root']
    OLD: True
    NEW: False
```

For added keys only `NEW` is shown; for removed keys only `OLD` is shown.
Key case-change pairs (same value, key name differs only in case) are
tagged `[CASE CHANGE]`.

A summary line at the end counts all three categories:

```
Summary: 46 substantive, 0 enrichment, 3 cosmetic
```

---

## Examples

```bash
# Compare two schema files, show substantive differences:
python3 script/compare_schemas.py web/templates/grdi_1m/schema.yaml ~/Downloads/schema.yaml

# Show full values without truncation:
python3 script/compare_schemas.py old/schema.yaml new/schema.yaml --full

# Show all change categories:
python3 script/compare_schemas.py old/schema.yaml new/schema.yaml --enrichment --cosmetic
```

---

## Relationship to diff_schemas.py

| | `compare_schemas.py` | `diff_schemas.py` |
|---|---|---|
| Input | Two file paths | Git refs or date ranges |
| Requires git repo | No | Yes |
| Output modes | Summary only | Summary + grouped detail (`-d`) |
| Schema filter | N/A | `-s STR` |
| Commit history | No | Yes |
