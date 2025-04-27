import '@selectize/selectize';
import Handsontable from 'handsontable';
import SheetClip from 'sheetclip';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui/dist/themes/base/jquery-ui.css';
import { parse, stringify } from 'yaml'

import i18next from 'i18next';
import { utils as XlsxUtils, read as xlsxRead } from 'xlsx/xlsx.js';
import { renderContent, urlToClickableAnchor } from './utils/content';
import { readFileAsync, updateSheetRange } from '../lib/utils/files';
//import { findSlotNamesForClass } from '../lib/utils/templates';
import {
  isValidHeaderRow,
  isEmpty,
  rowIsEmpty,
  wait,
  stripDiv,
  isEmptyUnitVal,
} from '../lib/utils/general';
import { invert, deepMerge, looseMatchInObject } from '../lib/utils/objects';

import {
  changeCase,
  dataArrayToObject,
  dataObjectToArray,
  fieldUnitBinTest,
  formatMultivaluedValue,
  JSON_SCHEMA_FORMAT,
  KEEP_ORIGINAL,
  MULTIVALUED_DELIMITER,
  parseMultivaluedValue,
  titleOverText,
} from './utils/fields';

import {
  checkProvenance,
  itemCompare,
  validateValAgainstVocab,
  validateValsAgainstVocab,
} from './utils/validation';

import 'handsontable/dist/handsontable.full.css';
import './data-harmonizer.css';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';

import specifyHeadersModal from './specifyHeadersModal.html';
import unmappedHeadersModal from './unmappedHeadersModal.html';
import fieldDescriptionsModal from './fieldDescriptionsModal.html';

import HelpSidebar from './HelpSidebar';
import Validator from './Validator';

import pkg from '../package.json'; // Retrieves package version id.
const VERSION = pkg.version;
const VERSION_TEXT = 'DataHarmonizer v' + VERSION;

import {
  DateEditor,
  DatetimeEditor,
  TimeEditor,
  KeyValueListEditor,
  keyValueListValidator,
  keyValueListRenderer,
  multiKeyValueListRenderer,
} from './editors';

Handsontable.cellTypes.registerCellType('key-value-list', {
  editor: KeyValueListEditor,
  validator: keyValueListValidator,
  renderer: keyValueListRenderer,
});

Handsontable.cellTypes.registerCellType('dh.datetime', {
  editor: DatetimeEditor,
  renderer: Handsontable.renderers.getRenderer('autocomplete'),
});
Handsontable.cellTypes.registerCellType('dh.date', {
  editor: DateEditor,
  renderer: Handsontable.renderers.getRenderer('autocomplete'),
});
Handsontable.cellTypes.registerCellType('dh.time', {
  editor: TimeEditor,
  renderer: Handsontable.renderers.getRenderer('autocomplete'),
});

const TRANSLATABLE = {
  // DH Tab maps to schema.extensions.locales.value[locale][part][key1][part2][key2] 
  // The key names link between locales hierarchy part dictionary keys and the
  // DH row slots that user is focused on.
  // tab: [schema_part, key1, [part2, key2], [attribute_list]
  'Schema':   [null, null, null, null, ['description']],
  'Class':    ['classes', 'name', null, null, ['title','description']],
  'Slot':     ['slots', 'name', null, null, ['title','description','comments','examples']],
  'Enum':     ['enums', 'name', null, null, ['title','description']],

  'SlotUsage': ['classes', 'class_id', 'slot_usage', 'slot_id', ['title','description','comments','examples']],
  'PermissibleValue': ['enums', 'enum_id', 'permissible_values', 'text', ['title','description']]
}

/**
 * An instance of DataHarmonizer has a schema, a domElement, and a
 * handsontable .hot object
 */
class DataHarmonizer {
  root = null;
  template_name = null;
  schema = null; // Schema holding all templates
  sections = null; // Specific template from schema
  slots = null;
  slot_names = null;
  hot = null;
  menu = null;
  export_formats = {}; // Formats that a given template can export to.
  invalid_cells = null;
  // Currently selected cell range[row,col,row2,col2]
  current_selection = [null, null, null, null];

  constructor(root, context, options = {}) {
    // table schema
    this.schema = options.schema;
    this.context = context;

    // interface layout pass-ins
    this.root = root;
    this.hotRoot = options.hotRoot || $('<div>').appendTo(this.root)[0];
    this.modalsRoot = options.modalsRoot || document.querySelector('body');
    this.loadingScreenRoot = options.loadingScreenRoot || this.root;

    this.template_name = options.template_name || null;
    this.field_settings = options.fieldSettings || {};
    this.slots = null;
    this.slot_names = null;
    this.hot_override_settings = options.hot_override_settings || {};

    this.helpSidebarOptions = Object.assign(
      { enabled: true },
      options.helpSidebar || {}
    );
    this.columnHelpEntries = options.columnHelpEntries || [
      'column',
      'slot_uri',
      'description',
      'guidance',
      'examples',
      'menus',
    ];
    this.dateFormat = options.dateFormat || 'yyyy-MM-dd';
    this.datetimeFormat = options.datetimeFormat || 'yyyy-MM-dd hh:mm aa';
    this.timeFormat = options.timeFormat || 'hh:mm aa';
    this.dateExportBehavior = options.dateExportBehavior || JSON_SCHEMA_FORMAT;
    this.validator = new Validator(this.schema, MULTIVALUED_DELIMITER, {
      dateFormat: this.dateFormat,
      datetimeFormat: this.datetimeFormat,
      timeFormat: this.timeFormat,
    });
    this.self = this;

    // Use help sidebar by default unless turned off by client
    if (this.helpSidebarOptions.enabled) {
      const opts = Object.assign({}, this.helpSidebarOptions);
      opts.onToggle = (open) => {
        // always do a HOT rerender on toggle in addition to anything client-specified
        if (this.hot) {
          this.render();
        }
        if (typeof this.helpSidebarOptions.onToggle === 'function') {
          this.helpSidebarOptions.onToggle(open);
        }
      };
      this.helpSidebar = new HelpSidebar(this.root, opts);
    }

    $(this.modalsRoot).append(specifyHeadersModal);
    $(this.modalsRoot).append(unmappedHeadersModal);
    $(this.modalsRoot).append(fieldDescriptionsModal);

    // Reset specify header modal values when the modal is closed
    $('#specify-headers-modal').on('hidden.bs.modal', () => {
      $('#specify-headers-err-msg').hide();
      $('#specify-headers-confirm-btn').unbind();
    });

    // Field descriptions. TODO: Need to account for dynamically rendered cells.
    $(this.root).on('dblclick', '.secondary-header-cell', (e) => {
      // NOTE: innerText is no longer a stable reference due to i18n
      // Ensure hitting currentTarget instead of child
      // with innerText so we can guarantee the reference field.
      const field_reference = e.currentTarget.getAttribute('data-ref');
      const field = this.slots.find((field) => field.title === field_reference);
      $('#field-description-text').html(this.getComment(field));
      $('#field-description-modal').modal('show');
    });
  }

  render() {
    this.hot.render();
  }

  /**
   * Open file specified by user. NOT JSON THOUGH!
   * Only opens `xlsx`, `xlsx`, `csv` and `tsv` files. Will launch the specify
   * headers modal if the file's headers do not match the grid's headers.
   * 
   * Called repeatedly for each DH tab via Toolbar.js openFile()
   * 
   * @param {File} file User file.
   * @param {Object} xlsx SheetJS variable.  OUTDATED???
   * @return {Promise<>} Resolves after loading data or launching specify headers
   *     modal.
   */

