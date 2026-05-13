"""National Soil Database (NSDB) source helpers for menu_manager.py.

Provides HTML-parsing, URL utilities, and processing functions for NSDB
classification pages used by the add_source() NSDB detection blocks and
process_sources().

Public API used by menu_manager.py:
    nsdb_fr_url(url)
    find_section_paragraph(html_text, section_name)
    find_links_by_text(html_text, link_texts, base_url)
    find_named_section_links(html_text, section_name, base_url)
    find_contents_table_links(html_text, base_url)
    find_list_section_links(html_text, section_text, base_url)
    parse_attribute_page(html_text)
    process_nsdb_html_source(key, source, enum_prefix, locales=None)
    process_nsdb_source(key, source, locales=None)
    match_nsdb_snt(url, tmp_path, config_file)
    match_nsdb_slt(url, tmp_path, config_file)
    match_nsdb_soil(url, tmp_path, config_file)
    match_nsdb_slc(url, tmp_path, config_file)
"""

import os
import re
import sys
import urllib.parse
import yaml
from source_utils import (
    strip_tags as _strip_tags,
    strip_tags,
    fetch_html,
    add_permissible_value,
    _make_locale_extensions,
    IndentedDumper,
    make_config_schema,
    make_source_entry,
    write_config,
    MENU_CONFIG,
)


def nsdb_fr_url(url):
    """Return the French-language equivalent of an NSDB URL.

    The French NSDB pages live under ``/siscan/`` rather than ``/cansis/``.
    """
    return url.replace('/cansis/', '/siscan/')


def find_section_paragraph(html_text, section_name):
    """Return plain text of the first paragraph following a header containing section_name."""
    m = re.search(
        r'<h[2-4][^>]*>[^<]*' + re.escape(section_name) + r'[^<]*</h[2-4]>'
        r'(?:\s*<[^>]+>)*\s*<p[^>]*>(.*?)</p>',
        html_text, re.IGNORECASE | re.DOTALL
    )
    return _strip_tags(m.group(1)) if m else ""


def find_links_by_text(html_text, link_texts, base_url):
    """Find anchor links whose display text matches any entry in link_texts.

    Returns {display_text: absolute_url}.
    """
    results = {}
    for m in re.finditer(r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                         html_text, re.IGNORECASE | re.DOTALL):
        text = _strip_tags(m.group(2))
        if text in link_texts:
            results[text] = urllib.parse.urljoin(base_url, m.group(1))
    return results


