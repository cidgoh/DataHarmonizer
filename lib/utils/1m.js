import * as $ from 'jquery';
import { takeKeys } from './objects';
import { numberInRange, isEmptyUnitVal } from './general';

const DEBUG = false;

/* 

Object or Attribute

| **Type**              | **Description**                                                                                                                                              |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `appContext`          | `dictionary`       | Holds a dictionary of all classes mentioned in a schema by name.                                                                        |
| `className`           | `{ key: object }`  | Entry in the `appContext` dictionary holds details needed to identify state changes on Class (tab DH instance) key slot(s).             |
| `name`                | `className string` | Self-referential.                                                                                                                       |
| `row`                 | `integer`          | Row of hot data currently selected, if applicable; may not be important. Represents the row the user currently has selected.            |
|                       |                    | Multi-row/column select doesn’t apply here.                                                                                             |
| `column`              | `integer`          | Column of hot data cell currently selected, if applicable; may not be important.                                                        |
| `unique_keys`         | `dictionary`       | Dictionary of single and multiple key slots.                                                                                            |

`keyName` Object

| **Type**              | **Description**                                                                                                                                              |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`                 | `object`           | Entry in the `unique_keys` dictionary. This name either repeats a slot name if that slot is an identifier used as a primary key in a    |
|                       |                    | primary/foreign key relationship, or it is a new name not confused with any of a class’s slot names.                                    |
| `description`         | `string`           | Description of key usage.                                                                                                               |
| `unique_key_slots`    | `list`             | List array of key slots by name.                                                                                                        |
| `key_indexes`         | `list`             | Index of each key slot in Class.                                                                                                        |
| `key_values`          | `list`             | Holds new value of each key slot. Some values of a multi-slot key may remain the same.                                                  |
| `key_old_values`      | `list`             | Holds previous value of each key slot.                                                                                                  |
| `foreign_key`         | `boolean`          | Signals that this is a foreign key linked to another Class’s primary key.                                                               |
| `foreign_key_class`   | `className string` | Class this table listens to. (Assume just one for now, though possibly some tables have a few outer joins). That class can be queried for what |
|                       |                    | its primary key indexes are.                                                                                                            |
| `active`              | `boolean`          | A tab is active in the toolbar when it has no foreign key, or the `foreign_key_class` / tab it has is active (by which key this table can       |
|                       |                    | create new records).                                                                                                                     |
| `child_classes`       | `list: string`     | a list of the children that this class is connected to                                                                                   |

*/

// TODO
// user prompt
// - undo
// - DONE distinguish between primary key deletion on duplicate vs deleting lone primary key
//   - DONE see `isSharedKeyNameDuplicatedInCells`
// - change of primary key
//   - final primary key deleted -> propagate deletion
// - DONE ACTION.DELETE dispatch even if logic is shared

const SchemaClassesList = (schema) => {
  return Object.keys(schema.classes).filter(
    (key) => !['dh_interface', 'Container'].includes(key)
  );
}

const SchemaClasses = (schema) =>
  takeKeys(SchemaClassesList(schema))(schema.classes);

const uniqueKeysInIndexRange =
  (appContext, cls_key, minIndex, maxIndex) => {
    const cls_unique_keys = appContext[cls_key].unique_keys;
    const unique_keys_in_selection = Object.keys(cls_unique_keys).filter(
      (ukey) =>
        cls_unique_keys[ukey].key_indexes.some(
          numberInRange([minIndex, maxIndex])
        )
    );
    return unique_keys_in_selection;
  };

const relevantUniqueKeys = (appContext, cls_key, unique_key_names) => {
  const only_relevant_unique_keys = takeKeys(unique_key_names)(
    appContext[cls_key].unique_keys
  );
  return only_relevant_unique_keys;
};

// const slotIsInAUniqueKey = (schema) => (cls_key) => (slot_name) => {
//   const unique_keys = schema.classes[cls_key].attributes.unique_keys;
//   let predicate_array = [];
//   for (let unique_key_name in unique_keys) {
//     predicate_array.push(
//       unique_keys[unique_key_name].unique_key_slots.includes(slot_name)
//     );
//   }
//   return predicate_array.some((id) => id);
// };

const slotIsForeignKey = (schema, slot_spec) =>
  Object.keys(schema.classes).includes(slot_spec.range);

const findForeignKeySlotsToMap = (schema) =>
  SchemaClassesList(schema).reduce((acc, cls_key) => {
    acc[cls_key] = [];
    for (let slot_name in schema.classes[cls_key].attributes) {
      const slot = schema.classes[cls_key].attributes[slot_name];
      if (slotIsForeignKey(schema, slot)) {
        acc[cls_key][slot_name] = slot.range;
      }
    }
    return acc;
  }, {});

