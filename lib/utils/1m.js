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

const SchemaClassesList = (schema) => {
  return Object.keys(schema.classes).filter(
    (key) => !['dh_interface', 'Container'].includes(key)
  );
};

const SchemaClasses = (schema) =>
  takeKeys(SchemaClassesList(schema))(schema.classes);

const uniqueKeysInIndexRange = (appContext, cls_key, minIndex, maxIndex) => {
  const cls_unique_keys = appContext[cls_key].unique_keys;
  const unique_keys_in_selection = Object.keys(cls_unique_keys).filter((ukey) =>
    cls_unique_keys[ukey].key_indexes.some(numberInRange([minIndex, maxIndex]))
  );
  return unique_keys_in_selection;
};

// const relevantUniqueKeys = (appContext, cls_key, unique_key_names) => {
//   const only_relevant_unique_keys = takeKeys(unique_key_names)(
//     appContext[cls_key].unique_keys
//   );
//   return only_relevant_unique_keys;
// };

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
        const [cls_name, slot_name] =
          slot.annotations.foreign_key.value.split('.');
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
        unique_key.foreign_key_slot = unique_key_name;
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

const addChildClassesToUniqueKeysForAppContext = (appContext) => {
  for (let dh_class_name in appContext) {
    for (let key in appContext[dh_class_name].unique_keys) {
      // foreign_key_class will be in class.unique_keys when foreign_key is true
      if ('foreign_key_class' in appContext[dh_class_name].unique_keys[key]) {
        const fkc =
          appContext[dh_class_name].unique_keys[key].foreign_key_class;
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
  addChildClassesToUniqueKeysForAppContext(InitialAppContextObject.appContext);

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
// import grdi_json from '../templates/grdi/schema.json';
// import schema_editor_json from '../templates/schema_editor/schema.json';
// const AppContext = buildAppContext(grdi_json);
// const AppContext2 = buildAppContext(schema_editor_json);

/* Event Workflow */

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
  if (filter_value !== null) columnValues.filter((el) => el === filter_value);
  return hasDuplicates(columnValues);
};

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
        const maybeUniqueKeys = uniqueKeysInIndexRange(
          appContext,
          dh.template_name,
          minIndex,
          maxIndex
        );
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
        //   dh.template_name,
        //   rowIndex,
        //   hot.getDataAtRow(rowIndex)
        // );
        clearRow(hot, rowIndex);
      }
      if (shouldRemapChildCol) {
        modifyRow(hot, rowIndex, col, newVal);
      }
      return CONTINUE_SIGNAL;
    });
  });
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

const makeCurrentSelection = (appContext, dh) => {
  let { row, column, unique_keys } = structuredClone(
    appContext[dh.template_name]
  );

  if (column <= -1) {
    column = 0;
  }
  const key_name = dh.hot.getSettings().columns[column].name;
  const maybeValueToMatch = dh.hot.getDataAtCell(row, column);

  let currentSelectionObject = {
    source: dh.template_name,
    key_name,
    valueToMatch: maybeValueToMatch,
    parentRow: row,
    parentCol: column,
  };
  if (key_name in unique_keys) {
    currentSelectionObject.shared_key_name = unique_keys[key_name].name;
  }
  return currentSelectionObject;
};

const triggerCurrentSelectionChange = (currentSelection) => {
  $(document).trigger('dhCurrentSelectionChange', { currentSelection });
};

// Core CRUD handler:

const handleAction = (appContext, dhs, dh, action, details) => {
  let {
    emitted_by,
    key_name,
    target,
    old_changes,
    new_changes,
    row_changes,
    row,
    column,
    currentSelection,
  } = details;

  // Use Handsontable's batch operation to group multiple changes
  console.info(
    action,
    emitted_by,
    `-${key_name}->`,
    target,
    old_changes,
    new_changes,
    appContext
  );

  const shared_key_details = appContext[emitted_by].unique_keys[key_name];
  if (!shared_key_details) {
    console.error(`Key details not found for ${key_name} in ${emitted_by}.`);
    return;
  }

  const activeDataHarmonizer = dhs[findActiveDataHarmonizer(appContext)];

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
              dh.hot.setSourceDataAtCell(
                row,
                col_index,
                row_changes[row].newValues[col_index]
              );
            }
          }
        }
      } else {
        for (let col_index in shared_key_details.key_indexes) {
          // propagation
          // propagate deletion when the deleted cell was unique of its kind (always propagate updates)
          const deletion_propagates =
            getNonEmptyColumnValues(dhs[emitted_by].hot, [col_index]).filter(
              (col_val) =>
                col_val ===
                appContext[emitted_by].unique_keys[key_name].key_old_values[
                  col_index
                ]
            ).length === 0;
          if (deletion_propagates) {
            updateRows(dh, [
              col_index,
              appContext[emitted_by].unique_keys[key_name].key_old_values[
                col_index
              ],
              appContext[emitted_by].unique_keys[key_name].key_values[
                col_index
              ],
            ]);
          }
        }
      }
      break;
    case ACTION.SELECT:
      details.currentSelection = makeCurrentSelection(
        appContext,
        activeDataHarmonizer
      );
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

