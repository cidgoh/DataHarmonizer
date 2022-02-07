var DATA = [
  {
    "fieldName": "Database Identifiers",
    "children": [
      {
        "fieldName": "specimen collector sample ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001123",
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
        "description": "The user-defined name for the sample.",
        "guidance": "Store the collector sample ID. If this number is considered identifiable information, provide an alternative ID. Be sure to store the key that maps between the original and alternative IDs for traceability and follow up if necessary. Every collector sample ID from a single submitter must be unique. It can have any format, but we suggest that you make it concise, unique and consistent within your lab.",
        "examples": "prov_rona_99",
        "exportField": {
          "GISAID": [
            {
              "field": "Sample ID given by the sample provider"
            },
            {
              "field": "Sample ID given by the submitting laboratory"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "sample_name"
            }
          ],
          "NCBI_SRA": [
            {
              "field": "sample_name"
            }
          ],
          "NCBI_Genbank": [
            {
              "field": "sample_name"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "Sequence_ID"
            }
          ]
        }
      },
      {
        "fieldName": "umbrella bioproject accession",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO:0001133",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The INSDC accession number assigned to the umbrella BioProject for the Canadian SARS-CoV-2 sequencing effort.",
        "guidance": "Store the umbrella BioProject accession by selecting it from the picklist in the template. The umbrella BioProject accession will be identical for all CanCOGen submitters. Different provinces will have their own BioProjects, however these BioProjects will be linked under one umbrella BioProject.",
        "examples": "PRJNA623807"
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
        "examples": "PRJNA12345",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "bioproject_accession"
            }
          ],
          "NCBI_SRA": [
            {
              "field": "bioproject_accession"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "BioProject"
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
        "requirement": "recommended",
        "description": "The identifier assigned to a BioSample in INSDC archives.",
        "guidance": "Store the accession returned from the BioSample submission. NCBI BioSamples will have the prefix SAMN.",
        "examples": "SAMN14180202",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "biosample_accession"
            }
          ],
          "NCBI_Genbank": [
            {
              "field": "biosample_accession"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "BioSample"
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
        "examples": "SRR11177792"
      },
      {
        "fieldName": "GenBank/ENA/DDBJ accession",
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
        "examples": "MN908947.3"
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
        "examples": "EPI_ISL_123456",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "gisaid_accession"
            }
          ]
        }
      },
      {
        "fieldName": "GISAID virus name",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO:0100282",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The user-defined GISAID virus name assigned to the sequence.",
        "guidance": "GISAID virus names should be in the format \"hCoV-19/Country/Identifier/year\".",
        "examples": "hCoV-19/Canada/prov_rona_99/2020",
        "exportField": {
          "GISAID": [
            {
              "field": "Virus name"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "gisaid_virus_name"
            }
          ]
        }
      },
      {
        "fieldName": "host specimen voucher",
        "capitalize": "UPPER",
        "ontology_id": "GENEPIO:0100283",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Identifier for the physical specimen.",
        "guidance": "Include a URI (Uniform Resource Identifier) in the form of a URL providing a direct link to the physical host specimen. If the specimen was destroyed in the process of analysis, electronic images (e-vouchers) are an adequate substitute for a physical host voucher specimen. If a URI is not available, a museum-provided globally unique identifier (GUID) can be used. If no persistent unique identifier is available, follow the INSDC guidance for populating the voucher_specimen attribute using standard triplets for institution codes (i.e., /specimen_voucher=\"[<institution-code>:[<collection-code>:]]<specimen_id>\"): http://www.insdc.org/controlled-vocabulary-specimenvoucher-qualifier",
        "examples": "URI example: http://portal.vertnet.org/o/fmnh/mammals?id=33e55cfe-330b-40d9-aaae-8d042cba7542, INSDC triplet example: UAM:Mamm:52179",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_specimen_voucher"
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
        "description": "The name of the agency that collected the original sample.",
        "guidance": "The name of the sample collector should be written out in full, (with minor exceptions) and be consistent across multple submissions e.g. Public Health Agency of Canada, Public Health Ontario, BC Centre for Disease Control. The sample collector specified is at the discretion of the data provider (i.e. may be hospital, provincial public health lab, or other).",
        "examples": "Public Health Agency of Canada",
        "exportField": {
          "GISAID": [
            {
              "field": "Originating lab"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "collected_by"
            }
          ]
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
        "examples": "johnnyblogs@lab.ca"
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
          ]
        }
      },
      {
        "fieldName": "sequence submitted by",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001159",
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
        "description": "The name of the agency that generated the sequence.",
        "guidance": "The name of the agency should be written out in full, (with minor exceptions) and be consistent across multple submissions. If submitting specimens rather than sequencing data, please put the \"National Microbiology Laboratory (NML)\".",
        "examples": "Centers for Disease Control and Prevention",
        "exportField": {
          "GISAID": [
            {
              "field": "Submitting lab"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "sequenced_by"
            }
          ]
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
          "NCBI_SRA": [
            {
              "field": "sequence_submitter_contact_email"
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
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The date on which the sample was collected.",
        "guidance": "Sample collection date is critical for surveillance and many types of analyses. Required granularity includes year, month and day. If this date is considered identifiable information, it is acceptable to add \"jitter\" by adding or subtracting a calendar day (acceptable by GISAID). Alternatively, \u201dreceived date\u201d may be used as a substitute. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2020-03-19",
        "exportField": {
          "GISAID": [
            {
              "field": "Collection date"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "collection_date"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "collection-date"
            }
          ]
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
        "examples": "2020-03-20"
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
        "examples": "South Africa",
        "exportField": {
          "GISAID": [
            {
              "field": "Location"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "country"
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
            "ontology_id": "GAZ:00003936"
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
        "description": "The state/province/territory where the sample was collected.",
        "guidance": "Provide the state/province/territory name from the GAZ geography ontology. Search for geography terms here: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "Western Cape",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ]
        }
      },
      {
        "fieldName": "geo_loc name (county/region)",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100280",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The county/region of origin of the sample.",
        "guidance": "Provide the county/region name from the GAZ geography ontology. Search for geography terms here: https://www.ebi.ac.uk/ols/ontologies/gaz",
        "examples": "Derbyshire",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ]
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
        "examples": "Vancouver",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "geo_loc_name"
            }
          ]
        }
      },
      {
        "fieldName": "geo_loc latitude",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100309",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The latitude coordinates of the geographical location of sample collection.",
        "guidance": "Provide latitude coordinates if available. Do not use the centre of the city/region/province/state/country or the location of your agency as a proxy, as this implicates a real location and is misleading. Specify as degrees latitude in format \"d[d.dddd] N|S\".",
        "examples": "38.98 N",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "lat_lon"
            }
          ]
        }
      },
      {
        "fieldName": "geo_loc longitude",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100310",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The longitude coordinates of the geographical location of sample collection.",
        "guidance": "Provide longitude coordinates if available. Do not use the centre of the city/region/province/state/country or the location of your agency as a proxy, as this implicates a real location and is misleading. Specify as degrees longitude in format \"d[dd.dddd] W|E\".",
        "examples": "77.11 W",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "lat_lon"
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
          "NCBI_BIOSAMPLE": [
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
            "ontology_id": "GENEPIO:0100000"
          }
        }
      },
      {
        "fieldName": "isolate",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001644",
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
        "guidance": "This identifier should be an unique, indexed, alpha-numeric ID within your laboratory. If submitted to the INSDC, the \"isolate\" name is propagated throughtout different databases. As such, structure the \"isolate\" name to be ICTV/INSDC compliant in the following format: \"SARS-CoV-2/host/country/sampleID/date\".",
        "examples": "SARS-CoV-2/human/USA/CA-CDPH-001/2020",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolate"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolate"
            }
          ]
        }
      },
      {
        "fieldName": "culture collection",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100284",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the source collection and unique culture identifier. ",
        "guidance": "Format: \"<institution-code>:[<collection-code>:]<culture_id>\". For more information, see http://www.insdc.org/controlled-vocabulary-culturecollection-qualifier.",
        "examples": "/culture_collection=\"ATCC:26370\""
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
        "requirement": "recommended",
        "description": "The reason that the sample was collected.",
        "guidance": "The reason a sample was collected may provide information about potential biases in sampling strategy. Provide the purpose of sampling from the picklist in the template. Most likely, the sample was collected for Diagnostic testing. The reason why a sample was originally collected may differ from the reason why it was selected for sequencing, which should be indicated in the \"purpose of sequencing\" field. ",
        "examples": "Diagnostic testing",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "purpose_of_sampling"
            }
          ]
        },
        "schema:ItemList": {
          "Cluster/Outbreak investigation": {
            "ontology_id": "GENEPIO:0100001"
          },
          "Diagnostic testing": {
            "ontology_id": "GENEPIO:0100002"
          },
          "Research": {
            "ontology_id": "GENEPIO:0100003"
          },
          "Protocol testing": {
            "ontology_id": "GENEPIO:0100024"
          },
          "Surveillance": {
            "ontology_id": "GENEPIO:0100004"
          }
        }
      },
      {
        "fieldName": "purpose of sampling details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001200",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The description of why the sample was collected, providing specific details.",
        "guidance": "Provide an expanded description of why the sample was collected using free text. The description may include the importance of the sample for a particular public health investigation/surveillance activity/research question. If details are not available, provide a null value.",
        "examples": "Screening of bat specimens in museum collections."
      },
      {
        "fieldName": "sample plan name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100285",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the sample plan implemented for sample collection.",
        "guidance": "Provide the name and version of the sample plan outlining the sample strategy.",
        "examples": "CanCOGeN Sampling Strategy 1.0"
      },
      {
        "fieldName": "sample collected in quarantine",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100277",
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
        "description": "Whether the sample was collected from an individual in quarantine.",
        "guidance": "Whether a sample was collected under quarantine conditions (e.g. self-quarantining, medically isolated, staying at a quarantine hotel) can inform public health measure assessments. Use the picklist provided in the template.",
        "examples": "Yes",
        "schema:ItemList": {
          "Yes": {},
          "No": {},
          "Unknown": {}
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
        "requirement": "",
        "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
        "guidance": "Provide a descriptor if an anatomical material was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Blood",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "host_anatomical_material"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
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
        "requirement": "",
        "description": "An anatomical part of an organism e.g. oropharynx.",
        "guidance": "Provide a descriptor if an anatomical part was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Nasopharynx",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "host_anatomical_part"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
            }
          ]
        },
        "schema:ItemList": {
          "Anus": {
            "ontology_id": "UBERON:0001245"
          },
          "Buccal mucosa": {
            "ontology_id": "UBERON:0006956"
          },
          "Duodenum": {
            "ontology_id": "UBERON:0002114"
          },
          "Eye": {
            "ontology_id": "UBERON:0000970"
          },
          "Intestine": {
            "ontology_id": "UBERON:0000160"
          },
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
                "ontology_id": "UBERON:0001707",
                "schema:ItemList": {
                  "Middle Nasal Turbinate": {
                    "ontology_id": "UBERON:0005921"
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
                "ontology_id": "UBERON:0002185"
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
                "ontology_id": "UBERON:0009778",
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
        "requirement": "",
        "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
        "guidance": "Provide a descriptor if a body product was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Feces",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "host_body_product"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
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
        "requirement": "",
        "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage.",
        "guidance": "Provide a descriptor if an environmental material was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Face mask",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "environmental_material"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
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
            "ontology_id": "OBI:0002796"
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
            "ontology_id": "GENEPIO:0100025"
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
        "requirement": "",
        "description": "An environmental location may describe a site in the natural or built environment e.g. contact surface, metal can, hospital, wet market, bat cave.",
        "guidance": "Provide a descriptor if an environmental site was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Hospital room",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "environmental_site"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
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
            "ontology_id": "ENVO:03501145"
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
        "requirement": "",
        "description": "The instrument or container used to collect the sample e.g. swab.",
        "guidance": "Provide a descriptor if a device was used for sampling. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Swab",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "collection_device"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
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
            "ontology_id": "GENEPIO:0100026"
          },
          "Fibrobronchoscope Brush": {
            "ontology_id": "OBI:0002825"
          },
          "Filter": {
            "ontology_id": "GENEPIO:0100103"
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
            "ontology_id": "GENEPIO:0100027"
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
        "requirement": "",
        "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
        "guidance": "Provide a descriptor if a collection method was used for sampling. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma.griffiths@bccdc.ca. If not applicable, do not leave blank. Choose a null value. ",
        "examples": "Bronchoalveolar lavage (BAL)",
        "exportField": {
          "GISAID": [
            {
              "field": "Specimen source"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "isolation_source"
            },
            {
              "field": "collection_method"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "isolation-source"
            }
          ]
        },
        "schema:ItemList": {
          "Amniocentesis": {
            "ontology_id": "NCIT:C52009"
          },
          "Aspiration": {
            "ontology_id": "NCIT:C15631",
            "schema:ItemList": {
              "Suprapubic Aspiration": {
                "ontology_id": "GENEPIO:0100028"
              },
              "Tracheal aspiration": {
                "ontology_id": "GENEPIO:0100029"
              },
              "Vacuum Aspiration": {
                "ontology_id": "GENEPIO:0100030"
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
                "ontology_id": "GENEPIO:0100031"
              }
            }
          },
          "Lavage (medical wash)": {
            "ontology_id": "OBI:0600044",
            "schema:ItemList": {
              "Bronchoalveolar lavage (BAL)": {
                "ontology_id": "GENEPIO:0100032"
              },
              "Gastric Lavage": {
                "ontology_id": "GENEPIO:0100033"
              }
            }
          },
          "Lumbar Puncture": {
            "ontology_id": "NCIT:C15327"
          },
          "Necropsy": {
            "ontology_id": "MMO:0000344"
          },
          "Phlebotomy": {
            "ontology_id": "NCIT:C28221"
          },
          "Rinsing (wash)": {
            "ontology_id": "GENEPIO:0002116",
            "schema:ItemList": {
              "Saline gargle (mouth rinse and gargle)": {
                "ontology_id": "GENEPIO:0100034"
              }
            }
          },
          "Scraping": {
            "ontology_id": "GENEPIO:0100035"
          },
          "Swabbing": {
            "ontology_id": "GENEPIO:0002117",
            "schema:ItemList": {
              "Finger Prick": {
                "ontology_id": "GENEPIO:0100036"
              }
            }
          },
          "Washout Tear Collection": {
            "ontology_id": "GENEPIO:0100038"
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
        "examples": "SC2SamplingProtocol 1.2"
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
        "schema:ItemList": {
          "Virus passage": {
            "ontology_id": "GENEPIO:0100039"
          },
          "RNA re-extraction (post RT-PCR)": {
            "ontology_id": "GENEPIO:0100040"
          },
          "Specimens pooled": {
            "ontology_id": "OBI:0600016"
          },
          "Technical replicate": {
            "ontology_id": "EFO:0002090"
          }
        }
      },
      {
        "fieldName": "specimen processing details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100311",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Detailed information regarding the processing applied to a sample during or after receiving the sample.",
        "guidance": "Provide a free text description of any processing details applied to a sample.",
        "examples": "25 swabs were pooled and further prepared as a single sample during library prep."
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
        "requirement": "",
        "description": "Name and description of the laboratory host used to propagate the source organism or material from which the sample was obtained.",
        "guidance": "Type of cell line used for propagation. Provide the name of the cell line using the picklist in the template. If not passaged, put \"not applicable\".",
        "examples": "Vero E6 cell line",
        "schema:ItemList": {
          "293/ACE2 cell line": {
            "ontology_id": "GENEPIO:0100041"
          },
          "Caco2 cell line": {
            "ontology_id": "BTO:0000195"
          },
          "Calu3 cell line": {
            "ontology_id": "BTO:0002750"
          },
          "EFK3B cell line": {
            "ontology_id": "GENEPIO:0100042"
          },
          "HEK293T cell line": {
            "ontology_id": "BTO:0002181"
          },
          "HRCE cell line": {
            "ontology_id": "GENEPIO:0100043"
          },
          "Huh7 cell line": {
            "ontology_id": "BTO:0001950"
          },
          "LLCMk2 cell line": {
            "ontology_id": "CLO:0007330"
          },
          "MDBK cell line": {
            "ontology_id": "BTO:0000836"
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
            "ontology_id": "BTO:0001444"
          },
          "Vero E6 cell line": {
            "ontology_id": "BTO:0004755"
          },
          "VeroE6/TMPRSS2 cell line": {
            "ontology_id": "GENEPIO:0100044"
          }
        }
      },
      {
        "fieldName": "passage number",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001261",
        "datatype": "xs:nonNegativeInteger",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Number of passages.",
        "guidance": "Provide number of known passages. If not passaged, put \"not applicable\"",
        "examples": "3",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "passage_number"
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
          "Not Applicable",
          "Missing",
          "Not Collected",
          "Not Provided",
          "Restricted Access"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Description of how organism was passaged.",
        "guidance": "Free text. Provide a very short description (<10 words). If not passaged, put \"not applicable\".",
        "examples": "AVL buffer+30%EtOH lysate received from Respiratory Lab. P3 passage in Vero-1 via bioreactor large-scale batch passage. P3 batch derived from the SP-2/reference lab strain.",
        "exportField": {
          "NCBI_BIOSAMPLE": [
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
            "ontology_id": "GENEPIO:0100104"
          },
          "mRNA (cDNA)": {
            "ontology_id": "OBI:0002754"
          }
        }
      },
      {
        "fieldName": "data abstraction details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100278",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A description of how any data elements were altered to preserve patient privacy.",
        "guidance": "If applicable, provide a description of how each data element was abstracted. ",
        "examples": "Jitter added to publicly shared collection dates to prevent re-identifiability."
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
        "schema:ItemList": {
          "Human": {
            "ontology_id": "NCBITaxon:9605"
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
            "ontology_id": "NCBITaxon:9913"
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
            "ontology_id": "NCBITaxon:9825"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host"
            }
          ],
          "NCBI_Genbank_source_modifiers": [
            {
              "field": "host"
            }
          ]
        },
        "schema:ItemList": {
          "Homo sapiens": {
            "ontology_id": "NCBITaxon:9606"
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
        "examples": "Asymptomatic",
        "exportField": {
          "GISAID": [
            {
              "field": "Patient status"
            }
          ],
          "NCBI_BIOSAMPLE": [
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
          "Recovered": {
            "ontology_id": "NCIT:C49498"
          },
          "Symptomatic": {
            "ontology_id": "NCIT:C25269"
          }
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
        "schema:ItemList": {
          "Hospitalized": {
            "ontology_id": "NCIT:C25179",
            "schema:ItemList": {
              "Hospitalized (Non-ICU)": {
                "ontology_id": "GENEPIO:0100045"
              },
              "Hospitalized (ICU)": {
                "ontology_id": "GENEPIO:0100046"
              }
            }
          },
          "Mechanical Ventilation": {
            "ontology_id": "NCIT:C70909"
          },
          "Medically Isolated": {
            "ontology_id": "GENEPIO:0100047",
            "schema:ItemList": {
              "Medically Isolated (Negative Pressure)": {
                "ontology_id": "GENEPIO:0100048"
              }
            }
          },
          "Self-quarantining": {
            "ontology_id": "NCIT:C173768"
          }
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_disease"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_disease_outcome"
            }
          ]
        },
        "schema:ItemList": {
          "Deceased": {
            "ontology_id": "NCIT:C28554"
          },
          "Deteriorating": {
            "ontology_id": "NCIT:C25254"
          },
          "Recovered": {
            "ontology_id": "NCIT:C49498"
          },
          "Stable": {
            "ontology_id": "NCIT:C30103"
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
        "requirement": "recommended",
        "description": "Age of host at the time of sampling.",
        "guidance": "Enter the age of the host in years. If not available, provide a null value. If there is not host, put \"Not Applicable\".",
        "examples": "79",
        "exportField": {
          "GISAID": [
            {
              "field": "Patient age"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_age"
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
        "requirement": "recommended",
        "description": "The unit used to measure the host age, in either months or years.",
        "guidance": "Indicate whether the host age is in months or years. Age indicated in months will be binned to the 0 - 9 year age bin. ",
        "examples": "years",
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
        "requirement": "recommended",
        "description": "Age of host at the time of sampling, expressed as an age group.",
        "guidance": "Select the corresponding host age bin from the pick list provided in the template. If not available, provide a null value.",
        "examples": "60 - 69",
        "schema:ItemList": {
          "0 - 9": {
            "ontology_id": "GENEPIO:0100049"
          },
          "10 - 19": {
            "ontology_id": "GENEPIO:0100050"
          },
          "20 - 29": {
            "ontology_id": "GENEPIO:0100051"
          },
          "30 - 39": {
            "ontology_id": "GENEPIO:0100052"
          },
          "40 - 49": {
            "ontology_id": "GENEPIO:0100053"
          },
          "50 - 59": {
            "ontology_id": "GENEPIO:0100054"
          },
          "60 - 69": {
            "ontology_id": "GENEPIO:0100055"
          },
          "70 - 79": {
            "ontology_id": "GENEPIO:0100056"
          },
          "80 - 89": {
            "ontology_id": "GENEPIO:0100057"
          },
          "90 - 99": {
            "ontology_id": "GENEPIO:0100058"
          },
          "100+": {
            "ontology_id": "GENEPIO:0100059"
          }
        }
      },
      {
        "fieldName": "host gender",
        "capitalize": "",
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
        "requirement": "recommended",
        "description": "The gender of the host at the time of sample collection.",
        "guidance": "Select the corresponding host gender from the pick list provided in the template. If not available, provide a null value. If there is no host, put \"Not Applicable\".",
        "examples": "male",
        "exportField": {
          "GISAID": [
            {
              "field": "Gender"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_sex"
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
          "Transgender (Male to Female)": {
            "ontology_id": "GSSO:004004"
          },
          "Transgender (Female to Male)": {
            "ontology_id": "GSSO:004005"
          },
          "Undeclared": {
            "ontology_id": "NCIT:C110959"
          }
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
        "examples": "Canada",
        "schema:ItemList": {}
      },
      {
        "fieldName": "host ethnicity",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The self-identified ethnicity(ies) of the host.",
        "guidance": "If known, provide the self-identified ethnicity or ethnicities of the host as a free text description. This is highly sensitive information which must be treated respectfully and carefully when sharing. The information may have implications for equitable access and benefit sharing. Consult your privacy officer, data steward and/or cultural services representative.",
        "examples": "Indigenous, European"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_subject_id"
            }
          ]
        }
      },
      {
        "fieldName": "case ID",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100281",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The identifier used to specify an epidemiologically detected case of disease.",
        "guidance": "Provide the case identifer. The case ID greatly facilitates linkage between laboratory and epidemiological data. The case ID may be considered identifiable information. Consult the data steward before sharing.",
        "examples": "ABCD1234"
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
        "examples": "2020-03-16"
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
        "examples": "Cough, Fever, Chills",
        "schema:ItemList": {
          "Abnormal lung auscultation": {
            "ontology_id": "HP:0030829"
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
                "ontology_id": "HP:0000224"
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
            "ontology_id": "HP:0033677"
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
                "ontology_id": "GENEPIO:0100061"
              },
              "Irritability": {
                "ontology_id": "HP:0000737"
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
            "ontology_id": "HP:0025143"
          },
          "Conjunctival injection": {
            "ontology_id": "HP:0030953"
          },
          "Conjunctivitis (pink eye)": {
            "ontology_id": "HP:0000509"
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
                    "ontology_id": "GENEPIO:0100062"
                  }
                }
              },
              "Central Cyanosis": {
                "ontology_id": "GENEPIO:0100063",
                "schema:ItemList": {
                  "Cyanotic lips (bluish lips)": {
                    "ontology_id": "GENEPIO:0100064"
                  }
                }
              },
              "Peripheral Cyanosis": {
                "ontology_id": "GENEPIO:0100065"
              }
            }
          },
          "Dyspnea (breathing difficulty)": {
            "ontology_id": "HP:0002094"
          },
          "Diarrhea (watery stool)": {
            "ontology_id": "HP:0002014"
          },
          "Dry gangrene": {
            "ontology_id": "MP:0031127"
          },
          "Encephalitis (brain inflammation)": {
            "ontology_id": "HP:0002383"
          },
          "Encephalopathy": {
            "ontology_id": "HP:0001298"
          },
          "Fatigue (tiredness)": {
            "ontology_id": "HP:0012378"
          },
          "Fever": {
            "ontology_id": "HP:0001945",
            "schema:ItemList": {
              "Fever (>=38\u00b0C)": {
                "ontology_id": "GENEPIO:0100066"
              }
            }
          },
          "Glossitis (inflammation of the tongue)": {
            "ontology_id": "HP:0000206"
          },
          "Ground Glass Opacities (GGO)": {
            "ontology_id": "GENEPIO:0100067"
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
                "ontology_id": "GENEPIO:0100068"
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
            "ontology_id": "HP:0004396"
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
            "ontology_id": "GENEPIO:0100069"
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
            "ontology_id": "GENEPIO:0100070"
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
                "ontology_id": "GENEPIO:0100072"
              },
              "Pseudo-chilblains on toes (covid toes)": {
                "ontology_id": "GENEPIO:0100073"
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
        "description": "Patient pre-existing conditions and risk factors. Pre-existing condition: A medical condition that existed prior to the current infection. Risk Factor: A variable associated with an increased risk of disease or infection.",
        "guidance": "Select all of the pre-existing conditions and risk factors experienced by the host from the pick list. If the desired term is missing, contact the curation team.",
        "examples": "Asthma",
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
                "ontology_id": "GENEPIO:0100074"
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
            "ontology_id": "GENEPIO:0100075"
          },
          "Chronic gastrointestinal disease": {
            "ontology_id": "GENEPIO:0100076"
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
          "Myalgic encephalomyelitis (ME)": {
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
          "Postpartum (\u22646 weeks)": {
            "ontology_id": "GENEPIO:0100077"
          },
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
                "ontology_id": "GENEPIO:0100078",
                "schema:ItemList": {
                  "Injection drug abuse": {
                    "ontology_id": "GENEPIO:0100079"
                  }
                }
              },
              "Smoking": {
                "ontology_id": "NBO:0015005"
              },
              "Vaping": {
                "ontology_id": "NCIT:C173621"
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
                "ontology_id": "GENEPIO:0100080"
              },
              "Cardiac transplant": {
                "ontology_id": "NCIT:C131759"
              },
              "Kidney transplant": {
                "ontology_id": "NCIT:C157332"
              },
              "Liver transplant": {
                "ontology_id": "GENEPIO:0100081"
              }
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
        "examples": "Acute Respiratory Failure",
        "schema:ItemList": {
          "Abnormal blood oxygen level": {
            "ontology_id": "HP:0500165"
          },
          "Acute kidney injury": {
            "ontology_id": "HP:0001919"
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
                    "ontology_id": "GENEPIO:0100084"
                  }
                }
              }
            }
          },
          "Cardiac injury": {
            "ontology_id": "GENEPIO:0100087"
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
            "ontology_id": "NCIT:C171562"
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
            "ontology_id": "GENEPIO:0100088"
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
            "ontology_id": "MONDO:0012727",
            "schema:ItemList": {
              "Complete Kawasaki disease": {
                "ontology_id": "GENEPIO:0100089"
              },
              "Incomplete Kawasaki disease": {
                "ontology_id": "GENEPIO:0100090"
              }
            }
          },
          "Long COVID-19": {
            "ontology_id": "MONDO:0100233"
          },
          "Liver dysfunction": {
            "ontology_id": "HP:0001410",
            "schema:ItemList": {
              "Acute liver injury": {
                "ontology_id": "GENEPIO:0100091"
              }
            }
          },
          "Acute lung injury": {
            "ontology_id": "MONDO:0015796",
            "schema:ItemList": {
              "Ventilation induced lung injury (VILI)": {
                "ontology_id": "GENEPIO:0100092"
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
            "ontology_id": "GENEPIO:0100093"
          },
          "Myalgic encephalomyelitis (chronic fatigue syndrome)": {
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
            "ontology_id": "HP:0001700"
          },
          "Neonatal complications": {
            "ontology_id": "NCIT:C168498"
          },
          "Noncardiogenic pulmonary edema": {
            "ontology_id": "GENEPIO:0100085",
            "schema:ItemList": {
              "Acute respiratory distress syndrome (ARDS)": {
                "ontology_id": "HP:0033677",
                "schema:ItemList": {
                  "COVID-19 associated ARDS (CARDS)": {
                    "ontology_id": "NCIT:C171551"
                  },
                  "Neurogenic pulmonary edema (NPE)": {
                    "ontology_id": "GENEPIO:0100086"
                  }
                }
              }
            }
          },
          "Organ failure": {
            "ontology_id": "GENEPIO:0100094",
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
                "ontology_id": "GENEPIO:0100095"
              },
              "Secondary strep infection": {
                "ontology_id": "GENEPIO:0100096"
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
              "Sepsis (systemic inflammatory response to infection)": {
                "ontology_id": "IDO:0000636"
              },
              "Septicemia (bloodstream infection)": {
                "ontology_id": "NCIT:C3364"
              }
            }
          },
          "Shock": {
            "ontology_id": "HP:0031273",
            "schema:ItemList": {
              "Hyperinflammatory shock": {
                "ontology_id": "GENEPIO:0100097"
              },
              "Refractory cardiogenic shock": {
                "ontology_id": "GENEPIO:0100098"
              },
              "Refractory cardiogenic plus vasoplegic shock": {
                "ontology_id": "GENEPIO:0100099"
              },
              "Septic shock": {
                "ontology_id": "NCIT:C35018"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "prior_sars_cov_2_vaccination"
            }
          ]
        },
        "schema:ItemList": {
          "Fully Vaccinated": {
            "ontology_id": "GENEPIO:0100100",
            "exportField": {
              "NCBI_BIOSAMPLE": [
                {
                  "field": "prior_SARS-CoV-2_vaccination",
                  "value": "Yes"
                }
              ]
            }
          },
          "Partially Vaccinated": {
            "ontology_id": "GENEPIO:0100101",
            "exportField": {
              "NCBI_BIOSAMPLE": [
                {
                  "field": "prior_SARS-CoV-2_vaccination",
                  "value": "Yes"
                }
              ]
            }
          },
          "Not Vaccinated": {
            "ontology_id": "GENEPIO:0100102",
            "exportField": {
              "NCBI_BIOSAMPLE": [
                {
                  "field": "prior_SARS-CoV-2_vaccination",
                  "value": "No"
                }
              ]
            }
          }
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
        "ontology_id": "GENEPIO:0100313",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the vaccine administered as the first dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the first dose by selecting a value from the pick list.",
        "examples": "Pfizer-BioNTech (Comirnaty)"
      },
      {
        "fieldName": "vaccination dose 1 vaccination date",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100314",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the first dose of a vaccine was administered.",
        "guidance": "Provide the date the first dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-03-01"
      },
      {
        "fieldName": "vaccination dose 2 vaccine name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100315",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the vaccine administered as the second dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the second dose by selecting a value from the pick list.",
        "examples": "Pfizer-BioNTech (Comirnaty)"
      },
      {
        "fieldName": "vaccination dose 2 vaccination date",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100316",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the second dose of a vaccine was administered.",
        "guidance": "Provide the date the second dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-09-01"
      },
      {
        "fieldName": "vaccination dose 3 vaccine name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100317",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the vaccine administered as the third dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the third dose by selecting a value from the pick list.",
        "examples": "Pfizer-BioNTech (Comirnaty)"
      },
      {
        "fieldName": "vaccination dose 3 vaccination date",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100318",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the third dose of a vaccine was administered.",
        "guidance": "Provide the date the third dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2021-12-30",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "date_of_sars_cov_2_vaccination"
            }
          ]
        }
      },
      {
        "fieldName": "vaccination dose 4 vaccine name",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100319",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The name of the vaccine administered as the fourth dose of a vaccine regimen.",
        "guidance": "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the fourth dose by selecting a value from the pick list.",
        "examples": "Pfizer-BioNTech (Comirnaty)"
      },
      {
        "fieldName": "vaccination dose 4 vaccination date",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100320",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the fourth dose of a vaccine was administered.",
        "guidance": "Provide the date the fourth dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\".",
        "examples": "2022-01-15"
      },
      {
        "fieldName": "vaccination history",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100321",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A description of the vaccines received and the administration dates of a series of vaccinations against a specific disease or a set of diseases.",
        "guidance": "Free text description of the dates and vaccines administered against a particular disease/set of diseases. It is also acceptable to concatenate the individual dose information (vaccine name, vaccination date) separated by semicolons.",
        "examples": "Pfizer-BioNTech (Comirnaty); 2021-03-01; Pfizer-BioNTech (Comirnaty); 2022-01-15",
        "exportField": {
          "GISAID": [
            {
              "field": "Last vaccinated"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "geo_loc_exposure"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_recent_travel_loc"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_recent_travel_loc"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_recent_travel_loc"
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
        "examples": "2020-03-16"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "host_recent_travel_return_date"
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
        "examples": "Canada, Vancouver; USA, Seattle; Italy, Milan"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "exposure_event"
            }
          ]
        },
        "schema:ItemList": {
          "Mass Gathering": {
            "ontology_id": "GENEPIO:0100237",
            "schema:ItemList": {
              "Convention": {
                "ontology_id": "GENEPIO:0100238"
              },
              "Convocation": {
                "ontology_id": "GENEPIO:0100239"
              },
              "Agricultural Event": {
                "ontology_id": "GENEPIO:0100240"
              }
            }
          },
          "Religious Gathering": {
            "ontology_id": "GENEPIO:0100241",
            "schema:ItemList": {
              "Mass": {
                "ontology_id": "GENEPIO:0100242"
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
                "ontology_id": "GENEPIO:0100243",
                "schema:ItemList": {
                  "Family Reunion": {
                    "ontology_id": "GENEPIO:0100244"
                  }
                }
              },
              "Funeral": {
                "ontology_id": "GENEPIO:0100245"
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
          "Other exposure event": {}
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
        "schema:ItemList": {
          "Contact with infected individual": {
            "schema:ItemList": {
              "Direct contact (direct human-to-human contact)": {
                "ontology_id": "TRANS:0000001"
              },
              "Indirect contact": {
                "ontology_id": "GENEPIO:0100246",
                "schema:ItemList": {
                  "Close contact (face-to-face, no direct contact)": {
                    "ontology_id": "GENEPIO:0100247"
                  },
                  "Casual contact": {
                    "ontology_id": "GENEPIO:0100248"
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
          "GISAID": [
            {
              "field": "Additional host information"
            }
          ]
        },
        "schema:ItemList": {
          "Attendee": {
            "ontology_id": "GENEPIO:0100249",
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
                "ontology_id": "NCIT:C25182"
              },
              "Outpatient": {
                "ontology_id": "NCIT:C28293"
              }
            }
          },
          "Passenger": {
            "ontology_id": "GENEPIO:0100250"
          },
          "Resident": {
            "ontology_id": "GENEPIO:0100251"
          },
          "Visitor": {
            "ontology_id": "GENEPIO:0100252"
          },
          "Volunteer": {
            "ontology_id": "GENEPIO:0100253"
          },
          "Work": {
            "ontology_id": "GENEPIO:0100254",
            "schema:ItemList": {
              "Administrator": {
                "ontology_id": "GENEPIO:0100255"
              },
              "First Responder": {
                "ontology_id": "GENEPIO:0100256",
                "schema:ItemList": {
                  "Firefighter": {
                    "ontology_id": "GENEPIO:0100257"
                  },
                  "Paramedic": {
                    "ontology_id": "GENEPIO:0100258"
                  },
                  "Police Officer": {
                    "ontology_id": "GENEPIO:0100259"
                  }
                }
              },
              "Housekeeper": {
                "ontology_id": "GENEPIO:0100260"
              },
              "Kitchen Worker": {
                "ontology_id": "GENEPIO:0100261"
              },
              "Healthcare Worker": {},
              "Laboratory Worker": {
                "ontology_id": "GENEPIO:0100262"
              },
              "Nurse": {
                "ontology_id": "OMRSE:00000014"
              },
              "Personal Care Aid": {
                "ontology_id": "GENEPIO:0100263"
              },
              "Pharmacist": {
                "ontology_id": "GENEPIO:0100264"
              },
              "Physician": {
                "ontology_id": "OMRSE:00000013"
              },
              "Rotational Worker": {},
              "Seasonal Worker": {},
              "Veterinarian": {
                "ontology_id": "GENEPIO:0100265"
              }
            }
          },
          "Social role": {
            "ontology_id": "OMRSE:00000001",
            "schema:ItemList": {
              "Acquaintance of case": {
                "ontology_id": "GENEPIO:0100266"
              },
              "Relative of case": {
                "ontology_id": "GENEPIO:0100267",
                "schema:ItemList": {
                  "Child of case": {
                    "ontology_id": "GENEPIO:0100268"
                  },
                  "Parent of case": {
                    "ontology_id": "GENEPIO:0100269"
                  },
                  "Father of case": {
                    "ontology_id": "GENEPIO:0100270"
                  },
                  "Mother of case": {
                    "ontology_id": "GENEPIO:0100271"
                  }
                }
              },
              "Spouse of case": {
                "ontology_id": "GENEPIO:0100272"
              }
            }
          },
          "Other Host Role": {}
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
          "GISAID": [
            {
              "field": "Additional host information"
            }
          ]
        },
        "schema:ItemList": {
          "Human Exposure": {
            "ontology_id": "ECTO:3000005",
            "schema:ItemList": {
              "Contact with Known COVID-19 Case": {
                "ontology_id": "GENEPIO:0100184"
              },
              "Contact with Patient": {
                "ontology_id": "GENEPIO:0100185"
              },
              "Contact with Probable COVID-19 Case": {
                "ontology_id": "GENEPIO:0100186"
              },
              "Contact with Person with Acute Respiratory Illness": {
                "ontology_id": "GENEPIO:0100187"
              },
              "Contact with Person with Fever and/or Cough": {
                "ontology_id": "GENEPIO:0100188"
              },
              "Contact with Person who Recently Travelled": {
                "ontology_id": "GENEPIO:0100189"
              }
            }
          },
          "Occupational, Residency or Patronage Exposure": {
            "ontology_id": "GENEPIO:0100190",
            "schema:ItemList": {
              "Abbatoir": {
                "ontology_id": "ECTO:1000033"
              },
              "Animal Rescue": {
                "ontology_id": "GENEPIO:0100191"
              },
              "Childcare": {
                "ontology_id": "GENEPIO:0100192",
                "schema:ItemList": {
                  "Daycare": {
                    "ontology_id": "GENEPIO:0100193"
                  }
                }
              },
              "Nursery": {
                "ontology_id": "GENEPIO:0100194"
              },
              "Community Service Centre": {
                "ontology_id": "GENEPIO:0100195"
              },
              "Correctional Facility": {
                "ontology_id": "GENEPIO:0100196"
              },
              "Dormitory": {
                "ontology_id": "GENEPIO:0100197"
              },
              "Farm": {
                "ontology_id": "ECTO:1000034"
              },
              "First Nations Reserve": {
                "ontology_id": "GENEPIO:0100198"
              },
              "Funeral Home": {
                "ontology_id": "GENEPIO:0100199"
              },
              "Group Home": {
                "ontology_id": "GENEPIO:0100200"
              },
              "Healthcare Setting": {
                "ontology_id": "GENEPIO:0100201",
                "schema:ItemList": {
                  "Ambulance": {
                    "ontology_id": "GENEPIO:0100202"
                  },
                  "Acute Care Facility": {
                    "ontology_id": "GENEPIO:0100203"
                  },
                  "Clinic": {
                    "ontology_id": "GENEPIO:0100204"
                  },
                  "Community Health Centre": {
                    "ontology_id": "GENEPIO:0100205"
                  },
                  "Hospital": {
                    "ontology_id": "ECTO:1000035",
                    "schema:ItemList": {
                      "Emergency Department": {
                        "ontology_id": "GENEPIO:0100206"
                      },
                      "ICU": {
                        "ontology_id": "GENEPIO:0100207"
                      },
                      "Ward": {
                        "ontology_id": "GENEPIO:0100208"
                      }
                    }
                  },
                  "Laboratory": {
                    "ontology_id": "ECTO:1000036"
                  },
                  "Long-Term Care Facility": {
                    "ontology_id": "GENEPIO:0100209"
                  },
                  "Pharmacy": {
                    "ontology_id": "GENEPIO:0100210"
                  },
                  "Physician's Office": {
                    "ontology_id": "GENEPIO:0100211"
                  }
                }
              },
              "Household": {
                "ontology_id": "GENEPIO:0100212"
              },
              "Insecure Housing (Homeless)": {
                "ontology_id": "GENEPIO:0100213"
              },
              "Occupational Exposure": {
                "ontology_id": "GENEPIO:0100214",
                "schema:ItemList": {
                  "Worksite": {
                    "ontology_id": "GENEPIO:0100215"
                  },
                  "Office": {
                    "ontology_id": "ECTO:1000037"
                  }
                }
              },
              "Outdoors": {
                "ontology_id": "GENEPIO:0100216",
                "schema:ItemList": {
                  "Camp/camping": {
                    "ontology_id": "ECTO:5000009"
                  },
                  "Hiking Trail": {
                    "ontology_id": "GENEPIO:0100217"
                  },
                  "Hunting Ground": {
                    "ontology_id": "ECTO:6000030"
                  },
                  "Ski Resort": {
                    "ontology_id": "GENEPIO:0100218"
                  }
                }
              },
              "Petting zoo": {
                "ontology_id": "ECTO:5000008"
              },
              "Place of Worship": {
                "ontology_id": "GENEPIO:0100220",
                "schema:ItemList": {
                  "Church": {
                    "ontology_id": "GENEPIO:0100221"
                  },
                  "Mosque": {
                    "ontology_id": "GENEPIO:0100222"
                  },
                  "Temple": {
                    "ontology_id": "GENEPIO:0100223"
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
                "ontology_id": "GENEPIO:0100224"
              },
              "Temporary Residence": {
                "ontology_id": "GENEPIO:0100225",
                "schema:ItemList": {
                  "Homeless Shelter": {
                    "ontology_id": "GENEPIO:0100226"
                  },
                  "Hotel": {
                    "ontology_id": "GENEPIO:0100227"
                  }
                }
              },
              "Veterinary Care Clinic": {
                "ontology_id": "GENEPIO:0100228"
              }
            }
          },
          "Travel Exposure": {
            "ontology_id": "GENEPIO:0100229",
            "schema:ItemList": {
              "Travelled on a Cruise Ship": {
                "ontology_id": "GENEPIO:0100230"
              },
              "Travelled on a Plane": {
                "ontology_id": "GENEPIO:0100231"
              },
              "Travelled on Ground Transport": {
                "ontology_id": "GENEPIO:0100232"
              },
              "Travelled outside Province/Territory": {
                "ontology_id": "GENEPIO:0001118"
              },
              "Travelled outside Canada": {
                "ontology_id": "GENEPIO:0001119"
              }
            }
          },
          "Other Exposure Setting": {
            "ontology_id": "GENEPIO:0100235"
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
        "examples": "Host role - Other: Bus Driver"
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
        "guidance": "If known, provide infromation about whether the individual had a previous SARS-CoV-2 infection. Select a value from the pick list.",
        "examples": "Yes",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "prior_sars_cov_2_infection"
            }
          ]
        },
        "schema:ItemList": {}
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "virus_isolate_of_prior_infection"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "date_of_prior_sars_cov_2_infection"
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
        "guidance": "If known, provide infromation about whether the individual had a previous SARS-CoV-2 antiviral treatment. Select a value from the pick list.",
        "examples": "No prior antiviral treatment",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "prior_sars_cov_2_antiviral_treat"
            }
          ]
        },
        "schema:ItemList": {
          "Prior antivrial treatment": {
            "ontology_id": "GENEPIO:0100237",
            "exportField": {
              "NCBI_BIOSAMPLE": [
                {
                  "field": "prior_SARS-CoV-2_antiviral_treatment",
                  "value": "Yes"
                }
              ]
            }
          },
          "No prior antivrial treatment": {
            "ontology_id": "GENEPIO:0100233",
            "exportField": {
              "NCBI_BIOSAMPLE": [
                {
                  "field": "prior_SARS-CoV-2_antiviral_treatment",
                  "value": "No"
                }
              ]
            }
          },
          "Prior antiviral treatment": {
            "ontology_id": "GENEPIO:0100037"
          },
          "No prior antiviral treatment": {
            "ontology_id": "GENEPIO:0100233"
          }
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "antiviral_treatment_agent"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "date_of_prior_antiviral_treat"
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
          "GISAID": [
            {
              "field": "Sampling Strategy"
            }
          ],
          "NCBI_BIOSAMPLE": [
            {
              "field": "purpose_of_sequencing"
            }
          ]
        },
        "schema:ItemList": {
          "Baseline surveillance (random sampling)": {
            "ontology_id": "GENEPIO:0100005"
          },
          "Targeted surveillance (non-random sampling)": {
            "ontology_id": "GENEPIO:0100006",
            "schema:ItemList": {
              "Priority surveillance project": {
                "ontology_id": "GENEPIO:0100007",
                "schema:ItemList": {
                  "Screening for Variants of Concern (VoC)": {
                    "ontology_id": "GENEPIO:0100008"
                  },
                  "Longitudinal surveillance (repeat sampling of individuals)": {
                    "ontology_id": "GENEPIO:0100009"
                  },
                  "Re-infection surveillance": {
                    "ontology_id": "GENEPIO:0100010"
                  },
                  "Vaccine escape surveillance": {
                    "ontology_id": "GENEPIO:0100011"
                  },
                  "Travel-associated surveillance": {
                    "ontology_id": "GENEPIO:0100012",
                    "schema:ItemList": {
                      "Domestic travel surveillance": {
                        "ontology_id": "GENEPIO:0100013",
                        "schema:ItemList": {
                          "Interstate/ interprovincial travel surveillance": {
                            "ontology_id": "GENEPIO:0100275"
                          },
                          "Intra-state/ intra-provincial travel surveillance": {
                            "ontology_id": "GENEPIO:0100276"
                          }
                        }
                      },
                      "International travel surveillance": {
                        "ontology_id": "GENEPIO:0100014",
                        "schema:ItemList": {
                          "Surveillance of international border crossing by air travel or ground transport": {
                            "ontology_id": "GENEPIO:0100015"
                          },
                          "Surveillance of international border crossing by air travel": {
                            "ontology_id": "GENEPIO:0100016"
                          },
                          "Surveillance of international border crossing by ground transport": {
                            "ontology_id": "GENEPIO:0100017"
                          },
                          "Surveillance from international worker testing": {
                            "ontology_id": "GENEPIO:0100018"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "Sample has epidemiological link to Variant of Concern (VoC)": {
            "ontology_id": "GENEPIO:0100273"
          },
          "Sample has epidemiological link to Omicron Variant": {
            "ontology_id": "GENEPIO:0100274"
          },
          "Cluster/Outbreak investigation": {
            "ontology_id": "GENEPIO:0100019",
            "schema:ItemList": {
              "Multi-jurisdictional outbreak investigation": {
                "ontology_id": "GENEPIO:0100020"
              },
              "Intra-jurisdictional outbreak investigation": {
                "ontology_id": "GENEPIO:0100021"
              }
            }
          },
          "Research": {
            "ontology_id": "GENEPIO:0100022",
            "schema:ItemList": {
              "Viral passage experiment": {
                "ontology_id": "GENEPIO:0100023"
              },
              "Protocol testing experiment": {
                "ontology_id": "GENEPIO:0100024"
              }
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
        "guidance": "Provide an expanded description of why the sample was sequenced using free text. The description may include the importance of the sequences for a particular public health investigation/surveillance activity/research question. Suggested standardized descriotions include: Screened for S gene target failure (S dropout), Screened for mink variants, Screened for B.1.1.7 variant, Screened for B.1.135 variant, Screened for P.1 variant, Screened due to travel history, Screened due to close contact with infected individual, Assessing public health control measures, Determining early introductions and spread, Investigating airline-related exposures, Investigating temporary foreign worker, Investigating remote regions, Investigating health care workers, Investigating schools/universities, Investigating reinfection.\n",
        "examples": "Screened for S gene target failure (S dropout)"
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
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date the sample was sequenced.",
        "guidance": "ISO 8601 standard \"YYYY-MM-DD\".",
        "examples": "2020-06-22"
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
          "NCBI_SRA": [
            {
              "field": "library_ID"
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
          "NCBI_SRA": [
            {
              "field": "amplicon_size"
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
        "examples": "Nextera XT"
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
        "examples": "FAB06069"
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
        "examples": "MinIon",
        "exportField": {
          "GISAID": [
            {
              "field": "Sequencing technology"
            }
          ],
          "NCBI_SRA": [
            {
              "field": "platform"
            },
            {
              "field": "instrument_model"
            }
          ],
          "NCBI_Genbank": [
            {
              "field": "sequencing_technology"
            }
          ]
        },
        "schema:ItemList": {
          "Illumina sequencing instrument": {
            "ontology_id": "GENEPIO:0100105",
            "exportField": {
              "NCBI_SRA": [
                {
                  "field": "platform",
                  "value": "ILLUMINA"
                }
              ]
            },
            "schema:ItemList": {
              "Illumina Genome Analyzer": {
                "ontology_id": "GENEPIO:0100106",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina Genome Analyzer"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Illumina Genome Analyzer II": {
                    "ontology_id": "GENEPIO:0100107",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        },
                        {
                          "field": "instrument_model",
                          "value": "Illumina Genome Analyzer II"
                        }
                      ]
                    }
                  },
                  "Illumina Genome Analyzer IIx": {
                    "ontology_id": "GENEPIO:0100108",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        },
                        {
                          "field": "instrument_model",
                          "value": "Illumina Genome Analyzer IIx"
                        }
                      ]
                    }
                  }
                }
              },
              "Illumina HiScanSQ": {
                "ontology_id": "GENEPIO:0100109",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina HiScanSQ"
                    }
                  ]
                }
              },
              "Illumina HiSeq": {
                "ontology_id": "GENEPIO:0100110",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                }
              },
              "Illumina HiSeq X": {
                "ontology_id": "GENEPIO:0100111",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Illumina HiSeq X Five": {
                    "ontology_id": "GENEPIO:0100112",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        },
                        {
                          "field": "instrument_model",
                          "value": "Illumina HiSeq X Five"
                        }
                      ]
                    }
                  },
                  "Illumina HiSeq X Ten": {
                    "ontology_id": "GENEPIO:0100113",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        },
                        {
                          "field": "instrument_model",
                          "value": "Illumina HiSeq X Ten"
                        }
                      ]
                    }
                  }
                }
              },
              "Illumina HiSeq 1000": {
                "ontology_id": "GENEPIO:0100114",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina HiSeq 1000"
                    }
                  ]
                }
              },
              "Illumina HiSeq 1500": {
                "ontology_id": "GENEPIO:0100115",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                }
              },
              "Illumina HiSeq 2000": {
                "ontology_id": "GENEPIO:0100116",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina HiSeq 2000"
                    }
                  ]
                }
              },
              "Illumina HiSeq 2500": {
                "ontology_id": "GENEPIO:0100117",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina HiSeq 2500"
                    }
                  ]
                }
              },
              "Illumina HiSeq 3000": {
                "ontology_id": "GENEPIO:0100118",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                }
              },
              "Illumina HiSeq 4000": {
                "ontology_id": "GENEPIO:0100119",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                }
              },
              "Illumina iSeq": {
                "ontology_id": "GENEPIO:0100120",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Illumina iSeq 100": {
                    "ontology_id": "GENEPIO:0100121",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        }
                      ]
                    }
                  }
                }
              },
              "Illumina NovaSeq": {
                "ontology_id": "GENEPIO:0100122",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Illumina NovaSeq 6000": {
                    "ontology_id": "GENEPIO:0100123",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        }
                      ]
                    }
                  }
                }
              },
              "Illumina MiniSeq": {
                "ontology_id": "GENEPIO:0100124",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                }
              },
              "Illumina MiSeq": {
                "ontology_id": "GENEPIO:0100125",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Illumina MiSeq"
                    }
                  ]
                }
              },
              "Illumina NextSeq": {
                "ontology_id": "GENEPIO:0100126",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ILLUMINA"
                    }
                  ]
                },
                "schema:ItemList": {
                  "Illumina NextSeq 500": {
                    "ontology_id": "GENEPIO:0100127",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        },
                        {
                          "field": "instrument_model",
                          "value": "Illumina NextSeq 500"
                        }
                      ]
                    }
                  },
                  "Illumina NextSeq 550": {
                    "ontology_id": "GENEPIO:0100128",
                    "exportField": {
                      "NCBI_SRA": [
                        {
                          "field": "platform",
                          "value": "ILLUMINA"
                        }
                      ]
                    }
                  },
                  "Illumina NextSeq 2000": {
                    "ontology_id": "GENEPIO:0100129"
                  }
                }
              }
            }
          },
          "Pacific Biosciences sequencing instrument": {
            "ontology_id": "GENEPIO:0100130",
            "exportField": {
              "NCBI_SRA": [
                {
                  "field": "platform",
                  "value": "PACBIO_SMRT"
                }
              ]
            },
            "schema:ItemList": {
              "PacBio RS": {
                "ontology_id": "GENEPIO:0100131",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "PACBIO_SMRT"
                    },
                    {
                      "field": "instrument_model",
                      "value": "PacBio RS"
                    }
                  ]
                }
              },
              "PacBio RS II": {
                "ontology_id": "GENEPIO:0100132",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "PACBIO_SMRT"
                    },
                    {
                      "field": "instrument_model",
                      "value": "PacBio RS II"
                    }
                  ]
                }
              },
              "PacBio Sequel": {
                "ontology_id": "GENEPIO:0100133",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "PACBIO_SMRT"
                    }
                  ]
                }
              },
              "PacBio Sequel II": {
                "ontology_id": "GENEPIO:0100134",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "PACBIO_SMRT"
                    }
                  ]
                }
              }
            }
          },
          "Ion Torrent sequencing instrument": {
            "ontology_id": "GENEPIO:0100135",
            "exportField": {
              "NCBI_SRA": [
                {
                  "field": "platform",
                  "value": "ION_TORRENT"
                }
              ]
            },
            "schema:ItemList": {
              "Ion Torrent PGM": {
                "ontology_id": "GENEPIO:0100136",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ION_TORRENT"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Ion Torrent PGM"
                    }
                  ]
                }
              },
              "Ion Torrent Proton": {
                "ontology_id": "GENEPIO:0100137",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ION_TORRENT"
                    },
                    {
                      "field": "instrument_model",
                      "value": "Ion Torrent Proton"
                    }
                  ]
                }
              },
              "Ion Torrent S5 XL": {
                "ontology_id": "GENEPIO:0100138",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ION_TORRENT"
                    }
                  ]
                }
              },
              "Ion Torrent S5": {
                "ontology_id": "GENEPIO:0100139",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "ION_TORRENT"
                    }
                  ]
                }
              }
            }
          },
          "Oxford Nanopore sequencing instrument": {
            "ontology_id": "GENEPIO:0100140",
            "exportField": {
              "NCBI_SRA": [
                {
                  "field": "platform",
                  "value": "OXFORD_NANOPORE"
                }
              ]
            },
            "schema:ItemList": {
              "Oxford Nanopore GridION": {
                "ontology_id": "GENEPIO:0100141",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "OXFORD_NANOPORE"
                    },
                    {
                      "field": "instrument_model",
                      "value": "GridION"
                    }
                  ]
                }
              },
              "Oxford Nanopore MinION": {
                "ontology_id": "GENEPIO:0100142",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "OXFORD_NANOPORE"
                    },
                    {
                      "field": "instrument_model",
                      "value": "MinION"
                    }
                  ]
                }
              },
              "Oxford Nanopore PromethION": {
                "ontology_id": "GENEPIO:0100143",
                "exportField": {
                  "NCBI_SRA": [
                    {
                      "field": "platform",
                      "value": "OXFORD_NANOPORE"
                    }
                  ]
                }
              }
            }
          },
          "BGI Genomics sequencing instrument": {
            "ontology_id": "GENEPIO:0100144",
            "schema:ItemList": {
              "BGI Genomics BGISEQ-500": {
                "ontology_id": "GENEPIO:0100145"
              }
            }
          },
          "MGI sequencing instrument": {
            "ontology_id": "GENEPIO:0100146",
            "schema:ItemList": {
              "DNBSEQ-T7": {
                "ontology_id": "GENEPIO:0100147"
              },
              "DNBSEQ-G400": {
                "ontology_id": "GENEPIO:0100148"
              },
              "DNBSEQ-G400 FAST": {
                "ontology_id": "GENEPIO:0100149"
              },
              "DNBSEQ-G50": {
                "ontology_id": "GENEPIO:0100150"
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
          "NCBI_SRA": [
            {
              "field": "sequencing_protocol_name"
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
          "NCBI_SRA": [
            {
              "field": "design_description"
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
        "examples": "AB456XYZ789"
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
          "NCBI_SRA": [
            {
              "field": "amplicon_pcr_primer_scheme"
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
        "requirement": "recommended",
        "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
        "guidance": "Provide the software name followed by the version e.g. Trimmomatic v. 0.38, Porechop v. 0.2.3",
        "examples": "Porechop 0.2.3",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "raw_sequence_data_processing_method"
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
        "requirement": "recommended",
        "description": "The method used to remove host reads from the pathogen sequence.",
        "guidance": "Provide the name and version number of the software used to remove host reads.",
        "examples": "Nanostripper",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "dehosting_method"
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
        "examples": "ncov123assembly3"
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
          "NCBI_Genbank": [
            {
              "field": "filename"
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
        "examples": "/User/Documents/RespLab/Data/ncov123assembly.fasta"
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
        "examples": "Ivar",
        "exportField": {
          "GISAID": [
            {
              "field": "Assembly method"
            }
          ],
          "NCBI_Genbank": [
            {
              "field": "assembly_method"
            }
          ]
        }
      },
      {
        "fieldName": "consensus sequence software version",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001469",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "The version of the software used to generate the consensus sequence.",
        "guidance": "Provide the version of the software used to generate the consensus sequence.",
        "examples": "1.3",
        "exportField": {
          "GISAID": [
            {
              "field": "Assembly method"
            }
          ],
          "NCBI_Genbank": [
            {
              "field": "assembly_method_version"
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
        "examples": "95%"
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
          "NCBI_Genbank": [
            {
              "field": "genome_coverage"
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
        "examples": "100x"
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
        "requirement": "",
        "description": "The user-specified filename of the r1 FASTQ file.",
        "guidance": "Provide the r1 FASTQ filename.",
        "examples": "ABC123_S1_L001_R1_001.fastq.gz"
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
        "requirement": "",
        "description": "The user-specified filename of the r2 FASTQ file.",
        "guidance": "Provide the r2 FASTQ filename.",
        "examples": "ABC123_S1_L001_R2_001.fastq.gz"
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
        "examples": "/User/Documents/RespLab/Data/ABC123_S1_L001_R1_001.fastq.gz"
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
        "examples": "/User/Documents/RespLab/Data/ABC123_S1_L001_R2_001.fastq.gz"
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
        "examples": "rona123assembly.fast5"
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
        "examples": "/User/Documents/RespLab/Data/rona123assembly.fast5"
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
        "examples": "387566"
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
        "examples": "38677"
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
        "examples": "330"
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
          "NCBI_Genbank": [
            {
              "field": "reference_genome"
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
        "requirement": "",
        "description": "The name and version number of the bioinformatics protocol used.",
        "guidance": "Further details regarding the methods used to process raw data, and/or generate assemblies, and/or generate consensus sequences can be provided in an SOP or protocol. Provide the name and version number of the protocol.",
        "examples": "https://www.protocols.io/groups/cphln-sarscov2-sequencing-consortium/members"
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
        "examples": "B.1.1.7"
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
        "examples": "Pangolin"
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
        "examples": "2.1.10"
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
        "schema:ItemList": {
          "Variant of Concern (VOC)": {
            "ontology_id": "GENEPIO:0100082"
          },
          "Variant  of Interest (VOI)": {
            "ontology_id": "GENEPIO:0100083"
          },
          "Variant Under Monitoring (VUM)": {
            "ontology_id": "GENEPIO:0100279"
          }
        }
      },
      {
        "fieldName": "variant evidence details",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001504",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Details about the evidence used to make the variant determination.",
        "guidance": "Provide the assay and list the set of lineage-defining mutations used to make the variant determination. If there are mutations of interest/concern observed in addition to lineage-defining mutations, describe those here.",
        "examples": "RT-qPCR TaqPath assay: S gene target failure"
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
        "examples": "E (orf4)",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "sars_cov_2_diag_gene_name_1"
            }
          ]
        },
        "schema:ItemList": {
          "E gene (orf4)": {
            "ontology_id": "GENEPIO:0100151"
          },
          "M gene (orf5)": {
            "ontology_id": "GENEPIO:0100152"
          },
          "N gene (orf9)": {
            "ontology_id": "GENEPIO:0100153"
          },
          "Spike gene (orf2)": {
            "ontology_id": "GENEPIO:0100154"
          },
          "orf1ab (rep)": {
            "ontology_id": "GENEPIO:0100155",
            "schema:ItemList": {
              "orf1a (pp1a)": {
                "ontology_id": "GENEPIO:0100156",
                "schema:ItemList": {
                  "nsp11": {
                    "ontology_id": "GENEPIO:0100157"
                  }
                }
              },
              "nsp1": {
                "ontology_id": "GENEPIO:0100158"
              },
              "nsp2": {
                "ontology_id": "GENEPIO:0100159"
              },
              "nsp3": {
                "ontology_id": "GENEPIO:0100160"
              },
              "nsp4": {
                "ontology_id": "GENEPIO:0100161"
              },
              "nsp5": {
                "ontology_id": "GENEPIO:0100162"
              },
              "nsp6": {
                "ontology_id": "GENEPIO:0100163"
              },
              "nsp7": {
                "ontology_id": "GENEPIO:0100164"
              },
              "nsp8": {
                "ontology_id": "GENEPIO:0100165"
              },
              "nsp9": {
                "ontology_id": "GENEPIO:0100166"
              },
              "nsp10": {
                "ontology_id": "GENEPIO:0100167"
              },
              "RdRp gene (nsp12)": {
                "ontology_id": "GENEPIO:0100168"
              },
              "hel gene (nsp13)": {
                "ontology_id": "GENEPIO:0100169"
              },
              "exoN gene (nsp14)": {
                "ontology_id": "GENEPIO:0100170"
              },
              "nsp15": {
                "ontology_id": "GENEPIO:0100171"
              },
              "nsp16": {
                "ontology_id": "GENEPIO:0100172"
              }
            }
          },
          "orf3a": {
            "ontology_id": "GENEPIO:0100173"
          },
          "orf3b": {
            "ontology_id": "GENEPIO:0100174"
          },
          "orf6 (ns6)": {
            "ontology_id": "GENEPIO:0100175"
          },
          "orf7a": {
            "ontology_id": "GENEPIO:0100176"
          },
          "orf7b (ns7b)": {
            "ontology_id": "GENEPIO:0100177"
          },
          "orf8 (ns8)": {
            "ontology_id": "GENEPIO:0100178"
          },
          "orf9b": {
            "ontology_id": "GENEPIO:0100179"
          },
          "orf9c": {
            "ontology_id": "GENEPIO:0100180"
          },
          "orf10": {
            "ontology_id": "GENEPIO:0100181"
          },
          "orf14": {
            "ontology_id": "GENEPIO:0100182"
          },
          "SARS-COV-2 5' UTR": {
            "ontology_id": "GENEPIO:0100183"
          }
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "sars_cov_2_diag_pcr_ct_value_1"
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
        "examples": "nsp12 (RdRp)",
        "exportField": {
          "NCBI_BIOSAMPLE": [
            {
              "field": "sars_cov_2_diag_gene_name_2"
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
          "NCBI_BIOSAMPLE": [
            {
              "field": "sars_cov_2_diag_pcr_ct_value_2"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "NCBI SRA information",
    "children": [
      {
        "fieldName": "title",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100323",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Short description that will identify  the dataset on public pages.",
        "guidance": "Format: {methodology} of {organism}: {sample info}",
        "examples": "Genomic sequencing of SARS-CoV-2: Nasopharynx (NP), Swab",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "title"
            }
          ]
        }
      },
      {
        "fieldName": "library_strategy",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100324",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the library strategy by selecting a value from the pick list. For amplicon sequencing select \"AMPLICON\". ",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "library_strategy"
            }
          ]
        },
        "schema:ItemList": {
          "WGA": {},
          "WGS": {},
          "WXS": {},
          "RNA-Seq": {},
          "miRNA-Seq": {},
          "WCS": {},
          "CLONE": {},
          "POOLCLONE": {},
          "AMPLICON": {},
          "CLONEEND": {},
          "FINISHING": {},
          "ChIP-Seq": {},
          "MNase-Seq": {},
          "DNase-Hypersensitivity": {},
          "Bisulfite-Seq": {},
          "Tn-Seq": {},
          "EST": {},
          "FL-cDNA": {},
          "CTS": {},
          "MRE-Seq": {},
          "MeDIP-Seq": {},
          "MBD-Seq": {},
          "OTHER": {}
        }
      },
      {
        "fieldName": "library_source",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100325",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the library source by selecting a value from the pick list. For amplicon sequencing select \"Viral RNA\". ",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "library_source"
            }
          ]
        },
        "schema:ItemList": {
          "GENOMIC": {},
          "TRANSCRIPTOMIC": {},
          "METAGENOMIC": {},
          "METATRANSCRIPTOMIC": {},
          "SYNTHETIC": {},
          "VIRAL RNA": {},
          "OTHER": {}
        }
      },
      {
        "fieldName": "library_selection",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100326",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the library selection by selecting a value from the pick list. For amplicon sequencing select \"PCR\". ",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "library_selection"
            }
          ]
        },
        "schema:ItemList": {
          "RANDOM": {},
          "PCR": {},
          "RANDOM PCR": {},
          "RT-PCR": {},
          "HMPR": {},
          "MF": {},
          "CF-S": {},
          "CF-M": {},
          "CF-H": {},
          "CF-T": {},
          "MDA": {},
          "MSLL": {},
          "cDNA": {},
          "ChIP": {},
          "MNase": {},
          "DNAse": {},
          "Hybrid Selection": {},
          "Reduced Representation": {},
          "Restriction Digest": {},
          "5-methylcytidine antibody": {},
          "MBD2 protein methyl-CpG binding domain": {},
          "CAGE": {},
          "RACE": {},
          "size fractionation": {},
          "Padlock probes capture method": {},
          "other": {},
          "unspecified": {}
        }
      },
      {
        "fieldName": "library_layout",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100327",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the library layout by selecting a value from the pick list. For Illumina instruments, select \"PAIRED\". For Oxford Nanopore instruments, select \"SINGLE\".",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "library_layout"
            }
          ]
        },
        "schema:ItemList": {
          "single": {},
          "paired": {}
        }
      },
      {
        "fieldName": "filetype",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100328",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the filetype by selecting a value from the pick list. ",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "filetype"
            }
          ]
        },
        "schema:ItemList": {
          "bam": {},
          "sra": {},
          "kar": {},
          "srf": {},
          "sff": {},
          "fastq": {},
          "tab": {},
          "454_native": {},
          "Helicos_native": {},
          "SOLiD_native": {},
          "PacBio_HDF5": {},
          "CompleteGenomics_native": {}
        }
      },
      {
        "fieldName": "filename",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100329",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the appropriate filename recorded in the Bioinformatics and QC metrics section. If sequence data is \"paired\", provide the second filename under \"Filename 2\".",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "filename"
            }
          ]
        }
      },
      {
        "fieldName": "filename2",
        "capitalize": "",
        "ontology_id": "GENEPIO:0100330",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "See NCBI SRA template for details.",
        "guidance": "Provide the appropriate filename recorded in the Bioinformatics and QC metrics section.",
        "examples": "",
        "exportField": {
          "NCBI_SRA": [
            {
              "field": "filename2"
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
        "examples": "DataHarmonizer provenance: v0.13.21"
      }
    ]
  },
  {
    "fieldName": "data status",
    "children": [
      {
        "fieldName": "Not Applicable",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001619",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "Missing",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001618",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "Not Collected",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001620",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "Not Provided",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001668",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      },
      {
        "fieldName": "Restricted Access",
        "capitalize": "",
        "ontology_id": "GENEPIO:0001810",
        "datatype": "",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": ""
      }
    ]
  }
]