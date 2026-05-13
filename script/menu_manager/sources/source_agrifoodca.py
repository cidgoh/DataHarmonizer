"""AgriFoodCA picklist source helpers for menu_manager.py.

Provides CSV parsing and LinkML YAML generation for agricultural picklist files
from the AgriFoodData Canada repository at:
  https://github.com/agrifooddatacanada/picklists_for_schemas/tree/main/picklists

Each CSV file contains 4 metadata rows (column-header / general / en / fr),
followed by 5–6 blank rows, followed by a data header and data rows.

Public API used by menu_manager.py:
    process_agrifood_source(key, source, config_file=None, locales=None)
    match_agrifood_csv(url, tmp_path, config_file)
    match_agrifood_dir(url, config_file)
"""

import csv
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import yaml

from source_utils import (
    add_permissible_value,
    make_config_schema,
    _make_locale_extensions,
    IndentedDumper,
    make_source_entry,
    write_config,
    to_pascal_case_key,
    MENU_CONFIG,
)


# GitHub API endpoint for the picklists directory
_GITHUB_API_URL = (
    "https://api.github.com/repos/agrifooddatacanada/"
    "picklists_for_schemas/contents/picklists"
)
# Fallback base for raw file downloads when API doesn't provide download_url
_RAW_BASE = (
    "https://raw.githubusercontent.com/agrifooddatacanada/"
    "picklists_for_schemas/main/picklists/"
)


def _filename_to_key(filename):
    """Convert a CSV filename to an AgriFoodCA source key.

    Examples::

        'soil_drainage.csv'             -> 'AFCSoilDrainage'
        'canadian_provinces.csv'        -> 'AFCCanadianProvinces'
        'education_level_stats_can.csv' -> 'AFCEducationLevelStatsCan'
    """
    stem = re.sub(r'\.csv$', '', filename, flags=re.IGNORECASE).strip()
    return 'AFC' + to_pascal_case_key(stem)


def _is_agrifood_header(row):
    """Return True if *row* matches the AgriFoodCA metadata column-header format.

    The first row of a picklist CSV looks like:
        ,title,description,keywords,source
    (first cell empty; 'title' and 'description' appear in subsequent cells).
    """
    if not row or len(row) < 2:
        return False
    norm = [c.strip().lower() for c in row]
    return norm[0] == '' and 'title' in norm and 'description' in norm


def _map_columns(header_row):
    """Detect column roles from a data header row.

    Returns a dict with keys:
        key_col      — column whose values are used as permissible-value codes
        en_title_col — English label (first ``_en`` column, or the only ``_en`` column)
        en_desc_col  — English description (second ``_en`` column when two are present)
        fr_title_col — French label (first ``_fr`` column, or the only ``_fr`` column)
        fr_desc_col  — French description (second ``_fr`` column when two are present)

    Each value is the column-name string as it appears in the header row, or None.

    Key column: always the first non-empty column, regardless of its name.

    Non-key columns are matched by their ``_en`` / ``_fr`` suffix:
      - If one ``_en`` column → en_title_col (regardless of name)
      - If two ``_en`` columns → the one without 'desc' in the name is en_title_col,
        the one with 'desc' is en_desc_col
      - Same logic applies to ``_fr`` columns

    Supported CSV variants::

        {any},  description_en
        {any},  description_en,  description_fr
        {any},  label_en,        label_fr
        {any},  Class_en,        Description_en,  Class_fr,  Description_fr
        {any},  Code,  Province_en,  Province_fr
    """
    result = {
        'key_col':      None,
        'en_title_col': None,
        'en_desc_col':  None,
        'fr_title_col': None,
        'fr_desc_col':  None,
    }

    key_set = False
    en_cols = []   # list of (col_name, has_desc_in_name)
    fr_cols = []

    for col in header_row:
        col_s = col.strip()
        if not col_s:
            continue
        norm = col_s.lower()

        if not key_set:
            result['key_col'] = col_s
            key_set = True
            continue

        if norm.endswith('_en'):
            en_cols.append((col_s, 'desc' in norm))
        elif norm.endswith('_fr'):
            fr_cols.append((col_s, 'desc' in norm))

    # Single _en/_fr column → always title; two columns → desc-named → description
    if len(en_cols) == 1:
        result['en_title_col'] = en_cols[0][0]
    elif len(en_cols) >= 2:
        for col_s, has_desc in en_cols:
            if has_desc and result['en_desc_col'] is None:
                result['en_desc_col'] = col_s
            elif not has_desc and result['en_title_col'] is None:
                result['en_title_col'] = col_s

    if len(fr_cols) == 1:
        result['fr_title_col'] = fr_cols[0][0]
    elif len(fr_cols) >= 2:
        for col_s, has_desc in fr_cols:
            if has_desc and result['fr_desc_col'] is None:
                result['fr_desc_col'] = col_s
            elif not has_desc and result['fr_title_col'] is None:
                result['fr_title_col'] = col_s

    return result


