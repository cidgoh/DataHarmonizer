# AgriFoodCA picklists — source coverage report

**Total CSV files: 41**
**Repository:** https://github.com/agrifooddatacanada/picklists_for_schemas/tree/main/picklists

---

## Already addable via `-a` (4 files)

These files have source URLs pointing to NSDB SNT pages, which `match_nsdb_snt` already handles automatically.

| File | Source URL | Status |
|---|---|---|
| `water_table_characteristics.csv` | https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/watertbl.html | Already in system as `NSDBSNT_WATERTBL` |
| `soil_drainage.csv` | https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/drainage.html | Addable as NSDBSNT |
| `parent_material_chemical_property.csv` | https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/pmchem1.html | Addable as NSDBSNT |
| `parent_material_texture.csv` | https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/pmtex1.html | Addable as NSDBSNT |

Note: The AgriFoodCA versions may have different or simplified value sets compared to the full NSDB SNT pages.

---

## StatsCan URL ADUJSTED — addable (1 file)

The source URL is a census dictionary definition page (`www12.statcan.gc.ca/census-recensement/...`),
not the `imdb/p3VD.pl?Function=getVD&TVD=…` pattern that `match_statscan` requires.

| File | Source URL |
|---|---|
| `education_level_stats_can.csv` | https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1313722 |


---

## LinkML valuesets StandardsMaturityLevel ADUJSTED - addable (1 file)

| File | Source URL | Note |
|---|---|---|
| `standards_stages.csv` | https://linkml.io/valuesets/elements/StandardsMaturityLevel |

---

## External, non-supported sources (19 files)

These have source URLs but they are academic papers, PDFs, or generic websites.
The AgriFoodCA CSV is the actual curation layer — there is no structured upstream
data to add via `-a`.

### USDA NRCS (3 files)

| File | Title | Source URL |
|---|---|---|
| `soil_ph.csv` | Soil pH class | https://www.nrcs.usda.gov/sites/default/files/2022-10/soil_ph.pdf |
| `soil_salinity.csv` | Soil salinity class (ECe) | https://www.nrcs.usda.gov/sites/default/files/2022-10/Soil%20Electrical%20Conductivity.pdf |
| `soil_texture.csv` | Soil texture class | https://www.nrcs.usda.gov/ |

### UCAnR/UC Davis PDFs (7 files)

All sourced from the same UC Anr publication (`https://ucanr.edu/?legacy-file=29072.pdf`) or similar.

| File | Title |
|---|---|
| `soil_carton-to-nitrogen_ratio.csv` | Carbon-to-Nitrogen ratio class |
| `soil_effective_rooting_depth.csv` | Effective rooting depth class |
| `soil_fertility.csv` | Soil fertility class |
| `soil_mineral_content_type.csv` | Soil mineral content type |
| `soil_organic_matter.csv` | Soil organic matter class |
| `soil_salinity_type.csv` | Soil salinity type (dominant anion) |
| `soil_colloid_fraction.csv` | Soil colloid fraction class |

### biologydiscussion.com (5 files)

All sourced from https://www.biologydiscussion.com/soil/physical-and-chemical-properties-of-soil/7220.

| File | Title |
|---|---|
| `soil_compressibility.csv` | Soil compressibility class |
| `soil_erodibility.csv` | Soil erodibility class |
| `soil_permeability.csv` | Soil permeability class |
| `soil_plasticity.csv` | Soil plasticity class |
| `soil_porosity.csv` | Soil porosity class |

### Other external (4 files)

| File | Title | Source URL |
|---|---|---|
| `lodging_wheat.csv` | Wheat Lodging | https://link.springer.com/article/10.1186/s12870-025-07322-y |
| `soil_aeration_status.csv` | Soil aeration status | https://static.ixambee.com/public/miscellaneous-pdf/physical_and_chemical_properties_of_soil1720241418.pdf |
| `soil_sodicity.csv` | Soil sodicity class (SAR/ESP) | https://www.undrr.org/understanding-disaster-risk/terminology/hips/en0303 |
| `soil_structure.csv` | Soil structure type | https://iastate.pressbooks.pub/introsoilscience/chapter/soilstructure/ |

---

## No source URL (16 files)

Custom or generic picklists with no upstream data source identified in the metadata.

| File | Title | Note |
|---|---|---|
| `agreement_scale.csv` | Agreement scale | |
| `canadian_provinces.csv` | Canadian Provinces | Possibly covered by `STATSCAN1368814` (SGC 2021) |
| `comfort_level.csv` | Comfort level scale | |
| `concept_awareness.csv` | Awareness of concept | |
| `data_quality_codes.csv` | Data Quality Codes | |
| `days.csv` | Days | |
| `education_level.csv` | Education level | |
| `eight_point_cardinality.csv` | Eight Point Cardinality | |
| `frequency.csv` | Frequency scale | |
| `gender.csv` | Gender identity | Possibly covered by `STATSCAN1326727` (Classification of gender) |
| `household_composition.csv` | Household structure | |
| `months.csv` | Months | |
| `sixteen_point_cardinality.csv` | Sixteen Point Cardinality | |
| `soil_bulk_density.csv` | Bulk density class | |
| `support_concept.csv` | Support scale | |
| `thirty_two_point_cardinality.csv` | Thirty-two Point Cardinality | |

---

## Summary

| Category | Count |
|---|---|
| Already in system (NSDB SNT) | 1 |
| Addable via `-a` now (NSDB SNT) | 3 |
| StatsCan URL but wrong pattern for `-a` | 1 |
| LinkML valuesets overlap (maturity_levels excluded) | 1 |
| External non-structured sources (PDFs, websites) | 19 |
| No source URL | 16 |
| **Total** | **41** |

The 19 external-source soil property files are the main group to evaluate: they are
original AgriFoodCA curation work with no structured upstream data URL that could be
added via `-a`. For these, the AgriFoodCA CSV is the authoritative source and the
current `source_agrifoodca.py` module handles them directly.
