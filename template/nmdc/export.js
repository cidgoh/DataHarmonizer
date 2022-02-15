/**

Download secondary headers and grid data.
@param {String} baseName Basename of downloaded file.
@param {Object} hot Handonstable grid instance.
@param {Object} data See data.js.
@param {Object} xlsx SheetJS variable.
*/
var exportGeneric = (baseName, hot, data, xlsx, fileType) => {
    // Create an export table with template's headers (2nd row) and remaining rows of data
    const matrix = [getFlatHeaders(data)[1], ...getTrimmedData(hot)];
    runBehindLoadingScreen(exportFile, [matrix, baseName, fileType, xlsx]);
};

var exportBioSample = (baseName, hot, data, xlsx, fileType) => {
  // Create an export table with template’s headers (2nd row) and remaining rows of data
  const ExportHeaders = new Map([]);
  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above)
  getHeaderMap(ExportHeaders, sourceFields, "soil_emsl_jgi_mg");
  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];
  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {
      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap)
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }
  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};


// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
    "soil_emsl_jgi_mg": {
        'method': exportBioSample,
        'fileType': 'tsv',
        'status': 'published'
    },
    //etc
};