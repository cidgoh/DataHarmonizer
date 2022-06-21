import { isMatch } from 'date-fns';
import { saveAs } from 'file-saver';
import Handsontable from 'handsontable';
import $ from 'jquery';
import * as XLSX from 'xlsx/xlsx.mjs';

import 'handsontable/dist/handsontable.full.css';
import './data-harmonizer.css';

// TODO: figure out how to get this package.json without the security issues
const VERSION = '1.0.0';
const VERSION_TEXT = 'DataHarmonizer provenance: v' + VERSION;

class DataHarmonizer {
  //An instance of DataHarmonizer has a schema, a domElement, and a handsontable .hot object
  root = null;
  schema_name = null;
  template_name = null;
  template_path = null;
  schema = null; // Schema holding all templates
  template = null; // Specific template from schema
  hot = null;
  menu = null;
  export_formats = {}; // Formats that a given template can export to.
  invalid_cells = null;
  // Currently selected cell range[row,col,row2,col2]
  current_selection = [null, null, null, null];
  field_settings = {};

  constructor(root, options = {}) {
    this.root = root;
    this.schema = options.schema;
    this.loadingScreenRoot = options.loadingScreenRoot || this.root;
    this.self = this;

    this.injectLoadingScreen();

    // Field descriptions. Need to account for dynamically rendered cells.
    $(this.root).on('dblclick', '.secondary-header-cell', (e) => {
      const innerText = e.target.innerText;
      const field = this.getFields().filter(
        (field) => field.title === innerText
      )[0];
      $('#field-description-text').html(this.getComment(field));
      $('#field-description-modal').modal('show');
    });
  }

  injectLoadingScreen() {
    $(this.loadingScreenRoot).append(`
      <div class="w-100 h-100 position-fixed fixed-top" id="loading-screen">
        <div class="d-flex h-100 align-items-center justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Please wait...</span>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * Determines template_path from a URL parameter ?template=Folder/name,
   * or a default value from first template in menu.js
   */
  getTemplate() {
    let template_path = null;
    if (window.URLSearchParams) {
      let params = new URLSearchParams(location.search);
      template_path = params.get('template');
    } else {
      //low-tech way:
      template_path = location.search.split('template=')[1];
    }
    // Validate path if not null:
    if (template_path) {
      const [template_folder, template_name] = template_path.split('/', 2);

      if (
        !(
          template_folder in this.menu ||
          template_name in this.menu[template_folder]
        )
      ) {
        return false;
      }
    }
    // If null, do default template setup - the first one in menu
    else {
      // Default template is first key in menu structure
      const template_folder = Object.keys(this.menu)[0];
      const template_name = Object.keys(this.menu[template_folder])[0];
      template_path = template_folder + '/' + template_name;
    }
    return template_path;
  }

  /**
   * Revise user interface elements to match template path, and trigger
   * load of schema.js and export.js scripts (if necessary).
   *
   * @param {String} template_path: path of template starting from app's
   * template/ folder.
   */
  async useTemplate(template_path) {
    if (!template_path) {
      return false; // Error condition: no template path provided
    }

    const [template_folder, template_name] = template_path.split('/', 2);

    this.schema_name = template_folder;
    this.template_name = template_name;
    this.template_path = template_path;

    try {
      // Loading this template may require loading the SCHEMA it is under.
      await this.useSchema(template_folder);
      //if (!schema_loaded)
      //  return false;

      this.processTemplate(template_name);

      // Asynchronous. Since SCHEMA loaded, export.js should succeed as well.
      await this.reloadJs('export.js');

      return template_name;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Open file specified by user.
   * Only opens `xlsx`, `xlsx`, `csv` and `tsv` files. Will launch the specify
   * headers modal if the file's headers do not match the grid's headers.
   * @param {File} file User file.
   * @param {Object} xlsx SheetJS variable.
   * @return {Promise<>} Resolves after loading data or launching specify headers
   *     modal.
   */

  /**
   * Loads a given javascript file.
   *
   * @param {String} file_name: File in templates/[current schema]/ to load.
   */
  async openFile(dh, file_name) {
    try {
      let contentBuffer = await dh.readFileAsync(file_name);
      dh.loadSpreadsheetData(contentBuffer);
    } catch (err) {
      console.log(err);
    }
  }

  validate() {
    this.invalid_cells = this.getInvalidCells();
    this.hot.render();
  }

  newHotFile() {
    let self = this;
    //this.runBehindLoadingScreen( () => {
    self.createHot();
    //});
  }

  /**
   * Create a blank instance of Handsontable.
   * @param {Object} template.
   * @return {Object} Handsontable instance.
   */
  createHot() {
    const self = this;

    this.invalid_cells = {};
    if (this.hot) {
      this.hot.destroy(); // handles already existing data
      this.hot = null;
    }
    let fields = this.getFields();
    if (fields.length) {
      const hot_settings = {
        data: [], // Enables true reset
        nestedHeaders: this.getNestedHeaders(),
        columns: this.getColumns(),
        colHeaders: true,
        rowHeaders: true,
        manualColumnResize: true,
        //colWidths: [100], //Just fixes first column width
        contextMenu: ['remove_row', 'row_above', 'row_below'],
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
        // beforeChange source: https://handsontable.com/docs/8.1.0/tutorial-using-callbacks.html#page-source-definition
        beforeChange: function (changes) {
          if (!changes) {
            return;
          }

          // When a change in one field triggers a change in another field.
          let triggered_changes = [];

          for (const change of changes) {
            // Check field change rules
            self.fieldChangeRules(change, fields, triggered_changes);
          }
          // Add any indirect field changes onto end of existing changes.
          if (triggered_changes) {
            changes.push(...triggered_changes);
          }
        },
        afterInit: () => {
          $('#next-error-button, #no-error-button').hide();
        },
        afterSelection: (row, column, row2, column2) => {
          self.current_selection = [row, column, row2, column2];
        },
        afterRender: () => {
          // Bit of a hackey way to RESTORE classes to secondary headers. They are
          // removed by Handsontable when re-rendering main table.
          $('.secondary-header-text').each((_, e) => {
            const $cellElement = $(e).closest('th');
            $cellElement.addClass('secondary-header-cell');
            if ($(e).hasClass('required')) {
              $cellElement.addClass('required');
            } else if ($(e).hasClass('recommended')) {
              $cellElement.addClass('recommended');
            }
          });
        },
        afterRenderer: (TD, row, col) => {
          if (Object.prototype.hasOwnProperty.call(self.invalid_cells, row)) {
            if (
              Object.prototype.hasOwnProperty.call(self.invalid_cells[row], col)
            ) {
              const msg = self.invalid_cells[row][col];
              $(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
            }
          }
        },
      };

      this.hot = new Handsontable(this.root, hot_settings);

      this.enableMultiSelection();
    } else {
      console.log(
        'This template had no sections and fields: ' + this.template_path
      );
    }
  }

  addRowsToBottom(numRows) {
    this.runBehindLoadingScreen(() => {
      this.hot.alter('insert_row', this.hot.countRows() - 1 + numRows, numRows);
    });
  }

  /**
   * Modify visibility of columns in grid. This function should only be called
   * after clicking a DOM element used to toggle column visibilities.
   * @param {String} id Id of element clicked to trigger this function. Defaults to show all.
   * @param {Object} data See TABLE.
   * @param {Object} hot Handsontable instance of grid.
   */
  changeColVisibility(id = 'show-all-cols-dropdown-item') {
    // Grid becomes sluggish if viewport outside visible grid upon re-rendering
    this.hot.scrollViewportTo(0, 1);
    const domEl = $('#' + id);

    // Un-hide all currently hidden cols
    const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
    hiddenColsPlugin.showColumns(hiddenColsPlugin.hiddenColumns);

    // Hide user-specied cols
    const hiddenColumns = [];

    // If accessed by menu, disable that menu item, and enable the others
    $(
      '#show-all-cols-dropdown-item, #show-required-cols-dropdown-item, #show-recommended-cols-dropdown-item, .show-section-dropdown-item'
    ).removeClass('disabled');
    domEl.addClass('disabled');

    //Request may be for only required fields, or required+recommended fields
    let required = id === 'show-required-cols-dropdown-item';
    let recommended = id === 'show-recommended-cols-dropdown-item';
    if (required || recommended) {
      this.getFields().forEach(function (field, i) {
        if (required && !field.required) {
          hiddenColumns.push(i);
        } else if (recommended && !(field.required || field.recommended)) {
          hiddenColumns.push(i);
        }
      });
    }

    // prefix of ID indicates if it is a command to show just one section.
    else if (id.indexOf('show-section-') === 0) {
      const section_name = domEl.text();
      let column_ptr = 0;
      for (const section of this.template) {
        // eslint-disable-next-line no-unused-vars
        for (const column of section.children) {
          // First condition ensures first (row identifier) column is not hidden
          if (column_ptr > 0 && section.title != section_name) {
            hiddenColumns.push(column_ptr);
          }
          column_ptr++;
        }
      }
    }
    hiddenColsPlugin.hideColumns(hiddenColumns);
    this.hot.render();
  }

  /**
   * Modify visibility of rows in grid. This function should only be called
   * after clicking a DOM element used to toggle row visibilities.
   * @param {String} id Id of element clicked to trigger this function.
   * @param {Object<Number, Set<Number>>} invalidCells See `getInvalidCells`
   *     return value.
   * @param {Object} hot Handsontable instance of grid.
   */
  changeRowVisibility(id) {
    // Grid becomes sluggish if viewport outside visible grid upon re-rendering
    this.hot.scrollViewportTo(0, 1);

    // Un-hide all currently hidden cols
    const hiddenRowsPlugin = this.hot.getPlugin('hiddenRows');
    hiddenRowsPlugin.showRows(hiddenRowsPlugin.hiddenRows);

    // Hide user-specified rows
    const rows = [...Array(this.hot.countRows()).keys()];
    const emptyRows = rows.filter((row) => this.hot.isEmptyRow(row));
    let hiddenRows = [];

    if (id === 'show-valid-rows-dropdown-item') {
      hiddenRows = Object.keys(this.invalid_cells).map(Number);
      hiddenRows = [...hiddenRows, ...emptyRows];
    } else if (id === 'show-invalid-rows-dropdown-item') {
      const invalidRowsSet = new Set(
        Object.keys(this.invalid_cells).map(Number)
      );
      hiddenRows = rows.filter((row) => !invalidRowsSet.has(row));
      hiddenRows = [...hiddenRows, ...emptyRows];
    }

    hiddenRowsPlugin.hideRows(hiddenRows);
    this.hot.render();
  }

  /**
   * Presents reference guide in a popup.
   * @param {String} mystyle simple css stylesheet commands to override default.
   */
  renderReference(mystyle = null) {
    let schema_template = this.schema.classes[this.template_name];

    let style = `
    body {
      font-family: arial;
      margin:5% 5% 5% 5%;
    }
    
    table {
      width: 100%;
      table-layout: fixed;
    }
    
    table tr.section {
      background-color:#f0f0f0;
      padding:10px;
      font-size:1.5rem;
    }
    
    table th {font-weight: bold; text-align: left; font-size:1.3rem;}
    table th.label {font-weight:bold; width: 25%}
    table th.description {width: 20%}
    table th.guidance {width: 30%}
    table th.example {width: 15%}
    table th.data_status {width: 15%}
    table td {vertical-align: top; padding:5px;border-bottom:1px dashed silver;}
    table td.label {font-weight:bold;}
    
    ul { padding: 0; }
    `;

    if (mystyle != null) {
      style = mystyle;
    }

    let row_html = '';
    for (const section of this.template) {
      row_html += `<tr class="section">
      <td colspan="5"><h3>${section.title || section.name}</h3></td>
      </tr>
      `;
      for (const slot of section.children) {
        const slot_dict = this.getCommentDict(slot);

        row_html += `<tr>
        <td class="label">${slot_dict.title}</td>
        <td>${slot_dict.description}</td>
        <td>${slot_dict.guidance}</td>
        <td>${slot_dict.examples}</td>
        <td>${slot_dict.sources || ''}</td>
        </tr>
        `;
      }
    }

    var win = window.open(
      '',
      'Reference',
      'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600'
    );

    win.document.head.innerHTML = `
    <meta charset="utf-8">
    <title>Reference guide for "${
      schema_template.title || schema_template.name
    }" template</title>
    <meta name="description" content="${schema_template.description || ''}">
    <style>${style}</style>
    `;

    win.document.body.innerHTML = `  
    <div>
    <h2>Reference guide for "${
      schema_template.title || schema_template.name
    }" template</h2>
    <hr size="2"/>
    <p>${schema_template.description || ''}</p>
    
