import template_manifest from '@/web/templates/manifest.json';

/**
 * Deeply merges two objects, prioritizing values from the localized object.
 *
 * Recursively merges two objects, giving precedence to values in the localized object.
 * String values from the localized object are prioritized over the default object.
 *
 * @param {Object} defaultObj - The default object with base values.
 * @param {Object} localizedObj - The localized object containing specific overrides.
 * @returns {Object} - A new object resulting from the deep merge.
 */
export function deepMerge(defaultObj, localizedObj) {
  let result = { ...defaultObj }; // Copy the default object

  for (let key in localizedObj) {
    if (
      result.hasOwnProperty(key) &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], localizedObj[key]); // Recursive merge
    } else if (
      typeof result[key] === 'string' ||
      typeof localizedObj[key] === 'string'
    ) {
      result[key] = localizedObj[key]; // Merge strings (like labels, descriptions)
    }
  }

  return result;
}

/**
 * Retrieves the nested value of an object based on a given string path.
 *
 * @param {Object} obj - The object from which to retrieve the value.
 * @param {string} path - The string path to the desired value, using dot notation.
 *
 * @returns {*} The value at the specified path within the object, or `undefined`
 *              if the path does not exist.
 *
 * @example
 * const data = {
 *   user: {
 *     address: {
 *       city: 'New York'
 *     }
 *   }
 * };
 *
 * console.log(getNestedValue(data, 'user.address.city')); // Outputs: 'New York'
 * console.log(getNestedValue(data, 'user.age'));          // Outputs: undefined
 */
export function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

/**
 * Asynchronously accesses and imports a module from a specified folder path.
 *
 * This function dynamically imports a module from a given folder path using
 * the provided `folder_path`. It returns the default export of the module.
 * If the import fails, an error message is logged, and an optional default
 * or fallback value is returned.
 *
 * @param {string} folder_path - The relative path to the folder containing the module.
 * @returns {Promise<any>} - A promise that resolves with the module's default export
 *                          or the specified default/fallback value on failure.
 */
// TODO: refactor to readFileAsync
export async function accessFile(folder_path) {
  try {
    const data = await import(`${folder_path}`);
    return data;
  } catch (error) {
    console.error(`Failed to load ${folder_path}`);
    throw error;
    return null; // or some default/fallback value
  }
}

// TODO
const accessFileFromAbsPath = async (relative_path) =>
  await accessFile(
    `../../${relative_path}`,
  );
const accessJSONFile = (json_path) => accessFileFromAbsPath(json_path);
const accessDocumentationFile = (doc_file) =>
  accessFileFromAbsPath(doc_file).default.text();

const isSchema = (el) => el.name === 'schema.json';
const isDocumentation = (el) => el.extension === '.md';
const isLocale = (el) => el.name === 'locales';

export async function accessTemplate(template_name) {
  const template = template_manifest.children.find(
    (el) => el.name === template_name,
  );
  if (!template) return null;

  return processNode(template);
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
        //console.log('is schema', child.path);
        let schemaData = await accessJSONFile(child.path);
        schema.push(schemaData);
      } else if (isDocumentation(child)) {
        let docData = await accessDocumentationFile(child.path);
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

export function buildTemplate([name, [schemas, documentations], locale_nodes]) {
  const schema = schemas[0];
  const documentation = documentations[0];
  const locales = locale_nodes[0][2];
  const template = {
    name,
    default: {
      schema,
      documentation,
    },
    locales: locales.reduce((acc, localization) => {
      const locale_label = localization[0];
      const schema = localization[1][0][0]
        ? deepMerge(schemas[0], localization[1][0][0])
        : null;
      const documentation = localization[2][0] ? localization[2][0] : null;
      return Object.assign(acc, {
        [locale_label]: {
          schema,
          documentation,
        },
      });
    }, {}),
  };
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

    this._name = template_name;
    this._locales = Object.freeze(Object.keys(template.locales));
    if (locale !== null) this._locale = findBestLocaleMatch(this._locales, [locale]);
    this._defaultData = template.default;
    this._localizedData = template.locales;

    this.default = this._defaultData;
    this.localized = this._localizedData[this._locale];

    return this;

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
