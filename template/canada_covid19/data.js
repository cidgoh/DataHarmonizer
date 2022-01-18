var DATA = [
  {
    "fieldName": "Database Identifiers",
    "children": [
      {
        "fieldName": "specimen collector sample ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001123",
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
        "ontology_id": "GENEPIO:0001202",
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
              "field": "HC_TEXT5"
            }
          ]
        }
      },
      {
        "fieldName": "third party lab sample ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001149",
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
              "field": "PH_ID_NUMBER_PRIMARY"
            }
          ]
        }
      },
      {
        "fieldName": "case ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100281",
        "datatype": "xs:unique",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "recommended",
        "description": "The identifier used to specify an epidemiologically detected case of disease.",
        "guidance": "Provide the case identifer. The case ID greatly facilitates linkage between laboratory and epidemiological data. The case ID may be considered identifiable information. Consult the data steward before sharing.",
        "examples": "ABCD1234",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_CASE_ID"
            }
          ]
        }
      },
      {
        "fieldName": "Related specimen primary ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001128",
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
        "description": "The primary ID of a related specimen previously submitted to the repository.",
        "guidance": "Store the primary ID of the related specimen previously submitted to the National Microbiology Laboratory so that the samples can be linked and tracked through the system.",
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
              "field": "PH_RELATED_PRIMARY_ID"
            }
          ]
        }
      },
      {
        "fieldName": "IRIDA sample name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001131",
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
        "ontology_id": "GENEPIO:0001133",
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
        "ontology_id": "GENEPIO:0001136",
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
        "ontology_id": "GENEPIO:0001139",
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
        "ontology_id": "GENEPIO:0001142",
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
        "ontology_id": "GENEPIO:0001145",
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
        "ontology_id": "GENEPIO:0001147",
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
          ],
          "VirusSeq_Portal": [
            {
              "field": "GISAID accession"
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
        "ontology_id": "GENEPIO:0001153",
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
          "Alberta Precision Labs (APL)": {
            "schema:ItemList": {
              "Alberta ProvLab North (APLN)": {},
              "Alberta ProvLab South (APLS)": {}
            }
          },
          "BCCDC Public Health Laboratory": {},
          "Dynacare": {},
          "Dynacare (Manitoba)": {},
          "Dynacare (Brampton)": {},
          "Eastern Ontario Regional Laboratory Association": {},
          "Hamilton Health Sciences": {},
          "The Hospital for Sick Children (SickKids)": {},
          "Laboratoire de sant\u00e9 publique du Qu\u00e9bec (LSPQ)": {},
          "Lake of the Woods District Hospital - Ontario": {},
          "Manitoba Cadham Provincial Laboratory": {},
          "McMaster University": {},
          "Mount Sinai Hospital": {},
          "National Microbiology Laboratory (NML)": {},
          "New Brunswick - Vitalit\u00e9 Health Network": {},
          "Newfoundland and Labrador - Eastern Health": {},
          "Nova Scotia Health Authority": {},
          "Nunuvut": {},
          "Ontario Institute for Cancer Research (OICR)": {},
          "Prince Edward Island - Health PEI": {},
          "Public Health Ontario (PHO)": {},
          "Queen's University / Kingston Health Sciences Centre": {},
          "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {},
          "St. John's Rehab at Sunnybrook Hospital": {},
          "Sunnybrook Health Sciences Centre": {},
          "Unity Health Toronto": {},
          "William Osler Health System": {}
        }
      },
      {
        "fieldName": "sample collector contact email",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001156",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The email address of the contact responsible for follow-up regarding the sample.",
        "guidance": "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca",
        "examples": "RespLab@lab.ca",
        "pattern": "^\\S+@\\S+\\.\\S+$",
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
        "ontology_id": "GENEPIO:0001158",
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
        "ontology_id": "GENEPIO:0001159",
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
          "Alberta Precision Labs (APL)": {
            "schema:ItemList": {
              "Alberta ProvLab North (APLN)": {},
              "Alberta ProvLab South (APLS)": {}
            }
          },
          "BCCDC Public Health Laboratory": {},
          "Canadore College": {},
          "The Centre for Applied Genomics (TCAG)": {},
          "Dynacare": {},
          "Dynacare (Brampton)": {},
          "Dynacare (Manitoba)": {},
          "The Hospital for Sick Children (SickKids)": {},
          "Laboratoire de sant\u00e9 publique du Qu\u00e9bec (LSPQ)": {},
          "Manitoba Cadham Provincial Laboratory": {},
          "McMaster University": {},
          "McGill University": {},
          "National Microbiology Laboratory (NML)": {},
          "New Brunswick - Vitalit\u00e9 Health Network": {},
          "Newfoundland and Labrador - Eastern Health": {},
          "Nova Scotia Health Authority": {},
          "Ontario Institute for Cancer Research (OICR)": {},
          "Prince Edward Island - Health PEI": {},
          "Public Health Ontario (PHO)": {},
          "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {},
          "Sunnybrook Health Sciences Centre": {},
          "Thunder Bay Regional Health Sciences Centre": {},
          "Queen's University / Kingston Health Sciences Centre": {}
        }
      },
      {
        "fieldName": "sequence submitter contact email",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001165",
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
        "ontology_id": "GENEPIO:0001167",
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
        "ontology_id": "GENEPIO:0001174",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "2019-10-01",
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
        "ontology_id": "GENEPIO:0001177",
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
          ]
        },
        "schema:ItemList": {
          "year": {
            "ontology_id": "UO:0000036"
          },
          "month": {
            "ontology_id": "UO:0000035"
          },
          "day": {
            "ontology_id": "UO:0000033"
          }
        }
      },
      {
        "fieldName": "sample received date",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001179",
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
        "ontology_id": "GENEPIO:0001181",
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
          "Afghanistan": {
            "ontology_id": "GAZ:00006882"
          },
          "Albania": {
            "ontology_id": "GAZ:00002953"
          },
          "Algeria": {
            "ontology_id": "GAZ:00000563"
          },
          "American Samoa": {
            "ontology_id": "GAZ:00003957"
          },
          "Andorra": {
            "ontology_id": "GAZ:00002948"
          },
          "Angola": {
            "ontology_id": "GAZ:00001095"
          },
          "Anguilla": {
            "ontology_id": "GAZ:00009159"
          },
          "Antarctica": {
            "ontology_id": "GAZ:00000462"
          },
          "Antigua and Barbuda": {
            "ontology_id": "GAZ:00006883"
          },
          "Argentina": {
            "ontology_id": "GAZ:00002928"
          },
          "Armenia": {
            "ontology_id": "GAZ:00004094"
          },
          "Aruba": {
            "ontology_id": "GAZ:00004025"
          },
          "Ashmore and Cartier Islands": {
            "ontology_id": "GAZ:00005901"
          },
          "Australia": {
            "ontology_id": "GAZ:00000463"
          },
          "Austria": {
            "ontology_id": "GAZ:00002942"
          },
          "Azerbaijan": {
            "ontology_id": "GAZ:00004941"
          },
          "Bahamas": {
            "ontology_id": "GAZ:00002733"
          },
          "Bahrain": {
            "ontology_id": "GAZ:00005281"
          },
          "Baker Island": {
            "ontology_id": "GAZ:00007117"
          },
          "Bangladesh": {
            "ontology_id": "GAZ:00003750"
          },
          "Barbados": {
            "ontology_id": "GAZ:00001251"
          },
          "Bassas da India": {
            "ontology_id": "GAZ:00005810"
          },
          "Belarus": {
            "ontology_id": "GAZ:00006886"
          },
          "Belgium": {
            "ontology_id": "GAZ:00002938"
          },
          "Belize": {
            "ontology_id": "GAZ:00002934"
          },
          "Benin": {
            "ontology_id": "GAZ:00000904"
          },
          "Bermuda": {
            "ontology_id": "GAZ:00001264"
          },
          "Bhutan": {
            "ontology_id": "GAZ:00003920"
          },
          "Bolivia": {
            "ontology_id": "GAZ:00002511"
          },
          "Borneo": {
            "ontology_id": "GAZ:00025355"
          },
          "Bosnia and Herzegovina": {
            "ontology_id": "GAZ:00006887"
          },
          "Botswana": {
            "ontology_id": "GAZ:00001097"
          },
          "Bouvet Island": {
            "ontology_id": "GAZ:00001453"
          },
          "Brazil": {
            "ontology_id": "GAZ:00002828"
          },
          "British Virgin Islands": {
            "ontology_id": "GAZ:00003961"
          },
          "Brunei": {
            "ontology_id": "GAZ:00003901"
          },
          "Bulgaria": {
            "ontology_id": "GAZ:00002950"
          },
          "Burkina Faso": {
            "ontology_id": "GAZ:00000905"
          },
          "Burundi": {
            "ontology_id": "GAZ:00001090"
          },
          "Cambodia": {
            "ontology_id": "GAZ:00006888"
          },
          "Cameroon": {
            "ontology_id": "GAZ:00001093"
          },
          "Canada": {
            "ontology_id": "GAZ:00002560"
          },
          "Cape Verde": {
            "ontology_id": "GAZ:00001227"
          },
          "Cayman Islands": {
            "ontology_id": "GAZ:00003986"
          },
          "Central African Republic": {
            "ontology_id": "GAZ:00001089"
          },
          "Chad": {
            "ontology_id": "GAZ:00000586"
          },
          "Chile": {
            "ontology_id": "GAZ:00002825"
          },
          "China": {
            "ontology_id": "GAZ:00002845"
          },
          "Christmas Island": {
            "ontology_id": "GAZ:00005915"
          },
          "Clipperton Island": {
            "ontology_id": "GAZ:00005838"
          },
          "Cocos Islands": {
            "ontology_id": "GAZ:00009721"
          },
          "Colombia": {
            "ontology_id": "GAZ:00002929"
          },
          "Comoros": {
            "ontology_id": "GAZ:00005820"
          },
          "Cook Islands": {
            "ontology_id": "GAZ:00053798"
          },
          "Coral Sea Islands": {
            "ontology_id": "GAZ:00005917"
          },
          "Costa Rica": {
            "ontology_id": "GAZ:00002901"
          },
          "Cote d'Ivoire": {
            "ontology_id": "GAZ:00000906"
          },
          "Croatia": {
            "ontology_id": "GAZ:00002719"
          },
          "Cuba": {
            "ontology_id": "GAZ:00003762"
          },
          "Curacao": {
            "ontology_id": "GAZ:00012582"
          },
          "Cyprus": {
            "ontology_id": "GAZ:00004006"
          },
          "Czech Republic": {
            "ontology_id": "GAZ:00002954"
          },
          "Democratic Republic of the Congo": {
            "ontology_id": "GAZ:00001086"
          },
          "Denmark": {
            "ontology_id": "GAZ:00005852"
          },
          "Djibouti": {
            "ontology_id": "GAZ:00000582"
          },
          "Dominica": {
            "ontology_id": "GAZ:00006890"
          },
          "Dominican Republic": {
            "ontology_id": "GAZ:00003952"
          },
          "Ecuador": {
            "ontology_id": "GAZ:00002912"
          },
          "Egypt": {
            "ontology_id": "GAZ:00003934"
          },
          "El Salvador": {
            "ontology_id": "GAZ:00002935"
          },
          "Equatorial Guinea": {
            "ontology_id": "GAZ:00001091"
          },
          "Eritrea": {
            "ontology_id": "GAZ:00000581"
          },
          "Estonia": {
            "ontology_id": "GAZ:00002959"
          },
          "Eswatini": {
            "ontology_id": "GAZ:00001099"
          },
          "Ethiopia": {
            "ontology_id": "GAZ:00000567"
          },
          "Europa Island": {
            "ontology_id": "GAZ:00005811"
          },
          "Falkland Islands (Islas Malvinas)": {
            "ontology_id": "GAZ:00001412"
          },
          "Faroe Islands": {
            "ontology_id": "GAZ:00059206"
          },
          "Fiji": {
            "ontology_id": "GAZ:00006891"
          },
          "Finland": {
            "ontology_id": "GAZ:00002937"
          },
          "France": {
            "ontology_id": "GAZ:00003940"
          },
          "French Guiana": {
            "ontology_id": "GAZ:00002516"
          },
          "French Polynesia": {
            "ontology_id": "GAZ:00002918"
          },
          "French Southern and Antarctic Lands": {
            "ontology_id": "GAZ:00003753"
          },
          "Gabon": {
            "ontology_id": "GAZ:00001092"
          },
          "Gambia": {
            "ontology_id": "GAZ:00000907"
          },
          "Gaza Strip": {
            "ontology_id": "GAZ:00009571"
          },
          "Georgia": {
            "ontology_id": "GAZ:00004942"
          },
          "Germany": {
            "ontology_id": "GAZ:00002646"
          },
          "Ghana": {
            "ontology_id": "GAZ:00000908"
          },
          "Gibraltar": {
            "ontology_id": "GAZ:00003987"
          },
          "Glorioso Islands": {
            "ontology_id": "GAZ:00005808"
          },
          "Greece": {
            "ontology_id": "GAZ:00002945"
          },
          "Greenland": {
            "ontology_id": "GAZ:00001507"
          },
          "Grenada": {
            "ontology_id": "GAZ:02000573"
          },
          "Guadeloupe": {
            "ontology_id": "GAZ:00067142"
          },
          "Guam": {
            "ontology_id": "GAZ:00003706"
          },
          "Guatemala": {
            "ontology_id": "GAZ:00002936"
          },
          "Guernsey": {
            "ontology_id": "GAZ:00001550"
          },
          "Guinea": {
            "ontology_id": "GAZ:00000909"
          },
          "Guinea-Bissau": {
            "ontology_id": "GAZ:00000910"
          },
          "Guyana": {
            "ontology_id": "GAZ:00002522"
          },
          "Haiti": {
            "ontology_id": "GAZ:00003953"
          },
          "Heard Island and McDonald Islands": {
            "ontology_id": "GAZ:00009718"
          },
          "Honduras": {
            "ontology_id": "GAZ:00002894"
          },
          "Hong Kong": {
            "ontology_id": "GAZ:00003203"
          },
          "Howland Island": {
            "ontology_id": "GAZ:00007120"
          },
          "Hungary": {
            "ontology_id": "GAZ:00002952"
          },
          "Iceland": {
            "ontology_id": "GAZ:00000843"
          },
          "India": {
            "ontology_id": "GAZ:00002839"
          },
          "Indonesia": {
            "ontology_id": "GAZ:00003727"
          },
          "Iran": {
            "ontology_id": "GAZ:00004474"
          },
          "Iraq": {
            "ontology_id": "GAZ:00004483"
          },
          "Ireland": {
            "ontology_id": "GAZ:00002943"
          },
          "Isle of Man": {
            "ontology_id": "GAZ:00052477"
          },
          "Israel": {
            "ontology_id": "GAZ:00002476"
          },
          "Italy": {
            "ontology_id": "GAZ:00002650"
          },
          "Jamaica": {
            "ontology_id": "GAZ:00003781"
          },
          "Jan Mayen": {
            "ontology_id": "GAZ:00005853"
          },
          "Japan": {
            "ontology_id": "GAZ:00002747"
          },
          "Jarvis Island": {
            "ontology_id": "GAZ:00007118"
          },
          "Jersey": {
            "ontology_id": "GAZ:00001551"
          },
          "Johnston Atoll": {
            "ontology_id": "GAZ:00007114"
          },
          "Jordan": {
            "ontology_id": "GAZ:00002473"
          },
          "Juan de Nova Island": {
            "ontology_id": "GAZ:00005809"
          },
          "Kazakhstan": {
            "ontology_id": "GAZ:00004999"
          },
          "Kenya": {
            "ontology_id": "GAZ:00001101"
          },
          "Kerguelen Archipelago": {
            "ontology_id": "GAZ:00005682"
          },
          "Kingman Reef": {
            "ontology_id": "GAZ:00007116"
          },
          "Kiribati": {
            "ontology_id": "GAZ:00006894"
          },
          "Kosovo": {
            "ontology_id": "GAZ:00011337"
          },
          "Kuwait": {
            "ontology_id": "GAZ:00005285"
          },
          "Kyrgyzstan": {
            "ontology_id": "GAZ:00006893"
          },
          "Laos": {
            "ontology_id": "GAZ:00006889"
          },
          "Latvia": {
            "ontology_id": "GAZ:00002958"
          },
          "Lebanon": {
            "ontology_id": "GAZ:00002478"
          },
          "Lesotho": {
            "ontology_id": "GAZ:00001098"
          },
          "Liberia": {
            "ontology_id": "GAZ:00000911"
          },
          "Libya": {
            "ontology_id": "GAZ:00000566"
          },
          "Liechtenstein": {
            "ontology_id": "GAZ:00003858"
          },
          "Line Islands": {
            "ontology_id": "GAZ:00007144"
          },
          "Lithuania": {
            "ontology_id": "GAZ:00002960"
          },
          "Luxembourg": {
            "ontology_id": "GAZ:00002947"
          },
          "Macau": {
            "ontology_id": "GAZ:00003202"
          },
          "Madagascar": {
            "ontology_id": "GAZ:00001108"
          },
          "Malawi": {
            "ontology_id": "GAZ:00001105"
          },
          "Malaysia": {
            "ontology_id": "GAZ:00003902"
          },
          "Maldives": {
            "ontology_id": "GAZ:00006924"
          },
          "Mali": {
            "ontology_id": "GAZ:00000584"
          },
          "Malta": {
            "ontology_id": "GAZ:00004017"
          },
          "Marshall Islands": {
            "ontology_id": "GAZ:00007161"
          },
          "Martinique": {
            "ontology_id": "GAZ:00067143"
          },
          "Mauritania": {
            "ontology_id": "GAZ:00000583"
          },
          "Mauritius": {
            "ontology_id": "GAZ:00003745"
          },
          "Mayotte": {
            "ontology_id": "GAZ:00003943"
          },
          "Mexico": {
            "ontology_id": "GAZ:00002852"
          },
          "Micronesia": {
            "ontology_id": "GAZ:00005862"
          },
          "Midway Islands": {
            "ontology_id": "GAZ:00007112"
          },
          "Moldova": {
            "ontology_id": "GAZ:00003897"
          },
          "Monaco": {
            "ontology_id": "GAZ:00003857"
          },
          "Mongolia": {
            "ontology_id": "GAZ:00008744"
          },
          "Montenegro": {
            "ontology_id": "GAZ:00006898"
          },
          "Montserrat": {
            "ontology_id": "GAZ:00003988"
          },
          "Morocco": {
            "ontology_id": "GAZ:00000565"
          },
          "Mozambique": {
            "ontology_id": "GAZ:00001100"
          },
          "Myanmar": {
            "ontology_id": "GAZ:00006899"
          },
          "Namibia": {
            "ontology_id": "GAZ:00001096"
          },
          "Nauru": {
            "ontology_id": "GAZ:00006900"
          },
          "Navassa Island": {
            "ontology_id": "GAZ:00007119"
          },
          "Nepal": {
            "ontology_id": "GAZ:00004399"
          },
          "Netherlands": {
            "ontology_id": "GAZ:00002946"
          },
          "New Caledonia": {
            "ontology_id": "GAZ:00005206"
          },
          "New Zealand": {
            "ontology_id": "GAZ:00000469"
          },
          "Nicaragua": {
            "ontology_id": "GAZ:00002978"
          },
          "Niger": {
            "ontology_id": "GAZ:00000585"
          },
          "Nigeria": {
            "ontology_id": "GAZ:00000912"
          },
          "Niue": {
            "ontology_id": "GAZ:00006902"
          },
          "Norfolk Island": {
            "ontology_id": "GAZ:00005908"
          },
          "North Korea": {
            "ontology_id": "GAZ:00002801"
          },
          "North Macedonia": {
            "ontology_id": "GAZ:00006895"
          },
          "North Sea": {
            "ontology_id": "GAZ:00002284"
          },
          "Northern Mariana Islands": {
            "ontology_id": "GAZ:00003958"
          },
          "Norway": {
            "ontology_id": "GAZ:00002699"
          },
          "Oman": {
            "ontology_id": "GAZ:00005283"
          },
          "Pakistan": {
            "ontology_id": "GAZ:00005246"
          },
          "Palau": {
            "ontology_id": "GAZ:00006905"
          },
          "Panama": {
            "ontology_id": "GAZ:00002892"
          },
          "Papua New Guinea": {
            "ontology_id": "GAZ:00003922"
          },
          "Paracel Islands": {
            "ontology_id": "GAZ:00010832"
          },
          "Paraguay": {
            "ontology_id": "GAZ:00002933"
          },
          "Peru": {
            "ontology_id": "GAZ:00002932"
          },
          "Philippines": {
            "ontology_id": "GAZ:00004525"
          },
          "Pitcairn Islands": {
            "ontology_id": "GAZ:00005867"
          },
          "Poland": {
            "ontology_id": "GAZ:00002939"
          },
          "Portugal": {
            "ontology_id": "GAZ:00004126"
          },
          "Puerto Rico": {
            "ontology_id": "GAZ:00006935"
          },
          "Qatar": {
            "ontology_id": "GAZ:00005286"
          },
          "Republic of the Congo": {
            "ontology_id": "GAZ:00001088"
          },
          "Reunion": {
            "ontology_id": "GAZ:00003945"
          },
          "Romania": {
            "ontology_id": "GAZ:00002951"
          },
          "Ross Sea": {
            "ontology_id": "GAZ:00023304"
          },
          "Russia": {
            "ontology_id": "GAZ:00002721"
          },
          "Rwanda": {
            "ontology_id": "GAZ:00001087"
          },
          "Saint Helena": {
            "ontology_id": "GAZ:00000849"
          },
          "Saint Kitts and Nevis": {
            "ontology_id": "GAZ:00006906"
          },
          "Saint Lucia": {
            "ontology_id": "GAZ:00006909"
          },
          "Saint Pierre and Miquelon": {
            "ontology_id": "GAZ:00003942"
          },
          "Saint Martin": {
            "ontology_id": "GAZ:00005841"
          },
          "Saint Vincent and the Grenadines": {
            "ontology_id": "GAZ:02000565"
          },
          "Samoa": {
            "ontology_id": "GAZ:00006910"
          },
          "San Marino": {
            "ontology_id": "GAZ:00003102"
          },
          "Sao Tome and Principe": {
            "ontology_id": "GAZ:00006927"
          },
          "Saudi Arabia": {
            "ontology_id": "GAZ:00005279"
          },
          "Senegal": {
            "ontology_id": "GAZ:00000913"
          },
          "Serbia": {
            "ontology_id": "GAZ:00002957"
          },
          "Seychelles": {
            "ontology_id": "GAZ:00006922"
          },
          "Sierra Leone": {
            "ontology_id": "GAZ:00000914"
          },
          "Singapore": {
            "ontology_id": "GAZ:00003923"
          },
          "Sint Maarten": {
            "ontology_id": "GAZ:00012579"
          },
          "Slovakia": {
            "ontology_id": "GAZ:00002956"
          },
          "Slovenia": {
            "ontology_id": "GAZ:00002955"
          },
          "Solomon Islands": {
            "ontology_id": "GAZ:00005275"
          },
          "Somalia": {
            "ontology_id": "GAZ:00001104"
          },
          "South Africa": {
            "ontology_id": "GAZ:00001094"
          },
          "South Georgia and the South Sandwich Islands": {
            "ontology_id": "GAZ:00003990"
          },
          "South Korea": {
            "ontology_id": "GAZ:00002802"
          },
          "South Sudan": {
            "ontology_id": "GAZ:00233439"
          },
          "Spain": {
            "ontology_id": "GAZ:00000591"
          },
          "Spratly Islands": {
            "ontology_id": "GAZ:00010831"
          },
          "Sri Lanka": {
            "ontology_id": "GAZ:00003924"
          },
          "State of Palestine": {
            "ontology_id": "GAZ:00002475"
          },
          "Sudan": {
            "ontology_id": "GAZ:00000560"
          },
          "Suriname": {
            "ontology_id": "GAZ:00002525"
          },
          "Svalbard": {
            "ontology_id": "GAZ:00005396"
          },
          "Swaziland": {
            "ontology_id": "GAZ:00001099"
          },
          "Sweden": {
            "ontology_id": "GAZ:00002729"
          },
          "Switzerland": {
            "ontology_id": "GAZ:00002941"
          },
          "Syria": {
            "ontology_id": "GAZ:00002474"
          },
          "Taiwan": {
            "ontology_id": "GAZ:00005341"
          },
          "Tajikistan": {
            "ontology_id": "GAZ:00006912"
          },
          "Tanzania": {
            "ontology_id": "GAZ:00001103"
          },
          "Thailand": {
            "ontology_id": "GAZ:00003744"
          },
          "Timor-Leste": {
            "ontology_id": "GAZ:00006913"
          },
          "Togo": {
            "ontology_id": "GAZ:00000915"
          },
          "Tokelau": {
            "ontology_id": "GAZ:00260188"
          },
          "Tonga": {
            "ontology_id": "GAZ:00006916"
          },
          "Trinidad and Tobago": {
            "ontology_id": "GAZ:00003767"
          },
          "Tromelin Island": {
            "ontology_id": "GAZ:00005812"
          },
          "Tunisia": {
            "ontology_id": "GAZ:00000562"
          },
          "Turkey": {
            "ontology_id": "GAZ:00000558"
          },
          "Turkmenistan": {
            "ontology_id": "GAZ:00005018"
          },
          "Turks and Caicos Islands": {
            "ontology_id": "GAZ:00003955"
          },
          "Tuvalu": {
            "ontology_id": "GAZ:00009715"
          },
          "United States of America": {
            "ontology_id": "GAZ:00002459"
          },
          "Uganda": {
            "ontology_id": "GAZ:00001102"
          },
          "Ukraine": {
            "ontology_id": "GAZ:00002724"
          },
          "United Arab Emirates": {
            "ontology_id": "GAZ:00005282"
          },
          "United Kingdom": {
            "ontology_id": "GAZ:00002637"
          },
          "Uruguay": {
            "ontology_id": "GAZ:00002930"
          },
          "Uzbekistan": {
            "ontology_id": "GAZ:00004979"
          },
          "Vanuatu": {
            "ontology_id": "GAZ:00006918"
          },
          "Venezuela": {
            "ontology_id": "GAZ:00002931"
          },
          "Viet Nam": {
            "ontology_id": "GAZ:00003756"
          },
          "Virgin Islands": {
            "ontology_id": "GAZ:00003959"
          },
          "Wake Island": {
            "ontology_id": "GAZ:00007111"
          },
          "Wallis and Futuna": {
            "ontology_id": "GAZ:00007191"
          },
          "West Bank": {
            "ontology_id": "GAZ:00009572"
          },
          "Western Sahara": {
            "ontology_id": "GAZ:00000564"
          },
          "Yemen": {
            "ontology_id": "GAZ:00005284"
          },
          "Zambia": {
            "ontology_id": "GAZ:00001107"
          },
          "Zimbabwe": {
            "ontology_id": "GAZ:00001106"
          }
        }
      },
      {
        "fieldName": "geo_loc_name (state/province/territory)",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001185",
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
            "ontology_id": "GAZ:00002566"
          },
          "British Columbia": {
            "ontology_id": "GAZ:00002562"
          },
          "Manitoba": {
            "ontology_id": "GAZ:00002571"
          },
          "New Brunswick": {
            "ontology_id": "GAZ:00002570"
          },
          "Newfoundland and Labrador": {
            "ontology_id": "GAZ:00002567"
          },
          "Northwest Territories": {
            "ontology_id": "GAZ:00002575"
          },
          "Nova Scotia": {
            "ontology_id": "GAZ:00002565"
          },
          "Nunavut": {
            "ontology_id": "GAZ:00002574"
          },
          "Ontario": {
            "ontology_id": "GAZ:00002563"
          },
          "Prince Edward Island": {
            "ontology_id": "GAZ:00002572"
          },
          "Quebec": {
            "ontology_id": "GAZ:00002569"
          },
          "Saskatchewan": {
            "ontology_id": "GAZ:00002564"
          },
          "Yukon": {
            "ontology_id": "GAZ:00002576"
          }
        }
      },
      {
        "fieldName": "geo_loc_name (city)",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001189",
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
          ]
        }
      },
      {
        "fieldName": "organism",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001191",
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
          "Severe acute respiratory syndrome coronavirus 2": {
            "ontology_id": "NCBITaxon:2697049"
          },
          "RaTG13": {
            "ontology_id": "NCBITaxon:2709072"
          },
          "RmYN02": {
            "ontology_id": "NCBITaxon NTR"
          }
        }
      },
      {
        "fieldName": "isolate",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001195",
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
        "guidance": "Provide the GISAID virus name, which should be written in the format \u201chCov-19/CANADA/2 digit provincial ISO code-xxxxx/year\u201d.",
        "examples": "hCov-19/CANADA/BC-prov_rona_99/2020",
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
            },
            {
              "field": "fasta header name"
            }
          ]
        }
      },
      {
        "fieldName": "purpose of sampling",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001198",
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
          "Cluster/Outbreak investigation": {
            "ontology_id": "HSO:0000371"
          },
          "Diagnostic testing": {
            "ontology_id": "HSO or NCIT NTR?"
          },
          "Research": {
            "ontology_id": "NCIT:c15429"
          },
          "Surveillance": {
            "ontology_id": "HSO:0000268"
          }
        }
      },
      {
        "fieldName": "purpose of sampling details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001200",
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
              "field": "PH_SAMPLING_DETAILS"
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
        "ontology_id": "GENEPIO:0001204",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
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
            "ontology_id": "OBI:0002600"
          },
          "RNA": {
            "ontology_id": "OBI:0000880"
          },
          "mRNA (cDNA)": {
            "ontology_id": "OBI:0002754"
          },
          "Nucleic acid": {
            "ontology_id": "OBI:0001010"
          },
          "Not Applicable": {
            "ontology_id": "GENEPIO:0001619"
          }
        }
      },
      {
        "fieldName": "Related specimen relationship type",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001209",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The relationship of the current specimen to the specimen/sample previously submitted to the repository.",
        "guidance": "Provide the tag that describes how the previous sample is related to the current sample being submitted from the pick list provided, so that the samples can be linked and tracked in the system.",
        "examples": "Specimen sampling methods testing",
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
              "field": "PH_RELATED_RELATIONSHIP_TYPE"
            }
          ]
        },
        "schema:ItemList": {
          "Acute": {
            "ontology_id": "HP:0011009"
          },
          "Convalescent": {},
          "Familial": {},
          "Follow-up": {
            "ontology_id": "EFO:0009642",
            "schema:ItemList": {
              "Reinfection testing": {}
            }
          },
          "Previously Submitted": {},
          "Sequencing/bioinformatics methods development/validation": {},
          "Specimen sampling methods testing": {}
        }
      },
      {
        "fieldName": "anatomical material",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001211",
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
            "ontology_id": "UBERON:0000178"
          },
          "Fluid": {
            "ontology_id": "UBERON:0006314",
            "schema:ItemList": {
              "Saliva": {
                "ontology_id": "UBERON:0001836"
              },
              "Fluid (cerebrospinal (CSF))": {
                "ontology_id": "UBERON:0001359"
              },
              "Fluid (pericardial)": {
                "ontology_id": "UBERON:0002409"
              },
              "Fluid (pleural)": {
                "ontology_id": "UBERON:0001087"
              },
              "Fluid (vaginal)": {
                "ontology_id": "UBERON:0036243"
              },
              "Fluid (amniotic)": {
                "ontology_id": "UBERON:0000173"
              }
            }
          },
          "Tissue": {
            "ontology_id": "UBERON:0000479"
          }
        }
      },
      {
        "fieldName": "anatomical part",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001214",
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
            "ontology_id": "UBERON:0001245"
          },
          "Buccal mucosa": {
            "ontology_id": "UBERON:0006956 "
          },
          "Duodenum": {
            "ontology_id": "UBERON:0002114"
          },
          "Eye": {
            "ontology_id": "UBERON:0000970"
          },
          "Intestine": {},
          "Rectum": {
            "ontology_id": "UBERON:0001052"
          },
          "Skin": {
            "ontology_id": "UBERON:0001003"
          },
          "Stomach": {
            "ontology_id": "UBERON:0000945"
          },
          "Upper respiratory tract": {
            "ontology_id": "UBERON:0001557",
            "schema:ItemList": {
              "Anterior Nares": {
                "ontology_id": "UBERON:2001427"
              },
              "Esophagus": {
                "ontology_id": "UBERON:0001043"
              },
              "Ethmoid sinus": {
                "ontology_id": "UBERON:0002453"
              },
              "Nasal Cavity": {
                "ontology_id": "UBERON:0001707 ",
                "schema:ItemList": {
                  "Middle Nasal Turbinate": {
                    "ontology_id": "UBERON:0005921 "
                  },
                  "Inferior Nasal Turbinate": {
                    "ontology_id": "UBERON:0005922"
                  }
                }
              },
              "Nasopharynx (NP)": {
                "ontology_id": "UBERON:0001728"
              },
              "Oropharynx (OP)": {
                "ontology_id": "UBERON:0001729"
              }
            }
          },
          "Lower respiratory tract": {
            "ontology_id": "UBERON:0001558",
            "schema:ItemList": {
              "Bronchus": {
                "ontology_id": "UBERON:0002185 "
              },
              "Lung": {
                "ontology_id": "UBERON:0002048",
                "schema:ItemList": {
                  "Bronchiole": {
                    "ontology_id": "UBERON:0002186"
                  },
                  "Alveolar sac": {
                    "ontology_id": "UBERON:0002169"
                  }
                }
              },
              "Pleural sac": {
                "ontology_id": "UBERON:0009778 ",
                "schema:ItemList": {
                  "Pleural cavity": {
                    "ontology_id": "UBERON:0002402"
                  }
                }
              },
              "Trachea": {
                "ontology_id": "UBERON:0003126"
              }
            }
          }
        }
      },
      {
        "fieldName": "body product",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001216",
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
            "ontology_id": "UBERON:0001988"
          },
          "Urine": {
            "ontology_id": "UBERON:0001088"
          },
          "Sweat": {
            "ontology_id": "UBERON:0001089"
          },
          "Mucus": {
            "ontology_id": "UBERON:0000912",
            "schema:ItemList": {
              "Sputum": {
                "ontology_id": "UBERON:0007311"
              }
            }
          },
          "Tear": {
            "ontology_id": "UBERON:0001827"
          },
          "Fluid (seminal)": {
            "ontology_id": "UBERON:0006530"
          },
          "Breast Milk": {
            "ontology_id": "UBERON:0001913"
          }
        }
      },
      {
        "fieldName": "environmental material",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001223",
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
            "ontology_id": "ENVO:03501208"
          },
          "Banknote": {
            "ontology_id": "ENVO:00003896"
          },
          "Bed rail": {
            "ontology_id": "ENVO:03501209"
          },
          "Building floor": {
            "ontology_id": "ENVO:01000486"
          },
          "Cloth": {
            "ontology_id": "ENVO:02000058"
          },
          "Control panel": {
            "ontology_id": "ENVO:03501210"
          },
          "Door": {
            "ontology_id": "ENVO:03501220"
          },
          "Door handle": {
            "ontology_id": "ENVO:03501211"
          },
          "Face mask": {
            "ontology_id": "OBI:0002787"
          },
          "Face shield": {
            "ontology_id": "OBI:0002791"
          },
          "Food": {
            "ontology_id": "FOODON:00002403"
          },
          "Food packaging": {
            "ontology_id": "FOODON:03490100"
          },
          "Glass": {
            "ontology_id": "ENVO:01000481"
          },
          "Handrail": {
            "ontology_id": "ENVO:03501212"
          },
          "Hospital gown": {
            "ontology_id": "OBI:0002792"
          },
          "Light switch": {
            "ontology_id": "ENVO:03501213"
          },
          "Locker": {
            "ontology_id": "ENVO:03501214"
          },
          "N95 mask": {
            "ontology_id": "OBI:0002790"
          },
          "Nurse call button": {
            "ontology_id": "ENVO:03501215"
          },
          "Paper": {
            "ontology_id": "ENVO:03501256"
          },
          "Particulate matter": {
            "ontology_id": "ENVO:01000060"
          },
          "Plastic": {
            "ontology_id": "ENVO:01000404"
          },
          "PPE gown": {
            "ontology_id": "OBI NTR?"
          },
          "Sewage": {
            "ontology_id": "ENVO:00002018"
          },
          "Sink": {
            "ontology_id": "ENVO:01000990"
          },
          "Soil": {
            "ontology_id": "ENVO:00001998"
          },
          "Stainless steel": {
            "ontology_id": "ENVO:03501216"
          },
          "Tissue paper": {
            "ontology_id": "ENVO:03501217"
          },
          "Toilet bowl": {
            "ontology_id": "ENVO:03501218"
          },
          "Water": {
            "ontology_id": "ENVO:00002006"
          },
          "Wastewater": {
            "ontology_id": "ENVO:00002001"
          },
          "Window": {
            "ontology_id": "ENVO:03501219"
          },
          "Wood": {
            "ontology_id": "ENVO:00002040"
          }
        }
      },
      {
        "fieldName": "environmental site",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001232",
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
            "ontology_id": "ENVO:03501135"
          },
          "Animal house": {
            "ontology_id": "ENVO:00003040"
          },
          "Bathroom": {
            "ontology_id": "ENVO:01000422"
          },
          "Clinical assessment centre": {
            "ontology_id": "ENVO:03501136"
          },
          "Conference venue": {
            "ontology_id": "ENVO:03501127"
          },
          "Corridor": {
            "ontology_id": "ENVO:03501121"
          },
          "Daycare": {
            "ontology_id": "ENVO:01000927"
          },
          "Emergency room (ER)": {
            "ontology_id": "ENVO:03501144"
          },
          "Family practice clinic": {
            "ontology_id": "ENVO:03501186"
          },
          "Group home": {
            "ontology_id": "ENVO:03501196"
          },
          "Homeless shelter": {
            "ontology_id": "ENVO:03501133"
          },
          "Hospital": {
            "ontology_id": "ENVO:00002173"
          },
          "Intensive Care Unit (ICU)": {
            "ontology_id": "ENVO:03501152"
          },
          "Long Term Care Facility": {
            "ontology_id": "ENVO:03501194"
          },
          "Patient room": {
            "ontology_id": "ENVO:03501180"
          },
          "Prison": {
            "ontology_id": "ENVO:03501204"
          },
          "Production Facility": {
            "ontology_id": "ENVO:01000536"
          },
          "School": {
            "ontology_id": "ENVO:03501130"
          },
          "Sewage Plant": {
            "ontology_id": "ENVO:00003043"
          },
          "Subway train": {
            "ontology_id": "ENVO:03501109"
          },
          "Wet market": {
            "ontology_id": "ENVO:03501198"
          }
        }
      },
      {
        "fieldName": "collection device",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001234",
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
            "ontology_id": "ENVO:00003968"
          },
          "Blood Collection Tube": {
            "ontology_id": "OBI:0002859"
          },
          "Bronchoscope": {
            "ontology_id": "OBI:0002826"
          },
          "Collection Container": {
            "ontology_id": "OBI:0002088"
          },
          "Collection Cup": {
            "ontology_id": "OBI NTR?"
          },
          "Fibrobronchoscope Brush": {
            "ontology_id": "OBI:0002825"
          },
          "Filter": {
            "ontology_id": "ENVO NTR"
          },
          "Fine Needle": {
            "ontology_id": "OBI:0002827"
          },
          "Microcapillary tube": {
            "ontology_id": "OBI:0002858"
          },
          "Micropipette": {
            "ontology_id": "OBI:0001128"
          },
          "Needle": {
            "ontology_id": "OBI:0000436"
          },
          "Serum Collection Tube": {
            "ontology_id": "OBI:0002860"
          },
          "Sputum Collection Tube": {
            "ontology_id": "OBI:0002861"
          },
          "Suction Catheter": {
            "ontology_id": "OBI:0002831"
          },
          "Swab": {
            "ontology_id": "OBI NTR?"
          },
          "Urine Collection Tube": {
            "ontology_id": "OBI:0002862"
          },
          "Virus Transport Medium": {
            "ontology_id": "OBI:0002866"
          }
        }
      },
      {
        "fieldName": "collection method",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001241",
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
            "ontology_id": "OBI NTR"
          },
          "Aspiration": {
            "ontology_id": "OBI NTR",
            "schema:ItemList": {
              "Suprapubic Aspiration": {
                "ontology_id": "OBI NTR"
              },
              "Tracheal aspiration": {
                "ontology_id": "OBI NTR"
              },
              "Vacuum Aspiration": {
                "ontology_id": "OBI NTR"
              }
            }
          },
          "Biopsy": {
            "ontology_id": "OBI:0002650",
            "schema:ItemList": {
              "Needle Biopsy": {
                "ontology_id": "OBI:0002651"
              }
            }
          },
          "Filtration": {
            "ontology_id": "OBI:0302885",
            "schema:ItemList": {
              "Air filtration": {
                "ontology_id": "OBI NTR"
              }
            }
          },
          "Lavage": {
            "ontology_id": "OBI:0600044 ",
            "schema:ItemList": {
              "Bronchoalveolar lavage (BAL)": {
                "ontology_id": "OBI NTR"
              },
              "Gastric Lavage": {
                "ontology_id": "OBI NTR"
              }
            }
          },
          "Lumbar Puncture": {
            "ontology_id": "OBI NTR"
          },
          "Necropsy": {
            "ontology_id": "OBI NTR"
          },
          "Phlebotomy": {
            "ontology_id": "OBI NTR"
          },
          "Rinsing": {
            "ontology_id": "OBI NTR",
            "schema:ItemList": {
              "Saline gargle (mouth rinse and gargle)": {
                "ontology_id": "OBI NTR"
              }
            }
          },
          "Scraping": {
            "ontology_id": "OBI NTR"
          },
          "Swabbing": {
            "ontology_id": "OBI NTR",
            "schema:ItemList": {
              "Finger Prick": {
                "ontology_id": "OBI NTR"
              }
            }
          },
          "Washout Tear Collection": {
            "ontology_id": "OBI NTR"
          }
        }
      },
      {
        "fieldName": "collection protocol",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001243",
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
        "ontology_id": "GENEPIO:0001253",
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
          "Virus passage": {
            "ontology_id": "OBI NTR?"
          },
          "RNA re-extraction (post RT-PCR)": {
            "ontology_id": "OBI NTR?"
          },
          "Specimens pooled": {
            "ontology_id": "OBI:0600016"
          }
        }
      },
      {
        "fieldName": "lab host",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001255",
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
          "293/ACE2 cell line": {
            "ontology_id": "BTO NTR"
          },
          "Caco2 cell line": {
            "ontology_id": "BTO:0000195 "
          },
          "Calu3 cell line": {
            "ontology_id": "BTO:0002750"
          },
          "EFK3B cell line": {
            "ontology_id": "BTO NTR"
          },
          "HEK293T cell line": {
            "ontology_id": "BTO:0002181"
          },
          "HRCE cell line": {
            "ontology_id": "BTO NTR"
          },
          "Huh7 cell line": {
            "ontology_id": "BTO:0001950"
          },
          "LLCMk2 cell line": {
            "ontology_id": "CLO:0007330"
          },
          "MDBK cell line": {
            "ontology_id": "BTO:0000836 "
          },
          "NHBE cell line": {
            "ontology_id": "BTO:0002924"
          },
          "PK-15 cell line": {
            "ontology_id": "BTO:0001865"
          },
          "RK-13 cell line": {
            "ontology_id": "BTO:0002909"
          },
          "U251 cell line": {
            "ontology_id": "BTO:0002035"
          },
          "Vero cell line": {
            "ontology_id": "BTO:0001444 "
          },
          "Vero E6 cell line": {
            "ontology_id": "BTO:0004755"
          },
          "VeroE6/TMPRSS2 cell line": {
            "ontology_id": "BTO NTR"
          }
        }
      },
      {
        "fieldName": "passage number",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001261",
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
        "ontology_id": "GENEPIO:0001264",
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
        "ontology_id": "GENEPIO:0001266",
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
          "RNA (total)": {
            "ontology_id": "OBI:0000895"
          },
          "RNA (poly-A)": {
            "ontology_id": "OBI:0000869"
          },
          "RNA (ribo-depleted)": {
            "ontology_id": "OBI:0002627"
          },
          "mRNA (messenger RNA)": {
            "ontology_id": "OBI REQUEST"
          },
          "mRNA (cDNA)": {
            "ontology_id": "OBI:0002754"
          }
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
        "ontology_id": "GENEPIO:0001386",
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
            "ontology_id": "NCBITaxon:9606"
          },
          "Bat": {
            "ontology_id": "NCBITaxon:9397"
          },
          "Cat": {
            "ontology_id": "NCBITaxon:9685"
          },
          "Chicken": {
            "ontology_id": "NCBITaxon:9031"
          },
          "Civets": {
            "ontology_id": "NCBITaxon:9673"
          },
          "Cow": {
            "ontology_id": "NCBITaxon:9913",
            "exportField": {
              "CNPHI": [
                {
                  "value": "bovine"
                }
              ]
            }
          },
          "Dog": {
            "ontology_id": "NCBITaxon:9615 "
          },
          "Lion": {
            "ontology_id": "NCBITaxon:9689"
          },
          "Mink": {
            "ontology_id": "NCBITaxon:452646"
          },
          "Pangolin": {
            "ontology_id": "NCBITaxon:9973"
          },
          "Pig": {
            "ontology_id": "NCBITaxon:9825",
            "exportField": {
              "CNPHI": [
                {
                  "value": "porcine"
                }
              ]
            }
          },
          "Pigeon": {
            "ontology_id": "NCBITaxon:8930"
          },
          "Tiger": {
            "ontology_id": "NCBITaxon:9694"
          }
        }
      },
      {
        "fieldName": "host (scientific name)",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001387",
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
          "Homo sapiens": {
            "ontology_id": "NCBITaxon:9606",
            "exportField": {
              "NML_LIMS": [
                {
                  "value": "Human"
                }
              ]
            }
          },
          "Bos taurus": {
            "ontology_id": "NCBITaxon:9913"
          },
          "Canis lupus familiaris": {
            "ontology_id": "NCBITaxon:9615 "
          },
          "Chiroptera": {
            "ontology_id": "NCBITaxon:9397"
          },
          "Columbidae": {
            "ontology_id": "NCBITaxon:8930"
          },
          "Felis catus": {
            "ontology_id": "NCBITaxon:9685"
          },
          "Gallus gallus": {
            "ontology_id": "NCBITaxon:9031"
          },
          "Manis": {
            "ontology_id": "NCBITaxon:9973"
          },
          "Manis javanica": {
            "ontology_id": "NCBITaxon:9974"
          },
          "Neovison vison": {
            "ontology_id": "NCBITaxon:452646"
          },
          "Panthera leo": {
            "ontology_id": "NCBITaxon:9689"
          },
          "Panthera tigris": {
            "ontology_id": "NCBITaxon:9694"
          },
          "Rhinolophidae": {
            "ontology_id": "NCBITaxon:58055 "
          },
          "Rhinolophus affinis": {
            "ontology_id": "NCBITaxon:59477"
          },
          "Sus scrofa domesticus": {
            "ontology_id": "NCBITaxon:9825"
          },
          "Viverridae": {
            "ontology_id": "NCBITaxon:9673"
          }
        }
      },
      {
        "fieldName": "host health state",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001388",
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
            "ontology_id": "NCIT:C3833"
          },
          "Deceased": {
            "ontology_id": "NCIT:C28554"
          },
          "Healthy": {
            "ontology_id": "NCIT:C115935"
          },
          "Recovered": {},
          "Symptomatic": {}
        }
      },
      {
        "fieldName": "host health status details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001389",
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
            "schema:ItemList": {
              "Hospitalized (Non-ICU)": {},
              "Hospitalized (ICU)": {}
            }
          },
          "Mechanical Ventilation": {},
          "Medically Isolated": {
            "schema:ItemList": {
              "Medically Isolated (Negative Pressure)": {}
            }
          },
          "Self-quarantining": {}
        }
      },
      {
        "fieldName": "host health outcome",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001390",
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
              "field": "PH_HOST_HEALTH_OUTCOME"
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
        "ontology_id": "GENEPIO:0001391",
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
          "COVID-19": {
            "ontology_id": "MONDO:0100096"
          }
        }
      },
      {
        "fieldName": "host age",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001392",
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
        "ontology_id": "GENEPIO:0001393",
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
            "ontology_id": "UO:0000035"
          },
          "year": {
            "ontology_id": "UO:0000036"
          }
        }
      },
      {
        "fieldName": "host age bin",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001394",
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
          "0 - 9": {
            "ontology_id": "GENEPIO NTR"
          },
          "10 - 19": {
            "ontology_id": "GENEPIO NTR"
          },
          "20 - 29": {
            "ontology_id": "GENEPIO NTR"
          },
          "30 - 39": {
            "ontology_id": "GENEPIO NTR"
          },
          "40 - 49": {
            "ontology_id": "GENEPIO NTR"
          },
          "50 - 59": {
            "ontology_id": "GENEPIO NTR"
          },
          "60 - 69": {
            "ontology_id": "GENEPIO NTR"
          },
          "70 - 79": {
            "ontology_id": "GENEPIO NTR"
          },
          "80 - 89": {
            "ontology_id": "GENEPIO NTR"
          },
          "90 - 99": {
            "ontology_id": "GENEPIO NTR",
            "exportField": {
              "VirusSeq_Portal": [
                {
                  "value": "90+"
                }
              ]
            }
          },
          "100+": {
            "ontology_id": "GENEPIO NTR",
            "exportField": {
              "VirusSeq_Portal": [
                {
                  "value": "90+"
                }
              ]
            }
          }
        }
      },
      {
        "fieldName": "host gender",
        "capitalize": "Title",
        "ontology_id": "GENEPIO:0001395",
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
            "ontology_id": "NCIT:C46110"
          },
          "Male": {
            "ontology_id": "NCIT:C46109"
          },
          "Non-binary gender": {
            "ontology_id": "GSSO:000132"
          },
          "Transgender (assigned male at birth)": {
            "ontology_id": "GSSO:004004"
          },
          "Transgender (assigned female at birth)": {
            "ontology_id": "GSSO:004005"
          },
          "Undeclared": {},
          "Unknown": {}
        }
      },
      {
        "fieldName": "host residence geo_loc name (country)",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001396",
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
        "ontology_id": "GENEPIO:0001397",
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
        "ontology_id": "GENEPIO:0001398",
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
        "ontology_id": "GENEPIO:0001399",
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
        "ontology_id": "GENEPIO:0001400",
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
          "Abnormal lung auscultation": {
            "ontology_id": "HP REQUEST"
          },
          "Abnormality of taste sensation": {
            "ontology_id": "HP:0000223",
            "schema:ItemList": {
              "Ageusia (complete loss of taste)": {
                "ontology_id": "HP:0041051"
              },
              "Parageusia (distorted sense of taste)": {
                "ontology_id": "HP:0031249"
              },
              "Hypogeusia (reduced sense of taste)": {
                "ontology_id": "HP:0000224 "
              }
            }
          },
          "Abnormality of the sense of smell": {
            "ontology_id": "HP:0004408",
            "schema:ItemList": {
              "Anosmia (lost sense of smell)": {
                "ontology_id": "HP:0000458"
              },
              "Hyposmia (reduced sense of smell)": {
                "ontology_id": "HP:0004409"
              }
            }
          },
          "Acute Respiratory Distress Syndrome": {
            "ontology_id": "HP:0033677",
            "exportField": {
              "CNPHI": [
                {
                  "value": "ARDS"
                }
              ]
            }
          },
          "Altered mental status": {
            "ontology_id": "HP:0011446",
            "schema:ItemList": {
              "Cognitive impairment": {
                "ontology_id": "HP:0100543"
              },
              "Coma": {
                "ontology_id": "HP:0001259"
              },
              "Confusion": {
                "ontology_id": "HP:0001289",
                "schema:ItemList": {
                  "Delirium (sudden severe confusion)": {
                    "ontology_id": "HP:0031258"
                  }
                }
              },
              "Inability to arouse (inability to stay awake)": {
                "ontology_id": "HP REQUEST"
              },
              "Irritability": {
                "ontology_id": "HP:0000737 "
              },
              "Loss of speech": {
                "ontology_id": "HP:0002371"
              }
            }
          },
          "Arrhythmia": {
            "ontology_id": "HP:0011675"
          },
          "Asthenia (generalized weakness)": {
            "ontology_id": "HP:0025406"
          },
          "Chest tightness or pressure": {
            "ontology_id": "HP:0031352",
            "schema:ItemList": {
              "Rigors (fever shakes)": {
                "ontology_id": "HP:0025145"
              }
            }
          },
          "Chills (sudden cold sensation)": {
            "ontology_id": "HP:0025143 ",
            "exportField": {
              "CNPHI": [
                {
                  "value": "Chills"
                }
              ]
            }
          },
          "Conjunctival injection": {
            "ontology_id": "HP:0030953"
          },
          "Conjunctivitis (pink eye)": {
            "ontology_id": "HP:0000509",
            "exportField": {
              "CNPHI": [
                {
                  "value": "Conjunctivitis"
                }
              ]
            }
          },
          "Coryza (rhinitis)": {
            "ontology_id": "MP:0001867"
          },
          "Cough": {
            "ontology_id": "HP:0012735",
            "schema:ItemList": {
              "Nonproductive cough (dry cough)": {
                "ontology_id": "HP:0031246"
              },
              "Productive cough (wet cough)": {
                "ontology_id": "HP:0031245"
              }
            }
          },
          "Cyanosis (blueish skin discolouration)": {
            "ontology_id": "HP:0000961",
            "schema:ItemList": {
              "Acrocyanosis": {
                "ontology_id": "HP:0001063",
                "schema:ItemList": {
                  "Circumoral cyanosis (bluish around mouth)": {
                    "ontology_id": "HP:0032556"
                  },
                  "Cyanotic face (bluish face)": {
                    "ontology_id": "HP REQUEST"
                  }
                }
              },
              "Central Cyanosis": {
                "ontology_id": "HP REQUEST",
                "schema:ItemList": {
                  "Cyanotic lips (bluish lips)": {
                    "ontology_id": "HP REQUEST"
                  }
                }
              },
              "Peripheral Cyanosis": {
                "ontology_id": "HP REQUEST"
              }
            }
          },
          "Dyspnea (breathing difficulty)": {
            "ontology_id": "HP:0002094"
          },
          "Diarrhea (watery stool)": {
            "ontology_id": "HP:0002014",
            "exportField": {
              "CNPHI": [
                {
                  "value": "Diarrhea, watery"
                }
              ]
            }
          },
          "Dry gangrene": {
            "ontology_id": "MP:0031127"
          },
          "Encephalitis (brain inflammation)": {
            "ontology_id": "HP:0002383",
            "exportField": {
              "CNPHI": [
                {
                  "value": "Encephalitis"
                }
              ]
            }
          },
          "Encephalopathy": {
            "ontology_id": "HP:0001298"
          },
          "Fatigue (tiredness)": {
            "ontology_id": "HP:0012378",
            "exportField": {
              "CNPHI": [
                {
                  "value": "Fatigue"
                }
              ]
            }
          },
          "Prostration (complete exhaustion)": {
            "ontology_id": "HP REQUEST"
          },
          "Fever": {
            "ontology_id": "HP:0001945 ",
            "schema:ItemList": {
              "Fever (>=38\u00b0C)": {
                "ontology_id": "HP REQUEST",
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
            "ontology_id": "HP:0000206"
          },
          "Ground Glass Opacities (GGO)": {
            "ontology_id": "HP REQUEST"
          },
          "Headache": {
            "ontology_id": "HP:0002315"
          },
          "Hemoptysis (coughing up blood)": {
            "ontology_id": "HP:0002105"
          },
          "Hypocapnia": {
            "ontology_id": "HP:0012417"
          },
          "Hypotension (low blood pressure)": {
            "ontology_id": "HP:0002615"
          },
          "Hypoxemia (low blood oxygen)": {
            "ontology_id": "HP:0012418",
            "schema:ItemList": {
              "Silent hypoxemia": {
                "ontology_id": "HP REQUEST"
              }
            }
          },
          "Internal hemorrhage (internal bleeding)": {
            "ontology_id": "HP:0011029"
          },
          "Loss of Fine Movements": {
            "ontology_id": "NCIT:C121416"
          },
          "Low appetite": {
            "ontology_id": "HP:0004396 "
          },
          "Malaise (general discomfort/unease)": {
            "ontology_id": "HP:0033834"
          },
          "Meningismus/nuchal rigidity": {
            "ontology_id": "HP:0031179"
          },
          "Muscle weakness": {
            "ontology_id": "HP:0001324"
          },
          "Nasal obstruction (stuffy nose)": {
            "ontology_id": "HP:0001742"
          },
          "Nausea": {
            "ontology_id": "HP:0002018"
          },
          "Nose bleed": {
            "ontology_id": "HP:0000421"
          },
          "Otitis": {
            "ontology_id": "HP REQUEST"
          },
          "Pain": {
            "ontology_id": "HP:0012531",
            "schema:ItemList": {
              "Abdominal pain": {
                "ontology_id": "HP:0002027"
              },
              "Arthralgia (painful joints)": {
                "ontology_id": "HP:0002829"
              },
              "Chest pain": {
                "ontology_id": "HP:0100749",
                "schema:ItemList": {
                  "Pleuritic chest pain": {
                    "ontology_id": "HP:0033771"
                  }
                }
              },
              "Myalgia (muscle pain)": {
                "ontology_id": "HP:0003326"
              }
            }
          },
          "Pharyngitis (sore throat)": {
            "ontology_id": "HP:0025439"
          },
          "Pharyngeal exudate": {
            "ontology_id": "HP REQUEST"
          },
          "Pleural effusion": {
            "ontology_id": "HP:0002202"
          },
          "Pneumonia": {
            "ontology_id": "HP:0002090"
          },
          "Pseudo-chilblains": {
            "ontology_id": "HP:0033696",
            "schema:ItemList": {
              "Pseudo-chilblains on fingers (covid fingers)": {
                "ontology_id": "HP REQUEST"
              },
              "Pseudo-chilblains on toes (covid toes)": {
                "ontology_id": "HP REQUEST"
              }
            }
          },
          "Rash": {
            "ontology_id": "HP:0000988"
          },
          "Rhinorrhea (runny nose)": {
            "ontology_id": "HP:0031417"
          },
          "Seizure": {
            "ontology_id": "HP:0001250",
            "schema:ItemList": {
              "Motor seizure": {
                "ontology_id": "HP:0020219"
              }
            }
          },
          "Shivering (involuntary muscle twitching)": {
            "ontology_id": "HP:0025144"
          },
          "Slurred speech": {
            "ontology_id": "HP:0001350"
          },
          "Sneezing": {
            "ontology_id": "HP:0025095"
          },
          "Sputum Production": {
            "ontology_id": "HP:0033709"
          },
          "Stroke": {
            "ontology_id": "HP:0001297"
          },
          "Swollen Lymph Nodes": {
            "ontology_id": "HP:0002716"
          },
          "Tachypnea (accelerated respiratory rate)": {
            "ontology_id": "HP:0002789"
          },
          "Vertigo (dizziness)": {
            "ontology_id": "HP:0002321"
          },
          "Vomiting (throwing up)": {
            "ontology_id": "HP:0002013"
          }
        }
      },
      {
        "fieldName": "pre-existing conditions and risk factors",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001401",
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
          "Age 60+": {
            "ontology_id": "VO:0004925"
          },
          "Anemia": {
            "ontology_id": "HP:0001903"
          },
          "Anorexia": {
            "ontology_id": "HP:0002039"
          },
          "Birthing labor": {
            "ontology_id": "NCIT:C92743"
          },
          "Bone marrow failure": {
            "ontology_id": "NCIT:C80693"
          },
          "Cancer": {
            "ontology_id": "MONDO:0004992",
            "schema:ItemList": {
              "Breast cancer": {
                "ontology_id": "MONDO:0007254"
              },
              "Colorectal cancer": {
                "ontology_id": "MONDO:0005575"
              },
              "Hematologic malignancy (cancer of the blood)": {
                "ontology_id": "DOID:2531"
              },
              "Lung cancer": {
                "ontology_id": "MONDO:0008903"
              },
              "Metastatic disease": {
                "ontology_id": "MONDO:0024880"
              }
            }
          },
          "Cancer treatment": {
            "ontology_id": "NCIT:C16212",
            "schema:ItemList": {
              "Cancer surgery": {
                "ontology_id": "NCIT:C157740"
              },
              "Chemotherapy": {
                "ontology_id": "NCIT:C15632",
                "schema:ItemList": {
                  "Adjuvant chemotherapy": {
                    "ontology_id": "NCIT:C15360"
                  }
                }
              }
            }
          },
          "Cardiac disorder": {
            "ontology_id": "NCIT:C3079",
            "schema:ItemList": {
              "Arrhythmia": {
                "ontology_id": "HP:0011675"
              },
              "Cardiac disease": {
                "ontology_id": "MONDO:0005267"
              },
              "Cardiomyopathy": {
                "ontology_id": "HP:0001638"
              },
              "Cardiac injury": {
                "ontology_id": "NCIT:C45430"
              },
              "Hypertension (high blood pressure)": {
                "ontology_id": "HP:0000822"
              },
              "Hypotension (low blood pressure)": {
                "ontology_id": "HP:0002615"
              }
            }
          },
          "Cesarean section": {
            "ontology_id": "HP:0011410"
          },
          "Chronic cough": {
            "ontology_id": "HP REQUEST"
          },
          "Chronic gastrointestinal disease": {
            "ontology_id": "HP REQUEST"
          },
          "Chronic lung disease": {
            "ontology_id": "HP:0006528"
          },
          "Corticosteroids": {
            "ontology_id": "NCIT:C211"
          },
          "Diabetes mellitus (diabetes)": {
            "ontology_id": "HP:0000819",
            "schema:ItemList": {
              "Type I diabetes mellitus (T1D)": {
                "ontology_id": "HP:0100651"
              },
              "Type II diabetes mellitus (T2D)": {
                "ontology_id": "HP:0005978"
              }
            }
          },
          "Eczema": {
            "ontology_id": "HP:0000964"
          },
          "Electrolyte disturbance": {
            "ontology_id": "HP:0003111",
            "schema:ItemList": {
              "Hypocalcemia": {
                "ontology_id": "HP:0002901"
              },
              "Hypokalemia": {
                "ontology_id": "HP:0002900"
              },
              "Hypomagnesemia": {
                "ontology_id": "HP:0002917"
              }
            }
          },
          "Encephalitis (brain inflammation)": {
            "ontology_id": "HP:0002383"
          },
          "Epilepsy": {
            "ontology_id": "MONDO:0005027"
          },
          "Hemodialysis": {
            "ontology_id": "NCIT:C15248"
          },
          "Hemoglobinopathy": {
            "ontology_id": "MONDO:0044348"
          },
          "Human immunodeficiency virus (HIV)": {
            "ontology_id": "MONDO:0005109",
            "schema:ItemList": {
              "Acquired immunodeficiency syndrome (AIDS)": {
                "ontology_id": "MONDO:0012268"
              },
              "HIV and antiretroviral therapy (ART)": {
                "ontology_id": "NCIT:C16118"
              }
            }
          },
          "Immunocompromised": {
            "ontology_id": "NCIT:C14139",
            "schema:ItemList": {
              "Lupus": {
                "ontology_id": "MONDO:0004670"
              }
            }
          },
          "Inflammatory bowel disease (IBD)": {
            "ontology_id": "MONDO:0005265",
            "schema:ItemList": {
              "Colitis": {
                "ontology_id": "HP:0002583",
                "schema:ItemList": {
                  "Ulcerative colitis": {
                    "ontology_id": "HP:0100279"
                  }
                }
              },
              "Crohn's disease": {
                "ontology_id": "HP:0100280"
              }
            }
          },
          "Renal disorder": {
            "ontology_id": "NCIT:C3149",
            "schema:ItemList": {
              "Renal disease": {
                "ontology_id": "MONDO:0005240"
              },
              "Chronic renal disease": {
                "ontology_id": "HP:0012622"
              },
              "Renal failure": {
                "ontology_id": "HP:0000083"
              }
            }
          },
          "Liver disease": {
            "ontology_id": "MONDO:0005154",
            "schema:ItemList": {
              "Chronic liver disease": {
                "ontology_id": "NCIT:C113609",
                "schema:ItemList": {
                  "Fatty liver disease (FLD)": {
                    "ontology_id": "HP:0001397"
                  }
                }
              }
            }
          },
          "Myalgia (muscle pain)": {
            "ontology_id": "HP:0003326"
          },
          "Myalgic encephalomyelitis (chronic fatigue syndrome)": {
            "ontology_id": "MONDO:0005404"
          },
          "Neurological disorder": {
            "ontology_id": "MONDO:0005071",
            "schema:ItemList": {
              "Neuromuscular disorder": {
                "ontology_id": "MONDO:0019056"
              }
            }
          },
          "Obesity": {
            "ontology_id": "HP:0001513",
            "schema:ItemList": {
              "Severe obesity": {
                "ontology_id": "MONDO:0005139"
              }
            }
          },
          "Respiratory disorder": {
            "ontology_id": "MONDO:0005087",
            "schema:ItemList": {
              "Asthma": {
                "ontology_id": "HP:0002099"
              },
              "Chronic bronchitis": {
                "ontology_id": "HP:0004469"
              },
              "Chronic pulmonary disease": {
                "ontology_id": "HP:0006528",
                "schema:ItemList": {
                  "Chronic obstructive pulmonary disease": {
                    "ontology_id": "HP:0006510"
                  }
                }
              },
              "Emphysema": {
                "ontology_id": "HP:0002097"
              },
              "Lung disease": {
                "ontology_id": "MONDO:0005275",
                "schema:ItemList": {
                  "Chronic lung disease": {
                    "ontology_id": "HP:0006528"
                  },
                  "Pulmonary fibrosis": {
                    "ontology_id": "HP:0002206"
                  }
                }
              },
              "Pneumonia": {
                "ontology_id": "HP:0002090"
              },
              "Respiratory failure": {
                "ontology_id": "HP:0002878",
                "schema:ItemList": {
                  "Adult respiratory distress syndrome": {
                    "ontology_id": "HP:0033677"
                  },
                  "Newborn respiratory distress syndrome": {
                    "ontology_id": "MONDO:0009971"
                  }
                }
              },
              "Tuberculosis": {
                "ontology_id": "MONDO:0018076"
              }
            }
          },
          "Postpartum (\u22646 weeks)": {},
          "Pregnancy": {
            "ontology_id": "NCIT:C25742"
          },
          "Rheumatic disease": {
            "ontology_id": "MONDO:0005554"
          },
          "Sickle cell disease": {
            "ontology_id": "MONDO:0011382"
          },
          "Substance use": {
            "ontology_id": "NBO:0001845",
            "schema:ItemList": {
              "Alcohol abuse": {
                "ontology_id": "MONDO:0002046"
              },
              "Drug abuse": {
                "schema:ItemList": {
                  "Injection drug abuse": {}
                }
              },
              "Smoking": {
                "ontology_id": "NBO:0015005"
              },
              "Vaping": {
                "ontology_id": "NBO NTR"
              }
            }
          },
          "Tachypnea (accelerated respiratory rate)": {
            "ontology_id": "HP:0002789"
          },
          "Transplant": {
            "ontology_id": "NCIT:C159659",
            "schema:ItemList": {
              "Hematopoietic stem cell transplant (bone marrow transplant)": {
                "ontology_id": "NCIT:C131759"
              },
              "Cardiac transplant": {},
              "Kidney transplant": {
                "ontology_id": "NCIT:C157332"
              },
              "Liver transplant": {}
            }
          }
        }
      },
      {
        "fieldName": "complications",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001402",
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
          "Abnormal blood oxygen level": {
            "ontology_id": "HP:0500165"
          },
          "Acute respiratory failure": {
            "ontology_id": "MONDO:0001208"
          },
          "Arrhythmia (complication)": {
            "ontology_id": "HP:0011675",
            "schema:ItemList": {
              "Tachycardia": {
                "ontology_id": "HP:0001649",
                "schema:ItemList": {
                  "Polymorphic ventricular tachycardia (VT)": {
                    "ontology_id": "HP:0031677"
                  },
                  "Tachyarrhythmia": {
                    "ontology_id": "HP NTR"
                  }
                }
              }
            }
          },
          "Noncardiogenic pulmonary edema": {
            "ontology_id": "HP NTR",
            "schema:ItemList": {
              "Acute respiratory distress syndrome (ARDS)": {
                "ontology_id": "HP:0033677",
                "schema:ItemList": {
                  "COVID-19 associated ARDS (CARDS)": {
                    "ontology_id": "NCIT:C171551"
                  },
                  "Neurogenic pulmonary edema (NPE)": {
                    "ontology_id": "HP NTR"
                  }
                }
              }
            }
          },
          "Cardiac injury": {
            "ontology_id": "NCIT:C45430"
          },
          "Cardiac arrest": {
            "ontology_id": "HP:0001695"
          },
          "Cardiogenic shock": {
            "ontology_id": "HP:0030149"
          },
          "Blood clot": {
            "ontology_id": "HP:0001977",
            "schema:ItemList": {
              "Arterial clot": {
                "ontology_id": "HP:0004420"
              },
              "Deep vein thrombosis (DVT)": {
                "ontology_id": "HP:0002625"
              },
              "Pulmonary embolism (PE)": {
                "ontology_id": "HP:0002204"
              }
            }
          },
          "Cardiomyopathy": {
            "ontology_id": "HP:0001638"
          },
          "Central nervous system invasion": {
            "ontology_id": "MONDO:0024619"
          },
          "Stroke (complication)": {
            "ontology_id": "HP:0001297",
            "schema:ItemList": {
              "Central Nervous System Vasculitis": {
                "ontology_id": "MONDO:0003346"
              },
              "Acute ischemic stroke": {
                "ontology_id": "HP:0002140"
              }
            }
          },
          "Coma": {
            "ontology_id": "HP:0001259"
          },
          "Convulsions": {
            "ontology_id": "HP:0011097"
          },
          "COVID-19 associated coagulopathy (CAC)": {
            "ontology_id": "HP NTR"
          },
          "Cystic fibrosis": {
            "ontology_id": "MONDO:0009061"
          },
          "Cytokine release syndrome": {
            "ontology_id": "MONDO:0600008"
          },
          "Disseminated intravascular coagulation (DIC)": {
            "ontology_id": "MPATH:108"
          },
          "Encephalopathy": {
            "ontology_id": "HP:0001298"
          },
          "Fulminant myocarditis": {
            "ontology_id": "HP NTR"
          },
          "Guillain-Barr\u00e9 syndrome": {
            "ontology_id": "MONDO:0016218"
          },
          "Internal hemorrhage (complication; internal bleeding)": {
            "ontology_id": "HP:0011029",
            "schema:ItemList": {
              "Intracerebral haemorrhage": {
                "ontology_id": "MONDO:0013792"
              }
            }
          },
          "Kawasaki disease": {
            "ontology_id": "HP NTR",
            "schema:ItemList": {
              "Complete Kawasaki disease": {
                "ontology_id": "HP NTR"
              },
              "Incomplete Kawasaki disease": {
                "ontology_id": "HP NTR"
              }
            }
          },
          "Acute kidney injury": {
            "ontology_id": "HP:0001919"
          },
          "Long COVID-19": {
            "ontology_id": "MONDO:0100233"
          },
          "Liver dysfunction": {
            "ontology_id": "HP:0001410",
            "schema:ItemList": {
              "Acute liver injury": {
                "ontology_id": "HP NTR"
              }
            }
          },
          "Acute lung injury": {
            "ontology_id": "MONDO:0015796",
            "schema:ItemList": {
              "Ventilation induced lung injury (VILI)": {
                "ontology_id": "HP NTR"
              }
            }
          },
          "Meningitis": {
            "ontology_id": "HP:0001287"
          },
          "Migraine": {
            "ontology_id": "HP:0002076"
          },
          "Miscarriage": {
            "ontology_id": "HP:0005268"
          },
          "Multisystem inflammatory syndrome in children (MIS-C)": {
            "ontology_id": "MONDO:0100163"
          },
          "Muscle injury": {
            "ontology_id": "HP NTR"
          },
          "Myalgic encephalomyelitis (ME)": {
            "ontology_id": "MONDO:0005404"
          },
          "Myocardial infarction (heart attack)": {
            "ontology_id": "MONDO:0005068",
            "schema:ItemList": {
              "Acute myocardial infarction": {
                "ontology_id": "MONDO:0004781"
              },
              "ST-segment elevation myocardial infarction": {
                "ontology_id": "MONDO:0041656"
              }
            }
          },
          "Myocardial injury": {
            "ontology_id": "HP NTR"
          },
          "Neonatal complications": {
            "ontology_id": "NCIT:C168498"
          },
          "Organ failure": {
            "ontology_id": "HP NTR",
            "schema:ItemList": {
              "Heart failure": {
                "ontology_id": "HP:0001635"
              },
              "Liver failure": {
                "ontology_id": "MONDO:0100192"
              }
            }
          },
          "Paralysis": {
            "ontology_id": "HP:0003470"
          },
          "Pneumothorax (collapsed lung)": {
            "ontology_id": "HP:0002107",
            "schema:ItemList": {
              "Spontaneous pneumothorax": {
                "ontology_id": "HP:0002108"
              },
              "Spontaneous tension pneumothorax": {
                "ontology_id": "MONDO:0002075"
              }
            }
          },
          "Pneumonia (complication)": {
            "ontology_id": "HP:0002090",
            "schema:ItemList": {
              "COVID-19 pneumonia": {
                "ontology_id": "NCIT:C171550"
              }
            }
          },
          "Pregancy complications": {
            "ontology_id": "HP:0001197"
          },
          "Rhabdomyolysis": {
            "ontology_id": "HP:0003201"
          },
          "Secondary infection": {
            "ontology_id": "IDO:0000567",
            "schema:ItemList": {
              "Secondary staph infection": {
                "ontology_id": "IDO NTR"
              },
              "Secondary strep infection": {
                "ontology_id": "IDO NTR"
              }
            }
          },
          "Seizure (complication)": {
            "ontology_id": "HP:0001250",
            "schema:ItemList": {
              "Motor seizure": {
                "ontology_id": "HP:0020219"
              }
            }
          },
          "Sepsis/Septicemia": {
            "ontology_id": "HP:0100806",
            "schema:ItemList": {
              "Sepsis": {
                "ontology_id": "IDO:0000636"
              },
              "Septicemia": {
                "ontology_id": "NCIT:C3364"
              }
            }
          },
          "Shock": {
            "ontology_id": "HP:0031273",
            "schema:ItemList": {
              "Hyperinflammatory shock": {
                "ontology_id": "HP NTR"
              },
              "Refractory cardiogenic shock": {
                "ontology_id": "HP NTR"
              },
              "Refractory cardiogenic plus vasoplegic shock": {
                "ontology_id": "HP NTR"
              },
              "Septic shock": {
                "ontology_id": "HP NTR"
              }
            }
          },
          "Vasculitis": {
            "ontology_id": "HP:0002633"
          }
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
        "ontology_id": "GENEPIO:0001404",
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
              "field": "PH_VACCINATION_HISTORY"
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
        "fieldName": "number of vaccine doses received",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001406",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The number of doses of the vaccine recived by the host.",
        "guidance": "Record how many doses of the vaccine the host has received.",
        "examples": "2"
      },
      {
        "fieldName": "vaccination dose 1 vaccine name",
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
        "description": "The name of the vaccine administered as the first dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the first dose by selecting a value from the pick list",
        "examples": "Pfizer-BioNTech (Comirnaty)",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        },
        "schema:ItemList": {
          "Moderna (Spikevax)": {},
          "Pfizer-BioNTech (Comirnaty)": {},
          "Pfizer-BioNTech (Comirnaty Pediatric)": {},
          "Johnson & Johnson (Janssen)": {},
          "Astrazeneca (Vaxzevria)": {}
        }
      },
      {
        "fieldName": "vaccination dose 1 vaccination date",
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
        "description": "The date the first dose of a vaccine was administered.",
        "guidance": "Provide the date the first dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        }
      },
      {
        "fieldName": "vaccination dose 2 vaccine name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "vaccination dose 1 vaccine name",
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
        "description": "The name of the vaccine administered as the second dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the second dose by selecting a value from the pick list",
        "examples": "Pfizer-BioNTech (Comirnaty)",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "vaccination dose 2 vaccination date",
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
        "description": "The date the second dose of a vaccine was administered.",
        "guidance": "Provide the date the second dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        }
      },
      {
        "fieldName": "vaccination dose 3 vaccine name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "vaccination dose 1 vaccine name",
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
        "description": "The name of the vaccine administered as the third dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the third dose by selecting a value from the pick list",
        "examples": "Pfizer-BioNTech (Comirnaty)",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "vaccination dose 3 vaccination date",
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
        "description": "The date the third dose of a vaccine was administered.",
        "guidance": "Provide the date the third dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        }
      },
      {
        "fieldName": "vaccination dose 4 vaccine name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "vaccination dose 1 vaccine name",
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
        "description": "The name of the vaccine administered as the fourth dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the fourth dose by selecting a value from the pick list",
        "examples": "Pfizer-BioNTech (Comirnaty)",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        },
        "schema:ItemList": {}
      },
      {
        "fieldName": "vaccination dose 4 vaccination date",
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
        "description": "The date the fourth dose of a vaccine was administered.",
        "guidance": "Provide the date the fourth dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
            }
          ]
        }
      },
      {
        "fieldName": "vaccination history",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A description of the vaccines received and the administration dates of a series of vaccinations against a specific disease or a set of diseases.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_VACCINATION_HISTORY"
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
        "ontology_id": "GENEPIO:0001410",
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
        "ontology_id": "GENEPIO:0001411",
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
        "ontology_id": "GENEPIO:0001412",
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
        "ontology_id": "GENEPIO:0001413",
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
        "ontology_id": "GENEPIO:0001414",
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
        "ontology_id": "GENEPIO:0001415",
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
        "ontology_id": "GENEPIO:0001416",
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
              "field": "PH_TRAVEL"
            }
          ]
        }
      },
      {
        "fieldName": "exposure event",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001417",
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
            "ontology_id": "PCO NTR",
            "schema:ItemList": {
              "Agricultural Event": {
                "ontology_id": "PCO NTR"
              },
              "Convention": {
                "ontology_id": "PCO NTR"
              },
              "Convocation": {
                "ontology_id": "PCO NTR"
              },
              "Recreational Event": {
                "ontology_id": "PCO NTR",
                "schema:ItemList": {
                  "Concert": {
                    "ontology_id": "PCO NTR"
                  },
                  "Sporting Event": {
                    "ontology_id": "PCO NTR"
                  }
                }
              }
            }
          },
          "Religious Gathering": {
            "ontology_id": "PCO NTR",
            "schema:ItemList": {
              "Mass": {
                "ontology_id": "PCO NTR"
              }
            }
          },
          "Social Gathering": {
            "ontology_id": "PCO:0000033",
            "schema:ItemList": {
              "Baby Shower": {
                "ontology_id": "PCO:0000039"
              },
              "Community Event": {
                "ontology_id": "PCO:0000034"
              },
              "Family Gathering": {
                "ontology_id": "PCO NTR",
                "schema:ItemList": {
                  "Family Reunion": {
                    "ontology_id": "PCO NTR"
                  }
                }
              },
              "Funeral": {
                "ontology_id": "PCO NTR"
              },
              "Party": {
                "ontology_id": "PCO:0000035"
              },
              "Potluck": {
                "ontology_id": "PCO:0000037"
              },
              "Wedding": {
                "ontology_id": "PCO:0000038"
              }
            }
          },
          "Other exposure event": {
            "ontology_id": "NCIT:C168623"
          }
        }
      },
      {
        "fieldName": "exposure contact level",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001418",
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
            "ontology_id": "NCIT NTR?",
            "schema:ItemList": {
              "Direct contact (direct human-to-human contact)": {
                "ontology_id": "NCIT NTR?"
              },
              "Indirect contact": {
                "ontology_id": "NCIT NTR?",
                "schema:ItemList": {
                  "Close contact (face-to-face, no direct contact)": {
                    "ontology_id": "NCIT NTR?"
                  },
                  "Casual contact": {
                    "ontology_id": "NCIT:C102606"
                  }
                }
              }
            }
          }
        }
      },
      {
        "fieldName": "host role",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001419",
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
            "ontology_id": "OMRSE NTR",
            "schema:ItemList": {
              "Student": {
                "ontology_id": "OMRSE:00000058"
              }
            }
          },
          "Patient": {
            "ontology_id": "OMRSE:00000030",
            "schema:ItemList": {
              "Inpatient": {
                "ontology_id": "OMRSE NTR"
              },
              "Outpatient": {
                "ontology_id": "OMRSE NTR"
              }
            }
          },
          "Passenger": {
            "ontology_id": "OMRSE NTR"
          },
          "Resident": {
            "ontology_id": "OMRSE NTR"
          },
          "Visitor": {
            "ontology_id": "OMRSE NTR"
          },
          "Volunteer": {
            "ontology_id": "OMRSE NTR"
          },
          "Work": {
            "ontology_id": "OMRSE NTR",
            "schema:ItemList": {
              "Administrator": {
                "ontology_id": "OMRSE NTR"
              },
              "First Responder": {
                "ontology_id": "OMRSE NTR",
                "schema:ItemList": {
                  "Firefighter": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Paramedic": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Police Officer": {
                    "ontology_id": "OMRSE NTR"
                  }
                }
              },
              "Child Care/Education Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Essential Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Healthcare Worker": {
                "ontology_id": "OMRSE NTR",
                "schema:ItemList": {
                  "Nurse": {
                    "ontology_id": "OMRSE:00000014"
                  },
                  "Personal Care Aid": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Pharmacist": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Physician": {
                    "ontology_id": "OMRSE:00000050"
                  }
                }
              },
              "Housekeeper": {
                "ontology_id": "OMRSE NTR"
              },
              "International worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Kitchen Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Laboratory Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Rotational Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Seasonal Worker": {
                "ontology_id": "OMRSE NTR"
              },
              "Transport Worker": {
                "ontology_id": "OMRSE NTR",
                "schema:ItemList": {
                  "Transport Truck Driver": {
                    "ontology_id": "OMRSE NTR"
                  }
                }
              },
              "Veterinarian": {
                "ontology_id": "OMRSE NTR"
              }
            }
          },
          "Social role": {
            "ontology_id": "OMRSE:00000001",
            "schema:ItemList": {
              "Acquaintance of case": {
                "ontology_id": "OMRSE NTR"
              },
              "Relative of case": {
                "ontology_id": "OMRSE NTR",
                "schema:ItemList": {
                  "Child of case": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Parent of case": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Father of case": {
                    "ontology_id": "OMRSE NTR"
                  },
                  "Mother of case": {
                    "ontology_id": "OMRSE NTR"
                  }
                }
              },
              "Spouse of case": {
                "ontology_id": "OMRSE NTR"
              }
            }
          },
          "Other Host Role": {
            "ontology_id": "OMRSE NTR"
          }
        }
      },
      {
        "fieldName": "exposure setting",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001428",
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
            "ontology_id": "ECTO:3000005",
            "schema:ItemList": {
              "Contact with Known COVID-19 Case": {
                "ontology_id": "ECTO NTR"
              },
              "Contact with Patient": {
                "ontology_id": "ECTO NTR"
              },
              "Contact with Probable COVID-19 Case": {
                "ontology_id": "ECTO NTR"
              },
              "Contact with Person with Acute Respiratory Illness": {
                "ontology_id": "ECTO NTR"
              },
              "Contact with Person with Fever and/or Cough": {
                "ontology_id": "ECTO NTR"
              },
              "Contact with Person who Recently Travelled": {
                "ontology_id": "ECTO NTR"
              }
            }
          },
          "Occupational, Residency or Patronage Exposure": {
            "ontology_id": "ECTO NTR?",
            "schema:ItemList": {
              "Abbatoir": {
                "ontology_id": "ECTO:1000033"
              },
              "Animal Rescue": {
                "ontology_id": "ECTO NTR"
              },
              "Childcare": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Daycare": {
                    "ontology_id": "ECTO NTR"
                  }
                }
              },
              "Nursery": {
                "ontology_id": "ECTO NTR"
              },
              "Community Service Centre": {
                "ontology_id": "ECTO NTR"
              },
              "Correctional Facility": {
                "ontology_id": "ECTO NTR"
              },
              "Dormitory": {
                "ontology_id": "ECTO NTR"
              },
              "Farm": {
                "ontology_id": "ECTO:1000034"
              },
              "First Nations Reserve": {
                "ontology_id": "ECTO NTR"
              },
              "Funeral Home": {
                "ontology_id": "ECTO NTR"
              },
              "Group Home": {
                "ontology_id": "ECTO NTR"
              },
              "Healthcare Setting": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Ambulance": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Acute Care Facility": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Clinic": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Community Health Centre": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Hospital": {
                    "ontology_id": "ECTO:1000035",
                    "schema:ItemList": {
                      "Emergency Department": {
                        "ontology_id": "ECTO NTR"
                      },
                      "ICU": {
                        "ontology_id": "ECTO NTR"
                      },
                      "Ward": {
                        "ontology_id": "ECTO NTR"
                      }
                    }
                  },
                  "Laboratory": {
                    "ontology_id": "ECTO:1000036"
                  },
                  "Long-Term Care Facility": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Pharmacy": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Physician's Office": {
                    "ontology_id": "ECTO NTR"
                  }
                }
              },
              "Household": {
                "ontology_id": "ECTO NTR"
              },
              "Insecure Housing (Homeless)": {
                "ontology_id": "ECTO NTR"
              },
              "Occupational Exposure": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Worksite": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Office": {
                    "ontology_id": "ECTO:1000037"
                  }
                }
              },
              "Outdoors": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Camp/camping": {
                    "ontology_id": "ECTO:5000009"
                  },
                  "Hiking Trail": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Hunting Ground": {
                    "ontology_id": "ECTO:6000030"
                  },
                  "Ski Resort": {
                    "ontology_id": "ECTO NTR"
                  }
                }
              },
              "Petting zoo": {
                "ontology_id": "ECTO:5000008"
              },
              "Place of Worship": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Church": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Mosque": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Temple": {
                    "ontology_id": "ECTO NTR"
                  }
                }
              },
              "Restaurant": {
                "ontology_id": "ECTO:1000040"
              },
              "Retail Store": {
                "ontology_id": "ECTO:1000041"
              },
              "School": {
                "ontology_id": "ECTO NTR"
              },
              "Temporary Residence": {
                "ontology_id": "ECTO NTR",
                "schema:ItemList": {
                  "Homeless Shelter": {
                    "ontology_id": "ECTO NTR"
                  },
                  "Hotel": {
                    "ontology_id": "ECTO NTR"
                  }
                }
              },
              "Veterinary Care Clinic": {
                "ontology_id": "ECTO NTR"
              }
            }
          },
          "Travel Exposure": {
            "ontology_id": "ECTO NTR",
            "schema:ItemList": {
              "Travelled on a Cruise Ship": {
                "ontology_id": "ECTO NTR"
              },
              "Travelled on a Plane": {
                "ontology_id": "ECTO NTR"
              },
              "Travelled on Ground Transport": {
                "ontology_id": "ECTO NTR"
              },
              "Travelled outside Province/Territory": {
                "ontology_id": "GENEPIO:0001119"
              },
              "Travelled outside Canada": {
                "ontology_id": "GENEPIO:0001118"
              }
            }
          },
          "Other Exposure Setting": {
            "ontology_id": "GENEPIO NTR?"
          }
        }
      },
      {
        "fieldName": "exposure details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001431",
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
        "ontology_id": "GENEPIO:0001435",
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
        "guidance": "If known, provide information about whether the individual had a previous SARS-CoV-2 infection. Select a value from the pick list.",
        "examples": "Yes",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "prior SARS-CoV-2 infection"
            }
          ]
        },
        "schema:ItemList": {
          "Prior antiviral treatment": {},
          "No prior antiviral treatment": {}
        }
      },
      {
        "fieldName": "prior SARS-CoV-2 infection isolate",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001436",
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
        "ontology_id": "GENEPIO:0001437",
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
        "ontology_id": "GENEPIO:0001438",
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
        "guidance": "If known, provide information about whether the individual had a previous SARS-CoV-2 antiviral treatment. Select a value from the pick list.",
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
        "ontology_id": "GENEPIO:0001439",
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
        "ontology_id": "GENEPIO:0001440",
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
        "ontology_id": "GENEPIO:0001445",
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
          "Baseline surveillance (random sampling)": {
            "ontology_id": "See comment"
          },
          "Targeted surveillance (non-random sampling)": {
            "schema:ItemList": {
              "Priority surveillance project": {
                "schema:ItemList": {
                  "Screening for Variants of Concern (VoC)": {
                    "schema:ItemList": {
                      "Sample has epidemiological link to Variant of Concern (VoC)": {
                        "schema:ItemList": {
                          "Sample has epidemiological link to Omicron Variant": {}
                        }
                      }
                    }
                  },
                  "Longitudinal surveillance (repeat sampling of individuals)": {},
                  "Re-infection surveillance": {},
                  "Vaccine escape surveillance": {},
                  "Travel-associated surveillance": {
                    "schema:ItemList": {
                      "Domestic travel surveillance": {
                        "schema:ItemList": {
                          "Interstate/ interprovincial travel surveillance": {},
                          "Intra-state/ intra-provincial travel surveillance": {}
                        }
                      },
                      "International travel surveillance": {},
                      "Surveillance of international border crossing by air travel or ground transport": {},
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
            "ontology_id": "HSO:0000371",
            "schema:ItemList": {
              "Multi-jurisdictional outbreak investigation": {},
              "Intra-jurisdictional outbreak investigation": {}
            }
          },
          "Research": {
            "ontology_id": "NCIT:c15429",
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
        "ontology_id": "GENEPIO:0001446",
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
        "ontology_id": "GENEPIO:0001447",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "2019-10-01",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The date the sample was sequenced.",
        "guidance": "ISO 8601 standard \"YYYY-MM-DD\".",
        "examples": "2020-06-22",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_SEQUENCING_DATE"
            }
          ]
        }
      },
      {
        "fieldName": "library ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001448",
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
          ]
        }
      },
      {
        "fieldName": "amplicon size",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001449",
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
        "ontology_id": "GENEPIO:0001450",
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
              "field": "PH_LIBRARY_PREP_KIT"
            }
          ]
        }
      },
      {
        "fieldName": "flow cell barcode",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001451",
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
        "ontology_id": "GENEPIO:0001452",
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
        "examples": "Oxford Nanopore MinION",
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
              "field": "PH_INSTRUMENT_CGN"
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
            "ontology_id": "OBI:0000759",
            "schema:ItemList": {
              "Illumina Genome Analyzer": {
                "ontology_id": "OBI:0002128",
                "schema:ItemList": {
                  "Illumina Genome Analyzer II": {
                    "ontology_id": "OBI:0000703"
                  },
                  "Illumina Genome Analyzer IIx": {
                    "ontology_id": "OBI:0002000"
                  }
                }
              },
              "Illumina HiScanSQ": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina HiSeq": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina HiSeq X": {
                "ontology_id": "OBI NTR?",
                "schema:ItemList": {
                  "Illumina HiSeq X Five": {
                    "ontology_id": "OBI NTR?"
                  },
                  "Illumina HiSeq X Ten": {
                    "ontology_id": "OBI:0002129"
                  }
                }
              },
              "Illumina HiSeq 1000": {
                "ontology_id": "OBI:0002022"
              },
              "Illumina HiSeq 1500": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina HiSeq 2000": {
                "ontology_id": "OBI:0002001"
              },
              "Illumina HiSeq 2500": {
                "ontology_id": "OBI:0002002"
              },
              "Illumina HiSeq 3000": {
                "ontology_id": "OBI:0002048"
              },
              "Illumina HiSeq 4000": {
                "ontology_id": "OBI:0002049"
              },
              "Illumina iSeq": {
                "ontology_id": "OBI NTR?",
                "schema:ItemList": {
                  "Illumina iSeq 100": {
                    "ontology_id": "OBI NTR?"
                  }
                }
              },
              "Illumina NovaSeq": {
                "ontology_id": "OBI NTR?",
                "schema:ItemList": {
                  "Illumina NovaSeq 6000": {
                    "ontology_id": "OBI:0002630"
                  }
                }
              },
              "Illumina MiniSeq": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina MiSeq": {
                "ontology_id": "OBI:0002003"
              },
              "Illumina NextSeq": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina NextSeq 500": {
                "ontology_id": "OBI:0002021"
              },
              "Illumina NextSeq 550": {
                "ontology_id": "OBI NTR?"
              },
              "Illumina NextSeq 2000": {
                "ontology_id": "OBI NTR?"
              }
            }
          },
          "Pacific Biosciences": {
            "ontology_id": "OBI:0001856",
            "schema:ItemList": {
              "PacBio RS": {
                "ontology_id": "OBI NTR?"
              },
              "PacBio RS II": {
                "ontology_id": "OBI:0002012"
              },
              "PacBio Sequel": {
                "ontology_id": "OBI:0002632"
              },
              "PacBio Sequel II": {
                "ontology_id": "OBI:0002633"
              }
            }
          },
          "Ion Torrent": {
            "ontology_id": "OBI NTR?",
            "schema:ItemList": {
              "Ion Torrent PGM": {
                "ontology_id": "GENEPIO:0001935"
              },
              "Ion Torrent Proton": {
                "ontology_id": "OBI NTR?"
              },
              "Ion Torrent S5 XL": {
                "ontology_id": "OBI NTR?"
              },
              "Ion Torrent S5": {
                "ontology_id": "OBI NTR?"
              }
            }
          },
          "Oxford Nanopore": {
            "ontology_id": "OBI NTR?",
            "schema:ItemList": {
              "Oxford Nanopore GridION": {
                "ontology_id": "OBI:0002751"
              },
              "Oxford Nanopore MinION": {
                "ontology_id": "OBI:0002750"
              },
              "Oxford Nanopore PromethION": {
                "ontology_id": "OBI:0002752"
              }
            }
          },
          "BGI Genomics": {
            "ontology_id": "OBI NTR?",
            "schema:ItemList": {
              "BGI Genomics BGISEQ-500": {
                "ontology_id": "OBI NTR?"
              }
            }
          },
          "MGI": {
            "ontology_id": "OBI NTR?",
            "schema:ItemList": {
              "MGI DNBSEQ-T7": {
                "ontology_id": "OBI NTR?"
              },
              "MGI DNBSEQ-G400": {
                "ontology_id": "OBI NTR?"
              },
              "MGI DNBSEQ-G400 FAST": {
                "ontology_id": "OBI NTR?"
              },
              "MGI DNBSEQ-G50": {
                "ontology_id": "OBI NTR?"
              }
            }
          }
        }
      },
      {
        "fieldName": "sequencing protocol name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001453",
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
          ]
        }
      },
      {
        "fieldName": "sequencing protocol",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001454",
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
          ],
          "VirusSeq_Portal": [
            {
              "field": "sequencing protocol"
            }
          ]
        }
      },
      {
        "fieldName": "sequencing kit number",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001455",
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
        "ontology_id": "GENEPIO:0001456",
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
        "ontology_id": "GENEPIO:0001458",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
        "guidance": "Provide the software name followed by the version e.g. Trimmomatic v. 0.38, Porechop v. 0.2.3",
        "examples": "Porechop 0.2.3",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_RAW_SEQUENCE_METHOD"
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
        "ontology_id": "GENEPIO:0001459",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The method used to remove host reads from the pathogen sequence.",
        "guidance": "Provide the name and version number of the software used to remove host reads.",
        "examples": "Nanostripper",
        "exportField": {
          "NML_LIMS": [
            {
              "field": "PH_DEHOSTING_METHOD"
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
        "ontology_id": "GENEPIO:0001460",
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
        "ontology_id": "GENEPIO:0001461",
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
        "ontology_id": "GENEPIO:0001462",
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
        "ontology_id": "GENEPIO:0001463",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The name of software used to generate the consensus sequence.",
        "guidance": "Provide the name of the software used to generate the consensus sequence.",
        "examples": "iVar",
        "exportField": {
          "CNPHI": [
            {
              "field": "consensus sequence"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_CONSENSUS_SEQUENCE"
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
        "ontology_id": "GENEPIO:0001469",
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
              "field": "PH_CONSENSUS_SEQUENCE_VERSION"
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
        "ontology_id": "GENEPIO:0001472",
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
        "ontology_id": "GENEPIO:0001474",
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
        "ontology_id": "GENEPIO:0001475",
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
        "ontology_id": "GENEPIO:0001476",
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
        "ontology_id": "GENEPIO:0001477",
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
        "ontology_id": "GENEPIO:0001478",
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
        "ontology_id": "GENEPIO:0001479",
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
        "ontology_id": "GENEPIO:0001480",
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
        "ontology_id": "GENEPIO:0001481",
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
        "ontology_id": "GENEPIO:0001482",
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
        "ontology_id": "GENEPIO:0001483",
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
          ]
        }
      },
      {
        "fieldName": "Ns per 100 kbp",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001484",
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
          ]
        }
      },
      {
        "fieldName": "reference genome accession",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001485",
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
        "ontology_id": "GENEPIO:0001489",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A description of the overall bioinformatics strategy used.",
        "guidance": "Further details regarding the methods used to process raw data, and/or generate assemblies, and/or generate consensus sequences can. This information can be provided in an SOP or protocol or pipeline/workflow. Provide the name and version number of the protocol, or a GitHub link to a pipeline or workflow.",
        "examples": "https://github.com/phac-nml/ncov2019-artic-nf",
        "exportField": {
          "CNPHI": [
            {
              "field": "Bioinformatics Protocol"
            }
          ],
          "NML_LIMS": [
            {
              "field": "PH_BIOINFORMATICS_PROTOCOL"
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
        "ontology_id": "GENEPIO:0001500",
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
          ]
        }
      },
      {
        "fieldName": "lineage/clade analysis software name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001501",
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
          ]
        }
      },
      {
        "fieldName": "lineage/clade analysis software version",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001502",
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
          ]
        }
      },
      {
        "fieldName": "variant designation",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001503",
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
          ]
        },
        "schema:ItemList": {
          "Variant of Concern (VOC)": {
            "ontology_id": "GENEPIO"
          },
          "Variant of Interest (VOI)": {
            "ontology_id": "GENEPIO"
          },
          "Variant Under Monitoring": {}
        }
      },
      {
        "fieldName": "variant evidence",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001504",
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
          ]
        },
        "schema:ItemList": {
          "RT-qPCR": {
            "ontology_id": "CIDO:0000019"
          },
          "Sequencing": {
            "ontology_id": "CIDO:0000027"
          }
        }
      },
      {
        "fieldName": "variant evidence details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001505",
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
        "ontology_id": "GENEPIO:0001507",
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
          ],
          "VirusSeq_Portal": [
            {
              "field": "gene name"
            }
          ]
        },
        "schema:ItemList": {
          "E gene (orf4)": {
            "ontology_id": "PR:P0DTC4",
            "exportField": {
              "CNPHI": [
                {
                  "value": "E gene"
                }
              ],
              "BIOSAMPLE": [
                {
                  "value": "E (orf4)"
                }
              ]
            }
          },
          "M gene (orf5)": {
            "ontology_id": "PR:P0DTC5",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "M (orf5)"
                }
              ]
            }
          },
          "N gene (orf9)": {
            "ontology_id": "PR:P0DTC9",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "N (orf9)"
                }
              ]
            }
          },
          "Spike gene (orf2)": {
            "ontology_id": "PR:P0DTC2",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "S (orf2)"
                }
              ]
            }
          },
          "orf1ab (rep)": {
            "ontology_id": "PR:000050281",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf1ab (rep)"
                }
              ]
            },
            "schema:ItemList": {
              "orf1a (pp1a)": {
                "ontology_id": "PR:P0DTC1-1",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "orf1a (pp1a)"
                    }
                  ]
                },
                "schema:ItemList": {
                  "nsp11": {
                    "ontology_id": "PR:000050280",
                    "exportField": {
                      "BIOSAMPLE": [
                        {
                          "value": "nsp11"
                        }
                      ]
                    }
                  }
                }
              },
              "nsp1": {
                "ontology_id": "PR:000050270",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp1"
                    }
                  ]
                }
              },
              "nsp2": {
                "ontology_id": "PR:000050271",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp2"
                    }
                  ]
                }
              },
              "nsp3": {
                "ontology_id": "PR:000050272",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp3"
                    }
                  ]
                }
              },
              "nsp4": {
                "ontology_id": "PR:000050273",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp4"
                    }
                  ]
                }
              },
              "nsp5": {
                "ontology_id": "PR:000050274",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp5"
                    }
                  ]
                }
              },
              "nsp6": {
                "ontology_id": "PR:000050275",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp6"
                    }
                  ]
                }
              },
              "nsp7": {
                "ontology_id": "PR:000050276",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp7"
                    }
                  ]
                }
              },
              "nsp8": {
                "ontology_id": "PR:000050277",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp8"
                    }
                  ]
                }
              },
              "nsp9": {
                "ontology_id": "PR:000050278",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp9"
                    }
                  ]
                }
              },
              "nsp10": {
                "ontology_id": "PR:000050279",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp10"
                    }
                  ]
                }
              },
              "RdRp gene (nsp12)": {
                "ontology_id": "PR:000050284",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp12 (RdRp)"
                    }
                  ]
                }
              },
              "hel gene (nsp13)": {
                "ontology_id": "PR:000050285",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp13 (Hel)"
                    }
                  ]
                }
              },
              "exoN gene (nsp14)": {
                "ontology_id": "PR:000050286",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp14 (ExoN)"
                    }
                  ]
                }
              },
              "nsp15": {
                "ontology_id": "PR:000050287",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp15"
                    }
                  ]
                }
              },
              "nsp16": {
                "ontology_id": "PR:000050288",
                "exportField": {
                  "BIOSAMPLE": [
                    {
                      "value": "nsp16"
                    }
                  ]
                }
              }
            }
          },
          "orf3a": {
            "ontology_id": "PR:P0DTC3",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf3a"
                }
              ]
            }
          },
          "orf3b": {
            "ontology_id": "PR NTR",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf3b"
                }
              ]
            }
          },
          "orf6 (ns6)": {
            "ontology_id": "PR:P0DTC6",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf6 (ns6)"
                }
              ]
            }
          },
          "orf7a": {
            "ontology_id": "PR:P0DTC7",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf7a"
                }
              ]
            }
          },
          "orf7b (ns7b)": {
            "ontology_id": "PR:P0DTD8",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf7b (ns7b)"
                }
              ]
            }
          },
          "orf8 (ns8)": {
            "ontology_id": "PR:P0DTC8",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf8 (ns8)"
                }
              ]
            }
          },
          "orf9b": {
            "ontology_id": "PR:P0DTD2",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf9b"
                }
              ]
            }
          },
          "orf9c": {
            "ontology_id": "PR NTR?",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf9c"
                }
              ]
            }
          },
          "orf10": {
            "ontology_id": "PR:A0A663DJA2",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf10"
                }
              ]
            }
          },
          "orf14": {
            "ontology_id": "PR NTR?",
            "exportField": {
              "BIOSAMPLE": [
                {
                  "value": "orf14"
                }
              ]
            }
          },
          "SARS-COV-2 5' UTR": {}
        }
      },
      {
        "fieldName": "diagnostic pcr protocol 1",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001508",
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
        "ontology_id": "GENEPIO:0001509",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access",
          "Indeterminate"
        ],
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
          ],
          "VirusSeq_Portal": [
            {
              "field": "diagnostic pcr Ct value"
            }
          ]
        }
      },
      {
        "fieldName": "gene name 2",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001510",
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
        "ontology_id": "GENEPIO:0001511",
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
        "ontology_id": "GENEPIO:0001512",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access",
          "Indeterminate"
        ],
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
        "ontology_id": "GENEPIO:0001513",
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
        "ontology_id": "GENEPIO:0001514",
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
        "ontology_id": "GENEPIO:0001515",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": [
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access",
          "Indeterminate"
        ],
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
        "ontology_id": "GENEPIO:0001517",
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
        "ontology_id": "GENEPIO:0001518",
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
  }
]