def parse_agrifood_picklist(csv_text):
    """Parse an AgriFoodCA picklist CSV string and return metadata + permissible values.

    Returns a dict::

        {
            'source_doc':          str | None,   # URL from 'general' metadata row
            'title_en':            str,
            'description_en':      str | None,
            'title_fr':            str,
            'description_fr':      str | None,
            'permissible_values':  {code: pv_entry, ...},      # English
            'fr_permissible_values': {code: pv_entry, ...},    # French (may be {})
        }

    Returns None if the CSV does not match the AgriFoodCA format (first row must
    have an empty first cell, 'title', and 'description' as subsequent headers).

    CSV structure::

        Row 0:  ,title,description,keywords,source   (metadata column header)
        Row 1:  general,,,,{source_doc_url}           (general metadata row)
        Row 2:  en,{title_en},{desc_en},,              (English metadata)
        Row 3:  fr,{title_fr},{desc_fr},,              (French metadata)
        Rows 4+: blank (variable count — 5 or 6 rows)
        Then:   data column header row
        Then:   data rows
    """
    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)

    if len(rows) < 4:
        return None
    if not _is_agrifood_header(rows[0]):
        return None

    # Locate field indices in metadata column-header row
    meta_header = [c.strip().lower() for c in rows[0]]

    def meta_col(name):
        try:
            return meta_header.index(name)
        except ValueError:
            return None

    col_title  = meta_col('title')
    col_desc   = meta_col('description')
    col_source = meta_col('source')

    def meta_get(row, col):
        if col is None or col >= len(row):
            return ''
        return row[col].strip()

    general_row = rows[1] if len(rows) > 1 else []
    source_doc  = meta_get(general_row, col_source) or None

    en_row  = rows[2] if len(rows) > 2 else []
    title_en = meta_get(en_row, col_title)
    desc_en  = meta_get(en_row, col_desc) or None

    fr_row   = rows[3] if len(rows) > 3 else []
    title_fr = meta_get(fr_row, col_title)
    desc_fr  = meta_get(fr_row, col_desc) or None

    # Scan for the data header: first non-blank row after row 3
    data_header_idx = None
    for i in range(4, len(rows)):
        if any(c.strip() for c in rows[i]):
            data_header_idx = i
            break

    if data_header_idx is None:
        return {
            'source_doc': source_doc,
            'title_en': title_en, 'description_en': desc_en,
            'title_fr': title_fr, 'description_fr': desc_fr,
            'permissible_values': {}, 'fr_permissible_values': {},
        }

    col_map      = _map_columns(rows[data_header_idx])
    key_col      = col_map['key_col']
    en_title_col = col_map['en_title_col']
    en_desc_col  = col_map['en_desc_col']
    fr_title_col = col_map['fr_title_col']
    fr_desc_col  = col_map['fr_desc_col']

    if not key_col:
        return None  # no identifiable key column

    # Build column-name → index lookup from the data header row
    header_cols = [c.strip() for c in rows[data_header_idx]]
    col_idx = {c: i for i, c in enumerate(header_cols) if c}

    def get_col(row, col_name):
        if col_name is None:
            return ''
        idx = col_idx.get(col_name)
        if idx is None:
            return ''
        return row[idx].strip() if idx < len(row) else ''

    permissible_values_en = {}
    permissible_values_fr = {}

    for row in rows[data_header_idx + 1:]:
        if not any(c.strip() for c in row):
            continue  # skip trailing blank rows
        code = get_col(row, key_col)
        if not code:
            continue

        title_en_val = get_col(row, en_title_col) or None
        desc_en_val  = get_col(row, en_desc_col)  or None
        title_fr_val = get_col(row, fr_title_col) or None
        desc_fr_val  = get_col(row, fr_desc_col)  or None

        add_permissible_value(permissible_values_en, code,
                              title=title_en_val, description=desc_en_val)
        if title_fr_val or desc_fr_val:
            add_permissible_value(permissible_values_fr, code,
                                  title=title_fr_val, description=desc_fr_val)

    return {
        'source_doc':           source_doc,
        'title_en':             title_en,
        'description_en':       desc_en,
        'title_fr':             title_fr,
        'description_fr':       desc_fr,
        'permissible_values':   permissible_values_en,
        'fr_permissible_values': permissible_values_fr,
    }


