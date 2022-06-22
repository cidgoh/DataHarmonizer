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
      // Normalised value being suggested for update
      if (value != field.flatVocabulary[ptr])
        update = field.flatVocabulary[ptr];
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
  let value_array = delimited_string.split(';');
  value_array.forEach(function (value, index) {
    const [valid, update] = validateValAgainstVocab(value, field);
    if (!valid) return [false, false];
    if (update) {
      update_flag = true;
      value_array[index] = update;
    }
  });
  if (update_flag) return [true, value_array.join(';')];
  else return [true, false];
}
