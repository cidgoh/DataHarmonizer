import * as $ from 'jquery';
import i18n from 'i18next';
import menu from '@/web/templates/menu.json';

import { DataHarmonizer } from '@/lib';
import { findLocalesForLangcodes } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { wait, tap } from '@/lib/utils/general';
import { invert } from '@/lib/utils/objects';
import { dhTabNav, dhRoot } from '.';

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

/**
 * Finds the slot names for a given class within the schema.
 * @param {Object} schema - The schema object containing "classes".
 * @param {string} class_name - The name of the class to search for slot names.
 * @returns {Array} An array of slot names.
 */
export function findSlotNamesForClass(schema, class_name) {
  return Object.keys(schema.classes[class_name].slot_usage).map((field) => {
    return schema.classes[class_name].slot_usage[field].name;
  });
}

/**
 * Visits each class in the schema tree and performs a callback function.
 * @param {Object} schema_tree - The schema tree to visit.
 * @param {string} cls_key - The starting class key for the visitation.
 * @param {Function} callback - The function to perform on each class node.
 */
function visitSchemaTree(schema_tree, callback = tap, next = 'Container') {
  if (!schema_tree[next]) return; // Base case: If the class key is not found
  callback(schema_tree[next]); // Perform the callback on the current node

  // Recurse on each child node
  const children = schema_tree[next].children.filter((el) => el);
  children.forEach((next) => {
    visitSchemaTree(schema_tree, callback, next);
  });
}

/**
 * Transforms the value of a multivalued column in a Data Harmonizer instance.
 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
 * @param {string} column_name - The name of the column to transform.
 * @param {*} old_value - The original value to replace.
 * @param {*} new_value - The new value to replace the original with.
 */
function transformMultivaluedColumn(
  data_harmonizer,
  shared_field,
  changes,
  source,
  old_value,
  new_value
) {
  const hot = data_harmonizer.hot;

  // Verify if column_name is a valid property
  if (hot.propToCol(shared_field.name) === -1) {
    console.error(`Invalid column name: ${shared_field.name}`);
  } else {
    if (old_value !== new_value) {
      hot.batch(() => {
        hot.getData().forEach((row, rowIndex) => {
          if (row[changes[0][1]] === old_value) {
            // Set new value for the cell that matches the condition
            // hot.setDataAtCell(rowIndex, columnIndex, new_value);
            hot.setDataAtCell(rowIndex, changes[0][1], new_value);
          }
        });
      });
    }
  }

  // Rerender table after setting data to reflect changes
  hot.render();
}

/**
 * Makes a column non-editable in a Handsontable instance based on a property key.
 * @param {object} dataHarmonizer - An object containing the Handsontable instance (`hot`).
 * @param {string} property - The column data property or header name.
 */
function makeColumnReadOnly(dataHarmonizer, shared_key_name) {
  const hot = dataHarmonizer.hot;
  // Get the index of the column based on the shared_key_name
  const colHeadersHTML = hot.getColHeader();
  const colHeadersText = colHeadersHTML.map((headerHTML) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerHTML;
    return tempDiv.textContent || tempDiv.innerText || '';
  });
  const columnIndex = colHeadersText.indexOf(shared_key_name);

  // Check if the columnIndex is valid
  if (columnIndex >= 0 && columnIndex < hot.countCols()) {
    const currentColumns = hot.getSettings().columns
      ? hot.getSettings().columns.slice()
      : [];

    // Create a new column setting or update the existing one
    currentColumns[columnIndex] = {
      ...currentColumns[columnIndex],
      readOnly: true,
    };

    hot.updateSettings({ columns: currentColumns });
  } else {
    console.error(
      `makeColumnReadOnly: Column not found for property: ${shared_key_name}`
    );
  }
}

/**
 * Attaches a change event handler to a specific column within a Data Harmonizer instance.
 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
 * @param {string} shared_key_name - The name of the tabular column to monitor for changes.
 * @param {Function} callback - The callback function executed when the column data changes.
 */
function setupSharedColumn(data_harmonizer, shared_key_name, callback) {
  const hot = data_harmonizer.hot;
  // Get the index of the column based on the shared_key_name
  const colHeadersHTML = hot.getColHeader();
  const colHeadersText = colHeadersHTML.map((headerHTML) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerHTML;
    return tempDiv.textContent || tempDiv.innerText || '';
  });
  const columnIndex = colHeadersText.indexOf(shared_key_name);

  // Check if the column index was found properly
  if (columnIndex === -1) {
    console.error(
      `setupSharedColumn: Column with the name '${shared_key_name}' not found.`
    );
  } else {
    // Listen for changes using the afterChange hook of Handsontable
    hot.addHook('afterChange', (changes, source) => {
      // changes is a 2D array containing information about each change
      // Each change is of the form [row, prop, oldVal, newVal]
      if (changes && source !== 'loadData') {
        // Ignore initial load changes
        changes.forEach(([, , oldVal, newVal]) => {
          // You can put here the code that should be executed when
          // the specific column has been edited.
          // This could be a function call, an event dispatch, etc.
          callback(changes, source, oldVal, newVal);
        });
      }
    });
  }
}

