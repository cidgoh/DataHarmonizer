import * as $ from 'jquery';
import i18n from 'i18next';

import { DataHarmonizer } from '.';
import { findLocalesForLangcodes } from './utils/i18n';
import {
  Template,
  getTemplatePathInScope,
} from '../lib/utils/templates';
import { wait } from '../lib/utils/general';
import { invert, removeNumericKeys, consolidate } from '../lib/utils/objects';
import { createDataHarmonizerContainer, createDataHarmonizerTab } from '../web';
import { getExportFormats } from 'schemas';

// COMMENTED OUT: WIP FEATURE
import { makeColumnReadOnly, buildAppContext, setup1M } from '../lib/utils/1m';

/**
 * Finds the shared keys per class in a given schema.
 * @param {Object} schema - The schema object with structure containing "classes" and "slot_usage".
 * @returns {Object} An object mapping class names to an array of shared keys.

function findSharedKeys(schema) {
  const class_names = new Set(
    Object.keys(schema.classes).filter(
      (k) => k !== 'dh_interface' && k !== 'Container'
    )
  );
  let shared_keys_per_class = {};
  class_names.forEach((key) => {
    shared_keys_per_class[key] = []; // initialize the array to avoid checking existence later

    // Filtering and mapping slots
    const class_data = schema.classes[key];
    const slots = class_data.attributes;
    const shared_keys = Object.values(slots).map((slot_usage) => {
      return {
        name: slot_usage.name,
        related_concept: slot_usage.range,
        relation: ['dh_interface', 'Container'].includes(key)
          ? 'child'
          : class_names.has(slot_usage.range)
          ? 'parent'
          : 'range',
      };
    });

    shared_keys_per_class[key] = shared_keys; // assign mapped values

    // Ensure there are no duplicates; if duplicates are meaningful, this will need adjustment
    shared_keys.forEach((slot) => {
      shared_keys_per_class[slot.related_class] =
        shared_keys_per_class[slot.related_class] || []; // ensure array exists

      if (
        !shared_keys_per_class[slot.related_class].find(
          (s) => s.name === slot.name
        )
      ) {
        shared_keys_per_class[slot.related_class].push(slot);
      }
    });

    shared_keys_per_class[key] = shared_keys.filter(
      (obj) => obj.related_concept && ['parent', 'child'].includes(obj.relation)
    );
  });

  delete shared_keys_per_class[undefined];

  return shared_keys_per_class;
}

function createFlatSchemaTree(classNames) {
  return {
    Container: {
      tree_root: true,
      children: [...classNames],
    },
    ...classNames.reduce((acc, key) => {
      acc[key] = {
        name: key,
        children: [],
        shared_keys: [],
      };
      return acc;
    }, {}),
  };
}

function createPreSchemaTree(classNames, sharedKeysPerClass) {
  const treeBase = {
    Container: { tree_root: true, children: classNames },
  };

  return classNames.reduce((acc, classKey) => {
    const sharedKeys = sharedKeysPerClass[classKey] || [];
    acc[classKey] = {
      name: classKey,
      shared_keys: sharedKeys,
      children: sharedKeys
        .map((item) => item.range)
        .filter((range) => range !== classKey && typeof range !== 'undefined'),
    };
    return acc;
  }, treeBase);
}

function updateWithChildrenAndSharedKeys(data) {
  // Use a deep clone to avoid mutating the original object
  const result = JSON.parse(JSON.stringify(data));

  Object.keys(result).forEach((key) => {
    const elem = result[key];
    (elem.shared_keys || []).forEach((sk) => {
      if (sk.relation === 'parent' && result[sk.related_concept]) {
        const parent = result[sk.related_concept];

        // Ensure 'children' array exists
        if (!parent.children) {
          parent.children = [];
        }

        // Add key to parent’s 'children' array if not already present
        if (!parent.children.includes(key)) {
          parent.children.push(key);
        }

        // Ensure 'shared_keys' array exists
        if (!parent.shared_keys) {
          parent.shared_keys = [];
        }

        // Check if reciprocal shared key already exists
        const reciprocalExists = parent.shared_keys.some(
          (rsk) => rsk.name === sk.name && rsk.related_concept === key
        );

        // Add reciprocal shared key if it doesn't exist
        if (!reciprocalExists) {
          parent.shared_keys.push({
            name: sk.name,
            related_concept: key,
            relation: 'child',
          });
        }
      }
    });
  });

  return result;
}
 */
