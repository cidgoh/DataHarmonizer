import { deepMerge } from '@/lib/utils/objects';
import { fetchFileAsync } from '@/lib/utils/files';

import template_manifest from '@/web/templates/manifest.json';
import menu from '@/web/templates/menu.json';

export function getTemplatePathInScope() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  if (templatePath === null || typeof templatePath === 'undefined') {
    const schema_name = Object.keys(menu)[0];
    const template_name = Object.keys(menu[schema_name])[0];
    return `${schema_name}/${template_name}`;
  }
  return templatePath;
}

export async function templatePathForSchemaURI(schemaURI) {
  // resolve the schema URI
  // for now, this is just the manifest
  for (let i = 0; i < template_manifest.children.length; i++) {
    const template = template_manifest.children[i];
    if (typeof template.children !== 'undefined') {
      const schema = await importSchema(template.name);
      if (schema.id === schemaURI) {
        return `${template.path.split('/').slice(-1)}/${schemaURI
          .split('/')
          .slice(-1)}`;
      } else {
        continue;
      }
    }
  }
  return null;
}

const isSchema = (el) => el.name === 'schema.json';
const isDocumentation = (el) => el.extension === '.md';
const isLocale = (el) => el.name === 'locales';

const schemaFromChildPath = (childPath) =>
  childPath.replace(/\/templates\/(.+)\/schema.json/, '$1');

async function importSchema(schema_name) {
  const schema = (
    await import(`../../web/templates/${schema_name}/schema.json`)
  ).default;
  return schema;
}
const importSchemaFromChildPath = (childPath) =>
  importSchema(schemaFromChildPath(childPath));

const templateFetcher = async (childPath) => {
  if (window.location.protocol.startsWith('file')) {
    return importSchemaFromChildPath(childPath);
  } else if (window.location.protocol.startsWith('http')) {
    return fetchFileAsync(childPath);
  }
};

export async function accessTemplate(
  template_name,
  fetchFileImpl = templateFetcher
) {
  const template = template_manifest.children.find(
    (el) => el.name === template_name
  );
  return template ? processNode(template, fetchFileImpl) : null;
}

async function processNode(node, fetchFileImpl = templateFetcher) {
  const { name, children } = node;

  // Base case
  if (!children || children.length === 0) {
    return [];
  }

  let schema = [];
  let documentation = [];
  let locales = [];

  await Promise.all(
    children.map(async (child) => {
      if (isSchema(child)) {
        let schemaData = await fetchFileImpl(child.path);
        schema.push(schemaData);
      } else if (isDocumentation(child)) {
        let docData = await fetchFileImpl(child.path);
        documentation.push(docData);
      } else if (isLocale(child)) {
        const processedLocale = await processNode(child, fetchFileImpl);
        if (processedLocale.length) {
          locales.push(processedLocale);
        }
      } else {
        // Handle other generic nodes recursively
        const processedChild = await processNode(child, fetchFileImpl);
        if (processedChild.length) {
          locales.push(processedChild);
        }
      }
    })
  );

  const folded_template_spec = [name, [schema, documentation], locales];
  return folded_template_spec;
}

export function buildTemplate(input) {
  // Check if the input format is correct
  if (!Array.isArray(input) || input.length !== 3) {
    throw new Error('Invalid input format. Expected an array of 3 elements.');
  }

  let [name, innerArray, childFolders] = input;

  // Check the innerArray format
  if (!Array.isArray(innerArray) || innerArray.length !== 2) {
    throw new Error(
      'Invalid format for the second parameter. Expected an array of 2 elements.'
    );
  }

  const [schemas, documentations] = innerArray;

  if (!Array.isArray(schemas) || !Array.isArray(documentations)) {
    throw new Error('Schemas and Documentations must be arrays.');
  }

  const schema = schemas[0];
  const documentation = documentations[0];

  if (!Array.isArray(childFolders) || childFolders.length === 0) {
    childFolders = [[], [], []];
  }

  const locales_folder = childFolders.filter((ln) => ln[0] === 'locales')[0];
  let locales = [];
  if (typeof locales_folder !== 'undefined') {
    try {
      if (Array.isArray(locales_folder) && locales_folder.length > 2) {
        locales = locales_folder[2];
      } else {
        throw new Error(
          'locales_folder is not an array or does not have enough elements.'
        );
      }
    } catch (err) {
      throw new Error(`Error extracting locales from childFolders: ${err}`);
    }

    if (!Array.isArray(locales)) {
      throw new Error('Locales is not an array.');
    }
  }

  let template = {
    name,
    default: {
      schema,
      documentation,
    },
    locales: {},
  };

  try {
    template.locales = locales.reduce((acc, localization) => {
      if (!Array.isArray(localization) || localization.length < 3) {
        throw new Error(
          'Invalid localization format. Expected an array with at least 3 elements.'
        );
      }
      const locale_label = localization[0];
      const schemaMerge =
        localization[1][0] && localization[1][0][0]
          ? deepMerge(schemas[0], localization[1][0][0])
          : null;
      const doc = localization[2][0] || {};
      return Object.assign(acc, {
        [locale_label]: {
          schema: schemaMerge,
          documentation: doc,
        },
      });
    }, {});
  } catch (err) {
    throw new Error('Error processing locales. ' + err.message);
  }

  return template;
}