def process_agrifood_source(key, source, config_file=None, locales=None):
    """Build a LinkML enum YAML from an AgriFoodCA CSV picklist source.

    Reads ``sources/{key}.csv``, parses the AgriFoodCA metadata header and data
    rows, and writes ``sources/{key}.yaml`` containing the English enum plus an
    optional French locale extension when French translations are present and
    ``fr`` appears in *locales*.

    French locale output structure::

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
                        title: <french label>
    """
    csv_path = f"sources/{key}.csv"
    try:
        with open(csv_path, newline='', encoding='utf-8-sig') as f:
            csv_text = f.read()
    except FileNotFoundError:
        print(f"Skipping {key}: {csv_path} not found — run -f to fetch first", file=sys.stderr)
        return

    parsed = parse_agrifood_picklist(csv_text)
    if parsed is None:
        print(f"  Warning: {csv_path} does not appear to be an AgriFoodCA picklist",
              file=sys.stderr)
        return

    source_url  = (source.get("reachable_from") or {}).get("source_ontology", "")
    version     = source.get("version") or ""
    title       = source.get("title") or parsed['title_en'] or key
    description = source.get("description") or parsed['description_en'] or ""

    permissible_values_en = parsed['permissible_values']
    permissible_values_fr = parsed['fr_permissible_values']

    schema = make_config_schema(
        id=source_url, name=key, title=title,
        description=description, version=version,
        enums={key: {"permissible_values": permissible_values_en}},
    )

    if permissible_values_fr and "fr" in (locales or ["en"]):
        schema["extensions"] = _make_locale_extensions(
            source_url, key, version, "fr",
            description=parsed['description_fr'],
            enums={key: {"permissible_values": permissible_values_fr}},
        )

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    fr_count = len(permissible_values_fr)
    print(f"Updated {yaml_path} ({len(permissible_values_en)} codes"
          + (f", {fr_count} with French translations" if fr_count else "")
          + ")")


def _add_agrifood_from_csv(url, filename, csv_text, config_file, locales=None):
    """Parse *csv_text*, save the CSV, add a config entry, and generate the YAML.

    Returns the source key string on success, or None when skipped (key already
    exists, file does not match AgriFoodCA format, or no key column found).
    """
    parsed = parse_agrifood_picklist(csv_text)
    if parsed is None:
        print(f"  Skipping {url}: does not match AgriFoodCA picklist format",
              file=sys.stderr)
        return None

    key = _filename_to_key(filename)

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}

    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        return None

    title       = parsed['title_en'] or key
    description = parsed['description_en'] or None
    source_doc  = parsed['source_doc']

    entry = make_source_entry(key, url, "AgriFoodCA", "csv",
                              title=title, description=description)
    if source_doc:
        entry["see_also"] = source_doc

    # Save the CSV to sources/
    output_path = f"sources/{key}.csv"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(csv_text)
    print(f"Saved to {output_path}")

    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    # Re-read written config to get the canonical source entry, then process
    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    process_agrifood_source(key, config["sources"][key], config_file, locales=locales)

    return key


