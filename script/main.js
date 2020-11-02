/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 */

/* A list of templates available for this app, which will be displayed in a 
 * menu. A template can also be accessed by adding it as a folder name in the
 * URL parameter:
 *
 * main.html?template=test_template
 *
 * but it won't be added to the template menu.
 *
 */
const VERSION = '0.13.3'; //Version 0.13.3
const TEMPLATES = {
  'CanCOGeN Covid-19': {'folder': 'canada_covid19', 'status': 'published'},
  'PHAC Dexa (ALPHA)': {'folder': 'phac_dexa', 'status': 'draft'},
  'GRDI (ALPHA)':      {'folder': 'grdi', 'status': 'draft'},
  'GISAID (ALPHA)':    {'folder': 'gisaid', 'status': 'draft'}
};

/**
 * Controls what dropdown options are visible depending on grid settings.
 */
const toggleDropdownVisibility = () => {
  $('.hidden-dropdown-item').hide();

  $('#file-dropdown-btn-group').off()
      .on('show.bs.dropdown', () => {
        if (jQuery.isEmptyObject(INVALID_CELLS)) {
          $('#export-to-dropdown-item').removeClass('disabled');
        } else {
          $('#export-to-dropdown-item').addClass('disabled');
        }
      });


  $('#settings-dropdown-btn-group').off()
      .on('show.bs.dropdown', () => {
        const hiddenCols = HOT.getPlugin('hiddenColumns').hiddenColumns;
        const hiddenRows = HOT.getPlugin('hiddenRows').hiddenRows;

        if (hiddenCols.length) {
          $('#show-all-cols-dropdown-item').show();
        } else {
          $('#show-required-cols-dropdown-item').show();
        }

        if (hiddenRows.length) {
          $('#show-all-rows-dropdown-item').show();
        }

        if (!jQuery.isEmptyObject(INVALID_CELLS)) {
          $('#show-invalid-rows-dropdown-item').show();
        }
        const validRowCount = HOT.countRows() - HOT.countEmptyRows();
        if (validRowCount > Object.keys(INVALID_CELLS).length) {
          $('#show-valid-rows-dropdown-item').show();
        }
      })
      .on('hide.bs.dropdown', () => {
        $('.hidden-dropdown-item').hide();
      });
};

/**
 * Post-processing of values in `data.js` at runtime. This calculates for each
 * categorical field (table column) in data.js a flat list of allowed values
 * in field.flatVocabulary,
 * @param {Object} data See `data.js`.
 * @return {Object} Processed values of `data.js`.
 */
const processData = (data) => {
  // Useful to have this object for fields with a "source" vocabulary
  const flatVocabularies = {};
  const fields = getFields(data);
  for (const field of fields) {
    if (field.vocabulary) {
      flatVocabularies[field.fieldName] =
          stringifyNestedVocabulary(field.vocabulary);
    }
  }

  for (const parent of data) {
    for (const child of parent.children) {
      if (child.vocabulary) {
        child.flatVocabulary = flatVocabularies[child.fieldName];

        if (child.source) {
          // Duplicate vocabulary from other source field
          child.flatVocabulary =
              [...child.flatVocabulary, ...flatVocabularies[child.source]];
        }

        // Change case as needed
        for (const [i, val] of child.flatVocabulary.entries()) {
          if (!val || !child.capitalize) continue;
          child.flatVocabulary[i] = changeCase(val, child.capitalize);
        }
      }
    }
  }
  return data;
};

/**
 * Modify a string to match specified case.
 * @param {String} val String to modify.
 * @param {String} capitalize Case to modify string to; one of `'UPPER'`,
 *     `'lower'` or `'Title'`.
 * @return {String} String with modified case.
 */
const changeCase = (val, capitalize) => {
  if (capitalize === 'lower') {
    return val.replace(/\w/g, (char) => char.toLowerCase());
  } else if (capitalize === 'UPPER') {
    return val.replace(/\w/g, (char) => char.toUpperCase());
  } else if (capitalize === 'Title') {
    val = val.substr(0, 1).toUpperCase() + val.substr(1);
    return val.replace(/\W\w/g, (str) => {
      return str[0] + str[1].toUpperCase();
    });
  } else {
    return val;
  }
};

/**
 * Get a flat array of all fields in `data.json`.
 * @param {Object} data See `data.json`.
 * @return {Array<Object>} Array of all objects under `children` in `data.json`.
 */
const getFields = (data) => {
  return Array.prototype.concat.apply([], data.map(parent => parent.children));
};

/**
 * Create a blank instance of Handsontable.
 * @param {Object} data See `data.js`.
 * @return {Object} Handsontable instance.
 */
