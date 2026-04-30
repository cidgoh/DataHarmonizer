#!/usr/bin/env python3
"""
Compare schema.yaml files between two git commits, classifying changes as:
  - SUBSTANTIVE:    value changed (including case-only changes), key added/removed, type changed
  - ENRICHMENT:     title field added to a permissible_value (bulk metadata pass)
  - COSMETIC:       reordering, redundant name fields, whitespace-only wrapping

Usage:
    python3 script/diff_schemas.py [old_ref [new_ref]] [options]

Arguments:
    old_ref     Git ref (e.g. HEAD~5) or start date (yyyy-mm-dd) for the older version (default: HEAD~1)
    new_ref     Git ref or end date (yyyy-mm-dd) for the newer version (default: working tree / today)

Options:
    -f, --full    Show full field values without truncation (default: truncate at 120 chars)
    -d, --detail         Schema-grouped detail report: accumulates all changes across
                         HEAD~N → … → HEAD and prints them organised by schema file,
                         then by section: schema attributes / classes (with subsections
                         for class attrs, slot-list membership, slot usage, and inline
                         slot attribute defs) / schema-level slots / enums.
                         Each table row shows: REF, DATE, AUTHOR, CHG, and the value
                         (long text trimmed to the changed region with "..." context).
    -s STR, --schema STR Limit report to schemas whose path contains STR
                         (case-insensitive; e.g. 'canada_covid19', 'wastewater').
                         Applies to both the summary and detail (-d) reports.
    -c, --concise        In each table, suppress VERSION/DATE/AUTHOR/CHG columns
                         when they are identical to the previous row.
                         First row of every table always shows all values.
    -h, --help           Show this help message and exit

Examples:
    # Compare last commit against working tree:
    python3 script/diff_schemas.py

    # Compare five commits ago against working tree:
    python3 script/diff_schemas.py HEAD~5

    # Compare two specific commits:
    python3 script/diff_schemas.py HEAD~3 HEAD~1

    # Show full values without truncation:
    python3 script/diff_schemas.py HEAD~1 --full

    # Schema-grouped detail report for last 3 commits, all schemas:
    python3 script/diff_schemas.py HEAD~3 --detail

    # Detail report scoped to CanCOGeN only:
    python3 script/diff_schemas.py HEAD~5 --detail --schema canada_covid19

    # Detail report for a range ending before HEAD:
    python3 script/diff_schemas.py HEAD~5 HEAD~2 --detail

    # Detail report for all commits since a date:
    python3 script/diff_schemas.py 2024-11-01 --detail --schema wastewater

    # Detail report for commits within a date range:
    python3 script/diff_schemas.py 2024-11-01 2025-03-31 --detail

Authored by Damion Dooley and Claude
"""

import argparse
import difflib
import os
import re
import subprocess
import sys
import yaml
from deepdiff import DeepDiff


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.dirname(SCRIPT_DIR)
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
    with open(os.path.join(REPO_ROOT, path)) as f:
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


# ── shared helpers ────────────────────────────────────────────────────────────

def parse_head_n(ref):
    """Return N for HEAD~N, 0 for HEAD, None for any other ref format."""
    if ref is None:
        return 0
    m = re.match(r'^HEAD~(\d+)$', ref.strip(), re.IGNORECASE)
    if m:
        return int(m.group(1))
    if re.match(r'^HEAD$', ref.strip(), re.IGNORECASE):
        return 0
    return None


def build_commit_sequence(old_ref, new_ref):
    """Return list of (from_ref, to_ref) pairs walking old_ref → new_ref one commit at a time."""
    n = parse_head_n(old_ref)
    if n is None or n == 0:
        return [(old_ref, new_ref or "HEAD")]
    end_n = parse_head_n(new_ref) if new_ref else 0
    if end_n is None:
        end_n = 0
    pairs = []
    for i in range(n, end_n, -1):
        to_n = i - 1
        to_ref = f"HEAD~{to_n}" if to_n > 0 else "HEAD"
        pairs.append((f"HEAD~{i}", to_ref))
    return pairs


def is_date_ref(ref):
    """Return True if ref looks like a yyyy-mm-dd date string."""
    return bool(ref and re.match(r'^\d{4}-\d{2}-\d{2}$', str(ref).strip()))