const calculateKeyIndex = (schema) => (cls_key) => (slot_name) => {
  try {
    return schema.classes[cls_key].slot_usage[slot_name].rank - 1;
  } catch (e) {
    throw Error(`Can't calculate Key Index for Slot ${slot_name} : ${e}`);
  }
};

const findUniqueKeysForClass = (schema, cls_key) => {
  let unique_keys_acc = {};
  const sc = SchemaClasses(schema);

  const foreignKeySlotsPerClassMap = findForeignKeySlotsToMap(schema);
  const slots = sc[cls_key].attributes;


  // TODO: are these cases mutually exclusive?
  // case 1: slot is an identifier
  for (let slot_name in slots) {
    let unique_key = {};
    const slot = slots[slot_name];

    if (slot?.identifier && slot_name !== 'unique_keys') {
      const unique_key_name = slot_name;
      unique_key.name = unique_key_name;
      unique_key.description = slot?.description;
      unique_key.foreign_key = slot.name in foreignKeySlotsPerClassMap[cls_key];
      if ('annotations' in slot && 'foreign_key' in slot.annotations) {
        // console.warn(cls_key + ' has foreign key annotations: ' + slot.annotations.foreign_key.value);
        const [cls_name, slot_name] = slot.annotations.foreign_key.value.split('.');
        unique_key.foreign_key_class = cls_name;
        unique_key.foreign_key_slot = slot_name;
      } else if (unique_key.foreign_key) {
          unique_key.foreign_key_class =
            foreignKeySlotsPerClassMap[cls_key][slot_name];
          // assume current slot name as default
          unique_key.foreign_key_slot = slot_name;
      }
      unique_key.unique_key_slots = [slot_name];
      unique_key.key_indexes = [calculateKeyIndex(schema)(cls_key)(slot_name)];
      unique_key.key_values = [];
      unique_key.key_old_values = [];
      unique_keys_acc[unique_key_name] = unique_key;
    }

  }

  // case 2: unique_keys field exists in class
  if ('unique_keys' in sc[cls_key]) {
    const unique_keys = sc[cls_key].unique_keys;
    for (let unique_key_name in unique_keys) {
      let unique_key = {};
      unique_key.name = unique_key_name;
      unique_key.description = unique_keys[unique_key_name]?.description;
      unique_key.unique_key_slots =
        unique_keys[unique_key_name].unique_key_slots;
      // TODO: how are unique keys identified to a foreign key?
      unique_key.foreign_key =
        unique_key_name in foreignKeySlotsPerClassMap[cls_key];
      // TODO: default value. undefined for now
      if (unique_key.foreign_key) {
        unique_key.foreign_key_class =
          foreignKeySlotsPerClassMap[cls_key][unique_key_name];
        // assume current slot name as default
        unique_key.foreign_key_slot = slot_name;
      }
      unique_key.key_indexes = unique_keys[
        unique_key_name
      ].unique_key_slots.map(calculateKeyIndex(schema)(cls_key));
      unique_key.key_values = [];
      unique_key.key_old_values = [];
      unique_keys_acc[unique_key_name] = unique_key;

    }
  }

  return unique_keys_acc;
};

const findActiveDataHarmonizer = (appContext) => {
  // active = focused
  let active_dh = null;
  for (let dh_name in appContext) {
    if (appContext[dh_name].active) {
      active_dh = dh_name;
      break;
    }
  }
  return active_dh;
};

const setActiveDataHarmonizer = (appContext, active_dh_name) => {
  for (let dh_name in appContext) {
    appContext[dh_name].active = false;
  }
  appContext[active_dh_name].active = true;
};

const addChildClassesToUniqueKeysForAppContext = (appContext) => {
  for (let dh_class_name in appContext) {
    for (let key in appContext[dh_class_name].unique_keys) {
      // foreign_key_class will be in class.unique_keys when foreign_key is true
      if ('foreign_key_class' in appContext[dh_class_name].unique_keys[key]) {
        const fkc =  appContext[dh_class_name].unique_keys[key].foreign_key_class;
        // check if the unique key is shared between the foreign key class and the current class
        if (key in appContext[fkc].unique_keys) {
          if (!('child_classes' in appContext[fkc].unique_keys[key])) {
            appContext[fkc].unique_keys[key].child_classes = [];
          }
          appContext[fkc].unique_keys[key].child_classes.push(dh_class_name);
        }
      }
    }
  }
};

export function buildAppContext(schema) {
  const InitialAppContextObject = {
    appContext: {},
  };

  SchemaClassesList(schema).forEach((cls_key, i) => {
    let dh_class = {};
    dh_class.name = schema.classes[cls_key].name;
    dh_class.row = 0;
    dh_class.column = -1;
    dh_class.unique_keys = findUniqueKeysForClass(schema, cls_key);
    dh_class.active = i === 0; // first schema is active by default
    InitialAppContextObject.appContext[cls_key] = dh_class;
  });

  // separate method, since it requires all dh_classes to be computed first
  addChildClassesToUniqueKeysForAppContext(
    InitialAppContextObject.appContext
  );

  return InitialAppContextObject;
}

