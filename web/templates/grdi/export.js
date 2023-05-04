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
};