def build_date_range_pairs(since, until=None):
    """
    Return list of (from_ref, to_ref) full-hash pairs for all commits whose
    author date falls in [since, until] (both yyyy-mm-dd), oldest first.
    The parent of the first in-range commit is prepended so that changes
    introduced by that commit are captured.  If until is None all commits
    up to HEAD are included.
    """
    cmd = ["git", "log", "--format=%H", f"--since={since}"]
    if until:
        cmd.append(f"--until={until} 23:59:59")
    cmd.append("--reverse")
    try:
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return []
    hashes = [h.strip() for h in out.strip().splitlines() if h.strip()]
    if not hashes:
        return []
    try:
        parent = subprocess.check_output(
            ["git", "rev-parse", f"{hashes[0]}^"],
            text=True, stderr=subprocess.DEVNULL,
        ).strip()
        refs = [parent] + hashes
    except subprocess.CalledProcessError:
        refs = hashes   # initial commit has no parent
    return [(refs[i], refs[i + 1]) for i in range(len(refs) - 1)]


def get_commit_info(ref):
    """Return (short_hash, iso_date, author) for a git ref."""
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%h|%ai|%an", ref],
            text=True, stderr=subprocess.DEVNULL,
        )
        parts = out.strip().split("|", 2)
        return tuple(parts) if len(parts) == 3 else (ref[:8], "unknown", "unknown")
    except subprocess.CalledProcessError:
        return (ref[:8], "unknown", "unknown")


def highlight_diff(old_val, new_val, context=40):
    """
    Return (old_excerpt, new_excerpt) trimmed to the changed region.
    Short values are returned in full; long values are trimmed with '...' context.
    """
    old_s = old_val if isinstance(old_val, str) else repr(old_val)
    new_s = new_val if isinstance(new_val, str) else repr(new_val)

    if len(old_s) <= context * 2 and len(new_s) <= context * 2:
        return old_s, new_s

    matcher = difflib.SequenceMatcher(None, old_s, new_s, autojunk=False)
    changes = [op for op in matcher.get_opcodes() if op[0] != "equal"]
    if not changes:
        return old_s[:context * 2] + "...", new_s[:context * 2] + "..."

    o0 = max(0, changes[0][1] - context)
    o1 = min(len(old_s), changes[-1][2] + context)
    n0 = max(0, changes[0][3] - context)
    n1 = min(len(new_s), changes[-1][4] + context)

    old_exc = ("..." if o0 > 0 else "") + old_s[o0:o1] + ("..." if o1 < len(old_s) else "")
    new_exc = ("..." if n0 > 0 else "") + new_s[n0:n1] + ("..." if n1 < len(new_s) else "")
    return old_exc, new_exc


# ── schema-grouped detail report ──────────────────────────────────────────────

def _new_class_data():
    return {
        'class_attrs': [],   # title, description, annotations, etc.
        'slots_list':  [],   # entries in classes.Cls.slots (list membership)
        'slot_usage':  [],   # classes.Cls.slot_usage.Slot.field overrides
        'attributes':  [],   # classes.Cls.attributes.Slot.field inline defs
    }


# Attributes to suppress from the detail report.
# Keys use the pattern  <section>.<subsection>.<field>  matching the cat/field
# values produced by _categorize().  Set value to True to ignore.
#
#   schema.<field>              – root-level schema attribute
#   class.<field>               – class-level attribute
#   class.slots.<slot>          – slot list membership entry
#   class.slot_usage.<field>    – slot_usage attribute override
#   class.attributes.<field>    – inline slot attribute definition
#   slot.<field>                – schema-level slot attribute
#   enum.<field>                – field inside an enum
#
IGNORED_ATTRIBUTES = {
    "class.slot_usage.rank": True,   # ordering metadata, not a semantic change
}

# Maps _categorize() cat values to their ignore-key prefix
_CAT_PREFIX = {
    "schema_attr":   "schema",
    "class_attr":    "class",
    "class_slots":   "class.slots",
    "slot_usage":    "class.slot_usage",
    "cls_attribute": "class.attributes",
    "schema_slot":   "slot",
    "enum_whole":    "enum",
    "enum_field":    "enum",
}


def _ignore_key(cat, field):
    """Build the IGNORED_ATTRIBUTES lookup key for a categorised change."""
    prefix = _CAT_PREFIX.get(cat, cat)
    return f"{prefix}.{field}" if field else prefix


