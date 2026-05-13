"""Statistics Canada (StatsCan) source helpers for menu_manager.py.

Provides HTML parsing utilities and processing functions for StatsCan IMDB
classification pages used by process_sources() and the add_source() detection
block.

Public API used by menu_manager.py:
    statscan_fr_url(url)
    parse_statscan_definitions(html_text)
    parse_statscan_structure(html_text)
    process_statscan_source(key, source, config_file=None, locales=None)
    match_statscan(url, tmp_path, config_file)
"""

import html
import os
import re
import sys
import yaml
from source_utils import (
    strip_tags as _strip_tags,
    strip_tags,
    fetch_html,
    add_permissible_value,
    make_config_schema,
    _make_locale_extensions,
    IndentedDumper,
    make_source_entry,
    write_config,
    MENU_CONFIG,
)


def statscan_fr_url(url):
    """Return the French-language equivalent of a StatsCan IMDB page URL.

    StatsCan exposes French pages by inserting ``_f`` into the CGI script name,
    e.g. ``p3VD.pl`` → ``p3VD_f.pl``.  Works for all STATSCAN sub-pages
    (getVD, getVDStruct, display-definitions, CPV detail, etc.).
    """
    return re.sub(r'(?<=/)([\w]+)(\.pl)(?=\?)', r'\1_f\2', url)


def parse_statscan_definitions(html_text):
    """Parse a StatsCan 'Display definitions' page.

    Returns {code: definition_text} where each code is the alphanumeric identifier
    (e.g. '111') extracted from <h2 class="bg-def-1"> headings of the form
    'CODE - Name', and the definition is the text of the first <p> that follows.
    """
    definitions = {}
    # Work within the panel-body section
    panel_m = re.search(
        r'<div\b[^>]*\bpanel-body\b[^>]*>(.*?)(?=<div\b[^>]*\bpanel\b|$)',
        html_text, re.IGNORECASE | re.DOTALL)
    body = panel_m.group(1) if panel_m else html_text

    for h2_m in re.finditer(
            r'<h2\b[^>]*\bbg-def-1\b[^>]*>(.*?)</h2>(.*?)(?=<h2\b[^>]*\bbg-def-1\b|$)',
            body, re.IGNORECASE | re.DOTALL):
        heading_text = html.unescape(_strip_tags(h2_m.group(1))).strip()
        # Heading format: "CODE - Name" or "CODE Name"
        code_m = re.match(r'^(\S+)', heading_text)
        if not code_m:
            continue
        code = code_m.group(1)
        after = h2_m.group(2)
        p_m = re.search(r'<p\b[^>]*>(.*?)</p>', after, re.IGNORECASE | re.DOTALL)
        if p_m:
            definition = html.unescape(_strip_tags(p_m.group(1))).strip()
            if definition:
                definitions[code] = definition
    return definitions


def parse_statscan_structure(html_text):
    """Parse a StatsCan 'Display structure' page.

    Returns an ordered list of (code, name, indent_level) tuples extracted from
    <li class="list-group-item indent-N"> items inside the panel-body <ul>.
    indent_level is 1-based (1 = top of this subtree).
    """
    items = []
    panel_m = re.search(
        r'<div\b[^>]*\bpanel-body\b[^>]*>(.*?)(?=<div\b[^>]*class=["\'][^"\']*(?:panel|footer)|$)',
        html_text, re.IGNORECASE | re.DOTALL)
    body = panel_m.group(1) if panel_m else html_text

    ul_m = re.search(r'<ul\b[^>]*\blist-group\b[^>]*>(.*?)(?=</ul>|$)', body, re.IGNORECASE | re.DOTALL)
    if not ul_m:
        return items
    ul_html = ul_m.group(1)

    # Some <li> items lack a closing </li>; capture up to the next <li> or end
    for li_m in re.finditer(
            r'<li\b[^>]*\bindent-(\d+)[^>]*>(.*?)(?=<li\b|$)',
            ul_html, re.IGNORECASE | re.DOTALL):
        indent = int(li_m.group(1))
        content = li_m.group(2)
        # Prefer <a> link text, fall back to plain text content
        a_m = re.search(r'<a\b[^>]*>(.*?)</a>', content, re.IGNORECASE | re.DOTALL)
        raw_text = html.unescape(_strip_tags(a_m.group(1) if a_m else content)).strip()
        # Format is "CODE - Name" or "CODE Name"
        sep_m = re.match(r'^(\S+)\s*[-\u2013]\s*(.*)', raw_text)
        if sep_m:
            code, name = sep_m.group(1), sep_m.group(2).strip()
        else:
            parts = raw_text.split(None, 1)
            code, name = parts[0], (parts[1] if len(parts) > 1 else "")
        if code:
            items.append((code, name, indent))
    return items


