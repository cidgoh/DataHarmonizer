import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';

import tags from 'language-tags';
import { flattenObject } from '@/lib/utils/objects';
import label_translations_file from '@/web/translations/translations.json';

console.log(tags.language('en'), tags.language('fr'));

// TODO: refactor to a package or list of codes
// TODO: map to what's supported for the template?
export const languages = {
  en: {
    nativeName: tags.language('en').data.record.Description[0],
    langcode: 'en',
  },
  fr: {
    nativeName: tags.language('fr').data.record.Description[0],
    langcode: 'fr',
  },
};

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $('table').localize();
};

// langChangeCallback takes "lang" as argument
export function initI18n(langChangeCallback = () => {}) {
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
        resources,
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

// TODO: test
// transformLangFirstSpec(source);

// An example object input:
// const inObj = {
//   fr: {
//     nav: {
//       header: {
//         greeting: 'bonjour',
//       },
//     },
//   },
//   en: {
//     nav: {
//       header: {
//         greeting: 'hello',
//       },
//     },
//   },
// };

// An example object output:
// const outObj = {
//   nav: {
//     header: {
//       greeting: {
//         en: 'hello',
//         fr: 'bonjour',
//       },
//     },
//   },
// };

// expect the structure-first style

export const labels = transformStructFirstSpec(label_translations_file);
export const sample_labels = {
  en: {
    head: {
      title: 'My Awesome Landing-Page',
      description: 'The description of this awesome landing page.',
    },
    fr: {
      case_id: 'le case identifique',
    },
    de: {
      head: {
        title: 'Meine grossartige Webseite',
        description: 'Die Beschreibung dieser grossartigen Webseite.',
      },
      intro: {
        title: 'Webseite',
        subTitle: 'Ein Untertitel',
      },
    },
  },
};

export const resources = {
  en: {
    translation: {
      third_party_lab_service_provider_name:
        'Third Party Lab Service Provider Name',
      case_ID: 'Case ID', // English translation for case_id
      // ... other English translations,
    },
  },
  fr: {
    translation: {
      third_party_lab_service_provider_name:
        'Nom du fournisseur de services de laboratoire tiers',
      case_ID: 'ID du cas',

      // ... other French translations
      GENEPIO_0001128_0: "n'applicable-pas",
    },
  },
  // ... other languages
};

Object.entries(resources).forEach(([lang, { translation }]) => {
  i18next.addResources(lang, 'translation', translation);
});

export { transformLangFirstSpec, transformStructFirstSpec };
