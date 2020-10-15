

/**
 * Download secondary headers and grid data.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
const exportIRIDA = (baseName, hot, data, xlsx) => {
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
const exportGISAID = (baseName, hot, data, xlsx) => {
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
    'Address',
    'Sample ID given by the sample provider',
    'Submitting lab',
    'Address',
    'Sample ID given by the submitting laboratory',
    'Authors'
  ];

  // Create a map of Export format headers to template's fields. It is a 
  // one-to-many relationship, with indices representing the maps.
  const headerMap = {};
  for (const [HeaderIndex, _] of ExportHeaders.entries()) {
    headerMap[HeaderIndex] = [];
  }
  const fields = getFields(data);
  for (const [fieldIndex, field] of fields.entries()) {
    if (field.GISAID) {
      let HeaderIndex = ExportHeaders.indexOf(field.GISAID);
      // GISAID has two fields called 'Address'
      if (field.GISAID === 'Address' && field.fieldName === 'sequence submitter contact address') {
        // This locates 2nd occurance of 'Address' field in ExportHeaders
        HeaderIndex = ExportHeaders.indexOf(field.GISAID, HeaderIndex+1);
      }
      headerMap[HeaderIndex].push(fieldIndex);
    }
  }

  // Create an export table with target format's headers and remaining rows of data
  const matrix = [ExportHeaders];
  const unmappedMatrix = getTrimmedData(hot);
  for (const unmappedRow of unmappedMatrix) {
    const mappedRow = [];
    for (const [HeaderIndex, HeaderName] of ExportHeaders.entries()) {
      if (HeaderName === 'Type') {
        // Assign constant value and do next field.
        mappedRow.push('betacoronavirus');
        continue;
      }

      const mappedCell = [];
      for (const mappedFieldIndex of headerMap[HeaderIndex]) {
        let mappedCellVal = unmappedRow[mappedFieldIndex];
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
      mappedRow.push(mappedCell.join(';'));
    }
    matrix.push(mappedRow);
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
const exportLASER = (baseName, hot, data, xlsx) => {
  const ExportHeaders = [
    'Primary Specimen Identification Number',
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
    'Sequencing protocol name',
    'Gene Target #1',
    'Gene Target #1 CT Value',
    'Gene Target #2',
    'Gene Target #2 CT Value'
  ];

  // Create a map of Export format headers to template's fields. It is a 
  // one-to-many relationship, with indices representing the maps.
  const headerMap = {};
  const fieldMap = {};
  for (const [HeaderIndex, _] of ExportHeaders.entries()) {
    headerMap[HeaderIndex] = [];
  }
  const fields = getFields(data);
  for (const [fieldIndex, field] of fields.entries()) {
    fieldMap[field.fieldName] = fieldIndex;
    if (field.CNPHI) {
      const HeaderIndex = ExportHeaders.indexOf(field.CNPHI);
      if (HeaderIndex > -1)
        headerMap[HeaderIndex].push(fieldIndex);
      else {
        const msg = 'A template CNPHI field was not found in CNPHI export header list:' + field.CNPHI;
        console.log (msg);
        $('#export-to-err-msg').text(msg);
      }

    }
  }

  // Create an export table with target format's headers and remaining rows of data
  const matrix = [ExportHeaders];
  const symptoms_index = ExportHeaders.indexOf('Symptoms');
  const travel_field = 'Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date';
  const travel_index = ExportHeaders.indexOf(travel_field);

  for (const unmappedRow of getTrimmedData(hot)) {
    const mappedRow = [];
    for (const [HeaderIndex, HeaderName] of ExportHeaders.entries()) {

      if (HeaderName === 'Test Requested') {
        // Assign constant value.
        mappedRow.push('CanCOGeN Next Generation Sequencing (NGS)');
        continue;
      }

      if (HeaderName === 'Pathogen') {
        // Assign constant value.
        mappedRow.push('SARS-CoV-2');
        continue;
      }
      
      // yes/no calculated field
      if (HeaderName === 'Patient Symptomatic') {
        // Note: if this field eventually gets null values, then must do 
        // field.dataStatus check.
        mappedRow.push( mappedRow[symptoms_index] ? 'yes' : 'no' );
        continue;
      }

      // yes/no calculated field
      if (HeaderName === 'Patient Travelled') {
        // as above for field.dataStatus check.
        mappedRow.push( mappedRow[travel_index].replace(/\|/g,'').length > 0 ? 'yes' : 'no' );
        continue;
      }

      // A complicated rule about what is stored in 'Specimen Source'
      if (HeaderName === 'Specimen Source') {
        var cellValue = '';
        for (const FieldName of [
          'host (scientific name)', 
          'host (common name)', 
          'environmental material', 
          'environmental site']
          ) {
          const field = fields[fieldMap[FieldName]];
          const value = unmappedRow[fieldMap[FieldName]];

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
        mappedRow.push(cellValue);
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
          let mappedCellVal = unmappedRow[fieldMap[FieldName]];
          if (!mappedCellVal) mappedCellVal = '';
          mappedCell.push(mappedCellVal);
        }

        mappedRow.push(mappedCell.join('|'));
        continue;
      }

      // Loop through all remaining template fields that this field is mapped
      // to, and create a bar-separated list of values. EMPTY VALUES MUST STILL
      // have bar placeholder.
      const mappedCell = [];
      // Usually this has just one mapped field, but sometimes several.
      // Merged fields are separated by | bar.
      for (const mappedFieldIndex of headerMap[HeaderIndex]) {
        let mappedCellVal = unmappedRow[mappedFieldIndex];
        
        if (!mappedCellVal) 
          mappedCellVal = '';
        
        mappedCell.push(mappedCellVal);
      }
      mappedRow.push(mappedCell.join('|'));
    }
    matrix.push(mappedRow);
  }

  runBehindLoadingScreen(exportFile, [matrix, baseName, 'xls', xlsx]);
};

