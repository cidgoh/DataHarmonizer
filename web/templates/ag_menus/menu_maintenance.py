#!/usr/bin/env python3
# Authors: Damion Dooley and Claude (Anthropic claude-sonnet-4-6)
#
# Usage examples:
#   Build or update schema.yaml with default LinkML top-level structure:
#     python menu_maintenance.py -b
#
#   Fetch (download) all sources in menu_config.yaml and generate enum report:
#     python menu_maintenance.py -f
#
#   Generate enum report for all sources in menu_config.yaml:
#     python menu_maintenance.py -r
#
#   Either of the above with tab-felimited output:
#     python menu_maintenance.py -f -t
#     python menu_maintenance.py -r -t
#
#   Build schema and fetch sources in one command:
#     python menu_maintenance.py -b -f
#
#   Add a new source from a URL (auto-detects type, adds to menu_config.yaml, and processes it):
#     python menu_maintenance.py -a https://example.org/some-valueset.json
#
#   Update menu_config.yaml with prefix dicts from all sources:
#     python menu_maintenance.py -c
#
#   Update menu_config.yaml for only the linkml_valuesets source:
#     python menu_maintenance.py -c linkml_valuesets
#
#   Build schema.yaml (sync enums and prefixes from all sources):
#     python menu_maintenance.py -b
#
#   Note: when -b detects that an enum present in schema.yaml is no longer
#   in its source file, it reports the enum key rather than deleting it.
#   This gives the menu manager the opportunity to manually review whether
#   the menu item should be removed from their system or retained.

import argparse
import datetime
import json
import os
import re
import sys
import tempfile
import urllib.request
from collections import defaultdict
import yaml

MENU_CONFIG = "menu_config.yaml"


class IndentedDumper(yaml.Dumper):
    """YAML dumper that indents list items one level under their parent key."""
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow=flow, indentless=False)


def to_camel_case(s):
    """Convert a string to CamelCase by splitting on whitespace, dashes, and underscores."""
    return "".join(word.capitalize() for word in re.split(r"[\s\-_]+", s) if word)


def rename_source_key(old_key, new_key, config_file=MENU_CONFIG):
    """Rename a source key in menu_config.yaml, preserving entry order."""
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    config["sources"] = {
        (new_key if k == old_key else k): v
        for k, v in config["sources"].items()
    }
    with open(config_file, "w") as f:
        yaml.dump(config, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)


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


def update_source_config(source_key, fields, config_file=MENU_CONFIG):
    """Update one or more fields on a source entry in menu_config.yaml."""
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
    config["sources"][source_key].update(fields)
    with open(config_file, "w") as f:
        yaml.dump(config, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)


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
        "license": "CC0",
        "prefixes": {},
        "default_prefix": "menu",
        "imports": ["linkml:types"],
        "enums": {},
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

    schema.setdefault("prefixes", {})
    schema.setdefault("enums", {})

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

            source_enums = source_data.get("enums") or {}
            enum_added = enum_updated = enum_reported = 0

            existing_from_source = {
                k for k, v in schema["enums"].items()
                if isinstance(v, dict)
                and isinstance(v.get("annotations"), dict)
                and v["annotations"].get("imported_from") == key
            }

            for enum_key, enum_def in source_enums.items():
                enum_def = dict(enum_def) if enum_def else {}
                annotations = dict(enum_def.get("annotations") or {})
                annotations["imported_from"] = key
                enum_def["annotations"] = annotations

                if enum_key not in schema["enums"]:
                    schema["enums"][enum_key] = enum_def
                    enum_added += 1
                elif schema["enums"][enum_key] != enum_def:
                    schema["enums"][enum_key] = enum_def
                    enum_updated += 1

            for enum_key in sorted(existing_from_source - set(source_enums.keys())):
                print(f"  Review: '{enum_key}' is no longer in {key} source — remove manually if no longer needed")
                enum_reported += 1

            print(f"{key}: enums {enum_added} added, {enum_updated} updated, {enum_reported} flagged for review")

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

            prefix_added = prefix_updated = prefix_deleted = 0
            for prefix, uri in protected.items():
                if prefix not in schema["prefixes"]:
                    schema["prefixes"][prefix] = uri
                    prefix_added += 1
                elif schema["prefixes"][prefix] != uri:
                    schema["prefixes"][prefix] = uri
                    prefix_updated += 1

            for prefix in list(schema["prefixes"].keys()):
                if prefix not in protected:
                    del schema["prefixes"][prefix]
                    prefix_deleted += 1

            schema["prefixes"] = dict(sorted(schema["prefixes"].items(), key=lambda x: x[0].lower()))

            print(
                f"Prefixes: {prefix_added} added, {prefix_updated} updated, {prefix_deleted} removed"
            )

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

    schema = {
        "id": record.get("valueSet", ""),
        "name": source_name,
        "title": source.get("title", ""),
        "version": source.get("version", ""),
        "prefixes": prefixes,
        "default_prefix": default_prefix,
        "enums": {
            source_name: {
                "name": source_name,
                "description": record.get("description", ""),
                "permissible_values": permissible_values,
            }
        },
    }

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

    schema = {
        "id": record.get("url", ""),
        "name": source_name,
        "title": source.get("title", ""),
        "version": source.get("version", ""),
        "prefixes": prefixes,
        "default_prefix": default_prefix,
        "enums": {
            source_name: {
                "name": source_name,
                "description": record.get("description", ""),
                "permissible_values": permissible_values,
            }
        },
    }

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"Converted {json_path} -> {yaml_path}")
    return yaml_path


