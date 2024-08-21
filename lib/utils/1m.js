
import * as $ from 'jquery';
import { looseMatchInObject } from '@/lib/utils/objects';
import { tap, isEmptyUnitVal } from '@/lib/utils/general';

const matchName = looseMatchInObject(['name']);

function getColumnIndexByFieldName(data_harmonizer, shared_slot_name) {
  // var headers = data_harmonizer.hot.getColHeader().map(stripDiv); // Get all column headers
  var fields = data_harmonizer.getFields();
  for (let i = 0; i < fields.length; i++) {
    if (matchName(fields[i])(shared_slot_name)) {
      return i;
    }
  }
  return -1; // Find the index of the header name
}

function getSharedKeyName(schemaTree, parentName, childName) {
    const sharedKey = schemaTree[parentName].shared_keys.find(
      (el) => el.related_concept === childName
    );
    return sharedKey ? sharedKey.name : null;
}

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
 * Makes a column non-editable in a Handsontable instance based on a property key.
 * @param {object} data_harmonizer - An object containing the Handsontable instance (`hot`).
 * @param {string} property - The column data property or header name.
 */
function makeColumnReadOnly(data_harmonizer, shared_key_name) {
  const hot = data_harmonizer.hot;
  const columnIndex = getColumnIndexByFieldName(data_harmonizer, shared_key_name);

  if (columnIndex >= 0 && columnIndex < hot.countCols()) {
    updateColumnSettings(hot, columnIndex, { readOnly: true });
  } else {
    console.error(`makeColumnReadOnly: Column not found for '${shared_key_name}'`);
  }
}

/**
 * Attaches a change event handler to a specific column within a Data Harmonizer instance.
 * @param {DataHarmonizer} data_harmonizer - The Data Harmonizer instance.
 * @param {string} shared_key_name - The name of the tabular column to monitor for changes.
 * @param {Function} callback - The callback function executed when the column data changes.
 */
function setupSharedColumn(
  data_harmonizer,
  shared_key_name,
  change_callback,
  contex_menu_callback,
  undo_redo_callback
) {
  const hot = data_harmonizer.hot;

  // Get the index of the column based on the shared_key_name
  const columnIndex = getColumnIndexByFieldName(
    data_harmonizer,
    shared_key_name
  );

  // Check if the column index was found properly
  if (columnIndex === -1) {
    console.error(
      `setupSharedColumn: Column with the name '${shared_key_name}' not found.`
    );
  } else {
    // Initialize the row data manager
    const rowDataManager = createRowDataManager(contex_menu_callback);

    // Add the beforeRemoveRow and afterRemoveRow hooks using addHook
    hot.addHook('beforeRemoveRow', rowDataManager.beforeRemoveRow);
    hot.addHook('afterRemoveRow', rowDataManager.afterRemoveRow);

    // Listen for changes using the afterChange hook of Handsontable
    hot.addHook('afterChange', (changes, source) => {
      // changes is a 2D array containing information about each change
      // Each change in the array changes is of the form: [row, prop/col, oldVal, newVal]
      if (changes && source !== 'loadData') {
        // Ignore initial load changes
        changes.forEach(([, , oldVal, newVal]) => {
          change_callback(changes, source, oldVal, newVal);
        });
      }
    });

    hot.addHook('afterUndo', function (action) {
      console.log('undo', action);
      undo_redo_callback('undo', action);
    });

    hot.addHook('afterRedo', function (action) {
      console.log('redo', action);
      undo_redo_callback('redo', action);
    });
  }
}

/**
 * Creates and attaches shared key handlers to a data harmonizer for a given schema tree node.
 * @param {DataHarmonizer} data_harmonizer - The data harmonizer instance to attach handlers to.
 * @param {Object} schema_tree_node - The schema tree node containing the shared keys and child references.
 * @param {Object} data_harmonizers - A collection of data harmonizer instances mapped by schema node classes.
 */
