import '@selectize/selectize';
import Handsontable from 'handsontable';
import SheetClip from 'sheetclip';
import $ from 'jquery';

import YAML from 'yaml';//#{ parse, stringify } from 'yaml'
//import {strOptions} from 'yaml/types'
//strOptions.fold.lineWidth = 0; // Prevents yaml long strings from wrapping.
//strOptions.fold.defaultStringType = 'QUOTE_DOUBLE'
//YAML.scalarOptions.str.defaultType = 'QUOTE_SINGLE'
//scalarOptions.str.defaultType = 'QUOTE_SINGLE'
import i18next from 'i18next';
import { renderContent, urlToClickableAnchor } from './utils/content';
import { isEmpty, rowIsEmpty, isEmptyUnitVal } from '../lib/utils/general';

import {
  changeCase,
  formatMultivaluedValue,
  JSON_SCHEMA_FORMAT,
  MULTIVALUED_DELIMITER,
  parseMultivaluedValue
} from './utils/fields';

import { checkProvenance,
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
    this.dateExportBehavior = options.dateExportBehavior || 'JSON_SCHEMA_FORMAT';
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
        if (typeof this.helpSidebarOptions.onToggle === 'function') {
          this.helpSidebarOptions.onToggle(open);
        }
      };
      this.helpSidebar = new HelpSidebar(this.root, opts);
    }

    $(this.modalsRoot).append(contentModals);

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
        nestedHeaders: this.getNestedHeaders(), // Provides section / column rows.
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
        minSpareRows: 0,
        width: '100%',
        // Future: For empty dependent tables, tailor to minimize height.
        height: '75vh',
        fixedRowsTop: 0,
        manualRowResize: true,
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
              callback() {self.context.schemaEditor.saveSchema(self)}
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
                if (!(self.template_name in self.context.schemaEditor.TRANSLATABLE)) return true;
                // Hide if no locales
                const current_row = schema.current_selection[0];
                if (current_row === null || current_row === undefined || current_row < 0)
                  return false;
                const locales = schema.hot.getCellMeta(current_row, 0).locales;
                return !locales;
              },
              callback() {self.context.schemaEditor.translationForm(self)}
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
            if (self.context.schemaEditor && self.template_name === 'Schema' 
              && 'locales' in changes) {
              return self.context.schemaEditor.setLocales(changes);
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

              if (self.context.schemaEditor) {
                switch (self.template_name) {
                case 'Schema':
                  // For a schema name change (the only key in schema table),
                  // update ALL related SchemaEditor Menus (classes, slots ...)
                  // for that template.
                  self.context.schemaEditor.refreshMenus();
                  break;

                case 'Slot':
                  // A change in a Field/Slot table's row's schema
                  self.context.schemaEditor.refreshMenus(['SchemaSlotMenu']);
                  break;

                case 'Type':
                case 'Class':
                case 'Enum':
                  self.context.schemaEditor.refreshMenus([`Schema${self.template_name}Menu`]);
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

            if (self.context.schemaEditor) { // Schema Editor specific function
              if (self.template_name === 'Schema') {
                self.context.schemaEditor.refreshMenus();
              }
              if (self.template_name === 'Class' || self.template_name === 'Slot') {
                // Have to update Slot > SlotUsage > slot_group menu for given Class.
                // (Currently not having Schema Class itself control slot_group.)
                // Find slot menu field and update source controlled vocab.
                // ISSUE: Menu won't work/validate if multiple classes are displayed.
                //const class_name = self.hot.getDataAtCell(
                //  row, self.slot_name_to_column['name']
                //);
                self.context.schemaEditor.refreshMenus(['SchemaSlotMenu','SchemaSlotGroupMenu']);   
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
        ...this.hot_override_settings, // custom overrides from DH setup.
      };

      // DEFAULT multiColumnSorting settings which are overriden in initTab()
      hot_settings.multiColumnSorting = {
        sortEmptyCells: true, // false = empty rows at end of table regardless of sort
        indicator: true, // true = header indicator
        headerAction: true, // true = header double click sort
      }

      // Within the SchemaEditor template context, this adds settings based on
      // particular tabs, e.g. Slot Editor "Slot". It modifies hot_settings above;
      this.context.schemaEditor?.initTab(this, this.template_name, hot_settings);

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
    // Access the Handsontable instance's filter plugin
    const filtersPlugin = dh.hot.getPlugin('filters');
    if (filtersPlugin.isEnabled()) {

      // Clear any existing filters
      filtersPlugin.clearConditions();

      // Add a filter condition that no row will satisfy
      // For example, set a condition on the first column to check if the value
      // equals a non-existent value
      filtersPlugin.addCondition(0, 'eq', ['###NO_ROW_MATCH###']);

      dh.hot.suspendExecution();
      // Apply the filter to hide all rows
      filtersPlugin.filter();
      dh.hot.resumeExecution();
    }
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

  /**
   * Parses binary spreadsheet data into a JSON matrix and processes it for use.
   * If header rows are detected in the data, they are removed, and any additional
   * data transformations or field change rules are applied before returning.
   * In cases where headers need to be defined or are incomplete, a modal is triggered
   * for user specification.
   *
   * Trying to offer flexibility that user can load a schema class from a
   * spreadsheet that may have several tabs with variations on tab name as 
   * class name or title or as a Container attribute name.  That doesn't mean
   * the sheet can be re-saved back into its source file though.
   * 
   * This runs separately for each tab in schema. HOWEVER - all tabs are
   * sharing a dialogue about whether tabular data lines up with specification.
   * 
   * WARNING: making this async messes with loading order, leading to some tabs
   * not having data?

   * @param {string|Buffer} data - The binary string or buffer of the spreadsheet data.
   * @returns {Array<Array<?>>|null} A matrix representing the processed spreadsheet data.
   *                                  Returns `null` if headers need to be specified by the user.
   * @throws Will throw an error if the given data cannot be read as a workbook.
   */

  getSpreadsheetName(workbook) {

    // Defaults to 1st tab if current DH instance doesn't match sheet tab.
    // Excel xls, xlsx worksheet tabs are plural container attribute names
    // rather than template_name or template title.
    const sheet_names = workbook.SheetNames;

    // Default is to try processing first tab if no tab name match
    // If loading a tsv or csv file, default will be something like "Sheet1".
    let sheet_name = sheet_names[0]; 
    // template.name is language-invariant so most reliable
    if (sheet_names.includes(this.template.name))
      sheet_name = this.template.name;
    // This is a Language dependent option:
    else if (this.template.title && sheet_names.includes(this.template.title)) {
      sheet_name = this.template.title; 
    }
    // If loading tsv or csv, don't try matching sheet name to Container
    else if (sheet_names.length > 1 && 'Container' in this.schema.classes) {
      // A given Container attribute [e.g. CanCOGeNCovid19Data] may have a 
      // .range that matches this template name.  If so, find the container
      // attribute name (usually plural) as spreadsheet tab name.
      const match = Object.entries(this.schema.classes['Container'].attributes)
        // cls_key = name = usually plural container attribute name
        .find(([cls_key, { name, range }]) => range == this.template.name);
      if (match) {
        sheet_name = match[0];
      }
    }
    //console.log("WORKBOOK", workbook.Sheets, sheet_name)
    if (!(sheet_name in workbook.Sheets)) {
      return false;
    }
    return sheet_name;

  }

  /***************************** PRIVATE functions *************************/

  /**
   * Construct a dictionary of source field names pointing to column index
   * USED IN GRDI export.js
   * 
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
   * USED IN GRDI export.js
   * 
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
    /* ENUMERATIONS AREN'T GETTING TRANSLATED?
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
   * Used in /web/templates/ script export.js files
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
   * Used in /web/templates/ script export.js files
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
                console.warn('Malformed export.js exportHeader field:', target.field);
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
   * 
   * USED IN GRDI EXPORT
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
   * 
   * USED IN GRDI EXPORT
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
   * 
   * USED 1ce in GRDI EXPORT
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
   * This is useful when calling `hot.loadData`, as cell changes from said
   * method are not recognized by `afterChange`.
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
          else if (this.fieldUnitBinTest(this.slots, col)) {
            // 2 specifies bin offset
            // matrix operations have 0 for binOffset
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
   * Test to see if col's field is followed by [field unit],[field bin] fields
   * @param {Object} fields See `data.js`.
   * @param {Integer} column of numeric field.
   */
  fieldUnitBinTest(fields, col) {
    return (
      fields.length > col + 2 &&
      fields[col + 1].name == fields[col].name + '_unit' &&
      fields[col + 2].name == fields[col].name + '_bin'
    );
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

}

export default DataHarmonizer;
