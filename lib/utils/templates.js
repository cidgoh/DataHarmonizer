import { deepMerge } from './objects';
import { fetchFileAsync } from './files';
import { menu, getSchema } from 'schemas';

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

const schemaFromChildPath = (childPath) =>
  childPath.replace(/\/templates\/(.+)\/schema.json/, '$1');

// Returns default template built from schema
async function compileSchema(schema_folder) {
  // e.g. canada_covid19
  //for (const [schema_name, schema_obj] of Object.entries(menu)) {
  for (const schema_obj of Object.values(menu)) {
    if (schema_obj.folder === schema_folder) {
      var schema = await fetchSchema(`/templates/${schema_folder}/schema.json`);
      const template = {
        name: schema_folder,
        default: { schema: schema },
        locales: {},
      };

      if (schema_obj.locales) {
        for (const [index, locale] of schema_obj.locales.entries()) {
          if (index > 0) {
            // Skip first default locale since it is the main schema.json file
            let locale_schema = await fetchSchema(
              `/templates/${schema_folder}/locales/${locale}/schema.json`
            );
            let merged_schema = deepMerge(schema, locale_schema);
            template.locales[locale] = { schema: merged_schema };
          }
        }
      }

      return template;
    }
  }

  return null;
}

async function fetchSchema(path) {
  // Running locally via file:// ... index.html so get schema from schemas.json
  if (window.location.protocol.startsWith('file')) {
    return await getSchema(schemaFromChildPath(path));
  } else if (window.location.protocol.startsWith('http')) {
    // path e.g. /templates/canada_covid19/locales/fr/schema.json
    return await fetchFileAsync(path);
  }

  return null;
}

//Used only in this script in create()
function buildTemplateFromUploadedSchema(schema) {
  const name = schema.name || ''; // Brand new schema
  const locales = {};

  if (schema.in_language) {
    const languages = Array.isArray(schema.in_language)
      ? schema.in_language
      : [schema.in_language];

    // PROBABLY IGNORE THESE SINCE UPLOADED SCHEMA DOESN'T COME WITH locales
    languages.forEach((locale) => {
      locales[locale] = { schema };
      locales;
    });
  }

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

  // CREATING SCHEMA instance here
  static async create(schema_folder, options = {}) {
    const { locale = null, forced_schema = null } = options;
    const instance = new TemplateProxy();

    let template;
    if (forced_schema !== null) {
      template = buildTemplateFromUploadedSchema(forced_schema);
    } else {
      // Access schema_folder via menu content
      template = await compileSchema(schema_folder);
    }

    if (!template) {
      console.log(
        'ERROR in templates.js in loading template for ',
        schema_folder,
        forced_schema
      );
    }
    // template = {name:..., default: {schema}, locales: {[locale]:{ schema}}}
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
    // Handling case where DataHarmonizer < 2.0 schema is being loaded.
    // Dynamically adding a Container class, with 1 tabular holding
    // class for each underlying class within schema classes (in range).
    if (typeof template.default.schema.classes['Container'] === 'undefined') {
      let fake_container = {
        name: 'Container',
        from_schema: template.default.schema.id,
        attributes: {},
      };

      const class_names = Object.keys(template.default.schema.classes).filter(
        (key) => key !== 'dh_interface'
      );

      class_names.forEach((class_name) => {
        fake_container.attributes[class_name] = {
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

// Usage example:
// const proxyInstance = await TemplateProxy.create('template_name', 'en-US');
// proxyInstance.updateLocale('fr-FR');  // IETF language code designations

export const Template = TemplateProxy;

export default {
  TemplateProxy,
  Template,
  findBestLocaleMatch,
};
