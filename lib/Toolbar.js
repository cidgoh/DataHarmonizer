import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';

import { exportFile, exportJsonFile } from './utils/files';

import template from './toolbar.html';
import { getGettingStartedMarkup } from './toolbarGettingStarted';

import './toolbar.css';

import pkg from '../package.json';
const VERSION = pkg.version;

class Toolbar {
  dh = null;
  root = null;
  menu = {};

  /**
   * Wire up user controls which only need to happen once on load of page.
   */
  constructor(root, dh, menu, options = {}) {
    const self = this; //For anonymous button functions etc.
    this.dh = dh;
    this.root = root;
    this.menu = menu;
    this.staticAssetPath = options.staticAssetPath || '';
    this.getSchema = options.getSchema || this._defaultGetSchema;
    this.getExportFormats =
      options.getExportFormats || this._defaultGetExportFormats;

    $(this.root).append(template);

    this.$selectTemplate = $('#select-template');

    $('#version-dropdown-item').text('version ' + VERSION);
    $('#getting-started-carousel-container').html(getGettingStartedMarkup());

    // Select menu for available templates. If the `templatePath` option was
    // provided attempt to use that one. If not the first item in the menu
    // will be used.
    this.updateTemplateOptions();
    if (options.templatePath) {
      const [folder, template] = options.templatePath.split('/');
      if (folder in this.menu && template in this.menu[folder]) {
        // Prime menu system.
        this.$selectTemplate.val(options.templatePath);
      }
      this.loadSelectedTemplate(options.templatePath);

    }
    else
      // Loads 1st (default) template
      this.loadSelectedTemplate();

    // Enable template to be loaded dynamically
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    // Triggers show/hide of draft templates
    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());

