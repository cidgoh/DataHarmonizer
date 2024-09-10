import * as $ from 'jquery';
import { takeKeys } from './objects';
import { numberInRange, isEmptyUnitVal } from './general';

const STRATEGY = false;

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

const SchemaClassesList = (schema) =>
  Object.keys(schema.classes).filter(
    (key) => !['dh_interface', 'Container'].includes(key)
  );
const SchemaClasses = (schema) =>
  takeKeys(SchemaClassesList(schema))(schema.classes);

const slotIsForeignKey = (schema) => (slot_spec) =>
  Object.keys(schema.classes).includes(slot_spec.range);
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

const findForeignKeySlotsToMap = (schema) =>
  SchemaClassesList(schema).reduce((acc, cls_key) => {
    acc[cls_key] = [];
    for (let slot_name in schema.classes[cls_key].attributes) {
      const slot = schema.classes[cls_key].attributes[slot_name];
      if (slotIsForeignKey(schema)(slot)) {
        acc[cls_key][slot_name] = slot.range;
      }
    }
    return acc;
  }, {});

// TODO: DataHarmonizer dependent, or possible just from the schema?
const calculateKeyIndex = (schema) => (cls_key) => (slot_name) => {
  try {
    // TODO: conversion for zero indexing
    // TODO: are ranks all 1-indexed?
    return schema.classes[cls_key].slot_usage[slot_name].rank - 1;
  } catch (e) {
    throw Error(`Can't calculate Key Index for Slot ${slot_name} : ${e}`);
  }
};

