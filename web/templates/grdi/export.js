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
        ['sample_name', []], 					// *
		['bioproject_accession',[]],			// *
//		['attribute_package',[]],				
//		['GISAID_accession',[]],
//		['GISAID_virus_name',[]],
//		['collection_date',[]],
		['collected_by', []],					// *
		['sequenced_by',       []],		 		// *`
//		['sequence_submitted_by', []],

		['sample collection date',[]],		// *

        [										// *
          'geo_loc_name',
          ['geo_loc_name (country)', 'geo_loc_name (state/province/region)', 'geo_loc_name (site)'],
        ],
        ['organism', []],
//        ['isolate', []],
        [
          'isolation_source',
          [
            'anatomical_material',
            'anatomical_part',
            'body_product',
            'environmental_material',
            'environmental_site',
            'collection_device',
            'collection_method',
            'food_product',
            'food_product_properties',
            'food_packaging'
          ],
        ],
        ['anatomical_material', []],
        ['anatomical_part', []],
        ['body_product', []],
        ['environmental_material', []],
        ['environmental_site', []],
        ['collection_device', []],
        ['collection_method', []],
//        ['lab_host', []],
//        ['passage_history', []],
//        ['passage_method', []],
        ['host', []],							// *
        ['host_disease', []],					// *
//        ['host_health_state', []],
//        ['host_disease_outcome', []],
//        ['host_age', []],
//        ['host_age_unit',   []],	
//				['host_age_bin',   []],	
//        ['host_sex', []],
//        ['host_subject_id', []],
        ['purpose_of_sampling',[]],				// *
        ['purpose_of_sequencing', []],			// *
//      ['gene_name_1', []],
//      ['diagnostic_PCR_CT_value_1', []],
//      ['gene_name_2', []],
//      ['diagnostic_PCR_CT_value_2', []],
//      ['description',[]],
        // TODO there are additional fields now; what order?
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

  // TODO I see other refs to NCBI_BioSample in project; good name?
  NCBI_BioSample_Enterics: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      const ExportHeaders = new Map([
        ['*sample_name', []],
        ['sample_title', []],
        ['bioproject_accession', []],
        ['*strain', []],
        ['isolate_name_alias', []],
        ['culture_collection', []],
        ['reference_material', []],
        ['*organism', []],
        ['*collected_by', []],
        ['*collection_date', []],
        ['cult_isol_date', []],
        ['*geo_loc_name', []],
        ['*isolation_source', []],
        ['*source_type', []],
        ['samp_collect_device', []],
        ['*purpose_of_sampling', []],
        ['project_name', []],
        ['ifsac_category', []],
        ['lat_lon', []],
        ['serotype', []],
        ['serovar', []],
        ['sequenced_by', []],
        ['description', []],
        ['host', []],
        ['host_sex', []],
        ['host_age', []],
        ['host_disease', []],
        ['host_subject_id', []],
        ['animal_env', []],
        ['host_tissue_sampled', []],
        ['host_body_product', []],
        ['host_variety', []],
        ['host_animal_breed', []],
        ['upstream_intervention', []],
        ['host_am', []],
        ['host_group_size', []],
        ['host_housing', []],
        ['food_origin', []],
        ['intended_consumer', []],
        ['spec_intended_cons', []],
        ['food_source', []],
        ['food_processing_method', []],
        ['food_preserv_proc', []],
        ['food_prod', []],
        ['label_claims', []],
        ['food_product_type', []],
        ['food_industry_code', []],
        ['food_industry_class', []],
        ['food_additive', []],
        ['food_contact_surf', []],
        ['food_contain_wrap', []],
        ['food_pack_medium', []],
        ['food_pack_integrity', []],
        ['food_quality_date', []],
        ['food_prod_synonym', []],
        ['facility_type', []],
        ['building_setting', []],
        ['coll_site_geo_feat', []],
        ['food_type_processed', []],
        ['location_in_facility', []],
        ['env_monitoring_zone', []],
        ['indoor_surf', []],
        ['indoor_surf_subpart', []],
        ['surf_material', []],
        ['material_condition', []],
        ['surface_orientation', []],
        ['surf_temp', []],
        ['biocide_used', []],
        ['animal_intrusion', []],
        ['env_broad_scale', []],
        ['env_local_scale', []],
        ['env_medium', []],
        ['plant_growth_med', []],
        ['plant_water_method', []],
        ['rel_location', []],
        ['soil_type', []],
        ['farm_water_source', []],
        ['fertilizer_admin', []],
        ['food_clean_proc', []],
        ['sanitizer_used_postharvest', []],
        ['farm_equip', []],
        ['extr_weather_event', []],
        ['mechanical_damage', []]
      ]);
