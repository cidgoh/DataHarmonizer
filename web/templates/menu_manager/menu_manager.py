#!/usr/bin/env python3
# Authors: Damion Dooley and Claude (Anthropic claude-sonnet-4-6)
#
# TODO: The -l lookup function currently assumes subClassOf object property
# traversal when expanding reachable_from.source_nodes.
# Dynamic enumeration of reachable_from relationship_types (e.g. partOf,
# hasPart, etc.) has not yet been implemented.
#
# ALSO: locate and incorporate sources for picklists found in https://github.com/agrifooddatacanada/picklists_for_schemas/tree/main/picklists
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
#   BioPortal requires an apikey in the apis > bioportal > apikey field.
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
#     # LOINCDataAbsentReason (LOINCCodeSystem)
#     python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/CodeSystem-data-absent-reason.json
#
#     # LOINCPersonalPronouns (LOINCValueSet)
#     python menu_manager.py -a https://terminology.hl7.org/7.1.0/en/ValueSet-pronouns.json
#
#     # LOINCGenderIdentity (LOINCValueSet)
#     python menu_manager.py -a https://terminology.hl7.org/en/ValueSet-gender-identity.json
#
#     # NSDBSoilNameAndLayerV2 (NSDB)
#     python menu_manager.py -a https://sis.agr.gc.ca/cansis/nsdb/soil/v2/index.html
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
#   The optional "concise: true" source attribute (menu_config.yaml) trims
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

MENU_CONFIG = "menu_config.yaml"

# Browser-like headers used for all HTTP fetches.  Some servers (e.g. those
# behind a Barracuda WAF) reject requests that lack a realistic User-Agent,
# Accept, or Accept-Language header.
BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

DEFAULT_CONFIG_COMMENTS = [
    'See docs on "reachable_from": https://linkml.io/linkml-model/latest/docs/reachable_from/',
    "Config below doesn't support LinkML dynamic enumeration \"inherits\", and is limited custom version of LinkML dynamic enumerations, not quite in context of LinkML schema.",
    'Note that "minus" list is implemented before "includes" list, which restores subordinate items that would otherwise have been eliminated by minus list items and their underlying items.',
    "See https://linkml.io/linkml-model/latest/docs/EnumExpression/",
    "Here 'reachable_from' is acted on via 'menu_manager.py -c' configuration to generate the LinkML .yaml schema file for the given source.  Over in schema.yaml, 'reachable_from' is acted on via 'menu_manager.py -l' for lookup function to populate schema.yaml enums.",
    "The optional top-level 'apis' object configures API endpoints for the -l lookup function.",
    "Each key is a service name (e.g. 'ols4', 'bioportal') with 'uri', optional 'apikey', and 'ontologies' list.",
    "The -l lookup routes each CURIE prefix to the first api whose 'ontologies' list contains it; falls back to OLS4.",
    "Example apis block:",
    "  apis:",
    "    ols4:",
    "      uri: http://www.ebi.ac.uk/ols4/api",
    "      ontologies: [ENVO, GO, UBERON]",
    "    bioportal:",
    "      uri: https://data.bioontology.org",
    "      apikey: YOUR_BIOPORTAL_KEY",
    "      ontologies: [MESH, NCIT, SNOMEDCT]",
]


class IndentedDumper(yaml.Dumper):
    """YAML dumper that indents list items one level under their parent key."""
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow=flow, indentless=False)


# Matches CURIE-style strings such as OBI:0000094 or oboInOwl:ObsoleteClass.
# The colon must be followed by a letter or digit (excludes URLs whose colon is
# followed by '//') and the string must start with a letter.
_CURIE_PATTERN = re.compile(r'^[A-Za-z][A-Za-z0-9]*:[A-Za-z0-9]')


def _represent_str(dumper, data):
    """Single-quote strings that require it for safe YAML output.

    CURIE-pattern strings (e.g. ENVO:00000428) are single-quoted to prevent
    the embedded colon from being misread as a key-value separator.

    Strings containing a double-quote character are also single-quoted: PyYAML
    may emit them as plain block scalars that wrap to a new line, and a
    continuation line starting with '"' is rejected by many YAML parsers as it
    looks like the start of a double-quoted scalar.
    """
    if _CURIE_PATTERN.match(data) or '"' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style="'")
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


IndentedDumper.add_representer(str, _represent_str)


def enum_in_minus(enum_key, enum_def, minus_set):
    """Return True if enum_key or its annotations source_domain/source_schema match minus_set."""
    if not minus_set:
        return False
    if enum_key in minus_set:
        return True
    ann = (enum_def.get("annotations") or {}) if enum_def else {}
    return ann.get("source_domain") in minus_set or ann.get("source_schema") in minus_set


def keys_from_minus(value):
    """Normalise a minus concepts/permissible_values entry to a set of string keys.

    Accepts a dict (keys used), a list/tuple (items used), a bare string
    (treated as a single key), or None/falsy (returns empty set).
    """
    if not value:
        return set()
    if isinstance(value, dict):
        return set(value)
    if isinstance(value, (list, tuple)):
        return set(value)
    return {str(value)}


def to_camel_case(s):
    """Convert a string to CamelCase by splitting on whitespace, dashes, and underscores."""
    return "".join(word.capitalize() for word in re.split(r"[\s\-_]+", s) if word)


def to_pascal_case_key(text, drop_trailing_acronym=True):
    """Convert a phrase to a PascalCase identifier.

    Words are split on any non-alphanumeric run.  All-caps words of two or more
    characters (acronyms) are kept as-is; all other words are title-cased.

    When *drop_trailing_acronym* is True (the default), the last word is omitted
    if it is an exact uppercase match for the concatenated first letters of all
    preceding words — i.e. it is a redundant trailing initialism.

    Examples::

        to_pascal_case_key("Farm Product Price Index - FPPI")
        # → "FarmProductPriceIndex"   (FPPI == F+P+P+I, dropped)

        to_pascal_case_key("Farm Product Price Index - FPPI", drop_trailing_acronym=False)
        # → "FarmProductPriceIndexFPPI"

        to_pascal_case_key("Consumer Price Index")
        # → "ConsumerPriceIndex"      (no trailing acronym)

        to_pascal_case_key("FPPI")
        # → "FPPI"                    (single word, never dropped)
    """
    words = [w for w in re.split(r'[^A-Za-z0-9]+', text) if w]
    if drop_trailing_acronym and len(words) >= 2:
        initials = ''.join(w[0].upper() for w in words[:-1])
        if words[-1].upper() == initials:
            words = words[:-1]
    return ''.join(w if (w.isupper() and len(w) > 1) else w.capitalize() for w in words)


def rename_source_key(old_key, new_key, config_file=MENU_CONFIG):
    """Rename a source key in menu_config.yaml, preserving entry order."""
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    config["sources"] = {
        (new_key if k == old_key else k): v
        for k, v in config["sources"].items()
    }
    write_config(config, config_file)


def fill_loinc_source_metadata(output_path, key, config_file=MENU_CONFIG):
    """Fill empty fields in a content_type: LOINCCodeSystem or LOINCValueSet source from the fetched JSON file.

    Derives name/title/version/prefixes from the record where config fields are
    absent. The config key and fetched file are renamed to match the derived
    name if the name field was empty.

    Returns (new_key, new_path) after any renaming.
    """
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    source = config["sources"][key]

    with open(output_path) as f:
        record = json.load(f)

    updates = {}
    new_key = key

    if not source.get("name"):
        raw_name = record.get("name", "")
        parts = re.split(r"[\s\-_]+", raw_name)
        derived_name = "LOINC" + (to_camel_case(raw_name) if len(parts) > 1 else raw_name)
        updates["name"] = derived_name
        new_key = derived_name

    if not source.get("version") and record.get("version"):
        updates["version"] = record["version"]

    if not source.get("title") and record.get("title"):
        updates["title"] = record["title"]

    if not source.get("prefixes"):
        updates["prefixes"] = {"LOINC": "https://loinc.org/"}

    if updates:
        update_source_config(key, updates, config_file)

    new_path = output_path
    if new_key != key:
        rename_source_key(key, new_key, config_file)
        new_path = os.path.join("sources", f"{new_key}.json")
        os.rename(output_path, new_path)
        print(f"Renamed source '{key}' -> '{new_key}', file -> {new_path}")

    return new_key, new_path


def write_config(config, config_file=MENU_CONFIG):
    """Write config to config_file, sorting sources keys alphabetically.

    Leading ``# …`` comment lines are preserved from the existing file.  If
    the file does not yet exist (or has no leading comments), any ``comment``
    key in *config* is written as ``# …`` lines instead.  Comment text is
    never stored as YAML data, so colons, quotes, and other special characters
    never cause parser issues.
    """
    # Preserve leading # lines from the existing file (yaml.safe_load discards them).
    existing_comments = []
    if os.path.exists(config_file):
        with open(config_file) as f:
            for line in f:
                if line.startswith('#'):
                    existing_comments.append(line.rstrip('\n'))
                else:
                    break

    comment_lines = existing_comments or [f"# {l}" for l in (config.get("comment") or [])]
    data = {k: v for k, v in config.items() if k != "comment"}
    if "sources" in data and isinstance(data["sources"], dict):
        data["sources"] = dict(sorted(data["sources"].items(), key=lambda x: x[0].lower()))
    with open(config_file, "w") as f:
        if comment_lines:
            for line in comment_lines:
                f.write(line + "\n")
            f.write("\n")
        yaml.dump(data, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)


def update_source_config(source_key, fields, config_file=MENU_CONFIG):
    """Update one or more fields on a source entry in menu_config.yaml."""
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    config["sources"][source_key].update(fields)
    write_config(config, config_file)


def update_download_date(source_key, config_file=MENU_CONFIG):
    """Update the download_date for a source entry in menu_config.yaml."""
    update_source_config(source_key, {"download_date": datetime.date.today().isoformat()}, config_file)


