"""LinkML source helpers for menu_manager.py.

Provides YAML parsing, prefix management, and LinkML schema processing for
sources with content_type: LinkML (generic LinkML YAML files).

Public API used by menu_manager.py:
    apply_sorted_prefixes(key, new_prefixes, config_file, *, yaml_path, schema_data, source)
    process_linkml_source(key, source, config_file=None)
    match_linkml(url, tmp_path, config_file=None, process_fn=None)
"""

import os
import sys
import yaml
from source_utils import (
    MENU_CONFIG,
    IndentedDumper,
    sort_prefixes,
    make_source_entry,
    write_config,
    update_source_config,
    is_curie,
)


def apply_sorted_prefixes(key, new_prefixes, config_file, *,
                           yaml_path=None, schema_data=None, source=None):
    """Sort *new_prefixes* case-insensitively and persist them.

    Always updates the config entry for *key* via update_source_config.
    If *yaml_path* and *schema_data* are both given, rewrites the source
    YAML file when the prefix order has changed.
    If *source* is given, updates source["prefixes"] in-memory.

    Returns the sorted prefixes dict.
    """
    sorted_pfx = sort_prefixes(new_prefixes)
    if yaml_path is not None and schema_data is not None:
        existing = schema_data.get("prefixes") or {}
        # Compare as ordered lists of items — dict equality ignores insertion order
        if list(sorted_pfx.items()) != list(existing.items()):
            schema_data["prefixes"] = sorted_pfx
            with open(yaml_path, "w") as f:
                yaml.dump(schema_data, f, Dumper=IndentedDumper,
                          default_flow_style=False, sort_keys=False)
    update_source_config(key, {"prefixes": sorted_pfx}, config_file)
    if source is not None:
        source["prefixes"] = sorted_pfx
    return sorted_pfx


def process_linkml_source(key, source, config_file=MENU_CONFIG):
    """Update a LinkML YAML source file's prefix dict.

    Reads sources/{key}.yaml, collects only the prefixes actually referenced
    in permissible_value meanings (as CURIEs), merges with any prefixes
    declared in the config entry, and rewrites the file if the prefix set
    has changed.

    Silently skips sources whose file_format is not 'yaml'.
    """
    file_format = source.get("file_format", "yaml")
    if file_format != "yaml":
        print(f"Skipping {key}: processing not supported for file_format '{file_format}'")
        return

    source_path = f"sources/{key}.{file_format}"
    if not os.path.exists(source_path):
        print(f"Skipping {key}: {source_path} not found — run -f to fetch first",
              file=sys.stderr)
        return

    with open(source_path, "r") as f:
        source_data = yaml.safe_load(f)

    existing_pfx = source_data.get("prefixes") or {}

    # Collect only the prefixes actually referenced in permissible_value meanings
    meanings_pfx = {}
    for enum_def in (source_data.get("enums") or {}).values():
        for pv in ((enum_def or {}).get("permissible_values") or {}).values():
            meaning = (pv or {}).get("meaning", "")
            if is_curie(meaning):
                pfx = meaning.split(":")[0]
                if pfx in existing_pfx and pfx not in meanings_pfx:
                    meanings_pfx[pfx] = existing_pfx[pfx]

    config_additions = dict(source.get("prefixes") or {})
    merged           = sort_prefixes({**meanings_pfx, **config_additions})
    if list(merged.items()) != list(sort_prefixes(existing_pfx).items()):
        source_data["prefixes"] = merged
        with open(source_path, "w") as f:
            yaml.dump(source_data, f, Dumper=IndentedDumper,
                      default_flow_style=False, sort_keys=False)
    print(f"{key}: prefixes up to date ({len(merged)} entries)")


def match_linkml(url, tmp_path, config_file=MENU_CONFIG, process_fn=None):
    """Return True if *tmp_path* looks like a LinkML YAML file and was handled.

    Detection is by URL extension (.yaml or .yml).  When matched:
      - parses and validates the file as a LinkML schema (must be a dict with
        an 'enums' or 'id' key)
      - checks for key collision in config_file
      - renames tmp_path to sources/{key}.yaml
      - adds a source entry with content_type: LinkML
      - calls process_fn([key], config_file) if provided

    Returns False if the URL does not end in .yaml or .yml.
    Returns True (handled) for any other outcome, including skipped files.
    """
    _url_base = url.split("?")[0].rstrip("/").split("/")[-1]
    _ext = _url_base.rsplit(".", 1)[1].lower() if "." in _url_base else ""
    if _ext not in ("yaml", "yml"):
        return False

    try:
        with open(tmp_path) as f:
            schema_data = yaml.safe_load(f)
    except Exception as e:
        print(f"  Skipping {url}: failed to parse as YAML: {e}", file=sys.stderr)
        os.unlink(tmp_path)
        return True

    if not isinstance(schema_data, dict) or not (schema_data.get("enums") or schema_data.get("id")):
        print(f"  Skipping {url}: not a recognised LinkML schema", file=sys.stderr)
        os.unlink(tmp_path)
        return True

    key = schema_data.get("name") or _url_base.rsplit(".", 1)[0]

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        os.unlink(tmp_path)
        return True

    output_path = f"sources/{key}.yaml"
    os.rename(tmp_path, output_path)
    print(f"Saved to {output_path}")

    entry = make_source_entry(key, url, "LinkML", "yaml",
                              title=schema_data.get("title") or None,
                              version=schema_data.get("version") or None)
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    if process_fn is not None:
        process_fn([key], config_file)
    return True
