var DATA = [
  {
    "fieldName": "Sample ID",
    "children": [
      {
        "fieldName": "Globally Unique ID",
        "capitalize": "",
        "ontology_id": "samp_id:unique_ID",
        "datatype": "xs:unique",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A globally unique identifier assigned to the biological sample.",
        "guidance": "Identifiers must me prefixed. IGSNs (http://www.geosamples.org/getigsn) are unique and FAIR. UUIDs (https://www.uuidgenerator.net/) are globally unique but not FAIR. These IDs enable linking to derrived analytes and subsamples. | Pattern hint: {text}:{text}",
        "examples": "IGSN:AU1243",
        "pattern": "[^\\:\\n\\r]+\\:[^\\:\\n\\r]+",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "unique_ID"
            }
          ]
        }
      },
      {
        "fieldName": "sample name",
        "capitalize": "",
        "ontology_id": "samp_id:sample_name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A local identifier or name that for the material sample collected. Refers to the original material collected or to any derived sub-samples.",
        "guidance": "It can have any format, but we suggest that you make it concise, unique and consistent within your lab, and as informative as possible. | Pattern hint: {text}",
        "examples": "Rock core CB1178(5-6) from NSW",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_name"
            }
          ]
        }
      },
      {
        "fieldName": "environmental package",
        "capitalize": "",
        "ontology_id": "samp_id:env_package",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Select the MIxS enviromental package that best describes the environment from which your sample was collected.",
        "guidance": "Pattern hint: enumeration",
        "examples": "soil",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "env_package"
            }
          ]
        },
        "schema:ItemList": {
          "soil": {}
        }
      },
      {
        "fieldName": "Analysis/Data Type",
        "capitalize": "",
        "ontology_id": "samp_id:analysis_type",
        "datatype": "multiple",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Select all the data types associated or available for this biosample",
        "guidance": "Pattern hint: enumeration",
        "examples": "metagenomics; metabolomics; proteomics",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "analysis_type"
            }
          ]
        },
        "schema:ItemList": {
          "metabolomics": {},
          "metagenomics": {},
          "metaproteomics": {},
          "metatranscriptomics": {},
          "natural organic matter": {}
        }
      },
      {
        "fieldName": "sample linkage",
        "capitalize": "",
        "ontology_id": "samp_id:sample_link",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "A unique identifier to assign parent-child, subsample, or sibling samples. This is relevant when a sample or other material was used to generate the new sample. ",
        "guidance": "This field allows multiple entries separated by ; (Examples: Soil collected from the field will link with the soil used in an incubation. The soil a plant was grown in links to the plant sample. An original culture sample was transferred to a new vial and generated a new sample) | Pattern hint: {text}:{text}",
        "examples": "IGSN:DSJ0284",
        "pattern": "[^\\:\\n\\r]+\\:[^\\:\\n\\r]+",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_link"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "NMDC fields esp. GOLD paths",
    "children": [
      {
        "fieldName": "ecosystem",
        "capitalize": "",
        "ontology_id": "samp_id:ecosystem",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "An ecosystem is a combination of a physical environment (abiotic factors) and all the organisms (biotic factors) that interact with this environment. Ecosystem is in position 1/5 in a GOLD path.",
        "guidance": "The abiotic factors play a profound role on the type and composition of organisms in a given environment. The GOLD Ecosystem at the top of the five-level classification system is aimed at capturing the broader environment from which an organism or environmental sample is collected. The three broad groups under Ecosystem are Environmental, Host-associated, and Engineered. They represent samples collected from a natural environment or from another organism or from engineered environments like bioreactors respectively. | Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "ecosystem"
            }
          ]
        },
        "schema:ItemList": {
          "Environmental": {}
        }
      },
      {
        "fieldName": "ecosystem_category",
        "capitalize": "",
        "ontology_id": "samp_id:ecosystem_category",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ecosystem categories represent divisions within the ecosystem based on specific characteristics of the environment from where an organism or sample is isolated. Ecosystem category is in position 2/5 in a GOLD path.",
        "guidance": "The Environmental ecosystem (for example) is divided into Air, Aquatic and Terrestrial. Ecosystem categories for Host-associated samples can be individual hosts or phyla and for engineered samples it may be manipulated environments like bioreactors, solid waste etc. | Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "ecosystem_category"
            }
          ]
        },
        "schema:ItemList": {
          "Terrestrial": {}
        }
      },
      {
        "fieldName": "ecosystem_type",
        "capitalize": "",
        "ontology_id": "samp_id:ecosystem_type",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ecosystem types represent things having common characteristics within the Ecosystem Category. These common characteristics based grouping is still broad but specific to the characteristics of a given environment. Ecosystem type is in position 3/5 in a GOLD path.",
        "guidance": "The Aquatic ecosystem category (for example) may have ecosystem types like Marine or Thermal springs etc. Ecosystem category Air may have Indoor air or Outdoor air as different Ecosystem Types. In the case of Host-associated samples, ecosystem type can represent Respiratory system, Digestive system, Roots etc. | Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "ecosystem_type"
            }
          ]
        },
        "schema:ItemList": {
          "Soil": {}
        }
      },
      {
        "fieldName": "ecosystem_subtype",
        "capitalize": "",
        "ontology_id": "samp_id:ecosystem_subtype",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ecosystem subtypes represent further subdivision of Ecosystem types into more distinct subtypes. Ecosystem subtype is in position 4/5 in a GOLD path.",
        "guidance": "Ecosystem Type Marine (Environmental -> Aquatic -> Marine) is further divided (for example) into Intertidal zone, Coastal, Pelagic, Intertidal zone etc. in the Ecosystem subtype category. | Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "ecosystem_subtype"
            }
          ]
        },
        "schema:ItemList": {
          "Biocrust": {},
          "Biofilm": {},
          "Bulk soil": {},
          "Clay": {},
          "Floodplain": {},
          "Fossil": {},
          "Glacier": {},
          "Loam": {},
          "Mineral horizon": {},
          "Nature reserve": {},
          "Organic layer": {},
          "Paddy field/soil": {},
          "Pasture": {},
          "Peat": {},
          "Ranch": {},
          "Sand": {},
          "Silt": {},
          "Soil crust": {},
          "Unclassified": {},
          "Watershed": {},
          "Wetlands": {}
        }
      },
      {
        "fieldName": "specific_ecosystem",
        "capitalize": "",
        "ontology_id": "samp_id:specific_ecosystem",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Specific ecosystems represent specific features of the environment like aphotic zone in an ocean or gastric mucosa within a host digestive system. Specific ecosystem is in position 5/5 in a GOLD path.\n",
        "guidance": "Specific ecosystems help to define samples based on very specific characteristics of an environment under the five-level classification system.\n | Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "specific_ecosystem"
            }
          ]
        },
        "schema:ItemList": {
          "Agricultural": {},
          "Agricultural land": {},
          "Agricultural soil": {},
          "Alpine": {},
          "Bog": {},
          "Boreal forest": {},
          "Contaminated": {},
          "Desert": {},
          "Farm": {},
          "Forest Soil": {},
          "Forest soil": {},
          "Grasslands": {},
          "Meadow": {},
          "Mine": {},
          "Mine drainage": {},
          "Oil-contaminated": {},
          "Orchard soil": {},
          "Permafrost": {},
          "Riparian soil": {},
          "River": {},
          "Shrubland": {},
          "Tropical rainforest": {},
          "Unclassified": {},
          "Uranium contaminated": {}
        }
      }
    ]
  },
  {
    "fieldName": "EMSL",
    "children": [
      {
        "fieldName": "Project ID",
        "capitalize": "",
        "ontology_id": "emsl:project_ID",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Proposal IDs or names associated with dataset",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "project_ID"
            }
          ]
        }
      },
      {
        "fieldName": "sample type",
        "capitalize": "",
        "ontology_id": "emsl:sample_type",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Type of sample being submitted",
        "guidance": "This can vary from 'environmental package' if the sample is an extraction. | Pattern hint: enumeration",
        "examples": "water extracted soil",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_type"
            }
          ]
        },
        "schema:ItemList": {
          "soil": {},
          "water_extract_soil": {}
        }
      },
      {
        "fieldName": "sample shipped amount",
        "capitalize": "",
        "ontology_id": "emsl:sample_shipped",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample sent to EMSL",
        "guidance": "Pattern hint: {float} {unit}",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_shipped"
            }
          ]
        }
      },
      {
        "fieldName": "EMSL Sample Storage Temperature, deg. C",
        "capitalize": "",
        "ontology_id": "emsl:EMSL_store_temp",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Temperature at which the sample sent to EMSL should be stored",
        "guidance": "Enter a temperature in celsius. Numeric portion only. | Pattern hint: {float}",
        "examples": "-80",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "EMSL_store_temp"
            }
          ]
        }
      },
      {
        "fieldName": "Number Technical Replicate",
        "capitalize": "",
        "ontology_id": "emsl:technical_reps",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "If sending multiple technical replicates of the same sample, indicate how many replicates are being sent",
        "guidance": "Pattern hint: {integer}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "technical_reps"
            }
          ]
        }
      },
      {
        "fieldName": "Replicate Number",
        "capitalize": "",
        "ontology_id": "emsl:replicate_number",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "If sending biological replicates, indicate the rep number here.",
        "guidance": "This will guide staff in ensuring your samples are block & randomized correctly | Pattern hint: {integer}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "replicate_number"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "JGI-Metagenomics",
    "children": [
      {
        "fieldName": "DNA Seq Project ID",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_seq_project",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "1191234",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_seq_project"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Seq Project Name",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_seq_project_name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "JGI Pond metagenomics",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_seq_project_name"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Sample ID",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_samp_ID",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "187654",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_samp_ID"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Sample Name",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_sample_name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Give the DNA sample a name that is meaningful to you. Sample names must be unique across all JGI projects and contain a-z, A-Z, 0-9, - and _ only.",
        "guidance": "Pattern hint: {text}",
        "examples": "JGI_pond_041618",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_sample_name"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Concentration in ng/uL",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_concentration",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "0.0",
        "xs:maxInclusive": "2000.0",
        "requirement": "required",
        "description": "",
        "guidance": "Units must be in ng/uL. Enter the numerical part only. Must be calculated using a fluorometric method. Acceptable values are 0-2000. | Pattern hint: {float}",
        "examples": "100",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_concentration"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Volume in uL",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_volume",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "0.0",
        "xs:maxInclusive": "1000.0",
        "requirement": "required",
        "description": "",
        "guidance": "Units must be in uL. Enter the numerical part only. Value must 0-1000. Values <25 by special permission only. | Pattern hint: {float}",
        "examples": "25",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_volume"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Absorbance 260/280",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_absorb1",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "260/280 measurement of DNA sample purity",
        "guidance": "Recommended value is between 1 and 3. | Pattern hint: {float}",
        "examples": "2.02",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_absorb1"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Absorbance 260/230",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_absorb2",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "260/230 measurement of DNA sample purity",
        "guidance": "Recommended value is between 1 and 3. | Pattern hint: {float}",
        "examples": "2.02",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_absorb2"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Container Label",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_container_ID",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Must be unique across all tubes and plates, and <20 characters. All samples in a plate should have the same plate label. | Pattern hint: {text < 20 characters}",
        "examples": "Pond_MT_041618",
        "pattern": "^.{1,20}$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_container_ID"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Container Type",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_cont_type",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Tube or plate (96-well)",
        "guidance": "Pattern hint: enumeration",
        "examples": "plate",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_cont_type"
            }
          ]
        },
        "schema:ItemList": {
          "plate": {},
          "tube": {}
        }
      },
      {
        "fieldName": "DNA Well Number",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_cont_well",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Required when 'plate' is selected for container type. Corner wells must be blank. For partial plates, fill by columns. Leave blank if the sample will be shipped in a tube. | Pattern hint: {96 well plate pos}",
        "examples": "B2",
        "pattern": "^[A-H](0?[1-9]$)|(^1[0-2])$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_cont_well"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Sample Format",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_sample_format",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Solution in which the DNA sample has been suspended",
        "guidance": "Pattern hint: enumeration",
        "examples": "Water",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_sample_format"
            }
          ]
        },
        "schema:ItemList": {
          "10 mM Tris-HCl": {},
          "DNAStable": {},
          "Ethanol": {},
          "Low EDTA TE": {},
          "MDA reaction buffer": {},
          "PBS": {},
          "Pellet": {},
          "RNAStable": {},
          "TE": {},
          "Water": {}
        }
      },
      {
        "fieldName": "DNAse Treatment DNA",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_dnase",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Note DNAse treatment is required for all RNA samples. | Pattern hint: enumeration",
        "examples": "no",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_dnase"
            }
          ]
        },
        "schema:ItemList": {
          "no": {},
          "yes": {}
        }
      },
      {
        "fieldName": "DNA Expected Organisms",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_organisms",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "List any organisms known or suspected to grow in co-culture, as well as estimated % of the organism in that culture.",
        "guidance": "Pattern hint: {text}",
        "examples": "expected to contain microbes (59%) fungi (30%), viruses (10%), tadpoles (1%)",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_organisms"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Collection Site",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_collect_site",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Provide information on the site your DNA sample was collected from",
        "guidance": "Pattern hint: {text}",
        "examples": "untreated pond water",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_collect_site"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Isolation Method",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_isolate_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Describe the method/protocol/kit used to extract DNA/RNA.",
        "guidance": "Pattern hint: {text}",
        "examples": "phenol/chloroform extraction",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_isolate_meth"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Seq Project PI",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_seq_project_PI",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "Jane Johnson",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_seq_project_PI"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Seq Project Contact",
        "capitalize": "",
        "ontology_id": "jgi_gen:dna_project_contact",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "John Jones",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "dna_project_contact"
            }
          ]
        }
      },
      {
        "fieldName": "DNA Proposal ID",
        "capitalize": "",
        "ontology_id": "jgi_gen:proposal_dna",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "",
        "guidance": "Do not edit these values. A template will be provided by NMDC in which these values have been pre-filled. | Pattern hint: {text}",
        "examples": "504000",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "proposal_dna"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Modified Required",
    "children": [
      {
        "fieldName": "growth facility",
        "capitalize": "",
        "ontology_id": "mixs_modified:growth_facility",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Type of facility/location where the sample was harvested; controlled vocabulary: growth chamber, open top chamber, glasshouse, experimental garden, field.",
        "guidance": "Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "growth_facility"
            }
          ]
        },
        "schema:ItemList": {
          "experimental_garden": {},
          "field": {},
          "field_incubation": {},
          "glasshouse": {},
          "greenhouse": {},
          "growth_chamber": {},
          "lab_incubation": {},
          "open_top_chamber": {},
          "other": {}
        }
      },
      {
        "fieldName": "storage conditions",
        "capitalize": "",
        "ontology_id": "mixs_modified:storage_condt",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Explain how the soil sample is stored (fresh/frozen/other).",
        "guidance": "Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "storage_condt"
            }
          ]
        },
        "schema:ItemList": {
          "fresh": {},
          "frozen": {},
          "lyophilized": {},
          "other": {}
        }
      },
      {
        "fieldName": "Collection Date",
        "capitalize": "",
        "ontology_id": "mixs_modified:collection_date",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The date of sampling",
        "guidance": "Date should be formatted as YYYY(-MM(-DD)) | Pattern hint: {date, arbitrary precision}",
        "examples": "2021-04-15, 2021-04 and 2021 are all acceptable.",
        "pattern": "^[12]\\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\\d|3[01]))?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "collection_date"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Required",
    "children": [
      {
        "fieldName": "broad-scale environmental context",
        "capitalize": "",
        "ontology_id": "MIXS:0000012",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
        "guidance": "Pattern hint: {termLabel} {[termID]}",
        "examples": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "env_broad_scale"
            }
          ]
        },
        "schema:ItemList": {
          "alpine biome [ENVO:01001835]": {
            "ontology_id": "ENVO:01001835"
          },
          "__alpine tundra biome [ENVO:01001505]": {
            "ontology_id": "ENVO:01001505"
          },
          "anthropogenic terrestrial biome [ENVO:01000219]": {
            "ontology_id": "ENVO:01000219"
          },
          "__rangeland biome [ENVO:01000247]": {
            "ontology_id": "ENVO:01000247"
          },
          "__village biome [ENVO:01000246]": {
            "ontology_id": "ENVO:01000246"
          },
          "arid biome [ENVO:01001838]": {
            "ontology_id": "ENVO:01001838"
          },
          "mangrove biome [ENVO:01000181]": {
            "ontology_id": "ENVO:01000181"
          },
          "montane biome [ENVO:01001836]": {
            "ontology_id": "ENVO:01001836"
          },
          "__montane savanna biome [ENVO:01000223]": {
            "ontology_id": "ENVO:01000223"
          },
          "__montane shrubland biome [ENVO:01000216]": {
            "ontology_id": "ENVO:01000216"
          },
          "polar biome [ENVO:01000339]": {
            "ontology_id": "ENVO:01000339"
          },
          "shrubland biome [ENVO:01000176]": {
            "ontology_id": "ENVO:01000176"
          },
          "__subtropical shrubland biome [ENVO:01000213]": {
            "ontology_id": "ENVO:01000213"
          },
          "____mediterranean shrubland biome [ENVO:01000217]": {
            "ontology_id": "ENVO:01000217"
          },
          "__temperate shrubland biome [ENVO:01000215]": {
            "ontology_id": "ENVO:01000215"
          },
          "__tropical shrubland biome [ENVO:01000214]": {
            "ontology_id": "ENVO:01000214"
          },
          "subalpine biome [ENVO:01001837]": {
            "ontology_id": "ENVO:01001837"
          },
          "subpolar biome [ENVO:01001834]": {
            "ontology_id": "ENVO:01001834"
          },
          "subtropical biome [ENVO:01001832]": {
            "ontology_id": "ENVO:01001832"
          },
          "__mediterranean biome [ENVO:01001833]": {
            "ontology_id": "ENVO:01001833"
          },
          "____mediterranean savanna biome [ENVO:01000229]": {
            "ontology_id": "ENVO:01000229"
          },
          "____mediterranean woodland biome [ENVO:01000208]": {
            "ontology_id": "ENVO:01000208"
          },
          "__subtropical savanna biome [ENVO:01000187]": {
            "ontology_id": "ENVO:01000187"
          },
          "__subtropical woodland biome [ENVO:01000222]": {
            "ontology_id": "ENVO:01000222"
          },
          "temperate biome [ENVO:01001831]": {
            "ontology_id": "ENVO:01001831"
          },
          "__temperate savanna biome [ENVO:01000189]": {
            "ontology_id": "ENVO:01000189"
          },
          "__temperate woodland biome [ENVO:01000221]": {
            "ontology_id": "ENVO:01000221"
          },
          "tropical biome [ENVO:01001830]": {
            "ontology_id": "ENVO:01001830"
          },
          "__tropical savanna biome [ENVO:01000188]": {
            "ontology_id": "ENVO:01000188"
          },
          "__tropical woodland biome [ENVO:01000220]": {
            "ontology_id": "ENVO:01000220"
          },
          "tundra biome [ENVO:01000180]": {
            "ontology_id": "ENVO:01000180"
          },
          "urban biome [ENVO:01000249]": {
            "ontology_id": "ENVO:01000249"
          },
          "woodland biome [ENVO:01000175]": {
            "ontology_id": "ENVO:01000175"
          },
          "__savanna biome [ENVO:01000178]": {
            "ontology_id": "ENVO:01000178"
          },
          "____flooded savanna biome [ENVO:01000190]": {
            "ontology_id": "ENVO:01000190"
          },
          "____montane savanna biome [ENVO:01000223]": {
            "ontology_id": "ENVO:01000223"
          },
          "____subtropical savanna biome [ENVO:01000187]": {
            "ontology_id": "ENVO:01000187"
          },
          "______mediterranean savanna biome [ENVO:01000229]": {
            "ontology_id": "ENVO:01000229"
          },
          "____temperate savanna biome [ENVO:01000189]": {
            "ontology_id": "ENVO:01000189"
          },
          "____tropical savanna biome [ENVO:01000188]": {
            "ontology_id": "ENVO:01000188"
          }
        }
      },
      {
        "fieldName": "local environmental context",
        "capitalize": "",
        "ontology_id": "MIXS:0000013",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
        "guidance": "Pattern hint: {termLabel} {[termID]}",
        "examples": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336].",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "env_local_scale"
            }
          ]
        },
        "schema:ItemList": {
          "active geological fault [ENVO:01000669]": {
            "ontology_id": "ENVO:01000669"
          },
          "agricultural field [ENVO:00000114]": {
            "ontology_id": "ENVO:00000114"
          },
          "beach [ENVO:00000091]": {
            "ontology_id": "ENVO:00000091"
          },
          "cave [ENVO:00000067]": {
            "ontology_id": "ENVO:00000067"
          },
          "channel [ENVO:03000117]": {
            "ontology_id": "ENVO:03000117"
          },
          "__tunnel [ENVO:00000068]": {
            "ontology_id": "ENVO:00000068"
          },
          "coast [ENVO:01000687]": {
            "ontology_id": "ENVO:01000687"
          },
          "dry lake [ENVO:00000277]": {
            "ontology_id": "ENVO:00000277"
          },
          "dry river [ENVO:01000995]": {
            "ontology_id": "ENVO:01000995"
          },
          "garden [ENVO:00000011]": {
            "ontology_id": "ENVO:00000011"
          },
          "hill [ENVO:00000083]": {
            "ontology_id": "ENVO:00000083"
          },
          "__dune [ENVO:00000170]": {
            "ontology_id": "ENVO:00000170"
          },
          "hummock [ENVO:00000516]": {
            "ontology_id": "ENVO:00000516"
          },
          "impact crater [ENVO:01001071]": {
            "ontology_id": "ENVO:01001071"
          },
          "isthmus [ENVO:00000174]": {
            "ontology_id": "ENVO:00000174"
          },
          "karst [ENVO:00000175]": {
            "ontology_id": "ENVO:00000175"
          },
          "lake shore [ENVO:00000382]": {
            "ontology_id": "ENVO:00000382"
          },
          "lava field [ENVO:01000437]": {
            "ontology_id": "ENVO:01000437"
          },
          "mesa [ENVO:00000179]": {
            "ontology_id": "ENVO:00000179"
          },
          "mountain [ENVO:00000081]": {
            "ontology_id": "ENVO:00000081"
          },
          "peninsula [ENVO:00000305]": {
            "ontology_id": "ENVO:00000305"
          },
          "plain [ENVO:00000086]": {
            "ontology_id": "ENVO:00000086"
          },
          "plateau [ENVO:00000182]": {
            "ontology_id": "ENVO:00000182"
          },
          "ridge [ENVO:00000283]": {
            "ontology_id": "ENVO:00000283"
          },
          "slope [ENVO:00002000]": {
            "ontology_id": "ENVO:00002000"
          },
          "__cliff [ENVO:00000087]": {
            "ontology_id": "ENVO:00000087"
          },
          "__hillside [ENVO:01000333]": {
            "ontology_id": "ENVO:01000333"
          },
          "snow field [ENVO:00000146]": {
            "ontology_id": "ENVO:00000146"
          },
          "tombolo [ENVO:00000420]": {
            "ontology_id": "ENVO:00000420"
          },
          "tuff cone [ENVO:01000664]": {
            "ontology_id": "ENVO:01000664"
          },
          "valley [ENVO:00000100]": {
            "ontology_id": "ENVO:00000100"
          },
          "__canyon [ENVO:00000169]": {
            "ontology_id": "ENVO:00000169"
          },
          "__dry valley [ENVO:00000128]": {
            "ontology_id": "ENVO:00000128"
          },
          "__glacial valley [ENVO:00000248]": {
            "ontology_id": "ENVO:00000248"
          },
          "vein [ENVO:01000670]": {
            "ontology_id": "ENVO:01000670"
          },
          "volcano [ENVO:00000247]": {
            "ontology_id": "ENVO:00000247"
          },
          "woodland clearing [ENVO:00000444]": {
            "ontology_id": "ENVO:00000444"
          }
        }
      },
      {
        "fieldName": "environmental medium",
        "capitalize": "",
        "ontology_id": "MIXS:0000014",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
        "guidance": "Pattern hint: {termLabel} {[termID]}",
        "examples": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "env_medium"
            }
          ]
        },
        "schema:ItemList": {
          "agricultural soil [ENVO:00002259]": {
            "ontology_id": "ENVO:00002259"
          },
          "__bluegrass field soil [ENVO:00005789]": {
            "ontology_id": "ENVO:00005789"
          },
          "__paddy field soil [ENVO:00005740]": {
            "ontology_id": "ENVO:00005740"
          },
          "____peaty paddy field soil [ENVO:00005776]": {
            "ontology_id": "ENVO:00005776"
          },
          "__rubber plantation soil [ENVO:00005788]": {
            "ontology_id": "ENVO:00005788"
          },
          "albeluvisol [ENVO:00002233]": {
            "ontology_id": "ENVO:00002233"
          },
          "alisol [ENVO:00002231]": {
            "ontology_id": "ENVO:00002231"
          },
          "alluvial soil [ENVO:00002871]": {
            "ontology_id": "ENVO:00002871"
          },
          "__alluvial swamp soil [ENVO:00005758]": {
            "ontology_id": "ENVO:00005758"
          },
          "alpine soil [ENVO:00005741]": {
            "ontology_id": "ENVO:00005741"
          },
          "andosol [ENVO:00002232]": {
            "ontology_id": "ENVO:00002232"
          },
          "__volcanic soil [ENVO:01001841]": {
            "ontology_id": "ENVO:01001841"
          },
          "anthrosol [ENVO:00002230]": {
            "ontology_id": "ENVO:00002230"
          },
          "arenosol [ENVO:00002229]": {
            "ontology_id": "ENVO:00002229"
          },
          "bare soil [ENVO:01001616]": {
            "ontology_id": "ENVO:01001616"
          },
          "burned soil [ENVO:00005760]": {
            "ontology_id": "ENVO:00005760"
          },
          "calcisol [ENVO:00002239]": {
            "ontology_id": "ENVO:00002239"
          },
          "cambisol [ENVO:00002235]": {
            "ontology_id": "ENVO:00002235"
          },
          "carbon nanotube enriched soil [ENVO:01000427]": {
            "ontology_id": "ENVO:01000427"
          },
          "chernozem [ENVO:00002237]": {
            "ontology_id": "ENVO:00002237"
          },
          "compost soil [ENVO:00005747]": {
            "ontology_id": "ENVO:00005747"
          },
          "__frozen compost soil [ENVO:00005765]": {
            "ontology_id": "ENVO:00005765"
          },
          "contaminated soil [ENVO:00002116]": {
            "ontology_id": "ENVO:00002116"
          },
          "__xylene contaminated soil [ENVO:00002146]": {
            "ontology_id": "ENVO:00002146"
          },
          "dune soil [ENVO:00002260]": {
            "ontology_id": "ENVO:00002260"
          },
          "durisol [ENVO:00002238]": {
            "ontology_id": "ENVO:00002238"
          },
          "ferralsol [ENVO:00002246]": {
            "ontology_id": "ENVO:00002246"
          },
          "fluvisol [ENVO:00002273]": {
            "ontology_id": "ENVO:00002273"
          },
          "forest soil [ENVO:00002261]": {
            "ontology_id": "ENVO:00002261"
          },
          "__beech forest soil [ENVO:00005770]": {
            "ontology_id": "ENVO:00005770"
          },
          "__eucalyptus forest soil [ENVO:00005787]": {
            "ontology_id": "ENVO:00005787"
          },
          "__mountain forest soil [ENVO:00005769]": {
            "ontology_id": "ENVO:00005769"
          },
          "frost-susceptible soil [ENVO:01001638]": {
            "ontology_id": "ENVO:01001638"
          },
          "frozen soil [ENVO:01001526]": {
            "ontology_id": "ENVO:01001526"
          },
          "__cryosol [ENVO:00002236]": {
            "ontology_id": "ENVO:00002236"
          },
          "__friable-frozen soil [ENVO:01001528]": {
            "ontology_id": "ENVO:01001528"
          },
          "__plastic-frozen soil [ENVO:01001527]": {
            "ontology_id": "ENVO:01001527"
          },
          "gleysol [ENVO:00002244]": {
            "ontology_id": "ENVO:00002244"
          },
          "grassland soil [ENVO:00005750]": {
            "ontology_id": "ENVO:00005750"
          },
          "__savanna soil [ENVO:00005746]": {
            "ontology_id": "ENVO:00005746"
          },
          "__steppe soil [ENVO:00005777]": {
            "ontology_id": "ENVO:00005777"
          },
          "greenhouse soil [ENVO:00005780]": {
            "ontology_id": "ENVO:00005780"
          },
          "gypsisol [ENVO:00002245]": {
            "ontology_id": "ENVO:00002245"
          },
          "histosol [ENVO:00002243]": {
            "ontology_id": "ENVO:00002243"
          },
          "humus-rich acidic ash soil [ENVO:00005763]": {
            "ontology_id": "ENVO:00005763"
          },
          "jungle soil [ENVO:00005751]": {
            "ontology_id": "ENVO:00005751"
          },
          "kastanozem [ENVO:00002240]": {
            "ontology_id": "ENVO:00002240"
          },
          "leptosol [ENVO:00002241]": {
            "ontology_id": "ENVO:00002241"
          },
          "limed soil [ENVO:00005766]": {
            "ontology_id": "ENVO:00005766"
          },
          "lixisol [ENVO:00002242]": {
            "ontology_id": "ENVO:00002242"
          },
          "loam [ENVO:00002258]": {
            "ontology_id": "ENVO:00002258"
          },
          "luvisol [ENVO:00002248]": {
            "ontology_id": "ENVO:00002248"
          },
          "manured soil [ENVO:00005767]": {
            "ontology_id": "ENVO:00005767"
          },
          "meadow soil [ENVO:00005761]": {
            "ontology_id": "ENVO:00005761"
          },
          "muddy soil [ENVO:00005771]": {
            "ontology_id": "ENVO:00005771"
          },
          "nitisol [ENVO:00002247]": {
            "ontology_id": "ENVO:00002247"
          },
          "orchard soil [ENVO:00005772]": {
            "ontology_id": "ENVO:00005772"
          },
          "ornithogenic soil [ENVO:00005782]": {
            "ontology_id": "ENVO:00005782"
          },
          "pantothenate enriched soil [ENVO:00003088]": {
            "ontology_id": "ENVO:00003088"
          },
          "pasture soil [ENVO:00005773]": {
            "ontology_id": "ENVO:00005773"
          },
          "peat soil [ENVO:00005774]": {
            "ontology_id": "ENVO:00005774"
          },
          "phaeozem [ENVO:00002249]": {
            "ontology_id": "ENVO:00002249"
          },
          "planosol [ENVO:00002251]": {
            "ontology_id": "ENVO:00002251"
          },
          "plinthosol [ENVO:00002250]": {
            "ontology_id": "ENVO:00002250"
          },
          "podzol [ENVO:00002257]": {
            "ontology_id": "ENVO:00002257"
          },
          "poly-beta-hydroxybutyrate enriched soil [ENVO:00003093]": {
            "ontology_id": "ENVO:00003093"
          },
          "pond soil [ENVO:00005764]": {
            "ontology_id": "ENVO:00005764"
          },
          "quinate enriched soil [ENVO:00003095]": {
            "ontology_id": "ENVO:00003095"
          },
          "regosol [ENVO:00002256]": {
            "ontology_id": "ENVO:00002256"
          },
          "sarcosine enriched soil [ENVO:00003083]": {
            "ontology_id": "ENVO:00003083"
          },
          "skatole enriched soil [ENVO:00003085]": {
            "ontology_id": "ENVO:00003085"
          },
          "solonchak [ENVO:00002252]": {
            "ontology_id": "ENVO:00002252"
          },
          "solonetz [ENVO:00002255]": {
            "ontology_id": "ENVO:00002255"
          },
          "stagnosol [ENVO:00002274]": {
            "ontology_id": "ENVO:00002274"
          },
          "surface soil [ENVO:02000059]": {
            "ontology_id": "ENVO:02000059"
          },
          "technosol [ENVO:00002275]": {
            "ontology_id": "ENVO:00002275"
          },
          "threonine enriched soil [ENVO:00003091]": {
            "ontology_id": "ENVO:00003091"
          },
          "trimethylamine enriched soil [ENVO:00003084]": {
            "ontology_id": "ENVO:00003084"
          },
          "tropical soil [ENVO:00005778]": {
            "ontology_id": "ENVO:00005778"
          },
          "ultisol [ENVO:01001397]": {
            "ontology_id": "ENVO:01001397"
          },
          "__acrisol [ENVO:00002234]": {
            "ontology_id": "ENVO:00002234"
          },
          "umbrisol [ENVO:00002253]": {
            "ontology_id": "ENVO:00002253"
          },
          "upland soil [ENVO:00005786]": {
            "ontology_id": "ENVO:00005786"
          },
          "urea enriched soil [ENVO:00005753]": {
            "ontology_id": "ENVO:00005753"
          },
          "vertisol [ENVO:00002254]": {
            "ontology_id": "ENVO:00002254"
          }
        }
      },
      {
        "fieldName": "geographic location (country and/or sea,region)",
        "capitalize": "",
        "ontology_id": "MIXS:0000010",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
        "guidance": "Pattern hint: {term}: {term}, {text}",
        "examples": "USA: Maryland, Bethesda",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "geo_loc_name"
            }
          ]
        }
      },
      {
        "fieldName": "geographic location (latitude and longitude)",
        "capitalize": "",
        "ontology_id": "MIXS:0000009",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system",
        "guidance": "Pattern hint: {float} {float}",
        "examples": "50.586825 6.408977",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? [-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "lat_lon"
            }
          ]
        }
      },
      {
        "fieldName": "elevation",
        "capitalize": "",
        "ontology_id": "MIXS:0000093",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
        "guidance": "",
        "examples": "100 meter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "elev"
            }
          ]
        }
      },
      {
        "fieldName": "sample storage temperature",
        "capitalize": "",
        "ontology_id": "MIXS:0000110",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Temperature at which sample was stored, e.g. -80 degree Celsius",
        "guidance": "",
        "examples": "-80 degree Celsius",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "samp_store_temp"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Modified Required Where Applicable",
    "children": [
      {
        "fieldName": "collection time, GMT",
        "capitalize": "",
        "ontology_id": "mixs_modified:collection_time",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The time of sampling, either as an instance (single point) or interval.",
        "guidance": "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter | Pattern hint: {time, seconds optional}",
        "examples": "13:33 or 13:33:55",
        "pattern": "^([01]?\\d|2[0-3]|24(?=:00?:00?$)):([0-5]\\d)(:([0-5]\\d))?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "collection_time"
            }
          ]
        }
      },
      {
        "fieldName": "Incubation Collection Date",
        "capitalize": "",
        "ontology_id": "mixs_modified:collection_date_inc",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Date the incubation was harvested/collected/ended. Only relevant for incubation samples.",
        "guidance": "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable. | Pattern hint: {date, arbitrary precision}",
        "examples": "2021-04-15, 2021-04 and 2021 are all acceptable.",
        "pattern": "^[12]\\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\\d|3[01]))?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "collection_date_inc"
            }
          ]
        }
      },
      {
        "fieldName": "Incubation Collection Time, GMT",
        "capitalize": "",
        "ontology_id": "mixs_modified:collection_time_inc",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Time the incubation was harvested/collected/ended. Only relevant for incubation samples.",
        "guidance": "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter | Pattern hint: {time, seconds optional}",
        "examples": "13:33 or 13:33:55",
        "pattern": "^([01]?\\d|2[0-3]|24(?=:00?:00?$)):([0-5]\\d)(:([0-5]\\d))?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "collection_time_inc"
            }
          ]
        }
      },
      {
        "fieldName": "Incubation Start Date",
        "capitalize": "",
        "ontology_id": "mixs_modified:start_date_inc",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Date the incubation was started. Only relevant for incubation samples.",
        "guidance": "Date should be formatted as YYYY(-MM(-DD)). Ie, 2021-04-15, 2021-04 and 2021 are all acceptable. | Pattern hint: {date, arbitrary precision}",
        "examples": "2021-04-15, 2021-04 and 2021 are all acceptable.",
        "pattern": "^[12]\\d{3}(?:(?:-(?:0[1-9]|1[0-2]))(?:-(?:0[1-9]|[12]\\d|3[01]))?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "start_date_inc"
            }
          ]
        }
      },
      {
        "fieldName": "Incubation Start Time, GMT",
        "capitalize": "",
        "ontology_id": "mixs_modified:start_time_inc",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Time the incubation was started. Only relevant for incubation samples.",
        "guidance": "Time should be entered as HH:MM(:SS) in GMT. See here for a converter: https://www.worldtimebuddy.com/pst-to-gmt-converter | Pattern hint: {time, seconds optional}",
        "examples": "13:33 or 13:33:55",
        "pattern": "^([01]?\\d|2[0-3]|24(?=:00?:00?$)):([0-5]\\d)(:([0-5]\\d))?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "start_time_inc"
            }
          ]
        }
      },
      {
        "fieldName": "depth, meters",
        "capitalize": "",
        "ontology_id": "mixs_modified:depth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The vertical distance below local surface, e.g. For sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.",
        "guidance": "All depths must be reported in meters. Provide the numerical portion only. | Pattern hint: {float}| {float}-{float}",
        "examples": "0-0.1 OR 1",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "depth"
            }
          ]
        }
      },
      {
        "fieldName": "sample material processing",
        "capitalize": "",
        "ontology_id": "mixs_modified:sample_processing",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "A brief description of any processing applied to the sample during or after retrieving the sample from environment, or a link to the relevant protocol(s) performed.",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_processing"
            }
          ]
        }
      },
      {
        "fieldName": "sample collection device",
        "capitalize": "",
        "ontology_id": "mixs_modified:sample_collection_dev",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The device used to collect an environmental sample. This field accepts terms listed under environmental sampling device (http://purl.obolibrary.org/obo/ENVO). This field also accepts terms listed under specimen collection device (http://purl.obolibrary.org/obo/GENEPIO_0002094).",
        "guidance": "Report dimensions and details when applicable | Pattern hint: {termLabel} {[termID]}|{text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_collection_dev"
            }
          ]
        }
      },
      {
        "fieldName": "sample collection method",
        "capitalize": "",
        "ontology_id": "mixs_modified:sample_collection_method",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The method employed for collecting the sample.",
        "guidance": "This can be a citation or description | Pattern hint: {PMID}|{DOI}|{URL}|{text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_collection_method"
            }
          ]
        }
      },
      {
        "fieldName": "Filter Method",
        "capitalize": "",
        "ontology_id": "mixs_modified:filter_method",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Type of filter used or how the sample was filtered",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "filter_method"
            }
          ]
        }
      },
      {
        "fieldName": "amount or size of sample collected",
        "capitalize": "",
        "ontology_id": "mixs_modified:sample_collected",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The total amount or size (volume (ml), mass (g) or area (m2) ) of sample collected.",
        "guidance": "This refers to the TOTAL amount of sample collected from the experiment. NOT the amount sent to each institution or collected for a specific analysis. | Pattern hint: {float} {unit}",
        "examples": "5 grams; 10 mL",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sample_collected"
            }
          ]
        }
      },
      {
        "fieldName": "experimental factor- other",
        "capitalize": "",
        "ontology_id": "mixs_modified:experimental_factor_other",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Other details about your sample that you feel can't be accurately represented in the available columns.",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "experimental_factor_other"
            }
          ]
        }
      },
      {
        "fieldName": "other treatments",
        "capitalize": "",
        "ontology_id": "mixs_modified:other_treatment",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Other treatments applied to your samples that are not applicable to the provided fields",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "other_treatment"
            }
          ]
        }
      },
      {
        "fieldName": "isotope exposure/addition",
        "capitalize": "",
        "ontology_id": "mixs_modified:isotope_exposure",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "List isotope exposure or addition applied to your sample.",
        "guidance": "Pattern hint: {termLabel} {[termID]}; {timestamp}",
        "examples": "",
        "pattern": "^\\S+.*\\S+ \\[ENVO:\\d+\\]; ([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "isotope_exposure"
            }
          ]
        }
      },
      {
        "fieldName": "pH",
        "capitalize": "",
        "ontology_id": "mixs_modified:pH",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "0.0",
        "xs:maxInclusive": "14.0",
        "requirement": "recommended",
        "description": "pH measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
        "guidance": "Pattern hint: {float}",
        "examples": "7.2",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "pH"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Required Where Applicable",
    "children": [
      {
        "fieldName": "composite design/sieving",
        "capitalize": "",
        "ontology_id": "MIXS:0000322",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
        "guidance": "Pattern hint: {{text}|{float} {unit}};{float} {unit}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "sieving"
            }
          ]
        }
      },
      {
        "fieldName": "size-fraction lower threshold",
        "capitalize": "",
        "ontology_id": "MIXS:0000735",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
        "guidance": "",
        "examples": "0.2 micrometer",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "size_frac_low"
            }
          ]
        }
      },
      {
        "fieldName": "size-fraction upper threshold",
        "capitalize": "",
        "ontology_id": "MIXS:0000736",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
        "guidance": "",
        "examples": "20 micrometer",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "size_frac_up"
            }
          ]
        }
      },
      {
        "fieldName": "biotic regimen",
        "capitalize": "",
        "ontology_id": "MIXS:0001038",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Information about treatment(s) involving use of biotic factors, such as bacteria, viruses or fungi.",
        "guidance": "Pattern hint: {text}",
        "examples": "sample inoculated with Rhizobium spp. Culture",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "biotic_regm"
            }
          ]
        }
      },
      {
        "fieldName": "air temperature regimen",
        "capitalize": "",
        "ontology_id": "MIXS:0000551",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Information about treatment involving an exposure to varying temperatures; should include the temperature, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include different temperature regimens",
        "guidance": "Pattern hint: {float} {unit};{Rn/start_time/end_time/duration}",
        "examples": "25 degree Celsius;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "air_temp_regm"
            }
          ]
        }
      },
      {
        "fieldName": "chemical administration",
        "capitalize": "",
        "ontology_id": "MIXS:0000751",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi",
        "guidance": "Pattern hint: {termLabel} {[termID]};{timestamp}",
        "examples": "agar [CHEBI:2509];2018-05-11T20:00Z",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "chem_administration"
            }
          ]
        }
      },
      {
        "fieldName": "climate environment",
        "capitalize": "",
        "ontology_id": "MIXS:0001040",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Treatment involving an exposure to a particular climate; treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple climates",
        "guidance": "Pattern hint: {text};{Rn/start_time/end_time/duration}",
        "examples": "tropical climate;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "climate_environment"
            }
          ]
        }
      },
      {
        "fieldName": "gaseous environment",
        "capitalize": "",
        "ontology_id": "MIXS:0000558",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Use of conditions with differing gaseous environments; should include the name of gaseous compound, amount administered, treatment duration, interval and total experimental duration; can include multiple gaseous environment regimens",
        "guidance": "Pattern hint: {text};{float} {unit};{Rn/start_time/end_time/duration}",
        "examples": "nitric oxide;0.5 micromole per liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "gaseous_environment"
            }
          ]
        }
      },
      {
        "fieldName": "humidity regimen",
        "capitalize": "",
        "ontology_id": "MIXS:0000568",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Information about treatment involving an exposure to varying degree of humidity; information about treatment involving use of growth hormones; should include amount of humidity administered, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
        "guidance": "Pattern hint: {float} {unit};{Rn/start_time/end_time/duration}",
        "examples": "25 gram per cubic meter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "humidity_regm"
            }
          ]
        }
      },
      {
        "fieldName": "light regimen",
        "capitalize": "",
        "ontology_id": "MIXS:0000569",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Information about treatment(s) involving exposure to light, including both light intensity and quality.",
        "guidance": "Pattern hint: {text};{float} {unit};{float} {unit}",
        "examples": "incandescant light;10 lux;450 nanometer",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "light_regm"
            }
          ]
        }
      },
      {
        "fieldName": "watering regimen",
        "capitalize": "",
        "ontology_id": "MIXS:0000591",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Information about treatment involving an exposure to watering frequencies, treatment regimen including how many times the treatment was repeated, how long each treatment lasted, and the start and end time of the entire treatment; can include multiple regimens",
        "guidance": "Pattern hint: {float} {unit};{Rn/start_time/end_time/duration}",
        "examples": "1 liter;R2/2018-05-11T14:30/2018-05-11T19:30/P1H30M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "watering_regm"
            }
          ]
        }
      },
      {
        "fieldName": "altitude",
        "capitalize": "",
        "ontology_id": "MIXS:0000094",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
        "guidance": "",
        "examples": "100 meter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "alt"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Modified Optional",
    "children": [
      {
        "fieldName": "observed biotic relationship",
        "capitalize": "",
        "ontology_id": "mixs_modified:samp_biotic_relationship",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Description of relationship(s) between the subject organism and other organism(s) it is associated with. E.g., parasite on species X; mutualist with species Y. The target organism is the subject of the relationship, and the other organism(s) is the object",
        "guidance": "Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "samp_biotic_relationship"
            }
          ]
        },
        "schema:ItemList": {
          "commensalism": {},
          "free living": {},
          "mutualism": {},
          "parasitism": {},
          "symbiotic": {}
        }
      },
      {
        "fieldName": "relationship to oxygen",
        "capitalize": "",
        "ontology_id": "mixs_modified:oxygen_relationship",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Is this organism an aerobe, anaerobe? Please note that aerobic and anaerobic are valid descriptors for microbial environments",
        "guidance": "Pattern hint: enumeration",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "oxygen_relationship"
            }
          ]
        },
        "schema:ItemList": {
          "aerobe": {},
          "anaerobe": {},
          "facultative": {},
          "microaerophilic": {},
          "microanaerobe": {},
          "obligate aerobe": {},
          "obligate anaerobe": {}
        }
      },
      {
        "fieldName": "non-microbial biomass",
        "capitalize": "",
        "ontology_id": "mixs_modified:non_microb_biomass",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Amount of biomass; should include the name for the part of biomass measured, e.g.insect, plant, total. Can include multiple measurements separated by ;",
        "guidance": "Pattern hint: {text};{float} {unit}",
        "examples": "",
        "pattern": "^\\S*;[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "non_microb_biomass"
            }
          ]
        }
      },
      {
        "fieldName": "non-microbial biomass method",
        "capitalize": "",
        "ontology_id": "mixs_modified:non_microb_biomass_method",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining biomass",
        "guidance": "required if \"non-microbial biomass\" is provided | Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "non_microb_biomass_method"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass carbon",
        "capitalize": "",
        "ontology_id": "mixs_modified:microbial_biomass_C",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
        "guidance": "Pattern hint: {float} {unit}",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "microbial_biomass_C"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass carbon method",
        "capitalize": "",
        "ontology_id": "mixs_modified:micro_biomass_C_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass",
        "guidance": "required if \"microbial_biomass_C\" is provided | Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "micro_biomass_C_meth"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass nitrogen",
        "capitalize": "",
        "ontology_id": "mixs_modified:microbial_biomass_N",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
        "guidance": "Pattern hint: {float} {unit}",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "microbial_biomass_N"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass nitrogen method",
        "capitalize": "",
        "ontology_id": "mixs_modified:micro_biomass_N_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass nitrogen",
        "guidance": "required if \"microbial_biomass_N\" is provided | Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "micro_biomass_N_meth"
            }
          ]
        }
      },
      {
        "fieldName": "organic nitrogen method",
        "capitalize": "",
        "ontology_id": "mixs_modified:org_nitro_method",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Method used for obtaining organic nitrogen",
        "guidance": "required if \"org_nitro\" is provided | Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "org_nitro_method"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Metadata- MIxS Optional",
    "children": [
      {
        "fieldName": "slope aspect",
        "capitalize": "",
        "ontology_id": "MIXS:0000647",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "slope_aspect"
            }
          ]
        }
      },
      {
        "fieldName": "history/agrochemical additions",
        "capitalize": "",
        "ontology_id": "MIXS:0000639",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
        "guidance": "Pattern hint: {text};{float} {unit};{timestamp}",
        "examples": "roundup;5 milligram per liter;2018-06-21",
        "pattern": "^\\S+.*\\S+;[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+;([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "agrochem_addition"
            }
          ]
        }
      },
      {
        "fieldName": "extreme_unusual_properties/Al saturation",
        "capitalize": "",
        "ontology_id": "MIXS:0000607",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Aluminum saturation (esp. For tropical soils)",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "al_sat"
            }
          ]
        }
      },
      {
        "fieldName": "extreme_unusual_properties/Al saturation method",
        "capitalize": "",
        "ontology_id": "MIXS:0000324",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining Al saturation",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "al_sat_meth"
            }
          ]
        }
      },
      {
        "fieldName": "mean annual precipitation",
        "capitalize": "",
        "ontology_id": "MIXS:0000644",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "annual_precpt"
            }
          ]
        }
      },
      {
        "fieldName": "mean annual temperature",
        "capitalize": "",
        "ontology_id": "MIXS:0000642",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean annual temperature",
        "guidance": "",
        "examples": "12.5 degree Celsius",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "annual_temp"
            }
          ]
        }
      },
      {
        "fieldName": "history/crop rotation",
        "capitalize": "",
        "ontology_id": "MIXS:0000318",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Whether or not crop is rotated, and if yes, rotation schedule",
        "guidance": "Pattern hint: {boolean};{Rn/start_time/end_time/duration}",
        "examples": "yes;R2/2017-01-01/2018-12-31/P6M",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "crop_rotation"
            }
          ]
        }
      },
      {
        "fieldName": "current land use",
        "capitalize": "",
        "ontology_id": "MIXS:0001080",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Present state of sample site",
        "guidance": "",
        "examples": "conifers",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "cur_land_use"
            }
          ]
        },
        "schema:ItemList": {
          "badlands": {},
          "cities": {},
          "conifers (e.g. pine,spruce,fir,cypress)": {},
          "crop trees (nuts,fruit,christmas trees,nursery trees)": {},
          "farmstead": {},
          "gravel": {},
          "hardwoods (e.g. oak,hickory,elm,aspen)": {},
          "hayland": {},
          "horticultural plants (e.g. tulips)": {},
          "industrial areas": {},
          "intermixed hardwood and conifers": {},
          "marshlands (grass,sedges,rushes)": {},
          "meadows (grasses,alfalfa,fescue,bromegrass,timothy)": {},
          "mines/quarries": {},
          "mudflats": {},
          "oil waste areas": {},
          "pastureland (grasslands used for livestock grazing)": {},
          "permanent snow or ice": {},
          "rainforest (evergreen forest receiving >406 cm annual rainfall)": {},
          "rangeland": {},
          "roads/railroads": {},
          "rock": {},
          "row crops": {},
          "saline seeps": {},
          "salt flats": {},
          "sand": {},
          "shrub crops (blueberries,nursery ornamentals,filberts)": {},
          "shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)": {},
          "small grains": {},
          "successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)": {},
          "swamp (permanent or semi-permanent water body dominated by woody plants)": {},
          "tropical (e.g. mangrove,palms)": {},
          "tundra (mosses,lichens)": {},
          "vegetable crops": {},
          "vine crops (grapes)": {}
        }
      },
      {
        "fieldName": "current vegetation",
        "capitalize": "",
        "ontology_id": "MIXS:0000312",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "cur_vegetation"
            }
          ]
        }
      },
      {
        "fieldName": "current vegetation method",
        "capitalize": "",
        "ontology_id": "MIXS:0000314",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in vegetation classification",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "cur_vegetation_meth"
            }
          ]
        }
      },
      {
        "fieldName": "drainage classification",
        "capitalize": "",
        "ontology_id": "MIXS:0001085",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Drainage classification from a standard system such as the USDA system",
        "guidance": "",
        "examples": "well",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "drainage_class"
            }
          ]
        },
        "schema:ItemList": {
          "excessively drained": {},
          "moderately well": {},
          "poorly": {},
          "somewhat poorly": {},
          "very poorly": {},
          "well": {}
        }
      },
      {
        "fieldName": "experimental factor",
        "capitalize": "",
        "ontology_id": "MIXS:0000008",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Experimental factors are essentially the variable aspects of an experiment design which can be used to describe an experiment, or set of experiments, in an increasingly detailed manner. This field accepts ontology terms from Experimental Factor Ontology (EFO) and/or Ontology for Biomedical Investigations (OBI). For a browser of EFO (v 2.95) terms, please see http://purl.bioontology.org/ontology/EFO; for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI",
        "guidance": "Pattern hint: {termLabel} {[termID]}|{text}",
        "examples": "time series design [EFO:EFO_0001779]",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "experimental_factor"
            }
          ]
        }
      },
      {
        "fieldName": "history/extreme events",
        "capitalize": "",
        "ontology_id": "MIXS:0000320",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Unusual physical events that may have affected microbial populations",
        "guidance": "",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "extreme_event"
            }
          ]
        }
      },
      {
        "fieldName": "soil_taxonomic/FAO classification",
        "capitalize": "",
        "ontology_id": "MIXS:0001083",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
        "guidance": "",
        "examples": "Luvisols",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "fao_class"
            }
          ]
        },
        "schema:ItemList": {
          "Acrisols": {},
          "Andosols": {},
          "Arenosols": {},
          "Cambisols": {},
          "Chernozems": {},
          "Ferralsols": {},
          "Fluvisols": {},
          "Gleysols": {},
          "Greyzems": {},
          "Gypsisols": {},
          "Histosols": {},
          "Kastanozems": {},
          "Lithosols": {},
          "Luvisols": {},
          "Nitosols": {},
          "Phaeozems": {},
          "Planosols": {},
          "Podzols": {},
          "Podzoluvisols": {},
          "Rankers": {},
          "Regosols": {},
          "Rendzinas": {},
          "Solonchaks": {},
          "Solonetz": {},
          "Vertisols": {},
          "Yermosols": {}
        }
      },
      {
        "fieldName": "history/fire",
        "capitalize": "",
        "ontology_id": "MIXS:0001086",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Historical and/or physical evidence of fire",
        "guidance": "",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "fire"
            }
          ]
        }
      },
      {
        "fieldName": "history/flooding",
        "capitalize": "",
        "ontology_id": "MIXS:0000319",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Historical and/or physical evidence of flooding",
        "guidance": "",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "flooding"
            }
          ]
        }
      },
      {
        "fieldName": "extreme_unusual_properties/heavy metals",
        "capitalize": "",
        "ontology_id": "MIXS:0000652",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.",
        "guidance": "Pattern hint: {text};{float} {unit}",
        "examples": "mercury;0.09 micrograms per gram",
        "pattern": "^\\S*;[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "heavy_metals"
            }
          ]
        }
      },
      {
        "fieldName": "extreme_unusual_properties/heavy metals method",
        "capitalize": "",
        "ontology_id": "MIXS:0000343",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining heavy metals",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "heavy_metals_meth"
            }
          ]
        }
      },
      {
        "fieldName": "horizon method",
        "capitalize": "",
        "ontology_id": "MIXS:0000321",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the horizon",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "horizon_meth"
            }
          ]
        }
      },
      {
        "fieldName": "link to classification information",
        "capitalize": "",
        "ontology_id": "MIXS:0000329",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Link to digitized soil maps or other soil classification information",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "link_class_info"
            }
          ]
        }
      },
      {
        "fieldName": "link to climate information",
        "capitalize": "",
        "ontology_id": "MIXS:0000328",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Link to climate resource",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "link_climate_info"
            }
          ]
        }
      },
      {
        "fieldName": "soil_taxonomic/local classification",
        "capitalize": "",
        "ontology_id": "MIXS:0000330",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Soil classification based on local soil classification system",
        "guidance": "Pattern hint: {text}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "local_class"
            }
          ]
        }
      },
      {
        "fieldName": "soil_taxonomic/local classification method",
        "capitalize": "",
        "ontology_id": "MIXS:0000331",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the local soil classification",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "local_class_meth"
            }
          ]
        }
      },
      {
        "fieldName": "miscellaneous parameter",
        "capitalize": "",
        "ontology_id": "MIXS:0000752",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Any other measurement performed or parameter collected, that is not listed here",
        "guidance": "Pattern hint: {text};{float} {unit}",
        "examples": "Bicarbonate ion concentration;2075 micromole per kilogram",
        "pattern": "^\\S*;[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "misc_param"
            }
          ]
        }
      },
      {
        "fieldName": "oxygenation status of sample",
        "capitalize": "",
        "ontology_id": "MIXS:0000753",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Oxygenation status of sample",
        "guidance": "",
        "examples": "aerobic",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "oxy_stat_samp"
            }
          ]
        },
        "schema:ItemList": {
          "aerobic": {},
          "anaerobic": {},
          "other": {}
        }
      },
      {
        "fieldName": "history/previous land use method",
        "capitalize": "",
        "ontology_id": "MIXS:0000316",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining previous land use and dates",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "prev_land_use_meth"
            }
          ]
        }
      },
      {
        "fieldName": "history/previous land use",
        "capitalize": "",
        "ontology_id": "MIXS:0000315",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Previous land use and dates",
        "guidance": "Pattern hint: {text};{timestamp}",
        "examples": "",
        "pattern": "^\\S+.*\\S+;([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "previous_land_use"
            }
          ]
        }
      },
      {
        "fieldName": "profile position",
        "capitalize": "",
        "ontology_id": "MIXS:0001084",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
        "guidance": "",
        "examples": "summit",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "profile_position"
            }
          ]
        },
        "schema:ItemList": {
          "backslope": {},
          "footslope": {},
          "shoulder": {},
          "summit": {},
          "toeslope": {}
        }
      },
      {
        "fieldName": "mean seasonal precipitation",
        "capitalize": "",
        "ontology_id": "MIXS:0000645",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "season_precpt"
            }
          ]
        }
      },
      {
        "fieldName": "mean seasonal temperature",
        "capitalize": "",
        "ontology_id": "MIXS:0000643",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean seasonal temperature",
        "guidance": "",
        "examples": "18 degree Celsius",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "season_temp"
            }
          ]
        }
      },
      {
        "fieldName": "slope gradient",
        "capitalize": "",
        "ontology_id": "MIXS:0000646",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "slope_gradient"
            }
          ]
        }
      },
      {
        "fieldName": "soil horizon",
        "capitalize": "",
        "ontology_id": "MIXS:0001082",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
        "guidance": "",
        "examples": "A horizon",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "soil_horizon"
            }
          ]
        },
        "schema:ItemList": {
          "A horizon": {},
          "B horizon": {},
          "C horizon": {},
          "E horizon": {},
          "O horizon": {},
          "Permafrost": {},
          "R layer": {}
        }
      },
      {
        "fieldName": "soil texture measurement",
        "capitalize": "",
        "ontology_id": "MIXS:0000335",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "soil_text_measure"
            }
          ]
        }
      },
      {
        "fieldName": "soil texture method",
        "capitalize": "",
        "ontology_id": "MIXS:0000336",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil texture",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "soil_texture_meth"
            }
          ]
        }
      },
      {
        "fieldName": "soil type",
        "capitalize": "",
        "ontology_id": "MIXS:0000332",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.",
        "guidance": "Pattern hint: {termLabel} {[termID]}",
        "examples": "plinthosol [ENVO:00002250]",
        "pattern": "^\\S+.*\\S+ \\[ENVO:\\d+\\]$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "soil_type"
            }
          ]
        }
      },
      {
        "fieldName": "soil type method",
        "capitalize": "",
        "ontology_id": "MIXS:0000334",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil series name or other lower-level classification",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "soil_type_meth"
            }
          ]
        }
      },
      {
        "fieldName": "temperature",
        "capitalize": "",
        "ontology_id": "MIXS:0000113",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Temperature of the sample at the time of sampling.",
        "guidance": "",
        "examples": "25 degree Celsius",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "temp"
            }
          ]
        }
      },
      {
        "fieldName": "history/tillage",
        "capitalize": "",
        "ontology_id": "MIXS:0001081",
        "datatype": "multiple",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Note method(s) used for tilling",
        "guidance": "",
        "examples": "chisel",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tillage"
            }
          ]
        },
        "schema:ItemList": {
          "chisel": {},
          "cutting disc": {},
          "disc plough": {},
          "drill": {},
          "mouldboard": {},
          "ridge till": {},
          "strip tillage": {},
          "tined": {},
          "zonal tillage": {}
        }
      },
      {
        "fieldName": "water content",
        "capitalize": "",
        "ontology_id": "MIXS:0000185",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Water content measurement",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "water_content"
            }
          ]
        }
      },
      {
        "fieldName": "water content method",
        "capitalize": "",
        "ontology_id": "MIXS:0000323",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the water content of soil",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "water_cont_soil_meth"
            }
          ]
        }
      },
      {
        "fieldName": "pH method",
        "capitalize": "",
        "ontology_id": "MIXS:0001106",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining ph",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "ph_meth"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass",
        "capitalize": "",
        "ontology_id": "MIXS:0000650",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "microbial_biomass"
            }
          ]
        }
      },
      {
        "fieldName": "microbial biomass method",
        "capitalize": "",
        "ontology_id": "MIXS:0000339",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "micro_biomass_meth"
            }
          ]
        }
      },
      {
        "fieldName": "carbon/nitrogen ratio",
        "capitalize": "",
        "ontology_id": "MIXS:0000310",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ratio of amount or concentrations of carbon to nitrogen",
        "guidance": "",
        "examples": "0.417361111",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "carb_nitro_ratio"
            }
          ]
        }
      },
      {
        "fieldName": "organic matter",
        "capitalize": "",
        "ontology_id": "MIXS:0000204",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of organic matter",
        "guidance": "",
        "examples": "1.75 milligram per cubic meter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "org_matter"
            }
          ]
        }
      },
      {
        "fieldName": "organic nitrogen",
        "capitalize": "",
        "ontology_id": "MIXS:0000205",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of organic nitrogen",
        "guidance": "",
        "examples": "4 micromole per liter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "org_nitro"
            }
          ]
        }
      },
      {
        "fieldName": "total carbon",
        "capitalize": "",
        "ontology_id": "MIXS:0000525",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total carbon content",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_carb"
            }
          ]
        }
      },
      {
        "fieldName": "total nitrogen content",
        "capitalize": "",
        "ontology_id": "MIXS:0000530",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total nitrogen content of the sample",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_nitro_content"
            }
          ]
        }
      },
      {
        "fieldName": "total nitrogen content method",
        "capitalize": "",
        "ontology_id": "MIXS:0000338",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the total nitrogen",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_nitro_cont_meth"
            }
          ]
        }
      },
      {
        "fieldName": "total organic carbon",
        "capitalize": "",
        "ontology_id": "MIXS:0000533",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
        "guidance": "",
        "examples": "",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_org_carb"
            }
          ]
        }
      },
      {
        "fieldName": "total organic carbon method",
        "capitalize": "",
        "ontology_id": "MIXS:0000337",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining total organic carbon",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_org_c_meth"
            }
          ]
        }
      },
      {
        "fieldName": "total phosphorus",
        "capitalize": "",
        "ontology_id": "MIXS:0000117",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus",
        "guidance": "",
        "examples": "0.03 milligram per liter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "tot_phosp"
            }
          ]
        }
      },
      {
        "fieldName": "phosphate",
        "capitalize": "",
        "ontology_id": "MIXS:0000505",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of phosphate",
        "guidance": "",
        "examples": "0.7 micromole per liter",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "phosphate"
            }
          ]
        }
      },
      {
        "fieldName": "salinity",
        "capitalize": "",
        "ontology_id": "MIXS:0000183",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The total concentration of all dissolved salts in a liquid or solid sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater.",
        "guidance": "",
        "examples": "25 practical salinity unit",
        "pattern": "^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)? \\S+$",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "salinity"
            }
          ]
        }
      },
      {
        "fieldName": "salinity method",
        "capitalize": "",
        "ontology_id": "MIXS:0000341",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining salinity",
        "guidance": "Pattern hint: {PMID}|{DOI}|{URL}",
        "examples": "",
        "exportField": {
          "soil_emsl_jgi_mg": [
            {
              "field": "salinity_meth"
            }
          ]
        }
      }
    ]
  }
]