/**
 * schema_induction.js
 *
 * Loads a LinkML schema.yaml in the browser, resolves imports, and induces
 * fully-merged class attributes so that the result is structurally equivalent
 * to the pre-built schema.json produced by script/linkml.py.
 */

import YAML from 'yaml';

// ---------------------------------------------------------------------------
// Built-in types provided by `linkml:types`.  Only the `uri` field is needed
// by AppContext.js (schema.types[range].uri).
// ---------------------------------------------------------------------------
const LINKML_BUILTIN_TYPES = {
  string: {
    name: 'string',
    description: 'A character string',
    notes: ['In RDF serializations, a slot with range of string is treated as a literal or type xsd:string.   If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "string".'],
    exact_mappings: ['schema:Text'],
    base: 'str',
    uri: 'xsd:string',
  },
  integer: {
    name: 'integer',
    description: 'An integer',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "integer".'],
    exact_mappings: ['schema:Integer'],
    base: 'int',
    uri: 'xsd:integer',
  },
  boolean: {
    name: 'boolean',
    description: 'A binary (true or false) value',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "boolean".'],
    exact_mappings: ['schema:Boolean'],
    base: 'Bool',
    uri: 'xsd:boolean',
    repr: 'bool',
  },
  float: {
    name: 'float',
    description: 'A real number that conforms to the xsd:float specification',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "float".'],
    exact_mappings: ['schema:Float'],
    base: 'float',
    uri: 'xsd:float',
  },
  double: {
    name: 'double',
    description: 'A real number that conforms to the xsd:double specification',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "double".'],
    close_mappings: ['schema:Float'],
    base: 'float',
    uri: 'xsd:double',
  },
  decimal: {
    name: 'decimal',
    description: 'A real number with arbitrary precision that conforms to the xsd:decimal specification',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "decimal".'],
    broad_mappings: ['schema:Number'],
    base: 'Decimal',
    uri: 'xsd:decimal',
  },
  time: {
    name: 'time',
    description: 'A time object represents a (local) time of day, independent of any particular day',
    notes: [
      'URI is dateTime because OWL reasoners do not work with straight date or time',
      'If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "time".',
    ],
    exact_mappings: ['schema:Time'],
    base: 'XSDTime',
    uri: 'xsd:time',
    repr: 'str',
  },
  date: {
    name: 'date',
    description: 'a date (year, month and day) in an idealized calendar',
    notes: [
      "URI is dateTime because OWL reasoners don't work with straight date or time",
      'If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "date".',
    ],
    exact_mappings: ['schema:Date'],
    base: 'XSDDate',
    uri: 'xsd:date',
    repr: 'str',
  },
  datetime: {
    name: 'datetime',
    description: 'The combination of a date and time',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "datetime".'],
    exact_mappings: ['schema:DateTime'],
    base: 'XSDDateTime',
    uri: 'xsd:dateTime',
    repr: 'str',
  },
  date_or_datetime: {
    name: 'date_or_datetime',
    description: 'Either a date or a datetime',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "date_or_datetime".'],
    base: 'str',
    uri: 'linkml:DateOrDatetime',
    repr: 'str',
  },
  uriorcurie: {
    name: 'uriorcurie',
    description: 'a URI or a CURIE',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "uriorcurie".'],
    base: 'URIorCURIE',
    uri: 'xsd:anyURI',
    repr: 'str',
  },
  curie: {
    name: 'curie',
    conforms_to: 'https://www.w3.org/TR/curie/',
    description: 'a compact URI',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "curie".'],
    comments: [
      'in RDF serializations this MUST be expanded to a URI',
      'in non-RDF serializations MAY be serialized as the compact representation',
    ],
    base: 'Curie',
    uri: 'xsd:string',
    repr: 'str',
  },
  uri: {
    name: 'uri',
    conforms_to: 'https://www.ietf.org/rfc/rfc3987.txt',
    description: 'a complete URI',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "uri".'],
    comments: [
      'in RDF serializations a slot with range of uri is treated as a literal or type xsd:anyURI unless it is an identifier or a reference to an identifier, in which case it is translated directly to a node',
    ],
    close_mappings: ['schema:URL'],
    base: 'URI',
    uri: 'xsd:anyURI',
    repr: 'str',
  },
  ncname: {
    name: 'ncname',
    description: 'Prefix part of CURIE',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "ncname".'],
    base: 'NCName',
    uri: 'xsd:string',
    repr: 'str',
  },
  objectidentifier: {
    name: 'objectidentifier',
    description: 'A URI or CURIE that represents an object in the model.',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "objectidentifier".'],
    comments: ['Used for inheritance and type checking'],
    base: 'ElementIdentifier',
    uri: 'shex:iri',
    repr: 'str',
  },
  nodeidentifier: {
    name: 'nodeidentifier',
    description: 'A URI, CURIE or BNODE that represents a node in a model.',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "nodeidentifier".'],
    base: 'NodeIdentifier',
    uri: 'shex:nonLiteral',
    repr: 'str',
  },
  jsonpointer: {
    name: 'jsonpointer',
    conforms_to: 'https://datatracker.ietf.org/doc/html/rfc6901',
    description: 'A string encoding a JSON Pointer. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to a valid object within the current instance document when encoded in tree form.',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "jsonpointer".'],
    base: 'str',
    uri: 'xsd:string',
    repr: 'str',
  },
  jsonpath: {
    name: 'jsonpath',
    conforms_to: 'https://www.ietf.org/archive/id/draft-goessner-dispatch-jsonpath-00.html',
    description: 'A string encoding a JSON Path. The value of the string MUST conform to JSON Point syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded in tree form.',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "jsonpath".'],
    base: 'str',
    uri: 'xsd:string',
    repr: 'str',
  },
  sparqlpath: {
    name: 'sparqlpath',
    conforms_to: 'https://www.w3.org/TR/sparql11-query/#propertypaths',
    description: 'A string encoding a SPARQL Property Path. The value of the string MUST conform to SPARQL syntax and SHOULD dereference to zero or more valid objects within the current instance document when encoded as RDF.',
    notes: ['If you are authoring schemas in LinkML YAML, the type is referenced with the lower case "sparqlpath".'],
    base: 'str',
    uri: 'xsd:string',
    repr: 'str',
  },
};