export function buildTemplateFromUploadedSchema(schema) {
  const name = schema.name || '';
  const locales = {};

  if (schema.in_language) {
    const languages = Array.isArray(schema.in_language)
      ? schema.in_language
      : [schema.in_language];
    languages.forEach((locale) => {
      locales[locale] = { schema, documentation: null };
      locales;
    });
  }

  return {
    name,
    default: { schema, documentation: null },
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
  _location = '';
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

  static async create(template_name, options = {}) {
    const {
      locale = null,
      forced_schema = null,
      fetchFileImpl = templateFetcher,
    } = options;
    const instance = new TemplateProxy();

    let template;
    if (forced_schema !== null) {
      template = buildTemplateFromUploadedSchema(forced_schema);
    } else {
      // access template from directory in the manifest
      const fetchedTemplateData = await accessTemplate(
        template_name,
        fetchFileImpl
      );
      template = buildTemplate(fetchedTemplateData);
    }

    await instance._init(template, locale);

    // NOTE: Why Proxy? it allows us to call all of the template's properties in an "inherited" fashion
    const proxy = new Proxy(instance, {
      // NOTE: rather than getters in the outside object, pass them through here
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
        if (property === 'location') {
          return target._location;
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
    if (typeof template.default.schema.classes['Container'] === 'undefined') {
      let fake_container = {
        name: 'Container',
        from_schema: template.default.schema.id,
        attributes: {},
      };

      const class_names = Object.keys(template.default.schema.classes).filter(
        (key) => key !== 'dh_interface'
      );

      class_names.forEach((cls) => {
        fake_container.attributes[cls] = {
          owner: 'Container',
          domain_of: ['Container'],
          name: cls,
          range: cls,
          alias: cls,
          from_schema: template.default.schema.id,
          multivalued: false,
          inlined_as_list: true,
        };
      });

      template.default.schema.classes['Container'] = fake_container;
    }

    // HACK: not a guaranteed naming convention
    const toTemplateLocationName = (name) =>
      name.toLowerCase().replace(/-/g, '');
    const templateLocation = toTemplateLocationName(
      template.default.schema.name
    );

    Object.assign(this, {
      _name: template.default.schema.name, // TODO: compatibility with local loading
      _location: `/templates/${templateLocation}`,
      _locales: Object.freeze(Object.keys(template.locales).concat('default')),
      _locale: locale ? findBestLocaleMatch(this._locales, [locale]) : null,
      _defaultData: template.default,
      _localizedData: {
        ...template.locales,
        default: template.default,
      },
      default: template.default,
      localized: locale
        ? locale === 'default'
          ? template.default
          : template.locales[locale]
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

export const rangeToContainerClass = (Container, cls_key) => {
  try {
    return Object.values(Container.attributes)
      .filter((v) => 'range' in v)
      .filter((v) => v.range === cls_key)[0].name;
  } catch {
    return cls_key;
  }
};

/**
 * Finds the slot names for a given class within the schema.
 * @param {Object} schema - The schema object containing "classes".
 * @param {string} class_name - The name of the class to search for slot names.
 * @returns {Array} An array of slot names.
 */
export function findSlotNamesForClass(schema, class_name) {
  return Object.keys(schema.classes[class_name].slot_usage).map((field) => {
    return schema.classes[class_name].slot_usage[field].name;
  });
}

// Usage example:
// const proxyInstance = await TemplateProxy.create('template_name', 'en-US');
// proxyInstance.updateLocale('fr-FR');  // IETF language code designations

export const Template = TemplateProxy;

export default {
  TemplateProxy,
  Template,
  accessTemplate,
  buildTemplate,
  findBestLocaleMatch,
};
