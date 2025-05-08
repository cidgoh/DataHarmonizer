import * as $ from 'jquery';
import i18n from 'i18next';

import { DataHarmonizer } from '.';
import { findLocalesForLangcodes } from './utils/i18n';
import { Template, getTemplatePathInScope } from '../lib/utils/templates';

import { wait, isEmpty} from '../lib/utils/general';
import { invert, removeNumericKeys, consolidate } from '../lib/utils/objects';
import { createDataHarmonizerContainer, createDataHarmonizerTab } from '../web';
import { getExportFormats } from 'schemas';
import { range as arrayRange } from 'lodash';
import { deepMerge } from '../lib/utils/objects';
import Validator from './Validator';
import i18next from 'i18next';

const SCHEMAMENUS = ['SchemaTypeMenu','SchemaClassMenu','SchemaSlotMenu','SchemaSlotGroupMenu','SchemaEnumMenu'];

class AppConfig {
  constructor(template_path = null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}
export default class AppContext {
  dhs = {};
  current_data_harmonizer_name = null;
  currentSelection = null;
  template = null;
  export_formats = {};
  field_settings = {};
  dependent_rows = new Map();

  constructor(appConfig = new AppConfig(getTemplatePathInScope())) {
    this.appConfig = appConfig;
    console.log("this shouuld only be done once")
    // THIS WAS $(document), but that was causing haywire issues with Handsontable!!!!
    // Each tab was requiring a double click to fully render its table!!!
    $('#data-harmonizer-tabs').on('dhTabChange', (event, class_name) => {
      //if (this.getCurrentDataHarmonizer() !== class_name) {
        //this.tabChange(class_name);
      //}
    });
  }

  async tabChange(class_name) {
    console.info(`Tab change: ${this.getCurrentDataHarmonizer().template_name} -> ${class_name}`);
    this.setCurrentDataHarmonizer(class_name);
    // Trigger Toolbar to refresh sections and tab content ONLY IF not already there.
    let dh = this.getCurrentDataHarmonizer();
  
    this.toolbar.setupSectionMenu(dh);
    // Jump to modal as well
    this.toolbar.setupJumpToModal(dh);
    this.toolbar.setupFillModal(dh);

    dh.clearValidationResults();
    // Schema editor SCHEMA tab should never be filtered.
    // ACTUALLY NO TAB THAT ISN'T A DEPENDENT SHOULD BE FILTERED.
    // OR MORE SIMPLY WHEN FILTERING WE ALWAYS PRESERVE FOCUSED NODE - BUT WE DON'T WANT EVENT TRIGGERED
    // 
    if (!( dh.schema.name === 'DH_LinkML' && class_name === 'Schema')) {
      let dependent_report = dh.context.dependent_rows.get(class_name);
      dh.filterByKeys(dh, class_name, dependent_report.fkey_vals);
    }

    //$(document).trigger('dhCurrentChange', {
    //  dh: this.getCurrentDataHarmonizer(),
    //});
  };

  /*
   * Return initialized, rendered dataHarmonizer instances rendered in order
   * of their appearance as classes in schema. If a template name (class name)
   * is provided, only include that one and any dependent tables in its schema.
   * Each class has one or more slots (attributes) which each contain a
   * foreign_key which determines parent-child relationships.
   *
   * Uses this.relations to construct list of main DH class and its dependant
   * classes.
   *
   * Processing each class into DataHarmonizer tables:
   * - One DH instance per class: this.dhs[template_name]
   *   - In rendered DH view, filter its table rows by the foreign key slots
   *     featured in that class.
   * - Navigation: One tab per DH instance.
   */
  async reload(template_path, locale = null, forced_schema = null) {
    this.clearInterface();

    this.appConfig = new AppConfig(template_path);
    const [schema_path, template_name] =
      this.appConfig.template_path.split('/');


    this.template = await Template.create(schema_path, { forced_schema });
    if (locale !== null) {
      this.template.updateLocale(locale);
    }

    // Empty case will occur when template_path doesn't correspond to a built template
    this.export_formats = forced_schema
      ? {}
      : await getExportFormats(schema_path);

    const schema =
      locale !== null
        ? this.template.localized.schema
        : this.template.default.schema;

    // .relations is a 2 pass construction. 1st pass, create parent/child
    // relations. 2nd pass: create a carefully organized MAP
    // {[class_name]: dh...} which functions can process in left-to-right order
    // to account for cascading actions on primary/foreign key relations.
    this.relations = this.crudGetRelations(schema);
    for (const class_name in schema.classes) {
      if (class_name != 'Container' && class_name != 'dh_interface') {
        this.relations[class_name].dependents =
          this.crudGetDependents(class_name);
      }
    }

    // Ensure dynamic Enums are added so picklist source / range references are
    // detected and pulldown/multiselect menus are crafted; and validation works
    if (schema.name === 'DH_LinkML') {
      SCHEMAMENUS.forEach((item) => {
        if (!(item in schema.enums)) {
          schema.enums[item] = {name: item};
        }
      });
    };

    this.dhs = this.makeDHsFromRelations(schema, template_name);
    this.refreshSchemaEditorMenus(); // requires classes Class, Enum to be built.
    // this.currentDataHarmonizer is now set.
    this.crudGetDependentRows(this.current_data_harmonizer_name);
    this.crudUpdateRecordPath();
    // Display Focus path only if there is some path > 1 element.
    $("#record-hierarchy-div").toggle(Object.keys(this.relations).length > 1);
    return this;
  }

