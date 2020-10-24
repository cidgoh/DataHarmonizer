
/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportIRIDA = (baseName, hot, data, xlsx) => {
  // Create an export table with template's headers (2nd row) and remaining rows of data
  const matrix = [getFlatHeaders(data)[1], ...getTrimmedData(hot)];
  runBehindLoadingScreen(exportFile, [matrix, baseName, 'xls', xlsx]);
};

/**
 * Download grid mapped to GISAID format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGISAID = (baseName, hot, data, xlsx) => {
  // TODO: As we add more formats, we should add such headers to 'data.js'
  // ExportHeaders is an array because it can happen, as below with 'Address',
  // that a column name appears two or more times.
  const ExportHeaders = [
    'Submitter',
    'FASTA filename',
    'Virus name',
    'Type',
    'Passage details/history',
    'Collection date',
    'Location',
    'Additional location information',
    'Host',
    'Additional host information',
    'Gender',
    'Patient age',
    'Patient status',
    'Specimen source',
    'Outbreak',
    'Last vaccinated',
    'Treatment',
    'Sequencing technology',
    'Assembly method',
    'Coverage',
    'Originating lab',
    'Address', // 1st address
    'Sample ID given by the sample provider',
    'Submitting lab',
    'Address', // 2nd address
    'Sample ID given by the submitting laboratory',
    'Authors'
  ];

  const fields = getFields(data);
  const fieldNameMap = getFieldNameMap(fields);
  const headerMap = getHeaderMapDups(ExportHeaders, fields, 'GISAID');

  // Custom rule: 2 addresses above. 2nd one points to sequence submitter.
  const lastAddressIndex = ExportHeaders.lastIndexOf('Address');
  const targetAddressIndex = fieldNameMap['sequence submitter contact address'];
  headerMap[lastAddressIndex].push(targetAddressIndex);

  // Create an export table with target format's headers and remaining rows of data
  const matrix = [ExportHeaders];
  const inputMatrix = getTrimmedData(hot);
  for (const inputRow of inputMatrix) {
    const outputRow = [];
    for (const [HeaderIndex, HeaderName] of ExportHeaders.entries()) {
      if (HeaderName === 'Type') {
        // Assign constant value and do next field.
        outputRow.push('betacoronavirus');
        continue;
      }

      const mappedCell = [];
      for (const mappedFieldIndex of headerMap[HeaderIndex]) {
        let mappedCellVal = inputRow[mappedFieldIndex];
        if (!mappedCellVal) continue;

        // Only map specimen processing if it is "virus passage"
        const field = fields[mappedFieldIndex]
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
            if (headerMap[HeaderIndex].length > 1) continue;

            mappedCellVal = 'Unknown';
          }
        }

        if (field.fieldName === 'passage number') {
          mappedCellVal = 'passage number ' + mappedCellVal;
        }

        mappedCell.push(mappedCellVal);
      }
      outputRow.push(mappedCell.join(';'));
    }
    matrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [matrix, baseName, 'xls', xlsx]);
};

/**
 * Download grid mapped to CNPHI LaSER format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportLASER = (baseName, hot, data, xlsx) => {
  const ExportHeaders = [
    'Primary Specimen ID',
    'Related Specimen ID|Related Specimen Relationship Type',
    'BioProject Accession',
    'BioSample Accession',
    'SRA Accession',
    'Patient Sample Collected Date',
    'Patient Country',
    'Patient Province',
    'GISAID Virus Name',
    'Pathogen',
    'Reason for Sampling',
    'Test Requested',
    'Specimen Type',          
    'Anatomical Material',
    'Anatomical Site',
    'Body Product',
    'Environmental Material',   
    'Environmental Site',
    'Specimen Collection Matrix',
    'Collection Method',
    'Animal Type',
    'Specimen Source', 
    'Host Health State',
    'Host Health State Details',
    'Host Disease',
    'Patient Age',
    'Host Age Category',
    'Patient Sex',
    'Symptoms Onset Date',
    'Symptoms',
    'Patient Symptomatic',
    'Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date',
    'Patient Travelled',
    'Exposure Event',
    'Sequencing Centre',
    'Sequencing protocol name',
    'Gene Target #1',
    'Gene Target #1 CT Value',
    'Gene Target #2',
    'Gene Target #2 CT Value'
  ];

  const [fields, headerMap, fieldNameMap] = getHeaderMap(ExportHeaders, data, 'CNPHI');

  // Create an export table with target format's headers and remaining rows of data
  const matrix = [ExportHeaders];
  const symptoms_index = ExportHeaders.indexOf('Symptoms');
  const travel_field = 'Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date';
  const travel_index = ExportHeaders.indexOf(travel_field);

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [HeaderIndex, HeaderName] of ExportHeaders.entries()) {

      if (HeaderName === 'Test Requested') {
        // Assign constant value.
        outputRow.push('CanCOGeN Next Generation Sequencing (NGS)');
        continue;
      }

      if (HeaderName === 'Pathogen') {
        // Assign constant value.
        outputRow.push('SARS-CoV-2');
        continue;
      }
      
      // yes/no calculated field
      if (HeaderName === 'Patient Symptomatic') {
        // Note: if this field eventually gets null values, then must do 
        // field.dataStatus check.
        outputRow.push( outputRow[symptoms_index] ? 'yes' : 'no' );
        continue;
      }

      // Change in delimiter
      if (HeaderName === 'Symptoms') {
        let value = inputRow[fieldNameMap['signs and symptoms']];
        outputRow.push(value.replace(/;/g,'~') );
        continue;
      }
      
      // yes/no calculated field
      if (HeaderName === 'Patient Travelled') {
        // as above for field.dataStatus check.
        outputRow.push( outputRow[travel_index].replace(/\|/g,'').length > 0 ? 'yes' : 'no' );
        continue;
      }

      // A complicated rule about what is stored in 'Specimen Source'
      if (HeaderName === 'Specimen Source') {
        let cellValue = '';
        for (const FieldName of [
          'host (scientific name)', 
          'host (common name)', 
          'environmental material', 
          'environmental site']
          ) {
          const field = fields[fieldNameMap[FieldName]];
          const value = inputRow[fieldNameMap[FieldName]];

          // Ignore all null value types
          if (!value || field.dataStatus.indexOf(value) >= 0) {
            continue;
          }
          if (FieldName === 'host (scientific name)' || FieldName === 'host (common name)') {
            if (value === 'Homo sapiens' || value === 'Human')
              cellValue = 'Human'
            else
              cellValue = 'Animal'
            break;
          }
          if (FieldName === 'environmental material' || FieldName === 'environmental site') {
              cellValue = 'Environmental'
            break;
          }
        }
        outputRow.push(cellValue);
        continue;
      }

      // Issue is that order of merged source field items is different than
      // label of output field specifies (country and city are swapped).
      // Otherwise generic code at bottom would have been used.
      if (HeaderName === travel_field) {
        const mappedCell = [];
        for (const FieldName of [
          'destination of most recent travel (country)',
          'destination of most recent travel (state/province/territory)',
          'destination of most recent travel (city)',
          'most recent travel departure date',
          'most recent travel return date'
          ]) {
          let mappedCellVal = inputRow[fieldNameMap[FieldName]];
          if (!mappedCellVal) {mappedCellVal = ''};
          mappedCell.push(mappedCellVal);
        }

        outputRow.push(mappedCell.join('|'));
        continue;
      }

      // Loop through all remaining template fields that this field is mapped
      // to, and create a bar-separated list of values. EMPTY VALUES MUST 
      // STILL have bar placeholder.
      const mappedCell = [];
      for (const mappedFieldIndex of headerMap[HeaderIndex]) {
        let mappedCellVal = inputRow[mappedFieldIndex];
        
        if (!mappedCellVal) 
          mappedCellVal = '';
        
        mappedCell.push(mappedCellVal);
      }
      outputRow.push(mappedCell.join('|'));
    }
    matrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [matrix, baseName, 'csv', xlsx]);
};

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "IRIDA": exportIRIDA,
  "GISAID": exportGISAID,
  "CNPHI LaSER": exportLASER
};

