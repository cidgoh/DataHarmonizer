/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportBioSample = (baseName, hot, data, xlsx, fileType) => {
  // Create an export table with template's headers (2nd row) and remaining rows of data
  const ExportHeaders = new Map([
    ['sample_name', []],
    ['bioproject_accession',[]],
    ['GISAID_accession',[]],
    ['collected_by', []],
    ['sequenced_by',       []],
    ['sample collection date',[]],

    ['geo_loc_name',
      [
        'geo_loc_name (country)',
        'geo_loc_name (province/territory)'
      ]
    ],
    ['organism',[]],
    ['isolate',[]],
    ['GISAID_virus_name',[]],
    ['purpose_of_sampling',[]],
    ['description',[]],
    ['isolation_source',     
      ['anatomical material','anatomical part','body product','environmental material','environmental site','collection device','collection method']],
    ['anatomical_material',    []],
    ['anatomical_part',[]],
    ['body_product',[]],
    ['environmental_material',[]],
    ['environmental_site',  []],
    ['collection_device',[]],
    ['collection_method',   []],
    ['lab_host',   []],
    ['passage_history',   []],
    ['passage_method',   []],
    ['host',   []],
    ['host_health_state',   []],
    ['host_disease_outcome',   []],
    ['host_disease',   []],
    ['host_disease_stage',   []],
    ['host_age',   []],
    ['host_sex',   []],
    ['host_subject_id',   []],
    ['purpose_of_sequencing',   []],
    ['gene_name_1',   []],
    ['diagnostic_PCR_CT_value_1',   []],
    ['gene_name_2',   []],
    ['diagnostic_PCR_CT_value_2',   []], 
  ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'BIOSAMPLE');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|', 'BioSample') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};


// A list of the export functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "BioSample":    {'method': exportBioSample,'fileType': 'xls', 'status': 'published'},
};
