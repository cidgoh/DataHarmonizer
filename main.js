/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 */

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
          if (!val) continue;
          child.flatVocabulary[i] = val.split(' ').map(x =>
              x.charAt(0).toUpperCase() + x.substr(1).toLowerCase()).join(' ');
        }
      }
    }
  }
  return data;
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
    // Handsontable's validation is extremely slow with large datasets
    invalidCellClassName: '',
    licenseKey: 'non-commercial-and-evaluation',
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
    if (field.datatype === 'integer' || field.datatype === 'decimal') {
      col.type = 'numeric';
    } else if (field.datatype === 'date') {
      col.type = 'date';
      col.dateFormat = 'YYYY-MM-DD';
    } else if (field.datatype === 'select') {
      col.type = 'autocomplete';
      col.source = field.flatVocabulary;
      col.trimDropdown = false;
    } else if (field.datatype === 'multiple') {
      // TODO: we need to find a better way to enable multi-selection
      col.type = 'text';
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
        const selections = value && value.split(',') || [];
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
            let newValCsv = $('#field-description-text .multiselect').val().join(',')
            self.setDataAtCell(row, col, newValCsv, 'thisChange');
          }); 
      }
    },
    afterChange: function(changes, source) {
      /*
      if (source === 'thisChange' || !changes || changes.length !== 1) return;

      const row = changes[0][0];
      const col = changes[0][1];
      const oldValCsv = changes[0][2];
      const newVal = changes[0][3];
      if (fields[col].datatype !== 'multiple') return;
      */
    }
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
 * Upload user file data to grid. We are are assuming the uploaded file has the
 * same headers as our grid.
 * @param {File} file User file.
 * @param {String} ext User file extension.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} xlsx SheetJS variable.
 */
const importFile = (file, ext, hot, xlsx) => {
  const fileReader = new FileReader();
  if (ext === 'xlsx') {
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const workbook = xlsx.read(e.target.result, {type: 'binary'});
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetCsvStr = xlsx.utils.sheet_to_csv(firstSheet);
      const matrix =
          sheetCsvStr.split('\n').map(line => line.split(',')).slice(2);
      hot.loadData(matrix);
    };
  } else if (ext === 'tsv') {
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      const matrix =
          e.target.result.split('\n').map(line => line.split('\t')).slice(2);
      hot.loadData(matrix);
    };
  } else if (ext === 'csv') {
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      const matrix =
          e.target.result.split('\n').map(line => line.split(',')).slice(2);
      hot.loadData(matrix);
    };
  }
};

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
        valid = !fields[col].requirement;
      } else if (datatype === 'integer') {
        valid = Number.isInteger(cellVal);
      } else if (datatype === 'decimal') {
        valid = !isNaN(cellVal);
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
  for (const val of valsCsv.split(',')) {
    if (!validateDropDown(val, source)) return false;
  }
  return true;
};

/**
 * Modify visibility of fields in grid. This function should only be called
 * after clicking a DOM element used to toggle field visibilities.
 * @param {String} id Id of element clicked to trigger this function.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const showFields = (id, data, hot) => {
  const hiddenColumns = [];
  if (id === 'show-required-dropdown-item') {
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
 * Get an HTML string that describes a field.
 * @param {Object} field Any object under `children` in `data.js`.
 * @return {String} HTML string describing field.
 */
const getComment = (field) => {
  '\nLabel: '+ field.fieldName + '\n\nDescription:' + field.description + '\n\nGuidance: ' + field.guidance + '\n\nExample: '+ field.examples
  return `<p><strong>Label</strong>: ${field.fieldName}</p>
<p><strong>Description</strong>: ${field.description}</p>
<p><strong>Guidance</strong>: ${field.guidance}</p>
<p><strong>Examples</strong>: ${field.examples}</p>`;
};

$(document).ready(() => {
  window.DATA = processData(DATA);
  window.HOT = createHot(DATA);

  window.INVALID_CELLS = {};

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
      importFile(file, ext, HOT, XLSX);
    }

    // Allow consecutive uploads of the same file
    $fileInput[0].value = '';
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

  // Show fields
  $('#show-all-dropdown-item, #show-required-dropdown-item').click(function(e) {
    showFields(e.target.id, DATA, HOT);
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