def find_named_section_links(html_text, section_name, base_url):
    """Find Name-column links from the table in a named section.

    Locates a heading whose text contains section_name (case-insensitive) and
    returns links from the Name column of the first table in that section.
    Falls back to all <a> hrefs in the section if no Name-column table is found.

    Returns a list of (name, absolute_url) tuples.
    """
    m = re.search(
        r'<(h[2-4])[^>]*>[^<]*' + re.escape(section_name) + r'[^<]*</\1>(.*?)(?=<h[2-4]|\Z)',
        html_text, re.IGNORECASE | re.DOTALL
    )
    if not m:
        return []
    section_html = m.group(2)
    table_m = re.search(r'<table[^>]*>(.*?)</table>', section_html, re.IGNORECASE | re.DOTALL)
    if table_m:
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        if rows:
            header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', rows[0], re.IGNORECASE | re.DOTALL)
            header_texts = [_strip_tags(h).lower() for h in header_cells]
            name_col = next((i for i, h in enumerate(header_texts) if h == 'name'), None)
            if name_col is not None:
                results = []
                for row in rows[1:]:
                    cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.IGNORECASE | re.DOTALL)
                    if len(cells) > name_col:
                        link_m = re.search(r'<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                                            cells[name_col], re.IGNORECASE | re.DOTALL)
                        if link_m:
                            results.append((_strip_tags(link_m.group(2)),
                                             urllib.parse.urljoin(base_url, link_m.group(1))))
                return results
    # Fallback: collect all <a> hrefs in the section
    results = []
    for link_m in re.finditer(r'<a\s[^>]*href=["\']([^"\'#][^"\']*)["\'][^>]*>(.*?)</a>',
                               section_html, re.IGNORECASE | re.DOTALL):
        text = _strip_tags(link_m.group(2)).strip()
        if text:
            results.append((text, urllib.parse.urljoin(base_url, link_m.group(1))))
    return results


def find_contents_table_links(html_text, base_url):
    """Find Name-column links from the Contents section table.

    Returns a list of (name, absolute_url) tuples.
    """
    return find_named_section_links(html_text, "Contents", base_url)


def find_list_section_links(html_text, section_text, base_url):
    """Find <a> links from the <ol> nested inside a <li> whose label contains section_text.

    Handles structures like:
      <li><abbr title="...">SLC</abbr> attribute tables <ol><li><a href="...">...</a></li></ol></li>
      <li>Ecological Framework Tables <ol>...</ol></li>

    For each <li>, strips tags from the content before the first nested <ol> to form the
    label; if the label contains section_text (case-insensitive), returns all <a> links
    found within that <ol>.

    Returns a list of (name, absolute_url) tuples.
    """
    for li_m in re.finditer(r'<li\b[^>]*>', html_text, re.IGNORECASE):
        after_li = html_text[li_m.end():]
        ol_m = re.search(r'<ol\b[^>]*>(.*?)</ol>', after_li, re.IGNORECASE | re.DOTALL)
        if not ol_m:
            continue
        label_text = _strip_tags(after_li[:ol_m.start()]).strip()
        if section_text.lower() not in label_text.lower():
            continue
        results = []
        for link_m in re.finditer(
                r'<a\s[^>]*href=["\']([^"\'#][^"\']*)["\'][^>]*>(.*?)</a>',
                ol_m.group(1), re.IGNORECASE | re.DOTALL):
            text = _strip_tags(link_m.group(2)).strip()
            if text:
                results.append((text, urllib.parse.urljoin(base_url, link_m.group(1))))
        if results:
            return results
    return []


def parse_attribute_page(html_text):
    """Parse an NSDB attribute definition page.

    Returns (label, title, description, pv_tables) where pv_tables is a list
    of lists of {'code', 'class_', 'description'} dicts — one inner list per
    permissible-value table found on the page.
    """
    label = title = description = ""

    def norm_key(raw):
        """Normalise a cell key: strip tags, collapse whitespace/underscores, remove trailing colon."""
        return re.sub(r'[\s_]+', ' ', _strip_tags(raw)).lower().rstrip(':').strip()

    # Scan all tables for attribute definition rows (label, title, definition/description).
    # This avoids relying on "Attribute Definition" heading placement in the HTML.
    all_tables = re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL)
    for table_html in all_tables:
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        for row in rows:
            cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.IGNORECASE | re.DOTALL)
            if len(cells) >= 2:
                k = norm_key(cells[0])
                v = _strip_tags(cells[1])
                if k in ('attribute label', 'label'):
                    label = v
                elif k in ('attribute title', 'title'):
                    title = v
                elif k in ('attribute definition', 'attribute description', 'definition', 'description'):
                    description = v
        if label:
            break  # Found the attribute definition table; stop scanning

    pv_tables = []
    for table_html in re.findall(r'<table[^>]*>(.*?)</table>', html_text, re.IGNORECASE | re.DOTALL):
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.IGNORECASE | re.DOTALL)
        if not rows:
            continue
        header_cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', rows[0], re.IGNORECASE | re.DOTALL)
        header_texts = [_strip_tags(h).lower() for h in header_cells]
        if 'code' not in header_texts:
            continue
        code_idx = header_texts.index('code')
        class_idx = next((i for i, h in enumerate(header_texts)
                          if h in ('class', 'classe', 'catégorie', 'categorie')), None)
        desc_idx  = next((i for i, h in enumerate(header_texts)
                          if h in ('description', 'définition', 'definition')), None)
        pv_rows = []
        for row in rows[1:]:
            cells = [_strip_tags(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.IGNORECASE | re.DOTALL)]
            if len(cells) > code_idx and cells[code_idx]:
                pv_rows.append({
                    'code': cells[code_idx],
                    'class_': cells[class_idx] if class_idx is not None and len(cells) > class_idx else "",
                    'description': cells[desc_idx] if desc_idx is not None and len(cells) > desc_idx else "",
                })
        if pv_rows:
            pv_tables.append(pv_rows)

    return label, title, description, pv_tables