const findUniqueKeysForClass = (schema) => (cls_key) => {
  let unique_keys_acc = {};
  const sc = SchemaClasses(schema);
  console.log(sc, cls_key);

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
      // TODO: default value. undefined for now
      if (unique_key.foreign_key) {
        unique_key.foreign_key_class =
          foreignKeySlotsPerClassMap[cls_key][slot_name];
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

const findActiveDataHarmonizer = appContext => {
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

const setActiveDataHarmonizer = appContext => active_dh_name => {
  for (let dh_name in appContext) {
    appContext[dh_name].active = false;
  }
  appContext[active_dh_name].active = true;
}

const add_child_classes_to_unique_keys_for_appContext = appContext => {
  for (let dh_class_name in appContext) {
    for (let key in appContext[dh_class_name].unique_keys) {
      // foreign_key_class will be in class.unique_keys when foreign_key is true
      if ('foreign_key_class' in appContext[dh_class_name].unique_keys[key]) {
        const fkc = appContext[dh_class_name].unique_keys[key].foreign_key_class;
        if (!('child_classes' in appContext[fkc].unique_keys[key])) {
          appContext[fkc].unique_keys[key].child_classes = [];
        }
        appContext[fkc].unique_keys[key].child_classes.push(dh_class_name);
      }
    }
  }
}

export function buildAppContext(schema) {
  const InitialAppContextObject = {
    appContext: {},
  };

  SchemaClassesList(schema).forEach((cls_key, i) => {
    let dh_class = {};
    dh_class.name = schema.classes[cls_key].name;
    dh_class.row = 0;
    dh_class.column = -1;
    dh_class.unique_keys = findUniqueKeysForClass(schema)(cls_key);
    dh_class.active = i === 0;  // first schema is active by default
    InitialAppContextObject.appContext[cls_key] = dh_class;
  });

  // separate method, since it requires all dh_classes to be computed first
  add_child_classes_to_unique_keys_for_appContext(InitialAppContextObject.appContext);
  
  return InitialAppContextObject;
};

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
  // TODO: "VALIDATE": "VALIDATE",
  // TODO: "TAB_CHANGE": "TAB_CHANGE",
});

/* Initialization
On load of a schema the appContext object is filled in, and event triggers are created for cell/row selection and classRowKeyChange event generation and listeners.
 */

// import grdi_json from '@/web/templates/grdi/schema.json';
// import schema_editor_json from '@/web/templates/schema_editor/schema.json';
// const AppContext = buildAppContext(grdi_json);
// const AppContext2 = buildAppContext(schema_editor_json);

/* Event Workflow */

const uniqueKeysInIndexRange =
  (appContext) => (cls_key) => (minIndex, maxIndex) => {
    const cls_unique_keys = appContext[cls_key].unique_keys;
    const unique_keys_in_selection = Object.keys(cls_unique_keys).filter(
      (ukey) =>
        cls_unique_keys[ukey].key_indexes.some(
          numberInRange([minIndex, maxIndex])
        )
    );
    return unique_keys_in_selection;
  };

const relevantUniqueKeys = (appContext) => (cls_key) => (unique_key_names) => {
  const only_relevant_unique_keys = takeKeys(unique_key_names)(
    appContext[cls_key].unique_keys
  );
  return only_relevant_unique_keys;
};

/* 1: Cell/row selection
If a user clicks on any part of a tab / table row, if that table has one or more primary keys, they yield primary key events that all subordinate tables/classes can listen to. 
This is the “Read” event.
*/

/* 1.a: Multi-row select exception 
If a user has marked out a multi row selection in parent table, this should trigger a table key = empty Read event.  
Then child table listening to this should respond to this as being a filter to hide all records since no particular primary key can be responded to. 

Later we can add an efficiency function that the filtering of records isn’t performed on a subordinate table until the user actually highlights the subordinate table’s tab such that they can see the data.  But initially we don’t need that fancy just-in-time thing.
*/

const handsontableUpdateRouter = (appContext) => (dhs) => {
  document.addEventListener('handsontableUpdate', (event) => {
    const { emitted_by, key_name, action, target } = event.detail;

    const classCanFire = emitted_by in appContext && key_name in appContext[emitted_by].unique_keys;
    const unique_key = appContext[emitted_by]?.unique_keys[key_name];
    const classHasForeignKey = unique_key && unique_key.foreign_key && 'foreign_key_class' in unique_key;
    const classHasChildClasses = unique_key && 'child_classes' in unique_key;

    if (classCanFire) {
      if (action === ACTION.READ) {
        console.log('reading', emitted_by, dhs);
        console.groupEnd();
        event.detail.target = emitted_by;
        handleAction(appContext)(dhs[emitted_by])(action, event.detail);
        triggerCurrentSelection(makeCurrentSelection(appContext)(dhs[findActiveDataHarmonizer(appContext)]));
      } else if (action === ACTION.FILTER) {
        event.detail.currentSelection = makeCurrentSelection(appContext)(dhs[findActiveDataHarmonizer(appContext)]);
        handleAction(appContext)(dhs[target])(action, event.detail);
      } else if (classHasForeignKey || classHasChildClasses ) {
        console.groupEnd();
        // TODO: this code goes into an infinite loop? why?
        // TODO: can this be refactored to use namespaces for events?
        // if (classHasForeignKey) {
          // dhs[unique_key.foreign_key_class].hot.runHooks(
          //   `classDataRowKeyChange`,
          //   action,
          //   event.detail
          // );
        // } else 
        if (classHasChildClasses) {
          for (let dh_key of unique_key.child_classes) {
            const dh = dhs[dh_key];
            event.detail.target = dh_key;
            dh.hot.runHooks(
              `classDataRowKeyChange:${dh_key}`,
              action,
              event.detail
            );
          }
        }
      } else {
        console.warn('not firing hook', 
          emitted_by, 
          appContext[emitted_by]?.unique_keys, 
          unique_key, 
          unique_key.foreign_key, 
          'foreign_key_class' in unique_key);
        console.groupEnd();
      }
    }
  });
};

const destroyHandsontableUpdateRouter = () => {
  // document.removeEventListener('handsontableUpdate');
};

function dispatchHandsontableUpdate(action, detail) {
  const _detail = { ...detail, action };
  const event = new CustomEvent('handsontableUpdate', { action, detail: _detail });
  document.dispatchEvent(event);
}

const bindReadEmitter = (appContext) => (dh) => {
  dh.hot.addHook('afterSelection', (row, col, row2, col2) => {
    // Determine if the selection spans multiple rows
    const multiRowSelected = row !== row2;
    if (multiRowSelected) {
      // 1.a: Multi-row selection - emit an empty "Read" event
      console.log(
        `Multi-row selection detected from row ${row} to ${row2}. Emitting empty Read event.`
      );

      // Emit an empty "Read" event to indicate no specific key selection
      dispatchHandsontableUpdate(ACTION.READ, {
        emitted_by: dh.class_assignment,
        row,
        row2,
        col,
        col2,
        key_name: null, // No specific key due to multi-row selection
        key_values: null, // No key values to filter by
      });
    } else {
      // Single-row selection handling
      const [min, max] = [col, col2]; // Determine the column range of the selection

      // Identify unique keys that may be affected by this selection
      const maybe_unique_keys = uniqueKeysInIndexRange(appContext)(
        dh.class_assignment
      )(min, max);
      console.info(
        `there are n=${maybe_unique_keys.length} keys in range: ${maybe_unique_keys}`
      );
      if (maybe_unique_keys.length > 0) {
        // If there are any unique keys within the selected column range, emit "Read" events
        // TODO: one at a time
        const key_name = maybe_unique_keys[0];
        // TODO: dispatch action based on changes
        // TODO: Dispatch runhooks to children directly?
        // TODO: there is an interaction between this function and "afterSelection" resulting in an infinite loop!
        dispatchHandsontableUpdate(ACTION.READ, {
          emitted_by: dh.class_assignment,
          key_name,
          row,
          col,
          key_values:
            appContext[dh.class_assignment].unique_keys[key_name].key_values, // Send the key values to filter by
        });
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

/* 2.b:
We have to undo the row change in case of some collision with an existing key value.

This work can be put off until phase 2 handling of multi-component keys.
*/

const bindKeyConstraintValidation = (appContext) => (dh) => {
  dh.hot.addHook('afterChange', (changes, source) => {
    if (source === 'loadData') return; // Skip changes when data is loaded initially

    // Process changes
    if (changes) {
      const rowChanges = changesToRows(changes); // Convert changes to a row-wise structure

      // Iterate over each row that had changes
      for (let row in rowChanges) {
        const changedCols = Object.keys(rowChanges[row].newValues); // Get changed columns for the row

        // Get unique keys that might be affected by these column changes
        const minIndex = Math.min(...changedCols);
        const maxIndex = Math.max(...changedCols);
        const maybeUniqueKeys = uniqueKeysInIndexRange(appContext)(
          dh.class_assignment
        )(minIndex, maxIndex);

        if (maybeUniqueKeys.length > 0) {
          const relevantKeys = relevantUniqueKeys(appContext)(
            dh.class_assignment
          )(maybeUniqueKeys);

          for (let keyName in relevantKeys) {
            const keyInfo = relevantKeys[keyName];
            const oldKeyValues = keyInfo.key_old_values;
            const newKeyValues = keyInfo.key_values;

            // Check uniqueness for the new key values
            const isValid = uniqueKeyConstraintValidation(...newKeyValues);

            if (!isValid) {
              console.warn(
                `Duplicate key detected for key '${keyName}' in class '${dh.class_assignment}'. Undoing changes.`
              );

              // Undo changes if not valid
              dh.hot.undo();

              // Stop further event propagation
              return false;
            } else {
              // Update appContext with the new validated key values
              appContext[dh.class_assignment].unique_keys[
                keyName
              ].key_old_values = oldKeyValues;
              appContext[dh.class_assignment].unique_keys[keyName].key_values =
                newKeyValues;
            }
          }
        }
      }
    }
  });

  // Hook into 'beforeKeyDown' to potentially stop further editing if needed
  // TODO: is this code correct
  dh.hot.addHook('beforeKeyDown', (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      const selected = dh.hot.getSelected();
      if (!selected) return;

      const [, col] = selected[0];
      const cls_key = dh.class_assignment;
      const affectedKeys = uniqueKeysInIndexRange(appContext)(cls_key)(
        col,
        col
      );

      if (affectedKeys.length > 0) {
        const relevantKeys =
          relevantUniqueKeys(appContext)(cls_key)(affectedKeys);

        for (let keyName in relevantKeys) {
          const keyInfo = relevantKeys[keyName];
          const keyValues = keyInfo.key_values;

          if (!uniqueKeyConstraintValidation(...keyValues)) {
            console.warn(
              `Attempted navigation away from cell with duplicate key '${keyName}' in class '${cls_key}'. Stopping.`
            );
            event.preventDefault(); // Stop the default behavior (navigation)
            return false; // Stop further event propagation
          }
        }
      }
    }
  });
};

const uniqueKeyConstraintValidation = (...unique_key_column_values) => {
  // for all data in the given columns, the cardinality of the set of unique n-keys has to equal the number rows satisfying this map.
  const cardinality_map = {};
  const isAtCardinality = (key) => cardinality_map[key] === 1; // Correct check for uniqueness

  const concatenateKeys = (...arr) =>
    arr.reduce((acc, partial_key) => [acc, partial_key].join('$'), '');

  const allArraysEqualLength = (...arr) =>
    arr.every((ukcv) => ukcv.length === arr[0].length);

  if (!allArraysEqualLength(...unique_key_column_values)) {
    console.error('unique key columns have different number of entries');
    return false; // Stop further processing as lengths are inconsistent
  }

  // Form the concatenated keys for each row
  const concatenated_keys = unique_key_column_values[0].map((_, rowIndex) =>
    concatenateKeys(...unique_key_column_values.map((col) => col[rowIndex]))
  );

  // Build the cardinality map
  concatenated_keys.forEach((concatenated_key) => {
    if (!(concatenated_key in cardinality_map)) {
      cardinality_map[concatenated_key] = 1;
    } else {
      cardinality_map[concatenated_key] += 1;
    }
  });

  // Check if all keys are unique
  return concatenated_keys.every(isAtCardinality);
};

/* 3: Primary key change event
Once a primary key change has been validated, a “classDataRowKeyChange” event can be triggered, which includes a reference to the above appContext class, by name or object.  We can also precompute once-and-for-all the action based on logic of processing the old and new values.

Primary key table triggering event (may be on more than one unique key):

Event: (classDataRowKeyChange, className, keyName, action)
*/

const changesToRows = (changes) => {
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
      rowWiseChanges[row].oldValues[column] = oldValue;
      rowWiseChanges[row].newValues[column] = newValue;
    }
  });
  return rowWiseChanges;
};

const bindChangeEmitter = (appContext) => (dh) => {
  dh.hot.addHook('afterChange', (changes, source) => {
    if (source === 'loadData') return;
    else if (changes) {
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
      const maybe_unique_keys_in_range = uniqueKeysInIndexRange(appContext)(
        dh.class_assignment
      )(min, max);

      if (maybe_unique_keys_in_range.length > 0) {
        const row_changes = changesToRows(changes);
        const unique_keys_in_scope = relevantUniqueKeys(appContext)(
          dh.class_assignment
        )(maybe_unique_keys_in_range);
        for (let key_name in unique_keys_in_scope) {
          const column_index = unique_keys_in_scope[key_name].key_indexes;
          for (let row in row_changes) {
            // TODO: dispatch action based on changes
            // Dispatch runhooks to children directly?
            dispatchHandsontableUpdate(ACTION.UPDATE, {
              emitted_by: dh.class_assignment,
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
            });
          }
        }
      }
    }
  });
};

/* 4: Foreign key table listener
A listening table event handler triggers, based on an event on one of its foreign key slots. Importantly, it must throw the same event as it detected, as though its own primary key had changed.  This enables trickle-down effects.

Table with foreign key listen event to the same:

Event: (classDataRowKeyChange, className, keyName, action)

Where action can be create, read, update, delete.  Details can be fetched by listener via appContext[className][keyName] .  Also appContext[class][“active”] flag can be updated accordingly.
*/

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

// TODO: DEPRECATE
const triggerCurrentSelection = (currentSelection) => {
    // TODO: old strategy
    $(document).trigger('dhCurrentSelectionChange', { currentSelection });
}

function filterRowsMatchingValueAtColumn(dh, columnIndex, valueToMatch) {
  const hotInstance = dh.hot;
  // Use the hiddenRows plugin to hide the rows
  const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
  console.warn('filterRowsMatchingValueAtColumn', hiddenRowsPlugin.getHiddenRows());
  const totalRows = hotInstance.countRows();  // Get total rows in the table
  hiddenRowsPlugin.showRows(hiddenRowsPlugin.getHiddenRows()); // Reset any previously hidden rows
  

  let rowsToHide = [];  // Array to store rows to hide

  // Iterate through each row
  for (let row = 0; row < totalRows; row++) {
    // Get the value of the cell in the specified column
    let cellValue = hotInstance.getDataAtCell(row, columnIndex);
    console.warn(row, columnIndex, cellValue, valueToMatch);
    // If the cell value does not satisfy the condition, add the row index to rowsToHide
    if (cellValue !== valueToMatch) {
      rowsToHide.push(row);
    }
  }

  hiddenRowsPlugin.hideRows(rowsToHide); // Hide the rows that don't meet the condition

  // Render the table to apply changes
  hotInstance.render();
}

function filterAllRows(dh) {
  const hotInstance = dh.hot;
  // Use the hiddenRows plugin to hide the rows
  const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
  console.warn('filterAllRows', hiddenRowsPlugin.getHiddenRows());

  hiddenRowsPlugin.showRows(hiddenRowsPlugin.getHiddenRows()); // Reset any previously hidden rows
  const totalRows = hotInstance.countRows();  // Get total rows in the table
  let numbers = [];
  for (let i = 0; i < totalRows; i++) {
    numbers.push(i);
  }
  hiddenRowsPlugin.hideRows(numbers); // Hide the rows that don't meet the condition

  // Render the table to apply changes
  hotInstance.render();
}

const handleAction = (appContext) => (dh) => (action, details) => {
  const {
    emitted_by,
    key_name,
    old_changes,
    new_changes,
    row,
    col,
    target
  } = details;
  const shared_key_details = appContext[emitted_by].unique_keys[key_name];
  if (!shared_key_details) {
    console.error(`Key details not found for ${key_name} in ${emitted_by}.`);
    return;
  }
  console.group('handleAction', action, details, dh.class_assignment);
  // Use Handsontable's batch operation to group multiple changes
  switch (action) {
    case ACTION.CREATE:
      console.info(ACTION.CREATE);
      break;
    case ACTION.READ:
      console.info(ACTION.READ, appContext[target].row, row, appContext[target].column);
      if (row !== appContext[target].row && !isEmptyUnitVal(row)) {
        appContext[target].row = row;
      }
      if (col !== appContext[target].column && !isEmptyUnitVal(col)) {
        appContext[target].column = col;
      }
      setActiveDataHarmonizer(appContext)(target);
      if ('child_classes' in shared_key_details) {
        for (let child_class of shared_key_details.child_classes) {
          console.log(child_class);
          dispatchHandsontableUpdate(ACTION.FILTER, {
            ...details,
            key_name,
            target: child_class,
          })
        }
      }
      break;
    case ACTION.FILTER:
      const { currentSelection } = details;
      console.warn(ACTION.FILTER, emitted_by, dh.class_assignment, target, key_name, currentSelection);
      if (currentSelection.valueToMatch === null) {
        filterAllRows(dh);
      } else {
        filterRowsMatchingValueAtColumn(dh, appContext[target].unique_keys[key_name].key_indexes[0], currentSelection.valueToMatch);
      }
      break;
    case ACTION.UPDATE:
      // TODO: guaranteed to be the same length?
      // TODO: rewrite handleChange to use kov, knv
      appContext[emitted_by].unique_keys[key_name].key_old_values = old_changes;
      appContext[emitted_by].unique_keys[key_name].key_values = new_changes;
      for (let col_index in shared_key_details.key_indexes) {
        handleChange(dh.hot, [
          col_index,
          old_changes[col_index],
          new_changes[col_index],
        ]);
      }
      // read after update to update filters
      dispatchHandsontableUpdate(ACTION.READ, {
        ...details,
        key_name,
        target: emitted_by,
      });
      break;
    case ACTION.DELETE:
      console.info(ACTION.DELETE);
      break;
    default:
      console.error(`Can't handle action ${action}`);
  }
  console.groupEnd();
};

const bindActionHandler = (appContext) => (dh) => {
  // TODO: key in unique_keys?
  // TODO: pre-processing? check if the received event is from a proper child
  // if (STRATEGY) {
  //   dh.hot.addHook('classDataRowKeyChange', (action, details) => {
  //     console.log('handling action', action);
  //     handleAction(appContext)(dh)(action, details);
  //   });
  // } else {
  dh.hot.addHook(`classDataRowKeyChange:${dh.class_assignment}`, (action, details) => {
    handleAction(appContext)(dh)(action, details);
  });
  // }
};

function createRowFocusTracker(hotInstance, onFocusChange) {
  let lastFocusedRow = null;  // Store the last focused row

  // Hook to track when a new row is selected
  function onAfterSelection(row, column, row2, column2) {
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
  function onBeforeKeyDown(event) {
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
    getLastFocusedRow: function() {
      return lastFocusedRow;
    },
    clearFocusTracking: function() {
      hotInstance.removeHook('afterSelection', onAfterSelection);
      hotInstance.removeHook('afterDeselect', onAfterDeselect);
      hotInstance.removeHook('beforeKeyDown', onBeforeKeyDown);
    }
  };
}

const makeCurrentSelection = appContext => dh => {
  let { row, column, unique_keys } = appContext[dh.class_assignment];
  if (column <= -1) {
    column = 0;
  }
  const key_name = dh.hot.getSettings().columns[column].name;
  const maybeValueToMatch = dh.hot.getDataAtCell(row, column);

  return {
    source: dh.class_assignment,
    shared_key_name: unique_keys[key_name].name, // TODO: translate to "is shared key"
    key_name,
    valueToMatch: maybeValueToMatch,
    parentRow: row,
    parentCol: column
  };
}

export const setup1M =
  ({ appContext }) =>
  (dhs) => {
    destroyHandsontableUpdateRouter();
    for (let dh in dhs) {
      if (dh in appContext) {
        console.log('setting up 1M for', dhs, dh);
        bindReadEmitter(appContext)(dhs[dh]);
        // bindKeyConstraintValidation(appContext)(dhs[dh]);
        bindChangeEmitter(appContext)(dhs[dh]);  // create, update, delete
        bindActionHandler(appContext)(dhs[dh]);
        createRowFocusTracker(dhs[dh].hot, (oldRow, newRow) => {
          console.log("Row changed focus", oldRow, newRow);
          // TODO: validate before subordinate listeners
          // TODO: validate one row at a time
          // TODO: validation pass/fail for messaging and per row
          dhs[dh].validate();
        });
      }
    }
    handsontableUpdateRouter(appContext)(dhs);
    return appContext;
  };
