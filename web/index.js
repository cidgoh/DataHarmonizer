import * as $ from 'jquery';
import 'bootstrap';

import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { tap } from '@/lib/utils/general';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';
import { AppContext, AppConfig, getTemplatePath } from './AppContext';

let dhRoot = document.querySelector('#data-harmonizer-grid');
export const dhTabNav = document.querySelector('#data-harmonizer-tabs');
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

/**
 * Finds the shared keys per class in a given schema.
 * @param {Object} schema - The schema object with structure containing "classes" and "slot_usage".
 * @returns {Object} An object mapping class names to an array of shared keys.
 */
function findSharedKeys(schema) {
  const class_names = new Set(
    Object.keys(schema.classes).filter((k) => k !== 'dh_interface' && k !== 'Container')
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
function findSlotNamesForClass(schema, class_name) {
  return Object.keys(schema.classes[class_name].slot_usage);
}

/**
 * Builds a schema tree from the given schema.
 * @param {Object} schema - The schema object containing "classes".
 * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.
 */
export function buildSchemaTree(schema) {
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
        .filter((range) => range !== class_key && typeof range !== 'undefined'), // TODO inefficient
    };
    return acc;
  }, tree_base);

  const schema_tree = updateChildrenAndSharedKeys(pre_schema_tree);
  return schema_tree;
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
 * Creates Data Harmonizers from the schema tree.
 * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
 * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
 */
export function makeDataHarmonizersFromSchemaTree(
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

            const dhTab = createDataHarmonizerTab(dhId, spec.name, index === 0);
            dhTab.addEventListener('click', () => {
              // set the current dataharmonizer tab in the context
              context.setCurrentDataHarmonizer(spec.name);

              $(document).trigger('dhCurrentChange', {
                data: spec.name,
              });
            });
            dhTabNav.appendChild(dhTab); // Appending to the tab navigation

            data_harmonizers[spec.name] = new DataHarmonizer(dhSubroot, {
              context: context,
              loadingScreenRoot: document.body,
              class_assignment: cls_key,
              field_filters: findSlotNamesForClass(schema, cls_key), // TODO: Find slot names for filtering
            });

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

// Two kinds of edits to be dealt with in 1-M:
// - multiedit inside of a column
// - propagating an edit when it occurs in one column but not another
// - have this be handled at the event handler level? [minimal handler approach] [maximal handler approach]
/**
 * Attaches propagation event handlers to all data harmonizers based on the schema tree.
 * @param {Object} data_harmonizers - An object mapping class names to Data Harmonizer instances.
 * @returns {Object} The same object with event handlers attached.
 */
export function attachPropagationEventHandlersToDataHarmonizers(
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
        ].shared_keys.filter((el) => el.related_concept === child_name)[0].name;

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

// Make the top function asynchronous to allow for a data-loading/IO step
const main = async function () {
  const context = new AppContext(new AppConfig(await getTemplatePath()));
  context
    .initializeTemplate(context.appConfig.template_path)
    .then(async (context) => {

      // // internationalize
      // // TODO: connect to locale of browser!
      // // Takes `lang` as argument (unused)
      initI18n((/* lang */) => {
        $(document).localize();
        Object.values(context.dhs).forEach((dh) => dh.render());
      });

      // // TODO: data harmonizers require initialization code inside of the toolbar to fully render? wut
      new Toolbar(dhToolbarRoot, context, {
        context,
        templatePath: context.appConfig.template_path, // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
        releasesURL:
          'https://github.com/cidgoh/pathogen-genomics-package/releases',
        getLanguages: context.getLocaleData.bind(context),
        getExportFormats: context.getExportFormats.bind(context),
        getSchema: async (schema) =>
          Template.create(schema).then((result) => result.current.schema),
      });

      new Footer(dhFooterRoot, context);

      return context;
    })
    .then(async (context) => {
      return setTimeout(
        () =>
          Object.values(context.dhs).forEach((dh) =>
            dh.showColumnsByNames(dh.field_filters)
          ),
        400
      );
    });
};

document.addEventListener('DOMContentLoaded', main);