# ---------------------------------------------------------------------------
# Processing function (called from menu_manager.process_sources)
# ---------------------------------------------------------------------------

def process_statscan_source(key, source, config_file=None, locales=None):
    """Build a LinkML enum YAML for a STATSCAN source.

    Reads sources/{key}.html (the main variable definition page).  For each
    top-level classification code linked from that page it:
      1. Fetches the code's detail page.
      2. Fetches the 'Display structure' page → builds the full code hierarchy.
      3. Fetches the 'Display definitions' page → collects code definitions.

    Also fetches the source-level 'Display definitions' page for top-level
    code definitions.

    For codes that appear in the source page table without a hyperlink (i.e.
    leaf codes with no child entries), a permissible_value is created directly
    from the table row: the Code column provides the code and the Category (or
    Group/Class) column provides the title.  Definitions for these codes are
    taken from the source-level 'Display definitions' page.

    Writes sources/{key}.yaml with a single enum whose permissible_values carry
    name, title, optional description, and is_a.
    """
    html_path = f"sources/{key}.html"
    with open(html_path) as f:
        source_html = f.read()

    # ---- 1. Source-level Display definitions (top-level codes) ----------
    definitions = {}
    src_def_m = re.search(
        r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
        source_html, re.IGNORECASE)
    if src_def_m:
        src_def_url = html.unescape(src_def_m.group(1))
        try:
            print(f"  Fetching source-level definitions {src_def_url} ...")
            definitions.update(parse_statscan_definitions(fetch_html(src_def_url)))
        except Exception as e:
            print(f"  Warning: could not fetch source definitions: {e}", file=sys.stderr)

    # ---- 2. Find each top-level CPV link on the source page --------------
    # Links with CPV= parameter represent individual classification items
    seen_urls = set()
    cpv_urls = []
    for m in re.finditer(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;CPV=[^"\']+)["\']',
            source_html, re.IGNORECASE):
        url = html.unescape(m.group(1))
        if url not in seen_urls:
            seen_urls.add(url)
            cpv_urls.append(url)

    # ---- 2b. Collect unlinked (leaf) codes directly from source table ---
    # Rows whose Code <th> has no <a> link are flat leaf codes; their title
    # comes from the Category/Group column and descriptions come from the
    # source-level definitions dict (already populated in step 1).
    permissible_values = {}
    table_m = re.search(r'<table\b[^>]*>(.*?)</table>', source_html, re.IGNORECASE | re.DOTALL)
    if table_m:
        cat_td_index = 0  # index into the <td> cells of a data row (default: first)
        # Identify the Category/Group column from the header row
        header_m = (
            re.search(r'<thead\b[^>]*>(.*?)</thead>', table_m.group(1), re.IGNORECASE | re.DOTALL)
            or re.search(r'<tr\b[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        )
        if header_m:
            header_cells = re.findall(
                r'<t[hd]\b[^>]*>(.*?)</t[hd]>', header_m.group(1), re.IGNORECASE | re.DOTALL)
            for i, cell in enumerate(header_cells[1:], start=1):  # skip first (Code) column
                cell_text = html.unescape(strip_tags(cell)).strip().lower()
                if any(w in cell_text for w in ('category', 'group', 'class', 'name')):
                    cat_td_index = i - 1  # data rows: td index = header index minus the th cell
                    break
        data_rows = re.findall(r'<tr\b[^>]*>(.*?)</tr>', table_m.group(1), re.IGNORECASE | re.DOTALL)
        for row_html in data_rows[1:]:  # skip header row
            th_m = re.search(r'<th\b[^>]*>(.*?)</th>', row_html, re.IGNORECASE | re.DOTALL)
            if not th_m:
                continue
            th_content = th_m.group(1)
            if re.search(r'<a\b', th_content, re.IGNORECASE):
                continue  # linked code — handled via CPV urls in step 3
            code = html.unescape(strip_tags(th_content)).strip()
            if not code:
                continue
            td_cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
            title = ""
            if td_cells:
                idx = cat_td_index if cat_td_index < len(td_cells) else 0
                title = html.unescape(strip_tags(td_cells[idx])).strip()
            add_permissible_value(permissible_values, code, title=title)
            print(f"  Unlinked code: {code!r} title={title!r}")

    # ---- 3. For each CPV page: fetch structure + definitions -------------
    for cpv_url in cpv_urls:
        print(f"  Fetching CPV page {cpv_url} ...")
        try:
            cpv_html = fetch_html(cpv_url)
        except Exception as e:
            print(f"  Warning: could not fetch {cpv_url}: {e}", file=sys.stderr)
            continue

        # Display structure link  (Function=getVDStruct)
        struct_m = re.search(
            r'href=["\']([^"\']*Function=getVDStruct[^"\']*)["\']',
            cpv_html, re.IGNORECASE)
        if struct_m:
            struct_url = html.unescape(struct_m.group(1))
            try:
                print(f"    Fetching structure {struct_url} ...")
                struct_items = parse_statscan_structure(fetch_html(struct_url))
                # Build permissible_values from the ordered (code, name, indent) list
                processed = []  # [(code, indent)] for is_a lookup
                for code, title, indent in struct_items:
                    is_a = None
                    if indent > 1:
                        for prev_code, prev_indent in reversed(processed):
                            if prev_indent == indent - 1:
                                is_a = prev_code
                                break
                    processed.append((code, indent))
                    add_permissible_value(permissible_values, code, title=title, is_a=is_a)
            except Exception as e:
                print(f"    Warning: structure fetch failed: {e}", file=sys.stderr)

        # Display definitions link (D=1 on the CPV page)
        def_m = re.search(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
            cpv_html, re.IGNORECASE)
        if def_m:
            def_url = html.unescape(def_m.group(1))
            try:
                print(f"    Fetching definitions {def_url} ...")
                definitions.update(parse_statscan_definitions(fetch_html(def_url)))
            except Exception as e:
                print(f"    Warning: definitions fetch failed: {e}", file=sys.stderr)

    # ---- 4. Merge definitions into permissible_values -------------------
    for code, entry in permissible_values.items():
        if code in definitions:
            entry["description"] = definitions[code]

    # ---- 5. Build French permissible_values from sources/{key}_fr.html --
    fr_permissible_values = {}
    fr_definitions = {}
    fr_html_path = f"sources/{key}_fr.html"

    if "fr" in (locales or ["en"]) and os.path.exists(fr_html_path):
        with open(fr_html_path) as f:
            fr_source_html = f.read()

        # French source-level definitions
        src_def_m = re.search(
            r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
            fr_source_html, re.IGNORECASE)
        if src_def_m:
            fr_src_def_url = html.unescape(src_def_m.group(1))
            try:
                print(f"  Fetching French source definitions {fr_src_def_url} ...")
                fr_definitions.update(parse_statscan_definitions(fetch_html(fr_src_def_url)))
            except Exception as e:
                print(f"  Warning: could not fetch French source definitions: {e}", file=sys.stderr)

        # French unlinked codes from the French source table
        fr_table_m = re.search(r'<table\b[^>]*>(.*?)</table>', fr_source_html, re.IGNORECASE | re.DOTALL)
        if fr_table_m:
            cat_td_index = 0
            header_m = (
                re.search(r'<thead\b[^>]*>(.*?)</thead>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
                or re.search(r'<tr\b[^>]*>(.*?)</tr>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
            )
            if header_m:
                header_cells = re.findall(
                    r'<t[hd]\b[^>]*>(.*?)</t[hd]>', header_m.group(1), re.IGNORECASE | re.DOTALL)
                for i, cell in enumerate(header_cells[1:], start=1):
                    cell_text = html.unescape(strip_tags(cell)).strip().lower()
                    if any(w in cell_text for w in ('catégorie', 'category', 'groupe', 'group',
                                                     'classe', 'class', 'nom', 'name')):
                        cat_td_index = i - 1
                        break
            fr_data_rows = re.findall(
                r'<tr\b[^>]*>(.*?)</tr>', fr_table_m.group(1), re.IGNORECASE | re.DOTALL)
            for row_html in fr_data_rows[1:]:
                th_m = re.search(r'<th\b[^>]*>(.*?)</th>', row_html, re.IGNORECASE | re.DOTALL)
                if not th_m or re.search(r'<a\b', th_m.group(1), re.IGNORECASE):
                    continue
                code = html.unescape(strip_tags(th_m.group(1))).strip()
                if not code:
                    continue
                td_cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row_html, re.IGNORECASE | re.DOTALL)
                title = ""
                if td_cells:
                    idx = cat_td_index if cat_td_index < len(td_cells) else 0
                    title = html.unescape(strip_tags(td_cells[idx])).strip()
                add_permissible_value(fr_permissible_values, code, title=title)

        # French CPV pages — convert each English CPV URL to its French equivalent
        for cpv_url in cpv_urls:
            fr_cpv_url = statscan_fr_url(cpv_url)
            print(f"  Fetching French CPV page {fr_cpv_url} ...")
            try:
                fr_cpv_html = fetch_html(fr_cpv_url)
            except Exception as e:
                print(f"  Warning: could not fetch French CPV {fr_cpv_url}: {e}", file=sys.stderr)
                continue

            struct_m = re.search(
                r'href=["\']([^"\']*Function=getVDStruct[^"\']*)["\']',
                fr_cpv_html, re.IGNORECASE)
            if struct_m:
                fr_struct_url = html.unescape(struct_m.group(1))
                try:
                    print(f"    Fetching French structure {fr_struct_url} ...")
                    fr_struct_items = parse_statscan_structure(fetch_html(fr_struct_url))
                    for code, title, indent in fr_struct_items:
                        add_permissible_value(fr_permissible_values, code, title=title)
                except Exception as e:
                    print(f"    Warning: French structure fetch failed: {e}", file=sys.stderr)

            def_m = re.search(
                r'href=["\']([^"\']*Function=getVD[^"\']*&amp;D=1[^"\']*)["\']',
                fr_cpv_html, re.IGNORECASE)
            if def_m:
                fr_def_url = html.unescape(def_m.group(1))
                try:
                    print(f"    Fetching French definitions {fr_def_url} ...")
                    fr_definitions.update(parse_statscan_definitions(fetch_html(fr_def_url)))
                except Exception as e:
                    print(f"    Warning: French definitions fetch failed: {e}", file=sys.stderr)

        # Merge French definitions into fr_permissible_values
        for code, fr_entry in fr_permissible_values.items():
            if code in fr_definitions:
                fr_entry["description"] = fr_definitions[code]

    # ---- 6. Write YAML --------------------------------------------------
    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")
    schema = make_config_schema(
        id=source_url, name=key, title=source.get("title", ""),
        description=source.get("description", ""), version=source.get("version", ""),
        prefixes={"statscan": "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD="},
        enums={key: {
            "name":               key,
            "description":        source.get("description", ""),
            "permissible_values": permissible_values,
        }},
    )

    if fr_permissible_values:
        schema["extensions"] = _make_locale_extensions(
            statscan_fr_url(source_url), key, source.get("version") or "", "fr",
            enums={key: {"permissible_values": fr_permissible_values}},
        )

    yaml_path = f"sources/{key}.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path}"
          + (f" ({len(fr_permissible_values)} French translations)" if fr_permissible_values else ""))


def match_statscan(url, tmp_path, config_file=MENU_CONFIG):
    """Return True if *url* is a Statistics Canada variable definition page and was handled.

    Matches URLs like:
      https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1441857
    """
    if not ("statcan.gc.ca" in url and "p3VD.pl" in url and "Function=getVD" in url):
        return False

    tvd_m = re.search(r'[?&]TVD=(\d+)', url)
    tvd_id = tvd_m.group(1) if tvd_m else "unknown"
    key = f"STATSCAN{tvd_id}"

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

    with open(output_path) as f:
        html_text = f.read()

    # Extract title from <meta name="dcterms.title" content="..."> (attr order varies)
    title = ""
    for meta_m in re.finditer(r'<meta\b([^>]*)>', html_text, re.IGNORECASE):
        attrs = meta_m.group(1)
        if re.search(r'\bname=["\']dcterms\.title["\']', attrs, re.IGNORECASE):
            content_m = re.search(r'\bcontent=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if content_m:
                title = content_m.group(1).strip()
                break
    if not title:
        title = f"StatsCan Variable {tvd_id}"

    version_m = re.search(r'\bversion\s+([A-Za-z0-9][A-Za-z0-9._-]*)', title, re.IGNORECASE)
    version = version_m.group(1) if version_m else None

    entry = make_source_entry(key, url, "STATSCAN", "html", title=title, version=version)
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    fr_html_path = f"sources/{key}_fr.html"
    try:
        print(f"  Fetching French source page {statscan_fr_url(url)} ...")
        with open(fr_html_path, "w", encoding="utf-8") as fr_f:
            fr_f.write(fetch_html(statscan_fr_url(url)))
        print(f"Saved to {fr_html_path}")
    except Exception as e:
        print(f"  Warning: could not fetch French source page: {e}", file=sys.stderr)
    return True
