/**
 * Iterate through rules set up for named columns
 * Like matrixFieldChangeRules but this is triggered by a single change
 * by a user edit on a field cell. This creates complexity for fields that
 * work together, e.g. either of first two fields of 
 * [field][field unit][field bin] could have been focus of change.
 *
 * @param {Array} change array [row, col, ? , value]
 * @param {Object} fields See `data.js`.
 * @param {Array} triggered_changes array BY REFERENCE. One or more changes is
 *                appended to this.
 */
const fieldChangeRules = (change, fields, triggered_changes) => {

  const row = change[0];
  const col = change[1];
  const field = fields[col];

  // Test field against capitalization change.
  if (field.capitalize !== null && change[3] && change[3].length > 0) 
    change[3] = changeCase(change[3], field.capitalize);

  // Rules that require a particular column following and/or preceeding
  // current one.
  if (fields.length > col+1) {

    // We're prepping a SPARSE ARRAY here for binChangeTest()
    var matrix = [0];
    matrix[0] = {}; // Essential for creating sparse array.
    matrix[0][col] = change[3]; // prime changed value

    const prevName = (col > 0) ? fields[col-1].title : null;
    const nextName = (fields.length > col+1) ? fields[col+1].title : null;

    // Match <field>[field unit]
    if (nextName === field.title + ' unit') {

      if (field.datatype === 'xsd:date') {

        // Transform ISO 8601 date to bin year / month granularity.
        // "day" granularity is taken care of by regular date validation.
        // Don't attempt to reformat x/y/z dates here.
        const dateGranularity = window.HOT.getDataAtCell(row, col+1);
        // previously had to block x/y/z with change[3].indexOf('/') === -1 && 
        if (dateGranularity === 'year' || dateGranularity === 'month') {
          change[3] = setDateChange(dateGranularity, change[3]);
        }
        return;
      }

      // Match <field>[field unit][field bin]
      const nextNextName = (fields.length > col+2) ? fields[col+2].title : null;
      if (nextNextName === field.title + ' bin') {
        matrix[0][col+1] = window.HOT.getDataAtCell(row, col+1); //prime unit
        binChangeTest(matrix, row, col, fields, 2, triggered_changes);
        return;
      }
    }

    // Match <field>[field bin]
    if (nextName === field.title + ' bin') {
      binChangeTest(matrix, row, col, fields, 1, triggered_changes);
      return;
    }

    // Match [field]<field unit>
    if (field.title === prevName + ' unit') {

      // Match [field]<field unit>[field bin]
      if (prevName + ' bin' === nextName) {
        // trigger reevaluation of bin from field
        matrix[0][col-1] = window.HOT.getDataAtCell(row, col-1);
        binChangeTest(matrix, row, col-1, fields, 2, triggered_changes);
        return;
      }


      // Match previous field as date field
      // A change from month to year or day to month/year triggers new 
      // date value 
      if (fields[col-1].datatype === 'xsd:date' && (change[3] === 'year' || change[3] === 'month') ) {

        let dateString = window.HOT.getDataAtCell(row, col-1);
        // If there is a date entered, adjust it
        // previously had to block x/y/z with  && dateString.indexOf('/') === -1 
        if (dateString) {
          dateString = setDateChange(change[3], dateString);
          matrix[0][col-1] = dateString;
          triggered_changes.push([row, col-1, undefined, dateString]);
        }
        return;
      }
    }

  }

};


/**
 * Modify a string to match specified case.
 * @param {String} val String to modify.
 * @param {String} capitalize Case to modify string to; one of `'UPPER'`,
 *     `'lower'` or `'Title'`.
 * @return {String} String with modified case.
 */
const changeCase = (val, capitalize) => {
  switch (capitalize) {
    case 'lower':
      val = val.toLowerCase();
      break;
    case 'UPPER':
      val = val.toUpperCase();
      break;
    case 'Title':
      val = val.split(' ').
      map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).
      join(' ');
      break;

  }
  return val

};

/**
 * Modify matrix data for grid according to specified rules.
 * This is useful when calling `hot.loadData`, as cell changes from said method
 * are not recognized by `afterChange`.
 * @param {Array<Array<String>>} matrix Data meant for grid.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 * @return {Array<Array<String>>} Modified matrix.
 */
