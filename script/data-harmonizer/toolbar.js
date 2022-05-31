DataHarmonizerToolbar = {
	dh: null,
	dhToolbar: null,

	/**
	 * Wire up user controls which only need to happen once on load of page.
	 */
	init: function (dh, dhToolbar) {
		const self = this; //For anonymous button functions etc.
		this.dh = dh;

		$('#version-dropdown-item').text('version ' + VERSION);

		// Select menu for available templates
		this.templateOptions(dh);

		// Enable template to be loaded dynamically
		$('#select-template-load').on('click', async function () {
			await self.dh.useTemplate($('#select-template').val());
			await self.refresh();
		})
		// Triggers show/hide of draft templates
		$("#view-template-drafts").on('change', this.templateOptions(dh));

		// File -> New
		$('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
			const isNotEmpty = dh.hot.countRows() - dh.hot.countEmptyRows();
			if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
				$('#clear-data-warning-modal').modal('show');
			} 
			else {
				// Clear current file indication
				$('#file_name_display').text('');
				dh.newHotFile();
			}
		});

		// File -> Open
		const $fileInput = $('#open-file-input');

		$fileInput.on('change', function() {
			const file = $fileInput[0].files[0];
			const ext = file.name.split('.').pop();
			const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv'];
			if (!acceptedExts.includes(ext)) {
				const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
				$('#open-err-msg').text(errMsg);
				$('#open-error-modal').modal('show');
			} else {
				dh.invalid_cells = {};
				dh.runBehindLoadingScreen(dh.openFile, [dh, file]);
				$('#file_name_display').text(file.name); 
			}
			// Allow consecutive uploads of the same file
			$fileInput[0].value = '';

			$('#next-error-button,#no-error-button').hide();
			dh.current_selection = [null,null,null,null];

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
			if (!jQuery.isEmptyObject(dh.invalid_cells)) {
				$('#save-as-invalid-warning-modal').modal('show');
			} else {
				$('#save-as-modal').modal('show');
			}
		});


		$('#save-as-confirm-btn').click(() => {
			try {
				const baseName = $('#base-name-save-as-input').val();
				const ext = $('#file-ext-save-as-select').val();
				const matrix = [...dh.getFlatHeaders(), ...dh.getTrimmedData(this.dh.hot)];
				dh.runBehindLoadingScreen(dh.exportFile, [matrix, baseName, ext]);
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
			if (exportFormat in dh.export_formats) {
				const format = dh.export_formats[exportFormat];
				let outputMatrix = format.method(dh);
				dh.runBehindLoadingScreen(dh.exportFile, [outputMatrix, baseName, format.fileType]);
			}
			$('#export-to-modal').modal('hide');
		});
		$("#export-to-format-select").on('change', (e) => {
			const exportFormat = $('#export-to-format-select').val();
			$('#export_file_suffix').text('.' + dh.export_formats[exportFormat].fileType);
		});

		// Reset export modal values when the modal is closed
		$('#export-to-modal').on('hidden.bs.modal', () => {
			$('#export-to-err-msg').text('');
			$('#base-name-export-to-input').val('');
		});


		// File -> Export
		$('#export-to-dropdown-item').click(() => {
			if (!jQuery.isEmptyObject(dh.invalid_cells)) {
				$('#export-to-invalid-warning-modal').modal('show');
			} else {
				$('#export-to-modal').modal('show');
			}
		});

		// Settings -> Show ... columns
		const showColsSelectors = [
			'#show-all-cols-dropdown-item', 
			'#show-required-cols-dropdown-item',
			'#show-recommended-cols-dropdown-item',
			'.show-section-dropdown-item',
		];

		$(dhToolbar).on('click', showColsSelectors.join(','), function(e) {
			//self.dh.runBehindLoadingScreen(self.dh.changeColVisibility, [e.target.id]);
			self.dh.changeColVisibility(e.target.id);
		});

		// Settings -> Jump to...
		const $jumpToInput = $('#jump-to-input');
		$jumpToInput.bind('focus', () => void $jumpToInput.autocomplete('search'));

		$('#jump-to-modal').on('shown.bs.modal', () => {
			$jumpToInput.val('');
			$jumpToInput.focus();
		});

		// Settings -> Fill column ...
		const $fillValueInput = $('#fill-value-input');
		const $fillColumnInput = $('#fill-column-input');
		$fillColumnInput.bind('focus', () => void $fillColumnInput.autocomplete('search'));
		$('#fill-modal').on('shown.bs.modal', () => {
			$fillColumnInput.val('');
			$fillColumnInput.focus();
		});
		$('#fill-button').on('click', () => {
			dh.fillColumn($fillColumnInput.val(), $fillValueInput.val());
			//dh.runBehindLoadingScreen(dh.fillColumn, [$fillColumnInput.val(), $fillValueInput.val()]);
		});

		// Locate next error based on current cursor cell row and column.
		$('#next-error-button').on('click', () => {
			// We can't use HOT.getSelectedLast() because "Next Error" button click 
			// removes that.
			let focus_row = dh.current_selection[0];
			let focus_col = dh.current_selection[1];

			const all_rows = Object.keys(dh.invalid_cells);
			const error1_row = all_rows[0];//0=index of key, not key!
			if (focus_row === null) {
				focus_row = error1_row;
				focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
			}
			else {
				// Get all error rows >= focus row
				const rows = all_rows.filter(row => row >= focus_row);

				// One or more errors on focus row (lax string/numeric comparision):
				if (focus_row == rows[0]) {
					let cols = Object.keys(dh.invalid_cells[focus_row])
					cols = cols.filter(col => col > focus_col);
					if (cols.length) {
						focus_col = parseInt(cols[0]);
					}
					else {
						// No next column, so advance to next row or first row
						focus_row = (rows.length > 1) ? rows[1] : error1_row; 
						focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
					}
				}
				else {
					// Advance to next row or first row
					focus_row = rows.length ? rows[0] : error1_row;
					focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
				}
			};

			//window.CURRENT_SELECTION[0] = focus_row;
			//window.CURRENT_SELECTION[1] = focus_col;
			//window.CURRENT_SELECTION[2] = focus_row;
			//window.CURRENT_SELECTION[3] = focus_col;  
			this.dh.current_selection = [focus_row, focus_col, focus_row, focus_col];
			this.dh.scrollTo(focus_row, focus_col);

		});

		// Validate
		$('#validate-btn').on('click', () => {self.validate()} );

		// Settings -> Show ... rows
		const showRowsSelectors = [
			'#show-all-rows-dropdown-item',
			'#show-valid-rows-dropdown-item',
			'#show-invalid-rows-dropdown-item',
		];
		$(showRowsSelectors.join(',')).click((e) => {
			//dh.runBehindLoadingScreen(dh.changeRowVisibility, [e.target.id]);
			self.dh.changeRowVisibility(e.target.id);
		});

		$("#help_reference").on('click', () => this.dh.renderReference() );

	},

	validate: async function() {

		await this.dh.runBehindLoadingScreen(this.dh.validate);

		// If any rows have error, show this.
		if (Object.keys(this.dh.invalid_cells).length > 0) {
			$('#next-error-button').show();
			$('#no-error-button').hide();
		}
		else {
			$('#next-error-button').hide();
			$('#no-error-button').show().delay(5000).fadeOut('slow');
		}
	},

	refresh: function () {
		const self = this;
		$('#select-template').val(this.dh.template_path);
		// Display template without folder part
		let template_name = this.dh.template_path.substr(this.dh.template_path.indexOf('/')+1)
		$('#template_name_display').text(template_name);
		$('#file_name_display').text('');

		// Enable template folder's export.js export options to be loaded dynamically.
		const select = $("#export-to-format-select")[0];
		while (select.options.length > 1) {
			select.remove(1);
		}
		for (const option in this.dh.export_formats) {
			select.append(new Option(option, option));
		}

		// Update SOP.
		$("#help_sop").attr('href',`template/${this.dh.template_folder}/SOP.pdf`);

		// Allows columnCoordinates to be accessed within select() below.
		const columnCoordinates = this.dh.getColumnCoordinates();

		$('#section-menu').empty();
		section_ptr = 0;
		for (section of this.dh.template) {
			$('#section-menu').append(`<div id="show-section-${section_ptr}" class="dropdown-item show-section-dropdown-item">${section.title}</div>`);
			section_ptr ++;
		}

		// Settings -> Jump to...
		$('#jump-to-input').autocomplete({
			source: Object.keys(columnCoordinates),
			minLength: 0,
			select: (e, ui) => {
				const columnX = columnCoordinates[ui.item.label];
				self.dh.scrollTo(0, columnX);
				$('#jump-to-modal').modal('hide');
			},
		})

		$('#fill-column-input').autocomplete({
			source: self.dh.getFields().map(a => a.title),
			minLength: 0
		})

	},


	/**
	 * Show available templates, with sensitivity to "view draft template" checkbox
	 */
	templateOptions: function (dh) {
		const self = this;
		// Select menu for available templates
		const select = $("#select-template");
		select.empty();

		const view_drafts = $("#view-template-drafts").is(':checked');
		for ([folder, templates] of Object.entries(dh.menu)) {
			for ([name, template] of Object.entries(templates)) {
				let path = folder + '/' + name;
				if (template.display)
					if (view_drafts || template.status == 'published') {
						select.append(new Option(path, path));
					}
			}
		}
	},


}