const createHot = (data) => {
  const fields = getFields(data);
  const hot = Handsontable($('#grid')[0], {
    nestedHeaders: getNestedHeaders(data),
    columns: getColumns(data),
    colHeaders: true,
    rowHeaders: true,
    minRows: 100,
    minSpareRows: 100,
    width: '100%',
    height: '75vh',
    fixedColumnsLeft: 1,
    hiddenColumns: {
      copyPasteEnabled: true,
      indicators: true,
      columns: [],
    },
    hiddenRows: {
      rows: [],
    },
    // Handsontable's validation is extremely slow with large datasets
    invalidCellClassName: '',
    licenseKey: 'non-commercial-and-evaluation',
    beforeChange: function(changes, source) {
      if (!changes) return;

      // When a change in one field triggers a change in another field.
      var triggered_changes = []; 

      for (const change of changes) {
        const column = change[1];
        // Check field change rules
        fieldChangeRules(change, fields, triggered_changes);
      }
      // Add any indirect field changes onto end of existing changes.
      if (triggered_changes) 
        changes.push(...triggered_changes);
    },
    afterRender: () => {
      $('#header-row').css('visibility', 'visible');
      $('#footer-row').css('visibility', 'visible');
      // Bit of a hackey way to add classes to secondary headers
      $('.secondary-header-text').each((_, e) => {
        const $cellElement = $(e).closest('th');
        if ($(e).hasClass('required')) {
          $cellElement.addClass('secondary-header-cell required');
        } else if ($(e).hasClass('recommended')) {
          $cellElement.addClass('secondary-header-cell recommended');
        } else {
          $cellElement.addClass('secondary-header-cell');
        }
      });
    },
    afterRenderer: (TD, row, col) => {
      if (INVALID_CELLS.hasOwnProperty(row)) {
        if (INVALID_CELLS[row].hasOwnProperty(col)) {
          const msg = INVALID_CELLS[row][col];
          $(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
        }
      }
    },
  });

  return enableMultiSelection(hot, data);
};

/**
 * Create a matrix containing the nested headers supplied to Handsontable.
 * These headers are HTML strings, with useful selectors for the primary and
 * secondary header cells.
 * @param {Object} data See `data.js`.
 * @return {Array<Array>} Nested headers for Handontable grid.
 */
const getNestedHeaders = (data) => {
  const rows = [[], []];
  for (const parent of data) {
    rows[0].push({
      label: `<h5 class="pt-2 pl-1">${parent.fieldName}</h5>`,
      colspan: parent.children.length
    });
    for (const child of parent.children) {
      const req = child.requirement;
      const name = child.fieldName;
      rows[1].push(`<div class="secondary-header-text ${req}">${name}</div>`);
    }
  }
  return rows;
};

/**
 * Create a matrix containing the grid's headers. Empty strings are used to
 * indicate merged cells.
 * @param {Object} data See `data.js`.
 * @return {Array<Array<String>>} Grid headers.
 */
const getFlatHeaders = (data) => {
  const rows = [[], []];
  for (const parent of data) {
    rows[0].push(parent.fieldName);
    rows[0].push(...Array(parent.children.length - 1).fill(''));
    rows[1].push(...parent.children.map(child => child.fieldName));
  }
  return rows;
};

/**
 * Create an array of cell properties specifying data type for all grid columns.
 * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
 * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
 * @param {Object} data See `data.js`.
 * @return {Array<Object>} Cell properties for each grid column.
 */
const getColumns = (data) => {
  let ret = [];
  for (const field of getFields(data)) {
    const col = {};
    if (field.requirement) col.requirement = field.requirement;
    switch (field.datatype) {
      case 'xs:date': 
        col.type = 'date';
        col.dateFormat = 'YYYY-MM-DD';
        break;
      case 'select':
        col.type = 'autocomplete';
        col.source = field.flatVocabulary;
        if (field.dataStatus) col.source.push(...field.dataStatus);
        col.trimDropdown = false;
        break;
      case 'xs:nonNegativeInteger':
      case 'xs:decimal':
        if (field.dataStatus) {
          col.type = 'autocomplete';
          col.source = field.dataStatus;
        }
        break;
      case 'multiple':
        // TODO: we need to find a better way to enable multi-selection
        col.editor = 'text';
        col.renderer = 'autocomplete';
        col.source = field.flatVocabulary;
        break;
    }
    ret.push(col);
  }
  return ret;
};

/**
 * Recursively flatten vocabulary into an array of strings, with each string's
 * level of depth in the vocabulary being indicated by leading spaces.
 * e.g., `vocabulary: 'a': {'b':{}},, 'c': {}` becomes `['a', '  b', 'c']`.
 * @param {Object} vocabulary See `vocabulary` fields in `data.js`.
 * @param {number} level Nested level of `vocabulary` we are currently
 *     processing.
 * @return {Array<String>} Flattened vocabulary.
 */
const stringifyNestedVocabulary = (vocabulary, level=0) => {

  let ret = [];
  for (const val of Object.keys(vocabulary)) {
    if (val != 'exportField') { // Ignore field map values used for export.
      ret.push('  '.repeat(level) + val);
      ret = ret.concat(stringifyNestedVocabulary(vocabulary[val], level+1));
    }
  }
  return ret;
};

/**
 * Enable multiselection on select rows.
 * This isn't really robust, and we should find a better way to do this.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @return {Object} Grid instance with multiselection enabled on columns
 * specified as such in the vocabulary.
 */
const enableMultiSelection = (hot, data) => {
  const fields = getFields(data);
  hot.updateSettings({
    afterBeginEditing: function(row, col) {
      if (fields[col].datatype === 'multiple') {
        const value = this.getDataAtCell(row, col);
        let selections = value && value.split(';') || [];
        selections = selections.map(x => x.trim());
        selections2 = selections.filter(function (el) {return el != ''});
        // Cleanup of empty values that can occur with leading/trailing or double ";"
        if (selections.length != selections2.length)
          this.setDataAtCell(row, col, selections2.join('; '), 'thisChange');
        const self = this;
        let content = '';
        fields[col].flatVocabulary.forEach(function(field, i) {
          const field_trim = field.trim()
          let selected = selections.includes(field_trim) ? 'selected="selected"' : '';
          content += `<option value="${field_trim}" ${selected}'>${field}</option>`;
        })

        $('#field-description-text').html(`${fields[col].fieldName}<select multiple class="multiselect" rows="15">${content}</select>`);
        $('#field-description-modal').modal('show');
        $('#field-description-text .multiselect')
          .chosen() // must be rendered when html is visible
          .change(function () {
            let newValCsv = $('#field-description-text .multiselect').val().join('; ')
            self.setDataAtCell(row, col, newValCsv, 'thisChange');
          }); 
      }
    },
  });
  return hot;
};

/**
 * Get grid data without trailing blank rows.
 * @param {Object} hot Handonstable grid instance.
 * @return {Array<Array<String>>} Grid data without trailing blank rows.
 */
const getTrimmedData = (hot) => {
  const gridData = hot.getData();
  let lastEmptyRow = -1;
  for (let i=gridData.length; i>=0; i--) {
    if (hot.isEmptyRow(i)) {
      lastEmptyRow = i;
    } else {
      break;
    }
  }

  return lastEmptyRow === -1 ? gridData : gridData.slice(0, lastEmptyRow);
};

/**
 * Run void function behind loading screen.
 * Adds function to end of call queue. Does not handle functions with return
 * vals, unless the return value is a promise. Even then, it only waits for the
 * promise to resolve, and does not actually do anything with the value
 * returned from the promise.
 * @param {function} fn - Void function to run.
 * @param {Array} [args=[]] - Arguments for function to run.
 */
const runBehindLoadingScreen = (fn, args=[]) => {
  $('#loading-screen').show('fast', 'swing', function() {
    setTimeout(() => {
      const ret = fn.apply(null, args);
      if (ret && ret.then) {
        ret.then(() => {
          $('#loading-screen').hide();
        });
      } else {
        $('#loading-screen').hide();
      }
    }, 0);
  });
};

/**
 * Download matrix to file.
 * @param {Array<Array<String>>} matrix Matrix to download.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 * @param {Object} xlsx SheetJS variable.
 */
const exportFile = (matrix, baseName, ext, xlsx) => {

  const worksheet = xlsx.utils.aoa_to_sheet(matrix);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  if (ext === 'xlsx') {
    xlsx.writeFile(workbook, `${baseName}.xlsx`);
  } else if (ext === 'xls') {
    xlsx.writeFile(workbook, `${baseName}.xls`);
  } else if (ext === 'tsv') {
    xlsx.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
  } else if (ext === 'csv') {
    xlsx.writeFile(workbook, `${baseName}.csv`, {bookType: 'csv', FS: ','});
  }
};

/**
 * Open file specified by user.
 * Only opens `xlsx`, `xlsx`, `csv` and `tsv` files. Will launch the specify
 * headers modal if the file's headers do not match the grid's headers.
 * @param {File} file User file.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 * @return {Promise<>} Resolves after loading data or launching specify headers
 *     modal.
 */
const openFile = (file, hot, data, xlsx) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      $('#file_name_display').text(file.name);
      const workbook = xlsx.read(e.target.result, {type: 'binary', raw: true});
      const worksheet =
          updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);
      const params = [worksheet, {header: 1, raw: false, range: 0}];
      const matrix = (xlsx.utils.sheet_to_json(...params));
      const headerRowData = compareMatrixHeadersToGrid(matrix, data);
      if (headerRowData > 0) {
        hot.loadData(matrixFieldChangeRules(matrix.slice(headerRowData), hot, data));
      } else {
        launchSpecifyHeadersModal(matrix, hot, data);
      }
      resolve();
    }
  });
};

