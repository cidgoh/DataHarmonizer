import {
  Datatypes,
  parseJsonSchemaDate,
  parseJsonDate,
  datatypeIsDateOrTime,
} from './datatypes.js';

export const MULTIVALUED_DELIMITER = ';';

/**
 * Modify a string to match specified case.
 * @param {String} val String to modify.
 * @param {String} capitalize Case to modify string to; one of `'UPPER'`,
 *     `'lower'` or `'Title'`.
 * @return {String} String with modified case.
 */
export function changeCase(val, field) {
  switch (field.structured_pattern.syntax) {
    case '{lower_case}':
      val = val.toLowerCase();
      break;
    case '{UPPER_CASE}':
      val = val.toUpperCase();
      break;
    case '{Title_Case}':
      val = val
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ');
      break;
  }
  return val;
}

export function dataObjectToArray(dataObject, dh, options = {}) { //by_name = false, 
  const {
    serializedDateFormat,
    dateFormat,
    datetimeFormat,
    timeFormat,
  } = {
    serializedDateFormat: 'DATE_OBJECT',
    dateFormat: 'yyyy-MM-dd',
    datetimeFormat: 'yyyy-MM-dd HH:mm',
    timeFormat: 'HH:mm',
    ...options,
  };
  const datatypes = new Datatypes({ dateFormat, datetimeFormat, timeFormat});
  const dataArray = Array(dh.slot_names.length).fill('');

  const parseDateString = (dateString, datatype) => {
    if (serializedDateFormat === 'DATE_OBJECT') {
      return parseJsonDate(dateString);
    }
    if (serializedDateFormat === 'INPUT_FORMAT') {
      return datatypes.parse(dateString, datatype);
    }
    if (serializedDateFormat === 'JSON_SCHEMA_FORMAT') {
      return parseJsonSchemaDate(dateString, datatype);
    }
  };
  const getStringifiedValue = (originalValue, datatype) => {
    if (datatypeIsDateOrTime(datatype) && typeof originalValue === 'string') {
      const parsed = parseDateString(originalValue, datatype);
      if (!isNaN(parsed)) {
        originalValue = parsed;
      }
    }
    return datatypes.stringify(originalValue, datatype);
  };

  for (const [slot_name, value] of Object.entries(dataObject)) {
    if (dh.slot_names.includes(slot_name)) {
      const column = dh.slot_name_to_column[slot_name];
      const slot = dh.slots[column];
      if (slot.multivalued && Array.isArray(value)) {
        dataArray[column] = formatMultivaluedValue(
          value.map((v) => getStringifiedValue(v, slot.datatype))
        );
      } else {
        dataArray[column] = getStringifiedValue(value, slot.datatype);
      }
    }
    else {
      console.warn('Could not map data object key ' + slot_name);
    }
  }

  return dataArray;
}

/**
 * Parse a formatted string representing a multivalued value and return an
 * array of the individual values.
 *
 * @param {String} value String-formatted multivalued value.
 * @return {Array<String>} Array of individual string values.
 */
export function parseMultivaluedValue(value) {
  if (!value) {
    return [];
  }
  // trim the delimiter and the resulting tokens to be flexible about what
  // this function accepts
  return value
    .split(MULTIVALUED_DELIMITER.trim())
    .map((v) => v.trim())
    .filter((v) => !!v);
}

/**
 * Format a string array of multivalued values into a single string representation.
 *
 * @param {Array<Any>} values Array of individual values.
 * @return {String} String-formatted multivalued value.
 */
export function formatMultivaluedValue(values) {
  if (!values) {
    return '';
  }

  return values
    .filter((v) => !!v)
    .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
    .join(MULTIVALUED_DELIMITER);
}
