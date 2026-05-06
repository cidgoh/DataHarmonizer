#!/usr/bin/env node
'use strict';
/**
 * induce_schema.cjs
 *
 * Command-line tool that applies the same LinkML schema-induction logic used
 * by the browser (lib/utils/schema_induction.js) to a local schema.yaml file,
 * producing schema_converted.yaml and schema_converted.json in the same
 * directory.  Use this to verify browser behaviour or diff against the
 * Python-built schema.json.
 *
 * Usage:
 *   node script/induce_schema.cjs <path/to/schema.yaml>
 *   node script/induce_schema.cjs web/templates/canada_covid19/schema.yaml
 *
 * Output (written next to the input file):
 *   schema_converted.yaml   — YAML round-trip of the induced schema
 *   schema_converted.json   — JSON of the induced schema
 *
 * Requires:  node >= 18,  yaml package in node_modules (already a project dep)
 */

const fs   = require('fs');
const path = require('path');
const YAML = require('../node_modules/yaml/dist/index.js');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2).filter(a => !a.startsWith('-'));
if (args.length === 0) {
  console.error('Usage: node script/induce_schema.cjs <path/to/schema.yaml>');
  process.exit(1);
}
const schemaPath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(schemaPath)) {
  console.error(`File not found: ${schemaPath}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// LINKML_BUILTIN_TYPES  (mirrors lib/utils/schema_induction.js)
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
// Schema processing  (mirrors lib/utils/schema_induction.js)
// ---------------------------------------------------------------------------

function coerceExampleValues(slot) {
  if (!Array.isArray(slot.examples)) return;
  for (const ex of slot.examples) {
    if (ex !== null && typeof ex === 'object' && 'value' in ex && typeof ex.value !== 'string') {
      ex.value = String(ex.value);
    }
  }
}

function resolveImports(schema, schemaDir) {
  for (const imp of schema.imports || []) {
    if (imp === 'linkml:types') {
      schema.types = schema.types || {};
      for (const [n, d] of Object.entries(LINKML_BUILTIN_TYPES)) {
        if (!(n in schema.types)) schema.types[n] = d;
      }
      continue;
    }
    try {
      const importPath = path.resolve(schemaDir, imp + '.yaml');
      const imported = YAML.parse(fs.readFileSync(importPath, 'utf8'));
      resolveImports(imported, path.dirname(importPath));
      for (const section of ['slots', 'enums', 'types', 'prefixes', 'subsets', 'classes']) {
        if (imported[section]) {
          schema[section] = schema[section] || {};
          for (const [k, v] of Object.entries(imported[section]))
            if (!(k in schema[section])) schema[section][k] = v;
        }
      }
    } catch (e) {
      console.warn(`import "${imp}" failed:`, e.message);
    }
  }
}

function induceClass(schema, className) {
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
    for (const slotName of cls.slots || []) {
      accumulated[slotName] = structuredClone({
        ...(accumulated[slotName] || {}),
        ...(schema.slots?.[slotName] || {}),
        ...(cls.slot_usage?.[slotName] || {}),
      });
      if (!accumulated[slotName].name) accumulated[slotName].name = slotName;
      coerceExampleValues(accumulated[slotName]);
    }
    for (const [attrName, attrDef] of Object.entries(cls.attributes || {})) {
      accumulated[attrName] = structuredClone({
        ...(accumulated[attrName] || {}),
        ...attrDef,
      });
      if (!accumulated[attrName].name) accumulated[attrName].name = attrName;
      coerceExampleValues(accumulated[attrName]);
    }
  }
  return accumulated;
}

function induceAllClasses(schema) {
  for (const [className, cls] of Object.entries(schema.classes || {})) {
    if (cls.slots?.length || Object.keys(cls.attributes || {}).length)
      schema.classes[className].attributes = induceClass(schema, className);
  }
}

// ---------------------------------------------------------------------------
// YAML output helpers
// ---------------------------------------------------------------------------

/**
 * inlineBlockLiterals — text-level pass
 *
 * YAML.stringify emits strings containing actual newlines as |- block literals.
 * This pass converts those back to inline double-quoted form with \n escapes,
 * matching the style used in the source schema.yaml:
 *   title: "Centre régional des sciences\nde la santé de Thunder Bay"
 */
function inlineBlockLiterals(text) {
  const lines = text.split('\n');
  const out   = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Match: <indent><key>: |-  OR  <indent>- |-
    const m = line.match(/^(\s*)([\w\- ][^:]*:|-)( \|-)$/);
    if (m) {
      const [, indent, key] = m;
      const bodyPrefix = ' '.repeat(indent.length + 2);
      const bodyLines  = [];
      i++;
      while (i < lines.length && (lines[i].startsWith(bodyPrefix) || lines[i] === '')) {
        bodyLines.push(lines[i].startsWith(bodyPrefix)
          ? lines[i].slice(bodyPrefix.length)
          : '');
        i++;
      }
      // Strip trailing empty lines (|- strips final newline)
      while (bodyLines.length && bodyLines[bodyLines.length - 1] === '') bodyLines.pop();
      // Escape backslashes and double-quotes, join lines with \n escape
      const value = bodyLines
        .map(l => l.replace(/\\/g, '\\\\').replace(/"/g, '\\"'))
        .join('\\n');
      out.push(`${indent}${key} "${value}"`);
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}

/**
 * normaliseQuoting — Document-level pass
 *
 * YAML.stringify uses QUOTE_DOUBLE for strings that need quoting (colons,
 * brackets, etc.).  The source schema.yaml uses QUOTE_SINGLE for those.
 * Strings with actual newlines are BLOCK_SCALAR at this stage and are handled
 * by inlineBlockLiterals() after doc.toString().
 *
 * Also single-quotes PLAIN date/time/bool-like strings for YAML 1.1 safety.
 */
const AMBIGUOUS = /^\d{4}-\d{2}-\d{2}|^\d+:\d+|^(true|false|null|yes|no|on|off)$/i;

function normaliseQuoting(doc) {
  YAML.visit(doc, {
    Scalar(_, node) {
      if (node.type === 'QUOTE_DOUBLE') {
        node.type = 'QUOTE_SINGLE';
      } else if (node.type === 'PLAIN' && typeof node.value === 'string' && AMBIGUOUS.test(node.value)) {
        node.type = 'QUOTE_SINGLE';
      }
    },
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const schemaDir = path.dirname(schemaPath);
console.log('Reading', schemaPath);
const schema = YAML.parse(fs.readFileSync(schemaPath, 'utf8'));

console.log('Resolving imports...');
resolveImports(schema, schemaDir);

console.log('Inducing classes...');
induceAllClasses(schema);

// Write YAML:
//   1. stringify with lineWidth:0 (no wrapping)
//   2. parseDocument + normaliseQuoting: QUOTE_DOUBLE→QUOTE_SINGLE,
//      PLAIN date/bool → QUOTE_SINGLE; BLOCK_SCALAR nodes pass through untouched
//   3. toString with lineWidth:0  (block scalars re-emitted as |-)
//   4. inlineBlockLiterals: |- blocks → "...\n..." double-quoted inline form
const yamlOut  = path.join(schemaDir, 'schema_converted.yaml');
const rawYaml  = YAML.stringify(schema, { lineWidth: 0 });
const doc      = YAML.parseDocument(rawYaml);
normaliseQuoting(doc);
fs.writeFileSync(yamlOut, inlineBlockLiterals(doc.toString({ lineWidth: 0 })), 'utf8');
console.log('Written:', yamlOut);

// Write JSON
const jsonOut = path.join(schemaDir, 'schema_converted.json');
fs.writeFileSync(jsonOut, JSON.stringify(schema, null, 2), 'utf8');
console.log('Written:', jsonOut);
