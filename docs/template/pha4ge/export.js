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
    ['sample_title',            []],
    ['bioproject_accession',    []],

    //['attribute_package',       []], Removed May 12, 2021

    ['organism',                []],
    ['collected_by',            []],
    ['collection_date',         []],
    ['geo_loc_name',            [
        'geo_loc_name (country)',
        'geo_loc_name (state/province/territory)',
        'geo_loc name (county/region)',
        'geo_loc_name (city)'
      ]
    ],
    ['host',                    []],
    ['host_disease',            []],
    ['isolate',                 []],
    ['isolation_source',     
      ['anatomical material','anatomical part','body product','environmental material','environmental site','collection device','collection method']],
    ['antiviral_treatment_agent', []],
    ['collection_device',       []],
    ['collection_method',       []],
    ['date_of_prior_antiviral_treat',  []],
    ['date_of_prior_sars_cov_2_infection',  []],
    ['date_of_sars_cov_2_vaccination',  []],
    ['exposure_event',          []],
    ['geo_loc_exposure',        []], 
    ['gisaid_accession',        []],
    ['gisaid_virus_name',       []],
    ['host_age',                []],
    ['host_anatomical_material', []],
    ['host_anatomical_part',    []],
    ['host_body_product',       []],
    ['environmental_material',  []], // Added
    ['environmental_site',      []], // Added
    ['host_disease_outcome',    []],
    ['host_health_state',       []],
    ['host_recent_travel_loc',  [
      'destination of most recent travel (country)',
      'destination of most recent travel (state/province/territory)',
      'destination of most recent travel (city)'
      ]
    ],
    ['host_recent_travel_return_date',  []],
    ['host_sex',                []],
    ['host_specimen_voucher',   []],
    ['host_subject_id',         []],
    ['lat_lon',                 []],
    ['passage_method',          []],
    ['passage_number',          []],
    ['prior_sars_cov_2_antiviral_treat', []],
    ['prior_sars_cov_2_infection', []],
    ['prior_sars_cov_2_vaccination', []],
    ['purpose_of_sampling',     []],
    ['purpose_of_sequencing',   []],
    ['sars_cov_2_diag_gene_name_1',   []],
    ['sars_cov_2_diag_gene_name_2',   []],
    ['sars_cov_2_diag_pcr_ct_value_1',   []],
    ['sars_cov_2_diag_pcr_ct_value_2',   []],
    ['sequenced_by',            []],
    ['vaccine_received',        []],
    ['virus_isolate_of_prior_infection', []],

  ]);

  const concatOptionsMap = new Map([
    ['Not Applicable',    null],
    ['Missing',           null],
    ['Not Collected',     null],
    ['Not Provided',      null],
    ['Restricted Access', null]
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

      /* Removed May 12, 2021
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
      */

      // Concatenate geo_loc_name field as combination of first and last level
      // of granularity, omitting null values: w,x,y,z --> x:z value
      if (headerName === 'geo_loc_name' || headerName === 'host_recent_travel_loc') {
        // Otherwise apply source (many to one) to target field transform:
        const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'NCBI_BIOSAMPLE', concatOptionsMap, true);
        // Issue: if no concatenated field content, then metadata status?
        outputRow.push(concatFirstLastField (value, ':'));
        continue;
      };
      
      if (headerName === 'isolation_source') {
        const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'NCBI_BIOSAMPLE', concatOptionsMap, true);
        outputRow.push(value);
        continue;
      }
      
      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'NCBI_BIOSAMPLE');

      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_SRA = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([
    ['sample_name',          []],
    ['bioproject_accession', []],
    ['biosample_accession',  []],
    ['library_ID',           []],
    ['title',                []],
    ['library_strategy',     []],
    ['library_source',       []],
    ['library_selection',    []],
    ['library_layout',       []],
    ['platform',             []],
    ['instrument_model',     []],
    ['design_description',   []],
    ['filetype',             []],
    ['filename',             []],
    ['filename2',            []],
    ['amplicon_pcr_primer_scheme', []],
    ['amplicon_size',        []],
    ['sequencing_protocol_name', []],
    ['raw_sequence_data_processing_method', []],
    ['dehosting_method',     []],
    ['sequence_submitter_contact_email', []],
    ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);
  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'NCBI_SRA');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  for (const inputRow of getTrimmedData(hot)) {
    const outputRow = [];
    for (const [headerName, sources] of ExportHeaders) {
      console.log(headerName, sources)
      // Otherwise apply source (many to one) to target field transform:
      const value = getMappedField(headerName, inputRow, sources, sourceFields, sourceFieldNameMap, ':', 'NCBI_SRA') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_Genbank = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([
    ['biosample_accession',    []],
    ['sample_name',            []],
    ['assembly_method',        []],
    ['assembly_method_version',[]],
    ['genome_coverage',        []],
    ['sequencing_technology',  []],
    ['reference_genome',       []],
    ['filename',               []]
  ]);

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
      const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'NCBI_Genbank') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};

