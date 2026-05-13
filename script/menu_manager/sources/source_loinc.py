"""LOINC source helpers for menu_manager.py.

Provides HTML parsing, JSON conversion, concept-flattening utilities,
and source metadata management for LOINC CodeSystem and ValueSet sources.

Public API used by menu_manager.py:
    to_camel_case(s)
    collect_loinc_concepts(concepts, permissible_values, parent_code=None)
    convert_loinc_codesystem_to_linkml(key, source)
    collect_loinc_valueset_concepts(record, permissible_values)
    convert_loinc_valueset_to_linkml(key, source)
    parse_loinc_table_page(html_text, base_url="")
    parse_loinc_valueset_html_page(html_text)
    fill_loinc_source_metadata(output_path, key, config_file=None)
    process_loinc_table_source(key, source, config_file=None)
    match_loinc_table(url, tmp_path, config_file)
"""

import json
import os
import re
import sys
import urllib.parse
import yaml
from source_utils import (
    strip_tags,
    fetch_html,
    add_permissible_value,
    find_labeled_field,
    find_description_before_table,
    make_config_schema,
    IndentedDumper,
    MENU_CONFIG,
    make_source_entry,
    write_config,
    update_source_config,
    rename_source_key,
)


def to_camel_case(s):
    """Convert a string to CamelCase by splitting on whitespace, dashes, and underscores."""
    return "".join(word.capitalize() for word in re.split(r"[\s\-_]+", s) if word)


def collect_loinc_concepts(concepts, permissible_values, parent_code=None):
    """Recursively flatten a LOINC concept tree into a permissible_values dict.

    Child concepts gain an is_a attribute pointing to their parent concept's code.
    """
    COMMENTS_URL = "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments"
    for concept in concepts or []:
        code        = concept.get("code", "")
        title       = concept.get("display") or None
        description = concept.get("definition") or None
        comments    = next((e["valueString"] for e in concept.get("extension") or []
                            if e.get("url") == COMMENTS_URL and e.get("valueString")), None)
        add_permissible_value(permissible_values, code,
                              title=title, description=description,
                              is_a=parent_code, comments=comments)
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
            code  = concept.get("code", "")
            title = concept.get("display") or None
            add_permissible_value(permissible_values, code, title=title)


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
            name_cell = cells[name_col]
            link_m = re.search(r'<a[^>]*>(.*?)</a>', name_cell, re.IGNORECASE | re.DOTALL)
            name = strip_tags(link_m.group(1) if link_m else name_cell).strip()
            if not name:
                continue
            row = {"name": name}
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
    the paragraph preceding the table (via find_labeled_field) and
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

            title = ""
            if display_col is not None and len(cells) > display_col:
                title = strip_tags(cells[display_col]).strip()

            cell_description = ""
            if def_col is not None and len(cells) > def_col:
                def_cell = cells[def_col]
                p_m = re.search(r'<p[^>]*>(.*?)</p>', def_cell, re.IGNORECASE | re.DOTALL)
                cell_description = strip_tags(p_m.group(1) if p_m else def_cell).strip()

            status = ""
            if status_col is not None and len(cells) > status_col:
                status_raw = strip_tags(cells[status_col]).strip()
                if status_raw:
                    status = status_raw.upper()

            level = None
            if level_col is not None and len(cells) > level_col:
                try:
                    level = int(strip_tags(cells[level_col]).strip())
                except (ValueError, TypeError):
                    pass

            is_a = None
            if level is not None and level > 1:
                for prev_code, prev_level in reversed(processed):
                    if prev_level == level - 1:
                        is_a = prev_code
                        break

            processed.append((code, level if level is not None else 1))
            add_permissible_value(permissible_values, code,
                                  title=title, description=cell_description, status=status, is_a=is_a)

        if permissible_values:
            break

    return description, permissible_values


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


def match_loinc_table(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is a HL7 LOINC terminology table listing page and was handled.

    Matches pages like valuesets.html / valuesets-fhir.html but not individual
    detail pages such as ValueSet-pronouns.html or CodeSystem-*.html.
    """
    url_stem = url.split("?")[0].rstrip("/").split("/")[-1]
    if not ("terminology.hl7.org" in url and url_stem.endswith(".html")
            and not url_stem.startswith("ValueSet-")
            and not url_stem.startswith("CodeSystem-")):
        return False

    url_stem_noext = url_stem.rsplit(".", 1)[0]
    key = "LOINC" + to_camel_case(url_stem_noext)

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        os.unlink(tmp_path)
        return True

    output_path = f"sources/{key}.html"
    os.rename(tmp_path, output_path)
    print(f"Saved to {output_path}")

    with open(output_path) as f:
        html_text = f.read()
    description = find_description_before_table(html_text)

    entry = make_source_entry(key, url, "LOINC", "html",
                              title=f"LOINC {to_camel_case(url_stem_noext)} Value Sets",
                              description=description or None)
    entry["prefixes"] = {"LOINC": "https://loinc.org/"}
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")
    print(f"Run '-c {key}' to fetch all ValueSet enums from the listing page.")
    return True
