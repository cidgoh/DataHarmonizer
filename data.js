const DATA = [
  {
    fieldName: 'Database Identifiers',
    children: [
      {
        fieldName: 'specimen collector sample ID',
        vocabulary: {}},
      {
        fieldName: 'PHAC sample ID',
        vocabulary: {}},
      {
        fieldName: 'IRIDA sample name',
        vocabulary: {}},
      {
        fieldName: 'umbrella bioproject accession',
        vocabulary: {
          '   PRJNA623807': {},
        }},
      {
        fieldName: 'bioproject accession',
        vocabulary: {}},
      {
        fieldName: 'biosample accession',
        vocabulary: {}},
      {
        fieldName: 'SRA accession',
        vocabulary: {}},
      {
        fieldName: 'GenBank accession',
        vocabulary: {}},
      {
        fieldName: 'GISAID accession',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Sample collection and processing',
    children: [
      {
        fieldName: 'sample collected by',
        vocabulary: {}},
      {
        fieldName: 'sample collector contact email',
        vocabulary: {}},
      {
        fieldName: 'sample collector contact address',
        vocabulary: {}},
      {
        fieldName: 'sequence submitted by',
        vocabulary: {}},
      {
        fieldName: 'sequence submitter contact email',
        vocabulary: {}},
      {
        fieldName: 'sequence submitter contact address',
        vocabulary: {}},
      {
        fieldName: 'sample collection date',
        vocabulary: {}},
      {
        fieldName: 'geo_loc_name (country)',
        vocabulary: {}},
      {
        fieldName: 'geo_loc_name (province/territory)',
        vocabulary: {}},
      {
        fieldName: 'geo_loc_name (city)',
        vocabulary: {}},
      {
        fieldName: 'organism',
        vocabulary: {}},
      {
        fieldName: 'isolate',
        vocabulary: {}},
      {
        fieldName: 'purpose of sampling',
        vocabulary: {}},
      {
        fieldName: 'anatomical material',
        vocabulary: {
          'Blood': {},
          'Fluid': {
            'Fluid (cerebrospinal (CSF))': {},
            'Fluid (oral)': {},
            'Fluid (pleural)': {},
            'Fluid (pericardial)': {},
          },
          'Saliva': {},
          'Tissue': {},
        }},
      {
        fieldName: 'anatomical part',
        vocabulary: {}},
      {
        fieldName: 'body product',
        vocabulary: {}},
      {
        fieldName: 'environmental material',
        vocabulary: {}},
      {
        fieldName: 'environmental site',
        vocabulary: {}},
      {
        fieldName: 'collection device',
        vocabulary: {}},
      {
        fieldName: 'collection method',
        vocabulary: {}},
      {
        fieldName: 'collection protocol',
        vocabulary: {}},
      {
        fieldName: 'specimen processing',
        vocabulary: {}},
      {
        fieldName: 'lab host',
        vocabulary: {}},
      {
        fieldName: 'passage number',
        vocabulary: {}},
      {
        fieldName: 'passage method',
        vocabulary: {}},
      {
        fieldName: 'biomaterial extracted',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Host information',
    children: [
      {
        fieldName: 'host (common name)',
        vocabulary: {}},
      {
        fieldName: 'host (scientific name)',
        vocabulary: {}},
      {
        fieldName: 'host health state',
        vocabulary: {}},
      {
        fieldName: 'host health status details',
        vocabulary: {}},
      {
        fieldName: 'host disease',
        vocabulary: {}},
      {
        fieldName: 'host age',
        vocabulary: {}},
      {
        fieldName: 'host gender',
        vocabulary: {}},
      {
        fieldName: 'host origin geo_loc name (country)',
        vocabulary: {}},
      {
        fieldName: 'host subject ID',
        vocabulary: {}},
      {
        fieldName: 'symptom onset date',
        vocabulary: {}},
      {
        fieldName: 'signs and symptoms',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Host exposure information',
    children: [
      {
        fieldName: 'location of exposure geo_loc name (country)',
        vocabulary: {}},
      {
        fieldName: 'travel history',
        vocabulary: {}},
      {
        fieldName: 'exposure event',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Sequencing',
    children: [
      {
        fieldName: 'library ID',
        vocabulary: {}},
      {
        fieldName: 'sequencing instrument',
        vocabulary: {}},
      {
        fieldName: 'sequencing protocol name',
        vocabulary: {}},
      {
        fieldName: 'sequencing protocol source',
        vocabulary: {}},
      {
        fieldName: 'sequencing kit number',
        vocabulary: {}},
      {
        fieldName: 'amplicon pcr primers filename',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Bioinformatics and QC metrics',
    children: [
      {
        fieldName: 'raw sequence data processing',
        vocabulary: {}},
      {
        fieldName: 'sequencing depth (average)',
        vocabulary: {}},
      {
        fieldName: 'assembly name',
        vocabulary: {}},
      {
        fieldName: 'assembly method',
        vocabulary: {}},
      {
        fieldName: 'assembly coverage breadth',
        vocabulary: {}},
      {
        fieldName: 'assembly coverage depth',
        vocabulary: {}},
      {
        fieldName: 'r1 fastq filename',
        vocabulary: {}},
      {
        fieldName: 'r2 fastq filename',
        vocabulary: {}},
      {
        fieldName: 'fasta filename',
        vocabulary: {}},
      {
        fieldName: 'number base pairs',
        vocabulary: {}},
      {
        fieldName: 'genome length',
        vocabulary: {}},
      {
        fieldName: 'mean contig length',
        vocabulary: {}},
      {
        fieldName: 'N50',
        vocabulary: {}},
      {
        fieldName: 'Ns per 100 kbp',
        vocabulary: {}},
      {
        fieldName: 'reference genome accession',
        vocabulary: {}},
      {
        fieldName: 'consensus sequence ID',
        vocabulary: {}},
      {
        fieldName: 'consensus sequence method',
        vocabulary: {}},
      {
        fieldName: 'annotation feature table filename',
        vocabulary: {}},
      {
        fieldName: 'bioinformatics protocol',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Pathogen diagnostic testing',
    children: [
      {
        fieldName: 'gene name 1',
        vocabulary: {}},
      {
        fieldName: 'diagnostic pcr protocol 1',
        vocabulary: {}},
      {
        fieldName: 'diagnostic pcr Ct value 1',
        vocabulary: {}},
      {
        fieldName: 'gene name 2',
        vocabulary: {}},
      {
        fieldName: 'diagnostic pcr protocol 2',
        vocabulary: {}},
      {
        fieldName: 'diagnostic pcr Ct value 2',
        vocabulary: {}},
    ],
  },
  {
    fieldName: 'Contributor acknowledgement',
    children: [
      {
        fieldName: 'authors',
        vocabulary: {}},
    ],
  },
];
