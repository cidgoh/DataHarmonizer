/* Top toolbar for File|Settings|Validate|Help|Template|Language menu.
 *
 * To enable DH multilingual locales: remove "display:none" from toolbar.html
 * translation_label button group.
 *
 * DH 1-many functionality is enabled at bottom of AppContext.js
 *
 */

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
  importJsonFile,
  prependToSheet,
} from '../lib/utils/files';
import { nullValuesToString, isEmptyUnitVal } from '../lib/utils/general';
import { MULTIVALUED_DELIMITER, titleOverText } from '../lib/utils/fields';
import { takeKeys, invert } from '../lib/utils/objects';
import {
  findBestLocaleMatch,
  //  templatePathForSchemaURI,
  rangeToContainerClass,
  LocaleNotSupportedError,
} from '../lib/utils/templates';

import { findLocalesForLangcodes, interface_translation } from './utils/i18n';
import i18next from 'i18next';

import template from './toolbar.html';
import './/toolbar.css';

import { menu } from 'schemas';
import pkg from '../package.json';

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

    translationSelect.on('input', async () => {
      const previousLocale = i18next.language;
      const language_update =
        translationSelect.val() !== 'en' ? translationSelect.val() : 'default';

      i18next.changeLanguage(language_update);
      const targetLocale = findBestLocaleMatch(this.context.template.locales, [
        i18next.language,
      ]);

      const supportsLocale = targetLocale !== null;
      const translationNamespace =
        previousLocale != targetLocale
          ? `${previousLocale}_to_${targetLocale}`
          : 'translation';

      const findTranslatableFields = (data_harmonizer_fields) => {
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

      const translateData = (
        isTranslatable,
        dataHarmonizerData,
        namespace = 'translation'
      ) => {
        // Helper function to translate a single value based on the current language and namespace
        const translateValue = (value) => {
          // console.log(
          //   'executing translateValue for',
          //   value,
          //   i18next.options.resources
          // );
          // console.log(
          //   value,
          //   previousLocale,
          //   targetLocale,
          //   i18next.t(value, { lng: i18next.language, ns: 'reverse' }),
          //   i18next.t(value, { lng: i18next.language, ns: 'translation' })
          // );
          // const namespace = i18next.language === 'default' ? 'reverse' : 'translation';
          return i18next.t(value, { lng: previousLocale, ns: namespace });
        };

        // Helper function to translate multiple values if they are delimited
        const translateMultivalued = (multivaluedString) => {
          const values = multivaluedString.split(MULTIVALUED_DELIMITER);
          const translatedValues = values.map((value) => translateValue(value));
          return translatedValues.join(MULTIVALUED_DELIMITER);
        };

        // Main function logic to iterate over the data
        return dataHarmonizerData.map((row, row_index) => {
          return row.map((value, index) => {
            if (value != null && value != '' && isTranslatable[index]) {
              console.warn(
                `translating ${value} at ${index} (${this.context
                  .getCurrentDataHarmonizer()
                  .hot.getDataAtCell(row_index, index)})`
              );
            }
            // Only translate if the value exists and it's marked as translatable
            if (value && isTranslatable[index]) {
              // Check if the value is multivalued (contains the delimiter)
              if (value.includes(MULTIVALUED_DELIMITER)) {
                return translateMultivalued(value); // Translate multivalued string
              } else {
                return translateValue(value); // Translate single value
              }
            }

            // If the value is not translatable or doesn't exist, return it as-is
            return value;
          });
        });
      };

      if (supportsLocale) {
        try {
          // first cache data
          const current_template = this.context.appConfig.template_path;
          let _dh_data_cache = {};
          for (const dh in this.context.dhs) {
            const data = this.context.dhs[dh].hot.getData();
            const translatableFields = findTranslatableFields(
              this.context.dhs[dh].slots
            );
            _dh_data_cache[dh] = translateData(
              translatableFields,
              data,
              translationNamespace
            );
          }

          // reload the context with the new locale
          // console.log('reload 1: translationSelect change');
          await this.context
            .reload(current_template, language_update)
            .then((context) => {
              for (const dh in context.dhs) {
                if (typeof _dh_data_cache[dh] !== 'undefined') {
                  context.dhs[dh].hot.loadData(_dh_data_cache[dh]);
                }
              }
              const initialDh = this.context.getCurrentDataHarmonizer();
              // HACK: not a nice place to put this, but it works for simple case.
              // Need this to recalculate on tab change
              this.setupSectionMenu(initialDh);
              // Jump to modal as well
              this.setupJumpToModal(initialDh);
              this.setupFillModal(initialDh);
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
      const [schema_folder, template_name] = options.templatePath.split('/');
      //for (const [schema_name, schema_obj] of Object.entries(this.menu)) {
      for (const schema_obj of Object.values(this.menu)) {
        if (
          'folder' in schema_obj &&
          schema_obj['folder'] == schema_folder &&
          template_name in schema_obj['templates']
        ) {
          this.$selectTemplate.val(options.templatePath);
        }
      }
    }
    this.loadSelectedTemplate();
  }

  // Should fire only once per screen load/reload.
  bindEvents() {
    $('#getting-started-modal').on(
      'show.bs.modal',
      this.loadGettingStartedModalContent
    );
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    //    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());
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
    $('#export-to-format-select').on(
      'change',
      this.updateExportFileSuffix.bind(this)
    );
    $('#export-to-modal').on(
      'hidden.bs.modal',
      this.resetExportModal.bind(this)
    );
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
    const showRowsSelectors = [
      '#show-all-rows-dropdown-item',
      '#show-valid-rows-dropdown-item',
      '#show-invalid-rows-dropdown-item',
    ];
    $(showRowsSelectors.join(',')).on(
      'click',
      this.toggleRowVisibility.bind(this)
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
    for (const [schema_name, schema_obj] of Object.entries(this.menu)) {
      // malformed entry if no 'templates' attribute
      const templates = schema_obj['templates'] || {};
      for (const [template_name, template_obj] of Object.entries(templates)) {
        let path = schema_obj.folder + '/' + template_name;
        let label =
          Object.keys(templates).length == 1
            ? template_name
            : schema_obj.folder + '/' + template_name;
        if (template_obj.display) {
          this.$selectTemplate.append(new Option(label, path));
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

  restartInterface(myContext) {
    //console.log('myContext',myContext);
    myContext.addTranslationResources(myContext.template);
    this.updateGUI(
      myContext.getCurrentDataHarmonizer(),
      myContext.getTemplateName()
    );
  }

  async openFile() {
    const file = $('#open-file-input')[0].files[0];
    if (!file) {
      // Happens when user cancels open action.
      return;
    }

    const ext = file.name.split('.').pop();

    const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv', 'json'];
    if (!acceptedExts.includes(ext)) {
      this.showError(
        'open',
        `Only ${acceptedExts.join(', ')} files are supported`
      );
    } else {
      if (ext === 'json') {
        $('#open-file-input')[0].value = ''; // enables reload of file by same name.
        // JSON is the only format that contains reference to schema to
        // utilize by "schema" URI, as well as "in_language" locale, and
        // its Container class contains template spec itself.
        // It may have several dhs, one for each Container class mentioned.
        const contentBuffer = await readFileAsync(file);
        //alert("opening " + file.name)
        let jsonData;
        try {
          jsonData = JSON.parse(contentBuffer.text);
        } catch (error) {
          throw new Error('Invalid JSON data', error);
        }

        const { schema_uri, in_language = null } = importJsonFile(jsonData);
        const translationSelect = $('#select-translation-localization');
        const previous_language = i18next.language;
        // ensure is localized in the same language as the file
        if (in_language !== previous_language) {
          i18next.changeLanguage(
            in_language === 'en' ? 'default' : in_language
          );
          translationSelect.val(
            i18next.language === 'en' ? 'default' : in_language
          );
          // .trigger('input');
          $(document).localize();
        }

        // If we're loading a JSON file, we have to match its schema_uri to a
        // schema.  Check loaded schema, but if not there, lookup in menu.
        // Then if provided, load schema in_language locale.
        // Future: automate detection of json file schema via menu datastructure.
        // In which case template_path below has to be changed to match.

        // Currently loaded schema_uri: this.context.template.default.schema.id
        if (schema_uri != this.context.template.default.schema.id) {
          alert(
            `The current json file's schema "${schema_uri}" is required, but one must select this template from menu first, if available.  Online retrieval of schemas is not yet available.`
          );
          return false;
        }
        const locale = in_language;

        console.log('reload 2: openfile');
        const template_path = this.context.appConfig.template_path;
        // e.g. canada_covid19/CanCOGeN_Covid-19
        await this.context
          .reload(template_path, locale)
          .then((context) => {
            if (!jsonData.Container) {
              alert(
                'Error: JSON data file does not have Container dictionary.'
              );
            } else {
              // The data is possibly *sparse*. loadDataObjects() fills in missing values.
              for (const dh in context.dhs) {
                // Gets name of container object holding the given dh class.
                const container_class = rangeToContainerClass(
                  context.template.default.schema.classes.Container,
                  dh
                );

                const list_data = context.dhs[dh].loadDataObjects(
                  jsonData.Container[container_class],
                  locale
                );

                console.log('here', container_class, list_data); //

                if (list_data) context.dhs[dh].hot.loadData(list_data);
                else
                  alert(
                    'Unable to fetch table data from json file ' +
                      template_path +
                      ' for ' +
                      dh
                  );
              }
            }

            return context;
          })
          .then(this.restartInterface.bind(this));
      } else {
        for (const dh of Object.values(this.context.dhs)) {
          dh.invalid_cells = {};
          await this.context.runBehindLoadingScreen(dh.openFile.bind(dh), [
            file,
          ]);
          dh.current_selection = [null, null, null, null];
        }

        $('#file_name_display').text(file.name);
        $('#open-file-input')[0].value = ''; // enables reload of file by same name.
        this.hideValidationResultButtons();
      }
    }
  }

  async saveFile() {
    const baseName = $('#base-name-save-as-input').val();
    const ext = $('#file-ext-save-as-select').val();
    const lang = $('#select-translation-localization').val();
    if (!baseName) {
      $('#save-as-err-msg').text('Specify a file name');
      return;
    }
    const MultiEntityJSON = Object.values(this.context.dhs).reduce(
      (acc, dh) => {
        return Object.assign(acc, { [dh.template_name]: dh.toJSON() });
      },
      {}
    );

    const schema_container =
      this.context.template.default.schema.classes.Container;

    // default schema is guaranteed to feature the Container
    const Container = Object.entries(schema_container.attributes).reduce(
      (acc, [cls_key, { name, range }]) => {
        if (typeof range !== 'undefined' && this.context.dhs[range]) {
          //Or test range against this.context.appConfig.template_path.split('/')[1]
          const processedClass = {
            [name]: MultiEntityJSON[range]
              .map((obj) => nullValuesToString(obj))
              .map((entry) => {
                // translation: if available, use title over text given a non-default localization for export
                // TODO?: check if current lang is equal to current schema lang?
                const fields = this.context.dhs[range].slots;
                const findField = (colKey) =>
                  fields.filter((field) => field.title === colKey)[0];
                entry = Object.fromEntries(
                  Object.entries(entry).map(([k, v]) => {
                    const field = findField(k);
                    let nv = v;
                    if (field.sources && !isEmptyUnitVal(v)) {
                      const merged_permissible_values = field.sources.reduce(
                        (acc, source) => {
                          return Object.assign(
                            acc,
                            field.permissible_values[source]
                          );
                        },
                        {}
                      );
                      if (field.multivalued === true) {
                        nv = v
                          .split(MULTIVALUED_DELIMITER)
                          .map((_v) => {
                            if (!(_v in merged_permissible_values))
                              console.warn(
                                `${_v} not in merged_permissible_values ${Object.keys(
                                  merged_permissible_values
                                )}`
                              );
                            return _v in merged_permissible_values
                              ? titleOverText(merged_permissible_values[_v])
                              : _v;
                          })
                          .join(MULTIVALUED_DELIMITER);
                      } else {
                        if (!(v in merged_permissible_values))
                          console.warn(
                            `${v} not in merged_permissible_values ${Object.keys(
                              merged_permissible_values
                            )}`
                          );
                        nv =
                          v in merged_permissible_values
                            ? titleOverText(merged_permissible_values[v])
                            : v;
                      }
                    }
                    return [k, nv];
                  })
                );
                return entry;
              }),
          };

          return Object.assign(acc, processedClass);
        } else {
          console.warn('Container entry has no range:', cls_key);
          return acc;
        }
      },
      {}
    );

    const JSONFormat = {
      schema: this.context.template.schema.id,
      location: this.context.template.location,
      version: this.context.template.schema.version,
      in_language: lang === 'default' ? 'en' : lang,
      Container,
    };

    if (ext === 'json') {
      const filterFunctionTemplate =
        (condCallback = () => true, keyCallback = (id) => id) =>
        (obj) =>
          Object.keys(obj).reduce((acc, itemKey) => {
            return condCallback(obj, acc, itemKey)
              ? {
                  ...acc,
                  [keyCallback(itemKey)]: obj[itemKey],
                }
              : acc;
          }, {});

      const filterEmptyKeys = filterFunctionTemplate(
        (obj, acc, itemKey) =>
          itemKey in obj && !(itemKey in acc) && obj[itemKey] != '',
        (id) => id
      );

      const processEntryKeys = (lst) => lst.map(filterEmptyKeys);

      for (let concept in JSONFormat.Container) {
        JSONFormat.Container[concept] = processEntryKeys(
          JSONFormat.Container[concept]
        );
      }

      await this.context.runBehindLoadingScreen(exportJsonFile, [
        JSONFormat,
        baseName,
        ext,
      ]);
    } else {
      const sectionCoordinatesByClass = Object.values(this.context.dhs).reduce(
        (acc, dh) => {
          const sectionTiles = dh.sections.map((s) => s.title);
          const takeSections = takeKeys(sectionTiles);
          return Object.assign(acc, {
            [rangeToContainerClass(schema_container, dh.template_name)]: invert(
              takeSections(dh.getColumnCoordinates())
            ),
          });
        },
        {}
      );

      const columnCoordinatesByClass = Object.values(this.context.dhs).reduce(
        (acc, dh) => {
          const columnIndexCoordinates = dh.slots.reduce(
            (acc, field, i) => Object.assign(acc, { [field.name]: i }),
            {}
          );
          return Object.assign(acc, {
            [rangeToContainerClass(schema_container, dh.template_name)]: invert(
              columnIndexCoordinates
            ),
          });
        },
        {}
      );

      let MultiEntityWorkbook = createWorkbookFromJSON(JSONFormat.Container);
      MultiEntityWorkbook.SheetNames.forEach((sheetName) => {
        if (!(JSONFormat.Container[sheetName].length > 0)) {
          prependToSheet(
            MultiEntityWorkbook,
            sheetName,
            columnCoordinatesByClass[sheetName]
          );
        }
        prependToSheet(
          MultiEntityWorkbook,
          sheetName,
          sectionCoordinatesByClass[sheetName]
        );
      });

      await this.context.runBehindLoadingScreen(exportWorkbook, [
        MultiEntityWorkbook,
        baseName,
        ext,
      ]);
    }
    $('#save-as-modal').modal('hide');
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
    if (!baseName) {
      $('#export-to-err-msg').text('Specify a file name');
      return;
    }
    const format = this.context.export_formats[exportFormat];
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

  // Each export triggers a specific file suffix, so indicate this to user.
  updateExportFileSuffix() {
    const exportFormat = $('#export-to-format-select').val();
    $('#export_file_suffix').text(
      '.' + this.context.export_formats[exportFormat].fileType
    );
  }

  resetExportModal() {
    $('#export-to-err-msg').text('');
    $('#base-name-export-to-input').val('');
  }

  showExportModal() {
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

  toggleRowVisibility(event) {
    const dh = this.context.getCurrentDataHarmonizer();
    dh.changeRowVisibility(event.target.id);
  }

  // Needs to be revised - unclear when row index is being referenced, or an
  // entire row
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
        let inv_focus = dh.invalid_cells[focus_row];
        if (inv_focus)
          //Not sure how this is
          focus_col = Object.keys(inv_focus)[0];
        else focus_col = 0;
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
    // Prevents another popup on repeated click if user focuses away from
    // previous popup.
    return false;
  }

  showError(prefix, message) {
    $(`#${prefix}-err-msg`).text(message);
    $(`#${prefix}-error-modal`).modal('show');
  }

  hideValidationResultButtons() {
    $('#next-error-button,#no-error-button').hide();
  }

  // LoadSelectedTemplate either comes from
  // 1) loadFromFile reference to a whole schema file in which case template
  // menu is redone based on schema's templates, and FIRST 'dh_interface'
  // template is selected.
  // OR
  // 2) loadFromMenu where $selectTemplate.val() contains a schema_name &
  // template_name combo, and we use this.getSchema() to fetch schema,
  // and then load template.

  async loadSelectedTemplate(file = null) {
    // NOTE: Schema Name vs Template Name:
    // Example:
    // "template_path": "canada_covid19/CanCOGeN Covid-19",
    // "schema_name": "canada_covid19",       // left side of template path
    // "template_name": "CanCOGeN Covid-19",  // right side of template path
    //
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
        // We need to get template name from first Container attributes'
        // class's range.
        // TO DO: Future proof by determine which container attribute class
        // has a range pointing to class which doesn't depend on any other
        // classes. That is one to load.
        if (!template_name && 'Container' in schema.classes) {
          Object.entries(schema.classes.Container.attributes).forEach(
            ([class_name, class_obj]) => {
              if (class_obj.range in schema.classes) {
                template_name = class_obj.range;
              }
            }
          );
        }
        this.context.export_formats = {};
      } catch (err) {
        console.error(err);
        return null;
      }

      // TODO: implement template_path, schema_name to make the loader types consistent
      // The "local" part is a fake folder but is used in AppContext.js reload()
      return { template_path: `local/${template_name}`, schema };
    };

    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      const [schema_folder, template_name] = template_path.split('/');
      const schema = await this.getSchema(schema_folder, template_name);

      return { template_path, schema };
    };

    let loadResult = file ? await loadFromFile(file) : await loadFromMenu();
    if (!loadResult) return;
    let { template_path, schema } = loadResult;

    // RELOAD THE INTERFACE BY INTERACTING WITH THE CONTEXT

    console.log('reload 3: loadSelectedTemplate');
    this.context
      .reload(template_path, null, file ? schema : null)
      .then(this.restartInterface.bind(this));

    // SETUP MODAL EVENTS
    $(document).on('dhCurrentChange', (event, extraData) => {
      this.setupSectionMenu(extraData.dh);
      // Jump to modal as well
      this.setupJumpToModal(extraData.dh);
      this.setupFillModal(extraData.dh);
    });

    // INTERNATIONALIZE THE INTERFACE
    // Interface manually controlled via language pulldown.
    //i18next.changeLanguage('default');
    $(document).localize();
  }

  updateGUI(dh, template_name) {
    $('#template_name_display').text(template_name);
    $('#file_name_display').text('');
    const selectExportFormat = $('#export-to-format-select');
    selectExportFormat.children(':not(:first)').remove();
    Object.entries(this.context.export_formats).forEach(([option, details]) => {
      if (!details.pertains_to || details.pertains_to.includes(template_name)) {
        selectExportFormat.append(new Option(option, option));
      }
    });

    const currentTranslationVal = $('#select-translation-localization').val();
    const translationSelect = $('#select-translation-localization').empty();
    for (const { nativeName, langcode } of Object.values(
      findLocalesForLangcodes(Object.keys(interface_translation))
    )) {
      translationSelect.append(new Option(nativeName, langcode));
    }
    if (currentTranslationVal) {
      translationSelect.val(currentTranslationVal);
      //
      // DEPRECATE: no need to refresh the translation select since the languages are taken from a global list
      // it's up to the templates to ensure all the languages are supported
      //
      // translationSelect.trigger('input');
    } else {
      translationSelect.val('en');
    }

    const helpSop = $('#help_sop');
    const template_classes =
      this.context.template.schema.classes[template_name];
    if (template_classes && template_classes.see_also) {
      helpSop.attr('href', template_classes.see_also).show();
    } else {
      helpSop.hide();
    }

    this.setupJumpToModal(dh);
    this.setupSectionMenu(dh);
    this.setupFillModal(dh);
    this.hideValidationResultButtons();
  }

  setupFillModal(dh) {
    const fillColumnInput = $('#fill-column-input').empty();

    // Initialize the selectize input field for column selection
    fillColumnInput.selectize({
      valueField: 'title',
      labelField: 'title',
      searchField: ['title'],
      openOnFocus: true,
    });

    // Set up the modal opening event to clear and refresh the options dynamically
    $('#fill-modal').on('shown.bs.modal', () => {
      // Ensure the selectize input is fully cleared before loading new options
      const selectizeInstance = fillColumnInput[0].selectize;
      selectizeInstance.clear(); // Clear the current selection
      selectizeInstance.clearOptions(); // Clear all options
      selectizeInstance.clearCache(); // Clear the cache for proper updating

      // Add new options from the data harmonizer
      selectizeInstance.addOption(dh.slots);

      // Reset the value input field
      const fillValueInput = $('#fill-value-input');
      fillValueInput.val(''); // Clear any previously entered values

      // Open the selectize dropdown
      selectizeInstance.open();
    });

    // Set up the click event for the fill button
    $('#fill-button').on('click', () => {
      const column = fillColumnInput.val();
      const value = $('#fill-value-input').val();

      // Trigger the fillColumn function with the selected column and value
      dh.fillColumn(column, value);

      // Hide the modal after filling the column
      $('#fill-modal').modal('hide');
    });
  }

  setupJumpToModal(dh) {
    const columnCoordinates = dh.getColumnCoordinates();

    // Initialize and reset the jump-to input field
    let jumpToInput = $('#jump-to-input').empty();
    jumpToInput.selectize({
      openOnFocus: true,
    });

    // Set up the modal opening event to clear and refresh the options dynamically
    $('#jump-to-modal').on('shown.bs.modal', () => {
      const selectizeInstance = jumpToInput[0].selectize;

      // Ensure the selectize input is fully cleared before loading new options
      selectizeInstance.clear(); // Clear the current selection
      selectizeInstance.clearOptions(); // Clear all options
      selectizeInstance.clearCache(); // Clear the cache for proper updating

      // Add new options using the columnCoordinates
      selectizeInstance.addOption(
        Object.keys(columnCoordinates).map((col) => ({
          text: col,
          value: col,
        }))
      );

      // Open the selectize dropdown
      selectizeInstance.open();
    });

    // Set up the change event for handling the jump-to functionality
    $('#jump-to-input').on('change', (e) => {
      if (!e.target.value) return; // If no value is selected, do nothing

      const columnX = columnCoordinates[e.target.value];

      // Scroll to the selected column position
      dh.scrollTo(0, columnX);

      // Hide the modal after the selection is made
      $('#jump-to-modal').modal('hide');
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

  // NOT USED UNLESS LOADING FILE?
  async _defaultGetSchema(schemaName) {
    return this.menu[schemaName].schema;
  }

  // NOT USED UNLESS LOADING FILE?
  // Default Toolbar function getting exportFormats suitable for chosen template.
  async _defaultGetExportFormats(schemaName) {
    return this.context.export_formats;
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
