#!/usr/bin/env python3
# Authors: Damion Dooley and Claude (Anthropic claude-sonnet-4-6)
#
# TODO: The -l lookup function currently assumes subClassOf object property
# traversal when expanding reachable_from.source_nodes.
# Dynamic enumeration of reachable_from relationship_types (e.g. partOf,
# hasPart, etc.) has not yet been implemented.
#
#
# Usage examples:
#   Build or update schema.yaml with default LinkML top-level structure:
#     python menu_manager.py -b
#
#   Fetch (download) sources — -f behaviour:
#     python menu_manager.py -f all          # fetch every source in menu_config.yaml
#     python menu_manager.py -f KEY1 KEY2    # fetch only the named source(s)
#     python menu_manager.py -c KEY -f       # fetch only the source(s) listed with -c
#     python menu_manager.py -f              # no-op; prints reminder to use -f all or -c
#
#   Generate enum report for all sources in menu_config.yaml:
#     python menu_manager.py -r
#
#   Either of the above with tab-delimited output:
#     python menu_manager.py -f -t
#     python menu_manager.py -r -t
#
#   Expand reachable_from.source_nodes enums via API — always operates on schema.yaml:
#     python menu_manager.py -l                    # expand all enums with reachable_from.source_nodes
#     python menu_manager.py -l linkml_valuesets   # expand enums imported_from a named source
#     python menu_manager.py -l MyBiomeEnum        # expand one enum by name
#     python menu_manager.py -l linkml_valuesets MyBiomeEnum  # source key and enum name mixed
#
#   The API used for each ontology prefix is determined by the menu_config.yaml
#   'apis' block (see DEFAULT_CONFIG_COMMENTS).  OLS4 is the default fallback.
#   BioPortal requires an apikey in the apis > bioportal > type > rest > apikey field.
#   Agrovoc has its own API, either a sparql endpoint (implemented), or a 
#   skosimos API (not implemented).  It is possible to add Agrovoc directly
#   as a file but it is 60Mb+. 
#
#   Full refresh — fetch all sources, process into source YAMLs, rebuild schema.yaml:
#     python menu_manager.py -f all -c -b
#
#   Add a new source from a URL (auto-detects type, adds to menu_config.yaml, and processes it):
#     python menu_manager.py -a https://example.org/some-valueset.json
#
#   Update menu_config.yaml with prefix dicts from all sources:
#     python menu_manager.py -c
#
#   Update menu_config.yaml for only the linkml_valuesets source:
#     python menu_manager.py -c linkml_valuesets
#
#   Build schema.yaml (sync enums and prefixes from all sources):
#     python menu_manager.py -b
#
#   Note: when -b detects that an enum present in schema.yaml is no longer
#   in its source file, it reports the enum key rather than deleting it.
#   This gives the menu manager the opportunity to manually review whether
#   the menu item should be removed from their system or retained.
#
#   Regenerate menu_config.yaml from scratch with -a (one source per call):
#
#     # linkml_valuesets (LinkML)
#     python menu_manager.py -a https://raw.githubusercontent.com/linkml/valuesets/refs/heads/main/src/valuesets/merged/merged_hierarchy.yaml
#
#     # FUTURE: SNOMED VIA OLS4
#     # http://snomed.info/id/128603005 
#     # https://www.ebi.ac.uk/ols4/api/ontologies/snomed/terms/http%253A%252F%252Fsnomed.info%252Fid%252F128603005/graph?lang=fr
#     # https://snowstorm.ihtsdotools.org/snowstorm/snomed-ct/swagger-ui/index.html
#     # python3 menu_manager.py -a "https://snowstorm.ihtsdotools.org/snowstorm/snomed-ct/MAIN/concepts/762766007/descendants?limit=2296"
#
#   Add Loinc CodeSsytems & Valuesets by supplying the raw json link:
#
#     # LOINCDataAbsentReason (LOINCCodeSystem)
#     python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/CodeSystem-data-absent-reason.json
#
#     # LOINCPersonalPronouns (LOINCValueSet)
#     python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/ValueSet-pronouns.json
#
#     # LOINCGenderIdentity (LOINCValueSet)
#     python menu_manager.py -a https://terminology.hl7.org/en/ValueSet-gender-identity.json
#
#     # NSDBSoilNameAndLayerV2 (NSDB) — National Soil DataBase, combined Soil Name Table + Soil Layer Table
#     python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/index.html
#
#     # NSDBSNTv2 (NSDBSNT) — National Soil DataBase, Soil Name Table
#     python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/index.html
#
#     # NSDBSLTv2 (NSDBSLT) — National Soil DataBase, Soil Layer Table
#     python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/slt/index.html
#
#     # NSDBSLCv3_2 (NSDBSLC) — National Soil DataBase, Soil Landscapes of Canada
#     python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/slc/v3.2/index.html
#
#     # LOINCValuesets (LOINC valueset listing page — run -c after to fetch all enums)
#     python menu_manager.py -a https://terminology.hl7.org/en/valuesets.html
#
#   Fetch enum YAML for a STATSCAN source (follows each classification code's
#   Display structure and Display definitions pages to build the full hierarchy):
#   Get variable page URI from https://www.statcan.gc.ca/en/concepts/search, by 
#   clicking on a variable name.
#
#     python menu_manager.py -a "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1368814"
#     python menu_manager.py -c STATSCAN1441857
#    
#   North American Product Classification System (NAPCS) Canada 2022 Version 1.0
#   See https://www.statcan.gc.ca/en/subjects/standard/napcs/2022/index
#   and csv version: https://www.statcan.gc.ca/en/media/5274
#   USA: See https://www.census.gov/naics/napcs/?8976654?yearbck=2022
#   Mexico: https://www.inegi.org.mx/contenidos/app/scpm/scpm_completo.xlsx
#
#   Add and process a NAPCSCanada source (content_type auto-detected from CSV headers;
#   year is extracted from the URL to form the source key):
#     python menu_manager.py -a "https://www.statcan.gc.ca/en/media/5274"
#     python menu_manager.py -c NAPCSCanada2022
#
#   The optional "concise: true" source attribute (in menu_config.yaml) trims
#   redundant hierarchy nodes during -b build.  A node is dropped when its
#   title exactly matches its parent's title — the child adds no new label —
#   and any grandchildren are re-wired to the nearest surviving ancestor.
#   Currently supported for content_type: NAPCSCanada.
#
#   Example: a NAPCS hierarchy where class "011" (title "Crop products") has
#   a child "0110" also titled "Crop products" — the child is redundant and
#   is dropped.  Any codes that had is_a: "0110" are re-wired to is_a: "011".
#
#   In menu_config.yaml:
#     NAPCSCanada2022:
#       content_type: NAPCSCanada
#       concise: true
#       ...
#
#   To build without concise filtering (keep all nodes), omit the attribute
#   or set concise: false.
#
#   OWL ontologies (content_type: OWL) require owlready2 (pip install owlready2).
#   The source file is saved as sources/{key}.text regardless of original suffix.
#   Auto-detected from URL extension (.owl, .ofn, .rdf, .ttl) or file content:
#
#     python menu_manager.py -a https://purl.obolibrary.org/obo/envo.owl
#
#   The optional minus/include concept lists in menu_config.yaml filter OWL
#   classes by their English rdfs:label (case-insensitive).  minus removes a
#   class and its entire subtree; include restores specific labels even when
#   an ancestor was excluded (re-wiring children to the nearest kept ancestor):
#
#     Envo:
#       content_type: OWL
#       file_format: text
#       reachable_from:
#         source_ontology: https://purl.obolibrary.org/obo/envo.owl
#       minus:
#         concepts: [environmental feature, quality]
#       include:
#         concepts: [water body]
#

import argparse
import csv
import datetime
import html
import json
import os
import re
import sys
import tempfile
import urllib.parse
import urllib.request
from collections import defaultdict
import yaml

