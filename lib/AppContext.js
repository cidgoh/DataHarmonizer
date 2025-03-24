import * as $ from 'jquery';
import i18n from 'i18next';

import { DataHarmonizer } from '.';
import { findLocalesForLangcodes } from './utils/i18n';
import { Template, getTemplatePathInScope } from '../lib/utils/templates';

import { wait, isEmpty, pascalToLowerWithSpaces } from '../lib/utils/general';
import { invert, removeNumericKeys, consolidate } from '../lib/utils/objects';
import { createDataHarmonizerContainer, createDataHarmonizerTab } from '../web';
import { getExportFormats } from 'schemas';
import { range as arrayRange } from 'lodash';
import { deepMerge } from '../lib/utils/objects';
import Validator from './Validator';

class AppConfig {
  constructor(template_path = null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}
export default class AppContext {
  //schema_tree = {};
  dhs = {};
  current_data_harmonizer_name = null;
  currentSelection = null;
  template = null;
  export_formats = {};
  oneToManyAppContext = null;
  field_settings = {};

  constructor(appConfig = new AppConfig(getTemplatePathInScope())) {
    this.appConfig = appConfig;
    this.bindEventListeners();
  }

  // Method to bind event listeners
  bindEventListeners() {
    $(document).on('dhTabChange', (event, data) => {
      console.info(
        'dhTabChange',
        this.getCurrentDataHarmonizer().template_name,
        '->',
        data.specName
      );
      const { specName } = data;
      this.setCurrentDataHarmonizer(specName);
      // Should trigger Toolbar to refresh sections
      $(document).trigger('dhCurrentChange', {
        dh: this.getCurrentDataHarmonizer(),
      });
    });

    $(document).on('dhCurrentSelectionChange', (event, data) => {
      const { currentSelection } = data;
      this.currentSelection = currentSelection;
    });
  }

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

    this.dhs = this.makeDHsFromRelations(schema, template_name);

    return this;
  }

