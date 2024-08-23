import * as $ from 'jquery';
import { tap, isEmptyUnitVal } from '@/lib/utils/general';

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

// Utility to set column read-only
function updateColumnSettings(hot, columnIndex, options) {
  const currentColumns = hot.getSettings().columns || [];
  currentColumns[columnIndex] = { ...currentColumns[columnIndex], ...options };
  hot.updateSettings({ columns: currentColumns });
}

/**
 * Makes a column non-editable in a Handsontable instance based on a property key.
 * @param {object} data_harmonizer - An object containing the Handsontable instance (`hot`).
 * @param {string} property - The column data property or header name.
 */
function makeColumnReadOnly(data_harmonizer, shared_key_name) {
  const hot = data_harmonizer.hot;
  const columnIndex =
    data_harmonizer.getColumnIndexByFieldName(shared_key_name);

  if (columnIndex >= 0 && columnIndex < hot.countCols()) {
    updateColumnSettings(hot, columnIndex, { readOnly: true });
  } else {
    console.error(
      `makeColumnReadOnly: Column not found for '${shared_key_name}'`
    );
  }
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
function makeColumnsReadOnly(data_harmonizers, schema_tree) {
  visitSchemaTree(schema_tree, (schema_tree_node) => {
    // Propagation:
    // - If has children with shared_keys, add handler
    // - visit children -> lock field from being edited by user (DH methods can modify it)
    if (schema_tree_node.children.length > 0) {
      if (!schema_tree_node.tree_root) {
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

  // NOTE: preserve memory of selection between tabs! in DH? => using outsideClickDeselects: false,  // for maintaining selection between tabs
  return data_harmonizers;
}

// closure to keep track of row data before removal
const createRowDataManager = (hot, contextMenuCallback) => {
  let rowDataBeforeRemoval = {};
  let rowDataBeforeAdd = {};

  return {
    // Before removing a row
    beforeRemoveRow: function (index, amount, physicalRows) {
      for (let i = 0; i < amount; i++) {
        let rowIndex = physicalRows[i];
        let rowData = hot.getDataAtRow(rowIndex);
        rowDataBeforeRemoval[rowIndex] = rowData; // Store the row data
      }
    },

    // After removing a row
    afterRemoveRow: function (index, amount, physicalRows) {
      for (let i = 0; i < amount; i++) {
        let rowIndex = physicalRows[i];
        let rowData = rowDataBeforeRemoval[rowIndex];
        // Custom logic using the rowData
        contextMenuCallback(index, rowData, 'removeRow');
      }
      // Clear the temporary storage
      rowDataBeforeRemoval = {};
    },

    // Before adding a row
    beforeCreateRow: function (index, amount) {
      rowDataBeforeAdd = [];
      for (let i = 0; i < amount; i++) {
        let rowIndex = index + i;
        let rowData = hot.getDataAtRow(rowIndex);
        rowDataBeforeAdd.push(rowData); // Store the initial state before row is added
      }
    },

    // After adding a row
    afterCreateRow: function (index, amount) {
      for (let i = 0; i < amount; i++) {
        let rowIndex = index + i;
        let rowData = hot.getDataAtRow(rowIndex);
        // Custom logic using the rowData
        contextMenuCallback(index, rowData, 'insertRow');
      }
      // Clear the temporary storage
      rowDataBeforeAdd = {};
    },
  };
};

function dispatchHandsontableUpdate(detail) {
  const event = new CustomEvent('handsontableUpdate', { detail });
  document.dispatchEvent(event);
}

function reselect(dh, row, prop) {
  dh.hot.selectCell(row, prop);
  dh.hot.runHooks('afterSelection', row, prop);
}

function parentBroadcastsCRUD(data_harmonizers, schema_tree) {
  // look for schema_tree
  Object.values(schema_tree).forEach((node) => {
    if (!node.tree_root) {
      const propagatesChangesOnTheseKeys = node.shared_keys.filter(
        (el) => el.relation === 'child'
      );
      const isParent = propagatesChangesOnTheseKeys.length > 0;
      if (isParent) {
        // broadcast CRUD
        // Create and dispatch a custom event
        propagatesChangesOnTheseKeys.forEach((sharedKey) => {
          data_harmonizers[node.name].hot.addHook(
            'afterChange',
            (changes, source) => {
              if (source === 'loadData') return; // don't act on changes caused by loading data
              if (changes) {
                changes.forEach(function ([row, prop, oldValue, newValue]) {
                  dispatchHandsontableUpdate({
                    prop,
                    oldValue,
                    newValue,
                    sourceTable: node.name,
                    sharedKey,
                  });
                  // TODO: Follow up selections
                  // harmonizes behaviour between enter and clicks for enums
                  reselect(data_harmonizers[node.name], row + 1, prop);
                });
              }
            }
          );

          // TODO: row insertion/deletion
          // Add the beforeRemoveRow and afterRemoveRow hooks using addHook
          const rowDataManager = createRowDataManager(
            data_harmonizers[node.name].hot,
            (index, rowData, source) => {
              const prop = data_harmonizers[
                node.name
              ].getColumnIndexByFieldName(shared_key.name);
              switch (source) {
                case 'removeRow':
                  dispatchHandsontableUpdate({
                    prop,
                    oldValue: rowData[prop],
                    newValue: null,
                    sourceTable: node.name,
                    sharedKey: shared_key,
                  });
                  // TODO: get proper row and prop
                  break;
                // TODO: insert row case
                // case 'insertRow':
                //   dispatchHandsontableUpdate({})
                //   break;
                default:
              }
              reselect(data_harmonizers[node.name], index, prop);
            }
          );

          for (const hookName in rowDataManager) {
            data_harmonizers[node.name].hot.addHook(
              hookName,
              rowDataManager[hookName]
            );
          }

          /* TODO Undo/Redo
          const undoRedoManager = createUndoRedoManager(data_harmonizers[node.name].hot, (action) => {
            switch (action) {
              case 'undo':
                dispatchHandsontableUpdate({})
                break;
              case 'redo':
                dispatchHandsontableUpdate({})
                break;
              default:
            }
          });
          for (const hookName in undoRedoManager) {
            data_harmonizers[node.name].hot.addHook(
              hookName,
              undoRedoManager[hookName]
            );
          }
          */

          /* TODO: cut/copy/paste manager
          const cutCopyPasteManager = createCutCopyPasteManager(data_harmonizers[node.name].hot, (action) => {
            switch (action) {
              case 'cut':
                dispatchHandsontableUpdate({})
                break;
              case 'copy':
                dispatchHandsontableUpdate({})
                break;
              case 'paste':
                dispatchHandsontableUpdate({})
                break;
              default:
            }
          });
          for (const hookName in cutCopyPasteManager) {
            data_harmonizers[node.name].hot.addHook(
              hookName,
              cutCopyPasteManager[hookName]
            );
          }
          */
        });
      } else {
        console.warn('no parenthood defined', node.name);
      }
    }
  });
}

const modifyRow = (hot, rowIndex, col, newVal) => {
  // need to use setSourceDataAtCell rather than setDataAtCell, or else the 'physical' dataset isn't edited
  // when only modifying the 'non-physical' dataset (returned by getData), there were rows that were duplicated when modified
  hot.setSourceDataAtCell(rowIndex, col, newVal);
};

const clearRow = (hot, rowIndex) => {
  const colcount = hot.countCols();
  for (let c = 0; c < colcount; c++) {
    modifyRow(hot, rowIndex, c, null);
  }
};

const handleChange = (hot, [col, oldVal, newVal]) => {
  hot.batch(() => {
    const data = hot.getSourceData();
    data.every((childRow, rowIndex) => {
      const oldChildVal = childRow[col]; // TODO: revise to shared key name?
      const CONTINUE_SIGNAL = true;

      // modifications should only occur if there exists a non-empty parent val, the new val is different from the old child val,
      // and the old and new child vals are equivalent. This mean edits will happen in "blocks".
      const shouldModifyChild =
        oldChildVal === oldVal &&
        oldChildVal !== newVal &&
        !isEmptyUnitVal(oldVal);
      const shouldDeleteChildRow = shouldModifyChild && isEmptyUnitVal(newVal);
      const shouldRemapChildCol = shouldModifyChild && !isEmptyUnitVal(newVal);

      if (shouldDeleteChildRow) {
        console.log('should delete');
        clearRow(hot, rowIndex);
      }
      if (shouldRemapChildCol) {
        console.log('should remap');
        modifyRow(hot, rowIndex, col, newVal);
      }
      return CONTINUE_SIGNAL;
    });
  });
};

function childListensCRUD(data_harmonizers, schema_tree) {
  // look for schema_tree
  Object.values(schema_tree).forEach((node) => {
    if (!node.tree_root) {
      const receivesEventsFrom = node.shared_keys.filter(
        (el) => el.relation === 'parent'
      );
      const isChild = receivesEventsFrom.length > 0;
      if (isChild) {
        // listen for CRUD
        // afterChange
        // assign event to DH container?
        document.addEventListener('handsontableUpdate', function (event) {
          const { oldValue, newValue, sourceTable, sharedKey } = event.detail;
          if (
            receivesEventsFrom
              .flatMap((el) => el.related_concept)
              .includes(sourceTable)
          ) {
            const childCol = data_harmonizers[
              node.name
            ].getColumnIndexByFieldName(sharedKey.name);
            handleChange(data_harmonizers[node.name].hot, [
              childCol,
              oldValue,
              newValue,
            ]);
          }
        });
      } else {
        console.warn('no childhood defined', node.name);
      }
    }
  });
}

function bindSelectHandlerEvents(data_harmonizers, schema_tree) {
  Object.values(data_harmonizers).forEach((dh) => {
    dh.hot.addHook('afterSelection', (row) => {
      // TODO: generalize to all shared keys!
      const idValue = dh.hot.getDataAtCell(row, 0);
      if (!isEmptyUnitVal(idValue)) {
        const parent_name = dh.class_assignment;
        const child_keys = schema_tree[parent_name].shared_keys.filter(
          (el) => el.relation === 'child'
        );
        child_keys.forEach((child_key) => {
          const shared_key_name = child_key.name;
          const target_child_table = child_key.related_concept;
          const shared_key_column =
            dh.getColumnIndexByFieldName(shared_key_name);
          const valueToMatch = dh.hot.getDataAtCell(row, shared_key_column);

          if (!isEmptyUnitVal(valueToMatch)) {
            $(document).trigger('dhCurrentSelectionChange', {
              currentSelection: {
                source: dh.class_assignment,
                shared_key_name,
                valueToMatch,
                parentCol: shared_key_column,
              },
            });

            const child_dh = data_harmonizers[target_child_table];
            const child_shared_key_column =
              child_dh.getColumnIndexByFieldName(shared_key_name);

            // Add a condition where the column value equals the specified value
            const plugin = child_dh.hot.getPlugin('filters');
            plugin.clearConditions(child_shared_key_column);
            if (valueToMatch !== null) {
              plugin.addCondition(child_shared_key_column, 'eq', [
                valueToMatch,
              ]);
            }
            plugin.filter();
          }
        });
      } else {
        // empty row selection
        $(document).trigger('dhCurrentSelectionChange', {
          currentSelection: null,
        });
        schema_tree[dh.class_assignment].children.forEach((child_name) => {
          data_harmonizers[child_name].filterAll();
        });
      }
    });

    dh.hot.addHook('afterDeselect', () => {
      $(document).trigger('dhCurrentSelectionChange', {
        currentSelection: null,
      });
      schema_tree[dh.class_assignment].children.forEach((child_name) => {
        data_harmonizers[child_name].filterAll();
      });
    });
  });

  return data_harmonizers;
}

/**
 * Builds a schema tree from the given schema.
 * @param {Object} schema - The schema object containing "classes".
 * @returns {Object|null} The schema tree object, or null if no "Container" classes are found.
 */
export function buildSchemaTree(schema) {
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

export const setup1M = (data_harmonizers, schema_tree) => {
  makeColumnsReadOnly(data_harmonizers, schema_tree);
  parentBroadcastsCRUD(data_harmonizers, schema_tree);
  childListensCRUD(data_harmonizers, schema_tree);
  bindSelectHandlerEvents(data_harmonizers, schema_tree);
};
