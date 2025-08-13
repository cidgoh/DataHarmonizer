// A dictionary of possible export formats
export default {
  NCBI_SRAGenomeTrakr: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
        ["sample_name", []],
        ["library_ID", []],
        ["title", []],
        ["library_strategy", []],
        ["library_source", []],
        ["library_selection", []],
        ["library_layout", []],
        ["platform", []],
        ["instrument_model", []],
        ["design_description", []],
        ["filetype", []],
        ["filename", []],
        ["filename2", []],
        ["filename3", []],
        ["filename4", []],
        ["assembly", []],
        ["fasta_file", []],
        ["enrichment_kit", []],
        ["amplicon_PCR_primer_scheme", []],
        ["library_preparation_kit", []],
        ["amplicon_size", []],
        ["quality_control_method", []],
        ["quality_control_method_version", []],
        ["quality_control_determination", []],
        ["quality_control_issues", []],
        ["quality_control_details", []],
        ["dehosting_method", []],
        ["sequence_submitter_contact_email", []],
        ["raw_sequence_data_processing_method", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'NCBI_SRAGenomeTrakr');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        let value;
        for (const [headerName, sources] of exportHeaders) {
          value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              '; ',
              'NCBI_SRAGenomeTrakr'
            );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },
  NCBI_SRA: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
        ["sample_name", []],
        ["library_ID", []],
        ["title", []],
        ["library_strategy", []],
        ["library_source", []],
        ["library_selection", []],
        ["library_layout", []],
        ["platform", []],
        ["instrument_model", []],
        ["design_description", []],
        ["filetype", []],
        ["filename", []],
        ["filename2", []],
        ["filename3", []],
        ["filename4", []],
        ["assembly", []],
        ["fasta_file", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'NCBI_SRA');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        let value;
        for (const [headerName, sources] of exportHeaders) {
          value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              '; ',
              'NCBI_SRA'
            );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },
  NCBI_BIOSAMPLE_SARS_COV_2_WWS: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
        ["sample_name", []],
        ["sample_title", []],
        ["bioproject_accession", []],
        ["organism", []],
        ["collection_date", []],
        ["geo_loc_name", []],
        ["isolation_source", []],
        ["ww_population", []],
        ["ww_sample_duration", []],
        ["ww_sample_matrix", []],
        ["ww_sample_type", []],
        ["ww_surv_target_1", []],
        ["ww_surv_target_1_known_present", []],
        ["collected_by", []],
        ["purpose_of_ww_sampling", []],
        ["purpose_of_ww_sequencing", []],
        ["sequenced_by", []],
        ["ww_endog_control_1", []],
        ["ww_endog_control_1_conc", []],
        ["ww_endog_control_1_protocol", []],
        ["ww_endog_control_1_units", []],
        ["ww_endog_control_2", []],
        ["ww_endog_control_2_conc", []],
        ["ww_endog_control_2_protocol", []],
        ["ww_endog_control_2_units", []],
        ["ww_flow", []],
        ["ww_industrial_effluent_percent", []],
        ["ww_ph", []],
        ["ww_population_source", []],
        ["ww_pre_treatment", []],
        ["ww_primary_sludge_retention_time", []],
        ["ww_processing_protocol", []],
        ["ww_sample_salinity", []],
        ["ww_sample_site", []],
        ["ww_surv_jurisdiction", []],
        ["ww_surv_system_sample_id", []],
        ["ww_surv_target_1_conc", []],
        ["ww_surv_target_1_conc_unit", []],
        ["ww_surv_target_1_extract", []],
        ["ww_surv_target_1_extract_unit", []],
        ["ww_surv_target_1_gene", []],
        ["ww_surv_target_1_protocol", []],
        ["ww_surv_target_2", []],
        ["ww_surv_target_2_conc", []],
        ["ww_surv_target_2_conc_unit", []],
        ["ww_surv_target_2_extract", []],
        ["ww_surv_target_2_extract_unit", []],
        ["ww_surv_target_2_gene", []],
        ["ww_surv_target_2_known_present", []],
        ["ww_surv_target_2_protocol", []],
        ["ww_temperature", []],
        ["ww_total_suspended_solids", []],
        ["description", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'NCBI_BIOSAMPLE_SARS_COV_2_WWS');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
      const outputRow = [];
      let value;
      for (const [headerName, sources] of exportHeaders) {
        
        // organism header always "wastewater metagenome"
        if (headerName === "organism") {
        value = "wastewater metagenome";
        } else {
        value = dh.getMappedField(
          headerName,
          inputRow,
          sources,
          sourceFields,
          sourceFieldNameMap,
          '; ',
          'NCBI_BIOSAMPLE_SARS_COV_2_WWS'
        );
        }
        outputRow.push(value);
      }
      outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
   },
    NCBI_BIOSAMPLE_GenomeTrakr: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
        ["sample_name", []],
        ["sample_title", []],
        ["bioproject_accession", []],
        ["organism", []],
        ["collection_date", []],
        ["collection_time", []],
        ["geo_loc_name", []],
        ["isolation_source", []],
        ["collection_site_id", []],
        ["project_name", []],
        ["collected_by", []],
        ["purpose_of_ww_sampling", []],
        ["ww_sample_site", []],
        ["ww_flow", []],
        ["instantaneous_flow", []],
        ["ww_population", []],
        ["ww_surv_jurisdiction", []],
        ["ww_population_source", []],
        ["ww_sample_matrix", []],
        ["ww_sample_type", []],
        ["collection_volume", []],
        ["ww_sample_duration", []],
        ["ww_temperature", []],
        ["ww_ph", []],
        ["ww_industrial_effluent_percent", []],
        ["ww_sample_salinity", []],
        ["ww_total_suspended_solids", []],
        ["ww_surv_system_sample_id", []],
        ["ww_pre_treatment", []],
        ["ww_primary_sludge_retention_time", []],
        ["specimen_processing", []],
        ["specimen_processing_id", []],
        ["specimen_processing_details", []],
        ["ww_processing_protocol", []],
        ["concentration_method", []],
        ["extraction_method", []],
        ["extraction_control", []],
        ["ww_endog_control_1", []],
        ["ww_endog_control_1_conc", []],
        ["ww_endog_control_1_protocol", []],
        ["ww_endog_control_1_units", []],
        ["ww_endog_control_2", []],
        ["ww_endog_control_2_conc", []],
        ["ww_endog_control_2_protocol", []],
        ["ww_endog_control_2_units", []],
        ["ww_surv_target_1", []],
        ["ww_surv_target_1_known_present", []],
        ["ww_surv_target_1_protocol", []],
        ["ww_surv_target_1_conc", []],
        ["ww_surv_target_1_conc_unit", []],
        ["ww_surv_target_1_gene", []],
        ["ww_surv_target_2", []],
        ["ww_surv_target_2_conc", []],
        ["ww_surv_target_2_conc_unit", []],
        ["ww_surv_target_2_gene", []],
        ["ww_surv_target_2_known_present", []],
        ["purpose_of_ww_sequencing", []],
        ["sequenced_by", []],
        ["description", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'NCBI_BIOSAMPLE_GenomeTrakr');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        let value;
        for (const [headerName, sources] of exportHeaders) {
          value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              '; ',
              'NCBI_BIOSAMPLE_GenomeTrakr'
            );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },
  ENA_GSC_MIxS_WW_ERC00023: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
        ["project name", []],
        ["experimental factor", []],
        ["ploidy", []],
        ["number of replicons", []],
        ["extrachromosomal elements", []],
        ["estimated size", []],
        ["reference for biomaterial", []],
        ["annotation source", []],
        ["sample volume or weight for DNA extraction", []],
        ["nucleic acid extraction", []],
        ["nucleic acid amplification", []],
        ["library size", []],
        ["library reads sequenced", []],
        ["library construction method", []],
        ["library vector", []],
        ["library screening strategy", []],
        ["target gene", []],
        ["target subfragment", []],
        ["pcr primers", []],
        ["multiplex identifiers", []],
        ["adapters", []],
        ["pcr conditions", []],
        ["sequencing method", []],
        ["sequence quality check", []],
        ["chimera check software", []],
        ["relevant electronic resources", []],
        ["relevant standard operating procedures", []],
        ["negative control type", []],
        ["positive control type", []],
        ["collection date", []],
        ["geographic location (country and/or sea)", []],
        ["geographic location (latitude)", []],
        ["geographic location (longitude)", []],
        ["geographic location (region and locality)", []],
        ["depth", []],
        ["broad-scale environmental context", []],
        ["local environmental context", []],
        ["environmental medium", []],
        ["source material identifiers", []],
        ["sample material processing", []],
        ["isolation and growth condition", []],
        ["propagation", []],
        ["amount or size of sample collected", []],
        ["oxygenation status of sample", []],
        ["organism count", []],
        ["sample storage duration", []],
        ["sample storage temperature", []],
        ["sample storage location", []],
        ["sample collection device", []],
        ["sample collection method", []],
        ["biochemical oxygen demand", []],
        ["chemical oxygen demand", []],
        ["pre-treatment", []],
        ["primary treatment", []],
        ["reactor type", []],
        ["secondary treatment", []],
        ["sludge retention time", []],
        ["tertiary treatment", []],
        ["host disease status", []],
        ["host scientific name", []],
        ["alkalinity", []],
        ["industrial effluent percent", []],
        ["sewage type", []],
        ["wastewater type", []],
        ["temperature", []],
        ["pH", []],
        ["efficiency percent", []],
        ["emulsions", []],
        ["gaseous substances", []],
        ["inorganic particles", []],
        ["organic particles", []],
        ["soluble inorganic material", []],
        ["soluble organic material", []],
        ["suspended solids", []],
        ["total phosphate", []],
        ["nitrate", []],
        ["phosphate", []],
        ["salinity", []],
        ["sodium", []],
        ["total nitrogen", []],
        ["subspecific genetic lineage", []],
        ["trophic level", []],
        ["relationship to oxygen", []],
        ["known pathogenicity", []],
        ["encoded traits", []],
        ["observed biotic relationship", []],
        ["chemical administration", []],
        ["perturbation", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'ENA_GSC_MIxS_WW_ERC00023');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        let value;
        for (const [headerName, sources] of exportHeaders) {
            if (headerName === "source material identifiers") {
            // Get the values from the input row
            const subsampleIdField = sourceFieldNameMap["specimen collector subsample ID"];
            const sampleIdField = sourceFieldNameMap["specimen collector sample ID"];
            let subsampleId = subsampleIdField !== undefined ? inputRow[subsampleIdField] : "";
            let sampleId = sampleIdField !== undefined ? inputRow[sampleIdField] : "";
            value = (subsampleId && subsampleId.trim() !== "") ? subsampleId : ((sampleId && sampleId.trim() !== "") ? sampleId : "");
          } else {
          value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              '; ',
              'ENA_GSC_MIxS_WW_ERC00023'
            );
          }
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },
  ENA_SEWAGE_ERC00036: {
    fileType: 'xlsx',
    status: 'published',
    method: function(dh) {
      const exportHeaders = new Map([
      ["name of the sampling site", []],
      ["nucleic acid extraction", []],
      ["nucleic acid amplification", []],
      ["investigation type", []],
      ["surveillance target", []],
      ["collection date", []],
      ["geographic location (country and/or sea)", []],
      ["geographic location (latitude)", []],
      ["geographic location (longitude)", []],
      ["geographic location (region and locality)", []],
      ["amount or size of sample collected", []],
      ["sample storage duration", []],
      ["sample storage temperature", []],
      ["sample storage location", []],
      ["sampling time point", []],
      ["sample transportation temperature", []],
      ["sample transportation date", []],
      ["sample transportation time", []],
      ["receipt date", []],
      ["sewage type", []],
      ["temperature", []],
      ["area of sampling site", []],
      ["size of the catchment area", []],
      ["population size of the catchment area", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'ENA_SEWAGE_ERC00036');
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        let value;
        for (const [headerName, sources] of exportHeaders) {
          value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              '; ',
              'ENA_SEWAGE_ERC00036'
            );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },
  VirusSeq_Portal: {
    fileType: 'tsv',
    status: 'published',
    method: function (dh) {
      // Create an export table with template's headers (2nd row) and remaining rows of data

      // NOTE: NULL reason fields must follow immediately after column they are about.
      const ExportHeaders = new Map([
        ['study_id', []], // Intentionally left blank.
        ['specimen collector sample ID', []],
        ['GISAID accession', []], // CAPITALIZATION Difference
        ['sample collected by', []],
        ['sequence submitted by', []],
        ['sample collection date', []],
        ['sample collection date null reason', []], // VirusSeq custom field
        ['geo_loc_name (country)', []],
        ['geo_loc_name (state/province/territory)', []],
        ['organism', []],
        ['isolate', []],
        ['fasta header name', ['isolate']],
        ['purpose of sampling', []],
        ['purpose of sampling details', []],
        ['anatomical material', []],
        ['anatomical part', []],
        ['body product', []],
        ['environmental material', []],
        ['environmental site', []],
        ['collection device', []],
        ['collection method', []],
        ['host (scientific name)', []],
        ['host disease', []],
        ['host age null reason', []], // VirusSeq custom field
        ['host age unit', []],
        ['host age bin', []],
        ['host gender', []],
        ['purpose of sequencing', []],
        ['purpose of sequencing details', []],
        ['sequencing instrument', []],
        ['sequencing protocol', []],
        ['raw sequence data processing method', []],
        ['dehosting method', []],
        ['consensus sequence software name', []],
        ['consensus sequence software version', []],
        ['breadth of coverage value', []], // Has extra "value" suffix
        ['depth of coverage value', []], // Has extra "value" suffix
        ['reference genome accession', []],
        ['bioinformatics protocol', []],
        ['gene name', []],
      ]);
      // various null options to recognize for "null reason" fields
      const // Conversion of all cancogen metadata keywords to NML LIMS version
        nullOptionsMap = new Map([
          ['not applicable', 'Not Applicable'],
          ['missing', 'Missing'],
          ['not collected', 'Not Collected'],
          ['not provided', 'Not Provided'],
          ['restricted access', 'Restricted Access'],
        ]);

      const studyMap = {
        'Alberta Precision Labs (APL)': 'ABPL-AB',
        'BCCDC Public Health Laboratory': 'BCCDC-BC',
        'Manitoba Cadham Provincial Laboratory': 'MCPL-MB',
        'New Brunswick - Vitalité Health Network': 'VHN-NB',
        'Newfoundland and Labrador - Eastern Health': 'EH-NL',
        'Nova Scotia Health Authority': 'NSHA-NS',
        'Public Health Ontario (PHO)': 'PHO-ON',
        'Laboratoire de santé publique du Québec (LSPQ)': 'LSPQ-QC',
        'Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)': 'RRPL-SK',
      };

      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'VirusSeq_Portal');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      const numeric_datatypes = new Set([
        'xsd:nonNegativeInteger',
        'xsd:decimal',
      ]);

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        var skip = false;
        for (const [headerName, sources] of ExportHeaders) {
          // Skips a column because it has already been set in previous column action.
          if (skip === true) skip = false;
          else {
            // Otherwise apply source (many to one) to target field transform:
            var value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              ':',
              'VirusSeq_Portal'
            );

            if (headerName == 'study_id') {
              // Autopopulate study_id based on studyMap
              const lab = inputRow[sourceFieldNameMap['sequence_submitted_by']];
              if (lab && lab in studyMap) {
                value = studyMap[lab];
              }
            }

            // Add % to breadth of coverage since required.
            if (
              headerName == 'breadth of coverage value' &&
              value &&
              value.length &&
              value.substr(-1) != '%'
            ) {
              value = value + '%';
            }

            // Some columns have an extra ' null reason' field for demultiplexing null value into.
            if (ExportHeaders.has(headerName + ' null reason')) {
              //headerName = source field name in this format case.
              if (sources.length > 0) {
                // field and its null reason field must be 1-1
                const sourceFieldIndex = sourceFieldNameMap[sources[0]];
                const field = sourceFields[sourceFieldIndex];
                if (field) {
                  // Null reason recognition comes from dataStatus values, or generic nullOptionsMap.
                  if (field.dataStatus && field.dataStatus.includes(value)) {
                    // Clears original value field of its null value and puts it in next column where null reason is.
                    outputRow.push('');
                    skip = true;
                  }
                  // Small gesture towards normalization: correct case
                  else if (nullOptionsMap.has(value.toLowerCase())) {
                    value = nullOptionsMap.get(value.toLowerCase());
                    outputRow.push('');
                    skip = true;
                  }
                  // If a numeric field has text in it then push that over
                  // to null reason field.  This is occuring at data export
                  // stage, after validation so text is assumed to be
                  // intentional
                  else if (
                    numeric_datatypes.has(field.datatype) &&
                    isNaN(Number(value))
                  ) {
                    outputRow.push('');
                    skip = true;
                  }
                } else
                  alert(
                    'Template configuration error: "' +
                      headerName +
                      '" has misnamed source field.'
                  );
              } else
                alert(
                  'Template configuration error: "' +
                    headerName +
                    '" has no source mapped field.'
                );
            }

            outputRow.push(value);
          }
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    }
  },
  GISAID: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      // ExportHeaders below is NOT a map. It is an array because it can happen,
      // as below with 'Address', that a column name appears two or more times.

      const ExportHeaders = [
        ['Submitter', []], // submitter
        ['FASTA filename', []], // fn
        ['Virus name', []], // covv_virus_name
        ['Type', []], // covv_type  // Not in MPox GSAID.
        ['Passage details/history', []], // covv_passage
        ['Collection date', []], // covv_collection_date
        ['Location', []], // covv_location
        ['Additional location information', []], // covv_add_location
        ['Host', []], // covv_host
        ['Additional host information', []], // covv_add_host_info
        ['Sampling Strategy', []], // covv_sampling_strategy
        ['Gender', []], // covv_gender
        ['Patient age', []], // covv_patient_age
        ['Patient status', []], // covv_patient_status
        ['Specimen source', []], // covv_specimen
        ['Outbreak', []], // covv_outbreak
        ['Last vaccinated', []], // covv_last_vaccinated
        ['Treatment', []], // covv_treatment
        ['Sequencing technology', []], // covv_seq_technology
        ['Assembly method', []], // covv_assembly_method
        ['Coverage', ['depth_of_coverage_value']], // covv_coverage
        ['Originating lab', []], // covv_orig_lab
        ['Address', ['sample_collector_contact_address']], // covv_orig_lab_addr
        ['Sample ID given by the sample provider', []], // covv_provider_sample_id
        ['Submitting lab', []], // covv_subm_lab
        // Custom rule: 2nd address points to sequence submitter.
        ['Address', ['sequence_submitter_contact_address']], // covv_subm_lab_addr
        ['Sample ID given by the submitting laboratory', ['specimen_collector_sample_id']], // covv_subm_sample_id
        ['Authors', []], // covv_authors
      ];

      // GISAID has new sampling_strategy field as of May 12, 2021
      const header_GISAID = [
        'submitter',
        'fn',
        'covv_virus_name',
        'covv_type', // Not in Mpox GSAID
        'covv_passage',
        'covv_collection_date',
        'covv_location',
        'covv_add_location',
        'covv_host',
        'covv_add_host_info',
        'covv_sampling_strategy',
        'covv_gender',
        'covv_patient_age',
        'covv_patient_status',
        'covv_specimen',
        'covv_outbreak',
        'covv_last_vaccinated',
        'covv_treatment',
        'covv_seq_technology',
        'covv_assembly_method',
        'covv_coverage',
        'covv_orig_lab',
        'covv_orig_lab_addr',
        'covv_provider_sample_id',
        'covv_subm_lab',
        'covv_subm_lab_addr',
        'covv_subm_sample_id',
        'covv_authors',
      ];

      const sourceFields = dh.slots; //dh.getFields(dh.table);
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

            if (field.name === 'specimen_processing') {
              // Specimen processing is a multi-select field
              const standardizedCellValArr = standardizedCellVal.split(';');
              if (!standardizedCellValArr.includes('virus passage')) continue;
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
            if (field.name === 'passage_number') {
              mappedCellVal = 'passage number ' + mappedCellVal;
            }

            mappedCell.push(mappedCellVal);
          }
          if (headerName === 'Assembly method')
            outputRow.push(mappedCell.join(':'));
          else outputRow.push(mappedCell.join(';'));
        }
        outputMatrix.push(outputRow);
      }

      // Insert header fields into top row of export file
      outputMatrix.splice(0, 0, header_GISAID);

      return outputMatrix;
    },
  },   
};
