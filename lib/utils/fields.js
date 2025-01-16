import { isDate } from 'date-fns';
import {
  Datatypes,
  stringifyJsonSchemaDate,
  parseJsonSchemaDate,
  parseJsonDate,
  datatypeIsDateOrTime,
} from './datatypes.js';
import { consolidate } from './objects.js';

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

/**
 * Test to see if col's field is followed by [field unit],[field bin] fields
 * @param {Object} fields See `data.js`.
 * @param {Integer} column of numeric field.
 */
export function fieldUnitBinTest(fields, col) {
  return (
    fields.length > col + 2 &&
    fields[col + 1].name == fields[col].name + '_unit' &&
    fields[col + 2].name == fields[col].name + '_bin'
  );
}

// parse failure behaviors
export const KEEP_ORIGINAL = 'KEEP_ORIGINAL';
export const REMOVE = 'REMOVE';
export const THROW_ERROR = 'THROW_ERROR';

// date formats
export const DATE_OBJECT = 'DATE_OBJECT';
export const JSON_SCHEMA_FORMAT = 'JSON_SCHEMA_FORMAT';
export const INPUT_FORMAT = 'INPUT_FORMAT';

export function dataArrayToObject(dataArray, fields, options = {}) {
  const {
    parseFailureBehavior,
    dateBehavior,
    dateFormat,
    datetimeFormat,
    timeFormat,
  } = {
    parseFailureBehavior: KEEP_ORIGINAL,
    dateBehavior: DATE_OBJECT,
    dateFormat: 'yyyy-MM-dd',
    datetimeFormat: 'yyyy-MM-dd HH:mm',
    timeFormat: 'HH:mm',
    ...options,
  };
  const datatypes = new Datatypes({
    dateFormat,
    datetimeFormat,
    timeFormat,
  });
  const formatDatesAndTimes = (dateObject, datatype) => {
    if (!isDate(dateObject)) {
      return dateObject;
    }
    if (dateBehavior === DATE_OBJECT) {
      return dateObject;
    }
    if (dateBehavior === INPUT_FORMAT) {
      return datatypes.stringify(dateObject, datatype);
    }
    if (dateBehavior === JSON_SCHEMA_FORMAT) {
      return stringifyJsonSchemaDate(dateObject, datatype);
    }
  };
  const getParsedValue = (originalValue, datatype) => {
    const parsedValue = datatypes.parse(originalValue, datatype);
    if (parsedValue !== undefined) {
      return formatDatesAndTimes(parsedValue, datatype);
    }
    if (parseFailureBehavior === KEEP_ORIGINAL) {
      return originalValue;
    }
    if (parseFailureBehavior === THROW_ERROR) {
      throw new Error(
        `Unable to parse value "${originalValue}" as datatype "${datatype}"`
      );
    }
    if (parseFailureBehavior === REMOVE) {
      return undefined;
    }
  };
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
        .map((cellElement) => getParsedValue(cellElement, field.datatype))
        .filter((parsedValue) => parsedValue !== undefined);
      if (parsed.length > 0) {
        dataObject[field.name] = parsed;
      }
    } else {
      dataObject[field.name] = getParsedValue(cell, field.datatype);
    }
  });
  return dataObject;
}

/**
 * Construct a dictionary of source field names pointing to column index
 * @param {Object} fields A flat version of data.js.
 * @return {Map<String, Integer>} Dictionary of all fields.
 */
export function fieldNameMapFromIndex(fields) {
  const map = {};
  for (const [fieldIndex, field] of fields.entries()) {
    map[fieldIndex] = field.name;
  }
  return map;
}

/**
 * Construct a dictionary of source field TITLES pointing to column index
 * @param {Object} fields A flat version of data.js.
 * @return {Map<String, Integer>} Dictionary of all fields.
 */
export function fieldTitleMapFromIndex(fields) {
  const map = {};
  for (const [fieldIndex, field] of fields.entries()) {
    map[fieldIndex] = field.title;
  }
  return map;
}

/**
 * A denormalized collection of slotTitles and slotNames for referencing in data saves and load
 * @param {Object} fields A flat version of data.js.
 * @return {Map<Integer, Map<String, String>>}
 */
