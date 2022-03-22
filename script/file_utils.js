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
      
      const workbook = xlsx.read(e.target.result, {
        type: 'binary', 
        raw: true,
        cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
        dateNF: 'yyyy-mm-dd' //'yyyy/mm/dd;@'
      });
      const worksheet =
        updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);
      const matrix = (xlsx.utils.sheet_to_json(
        worksheet, 
        {
          header: 1, 
          raw: false, 
          range: 0
        }
        ));
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
 * Ask user to specify row in matrix containing secondary headers before load.
 * Calls `alertOfUnmappedHeaders` if necessary.
 * @param {Array<Array<String>} matrix Data that user must specify headers for.
 * @param {Object} hot Handsontable instance of grid.
 * @param {Object} data See `data.js`.
 */
const launchSpecifyHeadersModal = (matrix, hot, data) => {
  let flatHeaders = getFlatHeaders(data);
  if (flatHeaders) {
    $('#field-mapping').prepend('<col></col>'.repeat(flatHeaders[1].length+1));
    $('#expected-headers-tr')
        .html('<td><b>Expected second row</b></td> <td>' + flatHeaders[1].join('</td><td>') + '</td>');
    $('#actual-headers-tr')
        .html('<td><b>Imported second row</b></td> <td>' + matrix[1].join('</td><td>') + '</td>');
    flatHeaders[1].forEach(function (item, i) {
      if (item != matrix[1][i])
        $('#field-mapping col').get(i+1).style.backgroundColor = "orange";
    });
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
  }
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
 * Download matrix to file.
 * Note that BOM and UTF-8 can create problems on some systems when importing
 * file.  See "Supported Output Formats" and "UTF-16 Unicode Text" sections of
 * https://reactian.com/sheetjs-community-edition-spreadsheet-data-toolkit/
 * and https://github.com/SheetJS/sheetjs
 * Solution at bottom of: https://github.com/SheetJS/sheetjs/issues/943
 * The "Comma Separated Values" format is actually UTF-8 with BOM prefix.
 * @param {Array<Array<String>>} matrix Matrix to download.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 * @param {Object} xlsx SheetJS variable.
 */
const exportFile = (matrix, baseName, ext, xlsx) => {

  const worksheet = xlsx.utils.aoa_to_sheet(matrix);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  switch (ext) {
    case 'xlsx':
      xlsx.writeFile(workbook, `${baseName}.xlsx`);
      break;
    case 'xls':
      xlsx.writeFile(workbook, `${baseName}.xls`);
      break;
    case 'tsv':
      xlsx.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
      break;
    case 'csv':
      xlsx.writeFile(workbook, `${baseName}.csv`, {bookType: 'csv', FS: ','});
      break;
    case 'tsv (UTF-16)':
      xlsx.writeFile(workbook, `${baseName}.tsv`, {bookType: 'txt', FS: '\t'});
      break;
    case 'csv (UTF-16)':
      xlsx.writeFile(workbook, `${baseName}.csv`, {bookType: 'txt', FS: ','});
      break;
    case 'csv (UTF-8, no BOM)': 
      //Customization: skips BOM prefix '\uFEFF' 
      const csv = xlsx.utils.sheet_to_csv(worksheet, {FS: ','});
      const blob = new Blob([csv], {type: 'text/plain;charset=UTF-8'});
      //A FileSaver module call, avoids {autoBom: true} parameter
      saveAs(blob, `${baseName}.csv`);
      break;
    case 'csv (ASCII)': 
      //Customization: skips BOM prefix, as above.
      const csv2 = xlsx.utils.sheet_to_csv(worksheet, {FS: ','});
      const blob2 = new Blob([csv2], {type: 'text/plain;charset=us-ascii'});
      saveAs(blob2, `${baseName}.csv`);
      break;
  }
};