def _new_schema_data():
    return {
        'schema_attrs': [],   # root-level fields (version, name, id, …)
        'classes':      {},   # class_name → _new_class_data()
        'slots':        [],   # root['slots'].Slot.field
        'enum_summary': [],   # whole-enum add / delete
        'enums':        {},   # enum_name → [field-level change entries]
        '_latest_yaml': None, # most recent yaml seen (for class version header)
    }


def _categorize(diff_path, old_val, new_val):
    """
    Classify a deepdiff path into a schema section.

    Returns a dict: cat, class_name, slot_name, enum_name, field
      cat values: schema_attr | class_attr | class_slots | slot_usage |
                  cls_attribute | schema_slot | enum_whole | enum_field
    """
    # deepdiff uses single-quoted brackets ['key'] normally, double-quoted ["key"]
    # when the key contains a single quote, and single-quoted with \' escapes when
    # the key contains both quote types.  Handle all three forms and unescape.
    _raw = re.findall(
        r"\['((?:[^'\\]|\\.)*)'\]|\[\"((?:[^\"\\]|\\.)*)\"\]",
        diff_path)
    keys = [re.sub(r"\\(.)", r"\1", a if a else b) for a, b in _raw]
    r = dict(cat='schema_attr', class_name=None, slot_name=None, enum_name=None, field='')

    if not keys:
        r['field'] = diff_path
        return r

    top = keys[0]

    if top == 'classes':
        if len(keys) < 2:
            r['cat'] = 'class_attr'; r['field'] = 'classes'; return r
        r['class_name'] = keys[1]
        if len(keys) == 2:
            r['cat'] = 'class_attr'; return r        # whole class add/delete
        sub = keys[2]
        if sub == 'slot_usage':
            r['cat'] = 'slot_usage'
            if len(keys) >= 4:
                r['slot_name'] = keys[3]
                r['field'] = '.'.join(keys[4:])
            else:
                r['field'] = 'slot_usage'
        elif sub == 'attributes':
            r['cat'] = 'cls_attribute'
            if len(keys) >= 4:
                r['slot_name'] = keys[3]
                r['field'] = '.'.join(keys[4:])
            else:
                r['field'] = 'attributes'
        elif sub == 'slots':
            r['cat'] = 'class_slots'
            r['field'] = 'slots'
            # Value IS the slot name for list add/remove items
            if old_val == '[ADDED]':
                r['slot_name'] = str(new_val)
            elif new_val == '[REMOVED]':
                r['slot_name'] = str(old_val)
            else:
                # Key case-change: slot name is in the [KEY] 'name': ... string
                m = re.match(r"\[KEY\] '([^']+)'", str(old_val))
                r['slot_name'] = m.group(1) if m else ('.'.join(keys[3:]) if len(keys) > 3 else '')
        else:
            r['cat'] = 'class_attr'
            r['field'] = '.'.join(keys[2:])
        return r

    elif top == 'slots':
        r['cat'] = 'schema_slot'
        if len(keys) >= 2:
            r['slot_name'] = keys[1]
            r['field'] = '.'.join(keys[2:])
        else:
            r['field'] = 'slots'
        return r

    elif top == 'enums':
        if len(keys) < 2:
            r['cat'] = 'enum_whole'; r['field'] = 'enums'; return r
        r['enum_name'] = keys[1]
        if len(keys) == 2:
            r['cat'] = 'enum_whole'          # whole enum add/delete
        elif len(keys) == 3 and keys[2] == 'permissible_values':
            r['cat'] = 'enum_whole'          # permissible_values collection changed
            r['field'] = 'permissible_values'
        else:
            r['cat'] = 'enum_field'
            r['field'] = '.'.join(keys[2:])
        return r

    else:
        r['field'] = '.'.join(keys)          # root-level schema attribute
        return r


_VAL_CAP = 50   # max characters per individual value in the VALUE column

def _clip(s):
    s = str(s)
    return s[:_VAL_CAP] + "..." if len(s) > _VAL_CAP else s