/* 
The simplest way for a cascading CRUD system to work with respect to a user interface that shows tabs for each of a number of top level and subordinate tables is to have actions performed on any class/table/tab’s row’s primary key - if any, and there can be more than one.  
More than one case means separate CRUD events need to be triggered for each combo.  
*/

const ACTION = Object.freeze({
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  FILTER: 'FILTER',
  VALIDATE: 'VALIDATE',
  SELECT: 'SELECT',
});

/* Initialization
On load of a schema the appContext object is filled in, and event triggers are created for cell/row selection and classRowKeyChange event generation and listeners.
 */

// Example:
// import grdi_json from '@/web/templates/grdi/schema.json';
// import schema_editor_json from '@/web/templates/schema_editor/schema.json';
// const AppContext = buildAppContext(grdi_json);
// const AppContext2 = buildAppContext(schema_editor_json);

/* Event Workflow */

const bindReadEmitter = (appContext, dh) => {
  dh.hot.addHook('afterSelection', (row, column, row2, column2) => {
    // Determine if the selection spans multiple rows
    const multiRowSelected = row !== row2;

    if (multiRowSelected) {
      /* 1.a: Multi-row select exception 
      If a user has marked out a multi row selection in parent table, this should trigger a table key = empty Read event.  
      Then child table listening to this should respond to this as being a filter to hide all records since no particular primary key can be responded to. 

      Later we can add an efficiency function that the filtering of records isn’t performed on a subordinate table until the user actually highlights the subordinate table’s tab such that they can see the data.  But initially we don’t need that fancy just-in-time thing.
      */
      console.log(
        `Multi-row selection detected from row ${row} to ${row2}. Emitting empty Read event.`
      );

      // Emit an empty "Read" event to indicate no specific key selection
      dispatchHandsontableUpdate2({
        action: ACTION.READ,
        emitted_by: dh.class_assignment,
        row,
        row2,
        column,
        column2,
        key_name: null, // No specific key due to multi-row selection
        key_values: null, // No key values to filter by
      });
    } else {
      /* 1: Cell/row selection
      If a user clicks on any part of a tab / table row, if that table has one or more primary keys, they yield primary key events that all subordinate tables/classes can listen to. 
      This is the “Read” event.
      */

      // Single-row selection handling
      const [min, max] = [column, column2]; // Determine the column range of the selection

      // Identify unique keys that may be affected by this selection
      const maybe_unique_keys = uniqueKeysInIndexRange(appContext, 
        dh.class_assignment
      , min, max);

      console.info(
        `there are n=${maybe_unique_keys.length} keys in range: ${maybe_unique_keys}`
      );
      if (maybe_unique_keys.length > 0) {
        // If there are any unique keys within the selected column range, emit "Read" events
        // TODO: one at a time vs reading several
        for (let key_name of maybe_unique_keys) {
          dispatchHandsontableUpdate2({
            action: ACTION.READ,
            emitted_by: dh.class_assignment,
            target: dh.class_assignment,
            key_name,
            row,
            column,
            key_values:
              appContext[dh.class_assignment].unique_keys[key_name].key_values, // Send the key values to filter by
          });
        }
      }
    }
  });
};

/* 2: Primary key change validation
When a user makes a change to an existing primary key, the relevant single or multiple slot key(s) must be processed for validation to ensure it is not colliding / duplicating with existing entries in the primary key table’s (class’s) data. 
If there is a collision, we have to have handsontable undo the changes and stop event trickle-down. The trick from a UI perspective is to enable editing of parts of a multicomponent key 
*/

/* 2.a: 
The UI challenge here is editing a multi-component key cell by cell without triggering primary key events until editing has finished on all parts of the key.  We have to trigger validation of the primary key change after a user shifts focus away - either to another row, or another interface tab, rather than away from an edited key part cell; 
*/

function createRowFocusTracker(dh, onFocusChange) {
  const hotInstance = dh.hot;
  let lastFocusedRow = null; // Store the last focused row

  // Hook to track when a new row is selected
  function onAfterSelection(row /*column, row2, column2*/) {
    if (lastFocusedRow !== row) {
      const previousRow = lastFocusedRow;
      lastFocusedRow = row;
      // Call the provided callback with the previous and current rows
      onFocusChange(previousRow, lastFocusedRow);
    }
  }

  // Hook to track when no cells are selected (row unfocused)
  function onAfterDeselect() {
    if (lastFocusedRow !== null) {
      const previousRow = lastFocusedRow;
      lastFocusedRow = null;

      // Call the provided callback with the previous row and null for current (indicating no row is focused)
      onFocusChange(previousRow, null);
    }
  }

  // Hook to track keyboard navigation (optional)
  function onBeforeKeyDown(/* event */) {
    const selected = hotInstance.getSelectedLast();
    if (selected) {
      const [row] = selected;
      if (lastFocusedRow !== row) {
        const previousRow = lastFocusedRow;
        lastFocusedRow = row;

        // Call the provided callback with the previous and current rows
        onFocusChange(previousRow, lastFocusedRow);
      }
    }
  }

  // Attach the hooks to the Handsontable instance
  hotInstance.addHook('afterSelection', onAfterSelection);
  hotInstance.addHook('afterDeselect', onAfterDeselect);
  hotInstance.addHook('beforeKeyDown', onBeforeKeyDown);

  // Return an object to manage the tracker
  return {
    getLastFocusedRow: function () {
      return lastFocusedRow;
    },
    clearFocusTracking: function () {
      hotInstance.removeHook('afterSelection', onAfterSelection);
      hotInstance.removeHook('afterDeselect', onAfterDeselect);
      hotInstance.removeHook('beforeKeyDown', onBeforeKeyDown);
    },
  };
}