# Locate companion source_* modules in script/menu_manager/ regardless of CWD.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "menu_manager"))

from source_ontologyapi import (
    iri_to_curie,
    get_ols4_inner_iri,
    fetch_api_graph,
    process_skos_source,
    match_snomed,
)
from source_linkml import (
    apply_sorted_prefixes,
    process_linkml_source,
    match_linkml,
)
from source_owl import (
    _extract_owl_metadata,
    process_owl_source,
    match_owl,
)
from source_agrovoc import (
    _fetch_agrovoc_concept_info,
    _fetch_agrovoc_sparql_graph,
    match_agrovoc,
)
from source_napcscanada import (
    process_napcscanada_source,
    match_napcs_csv,
)
from source_agrifoodca import (
    process_agrifood_source,
    match_agrifood_csv,
    match_agrifood_dir,
)
from source_statscan import (
    statscan_fr_url,
    parse_statscan_definitions,
    parse_statscan_structure,
    process_statscan_source,
    match_statscan,
)
from source_loinc import (
    to_camel_case,
    collect_loinc_concepts,
    convert_loinc_codesystem_to_linkml,
    collect_loinc_valueset_concepts,
    convert_loinc_valueset_to_linkml,
    parse_loinc_table_page,
    parse_loinc_valueset_html_page,
    fill_loinc_source_metadata,
    process_loinc_table_source,
    match_loinc_table,
)
from source_nsdb import (
    nsdb_fr_url,
    find_section_paragraph,
    find_links_by_text,
    find_named_section_links,
    find_contents_table_links,
    find_list_section_links,
    parse_attribute_page,
    process_nsdb_html_source,
    process_nsdb_source,
    match_nsdb_snt,
    match_nsdb_slt,
    match_nsdb_soil,
    match_nsdb_slc,
)
from source_nrcs import (
    process_nrcs_source,
    match_nrcs,
)
from source_utils import (
    MENU_CONFIG,
    BROWSER_HEADERS,
    IndentedDumper,
    strip_tags,
    fetch_html,
    sort_prefixes,
    make_config_schema,
    add_permissible_value,
    _make_locale_extensions,
    find_description_before_table,
    find_labeled_field,
    to_pascal_case_key,
    make_source_entry,
    write_config,
    update_source_config,
    rename_source_key,
    keys_from_minus,
    is_curie,
)

# SSSOM predicate_id → LinkML permissible_value attribute name.
# See https://github.com/mapping-commons/sssom/ for the SSSOM specification
# and https://www.w3.org/TR/skos-reference/#mapping for SKOS mapping properties.
SSSOM_PREDICATE_MAP = {
    "skos:closeMatch":   "close_mappings",
    "skos:broadMatch":   "broad_mappings",
    "skos:narrowMatch":  "narrow_mappings",
    "skos:exactMatch":   "exact_mappings",
    "skos:relatedMatch": "related_mappings",
}

DEFAULT_CONFIG_COMMENTS = [
    'See docs on "reachable_from": https://linkml.io/linkml-model/latest/docs/reachable_from/',
    "Config below doesn't support LinkML dynamic enumeration \"inherits\", and is limited custom version of LinkML dynamic enumerations, not quite in context of LinkML schema.",
    'Note that "minus" list is implemented before "includes" list, which restores subordinate items that would otherwise have been eliminated by minus list items and their underlying items.',
    "See https://linkml.io/linkml-model/latest/docs/EnumExpression/",
    "Here 'reachable_from' is acted on via 'menu_manager.py -c' configuration to generate the LinkML .yaml schema file for the given source.  Over in schema.yaml, 'reachable_from' is acted on via 'menu_manager.py -l' for lookup function to populate schema.yaml enums.",
    "The optional top-level 'apis' object configures API endpoints for the -l lookup function.",
    "Each key is a service name (e.g. 'ols', 'bioportal', 'agrovoc') with a 'type' sub-object",
    "containing protocol-keyed configs (e.g. 'rest', 'sparql'), each with 'uri' and optional 'apikey',",
    "plus an 'ontologies' list.  The -l lookup routes each CURIE prefix to the first api whose",
    "'ontologies' list contains it; falls back to OLS4.",
    "Example apis block:",
    "  apis:",
    "    ols:",
    "      type:",
    "        rest:",
    "          uri: http://www.ebi.ac.uk/ols4/api/ontologies/{ontology}/terms/{double_encoded}/graph",
    "      ontologies: [ENVO, GO, UBERON]",
    "    bioportal:",
    "      type:",
    "        rest:",
    "          uri: https://data.bioontology.org",
    "          apikey: YOUR_BIOPORTAL_KEY",
    "      ontologies: [MESH, NCIT, SNOMEDCT]",
    "    agrovoc:",
    "      type:",
    "        sparql:",
    "          uri: https://agrovoc.fao.org/sparql/",
    "      ontologies: [agrovoc]",
]


def enum_in_minus(enum_key, enum_def, minus_set):
    """Return True if enum_key or its annotations source_domain/source_schema match minus_set."""
    if not minus_set:
        return False
    if enum_key in minus_set:
        return True
    ann = (enum_def.get("annotations") or {}) if enum_def else {}
    return ann.get("source_domain") in minus_set or ann.get("source_schema") in minus_set



def update_download_date(source_key, config_file=MENU_CONFIG):
    """Update the download_date for a source entry in menu_config.yaml."""
    update_source_config(source_key, {"download_date": datetime.date.today().isoformat()}, config_file)


def _load_sssom(path_or_uri):
    """Load a SSSOM (Simple Standard for Sharing Ontology Mappings) TSV file.

    SSSOM is a community standard for representing ontology/vocabulary mappings
    in a tabular format.  See https://github.com/mapping-commons/sssom/ for the
    full specification.

    The file may begin with '#'-prefixed metadata lines (including an embedded
    YAML curie_map block) followed by a tab-separated header row and data rows.
    Required columns: subject_id, predicate_id, object_id.
    Other columns (subject_label, object_label, match_type, Comments, …) are
    allowed by the standard and are preserved in each row dict but not used here.

    path_or_uri: local file path or http/https URL.

    Returns a dict {subject_id: [row_dict, …]} indexed by subject_id for fast
    lookup.  Rows whose subject_id is empty are silently skipped.
    """
    import csv, io

    if path_or_uri.startswith(("http://", "https://")):
        req = urllib.request.Request(path_or_uri, headers=BROWSER_HEADERS)
        with urllib.request.urlopen(req) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            content = resp.read().decode(charset, errors="replace")
    else:
        with open(path_or_uri, "r", encoding="utf-8") as f:
            content = f.read()

    # Strip leading '#' metadata/comment lines; the first non-comment line is
    # the TSV header.
    data_lines = [ln for ln in content.splitlines() if not ln.startswith("#")]
    if not data_lines:
        return {}

    index = {}
    reader = csv.DictReader(io.StringIO("\n".join(data_lines)), delimiter="\t")
    for row in reader:
        subject_id = (row.get("subject_id") or "").strip()
        if subject_id:
            index.setdefault(subject_id, []).append(row)
    return index


