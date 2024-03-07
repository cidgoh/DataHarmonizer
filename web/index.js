import * as $ from 'jquery';
import 'bootstrap';

import i18n from 'i18next';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { wait } from '@/lib/utils/general';

import menu from '@/web/templates/menu.json';
import tags from 'language-tags';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

/**
 * Logging function used for debugging, it logs the supplied argument to the console.
 * @param {*} id - The item to be logged.
 * @returns {*} The same item passed in.
 */
const tap = id => { console.log(id); return id; };


let dhRoot = document.querySelector('#data-harmonizer-grid');
const dhTabNav = document.querySelector("#data-harmonizer-tabs");
const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');

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

    schema_tree = {};
    dhs = {};
    current_data_harmonizer_name = null;

    constructor(appConfig) {
        this.template = null;
        this.appConfig = appConfig;
    }

    setSchemaTree(schema_tree) {
        this.schema_tree = schema_tree;
    }

    setDataHarmonizers(data_harmonizers) {
        this.dhs = data_harmonizers;
        this.setCurrentDataHarmonizer(this.schema_tree['Container'].children[0]);
    }

    setCurrentDataHarmonizer(data_harmonizer_name) {
        console.log('set current data harmonizer', data_harmonizer_name)
        this.current_data_harmonizer_name = data_harmonizer_name;
    }

    getCurrentDataHarmonizer() {
      return this.dhs[this.current_data_harmonizer_name]
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

    clearContext() {
        this.schema_tree = {};
        this.dhs = {};
        this.current_data_harmonizer_name = null;
    }

    clearInterface() {
        dhTabNav.innerHTML = '';

        const pattern = "data-harmonizer-grid-";  // sub elements
        const matchingElements = document.querySelectorAll(`[id^="${pattern}"]`);

        // Loop through the NodeList and remove each element
        matchingElements.forEach(element => {
            element.parentNode.removeChild(element);
        });

        // dhFooterRoot.innerHTML = '';
        // dhToolbarRoot.innerHTML = '';
    }

    async setupDataHarmonizers({ template_path, schema_name, template_name, schema, exportFormats, schemaClass, columnCoordinates }) {

        // TODO refactor
        this.appConfig = new AppConfig(template_path);
        this.initializeTemplate(this.appConfig.template_path);

        this.clearInterface();
        this.clearContext();

        const _template = this.template;
        const [_template_name, _schema_name] = this.appConfig.template_path.split('/');
        const _export_formats = exportFormats || (await this.getExportFormats(_template_name));

        // const classes = (await this.getClasses()).reduce((acc, item) => Object.assign(acc, item), {});

        // attributes are the classes which feature 1-M relationshisps
        // to process these classes into DataHarmonizer tables, the following must be performed:
        // - Navigation: one tab per class = one data harmonizer per class
        // - Tables: filter the table by the slots featured in that class-slot pair alone/relative to a sheet.
        // - Propagation: there will be an event handler added between Data Harmonizers based on a shared domain.
        // - Loading: the system will expect an excel file with sheets or a database with tables for selection. the Toolbar must know.

        // the existence of a container class signifies a 1-M data loading setup with an ID join
        // if (classes['Container']) {

        //     /* e.g.

        //     const container = {
        //       "Container": {
        //         "name": "Container",
        //         "from_schema": "https://example.com/GRDI",
        //         "attributes": {
        //           "GRDI_Sample": {
        //             "name": "GRDI_Sample",
        //             "from_schema": "https://example.com/GRDI",
        //             "multivalued": true,
        //             "alias": "GRDI_samples",
        //             "owner": "Container",
        //             "domain_of": [
        //               "Container"
        //             ],
        //             "range": "GRDI_Sample",
        //             "inlined_as_list": true
        //           },
        //           "AMR_Test": {
        //             "name": "AMR_Test",
        //             "from_schema": "https://example.com/GRDI",
        //             "multivalued": true,
        //             "alias": "AMR_Tests",
        //             "owner": "Container",
        //             "domain_of": [
        //               "Container"
        //             ],
        //             "range": "AMR_Test",
        //             "inlined_as_list": true
        //           }
        //         },
        //         "tree_root": true
        //       }
        //     }
    
        //     const schema_tree = {
        //       "Container": { tree_root: true, children: ["AMR_Test", "GRDI_samples"] }
        //       "GRDI_Sample": { shared_key: ["sample_collector_sample_ID"], children: ["AMR_Test"] }  // TODO: should shared_key be shared between nodes on tree?
        //       "AMR_Test": { shared_key: ["sample_collector_sample_ID"], children: [] },
        //     }
    
        //     */
                
        // const schema = _template.current.schema; // (await this.getSchema())
        const schema_tree = buildSchemaTree(schema);
        this.setSchemaTree(schema_tree);
        data_harmonizers = makeDataHarmonizersFromSchemaTree(
            this,
            schema,
            schema_tree,
            _schema_name,
            _export_formats);
        // HACK
        delete data_harmonizers[undefined];
        this.setDataHarmonizers(data_harmonizers);
        attachPropagationEventHandlersToDataHarmonizers(data_harmonizers, schema_tree);

        return this;

    }

}

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
    return Object.keys(schema.classes[class_name].slot_usage);
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
    

    // TODO: extend to actually create the schema_tree object here for single class schemas
    if (!!!schema.classes["Container"]) {
        const class_names = Object.keys(schema.classes).filter(key => key !== 'dh_interface');
        return {
            "Container": {
                "tree_root": true,
                "children": [
                    // "GRDI_Sample",
                    // "AMR_Test"
                    ...class_names
                ]
            },
            // flat hierarchy of the classes that do exist, with a tab separated each.
            ...class_names.reduce((acc, key) => {
                return Object.assign(acc, {
                    [key]: {
                        name: key,
                        children: [],
                        shared_keys: []
                    }
                })
            }, {})
        };
    };

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
function makeDataHarmonizersFromSchemaTree(context, schema, schema_tree, schema_name, export_formats) {

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
    if (!!schema_tree) {
        Object.entries(schema_tree).filter(([cls_key,]) => cls_key !== 'Container').forEach((obj, index) => {
            if (obj.length > 0) {
                const [cls_key, spec] = obj;
                const dhId = `data-harmonizer-grid-${index}`;
                let dhSubroot = createDataHarmonizerContainer(dhId, index === 0);
                
                dhRoot.appendChild(dhSubroot); // Appending to the parent container
                
                const dhTab = createDataHarmonizerTab(dhId, spec.name, index === 0);
                dhTab.addEventListener('click', () => {
                    // set the current dataharmonizer tab in the context
                    context.setCurrentDataHarmonizer(spec.name);
                })
                dhTabNav.appendChild(dhTab); // Appending to the tab navigation
                
                console.log('findSlotNamesForClass', findSlotNamesForClass(schema, cls_key));

                data_harmonizers[spec.name] = new DataHarmonizer(dhSubroot, {
                    context: context,
                    class_assignment: cls_key,
                    loadingScreenRoot: document.body,
                    field_filters: findSlotNamesForClass(schema, cls_key) // TODO: Find slot names for filtering
                });

                data_harmonizers[spec.name].useSchema(schema, export_formats, schema_name);

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
 * Makes a column non-editable in a Handsontable instance based on a property key.
 * @param {object} dataHarmonizer - An object containing the Handsontable instance (`hot`).
 * @param {string} property - The column data property or header name.
 */
function makeColumnReadOnly(dataHarmonizer, shared_key_name) {

    const hot = dataHarmonizer.hot;
    // Get the index of the column based on the shared_key_name
    const colHeadersHTML = hot.getColHeader();
    const colHeadersText = colHeadersHTML.map(headerHTML => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHTML;
        return tempDiv.textContent || tempDiv.innerText || ""; 
        });
    const columnIndex = colHeadersText.indexOf(shared_key_name);
    
    // Check if the columnIndex is valid
    if (columnIndex >= 0 && columnIndex < hot.countCols()) {
        const currentColumns = hot.getSettings().columns ? hot.getSettings().columns.slice() : [];
        console.log(currentColumns);

        // Create a new column setting or update the existing one
        currentColumns[columnIndex] = {
            ...currentColumns[columnIndex],
            readOnly: true
        };

        hot.updateSettings({ columns: currentColumns });

    } else {
        console.error(`makeColumnReadOnly: Column not found for property: ${property}`);
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
    const colHeadersText = colHeadersHTML.map(headerHTML => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHTML;
        return tempDiv.textContent || tempDiv.innerText || ""; 
        });
    const columnIndex = colHeadersText.indexOf(shared_key_name);
    
    // Check if the column index was found properly
    if (columnIndex === -1) {
        console.error(`setupSharedColumn: Column with the name '${shared_key_name}' not found.`);
    } else {
            // Listen for changes using the afterChange hook of Handsontable
            hot.addHook('afterChange', (changes, source) => {
            console.log('setupSharedColumn: afterchange hook execute', changes, source)
            // changes is a 2D array containing information about each change
            // Each change is of the form [row, prop, oldVal, newVal]
            if (changes && source !== 'loadData') { // Ignore initial load changes
                changes.forEach(([row, prop, oldVal, newVal]) => {
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

    const makeUpdateHandler = (shared_key_spec) => {
        const updateSchemaNodeChildrenCallback = (changes, source, old_value, new_value) => {
            schema_tree_node.children.forEach(cls_key => {
                transformMultivaluedColumn(data_harmonizers[cls_key], shared_key_spec, changes, source, old_value, new_value);
                // TODO
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
        setupSharedColumn(data_harmonizer, shared_key_spec.name, makeUpdateHandler(shared_key_spec));
    });

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
            console.log('attachPropagationEventHandlersToDataHarmonizers', schema_tree_node)
            if (!schema_tree_node.tree_root) {
                makeSharedKeyHandler(data_harmonizers[schema_tree_node.name], schema_tree_node);
                schema_tree_node.children.forEach(child => {
                    schema_tree[child].shared_keys.forEach(shared_key_spec_child => {
                        makeColumnReadOnly(data_harmonizers[child], shared_key_spec_child.name);
                    });
                });
            } 
        };
    })
    return data_harmonizers;
};

// Make the top function asynchronous to allow for a data-loading/IO step?
const main = async function () {

    const context = new AppContext(new AppConfig(await getTemplatePath()));
    context.initializeTemplate(context.appConfig.template_path)
        .then(async (context) => {

            // // internationalize
            // // TODO: connect to locale of browser!
            // // Takes `lang` as argument (unused)
            // TODO move out of this function block
            initI18n(( /* lang */ ) => {
                $(document).localize();
                dhs.forEach(dh => dh.render());
            });
            context.addTranslationResources(context.template, context.getLocaleData());

            // await context.setupDataHarmonizers();

            // // TODO: data harmonizers require initialization code inside of the toolbar to fully render? wut
            new Toolbar(dhToolbarRoot, context.getCurrentDataHarmonizer(), menu, {
                context: context,
                templatePath: context.appConfig.template_path,  // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
                releasesURL: 'https://github.com/cidgoh/pathogen-genomics-package/releases',
                getLanguages: context.getLocaleData.bind(context),
                getSchema: async (schema) => Template.create(schema).then(result => result.current.schema),
                getExportFormats: context.getExportFormats.bind(context),
                });  
                
            new Footer(dhFooterRoot, context.getCurrentDataHarmonizer());

            return context;

    })
    .then(async () => {
      return setTimeout(() => dhs.forEach(dh => dh.showColumnsByNames(dh.field_filters)), 1000);
    });
    
}

document.addEventListener('DOMContentLoaded', main);
