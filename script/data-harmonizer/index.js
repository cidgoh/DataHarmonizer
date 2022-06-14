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

const VERSION = '0.6.2';
const VERSION_TEXT = 'DataHarmonizer provenance: v' + VERSION;

let DataHarmonizer = {

	//An instance of DataHarmonizer has a schema, a domElement, and a handsontable .hot object
	dhGrid: null,
	dhFooter: null,
	schema_name: null,
	template_name: null,
	template_path: null,
	schema: null,           // Schema holding all templates
	template: null,         // Specific template from schema
	table: null,            // Table data.
	hot: null,
	hot_settings: null,
	menu: null,
	export_formats: {},		// Formats that a given template can export to.
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
	 * load of schema.js and export.js scripts (if necessary).
	 * 
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

		try {
			// Loading this template may require loading the SCHEMA it is under.
			const schema_loaded = await this.useSchema(template_folder);
			//if (!schema_loaded) 
			//  return false;

			this.processTemplate(template_name);
			this.createHot();

			// Asynchronous. Since SCHEMA loaded, export.js should succeed as well.
			await this.reloadJs('export.js');

			return template_name;
		}
		catch(err) {
		  console.log(err);
		}

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
	 * Presents reference guide in a popup.
	 * @param {String} mystyle simple css stylesheet commands to override default.
	 */
	renderReference: function(mystyle = null) {

		let schema_template = this.schema.classes[this.template_name]

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

		if (mystyle != null)
			style = mystyle;

		let row_html = '';
		for (section of this.template) {

			row_html +=
				`<tr class="section">
					<td colspan="5"><h3>${section.title || section.name}</h3></td>
				</tr>
				`
			for (slot of section.children) {

				const slot_dict = this.getCommentDict(slot);

				row_html +=
				`<tr>
					<td class="label">${slot_dict.title}</td>
					<td>${slot_dict.description}</td>
					<td>${slot_dict.guidance}</td>
					<td>${slot_dict.examples}</td>
					<td>${slot_dict.sources || ''}</td>
				</tr>
				`
			}
		}

		var win = window.open("", "Reference", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600");

		win.document.head.innerHTML = `
	<meta charset="utf-8">
	<title>Reference guide for "${schema_template.title || schema_template.name}" template</title>
	<meta name="description" content="${schema_template.description || ''}">
	<style>${style}</style>
	`

		win.document.body.innerHTML = `  
	<div>
		<h2>Reference guide for "${schema_template.title || schema_template.name}" template</h2>
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
	`
		return false;
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
			// ISSUE: provide trimDropdown if field is using flatVocabulary just for accepting null values
			if (!field.sources.includes('null value menu') || field.sources.length > 1)
				col.trimDropdown = false;
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
		//try {
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

		//}
		//catch (err) {
			//console.log("fetch failed", err)
			$('#missing-template-msg').text(`Unable to load file "${src_url}". Is the file location correct?`);
			$('#missing-template-modal').modal('show');
			return false;
		//}
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
			let field = Object.assign(self.schema.slots[name], specification.slots[name]);

			//let field = specification.slots[name];
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
					if (item.range in self.schema.enums || item.range in self.schema.types) {
						range_array.push(item.range)
					}
				}
			}
			else {
				range_array.push(new_field.range)
			}

			// Parse slot's range(s)
			for (let range of range_array) {
				if (range === undefined)			
					console.log ("field has no range", new_field.title);

				// Range is a datatype?
				if (range in self.schema.types) {

					range_obj = self.schema.types[range];

					/* LinkML typically translates "string" to "uri":"xsd:string" 
					// but this is problematic because that allows newlines which
					// break spreadsheet saving of items in tsv/csv format. Use
					// xsd:token to block newlines and tabs, and clean out leading 
					// and trailing space. xsd:normalizedString allows lead and trai
					// FUTURE: figure out how to accomodate newlines?
					*/
					switch (range) {
						case "string":
							new_field.datatype = 'xsd:token';
							break;
						case "Provenance":
							new_field.datatype = 'Provenance';
							break;
						default:
							new_field.datatype = range_obj.uri;
						// e.g. 'time' and 'datetime' -> xsd:dateTime'; 'date' -> xsd:date				
					}

				}
				else {
					// If range is an enumeration ...
					if (range in self.schema.enums) {
						range_obj = self.schema.enums[range];

						if (!('sources' in new_field)) 
							new_field.sources = [];
						if (!('flatVocabulary' in new_field)) 
							new_field.flatVocabulary = [];
						if (!('flatVocabularyLCase' in new_field)) 
							new_field.flatVocabularyLCase = [];

						new_field.sources.push(range);
						// This calculates for each categorical field in schema.yaml a 
						// flat list of allowed values (indented to represent hierarchy)
						let flatVocab = self.stringifyNestedVocabulary(range_obj.permissible_values);
						new_field.flatVocabulary.push(... flatVocab );
						// Lowercase version used for easy lookup/validation
						new_field.flatVocabularyLCase.push(... flatVocab.map(val => val.trim().toLowerCase()) );

					}
					else {
						// If range is a class ...
						// multiple => 1-many complex object
						if (range in self.schema.classes) {
							range_obj = self.schema.enums[range];

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
			if (!new_field.datatype)
				new_field.datatype = 'xsd:token';

			// field.todos is used to store some date tests that haven't been 
			// implemented as rules yet.
			if (new_field.datatype == 'xsd:date' && new_field.todos) {
				// Have to feed any min/max date comparison back into min max value fields
				for (test of new_field.todos) {
					if (test.substr(0,2) == '>=')
						new_field.minimum_value = test.substr(2)
					if (test.substr(0,2) == '<=')
						new_field.maximum_value = test.substr(2)		
				}
			}



			/* Older DH enables mappings of one template field to one or more 
			export format fields
			*/
			this.setExportField(new_field, true)

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
				}
				catch (err) {
					console.log(`TEMPLATE ERROR: Check the regular expression syntax for "${new_field.title}".`);
					console.log(err);
					// Allow anything until regex fixed.
					new_field.pattern = new RegExp(/.*/);
				}

			}

			section.children.push(new_field);

		}; // End slot processing loop

		// Sections and their children are sorted by .rank parameter if available
		this.template.sort((a, b) => a.rank - b.rank );
		
		// Sort kids in each section
		for (let ptr in this.template) {
			this.template[ptr]['children'].sort((a, b) => a.rank - b.rank);
		}
	},


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
	stringifyNestedVocabulary: function (vocab_list) {

	  let ret = [];
	  let stack = [];
	  for (const pointer in vocab_list) {
	  	let choice = vocab_list[pointer];
	  	let level = 0;
	  	if ('is_a' in choice) {
	  		level = stack.indexOf(choice.is_a)+1;
	  		stack.splice(level+1, 1000, choice.text)
	  	}
	  	else {
	  		stack = [choice.text];
	  	}

	  	this.setExportField(choice, false);

		ret.push('  '.repeat(level) + choice.text);

	  }
	  return ret;
	},

	setExportField: function (field, as_field) {
		if (field.exact_mappings) {
			field.exportField = {};
			for (let item of field.exact_mappings) {
				let ptr = item.indexOf(':')
				if (ptr != -1) {
					prefix = item.substr(0, ptr);
					if (!(prefix in field.exportField)) {
						field.exportField[prefix] = [];
					}

					mappings = item.substr(ptr+1);
					for (let mapping of mappings.split(';')) {
						mapping = mapping.trim()
						conversion = {}
						//A colon alone means to map value to empty string
						if (mapping == ':') {
							conversion.value = '';
						}
						//colon with contents = field & value
						else {
							if (mapping.indexOf(':') != -1) {
								binding = mapping.split(':')
								binding[0] = binding[0].trim();
								binding[1] = binding[1].trim();
								if (binding[0] > '')
									conversion.field = binding[0];
								if (binding[1] > '')
									conversion.value = binding[1];
							}
							//No colon means its just field or value
							else
								if (as_field == true)
									conversion.field = mapping
								else
									conversion.value = mapping
						}
						field.exportField[prefix].push(conversion)
					}
				}
			}
		}
	},

	/**
	 * Get an HTML string that describes a field, its examples etc. for display
	 * in column header.
	 * @param {Object} field Any object under `children` in TABLE.
	 * @return {String} HTML string describing field.
	 */
	getComment: function (field) {
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
	},

	getCommentDict: function (field) {
		let self = this;

		let guide = {
			title: field.title,
			name: field.name,
			description: field.description || '',
			guidance: '',
			examples: '',
			sources: ''
		}

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
			let paragraph = 'Value should be '
			if (hasMinValue && hasMaxValue) {
				paragraph += `between ${field.minimum_value} and ${field.maximum_value} (inclusive).`
			} else if (hasMinValue) {
				paragraph += `greater than or equal to ${field.minimum_value}.`
			} else if (hasMaxValue) {
				paragraph += `less than or equal to ${field.maximum_value}.`
			}
			guidance.push(paragraph);
		}
		if (field.identifier) {
			guidance.push('Each record must have a unique value for this field.');
		}
		if (field.sources && field.sources.length) {
			let sources = [];
			for (const [key, item] of Object.entries(field.sources)) {
				// List null value menu items directly
				if (item === 'null value menu') {
					let null_values = Object.keys(self.schema.enums[item].permissible_values);
					sources.push(item + ': (' + null_values.join('; ') + ')' );
				}
				else
					sources.push(item);
			}
			guide.sources = '<ul><li>' + sources.join('</li>\n<li>') + '</li></ul>'
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
			let examples = []
			first_item = true;
			for (const [key, item] of Object.entries(field.examples)) {
				if (item.description && item.description.length > 0)
					if (first_item === true) {
						examples.push(item.description + ':\n<ul>');
						first_item = false;
					}
					else
						examples += '</ul>' + item.description + ':\n<ul>';	

				if (first_item === true) {
					first_item = false;
					examples += '<ul><li>' + item.value + '</li>\n';
				}
				else
					examples += '<li>' + item.value + '</li>\n';
			}
			guide.examples = examples + '</ul>'
		}

	  return guide;
	},

	/**
	 * Get grid data without trailing blank rows.
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