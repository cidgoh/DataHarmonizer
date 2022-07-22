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
