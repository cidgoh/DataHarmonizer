"""OWL ontology source helpers for menu_manager.py.

Provides OWL/RDF parsing, class traversal, and LinkML YAML generation for
OWL ontology sources.  Auto-detects OWL files by URL extension (.owl, .ofn,
.rdf, .ttl, .n3) or file content markers.

Public API used by menu_manager.py:
    process_owl_source(key, source, config_file=None)
    match_owl(url, tmp_path, config_file=None, process_fn=None)
"""

import os
import re
import sys
import yaml
from source_utils import (
    MENU_CONFIG,
    IndentedDumper,
    sort_prefixes,
    make_config_schema,
    add_permissible_value,
    make_source_entry,
    write_config,
    keys_from_minus,
)


_OBO_BASE    = "http://purl.obolibrary.org/obo/"
_OBO_TERM_RE = re.compile(r'^([A-Za-z]+)_(\d+)$')


def _discover_obo_prefixes(world):
    """Scan all classes in *world* for OBO Foundry IRI patterns and return
    a prefix→URI-base dict for each discovered ontology namespace.

    Pattern:  http://purl.obolibrary.org/obo/{PREFIX}_{INTEGER}
    Produces: {PREFIX}: http://purl.obolibrary.org/obo/{PREFIX}_

    Example:  http://purl.obolibrary.org/obo/ENVO_01000254
              → {"ENVO": "http://purl.obolibrary.org/obo/ENVO_"}
    """
    found = {}
    for cls in world.classes():
        iri = cls.iri or ""
        if not iri.startswith(_OBO_BASE):
            continue
        local = iri[len(_OBO_BASE):]
        m = _OBO_TERM_RE.match(local)
        if m and m.group(1) not in found:
            found[m.group(1)] = _OBO_BASE + m.group(1) + "_"
    return found


def _extract_owl_metadata(path):
    """Parse an OWL/RDF-XML file and extract dc:title, dc:description,
    owl:versionInfo, dcterms:license, and namespace prefix declarations.

    Returns a dict with keys 'title', 'description', 'version', 'license'
    (values are None when not found) and 'prefixes' (dict of prefix→URI,
    excluding standard RDF/OWL infrastructure namespaces).
    Silently returns defaults on parse errors.
    """
    OWL  = "http://www.w3.org/2002/07/owl#"
    DC   = "http://purl.org/dc/elements/1.1/"
    DCT  = "http://purl.org/dc/terms/"
    RDF  = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"

    # Standard infrastructure namespaces — not useful as prefixes in source config
    _SKIP_NS = {
        "http://www.w3.org/XML/1998/namespace",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "http://www.w3.org/2000/01/rdf-schema#",
        "http://www.w3.org/2002/07/owl#",
        "http://www.w3.org/2001/XMLSchema#",
    }

    result = {"title": None, "description": None, "version": None, "license": None, "prefixes": {}}

    try:
        import xml.etree.ElementTree as ET

        # Collect all xmlns:prefix="uri" declarations via start-ns events
        for event, (prefix, uri) in ET.iterparse(path, events=("start-ns",)):
            if prefix and uri not in _SKIP_NS:
                result["prefixes"][prefix] = uri

        # Extract metadata from owl:Ontology element
        tree = ET.parse(path)
        root = tree.getroot()

        ontology_el = root.find(f".//{{{OWL}}}Ontology")
        if ontology_el is None:
            return result

        def _text(el, tag):
            child = el.find(tag)
            if child is not None and child.text and child.text.strip():
                return child.text.strip()
            return None

        def _attr_or_text(el, tag, attr=f"{{{RDF}}}resource"):
            """Some tags (e.g. license) carry the value as an rdf:resource attribute."""
            child = el.find(tag)
            if child is None:
                return None
            if child.text and child.text.strip():
                return child.text.strip()
            val = child.get(attr)
            return val.strip() if val else None

        result["title"]       = (_text(ontology_el, f"{{{DC}}}title")
                                  or _text(ontology_el, f"{{{DCT}}}title"))
        result["description"] = (_text(ontology_el, f"{{{DC}}}description")
                                  or _text(ontology_el, f"{{{DCT}}}description"))
        result["version"]     = _text(ontology_el, f"{{{OWL}}}versionInfo")
        result["license"]     = _attr_or_text(ontology_el, f"{{{DCT}}}license")

    except Exception:
        pass

    return result


_SENT_SPLIT = re.compile(r'(?<=[.!?])\s+')

def _clip_sentences(text, max_n):
    """Clip *text* to at most *max_n* sentences, appending ' ...' if clipped.

    Sentence boundaries are detected by punctuation (.!?) followed by whitespace.
    """
    if not text:
        return text
    sentences = _SENT_SPLIT.split(text.strip())
    if len(sentences) <= max_n:
        return text
    return " ".join(sentences[:max_n]) + " ..."