def _build_combined_yaml(results, source_url, key, locales=None):
    """Build a combined LinkML schema dict from a list of parsed picklist results.

    results:    list of (enum_key, parsed_dict) pairs, one per CSV file.
    source_url: URL written to the schema ``id`` field.
    key:        schema ``name`` (also used as the locale extension name).
    locales:    list of BCP 47 locale codes; French extension written when 'fr' present.

    Each enum entry carries the picklist title and, when available, description.
    French translations are collected across all picklists and written as a single
    locale extension block.
    """
    all_enums_en = {}
    all_enums_fr = {}

    for enum_key, parsed in results:
        enum_entry = {"permissible_values": parsed['permissible_values']}
        if parsed['title_en']:
            enum_entry["title"] = parsed['title_en']
        if parsed['description_en']:
            enum_entry["description"] = parsed['description_en']
        all_enums_en[enum_key] = enum_entry

        if parsed['fr_permissible_values']:
            all_enums_fr[enum_key] = {"permissible_values": parsed['fr_permissible_values']}

    schema = make_config_schema(
        id=source_url,
        name=key,
        title="AgriFoodCA Picklists",
        description="Agricultural food data picklists from AgriFoodData Canada",
        enums=all_enums_en,
    )

    if all_enums_fr and "fr" in (locales or ["en"]):
        schema["extensions"] = _make_locale_extensions(
            source_url, key, "", "fr",
            enums=all_enums_fr,
        )

    return schema