/**
 * Builds a schema tree from the given schema.
 * @param {Object} schema - The schema object containing "classes".
 * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.


function buildSchemaTree(schema) {

  const classNames = Object.keys(schema.classes).filter(
    (key) => !(key == 'dh_interface' || key == 'Container')
  );

  if (!('Container' in schema.classes)) {
    // FIX THIS to pay attention to class foreign keys
    return createFlatSchemaTree(classNames);
  }

  const sharedKeysPerClass = findSharedKeys(schema);
  const preSchemaTree = createPreSchemaTree(classNames, sharedKeysPerClass);

  return updateWithChildrenAndSharedKeys(preSchemaTree);
}
 */

class AppConfig {
  constructor(template_path = null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}
export default class AppContext {
  schema_tree = {};
  dhs = {};
  current_data_harmonizer_name = null;
  currentSelection = null;
  template = null;
  export_formats = {};
  oneToManyAppContext = null;

  constructor(appConfig = new AppConfig(getTemplatePathInScope())) {
    this.appConfig = appConfig;
    this.bindEventListeners();
  }

  // Method to bind event listeners
  bindEventListeners() {
    $(document).on('dhTabChange', (event, data) => {
      console.info(
        'dhTabChange',
        this.getCurrentDataHarmonizer().class_assignment,
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

  async reload(
    template_path,
    overrides = { locale: null, forced_schema: null }
  ) {
    const isSameTemplatePath = template_path === this.appConfig.template_path;
    const isUploadedTemplate = template_path.startsWith('local');
    const isLocaleChange = overrides.locale !== null;

    // Handle local template refresh case
    if (isSameTemplatePath && isUploadedTemplate) {
      return this.setupDataHarmonizers({dataharmonizers: this.dhs, forced_schema: this.template?.default?.schema});
    }

    // Handle changes in schema template path or locale
    if (!isSameTemplatePath || isLocaleChange) {
      this.appConfig = new AppConfig(template_path);
      return await this.setupDataHarmonizers({locale: overrides.locale});
    }

    // Handle same template path without uploaded template
    if (isSameTemplatePath) {
      return this.setupDataHarmonizers({dataharmonizers: this.dhs});
    }

    // Handle forced schema case
    if (overrides.forced_schema !== null) {
      this.appConfig = new AppConfig(template_path);
      return this.setupDataHarmonizers({forced_schema: overrides.forced_schema});
    }

    // Default case: if no significant changes detected
    return this;
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

  /**
   * Creates Data Harmonizers from the schema tree.
   * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
   * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
   */
  makeDHsFromSchemaTree(schema, template_name) {
    let data_harmonizers = {};

    Object.entries(schema.classes)
      // Container class is only used in input and output file coordination.
      .filter(([class_name]) => this.isAncestor([class_name], template_name))
      .forEach((obj, index) => {
        if (obj.length > 0) {
          const [class_name, tree_obj] = obj;

          // if it shares a key with another class which is its parent, this DH must be a child
          const is_child = this.relations?.[class_name]?.parent;

          // Doesn't build if tab id already exists.
          const dhId = `data-harmonizer-grid-${index}`;
          if (!document.getElementById(dhId)) {
            const dhSubroot = createDataHarmonizerContainer(dhId, index === 0);

            const dhTab = createDataHarmonizerTab(dhId, class_name, index === 0);
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
            const dh = new DataHarmonizer(dhSubroot, this, {
              loadingScreenRoot: document.body,
              class_assignment: class_name,
              schema: schema, // assign during constructor so validator can init on it.
              hot_override_settings: {
                minRows: is_child ? 0 : 10,
                minSpareRows: 0,
                height: is_child ? '40vh' : '75vh',
                // TODO: Workaround, possibly due to too small section column on child tables
                // colWidths: is_child ? 256 : undefined, 
                colWidths: 200,
              },
            });

            data_harmonizers[class_name] = dh;
            dh.useTemplate(class_name);
            dh.validator.useTargetClass(class_name);

            if (is_child) {
              /* Initialization of each child table is to hide all rows until
               * parent primary key record is selected as a foreign key index.
               * Note: user cut and paste of records doesn't change read-only
               * fields.
              **/
              dh.filterAll();
              // All foreign key fields must be read-only. Their contents are
              // controlled by dependent create and update actions. 
              Object.entries(this.relations?.[class_name]?.parent)
              .forEach(([parent_name, parent]) => {
                Object.entries(parent)
                .forEach(([slot_name, foreign_name]) => {
                  makeColumnReadOnly(dh, slot_name);
                });
              });
              /* WRT rows with keys pointing to foreign keys, a user:
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

            }
            // Top level class, so make it active.  There should only be one
            else { 
              this.setCurrentDataHarmonizer(class_name);
            }
          }
        }
      });
    delete data_harmonizers[undefined]; // How does this occur?
    return data_harmonizers;
  }

  // Determine if parent relationships link class_name to given ancestor
  isAncestor(class_names, ancestor_name) {
    let subject_name = class_names.shift();
    if (!subject_name)
      return false;
    if (subject_name == ancestor_name)
      return true;
    if (this.relations[subject_name]?.parent) {
      if (this.relations[subject_name].parent[ancestor_name])
        return true;
      // Ancestor wasn't one of parents, so try search on all ancestors.
      //console.log(this.relations[subject_name].parent, Object.values(this.relations[subject_name].parent))
      class_names.push(Object.values(this.relations[subject_name].parent));
    }
    return this.isAncestor(class_names, ancestor_name)
  }

  /*
  Return initialized, rendered dataHarmonizer instances rendered in order.
  If a template name is provided, only include that one in its schema, and any underlings.
  */

    // attributes are the classes which feature 1-M relationshisps
    // to process these classes into DataHarmonizer tables, the following must be performed:
    // - Navigation: one tab per class = one data harmonizer per class
    // - Tables: filter the table by the slots featured in that class-slot pair alone/relative to a sheet.
    // - Propagation: there will be an event handler added between Data Harmonizers based on a shared domain.
    // - Loading: the system will expect an excel file with sheets or a database with tables for selection. the Toolbar must know.
    // the existence of a container class signifies a 1-M data loading setup with an ID join
    /* e.g.
 
 Each class has one or more slots (attributes) which contain foreign_keys which 
 determine parent-child relationships.


    */
  async setupDataHarmonizers({
    data_harmonizers = {},
    locale = null,
    forced_schema = null
  }) {
    
    this.clearInterface();

    const [schema_path, template_name] = this.appConfig.template_path.split('/');

    this.template = await Template.create(schema_path, {forced_schema});

    // Empty case will occur when template_path doesn't correspond to a built template
    this.export_formats = forced_schema ? {} : await getExportFormats(schema_path);

    if (locale !== null) {
      this.template.updateLocale(locale);
    }

    const schema =
      locale !== null
        ? this.template.localized.schema
        : this.template.default.schema;

    this.relations = this.getRelations(schema);

    //this.schema_tree = buildSchemaTree(schema);
    //console.log("SCHEMA TREE", this.schema_tree)

    // Merges any existing dataharmonizer instances with the ones newly created.
    this.dhs = {
      ...data_harmonizers,
      ...this.makeDHsFromSchemaTree(schema, template_name),
    };

    /*
    if (!!this.oneToManyAppContext) {
       this.oneToManyAppContext.destroy();
    }
    */
    // COMMENTED OUT: WIP 1M buildAppContext / setup1M
    //const appContext = buildAppContext(schema);
    //this.oneToManyAppContext = setup1M(appContext, dhs);  // returns an event manager

    return this;

  }
  /* Establish an easy bidirectional lookup between schema classes that have
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
      parent: {
        [foreign_class]: {
          [slot_name]: [foreign_slot_name],
          [slot_name_2]: [foreign_slot_name_2]...
        }
      },
      child: {
        [foreign_class]: {
          [slot_name]: [foreign_slot_name],
          [slot_name_2]: [foreign_slot_name_2]...
        }
      }
    }

  */
  getRelations(schema) {
    let relations = {};
    Object.entries(schema.classes).forEach(([class_name, class_obj]) => {
      Object.entries(class_obj.attributes ?? {}).forEach(([slot_name, attribute]) => {
        if (attribute.annotations?.foreign_key?.value) {

          let foreign_class, foreign_slot_name;
          let key = attribute.annotations.foreign_key.value;
          // Best syntax is that foreign class is dot prefix:
          if (key.includes('.'))
            [foreign_class, foreign_slot_name] = key.split('.',2);
          // UNTESTED: Workaround is that foreign class is in range of slot:
          else if (attribute.range in schema.classes) {
            foreign_slot_name = key;
            foreign_class = attribute.range;
          }
          else {
            console.log("Class", class_name, "has slot", slot_name, "foreign key", attribute.annotations?.foreign_key?.value, "but no target class information in key or slot range.");
            return;
          }
          Object.assign(relations, {[class_name]: {parent: {[foreign_class]: {[slot_name]: foreign_slot_name}}}});
          //And reverse relation
          Object.assign(relations, {[foreign_class]: {child: {[class_name]: {[foreign_slot_name]: slot_name}}}});
        }
      });
    });
    return relations;
  }
}
