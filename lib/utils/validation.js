import { formatMultivaluedValue, parseMultivaluedValue } from './fields';

/**
 * Test cellVal against "DataHarmonizer provenance: vX.Y.Z" pattern and if it
 * needs an update, do so.
 * @param {Array} provenanceChanges array of provenance updates
 * @param {String} version version text
 * @param {Object} cellVal field value to be tested.
 * @param {Integer} row index of data
 * @param {Integer} column index of data
 */
export function checkProvenance(provenanceChanges, version, cellVal, row, col) {
  if (!cellVal) {
    provenanceChanges.push([row, col, version]);
    return;
  }
  // Most of the time this is the first return point.
  if (cellVal === version) return;

  if (cellVal.substring(0, 14) !== 'DataHarmonizer') {
    provenanceChanges.push([row, col, version + ';' + cellVal]);
    return;
  }
  // At this point we have a leading "DataHarmonizer v..." string
  let splitVal = cellVal.split(';', 2);

  if (splitVal.length == 1) provenanceChanges.push([row, col, version]);
  else provenanceChanges.push([row, col, version + ';' + splitVal[1]]);

  return;
}

/**
 * Simplifies logic to compare number or date ranges where test limit
 * is either min_inclusive or max_inclusive
 * @param {Date or Number} item_1 First value to compare
 * @param {Date or Number} item_2 Second value to compare
 * @param {Boolean} gt Type of comparison: 0 = > , 1 = <
 * @return {Boolean} Result of comparison
 */
export function itemCompare(item_1, item_2, gt) {
  if (gt == 1) return item_1 > item_2;
  return item_1 < item_2;
}

/**
 * Test a given number against an upper or lower range, if any.
 * @param {Number} number to be compared.
 * @param {Object} field that contains min and max limits.
 * @return {Boolean} validity of field.
 */
export function testNumericRange(number, field) {
  if (field.minimum_value !== '') {
    if (number < field.minimum_value) {
      return false;
    }
  }
  if (field.maximum_value !== '') {
    if (number > field.maximum_value) return false;
  }
  return true;
}

/**
 * Validate a value against an array of source values.
 * FUTURE: optimize - to precompile lowercased sources.
 * @param {String} val Cell value.
 * @param {Object} field Field to look for flatVocabulary value in.
 * @return {Array<Boolean><Boolean/String>}
 *         [false, false] `delimited_string` does not match `source`,
 *         [true, false] `delimited_string` matches `source` exactly,
 *         [true, string] `delimited_string` matches`source` but formatting needs change
 */
export function validateValAgainstVocab(value, field) {
  let valid = false;
  let update = false;
  if (value) {
    const trimmedVal = value.trim().toLowerCase();
    const ptr = field.flatVocabularyLCase.indexOf(trimmedVal);
    if (ptr >= 0) {
      valid = true;
      // Normalised value being suggested for update;
      // .trim() because flatVocabulary has indentation.
      let val_trim = field.flatVocabulary[ptr].trim();
      if (value != val_trim) {
        update = val_trim;
      }
    }
  }

  return [valid, update];
}

/**
 * Validate csv values against an array of source values.  Leading/tailing
 * whitespace and case are ignored in validation, but returned value will be
 * a suggested update to one or more values if any differ in capitalization.
 * @param {String} delimited_string of values to validate.
 * @param {Object} field to validate values against.
 * @return {Array<Boolean><Boolean/String>}
 *         [false, false] If some value in `delimited_string` is not in `source`,
 *         [true, false] If every value in `delimited_string` is exactly in `source`,
 *         [true, string] If every value in `delimited_string` is in `source` but formatting needs change
 */
export function validateValsAgainstVocab(delimited_string, field) {
  let update_flag = false;
  let value_array = parseMultivaluedValue(delimited_string);
  // for-loop construct ensures return is out of this function.
  for (let index = 0; index < value_array.length; index++) {
    let value = value_array[index];
    const [valid, update] = validateValAgainstVocab(value, field);
    if (!valid) return [false, false];
    if (update) {
      update_flag = true;
      value_array[index] = update;
    }
  }
  if (update_flag) return [true, formatMultivaluedValue(value_array)];
  else return [true, false];
}

/**
 * This function accepts an array of arrays. The inner arrays should contain
 * null or primitive values. The return value is an array of booleans with
 * the same length as the longest inner array of the input. The value of the
 * n-th element of the output is true if the combination of n-th elements from
 * each input array is distinct from the m-th elements of the input arrays for
 * all m != n. In the case where there is only one inner array in the input,
 * this is identical to determining whether each element of the array is unique.
 *
 * @param {Array<Array<any>>} columns to validate
 * @return {Array<boolean>}
 *         whether each row represents a unique combination of values
 */
export function validateUniqueValues(values) {
  const results = [];

  // In the event that the column arrays are of unequal length, make sure
  // that we iterate through the longest one.
  const longestColumn = Math.max.apply(
    null,
    values.map((col) => col.length)
  );

  const previousValues = new Map();
  for (let row = 0; row < longestColumn; row += 1) {
    const rowValue = values.map((col) => col[row]);
    // Since each column value coming from Handsontable will be a string or null
    // this should be a safe way to produce a unique hash for the row. If there
    // are edge cases where this doesn't work we could look at more robust
    // solutions (e.g. https://github.com/puleos/object-hash).
    const rowHash = rowValue.join('\u0000');

    // If we have seen this hash value before it will be in the previousValues
    // map. The key will be the row where we last saw it. This means we have a
    // duplicate and both this row and the previous row need to be marked as
    // in valid.
    let rowValid = true;
    if (previousValues.has(rowHash)) {
      const previousRow = previousValues.get(rowHash);
      results[previousRow] = false;
      rowValid = false;
    }

    // Save this row's hash for comparison with future rows
    previousValues.set(rowHash, row);
    results[row] = rowValid;
  }
  return results;
}