def apply_sssom_mappings(predicates=None, schema_file="schema.yaml", config_file=MENU_CONFIG):
    """Apply SSSOM ontology mappings to permissible_values in schema.yaml.

    Reads SSSOM files listed in the top-level 'sssom' array of menu_config.yaml
    (each entry may be a local relative path or an http/https URL), then for
    every permissible_value in schema.yaml whose 'meaning' field matches a
    subject_id in the SSSOM data, writes the matching object_id values into the
    appropriate mapping attribute on the permissible_value.

    SSSOM predicate_id → LinkML permissible_value attribute:
      skos:closeMatch   → close_mappings
      skos:broadMatch   → broad_mappings
      skos:narrowMatch  → narrow_mappings
      skos:exactMatch   → exact_mappings
      skos:relatedMatch → related_mappings

    predicates: list of predicate_id strings to apply (e.g. ['skos:closeMatch']).
                Pass None or [] to apply all five.
    """
    with open(config_file, "r") as f:
        config = yaml.safe_load(f) or {}

    sssom_files = config.get("sssom") or []
    if not sssom_files:
        print("No 'sssom' files listed in menu_config.yaml — nothing to apply", file=sys.stderr)
        return

    # Resolve which predicates to apply
    if predicates:
        unknown = [p for p in predicates if p not in SSSOM_PREDICATE_MAP]
        for p in unknown:
            print(
                f"Warning: unknown predicate '{p}' — valid values: "
                f"{', '.join(SSSOM_PREDICATE_MAP)}",
                file=sys.stderr,
            )
        active = {p: SSSOM_PREDICATE_MAP[p] for p in predicates if p in SSSOM_PREDICATE_MAP}
    else:
        active = dict(SSSOM_PREDICATE_MAP)

    if not active:
        print("No valid predicates to apply — aborting", file=sys.stderr)
        return

    # Load and merge all SSSOM files into one index
    sssom_index = {}
    for sssom_path in sssom_files:
        try:
            partial = _load_sssom(sssom_path)
            for subj, rows in partial.items():
                sssom_index.setdefault(subj, []).extend(rows)
            print(f"Loaded SSSOM: {len(partial)} subject IDs from {sssom_path}")
        except Exception as _e:
            print(f"Warning: could not load SSSOM file '{sssom_path}': {_e}", file=sys.stderr)

    if not sssom_index:
        print("No SSSOM mappings loaded — nothing to apply")
        return

    if not os.path.exists(schema_file):
        print(f"{schema_file} not found — run -b first", file=sys.stderr)
        return

    with open(schema_file, "r") as f:
        schema = yaml.safe_load(f) or {}

    mapping_counts = {attr: 0 for attr in active.values()}
    pv_updated = 0

    for enum_def in (schema.get("enums") or {}).values():
        if not isinstance(enum_def, dict):
            continue
        pvs = enum_def.get("permissible_values") or {}
        for pv_code, pv in pvs.items():
            meaning = (pv or {}).get("meaning", "")
            if not meaning:
                continue
            rows = sssom_index.get(meaning, [])
            if not rows:
                continue
            changed = False
            pv = dict(pv)  # copy before mutating
            for predicate, attr in active.items():
                object_ids = [
                    r["object_id"].strip()
                    for r in rows
                    if r.get("predicate_id", "").strip() == predicate
                    and r.get("object_id", "").strip()
                ]
                if object_ids:
                    pv[attr] = object_ids
                    mapping_counts[attr] += len(object_ids)
                    changed = True
            if changed:
                pvs[pv_code] = pv
                pv_updated += 1

    with open(schema_file, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"Updated {schema_file}: {pv_updated} permissible_value(s) received mappings")
    for attr, count in mapping_counts.items():
        if count:
            print(f"  {attr}: {count} mapping(s)")


