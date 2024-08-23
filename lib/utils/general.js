import { consolidate } from '@/lib/utils/objects';

export function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function callIfFunction(value) {
  if (typeof value === 'function') {
    return await value();
  } else {
    return value;
  }
}

/**
 * Validates `$('#specify-headers-input')` input.
 * @param {Array<Array<String>>} matrix
 * @param {number} row 1-based index used to indicate header row in matrix.
 */
export function isValidHeaderRow(matrix, row) {
  return Number.isInteger(row) && row > 0 && row <= matrix.length;
}

/**
 * Return true if all the values of the given array are null or an empty string
 * @param {Array} row
 */
export function rowIsEmpty(row) {
  return !row.some((col) => col != null && col !== '');
}

/**
 * Logging function used for debugging, it logs the supplied argument to the console.
 * @param {*} id - The item to be logged.
 * @returns {*} The same item passed in.
 */
export const tap = (id) => {
  console.log(id);
  return id;
};

export const nullValuesToString = (obj) =>
  consolidate(obj, (acc, [key, val]) =>
    Object.assign(acc, {
      [key]: val === null ? '' : val,
    })
  );

export function stripDiv(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
}

export const isEmptyUnitVal = (value) =>
  typeof value === 'undefined' || value === null || value === '';

export function pascalToLowerWithSpaces(str) {
  // Add a space before each uppercase letter, except the first one
  let result = str.replace(/([A-Z])/g, ' $1').trim();
  // Convert to lowercase
  return result.toLowerCase();
}
