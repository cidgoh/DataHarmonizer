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
const nestedProperty = require('nested-property');
import {read as xlsxRead} from 'xlsx/xlsx.js';
import {isEmpty, deleteEmptyKeyVals} from '../lib/utils/general';
import YAML from 'yaml';
import {
  exportFile,
  exportJsonFile,
  readFileAsync,
  updateSheetRange,
  createWorkbookFromJSON,
  exportWorkbook,
  prependToSheet,
} from '../lib/utils/files';
import { nullValuesToString, isEmptyUnitVal } from '../lib/utils/general';
import { MULTIVALUED_DELIMITER, titleOverText, dataObjectToArray} from '../lib/utils/fields';
import { takeKeys, invert } from '../lib/utils/objects';
import {
  findBestLocaleMatch,
  //  templatePathForSchemaURI,
  rangeToContainerClass,
  LocaleNotSupportedError,
} from '../lib/utils/templates';
import { utils as XlsxUtils} from 'xlsx/xlsx.js';
import { findLocalesForLangcodes, interface_translation } from './utils/i18n';
import i18next from 'i18next';

import template from './toolbar.html';
import './/toolbar.css';

import { menu } from 'schemas';
import pkg from '../package.json';

const VERSION = pkg.version;
const SCHEMA_EDITOR_EXPERT_TABS = '#tab-bar-Prefix, #tab-bar-UniqueKey, #tab-bar-Annotation, #tab-bar-EnumSource, #tab-bar-Extension';

class Toolbar {
  constructor(root, context, options = {}) {
    this.file_extensions = ['xlsx', 'xls', 'tsv', 'csv', 'json'];
    this.context = context;
    this.root = root;
    this.menu = menu;
    this.staticAssetPath = options.staticAssetPath || '';
    this.getSchema = options.getSchema || this._defaultGetSchema;
    this.getExportFormats =
      options.getExportFormats || this._defaultGetExportFormats;
    this.getLanguages = options.getLanguages || this._defaultGetLanguages;
    context.toolbar = this;
    // Memory of field mapping form content so it can be reset:
    this.field_mapping_html = ''; 
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
        // EFFICIENCY: move ${this.context.getCurrentDataHarmonizer().hot
        // OUT OF LOOP.
        return dataHarmonizerData.map((row, row_index) => {
          return row.map((value, index) => {
            // Only translate if the value exists and it's marked as translatable
            if (value && isTranslatable[index]) {
              console.warn(`translating ${value} at ${index}`);
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
          //'folder' in schema_obj &&
          schema_obj.folder === schema_folder && template_name in schema_obj.templates
        ) {
          this.$selectTemplate.val(options.templatePath);
        }
      }
    }
    this.loadSelectedTemplate();
  }

  // Should fire only once per screen load/reload.
  bindEvents() {
    const self = this;

    $('#getting-started-modal').on(
      'show.bs.modal',
      this.loadGettingStartedModalContent
    );
    // TEMPLATE LOADING
    $('#select-template-load').on('click', () => this.loadSelectedTemplate());
    //    $('#view-template-drafts').on('change', () => this.updateTemplateOptions());
    $('#upload-template-input').on('change', this.uploadTemplate.bind(this));

    // SCHEMA EDITOR
    // Load a DH schema.yaml file into this slot.
    // Prompt user for schema file name.
    $('#schema_expert').on('click', (event) => {
      let expert_visibility = $('#schema_expert').is(':checked');
      $(SCHEMA_EDITOR_EXPERT_TABS).toggle(expert_visibility);
    });

    $('#schema_upload').on('change', (event) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event2) => {
        if (reader.error) {
          alert("Schema file was not found" + reader.error.code);
          return false;
        }
        else {
          this.context.getCurrentDataHarmonizer().loadSchemaYAML(event2.target.result);
        }
        // reader.readyState will be 1 here = LOADING
      });
      // reader.readyState should be 0 here.
      // files[0] has .name, .lastModified integer and .lastModifiedDate
      if (event.target.files[0]) {
        reader.readAsText(event.target.files[0]);
      }
      $("#schema_upload").val('');

    })
    $('#load-schema-editor-button').on('click', (event) => {
        this.$selectTemplate.val('schema_editor/Schema').change();
        this.loadSelectedTemplate(); 
    });

    $('#save-template-button').on('click', (event) => {
      this.context.getCurrentDataHarmonizer().saveSchema();
    });
    
    // DATA FILE
    $('#new-dropdown-item, #clear-data-confirm-btn').on(
      'click',
      this.createNewFile.bind(this)
    );
    $('#open-file-input').on('change', this.openDataFile.bind(this));
    $('#save-as-dropdown-item').on('click', () => this.showSaveAsModal());
    /*
    $('#file-ext-save-as-select').on(
      'change',
      this.toggleJsonOptions.bind(this)
    );
    */
    $('#save-as-json-use-index').on('change', this.toggleJsonIndexKey);
    $('#save-as-confirm-btn').on('click', this.saveDataFile.bind(this));
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

    $('#translation-save').on('click', this.translationUpdate.bind(this));

    $('#translation-form-button').on('click', (event) => {
      this.context.getCurrentDataHarmonizer().translationForm();
    });

    $('#search-field').on('keyup', (event) => {
      // https://handsontable.com/docs/javascript-data-grid/searching-values/
      let dh = this.context.getCurrentDataHarmonizer();
      const search = dh.hot.getPlugin('search');
      dh.queryResult = search.query(event.target.value); // Array of (row, col, text)
      dh.hot.render();
      $('#previous-search-button, #next-search-button').toggle(dh.queryResult.length>0)
    });

    $('#previous-search-button, #next-search-button')
      .hide()
      .on('click', this.searchNavigation.bind(this));

