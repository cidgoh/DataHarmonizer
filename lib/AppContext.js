import * as $ from 'jquery';
import i18n from 'i18next';

import { DataHarmonizer } from '@/lib';
import { findLocalesForLangcodes } from '@/lib/utils/i18n';
import {
  Template,
  findSlotNamesForClass,
  getTemplatePathInScope,
} from '@/lib/utils/templates';
import { wait } from '@/lib/utils/general';
import { invert, removeNumericKeys, consolidate } from '@/lib/utils/objects';
import { createDataHarmonizerContainer, createDataHarmonizerTab } from '@/web';

// COMMENTED OUT: WIP FEATURE
// import { buildAppContext, setup1M } from '@/lib/utils/1m';

/**
 * Finds the shared keys per class in a given schema.
 * @param {Object} schema - The schema object with structure containing "classes" and "slot_usage".
 * @returns {Object} An object mapping class names to an array of shared keys.
 */
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

/**
 * Builds a schema tree from the given schema.
 * @param {Object} schema - The schema object containing "classes".
 * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.
 */
function buildSchemaTree(schema) {
  const isContainerMissing = typeof schema.classes['Container'] === 'undefined';

  const classNames = Object.keys(schema.classes).filter(
    (key) => key !== 'dh_interface' && key !== 'Container'
  );

  if (isContainerMissing) {
    return createFlatSchemaTree(classNames);
  }

  const sharedKeysPerClass = findSharedKeys(schema);
  const preSchemaTree = createPreSchemaTree(classNames, sharedKeysPerClass);

  return updateWithChildrenAndSharedKeys(preSchemaTree);
}

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
  exportFormats = {};
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
    const currentTemplatePath = this.appConfig.template_path;
    const isSameTemplatePath = template_path === currentTemplatePath;
    const isUploadedTemplate = template_path.startsWith('local');
    const isForcedSchemaProvided = overrides.forced_schema !== null;
    const isLocaleChange = overrides.locale !== null;

    const clearAndSetup = async (
      data_harmonizers = {},
      forced_schema = null
    ) => {
      this.clearInterface();
      return this.setupDataHarmonizers({
        data_harmonizers,
        locale: overrides.locale,
        forced_schema,
      });
    };

    // Handle local template refresh case
    if (isSameTemplatePath && isUploadedTemplate) {
      return clearAndSetup(this.dhs, this.template?.default?.schema);
    }

    // Handle same template path without uploaded template
    if (isSameTemplatePath) {
      return clearAndSetup();
    }

    // Handle forced schema case
    if (isForcedSchemaProvided) {
      this.appConfig = new AppConfig(template_path);
      return clearAndSetup({}, overrides.forced_schema);
    }

    // Handle changes in template path or locale
    if (!isSameTemplatePath || isLocaleChange) {
      this.appConfig = new AppConfig(template_path);
      return clearAndSetup();
    }

    // Default case: if no significant changes detected
    return this;
  }

  async initializeTemplate(template_path, options = {}) {
    const [template_name] = template_path.split('/');
    this.template = await Template.create(template_name, options);
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

  setSchemaTree(schema_tree) {
    this.schema_tree = schema_tree;
  }

  setDataHarmonizers(data_harmonizers) {
    this.dhs = data_harmonizers;
    // NOTE: non-deterministic, assumes that the insertion order is the right order
    this.setCurrentDataHarmonizer(Object.keys(this.dhs)[0]);
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

  // NOTE: this code is used primarily to setup the resources for
  // translateObject, translateValue and translateMultivalued in translateData
  // when loading data from a file. as such it is being scoped down to manage enum translations.
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
  
    // Helper function to process permissible values into a translation map
    const getEnumResource = (enumObject) => {
      return consolidate(enumObject, (acc, [enumKey, enumObj]) => {
        const { permissible_values } = enumObj || {}; 
        if (permissible_values) {
          Object.entries(permissible_values).forEach(([enumKey, enumData]) => {
            const { title, text } = enumData;
            const key = text; // Enum keys are the 'text'
            const value = title || text; // Use title if available, fallback to text
            acc[key] = value;            // Forward translation (text -> title)
            acc[value] = key;            // Reverse translation (title -> text)
          });
        }
        return acc;
      });
    };
  
    // Build translation maps for each language
    const translationsByLanguage = {};
  
    Object.entries(template.translations).forEach(([langcode, translation]) => {
      const currentLang = langcode.split('-')[0]; // Use primary language code
  
      // Compute the enum resource for this language
      const enumResource = getEnumResource(translation.schema.enums);
  
      // Store the translations for this language
      translationsByLanguage[currentLang] = {
        ...enumResource,
      };
  
      console.info("Computed translation resources for:", currentLang, enumResource);
    });
  
    // Generate translation maps between all possible language combinations
    const languageCodes = Object.keys(translationsByLanguage);
  
    // Loop over each source-destination language pair
    languageCodes.forEach((sourceLang) => {
      languageCodes.forEach((targetLang) => {
        if (sourceLang === targetLang) return; // Skip identical language pairs
  
        const sourceTranslation = translationsByLanguage[sourceLang];
        const targetTranslation = translationsByLanguage[targetLang];
  
        // Add resources for the current source-target language pair
        const translationNamespace = `${sourceLang}_to_${targetLang}`;
        i18n.addResources(sourceLang, translationNamespace, sourceTranslation);
  
        // Add reverse mapping for this pair (target -> source)
        const reverseTranslationMap = invert(sourceTranslation);
        const reverseNamespace = `${targetLang}_to_${sourceLang}`;
        i18n.addResources(targetLang, reverseNamespace, reverseTranslationMap);
  
        console.info(`Added translation resources from ${sourceLang} to ${targetLang}:`, translationNamespace);
        console.info(`Added reverse translation resources from ${targetLang} to ${sourceLang}:`, reverseNamespace);
      });
    });
  }

  async loadExportFormats(schema) {
    this.exportFormats = (
      await import(`@/web/templates/${schema}/export.js`)
    ).default;
    return this.exportFormats;
  }

  getExportFormats() {
    return this.exportFormats;
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
  makeDataHarmonizersFromSchemaTree(
    schema,
    schema_tree,
    schema_name,
    export_formats
  ) {
    let data_harmonizers = {};
    Object.entries(schema_tree)
      .filter(([cls_key]) => cls_key !== 'Container')
      .forEach((obj, index) => {
        if (obj.length > 0) {
          const [cls_key, spec] = obj;

          // if it shares a key with another class which is its parent, this DH must be a child
          const is_child = spec.shared_keys.some(
            (shared_key_spec) => shared_key_spec.relation === 'parent'
          );

          const dhId = `data-harmonizer-grid-${index}`;
          if (!document.getElementById(dhId)) {
            const dhSubroot = createDataHarmonizerContainer(dhId, index === 0);

            const dhTab = createDataHarmonizerTab(dhId, spec.name, index === 0);
            dhTab.addEventListener('click', () => {
              $(document).trigger('dhTabChange', {
                specName: spec.name,
              });
            });

            // Different classes have different slots allocated to them. field_filters narrows to those slots.
            // idempotent: running this over the same initialization twice is expensive but shouldn't lose state
            // in 1-M, different DataHarmonizers have fewer rows to start with and visible if a child. Override the default HoT settings.
            data_harmonizers[spec.name] = new DataHarmonizer(dhSubroot, this, {
              loadingScreenRoot: document.body,
              class_assignment: cls_key,
              field_filters: findSlotNamesForClass(schema, cls_key),
              hot_override_settings: {
                minRows: is_child ? 0 : 100,
                minSpareRows: is_child ? 0 : 100,
                // colWidths: is_child ? 256 : undefined, // TODO: Workaround, possibly due to too small section column on child tables
                colWidths: 256,
              },
            });
            data_harmonizers[spec.name].useSchema(
              schema,
              export_formats,
              schema_name
            );

            // hide the single row if child
            if (is_child) {
              data_harmonizers[spec.name].filterAll();
            }
          }
        }
      });
    delete data_harmonizers[undefined];
    return data_harmonizers; // Return the created data harmonizers if needed
  }

  async setupDataHarmonizers({
    data_harmonizers = {},
    locale = null,
    forced_schema = null,
  }) {
    // attributes are the classes which feature 1-M relationshisps
    // to process these classes into DataHarmonizer tables, the following must be performed:
    // - Navigation: one tab per class = one data harmonizer per class
    // - Tables: filter the table by the slots featured in that class-slot pair alone/relative to a sheet.
    // - Propagation: there will be an event handler added between Data Harmonizers based on a shared domain.
    // - Loading: the system will expect an excel file with sheets or a database with tables for selection. the Toolbar must know.
    // the existence of a container class signifies a 1-M data loading setup with an ID join
    /* e.g.
 
    const container = {
      "Container": {
        "name": "Container",
        "from_schema": "https://example.com/GRDI",
        "attributes": {
          "GRDISamples": {
            "name": "GRDISamples",
            "from_schema": "https://example.com/GRDI",
            "multivalued": true,
            "alias": "GRDI_samples",
            "owner": "Container",
            "domain_of": [
              "Container"
            ],
            "range": "GRDISample",
            "inlined_as_list": true
          },
          "AMRTests": {
            "name": "AMRTests",
            "from_schema": "https://example.com/GRDI",
            "multivalued": true,
            "alias": "AMR_Tests",
            "owner": "Container",
            "domain_of": [
              "Container"initializeTemplate
            ],
            "range": "AMRTest",
            "inlined_as_list": true
          }
        },
        "tree_root": true
      }
    }
 
    const schema_tree = {
      "Container": { tree_root: true, children: ["AMRTest", "GRDISample"] }
      "GRDISample": { shared_key: ["sample_collector_sample_ID"], children: ["AMRTest"] }
      "AMRTest": { shared_key: ["sample_collector_sample_ID"], children: [] },
    }
 
    */

    // this.clearContext();
    return this.initializeTemplate(this.appConfig.template_path, {
      forced_schema,
    }).then(async (context) => {
      if (locale !== null) {
        context.template.updateLocale(locale);
      }
      const [_template_name, _schema_name] =
        context.appConfig.template_path.split('/');

      // empty case will occur when template_path doesn't correspond to a built template
      const _export_formats = !forced_schema
        ? await context.loadExportFormats(_template_name)
        : {};

      const schema =
        locale !== null
          ? context.template.localized.schema
          : context.template.default.schema;

      const schema_tree = buildSchemaTree(schema);
      context.setSchemaTree(schema_tree);

      let dhs = {
        ...data_harmonizers,
        ...context.makeDataHarmonizersFromSchemaTree(
          schema,
          schema_tree,
          _schema_name,
          _export_formats
        ),
      };
      context.setDataHarmonizers(dhs);

      // COMMENTED OUT: WIP feature
      // if (!!context.oneToManyAppContext) {
      //   context.oneToManyAppContext.destroy();
      // }
      // const appContext = buildAppContext(schema);
      // context.oneToManyAppContext = setup1M(appContext, dhs);  // returns an event manager

      return context;
    });
  }
}
