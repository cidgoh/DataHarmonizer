import menu_ from './templates/menu.json';

export const menu = menu_;

// Webpack bundles all templates/*/schema.json files as lazy chunks.
// Returns null gracefully when a template has no schema.json (file:// fallback).
export const getSchema = async (schema_folder) => {
  try {
    return (await import(`./templates/${schema_folder}/schema.json`)).default;
  } catch (e) {
    return null;
  }
};

// Webpack bundles all templates/*/schema.yaml files as raw-text lazy chunks
// (asset/source rule in webpack.schemas.js / webpack.config.js).
// Used as a file:// fallback when schema.json is not in the bundle.
export const getSchemaYaml = async (schema_folder) => {
  try {
    return (await import(`./templates/${schema_folder}/schema.yaml`)).default;
  } catch (e) {
    return null;
  }
};

export const getExportFormats = async (schema_folder) => {
  return (await import(`./templates/${schema_folder}/export.js`)).default;
};
