import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';
import menu from '@/web/templates/menu.json';

import {
  exportFile,
  exportJsonFile,
  readFileAsync,
  createWorkbookFromJSON,
  exportWorkbook,
} from '@/lib/utils/files';

import { nullValuesToString } from './utils/general';
import {
  translateObject,
  findLocalesForLangcodes,
  interface_translation,
} from './utils/i18n';
import i18next from 'i18next';

import template from '@/lib/toolbar.html';
import '@/lib//toolbar.css';

import pkg from '../package.json';
import { MULTIVALUED_DELIMITER } from './utils/fields';
import { findBestLocaleMatch } from './utils/templates';

const VERSION = pkg.version;

class Toolbar {
  constructor(root, context, options = {}) {
    this.context = context;
    this.root = root;
    this.menu = menu;
    this.staticAssetPath = options.staticAssetPath || '';
    this.getSchema = options.getSchema || this._defaultGetSchema;
    this.getExportFormats = options.getExportFormats || this._defaultGetExportFormats;
    this.getLanguages = options.getLanguages || this._defaultGetLanguages;

    $(this.root).append(template);
    this.initialize(options);
    this.bindEvents();
  }

  initialize(options) {
    if (options.releasesURL) {
      $('#help_release')[0].href = options.releasesURL;
    }

    this.$selectTemplate = $('#select-template');
    $('#version-dropdown-item').text('version ' + VERSION);

    this.updateTemplateOptions();
    if (options.templatePath) {
      const [folder, template] = options.templatePath.split('/');
      if (folder in this.menu && template in this.menu[folder]) {
        this.$selectTemplate.val(options.templatePath);
      }
    }
    this.loadSelectedTemplate();
  }