def _fmt_val(info, maxlen=None, cap=True):
    """Format the value cell for a detail-report row.

    cap=True (default) clips values to _VAL_CAP chars; cap=False disables clipping.
    """
    change, old_val, new_val = info['change'], info['old_val'], info['new_val']

    def _maybe_clip(s):
        s = str(s)
        return (s[:_VAL_CAP] + "..." if len(s) > _VAL_CAP else s) if cap else s

    def _brief(v):
        if isinstance(v, dict):
            pv = v.get('permissible_values', {})
            return f"{{enum, {len(pv)} permissible values}}" if pv else f"{{dict, {len(v)} keys}}"
        if isinstance(v, list):
            return f"[list, {len(v)} items]"
        return _maybe_clip(v)

    if change == 'ADD':    return _brief(new_val)
    if change == 'DELETE': return _brief(old_val)
    # UPDATE
    if isinstance(old_val, str) and old_val.startswith('[KEY]'):
        return _maybe_clip(old_val) + " → " + _maybe_clip(new_val)
    # Guard: if either value is a dict/list, avoid producing a huge repr string
    if isinstance(old_val, (dict, list)) or isinstance(new_val, (dict, list)):
        return f"{_brief(old_val)} → {_brief(new_val)}"
    old_exc, new_exc = highlight_diff(old_val, new_val, context=25)
    return f"'{_maybe_clip(old_exc)}' → '{_maybe_clip(new_exc)}'"


def _col_w(rows, idx, header=""):
    """Return column width equal to the widest value (or header) in that column."""
    return max(len(header), max((len(str(r[idx])) for r in rows), default=0))


def _semver_key(v):
    """Convert a version string like '1.4.2' to a tuple of ints for sorting.
    Non-numeric components are treated as 0 so malformed versions sort stably."""
    return tuple(int(x) if x.isdigit() else 0 for x in str(v).split('.'))


def _print_table(title, rows, col_defs, indent="  ", concise=False):
    """
    Print a labelled, aligned text table.
    col_defs: list of (header, width).  Last column is never width-capped.
    rows:     list of lists of cell values (auto-stringified).
    concise:  if True, blank the first 4 prefix columns (VERSION/DATE/AUTHOR/CHG)
              when they are identical to the previous row (first row always shown).
    """
    if not rows:
        return
    n = len(rows)
    noun = "change" if n == 1 else "changes"
    if title:
        print(f"\n{indent}{title}  ({n} {noun})")
    pad = indent + "  "
    headers, seps = [], []
    for i, (h, w) in enumerate(col_defs):
        last = (i == len(col_defs) - 1)
        if last:
            actual_w = max(w, len(h), max((len(str(r[i])) for r in rows), default=0))
            headers.append(h)
            seps.append("─" * actual_w)
        else:
            headers.append(f"{h:<{w}}")
            seps.append("─" * w)
    print(pad + "  ".join(headers))
    print(pad + "  ".join(seps))
    prefix_cols = min(4, len(col_defs) - 1)  # never blank the last (value) column
    for row_idx, row in enumerate(rows):
        # Concise: blank all prefix columns only when every one matches the previous row.
        # If any prefix value differs, show all prefix values.
        hide_prefix = (
            concise
            and row_idx > 0
            and all(str(row[i]) == str(rows[row_idx - 1][i]) for i in range(prefix_cols))
        )
        cells = []
        for i, (v, (h, w)) in enumerate(zip(row, col_defs)):
            s = "" if (hide_prefix and i < prefix_cols) else (str(v) if v is not None else "")
            if i < len(col_defs) - 1:
                cells.append((s[:w-3] + "..." if len(s) > w else s).ljust(w))
            else:
                cells.append(s)
        print(pad + "  ".join(cells))


