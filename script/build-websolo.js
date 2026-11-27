#!/usr/bin/env node
/**
 * build-websolo — build a minimal web/dist containing only the specified schemas.
 *
 * Usage:
 *   yarn build:websolo <schema.yaml> [<schema2.yaml> ...]
 *
 * Each argument is a path (absolute or relative to CWD) to a LinkML YAML
 * schema file.  The script:
 *
 *   1. Reads each schema to determine its name and primary template class.
 *   2. Copies each schema (plus sibling files that support $imports) into a
 *      temporary staging directory web/templates_solo/.
 *   3. Generates web/schemas.solo.js — a schemas.js variant whose dynamic
 *      imports only reference templates_solo/, so webpack bundles nothing else.
 *   4. Generates web/webpack.schemas.solo.js — a schemas webpack config that
 *      uses the solo entry point and staging directory.
 *   5. Runs the full production build, passing --env templatesDir=templates_solo
 *      to webpack.config.js so its CopyPlugin also uses the staging directory.
 *   6. Cleans up all generated/staging files.
 *
 * The result is a web/dist/ that is free of every other schema and PDF.
 */

'use strict';

const fs            = require('fs');
const path          = require('path');
const { execSync }  = require('child_process');
const YAML          = require('yaml');

const ROOT    = path.resolve(__dirname, '..');
const WEB     = path.join(ROOT, 'web');
const SOLO    = 'templates_solo';          // relative to WEB
const SOLO_ABS = path.join(WEB, SOLO);

// Files copied from a schema's source directory (supports $imports).
const COPY_EXTS = new Set(['.yaml', '.json', '.tsv', '.csv', '.pdf']);

// ── 1. Parse arguments ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (!args.length) {
  console.error(
    'Usage: yarn build:websolo <schema.yaml> [<schema2.yaml> ...]\n' +
    'Example:\n' +
    '  yarn build:websolo ../my-project/swo_schema.yaml'
  );
  process.exit(1);
}

// ── 2. Validate and parse each schema ────────────────────────────────────────

const SKIP_CLASSES = new Set(['Container', 'dh_interface']);

const entries = [];   // { absPath, folder, schema, templateClass }

