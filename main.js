/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 */

/**
 * Controls what dropdown options are visible depending on grid settings.
 */
const toggleDropdownVisibility = () => {
  $('.hidden-dropdown-item').hide();

  $('#settings-dropdown-btn-group')
      .on('show.bs.dropdown', () => {
        const hiddenCols = HOT.getSettings().hiddenColumns.columns;
        const hiddenRows = HOT.getSettings().hiddenRows.rows;

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
 * Post-processing of values in `data.js` at runtime.
 * TODO: this logic should be in the python script that creates `data.json`
 * @param {Object} data See `data.js`.
 * @return {Object} Processed values of `data.js`.
 */
const processData = (data) => {
  const fields = getFields(data);
  const countryField =
      fields.filter(field => field.fieldName === 'geo_loc_name (country)')[0];
  for (const parent of data) {
    for (const child of parent.children) {
      // This helps us avoid repeating the list of countries in `data.js`
      if (child.fieldName.includes('(country)')) {
        child.vocabulary = countryField.vocabulary;
      }
      // Flat list of vocabulary items for autocomplete purposes
      if (child.vocabulary) {
        child.flatVocabulary = stringifyNestedVocabulary(child.vocabulary);

        // Convert to title case
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
      for (const change of changes) {
        const row = change[0];
        const col = change[1];
        change[3] = changeCase(change[3], fields[col].capitalize);
      }
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
    if (field.datatype === 'date') {
      col.type = 'date';
      col.dateFormat = 'YYYY-MM-DD';
    } else if (field.datatype === 'select') {
      col.type = 'autocomplete';
      col.source = field.flatVocabulary;
      col.trimDropdown = false;
    } else if (field.datatype === 'multiple') {
      // TODO: we need to find a better way to enable multi-selection
      col.editor = 'text';
      col.renderer = 'autocomplete';
      col.source = field.flatVocabulary;
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
 * @return {Array<Array<String>>} Flattened vocabulary.
 */
const stringifyNestedVocabulary = (vocabulary, level=0) => {
  if (Object.keys(vocabulary).length === 0) {
    return [];
  }

  let ret = [];
  for (const val of Object.keys(vocabulary)) {
    ret.push('  '.repeat(level) + val);
    ret = ret.concat(stringifyNestedVocabulary(vocabulary[val], level+1));
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
 * Download grid headers and data to file.
 * @param {Array<Array<String>>} matrix Grid data.
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
  } else if (ext === 'tsv') {
    xlsx.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
  } else if (ext === 'csv') {
    xlsx.writeFile(workbook, `${baseName}.csv`, {bookType: 'csv', FS: ','});
  }
};

/**
 * Read local file opened by user.
 * Only reads `xlsx`, `csv` and `tsv` files.
 * @param {File} file User file.
 * @param {Object} xlsx SheetJS variable.
 * @return {Promise<Array<Array<String>>>} Matrix populated by user's file data.
 */
const parseFile = (file, xlsx) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      const workbook = xlsx.read(e.target.result, {type: 'binary', raw: true});
      const worksheet =
          updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);
      const params = [worksheet, {header: 1, raw: false}];
      resolve(xlsx.utils.sheet_to_json(...params));
    }
  });
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
 * Determine if a matrix has the same headers as the grid.
 * @param {Array<Array<String>>} matrix
 * @param {Object} data See `data.js`.
 * @return {Boolean} True if the matrix's second row matches the grid.
 */
const compareMatrixHeadersToGrid = (matrix, data) => {
  const expectedSecondRow = getFlatHeaders(data)[1];
  const actualSecondRow = matrix[1];
  return JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow);
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
 * Map matrix columns to grid columns.
 * Currently assumes mapped columns will have the same label, but allows them
 * to be in a different order. If the matrix is missing a column, a blank
 * column is used.
 * @param {Array<Array<String>>} matrix
 * @param {Number} matrixHeaderRow Row containing matrix's column labels.
 * @param {Object} data See `data.js`.
 * @return {Array<Array<String>>} Mapped matrix.
 */
const mapMatrixToGrid = (matrix, matrixHeaderRow, data) => {
  const expectedHeaders = getFlatHeaders(data)[1];
  const actualHeaders = matrix[matrixHeaderRow];

  // Map current column indices to their indices in matrix to map
  const headerMap = {};
  for (const [expectedIndex, expectedVal] of expectedHeaders.entries()) {
    headerMap[expectedIndex] =
        actualHeaders.findIndex((actualVal) => actualVal === expectedVal);
  }

  const mappedMatrix = [];
  // Iterate over rows in matrix to map
  for (const i of matrix.keys()) {
    mappedMatrix[i] = [];
    // Iterate over columns in current validator version
    for (const j of expectedHeaders.keys()) {
      // -1 means the matrix to map does not have this column
      mappedMatrix[i][j] = headerMap[j] === -1 ? '' : matrix[i][headerMap[j]];
    }
  }

  return mappedMatrix;
};

/**
 * Modify matrix data for grid according to specified cases.
 * This is useful when calling `hot.loadData`, as cell changes from said method
 * are not recognized by `afterChange`.
 * @param {Array<Array<String>>} matrix Data meant for grid.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 * @return {Array<Array<String>>} Modified matrix.
 */
const changeCases = (matrix, hot, data) => {
  const fields = getFields(data);

  for (let row=0; row < matrix.length; row++) {
    for (let col=0; col < fields.length; col++) {
      if (!matrix[row][col] || !fields[col].capitalize) continue;
      matrix[row][col] = changeCase(matrix[row][col], fields[col].capitalize);
    }
  }

  return matrix;
}

/**
 * Modify visibility of columns in grid. This function should only be called
 * after clicking a DOM element used to toggle column visibilities.
 * @param {String} id Id of element clicked to trigger this function.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const changeColVisibility = (id, data, hot) => {
  const hiddenColumns = [];
  if (id === 'show-required-cols-dropdown-item') {
    getFields(data).forEach(function(field, i) {
      if (field.requirement !== 'required') hiddenColumns.push(i);
    });
  }
  hot.updateSettings({
    hiddenColumns: {
      copyPasteEnabled: true,
      indicators: true,
      columns: hiddenColumns,
    },
  });
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

  HOT.updateSettings({hiddenRows: {rows: hiddenRows}});
}

/**
 * Get a collection of all invalid cells in the grid.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 * @return {Object<Number, Set<Number>>} Object with rows as keys, and sets
 *     containing invalid cells for that row as values
 */
const getInvalidCells = (hot, data) => {
  const invalidCells = {};
  const fields = getFields(data);
  for (let row=0; row<hot.countRows(); row++) {
    if (hot.isEmptyRow(row)) continue;

    for (let col=0; col<fields.length; col++) {
      const cellVal = hot.getDataAtCell(row, col);
      const datatype = fields[col].datatype;
      let valid = true;

      if (!cellVal) {
        valid = fields[col].requirement !== 'required';
      } else if (datatype === 'integer') {
        // https://stackoverflow.com/a/16799538/11472358
        const parsedInt = parseInt(cellVal, 10);
        valid =
            !isNaN(cellVal) && parsedInt>=0 && parsedInt.toString()===cellVal;
      } else if (datatype === 'decimal') {
        valid = !isNaN(cellVal) && parseFloat(cellVal)>=0;
      } else if (datatype === 'date') {
        valid = moment(cellVal, 'YYYY-MM-DD', true).isValid();
      } else if (datatype === 'select') {
        valid = validateDropDown(cellVal, fields[col].flatVocabulary);
      } else if (datatype === 'multiple') {
        valid = validateMultiple(cellVal, fields[col].flatVocabulary);
      }

      if (!valid) {
        if (invalidCells.hasOwnProperty(row)) {
          invalidCells[row].add(col);
        } else {
          invalidCells[row] = new Set([col]);
        }
      }
    }
  }
  return invalidCells;
};

/**
 * Validate a value against its source. This is called when when validating
 * autocomplete cells.
 * @param {String} val Cell value.
 * @param {Array<String>} source Dropdown list for cell.
 * @return {Boolean} If `val` is in `source`, while ignoring whitespace and
 *     case.
 */
const validateDropDown = (val, source) => {
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
 * Validate csv values against their source. This is called when validating
 * multiple-select cells.
 * @param {String} valsCsv CSV string of values to validate.
 * @param {Array<String>} source Values to validate against.
 */
const validateMultiple = (valsCsv, source) => {
  for (const val of valsCsv.split(';')) {
    if (!validateDropDown(val, source)) return false;
  }
  return true;
};

/**
 * Get an HTML string that describes a field.
 * @param {Object} field Any object under `children` in `data.js`.
 * @return {String} HTML string describing field.
 */
const getComment = (field) => {
  return `<p><strong>Label</strong>: ${field.fieldName}</p>
<p><strong>Description</strong>: ${field.description}</p>
<p><strong>Guidance</strong>: ${field.guidance}</p>
<p><strong>Examples</strong>: ${field.examples}</p>`;
};

$(document).ready(() => {
  window.DATA = processData(DATA);
  window.HOT = createHot(DATA);

  window.INVALID_CELLS = {};

  toggleDropdownVisibility(HOT, INVALID_CELLS);

  // File -> New
  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    if (e.target.id === 'new-dropdown-item') {
      if (HOT.countRows() - HOT.countEmptyRows()) {
        $('#clear-data-warning-modal').modal('show');
      }
    } else {
      HOT.destroy();
      window.INVALID_CELLS = {};
      window.HOT = createHot(DATA);
    }
  });

  // File -> Open
  const $fileInput = $('#open-file-input');
  $fileInput.change(() => {
    const file = $fileInput[0].files[0];
    const ext = file.name.split('.').pop();
    const acceptedExts = ['xlsx', 'tsv', 'csv'];
    if (!acceptedExts.includes(ext)) {
      const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
      $('#open-err-msg').text(errMsg);
      $('#open-error-modal').modal('show');
    } else {
      window.INVALID_CELLS = {};
      parseFile(file, XLSX)
          .then((matrix) => {
            if (compareMatrixHeadersToGrid(matrix, DATA)) {
              HOT.loadData(changeCases(matrix.slice(2), HOT, DATA));
            } else {
              $('#specify-headers-modal').modal('show');
              $('#specify-headers-confirm-btn').click(() => {
                const specifiedHeaderRow =
                    parseInt($('#specify-headers-input').val());
                if (!isValidHeaderRow(matrix, specifiedHeaderRow)) {
                  $('#specify-headers-err-msg').show();
                } else {
                  const mappedMatrix =
                      mapMatrixToGrid(matrix, specifiedHeaderRow-1, DATA);
                  HOT.loadData(changeCases(mappedMatrix.slice(2), HOT, DATA));
                  $('#specify-headers-modal').modal('hide');
                }
              });
            }
          });
    }
    // Allow consecutive uploads of the same file
    $fileInput[0].value = '';
  });
  // Reset specify header modal values when the modal is closed
  $('#specify-headers-modal').on('hidden.bs.modal', () => {
    $('#specify-headers-err-msg').hide();
    $('#specify-headers-confirm-btn').unbind();
  });

  // File -> Save
  $('#save-as-confirm-btn').click((e) => {
    try {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      const matrix = [...getFlatHeaders(DATA), ...HOT.getData()];
      exportFile(matrix, baseName, ext, XLSX);
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

  // Settings -> Show ... columns
  const showColsSelectors =
      ['#show-all-cols-dropdown-item', '#show-required-cols-dropdown-item'];
  $(showColsSelectors.join(',')).click((e) => {
    changeColVisibility(e.target.id, DATA, HOT);
  });

  // Settings -> Show ... rows
  const showRowsSelectors = [
    '#show-all-rows-dropdown-item',
    '#show-valid-rows-dropdown-item',
    '#show-invalid-rows-dropdown-item',
  ];
  $(showRowsSelectors.join(',')).click((e) => {
    changeRowVisibility(e.target.id, INVALID_CELLS, HOT);
  });

  // Validate
  $('#validate-btn').click(() => {
    window.INVALID_CELLS = getInvalidCells(HOT, DATA);
    HOT.updateSettings({
      // A more intuitive name for this option might have been `afterCellRender`
      afterRenderer: (TD, row, col) => {
        if (INVALID_CELLS.hasOwnProperty(row)) {
          if (INVALID_CELLS[row].has(col)) $(TD).addClass('invalid-cell');
        }
      }
    });
    HOT.render();
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
    const numRows = $('#add-rows-input').val();
    HOT.alter('insert_row', HOT.countRows()-1 + numRows, numRows);
  });
});