/* 2.b:
We have to undo the row change in case of some collision with an existing key value.

This work can be put off until phase 2 handling of multi-component keys.
*/

function getNonEmptyColumnValues(hotInstance, columnIndex) {
  const totalRows = hotInstance.countRows(); // Get the total number of rows
  let columnValues = [];

  for (let row = 0; row < totalRows; row++) {
    let cellValue = hotInstance.getDataAtCell(row, columnIndex); // Get the value at a specific cell (row, column)
    if (!isEmptyUnitVal(cellValue)) columnValues.push(cellValue);
  }

  return columnValues; // Returns an array of all the values in the column
}

function hasDuplicates(array) {
  const uniqueValues = new Set(array);
  return uniqueValues.size !== array.length;
}

const cellsInColumnUnique = (dh, shared_key_name, filter_value = null) => {
  const columnIndex = dh.getColumnIndexByFieldName(shared_key_name);
  const columnValues = getNonEmptyColumnValues(dh.hot, columnIndex);
  if (filter_value !== null) columnValues.filter(el => el === filter_value);
  return hasDuplicates(columnValues);
}

const bindKeyConstraintValidation = (appContext, dh) => {
  dh.hot.addHook('afterChange', (changes, source) => {
    console.warn('afterChange', changes, source);
    if (source === 'loadData') return; // Skip changes when data is loaded initially
    if (changes) {
      const rowChanges = changesToRows(changes); // Convert changes to a row-wise structure
      // Iterate over each row that had changes
      for (let row in rowChanges) {
        const changedCols = Object.keys(rowChanges[row].newValues); // Get changed columns for the row
        // Get unique keys that might be affected by these column changes
        const minIndex = Math.min(...changedCols);
        const maxIndex = Math.max(...changedCols);
        const maybeUniqueKeys = uniqueKeysInIndexRange(appContext, dh.class_assignment, minIndex, maxIndex);
        for (let keyName of maybeUniqueKeys) {
          if (cellsInColumnUnique(dh, keyName)) {
            // Undoing
            dh.hot.undo();
          }
        }
      }
    }
  });
};

/* 3: Primary key change event
Once a primary key change has been validated, a “classDataRowKeyChange” event can be triggered, which includes a reference to the above appContext class, by name or object.  
We can also precompute once-and-for-all the action based on logic of processing the old and new values.

Primary key table triggering event (may be on more than one unique key):

Event: (classDataRowKeyChange, className, keyName, action)
*/

function dispatchHandsontableUpdate(action, detail) {
  const _detail = { ...detail, action };
  const event = new CustomEvent('classDataRowKeyChange', {
    action,
    detail: _detail,
  });
  document.dispatchEvent(event);
}

const bindActionHandler = (appContext, dh) => {
  // namespace the listener event
  dh.hot.addHook(
    `classDataRowKeyChange:${dh.class_assignment}`,
    (action, details) => {
      handleAction(appContext, dh, action, details);
    }
  );
};

const runHook = (dh, action, details) => {
  dh.hot.runHooks(
    `classDataRowKeyChange:${dh.class_assignment}`,
    action,
    details
  );
};

const destroyHandsontableUpdateRouter = () => {
  // document.removeEventListener('classDataRowKeyChange');
};

const changesToRows = (changes) => {
  const emptyToNull = (val) => (val === '' ? null : val);

  // Initialize an object to hold row-wise changes
  const rowWiseChanges = {};
  changes.forEach(([row, column, oldValue, newValue]) => {
    // Check if there is a change (oldValue is different from newValue)
    if (oldValue !== newValue) {
      // If the row is not yet in the object, initialize it
      if (!rowWiseChanges[row]) {
        rowWiseChanges[row] = {
          oldValues: {},
          newValues: {},
        };
      }

      // Store the old and new values by column index
      rowWiseChanges[row].oldValues[column] = emptyToNull(oldValue);
      rowWiseChanges[row].newValues[column] = emptyToNull(newValue);
    }
  });
  return rowWiseChanges;
};