for (const arg of args) {
  const absPath = path.resolve(arg);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: file not found — ${absPath}`);
    process.exit(1);
  }

  let schema;
  try {
    schema = YAML.parse(fs.readFileSync(absPath, 'utf8'));
  } catch (e) {
    console.error(`Error: could not parse YAML — ${absPath}\n${e.message}`);
    process.exit(1);
  }

  if (!schema?.name) {
    console.error(`Error: schema has no "name" field — ${absPath}`);
    process.exit(1);
  }

  const classes = schema.classes ?? {};

  // Mirror _buildMenuEntryFromSchema logic (Toolbar.js):
  //  1) tree_root class  → single-class template (normal case)
  //  2) no tree_root + Container exists → 'Container' (shows all tabs)
  //  3) neither → first real class
  const treeRootClass = Object.entries(classes).find(([n, c]) => {
    if (SKIP_CLASSES.has(n)) return false;
    return (
      c?.tree_root === true ||
      c?.annotations?.tree_root === true ||
      (typeof c?.annotations?.tree_root === 'object' && c?.annotations?.tree_root?.value)
    );
  })?.[0];

  const templateClass =
    treeRootClass ??
    ('Container' in classes ? 'Container' : null) ??
    Object.keys(classes).find(n => !SKIP_CLASSES.has(n));

  if (!templateClass) {
    console.error(`Error: schema "${schema.name}" has no loadable class — ${absPath}`);
    process.exit(1);
  }

  // Sanitise schema name for use as a filesystem folder.
  const folder = schema.name.replace(/[^\w.-]/g, '_');

  entries.push({ absPath, folder, schema, templateClass });
  console.log(`  schema: ${schema.name}  class: ${templateClass}  (${path.relative(ROOT, absPath)})`);
}

// ── 3. Build staging directory ───────────────────────────────────────────────

if (fs.existsSync(SOLO_ABS)) fs.rmSync(SOLO_ABS, { recursive: true });

const menu = {};

for (const { absPath, folder, schema, templateClass } of entries) {
  const destDir = path.join(SOLO_ABS, folder);
  fs.mkdirSync(destDir, { recursive: true });

  // Copy every relevant file from the schema's source directory so that
  // schemas using $imports (multi-file schemas) load correctly.
  const srcDir = path.dirname(absPath);
  for (const fname of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, fname);
    if (!fs.statSync(src).isFile()) continue;
    if (!COPY_EXTS.has(path.extname(fname).toLowerCase())) continue;
    fs.copyFileSync(src, path.join(destDir, fname));
  }

  // The webpack schema loader expects the entry point to be named schema.yaml.
  const srcBase = path.basename(absPath);
  if (srcBase !== 'schema.yaml') {
    fs.copyFileSync(absPath, path.join(destDir, 'schema.yaml'));
  }

  menu[schema.name] = {
    folder,
    id: schema.name,
    version: schema.version ?? '1.0.0',
    templates: {
      [templateClass]: { name: templateClass, display: true },
    },
  };
}

fs.writeFileSync(
  path.join(SOLO_ABS, 'menu.json'),
  JSON.stringify(menu, null, 2)
);

// ── 4. Generate schemas.solo.js ───────────────────────────────────────────────
//
// A schemas.js variant that imports only from templates_solo/.  Using a
// template literal in the dynamic import() means webpack creates a context
// restricted to that directory and bundles nothing else.

const schemasSoloJs = `// AUTO-GENERATED by script/build-websolo.js — do not edit manually.
import _menu from './${SOLO}/menu.json';
export const menu = _menu;

export const getSchema = async (schema_folder) => {
  try {
    return (await import(\`./${SOLO}/\${schema_folder}/schema.json\`)).default;
  } catch { return null; }
};

export const getSchemaYaml = async (schema_folder) => {
  try {
    return (await import(\`./${SOLO}/\${schema_folder}/schema.yaml\`)).default;
  } catch { return null; }
};

export const getExportFormats = async (schema_folder) => {
  try {
    return (await import(\`./${SOLO}/\${schema_folder}/export.js\`)).default;
  } catch { return {}; }
};
`;

const schemasSoloPath = path.join(WEB, 'schemas.solo.js');
fs.writeFileSync(schemasSoloPath, schemasSoloJs);

// ── 5. Generate webpack.schemas.solo.js ──────────────────────────────────────

const webpackSchemasSolo = `// AUTO-GENERATED by script/build-websolo.js — do not edit manually.
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname),
  entry: { schemas: './schemas.solo.js' },
  module: {
    rules: [{ test: /schema\\.yaml$/, type: 'asset/source' }],
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'dist-schemas'),
    filename: '[name].js',
    globalObject: 'this',
    library: { name: 'schemas', type: 'umd' },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { context: '${SOLO}', from: '**/*.pdf',            to: '../templates/[path][name][ext]', noErrorOnMissing: true },
        { context: '${SOLO}', from: '**/schema.yaml',      to: '../templates/[path][name][ext]' },
        { context: '${SOLO}', from: '**/schema.json',      to: '../templates/[path][name][ext]', noErrorOnMissing: true },
        { context: '${SOLO}', from: '**/exampleInput/*.*', to: '../templates/[path][name][ext]', noErrorOnMissing: true },
      ],
    }),
  ],
};
`;

const webpackSchemasSoloPath = path.join(WEB, 'webpack.schemas.solo.js');
fs.writeFileSync(webpackSchemasSoloPath, webpackSchemasSolo);

// ── 6. Run the build ──────────────────────────────────────────────────────────

console.log('\nBuilding...\n');

const cmd = [
  'yarn clean:web',
  `webpack --mode=production --config web/webpack.config.js --env templatesDir=${SOLO}`,
  'yarn clean:schemas',
  'webpack --config web/webpack.schemas.solo.js',
].join(' && ');

let buildOk = false;
try {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
  buildOk = true;
} finally {
  // ── 7. Clean up staging and generated files ───────────────────────────────
  fs.rmSync(SOLO_ABS,              { recursive: true, force: true });
  fs.rmSync(schemasSoloPath,       { force: true });
  fs.rmSync(webpackSchemasSoloPath, { force: true });
}

if (buildOk) {
  console.log(`\nbuild:websolo complete → web/dist/`);
  console.log(`Schemas included: ${entries.map(e => e.schema.name).join(', ')}`);
}