  bindEvents() {
    $('#getting-started-modal').on('show.bs.modal', this.loadGettingStartedModalContent);
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());
    $('#upload-template-input').on('change', this.uploadTemplate.bind(this));
    $('#new-dropdown-item, #clear-data-confirm-btn').on('click', this.createNewFile.bind(this));
    $('#open-file-input').on('change', this.openFile.bind(this));
    $('#save-as-dropdown-item').on('click', () => this.showSaveAsModal());
    $('#file-ext-save-as-select').on('change', this.toggleJsonOptions);
    $('#save-as-json-use-index').on('change', this.toggleJsonIndexKey);
    $('#save-as-confirm-btn').on('click', this.saveFile.bind(this));
    $('#save-as-modal').on('hidden.bs.modal', this.resetSaveAsModal);
    $('#export-to-confirm-btn').on('click', this.exportFile.bind(this));
    $('#export-to-json-btn').on('click', this.exportFile.bind(this));
    $('#export-to-format-select').on('change', this.updateExportFileSuffix);
    $('#export-to-modal').on('hidden.bs.modal', this.resetExportModal);
    $('#export-to-dropdown-item').on('click', this.showExportModal);
    $('#show-all-cols-dropdown-item').on('click', this.showAllColumns.bind(this));
    $('#show-required-cols-dropdown-item').on('click', this.showRequiredColumns.bind(this));
    $('#show-recommended-cols-dropdown-item').on('click', this.showRecommendedColumns.bind(this));
    $(this.root).on('click', '.show-section-dropdown-item', this.showSectionColumns.bind(this));
    $('#next-error-button').on('click', this.locateNextError.bind(this));
    $('#validate-btn').on('click', this.validate.bind(this));
    $('#help_reference').on('click', this.showReference.bind(this));
  }

  async loadGettingStartedModalContent() {
    const modalContainer = $('#getting-started-carousel-container');
    if (!modalContainer.html()) {
      const { getGettingStartedMarkup } = await import('./toolbarGettingStarted');
      modalContainer.html(getGettingStartedMarkup());
    }
  }

  updateTemplateOptions() {
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

  async uploadTemplate() {
    const dh = this.context.getCurrentDataHarmonizer();
    const file = $('#upload-template-input')[0].files[0];
    const ext = file.name.split('.').pop();
    if (ext !== 'json') {
      this.showError('upload-template', 'Please upload a template schema.json file');
    } else {
      dh.invalid_cells = {};
      await this.loadSelectedTemplate(file);
      $('#upload-template-input')[0].value = '';
      this.hideValidationResultButtons();
      dh.current_selection = [null, null, null, null];
    }
  }

  createNewFile(e) {
    const dh = this.context.getCurrentDataHarmonizer();
    const isNotEmpty = dh.hot.countRows() - dh.hot.countEmptyRows();
    if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
      $('#clear-data-warning-modal').modal('show');
    } else {
      $('#file_name_display').text('');
      this.hideValidationResultButtons();
      dh.newHotFile();
    }
  }

  async openFile() {
    const file = $('#open-file-input')[0].files[0];
    const ext = file.name.split('.').pop();
    const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv', 'json'];
    if (!acceptedExts.includes(ext)) {
      this.showError('open', `Only ${acceptedExts.join(', ')} files are supported`);
    } else {
      for (const dh of Object.values(this.context.dhs)) {
        dh.invalid_cells = {};
        await dh.runBehindLoadingScreen(dh.openFile.bind(dh), [file]);
        dh.current_selection = [null, null, null, null];
      }
      $('#file_name_display').text(file.name);
      $('#open-file-input')[0].value = '';
      this.hideValidationResultButtons();
    }
  }

  showSaveAsModal() {
    const dh = this.context.getCurrentDataHarmonizer();
    if (!$.isEmptyObject(dh.invalid_cells)) {
      $('#save-as-invalid-warning-modal').modal('show');
    } else {
      $('#save-as-modal').modal('show');
    }
  }

  toggleJsonOptions(evt) {
    if (evt.target.value === 'json') {
      $('#save-as-json-options').removeClass('d-none');
      const inferredIndexSlot = this.context.getCurrentDataHarmonizer().getInferredIndexSlot();
      $('#save-as-json-index-key').val(inferredIndexSlot);
    } else {
      $('#save-as-json-options').addClass('d-none');
    }
  }

  toggleJsonIndexKey(evt) {
    $('#save-as-json-index-key').prop('disabled', !evt.target.checked);
  }

  async saveFile() {
    const baseName = $('#base-name-save-as-input').val();
    const ext = $('#file-ext-save-as-select').val();
    const lang = $('#lang-save-as-select').val();
    const current_language = i18next.language;

    try {
      i18next.changeLanguage(lang);
      const MultiEntityJSON = Object.values(this.context.dhs).reduce((acc, dh) => {
        return Object.assign(acc, { [dh.class_assignment]: dh.toJSON() });
      }, {});

      const Container = Object.entries(this.context.template.schema.classes.Container.attributes).reduce((acc, [key, container]) => {
        return Object.assign(acc, {
          [key]: MultiEntityJSON[container.range].map((obj) =>
            nullValuesToString(translateObject(obj, lang))
          ),
        });
      }, {});

      const JSONFormat = {
        schema: this.context.template.schema.id,
        location: this.context.template.location,
        version: this.context.template.schema.version,
        in_language: lang === 'default' ? 'en' : lang,
        Container,
      };

      if (ext === 'json') {
        await this.context.runBehindLoadingScreen(exportJsonFile, [JSONFormat, baseName, ext]);
      } else {
        const MultiEntityWorkbook = createWorkbookFromJSON(JSONFormat.Container);
        await this.context.runBehindLoadingScreen(exportWorkbook, [MultiEntityWorkbook, baseName, ext]);
      }
      $('#save-as-modal').modal('hide');
    } catch (err) {
      $('#save-as-err-msg').text(err.message);
    } finally {
      i18next.changeLanguage(current_language);
    }
  }

  resetSaveAsModal() {
    $('#save-as-err-msg').text('');
    $('#base-name-save-as-input').val('');
  }

  async exportFile() {
    const current_language = i18next.language;
    i18next.changeLanguage('default');
    $(document).localize();

    const baseName = $('#base-name-export-to-input').val();
    const exportFormat = $('#export-to-format-select').val();
    if (!exportFormat) {
      $('#export-to-err-msg').text('Select a format');
      return;
    }
    const format = this.context.getCurrentDataHarmonizer().export_formats[exportFormat];
    const outputMatrix = format.method(this.context.getCurrentDataHarmonizer());
    await this.context.runBehindLoadingScreen(exportFile, [outputMatrix, baseName, format.fileType]);

    i18next.changeLanguage(current_language);
    $(document).localize(current_language);
    $('#export-to-modal').modal('hide');
  }

  updateExportFileSuffix() {
    const exportFormat = $('#export-to-format-select').val();
    $('#export_file_suffix').text('.' + this.context.getCurrentDataHarmonizer().export_formats[exportFormat].fileType);
  }

  resetExportModal() {
    $('#export-to-err-msg').text('');
    $('#base-name-export-to-input').val('');
  }

  showExportModal() {
    if (!$.isEmptyObject(this.context.getCurrentDataHarmonizer().invalid_cells)) {
      $('#export-to-invalid-warning-modal').modal('show');
    } else {
      $('#export-to-modal').modal('show');
    }
  }

  showAllColumns() {
    this.toggleColumnVisibility('showAllColumns');
  }

  showRequiredColumns() {
    this.toggleColumnVisibility('showRequiredColumns');
  }

  showRecommendedColumns() {
    this.toggleColumnVisibility('showRecommendedColumns');
  }

  showSectionColumns(event) {
    const sectionTitle = $(event.currentTarget).text();
    this.toggleColumnVisibility('showColumnsBySectionTitle', sectionTitle);
  }

  toggleColumnVisibility(method, arg) {
    const showColsSelectors = [
      '#show-all-cols-dropdown-item',
      '#show-required-cols-dropdown-item',
      '#show-recommended-cols-dropdown-item',
      '.show-section-dropdown-item',
    ];
    $(showColsSelectors.join(',')).removeClass('disabled');
    $(event.currentTarget).addClass('disabled');
    Object.keys(this.context.dhs).forEach((dh) => {
      this.context.dhs[dh][method](arg);
    });
  }

  locateNextError() {
    const dh = this.context.getCurrentDataHarmonizer();
    let focus_row = dh.current_selection[0];
    let focus_col = dh.current_selection[1];

    const all_rows = Object.keys(dh.invalid_cells);
    const error1_row = all_rows[0];
    if (focus_row === null) {
      focus_row = error1_row;
      focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
    } else {
      const rows = all_rows.filter((row) => row >= focus_row);

      if (focus_row == rows[0]) {
        let cols = Object.keys(dh.invalid_cells[focus_row]);
        cols = cols.filter((col) => col > focus_col);
        if (cols.length) {
          focus_col = parseInt(cols[0]);
        } else {
          focus_row = rows.length > 1 ? rows[1] : error1_row;
          focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
        }
      } else {
        focus_row = rows.length ? rows[0] : error1_row;
        focus_col = Object.keys(dh.invalid_cells[focus_row])[0];
      }
    }

    dh.current_selection = [focus_row, focus_col, focus_row, focus_col];
    dh.scrollTo(focus_row, focus_col);
  }

  async validate() {
    const dh = this.context.getCurrentDataHarmonizer();
    await this.context.runBehindLoadingScreen(dh.validate.bind(dh));

    if (Object.keys(dh.invalid_cells).length > 0) {
      $('#next-error-button').show();
      $('#no-error-button').hide();
    } else {
      $('#next-error-button').hide();
      $('#no-error-button').show().delay(5000).fadeOut('slow');
    }
  }

  showReference() {
    this.context.getCurrentDataHarmonizer().renderReference();
  }

  showError(prefix, message) {
    $(`#${prefix}-err-msg`).text(message);
    $(`#${prefix}-error-modal`).modal('show');
  }

  hideValidationResultButtons() {
    $('#next-error-button,#no-error-button').hide();
  }

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
      return { template_name, schema, exportFormats: {}, languages: null };
    };

    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      const [schema_name, template_name] = template_path.split('/');
      const schema = await this.getSchema(schema_name, template_name);
      const exportFormats = await this.getExportFormats(schema_name, template_name);
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
      const languageSelect = $('#select-language-localization').empty();
      for (const { nativeName, langcode } of Object.values(languages)) {
        languageSelect.append(new Option(nativeName, langcode));
      }
      languageSelect
        .val(i18next.language === 'en' ? 'default' : i18next.language)
        .trigger('input');
      languageSelect.on('input', () => {
        i18next.changeLanguage(languageSelect.val());
      });

      const translationSelect = $('#select-translation-localization').empty();
      for (const { nativeName, langcode } of Object.values(findLocalesForLangcodes(Object.keys(interface_translation)))) {
        translationSelect.append(new Option(nativeName, langcode));
      }
      translationSelect.val('en').trigger('input');
      translationSelect.on('input', () => {
        i18next.changeLanguage(translationSelect.val());

        const supportsLocale = findBestLocaleMatch(this.context.template.locales, ['default', i18next.language]) !== null;
        if (supportsLocale) {
          this.context.template.updateLocale(i18next.language);
          for (const dh in this.context.dhs) {
            const data = this.context.dhs[dh].hot.getData();
            this.context.dhs[dh].useSchema(this.context.template.localized.schema, exportFormats, template_name);
            this.context.dhs[dh].createHot();

            const is_translatable = this.context.dhs[dh].fields.reduce(
              (acc, field_spec, index) => {
                return Object.assign(acc, {
                  [index]: 'flatVocabulary' in field_spec,
                });
              },
              {}
            );

            const _i = data.map((arr) =>
              arr.map((obj, index) =>
                obj !== null && is_translatable[index]
                  ? obj.split(MULTIVALUED_DELIMITER).length > 0
                    ? obj.split(MULTIVALUED_DELIMITER).map(i18next.t).join(MULTIVALUED_DELIMITER)
                    : i18next.t(obj)
                  : obj
              )
            );

            this.context.dhs[dh].hot.loadData(_i);
          }
        }
      });

      function syncMenus(menuIds) {
        menuIds.forEach(function (menuId) {
          $('#' + menuId).on('change', function () {
            var selectedValue = $(this).val();
            menuIds.forEach(function (otherMenuId) {
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

      syncMenus(['select-language-localization', 'select-translation-localization']);

      $('#lang-save-as-select').empty().append(new Option('Default', 'default'));
      for (const { nativeName, langcode } of Object.values(languages)) {
        if (langcode !== 'default') {
          $('#lang-save-as-select').append(new Option(nativeName, langcode));
        }
      }

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

    $(document).on('dhCurrentChange', (event, extraData) => {
      this.setupSectionMenu(this.context.dhs[extraData.data]);
      this.setupFillModal(this.context.dhs[extraData.data]);
    });

    i18next.changeLanguage('default');
    $(document).localize();
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
    const jumpToInput = $('#jump-to-input').selectize({
      options: Object.keys(columnCoordinates).map((col) => ({
        text: col,
        value: col,
      })),
      openOnFocus: true,
    }).on('change', (e) => {
      if (!e.target.value) return;
      const columnX = columnCoordinates[e.target.value];
      this.context.getCurrentDataHarmonizer().scrollTo(0, columnX);
      $('#jump-to-modal').modal('hide');
    });
    $('#jump-to-modal').on('shown.bs.modal', () => {
      jumpToInput[0].selectize.open();
    });
  }

  setupSectionMenu(dh) {
    const sectionMenu = $('#section-menu').empty();
    dh.sections.forEach((section, index) => {
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
