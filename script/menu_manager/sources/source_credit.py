"""CRediT (Contributor Roles Taxonomy) PDF source for menu_manager.py.

Parses the CRediT roles PDF to produce one permissible value per contributor
role, with definition text and a meaning URI pointing to credit.niso.org.

Public API used by menu_manager.py:
    process_credit_source(key, source, locales=None)
    match_credit(url, config_file)
"""

import os
import re
import subprocess
import sys
import urllib.parse
import yaml

from source_utils import (
    add_permissible_value,
    make_config_schema,
    make_source_entry,
    write_config,
    IndentedDumper,
    MENU_CONFIG,
)

_ROLE_NAMES = [
    "Conceptualization",
    "Data Curation",
    "Formal Analysis",
    "Funding Acquisition",
    "Investigation",
    "Methodology",
    "Project Administration",
    "Resources",
    "Software",
    "Supervision",
    "Validation",
    "Visualization",
    "Writing – original draft",
    "Writing – review & editing",
]

_NISO_BASE = "https://credit.niso.org/contributor-roles/"


def _role_slug(role):
    """Convert a role name to the NISO URI slug (hyphen-separated lowercase)."""
    s = role.lower()
    s = re.sub(r'[–—‒-]', '-', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')


def _role_key(role):
    """Return the permissible-value code (underscore-separated lowercase)."""
    return _role_slug(role).replace('-', '_')


def _parse_credit_pdf(pdf_path):
    """Return list of (code, title, definition) tuples from the CRediT PDF.

    Concatenates text from all pages, strips the header, then splits at each
    known role name. The definition is everything before the first § bullet.
    """
    try:
        import pypdf
    except ImportError:
        print("Error: pypdf is required — install with: pip install pypdf",
              file=sys.stderr)
        return []

    reader = pypdf.PdfReader(pdf_path)
    text = " ".join((page.extract_text() or "") for page in reader.pages)
    text = re.sub(r'\s+', ' ', text).strip()

    # Strip the document header line that precedes the first role entry.
    header_pat = re.compile(
        r'CRediT roles and example research tasks.*?Example tasks\s*',
        re.IGNORECASE | re.DOTALL,
    )
    text = header_pat.sub('', text, count=1).strip()

    # Sort longer names first so "Writing – review & editing" beats "Writing".
    sorted_roles = sorted(_ROLE_NAMES, key=len, reverse=True)
    role_pat = re.compile(
        '(' + '|'.join(re.escape(r) for r in sorted_roles) + ')'
    )
    parts = role_pat.split(text)

    results = []
    i = 1
    while i + 1 < len(parts):
        role = parts[i]
        content = parts[i + 1].strip()
        i += 2
        bullet_idx = content.find('§')  # §
        if bullet_idx < 0:
            bullet_idx = content.find('§')
        definition = (content[:bullet_idx].strip() if bullet_idx >= 0
                      else content.strip())
        definition = definition.strip('. ') or None
        results.append((_role_key(role), role, definition))

    return results


def process_credit_source(key, source, locales=None):
    """Build a LinkML enum YAML from the CRediT PDF."""
    pdf_path = f"sources/{key}.pdf"
    if not os.path.exists(pdf_path):
        print(f"Skipping {key}: {pdf_path} not found — run -f to fetch first",
              file=sys.stderr)
        return

    roles = _parse_credit_pdf(pdf_path)
    if not roles:
        print(f"  Warning: no roles extracted from {pdf_path}", file=sys.stderr)
        return

    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    permissible_values = {}
    for code, title, description in roles:
        add_permissible_value(
            permissible_values, code,
            title=title,
            description=description,
            meaning=_NISO_BASE + _role_slug(title) + "/",
        )

    schema = make_config_schema(
        id=source_url,
        name=key,
        title=source.get("title") or "CRediT Contributor Roles Taxonomy",
        description=source.get("description") or (
            "The Contributor Roles Taxonomy (CRediT) represents the roles "
            "typically played by contributors to scientific scholarly output."
        ),
        version=source.get("version") or "",
        enums={key: {"permissible_values": permissible_values}},
    )

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper,
                  default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path} ({len(permissible_values)} roles)")


_ZENODO_PAT = re.compile(
    r'zenodo\.org/records/\d+/files/.*credit.*\.pdf',
    re.IGNORECASE,
)


def match_credit(url, config_file=MENU_CONFIG):
    """Return True if *url* is the CRediT Zenodo PDF and was handled.

    Pre-download detector: downloads the PDF via curl (handles redirects),
    writes the config entry with see_also pointing to https://credit.niso.org/,
    and calls process_credit_source to generate sources/CRediT.yaml.
    """
    decoded = urllib.parse.unquote(url)
    if not _ZENODO_PAT.search(decoded):
        return False

    key = "CRediT"

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        return True

    pdf_path = f"sources/{key}.pdf"
    print(f"Fetching {url} ...")
    result = subprocess.run(
        ["curl", "-L", "--silent", "--show-error", "-o", pdf_path, url],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"  Error downloading PDF: {result.stderr.strip()}", file=sys.stderr)
        return True
    print(f"Saved to {pdf_path}")

    entry = make_source_entry(
        key, url, "CRediT", "pdf",
        title="CRediT Contributor Roles Taxonomy",
        version="2022",
        description=(
            "The Contributor Roles Taxonomy (CRediT) is a high-level taxonomy"
            " representing the 14 roles typically played by contributors to"
            " scientific scholarly output. Each role describes a specific"
            " contribution to the scholarly output."
        ),
    )
    entry["see_also"] = "https://credit.niso.org/"

    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    process_credit_source(key, entry)
    return True
