# menu_manager

**Authors:** Damion Dooley and Claude (Anthropic claude-sonnet-4-6)

Fetches vocabulary sources, processes them into LinkML enum YAML files, and
assembles them into a `schema.yaml` suitable for use with DataHarmonizer.

---

## Quick-start workflow

```bash
# 1. Add sources (auto-detects type, downloads, adds to menu_config.yaml)
python menu_manager.py -a https://example.org/some-valueset.json

# 2. Process sources into sources/*.yaml (fills prefix dicts into menu_config.yaml)
python menu_manager.py -c

# 3. Build schema.yaml (syncs enums and prefixes from all sources)
python menu_manager.py -b

# Full refresh in one line:
python menu_manager.py -f all -c -b
```

---

## Command reference

### `-b` — Build schema.yaml

Create or update `schema.yaml` with the LinkML top-level structure, enums, and
prefixes drawn from all sources in `menu_config.yaml`.

```bash
python menu_manager.py -b
```

On creation, populates default values.  On update, only adds missing keys —
existing values are preserved.  Syncs enums from each source's YAML file and
syncs prefixes from all sources stored in `menu_config.yaml`.

When `-b` detects that an enum present in `schema.yaml` is no longer in its
source file, it reports the enum key rather than deleting it automatically.
This gives the operator the opportunity to manually review whether the menu
item should be removed or retained.

---

### `-f` — Fetch (download) sources

```bash
python menu_manager.py -f all          # fetch every source in menu_config.yaml
python menu_manager.py -f KEY1 KEY2    # fetch only the named source(s)
python menu_manager.py -c KEY -f       # fetch only the source(s) listed with -c
python menu_manager.py -f              # no-op; prints reminder to use -f all or -c
```

---

### `-c` — Process sources (update prefix dicts)

```bash
python menu_manager.py -c                   # process all sources
python menu_manager.py -c linkml_valuesets  # process one source by key
```

Reads each fetched source file, generates or updates `sources/{key}.yaml`, and
stores the resulting prefix dict in `menu_config.yaml`.

---

### `-r` — Enum report

```bash
python menu_manager.py -r     # space-padded output
python menu_manager.py -r -t  # tab-delimited output
```

Generates a report of enum keys, titles, `source_domain`, and `source_schema`
for all sources in `menu_config.yaml`.

---

### `-l` — Expand `reachable_from` source nodes via API

Always operates on `schema.yaml`.

```bash
python menu_manager.py -l                              # expand all enums with reachable_from.source_nodes
python menu_manager.py -l linkml_valuesets             # expand enums imported_from a named source
python menu_manager.py -l MyBiomeEnum                  # expand one enum by name
python menu_manager.py -l linkml_valuesets MyBiomeEnum # mix source key and enum name
```

