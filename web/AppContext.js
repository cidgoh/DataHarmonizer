import * as $ from 'jquery';
import i18n from 'i18next';
import { findLocalesForLangcodes } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { wait } from '@/lib/utils/general';
import { invert } from '@/lib/utils/objects';
import { dhTabNav, buildSchemaTree, makeDataHarmonizersFromSchemaTree, attachPropagationEventHandlersToDataHarmonizers } from '.';

export async function getTemplatePath() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  if (templatePath === null || typeof templatePath === 'undefined') {
    const menu = (await import(`@/web/templates/menu.json`)).default;
    const schema_name = Object.keys(menu)[0];
    const template_name = Object.keys(menu[schema_name])[0];
    return `${schema_name}/${template_name}`;
  }
  return templatePath;
}
export class AppConfig {
  constructor(template_path = null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}
export class AppContext {
  schema_tree = {};
  dhs = {};
  current_data_harmonizer_name = null;
  template = null;

  constructor(appConfig) {
    this.appConfig = appConfig;
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

  async getTypeTree() {
    return (await this.getClasses()).reduce((acc, el) => {
      const key = Object.keys(el)[0];
      const value = Object.values(el)[0];
      return Object.assign(acc, {
        nodes: {
          [key]: {
            parents: [value['is_a']],
          },
        },
      });
    }, {});
  }

  /*
    Example Data:
    {
      "nodes": {
        "Sensor1": {"type": "Sensor", "data": 100, "children": ["Processor1"]},
        "Sensor2": {"type": "Sensor", "data": 150, "children": ["Processor1"]},
        "Processor1": {"type": "Processor", "data": 0, "children": ["Display1"]},
        "Display1": {"type": "Display", "data": 0, "children": []}
    }
    */
  async getDependencyTree() {
    return Object.entries(await this.getTypeTree()['nodes']).reduce(
      (acc, el) => {
        if (typeof acc['nodes'] !== 'undefined' && !acc['nodes'][el[0]]) {
          acc['nodes'][el[0]] = { data: null, children: [] };
        }
        el[1].parents.forEach((parent) => {
          if (typeof acc['nodes'] !== 'undefined' && !acc['nodes'][parent]) {
            acc['nodes'][parent] = { data: null, children: [] };
          }
          acc['nodes'][parent]['children'].push(el[0]);
        });
        return acc;
      },
      { nodes: {} }
    );
  }

  /**
   * Finds slots with suffixes shared across multiple prefixes in the given slot usage data.
   *
   * @param {Object} slotUsage - The slot usage data for a class.
   * @param {number} [prefix_threshold=2] - The threshold for the number of prefixes sharing a suffix to be considered.
   * @param {number} [suffix_threshold=2] - The threshold for the minimum number of suffixes shared to be considered.
   * @returns {Object} - A dictionary containing prefixes and corresponding suffixes for one-to-many relationships.
   *
   * @example
   * // Example slot usage data for a class
   * const exampleSlotUsage = {
   *   "apple_color": "red",
   *   "apple_size": "medium",
   *   "banana_color": "yellow",
   *   "banana_size": "large",
   *   "orange_color": "orange",
   *   "orange_size": "medium",
   *   "kiwi_color": "brown",
   *   "kiwi_size": "small",
   * };
   *
   * // Function to find slots with suffixes shared across multiple prefixes
   * const result = findOneToManySlots(exampleSlotUsage, 2, 2);
   * // Output: { "apple": ["apple_color", "apple_size"], "orange": ["orange_color", "orange_size"] }
   */
  async oneToManySlotUsage(cls, prefix_threshold = 2, suffix_threshold = 2) {
    const findOneToManySlots = (
      slotUsage,
      prefix_threshold = 1,
      suffix_threshold = 1
    ) => {
      const suffix_dict = {};
      for (const key in slotUsage) {
        const [prefix] = key.split('_');
        if (!suffix_dict[prefix]) {
          suffix_dict[prefix] = [];
        }
        suffix_dict[prefix].push(key.replace(`${prefix}_`, ''));
      }

      const multi_suffixes_filter = {};
      for (const prefix in suffix_dict) {
        suffix_dict[prefix].forEach((suffix) => {
          if (!multi_suffixes_filter[suffix]) {
            multi_suffixes_filter[suffix] = [];
          }
          multi_suffixes_filter[suffix].push(prefix);
        });
      }

      // Optionally, you can filter the entries based on count >= filter_threshold for number of prefixes that the suffix is shared in
      const filtered_multi_suffixes_filter = Object.fromEntries(
        Object.entries(multi_suffixes_filter).filter(
          ([, prefixes]) => prefixes.length >= prefix_threshold
        )
      );

      // Select for all prefix-suffixes, there exists a suffix used across multiple prefixes
      const one_to_many = {};
      for (const [prefix, suffixes] of Object.entries(suffix_dict)) {
        if (suffixes.some(
          (suffix) => typeof filtered_multi_suffixes_filter[suffix] !== 'undefined'
        ) &&
          suffixes.length >= suffix_threshold) {
          one_to_many[prefix] = suffixes.map((suffix) => `${prefix}_${suffix}`);
        }
      }

      return one_to_many;
    };
    return findOneToManySlots(
      this.template.current.schema.classes[cls].slot_usage,
      prefix_threshold,
      suffix_threshold
    );
  }

  async initializeTemplate(template_path) {
    const [schema_name] = template_path.split('/');
    this.template = await Template.create(schema_name);
    return this;
  }

  async getSchema() {
    return this.template.current.schema;
  }

  async getLocaleData() {
    let locales = {
      default: { langcode: 'default', nativeName: 'Default' },
      ...findLocalesForLangcodes(this.template.locales),
    };
    return locales;
  }

  async addTranslationResources(template, locales = null) {
    if (locales === null) {
      locales = await this.getLocaleData(template);
    }

    // Consolidate function for reducing objects
    function consolidate(iterable, reducer) {
      return Object.entries(iterable).reduce(reducer, {});
    }

    const defaultLocale = {
      langcode: 'default',
      nativeName: 'Default',
    };
    locales = {
      ...locales,
      default: defaultLocale,
      ...findLocalesForLangcodes(template.locales),
    };

    Object.entries(template.translations).forEach(([langcode, translation]) => {

      const primaryClass = typeof translation.schema.classes[template.default.schema.name] !== 'undefined' ?
        translation.schema.classes[template.default.schema.name]
        : typeof translation.schema.classes[template.default.schema.name.replace('_', ' ')] !== 'undefined' ?
          translation.schema.classes[template.default.schema.name.replace('_', ' ')]
          : {};

      const schema_resource = consolidate(
        translation.schema.slots,
        (acc, [slot_symbol, { title }]) => ({
          ...acc,
          // [slot_symbol]: title,
          [slot_symbol.replace(/ /g, '_')]: title,
        })
      );

      const enum_resource = consolidate(
        translation.schema.enums,
        (acc, [, { permissible_values }]) => {
          for (const [enum_value, { text }] of Object.entries(
            permissible_values
          )) {
            acc[enum_value] = text;
          }
          return acc;
        }
      );

      const translated_sections = consolidate(
        primaryClass.slot_usage,
        (acc, [translation_slot_name, { slot_group }]) => ({
          ...acc,
          [translation_slot_name]: slot_group,
        })
      );

      const default_sections = consolidate(
        primaryClass.slot_usage,
        (acc, [default_slot_name, { slot_group }]) => ({
          ...acc,
          [default_slot_name]: slot_group,
        })
      );

      const section_resource = consolidate(
        translated_sections,
        (acc, [translation_slot_name]) => ({
          ...acc,
          [default_sections[translation_slot_name]]: translated_sections[translation_slot_name],
        })
      );

      const language_translation = {
        ...section_resource,
        ...schema_resource,
        ...enum_resource,
      };

      i18n.addResources(langcode.split('-')[0], 'translation', {
        ...language_translation,
      });

      i18n.addResources('default', 'translation', {
        // inverted language translation from default
        ...invert(language_translation)
      });

    });
  }

  getClasses() {
    const classes = Object.entries(this.template.current.schema.classes);
    return classes.map(([key, value]) => ({
      [key]: value,
    }));
  }

  getSlotGroups() {
    const schema = this.template.current.schema;
    const slotGroups = new Set();

    if (schema.classes) {
      for (const className in schema.classes) {
        const classInfo = schema.classes[className];
        if (classInfo.slot_usage) {
          for (const slotName in classInfo.slot_usage) {
            const slotInfo = classInfo.slot_usage[slotName];
            if (slotInfo.slot_group) {
              slotGroups.add(slotInfo.slot_group);
            }
          }
        }
      }
    }

    return Array.from(slotGroups);
  }

  async getExportFormats(schema) {
    return (await import(`@/web/templates/${schema}/export.js`)).default;
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

  clearContext() {
    this.schema_tree = {};
    this.dhs = {};
    this.current_data_harmonizer_name = null;
  }

  clearInterface() {
    dhTabNav.innerHTML = '';

    const pattern = 'data-harmonizer-grid-'; // sub elements
    const matchingElements = document.querySelectorAll(`[id^="${pattern}"]`);

    // Loop through the NodeList and remove each element
    matchingElements.forEach((element) => {
      element.parentNode.removeChild(element);
    });

    // dhFooterRoot.innerHTML = '';
    // dhToolbarRoot.innerHTML = '';
  }

  async setupDataHarmonizers({
    template_path,
    // schema_name,
    // template_name,
    // schema,
    exportFormats,
    // schemaClass,
    // columnCoordinates,
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
          "GRDI_Sample": {
            "name": "GRDI_Sample",
            "from_schema": "https://example.com/GRDI",
            "multivalued": true,
            "alias": "GRDI_samples",
            "owner": "Container",
            "domain_of": [
              "Container"
            ],
            "range": "GRDI_Sample",
            "inlined_as_list": true
          },
          "AMR_Test": {
            "name": "AMR_Test",
            "from_schema": "https://example.com/GRDI",
            "multivalued": true,
            "alias": "AMR_Tests",
            "owner": "Container",
            "domain_of": [
              "Container"initializeTemplate
            ],
            "range": "AMR_Test",
            "inlined_as_list": true
          }
        },
        "tree_root": true
      }
    }
 
    const schema_tree = {
      "Container": { tree_root: true, children: ["AMR_Test", "GRDI_samples"] }
      "GRDI_Sample": { shared_key: ["sample_collector_sample_ID"], children: ["AMR_Test"] }  // TODO: should shared_key be shared between nodes on tree?
      "AMR_Test": { shared_key: ["sample_collector_sample_ID"], children: [] },
    }
 
    */
    this.appConfig = new AppConfig(template_path);
    this.clearInterface();
    this.clearContext();
    let data_harmonizers = {};
    return this.initializeTemplate(this.appConfig.template_path).then(
      async (context) => {
        const [_template_name, _schema_name] = context.appConfig.template_path.split('/');
        const _export_formats = exportFormats || (await context.getExportFormats(_template_name));
        const schema = context.template.default.schema;
        const schema_tree = buildSchemaTree(schema);
        context.setSchemaTree(schema_tree);
        data_harmonizers = makeDataHarmonizersFromSchemaTree(
          this,
          schema,
          schema_tree,
          _schema_name,
          _export_formats
        );
        // HACK
        context.setDataHarmonizers(data_harmonizers);
        attachPropagationEventHandlersToDataHarmonizers(
          data_harmonizers,
          schema_tree
        );
        return context;
      }
    );
  }
}