def _collect(accumulator, spath, from_ref, to_ref, commit_info,
             substantive, enrichment, new_yaml, cosmetic=None):
    """Accumulate changes from one commit step into accumulator[spath].
    cosmetic: list of cosmetic change tuples to include, or None to omit them.
    """
    h, date_full, author = commit_info
    date = date_full[:10]

    if spath not in accumulator:
        accumulator[spath] = _new_schema_data()
    data = accumulator[spath]
    data['_latest_yaml'] = new_yaml

    all_entries = (
        [(e, 'S') for e in substantive] +
        [(e, 'E') for e in enrichment] +
        ([(e, 'C') for e in cosmetic] if cosmetic else [])
    )
    for (diff_path, old_val, new_val, cap), kind in all_entries:
        if   old_val == '[ADDED]':   chg = 'ADD'
        elif new_val == '[REMOVED]': chg = 'DELETE'
        else:                        chg = 'UPDATE'
        if kind == 'C':
            chg = 'C-' + chg[:3]   # C-ADD, C-DEL, C-UPD

        c = _categorize(diff_path, old_val, new_val)
        cat        = c['cat']
        class_name = c['class_name']
        enum_name  = c['enum_name']

        class_version = ''
        if cat in ('class_attr', 'class_slots', 'slot_usage', 'cls_attribute'):
            class_version = str(
                new_yaml.get('classes', {})
                        .get(class_name, {})
                        .get('annotations', {})
                        .get('version', '') or ''
            )

        entry = {
            'schema_version': str(new_yaml.get('version', '') or ''),
            'class_version': class_version,
            'hash':     h,
            'date':      date,     'author':   author,
            'change':    chg,      'field':    c['field'],
            'slot_name': c['slot_name'],
            'enum_name': c['enum_name'],
            'old_val':   old_val,  'new_val':  new_val,
        }

        if IGNORED_ATTRIBUTES.get(_ignore_key(cat, c['field'])):
            continue

        if cat == 'schema_attr':
            data['schema_attrs'].append(entry)

        elif cat in ('class_attr', 'class_slots', 'slot_usage', 'cls_attribute'):
            if class_name not in data['classes']:
                data['classes'][class_name] = _new_class_data()
            cls = data['classes'][class_name]
            if   cat == 'class_attr':    cls['class_attrs'].append(entry)
            elif cat == 'class_slots':   cls['slots_list'].append(entry)
            elif cat == 'slot_usage':    cls['slot_usage'].append(entry)
            elif cat == 'cls_attribute': cls['attributes'].append(entry)

        elif cat == 'schema_slot':
            data['slots'].append(entry)

        elif cat == 'enum_whole':
            data['enum_summary'].append(entry)

        elif cat == 'enum_field':
            if enum_name not in data['enums']:
                data['enums'][enum_name] = []
            data['enums'][enum_name].append(entry)