    // Slot tab will pay attention to selected schema by 
    // default, but it is possible to select from all schemas, all tables, and/or slot groups.
    // See appcontext tabChange() for actions after initialization;
    $('#report_select_type').on('change', (event) => {
      let dh = this.context.getCurrentDataHarmonizer();
      dh.context.refreshTabDisplay();
    });

    /**************** DataHarmonizer User Profiles stored in Browser **********
     * In the future, a profile can exist for each user with respect to
     * DataHarmonizer usage in general by storing/loading that profile in 
     * browser's long term storage, to control settings like favoured language,
     * default schema and template, etc.
     * 
     * With respect to particular schemas and data files, the "schema_mapping" 
     * part of a profile enables users to craft basic rules about loading 
     * single or 1-m DH files in and transforming them so they line up to DH 
     * Schema slots.  This is aside from https://pypi.org/project/linkml-map/
     * that does this and more on command line.  This interface is simple
     * in looks and capability - mainly its here to handle changes in ordering 
     * and renaming of fields, such that one could upgrade a schema and 
     * discover that if existing data files are read into it directly then
     * columns of info are missing.
     * 
     * A general user-defined profile could have parts that particular DH forms
     * etc. are influenced by.  So far we just have a field_mapping section 
     * that is responded to.
     * 
     * localStorage "DataHarmonizer" stores all objects via a YAML string.
     *    - DataHarmonizer.schema = {} object holding schema name keys. Current
     *        loaded schema name key will be added if working on field-mappings. 
     *       - .schema[schema_name]: (unlikely for schema name to change)
     *           - [profile_name] (user defined; useful to include version)
     * //            - schema_version: [schema_version] (optional)
     * //            - file: [file1, file2, etc...] (pertinent data file names)
     *             - mapping: {rule1, rule2, ...}
     * 
     * use between a schema and target filename(s). A default name
     *        "[schema_name]_[schema_version] to [data_file_name] is suggested
     *        if only one file is involved.
     */

    /**************************** Field Mapping Modal ************************
     * See also: initFieldMappingModal(), renderFieldMappingModal()
     */

    /** 
     * If switching to a new profile when on the field-mapping form:
     * - load it in text area
     * - copy it to field-mapping-name
     * - implement it in combined drag & drop table list of data file fields.
     */
    $('#field-mapping-select').change((e) => {
      const profile_name = $('#field-mapping-select').val();
      if (profile_name.length > 0) {
        const [dh_settings, profile] = this.getProfile(profile_name);
        this.renderFieldMappingProfile(profile_name, profile);
      }
    });

    $("#field-mapping-concise-checkbox").change(function(){
      self.conciseFieldMappingModal($(this).is(':checked'));
    });

    // "Forgets" selected user-specified profile by erasing it in localStorage.
    // This doesn't affect maping rendered in form.
    $('#field-mapping-delete-btn').click(() => {
      const profile_name = $('#field-mapping-select').val();
      if (profile_name) {
        const dh_settings = this.readBrowserDHSettings();
        const schema = this.getSchemaRef();
        if (dh_settings.schema[schema.name]?.[profile_name])
          delete(dh_settings.schema[schema.name][profile_name]);
        this.saveBrowserDHSettings(dh_settings);
        $(`#field-mapping-select option[value="${profile_name}"]`).remove();
        $('#field-mapping-display').text('');
        $('#field-mapping-name').val('');
      }
      else {
        alert("No mapping profiles are currently set up yet.")
      }
      $('#field-mapping-delete-btn').prop('disabled', true); // Disable delete button until next selection.
    });

    $('#field-mapping-save-btn').click(() => {
      const profile_name = $('#field-mapping-name').val().trim(); // trim whitespace
      $('#field-mapping-name').val(profile_name)
      if (profile_name) {
        this.updateProfileMapping(profile_name); // profile object updated in-situ.
        const [dh_settings, profile] = this.getProfile(profile_name);
        this.renderFieldMappingProfile(profile_name, profile);
      }
      else {
        alert("No mapping profiles are currently set up yet.")
      }
    });

    // A reset button redoes the mapping content back to previous copy.
    $('#field-mapping-reset-btn').click(() => {
      this.renderFieldMappingModal();
      // Clear out Custom Mapping Library too?
    });