/**
 * Creates and attaches shared key handlers to a data harmonizer for a given schema tree node.
 * @param {DataHarmonizer} data_harmonizer - The data harmonizer instance to attach handlers to.
 * @param {Object} schema_tree_node - The schema tree node containing the shared keys and child references.
 */
function makeSharedKeyHandler(
  data_harmonizers,
  data_harmonizer,
  schema_tree_node
) {
  const makeUpdateHandler = (shared_key_spec) => {
    const updateSchemaNodeChildrenCallback = (
      changes,
      source,
      old_value,
      new_value
    ) => {
      schema_tree_node.children.forEach((cls_key) => {
        // lift this out to a more general function?

        // transformation handler: what to do when a cell with a shared key is updated
        // NOTE: don't propagate on empty valued IDs
        if (old_value !== null && typeof old_value !== 'undefined') {
          transformMultivaluedColumn(
            data_harmonizers[cls_key],
            shared_key_spec,
            changes,
            source,
            old_value,
            new_value
          );
        }

        // TODO does this need to recur to get more than ~2 depths of recursion in hierarchy?
        // visitSchemaTree(schema_tree, (schema_tree_node) => {
        //     schema_tree_node.children.forEach(cls_key => {
        //         visitSchemaTree(schema_tree, () => transformMultivaluedColumn(data_harmonizers[cls_key], shared_key_name, changes, source, old_value, new_value), cls_key)
        //     })
        // }, cls_key);
      });
    };

    return updateSchemaNodeChildrenCallback;
  };

  schema_tree_node.shared_keys.forEach((shared_key_spec) => {
    setupSharedColumn(
      data_harmonizer,
      shared_key_spec.name,
      makeUpdateHandler(shared_key_spec)
    );
  });
}