# ---------------------------------------------------------------------------
# Processing functions (called from menu_manager.process_sources)
# ---------------------------------------------------------------------------

def _build_nsdb_enum(attr_html, enum_prefix, require_qualifying=True):
    """Parse an NSDB attribute page and return ``(enum_key, enum_dict)`` or ``(None, None)``.

    Parameters
    ----------
    attr_html : str
        Raw HTML of the attribute page.
    enum_prefix : str
        Prefix for the enum key, e.g. ``"NSDB"`` or ``"NSDBSLC"``.
    require_qualifying : bool
        When True (default) only return an enum when the pv_tables have more
        than 2 tables, or any table has more than 2 rows.  Set to False for
        single-attribute-page sources where every attribute should be included.

    Returns
    -------
    tuple
        ``(enum_key, enum_dict)`` on success, ``(None, None)`` otherwise.
    """
    label, title, attr_desc, pv_tables = parse_attribute_page(attr_html)
    if not label:
        return None, None
    if require_qualifying and not (
            len(pv_tables) > 2 or any(len(rows) > 2 for rows in pv_tables)):
        return None, None
    enum_key = f"{enum_prefix}_{label}"
    permissible_values = {}
    for rows in pv_tables:
        for row in rows:
            add_permissible_value(permissible_values, row['code'],
                                  title=row['class_'], description=row['description'])
    enum_dict = {
        "name":               label,
        "title":              title,
        "description":        attr_desc,
        "permissible_values": permissible_values,
    }
    return enum_key, enum_dict


def _fetch_fr_attr_pvs(attr_url_by_enum, schema_enums, indent="  "):
    """Fetch French permissible values for each enum in *attr_url_by_enum*.

    Parameters
    ----------
    attr_url_by_enum : dict
        ``{enum_key: english_attr_url}`` mapping built during the EN pass.
    schema_enums : dict
        The ``schema["enums"]`` dict, used to look up existing EN codes.
    indent : str
        Leading whitespace for progress/warning messages (default ``"  "``).

    Returns
    -------
    dict
        ``{enum_key: {code: {text, title?, description?}}}``
    """
    fr_enums_pvs = {}
    for enum_key, attr_url in attr_url_by_enum.items():
        fr_attr_url = nsdb_fr_url(attr_url)
        try:
            print(f"{indent}Fetching French attr page {fr_attr_url} ...")
            fr_attr_html = fetch_html(fr_attr_url)
            _, _, _, fr_pv_tables = parse_attribute_page(fr_attr_html)
            en_codes = set(schema_enums[enum_key].get("permissible_values") or {})
            fr_pvs = {}
            for rows in fr_pv_tables:
                for row in rows:
                    code = row['code']
                    if code in en_codes:
                        add_permissible_value(fr_pvs, code,
                                              title=row['class_'], description=row['description'])
            if fr_pvs:
                fr_enums_pvs[enum_key] = fr_pvs
                print(f"{indent}French: {len(fr_pvs)} translations for {enum_key}")
        except Exception as e:
            print(f"{indent}Warning: French attr fetch failed for {enum_key}: {e}",
                  file=sys.stderr)
    return fr_enums_pvs


def _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description):
    """Attach fr_locale extensions to *schema*, write YAML, and print a summary.

    If either *fr_enums_pvs* or *fr_description* is non-empty the function
    builds a ``extensions.locales.value.fr`` block and attaches it to *schema*
    before writing.
    """
    if fr_enums_pvs or fr_description:
        schema["extensions"] = _make_locale_extensions(
            nsdb_fr_url(base_url), key, source.get("version") or "", "fr",
            description=fr_description or None,
            enums={ek: {"permissible_values": pvs} for ek, pvs in fr_enums_pvs.items()} if fr_enums_pvs else None,
        )
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    fr_parts = []
    if fr_description:
        fr_parts.append("description")
    if fr_enums_pvs:
        n = sum(len(pvs) for pvs in fr_enums_pvs.values())
        fr_parts.append(f"{len(fr_enums_pvs)} enums / {n} pvs")
    print(f"Updated {yaml_path}"
          + (f" (French: {', '.join(fr_parts)})" if fr_parts else ""))


