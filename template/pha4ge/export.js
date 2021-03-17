/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportNCBI_BioSample = (baseName, hot, data, xlsx, fileType) => {
  // Create an export table with template's headers (2nd row) and remaining rows of data
  const ExportHeaders = new Map([
    ['sample_name',             []],
    ['bioproject_accession',    []],
    ['GISAID_accession',        []],
    ['collected_by',            []],
    ['sequenced_by',            []],
    ['sample collection date',  []],

    ['geo_loc_name',
      [
        'geo_loc_name (country)',
        'geo_loc_name (province/territory)'
      ]
    ],
    ['organism',                []],
    ['isolate',                 []],
    ['GISAID_virus_name',       []],
    ['purpose_of_sampling',     []],
    ['attribute_package',       []],
    ['description',             []],
    ['isolation_source',     
      ['anatomical material','anatomical part','body product','environmental material','environmental site','collection device','collection method']],
    ['anatomical_material',     []],
    ['anatomical_part',         []],
    ['body_product',            []],
    ['environmental_material',  []],
    ['environmental_site',      []],
    ['collection_device',       []],
    ['collection_method',       []],
    ['lab_host',                []],
    ['passage_history',         []],
    ['passage_method',          []],
    ['host',                    []],
    ['host_health_state',       []],
    ['host_disease_outcome',    []],
    ['host_disease',            []],
    ['host_disease_stage',      []],
    ['host_age',                []],
    ['host_sex',                []],
    ['host_subject_id',         []],
    ['purpose_of_sequencing',   []],
    ['gene_name_1',             []],
    ['diagnostic_PCR_CT_value_1',  []],
    ['gene_name_2',             []],
    ['diagnostic_PCR_CT_value_2', []] 
  ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'NCBI_BIOSAMPLE');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

    	if (headerName === 'attribute_package') {
    		// This export has extra "attribute_package" with values 
    		// "Pathogen.cl" and "Pathogen.env". Pathogen.cl means the sample
    		// is a clinical pathogen and this value should be output if the
    		// sample has host information (i.e. most will be human clinical
    		// samples so most should have Pathogen.cl as a value). Anything 
    		// that doesn't have host info, should be output as Pathogen.env.
    		const value = inputRow[sourceFieldNameMap['host (scientific name)']] || null;
        	outputRow.push( value ? 'Pathogen.cl' : 'Pathogen.env' );
    		continue;
    	}
      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|', 'BioSample') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_SRA = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([]);
  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'NCBI_SRA');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_Genbank = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([]);
  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'NCBI_Genbank');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_Genbank_source_modifiers = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([]);
  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'NCBI_Genbank_source_modifiers');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};


var exportGISAID = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([]);
  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'GISAID');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFields,sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

// A list of the export functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "NCBI_BioSample": {'method': exportNCBI_BioSample,'fileType': 'xls', 'status': 'published'},
  "NCBI_SRA": {'method': exportNCBI_SRA,'fileType': 'xls', 'status': 'published'},
  "NCBI_Genbank": {'method': exportNCBI_Genbank,'fileType': 'xls', 'status': 'published'},
  "NCBI_Genbank_source_modifiers": {'method': exportNCBI_Genbank_source_modifiers,'fileType': 'xls', 'status': 'published'},
  "GISAID": {'method': exportGISAID,'fileType': 'xls', 'status': 'published'}

};
