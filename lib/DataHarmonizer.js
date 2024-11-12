import '@selectize/selectize';
import Handsontable from 'handsontable';
import SheetClip from 'sheetclip';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui/dist/themes/base/jquery-ui.css';

import i18next from 'i18next';
import { utils as XlsxUtils, read as xlsxRead } from 'xlsx/xlsx.js';
import { renderContent, urlToClickableAnchor } from '@/lib/utils/content';
import { readFileAsync, updateSheetRange } from '@/lib/utils/files';
import { findSlotNamesForClass } from '@/lib/utils/templates';
import {
  isValidHeaderRow,
  rowIsEmpty,
  wait,
  stripDiv,
  isEmptyUnitVal,
  pascalToLowerWithSpaces,
} from '@/lib/utils/general';
import { invert, deepMerge, looseMatchInObject } from '@/lib/utils/objects';

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
} from '@/lib/utils/fields';

import {
  checkProvenance,
  itemCompare,
  validateValAgainstVocab,
  validateValsAgainstVocab,
  // validateUniqueValues,
} from '@/lib/utils/validation';

import 'handsontable/dist/handsontable.full.css';
import '@/lib/data-harmonizer.css';
import '@selectize/selectize/dist/css/selectize.bootstrap4.css';

import specifyHeadersModal from '@/lib/specifyHeadersModal.html';
import unmappedHeadersModal from '@/lib/unmappedHeadersModal.html';
import fieldDescriptionsModal from '@/lib/fieldDescriptionsModal.html';

import HelpSidebar from '@/lib/HelpSidebar';

// NOTE: this is odd! package.json is a developer file. why should a UI component care about it?
import pkg from '@/package.json';
import Validator from '@/lib/Validator';

const VERSION = pkg.version;
const VERSION_TEXT = 'DataHarmonizer v' + VERSION;

import { DateEditor, DatetimeEditor, TimeEditor } from '@/lib/editors';
import {
  KeyValueListEditor,
  keyValueListValidator,
  keyValueListRenderer,
  multiKeyValueListRenderer,
} from '@/lib/editors';

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

class DataHarmonizer {
  //An instance of DataHarmonizer has a schema, a domElement, and a handsontable .hot object
  root = null;
  template_name = null;
  schema = null; // Schema holding all templates
  sections = null; // Specific template from schema
  hot = null;
  menu = null;
  export_formats = {}; // Formats that a given template can export to.
  invalid_cells = null;
  // Currently selected cell range[row,col,row2,col2]
  current_selection = [null, null, null, null];
  field_settings = {};
  fields = [];
  template_unique_keys = [];

