// Adds existing functions/methods to DataHarminizer.
export default {
  /**
   * Download secondary headers and grid data.
   * @param {Object} dh DataHarmonizer instance.
   */

  TEST: {
    fileType: 'tsv',
    status: 'published',
    method: function (dh) {
      // Create an export table with template's headers (2nd row) and remaining rows of data

      // NOTE: NULL reason fields must follow immediately after column they are about.
      const ExportHeaders = new Map([
        ['isolate ID', []],
        ['alternative isolate ID', []],
        ['specimen collector sample ID', []],
        ['sample collected by', []],
        ['sample collection project name', []],
        ['sample collector contact email', []],
        ['sample collector contact address', []],
        ['sample collection date', []],
        ['sample received date', []],
        ['geo_loc_name (country)', []],
        ['geo_loc_name (state/province/territory)', []],
        ['geo_loc_name (city)', []],
        ['geo_loc_name (site)', []],
        ['organism', []],
        ['purpose of sampling', []],
        ['purpose of sampling details', []],
        ['original sample description', []],
        ['anatomical material', []],
        ['anatomical part', []],
        ['body product', []],
        ['environmental material', []],
        ['environmental site', []],
        ['collection device', []],
        ['collection method', []],
        ['collection protocol', []],
        ['specimen processing', []],
        ['specimen processing details', []],
        ['strain', []],
        ['taxonomic identification method', []],
        ['taxonomic identification method details', []],
        ['incubation temperature value', []],
        ['incubation temperature unit', []],
        ['isolation medium', []],
        ['isolate storage location', []],
        ['cellular respiration type', []],
        ['host (common name)', []],
        ['host (scientific name)', []],
        ['host disease', []],
        ['sequenced by', []],
        ['sequenced by laboratory name', []],
        ['sequenced by contact name', []],
        ['sequenced by contact email', []],
        ['purpose of sequencing', []],
        ['purpose of sequencing details', []],
        ['sequencing date', []],
        ['library ID', []],
        ['sequencing instrument', []],
        ['sequencing protocol name', []],
        ['amplicon pcr primer list', []],
        ['input file name', []],
        ['reference accession', []],
        ['bioinformatics protocol', []],
        ['reference database name', []],
        ['reference database version', []],
        ['coverage (percentage)', []],
        ['sequence identity percentage', []],
        ['sequence identity (variance ratio)', []],
        ['top-hit taxon determination', []],
        ['top-hit strain determination', []],
        ['trimmed ribosomal gene sequence', []],
        ['bioinformatics analysis details', []],
        ['authors', []],
        ['DataHarmonizer provenance', []],
    ]);

      const sourceFields = dh.getFields(dh.table);
      // Fills in the above mapping (or just set manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'TEST');

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];
    
      for (const inputRow of dh.getTrimmedData(dh.hot)) {
        const outputRow = [];
        /* eslint-disable */
        for (const a of ExportHeaders) {
            outputRow.push(...inputRow);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    },
  },

}