export function fieldSymbolsAtIndexMap(fields) {
  const invertedFieldTitleIndex = fieldTitleMapFromIndex(fields);
  const invertedFieldNameMapToIndex = fieldNameMapFromIndex(fields);
  if (
    Object.keys(invertedFieldTitleIndex).length !=
    Object.keys(invertedFieldNameMapToIndex).length
  ) {
    console.error('Field Title and Field Index maps are different sizes!');
  } else {
    const tempObj = {};
    for (let i = 0; i < Object.values(invertedFieldTitleIndex).length; i++) {
      tempObj[i] = {
        slotName: invertedFieldNameMapToIndex[i],
        slotTitle: invertedFieldTitleIndex[i],
      };
    }
    return tempObj;
  }
  return null;
}

export function slotNamesForTitlesMap(fields) {
  const fieldSymbolsAtIndex = fieldSymbolsAtIndexMap(fields);
  let tempObject = {};
  for (let index in fieldSymbolsAtIndex) {
    tempObject[fieldSymbolsAtIndex[index].slotTitle] =
      fieldSymbolsAtIndex[index].slotName;
  }
  return tempObject;
}

export function slotTitleForNameMap(fields) {
  const fieldSymbolsAtIndex = fieldSymbolsAtIndexMap(fields);
  let tempObject = {};
  for (let index in fieldSymbolsAtIndex) {
    tempObject[fieldSymbolsAtIndex[index].slotName] =
      fieldSymbolsAtIndex[index].slotTitle;
  }
  return tempObject;
}

export function findFieldIndex(fields, key, translationMap = {}) {
  // First try to find a direct match.
  let index = fields.findIndex((f) => {
    return f.name === key || f.alias === key;
  });

  // If no direct match, try to find a match through the translation map.
  if (index < 0 && translationMap[key]) {
    const untranslatedKey = translationMap[key];
    index = fields.findIndex(
      (f) => f.name === untranslatedKey || f.alias === untranslatedKey
    );
  }

  return index;
}

export function dataObjectToArray(dataObject, fields, options = {}) {
  const {
    serializedDateFormat,
    dateFormat,
    datetimeFormat,
    timeFormat,
    translationMap,
  } = {
    serializedDateFormat: DATE_OBJECT,
    dateFormat: 'yyyy-MM-dd',
    datetimeFormat: 'yyyy-MM-dd HH:mm',
    timeFormat: 'HH:mm',
    ...options,
  };
  const datatypes = new Datatypes({
    dateFormat,
    datetimeFormat,
    timeFormat,
  });
  const dataArray = Array(fields.length).fill('');

  const parseDateString = (dateString, datatype) => {
    if (serializedDateFormat === DATE_OBJECT) {
      return parseJsonDate(dateString);
    }
    if (serializedDateFormat === INPUT_FORMAT) {
      return datatypes.parse(dateString, datatype);
    }
    if (serializedDateFormat === JSON_SCHEMA_FORMAT) {
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

  const slotNamesForTitles = slotNamesForTitlesMap(fields);
  for (const [slotTitle, value] of Object.entries(dataObject)) {
    const slotName = slotNamesForTitles[slotTitle];
    const fieldIdx = findFieldIndex(fields, slotName, translationMap);

    if (fieldIdx < 0) {
      console.warn('Could not map data object key ' + slotName);
      continue;
    }
    const field = fields[fieldIdx];
    if (field.multivalued && Array.isArray(value)) {
      dataArray[fieldIdx] = formatMultivaluedValue(
        value.map((v) => getStringifiedValue(v, field.datatype))
      );
    } else {
      dataArray[fieldIdx] = getStringifiedValue(value, field.datatype);
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

export const formatEscapeHTML = (string) => {
  return string.replace(/[&<>"']/g, (char) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return escape[char] || char;
  });
};

export function titleOverText(enm) {
  try {
    return typeof enm.title !== 'undefined' ? enm.title : enm.text;
  } catch (e) {
    console.error(e, enm);
  }
}

export const singleFieldDisplayName = (permissible_values) => (key) =>
  key in permissible_values ? titleOverText(permissible_values[key]) : key;
export const multiFieldDisplayName = (permissible_values) => (multikey) =>
  multikey
    .split(MULTIVALUED_DELIMITER)
    .map(fieldDisplayName(permissible_values))
    .join(MULTIVALUED_DELIMITER);

export const fieldDisplayName = (permissible_values) => (key) => {
  const maybeMultiKey = key.split(MULTIVALUED_DELIMITER);
  const isLikelyMultiKey = maybeMultiKey.length > 1;
  if (isLikelyMultiKey) return multiFieldDisplayName(permissible_values)(key);
  return singleFieldDisplayName(permissible_values)(key);
};

export const mergedPermissibleValues = (field) =>
  consolidate(field.sources, (acc, source) => ({
    ...acc,
    ...field.permissible_values[source],
  }));