_DEFINITION_IRIS = (
    "http://purl.obolibrary.org/obo/IAO_0000115",    # OBO standard (most common)
    "http://www.w3.org/2004/02/skos/core#definition", # skos:definition
    "http://purl.org/dc/terms/description",           # dcterms:description
    "http://purl.org/dc/elements/1.1/description",    # dc:description
)

def _owl_definition(cls, world):
    """Return the first definition annotation found on *cls*, checking
    IAO:0000115, skos:definition, dcterms:description, and dc:description
    in that order.  Returns None if none are present.
    """
    for iri in _DEFINITION_IRIS:
        prop = world[iri]
        if prop is None:
            continue
        vals = prop[cls]
        if vals:
            return str(vals[0])
    return None


def _owl_english_label(cls):
    """Return the English rdfs:label of an OWL class, or the first unlocalised label.

    Prefers a label whose lang attribute starts with 'en' (covers en-US, en-GB, etc.).
    Falls back to the first label with no language tag.  Returns None if no usable
    label is found.
    """
    fallback = None
    for label in cls.label:
        if hasattr(label, 'lang') and label.lang:
            if label.lang.lower().startswith('en'):
                return str(label)
        elif isinstance(label, str) and fallback is None:
            fallback = label
    return fallback


def _find_owl_classes_by_label(onto, label_text):
    """Return all classes in *onto* matching *label_text*, checked in order:

    1. Exact case-insensitive match against the English rdfs:label.
    2. Case-insensitive match after replacing underscores with spaces (handles
       config entries like 'biological_process' vs label 'biological process').
    3. Case-insensitive match against the class's local name (cls.name,
       the IRI fragment after the last '/' or '#').
    """
    label_lower  = label_text.lower()
    label_spaced = label_lower.replace("_", " ")
    results = []
    for cls in onto.world.classes():
        eng = (_owl_english_label(cls) or "").lower()
        if eng == label_lower or eng == label_spaced or (cls.name or "").lower() == label_lower:
            results.append(cls)
    return results


def process_owl_source(key, source, config_file=MENU_CONFIG):
    """Build a LinkML enum YAML from a fetched OWL ontology source.

    Loads sources/{key}.text with owlready2 in an isolated World, traverses
    the class hierarchy from top-level nodes (classes with no class-type
    is_a parent other than owl:Thing), and writes a LinkML YAML with a single
    enum named *key* containing one permissible_value entry per OWL class.

    Filtering via the source's minus/include.concepts lists:
      minus.concepts:   English rdfs:label strings (case-insensitive) of
                        classes whose entire subtree should be excluded.
      include.concepts: Labels that override minus exclusion; their subtrees
                        are collected even if an ancestor was excluded.
    Excluded classes have their children re-wired to the nearest surviving
    ancestor (is_a points to grandparent rather than the excluded parent).
    Unrecognised minus/include labels produce a warning.
    """
    try:
        from owlready2 import World, Thing
    except ImportError:
        print("Error: owlready2 is not installed — run: pip install owlready2",
              file=sys.stderr)
        return

    concise    = bool(source.get("concise"))
    text_path  = f"sources/{key}.{source.get('file_format', 'owl')}"
    yaml_path  = f"sources/{key}.yaml"
    source_url = (source.get("reachable_from") or {}).get("source_ontology", "")

    print(f"Loading OWL ontology from {text_path} ...")
    world = World()
    onto  = world.get_ontology(f"file://{os.path.abspath(text_path)}").load()
    total = len(list(onto.classes()))
    print(f"  Base IRI: {onto.base_iri}  ({total} classes)")

    # Resolve minus/include concept labels to class IRI sets
    minus_labels   = list(keys_from_minus((source.get("minus")   or {}).get("concepts")))
    include_labels = list(keys_from_minus((source.get("include") or {}).get("concepts")))

    minus_iris = set()
    for lbl in minus_labels:
        found = _find_owl_classes_by_label(onto, lbl)
        if not found:
            print(f"  Warning: minus label '{lbl}' not found in ontology", file=sys.stderr)
        for cls in found:
            minus_iris.add(cls.iri)

    include_iris = set()
    for lbl in include_labels:
        found = _find_owl_classes_by_label(onto, lbl)
        if not found:
            print(f"  Warning: include label '{lbl}' not found in ontology", file=sys.stderr)
        for cls in found:
            include_iris.add(cls.iri)

    # Auto-discover OBO Foundry per-ontology prefixes from class IRIs,
    # then overlay with any user-specified config additions (config wins on conflicts).
    # Written into the source YAML via make_config_schema; menu_config.yaml keeps
    # only what the user explicitly put there.
    prefixes = sort_prefixes({**_discover_obo_prefixes(world), **dict(source.get("prefixes") or {})})
    permissible_values = {}
    visited = set()

    def _collect(cls, parent_code, in_minus_subtree=False):
        """Recursively add cls and its subclasses to permissible_values.

        in_minus_subtree propagates exclusion down the hierarchy.
        include_iris overrides exclusion for a class and its descendants.
        minus_iris starts exclusion for a class and its descendants.
        """
        if cls.iri in visited:
            return
        visited.add(cls.iri)

        # include overrides minus for this class and everything below it
        if cls.iri in include_iris:
            in_minus_subtree = False
        elif cls.iri in minus_iris:
            in_minus_subtree = True

        if not in_minus_subtree:
            title       = _owl_english_label(cls)
            description = _owl_definition(cls, world)
            if concise and description:
                description = _clip_sentences(description, 2)
            code        = cls.name or cls.iri.rstrip('#/').split('/')[-1].split('#')[-1]
            status      = "DEPRECATED" if bool(cls.deprecated) else None
            add_permissible_value(permissible_values, code,
                                  title=title, description=description, is_a=parent_code,
                                  status=status,
                                  meaning=cls.iri, prefixes=prefixes)
            next_parent = code
        else:
            next_parent = parent_code  # re-wire surviving children to nearest ancestor

        for sub in cls.subclasses():
            _collect(sub, next_parent, in_minus_subtree)

    # Top-level classes: those with no class-type is_a parent other than Thing
    for cls in onto.classes():
        class_parents = [p for p in cls.is_a if isinstance(p, type) and p is not Thing]
        if not class_parents:
            _collect(cls, None)

    n = len(permissible_values)
    excluded_n = total - len(visited)
    print(f"  Collected {n} classes"
          + (f" ({excluded_n} excluded by minus)" if excluded_n > 0 else ""))

    schema = make_config_schema(
        id=source_url, name=key,
        title=source.get("title") or key,
        description=source.get("description") or "",
        version=source.get("version") or "",
        license=source.get("license") or "",
        prefixes=dict(prefixes),
        enums={key: {"permissible_values": permissible_values}},
    )

    with open(yaml_path, "w") as f:
        yaml.dump(schema, f, Dumper=IndentedDumper, default_flow_style=False, sort_keys=False)
    print(f"Updated {yaml_path} ({n} classes)")