def build_schema(schema_file="schema.yaml", config_file=MENU_CONFIG):
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
    if os.path.exists(config_file):
        with open(config_file, "r") as f:
            config = yaml.safe_load(f) or {}
        all_sources = config.get("sources", {})

        # Sync enums from each source's yaml file into schema
        for key, source in all_sources.items():
            source_path = f"sources/{key}.yaml"
            if not os.path.exists(source_path):
                print(f"Skipping {key} enums: {source_path} not found — run -f and -p first", file=sys.stderr)
                continue

            with open(source_path, "r") as f:
                source_data = yaml.safe_load(f)

            # Merge any source YAML prefixes missing from schema (additive only)
            for prefix, uri in (source_data.get("prefixes") or {}).items():
                schema["prefixes"].setdefault(prefix, uri)

            source_enums = source_data.get("enums") or {}
            enum_added = enum_updated = enum_reported = enum_excluded = enum_deleted = enum_conflicts = 0
            enum_concepts_included = enum_pvs_included = 0

            minus = source.get("minus") or {}
            minus_concepts = keys_from_minus(minus.get("concepts"))
            minus_pvs = keys_from_minus(minus.get("permissible_values"))

            include = source.get("include") or {}
            include_concepts = keys_from_minus(include.get("concepts"))
            include_pvs = keys_from_minus(include.get("permissible_values"))

            # Pre-compute empty enums (no permissible_values or reachable_from, not
            # minus-excluded) so is_a references to them can be cleaned up in the
            # copy loop regardless of iteration order.
            empty_enum_set = {
                ek for ek, ev in source_enums.items()
                if not enum_in_minus(ek, ev, minus_concepts)
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

            # Delete from schema any minus-excluded enums whose source_file matches
            # this source, so stale entries are cleaned up on re-build.
            if minus_concepts:
                for enum_key in list(schema["enums"]):
                    existing_def = schema["enums"][enum_key]
                    if not enum_in_minus(enum_key, existing_def, minus_concepts):
                        continue
                    ann = (existing_def.get("annotations") or {})
                    if ann.get("source_file") == source_path:
                        del schema["enums"][enum_key]
                        enum_deleted += 1

            for enum_key, enum_def in source_enums.items():
                if enum_in_minus(enum_key, enum_def, minus_concepts):
                    enum_excluded += 1
                    continue
                if enum_key in empty_enum_set:
                    continue
                enum_def = dict(enum_def) if enum_def else {}
                if enum_def.get("is_a") in empty_enum_set:
                    del enum_def["is_a"]
                if enum_def.get("status"):
                    enum_def["status"] = str(enum_def["status"]).upper()
                if minus_pvs and enum_def.get("permissible_values"):
                    enum_def["permissible_values"] = {
                        k: v for k, v in enum_def["permissible_values"].items()
                        if k not in minus_pvs
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

            schema["prefixes"] = dict(sorted(schema["prefixes"].items(), key=lambda x: x[0].lower()))

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

    with open(schema_file, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"{action} {schema_file}")


def collect_loinc_concepts(concepts, permissible_values, parent_code=None):
    """Recursively flatten a LOINC concept tree into a permissible_values dict.

    Child concepts gain an is_a attribute pointing to their parent concept's code.
    """
    COMMENTS_URL = "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments"
    for concept in concepts or []:
        code = concept.get("code", "")
        entry = {"name": code, "text": code}
        if concept.get("display"):
            entry["title"] = concept["display"]
        if concept.get("definition"):
            entry["description"] = concept["definition"]
        for ext in concept.get("extension") or []:
            if ext.get("url") == COMMENTS_URL and ext.get("valueString"):
                entry["comments"] = ext["valueString"]
                break
        if parent_code is not None:
            entry["is_a"] = parent_code
        permissible_values[code] = entry
        collect_loinc_concepts(concept.get("concept"), permissible_values, parent_code=code)


def convert_loinc_codesystem_to_linkml(key, source):
    """Convert a fetched LOINC JSON file to a LinkML-formatted YAML file.

    Reads sources/{key}.json and writes sources/{key}.yaml using metadata from
    the config source entry. Concepts are recursively flattened into a single
    permissible_values dict, with child concepts carrying an is_a reference to
    their parent.
    """
    json_path = f"sources/{key}.json"
    yaml_path = f"sources/{key}.yaml"

    with open(json_path) as f:
        record = json.load(f)

    # Config prefixes are stored as a dict: {"PREFIX": "uri", ...}
    prefixes = dict(source.get("prefixes") or {})

    default_prefix = next(iter(prefixes), "")
    source_name = source.get("name", "")

    permissible_values = {}
    collect_loinc_concepts(record.get("concept"), permissible_values)

    schema = make_config_schema(
        id=record.get("valueSet", ""), name=source_name,
        title=source.get("title", ""), version=source.get("version", ""),
        prefixes=prefixes, default_prefix=default_prefix,
        enums={source_name: {
            "name": source_name,
            "description": record.get("description", ""),
            **({"status": record["status"]} if record.get("status") else {}),
            "permissible_values": permissible_values,
        }},
    )

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"Converted {json_path} -> {yaml_path}")
    return yaml_path


def collect_loinc_valueset_concepts(record, permissible_values):
    """Flatten concepts from a LOINC ValueSet JSON compose.include structure.

    Iterates all include objects inside compose and collects their concept entries
    into a flat permissible_values dict. Concepts have code and display fields.
    """
    for include in (record.get("compose") or {}).get("include") or []:
        for concept in include.get("concept") or []:
            code = concept.get("code", "")
            entry = {"name": code, "text": code}
            if concept.get("display"):
                entry["title"] = concept["display"]
            permissible_values[code] = entry


def convert_loinc_valueset_to_linkml(key, source):
    """Convert a fetched LOINC ValueSet JSON file to a LinkML-formatted YAML file.

    Reads sources/{key}.json and writes sources/{key}.yaml using metadata from
    the config source entry. Concepts are collected from compose.include[].concept[]
    and flattened into a single permissible_values dict.
    """
    json_path = f"sources/{key}.json"
    yaml_path = f"sources/{key}.yaml"

    with open(json_path) as f:
        record = json.load(f)

    # Config prefixes are stored as a dict: {"PREFIX": "uri", ...}
    prefixes = dict(source.get("prefixes") or {})

    default_prefix = next(iter(prefixes), "")
    source_name = source.get("name", "")

    permissible_values = {}
    collect_loinc_valueset_concepts(record, permissible_values)

    schema = make_config_schema(
        id=record.get("url", ""), name=source_name,
        title=source.get("title", ""), version=source.get("version", ""),
        prefixes=prefixes, default_prefix=default_prefix,
        enums={source_name: {
            "name": source_name,
            "description": record.get("description", ""),
            **({"status": record["status"]} if record.get("status") else {}),
            "permissible_values": permissible_values,
        }},
    )

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"Converted {json_path} -> {yaml_path}")
    return yaml_path


def make_config_schema(id="", name="", title="", description="", version="",
                       license="", prefixes=None, default_prefix="",
                       classes={}, enums={}, slots={}):
    """Return a skeleton LinkML schema dict with all standard top-level fields.

    All parameters are optional; absent fields are included with empty/default
    values so callers always get a consistent structure.  'imports' is always
    set to ['linkml:types'].

    id:            Schema IRI / source URL.
    name:          Schema identifier (usually the source key).
    title:         Human-readable title.
    description:   Free-text description.
    version:       Version string.
    license:       License identifier (e.g. 'CC0').
    prefixes:      Prefix dict {'PREFIX': 'uri', ...}.
    default_prefix: Default prefix string.
    classes:       Pre-built classes dict to embed (default empty).
    enums:         Pre-built enums dict to embed (default empty).
    slots:         Pre-built slots dict to embed (default empty).
    """
    return {
        "id":             id,
        "name":           name,
        "title":          title,
        "description":    description,
        "version":        version,
        "license":        license,
        "imports":        ["linkml:types"],
        "prefixes":       dict(prefixes) if prefixes else {},
        "default_prefix": default_prefix,
        "classes":        dict(classes) if classes else {},
        "enums":          dict(enums) if enums else {},
        "slots":          dict(slots) if slots else {},
    }


