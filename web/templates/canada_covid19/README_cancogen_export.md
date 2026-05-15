# CanCOGeN Export Transformations

This document summarizes the custom field transformations applied by
`export.js` when exporting CanCOGeN (canada_covid19) data to each of the
four supported target formats.

Field mappings not listed here are handled automatically by the schema's
`exportField` annotations in `schema.yaml` and require no custom logic.

---

## Export formats at a glance

| Format | File type | Key custom logic |
|---|---|---|
| VirusSeq_Portal | TSV | study_id lookup, breadth-of-coverage %, null-reason demultiplexing |
| BioSample | XLS | geo_loc_name concatenation, isolation_source concatenation, host_age unit conversion |
| GISAID | XLS | constant Type field, dual Address columns, specimen_processing filter, null→Unknown |
| NML LIMS | CSV | constant HC_CURRENT_ID, VE_SYMP_AVAIL flag, date precision truncation, PH_SPECIMEN_SOURCE classification |

---

## VirusSeq_Portal (TSV)

### study_id — auto-populated from sequencing lab

`study_id` is not entered by the user. It is derived from
`sequence_submitted_by` using a hardcoded lookup table:

| sequence_submitted_by | study_id |
|---|---|
| Alberta Precision Labs (APL) | ABPL-AB |
| BCCDC Public Health Laboratory | BCCDC-BC |
| Manitoba Cadham Provincial Laboratory | MCPL-MB |
| New Brunswick - Vitalité Health Network | VHN-NB |
| Newfoundland and Labrador - Eastern Health | EH-NL |
| Nova Scotia Health Authority | NSHA-NS |
| Public Health Ontario (PHO) | PHO-ON |
| Laboratoire de santé publique du Québec (LSPQ) | LSPQ-QC |
| Saskatchewan - Roy Romanow Provincial Laboratory (RRPL) | RRPL-SK |

If the lab name does not appear in the table, `study_id` is left blank.

### breadth of coverage value — % suffix

If `breadth of coverage value` is non-empty and does not already end with
`%`, a `%` character is appended.

### Null-reason demultiplexing

Three fields have a paired `<field> null reason` column immediately to their
right in the output:

- `sample collection date` / `sample collection date null reason`
- `host age` / `host age null reason`
- `diagnostic pcr Ct value` / `diagnostic pcr Ct value null reason`

When one of these fields contains a value that is considered a null/missing
indicator, the value is moved to the null reason column and the original
field is cleared. The three conditions that trigger this, checked in order:

1. **Schema dataStatus match** — the value is listed in the field's
   `dataStatus` list (schema-defined null options).
2. **NullOptionsMap match** — the value matches one of the standard null
   terms (case-insensitive). The value is also normalized to title case
   before being written to the null reason column:

   | Input (any case) | Output in null reason column |
   |---|---|
   | not applicable | Not Applicable |
   | missing | Missing |
   | not collected | Not Collected |
   | not provided | Not Provided |
   | restricted access | Restricted Access |

3. **Numeric field with non-numeric text** — if the source field has
   datatype `xsd:nonNegativeInteger` or `xsd:decimal` and the value cannot
   be parsed as a number, it is moved to the null reason column. This covers
   free-text explanations entered after validation.

---

## BioSample (XLS)

### geo_loc_name — country + province concatenation

The single `geo_loc_name` export column is populated from two source fields
via the schema's `exportField` mappings:

- `geo_loc_name (country)`
- `geo_loc_name (state/province/territory)`

Values are colon-delimited if both are present (e.g. `Canada:British Columbia`).

### isolation_source — specimen field concatenation

`isolation_source` is a single composite field that concatenates the
first non-empty value found across the following source fields
(colon-delimited):

- anatomical material
- anatomical part
- body product
- environmental material
- environmental site
- collection device
- collection method

The individual fields are also exported to their own dedicated columns
(`anatomical_material`, `anatomical_part`, etc.) alongside `isolation_source`.

### host_age — month-to-year unit conversion

NCBI BioSample requires `host_age` to be expressed in years. If the
companion field `host_age_unit` contains the value `month`, the age is
converted before export:

```
host_age (exported) = floor(host_age / 12)
```

The result is rounded down to the nearest whole year.

If `host_age_unit` is `year` or is absent, the value is passed through
unchanged. Non-numeric values in `host_age` are also passed through
unchanged.

---

## GISAID (XLS)

### Type — constant value

The `Type` column is always written as `betacoronavirus` regardless of any
template data.

### Address — two distinct columns with the same header name

GISAID requires two separate address columns, both named `Address`. Because
a Map cannot hold duplicate keys, ExportHeaders is implemented as an array
for this format. The two entries are:

| Position | Source field | GISAID internal name |
|---|---|---|
| 1st Address | `sample_collector_contact_address` | `covv_orig_lab_addr` |
| 2nd Address | `sequence_submitter_contact_address` | `covv_subm_lab_addr` |

### specimen_processing — virus passage filter

`specimen_processing` is a multi-select field. Only the value `virus passage`
(case-insensitive) is mapped to the GISAID output, written as `Virus passage`.
All other selected values in this field are ignored.

### passage_number — prefix added

If `passage_number` has a value it is written with the string
`passage number ` prepended (e.g. `passage number 3`).

### Null values → "Unknown"

For any field where the value is listed in that field's `dataStatus` (null
value options):

- **Single-source field**: the value is replaced with `Unknown`.
- **Multi-source field**: the null value is dropped entirely (to avoid
  writing `Unknown` when other non-null sources may contribute).

### Assembly method — colon delimiter

Multi-source values for `Assembly method` are joined with `:`.
All other multi-source fields use `;`.

### Dual header rows

The output file contains two header rows:

- **Row 0** (inserted last): GISAID internal field codes (`submitter`, `fn`,
  `covv_virus_name`, `covv_type`, …)
- **Row 1**: Human-readable display names (`Submitter`, `FASTA filename`,
  `Virus name`, `Type`, …)

---

## NML LIMS (CSV)

### HC_CURRENT_ID — constant value

Always written as `SARS-CoV-2`.

### VE_SYMP_AVAIL — symptoms available flag

Calculated from the `signs and symptoms` field:

- `Y` if the field is non-empty
- `N` if the field is empty

### HC_COLLECT_DATE — date precision truncation

The exported collection date is truncated based on `sample collection date
precision`:

| precision value | transformation |
|---|---|
| `year` | Date written as `YYYY-01-01` |
| `month` | Date written as `YYYY-MM-01` |
| (absent / day) | Full date passed through unchanged |

### PH_SPECIMEN_SOURCE — specimen origin classification

This is a calculated field that classifies the specimen into one of three
categories. Source fields are checked in priority order; the first non-null,
non-missing value wins:

1. `host (scientific name)` or `host (common name)`
   - `homo sapiens` or `human` (case-insensitive) → `Human`
   - Any other value → `ANIMAL`
2. `environmental material` or `environmental site` → `ENVIRO`

All standard null values (Not Applicable, Missing, Not Collected, Not
Provided, Restricted Access) are skipped during this check. If no
qualifying value is found, the field is left blank.

### Null value normalization

All mapped values are scanned and any standard null term is case-corrected
using the following map (case-insensitive input):

| Input | Normalized output |
|---|---|
| not applicable | Not Applicable |
| missing | Missing |
| not collected | Not Collected |
| not provided | Not Provided |
| restricted access | Restricted Access |

### Multi-select null deduplication

For fields that contain multiple semicolon-delimited values, null values are
removed when at least one non-null value is present. If the entire field
consists of null values, they are preserved as-is (deduplicated to one).