def build_schema(schema_file="schema.yaml", config_file=MENU_CONFIG, keys=None):
    """Create or update schema.yaml with LinkML top-level structure, enums, and prefixes.

    On creation, populates default values. On update, only adds keys that are
    missing — existing values are preserved.

    Syncs enums from each source's yaml file in the sources/ folder:
    - Upserts enums tagged with imported_from into schema["enums"].
    - Reports enums no longer present in their source for manual review.

    Syncs prefixes from all sources stored in menu_config.yaml:
    - Upserts prefix key+URI pairs from each source's 'prefixes' dict.
    - Removes schema prefixes absent from every source's stored prefix list.
    - Warns if any source has no stored prefix list (run -p to populate).
    - Sorts prefixes alphabetically (case-insensitive) and warns on case variants.
    """
    folder = os.path.basename(os.path.abspath("."))

    defaults = {
        "id": f"https://example.org/{folder}",
        "name": "example_name",
        "title": "Example title",
        "description": "Example description ...",
        "version": "",
        "license": "CC0",
        "prefixes": {"anthropics": "https://github.com/anthropics/"},
        "default_prefix": "menu",
        "imports": ["linkml:types"],
        "slots": {},
        "enums": {}
    }

    if os.path.exists(schema_file):
        with open(schema_file, "r") as f:
            schema = yaml.safe_load(f) or {}
        for key, value in defaults.items():
            if key not in schema:
                schema[key] = value
        action = "Updated"
    else:
        schema = defaults
        action = "Created"

    # Sync enums and prefixes from menu_config.yaml sources
    prefix_conflicts = []  # collected at end for stdout summary
    if os.path.exists(config_file):
        with open(config_file, "r") as f:
            config = yaml.safe_load(f) or {}
        all_sources = config.get("sources", {})

        # Sync enums from each source's yaml file into schema
        sources_to_build = {k: v for k, v in all_sources.items() if keys is None or k in keys}
        if keys:
            missing = [k for k in keys if k not in all_sources]
            for k in missing:
                print(f"Warning: source key '{k}' not found in {config_file}", file=sys.stderr)
        for key, source in sources_to_build.items():
            source_path = f"sources/{key}.yaml"
            if not os.path.exists(source_path):
                print(f"Skipping {key} enums: {source_path} not found — run -f and -p first", file=sys.stderr)
                continue

            with open(source_path, "r") as f:
                source_data = yaml.safe_load(f)

            # Build full prefix map for this source (source YAML + any config additions).
            # Only prefixes actually referenced in permissible_value meanings are added
            # to schema — avoids polluting schema.yaml with unused namespace declarations.
            source_prefix_map = {
                **(source_data.get("prefixes") or {}),
                **(source.get("prefixes") or {}),
            }
            for enum_def in (source_data.get("enums") or {}).values():
                for pv in ((enum_def or {}).get("permissible_values") or {}).values():
                    meaning = (pv or {}).get("meaning", "")
                    if is_curie(meaning):
                        pfx = meaning.split(":")[0]
                        if pfx not in source_prefix_map:
                            continue
                        new_uri = source_prefix_map[pfx]
                        if pfx in schema["prefixes"]:
                            if schema["prefixes"][pfx] != new_uri:
                                prefix_conflicts.append(
                                    f"  prefix conflict: '{pfx}' already mapped to "
                                    f"'{schema['prefixes'][pfx]}' but '{key}' requires "
                                    f"'{new_uri}' — skipping"
                                )
                        else:
                            schema["prefixes"][pfx] = new_uri

            source_enums = source_data.get("enums") or {}
            enum_added = enum_updated = enum_reported = enum_excluded = enum_deleted = enum_conflicts = 0
            enum_concepts_included = enum_pvs_included = 0

            minus = source.get("minus") or {}
            minus_concepts = keys_from_minus(minus.get("concepts"))
            minus_pvs = keys_from_minus(minus.get("permissible_values"))
            minus_status = keys_from_minus(minus.get("status"))

            include = source.get("include") or {}
            include_concepts = keys_from_minus(include.get("concepts"))
            include_pvs = keys_from_minus(include.get("permissible_values"))

            # include without minus → implicit "exclude all, restore only listed"
            exclude_all_concepts = bool(include_concepts) and not minus_concepts
            exclude_all_pvs = bool(include_pvs) and not minus_pvs

            # Pre-compute empty enums (no permissible_values or reachable_from, not
            # minus-excluded or include-excluded) so is_a references to them can be
            # cleaned up in the copy loop regardless of iteration order.
            empty_enum_set = {
                ek for ek, ev in source_enums.items()
                if not enum_in_minus(ek, ev, minus_concepts)
                and not (exclude_all_concepts and not enum_in_minus(ek, ev, include_concepts))
                and not (ev or {}).get("permissible_values")
                and not (ev or {}).get("reachable_from")
            }
            empty_enum_names = sorted(empty_enum_set)

            existing_from_source = {
                k for k, v in schema["enums"].items()
                if isinstance(v, dict)
                and isinstance(v.get("annotations"), dict)
                and v["annotations"].get("imported_from") == key
            }

            # Delete from schema any excluded enums whose source_file matches
            # this source, so stale entries are cleaned up on re-build.
            if minus_concepts or exclude_all_concepts:
                for enum_key in list(schema["enums"]):
                    existing_def = schema["enums"][enum_key]
                    excluded = (
                        enum_in_minus(enum_key, existing_def, minus_concepts)
                        or (exclude_all_concepts
                            and not enum_in_minus(enum_key, existing_def, include_concepts))
                    )
                    if not excluded:
                        continue
                    ann = (existing_def.get("annotations") or {})
                    if ann.get("source_file") == source_path:
                        del schema["enums"][enum_key]
                        enum_deleted += 1

            for enum_key, enum_def in source_enums.items():
                if (enum_in_minus(enum_key, enum_def, minus_concepts)
                        or (exclude_all_concepts
                            and not enum_in_minus(enum_key, enum_def, include_concepts))):
                    enum_excluded += 1
                    continue
                if enum_key in empty_enum_set:
                    continue
                enum_def = dict(enum_def) if enum_def else {}
                if enum_def.get("is_a") in empty_enum_set:
                    del enum_def["is_a"]
                if enum_def.get("status"):
                    enum_def["status"] = str(enum_def["status"]).upper()
                if (minus_pvs or exclude_all_pvs) and enum_def.get("permissible_values"):
                    enum_def["permissible_values"] = {
                        k: v for k, v in enum_def["permissible_values"].items()
                        if k not in minus_pvs
                        and (not exclude_all_pvs or k in include_pvs)
                    }
                if (minus_status and source.get("content_type") == "OWL"
                        and enum_def.get("permissible_values")):
                    enum_def["permissible_values"] = {
                        k: v for k, v in enum_def["permissible_values"].items()
                        if (v or {}).get("status") not in minus_status
                    }

                # concise: true — for supported content types, drop any permissible_value
                # whose title is identical to its parent's title, then re-wire is_a
                # references that pointed to a dropped entry up to the nearest surviving
                # ancestor so the hierarchy remains consistent.
                if (source.get("concise")
                        and source.get("content_type") in {"NAPCSCanada"}
                        and enum_def.get("permissible_values")):
                    pvs = enum_def["permissible_values"]
                    title_by_code  = {c: (pv or {}).get("title", "") for c, pv in pvs.items()}
                    parent_by_code = {c: (pv or {}).get("is_a")       for c, pv in pvs.items()}

                    # Entries to drop: has a parent AND shares the parent's title
                    dropped = {
                        c for c, pv in pvs.items()
                        if parent_by_code.get(c)
                        and title_by_code.get(c)
                        and title_by_code.get(c) == title_by_code.get(parent_by_code[c])
                    }

                    if dropped:
                        def _resolve_ancestor(code, _seen=None):
                            """Walk is_a chain (original parents) to first non-dropped ancestor."""
                            if _seen is None:
                                _seen = set()
                            p = parent_by_code.get(code)
                            if p is None or p in _seen:
                                return None
                            if p not in dropped:
                                return p
                            _seen.add(p)
                            return _resolve_ancestor(p, _seen)

                        new_pvs = {}
                        for code, pv in pvs.items():
                            if code in dropped:
                                continue
                            pv = dict(pv) if pv else {}
                            if pv.get("is_a") in dropped:
                                ancestor = _resolve_ancestor(code)
                                if ancestor:
                                    pv["is_a"] = ancestor
                                else:
                                    pv.pop("is_a", None)
                            new_pvs[code] = pv
                        enum_def["permissible_values"] = new_pvs
                        print(f"  concise: dropped {len(dropped)} redundant pv(s) from {enum_key}")

                if source.get("see_also"):
                    enum_def["see_also"] = source["see_also"]

                annotations = dict(enum_def.get("annotations") or {})
                annotations["imported_from"] = key
                annotations["source_file"] = source_path
                enum_def["annotations"] = annotations

                # For each language present in the source YAML's extensions.locales.value,
                # carry translated permissible_values for surviving codes into the
                # matching schema["extensions"]["locales"]["value"][lang]["enums"] block.
                _source_locales = (
                    (source_data.get("extensions") or {})
                    .get("locales", {})
                    .get("value", {})
                )
                if _source_locales:
                    surviving_codes = set(enum_def.get("permissible_values") or {})
                    for lang, _lang_locale in _source_locales.items():
                        _lang_pvs_all = (
                            (_lang_locale.get("enums") or {})
                            .get(enum_key, {})
                            .get("permissible_values") or {}
                        )
                        if not _lang_pvs_all:
                            continue
                        _lang_pvs = {c: pv for c, pv in _lang_pvs_all.items()
                                     if c in surviving_codes}
                        if not _lang_pvs:
                            continue
                        _ext  = schema.setdefault("extensions", {})
                        _loc  = _ext.setdefault("locales", {"tag": "locales", "value": {}})
                        _lang = _loc.setdefault("value", {}).setdefault(lang, {
                            "id":          schema.get("id", ""),
                            "name":        schema.get("name", ""),
                            "title":       schema.get("title", ""),
                            "description": schema.get("description", ""),
                            "in_language": lang,
                            "enums":       {},
                        })
                        _lang.setdefault("enums", {})[enum_key] = {"permissible_values": _lang_pvs}

                if enum_key not in schema["enums"]:
                    schema["enums"][enum_key] = enum_def
                    enum_added += 1
                else:
                    existing_annotations = schema["enums"][enum_key].get("annotations") or {}
                    existing_source_file = existing_annotations.get("source_file", "")
                    if existing_source_file and existing_source_file != source_path:
                        print(
                            f"  Error: enum '{enum_key}' already defined in '{existing_source_file}';"
                            f" '{source_path}' also defines it — skipping",
                            file=sys.stderr
                        )
                        enum_conflicts += 1
                    elif schema["enums"][enum_key] != enum_def:
                        schema["enums"][enum_key] = enum_def
                        enum_updated += 1

            # Report enums gone from source (but not intentionally excluded via minus)
            for enum_key in sorted(existing_from_source - set(source_enums.keys())):
                if enum_in_minus(enum_key, schema["enums"].get(enum_key), minus_concepts):
                    continue
                print(f"  Review: '{enum_key}' is no longer in {key} source — remove manually if no longer needed")
                enum_reported += 1

            # Second pass: restore concepts and permissible_values listed in include,
            # overriding any minus exclusions for those specific items.
            if include_concepts:
                for concept_label in include_concepts:
                    # Match by direct enum key first, then by source_schema/source_domain annotation
                    if concept_label in source_enums:
                        matched = [(concept_label, source_enums[concept_label])]
                    else:
                        matched = [
                            (ek, ev) for ek, ev in source_enums.items()
                            if (ev or {}).get("annotations", {}).get("source_schema") == concept_label
                            or (ev or {}).get("annotations", {}).get("source_domain") == concept_label
                        ]
                    if not matched:
                        print(f"  Warning: include concept '{concept_label}' not found in {source_path}", file=sys.stderr)
                        continue
                    for enum_key, raw_def in matched:
                        enum_def = dict(raw_def) if raw_def else {}
                        if enum_def.get("status"):
                            enum_def["status"] = str(enum_def["status"]).upper()
                        if enum_def.get("permissible_values"):
                            pvs = {k: v for k, v in enum_def["permissible_values"].items()
                                   if k not in minus_pvs or k in include_pvs}
                            enum_def["permissible_values"] = pvs
                        if source.get("see_also"):
                            enum_def["see_also"] = source["see_also"]
                        annotations = dict(enum_def.get("annotations") or {})
                        annotations["imported_from"] = key
                        annotations["source_file"] = source_path
                        enum_def["annotations"] = annotations
                        schema["enums"][enum_key] = enum_def
                        enum_concepts_included += 1

            if include_pvs:
                for enum_key, existing_def in schema["enums"].items():
                    ann = (existing_def.get("annotations") or {})
                    if ann.get("source_file") != source_path:
                        continue
                    orig_pvs = (source_enums.get(enum_key) or {}).get("permissible_values") or {}
                    current_pvs = dict(existing_def.get("permissible_values") or {})
                    for pv_key in include_pvs:
                        if pv_key in orig_pvs and pv_key not in current_pvs:
                            current_pvs[pv_key] = orig_pvs[pv_key]
                            enum_pvs_included += 1
                    existing_def["permissible_values"] = current_pvs

            parts = [f"{enum_added} added", f"{enum_updated} updated", f"{enum_reported} flagged for review"]
            if enum_deleted:
                parts.append(f"{enum_deleted} deleted (minus)")
            if enum_excluded:
                parts.append(f"{enum_excluded} excluded (minus)")
            if empty_enum_names:
                parts.append(f"{len(empty_enum_names)} empty (skipped)")
            if enum_conflicts:
                parts.append(f"{enum_conflicts} conflicts (skipped)")
            if enum_concepts_included:
                parts.append(f"{enum_concepts_included} concepts restored (include)")
            if enum_pvs_included:
                parts.append(f"{enum_pvs_included} permissible values restored (include)")
            print(f"{key}: enums {', '.join(parts)}")
            if empty_enum_names:
                print(f"  Skipped — no permissible_values or reachable_from: {', '.join(sorted(empty_enum_names))}")

        sources_missing = [k for k, v in all_sources.items() if "prefixes" not in v]
        if sources_missing:
            print(
                f"Warning: prefix lists not stored for: {', '.join(sources_missing)}. "
                f"Run -p to populate them. Skipping prefix sync.",
                file=sys.stderr
            )
        else:
            # Collect all prefixes from every source
            protected = {}
            prefix_sources = defaultdict(list)  # prefix key -> [source keys that define it]
            for src_key, src in all_sources.items():
                for k, v in (src.get("prefixes") or {}).items():
                    protected[k] = v
                    prefix_sources[k].append(src_key)

            prefix_added = prefix_updated = 0
            for prefix, uri in protected.items():
                if prefix not in schema["prefixes"]:
                    schema["prefixes"][prefix] = uri
                    prefix_added += 1
                elif schema["prefixes"][prefix] != uri:
                    schema["prefixes"][prefix] = uri
                    prefix_updated += 1

            schema["prefixes"] = sort_prefixes(schema["prefixes"])

            print(f"Prefixes: {prefix_added} added, {prefix_updated} updated")

            # Report prefix keys that are identical except for case
            case_groups = defaultdict(list)
            for prefix in schema["prefixes"]:
                case_groups[prefix.lower()].append(prefix)
            collisions = [keys for keys in case_groups.values() if len(keys) > 1]
            for keys in sorted(collisions):
                detail = ", ".join(
                    f"{k} ({', '.join(prefix_sources[k])})" for k in keys
                )
                print(f"  Warning: case-variant prefix keys: {detail}", file=sys.stderr)

    # Report enums in schema.yaml not attributed to any current menu_config.yaml source
    if os.path.exists(config_file):
        known_sources = set(all_sources.keys())
        orphans = []
        for enum_key, enum_def in schema.get("enums", {}).items():
            ann = (enum_def.get("annotations") or {}) if isinstance(enum_def, dict) else {}
            imported_from = ann.get("imported_from", "")
            if not imported_from or imported_from not in known_sources:
                orphans.append((enum_key, imported_from))
        if orphans:
            print(f"\nWarning: {len(orphans)} enum(s) not linked to any menu_config.yaml source:")
            for enum_key, imported_from in sorted(orphans):
                if imported_from:
                    print(f"  {enum_key}  (imported_from: '{imported_from}' — source not in config)")
                else:
                    print(f"  {enum_key}  (no imported_from annotation)")

    if schema.get("enums"):
        schema["enums"] = dict(sorted(schema["enums"].items(), key=lambda x: x[0].lower()))

    if schema.get("prefixes"):
        schema["prefixes"] = sort_prefixes(schema["prefixes"])

    with open(schema_file, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"{action} {schema_file}")

    if prefix_conflicts:
        print(f"\nPrefix conflicts ({len(prefix_conflicts)}):")
        for msg in prefix_conflicts:
            print(msg)



