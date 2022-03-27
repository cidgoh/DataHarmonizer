DataHarmonizerToolbar = {
  dh: null,

  /**
   * Wire up user controls which only need to happen once on load of page.
   */
  init: function (dh) {

    $('#version-dropdown-item').text(VERSION);

    // Select menu for available templates
    templateOptions(dh);

    // Enable template to be loaded dynamically
    $('#select-template-load').on('click', (e) => {
      dh.useTemplate($('#select-template').val());
    })
    // Triggers show/hide of draft templates
    $("#view-template-drafts").on('change', function() {templateOptions(dh)} );

    // File -> New
    $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
      const isNotEmpty = HOT.countRows() - HOT.countEmptyRows();
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
        runBehindLoadingScreen(openFile, [file]);
      }
      // Allow consecutive uploads of the same file
      $fileInput[0].value = '';

      $('#next-error-button,#no-error-button').hide();
      window.CURRENT_SELECTION = [null,null,null,null];

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
        const matrix = [...getFlatHeaders(TABLE), ...getTrimmedData(HOT)];
        runBehindLoadingScreen(exportFile, [matrix, baseName, ext]);
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
        format['method'](baseName, HOT, TABLE, XLSX, format.fileType);
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


    // File -> Export
    $('#export-to-dropdown-item').click(() => {
      if (!jQuery.isEmptyObject(INVALID_CELLS)) {
        $('#export-to-invalid-warning-modal').modal('show');
      } else {
        $('#export-to-modal').modal('show');
      }
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
      runBehindLoadingScreen(() => {
        let value = $fillValueInput.val();
        let colname = $fillColumnInput.val();
        const fieldYCoordinates = getFieldYCoordinates(TABLE);
        // ENSURE colname hasn't been tampered with (the autocomplete allows
        // other text)
        if (colname in fieldYCoordinates) {
          let changes = [];
          for (let row=0; row<HOT.countRows(); row++) {
            if (!HOT.isEmptyRow(row)) {
              let col = fieldYCoordinates[colname];
              if (HOT.getDataAtCell(row, col) !== value)      
                changes.push([row, col, value]);
            }
          }
          if (changes.length > 0) {
            HOT.setDataAtCell(changes);
            HOT.render();
          }
        }
      });
    });

    // Locate next error based on current cursor cell row and column.
    $('#next-error-button').on('click', () => {
      // We can't use HOT.getSelectedLast() because "Next Error" button click 
      // removes that.
      let focus_row = window.CURRENT_SELECTION[0];
      let focus_col = window.CURRENT_SELECTION[1];

      const all_rows = Object.keys(window.INVALID_CELLS);
      const error1_row = all_rows[0];//0=index of key, not key!
      if (focus_row === null) {
        focus_row = error1_row;
        focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
      }
      else {
        // Get all error rows >= focus row
        const rows = all_rows.filter(row => row >= focus_row);

        // One or more errors on focus row (lax string/numeric comparision):
        if (focus_row == rows[0]) {
          let cols = Object.keys(window.INVALID_CELLS[focus_row])
          cols = cols.filter(col => col > focus_col);
          if (cols.length) {
            focus_col = parseInt(cols[0]);
          }
          else {
            // No next column, so advance to next row or first row
            focus_row = (rows.length > 1) ? rows[1] : error1_row; 
            focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
          }
        }
        else {
          // Advance to next row or first row
          focus_row = rows.length ? rows[0] : error1_row;
          focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
        }
      };

      window.CURRENT_SELECTION[0] = focus_row;
      window.CURRENT_SELECTION[1] = focus_col;
      window.CURRENT_SELECTION[2] = focus_row;
      window.CURRENT_SELECTION[3] = focus_col;   
      scrollTo(focus_row, focus_col, TABLE, HOT);

    });

    // Validate
    $('#validate-btn').on('click', () => {
      dh.runBehindLoadingScreen(() => {
        dh.invalid_cells = dh.getInvalidCells();
        dh.hot.render();

        // If any rows have error, show this.
        if (Object.keys(dh.invalid_cells).length > 0) {
          $('#next-error-button').show();
          $('#no-error-button').hide();
        }
        else {
          $('#next-error-button').hide();
          $('#no-error-button').show().delay(5000).fadeOut('slow');
        }
      });
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


  },

  setupToolbar: function (TABLE, template_path) => {
    let [template_folder, template_name] = template_path.split('/',2);

    // If visible, show this as a selected item in template menu
    $('#select-template').val(template_path);
    $('#template_name_display').text(template_path);
    // Update reference doc links and SOP.
    $("#help_reference").attr('href',`template/${template_folder}/reference.html`);
    $("#help_sop").attr('href',`template/${template_folder}/SOP.pdf`);


    // Allows columnCoordinates to be accessed within select() below.
    const columnCoordinates = getColumnCoordinates(this.dh.template);

    $('#section-menu').empty();
    section_ptr = 0;
    for (section of this.dh.template) {
      $('#section-menu').append(`<div id="show-section-${section_ptr}" class="dropdown-item show-section-dropdown-item">${section.title}</div>`);
      section_ptr ++;
    }

    // Settings -> Show ... columns
    const showColsSelectors = [
      '#show-all-cols-dropdown-item', 
      '#show-required-cols-dropdown-item',
      '#show-recommended-cols-dropdown-item',
      '.show-section-dropdown-item',
    ];

    $(showColsSelectors.join(',')).on('click', function(e) {
      runBehindLoadingScreen(changeColVisibility, [e.target.id, TABLE, window.HOT]);
    });

    // Settings -> Jump to...
    $('#jump-to-input').autocomplete({
      source: Object.keys(columnCoordinates),
      minLength: 0,
      select: (e, ui) => {
        const columnX = columnCoordinates[ui.item.label];
        scrollTo(0, columnX, TABLE, window.HOT);
        $('#jump-to-modal').modal('hide');
      },
    })

    $('#fill-column-input').autocomplete({
      source: getFields(TABLE).map(a => a.title),
      minLength: 0
    })

  },


  /**
   * Show available templates, with sensitivity to "view draft template" checkbox
   */
  templateOptions: function () {
    // Select menu for available templates
    const select = $("#select-template");
    select.empty();

    const view_drafts = $("#view-template-drafts").is(':checked');
    for ([folder, templates] of Object.entries(this.dh.menu)) {
      for ([name, template] of Object.entries(templates)) {
        let label = folder + '/' + name;
        if (view_drafts || template.status == 'published') {
          select.append(new Option(label, label));
        }
      }
    }
  },

  /**
   * Enable template folder's export.js export options to be loaded dynamically.
   */
  exportOnload: function () {
    const select = $("#export-to-format-select")[0];
    while (select.options.length > 1) {
      select.remove(1);
    }
    for (const option in dh.export_formats) {
      select.append(new Option(option, option));
    }
  },

/**
 * Controls what dropdown options are visible depending on grid settings.
  USED ?????????






  
 */
  toggleDropdownVisibility: function ()  {
    $('.hidden-dropdown-item').hide();

    $('#settings-dropdown-btn-group').off()
        .on('show.bs.dropdown', () => {

          const hiddenRows = HOT.getPlugin('hiddenRows').hiddenRows;
          
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
  },


}