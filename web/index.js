import * as $ from 'jquery';
import 'bootstrap';

import i18n from 'i18next';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';

import menu from '@/web/templates/menu.json';
import tags from 'language-tags';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

const rootUrl = window.location.host;
console.log('Root URL:', rootUrl);

async function getTemplatePath() {
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
        // return "grdi/GRDI_Sample";
    }
    return templatePath;

}

class AppConfig {
    constructor(template_path = null) {
        this.rootUrl = window.location.host;
        this.template_path = template_path;
    }
}

class AppContext {

    constructor(appConfig) {
        this.template = null;
        this.appConfig = appConfig;
    }

    // TODO: memoize?
    async getTypeTree() {
        return (await this.getClasses()).reduce((acc, el) => {
            const key = Object.keys(el)[0];
            const value = Object.values(el)[0];
            return Object.assign(acc, {
                "nodes": {
                    [key]: {
                        parents: [value['is_a']]
                    }
                }
            })
        }, {});
    }

    // TODO: memoize?
    // setup dependency tree
    // TODO: dh_interface superclass
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
        return Object.entries(await this.getTypeTree()["nodes"]).reduce((acc, el) => {
            if (!!!acc["nodes"][el[0]]) {
                acc["nodes"][el[0]] = { "data": null, "children": [] };
            }
            el[1].parents.forEach(parent => {
                if (!!!acc["nodes"][parent]) {
                    acc["nodes"][parent] = { "data": null, "children": [] };
                };
                acc["nodes"][parent]["children"].push(el[0]);
            });
            return acc;
        }, { "nodes": {} });

    }


    async propagateChangeToChildren(node_label, func = id => id) {
        const dependency_tree = (await this.getDependencyTree());
        let current_node_label = node_label;
        let children_index = 0;
        do {
            func(dependency_tree[current_node_label].data);
            this.propagateData(dependency_tree[current_node_label].children[children_index]);
            children_index++;
        } while (dependency_tree[current_node_label].children.length > children_index);
    }

    /**
     * Asynchronously finds slots where the suffix is shared across multiple prefixes.
     *
     * @param {string} cls - The class identifier.
     * @param {number} prefix_threshold - The threshold for the number of prefixes that a suffix should be shared in (default: 2).
     * @param {number} suffix_threshold - The threshold for the minimum number of suffixes a prefix should have (default: 2).
     * @returns {Object} - A dictionary containing prefixes and corresponding suffixes.
     */
    async oneToManySlotUsage(cls, prefix_threshold = 2, suffix_threshold = 2) {
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
        const findOneToManySlots = (slotUsage, prefix_threshold = 1, suffix_threshold = 1) => {

            const suffix_dict = {};
            for (const key in slotUsage) {
                const [prefix,] = key.split('_');
                if (!suffix_dict[prefix]) {
                    suffix_dict[prefix] = [];
                }
                suffix_dict[prefix].push(key.replace(`${prefix}_`, ''));
            };

            const multi_suffixes_filter = {};
            for (const prefix in suffix_dict) {
                suffix_dict[prefix].forEach(suffix => {
                    if (!multi_suffixes_filter[suffix]) {
                        multi_suffixes_filter[suffix] = [];
                    }
                    multi_suffixes_filter[suffix].push(prefix);
                });
            }

            // Optionally, you can filter the entries based on count >= filter_threshold for number of prefixes that the suffix is shared in
            const filtered_multi_suffixes_filter = Object.fromEntries(
                Object.entries(multi_suffixes_filter).filter(([, prefixes]) => prefixes.length >= prefix_threshold)
            );

            // Select for all prefix-suffixes, there exists a suffix used across multiple prefixes
            const one_to_many = {};
            for (const [prefix, suffixes] of Object.entries(suffix_dict)) {
                if (suffixes.some(suffix => filtered_multi_suffixes_filter.hasOwnProperty(suffix)) && suffixes.length >= suffix_threshold) {
                    one_to_many[prefix] = suffixes.map(suffix => `${prefix}_${suffix}`);
                }
            }

            return one_to_many;

        };
        return findOneToManySlots(this.template.current.schema.classes[cls].slot_usage, prefix_threshold, suffix_threshold);
    }

    async initializeTemplate(template_path) {
        const [schema_name, template_name] = template_path.split('/');
        if (!this.template) {
            this.template = await Template.create(schema_name);
        }
        return this;
    }

    async getSchema() {
        return this.template.current.schema;
    }

    async getLocaleData(template) {
        const locales = {
            default: { langcode: 'default', nativeName: 'Default' },
        };

        this.template.locales.forEach((locale) => {
            const langcode = locale.split('-')[0];
            const nativeName = tags.language(langcode).data.record.Description[0] || 'Default';
            locales[langcode] = { langcode, nativeName };
        });

        return locales;
    }

    async addTranslationResources(template, locales = null) {
        if (locales === null) {
            locales = this.getLocaleData(template);
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
            default: defaultLocale,
        };

        template.locales.forEach((locale) => {

            const langcode = locale.split('-')[0];
            const nativeName =
                tags.language(langcode).data.record.Description[0] || 'Default';
            locales[langcode] = { langcode, nativeName };

        });

        Object.entries(template.translations).forEach(
            ([langcode, translation]) => {
                const schema_resource = consolidate(
                    translation.schema.slots,
                    (acc, [slot_symbol, { name }]) => ({
                        ...acc,
                        [slot_symbol.replace(/ /g, '_')]: name,
                    })
                );

                const enum_resource = consolidate(
                    translation.schema.enums,
                    (acc, [enum_symbol, { permissible_values }]) => {
                        for (const [enum_value, { text }] of Object.entries(
                            permissible_values
                        )) {
                            acc[enum_value] = text;
                        }
                        return acc;
                    }
                );

                const translated_sections = consolidate(
                    translation.schema.classes[template.default.schema.name].slot_usage,
                    (acc, [translation_slot_name, { slot_group }]) => ({
                        ...acc,
                        [translation_slot_name]: slot_group,
                    })
                );

                const default_sections = consolidate(
                    template.default.schema.classes[template.default.schema.name]
                        .slot_usage,
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

                i18n.addResources(langcode.split('-')[0], 'translation', {
                    ...section_resource,
                    ...schema_resource,
                    ...enum_resource,
                });
            }
        );
    }

    getClasses() {
        const classes = Object.entries(this.template.current.schema.classes);
        return classes.map(([key, value]) => ({
            [key]: value
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

    async getLocales() {
        const locales = this.getLocaleData(this.template);
        this.addTranslationResources(this.template, locales); // TODO side effect – put elsewhere?
        return locales;
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

}

// Make the top function asynchronous to allow for a data-loading/IO step?
const main = async function () {

    let dhRoot = document.querySelector('#data-harmonizer-grid');
    const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
    const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');
    const dhTabNav = document.querySelector("#data-harmonizer-tabs");

    // loading screen
    $(dhRoot).append(`
        <div class="w-100 h-100 position-fixed fixed-top" id="loading-screen">
        <div class="d-flex h-100 align-items-center justify-content-center">
            <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Please wait...</span>
            </div>
        </div>
        </div>
    `);

    let dhs = [];
    let data_harmonizers = {};

    const context = new AppContext(new AppConfig(await getTemplatePath()));


    context.initializeTemplate(context.appConfig.template_path)
        .then(async (context) => {
            const _template = context.template;
            const _schema = _template.current.schema;
            const [_template_name, _schema_name] = context.appConfig.template_path.split('/');
            const _export_formats = (await context.getExportFormats(_template_name));

            // // internationalize
            // // TODO: connect to locale of browser!
            // // Takes `lang` as argument (unused)
            initI18n(( /* lang */ ) => {
                $(document).localize();
                dhs.forEach(dh => dh.render());
            });
            context.addTranslationResources(_template, context.getLocaleData());

            const classes = (await context.getClasses()).reduce((acc, item) => Object.assign(acc, item), {});
            
            // attributes are the classes which feature 1-M relationships
            // to process these classes into DataHarmonizer tables, the following must be performed:
            // - Navigation: one tab per class = one data harmonizer per class
            // - Tables: filter the table by the slots featured in that class-slot pair alone/relative to a sheet.
            // - Propagation: there will be an event handler added between Data Harmonizers based on a shared domain.
            // - Loading: the system will expect an excel file with sheets or a database with tables for selection. the Toolbar must know.

            // the existence of a container class signifies a 1-M data loading setup with an ID join
            if (classes['Container']) {
                
                console.log('branch 1');
                console.log('has Container class', classes['Container']);

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
                          "Container"
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

                /**
                 * Logging function used for debugging, it logs the supplied argument to the console.
                 * @param {*} id - The item to be logged.
                 * @returns {*} The same item passed in.
                 */
                const tap = id => { console.log(id); return id; };

                /**
                 * Finds the shared keys per class in a given schema.
                 * @param {Object} schema - The schema object with structure containing "classes" and "slot_usage".
                 * @returns {Object} An object mapping class names to an array of shared keys.
                 */
                function findSharedKeys(schema) {
                    const class_names = new Set(Object.keys(schema.classes).filter(k => k !== 'dh_interface'));
                    let shared_keys_per_class = {};                
                    class_names.forEach(key => {
                        shared_keys_per_class[key] = []; // initialize the array to avoid checking existence later
                        
                        // Filtering and mapping slots
                        const class_data = schema.classes[key];
                        const slots = class_data.attributes;                
                        const shared_keys = Object.values(slots)
                            .map(slot_usage => {
                                return {
                                    "name": slot_usage.name,
                                    "related_concept": slot_usage.range,
                                    "relation": ['dh_interface', 'Container'].includes(key) ? "child" : class_names.has(slot_usage.range) ? "parent" : "range"
                                };
                            });
                                
                        shared_keys_per_class[key] = shared_keys; // assign mapped values
                
                        // Ensure there are no duplicates; if duplicates are meaningful, this will need adjustment
                        shared_keys.forEach(slot => {
                
                            shared_keys_per_class[slot.related_class] = 
                                shared_keys_per_class[slot.related_class] || []; // ensure array exists
                                
                            if (!shared_keys_per_class[slot.related_class].find(s => s.name === slot.name)) {
                                shared_keys_per_class[slot.related_class].push(slot);
                            };
                
                        });
                
                        shared_keys_per_class[key] = shared_keys.filter(obj => obj.related_concept && ['parent', 'child'].includes(obj.relation));
                
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
                function findSlotNamesForClass(schema, class_name) {
                    return !!schema.classes[class_name] && !!schema.classes[class_name].slots  ? Object.keys(schema.classes[class_name].slots) : [];
                }

                /**
                 * Builds a schema tree from the given schema.
                 * @param {Object} schema - The schema object containing "classes".
                 * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.
                 */
                function buildSchemaTree(schema) {

                    function updateChildrenAndSharedKeys(data) {
                        // Use a deep clone to avoid mutating the original object
                        const result = JSON.parse(JSON.stringify(data));
                      
                        Object.keys(result).forEach(key => {
                          const elem = result[key];
                          (elem.shared_keys || []).forEach(sk => {
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
                                rsk => rsk.name === sk.name && rsk.related_concept === key
                              );
                      
                              // Add reciprocal shared key if it doesn't exist
                              if (!reciprocalExists) {
                                parent.shared_keys.push({
                                  name: sk.name,
                                  related_concept: key,
                                  relation: 'child'
                                });
                              }
                            }
                          });
                        });
                      
                        return result;
                      }
                    

                    if (!!!schema.classes["Container"]) return null;

                    const attributes = schema.classes["Container"].attributes;
                    const classes = Object.values(attributes).reduce((acc, item) => acc.concat([item.range]), []);
                    const tree_base = {
                        "Container": { tree_root: true, children: classes }
                    };

                    const shared_keys_per_class = findSharedKeys(schema);
                    const pre_schema_tree = classes.reduce((acc, class_key) => {
                        acc[class_key] = {
                            name: class_key,
                            shared_keys: shared_keys_per_class[class_key],
                            children: shared_keys_per_class[class_key].map(item => item.range).filter(range => range !== class_key && typeof range !== 'undefined') // TODO inefficient
                        };
                        return acc;
                    }, tree_base);

                    return updateChildrenAndSharedKeys(pre_schema_tree);
                };

                /**
                 * Visits each class in the schema tree and performs a callback function.
                 * @param {Object} schema_tree - The schema tree to visit.
                 * @param {string} cls_key - The starting class key for the visitation.
                 * @param {Function} callback - The function to perform on each class node.
                 */
                function visitSchemaTree(schema_tree, callback=tap, next='Container') {
                    if (!schema_tree[next]) return;  // Base case: If the class key is not found
                    callback(schema_tree[next]);  // Perform the callback on the current node
                    
                    // Recurse on each child node
                    const children = schema_tree[next].children.filter(el => el);                
                    children.forEach(next => {
                        visitSchemaTree(schema_tree, callback, next);
                    });
                };

                /**
                 * Creates Data Harmonizers from the schema tree.
                 * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
                 * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
                 */
                function makeDataHarmonizersFromSchemaTree(schema, schema_tree) {

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
                        console.log('create data harmonizer tab')
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
                    if (!!schema_tree) {
                        Object.entries(schema_tree).filter(([cls_key,]) => cls_key !== 'Container').forEach((obj, index) => {
                            if (obj.length > 0) {
                                const [cls_key, spec] = obj;
                                const dhId = `data-harmonizer-grid-${index}`;
                                let dhSubroot = createDataHarmonizerContainer(dhId, index === 0);
                                
                                dhRoot.appendChild(dhSubroot); // Appending to the parent container
                                
                                const dhTab = createDataHarmonizerTab(dhId, spec.name, index === 0);
                                dhTabNav.appendChild(dhTab); // Appending to the tab navigation
                                
                                console.log(findSlotNamesForClass(schema, cls_key));

                                data_harmonizers[spec.name] = new DataHarmonizer(dhSubroot, {
                                    context: context,
                                    loadingScreenRoot: document.body,
                                    field_filters: findSlotNamesForClass(schema, cls_key) // TODO: Find slot names for filtering
                                });

                                data_harmonizers[spec.name].useSchema(_schema, _export_formats, _schema_name);

                            }
                        });
                    }
                
                    return data_harmonizers; // Return the created data harmonizers if needed
                }                 

                /**
                 * Transforms the value of a multivalued column in a Data Harmonizer instance.
                 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
                 * @param {string} column_name - The name of the column to transform.
                 * @param {*} old_value - The original value to replace.
                 * @param {*} new_value - The new value to replace the original with.
                 */
                function transformMultivaluedColumn(data_harmonizer, shared_field, changes, source,  old_value, new_value) {
                    const hot = data_harmonizer.hot;

                    console.log('transform multivalued column execute', shared_field, changes, source,  old_value, new_value);
                    console.log(hot.propToCol(shared_field.name))
                    // Verify if column_name is a valid property
                    if (hot.propToCol(shared_field.name) === -1) {
                      console.error(`Invalid column name: ${column_name}`);
                    } else {
                        if (old_value !== new_value) hot.setDataAtCell(changes[0][0], changes[0][1], new_value);

                        // TODO
                        // Perform batch operation to replace old_value with new_value where the condition matches
                        // const matchCondition = row => row[column_name] === old_value;
                        // hot.batch(() => {
                        //   hot.getSourceData().forEach((row, rowIndex) => {
                        //     if (matchCondition(row)) {
                        //       // Set new value for a property of matched rows
                        //       hot.setDataAtRowProp(rowIndex, column_name, new_value);
                        //     }
                        //   });
                        // });
                      
                        // Rerender table after setting data to reflect changes
                        hot.render();
                    }

                };

                /**
                 * Locks editing capabilities for a specific column in a Data Harmonizer instance.
                 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
                 * @param {string} shared_key_name - The name of the tabular column to be locked.
                 */
                function lockColumnEdits(data_harmonizer, shared_key_name) {
                    const hot = data_harmonizer.hot;
                    
                    // Get current column settings
                    const currentColumns = hot.getSettings().columns ? hot.getSettings().columns.slice() : [];
                  
                    // Find the index of the column to lock
                    const columnIndexToLock = hot.propToCol(shared_key_name);
                    
                    if (columnIndexToLock < 0 || columnIndexToLock >= currentColumns.length) {
                      console.error(`Could not find a column with data property: ${shared_key_name}`);
                      return;
                    }
                  
                    // Set the read-only property for the matched column
                    const columnSettingsToUpdate = { ...currentColumns[columnIndexToLock], readOnly: true };
                  
                    // Update the specific column settings while keeping others intact
                    currentColumns[columnIndexToLock] = columnSettingsToUpdate;
                  
                    // Update the column settings of the Handsontable instance
                    hot.updateSettings({
                      columns: currentColumns
                    });
                }
                
                /**
                 * Attaches a change event handler to a specific column within a Data Harmonizer instance.
                 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
                 * @param {string} shared_key_name - The name of the tabular column to monitor for changes.
                 * @param {Function} callback - The callback function executed when the column data changes.
                 */
                function attachColumnEditHandler(data_harmonizer, shared_key_name, callback) {
                    const hot = data_harmonizer.hot;
                    // Get the index of the column based on the shared_key_name
                    const columnIndex = hot.propToCol(shared_key_name);
                    
                    // Check if the column index was found properly
                    if (columnIndex === -1) {
                      console.error(`Column with the name '${shared_key_name}' not found.`);
                    } else {
                         // Listen for changes using the afterChange hook of Handsontable
                         hot.addHook('afterChange', (changes, source) => {
                            console.log('afterchange hook execute', changes, source)
                            // changes is a 2D array containing information about each change
                            // Each change is of the form [row, prop, oldVal, newVal]
                            if (changes && source !== 'loadData') { // Ignore initial load changes
                                changes.forEach(([row, prop, oldVal, newVal]) => {
                                console.log(prop, hot.propToCol(prop), columnIndex, shared_key_name, oldVal, newVal);
                                console.log(`Column '${shared_key_name}' changed at row ${row}`);
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
                function makeSharedKeyHandler(data_harmonizer, schema_tree_node) {
                    if (schema_tree_node.shared_keys.length > 0) {
                        schema_tree_node.shared_keys.forEach((shared_key_name) => {
                            const updateSchemaNodeChildrenCallback = (changes, source, old_value, new_value) => {
                                if (schema_tree_node.children.length > 0) {
                                    schema_tree_node.children.forEach(cls_key => {
                                        transformMultivaluedColumn(data_harmonizers[cls_key], shared_key_name, changes, source, old_value, new_value);
                                        // TODO
                                        // visitSchemaTree(schema_tree, (schema_tree_node) => {
                                        //     schema_tree_node.children.forEach(cls_key => {
                                        //         visitSchemaTree(schema_tree, () => transformMultivaluedColumn(data_harmonizers[cls_key], shared_key_name, changes, source, old_value, new_value), cls_key)
                                        //     })
                                        // }, cls_key);
                                    });

                                } else {
                                    console.log('no more iteration for', schema_tree_node.name);
                                }
                            };
                            attachColumnEditHandler(data_harmonizer, shared_key_name, updateSchemaNodeChildrenCallback);

                        });
                    }
                };
                
                // Two kinds of edits to be dealt with in 1-M:
                // - multiedit inside of a column
                // - propagating an edit when it occurs in one column but not another
                // - have this be handled at the event handler level? [minimal handler approach] [maximal handler approach]                
                /**
                 * Attaches propagation event handlers to all data harmonizers based on the schema tree.
                 * @param {Object} data_harmonizers - An object mapping class names to Data Harmonizer instances.
                 * @returns {Object} The same object with event handlers attached.
                 */
                function attachPropagationEventHandlersToDataHarmonizers(data_harmonizers, schema_tree) {

                    visitSchemaTree(schema_tree, (schema_tree_node) => {
                        // Propagation:
                        // - If has children with shared_keys, add handler
                        // - visit children -> lock field from being edited by user (DH methods can modify it)
                        if (schema_tree_node.children.length > 0) {
                            if (!schema_tree_node.tree_root) makeSharedKeyHandler(data_harmonizers[schema_tree_node.name], schema_tree_node)
                            schema_tree_node.children.forEach(child_node_key => {
                                if (!schema_tree_node.tree_root) lockColumnEdits(data_harmonizers[child_node_key], schema_tree_node.shared_column_key);
                            });
                        };
                    })
                    return data_harmonizers;
                };

                function initializeDataHarmonizers(data_harmonizers) {
                    console.log('data_harmonizers', data_harmonizers);
                    Object.entries(data_harmonizers).forEach(([cls_key,], index) => {
                        // new Toolbar(dhToolbarRoot, data_harmonizers[cls_key], menu, {
                        //     context: context,
                        //     templatePath: context.appConfig.template_path,  // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
                        //     releasesURL: 'https: // gi thub.com/cidgoh/pathogen-genomics-package/releases',
                        //     getLanguages: context.getLocaleData.bind(context),
                        //     getSchema: async (schema) => Template.create(schema).then(result => result.current.schema),
                        //     getExportFormats: context.getExportFormats.bind(context),
                        // });
                    });
                    console.log('before attachPropagationEventHandlersToDataHarmonizers');
                    attachPropagationEventHandlersToDataHarmonizers(data_harmonizers, schema_tree);
                    return data_harmonizers;
                };
                    
                console.log('before buildSchemaTree');
                const schema_tree = buildSchemaTree((await context.getSchema()));
                console.log('schema_tree', schema_tree);
                console.log('before makeDataHarmonizersFromSchemaTree');
                data_harmonizers = makeDataHarmonizersFromSchemaTree(
                    (await context.getSchema()),
                    schema_tree);
                // HACK
                delete data_harmonizers[undefined];
                console.log('before initializeDataHarmonizers');
                initializeDataHarmonizers(data_harmonizers);
                
            } else {
                console.log('branch 2');
                const dh = new DataHarmonizer(dhRoot, {
                  context: context,
                  loadingScreenRoot: document.querySelector('body'),
                  field_filters: []
                });                
                dhs.push(dh);

                // // TODO: data harmonizers require initialization code inside of the toolbar to fully render? wut
                new Toolbar(dhToolbarRoot, dhs[0], menu, {
                  context: context,
                  templatePath: context.appConfig.template_path,  // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
                  releasesURL: 'https://github.com/cidgoh/pathogen-genomics-package/releases',
                  getLanguages: context.getLocaleData.bind(context),
                  getSchema: async (schema) => Template.create(schema).then(result => result.current.schema),
                  getExportFormats: context.getExportFormats.bind(context),
                });  

            }

            new Footer(dhFooterRoot, dhs[0]);

            return context;

    })
    .then(async () => {
      return setTimeout(() => dhs.forEach(dh => dh.showColumnsByNames(dh.field_filters)), 1000);
    });
    
}

document.addEventListener('DOMContentLoaded', main);