/* 4: Foreign key table listener
A listening table event handler triggers, based on an event on one of its foreign key slots. Importantly, it must 
throw the same event as it detected, as though its own primary key had changed.  This enables trickle-down effects.

Table with foreign key listen event to the same:

Event: (classDataRowKeyChange, className, keyName, action)

Where action can be create, read, update, delete.  
Details can be fetched by listener via appContext[className].unique_keys[keyName] .  Also appContext[class][“active”] flag can be updated accordingly.
*/

// NOTE: Handsontable doesn't have a arbitrary listeners like the DOM. Hooks are fired through methods on individual tables.
// We emulate a listener by creating a new event manager instead instead.
// This is also necessary to ensure the listeners have a lifecycle where they can be removed off the DOM properly.
// Since the action handlers are parameterized by appContext/data harmonizers, the uniqueness of their closures prevents referencing them by their function symbol.
// The event tracker stores the listeners in a map so we can guarantee their deletion.
class EventTracker {
  constructor() {
    this.listeners = new Map();
    this.boundHandlers = new Map();
  }

  // Add an event listener with optional context
  addEventListener(eventName, handler, context = null) {
    // Clean up any existing listeners for this event before adding a new one
    this.removeAllEventListeners(eventName);

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    // Create a bound handler if context is provided
    const boundHandler = context ? handler.bind(context) : handler;

    // Store reference to original and bound handler for removal
    this.boundHandlers.set(handler, {
      bound: boundHandler,
      context: context,
    });

    this.listeners.get(eventName).add(boundHandler);
    document.addEventListener(eventName, boundHandler);
  }

  // Remove a specific event listener
  removeEventListener(eventName, handler) {
    const handlerInfo = this.boundHandlers.get(handler);
    if (handlerInfo && this.listeners.has(eventName)) {
      const { bound } = handlerInfo;
      this.listeners.get(eventName).delete(bound);
      document.removeEventListener(eventName, bound);
      this.boundHandlers.delete(handler);
    }
  }

  // Remove all event listeners for a specific event
  removeAllEventListeners(eventName) {
    if (this.listeners.has(eventName)) {
      for (const handler of this.listeners.get(eventName)) {
        document.removeEventListener(eventName, handler);
      }
      this.listeners.get(eventName).clear();
    }
  }

  // Remove all event listeners
  destroy() {
    for (const [eventName, handlers] of this.listeners.entries()) {
      for (const handler of handlers) {
        document.removeEventListener(eventName, handler);
      }
    }
    this.listeners.clear();
    this.boundHandlers.clear();
  }

  // Dispatch an event
  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

// Factory function to create an event tracker instance
export const createEventTracker = () => new EventTracker();

// Specific OneToManyEventTracker implementation
export class OneToManyEventTracker extends EventTracker {
  constructor(appContext, dhs) {
    super();
    this.appContext = appContext;
    this.dhs = dhs;
  }

  dispatchHandsontableUpdate(detail) {
    this.dispatchEvent('classDataRowKeyChange', detail);
  }