/**
 * Ask user to specify row in matrix containing secondary headers before load.
 * Calls `alertOfUnmappedHeaders` if necessary.
 * @param {Array<Array<String>} matrix Data that user must specify headers for.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 */
const launchSpecifyHeadersModal = (matrix, hot, data) => {
  $('#expected-headers-div')
      .html(getFlatHeaders(data)[1].join('   '));
  $('#actual-headers-div')
      .html(matrix[1].join('    '));
  $('#specify-headers-modal').modal('show');
  $('#specify-headers-confirm-btn').click(() => {
    const specifiedHeaderRow =
        parseInt($('#specify-headers-input').val());
    if (!isValidHeaderRow(matrix, specifiedHeaderRow)) {
      $('#specify-headers-err-msg').show();
    } else {
      const mappedMatrixObj =
          mapMatrixToGrid(matrix, specifiedHeaderRow-1, data);
      $('#specify-headers-modal').modal('hide');
      runBehindLoadingScreen(() => {
        hot.loadData(matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2), hot, data));
        if (mappedMatrixObj.unmappedHeaders.length) {
          alertOfUnmappedHeaders(mappedMatrixObj.unmappedHeaders);
        }
      });
    }
  });
};

/**
 * Alert user of unmapped headers in a pop-up modal.
 * @param {Array<String>} unmappedHeaders Unmapped headers.
 */
