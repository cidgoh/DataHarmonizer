
/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportIRIDA = (baseName, hot, data, xlsx, fileType) => {
  // Create an export table with template's headers (2nd row) and remaining rows of data
  const matrix = [getFlatHeaders(data)[1], ...getTrimmedData(hot)];
  runBehindLoadingScreen(exportFile, [matrix, baseName, fileType, xlsx]);
};

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
      const value = getMappedField(inputRow, sources, sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

/**
 * Download grid mapped to GISAID format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGISAID = (baseName, hot, data, xlsx, fileType) => {
  // ExportHeaders below is NOT a map. It is an array because it can happen,
  // as below with 'Address', that a column name appears two or more times.

  const ExportHeaders = [
    ['Submitter',[]],
    ['FASTA filename',[]],
    ['Virus name',[]],
    ['Type',[]],
    ['Passage details/history',[]],
    ['Collection date',[]],
    ['Location',[]],
    ['Additional location information',[]],
    ['Host',[]],
    ['Additional host information',[]],
    ['Gender',[]],
    ['Patient age',[]],
    ['Patient status',[]],
    ['Specimen source',[]],
    ['Outbreak',[]],
    ['Last vaccinated',[]],
    ['Treatment',[]],
    ['Sequencing technology',[]],
    ['Assembly method',[]],
    ['Coverage',[]],
    ['Originating lab',[]],
    ['Address',[]], // 1st address
    ['Sample ID given by the sample provider',[]],
    ['Submitting lab',[]],
    // Custom rule: 2nd address points to sequence submitter.
    ['Address',['sequence submitter contact address']],
    ['Sample ID given by the submitting laboratory',[]],
    ['Authors',[]],
  ];

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  getHeaderMap(ExportHeaders, sourceFields, 'GISAID');

  // Create an export table with target format's headers and remaining rows of data
  const outputMatrix = [Array.from(ExportHeaders, x => x[0])];
  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerIndex, headerItem] of ExportHeaders.entries()) {
      const headerName = ExportHeaders[headerIndex][0];
      const sources =    ExportHeaders[headerIndex][1];

      if (headerName === 'Type') {
        // Assign constant value and do next field.
        outputRow.push('betacoronavirus');
        continue;
      }

      const mappedCell = [];

      // Amalgamate values of all sources for given headerIndex field.
      for (const mappedFieldName of sources) {
        let sourceFieldIndex = sourceFieldNameMap[mappedFieldName];
        let mappedCellVal = inputRow[sourceFieldIndex];
        if (!mappedCellVal) continue;

        // Only map specimen processing if it is "virus passage"
        const field = sourceFields[sourceFieldIndex]
        const standardizedCellVal = mappedCellVal.toLowerCase().trim();

        if (field.fieldName === 'specimen processing') {
          // Specimen processing is a multi-select field
          const standardizedCellValArr = standardizedCellVal.split(';');
          if (!standardizedCellValArr.includes('virus passage')) continue;
          // We only want to map "virus passage"
          mappedCellVal = 'Virus passage';
        }

        // All null values should be converted to "Unknown"
        if (field.dataStatus) {
          const standardizedDataStatus =
              field.dataStatus.map(val => val.toLowerCase().trim());
          if (standardizedDataStatus.includes(standardizedCellVal)) {
            // Don't push "Unknown" to fields with multi, concat mapped values
            if (sources.length > 1) continue;

            mappedCellVal = 'Unknown';
          }
        }

        // Add 'passage number ' prefix to number.
        if (field.fieldName === 'passage number') {
          mappedCellVal = 'passage number ' + mappedCellVal;
        }

        mappedCell.push(mappedCellVal);
      }
      outputRow.push(mappedCell.join(';'));
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

/**
 * Download grid mapped to CNPHI LaSER format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportLASER = (baseName, hot, data, xlsx, fileType) => {
  const ExportHeaders = new Map([
    ['Primary Specimen ID', []],
    ['Related Specimen ID|Related Specimen Relationship Type',[]],
    ['BioProject Accession',[]],
    ['BioSample Accession', []],
    ['SRA Accession',       []],
    ['Patient Sample Collected Date',[]],
    ['Patient Country',     []],
    ['Patient Province',    []],
    ['GISAID Virus Name',   []],
    ['Pathogen',            []], //'SARS-CoV-2'],
    ['Reason for Sampling', []],
    ['Test Requested',      []], //'CanCOGeN Next Generation Sequencing (NGS)'],
    ['Specimen Type',       []],
    ['Anatomical Material', []],
    ['Anatomical Site',     []],
    ['Body Product',        []],
    ['Environmental Material',[]], 
    ['Environmental Site',  []],
    ['Specimen Collection Matrix',[]],
    ['Collection Method',   []],
    ['Animal Type',         []],
    ['Specimen Source',     []],
    ['Host Health State',   []],
    ['Host Health State Details',[]],
    ['Host Disease',        []],
    ['Patient Age',         []],
    ['Host Age Category',   []],
    ['Patient Sex',         []],
    ['Symptoms Onset Date', []],
    ['Symptoms',            []],
    ['Patient Symptomatic', []],
    ['Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date',
      [
        'destination of most recent travel (country)',
        'destination of most recent travel (state/province/territory)',
        'destination of most recent travel (city)',
        'most recent travel departure date',
        'most recent travel return date'
      ]
    ],
    ['Patient Travelled',[]],
    ['Exposure Event',[]],
    ['Sequencing Centre',[]],
    ['Sequencing protocol name',[]],
    ['Gene Target #1',[]],
    ['Gene Target #1 CT Value',[]],
    ['Gene Target #2',[]],
    ['Gene Target #2 CT Value',[]],
    ['additional comments',[]]
  ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'CNPHI');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {

      if (headerName === 'Test Requested') {
        // Assign constant value.
        outputRow.push('CanCOGeN Next Generation Sequencing (NGS)');
        continue;
      }

      if (headerName === 'Pathogen') {
        // Assign constant value.
        outputRow.push('SARS-CoV-2');
        continue;
      }
      
      // yes/no calculated field
      if (headerName === 'Patient Symptomatic') {
        // Note: if this field eventually gets null values, then must do 
        // field.dataStatus check.
        const value = inputRow[sourceFieldNameMap['signs and symptoms']] || '';
        outputRow.push( value ? 'yes' : 'no' );
        continue;
      }

      // Change in delimiter
      if (headerName === 'Symptoms') {
        const value = inputRow[sourceFieldNameMap['signs and symptoms']] || '';
        outputRow.push(value.replace(/;/g,'~') );
        continue;
      }
      
      // yes/no field calculated from long conglomerated travel fields +
      // travel history
      if (headerName === 'Patient Travelled') {
        // as above for field.dataStatus check.
        const travel_field = 'Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date';
        const travel_index = outputMatrix[0].indexOf(travel_field);
        // Look for any content besides bar separators        
        let travelled = outputRow[travel_index].replace(/\|/g,'').length > 0;
        const travel_history = inputRow[sourceFieldNameMap['travel history']];
        travelled = travelled || (travel_history && travel_history.length > 0);
        outputRow.push( travelled ? 'yes' : 'no' );
        continue;
      }

      // Can't accept 'Human' for 'Animal Type' value.
      if (headerName === 'Animal Type') {
        let value = inputRow[sourceFieldNameMap['host (common name)']];
        if (value === 'Human') {
          value = null;
        }
        outputRow.push(value); //
        continue;
      }

      // A complicated rule about what is stored in 'Specimen Source'
      if (headerName === 'Specimen Source') {
        let cellValue = '';
        for (const fieldName of [
          'host (scientific name)', 
          'host (common name)', 
          'environmental material', 
          'environmental site']
          ) {
          const field = sourceFields[sourceFieldNameMap[fieldName]];
          const value = inputRow[sourceFieldNameMap[fieldName]];

          // Ignore all null value types
          if (!value || field.dataStatus.indexOf(value) >= 0) {
            continue;
          }
          if (fieldName === 'host (scientific name)' || fieldName === 'host (common name)') {
            if (value === 'Homo sapiens' || value === 'Human')
              cellValue = 'Human'
            else
              cellValue = 'Animal'
            break;
          }
          if (fieldName === 'environmental material' || fieldName === 'environmental site') {
              cellValue = 'Environmental'
            break;
          }
        }
        outputRow.push(cellValue);
        continue;
      }

      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(inputRow, sources, sourceFieldNameMap, '|') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "IRIDA":        {'method': exportIRIDA, 'fileType': 'xls', 'status': 'published'},
  "GISAID":       {'method': exportGISAID,'fileType': 'xls', 'status': 'published'},
  "BioSample":    {'method': exportBioSample,'fileType': 'xls', 'status': 'published'},
  "CNPHI LaSER":  {'method': exportLASER, 'fileType': 'csv (ASCII)', 'status': 'published'}
};