  bindReadEmitter(appContext, dh) {
    dh.hot.addHook('afterSelection', (row, column, row2, column2) => {
      // Determine if the selection spans multiple rows
      const multiRowSelected = row !== row2;

      if (multiRowSelected) {
        /* 1.a: Multi-row select exception 
        If a user has marked out a multi row selection in parent table, this should trigger a table key = empty Read event.  
        Then child table listening to this should respond to this as being a filter to hide all records since no particular primary key can be responded to. 
  
        Later we can add an efficiency function that the filtering of records isn’t performed on a subordinate table until the user actually highlights the subordinate table’s tab such that they can see the data.  But initially we don’t need that fancy just-in-time thing.
        */
        console.warn(
          `Multi-row selection detected from row ${row} to ${row2}. Emitting empty Read event.`
        );

        // Emit an empty "Read" event to indicate no specific key selection
        this.dispatchHandsontableUpdate({
          action: ACTION.READ,
          emitted_by: dh.template_name,
          target: dh.template_name,
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
        const maybe_unique_keys = uniqueKeysInIndexRange(
          appContext,
          dh.template_name,
          min,
          max
        );

        console.info(
          `there are n=${maybe_unique_keys.length} keys in range: ${maybe_unique_keys}`
        );
        if (maybe_unique_keys.length > 0) {
          // If there are any unique keys within the selected column range, emit "Read" events
          // TODO: one at a time vs reading several
          for (let key_name of maybe_unique_keys) {
            this.dispatchHandsontableUpdate({
              action: ACTION.READ,
              emitted_by: dh.template_name,
              target: dh.template_name,
              key_name,
              row,
              column,
              key_values:
                appContext[dh.template_name].unique_keys[key_name].key_values, // Send the key values to filter by
            });
          }
        }
      }
    });
  }

  bindParentBroadcastsChange() {
    const nodes = Object.keys(this.appContext);
    nodes.forEach((nodeName) => {
      const node = this.appContext[nodeName];
      for (const [, uniqueKey] of Object.entries(node.unique_keys)) {
        if (uniqueKey.foreign_key) {
          const { foreign_key_class, foreign_key_slot } = uniqueKey;
          const dh = this.dhs[foreign_key_class];

          const computeImpactedRows = (rowChanges) => {
            // Pre-compute impact
            const impactedRows = Object.entries(rowChanges).map(
              ([row, change]) => ({
                row,
                action: Object.values(change.newValues)
                  .map(isEmptyUnitVal)
                  .includes(true)
                  ? ACTION.DELETE
                  : ACTION.UPDATE,
                oldValues: change.oldValues,
                newValues: change.newValues,
              })
            );
            return impactedRows;
          };

          dh.hot.addHook('beforeChange', (changes, source) => {
            if (source === 'loadData' || !changes) return;

            const rowChanges = changesToRows(changes);
            const columnIndex = dh.getColumnIndexByFieldName(foreign_key_slot);
            const impactedRows = computeImpactedRows(rowChanges);
            const hasDeleteActions = impactedRows.some(
              (row) => row.action === ACTION.DELETE
            );
            const isPrimaryKeyChange = changes.some(
              ([row, col]) => col === columnIndex
            );

            if (isPrimaryKeyChange) {
              // TODO: check
              return false;
            }

            if (hasDeleteActions) {
              // WIP!
              // Immediately return false to block the change
              showModal().then((confirmed) => {
                if (confirmed) {
                  // If the user confirmed, reapply the changes programmatically
                  changes.forEach(([row, col, oldValue, newValue]) => {
                    dh.hot.setSourceDataAtCell(row, col, newValue);
                    // dh.hot.setDataAtCell(row, col, newValue);
                  });
                  // const newData = dh.hot.getData(); // get updated source data
                  // changes.forEach(([row, col, oldValue, newValue]) => {
                  //   newData[row][col] = newValue;
                  // });
                  // dh.hot.loadData(newData);
                  // dh.hot.getPlugin('UndoRedo').done();
                  dh.hot.runHooks('afterChange', changes, 'edit');
                }
              });
              return false; // Cancel the change initially
            }
          });

          dh.hot.addHook('afterChange', (changes, source) => {
            if (source === 'loadData' || !changes) return;

            const rowChanges = changesToRows(changes);
            const impactedRows = computeImpactedRows(rowChanges);
            const columnIndex = dh.getColumnIndexByFieldName(foreign_key_slot);

            // Process changes
            impactedRows.forEach(({ row, action, oldValues, newValues }) => {
              const detail = {
                action,
                emitted_by: foreign_key_class,
                key_name: foreign_key_slot,
                target: nodeName,
                row,
                key_old_values: takeKeys([columnIndex])(oldValues),
                key_new_values: takeKeys([columnIndex])(newValues),
                old_changes: oldValues,
                new_changes: newValues,
                row_changes: rowChanges,
              };

              this.dispatchHandsontableUpdate(detail);

              if (
                findActiveDataHarmonizer(this.appContext) === detail.emitted_by
              ) {
                detail.action = ACTION.SELECT;
                this.dispatchHandsontableUpdate(detail);
              }
            });
          });
        }
      }
    });
  }

  dispatchChildHooks(unique_key, action, details) {
    if ('child_classes' in unique_key) {
      for (let child_class of unique_key.child_classes) {
        this.dispatchHandsontableUpdate({
          ...details,
          action,
          target: child_class,
        });
      }
    }
  }

  routeAction(appContext, dhs, action, event) {
    const { emitted_by, target, key_name } = event.detail;
    const unique_key = appContext[emitted_by]?.unique_keys[key_name];
    if (action === ACTION.READ && emitted_by === target) {
      handleAction(appContext, dhs, dhs[emitted_by], action, event.detail);
      event.detail.action = ACTION.SELECT;
      this.dispatchHandsontableUpdate(event.detail);
    } else if (action === ACTION.SELECT) {
      const activeDataHarmonizer = dhs[findActiveDataHarmonizer(appContext)];
      event.detail.currentSelection = makeCurrentSelection(
        appContext,
        activeDataHarmonizer
      );
      event.detail.target = event.detail.currentSelection.name;
      handleAction(appContext, dhs, activeDataHarmonizer, action, event.detail);
      try {
        this.dispatchChildHooks(unique_key, ACTION.FILTER, event.detail);
      } catch (e) {
        console.error(e);
        console.warn(
          emitted_by,
          appContext[emitted_by],
          unique_key,
          key_name,
          event.detail
        );
      }
    } else if (action === ACTION.VALIDATE) {
      handleAction(appContext, dhs, dhs[emitted_by], action, event.detail);
    } else {
      // FILTER, UPDATE, DELETE
      handleAction(appContext, dhs, dhs[target], action, event.detail);
    }
  }

  bindChildListensAndHandlesChange() {
    const actionHandler = (event) => {
      this.routeAction(this.appContext, this.dhs, event.detail.action, event);
    };

    const nodes = Object.keys(this.appContext);
    nodes.forEach((nodeName) => {
      const node = this.appContext[nodeName];
      for (const uniqueKey of Object.values(node.unique_keys)) {
        if (uniqueKey.foreign_key) {
          this.addEventListener('classDataRowKeyChange', actionHandler);
        }
      }
    });
  }

  setup1M() {
    for (const [dhName, dh] of Object.entries(this.dhs)) {
      if (dhName in this.appContext) {
        makeColumnsReadOnly(this.appContext, dh);
        this.bindReadEmitter(this.appContext, dh);
        if (DEBUG) bindKeyConstraintValidation(this.appContext, dh);
        createRowFocusTracker(dh, () => dh.validate());
      }
    }

    this.bindParentBroadcastsChange();
    this.bindChildListensAndHandlesChange();

    return this;
  }
}

/**
 * Makes a column non-editable in a Handsontable instance based on a property key.
 * @param {object} data_harmonizer - An object containing the Handsontable instance (`hot`).
 * @param {string} property - The column data property or header name.
 */
export function makeColumnReadOnly(data_harmonizer, slot_name) {
  const hot = data_harmonizer.hot;
  const columnIndex = data_harmonizer.getColumnIndexByFieldName(slot_name);
  //console.log("makeColumnReadOnly", columnIndex, hot.countCols());
  //Issue: makeColumnReadOnly is being applied to Class.unique_keys unique_keys amrtest_id.
  if (columnIndex >= 0 && columnIndex < hot.countCols()) {
    data_harmonizer.updateColumnSettings(columnIndex, { readOnly: true });
  } else {
    console.error(`makeColumnReadOnly: Column not found for '${slot_name}'`);
  }
}

const makeColumnsReadOnly = (appContext, dh) => {
  // the top-level class is the active class when constructing the appContext for the first time
  // only mark child classes read only
  if (!appContext[dh.template_name].active) {
    const unique_keys = appContext[dh.template_name].unique_keys;
    for (let unique_key in unique_keys) {
      makeColumnReadOnly(dh, unique_key);
    }
  }
};

const showModal = () => {
  return new Promise((resolve) => {
    // Reference the modal element
    const modal = document.getElementById('primary-key-delete-modal');

    // Show the modal (assuming Bootstrap-style)
    $(modal).modal('show');

    // Event listeners for buttons inside the modal
    const continueButton = modal.querySelector('.btn-danger');
    const cancelButton = modal.querySelector('.btn-secondary');

    // Handler for the 'Continue' button
    const handleContinue = () => {
      cleanup();
      resolve(true);
    };

    // Handler for the 'Cancel' button
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    // Attach one-time event listeners
    continueButton.addEventListener('click', handleContinue, { once: true });
    cancelButton.addEventListener('click', handleCancel, { once: true });

    // Cleanup function to remove listeners and hide the modal
    const cleanup = () => {
      continueButton.removeEventListener('click', handleContinue);
      cancelButton.removeEventListener('click', handleCancel);
      $(modal).modal('hide');
    };
  });
};

export const setup1M = ({ appContext }, dhs) => {
  const eventTracker = new OneToManyEventTracker(appContext, dhs);
  return eventTracker.setup1M();
};
