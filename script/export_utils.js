/**
 * @fileOverview Utility functions that support exporting a template to a
 * given format of export file.
 */


/**
 * Get a dictionary of source field names pointing to column index
 * @param {Object} fields A flat version of data.js.
 * @return {Dictionary<Integer>} Dictionary of all fields.
 */
const getFieldNameMap = (fields) => {
  const fieldNameMap = {};
  for (const [fieldIndex, field] of fields.entries()) {
    fieldNameMap[field.fieldName] = fieldIndex;
  }
  return fieldNameMap;
}

/**
 * Get a dictionary of one or more data source column field indexes for each
 * ExportHeader field. Exactly like getHeaderMap() below but allows for 
 * multiple columns having the same name, such as "Address"
 * @param {Array<String>} exportHeaders See `export.js`.
 * @param {Array<Object>} array of all source fields.
 * @param {String} export column prefix
 * @return {Array<Array>} array of all header export fields.
 */
const getHeaderMapDups = (exportHeaders, fields, prefix) => {
  // Create a map of Export format headers to template's fields. It is a 
  // one-to-many relationship, with indices for the map.
  const headerMap = [];
  for (const [HeaderIndex, _] of exportHeaders.entries()) {
    headerMap[HeaderIndex] = [];
  }

  for (const [fieldIndex, field] of fields.entries()) {

    if (field.exportField && prefix in field.exportField) {
      for (const target of field.exportField[prefix]) {
        if ('field' in target) {
          const HeaderIndex = exportHeaders.indexOf(target.field);
          if (HeaderIndex > -1) {
            headerMap[HeaderIndex].push(fieldIndex);
          }
          else {
            const msg = 'The EXPORT_'+prefix+' column requests a map to a non-existen field:' + target.field;
            console.log (msg);
          };
        };
      };
    };
  };
  return headerMap;
};

/**
 * Modifies exportHeaders map of fields so that each field contains an array
 * of one or more source fields by name that are used to compose it.
 * @param {Array<String>} exportHeaders See `export.js`.
 * @param {Array<Object>} array of all source fields.
 * @param {String} export column prefix
 */
const getHeaderMap = (exportHeaders, fields, prefix) => {

	for (const [fieldIndex, field] of fields.entries()) {
    if (field.exportField && prefix in field.exportField) {
      for (const target of field.exportField[prefix]) {
        if ('field' in target) {
          if (exportHeaders.has(target.field)) {
            const sources = exportHeaders.get(target.field);
            // If given field isn't already mapped, add it.
            if (sources.indexOf(field.fieldName) == -1) {
            	sources.push(field.fieldName)
              exportHeaders.set(target.field, sources);
            }
          }
          else {
            const msg = 'The EXPORT_' + prefix + ' column for ' + field.fieldName +' requests a map to a non-existen export template field:' + target.field;
            console.log (msg);
          };
        };
      };
    };
  };
};

const getMappedField = (sourceRow, sourceFieldNames, fieldNameMap, delimiter) => {
	// This provides an export field composed of one or more more input
	// fields, separated by a ';' delimiter if not null.
	const mappedCell = [];
	for (const fieldName of sourceFieldNames) {
		const mappedCellVal = sourceRow[fieldNameMap[fieldName]];
		if (!mappedCellVal) continue;
		mappedCell.push(mappedCellVal);
	};
	return mappedCell.join(delimiter);
}

/**
 * Get a dictionary of empty arrays for each ExportHeader field
 * FUTURE: enable it to work with hierarchic vocabulary lists
 *
 * @param {Array<String>} sourceRow array of values to be exported.
 * @param {Array<String>} sourceFields list of source fields to examine for mappings.
 * @param {Array<Array>} RuleDB list of export fields modified by rules.
 * @param {Array<Array>} fields list of export fields modified by rules.
 * @param {Array<Integer>} fieldNameMap map of field names to column index.
 * @param {String} prefix of export format to examine.
 * @return {Array<Object>} fields Dictionary of all fields.
 */

const getRowMap = (sourceRow, sourceFields, RuleDB, fields, fieldNameMap, prefix) => {
  for (const fieldName of sourceFields) {
  	const sourceIndex = fieldNameMap[fieldName];
    let value = sourceRow[sourceIndex]; // All text values.
    // Sets source field to data value so that rules can reference it easily.
    RuleDB[fieldName] = value;
    // Check to see if value is in vocabulary of given select field, and if it
    // has a mapping for export to a GRDI target field above, then set target
    // to value.
    if (value && value.length > 0) {
      const vocabulary = fields[sourceIndex].vocabulary;
      if (value in vocabulary) { 
        const term = vocabulary[value];
        // Looking for term.exportField['GRDI'] for example:
        if ('exportField' in term && prefix in term.exportField) {
          for (let mapping of term.exportField[prefix]) {
            // Here mapping involves a value substitution
            if ('value' in mapping) {
              value = mapping.value;
              // Changed on a copy of data, not handsongrid table
              sourceRow[sourceIndex] = value;
            };
            if ('field' in mapping && mapping['field'] in RuleDB) {
                RuleDB[mapping['field']] = value;
            };
          };
        };
      };
    };
  };
};
