"""OntologyAPI source helpers for menu_manager.py.

Provides API graph fetchers (OLS4, BioPortal) and LinkML YAML generation for
sources with content_type: OntologyAPI.  AGROVOC fetching is delegated to
source_agrovoc.py and routed through fetch_api_graph.

Public API used by menu_manager.py:
    iri_to_curie(iri, prefixes)
    resolve_ols4_iri_base(ontology, api_conf=None)
    get_ols4_inner_iri(ontology, term_id, apis=None)
    fetch_api_graph(ontology, term_id, apis=None, locales=None)
    process_skos_source(key, source, config_file=None, locales=None)
    match_snomed(url, config_file=MENU_CONFIG)
    match_ontology_term(url, config_file=MENU_CONFIG)
"""

import json
import re
import sys
import urllib.parse
import urllib.request
import yaml
from source_utils import (
    MENU_CONFIG,
    IndentedDumper,
    make_config_schema,
    make_source_entry,
    write_config,
    _get_type_conf,
)
from source_agrovoc import _fetch_agrovoc_graph

_OLS4_DEFAULT_URI = "http://www.ebi.ac.uk/ols4/api/ontologies/{ontology}/terms/{double_encoded}/graph"
_OBO_IRI_BASE_TEMPLATE = "http://purl.obolibrary.org/obo/{ontology}_"

# Per-session cache: ontology_key.lower() -> {"iri_base": str, "version": str|None}
_OLS4_META_CACHE = {}


