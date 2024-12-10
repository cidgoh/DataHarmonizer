import menu_ from './templates/menu.json';

export const menu = menu_;
export const getSchema = async (schema) => {
  return (await import(`./templates/${schema}/schema.json`)).default;
};
export const getExportFormats = async (schema) => {
  return (await import(`./templates/${schema}/export.js`)).default;
};