    <table>
    <thead>
    <tr>
    <th class="label">Field</th>
    <th class="description">Description</th>
    <th class="guidance">Guidance</th>
    <th class="example">Examples</th>
    <th class="data_status">Menus</th>
    </tr>
    </thead>
    <tbody>
    ${row_html}
    </tbody>
    </table>
    </div>
    </body>
    </html>
    `;
    return false;
  }

  /**
   * Get the 0-based y-index of every field on the grid.
   * @param {Object} data See TABLE.
   * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
   *     the grid.
   */
  getFieldYCoordinates() {
    const ret = {};
    for (const [i, field] of this.getFields().entries()) {
      ret[field.title] = i;
    }
    return ret;
  }

  getColumnCoordinates() {
    const ret = {};
    let column_ptr = 0;
    for (const section of this.template) {
      ret[section.title] = column_ptr;
      for (const column of section.children) {
        ret[' . . ' + column.title] = column_ptr;
        column_ptr++;
      }
    }
    return ret;
  }

  /**
   * Scroll grid to specified column.
   * @param {String} row 0-based index of row to scroll to.
   * @param {String} column 0-based index of column to scroll to.
   * @param {Object} data See TABLE.
   * @param {Object} hot Handsontable instance of grid.
   */
  scrollTo(row, column) {
    const hiddenCols = this.hot.getPlugin('hiddenColumns').hiddenColumns;
    if (hiddenCols.includes(column)) {
      // If user wants to scroll to a hidden column, make all columns unhidden
      this.changeColVisibility(undefined);
    }

    this.hot.selectCell(
      parseInt(row),
      parseInt(column),
      parseInt(row),
      parseInt(column),
      true
    );
    //Ensures field is positioned on left side of screen.
    this.hot.scrollViewportTo(row, column);
  }

  /**
   * Run void function behind loading screen.
   * Adds function to end of call queue. Does not handle functions with return
   * vals, unless the return value is a promise. Even then, it only waits for the
   * promise to resolve, and does not actually do anything with the value
   * returned from the promise.
   * @param {function} fn - Void function to run.
   * @param {Array} [args=[]] - Arguments for function to run.
   */
  async runBehindLoadingScreen(fn, args = []) {
    await $('#loading-screen').show('fast', 'swing');
    await this.wait(200); // Enough of a visual cue that something is happening
    if (args.length) {
      await fn.apply(this, args);
    } else {
      await fn.apply(this);
    }
    await $('#loading-screen').hide();
    return;
  }

  // wait ms milliseconds
  wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  /***************************** PRIVATE functions *************************/

  // https://simon-schraeder.de/posts/filereader-async/
  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsBinaryString(file);
      //reader.readAsArrayBuffer(file);
    });
  }

  loadSpreadsheetData(data) {
    const workbook = XLSX.read(data, {
      type: 'binary',
      raw: true,
      cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
      dateNF: 'yyyy-mm-dd', //'yyyy/mm/dd;@'
    });

    const worksheet = this.updateSheetRange(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    const matrix = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      range: 0,
    });
    const headerRowData = this.compareMatrixHeadersToGrid(matrix);
    if (headerRowData > 0) {
      this.hot.loadData(
        this.matrixFieldChangeRules(matrix.slice(headerRowData))
      );
    } else {
      this.launchSpecifyHeadersModal(matrix);
    }
  }

  /**
   * Improve `XLSX.utils.sheet_to_json` performance for Libreoffice Calc files.
   * Ensures sheet range is accurate. See
   * https://github.com/SheetJS/sheetjs/issues/764 for more detail.
   * @param {Object} worksheet SheetJs object.
   * @returns {Object} SheetJs worksheet with correct range.
   */
  updateSheetRange(worksheet) {
    const range = { s: { r: 20000000, c: 20000000 }, e: { r: 0, c: 0 } };
    Object.keys(worksheet)
      .filter((x) => {
        return x.charAt(0) !== '!';
      })
      .map(XLSX.utils.decode_cell)
      .forEach((x) => {
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
  launchSpecifyHeadersModal(matrix) {
    let flatHeaders = this.getFlatHeaders();
    const self = this;
    if (flatHeaders) {
      $('#field-mapping').prepend(
        '<col></col>'.repeat(flatHeaders[1].length + 1)
      );
      $('#expected-headers-tr').html(
        '<td><b>Expected second row</b></td> <td>' +
          flatHeaders[1].join('</td><td>') +
          '</td>'
      );
      $('#actual-headers-tr').html(
        '<td><b>Imported second row</b></td> <td>' +
          matrix[1].join('</td><td>') +
          '</td>'
      );
      flatHeaders[1].forEach(function (item, i) {
        if (item != matrix[1][i]) {
          $('#field-mapping col').get(i + 1).style.backgroundColor = 'orange';
        }
      });

      $('#specify-headers-modal').modal('show');
      $('#specify-headers-confirm-btn').click(() => {
        const specifiedHeaderRow = parseInt($('#specify-headers-input').val());
        if (!this.isValidHeaderRow(matrix, specifiedHeaderRow)) {
          $('#specify-headers-err-msg').show();
        } else {
          const mappedMatrixObj = self.mapMatrixToGrid(
            matrix,
            specifiedHeaderRow - 1
          );
          $('#specify-headers-modal').modal('hide');
          this.runBehindLoadingScreen(() => {
            self.hot.loadData(
              self.matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2))
            );
            if (mappedMatrixObj.unmappedHeaders.length) {
              const unmappedHeaderDivs = mappedMatrixObj.unmappedHeaders.map(
                (header) => `<li>${header}</li>`
              );
              $('#unmapped-headers-list').html(unmappedHeaderDivs);
              $('#unmapped-headers-modal').modal('show');
            }
          });
        }
      });
    }
  }

  /**
   * Determine if first or second row of a matrix has the same headers as the
   * grid's secondary (2nd row) headers.  If neither, return false.
   * @param {Array<Array<String>>} matrix
   * @param {Object} data See `data.js`.
   * @return {Integer} row that data starts on, or false if no exact header row
   * recognized.
   */
  compareMatrixHeadersToGrid(matrix) {
    const expectedSecondRow = this.getFlatHeaders()[1];
    const actualFirstRow = matrix[0];
    const actualSecondRow = matrix[1];
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow)) {
      return 1;
    }
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow)) {
      return 2;
    }
    return false;
  }

  /**
   * Validates `$('#specify-headers-input')` input.
   * @param {Array<Array<String>>} matrix
   * @param {number} row 1-based index used to indicate header row in matrix.
   */
  isValidHeaderRow(matrix, row) {
    return Number.isInteger(row) && row > 0 && row <= matrix.length;
  }

  /**
   * Create a matrix containing the grid's headers. Empty strings are used to
   * indicate merged cells.
   * @return {Array<Array<String>>} Grid headers.
   */
  getFlatHeaders() {
    const rows = [[], []];

    for (const parent of this.template) {
      let min_cols = parent.children.length;
      if (min_cols < 1) {
        // Close current dialog and switch to error message
        //$('specify-headers-modal').modal('hide');
        //$('#unmapped-headers-modal').modal('hide');
        const errMsg = `The template for the loaded file has a configuration error:<br/>
          <strong>${parent.title}</strong><br/>
          This is a field that has no parent, or a section that has no fields.`;
        $('#unmapped-headers-list').html(errMsg);
        $('#unmapped-headers-modal').modal('show');

        return false;
      }
      rows[0].push(parent.title);
      // pad remainder of first row columns with empty values
      if (min_cols > 1) {
        rows[0].push(...Array(min_cols - 1).fill(''));
      }
      // Now add 2nd row child titles
      rows[1].push(...parent.children.map((child) => child.title));
    }
    return rows;
  }

  /**
   * Map matrix columns to grid columns.
   * Currently assumes mapped columns will have the same label, but allows them
   * to be in a different order. If the matrix is missing a column, a blank
   * column is used.
   * @param {Array<Array<String>>} matrix
   * @param {Number} matrixHeaderRow Row containing matrix's column labels.
   * @return {MappedMatrixObj} Mapped matrix and details.
   */
  mapMatrixToGrid(matrix, matrixHeaderRow) {
    const expectedHeaders = this.getFlatHeaders();
    const expectedSecondaryHeaders = expectedHeaders[1];
    const actualSecondaryHeaders = matrix[matrixHeaderRow];

    // Map current column indices to their indices in matrix to map
    const headerMap = {};
    const unmappedHeaders = [];
    for (const [i, expectedVal] of expectedSecondaryHeaders.entries()) {
      headerMap[i] = actualSecondaryHeaders.findIndex((actualVal) => {
        return actualVal === expectedVal;
      });
      if (headerMap[i] === -1) {
        unmappedHeaders.push(expectedVal);
      }
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
  }

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
   */
  exportFile(matrix, baseName, ext) {
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);
    const workbook = XLSX.utils.book_new();
    let csv;
    let blob;
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    switch (ext) {
      case 'xlsx':
        XLSX.writeFile(workbook, `${baseName}.xlsx`);
        break;
      case 'xls':
        XLSX.writeFile(workbook, `${baseName}.xls`);
        break;
      case 'tsv':
        XLSX.writeFile(workbook, `${baseName}.tsv`, {
          bookType: 'csv',
          FS: '\t',
        });
        break;
      case 'csv':
        XLSX.writeFile(workbook, `${baseName}.csv`, {
          bookType: 'csv',
          FS: ',',
        });
        break;
      case 'tsv (UTF-16)':
        XLSX.writeFile(workbook, `${baseName}.tsv`, {
          bookType: 'txt',
          FS: '\t',
        });
        break;
      case 'csv (UTF-16)':
        XLSX.writeFile(workbook, `${baseName}.csv`, {
          bookType: 'txt',
          FS: ',',
        });
        break;
      case 'csv (UTF-8, no BOM)':
        //Customization: skips BOM prefix '\uFEFF'
        csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ',' });
        blob = new Blob([csv], { type: 'text/plain;charset=UTF-8' });
        //A FileSaver module call, avoids {autoBom: true} parameter
        saveAs(blob, `${baseName}.csv`);
        break;
      case 'csv (ASCII)':
        //Customization: skips BOM prefix, as above.
        csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ',' });
        blob = new Blob([csv], { type: 'text/plain;charset=us-ascii' });
        saveAs(blob, `${baseName}.csv`);
        break;
    }
  }

  /**
   * Get a flat array of all fields (slot definitions) in TEMPLATE.
   * @return {Array<Object>} Array of all objects under `children` in TEMPLATE.
   */
  getFields() {
    return Array.prototype.concat.apply(
      [],
      this.template.map((section) => section.children)
    );
  }

  /**
   * Create a matrix containing the nested headers supplied to Handsontable.
   * These headers are HTML strings, with useful selectors for the primary and
   * secondary header cells.
   * @return {Array<Array>} Nested headers for Handontable grid.
   */
  getNestedHeaders() {
    const rows = [[], []];
    for (const parent of this.template) {
      rows[0].push({
        label: `<h5 class="pt-2 pl-1">${parent.title}</h5>`,
        colspan: parent.children.length,
      });
      for (const child of parent.children) {
        const required = child.required ? ' required' : '';
        const recommended = child.recommended ? ' recommended' : '';
        rows[1].push(
          `<div class="secondary-header-text${required}${recommended}">${child.title}</div>`
        );
      }
    }
    return rows;
  }

  /**
   * Create an array of cell properties specifying data type for all grid columns.
   * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
   * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
   * @param {Object} data See TABLE.
   * @return {Array<Object>} Cell properties for each grid column.
   */
  getColumns() {
    let ret = [];
    for (let field of this.getFields()) {
      let col = {};
      if (field.required) {
        col.required = field.required;
      }
      if (field.recommended) {
        col.recommended = field.recommended;
      }

      col.source = null;

      if (field.flatVocabulary) {
        col.source = field.flatVocabulary;

        if (field.multivalued === true) {
          col.editor = 'text';
          col.renderer = 'autocomplete';
        } else {
          col.type = 'autocomplete';
          // ISSUE: provide trimDropdown if field is using flatVocabulary just for accepting null values
          if (
            !field.sources.includes('null value menu') ||
            field.sources.length > 1
          ) {
            col.trimDropdown = false;
          }
        }
      }

      // OBSOLETE: metadata_status is now merged with flatVocabulary
      //if (field.metadata_status) {
      //  col.source.push(...field.metadata_status);
      //}

      if (field.datatype == 'xsd:date') {
        col.type = 'date';
        // This controls calendar popup date format, default is mm/dd/yyyy
        // See https://handsontable.com/docs/8.3.0/Options.html#correctFormat
        col.dateFormat = 'YYYY-MM-DD';
        // If correctFormat = true, then on import and on data
        // entry of cell will convert date values like "2020" to "2020-01-01"
        // automatically.
        col.correctFormat = false;
      }

      if (typeof field.getColumn === 'function') {
        col = field.getColumn(this, col);
      }

      ret.push(col);
    }
    return ret;
  }

  /**
   * Enable multiselection on select rows.
   * Indentation workaround: multiples of "  " double space before label are
   * taken to be indentation levels.
   * @param {Object} hot Handonstable grid instance.
   * @param {Object} data See TABLE.
   * @return {Object} Grid instance with multiselection enabled on columns
   * specified as such in the vocabulary.
   */
  enableMultiSelection() {
    const fields = this.getFields();
    this.hot.updateSettings({
      afterBeginEditing: function (row, col) {
        if (fields[col].multivalued === true) {
          const value = this.getDataAtCell(row, col);
          let selections = (value && value.split(';')) || [];
          selections = selections.map((x) => x.trim());
          const selections2 = selections.filter(function (el) {
            return el != '';
          });
          // Cleanup of empty values that can occur with leading/trailing or double ";"
          if (selections.length != selections2.length) {
            this.setDataAtCell(row, col, selections2.join('; '), 'thisChange');
          }
          const self = this;
          let content = '';
          if (fields[col].flatVocabulary) {
            fields[col].flatVocabulary.forEach(function (field) {
              const field_trim = field.trim();
              let selected = selections.includes(field_trim)
                ? 'selected="selected"'
                : '';
              let indentation = field.search(/\S/) * 8; // pixels
              content += `<option value="${field_trim}" ${selected}' style="padding-left:${indentation}px">${field}</option>`;
            });
          }

          $('#field-description-text').html(
            `${fields[col].title}<select multiple class="multiselect" rows="15">${content}</select>`
          );
          $('#field-description-modal').modal('show');
          $('#field-description-text .multiselect')
            .chosen() // must be rendered when html is visible
            .change(function () {
              let newValCsv = $('#field-description-text .multiselect')
                .val()
                .join('; ');
              self.setDataAtCell(row, col, newValCsv, 'thisChange');
            });
        }
      },
    });
  }

  fillColumn(colname, value) {
    const fieldYCoordinates = this.getFieldYCoordinates();
    // ENSURE colname hasn't been tampered with (the autocomplete allows
    // other text)
    if (colname in fieldYCoordinates) {
      let changes = [];
      for (let row = 0; row < this.hot.countRows(); row++) {
        if (!this.hot.isEmptyRow(row)) {
          let col = fieldYCoordinates[colname];
          if (this.hot.getDataAtCell(row, col) !== value) {
            changes.push([row, col, value]);
          }
        }
      }
      if (changes.length > 0) {
        this.hot.setDataAtCell(changes);
        this.hot.render();
      }
    }
  }

  /**
   * Post-processing of values in `data.js` at runtime. This calculates for each
   * categorical field (table column) in data.js a flat list of allowed values
   * in field.flatVocabulary,
   * @param {Object} template_name.
   * @return {Object} Processed values of `data.js`.
   */
  processTemplate(template_name) {
    this.template = []; // This will hold template's new data including table sections.
    let self = this;

    const sectionIndex = new Map();

    // Gets LinkML SchemaView() of given template
    const specification = self.schema.classes[template_name];
    // Class contains inferred attributes ... for now pop back into slots
    specification.slots = specification.attributes;
    /* Lookup each column in terms table. A term looks like:
      is_a: "core field", 
      title: "history/fire", 
      slot_uri: "MIXS:0001086"
      comments: (3) ['Expected value: date', 'Occurrence: 1', 'This field is used uniquely in: soil']
      description: "Historical and/or physical evidence of fire"
      examples: [{…}], 
      multivalued: false, 
      range: "date",
      ...
      */

    for (let name in specification.slots) {
      // ISSUE: a template's slot definition via SchemaView() currently
      // doesn't get any_of or exact_mapping constructs. So we start
      // with slot, then add class's slots reference.
      let field = Object.assign(
        self.schema.slots[name],
        specification.slots[name]
      );

      //let field = specification.slots[name];
      let section_title = null;

      if ('slot_group' in field) {
        // We have a field positioned within a section (or hierarchy)
        section_title = field.slot_group;
      } else {
        if ('is_a' in field) {
          section_title = field.is_a;
        } else {
          section_title = 'Generic';
          console.log("Template field doesn't have section: ", name);
        }
      }

      // We have a field positioned within a section (or hierarchy)

      if (!sectionIndex.has(section_title)) {
        sectionIndex.set(section_title, sectionIndex.size);
        let section_parts = {
          title: section_title,
          children: [],
        };
        const section = self.schema['slots'][section_title];
        if (section) {
          Object.assign(section_parts, section);
        }

        self.template.push(section_parts);
      }

      let section = self.template[sectionIndex.get(section_title)];
      let new_field = { ...field }; // shallow copy

      //console.log(new_field)

      // Some specs don't add plain english title, so fill that with name
      // for display.
      if (!('title' in new_field)) {
        new_field.title = new_field.name;
      }

      // Default field type xsd:token allows all strings that don't have
      // newlines or tabs
      new_field.datatype = null;

      let range_array = [];

      // Multiple ranges allowed.  For now just accepting enumerations
      if ('any_of' in new_field) {
        for (let item of new_field.any_of) {
          if (
            item.range in self.schema.enums ||
            item.range in self.schema.types
          ) {
            range_array.push(item.range);
          }
        }
      } else {
        range_array.push(new_field.range);
      }

      // Parse slot's range(s)
      for (let range of range_array) {
        if (range === undefined) {
          console.log('field has no range', new_field.title);
        }

        // Range is a datatype?
        if (range in self.schema.types) {
          const range_obj = self.schema.types[range];

          /* LinkML typically translates "string" to "uri":"xsd:string" 
            // but this is problematic because that allows newlines which
            // break spreadsheet saving of items in tsv/csv format. Use
            // xsd:token to block newlines and tabs, and clean out leading 
            // and trailing space. xsd:normalizedString allows lead and trai
            // FUTURE: figure out how to accomodate newlines?
            */
          switch (range) {
            case 'string':
              new_field.datatype = 'xsd:token';
              break;
            case 'Provenance':
              new_field.datatype = 'Provenance';
              break;
            default:
              new_field.datatype = range_obj.uri;
            // e.g. 'time' and 'datetime' -> xsd:dateTime'; 'date' -> xsd:date
          }
        } else {
          // If range is an enumeration ...
          if (range in self.schema.enums) {
            const range_obj = self.schema.enums[range];

            if (!('sources' in new_field)) {
              new_field.sources = [];
            }
            if (!('flatVocabulary' in new_field)) {
              new_field.flatVocabulary = [];
            }
            if (!('flatVocabularyLCase' in new_field)) {
              new_field.flatVocabularyLCase = [];
            }

            new_field.sources.push(range);
            // This calculates for each categorical field in schema.yaml a
            // flat list of allowed values (indented to represent hierarchy)
            let flatVocab = self.stringifyNestedVocabulary(
              range_obj.permissible_values
            );
            new_field.flatVocabulary.push(...flatVocab);
            // Lowercase version used for easy lookup/validation
            new_field.flatVocabularyLCase.push(
              ...flatVocab.map((val) => val.trim().toLowerCase())
            );
          } else {
            // If range is a class ...
            // multiple => 1-many complex object
            if (range in self.schema.classes) {
              if (range == 'quantity value') {
                /* LinkML model for quantity value, along lines of https://schema.org/QuantitativeValue, e.g. xsd:decimal + unit
                  PROBLEM: There are a variety of quantity values specified, some allowing units
                  which would need to go in a second column unless validated as text within column.
                  
                  description: >-
                  A simple quantity, e.g. 2cm
                  attributes:
                  verbatim:
                  description: >-
                  Unnormalized atomic string representation, should in syntax {number} {unit}
                  has unit:
                  description: >-
                  The unit of the quantity
                  slot_uri: qudt:unit
                  has numeric value:
                  description: >-
                  The number part of the quantity
                  range:
                  double
                  class_uri: qudt:QuantityValue
                  mappings:
                  - schema:QuantityValue
                  */
              }
            }
          }
        } // End range parsing
      }

      // Provide default datatype if no other selected
      if (!new_field.datatype) {
        new_field.datatype = 'xsd:token';
      }

      // field.todos is used to store some date tests that haven't been
      // implemented as rules yet.
      if (new_field.datatype == 'xsd:date' && new_field.todos) {
        // Have to feed any min/max date comparison back into min max value fields
        for (const test of new_field.todos) {
          if (test.substr(0, 2) == '>=') {
            new_field.minimum_value = test.substr(2);
          }
          if (test.substr(0, 2) == '<=') {
            new_field.maximum_value = test.substr(2);
          }
        }
      }

      /* Older DH enables mappings of one template field to one or more 
        export format fields
        */
      this.setExportField(new_field, true);

      // https://linkml.io/linkml-model/docs/structured_pattern/
      // https://github.com/linkml/linkml/issues/674
      // Look up its parts in "settings", and assemble a regular
      // expression for them into "pattern" field.
      // This augments basic datatype validation
      if ('structured_pattern' in new_field) {
        switch (new_field.structured_pattern.syntax) {
          case '{UPPER_CASE}':
          case '{lower_case}':
          case '{Title_Case}':
            new_field.capitalize = true;
        }
        // TO DO: Do conversion here into pattern field.
      }

      // pattern is supposed to be exlusive to string_serialization
      if ('pattern' in field && field.pattern.length) {
        // Trap invalid regex
        // Issue with NMDC MIxS "current land use" field pattern: "[ ....(all sorts of things) ]" syntax.
        try {
          new_field.pattern = new RegExp(field.pattern);
        } catch (err) {
          console.log(
            `TEMPLATE ERROR: Check the regular expression syntax for "${new_field.title}".`
          );
          console.log(err);
          // Allow anything until regex fixed.
          new_field.pattern = new RegExp(/.*/);
        }
      }
      if (this.field_settings[name]) {
        Object.assign(new_field, this.field_settings[name]);
      }

      section.children.push(new_field);
    } // End slot processing loop

    // Sections and their children are sorted by .rank parameter if available
    this.template.sort((a, b) => a.rank - b.rank);

    // Sort kids in each section
    for (let ptr in this.template) {
      this.template[ptr]['children'].sort((a, b) => a.rank - b.rank);
    }

    this.createHot();
  }

  /**
   * Recursively flatten vocabulary into an array of strings, with each
   * string's level of depth in the vocabulary being indicated by leading
   * spaces.
   * FUTURE possible functionality:
   * Both validation and display of picklist item becomes conditional on
   * other picklist item if "depends on" indicated in picklist item/branch.
   * @param {Object} vocabulary See `vocabulary` fields in SCHEMA.
   * @return {Array<String>} Flattened vocabulary.
   */
  stringifyNestedVocabulary(vocab_list) {
    let ret = [];
    let stack = [];
    for (const pointer in vocab_list) {
      let choice = vocab_list[pointer];
      let level = 0;
      if ('is_a' in choice) {
        level = stack.indexOf(choice.is_a) + 1;
        stack.splice(level + 1, 1000, choice.text);
      } else {
        stack = [choice.text];
      }

      this.setExportField(choice, false);

      ret.push('  '.repeat(level) + choice.text);
    }
    return ret;
  }

  setExportField(field, as_field) {
    if (field.exact_mappings) {
      field.exportField = {};
      for (let item of field.exact_mappings) {
        let ptr = item.indexOf(':');
        if (ptr != -1) {
          const prefix = item.substr(0, ptr);
          if (!(prefix in field.exportField)) {
            field.exportField[prefix] = [];
          }

          const mappings = item.substr(ptr + 1);
          for (let mapping of mappings.split(';')) {
            mapping = mapping.trim();
            const conversion = {};
            //A colon alone means to map value to empty string
            if (mapping == ':') {
              conversion.value = '';
            }
            //colon with contents = field & value
            else {
              if (mapping.indexOf(':') != -1) {
                const binding = mapping.split(':');
                binding[0] = binding[0].trim();
                binding[1] = binding[1].trim();
                if (binding[0] > '') {
                  conversion.field = binding[0];
                }
                if (binding[1] > '') {
                  conversion.value = binding[1];
                }
              }
              //No colon means its just field or value
              else if (as_field == true) {
                conversion.field = mapping;
              } else {
                conversion.value = mapping;
              }
            }
            field.exportField[prefix].push(conversion);
          }
        }
      }
    }
  }

  /**
   * Get an HTML string that describes a field, its examples etc. for display
   * in column header.
   * @param {Object} field Any object under `children` in TABLE.
   * @return {String} HTML string describing field.
   */
  getComment(field) {
    let slot_dict = this.getCommentDict(field);

    let ret = `<p><strong>Label</strong>: ${field.title}</p>`;
    ret += `<p><strong>Name</strong>: ${field.name}</p>`;

    if (field.description) {
      ret += `<p><strong>Description</strong>: ${field.description}</p>`;
    }

    if (slot_dict.guidance) {
      ret += `<p><strong>Guidance</strong>: ${slot_dict.guidance}</p>`;
    }

    if (slot_dict.examples) {
      ret += `<p><strong>Examples</strong>: </p>${slot_dict.examples}`;
    }
    if (slot_dict.sources) {
      ret += `<p><strong>Menus</strong>: </p>${slot_dict.sources}`;
    }
    return ret;
  }

  getCommentDict(field) {
    let self = this;

    let guide = {
      title: field.title,
      name: field.name,
      description: field.description || '',
      guidance: '',
      examples: '',
      sources: '',
    };

    let guidance = [];
    if (field.comments && field.comments.length) {
      guidance = guidance.concat(field.comments);
    }
    if (field.pattern) {
      guidance.push('Pattern as regular expression: ' + field.pattern);
    }
    if (field.structured_pattern) {
      guidance.push('Pattern hint: ' + field.structured_pattern.syntax);
    }
    const hasMinValue = field.minimum_value != null;
    const hasMaxValue = field.maximum_value != null;
    if (hasMinValue || hasMaxValue) {
      let paragraph = 'Value should be ';
      if (hasMinValue && hasMaxValue) {
        paragraph += `between ${field.minimum_value} and ${field.maximum_value} (inclusive).`;
      } else if (hasMinValue) {
        paragraph += `greater than or equal to ${field.minimum_value}.`;
      } else if (hasMaxValue) {
        paragraph += `less than or equal to ${field.maximum_value}.`;
      }
      guidance.push(paragraph);
    }
    if (field.identifier) {
      guidance.push('Each record must have a unique value for this field.');
    }
    if (field.sources && field.sources.length) {
      let sources = [];
      for (const [, item] of Object.entries(field.sources)) {
        // List null value menu items directly
        if (item === 'null value menu') {
          let null_values = Object.keys(
            self.schema.enums[item].permissible_values
          );
          sources.push(item + ': (' + null_values.join('; ') + ')');
        } else {
          sources.push(item);
        }
      }
      guide.sources = '<ul><li>' + sources.join('</li>\n<li>') + '</li></ul>';
    }
    if (field.multivalued) {
      guidance.push('More than one selection is allowed.');
    }

    guide.guidance = guidance
      .map(function (paragraph) {
        return '<p>' + paragraph + '</p>';
      })
      .join('\n');

    if (field.examples && field.examples.length) {
      let examples = [];
      let first_item = true;
      for (const [, item] of Object.entries(field.examples)) {
        if (item.description && item.description.length > 0) {
          if (first_item === true) {
            examples.push(item.description + ':\n<ul>');
            first_item = false;
          } else {
            examples += '</ul>' + item.description + ':\n<ul>';
          }
        }

        if (first_item === true) {
          first_item = false;
          examples += '<ul><li>' + item.value + '</li>\n';
        } else {
          examples += '<li>' + item.value + '</li>\n';
        }
      }
      guide.examples = examples + '</ul>';
    }

    return guide;
  }

  /**
   * Get grid data without trailing blank rows.
   * @return {Array<Array<String>>} Grid data without trailing blank rows.
   */
  getTrimmedData() {
    const gridData = this.hot.getData();
    let lastEmptyRow = -1;
    for (let i = gridData.length; i >= 0; i--) {
      if (this.hot.isEmptyRow(i)) {
        lastEmptyRow = i;
      } else {
        break;
      }
    }

    return lastEmptyRow === -1 ? gridData : gridData.slice(0, lastEmptyRow);
  }

  /**
   *
   * From export_utils.js
   *
   */

  /**
   * Get a dictionary of source field names pointing to column index
   * @param {Object} fields A flat version of data.js.
   * @return {Dictionary<Integer>} Dictionary of all fields.
   */
  getFieldNameMap(fields) {
    const titleMap = {};
    for (const [fieldIndex, field] of fields.entries()) {
      titleMap[field.name] = fieldIndex;
    }
    return titleMap;
  }

  /**
   * Modifies exportHeaders map of fields so that each field contains an array
   * of one or more source fields by name that are used to compose it.
   * This code works on exportHeaders as either a Map or an array of
   * [['field_name',[fields],...]
   * @param {Array} exportHeaders See `export.js`.
   * @param {Array<Object>} fields array of all source fields.
   * @param {String} prefix export column prefix
   */
  getHeaderMap(exportHeaders, fields, prefix) {
    var headerMap = {};
    if (exportHeaders instanceof Map) {
      exportHeaders.forEach((headerIndex, headerValue) => {
        headerMap[headerValue] = headerIndex;
      });
    } else {
      // Array version: handles case where two columns have same name
      for (const [headerIndex, headerItem] of exportHeaders.entries()) {
        // Set mapping only for first instance of name. Access to
        // subsequent identical fields is handled in export.js loop.
        if (!(headerItem[0] in headerMap)) {
          headerMap[headerItem[0]] = headerIndex;
        }
      }
    }

    let field_message = [];
    let field_export_message = [];

    for (const [, field] of fields.entries()) {
      if (field.exportField && prefix in field.exportField) {
        for (const target of field.exportField[prefix]) {
          if ('field' in target) {
            var sources;
            if (exportHeaders instanceof Map) {
              if (target.field in headerMap) {
                field_export_message.push(target.field);
              } else {
                if (!exportHeaders.has(target.field)) {
                  field_message.push(target.field);
                  // Issue: all template driven exportHeader fields are showing AFTER export.js mentioned ones.
                  headerMap[target.field] = exportHeaders.length;
                  exportHeaders.set(target.field, []);
                }
              }
              let sources = exportHeaders.get(target.field);
              if (!sources)
                console.log(
                  'Malformed export.js exportHeader field:',
                  target.field
                );
              // If given field isn't already mapped, add it.
              if (sources.indexOf(field.name) == -1) {
                sources.push(field.name);
              }
              exportHeaders.set(target.field, sources);
            } else {
              // Save to array
              if (target.field in headerMap) {
                field_export_message.push(target.field);
              } else {
                // Add field to exportHeaders
                // Issue: can this handle many-to-one mapping?
                field_message.push(target.field);
                headerMap[target.field] = exportHeaders.length;
                exportHeaders.push([target.field, []]);
              }
              sources = exportHeaders[headerMap[target.field]][1];
              // As above
              if (sources.indexOf(field.name) == -1) {
                sources.push(field.name);
              }
              exportHeaders[headerMap[target.field]][1] = sources;
            }
          }
        }
      }
    }
    // This will output a list of fields added to exportHeaders by way of template specification which haven't been included in export.js
    //if (field_message)
    //	console.log('Export fields added by template:', field_message)
    //if (field_export_message)
    //	console.log('Export fields stated in export.js):', field_export_message)
  }

  /**
   * This provides an export field composed of one or more more input
   * fields, separated by a ';' delimiter if not null.
   * nullOptionsDict allows conversion of "Missing" etc. metadata options to
   * target export system's version of these.
   * @param {String} headerName is field name of target export field
   * @param {Object} sourceRow
   * @param {Array<Object>} sourcetitles array of all source fields.
   * @param {Object} titleMap
   * @param {String} delimiter to separate multi-source field values with
   * @param {String} prefix of export format
   * @param {Map} nullOptionsMap conversion of Missing etc. to export db equivalent.
   * @returm {String} Concatenated string of values.
   */
  getMappedField(
    headerName,
    sourceRow,
    sourcetitles,
    sourceFields,
    titleMap,
    delimiter,
    prefix,
    nullOptionsMap = null,
    skipNull = false
  ) {
    const self = this;
    const mappedCell = [];
    for (const title of sourcetitles) {
      let mappedCellVal = sourceRow[titleMap[title]];
      if (!mappedCellVal) continue;
      mappedCellVal = mappedCellVal.trim();
      if (mappedCellVal.length === 0) continue;
      if (nullOptionsMap && nullOptionsMap.has(mappedCellVal)) {
        mappedCellVal = nullOptionsMap.get(mappedCellVal);
      }
      if (skipNull === true && (!mappedCellVal || mappedCellVal.length === 0))
        continue;

      let field = sourceFields[titleMap[title]];

      if (field.datatype === 'select') {
        mappedCell.push(
          self.getTransformedField(headerName, mappedCellVal, field, prefix)
        );
      } else if (field.multivalued === true) {
        // ISSUE: relying on semicolon delimiter in input

        for (let cellVal of mappedCellVal.split(';')) {
          mappedCell.push(
            self.getTransformedField(headerName, cellVal.trim(), field, prefix)
          );
        }
      } else {
        mappedCell.push(mappedCellVal);
      }
    }
    return mappedCell.join(delimiter);
  }

  /**
   * Some enumeration values get mapped over to export format values.
   *
   * @param {String} headerName column to export to.
   * @param {String} value to be exported.
   * @param {Array<String>} fields list of source fields to examine for mappings.
   * @param {String} prefix of export format to examine.
   */
  getTransformedField(headerName, value, field, prefix) {
    if (field['schema:ItemList']) {
      const term = this.findById(field['schema:ItemList'], value);

      // Looking for term.exportField['GRDI'] for example:
      if (term && 'exportField' in term && prefix in term.exportField) {
        // Here mapping involves a value substitution
        // Note possible [target field]:[value] twist
        for (let mapping of term.exportField[prefix]) {
          // Usually there's just one target field, but one can map a
          // source field to more than one target.
          if (!('field' in mapping) || mapping.field === headerName)
            return mapping.value;
        }
      }
    }
    return value;
  }

  /* Find key in nested object (nested dictionaries)
   * Adapted from: https://codereview.stackexchange.com/questions/73714/find-a-nested-property-in-an-object
   * @param {Dictionary<Dictionary>} o nested Dictionaries
   * @param {String}Key to find in dictionaries
   * @return {Dictionary} or null
   */
  findById(o, key) {
    if (key in o) return o[key];
    var result, p;
    for (p in o) {
      if (
        Object.prototype.hasOwnProperty.call(o, p) &&
        typeof o[p] === 'object'
      ) {
        result = this.findById(o[p], key);
        if (result) {
          return result;
        }
      }
    }
    return result;
  }

  /**
   * Get a dictionary of empty arrays for each ExportHeader field
   * FUTURE: enable it to work with hierarchic vocabulary lists
   *
   * @param {Array<String>} sourceRow array of values to be exported.
   * @param {Array<String>} sourceFields list of source fields to examine for mappings.
   * @param {Array<Array>} RuleDB list of export fields modified by rules.
   * @param {Array<Array>} fields list of export fields modified by rules.
   * @param {Array<Integer>} titleMap map of field names to column index.
   * @param {String} prefix of export format to examine.
   * @return {Array<Object>} fields Dictionary of all fields.
   */

  getRowMap(sourceRow, sourceFields, RuleDB, fields, titleMap, prefix) {
    for (const title of sourceFields) {
      const sourceIndex = titleMap[title];
      let value = sourceRow[sourceIndex]; // All text values.
      // Sets source field to data value so that rules can reference it easily.
      RuleDB[title] = value;
      // Check to see if value is in vocabulary of given select field, and if it
      // has a mapping for export to a GRDI target field above, then set target
      // to value.
      if (value && value.length > 0) {
        const vocab_list = fields[sourceIndex]['schema:ItemList'];
        if (value in vocab_list) {
          const term = vocab_list[value];
          // Looking for term.exportField['GRDI'] for example:
          if ('exportField' in term && prefix in term.exportField) {
            for (let mapping of term.exportField[prefix]) {
              // Here mapping involves a value substitution
              if ('value' in mapping) {
                value = mapping.value;
                // Changed on a copy of data, not handsongrid table
                sourceRow[sourceIndex] = value;
              }
              if ('field' in mapping && mapping['field'] in RuleDB) {
                RuleDB[mapping['field']] = value;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Return first and last items of a delimited string
   * @param {String} value A string of values separated by delimiter.
   * @param {String} delimiter A character which is a delimiter
   * @return {String} A string of at most 2 values.
   */
  concatFirstLastField(value, delimiter) {
    if (value.indexOf(delimiter) !== -1) {
      let fields = value.split(delimiter);
      return fields[0] + ':' + fields[fields.length - 1];
    }
    return value;
  }

  /**
   * If given value is a null value, normalize its capitalization
   * @param {String} value to check.
   * @param {Object} nullOptionsMap dictionary of null values.
   * @return {String} value
   */
  fixNullOptionCase(value, nullOptionsMap) {
    if (value) {
      const valuelc = value.toLowerCase();
      if (nullOptionsMap.has(valuelc)) {
        const value2 = nullOptionsMap.get(valuelc);
        if (value != value2) value = value2;
      }
    }
    return value;
  }

  /**
   *
   * From field_rules.js
   *
   */

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
  fieldChangeRules(change, fields, triggered_changes) {
    const row = change[0];
    const col = change[1];
    const field = fields[col];

    // Test field against capitalization change.
    if (field.capitalize && change[3] && change[3].length > 0)
      change[3] = this.changeCase(change[3], field);

    // Rules that require a particular column following and/or preceeding
    // current one.
    if (fields.length > col + 1) {
      // We're prepping a SPARSE ARRAY here for binChangeTest()
      var matrix = [0];
      matrix[0] = {}; // Essential for creating sparse array.
      matrix[0][col] = change[3]; // prime changed value

      const prevName = col > 0 ? fields[col - 1].title : null;
      const nextName = fields.length > col + 1 ? fields[col + 1].title : null;

      // Match <field>[field unit]
      if (nextName === field.title + ' unit') {
        if (field.datatype === 'xsd:date') {
          // Transform ISO 8601 date to bin year / month granularity.
          // "day" granularity is taken care of by regular date validation.
          // Don't attempt to reformat x/y/z dates here.
          const dateGranularity = this.hot.getDataAtCell(row, col + 1);
          // previously had to block x/y/z with change[3].indexOf('/') === -1 &&
          if (dateGranularity === 'year' || dateGranularity === 'month') {
            change[3] = this.setDateChange(dateGranularity, change[3]);
          }
          return;
        }

        // Match <field>[field unit][field bin]
        const nextNextName =
          fields.length > col + 2 ? fields[col + 2].title : null;
        if (nextNextName === field.title + ' bin') {
          matrix[0][col + 1] = this.hot.getDataAtCell(row, col + 1); //prime unit
          this.binChangeTest(matrix, row, col, fields, 2, triggered_changes);
          return;
        }
      }

      // Match <field>[field bin]
      if (nextName === field.title + ' bin') {
        this.binChangeTest(matrix, row, col, fields, 1, triggered_changes);
        return;
      }

      // Match [field]<field unit>
      if (field.title === prevName + ' unit') {
        // Match [field]<field unit>[field bin]
        if (prevName + ' bin' === nextName) {
          // trigger reevaluation of bin from field
          matrix[0][col - 1] = this.hot.getDataAtCell(row, col - 1);
          this.binChangeTest(
            matrix,
            row,
            col - 1,
            fields,
            2,
            triggered_changes
          );
          return;
        }

        // Match previous field as date field
        // A change from month to year or day to month/year triggers new
        // date value
        if (
          fields[col - 1].datatype === 'xsd:date' &&
          (change[3] === 'year' || change[3] === 'month')
        ) {
          let dateString = this.hot.getDataAtCell(row, col - 1);
          // If there is a date entered, adjust it
          // previously had to block x/y/z with  && dateString.indexOf('/') === -1
          if (dateString) {
            dateString = this.setDateChange(change[3], dateString);
            matrix[0][col - 1] = dateString;
            triggered_changes.push([row, col - 1, undefined, dateString]);
          }
          return;
        }
      }
    }

    if (typeof field.onChange === 'function') {
      field.onChange(change, fields, triggered_changes);
    }
  }

  /**
   * Modify a string to match specified case.
   * @param {String} val String to modify.
   * @param {String} capitalize Case to modify string to; one of `'UPPER'`,
   *     `'lower'` or `'Title'`.
   * @return {String} String with modified case.
   */
  changeCase(val, field) {
    switch (field.structured_pattern.syntax) {
      case '{lower_case}':
        val = val.toLowerCase();
        break;
      case '{UPPER_CASE}':
        val = val.toUpperCase();
        break;
      case '{Title_Case}':
        val = val
          .split(' ')
          .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(' ');
        break;
    }
    return val;
  }

  /**
   * Modify matrix data for grid according to specified rules.
   * This is useful when calling `hot.loadData`, as cell changes from said method
   * are not recognized by `afterChange`.
   * @param {Array<Array<String>>} matrix Data meant for grid.
   * @param {Object} hot Handsontable instance of grid.
   * @param {Object} data See `data.js`.
   * @return {Array<Array<String>>} Modified matrix.
   */
  matrixFieldChangeRules(matrix, hot, data) {
    const fields = this.getFields(data);
    for (let col = 0; col < fields.length; col++) {
      const field = fields[col];

      // Test field against capitalization change.
      if (field.capitalize) {
        for (let row = 0; row < matrix.length; row++) {
          if (!matrix[row][col]) continue;
          matrix[row][col] = this.changeCase(matrix[row][col], field);
        }
      }

      var triggered_changes = [];

      // Rules that require a column or two following current one.
      if (fields.length > col + 1) {
        const nexttitle = fields[col + 1].title;

        // Rule: for any "x bin" field label, following a "x" field,
        // find and set appropriate bin selection.
        if (nexttitle === field.title + ' bin') {
          this.binChangeTest(matrix, 0, col, fields, 1, triggered_changes);
        }
        // Rule: for any [x], [x unit], [x bin] series of fields
        else if (nexttitle === field.title + ' unit') {
          if (fields[col].datatype === 'xsd:date') {
            //Validate
            for (let row = 0; row < matrix.length; row++) {
              if (!matrix[row][col]) continue;
              const dateGranularity = matrix[row][col + 1];
              if (dateGranularity === 'year' || dateGranularity === 'month') {
                matrix[row][col] = this.setDateChange(
                  dateGranularity,
                  matrix[row][col]
                );
              }
            }
          } else if (this.fieldUnitBinTest(fields, col)) {
            // 2 specifies bin offset
            this.binChangeTest(matrix, 0, col, fields, 2, triggered_changes);
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
  setDateChange(dateGranularity, dateString, dateBlank = '__') {
    var dateParts = dateString.split('-');
    // Incomming date may have nothing in it.
    if (dateParts[0].length > 0) {
      switch (dateGranularity) {
        case 'year':
          dateParts[1] = '01';
          dateParts[2] = '01';
          break;
        case 'month':
          if (!dateParts[1]) dateParts[1] = dateBlank; //by default triggers date validation error
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
  fieldUnitBinTest(fields, col) {
    return (
      fields.length > col + 2 &&
      fields[col + 1].title == fields[col].title + ' unit' &&
      fields[col + 2].title == fields[col].title + ' bin'
    );
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
  binChangeTest(matrix, rowOffset, col, fields, binOffset, triggered_changes) {
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
            const unit = matrix[row][col + 1];
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
          for (const number_range of fields[col + binOffset].flatVocabulary) {
            // ParseInt just looks at first part of number
            if (number >= parseFloat(number_range)) {
              selection = number_range;
              continue;
            }
            break;
          }
        } else {
          // Integer/date field is a textual value, possibly a metadata 'Missing'
          // etc. If bin field has a value, leave it unchanged; but if it doesn't
          // then populate bin with input field metadata status too.
          const bin_value = this.hot.getDataAtCell(rowOffset, col + binOffset);
          selection = bin_value; // Default value is itself.

          const bin_values = fields[col + binOffset].flatVocabulary;
          if (!bin_value || (bin_value === '' && value in bin_values)) {
            selection = value;
          }
          // If a unit field exists, then set that to metadata too.
          if (binOffset == 2) {
            const unit_value = this.hot.getDataAtCell(rowOffset, col + 1);
            const unit_values = fields[col + 1].flatVocabulary;
            if (!unit_value || (unit_value === '' && value in unit_values)) {
              triggered_changes.push([
                rowOffset + parseInt(row),
                col + 1,
                undefined,
                value,
              ]);
            }
          }
        }
        triggered_changes.push([
          rowOffset + parseInt(row),
          col + binOffset,
          undefined,
          selection,
        ]);
      }
    }
  }

  /**
   *
   * From validation.js
   *
   */

  /**
   * Get a collection of all invalid cells in the grid.
   * @return {Object<Number, Object<Number, String>>} Object with invalid rows as
   *     keys, and objects containing the invalid cells for the row, along with a
   *     message explaining why, as values. e.g,
   *     `{0: {0: 'Required cells cannot be empty'}}`
   */
  getInvalidCells() {
    const invalidCells = {};
    const fields = this.getFields();
    const columnIndex = this.getFieldYCoordinates();
    let TODAY = new Date();

    const regexDecimal = /^(-|\+|)(0|[1-9]\d*)(\.\d+)?$/;
    let uniquefield = []; // holds lookup dictionary for any unique columns

    let provenanceChanges = [];

    let bad_pattern = {};

    for (let row = 0; row < this.hot.countRows(); row++) {
      if (this.hot.isEmptyRow(row)) continue;

      for (let col = 0; col < fields.length; col++) {
        const cellVal = this.hot.getDataAtCell(row, col);
        const field = fields[col];
        const datatype = field.datatype;

        // TODO we could have messages for all types of invalidation, and add
        //  them as tooltips
        let msg = '';

        // 1st row of provenance datatype field is forced to have a
        // 'DataHarmonizer Version: 0.13.0' etc. value.  Change happens silently.
        if (datatype === 'Provenance') {
          this.checkProvenance(provenanceChanges, cellVal, row, col);
        }

        let valid = false;

        if (!cellVal) {
          if (field.required) msg = 'Required cells cannot be empty';
          else valid = true;
        }

        // If not an empty field, check its contents against field datatype AND/OR other kind of range
        else {
          let parsedInt;
          let parsedFloat;
          let parsedDec;

          switch (datatype) {
            case 'xsd:integer':
              parsedInt = parseInt(cellVal, 10);
              valid = !isNaN(cellVal);
              valid &= parsedInt.toString() === cellVal;
              valid &= this.testNumericRange(parsedInt, field);
              break;

            case 'xsd:nonNegativeInteger':
              parsedInt = parseInt(cellVal, 10);
              valid = !isNaN(cellVal) && parsedInt >= 0;
              valid &= parsedInt.toString() === cellVal;
              valid &= this.testNumericRange(parsedInt, field);
              break;

            case 'xsd:float':
              parsedFloat = parseFloat(cellVal);
              valid = !isNaN(cellVal) && parsedFloat == cellVal;
              valid &= this.testNumericRange(parsedFloat, field);
              break;

            case 'xsd:double':
              // NEED DOUBLE RANGE VALIDATION
              parsedFloat = parseFloat(cellVal);
              //valid = !isNaN(cellVal) && regexDouble.test(cellVal);
              valid &=
                !isNaN(cellVal) && this.testNumericRange(parsedFloat, field);
              break;

            case 'xsd:decimal':
              parsedDec = parseFloat(cellVal);
              valid = !isNaN(cellVal) && regexDecimal.test(cellVal);
              valid &= this.testNumericRange(parsedDec, field);
              break;

            // XML Boolean lexical space accepts true, false, and also 1
            // (for true) and 0 (for false).
            case 'xsd:boolean':
              valid =
                !isNaN(cellVal) &&
                ['1', '0', 'true', 'false'].indexOf(cellVal) >= 0;
              break;

            case 'xsd:date':
              valid = isMatch(cellVal, 'yyyy-MM-dd');

              if (valid) {
                valid = this.testDateRange(
                  cellVal,
                  field,
                  columnIndex,
                  row,
                  TODAY
                );
              }
              break;

            case 'xsd:string':
              // Default: any string is valid.
              valid = true;
              break;

            case 'xsd:normalizedString':
              // Default: any string is valid.
              valid = true;
              break;

            case 'xsd:token':
              // Default: any token is valid.
              valid = true;
              break;
          } // End switch

          // A regular expression can be applied against a string or numeric or date value. It doesn't make sense against a categorical value.
          if (valid && field.pattern) {
            // Pattern shouldn't be anything other than a regular expression object
            try {
              valid = field.pattern.test(cellVal);
            } catch (err) {
              if (!(field.pattern in bad_pattern)) {
                bad_pattern[field.pattern] = true;
                console.log(
                  `Regular expression /${field.pattern}/ in ${field.title} failed`,
                  err
                );
              }
              continue;
            }
          }

          // Now perhaps value is invalid from numeric or date datatype
          // perspective, or its an xsd:token where anything goes. Check if
          // there are other enumeration values possible in flatVocabulary.
          else if (
            (!valid || datatype === 'xsd:token') &&
            field.flatVocabulary
          ) {
            if (field.multivalued === true) {
              const [vocabValid, update] = this.validateValsAgainstVocab(
                cellVal,
                field
              );
              valid = vocabValid;
              if (update)
                this.hot.setDataAtCell(row, col, update, 'thisChange');
            } else {
              const [vocabValid, update] = this.validateValAgainstVocab(
                cellVal,
                field
              );
              valid = vocabValid;
              if (update) {
                this.hot.setDataAtCell(row, col, update, 'thisChange');
              }
            }
            // Hardcoded case: If field is xsd:token, and 1st picklist is
            // "null value menu" then ignore validation on free-text stuff.
            if (
              !valid &&
              field.datatype === 'xsd:token' &&
              field.sources.length == 1 &&
              field.sources[0] === 'null value menu'
            )
              valid = true;
            //console.log(field.sources, field.datatype, valid, update, datatype)
          }
        } // End of field-not empty section

        // Unique value field (Usually xsd:token string)
        // CORRECT PLACE FOR THIS?
        if (field.identifier && field.identifier === true) {
          // Set up dictionary and count for this column's unique values
          if (!uniquefield[col]) {
            uniquefield[col] = {};
            for (let keyrow = 0; keyrow < this.hot.countRows(); keyrow++) {
              if (!this.hot.isEmptyRow(keyrow)) {
                let key = this.hot.getDataAtCell(keyrow, col);
                if (key in uniquefield[col]) uniquefield[col][key] += 1;
                else uniquefield[col][key] = 1;
              }
            }
          }
          // Must be only 1 unique value.  Case insensitive comparison
          valid &= uniquefield[col][cellVal] === 1;
        }

        if (!valid) {
          if (!Object.prototype.hasOwnProperty.call(invalidCells, row)) {
            invalidCells[row] = {};
          }
          invalidCells[row][col] = msg;
        }
      } // column/field loop end
    } // row loop end

    // Here an array of (row, column, value)... is being passed
    if (provenanceChanges.length) this.hot.setDataAtCell(provenanceChanges);

    return invalidCells;
  }

  /**
   * Test cellVal against "DataHarmonizer provenance: vX.Y.Z" pattern and if it
   * needs an update, do so.
   * @param {Array} provenanceChanges array of provenance updates
   * @param {Object} cellVal field value to be tested.
   * @param {Integer} row index of data
   * @param {Integer} column index of data
   */
  checkProvenance(provenanceChanges, cellVal, row, col) {
    if (!cellVal) {
      provenanceChanges.push([row, col, VERSION_TEXT]);
      return;
    }
    // Most of the time this is the first return point.
    if (cellVal === VERSION_TEXT) return;

    if (cellVal.substring(0, 14) !== 'DataHarmonizer') {
      provenanceChanges.push([row, col, VERSION_TEXT + ';' + cellVal]);
      return;
    }
    // At this point we have a leading "DataHarmonizer v..." string
    let splitVal = cellVal.split(';', 2);

    if (splitVal.length == 1) provenanceChanges.push([row, col, VERSION_TEXT]);
    else provenanceChanges.push([row, col, VERSION_TEXT + ';' + splitVal[1]]);

    return;
  }

  /**
   * Test a given number against an upper or lower range, if any.
   * @param {Number} number to be compared.
   * @param {Object} field that contains min and max limits.
   * @return {Boolean} validity of field.
   */
  testNumericRange(number, field) {
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
   * Test a given date against an upper or lower range, if any.
   * @param {Date} date to be compared.
   * @param {Object} field that contains min and max limits.
   * @return {Boolean} validity of field.
   */
  testDateRange(aDate, field, columnIndex, row, TODAY) {
    const self = this;
    var jsDate = new Date(aDate);

    const comparison = [field.minimum_value, field.maximum_value];

    for (const ptr in comparison) {
      let c_items = comparison[ptr];
      if (c_items) {
        // Delimited list allows for test against date AND other fields.
        for (let c_item of c_items.split(';')) {
          if (c_item !== '') {
            // Signals lookup expressions:
            if (c_item[0] === '{') {
              if (c_item === '{today}') {
                if (self.itemCompare(jsDate, TODAY, ptr)) return false;
              } else {
                let field = c_item.substr(1, c_item.length - 2);
                let col = columnIndex[field];
                let lookup_item = self.hot.getDataAtCell(row, col);
                if (lookup_item !== '')
                  if (self.itemCompare(jsDate, new Date(lookup_item), ptr))
                    return false;
              }
            } else {
              // Assumes this is just a constant date string.
              if (self.itemCompare(jsDate, new Date(c_item), ptr)) return false;
            }
          }
        }
      }
    }

    return true;
  }

  /**
   * Simplifies logic to compare number or date ranges where test limit
   * is either min_inclusive or max_inclusive
   * @param {Date or Number} item_1 First value to compare
   * @param {Date or Number} item_2 Second value to compare
   * @param {Boolean} gt Type of comparison: 0 = > , 1 = <
   * @return {Boolean} Result of comparison
   */
  itemCompare(item_1, item_2, gt) {
    if (gt == 1) return item_1 > item_2;
    return item_1 < item_2;
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
  validateValAgainstVocab(value, field) {
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
  validateValsAgainstVocab(delimited_string, field) {
    const self = this;
    let update_flag = false;
    let value_array = delimited_string.split(';');
    value_array.forEach(function (value, index) {
      const [valid, update] = self.validateValAgainstVocab(value, field);
      if (!valid) return [false, false];
      if (update) {
        update_flag = true;
        value_array[index] = update;
      }
    });
    if (update_flag) return [true, value_array.join(';')];
    else return [true, false];
  }
}

export default DataHarmonizer;
