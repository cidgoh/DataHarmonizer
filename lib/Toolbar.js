import $ from 'jquery';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';
import menu from '@/web/templates/menu.json';
import { LocaleNotSupportedError } from '@/lib/utils/templates';
import {
  exportFile,
  exportJsonFile,
  readFileAsync,
  createWorkbookFromJSON,
  exportWorkbook,
  importJsonFile,
} from '@/lib/utils/files';
import { nullValuesToString } from '@/lib/utils/general';

import {
  // translateObject,
  findLocalesForLangcodes,
  interface_translation,
} from '@/lib/utils/i18n';
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
    this.getExportFormats =
      options.getExportFormats || this._defaultGetExportFormats;
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

    const translationSelect = $('#select-translation-localization').empty();
    for (const { nativeName, langcode } of Object.values(
      findLocalesForLangcodes(Object.keys(interface_translation))
    )) {
      translationSelect.append(new Option(nativeName, langcode));
    }
    translationSelect.val('en');

    translationSelect.on('input', async () => {
      const translatableFields = (data_harmonizer_fields) => {
        // what counts as translatable?
        // - range: has a "menu"
        // - if it mentions an enumeration, it's a menu
        // look at default schema
        // - set of all enum keys
        //  - <slot>.any_of.range.[] :: in the list of Enum
        //  - range:
        // then it's translatable
        const is_translatable = data_harmonizer_fields.reduce(
          (acc, field_spec, index) => {
            // in field_spec, "sources" property exists for menus.
            return Object.assign(acc, {
              [index]: 'sources' in field_spec,
            });
          },
          {}
        );
        return is_translatable;
      };

      const translateData = (is_translatable, data_harmonizer_data) => {
        // translating the menu items (single or multiple)
        // - every field has a plain string, a string sometimes with a null value, or sample collected by menu and null value menu
        // - multivalued or not
        const _i = data_harmonizer_data.map((arr) =>
          arr.map((obj, index) => {
            return obj !== null && is_translatable[index]
              ? obj.split(MULTIVALUED_DELIMITER).length > 0
                ? (() => {
                    const translate_multi = obj
                      .split(MULTIVALUED_DELIMITER)
                      .map((o) =>
                        i18next.t(o, {
                          lng: i18next.language,
                          ns:
                            i18next.language === 'default'
                              ? 'reverse'
                              : 'translation',
                        })
                      )
                      .join(MULTIVALUED_DELIMITER);
                    // console.log(translate_multi)
                    // console.groupEnd();
                    return translate_multi;
                  })()
                : i18next.t(obj, {
                    lng: i18next.language,
                    ns:
                      i18next.language === 'default'
                        ? 'reverse'
                        : 'translation',
                  })
              : obj;
          })
        );
        return _i;
      };

      const language_update =
        translationSelect.val() !== 'en' ? translationSelect.val() : 'default';

      i18next.changeLanguage(language_update);
      const supportsLocale =
        findBestLocaleMatch(this.context.template.locales, [
          i18next.language,
        ]) !== null;

      if (supportsLocale) {
        try {
          // first cache data
          const current_template = this.context.appConfig.template_path;
          let _dh_data_cache = {};
          for (const dh in this.context.dhs) {
            const data = this.context.dhs[dh].hot.getData();
            const fields = this.context.dhs[dh].fields;
            _dh_data_cache[dh] = translateData(
              translatableFields(fields),
              data
            );
          }
          // reload the context with the new locale
          await this.context
            .reload(current_template, {
              locale: language_update,
            })
            .then((context) => {
              for (const dh in context.dhs) {
                if (typeof _dh_data_cache[dh] !== 'undefined') {
                  context.dhs[dh].hot.loadData(_dh_data_cache[dh]);
                }
                // HACK: not a nice place to put this, but it works for simple case.
                // Need this to recalculate on tab change
                this.setupSectionMenu(context.dhs[dh]);
              }
            });
        } catch (error) {
          if (error instanceof LocaleNotSupportedError) {
            console.warn(error);
          } else {
            throw error;
          }
        }
      } else {
        console.warn(`locale not supported ${i18next.language}`);
      }
    });

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
  }

  bindEvents() {
    $('#getting-started-modal').on(
      'show.bs.modal',
      this.loadGettingStartedModalContent
    );
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());
    $('#upload-template-input').on('change', this.uploadTemplate.bind(this));
    $('#new-dropdown-item, #clear-data-confirm-btn').on(
      'click',
      this.createNewFile.bind(this)
    );
    $('#open-file-input').on('change', this.openFile.bind(this));
    $('#save-as-dropdown-item').on('click', () => this.showSaveAsModal());
    $('#file-ext-save-as-select').on(
      'change',
      this.toggleJsonOptions.bind(this)
    );
    $('#save-as-json-use-index').on('change', this.toggleJsonIndexKey);
    $('#save-as-confirm-btn').on('click', this.saveFile.bind(this));
    $('#save-as-modal').on('hidden.bs.modal', this.resetSaveAsModal);
    $('#export-to-confirm-btn').on('click', this.exportFile.bind(this));
    $('#export-to-json-btn').on('click', this.exportFile.bind(this));
    $('#export-to-format-select').on('change', this.updateExportFileSuffix.bind(this));
    $('#export-to-modal').on('hidden.bs.modal', this.resetExportModal.bind(this));
    $('#export-to-dropdown-item').on('click', this.showExportModal.bind(this));
    $('#show-all-cols-dropdown-item').on(
      'click',
      this.showAllColumns.bind(this)
    );
    $('#show-required-cols-dropdown-item').on(
      'click',
      this.showRequiredColumns.bind(this)
    );
    $('#show-recommended-cols-dropdown-item').on(
      'click',
      this.showRecommendedColumns.bind(this)
    );
    $(this.root).on(
      'click',
      '.show-section-dropdown-item',
      this.showSectionColumns.bind(this)
    );
    $('#next-error-button').on('click', this.locateNextError.bind(this));
    $('#validate-btn').on('click', this.validate.bind(this));
    $('#help_reference').on('click', this.showReference.bind(this));
  }

  async loadGettingStartedModalContent() {
    const modalContainer = $('#getting-started-carousel-container');
    if (!modalContainer.html()) {
      const { getGettingStartedMarkup } = await import(
        './toolbarGettingStarted'
      );
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
      this.showError(
        'upload-template',
        'Please upload a template schema.json file'
      );
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
      this.showError(
        'open',
        `Only ${acceptedExts.join(', ')} files are supported`
      );
    } else {
      if (ext === 'json') {
        const contentBuffer = await readFileAsync(file);

        let jsonData;
        try {
          jsonData = JSON.parse(contentBuffer.text);
        } catch (error) {
          throw new Error('Invalid JSON data', error);
        }

        const {
          schema,
          in_language = null,
          location,
        } = importJsonFile(jsonData);

        const translationSelect = $('#select-translation-localization');
        const previous_language = i18next.language;
        if (in_language !== previous_language) {
          i18next.changeLanguage(
            in_language === 'en' ? 'default' : in_language
          );
          translationSelect.val(
            i18next.language === 'en' ? 'default' : in_language
          );
          $(document).localize();
        }

        if (
          this.context.template.schema.id !== schema ||
          in_language !== previous_language
        ) {
          const template_path = `${location.split('/').slice(-1)}/${schema
            .split('/')
            .slice(-1)}`;
          const locale = in_language;

          await this.context
            .reload(template_path, { locale })
            .then((context) => {
              for (const dh in context.dhs) {
                const list_data = context.dhs[dh].loadDataObjects(
                  jsonData.Container[dh],
                  locale
                );
                context.dhs[dh].hot.loadData(list_data);
                context.dhs[dh].hot.render();
              }
              return context;
            })
            .then(async (context) => {
              const template_name = context.getTemplateName();
              const exportFormats = context.getExportFormats();

              const languages = await context.getLocaleData(template_name);
              context.addTranslationResources(context.template, languages);

              let columnCoordinates;
              const dh = context.getCurrentDataHarmonizer();
              if (!columnCoordinates)
                columnCoordinates = dh.getColumnCoordinates();

              this.updateGUI(
                dh,
                template_name,
                exportFormats,
                columnCoordinates
              );
            });
        }
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
      const inferredIndexSlot = this.context
        .getCurrentDataHarmonizer()
        .getInferredIndexSlot();
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
    const lang = $('#select-translation-localization').val();

    const current_language = i18next.language;
    try {
      i18next.changeLanguage(lang);
      const MultiEntityJSON = Object.values(this.context.dhs).reduce(
        (acc, dh) => {
          return Object.assign(acc, { [dh.class_assignment]: dh.toJSON() });
        },
        {}
      );

      const Container = Object.entries(
        // default schema is guaranteed to feature the Container
        this.context.template.default.schema.classes.Container.attributes
      ).reduce((acc, [key, container]) => {
        return Object.assign(acc, {
          [key]: MultiEntityJSON[container.range].map((obj) =>
            nullValuesToString(obj)
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
        await this.context.runBehindLoadingScreen(exportJsonFile, [
          JSONFormat,
          baseName,
          ext,
        ]);
      } else {
        const MultiEntityWorkbook = createWorkbookFromJSON(
          JSONFormat.Container
        );
        await this.context.runBehindLoadingScreen(exportWorkbook, [
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
    const format =
      this.context.getCurrentDataHarmonizer().export_formats[exportFormat];
    const outputMatrix = format.method(this.context.getCurrentDataHarmonizer());
    await this.context.runBehindLoadingScreen(exportFile, [
      outputMatrix,
      baseName,
      format.fileType,
    ]);

    i18next.changeLanguage(current_language);
    $(document).localize(current_language);
    $('#export-to-modal').modal('hide');
  }

  updateExportFileSuffix() {
    const exportFormat = $('#export-to-format-select').val();
    $('#export_file_suffix').text(
      '.' +
        this.context.getCurrentDataHarmonizer().export_formats[exportFormat]
          .fileType
    );
  }

  resetExportModal() {
    $('#export-to-err-msg').text('');
    $('#base-name-export-to-input').val('');
  }

  showExportModal() {
    console.log('showExportModal', this.context, this.context.getCurrentDataHarmonizer());
    if (
      !$.isEmptyObject(this.context.getCurrentDataHarmonizer().invalid_cells)
    ) {
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
    for (const dh in this.context.dhs) {
      this.context.dhs[dh].renderReference();
    }
  }

  showError(prefix, message) {
    $(`#${prefix}-err-msg`).text(message);
    $(`#${prefix}-error-modal`).modal('show');
  }

  hideValidationResultButtons() {
    $('#next-error-button,#no-error-button').hide();
  }

  async loadSelectedTemplate(file = null) {
    // NOTE: Schema Name vs Template Name:
    // Example:
    // "template_path": "canada_covid19/CanCOGeN Covid-19",
    // "schema_name": "canada_covid19",       // left side of template path
    // "template_name": "CanCOGeN Covid-19",  // right side of template path
    // The template contains a schema
    // [...]
    // "schema": {
    //   "name": "CanCOGeN_Covid-19", // name of schema in template
    //   [...]
    // }
    // The name conventions needs revision throughout the codebase for clarity
    //

    const loadFromFile = async (file) => {
      let schema, template_name;
      try {
        const contentBuffer = await readFileAsync(file);
        schema = JSON.parse(contentBuffer.text);
        template_name = Object.keys(schema.classes).find(
          (e) => schema.classes[e].is_a === 'dh_interface'
        );
      } catch (err) {
        console.error(err);
        return null;
      }
      return {
        // TODO: implement template_path, schema_name to make the loader types consistent
        template_path: `local/${template_name}`,
        schema_name: template_name.toLowerCase(),
        template_name,
        schema,
        exportFormats: {},
        languages: null,
      };
    };

    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      const [schema_name, template_name] = template_path.split('/');
      const schema = await this.getSchema(schema_name, template_name);
      const exportFormats = await this.getExportFormats(
        schema_name,
        template_name
      );
      return {
        template_path,
        schema_name,
        template_name,
        schema,
        exportFormats,
      };
    };

    let loadResult = file ? await loadFromFile(file) : await loadFromMenu();
    if (!loadResult) return;
    let { template_path, schema } = loadResult;

    // RELOAD THE INTERFACE BY INTERACTING WITH THE CONTEXT
    this.context
      .reload(template_path, {
        forcedSchema: file ? schema : null,
      })
      .then(async (context) => {
        // RESTART THE INTRFACE
        const template_name = context.getTemplateName();
        const exportFormats = context.getExportFormats();

        const languages = await context.getLocaleData(template_name);
        context.addTranslationResources(context.template, languages);

        let columnCoordinates;
        const dh = context.getCurrentDataHarmonizer();
        if (!columnCoordinates) columnCoordinates = dh.getColumnCoordinates();

        this.updateGUI(dh, template_name, exportFormats, columnCoordinates);
      });

    // SETUP MODAL EVENTS
    $(document).on('dhCurrentChange', (event, extraData) => {
      this.setupSectionMenu(extraData.dh);
      this.setupFillModal(extraData.dh);
    });

    // INTERNATIONALIZE THE INTERFACE
    i18next.changeLanguage('default');
    $(document).localize();
  }

  updateGUI(dh, template_name, exportFormats, columnCoordinates) {
    $('#template_name_display').text(template_name);
    $('#file_name_display').text('');

    const selectExportFormat = $('#export-to-format-select');
    selectExportFormat.children(':not(:first)').remove();
    Object.entries(exportFormats).forEach(([option, details]) => {
      if (!details.pertains_to || details.pertains_to.includes(template_name)) {
        selectExportFormat.append(new Option(option, option));
      }
    });

    const translationSelect = $('#select-translation-localization').empty();
    for (const { nativeName, langcode } of Object.values(
      findLocalesForLangcodes(Object.keys(interface_translation))
    )) {
      translationSelect.append(new Option(nativeName, langcode));
    }
    translationSelect.val('en');

    const helpSop = $('#help_sop');
    if (this.context.template.schema.classes[template_name].see_also) {
      helpSop
        .attr(
          'href',
          this.context.template.schema.classes[template_name].see_also
        )
        .show();
    } else {
      helpSop.hide();
    }

    this.setupJumpToModal(columnCoordinates);
    this.setupSectionMenu(dh);
    this.setupFillModal(dh);
    this.hideValidationResultButtons();
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
    const jumpToInput = $('#jump-to-input')
      .selectize({
        options: Object.keys(columnCoordinates).map((col) => ({
          text: col,
          value: col,
        })),
        openOnFocus: true,
      })
      .on('change', (e) => {
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
        `<div id="show-section-${index}" class="dropdown-item show-section-dropdown-item" data-i18n="${
          section.title
        }">${i18next.t(section.title)}</div>`
      );
    });
    $('#section-menu').localize();
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
