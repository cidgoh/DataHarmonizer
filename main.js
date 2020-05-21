/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 */

/**
 * Create a blank instance of Handsontable.
 * @param {Object} data - See `data.js`.
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
    afterRender: () => void $('#header-row').css('visibility', 'visible'),
  });
};

/**
 * Create a matrix containing the nested headers supplied to Handsontable.
 * @param {Object} data - See `data.js`.
 * @return {Array<Array>} Nested headers for Handontable grid.
 */
const getNestedHeaders = (data) => {
  const rows = [[], []];
  for (const parent of data) {
    rows[0].push({label: parent.fieldName, colspan: parent.children.length})
    rows[1].push(...parent.children.map(child => child.fieldName));
  }
  return rows;
};

/**
 * Create a matrix containing the grid's headers. Empty strings are used to
 * indicate merged cells.
 * @param {Object} data - See `data.js`.
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
 * Create an array of cell properties specifying autocomplete data, type, etc
 * for all grid columns.
 * @param {Object} data - See `data.js`.
 * @return {Array<Object>} Cell properties for each grid column.
 */
const getColumns = (data) => {
  const fields =
      Array.prototype.concat.apply([], data.map(parent => parent.children));
  let ret = [];
  window.FIELD_INDEX = {} // used in afterGetColHeader callback

  for (const field of fields) {

    let column = {}

    window.FIELD_INDEX[field.fieldName] = field;

    if (field.requirement.length > 0)
      column.requirement = field.requirement;

    switch (field.datatype) {

      case 'integer': 
        column.type = 'numeric';
        column.numericFormat = {}; // Not sure how to force integer validation
        break;

      case 'decimal':
        column.type = 'numeric';
        //column.numericFormat = '0.0';
        break;

      case 'date': 
        column.type = 'date';
        column.dateFormat = 'YYYY/MM/DD';
        break;

      case field.datatype = 'select':
      case field.datatype = 'multiple': // Multi-select
        column.type = 'autocomplete';
        if (field.fieldName.indexOf('(country)') == -1) {
          column.className = 'selection';
          column.strict = 'true'; // Issue: shows red for selections that have leading spaces
          column.source = stringifyNestedVocabulary(field.vocabulary);
        }
        else {// Special case: field is a country list. 
          column.strict = 'true';
          column.source = stringifyNestedVocabulary(window.FIELD_INDEX['geo_loc_name (country)'].vocabulary);
        }
    }

    ret.push(column)

  }
  return ret;
};


/**
 * Recursively flatten vocabulary into an array of strings, with each string's
 * level of depth in the vocabulary being indicated by leading spaces.
 * e.g., `vocabulary: 'a': {'b':{}},, 'c': {}` becomes `['a', '  b', 'c']`.
 * @param {Object} vocabulary - See `vocabulary` fields in `data.js`.
 * @param {number} level - Nested level of `vocabulary` we are currently
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
 * @param {File} file - User file.
 * @param {String} ext - User file extension.
 * @param {Object} hot - Handsontable instance of grid.
 * @param {Object} xlsx - SheetJS variable.
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
 * @param {Object} hot - Handsontable instance of grid.
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
          const invalidClass = `${this.className} invalid-cell`
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
  window.HOT = createHot(DATA);

  // This is called frequently with sideways scrolling since table viewport is dynamic.
  Handsontable.hooks.add('afterGetColHeader', tableHeaderCallback, window.HOT);

  // File -> New
  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    if (e.target.id === 'new-dropdown-item') {
      if (HOT.countRows() - HOT.countEmptyRows()) {
        $('#clear-data-warning-modal').modal('show');
      }
    } else {
      HOT.destroy();
      window.HOT = createHot(DATA);

      // repeat of above
      Handsontable.hooks.add('afterGetColHeader', tableHeaderCallback, window.HOT);
      // Have to trigger tableHeaderCallback this way, see note below.
      showFields('view-all-fields', DATA, HOT)
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

  // First render of sheet doesnt trigger tableHeaderCallback, so have to do this
  showFields('view-all-fields', DATA, HOT)

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
