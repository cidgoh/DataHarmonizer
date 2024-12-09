// Adds existing functions/methods to DataHarminizer.
export default {
  /**
   * Download secondary headers and grid data.
   * @param {String} baseName Basename of downloaded file.
   * @param {Object} hot Handonstable grid instance.
   * @param {Object} data See `data.js`.
   * @param {Object} xlsx SheetJS variable.
   */

  BioSample: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      // Create an export table with template's headers (2nd row) and remaining rows of data
      const ExportHeaders = new Map([
        ['sample_name', []],
				['bioproject_accession',[]],
				['attribute_package',[]],				
				['GISAID_accession',[]],
				['GISAID_virus_name',[]],
				['collection_date',[]],
				['collected_by', []],
				['sequenced_by',       []],
				['sequence_submitted_by',       []],

				//['sample collection date',[]],

        [
          'geo_loc_name',
          ['geo_loc_name (country)', 'geo_loc_name (province/territory)'],
        ],
        ['organism', []],
        ['isolate', []],
        [
          'isolation_source',
          [
            'anatomical material',
            'anatomical part',
            'body product',
            'environmental material',
            'environmental site',
            'collection device',
            'collection method',
          ],
        ],
        ['anatomical_material', []],
        ['anatomical_part', []],
        ['body_product', []],
        ['environmental_material', []],
        ['environmental_site', []],
        ['collection_device', []],
        ['collection_method', []],
        ['lab_host', []],
        ['passage_history', []],
        ['passage_method', []],
        ['host', []],
        ['host_disease', []],
        ['host_health_state', []],
        ['host_disease_outcome', []],
        ['host_age', []],
        ['host_age_unit',   []],	
				['host_age_bin',   []],	
        ['host_sex', []],
        ['host_subject_id', []],
        ['purpose_of_sampling',[]],
        ['purpose_of_sequencing', []],
        ['gene_name_1', []],
        ['diagnostic_PCR_CT_value_1', []],
        ['gene_name_2', []],
        ['diagnostic_PCR_CT_value_2', []],
        ['description',[]],
      ]);

      const sourceFields = dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'BIOSAMPLE');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        for (const [headerName, sources] of ExportHeaders) {
          // Otherwise apply source (many to one) to target field transform:
          const value = dh.getMappedField(
            headerName,
            inputRow,
            sources,
            sourceFields,
            sourceFieldNameMap,
            ':',
            'BIOSAMPLE'
          );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    },
  },

  /**
   * Download grid mapped to GISAID format.
   * CODE IS IDENTICAL COPY OF canada_covid19/export.js
   *
   * @param {String} baseName Basename of downloaded file.
   * @param {Object} hot Handonstable grid instance.
   * @param {Object} dh tabular data.
   * @param {Object} xlsx SheetJS variable.
   */
  GISAID: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      // ExportHeaders below is NOT a map. It is an array because it can happen,
      // as below with 'Address', that a column name appears two or more times.

      const ExportHeaders = [
        ['Submitter',         []], // submitter
        ['FASTA filename',    []], // fn
        ['Virus name',        []], // pox_virus_name
        ['Passage details/history', []], // covv_passage
        ['Collection date',   []], // pox_collection_date
        ['Location',          []], // pox_location
        ['Additional location information', []], // covv_add_location
        ['Host',              []], // pox_host
        ['Additional host information', []], // covv_add_host_info
        ['Sampling Strategy', []], // pox_sampling_strategy
        ['Gender',            []], // pox_gender
        ['Patient age',       []], // pox_patient_age
        ['Patient status',    []], // pox_patient_status
        ['Specimen source',   []], // pox_specimen
        ['Outbreak',          []], // pox_outbreak
        ['Last vaccinated',   []], // pox_last_vaccinated
        ['Treatment',         []], // pox_treatment
        ['Sequencing technology', []], // pox_seq_technology
        ['Assembly method',   []], // pox_assembly_method
        ['Depth of coverage', ['depth_of_coverage_value']], // pox_coverage
        ['Originating lab',   []], // pox_orig_lab
        ['Address',           ['sample_collector_contact_address']], // pox_orig_lab_addr
        ['Sample ID given by the sample provider', []], // pox_provider_sample_id
        ['Submitting lab',    []], // pox_subm_lab
        // Custom rule: 2nd address points to sequence submitter.
        ['Address',           ['sequence_submitter_contact_address']], // pox_subm_lab_addr
        ['Sample ID given by the submitting laboratory', ['specimen_collector_sample_id']], // pox_subm_sample_id
        ['Authors', []], // covv_authors
      ];

      // GISAID has new sampling_strategy field as of May 12, 2021
      const header_GISAID = [
        'submitter',
        'fn',
        'pox_virus_name',
        'pox_passage',
        'pox_collection_date',
        'pox_location',
        'pox_add_location',
        'pox_host',
        'pox_add_host_info',
        'pox_sampling_strategy',
        'pox_gender',
        'pox_patient_age',
        'pox_patient_status',
        'pox_specimen',
        'pox_outbreak',
        'pox_last_vaccinated',
        'pox_treatment',
        'pox_seq_technology',
        'pox_assembly_method',
        'pox_coverage',
        'pox_orig_lab',
        'pox_orig_lab_addr',
        'pox_provider_sample_id',
        'pox_subm_lab',
        'pox_subm_lab_addr',
        'pox_subm_sample_id',
        'pox_authors'];

      const sourceFields = dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(ExportHeaders, sourceFields, 'GISAID');

      // Create an export table with target format's headers and remaining rows of data
      const outputMatrix = [Array.from(ExportHeaders, (x) => x[0])];
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        for (const [headerIndex] of ExportHeaders.entries()) {
          const headerName = ExportHeaders[headerIndex][0];
          const sources = ExportHeaders[headerIndex][1];

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
            const field = sourceFields[sourceFieldIndex];
            const standardizedCellVal = mappedCellVal.toLowerCase().trim();

            // NOT APPLICABLE TO GISAID? Oct 25, 2024
            if (field.fieldName === 'specimen processing') {
              // Specimen processing is a multi-select field
              const standardizedCellValArr = standardizedCellVal.split(';');
              if (!standardizedCellValArr.includes('virus passage')) 
                continue;
              // We only want to map "virus passage"
              mappedCellVal = 'Virus passage';
            }

            // All null values should be converted to "Unknown"
            if (field.dataStatus) {
              const standardizedDataStatus = field.dataStatus.map((val) =>
                val.toLowerCase().trim()
              );
              if (standardizedDataStatus.includes(standardizedCellVal)) {
                // Don't push "Unknown" to fields with multi, concat mapped values
                if (sources.length > 1) continue;

                mappedCellVal = 'Unknown';
              }
            }

            // Add 'passage number ' prefix to number.
            // APPEARS UNUSED Oct 25 2024 in Mpox specification
            if (field.fieldName === 'passage number') {
              mappedCellVal = 'passage number ' + mappedCellVal;
            }

            mappedCell.push(mappedCellVal);
          }
          if (headerName === 'Assembly method') {
            outputRow.push(mappedCell.join(' '));
          } else {
            outputRow.push(mappedCell.join(';'));
          }
        }
        outputMatrix.push(outputRow);
      }

      // Insert header fields into top row of export file
      outputMatrix.splice(0, 0, header_GISAID);

      return outputMatrix;
    },
  },

  /**
   * Download grid mapped to NML_LIMS format.
   * @param {String} baseName Basename of downloaded file.
   * @param {Object} dh.hot Handonstable grid instance.
   * @param {Object} data See `data.js`.
   * @param {Object} xlsx SheetJS variable.
   */

  'NML LIMS': {
    fileType: 'csv',
    pertains_to: ['Mpox'],
    status: 'published',
    method: function (dh) {
      // A full export table field list enables ordering of these fields in export
      // output, rather than having them ordered by template column occurance.
      // These are the minimal fields required here, since the remaining fields
      // mentioned in data.js are added to ExportHeaders.  However these fields
      // aren't ordered nicely on their own, so we include the manual full list.
      /*
			const ExportHeaders = new Map([
				['PH_SPECIMEN_SOURCE',      []], // Calculated field (not in import)
				['VE_SYMP_AVAIL',           []]  // Calculated field (not in import)
			]);
			*/

      const ExportHeaders = new Map([
        ['TEXT_ID', []],
        //['HC_TEXT5',                []],
        //['PH_ID_NUMBER_PRIMARY',    []],
        ['PH_CASE_ID',              []],
        ['PH_RELATED_PRIMARY_ID', []],




        ['CUSTOMER', []],
        ['PH_SEQUENCING_CENTRE', []],
        ['PH_SEQUENCE_SUBMITTER', []],
        ['HC_COLLECT_DATE', []],
        ['HC_TEXT2', []],
        ['HC_COUNTRY', []],
        ['HC_PROVINCE', []],
        ['HC_CURRENT_ID', []],
        ['SUBMISSIONS - BioProject Accession', []],
				['SUBMISSIONS - BioSample Accession', []],
				['SUBMISSIONS - SRA Accession', []],
				['SUBMISSIONS - GenBank Accession', []],
				['SUBMISSIONS - GISAID Virus Name', []],
				['SUBMISSIONS - GISAID Accession', []],

        ['HC_SAMPLE_CATEGORY', []],
        ['PH_SAMPLING_DETAILS', []],
        ['PH_SPECIMEN_TYPE', []],
        ['PH_RELATED_RELATIONSHIP_TYPE', []],
        ['PH_ISOLATION_SITE_DESC', []],
        ['PH_ISOLATION_SITE', []],
        ['PH_SPECIMEN_SOURCE', []], // Calculated field (not in import)
        ['PH_SPECIMEN_SOURCE_DESC', []],
        //['PH_ENVIRONMENTAL_MATERIAL', []],
        //['PH_ENVIRONMENTAL_SITE',   []],
        ['PH_SPECIMEN_TYPE_ORIG', []],
        ['COLLECTION_METHOD', []],
        ['PH_ANIMAL_TYPE',          []],
        ['PH_HOST_HEALTH',          []],
        ['PH_HOST_HEALTH_DETAILS',  []],
        ['PH_HOST_HEALTH_OUTCOME',  []],
        ['PH_HOST_DISEASE', []],
        ['PH_AGE',                  []],
        ['PH_AGE_UNIT',             []],
        ['PH_AGE_GROUP',            []],
        ['VD_SEX',                  []],
        ['PH_HOST_COUNTRY',         []],
        ['PH_HOST_PROVINCE',        []],
        ['HC_ONSET_DATE',           []],
        ['HC_SYMPTOMS',             []],
        ['PH_VACCINATION_HISTORY',  []],
        ['VE_SYMP_AVAIL',           []], // Calculated field (not in import)
        ['PH_EXPOSURE_COUNTRY',     []],
        ['PH_TRAVEL', []],
        //['PH_POINT_OF_ENTRY',       []],
        //['PH_DAY',                  []],
        ['PH_EXPOSURE',             []],
        ['PH_EXPOSURE_DETAILS',     []],
        ['PH_HOST_ROLE',            []],
        ['PH_REASON_FOR_SEQUENCING', []],
        ['PH_REASON_FOR_SEQUENCING_DETAILS', []],
        ['PH_SEQUENCING_DATE', []],
        ['PH_LIBRARY_PREP_KIT', []],

        ['PH_SEQUENCING_INSTRUMENT', []],
        ['PH_TESTING_PROTOCOL', []],
        //['PH_SEQ_PROTOCOL_NAME',     []],
        ['PH_RAW_SEQUENCE_METHOD', []],
        ['PH_DEHOSTING_METHOD', []],

        ['PH_CONSENSUS_SEQUENCE', []], // from 'Consensus Sequence Method Name' or 'consensus sequence software name'
        ['PH_CONSENSUS_SEQUENCE_VERSION', []], // From 'Consensus Sequence Method Version Name' or 'consensus sequence software version'
        ['PH_BIOINFORMATICS_PROTOCOL', []],
        //['PH_LINEAGE_CLADE_NAME',   []],
        //['PH_LINEAGE_CLADE_SOFTWARE',[]],
        //['PH_LINEAGE_CLADE_VERSION',[]],
        //['PH_VARIANT_DESIGNATION',  []],
        //['PH_VARIANT_EVIDENCE',     []],
        //['PH_VARIANT_EVIDENCE_DETAILS', []],
        ['SUBMITTED_RESLT - Gene Target #1',   []], 
				['SUBMITTED_RESLT - Gene Target #1 CT Value', []],
				['SUBMITTED_RESLT - Gene Target #2',   []],
				['SUBMITTED_RESLT - Gene Target #2 CT Value', []],
				['SUBMITTED_RESLT - Gene Target #3',   []],
				['SUBMITTED_RESLT - Gene Target #3 CT Value', []],
				['SUBMITTED_RESLT - Gene Target #4',   []],
				['SUBMITTED_RESLT - Gene Target #4 CT Value', []],
				['SUBMITTED_RESLT - Gene Target #5',   []],
				['SUBMITTED_RESLT - Gene Target #5 CT Value', []],

        ['PH_SEQUENCING_AUTHORS', []],
        ['HC_COMMENTS', []],

        ['sample collector contact email', []],
        ['sample collector contact address', []],

        ['sequenced by contact email', []],
        ['sequenced by contact address', []],

        ['sequence submitter contact email', []],
        ['sequence submitter contact address', []],

        ['sample received date', []],

        ['host (scientific name)', []],

        ['geo_loc_name (city)', []],

        ['breadth of coverage value', []],
        ['depth of coverage value', []],
        ['depth of coverage threshold', []],
        ['number of base pairs sequenced', []],
        ['consensus genome length', []],
      ]);

      const sourceFields = dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      const sourceFieldTitleMap = dh.getFieldTitleMap(sourceFields);

      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'NML_LIMS');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      const nullOptionsMap = new Map([
        ['not applicable', 'Not Applicable'],
        ['missing', 'Missing'],
        ['not collected', 'Not Collected'],
        ['not provided', 'Not Provided'],
        ['restricted access', 'Restricted Access'],
      ]);

      const null_values = new Set([
        'Not Applicable',
        'Missing',
        'Not Collected',
        'Not Provided',
        'Restricted Access',
      ]);

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];

        for (const [headerName, sources] of ExportHeaders) {
          if (headerName === 'HC_CURRENT_ID') {
            // Assign constant value.
            outputRow.push('Monkeypox virus');
            continue;
          }

          // yes/no calculated field
          if (headerName === 'VE_SYMP_AVAIL') {
            // Note: if this field eventually gets null values, then must do
            // field.dataStatus check.
            const value =
              inputRow[sourceFieldTitleMap['signs and symptoms']] || '';
            outputRow.push(value ? 'Y' : 'N');
            continue;
          }

          // Handle granularity of "HC_COLLECT_DATE"
          // by looking at year or month in "sample collection date precision"
          if (headerName === 'HC_COLLECT_DATE') {
            let value =
              inputRow[sourceFieldTitleMap['sample collection date']] || '';
            const date_unit =
              inputRow[sourceFieldTitleMap['sample collection date precision']];
            outputRow.push(dh.setDateChange(date_unit, value, '01'));
            continue;
          }

          // A complicated rule about what is stored in 'Specimen Source'
          // Note that common name field will override scientific name in
          // export to PH_SPECIMEN_SOURCE
          if (headerName === 'PH_SPECIMEN_SOURCE') {
            let cellValue = '';
            for (const fieldName of [
              'host (scientific name)',
              'host (common name)',
              'environmental material',
              'environmental site',
            ]) {
              const value = inputRow[sourceFieldTitleMap[fieldName]];

              // Ignore all null value types
              if (!value || null_values.has(value)) {
                continue;
              }
              // value = value.toLowerCase(); //Only in CanCoGEN
              if (
                fieldName === 'host (scientific name)' ||
                fieldName === 'host (common name)'
              ) {
                if (value === 'Homo sapiens' || value === 'Human')
                  cellValue = 'Human';
                else 
                  cellValue = 'ANIMAL';
                break;
              }
              if (
                fieldName === 'environmental material' ||
                fieldName === 'environmental site'
              ) {
                cellValue = 'ENVIRO';
                break;
              }
            }
            outputRow.push(cellValue);
            continue;
          }

          // Otherwise apply source (many to one) to target field transform:
          let value = dh.getMappedField(
            headerName,
            inputRow,
            sources,
            sourceFields,
            sourceFieldNameMap,
            ';',
            'NML_LIMS'
          );

          let val_array = value.split(';');
          val_array = val_array.map((element) =>
            dh.fixNullOptionCase(element.trim(), nullOptionsMap)
          );
          if (val_array.length > 1) {
            //Make unique any null values in multiple-select concatenated field.
            let val_set = new Set(val_array);

            // Search for null values and remove them. Using forEach format
            // forEach(callbackFn, thisArg) i.e. val_set.delete(null_value)
            null_values.forEach(Set.prototype.delete, val_set);
            if (val_set.size == 0)
              // set was all null values so reset list
              val_set = new Set(val_array);
            val_array = [...val_set];
          }
          value = val_array.join(';');

          // For any exported field that might mention a null value (not just
          // ones with null value picklist defined)
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    },
  },
};
