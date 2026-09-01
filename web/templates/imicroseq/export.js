// Adds existing functions/methods to DataHarminizer.
export default {
  /**
   * Download secondary headers and grid data.
   * @param {String} baseName Basename of downloaded file.
   * @param {Object} hot Handonstable grid instance.
   * @param {Object} data See `data.js`.
   * @param {Object} xlsx SheetJS variable.
   */

  /**
   * NCBI BioSample - SARS-CoV-2 wastewater surveillance package (v1.0)
   * https://www.ncbi.nlm.nih.gov/biosample/docs/packages/SARS-CoV-2.wwsurv.1.0/
   * Ported verbatim from the wastewater template. Source columns are wired
   * from each slot's `exact_mappings` prefixed `NCBI_BIOSAMPLE_SARS_COV_2_WWS`
   * in schema.json (schema_slots.tsv column `EXPORT_NCBI_BIOSAMPLE_SARS_COV_2_WWS`).
   */
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

  /**
   * NCBI BioSample - PHA4GE wastewater surveillance package (v1.0)
   * https://www.ncbi.nlm.nih.gov/biosample/docs/packages/PHA4GE.wwsurv.1.0/
   *
   * SCAFFOLD ONLY: the target column list and order below match the NCBI
   * package spec, but the iMicroSeq schema does not yet carry
   * `NCBI_BIOSAMPLE_PHA4GE_WWS` mappings, so most columns will export blank
   * until an `EXPORT_NCBI_BIOSAMPLE_PHA4GE_WWS` column is populated in
   * schema_slots.tsv and schema.json is regenerated.
   */
  NCBI_BIOSAMPLE_PHA4GE_WWS: {
    fileType: 'xlsx',
    status: 'draft',
    method: function(dh) {
      const exportHeaders = new Map([
        ["sample_name", []],
        ["sample_title", []],
        ["bioproject_accession", []],
        ["organism", []],
        // Mandatory
        ["collection_date", []],
        ["geo_loc_name", []],
        ["purpose_of_sampling", []],
        // Optional
        ["adjacent_environment", []],
        ["collected_by", []],
        ["collection_device", []],
        ["collection_method", []],
        ["diagnostic_measurement_1", []],
        ["diagnostic_measurement_2", []],
        ["diss_oxygen", []],
        ["env_local_scale", []],
        ["env_medium", []],
        ["environmental_material_properties", []],
        ["experimental_protocol", []],
        ["experimental_specimen_role_type", []],
        ["fecal_contamination_indicator", []],
        ["fecal_contamination_value", []],
        ["gene_symbol_1", []],
        ["gene_symbol_2", []],
        ["instantaneous_flow_rate", []],
        ["isolate", []],
        ["isolated_by", []],
        ["lat_lon", []],
        ["ph", []],
        ["populated_area_type", []],
        ["presamp_weather", []],
        ["presampling_activity", []],
        ["samp_mat_process", []],
        ["samp_salinity", []],
        ["samp_weather", []],
        ["sample_collection_time_duration", []],
        ["sampling_event_id", []],
        ["sampling_site_id", []],
        ["strain", []],
        ["suspend_solids", []],
        ["total_daily_flow_rate", []],
        ["turbidity", []],
        ["water_catchment_area_population", []],
        ["ww_system_type", []],
        ["description", []],
      ]);
      const outputMatrix = [[...exportHeaders.keys()]];
      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      dh.getHeaderMap(exportHeaders, sourceFields, 'NCBI_BIOSAMPLE_PHA4GE_WWS');
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
            'NCBI_BIOSAMPLE_PHA4GE_WWS'
          );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }
      return outputMatrix;
    },
  },

  /**
   * NCBI BioSample - Pathogen: environmental/food/other package (v1.0)
   * https://www.ncbi.nlm.nih.gov/biosample/docs/packages/Pathogen.env.1.0/
   *
   * SCAFFOLD ONLY: column list/order match the NCBI package spec. The prefix
   * `NCBI_BIOSAMPLE_Pathogen` matches the convention used by the grdi
   * template, but the iMicroSeq schema does not yet carry these mappings, so
   * most columns will export blank until an `EXPORT_NCBI_BIOSAMPLE_Pathogen`
   * column is populated in schema_slots.tsv and schema.json is regenerated.
   * NCBI requires at least one of `strain` / `isolate`.
   */
  NCBI_BioSample_Pathogen: {
    fileType: 'xls',
    status: 'draft',
    method: function (dh) {
      const ExportHeaders = new Map([
        ['sample_name', []],
        ['sample_title', []],
        ['bioproject_accession', []],
        ['organism', []],
        // Mandatory
        ['collected_by', []],
        ['collection_date', []],
        ['geo_loc_name', []],
        ['isolation_source', []],
        ['lat_lon', []],
        // At least one required (organism group)
        ['strain', []],
        ['isolate', []],
        // Optional
        ['culture_collection', []],
        ['genotype', []],
        ['passage_history', []],
        ['pathotype', []],
        ['serotype', []],
        ['serovar', []],
        ['specimen_voucher', []],
        ['subgroup', []],
        ['subtype', []],
        ['description', []],
      ]);

      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'NCBI_BIOSAMPLE_Pathogen');

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
            'NCBI_BIOSAMPLE_Pathogen'
          );
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    },
  },

  NCBI_Antibiogram: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      const ExportHeaders = new Map([
        ['sample_name/biosample_accession', []],
        ['antibiotic', []],
        ['resistance_phenotype', []],
        ['measurement_sign', []],
        ['measurement', []],
        ['measurement_units', []],
        ['laboratory_typing_method', []],
        ['laboratory_typing_platform', []],
        ['vendor', []],
        ['laboratory_typing_method_version_or_reagent', []],
        ['testing_standard', []]
      ]);
      const antibioticsArr = [
        'amikacin',
        'amoxicillin-clavulanic_acid',
        'ampicillin',
        'azithromycin',
        'cefazolin',
        'cefepime',
        'cefotaxime',
        'cefotaxime-clavulanic_acid',
        'cefoxitin',
        'cefpodoxime',
        'ceftazidime',
        'ceftazidime-clavulanic_acid',
        'ceftiofur',
        'ceftriaxone',
        'cephalothin',
        'chloramphenicol',
        'ciprofloxacin',
        'clindamycin',
        'doxycycline',
        'enrofloxacin',
        'erythromycin',
        'florfenicol',
        'gentamicin',
        'imipenem',
        'kanamycin',
        'levofloxacin',
        'linezolid',
        'meropenem',
        'nalidixic',
        'nitrofurantoin',
        'norfloxacin',
        'oxolinic-acid',
        'oxytetracycline',
        'piperacillin',
        'piperacillin-tazobactam',
        'polymyxin-b',
        'quinupristin-dalfopristin',
        'streptomycin',
        'sulfisoxazole',
        'telithromycin',
        'tetracycline',
        'tigecycline',
        'trimethoprim-sulfamethoxazole'
      ];
      const longHeadersArr = Array.from(ExportHeaders.keys()).slice(2);

      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'NCBI_ANTIBIOGRAM');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = Array(ExportHeaders.size);
        const primaryKey = dh.getFirstNonNullField(
          ['isolate_id', 'sample_collector_sample_id'],
          inputRow,
          sourceFieldNameMap
        );
        if (!primaryKey) continue;
        outputRow[0] = primaryKey;

        // Wide to long logic
        const oldOutputMatrixLen = outputMatrix.length;
        for (const antibiotic of antibioticsArr) {
          const longRow = [...outputRow];
          let atLeastOneWideVal = false;
          for (const [i, longHeader] of longHeadersArr.entries()) {
            let wideHeader = antibiotic.concat('_', longHeader);
            // Vendor is the only header =/= imported header suffix
            if (longHeader === 'vendor') wideHeader += '_name';
            let wideVal = dh.getMappedField(
              longHeader,
              inputRow,
              [wideHeader.replaceAll('-', '')],
              sourceFields,
              sourceFieldNameMap,
              ':',
              'NCBI_ANTIBIOGRAM'
            );
            if (wideVal) {
              atLeastOneWideVal = true;
              longRow[i+2] = wideVal;
            }
          }
          if (atLeastOneWideVal) {
            longRow[1] = antibiotic.replaceAll('_', ' ');
            outputMatrix.push(longRow);
          }
        }
        // Ensures a row is still added if no antibiotic info is present
        if (oldOutputMatrixLen === outputMatrix.length) {
          outputMatrix.push(outputRow);
        }
      }

      return outputMatrix;
    }
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
        ["quality_control_determination", []],
        ["quality_control_issues", []],
        ["quality_control_details", []],
        ["raw_sequence_data_processing_method", []],
        ["dehosting_method", []],
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
};