def _fetch_ols4_ontology_meta(ontology, api_conf=None):
    """Query OLS4 /api/ontologies/{ontology} and return {"iri_base": str, "version": str|None}.

    iri_base is taken from config.baseUris[0]; version from config.versionIri
    (preferred, as it is a full IRI) falling back to config.version.  Both
    values are cached per ontology key for the lifetime of the process so only
    one HTTP request is made regardless of how many times the ontology is used.
    Returns {"iri_base": None, "version": None} on error.
    """
    cache_key = ontology.lower()
    if cache_key in _OLS4_META_CACHE:
        return _OLS4_META_CACHE[cache_key]

    rest_conf = _get_type_conf(api_conf, "rest")
    uri_template = rest_conf.get("uri") or _OLS4_DEFAULT_URI
    api_base = uri_template.split("/ontologies/")[0].rstrip("/")
    metadata_url = f"{api_base}/ontologies/{cache_key}"

    result = {"iri_base": None, "version": None}
    try:
        req = urllib.request.Request(metadata_url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        cfg = data.get("config") or {}
        base_uris = cfg.get("baseUris") or []
        if base_uris:
            result["iri_base"] = base_uris[0]
        result["version"] = cfg.get("versionIri") or cfg.get("version") or None
    except Exception as e:
        print(f"    Warning: OLS4 metadata lookup failed for {ontology}: {e}", file=sys.stderr)

    _OLS4_META_CACHE[cache_key] = result
    return result


def _fetch_ols4_term_info(ontology, concept_iri, api_conf=None):
    """Fetch label and description for a single term from OLS4.

    Queries /api/ontologies/{ontology}/terms/{double_encoded_iri} and returns
    {"label": str, "description": str}.  Both values are empty strings on error
    or when not present.  The description is taken from the 'description' field
    (an array — first element used) which OLS4 maps from the ontology's
    definition annotations.
    Uses the same double-percent-encoding required by the OLS4 terms endpoint.
    """
    rest_conf = _get_type_conf(api_conf, "rest")
    uri_template = rest_conf.get("uri") or _OLS4_DEFAULT_URI
    api_base = uri_template.split("/ontologies/")[0].rstrip("/")
    single_encoded = urllib.parse.quote(concept_iri, safe="")
    double_encoded = single_encoded.replace("%", "%25")
    term_url = f"{api_base}/ontologies/{ontology.lower()}/terms/{double_encoded}"
    try:
        req = urllib.request.Request(term_url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        label = data.get("label") or ""
        raw_desc = data.get("description") or []
        description = (raw_desc[0] if isinstance(raw_desc, list) else raw_desc) or ""
        return {"label": label, "description": description}
    except Exception as e:
        print(f"    Warning: OLS4 term info fetch failed for {concept_iri}: {e}", file=sys.stderr)
        return {"label": "", "description": ""}


def resolve_ols4_iri_base(ontology, api_conf=None):
    """Return the IRI base string used to construct term IRIs for *ontology* in OLS4.

    Priority:
      1. Explicit ``iri_base`` key in api_conf type.rest (manual override).
      2. OLS4 ontology metadata (config.baseUris[0]) via _fetch_ols4_ontology_meta,
         cached per ontology for the lifetime of the process.
      3. OBO convention fallback: ``http://purl.obolibrary.org/obo/{ONTOLOGY}_``

    The returned string is intended to be concatenated directly with the local
    term identifier:  ``iri_base + term_id``  →  full term IRI.

    Examples:
      ENVO   →  "http://purl.obolibrary.org/obo/ENVO_"   (OBO convention)
      SNOMED →  "http://snomed.info/id/"                  (from OLS4 metadata)
    """
    rest_conf = _get_type_conf(api_conf, "rest")
    explicit = rest_conf.get("iri_base")
    if explicit:
        return explicit
    meta = _fetch_ols4_ontology_meta(ontology, api_conf)
    return meta["iri_base"] or _OBO_IRI_BASE_TEMPLATE.format(ontology=ontology.upper())


def get_ols4_inner_iri(ontology, term_id, apis=None):
    """Return the full IRI for *ontology*:*term_id*, routing via the apis dict.

    Finds the api_conf for *ontology* in *apis* (skipping bioportal/agrovoc),
    then delegates to resolve_ols4_iri_base.  Used by expand_reachable_from
    to compute the correct root/ancestor IRI for skip_iris without duplicating
    the routing logic from fetch_api_graph.
    """
    apis = apis or {}
    api_conf = None
    for name, conf in apis.items():
        if ontology.upper() in [o.upper() for o in (conf.get("ontologies") or [])]:
            if name not in ("bioportal", "agrovoc"):
                api_conf = conf
            break
    return resolve_ols4_iri_base(ontology, api_conf) + term_id


def iri_to_curie(iri, prefixes):
    """Convert an IRI to a CURIE using the given prefixes dict.

    Tries the OBO convention first (http://purl.obolibrary.org/obo/PREFIX_ID →
    PREFIX:ID), then falls back to matching against each prefix URI.
    Returns the original IRI unchanged if no conversion is found.
    """
    import re
    obo_match = re.match(r"http://purl\.obolibrary\.org/obo/([A-Za-z]+)_(\w+)$", iri)
    if obo_match:
        return f"{obo_match.group(1)}:{obo_match.group(2)}"
    if prefixes:
        for prefix, uri in sorted(prefixes.items(), key=lambda x: len(x[1]), reverse=True):
            if uri and iri.startswith(uri):
                return f"{prefix}:{iri[len(uri):]}"
    return iri


def _fetch_ols4_graph(ontology, term_id, api_conf=None):
    """Fetch the OLS4 /graph endpoint for a term.

    The OLS4 API requires the term IRI to be double-percent-encoded in the path.
    api_conf may supply a full URL template via type.rest.uri with {ontology} and
    {double_encoded} placeholders; if the URI is a plain base URL the standard path
    is appended automatically.
    Returns the raw OLS4 JSON dict {nodes, edges} or None on error.
    """
    rest_conf = _get_type_conf(api_conf, "rest")
    uri_template = rest_conf.get("uri") or _OLS4_DEFAULT_URI
    inner_iri = resolve_ols4_iri_base(ontology, api_conf) + term_id
    single_encoded = urllib.parse.quote(inner_iri, safe="")
    double_encoded = single_encoded.replace("%", "%25")
    if "{ontology}" in uri_template:
        url = uri_template.replace("{ontology}", ontology.lower()).replace("{double_encoded}", double_encoded)
    else:
        url = f"{uri_template.rstrip('/')}/ontologies/{ontology.lower()}/terms/{double_encoded}/graph"
    try:
        print(f"    Fetching OLS4 graph: {ontology}:{term_id} ...")
        with urllib.request.urlopen(url, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"    Warning: OLS4 fetch failed for {ontology}:{term_id}: {e}", file=sys.stderr)
        return None


def _fetch_bioportal_graph(ontology, term_id, api_conf):
    """Fetch a term's descendants from the BioPortal API and normalise to {nodes, edges}.

    Fetches the root class itself plus all descendants (handling pagination).
    Returns {nodes: [{iri, label, definition}], edges: [{source, target, label='subClassOf'}]}
    or None on error.  definition is the IAO:0000115 annotation (first string value).

    BioPortal docs: https://data.bioontology.org/documentation
    Endpoint: GET /ontologies/{ont}/classes/{encoded_iri}/descendants
    Auth:     apikey query parameter.
    """
    rest_conf = _get_type_conf(api_conf, "rest")
    base_uri = (rest_conf.get("uri") or "https://data.bioontology.org").rstrip("/")
    apikey   = rest_conf.get("apikey") or ""
    inner_iri = f"http://purl.obolibrary.org/obo/{ontology}_{term_id}"
    encoded_iri = urllib.parse.quote(inner_iri, safe="")

    nodes = {}   # iri -> {iri, label, definition}
    edges = []   # [{source, target, label}]

    def _add_class(cls):
        iri = cls.get("@id") or ""
        if not iri:
            return
        raw_def = cls.get("definition") or ""
        definition = (raw_def[0] if isinstance(raw_def, list) else raw_def) or ""
        nodes[iri] = {"iri": iri, "label": cls.get("prefLabel") or "", "definition": definition}
        for parent in (cls.get("subClassOf") or []):
            parent_iri = parent if isinstance(parent, str) else parent.get("@id") or ""
            if parent_iri:
                edges.append({"source": iri, "target": parent_iri, "label": "subClassOf"})

    # Fetch the root class itself (so include_self logic in expand_reachable_from works)
    root_url = (f"{base_uri}/ontologies/{ontology}/classes/{encoded_iri}"
                f"?apikey={apikey}&include=prefLabel,subClassOf,definition")
    try:
        print(f"    Fetching BioPortal class: {ontology}:{term_id} ...")
        req = urllib.request.Request(root_url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as response:
            _add_class(json.loads(response.read().decode("utf-8")))
    except Exception as e:
        print(f"    Warning: BioPortal root fetch failed for {ontology}:{term_id}: {e}",
              file=sys.stderr)
        return None

    # Fetch all descendants (paginated)
    desc_url = (f"{base_uri}/ontologies/{ontology}/classes/{encoded_iri}/descendants"
                f"?apikey={apikey}&pagesize=5000&include=prefLabel,subClassOf,definition")
    page = 1
    while desc_url:
        print(f"    Fetching BioPortal descendants: {ontology}:{term_id} (page {page}) ...")
        try:
            req = urllib.request.Request(desc_url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read().decode("utf-8"))
        except Exception as e:
            print(f"    Warning: BioPortal descendants fetch failed: {e}", file=sys.stderr)
            break
        for cls in (data.get("collection") or []):
            _add_class(cls)
        next_page = data.get("nextPage")
        if next_page and next_page != desc_url:
            sep = "&" if "?" in next_page else "?"
            desc_url = f"{next_page}{sep}apikey={apikey}" if "apikey" not in next_page else next_page
            page += 1
        else:
            desc_url = None

    if not nodes:
        return None
    return {"nodes": list(nodes.values()), "edges": edges}


def fetch_api_graph(ontology, term_id, apis=None, locales=None):
    """Fetch a term's subclass graph from the appropriate API endpoint.

    Checks the ``apis`` dict (loaded from menu_config.yaml) for a service whose
    ``ontologies`` list contains *ontology*.  Falls back to OLS4 when no match is
    found.

    ontology: ontology prefix in CURIE notation (e.g. 'ENVO', 'MESH').
    term_id:  local part of the term identifier (e.g. '00000428').
    apis:     dict keyed by service name, each with a 'type' sub-object containing
              protocol-keyed configs ('rest', 'sparql') with 'uri' and optional
              'apikey', plus an 'ontologies' list.  May be None or empty (OLS4 default).
    locales:  list of language codes to request (e.g. ['en'] or ['en', 'fr']).

    Returns a normalised dict with 'nodes' (list of {iri, label}) and 'edges'
    (list of {source, target, label}) or None on error.
    """
    apis = apis or {}
    api_name = None
    api_conf = None
    for name, conf in apis.items():
        if ontology.upper() in [o.upper() for o in (conf.get("ontologies") or [])]:
            api_name = name
            api_conf = conf
            break

    if api_name == "bioportal":
        return _fetch_bioportal_graph(ontology, term_id, api_conf)
    elif api_name == "agrovoc":
        return _fetch_agrovoc_graph(term_id, api_conf, locales=locales)
    else:
        return _fetch_ols4_graph(ontology, term_id, api_conf if api_name == "ols" else None)


def process_skos_source(key, source, config_file=MENU_CONFIG, locales=None):
    """Fetch a SKOS hierarchy via the API named in reachable_from.api and write
    a LinkML enum YAML to sources/{key}.yaml.

    The source config entry must have:
      reachable_from.api.<api_name>: {type: <sparql|rest>}
      reachable_from.source_nodes:   [PREFIX:term_id, ...]
    The global apis config (from menu_config.yaml) must have a matching entry
    under apis.<api_name> with the connection details (type.sparql.uri, etc.).

    Writes sources/{key}.yaml with one enum named {key} populated with
    permissible_values and is_a hierarchy in the requested locales.  The enum
    retains its reachable_from block so that -l can later refresh it.
    """
    yaml_path      = f"sources/{key}.yaml"
    reachable_from = source.get("reachable_from") or {}
    source_nodes   = reachable_from.get("source_nodes") or []
    include_self   = reachable_from.get("include_self", False)
    api_routing    = reachable_from.get("api") or {}
    prefixes       = source.get("prefixes") or {}

    if not source_nodes:
        print(f"  Skipping {key}: no source_nodes in reachable_from", file=sys.stderr)
        return

    api_name = next(iter(api_routing), None)
    if not api_name:
        print(f"  Skipping {key}: reachable_from.api is empty", file=sys.stderr)
        return

    with open(config_file) as _cf:
        config_data = yaml.safe_load(_cf) or {}
    api_conf = (config_data.get("apis") or {}).get(api_name) or {}

    all_nodes = {}   # iri -> {label, curie, definition, deprecated}
    all_edges = []   # [{child_curie, parent_curie}]

    for node_ref in source_nodes:
        if ":" not in node_ref:
            print(f"    Warning: source_node '{node_ref}' not in PREFIX:ID format — skipping",
                  file=sys.stderr)
            continue
        ontology, term_id = node_ref.split(":", 1)

        if api_name == "agrovoc":
            graph = _fetch_agrovoc_graph(term_id, api_conf, locales=locales)
        else:
            graph = fetch_api_graph(ontology, term_id,
                                    apis=config_data.get("apis") or {},
                                    locales=locales)
        if not graph:
            continue

        # Determine root IRI so include_self can be applied correctly
        pfx_uri  = prefixes.get(ontology, "")
        root_iri = f"{pfx_uri}{term_id}" if pfx_uri else None
        skip_iris = {root_iri} if (root_iri and not include_self) else set()

        for node in (graph.get("nodes") or []):
            iri = node.get("iri") or ""
            if not iri or iri in skip_iris:
                continue
            raw_def    = node.get("definition") or ""
            definition = (raw_def[0] if isinstance(raw_def, list) else raw_def) or ""
            all_nodes[iri] = {
                "label":      node.get("label") or "",
                "curie":      iri_to_curie(iri, prefixes),
                "definition": definition,
                "deprecated": bool(node.get("deprecated")),
            }

        for edge in (graph.get("edges") or []):
            if edge.get("label") != "subClassOf":
                continue
            src_iri = edge.get("source") or ""
            tgt_iri = edge.get("target") or ""
            if src_iri in all_nodes and tgt_iri in all_nodes:
                all_edges.append({
                    "child_curie":  all_nodes[src_iri]["curie"],
                    "parent_curie": all_nodes[tgt_iri]["curie"],
                })

    if not all_nodes:
        print(f"  Warning: {key}: no nodes returned — {yaml_path} not written",
              file=sys.stderr)
        return

    is_a_map = {e["child_curie"]: e["parent_curie"] for e in all_edges}

    permissible_values = {}
    for _iri, info in sorted(all_nodes.items(), key=lambda x: x[1]["curie"]):
        curie = info["curie"]
        pv = {"text": curie, "meaning": curie}
        if info["label"]:
            pv["title"] = info["label"]
        if info.get("definition"):
            pv["description"] = info["definition"]
        if curie in is_a_map:
            pv["is_a"] = is_a_map[curie]
        if info.get("deprecated"):
            pv["status"] = "DEPRECATED"
        permissible_values[curie] = pv

    pfx_id = next(iter(prefixes.values()), "") if prefixes else ""
    schema = make_config_schema(
        id=pfx_id or key,
        name=key,
        title=source.get("title") or key,
        description=source.get("description") or "",
        version=source.get("version") or "",
        prefixes=prefixes,
    )
    schema["enums"] = {
        key: {
            "name":               key,
            "title":              source.get("title") or key,
            "reachable_from":     reachable_from,
            "permissible_values": permissible_values,
        }
    }

    with open(yaml_path, "w") as _yf:
        yaml.dump(schema, _yf, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)

    print(f"  {key}: wrote {len(permissible_values)} permissible values to {yaml_path}")


def match_snomed(url, config_file=MENU_CONFIG):
    """Return True if *url* is a SNOMED CT concept IRI and was handled.

    Accepted form:
      http(s)://snomed.info/id/{conceptId}

    Adds the source entry to config_file without downloading anything (the
    concept IRI returns an HTML browser page; all data comes from the OLS4
    /graph endpoint at -l time).

    The generated entry uses content_type: OntologyAPI with an OLS4 api reference.
    SNOMED must appear in the 'ols' api's ontologies list in menu_config.yaml
    for -l to route requests to OLS4; if it is absent, fetch_api_graph falls
    back to the OLS4 default which still works because resolve_ols4_iri_base
    will detect the correct IRI base from OLS4 ontology metadata.
    """
    m = re.match(r'https?://snomed\.info/id/(\d+)', url)
    if not m:
        return False

    concept_id = m.group(1)
    key = f"SNOMED{concept_id}"

    with open(config_file) as _cf:
        config = yaml.safe_load(_cf) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        return True

    ols_conf = (config.get("apis") or {}).get("ols")
    concept_iri = f"http://snomed.info/id/{concept_id}"

    print(f"  Fetching OLS4 ontology metadata for SNOMED ...")
    meta = _fetch_ols4_ontology_meta("snomed", ols_conf)
    version = meta.get("version") or None

    print(f"  Fetching OLS4 term info for {concept_iri} ...")
    term_info = _fetch_ols4_term_info("snomed", concept_iri, ols_conf)
    title = term_info["label"] or key
    description = term_info["description"] or None

    entry = make_source_entry(key, url, "OntologyAPI", "json",
                              title=title, version=version, description=description)
    entry["prefixes"] = {"SNOMED": "http://snomed.info/id/"}
    entry["reachable_from"] = {
        "api": {"ols": {"type": "rest"}},
        "source_nodes": [f"SNOMED:{concept_id}"],
        "include_self": True,
    }
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' (title={title!r}, version={version!r}, "
          f"description={'set' if description else 'not available'}) to {config_file}")
    return True


# Matches a bare CURIE like ENVO:00010483 or GO:0008150 (letter-started prefix, colon, local ID)
_CURIE_INPUT_PAT = re.compile(r'^([A-Za-z][A-Za-z0-9]*):([\w]+)$')
# Matches OBO shorthand with underscore: ENVO_00010483, GO_0008150 (numeric local part)
_OBO_SHORTHAND_PAT = re.compile(r'^([A-Za-z][A-Za-z0-9]*)_(\d+)$')
# Matches an OBO Foundry IRI: http(s)://purl.obolibrary.org/obo/PREFIX_localid
_OBO_IRI_INPUT_PAT = re.compile(r'https?://purl\.obolibrary\.org/obo/([A-Za-z][A-Za-z0-9]*)_([\w]+)')


def _find_api_for_prefix(prefix, apis):
    """Return (api_name, api_conf) for the first API whose ontologies list contains *prefix*.

    Comparison is case-insensitive.  Falls back to ('ols', apis['ols']) when no
    explicit match is found, since OLS4 accepts any OBO ontology by default.
    """
    prefix_upper = prefix.upper()
    for name, conf in (apis or {}).items():
        ontologies = [o.upper() for o in (conf.get("ontologies") or [])]
        if prefix_upper in ontologies:
            return name, conf
    return "ols", (apis or {}).get("ols") or {}


def match_ontology_term(url, config_file=MENU_CONFIG):
    """Return True if *url* is an ontology term CURIE, OBO shorthand, or OBO IRI and was handled.

    Accepted forms:
      ENVO:00010483                                    (bare CURIE, colon separator)
      ENVO_00010483                                    (OBO shorthand, underscore + numeric ID)
      http://purl.obolibrary.org/obo/ENVO_00010483     (OBO Foundry IRI)

    Looks up the prefix in the `apis` block of menu_config.yaml to find which
    configured API handles the ontology (defaults to OLS4 when none claim it).
    The configured API is written to reachable_from for -l expansion; term
    label and description are always fetched from OLS4 (which is public and
    free) regardless of which API will be used for hierarchy expansion.
    """
    prefix = term_id = None

    m = _CURIE_INPUT_PAT.match(url)
    if m:
        prefix, term_id = m.group(1), m.group(2)
    else:
        m = _OBO_SHORTHAND_PAT.match(url)
        if m:
            prefix, term_id = m.group(1), m.group(2)
        else:
            m = _OBO_IRI_INPUT_PAT.match(url)
            if m:
                prefix, term_id = m.group(1).upper(), m.group(2)

    if not prefix:
        return False

    with open(config_file) as _cf:
        config = yaml.safe_load(_cf) or {}

    apis = config.get("apis") or {}
    api_name, api_conf = _find_api_for_prefix(prefix, apis)

    key = f"{prefix}_{term_id}"
    curie = f"{prefix}:{term_id}"

    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        return True

    api_type = "sparql" if _get_type_conf(api_conf, "sparql") else "rest"

    # Always use OLS4 for the initial label/description lookup — it is public
    # and free, and avoids auth issues with BioPortal or SPARQL endpoints.
    # The api_name/api_type in the source entry controls -l routing only.
    ols_conf = apis.get("ols") or {}
    iri_base = resolve_ols4_iri_base(prefix, ols_conf)
    concept_iri = iri_base + term_id

    print(f"  Fetching OLS4 ontology metadata for {prefix} ...")
    meta = _fetch_ols4_ontology_meta(prefix, ols_conf)
    version = meta.get("version") or None

    print(f"  Fetching OLS4 term info for {concept_iri} ...")
    term_info = _fetch_ols4_term_info(prefix, concept_iri, ols_conf)
    title = term_info["label"] or key
    description = term_info["description"] or None

    entry = make_source_entry(key, concept_iri, "OntologyAPI", "json",
                              title=title, version=version, description=description)
    entry["prefixes"] = {prefix: iri_base}
    entry["reachable_from"] = {
        "api": {api_name: {"type": api_type}},
        "source_nodes": [curie],
        "include_self": True,
    }

    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' (api={api_name}, title={title!r}) to {config_file}")
    print(f"  Run: menu_manager.py -l {key}  to expand the hierarchy via {api_name}")
    return True