const bindChangeEmitter = (appContext, dh) => {
  dh.hot.addHook('afterChange', (changes, source) => {
    if (source === 'loadData') return;
    else if (source === 'edit' && changes) {
      // Array to store indices of changed cells
      const changed_cols = [];
      changes.forEach(([row, column, old_value, new_value]) => {
        // Check if there is a change (oldValue is different from newValue)
        if (old_value !== new_value) {
          // Add the changed cell indices to the array
          changed_cols.push(column);

          console.log(
            `Change detected at row ${row + 1}, column ${column + 1}:`
          );
          console.log(`Old Value: ${old_value}, New Value: ${new_value}`);
        }
      });

      const minColumn = Math.min(changed_cols);
      const maxColumn = Math.max(changed_cols);

      // TODO: key in unique_keys?
      const [min, max] = [minColumn, maxColumn];
      const maybe_unique_keys_in_range = uniqueKeysInIndexRange(appContext, dh.class_assignment, min, max);

      if (maybe_unique_keys_in_range.length > 0) {

        const unique_keys_in_scope = relevantUniqueKeys(appContext, dh.class_assignment, maybe_unique_keys_in_range);

        for (let key_name in unique_keys_in_scope) {
          const column_index = unique_keys_in_scope[key_name].key_indexes;
          const row_changes = changesToRows(changes);
          for (let row in row_changes) {
            // dispatch action based on changes

            // Dispatch a DELETE action if the value the new value is an empty unit value
            const updateActionType = 
            Object.values(
              row_changes[row].newValues
            ).map(isEmptyUnitVal).includes(true) ? 
                ACTION.DELETE 
              : ACTION.UPDATE;

            // TODO: modal continuation interface
            const currentValue = row_changes[row].oldValues[column_index];
            
            // console.warn('row_changes', row_changes, 
            //             'column_index', column_index, 
            //             row_changes[row].oldValues, 
            //             row_changes[row].newValues);

            // propagate deletion when the deleted cell was unique of its kind
            // always propagate updates
            const propagates = updateActionType === ACTION.DELETE ? 
                // if deletion is triggering, the current non empty column values should still be one down from the original value
                // NOTE: if this is problematic, need to replace *all* handsontable with CRUD
                getNonEmptyColumnValues(dh.hot, column_index).filter(el => el === currentValue).length === 0
              : true;

            // console.warn(
            //   updateActionType, 
            //   currentValue,
            //   futureValue, 
            //   getNonEmptyColumnValues(dh.hot, column_index),
            //   getNonEmptyColumnValues(dh.hot, column_index).filter(el => el === currentValue).length === 0, 
            //   propagates);

            const details = {
              emitted_by: dh.class_assignment,
              target: dh.class_assignment,
              row,
              key_name,
              key_old_values: takeKeys(column_index)(
                row_changes[row].oldValues
              ),
              key_new_values: takeKeys(column_index)(
                row_changes[row].newValues
              ),
              old_changes: row_changes[row].oldValues,
              new_changes: row_changes[row].newValues,
              row_changes,
              propagates
            };

            if (propagates) {
              // warn about deletion if it's the final key 
              if (updateActionType === ACTION.DELETE) {
                console.warn("PROPAGATION:", "Row collections with key will be deleted", details);
              }

              // // warn if update will cause a duplicate that merges entries in child tables which share that same key
              if (updateActionType === ACTION.UPDATE && getNonEmptyColumnValues(dh.hot, column_index).filter(el => el === currentValue).length + 1 > 1) {
                console.warn("PROPAGATION:", "Row collections will merge with existing those of existing key value", details);
              }
            }

            dispatchHandsontableUpdate(updateActionType, details);

            if (findActiveDataHarmonizer(appContext) === details.emitted_by) {
              dispatchHandsontableUpdate(ACTION.SELECT, details);
            }
          }
        }
      }
    }
  });
};

/* 4: Foreign key table listener
A listening table event handler triggers, based on an event on one of its foreign key slots. Importantly, it must 
throw the same event as it detected, as though its own primary key had changed.  This enables trickle-down effects.

Table with foreign key listen event to the same:

Event: (classDataRowKeyChange, className, keyName, action)

Where action can be create, read, update, delete.  
Details can be fetched by listener via appContext[className].unique_keys[keyName] .  Also appContext[class][“active”] flag can be updated accordingly.
*/

// NOTE: Handsontable doesn't have a arbitrary listeners like the DOM. Hooks are fired through methods on individual tables.
// We emulate a listener by using a router instead.

// if a unique key has a hook
// the events fire on the child, setting source and target to be the same
const dispatchChildHooks = (unique_key, action, details) => {
  if ('child_classes' in unique_key) {
    for (let child_class of unique_key.child_classes) {
      dispatchHandsontableUpdate(action, {
        ...details,
        target: child_class,
      });
    }
  }
};

