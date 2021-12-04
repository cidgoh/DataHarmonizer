/**
 * Get a collection of all invalid cells in the grid.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 * @return {Object<Number, Object<Number, String>>} Object with invalid rows as
 *     keys, and objects containing the invalid cells for the row, along with a
 *     message explaining why, as values. e.g,
 *     `{0: {0: 'Required cells cannot be empty'}}`
 */
const getInvalidCells = (hot, data) => {
  const invalidCells = {};
  const fields = getFields(data);

  const regexDecimal = /^(-|\+|)(0|[1-9]\d*)(\.\d+)?$/;
  let uniquefield = []; // holds lookup dictionary for any unique columns

  let provenanceChanges = [];

  for (let row=0; row<hot.countRows(); row++) {
    if (hot.isEmptyRow(row)) continue;

    for (let col=0; col<fields.length; col++) {
      const cellVal = hot.getDataAtCell(row, col);
      const field = fields[col];
      const datatype = field.datatype;
      let valid = true;
      // TODO we could have messages for all types of invalidation, and add
      //  them as tooltips
      let msg = '';

      // 1st row of provenance datatype field is forced to have a 
      // 'DataHarmonizer Version: 0.13.0' etc. value.  Change happens silently. 
      if (datatype === 'provenance') {
        checkProvenance(provenanceChanges, cellVal, row, col);
      };

      if (!cellVal) {
        valid = (field.required !== true);
        msg = 'Required cells cannot be empty'
      } 
      else {
        // If field's vocabulary comes from a (categorical) source:
        if (field.source) {
            if (field.multivalued === true) {
              [valid, update] = validateValsAgainstVocab(cellVal, field.flatVocabulary);
              if (update) hot.setDataAtCell(row, col, update, 'thisChange');
            }
            else {
              [valid, update] = validateValAgainstVocab(cellVal, field.flatVocabulary);
              if (update) hot.setDataAtCell(row, col, update, 'thisChange');
              console.log('changing',cellVal, update)
            }
        }
        else {
          switch (datatype) {
           
            case 'xsd:nonNegativeInteger':
              const parsedInt = parseInt(cellVal, 10);
              valid = !isNaN(cellVal) && parsedInt>=0
              valid &= parsedInt.toString()===cellVal;
              valid &= testNumericRange(parsedInt, field);
              break;

            case 'xsd:decimal':
              const parsedDec = parseFloat(cellVal);
              valid = !isNaN(cellVal) && regexDecimal.test(cellVal);
              valid &= testNumericRange(parsedDec, field);
              break;

            case 'xsd:date':
              // moment is a date format addon
              valid = moment(cellVal, 'YYYY-MM-DD', true).isValid();
              if (valid) {
                valid = testDateRange(cellVal, field);
              }
              break;

          }
        }
        // Test regular expression if it is given
        if (valid && field.pattern) {
          valid = field.pattern.test(cellVal);
        }
      }

      // Unique value field (Usually xsd:token string)
      // CORRECT PLACE FOR THIS? 
      if (field.identifier && field.identifier === true) {

        // Set up dictionary and count for this column's unique values
        if (!uniquefield[col]) {
          uniquefield[col] = {};
          for (let keyrow=0; keyrow<hot.countRows(); keyrow++) {
            if (!hot.isEmptyRow(keyrow)) {
              let key = hot.getDataAtCell(keyrow, col);
              if (key in uniquefield[col])
                uniquefield[col][key] += 1;
              else
                uniquefield[col][key] = 1;
            }
          }
        }
        // Must be only 1 unique value.  Case insensitive comparison
        valid &= uniquefield[col][cellVal] === 1;  
      }

      if (!valid && field.metadata_status) {
        [valid, update] = validateValAgainstVocab(cellVal, field.dataStatus);
        if (update) hot.setDataAtCell(row, col, update, 'thisChange');
      }
      if (!valid) {
        if (!invalidCells.hasOwnProperty(row)) {
          invalidCells[row] = {};
        }
        invalidCells[row][col] = msg;
      }
    }
  }
  // Here an array of (row, column, value)... is being passed
  if (provenanceChanges.length)
    hot.setDataAtCell(provenanceChanges);

  return invalidCells;
};

