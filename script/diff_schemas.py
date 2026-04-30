#!/usr/bin/env python3
"""
Compare schema.yaml files between two git commits, classifying changes as:
  - SUBSTANTIVE:    value changed (including case-only changes), key added/removed, type changed
  - ENRICHMENT:     title field added to a permissible_value (bulk metadata pass)
  - COSMETIC:       reordering, redundant name fields, whitespace-only wrapping

Usage:
    python3 script/diff_schemas.py [old_ref [new_ref]] [options]

Arguments:
    old_ref     Git ref for the older version (default: HEAD~1)
    new_ref     Git ref for the newer version (default: working tree)

Options:
    -f, --full  Show full field values without truncation (default: truncate at 120 chars)
    -h, --help  Show this help message and exit

Examples:
    # Compare last commit against working tree:
    python3 script/diff_schemas.py

    # Compare five commits ago against working tree:
    python3 script/diff_schemas.py HEAD~5

    # Compare two specific commits:
    python3 script/diff_schemas.py HEAD~3 HEAD~1

    # Show full values without truncation:
    python3 script/diff_schemas.py HEAD~1 --full

Authored by Damion Dooley and Claude
"""

import argparse
import re
import subprocess
import sys
import yaml
from deepdiff import DeepDiff


TEMPLATE_DIR = "web/templates"
SCHEMA_FILES = [
    f"{TEMPLATE_DIR}/{t}/schema.yaml"
    for t in [
        "ambr", "b2b2b", "canada_covid19", "grdi", "hpai",
        "influenza", "mpox", "pha4ge", "wastewater",
    ]
]


def load_git(ref: str, path: str) -> dict:
    text = subprocess.check_output(["git", "show", f"{ref}:{path}"], text=True)
    return yaml.safe_load(text)