const handsontableUpdateRouter = (appContext, dhs) => {
  document.addEventListener('classDataRowKeyChange', (event) => {
    const { emitted_by, target, key_name, action, propagates = true } = event.detail;

    // The class can fire when it has unique keys
    const classCanFire =
      emitted_by in appContext &&
      key_name in appContext[emitted_by].unique_keys;
    const unique_key = appContext[emitted_by]?.unique_keys[key_name];

    if (classCanFire) {
      routeAction(action, emitted_by, target, dhs, event, appContext, propagates, unique_key);
    }

  });
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

const updateRows = (dh, [col, oldVal, newVal]) => {
  const hot = dh.hot;

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
        // console.info(
        //   'should delete',
        //   dh.class_assignment,
        //   rowIndex,
        //   hot.getDataAtRow(rowIndex)
        // );
        clearRow(hot, rowIndex);
        console.info(hot.getDataAtRow(rowIndex));
      }
      if (shouldRemapChildCol) {
        // console.info('should remap');
        modifyRow(hot, rowIndex, col, newVal);
      }
      return CONTINUE_SIGNAL;
    });
  });
};

const handleAction = (appContext, dh, action, details) => {
  const {
    emitted_by,
    key_name,
    old_changes,
    new_changes,
    row_changes,
    row,
    column,
    target,
    currentSelection,
  } = details;
  const shared_key_details = appContext[emitted_by].unique_keys[key_name];
  if (!shared_key_details) {
    console.error(`Key details not found for ${key_name} in ${emitted_by}.`);
    return;
  }
  // Use Handsontable's batch operation to group multiple changes
  console.info(
    action,
    emitted_by,
    '->',
    target,
    old_changes,
    new_changes,
    currentSelection,
    row, column
  );
  switch (action) {
    case ACTION.CREATE:
      break;
    case ACTION.READ:
      if (row !== appContext[target].row && !isEmptyUnitVal(row)) {
        appContext[target].row = row;
      }
      if (column !== appContext[target].column && !isEmptyUnitVal(column)) {
        appContext[target].column = column;
      }
      setActiveDataHarmonizer(appContext, target);
      break;
    case ACTION.FILTER:
      // TODO: generalize to multi-key
      dh.hideMatchingRows(
        dh.getColumnIndexByFieldName(key_name),
        currentSelection.valueToMatch
      );
      break;
    case ACTION.UPDATE:
    case ACTION.DELETE:
      appContext[emitted_by].unique_keys[key_name].key_old_values = old_changes;
      appContext[emitted_by].unique_keys[key_name].key_values = new_changes;

      if (emitted_by === target) {
        for (let row in row_changes) {
          for (let col_index in shared_key_details.key_indexes) {
            if (col_index in row_changes[row].newValues) {
              dh.hot.setSourceDataAtCell(row, col_index, row_changes[row].newValues[col_index])
            }
          }
        };
      } else {
        // propagation
        for (let col_index in shared_key_details.key_indexes) {
          updateRows(dh, [
            col_index,
            appContext[emitted_by].unique_keys[key_name].key_old_values[
              col_index
            ],
            appContext[emitted_by].unique_keys[key_name].key_values[col_index],
          ]);
        }
      }
      break;
    case ACTION.SELECT:
      triggerCurrentSelectionChange(currentSelection);
      break;
    case ACTION.VALIDATE:
      // TODO: generalize to row targetting
      dh.validate();
      break;
    default:
      console.error(`Can't handle action ${action}`);
  }
};

const triggerCurrentSelectionChange = (currentSelection) => {
  $(document).trigger('dhCurrentSelectionChange', { currentSelection });
};

const makeCurrentSelection = (appContext, dh) => {
  let { row, column, unique_keys } = structuredClone(
    appContext[dh.class_assignment]
  );

  if (column <= -1) {
    column = 0;
  }
  const key_name = dh.hot.getSettings().columns[column].name;
  const maybeValueToMatch = dh.hot.getDataAtCell(row, column);

  let currentSelectionObject = {
    source: dh.class_assignment,
    key_name,
    valueToMatch: maybeValueToMatch,
    parentRow: row,
    parentCol: column,
  }
  if (key_name in unique_keys) {
    currentSelectionObject.shared_key_name = unique_keys[key_name].name;
  }
  return currentSelectionObject;
}