function makeSharedKeyHandler(
  data_harmonizers,
  data_harmonizer,
  schema_tree_node
) {
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

  const updateDataHarmonizer = (data_harmonizer, [, col, oldVal, newVal]) => {
    const hot = data_harmonizer.hot;

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
        const shouldDeleteChildRow =
          shouldModifyChild && isEmptyUnitVal(newVal);
        const shouldRemapChildCol =
          shouldModifyChild && !isEmptyUnitVal(newVal);

        // DEPRECATE
        // if (isEmptyUnitVal(oldChildVal) && !isEmptyUnitVal(newVal)) {
        //   console.log('should create');
        //   hot.setDataAtCell(rowIndex, col, newVal);
        //   return !CONTINUE_SIGNAL;
        // }

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
    hot.render();
  };

  const updateDataHarmonizerChildClasses = (children, changeData) => {
    children.forEach((cls_key) => {
      updateDataHarmonizer(data_harmonizers[cls_key], changeData);
    });
  };

  const createUpdateHandler = (/*shared_key_spec*/) => {
    return (changes, source) => {
      const [row, col, oldVal, newVal] = changes[0];
      if (source === 'edit') {
        updateDataHarmonizerChildClasses(schema_tree_node.children, [
          row,
          col,
          oldVal,
          newVal,
        ]);

        data_harmonizers[schema_tree_node.name].hot.selectCell(row, col);
        data_harmonizers[schema_tree_node.name].hot.runHooks(
          'afterSelection',
          row,
          col
        );
      }
    };
  };

  // TODO: handle the reversing of an action taken for undo/redo on a shared key
  const createUndoRedoHandler = (/* shared_key_spec */) => {
    // const { name: shared_key_name } = shared_key_spec;
    return (undoOrRedo, action) => {
      const hot = data_harmonizers[schema_tree_node.name].hot;
      const changes = action.changes;

      if (action.actionType === 'edit') {
        const [row, col, oldVal, newVal] = changes[0];

        if (undoOrRedo === 'undo') {
          // Propagate the undo action to related harmonizers
          updateDataHarmonizerChildClasses(schema_tree_node.children, [
            row,
            col,
            newVal, // In undo, revert to the old value
            oldVal, // Reapply the old value
          ]);
        } else if (undoOrRedo === 'redo') {
          // Propagate the redo action to related harmonizers
          updateDataHarmonizerChildClasses(schema_tree_node.children, [
            row,
            col,
            oldVal, // In redo, reapply the new value
            newVal, // Reapply the value that was undone
          ]);
        }
      } else if (['remove_row', 'insert_row'].includes(action.actionType)) {
        const rowIndex = action.index;

        if (undoOrRedo === 'undo') {
          if (action.actionType === 'remove_row') {
            hot.alter('insert_row', rowIndex);
          } else if (action.actionType === 'insert_row') {
            hot.alter('remove_row', rowIndex);
          }
        } else if (undoOrRedo === 'redo') {
          if (action.actionType === 'remove_row') {
            hot.alter('remove_row', rowIndex);
          } else if (action.actionType === 'insert_row') {
            hot.alter('insert_row', rowIndex);
          }
        }
        hot.render();
      }
    };
  };

  schema_tree_node.shared_keys.forEach((shared_key_spec) => {
    setupSharedColumn(
      data_harmonizer,
      shared_key_spec.name,
      createUpdateHandler(shared_key_spec),
      createContextMenuHandler(shared_key_spec),
      createUndoRedoHandler(shared_key_spec)
    );
  });
}