  /** Schema editor functionality: This function refreshes both the given menu
   * (or default list of them), and ALSO updates the slot select/multiselect 
   * lists that reference them, for editing purposes.
   * 
   * 1) Regenerate given menus
   *    CASE A: No schema loaded.  Revert to dh.schema for source of types, 
   *      classes, enums.
   *    CASE B: A schema has been loaded.  In addition to dh.schema data types, 
   *      Use Class & Enum template hot data.
   * 
   * 2) Find any DH class / tab's slot that mentions changed enums, and 
   *      regenerate its "cached" flatVocabulary etc.
   * 
   * @param {Array} enums list of special enumeration menus. Default list
   * covers all menus that schema editor might have changed dynamically.
   */
  refreshSchemaEditorMenus(enums = SCHEMAMENUS) {
    const schema = this.template.current.schema;
    if (schema.name === 'DH_LinkML') {
      for (const enum_name of enums) {
        // Initialize TypeMenu, ClassMenu and EnumMenu

        const permissible_values = {};
        let dh_schema = this.dhs['Schema']; //dh_schema.template_name == Schema
        let user_schema_name = 'DH_LinkML'; // default
        
        const selected_schema_row = dh_schema.hot.getSelected()?.[0][0]; 
        if (selected_schema_row >=0) {
          const selected_schema_name = dh_schema.hot.getDataAtCell(selected_schema_row, 0);
          if (selected_schema_name) {
            user_schema_name = selected_schema_name;
          }
        }

        switch (enum_name) {

          case 'SchemaTypeMenu':

            // This is list of basic LinkML types imported via DH_LinkML spec
            // (Including a few - provenance and WhitespaceMinimizedString -
            // that DH offers).
            Object.entries(schema.types).forEach(([data_type, type_obj]) => {
              permissible_values[data_type] = {
                name: type_obj.name, 
                text: data_type, 
                description: type_obj.description || ''
              };
            });

            // FUTURE: Extend above types with to template dedicated to user-
            // defined types.

            break;

          case 'SchemaClassMenu':
            // Get the classes from the Classes tab, filtered for schema_name
            // selected in Schema tab.
            this.getDynamicMenu(schema, schema.classes, 'Class', user_schema_name, permissible_values);
            break;

          case 'SchemaEnumMenu':
            // Get the enums from the Enums tab, filtered for schema
            // selected in Schema tab.
            this.getDynamicMenu(schema, schema.enums, 'Enum', user_schema_name, permissible_values);
            break;

          case 'SchemaSlotMenu':
            // Get the enums from the Enums tab, filtered for schema
            // selected in Schema tab.
            this.getDynamicMenu(schema, schema.slots, 'Slot', user_schema_name, permissible_values);
            break;

          case 'SchemaSlotGroupMenu':
            /** Fabricate list of active class's SchemaSlotGroupMenu 
             * slot_group values and make menu for it. To prepare SlotGroup
             * tab up to work with this, FIRST set its slot_group field and
             * load its source to point to this class.
             */ 
            //const regexp = /(?:SchemaSlotGroup)(.+)(?:Menu)/;
            //const class_name = regexp.exec(enum_name);
            const class_dh = this.dhs['Class'];
            const class_name = class_dh.hot.getDataAtCell(
              class_dh.current_selection[0],
              class_dh.slot_name_to_column['name']
            );

            if (class_name) {
              const schema_focus_row = dh_schema.current_selection[0];
              const schema_name = dh_schema.hot.getDataAtCell(schema_focus_row, 0);
              const slot_dh = this.dhs['Slot'];
              const slot_group_ptr = slot_dh.slot_name_to_column['slot_group'];
              const slot_rows = this.crudFindAllRowsByKeyVals('Slot', {
                schema_id: schema_name, 
                class_id: class_name,
                slot_type: 'slot_usage'
              })

              for (let row of slot_rows) {
                const slot_group_text = slot_dh.hot.getDataAtCell(row, slot_group_ptr);
                if (!(slot_group_text in permissible_values)) {
                  permissible_values[slot_group_text] = {text: slot_group_text, title: slot_group_text};
                }
              };

              //console.log("DYNAMIC", class_name, permissible_values, slot_dh.slots[slot_group_ptr])
            }

        }

        // ISSUE: Handsontable multiselect elements behaving differently from pulldowns.
        // CANT dynamically reprogram dropdown single selects
        // ONLY reprogrammable for multiselects. 
        // Reset menu's permissible_values to latest.
        schema.enums[enum_name].permissible_values = permissible_values;

      }

      // Then trigger update for any slot that has given menu in range.
      // Requires scanning each dh_template's slots for one that mentions
      // an enums enum, and updating each one's flatVocabulary if found.
      for (let tab_dh of Object.values(this.dhs)) {
        const Cols = tab_dh.columns;
        let change = false;
        for (let slot_obj of Object.values(tab_dh.slots)) {
          for (let slot_enum_name of Object.values(slot_obj.sources || {})) {
            // Found one of the regenerated enums above so recalculate 
            // flatVocabulary etc.
            if (enums.includes(slot_enum_name)) {
              this.setSlotRangeLookup(slot_obj);
              if (slot_obj.sources) {
                //FUTURE: tab_dh.hot.propToCol(slot_obj.name) after Handsontable col.data=[slot_name] implemented
                const meta = tab_dh.hot.getColumnMeta(tab_dh.slot_name_to_column[slot_obj.name]);
                meta.source = tab_dh.updateSources(slot_obj);
              }
              break;
            }
          }
        }
      }
    }
    return false;
  }

  /** For generating permissible_values for SchemaTypeMenu, SchemaClassMenu,
   * SchemaEnumMenu menus from schema editor schema or user schema.
   */
  getDynamicMenu(schema, schema_focus, template_name, user_schema_name, permissible_values) {   
    if (user_schema_name === 'DH_LinkML') {
      for (let focus_name of Object.keys(schema_focus)) {
        permissible_values[focus_name] = {
          name: focus_name,
          text: focus_name,
          description: schema_focus[focus_name].description
        }
      }
    }
    else {
      let focus_dh = this.dhs[template_name];
      let name_col = focus_dh.slot_name_to_column['name'];
      let description_col = focus_dh.slot_name_to_column['description'];
      for (let row in this.crudFindAllRowsByKeyVals(template_name, {schema_id: user_schema_name})) {
        let focus_name = focus_dh.hot.getDataAtCell(row, name_col);
        if (focus_name) {//Ignore empty class_name field
          permissible_values[focus_name] = {
            name: focus_name,
            text: focus_name,
            description: focus_dh.hot.getDataAtCell(row, description_col)
          }
        }
      }
    }
  } 

  /**
   * Creates Data Harmonizers from the schema tree.
   * FUTURE: Make this a 2 pass thing.  First pass creates every dataharmonizer
   * data structure; 2nd pass initializes handsontable part.
   * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
   * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
   */
  makeDHsFromRelations(schema, template_name) {
    let data_harmonizers = {}; // Tacitly ordered attribute object

    Object.entries(schema.classes)
      // Container class is only used in input and output file coordination.
      .filter(
        ([class_name]) =>
          class_name == template_name ||
          this.relations?.[template_name]?.dependents?.has(class_name)
      )
      .forEach((obj, index) => {
        if (obj.length > 0) {
          const [class_name, class_obj] = obj;
          // Move createDataHarmonizerTab() to HTML utilities, and move prep there.
          // Tooltip lists any parents of this class whose keys must be satisfied.
          const is_child = !(class_name == template_name);
          let tooltip = Object.keys(this.relations[class_name]?.parent)
            .map((parent_name) => schema.classes[parent_name].title)
            .join(', ');
          if (tooltip.length) {
            tooltip = `<span data-i18n="tooltip-require-selection">${i18next.t('tooltip-require-selection')}</span>: ${tooltip}`; //Requires key selection from x, y, ...
          }
          const dhId = `data-harmonizer-grid-${index}`;
          const tab_label = class_obj.title ? class_obj.title : class_name;
          const dhTab = createDataHarmonizerTab(dhId, tab_label, class_name, tooltip, index === 0);
          const self = this;

          dhTab.addEventListener('click', (event) => { 
            // Or try mouseup if issues with .filtersPlugin and bootstrap timing???
            // Disabled tabs shouldn't triger dhTabChange.
            if (event.srcElement.classList.contains("disabled"))
              return false;
            // Message picked up on Toolbar.js 
            this.tabChange(class_name);

            //$('#'+dhId).trigger('dhTabChange', class_name);
            return true;
          });

          // Each selected DataHarmonizer is rendered here.
          // NOTE: this may be running twice?.
          // in 1-M, different DataHarmonizers have fewer rows to start with
          // Child tables are displayed differently so override the default
          // HoT settings.
          const dhSubroot = createDataHarmonizerContainer(dhId, index === 0);
          const handsOnDH = new DataHarmonizer(dhSubroot, this, {
            loadingScreenRoot: document.body,
            template_name: class_name,
            schema: schema, // assign during constructor so validator can init on it.
            hot_override_settings: {
              minRows: is_child ? 0 : 10,
              minSpareRows: 0,
              //minHeight: '200px', // nonsensical if no rows exist
              height: is_child ? '60vh' : '75vh', //'400px' : '700px', // 
              // TODO: Workaround, possibly due to too small section column on child tables
              // colWidths: is_child ? 256 : undefined,
              colWidths: 200,
            },
          });
          //Object.assign(dh, handsOnDH);
          handsOnDH.validator.useTargetClass(class_name);
          handsOnDH['template'] = schema.classes[class_name];
          data_harmonizers[class_name] = handsOnDH;
          // Set up the data structure (.template,.slots,.slot_names etc
          // based on LinkML class
          this.useTemplate(handsOnDH, class_name);

          handsOnDH.createHot();

          // FUTURE: try reorganization to separate dh from all .context 
          // schema/template data/functions

          if (is_child) {
            /* Initialization of each child table is to hide all rows until
             * parent primary key record is selected as a foreign key index.
             * Note: user cut and paste of records doesn't change content of
             * read-only fields, thankfully.
             **/
            handsOnDH.filterAll(handsOnDH); // Hides rows.
            this.crudMakeForeignKeysReadOnly(handsOnDH, class_name);
          }
          // Top level class, so make it active.  There should only be one
          else {
            this.setCurrentDataHarmonizer(class_name);
          }
        }
      });
    return data_harmonizers;
  }