function routeAction(action, emitted_by, target, dhs, event, appContext, propagates, unique_key) {
  if (action === ACTION.READ && emitted_by === target) {
    runHook(dhs[emitted_by], action, event.detail);
    dispatchHandsontableUpdate(ACTION.SELECT, event.detail);
  } else if (action === ACTION.SELECT) {
    const activeDataHarmonizer = dhs[findActiveDataHarmonizer(appContext)];
    event.detail.currentSelection =
      makeCurrentSelection(appContext, activeDataHarmonizer);
    runHook(activeDataHarmonizer, action, event.detail);
    // propagate filter actions to child tables if possible and allowed
    if (propagates) {
      // TODO: how to scope row changes
      event.detail.row = null;
      dispatchChildHooks(unique_key, ACTION.FILTER, event.detail);
    }
  } else if (action === ACTION.FILTER) {
    runHook(dhs[target], action, event.detail);
  } else if (action === ACTION.UPDATE || action === ACTION.DELETE) {
    runHook(dhs[target], action, event.detail);
    if (emitted_by === target) {
      // propagate update actions to child table if possible
      if (propagates) {
        // TODO: how to scope row changes
        event.detail.row = null;
        dispatchChildHooks(unique_key, action, event.detail);
      }
    }
  } else if (action === ACTION.VALIDATE) {
    runHook(dhs[emitted_by], action, event.detail);
  } else {
    console.warn(
      'not firing hook',
      emitted_by,
      action,
      appContext[emitted_by]?.unique_keys,
      unique_key,
      unique_key.foreign_key,
      'foreign_key_class' in unique_key
    );
  }
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
    data_harmonizer.updateColumnSettings(columnIndex, { readOnly: true });
  } else {
    console.error(
      `makeColumnReadOnly: Column not found for '${shared_key_name}'`
    );
  }
}

const makeColumnsReadOnly = (appContext, dh) => {
  // the top-level class is the active class when constructing the appContext for the first time
  // only mark child classes read only
  if (!appContext[dh.class_assignment].active) {
    const unique_keys = appContext[dh.class_assignment].unique_keys;
    for (let unique_key in unique_keys) {
      makeColumnReadOnly(dh, unique_key);
    }
  }
};

const dispatchHandsontableUpdate2 = (detail) => {
  const event = new CustomEvent('handsontableUpdate', { detail });
  document.dispatchEvent(event);
}

function parentBroadcastsCRUD(appContext, dhs) {
  // look for nodes
  const nodes = Object.keys(appContext);
  nodes.forEach(node_name => {
    const node = appContext[node_name];
    for (let unique_key_name in node.unique_keys) {
      const unique_key = node.unique_keys[unique_key_name];
      if (unique_key.foreign_key) {
        // console.warn(unique_key.name, 'is foreign key');
        // child class "adds" listener to parent class
        // this way only the relevant fields ever emit CRUD events
        // this could be replaced with an emission for each slot as well if necessary
        const { foreign_key_class, foreign_key_slot } = unique_key;
        const dh = dhs[foreign_key_class];
        dh.hot.addHook('afterChange', (changes, source) => {
          console.log('emitting change', foreign_key_class, foreign_key_slot);
          if (source === 'loadData') {
            return; // don't act on changes caused by loading data
          }
          if (changes) {

            const row_changes = changesToRows(changes);
            const column_index = dh.getColumnIndexByFieldName(foreign_key_slot);
            for (let row in row_changes) {

              // dispatch action based on changes
                
              // Dispatch a DELETE action if the value the new value is an empty unit value
              // Else dispatch an UPDATE on a change
              const updateActionType = 
              Object.values(
                row_changes[row].newValues
              ).map(isEmptyUnitVal).includes(true) ? 
                  ACTION.DELETE 
                : ACTION.UPDATE;
  
              const detail = { 
                  action: updateActionType, 
                  emitted_by: foreign_key_class, 
                  target: node_name,
                  row, 
                  key_name: foreign_key_slot,
                  key_old_values: takeKeys([column_index])(
                    row_changes[row].oldValues
                  ),
                  key_new_values: takeKeys([column_index])(
                    row_changes[row].newValues
                  ),
                  old_changes: row_changes[row].oldValues,
                  new_changes: row_changes[row].newValues,
                  row_changes
                };

              dispatchHandsontableUpdate2(detail);

              if (findActiveDataHarmonizer(appContext) === detail.emitted_by) {
                detail.action = ACTION.SELECT;
                dispatchHandsontableUpdate2(detail);
              }

            }

          }
        });
      } else {
        // Do nothing
        console.warn(unique_key.name, 'is not foreign key');
      }
    }
  });
}

function childListensCRUD(appContext, dhs) {
  const nodes = Object.keys(appContext);
  nodes.forEach(node_name => {
    const node = appContext[node_name];
    for (let unique_key_name in node.unique_keys) {
      const unique_key = node.unique_keys[unique_key_name];
      if (unique_key.foreign_key) {
        document.addEventListener('handsontableUpdate', function (event) {
          routeAction2(appContext, dhs, event.detail.action, event);
        });
      }
    };
  });
}

