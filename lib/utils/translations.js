import label_translations_file from '@/web/translations/translations.json';
import { flattenObject } from "@/lib/utils/objects"

// TODO
function translateFromLocalizedTemplate() {
    throw Error("Not Yet Implemented")
};

function transformLangFirstSpec(obj) {
    const flatRepresentation = flattenObject(obj);

    // Construct the nested structure from the flattened paths
    const result = {};
    for (let path in flatRepresentation) {
        const keys = path.split('.');
        const lang = keys[0];
        let currObj = result;

        for (let i = 1; i < keys.length; i++) {
            currObj[keys[i]] = currObj[keys[i]] || (i === keys.length - 1 ? {} : {});
            if (i === keys.length - 1) {
                currObj[keys[i]][lang] = flatRepresentation[path];
            } else {
                currObj = currObj[keys[i]];
            }
        }
    }

    return result;
}

function transformStructFirstSpec(obj) {
    let result = {};

    function helper(currentObj, path) {
        for (let key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
                if (typeof currentObj[key] === 'object' && !Array.isArray(currentObj[key])) {
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

const source = {
    "fr": {
         "nav": {
              "header": {
                   "greeting": "bonjour"
               }
         }
    },
    "en": {
         "nav": {
              "header": {
                   "greeting": "hello"
               }
         }
    }
 };
const transformed = transformLangFirstSpec(source);
const initialObject = {
    nav: {
        header: {
            greeting: {
                en: "hello",
                fr: "bonjour"
            }
        }
    }
};

// expect the structure-first style
export const labels = transformStructFirstSpec(label_translations_file);
export const sample_labels = {
    en: {
        head: {
          title: 'My Awesome Landing-Page',
          description: 'The description of this awesome landing page.'
        },
        intro: {
          titale: 'Landing Page',
          subTitle: 'Some subtitle'
        }
    },
    fr: {
        'case_id': 'le case identifique'
    },
    de: {
        head: {
          title: 'Meine grossartige Webseite',
          description: 'Die Beschreibung dieser grossartigen Webseite.'
        },
        intro: {
          title: 'Webseite',
          subTitle: 'Ein Untertitel'
        }
    }
  }

  export const resources = {
    en: {
      translation: {
        "third_party_lab_service_provider_name": "Third Party Lab Service Provider Name",
        "case_ID": "Case ID",  // English translation for case_id
        // ... other English translations,
      }
    },
    fr: {
      translation: {
        "third_party_lab_service_provider_name": "Nom du fournisseur de services de laboratoire tiers",
        "case_ID": "ID du cas",  // French translation for case_id
        // ... other French translations
        "GENEPIO_0001128_0": "n'applicable-pas"
      }
    },
    // ... other languages
  };

  export {
    transformLangFirstSpec,
    transformStructFirstSpec
  }