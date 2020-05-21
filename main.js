/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 */

/**
 * Post-processing of values in `data.js` at runtime.
 * Currently only adds country vocabulary to all fields that need it.
 * TODO: this logic should be in the python script that creates `data.json`
 * @param {Object} data See `data.js`.
 * @return {Object} Processed values of `data.js`.
 */
const processData = (data) => {
  const fields =
      Array.prototype.concat.apply([], data.map(parent => parent.children));
  const countryField =
      fields.filter(field => field.fieldName === 'geo_loc_name (country)')[0];
  for (const parent of data) {
    for (const child of parent.children) {
      if (child.fieldName.includes('(country')) {
        child.vocabulary = countryField.vocabulary;
      }
    }
  }
  return data;
};

/**
 * Create a blank instance of Handsontable.
 * @param {Object} data See `data.js`.
 * @return {Object} Handsontable instance.
 */
const createHot = (data) => {
  return Handsontable($('#grid')[0], {
    nestedHeaders: getNestedHeaders(DATA),
    columns: getColumns(DATA),
    comments: true,
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
    licenseKey: 'non-commercial-and-evaluation',
    readOnlyCellClassName: 'read-only',
    afterRender: () => {
      $('#header-row').css('visibility', 'visible');
      // Bit of a hackey way to stylize th cells
      $('.secondary-header-text').each((_, e) => {
        if ($(e).hasClass('required')) {
          $(e).closest('th').addClass('required');
        } else if ($(e).hasClass('recommended')) {
          $(e).closest('th').addClass('recommended');
        }
      });
    },
  });
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
 * Create an array of cell properties specifying data type and validation logic
 * for all grid columns.
 * @param {Object} data See `data.js`.
 * @return {Array<Object>} Cell properties for each grid column.
 */
const getColumns = (data) => {
  let ret = [];
  const fields =
      Array.prototype.concat.apply([], data.map(parent => parent.children));
  for (const field of fields) {
    const col = {};
    if (field.requirement) col.requirement = field.requirement;
    if (field.datatype === 'integer') {
      col.type = 'numeric';
      // TODO: enforce numeric validation
    } else if (field.datatype === 'decimal') {
      col.type = 'numeric';
      // TODO: enforce numeric validation
    } else if (field.datatype === 'date') {
      col.type = 'date';
      col.dateFormat = 'YYYY/MM/DD';
    } else if (field.datatype === 'select') {
      col.type = 'autocomplete';
      col.source = stringifyNestedVocabulary(field.vocabulary)
    } else if (field.datatype === 'multiple') {
      col.type = 'autocomplete';
      col.source = stringifyNestedVocabulary(field.vocabulary)
      // TODO: multiple select functionality
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
 * Highlight invalid cells in grid.
 * @param {Object} hot Handsontable instance of grid.
 */
const validateGrid = (hot) => {
  hot.updateSettings({
    cells: function(row, col) {
      if (this.source !== undefined) {
        let valid = false;
        const cellVal = hot.getDataAtCell(row, col);
        if (cellVal !== null) {
          if (this.source.map(sourceVal => sourceVal.trim().toLowerCase())
              .includes(cellVal.trim().toLowerCase())) {
            valid = true;
          }
        }
        // Do not want to remove prior classes
        let invalidClass;
        if (this.className) {
          invalidClass = `${this.className} invalid-cell`;
        } else {
          invalidClass = 'invalid-cell';
        }
        if (!valid) hot.setCellMeta(row, col, 'className', invalidClass);
      }
    },
  })
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
  if (id === 'view-required-fields') {
    const fields =
        Array.prototype.concat.apply([], data.map(parent => parent.children));
    fields.forEach(function(field, i) {
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

$(document).ready(() => {
  window.DATA = processData(DATA);
  window.HOT = createHot(DATA);

  // This is called frequently with sideways scrolling since table viewport is dynamic.
  // Handsontable.hooks.add('afterGetColHeader', tableHeaderCallback, window.HOT);

  // File -> New
  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    if (e.target.id === 'new-dropdown-item') {
      if (HOT.countRows() - HOT.countEmptyRows()) {
        $('#clear-data-warning-modal').modal('show');
      }
    } else {
      HOT.destroy();
      window.HOT = createHot(DATA);

      // // repeat of above
      // Handsontable.hooks.add('afterGetColHeader', tableHeaderCallback, window.HOT);
      // // Have to trigger tableHeaderCallback this way, see note below.
      // showFields('view-all-fields', DATA, HOT)
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
  $('#validate-btn').click(() => void validateGrid(HOT));

  // Show fields
  $('#view-all-fields, #view-required-fields').click(function(e) {
    showFields(e.target.id, DATA, HOT);
  });

  // // First render of sheet doesnt trigger tableHeaderCallback, so have to do this
  // showFields('view-all-fields', DATA, HOT)

  $('#grid thead > tr:nth-child(2) th').on('dblclick', function(e, item) {
    if (this.innerText.length > 0) {
      let field = window.FIELD_INDEX[this.innerText];
      let comment = '\nLabel: '+ field.fieldName + '\n\nDescription:' + field.description + '\n\nGuidance: ' + field.guidance + '\n\nExample: '+ field.examples
      // TO DO: Convert to modal
      alert(comment)
    }
  });


  function tableHeaderCallback (column, TH){
    if (column >= 0) {
      if (TH.innerText in window.FIELD_INDEX) {
        // We have to dynamically generate the guidanceModel call each time a 
        // th cell is created due to scrolling
        const className = window.FIELD_INDEX[TH.innerText].requirement
        if (className) {
          TH.className += className
        }
      }
    }
  }


});