  async openFile(file) {
    // methods for finding the correspondence between ranges and their containers
    // in the 1-M code, tables correspond to entities that are ranges of their containers
    // TODO: might need to be generalized in a future iteration, if ranges overlap
    const container_for_range = (container, maybe_range) => {
      Object.entries(container.attributes).forEach(
        ([container_class, attributes]) => {
          if (attributes.range === maybe_range) {
            return container_class;
          }
        }
      );
      return maybe_range;
    };

    // const range_for_container = (container, container_class) =>
    //   container.attributes[container_class].range;

    let list_data;
    try {
      // In 1-m data, file is read repeatedly and matched against each dh's slot list.
      let contentBuffer = await readFileAsync(file);

      if (file.type === 'application/json') {
        let jsonData;
        try {
          jsonData = JSON.parse(contentBuffer.text);
        } catch (error) {
          throw new Error('Invalid JSON data', error);
        }

        const container_class = container_for_range(
          this.context.template.default.schema.classes.Container,
          this.template_name
        );

        if (container_class) {
          let dataObjects = jsonData.Container[container_class];
          list_data = this.loadDataObjects(dataObjects);
          this.hot.loadData(list_data);
        }
      } else {
        // assume tabular data if not a JSON datatype
        list_data = this.loadSpreadsheetData(contentBuffer.binary);
        this.hot.loadData(list_data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Called by toolbox.js validate()
  async validate() {
    // const data = this.getTrimmedData();
    const rowStart = 0;
    const rowEnd = this.hot.countRows() - this.hot.countEmptyRows(true) - 1;
    const colStart = 0;
    const colEnd = this.hot.countCols() - 1;
    const data = this.hot.getData(rowStart, colStart, rowEnd, colEnd);

    // doPreValidationRepairs(data) cleans some kinds of [row][column] value without
    // signaling changes.
    await this.doPreValidationRepairs(data); // Screen refresh requires await().
    this.invalid_cells = this.getInvalidCells(data);
    //console.log("INVALID CELLS", this.invalid_cells);
    this.hot.render();
  }
  // Run via toolbar createNewFile()
  newHotFile() {
    this.context.runBehindLoadingScreen(
      function () {
        this.createHot();
      }.bind(this)
    );
  }

  /**
   * Create a blank instance of Handsontable.
   * @param {Object} template.
   * @return {Object} Handsontable instance.
   */
  createHot(data = []) {
    const self = this;
    this.invalid_cells = {};
    if (this.hot) {
      this.hot.destroy(); // handles already existing data
      this.hot = null;
    }

    this.hot = new Handsontable(this.hotRoot, {
      licenseKey: 'non-commercial-and-evaluation',
    });

    if (this.slots) {
      /* This seems to be redundant now with newer Handsontable code.
      this.clipboardCache = '';
      this.clipboardCoordCache = {
        'CopyPaste.copy': {},
        'CopyPaste.cut': {},
        'CopyPaste.paste': {},
        'Action:CopyPaste': '',
      }; // { startCol, startRow, endCol, endRow }
      this.sheetclip = new SheetClip();

      const hot_copy_paste_settings = {
        afterCopy: function (changes, coords) {
          self.clipboardCache = self.sheetclip.stringify(changes);
          self.clipboardCoordCache['CopyPaste.copy'] = coords[0];
          self.clipboardCoordCache['Action:CopyPaste'] = 'copy';
        },
        afterCut: function (changes, coords) {
          self.clipboardCache = self.sheetclip.stringify(changes);
          self.clipboardCoordCache['CopyPaste.cut'] = coords[0];
          self.clipboardCoordCache['Action:CopyPaste'] = 'cut';
        },
        afterPaste: function (changes, coords) {
          // we want to be sure that our cache is up to date, even if someone pastes data from another source than our tables.
          self.clipboardCache = self.sheetclip.stringify(changes);
          self.clipboardCoordCache['CopyPaste.paste'] = coords[0];
          self.clipboardCoordCache['Action:CopyPaste'] = 'paste';
        },

        contextMenu: [
          'copy',
          'cut',
          {
            key: 'paste',
            name: 'Paste',
            disabled: function () {
              return self.clipboardCache.length === 0;
            },
            callback: function () {
              //var plugin = this.getPlugin('copyPaste');

              //this.listen();
              // BUG: It seems like extra lf is added by sheetclip, causing
              // empty last row to be added and pasted. Exception is pasting
              // of single empty cell
              //if (self.clipboardCache.length > 0)
              //  self.clipboardCache = self.clipboardCache.slice(0, -1);
              //plugin.paste(self.clipboardCache);
            },
          },
          'remove_row',
          'row_above',
          'row_below',
        ],

      };
      */
      const hot_settings = {
        //...hot_copy_paste_settings,
        data: data, // Enables true reset
        nestedHeaders: this.getNestedHeaders(),
        autoColumnSize: true, // Enable automatic column size calculation
        columns: this.getColumns(),
        colHeaders: true,
        rowHeaders: true,
        renderallrows: false, // working?
        manualRowMove: true,
        columnSorting: true,
        copyPaste: true,
        outsideClickDeselects: false, // for maintaining selection between tabs
        manualColumnResize: true,
        //colWidths: [100], //Just fixes first column width
        minRows: 5,
        minSpareRows: 5,
        width: '100%',
        // Future: For empty dependent tables, tailor to minimize height.
        height: '75vh',
        fixedRowsTop: 0,
        search: {// define your custom query method
          //queryMethod: searchMatchCriteria
        },
        sortIndicator: true,
        fixedColumnsLeft: 1, // Future: enable control of this.
        hiddenColumns: {
          copyPasteEnabled: true,
          indicators: true,
          columns: [],
        },
        filters: true,  // ERROR with Handsontable 15.2.0 conditionDefinition.args.map is not a function
        hiddenRows: {
          rows: [],
        },
        // Handsontable's validation is extremely slow with large datasets.
        // REEXAMINE ABOVE assumption now that setDataAtCell() problem solved.
        invalidCellClassName: '',
        licenseKey: 'non-commercial-and-evaluation',

        // observeChanges: true, // TEST THIS https://forum.handsontable.com/t/observechange-performance-considerations/3054
        // columnSorting: true, // Default undefined. TEST THIS FOR EFFICIENCY https://handsontable.com/docs/javascript-data-grid/api/column-sorting/
        contextMenu: [
          {
            key: 'remove_row',
            name: 'Remove row',
            callback: function () {
              // Enables removal of a row and all dependent table rows.
              // If there are 1-many cascading deletes, verify if that's ok.
              let selection = self.hot.getSelected()[0][0];
              let [change_report, change_message] = self.getChangeReport(self.template_name);
              if (!change_message.length) {
                self.hot.alter('remove_row', selection);
                return true;
              }
             /*
             * For deletes: (For now, ignore duplicate root key case: If 
             * encountering foreign key involving root_class slot, test if that has
             * > 1 row. If so, delete ok without examining other dependents.)
             */

              // Some cascading deletes to confirm here.
              if (
                confirm(
                  'WARNING: If you proceed, this will include deletion of one\n or more dependent records, and this cannot be undone:\n' +
                    change_message
                )
              ) {
                // User has seen the warning and has confirmed ok to proceed.
                for (let [dependent_name, dependent_obj] of Object.entries(change_report)) { 
                  if (dependent_obj.rows?.length) {
                    let dh_changes = dependent_obj.rows.map(x => [x,1]);
                    self.context.dhs[dependent_name].hot.alter('remove_row', dh_changes);    
                  }
                };
                self.hot.alter('remove_row', selection); 
              }
            },
          },
          {
            key: 'row_above',
            name: 'Insert row above',
            callback: function (action, selection, event) {
              // Ensuring that rows inserted into foreign-key dependent tables
              // take in the appropriate focused foreign-key values on creation.
              self.addRows('insert_row_above', 1, self.hot.getSelected()[0][0]);
            },
          },
          {
            key: 'row_below',
            name: 'Insert row below',
            callback: function () {
              // As above.
              self.addRows(
                'insert_row_above',
                1,
                parseInt(self.hot.getSelected()[0][0]) + 1
              );
            },
          },
          {
            key: 'load_schema',
            name: 'Load LinkML schema.yaml',
            hidden: function () {
              return self.template_name != 'Schema';
            },
            callback: function () {$('#schema_upload').click();}
          },
          {
            key: 'save_schema',
            name: 'Save as LinkML schema.yaml',
            hidden: function () {
              return self.template_name != 'Schema';
            },
            callback: function () {self.saveSchema()}
          },
          {
            key: 'translations',
            name: 'Translations',
            hidden: function () {
              const schema = self.context.dhs.Schema; 
              // Hide if not in schema editor.
              if (schema?.schema.name !== "DH_LinkML") return true;
              // Hide if not translation fields.
              if (!(self.template_name in TRANSLATABLE)) return true;
              // Hide if no locales
              const current_row = schema.current_selection[0];
              if (current_row === null)
                return false;
              const locales = schema.hot.getCellMeta(current_row, 0).locales;
              return !locales;

              //const locales = schema.hot.getDataAtCell(schema.current_selection[0], schema.slot_name_to_column['in_language'],'lookup');
            },
            callback: function () {

              const schema = self.context.dhs.Schema;
              // Each schema_editor schema has locales object stored in its first
              // row cell metadata.
              const locales = schema.hot.getCellMeta(schema.current_selection[0], 0).locales;
              // Translation table form for all selected rows.
              const [schema_part, key_name, sub_part, sub_part_key_name, text_columns] = TRANSLATABLE[self.template_name];

              let translate_rows = '';

              let locale_map = self.schema.enums?.LanguagesMenu?.permissible_values || {};

              // Provide translation forms for user selected rows
              for (let row = self.current_selection[0]; row <= self.current_selection[2]; row++) {

                // 1st content row of table shows english or default translation.
                let default_row_text = '';
                let translatable = '';
                for (var column_name of text_columns) {

                  // Exception is 'permissible_values', 'text' where in default
                  // schema there might not be a title. find 'text' instead of 'title'
                  if (sub_part === 'permissible_values' && column_name === 'title')
                    column_name = 'text';
                  let col = self.slot_name_to_column[column_name];
                  let text = self.hot.getDataAtCell(row, col, 'lookup') || '';
                  default_row_text += `<td>${text}</td>`;
                  translatable += text + '\n';
                }
                const language = locale_map[schema.schema.in_language].title;
                translate_rows += `<tr class="translate"><td>${language} (${schema.schema.in_language})</td>${default_row_text}<td></td></tr>`;   
                // Key for class, slot, enum:
                const key = self.hot.getDataAtCell(row, self.slot_name_to_column[key_name], 'lookup');
                let key2 = null;
                if (sub_part_key_name) {
                  key2 = self.hot.getDataAtCell(row, self.slot_name_to_column[sub_part_key_name], 'lookup');
                }

                // DISPLAY locale for each schema in_language menu item
                for (const [locale, locale_schema] of Object.entries(locales)) {
                  let translate_cells = '';
                  let translate_text = '';
                  for (let column_name of text_columns) {
                    // If items are in a component of class, like slot_usage or permissible_values
                    // schema_part='enums', id='enum_id', 'permissible_values', 'name',
                    // Translations can be sparse/incomplete
                    let value = null;
                    if (sub_part) {
                      console.log(locale_schema, schema_part, key, sub_part, key2, column_name)
                      // Sparse locale files might not have particular fields.
                      value = locale_schema[schema_part]?.[key]?.[sub_part]?.[key2]?.[column_name] || '';
                    }
                    else if (schema_part) {
                      value = locale_schema[schema_part]?.[key]?.[column_name] || '';
                    }
                    else { // There should always be a locale_schema 
                      value = locale_schema?.[column_name] || '';
                    }
                    if (!!value && Array.isArray(value) && value.length > 0) {
                      // Some inputs are array of [{value: ..., description: ...} etc.
                      if (typeof value[0] === 'object')
                        value = Object.values(value).map((x) => x.value).join(';');
                      else
                        value = value.join(';')
                    }

                    translate_cells += `<td><textarea name="${column_name}" data-row="${row}">${value}</textarea></td>`;
                  }
                  // Because origin is different, we can't bring google 
                  // translate results directly into an iframe.
                  let translate = `<button type="button" onclick="return !window.open('https://translate.google.com/?sl=${schema.schema.in_language}&tl=${locale}&op=translate&text=${encodeURI(translatable)}', 'translate', 'popup, width=1000, height=600, toolbar=no');">google</button>`;
                  const trans_language = locale_map[locale].title;
                  translate_rows += `<tr class="translation-input"><td><b>${trans_language} (${locale})</b></td>${translate_cells}<td>${translate}</td></tr>`;
                }
              };

              $('#translate-modal-content').html(
                `<div>
                  <table>
                    <thead>
                      <tr>
                        <th class="locale">locale</th>
                        <th>${TRANSLATABLE[self.template_name][4].join('</th><th>')}</th>
                        <th>translate</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${translate_rows}
                    </tbody>
                  </table>
                </div>`
              );
              $('#translate-modal').modal('show');
            }
          },

        ],

        //beforePaste:
        //afterPaste:

        /**
         * Before carrying out user-specificed changes to one or more cells,
         * validate changes to prevent:
         * - any unique (key) column slot from getting a duplicate.
         * - any unique_key slot combination from getting a duplicate.
         * - any other table's foreign key relations from being compromised.
         *   - includes catching unintended deletions or updates.
         * Also check to see if changes should trigger other rules.
         *
         * One assumption: no functioning primary/foreign key slot can have
         * null values.
         * beforeChange source: https://handsontable.com/docs/8.1.0/tutorial-using-callbacks.html#page-source-definition
         *
         * Note: on fresh load of data - including empty dataset with default
         * # rows, this event can be triggered "silently" on update of fields likedata
         * empty provenance field.
         * @param {Array} grid_changes array of [row, column, old value (incl. undefined), new value (incl. null)].
         * @param {String} action can be CopyPaste.paste, ... thisChange
         */
        beforeChange: function (grid_changes, action) {
          // Ignore addition of new records to table.
          if (['add_row','upload','prevalidate','multiselect'].includes(action)) 
            return; //'thisChange'
          if (!grid_changes) return; // Is this ever the case?

          console.log('beforeChange', grid_changes, action);

          /* TRICKY CASE: for tables depending on some other table for their
           * primary keys, grid_changes might involve "CopyPaste.paste" action
           * onto other columns which cause new rows to be added at bottom
           * with empty values in read-only primary key fields. Need to extend
           * change list in this case to include insertion of primary key(s).
           */

          /* Cut & paste can include 2 or more
           * changes in different columns on a row, or on multiple rows, so we
           * need to validate 1 row at a time. Row_changes data structure enables
           * this.
           */
          let row_changes = self.getRowChanges(grid_changes);

          // Validate each row of changes
          for (const row in row_changes) {
            let changes = row_changes[row];

            /* TEST for change in Schema in_language
             * If new languages added or deleted, prompt to confirm.
             */
            if (self.template_name === 'Schema' 
              && self.schema.name === 'DH_LinkML' 
              && 'locales' in changes) {
              return self.setLocales(changes);
            };

            /* TEST FOR DUPLICATE IN IDENTIFIER SLOT
             * Change request cancelled (sudden death) if user tries to change
             * an identifier (unique key) value but this would result in a
             * duplicate key. This isn't necessarily the same as a .unique_keys
             * slot, so we lead with a check on this.
             */
            for (const slot_name in changes) {
              let change = changes[slot_name];
              if (change.slot.identifier == true && change.value != null) {
                // Look for collision with an existing row's column value.
                // Change hasn't been implemented yet so we won't run into
                // change's row.
                let search_row = self.context.crudFindRowByKeyVals(self, {
                  [slot_name]: change.value,
                });
                if (search_row !== false && search_row != row) {
                  alert(
                    `Skipping change on row ${
                      parseInt(row) + 1
                    } because this would create a duplicate key! Check:\n\n * [${slot_name}] change to "${
                      change.value
                    }"\n`
                  );
                  return false;
                }
              }
            }

            /* TEST FOR CHANGE TO UNIQUE_KEY
             * Similar to a class's identifier slot(s), if a class has a
             * unique_key with >=1 slot then multiple changes to key must be
             * tested for duplicates as well as multiple possible impacts on
             * dependent tables.
             *
             * NOTE: user can be updating one field of a primary key; neets to
             * be able to edit it in incomplete form.
             *
             * NOTE: If user clears out a value in one slot of a unique_key
             * - This case is handled below in TEST FOR CHANGE TO
             * DEPENDENT TABLE. Turning a component of a unique key into null
             * in itself doesn't necessarily trigger anything other than a
             * validation error on that construct when user presses "Validate".
             * Note: Validator.js validate() also has step for applying the
             * doUniquenessValidation() method on unique_key_slots.
             *
             * Determine if change(s) contribute to a complete unique_key, and
             * if so test if there's a duplication of that key. If key slot data
             * entry is unfinished, then no need to throw error.
             * Requires that we iterate through class's unique_keys list,
             * seeing if any new column (changes[0]) value (changes[3]) pertains
             * to one. If so, test to see if key has a value.  If no value,
             * then skip key, otherwise test new key uniqueness.
             *
             * However, any field being used as the target of a foreign key of
             * another table, if it had a value and that changes, leaving no
             * other key with the same value that foreign table key could use
             * in its place, necessitates a cancel of that operation.  ???????
             *
             * Only route to making a change to a unique key is in the
             * "change_primary_key" right-click menu option above.
             *
             * Assumption, if user hasn't changed an existing unique_key, then
             * no need to test it for duplicate. Let general validation button
             * handle that case.
             *
             *  [class]: {
             *    "unique_keys": {
             *      "grdisample_id": {
             *        "unique_key_name": "grdisample_id",
             *        "unique_key_slots": [
             *          "sample_collector_sample_id"
             *        ],
             *
             * ISSUE: currently can set a key field to blank.  PROBABLY block that.
             */

            // Examine each unique_key
            for (let key_name in self.template.unique_keys) {
              // Determine if key has a full set of values (complete=true)
              let [complete, changed, keyVals, change_log] =
                self.context.crudHasCompleteUniqueKey(self, row, key_name, changes);
              if (complete && changed) {
                // Here we have complete unique_keys entry to test for duplication
                let duplicate_row = self.context.crudFindRowByKeyVals(
                  self,
                  keyVals
                );
                // There is a matching row so fail this action.
                if (duplicate_row && duplicate_row != row) {
                  alert(
                    `Your change cannot be completed because it would lead to a primary key [${key_name}] duplicate on row ${
                      parseInt(row) + 1
                    }! Check:\n\n ${change_log}`
                  );
                  return false;
                }
                // Full changed unique_key here, and no duplicates, so on its
                // own this is ok.  Dependent table record test below will
                // prompt user if any implications to dependent records.
              }
            }

            // UPDATE CASE: TEST FOR CHANGE TO DEPENDENT TABLE FOREIGN KEY(S)
            // NOTE: if primary key change accepted below after prompt, then 
            // data change involked here is to dependent table data, and this
            // happens in advance of root table key changes.
            let change_prelude = `Your key change on ${self.template_name} row ${
                  parseInt(row) + 1
                } would also change existing dependent table records, and this cannot be undone. Do you want to continue?  Check:\n`;

            let [change_report, change_message] = self.getChangeReport(self.template_name, true, changes);

            // confirm() presents user with report containing notice of subordinate changes
            // that need to be acted on.
            if (!change_message || confirm(change_prelude + change_message)) {
              if (change_message) {
                // User has seen the warning and has confirmed ok to proceed.
                for (let [dependent_name, dependent_obj] of Object.entries(change_report)) { 
                  // Changes to current dh are done below.
                  if (dependent_name != self.template_name) {
                    if (dependent_obj.rows?.length) {
                      let dependent_dh = self.context.dhs[dependent_name];
                      dependent_dh.hot.batchRender(() => {
                        for (let dep_row in dependent_obj.rows) {
                          Object.entries(dependent_obj.key_changed_vals).forEach(([dep_slot, dep_value]) => {
                            let dep_col = dependent_dh.slot_name_to_column[dep_slot];
                            // 'row_update' attribute may avoid triggering handsontable events
                            dependent_dh.hot.setDataAtCell(dep_row, dep_col, dep_value, 'row_updates');
                          })
                        } 
                      }); // End of hot batch render
                    }
                  }
                };

              }; // End of update action on dependent table keys, but not this dh table.

            } else return false;

          } // end of row in row_change

          let triggered_changes = [];
          for (const change of grid_changes) {
            // When a change in one field triggers a change in another field.
            // Check field change rules
            self.fieldChangeRules(change, self.slots, triggered_changes);
          }
          // Add any indirect field changes onto end of existing changes.
          if (triggered_changes) {
            grid_changes.push(...triggered_changes);
          }
          //return false; will cancel this, yielding no changes.
        },

        // If a change is carried out in the grid but user doesn't
        // change selection, e.g. just edits 1 cell content, then
        // an afterSelection isn't triggered. THEREFORE we have to
        // trigger a crudFilterDependentViews() call here.
        // action e.g. edit, updateData, CopyPaste.paste
        afterChange: function (grid_changes, action) {
          if (action == 'upload' || action =='updateData') {
            // This is being called for every cell change in an 'upload'   
            return;
          }

          // Trigger only if change to some key slot child needs.
          if (grid_changes) {
            let row_changes = self.getRowChanges(grid_changes);
            if (self.hasRowKeyChange(self.template_name, row_changes)) {
              self.context.crudFilterDependentViews(self.template_name);
              // If in schema editor mode, update or insert to name field (a
              // key field) of class, slot or enum (should cause update in 
              // compiled enums and slot flatVocabularies.
              if (['Type','Class','Enum'].includes(self.template_name)) {
                self.context.refreshSchemaEditorMenus([`Schema${self.template_name}Menu`]);
              }
            }
          }
        },

        // https://handsontable.com/docs/javascript-data-grid/api/hooks/#afterselection
        //afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
        afterSelectionEnd: (row, column, row2, column2, selectionLayerLevel) => {
          /*
           * Test if user-focused row has changed.  If so, then possibly
           * foreign key values that make up some dependent table's record(s)
           * have changed, so that table's view should be refreshed. Dependent
           * tables determine what parent foreign key values they need to filter view by.
           * This event is not directly involved in row content change.
           *
           * As well, refresh schema menus if selected schema has changed.
           */
          // Is null check necessary?
          const row_change = self.current_selection[0] === null || self.current_selection[0] != row;
          const column_change = self.current_selection[1] === null || self.current_selection[1] != column;
          self.current_selection = [row, column, row2, column2];

          //console.log("afterSelectionEnd",row, column, row2, column2, selectionLayerLevel)
          if (row_change || column_change) {
            self.context.crudFilterDependentViews(self.template_name);
          }

          if (row_change) {
            if (self.template_name === 'Schema') { // schema editor.
              self.context.refreshSchemaEditorMenus();
            }
            if (self.template_name === 'Class') {
              // Have to update SlotUsage slot_group menu for given Class.
              // (Not having Slot Class itself have slot_group.)
              // Find slot menu field and update source controlled vocab.
              // ISSUE: Menu won't work/validate if multiple classes are displayed.
              //const class_name = self.hot.getDataAtCell(
              //  row, self.slot_name_to_column['name']
              //);
              self.context.refreshSchemaEditorMenus(['SchemaSlotGroupMenu']);      
            }
          }

          // - See if sidebar info is required for top column click.
          if (this.helpSidebar) {
            if (column > -1) {
              const field = self.slots[column];
              const helpContent = self.getComment(field);
              self.helpSidebar.setContent(helpContent);
            } else self.helpSidebar.close();
          }
          return false;
        },

        // Bit of a hackey way to RESTORE classes to secondary headers. They are
        // removed by Handsontable when re-rendering main table.
        afterGetColHeader: function (column, TH, headerlev) {
          if (headerlev == 1) {
            // Enables double-click listener for column help
            $(TH).addClass('secondary-header-cell');
            if (column > -1) {
              const field = self.slots[column];

              // field referencing
              if (field.title) {
                // create a reference as an alternative to innerText
                // although this is done due to i18n, make it independently failing
                // since another function relies on this being present
                $(TH).attr('data-ref', field.title);
              }

              // field presence
              if (field.recommended) $(TH).addClass('recommended');
              else if (field.required) $(TH).addClass('required');
            }
          }
        },

        afterRenderer: (TD, row, col) => {
          if (Object.prototype.hasOwnProperty.call(self.invalid_cells, row)) {
            if (
              Object.prototype.hasOwnProperty.call(self.invalid_cells[row], col)
            ) {
              const msg =
                self.invalid_cells[row][col] === 'This field is required';
              $(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
            }
          }
        },
        ...this.hot_override_settings,
      };

      this.hot.updateSettings(hot_settings);
      this.enableMultiSelection();
    } else {
      console.warn(
        'This template had no sections and fields: ' + this.template_name
      );
    }
  }

  // Handsontable search extension for future use (fixed their example). 
  // DH search defaults to any substring match (See hot_settings above).
  // Function below provides string exact match (incl. case sensitivity)
  searchMatchCriteria (queryStr, value, metadata) {
    return queryStr.toString() === value?.toString();
  }

  clearValidationResults() {
    $('#next-error-button,#no-error-button').hide();
    this.invalid_cells = {};
  }


  getLocales() {
    if (this.template_name === 'Schema'  && this.schema.name === 'DH_LinkML') {
      // Locales are stored in 1st column of selected row of Schema class table.
      const schema_metadata = this.hot.getCellMeta(this.current_selection[0], 0);
      if (!('locales' in schema_metadata)) 
        schema_metadata.locales = {};
      return schema_metadata.locales
    }
    else {
      // locales stored in a given DH's schema.
      // Read-only, no opportunity to create them here.
      return this.schema.extensions?.locales?.value;
    }
  }

  /**
   * Enacts change to a classes' locales with appropriate creation or 
   * deletion.
   */
  setLocales(changes) {
    let old_langs = changes.locales.old_value 
      ? new Set(changes.locales.old_value.split(';')) 
      : new Set();
    let new_langs = changes.locales.value 
      ? new Set(changes.locales.value.split(';')) 
      : new Set();
    let deleted = Array.from(old_langs.difference(new_langs).keys());
    let created = Array.from(new_langs.difference(old_langs).keys());

    // If old language has been dropped or a new one added, prompt user:
    if (deleted.length || created.length) {
      let locale_map = this.schema.enums?.LanguagesMenu?.permissible_values || {};
      let deleted_titles = deleted.map((item) => locale_map[item]?.title || item);
      let created_titles = created.map((item) => locale_map[item]?.title || item);

      let message = `Please confirm that you would like to: \n\n`;
      if (deleted.length) {
        message += `DELETE A LOCALE AND ALL ITS TRANSLATIONS for: ${deleted_titles.join('; ')}\n\n`;
      }
      if (created.length) {
        message += `ADD LOCALE(s): ${created_titles.join('; ')}`;
      }
      let proceed = confirm(message);
      if (!proceed) return;

      const locales = this.getLocales();
      for (const locale of deleted) {
        delete locales[locale];
      }
      for (const locale of created) {
        locales[locale] = {};
      }
    }
  };


  saveSchema () {
    if (this.schema.name !== 'DH_LinkML') {
      alert('This option is only available while in the DataHarmonizer schema editor.');
      return false;
    }

    // User-focused row gives top-level schema info:
    let dh = this.context.dhs['Schema'];
    let schema_focus_row = dh.current_selection[0];
    let schema_name = dh.hot.getDataAtCell(schema_focus_row, 0);
    let save_prompt = `Provide a name for the ${schema_name} schema YAML file. This will save the following schema parts:\n`;

    let [save_report, confirm_message] = this.getChangeReport(this.template_name);

    // prompt() user for schema file name.
    let file_name = prompt(save_prompt + confirm_message, 'schema.yaml');

    if (file_name) {

      let schema = { // Provide defaults here.
        name: '',
        description: '',
        id: '',
        version: '',
        in_language: 'en',
        default_prefix: '',
        prefixes: {},
        imports: ['linkml:types'],
        classes: {},
        slots: {},
        enums: {},
        types: {
          WhitespaceMinimizedString: {
            name: 'WhitespaceMinimizedString',
            typeof: 'string',
            description: 'A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).',
            base: 'str',
            uri: 'xsd:token'
          },
          Provenance: {
            name: 'Provenance',
            typeof: 'string',
            description: 'A field containing a DataHarmonizer versioning marker. It is issued by DataHarmonizer when validation is applied to a given row of data.',
            base: 'str',
            uri: 'xsd:token'
          }   
        },
        settings: {
          Title_Case: "(((?<=\\b)[^a-z\\W]\\w*?|[\\W])+)",
          UPPER_CASE: "[A-Z\\W\\d_]*",
          lower_case: "[a-z\\W\\d_]*"
        }
      }

      //const schema_obj = Object.fromEntries(schema);
      // Loop through schema and all its dependent child tabs.
      let components = ['Schema', ... Object.keys(this.context.relations['Schema'].child)];
      for (let [ptr, class_name] of components.entries()) {
        let key_slot = (class_name === 'Schema' ? 'name' : 'schema_id');
        let rows = this.context.crudFindAllRowsByKeyVals(class_name, {[key_slot]: schema_name}) 
        let dependent_dh = this.context.dhs[class_name];
        console.log("getting rows for", class_name, key_slot, "=", schema_name, "result", rows)
        // Schema | Prefix | Class | UniqueKey | Slot | SlotUsage | Enum | PermissibleValue
        for (let dep_row of rows) {
          // Convert row slots into an object for easier reference.
          let record = {};
          for (let [dep_col, dep_slot] of Object.entries(dependent_dh.slots)) {
            // 'row_update' attribute may avoid triggering handsontable events
            let value = dependent_dh.hot.getDataAtCell(dep_row, dep_col, 'reading');
            if (!!value && value !== '') { //.length > 0
              // YAML: Quotes need to be stripped from boolean, Integer and decimal values
              // Expect that this datatype is the first any_of range item.
              switch (dep_slot.datatype) {
                case 'xsd:integer': 
                  value = parseInt(value);
                  break;
                case 'xsd:decimal':
                case 'xsd:double':
                case 'xsd:float':
                  value = parseFloat(value);
                  break;
                case 'xsd:boolean':
                  value = value.toLowerCase() in ['t','true','1','yes','y'];
                  break;
              }

              record[dep_slot.name] = value;

            }
          }

          // Do appropriate constructions per schema component
          switch (class_name) {
            case 'Schema':
              //console.log("SCHEMA",class_name, {... record})
              this.copySlots(class_name, record, schema, ['name','description','id','version','in_language','default_prefix']);
              break;

            case 'Prefix':
              schema.prefixes[record.prefix] = record.reference;
              break;

            case 'Class':
              schema.classes[record.name] ??= {};
              this.copySlots(class_name, record, schema.classes[record.name], ['name','title','description','version','class_uri']);
              if (record.container) { 
                // ".container is a Boolean indicating this should have a
                // data-saving and -loading container entry.
                //Include this class in container by that name.






              }
              break;

            case 'UniqueKey':
              schema.classes[record.class_id].unique_keys ??= {};
              schema.classes[record.class_id].unique_keys[record.name] = {
                unique_key_slots: record.unique_key_slots.split(';')
              }
              this.copySlots(class_name, record, schema.classes[record.class_id].unique_keys[record.name], ['description','notes']);
              break;

            case 'Slot':
              if (record.name) {
                schema.slots[record.name] ??= {};
                this.copySlots(class_name, record, schema.slots[record.name], ['name','slot_group','slot_uri','title','range','required','recommended','description','aliases','identifier','foreign_key','multivalued','minimum_value','maximum_value','equals_expression','pattern','comments','examples'
                ]);
              }
              break;

            case 'SlotUsage':
              schema.classes[record.class_id].slot_usage ??= {};
              schema.classes[record.class_id].slot_usage[record.slot_id] ??= {};
              this.copySlots(class_name, record, schema.classes[record.class_id].slot_usage[record.slot_id], ['name','rank','slot_group','title','range','inlined','required','recommended','description','aliases','identifier','foreign_key','multivalued','minimum_value','maximum_value','minimum_cardinality','maximum_cardinality','pattern','comments','examples']
              ); // 'equals_expression' ; don't really need rank here either - sorting changes that.
              break;

            case 'Enum':
              schema.enums[record.name] ??= {};
              this.copySlots(class_name, record, schema.enums[record.name], ['name','title','enum_uri','description']);
              break;

            case 'PermissibleValue': // LOOP?????? 'text shouldn't be overwritten.
              schema.enums[record.enum_id].permissible_values ??= {};
              schema.enums[record.enum_id].permissible_values[record.text] ??= {};
              this.copySlots(class_name, record, schema.enums[record.enum_id].permissible_values[record.text], ['text','title','description','meaning', 'is_a']);
              break;

            case 'Type':
              // Coming soon, saving all custom/loaded data types.
              // Issue: Keep LinkML imported types uncompiled?
              break;
          }
        }
      };

      let metadata = this.hot.getCellMeta(schema_focus_row, 0);
      if (metadata.locales) {
        schema.extensions = {locales: {tag: 'locales', value: metadata.locales}}
      }

      console.table("SAVING SCHEMA", schema);

      const a = document.createElement("a");
      //Save JSON version: URL.createObjectURL(new Blob([JSON.stringify(schema, null, 2)], {
      a.href = URL.createObjectURL(new Blob([stringify(schema)], {type: 'text/plain'}));
      a.setAttribute("download", file_name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // SAVE LANGUAGE VARIANTS

    }

    return true;
  }  

  // Classes & slots (tables & fields) in loaded schema editor schema guide what can be imported.
  // See https://handsontable.com/docs/javascript-data-grid/api/core/#updatedata 
  // Note: setDataAtCell triggers: beforeUpdateData, afterUpdateData, afterChange
  loadSchemaYAML(text) {
    let schema = null;
    try {
      schema = parse(text);
      if (schema === null)
        throw new SyntaxError('Schema .yaml file could not be parsed.  Did you select a .json file instead?')
    }
    catch ({ name, message }) {
      alert(`Unable to open schema.yaml file.  ${name}: ${message}`);
      return false;
    }

    let schema_name = schema.name; // Using this as the identifier field for schema (but not .id uri)
    let load_name = schema.name; // In case of loading 2nd version of a given schema.
    let dh_schema = this.context.dhs['Schema'];
    let dh_uk = this.context.dhs['UniqueKey'];
    let dh_su = this.context.dhs['SlotUsage'];
    let dh_pv = this.context.dhs['PermissibleValue'];


    /** Since user has selected one row/place to load schema at, the Schema table itself
     * is handled differently from all the subordinate tables.
     *
     * If user already has a schema loaded by same name, then:
     *   - If user is focused on row having same schema, then overwrite (reload) it.
     *   - If user is on empty row then load the schema as [schema]_X or schema_[version]
     *     This enables versions of a given schema to be loaded and compared.
     *   - Otherwise let user know to select an empty row.
     * 
     * FUTURE: simplify to having new Schema added to next available row from top.
     */
    let rows = this.context.crudFindAllRowsByKeyVals('Schema', {'name': schema_name});
    let focus_row = parseInt(dh_schema.hot.getSelected()[0][0]);
    let focused_schema = dh_schema.hot.getDataAtCell(focus_row, 0) || '';
    let reload = false;
    if (rows.length > 0) {
      // RELOAD: If focused row is where schema_name is, then consider this a reload
      if (rows[0] == focus_row) {
        reload = true;
      }
      else {
        // Empty row so load schema here under a [schema_x] name
        if (!focused_schema) {
          let base_name = schema.name + '_';
          if (schema.version) {
            base_name = base_name + schema.version + '_';
          }
          let ptr = 1;
          while (this.context.crudFindAllRowsByKeyVals('Schema', {'name': base_name + ptr}).length) {
            ptr++;
          }
          load_name = base_name + ptr;
        }
        // Some other schema is loaded in this row, so don't toast that.
        else {
          return alert("This schema row is occupied.  Select an empty schema row to upload to.");
        }
      }
    }
    if (focused_schema.length) {
      return alert("This schema row is occupied.  Select an empty schema row to upload to.");
    }

    // Delete all existing rows in all tables subordinate to Schema
    // that have given schema_name as their schema_id key. Possible to improve
    // to have efficiency of a delta insert/update?
    // (+Prefix) | Class (+UniqueKey) | Slot (+SlotUsage) | Enum (+PermissableValues)
    if (reload === true) {
      //console.log("Clearing existing schema.")
      for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
        this.deleteRowsByKeys(class_name, {'schema_id': schema_name});
      }
    }

    // Now fill in all of Schema slots via uploaded schema slots.
    for (let [dep_col, dep_slot] of Object.entries(this.slots)) {
      if (dep_slot.name in schema) {
        let value = null;
        switch (dep_slot.name) {
          case 'name':
            value = load_name;
            break;
          case 'in_language':
            value = this.getListAsDelimited(schema.in_language);
            break;
          default:
            value = schema[dep_slot.name] ??= '';
        } 
        this.hot.setDataAtCell(focus_row, parseInt(dep_col), value, 'upload');
      }
    }

    /* As well, "schema.extensions", may contain a locale.  If so, we add 
     * right-click functionality on textual cells to enable editing of this
     * content, and the local extension is saved.
     * schema.extensions?.locales?.value contains {[locale]:[schema] ...}
     */
    const locales = schema.extensions?.locales?.value;
    if (locales) {
      this.hot.setCellMeta(focus_row, 0, 'locales', locales);
      let locale_list = Object.keys(locales).join(';');
      this.hot.setDataAtCell(focus_row, this.slot_name_to_column['locales'], locale_list, 'upload')
    }

    // For each DH instance, tables contains the current table of data for that instance.
    // For efficiency in loading a new schema, we add to end of each existing table.
    let tables = {};
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      let dh = this.context.dhs[class_name];
      tables[dh.template_name] = dh.hot.getData();
    }

    // Technical notes: Handsontable appears to get overloaded by inserting data via 
    // setDataAtCell() after loading of subsequent schemas.
    // Now using getData() and setData() as these avoid slowness or crashes
    // involved in adding data row by row via setDataAtCell(). Seems that 
    // events start getting triggered into a downward spiral after a certain
    // size of table reached.
    // 1) Tried using Handsontable dh.hot.alter() to add rows, but this ERRORS
    // with "Assertion failed: Expecting an unsigned number." if alter() is 
    // surrounded by "suspendRender()". Found alter() appears not to be needed
    // since Row added automatically via setDataAtCell().

    // 2nd pass, now start building up table records from core Schema prefixes,
    // classes, slots, enums entries:
    let conversion = {
      prefixes: 'Prefix',
      enums:    'Enum', // Done before slots and classes so slot.range and
                        //class.slot_usage range can include them. 
      classes:  'Class', 
      slots:    'Slot', 
    };

    for (let [schema_part, class_name] of Object.entries(conversion)) {

      let dh = this.context.dhs[class_name];

      // Cycle through parts of uploaded schema's corresponding prefixes /
      // classes / slots / enums
      // value may be a string or an object in its own right.

      for (let [item_name, value] of Object.entries(schema[schema_part])) {

        // Do appropriate constructions per schema component
        switch (class_name) {
          //case 'Schema':
          //  break;

          case 'Prefix':
            this.addRowRecord(dh, tables, {
              schema_id: load_name, 
              prefix:    item_name, 
              reference: value // In this case value is a string
            }); 
            break;

          case 'Class':
            this.addRowRecord(dh, tables, {
              schema_id:   load_name, 
              name:        value.name, 
              title:       value.title,
              description: value.description,
              version:     value.version,
              class_uri:   value.class_uri
            }); 

            // FUTURE: could ensure the unique_key_slots are marked required here.
            if (value.unique_keys) {
              for (let [key_name, obj] of Object.entries(value.unique_keys)) {
                this.addRowRecord(dh_uk, tables, {
                  schema_id: load_name,
                  class_id:  value.name,
                  name:      key_name,
                  unique_key_slots: obj.unique_key_slots.join(";"),
                  description: obj.description,
                  notes:     obj.notes // ??= ''
                });
              };
            };
            if (value.slot_usage) {
              for (let [key_name, obj] of Object.entries(value.slot_usage)) {
                this.addSlotRecord(dh_su, tables, load_name, value.name, key_name, obj);
              };
            }

            break;

          case 'Enum':
            this.addRowRecord(dh, tables, {
              schema_id:   load_name, 
              name:        value.name, 
              title:       value.title,
              description: value.description,
              enum_uri:    value.enum_uri
            }); 
          
            if (value.permissible_values) {
              for (let [key_name, obj] of Object.entries(value.permissible_values)) {
                this.addRowRecord(dh_pv, tables, {
                  schema_id: load_name,
                  enum_id:  value.name,
                  text:      key_name,
                  title:     obj.title,
                  description: obj.description,
                  meaning:   obj.meaning,
                  is_a:      obj.is_a
                  //notes:     obj.notes // ??= ''
                });
              };
            }
            break;

          case 'Slot':
            //slots have foreign_key annotations
            // Slots are not associated with a particular class.
            this.addSlotRecord(dh, tables, load_name, null, value.name, value);
            break;

        }
      };

    };

    // Get all of the DH instances loaded.
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      let dh = this.context.dhs[class_name];
      dh.hot.loadData(Object.values(tables[dh.template_name]));
    }

    // New data type, class & enumeration items need to be reflected in DH
    // schema editor SchemaTypeMenu, SchemaClassMenu and SchemaEnumMenu menus 
    // Done each time a schema is uploaded or focused on.
    this.context.refreshSchemaEditorMenus(); 

  };

  /** The slot object, and the Class.slot_usage object (which gets to enhance
   * add attributes to a slot but not override existing slot attributes) are
   * identical in potential attributes, so construct the same object for both
   */ 
  addSlotRecord(dh, tables, schema_name, class_name, slot_name, slot_obj) {

/*
    slot_usage:
      isolate_id:
        annotations:
          required:
            tag: required
            value: true
          foreign_key:
            tag: foreign_key
            value: GRDIIsolate.isolate_id
*/
    let slot_record = {
      schema_id:   schema_name,
      slot_group:  slot_obj.slot_group ??= '',
      slot_uri:    slot_obj.slot_uri,
      title:       slot_obj.title,
      //Problem is that Range should be conglomeration of SCHEMA.type datatypes as
      // well as all Enums
      //range:       Array.isArray(value.range) ? value.range.join(';') : value.range,
      inlined:     this.getBoolean(slot_obj.inlined),
      required:    this.getBoolean(slot_obj.required),
      recommended: this.getBoolean(slot_obj.recommended),
      description: slot_obj.description,
      aliases:     slot_obj.aliases,
      identifier:  this.getBoolean(slot_obj.identifier),
      foreign_key: slot_obj.foreign_key,
      multivalued: this.getBoolean(slot_obj.multivalued),
      minimum_value: slot_obj.minimum_value,
      maximum_value: slot_obj.maximum_value,
      equals_expression: slot_obj.equals_expression,
      pattern:     slot_obj.pattern,
      exact_mappings: this.getListAsDelimited(slot_obj.exact_mappings),
      comments:    slot_obj.comments,
      notes:       slot_obj.notes, 
      examples:    this.getListAsDelimited(slot_obj.examples, 'value'),
      version:     slot_obj.version
    };

    if (dh.template_name == 'SlotUsage') {
      slot_record.class_id = class_name;
      slot_record.slot_id = slot_name;
      // FUTURE make rank read only, and regenerate on save; drag&drop reorders.
      slot_record.rank = slot_obj.rank;
    }
    else {
      slot_record.name = slot_name;
    }
    this.addRowRecord(dh, tables, slot_record);
  };

  /**
   * Returns value as is if it isn't an array, but if it is, returns it as
   * semi-colon delimited list.
   * @param {Array or String} to convert into semi-colon delimited list.
   * @param {String} filter_attribute: A some lists contain objects 
   */
  getListAsDelimited(value, filter_attribute) {
    if (Array.isArray(value)) {
      if (filter_attribute) {
        return value.filter((item) => filter_attribute in item)
          .map((obj) => obj[filter_attribute])
          .join(';');
      } 
      return value.join(';');
    }
    return value;
  }

  /** Incomming data has booleans as json true/false; convert to handsontable TRUE / FALSE
   * 
   */
  getBoolean(value) {
    if (value === undefined)
      return value; // Allow default / empty-value to be passed along.
    return(!!value).toString().toUpperCase();
  };

  deleteRowsByKeys(class_name, keys) {
    let dh = this.context.dhs[class_name];
    let rows = dh.context.crudFindAllRowsByKeyVals(class_name, keys);
    //if (!rows) 
    //  continue;
    let dh_changes = rows.map(x => [x,1]);
    //if (dh_changes.length)
    dh.hot.alter('remove_row', dh_changes);  
  };

  /** Insert new row for corresponding table item in uploaded schema.

   */ 
  addRowRecord(dh, tables, record) {

    let target_record = new Array(dh.slots.length).fill(null);
    for (let [slot_name, value] of Object.entries(record)) {
      if (slot_name in dh.slot_name_to_column) {
        target_record[dh.slot_name_to_column[slot_name]] = value;
      }
      else
        console.error(`Error: Upload of ${dh.template_name} table mentions key:value of (${slot_name}:${value}) but Schema model doesn't include this key`)
    }
    tables[dh.template_name].push(target_record);
  };

  copySlots(class_name, record, target, slot_list) {
    for (let [ptr, attr_name] of Object.entries(slot_list)) {
      if (attr_name in record) {
          target[attr_name] = record[attr_name];
          // console.log(`Error: Saving ${class_name}, saved template is missing ${slot_name} slot.`)
      }
    }
  };

  /**
   * Returns a dependent_report of changed table rows, as well as an affected
   * key slots summary.  Given changes object is user's sot edits, if any, on
   * a row. 
   *  
   * The skippable = true parameter enables this report to exit quickly rather
   * than doing a deep recursive dive. This is for the case where we are 
   * testing an update action on class_name, but if no dependents are affected
   * then we don't have to do a dive into examining each of its dependents. 
   * Both view and delete actions require deep dive so are not skippable.
   * 
   * Note, this can be triggered per row where say an empty data provenance field
   * is updated silently.
   * 
   * @param {String} class_name name of class (DataHarmonizer instance) to start from.
   * @param {Boolean} skippable: yes = don't do deep dive if no keys have changed for class name.
   * @param {Object} changes dictionary pertaining to a particular dh row's slots.
   * @returns {Object} dependent_report dictionary of class_names and the key slot related data and change-affected rows
   * @returns {String} change_message echoes description of entailed changes in dependent tables.
   */
  getChangeReport(class_name, skippable=false, changes = {}) {
    let dependent_report = {};
    let change_message = '';

    // If skippable, determine if changes apply to any target slots.  
    // If no pertinent key changes, return an empty report
    if (skippable && ! this.hasRowKeyChange(class_name, {0:changes})) { //dummy row_changes row
      return [dependent_report, change_message];
    }

    // Copy and generate messaging for cascading classes and their related rows report
    this.context.crudGetDependentRows(class_name, skippable, changes);
    for (let [dependent_name] of this.context.relations[class_name].dependents.entries()) {

      let dependent_rep = this.context.dependent_rows.get(dependent_name);
      dependent_report[dependent_name] = dependent_rep;

      if (class_name != dependent_name && dependent_rep.count) {
        let fkey_vals = Object.entries(dependent_rep.fkey_vals)
        .filter(([x, y]) => y != null)
        .join('\n      ')
        .replaceAll(',', ': ');
        change_message += `\n - ${dependent_rep.count} ${dependent_name} record(s) with key:\n      ${fkey_vals}`;
      }
    }
    return [dependent_report, change_message];
  }

  hasRowKeyChange(class_name, changes) {
    // If a change affects a slot that is a target of other tables, return true.
    for (const key in this.context.relations[class_name].target_slots) {
      for (const [row, change] of Object.entries(changes)) {
        //console.log("CHANGE",class_name, "change", change,"KEY", key, row)
        if (key in change) {
          return true;
        }
      }
    }
    return false;
  }

  /* Return row_change to validate cell changes, row by row. 
    It is a
   * tacitly ordered dict of row #s.
   * {[row]: {[slot_name]: {old_value: _, value: _} } }
   */
  // GRID CHANGES NOW REFERENCES slot_name aka column name
  getRowChanges(grid_changes) {
    let row_changes = {};

    for (const change of grid_changes) {
      // FUTURE switch to this when implementing Handsontable col.data=[slot_name]
      // let slot = this.slots[this.slot_name_to_column[change[1]]]
      let slot = this.slots[change[1]];
      



      let row = change[0];
      // A user entry of same value as existing one is
      // still counted as a change, so blocking that case here.
      // Also blocking any falsy equality - null & '' & undefined
      if (change[2] !== change[3] || !change[2] != !change[3]) {
        if (!(row in row_changes)) {
          row_changes[row] = {};
        }

        row_changes[row][slot.name] = {
          slot: slot,
          col: change[1],
          old_value: change[2],
          value: change[3],
        };
      }
    }
    return row_changes;
  }

  updateColumnSettings(columnIndex, options) {
    const currentColumns = this.hot.getSettings().columns || [];
    currentColumns[columnIndex] = {
      ...currentColumns[columnIndex],
      ...options,
    };
    this.hot.updateSettings({ columns: currentColumns });
  }

  /** Called via Footer.js, and also in right click menu DH contextMenu click
   * row_above, row_below.
   * numRows is specified number of rows to add to current dh table. If table
   * has foreign key(s) to another table, the other table's focused row will
   * control foreign key values added to this table.
   * @param {String} row_where = 'insert_row_below' | 'insert_row_above'
   */
  addRows(row_where, numRows, startRowIndex = false) {
    numRows = parseInt(numRows); // Coming from form string input.
    // Get the starting row index where the new rows will be added
    if (startRowIndex === false) startRowIndex = this.hot.countSourceRows();

    let parents = this.context.crudGetParents(this.template_name);
    // If this has no foreign key parent table(s) then go ahead and add x rows.
    if (isEmpty(parents)) {
      // Insert the new rows below the last existing row
      this.hot.alter(row_where, startRowIndex, numRows);
      return;
    }

    // Here we have a dependent table that must locate values in its parent
    // table(s) for primary key values.
    let [required_selections, errors] =
      this.context.crudGetForeignKeyValues(parents);
    if (errors) {
      // Prompt user to select appropriate parent table row(s) first.
      // FRINGE ISSUE: When user selects row/cell on subordinate table, then mouse-clicks on disabled tab, and then add-row, they get popup pertaining to disabled tab table.
      $('#empty-parent-key-modal-info').html(errors);
      $('#empty-parent-key-modal').modal('show');
      return;
    }

    this.hot.alter(row_where, startRowIndex, numRows);

    // Populate new rows with selected foreign key value(s)
    // "add_row" is critical so we can ignore that in before_change event.
    // Otherwise a dependent view with "this change will impact ..."
    // message will be triggered.
    this.hot.batchRender(() => {
      for (let row = startRowIndex; row < startRowIndex + numRows; row++) {
        Object.entries(required_selections).forEach(([slot_name, value]) => {
          const col = this.slot_name_to_column[slot_name];
          this.hot.setDataAtCell(row, parseInt(col), value.value, 'add_row');
        });
      }
    });
  }

  /**
   * Hides the columns at the specified indexes within the Handsontable instance.
   *
   * @param {number[]} columns Array of column indexes to be hidden.
   */
  hideColumns(columns) {
    const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
    hiddenColsPlugin.hideColumns(columns);
    this.render();
  }

  showAllColumns() {
    this.hot.scrollViewportTo(0, 1);
    const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
    const hidden = hiddenColsPlugin.getHiddenColumns();
    if (hidden) hiddenColsPlugin.showColumns(hidden);
    this.render();
  }

  showRequiredColumns() {
    this._updateVisibility((field) => !field.required);
  }

  showRecommendedColumns() {
    this._updateVisibility((field) => !(field.required || field.recommended));
  }

  /**
   * Updates column visibility based on a provided filter "exclusionFunction".
   *
   * @param {Function} exclusionFunction determines if a column should be excluded from showing. It receives the field object and index and returns a boolean where true means the column should be hidden.
   */
  _updateVisibility(exclusionFunction) {
    this.showAllColumns();
    const hiddenColumns = this.slots
      .map(exclusionFunction)
      .reduce((acc, hide, index) => {
        if (hide) acc.push(index);
        return acc;
      }, []);
    this.hideColumns(hiddenColumns);
  }

  /**
   * Shows only the columns belonging to a specific section title within the table.
   * Optionally, it can also show or hide the first column.
   *
   * @param {string} sectionTitle The section title based on which columns will be filtered.
   * @param {boolean} showFirstColumn If true, the first column will always be shown regardless of the section title. Defaults to true.
   */
  showColumnsBySectionTitle(sectionTitle, showFirstColumn = true) {
    if (this.slots.some((field) => field.section_title === sectionTitle)) {
      this._updateVisibility(
        (field, index) =>
          // don't hide the first column (which is typically an ID)
          !(showFirstColumn && index === 0) &&
          field.section_title !== sectionTitle
      );
    }
  }

  changeRowVisibility(id) {
    // Grid becomes sluggish if viewport outside visible grid upon re-rendering
    this.hot.scrollViewportTo(0, 1);

    // Un-hide all currently hidden cols
    const hiddenRowsPlugin = this.hot.getPlugin('hiddenRows');
    const hidden = hiddenRowsPlugin.getHiddenRows();
    hiddenRowsPlugin.showRows(hidden);

    // Hide user-specified rows
    const rows = [...Array(this.hot.countSourceRows()).keys()];
    const emptyRows = rows.filter((row) => this.hot.isEmptyRow(row));
    let hiddenRows = [];

    if (id === 'show-valid-rows-dropdown-item') {
      hiddenRows = Object.keys(this.invalid_cells).map(Number);
      hiddenRows = [...hiddenRows, ...emptyRows];
    } else if (id === 'show-invalid-rows-dropdown-item') {
      const invalidRowsSet = new Set(
        Object.keys(this.invalid_cells).map(Number)
      );
      hiddenRows = rows.filter((row) => !invalidRowsSet.has(row));
      hiddenRows = [...hiddenRows, ...emptyRows];
    }

    hiddenRowsPlugin.hideRows(hiddenRows);
    this.render();
  }

  filterAll(dh) {
    // Access the Handsontable instance's filter plugin
    const filtersPlugin = dh.hot.getPlugin('filters');

    // Clear any existing filters
    filtersPlugin.clearConditions();

    // Add a filter condition that no row will satisfy
    // For example, set a condition on the first column to check if the value
    // equals a non-existent value
    filtersPlugin.addCondition(0, 'eq', ['###NO_ROW_MATCH###']);

    // Apply the filter to hide all rows
    filtersPlugin.filter();
  }

  filterAllEmpty(dh) {
    const filtersPlugin = dh.hot.getPlugin('filters');

    // Clear any existing filters
    filtersPlugin.clearConditions();

    // Apply a filter condition to hide all empty rows
    filtersPlugin.addCondition((row /*col, value*/) => {
      return !dh.hot.getDataAtRow(row).every(isEmptyUnitVal);
    });

    filtersPlugin.filter();
  }

  renderSemanticID(curieOrURI, as_markup = false) {
    if (curieOrURI) {
      if (curieOrURI.toLowerCase().startsWith('http')) {
        if (as_markup) return `[${curieOrURI}](${curieOrURI})`;

        return `<a href="${curieOrURI}" target="_blank">${curieOrURI}</a>`;
      } 
      else if (curieOrURI.includes(':')) {
        const [prefix, reference] = curieOrURI.split(':', 2);
        if (prefix && reference && prefix in this.schema.prefixes) {
          // Lookup curie
          let url =
            this.schema.prefixes[prefix]['prefix_reference'] + reference;
          if (as_markup) return `[${curieOrURI}](${url})`;
          return `<a href="${url}" target="_blank">${curieOrURI}</a>`;
        } else return `${curieOrURI}`;
      }
    }
    return '';
  }

  /**
   * Presents reference guide in a popup.
   * @param {String} mystyle simple css stylesheet commands to override default.
   */
  renderReference(mystyle = null) {
    let schema_template = this.schema.classes[this.template_name];

    let style = `
    body {
      background-color:#fff;
      font-family: arial;
      margin:5% 5% 5% 5%;
    }
    
    table {
      width: 100%;
      table-layout: fixed;
    }
    
    table tr.section {
      background-color:#f0f0f0;
      padding:10px;
      font-size:1.5rem;
    }
    
    table th {font-weight: bold; text-align: left; font-size:1.3rem;}
    table th.label {font-weight:bold; width: 25%}
    table th.description {width: 20%}
    table th.guidance {width: 30%}
    table th.example {width: 15%}
    table th.data_status {width: 15%}
    table td {vertical-align: top; padding:5px;border-bottom:1px dashed silver;}
    table td.label {font-weight:bold;}
    
    ul { padding: 0; }
    `;

    if (mystyle != null) {
      style = mystyle;
    }

    let row_html = '';
    for (const section of this.sections) {
      row_html += `<tr class="section">
      <td colspan="${this.columnHelpEntries.length - 1}"><h3>${
        section.title || section.name
      }</h3></td>
      </tr>
      `;
      for (const slot of section.children) {
        const slot_dict = this.getCommentDict(slot);

        const slot_uri = this.renderSemanticID(slot_dict.slot_uri);

        row_html += '<tr>';
        if (this.columnHelpEntries.includes('column')) {
          row_html += `<td class="label">${slot_dict.title}<br>${slot_uri}</td>`;
        }
        if (this.columnHelpEntries.includes('description')) {
          row_html += `<td>${slot_dict.description}</td>`;
        }
        if (this.columnHelpEntries.includes('guidance')) {
          row_html += `<td>${slot_dict.guidance}</td>`;
        }
        if (this.columnHelpEntries.includes('examples')) {
          row_html += `<td>${slot_dict.examples}</td>`;
        }
        if (this.columnHelpEntries.includes('menus')) {
          row_html += ` <td>${slot_dict.menus || ''}</td>`;
        }
        row_html += '</tr>';
      }
    }

    // Note this may include more enumerations than exist in a given template.
    let enum_html = ``;
    for (const key of Object.keys(this.schema.enums).sort()) {
      const enumeration = this.schema.enums[key];
      let title =
        enumeration.title != enumeration.name ? enumeration.title : '';
      enum_html += `<tr class="section">
      <td colspan="2" id="${enumeration.name}">${enumeration.name}</td>
      <td colspan="2" style="font-size:1.2rem;">"${title}"<br>${this.renderSemanticID(
        enumeration.enum_uri
      )}</td>
      </tr>`;

      for (const item_key in enumeration.permissible_values) {
        const item = enumeration.permissible_values[item_key];
        let text = item.text == item_key ? '' : item.text;
        let title = !item.title || item.title == item_key ? '' : item.title;
        enum_html += `<tr>
        <td>${this.renderSemanticID(item.meaning)}</td>
        <td>${item_key}</td>
        <td>${text}</td>
        <td>${title}</td>
        </tr>`;
      }
    }

    var win = window.open(
      '',
      'Reference',
      'toolbar=no,location=yes,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600'
    );

    win.document.open(); // For reloads
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${i18next.t('reference_guide_title')} "${
      schema_template.title || schema_template.name
    }" template</title>
  <meta name="description" content="${schema_template.description || ''}">
  <style>${style}</style>
</head>
<body>
  <div>
    <h2>${i18next.t('reference_guide_title')} "${
      schema_template.title || schema_template.name
    }" template</h2>
    <hr/>
    <p>${schema_template.description || ''}</p>
    
    <table>
      <thead>
        <tr>
    ${
      this.columnHelpEntries.includes('column')
        ? `<th class="label">${i18next.t('help-sidebar__column')}</th>`
        : ''
    }
    ${
      this.columnHelpEntries.includes('description')
        ? `<th class="description">${i18next.t(
            'help-sidebar__description'
          )}</th>`
        : ''
    }
    ${
      this.columnHelpEntries.includes('guidance')
        ? `<th class="guidance">${i18next.t('help-sidebar__guidance')}</th>`
        : ''
    }
    ${
      this.columnHelpEntries.includes('examples')
        ? `<th class="example">${i18next.t('help-sidebar__examples')}</th>`
        : ''
    }
    ${
      this.columnHelpEntries.includes('menus')
        ? `<th class="data_status">${i18next.t('help-sidebar__menus')}</th>`
        : ''
    }
          </tr>
        </thead>
        <tbody>
          ${row_html}
        </tbody>
      </table>
    </div>
    <div>
      <table>
        <thead>
          <tr class="section">
            <th colspan="4">${i18next.t('help-picklists')}</th>
          </tr>
        </thead>
        <tbody>${enum_html}</tbody>
      </table>
    </div>
  </body>
</html>`);
    return false;
  }

  /**
   * Get the 0-based y-index of every field on the grid.
   * @param {Object} data See TABLE.
   * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
   *     the grid.
   */
  getFieldYCoordinates() {
    const ret = {};
    for (const [i, field] of this.slots.entries()) {
      ret[field.title] = i;
    }
    return ret;
  }

  getColumnCoordinates() {
    const ret = {};
    let column_ptr = 0;
    for (const section of this.sections) {
      ret[section.title] = column_ptr;
      for (const column of section.children) {
        ret[' . . ' + column.title] = column_ptr;
        column_ptr++;
      }
    }
    return ret;
  }

  /**
   * Scroll grid to specified column.
   * @param {String} row 0-based index of row to scroll to.
   * @param {String} column 0-based index of column to scroll to.
   * @param {Object} data See TABLE.
   * @param {Object} hot Handsontable instance of grid.
   */
  scrollTo(row, column) {
    const hiddenColsPlugin = this.hot.getPlugin('hiddenColumns');
    const hidden = hiddenColsPlugin.getHiddenColumns();
    if (hidden.includes(column)) {
      // If user wants to scroll to a hidden column, make all columns unhidden
      this.showAllColumns();
    }

    this.hot.selectCell(
      parseInt(row),
      parseInt(column),
      parseInt(row),
      parseInt(column),
      true
    );
    //Ensures field is positioned on left side of screen.
    this.hot.scrollViewportTo(row, column);
  }

  /***************************** PRIVATE functions *************************/

  /**
   * Load data into table as an array of objects. The keys of each object are
   * field names and the values are the cell values.
   *
   * @param {Array<Object>} data table data
   */
  loadDataObjects(data, locale = null) {

    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      // An object was provided, so try to pick out the grid data from
      // one of it's slots.
      const inferredIndexSlot = this.getInferredIndexSlot();

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
        const dataArray = dataObjectToArray(row, this,  { //false,
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

    return this.matrixFieldChangeRules(listData);
  }

  /**
   * Parses binary spreadsheet data into a JSON matrix and processes it for use.
   * If header rows are detected in the data, they are removed, and any additional
   * data transformations or field change rules are applied before returning.
   * In cases where headers need to be defined or are incomplete, a modal is triggered
   * for user specification.
   *
   * @param {string|Buffer} data - The binary string or buffer of the spreadsheet data.
   * @returns {Array<Array<?>>|null} A matrix representing the processed spreadsheet data.
   *                                  Returns `null` if headers need to be specified by the user.
   * @throws Will throw an error if the given data cannot be read as a workbook.
   */
  loadSpreadsheetData(data) {
    const workbook = xlsxRead(data, {
      type: 'binary',
      raw: true,
      cellDates: true, // Ensures date formatted as  YYYY-MM-DD dates
      dateNF: 'yyyy-mm-dd', //'yyyy/mm/dd;@'
    });

    // Defaults to 1st tab if current DH instance doesn't match sheet tab.
    // NOTE: xls, xlsx worksheet tabs are usually container attribute names,
    // rather than template_name or template title.
    // See createWorkbookFromJSON() in files.js, called in Toolbar.js
    let sheet_name = workbook.SheetNames[0];
    if (workbook.Sheets[this.template_name])
      sheet_name = this.template_name;
    else {
      if (this.template.title && workbook.Sheets[this.template.title])
        sheet_name = this.template.title;
      else if ('Container' in this.schema.classes) {
        const match = Object.entries(this.schema.classes['Container'].attributes).find(
      ([cls_key, { name, range }]) => range == this.template_name);
        if (match) {
          sheet_name = match[0];
        }
      }
    }

    const worksheet = updateSheetRange(workbook.Sheets[sheet_name]);

    const matrix = XlsxUtils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      range: 0,
    });

    const headerRowData = this.compareMatrixHeadersToGrid(matrix);
    if (headerRowData > 0) {
      return this.matrixFieldChangeRules(matrix.slice(headerRowData));
    } else {
      this.launchSpecifyHeadersModal(matrix);
      return null;
    }
  }

  /**
   * Ask user to specify row in matrix containing secondary headers before load.
   * Calls `alertOfUnmappedHeaders` if necessary.
   * @param {Array<Array<String>} matrix Data that user must specify headers for.
   * @param {Object} hot Handsontable instance of grid.
   * @param {Object} data See `data.js`.
   */
  launchSpecifyHeadersModal(matrix) {
    let flatHeaders = this.getFlatHeaders();
    const self = this;
    if (flatHeaders) {
      $('#field-mapping').prepend(
        '<col></col>'.repeat(flatHeaders[1].length + 1)
      );
      $('#expected-headers-tr').html(
        '<td><b>Expected second row</b></td> <td>' +
          flatHeaders[1].join('</td><td>') +
          '</td>'
      );
      $('#actual-headers-tr').html(
        '<td><b>Imported second row</b></td> <td>' +
          matrix[1].join('</td><td>') +
          '</td>'
      );
      flatHeaders[1].forEach(function (item, i) {
        if (item != matrix[1][i]) {
          $('#field-mapping col').get(i + 1).style.backgroundColor = 'orange';
        }
      });

      $('#specify-headers-modal').modal('show');
      $('#specify-headers-confirm-btn').click(() => {
        const specifiedHeaderRow = parseInt($('#specify-headers-input').val());
        if (!isValidHeaderRow(matrix, specifiedHeaderRow)) {
          $('#specify-headers-err-msg').show();
        } else {
          // Try to load data again using User specified header row
          const mappedMatrixObj = self.mapMatrixToGrid(
            matrix,
            specifiedHeaderRow - 1
          );
          $('#specify-headers-modal').modal('hide');
          self.context.runBehindLoadingScreen(() => {
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
            return true; // Removes runBehindLoadingScreen() opacity.
          });
        }
      });
      return false; // Trying to fix sporadic semi-opaque grey screen when cancelling.
    }
  }

  /**
   * Determine if first or second row of a matrix has the same headers as the
   * grid's secondary (2nd row) headers.  If neither, return false.
   * @param {Array<Array<String>>} matrix
   * @param {Object} data See `data.js`.
   * @return {Integer} row that data starts on, or false if no exact header row
   * recognized.
   */
  compareMatrixHeadersToGrid(matrix) {
    const expectedSecondRow = this.getFlatHeaders()[1];
    const actualFirstRow = matrix[0]; // Usually section headers in sparse array
    const actualSecondRow = matrix[1];  // Usually field names
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow)) {
      return 1;
    }
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow)) {
      return 2;
    }
    return false;
  }

  /**
   * Construct a dictionary of source field names pointing to column index
   * @param {Object} fields A flat version of data.js.
   * @return {Map<String, Integer>} Dictionary of all fields.
   */
  getFieldNameMap(fields) {
    const map = {};
    for (const [fieldIndex, field] of fields.entries()) {
      map[field.name] = fieldIndex;
    }
    return map;
  }

  /**
   * Construct a dictionary of source field TITLES pointing to column index
   * @param {Object} fields A flat version of data.js.
   * @return {Map<String, Integer>} Dictionary of all fields.
   */
  getFieldTitleMap(fields) {
    const map = {};
    for (const [fieldIndex, field] of fields.entries()) {
      map[field.title] = fieldIndex;
    }
    return map;
  }

  /**
   * Create a matrix containing the grid's headers. Empty strings are used to
   * indicate merged cells.
   * @return {Array<Array<String>>} Grid headers.
   */
  getFlatHeaders() {
    const rows = [[], []];

    for (const parent of this.sections) {
      let min_cols = parent.children.length;
      if (min_cols < 1) {
        // Close current dialog and switch to error message
        //$('specify-headers-modal').modal('hide');
        //$('#unmapped-headers-modal').modal('hide');
        const errMsg = `The template for the loaded file has a configuration error:<br>
          <strong>${parent.title}</strong><br>
          This is a field that has no parent, or a section that has no fields.`;
        $('#unmapped-headers-list').html(errMsg);
        $('#unmapped-headers-modal').modal('show');

        return false;
      }
      rows[0].push(parent.title);
      // pad remainder of first row columns with empty values
      if (min_cols > 1) {
        rows[0].push(...Array(min_cols - 1).fill(''));
      }
      // Now add 2nd row child titles
      rows[1].push(...parent.children.map((child) => child.title));
    }
    return rows;
  }

  /**
   * Map matrix columns to grid columns.
   * Currently assumes mapped columns will have the same label, but allows them
   * to be in a different order. If the matrix is missing a column, a blank
   * column is used.
   * @param {Array<Array<String>>} matrix
   * @param {Number} matrixHeaderRow Row containing matrix's column labels.
   * @return {MappedMatrixObj} Mapped matrix and details.
   */
  mapMatrixToGrid(matrix, matrixHeaderRow) {
    const expectedHeaders = this.getFlatHeaders();
    const expectedSecondaryHeaders = expectedHeaders[1];
    const actualSecondaryHeaders = matrix[matrixHeaderRow];

    // Map current column indices to their indices in matrix to map
    const headerMap = {};
    const unmappedHeaders = [];
    for (const [i, expectedVal] of expectedSecondaryHeaders.entries()) {
      headerMap[i] = actualSecondaryHeaders.findIndex((actualVal) => {
        return actualVal === expectedVal;
      });
      if (headerMap[i] === -1) {
        unmappedHeaders.push(expectedVal);
      }
    }

    const dataRows = matrix.slice(matrixHeaderRow + 1);
    const mappedDataRows = [];
    // Iterate over non-header-rows in matrix to map
    for (const i of dataRows.keys()) {
      mappedDataRows[i] = [];
      // Iterate over columns in current validator version
      for (const j of expectedSecondaryHeaders.keys()) {
        // -1 means the matrix to map does not have this column
        if (headerMap[j] === -1) {
          mappedDataRows[i][j] = '';
        } else {
          mappedDataRows[i][j] = dataRows[i][headerMap[j]];
        }
      }
    }

    return {
      matrix: [...expectedHeaders, ...mappedDataRows],
      unmappedHeaders: unmappedHeaders,
    };
  }

  /**
   * Create a matrix containing the nested headers supplied to Handsontable.
   * These headers are HTML strings, with useful selectors for the primary and
   * secondary header cells.
   * @return {Array<Array>} Nested headers for Handontable grid.
   */
  getNestedHeaders() {
    const sections = this.sections;
    const rows = [[], []];
    for (const parent of sections) {
      rows[0].push({
        label: `<h5 class="pt-2 pl-1">${parent.title}</h5>`,
        colspan: parent.children.length,
      });
      for (const child of parent.children) {
        const required = child.required ? ' required' : '';
        const recommended = child.recommended ? ' recommended' : '';
        rows[1].push(
          `<div class="secondary-header-text${required}${recommended}">${child.title}</div>`
        );
      }
    }
    return rows;
  }

  /**
   * Create an array of cell properties specifying data type for all grid columns.
   * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
   * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
   *
   * REEXAMINE ABOVE ASSUMPTION - IT MAY BE BECAUSE OF not using batch() 
   * operations & setDataAtCell issue that is now solved.
   *
   * @param {Object} data See TABLE.
   * @return {Array<Object>} Cell properties for each grid column.
   */
  getColumns() {
    let ret = [];

    // NOTE: this single loop lets us assume that columns are produced in the same indexical order as the fields
    // Translating between columns and fields may be necessary as one can contain more information than the other.
    for (let slot of this.slots) {
      let col = {};
      if (slot.required) {
        col.required = slot.required;
      }
      if (slot.recommended) {
        col.recommended = slot.recommended;
      }

      col.name = slot.name;
      // FUTURE: Implement this - it allows columns to be referenced by name, but affects
      // a number of handsontable calls, e.g. event grid_changes[1] is slot name instead
      // of integer.
      // col.data = slot.name;

      col.source = null;
      if (slot.sources) {
        col.source = this.updateSources(slot)

        if (slot.multivalued === true) {
          col.editor = 'text';
          col.renderer = multiKeyValueListRenderer(slot);
          col.meta = {datatype: 'multivalued'} // metadata
        } else {
          col.type = 'key-value-list'; // normally 'dropdown'
          if (
            !slot.sources.includes('NullValueMenu') ||
            slot.sources.length > 1
          ) {
            col.trimDropdown = false; // Allow expansion of pulldown past field width
          }
        }
      };
      switch (slot.datatype) {
        case 'xsd:date':
          col.type = 'dh.date';
          col.allowInvalid = true; // making a difference?
          col.flatpickrConfig = {
            dateFormat: this.dateFormat, //yyyy-MM-dd
            enableTime: false,
          };
          break;
        case 'xsd:dateTime':
          col.type = 'dh.datetime';
          col.flatpickrConfig = {
            dateFormat: this.datetimeFormat,
          };
          break;
        case 'xsd:time':
          col.type = 'dh.time';
          col.flatpickrConfig = {
            dateFormat: this.timeFormat,
          };
          break;
      }

      if (typeof slot.getColumn === 'function') {
        col = slot.getColumn(this, col);
      }

      ret.push(col);
    }

    return ret;
  }

  /** Function for initializing Handsontable dropdown and key-value-list element
   * source.  Call to refresh a given col specification with dynamic content.
   *  Note that Dataharmonizer ".sources" => Column ".source"
   */
  updateSources(slot) {
    return slot.sources.flatMap((source) => {
      if (slot.permissible_values[source])
        return Object.values(slot.permissible_values[source])
          .reduce((acc, item) => {
            acc.push({
              label: titleOverText(item),
              value: titleOverText(item), // FUTURE: CHANGE TO item.text ????!!!!!!
              _id: item.text,
            });
            return acc;
          },
          []
        );
      else {
        // Special case where these menus are empty on initialization for schema editor.
        if (! ['SchemaTypeMenu','SchemaClassMenu','SchemaEnumMenu','SchemaSlotGroupMenu'].includes(source))
          alert(`PROGRAMMING ERROR: Slot range references enum ${source} but this was not found in enumeration dictionary, or it has no selections`);
        return [];
      }
    });
  };

  /**
   * Enable multiselection on select rows.
   * Indentation workaround: multiples of "  " double space before label are
   * taken to be indentation levels.
   * @param {Object} hot Handonstable grid instance.
   * @param {Object} data See TABLE.
   * @return {Object} Grid instance with multiselection enabled on columns
   * specified as such in the vocabulary.
   */
  enableMultiSelection() {
    const self = this;
    const dh = this.hot;
    this.hot.updateSettings({
      afterBeginEditing: function (row, col) {
        if (
          self.slots[col].flatVocabulary &&
          self.slots[col].multivalued === true
        ) {
          const value = dh.getDataAtCell(row, col);
          const selections = parseMultivaluedValue(value);
          const formattedValue = formatMultivaluedValue(selections);

          // Cleanup of empty values that can occur with leading/trailing or double ";"
          if (value !== formattedValue) {
            dh.setDataAtCell(row, col, formattedValue, 'prevalidate');
          }
          let content = '';
          if (self.slots[col].sources) {
            self.slots[col].sources.forEach((source) => {
              Object.values(self.slots[col].permissible_values?.[source] || {}).forEach(
                (permissible_value) => {
                  const field = permissible_value.text;
                  const field_trim = field.trim();
                  let selected = selections.includes(field_trim)
                    ? 'selected="selected"'
                    : '';
                  content += `<option value="${field_trim}" ${selected}'>${titleOverText(
                    permissible_value
                  )}</option>`;
                }
              );
            });
          }

          $('#field-description-text').html(
            `<span data-i18n="${''}">
            ${self.slots[col].title}
              </span>
            <select multiple class="multiselect" rows="15">${content}</select>`
          );
          $('#field-description-modal').modal('show');
          $('#field-description-text .multiselect')
            .selectize({
              maxItems: null,
              selectOnTab: false,
              /*
              onBlur: function(e, dest) {alert('blurring')}, // works
              onDelete: function(values) { // works
                return confirm(values = array of deleted items);
              },
              */
              render: {
                item: function (data, escape) {
                  return `<div>` + escape(data.text) + `</div>`;
                },
                option: (data, escape) => {
                  const value = data.value.trim();
                  let indentation = 12 + data.text.trim().search(/\S/) * 8; // pixels
                  return `<div style="padding-left:${indentation}px" class="option ${
                    value === '' ? 'selectize-dropdown-emptyoptionlabel' : ''
                  }">${escape(data.text)}</div>`;
                },
              },
            }) // must be rendered when html is visible
            // See https://selectize.dev/docs/events
            /*.on('destroy', ...) not working because .destroy() never fired.

            // Problem: change fires 'beforeChange' on each setDataAtCell
            .on('change', function () {
              let newValCsv = formatMultivaluedValue(
                $('#field-description-text .multiselect').val()
              );
              dh.setDataAtCell(row, col, newValCsv, 'multiselect_add');
            });
            */

            // HACK TO GET A SINGLE beforeChange event on "OK" of .selectize
            // so that validation happens only once on updated multiselect items.
            $('#field-description-modal button[data-dismiss]').off().on('click', function () {
              let newValCsv = formatMultivaluedValue(
                $('#field-description-text .multiselect').val()
              );
              dh.setDataAtCell(row, col, newValCsv, 'multiselect_change');
            })
            
          $('#field-description-text .multiselect')[0].selectize.focus();
        }
      },
    });
  }

  fillColumn(colname, value) {
    const fieldYCoordinates = this.getFieldYCoordinates();

    // console.log(
    //   colname,
    //   value,
    //   fieldYCoordinates,
    //   this.getFieldNameMap(fields),
    //   this.getFieldTitleMap(fields)
    // );

    // ENSURE colname hasn't been tampered with (the autocomplete allows
    // other text)
    if (colname in fieldYCoordinates) {
      let changes = [];
      for (let row = 0; row < this.hot.countRows(); row++) {
        // .countSourceRows()??
        if (!this.hot.isEmptyRow(row)) {
          let col = fieldYCoordinates[colname];
          if (this.hot.getDataAtCell(row, col) !== value) {
            changes.push([row, col, value]);
          }
        }
      }
      if (changes.length > 0) {
        this.hot.setDataAtCell(changes);
        this.render();
      }
    }
  }

  /**
   * Get an HTML string that describes a field, its examples etc. for display
   * in column header.
   * @param {Object} field Any object under `children` in TABLE.
   * @return {String} HTML string describing field.
   */
  getComment(field) {
    let slot_dict = this.getCommentDict(field);

    let ret = '';

    // NOTE: shares internationalization with sidebar
    // Should probably abstract the HTML into its own component template
    if (this.columnHelpEntries.includes('column')) {
      ret += `<p><strong data-i18n="help-sidebar__column">${i18next.t(
        'help-sidebar__column'
      )}</strong>: ${field.title || field.name}</p>`;
    }

    // Requires markup treatment of URLS.
    const slot_uri = this.renderSemanticID(field.slot_uri);
    if (field.slot_uri && this.columnHelpEntries.includes('slot_uri')) {
      ret += `<p><strong data-i18n="help-sidebar__column">${i18next.t(
        'help-sidebar__slot_uri'
      )}</strong>: ${slot_uri}</p>`;
    }

    if (field.description && this.columnHelpEntries.includes('description')) {
      ret += `<p><strong data-i18n="help-sidebar__description">${i18next.t(
        'help-sidebar__description'
      )}</strong>: ${field.description}</p>`;
    }

    if (slot_dict.guidance && this.columnHelpEntries.includes('guidance')) {
      ret += `<p><strong data-i18n="help-sidebar__guidance">${i18next.t(
        'help-sidebar__guidance'
      )}</strong>: ${slot_dict.guidance}</p>`;
    }

    if (slot_dict.examples && this.columnHelpEntries.includes('examples')) {
      ret += `<p><strong data-i18n="help-sidebar__examples">${i18next.t(
        'help-sidebar__examples'
      )}</strong>: </p>${slot_dict.examples}`;
    }

    if (slot_dict.sources && this.columnHelpEntries.includes('menus')) {
      ret += `<p><strong data-i18n="help-sidebar__menus">${i18next.t(
        'help-sidebar__menus'
      )}</strong>: </p>${slot_dict.sources}`;
    }

    return renderContent(ret);
  }

  getCommentDict(field) {
    /* HACK: due to nested arrays, this needs to keep track of when comments
     * and examples need to be overriden. This might be happening elsewhere in
     * the codebase (particularly with slices/...). Our version of deepMerge 
     * forces array overrides, considered only with dictionaries as objects.
     ISSUE: THIS SHOULDN'T BE NECESSARY WITH NEW CODE!!!
     ENUMERATIONS AREN'T GETTING TRANSLATED?

    let field = deepMerge( //uses getCommentDict(input_field)
      deepMerge(input_field, this.context.template.default.schema.slots[input_field.name]),
      this.context.template.localized.schema.slots[input_field.name]
    );
     */
    let guide = {
      title: field.title,
      name: field.name,
      slot_uri: field.slot_uri,
      description: urlToClickableAnchor(field.description) || '',
      guidance: '',
      examples: '',
      sources: '',
      menus: '',
    };

    let guidance = [];
    if (field.comments && field.comments.length) {
      guidance = guidance.concat(field.comments);
    }
    if (field.pattern) {
      guidance.push(
        i18next.t('reference_guide_msg_pattern_regex') + '<br>' + field.pattern
      );
    }
    if (field.structured_pattern) {
      guidance.push(
        i18next.t('reference_guide_msg_pattern_hint') +
          ' ' +
          field.structured_pattern.syntax
      );
    }
    const hasMinValue = field.minimum_value != null;
    const hasMaxValue = field.maximum_value != null;
    if (hasMinValue || hasMaxValue) {
      let paragraph = i18next.t('reference_guide_msg_value_comparison') + ' ';
      if (hasMinValue && hasMaxValue) {
        paragraph +=
          i18next.t('reference_guide_msg_value_comparison_btwn_1') +
          ` ${field.minimum_value} ` +
          i18next.t('reference_guide_msg_value_comparison_btwn_2') +
          ` ${field.maximum_value} ` +
          i18next.t('reference_guide_msg_value_comparison_btwn_3');
      } else if (hasMinValue) {
        paragraph +=
          i18next.t('reference_guide_msg_value_comparison_gte') +
          ` ${field.minimum_value}.`;
      } else if (hasMaxValue) {
        paragraph +=
          i18next.t('reference_guide_msg_value_comparison_lte') +
          ` ${field.maximum_value}.`;
      }
      guidance.push(paragraph);
    }
    if (field.identifier) {
      guidance.push(i18next.t('reference_guide_msg_unique_record'));
    }
    if (field.sources && field.sources.length) {
      let menus = [];
      for (const item of field.sources) {
        menus.push(
          '<a href="#' + item + '" target="Reference">' + item + '</a>'
        );
      }
      guide.menus = '<ul><li>' + menus.join('</li><li>') + '</li></ul>';
      guide.sources =
        '<ul><li>' + field.sources.join('</li><li>') + '</li></ul>';
    }
    if (field.multivalued) {
      guidance.push(i18next.t('reference_guide_msg_more_than_one_selection'));
    }

    guide.guidance = guidance
      .map(function (paragraph) {
        return '<p>' + paragraph + '</p>';
      })
      .join('\n');

    // Makes full URIs that aren't in markup into <a href>
    if (guide.guidance) guide.guidance = urlToClickableAnchor(guide.guidance);

    if (field.examples && field.examples.length) {
      let examples = [];
      let first_item = true;
      for (const [, item] of Object.entries(field.examples)) {
        if (item.description && item.description.length > 0) {
          if (first_item === true) {
            examples.push(i18next.t(item.description) + ':\n<ul>');
            first_item = false;
          } else {
            examples += '</ul>' + i18next.t(item.description) + ':\n<ul>';
          }
        }

        if (first_item === true) {
          first_item = false;
          examples += '<ul><li>' + i18next.t(item.value) + '</li>';
        } else {
          examples += '<li>' + i18next.t(item.value) + '</li>';
        }
      }
      guide.examples = examples + '</ul>';
    }

    return guide;
  }

  /**
   * Get grid data without trailing blank rows.
   * @return {Array<Array<String>>} Grid data without trailing blank rows.
   */
  getTrimmedData() {
    const rowStart = 0;
    const rowEnd = this.hot.countRows() - this.hot.countEmptyRows(true) - 1;
    const colStart = 0;
    const colEnd = this.hot.countCols() - 1;
    return this.hot.getData(rowStart, colStart, rowEnd, colEnd);
  }

  /**
   * Get grid data as a list of objects. The keys of each object are the
   * field names and the values are parsed according to the field's datatype.
   * If parsing fails the original string value is used instead. This behavior
   * can be changed using the `options` argument.
   *
   * The list of objects can optionally be wrapped in a top-level object based
   * on the `indexSlot` option.
   *
   * @param {Object} options An object with any of the following keys:
   *   - parseFailureBehavior: `KEEP_ORIGINAL` (default) | `REMOVE` | `THROW_ERROR`
   *     controls how values which are not parsable according to the column's datatype are
   *     handled. By default the original string value is retained. If this option is `REMOVE`
   *     the unparsable value is removed entirely. If this option is `THROW_ERROR`, an error
   *     is thrown when the first unparsable value is encountered.
   *   - indexSlot: boolean | string. If a string is provided the output will be an object
   *     with one key. The key is provided string. The value of the key is the array of objects
   *     representing the grid data. If `false` is provided (the default), the output will
   *     be the array of objects representing the grid data. If `true` is provided, an index
   *     slot will be inferred from the schema and the current template by identifying
   *     its a tree_root (https://w3id.org/linkml/tree_root) class and inspecting the ranges of
   *     attributes. If that inference fails, `fallbackIndexSlot` will be used instead.
   *   - fallbackIndexSlot: A string that will be used as the index slot name if indexSlot is
   *     `true` and the inference process fails to identify a unique index slot candidate.
   * @return {(Object|Array<Object>)}
   */
  /*
  getDataObjects(options = {}) {
    const { parseFailureBehavior, indexSlot, fallbackIndexSlot } = {
      parseFailureBehavior: KEEP_ORIGINAL,
      indexSlot: false,
      fallbackIndexSlot: 'rows',
      ...options,
    };
    const listData = this.hot.getData();
    const arrayOfObjects = listData
      .filter((row) => !rowIsEmpty(row))
      .map((row) =>
        dataArrayToObject(row, this.slots, {
          dateBehavior: this.dateExportBehavior,
          parseFailureBehavior,
          dateFormat: this.dateFormat,
          datetimeFormat: this.datetimeFormat,
          timeFormat: this.timeFormat,
        })
      );
    if (typeof indexSlot === 'string') {
      return {
        [indexSlot]: arrayOfObjects,
      };
    } else if (indexSlot === true) {
      let inferredIndexSlot = this.getInferredIndexSlot();
      if (!inferredIndexSlot) {
        inferredIndexSlot = fallbackIndexSlot;
      }
      return {
        [inferredIndexSlot]: arrayOfObjects,
      };
    } else {
      return arrayOfObjects;
    }
  }
  */
  getInferredIndexSlot() {
    if (this.template_name) {
      return this.template_name;
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
   *
   * From export_utils.js
   *
   */

  /**
   * Modifies exportHeaders map of fields so that each field contains an array
   * of one or more source fields by name that are used to compose it.
   * This code works on exportHeaders as either a Map or an array of
   * [['field_name',[fields],...]
   * @param {Array} exportHeaders See `export.js`.
   * @param {Array<Object>} fields array of all source fields.
   * @param {String} prefix export column prefix
   */
  getHeaderMap(exportHeaders, fields, prefix) {
    var headerMap = {};
    if (exportHeaders instanceof Map) {
      exportHeaders.forEach((headerIndex, headerValue) => {
        headerMap[headerValue] = headerIndex;
      });
    } else {
      // Array version: handles case where two columns have same name
      for (const [headerIndex, headerItem] of exportHeaders.entries()) {
        // Set mapping only for first instance of name. Access to
        // subsequent identical fields is handled in export.js loop.
        if (!(headerItem[0] in headerMap)) {
          headerMap[headerItem[0]] = headerIndex;
        }
      }
    }

    let field_message = [];
    let field_export_message = [];

    for (const [, field] of fields.entries()) {
      if (field.exportField && prefix in field.exportField) {
        for (const target of field.exportField[prefix]) {
          if ('field' in target) {
            var sources;
            if (exportHeaders instanceof Map) {
              if (target.field in headerMap) {
                field_export_message.push(target.field);
              } else {
                if (!exportHeaders.has(target.field)) {
                  field_message.push(target.field);
                  // Issue: all template driven exportHeader fields are showing AFTER export.js mentioned ones.
                  headerMap[target.field] = exportHeaders.length;
                  exportHeaders.set(target.field, []);
                }
              }
              let sources = exportHeaders.get(target.field);
              if (!sources) {
                console.warn(
                  'Malformed export.js exportHeader field:',
                  target.field
                );
              }
              // If given field isn't already mapped, add it.
              if (sources.indexOf(field.name) == -1) {
                sources.push(field.name);
              }
              exportHeaders.set(target.field, sources);
            } else {
              // Save to array
              if (target.field in headerMap) {
                field_export_message.push(target.field);
              } else {
                // Add field to exportHeaders
                // Issue: can this handle many-to-one mapping?
                field_message.push(target.field);
                headerMap[target.field] = exportHeaders.length;
                exportHeaders.push([target.field, []]);
              }
              sources = exportHeaders[headerMap[target.field]][1];
              // As above
              if (sources.indexOf(field.name) == -1) {
                sources.push(field.name);
              }
              exportHeaders[headerMap[target.field]][1] = sources;
            }
          }
        }
      }
    }
    // This will output a list of fields added to exportHeaders by way of
    // template specification which haven't been included in export.js
    //if (field_message)
    //  console.log('Export fields added by template:', field_message)
    //if (field_export_message)
    //  console.log('Export fields stated in export.js):', field_export_message)
  }

  /**
   * This provides an export field composed of one or more more input
   * fields, separated by a ';' delimiter if not null.
   * nullOptionsDict allows conversion of "Missing" etc. metadata options to
   * target export system's version of these.
   * @param {String} headerName is field name of target export field
   * @param {Object} sourceRow
   * @param {Array<Object>} sourcetitles array of all source fields.
   * @param {Object} titleMap
   * @param {String} delimiter to separate multi-source field values with
   * @param {String} prefix of export format
   * @param {Map} nullOptionsMap conversion of Missing etc. to export db equivalent.
   * @returm {String} Concatenated string of values.
   */
  getMappedField(
    headerName,
    sourceRow,
    sourcetitles,
    sourceFields,
    titleMap,
    delimiter,
    prefix,
    nullOptionsMap = null,
    skipNull = false
  ) {
    const self = this;
    const mappedCell = [];
    for (const title of sourcetitles) {
      let mappedCellVal = sourceRow[titleMap[title]];
      if (!mappedCellVal) continue;
      mappedCellVal = mappedCellVal.trim();
      if (mappedCellVal.length === 0) continue;
      if (nullOptionsMap && nullOptionsMap.has(mappedCellVal)) {
        mappedCellVal = nullOptionsMap.get(mappedCellVal);
      }
      if (skipNull === true && (!mappedCellVal || mappedCellVal.length === 0)) {
        continue;
      }

      let field = sourceFields[titleMap[title]];

      // if sources exist, fetch transformed Value
      if (field.sources) {
        if (field.multivalued === true) {
          // Map list of semicolon-delimited choices
          // ISSUE: relying on semicolon delimiter in input
          for (let cellVal of mappedCellVal.split(';')) {
            mappedCell.push(
              self.getTransformedField(
                headerName,
                cellVal.trim(),
                field,
                prefix
              )
            );
          }
        } else {
          // Map single choice
          mappedCell.push(
            self.getTransformedField(headerName, mappedCellVal, field, prefix)
          );
        }
      } else {
        // No mapping.
        mappedCell.push(mappedCellVal);
      }
    }

    return mappedCell.join(delimiter);
  }

  /**
   * Given a table row, output a value based on the following conditional:
   * ```
   * if (value in headerNameToCheck == valToMatch) {
   *   return value in headerNameToOutput;
   * } else {
   *   return "";
   * }
   * ```
   * TODO is there any need for additional complexities in getMappedField?
   *   i.e., transforming field
   * @param {string} headerNameToCheck Field name of user-inputted vals to check
   * against `valToMatch`.
   * @param {string} valToMatch Value to match user-inputted vals against during
   * conditional.
   * @param {string} headerNameToOutput Field name of user-inputted vals to
   * return if conditional is satisfied.
   * @param {string[]} inputRow Table row.
   * @param {Object<string, number>} sourceFieldNameMap `getFieldNameMap` return
   * val.
   * @return {string} `valToMatch` if condition is satisfied; empty str
   * otherwise.
   */
  getIfThenField(
    headerNameToCheck,
    valToMatch,
    headerNameToOutput,
    inputRow,
    sourceFieldNameMap
  ) {
    const valToCheck = inputRow[sourceFieldNameMap[headerNameToCheck]];
    const valToOutput = inputRow[sourceFieldNameMap[headerNameToOutput]];
    return valToCheck === valToMatch ? valToOutput : '';
  }

  /**
   * Given a table row, find the intersection of user-inputted values in
   * `headerNameToCheck` and vals in `matchedValsSet`.
   * @param {string} headerNameToCheck Field name of user-inputted vals to
   * intersect against `matchedValsSet`.
   * @param {Set<string>} matchedValsSet Set of values that user-inputted vals
   * are intersected against.
   * @param {string[]} inputRow Table row.
   * @param {Object<string, number>} sourceFieldNameMap `getFieldNameMap` return
   * val.
   * @return {string} Intersection of user-inputted values in
   * `headerNameToCheck` and vals in `matchedValsSet`.
   */
  getMatchedValsField(
    headerNameToCheck,
    matchedValsSet,
    inputRow,
    sourceFieldNameMap
  ) {
    const valsToCheckStr = inputRow[sourceFieldNameMap[headerNameToCheck]];
    if (!valsToCheckStr) return '';

    const valsToCheckArray = valsToCheckStr.split('; ');
    const valsToOutputArray = valsToCheckArray.filter((e) =>
      matchedValsSet.has(e)
    );
    return valsToOutputArray.join('; ');
  }

  /**
   * Given a table row, and an ordered collection of field names, return the
   * first non-null field val.
   * @param {string[]} headerNamesToCheck Field names of user-inputted vals to
   * check for non-null vals, in 0-indexed order.
   * @param {string[]} inputRow Table row.
   * @param {Object<string, number>} sourceFieldNameMap `getFieldNameMap` return
   * val.
   * @return {string} First non-null val in `headerNamesToCheck`.
   */
  getFirstNonNullField(headerNamesToCheck, inputRow, sourceFieldNameMap) {
    const nullValsSet = new Set(
      Object.keys(this.schema.enums.NullValueMenu.permissible_values).concat([
        '',
        null,
      ])
    );
    const valsToCheck = headerNamesToCheck.map((headerName) => {
      const valToCheck = inputRow[sourceFieldNameMap[headerName]];
      // TODO trim because copy pasting from excel == '\r\n'; wider issue?
      return typeof valToCheck === 'string' ? valToCheck.trim() : valToCheck;
    });
    const firstNonNullVal = valsToCheck.find((e) => !nullValsSet.has(e));
    return firstNonNullVal ? firstNonNullVal : '';
  }

  /**
   * Some enumeration values get mapped over to export format values.
   *
   * @param {String} headerName column to export to.
   * @param {String} value to be exported.
   * @param {Array<String>} field to examine for mappings.
   * @param {String} prefix of export format to access in .exportField dictionary.
   */
  getTransformedField(headerName, value, field, prefix) {
    const self = this;
    if (field.sources) {
      // iterate thru and will return the first match found in field.sources
      for (const source_index in field.sources) {
        const term =
          self.schema.enums[field.sources[source_index]].permissible_values[
            value
          ];
        // Looking for term.exportField['GRDI'] for example:
        if (term && term.exportField && prefix in term.exportField) {
          // Here mapping involves a value substitution
          // Note possible [target field]:[value] twist
          for (let mapping of term.exportField[prefix]) {
            // Usually there's just one target field, but one can map a
            // source field to more than one target.
            if (!mapping.field) {
              return mapping.value;
            }
            if (mapping.field === headerName) {
              return mapping.value;
            }
          }
        }
      }
    }
    return value;
  }

  /**
   * Return first and last items of a delimited string
   * @param {String} value A string of values separated by delimiter.
   * @param {String} delimiter A character which is a delimiter
   * @return {String} A string of at most 2 values.
   */
  concatFirstLastField(value, delimiter) {
    if (value.indexOf(delimiter) !== -1) {
      let fields = value.split(delimiter);
      return fields[0] + ':' + fields[fields.length - 1];
    }
    return value;
  }

  /**
   * If given value is a null value, normalize its capitalization
   * @param {String} value to check.
   * @param {Object} nullOptionsMap dictionary of null values.
   * @return {String} value
   */
  fixNullOptionCase(value, nullOptionsMap) {
    if (value) {
      const valuelc = value.toLowerCase();
      if (nullOptionsMap.has(valuelc)) {
        const value2 = nullOptionsMap.get(valuelc);
        if (value != value2) value = value2;
      }
    }
    return value;
  }

  /**
   *
   * From field_rules.js
   *
   */

  /**
   * fieldChangeRules() is triggered when user changes a value on a cell,
   * before that change is committed.
   *
   * IMPORTANT: Value of cell user is changing is in change[3], not in
   * this.hot.getDataAtCell(row, col) - the getDataAtCell() is old value.
   *
   * Iterate through rules set up for named columns
   * Like matrixFieldChangeRules but this is triggered by a single change
   * by a user edit on a field cell. This creates complexity for fields that
   * work together, e.g. either of first two fields of
   * [field][field unit][field bin] could have been focus of change.
   * Code would be simpler if we could just pass data row reference to
   * binChangeTest() but instead we have to construct matrix[row] ={cols ...}
   *
   * @param {Array} change array [row, col, ? , value]
   * @param {Object} fields See `data.js`.
   * @param {Array} triggered_changes array BY REFERENCE. One or more changes is
   *                appended to this.
   */
  fieldChangeRules(change, fields, triggered_changes) {
    const row = change[0];
    const col = change[1];
    const field = fields[col];

    // Test field against capitalization change.
    if (field.capitalize && change[3] && change[3].length > 0) {
      change[3] = changeCase(change[3], field);
    }

    // Rules that require a particular column following and/or preceeding
    // current one.
    if (fields.length > col + 1) {
      // We're prepping a SPARSE ARRAY here for binChangeTest()
      // Its a string because currently
      let matrix = [];
      matrix[row] = {}; // Essential for creating sparse array.
      let matrixRow = matrix[row];
      matrixRow[col] = change[3]; // prime changed value

      const prevName = col > 0 ? fields[col - 1].name : null;
      const nextName = fields.length > col + 1 ? fields[col + 1].name : null;

      // On [field] where next field is [field unit]
      if (nextName === field.name + '_unit') {
        if (field.datatype === 'xsd:date') {
          // Transform ISO 8601 date to bin year / month granularity.
          // This literally resets day or month to /01/ value based on
          // granularity, for information accuracy or obfuscation purposes.
          // "day" granularity is taken care of by regular date validation.
          // Don't attempt to reformat x/y/z dates here.
          const dateGranularity = this.hot
            .getDataAtCell(row, col + 1)
            .split(' ')[0];
          // previously had to block x/y/z with change[3].indexOf('/') === -1 &&
          // ISSUE: not multilingual?
          if (dateGranularity === 'year' || dateGranularity === 'month') {
            change[3] = this.setDateChange(dateGranularity, change[3]);
          }
          return;
        }

        // Match <field> [field]_unit [field]_bin
        const nextNextName =
          fields.length > col + 2 ? fields[col + 2].name : null;
        if (nextNextName === field.name + '_bin') {
          matrixRow[col + 1] = this.hot.getDataAtCell(row, col + 1); //prime unit
          matrixRow[col + 2] = this.hot.getDataAtCell(row, col + 2); //prime bin
          this.binChangeTest(matrix, col, fields, 2, triggered_changes);
          return;
        }
      }

      // On [field] here, where next column is "[field]_bin".
      if (nextName === field.name + '_bin') {
        matrixRow[col + 1] = this.hot.getDataAtCell(row, col + 1); //prime bin
        this.binChangeTest(matrix, col, fields, 1, triggered_changes);
        return;
      }

      // On "[field] unit" here, where next column is [field]_bin.
      if (field.name === prevName + '_unit') {
        if (prevName + '_bin' === nextName) {
          // trigger reevaluation of bin from field
          matrixRow[col - 1] = this.hot.getDataAtCell(row, col - 1);
          matrixRow[col] = change[3];
          this.binChangeTest(matrix, col - 1, fields, 2, triggered_changes);
          return;
        }

        // Match previous field as date field
        // A change from month to year or day to month/year triggers new
        // date value
        if (
          fields[col - 1].datatype === 'xsd:date' &&
          (change[3] === 'year' || change[3] === 'month')
        ) {
          let dateString = this.hot.getDataAtCell(row, col - 1);
          // If there is a date entered, adjust it
          // previously had to block x/y/z with  && dateString.indexOf('/') === -1
          if (dateString) {
            dateString = this.setDateChange(change[3], dateString);
            matrixRow[col - 1] = dateString;
            triggered_changes.push([row, col - 1, undefined, dateString]);
          }
          return;
        }
      }
    }

    if (typeof field.onChange === 'function') {
      field.onChange(change, fields, triggered_changes);
    }
  }

  /**
   * Modify matrix data for grid according to specified rules.
   * This is useful when calling `hot.loadData`, as cell changes from said method
   * are not recognized by `afterChange`.
   * @param {Array<Array<String>>} matrix Data meant for grid.
   * @return {Array<Array<String>>} Modified matrix.
   */
  matrixFieldChangeRules(matrix) {
    Object.entries(this.slots).forEach((field, col) => {
      // Test field against capitalization change.
      if (field.capitalize) {
        for (let row = 0; row < matrix.length; row++) {
          if (!matrix[row][col]) continue;
          matrix[row][col] = changeCase(matrix[row][col], field);
        }
      }

      var triggered_changes = [];

      // Rules that require a column or two following current one.
      if (this.slots.length > col + 1) {
        const nexttitle = this.slots[col + 1].name;

        // Rule: for any <x>[x bin] pattern of field names,
        // find and set appropriate bin selection.
        if (nexttitle === field.name + '_bin') {
          this.binChangeTest(matrix, col, this.slots, 1, triggered_changes);
        }
        // Rule: for any [x], [x unit], [x bin] series of slots
        else if (nexttitle === field.name + '_unit') {
          if (this.slots[col].datatype === 'xsd:date') {
            //Validate
            for (let row = 0; row < matrix.length; row++) {
              if (!matrix[row][col]) continue;
              const dateGranularity = matrix[row][col + 1].split(' ')[0];
              if (dateGranularity === 'year' || dateGranularity === 'month') {
                matrix[row][col] = this.setDateChange(
                  dateGranularity,
                  matrix[row][col]
                );
              }
            }
          }
          //
          else if (fieldUnitBinTest(this.slots, col)) {
            // 2 specifies bin offset
            // Matrix operations have 0 for binOffset
            this.binChangeTest(matrix, col, this.slots, 2, triggered_changes);
          }
        }
      }

      // Do triggered changes:
      for (const change of triggered_changes) {
        matrix[change[0]][change[1]] = change[3];
      }
    });

    return matrix;
  }

  /**
  * Adjust given dateString date to match year or month granularity given by
  * dateGranularity parameter. If month unit required but not supplied, then
  * a yyyy-__-01 will be supplied to indicate that month needs attention.
  *
  * @param {String} dateGranularity, either 'year' or 'month'
  * @param {String} ISO 8601 date string or leading part, possibly just YYYY or
             YYYY-MM
  * @return {String} ISO 8601 date string.
  */
  setDateChange(dateGranularity, dateString, dateBlank = '__') {
    var dateParts = dateString.split('-');
    // Incomming date may have nothing in it.
    if (dateParts[0].length > 0) {
      switch (dateGranularity) {
        case 'year':
          dateParts[1] = '01';
          dateParts[2] = '01';
          break;
        case 'month':
          if (!dateParts[1]) dateParts[1] = dateBlank; //by default triggers date validation error
          dateParts[2] = '01';
          break;
        default:
        // do nothing
      }
    }
    // Update changed value (note "change" object overrides triggered_changes)
    return dateParts.join('-');
  }

  /**
   * Test [field],[field bin] or [field],[field unit],[field bin] combinations
   * to see if bin update needed.  Outputs any changes required into
   * triggered_changes array.
   * @param {Array<Array<String>>} matrix of data row(s) to test.
   * @param {Integer} col column of numeric field.
   * @param {Object} fields See `data.js`.
   * @param {Integer} binOffset column of bin field.
   * @param {Array} triggered_changes array of change which is appended to changes.
   */
  binChangeTest(matrix, col, fields, binOffset, triggered_changes) {
    for (let row in matrix) {
      // NOTE: row is string!  Adding offsets requires parseInt(row)
      const hotRowPtr = parseInt(row); // + rowOffset;
      const hotRowBinCol = parseInt(col) + binOffset;
      const hotRowNextCol = parseInt(col) + 1;
      const value = matrix[row][col];

      // For IMPORT, this is only run on fields that have a value.
      // Note matrix pass cell by reference so its content can be changed.
      if (value && value.length > 0) {
        // Do parseFloat rather than parseInt to accomodate fractional bins.
        let number = parseFloat(value);

        var selection = '';
        if (number >= 0) {
          // Here we have the 3 field call, with units sandwitched in the middle
          if (binOffset === 2) {
            const unit = matrix[row][hotRowNextCol];
            // Host age unit is interpreted by default to be year.
            // If user selects month, value is converted into years for binning.
            // Future solution won't hardcode month / year assumption
            // ENGLISH ONLY: value might be suffixed with ontology id.
            if (unit) {
              if (unit.split(' ', 1)[0] === 'month') {
                number = number / 12;
              }
            }
          }
          // .flatVocabulary is an array of string bin ranges e.g. "10 - 19"
          // if (typeof fields[hotRowBinCol].flatVocabulary !== 'undefined') {
          for (const number_range of fields[hotRowBinCol].flatVocabulary) {
            // ParseInt just looks at first part of number
            if (number >= parseFloat(number_range)) {
              selection = number_range;
              continue;
            }
            break;
          }
          // }
        } else {
          // Integer/date field is a textual value, possibly a metadata 'Missing'
          // etc. If bin field has a value, leave it unchanged; but if it doesn't
          // then populate bin with input field metadata status too.
          const matrixRow = matrix[hotRowPtr];
          const bin_value =
            typeof matrixRow !== 'undefined' ? matrixRow[hotRowBinCol] : null;
          selection = bin_value; // Default value is itself.

          const bin_values = fields[hotRowBinCol].flatVocabulary;
          if (value in bin_values && (!bin_value || bin_value === '')) {
            selection = value;
          }
          // If a unit field exists, then set that to metadata too.
          if (binOffset == 2) {
            const unit_value =
              typeof matrix[hotRowPtr] !== 'undefined'
                ? matrix[hotRowPtr][hotRowNextCol]
                : null;
            const unit_values = fields[col + 1].flatVocabulary;
            if (value in unit_values && (!unit_value || unit_value === '')) {
              triggered_changes.push([
                hotRowPtr,
                hotRowNextCol,
                undefined,
                value,
              ]);
            }
          }
        }
        triggered_changes.push([hotRowPtr, hotRowBinCol, undefined, selection]);
      }
    }
  }

  /**
   *
   * From validation.js
   *
   */

  /**
   * Get a collection of all invalid cells in the grid.
   * @return {Object<Number, Object<Number, String>>} Object with invalid rows as
   *     keys, and objects containing the invalid cells for the row, along with a
   *     message explaining why, as values. e.g,
   *     `{0: {0: 'Required cells cannot be empty'}}`
   */
  getInvalidCells(data) {
    //const fieldNames = this.slots.map((field) => field.name);
    return this.validator.validate(data, this.slot_names); // fieldNames);
  }

  /**
   * Cleans up some data[row][column] values silently
   * xsd:token normalized to have whitespace removed.
   */
  doPreValidationRepairs(data) {
    return new Promise((resolve) => {
      const cellChanges = [];
      const whitespace_minimized_re = new RegExp(/\s+/, 'g');
      let fullVersion =
        VERSION_TEXT +
        ', ' +
        this.template_name +
        ' v' +
        (this.sections.annotations
          ? this.sections.annotations.version
          : this.schema.version);

      for (let row = 0; row < data.length; row++) {
        if (rowIsEmpty(data[row])) {
          continue;
        }
        for (let col = 0; col < data[row].length; col++) {
          let cellVal = data[row][col];
          const field = this.slots[col];
          const datatype = field.datatype;

          if (cellVal && datatype === 'xsd:token') {
            const minimized = cellVal
              .replace(whitespace_minimized_re, ' ')
              .trim();
            // Update cellVal in advance of validateVal(s) below
            if (minimized !== cellVal) {
              cellVal = minimized;
              data[row][col] = cellVal;
              cellChanges.push([row, col, minimized, 'prevalidation']);
            }
          }

          if (datatype === 'Provenance') {
            checkProvenance(cellChanges, fullVersion, cellVal, row, col);
          }
          // Clean up capitalization and spacing.  This applies to both single
          // and multivalued
          else if (field.flatVocabulary) {
            if (field.multivalued === true) {
              let [, update] = validateValsAgainstVocab(cellVal, field);
              if (!update) {
                // Inefficient 2nd check: problem is cellVal containing only
                // caps or non-trimmed items doesn't trigger quiet update
                const update_val = formatMultivaluedValue(
                  parseMultivaluedValue(cellVal)
                );
                if (cellVal != update_val) update = update_val;
              }
              if (update) {
                data[row][col] = update;
                cellChanges.push([row, col, update, 'prevalidation']);
              }
            } else {
              const [, update] = validateValAgainstVocab(cellVal, field);
              if (update) {
                data[row][col] = update;
                cellChanges.push([row, col, update, 'prevalidation']);
              }
            }
          }
        }
      }
      if (cellChanges.length) {
        console.log(
          'doPreValidationRepairs: setDataAtCell and afterChange Hook'
        );
        this.hot.addHookOnce('afterChange', resolve);
        this.hot.setDataAtCell(cellChanges, 'validation');
      } else {
        resolve();
      }
    });
  }

  /**
   * Test a given date against an upper or lower range, if any.
   * @param {Date} date to be compared.
   * @param {Object} field that contains min and max limits.
   * @return {Boolean} validity of field.
   */
  testDateRange(aDate, field, columnIndex, row, TODAY) {
    const self = this;
    var jsDate = new Date(aDate);

    const comparison = [field.minimum_value, field.maximum_value];

    for (const ptr in comparison) {
      let c_items = comparison[ptr];
      if (c_items) {
        // Delimited list allows for test against date AND other fields.
        for (let c_item of c_items.split(';')) {
          if (c_item !== '') {
            // Signals lookup expressions:
            if (c_item[0] === '{') {
              if (c_item === '{today}') {
                if (itemCompare(jsDate, TODAY, ptr)) return false;
              } else {
                let field = c_item.substr(1, c_item.length - 2);
                let col = columnIndex[field];
                let lookup_item = self.hot.getDataAtCell(row, col);
                if (lookup_item !== '') {
                  if (itemCompare(jsDate, new Date(lookup_item), ptr)) {
                    return false;
                  }
                }
              }
            } else {
              // Assumes this is just a constant date string.
              if (itemCompare(jsDate, new Date(c_item), ptr)) return false;
            }
          }
        }
      }
    }

    return true;
  }

  fullData(handsontableInstance = null) {
    if (handsontableInstance === null) {
      handsontableInstance = this.hot;
    }
    let obj = handsontableInstance.getSourceData();
    const headerSize = this.getFlatHeaders()[1].length; // fields, not sections;

    // Create an immutable unfilled array structure filled with `null`
    const unfilledArrayStruct = Object.freeze(new Array(headerSize).fill(null));

    // Map the original objects to the new array structure
    const array = obj.map((object) => {
      // Create a new copy of the unfilled array structure
      let unfilledArrayCopy = [...unfilledArrayStruct];

      // Populate the new array with values from the original object
      Object.entries(object).forEach(([key, value]) => {
        unfilledArrayCopy[key] = value;
      });

      return unfilledArrayCopy;
    });

    // const fullHotData = handsontableInstance.getData();
    const fullHotData = array;
    return fullHotData;
  }

  toJSON() {
    const handsontableInstance = this.hot;
    const tableData = this.fullData(handsontableInstance);
    const columnHeaders = this.slot_names;

    function createStruct(row) {
      const structInstance = {};
      // iterate over the columns in a row
      for (let i = 0; i < row.length; i++) {
        structInstance[columnHeaders[i]] = row[i];
      }
      return structInstance;
    }

    const arrayOfStructs = [];

    // Loop through each row and create a struct using the function
    for (const row of tableData) {
      // remove empty rows
      if (!row.every((val) => val === null)) {
        arrayOfStructs.push(createStruct(row));
      }
    }
    return arrayOfStructs;
  }
}

export default DataHarmonizer;
