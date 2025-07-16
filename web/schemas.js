import menu_ from './templates/menu.json';

export const menu = menu_;
// The build process encodes all templates/ schema.son into one file.
export const getSchema = async (schema_folder) => {
  return (await import(`./templates/${schema_folder}/schema.json`)).default;
};
export const getExportFormats = async (schema_folder) => {
  return (await import(`./templates/${schema_folder}/export.js`)).default;
};