  /**
   * Revise user interface elements to match template content
   *
   * @param {String} template_name: name of template within current schema
   */
  useTemplate(dh, template_name) {
    dh.template_name = template_name;
    dh.sections = []; // This will hold template's new data including table sections.

    const sectionIndex = new Map();

    // Gets LinkML SchemaView() of given template
    // problem: multiclass schemas means this template doesn't reflect the underlying structure anymore.
    // const specification = this.schema.classes[template_name];
    // Class contains inferred attributes ... for now pop back into slots

    let attributes = Object.entries(this.template.default.schema.classes)
      .filter(([cls_key]) => cls_key === dh.template_name)
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
      let slot = deepMerge(
        attributes[name],
        this.template.current.schema.slots[name]
      );

      //let slot = attributes[name];
      let section_title = null;

      if ('slot_group' in slot) {
        // We have a slot positioned within a section (or hierarchy)
        section_title = slot.slot_group;
      } else {
        if ('is_a' in slot) {
          section_title = slot.is_a;
        } else {
          section_title = 'Generic';
          console.warn("Template slot doesn't have section: ", name);
        }
      }

      if (!sectionIndex.has(section_title)) {
        sectionIndex.set(section_title, sectionIndex.size);
        let section_parts = {
          title: section_title,
          children: [],
        };
        const section = this.template.current.schema['slots'][section_title];
        if (section) {
          Object.assign(section_parts, section);
        }
        dh.sections.push(section_parts);
      }

      let section = dh.sections[sectionIndex.get(section_title)];
      let new_slot = Object.assign(structuredClone(slot), { section_title }); // shallow copy

      // Some specs don't add plain english title, so fill that with name
      // for display.
      if (!('title' in new_slot)) {
        new_slot.title = new_slot.name;
      }

      /** Handsontable columns have a "cell type" which may trigger datepicker
       * or boolean editing controls and date/numeric etc. validation.  The 
       * basic default datatype is "text", but date, time, select, dropdown, 
       * checkbox etc are options, but we have only implemented some of them.  
       * See https://handsontable.com/docs/javascript-data-grid/cell-type/ 
       */
      new_slot.datatype = null;

      /** 
       * For LinkML we have a default slot type of xsd:string, but 
       * xsd:token, which strips whitespace before or after text, and strips
       * extra space within text.  xsd:string allows whitespace anywhere.
       *
       * A LinkML slot can have multiple values in its range. Each value can
       * be a fundamental LinkML data type, a Class, or an Enum reference.
       * See https://linkml.io/linkml/schemas/slots.html#ranges
       * We hold each vetted range in range_array, and  
      */
      let range_array = [];

      // Range expressed as logic on given array: / all_of / any_of /  exactly_one_of / none_of
      for (let range_type of ['all_of','any_of','exactly_one_of','none_of']) {
        if (range_type in new_slot) {
          for (let item of new_slot[range_type]) {
            if (
              item.range in this.template.default.schema.enums ||
              item.range in this.template.default.schema.types ||
              item.range in this.template.default.schema.classes // Possibility of collisions here w enums and types.          
            ) {
              range_array.push(item.range);
            }
          }
        }
      }

      // Idea is that schema slot will only have range XOR any_of etc. construct, not both.
      if (range_array.length == 0)
        range_array.push(new_slot.range);

      /* Special case: if slot_name == "range" and template name = "Slot" then
       * loaded templates are parts of the schema editor and we need this slot
       * to provide a menu (enumeration) of all possible ranges that LinkML 
       * would allow, namely, the list of loaded Types, Classes, and 
       * Enumerations. For now, Types are the ones uploaded with the schema, 
       * later they will be editable.  Classes and Enumerations come directly
       * from the loaded Class and Enum tabs.  As new items are added
       * or removed from Class and Enum tabs, this schema_editor schema's 
       * "range" slot's .sources and .flatVocabulary and .flatVocabularyLCase 
       * arrays, and permissible_values object must be refreshed.
       */


      // Parse slot's range(s)
      for (let range of range_array) {
        if (range === undefined) {
          console.warn(`ERROR: Template ${template_name} slot ${new_slot.name} has no range.`);
          continue;
        }

        // Here range is a datatype
        if (range in this.template.default.schema.types) {

          /* LinkML typically translates "string" to "uri":"xsd:string" 
           * but this is problematic because that allows newlines which
           * break spreadsheet saving of items in tsv/csv format. Use
           * xsd:token to block newlines and tabs, and clean out leading 
           * and trailing whitespace. 
           * Note: xsd:normalizedString allows lead and trailing whitespace.
           */
          switch (range) {
            case 'WhitespaceMinimizedString':
              new_slot.datatype = 'xsd:token';
              break;
            case 'string':
              new_slot.datatype = 'string';
              break;
            case 'Provenance':
              new_slot.datatype = 'Provenance';
              break;
            default:
              new_slot.datatype = this.template.default.schema.types[range].uri;
            // e.g. 'time' and 'datetime' -> xsd:dateTime'; 'date' -> xsd:date
          }
          continue;
        } 

        // If range is an enumeration ...
        if (range in this.template.current.schema.enums) {
          new_slot.sources??= [];
          new_slot.sources.push(range);
          continue;
        }

        // If range is a class ... ???
        if (range in this.template.current.schema.classes) {
          continue;
        }
          
        /* FUTURE: LinkML model for quantity value, along lines of 
         * https://schema.org/QuantitativeValue, e.g. xsd:decimal + unit
         * PROBLEM: There are a variety of quantity values specified, some
         * allowing units which would need to go in a second column unless
         * validated as text within column.
        */

        console.warn(`ERROR: Template "${template_name}" slot "${new_slot.name}" range "${range}" is not recognized as a data type, Class or Enum.`);
      }

      if (new_slot.sources?.length > 0) {
        // sets slots flatVocabulary etc. based on sources enums.
          this.setSlotRangeLookup(new_slot);
      }

      // Provide default datatype if no other selected
      if (!new_slot.datatype) {
        new_slot.datatype = 'xsd:token';
      }

      // new_field.todos is used to store some date tests that haven't been
      // implemented as rules yet.
      if (new_slot.datatype == 'xsd:date' && new_slot.todos) {
        // Have to feed any min/max date comparison back into min max value fields
        for (const test of new_slot.todos) {
          if (test.substr(0, 2) == '>=') {
            new_slot.minimum_value = test.substr(2);
          }
          if (test.substr(0, 2) == '<=') {
            new_slot.maximum_value = test.substr(2);
          }
        }
      }

      /* Older DH enables mappings of one template field to one or more 
        export format fields
        */
      this.setExportField(new_slot, true);

      /* https://linkml.io/linkml-model/docs/structured_pattern/
       https://github.com/linkml/linkml/issues/674
       Look up its parts in "settings", and assemble a regular 
       expression for them to compile into "pattern" attribute. 
       This augments basic datatype validation
          structured_pattern:
              syntax: "{float} {unit.length}"
              interpolated: true   ## all {...}s are replaced using settings
              partial_match: false
      */
      if ('structured_pattern' in new_slot) {
        switch (new_slot.structured_pattern.syntax) {
          case '{UPPER_CASE}':
          case '{lower_case}':
          case '{Title_Case}':
            new_slot.capitalize = true;
        }
        // TO DO: Do conversion here into pattern attribute.
      }

      // pattern is supposed to be exlusive to string_serialization
      if (slot.pattern?.length) {
        // Trap invalid regex
        // Issue with NMDC MIxS "current land use" slot pattern: "[ ....(all sorts of things) ]" syntax.
        try {
          new_slot.pattern = new RegExp(slot.pattern);
        } catch (err) {
          console.warn(
            `TEMPLATE ERROR: Check the regular expression syntax for "${new_slot.name}".`
          );
          console.error(err);
          // Allow anything until regex fixed.
          new_slot.pattern = new RegExp(/.*/);
        }
      }
      if (this.field_settings[name]) {
        Object.assign(new_slot, this.field_settings[name]);
      }

      if (slot.annotations) {
        new_slot.annotations = slot.annotations;
      }

      section.children.push(new_slot);
    } // End slot processing loop