def _print_schema_report(spath, data, maxlen=None, concise=False):
    """Print the full grouped detail report for one schema file."""
    ml = maxlen or 70
    T = "    "   # universal table indent — all tables start at the same left margin

    # Compute PFX column widths from actual data so every table aligns identically.
    all_entries = (
        data['schema_attrs'] + data['slots'] + data['enum_summary'] +
        [e for cls in data['classes'].values() for lst in cls.values()
           if isinstance(lst, list) for e in lst] +
        [e for lst in data['enums'].values() for e in lst]
    )
    if all_entries:
        ver_w    = max(len("VERSION"), max(len(e['schema_version']) for e in all_entries))
        date_w   = max(len("DATE"),    max(len(e['date'])           for e in all_entries))
        chg_w    = max(len("CHG"),     max(len(e['change'])         for e in all_entries))
        # Cap author at 25 chars to prevent runaway column width
        auth_w   = max(len("AUTHOR"),  min(25, max(len(e['author']) for e in all_entries)))
    else:
        ver_w, date_w, auth_w, chg_w = 10, 10, 18, 7

    PFX = [("VERSION", ver_w), ("DATE", date_w), ("AUTHOR", auth_w), ("CHG", chg_w)]

    # Class-level tables use class version with a distinct label
    cls_entries = [e for cls in data['classes'].values()
                   for lst in cls.values() if isinstance(lst, list) for e in lst]
    cver_w = max(len("C VERSION"), max((len(e['class_version']) for e in cls_entries), default=0))
    CPFX = [("C VERSION", cver_w), ("DATE", date_w), ("AUTHOR", auth_w), ("CHG", chg_w)]

    def pfx(e):
        auth = e['author'] if len(e['author']) <= auth_w else e['author'][:auth_w-3] + "..."
        return [e['schema_version'], e['date'], auth, e['change']]

    def cpfx(e):
        auth = e['author'] if len(e['author']) <= auth_w else e['author'][:auth_w-3] + "..."
        return [e['class_version'], e['date'], auth, e['change']]

    def val(e):      return _fmt_val(e, maxlen=ml)
    def val_enum(e): return _fmt_val(e, maxlen=ml, cap=False)

    versions = sorted(
        {e['schema_version'] for e in all_entries if e['schema_version']},
        key=lambda v: [int(x) for x in v.split('.') if x.isdigit()]
    )
    if len(versions) >= 2:
        ver_range = f"({versions[0]} - {versions[-1]})"
    elif versions:
        ver_range = versions[0]
    else:
        ver_range = ""

    print(f"\n{'='*78}")
    print(f"SCHEMA: {spath}  {ver_range}")
    print(f"{'='*78}")

    # ── 1. Schema attributes ──────────────────────────────────────────────────
    if data['schema_attrs']:
        cols = PFX + [("FIELD", 25), ("VALUE", 1)]
        rows = [pfx(e) + [e['field'], val(e)] for e in data['schema_attrs']]
        _print_table("Schema Attributes", rows, cols, indent=T, concise=concise)

    # ── 2. Classes ────────────────────────────────────────────────────────────
    if any(any([cls['class_attrs'], cls['slots_list'], cls['slot_usage'], cls['attributes']])
           for cls in data['classes'].values()):
        print(f"\n  CLASSES")

    for class_name in sorted(data['classes']):
        cls = data['classes'][class_name]
        if not any([cls['class_attrs'], cls['slots_list'],
                    cls['slot_usage'], cls['attributes']]):
            continue

        latest = data.get('_latest_yaml') or {}
        c_ver = (latest.get('classes', {})
                       .get(class_name, {})
                       .get('annotations', {})
                       .get('version', ''))
        ver_tag = f"  (v{c_ver})" if c_ver else ""

        print(f"\n  {'─'*74}")
        print(f"    {class_name}{ver_tag}")

        if cls['class_attrs']:
            cols = PFX + [("ATTRIBUTE", 30), ("VALUE", 1)]
            rows = [pfx(e) + [e['field'], val(e)] for e in cls['class_attrs']]
            _print_table("Class Attributes", rows, cols, indent=T, concise=concise)

        if cls['slots_list']:
            rows = sorted([cpfx(e) + [val(e)] for e in cls['slots_list']],
                          key=lambda r: r[4].lower())
            cols = CPFX + [("SLOT", 1)]
            _print_table("Slots (list membership)", rows, cols, indent=T, concise=concise)

        if cls['slot_usage']:
            rows = sorted([cpfx(e) + [e.get('slot_name', ''), e['field'], val(e)]
                           for e in cls['slot_usage']],
                          key=lambda r: r[4].lower())
            cols = CPFX + [("SLOT", _col_w(rows, 4, "SLOT")), ("ATTRIBUTE", 22), ("VALUE", 1)]
            _print_table("Slot Usage", rows, cols, indent=T, concise=concise)

        if cls['attributes']:
            rows = sorted([cpfx(e) + [e.get('slot_name', ''), e['field'], val(e)]
                           for e in cls['attributes']],
                          key=lambda r: r[4].lower())
            cols = CPFX + [("SLOT", _col_w(rows, 4, "SLOT")), ("ATTRIBUTE", 22), ("VALUE", 1)]
            _print_table("Slot Attributes (inline definitions)", rows, cols, indent=T, concise=concise)

    # ── 3. Schema-level slots ─────────────────────────────────────────────────
    if data['slots']:
        rows = sorted([pfx(e) + [e.get('slot_name', ''), e['field'], val(e)]
                       for e in data['slots']],
                      key=lambda r: r[4].lower())
        cols = PFX + [("SLOT", _col_w(rows, 4, "SLOT")), ("ATTRIBUTE", 22), ("VALUE", 1)]
        print(f"\n  {'─'*74}")
        print(f"  SLOTS")
        _print_table("", rows, cols, indent=T, concise=concise)

    # ── 4. Enums ──────────────────────────────────────────────────────────────
    if data['enum_summary'] or data['enums']:
        print(f"\n  {'─'*74}")
        print(f"  ENUMS")

        if data['enum_summary']:
            rows = [pfx(e) + [e.get('enum_name') or '', e['field'] or '', val_enum(e)]
                    for e in data['enum_summary']]
            cols = PFX + [
                ("ENUM", _col_w(rows, 4, "ENUM")),
                ("ATTRIBUTE", _col_w(rows, 5, "ATTRIBUTE")),
                ("VALUE", 1),
            ]
            _print_table("Enum / Collection Changes", rows, cols, indent=T, concise=concise)

        for enum_name in sorted(data['enums']):
            rows = []
            for e in data['enums'][enum_name]:
                pv      = e['field'].removeprefix('permissible_values.').removesuffix('.title')
                pv_key  = pv.rsplit('.', 1)[0] if '.' in pv else pv
                v       = val_enum(e)
                redundant = (v.strip().lower() in pv.strip().lower()
                             or v.strip().lower() == pv_key.strip().lower())
                rows.append(pfx(e) + [pv, '' if redundant else v])
            rows.sort(key=lambda r: (_semver_key(r[0]), r[1], r[4].lower()))
            cols = PFX + [("PERMISSIBLE VALUE", _col_w(rows, 4, "PERMISSIBLE VALUE")), ("VALUE", 1)]
            _print_table(f"Enum: {enum_name}", rows, cols, indent=T, concise=concise)