// ---------------------------------------------------------------------------
// resolveImports — async
// Walks schema.imports[], injecting built-ins for linkml:types and fetching
// any relative YAML imports.  Merges slots/enums/types/prefixes/subsets/
// classes non-destructively (does not overwrite schema-defined entries).
// ---------------------------------------------------------------------------
async function resolveImports(schema, baseUrl) {
  const imports = schema.imports || [];

  for (const imp of imports) {
    if (imp === 'linkml:types') {
      schema.types = schema.types || {};
      for (const [typeName, typeDef] of Object.entries(LINKML_BUILTIN_TYPES)) {
        if (!(typeName in schema.types)) {
          schema.types[typeName] = typeDef;
        }
      }
      continue;
    }

    // Relative import: resolve against baseUrl and fetch
    try {
      const importUrl = new URL(imp + '.yaml', baseUrl).href;
      const response = await fetch(importUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      const imported = YAML.parse(text);

      // Recurse into nested imports
      await resolveImports(imported, importUrl);

      // Merge top-level sections non-destructively
      const sections = ['slots', 'enums', 'types', 'prefixes', 'subsets', 'classes'];
      for (const section of sections) {
        if (imported[section]) {
          schema[section] = schema[section] || {};
          for (const [key, val] of Object.entries(imported[section])) {
            if (!(key in schema[section])) {
              schema[section][key] = val;
            }
          }
        }
      }
    } catch (e) {
      console.warn(`schema_induction: failed to resolve import "${imp}":`, e.message);
    }
  }
}

// ---------------------------------------------------------------------------
// coerceExampleValues — sync (internal)
// Ensures every entry in slot.examples has a string `value`.  The YAML 1.2
// parser keeps bare dates as strings, but numbers (1234) and booleans (true)
// are parsed as their native JS types.  Downstream code always expects a
// string, and YAML serialisers need a string to emit a quoted literal rather
// than a bare date / number / boolean token.
// ---------------------------------------------------------------------------
function coerceExampleValues(slot) {
  if (!Array.isArray(slot.examples)) return;
  for (const ex of slot.examples) {
    if (ex !== null && typeof ex === 'object' && 'value' in ex && typeof ex.value !== 'string') {
      ex.value = String(ex.value);
    }
  }
}

// ---------------------------------------------------------------------------
// induceClass — sync (internal)
// Walks the is_a chain from root ancestor down to className, building a
// merged `attributes` dict from global slot defs + per-class slot_usage.
// ---------------------------------------------------------------------------
function induceClass(schema, className) {
  // Build chain: [root, …, parent, className]
  const chain = [];
  const visited = new Set();
  let current = className;
  while (current && !visited.has(current)) {
    visited.add(current);
    chain.unshift(current);
    current = schema.classes[current]?.is_a;
  }

  const accumulated = {};

  for (const ancestor of chain) {
    const cls = schema.classes[ancestor];
    if (!cls) continue;

    // Slots listed by name — merge global def then class slot_usage on top.
    // structuredClone ensures array/object values (exact_mappings, comments,
    // examples, any_of, todos, …) are deep-copied so induced attributes are
    // fully independent and cannot silently corrupt shared schema.slots data.
    for (const slotName of cls.slots || []) {
      accumulated[slotName] = structuredClone({
        ...(accumulated[slotName] || {}),
        ...(schema.slots?.[slotName] || {}),
        ...(cls.slot_usage?.[slotName] || {}),
      });
      if (!accumulated[slotName].name) {
        accumulated[slotName].name = slotName;
      }
      coerceExampleValues(accumulated[slotName]);
    }

    // Direct class-level attributes (not via slots list)
    for (const [attrName, attrDef] of Object.entries(cls.attributes || {})) {
      accumulated[attrName] = structuredClone({
        ...(accumulated[attrName] || {}),
        ...attrDef,
      });
      if (!accumulated[attrName].name) {
        accumulated[attrName].name = attrName;
      }
      coerceExampleValues(accumulated[attrName]);
    }
  }

  return accumulated;
}

// ---------------------------------------------------------------------------
// induceAllClasses — sync (internal)
// Iterates schema.classes and replaces each class's attributes with the
// fully-induced version.
// ---------------------------------------------------------------------------
function induceAllClasses(schema) {
  for (const [className, cls] of Object.entries(schema.classes || {})) {
    if (cls.slots?.length || Object.keys(cls.attributes || {}).length) {
      schema.classes[className].attributes = induceClass(schema, className);
    }
  }
}

// ---------------------------------------------------------------------------
// fetchAndProcessYaml — async, exported
// Primary entry point: fetch → parse → resolveImports → induceAllClasses.
// Throws on fetch/parse failure so the caller can fall back to schema.json.
// ---------------------------------------------------------------------------
export async function fetchAndProcessYaml(yamlUrl) {
  const response = await fetch(yamlUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${yamlUrl}`);
  }
  const text = await response.text();
  const schema = YAML.parse(text);

  await resolveImports(schema, yamlUrl);
  induceAllClasses(schema);

  return schema;
}

// ---------------------------------------------------------------------------
// processYamlSchema — sync, exported
// Used when fetch() is unavailable (file:// protocol) and schema.yaml has been
// bundled as raw text by webpack (asset/source).  Only resolves linkml:types
// imports; relative imports require fetch() and are skipped with a warning.
// All current DH schemas only import linkml:types, so this is sufficient.
// ---------------------------------------------------------------------------
export function processYamlSchema(yamlText) {
  const schema = YAML.parse(yamlText);

  schema.types = schema.types || {};
  for (const imp of schema.imports || []) {
    if (imp === 'linkml:types') {
      for (const [typeName, typeDef] of Object.entries(LINKML_BUILTIN_TYPES)) {
        if (!(typeName in schema.types)) schema.types[typeName] = typeDef;
      }
    } else {
      console.warn(`schema_induction: import "${imp}" requires fetch() — skipped in file:// context`);
    }
  }

  induceAllClasses(schema);
  return schema;
}
