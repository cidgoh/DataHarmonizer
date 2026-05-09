#!/usr/bin/env python3
"""
Compare two schema YAML files for content differences, ignoring key/list ordering.

Changes are classified as:
  SUBSTANTIVE  — value changed, key added/removed, or type changed
  ENRICHMENT   — title field added to a permissible_value entry
  COSMETIC     — redundant name fields or str→single-item-list wrapping

Usage:
    python3 script/compare_schemas.py <file_a> <file_b> [options]

Arguments:
    file_a    Path to the baseline schema YAML (the "old" version)
    file_b    Path to the schema YAML to compare against (the "new" version)

Options:
    -f, --full      Show full field values without truncation (default: 120 chars)
    -e, --enrichment  Show enrichment changes (permissible_value title additions)
    -c, --cosmetic  Show cosmetic changes (suppressed by default)
    -h, --help      Show this help message and exit

Examples:
    python3 script/compare_schemas.py web/templates/grdi_1m/schema.yaml ~/Downloads/schema.yaml
    python3 script/compare_schemas.py old/schema.yaml new/schema.yaml --full
"""

import argparse
import re
import sys
import yaml
from deepdiff import DeepDiff


# ── classification helpers (mirrors diff_schemas.py) ─────────────────────────

def is_title_in_permissible_value(path: str) -> bool:
    return "permissible_values" in path and path.endswith("['title']")


def is_redundant_name_field(path: str, val) -> bool:
    if not ("slot_usage" in path and path.endswith("['name']") and isinstance(val, str)):
        return False
    match = re.search(r"\['([^']+)'\]\['name'\]$", path)
    return bool(match and match.group(1) == val)


def is_str_to_single_list(old, new) -> bool:
    return (
        isinstance(old, str)
        and isinstance(new, list)
        and len(new) == 1
        and old.strip() == new[0].strip()
    )


def classify(path: str, old, new) -> str:
    if new != "[ADDED]" and is_title_in_permissible_value(path):
        return "ENRICHMENT"
    if new != "[REMOVED]" and is_redundant_name_field(path, new):
        return "COSMETIC"
    return "SUBSTANTIVE"


def parent_and_key(path: str):
    m = re.match(r"(.*)\['([^']+)'\]$", path)
    if m:
        return m.group(1), m.group(2)
    return None, None


# ── core comparison ───────────────────────────────────────────────────────────

def analyze(old_yaml: dict, new_yaml: dict):
    diff = DeepDiff(old_yaml, new_yaml, ignore_order=True, verbose_level=2)

    substantive, enrichment, cosmetic = [], [], []

    def record(path, old, new):
        kind = classify(path, old, new)
        cap = (
            isinstance(old, str) and isinstance(new, str)
            and old != new and old.lower() == new.lower()
        )
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
        ov, nv = change["old_value"], change["new_value"]
        if is_str_to_single_list(ov, nv):
            cosmetic.append((path, ov, nv, False))
        else:
            record(path, f"{type(ov).__name__}:{ov!r}", f"{type(nv).__name__}:{nv!r}")

    added   = dict(diff.get("dictionary_item_added",   {}))
    removed = dict(diff.get("dictionary_item_removed", {}))

    matched_added   = set()
    matched_removed = set()

    # Detect key case-change pairs (removed + added at same parent, same value, different case)
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
                substantive.append((
                    r_parent,
                    f"[KEY CASE CHANGE] '{r_key}': {r_val!r}",
                    f"[KEY CASE CHANGE] '{a_key}': {a_val!r}",
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


# ── output ────────────────────────────────────────────────────────────────────

def fmt(val, maxlen=None):
    s = repr(val)
    if maxlen and len(s) > maxlen:
        return s[:maxlen] + "..."
    return s


def print_entries(entries, label, maxlen=None):
    if not entries:
        return
    print(f"\n{label} ({len(entries)}):")
    for path, old, new, cap in entries:
        tag = "  [CASE CHANGE]" if cap else ""
        print(f"  {path}{tag}")
        if old != "[ADDED]":
            print(f"    OLD: {fmt(old, maxlen)}")
        if new != "[REMOVED]":
            print(f"    NEW: {fmt(new, maxlen)}")


# ── entry point ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("file_a", help="Baseline schema YAML (old)")
    parser.add_argument("file_b", help="Schema YAML to compare against (new)")
    parser.add_argument("--full", "-f", action="store_true",
                        help="Show full values without truncation")
    parser.add_argument("--enrichment", "-e", action="store_true",
                        help="Show enrichment changes (permissible_value title additions)")
    parser.add_argument("--cosmetic", "-c", action="store_true",
                        help="Show cosmetic changes (suppressed by default)")
    args = parser.parse_args()

    maxlen = None if args.full else 120

    try:
        with open(args.file_a) as f:
            old_yaml = yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        sys.exit(f"Error reading {args.file_a}: {e}")

    try:
        with open(args.file_b) as f:
            new_yaml = yaml.safe_load(f)
    except (OSError, yaml.YAMLError) as e:
        sys.exit(f"Error reading {args.file_b}: {e}")

    substantive, enrichment, cosmetic = analyze(old_yaml, new_yaml)

    print(f"\nComparing:")
    print(f"  A (old): {args.file_a}")
    print(f"  B (new): {args.file_b}")

    if not substantive and not enrichment and not cosmetic:
        print("\nNo differences found.")
        return

    print_entries(substantive, "SUBSTANTIVE CHANGES", maxlen)

    if args.enrichment:
        print_entries(enrichment, "ENRICHMENT (permissible_value title additions)", maxlen)
    elif enrichment:
        print(f"\nENRICHMENT (permissible_value title additions): {len(enrichment)}  (use -e to show)")

    if args.cosmetic:
        print_entries(cosmetic, "COSMETIC CHANGES", maxlen)
    elif cosmetic:
        print(f"\nCOSMETIC (suppressed): {len(cosmetic)}  (use -c to show)")

    print(f"\nSummary: {len(substantive)} substantive, {len(enrichment)} enrichment, {len(cosmetic)} cosmetic")


if __name__ == "__main__":
    main()