def match_owl(url, tmp_path, config_file=MENU_CONFIG, process_fn=None):
    """Return True if *tmp_path* looks like an OWL ontology file and was handled.

    Detection is by URL extension (.owl, .ofn, .rdf, .ttl, .n3) first, then
    by RDF/OWL content markers in the first 4 KB of the file.  When matched:
      - renames tmp_path to sources/{filename}
      - extracts metadata from the file (title, description, version, license, prefixes)
      - adds a source entry to config_file
      - calls process_fn([key], config_file) if provided

    Returns False if the file does not look like OWL.
    """
    _url_path = url.split("?")[0].rstrip("/").lower()
    _is_owl = any(_url_path.endswith(e) for e in ('.owl', '.ofn', '.rdf', '.ttl', '.n3'))
    if not _is_owl:
        try:
            with open(tmp_path, encoding='utf-8', errors='replace') as _f:
                _sample = _f.read(4096)
            _is_owl = ('<rdf:RDF' in _sample or '<owl:Ontology' in _sample
                       or ('Ontology(' in _sample
                           and ('SubClassOf(' in _sample or 'Declaration(' in _sample)))
        except Exception:
            pass

    if not _is_owl:
        return False

    _filename = url.split("?")[0].rstrip("/").split("/")[-1]
    if "." in _filename:
        _stem_noext, _ext = _filename.rsplit(".", 1)
    else:
        _stem_noext, _ext = _filename, "owl"
    key = _stem_noext if _stem_noext else "OWLOntology"

    with open(config_file) as f:
        config = yaml.safe_load(f) or {}
    if key in config.get("sources", {}):
        print(f"  Skipping {url}: source key '{key}' already exists in {config_file}",
              file=sys.stderr)
        os.unlink(tmp_path)
        return True

    output_path = f"sources/{_filename}"
    os.rename(tmp_path, output_path)
    print(f"Saved to {output_path}")

    _meta = _extract_owl_metadata(output_path)
    entry = make_source_entry(
        key, url, "OWL", _ext,
        title       = _meta["title"]       or _stem_noext,
        description = _meta["description"],
        version     = _meta["version"],
    )
    if _meta["license"]:
        entry["license"] = _meta["license"]
    if _meta["prefixes"]:
        entry["prefixes"] = sort_prefixes(_meta["prefixes"])
    config.setdefault("sources", {})[key] = entry
    write_config(config, config_file)
    print(f"Added source '{key}' to {config_file}")

    if process_fn is not None:
        process_fn([key], config_file)
    return True