def _fetch_and_build_enums(attr_links, schema_enums, enum_prefix, indent="  "):
    """Fetch each attribute URL, build its enum, populate *schema_enums* in-place.

    Parameters
    ----------
    attr_links : list of (name, url)
        Attribute links from find_contents_table_links.
    schema_enums : dict
        The ``schema["enums"]`` dict to populate in-place.
    enum_prefix : str
        Prefix for the enum key, e.g. ``"NSDB"`` or ``"NSDBSLC"``.
    indent : str
        Leading whitespace for progress/warning messages (default ``"  "``).

    Returns
    -------
    dict
        ``{enum_key: attr_url}`` for qualifying enums, used by _fetch_fr_attr_pvs.
    """
    attr_url_by_enum = {}
    for attr_name, attr_url in attr_links:
        try:
            attr_html = fetch_html(attr_url)
        except Exception as e:
            print(f"{indent}Error fetching {attr_url}: {e}", file=sys.stderr)
            continue
        enum_key, enum_dict = _build_nsdb_enum(attr_html, enum_prefix)
        if enum_key is None:
            continue
        schema_enums[enum_key] = enum_dict
        attr_url_by_enum[enum_key] = attr_url
        print(f"{indent}Added enum {enum_key} ({len(enum_dict['permissible_values'])} values)")
    return attr_url_by_enum