const alertOfUnmappedHeaders = (unmappedHeaders) => {
  const unmappedHeaderDivs =
      unmappedHeaders.map(header => `<li>${header}</li>`);
  $('#unmapped-headers-list').html(unmappedHeaderDivs);
  $('#unmapped-headers-modal').modal('show');
};

/**
 * Improve `XLSX.utils.sheet_to_json` performance for Libreoffice Calc files.
 * Ensures sheet range is accurate. See
 * https://github.com/SheetJS/sheetjs/issues/764 for more detail.
 * @param {Object} worksheet SheetJs object.
 * @returns {Object} SheetJs worksheet with correct range.
 */
const updateSheetRange = (worksheet) => {
  const range = {s:{r:20000000, c:20000000},e:{r:0,c:0}};
  Object.keys(worksheet)
      .filter((x) => {return x.charAt(0) !== '!'})
      .map(XLSX.utils.decode_cell).forEach((x) => {
        range.s.c = Math.min(range.s.c, x.c);
        range.s.r = Math.min(range.s.r, x.r);
        range.e.c = Math.max(range.e.c, x.c);
        range.e.r = Math.max(range.e.r, x.r);
      });
  worksheet['!ref'] = XLSX.utils.encode_range(range);
  return worksheet;
}

/**
 * Determine if first or second row of a matrix has the same headers as the 
 * grid's secondary (2nd row) headers.  If neither, return false.
 * @param {Array<Array<String>>} matrix
 * @param {Object} data See `data.js`.
 * @return {Integer} row that data starts on, or false if no exact header row
 * recognized.
 */
const compareMatrixHeadersToGrid = (matrix, data) => {
  const expectedSecondRow = getFlatHeaders(data)[1];
  const actualFirstRow = matrix[0];
  const actualSecondRow = matrix[1];
  if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow))
    return 1;
  if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow))
    return 2;
  return false;
};

/**
 * Validates `$('#specify-headers-input')` input.
 * @param {Array<Array<String>>} matrix
 * @param {number} row 1-based index used to indicate header row in matrix.
 */
const isValidHeaderRow = (matrix, row) => {
  return Number.isInteger(row) && row > 0 && row <= matrix.length;
};

/**
 * `mapMatrixToGrid` return value.
 * @typedef {Object} MappedMatrixObj
 * @property {Array<Array<String>>} matrix Mapped matrix.
 * @property {Array<String>} unmappedHeaders Unmapped grid columns.
 */

/**
 * Map matrix columns to grid columns.
 * Currently assumes mapped columns will have the same label, but allows them
 * to be in a different order. If the matrix is missing a column, a blank
 * column is used.
 * @param {Array<Array<String>>} matrix
 * @param {Number} matrixHeaderRow Row containing matrix's column labels.
 * @param {Object} data See `data.js`.
 * @return {MappedMatrixObj} Mapped matrix and details.
 */
