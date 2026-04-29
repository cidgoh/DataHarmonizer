"""AGROVOC OntologyAPI source helpers for menu_manager.py.

Provides SPARQL-based fetchers for AGROVOC concept hierarchies and labels.
All network communication goes through the AGROVOC SPARQL endpoint
(https://agrovoc.fao.org/sparql/ or as configured in menu_config.yaml).

Public API used by menu_manager.py:
    _fetch_agrovoc_graph(term_id, api_conf, locales)
    _fetch_agrovoc_sparql_graph(root_iri, sparql_uri, locales)
    _fetch_agrovoc_concept_info(concept_iri, sparql_uri, locales)
    match_agrovoc(url, config_file)
"""

import json
import sys
import urllib.parse
import yaml
from source_utils import MENU_CONFIG, make_source_entry, write_config, _get_type_conf
import urllib.request


# SPARQL query for fetching a full SKOS concept hierarchy rooted at {concept_iri}.
# {locale_values} is replaced with a VALUES literal like {'en' 'fr'}.
_AGROVOC_SPARQL_QUERY = """\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
SELECT ?concept ?label ?definition ?scopeNote ?broader ?deprecated
WHERE {
  VALUES ?concept_id { <{concept_iri}> }
  VALUES ?locale {locale_values}
  ?concept skos:broader* ?concept_id .
  ?concept a skos:Concept .
  ?concept skos:prefLabel ?label .
  FILTER(langMatches(lang(?label), ?locale))
  OPTIONAL { ?concept skos:broader ?broader }
  OPTIONAL { ?concept skos:definition ?definition .
    FILTER(langMatches(lang(?definition), ?locale)) }
  OPTIONAL { ?concept skos:scopeNote ?scopeNote .
    FILTER(langMatches(lang(?scopeNote), ?locale)) }
  OPTIONAL { ?concept owl:deprecated ?deprecated }
}
"""


# Lightweight query to fetch prefLabel and scopeNote for a single concept —
# used by add_source to populate the title/description config fields.
_AGROVOC_LABEL_QUERY = """\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?concept_id ?label ?definition ?scopeNote
WHERE {
  VALUES ?concept_id { <{concept_iri}> }
  VALUES ?locale {locale_values}
  ?concept_id a skos:Concept.
  ?concept_id skos:prefLabel ?label .
  FILTER(langMatches(lang(?label), ?locale))
  OPTIONAL {
    ?concept_id skos:definition ?definition.
    FILTER(langMatches(lang(?definition), ?locale))
  }
  OPTIONAL {
    ?concept_id skos:scopeNote ?scopeNote.
    FILTER(langMatches(lang(?scopeNote), ?locale))
  }
}
"""


def _fetch_agrovoc_concept_info(concept_iri, sparql_uri, locales=None):
    """Fetch skos:prefLabel and skos:scopeNote for a single AGROVOC concept IRI.

    Posts _AGROVOC_LABEL_QUERY to sparql_uri and returns a dict with
    'title' (prefLabel) and 'description' (scopeNote), preferring English
    over other requested locales.  Returns {} on error or no results.
    """
    locale_values = "{" + " ".join(f"'{l}'" for l in (locales or ["en"])) + "}"
    query = (_AGROVOC_LABEL_QUERY
             .replace("{concept_iri}", concept_iri)
             .replace("{locale_values}", locale_values))
    body = urllib.parse.urlencode({"query": query}).encode("utf-8")
    req  = urllib.request.Request(
        sparql_uri,
        data=body,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept":       "application/sparql-results+json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"    Warning: AGROVOC concept info fetch failed: {e}", file=sys.stderr)
        return {}

    title = ""
    description = ""
    for row in (data.get("results") or {}).get("bindings") or []:
        lang       = (row.get("label")     or {}).get("xml:lang") or ""
        label      = (row.get("label")     or {}).get("value")    or ""
        scope_note = (row.get("scopeNote") or {}).get("value")    or ""
        # Accept the first row; upgrade to English values when available
        if not title or lang == "en":
            if label:
                title = label
            if scope_note:
                description = scope_note

    return {"title": title, "description": description or None}


