import template_manifest from '@/web/templates/manifest.json';
import { deepMerge } from '@/lib/utils/objects';
import { fetchFileAsync } from '@/lib/utils/files';

const isSchema = (el) => el.name === 'schema.json';
const isDocumentation = (el) => el.extension === '.md';
const isLocale = (el) => el.name === 'locales';

export async function accessTemplate(template_name) {
  const template = template_manifest.children.find(el => el.name === template_name);
  return template ? processNode(template) : null;
}

async function processNode(node) {
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
        let schemaData = await fetchFileAsync(child.path);
        schema.push(schemaData);
      } else if (isDocumentation(child)) {
        let docData = await fetchFileAsync(child.path);
        documentation.push(docData);
      } else if (isLocale(child)) {
        const processedLocale = await processNode(child);
        if (processedLocale.length) {
          locales.push(processedLocale);
        }
      } else {
        // Handle other generic nodes recursively
        const processedChild = await processNode(child);
        if (processedChild.length) {
          locales.push(processedChild);
        }
      }
    }),
  );
  return [name, [schema, documentation], locales];
}

export function buildTemplate(input) {
  // Check if the input format is correct
  if (!Array.isArray(input) || input.length !== 3) {
    throw new Error("Invalid input format. Expected an array of 3 elements.");
  }

  const [name, innerArray, locale_nodes] = input;

  // Check the innerArray format
  if (!Array.isArray(innerArray) || innerArray.length !== 2) {
    throw new Error("Invalid format for the second parameter. Expected an array of 2 elements.");
  }

  const [schemas, documentations] = innerArray;

  if (!Array.isArray(schemas) || !Array.isArray(documentations)) {
    throw new Error("Schemas and Documentations must be arrays.");
  }

  const schema = schemas[0];
  const documentation = documentations[0];

  if (!Array.isArray(locale_nodes) || locale_nodes.length === 0) {
    throw new Error("Locale_nodes must be a non-empty array.");
  }

  let locales;
  try {
    locales = locale_nodes[0][2];
  } catch (err) {
    throw new Error("Error extracting locales from locale_nodes.");
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
        throw new Error("Invalid localization format. Expected an array with at least 3 elements.");
      }
      const locale_label = localization[0];
      const schemaMerge = localization[1][0] && localization[1][0][0]
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
    throw new Error("Error processing locales. " + err.message);
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
  strict = false,
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
        locale.startsWith(language + '-'),
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
  // TODO
  static async create(template_name, locale) {
    const instance = new TemplateProxy();
    await instance.init(template_name, locale);
    return new Proxy(instance, {
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
        return target.current.bind(target)()[property];
      },
    });
  }

  current() {
    return this._locale !== null ? this._localizedData[this._locale] : this._defaultData;
  }

  /**
   * Initialization method to asynchronously setup the template instance.
   *
   * @param {string} template_name - The name of the template.
   * @param {string|null} [locale=null] - The locale to be used for localization.
   *
   * @private
   */
  async init(template_name, locale = null) {
    const template = buildTemplate(await accessTemplate(template_name));

    Object.assign(this, {
      _name: template_name,
      _locales: Object.freeze(Object.keys(template.locales)),
      _locale: locale ? findBestLocaleMatch(this._locales, [locale]) : null,
      _defaultData: template.default,
      _localizedData: template.locales,
      default: template.default,
      localized: locale ? template.locales[locale] : null
    });
  }

  /**
   * Method to change the localization of the proxy.
   *
   * @param {string} newLocale - The new locale to be set.
   *
   * @throws {Error} If the provided locale is not supported by the template.
   */
  updateLocale(newLocale = null) {
    if (newLocale == null || newLocale == 'default') {
      this._locale = null;
    } else {
      const bestLocale = findBestLocaleMatch(this._locales, [newLocale]);
      if (bestLocale !== null) {
        this._locale = bestLocale;
      } else {
        throw new Error(`Locale ${newLocale} is not supported by the template.`);
      }
    };
    return this._locale;
  }
}

// Usage example:
// const proxyInstance = await TemplateProxy.create('template_name', 'en-US');
// proxyInstance.changeLocale('fr-FR');  // IETF language code designations

export const Template = TemplateProxy;

export default {
  TemplateProxy
};
