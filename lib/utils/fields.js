import Datatypes from './datatypes';

const MULTIVALUED_DELIMITER = '; ';

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

/**
 * Test to see if col's field is followed by [field unit],[field bin] fields
 * @param {Object} fields See `data.js`.
 * @param {Integer} column of numeric field.
 */
export function fieldUnitBinTest(fields, col) {
  return (
    fields.length > col + 2 &&
    fields[col + 1].title == fields[col].title + ' unit' &&
    fields[col + 2].title == fields[col].title + ' bin'
  );
}

const DATA_ARRAY_TO_OBJECT_OPTION_DEFAULTS = {
  strict: true,
  dateFormat: 'yyyy-MM-dd',
  datetimeFormat: 'yyyy-MM-dd HH:mm',
  timeFormat: 'HH:mm',
};
export function dataArrayToObject(dataArray, fields, options = {}) {
  const { strict, dateFormat, datetimeFormat, timeFormat } = {
    ...DATA_ARRAY_TO_OBJECT_OPTION_DEFAULTS,
    ...options,
  };
  const datatypes = new Datatypes({
    dateFormat,
    datetimeFormat,
    timeFormat,
  })
  const dataObject = {};
  dataArray.forEach((cell, idx) => {
    if (cell === '' || cell == null) {
      return;
    }
    const field = fields[idx];
    let parsed;
    if (field.multivalued) {
      const split = parseMultivaluedValue(cell);
      parsed = split
        .map((value) => (strict ? datatypes.parse(value, field.datatype) : value))
        .filter((parsed) => parsed !== undefined);
      if (parsed.length > 0) {
        dataObject[field.name] = parsed;
      }
    } else {
      parsed = strict ? datatypes.parse(cell, field.datatype) : cell;
      if (parsed !== undefined) {
        dataObject[field.name] = parsed;
      }
    }
  });
  return dataObject;
}

export function dataObjectToArray(dataObject, fields) {
  const datatypes = new Datatypes();
  const dataArray = Array(fields.length).fill('');
  for (const [key, value] of Object.entries(dataObject)) {
    const fieldIdx = fields.findIndex((f) => f.name === key);
    if (fieldIdx < 0) {
      console.warn('Could not map data object key ' + key);
      continue;
    }
    const field = fields[fieldIdx];
    if (field.multivalued && Array.isArray(value)) {
      dataArray[fieldIdx] = formatMultivaluedValue(
        value.map((v) => datatypes.stringify(v, field.datatype))
      );
    } else {
      dataArray[fieldIdx] = datatypes.stringify(value, field.datatype);
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