def match_agrifood_csv(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *tmp_path* is an AgriFoodCA picklist CSV and was handled.

    Detection is content-based: checks that the first CSV row has an empty first
    cell and contains 'title' and 'description' as subsequent header values —
    the AgriFoodCA metadata column-header pattern.

    Returns False without consuming the file if the pattern is not matched,
    allowing other matchers to attempt detection.
    """
    try:
        with open(tmp_path, encoding='utf-8-sig') as f:
            csv_text = f.read()
    except Exception:
        return False

    first_line = csv_text.split('\n', 1)[0]
    first_row  = next(csv.reader([first_line]), None)
    if not _is_agrifood_header(first_row):
        return False

    # Extract filename from the URL for key generation
    url_stem = url.rstrip('/').split('/')[-1]
    filename = url_stem if url_stem.lower().endswith('.csv') else url_stem + '.csv'

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    locales = config.get("locales") or ["en"]

    _add_agrifood_from_csv(url, filename, csv_text, config_file, locales=locales)
    os.unlink(tmp_path)
    return True


def match_agrifood_dir(url, config_file=MENU_CONFIG):
    """Return True if *url* is an AgriFoodCA GitHub picklists URL and was handled.

    Accepted URL patterns (case-insensitive):

    Single file (blob URL)::

        https://github.com/agrifooddatacanada/picklists_for_schemas/blob/{branch}/picklists/{file}.csv

    Directory (all files)::

        https://github.com/agrifooddatacanada/picklists_for_schemas
        https://github.com/agrifooddatacanada/picklists_for_schemas/tree/{branch}/picklists

    A ``/blob/`` URL downloads and processes only the single named CSV file.
    A directory URL uses the GitHub API to enumerate and process all CSV files.

    Any other URL path under the repo (issues, pulls, commits, etc.) returns False.
    """
    _REPO = r'https?://github\.com/agrifooddatacanada/picklists_for_schemas'

    # Single-file blob URL: .../blob/{branch}/picklists/{filename}.csv
    blob_m = re.match(
        _REPO + r'/blob/[^/]+/picklists/([^/?#]+\.csv)\s*$',
        url, re.IGNORECASE
    )
    if blob_m:
        filename = blob_m.group(1)
        raw_url  = _RAW_BASE + urllib.parse.quote(filename)
        print(f"Fetching AgriFoodCA picklist: {filename} ...")
        try:
            req = urllib.request.Request(
                raw_url,
                headers={"User-Agent": "menu_manager/1.0"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                charset  = resp.headers.get_content_charset() or "utf-8"
                csv_text = resp.read().decode(charset, errors="replace")
            if csv_text.startswith('\ufeff'):
                csv_text = csv_text[1:]
        except Exception as e:
            print(f"  Error fetching {filename}: {e}", file=sys.stderr)
            return True
        with open(config_file) as f:
            config = yaml.safe_load(f) or {}
        locales = config.get("locales") or ["en"]
        _add_agrifood_from_csv(raw_url, filename, csv_text, config_file, locales=locales)
        return True

    # Directory URL: repo root or /tree/{branch}[/picklists]
    if not re.match(
        _REPO + r'(?:/tree/[^/]+(?:/picklists/?)?)?/?$',
        url, re.IGNORECASE
    ):
        return False  # unrecognised path (issues, pulls, etc.) — don't consume

    # Derive the combined source key from the directory name in the URL.
    # /tree/{branch}/{dir} → AFC + PascalCase(dir); repo root → AFCPicklists.
    dir_m = re.search(r'/tree/[^/]+/([^/?#]+)', url, re.IGNORECASE)
    dir_name    = dir_m.group(1) if dir_m else 'picklists'
    combined_key = 'AFC' + to_pascal_case_key(dir_name)

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}

    if combined_key in config.get("sources", {}):
        print(f"  Skipping: source key '{combined_key}' already exists in {config_file}",
              file=sys.stderr)
        return True

    locales = config.get("locales") or ["en"]

    print("Fetching AgriFoodCA picklist directory via GitHub API ...")
    try:
        req = urllib.request.Request(
            _GITHUB_API_URL,
            headers={
                "Accept":     "application/vnd.github+json",
                "User-Agent": "menu_manager/1.0",
            }
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            listing = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  Error fetching GitHub API listing: {e}", file=sys.stderr)
        return True  # URL consumed; nothing more to do

    csv_files = [
        item for item in listing
        if isinstance(item, dict) and item.get("name", "").lower().endswith(".csv")
    ]
    if not csv_files:
        print("  No CSV files found in the picklists directory.", file=sys.stderr)
        return True

    print(f"  Found {len(csv_files)} CSV file(s); downloading ...")

    results = []   # list of (enum_key, parsed_dict)
    skipped = 0
    for item in csv_files:
        filename = item["name"]
        raw_url  = (item.get("download_url")
                    or _RAW_BASE + urllib.parse.quote(filename))

        print(f"  Downloading {filename} ...")
        try:
            req = urllib.request.Request(
                raw_url,
                headers={"User-Agent": "menu_manager/1.0"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                charset  = resp.headers.get_content_charset() or "utf-8"
                csv_text = resp.read().decode(charset, errors="replace")
            if csv_text.startswith('\ufeff'):
                csv_text = csv_text[1:]
        except Exception as e:
            print(f"    Warning: failed to download {filename}: {e}", file=sys.stderr)
            skipped += 1
            continue

        parsed = parse_agrifood_picklist(csv_text)
        if parsed is None:
            print(f"    Warning: {filename} does not match AgriFoodCA format — skipped",
                  file=sys.stderr)
            skipped += 1
            continue

        results.append((_filename_to_key(filename), parsed))

    if not results:
        print("  No valid picklists found.", file=sys.stderr)
        return True

    # Build a single combined YAML with one enum per picklist
    schema = _build_combined_yaml(results, url, combined_key, locales=locales)
    yaml_path = f"sources/{combined_key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Saved {len(results)} enums to {yaml_path}")

    entry = make_source_entry(combined_key, url, "AgriFoodCA", "yaml",
                              title="AgriFoodCA Picklists",
                              description="Agricultural food data picklists from AgriFoodData Canada")
    config.setdefault("sources", {})[combined_key] = entry
    write_config(config, config_file)
    print(f"Added source '{combined_key}' to {config_file}"
          + (f" ({skipped} file(s) skipped)" if skipped else ""))
    return True