    // Indicates user is finished with field mapping adjustments, so try
    // loading the file again.
    $('#specify-headers-confirm-btn').click(() => {

      $('#field-mapping-modal').modal('hide');
      /*
        self.hot.loadData(
          self.matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2))
        );
        if (mappedMatrixObj.unmappedHeaders.length) {
          const unmappedHeaderDivs = mappedMatrixObj.unmappedHeaders.map(
            (header) => `<li>${header}</li>`
          );
          $('#unmapped-headers-list').html(unmappedHeaderDivs);
          $('#unmapped-headers-modal').modal('show');
        }
       */
    });

  }

  getSchemaRef() {return this.context?.template?.default?.schema}

  // Provides alot of .schema[schema name][profile] data structure
  // initializations if not yet accessed.
  getProfile(profile_name) {
    const dh_settings = this.readBrowserDHSettings();
    const schema = this.getSchemaRef();
    if (!('schema' in dh_settings))
      dh_settings.schema = {};
    if (!(schema.name in dh_settings.schema))
      dh_settings.schema[schema.name] = {};
    if (!(profile_name in dh_settings.schema[schema.name])) {
      dh_settings.schema[schema.name][profile_name] = {
        version: schema.version,
        mapping: {}
      }
    }
    return [dh_settings, dh_settings.schema[schema.name][profile_name]];
  };

  // Update field mapping form with user's selected dh_settings.schema[schema_name][profile_name]
  renderFieldMappingProfile(profile_name, profile) {
    $('#field-mapping-name').val(profile_name);

    $('#field-mapping-display').text(YAML.stringify({[profile_name]: profile}));
    //$('#field-mapping-display').text(YAML.stringify(dh_settings);
    if (!$(`#field-mapping-select option[value="${profile_name}"]`).length) {
      const newOption = new Option(profile_name, profile_name);
      $('#field-mapping-select').append(newOption) //.select();
    }
    $('#field-mapping-delete-btn').prop('disabled', false);

    this.renderFieldMappingModal(profile_name);

  }


  // Creates data structure based on user's moves to create mappings
  updateProfileMapping(profile_name) {
    const [dh_settings, profile] = this.getProfile(profile_name);
    let mapping = [];
    let template_name = '';
    function get_label (nmstr) {const i = nmstr.indexOf(' ')+1; return (i ? nmstr.slice(i) : '')};
    // In each tbody section that has a template_name, look for any td which
    // has a "field-mismatch" attribute in first column.  That will be slot
    // name of schema/template.
    $('table#field-mapping-table tbody').each((t_index, tbody) => {
      const template_name = $(tbody).attr('data-template');
      const template_section = $(tbody).attr('data-section');
      if (template_name) {
        $(tbody).find('td:first-child.field-mismatch').each((index, slot_field) => {
          // Retrieve labels, get past column id) prefix;
          const slot_label = get_label($(slot_field).text()); 
          const data_label = get_label($(slot_field).next('td').text());
          if (data_label.length > 0) // target has a mapping in it.
            mapping.push({
              'template': template_name,
              'section': $(tbody).attr('data-section'),
              'from': slot_label,
              'to': data_label
            });
        })
      }

    });

    profile['mapping'] = mapping;
    this.saveBrowserDHSettings(dh_settings);
  }

  // Using browser "localStorage" to have settings that persist with user.
  // Might also need: localStorage.removeItem('dataharmonizer_settings');
  readBrowserDHSettings() {
    let dh_settings_yaml = localStorage.getItem('dataharmonizer_settings');
    if (!dh_settings_yaml) {
      // Provide basic shell of all DH browser-based settings here
      return {'schema' : {}}
    }
    return YAML.parse(dh_settings_yaml);
  }

  saveBrowserDHSettings(dh_settings) {
    localStorage.setItem('dataharmonizer_settings', YAML.stringify(dh_settings));
  }

  /************************** Top Level Menu Commands ************************/
  // User spreadsheet selection on a given dh tab 
  regenerate_select(slotDH, tab, domID, slot_name) {
    const select = $(domID)[0];
    if (!select) {
      console.log("At regenerate_select(), but no dom element: ", domID)
      return;
    }
    const dict = {};
    let dh = slotDH.context.dhs[tab];
    const data = dh.hot.getDataAtCol(dh.slot_name_to_column[slot_name]);
    if (data) {
      data.forEach((value) => {
        if (value && !(value in dict)) {
          dict[value] = true;
          select.add(new Option(value, value));
          /*
          select.clear(); // Clear the current selection
          select.clearOptions(); // Clear all options
          select.clearCache(); // Clear the cache for proper updating

          // Add new options using the columnCoordinates
          select.addOption(
            Object.keys(columnCoordinates).map((col) => ({
              text: value,
              value: value,
            }))
          );
          */
        }
      });
    }
    else {
      console.log('NOT FOUND', slot_name, 'in', tab)
    }
    
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

  // Move forward or backwards through search results.
  // Don't use jquery td.current etc. selectors - non-existent if not visible.
  searchNavigation(event) {
    let direction = $(event.target).is('#next-search-button') ? 1 : -1;
    let dh = this.context.getCurrentDataHarmonizer();
    if (!dh.queryResult?.length) return;
    let current = dh.current_selection;
    let ptr;
    if (current[0] === null)
      ptr = 0; // If no current item, focus on first result.
    else {
      ptr = dh.queryResult.findIndex((e) => e.row == current[0] && e.col == current[1]);
      if (ptr === undefined) {
        ptr = 0; // Also start at beginning.
      }
      else {
        ptr = ptr + direction;
        if (ptr < 0)
          ptr = dh.queryResult.length-1;
        else if (ptr >= dh.queryResult.length)
          ptr = 0;
      }
    }
    let item = dh.queryResult[ptr];
    dh.scrollTo(item.row, item.col);
  }

  updateTemplateOptions() {
    this.$selectTemplate.empty();
    let found_schema_editor = false;
    for (const [schema_name, schema_obj] of Object.entries(this.menu)) {
      // malformed entry if no 'templates' attribute
      const templates = schema_obj['templates'] || {};
      for (const [template_name, template_obj] of Object.entries(templates)) {
        let path = schema_obj.folder + '/' + template_name;
        if (path == 'schema_editor/Schema')
          found_schema_editor = true;
        let label =
          Object.keys(templates).length == 1
            ? template_name
            : schema_obj.folder + '/' + template_name;
        if (template_obj.display) {
          this.$selectTemplate.append(new Option(label, path));
        }
      }
    }

    // Hide Schema Editor options if no schema_editor/Schema on menu.
    $('#load-schema-editor-button, #schema-editor-menu').toggle(found_schema_editor);

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
      await this.loadSelectedTemplate(file);
      $('#upload-template-input')[0].value = '';
      dh.clearValidationResults();
      dh.current_selection = [null, null, null, null];
    }
  }

  // Future: create clearTable() option that clears dependent tables too.
  createNewFile(e) {
    const dh = Object.values(this.context.dhs)[0]; // First dh.
    const isNotEmpty = dh.hot.countRows() - dh.hot.countEmptyRows();
    if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
      $('#clear-data-warning-modal').modal('show');
    } else {
      for (let [dependent_name] of this.context.relations[dh.template_name].dependents.entries()) {
        this.clearDH(dependent_name);
      }
      this.clearDH(dh.template_name);
      $('#file_name_display').text('');
    }
  }

  clearDH(class_name) {
    const dh = this.context.dhs[class_name];
    dh.clearValidationResults();
    dh.current_selection = [null, null, null, null];
    dh.hot.updateSettings({data : []});
  }

  // INITIALIZATIN: Triggers only for loaded top-level template, rather than
  // any dependent.
  restartInterface(myContext) {
    myContext.addTranslationResources(myContext.template);
    this.updateGUI(
      myContext.getCurrentDataHarmonizer(),
      myContext.getTemplateName()
    );
    let hot = myContext.getCurrentDataHarmonizer().hot;
    // By selecting first cell on reload, we trigger deactivation of dependent
    // tables that have incomplete keys wrt top-level class.
    hot.selectCell(0, 0);
    hot.deselectCell(); // prevent accidental edits.
    console.log('restartInterface with selectCell(0,0)');
  }

  /**
   * User clicks on "Data -> Open" menu item"
   */
  async openDataFile() {
    const file = $('#open-file-input')[0].files[0];
    if (!file) {
      // Happens when user cancels open action.
      return;
    }

    const file_parts = file.name.split('.');
    const ext = file.name.split('.').pop();

    if (!this.file_extensions.includes(ext)) {
      this.showError(
        'open',
        `Only ${acceptedExts.join(', ')} files are supported`
      );
      return;
    }

    // enables reload of file by same name (otherwise browser ignores) and
    // enable save by it too.
    $('#open-file-input')[0].value = ''; 
    $('#base-name-save-as-input').val(file_parts[0]);
    $('#file-ext-save-as-select').val(ext);

    console.log('reload 2: openDataFile');

    let loaded = false;
    if (ext === 'json') {
      loaded = this.openJSONDataFile(file);
    } 

    // Here we're loading tsv, csv, (just one template/class)
    // OR xls, xlsx (which can have a schema with multiple classes)
    else {
      loaded = this.openTabularDataFile(file);
    }

    if (loaded)
      $('#file_name_display').text(file.name);
  }    

  /** 
  * JSON is the only format that contains reference to schema to
  * utilize by "schema" URI, so it has the extra step of requesting
  * users to load the schema if it isn't already loaded.
  * As well it has the "in_language" locale code, and its Container class
  * contains template spec itself. It may have several dhs, one for each
  * Container class mentioned.
  * THIS IS GETTING A SCHEMA RELOAD JUST BECAUSE OF A POTENTIAL LANGUAGE CHANGE
  * AS PROVIDED IN JSON DATA FILE locale="...".
  * 
  * JSON Data file should be of form 
    {
      "schema": "https://example.com/folder",
      "version": "x.y.z",
      "in_language": "en",
      Container": {(class table name): [{row 1 object}, {row 2 object}, ...], ...}  
    }
  */
  async openJSONDataFile(file) {

    const translationSelect = $('#select-translation-localization');

    const contentBuffer = await readFileAsync(file);
    let jsonData;
    try {
      jsonData = JSON.parse(contentBuffer.text);
    } 
    catch (error) {
      throw new Error('Invalid JSON data', error);
    }
    
    // Validate whether data file has minimum necessary Schema components.
    // Future: change .schema to .schema_uri
    const metaDataFields = ['schema', 'version', 'in_language', 'Container'];
    const matches = metaDataFields.filter(element => !(element in jsonData)).toString();
    if (matches) {
      alert(`The JSON data file's schema is not compatible for loading! Missing fields: ${matches}`);
      return false;
    }

    // Localize the DOM app interface to same language as the data file.
    // Requires translation file to have given data file locale.
    let in_language = jsonData.in_language || 'en';
    if (in_language !== i18next.language) {
      i18next.changeLanguage(in_language === 'en' ? 'default' : in_language);
      translationSelect.val(i18next.language === 'en' ? 'default' : in_language);
      $(document).localize();
    }

    // If we're loading a JSON file, we have to match its schema uri to a
    // schema.  Check loaded schema, but if not there, lookup in menu.
    // Then if provided, load schema in_language locale.
    // Future: automate detection of json file schema via menu datastructure.
    // In which case template_path below has to be changed to match.
    if (jsonData.schema != this.context.template.default.schema.id) {
      alert(`The data schema template file "${jsonData.schema}" needs to be loaded first before this data file can be loaded.  \n\nSelect the template, either by selecting it in the template menu, or by using the "Upload Template" option.`);
      return false;
    }

    const template_path = this.context.appConfig.template_path;
    // e.g. canada_covid19/CanCOGeN_Covid-19
    await this.context //.context.reload() is an AppContext.js call
      .reload(template_path, in_language)
      .then((context) => {
        // The given JSON file may have one or more tables in it that match
        // up to loaded schema.
        // The data is possibly *sparse*. loadDataObjects() fills in missing values.
        Object.entries(context.dhs).forEach(([dh_name, dh]) => {
          const data = jsonData.Container[dh.container_name];
          let data_table = [];
          if (data)
            data.forEach((row) => {
              const dataArray = dataObjectToArray(row, dh,  { //false,
                serializedDateFormat: this.dateExportBehavior,
                dateFormat: this.dateFormat,
                datetimeFormat: this.datetimeFormat,
                timeFormat: this.timeFormat,
                translationMap:
                  in_language !== null
                    ? invert(i18next.getResourceBundle(in_language, 'translation'))
                    : undefined,
              });
              data_table.push(dataArray);
            });

          const list_data = dh.matrixFieldChangeRules(data_table);
//          if (list_data.length) 
          dh.hot.loadData(list_data);
//          else
//            alert(`Unable to fetch table data from JSON file {template_path} for {dh}`);
        })

        return context;
      }) // End await context
      .then(this.restartInterface.bind(this));

  }

  /**
   * Load data into table as an array of objects. The keys of each object are
   * field names and the values are the cell values.
   *
   * @param {Array<Object>} data table data
   */
  loadDataObjects(dh, data, locale = null) {
    // DATA WILL ALWAYS BE AN OBJECT VIA JSON LOAD WITH CLEARCUT CLASS
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      // An object was provided, so try to pick out the grid data from
      // one of it's slots.
      const inferredIndexSlot = this.getInferredIndexSlot(dh);

      if (inferredIndexSlot) {
        data = data[inferredIndexSlot];
      } else {
        const dataKeys = Object.keys(data);
        if (dataKeys.length === 1) {
          data = data[dataKeys[0]];
        }
      }
    }

    let listData = [];

    // Some tables won't even be mentioned in container if they've been added to schema.
    if (data)
      data.forEach((row) => {
        const dataArray = dataObjectToArray(row, dh,  { //false,
          serializedDateFormat: this.dateExportBehavior,
          dateFormat: this.dateFormat,
          datetimeFormat: this.datetimeFormat,
          timeFormat: this.timeFormat,
          translationMap:
            locale !== null
              ? invert(i18next.getResourceBundle(locale, 'translation'))
              : undefined,
        });
        listData.push(dataArray);
      });

    return listData
  }

  getInferredIndexSlot(dh) {
    if (dh.template_name) {
      return dh.template_name;
    }

    const classes = Object.values(this.schema.classes);
    const treeRootClass = classes.find((cls) => cls.tree_root);
    if (!treeRootClass) {
      console.warn(
        `While getting inferred index slot, could not find tree_root class.`
      );
      return;
    }
    const treeRootAttrs = Object.values(treeRootClass.attributes);
    const index_attrs = treeRootAttrs.filter(
      (attr) => attr.range === this.template_name
    );
    if (!index_attrs || index_attrs.length !== 1) {
      console.warn(
        `While getting inferred index slot, could not find single slot with range ${this.template_name} on tree_root class ${treeRootClass.name}.`
      );
      return;
    }
    return index_attrs[0].name;
  }

  /**  
   * We should extend this to have another tab in the workbook called "Schema"
   * which holds the schema, version, and language information.
   */
  async openTabularDataFile(file) {
    let workbook;
    try {      
      let contentBuffer = await readFileAsync(file);
      workbook = xlsxRead(contentBuffer.binary, {
        type: 'binary',
        raw: true,
        cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
        dateNF: 'yyyy-mm-dd', //'yyyy/mm/dd;@'
      });
    }
    catch (error) {
      throw new Error('Invalid spreadsheet data', error);
      return false;
    }

    var field_mapping_html = '';

    // Examine data file for content appropriate for each tab in DH,
    // loading in order provided by schema.
    for (const dh of Object.values(this.context.dhs)) {
      dh.invalid_cells = {};
      dh.current_selection = [null, null, null, null];
      dh.clearValidationResults();

      let sheet_name = dh.getSpreadsheetName(workbook);
      if (!sheet_name) {
        alert(`None of the data file table(s) "${workbook.SheetNames}" match to the loaded schema "${this.getSchemaRef().name}" templates. \n\nFirtst load the schema template, either by selecting it in the template menu, or by using the "Upload Template" option.`);
        return false;
      }

      const worksheet = updateSheetRange(workbook.Sheets[sheet_name]);
      // Load data with expectation of header:1 = first row contains header.
      const matrix = XlsxUtils.sheet_to_json(worksheet, {header: 1, raw: false, range: 0});

      // Fetch best headerRow, 
      const [header_row, schema_slot_count, matches] = dh.compareMatrixHeadersToGrid(matrix);
      //console.log("HEADERS", headerRow, schemaSlots, matches)

      if (header_row > 0 && schema_slot_count == matches) { 
        // Here all DH tab schema slots have matched so it is a clean load fieldwise.
        console.log("Loading spreadsheet tab", sheet_name, "into", dh.template.name);
        // Returns data by chopping 1 or 2 header rows off
        let data_table = matrix.slice(header_row); 
        let cleaned_data = dh.matrixFieldChangeRules(data_table);
        dh.hot.loadData(cleaned_data);

      } 
      else {
        // FUTURE: Go through process of mapping fields
        // For now: provide report of miss-matched fields
        // Note: this doesn't handle rare issue of source having duplicate column names.
        // matrix might not have section headers.
        const data_fields = matrix[header_row-1];
        field_mapping_html += dh.appendFieldMappingModal(data_fields);
        // Insert all of the above section html before end of mapping table.
      }
    }

    if (field_mapping_html) {
      // The specify headers modal displays incongruities in ALL DH tab field
      // mapping. It is appended to when problem spotted in mapping below.
      this.initFieldMappingModal(file.name, field_mapping_html);
      this.renderFieldMappingModal();
      $('#field-mapping-modal').modal('show'); 
      // Modal show is outside of above because "reset" button on form itself 
      // needs to re-call renderFieldMappingModal();
      // AWAIT THAT?
    }

  }

  initFieldMappingModal(file_name, field_mapping_html) {
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(file_name);
    // Store html so user can reset to it.
    this.field_mapping_html = field_mapping_html;
    // Populate schema mapping profiles. Keep first option instructions/prompt.
    $('#field-mapping-select options').slice(1).remove(); 
    const dh_settings = this.readBrowserDHSettings();
    const schema = this.getSchemaRef();
    if (!dh_settings.schema)
      dh_settings.schema = {};
    if (!(schema.name in dh_settings.schema))
      dh_settings.schema[schema.name] = {};
    Object.entries(dh_settings.schema[schema.name]).forEach(([name, value]) => {
      const newOption = new Option(name, name);
      $('#field-mapping-select').append(newOption);
    });

    // Provide default value for new mapping profile name
    // This is a suggested name, but users can change it.
    $('#field-mapping-delete-btn').prop('disabled', true);
    $('#field-mapping-name').val(`${schema.name}_${schema.version} to ${file_name}`);
  }


  /**
   * Assumes this.field_mapping_html holds html that can be reset to.
   * profile_name if any, points to browser-in-memory mapping profile
   * to implement.  Currently this is done in a crude way via textual
   * search and replace on the html.
   */
  renderFieldMappingModal(profile_name = null) {
    // Clears out previous mapping report
    $('#field-mapping-table tbody').remove();
    $('#field-mapping-table thead').after(this.field_mapping_html);
    // Sets the checkbox status to hide matched fields via CSS.
    this.conciseFieldMappingModal($("#field-mapping-concise-checkbox").is(':checked'));

    // A bit crude, but we recreate the mapping by moving td 
    // content around.  We don't care what the schema source or 
    // data field target rows are (they could have changed across
    // data file versions.  Just the names count.
    if (profile_name) {
      const [dh_settings, profile] = this.getProfile(profile_name);
      Object.entries(profile.mapping).forEach(([index, mapping]) => {
        // Find mapping.from text. mapping.from td will be accompanied
        // by an empty td.

        const mismatched_rows = $(`table#field-mapping-table tbody[data-template="${mapping.template}"] > tr.field-mismatch`);//[data-section="${mapping.section}"]

        // First fetch the 2nd data file field value
        const schema_data_td = $(mismatched_rows).find('td:eq(1)')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.to)});
        const schema_slot_td = $(mismatched_rows).find('td:first-child')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.from)}); 

        const source_data_td_text = $(schema_data_td).text();
        $(schema_data_td).text(''); // Clear out old data td side.
        $(schema_slot_td).next('td').text(source_data_td_text);

      });
    }


    // To enable drag-drop on newly-created elements in field-mapping-modal
    $(".draggable-mapping-item").draggable({
      containment: "#field-mapping-table", // but scroll inside field-mapping-container
      helper: 'clone',
      cursor: 'grab',
      axis: "y",
      drag: function(event, ui) { // scroll: true doesn't work on cloned div.
        var $scrollContainer = $("#field-mapping-container");
        var containerOffset = $scrollContainer.offset();
        var containerHeight = $scrollContainer.height();
        var draggableTop = ui.offset.top;
        var scrollAmount = 20; // Adjust scroll speed
        // Scroll down
        if (draggableTop + ui.helper.outerHeight() > containerOffset.top + containerHeight) {
          $scrollContainer.scrollTop($scrollContainer.scrollTop() + scrollAmount);
        }
        // Scroll up
        else if (draggableTop < containerOffset.top) {
          $scrollContainer.scrollTop($scrollContainer.scrollTop() - scrollAmount);
        }
      }
    });

    $(".draggable-mapping-item").droppable({
      accept: ".draggable-mapping-item", // Only accept elements with this class
      //activeClass: "ui-state-active",
      hoverClass: "ui-state-hover",
      drop: function(event, ui) {
        const source_text = ui.draggable[0].innerText;
        ui.draggable[0].innerText = event.target.innerText;
        event.target.innerText = source_text;
        $(this).css("background-color", "lightskyblue");
        ui.draggable.css("background-color", "lightblue"); 
      }
    });

  }

  // UI checkbox allows mapping form to be collapsed to just the rows that
  // have mismatch information.
  conciseFieldMappingModal(hide_flag) {
    const elements = $("table#field-mapping-table tr.field-match");
    const sections = $("table#field-mapping-table tbody.field-mapping-section:not(:has(td.field-mismatch))");
    if (hide_flag) {
      elements.hide();
      sections.hide();
    }
    else {
      elements.show();
      sections.show();
    }
  }

  /***************************** SAVE DATA FILES ****************************/

  // Save one tab, or 1-many tabs of data in format given by form controls.
  // FUTURE: Switch to file system API so can use file browser to select
  // target of save.  See 
  // https://code.tutsplus.com/how-to-save-a-file-with-javascript--cms-41105t
  async saveDataFile() {
    const baseName = $('#base-name-save-as-input').val();
    const ext = $('#file-ext-save-as-select').val();
    const lang = $('#select-translation-localization').val();
    if (!baseName) {
      $('#save-as-err-msg').text('Specify a file name');
      return;
    }

    const container_table_names =
      this.context.template.default.schema.classes.Container.attributes;

    const container_datasets = this.getContainerData(container_table_names, ext);

    if (ext === 'json') {
      this.saveJSONDataFile(container_datasets, lang, baseName, ext);
    } 

    // Here we process .xlsx, .xls, .tsv, .csv
    else {
      this.saveTabularDataFile(container_datasets, baseName, ext);
    }

    $('#save-as-modal').modal('hide');
  }

  async saveJSONDataFile(container_datasets, lang, baseName, ext) {
    const JSONFormat = {
      schema: this.context.template.schema.id,
//      location: this.context.template.location,
      version: this.context.template.schema.version,
      //in_language: lang === 'default' ? 'en' : lang,
      // Should container be capitalized?  Its an instance of "Container" class.
      Container: container_datasets
    };

    if (lang !== 'default') {
      JSONFormat.in_language = lang;
    }

    // Clear out empty values in each Container attribute's content (an
    // array of given LinkML class's objects)
    for (const class_name in JSONFormat.Container) {
      for (const row in JSONFormat.Container[class_name]) {
        const obj = JSONFormat.Container[class_name][row];
        deleteEmptyKeyVals(obj);
      };
    }

    await this.context.runBehindLoadingScreen(exportJsonFile, [
      JSONFormat,
      baseName,
      ext,
    ]);
  }

  async saveTabularDataFile(container_datasets, baseName, ext) {

    const container_table_names =
      this.context.template.default.schema.classes.Container.attributes;

    const sectionCoordinatesByClass = Object.values(this.context.dhs).reduce(
      (acc, dh) => {
        const sectionTiles = dh.sections.map((s) => s.title);
        const takeSections = takeKeys(sectionTiles);
        return Object.assign(acc, {
          [dh.container_name]: invert(
            takeSections(dh.getColumnCoordinates())
          ),
        });
      },
      {}
    );

    // The workbook is set up with Container tab names.
  //    let MultiEntityWorkbook = createWorkbookFromJSON(JSONFormat.Container);
    let MultiEntityWorkbook = XlsxUtils.book_new();

    // Loop through each sheet in the DH combined container datasets
    for (const container_name in container_datasets) {
      // Convert data to an array of arrays for xlsx
      const xlsx_table = XlsxUtils.json_to_sheet(container_datasets[container_name]);
      // Add the worksheet to the workbook
      XlsxUtils.book_append_sheet(MultiEntityWorkbook, xlsx_table, container_name);
      // Behaviour different for xlsx vs tsv files etc?
      if (!(container_datasets[container_name].length > 0)) {
        prependToSheet(
          MultiEntityWorkbook,
          container_name,
          this.context.dhs[container_table_names[container_name].range].slot_names
        );
      }
      // 1 row of section headers
      prependToSheet(
        MultiEntityWorkbook,
        container_name,
        sectionCoordinatesByClass[container_name]
      );
    }

    // Add Schema tab for exell outputs
    if (ext == 'xlsx' || ext == 'xls') {
      const schema = this.context.template.default.schema;
      const container_table_list = Object.keys(schema.classes?.Container?.attributes || {}).join(';');
      const xlsx_table = [
        ["id","name", "version", "in_language", "Container"], 
        [schema.id, schema.name, schema.version, schema.in_language, container_table_list]
      ];
      const ws = XlsxUtils.aoa_to_sheet(xlsx_table);
      XlsxUtils.book_append_sheet(MultiEntityWorkbook, ws, 'Schema');
    }

    // Saving one file here for xls, xlsx, or multiple files for tsv/csv
    await this.context.runBehindLoadingScreen(exportWorkbook, [
      MultiEntityWorkbook,
      baseName,
      ext,
    ]);
  }

  /** 
   * Returns dictionary of pertinent tab classes and their tabular row data.
   * Container's attribute names are usually plural forms of class names, 
   * but may be more arbitrary. They are used directly in JSON and xls/xlsx output.
   * 
   * @param {Object} container_table_names - A schema's defined Container class where details of which classes to include in one or one-to-many tabular data saved format are contained.
   * @param {String} ext - file type, which influences controls how column headers should be named.
   */
  getContainerData(container_table_names, ext) {

    /** 
     * Look through a schema Container's attributes and for each one, if it is
     * a loaded DH template/tab, return an array of rows where each 
     * that is a data harmonizer instance.  The following "name" and 
     * "range" attributes are matched directly.
     */

    console.log("SCHEMA CONTAINER", container_table_names)
    return Object.entries(container_table_names).reduce(
      // This fetches A container attribute's .name and .range as values
      (acc, [cls_key, { name, range }]) => {

        // If there is a DH tab for this range class name then output it\
        if (typeof range !== 'undefined' && this.context.dhs[range]) {
          const dh = this.context.dhs[range]

          // Given container class [attribute_name], fetch slots 
          const processedClass = {
            [name]: dh.tabDataToJSON()  // ClassDataRowSlotValues[range]
              .map((obj) => nullValuesToString(obj))
              .map((row_dict) => {                
                row_dict = Object.fromEntries(
                  Object.entries(row_dict).map(([slot_name, value]) => {
                    const slot = dh.slots[dh.slot_name_to_column[slot_name]];
                    let new_value = value;
                    if (!isEmptyUnitVal(value)) {

                      // Wasteful recalculation.
                      // Future: put this in column metadata.
                      const merged_permissible_values = slot.sources?.reduce(
                        (acc, source) => {
                          return Object.assign(
                            acc,
                            slot.permissible_values[source]
                          );
                        },
                        {}
                      ) || {};

                      // Case where we should save array for json.
                      if (slot.multivalued === true) {
                        new_value = value
                          .split(MULTIVALUED_DELIMITER)
                          .map((_v) => {
                            return this.getValueByNameOrTitle(_v, ext, merged_permissible_values);
                          });
                        // Convert new_value to a string unless json and > 1 value
                        // in which keep it as array
                        if (ext !== 'json' || new_value.length < 2 )
                          new_value = new_value.join(MULTIVALUED_DELIMITER);
                      } else {
                        new_value = this.getValueByNameOrTitle(value, ext, merged_permissible_values);
                      }
                    }

                    /** HANDLE conversion of numbers and booleans by slot 
                     * datatype. Such fields should not be multiselect. 
                     * They may have a metadata menu though.
                    */
                    if (slot.datatype === 'xsd:boolean') {
                      if (new_value === 'TRUE' || new_value === 'FALSE')
                        new_value = dh.setToBoolean(new_value);
                    }

                    // Currently only JSON format stores via native slot.name keys
                    // but thi could be made an option in the future.
                    if (ext === 'json')
                      return [slot_name, new_value];
                    else
                      return [slot.title, new_value];
                  })
                );
                return row_dict;
              }),
          };

          return Object.assign(acc, processedClass);
        } else {
          console.warn('Container entry has no range:', cls_key);
          return acc;
        }
      },// end of container class scan
      {}
    );
  }

  getValueByNameOrTitle (value, ext, value_list) {

    if (isEmpty(value_list))
      return value;

    if (!(value in value_list))
      console.warn(`${value} not in slot.sources`, value_list);

    return (value in value_list)
      ? ((ext === 'json') ? value : titleOverText(value_list[value]))
      : value;
  }

  showSaveAsModal() {
    const dh = this.context.getCurrentDataHarmonizer();
    if (!$.isEmptyObject(dh.invalid_cells)) {
      $('#save-as-invalid-warning-modal').modal('show');
    } else {
      $('#save-as-modal').modal('show');
    }
  }

  /*
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
  */

  toggleJsonIndexKey(evt) {
    $('#save-as-json-index-key').prop('disabled', !evt.target.checked);
  }

  resetSaveAsModal() {
    $('#save-as-err-msg').text('');
    // Questionable: To prevent quirk of javascript inability to save file by same 
    // name twice we have to clear out field and then put its contents back in.
    //const baseName = $('#base-name-save-as-input').val();
    //$('#base-name-save-as-input').val('').val(baseName);
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

    if (all_rows.length == 0) {
      // No error to find. 
      // Issue: user may have moved dh into hiding invalid rows.
      return;
    }

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
    //await dh.validate();//dh.validate().bind(dh);
    await this.context.runBehindLoadingScreen(dh.validate.bind(dh));

    if (Object.keys(dh.invalid_cells).length > 0) {
      $('#next-error-button').show();
      $('#no-error-button').hide();
    } else {
      $('#next-error-button').hide();
      $('#no-error-button').show().delay(5000).fadeOut('slow');
    }
  }

  /** Take translation modal edited rows and update this schema's locale
   * extension.
   */
  translationUpdate() {
    const schema = this.context.dhs.Schema;
    const locales = schema.hot.getCellMeta(schema.current_selection[0], 0).locales;

    for (let input of $("#translate-modal-content textarea")) {
      let path = $(input).data('path');
      let value = $(input).val();
      // path e.g. fr.enums.HostAgeUnitMenu.permissible_values.year.description
      nestedProperty.set(locales, path, value);
    }

    $('#translate-modal').modal('hide');
  }

  showReference() {
    const dh = this.context.getCurrentDataHarmonizer();
    dh.renderReference();
    // Prevents another popup on repeated click if user focuses away from
    // previous popup.
    return false;
  }

  showError(prefix, message) {
    $(`#${prefix}-err-msg`).text(message);
    $(`#${prefix}-error-modal`).modal('show');
  }

  hideValidationResults() {
    const dh = this.context.getCurrentDataHarmonizer();
    dh.clearValidationResults();
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

        if (schema.Container) {
          alert("This doesn't appear to be a DataHarmonizer schema!  Cancelling upload.")
          return null;
        }

        // Phasing this out in favour of Container.
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

    // Error checking: if menu lists a class name that no longer exists in LinkML spec
    // then alert user (developer) of issue, and return without change.
    const [schema_folder, template_name] = template_path.split('/');
    
    if (!(template_name in schema.classes)) {
      alert("Error: The schema template menu lists a template name that is not present in the schema.  The menu likely needs to be updated by a DataHarmonizer schema maintainer.");
      return;
    }

    // RELOAD THE INTERFACE BY INTERACTING WITH THE CONTEXT
    console.log('reload 3: loadSelectedTemplate');
    this.context
      .reload(template_path, null, schema)
      .then(this.restartInterface.bind(this));

    // SETUP MODAL EVENTS
    // moved to AppContext.js onDHTabChange event handler.
    /*
    $(document).on('dhCurrentChange', (event, extraData) => {
      const dh = extraData.dh;
      const class_name = dh.template_name;
      this.setupSectionMenu(dh);
      // Jump to modal as well
      this.setupJumpToModal(dh);
      this.setupFillModal(dh);
      dh.clearValidationResults();
      let dependent_report = dh.context.dependent_rows.get(class_name);
    //  await dh.filterByKeys(dh, class_name, dependent_report.fkey_vals);
      //dh.hot.render(); // Required to update picklist choices ????
    });
    */
    // INTERNATIONALIZE THE INTERFACE
    // Interface manually controlled via language pulldown.
    //i18next.changeLanguage('default');
    $(document).localize();


    // ISSUE: dhs aren't setup yet, due to asynchronous .reload() ???
    // Or it is that dh.context is getting overwritten too late.
  }

  updateGUI(dh, template_name) {
    //$('#template_name_display').text(template_name);
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
    if (template_classes?.see_also) {
      if (Array.isArray(template_classes.see_also))
        helpSop.attr('href', template_classes.see_also[0]).show();
      else
        helpSop.attr('href', template_classes.see_also).show(); 
    } else {
      helpSop.hide();
    }

    let schema_editor = this.context.getCurrentDataHarmonizer().schema.name === 'DH_LinkML';
    let expert_visibility = $('#schema_expert').is(':checked');
    $('#schema-editor-menu').toggle(schema_editor);
    $(SCHEMA_EDITOR_EXPERT_TABS).toggle(expert_visibility);
    $('#slot_report_control').hide();

    this.setupJumpToModal(dh);
    this.setupSectionMenu(dh);
    this.setupFillModal(dh);
    dh.clearValidationResults();
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
