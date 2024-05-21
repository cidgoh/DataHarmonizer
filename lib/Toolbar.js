import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';

import {
  exportFile,
  exportJsonFile,
  readFileAsync,
  createWorkbookFromJSON,
  exportWorkbook,
} from '@/lib/utils/files';
import i18next from 'i18next';
import tags from 'language-tags';

import template from '@/lib/toolbar.html';
import '@/lib//toolbar.css';

// NOTE: this is odd! package.json is a developer file. why should a UI component care about it?
import pkg from '../package.json';
import { hasLanguageDictionary } from 'handsontable/i18n';
import { findLocalesForLangcodes, interface_translation } from './utils/i18n';
const VERSION = pkg.version;

class Toolbar {
  dh = null;
  root = null;
  menu = {};

  /**
   * Wire up user controls which only need to happen once on load of page.
   */
  constructor(root, context, menu, options = {}) {
    const self = this; //For anonymous button functions etc.
    this.context = context || options.context; // TODO: promote to mandatory argument
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
      const dh = self.context.getCurrentDataHarmonizer();
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
        // open for all data harmonizers
        // TODO: refactor to context function, there's too much redundant work being done here
        Object.values(self.context.dhs).forEach((dh) => {
          dh.invalid_cells = {};
          dh.runBehindLoadingScreen(dh.openFile.bind(dh), [file]);
          dh.current_selection = [null, null, null, null];
        });
        $('#file_name_display').text(file.name);
      }
      // Allow consecutive uploads of the same file
      $fileInput[0].value = '';
      self.hideValidationResultButtons();
    });

    // File -> Save
    $('#save-as-dropdown-item').on('click', () => {
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

    $('#save-as-confirm-btn').on('click', () => {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      const lang = $('#lang-save-as-select').val();

      // TODO: order of these transformation functions matter! eliminate
      const translateObject =  (obj, lng = 'default', delimiter='_') => Object.entries(obj).reduce((acc, [key, val]) => {
        return Object.assign(acc, {
          [i18next.t(key.replace(/ /g, delimiter), 
          { defaultValue: key, lng }
        )]: val !== null ? i18next.t(val) : null
        })
      }, {});

      const nullValuesToString = obj => Object.entries(obj).reduce((acc, [key, val]) => {
        return Object.assign(acc, {
          [key]: val === null ? "" : val
        })
      }, {});

      const current_language = i18next.language;

      try {

        i18next.changeLanguage(lang);

        const MultiEntityJSON = Object.values(self.context.dhs).reduce(
          (acc, dh) => {

            // test the translation feature
            return Object.assign(acc, {
              [dh.class_assignment]: dh.toJSON(),
            });
          },
          {}
        );

        // container.range === dh.class_assignment
        const Container = Object.entries(self.context.template.schema.classes.Container.attributes)
          .reduce((acc, [key, container]) => {
            return Object.assign(acc, {
              [key]: MultiEntityJSON[container.range]
                .map(obj => nullValuesToString(translateObject(obj, lang)))
            })
          }, {});

        const JSONFormat = {
          schema: self.context.template.schema.id,
          location: self.context.template.location,
          version: self.context.template.schema.version,
          in_language: lang === "default" ? "en" : lang,
          Container
        }

        if (ext == 'json') {
          
          self.context.runBehindLoadingScreen(exportJsonFile, [
            JSONFormat,
            baseName,
            ext,
          ]);

        } else {

          const MultiEntityWorkbook = createWorkbookFromJSON(JSONFormat.Container);
          self.context.runBehindLoadingScreen(exportWorkbook, [
            MultiEntityWorkbook,
            baseName,
            ext,
          ]);

        }
        $('#save-as-modal').modal('hide');
      } catch (err) {
        $('#save-as-err-msg').text(err.message);
      } finally {
        i18next.changeLanguage(current_language);
      }
    });
    // Reset save modal values when the modal is closed
    $('#save-as-modal').on('hidden.bs.modal', () => {
      $('#save-as-err-msg').text('');
      $('#base-name-save-as-input').val('');
    });

    // File -> Export to...
    $('#export-to-confirm-btn').on('click', () => {
      // TRANSLATE
      const current_language = i18next.language;
      i18next.changeLanguage('default');
      $(document).localize();

      const baseName = $('#base-name-export-to-input').val();
      const exportFormat = $('#export-to-format-select').val();
      if (!exportFormat) {
        $('#export-to-err-msg').text('Select a format');
        return;
      }
      if (
        exportFormat in self.context.getCurrentDataHarmonizer().export_formats
      ) {
        const format =
          self.context.getCurrentDataHarmonizer().export_formats[exportFormat];
        let outputMatrix = format.method(
          self.context.getCurrentDataHarmonizer()
        );
        self.context.runBehindLoadingScreen(exportFile, [
          outputMatrix,
          baseName,
          format.fileType,
        ]);

        // TRANSLATE BACK
        i18next.changeLanguage(current_language);
        $(document).localize(current_language);
      }
      $('#export-to-modal').modal('hide');
    });

    $('#export-to-json-btn').on('click', () => {
      // TRANSLATE
      const current_language = i18next.language;
      i18next.changeLanguage('default');
      $(document).localize();

      const baseName = $('#base-name-export-to-input').val();
      const exportFormat = $('#export-to-format-select').val();
      if (!exportFormat) {
        $('#export-to-err-msg').text('Select a format');
        return;
      }
      if (
        exportFormat in self.context.getCurrentDataHarmonizer().export_formats
      ) {
        const format =
          self.context.getCurrentDataHarmonizer().export_formats[exportFormat];
        let outputMatrix = format.method(
          self.context.getCurrentDataHarmonizer()
        );
        self.context.runBehindLoadingScreen(exportFile, [
          outputMatrix,
          baseName,
          format.fileType,
        ]);

        // TRANSLATE BACK
        i18next.changeLanguage(current_language);
        $(document).localize(current_language);
      }
      $('#export-to-modal').modal('hide');
    });

    $('#export-to-format-select').on('change', () => {
      const exportFormat = $('#export-to-format-select').val();
      $('#export_file_suffix').text(
        '.' +
          self.context.getCurrentDataHarmonizer().export_formats[exportFormat]
            .fileType
      );
    });

    // Reset export modal values when the modal is closed
    $('#export-to-modal').on('hidden.bs.modal', () => {
      $('#export-to-err-msg').text('');
      $('#base-name-export-to-input').val('');
    });

    // File -> Export
    $('#export-to-dropdown-item').click(() => {
      if (
        !$.isEmptyObject(self.context.getCurrentDataHarmonizer().invalid_cells)
      ) {
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
      Object.keys(self.context.dhs).forEach((dh) =>
        self.context.dhs[dh].showAllColumns()
      );
    });
    $('#show-required-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      Object.keys(self.context.dhs).forEach((dh) =>
        self.context.dhs[dh].showRequiredColumns()
      );
    });
    $('#show-recommended-cols-dropdown-item').on('click', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      $(this).addClass('disabled');
      Object.keys(self.context.dhs).forEach((dh) =>
        self.context.dhs[dh].showRecommendedColumns()
      );
    });
    $(this.root).on('click', '.show-section-dropdown-item', function () {
      $(showColsSelectors.join(',')).removeClass('disabled');
      const $this = $(this);
      $this.addClass('disabled');
      // control every data harmonizer, since it's all sections
      // TODO: need to make it so menu changes each time data harmonizer changes
      Object.keys(self.context.dhs).forEach((dh) =>
        self.context.dhs[dh].showColumnsBySectionTitle($this.text())
      );
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

      self.context.getCurrentDataHarmonizer().current_selection = [
        focus_row,
        focus_col,
        focus_row,
        focus_col,
      ];
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

    $('#help_reference').on('click', () =>
      this.context.getCurrentDataHarmonizer().renderReference()
    );
  }

  async validate() {
    const dh = this.context.getCurrentDataHarmonizer();
    await this.context.runBehindLoadingScreen(dh.validate.bind(dh));

    // If any rows have error, show this.
    if (
      Object.keys(this.context.getCurrentDataHarmonizer().invalid_cells)
        .length > 0
    ) {
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
      openOnFocus: true,
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
    jumpToInput
      .selectize({
        options: Object.keys(columnCoordinates).map((col) => ({
          text: col,
          value: col,
        })),
        openOnFocus: true,
        onInitialize: function () {
          jumpToInput.off('change');
        },
      })
      .on('change', (e) => {
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
          (e) => schema.classes[e].is_a === 'dh_interface'
        );
      } catch (err) {
        console.error(err);
        return null;
      }
      // TODO: bug in this loader! where do the languages come from?
      // There's an in_language feature that needs to be applied.
      return { template_name, schema, exportFormats: {}, languages: null };
    };

    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      const [schema_name, template_name] = template_path.split('/');
      const schema = await this.getSchema(schema_name, template_name);
      const exportFormats = await this.getExportFormats(
        schema_name,
        template_name
      );
      const schemaClass = schema.classes[template_name];
      return {
        template_path,
        schema_name,
        template_name,
        schema,
        exportFormats,
        schemaClass,
      };
    };

    const updateGUI = ({
      dh,
      template_name,
      schema,
      exportFormats,
      languages,
      columnCoordinates,
    }) => {
 
        // Template Language Selection
        const languageSelect = $('#select-language-localization').empty();
        for (const { nativeName, langcode } of Object.values(languages)) {
          languageSelect.append(new Option(nativeName, langcode));
        }
        languageSelect.val(i18next.language === 'en' ? 'default': i18next.language).trigger('change');
        languageSelect.on('click', () => {
          i18next.changeLanguage(languageSelect.val());
        });

        // Interface Language selection
        const translationSelect = $('#select-translation-localization').empty();
        for (const { nativeName, langcode } of Object.values(findLocalesForLangcodes(Object.keys(interface_translation)))) {
          translationSelect.append(new Option(nativeName, langcode));
        }
        translationSelect.val('en').trigger('change');
        translationSelect.on('click', () => {
          i18next.changeLanguage(translationSelect.val());
        });

        function syncMenus(menuIds) {
          menuIds.forEach(function(menuId) {
              $('#' + menuId).on('change', function() {
                  var selectedValue = $(this).val();
                  menuIds.forEach(function(otherMenuId) {
                      if (otherMenuId !== menuId) {
                          var $otherMenu = $('#' + otherMenuId);
                          if ($otherMenu.find('option[value="' + selectedValue + '"]').length > 0) {
                              $otherMenu.val(selectedValue);
                          }
                      }
                  });
              });
          });
      }

      syncMenus(['select-language-localization', 'select-translation-localization'])

      // File -> Save as... -> Language options
      $('#lang-save-as-select').empty();
      $('#lang-save-as-select').append(new Option('Default', 'default'));
      for (const { nativeName, langcode } of Object.values(languages)) {
        if (langcode !== 'default') {
          $('#lang-save-as-select').append(
            new Option(nativeName, langcode)
          );
        }
      }

      $('#template_name_display').text(template_name);
      $('#file_name_display').text('');

      const selectExportFormat = $('#export-to-format-select');
      selectExportFormat.children(':not(:first)').remove();
      Object.entries(exportFormats).forEach(([option, details]) => {
        if (
          !details.pertains_to ||
          details.pertains_to.includes(template_name)
        ) {
          selectExportFormat.append(new Option(option, option));
        }
      });

      const helpSop = $('#help_sop');
      if (schema.classes[template_name].see_also) {
        helpSop.attr('href', schema.classes[template_name].see_also).show();
      } else {
        helpSop.hide();
      }

      this.setupJumpToModal(columnCoordinates);
      this.setupSectionMenu(dh);
      this.setupFillModal(dh);

      this.hideValidationResultButtons();
    };

    let loadResult = file ? await loadFromFile(file) : await loadFromMenu();
    if (!loadResult) return;
    let {
      template_path,
      schema_name,
      template_name,
      schema,
      exportFormats,
      schemaClass,
    } = loadResult;

    // Use the previously coupled dh methods
    // change this to use the context instead
    this.context
      .setupDataHarmonizers({
        template_path,
        schema_name,
        template_name,
        schema,
        exportFormats,
        schemaClass,
      })
      .then(async (context) => {
        
        const languages = await context.getLocaleData(template_name);
        console.log(context.template, languages)
        context.addTranslationResources(context.template, languages);

        let columnCoordinates;
        const dh = context.getCurrentDataHarmonizer();
        if (!schemaClass) schemaClass = schema.classes[template_name];
        if (!columnCoordinates) columnCoordinates = dh.getColumnCoordinates();

        updateGUI({
          dh,
          schema_name,
          template_name,
          schema,
          exportFormats,
          languages,
          schemaClass,
          columnCoordinates,
        });

      });

    // modify controls based on the current data harmonizer
    // for instance, classes may have different sections. so the sections menu has to change.
    // trigger is setup in "createDataHarmonizerTab"
    $(document).on('dhCurrentChange', (event, extraData) => {
      this.setupSectionMenu(this.context.dhs[extraData.data]);
      this.setupFillModal(this.context.dhs[extraData.data]);
    });

    // reset the language on menu change
    i18next.changeLanguage('default');
    $(document).localize();

  }

  setupSectionMenu(dh) {
    const sectionMenu = $('#section-menu').empty();
    dh.template.forEach((section, index) => {
      sectionMenu.append(
        `<div id="show-section-${index}" class="dropdown-item show-section-dropdown-item" data-i18n="${section.title}">${section.title}</div>`
      );
    });
    $('#section-menu').localize();
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