def process_nsdb_html_source(key, source, enum_prefix, locales=None):
    """Build a LinkML enum YAML for an NSDB HTML source.

    Supports three URL forms for source_ontology, detected by page content:

    * SLC index page — page contains "SLC attribute tables" or "Ecological
      Framework Tables" sections.  Two-level processing: for each component
      follows attribute links to individual attribute pages.
    * Component / index page — page has a Contents table of attribute links
      but no SLC-specific sections.  One-level processing.
    * Single attribute page — no Contents table.  Parses the page directly
      and writes a single enum.

    In all cases also fetches French equivalents via nsdb_fr_url() and writes
    extensions.locales.value.fr when French content is found.

    Parameters
    ----------
    enum_prefix : str
        Prefix for enum keys, e.g. ``"NSDB"`` for SNT/SLT sources or
        ``"NSDBSLC"`` for SLC sources.
    """
    yaml_path = f"sources/{key}.yaml"
    base_url  = (source.get("reachable_from") or {}).get("source_ontology", "")
    html_path = f"sources/{key}.html"

    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            schema = yaml.safe_load(f) or {}
    else:
        schema = make_config_schema(id=base_url, name=key, title=source.get("title", ""),
                             description=source.get("description", ""),
                             version=source.get("version", ""))
    schema["enums"] = {}
    schema.pop("extensions", None)

    with open(html_path, encoding="utf-8", errors="replace") as f:
        page_html = f.read()

    # Default description from first <p>
    p_m = re.search(r'<p[^>]*>(.*?)</p>', page_html, re.IGNORECASE | re.DOTALL)
    schema["description"] = _strip_tags(p_m.group(1)).strip() if p_m else source.get("description", "")

    fr_enums_pvs = {}
    fr_description = ""

    # ---- Detect page type by content ----------------------------------------
    # SLC index pages contain named sections; all other NSDB pages do not.
    _slc_sections = ["SLC attribute tables", "Ecological Framework Tables"]
    component_links = []
    for _sect in _slc_sections:
        _links = find_list_section_links(page_html, _sect, base_url)
        if _links:
            print(f"  Section '{_sect}': {len(_links)} links")
        component_links.extend(_links)

    if component_links:
        # ---- SLC index: two-level component → attribute processing ----------
        for comp_name, comp_url in component_links:
            print(f"  Processing component '{comp_name}' ...")
            try:
                comp_html = fetch_html(comp_url)
            except Exception as e:
                print(f"  Error fetching {comp_url}: {e}", file=sys.stderr)
                continue

            comp_desc = find_section_paragraph(comp_html, "Description")
            if comp_desc:
                existing = schema.get("description", "")
                schema["description"] = (existing + "\n" + comp_desc).strip() if existing else comp_desc

            attr_links = find_contents_table_links(comp_html, comp_url)
            print(f"    Found {len(attr_links)} attribute links")

            if "fr" in (locales or ["en"]):
                fr_comp_url = nsdb_fr_url(comp_url)
                try:
                    print(f"    Fetching French component page {fr_comp_url} ...")
                    fr_comp_html = fetch_html(fr_comp_url)
                    fr_desc = find_section_paragraph(fr_comp_html, "Description")
                    if fr_desc:
                        fr_description = (fr_description + "\n" + fr_desc).strip() if fr_description else fr_desc
                except Exception as e:
                    print(f"    Warning: French component page fetch failed: {e}", file=sys.stderr)

            attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], enum_prefix, indent="    ")
            if "fr" in (locales or ["en"]):
                fr_enums_pvs.update(_fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="    "))

    else:
        # ---- Component/index page or direct attribute page ------------------
        attr_links = find_contents_table_links(page_html, base_url)

        if attr_links:
            # ---- Has Contents table: process attribute links ----------------
            print(f"  Found {len(attr_links)} attribute links")

            # Try dcterms.title (SNT/SLT index pages carry this)
            _meta_m = re.search(
                r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
                page_html, re.IGNORECASE)
            if not _meta_m:
                _meta_m = re.search(
                    r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
                    page_html, re.IGNORECASE)
            if _meta_m:
                schema["title"] = _meta_m.group(1).strip()

            desc = find_section_paragraph(page_html, "Description")
            if desc:
                schema["description"] = desc

            if "fr" in (locales or ["en"]):
                fr_page_url = nsdb_fr_url(base_url)
                try:
                    print(f"  Fetching French page {fr_page_url} ...")
                    fr_page_html = fetch_html(fr_page_url)
                    fr_description = find_section_paragraph(fr_page_html, "Description") or ""
                except Exception as e:
                    print(f"  Warning: French page fetch failed: {e}", file=sys.stderr)

            attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], enum_prefix, indent="  ")
            if "fr" in (locales or ["en"]):
                fr_enums_pvs = _fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="  ")

        else:
            # ---- Direct attribute page: one enum ----------------------------
            enum_key, enum_dict = _build_nsdb_enum(page_html, enum_prefix, require_qualifying=False)
            if enum_key is None:
                print(f"  Warning: could not parse attribute label from {html_path}", file=sys.stderr)
                return
            schema["enums"][enum_key] = enum_dict
            schema["description"] = source.get("description") or enum_dict["description"]
            print(f"  Added enum {enum_key} ({len(enum_dict['permissible_values'])} values)")

            if "fr" in (locales or ["en"]):
                fr_url = nsdb_fr_url(base_url)
                try:
                    print(f"  Fetching French attr page {fr_url} ...")
                    fr_html = fetch_html(fr_url)
                    _, _, fr_description, fr_pv_tables = parse_attribute_page(fr_html)
                    en_codes = set(enum_dict["permissible_values"])
                    fr_pvs = {}
                    for rows in fr_pv_tables:
                        for row in rows:
                            code = row['code']
                            if code in en_codes:
                                add_permissible_value(fr_pvs, code,
                                                      title=row['class_'], description=row['description'])
                    if fr_pvs:
                        fr_enums_pvs[enum_key] = fr_pvs
                except Exception as e:
                    print(f"  Warning: French attr page fetch failed: {e}", file=sys.stderr)

    _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description)


