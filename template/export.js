// A list of the export functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  /*
    Example_Format_Name: {
    'fileType': 'xls', // or 'xlsx', 'tsv', 'csv'
    'status': 'published', // or 'draft'
    method: function (dh) {
      // Conversion code
      const ExportHeaders = new Map([
        ['sample_name', [optional list of source fields to join values from; delimiter is usually semicolon]],
        /// ... list of export table fields in order.
      ])

      const sourceFields = dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above) 
      dh.getHeaderMap(ExportHeaders, sourceFields, 'BIOSAMPLE');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        for (const [headerName, sources] of ExportHeaders) {

          // Any custom rules here for data conversions
          
          // Otherwise apply source (many to one) to target field transform:
          const value = dh.getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'BIOSAMPLE') 
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix
    }
  */
};
