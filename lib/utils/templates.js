// This needs a rewrite, as its overcomplicating the handling of locales.
// At schema level a variety of locales may be specified, and these are
// held in the schema.extensions.locales datastructure.  Switching to a
// locale simply involves doing a deep merge of default schema with that
// locale.  Locales should not be hanlded at template level.  
//
// Processing a data file's locale is a separate issue, and may involve
// translating its contents from one locale to another.  

import { deepMerge } from './objects';
import { fetchFileAsync } from './files';
import { menu, getSchema, getSchemaYaml } from 'schemas'; // located in /web/schemas.js
import { fetchAndProcessYaml, processYamlSchema } from './schema_induction';

// Retrieves template given in browser URL by template= , OR returns first menu item Object.keys(menu)[0]
export function getTemplatePathInScope() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  if (templatePath === null || typeof templatePath === 'undefined') {
    // Retrieve first menu schema's first template in it
    const schema_name = Object.keys(menu)[0];
    const schema_entry = menu[schema_name];
    const schema_folder = schema_entry['folder'];
    const template_name = Object.keys(schema_entry['templates'])[0];
    return `${schema_folder}/${template_name}`;
  }
  return templatePath;
}

// Fetches schema, preferring schema.yaml at runtime (avoids build step) and
// falling back to pre-built schema.json when YAML is unavailable.
async function fetchSchema(path) {

  // For any HTTP protocol (localhost or production), schema.yaml and schema.json
  // are both served as static files from web/dist/templates/ via CopyPlugin.
  // Fetch YAML first; if that fails, fetch JSON directly — no webpack bundle needed.
  if (window.location.protocol.startsWith('http')) {
    const yamlPath = path.replace(/schema\.json$/, 'schema.yaml');
    const yamlUrl = new URL(yamlPath, window.location.href).href;
    try {
      return await fetchAndProcessYaml(yamlUrl);
    } catch (e) {
      console.warn('schema_induction: YAML load failed, falling back to schema.json:', e.message);
    }
    // JSON static-file fallback
    try {
      const response = await fetch(path);
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('fetchSchema: schema.json fetch also failed:', e.message);
    }
    return null;
  }

  // file:// protocol: browsers block fetch() for file:// origins.
  // Try webpack-bundled schema.json first; if absent, try webpack-bundled
  // schema.yaml (raw text, bundled as asset/source) processed synchronously.
  const schema_path = path.replace(/\/templates\/(.+)\/schema.json/, '$1');
  const jsonSchema = await getSchema(schema_path);
  if (jsonSchema) return jsonSchema;

  const yamlText = await getSchemaYaml(schema_path);
  if (yamlText) return processYamlSchema(yamlText);

  return null;
}

//Used only in this script in create()
function buildTemplateFromUploadedSchema(schema) {
  const name = schema.name || '';
  const locales = {};

  // Extract any locales embedded in the schema via extensions.locales.value,
  // using the same deep-merge logic as the server-fetch path in create().
  // This applies to both uploaded .yaml files and to schemas passed by
  // loadSelectedTemplate when the file was loaded from disk.
  Object.entries(schema.extensions?.locales?.value || {})
    .forEach(([locale, locale_schema]) => {
      locales[locale] = { schema: deepMerge(schema, locale_schema) };
    });

  return {
    name,
    default: { schema },
    locales,
  };
}

/**
 * Finds the best matching locale from available locales based on user preferences.
 *
 * @param {string[]} availableLocales - The locales that are available.
 * @param {string[]} preferredLocales - The user's preferred locales, in order of preference.
 * @returns {string|null} - The best matching locale or null if none match.
 */
export function findBestLocaleMatch(
  availableLocales,
  preferredLocales,
  strict = false
) {
  for (const preferred of preferredLocales) {
    // Check for exact match
    if (availableLocales.includes(preferred)) {
      return preferred;
    }

    // If not in strict mode, attempt to find a match based on language only
    if (!strict) {
      const language = preferred.split('-')[0];
      const matchedLocale = availableLocales.find((locale) =>
        locale.startsWith(language + '-')
      );

      if (matchedLocale) {
        return matchedLocale;
      }
    }
  }

  return null; // No match found
}

/**
 * `TemplateProxy` class.
 *
 * Represents a template that supports multiple locales.
 * The instance of this class is a Proxy that, when you access its properties,
 * it returns the localized data (if available) or the default data.
 */
class TemplateProxy {
  _locale = null;
  _locales = [];
  _name = '';
  //_location = '';
  _defaultData = null;
  _localizedData = null;

  /**
   * Private constructor to enforce the use of the static factory method.
   */
  constructor() {}

  /**
   * Static async factory method to create an instance of `TemplateProxyDraft`.
   *
   * @param {string} template_name - The name of the template.
   * @param {string|null} [locale=null] - The locale to be used for localization. Defaults to null.
   *
   * @returns {Proxy} - Returns a Proxy instance that serves localized or default data.
   */