function propagateFilter(
  data_harmonizers,
  shared_key_name,
  schema_tree,
  child_name,
  valueToMatch = null
) {
  visitSchemaTree(
    schema_tree,
    (schema_tree_node) => {
      const hot = data_harmonizers[schema_tree_node.name].hot;
      const columnIndex = getColumnIndexByFieldName(
        data_harmonizers[schema_tree_node.name],
        shared_key_name
      );

      if (columnIndex === -1) {
        console.error(
          'propagateFilter: Column name not found',
          shared_key_name,
          schema_tree
        );
        return;
      }

      const plugin = hot.getPlugin('filters');
      // Add a condition where the column value equals the specified value
      plugin.clearConditions(columnIndex); // change valueToMatch per new selection in the column
      if (valueToMatch !== null) {
        plugin.addCondition(columnIndex, 'eq', [valueToMatch]);
      }
      plugin.filter();
    },
    child_name
  );
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

  // Utility to set column read-only
function updateColumnSettings(hot, columnIndex, options) {
    const currentColumns = hot.getSettings().columns || [];
    currentColumns[columnIndex] = { ...currentColumns[columnIndex], ...options };
    hot.updateSettings({ columns: currentColumns });
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
function makeColumnsReadOnly(
    data_harmonizers,
    schema_tree
  ) {
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

function bindSelectHandlerEvents(data_harmonizers, schema_tree) {
    Object.values(data_harmonizers).forEach((dh) => {

      dh.hot.addHook('afterSelection', (row, col) => {
        const valueToMatch = dh.hot.getDataAtCell(row, col);
        if (!isEmptyUnitVal(valueToMatch)) {
          // get value at cell
          // filter other data harmonizer at cell
          const parent_name = dh.class_assignment;
          schema_tree[parent_name].children.forEach((child_name) => {
            // filter for other data in data harmonizers matching the shared ID iff the selection is not empty
            // else return an empty list
            const shared_key_name = getSharedKeyName(schema_tree, parent_name, child_name);
            
            $(document).trigger('dhCurrentSelectionChange', {
              currentSelection: {
                source: dh.class_assignment,
                shared_key_name,
                valueToMatch,
                col,
              }
            });
  
            propagateFilter(
              data_harmonizers,
              shared_key_name,
              schema_tree,
              child_name,
              valueToMatch
            );
          });
        } else {
          schema_tree[dh.class_assignment].children.forEach((child_name) => {
            data_harmonizers[child_name].filterAll();
          });
        }
      });
  
      dh.hot.addHook('afterDeselect', () => {

        $(document).trigger('dhCurrentSelectionChange', {
          currentSelection: null
        });
        
        // get value at cell
        // filter other data harmonizer at cell
        const parent_name = dh.class_assignment;
        schema_tree[parent_name].children.forEach((child_name) => {
          const shared_key_name = getSharedKeyName(schema_tree, parent_name, child_name);
          propagateFilter(
            data_harmonizers,
            shared_key_name,
            schema_tree,
            child_name
          );
        });
      });
    });
  
    return data_harmonizers;
  }

// closure to keep track of row data before removal
const createRowDataManager = (contex_menu_callback) => {
  let rowDataBeforeRemoval = {};

  return {
      beforeRemoveRow: function (index, amount, physicalRows) {
      for (let i = 0; i < amount; i++) {
          let rowIndex = physicalRows[i];
          let rowData = hot.getDataAtRow(rowIndex);
          rowDataBeforeRemoval[rowIndex] = rowData; // Store the row data
      }
      },
      afterRemoveRow: function (index, amount, physicalRows, source) {
      for (let i = 0; i < amount; i++) {
          let rowIndex = physicalRows[i];
          let rowData = rowDataBeforeRemoval[rowIndex];
          // Custom logic using the rowData
          contex_menu_callback(rowData, source);
      }
      // Clear the temporary storage
      rowDataBeforeRemoval = {};
      },
  };
};

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

const createContextMenuHandler = (shared_key_spec) => {
  return (rowData, source) => {
    schema_tree_node.children.forEach((cls_key) => {
      const hot = data_harmonizers[cls_key].hot;

      const col = getColumnIndexByFieldName(
        data_harmonizers[cls_key],
        shared_key_spec.name
      );
      const colVal = rowData[col];

      console.log(rowData, source, col, colVal);

      hot.batch(() => {
        const CONTINUE_SIGNAL = true;
        const data = hot.getSourceData();
        data.every((childRow, rowIndex) => {
          if (source === 'ContextMenu.removeRow') {
            if (childRow[col] === colVal) {
              // TODO: revise to shared key name?
              clearRow(hot, rowIndex);
            }
          } else if (source === 'ContextMenu.insertRow') {
            modifyRow(hot, rowIndex, col, colVal);
            return !CONTINUE_SIGNAL;
          }
          return CONTINUE_SIGNAL;
        });
      });
      hot.render();
    });
  };
};

// const handleChange = (...args) => console.log(args);
const handleChange = (hot, [, col, oldVal, newVal]) => {

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
      const shouldDeleteChildRow =
        shouldModifyChild && isEmptyUnitVal(newVal);
      const shouldRemapChildCol =
        shouldModifyChild && !isEmptyUnitVal(newVal);

      // DEPRECATE
      // if (isEmptyUnitVal(oldChildVal) && !isEmptyUnitVal(newVal)) {
      //   console.log('should create');
      //   hot.setDataAtCell(rowIndex, col, newVal);
      //   return !CONTINUE_SIGNAL;
      // }

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

function parentBroadcastsCRUD(data_harmonizers, schema_tree) {
  // look for schema_tree
  Object.values(schema_tree).forEach(node => {
    if (!node.tree_root) {
      const propagatesChangesOnTheseKeys = node.shared_keys.filter(el => el.relation === 'child')
      const isParent = propagatesChangesOnTheseKeys.length > 0;
      if (isParent) {
        // broadcast CRUD
        // Create and dispatch a custom event
        propagatesChangesOnTheseKeys.forEach(shared_key => {
          // afterChange
          data_harmonizers[node.name].hot.addHook('afterChange', (changes, source) => {
            if (source === 'loadData') {
              return; // don't act on changes caused by loading data
            }
            if (changes) {
              changes.forEach(function([row, prop, oldValue, newValue]) {
                const event = new CustomEvent('handsontableUpdate', {
                  detail: { row, prop, oldValue, newValue, sourceTable: node.name, sharedKey: shared_key }
                });
                document.dispatchEvent(event);
              });
            }
          });
          // TODO: row insertion/deletion
          // Add the beforeRemoveRow and afterRemoveRow hooks using addHook
          // const rowDataManager = createRowDataManager(handleChange);
          // hot.addHook('beforeRemoveRow', rowDataManager.beforeRemoveRow);
          // hot.addHook('afterRemoveRow', rowDataManager.afterRemoveRow);

          // // TODO: undo/redo
          // hot.addHook('afterUndo', function (action) {
          //   console.log('undo', action);
          //   undo_redo_callback('undo', action);
          // });
      
          // hot.addHook('afterRedo', function (action) {
          //   console.log('redo', action);
          //   undo_redo_callback('redo', action);
          // });
          // // TODO: copy/paste

        })
      } else {
        console.warn('no parenthood defined', node.name);
      }
    }
  });
}

function childListensCRUD(data_harmonizers, schema_tree) {
  // look for schema_tree
  Object.values(schema_tree).forEach(node => {
    if (!node.tree_root) {
      const receivesEventsFrom = node.shared_keys.filter(el => el.relation === 'parent');
      const isChild = receivesEventsFrom.length > 0;
      if (isChild) {
        // listen for CRUD
        // afterChange
        // assign event to DH container?
        document.addEventListener('handsontableUpdate', function(event) {
          const { oldValue, newValue, sourceTable, sharedKey } = event.detail;
          const childCol = getColumnIndexByFieldName(data_harmonizers[node.name], sharedKey.name);
          if (receivesEventsFrom.flatMap(el => el.related_concept).includes(sourceTable)) {
            handleChange(data_harmonizers[node.name].hot, [, childCol, oldValue, newValue]);
          }
        });
        // TODO: row insertion/deletion
        // TODO: undo/redo
        // TODO: copy/paste
      } else {
        console.warn('no childhood defined', node.name);
      }
    }
  });
}

export const setup1M = (data_harmonizers, schema_tree) => {
  makeColumnsReadOnly(data_harmonizers, schema_tree);
  bindSelectHandlerEvents(data_harmonizers, schema_tree);
  parentBroadcastsCRUD(data_harmonizers, schema_tree);
  childListensCRUD(data_harmonizers, schema_tree);
}