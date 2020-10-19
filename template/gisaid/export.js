
/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var export??? = (baseName, hot, data, xlsx) => {
  // ExportHeaders is an array because it can happen, as below with 'Address',
  // that a column name appears two or more times.
  const ExportHeaders = [
    ...
  ];

  // Create a map of Export format headers to template's fields. It is a 
  // one-to-many relationship, with indices representing the maps.
  const headerMap = {};
  for (const [HeaderIndex, _] of ExportHeaders.entries()) {
    headerMap[HeaderIndex] = [];
  }
  const fields = getFields(data);
  for (const [fieldIndex, field] of fields.entries()) {
    if (field.EXPORT_GRDI) {
      let HeaderIndex = ExportHeaders.indexOf(field.EXPORT_GRDI);
      headerMap[HeaderIndex].push(fieldIndex);
    }
  }

  // Create an export table with target format's headers and remaining rows of data
  const matrix = [ExportHeaders];
  const unmappedMatrix = getTrimmedData(hot);
  for (const unmappedRow of unmappedMatrix) {
    const mappedRow = [];
    for (const [HeaderIndex, HeaderName] of ExportHeaders.entries()) {
      const mappedCell = [];
      for (const mappedFieldIndex of headerMap[HeaderIndex]) {
        let mappedCellVal = unmappedRow[mappedFieldIndex];
        if (!mappedCellVal) continue;
        mappedCell.push(mappedCellVal);
      }
      mappedRow.push(mappedCell.join(';'));
    }
    matrix.push(mappedRow);
  }

  runBehindLoadingScreen(exportFile, [matrix, baseName, 'xls', xlsx]);
}

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  // "Dexa to GRDI": exportGRDI
};