    this.setDHSlotLookups(dh);

  };

  /** A set of lookup functions is compiled for each DH template / class.
   */
  setDHSlotLookups(dh) {

    // Sections and their children are sorted by .rank parameter if available
    dh.sections.sort((a, b) => a.rank - b.rank);

    // Sort kids in each section
    for (let ptr in this.sections) {
      dh.sections[ptr]['children'].sort((a, b) => a.rank - b.rank);
    }

    // Easy lookup arrays.
    // Array of slot objects, with each index being a column in Handsontable.
    // LOOKUP: table (Handsontable) column to slot object.
    dh.slots = Array.prototype.concat.apply(
      [],
      dh.sections.map((section) => section.children)
    );

    // LOOKUP: column # to name
    dh.slot_names = dh.slots.map((slot) => slot.name);

    // LOOKUP: slot name to column #
    // Note of course that duplicate names yield farthest name index.
    dh.slot_name_to_column = {};
    Object.entries(dh.slots).forEach(
      ([index, slot]) => (dh.slot_name_to_column[slot.name] = parseInt(index))
    );

    dh.slot_title_to_column = {};
    Object.entries(dh.slots).forEach(
      ([index, slot]) => (dh.slot_title_to_column[slot.title] = parseInt(index))
    );
  }

  /** Compile a slot's enumeration lookup (used in single and multivalued
   * pulldowns)
   * 
   */
  setSlotRangeLookup(slot) {

    for (let range of slot.sources) {
      const permissible_values = this.template.current.schema.enums[range].permissible_values;

      slot.permissible_values??= {};
      slot.permissible_values[range] = permissible_values;

      // This calculates for each categorical slot range in schema.yaml a
      // flat list of allowed values (indented to represent hierarchy)
      slot.flatVocabulary??= [];
      const flatVocab = this.stringifyNestedVocabulary(permissible_values);
      slot.flatVocabulary.push(...flatVocab);

      // Lowercase version used for easy lookup/validation in case where
      // provider data might not have the capitalization right.
      slot.flatVocabularyLCase??= [];
      slot.flatVocabularyLCase.push(
        ...flatVocab.map((val) => val.trim().toLowerCase())
      );
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
   * Run void function behind loading screen.
   * Adds function to end of call queue. Does not handle functions with return
   * vals, unless the return value is a promise. Even then, it only waits for the
   * promise to resolve, and does not actually do anything with the value
   * returned from the promise.
   * @param {function} fn - Void function to run.
   * @param {Array} [args=[]] - Arguments for function to run.
   */
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

  getTemplateName() {
    return this.appConfig.template_path.split('/')[1];
  }

  setCurrentDataHarmonizer(data_harmonizer_name) {
    this.current_data_harmonizer_name = data_harmonizer_name;
  }

  getCurrentDataHarmonizer() {
    return this.dhs[this.current_data_harmonizer_name];
  }

  getSchema() {
    return this.template.current.schema;
  }

  getLocaleData(template) {
    let locales = {
      default: { langcode: 'default', nativeName: 'Default' },
      ...findLocalesForLangcodes(template.locales),
    };
    return locales;
  }

  /* NOTE: This likely needs to be redone.  Objective is to populate 
   * i18n.addResources() lookup table.  Issue is that forward and reverse
   * translation of enumeration items this code is used primarily to setup the resources for
  // translateObject, translateValue and translateMultivalued in translateData
  // when loading data from a file. as such it is being scoped down to manage enum translations.
  */
  addTranslationResources(template, locales = null) {
    if (locales === null) {
      locales = this.getLocaleData(template);
    }

    const defaultLocale = {
      langcode: 'default',
      nativeName: 'Default',
    };

    // Combine default and found locales
    locales = {
      ...locales,
      default: defaultLocale,
      ...findLocalesForLangcodes(template.locales),
    };

    // Helper function to process ENUMERATION permissible values into a translation map
    // ISSUE: MUST MAKE KEY LOOKUP SENSITIVE TO WHICH ENUMERATION permissible_value
    // is in.
    const getEnumResource = (enumObject) => {
      return consolidate(enumObject, (acc, [, enumObj]) => {
        const { permissible_values } = enumObj || {};
        if (permissible_values) {
          Object.entries(permissible_values).forEach(([, enumData]) => {
            const { title, text } = enumData;
            const key = text; // Enum keys are the 'text'
            const value = title || text; // Use title if available, fallback to text
            acc[key] = value; // Forward translation (text -> title)
            acc[value] = key; // Reverse translation (title -> text)
          });
        }
        return acc;
      });
    };

    // Build translation maps for each language
    const translationsByLanguage = {};
    // E.g. template.translations{default: {schema en ...}, fr: {schema fr...},...}
    Object.entries(template.translations).forEach(([langcode, translation]) => {
      // Compute the enum resource for this language
      const enumResource = getEnumResource(translation.schema.enums);

      // Store the translations for this language.
      // NOTE: "Use primary language code" - WHY?
      const currentLang = langcode.split('-')[0];
      translationsByLanguage[currentLang] = {
        ...enumResource,
      };
    });

    // Generate translation maps between all possible language combinations
    const languageCodes = Object.keys(translationsByLanguage);

    // Loop over each source-destination language pair
    languageCodes.forEach((sourceLang) => {
      languageCodes.forEach((targetLang) => {
        if (sourceLang === targetLang) return; // Skip identical language pairs

        const sourceTranslation = translationsByLanguage[sourceLang];

        // Add resources for the current source-target language pair
        i18n.addResources(
          sourceLang,
          `${sourceLang}_to_${targetLang}`,
          removeNumericKeys(sourceTranslation)
        );

        // Add reverse mapping for this pair (target -> source)
        i18n.addResources(
          targetLang,
          `${targetLang}_to_${sourceLang}`,
          removeNumericKeys(invert(sourceTranslation))
        );
      });
    });
  }

  clearContext() {
    this.schema_tree = {};
    this.dhs = {};
    this.current_data_harmonizer_name = null;
    this.currentSelection = null;
  }

  clearInterface() {
    document.querySelector('#data-harmonizer-tabs').innerHTML = '';

    const pattern = 'data-harmonizer-grid-'; // sub elements
    const matchingElements = document.querySelectorAll(`[id^="${pattern}"]`);

    // Loop through the NodeList and remove each element
    matchingElements.forEach((element) => {
      element.parentNode.removeChild(element);
      element.remove();
    });
  }

  /**************************** CRUD RELATED METHODS *************************/
  /**
   * General behaviour
   *
   * WRT rows with keys pointing to foreign keys, a user:
   * - Can't input directly into foreign key cells.
   * - Can delete a row with foreign key(s)
   * - Can add a new row only if foreign key(s) table(s) are
   *   focused on key fields that have values.
   *
   * WRT rows which are foreign keys to other tables, a user:
   * - Can update or delete a key field which then cascades to
   *   other child table(s). This might trigger violation of unique_keys!
   *
   * Note: user cut and paste of records doesn't change read-only
   * fields.
   */

  /**
   * Establish an easy bidirectional lookup between schema classes that have
   * foreign keys. Usually one table will have 1 or n slots keyed to one other
   * table's slots.  Sometimes a table may have two slots keyed to respective
   * other tables.  
   * 
   * (Whether a table forces the combination of its foreign key slot values 
   * to be unique or not is a separate validation question controlled by a 
   * classes' unique_keys and slot's "identifier" attributes.)
   *
   * Assumes slot.attribute.annotations.foreign_key is formatted as [class_name].[slot_name]
   * INPUT

    "attributes": {
      "sample_collector_sample_id": {
        "name": "sample_collector_sample_id",
        "annotations": {
          "required": {
            "tag": "required",
            "value": true
          },
          "foreign_key": {
            "tag": "foreign_key",
            "value": "GRDISample.sample_collector_sample_id"
          }
        },
        "range": "GRDISample",

   * Paraphrased example OUTPUT 

    relations.[class_name]: {
      parent:  {[foreign_class]: {[slot_name]: [foreign_slot_name]...}...},
      child:   {[dependent_class]: {[slot_name]: dependent_slot_name...}...},
      dependent_slots: {[slot_name]: { [dependent_class]: dependent_slot_name}...}},
      target_slots: {[foreign_slot_name]: {[class_name]: slot_name}};
      unique_key_slots: {[slot_name]: {[unique_key_name]:true, ... }

      // Added on 
      dependents: {[dependent_name]:[dependent dh],...},
    }

  */
  crudGetRelations(schema) {
    let relations = {};

    // First pass establishes basic attributes so 2nd pass references to 
    // .parent or .child don't matter, i.e. classes can be processed in
    // any order.
    Object.entries(schema.classes).forEach(([class_name, class_obj]) => {
      if (class_name != 'Container' && class_name != 'dh_interface') {
        relations[class_name] = {
          parent: {},
          child: {},
          dependent_slots: {},
          foreign_key_count: 0,
          target_slots: {},            
          unique_key_slots: {}
        };
      }
    });

    Object.entries(schema.classes).forEach(([class_name, class_obj]) => {
      if (class_name != 'Container' && class_name != 'dh_interface') {

        Object.entries(class_obj.attributes ?? {}).forEach(
          ([slot_name, attribute]) => {
            if (attribute.annotations?.foreign_key?.value) {
              let foreign_class, foreign_slot_name;
              let key = attribute.annotations.foreign_key.value;
              // FIRST, TRY GETTING PARENT CLASS VIA foreign class with dot prefix:
              if (key.includes('.'))
                [foreign_class, foreign_slot_name] = key.split('.', 2);
              // ALTERNATELY (UNTESTED) USE range of slot having reference to a class:
              // NOTE: this doesn't handle multiple classes in range.
              else if (attribute.range in schema.classes) {
                foreign_slot_name = key;
                foreign_class = attribute.range;
              } else {
                console.log(`Class ${class_name} has slot ${slot_name} and foreign key ${attribute.annotations?.foreign_key?.value} but no target class information in key or slot range.`);
                return;
              }

              relations[class_name].parent[foreign_class] ??= {};
              relations[class_name].parent[foreign_class][slot_name] = foreign_slot_name;

              // And dependent slots within this class via other's foreign keys
              // Only one dependent can depend on a slot. 
              relations[class_name].dependent_slots[slot_name] = {
                foreign_class: foreign_class, 
                foreign_slot: foreign_slot_name
              };

              // And reverse relations: this is another table's child (dependent), its slot -> this slot.
              relations[foreign_class].child[class_name] ??= {};
              relations[foreign_class].child[class_name][foreign_slot_name] = slot_name;

              // And list of local slots that connect to targets of dependent slot foreign keys.
              // Another table's target slot_name is this table's slot.
              // Note: more than one foreign key can point to target slot. 
              relations[foreign_class].target_slots[foreign_slot_name] ??= {};
              relations[foreign_class].target_slots[foreign_slot_name][class_name] = slot_name;
            }
          }
        );

        relations[class_name].foreign_key_count = Object.keys(relations[class_name].dependent_slots).length;

        // Now do unique keys in class_obj which might not be mentioned in
        // foreign_class relationships.
        Object.entries(class_obj.unique_keys ?? {}).forEach(
          ([key_name, key_obj]) => {
            for (const slot_name of key_obj.unique_key_slots) {
              relations[class_name].unique_key_slots[slot_name] = key_name;
            }
          }
        );


      }
    });
    return relations;
  }

  crudGetParents(template_name) {
    return this.relations[template_name]?.parent;
  }

  crudGetChildren(template_name) {
    return this.relations[template_name]?.child;
  }

  /** Retrieves ORDERED DICT of tables that ultimately have given template as
   * a foreign key, IN ORDER.  Whether to enact cascading visibility, update or
   * deletion events, this provides the order in which to trigger changes.
   * Issue is that intermediate tables need to be checked in order due to
   * dependencies by foreign keys. If a table depended on an intermediate that
   * hadn't been refreshed, we'd get a wrong display.
   * Using Map to ensure order.
   * 
   * FUTURE: There may be a situation where a dependent is appendend onto the
   * stack as a child of some parent, but another class earlier in stack also
   * depends on it.  That earlier class should be moved to be after freshly
   * appended one?!
   * 
   * @param {String} class_names initial value
   * @param {Array} class_names array of relations
   * @return {Object} class_names where each descendent class_name is mentioned.
   */
  crudGetDependents(class_name, ptr = -1, stack = new Map()) {
    if (ptr == stack.length) {
      return stack;
    }
    const children = this.crudGetChildren(class_name);
    if (isEmpty(children)) {
      return stack; // catches undefined case
    }
    // Add each child to end of stack.
    let next_name = '';
    for (const dependent_name in children) {
      if (next_name == '') 
        next_name = dependent_name;
      stack.set(dependent_name, true);
    }
    return this.crudGetDependents(next_name, ptr + 1, stack);
  }

  /**
   * In focus display (usually in footer), show path from root to current
   * template that user has made a selection in. A complexity is that a 
   * class's keys may be composed of slots from have two (or more) separate
   * parents, each with parent(s) etc.
   * 
   */
  crudUpdateRecordPath() {
    const schema = this.template.current.schema;
    const current_template_name = this.getCurrentDataHarmonizer().template_name;
    let class_name = current_template_name; // current tab
    let hierarchy_text = [];
    let stack = [class_name];
    let done = {};
    while (stack.length >0) {
      class_name = stack.pop(); // pop class_name
      if (class_name in done)
        continue;
      const class_title = schema.classes[class_name].title;
      const dependent = this.dependent_rows.get(class_name);
      let key_string = '';
      let tooltip = '';
      Object.entries(dependent.key_vals).reverse().forEach(([key, value]) => { 
        if (key in dependent.fkey_vals) 
          value = '...'
        else if (value === null)
          value = '_';
        key_string = value + (key_string ? ', ' : '') + key_string; 
        tooltip = key + (tooltip ? ', ' : '') + tooltip;
      });
      let tooltip_text = `<span class="tooltipytext">${class_title} [ ${tooltip} ]</span>`;
      done[class_name] = `<b>${class_title}</b>&nbsp;<span class="tooltipy">[${key_string}]${tooltip_text}</span> `;

      // SEVERAL parents are possible - need them all displayed.
      let parents = Object.keys(this.relations[class_name].parent);
      if (!isEmpty(parents))
        stack.push(...parents);
    }
    //Need to assemble hierarchy text in same order as dhs order.
    for (class_name in this.template.default.schema.classes) {
      if (class_name in done)
      hierarchy_text.push(done[class_name]);
    }
    $("#record-hierarchy").html(hierarchy_text.join(' /&nbsp;'));
  }

  crudCalculateDependentKeys(class_name) {
    this.crudGetDependentRows(class_name); 
    this.crudUpdateRecordPath();
    let class_dependents = this.relations[class_name].dependents;
    for (let [dependent_name] of class_dependents.entries()) {
      this.setDHTabStatus(dependent_name);
      const dh = this.dhs[dependent_name];
    };
  };

  /* For given class, refresh view of all dependent tables that have a direct
   * or indirect foreign key relationship to given class.
   * Performance might show up as an issue later if lots of long dependent
   * tables to re-render.
   */
    /*
  crudFilterDependentViews(class_name) {



    // This recalculates rows to show.  
    let class_dependents = this.relations[class_name].dependents;
    let log_processed_dhs=[];
    for (let [dependent_name] of class_dependents.entries()) {
      let dependent_report = this.dependent_rows.get(dependent_name);
      this.setDHTabStatus(dependent_name);
      if (dependent_name != class_name) { // No need to redo class/ tab that user is currently on
        let dh = this.dhs[dependent_name];
        dh.filterByKeys(dh, dependent_name, dependent_report.fkey_vals);
        //this.crudFilterDependentRows(dependent_name, dependent_report);
      }
    };

    //console.log('crudFilterDependentViews',class_name,' > ', log_processed_dhs);

    this.crudUpdateRecordPath();
  }
    */
  /* For given class name (template), show only rows that conform to that
   * class's foreign key-value constraints.
   * (Could make a touch more efficient by skipping if we can tell that a
   * given table's foreign key values haven't changed.)
   * POSSIBLE ISSUE: if given class table has one parent table where no
   * primary key selection has been made!
   */
  crudFilterDependentRows(class_name, dependent_report) {
    alert("this shouldn't be running")
    const dh = this.dhs[class_name];
    const hotInstance = dh?.hot;
    // This can happen when one DH is rendered but not other dependents yet.
    if (!hotInstance) return;

    // Changing shown rows means we should get rid of any existing selections.
    // And not assume user has clicked on anything.
    hotInstance.deselectCell();
    dh.current_selection = [null,null,null,null];

    // this class's foreign keys if any, are satisfied.
    if (dependent_report.fkey_status > 0) {

      hotInstance.suspendExecution(); // See https://handsontable.com/docs/javascript-data-grid/api/core/#suspendexecution

      const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');

      // Ensure all rows are visible
      const oldHiddenRows = hiddenRowsPlugin.getHiddenRows();

      // arrayRange() makes [0, ... n]
      let rowsToHide = arrayRange(0, hotInstance.countSourceRows());
      rowsToHide = rowsToHide.filter((row) => !dependent_report.rows?.includes(row));

      // Make more efficient using Set() difference comparison?
      //if (rowsToHide != oldHiddenRows) {
      //Future: make more efficient by switching state of show/hide deltas?
      hiddenRowsPlugin.showRows(oldHiddenRows);
      hiddenRowsPlugin.hideRows(rowsToHide); // Hide the calculated rows

      hotInstance.resumeExecution();
    }

  }

  /** Activates/deactivates tab based on satisfaction of table's foreign keys.
   * fkey_status > 0 means parent table(s) slots used as keys by this table
   * are filled in so we can show content for this table, so activate tab.
   * Otherwise tab is deactivated.
   */
  setDHTabStatus(class_name) { 
    // Presumes dependent_rows has been updated:
    //const dh = this.dhs[class_name];
    //const hotInstance = dh?.hot;
    // This can happen when one DH is rendered but not other dependents yet.
    //if (!hotInstance) return;
    const domId = Object.keys(this.dhs).indexOf(class_name);
    const state = this.dependent_rows.get(class_name).fkey_status;
    $('#tab-data-harmonizer-grid-' + domId)
      .toggleClass('disabled',state == 0)
      .parent().toggleClass('disabled',state == 0);
  }

  /** 
   * Returns a count and row #s and slot keys of each dependent table's records
   * that are connected to particular foreign key(s) in root class_name table 
   * WHERE:
   *
   * 1) Dependent's primary key is held in one or more root/parent tables.
   * Function records which keys were changed so that subsequent delete or update
   * work can be done.
   *
   * crudGetDependentChanges is a 2 pass call.  First pass does search through
   * dependents list, mapping each to either:
   *    a) [primary_key: {slot: {value, change:}, ...}, count:], when matching
   *        primary key is found
   *    b) null in case where no primary key matched.
   *
   * Final step executes given action on dependent_rowsping.
   *
   *    a) Update is simpler case where only cascading update of changed root
   *       table slot(s) is needed.
   *    b) Delete is
   *
   * Assume more than one field/slot in root table can be changed. The change can be:
   * 1) a change in key that percolates down as far as the changed slots in key
   * reach.
   * 2) a deletion of records containing that changed key.
   *  - AND all dependent recordsentail a change in key,
   * affected by a change or deletion of their direct or indirect relation
   * to class_name's primary keys. This amounts to the same thing as finding
   * all dependent records that have some dependence on the given class_name
   * - but this is determined from the dependent's parent/foreign_keys
   * perspective.
   *
   * CASE 2: Shift from incomplete foreign key to complete one:
   * - This doesn't necessitate any action except say for a refresh
   *   of dependent table in case where we allow dependent to have 
   *   "loose cannon" foreign key references.
   * ISSUE IS THIS WOULD HAVE TO CASCADE KEY SENSITIVITY.
   * WHERE DOES KEY SENSITIVITY RESPONSIBILITY END?
   * 
   * TO DO: If dependent depends on more than one parent does this affect our
   * returned affected list?  Assuming not for now.
   * The delete or update in root table is row specific and happens in calling
   * routine via user confirmation.
   * Note: this report is done regardless of visibility of rows/columns to user.
   * 
   * Builds a list of dependents that have root-related records
   *  dependent_rows: {
   *    [dependent_name]: {
   *      slots: {} // just like start_name, these are values of all slots that other tables depend on.
   *      [parent]: {
   *        fkey_vals: {[slot_name]: value, ... },
   *        key_vals: {[slot_name]: value, ... },
   *        fkey_status: 0-2,
   *        changed_slots: {[slot_name]: value, ... },
   *        count: [# records in dependent matching this combo],
   *        rows: [row # of affected row, ...]
   *    }
   *  }
   *
   * For a given DH table, 1st user-selected row is used to get values for all non-foreign key and target slots.
   * 
   * @param {String} start_name name of root table to begin looking for cascading effect of foreign key changes. 
   * @param {String} class_name name of class (DataHarmonizer instance) to start from.
   * @param {Boolean} skipable: yes = don't do deep dive if no keys have changed for class name. Only for update case.
   * @param {Object} changes dictionary pertaining to a particular dh row's slots.
   * @return {Object} this.dependent_rows updated table of given start_name class's foreign and other keys and their current and changed values
   */
  crudGetDependentRows(start_name, skippable=false, changes = {}) {
    // Changes only apply to start_name class; all dependents should "see" them
    // only via dependent_rows foreign key values.
    let [key_vals, fkey_vals, fkey_status] = 
      this.crudGetDependentKeyVals(start_name, changes);

    // Changes may include any key slots (not just foreign keys), but other
    // slots are ignored.
    let changed_keys = Object.fromEntries(Object.entries(key_vals)
      .filter(([slot_name, value]) => changes.hasOwnProperty(slot_name))
      .map(([slot_name, value]) => ([slot_name, changes[slot_name].value]))
    );

    this.dependent_rows.set(start_name, {
      fkey_vals: fkey_vals,
      fkey_status: fkey_status,
      key_vals: key_vals,
      key_changed_vals: changed_keys
    });

    // For each dependent
    this.relations[start_name].dependents.keys().forEach((class_name) => {
      // 1) Assemble the needed key_vals for this start class and its 
      //    dependents (via foreign keys).
      let [key_vals, fkey_vals, fkey_status] = 
        this.crudGetDependentKeyVals(class_name);
      let dependent_rows_obj = {
        fkey_vals: fkey_vals,
        fkey_status: fkey_status,
        key_vals: key_vals,
        key_changed_vals: {}
      };

      let changed_dep_keys = {};

      Object.entries(this.relations[class_name].dependent_slots)
        .forEach(([slot_name, key_mapping]) => {
          const parent_changes = this.dependent_rows.get(key_mapping.foreign_class)['key_changed_vals'];
          // For all dependents, changes if any come from parent table(s).
          // Parent field names are different though - via relations!
          let parent_slot_name = key_mapping.foreign_slot;
          if (parent_changes.hasOwnProperty(parent_slot_name)) {
            changed_dep_keys[slot_name] = parent_changes[parent_slot_name];
          }
        })
      dependent_rows_obj['key_changed_vals'] = changed_dep_keys;

      //if (changes && slot_name in key_vals) {
      //    changed_key_vals[slot_name] = changes[slot_name].value;
      //}
      /* The skippable situation at any level, true case used only for update
      // situation. As done in getChangeReport() we need to test if key_status 
      // = 0, i.e. no foreign key satisfied. If so we shouldn't be so emptiness of
      // the list of foreign keys target slots ^ changed_slots

      if (skippable && key_status == 0)
        return
      */

      if (fkey_status >0) {
        // Issue: special case: Field / slot table has slots with no class name,
        // as well as class name = one in fkey_vals.  Allow empty key fields - 
        // leave that to validation to catch.
        let rows = this.crudFindAllRowsByKeyVals(class_name, fkey_vals);
        if (rows.length) {

          dependent_rows_obj['count'] = rows.length;   
          dependent_rows_obj['rows'] = rows;
        }
      }

      this.dependent_rows.set(class_name, dependent_rows_obj);

    })

  }

  /**
   * Function to get a class_name's unique and targeted slots and their values. 
   *  1) Get slots that need to be filled to satisfy
   *    - this table's foreign keys
   *    - dependent table foreign keys. (queried for)
   *  2) Get values for those slots from table(s) that class_name depends on,
   *  or from root class user selection, or from query
   * 
   * fkey_status (relative to parents, not dependents): 
   *  0: foreign keys not satisfied 
   *  1: no foreign keys (ergo, satisfied)
   *  2: foreign keys satisfied, 
   * 
   * remaining unique key slots unsatisfied
   *  3: foreign keys satisfied, no other unique key slots.
   *  4: all foreign + other unique key slots satisfied.
   * 
   * @param {String} class_name to return key_vals dictionary for
   * @param {Object} dependent_rows dictionary of dependents to get values from
   * @param {Object} changes in root (holds current vs new slot values)
   * @return {Object} key_vals by slot_name of existing key values
   * @return {Object} changed_key_vals by slot_name of key values that are changing (and need to be updated)
   * @return {Boolean} key_status = integer
   */
  crudGetDependentKeyVals(class_name, changes) { 
    const class_dh = this.dhs[class_name];
    let fkey_vals = {};
    let key_vals = {};
    let fkey_status = 2; // Assume fks satisfied

    if (class_dh) { // FUTURE: avoid this case altogether.

      // Get value for each slot that has a foreign key pointing to another table
      let dependent_slots = this.relations[class_name].dependent_slots;

      if (this.relations[class_name].foreign_key_count == 0) {
        fkey_status = 1;
      }
      else {
        for (let [slot_name, slot_link] of Object.entries(dependent_slots)) {
          let dependent_f_rows = this.dependent_rows.get(slot_link.foreign_class);
          // If foreign table fkey_status == 0 then user shouldn't be seeing
          // any of its records, and so this dependent table should be hidden
          // too.
          if (dependent_f_rows.fkey_status == 0) {
            fkey_status = 0;
            break;
          }

          let foreign_slots = dependent_f_rows.key_vals;
          let foreign_value = foreign_slots[slot_link.foreign_slot];
          if (foreign_value === undefined || foreign_value == '')
            foreign_value = null;
          fkey_vals[slot_name] = foreign_value;
          key_vals[slot_name] = foreign_value;

          if (fkey_vals[slot_name] === null) {
            fkey_status = 0;
          }
        }
      }

      // Here a field/slot is under user control rather than a foreign_key, so
      // get value from table's focused selection.  Merges unique_key_slot & 
      // target_slot list for lookup of values (i.e. no overwrites).
      let search_slots = Object.keys(Object.assign({},
        this.relations[class_name].unique_key_slots,
        this.relations[class_name].target_slots
      ));
      for (let slot_name of search_slots) {
        if (!(slot_name in dependent_slots)) { // FK slot already inherited. 
          // VERIFY IF THIS HANDLES ALL SCENARIOS
          // If there is a user-selected row, this likely is used to get non-foreign key values.
          const class_row = class_dh.hot.getSelected()?.[0]?.[0]; //1st row in selection range.
          key_vals[slot_name] = this.crudGetDHCellValue(class_dh, slot_name, class_row);
        }
      }

    };

    return [key_vals, fkey_vals, fkey_status];
  }

  crudGetDHCellValue(dh, slot_name, row) {
    const col = dh.slot_name_to_column[slot_name];
    return dh.hot.getDataAtCell(row, col);
  }

  /**
   * Used in dh.addRows(). Locate each foreign key and fetch its focused value,
   * and copy into new records below.
   * If missing key value(s) encountered, prompt user to focus appropriate
   * tab(s) row and try again. This requires that every parent be synchronized
   * with its parent, etc.  
   *
   * OUTPUT:
   * @param {Object} required_selections: Dictionary of [slot_name]:[value].
   * @param {String} errors: If user hasn't made a row selection in one of the parent foreign key, this is returned in a report.
   */
  crudGetForeignKeyValues(class_foreign_keys) {
    let required_selections = {};
    let errors = '';
    Object.entries(class_foreign_keys).forEach(([parent_name, parent]) => {
      Object.entries(parent).forEach(([slot_name, foreign_slot_name]) => {
        const value = this.crudGetSelectedTableSlotValue(
          parent_name,
          foreign_slot_name
        );
        if (value == null) {
          const dh = this.dhs[parent_name];
          const parent_title = this.template.current.schema.classes[parent_name].title;
          const foreign_slot_title = dh.slots[dh.slot_name_to_column[foreign_slot_name]].title;
          errors += `\n- ${parent_title}.${foreign_slot_title}: _____`;
        } else {
          required_selections[slot_name] = {
            value: value,
            parent: parent_name,
            slot: foreign_slot_name,
          };
        }
      });
    });
    return [required_selections, errors];
  }

  /**
   * Get value of given class's slot where user has focused on.  If no focus,
   * return null indicating so.
   * @param {string} class_name
   * @param {string} slot_name  
   * @return {String} value of class slot at focused row, or null
   */
  crudGetSelectedTableSlotValue(class_name, slot_name) {
    const dh = this.dhs[class_name];
    // getSelected() returns array with each row being a selection range
    // e.g. [[startRow, startCol, endRow, endCol],...].
    const selected = dh.hot.getSelected();
    if (selected) {
      const row = selected[0][0]; // Get first selection's row.
      const col = dh.slot_name_to_column[slot_name];
      const value = dh.hot.getDataAtCell(row, col);
      if (value && value.length > 0) return value;
    }
    return null; // DH doesn't return null for cell, so this flags no selection.
  }

  /* Looks for 2nd instance of row containing keyVals, returns that row or
   * null if not found.  PROBABLY NOT USEFUL since our work on changing or
   * adding unique_key fields tests for keys BEFORE user change, i.e. just
   * finding one existing key is enough to halt operation.

  crudFindDuplicate(dh, keyVals) {
    let found_row = this.crudFindRowByKeyVals(dh, keyVals);
    // Looking for another record besides parent being deleted.
    if (found_row === false)
      return false;
    return this.crudFindRowByKeyVals(dh, keyVals, found_row + 1);
  }
  */

  /**
   * Search for key_vals combo in given dh handsontable.
   * @param {Object} dh DataHarmonizer instance
   * @param {Object} key_vals a dictionary of slots and their values
   * @return {Array} of rows, if any
   */
  crudFindAllRowsByKeyVals(class_name, key_vals) {
    const dh = this.dhs[class_name];
    let rows = []; 
    let row = this.crudFindRowByKeyVals(dh, key_vals);
    while (row !== false) {
      rows.push(row);
      row = this.crudFindRowByKeyVals(dh, key_vals, row+1);
    }
    return rows;
  }

  /** Looks for row (starting from 0 by default) containing given key_vals.
   * returns null if not found.
   * ISSUE: This isn't using indexes on tables, so not very efficient.
   * @param {Object} dh Dataharmonizer instance
   * @param {Object} keyv_als slot & value combination to search for.
   * @param {Integer} row to start search after.
   * @return {Integer} row that key_vals were found on - OR false if none found.
   */
  crudFindRowByKeyVals(dh, key_vals, row = 0) {
    const total_rows = dh.hot.countSourceRows(); // .countSourceRows();
    while (row < total_rows) {
      if ( // .every() causes return on first break with row 
        Object.entries(key_vals).every(([slot_name, value]) => {
          const col_value = dh.hot.getDataAtCell(row, dh.slot_name_to_column[slot_name]);
          // Allow empty values by HandsonTable?  But adding "col_value === null" triggers infinite loop?
          return value == col_value; //|| (slot_name === 'class_id' && col_value === '')
        })
      ) {
        break;
      }
      row++;
    }
    if (row == total_rows)
      // Nothing found.
      row = false;

    return row;
  }

  // All foreign key fields in a table must be read-only. Their contents are
  // controlled by dependent CRUD create and update actions.
  crudMakeForeignKeysReadOnly(dh, class_name) {
    Object.entries(this.crudGetParents(class_name)).forEach(
      ([parent_name, parent]) => {
        Object.entries(parent).forEach(([slot_name, foreign_name]) => {
            let col = dh.slot_name_to_column[slot_name];
            if (dh.slots[col].required) {
              dh.updateColumnSettings(col, { readOnly: true });
          }
        });
      }
    );
  }

  /** Determine if given dh row has a COMPLETE given unique_key.  This includes
   * a key which might have previously empty slot value(s) that now have changed
   * user-entered value(s).  Also determine if that key is CHANGED as a result
   * of user input.
   * 
   * Called once in dh.beforeChange()
   *
   * @param {Object} dh instance
   * @param {Integer} row
   * @param {String} key_name to examine
   * @param {Object} changes for a row with slot_name as key.
   * @param {Object} dictionary of slots and their new values.
   * @return {Boolean} found boolean true if complete keyVals
   * @return {Object} keyVals set of slots and their values from template or change
   * @return {String} change_log report of changed slot values
   */
  crudHasCompleteUniqueKey(dh, row, key_name, changes) {
    const key_obj = dh.template.unique_keys[key_name];
    let keyVals = {};
    let change_log = '';
    let changed = false;
    let complete = Object.entries(key_obj.unique_key_slots)
      // If every slot has a value, then the whole key is complete.
      .every(([index, slot_name]) => {
        // Key has a changed value (incl. null?), so update it.
        if (slot_name in changes) {
          changed = true; // signals that a change has been made to key.
          let change = changes[slot_name];
          change_log += `* [${slot_name}] change to "${change.value}"\n`;
          keyVals[slot_name] = change.value;
          // If slot is now empty due to change, return false, i.e. incomplete.
          return !!change.value;
        }
        // Not a changed slot.
        let col = dh.slot_name_to_column[slot_name];
        let value = dh.hot.getDataAtCell(row, col);
        keyVals[key_name] = value;
        return !!value;
      });
    return [complete, changed, keyVals, change_log];
  }
}
