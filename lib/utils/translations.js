import label_translations_file from '@/web/translations/translations.json';

function transformLangFirstSpec(obj) {
    // Check if the current object is a language mapping
    if (typeof obj === 'object' && !Array.isArray(obj) && Object.values(obj).every(value => typeof value === 'string')) {
        // obj has language mappings
        return obj;
    }

    // Otherwise, recurse into the object
    let result = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let transformedSubObj = transformLangFirstSpec(obj[key]);
            for (let lang in transformedSubObj) {
                if (!result[lang]) {
                    result[lang] = {};
                }
                result[lang]['translation'][key] = transformedSubObj[lang];
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
console.log(JSON.stringify(transformed, null, 4));

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
console.log(JSON.stringify(transformStructFirstSpec(initialObject), null, 4));

// expect the structure-first style
export default labels = transformStructFirstSpec(label_translations_file);
export const sample_labels = {
    en: {
      translation: {
        head: {
          title: 'My Awesome Landing-Page',
          description: 'The description of this awesome landing page.'
        },
        intro: {
          title: 'Landing Page',
          subTitle: 'Some subtitle'
        }
      }
    },
    de: {
      translation: {
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
  }