import menu_ from './templates/menu.json';

export const menu = menu_;
export const getSchema = async (schema_folder) => {
  return (await import(`./templates/${schema_folder}/schema.json`)).default;
};
export const getExportFormats = async (schema_folder) => {
  return (await import(`./templates/${schema_folder}/export.js`)).default;
};
