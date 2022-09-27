import { parseDatatype, stringifyDatatype } from './datatypes';

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
  multivalueDelimiter: '; ',
  strict: true,
};
export function dataArrayToObject(dataArray, fields, options = {}) {
  const { multivalueDelimiter, strict } = {
    ...DATA_ARRAY_TO_OBJECT_OPTION_DEFAULTS,
    ...options,
  };
  const dataObject = {};
  dataArray.forEach((cell, idx) => {
    if (cell === '' || cell == null) {
      return;
    }
    const field = fields[idx];
    let parsed;
    if (field.multivalued) {
      const split = cell.split(multivalueDelimiter);
      parsed = split
        .map((value) => (strict ? parseDatatype(value, field.datatype) : value))
        .filter((parsed) => parsed !== undefined);
      if (parsed.length > 0) {
        dataObject[field.name] = parsed;
      }
    } else {
      parsed = strict ? parseDatatype(cell, field.datatype) : cell;
      if (parsed !== undefined) {
        dataObject[field.name] = parsed;
      }
    }
  });
  return dataObject;
}

const DATA_OBJECT_TO_ARRAY_DEFAULT_OPTIONS = {
  multivalueDelimiter: '; ',
};
export function dataObjectToArray(dataObject, fields, options = {}) {
  const { multivalueDelimiter } = {
    ...DATA_OBJECT_TO_ARRAY_DEFAULT_OPTIONS,
    ...options,
  };
  const dataArray = Array(fields.length).fill('');
  for (const [key, value] of Object.entries(dataObject)) {
    const fieldIdx = fields.findIndex((f) => f.name === key);
    if (fieldIdx < 0) {
      console.warn('Could not map data object key ' + key);
      continue;
    }
    const field = fields[fieldIdx];
    if (field.multivalued && Array.isArray(value)) {
      dataArray[fieldIdx] = value
        .map((v) => stringifyDatatype(v, field.datatype))
        .join(multivalueDelimiter);
    } else {
      dataArray[fieldIdx] = stringifyDatatype(value, field.datatype);
    }
  }
  return dataArray;
}

function olsAutocompleteFieldSettings(config) {
  const { ontology } = config
  return {
    getColumn: (dh, col) => {
      let timer = null;
      return {
        ...col,
        type: 'autocomplete',
        strict: true,
        allowInvalid: false,
        sortByRelevance: false,
        source: (query, next) => {
          clearTimeout(timer)
          if (!query) {
            return next([])
          }
          timer = setTimeout(() => {
            fetch(`https://www.ebi.ac.uk/ols/api/select?q=${query}&ontology=${ontology}&type=class&rows=50`)
            .then(response => {
              if (!response.ok) {
                throw new Error('API Error: ' + response.status)
              }
              return response.json()
            })
            .then(body => {
              const options = body.response.docs.map(doc => doc.label)
              next(options)
            })
            .catch(() => {
              next([])
            })
          }, 300)
        },
      }
    }
  }
}

const WIDGET_REGISTRY = {
  'ols-autocomplete': olsAutocompleteFieldSettings
}

export function getFieldSettingsFromUiConfig(uiConfig) {
  const fieldSettings = {}
  if (uiConfig && uiConfig.fields) {
    for (const [field, config] of Object.entries(uiConfig.fields)) {
      if (config.widget in WIDGET_REGISTRY) {
        const settingsFn = WIDGET_REGISTRY[config.widget]
        fieldSettings[field] = settingsFn(config)
      } else {
        console.warn(`Unknown widget type: ${config.widget}`)
      }
    }
  }
  return fieldSettings
}