import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';

import { flattenObject } from '@/lib/utils/objects';
import label_translations_file from '@/web/translations/translations.json';
import { formatMultivaluedValue } from '@/lib/utils/fields';

export const labels = transformStructFirstSpec(label_translations_file);

// TODO: refactor `with*` to JQ
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

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $(document).localize();
  // HACK
};

// langChangeCallback takes "lang" as argument
export function initI18n(langChangeCallback = rerender) {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init(
      {
        debug: false,
        fallbackLng: 'en',
        resources: {
          ...withNamespace('translation', {
            multiselect: {
              label: '{{ value, multiselectFormatter }}',
              arrow: '<div class="htAutocompleteArrow">▼</div>',
            },
          })(labels),
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
        rerender();
      }
    );

  i18next.services.formatter.add('multiselectFormatter', (value) => {
    return formatMultivaluedValue(value.map(i18next.t));
  });

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

export { transformLangFirstSpec, transformStructFirstSpec, translateToDefault };