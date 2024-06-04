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
      Object.prototype.hasOwnProperty.call(result, key) &&
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
 * Flatten a nested object structure into a flat representation.
 *
 * @param {Object} obj - The source object to flatten.
 * @returns {Object} - The flattened object representation.
 *
 * @example
 * // Simple Nested Object
 * const person = {
 *   name: 'Alex',
 *   address: {
 *     street: '123 Maple St',
 *     city: 'Springfield',
 *     zip: '62701'
 *   }
 * };
 * const flatPerson = flattenObject(person);
 * // Output:
 * // {
 * //   'name': 'Alex',
 * //   'address.street': '123 Maple St',
 * //   'address.city': 'Springfield',
 * //   'address.zip': '62701'
 * // }
 *
 * @example
 * // Deeply Nested Object
 * const config = {
 *   server: {
 *     host: 'localhost',
 *     port: 8080,
 *     database: {
 *       name: 'mydb',
 *       credentials: {
 *         user: 'admin',
 *         password: 'secret'
 *       }
 *     }
 *   }
 * };
 * const flatConfig = flattenObject(config);
 * // Output:
 * // {
 * //   'server.host': 'localhost',
 * //   'server.port': 8080,
 * //   'server.database.name': 'mydb',
 * //   'server.database.credentials.user': 'admin',
 * //   'server.database.credentials.password': 'secret'
 * // }
 *
 * @example
 * // Object with Arrays (Arrays are not flattened)
 * const userData = {
 *   user: 'jdoe',
 *   preferences: {
 *     notifications: {
 *       email: true,
 *       sms: false,
 *     },
 *     themes: ['dark', 'light']
 *   }
 * };
 * const flatUserData = flattenObject(userData);
 * // Output:
 * // {
 * //   'user': 'jdoe',
 * //   'preferences.notifications.email': true,
 * //   'preferences.notifications.sms': false,
 * //   'preferences.themes': ['dark', 'light']
 * // }
 */

// this.context.template.current.schema.classes.GRDI_Sample.attribute.id.title      // english by default
// this.context.template.locale['fr'].schema // french version
// this.context.template.locale['en'].schema // english version
// this.context.template.setLocale('fr')
// this.context.template.current.schema.classes.GRDI_Sample.attribute.id.title      // the french schema

{/* <div data-i18n="schema.classes.GRDI_Sample.attribute.id.title">
  localize
</div>
$(document).localize(); */}

export function flattenObject(obj) {
  const flatRepresentation = {};

  function flatten(currPath, currObj) {
    for (let key in currObj) {
      if (Object.prototype.hasOwnProperty.call(currObj, key)) {
        const newPath = currPath ? `${currPath}.${key}` : key;

        if (typeof currObj[key] === 'object' && !Array.isArray(currObj[key])) {
          flatten(newPath, currObj[key]);
        } else {
          flatRepresentation[newPath] = currObj[key];
        }
      }
    }
  }
  flatten('', obj);

  return flatRepresentation;
}

/* Find key in nested object (nested dictionaries)
 * Adapted from: https://codereview.stackexchange.com/questions/73714/find-a-nested-property-in-an-object
 *
 * @param {Dictionary<Dictionary>} o nested Dictionaries
 * @param {String}Key to find in dictionaries
 * @return {Dictionary} or null
 */
export function findById(o, key) {
  if (key in o) return o[key];
  var result, p;
  for (p in o) {
    if (
      Object.prototype.hasOwnProperty.call(o, p) &&
      typeof o[p] === 'object'
    ) {
      result = this.findById(o[p], key);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

/**
 * Inverts the keys and values of an object.
 * If a value is duplicated, the last key encountered will overwrite the others.
 *
 * @param {Object} obj - The object to invert.
 * @returns {Object} - The inverted object.
 */
export function invert(obj) {
  // Check if input is an object
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Input must be a non-null object');
  }

  // Create an empty object to store the inverted key-value pairs
  const inverted = {};

  // Iterate over the keys of the input object
  for (const key in obj) {
    // Check if the key is an own property of the object (not inherited)
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is not undefined
      if (value !== undefined) {
        // If the value is already present in the inverted object, overwrite it
        if (inverted[value] !== undefined) {
          console.warn(
            `Duplicate value "${value}" encountered. Overwriting previous key "${inverted[value]}" with "${key}".`
          );
        }
        // Add the key-value pair to the inverted object
        inverted[value] = key;
      }
    }
  }

  // Return the inverted object
  return inverted;
}