def load_file(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def is_title_in_permissible_value(path: str) -> bool:
    """True when the change is inside enums.<X>.permissible_values.<Y>.title."""
    return "permissible_values" in path and path.endswith("['title']")


def is_redundant_name_field(path: str, val) -> bool:
    """True for slot_usage[key]['name'] == key (added by serialiser, carries no info)."""
    if not ("slot_usage" in path and path.endswith("['name']") and isinstance(val, str)):
        return False
    # Path: root[...]['slot_usage']['slot_name']['name'] — val should equal 'slot_name'
    match = re.search(r"\['([^']+)'\]\['name'\]$", path)
    return bool(match and match.group(1) == val)


def is_cap_only(old, new) -> bool:
    return (
        isinstance(old, str)
        and isinstance(new, str)
        and old != new
        and old.lower() == new.lower()
    )


def classify(path: str, old, new) -> str:
    """Return one of: ENRICHMENT, COSMETIC, SUBSTANTIVE (cap-only changes are SUBSTANTIVE)."""
    if new != "[ADDED]" and is_title_in_permissible_value(path):
        return "ENRICHMENT"
    if new != "[REMOVED]" and is_redundant_name_field(path, new):
        return "COSMETIC"
    return "SUBSTANTIVE"


def parent_and_key(path: str):
    """Split a deepdiff path into (parent_path, key). Returns (None, None) if not parseable."""
    m = re.match(r"(.*)\['([^']+)'\]$", path)
    if m:
        return m.group(1), m.group(2)
    return None, None


def analyze(old_yaml: dict, new_yaml: dict):
    diff = DeepDiff(old_yaml, new_yaml, ignore_order=True, verbose_level=2)

    substantive, enrichment, cosmetic = [], [], []

    def record(path, old, new):
        kind = classify(path, old, new)
        cap = is_cap_only(old, new)
        entry = (path, old, new, cap)
        if kind == "ENRICHMENT":
            enrichment.append(entry)
        elif kind == "COSMETIC":
            cosmetic.append(entry)
        else:
            substantive.append(entry)

    for path, change in diff.get("values_changed", {}).items():
        record(path, change["old_value"], change["new_value"])

    for path, change in diff.get("type_changes", {}).items():
        ov = change["old_value"]
        nv = change["new_value"]
        # str -> list wrapping with identical content is cosmetic
        if (
            isinstance(ov, str)
            and isinstance(nv, list)
            and len(nv) == 1
            and ov.strip() == nv[0].strip()
        ):
            cosmetic.append((path, ov, nv, False))
        else:
            record(path, f"{type(ov).__name__}:{ov!r}", f"{type(nv).__name__}:{nv!r}")

    # Collect added and removed dict items separately before recording, so we can
    # detect key-name case changes (key removed + case-variant key added, same value).
    added = dict(diff.get("dictionary_item_added", {}))
    removed = dict(diff.get("dictionary_item_removed", {}))

    matched_added = set()
    matched_removed = set()

    for r_path, r_val in removed.items():
        r_parent, r_key = parent_and_key(r_path)
        if r_parent is None:
            continue
        for a_path, a_val in added.items():
            if a_path in matched_added:
                continue
            a_parent, a_key = parent_and_key(a_path)
            if (
                a_parent == r_parent
                and a_key != r_key
                and a_key.lower() == r_key.lower()
                and a_val == r_val
            ):
                # Key renamed with case change only — single entry tagged KEY CASE CHANGE
                kind = classify(r_path, r_val, a_val)
                entry = (r_path, r_key, a_key, True)  # reuse cap flag for display
                # Use a custom entry format: store as (path, old_key→old_val, new_key→new_val, cap)
                substantive.append((
                    r_parent,
                    f"[KEY] '{r_key}': {r_val!r}",
                    f"[KEY] '{a_key}': {a_val!r}",
                    True,
                ))
                matched_added.add(a_path)
                matched_removed.add(r_path)
                break

    for path, val in added.items():
        if path not in matched_added:
            record(path, "[ADDED]", val)

    for path, val in removed.items():
        if path not in matched_removed:
            record(path, val, "[REMOVED]")

    for path, val in diff.get("iterable_item_added", {}).items():
        record(path, "[ADDED]", val)

    for path, val in diff.get("iterable_item_removed", {}).items():
        record(path, val, "[REMOVED]")

    return substantive, enrichment, cosmetic


def fmt(val, maxlen=None):
    s = repr(val)
    if maxlen and len(s) > maxlen:
        return s[:maxlen] + "..."
    return s


def print_entries(entries, label, maxlen=None):
    if not entries:
        return
    print(f"\n  {label} ({len(entries)}):")
    for path, old, new, cap in entries:
        tag = "  [CASE CHANGE]" if cap else ""
        print(f"    {path}{tag}")
        if old != "[ADDED]":
            print(f"      OLD: {fmt(old, maxlen)}")
        if new != "[REMOVED]":
            print(f"      NEW: {fmt(new, maxlen)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("old_ref", nargs="?", default="HEAD~1")
    parser.add_argument("new_ref", nargs="?", default=None,
                        help="Omit to compare against working tree")
    parser.add_argument("--full", "-f", action="store_true",
                        help="Show full values without truncation")
    args = parser.parse_args()
    maxlen = None if args.full else 120

    totals = dict(substantive=0, cap=0, enrichment=0, cosmetic=0)

    for path in SCHEMA_FILES:
        try:
            old_yaml = load_git(args.old_ref, path)
        except subprocess.CalledProcessError:
            print(f"\n{'='*70}\nFILE: {path}\n  [not present in {args.old_ref}]")
            continue

        try:
            if args.new_ref:
                new_yaml = load_git(args.new_ref, path)
            else:
                new_yaml = load_file(path)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"\n{'='*70}\nFILE: {path}\n  [not present in new ref]")
            continue

        substantive, enrichment, cosmetic = analyze(old_yaml, new_yaml)
        n_cap = sum(1 for _, _, _, cap in substantive if cap)

        totals["substantive"] += len(substantive)
        totals["cap"] += n_cap
        totals["enrichment"] += len(enrichment)
        totals["cosmetic"] += len(cosmetic)

        print(f"\n{'='*70}")
        print(f"FILE: {path}")

        if not substantive and not enrichment:
            print("  No substantive changes (cosmetic/ordering only)")
            continue

        print_entries(substantive, "SUBSTANTIVE CHANGES", maxlen)
        if enrichment:
            print(f"\n  ENRICHMENT (title additions to permissible_values): {len(enrichment)}")
        if cosmetic:
            print(f"  COSMETIC (suppressed): {len(cosmetic)}")

    print(f"\n{'='*70}")
    print("TOTALS:")
    print(f"  Substantive changes    : {totals['substantive']} (of which case-only: {totals['cap']})")
    print(f"  Enrichment (titles)    : {totals['enrichment']}")
    print(f"  Cosmetic (suppressed)  : {totals['cosmetic']}")


if __name__ == "__main__":
    main()