function getTemplatePath() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  if (templatePath === null || typeof templatePath === 'undefined') {
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

  constructor(appConfig = new AppConfig(getTemplatePath())) {
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

  // Two kinds of edits to be dealt with in 1-M:
  // - multiedit inside of a column
  // - propagating an edit when it occurs in one column but not another
  // - have this be handled at the event handler level? [minimal handler approach] [maximal handler approach]
  /**
   * Attaches propagation event handlers to all data harmonizers based on the schema tree.
   * @param {Object} data_harmonizers - An object mapping class names to Data Harmonizer instances.
   * @returns {Object} The same object with event handlers attached.
   */
  attachPropagationEventHandlersToDataHarmonizers(
    data_harmonizers,
    schema_tree
  ) {
    visitSchemaTree(schema_tree, (schema_tree_node) => {
      // Propagation:
      // - If has children with shared_keys, add handler
      // - visit children -> lock field from being edited by user (DH methods can modify it)
      if (schema_tree_node.children.length > 0) {
        if (!schema_tree_node.tree_root) {
          makeSharedKeyHandler(
            data_harmonizers,
            data_harmonizers[schema_tree_node.name],
            schema_tree_node
          );
          schema_tree_node.children.forEach((child) => {
            schema_tree[child].shared_keys.forEach((shared_key_spec_child) => {
              makeColumnReadOnly(
                data_harmonizers[child],
                shared_key_spec_child.name
              );
            });
          });
        }
      }
    });

    function stripDiv(html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.innerText;
    }

    Object.values(data_harmonizers).forEach((dh) => {
      schema_tree[dh.class_assignment].children.forEach((child_name) => {
        // filter all rows on initialization if child
        data_harmonizers[child_name].hideAll();
      });

      dh.hot.addHook('afterSelection', (row, col) => {
        const valueToMatch = dh.hot.getDataAtCell(row, col);
        if (!(valueToMatch === null || typeof valueToMatch === 'undefined')) {
          // get value at cell
          // filter other data harmonizer at cell
          schema_tree[dh.class_assignment].children.forEach((child_name) => {
            data_harmonizers[child_name].showAllRows();
            // filter for other data in data harmonizers matching the shared ID iff the selection is not empty
            // else return an empty list
            const shared_key_name = schema_tree[
              dh.class_assignment
            ].shared_keys.filter((el) => el.related_concept === child_name)[0]
              .name;
            visitSchemaTree(
              schema_tree,
              (schema_tree_node) => {
                const hot = data_harmonizers[schema_tree_node.name].hot;
                const columnHeaders = hot.getColHeader();
                const columnName = shared_key_name; // shared_key based on event selection ~ replace columnIndex with event data?
                const columnIndex = columnHeaders
                  .map(stripDiv)
                  .findIndex((header) => header === columnName);

                if (columnIndex === -1) {
                  console.error('Column name not found');
                  return;
                }

                const plugin = hot.getPlugin('filters');
                // Add a condition where the column value equals the specified value
                plugin.clearConditions(columnIndex); // change valueToMatch per new selection in the column
                plugin.addCondition(columnIndex, 'eq', [valueToMatch]);
                plugin.filter();
              },
              child_name
            );
          });
        } else {
          schema_tree[dh.class_assignment].children.forEach((child_name) => {
            data_harmonizers[child_name].showAllRows();
            data_harmonizers[child_name].hideAllButFirstNEmptyRows(0);
          });
        }
      });

      dh.hot.addHook('afterDeselect', () => {
        // get value at cell
        // filter other data harmonizer at cell
        schema_tree[dh.class_assignment].children.forEach((child_name) => {
          const shared_key_name = schema_tree[
            dh.class_assignment
          ].shared_keys.filter((el) => el.related_concept === child_name)[0]
            .name;

          visitSchemaTree(
            schema_tree,
            (schema_tree_node) => {
              const hot = data_harmonizers[schema_tree_node.name].hot;
              const columnHeaders = hot.getColHeader();
              const columnName = shared_key_name; // shared_key based on event selection ~ replace columnIndex with event data?
              const columnIndex = columnHeaders
                .map(stripDiv)
                .findIndex((header) => header === columnName);

              if (columnIndex === -1) {
                console.error('Column name not found');
                return;
              }

              const plugin = hot.getPlugin('filters');
              plugin.clearConditions(columnIndex);
              plugin.filter();
            },
            child_name
          );
        });
      });
      // TODO: preserve memory of selection between tabs! in DH? => using outsideClickDeselects: false,  // for maintaining selection between tabs
    });

    return data_harmonizers;
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
        if (
          suffixes.some(
            (suffix) =>
              typeof filtered_multi_suffixes_filter[suffix] !== 'undefined'
          ) &&
          suffixes.length >= suffix_threshold
        ) {
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
      const primaryClass =
        typeof translation.schema.classes[template.default.schema.name] !==
        'undefined'
          ? translation.schema.classes[template.default.schema.name]
          : typeof translation.schema.classes[
              template.default.schema.name.replace('_', ' ')
            ] !== 'undefined'
          ? translation.schema.classes[
              template.default.schema.name.replace('_', ' ')
            ]
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
          [default_sections[translation_slot_name]]:
            translated_sections[translation_slot_name],
        })
      );

      const language_translation = {
        ...section_resource,
        ...schema_resource,
        ...enum_resource,
      };

      i18n.addResources(langcode.split('-')[0], 'translation', {
        ...language_translation,
        ...invert(language_translation),
      });

      i18n.addResources('default', 'translation', {
        // inverted language translation from default
        // ...language_translation,
        ...invert(language_translation),
      });

      // i18n.addResources('en', 'translation', {
      //   // inverted language translation from default
      //   // ...language_translation,
      //   ...invert(language_translation),
      // });
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

  /**
   * Builds a schema tree from the given schema.
   * @param {Object} schema - The schema object containing "classes".
   * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.
   */
  buildSchemaTree(schema) {
    function updateChildrenAndSharedKeys(data) {
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

    if (typeof schema.classes['Container'] === 'undefined') {
      const class_names = Object.keys(schema.classes).filter(
        (key) => key !== 'dh_interface'
      );
      return {
        Container: {
          tree_root: true,
          children: [
            // "GRDI_Sample",
            // "AMR_Test"
            ...class_names,
          ],
        },
        // flat hierarchy of the classes that do exist, with a tab separated each.
        ...class_names.reduce((acc, key) => {
          return Object.assign(acc, {
            [key]: {
              name: key,
              children: [],
              shared_keys: [],
            },
          });
        }, {}),
      };
    }

    const classes = Object.keys(schema.classes).filter(
      (el) => el !== 'dh_interface' && el !== 'Container'
    );

    const tree_base = {
      Container: { tree_root: true, children: classes },
    };
    const shared_keys_per_class = findSharedKeys(schema);
    const pre_schema_tree = classes.reduce((acc, class_key) => {
      acc[class_key] = {
        name: class_key,
        shared_keys: shared_keys_per_class[class_key],
        children: shared_keys_per_class[class_key]
          .map((item) => item.range)
          .filter(
            (range) => range !== class_key && typeof range !== 'undefined'
          ), // TODO inefficient
      };
      return acc;
    }, tree_base);

    const schema_tree = updateChildrenAndSharedKeys(pre_schema_tree);
    return schema_tree;
  }

  /**
   * Creates Data Harmonizers from the schema tree.
   * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
   * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
   */
  makeDataHarmonizersFromSchemaTree(
    context,
    schema,
    schema_tree,
    schema_name,
    export_formats
  ) {
    function createDataHarmonizerContainer(dhId, isActive) {
      let dhSubroot = document.createElement('div');
      dhSubroot.id = dhId;
      dhSubroot.classList.add('data-harmonizer-grid', 'tab-pane', 'fade');
      if (isActive) {
        dhSubroot.classList.add('show', 'active');
      }
      dhSubroot.setAttribute('aria-labelledby', `tab-${dhId}`);
      return dhSubroot;
    }

    function createDataHarmonizerTab(dhId, entity, isActive) {
      const dhTab = document.createElement('li');
      dhTab.className = 'nav-item';
      dhTab.setAttribute('role', 'presentation');

      const dhTabLink = document.createElement('a');
      dhTabLink.className = 'nav-link' + (isActive ? ' active' : '');
      dhTabLink.id = `tab-${dhId}`;
      dhTabLink.href = `#${dhId}`;
      dhTabLink.textContent = entity;
      dhTabLink.dataset.toggle = 'tab'; // Bootstrap specific data attribute for tabs
      dhTabLink.setAttribute('data-bs-toggle', 'tab');
      dhTabLink.setAttribute('data-bs-target', dhTabLink.href);
      dhTabLink.setAttribute('role', 'tab');
      dhTabLink.setAttribute('aria-controls', dhId);

      dhTab.appendChild(dhTabLink);
      return dhTab;
    }

    let data_harmonizers = {};
    if (schema_tree) {
      Object.entries(schema_tree)
        .filter(([cls_key]) => cls_key !== 'Container')
        .forEach((obj, index) => {
          if (obj.length > 0) {
            const [cls_key, spec] = obj;
            const dhId = `data-harmonizer-grid-${index}`;

            if (!document.getElementById(dhId)) {
              let dhSubroot = createDataHarmonizerContainer(dhId, index === 0);
              dhRoot.appendChild(dhSubroot); // Appending to the parent container

              const dhTab = createDataHarmonizerTab(
                dhId,
                spec.name,
                index === 0
              );
              dhTab.addEventListener('click', () => {
                // set the current dataharmonizer tab in the context
                context.setCurrentDataHarmonizer(spec.name);

                $(document).trigger('dhCurrentChange', {
                  data: spec.name,
                });
              });
              dhTabNav.appendChild(dhTab); // Appending to the tab navigation

              data_harmonizers[spec.name] = new DataHarmonizer(
                dhSubroot,
                context,
                {
                  loadingScreenRoot: document.body,
                  class_assignment: cls_key,
                  field_filters: findSlotNamesForClass(schema, cls_key), // TODO: Find slot names for filtering
                }
              );

              data_harmonizers[spec.name].useSchema(
                schema,
                export_formats,
                schema_name
              );
            }
          }
        });
    }
    delete data_harmonizers[undefined];
    return data_harmonizers; // Return the created data harmonizers if needed
  }

  async setupDataHarmonizers({
    template_path,
    // schema_name,
    // template_name,
    // schema,
    // schemaClass,
    // columnCoordinates,
    locale,
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
        if (locale !== null) {
          context.template.updateLocale(locale);
        }
        const [_template_name, _schema_name] =
          context.appConfig.template_path.split('/');
        const _export_formats = await context.getExportFormats(_template_name);
        const schema = context.template.current.schema;
        const schema_tree = context.buildSchemaTree(schema);
        context.setSchemaTree(schema_tree);
        data_harmonizers = context.makeDataHarmonizersFromSchemaTree(
          this,
          schema,
          schema_tree,
          _schema_name,
          _export_formats
        );
        // HACK
        context.setDataHarmonizers(data_harmonizers);
        context.attachPropagationEventHandlersToDataHarmonizers(
          data_harmonizers,
          schema_tree
        );
        return context;
      }
    );
  }
}