def add_source(urls, config_file=MENU_CONFIG):
    """Add sources from URLs to menu_config.yaml and process them.

    For each URL, downloads the file and detects its type:
    - URL matching https://sis.agr.gc.ca/cansis/nsdb/soil -> content_type: NSDB
    - URL from terminology.hl7.org with .html extension (not a single ValueSet/
      CodeSystem detail page)            -> content_type: LOINC
    - JSON with resourceType CodeSystem  -> content_type: LOINCCodeSystem
    - JSON with resourceType ValueSet    -> content_type: LOINCValueSet
    - YAML with LinkML schema structure  -> content_type: LinkML

    Creates a menu_config.yaml entry, saves the file to sources/, fills in
    metadata, and runs process_sources for the new key.
    """
    os.makedirs("sources", exist_ok=True)

    if not os.path.exists(config_file):
        write_config({"comment": DEFAULT_CONFIG_COMMENTS, "sources": {}}, config_file)
        print(f"Created {config_file}")

    for url in urls:
        # Unescape HTML entities (e.g. &amp; → &) so the server receives a valid URL
        url = html.unescape(url)
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

        # URL-pattern detection: NSDB SNT — index page or single attribute page
        # e.g. https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/index.html   (index)
        #      https://sis.agr.gc.ca/cansis/nsdb/soil/v2/snt/watertbl.html (single)
        # Must be checked before the general NSDB block (same URL prefix).
        if url.startswith("https://sis.agr.gc.ca/cansis/nsdb/") and "/snt/" in url:
            url_no_query = url.split("?")[0]
            _ver_m = re.search(r'/nsdb/[^/]+/([^/]+)/snt/', url_no_query)
            _snt_version = re.sub(r'^[vV]', '', _ver_m.group(1)) if _ver_m else ""

            with open(tmp_path, encoding="utf-8", errors="replace") as _hf:
                _snt_html = _hf.read()

            if url_no_query.rstrip("/").endswith("/index.html"):
                # ---- Index page: multiple enums --------------------------------
                _meta_m = re.search(
                    r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
                    _snt_html, re.IGNORECASE)
                if not _meta_m:
                    _meta_m = re.search(
                        r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
                        _snt_html, re.IGNORECASE)
                _snt_title = _meta_m.group(1).strip() if _meta_m else "NSDB Soil Name Table"
                _snt_desc  = find_section_paragraph(_snt_html, "Description")
                _ver_key   = _snt_version.replace(".", "_") if _snt_version else ""
                key        = f"NSDBSNTv{_ver_key}" if _ver_key else "NSDBSNT"

            else:
                # ---- Single attribute page: one enum ---------------------------
                _snt_label, _snt_title, _snt_desc, _ = parse_attribute_page(_snt_html)
                if not _snt_label:
                    print(f"  Warning: could not parse attribute label from {url} — skipping", file=sys.stderr)
                    os.unlink(tmp_path)
                    continue
                key = f"NSDBSNT_{_snt_label}"

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            entry = {
                "title":        _snt_title,
                "name":         key,
                "version":      _snt_version,
                "content_type": "NSDBSNT",
                "file_format":  "html",
                "reachable_from": {"source_ontology": url},
                "download_date": datetime.date.today().isoformat(),
                "description":   _snt_desc,
            }
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")

            yaml_path = f"sources/{key}.yaml"
            _snt_schema = make_config_schema(id=url, name=key, title=_snt_title,
                                      description=_snt_desc, version=_snt_version)
            with open(yaml_path, "w") as f:
                yaml.dump(_snt_schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
            print(f"Created {yaml_path}")
            continue

        # URL-pattern detection: NSDB SLT — index page or single attribute page
        # e.g. https://sis.agr.gc.ca/cansis/nsdb/soil/v2/slt/index.html   (index)
        #      https://sis.agr.gc.ca/cansis/nsdb/soil/v2/slt/watertbl.html (single)
        # Must be checked before the general NSDB block (same URL prefix).
        if url.startswith("https://sis.agr.gc.ca/cansis/nsdb/") and "/slt/" in url:
            url_no_query = url.split("?")[0]
            _ver_m = re.search(r'/nsdb/[^/]+/([^/]+)/slt/', url_no_query)
            _slt_version = re.sub(r'^[vV]', '', _ver_m.group(1)) if _ver_m else ""

            with open(tmp_path, encoding="utf-8", errors="replace") as _hf:
                _slt_html = _hf.read()

            if url_no_query.rstrip("/").endswith("/index.html"):
                # ---- Index page: multiple enums --------------------------------
                _meta_m = re.search(
                    r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
                    _slt_html, re.IGNORECASE)
                if not _meta_m:
                    _meta_m = re.search(
                        r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
                        _slt_html, re.IGNORECASE)
                _slt_title = _meta_m.group(1).strip() if _meta_m else "NSDB Soil Layer Table"
                _slt_desc  = find_section_paragraph(_slt_html, "Description")
                _ver_key   = _slt_version.replace(".", "_") if _slt_version else ""
                key        = f"NSDBSLTv{_ver_key}" if _ver_key else "NSDBSLT"

            else:
                # ---- Single attribute page: one enum ---------------------------
                _slt_label, _slt_title, _slt_desc, _ = parse_attribute_page(_slt_html)
                if not _slt_label:
                    print(f"  Warning: could not parse attribute label from {url} — skipping", file=sys.stderr)
                    os.unlink(tmp_path)
                    continue
                key = f"NSDBSLT_{_slt_label}"

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            entry = {
                "title":          _slt_title,
                "name":           key,
                "version":        _slt_version,
                "content_type":   "NSDBSLT",
                "file_format":    "html",
                "reachable_from": {"source_ontology": url},
                "download_date":  datetime.date.today().isoformat(),
                "description":    _slt_desc,
            }
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")

            yaml_path = f"sources/{key}.yaml"
            _slt_schema = make_config_schema(id=url, name=key, title=_slt_title,
                                      description=_slt_desc, version=_slt_version)
            with open(yaml_path, "w") as f:
                yaml.dump(_slt_schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
            print(f"Created {yaml_path}")
            continue

        # URL-pattern detection: NSDB Soil database
        if url.startswith("https://sis.agr.gc.ca/cansis/nsdb/soil"):
            url_no_query = url.split("?")[0].rstrip("/")
            parts = url_no_query.split("/")
            if "index.html" in parts:
                version_label = parts[parts.index("index.html") - 1]
                base_url = url_no_query[: url_no_query.rfind("/index.html") + 1]
            else:
                version_label = parts[-1]
                base_url = url_no_query + "/"
            version_num = re.sub(r"^[vV]", "", version_label)
            key = f"NSDBSoilNameAndLayerV{version_num}"

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            entry = {
                "title": "NSDB Soil Name and Layer Tables",
                "name": key,
                "version": version_label,
                "content_type": "NSDB",
                "file_format": "html",
                "reachable_from": {"source_ontology": url},
                "download_date": datetime.date.today().isoformat(),
                "description": "This schema contains summary information for named soils within the Canadian soil surveys NSDB database",
            }
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")

            # Create skeleton LinkML YAML for this source
            yaml_path = f"sources/{key}.yaml"
            schema = make_config_schema(id=base_url, name=key, title=entry["title"],
                                 description=entry["description"], license="CC0",
                                 default_prefix="menu")
            with open(yaml_path, "w") as f:
                yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
            print(f"Created {yaml_path}")
            continue

        # URL-pattern detection: NSDB Soil Landscapes of Canada (SLC)
        if "sis.agr.gc.ca" in url and "/nsdb/slc/" in url:
            with open(tmp_path, encoding="utf-8", errors="replace") as _hf:
                _slc_html = _hf.read()

            # Title from <meta name="dcterms.title" content="...">
            _meta_m = re.search(
                r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
                _slc_html, re.IGNORECASE)
            if not _meta_m:
                _meta_m = re.search(
                    r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
                    _slc_html, re.IGNORECASE)
            slc_title = _meta_m.group(1).strip() if _meta_m else "NSDB Soil Landscapes of Canada"

            # Version from "version x.y" in title
            _ver_m = re.search(r'[Vv]ersion\s+([\d.]+)', slc_title)
            slc_version = _ver_m.group(1) if _ver_m else ""
            _ver_key = slc_version.replace(".", "_") if slc_version else ""
            key = f"NSDBSLCv{_ver_key}" if _ver_key else "NSDBSLC"

            # Description from first <p>
            _p_m = re.search(r'<p[^>]*>(.*?)</p>', _slc_html, re.IGNORECASE | re.DOTALL)
            slc_description = strip_tags(_p_m.group(1)).strip() if _p_m else ""

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            entry = {
                "title":       slc_title,
                "name":        key,
                "version":     slc_version,
                "content_type": "NSDBSLC",
                "file_format": "html",
                "reachable_from": {"source_ontology": url},
                "download_date": datetime.date.today().isoformat(),
                "description":  slc_description,
            }
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")

            yaml_path = f"sources/{key}.yaml"
            slc_schema = make_config_schema(id=url, name=key, title=slc_title,
                                     description=slc_description, version=slc_version)
            with open(yaml_path, "w") as f:
                yaml.dump(slc_schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
            print(f"Created {yaml_path}")
            continue

        # URL-pattern detection: HL7 terminology LOINC valueset listing page
        # Matches pages like valuesets.html / valuesets-fhir.html but not
        # individual detail pages such as ValueSet-pronouns.html.
        url_stem = url.split("?")[0].rstrip("/").split("/")[-1]
        if ("terminology.hl7.org" in url and url_stem.endswith(".html")
                and not url_stem.startswith("ValueSet-")
                and not url_stem.startswith("CodeSystem-")):
            url_stem_noext = url_stem.rsplit(".", 1)[0]
            key = "LOINC" + to_camel_case(url_stem_noext)

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            with open(output_path) as f:
                html_text = f.read()
            description = find_description_before_table(html_text)

            entry = {
                "title": f"LOINC {to_camel_case(url_stem_noext)} Value Sets",
                "name": key,
                "version": None,
                "content_type": "LOINC",
                "file_format": "html",
                "reachable_from": {"source_ontology": url},
                "download_date": datetime.date.today().isoformat(),
                "prefixes": {"LOINC": "https://loinc.org/"},
            }
            if description:
                entry["description"] = description
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")
            print(f"Run '-c {key}' to fetch all ValueSet enums from the listing page.")
            continue

        # URL-pattern detection: Statistics Canada variable definition page
        # e.g. https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1441857
        if "statcan.gc.ca" in url and "p3VD.pl" in url and "Function=getVD" in url:
            tvd_m = re.search(r'[?&]TVD=(\d+)', url)
            tvd_id = tvd_m.group(1) if tvd_m else "unknown"
            key = f"STATSCAN{tvd_id}"

            with open(config_file) as f:
                config = yaml.safe_load(f) or {}
            if key in config.get("sources", {}):
                print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

            output_path = f"sources/{key}.html"
            os.rename(tmp_path, output_path)
            print(f"Saved to {output_path}")

            with open(output_path) as f:
                html_text = f.read()

            # Extract title from <meta name="dcterms.title" content="..."> (attr order varies)
            title = ""
            for meta_m in re.finditer(r'<meta\b([^>]*)>', html_text, re.IGNORECASE):
                attrs = meta_m.group(1)
                if re.search(r'\bname=["\']dcterms\.title["\']', attrs, re.IGNORECASE):
                    content_m = re.search(r'\bcontent=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
                    if content_m:
                        title = content_m.group(1).strip()
                        break
            if not title:
                title = f"StatsCan Variable {tvd_id}"

            # Version: alphanumeric word/code immediately following "version" in the title
            version_m = re.search(r'\bversion\s+([A-Za-z0-9][A-Za-z0-9._-]*)', title, re.IGNORECASE)
            version = version_m.group(1) if version_m else None

            entry = {
                "title": title,
                "name": key,
                "version": version,
                "content_type": "STATSCAN",
                "file_format": "html",
                "reachable_from": {"source_ontology": url},
                "download_date": datetime.date.today().isoformat(),
            }
            config.setdefault("sources", {})[key] = entry
            write_config(config, config_file)
            print(f"Added source '{key}' to {config_file}")

            # Fetch French-language version of the source page
            fr_html_path = f"sources/{key}_fr.html"
            try:
                print(f"  Fetching French source page {statscan_fr_url(url)} ...")
                with open(fr_html_path, "w", encoding="utf-8") as _fr_f:
                    _fr_f.write(fetch_html(statscan_fr_url(url)))
                print(f"Saved to {fr_html_path}")
            except Exception as e:
                print(f"  Warning: could not fetch French source page: {e}", file=sys.stderr)
            continue

        # Content detection: NAPCS Canada CSV (auto-detected from column headers)
        # Matches either bilingual or English-only NAPCS CSV exports from StatsCan.
        try:
            with open(tmp_path, newline='', encoding='utf-8-sig') as _csv_f:
                _csv_headers = next(csv.reader(_csv_f), None)
        except Exception:
            _csv_headers = None

        if _csv_headers is not None:
            _norm_headers = {c.strip().lower() for c in _csv_headers}
            _napcs_signals = {
                'class title', 'code title', 'class definition',
                'element description english', 'titres de classes',
                'définitions de la classe', 'hierarchical structure',
                'structure hiérarchique',
            }
            if 'code' in _norm_headers and bool(_napcs_signals & _norm_headers):
                # Extract year from downloaded filename first, then fall back to URL
                _name_for_year = downloaded_filename or url
                year_m = re.search(r'\b(20\d{2})\b', _name_for_year)
                year = year_m.group(1) if year_m else ""

                # Detect NAPCS variant from the Content-Disposition filename, e.g.:
                # "Variant of NAPCS Canada 2022 Version 1.0 - Farm Product Price Index - FPPI (regrouping variant)"
                variant_m = re.search(
                    r'\bVariant of NAPCS Canada[^-]*-\s*(.+?)\s*\([^)]+\)',
                    downloaded_filename, re.IGNORECASE)
                if variant_m:
                    variant_name = variant_m.group(1).strip()
                    key = f"NAPCSCanada{to_pascal_case_key(variant_name)}{year}"
                    # Title: use the filename stem (without .csv extension)
                    title = re.sub(r'\.csv$', '', downloaded_filename, flags=re.IGNORECASE).strip()
                    if not title:
                        title = f"NAPCS Canada {year} — {variant_name}" if year else f"NAPCS Canada — {variant_name}"
                else:
                    key = f"NAPCSCanada{year}" if year else "NAPCSCanada"
                    title = ("North American Product Classification System (NAPCS) Canada"
                             + (f" {year}" if year else ""))

                with open(config_file) as f:
                    config = yaml.safe_load(f) or {}
                if key in config.get("sources", {}):
                    print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
                          file=sys.stderr)
                    os.unlink(tmp_path)
                    continue

                output_path = f"sources/{key}.csv"
                os.rename(tmp_path, output_path)
                print(f"Saved to {output_path}")

                version = year if year else None

                entry = {
                    "title": title,
                    "name": key,
                    "version": version,
                    "content_type": "NAPCSCanada",
                    "file_format": "csv",
                    "see_also": ["https://www.statcan.gc.ca/en/subjects/standard/napcs/2022/index"],
                    "prefixes": {"napcscanada": "napcscanada/"},
                    "reachable_from": {"source_ontology": url},
                    "download_date": datetime.date.today().isoformat(),
                }
                config.setdefault("sources", {})[key] = entry
                write_config(config, config_file)
                print(f"Added source '{key}' to {config_file}")
                continue

        content_type = file_format = key = None
        schema_data = None

        # Try JSON
        try:
            with open(tmp_path) as f:
                record = json.load(f)
            resource_type = record.get("resourceType", "")
            if resource_type == "CodeSystem":
                content_type = "LOINCCodeSystem"
                file_format = "json"
            elif resource_type == "ValueSet":
                content_type = "LOINCValueSet"
                file_format = "json"
            else:
                print(f"  Skipping {url}: JSON resourceType '{resource_type}' not supported", file=sys.stderr)
                os.unlink(tmp_path)
                continue
            raw_name = record.get("name", "")
            if raw_name:
                parts = re.split(r"[\s\-_]+", raw_name)
                key = "LOINC" + (to_camel_case(raw_name) if len(parts) > 1 else raw_name)
            else:
                url_base = url.split("?")[0].rstrip("/").split("/")[-1]
                key = url_base.rsplit(".", 1)[0] if "." in url_base else url_base

        except (json.JSONDecodeError, ValueError):
            # Try YAML
            try:
                with open(tmp_path) as f:
                    schema_data = yaml.safe_load(f)
                if not isinstance(schema_data, dict) or not (schema_data.get("enums") or schema_data.get("id")):
                    print(f"  Skipping {url}: not a recognised LinkML schema or LOINC JSON file", file=sys.stderr)
                    os.unlink(tmp_path)
                    continue
                content_type = "LinkML"
                file_format = "yaml"
                key = schema_data.get("name") or ""
                if not key:
                    url_base = url.split("?")[0].rstrip("/").split("/")[-1]
                    key = url_base.rsplit(".", 1)[0] if "." in url_base else url_base
            except Exception as e:
                print(f"  Skipping {url}: could not parse as JSON or YAML: {e}", file=sys.stderr)
                os.unlink(tmp_path)
                continue

        # Check for key collision
        with open(config_file) as f:
            config = yaml.safe_load(f) or {}
        if key in config.get("sources", {}):
            print(f"  Skipping {url}: source key '{key}' already exists in {config_file}", file=sys.stderr)
            os.unlink(tmp_path)
            continue

        # Move to sources/
        output_path = f"sources/{key}.{file_format}"
        os.rename(tmp_path, output_path)
        print(f"Saved to {output_path}")

        # Build config entry
        entry = {
            "title": schema_data.get("title") or None if schema_data else None,
            "name": schema_data.get("name") or None if schema_data else None,
            "version": schema_data.get("version") or None if schema_data else None,
            "content_type": content_type,
            "file_format": file_format,
            "reachable_from": {"source_ontology": url},
            "download_date": datetime.date.today().isoformat(),
        }
        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            entry["see_also"] = url + ".html"
        config.setdefault("sources", {})[key] = entry
        write_config(config, config_file)
        print(f"Added source '{key}' to {config_file}")

        # Fill LOINC metadata (may rename key and file)
        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            key, output_path = fill_loinc_source_metadata(output_path, key, config_file)

        # Process the source to generate LinkML YAML and update prefix dict in config
        process_sources([key], config_file)


def process_sources(source_keys=None, config_file=MENU_CONFIG):
    """Store per-source prefix dicts into menu_config.yaml from fetched source files.

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

        if content_type == "STATSCAN":
            html_path = f"sources/{key}.html"
            if not os.path.exists(html_path):
                print(f"Skipping {key}: {html_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_statscan_source(key, source, config_file)
            continue

        if content_type == "NAPCSCanada":
            csv_path = f"sources/{key}.csv"
            if not os.path.exists(csv_path):
                print(f"Skipping {key}: {csv_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_napcscanada_source(key, source, config_file)
            continue

        if content_type in ("NSDBSNT", "NSDBSLT"):
            html_path = f"sources/{key}.html"
            if not os.path.exists(html_path):
                print(f"Skipping {key}: {html_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_nsdb_html_source(key, source, enum_prefix="NSDB")
            continue

        if content_type == "NSDB":
            html_path = f"sources/{key}.html"
            if not os.path.exists(html_path):
                print(f"Skipping {key}: {html_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_nsdb_source(key, source)
            continue

        if content_type == "NSDBSLC":
            html_path = f"sources/{key}.html"
            if not os.path.exists(html_path):
                print(f"Skipping {key}: {html_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_nsdb_html_source(key, source, enum_prefix="NSDBSLC")
            continue

        if content_type == "LOINC":
            html_path = f"sources/{key}.html"
            if not os.path.exists(html_path):
                print(f"Skipping {key}: {html_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            process_loinc_table_source(key, source, config_file)
            continue

        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            json_path = f"sources/{key}.json"
            if not os.path.exists(json_path):
                print(f"Skipping {key}: {json_path} not found — run -f to fetch first", file=sys.stderr)
                continue
            if content_type == "LOINCCodeSystem":
                yaml_path = convert_loinc_codesystem_to_linkml(key, source)
            else:
                yaml_path = convert_loinc_valueset_to_linkml(key, source)
            with open(yaml_path) as f:
                generated = yaml.safe_load(f)
            update_source_config(key, {"prefixes": dict(generated.get("prefixes") or {})}, config_file)
            continue

        if file_format != "yaml":
            print(f"Skipping {key}: processing not supported for file_format '{file_format}'")
            continue

        source_path = f"sources/{key}.{file_format}"
        if not os.path.exists(source_path):
            print(f"Skipping {key}: {source_path} not found — run -f to fetch first", file=sys.stderr)
            continue

        with open(source_path, "r") as f:
            source_data = yaml.safe_load(f)

        source_prefixes = source_data.get("prefixes") or {}
        update_source_config(key, {"prefixes": dict(source_prefixes)}, config_file)
        print(f"{key}: prefix list updated ({len(source_prefixes)} prefixes)")


def fetch_html(url):
    """Fetch a URL and return its decoded text content."""
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")


def strip_tags(html):
    """Remove all HTML tags from a string and return stripped plain text."""
    return re.sub(r'<[^>]+>', '', html).strip()


def parse_loinc_table_page(html_text, base_url=""):
    """Parse a LOINC terminology HTML listing page, returning a list of row dicts.

    Searches for the first table containing a 'Name' column (case-insensitive)
    and extracts Name, Version, Status, Description/Title, and Identity link
    fields from each data row.  The Identity href is resolved to an absolute URL
    and stored as identity_url; process_loinc_table_source uses it (replacing
    .html with .json) as the JSON download URL for each ValueSet.

    Returns a list of dicts with keys: name, identity_url, and optionally
    version, status, description.
    """
    for table_html in re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL):
        table_rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        if not table_rows:
            continue
        header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', table_rows[0], re.IGNORECASE | re.DOTALL)
        header_texts = [strip_tags(h).strip().lower() for h in header_cells]
        if 'name' not in header_texts:
            continue

        name_col = header_texts.index('name')
        identity_col = next((i for i, h in enumerate(header_texts) if h == 'identity'), None)
        version_col = next((i for i, h in enumerate(header_texts) if h == 'version'), None)
        status_col = next((i for i, h in enumerate(header_texts) if h == 'status'), None)
        desc_col = next((i for i, h in enumerate(header_texts)
                         if h in ('description', 'title')), None)

        rows = []
        for row_html in table_rows[1:]:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
            if len(cells) <= name_col:
                continue
            # Name cell may be plain text or a link; use link text preferentially
            name_cell = cells[name_col]
            link_m = re.search(r'<a[^>]*>(.*?)</a>', name_cell, re.IGNORECASE | re.DOTALL)
            name = strip_tags(link_m.group(1) if link_m else name_cell).strip()
            if not name:
                continue
            row = {"name": name}
            # Extract Identity column href and resolve to absolute URL
            if identity_col is not None and len(cells) > identity_col:
                id_link = re.search(r'<a\s[^>]*href=["\']([^"\']+)["\']',
                                    cells[identity_col], re.IGNORECASE)
                if id_link:
                    row["identity_url"] = urllib.parse.urljoin(base_url, id_link.group(1))
            if version_col is not None and len(cells) > version_col:
                row["version"] = strip_tags(cells[version_col]).strip()
            if status_col is not None and len(cells) > status_col:
                row["status"] = strip_tags(cells[status_col]).strip()
            if desc_col is not None and len(cells) > desc_col:
                row["description"] = strip_tags(cells[desc_col]).strip()
            rows.append(row)

        if rows:
            return rows

    return []


def find_description_before_table(html_text):
    """Return the text of the paragraph immediately preceding the first table
    with a 'Name' column, typically the introductory description of the listing.

    Locates the byte-position of the matching table, then finds the last <p>
    element that ends before that position.  Returns an empty string if no
    suitable paragraph is found.
    """
    # Find start position of the first table that has a Name column header
    table_start = None
    for m in re.finditer(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL):
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', m.group(1), re.IGNORECASE | re.DOTALL)
        if not rows:
            continue
        header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', rows[0], re.IGNORECASE | re.DOTALL)
        if 'name' in [strip_tags(h).strip().lower() for h in header_cells]:
            table_start = m.start()
            break

    if table_start is None:
        return ""

    # Last <p>...</p> before the table
    before_table = html_text[:table_start]
    paragraphs = list(re.finditer(r'<p[^>]*>(.*?)</p>', before_table, re.IGNORECASE | re.DOTALL))
    if paragraphs:
        return strip_tags(paragraphs[-1].group(1)).strip()

    return ""


def find_labeled_field(html_text, label):
    """Return the first paragraph of content from a named field in the HTML.

    Compares the inner text (HTML tags stripped) of each cell to the label so
    that formatting such as <b>Definition</b> is handled transparently.

    Searches:
    - Table rows: a cell whose inner text matches label, then uses the next cell
    - Definition lists: <dt> whose inner text matches label, then uses <dd>

    Returns the text of the first <p> inside the content, or the full stripped
    content if no <p> tags are present.  Returns "" if the label is not found.
    """
    label_lower = label.strip().lower()

    def _extract(content):
        p_m = re.search(r'<p[^>]*>(.*?)</p>', content, re.IGNORECASE | re.DOTALL)
        return strip_tags(p_m.group(1) if p_m else content).strip()

    # Table rows: label must be the first cell (properties/metadata tables);
    # this avoids false matches on expansion table column headers where the
    # label may appear at an arbitrary position mid-row.
    for row_html in re.findall(r'<tr[^>]*>(.*?)</tr>', html_text, re.IGNORECASE | re.DOTALL):
        cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row_html, re.IGNORECASE | re.DOTALL)
        if len(cells) >= 2 and strip_tags(cells[0]).strip().lower() == label_lower:
            return _extract(cells[1])

    # Definition lists: check inner text of <dt>, return content of <dd>
    for dt_m in re.finditer(r'<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>',
                             html_text, re.IGNORECASE | re.DOTALL):
        if strip_tags(dt_m.group(1)).strip().lower() == label_lower:
            return _extract(dt_m.group(2))

    return ""


def parse_loinc_valueset_html_page(html_text):
    """Parse an individual LOINC ValueSet HTML expansion page.

    Finds the first table with a Code column and extracts Code, Display (en),
    Definition, Status, and optionally Level fields from each data row.

    Definition: only the text of the first <p> element in the cell is used;
    if no <p> tags are present, the full stripped cell text is used.

    Level hierarchy: when a Level column is present, rows at level > 1 receive
    an is_a attribute pointing to the code of the first preceding row whose
    level is exactly one less than the current row.

    Returns (description, permissible_values) where description is the text of
    the paragraph preceding the table (via find_description_before_table) and
    permissible_values is a dict of
    {code: {name, [title], [description], [status], [is_a]}}.
    """
    description = find_labeled_field(html_text, "Definition")
    permissible_values = {}

    # Prefer <table class="codes"> (the expansion table); fall back to any table
    table_candidates = re.findall(
        r'<table\b[^>]*\bclass=["\'][^"\']*\bcodes\b[^"\']*["\'][^>]*>(.*?)</table>',
        html_text, re.IGNORECASE | re.DOTALL)
    if not table_candidates:
        table_candidates = re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL)

    for table_html in table_candidates:
        table_rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        if not table_rows:
            continue
        header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', table_rows[0], re.IGNORECASE | re.DOTALL)
        header_texts = [strip_tags(h).strip().lower() for h in header_cells]

        code_col = next((i for i, h in enumerate(header_texts) if h == 'code'), None)
        if code_col is None:
            continue

        display_col = next((i for i, h in enumerate(header_texts) if 'display' in h), None)
        def_col    = next((i for i, h in enumerate(header_texts) if h == 'definition'), None)
        status_col = next((i for i, h in enumerate(header_texts) if h == 'status'), None)
        level_col  = next((i for i, h in enumerate(header_texts) if h == 'level'), None)

        processed = []  # list of (code, level) used for is_a parent lookup

        for row_html in table_rows[1:]:
            # Normalize self-closing <td/> so column indices match the header
            row_html = re.sub(r'<td([^>]*)/>', r'<td\1></td>', row_html, flags=re.IGNORECASE)
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
            if len(cells) <= code_col:
                continue
            code = strip_tags(cells[code_col]).strip()
            if not code:
                continue

            entry = {"name": code}

            if display_col is not None and len(cells) > display_col:
                display = strip_tags(cells[display_col]).strip()
                if display:
                    entry["title"] = display

            if def_col is not None and len(cells) > def_col:
                def_cell = cells[def_col]
                p_m = re.search(r'<p[^>]*>(.*?)</p>', def_cell, re.IGNORECASE | re.DOTALL)
                def_text = strip_tags(p_m.group(1) if p_m else def_cell).strip()
                if def_text:
                    entry["description"] = def_text

            if status_col is not None and len(cells) > status_col:
                status = strip_tags(cells[status_col]).strip()
                if status:
                    entry["status"] = status.upper()

            level = None
            if level_col is not None and len(cells) > level_col:
                try:
                    level = int(strip_tags(cells[level_col]).strip())
                except (ValueError, TypeError):
                    pass

            if level is not None and level > 1:
                for prev_code, prev_level in reversed(processed):
                    if prev_level == level - 1:
                        entry["is_a"] = prev_code
                        break

            processed.append((code, level if level is not None else 1))
            permissible_values[code] = entry

        if permissible_values:
            break

    return description, permissible_values


def find_links_by_text(html_text, link_texts, base_url):
    """Find anchor links whose display text matches any entry in link_texts.

    Returns {display_text: absolute_url}.
    """
    results = {}
    for m in re.finditer(r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                         html_text, re.IGNORECASE | re.DOTALL):
        text = strip_tags(m.group(2))
        if text in link_texts:
            results[text] = urllib.parse.urljoin(base_url, m.group(1))
    return results


def find_section_paragraph(html_text, section_name):
    """Return plain text of the first paragraph following a header containing section_name."""
    m = re.search(
        r'<h[2-4][^>]*>[^<]*' + re.escape(section_name) + r'[^<]*</h[2-4]>'
        r'(?:\s*<[^>]+>)*\s*<p[^>]*>(.*?)</p>',
        html_text, re.IGNORECASE | re.DOTALL
    )
    return strip_tags(m.group(1)) if m else ""


def find_named_section_links(html_text, section_name, base_url):
    """Find Name-column links from the table in a named section.

    Locates a heading whose text contains section_name (case-insensitive) and
    returns links from the Name column of the first table in that section.
    Falls back to all <a> hrefs in the section if no Name-column table is found.

    Returns a list of (name, absolute_url) tuples.
    """
    m = re.search(
        r'<(h[2-4])[^>]*>[^<]*' + re.escape(section_name) + r'[^<]*</\1>(.*?)(?=<h[2-4]|\Z)',
        html_text, re.IGNORECASE | re.DOTALL
    )
    if not m:
        return []
    section_html = m.group(2)
    table_m = re.search(r'<table[^>]*>(.*?)</table>', section_html, re.IGNORECASE | re.DOTALL)
    if table_m:
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        if rows:
            header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', rows[0], re.IGNORECASE | re.DOTALL)
            header_texts = [strip_tags(h).lower() for h in header_cells]
            name_col = next((i for i, h in enumerate(header_texts) if h == 'name'), None)
            if name_col is not None:
                results = []
                for row in rows[1:]:
                    cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.IGNORECASE | re.DOTALL)
                    if len(cells) > name_col:
                        link_m = re.search(r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                                            cells[name_col], re.IGNORECASE | re.DOTALL)
                        if link_m:
                            results.append((strip_tags(link_m.group(2)),
                                             urllib.parse.urljoin(base_url, link_m.group(1))))
                return results
    # Fallback: collect all <a> hrefs in the section
    results = []
    for link_m in re.finditer(r'<a\s[^>]*href=["\']([^"\'#][^"\']*)["\'][^>]*>(.*?)</a>',
                               section_html, re.IGNORECASE | re.DOTALL):
        text = strip_tags(link_m.group(2)).strip()
        if text:
            results.append((text, urllib.parse.urljoin(base_url, link_m.group(1))))
    return results


def find_contents_table_links(html_text, base_url):
    """Find Name-column links from the Contents section table.

    Returns a list of (name, absolute_url) tuples.
    """
    return find_named_section_links(html_text, "Contents", base_url)


def find_list_section_links(html_text, section_text, base_url):
    """Find <a> links from the <ol> nested inside a <li> whose label contains section_text.

    Handles structures like:
      <li><abbr title="...">SLC</abbr> attribute tables <ol><li><a href="...">...</a></li></ol></li>
      <li>Ecological Framework Tables <ol>...</ol></li>

    For each <li>, strips tags from the content before the first nested <ol> to form the
    label; if the label contains section_text (case-insensitive), returns all <a> links
    found within that <ol>.

    Returns a list of (name, absolute_url) tuples.
    """
    for li_m in re.finditer(r'<li\b[^>]*>', html_text, re.IGNORECASE):
        after_li = html_text[li_m.end():]
        ol_m = re.search(r'<ol\b[^>]*>(.*?)</ol>', after_li, re.IGNORECASE | re.DOTALL)
        if not ol_m:
            continue
        label_text = strip_tags(after_li[:ol_m.start()]).strip()
        if section_text.lower() not in label_text.lower():
            continue
        results = []
        for link_m in re.finditer(
                r'<a\s[^>]*href=["\']([^"\'#][^"\']*)["\'][^>]*>(.*?)</a>',
                ol_m.group(1), re.IGNORECASE | re.DOTALL):
            text = strip_tags(link_m.group(2)).strip()
            if text:
                results.append((text, urllib.parse.urljoin(base_url, link_m.group(1))))
        if results:
            return results
    return []


def parse_attribute_page(html_text):
    """Parse an NSDB attribute definition page.

    Returns (label, title, description, pv_tables) where pv_tables is a list
    of lists of {'code', 'class_', 'description'} dicts — one inner list per
    permissible-value table found on the page.
    """
    label = title = description = ""

    def norm_key(raw):
        """Normalise a cell key: strip tags, collapse whitespace/underscores, remove trailing colon."""
        return re.sub(r'[\s_]+', ' ', strip_tags(raw)).lower().rstrip(':').strip()

    # Scan all tables for attribute definition rows (label, title, definition/description).
    # This avoids relying on "Attribute Definition" heading placement in the HTML.
    all_tables = re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL)
    for table_html in all_tables:
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        for row in rows:
            cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.IGNORECASE | re.DOTALL)
            if len(cells) >= 2:
                k = norm_key(cells[0])
                v = strip_tags(cells[1])
                if k in ('attribute label', 'label'):
                    label = v
                elif k in ('attribute title', 'title'):
                    title = v
                elif k in ('attribute definition', 'attribute description', 'definition', 'description'):
                    description = v
        if label:
            break  # Found the attribute definition table; stop scanning

    pv_tables = []
    for table_html in re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL):
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        if not rows:
            continue
        header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', rows[0], re.IGNORECASE | re.DOTALL)
        header_texts = [strip_tags(h).lower() for h in header_cells]
        if 'code' not in header_texts:
            continue
        code_idx = header_texts.index('code')
        class_idx = next((i for i, h in enumerate(header_texts)
                          if h in ('class', 'classe', 'catégorie', 'categorie')), None)
        desc_idx  = next((i for i, h in enumerate(header_texts)
                          if h in ('description', 'définition', 'definition')), None)
        pv_rows = []
        for row in rows[1:]:
            cells = [strip_tags(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.IGNORECASE | re.DOTALL)]
            if len(cells) > code_idx and cells[code_idx]:
                pv_rows.append({
                    'code': cells[code_idx],
                    'class_': cells[class_idx] if class_idx is not None and len(cells) > class_idx else "",
                    'description': cells[desc_idx] if desc_idx is not None and len(cells) > desc_idx else "",
                })
        if pv_rows:
            pv_tables.append(pv_rows)

    return label, title, description, pv_tables


def nsdb_fr_url(url):
    """Return the French-language equivalent of an NSDB URL.

    The French NSDB pages live under ``/siscan/`` rather than ``/cansis/``.
    """
    return url.replace('/cansis/', '/siscan/')


def _build_nsdb_enum(attr_html, enum_prefix, require_qualifying=True):
    """Parse an NSDB attribute page and return ``(enum_key, enum_dict)`` or ``(None, None)``.

    Parameters
    ----------
    attr_html : str
        Raw HTML of the attribute page.
    enum_prefix : str
        Prefix for the enum key, e.g. ``"NSDB"`` or ``"NSDBSLC"``.
    require_qualifying : bool
        When True (default) only return an enum when the pv_tables have more
        than 2 tables, or any table has more than 2 rows.  Set to False for
        single-attribute-page sources where every attribute should be included.

    Returns
    -------
    tuple
        ``(enum_key, enum_dict)`` on success, ``(None, None)`` otherwise.
    """
    label, title, attr_desc, pv_tables = parse_attribute_page(attr_html)
    if not label:
        return None, None
    if require_qualifying and not (
            len(pv_tables) > 2 or any(len(rows) > 2 for rows in pv_tables)):
        return None, None
    enum_key = f"{enum_prefix}_{label}"
    permissible_values = {}
    for rows in pv_tables:
        for row in rows:
            code = row['code']
            permissible_values[code] = {
                "text":        code,
                "title":       row['class_'],
                "description": row['description'],
            }
    enum_dict = {
        "name":               label,
        "title":              title,
        "description":        attr_desc,
        "permissible_values": permissible_values,
    }
    return enum_key, enum_dict


def _fetch_fr_attr_pvs(attr_url_by_enum, schema_enums, indent="  "):
    """Fetch French permissible values for each enum in *attr_url_by_enum*.

    Parameters
    ----------
    attr_url_by_enum : dict
        ``{enum_key: english_attr_url}`` mapping built during the EN pass.
    schema_enums : dict
        The ``schema["enums"]`` dict, used to look up existing EN codes.
    indent : str
        Leading whitespace for progress/warning messages (default ``"  "``).

    Returns
    -------
    dict
        ``{enum_key: {code: {text, title?, description?}}}``
    """
    fr_enums_pvs = {}
    for enum_key, attr_url in attr_url_by_enum.items():
        fr_attr_url = nsdb_fr_url(attr_url)
        try:
            print(f"{indent}Fetching French attr page {fr_attr_url} ...")
            fr_attr_html = fetch_html(fr_attr_url)
            _, _, _, fr_pv_tables = parse_attribute_page(fr_attr_html)
            en_codes = set(schema_enums[enum_key].get("permissible_values") or {})
            fr_pvs = {}
            for rows in fr_pv_tables:
                for row in rows:
                    code = row['code']
                    if code in en_codes:
                        fr_entry = {"text": code}
                        if row['class_']:
                            fr_entry["title"] = row['class_']
                        if row['description']:
                            fr_entry["description"] = row['description']
                        fr_pvs[code] = fr_entry
            if fr_pvs:
                fr_enums_pvs[enum_key] = fr_pvs
                print(f"{indent}French: {len(fr_pvs)} translations for {enum_key}")
        except Exception as e:
            print(f"{indent}Warning: French attr fetch failed for {enum_key}: {e}",
                  file=sys.stderr)
    return fr_enums_pvs


def _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description):
    """Attach fr_locale extensions to *schema*, write YAML, and print a summary.

    If either *fr_enums_pvs* or *fr_description* is non-empty the function
    builds a ``extensions.locales.value.fr`` block and attaches it to *schema*
    before writing.
    """
    if fr_enums_pvs or fr_description:
        fr_locale = {
            "id":          nsdb_fr_url(base_url),
            "name":        key,
            "version":     source.get("version") or "",
            "in_language": "fr",
        }
        if fr_description:
            fr_locale["description"] = fr_description
        if fr_enums_pvs:
            fr_locale["enums"] = {ek: {"permissible_values": pvs}
                                   for ek, pvs in fr_enums_pvs.items()}
        schema["extensions"] = {
            "locales": {
                "tag":   "locales",
                "value": {"fr": fr_locale},
            }
        }
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    fr_parts = []
    if fr_description:
        fr_parts.append("description")
    if fr_enums_pvs:
        n = sum(len(pvs) for pvs in fr_enums_pvs.values())
        fr_parts.append(f"{len(fr_enums_pvs)} enums / {n} pvs")
    print(f"Updated {yaml_path}"
          + (f" (French: {', '.join(fr_parts)})" if fr_parts else ""))


def _fetch_and_build_enums(attr_links, schema_enums, enum_prefix, indent="  "):
    """Fetch each attribute URL, build its enum, populate *schema_enums* in-place.

    Parameters
    ----------
    attr_links : list of (name, url)
        Attribute links from find_contents_table_links.
    schema_enums : dict
        The ``schema["enums"]`` dict to populate in-place.
    enum_prefix : str
        Prefix for the enum key, e.g. ``"NSDB"`` or ``"NSDBSLC"``.
    indent : str
        Leading whitespace for progress/warning messages (default ``"  "``).

    Returns
    -------
    dict
        ``{enum_key: attr_url}`` for qualifying enums, used by _fetch_fr_attr_pvs.
    """
    attr_url_by_enum = {}
    for attr_name, attr_url in attr_links:
        try:
            attr_html = fetch_html(attr_url)
        except Exception as e:
            print(f"{indent}Error fetching {attr_url}: {e}", file=sys.stderr)
            continue
        enum_key, enum_dict = _build_nsdb_enum(attr_html, enum_prefix)
        if enum_key is None:
            continue
        schema_enums[enum_key] = enum_dict
        attr_url_by_enum[enum_key] = attr_url
        print(f"{indent}Added enum {enum_key} ({len(enum_dict['permissible_values'])} values)")
    return attr_url_by_enum


def process_nsdb_html_source(key, source, enum_prefix):
    """Build a LinkML enum YAML for an NSDB HTML source.

    Supports three URL forms for source_ontology, detected by page content:

    * SLC index page — page contains "SLC attribute tables" or "Ecological
      Framework Tables" sections.  Two-level processing: for each component
      follows attribute links to individual attribute pages.
    * Component / index page — page has a Contents table of attribute links
      but no SLC-specific sections.  One-level processing.
    * Single attribute page — no Contents table.  Parses the page directly
      and writes a single enum.

    In all cases also fetches French equivalents via nsdb_fr_url() and writes
    extensions.locales.value.fr when French content is found.

    Parameters
    ----------
    enum_prefix : str
        Prefix for enum keys, e.g. ``"NSDB"`` for SNT/SLT sources or
        ``"NSDBSLC"`` for SLC sources.
    """
    yaml_path = f"sources/{key}.yaml"
    base_url  = (source.get("reachable_from") or {}).get("source_ontology", "")
    html_path = f"sources/{key}.html"

    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            schema = yaml.safe_load(f) or {}
    else:
        schema = make_config_schema(id=base_url, name=key, title=source.get("title", ""),
                             description=source.get("description", ""),
                             version=source.get("version", ""))
    schema["enums"] = {}
    schema.pop("extensions", None)

    with open(html_path, encoding="utf-8", errors="replace") as f:
        page_html = f.read()

    # Default description from first <p>
    p_m = re.search(r'<p[^>]*>(.*?)</p>', page_html, re.IGNORECASE | re.DOTALL)
    schema["description"] = strip_tags(p_m.group(1)).strip() if p_m else source.get("description", "")

    fr_enums_pvs = {}
    fr_description = ""

    # ---- Detect page type by content ----------------------------------------
    # SLC index pages contain named sections; all other NSDB pages do not.
    _slc_sections = ["SLC attribute tables", "Ecological Framework Tables"]
    component_links = []
    for _sect in _slc_sections:
        _links = find_list_section_links(page_html, _sect, base_url)
        if _links:
            print(f"  Section '{_sect}': {len(_links)} links")
        component_links.extend(_links)

    if component_links:
        # ---- SLC index: two-level component → attribute processing ----------
        for comp_name, comp_url in component_links:
            print(f"  Processing component '{comp_name}' ...")
            try:
                comp_html = fetch_html(comp_url)
            except Exception as e:
                print(f"  Error fetching {comp_url}: {e}", file=sys.stderr)
                continue

            comp_desc = find_section_paragraph(comp_html, "Description")
            if comp_desc:
                existing = schema.get("description", "")
                schema["description"] = (existing + "\n" + comp_desc).strip() if existing else comp_desc

            attr_links = find_contents_table_links(comp_html, comp_url)
            print(f"    Found {len(attr_links)} attribute links")

            fr_comp_url = nsdb_fr_url(comp_url)
            try:
                print(f"    Fetching French component page {fr_comp_url} ...")
                fr_comp_html = fetch_html(fr_comp_url)
                fr_desc = find_section_paragraph(fr_comp_html, "Description")
                if fr_desc:
                    fr_description = (fr_description + "\n" + fr_desc).strip() if fr_description else fr_desc
            except Exception as e:
                print(f"    Warning: French component page fetch failed: {e}", file=sys.stderr)

            attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], enum_prefix, indent="    ")
            fr_enums_pvs.update(_fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="    "))

    else:
        # ---- Component/index page or direct attribute page ------------------
        attr_links = find_contents_table_links(page_html, base_url)

        if attr_links:
            # ---- Has Contents table: process attribute links ----------------
            print(f"  Found {len(attr_links)} attribute links")

            # Try dcterms.title (SNT/SLT index pages carry this)
            _meta_m = re.search(
                r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
                page_html, re.IGNORECASE)
            if not _meta_m:
                _meta_m = re.search(
                    r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
                    page_html, re.IGNORECASE)
            if _meta_m:
                schema["title"] = _meta_m.group(1).strip()

            desc = find_section_paragraph(page_html, "Description")
            if desc:
                schema["description"] = desc

            fr_page_url = nsdb_fr_url(base_url)
            try:
                print(f"  Fetching French page {fr_page_url} ...")
                fr_page_html = fetch_html(fr_page_url)
                fr_description = find_section_paragraph(fr_page_html, "Description") or ""
            except Exception as e:
                print(f"  Warning: French page fetch failed: {e}", file=sys.stderr)

            attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], enum_prefix, indent="  ")
            fr_enums_pvs = _fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="  ")

        else:
            # ---- Direct attribute page: one enum ----------------------------
            enum_key, enum_dict = _build_nsdb_enum(page_html, enum_prefix, require_qualifying=False)
            if enum_key is None:
                print(f"  Warning: could not parse attribute label from {html_path}", file=sys.stderr)
                return
            schema["enums"][enum_key] = enum_dict
            schema["description"] = source.get("description") or enum_dict["description"]
            print(f"  Added enum {enum_key} ({len(enum_dict['permissible_values'])} values)")

            fr_url = nsdb_fr_url(base_url)
            try:
                print(f"  Fetching French attr page {fr_url} ...")
                fr_html = fetch_html(fr_url)
                _, _, fr_description, fr_pv_tables = parse_attribute_page(fr_html)
                en_codes = set(enum_dict["permissible_values"])
                fr_pvs = {}
                for rows in fr_pv_tables:
                    for row in rows:
                        code = row['code']
                        if code in en_codes:
                            fr_entry = {"text": code}
                            if row['class_']:
                                fr_entry["title"] = row['class_']
                            if row['description']:
                                fr_entry["description"] = row['description']
                            fr_pvs[code] = fr_entry
                if fr_pvs:
                    fr_enums_pvs[enum_key] = fr_pvs
            except Exception as e:
                print(f"  Warning: French attr page fetch failed: {e}", file=sys.stderr)

    _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description)


def process_nsdb_source(key, source):
    """Build a combined LinkML enum YAML by merging SNT and SLT enums.

    Fetches the NSDB index page (source_ontology), finds the "Soil Name Table"
    and "Soil Layer Table" component links, and for each processes all
    attribute pages using the shared NSDB helpers.
    """
    yaml_path = f"sources/{key}.yaml"
    base_url = (source.get("reachable_from") or {}).get("source_ontology", "")

    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            schema = yaml.safe_load(f) or {}
    else:
        schema = make_config_schema(id=base_url, name=key, title=source.get("title", ""),
                             description=source.get("description", ""),
                             version=source.get("version", ""))
    # Reset description, enums, and extensions before each run so repeated -c invocations
    # are idempotent.
    schema["description"] = source.get("description", "")
    schema["enums"] = {}
    schema.pop("extensions", None)

    print(f"  Fetching NSDB index {base_url} ...")
    try:
        index_html = fetch_html(base_url)
    except Exception as e:
        print(f"  Error fetching {base_url}: {e}", file=sys.stderr)
        return

    table_links = find_links_by_text(index_html, ["Soil Name Table", "Soil Layer Table"], base_url)
    if not table_links:
        print(f"  Warning: 'Soil Name Table' / 'Soil Layer Table' links not found", file=sys.stderr)

    fr_enums_pvs = {}
    fr_description = ""

    for table_name, table_url in table_links.items():
        print(f"  Processing '{table_name}' ...")
        try:
            table_html = fetch_html(table_url)
        except Exception as e:
            print(f"  Error fetching {table_url}: {e}", file=sys.stderr)
            continue

        desc = find_section_paragraph(table_html, "Description")
        if desc:
            existing = schema.get("description", "")
            schema["description"] = (existing + "\n" + desc).strip() if existing else desc

        attr_links = find_contents_table_links(table_html, table_url)
        print(f"    Found {len(attr_links)} attribute links")

        # French table description
        fr_table_url = nsdb_fr_url(table_url)
        try:
            print(f"    Fetching French table page {fr_table_url} ...")
            fr_table_html = fetch_html(fr_table_url)
            fr_desc = find_section_paragraph(fr_table_html, "Description")
            if fr_desc:
                fr_description = (fr_description + "\n" + fr_desc).strip() if fr_description else fr_desc
        except Exception as e:
            print(f"    Warning: French table page fetch failed: {e}", file=sys.stderr)

        attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], "NSDB", indent="    ")
        fr_enums_pvs.update(_fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="    "))

    _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description)


def parse_statscan_definitions(html_text):
    """Parse a StatsCan 'Display definitions' page.

    Returns {code: definition_text} where each code is the alphanumeric identifier
    (e.g. '111') extracted from <h2 class="bg-def-1"> headings of the form
    'CODE - Name', and the definition is the text of the first <p> that follows.
    """
    definitions = {}
    # Work within the panel-body section
    panel_m = re.search(
        r'<div\b[^>]*\bpanel-body\b[^>]*>(.*?)(?=<div\b[^>]*\bpanel\b|$)',
        html_text, re.IGNORECASE | re.DOTALL)
    body = panel_m.group(1) if panel_m else html_text

    for h2_m in re.finditer(
            r'<h2\b[^>]*\bbg-def-1\b[^>]*>(.*?)</h2>(.*?)(?=<h2\b[^>]*\bbg-def-1\b|$)',
            body, re.IGNORECASE | re.DOTALL):
        heading_text = html.unescape(strip_tags(h2_m.group(1))).strip()
        # Heading format: "CODE - Name" or "CODE Name"
        code_m = re.match(r'^(\S+)', heading_text)
        if not code_m:
            continue
        code = code_m.group(1)
        after = h2_m.group(2)
        p_m = re.search(r'<p\b[^>]*>(.*?)</p>', after, re.IGNORECASE | re.DOTALL)
        if p_m:
            definition = html.unescape(strip_tags(p_m.group(1))).strip()
            if definition:
                definitions[code] = definition
    return definitions


def parse_statscan_structure(html_text):
    """Parse a StatsCan 'Display structure' page.

    Returns an ordered list of (code, name, indent_level) tuples extracted from
    <li class="list-group-item indent-N"> items inside the panel-body <ul>.
    indent_level is 1-based (1 = top of this subtree).
    """
    items = []
    panel_m = re.search(
        r'<div\b[^>]*\bpanel-body\b[^>]*>(.*?)(?=<div\b[^>]*class=["\'][^"\']*(?:panel|footer)|$)',
        html_text, re.IGNORECASE | re.DOTALL)
    body = panel_m.group(1) if panel_m else html_text

    ul_m = re.search(r'<ul\b[^>]*\blist-group\b[^>]*>(.*?)(?=</ul>|$)', body, re.IGNORECASE | re.DOTALL)
    if not ul_m:
        return items
    ul_html = ul_m.group(1)

    # Some <li> items lack a closing </li>; capture up to the next <li> or end
    for li_m in re.finditer(
            r'<li\b[^>]*\bindent-(\d+)[^>]*>(.*?)(?=<li\b|$)',
            ul_html, re.IGNORECASE | re.DOTALL):
        indent = int(li_m.group(1))
        content = li_m.group(2)
        # Prefer <a> link text, fall back to plain text content
        a_m = re.search(r'<a\b[^>]*>(.*?)</a>', content, re.IGNORECASE | re.DOTALL)
        raw_text = html.unescape(strip_tags(a_m.group(1) if a_m else content)).strip()
        # Format is "CODE - Name" or "CODE Name"
        sep_m = re.match(r'^(\S+)\s*[-\u2013]\s*(.*)', raw_text)
        if sep_m:
            code, name = sep_m.group(1), sep_m.group(2).strip()
        else:
            parts = raw_text.split(None, 1)
            code, name = parts[0], (parts[1] if len(parts) > 1 else "")
        if code:
            items.append((code, name, indent))
    return items


def statscan_fr_url(url):
    """Return the French-language equivalent of a StatsCan IMDB page URL.

    StatsCan exposes French pages by inserting ``_f`` into the CGI script name,
    e.g. ``p3VD.pl`` → ``p3VD_f.pl``.  Works for all STATSCAN sub-pages
    (getVD, getVDStruct, display-definitions, CPV detail, etc.).
    """
    return re.sub(r'(?<=/)([\w]+)(\.pl)(?=\?)', r'\1_f\2', url)


def process_statscan_source(key, source, config_file=MENU_CONFIG):
    """Build a LinkML enum YAML for a STATSCAN source.

    Reads sources/{key}.html (the main variable definition page).  For each
    top-level classification code linked from that page it:
      1. Fetches the code's detail page.
      2. Fetches the 'Display structure' page → builds the full code hierarchy.
      3. Fetches the 'Display definitions' page → collects code definitions.

    Also fetches the source-level 'Display definitions' page for top-level
    code definitions.

    For codes that appear in the source page table without a hyperlink (i.e.
    leaf codes with no child entries), a permissible_value is created directly
    from the table row: the Code column provides the code and the Category (or
    Group/Class) column provides the title.  Definitions for these codes are
    taken from the source-level 'Display definitions' page.

    Writes sources/{key}.yaml with a single enum whose permissible_values carry
    name, title, optional description, and is_a.
    """
    html_path = f"sources/{key}.html"
    with open(html_path) as f:
        source_html = f.read()

    # ---- 1. Source-level Display definitions (top-level codes) ----------
    definitions = {}
    src_def_m = re.search(
        r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
        source_html, re.IGNORECASE)
    if src_def_m:
        src_def_url = html.unescape(src_def_m.group(1))
        try:
            print(f"  Fetching source-level definitions {src_def_url} ...")
            definitions.update(parse_statscan_definitions(fetch_html(src_def_url)))
        except Exception as e:
            print(f"  Warning: could not fetch source definitions: {e}", file=sys.stderr)

    # ---- 2. Find each top-level CPV link on the source page --------------
    # Links with CPV= parameter represent individual classification items
    seen_urls = set()
    cpv_urls = []
    for m in re.finditer(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;CPV=[^"\']+)["\']',
            source_html, re.IGNORECASE):
        url = html.unescape(m.group(1))
        if url not in seen_urls:
            seen_urls.add(url)
            cpv_urls.append(url)

    # ---- 2b. Collect unlinked (leaf) codes directly from source table ---
    # Rows whose Code <th> has no <a> link are flat leaf codes; their title
    # comes from the Category/Group column and descriptions come from the
    # source-level definitions dict (already populated in step 1).
    permissible_values = {}
    table_m = re.search(r'<table\b[^>]*>(.*?)</table>', source_html, re.IGNORECASE | re.DOTALL)
    if table_m:
        cat_td_index = 0  # index into the <td> cells of a data row (default: first)
        # Identify the Category/Group column from the header row
        header_m = (
            re.search(r'<thead\b[^>]*>(.*?)</thead>', table_m.group(1), re.IGNORECASE | re.DOTALL)
            or re.search(r'<tr\b[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        )
        if header_m:
            header_cells = re.findall(
                r'<t[hd]\b[^>]*>(.*?)</t[hd]>', header_m.group(1), re.IGNORECASE | re.DOTALL)
            for i, cell in enumerate(header_cells[1:], start=1):  # skip first (Code) column
                cell_text = html.unescape(strip_tags(cell)).strip().lower()
                if any(w in cell_text for w in ('category', 'group', 'class', 'name')):
                    cat_td_index = i - 1  # data rows: td index = header index minus the th cell
                    break
        data_rows = re.findall(r'<tr\b[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        for row_html in data_rows[1:]:  # skip header row
            th_m = re.search(r'<th\b[^>]*>(.*?)</th>', row_html, re.IGNORECASE | re.DOTALL)
            if not th_m:
                continue
            th_content = th_m.group(1)
            if re.search(r'<a\b', th_content, re.IGNORECASE):
                continue  # linked code — handled via CPV urls in step 3
            code = html.unescape(strip_tags(th_content)).strip()
            if not code:
                continue
            td_cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
            title = ""
            if td_cells:
                idx = cat_td_index if cat_td_index < len(td_cells) else 0
                title = html.unescape(strip_tags(td_cells[idx])).strip()
            entry = {"text": code}
            if title:
                entry["title"] = title
            permissible_values[code] = entry
            print(f"  Unlinked code: {code!r} title={title!r}")

    # ---- 3. For each CPV page: fetch structure + definitions -------------
    for cpv_url in cpv_urls:
        print(f"  Fetching CPV page {cpv_url} ...")
        try:
            cpv_html = fetch_html(cpv_url)
        except Exception as e:
            print(f"  Warning: could not fetch {cpv_url}: {e}", file=sys.stderr)
            continue

        # Display structure link  (Function=getVDStruct)
        struct_m = re.search(
            r'href=["\']([^"\']*Function=getVDStruct[^"\']*)["\']',
            cpv_html, re.IGNORECASE)
        if struct_m:
            struct_url = html.unescape(struct_m.group(1))
            try:
                print(f"    Fetching structure {struct_url} ...")
                struct_items = parse_statscan_structure(fetch_html(struct_url))
                # Build permissible_values from the ordered (code, name, indent) list
                processed = []  # [(code, indent)] for is_a lookup
                for code, name, indent in struct_items:
                    entry = {"text": code}
                    if name:
                        entry["title"] = name
                    # Find is_a: first preceding item at indent-1
                    if indent > 1:
                        for prev_code, prev_indent in reversed(processed):
                            if prev_indent == indent - 1:
                                entry["is_a"] = prev_code
                                break
                    processed.append((code, indent))
                    permissible_values[code] = entry
            except Exception as e:
                print(f"    Warning: structure fetch failed: {e}", file=sys.stderr)

        # Display definitions link (D=1 on the CPV page)
        def_m = re.search(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
            cpv_html, re.IGNORECASE)
        if def_m:
            def_url = html.unescape(def_m.group(1))
            try:
                print(f"    Fetching definitions {def_url} ...")
                definitions.update(parse_statscan_definitions(fetch_html(def_url)))
            except Exception as e:
                print(f"    Warning: definitions fetch failed: {e}", file=sys.stderr)

    # ---- 4. Merge definitions into permissible_values -------------------
    for code, entry in permissible_values.items():
        if code in definitions:
            entry["description"] = definitions[code]

    # ---- 5. Build French permissible_values from sources/{key}_fr.html --
    fr_permissible_values = {}
    fr_definitions = {}
    fr_html_path = f"sources/{key}_fr.html"

    if os.path.exists(fr_html_path):
        with open(fr_html_path) as f:
            fr_source_html = f.read()

        # French source-level definitions
        src_def_m = re.search(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
            fr_source_html, re.IGNORECASE)
        if src_def_m:
            fr_src_def_url = html.unescape(src_def_m.group(1))
            try:
                print(f"  Fetching French source definitions {fr_src_def_url} ...")
                fr_definitions.update(parse_statscan_definitions(fetch_html(fr_src_def_url)))
            except Exception as e:
                print(f"  Warning: could not fetch French source definitions: {e}", file=sys.stderr)

        # French unlinked codes from the French source table
        fr_table_m = re.search(r'<table\b[^>]*>(.*?)</table>', fr_source_html, re.IGNORECASE | re.DOTALL)
        if fr_table_m:
            cat_td_index = 0
            header_m = (
                re.search(r'<thead\b[^>]*>(.*?)</thead>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
                or re.search(r'<tr\b[^>]*>(.*?)</tr>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
            )
            if header_m:
                header_cells = re.findall(
                    r'<t[hd]\b[^>]*>(.*?)</t[hd]>', header_m.group(1), re.IGNORECASE | re.DOTALL)
                for i, cell in enumerate(header_cells[1:], start=1):
                    cell_text = html.unescape(strip_tags(cell)).strip().lower()
                    if any(w in cell_text for w in ('catégorie', 'category', 'groupe', 'group',
                                                     'classe', 'class', 'nom', 'name')):
                        cat_td_index = i - 1
                        break
            fr_data_rows = re.findall(
                r'<tr\b[^>]*>(.*?)</tr>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
            for row_html in fr_data_rows[1:]:
                th_m = re.search(r'<th\b[^>]*>(.*?)</th>', row_html, re.IGNORECASE | re.DOTALL)
                if not th_m or re.search(r'<a\b', th_m.group(1), re.IGNORECASE):
                    continue
                code = html.unescape(strip_tags(th_m.group(1))).strip()
                if not code:
                    continue
                td_cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
                fr_title = ""
                if td_cells:
                    idx = cat_td_index if cat_td_index < len(td_cells) else 0
                    fr_title = html.unescape(strip_tags(td_cells[idx])).strip()
                fr_entry = {"text": code}
                if fr_title:
                    fr_entry["title"] = fr_title
                fr_permissible_values[code] = fr_entry

        # French CPV pages — convert each English CPV URL to its French equivalent
        for cpv_url in cpv_urls:
            fr_cpv_url = statscan_fr_url(cpv_url)
            print(f"  Fetching French CPV page {fr_cpv_url} ...")
            try:
                fr_cpv_html = fetch_html(fr_cpv_url)
            except Exception as e:
                print(f"  Warning: could not fetch French CPV {fr_cpv_url}: {e}", file=sys.stderr)
                continue

            struct_m = re.search(
                r'href=["\']([^"\']*Function=getVDStruct[^"\']*)["\']',
                fr_cpv_html, re.IGNORECASE)
            if struct_m:
                fr_struct_url = html.unescape(struct_m.group(1))
                try:
                    print(f"    Fetching French structure {fr_struct_url} ...")
                    fr_struct_items = parse_statscan_structure(fetch_html(fr_struct_url))
                    for code, name, indent in fr_struct_items:
                        fr_entry = {"text": code}
                        if name:
                            fr_entry["title"] = name
                        fr_permissible_values[code] = fr_entry
                except Exception as e:
                    print(f"    Warning: French structure fetch failed: {e}", file=sys.stderr)

            def_m = re.search(
                r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
                fr_cpv_html, re.IGNORECASE)
            if def_m:
                fr_def_url = html.unescape(def_m.group(1))
                try:
                    print(f"    Fetching French definitions {fr_def_url} ...")
                    fr_definitions.update(parse_statscan_definitions(fetch_html(fr_def_url)))
                except Exception as e:
                    print(f"    Warning: French definitions fetch failed: {e}", file=sys.stderr)

        # Merge French definitions into fr_permissible_values
        for code, fr_entry in fr_permissible_values.items():
            if code in fr_definitions:
                fr_entry["description"] = fr_definitions[code]

    # ---- 6. Write YAML --------------------------------------------------
    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    schema = make_config_schema(
        id=source_url, name=key, title=source.get("title", ""),
        description=source.get("description", ""), version=source.get("version", ""),
        prefixes={"statscan": "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD="},
        enums={key: {
            "name":               key,
            "description":        source.get("description", ""),
            "permissible_values": permissible_values,
        }},
    )

    if fr_permissible_values:
        schema["extensions"] = {
            "locales": {
                "tag": "locales",
                "value": {
                    "fr": {
                        "id":          statscan_fr_url(source_url),
                        "name":        key,
                        "version":     source.get("version") or "",
                        "in_language": "fr",
                        "enums": {
                            key: {"permissible_values": fr_permissible_values},
                        },
                    }
                },
            }
        }

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path}"
          + (f" ({len(fr_permissible_values)} French translations)" if fr_permissible_values else ""))


def process_napcscanada_source(key, source, config_file=MENU_CONFIG):
    """Build a LinkML enum YAML from a NAPCSCanada CSV source.

    Reads sources/{key}.csv.  Each data row becomes one permissible_value entry
    keyed by the Code column.  Column names are matched case-insensitively and
    both English-only and bilingual (English + French) CSV formats are supported:

      Bilingual:  Level/Niveau, Hierarchical structure, Structure hiérarchique,
                  Code, Parent, Class title, Titres de classes,
                  Class definition, Définitions de la classe
      English:    Level, Code, Code title, Element Type Label English,
                  Element Description English

    Each permissible_value carries:
      text        — the Code value (identifier)
      title       — English title (Class title or Code title)
      description — English description (Class definition or Element Description English)
      is_a        — parent code from Parent column; if absent, inferred from Level order

    French translations (title / description) are written under a top-level
    ``extensions`` key with the structure::

        extensions:
          locales:
            tag: locales
            value:
              fr:
                id: <source_ontology url>
                name: <key>
                version: <version>
                in_language: fr
                enums:
                  <key>:
                    permissible_values:
                      <code>:
                        text: <code>
                        title: <french title>
                        description: <french description>
    """
    # Column name → internal field mapping (normalised to lowercase)
    COL_MAP = {
        'code': 'code',
        'level': 'level',
        'level/niveau': 'level',
        'parent': 'parent',
        # English title
        'class title': 'title_en',
        'code title': 'title_en',
        # English description
        'class definition': 'desc_en',
        'element description english': 'desc_en',
        # French title
        'titres de classes': 'title_fr',
        # French description
        'définitions de la classe': 'desc_fr',
    }

    csv_path = f"sources/{key}.csv"
    with open(csv_path, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print(f"  Warning: no data rows in {csv_path}", file=sys.stderr)
        return

    # Build a mapping from internal field name → actual CSV column name
    actual_cols = {}
    for col in rows[0].keys():
        norm = col.strip().lower()
        if norm in COL_MAP:
            actual_cols[COL_MAP[norm]] = col

    def get(row, field):
        col = actual_cols.get(field)
        return row[col].strip() if col and col in row else ""

    permissible_values_en = {}
    permissible_values_fr = {}

    # Stack for level-based is_a inference when no Parent column is present
    has_parent_col = 'parent' in actual_cols
    level_stack = []  # list of (code, level_int)

    for row in rows:
        code = get(row, 'code')
        if not code:
            continue

        title_en = get(row, 'title_en')
        desc_en  = get(row, 'desc_en')
        title_fr = get(row, 'title_fr')
        desc_fr  = get(row, 'desc_fr')

        # Determine is_a
        is_a = None
        if has_parent_col:
            parent = get(row, 'parent')
            if parent:
                is_a = parent
        else:
            level_str = get(row, 'level')
            try:
                level_int = int(level_str)
            except (ValueError, TypeError):
                level_int = 1
            # Pop stack until we find the immediate parent level
            while level_stack and level_stack[-1][1] >= level_int:
                level_stack.pop()
            if level_stack and level_stack[-1][1] == level_int - 1:
                is_a = level_stack[-1][0]
            level_stack.append((code, level_int))

        entry_en = {"text": code}
        if title_en:
            entry_en["title"] = title_en
        if desc_en:
            entry_en["description"] = desc_en
        if is_a:
            entry_en["is_a"] = is_a
        permissible_values_en[code] = entry_en

        if title_fr or desc_fr:
            entry_fr = {"text": code}
            if title_fr:
                entry_fr["title"] = title_fr
            if desc_fr:
                entry_fr["description"] = desc_fr
            permissible_values_fr[code] = entry_fr

    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    version    = source.get("version") or ""
    title      = source.get("title", "")
    prefixes   = dict(source.get("prefixes") or {"napcscanada": "napcscanada/"})

    schema = make_config_schema(id=source_url, name=key, title=title,
                               version=version, prefixes=prefixes,
                               enums={key: {"permissible_values": permissible_values_en}})

    if permissible_values_fr:
        schema["extensions"] = {
            "locales": {
                "tag": "locales",
                "value": {
                    "fr": {
                        "id":          source_url,
                        "name":        key,
                        "version":     version,
                        "in_language": "fr",
                        "enums": {
                            key: {"permissible_values": permissible_values_fr},
                        },
                    }
                },
            }
        }

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path} ({len(permissible_values_en)} codes"
          + (f", {len(permissible_values_fr)} with French translations" if permissible_values_fr else "")
          + ")")


def process_loinc_table_source(key, source, config_file=MENU_CONFIG):
    """Fetch each ValueSet JSON listed in a LOINC HTML table page and build a combined YAML.

    Reads sources/{key}.html, parses the Name column from the enum listing table,
    constructs a JSON URL for each row as {base_url}ValueSet-{Name}.json, fetches
    each JSON, converts concepts via collect_loinc_valueset_concepts, and writes
    the combined enum set to sources/{key}.yaml.

    The base URL is derived from the source_ontology value by stripping the last
    path segment (the HTML filename), preserving any version path such as /7.1.0/en/.
    """
    html_path = f"sources/{key}.html"
    yaml_path = f"sources/{key}.yaml"
    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    base_url = source_url.rsplit("/", 1)[0] + "/" if "/" in source_url else ""

    with open(html_path) as f:
        html_text = f.read()

    rows = parse_loinc_table_page(html_text, base_url=source_url)
    if not rows:
        print(f"  Warning: no rows found in LOINC table {html_path}", file=sys.stderr)
        return

    print(f"  Found {len(rows)} ValueSet(s) in {html_path}")

    prefixes = dict(source.get("prefixes") or {"LOINC": "https://loinc.org/"})

    schema = make_config_schema(
        id=source_url, name=key, title=source.get("title", ""),
        description=source.get("description", ""), version=source.get("version", ""),
        prefixes=prefixes, default_prefix=next(iter(prefixes), ""),
    )

    for row in rows:
        name = row.get("name", "")
        if not name:
            continue
        identity_url = row.get("identity_url", "")
        if not identity_url:
            print(f"  Warning: no Identity URL for '{name}' — skipping", file=sys.stderr)
            continue
        print(f"  Fetching {identity_url} ...")
        try:
            enum_html = fetch_html(identity_url)
        except Exception as e:
            print(f"  Warning: could not fetch {identity_url}: {e}", file=sys.stderr)
            continue

        parts = re.split(r"[\s\-_]+", name)
        enum_key = "LOINC" + (to_camel_case(name) if len(parts) > 1 else name)

        enum_description, permissible_values = parse_loinc_valueset_html_page(enum_html)

        enum_def = {
            "name": enum_key,
            "description": enum_description or row.get("description", ""),
        }
        if row.get("status"):
            enum_def["status"] = str(row["status"]).upper()
        if permissible_values:
            enum_def["permissible_values"] = permissible_values

        schema["enums"][enum_key] = enum_def
        print(f"    Added enum {enum_key} ({len(permissible_values)} values)")

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path}")

    update_source_config(key, {"prefixes": dict(schema["prefixes"])}, config_file)


def iri_to_curie(iri, prefixes):
    """Convert an IRI to a CURIE using the given prefixes dict.

    Tries the OBO convention first (http://purl.obolibrary.org/obo/PREFIX_ID →
    PREFIX:ID), then falls back to matching against each prefix URI.
    Returns the original IRI unchanged if no conversion is found.
    """
    obo_match = re.match(r"http://purl\.obolibrary\.org/obo/([A-Za-z]+)_(\w+)$", iri)
    if obo_match:
        return f"{obo_match.group(1)}:{obo_match.group(2)}"
    if prefixes:
        for prefix, uri in sorted(prefixes.items(), key=lambda x: len(x[1]), reverse=True):
            if uri and iri.startswith(uri):
                return f"{prefix}:{iri[len(uri):]}"
    return iri


def fetch_api_graph(ontology, term_id, apis=None):
    """Fetch a term's subclass graph from the appropriate API endpoint.

    Checks the ``apis`` dict (loaded from menu_config.yaml) for a service whose
    ``ontologies`` list contains *ontology*.  Falls back to OLS4 when no match is
    found.

    ontology: ontology prefix in CURIE notation (e.g. 'ENVO', 'MESH').
    term_id:  local part of the term identifier (e.g. '00000428').
    apis:     dict keyed by service name, each with 'uri', optional 'apikey', and
              'ontologies' list.  May be None or empty (OLS4 default used).

    Returns a normalised dict with 'nodes' (list of {iri, label}) and 'edges'
    (list of {source, target, label}) or None on error.
    """
    apis = apis or {}
    api_name = None
    api_conf = None
    for name, conf in apis.items():
        if ontology.upper() in [o.upper() for o in (conf.get("ontologies") or [])]:
            api_name = name
            api_conf = conf
            break

    if api_name == "bioportal":
        return _fetch_bioportal_graph(ontology, term_id, api_conf)
    else:
        return _fetch_ols4_graph(ontology, term_id, api_conf if api_name == "ols4" else None)


def _fetch_ols4_graph(ontology, term_id, api_conf=None):
    """Fetch the OLS4 /graph endpoint for a term.

    The OLS4 API requires the term IRI to be double-percent-encoded in the path.
    Returns the raw OLS4 JSON dict {nodes, edges} or None on error.
    """
    base_uri = ((api_conf or {}).get("uri") or "http://www.ebi.ac.uk/ols4/api").rstrip("/")
    inner_iri = f"http://purl.obolibrary.org/obo/{ontology}_{term_id}"
    single_encoded = urllib.parse.quote(inner_iri, safe="")
    double_encoded = single_encoded.replace("%", "%25")
    url = f"{base_uri}/ontologies/{ontology.lower()}/terms/{double_encoded}/graph"
    try:
        print(f"    Fetching OLS4 graph: {ontology}:{term_id} ...")
        with urllib.request.urlopen(url, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"    Warning: OLS4 fetch failed for {ontology}:{term_id}: {e}", file=sys.stderr)
        return None


def _fetch_bioportal_graph(ontology, term_id, api_conf):
    """Fetch a term's descendants from the BioPortal API and normalise to {nodes, edges}.

    Fetches the root class itself plus all descendants (handling pagination).
    Returns {nodes: [{iri, label, definition}], edges: [{source, target, label='subClassOf'}]}
    or None on error.  definition is the IAO:0000115 annotation (first string value).

    BioPortal docs: https://data.bioontology.org/documentation
    Endpoint: GET /ontologies/{ont}/classes/{encoded_iri}/descendants
    Auth:     apikey query parameter.
    """
    base_uri = ((api_conf or {}).get("uri") or "https://data.bioontology.org").rstrip("/")
    apikey   = (api_conf or {}).get("apikey") or ""
    inner_iri = f"http://purl.obolibrary.org/obo/{ontology}_{term_id}"
    encoded_iri = urllib.parse.quote(inner_iri, safe="")

    nodes = {}   # iri -> {iri, label, definition}
    edges = []   # [{source, target, label}]

    def _add_class(cls):
        iri = cls.get("@id") or ""
        if not iri:
            return
        raw_def = cls.get("definition") or ""
        definition = (raw_def[0] if isinstance(raw_def, list) else raw_def) or ""
        nodes[iri] = {"iri": iri, "label": cls.get("prefLabel") or "", "definition": definition}
        for parent in (cls.get("subClassOf") or []):
            parent_iri = parent if isinstance(parent, str) else parent.get("@id") or ""
            if parent_iri:
                edges.append({"source": iri, "target": parent_iri, "label": "subClassOf"})

    # Fetch the root class itself (so include_self logic in expand_reachable_from works)
    root_url = (f"{base_uri}/ontologies/{ontology}/classes/{encoded_iri}"
                f"?apikey={apikey}&include=prefLabel,subClassOf,definition")
    try:
        print(f"    Fetching BioPortal class: {ontology}:{term_id} ...")
        req = urllib.request.Request(root_url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as response:
            _add_class(json.loads(response.read().decode("utf-8")))
    except Exception as e:
        print(f"    Warning: BioPortal root fetch failed for {ontology}:{term_id}: {e}",
              file=sys.stderr)
        return None

    # Fetch all descendants (paginated)
    desc_url = (f"{base_uri}/ontologies/{ontology}/classes/{encoded_iri}/descendants"
                f"?apikey={apikey}&pagesize=5000&include=prefLabel,subClassOf,definition")
    page = 1
    while desc_url:
        print(f"    Fetching BioPortal descendants: {ontology}:{term_id} (page {page}) ...")
        try:
            req = urllib.request.Request(desc_url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
        except Exception as e:
            print(f"    Warning: BioPortal descendants fetch failed: {e}", file=sys.stderr)
            break
        for cls in (data.get("collection") or []):
            _add_class(cls)
        next_page = data.get("nextPage")
        if next_page and next_page != desc_url:
            sep = "&" if "?" in next_page else "?"
            desc_url = f"{next_page}{sep}apikey={apikey}" if "apikey" not in next_page else next_page
            page += 1
        else:
            desc_url = None

    if not nodes:
        return None
    return {"nodes": list(nodes.values()), "edges": edges}


def expand_reachable_from(yaml_path, enum_filter=None, apis=None):
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
            graph = fetch_api_graph(ontology, term_id, apis=apis)
            if not graph:
                continue

            # Determine which IRIs to skip for this source_node:
            # - the root node itself (unless include_self is true)
            # - any ancestor nodes, i.e. targets of (root -subClassOf-> target)
            inner_iri = f"http://purl.obolibrary.org/obo/{ontology}_{term_id}"
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
                    raw_def = node.get("definition") or ""
                    definition = (raw_def[0] if isinstance(raw_def, list) else raw_def) or ""
                    all_nodes[iri] = {
                        "label": node.get("label") or "",
                        "curie": iri_to_curie(iri, prefixes),
                        "definition": definition,
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
    parser.add_argument("-b", "--build", action="store_true", help="Build or update schema.yaml with default LinkML top-level structure")
    parser.add_argument("-f", "--fetch", nargs="*", metavar="SOURCE_KEY|all", help="Fetch sources. Use '-f all' to fetch every source in menu_config.yaml, or supply specific source keys. Without arguments, fetches only sources listed with -c.")
    parser.add_argument("-c", "--config", nargs="*", metavar="SOURCE_KEY", help="Update menu_config.yaml with prefix dicts from source files; omit keys to process all sources")
    parser.add_argument("-d", "--delete", nargs="+", metavar="SOURCE_KEY", help="Remove one or more source keys from menu_config.yaml")
    parser.add_argument("-l", "--lookup", nargs="*", metavar="SOURCE_KEY", help="Expand reachable_from.source_nodes enums via OLS4 API for YAML sources; omit keys to process all sources")
    parser.add_argument("-r", "--report", action="store_true", help="Generate enum report for all sources in menu_config.yaml")
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
    if args.build:
        build_schema()
    if args.lookup is not None:
        schema_file = "schema.yaml"
        if not os.path.exists(schema_file):
            print(f"schema.yaml not found — run -b first", file=sys.stderr)
        else:
            lookup_results = {}   # enum_key -> pv count

            # Load apis config once for all lookup calls
            with open(MENU_CONFIG, "r") as f:
                _lconfig = yaml.safe_load(f) or {}
            _apis = _lconfig.get("apis") or {}

            if not args.lookup:
                # -l with no args: expand every enum in schema.yaml that has reachable_from.source_nodes
                lookup_results.update(expand_reachable_from(schema_file, apis=_apis))
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
                        schema_file, enum_filter=enum_filter, apis=_apis))

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
    if not any([args.add, args.build, args.delete, args.fetch is not None, args.config is not None, args.report]):
        print("No action taken. Use -a to add sources, -b to build schema.yaml, -c to update menu_config.yaml, -d to delete sources, -f to fetch sources, or -r to report on all sources.")


if __name__ == "__main__":
    main()