var exportNCBI_Genbank_source_modifiers = (baseName, hot, data, xlsx, fileType) => {

  const ExportHeaders = new Map([
    ['Sequence_ID',        []],
    ['country',            []],
    ['host',               []],
    ['isolate',            []],
    ['collection-date',    []],
    ['isolation-source',   []],
    ['BioSample',          []],
    ['BioProject',         []]
  ]);

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
      const value = getMappedField(headerName, inputRow, sources, sourceFields,sourceFieldNameMap, ':', 'NCBI_Genbank_source_modifiers') 
      outputRow.push(value);
    }
    outputMatrix.push(outputRow);
  }

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
};


/**
 * Download grid mapped to GISAID format.
 * CODE IS IDENTICAL COPY OF canada_covid19/export.js
 *
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGISAID = (baseName, hot, data, xlsx, fileType) => {
  // ExportHeaders below is NOT a map. It is an array because it can happen,
  // as below with 'Address', that a column name appears two or more times.

  const ExportHeaders = [
    ['Submitter',               []], // submitter
    ['FASTA filename',          []], // fn
    ['Virus name',              []], // covv_virus_name
    ['Type',                    []], // covv_type
    ['Passage details/history', []], // covv_passage
    ['Collection date',         []], // covv_collection_date
    ['Location',                []], // covv_location
    ['Additional location information',[]], // covv_add_location
    ['Host',                    []], // covv_host
    ['Additional host information',[]], // covv_add_host_info
    ['Sampling Strategy',       []], // covv_sampling_strategy 
    ['Gender',                  []], // covv_gender
    ['Patient age',             []], // covv_patient_age
    ['Patient status',          []], // covv_patient_status
    ['Specimen source',         []], // covv_specimen
    ['Outbreak',                []], // covv_outbreak
    ['Last vaccinated',         []], // covv_last_vaccinated
    ['Treatment',               []], // covv_treatment
    ['Sequencing technology',   []], // covv_seq_technology
    ['Assembly method',         []], // covv_assembly_method
    ['Coverage',                []], // covv_coverage
    ['Originating lab',         []], // covv_orig_lab
    ['Address',                 []], // covv_orig_lab_addr
    ['Sample ID given by the sample provider',[]], // covv_provider_sample_id 
    ['Submitting lab',          []], // covv_subm_lab
    // Custom rule: 2nd address points to sequence submitter.
    ['Address',['sequence submitter contact address']], // covv_subm_lab_addr
    ['Sample ID given by the submitting laboratory',[]], // covv_subm_sample_id
    ['Authors',                 []] // covv_authors
  ];

// GISAID has new sampling_strategy field as of May 12, 2021
  const header_GISAID = ['submitter','fn','covv_virus_name','covv_type','covv_passage','covv_collection_date','covv_location','covv_add_location','covv_host','covv_add_host_info','covv_sampling_strategy','covv_gender','covv_patient_age','covv_patient_status','covv_specimen','covv_outbreak','covv_last_vaccinated','covv_treatment','covv_seq_technology','covv_assembly_method','covv_coverage','covv_orig_lab','covv_orig_lab_addr','covv_provider_sample_id','covv_subm_lab','covv_subm_lab_addr','covv_subm_sample_id','covv_authors'];



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
      if (headerName === 'Assembly method')
        outputRow.push(mappedCell.join(':'))
      else
        outputRow.push(mappedCell.join(';'))
    }
    outputMatrix.push(outputRow);
  }

  // Insert header fields into top row of export file
  outputMatrix.splice(0, 0, header_GISAID);

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
