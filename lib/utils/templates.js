import template_manifest from '@/web/templates/manifest.json';
import { deepMerge } from '@/lib/utils/objects';
import { fetchFileAsync } from '@/lib/utils/files';

const isSchema = (el) => el.name === 'schema.json';
const isDocumentation = (el) => el.extension === '.md';
const isLocale = (el) => el.name === 'locales';

const schemaFromChildPath = (childPath) =>
  childPath.replace(/\/templates\/(.+)\/schema.json/, '$1');
async function importSchema(schema_path) {
  const template = (
    await import(`../../web/templates/${schema_path}/schema.json`)
  ).default;
  return template;
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
  return [name, [schema, documentation], locales];
}

export function buildTemplate(input) {
  // Check if the input format is correct
  if (!Array.isArray(input) || input.length !== 3) {
    throw new Error('Invalid input format. Expected an array of 3 elements.');
  }

  let [name, innerArray, locale_nodes] = input;

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

  if (!Array.isArray(locale_nodes) || locale_nodes.length === 0) {
    locale_nodes = [[], [], []];
    // throw new Error("Locale_nodes must be a non-empty array.");
  }

  let locales;
  try {
    locales = locale_nodes[0][2];
  } catch (err) {
    throw new Error('Error extracting locales from locale_nodes.');
  }

  if (!Array.isArray(locales)) {
    locales = []; // Ensure that locales is an empty array if not properly formatted
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
      const doc = localization[2][0] || null;
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
    const { locale = null, overrides = { fetchFileImpl: templateFetcher } } =
      options;
    const instance = new TemplateProxy();
    await instance._init(template_name, locale, overrides);

    // NOTE: Why Proxy? it allows us to call all of the template's properties in an "inherited" fashion
    const proxy = new Proxy(instance, {
      // NOTE: rather than getters in the outside object, pass them through here
      get: function (target, property) {
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
  async _init(template_name, locale = null, { fetchFileImpl }) {

    const template = buildTemplate(
      await accessTemplate(template_name, fetchFileImpl)
    );

    if (typeof template.default.schema.classes['Container'] === 'undefined') {

      let fake_container = {
        name: "Container",
        from_schema: template_name,
        attributes: {}
      }

      const class_names = Object.keys(template.default.schema.classes).filter(
        (key) => key !== 'dh_interface'
      );

      class_names.forEach(cls => {
        fake_container.attributes[cls] = {
          owner: "Container",
          domain_of: ["Container"],
          name: cls,
          range: cls,
          alias: cls,
          from_schema: template_name,
          multivalued: false,
          inlined_as_list: true
        }
      })
     
      template.default.schema.classes['Container'] = fake_container;
    }

    Object.assign(this, {
      _name: template_name,
      _location: `/templates/${template_name}`,
      _locales: Object.freeze(Object.keys(template.locales).concat('default')),
      _locale: locale ? findBestLocaleMatch(this._locales, [locale]) : null,
      _defaultData: template.default,
      _localizedData: template.locales,
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
   * @throws {Error} If the provided locale is not supported by the template.
   */
  updateLocale(newLocale = null) {
    if (newLocale == null) {
      this._locale = null;
    } else {
      const bestLocale = findBestLocaleMatch(this._locales, [newLocale]);
      if (bestLocale !== null) {
        this._locale = bestLocale;
      } else {
        throw new Error(
          `Locale ${newLocale} is not supported by the template.`
        );
      }
    }
    return this._locale;
  }
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