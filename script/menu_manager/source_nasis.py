"""USDA NRCS NASIS Database source helpers for menu_manager.py.

Fetches the NASIS Domains PDF and extracts all domain tables into
LinkML enum YAML format.  Each domain in the PDF becomes one enum.

Public API used by menu_manager.py:
    process_nasis_source(key, source, locales=None)
    match_nasis(url, tmp_path, config_file)
"""

import os
import re
import sys
import urllib.request
import yaml

from source_utils import (
    add_permissible_value,
    IndentedDumper,
    make_config_schema,
    BROWSER_HEADERS,
    MENU_CONFIG,
)


# ---------------------------------------------------------------------------
# Inline text splitter
# ---------------------------------------------------------------------------

_SENTINEL = "No description available."


def _split_inline(text):
    """Split combined row text into (data_entry_text, label_text, description).

    The PDF's extract_text() merges all three columns (data entry text,
    label text, description) into one string per row.  This function
    recovers the three fields using two strategies:

    1. Repetition detection: find the smallest n where the first n words
       match the next n words (case-insensitively).  data=words[:n],
       label=words[n:2n], desc=words[2n:].

    2. Case-transition: when data entry text is all-lowercase and the
       label starts with an uppercase word, split at that boundary.
       With the sentinel present the rest is the label; otherwise a
       secondary repetition check on the remainder separates label from
       description.

    The sentinel "No description available." is stripped before splitting
    and results in an empty description string.
    """
    has_sentinel = text.rstrip().endswith(_SENTINEL)
    if has_sentinel:
        text = text.rstrip()[: -len(_SENTINEL)].rstrip()

    words = text.split()
    if not words:
        return ("", "", "")

    # Strategy 1: repetition detection (smallest n first)
    for n in range(1, len(words) // 2 + 1):
        if [w.lower() for w in words[:n]] == [w.lower() for w in words[n : 2 * n]]:
            data = " ".join(words[:n])
            label = " ".join(words[n : 2 * n])
            desc = " ".join(words[2 * n :])
            return (data, label, desc)

    # Strategy 2: case-transition (all-lowercase prefix → first uppercase word)
    for i, word in enumerate(words):
        alpha = re.sub(r"[^a-zA-Z]", "", word)
        if alpha and alpha[0].isupper() and i > 0:
            if all(
                not re.sub(r"[^a-zA-Z]", "", words[j])
                or re.sub(r"[^a-zA-Z]", "", words[j])[0].islower()
                for j in range(i)
            ):
                data = " ".join(words[:i])
                rest = words[i:]
                if has_sentinel:
                    return (data, " ".join(rest), "")
                # Find the label as the longest greedy prefix of rest whose
                # words (stripped of punctuation) all appear among the data
                # words.  Stop early once all data words are covered, so that
                # a description starting with a data word isn't pulled in.
                # This handles reordered labels like "till, ablation" → "Ablation till"
                # and abbreviated labels like "till, unspecified" → "Till".
                data_vocab = {re.sub(r"[^a-zA-Z0-9]", "", w).lower()
                              for w in words[:i] if re.sub(r"[^a-zA-Z0-9]", "", w)}
                covered: set = set()
                best_m = 0
                for m, rword in enumerate(rest, 1):
                    rkey = re.sub(r"[^a-zA-Z0-9]", "", rword).lower()
                    if rkey and rkey not in data_vocab:
                        break
                    if rkey:
                        covered.add(rkey)
                    best_m = m
                    if covered == data_vocab:
                        break
                if best_m > 0:
                    return (data, " ".join(rest[:best_m]), " ".join(rest[best_m:]))
                return (data, " ".join(rest), "")

    # Fallback: entire text is data (= label), no description
    return (text, text, "")


# ---------------------------------------------------------------------------
# PDF utilities
# ---------------------------------------------------------------------------

def _require_pypdf():
    try:
        import pypdf
        return pypdf
    except ImportError:
        print(
            "Error: pypdf is required for NASIS PDF processing.\n"
            "Install it with:  pip install pypdf",
            file=sys.stderr,
        )
        sys.exit(1)


def fetch_pdf(url, dest_path):
    """Download *url* to *dest_path* using browser-like headers."""
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    with open(dest_path, "wb") as f:
        f.write(data)
    print(f"  Downloaded {url} → {dest_path} ({len(data):,} bytes)")


# ---------------------------------------------------------------------------
# PDF parser
# ---------------------------------------------------------------------------

_SKIP_PAT = re.compile(
    r"^(?:NASIS\s+\d+\.\d+|Obsolete\?\s+ID|07/\d{2}|\d+\s+of\s+\d+)"
)
_DOMAIN_NAME_PAT = re.compile(r"^Domain Name:\s*(\S+)\s*$")
_DOMAIN_DESC_PAT = re.compile(r"^Domain Description:\s*(.*)")
_ROW_PAT = re.compile(r"^(No|Yes)\s+([\d,]+)\s*(.*)")


def parse_nasis_pdf(pdf_path):
    """Parse all domain tables from the NASIS Domains PDF.

    Iterates every page using extract_text() and runs a line-by-line state
    machine.  Cross-page row continuations are handled naturally: current_row
    stays open across page boundaries until the next anchor or domain marker.

    Returns an ordered dict:
        domain_name → {
            "page": int,          # 1-based PDF page where the domain starts
            "description": str,   # domain description (empty if unavailable)
            "rows": [
                {
                    "obsolete": bool,
                    "data_entry_text": str,
                    "label_text": str,
                    "description": str,
                }
            ]
        }
    """
    pypdf = _require_pypdf()
    reader = pypdf.PdfReader(pdf_path)
    total = len(reader.pages)
    print(f"  Parsing {total} PDF pages ...")

    domains = {}          # OrderedDict by insertion (Python 3.7+)
    current_domain = None
    domain_desc_active = False
    current_row = None    # {"obsolete": bool, "data": str}

    def flush_row():
        nonlocal current_row
        if current_row is None or current_domain is None:
            return
        accumulated = current_row["data"]
        data_text, label_text, desc = _split_inline(accumulated)
        domains[current_domain]["rows"].append(
            {
                "obsolete": current_row["obsolete"],
                "data_entry_text": data_text,
                "label_text": label_text,
                "description": desc,
            }
        )
        current_row = None

    for page_num, page in enumerate(reader.pages, 1):
        raw_text = page.extract_text() or ""
        for raw_line in raw_text.split("\n"):
            line = raw_line.strip()
            if not line:
                continue

            if _SKIP_PAT.match(line):
                continue

            m = _DOMAIN_NAME_PAT.match(line)
            if m:
                flush_row()
                domain_desc_active = False
                current_domain = m.group(1)
                if current_domain not in domains:
                    domains[current_domain] = {
                        "page": page_num,
                        "description": "",
                        "rows": [],
                    }
                continue

            m = _DOMAIN_DESC_PAT.match(line)
            if m:
                flush_row()
                desc_text = m.group(1).strip()
                if current_domain and desc_text and desc_text != _SENTINEL:
                    domains[current_domain]["description"] = desc_text
                    domain_desc_active = True
                else:
                    domain_desc_active = False
                continue

            m = _ROW_PAT.match(line)
            if m:
                flush_row()
                domain_desc_active = False
                current_row = {
                    "obsolete": m.group(1).lower() == "yes",
                    "data": m.group(3).strip(),
                }
                continue

            # Continuation line
            if domain_desc_active and current_domain:
                existing = domains[current_domain]["description"]
                if existing:
                    domains[current_domain]["description"] = existing + " " + line
                elif line != _SENTINEL:
                    domains[current_domain]["description"] = line
            elif current_row is not None:
                sep = " " if current_row["data"] else ""
                current_row["data"] = current_row["data"] + sep + line

    flush_row()
    return domains


# ---------------------------------------------------------------------------
# Reference hoisting
# ---------------------------------------------------------------------------

_REF_PAT = re.compile(r"\s*(References?:.*)")


def _hoist_shared_references(schema):
    """Move shared 'Reference(s): ...' boilerplate out of permissible_values.

    For each enum, repeatedly finds the most common 'Reference(s): …' tail
    that appears in ≥2 permissible_value descriptions and hoists it to the
    enum-level description.  Iterates until no more shared references remain,
    so multiple distinct boilerplate strings are all extracted.
    """
    for enum_def in schema.get("enums", {}).values():
        pv = enum_def.get("permissible_values", {})
        if not pv:
            continue

        while True:
            # Tally reference tails across all values
            ref_counts: dict[str, int] = {}
            for entry in pv.values():
                desc = (entry.get("description") or "").strip()
                m = _REF_PAT.search(desc)
                if m:
                    ref = m.group(1)
                    ref_counts[ref] = ref_counts.get(ref, 0) + 1

            if not ref_counts:
                break

            shared_ref, count = max(ref_counts.items(), key=lambda x: x[1])
            if count < 2:
                break

            # Strip the shared reference from each matching value
            for entry in pv.values():
                desc = (entry.get("description") or "").strip()
                m = _REF_PAT.search(desc)
                if m and m.group(1) == shared_ref:
                    prefix = desc[: m.start()].strip()
                    if prefix:
                        entry["description"] = prefix
                    else:
                        entry.pop("description", None)

            # Append to enum description if not already present
            enum_desc = enum_def.get("description") or ""
            if shared_ref not in enum_desc:
                enum_def["description"] = (enum_desc + " " + shared_ref).strip() if enum_desc else shared_ref


# ---------------------------------------------------------------------------
# Processing function (called from menu_manager.process_sources)
# ---------------------------------------------------------------------------

def process_nasis_source(key, source, locales=None):
    """Build a LinkML enum YAML for a NASIS source.

    Downloads the PDF to sources/{key}.pdf if not already cached, parses
    all domain tables, and writes sources/{key}.yaml with one enum per domain.
    """
    base_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    pdf_path = f"sources/{key}.pdf"
    yaml_path = f"sources/{key}.yaml"

    if not os.path.exists(pdf_path):
        print(f"  Downloading PDF from {base_url} ...")
        fetch_pdf(base_url, pdf_path)
    else:
        print(f"  Using cached PDF {pdf_path}")

    schema = make_config_schema(
        id=base_url,
        name=key,
        title=source.get("title", ""),
        description=source.get("description", ""),
        version=source.get("version", ""),
    )
    schema["enums"] = {}

    domains = parse_nasis_pdf(pdf_path)
    pdf_base = base_url.split("#")[0]

    for domain_name, domain in domains.items():
        enum_key = f"{key}_{domain_name}"
        see_also = f"{pdf_base}#page={domain['page']}"

        permissible_values = {}
        for row in domain["rows"]:
            data_text = row["data_entry_text"]
            if not data_text:
                continue
            label = row["label_text"]
            title = label if label and label.lower() != data_text.lower() else None
            add_permissible_value(
                permissible_values,
                data_text,
                title=title,
                description=row["description"] or None,
                status="obsolete" if row["obsolete"] else None,
            )

        if not permissible_values:
            continue

        enum_entry = {
            "name": enum_key,
            "title": domain_name.replace("_", " ").title(),
            "see_also": see_also,
            "permissible_values": permissible_values,
        }
        if domain["description"]:
            enum_entry["description"] = domain["description"]
        schema["enums"][enum_key] = enum_entry

    _hoist_shared_references(schema)

    enum_count = len(schema["enums"])
    print(f"  Extracted {enum_count} enums from {len(domains)} domains")

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path}")


def match_nasis(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is a NASIS Domains PDF URL and was handled.

    Placeholder for future -a auto-detection support.
    """
    if "nrcs.usda.gov" not in url or "NASIS" not in url or not url.lower().endswith(".pdf"):
        return False
    # TODO: implement -a add-source detection for NASIS PDF URLs
    return False
