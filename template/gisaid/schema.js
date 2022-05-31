var SCHEMA = {
  "name": "GISAID",
  "description": "",
  "id": "https://example.com/GISAID",
  "prefixes": {
    "linkml": {
      "prefix_prefix": "linkml",
      "prefix_reference": "https://w3id.org/linkml/"
    },
    "xsd": {
      "prefix_prefix": "xsd",
      "prefix_reference": "http://www.w3.org/2001/XMLSchema#"
    },
    "shex": {
      "prefix_prefix": "shex",
      "prefix_reference": "http://www.w3.org/ns/shex#"
    }
  },
  "default_prefix": "https://example.com/GISAID/",
  "types": {
    "xsd:token": {
      "name": "xsd:token",
      "description": "A string that has no whitespace; i.e., after any occurrence of #x9 (tab), #xA (linefeed), or #xD (carriage return).",
      "base": "str",
      "uri": "xsd:token"
    },
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
  },
  "enums": {
    "Type menu": {
      "name": "Type menu",
      "from_schema": "https://example.com/GISAID",
      "permissible_values": {
        "betacoronavirus": {
          "text": "betacoronavirus"
        }
      }
    }
  },
  "slots": {
    "Submitter": {
      "name": "Submitter",
      "description": "enter your GISAID-Username",
      "title": "Submitter",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "FASTA filename": {
      "name": "FASTA filename",
      "description": "the filename that contains the sequence without path (e.g. all_sequences.fasta not c:\\users\\meier\\docs\\all_sequences.fasta)",
      "title": "FASTA filename",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Virus name": {
      "name": "Virus name",
      "description": "e.g. hCoV-19/Netherlands/Gelderland-01/2020 (Must be FASTA-Header from the FASTA file all_sequences.fasta)",
      "title": "Virus name",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Type": {
      "name": "Type",
      "description": "default must remain \"betacoronavirus\"",
      "title": "Type",
      "from_schema": "https://example.com/GISAID",
      "range": "Type menu",
      "required": true
    },
    "Passage details/history": {
      "name": "Passage details/history",
      "description": "e.g. Original, Vero",
      "title": "Passage details/history",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Collection date": {
      "name": "Collection date",
      "description": "Date in the format YYYY or YYYY-MM or YYYY-MM-DD",
      "title": "Collection date",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Location": {
      "name": "Location",
      "description": "e.g. Europe / Germany / Bavaria / Munich",
      "title": "Location",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Additional location information": {
      "name": "Additional location information",
      "description": "e.g. Cruise Ship, Convention, Live animal market",
      "title": "Additional location information",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Host": {
      "name": "Host",
      "description": "e.g. Human, Environment, Canine, Manis javanica, Rhinolophus affinis, etc",
      "title": "Host",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Additional host information": {
      "name": "Additional host information",
      "description": "e.g. Patient infected while traveling in ….",
      "title": "Additional host information",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Sampling Strategy": {
      "name": "Sampling Strategy",
      "description": "e.g. Sentinel surveillance (ILI), Sentinel surveillance (ARI), Sentinel surveillance (SARI), Non-sentinel-surveillance (hospital), Non-sentinel-surveillance (GP network), Longitudinal sampling on same patient(s), S gene dropout",
      "title": "Sampling Strategy",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Gender": {
      "name": "Gender",
      "description": "Male, Female, or unknown",
      "title": "Gender",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Patient age": {
      "name": "Patient age",
      "description": "e.g.  65 or 7 months, or unknown",
      "title": "Patient age",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Patient status": {
      "name": "Patient status",
      "description": "e.g.  Hospitalized, Released, Live, Deceased, or unknown",
      "title": "Patient status",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Specimen source": {
      "name": "Specimen source",
      "description": "e.g. Sputum, Alveolar lavage fluid, Oro-pharyngeal swab, Blood, Tracheal swab, Urine, Stool, Cloakal swab, Organ, Feces, Other",
      "title": "Specimen source",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Outbreak": {
      "name": "Outbreak",
      "description": "Date, Location e.g. type of gathering, Family cluster, etc.",
      "title": "Outbreak",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Last vaccinated": {
      "name": "Last vaccinated",
      "description": "provide details if applicable",
      "title": "Last vaccinated",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Treatment": {
      "name": "Treatment",
      "description": "Include drug name, dosage",
      "title": "Treatment",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Sequencing technology": {
      "name": "Sequencing technology",
      "description": "e.g.  Illumina Miseq, Sanger, Nanopore MinION, Ion Torrent, etc.",
      "title": "Sequencing technology",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Assembly method": {
      "name": "Assembly method",
      "description": "e.g. CLC Genomics Workbench 12, Geneious 10.2.4, SPAdes/MEGAHIT v1.2.9, UGENE v. 33, etc.",
      "title": "Assembly method",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Coverage": {
      "name": "Coverage",
      "description": "e.g. 70x, 1,000x, 10,000x (average)",
      "title": "Coverage",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Originating lab": {
      "name": "Originating lab",
      "description": "Where the clinical specimen or virus isolate was first obtained",
      "title": "Originating lab",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Address": {
      "name": "Address",
      "title": "Address",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Sample ID given by the sample provider": {
      "name": "Sample ID given by the sample provider",
      "title": "Sample ID given by the sample provider",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Submitting lab": {
      "name": "Submitting lab",
      "description": "Where sequence data have been generated and submitted to GISAID",
      "title": "Submitting lab",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token",
      "required": true
    },
    "Sample ID given by the submitting laboratory": {
      "name": "Sample ID given by the submitting laboratory",
      "title": "Sample ID given by the submitting laboratory",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    },
    "Authors": {
      "name": "Authors",
      "description": "a comma separated list of Authors with complete First followed by Last Name",
      "title": "Authors",
      "from_schema": "https://example.com/GISAID",
      "range": "xsd:token"
    }
  },
  "classes": {
    "dh_interface": {
      "name": "dh_interface",
      "description": "A DataHarmonizer interface",
      "from_schema": "https://example.com/GISAID"
    },
    "GISAID": {
      "name": "GISAID",
      "description": "Specification for GISAID virus biosample data gathering",
      "from_schema": "https://example.com/GISAID",
      "is_a": "dh_interface",
      "slot_usage": {
        "Submitter": {
          "name": "Submitter",
          "rank": 1,
          "slot_group": "GISAID Submission Form"
        },
        "FASTA filename": {
          "name": "FASTA filename",
          "rank": 2,
          "slot_group": "GISAID Submission Form"
        },
        "Virus name": {
          "name": "Virus name",
          "rank": 3,
          "slot_group": "GISAID Submission Form"
        },
        "Type": {
          "name": "Type",
          "rank": 4,
          "slot_group": "GISAID Submission Form"
        },
        "Passage details/history": {
          "name": "Passage details/history",
          "rank": 5,
          "slot_group": "GISAID Submission Form"
        },
        "Collection date": {
          "name": "Collection date",
          "rank": 6,
          "slot_group": "GISAID Submission Form"
        },
        "Location": {
          "name": "Location",
          "rank": 7,
          "slot_group": "GISAID Submission Form"
        },
        "Additional location information": {
          "name": "Additional location information",
          "rank": 8,
          "slot_group": "GISAID Submission Form"
        },
        "Host": {
          "name": "Host",
          "rank": 9,
          "slot_group": "GISAID Submission Form"
        },
        "Additional host information": {
          "name": "Additional host information",
          "rank": 10,
          "slot_group": "GISAID Submission Form"
        },
        "Sampling Strategy": {
          "name": "Sampling Strategy",
          "rank": 11,
          "slot_group": "GISAID Submission Form"
        },
        "Gender": {
          "name": "Gender",
          "rank": 12,
          "slot_group": "GISAID Submission Form"
        },
        "Patient age": {
          "name": "Patient age",
          "rank": 13,
          "slot_group": "GISAID Submission Form"
        },
        "Patient status": {
          "name": "Patient status",
          "rank": 14,
          "slot_group": "GISAID Submission Form"
        },
        "Specimen source": {
          "name": "Specimen source",
          "rank": 15,
          "slot_group": "GISAID Submission Form"
        },
        "Outbreak": {
          "name": "Outbreak",
          "rank": 16,
          "slot_group": "GISAID Submission Form"
        },
        "Last vaccinated": {
          "name": "Last vaccinated",
          "rank": 17,
          "slot_group": "GISAID Submission Form"
        },
        "Treatment": {
          "name": "Treatment",
          "rank": 18,
          "slot_group": "GISAID Submission Form"
        },
        "Sequencing technology": {
          "name": "Sequencing technology",
          "rank": 19,
          "slot_group": "GISAID Submission Form"
        },
        "Assembly method": {
          "name": "Assembly method",
          "rank": 20,
          "slot_group": "GISAID Submission Form"
        },
        "Coverage": {
          "name": "Coverage",
          "rank": 21,
          "slot_group": "GISAID Submission Form"
        },
        "Originating lab": {
          "name": "Originating lab",
          "rank": 22,
          "slot_group": "GISAID Submission Form"
        },
        "Address": {
          "name": "Address",
          "rank": 26,
          "slot_group": "GISAID Submission Form"
        },
        "Sample ID given by the sample provider": {
          "name": "Sample ID given by the sample provider",
          "rank": 24,
          "slot_group": "GISAID Submission Form"
        },
        "Submitting lab": {
          "name": "Submitting lab",
          "rank": 25,
          "slot_group": "GISAID Submission Form"
        },
        "Sample ID given by the submitting laboratory": {
          "name": "Sample ID given by the submitting laboratory",
          "rank": 27,
          "slot_group": "GISAID Submission Form"
        },
        "Authors": {
          "name": "Authors",
          "rank": 28,
          "slot_group": "GISAID Submission Form"
        }
      },
      "attributes": {
        "Submitter": {
          "name": "Submitter",
          "description": "enter your GISAID-Username",
          "title": "Submitter",
          "from_schema": "https://example.com/GISAID",
          "rank": 1,
          "alias": "Submitter",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "FASTA filename": {
          "name": "FASTA filename",
          "description": "the filename that contains the sequence without path (e.g. all_sequences.fasta not c:\\users\\meier\\docs\\all_sequences.fasta)",
          "title": "FASTA filename",
          "from_schema": "https://example.com/GISAID",
          "rank": 2,
          "alias": "FASTA_filename",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Virus name": {
          "name": "Virus name",
          "description": "e.g. hCoV-19/Netherlands/Gelderland-01/2020 (Must be FASTA-Header from the FASTA file all_sequences.fasta)",
          "title": "Virus name",
          "from_schema": "https://example.com/GISAID",
          "rank": 3,
          "alias": "Virus_name",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Type": {
          "name": "Type",
          "description": "default must remain \"betacoronavirus\"",
          "title": "Type",
          "from_schema": "https://example.com/GISAID",
          "rank": 4,
          "alias": "Type",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "Type menu",
          "required": true
        },
        "Passage details/history": {
          "name": "Passage details/history",
          "description": "e.g. Original, Vero",
          "title": "Passage details/history",
          "from_schema": "https://example.com/GISAID",
          "rank": 5,
          "alias": "Passage_details/history",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Collection date": {
          "name": "Collection date",
          "description": "Date in the format YYYY or YYYY-MM or YYYY-MM-DD",
          "title": "Collection date",
          "from_schema": "https://example.com/GISAID",
          "rank": 6,
          "alias": "Collection_date",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Location": {
          "name": "Location",
          "description": "e.g. Europe / Germany / Bavaria / Munich",
          "title": "Location",
          "from_schema": "https://example.com/GISAID",
          "rank": 7,
          "alias": "Location",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Additional location information": {
          "name": "Additional location information",
          "description": "e.g. Cruise Ship, Convention, Live animal market",
          "title": "Additional location information",
          "from_schema": "https://example.com/GISAID",
          "rank": 8,
          "alias": "Additional_location_information",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Host": {
          "name": "Host",
          "description": "e.g. Human, Environment, Canine, Manis javanica, Rhinolophus affinis, etc",
          "title": "Host",
          "from_schema": "https://example.com/GISAID",
          "rank": 9,
          "alias": "Host",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Additional host information": {
          "name": "Additional host information",
          "description": "e.g. Patient infected while traveling in ….",
          "title": "Additional host information",
          "from_schema": "https://example.com/GISAID",
          "rank": 10,
          "alias": "Additional_host_information",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Sampling Strategy": {
          "name": "Sampling Strategy",
          "description": "e.g. Sentinel surveillance (ILI), Sentinel surveillance (ARI), Sentinel surveillance (SARI), Non-sentinel-surveillance (hospital), Non-sentinel-surveillance (GP network), Longitudinal sampling on same patient(s), S gene dropout",
          "title": "Sampling Strategy",
          "from_schema": "https://example.com/GISAID",
          "rank": 11,
          "alias": "Sampling_Strategy",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Gender": {
          "name": "Gender",
          "description": "Male, Female, or unknown",
          "title": "Gender",
          "from_schema": "https://example.com/GISAID",
          "rank": 12,
          "alias": "Gender",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Patient age": {
          "name": "Patient age",
          "description": "e.g.  65 or 7 months, or unknown",
          "title": "Patient age",
          "from_schema": "https://example.com/GISAID",
          "rank": 13,
          "alias": "Patient_age",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Patient status": {
          "name": "Patient status",
          "description": "e.g.  Hospitalized, Released, Live, Deceased, or unknown",
          "title": "Patient status",
          "from_schema": "https://example.com/GISAID",
          "rank": 14,
          "alias": "Patient_status",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Specimen source": {
          "name": "Specimen source",
          "description": "e.g. Sputum, Alveolar lavage fluid, Oro-pharyngeal swab, Blood, Tracheal swab, Urine, Stool, Cloakal swab, Organ, Feces, Other",
          "title": "Specimen source",
          "from_schema": "https://example.com/GISAID",
          "rank": 15,
          "alias": "Specimen_source",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Outbreak": {
          "name": "Outbreak",
          "description": "Date, Location e.g. type of gathering, Family cluster, etc.",
          "title": "Outbreak",
          "from_schema": "https://example.com/GISAID",
          "rank": 16,
          "alias": "Outbreak",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Last vaccinated": {
          "name": "Last vaccinated",
          "description": "provide details if applicable",
          "title": "Last vaccinated",
          "from_schema": "https://example.com/GISAID",
          "rank": 17,
          "alias": "Last_vaccinated",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Treatment": {
          "name": "Treatment",
          "description": "Include drug name, dosage",
          "title": "Treatment",
          "from_schema": "https://example.com/GISAID",
          "rank": 18,
          "alias": "Treatment",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Sequencing technology": {
          "name": "Sequencing technology",
          "description": "e.g.  Illumina Miseq, Sanger, Nanopore MinION, Ion Torrent, etc.",
          "title": "Sequencing technology",
          "from_schema": "https://example.com/GISAID",
          "rank": 19,
          "alias": "Sequencing_technology",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Assembly method": {
          "name": "Assembly method",
          "description": "e.g. CLC Genomics Workbench 12, Geneious 10.2.4, SPAdes/MEGAHIT v1.2.9, UGENE v. 33, etc.",
          "title": "Assembly method",
          "from_schema": "https://example.com/GISAID",
          "rank": 20,
          "alias": "Assembly_method",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Coverage": {
          "name": "Coverage",
          "description": "e.g. 70x, 1,000x, 10,000x (average)",
          "title": "Coverage",
          "from_schema": "https://example.com/GISAID",
          "rank": 21,
          "alias": "Coverage",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Originating lab": {
          "name": "Originating lab",
          "description": "Where the clinical specimen or virus isolate was first obtained",
          "title": "Originating lab",
          "from_schema": "https://example.com/GISAID",
          "rank": 22,
          "alias": "Originating_lab",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Address": {
          "name": "Address",
          "title": "Address",
          "from_schema": "https://example.com/GISAID",
          "rank": 26,
          "alias": "Address",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Sample ID given by the sample provider": {
          "name": "Sample ID given by the sample provider",
          "title": "Sample ID given by the sample provider",
          "from_schema": "https://example.com/GISAID",
          "rank": 24,
          "alias": "Sample_ID_given_by_the_sample_provider",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Submitting lab": {
          "name": "Submitting lab",
          "description": "Where sequence data have been generated and submitted to GISAID",
          "title": "Submitting lab",
          "from_schema": "https://example.com/GISAID",
          "rank": 25,
          "alias": "Submitting_lab",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token",
          "required": true
        },
        "Sample ID given by the submitting laboratory": {
          "name": "Sample ID given by the submitting laboratory",
          "title": "Sample ID given by the submitting laboratory",
          "from_schema": "https://example.com/GISAID",
          "rank": 27,
          "alias": "Sample_ID_given_by_the_submitting_laboratory",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        },
        "Authors": {
          "name": "Authors",
          "description": "a comma separated list of Authors with complete First followed by Last Name",
          "title": "Authors",
          "from_schema": "https://example.com/GISAID",
          "rank": 28,
          "alias": "Authors",
          "owner": "GISAID",
          "slot_group": "GISAID Submission Form",
          "range": "xsd:token"
        }
      }
    }
  },
  "source_file": "../../template/gisaid/schema.yaml",
  "settings": {
    "Title_Case": {
      "setting_key": "Title_Case",
      "setting_value": "^(((?<=\\b)[^a-z\\W]\\w*?|[\\W])+)$"
    },
    "UPPER_CASE": {
      "setting_key": "UPPER_CASE",
      "setting_value": "^[A-Z\\W\\d_]*$"
    },
    "lower_case": {
      "setting_key": "lower_case",
      "setting_value": "^[a-z\\W\\d_]*$"
    }
  },
  "@type": "SchemaDefinition"
}