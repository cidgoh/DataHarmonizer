var DATA = [
  {
    "fieldName": "Database Identifiers",
    "children": [
      {
        "fieldName": "specimen collector sample ID",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001123",
        "datatype": "xs:unique",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The user-defined name for the sample.",
        "guidance": "Store the collector sample ID. If this number is considered identifiable information, provide an alternative ID. Be sure to store the key that maps between the original and alternative IDs for traceability and follow up if necessary. Every collector sample ID from a single submitter must be unique. It can have any format, but we suggest that you make it concise, unique and consistent within your lab.",
        "examples": "prov_rona_99",
        "exportField": {
          "GISAID": [
            {
              "field": "Sample ID given by the sample provider"
            }
          ],
          "CNPHI": [
            {
              "field": "Primary Specimen ID"
            }
          ],
          "NML_LIMS": [
            {
              "field": "TEXT_ID"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "sample_name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "specimen collector sample ID"
            }
          ]
        }
      },
      {
        "fieldName": "third party lab service provider name",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001202",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the third party company or laboratory that provided services.",
        "guidance": "Store the sample identifier supplied by the third party services provider.",
        "examples": "Switch Health",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "VD_LAB_NUMBER"
            }
          ]
        }
      },
      {
        "fieldName": "third party lab sample ID",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001149",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The identifier assigned to a sample by a third party service provider.",
        "guidance": "",
        "examples": "SHK123456",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "third party lab sample ID"
            }
          ]
        }
      },
      {
        "fieldName": "NML submitted specimen primary ID",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001125",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The primary ID of the specimen submitted thorough the National Microbiology Laboratory (NML) LaSER.",
        "guidance": "Store the identifier for the specimen submitted through the NML LaSER system.",
        "examples": "SR20-12345",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "NML submitted specimen primary ID"
            }
          ]
        }
      },
      {
        "fieldName": "NML related specimen primary ID",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001128",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The primary ID of the related specimen previously submitted thorough the National Microbiology Laboratory (NML) LaSER.",
        "guidance": "Store the primary ID of the related specimen previously submitted thorough LaSER",
        "examples": "SR20-12345",
        "exportField": {
          "CNPHI": [
            {
              "field": "Related Specimen ID"
            },
            {
              "field": "Related Specimen Relationship Type"
            }
          ],
          "NML_LIMS": [
            {
              "field": "NML related specimen primary ID"
            }
          ]
        }
      },
      {
        "fieldName": "IRIDA sample name",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001131",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The identifier assigned to a sequenced isolate in IRIDA.",
        "guidance": "Store the IRIDA sample name. The IRIDA sample name will be created by the individual entering data into the IRIDA platform. IRIDA samples may be linked to metadata and sequence data, or just metadata alone. It is recommended that the IRIDA sample name be the same as, or contain, the specimen collector sample ID for better traceability. It is also recommended that the IRIDA sample name mirror the GISAID accession. IRIDA sample names cannot contain slashes. Slashes should be replaced by underscores. See IRIDA documentation for more information regarding special characters (https://irida.corefacility.ca/documentation/user/user/samples/#adding-a-new-sample). ",
        "examples": "prov_rona_99",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "IRIDA sample name"
            }
          ]
        }
      },
      {
        "fieldName": "umbrella bioproject accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001133",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The INSDC accession number assigned to the umbrella BioProject for the Canadian SARS-CoV-2 sequencing effort.",
        "guidance": "Store the umbrella BioProject accession by selecting it from the picklist in the template. The umbrella BioProject accession will be identical for all CanCOGen submitters. Different provinces will have their own BioProjects, however these BioProjects will be linked under one umbrella BioProject.",
        "examples": "PRJNA623807",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "umbrella bioproject accession"
            }
          ]
        },
        "schema:ItemList": {
          "PRJNA623807": {}
        }
      },
      {
        "fieldName": "bioproject accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001136",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The INSDC accession number of the BioProject(s) to which the BioSample belongs.",
        "guidance": "Store the BioProject accession number. BioProjects are an organizing tool that links together raw sequence data, assemblies, and their associated metadata. Each province will be assigned a different bioproject accession number by the National Microbiology Lab. A valid NCBI BioProject accession has prefix PRJN e.g., PRJNA12345, and is created once at the beginning of a new sequencing project. ",
        "examples": "PRJNA608651",
        "exportField": {
          "CNPHI": [
            {
              "field": "BioProject Accession"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_BIOPROJECT_ACCESSION"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "bioproject_accession"
            }
          ]
        }
      },
      {
        "fieldName": "biosample accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001139",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The identifier assigned to a BioSample in INSDC archives.",
        "guidance": "Store the accession returned from the BioSample submission. NCBI BioSamples will have the prefix SAMN.",
        "examples": "SAMN14180202",
        "exportField": {
          "CNPHI": [
            {
              "field": "BioSample Accession"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_BIOSAMPLE_ACCESSION"
            }
          ]
        }
      },
      {
        "fieldName": "SRA accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001142",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The Sequence Read Archive (SRA) identifier linking raw read data, methodological metadata and quality control metrics submitted to the INSDC.",
        "guidance": "Store the accession assigned to the submitted \"run\". NCBI-SRA accessions start with SRR.",
        "examples": "SRR11177792",
        "exportField": {
          "CNPHI": [
            {
              "field": "SRA Accession"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_SRA_ACCESSION"
            }
          ]
        }
      },
      {
        "fieldName": "GenBank accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001145",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The GenBank identifier assigned to the sequence in the INSDC archives.",
        "guidance": "Store the accession returned from a GenBank submission (viral genome assembly).",
        "examples": "MN908947.3",
        "exportField": {
          "CNPHI": [
            {
              "field": "GenBank Accession"
            }
          ],
          "NML_LIMS": [
            {
              "field": "GenBank accession"
            }
          ]
        }
      },
      {
        "fieldName": "GISAID accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO_0001147",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The GISAID accession number assigned to the sequence.",
        "guidance": "Store the accession returned from the GISAID submission.",
        "examples": "EPI_ISL_436489",
        "exportField": {
          "CNPHI": [
            {
              "field": "GISAID Accession (if known)"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMISSIONS - GISAID Accession ID"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "GISAID_accession"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Sample collection and processing",
    "children": [
      {
        "fieldName": "sample collected by",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001153",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The name of the agency that collected the original sample.",
        "guidance": "The name of the sample collector should be written out in full, (with minor exceptions) and be consistent across multple submissions e.g. Public Health Agency of Canada, Public Health Ontario, BC Centre for Disease Control. The sample collector specified is at the discretion of the data provider (i.e. may be hospital, provincial public health lab, or other).",
        "examples": "BC Centre for Disease Control",
        "exportField": {
          "GISAID": [
            {
              "field": "Originating lab"
            }
          ],
          "CNPHI": [
            {
              "field": "Lab Name"
            }
          ],
          "NML_LIMS": [
            {
              "field": "CUSTOMER"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "collected_by"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sample collected by"
            }
          ]
        },
        "schema:ItemList": {
          "National Microbiology Laboratory (NML)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_NML_IRV"
                }
              ]
            }
          },
          "BCCDC Public Health Laboratory": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_BCCDC"
                }
              ]
            }
          },
          "Alberta Precision Labs (APL)": {
            "schema:ItemList": {
              "Alberta ProvLab North (APLN)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "CANCOGEN_EDMONTON_PROV_LAB"
                    }
                  ]
                }
              },
              "Alberta ProvLab South (APLS)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "APL-C"
                    }
                  ]
                }
              }
            }
          },
          "Public Health Ontario (PHO)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_ONTARIO_PHO"
                }
              ]
            }
          },
          "Laboratoire de sant\u00e9 publique du Qu\u00e9bec (LSPQ)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_LSPQ"
                }
              ]
            }
          },
          "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_ROMANOW_PROV_LAB"
                }
              ]
            }
          },
          "Manitoba Cadham Provincial Laboratory": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_CADHAM_LAB"
                }
              ]
            }
          },
          "Nova Scotia Health Authority": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_QEII_HSC"
                }
              ]
            }
          },
          "New Brunswick - Vitalit\u00e9 Health Network": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_G_L_DUMONT"
                }
              ]
            }
          },
          "Newfoundland and Labrador - Eastern Health": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_STJOHNS_PHL"
                }
              ]
            }
          },
          "Nunuvut": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_NUNAVUT_"
                }
              ]
            }
          },
          "Prince Edward Island - Health PEI": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_QEH"
                }
              ]
            }
          },
          "Ontario Institute for Cancer Research (OICR)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Ontario Institute for Cancer Research (OICR)"
                }
              ]
            }
          },
          "McMaster University": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANCOGEN_MCMASTER_UNIVERSITY"
                }
              ]
            }
          },
          "William Osler Health System": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "William Osler Health System"
                }
              ]
            }
          },
          "Sunnybrook Health Sciences Centre": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Sunnybrook Health Sciences Centre"
                }
              ]
            }
          },
          "Eastern Ontario Regional Laboratory Association": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Eastern Ontario Regional Laboratory Association"
                }
              ]
            }
          },
          "St. John's Rehab at Sunnybrook Hospital": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "St. John's Rehab at Sunnybrook Hospital"
                }
              ]
            }
          },
          "Mount Sinai Hospital": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Mount Sinai Hospital"
                }
              ]
            }
          },
          "Hamilton Health Sciences": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Hamilton Health Sciences"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "sample collector contact email",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001156",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The email address of the contact responsible for follow-up regarding the sample.",
        "guidance": "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca",
        "examples": "RespLab@lab.ca",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "sample collector contact email"
            }
          ]
        }
      },
      {
        "fieldName": "sample collector contact address",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001158",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The mailing address of the agency submitting the sample.",
        "guidance": "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country",
        "examples": "655 Lab St, Vancouver, British Columbia, V5N 2A2, Canada",
        "exportField": {
          "GISAID": [
            {
              "field": "Address"
            }
          ],
          "NML_LIMS": [
            {
              "field": "sample collector contact address"
            }
          ]
        }
      },
      {
        "fieldName": "sequence submitted by",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001159",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The name of the agency that generated the sequence.",
        "guidance": "The name of the agency should be written out in full, (with minor exceptions) and be consistent across multple submissions. If submitting specimens rather than sequencing data, please put the \"National Microbiology Laboratory (NML)\".",
        "examples": "Public Health Ontario (PHO)",
        "exportField": {
          "GISAID": [
            {
              "field": "Submitting lab"
            }
          ],
          "CNPHI": [
            {
              "field": "Sequencing Centre"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_SEQUENCING_CENTRE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "sequenced_by"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sequence submitted by"
            }
          ]
        },
        "schema:ItemList": {
          "National Microbiology Laboratory (NML)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NML"
                }
              ]
            }
          },
          "BCCDC Public Health Laboratory": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BCCDC"
                }
              ]
            }
          },
          "Alberta Precision Labs (APL)": {
            "schema:ItemList": {
              "Alberta ProvLab North (APLN)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "APL-E"
                    }
                  ]
                }
              },
              "Alberta ProvLab South (APLS)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "APL-C"
                    }
                  ]
                }
              }
            }
          },
          "Public Health Ontario (PHO)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PHO"
                }
              ]
            }
          },
          "Laboratoire de sant\u00e9 publique du Qu\u00e9bec (LSPQ)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LSPQ"
                }
              ]
            }
          },
          "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RRPL"
                }
              ]
            }
          },
          "Manitoba Cadham Provincial Laboratory": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CADHAM"
                }
              ]
            }
          },
          "Nova Scotia Health Authority": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NS_QE_II"
                }
              ]
            }
          },
          "New Brunswick - Vitalit\u00e9 Health Network": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GEORGES_L_DUMONT"
                }
              ]
            }
          },
          "Newfoundland and Labrador - Eastern Health": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "EASTERN_HEALTH"
                }
              ]
            }
          },
          "Prince Edward Island - Health PEI": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PEI"
                }
              ]
            }
          },
          "Ontario Institute for Cancer Research (OICR)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "OICR"
                }
              ]
            }
          },
          "McMaster University": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MCMASTER"
                }
              ]
            }
          },
          "McGill University": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MCGILL"
                }
              ]
            }
          },
          "The Centre for Applied Genomics (TCAG)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TCAG"
                }
              ]
            }
          },
          "Sunnybrook Health Sciences Centre": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SUNNYBROOK"
                }
              ]
            }
          },
          "Thunder Bay Regional Health Sciences Centre": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "THUNDER_BAY"
                }
              ]
            }
          },
          "Canadore College": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CANADORE"
                }
              ]
            }
          },
          "Queen\u2019s University / Kingston Health Sciences Centre": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "QUEENS_UNIV"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "sequence submitter contact email",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001165",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The email address of the contact responsible for follow-up regarding the sequence.",
        "guidance": "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca",
        "examples": "RespLab@lab.ca",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "sequence submitter contact email"
            }
          ]
        }
      },
      {
        "fieldName": "sequence submitter contact address",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001167",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The mailing address of the agency submitting the sequence.",
        "guidance": "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country",
        "examples": "123 Sunnybrooke St, Toronto, Ontario, M4P 1L6, Canada",
        "exportField": {
          "GISAID": [
            {
              "field": "Address"
            }
          ],
          "NML_LIMS": [
            {
              "field": "sequence submitter contact address"
            }
          ]
        }
      },
      {
        "fieldName": "sample collection date",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001174",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The date on which the sample was collected.",
        "guidance": "Sample collection date is critical for surveillance and many types of analyses. Required granularity includes year, month and day. If this date is considered identifiable information, it is acceptable to add \"jitter\" by adding or subtracting a calendar day (acceptable by GISAID). Alternatively, \u201dreceived date\u201d may be used as a substitute. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2020-03-16",
        "exportField": {
          "GISAID": [
            {
              "field": "Collection date"
            }
          ],
          "CNPHI": [
            {
              "field": "Patient Sample Collected Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_COLLECT_DATE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "sample collection date"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sample collection date"
            }
          ]
        }
      },
      {
        "fieldName": "sample collection date precision",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001177",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The precision to which the \"sample collection date\" was provided.",
        "guidance": "Provide the precision of granularity to the \"day\", \"month\", or \"year\" for the date provided in the \"sample collection date\" field. The \"sample collection date\" will be truncated to the precision specified upon export; \"day\" for \"YYYY-MM-DD\", \"month\" for \"YYYY-MM\", or \"year\" for \"YYYY\".",
        "examples": "year",
        "exportField": {
          "CNPHI": [
            {
              "field": "Precision of date collected"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_TEXT2"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sample collection date precision"
            }
          ]
        },
        "schema:ItemList": {
          "year": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Year"
                }
              ]
            }
          },
          "month": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Month"
                }
              ]
            }
          },
          "day": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Day"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "sample received date",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001179",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date on which the sample was received.",
        "guidance": "ISO 8601 standard \"YYYY-MM-DD\".",
        "examples": "2020-03-20",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "sample received date"
            }
          ]
        }
      },
      {
        "fieldName": "geo_loc_name (country)",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001181",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The country where the sample was collected.",
        "guidance": "Provide the country name from the controlled vocabulary provided.",
        "examples": "Canada",
        "exportField": {
          "GISAID": [
            {
              "field": "Location"
            }
          ],
          "CNPHI": [
            {
              "field": "Patient Country"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_COUNTRY"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "geo_loc_name (country)"
            }
          ]
        },
        "schema:ItemList": {
          "Afghanistan": {},
          "Albania": {},
          "Algeria": {},
          "American Samoa": {},
          "Andorra": {},
          "Angola": {},
          "Anguilla": {},
          "Antarctica": {},
          "Antigua and Barbuda": {},
          "Argentina": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ARGENTINA"
                }
              ]
            }
          },
          "Armenia": {},
          "Aruba": {},
          "Ashmore and Cartier Islands": {},
          "Australia": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "AUSTRALIA"
                }
              ]
            }
          },
          "Austria": {},
          "Azerbaijan": {},
          "Bahamas": {},
          "Bahrain": {},
          "Baker Island": {},
          "Bangladesh": {},
          "Barbados": {},
          "Bassas da India": {},
          "Belarus": {},
          "Belgium": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BELGIUM"
                }
              ]
            }
          },
          "Belize": {},
          "Benin": {},
          "Bermuda": {},
          "Bhutan": {},
          "Bolivia": {},
          "Borneo": {},
          "Bosnia and Herzegovina": {},
          "Botswana": {},
          "Bouvet Island": {},
          "Brazil": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BRAZIL"
                }
              ]
            }
          },
          "British Virgin Islands": {},
          "Brunei": {},
          "Bulgaria": {},
          "Burkina Faso": {},
          "Burundi": {},
          "Cambodia": {},
          "Cameroon": {},
          "Canada": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA"
                }
              ]
            }
          },
          "Cape Verde": {},
          "Cayman Islands": {},
          "Central African Republic": {},
          "Chad": {},
          "Chile": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CHILE"
                }
              ]
            }
          },
          "China": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CHINA"
                }
              ]
            }
          },
          "Christmas Island": {},
          "Clipperton Island": {},
          "Cocos Islands": {},
          "Colombia": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "COLUMBIA"
                }
              ]
            }
          },
          "Comoros": {},
          "Cook Islands": {},
          "Coral Sea Islands": {},
          "Costa Rica": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "COSTA_RICA"
                }
              ]
            }
          },
          "Cote d'Ivoire": {},
          "Croatia": {},
          "Cuba": {},
          "Curacao": {},
          "Cyprus": {},
          "Czech Republic": {},
          "Democratic Republic of the Congo": {},
          "Denmark": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DENMARK"
                }
              ]
            }
          },
          "Djibouti": {},
          "Dominica": {},
          "Dominican Republic": {},
          "Ecuador": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ECUADOR"
                }
              ]
            }
          },
          "Egypt": {},
          "El Salvador": {},
          "Equatorial Guinea": {},
          "Eritrea": {},
          "Estonia": {},
          "Eswatini": {},
          "Ethiopia": {},
          "Europa Island": {},
          "Falkland Islands (Islas Malvinas)": {},
          "Faroe Islands": {},
          "Fiji": {},
          "Finland": {},
          "France": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FRANCE"
                }
              ]
            }
          },
          "French Guiana": {},
          "French Polynesia": {},
          "French Southern and Antarctic Lands": {},
          "Gabon": {},
          "Gambia": {},
          "Gaza Strip": {},
          "Georgia": {},
          "Germany": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GERMANY"
                }
              ]
            }
          },
          "Ghana": {},
          "Gibraltar": {},
          "Glorioso Islands": {},
          "Greece": {},
          "Greenland": {},
          "Grenada": {},
          "Guadeloupe": {},
          "Guam": {},
          "Guatemala": {},
          "Guernsey": {},
          "Guinea": {},
          "Guinea-Bissau": {},
          "Guyana": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GUYANA"
                }
              ]
            }
          },
          "Haiti": {},
          "Heard Island and McDonald Islands": {},
          "Honduras": {},
          "Hong Kong": {},
          "Howland Island": {},
          "Hungary": {},
          "Iceland": {},
          "India": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "INDIA"
                }
              ]
            }
          },
          "Indonesia": {},
          "Iran": {},
          "Iraq": {},
          "Ireland": {},
          "Isle of Man": {},
          "Israel": {},
          "Italy": {},
          "Jamaica": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "JAMAICA"
                }
              ]
            }
          },
          "Jan Mayen": {},
          "Japan": {},
          "Jarvis Island": {},
          "Jersey": {},
          "Johnston Atoll": {},
          "Jordan": {},
          "Juan de Nova Island": {},
          "Kazakhstan": {},
          "Kenya": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "KENYA"
                }
              ]
            }
          },
          "Kerguelen Archipelago": {},
          "Kingman Reef": {},
          "Kiribati": {},
          "Kosovo": {},
          "Kuwait": {},
          "Kyrgyzstan": {},
          "Laos": {},
          "Latvia": {},
          "Lebanon": {},
          "Lesotho": {},
          "Liberia": {},
          "Libya": {},
          "Liechtenstein": {},
          "Line Islands": {},
          "Lithuania": {},
          "Luxembourg": {},
          "Macau": {},
          "Madagascar": {},
          "Malawi": {},
          "Malaysia": {},
          "Maldives": {},
          "Mali": {},
          "Malta": {},
          "Marshall Islands": {},
          "Martinique": {},
          "Mauritania": {},
          "Mauritius": {},
          "Mayotte": {},
          "Mexico": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MEXICO"
                }
              ]
            }
          },
          "Micronesia": {},
          "Midway Islands": {},
          "Moldova": {},
          "Monaco": {},
          "Mongolia": {},
          "Montenegro": {},
          "Montserrat": {},
          "Morocco": {},
          "Mozambique": {},
          "Myanmar": {},
          "Namibia": {},
          "Nauru": {},
          "Navassa Island": {},
          "Nepal": {},
          "Netherlands": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NETHERLANDS"
                }
              ]
            }
          },
          "New Caledonia": {},
          "New Zealand": {},
          "Nicaragua": {},
          "Niger": {},
          "Nigeria": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NIGERIA"
                }
              ]
            }
          },
          "Niue": {},
          "Norfolk Island": {},
          "North Korea": {},
          "North Macedonia": {},
          "North Sea": {},
          "Northern Mariana Islands": {},
          "Norway": {},
          "Oman": {},
          "Pakistan": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PAKISTAN"
                }
              ]
            }
          },
          "Palau": {},
          "Panama": {},
          "Papua New Guinea": {},
          "Paracel Islands": {},
          "Paraguay": {},
          "Peru": {},
          "Philippines": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PHILIPPINE"
                }
              ]
            }
          },
          "Pitcairn Islands": {},
          "Poland": {},
          "Portugal": {},
          "Puerto Rico": {},
          "Qatar": {},
          "Republic of the Congo": {},
          "Reunion": {},
          "Romania": {},
          "Ross Sea": {},
          "Russia": {},
          "Rwanda": {},
          "Saint Helena": {},
          "Saint Kitts and Nevis": {},
          "Saint Lucia": {},
          "Saint Pierre and Miquelon": {},
          "Saint Martin": {},
          "Saint Vincent and the Grenadines": {},
          "Samoa": {},
          "San Marino": {},
          "Sao Tome and Principe": {},
          "Saudi Arabia": {},
          "Senegal": {},
          "Serbia": {},
          "Seychelles": {},
          "Sierra Leone": {},
          "Singapore": {},
          "Sint Maarten": {},
          "Slovakia": {},
          "Slovenia": {},
          "Solomon Islands": {},
          "Somalia": {},
          "South Africa": {},
          "South Georgia and the South Sandwich Islands": {},
          "South Korea": {},
          "South Sudan": {},
          "Spain": {},
          "Spratly Islands": {},
          "Sri Lanka": {},
          "State of Palestine": {},
          "Sudan": {},
          "Suriname": {},
          "Svalbard": {},
          "Swaziland": {},
          "Sweden": {},
          "Switzerland": {},
          "Syria": {},
          "Taiwan": {},
          "Tajikistan": {},
          "Tanzania": {},
          "Thailand": {},
          "Timor-Leste": {},
          "Togo": {},
          "Tokelau": {},
          "Tonga": {},
          "Trinidad and Tobago": {},
          "Tromelin Island": {},
          "Tunisia": {},
          "Turkey": {},
          "Turkmenistan": {},
          "Turks and Caicos Islands": {},
          "Tuvalu": {},
          "United States of America": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "US"
                }
              ]
            }
          },
          "Uganda": {},
          "Ukraine": {},
          "United Arab Emirates": {},
          "United Kingdom": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "UNITEDKING"
                }
              ]
            }
          },
          "Uruguay": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "URUGUAY"
                }
              ]
            }
          },
          "Uzbekistan": {},
          "Vanuatu": {},
          "Venezuela": {},
          "Viet Nam": {},
          "Virgin Islands": {},
          "Wake Island": {},
          "Wallis and Futuna": {},
          "West Bank": {},
          "Western Sahara": {},
          "Yemen": {},
          "Zambia": {},
          "Zimbabwe": {}
        }
      },
      {
        "fieldName": "geo_loc_name (state/province/territory)",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001185",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The province/territory where the sample was collected.",
        "guidance": "Provide the province/territory name from the controlled vocabulary provided.",
        "examples": "Saskatchewan",
        "exportField": {
          "CNPHI": [
            {
              "field": "Patient Province"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_PROVINCE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "geo_loc_name (state/province/territory)"
            }
          ]
        },
        "schema:ItemList": {
          "Alberta": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-AB"
                }
              ]
            }
          },
          "British Columbia": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-BC"
                }
              ]
            }
          },
          "Manitoba": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-MB"
                }
              ]
            }
          },
          "New Brunswick": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-NB"
                }
              ]
            }
          },
          "Newfoundland and Labrador": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-NL"
                }
              ]
            }
          },
          "Northwest Territories": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-NT"
                }
              ]
            }
          },
          "Nova Scotia": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-NS"
                }
              ]
            }
          },
          "Nunavut": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-NU"
                }
              ]
            }
          },
          "Ontario": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-ON"
                }
              ]
            }
          },
          "Prince Edward Island": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-PE"
                }
              ]
            }
          },
          "Quebec": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-QC"
                }
              ]
            }
          },
          "Saskatchewan": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-SK"
                }
              ]
            }
          },
          "Yukon": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CA-YT"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "geo_loc_name (city)",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001189",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The city where the sample was collected.",
        "guidance": "Provide the city name. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "Medicine Hat",
        "exportField": {
          "CNPHI": [
            {
              "field": "Patient City"
            }
          ],
          "NML_LIMS": [
            {
              "field": "geo_loc_name (city)"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "geo_loc_name (city)"
            }
          ]
        }
      },
      {
        "fieldName": "organism",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001191",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Taxonomic name of the organism.",
        "guidance": "Use \"Severe acute respiratory syndrome coronavirus 2\". This value is provided in the template.",
        "examples": "Severe acute respiratory syndrome coronavirus 2",
        "exportField": {
          "CNPHI": [
            {
              "field": "Pathogen"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_CURRENT_ID"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "organism"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "organism"
            }
          ]
        },
        "schema:ItemList": {
          "Severe acute respiratory syndrome coronavirus 2": {},
          "RaTG13": {},
          "RmYN02": {}
        }
      },
      {
        "fieldName": "isolate",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001195",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Identifier of the specific isolate.",
        "guidance": "Provide the GISAID virus name, which should be written in the format \u201chCov-19/CANADA/xxxxx/2020\u201d.",
        "examples": "hCov-19/CANADA/prov_rona_99/2020",
        "exportField": {
          "GISAID": [
            {
              "field": "Virus name"
            }
          ],
          "CNPHI": [
            {
              "field": "GISAID Virus Name"
            }
          ],
          "NML_LIMS": [
            {
              "field": "RESULT - CANCOGEN_SUBMISSIONS"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolate"
            },
            {
              "field": "GISAID_virus_name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "isolate"
            }
          ]
        }
      },
      {
        "fieldName": "purpose of sampling",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001198",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The reason that the sample was collected.",
        "guidance": "The reason a sample was collected may provide information about potential biases in sampling strategy. Provide the purpose of sampling from the picklist in the template. Most likely, the sample was collected for Diagnostic testing. The reason why a sample was originally collected may differ from the reason why it was selected for sequencing, which should be indicated in the \"purpose of sequencing\" field. ",
        "examples": "Diagnostic testing",
        "exportField": {
          "CNPHI": [
            {
              "field": "Reason for Sampling"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_SAMPLE_CATEGORY"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "purpose_of_sampling"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "purpose of sampling"
            }
          ]
        },
        "schema:ItemList": {
          "Cluster/Outbreak investigation": {},
          "Diagnostic testing": {},
          "Research": {},
          "Surveillance": {}
        }
      },
      {
        "fieldName": "purpose of sampling details",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001200",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The description of why the sample was collected, providing specific details.",
        "guidance": "Provide an expanded description of why the sample was collected using free text. The description may include the importance of the sample for a particular public health investigation/surveillance activity/research question. If details are not available, provide a null value.",
        "examples": "The sample was collected to investigate the prevalence of variants associated with mink-to-human transmission in Canada. ",
        "exportField": {
          "CNPHI": [
            {
              "field": "Details on the Reason for Sampling"
            }
          ],
          "NML_LIMS": [
            {
              "field": "purpose of sampling details"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "description"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "purpose of sampling details"
            }
          ]
        }
      },
      {
        "fieldName": "NML submitted specimen type",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001204",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          ""
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The type of specimen submitted to the National Microbiology Laboratory (NML) for testing.",
        "guidance": "This information is required for upload through the CNPHI LaSER system. Select the specimen type from the pick list provided. If sequence data is being submitted rather than a specimen for testing, select \u201cNot Applicable\u201d.",
        "examples": "swab",
        "exportField": {
          "CNPHI": [
            {
              "field": "Specimen Type"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_SPECIMEN_TYPE"
            }
          ]
        },
        "schema:ItemList": {
          "Swab": {
            "exportField": {
              "NML_LIMS": [
                {
                  "field": "PH_SPECIMEN_TYPE",
                  "value": "SWAB"
                }
              ]
            }
          },
          "RNA": {
            "exportField": {
              "NML_LIMS": [
                {
                  "field": "PH_SPECIMEN_TYPE",
                  "value": "RNA"
                }
              ]
            }
          },
          "mRNA (cDNA)": {},
          "Nucleic acid": {
            "exportField": {
              "NML_LIMS": [
                {
                  "field": "PH_SPECIMEN_TYPE",
                  "value": "NUCLEIC_ACID"
                }
              ]
            }
          },
          "Not Applicable": {
            "exportField": {
              "NML_LIMS": [
                {
                  "field": "PH_SPECIMEN_TYPE",
                  "value": "NA"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "NML related specimen relationship type",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001209",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The relationship of the related specimen to the previous National Microbiology Laboratory (NML) submission.",
        "guidance": "Provide the specimen type of the original sample submitted from the pick list provided, so that additional specimen testing can be tracked in the system.",
        "examples": "Follow-up",
        "exportField": {
          "CNPHI": [
            {
              "field": "Related Specimen ID"
            },
            {
              "field": "Related Specimen Relationship Type"
            }
          ]
        },
        "schema:ItemList": {
          "Acute": {},
          "Convalescent": {},
          "Familial": {},
          "Follow-up": {},
          "Previously Submitted": {}
        }
      },
      {
        "fieldName": "anatomical material",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001211",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
        "guidance": "Provide a descriptor if an anatomical material was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Blood",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Anatomical Material"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_ISOLATION_SITE_DESC"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "anatomical_material"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "anatomical material"
            }
          ]
        },
        "schema:ItemList": {
          "Blood": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BLOOD"
                }
              ]
            }
          },
          "Fluid": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FLUID"
                }
              ]
            },
            "schema:ItemList": {
              "Saliva": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "SALIVA"
                    }
                  ]
                }
              },
              "Fluid (cerebrospinal (CSF))": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FLUID_CSF"
                    }
                  ]
                }
              },
              "Fluid (pericardial)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FLUID_PERICARDIAL"
                    }
                  ]
                }
              },
              "Fluid (pleural)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FLUID_PLEURAL"
                    }
                  ]
                }
              },
              "Fluid (vaginal)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FLUID_VAGINAL"
                    }
                  ]
                }
              },
              "Fluid (amniotic)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FLUID_AMNIOTIC"
                    }
                  ]
                }
              }
            }
          },
          "Tissue": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TISSUE"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "anatomical part",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001214",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "An anatomical part of an organism e.g. oropharynx.",
        "guidance": "Provide a descriptor if an anatomical part was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Nasopharynx (NP)",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Anatomical Site"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_ISOLATION_SITE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "anatomical_part"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "anatomical part"
            }
          ]
        },
        "schema:ItemList": {
          "Anus": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ANUS"
                }
              ]
            }
          },
          "Buccal mucosa": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BUCCAL_MUCOSA"
                }
              ]
            }
          },
          "Duodenum": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DUODENUM"
                }
              ]
            }
          },
          "Eye": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "EYE"
                }
              ]
            }
          },
          "Intestine": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "INTESTINE"
                }
              ]
            }
          },
          "Rectum": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RECTUM"
                }
              ]
            }
          },
          "Skin": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SKIN"
                }
              ]
            }
          },
          "Stomach": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "STOMACH"
                }
              ]
            }
          },
          "Upper respiratory tract": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "UPPER"
                }
              ]
            },
            "schema:ItemList": {
              "Anterior Nares": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ANTERIOR_NARES"
                    }
                  ]
                }
              },
              "Esophagus": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ESOPHAGUS"
                    }
                  ]
                }
              },
              "Ethmoid sinus": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ETHMOID_SINUS"
                    }
                  ]
                }
              },
              "Nasal Cavity": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "NASAL_CAVITY"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Middle Nasal Turbinate": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "MIDDLE_NASAL"
                        }
                      ]
                    }
                  },
                  "Inferior Nasal Turbinate": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "INFERIOR_NASAL"
                        }
                      ]
                    }
                  }
                }
              },
              "Nasopharynx (NP)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "NASOPHARYNX_NP"
                    }
                  ]
                }
              },
              "Oropharynx (OP)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "OROPHARYNX_OP"
                    }
                  ]
                }
              }
            }
          },
          "Lower respiratory tract": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LOWER"
                }
              ]
            },
            "schema:ItemList": {
              "Bronchus": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "BRONCHUS"
                    }
                  ]
                }
              },
              "Lung": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "LUNG"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Bronchiole": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "BRONCHIOLE"
                        }
                      ]
                    }
                  },
                  "Alveolar sac": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "ALVEOLAR_SAC"
                        }
                      ]
                    }
                  }
                }
              },
              "Pleural sac": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "PLEURAL_SAC"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Pleural cavity": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "PLEURAL_CAVITY"
                        }
                      ]
                    }
                  }
                }
              },
              "Trachea": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "TRACHEA"
                    }
                  ]
                }
              }
            }
          }
        }
      },
      {
        "fieldName": "body product",
        "capitalize": "",
        "ontology_id": "GENEPIO_0001216",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
        "guidance": "Provide a descriptor if a body product was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Feces",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Body Product"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_SPECIMEN_SOURCE_DESC"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "body_product"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "body product"
            }
          ]
        },
        "schema:ItemList": {
          "Feces": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FECES"
                }
              ]
            }
          },
          "Urine": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "URINE"
                }
              ]
            }
          },
          "Sweat": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SWEAT"
                }
              ]
            }
          },
          "Mucus": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MUCUS"
                }
              ]
            },
            "schema:ItemList": {
              "Sputum": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "SPUTUM"
                    }
                  ]
                }
              }
            }
          },
          "Tear": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TEAR"
                }
              ]
            }
          },
          "Fluid (seminal)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FLUID_SEMINAL"
                }
              ]
            }
          },
          "Breast Milk": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BREAST_MILK"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "environmental material",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage.",
        "guidance": "Provide a descriptor if an environmental material was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Face mask",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Environmental Material"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_ENVIRONMENTAL_MATERIAL"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "environmental_material"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "environmental material"
            }
          ]
        },
        "schema:ItemList": {
          "Air vent": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "AIR_VENT"
                }
              ]
            }
          },
          "Banknote": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BANKNOTE"
                }
              ]
            }
          },
          "Bed rail": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BED_RAIL"
                }
              ]
            }
          },
          "Building floor": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BUILDING_FLOOR"
                }
              ]
            }
          },
          "Cloth": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CLOTH"
                }
              ]
            }
          },
          "Control panel": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CONTROL_PANEL"
                }
              ]
            }
          },
          "Door": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DOOR"
                }
              ]
            }
          },
          "Door handle": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DOOR_HANDLE"
                }
              ]
            }
          },
          "Face mask": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FACE_MASK"
                }
              ]
            }
          },
          "Face shield": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FACE_SHIELD"
                }
              ]
            }
          },
          "Food": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FOOD"
                }
              ]
            }
          },
          "Food packaging": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FOOD_PACKAGING"
                }
              ]
            }
          },
          "Glass": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GLASS"
                }
              ]
            }
          },
          "Handrail": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HANDRAIL"
                }
              ]
            }
          },
          "Hospital gown": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HOSPITAL_GOWN"
                }
              ]
            }
          },
          "Light switch": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LIGHT_SWITCH"
                }
              ]
            }
          },
          "Locker": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LOCKER"
                }
              ]
            }
          },
          "N95 mask": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "N95_MASK"
                }
              ]
            }
          },
          "Nurse call button": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NURSE_CALL_BUTTON"
                }
              ]
            }
          },
          "Paper": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PAPER"
                }
              ]
            }
          },
          "Particulate matter": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PARTICULATE_MATTER"
                }
              ]
            }
          },
          "Plastic": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PLASTIC"
                }
              ]
            }
          },
          "PPE gown": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PPE_GOWN"
                }
              ]
            }
          },
          "Sewage": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SEWAGE"
                }
              ]
            }
          },
          "Sink": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SINK"
                }
              ]
            }
          },
          "Soil": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SOIL"
                }
              ]
            }
          },
          "Stainless steel": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "STAINLESS_STEEL"
                }
              ]
            }
          },
          "Tissue paper": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TISSUE_PAPER"
                }
              ]
            }
          },
          "Toilet bowl": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TOILET_BOWL"
                }
              ]
            }
          },
          "Water": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WATER"
                }
              ]
            }
          },
          "Wastewater": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WASTEWATER"
                }
              ]
            }
          },
          "Window": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WINDOW"
                }
              ]
            }
          },
          "Wood": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WOOD"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "environmental site",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "An environmental location may describe a site in the natural or built environment e.g. contact surface, metal can, hospital, wet market, bat cave.",
        "guidance": "Provide a descriptor if an environmental site was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Production Facility",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Environmental Site"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_ENVIRONMENTAL_SITE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "environmental_site"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "environmental site"
            }
          ]
        },
        "schema:ItemList": {
          "Acute care facility": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ACUTE_CARE_FACILITY"
                }
              ]
            }
          },
          "Animal house": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ANIMAL_HOUSE"
                }
              ]
            }
          },
          "Bathroom": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BATHROOM"
                }
              ]
            }
          },
          "Clinical assessment centre": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CLINICAL_ASSESSMENT_"
                }
              ]
            }
          },
          "Conference venue": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CONFERENCE_VENUE"
                }
              ]
            }
          },
          "Corridor": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CORRIDOR"
                }
              ]
            }
          },
          "Daycare": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DAYCARE"
                }
              ]
            }
          },
          "Emergency room (ER)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "EMERGENCY_ROOM_ER"
                }
              ]
            }
          },
          "Family practice clinic": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FAMILY_PRACTICE_CLIN"
                }
              ]
            }
          },
          "Group home": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GROUP_HOME"
                }
              ]
            }
          },
          "Homeless shelter": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HOMELESS_SHELTER"
                }
              ]
            }
          },
          "Hospital": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HOSPITAL"
                }
              ]
            }
          },
          "Intensive Care Unit (ICU)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "INTENSIVE_CARE_UNIT_"
                }
              ]
            }
          },
          "Long Term Care Facility": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LONG_TERM_CARE_FACIL"
                }
              ]
            }
          },
          "Patient room": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PATIENT_ROOM"
                }
              ]
            }
          },
          "Prison": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PRISON"
                }
              ]
            }
          },
          "Production Facility": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PRODUCTION_FACILITY"
                }
              ]
            }
          },
          "School": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SCHOOL"
                }
              ]
            }
          },
          "Sewage Plant": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SEWAGE_PLANT"
                }
              ]
            }
          },
          "Subway train": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SUBWAY_TRAIN"
                }
              ]
            }
          },
          "Wet market": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WET_MARKET"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "collection device",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The instrument or container used to collect the sample e.g. swab.",
        "guidance": "Provide a descriptor if a device was used for sampling. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Swab",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Specimen Collection Matrix"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_SPECIMEN_TYPE_ORIG"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "collection_device"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "collection device"
            }
          ]
        },
        "schema:ItemList": {
          "Air filter": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "AIR_FILTER"
                }
              ]
            }
          },
          "Blood Collection Tube": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BLOOD_TUBE"
                }
              ]
            }
          },
          "Bronchoscope": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BRONCHOSCOPE"
                }
              ]
            }
          },
          "Collection Container": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CONTAINER"
                }
              ]
            }
          },
          "Collection Cup": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CUP"
                }
              ]
            }
          },
          "Fibrobronchoscope Brush": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BRUSH"
                }
              ]
            }
          },
          "Filter": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FILTER"
                }
              ]
            }
          },
          "Fine Needle": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FINE_NEEDLE"
                }
              ]
            }
          },
          "Microcapillary tube": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MICROCAPILLARY_TUBE"
                }
              ]
            }
          },
          "Micropipette": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MICROPIPETTE"
                }
              ]
            }
          },
          "Needle": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NEEDLE"
                }
              ]
            }
          },
          "Serum Collection Tube": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SERUM_TUBE"
                }
              ]
            }
          },
          "Sputum Collection Tube": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SPUTUM_TUBE"
                }
              ]
            }
          },
          "Suction Catheter": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SUCTION_CATHETER"
                }
              ]
            }
          },
          "Swab": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SWAB"
                }
              ]
            }
          },
          "Urine Collection Tube": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "URINE_TUBE"
                }
              ]
            }
          },
          "Virus Transport Medium": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TRANSPORT_MEDIUM"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "collection method",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
        "guidance": "Provide a descriptor if a collection method was used for sampling. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Bronchoalveolar lavage (BAL)",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "CNPHI": [
            {
              "field": "Collection Method"
            }
          ],
          "NML_LIMS": [
            {
              "field": "COLLECTION_METHOD"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "collection_method"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "collection method"
            }
          ]
        },
        "schema:ItemList": {
          "Amniocentesis": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "AMNIOCENTESIS"
                }
              ]
            }
          },
          "Aspiration": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ASPIRATION"
                }
              ]
            },
            "schema:ItemList": {
              "Suprapubic Aspiration": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "SUPRAPUBIC_ASPIRATIO"
                    }
                  ]
                }
              },
              "Tracheal aspiration": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "TRACHEAL_ASPIRATION"
                    }
                  ]
                }
              },
              "Vacuum Aspiration": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "VACUUM_ASPIRATION"
                    }
                  ]
                }
              }
            }
          },
          "Biopsy": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BIOPSY"
                }
              ]
            },
            "schema:ItemList": {
              "Needle Biopsy": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "NEEDLE_BIOPSY"
                    }
                  ]
                }
              }
            }
          },
          "Filtration": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FILTRATION"
                }
              ]
            },
            "schema:ItemList": {
              "Air filtration": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "AIR_FILTRATION"
                    }
                  ]
                }
              }
            }
          },
          "Lavage": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LAVAGE"
                }
              ]
            },
            "schema:ItemList": {
              "Bronchoalveolar lavage (BAL)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "BAL"
                    }
                  ]
                }
              },
              "Gastric Lavage": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "GASTRIC_LAVAGE"
                    }
                  ]
                }
              }
            }
          },
          "Lumbar Puncture": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LUMBAR_PUNCTURE"
                }
              ]
            }
          },
          "Necropsy": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NECROPSY"
                }
              ]
            }
          },
          "Phlebotomy": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PHLEBOTOMY"
                }
              ]
            }
          },
          "Rinsing": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RINSING"
                }
              ]
            },
            "schema:ItemList": {
              "Saline gargle (mouth rinse and gargle)": {}
            }
          },
          "Scraping": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SCRAPING"
                }
              ]
            }
          },
          "Swabbing": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SWABBING"
                }
              ]
            },
            "schema:ItemList": {
              "Finger Prick": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "FINGER_PRICK"
                    }
                  ]
                }
              }
            }
          },
          "Wash": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WASH"
                }
              ]
            }
          },
          "Washout Tear Collection": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "WASHOUT"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "collection protocol",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name and version of a particular protocol used for sampling.",
        "guidance": "Free text.",
        "examples": "BCRonaSamplingProtocol v. 1.2",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "collection protocol"
            }
          ]
        }
      },
      {
        "fieldName": "specimen processing",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Any processing applied to the sample during or after receiving the sample.",
        "guidance": "Critical for interpreting data. Select all the applicable processes from the pick list. If virus was passaged, include information in \"lab host\", \"passage number\", and \"passage method\" fields. If none of the processes in the pick list apply, put \"not applicable\".",
        "examples": "Virus passage",
        "exportField": {
          "GISAID": [
            {
              "field": "Passage details/history"
            }
          ],
          "NML_LIMS": [
            {
              "field": "specimen processing"
            }
          ]
        },
        "schema:ItemList": {
          "Virus passage": {},
          "RNA re-extraction (post RT-PCR)": {},
          "Specimens pooled": {}
        }
      },
      {
        "fieldName": "lab host",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Name and description of the laboratory host used to propagate the source organism or material from which the sample was obtained.",
        "guidance": "Type of cell line used for propagation. Provide the name of the cell line using the picklist in the template. If not passaged, put \"not applicable\".",
        "examples": "Vero E6 cell line",
        "exportField": {
          "GISAID": [
            {
              "field": "Passage details/history"
            }
          ],
          "NML_LIMS": [
            {
              "field": "lab host"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "lab_host"
            }
          ]
        },
        "schema:ItemList": {
          "293/ACE2 cell line": {},
          "Caco2 cell line": {},
          "Calu3 cell line": {},
          "EFK3B cell line": {},
          "HEK293T cell line": {},
          "HRCE cell line": {},
          "Huh7 cell line": {},
          "LLCMk2 cell line": {},
          "MDBK cell line": {},
          "Mv1Lu cell line": {},
          "NHBE cell line": {},
          "PK-15 cell line": {},
          "RK-13 cell line": {},
          "U251 cell line": {},
          "Vero cell line": {},
          "Vero E6 cell line": {},
          "VeroE6/TMPRSS2 cell line": {}
        }
      },
      {
        "fieldName": "passage number",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": [
          "Not Applicable"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Number of passages.",
        "guidance": "Provide number of known passages. If not passaged, put \"not applicable\"",
        "examples": "3",
        "exportField": {
          "GISAID": [
            {
              "field": "Passage details/history"
            }
          ],
          "NML_LIMS": [
            {
              "field": "passage number"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "passage_history"
            }
          ]
        }
      },
      {
        "fieldName": "passage method",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "Not Applicable"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Description of how organism was passaged.",
        "guidance": "Free text. Provide a very short description (<10 words). If not passaged, put \"not applicable\".",
        "examples": "0.25% trypsin + 0.02% EDTA",
        "exportField": {
          "GISAID": [
            {
              "field": "Passage details/history"
            }
          ],
          "NML_LIMS": [
            {
              "field": "passage method"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "passage_method"
            }
          ]
        }
      },
      {
        "fieldName": "biomaterial extracted",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The biomaterial extracted from samples for the purpose of sequencing.",
        "guidance": "Provide the biomaterial extracted from the picklist in the template.",
        "examples": "RNA (total)",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "biomaterial extracted"
            }
          ]
        },
        "schema:ItemList": {
          "RNA (total)": {},
          "RNA (poly-A)": {},
          "RNA (ribo-depleted)": {},
          "mRNA (messenger RNA)": {},
          "mRNA (cDNA)": {}
        }
      }
    ]
  },
  {
    "fieldName": "Host Information",
    "children": [
      {
        "fieldName": "host (common name)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The commonly used name of the host.",
        "guidance": "Common name or scientific name are required if there was a host. Both can be provided, if known. Use terms from the pick lists in the template. Common name e.g. human, bat. If the sample was environmental, put \"not applicable.",
        "examples": "Human",
        "exportField": {
          "CNPHI": [
            {
              "field": "Animal Type"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_ANIMAL_TYPE"
            }
          ]
        },
        "schema:ItemList": {
          "Human": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HUMAN"
                }
              ]
            }
          },
          "Bat": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "BAT"
                }
              ]
            }
          },
          "Cat": {},
          "Chicken": {},
          "Civets": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CIVETS"
                }
              ]
            }
          },
          "Cow": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "bovine"
                }
              ]
            }
          },
          "Dog": {},
          "Lion": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LION"
                }
              ]
            }
          },
          "Mink": {},
          "Pangolin": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PANGOLIN"
                }
              ]
            }
          },
          "Pig": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "porcine"
                }
              ]
            }
          },
          "Pigeon": {},
          "Tiger": {}
        }
      },
      {
        "fieldName": "host (scientific name)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The taxonomic, or scientific name of the host.",
        "guidance": "Common name or scientific name are required if there was a host. Both can be provided, if known. Use terms from the pick lists in the template. Scientific name e.g. Homo sapiens, If the sample was environmental, put \"not applicable",
        "examples": "Homo sapiens",
        "exportField": {
          "GISAID": [
            {
              "field": "Host"
            }
          ],
          "NML_LIMS": [
            {
              "field": "host (scientific name)"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host (scientific name)"
            }
          ]
        },
        "schema:ItemList": {
          "Homo sapiens": {},
          "Bos taurus": {},
          "Canis lupus familiaris": {},
          "Chiroptera": {},
          "Columbidae": {},
          "Felis catus": {},
          "Gallus gallus": {},
          "Manis": {},
          "Manis javanica": {},
          "Neovison vison": {},
          "Panthera leo": {},
          "Panthera tigris": {},
          "Rhinolophidae": {},
          "Rhinolophus affinis": {},
          "Sus scrofa domesticus": {},
          "Viverridae": {}
        }
      },
      {
        "fieldName": "host health state",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Health status of the host at the time of sample collection.",
        "guidance": "If known, select a descriptor from the pick list provided in the template.",
        "examples": "Symptomatic",
        "exportField": {
          "GISAID": [
            {
              "field": "Patient status"
            }
          ],
          "CNPHI": [
            {
              "field": "Host Health State"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_HOST_HEALTH"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_health_state"
            }
          ]
        },
        "schema:ItemList": {
          "Asymptomatic": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ASYMPTOMATIC"
                }
              ]
            }
          },
          "Deceased": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DECEASED"
                }
              ]
            }
          },
          "Healthy": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HEALTHY"
                }
              ]
            }
          },
          "Recovered": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RECOVERED"
                }
              ]
            }
          },
          "Symptomatic": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SYMPTOMATIC"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "host health status details",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Further details pertaining to the health or disease status of the host at time of collection.",
        "guidance": "If known, select a descriptor from the pick list provided in the template.",
        "examples": "Hospitalized (ICU)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Host Health State Details"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_HOST_HEALTH_DETAILS"
            }
          ]
        },
        "schema:ItemList": {
          "Hospitalized": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HOSPITALIZED"
                }
              ]
            },
            "schema:ItemList": {
              "Hospitalized (Non-ICU)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "NON_ICU"
                    }
                  ]
                }
              },
              "Hospitalized (ICU)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ICU"
                    }
                  ]
                }
              }
            }
          },
          "Mechanical Ventilation": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "VENTILATION"
                }
              ]
            }
          },
          "Medically Isolated": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ISOLATED"
                }
              ]
            },
            "schema:ItemList": {
              "Medically Isolated (Negative Pressure)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ISOLATED_NEGATIVE_PR"
                    }
                  ]
                }
              }
            }
          },
          "Self-quarantining": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SELF_QUARANTINING"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "host health outcome",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Disease outcome in the host.",
        "guidance": "If known, select a descriptor from the pick list provided in the template.",
        "examples": "Recovered",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "host health outcome"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_disease_outcome"
            }
          ]
        },
        "schema:ItemList": {
          "Deceased": {},
          "Deteriorating": {},
          "Recovered": {},
          "Stable": {}
        }
      },
      {
        "fieldName": "host disease",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The name of the disease experienced by the host.",
        "guidance": "Select \"COVID-19\" from the pick list provided in the template.",
        "examples": "COVID-19",
        "exportField": {
          "CNPHI": [
            {
              "field": "Host Disease"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_HOST_DISEASE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_disease"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host disease"
            }
          ]
        },
        "schema:ItemList": {
          "COVID-19": {}
        }
      },
      {
        "fieldName": "host age",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "0",
        "xs:maxInclusive": "130",
        "requirement": "required",
        "description": "Age of host at the time of sampling.",
        "guidance": "Enter the age of the host in years. If not available, provide a null value. If there is not host, put \"Not Applicable\".",
        "examples": "79",
        "exportField": {
          "GISAID": [
            {
              "field": "Patient age"
            }
          ],
          "CNPHI": [
            {
              "field": "Patient Age"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_AGE"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_age"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host age"
            }
          ]
        }
      },
      {
        "fieldName": "host age unit",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The unit used to measure the host age, in either months or years.",
        "guidance": "Indicate whether the host age is in months or years. Age indicated in months will be binned to the 0 - 9 year age bin. ",
        "examples": "years",
        "exportField": {
          "CNPHI": [
            {
              "field": "Age Units"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_AGE_UNIT"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host age unit"
            }
          ]
        },
        "schema:ItemList": {
          "month": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Month"
                }
              ]
            }
          },
          "year": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Year"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "host age bin",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Age of host at the time of sampling, expressed as an age group.",
        "guidance": "Select the corresponding host age bin from the pick list provided in the template. If not available, provide a null value.",
        "examples": "60 - 69",
        "exportField": {
          "CNPHI": [
            {
              "field": "Host Age Category"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_AGE_GROUP"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host age bin"
            }
          ]
        },
        "schema:ItemList": {
          "0 - 9": {},
          "10 - 19": {},
          "20 - 29": {},
          "30 - 39": {},
          "40 - 49": {},
          "50 - 59": {},
          "60 - 69": {},
          "70 - 79": {},
          "80 - 89": {},
          "90 - 99": {},
          "100+": {}
        }
      },
      {
        "fieldName": "host gender",
        "capitalize": "Title",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The gender of the host at the time of sample collection.",
        "guidance": "Select the corresponding host gender from the pick list provided in the template. If not available, provide a null value. If there is no host, put \"Not Applicable\".",
        "examples": "male",
        "exportField": {
          "GISAID": [
            {
              "field": "Gender"
            }
          ],
          "CNPHI": [
            {
              "field": "Patient Sex"
            }
          ],
          "NML_LIMS": [
            {
              "field": "VD_SEX"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_sex"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "host gender"
            }
          ]
        },
        "schema:ItemList": {
          "Female": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FEMALE"
                }
              ]
            }
          },
          "Male": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MALE"
                }
              ]
            }
          },
          "Non-binary gender": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NON_BINARY_GENDER"
                }
              ]
            }
          },
          "Transgender (Male to Female)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TRANSGENDER"
                }
              ]
            }
          },
          "Transgender (Female to Male)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TRANSGENDER"
                }
              ]
            }
          },
          "Undeclared": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "REFUSED"
                }
              ]
            }
          },
          "Unknown": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "UNKNOWN"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "host residence geo_loc name (country)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "geo_loc_name (country)",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The country of residence of the host.",
        "guidance": "Select the country name from pick list provided in the template.",
        "examples": "United Kingdom",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_HOST_COUNTRY"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "host residence geo_loc name (state/province/territory)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "geo_loc_name (state/province/territory)",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The state/province/territory of residence of the host.",
        "guidance": "Select the province/territory name from pick list provided in the template.",
        "examples": "Quebec",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_HOST_PROVINCE"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "host subject ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A unique identifier by which each host can be referred to e.g. #131",
        "guidance": "Provide the host identifier. Should be a unique, user-defined identifier.",
        "examples": "BCxy123",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "host subject ID"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "host_subject_id"
            }
          ]
        }
      },
      {
        "fieldName": "symptom onset date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date on which the symptoms began or were first noted.",
        "guidance": "ISO 8601 standard \"YYYY-MM-DD\".",
        "examples": "2020-03-16",
        "exportField": {
          "CNPHI": [
            {
              "field": "Symptoms Onset Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_ONSET_DATE"
            }
          ]
        }
      },
      {
        "fieldName": "signs and symptoms",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A perceived change in function or sensation, (loss, disturbance or appearance) indicative of a disease, reported by a patient or clinician.",
        "guidance": "Select all of the symptoms experienced by the host from the pick list.",
        "examples": "Chills (sudden cold sensation); Cough; Fever",
        "exportField": {
          "CNPHI": [
            {
              "field": "Symptoms"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_SYMPTOMS"
            }
          ]
        },
        "schema:ItemList": {
          "Abnormal lung auscultation": {},
          "Abnormality of taste sensation": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SENSE_OF_TASTE"
                }
              ]
            },
            "schema:ItemList": {
              "Ageusia (complete loss of taste)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "AGEUSIA"
                    }
                  ]
                }
              },
              "Parageusia (distorted sense of taste)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "PARAGEUSIA"
                    }
                  ]
                }
              },
              "Hypogeusia (reduced sense of taste)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "HYPOGEUSIA"
                    }
                  ]
                }
              }
            }
          },
          "Abnormality of the sense of smell": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SENSE_OF_SMELL"
                }
              ]
            },
            "schema:ItemList": {
              "Anosmia (lost sense of smell)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ANOSMIA"
                    }
                  ]
                }
              },
              "Hyposmia (reduced sense of smell)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "HYPOSMIA"
                    }
                  ]
                }
              }
            }
          },
          "Acute Respiratory Distress Syndrome": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "ARDS"
                }
              ]
            }
          },
          "Altered mental status": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ALTERED_CONSCIOUS"
                }
              ]
            },
            "schema:ItemList": {
              "Cognitive impairment": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "COGNITIVE"
                    }
                  ]
                }
              },
              "Coma": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "COMA"
                    }
                  ]
                }
              },
              "Confusion": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "CONFUSION"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Delirium (sudden severe confusion)": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "DELIRIUM"
                        }
                      ]
                    }
                  }
                }
              },
              "Inability to arouse (inability to stay awake)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "INABILITY_AWAKE"
                    }
                  ]
                }
              },
              "Irritability": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "IRRITABILITY"
                    }
                  ]
                }
              },
              "Loss of speech": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "LOSS_OF_SPEECH"
                    }
                  ]
                }
              }
            }
          },
          "Arrhythmia": {},
          "Asthenia (generalized weakness)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "ASTHENIA"
                }
              ]
            }
          },
          "Chest tightness or pressure": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CHEST_TIGHT"
                }
              ]
            },
            "schema:ItemList": {
              "Rigors (fever shakes)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "RIGORS"
                    }
                  ]
                }
              }
            }
          },
          "Chills (sudden cold sensation)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "Chills"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "CHILLS"
                }
              ]
            }
          },
          "Conjunctival injection": {},
          "Conjunctivitis (pink eye)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "Conjunctivitis"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "CONJUNCTIVITIS"
                }
              ]
            }
          },
          "Coryza": {},
          "Cough": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "COUGH"
                }
              ]
            },
            "schema:ItemList": {
              "Nonproductive cough (dry cough)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "NONPRODUCT_COUGH"
                    }
                  ]
                }
              },
              "Productive cough (wet cough)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "PRODUCTIVE_COUGH"
                    }
                  ]
                }
              }
            }
          },
          "Cyanosis (blueish skin discolouration)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "CYANOSIS"
                }
              ]
            },
            "schema:ItemList": {
              "Acrocyanosis": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ACROCYANOS"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Circumoral cyanosis (bluish around mouth)": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "CIRCUMORAL_CYANOSIS"
                        }
                      ]
                    }
                  },
                  "Cyanotic face (bluish face)": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "CYANOTIC_FACE"
                        }
                      ]
                    }
                  }
                }
              },
              "Central Cyanosis": {
                "schema:ItemList": {
                  "Cyanotic lips (bluish lips)": {
                    "exportField": {
                      "NML_LIMS": [
                        {
                          "value": "CYANOTIC_LIPS"
                        }
                      ]
                    }
                  }
                }
              },
              "Peripheral Cyanosis": {}
            }
          },
          "Dyspnea (breathing difficulty)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "DYSPNEA"
                }
              ]
            }
          },
          "Diarrhea (watery stool)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "Diarrhea, watery"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "DIARRHEA"
                }
              ]
            }
          },
          "Dry gangrene": {},
          "Encephalitis (brain inflammation)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "Encephalitis"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "ENCEPHALITIS"
                }
              ]
            }
          },
          "Encephalopathy": {},
          "Fatigue (tiredness)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "Fatigue"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "FATIGUE"
                }
              ]
            }
          },
          "Fever": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "FEVER"
                }
              ]
            },
            "schema:ItemList": {
              "Fever (>=38\u00b0C)": {
                "exportField": {
                  "CNPHI": [
                    {
                      "value": "Fever"
                    }
                  ]
                }
              }
            }
          },
          "Glossitis (inflammation of the tongue)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "GLOSSITIS"
                }
              ]
            }
          },
          "Ground Glass Opacities (GGO)": {},
          "Headache": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HEADACHE"
                }
              ]
            }
          },
          "Hemoptysis (coughing up blood)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HEMOPTYSIS"
                }
              ]
            }
          },
          "Hypocapnia": {},
          "Hypotension (low blood pressure)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HYPOTENSION"
                }
              ]
            }
          },
          "Hypoxemia (low blood oxygen)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "HYPOXEMIA"
                }
              ]
            },
            "schema:ItemList": {
              "Silent hypoxemia": {}
            }
          },
          "Internal hemorrhage (internal bleeding)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "INTERNAL_HEMORRHAGE"
                }
              ]
            }
          },
          "Loss of Fine Movements": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LOSS_OF_FINE_MOVE"
                }
              ]
            }
          },
          "Low appetite": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "LOW_APPETITE"
                }
              ]
            }
          },
          "Malaise (general discomfort/unease)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MALAISE"
                }
              ]
            }
          },
          "Meningismus/nuchal rigidity": {},
          "Muscle weakness": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "MUSCLE_WEAK"
                }
              ]
            }
          },
          "Nasal obstruction (stuffy nose)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NASAL_OBSTRUCT"
                }
              ]
            }
          },
          "Nausea": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "NAUSEA"
                }
              ]
            }
          },
          "Nose bleed": {},
          "Otitis": {},
          "Pain": {
            "schema:ItemList": {
              "Abdominal pain": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ABDOMINAL"
                    }
                  ]
                }
              },
              "Arthralgia (painful joints)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "ARTHRALGIA"
                    }
                  ]
                }
              },
              "Chest pain": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "CHEST_PAIN"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Pleuritic chest pain": {}
                }
              },
              "Myalgia (muscle pain)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "MYALGIA"
                    }
                  ]
                }
              }
            }
          },
          "Pharyngitis (sore throat)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "PHARYNGITIS"
                }
              ]
            }
          },
          "Pharyngeal exudate": {},
          "Pleural effusion": {},
          "Pneumonia": {},
          "Prostration": {},
          "Pseudo-chilblains": {
            "schema:ItemList": {
              "Pseudo-chilblains on fingers (covid fingers)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "PSEUDO-CHIBLAINS_F"
                    }
                  ]
                }
              },
              "Pseudo-chilblains on toes (covid toes)": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "PSEUDO-CHIBLAINS_T"
                    }
                  ]
                }
              }
            }
          },
          "Rash": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RASH"
                }
              ]
            }
          },
          "Rhinorrhea (runny nose)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RHINORRHEA"
                }
              ]
            }
          },
          "Seizure": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SEIZURE"
                }
              ]
            },
            "schema:ItemList": {
              "Motor seizure": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "MOTOR_SEIZURE"
                    }
                  ]
                }
              }
            }
          },
          "Shivering (involuntary muscle twitching)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SHIVERING"
                }
              ]
            }
          },
          "Slurred speech": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SLURRED_SPEECH"
                }
              ]
            }
          },
          "Sneezing": {},
          "Sputum Production": {},
          "Stroke": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "STROKE"
                }
              ]
            }
          },
          "Swollen Lymph Nodes": {},
          "Tachypnea (accelerated respiratory rate)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "TACHYPNEA"
                }
              ]
            }
          },
          "Vertigo (dizziness)": {},
          "Vomiting (throwing up)": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "VOMITING"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "pre-existing conditions and risk factors",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Patient pre-existing conditions and risk factors. <li>Pre-existing condition: A medical condition that existed prior to the current infection. <li>Risk Factor: A variable associated with an increased risk of disease or infection.",
        "guidance": "Select all of the pre-existing conditions and risk factors experienced by the host from the pick list. If the desired term is missing, contact the curation team.",
        "examples": "Asthma; Pregnancy; Smoking",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "pre-existing conditions and risk factors"
            }
          ]
        },
        "schema:ItemList": {
          "Age 60+": {},
          "Anemia": {},
          "Anorexia": {},
          "Birthing labor": {},
          "Bone marrow failure": {},
          "Cancer": {
            "schema:ItemList": {
              "Breast cancer": {},
              "Colorectal cancer": {},
              "Hematologic malignancy": {},
              "Lung cancer": {},
              "Metastatic disease": {}
            }
          },
          "Cancer treatment": {
            "schema:ItemList": {
              "Cancer surgery": {},
              "Chemotherapy": {
                "schema:ItemList": {
                  "Adjuvant chemotherapy": {}
                }
              }
            }
          },
          "Cardiac disorder": {
            "schema:ItemList": {
              "Arrhythmia": {},
              "Cardiac disease": {},
              "Cardiomyopathy": {},
              "Cardiac injury": {},
              "Hypertension (high blood pressure)": {},
              "Hypotension (low blood pressure)": {}
            }
          },
          "Cesarean section": {},
          "Chronic cough": {},
          "Chronic gastrointestinal disease": {},
          "Chronic lung disease": {},
          "Corticosteroids": {},
          "Diabetes mellitus (diabetes)": {
            "schema:ItemList": {
              "Type I diabetes mellitus (T1D)": {},
              "Type II diabetes mellitus (T2D)": {}
            }
          },
          "Eczema": {},
          "Electrolyte disturbance": {
            "schema:ItemList": {
              "Hypocalcemia": {},
              "Hypokalemia": {},
              "Hypomagnesemia": {}
            }
          },
          "Encephalitis (brain inflammation)": {},
          "Epilepsy": {},
          "Hemodialysis": {},
          "Hemoglobinopathy": {},
          "Human immunodeficiency virus (HIV)": {
            "schema:ItemList": {
              "Acquired immunodeficiency syndrome (AIDS)": {},
              "HIV and antiretroviral therapy (ART)": {}
            }
          },
          "Immunocompromised": {
            "schema:ItemList": {
              "Lupus": {}
            }
          },
          "Inflammatory bowel disease (IBD)": {
            "schema:ItemList": {
              "Colitis": {
                "schema:ItemList": {
                  "Ulcerative colitis": {}
                }
              },
              "Crohn's disease": {}
            }
          },
          "Renal disorder": {
            "schema:ItemList": {
              "Renal disease": {},
              "Chronic renal disease": {},
              "Renal failure": {}
            }
          },
          "Liver disease": {
            "schema:ItemList": {
              "Chronic liver disease": {
                "schema:ItemList": {
                  "Fatty liver disease (FLD)": {}
                }
              }
            }
          },
          "Myalgia (muscle pain)": {},
          "Myalgic encephalomyelitis (ME)": {},
          "Neurological disorder": {
            "schema:ItemList": {
              "Neuromuscular disorder": {}
            }
          },
          "Obesity": {
            "schema:ItemList": {
              "Severe obesity": {}
            }
          },
          "Respiratory disorder": {
            "schema:ItemList": {
              "Asthma": {},
              "Chronic bronchitis": {},
              "Chronic pulmonary disease": {
                "schema:ItemList": {
                  "Chronic obstructive pulmonary disease": {}
                }
              },
              "Emphysema": {},
              "Lung disease": {
                "schema:ItemList": {
                  "Chronic lung disease": {},
                  "Pulmonary fibrosis": {}
                }
              },
              "Pneumonia": {},
              "Respiratory failure": {
                "schema:ItemList": {
                  "Adult respiratory distress syndrome": {},
                  "Newborn respiratory distress syndrome": {}
                }
              },
              "Tuberculosis": {}
            }
          },
          "Postpartum (\u22646 weeks)": {},
          "Pregnancy": {},
          "Rheumatic disease": {},
          "Sickle cell disease": {},
          "Substance use": {
            "schema:ItemList": {
              "Alcohol abuse": {},
              "Drug abuse": {
                "schema:ItemList": {
                  "Injection drug abuse": {}
                }
              },
              "Smoking": {},
              "Vaping": {}
            }
          },
          "Tachypnea (accelerated respiratory rate)": {},
          "Transplant": {
            "schema:ItemList": {
              "Bone marrow transplant": {},
              "Cardiac transplant": {},
              "Hematopoietic stem cell transplant (HSCT)": {},
              "Kidney transplant": {},
              "Liver transplant": {}
            }
          }
        }
      },
      {
        "fieldName": "complications",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Patient medical complications that are believed to have occurred as a result of host disease.",
        "guidance": "Select all of the complications experienced by the host from the pick list. If the desired term is missing, contact the curation team.",
        "examples": "Acute Respiratory Failure; Coma; Septicemia",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "complications"
            }
          ]
        },
        "schema:ItemList": {
          "Abnormal blood oxygen level": {},
          "Acute respiratory failure": {},
          "Arrhythmia (complication)": {
            "schema:ItemList": {
              "Tachycardia": {
                "schema:ItemList": {
                  "Polymorphic ventricular tachycardia (VT)": {},
                  "Tachyarrhythmia": {}
                }
              }
            }
          },
          "Noncardiogenic pulmonary edema": {
            "schema:ItemList": {
              "Acute respiratory distress syndrome (ARDS)": {
                "schema:ItemList": {
                  "COVID-19 associated ARDS (CARDS)": {},
                  "Neurogenic pulmonary edema (NPE)": {}
                }
              }
            }
          },
          "Cardiac injury": {},
          "Cardiac arrest": {},
          "Cardiogenic shock": {},
          "Blood clot": {
            "schema:ItemList": {
              "Arterial clot": {},
              "Deep vein thrombosis (DVT)": {},
              "Pulmonary embolism (PE)": {}
            }
          },
          "Cardiomyopathy": {},
          "Central nervous system invasion": {},
          "Stroke (complication)": {
            "schema:ItemList": {
              "Central Nervous System Vasculitis": {},
              "Ischemic stroke": {
                "schema:ItemList": {
                  "Acute ischemic stroke": {}
                }
              }
            }
          },
          "Coma": {},
          "Convulsions": {},
          "COVID-19 associated coagulopathy (CAC)": {},
          "Cystic fibrosis": {},
          "Cytokine release syndrome": {},
          "Disseminated intravascular coagulation (DIC)": {},
          "Encephalopathy": {},
          "Fulminant myocarditis": {},
          "Guillain-Barr\u00e9 syndrome": {},
          "Internal hemorrhage (complication; internal bleeding)": {
            "schema:ItemList": {
              "Intracerebral haemorrhage": {}
            }
          },
          "Kawasaki disease": {
            "schema:ItemList": {
              "Typical Kawasaki disease": {},
              "Incomplete Kawasaki disease": {}
            }
          },
          "Kidney injury": {
            "schema:ItemList": {
              "Acute kidney injury": {}
            }
          },
          "Liver dysfunction": {},
          "Liver injury": {
            "schema:ItemList": {
              "Acute liver injury": {}
            }
          },
          "Lung injury": {
            "schema:ItemList": {
              "Acute lung injury": {}
            }
          },
          "Meningitis": {},
          "Migraine": {},
          "Miscarriage": {},
          "Multisystem inflammatory syndrome in children (MIS-C)": {},
          "Muscle injury": {},
          "Myalgic encephalomyelitis (ME)": {},
          "Myocardial infarction (heart attack)": {
            "schema:ItemList": {
              "Acute myocardial infarction": {},
              "Elevation myocardial infarction": {},
              "ST-segment elevation myocardial infarction": {}
            }
          },
          "Myocardial injury": {},
          "Neonatal complications": {},
          "Organ failure": {
            "schema:ItemList": {
              "Heart failure": {},
              "Liver failure": {}
            }
          },
          "Paralysis": {},
          "Pneumothorax (collapsed lung)": {
            "schema:ItemList": {
              "Spontaneous pneumothorax": {},
              "Spontaneous tension pneymothorax": {}
            }
          },
          "Pneumonia (complication)": {
            "schema:ItemList": {
              "COVID-19 pneumonia": {}
            }
          },
          "Pregancy complications": {},
          "Rhabdomyolysis": {},
          "Secondary infection": {
            "schema:ItemList": {
              "Secondary staph infection": {},
              "Secondary strep infection": {}
            }
          },
          "Seizure (complication)": {
            "schema:ItemList": {
              "Motor seizure": {}
            }
          },
          "Sepsis": {},
          "Septicemia": {},
          "Shock": {
            "schema:ItemList": {
              "Hyperinflammatory shock": {},
              "Refractory cardiogenic shock": {},
              "Refractory cardiogenic plus vasoplegic shock": {},
              "Septic shock": {}
            }
          },
          "Vasculitis": {},
          "Ventilation induced lung injury (VILI)": {}
        }
      }
    ]
  },
  {
    "fieldName": "Host vaccination information",
    "children": [
      {
        "fieldName": "host vaccination status",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The vaccination status of the host (fully vaccinated, partially vaccinated, or not vaccinated).",
        "guidance": "Select the vaccination status of the host from the pick list.",
        "examples": "Fully Vaccinated",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "host vaccination status"
            }
          ]
        },
        "schema:ItemList": {
          "Fully Vaccinated": {},
          "Partially Vaccinated": {},
          "Not Vaccinated": {}
        }
      },
      {
        "fieldName": "vaccine name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the vaccine.",
        "guidance": "Free text. Provide the name of the vaccine.",
        "examples": "Pfizer-BioNTech COVID-19 vaccine",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "vaccine name"
            }
          ]
        }
      },
      {
        "fieldName": "number of vaccine doses received",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The number of doses of the vaccine recived by the host.",
        "guidance": "Record how many doses of the vaccine the host has received.",
        "examples": "2",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "number of vaccine doses received"
            }
          ]
        }
      },
      {
        "fieldName": "first dose vaccination date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the host was first vaccinated.",
        "guidance": "Provide the vaccination date in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-02-26",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "first dose vaccination date"
            }
          ]
        }
      },
      {
        "fieldName": "last dose vaccination date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the host received their last dose of vaccine.",
        "guidance": "Provide the date that the last dose of the vaccine was administered. Provide the last dose vaccination date in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-04-09",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "last dose vaccination date"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Host exposure information",
    "children": [
      {
        "fieldName": "location of exposure geo_loc name (country)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "geo_loc_name (country)",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The country where the host was likely exposed to the causative agent of the illness.",
        "guidance": "Select the country name from pick list provided in the template.",
        "examples": "Canada",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_EXPOSURE_COUNTRY"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "destination of most recent travel (city)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the city that was the destination of most recent travel.",
        "guidance": "Provide the name of the city that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "New York City",
        "exportField": {
          "CNPHI": [
            {
              "field": "Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_TRAVEL"
            }
          ]
        }
      },
      {
        "fieldName": "destination of most recent travel (state/province/territory)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the province that was the destination of most recent travel.",
        "guidance": "Provide the name of the state/province/territory that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "California",
        "exportField": {
          "CNPHI": [
            {
              "field": "Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_TRAVEL"
            }
          ]
        }
      },
      {
        "fieldName": "destination of most recent travel (country)",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "geo_loc_name (country)",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the country that was the destination of most recent travel.",
        "guidance": "Provide the name of the country that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "United Kingdom",
        "exportField": {
          "CNPHI": [
            {
              "field": "Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_TRAVEL"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "most recent travel departure date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date of a person's most recent departure from their primary residence (at that time) on a journey to one or more other locations.",
        "guidance": "Provide the travel departure date.",
        "examples": "2020-03-16",
        "exportField": {
          "CNPHI": [
            {
              "field": "Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_TRAVEL"
            }
          ]
        }
      },
      {
        "fieldName": "most recent travel return date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date of a person's most recent return to some residence from a journey originating at that residence.",
        "guidance": "Provide the travel return date.",
        "examples": "2020-04-26",
        "exportField": {
          "CNPHI": [
            {
              "field": "Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_TRAVEL"
            }
          ]
        }
      },
      {
        "fieldName": "travel history",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Travel history in last six months.",
        "guidance": "Specify the countries (and more granular locations if known, separated by a comma) travelled in the last six months; can include multiple travels. Separate multiple travel events with a semi-colon. List most recent travel first.",
        "examples": "Canada, Vancouver; USA, Seattle; Italy, Milan",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "travel history"
            }
          ]
        }
      },
      {
        "fieldName": "exposure event",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Event leading to exposure.",
        "guidance": "Select an exposure event from the pick list provided in the template. If the desired term is missing, contact the curation team.",
        "examples": "Convention",
        "exportField": {
          "GISAID": [
            {
              "field": "Additional location information"
            }
          ],
          "CNPHI": [
            {
              "field": "Exposure Event"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_EXPOSURE"
            }
          ]
        },
        "schema:ItemList": {
          "Mass Gathering": {
            "schema:ItemList": {
              "Agricultural Event": {},
              "Convention": {
                "exportField": {
                  "NML_LIMS": [
                    {
                      "value": "CONVENTION"
                    }
                  ]
                }
              },
              "Convocation": {},
              "Recreational Event": {
                "schema:ItemList": {
                  "Concert": {},
                  "Sporting Event": {}
                }
              }
            }
          },
          "Religious Gathering": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "RELIGIOUS"
                }
              ]
            },
            "schema:ItemList": {
              "Mass": {}
            }
          },
          "Social Gathering": {
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "SOCIAL"
                }
              ]
            },
            "schema:ItemList": {
              "Baby Shower": {},
              "Community Event": {},
              "Family Gathering": {
                "schema:ItemList": {
                  "Family Reunion": {}
                }
              },
              "Funeral": {},
              "Party": {},
              "Potluck": {},
              "Wedding": {}
            }
          },
          "Other exposure event": {}
        }
      },
      {
        "fieldName": "exposure contact level",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The exposure transmission contact type.",
        "guidance": "Select direct or indirect exposure from the pick-list.",
        "examples": "Direct",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "exposure contact level"
            }
          ]
        },
        "schema:ItemList": {
          "Contact with infected individual": {
            "schema:ItemList": {
              "Direct contact (direct human-to-human contact)": {},
              "Indirect contact": {
                "schema:ItemList": {
                  "Close contact (face-to-face, no direct contact)": {},
                  "Casual contact": {}
                }
              }
            }
          }
        }
      },
      {
        "fieldName": "host role",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The role of the host in relation to the exposure setting.",
        "guidance": "Select the host's personal role(s) from the pick list provided in the template. If the desired term is missing, contact the curation team.",
        "examples": "Patient",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_HOST_ROLE"
            }
          ]
        },
        "schema:ItemList": {
          "Attendee": {
            "schema:ItemList": {
              "Student": {}
            }
          },
          "Patient": {
            "schema:ItemList": {
              "Inpatient": {},
              "Outpatient": {}
            }
          },
          "Passenger": {},
          "Resident": {},
          "Visitor": {},
          "Volunteer": {},
          "Work": {
            "schema:ItemList": {
              "Administrator": {},
              "First Responder": {
                "schema:ItemList": {
                  "Firefighter": {},
                  "Paramedic": {},
                  "Police Officer": {}
                }
              },
              "Child Care/Education Worker": {},
              "Essential Worker": {},
              "Healthcare Worker": {},
              "Nurse": {},
              "Personal Care Aid": {},
              "Pharmacist": {},
              "Physician": {},
              "Housekeeper": {},
              "International worker": {},
              "Kitchen Worker": {},
              "Laboratory Worker": {},
              "Rotational Worker": {},
              "Seasonal Worker": {},
              "Transport Worker": {
                "schema:ItemList": {
                  "Transport Truck Driver": {}
                }
              },
              "Veterinarian": {}
            }
          },
          "Social role": {
            "schema:ItemList": {
              "Acquaintance of case": {},
              "Relative of case": {
                "schema:ItemList": {
                  "Child of case": {},
                  "Parent of case": {},
                  "Father of case": {},
                  "Mother of case": {}
                }
              },
              "Spouse of case": {}
            }
          },
          "Other Host Role": {}
        }
      },
      {
        "fieldName": "exposure setting",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The setting leading to exposure.",
        "guidance": "Select the host exposure setting(s) from the pick list provided in the template. If a desired term is missing, contact the curation team.",
        "examples": "Healthcare Setting",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_EXPOSURE"
            }
          ]
        },
        "schema:ItemList": {
          "Human Exposure": {
            "schema:ItemList": {
              "Contact with Known COVID-19 Case": {},
              "Contact with Patient": {},
              "Contact with Probable COVID-19 Case": {},
              "Contact with Person with Acute Respiratory Illness": {},
              "Contact with Person with Fever and/or Cough": {},
              "Contact with Person who Recently Travelled": {}
            }
          },
          "Occupational, Residency or Patronage Exposure": {
            "schema:ItemList": {
              "Abbatoir": {},
              "Animal Rescue": {},
              "Childcare": {
                "schema:ItemList": {
                  "Daycare": {}
                }
              },
              "Funeral Home": {},
              "Place of Worship": {
                "schema:ItemList": {
                  "Church": {},
                  "Mosque": {},
                  "Temple": {}
                }
              },
              "Nursery": {},
              "Household": {},
              "Community Service Centre": {},
              "Correctional Facility": {},
              "Dormitory": {},
              "Farm": {},
              "First Nations Reserve": {},
              "Group Home": {},
              "Healthcare Setting": {
                "schema:ItemList": {
                  "Ambulance": {},
                  "Acute Care Facility": {},
                  "Clinic": {},
                  "Community Health Centre": {},
                  "Hospital": {
                    "schema:ItemList": {
                      "Emergency Department": {},
                      "ICU": {},
                      "Ward": {}
                    }
                  },
                  "Laboratory": {},
                  "Long-Term Care Facility": {},
                  "Pharmacy": {},
                  "Physician's Office": {}
                }
              },
              "Insecure Housing (Homeless)": {},
              "Office": {},
              "Outdoors": {
                "schema:ItemList": {
                  "Camp/camping": {},
                  "Hiking Trail": {},
                  "Hunting Ground": {},
                  "Ski Resort": {}
                }
              },
              "Petting zoo": {},
              "Restaurant": {},
              "Retail Store": {},
              "School": {},
              "Temporary Residence": {
                "schema:ItemList": {
                  "Homeless Shelter": {},
                  "Hotel": {}
                }
              },
              "Veterinary Care Clinic": {}
            }
          },
          "Travel Exposure": {
            "schema:ItemList": {
              "Travelled": {
                "schema:ItemList": {
                  "Travelled on a Cruise Ship": {},
                  "Travelled on a Plane": {},
                  "Travelled on Ground Transport": {},
                  "Travelled outside Province/Territory": {},
                  "Travelled outside Canada": {}
                }
              }
            }
          },
          "Other Exposure Setting": {}
        }
      },
      {
        "fieldName": "exposure details",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Additional host exposure information.",
        "guidance": "Free text description of the exposure.",
        "examples": "Host role - Other: Bus Driver",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_EXPOSURE_DETAILS"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Host reinfection information",
    "children": [
      {
        "fieldName": "prior SARS-CoV-2 infection",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Whether there was prior SARS-CoV-2 infection.",
        "guidance": "Ik known, provide infromation about whether the individual had a previous SARS-CoV-2 infection. Select a value from the pick list.",
        "examples": "Yes",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 infection"
            }
          ]
        },
        "schema:ItemList": {
          "Yes": {},
          "No": {},
          "Unknown": {}
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 infection isolate",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The identifier of the isolate found in the prior SARS-CoV-2 infection.",
        "guidance": "Provide the isolate name of the most recent prior infection. Structure the \"isolate\" name to be ICTV/INSDC compliant in the following format: \"SARS-CoV-2/host/country/sampleID/date\".",
        "examples": "SARS-CoV-2/human/USA/CA-CDPH-001/2020",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 infection isolate"
            }
          ]
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 infection date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date of diagnosis of the prior SARS-CoV-2 infection.",
        "guidance": "Provide the date that the most recent prior infection was diagnosed. Provide the prior SARS-CoV-2 infection date in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-01-23",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 infection date"
            }
          ]
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 antiviral treatment",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Whether there was prior SARS-CoV-2 treatment with an antiviral agent.",
        "guidance": "If known, provide infromation about whether the individual had a previous SARS-CoV-2 antiviral treatment. Select a value from the pick list.",
        "examples": "No prior antiviral treatment",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 antiviral treatment"
            }
          ]
        },
        "schema:ItemList": {
          "Prior antivrial treatment": {},
          "No prior antivrial treatment": {},
          "Unknown": {}
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 antiviral treatment agent",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the antiviral treatment agent administered during the prior SARS-CoV-2 infection.",
        "guidance": "Provide the name of the antiviral treatment agent administered during the most recent prior infection. If no treatment was administered, put \"No treatment\". If multiple antiviral agents were administered, list them all separated by commas.",
        "examples": "Remdesivir",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 antiviral treatment agent"
            }
          ]
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 antiviral treatment date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date treatment was first administered during the prior SARS-CoV-2 infection.",
        "guidance": "Provide the date that the antiviral treatment agent was first administered during the most recenrt prior infection. Provide the prior SARS-CoV-2 treatment date in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-01-28",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 antiviral treatment date"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Sequencing",
    "children": [
      {
        "fieldName": "purpose of sequencing",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The reason that the sample was sequenced.",
        "guidance": "The reason why a sample was originally collected may differ from the reason why it was selected for sequencing. The reason a sample was sequenced may provide information about potential biases in sequencing strategy. Provide the purpose of sequencing from the picklist in the template. The reason for sample collection should be indicated in the \"purpose of sampling\" field. ",
        "examples": "Baseline surveillance (random sampling)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Reason for Sequencing"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_REASON_FOR_SEQUENCING"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "purpose_of_sequencing"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "purpose of sequencing"
            }
          ]
        },
        "schema:ItemList": {
          "Baseline surveillance (random sampling)": {},
          "Targeted surveillance (non-random sampling)": {
            "schema:ItemList": {
              "Priority surveillance project": {
                "schema:ItemList": {
                  "Screening for Variants of Concern (VoC)": {},
                  "Longitudinal surveillance (repeat sampling of individuals)": {},
                  "Re-infection surveillance": {},
                  "Vaccine escape surveillance": {},
                  "Travel-associated surveillance": {
                    "schema:ItemList": {
                      "Domestic travel surveillance": {},
                      "International travel surveillance": {},
                      "Surveillance of international border crossing by air travel": {},
                      "Surveillance of international border crossing by ground transport": {},
                      "Surveillance from international worker testing": {}
                    }
                  }
                }
              }
            }
          },
          "Cluster/Outbreak investigation": {
            "schema:ItemList": {
              "Multi-jurisdictional outbreak investigation": {},
              "Intra-jurisdictional outbreak investigation": {}
            }
          },
          "Research": {
            "schema:ItemList": {
              "Viral passage experiment": {},
              "Protocol testing experiment": {}
            }
          }
        }
      },
      {
        "fieldName": "purpose of sequencing details",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The description of why the sample was sequenced providing specific details.",
        "guidance": "Provide an expanded description of why the sample was sequenced using free text. The description may include the importance of the sequences for a particular public health investigation/surveillance activity/research question. Suggested standardized descriotions include: Screened for S gene target failure (S dropout), Screened for mink variants, Screened for B.1.1.7 variant, Screened for B.1.135 variant, Screened for P.1 variant, Screened due to travel history, Screened due to close contact with infected individual, Assessing public health control measures, Determining early introductions and spread, Investigating airline-related exposures, Investigating temporary foreign worker, Investigating remote regions, Investigating health care workers, Investigating schools/universities, Investigating reinfection.",
        "examples": "Screened for S gene target failure (S dropout)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Details on the Reason for Sequencing"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_REASON_FOR_SEQUENCING_DETAILS"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "purpose of sequencing details"
            }
          ]
        }
      },
      {
        "fieldName": "sequencing date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the sample was sequenced.",
        "guidance": "ISO 8601 standard \"YYYY-MM-DD\".",
        "examples": "2020-06-22",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "sequencing date"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sequencing date"
            }
          ]
        }
      },
      {
        "fieldName": "library ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The user-specified identifier for the library prepared for sequencing.",
        "guidance": "The library name should be unique, and can be an autogenerated ID from your LIMS, or modification of the isolate ID.",
        "examples": "XYZ_123345",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "library ID"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "library ID"
            }
          ]
        }
      },
      {
        "fieldName": "amplicon size",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The length of the amplicon generated by PCR amplification.",
        "guidance": "Provide the amplicon size, including the units.",
        "examples": "300bp",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "amplicon size"
            }
          ]
        }
      },
      {
        "fieldName": "library preparation kit",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the DNA library preparation kit used to generate the library being sequenced.",
        "guidance": "Provide the name of the library preparation kit used.",
        "examples": "Nextera XT",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "library preparation kit"
            }
          ]
        }
      },
      {
        "fieldName": "flow cell barcode",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The barcode of the flow cell used for sequencing.",
        "guidance": "Provide the barcode of the flow cell used for sequencing the sample.",
        "examples": "FAB06069",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "flow cell barcode"
            }
          ]
        }
      },
      {
        "fieldName": "sequencing instrument",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "multiple",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The model of the sequencing instrument used.",
        "guidance": "Select a sequencing instrument from the picklist provided in the template.",
        "examples": "MinIon",
        "exportField": {
          "GISAID": [
            {
              "field": "Sequencing technology"
            }
          ],
          "CNPHI": [
            {
              "field": "Sequencing Instrument"
            }
          ],
          "NML_LIMS": [
            {
              "field": "ANALYSIS"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sequencing instrument"
            }
          ]
        },
        "schema:ItemList": {
          "Illumina": {
            "schema:ItemList": {
              "Illumina Genome Analyzer": {
                "schema:ItemList": {
                  "Illumina Genome Analyzer II": {},
                  "Illumina Genome Analyzer IIx": {}
                }
              },
              "Illumina HiScanSQ": {},
              "Illumina HiSeq": {},
              "Illumina HiSeq X": {
                "schema:ItemList": {
                  "Illumina HiSeq X Five": {},
                  "Illumina HiSeq X Ten": {}
                }
              },
              "Illumina HiSeq 1000": {},
              "Illumina HiSeq 1500": {},
              "Illumina HiSeq 2000": {},
              "Illumina HiSeq 2500": {},
              "Illumina HiSeq 3000": {},
              "Illumina HiSeq 4000": {},
              "Illumina iSeq": {
                "schema:ItemList": {
                  "Illumina iSeq 100": {}
                }
              },
              "Illumina NovaSeq": {
                "schema:ItemList": {
                  "Illumina NovaSeq 6000": {}
                }
              },
              "Illumina MiniSeq": {},
              "Illumina MiSeq": {},
              "Illumina NextSeq": {},
              "Illumina NextSeq 500": {},
              "Illumina NextSeq 550": {},
              "Illumina NextSeq 2000": {}
            }
          },
          "Pacific Biosciences": {
            "schema:ItemList": {
              "PacBio RS": {},
              "PacBio RS II": {},
              "PacBio Sequel": {},
              "PacBio Sequel II": {}
            }
          },
          "Ion Torrent": {
            "schema:ItemList": {
              "Ion Torrent PGM": {},
              "Ion Torrent Proton": {},
              "Ion Torrent S5 XL": {},
              "Ion Torrent S5": {}
            }
          },
          "Oxford Nanopore": {
            "schema:ItemList": {
              "Oxford Nanopore GridION": {},
              "Oxford Nanopore MinION": {},
              "Oxford Nanopore PromethION": {}
            }
          },
          "BGI Genomics": {
            "schema:ItemList": {
              "BGI Genomics BGISEQ-500": {}
            }
          },
          "MGI": {
            "schema:ItemList": {
              "MGI DNBSEQ-T7": {},
              "MGI DNBSEQ-G400": {},
              "MGI DNBSEQ-G400 FAST": {},
              "MGI DNBSEQ-G50": {}
            }
          }
        }
      },
      {
        "fieldName": "sequencing protocol name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The name and version number of the sequencing protocol used.",
        "guidance": "Provide the name and version of the sequencing protocol e.g. 1D_DNA_MinION",
        "examples": "https://www.protocols.io/view/covid-19-artic-v3-illumina-library-construction-an-bibtkann",
        "exportField": {
          "CNPHI": [
            {
              "field": "Sequencing Protocol Name"
            }
          ],
          "NML_LIMS": [
            {
              "field": "sequencing protocol name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "sequencing protocol name"
            }
          ]
        }
      },
      {
        "fieldName": "sequencing protocol",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The protocol used to generate the sequence.",
        "guidance": "Provide a free text description of the methods and materials used to generate the sequence. Suggested text, fill in information where indicated.: \"Viral sequencing was performed following a tiling amplicon strategy using the <fill in> primer scheme. Sequencing was performed using a <fill in> sequencing instrument. Libraries were prepared using <fill in> library kit. \"",
        "examples": "Genomes were generated through amplicon sequencing of 1200 bp amplicons with Freed schema primers. Libraries were created using Illumina DNA Prep kits, and sequence data was produced using Miseq Micro v2 (500 cycles) sequencing kits.",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_TESTING_PROTOCOL"
            }
          ]
        }
      },
      {
        "fieldName": "sequencing kit number",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The manufacturer's kit number.",
        "guidance": "Alphanumeric value.",
        "examples": "AB456XYZ789",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "sequencing kit number"
            }
          ]
        }
      },
      {
        "fieldName": "amplicon pcr primer scheme",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The specifications of the primers (primer sequences, binding positions, fragment size generated etc) used to generate the amplicons to be sequenced.",
        "guidance": "Provide the name and version of the primer scheme used to generate the amplicons for sequencing.",
        "examples": "https://github.com/joshquick/artic-ncov2019/blob/master/primer_schemes/nCoV-2019/V3/nCoV-2019.tsv",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "amplicon pcr primer scheme"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Bioinformatics and QC metrics",
    "children": [
      {
        "fieldName": "raw sequence data processing method",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
        "guidance": "Provide the software name followed by the version e.g. Trimmomatic v. 0.38, Porechop v. 0.2.3",
        "examples": "Porechop 0.2.3",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "raw sequence data processing method"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "raw sequence data processing method"
            }
          ]
        }
      },
      {
        "fieldName": "dehosting method",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The method used to remove host reads from the pathogen sequence.",
        "guidance": "Provide the name and version number of the software used to remove host reads.",
        "examples": "Nanostripper",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "dehosting method"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "dehosting method"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the consensus sequence.",
        "guidance": "Provide the name and version number of the consensus sequence.",
        "examples": "ncov123assembly3",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "consensus sequence name"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence filename",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the consensus sequence file.",
        "guidance": "Provide the name and version number of the consensus sequence FASTA file.",
        "examples": "ncov123assembly.fasta",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "consensus sequence filename"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence filepath",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The filepath of the consesnsus sequence file.",
        "guidance": "Provide the filepath of the consensus sequence FASTA file.",
        "examples": "/User/Documents/RespLab/Data/ncov123assembly.fasta",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "consensus sequence filepath"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence software name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The name of software used to generate the consensus sequence.",
        "guidance": "Provide the name of the software used to generate the consensus sequence.",
        "examples": "Ivar",
        "exportField": {
          "CNPHI": [
            {
              "field": "consensus sequence"
            }
          ],
          "NML_LIMS": [
            {
              "field": "Consensus Sequence Method Name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "consensus sequence software name"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence software version",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The version of the software used to generate the consensus sequence.",
        "guidance": "Provide the version of the software used to generate the consensus sequence.",
        "examples": "1.3",
        "exportField": {
          "CNPHI": [
            {
              "field": "consensus sequence"
            }
          ],
          "NML_LIMS": [
            {
              "field": "Consensus Sequence Method Version Name"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "consensus sequence software version"
            }
          ]
        }
      },
      {
        "fieldName": "breadth of coverage value",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The percentage of the reference genome covered by the sequenced data, to a prescribed depth.",
        "guidance": "Provide value as a percent.",
        "examples": "95%",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "breadth of coverage value"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "breadth of coverage value"
            }
          ]
        }
      },
      {
        "fieldName": "depth of coverage value",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average number of reads representing a given nucleotide in the reconstructed sequence.",
        "guidance": "Provide value as a fold of coverage.",
        "examples": "400x",
        "exportField": {
          "GISAID": [
            {
              "field": "Coverage"
            }
          ],
          "NML_LIMS": [
            {
              "field": "depth of coverage value"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "depth of coverage value"
            }
          ]
        }
      },
      {
        "fieldName": "depth of coverage threshold",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The threshold used as a cut-off for the depth of coverage.",
        "guidance": "Provide the threshold fold coverage.",
        "examples": "100x",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "depth of coverage threshold"
            }
          ]
        }
      },
      {
        "fieldName": "r1 fastq filename",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The user-specified filename of the r1 FASTQ file.",
        "guidance": "Provide the r1 FASTQ filename.",
        "examples": "ABC123_S1_L001_R1_001.fastq.gz",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "r1 fastq filename"
            }
          ]
        }
      },
      {
        "fieldName": "r2 fastq filename",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The user-specified filename of the r2 FASTQ file.",
        "guidance": "Provide the r2 FASTQ filename.",
        "examples": "ABC123_S1_L001_R2_001.fastq.gz",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "r2 fastq filename"
            }
          ]
        }
      },
      {
        "fieldName": "r1 fastq filepath",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The location of the r1 FASTQ file within a user's file system.",
        "guidance": "Provide the filepath for the r1 FASTQ file. This information aids in data management. ",
        "examples": "/User/Documents/RespLab/Data/ABC123_S1_L001_R1_001.fastq.gz",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "r1 fastq filepath"
            }
          ]
        }
      },
      {
        "fieldName": "r2 fastq filepath",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The location of the r2 FASTQ file within a user's file system.",
        "guidance": "Provide the filepath for the r2 FASTQ file. This information aids in data management. ",
        "examples": "/User/Documents/RespLab/Data/ABC123_S1_L001_R2_001.fastq.gz",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "r2 fastq filepath"
            }
          ]
        }
      },
      {
        "fieldName": "fast5 filename",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The user-specified filename of the FAST5 file.",
        "guidance": "Provide the FAST5 filename.",
        "examples": "rona123assembly.fast5",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "fast5 filename"
            }
          ]
        }
      },
      {
        "fieldName": "fast5 filepath",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The location of the FAST5 file within a user's file system.",
        "guidance": "Provide the filepath for the FAST5 file. This information aids in data management. ",
        "examples": "/User/Documents/RespLab/Data/rona123assembly.fast5",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "fast5 filepath"
            }
          ]
        }
      },
      {
        "fieldName": "number of base pairs sequenced",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The number of total base pairs generated by the sequencing process.",
        "guidance": "Provide a numerical value (no need to include units).",
        "examples": "387566",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "number of base pairs sequenced"
            }
          ]
        }
      },
      {
        "fieldName": "consensus genome length",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Size of the reconstructed genome described as the number of base pairs.",
        "guidance": "Provide a numerical value (no need to include units).",
        "examples": "38677",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "consensus genome length"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "consensus genome length"
            }
          ]
        }
      },
      {
        "fieldName": "Ns per 100 kbp",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "0",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The number of N symbols present in the consensus fasta sequence, per 100kbp of sequence.",
        "guidance": "Provide a numerical value (no need to include units).",
        "examples": "330",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "Ns per 100 kbp"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "Ns per 100 kbp"
            }
          ]
        }
      },
      {
        "fieldName": "reference genome accession",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A persistent, unique identifier of a genome database entry.",
        "guidance": "Provide the accession number of the reference genome.",
        "examples": "NC_045512.2",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "reference genome accession"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "reference genome accession"
            }
          ]
        }
      },
      {
        "fieldName": "bioinformatics protocol",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name and version number of the bioinformatics protocol used.",
        "guidance": "Further details regarding the methods used to process raw data, and/or generate assemblies, and/or generate consensus sequences can be provided in an SOP or protocol. Provide the name and version number of the protocol.",
        "examples": "https://www.protocols.io/groups/cphln-sarscov2-sequencing-consortium/members",
        "exportField": {
          "CNPHI": [
            {
              "field": "Bioinformatics Protocol"
            }
          ],
          "NML_LIMS": [
            {
              "field": "bioinformatics protocol"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "bioinformatics protocol"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Lineage and Variant information",
    "children": [
      {
        "fieldName": "lineage/clade name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the lineage or clade.",
        "guidance": "Provide the Pangolin or Nextstrain lineage/clade name.",
        "examples": "B.1.1.7",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_LINEAGE_CLADE_NAME"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "lineage/clade name"
            }
          ]
        }
      },
      {
        "fieldName": "lineage/clade analysis software name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the software used to determine the lineage/clade.",
        "guidance": "Provide the name of the software used to determine the lineage/clade.",
        "examples": "Pangolin",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_LINEAGE_CLADE_SOFTWARE"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "lineage/clade analysis software name"
            }
          ]
        }
      },
      {
        "fieldName": "lineage/clade analysis software version",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The version of the software used to determine the lineage/clade.",
        "guidance": "Provide the version of the software used ot determine the lineage/clade.",
        "examples": "2.1.10",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_LINEAGE_CLADE_VERSION"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "lineage/clade analysis software version"
            }
          ]
        }
      },
      {
        "fieldName": "variant designation",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The variant classification of the lineage/clade i.e. variant, variant of concern.",
        "guidance": "If the lineage/clade is considered a Variant of Concern, select Variant of Concern from the pick list. If the lineage/clade contains mutations of concern (mutations that increase transmission, clincal severity, or other epidemiological fa ctors) but it not a global Variant of Concern, select Variant. If the lineage/clade does not contain mutations of concern, leave blank.",
        "examples": "Variant of Concern",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VARIANT_DESIGNATION"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "variant designation"
            }
          ]
        },
        "schema:ItemList": {
          "Variant of Concern (VOC)": {},
          "Variant of Interest (VOI)": {}
        }
      },
      {
        "fieldName": "variant evidence",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The evidence used to make the variant determination.",
        "guidance": "Select whether the sample was screened using RT-qPCR or by sequencing from the pick list.",
        "examples": "RT-qPCR",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VARIANT_EVIDENCE"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "variant evidence"
            }
          ]
        },
        "schema:ItemList": {
          "RT-qPCR": {},
          "Sequencing": {}
        }
      },
      {
        "fieldName": "variant evidence details",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Details about the evidence used to make the variant determination.",
        "guidance": "Provide the assay and list the set of lineage-defining mutations used to make the variant determination. If there are mutations of interest/concern observed in addition to lineage-defining mutations, describe those here.",
        "examples": "Lineage-defining mutations: ORF1ab (K1655N), Spike (K417N, E484K, N501Y, D614G, A701V), N (T205I), E (P71L).",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VARIANT_EVIDENCE_DETAILS"
            }
          ],
          "VirusSeq_Portal": [
            {
              "field": "variant evidence details"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Pathogen diagnostic testing",
    "children": [
      {
        "fieldName": "gene name 1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the gene used in the diagnostic RT-PCR test.",
        "guidance": "Provide the full name of the gene used in the test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI",
        "examples": "E gene (orf4)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 1"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #1"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "gene_name_1"
            }
          ]
        },
        "schema:ItemList": {
          "E gene (orf4)": {
            "exportField": {
              "CNPHI": [
                {
                  "value": "E gene"
                }
              ],
              "NML_LIMS": [
                {
                  "value": "E gene"
                }
              ]
            }
          },
          "M gene (orf5)": {},
          "N gene (orf9)": {},
          "Spike gene (orf2)": {},
          "orf1ab (rep)": {
            "schema:ItemList": {
              "orf1a (pp1a)": {
                "schema:ItemList": {
                  "nsp11": {}
                }
              },
              "nsp1": {},
              "nsp2": {},
              "nsp3": {},
              "nsp4": {},
              "nsp5": {},
              "nsp6": {},
              "nsp7": {},
              "nsp8": {},
              "nsp9": {},
              "nsp10": {},
              "RdRp gene (nsp12)": {},
              "hel gene (nsp13)": {},
              "exoN gene (nsp14)": {},
              "nsp15": {},
              "nsp16": {}
            }
          },
          "orf3a": {},
          "orf3b": {},
          "orf6 (ns6)": {},
          "orf7a": {},
          "orf7b (ns7b)": {},
          "orf8 (ns8)": {},
          "orf9b": {},
          "orf9c": {},
          "orf10": {},
          "orf14": {},
          "SARS-COV-2 5' UTR": {}
        }
      },
      {
        "fieldName": "diagnostic pcr protocol 1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name and version number of the protocol used for diagnostic marker amplification.",
        "guidance": "The name and version number of the protocol used for carrying out a diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control.",
        "examples": "EGenePCRTest 2"
      },
      {
        "fieldName": "diagnostic pcr Ct value 1",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
        "guidance": "Provide the CT value of the sample from the diagnostic RT-PCR test.",
        "examples": "21",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 1 CT Value"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #1 CT Value"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "diagnostic_PCR_CT_value_1"
            }
          ]
        }
      },
      {
        "fieldName": "gene name 2",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "gene name 1",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the gene used in the diagnostic RT-PCR test.",
        "guidance": "Provide the full name of another gene used in an RT-PCR test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI",
        "examples": "RdRp gene (nsp12)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 2"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #2"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "gene_name_2"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "diagnostic pcr protocol 2",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name and version number of the protocol used for diagnostic marker amplification.",
        "guidance": "The name and version number of the protocol used for carrying out a second diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control.",
        "examples": "RdRpGenePCRTest 3"
      },
      {
        "fieldName": "diagnostic pcr Ct value 2",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
        "guidance": "Provide the CT value of the sample from the second diagnostic RT-PCR test.",
        "examples": "36",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 2 CT Value"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #2 CT Value"
            }
          ],
          "BIOSAMPLE": [
            {
              "field": "diagnostic_PCR_CT_value_2"
            }
          ]
        }
      },
      {
        "fieldName": "gene name 3",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "gene name 1",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the gene used in the diagnostic RT-PCR test.",
        "guidance": "Provide the full name of another gene used in an RT-PCR test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI",
        "examples": "RdRp gene (nsp12)",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 3"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #3"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "diagnostic pcr protocol 3",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name and version number of the protocol used for diagnostic marker amplification.",
        "guidance": "The name and version number of the protocol used for carrying out a second diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control.",
        "examples": "RdRpGenePCRTest 3"
      },
      {
        "fieldName": "diagnostic pcr Ct value 3",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
        "guidance": "Provide the CT value of the sample from the second diagnostic RT-PCR test.",
        "examples": "30",
        "exportField": {
          "CNPHI": [
            {
              "field": "Gene Target 3 CT Value"
            }
          ],
          "NML_LIMS": [
            {
              "field": "SUBMITTED_RESLT - Gene Target #3 CT Value"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Contributor acknowledgement",
    "children": [
      {
        "fieldName": "authors",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "Names of individuals contributing to the processes of sample collection, sequence generation, analysis, and data submission.",
        "guidance": "Include the first and last names of all individuals that should be attributed, separated by a comma.",
        "examples": "Tejinder Singh, Fei Hu, Joe Blogs",
        "exportField": {
          "GISAID": [
            {
              "field": "Authors"
            }
          ],
          "CNPHI": [
            {
              "field": "Authors"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_CANCOGEN_AUTHORS"
            }
          ]
        }
      },
      {
        "fieldName": "DataHarmonizer provenance",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "provenance",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The DataHarmonizer software version provenance.",
        "guidance": "The current software version information will be automatically generated in this field after the user utilizes the \"validate\" function. This information will be generated regardless as to whether the row is valid of not.",
        "examples": "DataHarmonizer provenance: v0.13.21",
        "exportField": {
          "GISAID": [
            {
              "field": "DataHarmonizer provenance"
            }
          ],
          "CNPHI": [
            {
              "field": "Additional Comments"
            }
          ],
          "NML_LIMS": [
            {
              "field": "HC_COMMENTS"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "Lake of the Woods District Hospital - Ontario",
    "children": []
  }
]