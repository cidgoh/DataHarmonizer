/* Top toolbar for File|Settings|Validate|Help|Template|Language menu.
 *
 * To enable DH multilingual locales: remove "display:none" from toolbar.html
 * translation_label button group.
 *
 * DH 1-many functionality is enabled at bottom of AppContext.js
 *
 */

import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui/dist/themes/base/jquery-ui.css';

import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import '@selectize/selectize';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';
import nestedProperty from 'nested-property';
import {isEmpty, deleteEmptyKeyVals, isEmptyUnitVal, setJSON} from '../lib/utils/general';
import YAML from 'yaml';
import {
  exportFile,
  exportJsonFile,
  readFileAsync,
  updateSheetRange,
  exportWorkbook,
  modifySheetRow,
} from '../lib/utils/files';

import { MULTIVALUED_DELIMITER} from '../lib/utils/fields';
import { takeKeys, invert } from '../lib/utils/objects';
import { findBestLocaleMatch } from '../lib/utils/templates';
import { processYamlSchema, fetchAndProcessYaml } from '../lib/utils/schema_induction';
import { dhAlert } from '../lib/utils/dialog';
import { utils as XlsxUtils, read as xlsxRead} from 'xlsx/xlsx.js';
import { FieldMapper, findHeaderRow } from '../lib/FieldMapper';
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
    this.urlLoadedSchemas = {};
    this.staticAssetPath = options.staticAssetPath || '';
    this.getSchema = options.getSchema || this._defaultGetSchema;
    this.getExportFormats =
      options.getExportFormats || this._defaultGetExportFormats;
    this.getLanguages = options.getLanguages || this._defaultGetLanguages;
    context.toolbar = this;
    // Memory of field mapping form content so it can be reset:
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

    this.initializeLocale();

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
    this.updateTemplateOptions(options.templatePath);

    // Load default (or URL specified) template
    this.loadSelectedTemplate();

  }

  initializeLocale() {

    const translationSelect = $('#select-translation-localization').empty();
    for (const { nativeName, langcode } of Object.values(
      findLocalesForLangcodes(Object.keys(interface_translation))
    )) {
      translationSelect.append(new Option(nativeName, langcode));
    }

    translationSelect.on('input', async () => {
      const language_update =
        translationSelect.val() !== 'en' ? translationSelect.val() : 'default';

      i18next.changeLanguage(language_update);

      const current_template = this.context.appConfig.template_path;
      const forced_schema_for_locale = current_template.startsWith('local/')
        ? this.context.template.default.schema
        : null;

      // Cache data before reload() wipes all DH instances.
      // Cells store locale-neutral .text codes so no translation is needed.
      const dataCache = {};
      for (const dh in this.context.dhs) {
        dataCache[dh] = this.context.dhs[dh].hot.getData();
      }

      // Use schema locale overlay only if the template supports this locale;
      // pass null to reload() for unsupported locales so the default schema is used.
      const targetLocale = findBestLocaleMatch(this.context.template.locales, [
        language_update,
      ]);

      await this.context.reload(current_template, targetLocale, forced_schema_for_locale);

      // Restore data into the rebuilt DH instances.
      for (const dh in this.context.dhs) {
        if (dataCache[dh] !== undefined) {
          this.context.dhs[dh].hot.loadData(dataCache[dh]);
        }
      }

      const initialDh = this.context.getCurrentDataHarmonizer();
      this.setupSectionMenu(initialDh);
      this.setupJumpToModal(initialDh);
      this.setupFillModal(initialDh);
    });
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
    $('#upload-template-input').on('change', this.uploadTemplate.bind(this));

    // SCHEMA EDITOR
    // Load a DH schema.yaml file into this slot.
    // Prompt user for schema file name.
    $('#schema_expert').on('click', () => {
      let expert_user = $('#schema_expert').is(':checked');
      this.context.expert_user = expert_user;
      $(SCHEMA_EDITOR_EXPERT_TABS).toggle(expert_user);
    });

    $('#schema_upload').on('change', (event) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event2) => {
        if (reader.error) {
          dhAlert("Schema file was not found" + reader.error.code);
          return false;
        }
        else {
          self.context.schemaEditor.loadSchemaYAML(event2.target.result);
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
    $('#load-schema-url-confirm-btn').on('click', async () => {
      const url = $('#load-schema-url-input').val().trim();
      $('#load-schema-url-err-msg').text('');
      if (!url) {
        $('#load-schema-url-err-msg').text('Please enter a URL.');
        return;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const text = await response.text();
        $('#load-schema-url-modal').modal('hide');
        self.context.schemaEditor.loadSchemaYAML(text);
      } catch (e) {
        $('#load-schema-url-err-msg').text(`Failed to load: ${e.message}`);
      }
    });

    $('#load-template-url-confirm-btn').on('click', async () => {
      const url = $('#load-template-url-input').val().trim();
      $('#load-template-url-err-msg').text('');
      if (!url) {
        $('#load-template-url-err-msg').text('Please enter a URL.');
        return;
      }
      try {
        const schema = await fetchAndProcessYaml(url);
        const menuEntry = this._buildMenuEntryFromSchema(schema, url);
        if (!menuEntry) return;
        $('#load-template-url-modal').modal('hide');
        const folder = menuEntry.folder;
        const firstTemplateName = Object.keys(menuEntry.templates)[0];
        const template_path = `${folder}/${firstTemplateName}`;
        this.updateTemplateOptions(template_path);
        this.loadSelectedTemplate();
      } catch (e) {
        $('#load-template-url-err-msg').text(`Failed to load: ${e.message}`);
      }
    });

    $('#load-schema-editor-button').on('click', () => {
        this.$selectTemplate.val('schema_editor/Schema').change();
        this.loadSelectedTemplate(); 
    });

    $('#save-template-button').on('click', () => {
      this.context.schemaEditor.saveSchema();
    });
    
    // DATA FILE
    $('#new-dropdown-item, #clear-data-confirm-btn').on(
      'click',
      this.createNewFile.bind(this)
    );
    $('#open-file-input').on('change', this.openDataFile.bind(this));
    $('#save-as-dropdown-item').on('click', () => this.showSaveAsModal());
    $('#save-as-json-use-index').on('change', this.toggleJsonIndexKey);
    $('#save-as-confirm-btn').on('click', this.saveDataFile.bind(this));
    $('#save-as-modal').on('hidden.bs.modal', this.resetSaveAsModal);
    $('#save-as-modal').on('show.bs.modal', () => this._updateSaveOptions());
    $('#file-ext-save-as-select').on('change', () => this._updateSaveOptions());
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
    $('#clear-all-tab-filters-dropdown-item').on('click', this.clearAllTabFilters.bind(this));
    $('#next-error-button').on('click', this.locateNextError.bind(this));
    $('#validate-btn').on('click', this.validate.bind(this));
    $('#help_reference').on('click', this.showReference.bind(this));

    // Future: move to SchemaEditor
    $('#translation-save').on('click', this.translationUpdate.bind(this));
    $('#translation-form-button').on('click', () => {
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
    $('#report_select_type').on('change', () => {
      let dh = this.context.getCurrentDataHarmonizer();
      dh.context.refreshTabDisplay();
    });

    // Keep HOT tabMoves in sync with the "Validate by column" checkbox.
    $('#validate_by_column').on('change', () => {
      const tabMoves = $('#validate_by_column').is(':checked')
        ? { row: 1, col: 0 }  // Tab moves down (column-first)
        : { row: 0, col: 1 }; // Tab moves right (row-first, HOT default)
      for (const dh of Object.values(this.context.dhs)) {
        dh.hot.updateSettings({ tabMoves });
      }
    });

  };

  /************************** Top Level Menu Commands ************************/

  async loadGettingStartedModalContent() {
    const modalContainer = $('#getting-started-carousel-container');
    if (!modalContainer.html()) {
      const { getGettingStartedMarkup } = await import(
        './toolbarGettingStarted'
      );
      modalContainer.html(getGettingStartedMarkup());
    }
  };

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
  };

  // Load Toolbar dialogue with all menu.json display:true template names
  // and paths.  If given template_path is among them, then ensure that one
  // is selected (otherwise default is to load first one in menu).
  updateTemplateOptions(template_path = null) {
    this.$selectTemplate.empty();
    let found_schema_editor = false;
    // There can be a case where no templates are available because display
    // == false for all of them.
    for (const [, schema_obj] of Object.entries(this.menu)) {
      // malformed entry if no 'templates' attribute
      const schema_folder = schema_obj.folder;
      const templates = schema_obj['templates'] || {};
      for (const [template_name, template_obj] of Object.entries(templates)) {
        const path = schema_folder + '/' + template_name;
        if (path == 'schema_editor/Schema') {
          found_schema_editor = true;
        }
        const label = Object.keys(templates).length == 1
            ? template_name : path;
        if (template_obj.display === true) {
          this.$selectTemplate.append(new Option(label, path));
          if (path == template_path) {
            this.$selectTemplate.val(path);
          }
        }
      }
    }
    
    // Hide Schema Editor options if no schema_editor/Schema on menu.
    $('#load-schema-editor-button, #schema-editor-menu').toggle(found_schema_editor);

  };

  async uploadTemplate() {
    const dh = this.context.getCurrentDataHarmonizer();
    const file = $('#upload-template-input')[0].files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'json' && ext !== 'yaml') {
      this.showError(
        'upload-template',
        'Please upload a template schema.json or schema.yaml file'
      );
    } else {
      await this.loadSelectedTemplate(file);
      $('#upload-template-input')[0].value = '';
      dh.clearValidationResults();
      dh.current_selection = [null, null, null, null];
    }
  };

  // Future: create clearTable() option that clears dependent tables too.
  createNewFile(e) {
    const dh = Object.values(this.context.dhs)[0]; // First dh.
    const isNotEmpty = dh.hot.countRows() - dh.hot.countEmptyRows();
    if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
      $('#clear-data-warning-modal').modal('show');
    } else {
      for (let [dependent_name] of this.context.relations[dh.template_name].dependents.entries()) {
        clearDH(this.context.dhs[dependent_name]);
      }
      clearDH(dh);
      $('#file_name_display').text('');
    }
  };

  // INITIALIZATIN: Triggers only for loaded top-level template, rather than
  // any dependent.
  restartInterface(myContext) {
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
        `Only ${this.file_extensions.join(', ')} files are supported`
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
      loaded = this.openJSONDataFile(file)
      this.restartInterface(this.context); // To handle possible locale change
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
  * JSON and .xls/.xlsx are formats that contains schema URI that data pertains
  * to.  For JSON this can have the extra step of requesting users to load the 
  * schema if it isn't already loaded.
  * As well it has the "in_language" locale code, and its Container class holds
  * attributes object that lists data for one or more templates / Classes.
  * THIS IS GETTING A SCHEMA RELOAD JUST BECAUSE OF A POTENTIAL LANGUAGE CHANGE
  * AS PROVIDED IN JSON DATA FILE in_language="...".
    {
      "schema": "https://example.com/folder",
      "version": "x.y.z",
      "in_language": "en",
      "container": {(class table name): [{row 1 object}, {row 2 object}, ...], ...}
    }
  */
  async openJSONDataFile(file) {

    const contentBuffer = await readFileAsync(file);
    let jsonData;
    try {
      jsonData = JSON.parse(contentBuffer.text);
    } 
    catch (error) {
      throw new Error('Invalid JSON data', error);
    }
    
    // Validate whether data file has minimum necessary Schema components.
    // Future: change .schema label to .schema_uri
    const metaDataFields = ['schema', 'version', 'in_language', 'container'];
    const matches = metaDataFields.filter(element => !(element in jsonData)).toString();
    if (matches) {
      dhAlert(`The JSON data file's metadata is not compatible for loading! Missing fields: ${matches}`);
      return false;
    };

    /**
     * If a JSON file is being loaded, it's schema uri must match its schema
     * uri to the current loaded schema. Check loaded schema, but if not there,
     * lookup in menu. Then if provided, load schema in_language locale.
     * 
     * Future: automate detection of json file schema via menu datastructure.
     * In which case template_path below has to be changed to match.
     */
    const schema = this.context.getSchemaRef();
    if (jsonData.schema != schema.id) {
      dhAlert(`The data schema template file "${jsonData.schema}" needs to be loaded first before this data file can be loaded.  \n\nSelect the template, either by selecting it in the template menu, or by using the "Upload Template" option.`);
      return false;
    };

    // Does interface language switch to match data content
    this.check_locale(jsonData.in_language); 

    const template_path = this.context.appConfig.template_path;
    // e.g. canada_covid19/CanCOGeN_Covid-19
    await this.context.reload(template_path, jsonData.in_language) // an AppContext.js call

    // First construct a set of data tables from input file's perspective
    const raw_data = {}; // data[table]{header:..., data:...}
    const messages = [];

    /**
     * The JSON file should have one or more tables in it that match to loaded
     * schema. The data is usually *sparse*, so we have to read ALL keys per
     * row to determine if they are new, and recreate data as 
     */
    for (const [template_name, dh] of Object.entries(this.context.dhs)) {

      const data = jsonData.container[dh.container_name];
      if (!data) {
        messages.push(`The LinkML schema "${schema.name}" template "${template_name}" has NO corresponding table in the uploaded data file.  The data file's tabs or tables are: "${Object.keys(jsonData.container)}".  Consequently, no data will be loaded.  Either a new table has been added to schema, or the wrong schema is loaded.\n`);
        continue;
      }

      /**
       * JSON rows are sparse objects (only keys with values are included).
       * Collect all unique field names across all rows to build the header,
       * then convert each row-object to a value-array aligned to that header.
       * This makes JSON data compatible with the same tabular loading pipeline.
       */
      const header = [];
      data.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (!header.includes(key)) header.push(key);
        });
      });

      // Convert each sparse row-object to a dense array of values.
      // Array-valued fields (multivalued slots stored as JSON arrays) are
      // joined with MULTIVALUED_DELIMITER so they match the tabular format.
      const data_matrix = data.map((row) => header.map((field) => {
        const val = row[field] ?? null;
        return Array.isArray(val)
          ? val.filter(v => v != null && v !== '').map(v => String(v).trim()).join(MULTIVALUED_DELIMITER)
          : val;
      }));

      // JSON data SHOULD USE slot_names BUT some test files have slot_titles.
      const matches = header.filter((element) => dh.slot_names.includes(element) || dh.slot_titles.includes(element)).length;
      // raw_data only contains templates that match incoming data tables.
      raw_data[template_name] = {
        header: header,
        data: data_matrix,
        matches: matches,
        table_name: dh.container_name
      }

    };
    if (messages.length) {
      await dhAlert(messages.join('\n'));
    }

    // JSON is now saved with locale titles for enum fields.  Reverse-map
    // those titles back to .text codes before handing off to FieldMapper,
    // because the KeyValueListEditor stores and validates against .text codes.
    for (const [template_name, raw] of Object.entries(raw_data)) {
      const dh = this.context.dhs[template_name];
      if (!dh) continue;
      // Build title→text lookup per enum column
      const titleToText = {};
      raw.header.forEach((slot_name) => {
        const col_idx = dh.slot_name_to_column[slot_name];
        const slot = col_idx !== undefined ? dh.slots[col_idx] : null;
        if (!slot?.merged_permissible_values) return;
        const map = {};
        Object.values(slot.merged_permissible_values).forEach((pv) => {
          if (pv.title && pv.title !== pv.text) map[pv.title] = pv.text;
        });
        if (Object.keys(map).length) titleToText[slot_name] = map;
      });
      // Apply reverse maps; handle multivalued (semicolon-delimited) cells
      raw.data = raw.data.map((row) =>
        row.map((value, col_idx) => {
          if (!value || typeof value !== 'string') return value;
          const reverseMap = titleToText[raw.header[col_idx]];
          if (!reverseMap) return value;
          if (value.includes(MULTIVALUED_DELIMITER)) {
            return value.split(MULTIVALUED_DELIMITER)
              .map((v) => reverseMap[v] ?? v)
              .join(MULTIVALUED_DELIMITER);
          }
          return reverseMap[value] ?? value;
        })
      );
    }

    this.loadTabularData(file, raw_data);
    return true;
  }

  /**
   * FUTURE: read in "Schema" tab in the workbook to get the schema, version,
   * and locale information. Currently its assumed that loaded data should fit
   * pre-loaded schema.
   */
  async openTabularDataFile(file) {
    let workbook;
    const messages = [];

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
    }

    // First construct a set of data tables from input file's perspective
    const raw_data = {}; // data[table]{header:..., data:...}

    for (const [template_name, dh] of Object.entries(this.context.dhs)) {

      let sheet_name = dh.getSpreadsheetName(workbook); // relevant to given dh.
      if (!sheet_name) {
        messages.push(`The LinkML schema "${this.context.getSchemaRef().name}" template "${template_name}" has NO corresponding table in the uploaded data file.  The data file's tabs or tables are: "${workbook.SheetNames}".  Consequently, no data will be loaded.  Either a new table has been added to schema, or the wrong schema is loaded.\n`);
        continue;
      }

      const worksheet = updateSheetRange(workbook.Sheets[sheet_name]);
      // Load data pretending that header row is first row, but it is usually
      // on 2nd row.
      // 1 = first row contains header and output is array of arrays. 
      // 0 = ditto, and output is objects; 
      // [array of strings] = these become headers, and sheet data starts at row 0
      const matrix = XlsxUtils.sheet_to_json(worksheet, {header: 1, raw: false, range: 0});

      // Calculate REAL headerRow - usually it is 2nd row of tsv/csv/xlsx data):
      const [header_row, matches] = findHeaderRow(dh, matrix);

      // A DH template/tab had NO fields matching to respective data table!
      // It is possibly a new table in schema and so will be allowed in as
      // an empty table.
      if (header_row < 1 || matches === 0) {
        messages.push(`The LinkML schema "${this.context.getSchemaRef().name}" template "${template_name}" has NO header row OR NO matching fields with the corresponding data file tab or table. This DH tab table will be empty.\n`);
        continue;
      }

      // raw_data only contains templates which were matched to incomming
      // data tables.  Data starts at calculated header row.
      raw_data[template_name] = {
        header: matrix[header_row-1], // an array of [{field_name: value}...]
        data: matrix.slice(header_row),
        matches: matches,
        table_name: sheet_name
      }

    };

    if (messages.length) {
      await dhAlert(messages.join('\n'));
    }

    this.loadTabularData(file, raw_data);
    return true;
  }

  /* Here raw_data might not have right field headers, so it is tested against
   * loaded schema, and any missmatches trigger popup display of fields for
   * user to review and map. Tables without mismatches are loaded immediately.
   * Tables with missmatches are loaded after users field map (if any) is
   * established.
   */
  loadTabularData(file, raw_data) {

    const fieldMapper = new FieldMapper(this.context, file, raw_data);

    /** 
     * Examine data file for content appropriate for each tab in DH, loading
     * in order provided by schema. No need to add this dh to fieldMapper if: 
     * 
     * 1) all data fields have been matched to template. In this scenario
     *    template might have some new fields which will be empty on load.
     * 2) Some data fields haven't matched, but all the matches complete
     *    the template.
     * 
     * Field content requirements are managed by validation system elsewhere.
     */
    Object.entries(this.context.dhs).forEach(([template_name, dh]) => {
      let data = raw_data[template_name];
      if (!data) return;
      // 29, 34 total, 173 fields total.
      //console.log("MATCHES",data.matches,data.header.length,dh.slots.length);
      const needs_modal = (data.matches != data.header.length) && (data.matches != dh.slots.length);
      // Always compute slot_to_data_col_matches; only build modal HTML when needed.
      fieldMapper.appendFieldMappingModal(dh, needs_modal);
    });

    if (fieldMapper.field_mapping_html) {
      // The specify headers modal displays incongruities in ALL DH tab field
      // mapping. It is appended to when problem spotted in mapping below.
      // FieldMapper will hot.loadData tables from revised mapping.
      fieldMapper.renderFieldMappingModal();
      this.context.runBehindLoadingScreen(fieldMapper.show);
    }
    else {
      // No issues with field mapping so load all the data.
      fieldMapper.loadMappedData();
    }

  }

  // Localize the DOM app interface to same language as the data file.
  // Requires translation file to have given data file locale.
  check_locale(language = 'en') {
    const i18nextLang = language === 'en' ? 'default' : language;
    if (i18nextLang !== i18next.language) {
      i18next.changeLanguage(i18nextLang);
      $('#select-translation-localization').val(language);
      $(document).localize();
    }
  }

  /***************************** SAVE DATA FILES ****************************/

  /**
   * Updates save-option defaults whenever the format selector changes or the
   * modal opens.  JSON forces slot.name headers and code-key picklist values;
   * non-JSON defaults depend on the active locale.
   */
  _updateSaveOptions() {
    const ext = $('#file-ext-save-as-select').val();
    const isJson = ext === 'json';
    const $localeSelect = $('#select-translation-localization');
    const lang = $localeSelect.val();

    // Column headers: force Name + visually disable for JSON
    $('#save-header-options input').prop('disabled', isJson);
    $('#save-header-options').css('opacity', isJson ? 0.5 : 1);
    if (isJson) {
      $('#save-header-name').prop('checked', true);
    } else {
      $('#save-header-title').prop('checked', true);
    }

    // Picklist: also disable all choices for JSON
    $('#save-picklist-options input').prop('disabled', isJson);
    $('#save-picklist-options').css('opacity', isJson ? 0.5 : 1);

    // Picklist defaults
    if (isJson) {
      $('#save-picklist-code').prop('checked', true);
    } else {
      $('#save-picklist-locale').prop('checked', true);
    }

    // Update locale label text with the active locale name
    const selectedText = $localeSelect.find('option:selected').text() || lang || 'Locale';
    $('#save-picklist-locale').closest('label').contents().filter(function () {
      return this.nodeType === 3;
    }).last().replaceWith(` Label (${selectedText})`);
  }

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

    const saveOptions = {
      headerFormat:   $('input[name="save-header-format"]:checked').val()   || 'title',
      picklistFormat: $('input[name="save-picklist-format"]:checked').val() || 'locale_label',
    };

    const container_datasets = this.getContainerData(ext, saveOptions);

    if (ext === 'json') {
      this.saveJSONDataFile(container_datasets, baseName, ext);
    }

    // Here we process .xlsx, .xls, .tsv, .csv
    else {
      this.saveTabularDataFile(container_datasets, baseName, ext, lang);
    }

    $('#save-as-modal').modal('hide');
  }

  async saveJSONDataFile(container_datasets, baseName, ext) {
    const schema = this.context.template.default.schema;
    const JSONFormat = {
      schema: schema.id,
      version: schema.version,
      in_language: schema.in_language || 'en',
      container: container_datasets
    };

    // Clear out empty values in each Container attribute's content (an
    // array of given LinkML class's objects)
    for (const class_name in JSONFormat.container) {
      for (const row in JSONFormat.container[class_name]) {
        const obj = JSONFormat.container[class_name][row];
        deleteEmptyKeyVals(obj);
      };
    }

    await this.context.runBehindLoadingScreen(exportJsonFile, [
      JSONFormat,
      baseName,
      ext,
    ]);
  }

  async saveTabularDataFile(container_datasets, baseName, ext, lang = 'en') {

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
    let MultiEntityWorkbook = XlsxUtils.book_new();

    // Loop through each sheet in the DH combined container datasets
    for (const container_name in container_datasets) {
      // Convert data to an array of arrays for xlsx
      const xlsx_table = XlsxUtils.json_to_sheet(container_datasets[container_name]);
      // Add the worksheet to the workbook
      XlsxUtils.book_append_sheet(MultiEntityWorkbook, xlsx_table, container_name);
      // Behaviour different for xlsx vs tsv files etc?
      if (!(container_datasets[container_name].length > 0)) {
        modifySheetRow(
          MultiEntityWorkbook,
          container_name,
          this.context.dhs[container_table_names[container_name].range].slot_names,
          -1 // Signals to insert a row
        );
      }
      // 1 row of section headers
      modifySheetRow(
        MultiEntityWorkbook,
        container_name,
        sectionCoordinatesByClass[container_name],
        -1
      );
    }

    // Add Schema tab for exell outputs
    if (ext == 'xlsx' || ext == 'xls') {
      const schema = this.context.template.default.schema;
      const container_table_list = Object.keys(schema.classes?.Container?.attributes || {}).join(';');
      const activeLocale = (lang && lang !== 'default') ? lang : (schema.in_language || 'en');
      const xlsx_table = [
        ["id", "name", "version", "in_language", "container"],
        [schema.id, schema.name, schema.version, activeLocale, container_table_list]
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
   * but may be more arbitrary. They are used directly in JSON and xls/xlsx
   * output.
   * 
   * Look through a schema Container's attributes and for each one, if it is
   * a loaded DH template/tab, return an array of rows where each is a DH 
   * instance.
   * 
   * @param {String} ext - file type, which influences controls how column
   *        headers should be named.
   */
  getContainerData(ext, options = {}) {
    const { headerFormat = 'title', picklistFormat = 'locale_label' } = options;
    // JSON always uses slot.name; for tabular, respect the headerFormat option.
    const useNameHeader = ext === 'json' || headerFormat === 'name';

    let Container = {};

    // A schema's defined Container class where details of which classes to
    // include in one or one-to-many tabular data saved format are contained.
    const container_attributes =
      this.context.template.default.schema.classes.Container.attributes;

    // Loop that processes container tables
    for (const [attribute_name, attribute] of Object.entries(container_attributes)) {

      if (!attribute.range || !this.context.dhs[attribute.range]) {
        console.warn(`Schema Container attribute "${attribute_name}" has no .range pointing to schema class.`);
        continue;
      }

      const dh = this.context.dhs[attribute.range]
      const table = [];

      // Loop through each row of DH tab data and create a structure that
      // includes all slot keys. row is an object with indexes 0, 1 ... for each column

      for (const row of dh.hot.getSourceData()) {
        // Ignore empty rows
        if (isEmpty(row)) // || row.every((val) => val === null)
          continue;

        // row_dict for JSON is minimalist dictionary - only filled fields
        // All other formats include full tabular column list
        let row_dict = {};
        if (ext !== 'json') {
          Object.values(dh.slots).forEach((slot) => {
            row_dict[useNameHeader ? slot.name : slot.title] = '';
          });
        }

        // Helper: resolve a stored _id code to the requested picklist output format.
        const getEnumValue = (_value, slot) => {
          if (picklistFormat === 'code') return _value;
          return this.getValueByNameOrTitle(_value, slot.merged_permissible_values);
        };

        // Iterate over the columns in a row
        Object.entries(row).forEach(([index, value]) => {
          const slot_name = dh.slot_names[index];
          const slot = dh.slots[dh.slot_name_to_column[slot_name]];
          let new_value = value;
          if (!isEmptyUnitVal(value)) { // 'undefined' / null / '';

            // If a slot has sources it means one of its ranges is a picklist.
            if (slot.sources) {
              // Case where we should save array for json.
              if (slot.multivalued === true) {
                new_value = value.split(MULTIVALUED_DELIMITER) // An array
                .map((_value) => getEnumValue(_value, slot));
                // Convert new_value to a string unless json and > 1 value
                // in which case keep it as array.
                if (ext !== 'json' || new_value.length < 2 ) {
                  new_value = new_value.join(MULTIVALUED_DELIMITER);
                }
              }
              else {
                new_value = getEnumValue(value, slot);
              }
            }

            /** A slot might have a menu selection such as a null value above.
             * But it might also be a number like age, or boolean. HANDLE
             * conversion of numbers and booleans by slot datatype.
            */
            new_value = setJSON(new_value, slot.datatype);

          }

          row_dict[useNameHeader ? slot_name : slot.title] = new_value;

        })
        // Append to table.
        table.push(row_dict);

      } // End of DH data row processing.

      Container[attribute_name] = table;

    };

    return Container
  }

  /**
   * Looks up a permissible value by its _id key and returns its display title,
   * falling back to the .text code if no title is defined.
   * @param {string} value - the stored _id / .text code
   * @param {Object} value_list - slot.merged_permissible_values or slot.default_merged_permissible_values
   */
  getValueByNameOrTitle(value, value_list) {
    if (isEmpty(value_list)) return value;
    if (!(value in value_list)) return value;
    return value_list[value].title || value_list[value].text;
  }

/*
export function titleOverText(enm) {
  try {
    return typeof enm.title !== 'undefined' ? enm.title : enm.text;
  } catch (e) {
    console.error(e, enm);
  }
}
*/

  showSaveAsModal() {
    const dh = this.context.getCurrentDataHarmonizer();
    if (!$.isEmptyObject(dh.invalid_cells)) {
      $('#save-as-invalid-warning-modal').modal('show');
    } else {
      $('#save-as-modal').modal('show');
    }
  }

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
    if (event.target.id === 'show-all-rows-dropdown-item') {
      this.clearCurrentTabFilters();
    }
    dh.changeRowVisibility(event.target.id);
  }

  clearCurrentTabFilters() {
    const dh = this.context.getCurrentDataHarmonizer();
    const filtersPlugin = dh.hot.getPlugin('filters');
    if (filtersPlugin.isEnabled()) {
      filtersPlugin.clearConditions();
      filtersPlugin.filter();
      // filter() calls hot.render() internally, but filtersRowsMap.clear() can
      // trigger an intermediate render while the TrimmingMap is still in flux.
      // A second render here runs after the map is fully settled, so
      // toPhysicalRow() is stable and afterRenderer re-applies validation CSS
      // to any newly-revealed cells.
      dh.hot.render();
    }
  }

  clearAllTabFilters() {
    $('#report_select_type').val('all').trigger('change');
  }

  // Needs to be revised - unclear when row index is being referenced, or an
  // entire row
  locateNextError() {
    const dh = this.context.getCurrentDataHarmonizer();
    let focus_row = dh.current_selection[0];
    let focus_col = dh.current_selection[1];

    if (Object.keys(dh.invalid_cells).length === 0) {
      // No errors to navigate.
      return;
    }

    // invalid_cells is keyed by physical row. Build a visual-row view so that
    // navigation coordinates match what scrollTo() and current_selection expect.
    // Skip rows that are trimmed (filters plugin, toVisualRow → null) OR hidden
    // (hiddenRows plugin — they have a visual index but aren't rendered).
    const hiddenPhysRows = new Set(
      dh.hot.getPlugin('hiddenRows').getHiddenRows()
    );
    const visual_invalid = {};
    for (const [physRowStr, cols] of Object.entries(dh.invalid_cells)) {
      const physRow = Number(physRowStr);
      if (hiddenPhysRows.has(physRow)) continue;
      const vRow = dh.hot.toVisualRow(physRow);
      if (vRow != null) visual_invalid[vRow] = cols;
    }
    const all_rows = Object.keys(visual_invalid).sort((a, b) => Number(a) - Number(b));

    if (all_rows.length === 0) {
      // All error rows are hidden or trimmed — guide the user to reveal them.
      $('#hidden-errors-message').stop(true, true).show().delay(8000).fadeOut('slow');
      return;
    }

    if ($('#validate_by_column').is(':checked')) {
      // Column-first: scan down each column, then advance to the next column.
      // Build col_index: { colNum: [visualRowNum, ...] } sorted ascending.
      const col_index = {};
      for (const [vRow, cols] of Object.entries(visual_invalid)) {
        for (const col of Object.keys(cols)) {
          const c = Number(col);
          if (!col_index[c]) col_index[c] = [];
          col_index[c].push(Number(vRow));
        }
      }
      const all_cols = Object.keys(col_index).map(Number).sort((a, b) => a - b);
      for (const c of all_cols) {
        col_index[c].sort((a, b) => a - b);
      }

      if (focus_row === null) {
        focus_col = all_cols[0];
        focus_row = col_index[focus_col][0];
      } else {
        const col_rows = col_index[Number(focus_col)];
        if (col_rows) {
          // Try to advance to the next error row in the same column.
          const next_rows = col_rows.filter((r) => r > Number(focus_row));
          if (next_rows.length) {
            focus_row = next_rows[0];
          } else {
            // Bottom of this column — move to the next column (wrap to first).
            const next_cols = all_cols.filter((c) => c > Number(focus_col));
            focus_col = next_cols.length ? next_cols[0] : all_cols[0];
            focus_row = col_index[focus_col][0];
          }
        } else {
          // Current column has no errors — jump to the nearest column that does.
          const next_cols = all_cols.filter((c) => c > Number(focus_col));
          focus_col = next_cols.length ? next_cols[0] : all_cols[0];
          focus_row = col_index[focus_col][0];
        }
      }
    } else {
      // Row-first (original behaviour): scan across columns within a row,
      // then advance to the next row.
      const error1_row = all_rows[0];
      if (focus_row === null) {
        focus_row = error1_row;
        focus_col = Object.keys(visual_invalid[focus_row])[0];
      } else {
        const rows = all_rows.filter((row) => row >= focus_row);

        if (focus_row == rows[0]) {
          let cols = Object.keys(visual_invalid[focus_row]);
          cols = cols.filter((col) => col > focus_col);
          if (cols.length) {
            focus_col = parseInt(cols[0]);
          } else {
            focus_row = rows.length > 1 ? rows[1] : error1_row;
            focus_col = Object.keys(visual_invalid[focus_row])[0];
          }
        } else {
          focus_row = rows.length ? rows[0] : error1_row;
          let inv_focus = visual_invalid[focus_row];
          if (inv_focus)
            focus_col = Object.keys(inv_focus)[0];
          else focus_col = 0;
        }
      }
    }

    dh.scrollTo(focus_row, focus_col);
  }

  async validate() {
    const context = this.context;
    // Dismiss any lingering "hidden rows invalid" message from a previous state.
    $('#hidden-errors-message').stop(true, true).hide();

    await context.runBehindLoadingScreen(async () => {
      for (const [class_name, dh] of Object.entries(context.dhs)) {
        await dh.validate();

        const $tabLink = $(`#tab-bar-${class_name} > a`);
        if (Object.keys(dh.invalid_cells).length > 0) {
          $tabLink.addClass('tab-has-errors');

          // If errors exist on hidden rows the user cannot see them; switch
          // to "All records" view so every error is visible.
          const hiddenRowsPlugin = dh.hot.getPlugin('hiddenRows');
          const hiddenRows = new Set(hiddenRowsPlugin.getHiddenRows());
          const hasErrorOnHiddenRow = Object.keys(dh.invalid_cells)
            .some((row) => hiddenRows.has(Number(row)));
          if (hasErrorOnHiddenRow) {
            dh.changeRowVisibility('show-all-rows-dropdown-item');
          }
        } else {
          $tabLink.removeClass('tab-has-errors');
        }
      }
    });

    const dh = context.getCurrentDataHarmonizer();
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
    dhAlert(message, { title: 'Error' });
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
      let schema;
      try {
        const contentBuffer = await readFileAsync(file);
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext === 'yaml') {
          // Parse and induce the schema from a raw YAML file using the same
          // logic as the browser runtime (linkml:types injection + class induction).
          schema = processYamlSchema(contentBuffer.text);
        } else {
          schema = JSON.parse(contentBuffer.text);
        }

        // If the top-level object has a 'Container' key the file is a data
        // export, not a schema — reject it early.
        if (schema.Container) {
          dhAlert("This doesn't appear to be a DataHarmonizer schema!  Cancelling upload.");
          return null;
        }

        this.context.export_formats = {};
      } catch (err) {
        console.error(err);
        return null;
      }

      // Use the same tree_root detection and menu-registration logic as URL
      // loading so the dropdown is updated identically in both cases.
      const menuEntry = this._buildMenuEntryFromSchema(schema, `file://${file.name}`);
      if (!menuEntry) return null;

      const folder = menuEntry.folder;
      const firstTemplateName = Object.keys(menuEntry.templates)[0];
      const template_path = `${folder}/${firstTemplateName}`;
      this.updateTemplateOptions(template_path);

      return { template_path, schema, useForced: true };
    };

    const loadFromMenu = async () => {
      const template_path = this.$selectTemplate.val();
      if (!template_path) {
        dhAlert("Error: loadFromFile() was unable to load a default schema because no schemas or templates exist or have a display:true setting (in /web/templates/menu.json)");
        return false;
      }
      const [schema_folder, template_name] = template_path.split('/');
      // URL-loaded schemas are cached in memory; pass as forced_schema so
      // Template.create() doesn't attempt a server fetch for a non-existent folder.
      const cachedSchema = this.urlLoadedSchemas[schema_folder];
      if (cachedSchema) {
        return { template_path, schema: cachedSchema, useForced: true };
      }
      const schema = await this.getSchema(schema_folder, template_name);
      return { template_path, schema };
    };

    // If given a file, load that, otherwise select first menu item
    let loadResult = file ? await loadFromFile(file) : await loadFromMenu();
    if (!loadResult) return;
    let { template_path, schema, useForced } = loadResult;

    // Error checking: if menu lists a class name that no longer exists in LinkML spec
    // then alert user (developer) of issue, and return without change.
    const [, template_name] = template_path.split('/');
    
    if (!(template_name in schema.classes)) {
      dhAlert(`Warning: The requested schema template ${template_path} could not be loaded. If present in the menu.json file, its entry likely needs to be updated by a DataHarmonizer schema maintainer.`);
      return;
    }

    // RELOAD THE INTERFACE BY INTERACTING WITH THE CONTEXT
    // For menu loads (file === null), don't pass forced_schema: Template.create
    // will fetch the schema fresh from the server, preserving all locale data
    // embedded in schema.extensions.locales. Passing forced_schema for menu
    // loads caused buildTemplateFromUploadedSchema() to strip locales, making
    // the first language switch silently fail (supportsLocale = false).
    console.log('reload 3: loadSelectedTemplate');
    this.context
      .reload(template_path, null, (file || useForced) ? schema : null)
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
    let expert_user = $('#schema_expert').is(':checked');
    $('#schema-editor-menu').toggle(schema_editor);
    $(SCHEMA_EDITOR_EXPERT_TABS).toggle(expert_user);
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

  // Note: HandsonTable won't advance to column if table has empty rows; no workaround to this.
  setupJumpToModal(dh) {
    const columnCoordinates = dh.getColumnCoordinates();

    // Initialize and reset the jump-to input field
    let jumpToInput = $('#jump-to-input').empty();
    jumpToInput.selectize({
      openOnFocus: true,
    });

    // Set up the modal opening event to clear and refresh the options dynamically
    $('#jump-to-modal').off().on('shown.bs.modal', () => {
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
    $('#jump-to-input').off().on('change', (e) => {
      if (!e.target.value) return; // If no value is selected, do nothing

      const columnX = columnCoordinates[e.target.value];
      // Scroll to the selected column position
      //dh.scrollTo(0, columnX);
      dh.hot.selectColumns(columnX, columnX)

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

  /**
   * Builds and registers a menu entry from a URL-fetched schema.
   * Determines tree_root classes, handles name collisions with _1/_2 suffixes,
   * adds the entry to this.menu, and caches the schema in this.urlLoadedSchemas.
   * Returns the new menu entry object, or null if no tree_root classes found.
   */
  _buildMenuEntryFromSchema(schema, sourceUrl) {
    // Determine tree_root classes via:
    // 1) annotations.tree_root.value === true  (preferred LinkML annotation)
    // 2) tree_root === true                    (bare boolean shorthand)
    // 3) is_a === 'dh_interface'               (legacy DH convention)
    // Container and dh_interface are always excluded — they are structural
    // classes and never correspond to a displayable DH template tab.
    let treeRootClasses = Object.entries(schema.classes || {})
      .filter(([name, cls]) =>
        name !== 'Container' &&
        name !== 'dh_interface' &&
        (
          cls.annotations?.tree_root?.value === true ||
          cls.tree_root === true ||
          cls.is_a === 'dh_interface'
        )
      )
      .map(([name]) => name);

    // Fallback: Container attribute ranges — root has no foreign_key slots
    if (treeRootClasses.length === 0 && 'Container' in schema.classes) {
      const containerRanges = [];
      Object.entries(schema.classes.Container.attributes || {}).forEach(([, cls_attr]) => {
        if (cls_attr.range in schema.classes) containerRanges.push(cls_attr.range);
      });
      const rootClass =
        containerRanges.find((range) =>
          !Object.values(schema.classes[range]?.attributes || {}).some(
            (attr) => attr.annotations?.foreign_key
          )
        ) || containerRanges[0];
      if (rootClass) treeRootClasses = [rootClass];
    }

    if (treeRootClasses.length === 0) {
      dhAlert(
        'No tree_root classes could be determined from this schema.\n' +
        'Expected classes with tree_root:true, is_a:dh_interface, or a Container class.'
      );
      return null;
    }

    // Unique schema key — handle collisions with _1, _2, … suffixes
    const baseName = schema.name || 'url_schema';
    let schemaKey = baseName;
    let suffix = 1;
    while (schemaKey in this.menu) {
      schemaKey = `${baseName}_${suffix++}`;
    }

    // Locales declared in schema.extensions.locales
    const localeKeys = Object.keys(schema.extensions?.locales?.value || {});

    const templates = {};
    for (const className of treeRootClasses) {
      templates[className] = { name: className, display: true };
    }

    const menuEntry = {
      folder: schemaKey,
      id: schema.id || sourceUrl,
      version: schema.version || '',
      templates,
      ...(localeKeys.length ? { locales: localeKeys } : {}),
    };

    this.menu[schemaKey] = menuEntry;
    this.urlLoadedSchemas[schemaKey] = schema;

    return menuEntry;
  }

  // NOT USED UNLESS LOADING FILE?
  // Default Toolbar function getting exportFormats suitable for chosen template.
  async _defaultGetExportFormats(_schemaName) {
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


/**
 * Clears out data from a dataharmonizer instance. preserve_settings = 
 * boolean flag which keeps settings. The "Data > New" menu option clears
 * these out. Settings may be reset as well, which may be good
 * for reloading of data from a data file?
 */
export function clearDH(dh, preserve_settings = false) {
  dh.clearValidationResults();
  dh.current_selection = [null, null, null, null];
  if (preserve_settings)
    dh.hot.clear(); // only clears the data
  else
    dh.hot.updateSettings({data : []}); // Clears all settings in the table as well as data.
};

/** 
 * Using browser "localStorage" to have settings that persist with user.
 */
export function readBrowserDHSettings() {
  let dh_settings_yaml = localStorage.getItem('dataharmonizer_settings');
  if (!dh_settings_yaml) {
    // Provide basic shell of all DH browser-based settings here
    return {'schema' : {}}
  }
  return YAML.parse(dh_settings_yaml);
}

export function saveBrowserDHSettings(dh_settings) {
  localStorage.setItem('dataharmonizer_settings', YAML.stringify(dh_settings));
}

// Option to clear out localStorage 'dataharmonizer_settings'
export function deleteBrowserDHSettings() {
  localStorage.removeItem('dataharmonizer_settings');
}

export default Toolbar;