def add_source(urls, config_file=MENU_CONFIG):
    """Add sources from URLs to menu_config.yaml and process them.

    For each URL, downloads the file and detects its type:
    - JSON with resourceType CodeSystem  -> content_type: LOINCCodeSystem
    - JSON with resourceType ValueSet    -> content_type: LOINCValueSet
    - YAML with LinkML schema structure  -> content_type: LinkML

    Creates a menu_config.yaml entry, saves the file to sources/, fills in
    metadata, and runs process_sources for the new key.
    """
    os.makedirs("sources", exist_ok=True)

    for url in urls:
        print(f"Fetching {url} ...")
        tmp_fd, tmp_path = tempfile.mkstemp()
        os.close(tmp_fd)
        try:
            urllib.request.urlretrieve(url, tmp_path)
        except Exception as e:
            print(f"  Error fetching {url}: {e}", file=sys.stderr)
            os.unlink(tmp_path)
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
            "menu_uri": url,
            "download_date": datetime.date.today().isoformat(),
        }
        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            entry["see_also"] = url + ".html"
        config.setdefault("sources", {})[key] = entry
        with open(config_file, "w") as f:
            yaml.dump(config, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
        print(f"Added source '{key}' to {config_file}")

        # Fill LOINC metadata (may rename key and file)
        if content_type in ("LOINCCodeSystem", "LOINCValueSet"):
            key, output_path = fill_loinc_source_metadata(output_path, key, config_file)

        # Process the source to generate LinkML YAML and update prefix dict in config
        process_sources([key], config_file)


def process_sources(source_keys=None, config_file=MENU_CONFIG):
    """Store per-source prefix dicts into menu_config.yaml from fetched source files.

    For LOINCCodeSystem sources: converts the fetched JSON to a LinkML YAML file and
    stores the resulting prefix dict in menu_config.yaml.
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


def generate_enum_report(yaml_file, tsv=False, output=sys.stdout, header=None):
    """Generate a report of enum keys, titles, source_domain, and source_schema.

    Works on any LinkML schema YAML file that contains an 'enums' section with
    annotations including source_domain and source_schema.

    Output is space-padded columns by default, or tab-felimited if tsv=True.
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
    parser.add_argument("-f", "--fetch", action="store_true", help="Fetch all sources in menu_config.yaml and generate enum report")
    parser.add_argument("-c", "--config", nargs="*", metavar="SOURCE_KEY", help="Update menu_config.yaml with prefix dicts from source files; omit keys to process all sources")
    parser.add_argument("-d", "--delete", nargs="+", metavar="SOURCE_KEY", help="Remove one or more source keys from menu_config.yaml")
    parser.add_argument("-r", "--report", action="store_true", help="Generate enum report for all sources in menu_config.yaml")
    parser.add_argument("-t", "--tabformat", action="store_true", help="Output report as tab-felimited TSV (default is space-padded columns)")
    args = parser.parse_args()

    if args.add:
        add_source(args.add)
    if args.delete:
        with open(MENU_CONFIG, "r") as f:
            config = yaml.safe_load(f)
        all_sources = config.get("sources", {})
        invalid = [k for k in args.delete if k not in all_sources]
        if invalid:
            print(f"Unknown source key(s): {', '.join(invalid)}", file=sys.stderr)
            sys.exit(1)
        for key in args.delete:
            del config["sources"][key]
            print(f"Deleted source '{key}' from {MENU_CONFIG}")
        with open(MENU_CONFIG, "w") as f:
            yaml.dump(config, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    if args.fetch:
        with open(MENU_CONFIG, "r") as f:
            config = yaml.safe_load(f)
        all_sources = config.get("sources", {})
        keys_to_download = args.config if args.config else list(all_sources.keys())
        invalid = [k for k in keys_to_download if k not in all_sources]
        if invalid:
            print(f"Unknown source key(s): {', '.join(invalid)}", file=sys.stderr)
            sys.exit(1)
        os.makedirs("sources", exist_ok=True)
        for key in keys_to_download:
            source = all_sources[key]
            uri = source.get("menu_uri")
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
    if not any([args.add, args.build, args.delete, args.fetch, args.config is not None, args.report]):
        print("No action taken. Use -a to add sources, -b to build schema.yaml, -c to update menu_config.yaml, -d to delete sources, -f to fetch sources, or -r to report on all sources.")


if __name__ == "__main__":
    main()