def add_source(urls, config_file=MENU_CONFIG):
    """Add sources from URLs to menu_config.yaml and process them.

    For each URL, downloads the file and detects its type:
    - AGROVOC concept IRI (aims.fao.org/aos/agrovoc/{id})  -> content_type: OntologyAPI
    - SNOMED concept IRI (snomed.info/id/{id})             -> content_type: OntologyAPI
    - AgriFoodCA GitHub directory URL                      -> content_type: AgriFoodCA
    - AgriFoodCA individual picklist CSV (content-based)   -> content_type: AgriFoodCA
    - URL matching https://sis.agr.gc.ca/cansis/nsdb/soil  -> content_type: NSDB
    - URL from terminology.hl7.org with .html extension (not a single ValueSet/
      CodeSystem detail page)             -> content_type: LOINC
    - JSON with resourceType CodeSystem   -> content_type: LOINCCodeSystem
    - JSON with resourceType ValueSet     -> content_type: LOINCValueSet
    - YAML with LinkML schema structure   -> content_type: LinkML

    Creates a menu_config.yaml entry, saves the file to sources/, fills in
    metadata, and runs process_sources for the new key.
    """
    os.makedirs("sources", exist_ok=True)

    if not os.path.exists(config_file):
        write_config({"comment": DEFAULT_CONFIG_COMMENTS, "locales": ["en"], "sources": {}}, config_file)
        print(f"Created {config_file}")

    for url in urls:
        # Unescape HTML entities (e.g. &amp; → &) so the server receives a valid URL
        url = html.unescape(url)

        # Pre-download detectors: no file download needed for these URL patterns
        if match_agrovoc(url, config_file):
            continue
        if match_snomed(url, config_file):
            continue
        if match_agrifood_dir(url, config_file):
            continue

        print(f"Fetching {url} ...")
        tmp_fd, tmp_path = tempfile.mkstemp()
        os.close(tmp_fd)
        downloaded_filename = ""
        try:
            req = urllib.request.Request(url, headers=BROWSER_HEADERS)
            with urllib.request.urlopen(req) as response:
                cd = response.headers.get('Content-Disposition', '')
                if cd:
                    fn_m = re.search(r'filename\s*=\s*["\']?([^"\';\r\n]+)["\']?', cd, re.IGNORECASE)
                    if fn_m:
                        downloaded_filename = fn_m.group(1).strip().strip('"\'')
                with open(tmp_path, "wb") as tmp_f:
                    tmp_f.write(response.read())
        except Exception as e:
            print(f"  Error fetching {url}: {e}", file=sys.stderr)
            os.unlink(tmp_path)
            continue

        # URL-pattern and content-based detection (matcher returns True if handled)
        if (match_nsdb_snt(url, tmp_path, config_file) or
                match_nsdb_slt(url, tmp_path, config_file) or
                match_nsdb_soil(url, tmp_path, config_file) or
                match_nsdb_slc(url, tmp_path, config_file) or
                match_loinc_table(url, tmp_path, config_file) or
                match_statscan(url, tmp_path, config_file) or
                match_napcs_csv(url, tmp_path, config_file, downloaded_filename) or
                match_agrifood_csv(url, tmp_path, config_file)):
            continue

        if match_owl(url, tmp_path, config_file, process_fn=process_sources):
            continue

        if match_linkml(url, tmp_path, config_file, process_fn=process_sources):
            continue

        # Remaining: JSON (LOINC)
        _url_base = url.split("?")[0].rstrip("/").split("/")[-1]
        _ext = _url_base.rsplit(".", 1)[1].lower() if "." in _url_base else ""
        if _ext != "json":
            print(f"  Skipping {url}: unrecognised file extension '{_ext or '(none)'}'"
                  " — expected .json, .yaml, or .yml", file=sys.stderr)
            os.unlink(tmp_path)
            continue

        try:
            with open(tmp_path) as f:
                record = json.load(f)
        except (json.JSONDecodeError, ValueError) as e:
            print(f"  Skipping {url}: failed to parse as JSON: {e}", file=sys.stderr)
            os.unlink(tmp_path)
            continue

        resource_type = record.get("resourceType", "")
        if resource_type == "CodeSystem":
            content_type = "LOINCCodeSystem"
        elif resource_type == "ValueSet":
            content_type = "LOINCValueSet"
        else:
            print(f"  Skipping {url}: JSON resourceType '{resource_type}' not supported",
                  file=sys.stderr)
            os.unlink(tmp_path)
            continue

        raw_name = record.get("name", "")
        if raw_name:
            parts = re.split(r"[\s\-_]+", raw_name)
            key = "LOINC" + (to_camel_case(raw_name) if len(parts) > 1 else raw_name)
        else:
            key = _url_base.rsplit(".", 1)[0]

        with open(config_file) as f:
            config = yaml.safe_load(f) or {}
        if key in config.get("sources", {}):
            print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
                  file=sys.stderr)
            os.unlink(tmp_path)
            continue

        output_path = f"sources/{key}.json"
        os.rename(tmp_path, output_path)
        print(f"Saved to {output_path}")

        entry = make_source_entry(key, url, content_type, "json")
        entry["see_also"] = url + ".html"
        config.setdefault("sources", {})[key] = entry
        write_config(config, config_file)
        print(f"Added source '{key}' to {config_file}")

        key, output_path = fill_loinc_source_metadata(output_path, key, config_file)
        process_sources([key], config_file)


