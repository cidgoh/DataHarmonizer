var SCHEMA = {
  "folder": "soil_emls_jgi_mg",
  "specifications": {
    "soil_emsl_jgi_mg": {
      "name": "soil_emsl_jgi_mg",
      "description": "A soil biosample, with metadata in compliance with the MIxS MIMS standard for metagenomes, EMSL biosample expectations, and JGI expectations for JGI metagenomics studies",
      "from_schema": "https://example.com/mims_soil_biosample",
      "slots": {
        "project_ID": {
          "name": "project_ID",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "1"
            }
          },
          "description": "Proposal IDs or names associated with dataset",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Project ID",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "sample_type": {
          "name": "sample_type",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "2"
            }
          },
          "description": "Type of sample being submitted",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample type",
          "comments": [
            "This can vary from 'environmental package' if the sample is an extraction."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "sample_shipped": {
          "name": "sample_shipped",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample sent to EMSL",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample shipped amount",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float} {unit}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "EMSL_store_temp": {
          "name": "EMSL_store_temp",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Temperature at which the sample sent to EMSL should be stored",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "EMSL Sample Storage Temperature, deg. C",
          "comments": [
            "Enter a temperature in celsius. Numeric portion only."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "technical_reps": {
          "name": "technical_reps",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "If sending multiple technical replicates of the same sample, indicate how many replicates are being sent",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Number Technical Replicate",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{integer}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "replicate_number": {
          "name": "replicate_number",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "description": "If sending biological replicates, indicate the rep number here.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Replicate Number",
          "comments": [
            "This will guide staff in ensuring your samples are block & randomized correctly"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{integer}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_seq_project": {
          "name": "dna_seq_project",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "1"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Seq Project ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_seq_project_name": {
          "name": "dna_seq_project_name",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "2"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Seq Project Name",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_samp_ID": {
          "name": "dna_samp_ID",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Sample ID",
          "todos": [
            "Removed identifier = TRUE from dna_samp_ID in JGI_sample_slots, as a class can't have two identifiers. How to force uniqueness? Moot because that column will be prefilled?"
          ],
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_sample_name": {
          "name": "dna_sample_name",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Give the DNA sample a name that is meaningful to you. Sample names must be unique across all JGI projects and contain a-z, A-Z, 0-9, - and _ only.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Sample Name",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_concentration": {
          "name": "dna_concentration",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Concentration in ng/uL",
          "comments": [
            "Units must be in ng/uL. Enter the numerical part only. Must be calculated using a fluorometric method. Acceptable values are 0-2000."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 2000,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_volume": {
          "name": "dna_volume",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Volume in uL",
          "comments": [
            "Units must be in uL. Enter the numerical part only. Value must 0-1000. Values <25 by special permission only."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 1000,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_absorb1": {
          "name": "dna_absorb1",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "7"
            }
          },
          "description": "260/280 measurement of DNA sample purity",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Absorbance 260/280",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_absorb2": {
          "name": "dna_absorb2",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "8"
            }
          },
          "description": "260/230 measurement of DNA sample purity",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Absorbance 260/230",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_container_ID": {
          "name": "dna_container_ID",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "9"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Container Label",
          "comments": [
            "Must be unique across all tubes and plates, and <20 characters. All samples in a plate should have the same plate label."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text < 20 characters}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_cont_type": {
          "name": "dna_cont_type",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "10"
            }
          },
          "description": "Tube or plate (96-well)",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Container Type",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "dna_cont_type_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_cont_well": {
          "name": "dna_cont_well",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "11"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Well Number",
          "comments": [
            "Required when 'plate' is selected for container type. Corner wells must be blank. For partial plates, fill by columns. Leave blank if the sample will be shipped in a tube."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{96 well plate pos}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_sample_format": {
          "name": "dna_sample_format",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "12"
            }
          },
          "description": "Solution in which the DNA sample has been suspended",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Sample Format",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "dna_sample_format_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_dnase": {
          "name": "dna_dnase",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "13"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNAse Treatment DNA",
          "comments": [
            "Note DNAse treatment is required for all RNA samples."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "dna_dnase_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_organisms": {
          "name": "dna_organisms",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "14"
            }
          },
          "description": "List any organisms known or suspected to grow in co-culture, as well as estimated % of the organism in that culture.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Expected Organisms",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_collect_site": {
          "name": "dna_collect_site",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "15"
            }
          },
          "description": "Provide information on the site your DNA sample was collected from",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Collection Site",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_isolate_meth": {
          "name": "dna_isolate_meth",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "16"
            }
          },
          "description": "Describe the method/protocol/kit used to extract DNA/RNA.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Isolation Method",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_seq_project_PI": {
          "name": "dna_seq_project_PI",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "17"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Seq Project PI",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dna_project_contact": {
          "name": "dna_project_contact",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "18"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Seq Project Contact",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "proposal_dna": {
          "name": "proposal_dna",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "19"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNA Proposal ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_seq_project": {
          "name": "rna_seq_project",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "20"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Seq Project ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_seq_project_name": {
          "name": "rna_seq_project_name",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "21"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Seq Project Name",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_samp_ID": {
          "name": "rna_samp_ID",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "22"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Sample ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_sample_name": {
          "name": "rna_sample_name",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "23"
            }
          },
          "description": "Give the RNA sample a name that is meaningful to you. Sample names must be unique across all JGI projects and contain a-z, A-Z, 0-9, - and _ only.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Sample Name",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 2000,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_concentration": {
          "name": "rna_concentration",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "24"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Concentration in ng/uL",
          "comments": [
            "Units must be in ng/uL. Enter the numerical part only. Must be calculated using a fluorometric method. Acceptable values are 0-2000."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 1000,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_volume": {
          "name": "rna_volume",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "25"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Volume in uL",
          "comments": [
            "Units must be in uL. Enter the numerical part only. Value must 0-1000. Values <25 by special permission only."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_absorb1": {
          "name": "rna_absorb1",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "26"
            }
          },
          "description": "260/280 measurement of RNA sample purity",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Absorbance 260/280",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_absorb2": {
          "name": "rna_absorb2",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "27"
            }
          },
          "description": "260/230 measurement of RNA sample purity",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Absorbance 260/230",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{float}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_container_ID": {
          "name": "rna_container_ID",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "28"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Container Label",
          "comments": [
            "Must be unique across all tubes and plates, and <20 characters. All samples in a plate should have the same plate label."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_cont_type": {
          "name": "rna_cont_type",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "29"
            }
          },
          "description": "Tube or plate (96-well)",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Container Type",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "rna_cont_type_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_cont_well": {
          "name": "rna_cont_well",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "30"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Well Number",
          "comments": [
            "Required when 'plate' is selected for container type. Corner wells must be blank. For partial plates, fill by columns. Leave blank if the sample will be shipped in a tube."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{96 well plate pos}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_sample_format": {
          "name": "rna_sample_format",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "31"
            }
          },
          "description": "Solution in which the RNA sample has been suspended",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Sample Format",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "dnase_rna": {
          "name": "dnase_rna",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "32"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "DNAse Treated",
          "comments": [
            "Note DNAse treatment is required for all RNA samples."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "dnase_rna_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_organisms": {
          "name": "rna_organisms",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "33"
            }
          },
          "description": "List any organisms known or suspected to grow in co-culture, as well as estimated % of the organism in that culture.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Expected Organisms",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_collect_site": {
          "name": "rna_collect_site",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "34"
            }
          },
          "description": "Provide information on the site your RNA sample was collected from",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Collection Site",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_isolate_meth": {
          "name": "rna_isolate_meth",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "35"
            }
          },
          "description": "Describe the method/protocol/kit used to extract DNA/RNA.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Isolation Method",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_seq_project_PI": {
          "name": "rna_seq_project_PI",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "36"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Seq Project PI",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rna_project_contact": {
          "name": "rna_project_contact",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "37"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Seq Project Contact",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "proposal_rna": {
          "name": "proposal_rna",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "38"
            }
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "RNA Proposal ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "non_microb_biomass": {
          "name": "non_microb_biomass",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "18"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Amount of biomass; should include the name for the part of biomass measured, e.g.insect, plant, total. Can include multiple measurements separated by ;",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "non-microbial biomass",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:biomass|microbial_biomass"
          ],
          "string_serialization": "{text};{float} {unit}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "non_microb_biomass_method": {
          "name": "non_microb_biomass_method",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "19"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining biomass",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "non-microbial biomass method",
          "comments": [
            "required if \"non-microbial biomass\" is provided"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "microbial_biomass_C": {
          "name": "microbial_biomass_C",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "20"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass carbon",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{float} {unit}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "micro_biomass_C_meth": {
          "name": "micro_biomass_C_meth",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "21"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining microbial biomass",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass carbon method",
          "comments": [
            "required if \"microbial_biomass_C\" is provided"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:micro_biomass_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "microbial_biomass_N": {
          "name": "microbial_biomass_N",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "22"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass nitrogen",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{float} {unit}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "micro_biomass_N_meth": {
          "name": "micro_biomass_N_meth",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "23"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining microbial biomass nitrogen",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass nitrogen method",
          "comments": [
            "required if \"microbial_biomass_N\" is provided"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:micro_biomass_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "org_nitro_method": {
          "name": "org_nitro_method",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "24"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Method used for obtaining organic nitrogen",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "organic nitrogen method",
          "comments": [
            "required if \"org_nitro\" is provided"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:org_nitro|tot_nitro_cont_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "collection_time": {
          "name": "collection_time",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "The time of sampling, either as an instance (single point) or interval.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "collection time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "collection_date_inc": {
          "name": "collection_date_inc",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "Date the incubation was harvested/collected/ended. Only relevant for incubation samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Incubation Collection Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only"
          ],
          "comments": [
            "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{date, arbitrary precision}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "collection_time_inc": {
          "name": "collection_time_inc",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "description": "Time the incubation was harvested/collected/ended. Only relevant for incubation samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Incubation Collection Time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "start_date_inc": {
          "name": "start_date_inc",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "7"
            }
          },
          "description": "Date the incubation was started. Only relevant for incubation samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Incubation Start Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only"
          ],
          "comments": [
            "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{date, arbitrary precision}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "start_time_inc": {
          "name": "start_time_inc",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "8"
            }
          },
          "description": "Time the incubation was started. Only relevant for incubation samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Incubation Start Time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "filter_method": {
          "name": "filter_method",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "13"
            }
          },
          "description": "Type of filter used or how the sample was filtered",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Filter Method",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:filter_type"
          ],
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "experimental_factor_other": {
          "name": "experimental_factor_other",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "15"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "optional"
            }
          },
          "description": "Other details about your sample that you feel can't be accurately represented in the available columns.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "experimental factor- other",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:experimental_factor|additional_info"
          ],
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "other_treatment": {
          "name": "other_treatment",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "25"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            }
          },
          "description": "Other treatments applied to your samples that are not applicable to the provided fields",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "other treatments",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:additional_info"
          ],
          "string_serialization": "{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "isotope_exposure": {
          "name": "isotope_exposure",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "26"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            }
          },
          "description": "List isotope exposure or addition applied to your sample.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "isotope exposure/addition",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:chem_administration"
          ],
          "string_serialization": "{termLabel} {[termID]}; {timestamp}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "env_package": {
          "name": "env_package",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "description": "Select the MIxS enviromental package that best describes the environment from which your sample was collected.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "environmental package",
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "enumeration",
          "owner": "soil_emsl_jgi_mg",
          "range": "env_package_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "analysis_type": {
          "name": "analysis_type",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Select all the data types associated or available for this biosample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Analysis/Data Type",
          "from_schema": "https://example.com/mims_soil_biosample",
          "see_also": [
            "MIxS:investigation_type"
          ],
          "string_serialization": "enumeration",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "analysis_type_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "sample_link": {
          "name": "sample_link",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "A unique identifier to assign parent-child, subsample, or sibling samples. This is relevant when a sample or other material was used to generate the new sample.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample linkage",
          "comments": [
            "This field allows multiple entries separated by ; (Examples: Soil collected from the field will link with the soil used in an incubation. The soil a plant was grown in links to the plant sample. An original culture sample was transferred to a new vial and generated a new sample)"
          ],
          "from_schema": "https://example.com/mims_soil_biosample",
          "string_serialization": "{text}:{text}",
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "ecosystem": {
          "name": "ecosystem",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "An ecosystem is a combination of a physical environment (abiotic factors) and all the organisms (biotic factors) that interact with this environment. Ecosystem is in position 1/5 in a GOLD path.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "comments": [
            "The abiotic factors play a profound role on the type and composition of organisms in a given environment. The GOLD Ecosystem at the top of the five-level classification system is aimed at capturing the broader environment from which an organism or environmental sample is collected. The three broad groups under Ecosystem are Environmental, Host-associated, and Engineered. They represent samples collected from a natural environment or from another organism or from engineered environments like bioreactors respectively."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "soil_emsl_jgi_mg",
          "range": "ecosystem_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "ecosystem_category": {
          "name": "ecosystem_category",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem categories represent divisions within the ecosystem based on specific characteristics of the environment from where an organism or sample is isolated. Ecosystem category is in position 2/5 in a GOLD path.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "comments": [
            "The Environmental ecosystem (for example) is divided into Air, Aquatic and Terrestrial. Ecosystem categories for Host-associated samples can be individual hosts or phyla and for engineered samples it may be manipulated environments like bioreactors, solid waste etc."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "soil_emsl_jgi_mg",
          "range": "ecosystem_category_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "ecosystem_subtype": {
          "name": "ecosystem_subtype",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "column_order": {
              "tag": "column_order",
              "value": "4"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem subtypes represent further subdivision of Ecosystem types into more distinct subtypes. Ecosystem subtype is in position 4/5 in a GOLD path.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "comments": [
            "Ecosystem Type Marine (Environmental -> Aquatic -> Marine) is further divided (for example) into Intertidal zone, Coastal, Pelagic, Intertidal zone etc. in the Ecosystem subtype category."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "soil_emsl_jgi_mg",
          "range": "ecosystem_subtype_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "ecosystem_type": {
          "name": "ecosystem_type",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem types represent things having common characteristics within the Ecosystem Category. These common characteristics based grouping is still broad but specific to the characteristics of a given environment. Ecosystem type is in position 3/5 in a GOLD path.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "comments": [
            "The Aquatic ecosystem category (for example) may have ecosystem types like Marine or Thermal springs etc. Ecosystem category Air may have Indoor air or Outdoor air as different Ecosystem Types. In the case of Host-associated samples, ecosystem type can represent Respiratory system, Digestive system, Roots etc."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "soil_emsl_jgi_mg",
          "range": "ecosystem_type_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "specific_ecosystem": {
          "name": "specific_ecosystem",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "column_order": {
              "tag": "column_order",
              "value": "5"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Specific ecosystems represent specific features of the environment like aphotic zone in an ocean or gastric mucosa within a host digestive system. Specific ecosystem is in position 5/5 in a GOLD path.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "comments": [
            "Specific ecosystems help to define samples based on very specific characteristics of an environment under the five-level classification system."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "soil_emsl_jgi_mg",
          "range": "specific_ecosystem_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "gold_path_field": {
          "name": "gold_path_field",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "This is a grouping for any of the gold path fields          ",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "https://microbiomedata/schema",
          "is_a": "attribute",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "attribute": {
          "name": "attribute",
          "aliases": [
            "field",
            "property",
            "template field",
            "key",
            "characteristic"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "A attribute of a biosample. Examples: depth, habitat, material. For NMDC, attributes SHOULD be mapped to terms within a MIxS template",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "https://microbiomedata/schema/core",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "environment field": {
          "name": "environment field",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "field describing environmental aspect of a sample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "core field": {
          "name": "core field",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "basic fields",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "nucleic acid sequence source field": {
          "name": "nucleic acid sequence source field",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "investigation field": {
          "name": "investigation field",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "field describing aspect of the investigation/study to which the sample belongs",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "aliases": [
            "history/agrochemical additions"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "agrochemical name;agrochemical amount;timestamp"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram, mole per liter, milligram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "20"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/agrochemical additions",
          "examples": [
            {
              "value": "roundup;5 milligram per liter;2018-06-21"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{timestamp}",
          "slot_uri": "MIXS:0000639",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "air_temp_regm": {
          "name": "air_temp_regm",
          "aliases": [
            "air temperature regimen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "temperature value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "meter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "12"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to varying temperatures; should include the temperature, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include different temperature regimens",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "air temperature regimen",
          "examples": [
            {
              "value": "25 degree Celsius;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000551",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "al_sat": {
          "name": "al_sat",
          "aliases": [
            "extreme_unusual_properties/Al saturation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "21"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Aluminum saturation (esp. For tropical soils)",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "extreme_unusual_properties/Al saturation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000607",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "aliases": [
            "extreme_unusual_properties/Al saturation method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or URL"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "22"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining Al saturation",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "extreme_unusual_properties/Al saturation method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000324",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "alt": {
          "name": "alt",
          "aliases": [
            "altitude"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "column_order": {
              "tag": "column_order",
              "value": "23"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "altitude",
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000094",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "aliases": [
            "mean annual precipitation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "24"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "mean annual precipitation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000644",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "annual_temp": {
          "name": "annual_temp",
          "aliases": [
            "mean annual temperature"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "25"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Mean annual temperature",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "mean annual temperature",
          "examples": [
            {
              "value": "12.5 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000642",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "biotic_regm": {
          "name": "biotic_regm",
          "aliases": [
            "biotic regimen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "free text"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "11"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment(s) involving use of biotic factors, such as bacteria, viruses or fungi.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "biotic regimen",
          "examples": [
            {
              "value": "sample inoculated with Rhizobium spp. Culture"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0001038",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "biotic_relationship": {
          "name": "biotic_relationship",
          "aliases": [
            "observed biotic relationship"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "column_order": {
              "tag": "column_order",
              "value": "16"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "samp_biotic_relationship"
            }
          },
          "description": "Description of relationship(s) between the subject organism and other organism(s) it is associated with. E.g., parasite on species X; mutualist with species Y. The target organism is the subject of the relationship, and the other organism(s) is the object",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "observed biotic relationship",
          "examples": [
            {
              "value": "free living"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000028",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "biotic_relationship_enum",
          "required": true,
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "carb_nitro_ratio": {
          "name": "carb_nitro_ratio",
          "aliases": [
            "carbon/nitrogen ratio"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "64"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Ratio of amount or concentrations of carbon to nitrogen",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "carbon/nitrogen ratio",
          "examples": [
            {
              "value": "0.417361111"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000310",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "chem_administration": {
          "name": "chem_administration",
          "aliases": [
            "chemical administration"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "CHEBI;timestamp"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "13"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "chemical administration",
          "examples": [
            {
              "value": "agar [CHEBI:2509];2018-05-11T20:00Z"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]};{timestamp}",
          "slot_uri": "MIXS:0000751",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "climate_environment": {
          "name": "climate_environment",
          "aliases": [
            "climate environment"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "climate name;treatment interval and duration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "14"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Treatment involving an exposure to a particular climate; treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple climates",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "climate environment",
          "examples": [
            {
              "value": "tropical climate;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0001040",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "collection_date": {
          "name": "collection_date",
          "aliases": [
            "collection date"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "date and time"
            },
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "collection_date"
            }
          },
          "description": "The date of sampling",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Collection Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only",
            "Use modified term (amended definition)"
          ],
          "comments": [
            "2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "examples": [
            {
              "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{date, arbitrary precision}",
          "slot_uri": "MIXS:0000011",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "date",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "aliases": [
            "history/crop rotation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "crop rotation status;schedule"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "26"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Whether or not crop is rotated, and if yes, rotation schedule",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/crop rotation",
          "examples": [
            {
              "value": "yes;R2/2017-01-01/2018-12-31/P6M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000318",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "aliases": [
            "current land use"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "27"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Present state of sample site",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "current land use",
          "examples": [
            {
              "value": "conifers"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001080",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "cur_land_use_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "aliases": [
            "current vegetation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "current vegetation type"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "28"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "current vegetation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000312",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "aliases": [
            "current vegetation method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "29"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in vegetation classification",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "current vegetation method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000314",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "depth": {
          "name": "depth",
          "aliases": [
            "depth"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "required where applicable"
            },
            "column_order": {
              "tag": "column_order",
              "value": "9"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "depth"
            }
          },
          "description": "The vertical distance below local surface, e.g. For sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "depth, meters",
          "notes": [
            "Use modified term"
          ],
          "comments": [
            "All depths must be reported in meters. Provide the numerical portion only."
          ],
          "examples": [
            {
              "value": "10 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{float}| {float}-{float}",
          "slot_uri": "MIXS:0000018",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "drainage_class": {
          "name": "drainage_class",
          "aliases": [
            "drainage classification"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "30"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Drainage classification from a standard system such as the USDA system",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "drainage classification",
          "examples": [
            {
              "value": "well"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001085",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "drainage_class_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "elev": {
          "name": "elev",
          "aliases": [
            "elevation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "column_order": {
              "tag": "column_order",
              "value": "6"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "elevation",
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000093",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "aliases": [
            "broad-scale environmental context"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "broad-scale environmental context",
          "examples": [
            {
              "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000012",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "aliases": [
            "local environmental context"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "Environmental entities having causal influences upon the entity at time of sampling."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "local environmental context",
          "examples": [
            {
              "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000013",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "env_medium": {
          "name": "env_medium",
          "aliases": [
            "environmental medium"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "environmental medium",
          "examples": [
            {
              "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000014",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "experimental_factor": {
          "name": "experimental_factor",
          "aliases": [
            "experimental factor"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "text or EFO and/or OBI"
            },
            "column_order": {
              "tag": "column_order",
              "value": "31"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Experimental factors are essentially the variable aspects of an experiment design which can be used to describe an experiment, or set of experiments, in an increasingly detailed manner. This field accepts ontology terms from Experimental Factor Ontology (EFO) and/or Ontology for Biomedical Investigations (OBI). For a browser of EFO (v 2.95) terms, please see http://purl.bioontology.org/ontology/EFO; for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "experimental factor",
          "examples": [
            {
              "value": "time series design [EFO:EFO_0001779]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "investigation field",
          "string_serialization": "{termLabel} {[termID]}|{text}",
          "slot_uri": "MIXS:0000008",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "extreme_event": {
          "name": "extreme_event",
          "aliases": [
            "history/extreme events"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "32"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Unusual physical events that may have affected microbial populations",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/extreme events",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000320",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "date",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "fao_class": {
          "name": "fao_class",
          "aliases": [
            "soil_taxonomic/FAO classification"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "33"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil_taxonomic/FAO classification",
          "examples": [
            {
              "value": "Luvisols"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001083",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "fao_class_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "fire": {
          "name": "fire",
          "aliases": [
            "history/fire"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "34"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Historical and/or physical evidence of fire",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/fire",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001086",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "date",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "flooding": {
          "name": "flooding",
          "aliases": [
            "history/flooding"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "35"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Historical and/or physical evidence of flooding",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/flooding",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000319",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "date",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "gaseous_environment": {
          "name": "gaseous_environment",
          "aliases": [
            "gaseous environment"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "gaseous compound name;gaseous compound amount;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "15"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Use of conditions with differing gaseous environments; should include the name of gaseous compound, amount administered, treatment duration, interval and total experimental duration; can include multiple gaseous environment regimens",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "gaseous environment",
          "examples": [
            {
              "value": "nitric oxide;0.5 micromole per liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000558",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "geo_loc_name": {
          "name": "geo_loc_name",
          "aliases": [
            "geographic location (country and/or sea,region)"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "country or sea name (INSDC or GAZ): region(GAZ), specific location name"
            },
            "column_order": {
              "tag": "column_order",
              "value": "4"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "geographic location (country and/or sea,region)",
          "examples": [
            {
              "value": "USA: Maryland, Bethesda"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{term}: {term}, {text}",
          "slot_uri": "MIXS:0000010",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "growth_facil": {
          "name": "growth_facil",
          "aliases": [
            "growth facility"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "free text or CO"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "growth_facility"
            }
          },
          "description": "Type of facility/location where the sample was harvested; controlled vocabulary: growth chamber, open top chamber, glasshouse, experimental garden, field.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "growth facility",
          "examples": [
            {
              "value": "Growth chamber [CO_715:0000189]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0001043",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "growth_facil_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "aliases": [
            "extreme_unusual_properties/heavy metals"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "heavy metal name;measurement value unit"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per gram"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "36"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "extreme_unusual_properties/heavy metals",
          "examples": [
            {
              "value": "mercury;0.09 micrograms per gram"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "slot_uri": "MIXS:0000652",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "aliases": [
            "extreme_unusual_properties/heavy metals method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "37"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining heavy metals",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "extreme_unusual_properties/heavy metals method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000343",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "aliases": [
            "horizon method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "38"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the horizon",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "horizon method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000321",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "humidity_regm": {
          "name": "humidity_regm",
          "aliases": [
            "humidity regimen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "humidity value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram per cubic meter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "16"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to varying degree of humidity; information about treatment involving use of growth hormones; should include amount of humidity administered, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "humidity regimen",
          "examples": [
            {
              "value": "25 gram per cubic meter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000568",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "lat_lon": {
          "name": "lat_lon",
          "aliases": [
            "geographic location (latitude and longitude)"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "decimal degrees,  limit to 8 decimal points"
            },
            "column_order": {
              "tag": "column_order",
              "value": "5"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "geographic location (latitude and longitude)",
          "examples": [
            {
              "value": "50.586825 6.408977"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{float} {float}",
          "slot_uri": "MIXS:0000009",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "light_regm": {
          "name": "light_regm",
          "aliases": [
            "light regimen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "exposure type;light intensity;light quality"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "lux; micrometer, nanometer, angstrom"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "17"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment(s) involving exposure to light, including both light intensity and quality.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "light regimen",
          "examples": [
            {
              "value": "incandescant light;10 lux;450 nanometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{float} {unit}",
          "slot_uri": "MIXS:0000569",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "link_class_info": {
          "name": "link_class_info",
          "aliases": [
            "link to classification information"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "39"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Link to digitized soil maps or other soil classification information",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "link to classification information",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000329",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "aliases": [
            "link to climate information"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "40"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Link to climate resource",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "link to climate information",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000328",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "local_class": {
          "name": "local_class",
          "aliases": [
            "soil_taxonomic/local classification"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "local classification name"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "41"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Soil classification based on local soil classification system",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil_taxonomic/local classification",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000330",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "aliases": [
            "soil_taxonomic/local classification method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "42"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the local soil classification",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil_taxonomic/local classification method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000331",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "micro_biomass_meth": {
          "name": "micro_biomass_meth",
          "aliases": [
            "microbial biomass method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "63"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining microbial biomass",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000339",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "aliases": [
            "microbial biomass"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "ton, kilogram, gram per kilogram soil"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "62"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "microbial biomass",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000650",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "misc_param": {
          "name": "misc_param",
          "aliases": [
            "miscellaneous parameter"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "parameter name;measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "43"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Any other measurement performed or parameter collected, that is not listed here",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "miscellaneous parameter",
          "examples": [
            {
              "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "slot_uri": "MIXS:0000752",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "org_matter": {
          "name": "org_matter",
          "aliases": [
            "organic matter"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "65"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of organic matter",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "organic matter",
          "examples": [
            {
              "value": "1.75 milligram per cubic meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000204",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "org_nitro": {
          "name": "org_nitro",
          "aliases": [
            "organic nitrogen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "66"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of organic nitrogen",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "organic nitrogen",
          "examples": [
            {
              "value": "4 micromole per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000205",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "oxy_stat_samp": {
          "name": "oxy_stat_samp",
          "aliases": [
            "oxygenation status of sample"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "44"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Oxygenation status of sample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "oxygenation status of sample",
          "examples": [
            {
              "value": "aerobic"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000753",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "oxy_stat_samp_enum",
          "all_members": {
            "_if_missing": {}
          }
        },
        "ph": {
          "name": "ph",
          "aliases": [
            "pH"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "27"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "pH"
            }
          },
          "description": "pH measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "pH",
          "notes": [
            "Use modified term"
          ],
          "examples": [
            {
              "value": "7.2"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float}",
          "slot_uri": "MIXS:0001001",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "double",
          "required": false,
          "recommended": true,
          "minimum_value": 0,
          "maximum_value": 14,
          "all_members": {
            "_if_missing": {}
          }
        },
        "ph_meth": {
          "name": "ph_meth",
          "aliases": [
            "pH method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "61"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining ph",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "pH method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0001106",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "phosphate": {
          "name": "phosphate",
          "aliases": [
            "phosphate"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "73"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of phosphate",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "phosphate",
          "examples": [
            {
              "value": "0.7 micromole per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000505",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "prev_land_use_meth": {
          "name": "prev_land_use_meth",
          "aliases": [
            "history/previous land use method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "45"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining previous land use and dates",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/previous land use method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000316",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "aliases": [
            "history/previous land use"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "land use name;date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "46"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Previous land use and dates",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/previous land use",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{timestamp}",
          "slot_uri": "MIXS:0000315",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "profile_position": {
          "name": "profile_position",
          "aliases": [
            "profile position"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "47"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "profile position",
          "examples": [
            {
              "value": "summit"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001084",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "profile_position_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "rel_to_oxygen": {
          "name": "rel_to_oxygen",
          "aliases": [
            "relationship to oxygen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "column_order": {
              "tag": "column_order",
              "value": "17"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "oxygen_relationship"
            }
          },
          "description": "Is this organism an aerobe, anaerobe? Please note that aerobic and anaerobic are valid descriptors for microbial environments",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "relationship to oxygen",
          "examples": [
            {
              "value": "aerobe"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000015",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "rel_to_oxygen_enum",
          "required": true,
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "salinity": {
          "name": "salinity",
          "aliases": [
            "salinity"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "practical salinity unit, percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "74"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "The total concentration of all dissolved salts in a liquid or solid sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "salinity",
          "examples": [
            {
              "value": "25 practical salinity unit"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000183",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "aliases": [
            "salinity method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "75"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining salinity",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "salinity method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000341",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_collec_device": {
          "name": "samp_collec_device",
          "aliases": [
            "sample collection device"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "device name"
            },
            "column_order": {
              "tag": "column_order",
              "value": "11"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collection_dev"
            }
          },
          "description": "The device used to collect an environmental sample. This field accepts terms listed under environmental sampling device (http://purl.obolibrary.org/obo/ENVO). This field also accepts terms listed under specimen collection device (http://purl.obolibrary.org/obo/GENEPIO_0002094).",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample collection device",
          "comments": [
            "Report dimensions and details when applicable"
          ],
          "examples": [
            {
              "value": "swab, biopsy, niskin bottle, push core, drag swab [GENEPIO:0002713]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{termLabel} {[termID]}|{text}",
          "slot_uri": "MIXS:0000002",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_collec_method": {
          "name": "samp_collec_method",
          "aliases": [
            "sample collection method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI,url , or text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "12"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collection_method"
            }
          },
          "description": "The method employed for collecting the sample.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample collection method",
          "comments": [
            "This can be a citation or description"
          ],
          "examples": [
            {
              "value": "swabbing"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{PMID}|{DOI}|{URL}|{text}",
          "slot_uri": "MIXS:0001225",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_mat_process": {
          "name": "samp_mat_process",
          "aliases": [
            "sample material processing"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "10"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_processing"
            }
          },
          "description": "A brief description of any processing applied to the sample during or after retrieving the sample from environment, or a link to the relevant protocol(s) performed.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample material processing",
          "examples": [
            {
              "value": "filtering of seawater, storing samples in ethanol"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000016",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_name": {
          "name": "samp_name",
          "aliases": [
            "sample name"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "disposition": {
              "tag": "disposition",
              "value": "MAM changed new, skipped or \"modified\" to shuffle w or wo modification"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_name"
            }
          },
          "description": "A local identifier or name that for the material sample collected. Refers to the original material collected or to any derived sub-samples.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample name",
          "comments": [
            "It can have any format, but we suggest that you make it concise, unique and consistent within your lab, and as informative as possible."
          ],
          "examples": [
            {
              "value": "ISDsoil1"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "investigation field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0001107",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_size": {
          "name": "samp_size",
          "aliases": [
            "amount or size of sample collected"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millliter, gram, milligram, liter"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "optional"
            },
            "column_order": {
              "tag": "column_order",
              "value": "14"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collected"
            }
          },
          "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample collected.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "amount or size of sample collected",
          "comments": [
            "This refers to the TOTAL amount of sample collected from the experiment. NOT the amount sent to each institution or collected for a specific analysis."
          ],
          "examples": [
            {
              "value": "5 liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{float} {unit}",
          "slot_uri": "MIXS:0000001",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "samp_store_temp": {
          "name": "samp_store_temp",
          "aliases": [
            "sample storage temperature"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "7"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Temperature at which sample was stored, e.g. -80 degree Celsius",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "sample storage temperature",
          "examples": [
            {
              "value": "-80 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000110",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "season_precpt": {
          "name": "season_precpt",
          "aliases": [
            "mean seasonal precipitation"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "48"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "mean seasonal precipitation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000645",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "season_temp": {
          "name": "season_temp",
          "aliases": [
            "mean seasonal temperature"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "49"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Mean seasonal temperature",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "mean seasonal temperature",
          "examples": [
            {
              "value": "18 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000643",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "sieving": {
          "name": "sieving",
          "aliases": [
            "composite design/sieving"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "design name and/or size;amount"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "8"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "composite design/sieving",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
          "slot_uri": "MIXS:0000322",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "size_frac_low": {
          "name": "size_frac_low",
          "aliases": [
            "size-fraction lower threshold"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micrometer"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "9"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "size-fraction lower threshold",
          "examples": [
            {
              "value": "0.2 micrometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000735",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "size_frac_up": {
          "name": "size_frac_up",
          "aliases": [
            "size-fraction upper threshold"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micrometer"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "10"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "size-fraction upper threshold",
          "examples": [
            {
              "value": "20 micrometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000736",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "aliases": [
            "slope aspect"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "19"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "slope aspect",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000647",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "aliases": [
            "slope gradient"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "50"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "slope gradient",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000646",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "soil_horizon": {
          "name": "soil_horizon",
          "aliases": [
            "soil horizon"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "51"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil horizon",
          "examples": [
            {
              "value": "A horizon"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001082",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "soil_horizon_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "soil_text_measure": {
          "name": "soil_text_measure",
          "aliases": [
            "soil texture measurement"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "52"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil texture measurement",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000335",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "soil_texture_meth": {
          "name": "soil_texture_meth",
          "aliases": [
            "soil texture method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "53"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining soil texture",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil texture method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000336",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "soil_type": {
          "name": "soil_type",
          "aliases": [
            "soil type"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "ENVO_00001998"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "54"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil type",
          "examples": [
            {
              "value": "plinthosol [ENVO:00002250]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000332",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "aliases": [
            "soil type method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "55"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining soil series name or other lower-level classification",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "soil type method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000334",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "source_mat_id": {
          "name": "source_mat_id",
          "aliases": [
            "source material identifiers"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "for cultures of microorganisms: identifiers for two culture collections; for other material a unique arbitrary identifer"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "disposition": {
              "tag": "disposition",
              "value": "MAM changed new, skipped or \"modified\" to shuffle w or wo modification"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "unique_ID"
            }
          },
          "description": "A globally unique identifier assigned to the biological sample.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "Globally Unique ID",
          "notes": [
            "The source material IS the Globally Unique ID"
          ],
          "comments": [
            "Identifiers must be prefixed. IGSNs (http://www.geosamples.org/getigsn) are unique and FAIR. UUIDs (https://www.uuidgenerator.net/) are globally unique but not FAIR. These IDs enable linking to derrived analytes and subsamples."
          ],
          "examples": [
            {
              "value": "MPI012345"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{text}:{text}",
          "slot_uri": "MIXS:0000026",
          "multivalued": false,
          "identifier": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": true,
          "recommended": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "store_cond": {
          "name": "store_cond",
          "aliases": [
            "storage conditions"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "storage condition type;duration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "storage_condt"
            }
          },
          "description": "Explain how the soil sample is stored (fresh/frozen/other).",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "storage conditions",
          "examples": [
            {
              "value": "-20 degree Celsius freezer;P2Y10D"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000327",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "store_cond_enum",
          "required": true,
          "all_members": {
            "_if_missing": {}
          }
        },
        "temp": {
          "name": "temp",
          "aliases": [
            "temperature"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "column_order": {
              "tag": "column_order",
              "value": "56"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Temperature of the sample at the time of sampling.",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "temperature",
          "examples": [
            {
              "value": "25 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000113",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "tillage": {
          "name": "tillage",
          "aliases": [
            "history/tillage"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "57"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Note method(s) used for tilling",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "history/tillage",
          "examples": [
            {
              "value": "chisel"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001081",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "tillage_enum",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_carb": {
          "name": "tot_carb",
          "aliases": [
            "total carbon"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "67"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Total carbon content",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total carbon",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000525",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_nitro_cont_meth": {
          "name": "tot_nitro_cont_meth",
          "aliases": [
            "total nitrogen content method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "69"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the total nitrogen",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total nitrogen content method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000338",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "aliases": [
            "total nitrogen content"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter, micromole per liter, milligram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "68"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Total nitrogen content of the sample",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total nitrogen content",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000530",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "aliases": [
            "total organic carbon method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "71"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining total organic carbon",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total organic carbon method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000337",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "aliases": [
            "total organic carbon"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram Carbon per kilogram sample material"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "70"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total organic carbon",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000533",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "tot_phosp": {
          "name": "tot_phosp",
          "aliases": [
            "total phosphorus"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter, milligram per liter, parts per million"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "72"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "total phosphorus",
          "examples": [
            {
              "value": "0.03 milligram per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000117",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "all_members": {
            "_if_missing": {}
          }
        },
        "water_cont_soil_meth": {
          "name": "water_cont_soil_meth",
          "aliases": [
            "water content method"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "59"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the water content of soil",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "water content method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000323",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "water_content": {
          "name": "water_content",
          "aliases": [
            "water content"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram per gram or cubic centimeter per cubic centimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "58"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Water content measurement",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "water content",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000185",
          "multivalued": false,
          "owner": "soil_emsl_jgi_mg",
          "range": "quantity value",
          "required": false,
          "all_members": {
            "_if_missing": {}
          }
        },
        "watering_regm": {
          "name": "watering_regm",
          "aliases": [
            "watering regimen"
          ],
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {},
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "milliliter, liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "18"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to watering frequencies, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "title": "watering regimen",
          "examples": [
            {
              "value": "1 liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000591",
          "multivalued": true,
          "owner": "soil_emsl_jgi_mg",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        }
      },
      "slot_usage": {
        "project_ID": {
          "name": "project_ID",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "1"
            }
          },
          "description": "Proposal IDs or names associated with dataset",
          "title": "Project ID",
          "string_serialization": "{text}",
          "required": true
        },
        "sample_type": {
          "name": "sample_type",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "2"
            }
          },
          "description": "Type of sample being submitted",
          "title": "sample type",
          "comments": [
            "This can vary from 'environmental package' if the sample is an extraction."
          ],
          "string_serialization": "enumeration",
          "required": true
        },
        "sample_shipped": {
          "name": "sample_shipped",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample sent to EMSL",
          "title": "sample shipped amount",
          "string_serialization": "{float} {unit}",
          "required": true
        },
        "EMSL_store_temp": {
          "name": "EMSL_store_temp",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Temperature at which the sample sent to EMSL should be stored",
          "title": "EMSL Sample Storage Temperature, deg. C",
          "comments": [
            "Enter a temperature in celsius. Numeric portion only."
          ],
          "string_serialization": "{float}",
          "required": true
        },
        "technical_reps": {
          "name": "technical_reps",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "If sending multiple technical replicates of the same sample, indicate how many replicates are being sent",
          "title": "Number Technical Replicate",
          "string_serialization": "{integer}",
          "recommended": true
        },
        "replicate_number": {
          "name": "replicate_number",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "EMSL"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "description": "If sending biological replicates, indicate the rep number here.",
          "title": "Replicate Number",
          "comments": [
            "This will guide staff in ensuring your samples are block & randomized correctly"
          ],
          "string_serialization": "{integer}",
          "recommended": true
        },
        "dna_seq_project": {
          "name": "dna_seq_project",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "1"
            }
          },
          "title": "DNA Seq Project ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "dna_seq_project_name": {
          "name": "dna_seq_project_name",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "2"
            }
          },
          "title": "DNA Seq Project Name",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "dna_samp_ID": {
          "name": "dna_samp_ID",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "title": "DNA Sample ID",
          "todos": [
            "Removed identifier = TRUE from dna_samp_ID in JGI_sample_slots, as a class can't have two identifiers. How to force uniqueness? Moot because that column will be prefilled?"
          ],
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "dna_sample_name": {
          "name": "dna_sample_name",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Give the DNA sample a name that is meaningful to you. Sample names must be unique across all JGI projects and contain a-z, A-Z, 0-9, - and _ only.",
          "title": "DNA Sample Name",
          "string_serialization": "{text}",
          "required": true
        },
        "dna_concentration": {
          "name": "dna_concentration",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "title": "DNA Concentration in ng/uL",
          "comments": [
            "Units must be in ng/uL. Enter the numerical part only. Must be calculated using a fluorometric method. Acceptable values are 0-2000."
          ],
          "string_serialization": "{float}",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 2000
        },
        "dna_volume": {
          "name": "dna_volume",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "title": "DNA Volume in uL",
          "comments": [
            "Units must be in uL. Enter the numerical part only. Value must 0-1000. Values <25 by special permission only."
          ],
          "string_serialization": "{float}",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 1000
        },
        "dna_absorb1": {
          "name": "dna_absorb1",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "7"
            }
          },
          "description": "260/280 measurement of DNA sample purity",
          "title": "DNA Absorbance 260/280",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "string_serialization": "{float}",
          "required": true
        },
        "dna_absorb2": {
          "name": "dna_absorb2",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "8"
            }
          },
          "description": "260/230 measurement of DNA sample purity",
          "title": "DNA Absorbance 260/230",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "string_serialization": "{float}",
          "recommended": true
        },
        "dna_container_ID": {
          "name": "dna_container_ID",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "9"
            }
          },
          "title": "DNA Container Label",
          "comments": [
            "Must be unique across all tubes and plates, and <20 characters. All samples in a plate should have the same plate label."
          ],
          "string_serialization": "{text < 20 characters}",
          "required": true
        },
        "dna_cont_type": {
          "name": "dna_cont_type",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "10"
            }
          },
          "description": "Tube or plate (96-well)",
          "title": "DNA Container Type",
          "string_serialization": "enumeration",
          "range": "dna_cont_type_enum",
          "required": true
        },
        "dna_cont_well": {
          "name": "dna_cont_well",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "11"
            }
          },
          "title": "DNA Well Number",
          "comments": [
            "Required when 'plate' is selected for container type. Corner wells must be blank. For partial plates, fill by columns. Leave blank if the sample will be shipped in a tube."
          ],
          "string_serialization": "{96 well plate pos}",
          "required": true
        },
        "dna_sample_format": {
          "name": "dna_sample_format",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "12"
            }
          },
          "description": "Solution in which the DNA sample has been suspended",
          "title": "DNA Sample Format",
          "string_serialization": "enumeration",
          "range": "dna_sample_format_enum",
          "required": true
        },
        "dna_dnase": {
          "name": "dna_dnase",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "13"
            }
          },
          "title": "DNAse Treatment DNA",
          "comments": [
            "Note DNAse treatment is required for all RNA samples."
          ],
          "string_serialization": "enumeration",
          "range": "dna_dnase_enum",
          "required": true
        },
        "dna_organisms": {
          "name": "dna_organisms",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "14"
            }
          },
          "description": "List any organisms known or suspected to grow in co-culture, as well as estimated % of the organism in that culture.",
          "title": "DNA Expected Organisms",
          "string_serialization": "{text}",
          "recommended": true
        },
        "dna_collect_site": {
          "name": "dna_collect_site",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "15"
            }
          },
          "description": "Provide information on the site your DNA sample was collected from",
          "title": "DNA Collection Site",
          "string_serialization": "{text}",
          "required": true
        },
        "dna_isolate_meth": {
          "name": "dna_isolate_meth",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "16"
            }
          },
          "description": "Describe the method/protocol/kit used to extract DNA/RNA.",
          "title": "DNA Isolation Method",
          "string_serialization": "{text}",
          "required": true
        },
        "dna_seq_project_PI": {
          "name": "dna_seq_project_PI",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "17"
            }
          },
          "title": "DNA Seq Project PI",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "dna_project_contact": {
          "name": "dna_project_contact",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "18"
            }
          },
          "title": "DNA Seq Project Contact",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "proposal_dna": {
          "name": "proposal_dna",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metagenomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "19"
            }
          },
          "title": "DNA Proposal ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_seq_project": {
          "name": "rna_seq_project",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "20"
            }
          },
          "title": "RNA Seq Project ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_seq_project_name": {
          "name": "rna_seq_project_name",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "21"
            }
          },
          "title": "RNA Seq Project Name",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_samp_ID": {
          "name": "rna_samp_ID",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "22"
            }
          },
          "title": "RNA Sample ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_sample_name": {
          "name": "rna_sample_name",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "23"
            }
          },
          "description": "Give the RNA sample a name that is meaningful to you. Sample names must be unique across all JGI projects and contain a-z, A-Z, 0-9, - and _ only.",
          "title": "RNA Sample Name",
          "string_serialization": "{text}",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 2000
        },
        "rna_concentration": {
          "name": "rna_concentration",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "24"
            }
          },
          "title": "RNA Concentration in ng/uL",
          "comments": [
            "Units must be in ng/uL. Enter the numerical part only. Must be calculated using a fluorometric method. Acceptable values are 0-2000."
          ],
          "string_serialization": "{float}",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 1000
        },
        "rna_volume": {
          "name": "rna_volume",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "25"
            }
          },
          "title": "RNA Volume in uL",
          "comments": [
            "Units must be in uL. Enter the numerical part only. Value must 0-1000. Values <25 by special permission only."
          ],
          "string_serialization": "{float}",
          "required": true
        },
        "rna_absorb1": {
          "name": "rna_absorb1",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "26"
            }
          },
          "description": "260/280 measurement of RNA sample purity",
          "title": "RNA Absorbance 260/280",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "string_serialization": "{float}",
          "required": true
        },
        "rna_absorb2": {
          "name": "rna_absorb2",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "27"
            }
          },
          "description": "260/230 measurement of RNA sample purity",
          "title": "RNA Absorbance 260/230",
          "comments": [
            "Recommended value is between 1 and 3."
          ],
          "string_serialization": "{float}",
          "recommended": true
        },
        "rna_container_ID": {
          "name": "rna_container_ID",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "28"
            }
          },
          "title": "RNA Container Label",
          "comments": [
            "Must be unique across all tubes and plates, and <20 characters. All samples in a plate should have the same plate label."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_cont_type": {
          "name": "rna_cont_type",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "29"
            }
          },
          "description": "Tube or plate (96-well)",
          "title": "RNA Container Type",
          "string_serialization": "enumeration",
          "range": "rna_cont_type_enum",
          "required": true
        },
        "rna_cont_well": {
          "name": "rna_cont_well",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "30"
            }
          },
          "title": "RNA Well Number",
          "comments": [
            "Required when 'plate' is selected for container type. Corner wells must be blank. For partial plates, fill by columns. Leave blank if the sample will be shipped in a tube."
          ],
          "string_serialization": "{96 well plate pos}",
          "required": true
        },
        "rna_sample_format": {
          "name": "rna_sample_format",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "31"
            }
          },
          "description": "Solution in which the RNA sample has been suspended",
          "title": "RNA Sample Format",
          "string_serialization": "enumeration",
          "required": true
        },
        "dnase_rna": {
          "name": "dnase_rna",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "32"
            }
          },
          "title": "DNAse Treated",
          "comments": [
            "Note DNAse treatment is required for all RNA samples."
          ],
          "string_serialization": "enumeration",
          "range": "dnase_rna_enum",
          "required": true
        },
        "rna_organisms": {
          "name": "rna_organisms",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "33"
            }
          },
          "description": "List any organisms known or suspected to grow in co-culture, as well as estimated % of the organism in that culture.",
          "title": "RNA Expected Organisms",
          "string_serialization": "{text}",
          "recommended": true
        },
        "rna_collect_site": {
          "name": "rna_collect_site",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "34"
            }
          },
          "description": "Provide information on the site your RNA sample was collected from",
          "title": "RNA Collection Site",
          "string_serialization": "{text}",
          "required": true
        },
        "rna_isolate_meth": {
          "name": "rna_isolate_meth",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "35"
            }
          },
          "description": "Describe the method/protocol/kit used to extract DNA/RNA.",
          "title": "RNA Isolation Method",
          "string_serialization": "{text}",
          "required": true
        },
        "rna_seq_project_PI": {
          "name": "rna_seq_project_PI",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "36"
            }
          },
          "title": "RNA Seq Project PI",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "rna_project_contact": {
          "name": "rna_project_contact",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "37"
            }
          },
          "title": "RNA Seq Project Contact",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "proposal_rna": {
          "name": "proposal_rna",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "JGI metatranscriptomics"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "38"
            }
          },
          "title": "RNA Proposal ID",
          "comments": [
            "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled."
          ],
          "string_serialization": "{text}",
          "required": true
        },
        "non_microb_biomass": {
          "name": "non_microb_biomass",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "18"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Amount of biomass; should include the name for the part of biomass measured, e.g.insect, plant, total. Can include multiple measurements separated by ;",
          "title": "non-microbial biomass",
          "see_also": [
            "MIxS:biomass|microbial_biomass"
          ],
          "string_serialization": "{text};{float} {unit}"
        },
        "non_microb_biomass_method": {
          "name": "non_microb_biomass_method",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "19"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining biomass",
          "title": "non-microbial biomass method",
          "comments": [
            "required if \"non-microbial biomass\" is provided"
          ],
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}"
        },
        "microbial_biomass_C": {
          "name": "microbial_biomass_C",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "20"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "title": "microbial biomass carbon",
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{float} {unit}"
        },
        "micro_biomass_C_meth": {
          "name": "micro_biomass_C_meth",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "21"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining microbial biomass",
          "title": "microbial biomass carbon method",
          "comments": [
            "required if \"microbial_biomass_C\" is provided"
          ],
          "see_also": [
            "MIxS:micro_biomass_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "recommended": true
        },
        "microbial_biomass_N": {
          "name": "microbial_biomass_N",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "22"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "title": "microbial biomass nitrogen",
          "see_also": [
            "MIxS:microbial_biomass"
          ],
          "string_serialization": "{float} {unit}"
        },
        "micro_biomass_N_meth": {
          "name": "micro_biomass_N_meth",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "23"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Reference or method used in determining microbial biomass nitrogen",
          "title": "microbial biomass nitrogen method",
          "comments": [
            "required if \"microbial_biomass_N\" is provided"
          ],
          "see_also": [
            "MIxS:micro_biomass_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}"
        },
        "org_nitro_method": {
          "name": "org_nitro_method",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Optional"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "24"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            }
          },
          "description": "Method used for obtaining organic nitrogen",
          "title": "organic nitrogen method",
          "comments": [
            "required if \"org_nitro\" is provided"
          ],
          "see_also": [
            "MIxS:org_nitro|tot_nitro_cont_meth"
          ],
          "string_serialization": "{PMID}|{DOI}|{URL}"
        },
        "collection_time": {
          "name": "collection_time",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "The time of sampling, either as an instance (single point) or interval.",
          "title": "collection time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "recommended": true
        },
        "collection_date_inc": {
          "name": "collection_date_inc",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "Date the incubation was harvested/collected/ended. Only relevant for incubation samples.",
          "title": "Incubation Collection Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only"
          ],
          "comments": [
            "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{date, arbitrary precision}",
          "recommended": true
        },
        "collection_time_inc": {
          "name": "collection_time_inc",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "6"
            }
          },
          "description": "Time the incubation was harvested/collected/ended. Only relevant for incubation samples.",
          "title": "Incubation Collection Time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "recommended": true
        },
        "start_date_inc": {
          "name": "start_date_inc",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "7"
            }
          },
          "description": "Date the incubation was started. Only relevant for incubation samples.",
          "title": "Incubation Start Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only"
          ],
          "comments": [
            "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{date, arbitrary precision}",
          "recommended": true
        },
        "start_time_inc": {
          "name": "start_time_inc",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "8"
            }
          },
          "description": "Time the incubation was started. Only relevant for incubation samples.",
          "title": "Incubation Start Time, GMT",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking seconds optional time only"
          ],
          "comments": [
            "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter"
          ],
          "see_also": [
            "MIxS:collection_date"
          ],
          "string_serialization": "{time, seconds optional}",
          "recommended": true
        },
        "filter_method": {
          "name": "filter_method",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "13"
            }
          },
          "description": "Type of filter used or how the sample was filtered",
          "title": "Filter Method",
          "see_also": [
            "MIxS:filter_type"
          ],
          "string_serialization": "{text}",
          "recommended": true
        },
        "experimental_factor_other": {
          "name": "experimental_factor_other",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "15"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "optional"
            }
          },
          "description": "Other details about your sample that you feel can't be accurately represented in the available columns.",
          "title": "experimental factor- other",
          "see_also": [
            "MIxS:experimental_factor|additional_info"
          ],
          "string_serialization": "{text}",
          "recommended": true
        },
        "other_treatment": {
          "name": "other_treatment",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "25"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            }
          },
          "description": "Other treatments applied to your samples that are not applicable to the provided fields",
          "title": "other treatments",
          "see_also": [
            "MIxS:additional_info"
          ],
          "string_serialization": "{text}",
          "recommended": true
        },
        "isotope_exposure": {
          "name": "isotope_exposure",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "MIxS Inspired Metadata, Required Where Applicable"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "26"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            }
          },
          "description": "List isotope exposure or addition applied to your sample.",
          "title": "isotope exposure/addition",
          "see_also": [
            "MIxS:chem_administration"
          ],
          "string_serialization": "{termLabel} {[termID]}; {timestamp}",
          "recommended": true
        },
        "env_package": {
          "name": "env_package",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "3"
            }
          },
          "description": "Select the MIxS enviromental package that best describes the environment from which your sample was collected.",
          "title": "environmental package",
          "string_serialization": "enumeration",
          "range": "env_package_enum",
          "required": true
        },
        "analysis_type": {
          "name": "analysis_type",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "4"
            }
          },
          "description": "Select all the data types associated or available for this biosample",
          "title": "Analysis/Data Type",
          "see_also": [
            "MIxS:investigation_type"
          ],
          "string_serialization": "enumeration",
          "multivalued": true,
          "range": "analysis_type_enum",
          "required": true
        },
        "sample_link": {
          "name": "sample_link",
          "annotations": {
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "dh:column_number": {
              "tag": "dh:column_number",
              "value": "5"
            }
          },
          "description": "A unique identifier to assign parent-child, subsample, or sibling samples. This is relevant when a sample or other material was used to generate the new sample.",
          "title": "sample linkage",
          "comments": [
            "This field allows multiple entries separated by ; (Examples: Soil collected from the field will link with the soil used in an incubation. The soil a plant was grown in links to the plant sample. An original culture sample was transferred to a new vial and generated a new sample)"
          ],
          "string_serialization": "{text}:{text}",
          "recommended": true
        },
        "ecosystem": {
          "name": "ecosystem",
          "annotations": {
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "An ecosystem is a combination of a physical environment (abiotic factors) and all the organisms (biotic factors) that interact with this environment. Ecosystem is in position 1/5 in a GOLD path.",
          "comments": [
            "The abiotic factors play a profound role on the type and composition of organisms in a given environment. The GOLD Ecosystem at the top of the five-level classification system is aimed at capturing the broader environment from which an organism or environmental sample is collected. The three broad groups under Ecosystem are Environmental, Host-associated, and Engineered. They represent samples collected from a natural environment or from another organism or from engineered environments like bioreactors respectively."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "biosample",
          "range": "ecosystem_enum"
        },
        "ecosystem_category": {
          "name": "ecosystem_category",
          "annotations": {
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem categories represent divisions within the ecosystem based on specific characteristics of the environment from where an organism or sample is isolated. Ecosystem category is in position 2/5 in a GOLD path.",
          "comments": [
            "The Environmental ecosystem (for example) is divided into Air, Aquatic and Terrestrial. Ecosystem categories for Host-associated samples can be individual hosts or phyla and for engineered samples it may be manipulated environments like bioreactors, solid waste etc."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "biosample",
          "range": "ecosystem_category_enum"
        },
        "ecosystem_subtype": {
          "name": "ecosystem_subtype",
          "annotations": {
            "column_order": {
              "tag": "column_order",
              "value": "4"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem subtypes represent further subdivision of Ecosystem types into more distinct subtypes. Ecosystem subtype is in position 4/5 in a GOLD path.",
          "comments": [
            "Ecosystem Type Marine (Environmental -> Aquatic -> Marine) is further divided (for example) into Intertidal zone, Coastal, Pelagic, Intertidal zone etc. in the Ecosystem subtype category."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "biosample",
          "range": "ecosystem_subtype_enum"
        },
        "ecosystem_type": {
          "name": "ecosystem_type",
          "annotations": {
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Ecosystem types represent things having common characteristics within the Ecosystem Category. These common characteristics based grouping is still broad but specific to the characteristics of a given environment. Ecosystem type is in position 3/5 in a GOLD path.",
          "comments": [
            "The Aquatic ecosystem category (for example) may have ecosystem types like Marine or Thermal springs etc. Ecosystem category Air may have Indoor air or Outdoor air as different Ecosystem Types. In the case of Host-associated samples, ecosystem type can represent Respiratory system, Digestive system, Roots etc."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "biosample",
          "range": "ecosystem_type_enum"
        },
        "specific_ecosystem": {
          "name": "specific_ecosystem",
          "annotations": {
            "column_order": {
              "tag": "column_order",
              "value": "5"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "GOLD ecosystem path"
            }
          },
          "description": "Specific ecosystems represent specific features of the environment like aphotic zone in an ocean or gastric mucosa within a host digestive system. Specific ecosystem is in position 5/5 in a GOLD path.",
          "comments": [
            "Specific ecosystems help to define samples based on very specific characteristics of an environment under the five-level classification system."
          ],
          "from_schema": "https://microbiomedata/schema",
          "see_also": [
            "https://gold.jgi.doe.gov/help"
          ],
          "is_a": "gold_path_field",
          "owner": "biosample",
          "range": "specific_ecosystem_enum"
        },
        "gold_path_field": {
          "name": "gold_path_field",
          "description": "This is a grouping for any of the gold path fields          ",
          "from_schema": "https://microbiomedata/schema",
          "is_a": "attribute",
          "abstract": true,
          "owner": "biosample",
          "range": "string"
        },
        "attribute": {
          "name": "attribute",
          "aliases": [
            "field",
            "property",
            "template field",
            "key",
            "characteristic"
          ],
          "description": "A attribute of a biosample. Examples: depth, habitat, material. For NMDC, attributes SHOULD be mapped to terms within a MIxS template",
          "from_schema": "https://microbiomedata/schema/core",
          "abstract": true,
          "owner": "biosample",
          "range": "string"
        },
        "environment field": {
          "name": "environment field",
          "description": "field describing environmental aspect of a sample",
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil MIMS"
        },
        "core field": {
          "name": "core field",
          "description": "basic fields",
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil MIMS"
        },
        "nucleic acid sequence source field": {
          "name": "nucleic acid sequence source field",
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil MIMS"
        },
        "investigation field": {
          "name": "investigation field",
          "description": "field describing aspect of the investigation/study to which the sample belongs",
          "from_schema": "http://w3id.org/mixs/terms",
          "abstract": true,
          "owner": "soil MIMS"
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "aliases": [
            "history/agrochemical additions"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "agrochemical name;agrochemical amount;timestamp"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram, mole per liter, milligram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "20"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
          "title": "history/agrochemical additions",
          "examples": [
            {
              "value": "roundup;5 milligram per liter;2018-06-21"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{timestamp}",
          "slot_uri": "MIXS:0000639",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "air_temp_regm": {
          "name": "air_temp_regm",
          "aliases": [
            "air temperature regimen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "temperature value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "meter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "12"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to varying temperatures; should include the temperature, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include different temperature regimens",
          "title": "air temperature regimen",
          "examples": [
            {
              "value": "25 degree Celsius;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000551",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        },
        "al_sat": {
          "name": "al_sat",
          "aliases": [
            "extreme_unusual_properties/Al saturation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "21"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Aluminum saturation (esp. For tropical soils)",
          "title": "extreme_unusual_properties/Al saturation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000607",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "aliases": [
            "extreme_unusual_properties/Al saturation method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or URL"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "22"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining Al saturation",
          "title": "extreme_unusual_properties/Al saturation method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000324",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "alt": {
          "name": "alt",
          "aliases": [
            "altitude"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "column_order": {
              "tag": "column_order",
              "value": "23"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
          "title": "altitude",
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000094",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "aliases": [
            "mean annual precipitation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "24"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "title": "mean annual precipitation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000644",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "annual_temp": {
          "name": "annual_temp",
          "aliases": [
            "mean annual temperature"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "25"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Mean annual temperature",
          "title": "mean annual temperature",
          "examples": [
            {
              "value": "12.5 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000642",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "biotic_regm": {
          "name": "biotic_regm",
          "aliases": [
            "biotic regimen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "free text"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "11"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment(s) involving use of biotic factors, such as bacteria, viruses or fungi.",
          "title": "biotic regimen",
          "examples": [
            {
              "value": "sample inoculated with Rhizobium spp. Culture"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0001038",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string"
        },
        "biotic_relationship": {
          "name": "biotic_relationship",
          "aliases": [
            "observed biotic relationship"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "column_order": {
              "tag": "column_order",
              "value": "16"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "samp_biotic_relationship"
            }
          },
          "description": "Description of relationship(s) between the subject organism and other organism(s) it is associated with. E.g., parasite on species X; mutualist with species Y. The target organism is the subject of the relationship, and the other organism(s) is the object",
          "title": "observed biotic relationship",
          "examples": [
            {
              "value": "free living"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000028",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "biotic_relationship_enum",
          "required": true,
          "recommended": true
        },
        "carb_nitro_ratio": {
          "name": "carb_nitro_ratio",
          "aliases": [
            "carbon/nitrogen ratio"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "64"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Ratio of amount or concentrations of carbon to nitrogen",
          "title": "carbon/nitrogen ratio",
          "examples": [
            {
              "value": "0.417361111"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000310",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "chem_administration": {
          "name": "chem_administration",
          "aliases": [
            "chemical administration"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "CHEBI;timestamp"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "13"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi",
          "title": "chemical administration",
          "examples": [
            {
              "value": "agar [CHEBI:2509];2018-05-11T20:00Z"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]};{timestamp}",
          "slot_uri": "MIXS:0000751",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        },
        "climate_environment": {
          "name": "climate_environment",
          "aliases": [
            "climate environment"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "climate name;treatment interval and duration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "14"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Treatment involving an exposure to a particular climate; treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple climates",
          "title": "climate environment",
          "examples": [
            {
              "value": "tropical climate;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0001040",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        },
        "collection_date": {
          "name": "collection_date",
          "aliases": [
            "collection date"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "date and time"
            },
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "collection_date"
            }
          },
          "description": "The date of sampling",
          "title": "Collection Date",
          "notes": [
            "MIxS collection_date accepts (truncated) ISO8601. DH taking arb prec date only",
            "Use modified term (amended definition)"
          ],
          "comments": [
            "2021-04-15, 2021-04 and 2021 are all acceptable."
          ],
          "examples": [
            {
              "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{date, arbitrary precision}",
          "slot_uri": "MIXS:0000011",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "date",
          "required": true
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "aliases": [
            "history/crop rotation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "crop rotation status;schedule"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "26"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Whether or not crop is rotated, and if yes, rotation schedule",
          "title": "history/crop rotation",
          "examples": [
            {
              "value": "yes;R2/2017-01-01/2018-12-31/P6M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000318",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "aliases": [
            "current land use"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "27"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Present state of sample site",
          "title": "current land use",
          "examples": [
            {
              "value": "conifers"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001080",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "cur_land_use_enum",
          "required": false
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "aliases": [
            "current vegetation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "current vegetation type"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "28"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
          "title": "current vegetation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000312",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "aliases": [
            "current vegetation method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "29"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in vegetation classification",
          "title": "current vegetation method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000314",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "depth": {
          "name": "depth",
          "aliases": [
            "depth"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "required where applicable"
            },
            "column_order": {
              "tag": "column_order",
              "value": "9"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "depth"
            }
          },
          "description": "The vertical distance below local surface, e.g. For sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.",
          "title": "depth, meters",
          "notes": [
            "Use modified term"
          ],
          "comments": [
            "All depths must be reported in meters. Provide the numerical portion only."
          ],
          "examples": [
            {
              "value": "10 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{float}| {float}-{float}",
          "slot_uri": "MIXS:0000018",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": true
        },
        "drainage_class": {
          "name": "drainage_class",
          "aliases": [
            "drainage classification"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "30"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Drainage classification from a standard system such as the USDA system",
          "title": "drainage classification",
          "examples": [
            {
              "value": "well"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001085",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "drainage_class_enum",
          "required": false
        },
        "elev": {
          "name": "elev",
          "aliases": [
            "elevation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "column_order": {
              "tag": "column_order",
              "value": "6"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
          "title": "elevation",
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000093",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": true
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "aliases": [
            "broad-scale environmental context"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
          "title": "broad-scale environmental context",
          "examples": [
            {
              "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000012",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "aliases": [
            "local environmental context"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "Environmental entities having causal influences upon the entity at time of sampling."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
          "title": "local environmental context",
          "examples": [
            {
              "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000013",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "env_medium": {
          "name": "env_medium",
          "aliases": [
            "environmental medium"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "sample identification"
            },
            "column_order": {
              "tag": "column_order",
              "value": "3"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
          "title": "environmental medium",
          "examples": [
            {
              "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000014",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "experimental_factor": {
          "name": "experimental_factor",
          "aliases": [
            "experimental factor"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "text or EFO and/or OBI"
            },
            "column_order": {
              "tag": "column_order",
              "value": "31"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Experimental factors are essentially the variable aspects of an experiment design which can be used to describe an experiment, or set of experiments, in an increasingly detailed manner. This field accepts ontology terms from Experimental Factor Ontology (EFO) and/or Ontology for Biomedical Investigations (OBI). For a browser of EFO (v 2.95) terms, please see http://purl.bioontology.org/ontology/EFO; for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI",
          "title": "experimental factor",
          "examples": [
            {
              "value": "time series design [EFO:EFO_0001779]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "investigation field",
          "string_serialization": "{termLabel} {[termID]}|{text}",
          "slot_uri": "MIXS:0000008",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "recommended": true
        },
        "extreme_event": {
          "name": "extreme_event",
          "aliases": [
            "history/extreme events"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "32"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Unusual physical events that may have affected microbial populations",
          "title": "history/extreme events",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000320",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "date",
          "required": false
        },
        "fao_class": {
          "name": "fao_class",
          "aliases": [
            "soil_taxonomic/FAO classification"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "33"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
          "title": "soil_taxonomic/FAO classification",
          "examples": [
            {
              "value": "Luvisols"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001083",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "fao_class_enum",
          "required": false
        },
        "fire": {
          "name": "fire",
          "aliases": [
            "history/fire"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "34"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Historical and/or physical evidence of fire",
          "title": "history/fire",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001086",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "date",
          "required": false
        },
        "flooding": {
          "name": "flooding",
          "aliases": [
            "history/flooding"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "35"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Historical and/or physical evidence of flooding",
          "title": "history/flooding",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000319",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "date",
          "required": false
        },
        "gaseous_environment": {
          "name": "gaseous_environment",
          "aliases": [
            "gaseous environment"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "gaseous compound name;gaseous compound amount;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "15"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Use of conditions with differing gaseous environments; should include the name of gaseous compound, amount administered, treatment duration, interval and total experimental duration; can include multiple gaseous environment regimens",
          "title": "gaseous environment",
          "examples": [
            {
              "value": "nitric oxide;0.5 micromole per liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000558",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        },
        "geo_loc_name": {
          "name": "geo_loc_name",
          "aliases": [
            "geographic location (country and/or sea,region)"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "country or sea name (INSDC or GAZ): region(GAZ), specific location name"
            },
            "column_order": {
              "tag": "column_order",
              "value": "4"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
          "title": "geographic location (country and/or sea,region)",
          "examples": [
            {
              "value": "USA: Maryland, Bethesda"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{term}: {term}, {text}",
          "slot_uri": "MIXS:0000010",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "growth_facil": {
          "name": "growth_facil",
          "aliases": [
            "growth facility"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "free text or CO"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "growth_facility"
            }
          },
          "description": "Type of facility/location where the sample was harvested; controlled vocabulary: growth chamber, open top chamber, glasshouse, experimental garden, field.",
          "title": "growth facility",
          "examples": [
            {
              "value": "Growth chamber [CO_715:0000189]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0001043",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "growth_facil_enum",
          "required": true
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "aliases": [
            "extreme_unusual_properties/heavy metals"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "heavy metal name;measurement value unit"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per gram"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "36"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.",
          "title": "extreme_unusual_properties/heavy metals",
          "examples": [
            {
              "value": "mercury;0.09 micrograms per gram"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "slot_uri": "MIXS:0000652",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "aliases": [
            "extreme_unusual_properties/heavy metals method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "37"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining heavy metals",
          "title": "extreme_unusual_properties/heavy metals method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000343",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "aliases": [
            "horizon method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "38"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the horizon",
          "title": "horizon method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000321",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "humidity_regm": {
          "name": "humidity_regm",
          "aliases": [
            "humidity regimen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "humidity value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram per cubic meter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "16"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to varying degree of humidity; information about treatment involving use of growth hormones; should include amount of humidity administered, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
          "title": "humidity regimen",
          "examples": [
            {
              "value": "25 gram per cubic meter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000568",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        },
        "lat_lon": {
          "name": "lat_lon",
          "aliases": [
            "geographic location (latitude and longitude)"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "decimal degrees,  limit to 8 decimal points"
            },
            "column_order": {
              "tag": "column_order",
              "value": "5"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system",
          "title": "geographic location (latitude and longitude)",
          "examples": [
            {
              "value": "50.586825 6.408977"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "string_serialization": "{float} {float}",
          "slot_uri": "MIXS:0000009",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "light_regm": {
          "name": "light_regm",
          "aliases": [
            "light regimen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "exposure type;light intensity;light quality"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "lux; micrometer, nanometer, angstrom"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "17"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment(s) involving exposure to light, including both light intensity and quality.",
          "title": "light regimen",
          "examples": [
            {
              "value": "incandescant light;10 lux;450 nanometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{float} {unit}",
          "slot_uri": "MIXS:0000569",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string"
        },
        "link_class_info": {
          "name": "link_class_info",
          "aliases": [
            "link to classification information"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "39"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Link to digitized soil maps or other soil classification information",
          "title": "link to classification information",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000329",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "aliases": [
            "link to climate information"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "40"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Link to climate resource",
          "title": "link to climate information",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000328",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "local_class": {
          "name": "local_class",
          "aliases": [
            "soil_taxonomic/local classification"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "local classification name"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "41"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Soil classification based on local soil classification system",
          "title": "soil_taxonomic/local classification",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000330",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "aliases": [
            "soil_taxonomic/local classification method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "42"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the local soil classification",
          "title": "soil_taxonomic/local classification method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000331",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "micro_biomass_meth": {
          "name": "micro_biomass_meth",
          "aliases": [
            "microbial biomass method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "63"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining microbial biomass",
          "title": "microbial biomass method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000339",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "aliases": [
            "microbial biomass"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "ton, kilogram, gram per kilogram soil"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "62"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "title": "microbial biomass",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000650",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "misc_param": {
          "name": "misc_param",
          "aliases": [
            "miscellaneous parameter"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "parameter name;measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "43"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Any other measurement performed or parameter collected, that is not listed here",
          "title": "miscellaneous parameter",
          "examples": [
            {
              "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "slot_uri": "MIXS:0000752",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "org_matter": {
          "name": "org_matter",
          "aliases": [
            "organic matter"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "65"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of organic matter",
          "title": "organic matter",
          "examples": [
            {
              "value": "1.75 milligram per cubic meter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000204",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "org_nitro": {
          "name": "org_nitro",
          "aliases": [
            "organic nitrogen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "66"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of organic nitrogen",
          "title": "organic nitrogen",
          "examples": [
            {
              "value": "4 micromole per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000205",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "oxy_stat_samp": {
          "name": "oxy_stat_samp",
          "aliases": [
            "oxygenation status of sample"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "44"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Oxygenation status of sample",
          "title": "oxygenation status of sample",
          "examples": [
            {
              "value": "aerobic"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000753",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "oxy_stat_samp_enum"
        },
        "ph": {
          "name": "ph",
          "aliases": [
            "pH"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "27"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "pH"
            }
          },
          "description": "pH measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
          "title": "pH",
          "notes": [
            "Use modified term"
          ],
          "examples": [
            {
              "value": "7.2"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float}",
          "slot_uri": "MIXS:0001001",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "double",
          "required": false,
          "recommended": true,
          "minimum_value": 0,
          "maximum_value": 14
        },
        "ph_meth": {
          "name": "ph_meth",
          "aliases": [
            "pH method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "61"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining ph",
          "title": "pH method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0001106",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "phosphate": {
          "name": "phosphate",
          "aliases": [
            "phosphate"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "73"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Concentration of phosphate",
          "title": "phosphate",
          "examples": [
            {
              "value": "0.7 micromole per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000505",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "prev_land_use_meth": {
          "name": "prev_land_use_meth",
          "aliases": [
            "history/previous land use method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "45"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining previous land use and dates",
          "title": "history/previous land use method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000316",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "aliases": [
            "history/previous land use"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "land use name;date"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "46"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Previous land use and dates",
          "title": "history/previous land use",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{text};{timestamp}",
          "slot_uri": "MIXS:0000315",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "profile_position": {
          "name": "profile_position",
          "aliases": [
            "profile position"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "47"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
          "title": "profile position",
          "examples": [
            {
              "value": "summit"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001084",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "profile_position_enum",
          "required": false
        },
        "rel_to_oxygen": {
          "name": "rel_to_oxygen",
          "aliases": [
            "relationship to oxygen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "column_order": {
              "tag": "column_order",
              "value": "17"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "oxygen_relationship"
            }
          },
          "description": "Is this organism an aerobe, anaerobe? Please note that aerobic and anaerobic are valid descriptors for microbial environments",
          "title": "relationship to oxygen",
          "examples": [
            {
              "value": "aerobe"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000015",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "rel_to_oxygen_enum",
          "required": true,
          "recommended": true
        },
        "salinity": {
          "name": "salinity",
          "aliases": [
            "salinity"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "practical salinity unit, percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "74"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "The total concentration of all dissolved salts in a liquid or solid sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater.",
          "title": "salinity",
          "examples": [
            {
              "value": "25 practical salinity unit"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000183",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "aliases": [
            "salinity method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "75"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining salinity",
          "title": "salinity method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000341",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "samp_collec_device": {
          "name": "samp_collec_device",
          "aliases": [
            "sample collection device"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "device name"
            },
            "column_order": {
              "tag": "column_order",
              "value": "11"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collection_dev"
            }
          },
          "description": "The device used to collect an environmental sample. This field accepts terms listed under environmental sampling device (http://purl.obolibrary.org/obo/ENVO). This field also accepts terms listed under specimen collection device (http://purl.obolibrary.org/obo/GENEPIO_0002094).",
          "title": "sample collection device",
          "comments": [
            "Report dimensions and details when applicable"
          ],
          "examples": [
            {
              "value": "swab, biopsy, niskin bottle, push core, drag swab [GENEPIO:0002713]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{termLabel} {[termID]}|{text}",
          "slot_uri": "MIXS:0000002",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "recommended": true
        },
        "samp_collec_method": {
          "name": "samp_collec_method",
          "aliases": [
            "sample collection method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI,url , or text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "12"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collection_method"
            }
          },
          "description": "The method employed for collecting the sample.",
          "title": "sample collection method",
          "comments": [
            "This can be a citation or description"
          ],
          "examples": [
            {
              "value": "swabbing"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{PMID}|{DOI}|{URL}|{text}",
          "slot_uri": "MIXS:0001225",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "recommended": true
        },
        "samp_mat_process": {
          "name": "samp_mat_process",
          "aliases": [
            "sample material processing"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "10"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_processing"
            }
          },
          "description": "A brief description of any processing applied to the sample during or after retrieving the sample from environment, or a link to the relevant protocol(s) performed.",
          "title": "sample material processing",
          "examples": [
            {
              "value": "filtering of seawater, storing samples in ethanol"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0000016",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "recommended": true
        },
        "samp_name": {
          "name": "samp_name",
          "aliases": [
            "sample name"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "text"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "disposition": {
              "tag": "disposition",
              "value": "MAM changed new, skipped or \"modified\" to shuffle w or wo modification"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_name"
            }
          },
          "description": "A local identifier or name that for the material sample collected. Refers to the original material collected or to any derived sub-samples.",
          "title": "sample name",
          "comments": [
            "It can have any format, but we suggest that you make it concise, unique and consistent within your lab, and as informative as possible."
          ],
          "examples": [
            {
              "value": "ISDsoil1"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "investigation field",
          "string_serialization": "{text}",
          "slot_uri": "MIXS:0001107",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": true
        },
        "samp_size": {
          "name": "samp_size",
          "aliases": [
            "amount or size of sample collected"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millliter, gram, milligram, liter"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "optional"
            },
            "column_order": {
              "tag": "column_order",
              "value": "14"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "sample_collected"
            }
          },
          "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample collected.",
          "title": "amount or size of sample collected",
          "comments": [
            "This refers to the TOTAL amount of sample collected from the experiment. NOT the amount sent to each institution or collected for a specific analysis."
          ],
          "examples": [
            {
              "value": "5 liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{float} {unit}",
          "slot_uri": "MIXS:0000001",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "recommended": true
        },
        "samp_store_temp": {
          "name": "samp_store_temp",
          "aliases": [
            "sample storage temperature"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "7"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Temperature at which sample was stored, e.g. -80 degree Celsius",
          "title": "sample storage temperature",
          "examples": [
            {
              "value": "-80 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000110",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "season_precpt": {
          "name": "season_precpt",
          "aliases": [
            "mean seasonal precipitation"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "millimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "48"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "title": "mean seasonal precipitation",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000645",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "season_temp": {
          "name": "season_temp",
          "aliases": [
            "mean seasonal temperature"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "49"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Mean seasonal temperature",
          "title": "mean seasonal temperature",
          "examples": [
            {
              "value": "18 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000643",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "sieving": {
          "name": "sieving",
          "aliases": [
            "composite design/sieving"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "design name and/or size;amount"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "8"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
          "title": "composite design/sieving",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
          "slot_uri": "MIXS:0000322",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "size_frac_low": {
          "name": "size_frac_low",
          "aliases": [
            "size-fraction lower threshold"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micrometer"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "9"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
          "title": "size-fraction lower threshold",
          "examples": [
            {
              "value": "0.2 micrometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000735",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "size_frac_up": {
          "name": "size_frac_up",
          "aliases": [
            "size-fraction upper threshold"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micrometer"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "10"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
          "title": "size-fraction upper threshold",
          "examples": [
            {
              "value": "20 micrometer"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000736",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "aliases": [
            "slope aspect"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "19"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
          "title": "slope aspect",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000647",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "aliases": [
            "slope gradient"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "percentage"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "50"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
          "title": "slope gradient",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000646",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "soil_horizon": {
          "name": "soil_horizon",
          "aliases": [
            "soil horizon"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "51"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "title": "soil horizon",
          "examples": [
            {
              "value": "A horizon"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001082",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "soil_horizon_enum",
          "required": false
        },
        "soil_text_measure": {
          "name": "soil_text_measure",
          "aliases": [
            "soil texture measurement"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "52"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
          "title": "soil texture measurement",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000335",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "soil_texture_meth": {
          "name": "soil_texture_meth",
          "aliases": [
            "soil texture method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "53"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining soil texture",
          "title": "soil texture method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000336",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "soil_type": {
          "name": "soil_type",
          "aliases": [
            "soil type"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "ENVO_00001998"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "54"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.",
          "title": "soil type",
          "examples": [
            {
              "value": "plinthosol [ENVO:00002250]"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]}",
          "slot_uri": "MIXS:0000332",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "aliases": [
            "soil type method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "55"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining soil series name or other lower-level classification",
          "title": "soil type method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000334",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "source_mat_id": {
          "name": "source_mat_id",
          "aliases": [
            "source material identifiers"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "for cultures of microorganisms: identifiers for two culture collections; for other material a unique arbitrary identifer"
            },
            "column_order": {
              "tag": "column_order",
              "value": "1"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Sample ID"
            },
            "disposition": {
              "tag": "disposition",
              "value": "MAM changed new, skipped or \"modified\" to shuffle w or wo modification"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "unique_ID"
            }
          },
          "description": "A globally unique identifier assigned to the biological sample.",
          "title": "Globally Unique ID",
          "notes": [
            "The source material IS the Globally Unique ID"
          ],
          "comments": [
            "Identifiers must be prefixed. IGSNs (http://www.geosamples.org/getigsn) are unique and FAIR. UUIDs (https://www.uuidgenerator.net/) are globally unique but not FAIR. These IDs enable linking to derrived analytes and subsamples."
          ],
          "examples": [
            {
              "value": "MPI012345"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "nucleic acid sequence source field",
          "string_serialization": "{text}:{text}",
          "slot_uri": "MIXS:0000026",
          "multivalued": false,
          "identifier": true,
          "owner": "soil MIMS",
          "range": "string",
          "required": true,
          "recommended": true
        },
        "store_cond": {
          "name": "store_cond",
          "aliases": [
            "storage conditions"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "storage condition type;duration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "column_order": {
              "tag": "column_order",
              "value": "2"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Modified Required"
            },
            "disposition": {
              "tag": "disposition",
              "value": "shuttle and modify"
            },
            "old_dh_slot": {
              "tag": "old_dh_slot",
              "value": "storage_condt"
            }
          },
          "description": "Explain how the soil sample is stored (fresh/frozen/other).",
          "title": "storage conditions",
          "examples": [
            {
              "value": "-20 degree Celsius freezer;P2Y10D"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "enumeration",
          "slot_uri": "MIXS:0000327",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "store_cond_enum",
          "required": true
        },
        "temp": {
          "name": "temp",
          "aliases": [
            "temperature"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "degree Celsius"
            },
            "column_order": {
              "tag": "column_order",
              "value": "56"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Temperature of the sample at the time of sampling.",
          "title": "temperature",
          "examples": [
            {
              "value": "25 degree Celsius"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "environment field",
          "slot_uri": "MIXS:0000113",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "tillage": {
          "name": "tillage",
          "aliases": [
            "history/tillage"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "enumeration"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "column_order": {
              "tag": "column_order",
              "value": "57"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Note method(s) used for tilling",
          "title": "history/tillage",
          "examples": [
            {
              "value": "chisel"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0001081",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "tillage_enum",
          "required": false
        },
        "tot_carb": {
          "name": "tot_carb",
          "aliases": [
            "total carbon"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "67"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Total carbon content",
          "title": "total carbon",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000525",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "tot_nitro_cont_meth": {
          "name": "tot_nitro_cont_meth",
          "aliases": [
            "total nitrogen content method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "69"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the total nitrogen",
          "title": "total nitrogen content method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000338",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "aliases": [
            "total nitrogen content"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "microgram per liter, micromole per liter, milligram per liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "68"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Total nitrogen content of the sample",
          "title": "total nitrogen content",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000530",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "aliases": [
            "total organic carbon method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "71"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining total organic carbon",
          "title": "total organic carbon method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000337",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "aliases": [
            "total organic carbon"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram Carbon per kilogram sample material"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "70"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
          "title": "total organic carbon",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000533",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "tot_phosp": {
          "name": "tot_phosp",
          "aliases": [
            "total phosphorus"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "micromole per liter, milligram per liter, parts per million"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "72"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus",
          "title": "total phosphorus",
          "examples": [
            {
              "value": "0.03 milligram per liter"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000117",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value"
        },
        "water_cont_soil_meth": {
          "name": "water_cont_soil_meth",
          "aliases": [
            "water content method"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "PMID,DOI or url"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "59"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Reference or method used in determining the water content of soil",
          "title": "water content method",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "slot_uri": "MIXS:0000323",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "string",
          "required": false
        },
        "water_content": {
          "name": "water_content",
          "aliases": [
            "water content"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "gram per gram or cubic centimeter per cubic centimeter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "1"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "biogeochemistry"
            },
            "column_order": {
              "tag": "column_order",
              "value": "58"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Optional"
            },
            "disposition": {
              "tag": "disposition",
              "value": "initially shuttle as-is"
            }
          },
          "description": "Water content measurement",
          "title": "water content",
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "slot_uri": "MIXS:0000185",
          "multivalued": false,
          "owner": "soil MIMS",
          "range": "quantity value",
          "required": false
        },
        "watering_regm": {
          "name": "watering_regm",
          "aliases": [
            "watering regimen"
          ],
          "annotations": {
            "expected_value": {
              "tag": "expected_value",
              "value": "measurement value;treatment interval and duration"
            },
            "preferred_unit": {
              "tag": "preferred_unit",
              "value": "milliliter, liter"
            },
            "occurrence": {
              "tag": "occurrence",
              "value": "m"
            },
            "categorical_subsection": {
              "tag": "categorical_subsection",
              "value": "treatment"
            },
            "column_order": {
              "tag": "column_order",
              "value": "18"
            },
            "dh:section_name": {
              "tag": "dh:section_name",
              "value": "Metadata- MIxS Required Where Applicable"
            },
            "disposition": {
              "tag": "disposition",
              "value": "borrowed from outside of checklist-free source class"
            }
          },
          "description": "Information about treatment involving an exposure to watering frequencies, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
          "title": "watering regimen",
          "examples": [
            {
              "value": "1 liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
            }
          ],
          "from_schema": "http://w3id.org/mixs/terms",
          "is_a": "core field",
          "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
          "slot_uri": "MIXS:0000591",
          "multivalued": true,
          "owner": "soil MIMS",
          "range": "string"
        }
      }
    },
    "quantity value": {
      "name": "quantity value",
      "description": "used to record a measurement",
      "notes": [
        "placeholder for dependency"
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "slots": {
        "has unit": {
          "name": "has unit",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "description": "Example \"m\"",
          "alt_descriptions": {
            "_if_missing": {}
          },
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges",
          "owner": "quantity value",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        },
        "has numeric value": {
          "name": "has numeric value",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges",
          "owner": "quantity value",
          "range": "double",
          "all_members": {
            "_if_missing": {}
          }
        },
        "has raw value": {
          "name": "has raw value",
          "local_names": {
            "_if_missing": {}
          },
          "extensions": {
            "_if_missing": {}
          },
          "annotations": {
            "_if_missing": {}
          },
          "alt_descriptions": {
            "_if_missing": {}
          },
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "quantity value",
          "range": "string",
          "all_members": {
            "_if_missing": {}
          }
        }
      },
      "slot_usage": {
        "has unit": {
          "name": "has unit",
          "description": "Example \"m\"",
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges"
        },
        "has numeric value": {
          "name": "has numeric value",
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges",
          "range": "double"
        },
        "has raw value": {
          "name": "has raw value",
          "notes": [
            "placeholder for dependency"
          ],
          "from_schema": "http://w3id.org/mixs/ranges",
          "string_serialization": "{has numeric value} {has unit}"
        }
      }
    }
  },
  "enumerations": {
    "analysis_type_enum": {
      "name": "analysis_type_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "metabolomics": {
          "text": "metabolomics"
        },
        "metagenomics": {
          "text": "metagenomics"
        },
        "metaproteomics": {
          "text": "metaproteomics"
        },
        "metatranscriptomics": {
          "text": "metatranscriptomics"
        },
        "natural organic matter": {
          "text": "natural organic matter"
        }
      }
    },
    "biotic_relationship_enum": {
      "name": "biotic_relationship_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "commensalism": {
          "text": "commensalism",
          "notes": [
            "biotic_relationship_enum: free living|parasitism|commensalism|symbiotic|mutualism. old_dh_slot: samp_biotic_relationship"
          ]
        },
        "free living": {
          "text": "free living"
        },
        "mutualism": {
          "text": "mutualism"
        },
        "parasitism": {
          "text": "parasitism"
        },
        "symbiotic": {
          "text": "symbiotic"
        }
      }
    },
    "dna_cont_type_enum": {
      "name": "dna_cont_type_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "plate": {
          "text": "plate"
        },
        "tube": {
          "text": "tube"
        }
      }
    },
    "dna_dnase_enum": {
      "name": "dna_dnase_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "no": {
          "text": "no"
        },
        "yes": {
          "text": "yes"
        }
      }
    },
    "dna_sample_format_enum": {
      "name": "dna_sample_format_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "10 mM Tris-HCl": {
          "text": "10 mM Tris-HCl"
        },
        "DNAStable": {
          "text": "DNAStable"
        },
        "Ethanol": {
          "text": "Ethanol"
        },
        "Low EDTA TE": {
          "text": "Low EDTA TE"
        },
        "MDA reaction buffer": {
          "text": "MDA reaction buffer"
        },
        "PBS": {
          "text": "PBS"
        },
        "Pellet": {
          "text": "Pellet"
        },
        "RNAStable": {
          "text": "RNAStable"
        },
        "TE": {
          "text": "TE"
        },
        "Water": {
          "text": "Water"
        }
      }
    },
    "dnase_rna_enum": {
      "name": "dnase_rna_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "no": {
          "text": "no"
        },
        "yes": {
          "text": "yes"
        }
      }
    },
    "ecosystem_category_enum": {
      "name": "ecosystem_category_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Terrestrial": {
          "text": "Terrestrial"
        }
      }
    },
    "ecosystem_enum": {
      "name": "ecosystem_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Environmental": {
          "text": "Environmental"
        }
      }
    },
    "ecosystem_subtype_enum": {
      "name": "ecosystem_subtype_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Biocrust": {
          "text": "Biocrust"
        },
        "Biofilm": {
          "text": "Biofilm"
        },
        "Bulk soil": {
          "text": "Bulk soil"
        },
        "Clay": {
          "text": "Clay"
        },
        "Floodplain": {
          "text": "Floodplain"
        },
        "Fossil": {
          "text": "Fossil"
        },
        "Glacier": {
          "text": "Glacier"
        },
        "Loam": {
          "text": "Loam"
        },
        "Mineral horizon": {
          "text": "Mineral horizon"
        },
        "Nature reserve": {
          "text": "Nature reserve"
        },
        "Organic layer": {
          "text": "Organic layer"
        },
        "Paddy field/soil": {
          "text": "Paddy field/soil"
        },
        "Pasture": {
          "text": "Pasture"
        },
        "Peat": {
          "text": "Peat"
        },
        "Ranch": {
          "text": "Ranch"
        },
        "Sand": {
          "text": "Sand"
        },
        "Silt": {
          "text": "Silt"
        },
        "Soil crust": {
          "text": "Soil crust"
        },
        "Unclassified": {
          "text": "Unclassified"
        },
        "Watershed": {
          "text": "Watershed"
        },
        "Wetlands": {
          "text": "Wetlands"
        }
      }
    },
    "ecosystem_type_enum": {
      "name": "ecosystem_type_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Soil": {
          "text": "Soil"
        }
      }
    },
    "env_package_enum": {
      "name": "env_package_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "soil": {
          "text": "soil",
          "notes": [
            "overriding mixs-source ?"
          ]
        }
      }
    },
    "growth_facil_enum": {
      "name": "growth_facil_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "experimental_garden": {
          "text": "experimental_garden",
          "notes": [
            "see mixs growth_facil (string range according to mixs-source). old_dh_slot: growth_facility"
          ]
        },
        "field": {
          "text": "field"
        },
        "field_incubation": {
          "text": "field_incubation"
        },
        "glasshouse": {
          "text": "glasshouse"
        },
        "greenhouse": {
          "text": "greenhouse"
        },
        "growth_chamber": {
          "text": "growth_chamber"
        },
        "lab_incubation": {
          "text": "lab_incubation"
        },
        "open_top_chamber": {
          "text": "open_top_chamber"
        },
        "other": {
          "text": "other"
        }
      }
    },
    "rel_to_oxygen_enum": {
      "name": "rel_to_oxygen_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "aerobe": {
          "text": "aerobe",
          "notes": [
            "rel_to_oxygen_enum: aerobe|anaerobe|facultative|microaerophilic|microanaerobe|obligate aerobe|obligate anaerobe. old_dh_slot: oxygen_relationship"
          ]
        },
        "anaerobe": {
          "text": "anaerobe"
        },
        "facultative": {
          "text": "facultative"
        },
        "microaerophilic": {
          "text": "microaerophilic"
        },
        "microanaerobe": {
          "text": "microanaerobe"
        },
        "obligate aerobe": {
          "text": "obligate aerobe"
        },
        "obligate anaerobe": {
          "text": "obligate anaerobe"
        }
      }
    },
    "rna_cont_type_enum": {
      "name": "rna_cont_type_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "plate": {
          "text": "plate"
        },
        "tube": {
          "text": "tube"
        }
      }
    },
    "rna_sample_format_enum": {
      "name": "rna_sample_format_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "10 mM Tris-HCl": {
          "text": "10 mM Tris-HCl"
        },
        "DNAStable": {
          "text": "DNAStable"
        },
        "Ethanol": {
          "text": "Ethanol"
        },
        "Low EDTA TE": {
          "text": "Low EDTA TE"
        },
        "MDA reaction buffer": {
          "text": "MDA reaction buffer"
        },
        "PBS": {
          "text": "PBS"
        },
        "Pellet": {
          "text": "Pellet"
        },
        "RNAStable": {
          "text": "RNAStable"
        },
        "TE": {
          "text": "TE"
        },
        "Water": {
          "text": "Water"
        }
      }
    },
    "sample_type_enum": {
      "name": "sample_type_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "soil": {
          "text": "soil"
        },
        "water_extract_soil": {
          "text": "water_extract_soil"
        }
      }
    },
    "specific_ecosystem_enum": {
      "name": "specific_ecosystem_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Agricultural": {
          "text": "Agricultural"
        },
        "Agricultural land": {
          "text": "Agricultural land"
        },
        "Agricultural soil": {
          "text": "Agricultural soil"
        },
        "Alpine": {
          "text": "Alpine"
        },
        "Bog": {
          "text": "Bog"
        },
        "Boreal forest": {
          "text": "Boreal forest"
        },
        "Contaminated": {
          "text": "Contaminated"
        },
        "Desert": {
          "text": "Desert"
        },
        "Farm": {
          "text": "Farm"
        },
        "Forest soil": {
          "text": "Forest soil"
        },
        "Forest Soil": {
          "text": "Forest Soil"
        },
        "Grasslands": {
          "text": "Grasslands"
        },
        "Meadow": {
          "text": "Meadow"
        },
        "Mine": {
          "text": "Mine"
        },
        "Mine drainage": {
          "text": "Mine drainage"
        },
        "Oil-contaminated": {
          "text": "Oil-contaminated"
        },
        "Orchard soil": {
          "text": "Orchard soil"
        },
        "Permafrost": {
          "text": "Permafrost"
        },
        "Riparian soil": {
          "text": "Riparian soil"
        },
        "River": {
          "text": "River"
        },
        "Shrubland": {
          "text": "Shrubland"
        },
        "Tropical rainforest": {
          "text": "Tropical rainforest"
        },
        "Unclassified": {
          "text": "Unclassified"
        },
        "Uranium contaminated": {
          "text": "Uranium contaminated"
        }
      }
    },
    "store_cond_enum": {
      "name": "store_cond_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "fresh": {
          "text": "fresh",
          "notes": [
            "see samp_store_dur, samp_store_loc, samp_store_temp and store_cond (which takes a string range according to mixs-source). old_dh_slot: storage_condt"
          ]
        },
        "frozen": {
          "text": "frozen"
        },
        "lyophilized": {
          "text": "lyophilized"
        },
        "other": {
          "text": "other"
        }
      }
    },
    "cur_land_use_enum": {
      "name": "cur_land_use_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "badlands": {
          "text": "badlands",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "cities": {
          "text": "cities",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "conifers (e.g. pine,spruce,fir,cypress)": {
          "text": "conifers (e.g. pine,spruce,fir,cypress)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "crop trees (nuts,fruit,christmas trees,nursery trees)": {
          "text": "crop trees (nuts,fruit,christmas trees,nursery trees)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "farmstead": {
          "text": "farmstead",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "gravel": {
          "text": "gravel",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "hardwoods (e.g. oak,hickory,elm,aspen)": {
          "text": "hardwoods (e.g. oak,hickory,elm,aspen)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "hayland": {
          "text": "hayland",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "horticultural plants (e.g. tulips)": {
          "text": "horticultural plants (e.g. tulips)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "industrial areas": {
          "text": "industrial areas",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "intermixed hardwood and conifers": {
          "text": "intermixed hardwood and conifers",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "marshlands (grass,sedges,rushes)": {
          "text": "marshlands (grass,sedges,rushes)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "meadows (grasses,alfalfa,fescue,bromegrass,timothy)": {
          "text": "meadows (grasses,alfalfa,fescue,bromegrass,timothy)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "mines/quarries": {
          "text": "mines/quarries",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "mudflats": {
          "text": "mudflats",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "oil waste areas": {
          "text": "oil waste areas",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "pastureland (grasslands used for livestock grazing)": {
          "text": "pastureland (grasslands used for livestock grazing)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "permanent snow or ice": {
          "text": "permanent snow or ice",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "rainforest (evergreen forest receiving >406 cm annual rainfall)": {
          "text": "rainforest (evergreen forest receiving >406 cm annual rainfall)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "rangeland": {
          "text": "rangeland",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "roads/railroads": {
          "text": "roads/railroads",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "rock": {
          "text": "rock",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "row crops": {
          "text": "row crops",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "saline seeps": {
          "text": "saline seeps",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "salt flats": {
          "text": "salt flats",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "sand": {
          "text": "sand",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "shrub crops (blueberries,nursery ornamentals,filberts)": {
          "text": "shrub crops (blueberries,nursery ornamentals,filberts)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)": {
          "text": "shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "small grains": {
          "text": "small grains",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)": {
          "text": "successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "swamp (permanent or semi-permanent water body dominated by woody plants)": {
          "text": "swamp (permanent or semi-permanent water body dominated by woody plants)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "tropical (e.g. mangrove,palms)": {
          "text": "tropical (e.g. mangrove,palms)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "tundra (mosses,lichens)": {
          "text": "tundra (mosses,lichens)",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "vegetable crops": {
          "text": "vegetable crops",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "vine crops (grapes)": {
          "text": "vine crops (grapes)",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "drainage_class_enum": {
      "name": "drainage_class_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "excessively drained": {
          "text": "excessively drained",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "moderately well": {
          "text": "moderately well",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "poorly": {
          "text": "poorly",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "somewhat poorly": {
          "text": "somewhat poorly",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "very poorly": {
          "text": "very poorly",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "well": {
          "text": "well",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "fao_class_enum": {
      "name": "fao_class_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "Acrisols": {
          "text": "Acrisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Andosols": {
          "text": "Andosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Arenosols": {
          "text": "Arenosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Cambisols": {
          "text": "Cambisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Chernozems": {
          "text": "Chernozems",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Ferralsols": {
          "text": "Ferralsols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Fluvisols": {
          "text": "Fluvisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Gleysols": {
          "text": "Gleysols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Greyzems": {
          "text": "Greyzems",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Gypsisols": {
          "text": "Gypsisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Histosols": {
          "text": "Histosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Kastanozems": {
          "text": "Kastanozems",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Lithosols": {
          "text": "Lithosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Luvisols": {
          "text": "Luvisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Nitosols": {
          "text": "Nitosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Phaeozems": {
          "text": "Phaeozems",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Planosols": {
          "text": "Planosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Podzols": {
          "text": "Podzols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Podzoluvisols": {
          "text": "Podzoluvisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Rankers": {
          "text": "Rankers",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Regosols": {
          "text": "Regosols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Rendzinas": {
          "text": "Rendzinas",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Solonchaks": {
          "text": "Solonchaks",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Solonetz": {
          "text": "Solonetz",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Vertisols": {
          "text": "Vertisols",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Yermosols": {
          "text": "Yermosols",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "oxy_stat_samp_enum": {
      "name": "oxy_stat_samp_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "aerobic": {
          "text": "aerobic",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "anaerobic": {
          "text": "anaerobic",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "other": {
          "text": "other",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "profile_position_enum": {
      "name": "profile_position_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "backslope": {
          "text": "backslope",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "footslope": {
          "text": "footslope",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "shoulder": {
          "text": "shoulder",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "summit": {
          "text": "summit",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "toeslope": {
          "text": "toeslope",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "soil_horizon_enum": {
      "name": "soil_horizon_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "A horizon": {
          "text": "A horizon",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "B horizon": {
          "text": "B horizon",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "C horizon": {
          "text": "C horizon",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "E horizon": {
          "text": "E horizon",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "O horizon": {
          "text": "O horizon",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "Permafrost": {
          "text": "Permafrost",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "R layer": {
          "text": "R layer",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    },
    "tillage_enum": {
      "name": "tillage_enum",
      "from_schema": "https://example.com/mims_soil_biosample",
      "permissible_values": {
        "chisel": {
          "text": "chisel",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "cutting disc": {
          "text": "cutting disc",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "disc plough": {
          "text": "disc plough",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "drill": {
          "text": "drill",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "mouldboard": {
          "text": "mouldboard",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "ridge till": {
          "text": "ridge till",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "strip tillage": {
          "text": "strip tillage",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "tined": {
          "text": "tined",
          "notes": [
            "placeholder for dependency"
          ]
        },
        "zonal tillage": {
          "text": "zonal tillage",
          "notes": [
            "placeholder for dependency"
          ]
        }
      }
    }
  },
  "slots": {
    "project_ID": {
      "name": "project_ID",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "sample_type": {
      "name": "sample_type",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "sample_shipped": {
      "name": "sample_shipped",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "EMSL_store_temp": {
      "name": "EMSL_store_temp",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "technical_reps": {
      "name": "technical_reps",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "replicate_number": {
      "name": "replicate_number",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_seq_project": {
      "name": "dna_seq_project",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_seq_project_name": {
      "name": "dna_seq_project_name",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_samp_ID": {
      "name": "dna_samp_ID",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_sample_name": {
      "name": "dna_sample_name",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_concentration": {
      "name": "dna_concentration",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_volume": {
      "name": "dna_volume",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_absorb1": {
      "name": "dna_absorb1",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_absorb2": {
      "name": "dna_absorb2",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_container_ID": {
      "name": "dna_container_ID",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_cont_type": {
      "name": "dna_cont_type",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_cont_well": {
      "name": "dna_cont_well",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_sample_format": {
      "name": "dna_sample_format",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_dnase": {
      "name": "dna_dnase",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_organisms": {
      "name": "dna_organisms",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_collect_site": {
      "name": "dna_collect_site",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_isolate_meth": {
      "name": "dna_isolate_meth",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_seq_project_PI": {
      "name": "dna_seq_project_PI",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dna_project_contact": {
      "name": "dna_project_contact",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "proposal_dna": {
      "name": "proposal_dna",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_seq_project": {
      "name": "rna_seq_project",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_seq_project_name": {
      "name": "rna_seq_project_name",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_samp_ID": {
      "name": "rna_samp_ID",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_sample_name": {
      "name": "rna_sample_name",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_concentration": {
      "name": "rna_concentration",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_volume": {
      "name": "rna_volume",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_absorb1": {
      "name": "rna_absorb1",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_absorb2": {
      "name": "rna_absorb2",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_container_ID": {
      "name": "rna_container_ID",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_cont_type": {
      "name": "rna_cont_type",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_cont_well": {
      "name": "rna_cont_well",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_sample_format": {
      "name": "rna_sample_format",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "dnase_rna": {
      "name": "dnase_rna",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_organisms": {
      "name": "rna_organisms",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_collect_site": {
      "name": "rna_collect_site",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_isolate_meth": {
      "name": "rna_isolate_meth",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_seq_project_PI": {
      "name": "rna_seq_project_PI",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "rna_project_contact": {
      "name": "rna_project_contact",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "proposal_rna": {
      "name": "proposal_rna",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "non_microb_biomass": {
      "name": "non_microb_biomass",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "non_microb_biomass_method": {
      "name": "non_microb_biomass_method",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "microbial_biomass_C": {
      "name": "microbial_biomass_C",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "micro_biomass_C_meth": {
      "name": "micro_biomass_C_meth",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "microbial_biomass_N": {
      "name": "microbial_biomass_N",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "micro_biomass_N_meth": {
      "name": "micro_biomass_N_meth",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "org_nitro_method": {
      "name": "org_nitro_method",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "collection_time": {
      "name": "collection_time",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "collection_date_inc": {
      "name": "collection_date_inc",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "collection_time_inc": {
      "name": "collection_time_inc",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "start_date_inc": {
      "name": "start_date_inc",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "start_time_inc": {
      "name": "start_time_inc",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "filter_method": {
      "name": "filter_method",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "experimental_factor_other": {
      "name": "experimental_factor_other",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "other_treatment": {
      "name": "other_treatment",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "isotope_exposure": {
      "name": "isotope_exposure",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "env_package": {
      "name": "env_package",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "analysis_type": {
      "name": "analysis_type",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "sample_link": {
      "name": "sample_link",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "has unit": {
      "name": "has unit",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "has numeric value": {
      "name": "has numeric value",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "has raw value": {
      "name": "has raw value",
      "from_schema": "https://example.com/mims_soil_biosample"
    },
    "ecosystem": {
      "name": "ecosystem",
      "description": "An ecosystem is a combination of a physical environment (abiotic factors) and all the organisms (biotic factors) that interact with this environment. Ecosystem is in position 1/5 in a GOLD path.",
      "comments": [
        "The abiotic factors play a profound role on the type and composition of organisms in a given environment. The GOLD Ecosystem at the top of the five-level classification system is aimed at capturing the broader environment from which an organism or environmental sample is collected. The three broad groups under Ecosystem are Environmental, Host-associated, and Engineered. They represent samples collected from a natural environment or from another organism or from engineered environments like bioreactors respectively."
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/help"
      ],
      "is_a": "gold_path_field",
      "owner": "biosample",
      "range": "string"
    },
    "ecosystem_category": {
      "name": "ecosystem_category",
      "description": "Ecosystem categories represent divisions within the ecosystem based on specific characteristics of the environment from where an organism or sample is isolated. Ecosystem category is in position 2/5 in a GOLD path.",
      "comments": [
        "The Environmental ecosystem (for example) is divided into Air, Aquatic and Terrestrial. Ecosystem categories for Host-associated samples can be individual hosts or phyla and for engineered samples it may be manipulated environments like bioreactors, solid waste etc."
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/help"
      ],
      "is_a": "gold_path_field",
      "owner": "biosample",
      "range": "string"
    },
    "ecosystem_subtype": {
      "name": "ecosystem_subtype",
      "description": "Ecosystem subtypes represent further subdivision of Ecosystem types into more distinct subtypes. Ecosystem subtype is in position 4/5 in a GOLD path.",
      "comments": [
        "Ecosystem Type Marine (Environmental -> Aquatic -> Marine) is further divided (for example) into Intertidal zone, Coastal, Pelagic, Intertidal zone etc. in the Ecosystem subtype category."
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/help"
      ],
      "is_a": "gold_path_field",
      "owner": "biosample",
      "range": "string"
    },
    "ecosystem_type": {
      "name": "ecosystem_type",
      "description": "Ecosystem types represent things having common characteristics within the Ecosystem Category. These common characteristics based grouping is still broad but specific to the characteristics of a given environment. Ecosystem type is in position 3/5 in a GOLD path.",
      "comments": [
        "The Aquatic ecosystem category (for example) may have ecosystem types like Marine or Thermal springs etc. Ecosystem category Air may have Indoor air or Outdoor air as different Ecosystem Types. In the case of Host-associated samples, ecosystem type can represent Respiratory system, Digestive system, Roots etc."
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/help"
      ],
      "is_a": "gold_path_field",
      "owner": "biosample",
      "range": "string"
    },
    "specific_ecosystem": {
      "name": "specific_ecosystem",
      "description": "Specific ecosystems represent specific features of the environment like aphotic zone in an ocean or gastric mucosa within a host digestive system. Specific ecosystem is in position 5/5 in a GOLD path.",
      "comments": [
        "Specific ecosystems help to define samples based on very specific characteristics of an environment under the five-level classification system."
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/help"
      ],
      "is_a": "gold_path_field",
      "owner": "biosample",
      "range": "string"
    },
    "gold_path_field": {
      "name": "gold_path_field",
      "description": "This is a grouping for any of the gold path fields          ",
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "attribute",
      "abstract": true,
      "owner": "biosample",
      "range": "string"
    },
    "attribute": {
      "name": "attribute",
      "aliases": [
        "field",
        "property",
        "template field",
        "key",
        "characteristic"
      ],
      "description": "A attribute of a biosample. Examples: depth, habitat, material. For NMDC, attributes SHOULD be mapped to terms within a MIxS template",
      "from_schema": "https://example.com/mims_soil_biosample",
      "abstract": true,
      "owner": "biosample",
      "range": "string"
    },
    "environment field": {
      "name": "environment field",
      "description": "field describing environmental aspect of a sample",
      "from_schema": "https://example.com/mims_soil_biosample",
      "abstract": true,
      "owner": "soil MIMS"
    },
    "core field": {
      "name": "core field",
      "description": "basic fields",
      "from_schema": "https://example.com/mims_soil_biosample",
      "abstract": true,
      "owner": "soil MIMS"
    },
    "nucleic acid sequence source field": {
      "name": "nucleic acid sequence source field",
      "from_schema": "https://example.com/mims_soil_biosample",
      "abstract": true,
      "owner": "soil MIMS"
    },
    "investigation field": {
      "name": "investigation field",
      "description": "field describing aspect of the investigation/study to which the sample belongs",
      "from_schema": "https://example.com/mims_soil_biosample",
      "abstract": true,
      "owner": "soil MIMS"
    },
    "agrochem_addition": {
      "name": "agrochem_addition",
      "aliases": [
        "history/agrochemical additions"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "agrochemical name;agrochemical amount;timestamp"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "gram, mole per liter, milligram per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
      "title": "history/agrochemical additions",
      "examples": [
        {
          "value": "roundup;5 milligram per liter;2018-06-21"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit};{timestamp}",
      "slot_uri": "MIXS:0000639",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "air_temp_regm": {
      "name": "air_temp_regm",
      "aliases": [
        "air temperature regimen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "temperature value;treatment interval and duration"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "meter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Information about treatment involving an exposure to varying temperatures; should include the temperature, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include different temperature regimens",
      "title": "air temperature regimen",
      "examples": [
        {
          "value": "25 degree Celsius;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0000551",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    },
    "al_sat": {
      "name": "al_sat",
      "aliases": [
        "extreme_unusual_properties/Al saturation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "percentage"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Aluminum saturation (esp. For tropical soils)",
      "title": "extreme_unusual_properties/Al saturation",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000607",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "al_sat_meth": {
      "name": "al_sat_meth",
      "aliases": [
        "extreme_unusual_properties/Al saturation method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or URL"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining Al saturation",
      "title": "extreme_unusual_properties/Al saturation method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000324",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "alt": {
      "name": "alt",
      "aliases": [
        "altitude"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        }
      },
      "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
      "title": "altitude",
      "examples": [
        {
          "value": "100 meter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "slot_uri": "MIXS:0000094",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "annual_precpt": {
      "name": "annual_precpt",
      "aliases": [
        "mean annual precipitation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "millimeter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
      "title": "mean annual precipitation",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000644",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "annual_temp": {
      "name": "annual_temp",
      "aliases": [
        "mean annual temperature"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "degree Celsius"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Mean annual temperature",
      "title": "mean annual temperature",
      "examples": [
        {
          "value": "12.5 degree Celsius"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000642",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "biotic_regm": {
      "name": "biotic_regm",
      "aliases": [
        "biotic regimen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "free text"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Information about treatment(s) involving use of biotic factors, such as bacteria, viruses or fungi.",
      "title": "biotic regimen",
      "examples": [
        {
          "value": "sample inoculated with Rhizobium spp. Culture"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0001038",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string"
    },
    "biotic_relationship": {
      "name": "biotic_relationship",
      "aliases": [
        "observed biotic relationship"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        }
      },
      "description": "Description of relationship(s) between the subject organism and other organism(s) it is associated with. E.g., parasite on species X; mutualist with species Y. The target organism is the subject of the relationship, and the other organism(s) is the object",
      "title": "observed biotic relationship",
      "examples": [
        {
          "value": "free living"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "slot_uri": "MIXS:0000028",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "biotic_relationship_enum"
    },
    "carb_nitro_ratio": {
      "name": "carb_nitro_ratio",
      "aliases": [
        "carbon/nitrogen ratio"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Ratio of amount or concentrations of carbon to nitrogen",
      "title": "carbon/nitrogen ratio",
      "examples": [
        {
          "value": "0.417361111"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000310",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "chem_administration": {
      "name": "chem_administration",
      "aliases": [
        "chemical administration"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "CHEBI;timestamp"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi",
      "title": "chemical administration",
      "examples": [
        {
          "value": "agar [CHEBI:2509];2018-05-11T20:00Z"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{termLabel} {[termID]};{timestamp}",
      "slot_uri": "MIXS:0000751",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    },
    "climate_environment": {
      "name": "climate_environment",
      "aliases": [
        "climate environment"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "climate name;treatment interval and duration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Treatment involving an exposure to a particular climate; treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple climates",
      "title": "climate environment",
      "examples": [
        {
          "value": "tropical climate;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0001040",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    },
    "collection_date": {
      "name": "collection_date",
      "aliases": [
        "collection date"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "date and time"
        }
      },
      "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
      "title": "collection date",
      "examples": [
        {
          "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "slot_uri": "MIXS:0000011",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "date",
      "required": true
    },
    "crop_rotation": {
      "name": "crop_rotation",
      "aliases": [
        "history/crop rotation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "crop rotation status;schedule"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Whether or not crop is rotated, and if yes, rotation schedule",
      "title": "history/crop rotation",
      "examples": [
        {
          "value": "yes;R2/2017-01-01/2018-12-31/P6M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0000318",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "cur_land_use": {
      "name": "cur_land_use",
      "aliases": [
        "current land use"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Present state of sample site",
      "title": "current land use",
      "examples": [
        {
          "value": "conifers"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001080",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "cur_land_use_enum",
      "required": false
    },
    "cur_vegetation": {
      "name": "cur_vegetation",
      "aliases": [
        "current vegetation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "current vegetation type"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
      "title": "current vegetation",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0000312",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "cur_vegetation_meth": {
      "name": "cur_vegetation_meth",
      "aliases": [
        "current vegetation method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in vegetation classification",
      "title": "current vegetation method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000314",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "depth": {
      "name": "depth",
      "aliases": [
        "depth"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        }
      },
      "description": "The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.",
      "title": "depth",
      "examples": [
        {
          "value": "10 meter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "slot_uri": "MIXS:0000018",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": true
    },
    "drainage_class": {
      "name": "drainage_class",
      "aliases": [
        "drainage classification"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Drainage classification from a standard system such as the USDA system",
      "title": "drainage classification",
      "examples": [
        {
          "value": "well"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001085",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "drainage_class_enum",
      "required": false
    },
    "elev": {
      "name": "elev",
      "aliases": [
        "elevation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        }
      },
      "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
      "title": "elevation",
      "examples": [
        {
          "value": "100 meter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "slot_uri": "MIXS:0000093",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": true
    },
    "env_broad_scale": {
      "name": "env_broad_scale",
      "aliases": [
        "broad-scale environmental context"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
        }
      },
      "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
      "title": "broad-scale environmental context",
      "examples": [
        {
          "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "slot_uri": "MIXS:0000012",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "env_local_scale": {
      "name": "env_local_scale",
      "aliases": [
        "local environmental context"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "Environmental entities having causal influences upon the entity at time of sampling."
        }
      },
      "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
      "title": "local environmental context",
      "examples": [
        {
          "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "slot_uri": "MIXS:0000013",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "env_medium": {
      "name": "env_medium",
      "aliases": [
        "environmental medium"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
        }
      },
      "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
      "title": "environmental medium",
      "examples": [
        {
          "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "slot_uri": "MIXS:0000014",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "experimental_factor": {
      "name": "experimental_factor",
      "aliases": [
        "experimental factor"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "text or EFO and/or OBI"
        }
      },
      "description": "Experimental factors are essentially the variable aspects of an experiment design which can be used to describe an experiment, or set of experiments, in an increasingly detailed manner. This field accepts ontology terms from Experimental Factor Ontology (EFO) and/or Ontology for Biomedical Investigations (OBI). For a browser of EFO (v 2.95) terms, please see http://purl.bioontology.org/ontology/EFO; for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI",
      "title": "experimental factor",
      "examples": [
        {
          "value": "time series design [EFO:EFO_0001779]"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "investigation field",
      "string_serialization": "{termLabel} {[termID]}|{text}",
      "slot_uri": "MIXS:0000008",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "recommended": true
    },
    "extreme_event": {
      "name": "extreme_event",
      "aliases": [
        "history/extreme events"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "date"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Unusual physical events that may have affected microbial populations",
      "title": "history/extreme events",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000320",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "date",
      "required": false
    },
    "fao_class": {
      "name": "fao_class",
      "aliases": [
        "soil_taxonomic/FAO classification"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
      "title": "soil_taxonomic/FAO classification",
      "examples": [
        {
          "value": "Luvisols"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001083",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "fao_class_enum",
      "required": false
    },
    "fire": {
      "name": "fire",
      "aliases": [
        "history/fire"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "date"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Historical and/or physical evidence of fire",
      "title": "history/fire",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001086",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "date",
      "required": false
    },
    "flooding": {
      "name": "flooding",
      "aliases": [
        "history/flooding"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "date"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Historical and/or physical evidence of flooding",
      "title": "history/flooding",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000319",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "date",
      "required": false
    },
    "gaseous_environment": {
      "name": "gaseous_environment",
      "aliases": [
        "gaseous environment"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "gaseous compound name;gaseous compound amount;treatment interval and duration"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "micromole per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Use of conditions with differing gaseous environments; should include the name of gaseous compound, amount administered, treatment duration, interval and total experimental duration; can include multiple gaseous environment regimens",
      "title": "gaseous environment",
      "examples": [
        {
          "value": "nitric oxide;0.5 micromole per liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0000558",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    },
    "geo_loc_name": {
      "name": "geo_loc_name",
      "aliases": [
        "geographic location (country and/or sea,region)"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "country or sea name (INSDC or GAZ): region(GAZ), specific location name"
        }
      },
      "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
      "title": "geographic location (country and/or sea,region)",
      "examples": [
        {
          "value": "USA: Maryland, Bethesda"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{term}: {term}, {text}",
      "slot_uri": "MIXS:0000010",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "growth_facil": {
      "name": "growth_facil",
      "aliases": [
        "growth facility"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "free text or CO"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Type of facility where the sampled plant was grown; controlled vocabulary: growth chamber, open top chamber, glasshouse, experimental garden, field. Alternatively use Crop Ontology (CO) terms, see http://www.cropontology.org/ontology/CO_715/Crop%20Research",
      "title": "growth facility",
      "examples": [
        {
          "value": "Growth chamber [CO_715:0000189]"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}|{termLabel} {[termID]}",
      "slot_uri": "MIXS:0001043",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string"
    },
    "heavy_metals": {
      "name": "heavy_metals",
      "aliases": [
        "extreme_unusual_properties/heavy metals"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "heavy metal name;measurement value unit"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "microgram per gram"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.",
      "title": "extreme_unusual_properties/heavy metals",
      "examples": [
        {
          "value": "mercury;0.09 micrograms per gram"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit}",
      "slot_uri": "MIXS:0000652",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "heavy_metals_meth": {
      "name": "heavy_metals_meth",
      "aliases": [
        "extreme_unusual_properties/heavy metals method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining heavy metals",
      "title": "extreme_unusual_properties/heavy metals method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000343",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "horizon_meth": {
      "name": "horizon_meth",
      "aliases": [
        "horizon method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining the horizon",
      "title": "horizon method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000321",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "humidity_regm": {
      "name": "humidity_regm",
      "aliases": [
        "humidity regimen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "humidity value;treatment interval and duration"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "gram per cubic meter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Information about treatment involving an exposure to varying degree of humidity; information about treatment involving use of growth hormones; should include amount of humidity administered, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
      "title": "humidity regimen",
      "examples": [
        {
          "value": "25 gram per cubic meter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0000568",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    },
    "lat_lon": {
      "name": "lat_lon",
      "aliases": [
        "geographic location (latitude and longitude)"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "decimal degrees,  limit to 8 decimal points"
        }
      },
      "description": "The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system",
      "title": "geographic location (latitude and longitude)",
      "examples": [
        {
          "value": "50.586825 6.408977"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{float} {float}",
      "slot_uri": "MIXS:0000009",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "light_regm": {
      "name": "light_regm",
      "aliases": [
        "light regimen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "exposure type;light intensity;light quality"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "lux; micrometer, nanometer, angstrom"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Information about treatment(s) involving exposure to light, including both light intensity and quality.",
      "title": "light regimen",
      "examples": [
        {
          "value": "incandescant light;10 lux;450 nanometer"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit};{float} {unit}",
      "slot_uri": "MIXS:0000569",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string"
    },
    "link_class_info": {
      "name": "link_class_info",
      "aliases": [
        "link to classification information"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Link to digitized soil maps or other soil classification information",
      "title": "link to classification information",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000329",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "link_climate_info": {
      "name": "link_climate_info",
      "aliases": [
        "link to climate information"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Link to climate resource",
      "title": "link to climate information",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000328",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "local_class": {
      "name": "local_class",
      "aliases": [
        "soil_taxonomic/local classification"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "local classification name"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Soil classification based on local soil classification system",
      "title": "soil_taxonomic/local classification",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0000330",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "local_class_meth": {
      "name": "local_class_meth",
      "aliases": [
        "soil_taxonomic/local classification method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining the local soil classification",
      "title": "soil_taxonomic/local classification method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000331",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "micro_biomass_meth": {
      "name": "micro_biomass_meth",
      "aliases": [
        "microbial biomass method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining microbial biomass",
      "title": "microbial biomass method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000339",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "microbial_biomass": {
      "name": "microbial_biomass",
      "aliases": [
        "microbial biomass"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "ton, kilogram, gram per kilogram soil"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
      "title": "microbial biomass",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000650",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "misc_param": {
      "name": "misc_param",
      "aliases": [
        "miscellaneous parameter"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "parameter name;measurement value"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Any other measurement performed or parameter collected, that is not listed here",
      "title": "miscellaneous parameter",
      "examples": [
        {
          "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit}",
      "slot_uri": "MIXS:0000752",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "org_matter": {
      "name": "org_matter",
      "aliases": [
        "organic matter"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "microgram per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Concentration of organic matter",
      "title": "organic matter",
      "examples": [
        {
          "value": "1.75 milligram per cubic meter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000204",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "org_nitro": {
      "name": "org_nitro",
      "aliases": [
        "organic nitrogen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "microgram per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Concentration of organic nitrogen",
      "title": "organic nitrogen",
      "examples": [
        {
          "value": "4 micromole per liter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000205",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "oxy_stat_samp": {
      "name": "oxy_stat_samp",
      "aliases": [
        "oxygenation status of sample"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Oxygenation status of sample",
      "title": "oxygenation status of sample",
      "examples": [
        {
          "value": "aerobic"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000753",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "oxy_stat_samp_enum"
    },
    "ph": {
      "name": "ph",
      "aliases": [
        "pH"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
      "title": "pH",
      "examples": [
        {
          "value": "7.2"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001001",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "double",
      "required": false
    },
    "ph_meth": {
      "name": "ph_meth",
      "aliases": [
        "pH method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining ph",
      "title": "pH method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0001106",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "phosphate": {
      "name": "phosphate",
      "aliases": [
        "phosphate"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "micromole per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Concentration of phosphate",
      "title": "phosphate",
      "examples": [
        {
          "value": "0.7 micromole per liter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000505",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "prev_land_use_meth": {
      "name": "prev_land_use_meth",
      "aliases": [
        "history/previous land use method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining previous land use and dates",
      "title": "history/previous land use method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000316",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "previous_land_use": {
      "name": "previous_land_use",
      "aliases": [
        "history/previous land use"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "land use name;date"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Previous land use and dates",
      "title": "history/previous land use",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{timestamp}",
      "slot_uri": "MIXS:0000315",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "profile_position": {
      "name": "profile_position",
      "aliases": [
        "profile position"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
      "title": "profile position",
      "examples": [
        {
          "value": "summit"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001084",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "profile_position_enum",
      "required": false
    },
    "rel_to_oxygen": {
      "name": "rel_to_oxygen",
      "aliases": [
        "relationship to oxygen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        }
      },
      "description": "Is this organism an aerobe, anaerobe? Please note that aerobic and anaerobic are valid descriptors for microbial environments",
      "title": "relationship to oxygen",
      "examples": [
        {
          "value": "aerobe"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "slot_uri": "MIXS:0000015",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "rel_to_oxygen_enum",
      "required": false
    },
    "salinity": {
      "name": "salinity",
      "aliases": [
        "salinity"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "practical salinity unit, percentage"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The total concentration of all dissolved salts in a liquid or solid sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater.",
      "title": "salinity",
      "examples": [
        {
          "value": "25 practical salinity unit"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000183",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "salinity_meth": {
      "name": "salinity_meth",
      "aliases": [
        "salinity method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining salinity",
      "title": "salinity method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000341",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "samp_collec_device": {
      "name": "samp_collec_device",
      "aliases": [
        "sample collection device"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "device name"
        }
      },
      "description": "The device used to collect an environmental sample. This field accepts terms listed under environmental sampling device (http://purl.obolibrary.org/obo/ENVO). This field also accepts terms listed under specimen collection device (http://purl.obolibrary.org/obo/GENEPIO_0002094).",
      "title": "sample collection device",
      "examples": [
        {
          "value": "swab, biopsy, niskin bottle, push core, drag swab [GENEPIO:0002713]"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "string_serialization": "{termLabel} {[termID]}|{text}",
      "slot_uri": "MIXS:0000002",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "recommended": true
    },
    "samp_collec_method": {
      "name": "samp_collec_method",
      "aliases": [
        "sample collection method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI,url , or text"
        }
      },
      "description": "The method employed for collecting the sample.",
      "title": "sample collection method",
      "examples": [
        {
          "value": "swabbing"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "string_serialization": "{PMID}|{DOI}|{URL}|{text}",
      "slot_uri": "MIXS:0001225",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "recommended": true
    },
    "samp_mat_process": {
      "name": "samp_mat_process",
      "aliases": [
        "sample material processing"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "text"
        }
      },
      "description": "A brief description of any processing applied to the sample during or after retrieving the sample from environment, or a link to the relevant protocol(s) performed.",
      "title": "sample material processing",
      "examples": [
        {
          "value": "filtering of seawater, storing samples in ethanol"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0000016",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "recommended": true
    },
    "samp_name": {
      "name": "samp_name",
      "aliases": [
        "sample name"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "text"
        }
      },
      "description": "A local identifier or name that for the material sample used for extracting nucleic acids, and subsequent sequencing. It can refer either to the original material collected or to any derived sub-samples. It can have any format, but we suggest that you make it concise, unique and consistent within your lab, and as informative as possible. INSDC requires every sample name from a single Submitter to be unique. Use of a globally unique identifier for the field source_mat_id is recommended in addition to sample_name.",
      "title": "sample name",
      "examples": [
        {
          "value": "ISDsoil1"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "investigation field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0001107",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": true
    },
    "samp_size": {
      "name": "samp_size",
      "aliases": [
        "amount or size of sample collected"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "millliter, gram, milligram, liter"
        }
      },
      "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample collected.",
      "title": "amount or size of sample collected",
      "examples": [
        {
          "value": "5 liter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "slot_uri": "MIXS:0000001",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "recommended": true
    },
    "samp_store_temp": {
      "name": "samp_store_temp",
      "aliases": [
        "sample storage temperature"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "degree Celsius"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Temperature at which sample was stored, e.g. -80 degree Celsius",
      "title": "sample storage temperature",
      "examples": [
        {
          "value": "-80 degree Celsius"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000110",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "season_precpt": {
      "name": "season_precpt",
      "aliases": [
        "mean seasonal precipitation"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "millimeter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
      "title": "mean seasonal precipitation",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000645",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "season_temp": {
      "name": "season_temp",
      "aliases": [
        "mean seasonal temperature"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "degree Celsius"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Mean seasonal temperature",
      "title": "mean seasonal temperature",
      "examples": [
        {
          "value": "18 degree Celsius"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000643",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "sieving": {
      "name": "sieving",
      "aliases": [
        "composite design/sieving"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "design name and/or size;amount"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
      "title": "composite design/sieving",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
      "slot_uri": "MIXS:0000322",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "size_frac_low": {
      "name": "size_frac_low",
      "aliases": [
        "size-fraction lower threshold"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "micrometer"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
      "title": "size-fraction lower threshold",
      "examples": [
        {
          "value": "0.2 micrometer"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000735",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "size_frac_up": {
      "name": "size_frac_up",
      "aliases": [
        "size-fraction upper threshold"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "micrometer"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
      "title": "size-fraction upper threshold",
      "examples": [
        {
          "value": "20 micrometer"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000736",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "slope_aspect": {
      "name": "slope_aspect",
      "aliases": [
        "slope aspect"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "degree"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
      "title": "slope aspect",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000647",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "slope_gradient": {
      "name": "slope_gradient",
      "aliases": [
        "slope gradient"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "percentage"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
      "title": "slope gradient",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000646",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "soil_horizon": {
      "name": "soil_horizon",
      "aliases": [
        "soil horizon"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
      "title": "soil horizon",
      "examples": [
        {
          "value": "A horizon"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001082",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "soil_horizon_enum",
      "required": false
    },
    "soil_text_measure": {
      "name": "soil_text_measure",
      "aliases": [
        "soil texture measurement"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
      "title": "soil texture measurement",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000335",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "soil_texture_meth": {
      "name": "soil_texture_meth",
      "aliases": [
        "soil texture method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining soil texture",
      "title": "soil texture method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000336",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "soil_type": {
      "name": "soil_type",
      "aliases": [
        "soil type"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "ENVO_00001998"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.",
      "title": "soil type",
      "examples": [
        {
          "value": "plinthosol [ENVO:00002250]"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{termLabel} {[termID]}",
      "slot_uri": "MIXS:0000332",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "soil_type_meth": {
      "name": "soil_type_meth",
      "aliases": [
        "soil type method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining soil series name or other lower-level classification",
      "title": "soil type method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000334",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "source_mat_id": {
      "name": "source_mat_id",
      "aliases": [
        "source material identifiers"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "for cultures of microorganisms: identifiers for two culture collections; for other material a unique arbitrary identifer"
        }
      },
      "description": "A unique identifier assigned to a material sample (as defined by http://rs.tdwg.org/dwc/terms/materialSampleID, and as opposed to a particular digital record of a material sample) used for extracting nucleic acids, and subsequent sequencing. The identifier can refer either to the original material collected or to any derived sub-samples. The INSDC qualifiers /specimen_voucher, /bio_material, or /culture_collection may or may not share the same value as the source_mat_id field. For instance, the /specimen_voucher qualifier and source_mat_id may both contain 'UAM:Herps:14' , referring to both the specimen voucher and sampled tissue with the same identifier. However, the /culture_collection qualifier may refer to a value from an initial culture (e.g. ATCC:11775) while source_mat_id would refer to an identifier from some derived culture from which the nucleic acids were extracted (e.g. xatc123 or ark:/2154/R2).",
      "title": "source material identifiers",
      "examples": [
        {
          "value": "MPI012345"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "nucleic acid sequence source field",
      "string_serialization": "{text}",
      "slot_uri": "MIXS:0000026",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "recommended": true
    },
    "store_cond": {
      "name": "store_cond",
      "aliases": [
        "storage conditions"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "storage condition type;duration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).",
      "title": "storage conditions",
      "examples": [
        {
          "value": "-20 degree Celsius freezer;P2Y10D"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{duration}",
      "slot_uri": "MIXS:0000327",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "temp": {
      "name": "temp",
      "aliases": [
        "temperature"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "degree Celsius"
        }
      },
      "description": "Temperature of the sample at the time of sampling.",
      "title": "temperature",
      "examples": [
        {
          "value": "25 degree Celsius"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "environment field",
      "slot_uri": "MIXS:0000113",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "tillage": {
      "name": "tillage",
      "aliases": [
        "history/tillage"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "enumeration"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Note method(s) used for tilling",
      "title": "history/tillage",
      "examples": [
        {
          "value": "chisel"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0001081",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "tillage_enum",
      "required": false
    },
    "tot_carb": {
      "name": "tot_carb",
      "aliases": [
        "total carbon"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "microgram per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Total carbon content",
      "title": "total carbon",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000525",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "tot_nitro_cont_meth": {
      "name": "tot_nitro_cont_meth",
      "aliases": [
        "total nitrogen content method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining the total nitrogen",
      "title": "total nitrogen content method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000338",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "tot_nitro_content": {
      "name": "tot_nitro_content",
      "aliases": [
        "total nitrogen content"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "microgram per liter, micromole per liter, milligram per liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Total nitrogen content of the sample",
      "title": "total nitrogen content",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000530",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "tot_org_c_meth": {
      "name": "tot_org_c_meth",
      "aliases": [
        "total organic carbon method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining total organic carbon",
      "title": "total organic carbon method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000337",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "tot_org_carb": {
      "name": "tot_org_carb",
      "aliases": [
        "total organic carbon"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "gram Carbon per kilogram sample material"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
      "title": "total organic carbon",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000533",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "tot_phosp": {
      "name": "tot_phosp",
      "aliases": [
        "total phosphorus"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "micromole per liter, milligram per liter, parts per million"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus",
      "title": "total phosphorus",
      "examples": [
        {
          "value": "0.03 milligram per liter"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000117",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value"
    },
    "water_cont_soil_meth": {
      "name": "water_cont_soil_meth",
      "aliases": [
        "water content method"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "PMID,DOI or url"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Reference or method used in determining the water content of soil",
      "title": "water content method",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "slot_uri": "MIXS:0000323",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "string",
      "required": false
    },
    "water_content": {
      "name": "water_content",
      "aliases": [
        "water content"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "gram per gram or cubic centimeter per cubic centimeter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "1"
        }
      },
      "description": "Water content measurement",
      "title": "water content",
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "slot_uri": "MIXS:0000185",
      "multivalued": false,
      "owner": "soil MIMS",
      "range": "quantity value",
      "required": false
    },
    "watering_regm": {
      "name": "watering_regm",
      "aliases": [
        "watering regimen"
      ],
      "annotations": {
        "expected_value": {
          "tag": "expected_value",
          "value": "measurement value;treatment interval and duration"
        },
        "preferred_unit": {
          "tag": "preferred_unit",
          "value": "milliliter, liter"
        },
        "occurrence": {
          "tag": "occurrence",
          "value": "m"
        }
      },
      "description": "Information about treatment involving an exposure to watering frequencies, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
      "title": "watering regimen",
      "examples": [
        {
          "value": "1 liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M"
        }
      ],
      "from_schema": "https://example.com/mims_soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit};{Rn/start_time/end_time/duration}",
      "slot_uri": "MIXS:0000591",
      "multivalued": true,
      "owner": "soil MIMS",
      "range": "string"
    }
  },
  "types": {
    "string": {
      "name": "string",
      "description": "A character string",
      "base": "str",
      "uri": "xsd:string"
    },
    "integer": {
      "name": "integer",
      "description": "An integer",
      "base": "int",
      "uri": "xsd:integer"
    },
    "boolean": {
      "name": "boolean",
      "description": "A binary (true or false) value",
      "base": "Bool",
      "uri": "xsd:boolean",
      "repr": "bool"
    },
    "float": {
      "name": "float",
      "description": "A real number that conforms to the xsd:float specification",
      "base": "float",
      "uri": "xsd:float"
    },
    "double": {
      "name": "double",
      "description": "A real number that conforms to the xsd:double specification",
      "base": "float",
      "uri": "xsd:double"
    },
    "decimal": {
      "name": "decimal",
      "description": "A real number with arbitrary precision that conforms to the xsd:decimal specification",
      "base": "Decimal",
      "uri": "xsd:decimal"
    },
    "time": {
      "name": "time",
      "description": "A time object represents a (local) time of day, independent of any particular day",
      "notes": [
        "URI is dateTime because OWL reasoners don't work with straight date or time"
      ],
      "base": "XSDTime",
      "uri": "xsd:dateTime",
      "repr": "str"
    },
    "date": {
      "name": "date",
      "description": "a date (year, month and day) in an idealized calendar",
      "notes": [
        "URI is dateTime because OWL reasoners don't work with straight date or time"
      ],
      "base": "XSDDate",
      "uri": "xsd:date",
      "repr": "str"
    },
    "datetime": {
      "name": "datetime",
      "description": "The combination of a date and time",
      "base": "XSDDateTime",
      "uri": "xsd:dateTime",
      "repr": "str"
    },
    "uriorcurie": {
      "name": "uriorcurie",
      "description": "a URI or a CURIE",
      "base": "URIorCURIE",
      "uri": "xsd:anyURI",
      "repr": "str"
    },
    "uri": {
      "name": "uri",
      "description": "a complete URI",
      "base": "URI",
      "uri": "xsd:anyURI",
      "repr": "str"
    },
    "ncname": {
      "name": "ncname",
      "description": "Prefix part of CURIE",
      "base": "NCName",
      "uri": "xsd:string",
      "repr": "str"
    },
    "objectidentifier": {
      "name": "objectidentifier",
      "description": "A URI or CURIE that represents an object in the model.",
      "comments": [
        "Used for inheritence and type checking"
      ],
      "base": "ElementIdentifier",
      "uri": "shex:iri",
      "repr": "str"
    },
    "nodeidentifier": {
      "name": "nodeidentifier",
      "description": "A URI, CURIE or BNODE that represents a node in a model.",
      "base": "NodeIdentifier",
      "uri": "shex:nonLiteral",
      "repr": "str"
    }
  }
}