    // File -> New
    $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
      const isNotEmpty = dh.hot.countRows() - dh.hot.countEmptyRows();
      if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
        $('#clear-data-warning-modal').modal('show');
      } else {
        // Clear current file indication
        $('#file_name_display').text('');
        this.hideValidationResultButtons();
        dh.newHotFile();
      }
    });

    // File -> Open
    const $fileInput = $('#open-file-input');

    $fileInput.on('change', function () {
      const file = $fileInput[0].files[0];
      const ext = file.name.split('.').pop();
      const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv', 'json'];
      if (!acceptedExts.includes(ext)) {
        const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
        $('#open-err-msg').text(errMsg);
        $('#open-error-modal').modal('show');
      } else {
        dh.invalid_cells = {};
        dh.runBehindLoadingScreen(dh.openFile, [file]);
        $('#file_name_display').text(file.name);
      }
      // Allow consecutive uploads of the same file
      $fileInput[0].value = '';

      self.hideValidationResultButtons();
      dh.current_selection = [null, null, null, null];
    });

    // File -> Save
    $('#save-as-dropdown-item').click(() => {
      if (!$.isEmptyObject(dh.invalid_cells)) {
        $('#save-as-invalid-warning-modal').modal('show');
      } else {
        $('#save-as-modal').modal('show');
      }
    });

    $('#save-as-confirm-btn').click(() => {
      try {
        const baseName = $('#base-name-save-as-input').val();
        const ext = $('#file-ext-save-as-select').val();
        if (ext == 'json') {
          let data = dh.getDataObjects(false);
          dh.runBehindLoadingScreen(exportJsonFile, [data, baseName, ext]);
        } else {
          let matrix = [...dh.getFlatHeaders(), ...dh.getTrimmedData()];
          dh.runBehindLoadingScreen(exportFile, [matrix, baseName, ext]);
        }
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
        dh.runBehindLoadingScreen(exportFile, [
          outputMatrix,
          baseName,
          format.fileType,
        ]);
      }
      $('#export-to-modal').modal('hide');
    });
    $('#export-to-format-select').on('change', () => {
      const exportFormat = $('#export-to-format-select').val();
      $('#export_file_suffix').text(
        '.' + dh.export_formats[exportFormat].fileType
      );
    });

    // Reset export modal values when the modal is closed
    $('#export-to-modal').on('hidden.bs.modal', () => {
      $('#export-to-err-msg').text('');
      $('#base-name-export-to-input').val('');
    });

    // File -> Export
    $('#export-to-dropdown-item').click(() => {
      if (!$.isEmptyObject(dh.invalid_cells)) {
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
    $('#show-all-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      self.dh.showAllColumns();
    });
    $('#show-required-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      self.dh.showRequiredColumns();
    });
    $('#show-recommended-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      self.dh.showRecommendedColumns();
    });
    $(this.root).on('click', '.show-section-dropdown-item', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      const $this = $(this);
      $this.addClass('disabled');
      self.dh.showColumnsBySectionTitle($this.text());
    });

    // Locate next error based on current cursor cell row and column.
    $('#next-error-button').on('click', () => {
      // We can't use HOT.getSelectedLast() because "Next Error" button click
      // removes that.
      let focus_row = dh.current_selection[0];
      let focus_col = dh.current_selection[1];

      const all_rows = Object.keys(dh.invalid_cells);
      const error1_row = all_rows[0]; //0=index of key, not key!
      if (focus_row === null) {
        focus_row = error1_row;
        focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
      } else {
        // Get all error rows >= focus row
        const rows = all_rows.filter((row) => row >= focus_row);

        // One or more errors on focus row (lax string/numeric comparision):
        if (focus_row == rows[0]) {
          let cols = Object.keys(dh.invalid_cells[focus_row]);
          cols = cols.filter((col) => col > focus_col);
          if (cols.length) {
            focus_col = parseInt(cols[0]);
          } else {
            // No next column, so advance to next row or first row
            focus_row = rows.length > 1 ? rows[1] : error1_row;
            focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
          }
        } else {
          // Advance to next row or first row
          focus_row = rows.length ? rows[0] : error1_row;
          focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
        }
      }

      this.dh.current_selection = [focus_row, focus_col, focus_row, focus_col];
      this.dh.scrollTo(focus_row, focus_col);
    });

    // Validate
    $('#validate-btn').on('click', () => {
      self.validate();
    });

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

    $('#help_reference').on('click', () => this.dh.renderReference());
  }

  async validate() {
    await this.dh.runBehindLoadingScreen(this.dh.validate);

    // If any rows have error, show this.
    if (Object.keys(this.dh.invalid_cells).length > 0) {
      $('#next-error-button').show();
      $('#no-error-button').hide();
    } else {
      $('#next-error-button').hide();
      $('#no-error-button').show().delay(5000).fadeOut('slow');
    }
  }

  /**
   * Show available templates, with sensitivity to "view draft template" checkbox
   */
  updateTemplateOptions() {
    // Select menu for available templates
    this.$selectTemplate.empty();

    const view_drafts = $('#view-template-drafts').is(':checked');
    for (const [folder, templates] of Object.entries(this.menu)) {
      for (const [name, template] of Object.entries(templates)) {
        let path = folder + '/' + name;
        if (template.display) {
          if (view_drafts || template.status == 'published') {
            this.$selectTemplate.append(new Option(path, path));
          }
        }
      }
    }
  }

  async loadSelectedTemplate(uri_path) {
    let template_path = uri_path || this.$selectTemplate.val();
    const [schema_name, template_name] = template_path.split('/');
    let schema = null;
    // Update DataHarmonizer
    try {
      schema = await this.getSchema(schema_name, template_name);
    }
    catch (e) {
      if (e.code == 'MODULE_NOT_FOUND') {
        const errMsg = 'Requested schema "' + schema_name + '" was not found!';
        $('#open-err-msg').text(errMsg);
        $('#open-error-modal').modal('show');

        return (this._getLocalSchema(schema_name));

      }
    } 

    const exportFormats = await this.getExportFormats(
      schema_name,
      template_name
    );
    this.dh.useSchema(schema, exportFormats, template_name);

    // Update own interface
    $('#template_name_display').text(template_name);
    $('#file_name_display').text('');

    // Enable template folder's export.js export options to be loaded dynamically.
    const select = $('#export-to-format-select')[0];
    while (select.options.length > 1) {
      select.remove(1);
    }
    for (const option in this.dh.export_formats) {
      if (
        !('pertains_to' in this.dh.export_formats[option]) ||
        this.dh.export_formats[option].pertains_to.includes(
          this.dh.template_name
        )
      ) {
        select.append(new Option(option, option));
      }
    }

    const schema_class = this.dh.schema.classes[this.dh.template_name];
    // Update SOP
    if (schema_class.see_also) {
      $('#help_sop').attr('href', schema_class.see_also).show();
    } else {
      $('#help_sop').hide();
    }

    // Allows columnCoordinates to be accessed within select() below.
    const columnCoordinates = this.dh.getColumnCoordinates();

    $('#section-menu').empty();
    let section_ptr = 0;
    for (const section of this.dh.template) {
      $('#section-menu').append(
        `<div id="show-section-${section_ptr}" class="dropdown-item show-section-dropdown-item">${section.title}</div>`
      );
      section_ptr++;
    }

    // Settings -> Jump to...
    const options = Object.keys(columnCoordinates).map((col) => ({
      text: col,
      value: col,
    }));
    const $jumpToInput = $('#jump-to-input');
    if ($jumpToInput[0].selectize) {
      $jumpToInput[0].selectize.destroy();
    }
    $jumpToInput.selectize({
      options: options,
      openOnFocus: true,
    });
    $jumpToInput.on('change', (e) => {
      const columnX = columnCoordinates[e.target.value];
      this.dh.scrollTo(0, columnX);
      $('#jump-to-modal').modal('hide');
      $jumpToInput[0].selectize.clear();
    });
    $('#jump-to-modal').on('shown.bs.modal', () => {
      $jumpToInput[0].selectize.open();
    });

    // Settings -> Fill column ...
    const $fillColumnInput = $('#fill-column-input');
    if ($fillColumnInput[0].selectize) {
      $fillColumnInput[0].selectize.destroy();
    }
    $fillColumnInput.selectize({
      options: this.dh.getFields(),
      valueField: 'title',
      labelField: 'title',
      searchField: ['title'],
      openOnFocus: true,
    });
    const $fillValueInput = $('#fill-value-input');
    $('#fill-modal').on('shown.bs.modal', () => {
      $fillColumnInput[0].selectize.open();
    });
    $('#fill-button').on('click', () => {
      this.dh.fillColumn($fillColumnInput.val(), $fillValueInput.val());
      $fillColumnInput[0].selectize.clear();
      $fillValueInput.val('');
    });

    this.hideValidationResultButtons();
  }

  hideValidationResultButtons() {
    $('#next-error-button,#no-error-button').hide();
  }

  async _defaultGetSchema(schemaName) {
    return this.menu[schemaName].schema;
  }

  async _defaultGetExportFormats(schemaName) {
    return this.menu[schemaName].exportFormats;
  }

    /**
   * Loads a given javascript file.
   * 
   * @param {String} file_name: File in templates/[current schema]/ to load.
   */
  async _getLocalSchema(schema_name) {

    const src_url = `templates/${schema_name}/schema.json`;

    let settings = {
      'cache': false,
      'dataType': "json",
      //"async": false,
      "crossDomain": true, // Critical
      "url": src_url,
      "method": "GET",
      "headers": {
          "accept": "application/json",
      //    "Access-Control-Allow-Origin":"*"
      }
    }
    try {
      const response = await $.ajax(settings);
      console.log(response)
      return response;
    }
    catch (err) {
      //console.log("fetch failed", err)
      $('#missing-template-msg').text(`Unable to load file "${src_url}". Is the file location correct?`);
      $('#missing-template-modal').modal('show');
      return false;
    }
  }

}

export default Toolbar;