def _require_source_file(key, ext):
    """Return the source file path if it exists, else print a warning and return None."""
    path = f"sources/{key}.{ext}"
    if not os.path.exists(path):
        print(f"Skipping {key}: {path} not found — run -f to fetch first", file=sys.stderr)
        return None
    return path



def process_sources(source_keys=None, config_file=MENU_CONFIG):
    """Store per-source prefix dicts into menu_config.yaml from fetched source files.

    For OntologyAPI sources: fetches the concept hierarchy via the configured API
    (e.g. AGROVOC SPARQL, OLS4) and writes a LinkML enum YAML to sources/{key}.yaml
    directly — no downloaded file required.
    For NSDB sources: runs process_nsdb_source to fetch and parse HTML attribute pages.
    For LOINC sources: parses the saved HTML listing page, fetches each ValueSet JSON
    by constructing the URL from the Name column, and writes the combined YAML file.
    For LOINCCodeSystem/LOINCValueSet sources: converts the fetched JSON to a LinkML
    YAML file and stores the resulting prefix dict in menu_config.yaml.
    For yaml sources: reads the source file and stores its prefix dict in
    menu_config.yaml.

    Does not modify schema.yaml — use -b (build_schema) to sync enums and
    prefixes into schema.yaml.

    source_keys: list of source key names to process, or None/empty for all sources.
    """
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)

    locales = config.get("locales") or ["en"]
    all_sources = config.get("sources", {})
    keys_to_process = list(all_sources.keys()) if not source_keys else source_keys

    invalid = [k for k in keys_to_process if k not in all_sources]
    if invalid:
        print(f"Unknown source key(s): {', '.join(invalid)}", file=sys.stderr)
        sys.exit(1)

    for key in keys_to_process:
        source = all_sources[key]
        file_format = source.get("file_format", "yaml")
        content_type = source.get("content_type", "")

        if content_type == "OWL":
            if not _require_source_file(key, source.get("file_format", "owl")): continue
            process_owl_source(key, source, config_file)
            continue

        if content_type == "STATSCAN":
            if not _require_source_file(key, "html"): continue
            process_statscan_source(key, source, config_file, locales=locales)
            continue

        if content_type == "NAPCSCanada":
            if not _require_source_file(key, "csv"): continue
            process_napcscanada_source(key, source, config_file, locales=locales)
            continue

        if content_type == "AgriFoodCA":
            if source.get("file_format") == "yaml":
                # Combined directory import — YAML already generated during -a
                if not _require_source_file(key, "yaml"): continue
                continue
            if not _require_source_file(key, "csv"): continue
            process_agrifood_source(key, source, config_file, locales=locales)
            continue

        if content_type in ("NSDBSNT", "NSDBSLT"):
            if not _require_source_file(key, "html"): continue
            process_nsdb_html_source(key, source, enum_prefix="NSDB", locales=locales)
            continue

        if content_type == "NSDB":
            if not _require_source_file(key, "html"): continue
            process_nsdb_source(key, source, locales=locales)
            continue

        if content_type == "NSDBSLC":
            if not _require_source_file(key, "html"): continue
            process_nsdb_html_source(key, source, enum_prefix="NSDBSLC", locales=locales)
            continue

        if content_type == "LOINC":
            if not _require_source_file(key, "html"): continue
            process_loinc_table_source(key, source, config_file)
            continue

        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            if not _require_source_file(key, "json"): continue
            if content_type == "LOINCCodeSystem":
                yaml_path = convert_loinc_codesystem_to_linkml(key, source)
            else:
                yaml_path = convert_loinc_valueset_to_linkml(key, source)
            with open(yaml_path) as f:
                generated = yaml.safe_load(f)
            config_additions = dict(source.get("prefixes") or {})
            if config_additions:
                merged = sort_prefixes({**(generated.get("prefixes") or {}), **config_additions})
                if list(merged.items()) != list(sort_prefixes(generated.get("prefixes") or {}).items()):
                    generated["prefixes"] = merged
                    with open(yaml_path, "w") as f:
                        yaml.dump(generated, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
            continue

        if content_type == "OntologyAPI":
            process_skos_source(key, source, config_file, locales=locales)
            continue

        if content_type == "NRCSSoilFieldBook":
            process_nrcs_source(key, source, locales=locales)
            continue

        process_linkml_source(key, source, config_file)




def expand_reachable_from(yaml_path, enum_filter=None, apis=None, locales=None):
    """For each enum with reachable_from.source_nodes, fetch graph data via the
    appropriate API and populate permissible_values with CURIE keys, titles,
    and is_a hierarchy.

    source_nodes entries must be in CURIE format: PREFIX:ID (e.g. ENVO:00000428).
    enum_filter: optional set/list of enum keys to restrict processing to.
    apis: dict loaded from menu_config.yaml 'apis' key; used by fetch_api_graph
          to route each ontology prefix to the correct API service.
    Writes the updated schema back to yaml_path if any enums were expanded.
    """
    with open(yaml_path, "r") as f:
        schema = yaml.safe_load(f)
    if not schema:
        return

    OBSOLETE_CLASS_IRI = "http://www.geneontology.org/formats/oboInOwl#ObsoleteClass"
    OBOINOWL_URI = "http://www.geneontology.org/formats/oboInOwl#"
    OBOINOWL_KEY = "oboInOwl"

    prefixes = schema.get("prefixes") or {}
    enums = schema.get("enums") or {}
    changed = False
    prefix_added = False
    expanded = {}   # enum_key -> permissible_value count

    for enum_key, enum_def in enums.items():
        if enum_filter is not None and enum_key not in enum_filter:
            continue
        if not enum_def:
            continue
        reachable_from = enum_def.get("reachable_from") or {}
        source_nodes = reachable_from.get("source_nodes")
        if not source_nodes:
            continue

        print(f"  Expanding '{enum_key}' ({len(source_nodes)} source node(s))")

        # Collect all nodes and edges from every source_node graph fetch
        all_nodes = {}   # iri -> {"label": str, "curie": str}
        all_edges = []   # [{"child_curie": str, "parent_curie": str}]

        for node_ref in source_nodes:
            if ":" not in node_ref:
                print(f"    Warning: source_node '{node_ref}' is not PREFIX:ID format — skipping", file=sys.stderr)
                continue
            ontology, term_id = node_ref.split(":", 1)
            graph = fetch_api_graph(ontology, term_id, apis=apis, locales=locales)
            if not graph:
                continue

            # Determine which IRIs to skip for this source_node:
            # - the root node itself (unless include_self is true)
            # - any ancestor nodes, i.e. targets of (root -subClassOf-> target)
            inner_iri = get_ols4_inner_iri(ontology, term_id, apis=apis)
            include_self = reachable_from.get("include_self", False)
            skip_iris = set()
            if not include_self:
                skip_iris.add(inner_iri)
            graph_node_iris = {n.get("iri") for n in (graph.get("nodes") or []) if n.get("iri")}
            for edge in (graph.get("edges") or []):
                if (edge.get("label") == "subClassOf"
                        and edge.get("source") == inner_iri
                        and edge.get("target") in graph_node_iris):
                    skip_iris.add(edge.get("target"))

            # Pass 1: build node map with current prefixes, skipping root and ancestors
            for node in (graph.get("nodes") or []):
                iri = node.get("iri") or ""
                if iri and iri not in skip_iris:
                    # OLS4 /graph nodes only carry iri+label; definition is unavailable without
                    # per-term calls.  BioPortal nodes carry 'definition' (list or str).
                    # AGROVOC nodes carry 'definition' and 'deprecated'.
                    raw_def = node.get("definition") or ""
                    definition = (raw_def[0] if isinstance(raw_def, list) else raw_def) or ""
                    all_nodes[iri] = {
                        "label": node.get("label") or "",
                        "curie": iri_to_curie(iri, prefixes),
                        "definition": definition,
                        "deprecated": bool(node.get("deprecated")),
                    }

            # Pass 2: scan edges for obsolete class references before building all_edges
            graph_edges = graph.get("edges") or []
            for edge in graph_edges:
                if edge.get("label") != "subClassOf":
                    continue
                tgt_iri = edge.get("target") or ""
                src_iri = edge.get("source") or ""
                if tgt_iri != OBSOLETE_CLASS_IRI:
                    continue
                # Ensure oboInOwl prefix is registered
                if OBOINOWL_KEY not in prefixes:
                    prefixes[OBOINOWL_KEY] = OBOINOWL_URI
                    schema["prefixes"] = prefixes
                    prefix_added = True
                    # Re-compute CURIEs for any oboInOwl IRIs already collected
                    for iri in list(all_nodes):
                        if iri.startswith(OBOINOWL_URI):
                            all_nodes[iri]["curie"] = iri_to_curie(iri, prefixes)
                # Ensure the ObsoleteClass node itself is in all_nodes
                if OBSOLETE_CLASS_IRI not in all_nodes:
                    all_nodes[OBSOLETE_CLASS_IRI] = {
                        "label": "ObsoleteClass",
                        "curie": f"{OBOINOWL_KEY}:ObsoleteClass",
                    }
                if src_iri in all_nodes:
                    print(
                        f"    Warning: term '{all_nodes[src_iri]['curie']}' is obsolete"
                        f" (subClassOf oboInOwl:ObsoleteClass)",
                        file=sys.stderr,
                    )

            # Pass 3: build all_edges (oboInOwl prefix now in place if needed)
            for edge in graph_edges:
                if edge.get("label") == "subClassOf":
                    src_iri = edge.get("source") or ""
                    tgt_iri = edge.get("target") or ""
                    if src_iri in all_nodes and tgt_iri in all_nodes:
                        all_edges.append({
                            "child_curie": all_nodes[src_iri]["curie"],
                            "parent_curie": all_nodes[tgt_iri]["curie"],
                        })

        if not all_nodes:
            continue

        # Build child→parent lookup (last edge wins for any duplicate child)
        is_a_map = {e["child_curie"]: e["parent_curie"] for e in all_edges}

        # Build permissible_values dict
        permissible_values = {}
        for iri, info in all_nodes.items():
            curie = info["curie"]
            pv = {}
            if info["label"]:
                pv["title"] = info["label"]
                pv["text"] = curie
            pv["meaning"] = curie
            if info.get("definition"):
                pv["description"] = info["definition"]
            if curie in is_a_map:
                pv["is_a"] = is_a_map[curie]
            if info.get("deprecated"):
                pv["status"] = "DEPRECATED"
            permissible_values[curie] = pv

        enum_def["permissible_values"] = permissible_values
        expanded[enum_key] = len(permissible_values)
        changed = True

    if changed or prefix_added:
        with open(yaml_path, "w") as f:
            yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
        print(f"Updated {yaml_path} with expanded reachable_from values")

    # If oboInOwl prefix was added and we were working on a source file, also update schema.yaml
    if prefix_added and os.path.abspath(yaml_path) != os.path.abspath("schema.yaml"):
        schema_file = "schema.yaml"
        if os.path.exists(schema_file):
            with open(schema_file, "r") as f:
                schema_data = yaml.safe_load(f) or {}
            existing_prefixes = schema_data.get("prefixes") or {}
            if OBOINOWL_KEY not in existing_prefixes:
                existing_prefixes[OBOINOWL_KEY] = OBOINOWL_URI
                schema_data["prefixes"] = existing_prefixes
                with open(schema_file, "w") as f:
                    yaml.dump(schema_data, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
                print(f"Added '{OBOINOWL_KEY}' prefix to schema.yaml")

    return expanded


def generate_enum_report(yaml_file, tsv=False, output=sys.stdout, header=None):
    """Generate a report of enum keys, titles, source_domain, and source_schema.

    Works on any LinkML schema YAML file that contains an 'enums' section with
    annotations including source_domain and source_schema.

    Output is space-padded columns by default, or tab-delimited if tsv=True.
    If header is provided it is printed on its own line before the table.
    """
    if header:
        print(header, file=output)

    with open(yaml_file, "r") as f:
        schema = yaml.safe_load(f)

    enums = schema.get("enums", {})
    rows = []

    for key, enum_def in enums.items():
        if not enum_def:
            enum_def = {}
        title = enum_def.get("title") or ""
        annotations = enum_def.get("annotations") or {}
        source_domain = annotations.get("source_domain") or ""
        source_schema = annotations.get("source_schema") or ""
        rows.append((source_domain, source_schema, key, title))

    rows.sort(key=lambda r: (r[0], r[1], r[2]))

    headers = ["source_domain", "source_schema", "enum_key", "title"]
    all_rows = [headers] + rows

    if tsv:
        for row in all_rows:
            print("\t".join(row), file=output)
    else:
        widths = [max(len(r[i]) for r in all_rows) for i in range(len(headers))]
        for row in all_rows:
            print("  ".join(cell.ljust(widths[i]) for i, cell in enumerate(row)).rstrip(), file=output)


def main():
    parser = argparse.ArgumentParser(description="Fetch LinkML and other Value Sets and merge into a LinkML schema.yaml file; as well generate enum reports from fetched files.")
    parser.add_argument("-a", "--add", nargs="+", metavar="URL", help="Add one or more sources by URL, auto-detecting type and processing into menu_config.yaml")
    parser.add_argument("-b", "--build", nargs="?", const=True, metavar="SOURCE_KEY", help="Build or update schema.yaml; optionally supply a source key to rebuild only that source")
    parser.add_argument("-f", "--fetch", nargs="*", metavar="SOURCE_KEY|all", help="Fetch sources. Use '-f all' to fetch every source in menu_config.yaml, or supply specific source keys. Without arguments, fetches only sources listed with -c.")
    parser.add_argument("-c", "--config", nargs="*", metavar="SOURCE_KEY", help="Update menu_config.yaml with prefix dicts from source files; omit keys to process all sources")
    parser.add_argument("-d", "--delete", nargs="+", metavar="SOURCE_KEY", help="Remove one or more source keys from menu_config.yaml")
    parser.add_argument("-l", "--lookup", nargs="*", metavar="SOURCE_KEY", help="Expand reachable_from.source_nodes enums via OLS4 API for YAML sources; omit keys to process all sources")
    parser.add_argument("-r", "--report", action="store_true", help="Generate enum report for all sources in menu_config.yaml")
    parser.add_argument("-s", "--sssom", nargs="*", metavar="PREDICATE",
        help=(
            "Apply SSSOM ontology mappings from the top-level 'sssom' file list in "
            "menu_config.yaml to permissible_values in schema.yaml.  Optionally supply "
            "one or more predicate_id values to restrict which mapping types are written "
            f"({', '.join(SSSOM_PREDICATE_MAP)}); omit to apply all."
        ))
    parser.add_argument("-t", "--tabformat", action="store_true", help="Output report as tab-delimited TSV (default is space-padded columns)")
    args = parser.parse_args()

    if args.add:
        add_source(args.add)
    if args.delete:
        with open(MENU_CONFIG, "r") as f:
            config = yaml.safe_load(f)
        all_sources = config.get("sources", {})

        # Delete any keys that are menu_config.yaml source entries
        config_keys = [k for k in args.delete if k in all_sources]
        for key in config_keys:
            del config["sources"][key]
            print(f"Deleted source '{key}' from {MENU_CONFIG}")
        if config_keys:
            write_config(config)

        # Delete matching enums from schema.yaml:
        # - enum key directly matches a given key, OR
        # - enum's imported_from annotation matches a given key (source deletion)
        delete_set = set(args.delete)
        schema_file = "schema.yaml"
        removed = []
        if os.path.exists(schema_file):
            with open(schema_file, "r") as f:
                schema = yaml.safe_load(f) or {}
            enums = schema.get("enums") or {}
            for enum_key in list(enums):
                ann = (enums[enum_key].get("annotations") or {}) if isinstance(enums[enum_key], dict) else {}
                if enum_key in delete_set or ann.get("imported_from") in delete_set:
                    del enums[enum_key]
                    removed.append(enum_key)
            if removed:
                schema["enums"] = enums
                with open(schema_file, "w") as f:
                    yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
                print(f"Deleted {len(removed)} enum(s) from {schema_file}: {', '.join(sorted(removed))}")

        acted_on = set(config_keys) | set(removed)
        not_found = [k for k in args.delete if k not in acted_on]
        if not_found:
            print(f"Warning: key(s) not found in {MENU_CONFIG} or {schema_file}: {', '.join(not_found)}", file=sys.stderr)
    if args.fetch is not None:
        with open(MENU_CONFIG, "r") as f:
            config = yaml.safe_load(f)
        all_sources = config.get("sources", {})
        if "all" in args.fetch:
            keys_to_download = list(all_sources.keys())
        elif args.fetch:
            keys_to_download = args.fetch
        elif args.config:
            keys_to_download = args.config
        else:
            print("No sources fetched. Provide source keys with -c, or use '-f all' to fetch every source.", file=sys.stderr)
            keys_to_download = []
        invalid = [k for k in keys_to_download if k not in all_sources]
        if invalid:
            print(f"Unknown source key(s): {', '.join(invalid)}", file=sys.stderr)
            sys.exit(1)
        os.makedirs("sources", exist_ok=True)
        for key in keys_to_download:
            source = all_sources[key]
            uri = (source.get("reachable_from") or {}).get("source_ontology")
            file_format = source.get("file_format", "yaml")
            output_path = f"sources/{key}.{file_format}"
            print(f"Fetching {uri} ...")
            urllib.request.urlretrieve(uri, output_path)
            print(f"Saved to {output_path}")
            update_source_config(key, {"download_date": datetime.date.today().isoformat()})
            content_type = source.get("content_type", "")
            if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
                fill_loinc_source_metadata(output_path, key)
            else:
                if file_format == "yaml":
                    generate_enum_report(output_path, tsv=args.tabformat)
    if args.config is not None:
        process_sources(args.config)
    if args.build is not None:
        build_schema(keys=[args.build] if isinstance(args.build, str) else None)
    # -s must run after -b: SSSOM mappings are applied to the schema.yaml that
    # -b produces, so this order must be preserved.
    if args.sssom is not None:
        apply_sssom_mappings(predicates=args.sssom or None)
    if args.lookup is not None:
        schema_file = "schema.yaml"
        if not os.path.exists(schema_file):
            print(f"schema.yaml not found — run -b first", file=sys.stderr)
        else:
            lookup_results = {}   # enum_key -> pv count

            # Load apis and locales config once for all lookup calls
            with open(MENU_CONFIG, "r") as f:
                _lconfig = yaml.safe_load(f) or {}
            _apis    = _lconfig.get("apis") or {}
            _locales = _lconfig.get("locales") or ["en"]

            if not args.lookup:
                # -l with no args: expand every enum in schema.yaml that has reachable_from.source_nodes
                lookup_results.update(expand_reachable_from(schema_file, apis=_apis, locales=_locales))
            else:
                all_sources = _lconfig.get("sources", {})
                with open(schema_file, "r") as f:
                    schema_data = yaml.safe_load(f) or {}
                schema_enums = schema_data.get("enums") or {}

                # Partition given keys: recognised source keys vs direct enum names
                source_keys = [k for k in args.lookup if k in all_sources]
                enum_keys   = [k for k in args.lookup if k not in all_sources]

                enum_filter = set()

                if source_keys:
                    # Resolve to enum keys in schema.yaml whose imported_from matches
                    from_source = {
                        ek for ek, ev in schema_enums.items()
                        if isinstance(ev, dict)
                        and (ev.get("annotations") or {}).get("imported_from") in source_keys
                    }
                    if not from_source:
                        print(
                            f"Warning: no enums in schema.yaml with imported_from in:"
                            f" {', '.join(source_keys)}",
                            file=sys.stderr,
                        )
                    enum_filter |= from_source

                if enum_keys:
                    not_found = [k for k in enum_keys if k not in schema_enums]
                    if not_found:
                        print(
                            f"Warning: enum(s) not found in schema.yaml: {', '.join(not_found)}",
                            file=sys.stderr,
                        )
                    enum_filter |= {k for k in enum_keys if k in schema_enums}

                if enum_filter:
                    lookup_results.update(expand_reachable_from(
                        schema_file, enum_filter=enum_filter, apis=_apis, locales=_locales))

            if lookup_results:
                print("\nLookup report:")
                for enum_key, count in sorted(lookup_results.items()):
                    print(f"  {enum_key}: {count} permissible_values")
                print(f"  Total: {sum(lookup_results.values())} permissible_values across {len(lookup_results)} enum(s)")
            else:
                print("Lookup: no reachable_from.source_nodes enums found to expand")
    if args.report:
        with open(MENU_CONFIG, "r") as f:
            config = yaml.safe_load(f)
        all_sources = config.get("sources", {})
        first = True
        for key, source in all_sources.items():
            source_path = f"sources/{key}.yaml"
            if not os.path.exists(source_path):
                print(f"Skipping {key}: {source_path} not found — run -f and -c first", file=sys.stderr)
                continue
            if not first:
                print()
            first = False
            name = source.get("name") or key
            title = source.get("title") or ""
            header = f"{name}: {title}" if title else name
            generate_enum_report(source_path, tsv=args.tabformat, header=header)
    if not any([args.add, args.build is not None, args.delete, args.fetch is not None, args.config is not None, args.sssom is not None, args.report]):
        print("No action taken. Use -a to add sources, -b to build schema.yaml, -c to update menu_config.yaml, -d to delete sources, -f to fetch sources, -r to report on all sources, or -s to apply SSSOM mappings.")


if __name__ == "__main__":
    main()
