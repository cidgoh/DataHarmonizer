"""NAPCSCanada source helpers for menu_manager.py.

Provides CSV parsing and LinkML YAML generation for the North American
Product Classification System (NAPCS) Canada sources.

Public API used by menu_manager.py:
    process_napcscanada_source(key, source, config_file=None, locales=None)
    match_napcs_csv(url, tmp_path, config_file, downloaded_filename)
"""

import csv
import os
import re
import sys
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


def process_napcscanada_source(key, source, config_file=None, locales=None):
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

        add_permissible_value(permissible_values_en, code,
                              title=title_en, description=desc_en, is_a=is_a)
        if "fr" in (locales or ["en"]) and (title_fr or desc_fr):
            add_permissible_value(permissible_values_fr, code,
                                  title=title_fr, description=desc_fr)

    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    version    = source.get("version") or ""
    title      = source.get("title", "")
    prefixes   = dict(source.get("prefixes") or {})

    schema = make_config_schema(id=source_url, name=key, title=title,
                               version=version, prefixes=prefixes,
                               enums={key: {"permissible_values": permissible_values_en}})

    if permissible_values_fr:
        schema["extensions"] = _make_locale_extensions(
            source_url, key, version, "fr",
            enums={key: {"permissible_values": permissible_values_fr}},
        )

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path} ({len(permissible_values_en)} codes"
          + (f", {len(permissible_values_fr)} with French translations" if permissible_values_fr else "")
          + ")")


def match_napcs_csv(url, tmp_path, config_file=MENU_CONFIG, downloaded_filename=""):
    """Return True if *tmp_path* looks like a NAPCS Canada CSV file and was handled.

    Detection is content-based: checks for NAPCS-specific column headers in the
    first row of the CSV.  Both bilingual and English-only NAPCS CSV exports from
    Statistics Canada are recognised.
    """
    try:
        with open(tmp_path, newline='', encoding='utf-8-sig') as f:
            headers = next(csv.reader(f), None)
    except Exception:
        return False

    if headers is None:
        return False

    norm_headers = {c.strip().lower() for c in headers}
    napcs_signals = {
        'class title', 'code title', 'class definition',
        'element description english', 'titres de classes',
        'définitions de la classe', 'hierarchical structure',
        'structure hiérarchique',
    }
    if not ('code' in norm_headers and bool(napcs_signals & norm_headers)):
        return False

    # Extract year from downloaded filename first, then fall back to URL
    name_for_year = downloaded_filename or url
    year_m = re.search(r'\b(20\d{2})\b', name_for_year)
    year = year_m.group(1) if year_m else ""

    variant_m = re.search(
        r'\bVariant of NAPCS Canada[^-]*-\s*(.+?)\s*\([^)]+\)',
        downloaded_filename, re.IGNORECASE)
    if variant_m:
        variant_name = variant_m.group(1).strip()
        key = f"NAPCSCanada{to_pascal_case_key(variant_name)}{year}"
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
        return True

    output_path = f"sources/{key}.csv"
    os.rename(tmp_path, output_path)
    print(f"Saved to {output_path}")

    version = year if year else None
    entry = make_source_entry(key, url, "NAPCSCanada", "csv", title=title, version=version)
    entry["see_also"] = ["https://www.statcan.gc.ca/en/subjects/standard/napcs/2022/index"]
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")
    return True
