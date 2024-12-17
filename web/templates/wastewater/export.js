// A dictionary of possible export formats
export default {
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
      const sourceFields = dh.getFields(dh.table);
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
