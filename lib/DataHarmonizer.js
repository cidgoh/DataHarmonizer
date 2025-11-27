import '@selectize/selectize';
import Handsontable from 'handsontable';
import SheetClip from 'sheetclip';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui/dist/themes/base/jquery-ui.css';
import YAML from 'yaml';//#{ parse, stringify } from 'yaml'
//import {strOptions} from 'yaml/types'
//strOptions.fold.lineWidth = 0; // Prevents yaml long strings from wrapping.
//strOptions.fold.defaultStringType = 'QUOTE_DOUBLE'
//YAML.scalarOptions.str.defaultType = 'QUOTE_SINGLE'
//scalarOptions.str.defaultType = 'QUOTE_SINGLE'
import i18next from 'i18next';
import { range as arrayRange } from 'lodash';
import { utils as XlsxUtils, read as xlsxRead } from 'xlsx/xlsx.js';
import { renderContent, urlToClickableAnchor } from './utils/content';
import { readFileAsync, updateSheetRange } from '../lib/utils/files';
import {
  isValidHeaderRow,
  isEmpty,
  deleteEmptyKeyVals,
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

import contentModals from './contentModals.html';

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

Handsontable.renderers.registerRenderer('multiKeyValueListRenderer', multiKeyValueListRenderer);

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

const SCHEMAMENUS = ['SchemaTypeMenu','SchemaClassMenu','SchemaSlotMenu','SchemaSlotGroupMenu','SchemaEnumMenu'];

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
        // REVISION POSSIBILITY: WHY BELOW ????
        // always do a HOT rerender on toggle in addition to anything client-specified
//        if (this.hot) {
//          this.render();
//        }
        if (typeof this.helpSidebarOptions.onToggle === 'function') {
          this.helpSidebarOptions.onToggle(open);
        }
      };
      this.helpSidebar = new HelpSidebar(this.root, opts);
    }

    $(this.modalsRoot).append(contentModals);

    // Reset specify header modal values when the modal is closed
    $('#specify-headers-modal').on('hidden.bs.modal', () => {
      $('#specify-headers-err-msg').hide();
      $('#specify-headers-confirm-btn').unbind();
    });

    // Field descriptions.
    // ISSUE: conflict with single click on Handsontable column header
    // triggering selection of whole column.
    $(this.root).on('click', '.secondary-header-text', (e) => { //dblclick
      // NOTE: innerText is no longer a stable reference due to i18n
      // Ensure hitting currentTarget instead of child
      // with innerText so we can guarantee the reference field.
      const field_reference = $(e.currentTarget).parents('.secondary-header-cell').attr('data-ref');
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
   * Called repeatedly for each DH tab found in Toolbar.js openDataFile()
   * 
   * @param {File} file User file.
   * @param {Object} xlsx SheetJS variable.  OUTDATED???
   * @return {Promise<>} Resolves after loading data or launching specify headers
   *     modal.
   */

  async openDataFileForTable(file) {
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
        try {
          list_data = this.loadSpreadsheetData(contentBuffer.binary);
          this.hot.loadData(list_data);
        } catch (error) {
          throw new Error('Invalid spreadsheet data', error);
        }
      }
    } catch (err) {
      let message = `ERROR: Unable to load data for ${this.template_name} from ${file.name}.  Was the appropriate file selected?`;
      alert(message);
      console.error(message + ' Occurred in openFile()');
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

  /* Run via toolbar createNewFile()
  newHotFile() {
    this.context.runBehindLoadingScreen(
      function () {
        this.createHot();
      }.bind(this)
    );
  }
  */

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
      licenseKey: 'non-commercial-and-evaluation'
    });

    // This catches case where user dblclicks on column label, and just wants 
    // to see help info. Without this check, column is selected first, which
    // blows away row selection.
    Handsontable.hooks.add('beforeOnCellMouseDown', function(event, coords, element) {
       // Check if a column header was clicked
      if (coords.row < 0 && event.srcElement.classList.contains('secondary-header-text')) {
        event.stopImmediatePropagation(); // Prevent default behavior and bubbling
      }
    }, this.hot);

    if (this.slots) {
      const hot_settings = {
        //...hot_copy_paste_settings,
        data: data, // Enables true reset
        nestedHeaders: this.getNestedHeaders(),
        autoColumnSize: true, // Enable automatic column size calculation
        columns: this.getColumns(),
        colHeaders: true,
        rowHeaders: true,
        renderallrows: false,
        manualRowMove: true,
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
        // define your custom query method, e.g. queryMethod: searchMatchCriteria
        search: {},
        fixedColumnsLeft: 1, // Future: enable control of this.
        manualColumnFreeze: true,
        hiddenColumns: {
          copyPasteEnabled: true,
          indicators: true,
          columns: [],
        },
        filters: true,
        hiddenRows: {
          rows: [],
        },
        // Handsontable's validation is extremely slow with large datasets.
        // REEXAMINE ABOVE assumption now that setDataAtCell() problem solved.
        invalidCellClassName: '',
        licenseKey: 'non-commercial-and-evaluation',

        // observeChanges: true, // TEST THIS https://forum.handsontable.com/t/observechange-performance-considerations/3054

        // TESTING May 15, 2025         
        // Handsontable note: Directly replicating the full filter UI within the cell's right-click context menu is not a standard feature and would require significant custom development.
        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],

        // https://handsontable.com/docs/javascript-data-grid/context-menu/
        contextMenu: {
          items: {
            remove_row: {
              name: 'Remove row',
              callback() {
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
            row_above: {
              name: 'Insert row above',
              callback (action, selection, event) {
                // Ensuring that rows inserted into foreign-key dependent tables
                // take in the appropriate focused foreign-key values on creation.
                self.addRows('insert_row_above', 1, self.hot.getSelected()[0][0]);
              },
            },
            row_below: {
              name: 'Insert row below',
              callback() {
                // As above.  self.hot.toPhysicalRow()
                self.addRows(
                  'insert_row_above',
                  1, parseInt(self.hot.getSelected()[0][0]) + 1
                );
              },
            },
            'hsep1': '---------',
            load_schema: {
              name: 'Load LinkML schema.yaml',
              hidden() {
                return self.template_name != 'Schema';
              },
              callback() {$('#schema_upload').click();}
            },
            save_schema: {
              name: 'Save as LinkML schema.yaml',
              hidden() {
                return self.template_name != 'Schema';
              },
              callback() {self.saveSchema()}
            },
            // FUTURE Implementation
            // Issue is that this doesn't freeze the column user is on.  It 
            // freezes the first unfrozen column to left.  
            // Possibly switching to reference columns by name might fix.
            /*
            freeze_column: {

              name: 'freeze column'
            },
            unfreeze_column: {
              name: 'unfreeze column'
            },
            */

            /* Issue: Handsontable doesn't provide filter menu via cell 
             * like it does on column header. Only predefined filters 
             * can be triggered here.
            filter_by_condition etc.: {
              name: 'Filter by condition',
            }
            */

            reset_filter: {
              name: 'Reset filter',
              disabled() {
                const filtersPlugin = self.hot.getPlugin('filters');
                const filters = filtersPlugin.exportConditions();
                return (filters.length === 0);
              },
              callback() {
                const filtersPlugin = self.hot.getPlugin('filters');
                filtersPlugin.clearConditions();
                filtersPlugin.filter();
              }
            },
            'hsep3': '---------',
            translations: {
              name: 'Translations',
              hidden() {
                const schema = self.context.dhs.Schema; 
                // Hide if not in schema editor.
                if (schema?.schema.name !== "DH_LinkML") return true;
              },
              disabled() {
                const schema = self.context.dhs.Schema; 
                // Hide if not in schema editor.
                if (schema?.schema.name !== "DH_LinkML") return true;
                // Hide if not translation fields.
                if (!(self.template_name in TRANSLATABLE)) return true;
                // Hide if no locales
                const current_row = schema.current_selection[0];
                if (current_row === null || current_row === undefined || current_row < 0)
                  return false;
                const locales = schema.hot.getCellMeta(current_row, 0).locales;
                return !locales;

                //const locales = schema.hot.getDataAtCell(schema.current_selection[0], schema.slot_name_to_column['in_language'],'lookup');
              },
              callback() {self.translationForm()}
            }
          }
        },
        // FIXING ISSUE WHERE HIGHLIGHTED FIELDS AREN'T IN GOOD SHAPE AFTER SORTING.
        afterColumnSort: function (currentSortConfig, destinationSortConfigs) {
        //  if (self.schema.name === 'DH_LinkML' && self.template_name === 'Slot') {
        //    // Somehow on first call the this.context.dhs doesnt exist yet, so passing self.
        //    self.schemaSlotClassView(self); 
        //  }
        },

        afterFilter: function (filters) {
          // column: 0, conditions: ('cancogen_covid-19', "eq", [], operation: "conjunction"

        },
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
         * @param {String} action can be CopyPaste.paste, multiselect_change, ... thisChange
         */
        beforeChange: function (grid_changes, action) {
          // Ignore addition of new records to table. 
          //ISSUE: prevalidate fires on some things?
          // "multiselect_change" occurs at moment when user clicks on column header.
          if (['add_row','upload','prevalidate','multiselect','batch_updates'].includes(action)) 
            return; // Allow whatever was going to happen.
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
          console.log("row_changes", row_changes);

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
            const change_prelude = `Your key change on ${self.template_name} 
              row ${parseInt(row) + 1} would also change existing dependent 
              table records, and this cannot be undone. Do you want to continue?  Check:\n`;

            let [change_report, change_message] = self.getChangeReport(self.template_name, true, changes);

            //console.log("change report", change_report, change_message);
            //console.log("relations", self.context.relations)
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
                      self.hot.suspendExecution(); // Advantageous to do this?
                      dependent_dh.hot.batchRender(() => {
                        for (let dep_row in dependent_obj.rows) {
                          Object.entries(dependent_obj.key_changed_vals).forEach(([dep_slot, dep_value]) => {
                            let dep_col = dependent_dh.slot_name_to_column[dep_slot];
                            // While setDataAtCell triggers this beforeUpdate() again, 'batch_updates' event is trapped without further ado above.
                            dependent_dh.hot.setDataAtCell(dep_row, dep_col, dep_value, 'batch_updates');
                          })
                        } 
                      }); // End of hot batch render
                      self.hot.resumeExecution();
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
        // trigger a crudCalculateDependentKeys() call here.
        // action e.g. edit, updateData, CopyPaste.paste
        afterChange: function (grid_changes, action) {
          if (['upload','updateData','batch_updates'].includes(action)) {
            // This is being called for every cell change in an 'upload'   
            return;
          }

          // Trigger only if change to some key slot child needs.
          if (grid_changes) {
            let row_changes = self.getRowChanges(grid_changes);
            console.log("afterChange()", row_changes, self.hasRowKeyChange(self.template_name, row_changes))
            if (self.hasRowKeyChange(self.template_name, row_changes)) {
              self.context.crudCalculateDependentKeys(self.template_name);
              // If in schema editor mode, update or insert to name field (a
              // key field) of class, slot or enum (should cause update in 
              // compiled enums and slot flatVocabularies.

              if (self.schema.name === 'DH_LinkML') {
                if (['Type','Class','Slot','Enum'].includes(self.template_name)) {
                  self.context.refreshSchemaEditorMenus([`Schema${self.template_name}Menu`]);
                }
                else if (self.template_name === 'Schema') {
                  // For a schema name change (the only key in schema table),
                  // update ALL related Schema Editor Menus for that template
                  self.context.refreshSchemaEditorMenus();
                }
              }
            }
          }
        },

        /*
         * Test if user-focused row has changed.  If so, then possibly
         * foreign key values that make up some dependent table's record(s)
         * have changed, so that table's view should be refreshed. Dependent
         * tables determine what parent foreign key values they need to filter view by.
         * This event is not directly involved in row content change.
         *
         * As well, refresh schema menus if selected schema has changed.
         * col can == -1 for entire row selection; row can == -1 or -2 for 
         * header row selection
         */
        // https://handsontable.com/docs/javascript-data-grid/api/hooks/#afterselection
        afterSelectionEnd: (row, column, row2, column2, selectionLayerLevel, action) => {

          //console.log("afterSelectionEnd",self.schema, row, column, row2, column2, selectionLayerLevel)

          // This is getting triggered twice? Trap and exit
          if (row === self.current_selection[0] 
            && column === self.current_selection[1]
            && row2 === self.current_selection[2]
            && column2 === self.current_selection[3]           
          ) {
            console.log('Double event: afterSelectionEnd', row, column, row2, column2, selectionLayerLevel, action)
            return false
          }
          // ORDER IS IMPORTANT HERE. Must calculate row_change, column_change,
          // and then set current_selection so crudCalculateDependentKeys() can get
          // the right possibly NEW schema_id !!!
          // self.current_selection[0] === null || 
          // self.current_selection[1] === null || 
          const row_change = !(self.current_selection[0] === row);
          const column_change = !(self.current_selection[1] === column);
          self.current_selection = [row, column, row2, column2];
          if (column < 0) column = 0;
          if (row < 0) row = 0;

          // FUTURE Efficiency: test for change in dependent key value across
          // rows, if none, skip this.
          if (row_change) { // primary_key slot cell value change case handled in afterChange() event above.
            self.context.crudCalculateDependentKeys(self.template_name);

            if (self.schema.name === 'DH_LinkML') { // Schema Editor specific function
              if (self.template_name === 'Schema') { // schema editor.
                self.context.refreshSchemaEditorMenus();
              }
              if (self.template_name === 'Class' || self.template_name === 'Slot') {
                // Have to update Slot > SlotUsage > slot_group menu for given Class.
                // (Currently not having Schema Class itself control slot_group.)
                // Find slot menu field and update source controlled vocab.
                // ISSUE: Menu won't work/validate if multiple classes are displayed.
                //const class_name = self.hot.getDataAtCell(
                //  row, self.slot_name_to_column['name']
                //);
                self.context.refreshSchemaEditorMenus(['SchemaSlotMenu','SchemaSlotGroupMenu']);      
              }
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
          return true;
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

      //columnSorting: true,
      hot_settings.multiColumnSorting = {
        sortEmptyCells: true, // false = empty rows at end of table regardless of sort
        indicator: true, // true = header indicator
        headerAction: true, // true = header double click sort
      }

      // Here is place to add settings based on particular tabs, e.g. Slot Editor "Slot"
      if (self.schema.name === 'DH_LinkML') {
        
        if (self.template_name === 'Slot') {
          const slot_table_attribute_column = ['rank','inlined','inlined_as_list'].map((x) => self.slot_name_to_column[x]);

          // See https://forum.handsontable.com/t/how-to-unhide-columns-after-hiding-them/5086/6
          hot_settings.contextMenu.items['hidden_columns_hide'] = {};
          hot_settings.contextMenu.items['hidden_columns_show'] = {};

          // Could be turning off/on based on expert user
          hot_settings.hiddenColumns = {
            // set columns that are hidden by default
            columns: slot_table_attribute_column,
            indicators: true
          }

          hot_settings.fixedColumnsLeft = 4; // Freeze both schema and slot name.

          // function(row, col, prop) has prop == column name if implemented; otherwise = col #
          // In some report views certain kinds of row are readOnly, e.g. Schema
          // Editor schema slots if looking at a class's slot_usage slots.
          // Issue: https://forum.handsontable.com/t/gh-6274-best-place-to-set-cell-meta-data/4710
          // We can't lookup existing .getCellMeta() without causing stack overflow.
          // ISSUE: We have to disable sorting for 'Slot' table because 
          // separate reporting controls are at work.
          hot_settings.cells = function(row, col) { 
            let cellProp = {};
            let slot_type = self.hot.getSourceDataAtCell(row, self.slot_type_column);
            let slot_report = $('#tab_report_select_type').val() === 'slot';
            let read_only = !slot_report || col == self.slot_class_name_column;
            if (slot_type === 'slot') {
              cellProp.className = 'schemaSlot' + (read_only ? ' hatched' : '');
              // block changing slot class name when working on Schema classes.
              cellProp.readOnly = read_only;
            }
            return cellProp;
          }

          /*
          hot_settings.columnSorting = {
            // let the end user sort data by clicking on the column name (set by default)
            headerAction: false,
            // don't sort empty cells – move rows that contain empty cells to the bottom (set by default)
            sortEmptyCells: false,
            // enable the sort order icon that appears next to the column name (set by default)
            indicator: false,

            // at initialization, sort data by the first column, in descending order
            //initialConfig: {
            //  column: 1, // slot name
            //  sortOrder: 'asc',
            //},
                          
            // implement your own comparator
            compareFunctionFactory(sortOrder, columnMeta) {
              return function (value, nextValue) {
                // here, add a compare function
                // that returns `-1`, or `0`, or `1`
                // ADD OTHER COLUMN VALUES...
                if (value < nextValue) {
                  return -1
                }
                if (value > nextValue) {
                  return 1
                }
                return 0
              };
            },
          }
          */
        }
        else {

        }

      }
      else { // Other tabs

      }


      this.hot.updateSettings(hot_settings);
      this.enableMultiSelection();
    } else {
      console.warn(
        'This template had no sections and fields: ' + this.template_name
      );
    }
  }
  
  translationForm() {
    const tab_dh = this;
    const schema = this.context.dhs.Schema;
    // Each schema_editor schema has locales object stored in its first
    // row cell metadata. Issue: if a schema has lost focus, and instead
    // all schemas are selected ...
    const schema_row = schema.current_selection[0];
    if (schema_row < 0) {
      alert("In order to see the translation form, first select a row with a schema that has locales.")
      return false;
    }
    const locales = schema.hot.getCellMeta(schema_row, 0).locales;
    if (!locales) {
      alert("In order to see the translation form, first select a row with a schema that has locales.")
      return false;
    }

    let locale_map = tab_dh.schema.enums?.LanguagesMenu?.permissible_values || {};

    const locale_field = schema.slot_name_to_column['in_language'];
    const language_code = schema.hot.getDataAtCell(schema_row, locale_field);
    const default_language = language_code in locale_map ? locale_map[language_code].title : language_code;

    // Translation table form for all selected rows.
    const [schema_part, key_name, sub_part, sub_part_key_name, text_columns] = TRANSLATABLE[tab_dh.template_name];

    let translate_rows = '';

    // Provide translation forms for user selected range of rows
    for (let row = tab_dh.current_selection[0]; row <= tab_dh.current_selection[2]; row++) {

      // 1st content row of table shows english or default translation.
      let default_row_text = '';
      let translatable = '';
      let column_count = 0;
      for (var column_name of text_columns) {
        column_count ++;
        let col = tab_dh.slot_name_to_column[column_name];
        // Tabular slot_usage may inherit empty values.
        let text = tab_dh.hot.getSourceDataAtCell(tab_dh.hot.toPhysicalRow(row), col) || '';
        default_row_text += `<td>${text}</td>`;
        translatable += text + '\n';
      }

      // Key for class, slot, enum:
      const key = tab_dh.hot.getDataAtCell(row, tab_dh.slot_name_to_column[key_name], 'lookup');
      let key2 = null;
      if (sub_part_key_name) {
        key2 = tab_dh.hot.getDataAtCell(row, tab_dh.slot_name_to_column[sub_part_key_name], 'lookup');
        if (!key2) {
          console.log("key2",key2, "lookup from", TRANSLATABLE[tab_dh.template_name]);
          alert("unable to get key2 from lookup of:" + sub_part_key_name)
        }
      }

      if (key) {
        translate_rows += `<tr class="translate translate_key"><td colspan="${column_count+2}">${key}${key2 ? ' /' + key2 : ''}</td></tr>`;
      }

      translate_rows += `<tr class="translate"><td nowrap>${default_language}</td>${default_row_text}<td></td></tr>`; 
      
      // DISPLAY locale for each schema in_language menu item
      for (const [locale, locale_schema] of Object.entries(locales)) {
        let translate_cells = '';
        let translate_text = '';
        let path = '';
        for (let column_name of text_columns) {
          // If items are in a component of class, like slot_usage or permissible_values
          // schema_part='enums', id='enum_id', 'permissible_values', 'name',
          // Translations can be sparse/incomplete
          let value = null;
          if (sub_part) {
            // Sparse locale files might not have particular fields.
            value = locale_schema[schema_part]?.[key]?.[sub_part]?.[key2]?.[column_name] || '';
            path = `${locale}.${schema_part}.${key}.${sub_part}.${key2}.${column_name}`;
          }
          else if (schema_part) {
            value = locale_schema[schema_part]?.[key]?.[column_name] || '';
            path = `${locale}.${schema_part}.${key}.${column_name}`;
          }
          else { // There should always be a locale_schema 
            value = locale_schema?.[column_name] || '';
            path = `${locale}.${column_name}`;
          }

          if (!!value && Array.isArray(value) && value.length > 0) {
            // Some inputs are array of [{value: ..., description: ...} etc.
            if (typeof value[0] === 'object')
              value = Object.values(value).map((x) => x.value).join(';');
            else
              value = value.join(';')
          }

          translate_cells += `<td><textarea name="${column_name}" data-path="${path}">${value}</textarea></td>`;
        }
        // Because origin is different, we can't bring google 
        // translate results directly into an iframe.
        let translate = `<button type="button" onclick="return !window.open('https://translate.google.com/?sl=${schema.schema.in_language}&tl=${locale}&op=translate&text=${encodeURI(translatable)}', 'translate', 'popup, width=1000, height=600, toolbar=no');">google</button>`;
        const trans_language = locale_map[locale].title;
        translate_rows += `<tr class="translation-input"><td><b>${trans_language}</b></td>${translate_cells}<td>${translate}</td></tr>`;
      }
    };

    $('#translate-modal-content').html(
      `<div>
        <table>
          <thead>
            <tr>
              <th class="locale">locale</th>
              <th>${TRANSLATABLE[tab_dh.template_name][4].join('</th><th>')}</th>
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
      if (!proceed) return false;

      const locales = this.getLocales();
      for (const locale of deleted) {
        delete locales[locale];
      }
      // An empty locale branch.
      for (const locale of created) {
        locales[locale] = {};
      }
    }
    return true;
  };


  /***************************** LOAD & SAVE SCHEMAS **************************/

  // Classes & slots (tables & fields) in loaded schema editor schema guide what can be imported.
  // See https://handsontable.com/docs/javascript-data-grid/api/core/#updatedata 
  // Note: setDataAtCell triggers: beforeUpdateData, afterUpdateData, afterChange
  loadSchemaYAML(text) {
    // Critical to ensure focus click work gets data loaded before timing
    // reaction in response to loading data / data sets.
    this.hot.suspendExecution();

    let schema = null;
    try {
      schema = YAML.parse(text);
      if (schema === null)
        throw new SyntaxError('Schema .yaml file could not be parsed.  Did you select a .json file instead?')
    }
    catch ({ name, message }) {
      alert(`Unable to open schema.yaml file.  ${name}: ${message}`);
      return false;
    }

    let schema_name = schema.name; // Using this as the identifier field for schema (but not .id uri)
    let loaded_schema_name = schema.name; // In case of loading 2nd version of a given schema.
    let dh_schema = this.context.dhs.Schema;
    let dh_uk = this.context.dhs.UniqueKey;
    let dh_slot = this.context.dhs.Slot;
    let dh_pv = this.context.dhs.PermissibleValue;
    let dh_annotation = this.context.dhs.Annotation;
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
    let focus_cell = dh_schema.hot.getSelected(); // Might not be one if user just accessed loadSchema by menu
    let focus_row = 0;
    if (focus_cell) {
      focus_row = parseInt(focus_cell[0][0]); // can be -1 row
      if (focus_row < 0)
        focus_row = 0;
    }

    // Find an empty row
    if (!focus_cell) {
      for (focus_row = 0; focus_row < this.hot.countRows(); focus_row ++) {
        if (dh_schema.hot.isEmptyRow(focus_row)) {
          break;
        }
      }
      // here we have focus_row be next available empty row, or new row # at
      // bottom of full table.
      dh_schema.hot.selectCell(focus_row, 0);
    }


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
          loaded_schema_name = base_name + ptr;
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

    // If user has requested Schema reload, then delete all existing rows in
    // all tables subordinate to Schema that have given schema_name as their
    // schema_id key. Possible to improve efficiency via delta insert/update?
    // (+Prefix) | Class (+UniqueKey) | Slot (+SlotUsage) | Enum (+PermissableValues)
    if (reload === true) {  
      for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
        this.deleteRowsByKeys(class_name, {'schema_id': schema_name});
      }
    }

    // Now fill in all of Schema simple attribute slots via uploaded schema slots.
    // Allowing setDataAtCell here since performance impact is low.
    for (let [dep_col, dep_slot] of Object.entries(this.slots)) {
      if (dep_slot.name in schema) {
        let value = null;
        // List of schema slot value exceptions to handle:
        switch (dep_slot.name) {
          // Name change can occur with v.1.2.3_X suffix 
          case 'name':
            value = loaded_schema_name;
            break;
          case 'see_also':
            value = this.getDelimitedString(schema.see_also);
            break;
          case 'imports':
            value = this.getDelimitedString(schema.imports);
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
      const locale_list = Object.keys(locales).join(';');
      console.log("locales", locales, locale_list)
      this.hot.setDataAtCell(focus_row, this.slot_name_to_column['locales'], locale_list, 'upload')
    }

    // For each DH instance, tables contains the current table of data for that instance.
    // For efficiency in loading a new schema, we add to end of each existing table.
    let tables = {};
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      const dh_table = this.context.dhs[class_name];
      // Doing console.log(hot.getData()) only returns visible rows.  
      // getSourceData() returns source (visible and hidden) 
      // https://jsfiddle.net/handsoncode/71y9axdj/ 
      tables[dh_table.template_name] = dh_table.hot.getSourceData();

      // Need to RELEASE FILTER?
      //const filtersPlugin = dh_table.hot.getPlugin('filters');
      //filtersPlugin.clearConditions();
      //filtersPlugin.filter();
    }

    this.checkForAnnotations(tables, loaded_schema_name, null, null, 'class', schema);

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
    // enums, slots, classes, settings, extensions entries:
    let conversion = {
      prefixes: 'Prefix',
      enums:    'Enum', // Done before slots and classes so slot.range and
                        //class.slot_usage range can include them. 
      slots:    'Slot', // Done before classes because class.slot_usage and 
                        // class.attributes add items AFTER main inheritable 
                        // slots. FUTURE: ENSURE ORDERING ???
      classes:  'Class',
      settings: 'Setting',
      extensions: 'Extension'
    };

    for (let [schema_part, class_name] of Object.entries(conversion)) {

      let dh = this.context.dhs[class_name];

      // Cycle through parts of uploaded schema's corresponding prefixes /
      // classes / slots / enums
      // value may be a string or an object in its own right.

      for (let [item_name, value] of Object.entries(schema[schema_part] || {})) {

        // Do appropriate constructions per schema component
        switch (class_name) {
          //case 'Schema': //done above
          //  break;

          case 'Prefix':
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              prefix:    item_name, 
              reference: value // In this case value is a string
            }); 
            break;

          case 'Setting':
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              name:    item_name, 
              value:   value // In this case value is a string
            }); 
            break;

          case 'Extension':
            // FUTURE: make this read-only?
            // Each locale entry gets copied to the Extension table/class in a shallow way
            // But also gets copied to the schema locales table held in first cell
            // See "if (locales)" condition above.
            // FUTURE: revise this so Extension's cell metadata holds it?
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              name:     item_name, 
              value:    value // In this case value is a string or object.  It won't be renderable via DH
            }); 

            break;

          case 'Enum':
            let enum_id = value.name;
            this.addRowRecord(dh, tables, {
              schema_id:   loaded_schema_name, 
              name:        enum_id, 
              title:       value.title,
              description: value.description,
              enum_uri:    value.enum_uri
            }); 
            // If enumeration has permissible values, add them to dh_permissible_value table.
            if (value.permissible_values) {
              for (let [key_name, obj] of Object.entries(value.permissible_values)) {
                this.addRowRecord(dh_pv, tables, {
                  schema_id: loaded_schema_name,
                  enum_id:   enum_id,
                  text:      key_name,
                  title:     obj.title,
                  description: obj.description,
                  meaning:   obj.meaning,
                  exact_mappings: this.getDelimitedString(obj.exact_mappings),
                  is_a:      obj.is_a,
                  notes:     obj.notes // ??= ''
                });
              };
            }
            // Handling the arrays of downloadable / cacheable enumeration inclusion and excluded sources.
            if (value.includes) 
              this.setEnumSource(tables, loaded_schema_name, enum_id, value.includes, 'includes');
            if (value.minus) 
              this.setEnumSource(tables, loaded_schema_name, enum_id, value.minus, 'minus');

            break;

          // Slot table is LinkML "slot_definition".  This same datatype is
          // referenced by class.slot_usage and class.annotation, so those
          // entries are added here.
          case 'Slot':
            // Setting up empty class name as empty string since human edits to
            // create new generic slots will create same.
            let slot_name = value.name;
            this.addSlotRecord(dh, tables, loaded_schema_name, '', 'slot', slot_name, value);
            this.checkForAnnotations(tables, loaded_schema_name, null, slot_name, 'slot', value);
            break;

          case 'Class':
            let class_name = value.name;
            this.addRowRecord(dh, tables, {
              schema_id:   loaded_schema_name, 
              name:        class_name, 
              title:       value.title,
              description: value.description,
              version:     value.version,
              class_uri:   value.class_uri,
              is_a:        value.is_a,
              tree_root:   this.getBoolean(value.tree_root), // Not needed?
              see_also:    this.getDelimitedString(value.see_also)
            }); 

            this.checkForAnnotations(tables, loaded_schema_name, class_name, null, 'class', value); // i.e. class.annotations = ...

            // FUTURE: could ensure the unique_key_slots are marked required here.
            if (value.unique_keys) {
              for (let [key_name, obj] of Object.entries(value.unique_keys)) {
                this.addRowRecord(dh_uk, tables, {
                  schema_id: loaded_schema_name,
                  class_name:  class_name,
                  name:      key_name,
                  unique_key_slots: this.getDelimitedString(obj.unique_key_slots),
                  description: obj.description,
                  notes:     obj.notes // ??= ''
                });
              };
            };
            // class.slot_usage holds slot_definitions which are overrides on slots of slot_type 'slot'
            if (value.slot_usage) { 
              // pass class_id as value.name into this?!!!!!!!e
              for (let [slot_name, obj] of Object.entries(value.slot_usage)) {
                this.addSlotRecord(dh_slot, tables, loaded_schema_name, class_name, 'slot_usage', slot_name, obj);
              };
            }
            // class.attributes holds slot_definitions which are custom (not related to schema slots)


            // IGNORE attributes FOR CONTAINER? 
            if (value.attributes) { 
              for (let [slot_name, obj] of Object.entries(value.attributes)) {
                this.addSlotRecord(dh_slot, tables, loaded_schema_name, class_name, 'attribute', slot_name, obj);
                // dh, tables, schema_name, class_name, slot_type, slot_key, slot_obj
              };
            }

            break;
        }
      };

    };

    // Get all of the DH instances loaded.
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      let dh = this.context.dhs[class_name];
      // AVOID: dh.hot.loadData(...); INNEFICIENT
      dh.hot.updateSettings({data:Object.values(tables[class_name])});
    }

    // New data type, class & enumeration items need to be reflected in DH
    // SCHEMAEDITOR menus. Done each time a schema is uploaded or focused on.
    this.context.refreshSchemaEditorMenus(); 
    this.context.crudCalculateDependentKeys(this.template_name);

    this.hot.resumeExecution();
  };

  setEnumSource(tables, loaded_schema_name, enum_id, source_array, criteria) {
    for (let source of source_array) {
      this.addRowRecord(this.dhs.EnumSource, tables, {
        schema_id:        loaded_schema_name,
        enum_id:          enum_id,
        criteria:         criteria,
        source_ontology:  source.source_ontology,
        is_direct:        source.is_direct,
        source_nodes:     this.getDelimitedString(source.source_nodes),
        include_self:     source.include_self, 
        relationship_types: this.getDelimitedString(source.relationship_types)
      });
    }
  }

  /**
   * Annotations are currently possible on schema, class, slot, slot_usage and attribute.
   * source_obj often doesn't have schema_name, class_name, slot_name so they are parameters.
   * 
   */ 
  checkForAnnotations(tables, schema_name, class_name, slot_name, annotation_type, source_obj) {
    // For now DH annotations only apply to slots, slot_usages, and class.attributes
    if (source_obj.annotations) {
      let dh_annotation = this.context.dhs.Annotation;
      let base_record = {
        schema_id: schema_name,
        annotation_type: annotation_type,
      }
      switch (annotation_type) {
      case 'schema':
        break;
      case 'class':
        base_record.class_name = class_name;
        break;
      case 'slot':
        base_record.slot_name = slot_name;
        break;
      case 'slot_usage':
      case 'attribute':
        base_record.class_name = class_name;
        base_record.slot_name = slot_name;
        break;
      }
      for (let [tag, obj] of Object.entries(source_obj.annotations)) {
        let record = Object.assign(base_record, {
          annotation_type: annotation_type,
          name:      tag, // FUTURE tag: ...
          value:    obj.value
        });
        // NORMALLY name: would be key: but current problem is that header in
        // schema_editor tables is using [text] as slot_group for a field
        // yields that if that [text] is a slot name, then title is being
        // looked up as a SLOT rather than as an enumeration - because DH code
        // doesn’t have enumeration yet...
        this.addRowRecord(dh_annotation, tables, record);
      };
    }
  }

  /** The slot object, and the Class.slot_usage object (which gets to enhance
   * add attributes to a slot but not override existing slot attributes) are
   * identical in potential attributes, so construct the same object for both
   * 
   * slot_obj may contain annotations, in which case they get added to
   * annotations table
   */ 
  addSlotRecord(dh, tables, schema_name, class_name, slot_type, slot_key, slot_obj) {

    let slot_record = {
      schema_id:   schema_name,
      slot_type:   slot_type, // slot or slot_usage or annotation
      name:        slot_key,

      // For slots associated with table by slot_usage or annotation
      // Not necessarily a slot_obj.class_name since class_name is a key onto slot_obj
      class_name:  class_name, 
      rank:        slot_obj.rank, 
      slot_group:  slot_obj.slot_group || '',
      inlined:     this.getBoolean(slot_obj.inlined),
      inlined_as_list: this.getBoolean(slot_obj.inlined_as_list),

      slot_uri:    slot_obj.slot_uri,
      title:       slot_obj.title,
      range:       slot_obj.range || this.getDelimitedString(slot_obj.any_of, 'range'),
      unit:        slot_obj.unit?.ucum_code || '', // See https://linkml.io/linkml-model/latest/docs/UnitOfMeasure/
      required:    this.getBoolean(slot_obj.required),
      recommended: this.getBoolean(slot_obj.recommended),
      description: slot_obj.description,
      aliases:     slot_obj.aliases,
      identifier:  this.getBoolean(slot_obj.identifier),
      multivalued: this.getBoolean(slot_obj.multivalued),
      minimum_value: slot_obj.minimum_value,
      maximum_value: slot_obj.maximum_value,
      minimum_cardinality: slot_obj.minimum_cardinality,
      maximum_cardinality: slot_obj.maximum_cardinality,
      pattern:     slot_obj.pattern,
      //NOTE that structured_pattern's partial_match and interpolated parameters are ignored.
      structured_pattern: slot_obj.structured_pattern?.syntax || '', 
      equals_expression: slot_obj.equals_expression,
      todos:       this.getDelimitedString(slot_obj.todos), 
      exact_mappings: this.getDelimitedString(slot_obj.exact_mappings),
      comments:    this.getDelimitedString(slot_obj.comments),
      examples:    this.getDelimitedString(slot_obj.examples, 'value'),
      version:     slot_obj.version,
      notes:       slot_obj.notes
    };
    this.addRowRecord(dh, tables, slot_record);

    // Slot type can be 'slot' or 'slot_usage' or 'attribute' here.
    if (slot_type === 'slot_usage')
      this.checkForAnnotations(tables, schema_name, class_name, slot_key, 'slot_usage', slot_obj);
    else if (slot_type === 'attribute')
      this.checkForAnnotations(tables, schema_name, class_name, slot_key, 'attribute', slot_obj);
  };

  /**
   * Returns value as is if it isn't an array, but if it is, returns it as
   * semi-colon delimited list.
   * @param {Array or String} to convert into semi-colon delimited list.
   * @param {String} filter_attribute: A some lists contain objects 
   */
  getDelimitedString(value, filter_attribute = null) {
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

  getArrayFromDelimited(value, filter_attribute = null) {
    if (!value || Array.isArray(value))
      return value; // Error case actually.
    return value.split(';')
      .map((item) => filter_attribute ? {[filter_attribute]: item} : item)
  }

  /** Incomming data has booleans as json true/false; convert to handsontable TRUE / FALSE
   * Return string so validation works on that (validateValAgainstVocab() where picklist
   * is boolean)
   */
  getBoolean(value) {
    if (value === undefined)
      return value; // Allow default / empty-value to be passed along.
    return(!!value).toString().toUpperCase();
  };

  setToBoolean(value) {
    return value?.toLowerCase?.() === 'true';
  }

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

  // The opposite of loadSchemaYAML!
  saveSchema () {
    if (this.schema.name !== 'DH_LinkML') {
      alert('This option is only available while in the DataHarmonizer schema editor.');
      return false;
    }

    // User-focused row gives top-level schema info:
    let dh = this.context.dhs.Schema;
    let schema_focus_row = dh.current_selection[0];
    let schema_name = dh.hot.getDataAtCell(schema_focus_row, 0);
    if (schema_name === null) {
      alert("The currently selected schema needs to be named before saving.");
      return;
    }
    let save_prompt = `Provide a name for the ${schema_name} schema YAML file. This will save the following schema parts:\n`;

    let [save_report, confirm_message] = this.getChangeReport(this.template_name);

    // prompt() user for schema file name.
    let file_name = prompt(save_prompt + confirm_message, 'schema.yaml');

    if (!file_name) 
      return false;

    /** Provide defaults here in ordered object prototype so that saved object
     * is consistent.  At class and slot level ordered object prototypes are
     * also used, but empty values are cleared out at bottom of save script.
     */
    let new_schema = new Map([
      ['id', ''],
      ['name', ''],
      ['description', ''],
      ['version', ''],
      ['in_language', 'en'],
      ['default_prefix', ''],
      ['imports', ['linkml:types']],
      ['prefixes', {}],
      ['classes', new Map()],
      ['slots', new Map()],
      ['enums', {}],
      ['types', {
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
      }],
      ['settings', {}],
      ['extensions', {}]
    ]);

    // Loop through loaded DH schema and all its dependent child tabs.
    let components = ['Schema', ... Object.keys(this.context.relations['Schema'].child)];
    for (let [ptr, tab_name] of components.entries()) {
      // For Schema, key slot is 'name'; for all other tables it is 
      // 'schema_id' which has a foreign key relationship to schema
      let schema_key_slot = (tab_name === 'Schema') ? 'name' : 'schema_id';
      let rows = this.context.crudFindAllRowsByKeyVals(tab_name, {[schema_key_slot]: schema_name}) 
      let dependent_dh = this.context.dhs[tab_name];

      // Schema | Prefix | Class | UniqueKey | Slot | Annotation | Enum | PermissibleValue | Setting | Extension
      for (let dep_row of rows) {
        // Convert row slots into an object for easier reference.
        let record = {};
        for (let [dep_col, dep_slot] of Object.entries(dependent_dh.slots)) {
          // 'row_update' attribute may avoid triggering handsontable events
          let value = dependent_dh.hot.getDataAtCell(dep_row, dep_col, 'reading');
          if (value !== undefined &&  value !== '') { //.length > 0 // took out !!value - was skipping numbers.
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
                if (typeof value === "string")
                  value = ['t','true','1','yes','y'].includes(value.toLowerCase());
                break;
            }
        
            // ALL multiselect values are converted to appropriate array or key/value pairs as
            // detailed below.
            record[dep_slot.name] = value;
          }
        }

        // Do appropriate constructions per schema component
        let target_obj = null;
        switch (tab_name) {
          case 'Schema':
            //console.log("SCHEMA",tab_name, {... record})
            this.copyAttributes(tab_name, record, new_schema, 
              ['id','name','description','version','in_language','default_prefix']);

            // TODO Ensure each Schema.locales entry exists under Container.extensions.locales...

            break;

          case 'Prefix':
            new_schema.get('prefixes')[record.prefix] = record.reference;
            break;

          case 'Class': // Added in order
            target_obj = this.get_class(new_schema, record.name);
            // ALL MULTISELECT ';' delimited fields get converted back into lists.
            if (record.see_also)
                record.see_also = this.getArrayFromDelimited(record.see_also);
            if (record.tree_root)
              record.tree_root = this.setToBoolean(record.tree_root);

            this.copyAttributes(tab_name, record, target_obj, 
              ['name','title','description','version','class_uri','is_a','tree_root','see_also']
            );

            break;

          case 'UniqueKey':
            let class_record = this.get_class(new_schema, record.class_name);
            if (!class_record.get('unique_keys'))
               class_record.set('unique_keys', {});

            target_obj = class_record.get('unique_keys')[record.name] = {
              unique_key_slots: record.unique_key_slots.split(';') // array of slot_names
            }
            this.copyAttributes(tab_name, record, target_obj, 
              ['description','notes']);
            break;

          case 'Slot':
            if (record.name) {

              let slot_name = record.name;
              let su_class_obj = null;
              if (['slot_usage','attribute'].includes(record.slot_type)) {
                // Error case if no record.class_name.
                su_class_obj = this.get_class(new_schema, record.class_name);
              }
              switch (record.slot_type) {

                // slot_usage and attribute cases are connected to a class
                case 'slot_usage': 
                  su_class_obj.get('slots').push(slot_name);
                  target_obj = su_class_obj.get('slot_usage')[slot_name] ??= {
                    name: slot_name,
                    rank: Object.keys(su_class_obj.get('slot_usage')).length + 1
                  };
                  break;

                case 'attribute':
                  // See https://linkml.io/linkml/intro/tutorial02.html for Container objects.
                  // plural attributes
                  target_obj = su_class_obj.get('attributes')[slot_name] ??= {
                    name: slot_name,
                    rank: Object.keys(su_class_obj.get('attributes')).length + 1
                  }; 
                  break;

                // Defined as a Schema slot in case where slot_type is empty:
                case 'slot':
                default: 
                  target_obj = this.get_slot(new_schema, slot_name);
                  //target_obj = new_schema.get('slots')[slot_name] ??= {name: slot_name};
                  break;
              }

              let ranges = record.range?.split(';') || [];
              if (ranges.length > 1) {
                //if (ranges.length == 1)
                  //target_obj.range = record.range;
                  //record.any_of = {};
                //else { // more than one range here
                  //array of { range: ...}
                  //target_obj.any_of = ranges.map(x => {return {range: x}});
                record.any_of = ranges.map((x) => {return {'range': x}}); //{return {range: x}});
                record.range = '';
                //}
              };

              if (record.aliases)
                record.aliases = this.getArrayFromDelimited(record.aliases);
              if (record.todos)
                record.todos = this.getArrayFromDelimited(record.todos);
              if (record.exact_mappings)
                record.exact_mappings = this.getArrayFromDelimited(record.exact_mappings);
              if (record.comments)
                record.comments = this.getArrayFromDelimited(record.comments);
              if (record.examples)
                record.examples = this.getArrayFromDelimited(record.examples, 'value');
              // Simplifying https://linkml.io/linkml-model/latest/docs/UnitOfMeasure/ to just ucum_unit.
              if (record.unit)
                record.unit = {ucum_code: record.unit};
              if (record.structured_pattern) {
                //const reg_string = record.structured_pattern;
                //console.log('structure', reg_string)
                record.structured_pattern = {
                  'syntax': record.structured_pattern,
                  'partial_match': false,
                  'interpolated': true
                };
              }     
              // target_obj .name, .rank, .range, .any_of are handled above.
              this.copyAttributes(tab_name, record, target_obj, ['name','slot_group','inlined','inlined_as_list','slot_uri','title','range','any_of','unit','required','recommended','description','aliases','identifier','multivalued','minimum_value','maximum_value','minimum_cardinality','maximum_cardinality','pattern','structured_pattern','todos', 'equals_expression','exact_mappings','comments','examples','version','notes']);

              //if (slot_name== 'passage_number')
              //  console.log('passage_number', record.minimum_value, target_obj)
            }
            break;

          case 'Annotation':

            // If slot type is more specific then switch target to appropriate reference.
            switch (record.annotation_type) {
              case 'schema': 
                target_obj = new_schema;
                break

              case 'class':
                target_obj = this.get_class(new_schema, record.class_name);
                break;

              case 'slot':
                target_obj = new_schema.get('slots').get(record.slot_name);
                console.log('annotation', target_obj, record.annotation_type, record.slot_name, new_schema)
                break;

              case 'slot_usage':
                target_obj = this.get_class(new_schema, record.class_name);
                target_obj = target_obj.get('slot_usage')[record.slot_name] ??= {};
                break;

              case 'attribute':
                target_obj = this.get_class(new_schema, record.class_name);
                target_obj = target_obj.get('attributes')[record.slot_name] ??= {};
                break;
            }

            // And we're just adding annotations[record.name] onto given target_obj:
            if (typeof target_obj === 'map') {
              if (!target_obj.has('annotations'))
                target_obj.set('annotations', {});
              target_obj = target_obj.get('annotations');
            }
            else {
              if (!('annotations' in target_obj))
                target_obj['annotations'] =  {};
              target_obj = target_obj.annotations;
            }

            target_obj[record.name] = {
              key: record.name, // convert name to 'key'
              value: record.value
            }

            //FUTURE: ADD MENU FOR COMMON ANNOTATIONS LIKE 'foreign_key'? Provide help info that way.

            break;

          case 'Enum':
            let enum_obj = new_schema.get('enums')[record.name] ??= {};
            this.copyAttributes(tab_name, record, enum_obj, ['name','title','enum_uri','description']);
            break;

          case 'PermissibleValue': // LOOP?????? 'text shouldn't be overwritten.
            let permissible_values = new_schema.get('enums')[record.enum_id].permissible_values ??= {};
            target_obj = permissible_values[record.text] ??= {};
            if (record.exact_mappings) {
              record.exact_mappings = this.getArrayFromDelimited(record.exact_mappings);
            }
            this.copyAttributes(tab_name, record, target_obj, ['text','title','description','meaning', 'is_a','exact_mappings','notes']);
            break;

          case 'EnumSource':

            // Required field so error situation if it isn't .includes or .minus:
            if (record.criteria) { 

              let enum_target_obj = new_schema.get('enums')[record.enum_id] ??= {};
              enum_target_obj = enum_target_obj[record.criteria] ??= [];

              if (record.source_nodes) {
                record.source_nodes = this.getArrayFromDelimited(record.source_nodes);
              }

              if (record.relationship_types) {
                record.relationship_types = this.getArrayFromDelimited(record.relationship_types);
              }
              // The .includes and .minus attributes hold arrays of specifications.
              let target_ptr = enum_target_obj.push({});
              console.log(target_ptr, enum_target_obj)
              enum_target_obj = enum_target_obj[target_ptr-1];

              this.copyAttributes(tab_name, record, enum_target_obj, ['source_ontology','is_direct','source_nodes','include_self','relationship_types']);
            }
            break;

          case 'Setting':
            new_schema.get('settings')[record.name] = record.value;
            break;

          case 'Type':
            // Coming soon, saving all custom/loaded data types.
            // Issue: Keep LinkML imported types uncompiled?
            break;
        }
      }
    };

    console.table("SAVING SCHEMA", new_schema);

    // Get rid of empty values.// Remove all class and slot attributes that
    // have empty values "", {}, [].
    new_schema.get('classes').forEach((attr_map) => {
      deleteEmptyKeyVals(attr_map);
    });

    console.log("SLOTS", new_schema.get('slots'))
    new_schema.get('slots').forEach((attr_map) => {
      deleteEmptyKeyVals(attr_map);
    });

    let metadata = this.hot.getCellMeta(schema_focus_row, 0);
    if (metadata.locales) {
      console.log("Got Locales", metadata.locales)
      new_schema.set('extensions', {locales: {tag: 'locales', value: metadata.locales}});
    }

    //https://www.yaml.info/learn/quote.html
    const a = document.createElement("a");
    //Save JSON version - except this doesn't yet have schemaView() processing:
    //a.href =  URL.createObjectURL(new Blob([JSON.stringify(schema, null, 2)], {
    // quotingType: '"'
    //YAML.scalarOptions.str.defaultType = 'PLAIN';
    a.href = URL.createObjectURL(new Blob([YAML.stringify(new_schema, 
      {singleQuote: true,
      lineWidth: 0,
      customTags: ['timestamp']
    }
    )], {type: 'text/plain'}));

    //strOptions.fold.lineWidth = 80; // Prevents yaml long strings from wrapping.
//strOptions.fold.defaultStringType = 'QUOTE_DOUBLE'


    //quotingType: '"'
    a.setAttribute("download", file_name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);


    return true;
  }  

  /**
   * Target object gets added/updated the given attribute_list fields, in order.
   * 
   */
  copyAttributes(class_name, record, target, attribute_list) {
    for (let [ptr, attr_name] of Object.entries(attribute_list)) {
      if (attr_name in record) { //No need to create/save empty values
        if (target instanceof Map) {// Required for Map, preserves order.
          target.set(attr_name, record[attr_name]);
        }
        else {
          if (!target || !record) {
            console.log(`Error: Saving ${class_name}, missing parameters:`, record, target, attribute_list)
            alert(`Software Error: Saving ${class_name} ${attr_name}: no target or record`)
          }
          else {
            target[attr_name] = record[attr_name];
          }
        }
      }
    }
  };


  /** 
   * Components of a schema are set up as Maps with all attributes detailed,
   * so order of attributes is preserved. Empty components get removed at end
   * of processing with the deleteEmptyKeyVals() call.
   */
  get_class(schema, name) {
    if (!schema.get('classes').has(name)) {
      schema.get('classes').set(name, new Map([
        ['name', ''],
        ['title', ''],
        ['description', ''],
        ['version', ''],
        ['class_uri', ''],
        ['is_a', ''],
        ['tree_root', ''],
        ['see_also', []],
        ['unique_keys', {}],
        ['slots', []],
        ['slot_usage', {}],
        ['attributes', {}]
      ]) );
    }
    return schema.get('classes').get(name);
  };

  get_slot(schema, name) {
    if (!schema.get('slots').has(name)) {
      schema.get('slots').set(name, new Map([
        ['name', ''],
        ['rank', ''],
        ['slot_group', ''],
        ['inlined', ''],
        ['inlined_as_list', ''],
        ['slot_uri', ''],
        ['title', ''],
        ['range', ''],  
        ['any_of', ''],      
        ['unit', {}], 
        ['required', ''], 
        ['recommended', ''], 
        ['description', ''],
        ['aliases', ''],    
        ['identifier', ''],  
        ['multivalued', ''],
        ['minimum_value', ''],
        ['maximum_value', ''],
        ['minimum_cardinality', ''],
        ['maximum_cardinality', ''],
        ['pattern', ''],
        ['structured_pattern', {}],
        ['todos', ''],
        ['equals_expression', ''],
        ['exact_mappings', []],
        ['comments', ''],
        ['examples', ''],
        ['version', ''],
        ['notes', ''],
        ['attributes', {}]
      ]) );
    }
    return schema.get('slots').get(name);
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
      console.log("report for ", dependent_name, dependent_rep)
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
    // OBSOLETE: If a change affects a slot that is a target of other tables, return true.
    // UPDATED: using .unique_key_slots rather than .target_slots
    const class_relations = this.context.relations[class_name];
    for (const key in class_relations.unique_key_slots) { //, ...class_relations.target_slots]
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
      if (!slot)
        continue; // Case possibly happens on cut and paste or undo function.

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
    // Get the VISUAL (not source) starting row index where the new rows will be added
    if (startRowIndex === false) {
      // Count visual row because hot.alter below modifies visual rows not source rows
      startRowIndex = this.hot.countRows(); //countSourceRows()
    }
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

    // NEW ROWS ARE ADDED HERE.
    this.hot.alter(row_where, startRowIndex, numRows);
    this.hot.selectCell(startRowIndex, 0);
    this.hot.scrollViewportTo({ row: startRowIndex});
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

  // FUTURE: use Handsontable filter instead.
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

  // Hide all rows
  filterAll(dh) {
    dh.hot.suspendExecution();
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
    dh.hot.resumeExecution();
  }

  filterAllEmpty(dh) {
    dh.hot.suspendExecution();
    const filtersPlugin = dh.hot.getPlugin('filters');

    // Clear any existing filters
    filtersPlugin.clearConditions();

    // Apply a filter condition to hide all empty rows
    filtersPlugin.addCondition((row /*col, value*/) => {
      return !dh.hot.getDataAtRow(row).every(isEmptyUnitVal);
    });

    filtersPlugin.filter();
    dh.hot.resumeExecution();
  }

 

  // Ensuring popup hyperlinks occur for any URL in free-text.
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
    .coding_name {font-size: .7rem}
    table th {font-weight: bold; text-align: left; font-size:1.3rem;}
    table th.label {font-weight:bold; width: 25%}
    table th.description {width: 20%}
    table th.guidance {width: 30%}
    table th.example {width: 15%}
    table th.data_status {width: 15%}
    table td {vertical-align: top; padding:5px;border-bottom:1px dashed silver;}
    table td.label {font-weight:bold;}
    
    ul { padding: 0; }
    span.required {font-weight:normal;background-color:yellow}
    span.recommended {font-weight:normal;background-color:plum}
    `;

    if (mystyle != null) {
      style = mystyle;
    }

    let enum_list = {}; // Build list of enums actually used in this template
    let row_html = '';

    for (const section of this.sections) {
      row_html += `<tr class="section">
      <td colspan="${this.columnHelpEntries.length - 1}"><h4>${
        section.title || section.name
      }</h4></td>
      </tr>
      `;

      for (const slot of section.children) {
        if (slot.sources) {
          for (let source of slot.sources)
            enum_list[source] = true;
        }
        const slot_dict = this.getCommentDict(slot);

        const slot_uri = this.renderSemanticID(slot_dict.slot_uri);

        row_html += '<tr>';
        if (this.columnHelpEntries.includes('column')) {
          row_html += `<td class="label">
            ${slot_dict.title}<br>
            <span class="coding_name">(${slot_dict.name})</span><br>
          ${slot_uri} ${slot.required ? '<span class="required"> required </span>':''} ${slot.recommended ? '<span class="recommended"> recommended </span>':''}</td>`;
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

    // Only include enumerations that exist in a given template.
    let enum_html = '';
    for (const key of Object.keys(this.schema.enums).sort()) {
      if (key in enum_list) {
        const enumeration = this.schema.enums[key];
        enum_html += `<tr class="section">
        <td colspan="4" id="${enumeration.name}">${enumeration.title ? enumeration.title + '<br><span class="coding_name">(' + enumeration.name + ')</span>' : enumeration.name} ${this.renderSemanticID(
          enumeration.enum_uri)}</td>
        </tr>`;

        for (const item_key in enumeration.permissible_values) {
          const item = enumeration.permissible_values[item_key];
          let title = !item.title || item.title == item_key ? '' : item.title;
          enum_html += `<tr>
          <td>${this.renderSemanticID(item.meaning)}</td>
          <td>${item_key}</td>
          <td>${title}</td>
          <td>${item.description || ''}</td>
          </tr>`;
        }
      }
    }

    if (enum_html)
      enum_html = `<thead><tr>
        <th>${i18next.t('help-semantic_uri')}</th>
        <th>${i18next.t('help-sidebar__code')}</th>
        <th>${i18next.t('help-sidebar__title')}</th>
        <th>${i18next.t('help-sidebar__description')}</th>
      </tr></thead>` + enum_html;

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
      <br>
      <table>
        <thead>
          <tr class="section">
            <th colspan="4"><h3>${i18next.t('help-picklists')}</h3></th>
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

    //console.log("DUMP", workbook)
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
        // A given container attribute [e.g. CanCOGeNCovid19Data] may have a range that matches this template name.  If so, use that tab on spreadsheet - BUT ONLY IF spreadsheet has such a name; otherwise default to spreadsheet's first tab.
        const match = Object.entries(this.schema.classes['Container'].attributes).find(
      ([cls_key, { name, range }]) => range == this.template_name && workbook.Sheets[this.template_name]);
        if (match) {
          sheet_name = match[0];
        }
      }
    }
    //console.log("sheet name", sheet_name); // e.g. CanCOGeNCovid19Data

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
        } 
        else {
          // Try to load data again using User specified header row
          const mappedMatrixObj = self.mapMatrixToGrid(
            matrix,
            specifiedHeaderRow - 1
          );
          $('#specify-headers-modal').modal('hide');
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
        }
      });

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
   * Create an array of cell properties specifying data type for all grid 
   * columns. In past avoided handsontable validation here but this should be 
   * reexamined. IT MAY BE that using batch() operations and not setDataAtCell,
   * that this is now solved.
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
      // FUTURE: Implement this - it allows columns to be referenced by name,
      // but affects a number of handsontable calls, e.g. event 
      // grid_changes[1] is slot name instead of integer.
      // col.data = slot.name;

      /* A field with .sources indicates that one or more enumerations 
       * are involved, and so it should use a select or multiselect 
       * pulldown menu.
       * Both have to handle indentation of choices where enumeration
       * has "is_a" parents.
       * Note that single select pulldown list handled by enablemultiselection()
       * has div class="handsontableEditor listbox handsontable".
       */ 
      col.source = null;
      if (slot.sources) {
        col.source = this.updateSources(slot);
        if (slot.multivalued === true) {
          col.type = 'autocomplete';
          // Prevents 'autocomplete' renderer which is regular pulldown from
          // showing as well:
          col.editor = 'text'; 
          col.renderer = 'multiKeyValueListRenderer';
          col.meta = {datatype: 'multivalued'} // metadata
        } else {
          // Autocomplete allows filter as you type selection but source expecting just a single word.
          //col.type = 'autocomplete'; // Issue is HandsonTable 13.0.1 doesn't provide indentation.
          col.type = 'key-value-list';
        }
      }

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

    let options = [];

    slot.sources.forEach((source) => {
      let stack = [];

      if (!(source in slot.permissible_values)) {
        alert(`Schema Programming Error: Slot range references enumeration ${source} but this was not found in enumeration dictionary`);
      }
      // This case catches empty menus, which merits an error in end-user DH but is ok in Schema Editor.
      else if ((this.schema.name !== "DH_LinkML") && !slot.permissible_values[source]) {
        alert(`Schema Programming Error: Slot range enumeration's ${source} has no selections!`);
      }
      else
        Object.values(slot.permissible_values[source] || {}).forEach(
          (permissible_value) => {
            let level = 0;
            const code = permissible_value.text;
            if ('is_a' in permissible_value) {
              level = stack.indexOf(permissible_value.is_a) + 1;
              stack.splice(level + 1, 1000, code);
            } else {
              stack = [code];
            }

            options.push({
              depth: level,
              label: permissible_value.title || code,
              value: code,
              _id: code, // Used by picklist renderer.
            });

          }
        );
    });
    //console.log("picklist for ", slot.name, options, slot.multivalued)
    return options;
  };

  /**
   * Enable multiselection input control on cells which have options and a multivalued metadata type.
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
        let meta = dh.getColumnMeta(col);
        if (meta.source && meta.meta?.datatype === 'multivalued') {

          /*
          const value = dh.getDataAtCell(row, col);
          const selections = parseMultivaluedValue(value);
          const formattedValue = formatMultivaluedValue(selections);

          // Cleanup of empty values that can occur with user editing in popup leading/trailing or double ";"
          if (value !== formattedValue) {
            dh.setDataAtCell(row, col, formattedValue, 'prevalidate');
          }
          let content = '';
          Object.values(meta.source).forEach(choice => {
            const {label, value} = choice; // unpacking
            let selected = selections.includes(value)
              ? 'selected="selected"'
              : '';
            content += `<option value="${value}" ${selected}'>${label}</option>`;
          });

          $('#field-description-text').html(
            `<span>${self.slots[col].title}</span>
            <select multiple class="multiselect" rows="15">${content}</select>`
          );
          */
          $('#multiselect-text').html(
            `<span>${self.slots[col].title}</span>
            <select multiple class="multiselect" rows="15"></select>`
          );

          $('#multiselect-text .multiselect')
            .selectize({
              maxItems: null,
              searchField: ["_id","label"], // for autocomplete to work
              //selectOnTab: false,
              options: meta.source,
              delimiter: MULTIVALUED_DELIMITER,
              items: dh.getDataAtCell(row, col)?.split(MULTIVALUED_DELIMITER) || [],

              hideSelected: false,
              onChange: function(value) {
                this.focus(); // required for cursor
              },
              /*
              onBlur: function(e, dest) {alert('blurring')}, // works
              onDelete: function(values) { // works
                return confirm(values = array of deleted items);
              },
              */
              render: {
                // This is the label shown for the selected item in the popup 
                // input control.
                item: function (data, escape) {
                  return '<div>' + escape(data.label) + '</div>';
                },
                // This is the option in popup input control option list. 
                option: (data, escape) => {
                  //const value = data.value.trim();
                  // Depth is coming from col.source created by updateSources(slot)
                  let indentation = 'selectDepth_' + (parseInt(data.depth) + 1);
                  return `<div class="option ${
                    data.value === '' ? 'selectize-dropdown-emptyoptionlabel' : ''
                  } ${indentation}">${escape(data.label)}</div>`;
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
            // This is key to saving selected content.
            $('#multiselect-modal button[data-dismiss]').off().on('click', function () {
              let newValCsv = formatMultivaluedValue(
                $('#multiselect-text .multiselect').val()
              );
              dh.setDataAtCell(row, col, newValCsv, 'multiselect_change');
            })

          $('#multiselect-modal').modal('show');
          // Automatically opens menu below input box  
          $('#multiselect-text .multiselect')[0].selectize.focus();
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
      )}</strong>: ${slot_dict.title}<br><span class="coding_name">(${slot_dict.name})</span></p>`;
    }

    // Requires markup treatment of URLS.
    const slot_uri = this.renderSemanticID(field.slot_uri);
    if (field.slot_uri && this.columnHelpEntries.includes('slot_uri')) {
      ret += `<p><strong data-i18n="help-sidebar__column">${i18next.t(
        'help-semantic_uri'
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
    if (field.comments && field.comments.length > 0) {
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
        return paragraph + '<br>';
      })
      .join('\n');

    // Makes full URIs that aren't in markup into <a href>
    if (guide.guidance) 
      guide.guidance = urlToClickableAnchor(guide.guidance);

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
    //console.log("fieldChangeRules", change, triggered_changes)

    if (!field) {
      console.log("Cut and paste action, no field yet?", change, col);
      return;
    }

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
    // Each Row needs to be mapped to visible row OR REMOVED?
    return this.validator.validate(data, this.slot_names);
    /*
     * ISSUE is that validate is on raw data, but we want errors reported on 
     * visual rows that user can navigate to in their current requested view.
     * HOWEVER toVisualRow() doesn't take into account hidden rows or sorting it appears.
     * So we should probably revise validator.validate to go backwards from visual to raw data?

    const errors = this.validator.validate(data, this.slot_names);
    let visual_errors = {};
    for (const key in errors) {
      let new_index = this.hot.toVisualRow(parseInt(key));
      if (new_index)
        visual_errors[new_index] = errors[key];
    };
    console.log("errors", errors, visual_errors);
    return visual_errors;
    */
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

          if (cellVal && datatype === 'xsd:token' && typeof cellVal === 'string') {
            // console.log("valdation", cellVal)
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

  tabDataToJSON() {
    const handsontableInstance = this.hot;
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
    for (const row of this.fullData(handsontableInstance)) {
      // remove empty rows
      if (!row.every((val) => val === null)) {
        arrayOfStructs.push(createStruct(row));
      }
    }
    return arrayOfStructs;
  }
}

export default DataHarmonizer;