def _fetch_agrovoc_sparql_graph(root_iri, sparql_uri, locales=None):
    """POST a SKOS hierarchy query to *sparql_uri* and normalise the W3C SPARQL JSON
    result into {nodes: [{iri, label, definition, deprecated}], edges: [{source, target, label}]}.

    locales: list of language codes to request (e.g. ['en'] or ['en', 'fr']).
             Defaults to ['en'] when None.
    Returns None on HTTP or parse error.
    """
    locale_values = "{" + " ".join(f"'{l}'" for l in (locales or ["en"])) + "}"
    query = (_AGROVOC_SPARQL_QUERY
             .replace("{concept_iri}", root_iri)
             .replace("{locale_values}", locale_values))
    body = urllib.parse.urlencode({"query": query}).encode("utf-8")
    req = urllib.request.Request(
        sparql_uri,
        data=body,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/sparql-results+json",
        },
    )
    try:
        print(f"    Fetching AGROVOC SPARQL graph: {root_iri} ...")
        with urllib.request.urlopen(req, timeout=60) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"    Warning: AGROVOC SPARQL fetch failed: {e}", file=sys.stderr)
        return None

    # Group bindings by concept IRI; prefer English over other locales
    concepts = {}   # iri -> {label, definition, deprecated}
    edges_set = {}  # (src_iri, tgt_iri) -> True  (dedup)
    for row in (data.get("results") or {}).get("bindings") or []:
        iri = (row.get("concept") or {}).get("value") or ""
        if not iri:
            continue
        lang = (row.get("label") or {}).get("xml:lang") or ""
        label = (row.get("label") or {}).get("value") or ""
        definition = ((row.get("definition") or row.get("scopeNote") or {}).get("value") or "")
        deprecated = (row.get("deprecated") or {}).get("value") == "true"

        if iri not in concepts:
            concepts[iri] = {"label": label, "definition": definition, "deprecated": deprecated}
        else:
            existing = concepts[iri]
            # Upgrade to English values when available
            if lang == "en":
                if label:
                    existing["label"] = label
                if definition:
                    existing["definition"] = definition
            if deprecated:
                existing["deprecated"] = True

        broader_iri = (row.get("broader") or {}).get("value") or ""
        if broader_iri:
            edges_set[(iri, broader_iri)] = True

    nodes = [{"iri": iri, "label": info["label"], "definition": info["definition"],
               "deprecated": info["deprecated"]}
             for iri, info in concepts.items()]
    edges = [{"source": src, "target": tgt, "label": "subClassOf"}
             for src, tgt in edges_set]
    return {"nodes": nodes, "edges": edges}


def _fetch_agrovoc_graph(term_id, api_conf, locales=None):
    """Fetch the AGROVOC SKOS hierarchy for *term_id* via SPARQL.

    Constructs the AGROVOC IRI (http://aims.fao.org/aos/agrovoc/{term_id}),
    reads the sparql uri from api_conf type.sparql, and delegates to
    _fetch_agrovoc_sparql_graph.  Returns None if no sparql uri is configured.
    """
    root_iri = f"http://aims.fao.org/aos/agrovoc/{term_id}"
    sparql_uri = _get_type_conf(api_conf, "sparql").get("uri")
    if not sparql_uri:
        print("Warning: agrovoc api requires a sparql type uri", file=sys.stderr)
        return None
    return _fetch_agrovoc_sparql_graph(root_iri, sparql_uri, locales=locales)


def match_agrovoc(url, config_file=MENU_CONFIG):
    """Return True if *url* is an AGROVOC concept IRI or shorthand key and was handled.

    Accepted forms:
      https://aims.fao.org/aos/agrovoc/{term_id}   (full IRI)
      AGROVOC_{term_id}                             (source key shorthand)

    Adds the source entry to config_file without downloading anything (the
    concept IRI server returns 403; all required info comes from the term ID
    and the configured SPARQL endpoint).
    """
    import re as _re
    m = _re.match(r'(?:https?://aims\.fao\.org/aos/agrovoc/|AGROVOC_)(.+)', url)
    if not m:
        return False

    term_id = m.group(1).strip("/")
    key = f"AGROVOC_{term_id}"

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        return True

    concept_iri = f"http://aims.fao.org/aos/agrovoc/{term_id}"
    _api_conf   = (config.get("apis") or {}).get("agrovoc") or {}
    _sparql_uri = _get_type_conf(_api_conf, "sparql").get("uri")
    _locales    = config.get("locales") or ["en"]
    _info       = {}
    if _sparql_uri:
        print(f"  Fetching AGROVOC concept info for {concept_iri} ...")
        _info = _fetch_agrovoc_concept_info(concept_iri, _sparql_uri, locales=_locales)
    _title       = _info.get("title") or key
    _description = _info.get("description")
    entry = make_source_entry(key, url, "OntologyAPI", "json",
                              title=_title, description=_description)
    entry["prefixes"] = {"agrovoc": "http://aims.fao.org/aos/agrovoc/"}
    entry["reachable_from"] = {
        "api": {"agrovoc": {"type": "sparql"}},
        "source_nodes": [f"agrovoc:{term_id}"],
        "include_self": True,
    }
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")
    return True