const matrixFieldChangeRules = (matrix, hot, data) => {
  const fields = getFields(data);
  for (let col=0; col < fields.length; col++) {

    const field = fields[col];

    // Test field against capitalization change.
    if (field.capitalize !== null) {
      for (let row=0; row < matrix.length; row++) {
        if (!matrix[row][col]) continue;
        matrix[row][col] = changeCase(matrix[row][col], field.capitalize);
      }
    }

    var triggered_changes = [];

    // Rules that require a column or two following current one.
    if (fields.length > col+1) {
      const nexttitle = fields[col+1].title;

      // Rule: for any "x bin" field label, following a "x" field,
      // find and set appropriate bin selection.
      if (nexttitle === field.title + ' bin') {
        binChangeTest(matrix, 0, col, fields, 1, triggered_changes);
      }
      // Rule: for any [x], [x unit], [x bin] series of fields
      else
        if (nexttitle === field.title + ' unit') {
          if (fields[col].datatype === 'xsd:date') {
            //Validate 
            for (let row=0; row < matrix.length; row++) {
              if (!matrix[row][col]) continue;
              const dateGranularity = matrix[row][col + 1];
              if (dateGranularity === 'year' || dateGranularity === 'month') {
                matrix[row][col] = setDateChange(dateGranularity, matrix[row][col]);
              }
            }
          }
          else if (fieldUnitBinTest(fields, col)) {
            // 2 specifies bin offset
            binChangeTest(matrix, 0, col, fields, 2, triggered_changes);
          }
        }
    }

    // Do triggered changes:
    for (const change of triggered_changes) {
      matrix[change[0]][change[1]] = change[3];
    }
  }

  return matrix;
}



/**
 * Adjust given dateString date to match year or month granularity given by
 * dateGranularity parameter. If month unit required but not supplied, then
 * a yyyy-__-01 will be supplied to indicate that month needs attention.
 *
 * @param {String} dateGranularity, either 'year' or 'month'
 * @param {String} ISO 8601 date string or leading part, possibly just YYYY or
                   YYYY-MM
 * @return {String} ISO 8601 date string.
 */
const setDateChange = (dateGranularity, dateString, dateBlank='__') => {

  var dateParts = dateString.split('-');
  // Incomming date may have nothing in it.
  if (dateParts[0].length > 0) {
    switch (dateGranularity) {
      case 'year':
        dateParts[1] = '01';
        dateParts[2] = '01';
        break
      case 'month':
        if (!dateParts[1])
          dateParts[1] = dateBlank; //by default triggers date validation error
        dateParts[2] = '01';
        break;
      default: 
        // do nothing
    }
  }
  // Update changed value (note "change" object overrides triggered_changes)
  return dateParts.join('-');

}

/**
 * Test to see if col's field is followed by [field unit],[field bin] fields
 * @param {Object} fields See `data.js`.
 * @param {Integer} column of numeric field.
 */
const fieldUnitBinTest = (fields, col) => {
  return ((fields.length > col+2) 
    && (fields[col+1].title == fields[col].title + ' unit') 
    && (fields[col+2].title == fields[col].title + ' bin'));
}

/**
 * Test [field],[field bin] or [field],[field unit],[field bin] combinations
 * to see if bin update needed.
 * @param {Array<Array<String>>} matrix Data meant for grid.
 * @param {Integer} rowOffset 
 * @param {Integer} col column of numeric field.
 * @param {Object} fields See `data.js`.
 * @param {Integer} binOffset column of bin field.
 * @param {Array} triggered_changes array of change which is appended to changes.
 */
const binChangeTest = (matrix, rowOffset, col, fields, binOffset, triggered_changes) => {
  for (let row in matrix) {
    const value = matrix[row][col];
    // For IMPORT, this is only run on fields that have a value.
    // Note matrix pass cell by reference so its content can be changed.
    if (value && value.length > 0) {
      // Do parseFloat rather than parseInt to accomodate fractional bins.
      let number = parseFloat(value);

      var selection = '';
      if (number >= 0) {
        // Here we have the 3 field call, with units sandwitched in the middle
        if (binOffset === 2) {
          const unit = matrix[row][col+1];
          // Host age unit is interpreted by default to be year.
          // If user selects month, value is converted into years for binning.
          // Future solution won't hardcode month / year assumption
          if (unit) {
            if (unit === 'month') {
              number = number / 12;
            }
          }
          // Force unit to be year if empty.
          //else {
          //  triggered_changes.push([rowOffset + parseInt(row), col+1, undefined, 'year']);
          //}

        }
        // .flatVocabulary is an array of string bin ranges e.g. "10 - 19"
        for (const number_range of fields[col+binOffset].flatVocabulary) {
          // ParseInt just looks at first part of number 
          if (number >= parseFloat(number_range)) {
            selection = number_range;
            continue;
          }
          break;
        }
      }
      else {
        // Integer/date field is a textual value, possibly a metadata 'Missing'
        // etc. If bin field has a value, leave it unchanged; but if it doesn't
        // then populate bin with input field metadata status too.
        const bin_value = window.HOT.getDataAtCell(rowOffset, col+binOffset);
        selection = bin_value; // Default value is itself.

        const bin_values = fields[col+binOffset].flatVocabulary;
        if (!bin_value || bin_value === '' && value in bin_values) {
          selection = value
        }
        // If a unit field exists, then set that to metadata too.
        if (binOffset == 2) {
          const unit_value = window.HOT.getDataAtCell(rowOffset, col+1);
          const unit_values = fields[col+1].flatVocabulary;
          if (!unit_value || unit_value === '' && value in unit_values) {
            triggered_changes.push([rowOffset + parseInt(row), col+1, undefined, value]);
          }
        }
      }
      triggered_changes.push([rowOffset + parseInt(row), col+binOffset, undefined, selection]);
    }
  }
}