  constructor(root, context, options = {}) {
    // table schema
    this.schema = options.schema;
    this.context = context;

    // interface layout pass-ins
    this.root = root;
    this.hotRoot = options.hotRoot || $('<div>').appendTo(this.root)[0];
    this.modalsRoot = options.modalsRoot || document.querySelector('body');
    this.loadingScreenRoot = options.loadingScreenRoot || this.root;

    this.class_assignment = options.class_assignment || null;
    this.field_settings = options.fieldSettings || {};
    this.field_filters = options.field_filters || [];
    this.hot_override_settings = options.hot_override_settings || {};

    this.helpSidebarOptions = Object.assign(
      { enabled: true },
      options.helpSidebar || {}
    );
    this.columnHelpEntries = options.columnHelpEntries || [
      'column',
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
      const field = this.getFields().find(
        (field) => field.title === field_reference
      );
      $('#field-description-text').html(
        urlToClickableAnchor(this.getComment(field))
      );
      $('#field-description-modal').modal('show');
    });
  }

  render() {
    this.hot.render();
  }

  useSchema(schema, export_formats, template_name) {
    this.schema = schema;
    this.validator = new Validator(this.schema, MULTIVALUED_DELIMITER, {
      dateFormat: this.dateFormat,
      datetimeFormat: this.datetimeFormat,
      timeFormat: this.timeFormat,
    });

    // needs to be recalculated
    this.field_filters = findSlotNamesForClass(
      this.schema,
      this.class_assignment
    );
    this.export_formats = export_formats;
    this.useTemplate(template_name);
  }

  /**
   * Revise user interface elements to match template name
   *
   * @param {String} template_name: name of template within current schema
   */
  useTemplate(template_name) {
    this.template_name = template_name;
    this.sections = []; // This will hold template's new data including table sections.
    // let self = this;

    const sectionIndex = new Map();

    // Gets LinkML SchemaView() of given template
    // problem: multiclass schemas means this template doesn't reflect the underlying structure anymore.
    // const specification = this.schema.classes[template_name];
    // Class contains inferred attributes ... for now pop back into slots

    let attributes = Object.entries(
      this.context.template.default.schema.classes
    )
      .filter(
        ([cls_key]) =>
          cls_key !== 'dh_interface' &&
          cls_key !== 'Container' &&
          cls_key === this.class_assignment
      )
      .reduce((acc, [, spec]) => {
        return {
          ...acc,
          ...spec.attributes,
        };
      }, {});

    /* Lookup each column in terms table. A term looks like:
      is_a: "core field", 
      title: "history/fire", 
      slot_uri: "MIXS:0001086"
      comments: (3) ['Expected value: date', 'Occurrence: 1', 'This field is used uniquely in: soil']
      description: "Historical and/or physical evidence of fire"
      examples: [{…}], 
      multivalued: false, 
      range: "date",
      ...
      */

    for (let name in attributes) {
      // ISSUE: a template's slot definition via SchemaView() currently
      // doesn't get any_of or exact_mapping constructs. So we start
      // with slot, then add class's slots reference.
      let field = deepMerge(
        attributes[name],
        this.context.template.current.schema.slots[name]
      );
      // console.log(field);

      //let field = attributes[name];
      let section_title = null;

      if ('slot_group' in field) {
        // We have a field positioned within a section (or hierarchy)
        section_title = field.slot_group;
      } else {
        if ('is_a' in field) {
          section_title = field.is_a;
        } else {
          section_title = 'Generic';
          console.warn("Template field doesn't have section: ", name);
        }
      }

      // We have a field positioned within a section (or hierarchy)

      if (!sectionIndex.has(section_title)) {
        sectionIndex.set(section_title, sectionIndex.size);
        let section_parts = {
          title: section_title,
          children: [],
        };
        const section =
          this.context.template.current.schema['slots'][section_title];
        if (section) {
          Object.assign(section_parts, section);
        }

        this.sections.push(section_parts);
      }

      let section = this.sections[sectionIndex.get(section_title)];
      let new_field = Object.assign(structuredClone(field), { section_title }); // shallow copy

      // Some specs don't add plain english title, so fill that with name
      // for display.
      if (!('title' in new_field)) {
        new_field.title = new_field.name;
      }

      // Default field type xsd:token allows all strings that don't have
      // newlines or tabs
      new_field.datatype = null;

      let range_array = [];

      // Multiple ranges allowed.  For now just accepting enumerations
      if ('any_of' in new_field) {
        for (let item of new_field.any_of) {
          if (
            item.range in this.context.template.default.schema.enums ||
            item.range in this.context.template.default.schema.types ||
            pascalToLowerWithSpaces(item.range) in
              this.context.template.default.schema.enums ||
            pascalToLowerWithSpaces(item.range) in
              this.context.template.default.schema.types
            // || Object.keys(this.context.template.current.schema.enums).some(k => k.indexOf('geo_loc_name') !== '-1') ||
            // Object.keys(this.context.template.current.schema.types).some(k => k.indexOf('geo_loc_name') !== '-1')
          ) {
            range_array.push(item.range);
          }
        }
      } else {
        range_array.push(new_field.range);
      }

      // Parse slot's range(s)
      for (let range of range_array) {
        if (range === undefined) {
          console.warn('field has no range', new_field.title);
        }

        // Range is a datatype?
        const types = this.context.template.default.schema.types;
        if (range in types || pascalToLowerWithSpaces(range) in types) {
          const range_obj =
            typeof types[range] !== 'undefined'
              ? types[range]
              : types[pascalToLowerWithSpaces(range)];

          /* LinkML typically translates "string" to "uri":"xsd:string" 
            // but this is problematic because that allows newlines which
            // break spreadsheet saving of items in tsv/csv format. Use
            // xsd:token to block newlines and tabs, and clean out leading 
            // and trailing space. xsd:normalizedString allows lead and trai
            // FUTURE: figure out how to accomodate newlines?
            */
          switch (range) {
            case 'string':
              new_field.datatype = 'xsd:token';
              break;
            case 'Provenance':
              new_field.datatype = 'Provenance';
              break;
            default:
              new_field.datatype = range_obj.uri;
            // e.g. 'time' and 'datetime' -> xsd:dateTime'; 'date' -> xsd:date
          }
        } else {
          // If range is an enumeration ...
          const enums = this.context.template.current.schema.enums;
          if (range in enums || pascalToLowerWithSpaces(range) in enums) {
            const range_obj =
              typeof enums[range] !== 'undefined'
                ? enums[range]
                : enums[pascalToLowerWithSpaces(range)];

            if (!('sources' in new_field)) {
              new_field.sources = [];
            }
            if (!('flatVocabulary' in new_field)) {
              new_field.flatVocabulary = [];
            }
            if (!('flatVocabularyLCase' in new_field)) {
              new_field.flatVocabularyLCase = [];
            }
            if (!('permissible_values' in new_field)) {
              new_field.permissible_values = {};
            }

            new_field.permissible_values[range] = range_obj.permissible_values;

            new_field.sources.push(range);
            // This calculates for each categorical field in schema.yaml a
            // flat list of allowed values (indented to represent hierarchy)
            let flatVocab = this.stringifyNestedVocabulary(
              range_obj.permissible_values
            );
            new_field.flatVocabulary.push(...flatVocab);
            // Lowercase version used for easy lookup/validation
            new_field.flatVocabularyLCase.push(
              ...flatVocab.map((val) => val.trim().toLowerCase())
            );
          } else {
            // If range is a class ...
            // multiple => 1-many complex object
            if (range in this.context.template.current.schema.classes) {
              if (range == 'quantity value') {
                /* LinkML model for quantity value, along lines of https://schema.org/QuantitativeValue, e.g. xsd:decimal + unit
                  PROBLEM: There are a variety of quantity values specified, some allowing units
                  which would need to go in a second column unless validated as text within column.
                  
                  description: >-
                  A simple quantity, e.g. 2cm
                  attributes:
                  verbatim:
                  description: >-
                  Unnormalized atomic string representation, should in syntax {number} {unit}
                  has unit:
                  description: >-
                  The unit of the quantity
                  slot_uri: qudt:unit
                  has numeric value:
                  description: >-
                  The number part of the quantity
                  range:
                  double
                  class_uri: qudt:QuantityValue
                  mappings:
                  - schema:QuantityValue
                  */
              }
            }
          }
        } // End range parsing
      }

      // Provide default datatype if no other selected
      if (!new_field.datatype) {
        new_field.datatype = 'xsd:token';
      }

      // field.todos is used to store some date tests that haven't been
      // implemented as rules yet.
      if (new_field.datatype == 'xsd:date' && new_field.todos) {
        // Have to feed any min/max date comparison back into min max value fields
        for (const test of new_field.todos) {
          if (test.substr(0, 2) == '>=') {
            new_field.minimum_value = test.substr(2);
          }
          if (test.substr(0, 2) == '<=') {
            new_field.maximum_value = test.substr(2);
          }
        }
      }

      /* Older DH enables mappings of one template field to one or more 
        export format fields
        */
      this.setExportField(new_field, true);

      /* https://linkml.io/linkml-model/docs/structured_pattern/
       https://github.com/linkml/linkml/issues/674
       Look up its parts in "settings", and assemble a regular 
       expression for them to compile into "pattern" field. 
       This augments basic datatype validation
          structured_pattern:
              syntax: "{float} {unit.length}"
              interpolated: true   ## all {...}s are replaced using settings
              partial_match: false
      */
      if ('structured_pattern' in new_field) {
        switch (new_field.structured_pattern.syntax) {
          case '{UPPER_CASE}':
          case '{lower_case}':
          case '{Title_Case}':
            new_field.capitalize = true;
        }
        // TO DO: Do conversion here into pattern field.
      }

      // pattern is supposed to be exlusive to string_serialization
      if ('pattern' in field && field.pattern.length) {
        // Trap invalid regex
        // Issue with NMDC MIxS "current land use" field pattern: "[ ....(all sorts of things) ]" syntax.
        try {
          new_field.pattern = new RegExp(field.pattern);
        } catch (err) {
          console.warn(
            `TEMPLATE ERROR: Check the regular expression syntax for "${new_field.title}".`
          );
          console.error(err);
          // Allow anything until regex fixed.
          new_field.pattern = new RegExp(/.*/);
        }
      }
      if (this.field_settings[name]) {
        Object.assign(new_field, this.field_settings[name]);
      }

      section.children.push(new_field);
    } // End slot processing loop

    // Sections and their children are sorted by .rank parameter if available
    this.sections.sort((a, b) => a.rank - b.rank);

    // Sort kids in each section
    for (let ptr in this.sections) {
      this.sections[ptr]['children'].sort((a, b) => a.rank - b.rank);
    }

    this.fields = this.getFields();
    this.validator.useTargetClass(this.class_assignment);

    this.createHot();
  }

  /**
   * Open file specified by user.
   * Only opens `xlsx`, `xlsx`, `csv` and `tsv` files. Will launch the specify
   * headers modal if the file's headers do not match the grid's headers.
   * @param {File} file User file.
   * @param {Object} xlsx SheetJS variable.
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
          this.class_assignment
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

  async validate() {
    // const data = this.getTrimmedData();
    const rowStart = 0;
    const rowEnd = this.hot.countRows() - this.hot.countEmptyRows(true) - 1;
    const colStart = 0;
    const colEnd = this.hot.countCols() - 1;
    const data = this.hot.getData(rowStart, colStart, rowEnd, colEnd);

    await this.doPreValidationRepairs(data);
    this.invalid_cells = this.getInvalidCells(data);
    this.hot.render();
  }

  newHotFile() {
    this.runBehindLoadingScreen(
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

    let fields = this.getFields();
    if (fields.length) {
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
              var plugin = this.getPlugin('copyPaste');

              this.listen();
              // BUG: It seems like extra lf is added by sheetclip, causing
              // empty last row to be added and pasted. Exception is pasting
              // of single empty cell
              if (self.clipboardCache.length > 0)
                self.clipboardCache = self.clipboardCache.slice(0, -1);
              plugin.paste(self.clipboardCache);
            },
          },
          'remove_row',
          'row_above',
          'row_below',
        ],
      };

      const hot_settings = {
        ...hot_copy_paste_settings,
        data: data, // Enables true reset
        nestedHeaders: this.getNestedHeaders(),
        autoColumnSize: true, // Enable automatic column size calculation
        columns: this.getColumns(),
        colHeaders: true,
        rowHeaders: true,
        copyPaste: true,
        contextMenu: ['remove_row', 'row_above', 'row_below'],
        outsideClickDeselects: false, // for maintaining selection between tabs
        manualColumnResize: true,
        //colWidths: [100], //Just fixes first column width
        minRows: 100,
        minSpareRows: 100,
        width: '100%',
        height: '75vh',
        fixedColumnsLeft: 1,
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
        // beforeChange source: https://handsontable.com/docs/8.1.0/tutorial-using-callbacks.html#page-source-definition
        beforeChange: function (changes) {
          if (!changes) {
            return;
          }

          // When a change in one field triggers a change in another field.
          let triggered_changes = [];

          for (const change of changes) {
            // Check field change rules
            self.fieldChangeRules(change, fields, triggered_changes);
          }
          // Add any indirect field changes onto end of existing changes.
          if (triggered_changes) {
            changes.push(...triggered_changes);
          }
        },
        afterSelection: (row, column, row2, column2) => {
          self.current_selection = [row, column, row2, column2];
          if (this.helpSidebar) {
            if (column > -1) {
              const field = self.getFields()[column];
              const helpContent = self.getComment(field);
              self.helpSidebar.setContent(helpContent);
            } else self.helpSidebar.close();
          }
        },
        // Bit of a hackey way to RESTORE classes to secondary headers. They are
        // removed by Handsontable when re-rendering main table.
        afterGetColHeader: function (column, TH, headerlev) {
          if (headerlev == 1) {
            // Enables double-click listener for column help
            $(TH).addClass('secondary-header-cell');
            if (column > -1) {
              const field = self.fields[column];

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

  updateColumnSettings(columnIndex, options) {
    const currentColumns = this.hot.getSettings().columns || [];
    currentColumns[columnIndex] = {
      ...currentColumns[columnIndex],
      ...options,
    };
    this.hot.updateSettings({ columns: currentColumns });
  }

  addRowsToBottom(numRows) {
    // Get the starting row index where the new rows will be added
    const startRowIndex = this.hot.countRows();

    // Insert the new rows below the last existing row
    this.hot.alter('insert_row_below', startRowIndex, numRows);
    // Validate and process the current selection
    if (
      this.context.currentSelection !== null &&
      this.context.currentSelection.valueToMatch !== null
    ) {
      // Find the nearest index after the last non-empty row in the specified column
      this.populateNewRows(numRows, startRowIndex);
    } else {
      console.warn('No current selection to populate the new rows.');
    }
  }

  getColumnIndexByFieldName(slot_name) {
    const fields = this.getFields();
    for (let i = 0; i < fields.length; i++) {
      if (looseMatchInObject(['name'])(fields[i])(slot_name)) {
        return i;
      }
    }
    return -1;
  }

  // Function to populate the new rows with the selected value
  populateNewRows(numRows, baseColCoord) {
    const { shared_key_name, valueToMatch, source } =
      this.context.currentSelection;
    const col = this.getColumnIndexByFieldName(shared_key_name);

    // Retrieve shared keys for the current class assignment, if any
    const sharedKeys =
      this.context.schema_tree[this.class_assignment]?.shared_keys || [];

    if (valueToMatch !== null && sharedKeys.length > 0 && col !== -1) {
      sharedKeys.forEach((shared_key_spec) => {
        const { name, relation, related_concept } = shared_key_spec;

        // Check if the current column matches the shared key and the source matches the related concept
        const currentColumnName = this.getFields()[col].name;
        const isMatchingKey =
          currentColumnName === name &&
          relation === 'parent' &&
          source === related_concept;

        if (isMatchingKey) {
          this.hot.batch(() => {
            this.populateCells(numRows, baseColCoord, col, valueToMatch);
          });
        }
      });
    }
  }

  // Function to populate cells with the selected value, checking for non-empty cells to avoid overwriting
  populateCells(numRows, baseColCoord, col, valueToMatch) {
    for (let i = 0; i < numRows; i++) {
      const targetRowIndex = baseColCoord + i;

      // Check if the target row is empty before setting the value to avoid overwriting
      const existingValue = this.hot.getDataAtCell(targetRowIndex, col);
      if (existingValue === null || existingValue === '') {
        this.hot.setDataAtCell(targetRowIndex, col, valueToMatch);
      } else {
        console.warn(
          `Skipping row index ${targetRowIndex} as it already contains a value.`
        );
      }
    }
  }

  // Function to find the nearest index after the last non-empty value
  findNearestIndexAfterLastNonEmpty(column) {
    // Initialize nearestIndex to the first index (0)
    let nearestIndex = 0;

    // Get the total number of rows in the table
    const totalRows = this.hot.countRows();

    // Iterate through each row in the specified column
    for (let i = 0; i < totalRows; i++) {
      const cellValue = this.hot.getDataAtCell(i, column);

      // Update nearestIndex if the cell is not empty
      if (cellValue !== null && cellValue !== '') {
        nearestIndex = i + 1;
      }
    }

    // Return the index immediately after the last non-empty value
    return nearestIndex;
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

  /**
   * Updates column visibility based on a provided filter function.
   *
   * NOTE: It's defined in the negative!
   *
   * @param {Function} exclusionFunction A function that determines if a column should be excluded from showing.
   *                                     It receives the field object and index and returns
   *                                     a boolean where true means the column should be hidden.
   */
  _updateVisibility(exclusionFunction) {
    this.showAllColumns();
    const hiddenColumns = this.getFields()
      .map(exclusionFunction)
      .reduce((acc, hide, index) => {
        if (hide) acc.push(index);
        return acc;
      }, []);
    this.hideColumns(hiddenColumns);
  }

  showColumnsByNames(names) {
    if (names.length > 0)
      this._updateVisibility((field) => !names.includes(field.name));
  }

  showRequiredColumns() {
    this._updateVisibility((field) => !field.required);
  }

  showRecommendedColumns() {
    this._updateVisibility((field) => !(field.required || field.recommended));
  }

  /**
   * Shows only the columns belonging to a specific section title within the table.
   * Optionally, it can also show or hide the first column.
   *
   * @param {string} sectionTitle The section title based on which columns will be filtered.
   * @param {boolean} showFirstColumn If true, the first column will always be shown regardless of the section title. Defaults to true.
   */
  showColumnsBySectionTitle(sectionTitle, showFirstColumn = true) {
    if (
      this.getFields().some((field) => field.section_title === sectionTitle)
    ) {
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
    const rows = [...Array(this.hot.countRows()).keys()];
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

  filterAll() {
    // Access the Handsontable instance's filter plugin
    const filtersPlugin = this.hot.getPlugin('filters');

    // Clear any existing filters
    filtersPlugin.clearConditions();

    // Add a filter condition that no row will satisfy
    // For example, set a condition on the first column to check if the value equals a non-existent value
    filtersPlugin.addCondition(0, 'eq', '###NO_ROW_MATCH###');

    // Apply the filter to hide all rows
    filtersPlugin.filter();
  }

  filterAllEmpty() {
    const filtersPlugin = this.hot.getPlugin('filters');

    // Clear any existing filters
    filtersPlugin.clearConditions();

    // Apply a filter condition to hide all empty rows
    filtersPlugin.addCondition((row /*col, value*/) => {
      return !this.hot.getDataAtRow(row).every(isEmptyUnitVal);
    });

    filtersPlugin.filter();
  }

  hideMatchingRows(columnIndex, valueToMatch = null) {
    function resetHiddenRows(hotInstance) {
      const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
      hiddenRowsPlugin.showRows(hiddenRowsPlugin.getHiddenRows()); // Reset any previously hidden rows
    }

    function getAllRowIndices(hotInstance) {
      const totalRows = hotInstance.countRows();
      return Array.from({ length: totalRows }, (_, i) => i); // Return array of row indices [0, 1, 2, ..., totalRows - 1]
    }

    const hotInstance = this.hot;
    const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
    resetHiddenRows(hotInstance); // Reset any previously hidden rows

    let rowsToHide;

    if (valueToMatch === null || isEmptyUnitVal(columnIndex)) {
      // Hide all rows if no valueToMatch is provided
      rowsToHide = getAllRowIndices(hotInstance);
    } else {
      // Hide rows that do not match the value at the given columnIndex
      rowsToHide = getAllRowIndices(hotInstance).filter((row) => {
        const cellValue = hotInstance.getDataAtCell(row, columnIndex);
        return cellValue !== valueToMatch;
      });
    }

    hiddenRowsPlugin.hideRows(rowsToHide); // Hide the calculated rows
    hotInstance.render(); // Render the table to apply changes
  }

  /**
   * Presents reference guide in a popup.
   * @param {String} mystyle simple css stylesheet commands to override default.
   */
  renderReference(mystyle = null) {
    let schema_template = this.schema.classes[this.template_name];

    let style = `
    body {
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
      <td colspan="${this.columnHelpEntries.length}"><h3>${
        section.title || section.name
      }</h3></td>
      </tr>
      `;
      for (const slot of section.children) {
        const slot_dict = this.getCommentDict(slot);

        row_html += '<tr>';
        if (this.columnHelpEntries.includes('column')) {
          row_html += `<td class="label">${slot_dict.title}</td>`;
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
          row_html += ` <td>${slot_dict.sources || ''}</td>`;
        }
        row_html += '</tr>';
      }
    }

    var win = window.open(
      '',
      'Reference',
      'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600'
    );

    win.document.head.innerHTML = `
    <meta charset="utf-8">
    <title>${i18next.t('reference_guide_title')} "${
      schema_template.title || schema_template.name
    }" template</title>
    <meta name="description" content="${schema_template.description || ''}">
    <style>${style}</style>
    `;

    win.document.body.innerHTML = `  
    <div>
    <h2>${i18next.t('reference_guide_title')} "${
      schema_template.title || schema_template.name
    }" template</h2>
    <hr size="2"/>
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
    </body>
    </html>
    `;
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
    for (const [i, field] of this.getFields().entries()) {
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

  // TODO
  // /**
  //  * Run void function behind loading screen.
  //  * Adds function to end of call queue. Does not handle functions with return
  //  * vals, unless the return value is a promise. Even then, it only waits for the
  //  * promise to resolve, and does not actually do anything with the value
  //  * returned from the promise.
  //  * @param {function} fn - Void function to run.
  //  * @param {Array} [args=[]] - Arguments for function to run.
  //  */
  async runBehindLoadingScreen(fn, args = []) {
    await $('#loading-screen').show('fast', 'swing');
    await wait(200); // Enough of a visual cue that something is happening
    if (args.length) {
      await fn.apply(this, args);
    } else {
      await fn.apply(this);
    }
    await $('#loading-screen').hide();
    return;
  }

  /***************************** PRIVATE functions *************************/

  /**
   * Load data into table as an array of objects. The keys of each object are
   * field names and the values are the cell values.
   *
   * @param {Array<Object>} data table data
   */
  loadDataObjects(data, locale = null) {
    let fields = this.getFields();

    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      // An object was provided, so try to pick out the grid data from
      // one of it's fields.
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

    if (!Array.isArray(data)) {
      console.warn('Unable to get grid data from input');
      return;
    }
    let listData = [];
    data.forEach((row) => {
      const dataArray = dataObjectToArray(row, fields, {
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
    const matrixFieldChange = this.matrixFieldChangeRules(listData);
    return matrixFieldChange;
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

    const worksheet = workbook.Sheets[this.class_assignment]
      ? updateSheetRange(workbook.Sheets[this.class_assignment])
      : updateSheetRange(workbook.Sheets[workbook.SheetNames[0]]);

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
          self.runBehindLoadingScreen(() => {
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
          });
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
    const actualFirstRow = matrix[0];
    const actualSecondRow = matrix[1];
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualFirstRow)) {
      return 1;
    }
    if (JSON.stringify(expectedSecondRow) === JSON.stringify(actualSecondRow)) {
      return 2;
    }
    return false;
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
        const errMsg = `The template for the loaded file has a configuration error:<br/>
          <strong>${parent.title}</strong><br/>
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
   * Get a flat array of all fields (slot definitions) in TEMPLATE.
   * @return {Array<Object>} Array of all objects under `children` in TEMPLATE.
   */
  getFields() {
    let fields = Array.prototype.concat.apply(
      [],
      this.sections.map((section) => section.children)
    );

    fields =
      this.field_filters.length > 0
        ? fields.filter((field) => this.field_filters.includes(field.name))
        : fields;

    return fields;
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
   * REEXAMINE ABOVE ASSUMPTION - IT MAY BE BECAUSE OF set cell value issue that is now solved.
   *
   * @param {Object} data See TABLE.
   * @return {Array<Object>} Cell properties for each grid column.
   */
  getColumns() {
    let ret = [];

    const fields = this.getFields();

    // NOTE: this single loop lets us assume that columns are produced in the same indexical order as the fields
    // Translating between columns and fields may be necessary as one can contain more information than the other.
    for (let field of fields) {
      let col = {};
      if (field.required) {
        col.required = field.required;
      }
      if (field.recommended) {
        col.recommended = field.recommended;
      }

      col.name = field.name;

      col.source = null;

      if (field.sources) {
        const options = field.sources.flatMap((source) => {
          return Object.values(field.permissible_values[source]).reduce(
            (acc, item) => {
              acc.push({
                label: titleOverText(item),
                value: titleOverText(item),
                _id: item.text,
              });
              return acc;
            },
            []
          );
        });

        col.source = options;
        if (field.multivalued === true) {
          col.editor = 'text';
          col.renderer = multiKeyValueListRenderer(field);
          col.meta = {
            datatype: 'multivalued', // metadata
          };
        } else {
          col.type = 'key-value-list';
          if (
            !field.sources.includes('null value menu') ||
            field.sources.length > 1
          ) {
            col.trimDropdown = false; // Allow expansion of pulldown past field width
          }
        }
      }

      if (field.datatype == 'xsd:date') {
        col.type = 'dh.date';
        col.allowInvalid = true; // making a difference?
        col.flatpickrConfig = {
          dateFormat: this.dateFormat, //yyyy-MM-dd
          enableTime: false,
        };
      } else if (field.datatype == 'xsd:dateTime') {
        col.type = 'dh.datetime';
        col.flatpickrConfig = {
          dateFormat: this.datetimeFormat,
        };
      } else if (field.datatype == 'xsd:time') {
        col.type = 'dh.time';
        col.flatpickrConfig = {
          dateFormat: this.timeFormat,
        };
      }

      if (typeof field.getColumn === 'function') {
        col = field.getColumn(this, col);
      }

      ret.push(col);
    }

    return ret;
  }

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
    const fields = this.getFields();

    this.hot.updateSettings({
      afterBeginEditing: function (row, col) {
        const self = this;
        if (fields[col].flatVocabulary && fields[col].multivalued === true) {
          const value = this.getDataAtCell(row, col);
          const selections = parseMultivaluedValue(value);
          const formattedValue = formatMultivaluedValue(selections);

          // Cleanup of empty values that can occur with leading/trailing or double ";"
          if (value !== formattedValue) {
            this.setDataAtCell(row, col, formattedValue, 'thisChange');
          }

          let content = '';
          if (fields[col].sources) {
            fields[col].sources.forEach((source) => {
              Object.values(fields[col].permissible_values[source]).forEach(
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
            ${fields[col].title}
              </span>
            <select multiple class="multiselect" rows="15">${content}</select>`
          );
          $('#field-description-modal').modal('show');
          $('#field-description-text .multiselect')
            .selectize({
              maxItems: null,
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
            .on('change', function () {
              let newValCsv = formatMultivaluedValue(
                $('#field-description-text .multiselect').val()
              );
              self.setDataAtCell(row, col, newValCsv, 'thisChange');
            });
          // Saves users a click:
          $('#field-description-text .multiselect')[0].selectize.focus();
        }
      },
    });
  }

  fillColumn(colname, value) {
    const fieldYCoordinates = this.getFieldYCoordinates();
    const fields = this.getFields();

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
   * Recursively flatten vocabulary into an array of strings, with each
   * string's level of depth in the vocabulary being indicated by leading
   * spaces.
   * FUTURE possible functionality:
   * Both validation and display of picklist item becomes conditional on
   * other picklist item if "depends on" indicated in picklist item/branch.
   * @param {Object} vocabulary See `vocabulary` fields in SCHEMA.
   * @return {Array<String>} Flattened vocabulary.
   */
  stringifyNestedVocabulary(vocab_list) {
    let ret = [];
    let stack = [];
    for (const pointer in vocab_list) {
      let choice = vocab_list[pointer];
      let level = 0;
      if ('is_a' in choice) {
        level = stack.indexOf(choice.is_a) + 1;
        stack.splice(level + 1, 1000, choice.text);
      } else {
        stack = [choice.text];
      }

      this.setExportField(choice, false);

      ret.push('  '.repeat(level) + choice.text);
    }
    return ret;
  }

  setExportField(field, as_field) {
    if (field.exact_mappings) {
      field.exportField = {};
      for (let item of field.exact_mappings) {
        let ptr = item.indexOf(':');
        if (ptr != -1) {
          const prefix = item.substr(0, ptr);
          if (!(prefix in field.exportField)) {
            field.exportField[prefix] = [];
          }

          const mappings = item.substr(ptr + 1);
          for (let mapping of mappings.split(';')) {
            mapping = mapping.trim();
            const conversion = {};
            //A colon alone means to map value to empty string
            if (mapping == ':') {
              conversion.value = '';
            }
            //colon with contents = field & value
            else {
              mapping = decodeURIComponent(mapping);
              if (mapping.indexOf(':') != -1) {
                const binding = mapping.split(':');
                binding[0] = binding[0].trim();
                binding[1] = binding[1].trim();
                if (binding[0] > '') {
                  conversion.field = binding[0];
                }
                if (binding[1] > '') {
                  conversion.value = binding[1];
                }
              }
              //No colon means its just field or value
              else if (as_field == true) {
                conversion.field = mapping;
              } else {
                conversion.value = mapping;
              }
            }
            field.exportField[prefix].push(conversion);
          }
        }
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
    // HACK: due to nested arrays, this needs to keep track of when comments and examples need to be overriden
    // This might be happening elsewhere in the codebase (particularly with slices/...)
    // Our version of deepMerge forces array overrides, considered only with dictionaries as objects
    field = deepMerge(
      deepMerge(field, this.context.template.default.schema.slots[field.name]),
      this.context.template.localized.schema.slots[field.name]
    );

    let guide = {
      title: field.title,
      name: field.name,
      description: field.description || '',
      guidance: '',
      examples: '',
      sources: '',
    };

    let guidance = [];
    if (field.comments && field.comments.length) {
      guidance = guidance.concat(field.comments);
    }
    if (field.pattern) {
      guidance.push(
        i18next.t('reference_guide_msg_pattern_regex') + ' ' + field.pattern
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
      let sources = [];
      for (const [, item] of Object.entries(field.sources)) {
        // List null value menu items directly
        if (item === 'null value menu') {
          let null_values = Object.keys(
            this.schema.enums[item].permissible_values
          );
          sources.push(item + ': (' + null_values.join('; ') + ')');
        } else {
          sources.push(item);
        }
      }
      guide.sources = '<ul><li>' + sources.join('</li>\n<li>') + '</li></ul>';
    }
    if (field.multivalued) {
      guidance.push(i18next.t('reference_guide_msg_more_than_one_selection'));
    }

    guide.guidance = guidance
      .map(function (paragraph) {
        return '<p>' + paragraph + '</p>';
      })
      .join('\n');

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
          examples += '<ul><li>' + i18next.t(item.value) + '</li>\n';
        } else {
          examples += '<li>' + i18next.t(item.value) + '</li>\n';
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
  getDataObjects(options = {}) {
    const { parseFailureBehavior, indexSlot, fallbackIndexSlot } = {
      parseFailureBehavior: KEEP_ORIGINAL,
      indexSlot: false,
      fallbackIndexSlot: 'rows',
      ...options,
    };
    const listData = this.hot.getData();
    const fields = this.getFields();
    const arrayOfObjects = listData
      .filter((row) => !rowIsEmpty(row))
      .map((row) =>
        dataArrayToObject(row, fields, {
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

  getInferredIndexSlot() {
    // using the 1-m DH?
    if (this.class_assignment) {
      return this.class_assignment;
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
   * Get a dictionary of source field names pointing to column index
   * @param {Object} fields A flat version of data.js.
   * @return {Dictionary<Integer>} Dictionary of all fields.
   */
  getFieldNameMap(fields) {
    const titleMap = {};
    for (const [fieldIndex, field] of fields.entries()) {
      titleMap[field.name] = fieldIndex;
    }
    return titleMap;
  }

  /**
   * Get name of slots given titles via an inverted index
   * @param {Array} fields the fields representation for DataHarmonizer
   * @return {Dictionary<String, String>}
   */
  getFieldTitleMap(fields) {
    const columnHeaders = this.hot.getColHeader().map(stripDiv);
    let preMap = invert(this.getFieldNameMap(fields));
    return Object.keys(preMap).reduce((acc, col_index) => {
      acc[columnHeaders[col_index]] = preMap[col_index];
      return acc;
    }, {});
  }

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
    // This will output a list of fields added to exportHeaders by way of template specification which haven't been included in export.js
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
        mappedCell.push(
          self.getTransformedField(headerName, mappedCellVal, field, prefix)
        );
      } else if (field.multivalued === true) {
        // ISSUE: relying on semicolon delimiter in input

        for (let cellVal of mappedCellVal.split(';')) {
          mappedCell.push(
            self.getTransformedField(headerName, cellVal.trim(), field, prefix)
          );
        }
      } else {
        mappedCell.push(mappedCellVal);
      }
    }
    return mappedCell.join(delimiter);
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
   * Get a dictionary of empty arrays for each ExportHeader field
   * FUTURE: enable it to work with hierarchic vocabulary lists
   *
   * @param {Array<String>} sourceRow array of values to be exported.
   * @param {Array<String>} sourceFields list of source fields to examine for mappings.
   * @param {Array<Array>} RuleDB list of export fields modified by rules.
   * @param {Array<Array>} fields list of export fields modified by rules.
   * @param {Array<Integer>} titleMap map of field names to column index.
   * @param {String} prefix of export format to examine.
   * @return {Array<Object>} fields Dictionary of all fields.
   */

  getRowMap(sourceRow, sourceFields, RuleDB, fields, titleMap, prefix) {
    for (const title of sourceFields) {
      const sourceIndex = titleMap[title];
      let value = sourceRow[sourceIndex]; // All text values.
      // Sets source field to data value so that rules can reference it easily.
      RuleDB[title] = value;
      // Check to see if value is in vocabulary of given select field, and if it
      // has a mapping for export to a GRDI target field above, then set target
      // to value.
      if (value && value.length > 0) {
        const vocab_list = fields[sourceIndex]['schema:ItemList'];
        if (value in vocab_list) {
          const term = vocab_list[value];
          // Looking for term.exportField['GRDI'] for example:
          if ('exportField' in term && prefix in term.exportField) {
            for (let mapping of term.exportField[prefix]) {
              // Here mapping involves a value substitution
              if ('value' in mapping) {
                value = mapping.value;
                // Changed on a copy of data, not handsongrid table
                sourceRow[sourceIndex] = value;
              }
              if ('field' in mapping && mapping['field'] in RuleDB) {
                RuleDB[mapping['field']] = value;
              }
            }
          }
        }
      }
    }
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

      const prevName = col > 0 ? fields[col - 1].title : null;
      const nextName = fields.length > col + 1 ? fields[col + 1].title : null;

      // Match <field>[field unit]
      if (nextName === field.title + ' unit') {
        if (field.datatype === 'xsd:date') {
          // Transform ISO 8601 date to bin year / month granularity.
          // "day" granularity is taken care of by regular date validation.
          // Don't attempt to reformat x/y/z dates here.
          const dateGranularity = this.hot.getDataAtCell(row, col + 1);
          // previously had to block x/y/z with change[3].indexOf('/') === -1 &&
          if (dateGranularity === 'year' || dateGranularity === 'month') {
            change[3] = this.setDateChange(dateGranularity, change[3]);
          }
          return;
        }

        // Match <field>[field unit][field bin]
        const nextNextName =
          fields.length > col + 2 ? fields[col + 2].title : null;
        if (nextNextName === field.title + ' bin') {
          matrixRow[col + 1] = this.hot.getDataAtCell(row, col + 1); //prime unit
          matrixRow[col + 2] = this.hot.getDataAtCell(row, col + 2); //prime bin
          this.binChangeTest(matrix, col, fields, 2, triggered_changes);
          return;
        }
      }

      // Match <field>[field bin]
      if (nextName === field.title + ' bin') {
        matrixRow[col + 1] = this.hot.getDataAtCell(row, col + 1); //prime bin
        this.binChangeTest(matrix, col, fields, 1, triggered_changes);
        return;
      }

      // Match [field]<field unit>
      if (field.title === prevName + ' unit') {
        // Match [field]<field unit>[field bin]
        if (prevName + ' bin' === nextName) {
          // trigger reevaluation of bin from field
          matrixRow[col - 1] = this.hot.getDataAtCell(row, col - 1);
          matrixRow[col] = this.hot.getDataAtCell(row, col);
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
    const fields = this.getFields();
    for (let col = 0; col < fields.length; col++) {
      const field = fields[col];

      // Test field against capitalization change.
      if (field.capitalize) {
        for (let row = 0; row < matrix.length; row++) {
          if (!matrix[row][col]) continue;
          matrix[row][col] = changeCase(matrix[row][col], field);
        }
      }

      var triggered_changes = [];

      // Rules that require a column or two following current one.
      if (fields.length > col + 1) {
        const nexttitle = fields[col + 1].title;

        // Rule: for any <x>[x bin] pattern of field names,
        // find and set appropriate bin selection.
        if (nexttitle === field.title + ' bin') {
          this.binChangeTest(matrix, col, fields, 1, triggered_changes);
        }
        // Rule: for any [x], [x unit], [x bin] series of fields
        else if (nexttitle === field.title + ' unit') {
          if (fields[col].datatype === 'xsd:date') {
            //Validate
            for (let row = 0; row < matrix.length; row++) {
              if (!matrix[row][col]) continue;
              const dateGranularity = matrix[row][col + 1];
              if (dateGranularity === 'year' || dateGranularity === 'month') {
                matrix[row][col] = this.setDateChange(
                  dateGranularity,
                  matrix[row][col]
                );
              }
            }
          }
          //
          else if (fieldUnitBinTest(fields, col)) {
            // 2 specifies bin offset
            // Matrix operations have 0 for binOffset
            this.binChangeTest(matrix, col, fields, 2, triggered_changes);
          }
        }
      }

      // Do triggered changes:
      for (const change of triggered_changes) {
        matrix[change[0]][change[1]] = change[3];
      }
    }

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
            if (unit) {
              if (unit === 'month') {
                number = number / 12;
              }
            }
            // Force unit to be year if empty.
            //else {
            //  triggered_changes.push([rowOffset + parseInt(row), col+1, undefined, 'year']);
            //}
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
          if (!bin_value || (bin_value === '' && value in bin_values)) {
            selection = value;
          }
          // If a unit field exists, then set that to metadata too.
          if (binOffset == 2) {
            const unit_value =
              typeof matrix[hotRowPtr] !== 'undefined'
                ? matrix[hotRowPtr][hotRowNextCol]
                : null;
            const unit_values = fields[col + 1].flatVocabulary;
            if (!unit_value || (unit_value === '' && value in unit_values)) {
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
    const fieldNames = this.getFields().map((field) => field.name);
    return this.validator.validate(data, fieldNames);
  }

  doPreValidationRepairs(data) {
    return new Promise((resolve) => {
      const cellChanges = [];
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
          const cellVal = data[row][col];
          const field = this.fields[col];
          const datatype = field.datatype;

          if (datatype === 'Provenance') {
            checkProvenance(cellChanges, fullVersion, cellVal, row, col);
          } else if (field.flatVocabulary) {
            if (field.multivalued === true) {
              const [, update] = validateValsAgainstVocab(cellVal, field);
              if (update) {
                cellChanges.push([row, col, update, 'thisChange']);
              }
            } else {
              const [, update] = validateValAgainstVocab(cellVal, field);
              if (update) {
                cellChanges.push([row, col, update, 'thisChange']);
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
    const columnHeaders = handsontableInstance.getColHeader().map(stripDiv);

    function createStruct(row) {
      const structInstance = {};
      for (let i = 0; i < row.length; i++) {
        // Optional type checking (adjust data types as needed)
        if (typeof columnHeaders[i] === 'string') {
          structInstance[columnHeaders[i]] = row[i];
        } else if (typeof columnHeaders[i] === 'number') {
          structInstance[columnHeaders[i]] = Number(row[i]); // Convert to number
        } else {
          // Handle other data types if needed
          structInstance[columnHeaders[i]] = row[i];
        }
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
