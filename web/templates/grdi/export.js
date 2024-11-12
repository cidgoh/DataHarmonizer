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

  NCBI_BioSample_Enterics: {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      const ExportHeaders = new Map([
        ['sample_name', []],
        ['sample_title', []],
        ['bioproject_accession', []],
        ['strain', []],
        ['isolate_name_alias', []],
        ['culture_collection', []],
        ['reference_material', []],
        ['organism', []],
        ['collected_by', []],
        ['collection_date', []],
        ['cult_isol_date', []],
        ['geo_loc_name', []],
        ['isolation_source', []],
        ['source_type', []],
        ['samp_collect_device', []],
        ['purpose_of_sampling', []],
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
      const matchedValSets = {
        'host_housing': new Set([
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
        ]),
        'env_local_scale': new Set([
          'Agricultural Field [ENVO:00000114]',
          'Alluvial fan [ENVO:00000314]',
          'Artificial wetland [ENVO:03501406]',
          'Breeding ground [ENVO:03501441]',
          'Creek [ENVO:03501405]',
          'Farm [ENVO:00000078]',
          'Beef farm [ENVO:03501443]',
          'Breeder farm [ENVO:03501384]',
          'Dairy farm [ENVO:03501416]',
          'Feedlot [ENVO:01000627]',
          'Beef cattle feedlot [ENVO:03501444]',
          'Fish farm [ENVO:00000294]',
          'Research farm [ENVO:03501417]',
          'Freshwater environment [ENVO:01000306]',
          'Hatchery [ENVO:01001873]',
          'Poultry hatchery [ENVO:01001874]',
          'Lake [ENVO:00000020]',
          'Manure lagoon (Anaerobic lagoon) [ENVO:03501423]',
          'Manure pit [ENVO:01001872]',
          'Marine environment [ENVO:01000320]',
          'Benthic zone [ENVO:03501440]',
          'Pelagic zone [ENVO:00000208]',
          'Park [ENVO:00000562]',
          'Pond [ENVO:00000033]',
          'Reservoir [ENVO:00000025]',
          'Irrigation reservoir [ENVO:00000450]',
          'River [ENVO:00000022]',
          'Roost (bird) [ENVO:03501439]',
          'Rural area [ENVO:01000772]',
          'Slough [ENVO:03501438]',
          'Stream [ENVO:00000023]',
          'Tributary [ENVO:00000495]',
          'Water surface [ENVO:01001191]',
          'Woodland area [ENVO:00000109]'
        ]),
        'facility_type': new Set([
          'Abattoir [ENVO:01000925]',
          'Dairy [ENVO:00003862]',
          'Farm [ENVO:00000078]',
          'Hatchery [ENVO:01001873]',
          'Retail environment [ENVO:01001448]',
          'Shop [ENVO:00002221]',
          'Butcher shop [ENVO:03501396]',
          'Supermarket [ENVO:01000984]',
          'Manure digester facility [ENVO:03501422]'
        ]),
        'coll_site_geo_feat': new Set([
          'Animal transportation equipment [AGRO:00000671]',
          'Dead haul trailer [GENEPIO:0100896]',
          'Dead haul truck [AGRO:00000673]',
          'Live haul trailer [GENEPIO:0100897]',
          'Live haul truck [AGRO:00000674]',
          'Bulk tank [ENVO:03501379]',
          'Animal feeding equipment [AGRO:00000675]',
          'Animal feeder [AGRO:00000679]',
          'Animal drinker [AGRO:00000680]',
          'Feed pan [AGRO:00000676]',
          'Watering bowl [AGRO:00000677]',
          '"Belt [NCIT:C49844]',
          'Boot [GSSO:012935]',
          'Boot cover [OBI:0002806]',
          'Broom [ENVO:03501431]',
          'Bulk tank [ENVO:03501379]',
          'Chick box [AGRO:00000678]',
          'Chick pad [AGRO:00000672]',
          'Cleaning equipment [ENVO:03501430]',
          'Dumpster [ENVO:03501400]',
          'Egg belt [AGRO:00000670]',
          'Fan [NCIT:C49947]',
          'Freezer [ENVO:03501415]',
          'Freezer handle [ENVO:03501414]',
          'Plucking belt [AGRO:00000669]'
        ]),
        'env_medium': new Set([
          'Air [ENVO:00002005]',
          'Alluvium [ENVO:01001202]',
          'Animal feeding equipment [AGRO:00000675]',
          'Animal feeder [AGRO:00000679]',
          'Animal drinker [AGRO:00000680]',
          'Feed pan [AGRO:00000676]',
          'Watering bowl [AGRO:00000677]',
          'Animal transportation equipment [AGRO:00000671]',
          'Dead haul trailer [GENEPIO:0100896]',
          'Dead haul truck [AGRO:00000673]',
          'Live haul trailer [GENEPIO:0100897]',
          'Live haul truck [AGRO:00000674]',
          'Belt [NCIT:C49844]',
          'Biosolids [ENVO:00002059]',
          'Boot [GSSO:012935]',
          'Boot cover [OBI:0002806]',
          'Broom [ENVO:03501431]',
          'Bulk tank [ENVO:03501379]',
          'Chick box [AGRO:00000678]',
          'Chick pad [AGRO:00000672]',
          'Cleaning equipment [ENVO:03501430]',
          'Compost [ENVO:00002170]',
          'Contaminated water [ENVO:00002186]',
          'Fecal slurry [ENVO:03501436]',
          'Fluid from meat rinse [GENEPIO:0004323]',
          'Effluent [ENVO:03501407]',
          'Influent [ENVO:03501442]',
          'Surface runoff [ENVO:03501408]',
          'Poultry plucking water [AGRO_00000693]',
          'Wastewater [ENVO:00002001]',
          'Weep fluid [AGRO_00000692]',
          'Crate [ENVO:03501372]',
          'Dumpster [ENVO:03501400]',
          'Dust [ENVO:00002008]',
          'Egg belt [AGRO:00000670]',
          'Fan [NCIT:C49947]',
          'Freezer [ENVO:03501415]',
          'Freezer handle [ENVO:03501414]',
          'Manure [ENVO:00003031]',
          'Animal manure [AGRO:00000079]',
          'Pig manure [AGRO:00000080]',
          'Manure digester equipment [ENVO:03501424]',
          'Nest [ENVO:03501432]',
          'Bird\'s nest [ENVO:00005805]',
          'Permafrost [ENVO:00000134]',
          'Plucking belt [AGRO:00000669]',
          'Poultry fluff [UBERON:0008291]',
          'Poultry litter [AGRO:00000080]',
          'Sediment [ENVO:00002007]',
          'Soil [ENVO:00001998]',
          'Agricultural soil [ENVO:00002259]',
          'Forest soil [ENVO:00002261]',
          'Straw [ENVO:00003869]',
          'Canola straw [FOODON:00004430]',
          'Oat straw [FOODON:03309878]',
          'Barley straw [FOODON:00004559]',
          'Water [CHEBI:15377]',
          'Drinking water [ENVO:00003064]',
          'Groundwater [ENVO:01001004]',
          'Surface water [ENVO:00002042]'
        ]),
        'food_processing_method': new Set([
          'Food (cooked) [FOODON:00001181]',
          'Food (cut) [FOODON:00004291]',
          'Food (chopped) [FOODON:00002777]',
          'Food (chunks) [FOODON:00004555]',
          'Food (cubed) [FOODON:00004278]',
          'Food (diced) [FOODON:00004549]',
          'Food (grated) [FOODON:00004552]',
          'Food (sliced) [FOODON:00002455]',
          'Food (shredded) [FOODON:00004553]',
          'Food (fresh) [FOODON:00002457]',
          'Food (pulped) [FOODON:00004554]',
          'Food (raw) [FOODON:03311126]',
          'Food (unseasoned) [FOODON:00004287]',
          'Meat (boneless) [FOODON:00003467]',
          'Meat (skinless) [FOODON:00003468]',
          'Meat (with bone) [FOODON:02010116]',
          'Meat (with skin) [FOODON:02010111]'
        ]),
        'food_preserv_proc': new Set([
          'Food (canned) [FOODON:00002418]',
          'Food (dried) [FOODON:03307539]',
          'Food (frozen) [FOODON:03302148]'
        ]),
      };

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
            value = dh.getMatchedValsField(
              'environmental_site',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'env_local_scale') {
            value = dh.getMatchedValsField(
              'environmental_site',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'facility_type') {
            value = dh.getMatchedValsField(
              'environmental_site',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'coll_site_geo_feat') {
            value = dh.getMatchedValsField(
              'environmental_material',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'env_medium') {
            value = dh.getMatchedValsField(
              'environmental_material',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'food_processing_method') {
            value = dh.getMatchedValsField(
              'food_product_properties',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            )
          } else if (headerName === 'food_preserv_proc') {
            value = dh.getMatchedValsField(
              'food_product_properties',
              matchedValSets[headerName],
              inputRow,
              sourceFieldNameMap
            );
          } else if (headerName === 'source_type') {
            const hostScientificName =
              inputRow[sourceFieldNameMap['host_scientific_name']];
            const foodProduct = inputRow[sourceFieldNameMap['food_product']];
            const nullValsSet = new Set(
              Object.keys(
                dh.schema.enums.NullValueMenu.permissible_values
              ).concat(['', null])
            );

            if (hostScientificName === 'Homo sapiens [NCBITaxon:9606]') {
              value = 'Human';
            } else if (nullValsSet.has(foodProduct)) {
              value = 'Animal';
            } else {
              value = 'Food';
            }
          } else if (headerName === 'host') {
            value = dh.getFirstNonNullField(
              [
                'host_scientific_name',
                'host_common_name',
                'host_food_production_name'
              ],
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

      const sourceFields = dh.getFields(dh.table);
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
  }
};
