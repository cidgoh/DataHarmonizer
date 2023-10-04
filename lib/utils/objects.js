
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
 * Flatten a nested object structure into a flat representation.
 *
 * @param {Object} obj - The source object to flatten.
 * @returns {Object} - The flattened object representation.
 */
export function flattenObject(obj) {
    const flatRepresentation = {};

    function flatten(currPath, currObj) {
        for (let key in currObj) {
            if (currObj.hasOwnProperty(key)) {
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