const routeAction2 = (appContext, dhs, action, event) => {
  const { emitted_by, target, key_name } = event.detail;
  const unique_key = appContext[emitted_by]?.unique_keys[key_name];
  if (action === ACTION.READ && emitted_by === target) {
    handleAction2(appContext, dhs, dhs[emitted_by], action, event.detail);
    event.detail.action = ACTION.SELECT
    dispatchHandsontableUpdate2(event.detail);
  } else if (action === ACTION.SELECT) {
    const activeDataHarmonizer = dhs[findActiveDataHarmonizer(appContext)]
    event.detail.currentSelection =
      makeCurrentSelection(appContext, activeDataHarmonizer);
    event.detail.target = event.detail.currentSelection.name;
    handleAction2(appContext, dhs, activeDataHarmonizer, action, event.detail);
    dispatchChildHooks2(unique_key, ACTION.FILTER, event.detail);
  } else if (action === ACTION.VALIDATE) {
    handleAction2(appContext, dhs, dhs[emitted_by], action, event.detail);
  } else {
    // FILTER, UPDATE, DELETE
    handleAction2(appContext, dhs, dhs[target], action, event.detail);
  }
}

const handleAction2 = (appContext, dhs, dh, action, details) => {
  let {
    emitted_by,
    key_name,
    target,
    old_changes,
    new_changes,
    row_changes,
    row,
    column,
    currentSelection
  } = details;

  const shared_key_details = appContext[emitted_by].unique_keys[key_name];
  if (!shared_key_details) {
    console.error(`Key details not found for ${key_name} in ${emitted_by}.`);
    return;
  }
  // Use Handsontable's batch operation to group multiple changes
  console.info(
    action,
    emitted_by,
    `-${key_name}->`,
    target,
    old_changes,
    new_changes,
  );

  switch (action) {
    case ACTION.CREATE:
      break;
    case ACTION.READ:
      if (row !== appContext[target].row && !isEmptyUnitVal(row)) {
        appContext[target].row = row;
      }
      if (column !== appContext[target].column && !isEmptyUnitVal(column)) {
        appContext[target].column = column;
      }
      setActiveDataHarmonizer(appContext, target);
      break;
    case ACTION.FILTER:
      // TODO: generalize to multi-key
      dh.hideMatchingRows(
        dh.getColumnIndexByFieldName(key_name),
        details.currentSelection.valueToMatch
      );
      break;
    case ACTION.UPDATE:
    case ACTION.DELETE:
      appContext[emitted_by].unique_keys[key_name].key_old_values = old_changes;
      appContext[emitted_by].unique_keys[key_name].key_values = new_changes;

      if (emitted_by === target) {
        for (let row in row_changes) {
          for (let col_index in shared_key_details.key_indexes) {
            if (col_index in row_changes[row].newValues) {
              dh.hot.setSourceDataAtCell(row, col_index, row_changes[row].newValues[col_index])
            }
          }
        };
      } else {
          for (let col_index in shared_key_details.key_indexes) {
            // propagation
            // propagate deletion when the deleted cell was unique of its kind (always propagate updates)
            const deletion_propagates = getNonEmptyColumnValues(dhs[emitted_by].hot, [col_index]).filter(col_val => col_val === appContext[emitted_by].unique_keys[key_name].key_old_values[
              col_index
            ]).length === 0
            if (deletion_propagates) {
              updateRows(dh, [
                col_index,
                appContext[emitted_by].unique_keys[key_name].key_old_values[
                  col_index
                ],
                appContext[emitted_by].unique_keys[key_name].key_values[col_index],
              ]);
            }
          }

      }
      break;
    case ACTION.SELECT:
      const activeDataHarmonizer = dhs[findActiveDataHarmonizer(appContext)];
      details.currentSelection = makeCurrentSelection(appContext, activeDataHarmonizer);
      triggerCurrentSelectionChange(currentSelection);
      break;
    case ACTION.VALIDATE:
      // TODO: generalize to row targetting
      dh.validate();
      break;
    default:
      console.error(`Can't handle action ${action}`);
  }
};

const dispatchChildHooks2 = (unique_key, action, details) => {
  if ('child_classes' in unique_key) {
    for (let child_class of unique_key.child_classes) {
      dispatchHandsontableUpdate2({
        ...details,
        action,
        // emitted_by,
        // key_name,
        target: child_class,
      });
    }
  }
};

export const setup1M = ({ appContext }, dhs) => {
    destroyHandsontableUpdateRouter();
    for (let dh in dhs) {
      if (dh in appContext) {
        makeColumnsReadOnly(appContext, dhs[dh]);
        bindReadEmitter(appContext, dhs[dh]);
        if (DEBUG) bindKeyConstraintValidation(appContext, dhs[dh]);
        createRowFocusTracker(dhs[dh], () => dhs[dh].validate());

        parentBroadcastsCRUD(appContext, dhs);
        childListensCRUD(appContext, dhs);

        // bindChangeEmitter(appContext, dhs[dh]); // create, update, delete
        // bindActionHandler(appContext, dhs[dh]);
      }
    }
    handsontableUpdateRouter(appContext, dhs);
    return appContext;
};