/**
 * Test cellVal against DataHarmonizer provenance: vX.Y.Z pattern and if it needs an
 * update, do so.
 * @param {Array} provenanceChanges array of provenance updates
 * @param {Object} cellVal field value to be tested.
 * @param {Integer} row index of data
 * @param {Integer} column index of data
 */
const checkProvenance = (provenanceChanges, cellVal, row, col) => {

  if (!cellVal) {
    provenanceChanges.push([row, col, VERSION_TEXT]);
    return;
  }
  // Most of the time this is the first return point.
  if (cellVal === VERSION_TEXT)
    return;

  if (cellVal.substring(0,14) !== 'DataHarmonizer') {
    provenanceChanges.push([row, col, VERSION_TEXT + ';' + cellVal]);
    return;
  }
  // At this point we have a leading "DataHarmonizer v..." string
  let splitVal = cellVal.split(';',2);

  if (splitVal.length == 1)
    provenanceChanges.push([row, col, VERSION_TEXT]);
  else
    provenanceChanges.push([row, col, VERSION_TEXT + ';' + splitVal[1]]);

  return
}


/**
 * Test a given number against an upper or lower range, if any.
 * @param {Number} number to be compared.
 * @param {Object} field that contains min and max limits.
 * @return {Boolean} validity of field.
 */
const testNumericRange = (number, field) => {

  if (field.minimum_value !== '') {
    if (number < field.minimum_value) {
      return false
    }
  }
  if (field.maximum_value !== '') {
    if (number > field.maximum_value) 
      return false
  }
  return true
}

/**
 * Test a given date against an upper or lower range, if any.
 * @param {Date} date to be compared.
 * @param {Object} field that contains min and max limits.
 * @return {Boolean} validity of field.
 */
const testDateRange = (aDate, field) => {

  if (field.minimum_value !== '') {
    if (aDate < field.minimum_value) {
      return false
    }
  }
  if (field.maximum_value !== '') {
    if (aDate > field.maximum_value) 
      return false
  }
  return true
}

/**
 * Validate a value against an array of source values.
 * FUTURE: optimize - to precompile lowercased sources.
 * @param {String} val Cell value.
 * @param {Array<String>} source Source values.
 * @return {Array<Boolean><Boolean/String>} 
 *         [false, false] `delimited_string` does not match `source`,
 *         [true, false] `delimited_string` matches `source` exactly, 
 *         [true, string] `delimited_string` matches`source` but formatting needs change
 */
const validateValAgainstVocab = (value, source) => {
  let valid = false;
  let update = false;
  if (value) {
    const trimmedSource =
        source.map(sourceVal => sourceVal.trim().toLowerCase());
    const trimmedVal = value.trim().toLowerCase();
    const ptr = trimmedSource.indexOf(trimmedVal);
    if (ptr >= 0 ) {
      valid = true;
      // Normalised value being suggested for update 
      if (value != source[ptr])
        update = source[ptr];
    }
  }
  return [valid, update];
};

/**
 * Validate csv values against an array of source values.  Leading/tailing 
 * whitespace and case are ignored in validation, but returned value will be 
 * a suggested update to one or more values if any differ in capitalization.
 * @param {String} delimited_string of values to validate.
 * @param {Array<String>} source Values to validate against.
 * @return {Array<Boolean><Boolean/String>} 
 *         [false, false] If some value in `delimited_string` is not in `source`,
 *         [true, false] If every value in `delimited_string` is exactly in `source`, 
 *         [true, string] If every value in `delimited_string` is in `source` but formatting needs change
 */
const validateValsAgainstVocab = (delimited_string, source) => {
  let update_flag = false;
  let value_array = delimited_string.split(';');
  value_array.forEach(function (value, index) {
    [valid, update] = validateValAgainstVocab(value, source);
    if (!valid) return [false, false];
    if (update) {
      update_flag = true;
      value_array[index] = update;
    }
  })
  if (update_flag)
    return [true, value_array.join(';')];
  else 
    return [true, false];
};