The API used for each ontology prefix is determined by the `apis` block in
`menu_config.yaml` (see [API configuration](#api-configuration) below).
OLS4 is the default fallback.  BioPortal requires an `apikey` under
`apis > bioportal > type > rest > apikey`.

> **Known limitation:** `-l` currently assumes `subClassOf` object property
> traversal when expanding `reachable_from.source_nodes`.  Dynamic enumeration
> of other relationship types (e.g. `partOf`, `hasPart`) has not yet been
> implemented.

---

### `-a` — Add a source from a URL

Auto-detects the source type, downloads the file, adds an entry to
`menu_config.yaml`, and runs initial processing.

```bash
python menu_manager.py -a https://example.org/some-valueset.json
```

---

## Supported source types and auto-detection

| Detected as | Detection method |
|---|---|
| `OntologyAPI` | URL matches `aims.fao.org/aos/agrovoc/{id}` (pre-download) |
| `OntologyAPI` | URL matches `snomed.info/id/{conceptId}` (pre-download) |
| `NSDBSNT` | URL contains `/snt/` under the NSDB soil domain |
| `NSDBSLT` | URL contains `/slt/` under the NSDB soil domain |
| `NSDB` | URL matches `sis.agr.gc.ca/cansis/nsdb/soil` prefix |
| `NSDBSLC` | URL matches `sis.agr.gc.ca` + `/nsdb/slc/` |
| `LOINC` | URL from `terminology.hl7.org` with `.html` extension (listing page, not a single ValueSet/CodeSystem detail) |
| `OWL` | URL extension `.owl`, `.ofn`, `.rdf`, `.ttl`, `.n3`; or file contains RDF/OWL content markers |
| `LOINCCodeSystem` | `.json` file with `resourceType: CodeSystem` |
| `LOINCValueSet` | `.json` file with `resourceType: ValueSet` |
| `LinkML` | `.yaml`/`.yml` file that is a dict containing `enums` or `id` |
| `STATSCAN` | URL from `statcan.gc.ca` containing `p3VD.pl` and `Function=getVD` |
| `NAPCSCanada` | CSV content with NAPCS-specific column headers |
| `AgriFoodCA` | GitHub directory URL for `agrifooddatacanada/picklists_for_schemas` (pre-download) |
| `AgriFoodCA` | CSV first row matches `,title,description,keywords,source` (content-based) |

---

## Example `-a` invocations by source type

### SNOMED CT (via OLS4)

```bash
# Heart disease — concept IRI detected pre-download; no file saved
python menu_manager.py -a http://snomed.info/id/56265001

# Then expand the hierarchy via OLS4 and build schema.yaml:
python menu_manager.py -l SNOMED56265001
python menu_manager.py -b
```

`SNOMED` must appear in the `ols` api's `ontologies` list in `menu_config.yaml`
(see [API configuration](#api-configuration)).  If it is absent, `fetch_api_graph`
still falls back to OLS4 and auto-detects the `http://snomed.info/id/` IRI base
from OLS4 ontology metadata — no explicit `iri_base` key required.

### AGROVOC

```bash
python menu_manager.py -a https://aims.fao.org/aos/agrovoc/c_26950
python menu_manager.py -l AGROVOC_c_26950
```

### LinkML

```bash
python menu_manager.py -a https://raw.githubusercontent.com/linkml/valuesets/refs/heads/main/src/valuesets/merged/merged_hierarchy.yaml
```

### LOINC CodeSystems and ValueSets

```bash
# LOINCDataAbsentReason (LOINCCodeSystem)
python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/CodeSystem-data-absent-reason.json

# LOINCPersonalPronouns (LOINCValueSet)
python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/ValueSet-pronouns.json

# LOINCGenderIdentity (LOINCValueSet)
python menu_manager.py -a https://terminology.hl7.org/en/ValueSet-gender-identity.json

# LOINC valueset listing page (run -c after to fetch all enums)
python menu_manager.py -a https://terminology.hl7.org/en/valuesets.html
```

### OWL ontologies

Requires `owlready2` (`pip install owlready2`).

```bash
python menu_manager.py -a https://purl.obolibrary.org/obo/envo.owl
```

### NSDB (National Soil DataBase)

```bash
# NSDBSoilNameAndLayerV2 (NSDB) — combined Soil Name Table + Soil Layer Table
python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/index.html

# NSDBSNTv2 (NSDBSNT) — Soil Name Table
python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/index.html

# NSDBSLTv2 (NSDBSLT) — Soil Layer Table
python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/slt/index.html

# NSDBSLCv3_2 (NSDBSLC) — Soil Landscapes of Canada
python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/slc/v3.2/index.html
```

### Statistics Canada

Get the variable page URI from https://www.statcan.gc.ca/en/concepts/search by
clicking on a variable name.

```bash
python menu_manager.py -a "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1368814"
python menu_manager.py -c STATSCAN1441857
```

### NAPCS Canada

See https://www.statcan.gc.ca/en/subjects/standard/napcs/2022/index and
https://www.statcan.gc.ca/en/media/5274 for the CSV download.

```bash
# Content auto-detected from CSV headers; year extracted from URL to form the source key
python menu_manager.py -a "https://www.statcan.gc.ca/en/media/5274"
python menu_manager.py -c NAPCSCanada2022
```

### AgriFoodCA picklists

Picklist CSV files from https://github.com/agrifooddatacanada/picklists_for_schemas.
Each CSV encodes an enum with bilingual (English/French) labels and optional descriptions.

```bash
# Import all picklists from the GitHub directory in one step (uses GitHub API):
python menu_manager.py -a https://github.com/agrifooddatacanada/picklists_for_schemas/tree/main/picklists

# Or add a single picklist CSV by its raw download URL:
python menu_manager.py -a https://raw.githubusercontent.com/agrifooddatacanada/picklists_for_schemas/main/picklists/soil_drainage.csv

# Re-generate YAML from already-downloaded CSVs:
python menu_manager.py -c AFCSoilDrainage
```

Source keys are derived from filenames: `AFC` + PascalCase(stem), e.g.
`soil_drainage.csv` → `AFCSoilDrainage`, `education_level_stats_can.csv` → `AFCEducationLevelStatsCan`.

When a source document URL is found in the CSV metadata (the `source` column of the
`general` row), it is stored as `see_also` in `menu_config.yaml`.

---

## `menu_config.yaml` — source entry structure

Each entry under `sources:` may carry the following optional filtering and
configuration attributes in addition to the required `content_type`,
`file_format`, and `reachable_from` fields.

### `minus` — exclude content during `-b` build

```yaml
MySource:
  content_type: OWL
  minus:
    concepts: [environmental feature, quality]   # exclude whole enums by key or label
    permissible_values: [ENVO:00000001]           # exclude specific PV keys
    status: [DEPRECATED]                          # exclude PVs by status field (OWL only)
```

### `include` — restore excluded content, or whitelist-only mode

When used **with** `minus`, `include` is applied after `minus`, restoring
specific items even when an ancestor was excluded.

When used **without** `minus`, `include` acts as a whitelist: all enums (or
permissible values) from the source are excluded by default, and only the items
listed in `include` are imported.

```yaml
# With minus: restore water body despite its ancestor being excluded
MySource:
  content_type: OWL
  minus:
    concepts: [environmental feature]
  include:
    concepts: [water body]                        # restore this subtree despite minus
    permissible_values: [ENVO:00000123]           # restore specific PV keys

# Without minus: import only the listed enums (all others are excluded)
MySource:
  content_type: LinkML
  include:
    concepts: [BiomeEnum, HabitatEnum]            # only these two enums are imported
```

### `concise` — trim redundant hierarchy nodes during `-b`

When `concise: true`, nodes whose title exactly matches their parent's title are
dropped during `-b` build and any grandchildren are re-wired to the nearest
surviving ancestor.

```yaml
NAPCSCanada2022:
  content_type: NAPCSCanada
  concise: true
```

**Example:** a NAPCS hierarchy where class `"011"` (title "Crop products") has a
child `"0110"` also titled "Crop products" — the child is redundant and is
dropped.  Any codes that had `is_a: "0110"` are re-wired to `is_a: "011"`.

To keep all nodes, omit `concise` or set `concise: false`.

Currently supported for `content_type: NAPCSCanada`.  For `content_type: OWL`,
`concise: true` is applied earlier, at `-c` processing time inside
`process_owl_source`, clipping class definitions to two sentences.

---

## `minus` / `include` processing — which attributes apply to which content types

All content types pass through the same enum processing loop in `-b`.
The `minus` and `include` attributes are applied uniformly with two exceptions:

| Attribute | All content types | Notes |
|---|---|---|
| `minus.concepts` | Yes | Excludes whole enums by key, `source_schema`, or `source_domain` annotation |
| `minus.permissible_values` | Yes | Removes specific PV keys from every surviving enum |
| `minus.status` | **OWL only** | Removes PVs whose `status` field matches (e.g. `DEPRECATED`). Silently ignored for other types even if present. OntologyAPI sources also emit `status: DEPRECATED` on nodes, so this could logically apply there too |
| `include.concepts` | Yes | Restores excluded enums after `minus` |
| `include.permissible_values` | Yes | Restores specific PV keys in surviving enums |
| `concise` deduplication | **NAPCSCanada only** | Drops PVs whose title equals their parent's title at `-b` time |

The processing order is:
1. `minus.concepts` / `minus.permissible_values` / `minus.status` — first pass, excluding items
2. `include.concepts` / `include.permissible_values` — second pass, restoring specific items

---

## API configuration

The `apis` block in `menu_config.yaml` configures API endpoints for the `-l`
lookup function.  Each key is a service name with a `type` sub-object.  The
`-l` lookup routes each CURIE prefix to the first API whose `ontologies` list
contains it, falling back to OLS4.

```yaml
apis:
  ols:
    type:
      rest:
        uri: http://www.ebi.ac.uk/ols4/api/ontologies/{ontology}/terms/{double_encoded}/graph
    ontologies: [ENVO, GO, UBERON, SNOMED]
  bioportal:
    type:
      rest:
        uri: https://data.bioontology.org
        apikey: YOUR_BIOPORTAL_KEY
    ontologies: [MESH, NCIT, SNOMEDCT]
  agrovoc:
    type:
      sparql:
        uri: https://agrovoc.fao.org/sparql/
    ontologies: [agrovoc]
```

AGROVOC can be added directly as a file but is 60 MB+; using the SPARQL
endpoint is recommended.  A SKOSIMOS API option exists but is not yet
implemented.

### OLS4 IRI base auto-detection

OLS4 serves ontologies with different IRI conventions.  OBO ontologies use the
`http://purl.obolibrary.org/obo/{ONTOLOGY}_{id}` pattern; SNOMED CT uses
`http://snomed.info/id/{id}`.  The `-l` lookup detects the correct base
automatically by querying the OLS4 ontology metadata endpoint
(`/api/ontologies/{ontology}`) and reading `config.baseUris[0]`.  Results are
cached per session so the metadata call is made at most once per ontology.

To override auto-detection (e.g. for a private OLS4 mirror with a different
IRI scheme), add an explicit `iri_base` key under `type.rest`:

```yaml
apis:
  ols:
    type:
      rest:
        uri: https://my-ols.example.org/api/ontologies/{ontology}/terms/{double_encoded}/graph
        iri_base: "http://snomed.info/id/"   # explicit override — skips metadata call
    ontologies: [SNOMED]
```

---

## OntologyAPI metadata population

### Source-level metadata (written to `menu_config.yaml` by `-a`)

| Source type | `title` | `version` | `description` |
|---|---|---|---|
| AGROVOC | ✓ SPARQL `skos:prefLabel` | — | ✓ SPARQL `skos:scopeNote` |
| SNOMED (via OLS4) | ✓ OLS4 term `label` | ✓ OLS4 `config.versionIri` | ✓ OLS4 term `description`\* |

\* SNOMED CT definitions are present in OLS4 for many concepts but are not
guaranteed for all terms (depends on whether SNOMED has a formal definition for
that concept).

Other OntologyAPI sources (ENVO, GO, UBERON, etc.) do not have a `-a` detection
handler and must be added to `menu_config.yaml` manually.

### Per-permissible-value metadata (written to `sources/{key}.yaml` by `-l`)

| API back-end | `title` | `description` | `status: DEPRECATED` |
|---|---|---|---|
| OLS4 (`/graph` endpoint) | ✓ term label | — graph endpoint returns only IRI + label | — |
| BioPortal (`/descendants`) | ✓ `prefLabel` | ✓ IAO:0000115 `definition` annotation | — |
| AGROVOC SPARQL | ✓ `skos:prefLabel` | ✓ `skos:definition` / `skos:scopeNote` | ✓ `owl:deprecated` |

OLS4 does not return definitions from its `/graph` endpoint.  Filling them
would require one additional per-term API call per descendant, which is
impractical for large hierarchies.  If per-term definitions are essential,
BioPortal is the better back-end for OBO ontologies (ENVO, GO, etc.).

### OLS4 vs BioPortal for SNOMED CT

OLS4 is the recommended back-end for SNOMED CT for two reasons:

1. **Standard IRIs** — OLS4 exposes SNOMED terms under the international IRI
   base `http://snomed.info/id/{conceptId}`.  BioPortal uses its own IRI scheme
   `http://purl.bioontology.org/ontology/SNOMEDCT/{conceptId}`, which would
   produce non-standard CURIEs in the output YAML.

2. **No API key required** — OLS4 is freely accessible.  BioPortal requires a
   registered API key configured under `apis > bioportal > type > rest > apikey`.

The trade-off is that OLS4's `/graph` endpoint does not return per-term
definitions (see table above), whereas BioPortal does.  If definition text per
permissible value is a hard requirement, BioPortal can be used with the SNOMED
prefix set to `http://purl.bioontology.org/ontology/SNOMEDCT/` in the source
entry — but the resulting CURIEs will not resolve to the international SNOMED
namespace.

---

## SSSOM ontology mappings

SSSOM (Simple Standard for Sharing Ontology Mappings) files can be applied to
`schema.yaml` permissible values using `-s`.  SSSOM maps `subject_id` values
matching a permissible value's `meaning` field to LinkML mapping attributes:

| SSSOM predicate | LinkML attribute |
|---|---|
| `skos:closeMatch` | `close_mappings` |
| `skos:broadMatch` | `broad_mappings` |
| `skos:narrowMatch` | `narrow_mappings` |
| `skos:exactMatch` | `exact_mappings` |
| `skos:relatedMatch` | `related_mappings` |

See https://github.com/mapping-commons/sssom/ and
https://www.w3.org/TR/skos-reference/#mapping for the SSSOM and SKOS mapping
specifications.

---

## Module structure

| Module | Responsibility |
|---|---|
| `menu_manager.py` | CLI entry point; `build_schema`, `add_source`, `process_sources`, `expand_reachable_from` |
| `source_utils.py` | Shared utilities: HTML parsing, YAML output, config management, prefix helpers |
| `source_linkml.py` | `content_type: LinkML` — YAML schema processing and `match_linkml` detection |
| `source_owl.py` | `content_type: OWL` — owlready2 class traversal and `match_owl` detection |
| `source_ontologyapi.py` | `content_type: OntologyAPI` — OLS4 / BioPortal / AGROVOC graph fetching and processing |
| `source_agrovoc.py` | AGROVOC SPARQL fetchers and `match_agrovoc` detection |
| `source_loinc.py` | LOINC CodeSystem / ValueSet JSON conversion and HL7 table parsing |
| `source_nsdb.py` | National Soil DataBase HTML parsing |
| `source_statscan.py` | Statistics Canada classification page scraping |
| `source_napcscanada.py` | NAPCS Canada CSV parsing |
| `source_agrifoodca.py` | AgriFoodCA picklist CSV parsing and GitHub directory import |