const mapMatrixToGrid = (matrix, matrixHeaderRow, data) => {
  const expectedHeaders = getFlatHeaders(data);
  const expectedSecondaryHeaders = expectedHeaders[1];
  const actualSecondaryHeaders = matrix[matrixHeaderRow];

  // Map current column indices to their indices in matrix to map
  const headerMap = {};
  const unmappedHeaders = [];
  for (const [i, expectedVal] of expectedSecondaryHeaders.entries()) {
    headerMap[i] = actualSecondaryHeaders.findIndex((actualVal) => {
      return actualVal === expectedVal;
    });
    if (headerMap[i] === -1) unmappedHeaders.push(expectedVal);
  }

  const dataRows = matrix.slice(matrixHeaderRow + 1);
  const mappedDataRows = [];
  // Iterate over non-header-rows in matrix to map
  for (const i of dataRows.keys()) {
    mappedDataRows[i] = [];
    // Iterate over columns in current validator version
    for (const j of expectedSecondaryHeaders.keys()) {
      // -1 means the matrix to map does not have this column
      if (headerMap[j] === -1) {
        mappedDataRows[i][j] = '';
      } else {
        mappedDataRows[i][j] = dataRows[i][headerMap[j]];
      }
    }
  }

  return {
    matrix: [...expectedHeaders, ...mappedDataRows],
    unmappedHeaders: unmappedHeaders,
  };
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

    // Rules that require a column following current one.
    if (fields.length > col+1) {

      const next_field = fields[col+1];

      // Rule: for any "x bin" field that follows a "x" field (see next fn)
      if (next_field.fieldName == fields[col].fieldName + ' bin') {
        for (let row=0; row < matrix.length; row++) {
          // Do parseFloat rather than parseInt to accomodate fractional bins.
          const value = matrix[row][col];

          // For IMPORT, this is only run on fields that have a value.
          // Note matrix pass cell by reference so its content can be changed.
          if (value && value.length > 0) {
            const number = parseFloat(matrix[row][col]);
            var selection = '';
            if (number >= 0) {
              // .flatVocabulary is an array of ranges e.g. "10 - 19"
              for (const number_range of next_field.flatVocabulary) {
                // ParseInt just looks at first part of number 
                if (number >= parseFloat(number_range)) {
                  selection = number_range;
                  continue;
                }
                break;
              }
            }
            triggered_changes.push([row, col+1, undefined, selection]);
          }
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
 * Iterate through rules set up for named columns
 * Like matrixFieldChangeRules but just for table cell change array.
 * @param {Array} change array [row, col, ? , value]
 * @param {Object} fields See `data.js`.
 * @param {Array} triggered_changes array of change which is appended to changes.
 */
const fieldChangeRules = (change, fields, triggered_changes) => {

  const col = change[1];
  const field = fields[col];

  // Test field against capitalization change.
  if (field.capitalize !== null && change[3] && change[3].length > 0) 
      change[3] = changeCase(change[3], field.capitalize);

  // Rules that require a column following current one.
  if (fields.length > col+1) {

    const next_field = fields[col+1];

    // Rule: for any "x bin" field that follows a "x" field (in other words, with
    // " bin" appended to its label, find and set appropriate bin selection.
    // add test on field.datatypes === "xs:decimal" , "select" ?
    if (next_field.fieldName == fields[col].fieldName + ' bin') {
      // Do parseFloat rather than parseInt to accomodate fractional bins.
      const value = parseFloat(change[3]);
      var selection = '';
      if (value >= 0) {
        // .flatVocabulary is an array of ranges e.g. "10 - 19"
        for (const number_range of next_field.flatVocabulary) {
          if (value >= parseFloat(number_range)) {
            selection = number_range;
            continue;
          }
          break;
        }
      }
      triggered_changes.push([change[0], col+1, undefined, selection]);

    };
  }

};

/**
 * Modify visibility of columns in grid. This function should only be called
 * after clicking a DOM element used to toggle column visibilities.
 * @param {String} id Id of element clicked to trigger this function.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const changeColVisibility = (id, data, hot) => {
  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
  hot.scrollViewportTo(0, 1);

  // Un-hide all currently hidden cols
  const hiddenColsPlugin = hot.getPlugin('hiddenColumns');
  hiddenColsPlugin.showColumns(hiddenColsPlugin.hiddenColumns);

  // Hide user-specied cols
  const hiddenColumns = [];
  if (id === 'show-required-cols-dropdown-item') {
    getFields(data).forEach(function(field, i) {
      if (field.requirement !== 'required') hiddenColumns.push(i);
    });
  }
  hiddenColsPlugin.hideColumns(hiddenColumns);
  hot.render();
};

/**
 * Modify visibility of rows in grid. This function should only be called
 * after clicking a DOM element used to toggle row visibilities.
 * @param {String} id Id of element clicked to trigger this function.
 * @param {Object<Number, Set<Number>>} invalidCells See `getInvalidCells`
 *     return value.
 * @param {Object} hot Handsontable instance of grid.
 */
const changeRowVisibility = (id, invalidCells, hot) => {
  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
  hot.scrollViewportTo(0, 1);

  // Un-hide all currently hidden cols
  const hiddenRowsPlugin = hot.getPlugin('hiddenRows');
  hiddenRowsPlugin.showRows(hiddenRowsPlugin.hiddenRows);

  // Hide user-specified rows
  const rows = [...Array(HOT.countRows()).keys()];
  const emptyRows = rows.filter(row => hot.isEmptyRow(row));
  let hiddenRows = [];

  if (id === 'show-valid-rows-dropdown-item') {
    hiddenRows = Object.keys(invalidCells).map(Number);
    hiddenRows = [...hiddenRows, ...emptyRows];
  } else if (id === 'show-invalid-rows-dropdown-item') {
    const invalidRowsSet = new Set(Object.keys(invalidCells).map(Number));
    hiddenRows = rows.filter(row => !invalidRowsSet.has(row));
    hiddenRows = [...hiddenRows, ...emptyRows];
  }

  hiddenRowsPlugin.hideRows(hiddenRows);
  hot.render();
}

/**
 * Get the 0-based y-index of every field on the grid.
 * @param {Object} data See `data.js`.
 * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
 *     the grid.
 */
const getFieldYCoordinates = (data) => {
  const ret = {};
  for (const [i, field] of getFields(data).entries()) {
    ret[field.fieldName] = i;
  }
  return ret;
};

/**
 * Scroll grid to specified column.
 * @param {String} y 0-based index of column to scroll to.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const scrollToCol = (y, data, hot) => {
  const hiddenCols = hot.getPlugin('hiddenColumns').hiddenColumns;
  if (hiddenCols.includes(y)) changeColVisibility('', data, hot);
  hot.scrollViewportTo(0, y);
};

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

  for (let row=0; row<hot.countRows(); row++) {
    if (hot.isEmptyRow(row)) continue;

    for (let col=0; col<fields.length; col++) {
      const cellVal = hot.getDataAtCell(row, col);
      const datatype = fields[col].datatype;
      let valid = true;
      // TODO we could have messages for all types of invalidation, and add
      //  them as tooltips
      let msg = '';

      // 1st row of provenance datatype field is forced to have a 
      // 'DataHarmonizer Version: 0.13.0' etc. value.  Change happens silently. 
      if (datatype === 'provenance') {
        checkProvenance(cellVal, hot, row, col);
      };
      if (!cellVal) {
        valid = fields[col].requirement !== 'required';
        msg = 'Required cells cannot be empty'
      } 
      else switch (datatype) {
        case 'xs:nonNegativeInteger':
          const parsedInt = parseInt(cellVal, 10);
          valid = !isNaN(cellVal) && parsedInt>=0
          valid &= parsedInt.toString()===cellVal;
          valid &= testNumericRange(parsedInt, fields[col]);
          break;
        case 'xs:decimal':
          const parsedDec = parseFloat(cellVal);
          valid = !isNaN(cellVal) && regexDecimal.test(cellVal);
          valid &= testNumericRange(parsedDec, fields[col]);
          break;
        case 'xs:date':
          valid = moment(cellVal, 'YYYY-MM-DD', true).isValid();
          break;
        case 'select':
          valid = validateValAgainstVocab(cellVal, fields[col].flatVocabulary);
          break;
        case 'multiple':
          valid = validateValsAgainstVocab(cellVal, fields[col].flatVocabulary);
          break;
         
      }

      if (!valid && fields[col].dataStatus) {
        valid = validateValAgainstVocab(cellVal, fields[col].dataStatus);
      }

      if (!valid) {
        if (!invalidCells.hasOwnProperty(row)) {
          invalidCells[row] = {};
        }
        invalidCells[row][col] = msg;
      }
    }
  }
  return invalidCells;
};

/**
 * Test cellVal against DataHarmonizer: vX.Y.Z pattern and if it needs an
 * update, do so.
 * @param {Object} cellVal field value to be tested.
 * @param {Object} hot link to data
 * @param {Integer} row index of data
 * @param {Integer} column index of data
 */
const checkProvenance = (cellVal, hot, row, col) => {
  const version = 'DataHarmonizer: v' + VERSION;
  let splitVal = [];
  if (!cellVal) {
    splitVal = [version];
  }
  else {
    splitVal = cellVal.split(';',2);

    if (splitVal[0].substring(0,14) === 'DataHarmonizer') {
        splitVal[0] = version;
    } 
    else {
        splitVal.unshift(version);
    };
  };
  const value = splitVal.join(';');
  hot.setDataAtCell(row, col, value, 'thisChange');
}


/**
 * Test a given number against an upper or lower range, if any.
 * @param {Number} number to be compared.
 * @param {Object} field that contains min and max limits.
 * @return {Boolean} validity of field.
 */
const testNumericRange = (number, field) => {

  if (field['xs:minInclusive'] !== '') {
    if (number < field['xs:minInclusive']) {
      return false
    }
  }
  if (field['xs:maxInclusive'] !== '') {
    if (number > field['xs:maxInclusive']) 
      return false
  }
  return true
}
/**
 * Validate a value against an array of source values.
 * @param {String} val Cell value.
 * @param {Array<String>} source Source values.
 * @return {Boolean} If `val` is in `source`, while ignoring whitespace and
 *     case.
 */
const validateValAgainstVocab = (val, source) => {
  let valid = false;
  if (val) {
    const trimmedSource =
        source.map(sourceVal => sourceVal.trim().toLowerCase());
    const trimmedVal = val.trim().toLowerCase();
    if (trimmedSource.includes(trimmedVal)) valid = true;
  }
  return valid;
};

/**
 * Validate csv values against an array of source values.
 * @param {String} valsCsv CSV string of values to validate.
 * @param {Array<String>} source Values to validate against.
 * @return {Boolean} If every value in `valsCsv` is in `source`, while ignoring
 *     whitespace and case.
 */
const validateValsAgainstVocab = (valsCsv, source) => {
  for (const val of valsCsv.split(';')) {
    if (!validateValAgainstVocab(val, source)) return false;
  }
  return true;
};

/**
 * Get an HTML string that describes a field.
 * @param {Object} field Any object under `children` in `data.js`.
 * @return {String} HTML string describing field.
 */
const getComment = (field) => {
  let ret = `<p><strong>Label</strong>: ${field.fieldName}</p>
<p><strong>Description</strong>: ${field.description}</p>
<p><strong>Guidance</strong>: ${field.guidance}</p>
<p><strong>Examples</strong>: ${field.examples}</p>`;
  if (field.dataStatus) {
    ret += `<p><strong>Null values</strong>: ${field.dataStatus}</p>`;
  }
  return ret;
};

/**
 * Enable template folder's export.js export options to be loaded dynamically.
 */
const exportOnload = () =>  {
  const select = $("#export-to-format-select")[0];
  while (select.options.length > 1) {
    select.remove(1);
  }
  for (const option in EXPORT_FORMATS) {
    select.append(new Option(option, option));
  }
};

/**
 * Show available templates, with sensitivity to "view draft template" checkbox
 */
const templateOptions = () =>  {
  // Select menu for available templates
  const select = $("#select-template");
  while (select[0].options.length > 0) {
    select[0].remove(0);
  }
  const view_drafts = $("#view-template-drafts").is(':checked');
  for (const [label, template] of Object.entries(TEMPLATES)) {
    if (view_drafts || template.status == 'published') {
      select.append(new Option(label, template.folder));
    }
  }
};

/************************** APPLICATION LAUNCH ********************/

$(document).ready(() => {

  setupTriggers();

  // Default template
  let template_label = 'CanCOGeN Covid-19';
  let template_folder = TEMPLATES[template_label].folder;

  // Allow URL parameter ?template=xxx_yyy to select template on page load.
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    template_folder = params.get('template') || template_folder;
  }
  else {//low-tech way:
    template_folder = location.search.split("template=")[1] || template_folder;
  }

  for (const [label, template] of Object.entries(TEMPLATES)) {
    // Trigger template menu option so it is selected
    if (template_folder == template.folder) {
      setupTemplate(template_folder);
      return;
    }
  }
  console.log(template_folder);
  // Here template not found in TEMPLATES, so it doesn't have a name
  $('#template_name_display').text(template_folder);
  setupTemplate (template_folder);

});

/**
 * Wire up user controls which only need to happen once on load of page.
 */
const setupTriggers = () => {

  $('#version-dropdown-item').text(VERSION);

  // Select menu for available templates
  templateOptions();

  // Enable template to be loaded dynamically
  $('#select-template-load').on('click', (e) => {
    const template_folder = $('#select-template').val()
    setupTemplate (template_folder);
  })
  // Triggers show/hide of draft templates
  $("#view-template-drafts").on('change', templateOptions);

  // File -> New
  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    const isNotEmpty = HOT.countRows() - HOT.countEmptyRows();
    if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
      $('#clear-data-warning-modal').modal('show');
    } else {
      // Clear current file indication
      $('#file_name_display').text('');

      runBehindLoadingScreen(() => {
        window.INVALID_CELLS = {};
        HOT.destroy();
        window.HOT = createHot(DATA);
      });
    }
  });

  // File -> Open
  const $fileInput = $('#open-file-input');

  $fileInput.change(() => {
    const file = $fileInput[0].files[0];
    const ext = file.name.split('.').pop();
    const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv'];
    if (!acceptedExts.includes(ext)) {
      const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
      $('#open-err-msg').text(errMsg);
      $('#open-error-modal').modal('show');
    } else {
      window.INVALID_CELLS = {};
      runBehindLoadingScreen(openFile, [file, HOT, DATA, XLSX]);
    }
    // Allow consecutive uploads of the same file
    $fileInput[0].value = '';
  });
  // Reset specify header modal values when the modal is closed
  $('#specify-headers-modal').on('hidden.bs.modal', () => {
    $('#expected-headers-div').empty();
    $('#actual-headers-div').empty();
    $('#specify-headers-err-msg').hide();
    $('#specify-headers-confirm-btn').unbind();
  });

  // File -> Save
  $('#save-as-dropdown-item').click(() => {
    if (!jQuery.isEmptyObject(INVALID_CELLS)) {
      $('#save-as-invalid-warning-modal').modal('show');
    } else {
      $('#save-as-modal').modal('show');
    }
  });
  $('#save-as-confirm-btn').click(() => {
    try {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      const matrix = [...getFlatHeaders(DATA), ...getTrimmedData(HOT)];
      runBehindLoadingScreen(exportFile, [matrix, baseName, ext, XLSX]);
      $('#save-as-modal').modal('hide');
    } catch (err) {
      $('#save-as-err-msg').text(err.message);
    }
  });
  // Reset save modal values when the modal is closed
  $('#save-as-modal').on('hidden.bs.modal', () => {
    $('#save-as-err-msg').text('');
    $('#base-name-save-as-input').val('');
  });

  // File -> Export to...
  $('#export-to-confirm-btn').click(() => {
    const baseName = $('#base-name-export-to-input').val();
    const exportFormat = $('#export-to-format-select').val();
    if (!exportFormat) {
      $('#export-to-err-msg').text('Select a format');
      return;
    }
    if (exportFormat in EXPORT_FORMATS) {
      const format = EXPORT_FORMATS[exportFormat];
      format['method'](baseName, HOT, DATA, XLSX, format.fileType);
    }
    $('#export-to-modal').modal('hide');
  });
  $("#export-to-format-select").on('change', (e) => {
    const exportFormat = $('#export-to-format-select').val();
    $('#export_file_suffix').text('.' + EXPORT_FORMATS[exportFormat].fileType);
  });

  // Reset export modal values when the modal is closed
  $('#export-to-modal').on('hidden.bs.modal', () => {
    $('#export-to-err-msg').text('');
    $('#base-name-export-to-input').val('');
  });

  // Settings -> Jump to...
  const $jumpToInput = $('#jump-to-input');
  $jumpToInput.bind('focus', () => void $jumpToInput.autocomplete('search'));

  $('#jump-to-modal').on('shown.bs.modal', () => {
    $jumpToInput.val('');
    $jumpToInput.focus();
  });

  // Validate
  $('#validate-btn').on('click', () => {
    runBehindLoadingScreen(() => {
      window.INVALID_CELLS = getInvalidCells(HOT, DATA);
      HOT.render();
    });
  });

  // Field descriptions. Need to account for dynamically rendered
  // cells.
  $('#grid').on('dblclick', '.secondary-header-cell', (e) => {
    const innerText = e.target.innerText;
    const field =
        getFields(DATA).filter(field => field.fieldName === innerText)[0];
    $('#field-description-text').html(getComment(field));
    $('#field-description-modal').modal('show');
  });

  // Add more rows
  $('#add-rows-button').click(() => {
    runBehindLoadingScreen(() => {
      const numRows = $('#add-rows-input').val();
      HOT.alter('insert_row', HOT.countRows()-1 + numRows, numRows);
    });
  });

  // Settings -> Show ... columns
  const showColsSelectors =
      ['#show-all-cols-dropdown-item', '#show-required-cols-dropdown-item'];
  $(showColsSelectors.join(',')).click((e) => {
    runBehindLoadingScreen(changeColVisibility, [e.target.id, DATA, HOT]);
  });

  // Settings -> Show ... rows
  const showRowsSelectors = [
    '#show-all-rows-dropdown-item',
    '#show-valid-rows-dropdown-item',
    '#show-invalid-rows-dropdown-item',
  ];
  $(showRowsSelectors.join(',')).click((e) => {
    const args = [e.target.id, INVALID_CELLS, HOT];
    runBehindLoadingScreen(changeRowVisibility, args);
  });

}

