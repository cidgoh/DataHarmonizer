"""USDA NRCS source helpers for menu_manager.py.

Fetches the NRCS Field Book for Describing and Sampling Soils PDF and
extracts selected enumeration tables into LinkML enum YAML format.

Public API used by menu_manager.py:
    process_nrcs_source(key, source, locales=None)
    match_nrcs(url, tmp_path, config_file)
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
# Enum extraction registry
#
# Each entry describes one enum to extract from the PDF source.
#
# Keys:
#   enum_key           – LinkML enum name (key in schema["enums"])
#   title              – human-readable enum title
#   pdf_page           – 1-based physical PDF page number containing the table
#   discussion_marker  – text that opens the Discussion paragraph, before "—"
#   table_parser       – name of the _parse_* function in _PARSERS
# ---------------------------------------------------------------------------

ENUM_DEFINITIONS = [
    {
        "enum_key":          "NRCSSoilFieldBook_SalinityClass",
        "title":             "Salinity Class",
        "pdf_page":          141,
        "discussion_marker": "Salinity Class (Discussion)",
        "table_parser":      "_parse_salinity_class",
    },
    {
        "enum_key":          "NRCSSoilFieldBook_ObservationMethod",
        "title":             "Observation Method",
        "pdf_page":          154,
        "discussion_marker": "Observation Method",
        "table_parser":      "_parse_observation_method",
    },
]


# ---------------------------------------------------------------------------
# PDF utilities
# ---------------------------------------------------------------------------

def _require_pypdf():
    """Import and return the pypdf module, exiting with a helpful message if absent."""
    try:
        import pypdf
        return pypdf
    except ImportError:
        print(
            "Error: pypdf is required for NRCS PDF processing.\n"
            "Install it with:  pip install pypdf",
            file=sys.stderr,
        )
        sys.exit(1)


def fetch_pdf(url, dest_path):
    """Download *url* to *dest_path* using browser-like headers."""
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    with urllib.request.urlopen(req) as response:
        data = response.read()
    with open(dest_path, "wb") as f:
        f.write(data)
    print(f"  Downloaded {url} → {dest_path} ({len(data):,} bytes)")


def extract_page_text(pdf_path, page_num):
    """Return extracted text from *page_num* (1-based) of *pdf_path*."""
    pypdf = _require_pypdf()
    reader = pypdf.PdfReader(pdf_path)
    return reader.pages[page_num - 1].extract_text()


# ---------------------------------------------------------------------------
# Discussion paragraph extractor (shared across all parsers)
# ---------------------------------------------------------------------------

def _extract_discussion(page_text, marker):
    """Return the discussion paragraph following *marker* + '—'.

    Captures text from the dash after *marker* up to the first "Note:" line,
    a blank line followed by a capital, or the next field label (text ending
    with '—').  Double spaces left by pypdf column layout are collapsed.
    """
    text = page_text.replace("—", "—").replace("–", "—")
    m = re.search(
        re.escape(marker) + r"[—-](.*?)(?=\nNote:|\n\n[A-Z]|\n[A-Z][^—\n]+—|\Z)",
        text, re.DOTALL,
    )
    if not m:
        return ""
    raw = m.group(1).strip()
    raw = re.sub(r"-\n\s*", "", raw)      # rejoin hyphenated line-breaks
    raw = re.sub(r"\s+", " ", raw)        # collapse all whitespace runs
    return raw.strip()


# ---------------------------------------------------------------------------
# Table parsers  (one per enum)
#
# Each parser receives the full extracted text of its PDF page and returns
# a list of dicts: {code, title, description}.
# ---------------------------------------------------------------------------

def _parse_salinity_class(page_text):
    """Parse the Salinity Class table (PDF page 141, book page 2-91).

    Table layout after header rows:
        nonsaline            0   < 2
        very slightly saline 1   2 to < 4
        slightly saline      2   4 to < 8
        moderately saline    3   8 to < 16
        strongly saline      4   ≥ 16

    Columns: Salinity Class (title) | Code | Saturated Paste – ECe dS/m
    Description = "ECe {range} dS/m"
    """
    rows = []
    # Each data row: one or more lowercase words, a single-digit code, then range text.
    # The two-space gap between code and range distinguishes range from title words.
    for m in re.finditer(
        r"^([a-z][a-z ]*?)\s+(\d)\s{2,}(.+)$",
        page_text, re.MULTILINE,
    ):
        rows.append({
            "code":        m.group(2),
            "title":       m.group(1).strip(),
            "description": f"ECe {m.group(3).strip()} dS/m",
        })
    return rows


def _parse_observation_method(page_text):
    """Parse the Observation Method table (PDF page 154, book page 2-104).

    Table layout:
        Kind (title) | Code | Criteria: Tools and Methods (description)

    The Kind column's text wraps across the line above the code in the PDF
    column layout.  A state machine tracks kind accumulation vs description
    accumulation, using a trailing-space heuristic to distinguish a truncated
    kind word from a description continuation when both precede a code line.

    Descriptions are prefixed with "device:" or "method:" based on keywords
    in the Kind name: dive/observation/video → method, all others → device.
    """
    section_m = re.search(r"Kind\s+Code\s+Criteria[^\n]*\n(.*)", page_text, re.DOTALL)
    if not section_m:
        return []

    METHOD_KEYWORDS = {"observation", "dive", "video"}

    rows = []
    kind_parts = []
    current_code = None
    desc_parts = []

    def flush():
        if current_code:
            kind = " ".join(kind_parts).strip()
            desc = " ".join(desc_parts).strip()
            prefix = "method" if any(w in kind.lower() for w in METHOD_KEYWORDS) else "device"
            rows.append({
                "code":        current_code,
                "title":       kind,
                "description": f"{prefix}: {desc}" if desc else "",
            })

    raw_lines = section_m.group(1).split("\n")
    for i, raw_line in enumerate(raw_lines):
        stripped = raw_line.strip()
        if not stripped:
            continue

        # Look-ahead: find next non-empty line and check if it contains a code
        next_stripped = next(
            (raw_lines[j].strip() for j in range(i + 1, len(raw_lines))
             if raw_lines[j].strip()),
            None,
        )
        next_has_code = bool(next_stripped and re.search(r"\b[A-Z]{2}\b", next_stripped))

        code_m = re.search(r"\b([A-Z]{2})\b", stripped)
        if code_m:
            pre  = stripped[:code_m.start()].strip()
            post = stripped[code_m.end():].strip()
            if current_code is not None:
                flush()
                kind_parts = [pre] if pre else []
            else:
                if pre:
                    kind_parts.append(pre)
            current_code = code_m.group(1)
            desc_parts = [post] if post else []
        elif current_code is not None and next_has_code:
            # Distinguish a truncated kind word (precedes next entry's code line)
            # from a description continuation that happens to be followed by a code
            # line.  Truncated kind words end with a trailing space in the raw PDF
            # output and are short noun fragments (≤3 words, no commas).
            ends_with_space = raw_line.endswith(" ")
            if ends_with_space and len(stripped.split()) <= 3 and "," not in stripped:
                flush()
                kind_parts = [stripped]
                current_code = None
                desc_parts = []
            else:
                desc_parts.append(stripped)
        else:
            (kind_parts if current_code is None else desc_parts).append(stripped)

    flush()
    return rows


# Map parser name strings → callables (used by process_nrcs_source dispatch)
_PARSERS = {
    "_parse_salinity_class":    _parse_salinity_class,
    "_parse_observation_method": _parse_observation_method,
}


# ---------------------------------------------------------------------------
# Processing function (called from menu_manager.process_sources)
# ---------------------------------------------------------------------------

def process_nrcs_source(key, source, locales=None):
    """Build a LinkML enum YAML for an NRCSSoilFieldBook source.

    Downloads the PDF to sources/{key}.pdf if not already cached, then
    iterates ENUM_DEFINITIONS to extract each enum and writes
    sources/{key}.yaml.
    """
    base_url  = (source.get("reachable_from") or {}).get("source_ontology", "")
    pdf_path  = f"sources/{key}.pdf"
    yaml_path = f"sources/{key}.yaml"

    if not os.path.exists(pdf_path):
        print(f"  Downloading PDF from {base_url} ...")
        fetch_pdf(base_url, pdf_path)
    else:
        print(f"  Using cached PDF {pdf_path}")

    schema = make_config_schema(
        id=base_url, name=key,
        title=source.get("title", ""),
        description=source.get("description", ""),
        version=source.get("version", ""),
    )
    schema["enums"] = {}

    pdf_base = base_url.split("#")[0]

    for defn in ENUM_DEFINITIONS:
        enum_key    = defn["enum_key"]
        title       = defn["title"]
        pdf_page    = defn["pdf_page"]
        disc_marker = defn["discussion_marker"]
        parser_name = defn["table_parser"]
        see_also    = f"{pdf_base}#page={pdf_page}"

        print(f"  Extracting {enum_key} from PDF page {pdf_page} ...")
        page_text = extract_page_text(pdf_path, pdf_page)

        description = _extract_discussion(page_text, disc_marker)

        parser = _PARSERS.get(parser_name)
        if parser is None:
            print(f"  Warning: no parser '{parser_name}' defined for {enum_key}",
                  file=sys.stderr)
            continue

        rows = parser(page_text)
        if not rows:
            print(f"  Warning: no table rows parsed for {enum_key}", file=sys.stderr)
            continue

        permissible_values = {}
        for row in rows:
            add_permissible_value(
                permissible_values, row["code"],
                title=row["title"],
                description=row.get("description"),
            )

        schema["enums"][enum_key] = {
            "name":               enum_key,
            "title":              title,
            "description":        description,
            "see_also":           see_also,
            "permissible_values": permissible_values,
        }
        print(f"  Added enum {enum_key} ({len(permissible_values)} values)")

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path}")


def match_nrcs(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is an NRCS Field Book PDF URL and was handled.

    Placeholder for future -a auto-detection support.
    """
    if "nrcs.usda.gov" not in url or not url.lower().endswith(".pdf"):
        return False
    # TODO: implement -a add-source detection for NRCS PDF URLs
    return False