def process_nsdb_source(key, source, locales=None):
    """Build a combined LinkML enum YAML by merging SNT and SLT enums.

    Fetches the NSDB index page (source_ontology), finds the "Soil Name Table"
    and "Soil Layer Table" component links, and for each processes all
    attribute pages using the shared NSDB helpers.
    """
    yaml_path = f"sources/{key}.yaml"
    base_url = (source.get("reachable_from") or {}).get("source_ontology", "")

    if os.path.exists(yaml_path):
        with open(yaml_path) as f:
            schema = yaml.safe_load(f) or {}
    else:
        schema = make_config_schema(id=base_url, name=key, title=source.get("title", ""),
                             description=source.get("description", ""),
                             version=source.get("version", ""))
    # Reset description, enums, and extensions before each run so repeated -c invocations
    # are idempotent.
    schema["description"] = source.get("description", "")
    schema["enums"] = {}
    schema.pop("extensions", None)

    print(f"  Fetching NSDB index {base_url} ...")
    try:
        index_html = fetch_html(base_url)
    except Exception as e:
        print(f"  Error fetching {base_url}: {e}", file=sys.stderr)
        return

    table_links = find_links_by_text(index_html, ["Soil Name Table", "Soil Layer Table"], base_url)
    if not table_links:
        print(f"  Warning: 'Soil Name Table' / 'Soil Layer Table' links not found", file=sys.stderr)

    fr_enums_pvs = {}
    fr_description = ""

    for table_name, table_url in table_links.items():
        print(f"  Processing '{table_name}' ...")
        try:
            table_html = fetch_html(table_url)
        except Exception as e:
            print(f"  Error fetching {table_url}: {e}", file=sys.stderr)
            continue

        desc = find_section_paragraph(table_html, "Description")
        if desc:
            existing = schema.get("description", "")
            schema["description"] = (existing + "\n" + desc).strip() if existing else desc

        attr_links = find_contents_table_links(table_html, table_url)
        print(f"    Found {len(attr_links)} attribute links")

        if "fr" in (locales or ["en"]):
            # French table description
            fr_table_url = nsdb_fr_url(table_url)
            try:
                print(f"    Fetching French table page {fr_table_url} ...")
                fr_table_html = fetch_html(fr_table_url)
                fr_desc = find_section_paragraph(fr_table_html, "Description")
                if fr_desc:
                    fr_description = (fr_description + "\n" + fr_desc).strip() if fr_description else fr_desc
            except Exception as e:
                print(f"    Warning: French table page fetch failed: {e}", file=sys.stderr)

        attr_url_by_enum = _fetch_and_build_enums(attr_links, schema["enums"], "NSDB", indent="    ")
        if "fr" in (locales or ["en"]):
            fr_enums_pvs.update(_fetch_fr_attr_pvs(attr_url_by_enum, schema["enums"], indent="    "))

    _write_nsdb_yaml(schema, yaml_path, base_url, key, source, fr_enums_pvs, fr_description)


def _nsdb_meta_title(html_text, fallback):
    """Extract dcterms.title from HTML meta tag, or return fallback."""
    m = re.search(
        r'<meta\s[^>]*name=["\']dcterms\.title["\'][^>]*content=["\']([^"\']+)["\']',
        html_text, re.IGNORECASE)
    if not m:
        m = re.search(
            r'<meta\s[^>]*content=["\']([^"\']+)["\'][^>]*name=["\']dcterms\.title["\']',
            html_text, re.IGNORECASE)
    return m.group(1).strip() if m else fallback


