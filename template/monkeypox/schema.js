var SCHEMA = {
  "name": "Monkeypox",
  "description": "",
  "id": "https://example.com/monkeypox",
  "prefixes": {
    "linkml": {
      "prefix_prefix": "linkml",
      "prefix_reference": "https://w3id.org/linkml/"
    },
    "GENEPIO": {
      "prefix_prefix": "GENEPIO",
      "prefix_reference": "http://purl.obolibrary.org/obo/GENEPIO_"
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
  "default_prefix": "https://example.com/monkeypox/",
  "types": {
    "WhitespaceMinimizedString": {
      "name": "WhitespaceMinimizedString",
      "description": "A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).",
      "typeof": "string",
      "base": "str",
      "uri": "xsd:token"
    },
    "Provenance": {
      "name": "Provenance",
      "description": "A field containing a DataHarmonizer versioning marker. It is issued by DataHarmonizer when validation is applied to a given row of data.",
      "typeof": "string",
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
    "null value menu": {
      "name": "null value menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Not Applicable": {
          "text": "Not Applicable",
          "meaning": "GENEPIO:0001619"
        },
        "Missing": {
          "text": "Missing",
          "meaning": "GENEPIO:0001618"
        },
        "Not Collected": {
          "text": "Not Collected",
          "meaning": "GENEPIO:0001620"
        },
        "Not Provided": {
          "text": "Not Provided",
          "meaning": "GENEPIO:0001668"
        },
        "Restricted Access": {
          "text": "Restricted Access",
          "meaning": "GENEPIO:0001810"
        }
      }
    },
    "geo_loc_name (state/province/territory) menu": {
      "name": "geo_loc_name (state/province/territory) menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Alberta": {
          "text": "Alberta",
          "meaning": "GAZ:00002566"
        },
        "British Columbia": {
          "text": "British Columbia",
          "meaning": "GAZ:00002562"
        },
        "Manitoba": {
          "text": "Manitoba",
          "meaning": "GAZ:00002571"
        },
        "New Brunswick": {
          "text": "New Brunswick",
          "meaning": "GAZ:00002570"
        },
        "Newfoundland and Labrador": {
          "text": "Newfoundland and Labrador",
          "meaning": "GAZ:00002567"
        },
        "Northwest Territories": {
          "text": "Northwest Territories",
          "meaning": "GAZ:00002575"
        },
        "Nova Scotia": {
          "text": "Nova Scotia",
          "meaning": "GAZ:00002565"
        },
        "Nunavut": {
          "text": "Nunavut",
          "meaning": "GAZ:00002574"
        },
        "Ontario": {
          "text": "Ontario",
          "meaning": "GAZ:00002563"
        },
        "Prince Edward Island": {
          "text": "Prince Edward Island",
          "meaning": "GAZ:00002572"
        },
        "Quebec": {
          "text": "Quebec",
          "meaning": "GAZ:00002569"
        },
        "Saskatchewan": {
          "text": "Saskatchewan",
          "meaning": "GAZ:00002564"
        },
        "Yukon": {
          "text": "Yukon",
          "meaning": "GAZ:00002576"
        }
      }
    },
    "sample collection date precision menu": {
      "name": "sample collection date precision menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "year": {
          "text": "year",
          "meaning": "UO:0000036"
        },
        "month": {
          "text": "month",
          "meaning": "UO:0000035"
        },
        "day": {
          "text": "day",
          "meaning": "UO:0000033"
        }
      }
    },
    "NML submitted specimen type menu": {
      "name": "NML submitted specimen type menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Bodily fluid": {
          "text": "Bodily fluid",
          "meaning": "UBERON:0006314"
        },
        "DNA": {
          "text": "DNA",
          "meaning": "OBI:0001051"
        },
        "Nucleic acid": {
          "text": "Nucleic acid",
          "meaning": "OBI:0001010"
        },
        "RNA": {
          "text": "RNA",
          "meaning": "OBI:0000880"
        },
        "Swab": {
          "text": "Swab",
          "meaning": "OBI:0002600"
        },
        "Tissue": {
          "text": "Tissue",
          "meaning": "UBERON:0000479"
        },
        "Not Applicable": {
          "text": "Not Applicable",
          "meaning": "GENEPIO:0001619"
        }
      }
    },
    "Related specimen relationship type menu": {
      "name": "Related specimen relationship type menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Acute": {
          "text": "Acute",
          "meaning": "HP:0011009"
        },
        "Convalescent": {
          "text": "Convalescent"
        },
        "Familial": {
          "text": "Familial"
        },
        "Follow-up": {
          "text": "Follow-up",
          "meaning": "EFO:0009642"
        },
        "Reinfection testing": {
          "text": "Reinfection testing",
          "is_a": "Follow-up"
        },
        "Previously Submitted": {
          "text": "Previously Submitted"
        },
        "Sequencing/bioinformatics methods development/validation": {
          "text": "Sequencing/bioinformatics methods development/validation"
        },
        "Specimen sampling methods testing": {
          "text": "Specimen sampling methods testing"
        }
      }
    },
    "anatomical material menu": {
      "name": "anatomical material menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Blood": {
          "text": "Blood",
          "meaning": "UBERON:0000178"
        },
        "Blood clot": {
          "text": "Blood clot",
          "meaning": "UBERON:0010210",
          "is_a": "Blood"
        },
        "Blood serum": {
          "text": "Blood serum",
          "meaning": "UBERON:0001977",
          "is_a": "Blood"
        },
        "Blood plasma": {
          "text": "Blood plasma",
          "meaning": "UBERON:0001969",
          "is_a": "Blood"
        },
        "Whole blood": {
          "text": "Whole blood",
          "meaning": "NCIT:C41067",
          "is_a": "Blood"
        },
        "Fluid": {
          "text": "Fluid",
          "meaning": "UBERON:0006314"
        },
        "Saliva": {
          "text": "Saliva",
          "meaning": "UBERON:0001836",
          "is_a": "Fluid"
        },
        "Fluid (cerebrospinal (CSF))": {
          "text": "Fluid (cerebrospinal (CSF))",
          "meaning": "UBERON:0001359",
          "is_a": "Fluid"
        },
        "Fluid (pericardial)": {
          "text": "Fluid (pericardial)",
          "meaning": "UBERON:0002409",
          "is_a": "Fluid"
        },
        "Fluid (pleural)": {
          "text": "Fluid (pleural)",
          "meaning": "UBERON:0001087",
          "is_a": "Fluid"
        },
        "Fluid (vaginal)": {
          "text": "Fluid (vaginal)",
          "meaning": "UBERON:0036243",
          "is_a": "Fluid"
        },
        "Fluid (amniotic)": {
          "text": "Fluid (amniotic)",
          "meaning": "UBERON:0000173",
          "is_a": "Fluid"
        },
        "Lesion": {
          "text": "Lesion",
          "meaning": "NCIT:C3824"
        },
        "Lesion (Macule)": {
          "text": "Lesion (Macule)",
          "meaning": "NCIT:C43278",
          "is_a": "Lesion"
        },
        "Lesion (Papule)": {
          "text": "Lesion (Papule)",
          "meaning": "NCIT:C39690",
          "is_a": "Lesion"
        },
        "Lesion (Pustule)": {
          "text": "Lesion (Pustule)",
          "meaning": "NCIT:C78582",
          "is_a": "Lesion"
        },
        "Lesion (Scab)": {
          "text": "Lesion (Scab)",
          "is_a": "Lesion"
        },
        "Lesion (Vesicle)": {
          "text": "Lesion (Vesicle)",
          "is_a": "Lesion"
        },
        "Rash": {
          "text": "Rash",
          "meaning": "SYMP:0000487"
        },
        "Ulcer": {
          "text": "Ulcer",
          "meaning": "NCIT:C3426"
        },
        "Tissue": {
          "text": "Tissue",
          "meaning": "UBERON:0000479"
        }
      }
    },
    "anatomical material international menu": {
      "name": "anatomical material international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Blood [UBERON:0000178]": {
          "text": "Blood [UBERON:0000178]",
          "meaning": "UBERON:0000178"
        },
        "Blood clot [UBERON:0010210]": {
          "text": "Blood clot [UBERON:0010210]",
          "meaning": "UBERON:0010210",
          "is_a": "Blood [UBERON:0000178]"
        },
        "Blood serum [UBERON:0001977]": {
          "text": "Blood serum [UBERON:0001977]",
          "meaning": "UBERON:0001977",
          "is_a": "Blood [UBERON:0000178]"
        },
        "Blood plasma [UBERON:0001969]": {
          "text": "Blood plasma [UBERON:0001969]",
          "meaning": "UBERON:0001969",
          "is_a": "Blood [UBERON:0000178]"
        },
        "Whole blood [NCIT:C41067]": {
          "text": "Whole blood [NCIT:C41067]",
          "meaning": "NCIT:C41067",
          "is_a": "Blood [UBERON:0000178]"
        },
        "Fluid [UBERON:0006314]": {
          "text": "Fluid [UBERON:0006314]",
          "meaning": "UBERON:0006314"
        },
        "Saliva [UBERON:0001836]": {
          "text": "Saliva [UBERON:0001836]",
          "meaning": "UBERON:0001836",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Fluid (cerebrospinal (CSF)) [UBERON:0001359]": {
          "text": "Fluid (cerebrospinal (CSF)) [UBERON:0001359]",
          "meaning": "UBERON:0001359",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Fluid (pericardial) [UBERON:0002409]": {
          "text": "Fluid (pericardial) [UBERON:0002409]",
          "meaning": "UBERON:0002409",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Fluid (pleural) [UBERON:0001087]": {
          "text": "Fluid (pleural) [UBERON:0001087]",
          "meaning": "UBERON:0001087",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Fluid (vaginal) [UBERON:0036243]": {
          "text": "Fluid (vaginal) [UBERON:0036243]",
          "meaning": "UBERON:0036243",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Fluid (amniotic) [UBERON:0000173]": {
          "text": "Fluid (amniotic) [UBERON:0000173]",
          "meaning": "UBERON:0000173",
          "is_a": "Fluid [UBERON:0006314]"
        },
        "Lesion [NCIT:C3824]": {
          "text": "Lesion [NCIT:C3824]",
          "meaning": "NCIT:C3824"
        },
        "Lesion (Macule) [NCIT:C43278]": {
          "text": "Lesion (Macule) [NCIT:C43278]",
          "meaning": "NCIT:C43278",
          "is_a": "Lesion [NCIT:C3824]"
        },
        "Lesion (Papule) [NCIT:C39690]": {
          "text": "Lesion (Papule) [NCIT:C39690]",
          "meaning": "NCIT:C39690",
          "is_a": "Lesion [NCIT:C3824]"
        },
        "Lesion (Pustule) [NCIT:C78582]": {
          "text": "Lesion (Pustule) [NCIT:C78582]",
          "meaning": "NCIT:C78582",
          "is_a": "Lesion [NCIT:C3824]"
        },
        "Lesion (Scab)": {
          "text": "Lesion (Scab)",
          "is_a": "Lesion [NCIT:C3824]"
        },
        "Lesion (Vesicle)": {
          "text": "Lesion (Vesicle)",
          "is_a": "Lesion [NCIT:C3824]"
        },
        "Rash [SYMP:0000487]": {
          "text": "Rash [SYMP:0000487]",
          "meaning": "SYMP:0000487"
        },
        "Ulcer [NCIT:C3426]": {
          "text": "Ulcer [NCIT:C3426]",
          "meaning": "NCIT:C3426"
        },
        "Tissue [UBERON:0000479]": {
          "text": "Tissue [UBERON:0000479]",
          "meaning": "UBERON:0000479"
        }
      }
    },
    "anatomical part menu": {
      "name": "anatomical part menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Anus": {
          "text": "Anus",
          "meaning": "UBERON:0001245"
        },
        "Arm": {
          "text": "Arm",
          "meaning": "UBERON:0001460"
        },
        "Arm (forearm)": {
          "text": "Arm (forearm)",
          "meaning": "NCIT:C32628",
          "is_a": "Arm"
        },
        "Elbow": {
          "text": "Elbow",
          "meaning": "UBERON:0001461",
          "is_a": "Arm"
        },
        "Back": {
          "text": "Back",
          "meaning": "FMA:14181"
        },
        "Chest": {
          "text": "Chest",
          "meaning": "UBERON:0001443"
        },
        "Foot": {
          "text": "Foot",
          "meaning": "BTO:0000476"
        },
        "Genital area": {
          "text": "Genital area",
          "meaning": "BTO:0003358"
        },
        "Penis": {
          "text": "Penis",
          "meaning": "UBERON:0000989",
          "is_a": "Genital area"
        },
        "Perineum": {
          "text": "Perineum",
          "meaning": "UBERON:0002356",
          "is_a": "Genital area"
        },
        "Scrotum": {
          "text": "Scrotum",
          "meaning": "UBERON:0001300",
          "is_a": "Genital area"
        },
        "Hand": {
          "text": "Hand",
          "meaning": "BTO:0004668"
        },
        "Finger": {
          "text": "Finger",
          "meaning": "FMA:9666",
          "is_a": "Hand"
        },
        "Hand (palm)": {
          "text": "Hand (palm)",
          "meaning": "FMA:24920",
          "is_a": "Hand"
        },
        "Head": {
          "text": "Head",
          "meaning": "UBERON:0000033"
        },
        "Buccal mucosa": {
          "text": "Buccal mucosa",
          "meaning": "UBERON:0006956",
          "is_a": "Head"
        },
        "Eye": {
          "text": "Eye",
          "meaning": "UBERON:0000970",
          "is_a": "Head"
        },
        "Face": {
          "text": "Face",
          "meaning": "UBERON:0001456",
          "is_a": "Head"
        },
        "Forehead": {
          "text": "Forehead",
          "meaning": "UBERON:0008200",
          "is_a": "Head"
        },
        "Lip": {
          "text": "Lip",
          "meaning": "UBERON:0001833",
          "is_a": "Head"
        },
        "Hypogastrium (suprapubic region)": {
          "text": "Hypogastrium (suprapubic region)",
          "meaning": "UBERON:0013203"
        },
        "Leg": {
          "text": "Leg",
          "meaning": "UBERON:0000978"
        },
        "Ankle": {
          "text": "Ankle",
          "meaning": "UBERON:0001512",
          "is_a": "Leg"
        },
        "Knee": {
          "text": "Knee",
          "meaning": "UBERON:0001465",
          "is_a": "Leg"
        },
        "Thigh": {
          "text": "Thigh",
          "meaning": "UBERON:0000376",
          "is_a": "Leg"
        },
        "Nasal Cavity": {
          "text": "Nasal Cavity",
          "meaning": "UBERON:0001707"
        },
        "Anterior Nares": {
          "text": "Anterior Nares",
          "meaning": "UBERON:2001427",
          "is_a": "Nasal Cavity"
        },
        "Inferior Nasal Turbinate": {
          "text": "Inferior Nasal Turbinate",
          "meaning": "UBERON:0005921",
          "is_a": "Nasal Cavity"
        },
        "Middle Nasal Turbinate": {
          "text": "Middle Nasal Turbinate",
          "meaning": "UBERON:0005922",
          "is_a": "Nasal Cavity"
        },
        "Nasopharynx (NP)": {
          "text": "Nasopharynx (NP)",
          "meaning": "UBERON:0001728"
        },
        "Neck": {
          "text": "Neck",
          "meaning": "UBERON:0000974"
        },
        "Oropharynx (OP)": {
          "text": "Oropharynx (OP)",
          "meaning": "UBERON:0001729"
        },
        "Rectum": {
          "text": "Rectum",
          "meaning": "UBERON:0001052"
        },
        "Skin": {
          "text": "Skin",
          "meaning": "UBERON:0001003"
        },
        "Trachea": {
          "text": "Trachea",
          "meaning": "UBERON:0003126"
        }
      }
    },
    "anatomical part international menu": {
      "name": "anatomical part international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Anus [UBERON:0001245]": {
          "text": "Anus [UBERON:0001245]",
          "meaning": "UBERON:0001245"
        },
        "Arm [UBERON:0001460]": {
          "text": "Arm [UBERON:0001460]",
          "meaning": "UBERON:0001460"
        },
        "Arm (forearm) [NCIT:C32628]": {
          "text": "Arm (forearm) [NCIT:C32628]",
          "meaning": "NCIT:C32628",
          "is_a": "Arm [UBERON:0001460]"
        },
        "Elbow [UBERON:0001461]": {
          "text": "Elbow [UBERON:0001461]",
          "meaning": "UBERON:0001461",
          "is_a": "Arm [UBERON:0001460]"
        },
        "Back [FMA:14181]": {
          "text": "Back [FMA:14181]",
          "meaning": "FMA:14181"
        },
        "Chest [UBERON:0001443]": {
          "text": "Chest [UBERON:0001443]",
          "meaning": "UBERON:0001443"
        },
        "Foot [BTO:0000476]": {
          "text": "Foot [BTO:0000476]",
          "meaning": "BTO:0000476"
        },
        "Genital area [BTO:0003358]": {
          "text": "Genital area [BTO:0003358]",
          "meaning": "BTO:0003358"
        },
        "Penis [UBERON:0000989]": {
          "text": "Penis [UBERON:0000989]",
          "meaning": "UBERON:0000989",
          "is_a": "Genital area [BTO:0003358]"
        },
        "Perineum [UBERON:0002356]": {
          "text": "Perineum [UBERON:0002356]",
          "meaning": "UBERON:0002356",
          "is_a": "Genital area [BTO:0003358]"
        },
        "Scrotum [UBERON:0001300]": {
          "text": "Scrotum [UBERON:0001300]",
          "meaning": "UBERON:0001300",
          "is_a": "Genital area [BTO:0003358]"
        },
        "Hand [BTO:0004668]": {
          "text": "Hand [BTO:0004668]",
          "meaning": "BTO:0004668"
        },
        "Finger [FMA:9666]": {
          "text": "Finger [FMA:9666]",
          "meaning": "FMA:9666",
          "is_a": "Hand [BTO:0004668]"
        },
        "Hand (palm) [FMA:24920]": {
          "text": "Hand (palm) [FMA:24920]",
          "meaning": "FMA:24920",
          "is_a": "Hand [BTO:0004668]"
        },
        "Head [UBERON:0000033]": {
          "text": "Head [UBERON:0000033]",
          "meaning": "UBERON:0000033"
        },
        "Buccal mucosa [UBERON:0006956]": {
          "text": "Buccal mucosa [UBERON:0006956]",
          "meaning": "UBERON:0006956",
          "is_a": "Head [UBERON:0000033]"
        },
        "Eye [UBERON:0000970]": {
          "text": "Eye [UBERON:0000970]",
          "meaning": "UBERON:0000970",
          "is_a": "Head [UBERON:0000033]"
        },
        "Face [UBERON:0001456]": {
          "text": "Face [UBERON:0001456]",
          "meaning": "UBERON:0001456",
          "is_a": "Head [UBERON:0000033]"
        },
        "Forehead [UBERON:0008200]": {
          "text": "Forehead [UBERON:0008200]",
          "meaning": "UBERON:0008200",
          "is_a": "Head [UBERON:0000033]"
        },
        "Lip [UBERON:0001833]": {
          "text": "Lip [UBERON:0001833]",
          "meaning": "UBERON:0001833",
          "is_a": "Head [UBERON:0000033]"
        },
        "Hypogastrium (suprapubic region) [UBERON:0013203]": {
          "text": "Hypogastrium (suprapubic region) [UBERON:0013203]",
          "meaning": "UBERON:0013203"
        },
        "Leg [UBERON:0000978]": {
          "text": "Leg [UBERON:0000978]",
          "meaning": "UBERON:0000978"
        },
        "Ankle [UBERON:0001512]": {
          "text": "Ankle [UBERON:0001512]",
          "meaning": "UBERON:0001512",
          "is_a": "Leg [UBERON:0000978]"
        },
        "Knee [UBERON:0001465]": {
          "text": "Knee [UBERON:0001465]",
          "meaning": "UBERON:0001465",
          "is_a": "Leg [UBERON:0000978]"
        },
        "Thigh [UBERON:0000376]": {
          "text": "Thigh [UBERON:0000376]",
          "meaning": "UBERON:0000376",
          "is_a": "Leg [UBERON:0000978]"
        },
        "Nasal Cavity [UBERON:0001707]": {
          "text": "Nasal Cavity [UBERON:0001707]",
          "meaning": "UBERON:0001707"
        },
        "Anterior Nares [UBERON:2001427]": {
          "text": "Anterior Nares [UBERON:2001427]",
          "meaning": "UBERON:2001427",
          "is_a": "Nasal Cavity [UBERON:0001707]"
        },
        "Inferior Nasal Turbinate [UBERON:0005921]": {
          "text": "Inferior Nasal Turbinate [UBERON:0005921]",
          "meaning": "UBERON:0005921",
          "is_a": "Nasal Cavity [UBERON:0001707]"
        },
        "Middle Nasal Turbinate [UBERON:0005922]": {
          "text": "Middle Nasal Turbinate [UBERON:0005922]",
          "meaning": "UBERON:0005922",
          "is_a": "Nasal Cavity [UBERON:0001707]"
        },
        "Nasopharynx (NP) [UBERON:0001728]": {
          "text": "Nasopharynx (NP) [UBERON:0001728]",
          "meaning": "UBERON:0001728"
        },
        "Neck [UBERON:0000974]": {
          "text": "Neck [UBERON:0000974]",
          "meaning": "UBERON:0000974"
        },
        "Oropharynx (OP) [UBERON:0001729]": {
          "text": "Oropharynx (OP) [UBERON:0001729]",
          "meaning": "UBERON:0001729"
        },
        "Rectum [UBERON:0001052]": {
          "text": "Rectum [UBERON:0001052]",
          "meaning": "UBERON:0001052"
        },
        "Skin [UBERON:0001003]": {
          "text": "Skin [UBERON:0001003]",
          "meaning": "UBERON:0001003"
        },
        "Trachea [UBERON:0003126]": {
          "text": "Trachea [UBERON:0003126]",
          "meaning": "UBERON:0003126"
        }
      }
    },
    "body product menu": {
      "name": "body product menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Breast Milk": {
          "text": "Breast Milk",
          "meaning": "UBERON:0001913"
        },
        "Feces": {
          "text": "Feces",
          "meaning": "UBERON:0001988"
        },
        "Fluid (discharge)": {
          "text": "Fluid (discharge)",
          "meaning": "SYMP:0000651"
        },
        "Pus": {
          "text": "Pus",
          "meaning": "UBERON:0000177",
          "is_a": "Fluid (discharge)"
        },
        "Fluid (seminal)": {
          "text": "Fluid (seminal)",
          "meaning": "UBERON:0006530"
        },
        "Mucus": {
          "text": "Mucus",
          "meaning": "UBERON:0000912"
        },
        "Sputum": {
          "text": "Sputum",
          "meaning": "UBERON:0007311",
          "is_a": "Mucus"
        },
        "Sweat": {
          "text": "Sweat",
          "meaning": "UBERON:0001089"
        },
        "Tear": {
          "text": "Tear",
          "meaning": "UBERON:0001827"
        },
        "Urine": {
          "text": "Urine",
          "meaning": "UBERON:0001088"
        }
      }
    },
    "body product international menu": {
      "name": "body product international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Breast Milk [UBERON:0001913]": {
          "text": "Breast Milk [UBERON:0001913]",
          "meaning": "UBERON:0001913"
        },
        "Feces [UBERON:0001988]": {
          "text": "Feces [UBERON:0001988]",
          "meaning": "UBERON:0001988"
        },
        "Fluid (discharge) [SYMP:0000651]": {
          "text": "Fluid (discharge) [SYMP:0000651]",
          "meaning": "SYMP:0000651"
        },
        "Pus [UBERON:0000177]": {
          "text": "Pus [UBERON:0000177]",
          "meaning": "UBERON:0000177",
          "is_a": "Fluid (discharge) [SYMP:0000651]"
        },
        "Fluid (seminal) [UBERON:0006530]": {
          "text": "Fluid (seminal) [UBERON:0006530]",
          "meaning": "UBERON:0006530"
        },
        "Mucus [UBERON:0000912]": {
          "text": "Mucus [UBERON:0000912]",
          "meaning": "UBERON:0000912"
        },
        "Sputum [UBERON:0007311]": {
          "text": "Sputum [UBERON:0007311]",
          "meaning": "UBERON:0007311",
          "is_a": "Mucus [UBERON:0000912]"
        },
        "Sweat [UBERON:0001089]": {
          "text": "Sweat [UBERON:0001089]",
          "meaning": "UBERON:0001089"
        },
        "Tear [UBERON:0001827]": {
          "text": "Tear [UBERON:0001827]",
          "meaning": "UBERON:0001827"
        },
        "Urine [UBERON:0001088]": {
          "text": "Urine [UBERON:0001088]",
          "meaning": "UBERON:0001088"
        }
      }
    },
    "collection method menu": {
      "name": "collection method menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Amniocentesis": {
          "text": "Amniocentesis",
          "meaning": "NCIT:C52009"
        },
        "Aspiration": {
          "text": "Aspiration",
          "meaning": "NCIT:C15631"
        },
        "Suprapubic Aspiration": {
          "text": "Suprapubic Aspiration",
          "meaning": "GENEPIO:0100028",
          "is_a": "Aspiration"
        },
        "Tracheal aspiration": {
          "text": "Tracheal aspiration",
          "meaning": "GENEPIO:0100029",
          "is_a": "Aspiration"
        },
        "Vacuum Aspiration": {
          "text": "Vacuum Aspiration",
          "meaning": "GENEPIO:0100030",
          "is_a": "Aspiration"
        },
        "Biopsy": {
          "text": "Biopsy",
          "meaning": "OBI:0002650"
        },
        "Needle Biopsy": {
          "text": "Needle Biopsy",
          "meaning": "OBI:0002651",
          "is_a": "Biopsy"
        },
        "Filtration": {
          "text": "Filtration",
          "meaning": "OBI:0302885"
        },
        "Air filtration": {
          "text": "Air filtration",
          "meaning": "GENEPIO:0100031",
          "is_a": "Filtration"
        },
        "Lavage": {
          "text": "Lavage",
          "meaning": "OBI:0600044"
        },
        "Bronchoalveolar lavage (BAL)": {
          "text": "Bronchoalveolar lavage (BAL)",
          "meaning": "GENEPIO:0100032",
          "is_a": "Lavage"
        },
        "Gastric Lavage": {
          "text": "Gastric Lavage",
          "meaning": "GENEPIO:0100033",
          "is_a": "Lavage"
        },
        "Lumbar Puncture": {
          "text": "Lumbar Puncture",
          "meaning": "NCIT:C15327"
        },
        "Necropsy": {
          "text": "Necropsy",
          "meaning": "MMO:0000344"
        },
        "Phlebotomy": {
          "text": "Phlebotomy",
          "meaning": "NCIT:C28221"
        },
        "Rinsing": {
          "text": "Rinsing",
          "meaning": "GENEPIO:0002116"
        },
        "Saline gargle (mouth rinse and gargle)": {
          "text": "Saline gargle (mouth rinse and gargle)",
          "meaning": "GENEPIO:0100034",
          "is_a": "Rinsing"
        },
        "Scraping": {
          "text": "Scraping",
          "meaning": "GENEPIO:0100035"
        },
        "Swabbing": {
          "text": "Swabbing",
          "meaning": "GENEPIO:0002117"
        },
        "Finger Prick": {
          "text": "Finger Prick",
          "meaning": "GENEPIO:0100036",
          "is_a": "Swabbing"
        },
        "Thoracentesis (chest tap)": {
          "text": "Thoracentesis (chest tap)",
          "meaning": "NCIT:C15392"
        }
      }
    },
    "collection method international menu": {
      "name": "collection method international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Amniocentesis [NCIT:C52009]": {
          "text": "Amniocentesis [NCIT:C52009]",
          "meaning": "NCIT:C52009"
        },
        "Aspiration [NCIT:C15631]": {
          "text": "Aspiration [NCIT:C15631]",
          "meaning": "NCIT:C15631"
        },
        "Suprapubic Aspiration [GENEPIO:0100028]": {
          "text": "Suprapubic Aspiration [GENEPIO:0100028]",
          "meaning": "GENEPIO:0100028",
          "is_a": "Aspiration [NCIT:C15631]"
        },
        "Tracheal aspiration [GENEPIO:0100029]": {
          "text": "Tracheal aspiration [GENEPIO:0100029]",
          "meaning": "GENEPIO:0100029",
          "is_a": "Aspiration [NCIT:C15631]"
        },
        "Vacuum Aspiration [GENEPIO:0100030]": {
          "text": "Vacuum Aspiration [GENEPIO:0100030]",
          "meaning": "GENEPIO:0100030",
          "is_a": "Aspiration [NCIT:C15631]"
        },
        "Biopsy [OBI:0002650]": {
          "text": "Biopsy [OBI:0002650]",
          "meaning": "OBI:0002650"
        },
        "Needle Biopsy [OBI:0002651]": {
          "text": "Needle Biopsy [OBI:0002651]",
          "meaning": "OBI:0002651",
          "is_a": "Biopsy [OBI:0002650]"
        },
        "Filtration [OBI:0302885]": {
          "text": "Filtration [OBI:0302885]",
          "meaning": "OBI:0302885"
        },
        "Air filtration [GENEPIO:0100031]": {
          "text": "Air filtration [GENEPIO:0100031]",
          "meaning": "GENEPIO:0100031",
          "is_a": "Filtration [OBI:0302885]"
        },
        "Lavage [OBI:0600044]": {
          "text": "Lavage [OBI:0600044]",
          "meaning": "OBI:0600044"
        },
        "Bronchoalveolar lavage (BAL) [GENEPIO:0100032]": {
          "text": "Bronchoalveolar lavage (BAL) [GENEPIO:0100032]",
          "meaning": "GENEPIO:0100032",
          "is_a": "Lavage [OBI:0600044]"
        },
        "Gastric Lavage [GENEPIO:0100033]": {
          "text": "Gastric Lavage [GENEPIO:0100033]",
          "meaning": "GENEPIO:0100033",
          "is_a": "Lavage [OBI:0600044]"
        },
        "Lumbar Puncture [NCIT:C15327]": {
          "text": "Lumbar Puncture [NCIT:C15327]",
          "meaning": "NCIT:C15327"
        },
        "Necropsy [MMO:0000344]": {
          "text": "Necropsy [MMO:0000344]",
          "meaning": "MMO:0000344"
        },
        "Phlebotomy [NCIT:C28221]": {
          "text": "Phlebotomy [NCIT:C28221]",
          "meaning": "NCIT:C28221"
        },
        "Rinsing [GENEPIO:0002116]": {
          "text": "Rinsing [GENEPIO:0002116]",
          "meaning": "GENEPIO:0002116"
        },
        "Saline gargle (mouth rinse and gargle) [GENEPIO:0100034]": {
          "text": "Saline gargle (mouth rinse and gargle) [GENEPIO:0100034]",
          "meaning": "GENEPIO:0100034",
          "is_a": "Rinsing [GENEPIO:0002116]"
        },
        "Scraping [GENEPIO:0100035]": {
          "text": "Scraping [GENEPIO:0100035]",
          "meaning": "GENEPIO:0100035"
        },
        "Swabbing [GENEPIO:0002117]": {
          "text": "Swabbing [GENEPIO:0002117]",
          "meaning": "GENEPIO:0002117"
        },
        "Finger Prick [GENEPIO:0100036]": {
          "text": "Finger Prick [GENEPIO:0100036]",
          "meaning": "GENEPIO:0100036",
          "is_a": "Swabbing [GENEPIO:0002117]"
        },
        "Thoracentesis (chest tap) [NCIT:C15392]": {
          "text": "Thoracentesis (chest tap) [NCIT:C15392]",
          "meaning": "NCIT:C15392"
        }
      }
    },
    "collection device menu": {
      "name": "collection device menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Blood Collection Tube": {
          "text": "Blood Collection Tube",
          "meaning": "OBI:0002859"
        },
        "Bronchoscope": {
          "text": "Bronchoscope",
          "meaning": "OBI:0002826"
        },
        "Collection Container": {
          "text": "Collection Container",
          "meaning": "OBI:0002088"
        },
        "Collection Cup": {
          "text": "Collection Cup",
          "meaning": "GENEPIO:0100026"
        },
        "Filter": {
          "text": "Filter",
          "meaning": "GENEPIO:0100103"
        },
        "Needle": {
          "text": "Needle",
          "meaning": "OBI:0000436"
        },
        "Serum Collection Tube": {
          "text": "Serum Collection Tube",
          "meaning": "OBI:0002860"
        },
        "Sputum Collection Tube": {
          "text": "Sputum Collection Tube",
          "meaning": "OBI:0002861"
        },
        "Suction Catheter": {
          "text": "Suction Catheter",
          "meaning": "OBI:0002831"
        },
        "Swab": {
          "text": "Swab",
          "meaning": "GENEPIO:0100027"
        },
        "Dry swab": {
          "text": "Dry swab",
          "is_a": "Swab"
        },
        "Urine Collection Tube": {
          "text": "Urine Collection Tube",
          "meaning": "OBI:0002862"
        },
        "Universal Transport Medium (UTM)": {
          "text": "Universal Transport Medium (UTM)"
        },
        "Virus Transport Medium": {
          "text": "Virus Transport Medium",
          "meaning": "OBI:0002866"
        }
      }
    },
    "collection device international menu": {
      "name": "collection device international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Blood Collection Tube [OBI:0002859]": {
          "text": "Blood Collection Tube [OBI:0002859]",
          "meaning": "OBI:0002859"
        },
        "Bronchoscope [OBI:0002826]": {
          "text": "Bronchoscope [OBI:0002826]",
          "meaning": "OBI:0002826"
        },
        "Collection Container [OBI:0002088]": {
          "text": "Collection Container [OBI:0002088]",
          "meaning": "OBI:0002088"
        },
        "Collection Cup [GENEPIO:0100026]": {
          "text": "Collection Cup [GENEPIO:0100026]",
          "meaning": "GENEPIO:0100026"
        },
        "Filter [GENEPIO:0100103]": {
          "text": "Filter [GENEPIO:0100103]",
          "meaning": "GENEPIO:0100103"
        },
        "Needle [OBI:0000436]": {
          "text": "Needle [OBI:0000436]",
          "meaning": "OBI:0000436"
        },
        "Serum Collection Tube [OBI:0002860]": {
          "text": "Serum Collection Tube [OBI:0002860]",
          "meaning": "OBI:0002860"
        },
        "Sputum Collection Tube [OBI:0002861]": {
          "text": "Sputum Collection Tube [OBI:0002861]",
          "meaning": "OBI:0002861"
        },
        "Suction Catheter [OBI:0002831]": {
          "text": "Suction Catheter [OBI:0002831]",
          "meaning": "OBI:0002831"
        },
        "Swab [GENEPIO:0100027]": {
          "text": "Swab [GENEPIO:0100027]",
          "meaning": "GENEPIO:0100027"
        },
        "Dry swab": {
          "text": "Dry swab",
          "is_a": "Swab [GENEPIO:0100027]"
        },
        "Urine Collection Tube [OBI:0002862]": {
          "text": "Urine Collection Tube [OBI:0002862]",
          "meaning": "OBI:0002862"
        },
        "Universal Transport Medium (UTM)": {
          "text": "Universal Transport Medium (UTM)"
        },
        "Virus Transport Medium [OBI:0002866]": {
          "text": "Virus Transport Medium [OBI:0002866]",
          "meaning": "OBI:0002866"
        }
      }
    },
    "host (scientific name) menu": {
      "name": "host (scientific name) menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Homo sapiens": {
          "text": "Homo sapiens",
          "meaning": "NCBITaxon:9606",
          "exact_mappings": [
            "NML_LIMS:Human"
          ]
        }
      }
    },
    "host (scientific name) international menu": {
      "name": "host (scientific name) international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Homo sapiens [NCBITaxon:9606]": {
          "text": "Homo sapiens [NCBITaxon:9606]",
          "meaning": "NCBITaxon:9606",
          "exact_mappings": [
            "NML_LIMS:Human"
          ]
        }
      }
    },
    "host health state international menu": {
      "name": "host health state international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Asymptomatic [NCIT:C3833]": {
          "text": "Asymptomatic [NCIT:C3833]",
          "meaning": "NCIT:C3833"
        },
        "Deceased [NCIT:C28554]": {
          "text": "Deceased [NCIT:C28554]",
          "meaning": "NCIT:C28554"
        },
        "Healthy [NCIT:C115935]": {
          "text": "Healthy [NCIT:C115935]",
          "meaning": "NCIT:C115935"
        },
        "Recovered [NCIT:C49498]": {
          "text": "Recovered [NCIT:C49498]",
          "meaning": "NCIT:C49498"
        },
        "Symptomatic [NCIT:C25269]": {
          "text": "Symptomatic [NCIT:C25269]",
          "meaning": "NCIT:C25269"
        }
      }
    },
    "host age unit international menu": {
      "name": "host age unit international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "month [UO:0000035]": {
          "text": "month [UO:0000035]",
          "meaning": "UO:0000035"
        },
        "year [UO:0000036]": {
          "text": "year [UO:0000036]",
          "meaning": "UO:0000036"
        }
      }
    },
    "host age bin international menu": {
      "name": "host age bin international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "0 - 9 [GENEPIO:0100049]": {
          "text": "0 - 9 [GENEPIO:0100049]",
          "meaning": "GENEPIO:0100049"
        },
        "10 - 19 [GENEPIO:0100050]": {
          "text": "10 - 19 [GENEPIO:0100050]",
          "meaning": "GENEPIO:0100050"
        },
        "20 - 29 [GENEPIO:0100051]": {
          "text": "20 - 29 [GENEPIO:0100051]",
          "meaning": "GENEPIO:0100051"
        },
        "30 - 39 [GENEPIO:0100052]": {
          "text": "30 - 39 [GENEPIO:0100052]",
          "meaning": "GENEPIO:0100052"
        },
        "40 - 49 [GENEPIO:0100053]": {
          "text": "40 - 49 [GENEPIO:0100053]",
          "meaning": "GENEPIO:0100053"
        },
        "50 - 59 [GENEPIO:0100054]": {
          "text": "50 - 59 [GENEPIO:0100054]",
          "meaning": "GENEPIO:0100054"
        },
        "60 - 69 [GENEPIO:0100055]": {
          "text": "60 - 69 [GENEPIO:0100055]",
          "meaning": "GENEPIO:0100055"
        },
        "70 - 79 [GENEPIO:0100056]": {
          "text": "70 - 79 [GENEPIO:0100056]",
          "meaning": "GENEPIO:0100056"
        },
        "80 - 89 [GENEPIO:0100057]": {
          "text": "80 - 89 [GENEPIO:0100057]",
          "meaning": "GENEPIO:0100057"
        },
        "90 - 99 [GENEPIO:0100058]": {
          "text": "90 - 99 [GENEPIO:0100058]",
          "meaning": "GENEPIO:0100058"
        },
        "100+ [GENEPIO:0100059]": {
          "text": "100+ [GENEPIO:0100059]",
          "meaning": "GENEPIO:0100059"
        }
      }
    },
    "host gender international menu": {
      "name": "host gender international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Female": {
          "text": "Female",
          "meaning": "NCIT:C46110"
        },
        "Male": {
          "text": "Male",
          "meaning": "NCIT:C46109"
        },
        "Non-binary gender": {
          "text": "Non-binary gender",
          "meaning": "GSSO:000132"
        },
        "Transgender (assigned male at birth)": {
          "text": "Transgender (assigned male at birth)",
          "meaning": "GSSO:004004"
        },
        "Transgender (assigned female at birth)": {
          "text": "Transgender (assigned female at birth)",
          "meaning": "GSSO:004005"
        },
        "Undeclared": {
          "text": "Undeclared",
          "meaning": "NCIT:C110959"
        }
      }
    },
    "organism menu": {
      "name": "organism menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Monkeypox virus": {
          "text": "Monkeypox virus",
          "meaning": "NCBITaxon:10244"
        }
      }
    },
    "organism international menu": {
      "name": "organism international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Monkeypox virus [NCBITaxon:10244]": {
          "text": "Monkeypox virus [NCBITaxon:10244]",
          "meaning": "NCBITaxon:10244"
        }
      }
    },
    "host disease menu": {
      "name": "host disease menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Monkeypox": {
          "text": "Monkeypox",
          "meaning": "MONDO:0002594"
        }
      }
    },
    "host disease international menu": {
      "name": "host disease international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Monkeypox [MONDO:0002594]": {
          "text": "Monkeypox [MONDO:0002594]",
          "meaning": "MONDO:0002594"
        }
      }
    },
    "purpose of sampling menu": {
      "name": "purpose of sampling menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Cluster/Outbreak investigation": {
          "text": "Cluster/Outbreak investigation",
          "meaning": "GENEPIO:0100001"
        },
        "Diagnostic testing": {
          "text": "Diagnostic testing",
          "meaning": "GENEPIO:0100002"
        },
        "Research": {
          "text": "Research",
          "meaning": "GENEPIO:0100003"
        },
        "Surveillance": {
          "text": "Surveillance",
          "meaning": "GENEPIO:0100004"
        }
      }
    },
    "purpose of sampling international menu": {
      "name": "purpose of sampling international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Cluster/Outbreak investigation [GENEPIO:0100001]": {
          "text": "Cluster/Outbreak investigation [GENEPIO:0100001]",
          "meaning": "GENEPIO:0100001"
        },
        "Diagnostic testing [GENEPIO:0100002]": {
          "text": "Diagnostic testing [GENEPIO:0100002]",
          "meaning": "GENEPIO:0100002"
        },
        "Research [GENEPIO:0100003]": {
          "text": "Research [GENEPIO:0100003]",
          "meaning": "GENEPIO:0100003"
        },
        "Surveillance [GENEPIO:0100004]": {
          "text": "Surveillance [GENEPIO:0100004]",
          "meaning": "GENEPIO:0100004"
        }
      }
    },
    "purpose of sequencing menu": {
      "name": "purpose of sequencing menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Baseline surveillance (random sampling)": {
          "text": "Baseline surveillance (random sampling)",
          "meaning": "GENEPIO:0100005"
        },
        "Targeted surveillance (non-random sampling)": {
          "text": "Targeted surveillance (non-random sampling)",
          "meaning": "GENEPIO:0100006"
        },
        "Priority surveillance project": {
          "text": "Priority surveillance project",
          "meaning": "GENEPIO:0100007",
          "is_a": "Targeted surveillance (non-random sampling)"
        },
        "Longitudinal surveillance (repeat sampling of individuals)": {
          "text": "Longitudinal surveillance (repeat sampling of individuals)",
          "meaning": "GENEPIO:0100009",
          "is_a": "Priority surveillance project"
        },
        "Re-infection surveillance": {
          "text": "Re-infection surveillance",
          "meaning": "GENEPIO:0100010",
          "is_a": "Priority surveillance project"
        },
        "Vaccine escape surveillance": {
          "text": "Vaccine escape surveillance",
          "meaning": "GENEPIO:0100011",
          "is_a": "Priority surveillance project"
        },
        "Travel-associated surveillance": {
          "text": "Travel-associated surveillance",
          "meaning": "GENEPIO:0100012",
          "is_a": "Priority surveillance project"
        },
        "Domestic travel surveillance": {
          "text": "Domestic travel surveillance",
          "meaning": "GENEPIO:0100013",
          "is_a": "Travel-associated surveillance"
        },
        "Interstate/ interprovincial travel surveillance": {
          "text": "Interstate/ interprovincial travel surveillance",
          "meaning": "GENEPIO:0100275",
          "is_a": "Domestic travel surveillance"
        },
        "Intra-state/ intra-provincial travel surveillance": {
          "text": "Intra-state/ intra-provincial travel surveillance",
          "meaning": "GENEPIO:0100276",
          "is_a": "Domestic travel surveillance"
        },
        "International travel surveillance": {
          "text": "International travel surveillance",
          "meaning": "GENEPIO:0100014",
          "is_a": "Travel-associated surveillance"
        },
        "Cluster/Outbreak investigation": {
          "text": "Cluster/Outbreak investigation",
          "meaning": "GENEPIO:0100019"
        },
        "Multi-jurisdictional outbreak investigation": {
          "text": "Multi-jurisdictional outbreak investigation",
          "meaning": "GENEPIO:0100020",
          "is_a": "Cluster/Outbreak investigation"
        },
        "Intra-jurisdictional outbreak investigation": {
          "text": "Intra-jurisdictional outbreak investigation",
          "meaning": "GENEPIO:0100021",
          "is_a": "Cluster/Outbreak investigation"
        },
        "Research": {
          "text": "Research",
          "meaning": "GENEPIO:0100022"
        },
        "Viral passage experiment": {
          "text": "Viral passage experiment",
          "meaning": "GENEPIO:0100023",
          "is_a": "Research"
        },
        "Protocol testing experiment": {
          "text": "Protocol testing experiment",
          "meaning": "GENEPIO:0100024",
          "is_a": "Research"
        },
        "Retrospective sequencing": {
          "text": "Retrospective sequencing",
          "meaning": "GENEPIO:0100356"
        }
      }
    },
    "purpose of sequencing international menu": {
      "name": "purpose of sequencing international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Baseline surveillance (random sampling) [GENEPIO:0100005]": {
          "text": "Baseline surveillance (random sampling) [GENEPIO:0100005]",
          "meaning": "GENEPIO:0100005"
        },
        "Targeted surveillance (non-random sampling) [GENEPIO:0100006]": {
          "text": "Targeted surveillance (non-random sampling) [GENEPIO:0100006]",
          "meaning": "GENEPIO:0100006"
        },
        "Priority surveillance project [GENEPIO:0100007]": {
          "text": "Priority surveillance project [GENEPIO:0100007]",
          "meaning": "GENEPIO:0100007",
          "is_a": "Targeted surveillance (non-random sampling) [GENEPIO:0100006]"
        },
        "Longitudinal surveillance (repeat sampling of individuals) [GENEPIO:0100009]": {
          "text": "Longitudinal surveillance (repeat sampling of individuals) [GENEPIO:0100009]",
          "meaning": "GENEPIO:0100009",
          "is_a": "Priority surveillance project [GENEPIO:0100007]"
        },
        "Re-infection surveillance [GENEPIO:0100010]": {
          "text": "Re-infection surveillance [GENEPIO:0100010]",
          "meaning": "GENEPIO:0100010",
          "is_a": "Priority surveillance project [GENEPIO:0100007]"
        },
        "Vaccine escape surveillance [GENEPIO:0100011]": {
          "text": "Vaccine escape surveillance [GENEPIO:0100011]",
          "meaning": "GENEPIO:0100011",
          "is_a": "Priority surveillance project [GENEPIO:0100007]"
        },
        "Travel-associated surveillance [GENEPIO:0100012]": {
          "text": "Travel-associated surveillance [GENEPIO:0100012]",
          "meaning": "GENEPIO:0100012",
          "is_a": "Priority surveillance project [GENEPIO:0100007]"
        },
        "Domestic travel surveillance [GENEPIO:0100013]": {
          "text": "Domestic travel surveillance [GENEPIO:0100013]",
          "meaning": "GENEPIO:0100013",
          "is_a": "Travel-associated surveillance [GENEPIO:0100012]"
        },
        "Interstate/ interprovincial travel surveillance [GENEPIO:0100275]": {
          "text": "Interstate/ interprovincial travel surveillance [GENEPIO:0100275]",
          "meaning": "GENEPIO:0100275",
          "is_a": "Domestic travel surveillance [GENEPIO:0100013]"
        },
        "Intra-state/ intra-provincial travel surveillance [GENEPIO:0100276]": {
          "text": "Intra-state/ intra-provincial travel surveillance [GENEPIO:0100276]",
          "meaning": "GENEPIO:0100276",
          "is_a": "Domestic travel surveillance [GENEPIO:0100013]"
        },
        "International travel surveillance [GENEPIO:0100014]": {
          "text": "International travel surveillance [GENEPIO:0100014]",
          "meaning": "GENEPIO:0100014",
          "is_a": "Travel-associated surveillance [GENEPIO:0100012]"
        },
        "Cluster/Outbreak investigation [GENEPIO:0100019]": {
          "text": "Cluster/Outbreak investigation [GENEPIO:0100019]",
          "meaning": "GENEPIO:0100019"
        },
        "Multi-jurisdictional outbreak investigation [GENEPIO:0100020]": {
          "text": "Multi-jurisdictional outbreak investigation [GENEPIO:0100020]",
          "meaning": "GENEPIO:0100020",
          "is_a": "Cluster/Outbreak investigation [GENEPIO:0100019]"
        },
        "Intra-jurisdictional outbreak investigation [GENEPIO:0100021]": {
          "text": "Intra-jurisdictional outbreak investigation [GENEPIO:0100021]",
          "meaning": "GENEPIO:0100021",
          "is_a": "Cluster/Outbreak investigation [GENEPIO:0100019]"
        },
        "Research [GENEPIO:0100022]": {
          "text": "Research [GENEPIO:0100022]",
          "meaning": "GENEPIO:0100022"
        },
        "Viral passage experiment [GENEPIO:0100023]": {
          "text": "Viral passage experiment [GENEPIO:0100023]",
          "meaning": "GENEPIO:0100023",
          "is_a": "Research [GENEPIO:0100022]"
        },
        "Protocol testing experiment [GENEPIO:0100024]": {
          "text": "Protocol testing experiment [GENEPIO:0100024]",
          "meaning": "GENEPIO:0100024",
          "is_a": "Research [GENEPIO:0100022]"
        },
        "Retrospective sequencing [GENEPIO:0100356]": {
          "text": "Retrospective sequencing [GENEPIO:0100356]",
          "meaning": "GENEPIO:0100356"
        }
      }
    },
    "sequencing instrument menu": {
      "name": "sequencing instrument menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Illumina": {
          "text": "Illumina",
          "meaning": "GENEPIO:0100105"
        },
        "Illumina Genome Analyzer": {
          "text": "Illumina Genome Analyzer",
          "meaning": "GENEPIO:0100106",
          "is_a": "Illumina"
        },
        "Illumina Genome Analyzer II": {
          "text": "Illumina Genome Analyzer II",
          "meaning": "GENEPIO:0100107",
          "is_a": "Illumina Genome Analyzer"
        },
        "Illumina Genome Analyzer IIx": {
          "text": "Illumina Genome Analyzer IIx",
          "meaning": "GENEPIO:0100108",
          "is_a": "Illumina Genome Analyzer"
        },
        "Illumina HiScanSQ": {
          "text": "Illumina HiScanSQ",
          "meaning": "GENEPIO:0100109",
          "is_a": "Illumina"
        },
        "Illumina HiSeq": {
          "text": "Illumina HiSeq",
          "meaning": "GENEPIO:0100110",
          "is_a": "Illumina"
        },
        "Illumina HiSeq X": {
          "text": "Illumina HiSeq X",
          "meaning": "GENEPIO:0100111",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq X Five": {
          "text": "Illumina HiSeq X Five",
          "meaning": "GENEPIO:0100112",
          "is_a": "Illumina HiSeq X"
        },
        "Illumina HiSeq X Ten": {
          "text": "Illumina HiSeq X Ten",
          "meaning": "GENEPIO:0100113",
          "is_a": "Illumina HiSeq X"
        },
        "Illumina HiSeq 1000": {
          "text": "Illumina HiSeq 1000",
          "meaning": "GENEPIO:0100114",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 1500": {
          "text": "Illumina HiSeq 1500",
          "meaning": "GENEPIO:0100115",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 2000": {
          "text": "Illumina HiSeq 2000",
          "meaning": "GENEPIO:0100116",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 2500": {
          "text": "Illumina HiSeq 2500",
          "meaning": "GENEPIO:0100117",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 3000": {
          "text": "Illumina HiSeq 3000",
          "meaning": "GENEPIO:0100118",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 4000": {
          "text": "Illumina HiSeq 4000",
          "meaning": "GENEPIO:0100119",
          "is_a": "Illumina HiSeq"
        },
        "Illumina iSeq": {
          "text": "Illumina iSeq",
          "meaning": "GENEPIO:0100120",
          "is_a": "Illumina"
        },
        "Illumina iSeq 100": {
          "text": "Illumina iSeq 100",
          "meaning": "GENEPIO:0100121",
          "is_a": "Illumina iSeq"
        },
        "Illumina NovaSeq": {
          "text": "Illumina NovaSeq",
          "meaning": "GENEPIO:0100122",
          "is_a": "Illumina"
        },
        "Illumina NovaSeq 6000": {
          "text": "Illumina NovaSeq 6000",
          "meaning": "GENEPIO:0100123",
          "is_a": "Illumina NovaSeq"
        },
        "Illumina MiniSeq": {
          "text": "Illumina MiniSeq",
          "meaning": "GENEPIO:0100124",
          "is_a": "Illumina"
        },
        "Illumina MiSeq": {
          "text": "Illumina MiSeq",
          "meaning": "GENEPIO:0100125",
          "is_a": "Illumina"
        },
        "Illumina NextSeq": {
          "text": "Illumina NextSeq",
          "meaning": "GENEPIO:0100126",
          "is_a": "Illumina"
        },
        "Illumina NextSeq 500": {
          "text": "Illumina NextSeq 500",
          "meaning": "GENEPIO:0100127",
          "is_a": "Illumina NextSeq"
        },
        "Illumina NextSeq 550": {
          "text": "Illumina NextSeq 550",
          "meaning": "GENEPIO:0100128",
          "is_a": "Illumina NextSeq"
        },
        "Illumina NextSeq 2000": {
          "text": "Illumina NextSeq 2000",
          "meaning": "GENEPIO:0100129",
          "is_a": "Illumina NextSeq"
        },
        "Pacific Biosciences": {
          "text": "Pacific Biosciences",
          "meaning": "GENEPIO:0100130"
        },
        "PacBio RS": {
          "text": "PacBio RS",
          "meaning": "GENEPIO:0100131",
          "is_a": "Pacific Biosciences"
        },
        "PacBio RS II": {
          "text": "PacBio RS II",
          "meaning": "GENEPIO:0100132",
          "is_a": "Pacific Biosciences"
        },
        "PacBio Sequel": {
          "text": "PacBio Sequel",
          "meaning": "GENEPIO:0100133",
          "is_a": "Pacific Biosciences"
        },
        "PacBio Sequel II": {
          "text": "PacBio Sequel II",
          "meaning": "GENEPIO:0100134",
          "is_a": "Pacific Biosciences"
        },
        "Ion Torrent": {
          "text": "Ion Torrent",
          "meaning": "GENEPIO:0100135"
        },
        "Ion Torrent PGM": {
          "text": "Ion Torrent PGM",
          "meaning": "GENEPIO:0100136",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent Proton": {
          "text": "Ion Torrent Proton",
          "meaning": "GENEPIO:0100137",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent S5 XL": {
          "text": "Ion Torrent S5 XL",
          "meaning": "GENEPIO:0100138",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent S5": {
          "text": "Ion Torrent S5",
          "meaning": "GENEPIO:0100139",
          "is_a": "Ion Torrent"
        },
        "Oxford Nanopore": {
          "text": "Oxford Nanopore",
          "meaning": "GENEPIO:0100140"
        },
        "Oxford Nanopore GridION": {
          "text": "Oxford Nanopore GridION",
          "meaning": "GENEPIO:0100141",
          "is_a": "Oxford Nanopore"
        },
        "Oxford Nanopore MinION": {
          "text": "Oxford Nanopore MinION",
          "meaning": "GENEPIO:0100142",
          "is_a": "Oxford Nanopore"
        },
        "Oxford Nanopore PromethION": {
          "text": "Oxford Nanopore PromethION",
          "meaning": "GENEPIO:0100143",
          "is_a": "Oxford Nanopore"
        },
        "BGI Genomics": {
          "text": "BGI Genomics",
          "meaning": "GENEPIO:0100144"
        },
        "BGI Genomics BGISEQ-500": {
          "text": "BGI Genomics BGISEQ-500",
          "meaning": "GENEPIO:0100145",
          "is_a": "BGI Genomics"
        },
        "MGI": {
          "text": "MGI",
          "meaning": "GENEPIO:0100146"
        },
        "MGI DNBSEQ-T7": {
          "text": "MGI DNBSEQ-T7",
          "meaning": "GENEPIO:0100147",
          "is_a": "MGI"
        },
        "MGI DNBSEQ-G400": {
          "text": "MGI DNBSEQ-G400",
          "meaning": "GENEPIO:0100148",
          "is_a": "MGI"
        },
        "MGI DNBSEQ-G400 FAST": {
          "text": "MGI DNBSEQ-G400 FAST",
          "meaning": "GENEPIO:0100149",
          "is_a": "MGI"
        },
        "MGI DNBSEQ-G50": {
          "text": "MGI DNBSEQ-G50",
          "meaning": "GENEPIO:0100150",
          "is_a": "MGI"
        }
      }
    },
    "sequencing instrument international menu": {
      "name": "sequencing instrument international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Illumina [GENEPIO:0100105]": {
          "text": "Illumina [GENEPIO:0100105]",
          "meaning": "GENEPIO:0100105"
        },
        "Illumina Genome Analyzer [GENEPIO:0100106]": {
          "text": "Illumina Genome Analyzer [GENEPIO:0100106]",
          "meaning": "GENEPIO:0100106",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina Genome Analyzer II [GENEPIO:0100107]": {
          "text": "Illumina Genome Analyzer II [GENEPIO:0100107]",
          "meaning": "GENEPIO:0100107",
          "is_a": "Illumina Genome Analyzer [GENEPIO:0100106]"
        },
        "Illumina Genome Analyzer IIx [GENEPIO:0100108]": {
          "text": "Illumina Genome Analyzer IIx [GENEPIO:0100108]",
          "meaning": "GENEPIO:0100108",
          "is_a": "Illumina Genome Analyzer [GENEPIO:0100106]"
        },
        "Illumina HiScanSQ [GENEPIO:0100109]": {
          "text": "Illumina HiScanSQ [GENEPIO:0100109]",
          "meaning": "GENEPIO:0100109",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina HiSeq [GENEPIO:0100110]": {
          "text": "Illumina HiSeq [GENEPIO:0100110]",
          "meaning": "GENEPIO:0100110",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina HiSeq X [GENEPIO:0100111]": {
          "text": "Illumina HiSeq X [GENEPIO:0100111]",
          "meaning": "GENEPIO:0100111",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq X Five [GENEPIO:0100112]": {
          "text": "Illumina HiSeq X Five [GENEPIO:0100112]",
          "meaning": "GENEPIO:0100112",
          "is_a": "Illumina HiSeq X [GENEPIO:0100111]"
        },
        "Illumina HiSeq X Ten [GENEPIO:0100113]": {
          "text": "Illumina HiSeq X Ten [GENEPIO:0100113]",
          "meaning": "GENEPIO:0100113",
          "is_a": "Illumina HiSeq X [GENEPIO:0100111]"
        },
        "Illumina HiSeq 1000 [GENEPIO:0100114]": {
          "text": "Illumina HiSeq 1000 [GENEPIO:0100114]",
          "meaning": "GENEPIO:0100114",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq 1500 [GENEPIO:0100115]": {
          "text": "Illumina HiSeq 1500 [GENEPIO:0100115]",
          "meaning": "GENEPIO:0100115",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq 2000 [GENEPIO:0100116]": {
          "text": "Illumina HiSeq 2000 [GENEPIO:0100116]",
          "meaning": "GENEPIO:0100116",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq 2500 [GENEPIO:0100117]": {
          "text": "Illumina HiSeq 2500 [GENEPIO:0100117]",
          "meaning": "GENEPIO:0100117",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq 3000 [GENEPIO:0100118]": {
          "text": "Illumina HiSeq 3000 [GENEPIO:0100118]",
          "meaning": "GENEPIO:0100118",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina HiSeq 4000 [GENEPIO:0100119]": {
          "text": "Illumina HiSeq 4000 [GENEPIO:0100119]",
          "meaning": "GENEPIO:0100119",
          "is_a": "Illumina HiSeq [GENEPIO:0100110]"
        },
        "Illumina iSeq [GENEPIO:0100120]": {
          "text": "Illumina iSeq [GENEPIO:0100120]",
          "meaning": "GENEPIO:0100120",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina iSeq 100 [GENEPIO:0100121]": {
          "text": "Illumina iSeq 100 [GENEPIO:0100121]",
          "meaning": "GENEPIO:0100121",
          "is_a": "Illumina iSeq [GENEPIO:0100120]"
        },
        "Illumina NovaSeq [GENEPIO:0100122]": {
          "text": "Illumina NovaSeq [GENEPIO:0100122]",
          "meaning": "GENEPIO:0100122",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina NovaSeq 6000 [GENEPIO:0100123]": {
          "text": "Illumina NovaSeq 6000 [GENEPIO:0100123]",
          "meaning": "GENEPIO:0100123",
          "is_a": "Illumina NovaSeq [GENEPIO:0100122]"
        },
        "Illumina MiniSeq [GENEPIO:0100124]": {
          "text": "Illumina MiniSeq [GENEPIO:0100124]",
          "meaning": "GENEPIO:0100124",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina MiSeq [GENEPIO:0100125]": {
          "text": "Illumina MiSeq [GENEPIO:0100125]",
          "meaning": "GENEPIO:0100125",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina NextSeq [GENEPIO:0100126]": {
          "text": "Illumina NextSeq [GENEPIO:0100126]",
          "meaning": "GENEPIO:0100126",
          "is_a": "Illumina [GENEPIO:0100105]"
        },
        "Illumina NextSeq 500 [GENEPIO:0100127]": {
          "text": "Illumina NextSeq 500 [GENEPIO:0100127]",
          "meaning": "GENEPIO:0100127",
          "is_a": "Illumina NextSeq [GENEPIO:0100126]"
        },
        "Illumina NextSeq 550 [GENEPIO:0100128]": {
          "text": "Illumina NextSeq 550 [GENEPIO:0100128]",
          "meaning": "GENEPIO:0100128",
          "is_a": "Illumina NextSeq [GENEPIO:0100126]"
        },
        "Illumina NextSeq 2000 [GENEPIO:0100129]": {
          "text": "Illumina NextSeq 2000 [GENEPIO:0100129]",
          "meaning": "GENEPIO:0100129",
          "is_a": "Illumina NextSeq [GENEPIO:0100126]"
        },
        "Pacific Biosciences [GENEPIO:0100130]": {
          "text": "Pacific Biosciences [GENEPIO:0100130]",
          "meaning": "GENEPIO:0100130"
        },
        "PacBio RS [GENEPIO:0100131]": {
          "text": "PacBio RS [GENEPIO:0100131]",
          "meaning": "GENEPIO:0100131",
          "is_a": "Pacific Biosciences [GENEPIO:0100130]"
        },
        "PacBio RS II [GENEPIO:0100132]": {
          "text": "PacBio RS II [GENEPIO:0100132]",
          "meaning": "GENEPIO:0100132",
          "is_a": "Pacific Biosciences [GENEPIO:0100130]"
        },
        "PacBio Sequel [GENEPIO:0100133]": {
          "text": "PacBio Sequel [GENEPIO:0100133]",
          "meaning": "GENEPIO:0100133",
          "is_a": "Pacific Biosciences [GENEPIO:0100130]"
        },
        "PacBio Sequel II [GENEPIO:0100134]": {
          "text": "PacBio Sequel II [GENEPIO:0100134]",
          "meaning": "GENEPIO:0100134",
          "is_a": "Pacific Biosciences [GENEPIO:0100130]"
        },
        "Ion Torrent [GENEPIO:0100135": {
          "text": "Ion Torrent [GENEPIO:0100135",
          "meaning": "GENEPIO:0100135"
        },
        "Ion Torrent PGM [GENEPIO:0100136": {
          "text": "Ion Torrent PGM [GENEPIO:0100136",
          "meaning": "GENEPIO:0100136",
          "is_a": "Ion Torrent [GENEPIO:0100135"
        },
        "Ion Torrent Proton [GENEPIO:0100137]": {
          "text": "Ion Torrent Proton [GENEPIO:0100137]",
          "meaning": "GENEPIO:0100137",
          "is_a": "Ion Torrent [GENEPIO:0100135"
        },
        "Ion Torrent S5 XL [GENEPIO:0100138]": {
          "text": "Ion Torrent S5 XL [GENEPIO:0100138]",
          "meaning": "GENEPIO:0100138",
          "is_a": "Ion Torrent [GENEPIO:0100135"
        },
        "Ion Torrent S5 [GENEPIO:0100139]": {
          "text": "Ion Torrent S5 [GENEPIO:0100139]",
          "meaning": "GENEPIO:0100139",
          "is_a": "Ion Torrent [GENEPIO:0100135"
        },
        "Oxford Nanopore [GENEPIO:0100140]": {
          "text": "Oxford Nanopore [GENEPIO:0100140]",
          "meaning": "GENEPIO:0100140"
        },
        "Oxford Nanopore GridION [GENEPIO:0100141": {
          "text": "Oxford Nanopore GridION [GENEPIO:0100141",
          "meaning": "GENEPIO:0100141",
          "is_a": "Oxford Nanopore [GENEPIO:0100140]"
        },
        "Oxford Nanopore MinION [GENEPIO:0100142]": {
          "text": "Oxford Nanopore MinION [GENEPIO:0100142]",
          "meaning": "GENEPIO:0100142",
          "is_a": "Oxford Nanopore [GENEPIO:0100140]"
        },
        "Oxford Nanopore PromethION [GENEPIO:0100143]": {
          "text": "Oxford Nanopore PromethION [GENEPIO:0100143]",
          "meaning": "GENEPIO:0100143",
          "is_a": "Oxford Nanopore [GENEPIO:0100140]"
        },
        "BGI Genomics [GENEPIO:0100144]": {
          "text": "BGI Genomics [GENEPIO:0100144]",
          "meaning": "GENEPIO:0100144"
        },
        "BGI Genomics BGISEQ-500 [GENEPIO:0100145]": {
          "text": "BGI Genomics BGISEQ-500 [GENEPIO:0100145]",
          "meaning": "GENEPIO:0100145",
          "is_a": "BGI Genomics [GENEPIO:0100144]"
        },
        "MGI [GENEPIO:0100146]": {
          "text": "MGI [GENEPIO:0100146]",
          "meaning": "GENEPIO:0100146"
        },
        "MGI DNBSEQ-T7 [GENEPIO:0100147]": {
          "text": "MGI DNBSEQ-T7 [GENEPIO:0100147]",
          "meaning": "GENEPIO:0100147",
          "is_a": "MGI [GENEPIO:0100146]"
        },
        "MGI DNBSEQ-G400 [GENEPIO:0100148]": {
          "text": "MGI DNBSEQ-G400 [GENEPIO:0100148]",
          "meaning": "GENEPIO:0100148",
          "is_a": "MGI [GENEPIO:0100146]"
        },
        "MGI DNBSEQ-G400 FAST [GENEPIO:0100149]": {
          "text": "MGI DNBSEQ-G400 FAST [GENEPIO:0100149]",
          "meaning": "GENEPIO:0100149",
          "is_a": "MGI [GENEPIO:0100146]"
        },
        "MGI DNBSEQ-G50 [GENEPIO:0100150]": {
          "text": "MGI DNBSEQ-G50 [GENEPIO:0100150]",
          "meaning": "GENEPIO:0100150",
          "is_a": "MGI [GENEPIO:0100146]"
        }
      }
    },
    "sequence submitted by menu": {
      "name": "sequence submitted by menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Alberta Precision Labs (APL)": {
          "text": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab North (APLN)": {
          "text": "Alberta ProvLab North (APLN)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab South (APLS)": {
          "text": "Alberta ProvLab South (APLS)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "BCCDC Public Health Laboratory": {
          "text": "BCCDC Public Health Laboratory"
        },
        "Canadore College": {
          "text": "Canadore College"
        },
        "The Centre for Applied Genomics (TCAG)": {
          "text": "The Centre for Applied Genomics (TCAG)"
        },
        "Dynacare": {
          "text": "Dynacare"
        },
        "Dynacare (Brampton)": {
          "text": "Dynacare (Brampton)"
        },
        "Dynacare (Manitoba)": {
          "text": "Dynacare (Manitoba)"
        },
        "The Hospital for Sick Children (SickKids)": {
          "text": "The Hospital for Sick Children (SickKids)"
        },
        "Laboratoire de santé publique du Québec (LSPQ)": {
          "text": "Laboratoire de santé publique du Québec (LSPQ)"
        },
        "Manitoba Cadham Provincial Laboratory": {
          "text": "Manitoba Cadham Provincial Laboratory"
        },
        "McGill University": {
          "text": "McGill University"
        },
        "McMaster University": {
          "text": "McMaster University"
        },
        "National Microbiology Laboratory (NML)": {
          "text": "National Microbiology Laboratory (NML)"
        },
        "New Brunswick - Vitalité Health Network": {
          "text": "New Brunswick - Vitalité Health Network"
        },
        "Newfoundland and Labrador - Eastern Health": {
          "text": "Newfoundland and Labrador - Eastern Health"
        },
        "Nova Scotia Health Authority": {
          "text": "Nova Scotia Health Authority"
        },
        "Ontario Institute for Cancer Research (OICR)": {
          "text": "Ontario Institute for Cancer Research (OICR)"
        },
        "Prince Edward Island - Health PEI": {
          "text": "Prince Edward Island - Health PEI"
        },
        "Public Health Ontario (PHO)": {
          "text": "Public Health Ontario (PHO)"
        },
        "Queen's University / Kingston Health Sciences Centre": {
          "text": "Queen's University / Kingston Health Sciences Centre"
        },
        "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {
          "text": "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)"
        },
        "Sunnybrook Health Sciences Centre": {
          "text": "Sunnybrook Health Sciences Centre"
        },
        "Thunder Bay Regional Health Sciences Centre": {
          "text": "Thunder Bay Regional Health Sciences Centre"
        }
      }
    },
    "sequenced by menu": {
      "name": "sequenced by menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Alberta Precision Labs (APL)": {
          "text": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab North (APLN)": {
          "text": "Alberta ProvLab North (APLN)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab South (APLS)": {
          "text": "Alberta ProvLab South (APLS)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "BCCDC Public Health Laboratory": {
          "text": "BCCDC Public Health Laboratory"
        },
        "Canadore College": {
          "text": "Canadore College"
        },
        "The Centre for Applied Genomics (TCAG)": {
          "text": "The Centre for Applied Genomics (TCAG)"
        },
        "Dynacare": {
          "text": "Dynacare"
        },
        "Dynacare (Brampton)": {
          "text": "Dynacare (Brampton)"
        },
        "Dynacare (Manitoba)": {
          "text": "Dynacare (Manitoba)"
        },
        "The Hospital for Sick Children (SickKids)": {
          "text": "The Hospital for Sick Children (SickKids)"
        },
        "Laboratoire de santé publique du Québec (LSPQ)": {
          "text": "Laboratoire de santé publique du Québec (LSPQ)"
        },
        "Manitoba Cadham Provincial Laboratory": {
          "text": "Manitoba Cadham Provincial Laboratory"
        },
        "McGill University": {
          "text": "McGill University"
        },
        "McMaster University": {
          "text": "McMaster University"
        },
        "National Microbiology Laboratory (NML)": {
          "text": "National Microbiology Laboratory (NML)"
        },
        "New Brunswick - Vitalité Health Network": {
          "text": "New Brunswick - Vitalité Health Network"
        },
        "Newfoundland and Labrador - Eastern Health": {
          "text": "Newfoundland and Labrador - Eastern Health"
        },
        "Nova Scotia Health Authority": {
          "text": "Nova Scotia Health Authority"
        },
        "Ontario Institute for Cancer Research (OICR)": {
          "text": "Ontario Institute for Cancer Research (OICR)"
        },
        "Prince Edward Island - Health PEI": {
          "text": "Prince Edward Island - Health PEI"
        },
        "Public Health Ontario (PHO)": {
          "text": "Public Health Ontario (PHO)"
        },
        "Queen's University / Kingston Health Sciences Centre": {
          "text": "Queen's University / Kingston Health Sciences Centre"
        },
        "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {
          "text": "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)"
        },
        "Sunnybrook Health Sciences Centre": {
          "text": "Sunnybrook Health Sciences Centre"
        },
        "Thunder Bay Regional Health Sciences Centre": {
          "text": "Thunder Bay Regional Health Sciences Centre"
        }
      }
    },
    "sample collected by menu": {
      "name": "sample collected by menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Alberta Precision Labs (APL)": {
          "text": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab North (APLN)": {
          "text": "Alberta ProvLab North (APLN)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "Alberta ProvLab South (APLS)": {
          "text": "Alberta ProvLab South (APLS)",
          "is_a": "Alberta Precision Labs (APL)"
        },
        "BCCDC Public Health Laboratory": {
          "text": "BCCDC Public Health Laboratory"
        },
        "Dynacare": {
          "text": "Dynacare"
        },
        "Dynacare (Manitoba)": {
          "text": "Dynacare (Manitoba)"
        },
        "Dynacare (Brampton)": {
          "text": "Dynacare (Brampton)"
        },
        "Eastern Ontario Regional Laboratory Association": {
          "text": "Eastern Ontario Regional Laboratory Association"
        },
        "Hamilton Health Sciences": {
          "text": "Hamilton Health Sciences"
        },
        "The Hospital for Sick Children (SickKids)": {
          "text": "The Hospital for Sick Children (SickKids)"
        },
        "Laboratoire de santé publique du Québec (LSPQ)": {
          "text": "Laboratoire de santé publique du Québec (LSPQ)"
        },
        "Lake of the Woods District Hospital - Ontario": {
          "text": "Lake of the Woods District Hospital - Ontario"
        },
        "LifeLabs": {
          "text": "LifeLabs"
        },
        "LifeLabs (Ontario)": {
          "text": "LifeLabs (Ontario)"
        },
        "Manitoba Cadham Provincial Laboratory": {
          "text": "Manitoba Cadham Provincial Laboratory"
        },
        "McMaster University": {
          "text": "McMaster University"
        },
        "Mount Sinai Hospital": {
          "text": "Mount Sinai Hospital"
        },
        "National Microbiology Laboratory (NML)": {
          "text": "National Microbiology Laboratory (NML)"
        },
        "New Brunswick - Vitalité Health Network": {
          "text": "New Brunswick - Vitalité Health Network"
        },
        "Newfoundland and Labrador - Eastern Health": {
          "text": "Newfoundland and Labrador - Eastern Health"
        },
        "Nova Scotia Health Authority": {
          "text": "Nova Scotia Health Authority"
        },
        "Nunavut": {
          "text": "Nunavut"
        },
        "Ontario Institute for Cancer Research (OICR)": {
          "text": "Ontario Institute for Cancer Research (OICR)"
        },
        "Prince Edward Island - Health PEI": {
          "text": "Prince Edward Island - Health PEI"
        },
        "Public Health Ontario (PHO)": {
          "text": "Public Health Ontario (PHO)"
        },
        "Queen's University / Kingston Health Sciences Centre": {
          "text": "Queen's University / Kingston Health Sciences Centre"
        },
        "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)": {
          "text": "Saskatchewan - Roy Romanow Provincial Laboratory (RRPL)"
        },
        "Shared Hospital Laboratory": {
          "text": "Shared Hospital Laboratory"
        },
        "St. John's Rehab at Sunnybrook Hospital": {
          "text": "St. John's Rehab at Sunnybrook Hospital"
        },
        "Switch Health": {
          "text": "Switch Health"
        },
        "Sunnybrook Health Sciences Centre": {
          "text": "Sunnybrook Health Sciences Centre"
        },
        "Unity Health Toronto": {
          "text": "Unity Health Toronto"
        },
        "William Osler Health System": {
          "text": "William Osler Health System"
        }
      }
    },
    "geo_loc_name (country) menu": {
      "name": "geo_loc_name (country) menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Afghanistan": {
          "text": "Afghanistan",
          "meaning": "GAZ:00006882"
        },
        "Albania": {
          "text": "Albania",
          "meaning": "GAZ:00002953"
        },
        "Algeria": {
          "text": "Algeria",
          "meaning": "GAZ:00000563"
        },
        "American Samoa": {
          "text": "American Samoa",
          "meaning": "GAZ:00003957"
        },
        "Andorra": {
          "text": "Andorra",
          "meaning": "GAZ:00002948"
        },
        "Angola": {
          "text": "Angola",
          "meaning": "GAZ:00001095"
        },
        "Anguilla": {
          "text": "Anguilla",
          "meaning": "GAZ:00009159"
        },
        "Antarctica": {
          "text": "Antarctica",
          "meaning": "GAZ:00000462"
        },
        "Antigua and Barbuda": {
          "text": "Antigua and Barbuda",
          "meaning": "GAZ:00006883"
        },
        "Argentina": {
          "text": "Argentina",
          "meaning": "GAZ:00002928"
        },
        "Armenia": {
          "text": "Armenia",
          "meaning": "GAZ:00004094"
        },
        "Aruba": {
          "text": "Aruba",
          "meaning": "GAZ:00004025"
        },
        "Ashmore and Cartier Islands": {
          "text": "Ashmore and Cartier Islands",
          "meaning": "GAZ:00005901"
        },
        "Australia": {
          "text": "Australia",
          "meaning": "GAZ:00000463"
        },
        "Austria": {
          "text": "Austria",
          "meaning": "GAZ:00002942"
        },
        "Azerbaijan": {
          "text": "Azerbaijan",
          "meaning": "GAZ:00004941"
        },
        "Bahamas": {
          "text": "Bahamas",
          "meaning": "GAZ:00002733"
        },
        "Bahrain": {
          "text": "Bahrain",
          "meaning": "GAZ:00005281"
        },
        "Baker Island": {
          "text": "Baker Island",
          "meaning": "GAZ:00007117"
        },
        "Bangladesh": {
          "text": "Bangladesh",
          "meaning": "GAZ:00003750"
        },
        "Barbados": {
          "text": "Barbados",
          "meaning": "GAZ:00001251"
        },
        "Bassas da India": {
          "text": "Bassas da India",
          "meaning": "GAZ:00005810"
        },
        "Belarus": {
          "text": "Belarus",
          "meaning": "GAZ:00006886"
        },
        "Belgium": {
          "text": "Belgium",
          "meaning": "GAZ:00002938"
        },
        "Belize": {
          "text": "Belize",
          "meaning": "GAZ:00002934"
        },
        "Benin": {
          "text": "Benin",
          "meaning": "GAZ:00000904"
        },
        "Bermuda": {
          "text": "Bermuda",
          "meaning": "GAZ:00001264"
        },
        "Bhutan": {
          "text": "Bhutan",
          "meaning": "GAZ:00003920"
        },
        "Bolivia": {
          "text": "Bolivia",
          "meaning": "GAZ:00002511"
        },
        "Borneo": {
          "text": "Borneo",
          "meaning": "GAZ:00025355"
        },
        "Bosnia and Herzegovina": {
          "text": "Bosnia and Herzegovina",
          "meaning": "GAZ:00006887"
        },
        "Botswana": {
          "text": "Botswana",
          "meaning": "GAZ:00001097"
        },
        "Bouvet Island": {
          "text": "Bouvet Island",
          "meaning": "GAZ:00001453"
        },
        "Brazil": {
          "text": "Brazil",
          "meaning": "GAZ:00002828"
        },
        "British Virgin Islands": {
          "text": "British Virgin Islands",
          "meaning": "GAZ:00003961"
        },
        "Brunei": {
          "text": "Brunei",
          "meaning": "GAZ:00003901"
        },
        "Bulgaria": {
          "text": "Bulgaria",
          "meaning": "GAZ:00002950"
        },
        "Burkina Faso": {
          "text": "Burkina Faso",
          "meaning": "GAZ:00000905"
        },
        "Burundi": {
          "text": "Burundi",
          "meaning": "GAZ:00001090"
        },
        "Cambodia": {
          "text": "Cambodia",
          "meaning": "GAZ:00006888"
        },
        "Cameroon": {
          "text": "Cameroon",
          "meaning": "GAZ:00001093"
        },
        "Canada": {
          "text": "Canada",
          "meaning": "GAZ:00002560"
        },
        "Cape Verde": {
          "text": "Cape Verde",
          "meaning": "GAZ:00001227"
        },
        "Cayman Islands": {
          "text": "Cayman Islands",
          "meaning": "GAZ:00003986"
        },
        "Central African Republic": {
          "text": "Central African Republic",
          "meaning": "GAZ:00001089"
        },
        "Chad": {
          "text": "Chad",
          "meaning": "GAZ:00000586"
        },
        "Chile": {
          "text": "Chile",
          "meaning": "GAZ:00002825"
        },
        "China": {
          "text": "China",
          "meaning": "GAZ:00002845"
        },
        "Christmas Island": {
          "text": "Christmas Island",
          "meaning": "GAZ:00005915"
        },
        "Clipperton Island": {
          "text": "Clipperton Island",
          "meaning": "GAZ:00005838"
        },
        "Cocos Islands": {
          "text": "Cocos Islands",
          "meaning": "GAZ:00009721"
        },
        "Colombia": {
          "text": "Colombia",
          "meaning": "GAZ:00002929"
        },
        "Comoros": {
          "text": "Comoros",
          "meaning": "GAZ:00005820"
        },
        "Cook Islands": {
          "text": "Cook Islands",
          "meaning": "GAZ:00053798"
        },
        "Coral Sea Islands": {
          "text": "Coral Sea Islands",
          "meaning": "GAZ:00005917"
        },
        "Costa Rica": {
          "text": "Costa Rica",
          "meaning": "GAZ:00002901"
        },
        "Cote d'Ivoire": {
          "text": "Cote d'Ivoire",
          "meaning": "GAZ:00000906"
        },
        "Croatia": {
          "text": "Croatia",
          "meaning": "GAZ:00002719"
        },
        "Cuba": {
          "text": "Cuba",
          "meaning": "GAZ:00003762"
        },
        "Curacao": {
          "text": "Curacao",
          "meaning": "GAZ:00012582"
        },
        "Cyprus": {
          "text": "Cyprus",
          "meaning": "GAZ:00004006"
        },
        "Czech Republic": {
          "text": "Czech Republic",
          "meaning": "GAZ:00002954"
        },
        "Democratic Republic of the Congo": {
          "text": "Democratic Republic of the Congo",
          "meaning": "GAZ:00001086"
        },
        "Denmark": {
          "text": "Denmark",
          "meaning": "GAZ:00005852"
        },
        "Djibouti": {
          "text": "Djibouti",
          "meaning": "GAZ:00000582"
        },
        "Dominica": {
          "text": "Dominica",
          "meaning": "GAZ:00006890"
        },
        "Dominican Republic": {
          "text": "Dominican Republic",
          "meaning": "GAZ:00003952"
        },
        "Ecuador": {
          "text": "Ecuador",
          "meaning": "GAZ:00002912"
        },
        "Egypt": {
          "text": "Egypt",
          "meaning": "GAZ:00003934"
        },
        "El Salvador": {
          "text": "El Salvador",
          "meaning": "GAZ:00002935"
        },
        "Equatorial Guinea": {
          "text": "Equatorial Guinea",
          "meaning": "GAZ:00001091"
        },
        "Eritrea": {
          "text": "Eritrea",
          "meaning": "GAZ:00000581"
        },
        "Estonia": {
          "text": "Estonia",
          "meaning": "GAZ:00002959"
        },
        "Eswatini": {
          "text": "Eswatini",
          "meaning": "GAZ:00001099"
        },
        "Ethiopia": {
          "text": "Ethiopia",
          "meaning": "GAZ:00000567"
        },
        "Europa Island": {
          "text": "Europa Island",
          "meaning": "GAZ:00005811"
        },
        "Falkland Islands (Islas Malvinas)": {
          "text": "Falkland Islands (Islas Malvinas)",
          "meaning": "GAZ:00001412"
        },
        "Faroe Islands": {
          "text": "Faroe Islands",
          "meaning": "GAZ:00059206"
        },
        "Fiji": {
          "text": "Fiji",
          "meaning": "GAZ:00006891"
        },
        "Finland": {
          "text": "Finland",
          "meaning": "GAZ:00002937"
        },
        "France": {
          "text": "France",
          "meaning": "GAZ:00003940"
        },
        "French Guiana": {
          "text": "French Guiana",
          "meaning": "GAZ:00002516"
        },
        "French Polynesia": {
          "text": "French Polynesia",
          "meaning": "GAZ:00002918"
        },
        "French Southern and Antarctic Lands": {
          "text": "French Southern and Antarctic Lands",
          "meaning": "GAZ:00003753"
        },
        "Gabon": {
          "text": "Gabon",
          "meaning": "GAZ:00001092"
        },
        "Gambia": {
          "text": "Gambia",
          "meaning": "GAZ:00000907"
        },
        "Gaza Strip": {
          "text": "Gaza Strip",
          "meaning": "GAZ:00009571"
        },
        "Georgia": {
          "text": "Georgia",
          "meaning": "GAZ:00004942"
        },
        "Germany": {
          "text": "Germany",
          "meaning": "GAZ:00002646"
        },
        "Ghana": {
          "text": "Ghana",
          "meaning": "GAZ:00000908"
        },
        "Gibraltar": {
          "text": "Gibraltar",
          "meaning": "GAZ:00003987"
        },
        "Glorioso Islands": {
          "text": "Glorioso Islands",
          "meaning": "GAZ:00005808"
        },
        "Greece": {
          "text": "Greece",
          "meaning": "GAZ:00002945"
        },
        "Greenland": {
          "text": "Greenland",
          "meaning": "GAZ:00001507"
        },
        "Grenada": {
          "text": "Grenada",
          "meaning": "GAZ:02000573"
        },
        "Guadeloupe": {
          "text": "Guadeloupe",
          "meaning": "GAZ:00067142"
        },
        "Guam": {
          "text": "Guam",
          "meaning": "GAZ:00003706"
        },
        "Guatemala": {
          "text": "Guatemala",
          "meaning": "GAZ:00002936"
        },
        "Guernsey": {
          "text": "Guernsey",
          "meaning": "GAZ:00001550"
        },
        "Guinea": {
          "text": "Guinea",
          "meaning": "GAZ:00000909"
        },
        "Guinea-Bissau": {
          "text": "Guinea-Bissau",
          "meaning": "GAZ:00000910"
        },
        "Guyana": {
          "text": "Guyana",
          "meaning": "GAZ:00002522"
        },
        "Haiti": {
          "text": "Haiti",
          "meaning": "GAZ:00003953"
        },
        "Heard Island and McDonald Islands": {
          "text": "Heard Island and McDonald Islands",
          "meaning": "GAZ:00009718"
        },
        "Honduras": {
          "text": "Honduras",
          "meaning": "GAZ:00002894"
        },
        "Hong Kong": {
          "text": "Hong Kong",
          "meaning": "GAZ:00003203"
        },
        "Howland Island": {
          "text": "Howland Island",
          "meaning": "GAZ:00007120"
        },
        "Hungary": {
          "text": "Hungary",
          "meaning": "GAZ:00002952"
        },
        "Iceland": {
          "text": "Iceland",
          "meaning": "GAZ:00000843"
        },
        "India": {
          "text": "India",
          "meaning": "GAZ:00002839"
        },
        "Indonesia": {
          "text": "Indonesia",
          "meaning": "GAZ:00003727"
        },
        "Iran": {
          "text": "Iran",
          "meaning": "GAZ:00004474"
        },
        "Iraq": {
          "text": "Iraq",
          "meaning": "GAZ:00004483"
        },
        "Ireland": {
          "text": "Ireland",
          "meaning": "GAZ:00002943"
        },
        "Isle of Man": {
          "text": "Isle of Man",
          "meaning": "GAZ:00052477"
        },
        "Israel": {
          "text": "Israel",
          "meaning": "GAZ:00002476"
        },
        "Italy": {
          "text": "Italy",
          "meaning": "GAZ:00002650"
        },
        "Jamaica": {
          "text": "Jamaica",
          "meaning": "GAZ:00003781"
        },
        "Jan Mayen": {
          "text": "Jan Mayen",
          "meaning": "GAZ:00005853"
        },
        "Japan": {
          "text": "Japan",
          "meaning": "GAZ:00002747"
        },
        "Jarvis Island": {
          "text": "Jarvis Island",
          "meaning": "GAZ:00007118"
        },
        "Jersey": {
          "text": "Jersey",
          "meaning": "GAZ:00001551"
        },
        "Johnston Atoll": {
          "text": "Johnston Atoll",
          "meaning": "GAZ:00007114"
        },
        "Jordan": {
          "text": "Jordan",
          "meaning": "GAZ:00002473"
        },
        "Juan de Nova Island": {
          "text": "Juan de Nova Island",
          "meaning": "GAZ:00005809"
        },
        "Kazakhstan": {
          "text": "Kazakhstan",
          "meaning": "GAZ:00004999"
        },
        "Kenya": {
          "text": "Kenya",
          "meaning": "GAZ:00001101"
        },
        "Kerguelen Archipelago": {
          "text": "Kerguelen Archipelago",
          "meaning": "GAZ:00005682"
        },
        "Kingman Reef": {
          "text": "Kingman Reef",
          "meaning": "GAZ:00007116"
        },
        "Kiribati": {
          "text": "Kiribati",
          "meaning": "GAZ:00006894"
        },
        "Kosovo": {
          "text": "Kosovo",
          "meaning": "GAZ:00011337"
        },
        "Kuwait": {
          "text": "Kuwait",
          "meaning": "GAZ:00005285"
        },
        "Kyrgyzstan": {
          "text": "Kyrgyzstan",
          "meaning": "GAZ:00006893"
        },
        "Laos": {
          "text": "Laos",
          "meaning": "GAZ:00006889"
        },
        "Latvia": {
          "text": "Latvia",
          "meaning": "GAZ:00002958"
        },
        "Lebanon": {
          "text": "Lebanon",
          "meaning": "GAZ:00002478"
        },
        "Lesotho": {
          "text": "Lesotho",
          "meaning": "GAZ:00001098"
        },
        "Liberia": {
          "text": "Liberia",
          "meaning": "GAZ:00000911"
        },
        "Libya": {
          "text": "Libya",
          "meaning": "GAZ:00000566"
        },
        "Liechtenstein": {
          "text": "Liechtenstein",
          "meaning": "GAZ:00003858"
        },
        "Line Islands": {
          "text": "Line Islands",
          "meaning": "GAZ:00007144"
        },
        "Lithuania": {
          "text": "Lithuania",
          "meaning": "GAZ:00002960"
        },
        "Luxembourg": {
          "text": "Luxembourg",
          "meaning": "GAZ:00002947"
        },
        "Macau": {
          "text": "Macau",
          "meaning": "GAZ:00003202"
        },
        "Madagascar": {
          "text": "Madagascar",
          "meaning": "GAZ:00001108"
        },
        "Malawi": {
          "text": "Malawi",
          "meaning": "GAZ:00001105"
        },
        "Malaysia": {
          "text": "Malaysia",
          "meaning": "GAZ:00003902"
        },
        "Maldives": {
          "text": "Maldives",
          "meaning": "GAZ:00006924"
        },
        "Mali": {
          "text": "Mali",
          "meaning": "GAZ:00000584"
        },
        "Malta": {
          "text": "Malta",
          "meaning": "GAZ:00004017"
        },
        "Marshall Islands": {
          "text": "Marshall Islands",
          "meaning": "GAZ:00007161"
        },
        "Martinique": {
          "text": "Martinique",
          "meaning": "GAZ:00067143"
        },
        "Mauritania": {
          "text": "Mauritania",
          "meaning": "GAZ:00000583"
        },
        "Mauritius": {
          "text": "Mauritius",
          "meaning": "GAZ:00003745"
        },
        "Mayotte": {
          "text": "Mayotte",
          "meaning": "GAZ:00003943"
        },
        "Mexico": {
          "text": "Mexico",
          "meaning": "GAZ:00002852"
        },
        "Micronesia": {
          "text": "Micronesia",
          "meaning": "GAZ:00005862"
        },
        "Midway Islands": {
          "text": "Midway Islands",
          "meaning": "GAZ:00007112"
        },
        "Moldova": {
          "text": "Moldova",
          "meaning": "GAZ:00003897"
        },
        "Monaco": {
          "text": "Monaco",
          "meaning": "GAZ:00003857"
        },
        "Mongolia": {
          "text": "Mongolia",
          "meaning": "GAZ:00008744"
        },
        "Montenegro": {
          "text": "Montenegro",
          "meaning": "GAZ:00006898"
        },
        "Montserrat": {
          "text": "Montserrat",
          "meaning": "GAZ:00003988"
        },
        "Morocco": {
          "text": "Morocco",
          "meaning": "GAZ:00000565"
        },
        "Mozambique": {
          "text": "Mozambique",
          "meaning": "GAZ:00001100"
        },
        "Myanmar": {
          "text": "Myanmar",
          "meaning": "GAZ:00006899"
        },
        "Namibia": {
          "text": "Namibia",
          "meaning": "GAZ:00001096"
        },
        "Nauru": {
          "text": "Nauru",
          "meaning": "GAZ:00006900"
        },
        "Navassa Island": {
          "text": "Navassa Island",
          "meaning": "GAZ:00007119"
        },
        "Nepal": {
          "text": "Nepal",
          "meaning": "GAZ:00004399"
        },
        "Netherlands": {
          "text": "Netherlands",
          "meaning": "GAZ:00002946"
        },
        "New Caledonia": {
          "text": "New Caledonia",
          "meaning": "GAZ:00005206"
        },
        "New Zealand": {
          "text": "New Zealand",
          "meaning": "GAZ:00000469"
        },
        "Nicaragua": {
          "text": "Nicaragua",
          "meaning": "GAZ:00002978"
        },
        "Niger": {
          "text": "Niger",
          "meaning": "GAZ:00000585"
        },
        "Nigeria": {
          "text": "Nigeria",
          "meaning": "GAZ:00000912"
        },
        "Niue": {
          "text": "Niue",
          "meaning": "GAZ:00006902"
        },
        "Norfolk Island": {
          "text": "Norfolk Island",
          "meaning": "GAZ:00005908"
        },
        "North Korea": {
          "text": "North Korea",
          "meaning": "GAZ:00002801"
        },
        "North Macedonia": {
          "text": "North Macedonia",
          "meaning": "GAZ:00006895"
        },
        "North Sea": {
          "text": "North Sea",
          "meaning": "GAZ:00002284"
        },
        "Northern Mariana Islands": {
          "text": "Northern Mariana Islands",
          "meaning": "GAZ:00003958"
        },
        "Norway": {
          "text": "Norway",
          "meaning": "GAZ:00002699"
        },
        "Oman": {
          "text": "Oman",
          "meaning": "GAZ:00005283"
        },
        "Pakistan": {
          "text": "Pakistan",
          "meaning": "GAZ:00005246"
        },
        "Palau": {
          "text": "Palau",
          "meaning": "GAZ:00006905"
        },
        "Panama": {
          "text": "Panama",
          "meaning": "GAZ:00002892"
        },
        "Papua New Guinea": {
          "text": "Papua New Guinea",
          "meaning": "GAZ:00003922"
        },
        "Paracel Islands": {
          "text": "Paracel Islands",
          "meaning": "GAZ:00010832"
        },
        "Paraguay": {
          "text": "Paraguay",
          "meaning": "GAZ:00002933"
        },
        "Peru": {
          "text": "Peru",
          "meaning": "GAZ:00002932"
        },
        "Philippines": {
          "text": "Philippines",
          "meaning": "GAZ:00004525"
        },
        "Pitcairn Islands": {
          "text": "Pitcairn Islands",
          "meaning": "GAZ:00005867"
        },
        "Poland": {
          "text": "Poland",
          "meaning": "GAZ:00002939"
        },
        "Portugal": {
          "text": "Portugal",
          "meaning": "GAZ:00004126"
        },
        "Puerto Rico": {
          "text": "Puerto Rico",
          "meaning": "GAZ:00006935"
        },
        "Qatar": {
          "text": "Qatar",
          "meaning": "GAZ:00005286"
        },
        "Republic of the Congo": {
          "text": "Republic of the Congo",
          "meaning": "GAZ:00001088"
        },
        "Reunion": {
          "text": "Reunion",
          "meaning": "GAZ:00003945"
        },
        "Romania": {
          "text": "Romania",
          "meaning": "GAZ:00002951"
        },
        "Ross Sea": {
          "text": "Ross Sea",
          "meaning": "GAZ:00023304"
        },
        "Russia": {
          "text": "Russia",
          "meaning": "GAZ:00002721"
        },
        "Rwanda": {
          "text": "Rwanda",
          "meaning": "GAZ:00001087"
        },
        "Saint Helena": {
          "text": "Saint Helena",
          "meaning": "GAZ:00000849"
        },
        "Saint Kitts and Nevis": {
          "text": "Saint Kitts and Nevis",
          "meaning": "GAZ:00006906"
        },
        "Saint Lucia": {
          "text": "Saint Lucia",
          "meaning": "GAZ:00006909"
        },
        "Saint Pierre and Miquelon": {
          "text": "Saint Pierre and Miquelon",
          "meaning": "GAZ:00003942"
        },
        "Saint Martin": {
          "text": "Saint Martin",
          "meaning": "GAZ:00005841"
        },
        "Saint Vincent and the Grenadines": {
          "text": "Saint Vincent and the Grenadines",
          "meaning": "GAZ:02000565"
        },
        "Samoa": {
          "text": "Samoa",
          "meaning": "GAZ:00006910"
        },
        "San Marino": {
          "text": "San Marino",
          "meaning": "GAZ:00003102"
        },
        "Sao Tome and Principe": {
          "text": "Sao Tome and Principe",
          "meaning": "GAZ:00006927"
        },
        "Saudi Arabia": {
          "text": "Saudi Arabia",
          "meaning": "GAZ:00005279"
        },
        "Senegal": {
          "text": "Senegal",
          "meaning": "GAZ:00000913"
        },
        "Serbia": {
          "text": "Serbia",
          "meaning": "GAZ:00002957"
        },
        "Seychelles": {
          "text": "Seychelles",
          "meaning": "GAZ:00006922"
        },
        "Sierra Leone": {
          "text": "Sierra Leone",
          "meaning": "GAZ:00000914"
        },
        "Singapore": {
          "text": "Singapore",
          "meaning": "GAZ:00003923"
        },
        "Sint Maarten": {
          "text": "Sint Maarten",
          "meaning": "GAZ:00012579"
        },
        "Slovakia": {
          "text": "Slovakia",
          "meaning": "GAZ:00002956"
        },
        "Slovenia": {
          "text": "Slovenia",
          "meaning": "GAZ:00002955"
        },
        "Solomon Islands": {
          "text": "Solomon Islands",
          "meaning": "GAZ:00005275"
        },
        "Somalia": {
          "text": "Somalia",
          "meaning": "GAZ:00001104"
        },
        "South Africa": {
          "text": "South Africa",
          "meaning": "GAZ:00001094"
        },
        "South Georgia and the South Sandwich Islands": {
          "text": "South Georgia and the South Sandwich Islands",
          "meaning": "GAZ:00003990"
        },
        "South Korea": {
          "text": "South Korea",
          "meaning": "GAZ:00002802"
        },
        "South Sudan": {
          "text": "South Sudan",
          "meaning": "GAZ:00233439"
        },
        "Spain": {
          "text": "Spain",
          "meaning": "GAZ:00000591"
        },
        "Spratly Islands": {
          "text": "Spratly Islands",
          "meaning": "GAZ:00010831"
        },
        "Sri Lanka": {
          "text": "Sri Lanka",
          "meaning": "GAZ:00003924"
        },
        "State of Palestine": {
          "text": "State of Palestine",
          "meaning": "GAZ:00002475"
        },
        "Sudan": {
          "text": "Sudan",
          "meaning": "GAZ:00000560"
        },
        "Suriname": {
          "text": "Suriname",
          "meaning": "GAZ:00002525"
        },
        "Svalbard": {
          "text": "Svalbard",
          "meaning": "GAZ:00005396"
        },
        "Swaziland": {
          "text": "Swaziland",
          "meaning": "GAZ:00001099"
        },
        "Sweden": {
          "text": "Sweden",
          "meaning": "GAZ:00002729"
        },
        "Switzerland": {
          "text": "Switzerland",
          "meaning": "GAZ:00002941"
        },
        "Syria": {
          "text": "Syria",
          "meaning": "GAZ:00002474"
        },
        "Taiwan": {
          "text": "Taiwan",
          "meaning": "GAZ:00005341"
        },
        "Tajikistan": {
          "text": "Tajikistan",
          "meaning": "GAZ:00006912"
        },
        "Tanzania": {
          "text": "Tanzania",
          "meaning": "GAZ:00001103"
        },
        "Thailand": {
          "text": "Thailand",
          "meaning": "GAZ:00003744"
        },
        "Timor-Leste": {
          "text": "Timor-Leste",
          "meaning": "GAZ:00006913"
        },
        "Togo": {
          "text": "Togo",
          "meaning": "GAZ:00000915"
        },
        "Tokelau": {
          "text": "Tokelau",
          "meaning": "GAZ:00260188"
        },
        "Tonga": {
          "text": "Tonga",
          "meaning": "GAZ:00006916"
        },
        "Trinidad and Tobago": {
          "text": "Trinidad and Tobago",
          "meaning": "GAZ:00003767"
        },
        "Tromelin Island": {
          "text": "Tromelin Island",
          "meaning": "GAZ:00005812"
        },
        "Tunisia": {
          "text": "Tunisia",
          "meaning": "GAZ:00000562"
        },
        "Turkey": {
          "text": "Turkey",
          "meaning": "GAZ:00000558"
        },
        "Turkmenistan": {
          "text": "Turkmenistan",
          "meaning": "GAZ:00005018"
        },
        "Turks and Caicos Islands": {
          "text": "Turks and Caicos Islands",
          "meaning": "GAZ:00003955"
        },
        "Tuvalu": {
          "text": "Tuvalu",
          "meaning": "GAZ:00009715"
        },
        "United States of America": {
          "text": "United States of America",
          "meaning": "GAZ:00002459"
        },
        "Uganda": {
          "text": "Uganda",
          "meaning": "GAZ:00001102"
        },
        "Ukraine": {
          "text": "Ukraine",
          "meaning": "GAZ:00002724"
        },
        "United Arab Emirates": {
          "text": "United Arab Emirates",
          "meaning": "GAZ:00005282"
        },
        "United Kingdom": {
          "text": "United Kingdom",
          "meaning": "GAZ:00002637"
        },
        "Uruguay": {
          "text": "Uruguay",
          "meaning": "GAZ:00002930"
        },
        "Uzbekistan": {
          "text": "Uzbekistan",
          "meaning": "GAZ:00004979"
        },
        "Vanuatu": {
          "text": "Vanuatu",
          "meaning": "GAZ:00006918"
        },
        "Venezuela": {
          "text": "Venezuela",
          "meaning": "GAZ:00002931"
        },
        "Viet Nam": {
          "text": "Viet Nam",
          "meaning": "GAZ:00003756"
        },
        "Virgin Islands": {
          "text": "Virgin Islands",
          "meaning": "GAZ:00003959"
        },
        "Wake Island": {
          "text": "Wake Island",
          "meaning": "GAZ:00007111"
        },
        "Wallis and Futuna": {
          "text": "Wallis and Futuna",
          "meaning": "GAZ:00007191"
        },
        "West Bank": {
          "text": "West Bank",
          "meaning": "GAZ:00009572"
        },
        "Western Sahara": {
          "text": "Western Sahara",
          "meaning": "GAZ:00000564"
        },
        "Yemen": {
          "text": "Yemen",
          "meaning": "GAZ:00005284"
        },
        "Zambia": {
          "text": "Zambia",
          "meaning": "GAZ:00001107"
        },
        "Zimbabwe": {
          "text": "Zimbabwe",
          "meaning": "GAZ:00001106"
        }
      }
    },
    "geo_loc_name (country) international menu": {
      "name": "geo_loc_name (country) international menu",
      "from_schema": "https://example.com/monkeypox",
      "permissible_values": {
        "Afghanistan [GAZ:00006882]": {
          "text": "Afghanistan [GAZ:00006882]",
          "meaning": "GAZ:00006882"
        },
        "Albania [GAZ:00002953]": {
          "text": "Albania [GAZ:00002953]",
          "meaning": "GAZ:00002953"
        },
        "Algeria [GAZ:00000563]": {
          "text": "Algeria [GAZ:00000563]",
          "meaning": "GAZ:00000563"
        },
        "American Samoa [GAZ:00003957]": {
          "text": "American Samoa [GAZ:00003957]",
          "meaning": "GAZ:00003957"
        },
        "Andorra [GAZ:00002948]": {
          "text": "Andorra [GAZ:00002948]",
          "meaning": "GAZ:00002948"
        },
        "Angola [GAZ:00001095]": {
          "text": "Angola [GAZ:00001095]",
          "meaning": "GAZ:00001095"
        },
        "Anguilla [GAZ:00009159]": {
          "text": "Anguilla [GAZ:00009159]",
          "meaning": "GAZ:00009159"
        },
        "Antarctica [GAZ:00000462]": {
          "text": "Antarctica [GAZ:00000462]",
          "meaning": "GAZ:00000462"
        },
        "Antigua and Barbuda [GAZ:00006883]": {
          "text": "Antigua and Barbuda [GAZ:00006883]",
          "meaning": "GAZ:00006883"
        },
        "Argentina [GAZ:00002928]": {
          "text": "Argentina [GAZ:00002928]",
          "meaning": "GAZ:00002928"
        },
        "Armenia [GAZ:00004094]": {
          "text": "Armenia [GAZ:00004094]",
          "meaning": "GAZ:00004094"
        },
        "Aruba [GAZ:00004025]": {
          "text": "Aruba [GAZ:00004025]",
          "meaning": "GAZ:00004025"
        },
        "Ashmore and Cartier Islands [GAZ:00005901]": {
          "text": "Ashmore and Cartier Islands [GAZ:00005901]",
          "meaning": "GAZ:00005901"
        },
        "Australia [GAZ:00000463]": {
          "text": "Australia [GAZ:00000463]",
          "meaning": "GAZ:00000463"
        },
        "Austria [GAZ:00002942]": {
          "text": "Austria [GAZ:00002942]",
          "meaning": "GAZ:00002942"
        },
        "Azerbaijan [GAZ:00004941]": {
          "text": "Azerbaijan [GAZ:00004941]",
          "meaning": "GAZ:00004941"
        },
        "Bahamas [GAZ:00002733]": {
          "text": "Bahamas [GAZ:00002733]",
          "meaning": "GAZ:00002733"
        },
        "Bahrain [GAZ:00005281]": {
          "text": "Bahrain [GAZ:00005281]",
          "meaning": "GAZ:00005281"
        },
        "Baker Island [GAZ:00007117]": {
          "text": "Baker Island [GAZ:00007117]",
          "meaning": "GAZ:00007117"
        },
        "Bangladesh [GAZ:00003750]": {
          "text": "Bangladesh [GAZ:00003750]",
          "meaning": "GAZ:00003750"
        },
        "Barbados [GAZ:00001251]": {
          "text": "Barbados [GAZ:00001251]",
          "meaning": "GAZ:00001251"
        },
        "Bassas da India [GAZ:00005810]": {
          "text": "Bassas da India [GAZ:00005810]",
          "meaning": "GAZ:00005810"
        },
        "Belarus [GAZ:00006886]": {
          "text": "Belarus [GAZ:00006886]",
          "meaning": "GAZ:00006886"
        },
        "Belgium [GAZ:00002938]": {
          "text": "Belgium [GAZ:00002938]",
          "meaning": "GAZ:00002938"
        },
        "Belize [GAZ:00002934]": {
          "text": "Belize [GAZ:00002934]",
          "meaning": "GAZ:00002934"
        },
        "Benin [GAZ:00000904]": {
          "text": "Benin [GAZ:00000904]",
          "meaning": "GAZ:00000904"
        },
        "Bermuda [GAZ:00001264]": {
          "text": "Bermuda [GAZ:00001264]",
          "meaning": "GAZ:00001264"
        },
        "Bhutan [GAZ:00003920]": {
          "text": "Bhutan [GAZ:00003920]",
          "meaning": "GAZ:00003920"
        },
        "Bolivia [GAZ:00002511]": {
          "text": "Bolivia [GAZ:00002511]",
          "meaning": "GAZ:00002511"
        },
        "Borneo [GAZ:00025355]": {
          "text": "Borneo [GAZ:00025355]",
          "meaning": "GAZ:00025355"
        },
        "Bosnia and Herzegovina [GAZ:00006887]": {
          "text": "Bosnia and Herzegovina [GAZ:00006887]",
          "meaning": "GAZ:00006887"
        },
        "Botswana [GAZ:00001097]": {
          "text": "Botswana [GAZ:00001097]",
          "meaning": "GAZ:00001097"
        },
        "Bouvet Island [GAZ:00001453]": {
          "text": "Bouvet Island [GAZ:00001453]",
          "meaning": "GAZ:00001453"
        },
        "Brazil [GAZ:00002828]": {
          "text": "Brazil [GAZ:00002828]",
          "meaning": "GAZ:00002828"
        },
        "British Virgin Islands [GAZ:00003961]": {
          "text": "British Virgin Islands [GAZ:00003961]",
          "meaning": "GAZ:00003961"
        },
        "Brunei [GAZ:00003901]": {
          "text": "Brunei [GAZ:00003901]",
          "meaning": "GAZ:00003901"
        },
        "Bulgaria [GAZ:00002950]": {
          "text": "Bulgaria [GAZ:00002950]",
          "meaning": "GAZ:00002950"
        },
        "Burkina Faso [GAZ:00000905]": {
          "text": "Burkina Faso [GAZ:00000905]",
          "meaning": "GAZ:00000905"
        },
        "Burundi [GAZ:00001090]": {
          "text": "Burundi [GAZ:00001090]",
          "meaning": "GAZ:00001090"
        },
        "Cambodia [GAZ:00006888]": {
          "text": "Cambodia [GAZ:00006888]",
          "meaning": "GAZ:00006888"
        },
        "Cameroon [GAZ:00001093]": {
          "text": "Cameroon [GAZ:00001093]",
          "meaning": "GAZ:00001093"
        },
        "Canada [GAZ:00002560]": {
          "text": "Canada [GAZ:00002560]",
          "meaning": "GAZ:00002560"
        },
        "Cape Verde [GAZ:00001227]": {
          "text": "Cape Verde [GAZ:00001227]",
          "meaning": "GAZ:00001227"
        },
        "Cayman Islands [GAZ:00003986]": {
          "text": "Cayman Islands [GAZ:00003986]",
          "meaning": "GAZ:00003986"
        },
        "Central African Republic [GAZ:00001089]": {
          "text": "Central African Republic [GAZ:00001089]",
          "meaning": "GAZ:00001089"
        },
        "Chad [GAZ:00000586]": {
          "text": "Chad [GAZ:00000586]",
          "meaning": "GAZ:00000586"
        },
        "Chile [GAZ:00002825]": {
          "text": "Chile [GAZ:00002825]",
          "meaning": "GAZ:00002825"
        },
        "China [GAZ:00002845]": {
          "text": "China [GAZ:00002845]",
          "meaning": "GAZ:00002845"
        },
        "Christmas Island [GAZ:00005915]": {
          "text": "Christmas Island [GAZ:00005915]",
          "meaning": "GAZ:00005915"
        },
        "Clipperton Island [GAZ:00005838]": {
          "text": "Clipperton Island [GAZ:00005838]",
          "meaning": "GAZ:00005838"
        },
        "Cocos Islands [GAZ:00009721]": {
          "text": "Cocos Islands [GAZ:00009721]",
          "meaning": "GAZ:00009721"
        },
        "Colombia [GAZ:00002929]": {
          "text": "Colombia [GAZ:00002929]",
          "meaning": "GAZ:00002929"
        },
        "Comoros [GAZ:00005820]": {
          "text": "Comoros [GAZ:00005820]",
          "meaning": "GAZ:00005820"
        },
        "Cook Islands [GAZ:00053798]": {
          "text": "Cook Islands [GAZ:00053798]",
          "meaning": "GAZ:00053798"
        },
        "Coral Sea Islands [GAZ:00005917]": {
          "text": "Coral Sea Islands [GAZ:00005917]",
          "meaning": "GAZ:00005917"
        },
        "Costa Rica [GAZ:00002901]": {
          "text": "Costa Rica [GAZ:00002901]",
          "meaning": "GAZ:00002901"
        },
        "Cote d'Ivoire [GAZ:00000906]": {
          "text": "Cote d'Ivoire [GAZ:00000906]",
          "meaning": "GAZ:00000906"
        },
        "Croatia [GAZ:00002719]": {
          "text": "Croatia [GAZ:00002719]",
          "meaning": "GAZ:00002719"
        },
        "Cuba [GAZ:00003762]": {
          "text": "Cuba [GAZ:00003762]",
          "meaning": "GAZ:00003762"
        },
        "Curacao [GAZ:00012582]": {
          "text": "Curacao [GAZ:00012582]",
          "meaning": "GAZ:00012582"
        },
        "Cyprus [GAZ:00004006]": {
          "text": "Cyprus [GAZ:00004006]",
          "meaning": "GAZ:00004006"
        },
        "Czech Republic [GAZ:00002954]": {
          "text": "Czech Republic [GAZ:00002954]",
          "meaning": "GAZ:00002954"
        },
        "Democratic Republic of the Congo [GAZ:00001086]": {
          "text": "Democratic Republic of the Congo [GAZ:00001086]",
          "meaning": "GAZ:00001086"
        },
        "Denmark [GAZ:00005852]": {
          "text": "Denmark [GAZ:00005852]",
          "meaning": "GAZ:00005852"
        },
        "Djibouti [GAZ:00000582]": {
          "text": "Djibouti [GAZ:00000582]",
          "meaning": "GAZ:00000582"
        },
        "Dominica [GAZ:00006890]": {
          "text": "Dominica [GAZ:00006890]",
          "meaning": "GAZ:00006890"
        },
        "Dominican Republic [GAZ:00003952]": {
          "text": "Dominican Republic [GAZ:00003952]",
          "meaning": "GAZ:00003952"
        },
        "Ecuador [GAZ:00002912]": {
          "text": "Ecuador [GAZ:00002912]",
          "meaning": "GAZ:00002912"
        },
        "Egypt [GAZ:00003934]": {
          "text": "Egypt [GAZ:00003934]",
          "meaning": "GAZ:00003934"
        },
        "El Salvador [GAZ:00002935]": {
          "text": "El Salvador [GAZ:00002935]",
          "meaning": "GAZ:00002935"
        },
        "Equatorial Guinea [GAZ:00001091]": {
          "text": "Equatorial Guinea [GAZ:00001091]",
          "meaning": "GAZ:00001091"
        },
        "Eritrea [GAZ:00000581]": {
          "text": "Eritrea [GAZ:00000581]",
          "meaning": "GAZ:00000581"
        },
        "Estonia [GAZ:00002959]": {
          "text": "Estonia [GAZ:00002959]",
          "meaning": "GAZ:00002959"
        },
        "Eswatini [GAZ:00001099]": {
          "text": "Eswatini [GAZ:00001099]",
          "meaning": "GAZ:00001099"
        },
        "Ethiopia [GAZ:00000567]": {
          "text": "Ethiopia [GAZ:00000567]",
          "meaning": "GAZ:00000567"
        },
        "Europa Island [GAZ:00005811]": {
          "text": "Europa Island [GAZ:00005811]",
          "meaning": "GAZ:00005811"
        },
        "Falkland Islands (Islas Malvinas) [GAZ:00001412]": {
          "text": "Falkland Islands (Islas Malvinas) [GAZ:00001412]",
          "meaning": "GAZ:00001412"
        },
        "Faroe Islands [GAZ:00059206]": {
          "text": "Faroe Islands [GAZ:00059206]",
          "meaning": "GAZ:00059206"
        },
        "Fiji [GAZ:00006891]": {
          "text": "Fiji [GAZ:00006891]",
          "meaning": "GAZ:00006891"
        },
        "Finland [GAZ:00002937]": {
          "text": "Finland [GAZ:00002937]",
          "meaning": "GAZ:00002937"
        },
        "France [GAZ:00003940]": {
          "text": "France [GAZ:00003940]",
          "meaning": "GAZ:00003940"
        },
        "French Guiana [GAZ:00002516]": {
          "text": "French Guiana [GAZ:00002516]",
          "meaning": "GAZ:00002516"
        },
        "French Polynesia [GAZ:00002918]": {
          "text": "French Polynesia [GAZ:00002918]",
          "meaning": "GAZ:00002918"
        },
        "French Southern and Antarctic Lands [GAZ:00003753]": {
          "text": "French Southern and Antarctic Lands [GAZ:00003753]",
          "meaning": "GAZ:00003753"
        },
        "Gabon [GAZ:00001092]": {
          "text": "Gabon [GAZ:00001092]",
          "meaning": "GAZ:00001092"
        },
        "Gambia [GAZ:00000907]": {
          "text": "Gambia [GAZ:00000907]",
          "meaning": "GAZ:00000907"
        },
        "Gaza Strip [GAZ:00009571]": {
          "text": "Gaza Strip [GAZ:00009571]",
          "meaning": "GAZ:00009571"
        },
        "Georgia [GAZ:00004942]": {
          "text": "Georgia [GAZ:00004942]",
          "meaning": "GAZ:00004942"
        },
        "Germany [GAZ:00002646]": {
          "text": "Germany [GAZ:00002646]",
          "meaning": "GAZ:00002646"
        },
        "Ghana [GAZ:00000908]": {
          "text": "Ghana [GAZ:00000908]",
          "meaning": "GAZ:00000908"
        },
        "Gibraltar [GAZ:00003987]": {
          "text": "Gibraltar [GAZ:00003987]",
          "meaning": "GAZ:00003987"
        },
        "Glorioso Islands [GAZ:00005808]": {
          "text": "Glorioso Islands [GAZ:00005808]",
          "meaning": "GAZ:00005808"
        },
        "Greece [GAZ:00002945]": {
          "text": "Greece [GAZ:00002945]",
          "meaning": "GAZ:00002945"
        },
        "Greenland [GAZ:00001507]": {
          "text": "Greenland [GAZ:00001507]",
          "meaning": "GAZ:00001507"
        },
        "Grenada [GAZ:02000573]": {
          "text": "Grenada [GAZ:02000573]",
          "meaning": "GAZ:02000573"
        },
        "Guadeloupe [GAZ:00067142]": {
          "text": "Guadeloupe [GAZ:00067142]",
          "meaning": "GAZ:00067142"
        },
        "Guam [GAZ:00003706]": {
          "text": "Guam [GAZ:00003706]",
          "meaning": "GAZ:00003706"
        },
        "Guatemala [GAZ:00002936]": {
          "text": "Guatemala [GAZ:00002936]",
          "meaning": "GAZ:00002936"
        },
        "Guernsey [GAZ:00001550]": {
          "text": "Guernsey [GAZ:00001550]",
          "meaning": "GAZ:00001550"
        },
        "Guinea [GAZ:00000909]": {
          "text": "Guinea [GAZ:00000909]",
          "meaning": "GAZ:00000909"
        },
        "Guinea-Bissau [GAZ:00000910]": {
          "text": "Guinea-Bissau [GAZ:00000910]",
          "meaning": "GAZ:00000910"
        },
        "Guyana [GAZ:00002522]": {
          "text": "Guyana [GAZ:00002522]",
          "meaning": "GAZ:00002522"
        },
        "Haiti [GAZ:00003953]": {
          "text": "Haiti [GAZ:00003953]",
          "meaning": "GAZ:00003953"
        },
        "Heard Island and McDonald Islands [GAZ:00009718]": {
          "text": "Heard Island and McDonald Islands [GAZ:00009718]",
          "meaning": "GAZ:00009718"
        },
        "Honduras [GAZ:00002894]": {
          "text": "Honduras [GAZ:00002894]",
          "meaning": "GAZ:00002894"
        },
        "Hong Kong [GAZ:00003203]": {
          "text": "Hong Kong [GAZ:00003203]",
          "meaning": "GAZ:00003203"
        },
        "Howland Island [GAZ:00007120]": {
          "text": "Howland Island [GAZ:00007120]",
          "meaning": "GAZ:00007120"
        },
        "Hungary [GAZ:00002952]": {
          "text": "Hungary [GAZ:00002952]",
          "meaning": "GAZ:00002952"
        },
        "Iceland [GAZ:00000843]": {
          "text": "Iceland [GAZ:00000843]",
          "meaning": "GAZ:00000843"
        },
        "India [GAZ:00002839]": {
          "text": "India [GAZ:00002839]",
          "meaning": "GAZ:00002839"
        },
        "Indonesia [GAZ:00003727]": {
          "text": "Indonesia [GAZ:00003727]",
          "meaning": "GAZ:00003727"
        },
        "Iran [GAZ:00004474]": {
          "text": "Iran [GAZ:00004474]",
          "meaning": "GAZ:00004474"
        },
        "Iraq [GAZ:00004483]": {
          "text": "Iraq [GAZ:00004483]",
          "meaning": "GAZ:00004483"
        },
        "Ireland [GAZ:00002943]": {
          "text": "Ireland [GAZ:00002943]",
          "meaning": "GAZ:00002943"
        },
        "Isle of Man [GAZ:00052477]": {
          "text": "Isle of Man [GAZ:00052477]",
          "meaning": "GAZ:00052477"
        },
        "Israel [GAZ:00002476]": {
          "text": "Israel [GAZ:00002476]",
          "meaning": "GAZ:00002476"
        },
        "Italy [GAZ:00002650]": {
          "text": "Italy [GAZ:00002650]",
          "meaning": "GAZ:00002650"
        },
        "Jamaica [GAZ:00003781]": {
          "text": "Jamaica [GAZ:00003781]",
          "meaning": "GAZ:00003781"
        },
        "Jan Mayen [GAZ:00005853]": {
          "text": "Jan Mayen [GAZ:00005853]",
          "meaning": "GAZ:00005853"
        },
        "Japan [GAZ:00002747]": {
          "text": "Japan [GAZ:00002747]",
          "meaning": "GAZ:00002747"
        },
        "Jarvis Island [GAZ:00007118]": {
          "text": "Jarvis Island [GAZ:00007118]",
          "meaning": "GAZ:00007118"
        },
        "Jersey [GAZ:00001551]": {
          "text": "Jersey [GAZ:00001551]",
          "meaning": "GAZ:00001551"
        },
        "Johnston Atoll [GAZ:00007114]": {
          "text": "Johnston Atoll [GAZ:00007114]",
          "meaning": "GAZ:00007114"
        },
        "Jordan [GAZ:00002473]": {
          "text": "Jordan [GAZ:00002473]",
          "meaning": "GAZ:00002473"
        },
        "Juan de Nova Island [GAZ:00005809]": {
          "text": "Juan de Nova Island [GAZ:00005809]",
          "meaning": "GAZ:00005809"
        },
        "Kazakhstan [GAZ:00004999]": {
          "text": "Kazakhstan [GAZ:00004999]",
          "meaning": "GAZ:00004999"
        },
        "Kenya [GAZ:00001101]": {
          "text": "Kenya [GAZ:00001101]",
          "meaning": "GAZ:00001101"
        },
        "Kerguelen Archipelago [GAZ:00005682]": {
          "text": "Kerguelen Archipelago [GAZ:00005682]",
          "meaning": "GAZ:00005682"
        },
        "Kingman Reef [GAZ:00007116]": {
          "text": "Kingman Reef [GAZ:00007116]",
          "meaning": "GAZ:00007116"
        },
        "Kiribati [GAZ:00006894]": {
          "text": "Kiribati [GAZ:00006894]",
          "meaning": "GAZ:00006894"
        },
        "Kosovo [GAZ:00011337]": {
          "text": "Kosovo [GAZ:00011337]",
          "meaning": "GAZ:00011337"
        },
        "Kuwait [GAZ:00005285]": {
          "text": "Kuwait [GAZ:00005285]",
          "meaning": "GAZ:00005285"
        },
        "Kyrgyzstan [GAZ:00006893]": {
          "text": "Kyrgyzstan [GAZ:00006893]",
          "meaning": "GAZ:00006893"
        },
        "Laos [GAZ:00006889]": {
          "text": "Laos [GAZ:00006889]",
          "meaning": "GAZ:00006889"
        },
        "Latvia [GAZ:00002958]": {
          "text": "Latvia [GAZ:00002958]",
          "meaning": "GAZ:00002958"
        },
        "Lebanon [GAZ:00002478]": {
          "text": "Lebanon [GAZ:00002478]",
          "meaning": "GAZ:00002478"
        },
        "Lesotho [GAZ:00001098]": {
          "text": "Lesotho [GAZ:00001098]",
          "meaning": "GAZ:00001098"
        },
        "Liberia [GAZ:00000911]": {
          "text": "Liberia [GAZ:00000911]",
          "meaning": "GAZ:00000911"
        },
        "Libya [GAZ:00000566]": {
          "text": "Libya [GAZ:00000566]",
          "meaning": "GAZ:00000566"
        },
        "Liechtenstein [GAZ:00003858]": {
          "text": "Liechtenstein [GAZ:00003858]",
          "meaning": "GAZ:00003858"
        },
        "Line Islands [GAZ:00007144]": {
          "text": "Line Islands [GAZ:00007144]",
          "meaning": "GAZ:00007144"
        },
        "Lithuania [GAZ:00002960]": {
          "text": "Lithuania [GAZ:00002960]",
          "meaning": "GAZ:00002960"
        },
        "Luxembourg [GAZ:00002947]": {
          "text": "Luxembourg [GAZ:00002947]",
          "meaning": "GAZ:00002947"
        },
        "Macau [GAZ:00003202]": {
          "text": "Macau [GAZ:00003202]",
          "meaning": "GAZ:00003202"
        },
        "Madagascar [GAZ:00001108]": {
          "text": "Madagascar [GAZ:00001108]",
          "meaning": "GAZ:00001108"
        },
        "Malawi [GAZ:00001105]": {
          "text": "Malawi [GAZ:00001105]",
          "meaning": "GAZ:00001105"
        },
        "Malaysia [GAZ:00003902]": {
          "text": "Malaysia [GAZ:00003902]",
          "meaning": "GAZ:00003902"
        },
        "Maldives [GAZ:00006924]": {
          "text": "Maldives [GAZ:00006924]",
          "meaning": "GAZ:00006924"
        },
        "Mali [GAZ:00000584]": {
          "text": "Mali [GAZ:00000584]",
          "meaning": "GAZ:00000584"
        },
        "Malta [GAZ:00004017]": {
          "text": "Malta [GAZ:00004017]",
          "meaning": "GAZ:00004017"
        },
        "Marshall Islands [GAZ:00007161]": {
          "text": "Marshall Islands [GAZ:00007161]",
          "meaning": "GAZ:00007161"
        },
        "Martinique [GAZ:00067143]": {
          "text": "Martinique [GAZ:00067143]",
          "meaning": "GAZ:00067143"
        },
        "Mauritania [GAZ:00000583]": {
          "text": "Mauritania [GAZ:00000583]",
          "meaning": "GAZ:00000583"
        },
        "Mauritius [GAZ:00003745]": {
          "text": "Mauritius [GAZ:00003745]",
          "meaning": "GAZ:00003745"
        },
        "Mayotte [GAZ:00003943]": {
          "text": "Mayotte [GAZ:00003943]",
          "meaning": "GAZ:00003943"
        },
        "Mexico [GAZ:00002852]": {
          "text": "Mexico [GAZ:00002852]",
          "meaning": "GAZ:00002852"
        },
        "Micronesia [GAZ:00005862]": {
          "text": "Micronesia [GAZ:00005862]",
          "meaning": "GAZ:00005862"
        },
        "Midway Islands [GAZ:00007112]": {
          "text": "Midway Islands [GAZ:00007112]",
          "meaning": "GAZ:00007112"
        },
        "Moldova [GAZ:00003897]": {
          "text": "Moldova [GAZ:00003897]",
          "meaning": "GAZ:00003897"
        },
        "Monaco [GAZ:00003857]": {
          "text": "Monaco [GAZ:00003857]",
          "meaning": "GAZ:00003857"
        },
        "Mongolia [GAZ:00008744]": {
          "text": "Mongolia [GAZ:00008744]",
          "meaning": "GAZ:00008744"
        },
        "Montenegro [GAZ:00006898]": {
          "text": "Montenegro [GAZ:00006898]",
          "meaning": "GAZ:00006898"
        },
        "Montserrat [GAZ:00003988]": {
          "text": "Montserrat [GAZ:00003988]",
          "meaning": "GAZ:00003988"
        },
        "Morocco [GAZ:00000565]": {
          "text": "Morocco [GAZ:00000565]",
          "meaning": "GAZ:00000565"
        },
        "Mozambique [GAZ:00001100]": {
          "text": "Mozambique [GAZ:00001100]",
          "meaning": "GAZ:00001100"
        },
        "Myanmar [GAZ:00006899]": {
          "text": "Myanmar [GAZ:00006899]",
          "meaning": "GAZ:00006899"
        },
        "Namibia [GAZ:00001096]": {
          "text": "Namibia [GAZ:00001096]",
          "meaning": "GAZ:00001096"
        },
        "Nauru [GAZ:00006900]": {
          "text": "Nauru [GAZ:00006900]",
          "meaning": "GAZ:00006900"
        },
        "Navassa Island [GAZ:00007119]": {
          "text": "Navassa Island [GAZ:00007119]",
          "meaning": "GAZ:00007119"
        },
        "Nepal [GAZ:00004399]": {
          "text": "Nepal [GAZ:00004399]",
          "meaning": "GAZ:00004399"
        },
        "Netherlands [GAZ:00002946]": {
          "text": "Netherlands [GAZ:00002946]",
          "meaning": "GAZ:00002946"
        },
        "New Caledonia [GAZ:00005206]": {
          "text": "New Caledonia [GAZ:00005206]",
          "meaning": "GAZ:00005206"
        },
        "New Zealand [GAZ:00000469]": {
          "text": "New Zealand [GAZ:00000469]",
          "meaning": "GAZ:00000469"
        },
        "Nicaragua [GAZ:00002978]": {
          "text": "Nicaragua [GAZ:00002978]",
          "meaning": "GAZ:00002978"
        },
        "Niger [GAZ:00000585]": {
          "text": "Niger [GAZ:00000585]",
          "meaning": "GAZ:00000585"
        },
        "Nigeria [GAZ:00000912]": {
          "text": "Nigeria [GAZ:00000912]",
          "meaning": "GAZ:00000912"
        },
        "Niue [GAZ:00006902]": {
          "text": "Niue [GAZ:00006902]",
          "meaning": "GAZ:00006902"
        },
        "Norfolk Island [GAZ:00005908]": {
          "text": "Norfolk Island [GAZ:00005908]",
          "meaning": "GAZ:00005908"
        },
        "North Korea [GAZ:00002801]": {
          "text": "North Korea [GAZ:00002801]",
          "meaning": "GAZ:00002801"
        },
        "North Macedonia [GAZ:00006895]": {
          "text": "North Macedonia [GAZ:00006895]",
          "meaning": "GAZ:00006895"
        },
        "North Sea [GAZ:00002284]": {
          "text": "North Sea [GAZ:00002284]",
          "meaning": "GAZ:00002284"
        },
        "Northern Mariana Islands [GAZ:00003958]": {
          "text": "Northern Mariana Islands [GAZ:00003958]",
          "meaning": "GAZ:00003958"
        },
        "Norway [GAZ:00002699]": {
          "text": "Norway [GAZ:00002699]",
          "meaning": "GAZ:00002699"
        },
        "Oman [GAZ:00005283]": {
          "text": "Oman [GAZ:00005283]",
          "meaning": "GAZ:00005283"
        },
        "Pakistan [GAZ:00005246]": {
          "text": "Pakistan [GAZ:00005246]",
          "meaning": "GAZ:00005246"
        },
        "Palau [GAZ:00006905]": {
          "text": "Palau [GAZ:00006905]",
          "meaning": "GAZ:00006905"
        },
        "Panama [GAZ:00002892]": {
          "text": "Panama [GAZ:00002892]",
          "meaning": "GAZ:00002892"
        },
        "Papua New Guinea [GAZ:00003922]": {
          "text": "Papua New Guinea [GAZ:00003922]",
          "meaning": "GAZ:00003922"
        },
        "Paracel Islands [GAZ:00010832]": {
          "text": "Paracel Islands [GAZ:00010832]",
          "meaning": "GAZ:00010832"
        },
        "Paraguay [GAZ:00002933]": {
          "text": "Paraguay [GAZ:00002933]",
          "meaning": "GAZ:00002933"
        },
        "Peru [GAZ:00002932]": {
          "text": "Peru [GAZ:00002932]",
          "meaning": "GAZ:00002932"
        },
        "Philippines [GAZ:00004525]": {
          "text": "Philippines [GAZ:00004525]",
          "meaning": "GAZ:00004525"
        },
        "Pitcairn Islands [GAZ:00005867]": {
          "text": "Pitcairn Islands [GAZ:00005867]",
          "meaning": "GAZ:00005867"
        },
        "Poland [GAZ:00002939]": {
          "text": "Poland [GAZ:00002939]",
          "meaning": "GAZ:00002939"
        },
        "Portugal [GAZ:00004126]": {
          "text": "Portugal [GAZ:00004126]",
          "meaning": "GAZ:00004126"
        },
        "Puerto Rico [GAZ:00006935]": {
          "text": "Puerto Rico [GAZ:00006935]",
          "meaning": "GAZ:00006935"
        },
        "Qatar [GAZ:00005286]": {
          "text": "Qatar [GAZ:00005286]",
          "meaning": "GAZ:00005286"
        },
        "Republic of the Congo [GAZ:00001088]": {
          "text": "Republic of the Congo [GAZ:00001088]",
          "meaning": "GAZ:00001088"
        },
        "Reunion [GAZ:00003945]": {
          "text": "Reunion [GAZ:00003945]",
          "meaning": "GAZ:00003945"
        },
        "Romania [GAZ:00002951]": {
          "text": "Romania [GAZ:00002951]",
          "meaning": "GAZ:00002951"
        },
        "Ross Sea [GAZ:00023304]": {
          "text": "Ross Sea [GAZ:00023304]",
          "meaning": "GAZ:00023304"
        },
        "Russia [GAZ:00002721]": {
          "text": "Russia [GAZ:00002721]",
          "meaning": "GAZ:00002721"
        },
        "Rwanda [GAZ:00001087]": {
          "text": "Rwanda [GAZ:00001087]",
          "meaning": "GAZ:00001087"
        },
        "Saint Helena [GAZ:00000849]": {
          "text": "Saint Helena [GAZ:00000849]",
          "meaning": "GAZ:00000849"
        },
        "Saint Kitts and Nevis [GAZ:00006906]": {
          "text": "Saint Kitts and Nevis [GAZ:00006906]",
          "meaning": "GAZ:00006906"
        },
        "Saint Lucia [GAZ:00006909]": {
          "text": "Saint Lucia [GAZ:00006909]",
          "meaning": "GAZ:00006909"
        },
        "Saint Pierre and Miquelon [GAZ:00003942]": {
          "text": "Saint Pierre and Miquelon [GAZ:00003942]",
          "meaning": "GAZ:00003942"
        },
        "Saint Martin [GAZ:00005841]": {
          "text": "Saint Martin [GAZ:00005841]",
          "meaning": "GAZ:00005841"
        },
        "Saint Vincent and the Grenadines [GAZ:02000565]": {
          "text": "Saint Vincent and the Grenadines [GAZ:02000565]",
          "meaning": "GAZ:02000565"
        },
        "Samoa [GAZ:00006910]": {
          "text": "Samoa [GAZ:00006910]",
          "meaning": "GAZ:00006910"
        },
        "San Marino [GAZ:00003102]": {
          "text": "San Marino [GAZ:00003102]",
          "meaning": "GAZ:00003102"
        },
        "Sao Tome and Principe [GAZ:00006927]": {
          "text": "Sao Tome and Principe [GAZ:00006927]",
          "meaning": "GAZ:00006927"
        },
        "Saudi Arabia [GAZ:00005279]": {
          "text": "Saudi Arabia [GAZ:00005279]",
          "meaning": "GAZ:00005279"
        },
        "Senegal [GAZ:00000913]": {
          "text": "Senegal [GAZ:00000913]",
          "meaning": "GAZ:00000913"
        },
        "Serbia [GAZ:00002957]": {
          "text": "Serbia [GAZ:00002957]",
          "meaning": "GAZ:00002957"
        },
        "Seychelles [GAZ:00006922]": {
          "text": "Seychelles [GAZ:00006922]",
          "meaning": "GAZ:00006922"
        },
        "Sierra Leone [GAZ:00000914]": {
          "text": "Sierra Leone [GAZ:00000914]",
          "meaning": "GAZ:00000914"
        },
        "Singapore [GAZ:00003923]": {
          "text": "Singapore [GAZ:00003923]",
          "meaning": "GAZ:00003923"
        },
        "Sint Maarten [GAZ:00012579]": {
          "text": "Sint Maarten [GAZ:00012579]",
          "meaning": "GAZ:00012579"
        },
        "Slovakia [GAZ:00002956]": {
          "text": "Slovakia [GAZ:00002956]",
          "meaning": "GAZ:00002956"
        },
        "Slovenia [GAZ:00002955]": {
          "text": "Slovenia [GAZ:00002955]",
          "meaning": "GAZ:00002955"
        },
        "Solomon Islands [GAZ:00005275]": {
          "text": "Solomon Islands [GAZ:00005275]",
          "meaning": "GAZ:00005275"
        },
        "Somalia [GAZ:00001104]": {
          "text": "Somalia [GAZ:00001104]",
          "meaning": "GAZ:00001104"
        },
        "South Africa [GAZ:00001094]": {
          "text": "South Africa [GAZ:00001094]",
          "meaning": "GAZ:00001094"
        },
        "South Georgia and the South Sandwich Islands [GAZ:00003990]": {
          "text": "South Georgia and the South Sandwich Islands [GAZ:00003990]",
          "meaning": "GAZ:00003990"
        },
        "South Korea [GAZ:00002802]": {
          "text": "South Korea [GAZ:00002802]",
          "meaning": "GAZ:00002802"
        },
        "South Sudan [GAZ:00233439]": {
          "text": "South Sudan [GAZ:00233439]",
          "meaning": "GAZ:00233439"
        },
        "Spain [GAZ:00003936]": {
          "text": "Spain [GAZ:00003936]",
          "meaning": "GAZ:00003936"
        },
        "Spratly Islands [GAZ:00010831]": {
          "text": "Spratly Islands [GAZ:00010831]",
          "meaning": "GAZ:00010831"
        },
        "Sri Lanka [GAZ:00003924]": {
          "text": "Sri Lanka [GAZ:00003924]",
          "meaning": "GAZ:00003924"
        },
        "State of Palestine [GAZ:00002475]": {
          "text": "State of Palestine [GAZ:00002475]",
          "meaning": "GAZ:00002475"
        },
        "Sudan [GAZ:00000560]": {
          "text": "Sudan [GAZ:00000560]",
          "meaning": "GAZ:00000560"
        },
        "Suriname [GAZ:00002525]": {
          "text": "Suriname [GAZ:00002525]",
          "meaning": "GAZ:00002525"
        },
        "Svalbard [GAZ:00005396]": {
          "text": "Svalbard [GAZ:00005396]",
          "meaning": "GAZ:00005396"
        },
        "Swaziland [GAZ:00001099]": {
          "text": "Swaziland [GAZ:00001099]",
          "meaning": "GAZ:00001099"
        },
        "Sweden [GAZ:00002729]": {
          "text": "Sweden [GAZ:00002729]",
          "meaning": "GAZ:00002729"
        },
        "Switzerland [GAZ:00002941]": {
          "text": "Switzerland [GAZ:00002941]",
          "meaning": "GAZ:00002941"
        },
        "Syria [GAZ:00002474]": {
          "text": "Syria [GAZ:00002474]",
          "meaning": "GAZ:00002474"
        },
        "Taiwan [GAZ:00005341]": {
          "text": "Taiwan [GAZ:00005341]",
          "meaning": "GAZ:00005341"
        },
        "Tajikistan [GAZ:00006912]": {
          "text": "Tajikistan [GAZ:00006912]",
          "meaning": "GAZ:00006912"
        },
        "Tanzania [GAZ:00001103]": {
          "text": "Tanzania [GAZ:00001103]",
          "meaning": "GAZ:00001103"
        },
        "Thailand [GAZ:00003744]": {
          "text": "Thailand [GAZ:00003744]",
          "meaning": "GAZ:00003744"
        },
        "Timor-Leste [GAZ:00006913]": {
          "text": "Timor-Leste [GAZ:00006913]",
          "meaning": "GAZ:00006913"
        },
        "Togo [GAZ:00000915]": {
          "text": "Togo [GAZ:00000915]",
          "meaning": "GAZ:00000915"
        },
        "Tokelau [GAZ:00260188]": {
          "text": "Tokelau [GAZ:00260188]",
          "meaning": "GAZ:00260188"
        },
        "Tonga [GAZ:00006916]": {
          "text": "Tonga [GAZ:00006916]",
          "meaning": "GAZ:00006916"
        },
        "Trinidad and Tobago [GAZ:00003767]": {
          "text": "Trinidad and Tobago [GAZ:00003767]",
          "meaning": "GAZ:00003767"
        },
        "Tromelin Island [GAZ:00005812]": {
          "text": "Tromelin Island [GAZ:00005812]",
          "meaning": "GAZ:00005812"
        },
        "Tunisia [GAZ:00000562]": {
          "text": "Tunisia [GAZ:00000562]",
          "meaning": "GAZ:00000562"
        },
        "Turkey [GAZ:00000558]": {
          "text": "Turkey [GAZ:00000558]",
          "meaning": "GAZ:00000558"
        },
        "Turkmenistan [GAZ:00005018]": {
          "text": "Turkmenistan [GAZ:00005018]",
          "meaning": "GAZ:00005018"
        },
        "Turks and Caicos Islands [GAZ:00003955]": {
          "text": "Turks and Caicos Islands [GAZ:00003955]",
          "meaning": "GAZ:00003955"
        },
        "Tuvalu [GAZ:00009715]": {
          "text": "Tuvalu [GAZ:00009715]",
          "meaning": "GAZ:00009715"
        },
        "United States of America [GAZ:00002459]": {
          "text": "United States of America [GAZ:00002459]",
          "meaning": "GAZ:00002459"
        },
        "Uganda [GAZ:00001102]": {
          "text": "Uganda [GAZ:00001102]",
          "meaning": "GAZ:00001102"
        },
        "Ukraine [GAZ:00002724]": {
          "text": "Ukraine [GAZ:00002724]",
          "meaning": "GAZ:00002724"
        },
        "United Arab Emirates [GAZ:00005282]": {
          "text": "United Arab Emirates [GAZ:00005282]",
          "meaning": "GAZ:00005282"
        },
        "United Kingdom [GAZ:00002637]": {
          "text": "United Kingdom [GAZ:00002637]",
          "meaning": "GAZ:00002637"
        },
        "Uruguay [GAZ:00002930]": {
          "text": "Uruguay [GAZ:00002930]",
          "meaning": "GAZ:00002930"
        },
        "Uzbekistan [GAZ:00004979]": {
          "text": "Uzbekistan [GAZ:00004979]",
          "meaning": "GAZ:00004979"
        },
        "Vanuatu [GAZ:00006918]": {
          "text": "Vanuatu [GAZ:00006918]",
          "meaning": "GAZ:00006918"
        },
        "Venezuela [GAZ:00002931]": {
          "text": "Venezuela [GAZ:00002931]",
          "meaning": "GAZ:00002931"
        },
        "Viet Nam [GAZ:00003756]": {
          "text": "Viet Nam [GAZ:00003756]",
          "meaning": "GAZ:00003756"
        },
        "Virgin Islands [GAZ:00003959]": {
          "text": "Virgin Islands [GAZ:00003959]",
          "meaning": "GAZ:00003959"
        },
        "Wake Island [GAZ:00007111]": {
          "text": "Wake Island [GAZ:00007111]",
          "meaning": "GAZ:00007111"
        },
        "Wallis and Futuna [GAZ:00007191]": {
          "text": "Wallis and Futuna [GAZ:00007191]",
          "meaning": "GAZ:00007191"
        },
        "West Bank [GAZ:00009572]": {
          "text": "West Bank [GAZ:00009572]",
          "meaning": "GAZ:00009572"
        },
        "Western Sahara [GAZ:00000564]": {
          "text": "Western Sahara [GAZ:00000564]",
          "meaning": "GAZ:00000564"
        },
        "Yemen [GAZ:00005284]": {
          "text": "Yemen [GAZ:00005284]",
          "meaning": "GAZ:00005284"
        },
        "Zambia [GAZ:00001107]": {
          "text": "Zambia [GAZ:00001107]",
          "meaning": "GAZ:00001107"
        },
        "Zimbabwe [GAZ:00001106]": {
          "text": "Zimbabwe [GAZ:00001106]",
          "meaning": "GAZ:00001106"
        }
      }
    }
  },
  "slots": {
    "specimen collector sample ID": {
      "name": "specimen collector sample ID",
      "description": "The user-defined name for the sample.",
      "title": "specimen collector sample ID",
      "comments": [
        "Store the collector sample ID. If this number is considered identifiable information, provide an alternative ID. Be sure to store the key that maps between the original and alternative IDs for traceability and follow up if necessary. Every collector sample ID from a single submitter must be unique. It can have any format, but we suggest that you make it concise, unique and consistent within your lab."
      ],
      "examples": [
        {
          "value": "prov_monkeypox_1234"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Sample ID given by the sample provider",
        "CNPHI:Primary Specimen ID",
        "NML_LIMS:TEXT_ID",
        "BIOSAMPLE:sample_name",
        "VirusSeq_Portal:specimen collector sample ID"
      ],
      "slot_uri": "GENEPIO:0001123",
      "identifier": true,
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "Related specimen primary ID": {
      "name": "Related specimen primary ID",
      "description": "The primary ID of a related specimen previously submitted to the repository.",
      "title": "Related specimen primary ID",
      "comments": [
        "Store the primary ID of the related specimen previously submitted to the National Microbiology Laboratory so that the samples can be linked and tracked through the system."
      ],
      "examples": [
        {
          "value": "SR20-12345"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Related Specimen ID",
        "CNPHI:Related Specimen Relationship Type",
        "NML_LIMS:PH_RELATED_PRIMARY_ID",
        "BIOSAMPLE:host_subject_ID"
      ],
      "slot_uri": "GENEPIO:0001128",
      "any_of": [
        {
          "range": "WhitespaceMinimizedString"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "GISAID virus name": {
      "name": "GISAID virus name",
      "description": "Identifier of the specific isolate.",
      "title": "GISAID virus name",
      "comments": [
        "Provide the GISAID EpiPox virus name, which should be written in the format “hMpxV/Canada/2 digit provincial ISO code-xxxxx/year”. If the province code cannot be shared for privacy reasons, put \"UN\" for \"Unknown\"."
      ],
      "examples": [
        {
          "value": "hMpxV/Canada/UN-NML-12345/2022"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Virus name",
        "BIOSAMPLE:GISAID_virus_name"
      ],
      "slot_uri": "GENEPIO:0100282",
      "range": "WhitespaceMinimizedString"
    },
    "GISAID accession": {
      "name": "GISAID accession",
      "description": "The GISAID accession number assigned to the sequence.",
      "title": "GISAID accession",
      "comments": [
        "Store the accession returned from the GISAID submission."
      ],
      "examples": [
        {
          "value": "EPI_ISL_436489"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:GISAID Accession (if known)",
        "NML_LIMS:SUBMISSIONS - GISAID Accession ID",
        "BIOSAMPLE:GISAID_accession",
        "VirusSeq_Portal:GISAID accession"
      ],
      "slot_uri": "GENEPIO:0001147",
      "range": "WhitespaceMinimizedString",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
    },
    "sample collected by": {
      "name": "sample collected by",
      "description": "The name of the agency that collected the original sample.",
      "title": "sample collected by",
      "comments": [
        "The name of the sample collector should be written out in full, (with minor exceptions) and be consistent across multple submissions e.g. Public Health Agency of Canada, Public Health Ontario, BC Centre for Disease Control. The sample collector specified is at the discretion of the data provider (i.e. may be hospital, provincial public health lab, or other)."
      ],
      "examples": [
        {
          "value": "BC Centre for Disease Control"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "slot_uri": "GENEPIO:0001153",
      "required": true
    },
    "sample collector contact email": {
      "name": "sample collector contact email",
      "description": "The email address of the contact responsible for follow-up regarding the sample.",
      "title": "sample collector contact email",
      "comments": [
        "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca"
      ],
      "examples": [
        {
          "value": "RespLab@lab.ca"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:sample collector contact email"
      ],
      "slot_uri": "GENEPIO:0001156",
      "range": "WhitespaceMinimizedString",
      "pattern": "^\\S+@\\S+\\.\\S+$"
    },
    "sample collector contact address": {
      "name": "sample collector contact address",
      "description": "The mailing address of the agency submitting the sample.",
      "title": "sample collector contact address",
      "comments": [
        "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country"
      ],
      "examples": [
        {
          "value": "655 Lab St, Vancouver, British Columbia, V5N 2A2, Canada"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Address",
        "NML_LIMS:sample collector contact address"
      ],
      "slot_uri": "GENEPIO:0001158",
      "range": "WhitespaceMinimizedString"
    },
    "sequenced by": {
      "name": "sequenced by",
      "description": "The name of the agency that generated the sequence.",
      "title": "sequenced by",
      "comments": [
        "The name of the agency should be written out in full, (with minor exceptions) and be consistent across multiple submissions. If submitting specimens rather than sequencing data, please put the \"National Microbiology Laboratory (NML)\"."
      ],
      "examples": [
        {
          "value": "Public Health Ontario (PHO)"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "slot_uri": "GENEPIO:0100416",
      "required": true
    },
    "sequenced by contact email": {
      "name": "sequenced by contact email",
      "description": "The email address of the contact responsible for follow-up regarding the sequence.",
      "title": "sequenced by contact email",
      "comments": [
        "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca"
      ],
      "examples": [
        {
          "value": "RespLab@lab.ca"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:sequenced by contact email"
      ],
      "slot_uri": "GENEPIO:0100422",
      "range": "WhitespaceMinimizedString"
    },
    "sequenced by contact address": {
      "name": "sequenced by contact address",
      "description": "The mailing address of the agency submitting the sequence.",
      "title": "sequenced by contact address",
      "comments": [
        "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country"
      ],
      "examples": [
        {
          "value": "123 Sunnybrooke St, Toronto, Ontario, M4P 1L6, Canada"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:sequenced by contact address"
      ],
      "slot_uri": "GENEPIO:0100423",
      "range": "WhitespaceMinimizedString"
    },
    "sequence submitted by": {
      "name": "sequence submitted by",
      "description": "The name of the agency that submitted the sequence to a database.",
      "title": "sequence submitted by",
      "comments": [
        "The name of the agency should be written out in full, (with minor exceptions) and be consistent across multiple submissions. If submitting specimens rather than sequencing data, please put the \"National Microbiology Laboratory (NML)\"."
      ],
      "examples": [
        {
          "value": "Public Health Ontario (PHO)"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "slot_uri": "GENEPIO:0001159",
      "required": true
    },
    "sequence submitter contact email": {
      "name": "sequence submitter contact email",
      "description": "The email address of the agency responsible for submission of the sequence.",
      "title": "sequence submitter contact email",
      "comments": [
        "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca"
      ],
      "examples": [
        {
          "value": "RespLab@lab.ca"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:sequence submitter contact email"
      ],
      "slot_uri": "GENEPIO:0001165",
      "range": "WhitespaceMinimizedString"
    },
    "sequence submitter contact address": {
      "name": "sequence submitter contact address",
      "description": "The mailing address of the agency responsible for submission of the sequence.",
      "title": "sequence submitter contact address",
      "comments": [
        "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country"
      ],
      "examples": [
        {
          "value": "123 Sunnybrooke St, Toronto, Ontario, M4P 1L6, Canada"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Address",
        "NML_LIMS:sequence submitter contact address"
      ],
      "slot_uri": "GENEPIO:0001167",
      "range": "WhitespaceMinimizedString"
    },
    "sample collection date": {
      "name": "sample collection date",
      "description": "The date on which the sample was collected.",
      "title": "sample collection date",
      "todos": [
        ">=2019-10-01",
        "<={today}"
      ],
      "comments": [
        "Sample collection date is critical for surveillance and many types of analyses. Required granularity includes year, month and day. If this date is considered identifiable information, it is acceptable to add \"jitter\" by adding or subtracting a calendar day (acceptable by GISAID). Alternatively, ”received date” may be used as a substitute. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2020-03-16"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Collection date",
        "CNPHI:Patient Sample Collected Date",
        "NML_LIMS:HC_COLLECT_DATE",
        "BIOSAMPLE:collection_date",
        "VirusSeq_Portal:sample collection date"
      ],
      "slot_uri": "GENEPIO:0001174",
      "required": true,
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "sample collection date precision": {
      "name": "sample collection date precision",
      "description": "The precision to which the \"sample collection date\" was provided.",
      "title": "sample collection date precision",
      "comments": [
        "Provide the precision of granularity to the \"day\", \"month\", or \"year\" for the date provided in the \"sample collection date\" field. The \"sample collection date\" will be truncated to the precision specified upon export; \"day\" for \"YYYY-MM-DD\", \"month\" for \"YYYY-MM\", or \"year\" for \"YYYY\"."
      ],
      "examples": [
        {
          "value": "year"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Precision of date collected",
        "NML_LIMS:HC_TEXT2"
      ],
      "slot_uri": "GENEPIO:0001177",
      "required": true,
      "any_of": [
        {
          "range": "sample collection date precision menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "sample received date": {
      "name": "sample received date",
      "description": "The date on which the sample was received.",
      "title": "sample received date",
      "comments": [
        "ISO 8601 standard \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2020-03-20"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:sample received date"
      ],
      "slot_uri": "GENEPIO:0001179",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "geo_loc_name (country)": {
      "name": "geo_loc_name (country)",
      "description": "The country where the sample was collected.",
      "title": "geo_loc_name (country)",
      "comments": [
        "Provide the country name from the controlled vocabulary provided."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Location",
        "CNPHI:Patient Country",
        "NML_LIMS:HC_COUNTRY",
        "BIOSAMPLE:geo_loc_name",
        "VirusSeq_Portal:geo_loc_name (country)"
      ],
      "slot_uri": "GENEPIO:0001181",
      "required": true
    },
    "geo_loc_name (state/province/territory)": {
      "name": "geo_loc_name (state/province/territory)",
      "description": "The state/province/territory where the sample was collected.",
      "title": "geo_loc_name (state/province/territory)",
      "examples": [
        {
          "value": "Saskatchewan"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Patient Province",
        "NML_LIMS:HC_PROVINCE",
        "BIOSAMPLE:geo_loc_name",
        "VirusSeq_Portal:geo_loc_name (state/province/territory)"
      ],
      "slot_uri": "GENEPIO:0001185",
      "required": true
    },
    "organism": {
      "name": "organism",
      "description": "Taxonomic name of the organism.",
      "title": "organism",
      "comments": [
        "Use \"Monkeypox virus\". This value is provided in the template."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Pathogen",
        "NML_LIMS:HC_CURRENT_ID",
        "BIOSAMPLE:organism",
        "VirusSeq_Portal:organism"
      ],
      "slot_uri": "GENEPIO:0001191",
      "required": true
    },
    "isolate": {
      "name": "isolate",
      "description": "Identifier of the specific isolate.",
      "title": "isolate",
      "from_schema": "https://example.com/monkeypox",
      "required": true,
      "any_of": [
        {
          "range": "WhitespaceMinimizedString"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "purpose of sampling": {
      "name": "purpose of sampling",
      "description": "The reason that the sample was collected.",
      "title": "purpose of sampling",
      "comments": [
        "As all samples are taken for diagnostic purposes, \"Diagnostic Testing\" should be chosen from the picklist at this time. The reason why a sample was originally collected may differ from the reason why it was selected for sequencing, which should be indicated in the \"purpose of sequencing\" field."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Reason for Sampling",
        "NML_LIMS:HC_SAMPLE_CATEGORY",
        "BIOSAMPLE:purpose_of_sampling",
        "VirusSeq_Portal:purpose of sampling"
      ],
      "slot_uri": "GENEPIO:0001198",
      "required": true
    },
    "purpose of sampling details": {
      "name": "purpose of sampling details",
      "description": "The description of why the sample was collected, providing specific details.",
      "title": "purpose of sampling details",
      "comments": [
        "Provide an expanded description of why the sample was collected using free text. The description may include the importance of the sample for a particular public health investigation/surveillance activity/research question. If details are not available, provide a null value."
      ],
      "examples": [
        {
          "value": "Symptomology and history suggested Monkeypox diagnosis."
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Details on the Reason for Sampling",
        "NML_LIMS:PH_SAMPLING_DETAILS",
        "BIOSAMPLE:description",
        "VirusSeq_Portal:purpose of sampling details"
      ],
      "slot_uri": "GENEPIO:0001200",
      "required": true,
      "any_of": [
        {
          "range": "WhitespaceMinimizedString"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "NML submitted specimen type": {
      "name": "NML submitted specimen type",
      "description": "The type of specimen submitted to the National Microbiology Laboratory (NML) for testing.",
      "title": "NML submitted specimen type",
      "comments": [
        "This information is required for upload through the CNPHI LaSER system. Select the specimen type from the pick list provided. If sequence data is being submitted rather than a specimen for testing, select “Not Applicable”."
      ],
      "examples": [
        {
          "value": "Nucleic Acid"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Specimen Type",
        "NML_LIMS:PH_SPECIMEN_TYPE"
      ],
      "slot_uri": "GENEPIO:0001204",
      "required": true,
      "any_of": [
        {
          "range": "NML submitted specimen type menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "Related specimen relationship type": {
      "name": "Related specimen relationship type",
      "description": "The relationship of the current specimen to the specimen/sample previously submitted to the repository.",
      "title": "Related specimen relationship type",
      "comments": [
        "Provide the tag that describes how the previous sample is related to the current sample being submitted from the pick list provided, so that the samples can be linked and tracked in the system."
      ],
      "examples": [
        {
          "value": "Previously Submitted"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Related Specimen ID",
        "CNPHI:Related Specimen Relationship Type",
        "NML_LIMS:PH_RELATED_RELATIONSHIP_TYPE"
      ],
      "slot_uri": "GENEPIO:0001209",
      "any_of": [
        {
          "range": "Related specimen relationship type menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "anatomical material": {
      "name": "anatomical material",
      "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
      "title": "anatomical material",
      "comments": [
        "Provide a descriptor if an anatomical material was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Anatomical Material",
        "NML_LIMS:PH_ISOLATION_SITE_DESC",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:anatomical_material",
        "VirusSeq_Portal:anatomical material"
      ],
      "slot_uri": "GENEPIO:0001211",
      "multivalued": true,
      "required": true
    },
    "anatomical part": {
      "name": "anatomical part",
      "description": "An anatomical part of an organism e.g. oropharynx.",
      "title": "anatomical part",
      "comments": [
        "Provide a descriptor if an anatomical part was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Anatomical Site",
        "NML_LIMS:PH_ISOLATION_SITE",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:anatomical_part",
        "VirusSeq_Portal:anatomical part"
      ],
      "slot_uri": "GENEPIO:0001214",
      "multivalued": true,
      "required": true
    },
    "body product": {
      "name": "body product",
      "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
      "title": "body product",
      "comments": [
        "Provide a descriptor if a body product was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Body Product",
        "NML_LIMS:PH_SPECIMEN_SOURCE_DESC",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:body_product",
        "VirusSeq_Portal:body product"
      ],
      "slot_uri": "GENEPIO:0001216",
      "multivalued": true,
      "required": true,
      "any_of": [
        {
          "range": "body product menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "collection device": {
      "name": "collection device",
      "description": "The instrument or container used to collect the sample e.g. swab.",
      "title": "collection device",
      "comments": [
        "Provide a descriptor if a device was used for sampling. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Specimen Collection Matrix",
        "NML_LIMS:PH_SPECIMEN_TYPE_ORIG",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:collection_device",
        "VirusSeq_Portal:collection device"
      ],
      "slot_uri": "GENEPIO:0001234",
      "multivalued": true,
      "required": true
    },
    "collection method": {
      "name": "collection method",
      "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
      "title": "collection method",
      "comments": [
        "Provide a descriptor if a collection method was used for sampling. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Collection Method",
        "NML_LIMS:COLLECTION_METHOD",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:collection_method",
        "VirusSeq_Portal:collection method"
      ],
      "slot_uri": "GENEPIO:0001241",
      "multivalued": true,
      "required": true
    },
    "host (scientific name)": {
      "name": "host (scientific name)",
      "description": "The taxonomic, or scientific name of the host.",
      "title": "host (scientific name)",
      "comments": [
        "Common name or scientific name are required if there was a host. Both can be provided, if known. Use terms from the pick lists in the template. Scientific name e.g. Homo sapiens, If the sample was environmental, put \"not applicable"
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Host",
        "NML_LIMS:host (scientific name)",
        "BIOSAMPLE:host",
        "VirusSeq_Portal:host (scientific name)"
      ],
      "slot_uri": "GENEPIO:0001387",
      "required": true,
      "any_of": [
        {
          "range": "host (scientific name) menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host disease": {
      "name": "host disease",
      "description": "The name of the disease experienced by the host.",
      "title": "host disease",
      "comments": [
        "Select \"Monkeypox\" from the pick list provided in the template."
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Host Disease",
        "NML_LIMS:PH_HOST_DISEASE",
        "BIOSAMPLE:host_disease",
        "VirusSeq_Portal:host disease"
      ],
      "slot_uri": "GENEPIO:0001391",
      "required": true
    },
    "host health state": {
      "name": "host health state",
      "title": "host health state",
      "examples": [
        {
          "value": "Asymptomatic [NCIT:C3833]"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Patient status",
        "BIOSAMPLE:host_health_state"
      ],
      "slot_uri": "GENEPIO:0001388",
      "recommended": true,
      "any_of": [
        {
          "range": "host health state international menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host age": {
      "name": "host age",
      "description": "Age of host at the time of sampling.",
      "title": "host age",
      "comments": [
        "If known, provide age. Age-binning is also acceptable."
      ],
      "examples": [
        {
          "value": "79"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Patient age",
        "BIOSAMPLE:host_age"
      ],
      "slot_uri": "GENEPIO:0001392",
      "recommended": true,
      "any_of": [
        {
          "range": "decimal"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host age unit": {
      "name": "host age unit",
      "description": "The units used to measure the host's age.",
      "title": "host age unit",
      "comments": [
        "If known, provide the age units used to measure the host's age from the pick list."
      ],
      "examples": [
        {
          "value": "year [UO:0000036]"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "BIOSAMPLE:host_age_unit"
      ],
      "slot_uri": "GENEPIO:0001393",
      "recommended": true,
      "any_of": [
        {
          "range": "host age unit international menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host age bin": {
      "name": "host age bin",
      "description": "The age category of the host at the time of sampling.",
      "title": "host age bin",
      "comments": [
        "Age bins in 10 year intervals have been provided. If a host's age cannot be specified due to provacy concerns, an age bin can be used as an alternative."
      ],
      "examples": [
        {
          "value": "50 - 59 [GENEPIO:0100054]"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "BIOSAMPLE:host_age_bin"
      ],
      "slot_uri": "GENEPIO:0001394",
      "recommended": true,
      "any_of": [
        {
          "range": "host age bin international menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host gender": {
      "name": "host gender",
      "description": "The gender of the host at the time of sample collection.",
      "title": "host gender",
      "comments": [
        "If known, select a value from the pick list."
      ],
      "examples": [
        {
          "value": "Male [NCIT:C46109]"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Gender",
        "BIOSAMPLE:host_sex"
      ],
      "slot_uri": "GENEPIO:0001395",
      "recommended": true,
      "any_of": [
        {
          "range": "host gender international menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "travel history": {
      "name": "travel history",
      "description": "Travel history in last six months.",
      "title": "travel history",
      "comments": [
        "Specify the countries (and more granular locations if known, separated by a comma) travelled in the last six months; can include multiple travels. Separate multiple travel events with a semi-colon. List most recent travel first."
      ],
      "examples": [
        {
          "value": "Canada, Vancouver"
        },
        {
          "value": "USA, Seattle"
        },
        {
          "value": "Italy, Milan"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001416",
      "range": "WhitespaceMinimizedString"
    },
    "purpose of sequencing": {
      "name": "purpose of sequencing",
      "description": "The reason that the sample was sequenced.",
      "title": "purpose of sequencing",
      "comments": [
        "The reason why a sample was originally collected may differ from the reason why it was selected for sequencing. The reason a sample was sequenced may provide information about potential biases in sequencing strategy. Provide the purpose of sequencing from the picklist in the template. The reason for sample collection should be indicated in the \"purpose of sampling\" field."
      ],
      "examples": [
        {
          "value": "Specimens attributed to individuals with no known intimate contacts to positive cases",
          "description": "Select \"Targeted surveillance (non-random sampling)\" if the specimen fits any of the following criteria"
        },
        {
          "value": "Specimens attributed to youth/minors <18 yrs."
        },
        {
          "value": "Specimens attributed to vulnerable persons living in transient shelters or congregant settings"
        },
        {
          "value": "Specimens attributed to individuals self-identifying as “female”"
        },
        {
          "value": "Domestic travel surveillance",
          "description": "For specimens with a recent international and/or domestic travel history, please select the most appropriate tag from the following three options"
        },
        {
          "value": "International travel surveillance"
        },
        {
          "value": "Travel-associated surveillance"
        },
        {
          "value": "Cluster/Outbreak investigation",
          "description": "For specimens targeted for sequencing as part of an outbreak investigation, please select"
        },
        {
          "value": "Baseline surveillance (random sampling).",
          "description": "In all other cases use"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Sampling Strategy",
        "CNPHI:Reason for Sequencing",
        "NML_LIMS:PH_REASON_FOR_SEQUENCING",
        "BIOSAMPLE:purpose_of_sequencing",
        "VirusSeq_Portal:purpose of sequencing"
      ],
      "slot_uri": "GENEPIO:0001445",
      "multivalued": true,
      "required": true
    },
    "purpose of sequencing details": {
      "name": "purpose of sequencing details",
      "description": "The description of why the sample was sequenced providing specific details.",
      "title": "purpose of sequencing details",
      "comments": [
        "Provide an expanded description of why the sample was sequenced using free text. The description may include the importance of the sequences for a particular public health investigation/surveillance activity/research question. Suggested standardized descriotions include: Screened due to travel history, Screened due to close contact with infected individual."
      ],
      "examples": [
        {
          "value": "Outbreak in MSM community"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Details on the Reason for Sequencing",
        "NML_LIMS:PH_REASON_FOR_SEQUENCING_DETAILS",
        "VirusSeq_Portal:purpose of sequencing details"
      ],
      "slot_uri": "GENEPIO:0001446",
      "required": true,
      "any_of": [
        {
          "range": "WhitespaceMinimizedString"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "sequencing date": {
      "name": "sequencing date",
      "description": "The date the sample was sequenced.",
      "title": "sequencing date",
      "todos": [
        ">={sample collection date}"
      ],
      "comments": [
        "ISO 8601 standard \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2020-06-22"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_SEQUENCING_DATE"
      ],
      "slot_uri": "GENEPIO:0001447",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "library preparation kit": {
      "name": "library preparation kit",
      "description": "The name of the DNA library preparation kit used to generate the library being sequenced.",
      "title": "library preparation kit",
      "comments": [
        "Provide the name of the library preparation kit used."
      ],
      "examples": [
        {
          "value": "Nextera XT"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_LIBRARY_PREP_KIT"
      ],
      "slot_uri": "GENEPIO:0001450",
      "range": "WhitespaceMinimizedString"
    },
    "sequencing instrument": {
      "name": "sequencing instrument",
      "description": "The model of the sequencing instrument used.",
      "title": "sequencing instrument",
      "comments": [
        "Select a sequencing instrument from the picklist provided in the template."
      ],
      "examples": [
        {
          "value": "Oxford Nanopore MinION"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Sequencing technology",
        "CNPHI:Sequencing Instrument",
        "NML_LIMS:PH_INSTRUMENT_CGN",
        "VirusSeq_Portal:sequencing instrument"
      ],
      "slot_uri": "GENEPIO:0001452",
      "multivalued": true,
      "required": true
    },
    "sequencing protocol": {
      "name": "sequencing protocol",
      "description": "The protocol used to generate the sequence.",
      "title": "sequencing protocol",
      "comments": [
        "Provide a free text description of the methods and materials used to generate the sequence. Suggested text, fill in information where indicated.: \"Viral sequencing was performed following a tiling amplicon strategy using the <fill in> primer scheme. Sequencing was performed using a <fill in> sequencing instrument. Libraries were prepared using <fill in> library kit. \""
      ],
      "examples": [
        {
          "value": "Genomes were generated through amplicon sequencing of 1200 bp amplicons with Freed schema primers. Libraries were created using Illumina DNA Prep kits, and sequence data was produced using Miseq Micro v2 (500 cycles) sequencing kits."
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_TESTING_PROTOCOL",
        "VirusSeq_Portal:sequencing protocol"
      ],
      "slot_uri": "GENEPIO:0001454",
      "range": "WhitespaceMinimizedString"
    },
    "raw sequence data processing method": {
      "name": "raw sequence data processing method",
      "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
      "title": "raw sequence data processing method",
      "comments": [
        "Provide the software name followed by the version e.g. Trimmomatic v. 0.38, Porechop v. 0.2.3"
      ],
      "examples": [
        {
          "value": "Porechop 0.2.3"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_RAW_SEQUENCE_METHOD",
        "VirusSeq_Portal:raw sequence data processing method"
      ],
      "slot_uri": "GENEPIO:0001458",
      "range": "WhitespaceMinimizedString"
    },
    "dehosting method": {
      "name": "dehosting method",
      "description": "The method used to remove host reads from the pathogen sequence.",
      "title": "dehosting method",
      "comments": [
        "Provide the name and version number of the software used to remove host reads."
      ],
      "examples": [
        {
          "value": "Nanostripper"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:PH_DEHOSTING_METHOD",
        "VirusSeq_Portal:dehosting method"
      ],
      "slot_uri": "GENEPIO:0001459",
      "range": "WhitespaceMinimizedString"
    },
    "consensus sequence software name": {
      "name": "consensus sequence software name",
      "description": "The name of software used to generate the consensus sequence.",
      "title": "consensus sequence software name",
      "comments": [
        "Provide the name of the software used to generate the consensus sequence."
      ],
      "examples": [
        {
          "value": "iVar"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Assembly method",
        "CNPHI:consensus sequence",
        "NML_LIMS:PH_CONSENSUS_SEQUENCE",
        "VirusSeq_Portal:consensus sequence software name"
      ],
      "slot_uri": "GENEPIO:0001463",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "consensus sequence software version": {
      "name": "consensus sequence software version",
      "description": "The version of the software used to generate the consensus sequence.",
      "title": "consensus sequence software version",
      "comments": [
        "Provide the version of the software used to generate the consensus sequence."
      ],
      "examples": [
        {
          "value": "1.3"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:consensus sequence",
        "NML_LIMS:PH_CONSENSUS_SEQUENCE_VERSION",
        "VirusSeq_Portal:consensus sequence software version"
      ],
      "slot_uri": "GENEPIO:0001469",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "breadth of coverage value": {
      "name": "breadth of coverage value",
      "description": "The percentage of the reference genome covered by the sequenced data, to a prescribed depth.",
      "title": "breadth of coverage value",
      "comments": [
        "Provide value as a percent."
      ],
      "examples": [
        {
          "value": "95%"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:breadth of coverage value",
        "VirusSeq_Portal:breadth of coverage value"
      ],
      "slot_uri": "GENEPIO:0001472",
      "range": "WhitespaceMinimizedString"
    },
    "depth of coverage value": {
      "name": "depth of coverage value",
      "description": "The average number of reads representing a given nucleotide in the reconstructed sequence.",
      "title": "depth of coverage value",
      "comments": [
        "Provide value as a fold of coverage."
      ],
      "examples": [
        {
          "value": "400x"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Depth of coverage",
        "NML_LIMS:depth of coverage value",
        "VirusSeq_Portal:depth of coverage value"
      ],
      "slot_uri": "GENEPIO:0001474",
      "range": "WhitespaceMinimizedString"
    },
    "depth of coverage threshold": {
      "name": "depth of coverage threshold",
      "description": "The threshold used as a cut-off for the depth of coverage.",
      "title": "depth of coverage threshold",
      "comments": [
        "Provide the threshold fold coverage."
      ],
      "examples": [
        {
          "value": "100x"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:depth of coverage threshold"
      ],
      "slot_uri": "GENEPIO:0001475",
      "range": "WhitespaceMinimizedString"
    },
    "number of base pairs sequenced": {
      "name": "number of base pairs sequenced",
      "description": "The number of total base pairs generated by the sequencing process.",
      "title": "number of base pairs sequenced",
      "comments": [
        "Provide a numerical value (no need to include units)."
      ],
      "examples": [
        {
          "value": "2639019"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:number of base pairs sequenced"
      ],
      "slot_uri": "GENEPIO:0001482",
      "range": "integer",
      "minimum_value": 0
    },
    "assembled genome length": {
      "name": "assembled genome length",
      "description": "Size of the reconstructed genome described as the number of base pairs.",
      "title": "assembled genome length",
      "comments": [
        "Provide a numerical value (no need to include units)."
      ],
      "examples": [
        {
          "value": "197063"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "NML_LIMS:consensus genome length"
      ],
      "slot_uri": "GENEPIO:0001483",
      "range": "integer",
      "minimum_value": 0
    },
    "bioinformatics protocol": {
      "name": "bioinformatics protocol",
      "description": "A description of the overall bioinformatics strategy used.",
      "title": "bioinformatics protocol",
      "comments": [
        "Further details regarding the methods used to process raw data, and/or generate assemblies, and/or generate consensus sequences can. This information can be provided in an SOP or protocol or pipeline/workflow. Provide the name and version number of the protocol, or a GitHub link to a pipeline or workflow."
      ],
      "examples": [
        {
          "value": "https://github.com/phac-nml/ncov2019-artic-nf"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Bioinformatics Protocol",
        "NML_LIMS:PH_BIOINFORMATICS_PROTOCOL",
        "VirusSeq_Portal:bioinformatics protocol"
      ],
      "slot_uri": "GENEPIO:0001489",
      "range": "WhitespaceMinimizedString"
    },
    "authors": {
      "name": "authors",
      "description": "Names of individuals contributing to the processes of sample collection, sequence generation, analysis, and data submission.",
      "title": "authors",
      "comments": [
        "Include the first and last names of all individuals that should be attributed, separated by a comma."
      ],
      "examples": [
        {
          "value": "Tejinder Singh, Fei Hu, Joe Blogs"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "GISAID:Authors",
        "CNPHI:Authors",
        "NML_LIMS:PH_CANCOGEN_AUTHORS"
      ],
      "slot_uri": "GENEPIO:0001517",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "DataHarmonizer provenance": {
      "name": "DataHarmonizer provenance",
      "description": "The DataHarmonizer software version provenance.",
      "title": "DataHarmonizer provenance",
      "comments": [
        "The current software version information will be automatically generated in this field after the user utilizes the \"validate\" function. This information will be generated regardless as to whether the row is valid of not."
      ],
      "examples": [
        {
          "value": "DataHarmonizer provenance: v0.13.21"
        }
      ],
      "from_schema": "https://example.com/monkeypox",
      "exact_mappings": [
        "CNPHI:Additional Comments",
        "NML_LIMS:HC_COMMENTS"
      ],
      "slot_uri": "GENEPIO:0001518",
      "range": "Provenance"
    }
  },
  "classes": {
    "dh_interface": {
      "name": "dh_interface",
      "description": "A DataHarmonizer interface",
      "from_schema": "https://example.com/monkeypox"
    },
    "Monkeypox": {
      "name": "Monkeypox",
      "description": "Canadian specification for Monkeypox clinical virus biosample data gathering",
      "from_schema": "https://example.com/monkeypox",
      "see_also": [
        "template/monkeypox/SOP_Monkeypox.pdf"
      ],
      "is_a": "dh_interface",
      "slot_usage": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "rank": 1,
          "slot_group": "Database Identifiers"
        },
        "Related specimen primary ID": {
          "name": "Related specimen primary ID",
          "rank": 2,
          "slot_group": "Database Identifiers"
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "rank": 3,
          "slot_group": "Database Identifiers"
        },
        "sample collected by": {
          "name": "sample collected by",
          "exact_mappings": [
            "GISAID:Originating lab",
            "CNPHI:Lab Name",
            "NML_LIMS:CUSTOMER",
            "BIOSAMPLE:collected_by",
            "VirusSeq_Portal:sample collected by"
          ],
          "rank": 4,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "sample collected by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "rank": 5,
          "slot_group": "Sample collection and processing"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "rank": 6,
          "slot_group": "Sample collection and processing"
        },
        "sequenced by": {
          "name": "sequenced by",
          "exact_mappings": [
            "NML_LIMS:PH_SEQUENCING_CENTRE",
            "BIOSAMPLE:sequenced_by"
          ],
          "rank": 7,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "sequence submitted by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequenced by contact email": {
          "name": "sequenced by contact email",
          "rank": 8,
          "slot_group": "Sample collection and processing"
        },
        "sequenced by contact address": {
          "name": "sequenced by contact address",
          "rank": 9,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "exact_mappings": [
            "GISAID:Submitting lab",
            "CNPHI:Sequencing Centre",
            "NML_LIMS:PH_SEQUENCING_SUBMITTER",
            "BIOSAMPLE:sequence_submitted_by",
            "VirusSeq_Portal:sequence submitted by"
          ],
          "rank": 10,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "sequence submitted by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "rank": 11,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "rank": 12,
          "slot_group": "Sample collection and processing"
        },
        "sample collection date": {
          "name": "sample collection date",
          "rank": 13,
          "slot_group": "Sample collection and processing"
        },
        "sample collection date precision": {
          "name": "sample collection date precision",
          "rank": 14,
          "slot_group": "Sample collection and processing"
        },
        "sample received date": {
          "name": "sample received date",
          "rank": 15,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "examples": [
            {
              "value": "Canada"
            }
          ],
          "rank": 16,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "geo_loc_name (country) menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "comments": [
            "Provide the province/territory name from the controlled vocabulary provided."
          ],
          "rank": 17,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "geo_loc_name (state/province/territory) menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "organism": {
          "name": "organism",
          "examples": [
            {
              "value": "Monkeypox virus"
            }
          ],
          "rank": 18,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "organism menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "isolate": {
          "name": "isolate",
          "comments": [
            "Provide the GISAID EpiPox virus name, which should be written in the format “hMpxV/Canada/2 digit provincial ISO code-xxxxx/year”. If the province code cannot be shared for privacy reasons, put \"UN\" for \"Unknown\"."
          ],
          "examples": [
            {
              "value": "hMpxV/Canada/UN-NML-12345/2022"
            }
          ],
          "exact_mappings": [
            "GISAID:Virus name",
            "CNPHI:GISAID Virus Name",
            "NML_LIMS:RESULT - CANCOGEN_SUBMISSIONS",
            "BIOSAMPLE:isolate",
            "BIOSAMPLE:GISAID_virus_name",
            "VirusSeq_Portal:isolate",
            "VirusSeq_Portal:fasta header name"
          ],
          "rank": 19,
          "slot_uri": "GENEPIO:0001195",
          "slot_group": "Sample collection and processing"
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "examples": [
            {
              "value": "Diagnostic testing"
            }
          ],
          "rank": 20,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "purpose of sampling menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "rank": 21,
          "slot_group": "Sample collection and processing"
        },
        "NML submitted specimen type": {
          "name": "NML submitted specimen type",
          "rank": 22,
          "slot_group": "Sample collection and processing"
        },
        "Related specimen relationship type": {
          "name": "Related specimen relationship type",
          "rank": 23,
          "slot_group": "Sample collection and processing"
        },
        "anatomical material": {
          "name": "anatomical material",
          "examples": [
            {
              "value": "Lesion (Pustule)"
            }
          ],
          "rank": 24,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "anatomical material menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "anatomical part": {
          "name": "anatomical part",
          "examples": [
            {
              "value": "Genital area"
            }
          ],
          "rank": 25,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "anatomical part menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "body product": {
          "name": "body product",
          "examples": [
            {
              "value": "Pus"
            }
          ],
          "rank": 26,
          "slot_group": "Sample collection and processing"
        },
        "collection device": {
          "name": "collection device",
          "examples": [
            {
              "value": "Swab"
            }
          ],
          "rank": 27,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "collection device menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "collection method": {
          "name": "collection method",
          "examples": [
            {
              "value": "Biopsy"
            }
          ],
          "rank": 28,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "collection method menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "examples": [
            {
              "value": "Homo sapiens"
            }
          ],
          "rank": 29,
          "slot_group": "Host Information"
        },
        "host disease": {
          "name": "host disease",
          "examples": [
            {
              "value": "Monkeypox"
            }
          ],
          "rank": 30,
          "slot_group": "Host Information",
          "any_of": [
            {
              "range": "host disease menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "travel history": {
          "name": "travel history",
          "rank": 31,
          "slot_group": "Host exposure information"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "rank": 32,
          "slot_group": "Sequencing",
          "any_of": [
            {
              "range": "purpose of sequencing menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "rank": 33,
          "slot_group": "Sequencing"
        },
        "sequencing date": {
          "name": "sequencing date",
          "rank": 34,
          "slot_group": "Sequencing",
          "required": true
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "rank": 35,
          "slot_group": "Sequencing"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "rank": 37,
          "slot_group": "Sequencing",
          "any_of": [
            {
              "range": "sequencing instrument international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "rank": 38,
          "slot_group": "Bioinformatics and QC metrics",
          "required": true
        },
        "dehosting method": {
          "name": "dehosting method",
          "rank": 39,
          "slot_group": "Bioinformatics and QC metrics",
          "required": true
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "rank": 40,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "rank": 41,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "rank": 42,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "rank": 43,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "rank": 44,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "rank": 45,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "assembled genome length": {
          "name": "assembled genome length",
          "rank": 46,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "rank": 47,
          "slot_group": "Bioinformatics and QC metrics",
          "required": true
        },
        "authors": {
          "name": "authors",
          "rank": 48,
          "slot_group": "Contributor acknowledgement"
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "rank": 49,
          "slot_group": "Contributor acknowledgement"
        }
      },
      "attributes": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "description": "The user-defined name for the sample.",
          "title": "specimen collector sample ID",
          "from_schema": "https://example.com/monkeypox",
          "rank": 1,
          "slot_uri": "GENEPIO:0001123",
          "identifier": true,
          "alias": "specimen_collector_sample_ID",
          "owner": "Monkeypox",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "Related specimen primary ID": {
          "name": "Related specimen primary ID",
          "description": "The primary ID of a related specimen previously submitted to the repository.",
          "title": "Related specimen primary ID",
          "from_schema": "https://example.com/monkeypox",
          "rank": 2,
          "slot_uri": "GENEPIO:0001128",
          "alias": "Related_specimen_primary_ID",
          "owner": "Monkeypox",
          "slot_group": "Database Identifiers"
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "description": "The GISAID accession number assigned to the sequence.",
          "title": "GISAID accession",
          "from_schema": "https://example.com/monkeypox",
          "rank": 3,
          "slot_uri": "GENEPIO:0001147",
          "alias": "GISAID_accession",
          "owner": "Monkeypox",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "sample collected by": {
          "name": "sample collected by",
          "description": "The name of the agency that collected the original sample.",
          "title": "sample collected by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "GISAID:Originating lab",
            "CNPHI:Lab Name",
            "NML_LIMS:CUSTOMER",
            "BIOSAMPLE:collected_by",
            "VirusSeq_Portal:sample collected by"
          ],
          "rank": 4,
          "slot_uri": "GENEPIO:0001153",
          "alias": "sample_collected_by",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "sample collected by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sample.",
          "title": "sample collector contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 5,
          "slot_uri": "GENEPIO:0001156",
          "alias": "sample_collector_contact_email",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "pattern": "^\\S+@\\S+\\.\\S+$"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "description": "The mailing address of the agency submitting the sample.",
          "title": "sample collector contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 6,
          "slot_uri": "GENEPIO:0001158",
          "alias": "sample_collector_contact_address",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced by": {
          "name": "sequenced by",
          "description": "The name of the agency that generated the sequence.",
          "title": "sequenced by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "NML_LIMS:PH_SEQUENCING_CENTRE",
            "BIOSAMPLE:sequenced_by"
          ],
          "rank": 7,
          "slot_uri": "GENEPIO:0100416",
          "alias": "sequenced_by",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "sequence submitted by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequenced by contact email": {
          "name": "sequenced by contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sequence.",
          "title": "sequenced by contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 8,
          "slot_uri": "GENEPIO:0100422",
          "alias": "sequenced_by_contact_email",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced by contact address": {
          "name": "sequenced by contact address",
          "description": "The mailing address of the agency submitting the sequence.",
          "title": "sequenced by contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 9,
          "slot_uri": "GENEPIO:0100423",
          "alias": "sequenced_by_contact_address",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "description": "The name of the agency that submitted the sequence to a database.",
          "title": "sequence submitted by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "GISAID:Submitting lab",
            "CNPHI:Sequencing Centre",
            "NML_LIMS:PH_SEQUENCING_SUBMITTER",
            "BIOSAMPLE:sequence_submitted_by",
            "VirusSeq_Portal:sequence submitted by"
          ],
          "rank": 10,
          "slot_uri": "GENEPIO:0001159",
          "alias": "sequence_submitted_by",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "sequence submitted by menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "description": "The email address of the agency responsible for submission of the sequence.",
          "title": "sequence submitter contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 11,
          "slot_uri": "GENEPIO:0001165",
          "alias": "sequence_submitter_contact_email",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "description": "The mailing address of the agency responsible for submission of the sequence.",
          "title": "sequence submitter contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 12,
          "slot_uri": "GENEPIO:0001167",
          "alias": "sequence_submitter_contact_address",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample collection date": {
          "name": "sample collection date",
          "description": "The date on which the sample was collected.",
          "title": "sample collection date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 13,
          "slot_uri": "GENEPIO:0001174",
          "alias": "sample_collection_date",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample collection date precision": {
          "name": "sample collection date precision",
          "description": "The precision to which the \"sample collection date\" was provided.",
          "title": "sample collection date precision",
          "from_schema": "https://example.com/monkeypox",
          "rank": 14,
          "slot_uri": "GENEPIO:0001177",
          "alias": "sample_collection_date_precision",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample received date": {
          "name": "sample received date",
          "description": "The date on which the sample was received.",
          "title": "sample received date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 15,
          "slot_uri": "GENEPIO:0001179",
          "alias": "sample_received_date",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "description": "The country where the sample was collected.",
          "title": "geo_loc_name (country)",
          "examples": [
            {
              "value": "Canada"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 16,
          "slot_uri": "GENEPIO:0001181",
          "alias": "geo_loc_name_(country)",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "geo_loc_name (country) menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "description": "The state/province/territory where the sample was collected.",
          "title": "geo_loc_name (state/province/territory)",
          "comments": [
            "Provide the province/territory name from the controlled vocabulary provided."
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 17,
          "slot_uri": "GENEPIO:0001185",
          "alias": "geo_loc_name_(state/province/territory)",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "geo_loc_name (state/province/territory) menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "organism": {
          "name": "organism",
          "description": "Taxonomic name of the organism.",
          "title": "organism",
          "examples": [
            {
              "value": "Monkeypox virus"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 18,
          "slot_uri": "GENEPIO:0001191",
          "alias": "organism",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "organism menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "isolate": {
          "name": "isolate",
          "description": "Identifier of the specific isolate.",
          "title": "isolate",
          "comments": [
            "Provide the GISAID EpiPox virus name, which should be written in the format “hMpxV/Canada/2 digit provincial ISO code-xxxxx/year”. If the province code cannot be shared for privacy reasons, put \"UN\" for \"Unknown\"."
          ],
          "examples": [
            {
              "value": "hMpxV/Canada/UN-NML-12345/2022"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "GISAID:Virus name",
            "CNPHI:GISAID Virus Name",
            "NML_LIMS:RESULT - CANCOGEN_SUBMISSIONS",
            "BIOSAMPLE:isolate",
            "BIOSAMPLE:GISAID_virus_name",
            "VirusSeq_Portal:isolate",
            "VirusSeq_Portal:fasta header name"
          ],
          "rank": 19,
          "slot_uri": "GENEPIO:0001195",
          "alias": "isolate",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "description": "The reason that the sample was collected.",
          "title": "purpose of sampling",
          "examples": [
            {
              "value": "Diagnostic testing"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 20,
          "slot_uri": "GENEPIO:0001198",
          "alias": "purpose_of_sampling",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "purpose of sampling menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "description": "The description of why the sample was collected, providing specific details.",
          "title": "purpose of sampling details",
          "from_schema": "https://example.com/monkeypox",
          "rank": 21,
          "slot_uri": "GENEPIO:0001200",
          "alias": "purpose_of_sampling_details",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "NML submitted specimen type": {
          "name": "NML submitted specimen type",
          "description": "The type of specimen submitted to the National Microbiology Laboratory (NML) for testing.",
          "title": "NML submitted specimen type",
          "from_schema": "https://example.com/monkeypox",
          "rank": 22,
          "slot_uri": "GENEPIO:0001204",
          "alias": "NML_submitted_specimen_type",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "Related specimen relationship type": {
          "name": "Related specimen relationship type",
          "description": "The relationship of the current specimen to the specimen/sample previously submitted to the repository.",
          "title": "Related specimen relationship type",
          "from_schema": "https://example.com/monkeypox",
          "rank": 23,
          "slot_uri": "GENEPIO:0001209",
          "alias": "Related_specimen_relationship_type",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing"
        },
        "anatomical material": {
          "name": "anatomical material",
          "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
          "title": "anatomical material",
          "examples": [
            {
              "value": "Lesion (Pustule)"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 24,
          "slot_uri": "GENEPIO:0001211",
          "multivalued": true,
          "alias": "anatomical_material",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "anatomical material menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "anatomical part": {
          "name": "anatomical part",
          "description": "An anatomical part of an organism e.g. oropharynx.",
          "title": "anatomical part",
          "examples": [
            {
              "value": "Genital area"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 25,
          "slot_uri": "GENEPIO:0001214",
          "multivalued": true,
          "alias": "anatomical_part",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "anatomical part menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "body product": {
          "name": "body product",
          "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
          "title": "body product",
          "examples": [
            {
              "value": "Pus"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 26,
          "slot_uri": "GENEPIO:0001216",
          "multivalued": true,
          "alias": "body_product",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "collection device": {
          "name": "collection device",
          "description": "The instrument or container used to collect the sample e.g. swab.",
          "title": "collection device",
          "examples": [
            {
              "value": "Swab"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 27,
          "slot_uri": "GENEPIO:0001234",
          "multivalued": true,
          "alias": "collection_device",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "collection device menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "collection method": {
          "name": "collection method",
          "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
          "title": "collection method",
          "examples": [
            {
              "value": "Biopsy"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 28,
          "slot_uri": "GENEPIO:0001241",
          "multivalued": true,
          "alias": "collection_method",
          "owner": "Monkeypox",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "collection method menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "description": "The taxonomic, or scientific name of the host.",
          "title": "host (scientific name)",
          "examples": [
            {
              "value": "Homo sapiens"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 29,
          "slot_uri": "GENEPIO:0001387",
          "alias": "host_(scientific_name)",
          "owner": "Monkeypox",
          "slot_group": "Host Information",
          "required": true
        },
        "host disease": {
          "name": "host disease",
          "description": "The name of the disease experienced by the host.",
          "title": "host disease",
          "examples": [
            {
              "value": "Monkeypox"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 30,
          "slot_uri": "GENEPIO:0001391",
          "alias": "host_disease",
          "owner": "Monkeypox",
          "slot_group": "Host Information",
          "required": true,
          "any_of": [
            {
              "range": "host disease menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "travel history": {
          "name": "travel history",
          "description": "Travel history in last six months.",
          "title": "travel history",
          "from_schema": "https://example.com/monkeypox",
          "rank": 31,
          "slot_uri": "GENEPIO:0001416",
          "alias": "travel_history",
          "owner": "Monkeypox",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "description": "The reason that the sample was sequenced.",
          "title": "purpose of sequencing",
          "from_schema": "https://example.com/monkeypox",
          "rank": 32,
          "slot_uri": "GENEPIO:0001445",
          "multivalued": true,
          "alias": "purpose_of_sequencing",
          "owner": "Monkeypox",
          "slot_group": "Sequencing",
          "required": true,
          "any_of": [
            {
              "range": "purpose of sequencing menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "description": "The description of why the sample was sequenced providing specific details.",
          "title": "purpose of sequencing details",
          "from_schema": "https://example.com/monkeypox",
          "rank": 33,
          "slot_uri": "GENEPIO:0001446",
          "alias": "purpose_of_sequencing_details",
          "owner": "Monkeypox",
          "slot_group": "Sequencing",
          "required": true
        },
        "sequencing date": {
          "name": "sequencing date",
          "description": "The date the sample was sequenced.",
          "title": "sequencing date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 34,
          "slot_uri": "GENEPIO:0001447",
          "alias": "sequencing_date",
          "owner": "Monkeypox",
          "slot_group": "Sequencing",
          "required": true
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "description": "The name of the DNA library preparation kit used to generate the library being sequenced.",
          "title": "library preparation kit",
          "from_schema": "https://example.com/monkeypox",
          "rank": 35,
          "slot_uri": "GENEPIO:0001450",
          "alias": "library_preparation_kit",
          "owner": "Monkeypox",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "description": "The model of the sequencing instrument used.",
          "title": "sequencing instrument",
          "from_schema": "https://example.com/monkeypox",
          "rank": 37,
          "slot_uri": "GENEPIO:0001452",
          "multivalued": true,
          "alias": "sequencing_instrument",
          "owner": "Monkeypox",
          "slot_group": "Sequencing",
          "required": true,
          "any_of": [
            {
              "range": "sequencing instrument international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
          "title": "raw sequence data processing method",
          "from_schema": "https://example.com/monkeypox",
          "rank": 38,
          "slot_uri": "GENEPIO:0001458",
          "alias": "raw_sequence_data_processing_method",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "dehosting method": {
          "name": "dehosting method",
          "description": "The method used to remove host reads from the pathogen sequence.",
          "title": "dehosting method",
          "from_schema": "https://example.com/monkeypox",
          "rank": 39,
          "slot_uri": "GENEPIO:0001459",
          "alias": "dehosting_method",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "description": "The name of software used to generate the consensus sequence.",
          "title": "consensus sequence software name",
          "from_schema": "https://example.com/monkeypox",
          "rank": 40,
          "slot_uri": "GENEPIO:0001463",
          "alias": "consensus_sequence_software_name",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "description": "The version of the software used to generate the consensus sequence.",
          "title": "consensus sequence software version",
          "from_schema": "https://example.com/monkeypox",
          "rank": 41,
          "slot_uri": "GENEPIO:0001469",
          "alias": "consensus_sequence_software_version",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "description": "The percentage of the reference genome covered by the sequenced data, to a prescribed depth.",
          "title": "breadth of coverage value",
          "from_schema": "https://example.com/monkeypox",
          "rank": 42,
          "slot_uri": "GENEPIO:0001472",
          "alias": "breadth_of_coverage_value",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "description": "The average number of reads representing a given nucleotide in the reconstructed sequence.",
          "title": "depth of coverage value",
          "from_schema": "https://example.com/monkeypox",
          "rank": 43,
          "slot_uri": "GENEPIO:0001474",
          "alias": "depth_of_coverage_value",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "description": "The threshold used as a cut-off for the depth of coverage.",
          "title": "depth of coverage threshold",
          "from_schema": "https://example.com/monkeypox",
          "rank": 44,
          "slot_uri": "GENEPIO:0001475",
          "alias": "depth_of_coverage_threshold",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "description": "The number of total base pairs generated by the sequencing process.",
          "title": "number of base pairs sequenced",
          "from_schema": "https://example.com/monkeypox",
          "rank": 45,
          "slot_uri": "GENEPIO:0001482",
          "alias": "number_of_base_pairs_sequenced",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "assembled genome length": {
          "name": "assembled genome length",
          "description": "Size of the reconstructed genome described as the number of base pairs.",
          "title": "assembled genome length",
          "from_schema": "https://example.com/monkeypox",
          "rank": 46,
          "slot_uri": "GENEPIO:0001483",
          "alias": "assembled_genome_length",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "description": "A description of the overall bioinformatics strategy used.",
          "title": "bioinformatics protocol",
          "from_schema": "https://example.com/monkeypox",
          "rank": 47,
          "slot_uri": "GENEPIO:0001489",
          "alias": "bioinformatics_protocol",
          "owner": "Monkeypox",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "authors": {
          "name": "authors",
          "description": "Names of individuals contributing to the processes of sample collection, sequence generation, analysis, and data submission.",
          "title": "authors",
          "from_schema": "https://example.com/monkeypox",
          "rank": 48,
          "slot_uri": "GENEPIO:0001517",
          "alias": "authors",
          "owner": "Monkeypox",
          "slot_group": "Contributor acknowledgement",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "description": "The DataHarmonizer software version provenance.",
          "title": "DataHarmonizer provenance",
          "from_schema": "https://example.com/monkeypox",
          "rank": 49,
          "slot_uri": "GENEPIO:0001518",
          "alias": "DataHarmonizer_provenance",
          "owner": "Monkeypox",
          "slot_group": "Contributor acknowledgement",
          "range": "Provenance"
        }
      }
    },
    "Monkeypox_international": {
      "name": "Monkeypox_international",
      "description": "International specification for Monkeypox clinical virus biosample data gathering",
      "from_schema": "https://example.com/monkeypox",
      "is_a": "dh_interface",
      "slot_usage": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "rank": 1,
          "slot_group": "Database Identifiers"
        },
        "GISAID virus name": {
          "name": "GISAID virus name",
          "rank": 2,
          "slot_group": "Database Identifiers"
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "rank": 3,
          "slot_group": "Database Identifiers"
        },
        "sample collected by": {
          "name": "sample collected by",
          "exact_mappings": [
            "GISAID:Originating lab",
            "BIOSAMPLE:collected_by"
          ],
          "rank": 4,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "rank": 5,
          "slot_group": "Sample collection and processing"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "rank": 6,
          "slot_group": "Sample collection and processing"
        },
        "sequenced by": {
          "name": "sequenced by",
          "exact_mappings": [
            "BIOSAMPLE:sequenced_by"
          ],
          "rank": 7,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequenced by contact email": {
          "name": "sequenced by contact email",
          "rank": 8,
          "slot_group": "Sample collection and processing"
        },
        "sequenced by contact address": {
          "name": "sequenced by contact address",
          "rank": 9,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "exact_mappings": [
            "GISAID:Submitting lab",
            "BIOSAMPLE:sequence_submitted_by"
          ],
          "rank": 10,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "rank": 11,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "rank": 12,
          "slot_group": "Sample collection and processing"
        },
        "sample collection date": {
          "name": "sample collection date",
          "rank": 13,
          "slot_group": "Sample collection and processing"
        },
        "sample received date": {
          "name": "sample received date",
          "rank": 14,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "examples": [
            {
              "value": "United States of America [GAZ:00002459]"
            }
          ],
          "rank": 15,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "geo_loc_name (country) international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "comments": [
            "Provide the state/province/territory name from the controlled vocabulary provided."
          ],
          "rank": 17,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "organism": {
          "name": "organism",
          "examples": [
            {
              "value": "Monkeypox virus [NCBITaxon:10244]"
            }
          ],
          "rank": 18,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "organism international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "isolate": {
          "name": "isolate",
          "comments": [
            "This identifier should be an unique, indexed, alpha-numeric ID within your laboratory. If submitted to the INSDC, the \"isolate\" name is propagated throughtout different databases. As such, structure the \"isolate\" name to be ICTV/INSDC compliant in the following format: \"MpxV/host/country/sampleID/date\"."
          ],
          "examples": [
            {
              "value": "MpxV/human/USA/CA-CDPH-001/2020"
            }
          ],
          "exact_mappings": [
            "BIOSAMPLE:isolate"
          ],
          "rank": 19,
          "slot_uri": "GENEPIO:0001644",
          "slot_group": "Sample collection and processing"
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "examples": [
            {
              "value": "Diagnostic testing [GENEPIO:0100002]"
            }
          ],
          "rank": 20,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "purpose of sampling international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "rank": 21,
          "slot_group": "Sample collection and processing"
        },
        "anatomical material": {
          "name": "anatomical material",
          "examples": [
            {
              "value": "Lesion (Pustule) [NCIT:C78582]"
            }
          ],
          "rank": 22,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "anatomical material international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "anatomical part": {
          "name": "anatomical part",
          "examples": [
            {
              "value": "Genital area [BTO:0003358]"
            }
          ],
          "rank": 23,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "anatomical part international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "body product": {
          "name": "body product",
          "examples": [
            {
              "value": "Pus [UBERON:0000177]"
            }
          ],
          "rank": 24,
          "slot_group": "Sample collection and processing"
        },
        "collection device": {
          "name": "collection device",
          "examples": [
            {
              "value": "Swab [GENEPIO:0100027]"
            }
          ],
          "rank": 25,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "collection device international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "collection method": {
          "name": "collection method",
          "examples": [
            {
              "value": "Biopsy [OBI:0002650]"
            }
          ],
          "rank": 26,
          "slot_group": "Sample collection and processing",
          "any_of": [
            {
              "range": "collection method international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "examples": [
            {
              "value": "Homo sapiens [NCBITaxon:9606]"
            }
          ],
          "rank": 27,
          "slot_group": "Host Information"
        },
        "host disease": {
          "name": "host disease",
          "examples": [
            {
              "value": "Monkeypox [MONDO:0002594]"
            }
          ],
          "rank": 28,
          "slot_group": "Host Information",
          "any_of": [
            {
              "range": "host disease international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host health state": {
          "name": "host health state",
          "rank": 29,
          "slot_group": "Host Information"
        },
        "host age": {
          "name": "host age",
          "rank": 30,
          "slot_group": "Host Information"
        },
        "host age unit": {
          "name": "host age unit",
          "rank": 31,
          "slot_group": "Host Information"
        },
        "host age bin": {
          "name": "host age bin",
          "rank": 32,
          "slot_group": "Host Information"
        },
        "host gender": {
          "name": "host gender",
          "rank": 33,
          "slot_group": "Host Information"
        },
        "travel history": {
          "name": "travel history",
          "rank": 34,
          "slot_group": "Host exposure information"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "rank": 35,
          "slot_group": "Sequencing",
          "any_of": [
            {
              "range": "purpose of sequencing international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "rank": 36,
          "slot_group": "Sequencing"
        },
        "sequencing date": {
          "name": "sequencing date",
          "rank": 38,
          "slot_group": "Sequencing"
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "rank": 39,
          "slot_group": "Sequencing"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "rank": 40,
          "slot_group": "Sequencing",
          "any_of": [
            {
              "range": "sequencing instrument international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequencing protocol": {
          "name": "sequencing protocol",
          "rank": 41,
          "slot_group": "Sequencing"
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "rank": 42,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "dehosting method": {
          "name": "dehosting method",
          "rank": 43,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "rank": 44,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "rank": 45,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "rank": 46,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "rank": 47,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "rank": 48,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "rank": 49,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "assembled genome length": {
          "name": "assembled genome length",
          "rank": 50,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "rank": 51,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "authors": {
          "name": "authors",
          "rank": 52,
          "slot_group": "Contributor acknowledgement"
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "rank": 53,
          "slot_group": "Contributor acknowledgement"
        }
      },
      "attributes": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "description": "The user-defined name for the sample.",
          "title": "specimen collector sample ID",
          "from_schema": "https://example.com/monkeypox",
          "rank": 1,
          "slot_uri": "GENEPIO:0001123",
          "identifier": true,
          "alias": "specimen_collector_sample_ID",
          "owner": "Monkeypox_international",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "GISAID virus name": {
          "name": "GISAID virus name",
          "description": "Identifier of the specific isolate.",
          "title": "GISAID virus name",
          "from_schema": "https://example.com/monkeypox",
          "rank": 2,
          "slot_uri": "GENEPIO:0100282",
          "alias": "GISAID_virus_name",
          "owner": "Monkeypox_international",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString"
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "description": "The GISAID accession number assigned to the sequence.",
          "title": "GISAID accession",
          "from_schema": "https://example.com/monkeypox",
          "rank": 3,
          "slot_uri": "GENEPIO:0001147",
          "alias": "GISAID_accession",
          "owner": "Monkeypox_international",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "sample collected by": {
          "name": "sample collected by",
          "description": "The name of the agency that collected the original sample.",
          "title": "sample collected by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "GISAID:Originating lab",
            "BIOSAMPLE:collected_by"
          ],
          "rank": 4,
          "slot_uri": "GENEPIO:0001153",
          "alias": "sample_collected_by",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sample.",
          "title": "sample collector contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 5,
          "slot_uri": "GENEPIO:0001156",
          "alias": "sample_collector_contact_email",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "pattern": "^\\S+@\\S+\\.\\S+$"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "description": "The mailing address of the agency submitting the sample.",
          "title": "sample collector contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 6,
          "slot_uri": "GENEPIO:0001158",
          "alias": "sample_collector_contact_address",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced by": {
          "name": "sequenced by",
          "description": "The name of the agency that generated the sequence.",
          "title": "sequenced by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "BIOSAMPLE:sequenced_by"
          ],
          "rank": 7,
          "slot_uri": "GENEPIO:0100416",
          "alias": "sequenced_by",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequenced by contact email": {
          "name": "sequenced by contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sequence.",
          "title": "sequenced by contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 8,
          "slot_uri": "GENEPIO:0100422",
          "alias": "sequenced_by_contact_email",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced by contact address": {
          "name": "sequenced by contact address",
          "description": "The mailing address of the agency submitting the sequence.",
          "title": "sequenced by contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 9,
          "slot_uri": "GENEPIO:0100423",
          "alias": "sequenced_by_contact_address",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "description": "The name of the agency that submitted the sequence to a database.",
          "title": "sequence submitted by",
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "GISAID:Submitting lab",
            "BIOSAMPLE:sequence_submitted_by"
          ],
          "rank": 10,
          "slot_uri": "GENEPIO:0001159",
          "alias": "sequence_submitted_by",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "description": "The email address of the agency responsible for submission of the sequence.",
          "title": "sequence submitter contact email",
          "from_schema": "https://example.com/monkeypox",
          "rank": 11,
          "slot_uri": "GENEPIO:0001165",
          "alias": "sequence_submitter_contact_email",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "description": "The mailing address of the agency responsible for submission of the sequence.",
          "title": "sequence submitter contact address",
          "from_schema": "https://example.com/monkeypox",
          "rank": 12,
          "slot_uri": "GENEPIO:0001167",
          "alias": "sequence_submitter_contact_address",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample collection date": {
          "name": "sample collection date",
          "description": "The date on which the sample was collected.",
          "title": "sample collection date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 13,
          "slot_uri": "GENEPIO:0001174",
          "alias": "sample_collection_date",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample received date": {
          "name": "sample received date",
          "description": "The date on which the sample was received.",
          "title": "sample received date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 14,
          "slot_uri": "GENEPIO:0001179",
          "alias": "sample_received_date",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "description": "The country where the sample was collected.",
          "title": "geo_loc_name (country)",
          "examples": [
            {
              "value": "United States of America [GAZ:00002459]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 15,
          "slot_uri": "GENEPIO:0001181",
          "alias": "geo_loc_name_(country)",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "geo_loc_name (country) international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "description": "The state/province/territory where the sample was collected.",
          "title": "geo_loc_name (state/province/territory)",
          "comments": [
            "Provide the state/province/territory name from the controlled vocabulary provided."
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 17,
          "slot_uri": "GENEPIO:0001185",
          "alias": "geo_loc_name_(state/province/territory)",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "WhitespaceMinimizedString"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "organism": {
          "name": "organism",
          "description": "Taxonomic name of the organism.",
          "title": "organism",
          "examples": [
            {
              "value": "Monkeypox virus [NCBITaxon:10244]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 18,
          "slot_uri": "GENEPIO:0001191",
          "alias": "organism",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "organism international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "isolate": {
          "name": "isolate",
          "description": "Identifier of the specific isolate.",
          "title": "isolate",
          "comments": [
            "This identifier should be an unique, indexed, alpha-numeric ID within your laboratory. If submitted to the INSDC, the \"isolate\" name is propagated throughtout different databases. As such, structure the \"isolate\" name to be ICTV/INSDC compliant in the following format: \"MpxV/host/country/sampleID/date\"."
          ],
          "examples": [
            {
              "value": "MpxV/human/USA/CA-CDPH-001/2020"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "exact_mappings": [
            "BIOSAMPLE:isolate"
          ],
          "rank": 19,
          "slot_uri": "GENEPIO:0001644",
          "alias": "isolate",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "description": "The reason that the sample was collected.",
          "title": "purpose of sampling",
          "examples": [
            {
              "value": "Diagnostic testing [GENEPIO:0100002]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 20,
          "slot_uri": "GENEPIO:0001198",
          "alias": "purpose_of_sampling",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "purpose of sampling international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "description": "The description of why the sample was collected, providing specific details.",
          "title": "purpose of sampling details",
          "from_schema": "https://example.com/monkeypox",
          "rank": 21,
          "slot_uri": "GENEPIO:0001200",
          "alias": "purpose_of_sampling_details",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "anatomical material": {
          "name": "anatomical material",
          "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
          "title": "anatomical material",
          "examples": [
            {
              "value": "Lesion (Pustule) [NCIT:C78582]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 22,
          "slot_uri": "GENEPIO:0001211",
          "multivalued": true,
          "alias": "anatomical_material",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "anatomical material international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "anatomical part": {
          "name": "anatomical part",
          "description": "An anatomical part of an organism e.g. oropharynx.",
          "title": "anatomical part",
          "examples": [
            {
              "value": "Genital area [BTO:0003358]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 23,
          "slot_uri": "GENEPIO:0001214",
          "multivalued": true,
          "alias": "anatomical_part",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "anatomical part international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "body product": {
          "name": "body product",
          "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
          "title": "body product",
          "examples": [
            {
              "value": "Pus [UBERON:0000177]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 24,
          "slot_uri": "GENEPIO:0001216",
          "multivalued": true,
          "alias": "body_product",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "collection device": {
          "name": "collection device",
          "description": "The instrument or container used to collect the sample e.g. swab.",
          "title": "collection device",
          "examples": [
            {
              "value": "Swab [GENEPIO:0100027]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 25,
          "slot_uri": "GENEPIO:0001234",
          "multivalued": true,
          "alias": "collection_device",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "collection device international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "collection method": {
          "name": "collection method",
          "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
          "title": "collection method",
          "examples": [
            {
              "value": "Biopsy [OBI:0002650]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 26,
          "slot_uri": "GENEPIO:0001241",
          "multivalued": true,
          "alias": "collection_method",
          "owner": "Monkeypox_international",
          "slot_group": "Sample collection and processing",
          "required": true,
          "any_of": [
            {
              "range": "collection method international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "description": "The taxonomic, or scientific name of the host.",
          "title": "host (scientific name)",
          "examples": [
            {
              "value": "Homo sapiens [NCBITaxon:9606]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 27,
          "slot_uri": "GENEPIO:0001387",
          "alias": "host_(scientific_name)",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "required": true
        },
        "host disease": {
          "name": "host disease",
          "description": "The name of the disease experienced by the host.",
          "title": "host disease",
          "examples": [
            {
              "value": "Monkeypox [MONDO:0002594]"
            }
          ],
          "from_schema": "https://example.com/monkeypox",
          "rank": 28,
          "slot_uri": "GENEPIO:0001391",
          "alias": "host_disease",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "required": true,
          "any_of": [
            {
              "range": "host disease international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "host health state": {
          "name": "host health state",
          "title": "host health state",
          "from_schema": "https://example.com/monkeypox",
          "rank": 29,
          "slot_uri": "GENEPIO:0001388",
          "alias": "host_health_state",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "recommended": true
        },
        "host age": {
          "name": "host age",
          "description": "Age of host at the time of sampling.",
          "title": "host age",
          "from_schema": "https://example.com/monkeypox",
          "rank": 30,
          "slot_uri": "GENEPIO:0001392",
          "alias": "host_age",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "recommended": true
        },
        "host age unit": {
          "name": "host age unit",
          "description": "The units used to measure the host's age.",
          "title": "host age unit",
          "from_schema": "https://example.com/monkeypox",
          "rank": 31,
          "slot_uri": "GENEPIO:0001393",
          "alias": "host_age_unit",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "recommended": true
        },
        "host age bin": {
          "name": "host age bin",
          "description": "The age category of the host at the time of sampling.",
          "title": "host age bin",
          "from_schema": "https://example.com/monkeypox",
          "rank": 32,
          "slot_uri": "GENEPIO:0001394",
          "alias": "host_age_bin",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "recommended": true
        },
        "host gender": {
          "name": "host gender",
          "description": "The gender of the host at the time of sample collection.",
          "title": "host gender",
          "from_schema": "https://example.com/monkeypox",
          "rank": 33,
          "slot_uri": "GENEPIO:0001395",
          "alias": "host_gender",
          "owner": "Monkeypox_international",
          "slot_group": "Host Information",
          "recommended": true
        },
        "travel history": {
          "name": "travel history",
          "description": "Travel history in last six months.",
          "title": "travel history",
          "from_schema": "https://example.com/monkeypox",
          "rank": 34,
          "slot_uri": "GENEPIO:0001416",
          "alias": "travel_history",
          "owner": "Monkeypox_international",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "description": "The reason that the sample was sequenced.",
          "title": "purpose of sequencing",
          "from_schema": "https://example.com/monkeypox",
          "rank": 35,
          "slot_uri": "GENEPIO:0001445",
          "multivalued": true,
          "alias": "purpose_of_sequencing",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing",
          "required": true,
          "any_of": [
            {
              "range": "purpose of sequencing international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "description": "The description of why the sample was sequenced providing specific details.",
          "title": "purpose of sequencing details",
          "from_schema": "https://example.com/monkeypox",
          "rank": 36,
          "slot_uri": "GENEPIO:0001446",
          "alias": "purpose_of_sequencing_details",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing",
          "required": true
        },
        "sequencing date": {
          "name": "sequencing date",
          "description": "The date the sample was sequenced.",
          "title": "sequencing date",
          "from_schema": "https://example.com/monkeypox",
          "rank": 38,
          "slot_uri": "GENEPIO:0001447",
          "alias": "sequencing_date",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing"
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "description": "The name of the DNA library preparation kit used to generate the library being sequenced.",
          "title": "library preparation kit",
          "from_schema": "https://example.com/monkeypox",
          "rank": 39,
          "slot_uri": "GENEPIO:0001450",
          "alias": "library_preparation_kit",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "description": "The model of the sequencing instrument used.",
          "title": "sequencing instrument",
          "from_schema": "https://example.com/monkeypox",
          "rank": 40,
          "slot_uri": "GENEPIO:0001452",
          "multivalued": true,
          "alias": "sequencing_instrument",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing",
          "required": true,
          "any_of": [
            {
              "range": "sequencing instrument international menu"
            },
            {
              "range": "null value menu"
            }
          ]
        },
        "sequencing protocol": {
          "name": "sequencing protocol",
          "description": "The protocol used to generate the sequence.",
          "title": "sequencing protocol",
          "from_schema": "https://example.com/monkeypox",
          "rank": 41,
          "slot_uri": "GENEPIO:0001454",
          "alias": "sequencing_protocol",
          "owner": "Monkeypox_international",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
          "title": "raw sequence data processing method",
          "from_schema": "https://example.com/monkeypox",
          "rank": 42,
          "slot_uri": "GENEPIO:0001458",
          "alias": "raw_sequence_data_processing_method",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "dehosting method": {
          "name": "dehosting method",
          "description": "The method used to remove host reads from the pathogen sequence.",
          "title": "dehosting method",
          "from_schema": "https://example.com/monkeypox",
          "rank": 43,
          "slot_uri": "GENEPIO:0001459",
          "alias": "dehosting_method",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "description": "The name of software used to generate the consensus sequence.",
          "title": "consensus sequence software name",
          "from_schema": "https://example.com/monkeypox",
          "rank": 44,
          "slot_uri": "GENEPIO:0001463",
          "alias": "consensus_sequence_software_name",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "description": "The version of the software used to generate the consensus sequence.",
          "title": "consensus sequence software version",
          "from_schema": "https://example.com/monkeypox",
          "rank": 45,
          "slot_uri": "GENEPIO:0001469",
          "alias": "consensus_sequence_software_version",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "description": "The percentage of the reference genome covered by the sequenced data, to a prescribed depth.",
          "title": "breadth of coverage value",
          "from_schema": "https://example.com/monkeypox",
          "rank": 46,
          "slot_uri": "GENEPIO:0001472",
          "alias": "breadth_of_coverage_value",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "description": "The average number of reads representing a given nucleotide in the reconstructed sequence.",
          "title": "depth of coverage value",
          "from_schema": "https://example.com/monkeypox",
          "rank": 47,
          "slot_uri": "GENEPIO:0001474",
          "alias": "depth_of_coverage_value",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "description": "The threshold used as a cut-off for the depth of coverage.",
          "title": "depth of coverage threshold",
          "from_schema": "https://example.com/monkeypox",
          "rank": 48,
          "slot_uri": "GENEPIO:0001475",
          "alias": "depth_of_coverage_threshold",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "description": "The number of total base pairs generated by the sequencing process.",
          "title": "number of base pairs sequenced",
          "from_schema": "https://example.com/monkeypox",
          "rank": 49,
          "slot_uri": "GENEPIO:0001482",
          "alias": "number_of_base_pairs_sequenced",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "assembled genome length": {
          "name": "assembled genome length",
          "description": "Size of the reconstructed genome described as the number of base pairs.",
          "title": "assembled genome length",
          "from_schema": "https://example.com/monkeypox",
          "rank": 50,
          "slot_uri": "GENEPIO:0001483",
          "alias": "assembled_genome_length",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "description": "A description of the overall bioinformatics strategy used.",
          "title": "bioinformatics protocol",
          "from_schema": "https://example.com/monkeypox",
          "rank": 51,
          "slot_uri": "GENEPIO:0001489",
          "alias": "bioinformatics_protocol",
          "owner": "Monkeypox_international",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "authors": {
          "name": "authors",
          "description": "Names of individuals contributing to the processes of sample collection, sequence generation, analysis, and data submission.",
          "title": "authors",
          "from_schema": "https://example.com/monkeypox",
          "rank": 52,
          "slot_uri": "GENEPIO:0001517",
          "alias": "authors",
          "owner": "Monkeypox_international",
          "slot_group": "Contributor acknowledgement",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "description": "The DataHarmonizer software version provenance.",
          "title": "DataHarmonizer provenance",
          "from_schema": "https://example.com/monkeypox",
          "rank": 53,
          "slot_uri": "GENEPIO:0001518",
          "alias": "DataHarmonizer_provenance",
          "owner": "Monkeypox_international",
          "slot_group": "Contributor acknowledgement",
          "range": "Provenance"
        }
      }
    }
  },
  "source_file": "schema.yaml",
  "settings": {
    "Title_Case": {
      "setting_key": "Title_Case",
      "setting_value": "(((?<=\\b)[^a-z\\W]\\w*?|[\\W])+)"
    },
    "UPPER_CASE": {
      "setting_key": "UPPER_CASE",
      "setting_value": "[A-Z\\W\\d_]*"
    },
    "lower_case": {
      "setting_key": "lower_case",
      "setting_value": "[a-z\\W\\d_]*"
    }
  },
  "@type": "SchemaDefinition"
}