//
//
// EXAMPLE
// environmental_siteXenv_local_scale = "Agricultural Field [ENVO:00000114], Alluvial fan [ENVO:00000314], Artificial wetland [ENVO:03501406], Breeding ground [ENVO:03501441], Creek [ENVO:03501405], Farm [ENVO:00000078], Beef farm [ENVO:03501443], Breeder farm [ENVO:03501384], Dairy farm [ENVO:03501416], Feedlot [ENVO:01000627], Beef cattle feedlot [ENVO:03501444], Fish farm [ENVO:00000294], Research farm [ENVO:03501417], Freshwater environment [ENVO:01000306], Hatchery [ENVO:01001873], Poultry hatchery [ENVO:01001874], Lake [ENVO:00000020], Manure lagoon (Anaerobic lagoon) [ENVO:03501423], Manure pit [ENVO:01001872], Marine environment [ENVO:01000320], Benthic zone [ENVO:03501440], Pelagic zone [ENVO:00000208], Park [ENVO:00000562], Pond [ENVO:00000033], Reservoir [ENVO:00000025], Irrigation reservoir [ENVO:00000450], River [ENVO:00000022], Roost (bird) [ENVO:03501439], Rural area [ENVO:01000772], Slough [ENVO:03501438], Stream [ENVO:00000023], Tributary [ENVO:00000495], Water surface [ENVO:01001191], Woodland area [ENVO:00000109]".split(",")


      const sourceFields = dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'NCBI_BIOSAMPLE_Enterics');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        for (const [headerName, sources] of ExportHeaders) {
          let value;
          // TODO some of these seem like they are supposed to have picklists,
          //  but do not?
          if (headerName === 'fertilizer_admin') {
            value = dh.getIfThenField(
              'presampling_activity',
              'Fertilizer pre-treatment [GENEPIO:0100543]',
              'presampling_activity_details',
              inputRow,
              sourceFieldNameMap
              );
          } else if (headerName === 'host_am') {
            value = dh.getIfThenField(
              'presampling_activity',
              'Antimicrobial pre-treatment [GENEPIO:0100537]',
              'presampling_activity_details',
              inputRow,
              sourceFieldNameMap
              );
          } else if (headerName === 'host_housing') {
            const matchedValsSet = new Set([
              'Animal cage [ENVO:01000922]',
              'Aquarium [ENVO:00002196]',
              'Building [ENVO:00000073]',
              'Barn [ENVO:03501257]',
              'Breeder barn [ENVO:03501383]',
              'Broiler barn [ENVO:03501386]',
              'Sheep barn [ENVO:03501385]',
              'Pigsty [ENVO:03501413]',
              'Animal pen [ENVO:03501387]',
              'Stall [EOL:0001903]',
              'Poultry hatchery [ENVO:01001874]',
              'Roost (bird) [ENVO:03501439]',
              'Crate [ENVO:03501372]'
            ])
            value = dh.getMatchedValsField(
              'environmental_site',
              matchedValsSet,
              inputRow,
              sourceFieldNameMap
            )
          } else {
            // Otherwise apply source (many to one) to target field transform:
            value = dh.getMappedField(
              headerName,
              inputRow,
              sources,
              sourceFields,
              sourceFieldNameMap,
              ':',
              'NCBI_BIOSAMPLE_Enterics'
            );
          }
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    }
  }
};
