/**
 * @fileOverview This implements DataHarmonizer, a browser-based spreadsheet
 * application that operates off of LinkML templates. Currently can be run
 * locally without a webserver, thus providing ease-of-use and security.
 * Functionality for uploading, downloading and validating data.
 * Implemented with https://handsontable.com/ "handsontable" widget.
 *
 * NOTE: If you are using Chrome javascript debugger console: using this
 * tool disables double clicking on HandsonTable cells, so you won't see 
 * column help or cell insert/delete row actions, and it seems to disable 
 * the createHot afterRender event/method.
 * 
 * templates/menu.js provides a list of templates available for this widget,
 * which will be displayed in a menu. A template can also be accessed by adding
 * it as a folder name in the URL parameter. This enables testing of a template
 * even if it hasn't been incorporated into the menu.
 *
 * main.html?template=MIxS/soil
 *
 * MIxS example schemas are available at:
 * https://github.com/GenomicsStandardsConsortium/mixs-source/tree/main/model/schema
 *
 */

const VERSION = '0.6.1';
const VERSION_TEXT = 'DataHarmonizer provenance: v' + VERSION;

let DataHarmonizer = {

	//An instance of DataHarmonizer has a schema, a domElement, and a handsontable .hot object
	dhGrid: null,
	dhFooter: null,
	schema_name: null,
	template_name: null,
	template_path: null,
	schema: null,			// Schema holding all templates
	template: null,			// Specific template from schema
	table: null,			// Table data.
	hot: null,
	hot_settings: null,
	menu: null,
	export_formats: null,
	invalid_cells: null,
	// Currently selected cell range[row,col,row2,col2]
	current_selection: [null,null,null,null],

	init: function(dhGrid, dhFooter=null, menu=null) {
		this.dhGrid = dhGrid;
		this.dhFooter = dhFooter;
		this.menu = menu;
		this.self = this;

		// Field descriptions. Need to account for dynamically rendered cells.
		$(this.dhGrid).on('dblclick', '.secondary-header-cell', (e) => {
			const innerText = e.target.innerText;
			const field = this.getFields().filter(field => field.title === innerText)[0];
			$('#field-description-text').html(this.getComment(field));
			$('#field-description-modal').modal('show');
		});

		// Add more rows.  Here because it needs referenc to self.hot
		$(this.dhFooter).find('.add-rows-button').click((e) => {
			this.runBehindLoadingScreen(function() {
				const numRows = $(this.dhFooter).find('.add-rows-input').val();
				this.hot.alter('insert_row', this.hot.countRows()-1 + numRows, numRows);
			});
		});
	},

	useSchema: async function(template_folder) {

		if (!this.schema || this.schema.folder != template_folder) {
			try {
				this.schema_name = template_folder;
				return (await this.reloadJs('schema.js'));
			}
			catch (err) {
				// Problem loading schema
				return false;
			}
		}
		return this.schema_name
	},

	/**
	 * Determines template_path from a URL parameter ?template=Folder/name, 
	 * or a default value from first template in menu.js
	 */
	getTemplate: function () {
		let template_path = null;
		if (window.URLSearchParams) {
			let params = new URLSearchParams(location.search);
			template_path = params.get('template');
		}
		else {//low-tech way:
			template_path = location.search.split("template=")[1];
		}
		// Validate path if not null:
		if (template_path) {
			[template_folder, template_name] = template_path.split('/',2); 

			if (!(template_folder in this.menu || template_name in this.menu[template_folder]) ) {
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
	},

	/**
	 * Revise user interface elements to match template path, and trigger
	 * load of schema.js and export.js scripts (if necessary).  script.onload goes on
	 * to trigger launch(TABLE).
	 * @param {String} template_path: path of template starting from app's
	 * template/ folder.
	 */
	useTemplate: async function(template_path) {

		if (!template_path) 
			return false; // Error condition: no template path provided

		[template_folder, template_name] = template_path.split('/',2); 

		this.schema_name = template_folder;
		this.template_name = template_name;
		this.template_path = template_path;

		//try {
			// Loading this template may require loading the SCHEMA it is under.
			const schema_loaded = await this.useSchema(template_folder);
			//if (!schema_loaded) 
			//	return false;

			this.processTemplate(template_name);
			//this.newHotFile();
			this.createHot();

			// Asynchronous. Since SCHEMA loaded, export.js should succeed as well.
			this.reloadJs('export.js');

			return template_name;
		//}
		//catch(err) {
		//	console.log(err);
		//}

	},

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
	openFile: async function(dh, file_name) {
		try {
			let contentBuffer = await dh.readFileAsync(file_name);
			dh.loadSpreadsheetData (contentBuffer);
		}
		catch(err) {
			console.log(err);
		}
	},

	validate: function(){
		this.invalid_cells = this.getInvalidCells();
		this.hot.render();
	},

	newHotFile: function () {
		let self = this;
		//this.runBehindLoadingScreen( () => {
			self.createHot();
		//});
	},

	/**
	 * Create a blank instance of Handsontable.
	 * @param {Object} template.
	 * @return {Object} Handsontable instance.
	 */
	createHot: function () {
		const self = this;

		this.invalid_cells = {};
		if (this.hot) {
			this.hot.destroy(); // handles already existing data
			this.hot = null;
		}
		let fields = this.getFields();
		if (fields.length) {

			this.hot_settings = {
				data: [], // Enables true reset
				nestedHeaders: this.getNestedHeaders(),
				columns: this.getColumns(),
				colHeaders: true,
				rowHeaders: true,
				manualColumnResize: true,
				//colWidths: [100], //Just fixes first column width
				contextMenu: ["remove_row","row_above","row_below"],
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
				beforeChange: function(changes, source) { 
					if (!changes) return;

				// When a change in one field triggers a change in another field.
				let triggered_changes = []; 

				for (const change of changes) {
					const column = change[1];
					// Check field change rules
					self.fieldChangeRules(change, fields, triggered_changes);
				}
				// Add any indirect field changes onto end of existing changes.
				if (triggered_changes) 
					changes.push(...triggered_changes);
				},
				afterInit: () => {
					$('#next-error-button, #no-error-button').hide();
				},
				afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
					self.current_selection = [row, column, row2, column2];
				},
				afterRender: (isForced) => {
					$('.data-harmonizer-header').css('visibility', 'visible');
					$('.data-harmonizer-footer').css('visibility', 'visible');

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
					if (self.invalid_cells.hasOwnProperty(row)) {
						if (self.invalid_cells[row].hasOwnProperty(col)) {
							const msg = self.invalid_cells[row][col];
							$(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
						}
					}
				},
			};
			//this.hot_settings.data = []; // Enables true reset.

			this.hot = Handsontable(this.dhGrid, this.hot_settings);

			this.enableMultiSelection();

		}
		else {
			console.log("This template had no sections and fields: " + this.template_path)
		}

	},

	/**
	 * Modify visibility of columns in grid. This function should only be called
	 * after clicking a DOM element used to toggle column visibilities.
	 * @param {String} id Id of element clicked to trigger this function. Defaults to show all.
	 * @param {Object} data See TABLE.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	changeColVisibility: function (id = 'show-all-cols-dropdown-item') {
	  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
	  this.hot.scrollViewportTo(0, 1);
	  const domEl = $('#' + id);

	  // Un-hide all currently hidden cols
	  const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
	  hiddenColsPlugin.showColumns(hiddenColsPlugin.hiddenColumns);

	  // Hide user-specied cols
	  const hiddenColumns = [];

	  // If accessed by menu, disable that menu item, and enable the others
	  $('#show-all-cols-dropdown-item, #show-required-cols-dropdown-item, #show-recommended-cols-dropdown-item, .show-section-dropdown-item')
		.removeClass('disabled');
	  domEl.addClass('disabled');


	  //Request may be for only required fields, or required+recommended fields
	  let required = (id === 'show-required-cols-dropdown-item');
	  let recommended = (id === 'show-recommended-cols-dropdown-item');
	  if (required || recommended) {
		this.getFields().forEach(function(field, i) {
		  if (required && !field.required)
			hiddenColumns.push(i);
		  else 
			if (recommended && !(field.required || field.recommended))
			  hiddenColumns.push(i);
		});
	  }

	  // prefix of ID indicates if it is a command to show just one section.
	  else if (id.indexOf('show-section-') === 0) {
		const section_name = domEl.text();
		let column_ptr = 0;
		for (section of this.template) {
		  for (column of section.children) {
			// First condition ensures first (row identifier) column is not hidden
			if (column_ptr > 0 && section.title != section_name) {
			  hiddenColumns.push(column_ptr)
			}
			column_ptr ++;
		  }
		};
	  }
	  hiddenColsPlugin.hideColumns(hiddenColumns);
	  this.hot.render();
	},

	/**
	 * Modify visibility of rows in grid. This function should only be called
	 * after clicking a DOM element used to toggle row visibilities.
	 * @param {String} id Id of element clicked to trigger this function.
	 * @param {Object<Number, Set<Number>>} invalidCells See `getInvalidCells`
	 *     return value.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	changeRowVisibility: function (id, invalidCells) {
	  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
	  this.hot.scrollViewportTo(0, 1);

	  // Un-hide all currently hidden cols
	  const hiddenRowsPlugin = this.hot.getPlugin('hiddenRows');
	  hiddenRowsPlugin.showRows(hiddenRowsPlugin.hiddenRows);

	  // Hide user-specified rows
	  const rows = [...Array(this.hot.countRows()).keys()];
	  const emptyRows = rows.filter(row => this.hot.isEmptyRow(row));
	  let hiddenRows = [];

	  if (id === 'show-valid-rows-dropdown-item') {
		hiddenRows = Object.keys(this.invalid_cells).map(Number);
		hiddenRows = [...hiddenRows, ...emptyRows];
	  } 
	  else if (id === 'show-invalid-rows-dropdown-item') {
		const invalidRowsSet = new Set(Object.keys(this.invalid_cells).map(Number));
		hiddenRows = rows.filter(row => !invalidRowsSet.has(row));
		hiddenRows = [...hiddenRows, ...emptyRows];
	  }

	  hiddenRowsPlugin.hideRows(hiddenRows);
	  this.hot.render();
	},

	/**
	 * Get the 0-based y-index of every field on the grid.
	 * @param {Object} data See TABLE.
	 * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
	 *     the grid.
	 */
	getFieldYCoordinates: function () {
	  const ret = {};
	  for (const [i, field] of this.getFields().entries()) {
		ret[field.title] = i;
	  }
	  return ret;
	},

	getColumnCoordinates: function () {
	  const ret = {};
	  let column_ptr = 0;
	  for (section of this.template) {
		ret[section.title] = column_ptr;
		for (column of section.children) {
		  ret[' . . ' + column.title] = column_ptr;
		  column_ptr ++;
		}
	  }
	  return ret;
	},

	/**
	 * Scroll grid to specified column.
	 * @param {String} row 0-based index of row to scroll to.
	 * @param {String} column 0-based index of column to scroll to.
	 * @param {Object} data See TABLE.
	 * @param {Object} hot Handsontable instance of grid.
	 */
	scrollTo: function (row, column) {

	  const hiddenCols = this.hot.getPlugin('hiddenColumns').hiddenColumns;
	  if (hiddenCols.includes(column)) 

		// If user wants to scroll to a hidden column, make all columns unhidden
		this.changeColVisibility(undefined);

	  this.hot.selectCell(parseInt(row), parseInt(column), parseInt(row), parseInt(column), true);
	  //Ensures field is positioned on left side of screen.
	  this.hot.scrollViewportTo(row, column);

	},



	/**
	 * Run void function behind loading screen.
	 * Adds function to end of call queue. Does not handle functions with return
	 * vals, unless the return value is a promise. Even then, it only waits for the
	 * promise to resolve, and does not actually do anything with the value
	 * returned from the promise.
	 * @param {function} fn - Void function to run.
	 * @param {Array} [args=[]] - Arguments for function to run.
	 */
	runBehindLoadingScreen: async function(fn, args=[]) {
		await $('#loading-screen').show('fast', 'swing');
		await this.wait(200); // Enough of a visual cue that something is happening
		if (args.length)
			await fn.apply(this, args);
		else {
			await fn.apply(this);
		}
		await $('#loading-screen').hide();
		return
	},

	// wait ms milliseconds
	wait: function (ms) {
	  return new Promise(r => setTimeout(r, ms));
	},
/***************************** PRIVATE functions *************************/


	// https://simon-schraeder.de/posts/filereader-async/
	readFileAsync: function (file) {
	  return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
		  resolve(reader.result);
		};

		reader.onerror = reject;

		reader.readAsBinaryString(file);
		//reader.readAsArrayBuffer(file);
	  })
	},

	loadSpreadsheetData: function (data) {
		const workbook = XLSX.read(data, {
			type: 'binary', 
			raw: true,
			cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
			dateNF: 'yyyy-mm-dd' //'yyyy/mm/dd;@'
		});
	
		const worksheet = this.updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);

		const matrix = (XLSX.utils.sheet_to_json(
			worksheet, 
			{
				header: 1, 
				raw: false, 
				range: 0
			}
			));
		const headerRowData = this.compareMatrixHeadersToGrid(matrix);
		if (headerRowData > 0) {
			this.hot.loadData(this.matrixFieldChangeRules(matrix.slice(headerRowData)));
		} 
		else {
			this.launchSpecifyHeadersModal(matrix);
		}
	},

	/**
	* Improve `XLSX.utils.sheet_to_json` performance for Libreoffice Calc files.
	* Ensures sheet range is accurate. See
	* https://github.com/SheetJS/sheetjs/issues/764 for more detail.
	* @param {Object} worksheet SheetJs object.
	* @returns {Object} SheetJs worksheet with correct range.
	*/
	updateSheetRange: function (worksheet) {
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
	},


	/**
	 * Ask user to specify row in matrix containing secondary headers before load.
	 * Calls `alertOfUnmappedHeaders` if necessary.
	 * @param {Array<Array<String>} matrix Data that user must specify headers for.
	 * @param {Object} hot Handsontable instance of grid.
	 * @param {Object} data See `data.js`.
	 */
	launchSpecifyHeadersModal: function(matrix) {
		let flatHeaders = this.getFlatHeaders();
		const self = this;
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
				const specifiedHeaderRow = parseInt($('#specify-headers-input').val());
				if (!this.isValidHeaderRow(matrix, specifiedHeaderRow)) {
					$('#specify-headers-err-msg').show();
				} 
				else {
					const mappedMatrixObj = self.mapMatrixToGrid(matrix, specifiedHeaderRow-1);
					$('#specify-headers-modal').modal('hide');
					this.runBehindLoadingScreen(() => {
						self.hot.loadData(self.matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2)));
						if (mappedMatrixObj.unmappedHeaders.length) {
							const unmappedHeaderDivs = mappedMatrixObj.unmappedHeaders.map(header => `<li>${header}</li>`);
							$('#unmapped-headers-list').html(unmappedHeaderDivs);
							$('#unmapped-headers-modal').modal('show');
						}
					});
				}
			});
		}
	},


	/**
	* Determine if first or second row of a matrix has the same headers as the 
	* grid's secondary (2nd row) headers.  If neither, return false.
	* @param {Array<Array<String>>} matrix
	* @param {Object} data See `data.js`.
	* @return {Integer} row that data starts on, or false if no exact header row
	* recognized.
	*/
	compareMatrixHeadersToGrid: function (matrix) {
		const expectedSecondRow = this.getFlatHeaders()[1];
		const actualFirstRow = matrix[0];
		const actualSecondRow = matrix[1];
		if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow))
			return 1;
		if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow))
			return 2;
		return false;
	},

	/**
	* Validates `$('#specify-headers-input')` input.
	* @param {Array<Array<String>>} matrix
	* @param {number} row 1-based index used to indicate header row in matrix.
	*/
	isValidHeaderRow: function (matrix, row) {
		return Number.isInteger(row) && row > 0 && row <= matrix.length;
	},

	/**
	* Create a matrix containing the grid's headers. Empty strings are used to
	* indicate merged cells.
	* @return {Array<Array<String>>} Grid headers.
	*/
	getFlatHeaders: function() {
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
			if (min_cols > 1)
				rows[0].push(...Array(min_cols-1).fill(''));
			// Now add 2nd row child titles
			rows[1].push(...parent.children.map(child => child.title));
		}
		return rows;
	},

	/**
	* Map matrix columns to grid columns.
	* Currently assumes mapped columns will have the same label, but allows them
	* to be in a different order. If the matrix is missing a column, a blank
	* column is used.
	* @param {Array<Array<String>>} matrix
	* @param {Number} matrixHeaderRow Row containing matrix's column labels.
	* @return {MappedMatrixObj} Mapped matrix and details.
	*/
	mapMatrixToGrid: function (matrix, matrixHeaderRow) {
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
				} 
				else {
					mappedDataRows[i][j] = dataRows[i][headerMap[j]];
				}
			}
		}

		return {
			matrix: [...expectedHeaders, ...mappedDataRows],
			unmappedHeaders: unmappedHeaders,
		};
	},


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
	exportFile: function (matrix, baseName, ext) {

		const worksheet = XLSX.utils.aoa_to_sheet(matrix);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		switch (ext) {
			case 'xlsx':
				XLSX.writeFile(workbook, `${baseName}.xlsx`);
				break;
			case 'xls':
				XLSX.writeFile(workbook, `${baseName}.xls`);
				break;
			case 'tsv':
				XLSX.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
				break;
			case 'csv':
				XLSX.writeFile(workbook, `${baseName}.csv`, {bookType: 'csv', FS: ','});
				break;
			case 'tsv (UTF-16)':
				XLSX.writeFile(workbook, `${baseName}.tsv`, {bookType: 'txt', FS: '\t'});
				break;
			case 'csv (UTF-16)':
				XLSX.writeFile(workbook, `${baseName}.csv`, {bookType: 'txt', FS: ','});
				break;
			case 'csv (UTF-8, no BOM)': 
				//Customization: skips BOM prefix '\uFEFF' 
				const csv = XLSX.utils.sheet_to_csv(worksheet, {FS: ','});
				const blob = new Blob([csv], {type: 'text/plain;charset=UTF-8'});
				//A FileSaver module call, avoids {autoBom: true} parameter
				saveAs(blob, `${baseName}.csv`);
				break;
			case 'csv (ASCII)': 
				//Customization: skips BOM prefix, as above.
				const csv2 = XLSX.utils.sheet_to_csv(worksheet, {FS: ','});
				const blob2 = new Blob([csv2], {type: 'text/plain;charset=us-ascii'});
				saveAs(blob2, `${baseName}.csv`);
				break;
		}
	},


	/**
	 * Get a flat array of all fields (slot definitions) in TEMPLATE.
	 * @return {Array<Object>} Array of all objects under `children` in TEMPLATE.
	 */
	getFields: function() {
		return Array.prototype.concat.apply([], this.template.map(section => section.children));
	},

	/**
	 * Create a matrix containing the nested headers supplied to Handsontable.
	 * These headers are HTML strings, with useful selectors for the primary and
	 * secondary header cells.
	 * @return {Array<Array>} Nested headers for Handontable grid.
	 */
	getNestedHeaders: function() {
	  const rows = [[], []];
	  for (const parent of this.template) {
		rows[0].push({
		  label: `<h5 class="pt-2 pl-1">${parent.title}</h5>`,
		  colspan: parent.children.length
		});
		for (const child of parent.children) {
		  const required = child.required ? ' required' : '';
		  const recommended = child.recommended ? ' recommended' : '';
		  rows[1].push(`<div class="secondary-header-text${required}${recommended}">${child.title}</div>`);
		}
	  }
	  return rows;
	},

	/**
	 * Create an array of cell properties specifying data type for all grid columns.
	 * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
	 * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
	 * @param {Object} data See TABLE.
	 * @return {Array<Object>} Cell properties for each grid column.
	 */
	getColumns: function () {
	  let ret = [];
	  for (let field of this.getFields()) {
		const col = {};
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
		  }
		  else {
			col.type = 'autocomplete';
			col.trimDropdown = false;
		  }

		}

		if (field.metadata_status) {
		  col.source.push(...field.metadata_status);

		}

		switch (field.datatype) {

		  case 'xsd:date': 
			col.type = 'date';
			// This controls calendar popup date format, default is mm/dd/yyyy
			// See https://handsontable.com/docs/8.3.0/Options.html#correctFormat
			col.dateFormat = 'YYYY-MM-DD';
			// If correctFormat = true, then on import and on data
			// entry of cell will convert date values like "2020" to "2020-01-01"
			// automatically.
			col.correctFormat = false; 
			break;

		  //case 'xsd:float':
		  //case 'xsd:integer':
		  //case 'xsd:nonNegativeInteger':
		  //case 'xsd:decimal':
		  default:
			if (field.metadata_status) {
			  col.type = 'autocomplete';
			}
			break;
		}


		ret.push(col);
	  }
	  return ret;
	},


	/**
	 * Enable multiselection on select rows.
	 * Indentation workaround: multiples of "  " double space before label are 
	 * taken to be indentation levels.
	 * @param {Object} hot Handonstable grid instance.
	 * @param {Object} data See TABLE.
	 * @return {Object} Grid instance with multiselection enabled on columns
	 * specified as such in the vocabulary.
	 */
	enableMultiSelection: function () {
	  const fields = this.getFields();
	  this.hot.updateSettings({
		afterBeginEditing: function(row, col) {
		  if (fields[col].multivalued === true) {
			const value = this.getDataAtCell(row, col);
			let selections = value && value.split(';') || [];
			selections = selections.map(x => x.trim());
			selections2 = selections.filter(function (el) {return el != ''});
			// Cleanup of empty values that can occur with leading/trailing or double ";"
			if (selections.length != selections2.length)
			  this.setDataAtCell(row, col, selections2.join('; '), 'thisChange');
			const self = this;
			let content = '';
			if (fields[col].flatVocabulary)
			  fields[col].flatVocabulary.forEach(function(field, i) {
				const field_trim = field.trim();
				let selected = selections.includes(field_trim) ? 'selected="selected"' : '';
				let indentation = field.search(/\S/) * 8; // pixels
				content += `<option value="${field_trim}" ${selected}' style="padding-left:${indentation}px">${field}</option>`;
			  })

			$('#field-description-text').html(`${fields[col].title}<select multiple class="multiselect" rows="15">${content}</select>`);
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
	},

	fillColumn: function (colname, value) {

		const fieldYCoordinates = this.getFieldYCoordinates();
		// ENSURE colname hasn't been tampered with (the autocomplete allows
		// other text)
		if (colname in fieldYCoordinates) {
			let changes = [];
			for (let row=0; row < this.hot.countRows(); row++) {
				if (!this.hot.isEmptyRow(row)) {
					let col = fieldYCoordinates[colname];
					if (this.hot.getDataAtCell(row, col) !== value)      
						changes.push([row, col, value]);
				}
			}
			if (changes.length > 0) {
				this.hot.setDataAtCell(changes);
				this.hot.render();
			}
		}
	},

	/**
	 * Loads a given javascript file.
	 * 
	 * @param {String} file_name: File in templates/[current schema]/ to load.
	 */
	reloadJs: async function(file_name) {

		const self = this;
		const src_url = `./template/${this.schema_name}/${file_name}`;

		let settings = {
		  'cache': false,
		  'dataType': "script",
		  //"async": false,
		  "crossDomain": true, // Critical
		  "url": src_url,
		  "method": "GET",
		  //"headers": {
		  //    "accept": "text/javascript",
		  //    "Access-Control-Allow-Origin":"*"
		  //}
		}
		try {
			const response = await $.ajax(settings);
			// script fetches don't return data. 

			// SCHEMA will be in place if script successful.
			if (file_name == 'schema.js') {
				// FUTURE: make this a json data object directly?
				self.schema = SCHEMA;
			}
			if (file_name == 'export.js')
				self.export_formats = EXPORT_FORMATS;

			return file_name;

		}
		catch (err) {
			//console.log("fetch failed", err)
			$('#missing-template-msg').text(`Unable to load file "${src_url}". Is the file location correct?`);
			$('#missing-template-modal').modal('show');
			return false;
		}
	},

	/**
	 * Post-processing of values in `data.js` at runtime. This calculates for each
	 * categorical field (table column) in data.js a flat list of allowed values
	 * in field.flatVocabulary,
	 * @param {Object} template_name.
	 * @return {Object} Processed values of `data.js`.
	 */
	processTemplate: function (template_name) {
		this.template = []; // This will hold template's new data including table sections.
		let self = this;

		const sectionIndex = new Map();

		// Gets LinkML SchemaView() of given template
		const specification = self.schema['specifications'][template_name];

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

			let field = specification.slots[name];
			let section_title = null;

			if ('slot_group' in field) {
			  // We have a field positioned within a section (or hierarchy)
			  section_title = field.slot_group;
			}
			else {
				if ('is_a' in field) {
					section_title = field.is_a;
				}
				else {
					section_title = 'Generic';
					console.log("Template field doesn't have section: ", name );
				}
			}

			// We have a field positioned within a section (or hierarchy)

			if (! sectionIndex.has(section_title)) {
				sectionIndex.set(section_title, sectionIndex.size);
				let section_parts = {
				  'title': section_title, 
				  'children':[]
				}
				const section = self.schema['slots'][section_title];
				if (section)
					Object.assign(section_parts, section);

				self.template.push(section_parts);
			}

			let section = self.template[sectionIndex.get(section_title)];
			let new_field = {...field}; // shallow copy

			// Some specs don't add plain english title, so fill that with name
			// for display.
			if (!('title' in new_field)) {
				new_field['title'] = new_field['name'];
			}

			// The presence of a min/max value implies that this field is numeric
			// and should be validated as such. But a lot of slots don't define
			// a `range` along with `minimum_value` or `maximum_value`. This is a 
			// hack to get the validation to work even though this should really
			// be handled by defining an appropriate `range` in the schema.
			if ('minimum_value' in new_field || 'maximum_value' in new_field) {
				new_field.range = 'float'
			}

			new_field.datatype = null;
			switch (new_field.range) {
				// LinkML typically translates "string" to "uri":"xsd:string" but
				// this is problematic because that allows newlines which break
				// spreadsheet saving of items.
				//case "string": 
				// new_field.datatype = "xsd:string";

				case 'string': 
				  // xsd:token means that string cannot have newlines, multiple-tabs
				  // or spaces.
				  new_field.datatype = 'xsd:token'; // was "xs:token",
				  break;

				//case "datetime"
				//case "time"
				//case "ncname"
				//case "objectidentifier"
				//case "nodeidentifier"

				case 'decimal':
				  new_field.datatype = 'xsd:decimal'; // was xs:decimal
				  break;

				case 'float':
				  new_field.datatype = 'xsd:float';
				  break;

				case 'double':
				  new_field.datatype = 'xsd:double'; 
				  break;

				case 'integer': // int ???
				  new_field.datatype = 'xsd:integer'; // was xs:nonNegativeInteger
				  break;

				// XML Boolean lexical space accepts true, false, and also 1 
				// (for true) and 0 (for false).
				case 'boolean': 
				  new_field.datatype = 'xsd:boolean';
				  break;

				case 'uri': 
				case 'uriorcurie': 
				  new_field.datatype = 'xsd:anyURI';
				  break;


				// https://linkml.io/linkml-model/docs/string_serialization/
				case 'string_serialization': 
					// Value A string which provides "{has numeric value} {has unit}" style 
					// named expressions.  These can be compiled into the .pattern field
					// if nothing already exists in .pattern

				case 'has unit': 
				  break;

				case 'has numeric value':
				  break;

				// This shows up as a LinkML class - but not formally defined as LinkML spec? 
				case 'quantity value': // A LinkML class

					/* LinkML model for quantity value, along lines of https://schema.org/QuantitativeValue

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
					new_field.datatype = "xsd:token"; //xsd:decimal + unit
					// PROBLEM: There are a variety of quantity values specified, some allowing units
					// which would need to go in a second column unless validated as text within column.
					break;

				case 'time':
					new_field.datatype = 'xsd:time';
					break;

				case 'datetime':
					new_field.datatype = 'xsd:datetime';
					break;

				case 'date':
					new_field.datatype = 'xsd:date'; // was xs:date
					break;

				default:
					// Usually a selection list here, possibly .multivalued = true
					new_field.datatype = 'xsd:token'; // was "xs:token"
					if (new_field.range in self.schema.enumerations) {
						new_field.source = self.schema.enumerations[new_field.range].permissible_values;
						//This calculates for each categorical field in schema.yaml a 
						// flat list of allowed values (indented to represent hierarchy)
						new_field.flatVocabulary = self.stringifyNestedVocabulary(new_field.source);

						// points to an object with .permissible_values ORDERED DICT array.
						// FUTURE ???? :
						// it may also have a metadata_values ORDERED DICT array.
						// ISSUE: metadata_status [missing | not applicable etc. ]
						// Allow > 1 range?
						// OR allow {permitted_values: .... , metadata_values: .... }
					}

					// LINKML CHANGING TO ALLOW RANGE OVER MULTIPLE ENUMERATIONS
					// .metadata_status is an ordered dict of permissible_values
					// It is separate so it can be demultipliexed from content values.
					// if (new_field.metadata_status) {}

			}// End switch

			if ('pattern' in field && field.pattern.length) {
				// Trap invalid regex
				// Issue with NMDC MIxS "current land use" field pattern: "[ ....(all sorts of things) ]" syntax.
				try {
					//NMDC_regex = field.pattern.replaceAll("(", "\(").replaceAll(")", "\)").replace("[", "(").replace("]", ")")
					new_field.pattern = new RegExp(field.pattern);
				}
				catch (err) {
					console.log(`TEMPLATE ERROR: Check the regular expression syntax for "${new_field.title}".`);
					console.log(err);
					// Allow anything until regex fixed.
					new_field.pattern = new RegExp(/.*/);
				}
			}

			// Copying in particular required/ recommended status of a field into
			// this class / form's context
			//if (name in specification_slot_usage) {
			//  Object.assign(new_field, specification_slot_usage[name])
			//}

			section['children'].push(new_field);

		}; // End for loop

		// Sections and their children are sorted by .rank parameter if available
		this.template.sort((a, b) => a.rank - b.rank );
		
		// Sort kids in each section
		for (let ptr in this.template) {
			this.template[ptr]['children'].sort((a, b) => a.rank - b.rank);
		}
	},


	/**
	 * Recursively flatten vocabulary into an array of strings, with each string's
	 * level of depth in the vocabulary being indicated by leading spaces.
	 * e.g., `vocabulary: 'a': {'b':{}},, 'c': {}` becomes `['a', '  b', 'c']`.
	 * @param {Object} vocabulary See `vocabulary` fields in SCHEMA.
	 * @param {number} level Nested level of `vocabulary` we are currently
	 *     processing.
	 * @return {Array<String>} Flattened vocabulary.
	 */
	stringifyNestedVocabulary: function (vocab_list, level=0) {

	  let ret = [];
	  for (const val of Object.keys(vocab_list)) {
		ret.push('  '.repeat(level) + val);
		if (vocab_list[val].permissible_values) {
		  ret = ret.concat(this.stringifyNestedVocabulary(vocab_list[val].permissible_values, level+1));
		}
	  }
	  return ret;
	},


	/**
	 * Get an HTML string that describes a field, its examples etc. for display
	 * in column header.
	 * @param {Object} field Any object under `children` in TABLE.
	 * @return {String} HTML string describing field.
	 */
	getComment: function (field) {
	  let ret = `<p><strong>Label</strong>: ${field.title}</p>
	<p><strong>Description</strong>: ${field.description}</p>`;

	  let guidance = [];
	  if (field.comments && field.comments.length) {
		guidance = guidance.concat(field.comments);
	  }
	  if (field.pattern) {
		guidance.push('Pattern as regular expression: ' + field.pattern);
	  }
	  if (field.string_serialization) {
		guidance.push('Pattern hint: ' + field.string_serialization);
	  }
	  const hasMinValue = field.minimum_value != null;
	  const hasMaxValue = field.maximum_value != null;
	  if (hasMinValue || hasMaxValue) {
		  let paragraph = 'Value should be '
		  if (hasMinValue && hasMaxValue) {
			  paragraph += `between ${field.minimum_value} and ${field.maximum_value}.`
		  } else if (hasMinValue) {
			  paragraph += `greater than ${field.minimum_value}.`
		  } else if (hasMaxValue) {
			  paragraph += `less than ${field.maximum_value}.`
		  }
		  guidance.push(paragraph);
	  }
	  if (guidance.length) {
		guidance[0] = '<strong>Guidance</strong>: ' + guidance[0]
		const renderedParagraphs = guidance
		  .map(function (paragraph) {
		    return '<p>' + paragraph + '</p>';
		  })
		  .join('\n');
		ret += renderedParagraphs;
	  }

	  if (field.examples) {
		// Ignoring all but linkml .value now (which can be empty):
		let examples = [];
		for (const [key, item] of Object.entries(field.examples)) {
		  if (item.value.trim().length > 0) {
			// Sometimes MIxS examples are separated by ";", but other times its part
			// of a "yes; .... further information ... " format.
			//examples.push(...item.value.split(';')); // 
			examples.push(item.value);
		  } 
		}
		if (examples.length)
		  ret += `<p><strong>Examples</strong>: </p><ul><li>${examples.join('</li>\n<li>')}</li></ul>`;
	  }
	  if (field.metadata_status) {
		ret += `<p><strong>Null values</strong>: ${field.metadata_status}</p>`;
	  }
	  return ret;
	},

	/**
	 * Get grid data without trailing blank rows.
	 * @param {Object} hot Handonstable grid instance.
	 * @return {Array<Array<String>>} Grid data without trailing blank rows.
	 */
	getTrimmedData: function() {
	  const gridData = this.hot.getData();
	  let lastEmptyRow = -1;
	  for (let i=gridData.length; i>=0; i--) {
		if (this.hot.isEmptyRow(i)) {
		  lastEmptyRow = i;
		} else {
		  break;
		}
	  }

	  return lastEmptyRow === -1 ? gridData : gridData.slice(0, lastEmptyRow);
	}

}