def run_detail_report(old_ref, new_ref, maxlen=None, target_files=None, concise=False, show_cosmetic=False):
    """
    Build and print a schema-grouped detail report over a range of commits.
    Walks old_ref → … → HEAD (or a date range) accumulating all changes, then
    prints them grouped by schema → section (schema attrs / classes / slots / enums).
    old_ref / new_ref may be HEAD~N refs or yyyy-mm-dd date strings.
    target_files: list of schema paths to process (defaults to all SCHEMA_FILES).
    """
    if is_date_ref(old_ref):
        until = new_ref if is_date_ref(new_ref) else None
        pairs = build_date_range_pairs(old_ref, until)
        end_label = until or "HEAD"
    else:
        pairs = build_commit_sequence(old_ref, new_ref)
        end_label = new_ref or "HEAD"

    if target_files is None:
        target_files = SCHEMA_FILES

    accumulator = {}
    for from_ref, to_ref in pairs:
        commit_info = get_commit_info(to_ref)
        for spath in target_files:
            try:
                old_yaml = load_git(from_ref, spath)
                new_yaml = load_git(to_ref, spath)
            except subprocess.CalledProcessError:
                continue
            substantive, enrichment, cosmetic_changes = analyze(old_yaml, new_yaml)
            include_cosmetic = cosmetic_changes if show_cosmetic else None
            if substantive or enrichment or include_cosmetic:
                _collect(accumulator, spath, from_ref, to_ref,
                         commit_info, substantive, enrichment, new_yaml,
                         cosmetic=include_cosmetic)

    n = len(pairs)
    print(f"\n{'='*78}")
    print(f"DETAIL REPORT: {old_ref} → {end_label}  ({n} commit step{'s' if n != 1 else ''})")
    print(f"{'='*78}")

    printed = False
    for spath in target_files:
        if spath in accumulator:
            _print_schema_report(spath, accumulator[spath], maxlen, concise=concise)
            printed = True

    if not printed:
        print(f"\nNo schema changes found between {old_ref} and {end_label}.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("old_ref", nargs="?", default="HEAD~1",
                        help="Git ref (HEAD~N) or start date yyyy-mm-dd (default: HEAD~1)")
    parser.add_argument("new_ref", nargs="?", default=None,
                        help="Git ref or end date yyyy-mm-dd; omit for working tree / up to today")
    parser.add_argument("--full", "-f", action="store_true",
                        help="Show full values without truncation")
    parser.add_argument("--detail", "-d", action="store_true",
                        help="Schema-grouped detail report across all commits between old_ref and HEAD")
    parser.add_argument("--schema", "-s", default=None,
                        help="Limit report to schemas whose path contains this substring "
                             "(case-insensitive; e.g. 'canada_covid19', 'wastewater'). "
                             "Applies to both the summary and detail reports.")
    parser.add_argument("--concise", "-c", action="store_true",
                        help="Concise output: in each table, suppress VERSION/DATE/AUTHOR/CHG "
                             "columns when they are identical to the previous row. "
                             "The first row of every table always shows all values.")
    parser.add_argument("--cosmetic", "-C", action="store_true",
                        help="Include cosmetic changes in the detail report (-d). "
                             "Cosmetic changes (reorderings, redundant name fields, "
                             "whitespace-only string wrapping) are tagged C-ADD / C-DEL / C-UPD "
                             "in the CHG column.")
    args = parser.parse_args()
    maxlen = None if args.full else 120

    # Apply schema filter once; both summary and detail use the result.
    if args.schema:
        report_files = [p for p in SCHEMA_FILES if args.schema.lower() in p.lower()]
        if not report_files:
            print(f"No schema files match '{args.schema}'. Available:")
            for p in SCHEMA_FILES:
                print(f"  {p}")
            return
    else:
        report_files = SCHEMA_FILES

    if args.detail:
        run_detail_report(args.old_ref, args.new_ref, maxlen, report_files,
                          concise=args.concise, show_cosmetic=args.cosmetic)
        return

    totals = dict(substantive=0, cap=0, enrichment=0, cosmetic=0)

    for path in report_files:
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
