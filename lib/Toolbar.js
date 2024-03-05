import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';

import { exportFile, exportJsonFile, readFileAsync } from '@/lib/utils/files';
import i18next from 'i18next';

import template from '@/lib/toolbar.html';
import '@/lib//toolbar.css';

// NOTE: this is odd! package.json is a developer file. why should a UI component care about it?
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
    this.context = options.context;  // TODO: promote to mandatory argument
    this.dh = dh;
    this.root = root;
    this.menu = menu;
    this.staticAssetPath = options.staticAssetPath || '';
    this.getSchema = options.getSchema || this._defaultGetSchema;
    this.getExportFormats =
      options.getExportFormats || this._defaultGetExportFormats;
    this.getLanguages = options.getLanguages || this._defaultGetLanguages;

    $(this.root).append(template);

    if (options.releasesURL) $('#help_release')[0].href = options.releasesURL;

    this.$selectTemplate = $('#select-template');

    $('#version-dropdown-item').text('version ' + VERSION);

    // Defer loading the Getting Started content until it is used for the first
    // time. In ES bundles this dynamic import results in a separate output chunk,
    // which reduces the initial load size. There is no equivalent in UMD bundles,
    // in which case the content gets inlined.
    $('#getting-started-modal').on('show.bs.modal', async function () {
      const modalContainer = $('#getting-started-carousel-container');
      if (!modalContainer.html()) {
        const { getGettingStartedMarkup } = await import(
          './toolbarGettingStarted'
        );
        modalContainer.html(getGettingStartedMarkup());
      }
    });

    // Select menu for available templates. If the `templatePath` option was
    // provided attempt to use that one. If not the first item in the menu
    // will be used.
    this.updateTemplateOptions();
    if (options.templatePath) {
      const [folder, template] = options.templatePath.split('/');
      if (folder in this.menu && template in this.menu[folder]) {
        this.$selectTemplate.val(options.templatePath);
      }
    }
    this.loadSelectedTemplate();

    // Enable template to be loaded dynamically
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    // Triggers show/hide of draft templates
    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());

    // File -> Upload Template
    const $templateInput = $('#upload-template-input');

    $templateInput.on('change', () => {
      const dh = self.context.getCurrentDataHarmonizer();
      const file = $templateInput[0].files[0];
      const ext = file.name.split('.').pop();
      if (ext !== 'json') {
        const errMsg = `Please upload a template schema.json file`;
        $('#upload-template-err-msg').text(errMsg);
        $('#upload-template-error-modal').modal('show');
      } else {
        dh.invalid_cells = {};
        this.loadSelectedTemplate(file);
      }
      // Allow consecutive uploads of the same file
      $templateInput[0].value = '';

      self.hideValidationResultButtons();
      dh.current_selection = [null, null, null, null];
    });

    // File -> New
    $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
      const dh = self.context.getCurrentDataHarmonizer()
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
      const dh = self.context.getCurrentDataHarmonizer()
      const file = $fileInput[0].files[0];
      const ext = file.name.split('.').pop();
      const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv', 'json'];
      if (!acceptedExts.includes(ext)) {
        const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
        $('#open-err-msg').text(errMsg);
        $('#open-error-modal').modal('show');
      } else {
        dh.invalid_cells = {};
        dh.runBehindLoadingScreen(dh.openFile.bind(dh), [file]);
        $('#file_name_display').text(file.name);
      }
      // Allow consecutive uploads of the same file
      $fileInput[0].value = '';

      self.hideValidationResultButtons();
      dh.current_selection = [null, null, null, null];
    });

    // File -> Save
    $('#save-as-dropdown-item').click(() => {
      const dh = this.context.getCurrentDataHarmonizer();
      if (!$.isEmptyObject(dh.invalid_cells)) {
        $('#save-as-invalid-warning-modal').modal('show');
      } else {
        $('#save-as-modal').modal('show');
      }
    });

    $('#file-ext-save-as-select').on('change', (evt) => {
      const dh = self.context.getCurrentDataHarmonizer();
      const ext = evt.target.value;
      if (ext === 'json') {
        $('#save-as-json-options').removeClass('d-none');
        const inferredIndexSlot = dh.getInferredIndexSlot();
        $('#save-as-json-index-key').val(inferredIndexSlot);
      } else {
        $('#save-as-json-options').addClass('d-none');
      }
    });

    $('#save-as-json-use-index').on('change', (evt) => {
      const checked = evt.target.checked;
      $('#save-as-json-index-key').prop('disabled', !checked);
    });

    $('#save-as-confirm-btn').click(() => {
      const dh = self.context.getCurrentDataHarmonizer();
      try {
        const baseName = $('#base-name-save-as-input').val();
        const ext = $('#file-ext-save-as-select').val();
        if (ext == 'json') {
          let indexSlot = false;
          if ($('#save-as-json-use-index').is(':checked')) {
            const indexSlotInput = $('#save-as-json-index-key').val();
            if (indexSlotInput) {
              indexSlot = indexSlotInput;
            } else {
              indexSlot = true;
            }
          }
          let data = dh.getDataObjects({
            indexSlot,
          });
          self.context.runBehindLoadingScreen(exportJsonFile, [data, baseName, ext]);
        } else {
          let matrix = [...dh.getFlatHeaders(), ...dh.getTrimmedData()];
          self.context.runBehindLoadingScreen(exportFile, [matrix, baseName, ext]);
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
      if (exportFormat in self.context.getCurrentDataHarmonizer().export_formats) {
        const format = self.context.getCurrentDataHarmonizer().export_formats[exportFormat];
        let outputMatrix = format.method(self.context.getCurrentDataHarmonizer());
        self.context.runBehindLoadingScreen(exportFile, [
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
        '.' + self.context.getCurrentDataHarmonizer().export_formats[exportFormat].fileType
      );
    });

    // Reset export modal values when the modal is closed
    $('#export-to-modal').on('hidden.bs.modal', () => {
      $('#export-to-err-msg').text('');
      $('#base-name-export-to-input').val('');
    });

    // File -> Export
    $('#export-to-dropdown-item').click(() => {
      if (!$.isEmptyObject(self.context.getCurrentDataHarmonizer().invalid_cells)) {
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
      self.context.getCurrentDataHarmonizer().showAllColumns();
    });
    $('#show-required-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      self.context.getCurrentDataHarmonizer().showRequiredColumns();
    });
    $('#show-recommended-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      self.context.getCurrentDataHarmonizer().showRecommendedColumns();
    });
    $(this.root).on('click', '.show-section-dropdown-item', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      const $this = $(this);
      $this.addClass('disabled');
      self.context.getCurrentDataHarmonizer().showColumnsBySectionTitle($this.text());
    });

    // Locate next error based on current cursor cell row and column.
    $('#next-error-button').on('click', () => {
      const dh = self.context.getCurrentDataHarmonizer();
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

      self.context.getCurrentDataHarmonizer().current_selection = [focus_row, focus_col, focus_row, focus_col];
      self.context.getCurrentDataHarmonizer().scrollTo(focus_row, focus_col);
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
      self.context.getCurrentDataHarmonizer().changeRowVisibility(e.target.id);
    });

    $('#help_reference').on('click', () => self.context.getCurrentDataHarmonizer().renderReference());
  }

  async validate() {
    await this.context.runBehindLoadingScreen(self.context.getCurrentDataHarmonizer().validate);

    // If any rows have error, show this.
    if (Object.keys(self.context.getCurrentDataHarmonizer().invalid_cells).length > 0) {
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

  setupFillModal(dh) {
    const fillColumnInput = $('#fill-column-input').selectize({
      options: dh.getFields(),
      valueField: 'title',
      labelField: 'title',
      searchField: ['title'],
      openOnFocus: true
    });
    const fillValueInput = $('#fill-value-input');
    $('#fill-modal').on('shown.bs.modal', () => {
      fillColumnInput[0].selectize.open();
    });
    $('#fill-button').on('click', () => {
      dh.fillColumn(fillColumnInput.val(), fillValueInput.val());
      fillColumnInput[0].selectize.clear();
      fillValueInput.val('');
      $('#fill-modal').modal('hide');
    });
  }

  setupJumpToModal(columnCoordinates) {
    const jumpToInput = $('#jump-to-input');
    jumpToInput.selectize({
      options: Object.keys(columnCoordinates).map(col => ({ text: col, value: col })),
      openOnFocus: true,
      onInitialize: function() {
        jumpToInput.off('change');
      }
    }).on('change', (e) => {
      if (!e.target.value) {
        return;
      }
      const columnX = columnCoordinates[e.target.value];
      self.context.getCurrentDataHarmonizer().scrollTo(0, columnX);
      $('#jump-to-modal').modal('hide');
    });
    $('#jump-to-modal').on('shown.bs.modal', () => {
      jumpToInput[0].selectize.open();
    });
  }
  
  // NOTE: (Ken) Toolbar shouldn't own these UI updates! this application needs a rework
  async loadSelectedTemplate(file = null) {
    const loadFromFile = async (file) => {
      let schema, template_name;
      try {
        const contentBuffer = await readFileAsync(file);
        schema = JSON.parse(contentBuffer);
        template_name = Object.keys(schema.classes).find(
          e => schema.classes[e].is_a === 'dh_interface'
        );
      } catch (err) {
        console.error(err);
        return null;
      }
      // TODO: bug in this loader! where do the languages come from?
      return { template_name, schema, exportFormats: {}, languages: null };
    };
  
    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      const [schema_name, template_name] = template_path.split('/');
      const schema = await this.getSchema(schema_name, template_name);
      const exportFormats = await this.getExportFormats(schema_name, template_name);
      const languages = await this.getLanguages(schema_name);
      const schemaClass = schema.classes[template_name];
      return { template_path, schema_name, template_name, schema, exportFormats, languages, schemaClass };
    };
  
    let loadResult = file ? await loadFromFile(file) : await loadFromMenu();
    if (!loadResult) return;
    let { template_path, schema_name, template_name, schema, exportFormats, languages, schemaClass } = loadResult;

    // Use the previously coupled dh methods
    // change this to use the context instead
    this.context.setupDataHarmonizers({ template_path, schema_name, template_name, schema, exportFormats, languages, schemaClass }).then(async (context) => {

      let columnCoordinates;
      const dh = context.getCurrentDataHarmonizer();
      if (!languages) languages = await dh.getLanguages(template_name);
      if (!schemaClass) schemaClass = schema.classes[template_name];
      if (!columnCoordinates) columnCoordinates = dh.getColumnCoordinates();
    
      const updateGUI = ({ template_path, schema_name, template_name, schema, exportFormats, languages, schemaClass, columnCoordinates }) => {
        
        const languageSelect = $('#select-language-localization').empty();
        for (const { langcode, nativeName } of Object.values(languages)) {
          languageSelect.append(new Option(nativeName, langcode));
        }
        languageSelect.val(i18next.language);
        languageSelect.on('click', () => {
          i18next.changeLanguage(languageSelect.val());
        });
    
        $('#template_name_display').text(template_name);
        $('#file_name_display').text('');
      
        const selectExportFormat = $('#export-to-format-select');
        selectExportFormat.children(':not(:first)').remove();
        Object.entries(exportFormats).forEach(([option, details]) => {
          if (!details.pertains_to || details.pertains_to.includes(template_name)) {
            selectExportFormat.append(new Option(option, option));
          }
        });
    
        const helpSop = $('#help_sop');
        if (schema.classes[template_name].see_also) {
          helpSop.attr('href', schema.classes[template_name].see_also).show();
        } else {
          helpSop.hide();
        }
    
        const sectionMenu = $('#section-menu').empty();
        dh.template.forEach((section, index) => {
          sectionMenu.append(
            `<div id="show-section-${index}" class="dropdown-item show-section-dropdown-item">${section.title}</div>`
          );
        });
    
        this.setupJumpToModal(columnCoordinates);
        this.setupFillModal(dh);
    
        this.hideValidationResultButtons();

      };
    
      updateGUI({ schema_name, template_name, schema, exportFormats, languages, schemaClass, columnCoordinates });

    });

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

  async _defaultGetLanguages() {
    return {
      default: {
        langcode: 'default',
        nativeName: 'Default',
      },
    };
  }
}

export default Toolbar;