/**
 * Revise user interface elements to match template path, and trigger
 * load of data.js and export.js scripts.  data_script.onload goes on
 * to trigger launch(DATA).
 * @param {String} template: path of template starting from app's template
 * folder.
 */
const setupTemplate = (template_folder) => {

  // Redo of template triggers new data file
  $('#file_name_display').text('');
  
  // If visible, show this as a selected item in template menu
  $('#select-template').val(template_folder);

  // Lookup name of requested template if possible
  $('#template_name_display').text('');
  for (const [label, template] of Object.entries(TEMPLATES)) {
    if (template.folder == template_folder){
      $('#template_name_display').text(label);
    }
  };
  
  // Change in src triggers load of script and update to reference doc and SOP.
  reloadJs(`template/${template_folder}/data.js`, function () { 
    runBehindLoadingScreen(launch, [template_folder, DATA])
  });

  $("#help_reference").attr('href',`template/${template_folder}/reference.html`)
  $("#help_sop").attr('href',`template/${template_folder}/SOP.pdf`)
};

/**
 * Reloads a given javascript by removing any old script happening to have the
 * same URL, and loading the given one. Only in this way will browsers reload
 * the code.
 * @param {String} src_url: path of template starting from app's template folder.
 * @param {Object} onloadfn: function to run when script is loaded. 
 */
