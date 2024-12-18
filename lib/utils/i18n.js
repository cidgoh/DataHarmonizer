import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
// import tags from 'language-tags';

import { flattenObject } from './objects';
import label_translations_file from '../../web/translations/translations.json';
import { MULTIVALUED_DELIMITER, formatMultivaluedValue } from './fields';
import { renderContent } from './content';

export const interface_translation = transformStructFirstSpec(
  label_translations_file
);

// TODO: refactor `with*` to JSONPath
const withNamespace =
  (namespace, addons = {}) =>
  (obj) =>
    Object.entries(obj).reduce(
      (acc, [lang, translation]) => ({
        ...Object.assign(acc, {
          [lang]: {
            [namespace]: {
              ...translation,
              ...addons,
            },
          },
        }),
      }),
      {}
    );

const englishIsDefault = (translation_object) => {
  // if there is an english resource translation, use it as the default translation
  // direct assignment
  return typeof translation_object['en'] !== 'undefined'
    ? {
        ...translation_object,
        default: translation_object['en'],
      }
    : translation_object;
};

// langChangeCallback takes "lang" as argument
export function initI18n(langChangeCallback) {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    .use({
      type: 'postProcessor',
      name: 'markdownify',
      process: function (value /*key, options, translator*/) {
        return renderContent(value);
      },
    })
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init(
      {
        debug: false,
        fallbackLng: 'default',
        resources: {
          ...englishIsDefault(
            withNamespace('translation', {
              multiselect: {
                label: '{{ item_value, multiselectFormatter }}',
                arrow: '<div class="htAutocompleteArrow">▼</div>',
              },
              indent: '&nbsp;',
            })(interface_translation)
          ),
        }, // initial resources
        interpolation: {
          escapeValue: false,
        },
      },
      (err) => {
        if (err) return console.error(err);
        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $, {
          useOptionsAttr: true,
        });
      }
    );

  i18next.services.formatter.add(
    'multiselectFormatter',
    (val, lng, options) => {
      const { defaultValue, value } = options;
      let values = [];
      if (typeof defaultValue !== 'undefined') {
        values = defaultValue.split(MULTIVALUED_DELIMITER);
      } else {
        values = value;
      }
      return formatMultivaluedValue(values.map(i18next.t));
    }
  );

  i18next.services.formatter.add('markdownify', renderContent);

  i18next.on('languageChanged', langChangeCallback);
}

function transformLangFirstSpec(obj) {
  const flatRepresentation = flattenObject(obj);

  // Construct the nested structure from the flattened paths
  const result = {};
  for (let path in flatRepresentation) {
    if (Object.prototype.hasOwnProperty.call(flatRepresentation, path)) {
      const keys = path.split('.');
      const lang = keys[0];
      let currObj = result;

      for (let i = 1; i < keys.length; i++) {
        currObj[keys[i]] =
          currObj[keys[i]] || (i === keys.length - 1 ? {} : {});
        if (i === keys.length - 1) {
          currObj[keys[i]][lang] = flatRepresentation[path];
        } else {
          currObj = currObj[keys[i]];
        }
      }
    }
  }

  return result;
}
function transformStructFirstSpec(obj) {
  let result = {};

  function helper(currentObj, path) {
    for (let key in currentObj) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        if (
          typeof currentObj[key] === 'object' &&
          !Array.isArray(currentObj[key])
        ) {
          // If it's a nested object, continue drilling down.
          helper(currentObj[key], path.concat(key));
        } else {
          // It's a leaf node. At this point, `key` should be a language code.
          let lang = key;
          let text = currentObj[key];

          if (!result[lang]) {
            result[lang] = {};
          }

          let temp = result[lang];
          for (let i = 0; i < path.length; i++) {
            if (!temp[path[i]]) {
              temp[path[i]] = {};
            }

            // If it's the last element of the path, set the value.
            if (i === path.length - 1) {
              temp[path[i]] = text;
            } else {
              temp = temp[path[i]];
            }
          }
        }
      }
    }
  }

  helper(obj, []);

  return result;
}

function translateToDefault(value, defaultLng = 'en') {
  return i18next.t(value, { lng: defaultLng });
}

export function findLocalesForLangcodes(langcodes) {
  let locales = {};
  langcodes.forEach((locale) => {
    const langcode = locale.split('-')[0];
    // const nativeName = tags.language(langcode)
    //   ? tags.language(langcode).data.record.Description[0]
    //   : 'Default';
    const capitalize = (s) => s[0].toUpperCase() + s.slice(1);
    locales[langcode] = {
      langcode,
      nativeName: capitalize(getLanguageNameInLanguage(langcode)) || 'Default',
    };
  });
  return locales;
}

export const translateObject = (obj, lng = i18next.language, delimiter = '_') =>
  Object.entries(obj).reduce((acc, [key, val]) => {
    return Object.assign(acc, {
      [i18next.t(key.replace(/ /g, delimiter), { lng })]:
        val !== null ? i18next.t(val, { lng }) : null,
    });
  }, {});

export function getLanguageNameInLanguage(langCode) {
  if (typeof Intl.DisplayNames !== 'undefined') {
    const languageNames = new Intl.DisplayNames([langCode], {
      type: 'language',
    });
    return languageNames.of(langCode);
  } else {
    // Fallback implementation if Intl.DisplayNames is not supported
    const fallbackNames = {
      fr: 'français',
      es: 'español',
      ja: '日本語',
      // Add more fallbacks as needed
    };
    return fallbackNames[langCode] || null;
  }
}

// Example usage:
// console.log(getLanguageNameInLanguage('fr')); // Output: français
// console.log(getLanguageNameInLanguage('es')); // Output: español
// console.log(getLanguageNameInLanguage('ja')); // Output: 日本語
// console.log(getLanguageNameInLanguage('de')); // Output: null

export { transformLangFirstSpec, transformStructFirstSpec, translateToDefault };