  /**
   * Creates Data Harmonizers from the schema tree.
   * FUTURE: Make this a 2 pass thing.  First pass creates every dataharmonizer
   * data structure; 2nd pass initializes handsontable part.
   * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
   * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
   */
  makeDHsFromRelations(schema, template_name) {
    let data_harmonizers = {};

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

          // If it shares a key with another class which is its parent, this DH must be a child
          const is_child = !(class_name == template_name); // && isEmpty(this.crudGetParents(class_name)) && !();
          const dhId = `data-harmonizer-grid-${index}`;
          const tab_label = class_obj.title ? class_obj.title : class_name;
          const dhTab = createDataHarmonizerTab(dhId, tab_label, index === 0);
          dhTab.addEventListener('click', () => {
            $(document).trigger('dhTabChange', {
              specName: class_name,
            });
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
              height: is_child ? '50vh' : '75vh',
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

          /*        FUTURE: separate dh from all .context schema/template data/functions

          const dh = {
            template: schema.classes[class_name]
          }

          // Set up the data structure (.template,.slots,.slot_names etc 
          // based on LinkML class
          this.useTemplate(dh, class_name); 

          // Each selected DataHarmonizer is rendered here. 
          // NOTE: this may be running twice?.
          // in 1-M, different DataHarmonizers have fewer rows to start with
          // Child tables are displayed differently so override the default
          // HoT settings.
          const dhSubroot = createDataHarmonizerContainer(dhId, index === 0);
          const handsOnDH = new DataHarmonizer(dhSubroot, dh, {
            loadingScreenRoot: document.body,
            template_name: class_name,
            schema: schema, // assign during constructor so validator can init on it.
            hot_override_settings: {
              minRows: is_child ? 0 : 10,
              minSpareRows: 0,
              height: is_child ? '50vh' : '75vh',
              // TODO: Workaround, possibly due to too small section column on child tables
              // colWidths: is_child ? 256 : undefined, 
              colWidths: 200,
            },
          });

          //Object.assign(dh, handsOnDH);
          handsOnDH['template'] = schema.classes[class_name];
          handsOnDH.validator.useTargetClass(class_name);
          data_harmonizers[class_name] = handsOnDH;
          handsOnDH.createHot();
*/

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
    // let self = this;

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
      let field = deepMerge(
        attributes[name],
        this.template.current.schema.slots[name]
      );

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
        const section = this.template.current.schema['slots'][section_title];
        if (section) {
          Object.assign(section_parts, section);
        }

        dh.sections.push(section_parts);
      }

      let section = dh.sections[sectionIndex.get(section_title)];
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
            item.range in this.template.default.schema.enums ||
            item.range in this.template.default.schema.types ||
            pascalToLowerWithSpaces(item.range) in
              this.template.default.schema.enums ||
            pascalToLowerWithSpaces(item.range) in
              this.template.default.schema.types
            // || Object.keys(this.template.current.schema.enums).some(k => k.indexOf('geo_loc_name') !== '-1') ||
            // Object.keys(this.template.current.schema.types).some(k => k.indexOf('geo_loc_name') !== '-1')
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
        const types = this.template.default.schema.types;
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
            case 'WhitespaceMinimizedString':
              new_field.datatype = 'xsd:token';
              break;
            case 'string':
              new_field.datatype = 'string';
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
          const enums = this.template.current.schema.enums;
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
            if (range in this.template.current.schema.classes) {
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

      if (field.annotations) {
        new_field.annotations = field.annotations;
      }

      section.children.push(new_field);
    } // End slot processing loop

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
    // Replaces dh.getColumnIndexByFieldName() unless loose name/title match needed
    // Note of course that duplicate names yield farthest name index.
    dh.slot_name_to_column = {};
    Object.entries(dh.slots).forEach(
      ([index, slot]) => (dh.slot_name_to_column[slot.name] = parseInt(index))
    );
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
                console.log(
                  'Class',
                  class_name,
                  'has slot',
                  slot_name,
                  'foreign key',
                  attribute.annotations?.foreign_key?.value,
                  'but no target class information in key or slot range.'
                );
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
              relations[foreign_class].child[class_name] ??= {}
              relations[foreign_class].child[class_name][foreign_slot_name] = slot_name;

              // And list of local slots that connect to targets of dependent slot foreign keys.
              // Another table's target slot_name is this table's slot.
              // Note: more than one foreign key can point to target slot. 
              relations[foreign_class].target_slots[foreign_slot_name] ??= {}
              relations[foreign_class].target_slots[foreign_slot_name][class_name] = slot_name;
            }
          }
        );

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
      if (next_name == '') next_name = dependent_name;
      stack.set(dependent_name, true);
    }
    return this.crudGetDependents(next_name, ptr + 1, stack);
  }

  /* For given class, refresh view of all dependent tables that have a direct
   * or indirect foreign key relationship to given class.
   * Performance might show up as an issue later if lots of long dependent
   * tables to re-render.
   */
  crudFilterDependentViews(class_name) {

    let dependent_rows = this.crudGetDependentRows(class_name);

    for (let [dependent_name, dependent_report] of dependent_rows) {
      if (dependent_name != class_name) {
        this.crudFilterDependentRows(dependent_name, dependent_report);
      }
    }
  }

  /* For given class name (template), show only rows that conform to that
   * class's foreign key-value constraints.
   * (Could make a touch more efficient by skipping if we can tell that a
   * given table's foreign key values haven't changed.)
   * POSSIBLE ISSUE: if given class table has one parent table where no
   * primary key selection has been made!
   */
  crudFilterDependentRows(class_name, dependent_report) {
    const hotInstance = this.dhs[class_name]?.hot;
    // This can happen when one DH is rendered but not other dependents yet.
    if (!hotInstance) return;

    let class_tab = '#tab-data-harmonizer-grid-' + Object.keys(this.dhs).indexOf(class_name);

    if (!dependent_report.incomplete) {
      $(class_tab).removeClass('disabled');
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
      hotInstance.render(); // Render the table to apply changes
    }
    // Hide tab if foreign key that it is based on is incomplete. 
    else {
      // Here an error was triggered by unsatisfied foreign key slot.
      $(class_tab).addClass('disabled')
    }
  }

  /**
   * Addresses the need to fetch foreign keys for new rows being added to
   * a class table.  Locate each foreign key and fetch its focused value, and 
   * copy into new records below.
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
          errors += `\n- ${parent_name}.${foreign_slot_name}: _____`;
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
   *
   * Note: this report is done regardless of visibility of rows/columns to user.
   *
   * INPUT
   * @root_name {String} name of root table to begin looking for cascading effect of foreign key changes. 1st user-selected row is used for all primary key and target class filtering.
   * 
   * Builds a list of dependents that have root-related records
    *  dependent_rows: {
      [dependent_name]: {
        slots: {} // just like root_name, these are values of all slots that other tables depend on.
        [parent]: {
          slots: {[slot_name]: value, ... },
          changed_slots: {[slot_name]: value, ... },
          count: [# records in dependent matching this combo],
          rows: [row # of affected row, ...]
      }
    }
   */
  crudGetDependentRows(root_name, changes = {}) {
    let dependent_rows = new Map();
    // Starts off dependent_rows with key_vals mapping of user's selected row.
    let [key_vals, changed_key_vals, incomplete] = this.crudGetDependentKeyVals(root_name, dependent_rows, changes, true);
    dependent_rows.set(root_name, {
      slots: key_vals,
      changed_slots: changed_key_vals,
      rows: [this.dhs[root_name]?.hot.getSelected()?.[0]?.[0]],
      incomplete: incomplete,
      count: 1
    });
    // The delete or update in root table is row specific and happens in calling routine
    // via user confirmation.

    // For each DEPENDENT
    for (const [dependent_name, dependent_obj] of this.relations[root_name].dependents) {
      // 1) Assemble the needed key_vals for this dependent (of all other dependents that point to this via foreign key).
      let [dependent_key_vals, changed_key_vals, incomplete] = this.crudGetDependentKeyVals(dependent_name, dependent_rows, changes);
      //console.log("crudGetDependentRows checking", dependent_name, dependent_key_vals)
      if (!isEmpty(dependent_key_vals)) {
        const dependent_dh = this.dhs[dependent_name];

        let dependent_rows_obj = {
          slots: dependent_key_vals,
          incomplete: incomplete
        };

        /*
         * 2) Query given dependent to see # of rows of dependent retrieved.  
         * 3) Add rowcount to dependent_rows.
         *
         * Issue: child table row may not be joined on root-related slot to parent.
         * Child queries parent for total # rows matched to 
         */
        let rows = this.crudFindAllRowsByKeyVals(dependent_dh, dependent_key_vals);
        if (rows.length) {
          dependent_rows_obj['changed_slots'] = changed_key_vals;
          dependent_rows_obj['count'] = rows.length;   
          dependent_rows_obj['rows'] = rows;
        }
        dependent_rows.set(dependent_name, dependent_rows_obj);
      }

    }
    return dependent_rows;
  }

  /**
   * Function to get a class_name's unique and targeted slots and their values. 
   *  1) Get slots that need to be filled to satisfy
   *    - this table's foreign keys
   *    - dependent table foreign keys. (queried for)
   *  2) Get values for those slots from table(s) that class_name depends on,
   *  or from root class user selection, or from query
   * @param {String} class_name to return key_vals dictionary for
   * @param {Object} dependent_rows dictionary of dependents to get values from
   * @param {Object} changes in root (holds current vs new slot values)
   * @param {Boolean} is_root true if class_name is root of search. (first class in dependent_rows)
   * @return {Object} key_vals by slot_name of existing key values
   * @return {Object} changed_key_vals by slot_name of key values that are changing (and need to be updated)
   * @return {Boolean} incomplete if a given dependent has an incomplete primary key.
   */
  crudGetDependentKeyVals(class_name, dependent_rows, changes, is_root = false) { 
    const class_dh = this.dhs[class_name];
    let incomplete = false;
    let key_vals = {};
    let changed_key_vals = {};

    if (class_dh) {
      let search_slots = Object.keys(Object.assign(
        this.relations[class_name].unique_key_slots, 
        this.relations[class_name].target_slots
      ));
      let variable_slots = {}; // Key slots which are not inherited.
      // 1) Slots to be filled are class_name's unique keys, or are targets 
      //    of other table's foreign keys. 
      // error = true if any unique key slot is missing
      for (let slot_name of search_slots) {
        // 2) Find value for slot.
        if (is_root) { 
          // Root values come straight from user selected row.  
          // FUTURE: Try having root be = (table in dependent map and its parents
          // are not in dependent map)?
          const class_row = class_dh.hot.getSelected()?.[0]?.[0];
          const col = class_dh.slot_name_to_column[slot_name];
          key_vals[slot_name] = class_dh.hot.getDataAtCell(class_row, col);
          if (slot_name in changes)
            changed_key_vals[slot_name] = changes[slot_name].value;
        }
        else {
          // Slot value comes from table this class slot depends on.
          if (this.relations[class_name].dependent_slots?.[slot_name]) {
            let slot_link = this.relations[class_name].dependent_slots[slot_name];
            let foreign_class_keys = dependent_rows.get(slot_link.foreign_class)?.slots;
            //console.log("HERE", class_name, slot_name, foreign_class_keys, dependent_rows)
            if (foreign_class_keys)
              key_vals[slot_name] = foreign_class_keys[slot_link.foreign_slot];
              // Now inherit changed_slots values
              let changed_keys = dependent_rows.get(slot_link.foreign_class)?.changed_slots;
              if (changed_keys)
                changed_key_vals[slot_name] = changed_keys[slot_link.foreign_slot];
            else {
              console.log("crudGetDependentKeyVals: No ", class_name, "slot",slot_name,"value in",slot_link);
            }
          }
          else {
            variable_slots[slot_name] = true;
            //alert(class_name + ":" + slot_name)
            // Slot value IS NOT INHERITED from any other class table.
            // The set of possible values (& related row count) this slot can take
            // on depends on the existing data table for this class.  Requires 
            // a combinatorial query results of querying for the established
            // foreign key constraint in key_vals, and turning results into a set. 

          }
        }

        if (slot_name in this.relations[class_name].dependent_slots) {
          if (!slot_name in key_vals || key_vals[slot_name] == null) {
            incomplete = true;
            console.log("dependent slot", class_name, slot_name, key_vals[slot_name])
          }
          // also consider case where parent table needs to have focus in order for child table to 
        }
      };
      if (!isEmpty(variable_slots)) {
        // Need to run query here to return key_vals 
        console.log("At crudGetDependentKeyVals, should run query for", class_name, variable_slots, incomplete)
      }
    }
    return [key_vals, changed_key_vals, incomplete];
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
  crudFindAllRowsByKeyVals(dh, key_vals) {
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
          const col = dh.slot_name_to_column[slot_name];
          return value == dh.hot.getDataAtCell(row, col);
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
          dh.updateColumnSettings(col, { readOnly: true });
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
   * @param {String} textual report of any slots which were changed.
   *
   * @return    {Boolean} found boolean true if complete keyVals
   * @return    {Object} keyVals set of slots and their values from template or change
   * @return    {String} change_log report of changed slot values
   */
  crudHasCompleteUniqueKey(dh, row, key_name, changes, keyVals = {}, change_log = '') {
    const key_obj = dh.template.unique_keys[key_name];
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