const reloadJs = (src_url, onloadfn) => {
    $('script[src="' + src_url + '"]').remove();
    var script = document.createElement('script');
    if (onloadfn) {
      script.onload = onloadfn;
    };
    script.onerror = function() {
      $('#missing-template-msg').text(`Unable to load template file "${src_url}". Is the template name correct?`);
      $('#missing-template-modal').modal('show');
      $('#template_name_display').text('');
    };

    script.src = src_url;
    document.head.appendChild(script);

}

/**
 * Clears and redraws grid based on DATA json.
 * @param {Object} DATA: hierarchy of field sections and fields to render. 
 */
const launch = (template_folder, DATA) => {

  window.DATA = processData(DATA);
  // Since data.js loaded, export.js should succeed as well
  reloadJs(`template/${template_folder}/export.js`, exportOnload);

  runBehindLoadingScreen(() => {
    window.INVALID_CELLS = {};
    if (window.HOT) HOT.destroy(); // handles already existing data
    window.HOT = createHot(DATA);
  });
  let HOT = window.HOT;
  let INVALID_CELLS = window.INVALID_CELLS;

  toggleDropdownVisibility(HOT, INVALID_CELLS);

  // Settings -> Jump to...
  const $jumpToInput = $('#jump-to-input');
  const fieldYCoordinates = getFieldYCoordinates(DATA);
  $jumpToInput.autocomplete({
    source: Object.keys(fieldYCoordinates),
    minLength: 0,
    select: (e, ui) => {
      const y = fieldYCoordinates[ui.item.label];
      scrollToCol(y, DATA, window.HOT);
      $('#jump-to-modal').modal('hide');
    },
  })
}