  // CREATING SCHEMA instance here
  static async create(schema_folder, options = {}) {
    const { locale = null, forced_schema = null } = options;
    const instance = new TemplateProxy();

    let template;
    if (forced_schema !== null) {
      template = buildTemplateFromUploadedSchema(forced_schema);
    } 

    else {
      // Access schema via local schema_folder e.g. canada_covid19
      // Returns default template built from schema
      var schema = await fetchSchema(`/templates/${schema_folder}/schema.json`);

      // Error loading schema.
      if (!schema)
        template = {
          name: schema_folder,
          default: { 
            schema: {
              classes:{}
            } 
          },
          locales: {},
        };
      else {
        template = {
          name: schema_folder,
          default: { schema: schema },
          locales: {},
        };

        Object.entries(schema.extensions?.locales?.value || {})
          .forEach(([locale, locale_schema]) => {
            template.locales[locale] = {schema: deepMerge(schema, locale_schema) };
        });
      }
    }

    if (!template) {
      console.log(`ERROR in templates.js in loading template for ${schema_folder}, ${forced_schema}`);
    }

    // template = {name:..., default: {schema}, locales: {[locale]:{ schema}}}
    await instance._init(template, locale);

    // Proxy allows all of the template's properties to be called in an 
    // "inherited" fashion. Javascript allows all .get() functions to be
    // dot properties. 
    const proxy = new Proxy(instance, {
      // NOTE: rather than getters in the outside object, pass them through here

      // This .get() function overrides instance . access to .name, .updateLocale etc.
      get: function (target, property) {
        if (property === 'name') {
          return target._name;
        }
        if (property === 'updateLocale') {
          return target.updateLocale.bind(target);
        }
        if (property === 'localized' || property === 'current') {
          return target.current.bind(target)();
        }
        if (property === 'default') {
          return target._defaultData;
        }
        if (property === 'locales') {
          return target._locales;
        }

        if (property === 'translations') {
          return target._localizedData;
        }

        return target.current.bind(target)()[property];
      },

    });
    // initiate with a given locale
    if (locale !== null) proxy.updateLocale(locale);
    return proxy;
  }

  /**
   * Initialization method to asynchronously setup the template instance.
   *
   * @param {string} template_name - The name of the template.
   * @param {string|null} [locale=null] - The locale to be used for localization.
   *
   * @private
   */
  async _init(template, locale = null) {
    // Handling case where DataHarmonizer < 2.0 schema is being loaded.
    // Dynamically adding a Container class, with 1 tabular holding
    // class for each underlying class within schema classes (in range).
    if (typeof template.default.schema.classes.Container === 'undefined') {
      let empty_container = {
        name: 'Container',
        from_schema: template.default.schema.id,
        attributes: {},
      };

      Object.keys(template.default.schema.classes).forEach((class_name) => {
        if (class_name !== 'dh_interface')
          empty_container.attributes[class_name] = {
            owner: 'Container',
            domain_of: ['Container'],
            name: class_name + 's', // plural
            range: class_name,
            //alias: class_name,
            from_schema: template.default.schema.id,
            multivalued: false,
            inlined_as_list: true,
          };
      });

      template.default.schema.classes['Container'] = empty_container;
    }

    // HACK: not a guaranteed naming convention
    //const templateLocation =
    //  template.default.schema.name.toLowerCase().replace(/-/g, '');

    Object.assign(this, {
      _name: template.default.schema.name, // TODO: compatibility with local loading
      //_location: `/templates/${templateLocation}`,
      _locales: Object.freeze(Object.keys(template.locales).concat('default')),
      _locale: locale ? findBestLocaleMatch(this._locales, [locale]) : null,
      _defaultData: template.default,
      _localizedData: {
        ...template.locales,
        default: template.default,
      },
      default: template.default,
      localized: locale ? (locale === 'default')
          ? template.default : template.locales[locale]
        : null,
    });
  }

  current() {
    return this._locale !== null
      ? this._localizedData[this._locale]
      : this._defaultData;
  }

  /**
   * Method to change the localization of the proxy.
   *
   * @param {string} newLocale - The new locale to be set.
   *
   * @throws {LocaleNotSupportedError} If the provided locale is not supported by the template.
   */
  updateLocale(newLocale = null) {
    // HACK. rewrite code to allow 'default' to be a locale when accessed to produce this._defaultData
    if (newLocale == null || newLocale == 'en') {
      this._locale = null;
    } else {
      const bestLocale = findBestLocaleMatch(this._locales, [newLocale]);
      if (bestLocale !== null) {
        this._locale = bestLocale;
      } else {
        throw new LocaleNotSupportedError(
          `Locale ${newLocale} is not supported by the template.`
        );
      }
    }
    return this._locale;
  }
}

export function LocaleNotSupportedError(message = '') {
  this.name = 'LocaleNotSupportedError';
  this.message = message;
}
LocaleNotSupportedError.prototype = Error.prototype;

// Usage example:
// const proxyInstance = await TemplateProxy.create('template_name', 'en-US');
// proxyInstance.updateLocale('fr-FR');  // IETF language code designations

export const Template = TemplateProxy;

export default {
  TemplateProxy,
  Template,
  findBestLocaleMatch,
};