def match_nsdb_snt(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is an NSDB SNT page and was handled."""
    if not (url.startswith("https://sis.agr.gc.ca/cansis/nsdb/") and "/snt/" in url):
        return False

    url_no_query = url.split("?")[0]
    ver_m = re.search(r'/nsdb/[^/]+/([^/]+)/snt/', url_no_query)
    version = re.sub(r'^[vV]', '', ver_m.group(1)) if ver_m else ""

    with open(tmp_path, encoding="utf-8", errors="replace") as f:
        html_text = f.read()

    is_index = url_no_query.rstrip("/").endswith("/index.html")
    if is_index:
        title = _nsdb_meta_title(html_text, "NSDB Soil Name Table")
        desc  = find_section_paragraph(html_text, "Description")
        ver_key = version.replace(".", "_") if version else ""
        key = f"NSDBSNTv{ver_key}" if ver_key else "NSDBSNT"
    else:
        label, title, desc, _ = parse_attribute_page(html_text)
        if not label:
            print(f"  Warning: could not parse attribute label from {url} — skipping",
                  file=sys.stderr)
            os.unlink(tmp_path)
            return True
        key = f"NSDBSNT_{label}"

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

    entry = make_source_entry(key, url, "NSDBSNT", "html",
                              title=title, version=version, description=desc)
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    if is_index:
        yaml_path = f"sources/{key}.yaml"
        schema = make_config_schema(id=url, name=key, title=title,
                                    description=desc, version=version)
        with open(yaml_path, "w") as f:
            yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
        print(f"Created {yaml_path}")
    else:
        locales = config.get("locales", ["en"])
        process_nsdb_html_source(key, entry, enum_prefix="NSDB", locales=locales)
    return True


def match_nsdb_slt(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is an NSDB SLT page and was handled."""
    if not (url.startswith("https://sis.agr.gc.ca/cansis/nsdb/") and "/slt/" in url):
        return False

    url_no_query = url.split("?")[0]
    ver_m = re.search(r'/nsdb/[^/]+/([^/]+)/slt/', url_no_query)
    version = re.sub(r'^[vV]', '', ver_m.group(1)) if ver_m else ""

    with open(tmp_path, encoding="utf-8", errors="replace") as f:
        html_text = f.read()

    is_index = url_no_query.rstrip("/").endswith("/index.html")
    if is_index:
        title = _nsdb_meta_title(html_text, "NSDB Soil Layer Table")
        desc  = find_section_paragraph(html_text, "Description")
        ver_key = version.replace(".", "_") if version else ""
        key = f"NSDBSLTv{ver_key}" if ver_key else "NSDBSLT"
    else:
        label, title, desc, _ = parse_attribute_page(html_text)
        if not label:
            print(f"  Warning: could not parse attribute label from {url} — skipping",
                  file=sys.stderr)
            os.unlink(tmp_path)
            return True
        key = f"NSDBSLT_{label}"

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

    entry = make_source_entry(key, url, "NSDBSLT", "html",
                              title=title, version=version, description=desc)
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    if is_index:
        yaml_path = f"sources/{key}.yaml"
        schema = make_config_schema(id=url, name=key, title=title,
                                    description=desc, version=version)
        with open(yaml_path, "w") as f:
            yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
        print(f"Created {yaml_path}")
    else:
        locales = config.get("locales", ["en"])
        process_nsdb_html_source(key, entry, enum_prefix="NSDB", locales=locales)
    return True


def match_nsdb_soil(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is an NSDB Soil Name-and-Layer index page and was handled."""
    if not url.startswith("https://sis.agr.gc.ca/cansis/nsdb/soil"):
        return False

    url_no_query = url.split("?")[0].rstrip("/")
    parts = url_no_query.split("/")
    if "index.html" in parts:
        version_label = parts[parts.index("index.html") - 1]
        base_url = url_no_query[: url_no_query.rfind("/index.html") + 1]
    else:
        version_label = parts[-1]
        base_url = url_no_query + "/"
    version_num = re.sub(r"^[vV]", "", version_label)
    key = f"NSDBSoilNameAndLayerV{version_num}"

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

    entry = make_source_entry(
        key, url, "NSDB", "html",
        title="NSDB Soil Name and Layer Tables", version=version_label,
        description="This schema contains summary information for named soils within the Canadian soil surveys NSDB database")
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    yaml_path = f"sources/{key}.yaml"
    schema = make_config_schema(id=base_url, name=key, title=entry["title"],
                                description=entry["description"], license="CC0",
                                default_prefix="menu")
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Created {yaml_path}")
    return True


def match_nsdb_slc(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is an NSDB Soil Landscapes of Canada page and was handled."""
    if not ("sis.agr.gc.ca" in url and "/nsdb/slc/" in url):
        return False

    with open(tmp_path, encoding="utf-8", errors="replace") as f:
        html_text = f.read()

    slc_title = _nsdb_meta_title(html_text, "NSDB Soil Landscapes of Canada")
    ver_m = re.search(r'[Vv]ersion\s+([\d.]+)', slc_title)
    slc_version = ver_m.group(1) if ver_m else ""
    ver_key = slc_version.replace(".", "_") if slc_version else ""
    key = f"NSDBSLCv{ver_key}" if ver_key else "NSDBSLC"

    p_m = re.search(r'<p[^>]*>(.*?)</p>', html_text, re.IGNORECASE | re.DOTALL)
    slc_desc = strip_tags(p_m.group(1)).strip() if p_m else ""

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

    entry = make_source_entry(key, url, "NSDBSLC", "html",
                              title=slc_title, version=slc_version, description=slc_desc)
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    yaml_path = f"sources/{key}.yaml"
    schema = make_config_schema(id=url, name=key, title=slc_title,
                                description=slc_desc, version=slc_version)
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Created {yaml_path}")
    return True
