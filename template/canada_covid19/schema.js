var SCHEMA = {
  "name": "CanCOGeN_Covid-19",
  "description": "",
  "id": "https://example.com/CanCOGeN_Covid-19",
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
  "default_prefix": "https://example.com/CanCOGeN_Covid-19/",
  "types": {
    "WhiteSpaceMinimizedString": {
      "name": "WhiteSpaceMinimizedString",
      "description": "A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).",
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
    "umbrella bioproject accession menu": {
      "name": "umbrella bioproject accession menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "PRJNA623807": {
          "text": "PRJNA623807"
        }
      }
    },
    "null value menu": {
      "name": "null value menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "host age unit menu": {
      "name": "host age unit menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "month": {
          "text": "month",
          "meaning": "UO:0000035"
        },
        "year": {
          "text": "year",
          "meaning": "UO:0000036"
        }
      }
    },
    "sample collection date precision menu": {
      "name": "sample collection date precision menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "biomaterial extracted menu": {
      "name": "biomaterial extracted menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "RNA (total)": {
          "text": "RNA (total)",
          "meaning": "OBI:0000895"
        },
        "RNA (poly-A)": {
          "text": "RNA (poly-A)",
          "meaning": "OBI:0000869"
        },
        "RNA (ribo-depleted)": {
          "text": "RNA (ribo-depleted)",
          "meaning": "OBI:0002627"
        },
        "mRNA (messenger RNA)": {
          "text": "mRNA (messenger RNA)",
          "meaning": "GENEPIO:0100104"
        },
        "mRNA (cDNA)": {
          "text": "mRNA (cDNA)",
          "meaning": "OBI:0002754"
        }
      }
    },
    "signs and symptoms menu": {
      "name": "signs and symptoms menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Abnormal lung auscultation": {
          "text": "Abnormal lung auscultation",
          "meaning": "HP:0030829"
        },
        "Abnormality of taste sensation": {
          "text": "Abnormality of taste sensation",
          "meaning": "HP:0000223"
        },
        "Ageusia (complete loss of taste)": {
          "text": "Ageusia (complete loss of taste)",
          "meaning": "HP:0041051",
          "is_a": "Abnormality of taste sensation"
        },
        "Parageusia (distorted sense of taste)": {
          "text": "Parageusia (distorted sense of taste)",
          "meaning": "HP:0031249",
          "is_a": "Abnormality of taste sensation"
        },
        "Hypogeusia (reduced sense of taste)": {
          "text": "Hypogeusia (reduced sense of taste)",
          "meaning": "HP:0000224",
          "is_a": "Abnormality of taste sensation"
        },
        "Abnormality of the sense of smell": {
          "text": "Abnormality of the sense of smell",
          "meaning": "HP:0004408"
        },
        "Anosmia (lost sense of smell)": {
          "text": "Anosmia (lost sense of smell)",
          "meaning": "HP:0000458",
          "is_a": "Abnormality of the sense of smell"
        },
        "Hyposmia (reduced sense of smell)": {
          "text": "Hyposmia (reduced sense of smell)",
          "meaning": "HP:0004409",
          "is_a": "Abnormality of the sense of smell"
        },
        "Acute Respiratory Distress Syndrome": {
          "text": "Acute Respiratory Distress Syndrome",
          "meaning": "HP:0033677",
          "exact_mappings": [
            "CNPHI:ARDS"
          ]
        },
        "Altered mental status": {
          "text": "Altered mental status",
          "meaning": "HP:0011446"
        },
        "Cognitive impairment": {
          "text": "Cognitive impairment",
          "meaning": "HP:0100543",
          "is_a": "Altered mental status"
        },
        "Coma": {
          "text": "Coma",
          "meaning": "HP:0001259",
          "is_a": "Altered mental status"
        },
        "Confusion": {
          "text": "Confusion",
          "meaning": "HP:0001289",
          "is_a": "Altered mental status"
        },
        "Delirium (sudden severe confusion)": {
          "text": "Delirium (sudden severe confusion)",
          "meaning": "HP:0031258",
          "is_a": "Confusion"
        },
        "Inability to arouse (inability to stay awake)": {
          "text": "Inability to arouse (inability to stay awake)",
          "meaning": "GENEPIO:0100061",
          "is_a": "Altered mental status"
        },
        "Irritability": {
          "text": "Irritability",
          "meaning": "HP:0000737",
          "is_a": "Altered mental status"
        },
        "Loss of speech": {
          "text": "Loss of speech",
          "meaning": "HP:0002371",
          "is_a": "Altered mental status"
        },
        "Arrhythmia": {
          "text": "Arrhythmia",
          "meaning": "HP:0011675"
        },
        "Asthenia (generalized weakness)": {
          "text": "Asthenia (generalized weakness)",
          "meaning": "HP:0025406"
        },
        "Chest tightness or pressure": {
          "text": "Chest tightness or pressure",
          "meaning": "HP:0031352"
        },
        "Rigors (fever shakes)": {
          "text": "Rigors (fever shakes)",
          "meaning": "HP:0025145",
          "is_a": "Chest tightness or pressure"
        },
        "Chills (sudden cold sensation)": {
          "text": "Chills (sudden cold sensation)",
          "meaning": "HP:0025143",
          "exact_mappings": [
            "CNPHI:Chills"
          ]
        },
        "Conjunctival injection": {
          "text": "Conjunctival injection",
          "meaning": "HP:0030953"
        },
        "Conjunctivitis (pink eye)": {
          "text": "Conjunctivitis (pink eye)",
          "meaning": "HP:0000509",
          "exact_mappings": [
            "CNPHI:Conjunctivitis"
          ]
        },
        "Coryza (rhinitis)": {
          "text": "Coryza (rhinitis)",
          "meaning": "MP:0001867"
        },
        "Cough": {
          "text": "Cough",
          "meaning": "HP:0012735"
        },
        "Nonproductive cough (dry cough)": {
          "text": "Nonproductive cough (dry cough)",
          "meaning": "HP:0031246",
          "is_a": "Cough"
        },
        "Productive cough (wet cough)": {
          "text": "Productive cough (wet cough)",
          "meaning": "HP:0031245",
          "is_a": "Cough"
        },
        "Cyanosis (blueish skin discolouration)": {
          "text": "Cyanosis (blueish skin discolouration)",
          "meaning": "HP:0000961"
        },
        "Acrocyanosis": {
          "text": "Acrocyanosis",
          "meaning": "HP:0001063",
          "is_a": "Cyanosis (blueish skin discolouration)"
        },
        "Circumoral cyanosis (bluish around mouth)": {
          "text": "Circumoral cyanosis (bluish around mouth)",
          "meaning": "HP:0032556",
          "is_a": "Acrocyanosis"
        },
        "Cyanotic face (bluish face)": {
          "text": "Cyanotic face (bluish face)",
          "meaning": "GENEPIO:0100062",
          "is_a": "Acrocyanosis"
        },
        "Central Cyanosis": {
          "text": "Central Cyanosis",
          "meaning": "GENEPIO:0100063",
          "is_a": "Cyanosis (blueish skin discolouration)"
        },
        "Cyanotic lips (bluish lips)": {
          "text": "Cyanotic lips (bluish lips)",
          "meaning": "GENEPIO:0100064",
          "is_a": "Central Cyanosis"
        },
        "Peripheral Cyanosis": {
          "text": "Peripheral Cyanosis",
          "meaning": "GENEPIO:0100065",
          "is_a": "Cyanosis (blueish skin discolouration)"
        },
        "Dyspnea (breathing difficulty)": {
          "text": "Dyspnea (breathing difficulty)",
          "meaning": "HP:0002094"
        },
        "Diarrhea (watery stool)": {
          "text": "Diarrhea (watery stool)",
          "meaning": "HP:0002014",
          "exact_mappings": [
            "CNPHI:Diarrhea, watery"
          ]
        },
        "Dry gangrene": {
          "text": "Dry gangrene",
          "meaning": "MP:0031127"
        },
        "Encephalitis (brain inflammation)": {
          "text": "Encephalitis (brain inflammation)",
          "meaning": "HP:0002383",
          "exact_mappings": [
            "CNPHI:Encephalitis"
          ]
        },
        "Encephalopathy": {
          "text": "Encephalopathy",
          "meaning": "HP:0001298"
        },
        "Fatigue (tiredness)": {
          "text": "Fatigue (tiredness)",
          "meaning": "HP:0012378",
          "exact_mappings": [
            "CNPHI:Fatigue"
          ]
        },
        "Fever": {
          "text": "Fever",
          "meaning": "HP:0001945"
        },
        "Fever (>=38°C)": {
          "text": "Fever (>=38°C)",
          "meaning": "GENEPIO:0100066",
          "is_a": "Fever",
          "exact_mappings": [
            "CNPHI:Fever"
          ]
        },
        "Glossitis (inflammation of the tongue)": {
          "text": "Glossitis (inflammation of the tongue)",
          "meaning": "HP:0000206"
        },
        "Ground Glass Opacities (GGO)": {
          "text": "Ground Glass Opacities (GGO)",
          "meaning": "GENEPIO:0100067"
        },
        "Headache": {
          "text": "Headache",
          "meaning": "HP:0002315"
        },
        "Hemoptysis (coughing up blood)": {
          "text": "Hemoptysis (coughing up blood)",
          "meaning": "HP:0002105"
        },
        "Hypocapnia": {
          "text": "Hypocapnia",
          "meaning": "HP:0012417"
        },
        "Hypotension (low blood pressure)": {
          "text": "Hypotension (low blood pressure)",
          "meaning": "HP:0002615"
        },
        "Hypoxemia (low blood oxygen)": {
          "text": "Hypoxemia (low blood oxygen)",
          "meaning": "HP:0012418"
        },
        "Silent hypoxemia": {
          "text": "Silent hypoxemia",
          "meaning": "GENEPIO:0100068",
          "is_a": "Hypoxemia (low blood oxygen)"
        },
        "Internal hemorrhage (internal bleeding)": {
          "text": "Internal hemorrhage (internal bleeding)",
          "meaning": "HP:0011029"
        },
        "Loss of Fine Movements": {
          "text": "Loss of Fine Movements",
          "meaning": "NCIT:C121416"
        },
        "Low appetite": {
          "text": "Low appetite",
          "meaning": "HP:0004396"
        },
        "Malaise (general discomfort/unease)": {
          "text": "Malaise (general discomfort/unease)",
          "meaning": "HP:0033834"
        },
        "Meningismus/nuchal rigidity": {
          "text": "Meningismus/nuchal rigidity",
          "meaning": "HP:0031179"
        },
        "Muscle weakness": {
          "text": "Muscle weakness",
          "meaning": "HP:0001324"
        },
        "Nasal obstruction (stuffy nose)": {
          "text": "Nasal obstruction (stuffy nose)",
          "meaning": "HP:0001742"
        },
        "Nausea": {
          "text": "Nausea",
          "meaning": "HP:0002018"
        },
        "Nose bleed": {
          "text": "Nose bleed",
          "meaning": "HP:0000421"
        },
        "Otitis": {
          "text": "Otitis",
          "meaning": "GENEPIO:0100069"
        },
        "Pain": {
          "text": "Pain",
          "meaning": "HP:0012531"
        },
        "Abdominal pain": {
          "text": "Abdominal pain",
          "meaning": "HP:0002027",
          "is_a": "Pain"
        },
        "Arthralgia (painful joints)": {
          "text": "Arthralgia (painful joints)",
          "meaning": "HP:0002829",
          "is_a": "Pain"
        },
        "Chest pain": {
          "text": "Chest pain",
          "meaning": "HP:0100749",
          "is_a": "Pain"
        },
        "Pleuritic chest pain": {
          "text": "Pleuritic chest pain",
          "meaning": "HP:0033771",
          "is_a": "Chest pain"
        },
        "Myalgia (muscle pain)": {
          "text": "Myalgia (muscle pain)",
          "meaning": "HP:0003326",
          "is_a": "Pain"
        },
        "Pharyngitis (sore throat)": {
          "text": "Pharyngitis (sore throat)",
          "meaning": "HP:0025439"
        },
        "Pharyngeal exudate": {
          "text": "Pharyngeal exudate",
          "meaning": "GENEPIO:0100070"
        },
        "Pleural effusion": {
          "text": "Pleural effusion",
          "meaning": "HP:0002202"
        },
        "Pneumonia": {
          "text": "Pneumonia",
          "meaning": "HP:0002090"
        },
        "Pseudo-chilblains": {
          "text": "Pseudo-chilblains",
          "meaning": "HP:0033696"
        },
        "Pseudo-chilblains on fingers (covid fingers)": {
          "text": "Pseudo-chilblains on fingers (covid fingers)",
          "meaning": "GENEPIO:0100072",
          "is_a": "Pseudo-chilblains"
        },
        "Pseudo-chilblains on toes (covid toes)": {
          "text": "Pseudo-chilblains on toes (covid toes)",
          "meaning": "GENEPIO:0100073",
          "is_a": "Pseudo-chilblains"
        },
        "Rash": {
          "text": "Rash",
          "meaning": "HP:0000988"
        },
        "Rhinorrhea (runny nose)": {
          "text": "Rhinorrhea (runny nose)",
          "meaning": "HP:0031417"
        },
        "Seizure": {
          "text": "Seizure",
          "meaning": "HP:0001250"
        },
        "Motor seizure": {
          "text": "Motor seizure",
          "meaning": "HP:0020219",
          "is_a": "Seizure"
        },
        "Shivering (involuntary muscle twitching)": {
          "text": "Shivering (involuntary muscle twitching)",
          "meaning": "HP:0025144"
        },
        "Slurred speech": {
          "text": "Slurred speech",
          "meaning": "HP:0001350"
        },
        "Sneezing": {
          "text": "Sneezing",
          "meaning": "HP:0025095"
        },
        "Sputum Production": {
          "text": "Sputum Production",
          "meaning": "HP:0033709"
        },
        "Stroke": {
          "text": "Stroke",
          "meaning": "HP:0001297"
        },
        "Swollen Lymph Nodes": {
          "text": "Swollen Lymph Nodes",
          "meaning": "HP:0002716"
        },
        "Tachypnea (accelerated respiratory rate)": {
          "text": "Tachypnea (accelerated respiratory rate)",
          "meaning": "HP:0002789"
        },
        "Vertigo (dizziness)": {
          "text": "Vertigo (dizziness)",
          "meaning": "HP:0002321"
        },
        "Vomiting (throwing up)": {
          "text": "Vomiting (throwing up)",
          "meaning": "HP:0002013"
        }
      }
    },
    "host vaccination status menu": {
      "name": "host vaccination status menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Fully Vaccinated": {
          "text": "Fully Vaccinated",
          "meaning": "GENEPIO:0100100"
        },
        "Partially Vaccinated": {
          "text": "Partially Vaccinated",
          "meaning": "GENEPIO:0100101"
        },
        "Not Vaccinated": {
          "text": "Not Vaccinated",
          "meaning": "GENEPIO:0100102"
        }
      }
    },
    "prior SARS-CoV-2 antiviral treatment menu": {
      "name": "prior SARS-CoV-2 antiviral treatment menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Prior antiviral treatment": {
          "text": "Prior antiviral treatment",
          "meaning": "GENEPIO:0100037"
        },
        "No prior antiviral treatment": {
          "text": "No prior antiviral treatment",
          "meaning": "GENEPIO:0100233"
        },
        "Unknown": {
          "text": "Unknown"
        }
      }
    },
    "NML submitted specimen type menu": {
      "name": "NML submitted specimen type menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Swab": {
          "text": "Swab",
          "meaning": "OBI:0002600"
        },
        "RNA": {
          "text": "RNA",
          "meaning": "OBI:0000880"
        },
        "mRNA (cDNA)": {
          "text": "mRNA (cDNA)",
          "meaning": "OBI:0002754"
        },
        "Nucleic acid": {
          "text": "Nucleic acid",
          "meaning": "OBI:0001010"
        },
        "Not Applicable": {
          "text": "Not Applicable",
          "meaning": "GENEPIO:0001619"
        }
      }
    },
    "Related specimen relationship type menu": {
      "name": "Related specimen relationship type menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "pre-existing conditions and risk factors menu": {
      "name": "pre-existing conditions and risk factors menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Age 60+": {
          "text": "Age 60+",
          "meaning": "VO:0004925"
        },
        "Anemia": {
          "text": "Anemia",
          "meaning": "HP:0001903"
        },
        "Anorexia": {
          "text": "Anorexia",
          "meaning": "HP:0002039"
        },
        "Birthing labor": {
          "text": "Birthing labor",
          "meaning": "NCIT:C92743"
        },
        "Bone marrow failure": {
          "text": "Bone marrow failure",
          "meaning": "NCIT:C80693"
        },
        "Cancer": {
          "text": "Cancer",
          "meaning": "MONDO:0004992"
        },
        "Breast cancer": {
          "text": "Breast cancer",
          "meaning": "MONDO:0007254",
          "is_a": "Cancer"
        },
        "Colorectal cancer": {
          "text": "Colorectal cancer",
          "meaning": "MONDO:0005575",
          "is_a": "Cancer"
        },
        "Hematologic malignancy (cancer of the blood)": {
          "text": "Hematologic malignancy (cancer of the blood)",
          "meaning": "DOID:2531",
          "is_a": "Cancer"
        },
        "Lung cancer": {
          "text": "Lung cancer",
          "meaning": "MONDO:0008903",
          "is_a": "Cancer"
        },
        "Metastatic disease": {
          "text": "Metastatic disease",
          "meaning": "MONDO:0024880",
          "is_a": "Cancer"
        },
        "Cancer treatment": {
          "text": "Cancer treatment",
          "meaning": "NCIT:C16212"
        },
        "Cancer surgery": {
          "text": "Cancer surgery",
          "meaning": "NCIT:C157740",
          "is_a": "Cancer treatment"
        },
        "Chemotherapy": {
          "text": "Chemotherapy",
          "meaning": "NCIT:C15632",
          "is_a": "Cancer treatment"
        },
        "Adjuvant chemotherapy": {
          "text": "Adjuvant chemotherapy",
          "meaning": "NCIT:C15360",
          "is_a": "Chemotherapy"
        },
        "Cardiac disorder": {
          "text": "Cardiac disorder",
          "meaning": "NCIT:C3079"
        },
        "Arrhythmia": {
          "text": "Arrhythmia",
          "meaning": "HP:0011675",
          "is_a": "Cardiac disorder"
        },
        "Cardiac disease": {
          "text": "Cardiac disease",
          "meaning": "MONDO:0005267",
          "is_a": "Cardiac disorder"
        },
        "Cardiomyopathy": {
          "text": "Cardiomyopathy",
          "meaning": "HP:0001638",
          "is_a": "Cardiac disorder"
        },
        "Cardiac injury": {
          "text": "Cardiac injury",
          "meaning": "GENEPIO:0100074",
          "is_a": "Cardiac disorder"
        },
        "Hypertension (high blood pressure)": {
          "text": "Hypertension (high blood pressure)",
          "meaning": "HP:0000822",
          "is_a": "Cardiac disorder"
        },
        "Hypotension (low blood pressure)": {
          "text": "Hypotension (low blood pressure)",
          "meaning": "HP:0002615",
          "is_a": "Cardiac disorder"
        },
        "Cesarean section": {
          "text": "Cesarean section",
          "meaning": "HP:0011410"
        },
        "Chronic cough": {
          "text": "Chronic cough",
          "meaning": "GENEPIO:0100075"
        },
        "Chronic gastrointestinal disease": {
          "text": "Chronic gastrointestinal disease",
          "meaning": "GENEPIO:0100076"
        },
        "Chronic lung disease": {
          "text": "Chronic lung disease",
          "meaning": "HP:0006528",
          "is_a": "Lung disease"
        },
        "Corticosteroids": {
          "text": "Corticosteroids",
          "meaning": "NCIT:C211"
        },
        "Diabetes mellitus (diabetes)": {
          "text": "Diabetes mellitus (diabetes)",
          "meaning": "HP:0000819"
        },
        "Type I diabetes mellitus (T1D)": {
          "text": "Type I diabetes mellitus (T1D)",
          "meaning": "HP:0100651",
          "is_a": "Diabetes mellitus (diabetes)"
        },
        "Type II diabetes mellitus (T2D)": {
          "text": "Type II diabetes mellitus (T2D)",
          "meaning": "HP:0005978",
          "is_a": "Diabetes mellitus (diabetes)"
        },
        "Eczema": {
          "text": "Eczema",
          "meaning": "HP:0000964"
        },
        "Electrolyte disturbance": {
          "text": "Electrolyte disturbance",
          "meaning": "HP:0003111"
        },
        "Hypocalcemia": {
          "text": "Hypocalcemia",
          "meaning": "HP:0002901",
          "is_a": "Electrolyte disturbance"
        },
        "Hypokalemia": {
          "text": "Hypokalemia",
          "meaning": "HP:0002900",
          "is_a": "Electrolyte disturbance"
        },
        "Hypomagnesemia": {
          "text": "Hypomagnesemia",
          "meaning": "HP:0002917",
          "is_a": "Electrolyte disturbance"
        },
        "Encephalitis (brain inflammation)": {
          "text": "Encephalitis (brain inflammation)",
          "meaning": "HP:0002383"
        },
        "Epilepsy": {
          "text": "Epilepsy",
          "meaning": "MONDO:0005027"
        },
        "Hemodialysis": {
          "text": "Hemodialysis",
          "meaning": "NCIT:C15248"
        },
        "Hemoglobinopathy": {
          "text": "Hemoglobinopathy",
          "meaning": "MONDO:0044348"
        },
        "Human immunodeficiency virus (HIV)": {
          "text": "Human immunodeficiency virus (HIV)",
          "meaning": "MONDO:0005109"
        },
        "Acquired immunodeficiency syndrome (AIDS)": {
          "text": "Acquired immunodeficiency syndrome (AIDS)",
          "meaning": "MONDO:0012268",
          "is_a": "Human immunodeficiency virus (HIV)"
        },
        "HIV and antiretroviral therapy (ART)": {
          "text": "HIV and antiretroviral therapy (ART)",
          "meaning": "NCIT:C16118",
          "is_a": "Human immunodeficiency virus (HIV)"
        },
        "Immunocompromised": {
          "text": "Immunocompromised",
          "meaning": "NCIT:C14139"
        },
        "Lupus": {
          "text": "Lupus",
          "meaning": "MONDO:0004670",
          "is_a": "Immunocompromised"
        },
        "Inflammatory bowel disease (IBD)": {
          "text": "Inflammatory bowel disease (IBD)",
          "meaning": "MONDO:0005265"
        },
        "Colitis": {
          "text": "Colitis",
          "meaning": "HP:0002583",
          "is_a": "Inflammatory bowel disease (IBD)"
        },
        "Ulcerative colitis": {
          "text": "Ulcerative colitis",
          "meaning": "HP:0100279",
          "is_a": "Colitis"
        },
        "Crohn's disease": {
          "text": "Crohn's disease",
          "meaning": "HP:0100280",
          "is_a": "Inflammatory bowel disease (IBD)"
        },
        "Renal disorder": {
          "text": "Renal disorder",
          "meaning": "NCIT:C3149"
        },
        "Renal disease": {
          "text": "Renal disease",
          "meaning": "MONDO:0005240",
          "is_a": "Renal disorder"
        },
        "Chronic renal disease": {
          "text": "Chronic renal disease",
          "meaning": "HP:0012622",
          "is_a": "Renal disease"
        },
        "Renal failure": {
          "text": "Renal failure",
          "meaning": "HP:0000083",
          "is_a": "Renal disease"
        },
        "Liver disease": {
          "text": "Liver disease",
          "meaning": "MONDO:0005154"
        },
        "Chronic liver disease": {
          "text": "Chronic liver disease",
          "meaning": "NCIT:C113609",
          "is_a": "Liver disease"
        },
        "Fatty liver disease (FLD)": {
          "text": "Fatty liver disease (FLD)",
          "meaning": "HP:0001397",
          "is_a": "Chronic liver disease"
        },
        "Myalgia (muscle pain)": {
          "text": "Myalgia (muscle pain)",
          "meaning": "HP:0003326"
        },
        "Myalgic encephalomyelitis (chronic fatigue syndrome)": {
          "text": "Myalgic encephalomyelitis (chronic fatigue syndrome)",
          "meaning": "MONDO:0005404"
        },
        "Neurological disorder": {
          "text": "Neurological disorder",
          "meaning": "MONDO:0005071"
        },
        "Neuromuscular disorder": {
          "text": "Neuromuscular disorder",
          "meaning": "MONDO:0019056",
          "is_a": "Neurological disorder"
        },
        "Obesity": {
          "text": "Obesity",
          "meaning": "HP:0001513"
        },
        "Severe obesity": {
          "text": "Severe obesity",
          "meaning": "MONDO:0005139",
          "is_a": "Obesity"
        },
        "Respiratory disorder": {
          "text": "Respiratory disorder",
          "meaning": "MONDO:0005087"
        },
        "Asthma": {
          "text": "Asthma",
          "meaning": "HP:0002099",
          "is_a": "Respiratory disorder"
        },
        "Chronic bronchitis": {
          "text": "Chronic bronchitis",
          "meaning": "HP:0004469",
          "is_a": "Respiratory disorder"
        },
        "Chronic pulmonary disease": {
          "text": "Chronic pulmonary disease",
          "meaning": "HP:0006528",
          "is_a": "Respiratory disorder"
        },
        "Chronic obstructive pulmonary disease": {
          "text": "Chronic obstructive pulmonary disease",
          "meaning": "HP:0006510",
          "is_a": "Chronic pulmonary disease"
        },
        "Emphysema": {
          "text": "Emphysema",
          "meaning": "HP:0002097",
          "is_a": "Respiratory disorder"
        },
        "Lung disease": {
          "text": "Lung disease",
          "meaning": "MONDO:0005275",
          "is_a": "Respiratory disorder"
        },
        "Pulmonary fibrosis": {
          "text": "Pulmonary fibrosis",
          "meaning": "HP:0002206",
          "is_a": "Lung disease"
        },
        "Pneumonia": {
          "text": "Pneumonia",
          "meaning": "HP:0002090",
          "is_a": "Respiratory disorder"
        },
        "Respiratory failure": {
          "text": "Respiratory failure",
          "meaning": "HP:0002878",
          "is_a": "Respiratory disorder"
        },
        "Adult respiratory distress syndrome": {
          "text": "Adult respiratory distress syndrome",
          "meaning": "HP:0033677",
          "is_a": "Respiratory failure"
        },
        "Newborn respiratory distress syndrome": {
          "text": "Newborn respiratory distress syndrome",
          "meaning": "MONDO:0009971",
          "is_a": "Respiratory failure"
        },
        "Tuberculosis": {
          "text": "Tuberculosis",
          "meaning": "MONDO:0018076",
          "is_a": "Respiratory disorder"
        },
        "Postpartum (≤6 weeks)": {
          "text": "Postpartum (≤6 weeks)",
          "meaning": "GENEPIO:0100077"
        },
        "Pregnancy": {
          "text": "Pregnancy",
          "meaning": "NCIT:C25742"
        },
        "Rheumatic disease": {
          "text": "Rheumatic disease",
          "meaning": "MONDO:0005554"
        },
        "Sickle cell disease": {
          "text": "Sickle cell disease",
          "meaning": "MONDO:0011382"
        },
        "Substance use": {
          "text": "Substance use",
          "meaning": "NBO:0001845"
        },
        "Alcohol abuse": {
          "text": "Alcohol abuse",
          "meaning": "MONDO:0002046",
          "is_a": "Substance use"
        },
        "Drug abuse": {
          "text": "Drug abuse",
          "meaning": "GENEPIO:0100078",
          "is_a": "Substance use"
        },
        "Injection drug abuse": {
          "text": "Injection drug abuse",
          "meaning": "GENEPIO:0100079",
          "is_a": "Drug abuse"
        },
        "Smoking": {
          "text": "Smoking",
          "meaning": "NBO:0015005",
          "is_a": "Substance use"
        },
        "Vaping": {
          "text": "Vaping",
          "meaning": "NCIT:C173621",
          "is_a": "Substance use"
        },
        "Tachypnea (accelerated respiratory rate)": {
          "text": "Tachypnea (accelerated respiratory rate)",
          "meaning": "HP:0002789"
        },
        "Transplant": {
          "text": "Transplant",
          "meaning": "NCIT:C159659"
        },
        "Hematopoietic stem cell transplant (bone marrow transplant)": {
          "text": "Hematopoietic stem cell transplant (bone marrow transplant)",
          "meaning": "NCIT:C131759",
          "is_a": "Transplant"
        },
        "Cardiac transplant": {
          "text": "Cardiac transplant",
          "meaning": "GENEPIO:0100080",
          "is_a": "Transplant"
        },
        "Kidney transplant": {
          "text": "Kidney transplant",
          "meaning": "NCIT:C157332",
          "is_a": "Transplant"
        },
        "Liver transplant": {
          "text": "Liver transplant",
          "meaning": "GENEPIO:0100081",
          "is_a": "Transplant"
        }
      }
    },
    "variant designation menu": {
      "name": "variant designation menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Variant of Concern (VOC)": {
          "text": "Variant of Concern (VOC)",
          "meaning": "GENEPIO:0100082"
        },
        "Variant of Interest (VOI)": {
          "text": "Variant of Interest (VOI)",
          "meaning": "GENEPIO:0100083"
        },
        "Variant Under Monitoring (VUM)": {
          "text": "Variant Under Monitoring (VUM)",
          "meaning": "GENEPIO:0100279"
        }
      }
    },
    "variant evidence menu": {
      "name": "variant evidence menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "RT-qPCR": {
          "text": "RT-qPCR",
          "meaning": "CIDO:0000019"
        },
        "Sequencing": {
          "text": "Sequencing",
          "meaning": "CIDO:0000027"
        }
      }
    },
    "complications menu": {
      "name": "complications menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Abnormal blood oxygen level": {
          "text": "Abnormal blood oxygen level",
          "meaning": "HP:0500165"
        },
        "Acute kidney injury": {
          "text": "Acute kidney injury",
          "meaning": "HP:0001919"
        },
        "Acute lung injury": {
          "text": "Acute lung injury",
          "meaning": "MONDO:0015796"
        },
        "Ventilation induced lung injury (VILI)": {
          "text": "Ventilation induced lung injury (VILI)",
          "meaning": "GENEPIO:0100092",
          "is_a": "Acute lung injury"
        },
        "Acute respiratory failure": {
          "text": "Acute respiratory failure",
          "meaning": "MONDO:0001208"
        },
        "Arrhythmia (complication)": {
          "text": "Arrhythmia (complication)",
          "meaning": "HP:0011675"
        },
        "Tachycardia": {
          "text": "Tachycardia",
          "meaning": "HP:0001649",
          "is_a": "Arrhythmia (complication)"
        },
        "Polymorphic ventricular tachycardia (VT)": {
          "text": "Polymorphic ventricular tachycardia (VT)",
          "meaning": "HP:0031677",
          "is_a": "Tachycardia"
        },
        "Tachyarrhythmia": {
          "text": "Tachyarrhythmia",
          "meaning": "GENEPIO:0100084",
          "is_a": "Tachycardia"
        },
        "Cardiac injury": {
          "text": "Cardiac injury",
          "meaning": "GENEPIO:0100074"
        },
        "Cardiac arrest": {
          "text": "Cardiac arrest",
          "meaning": "HP:0001695"
        },
        "Cardiogenic shock": {
          "text": "Cardiogenic shock",
          "meaning": "HP:0030149"
        },
        "Blood clot": {
          "text": "Blood clot",
          "meaning": "HP:0001977"
        },
        "Arterial clot": {
          "text": "Arterial clot",
          "meaning": "HP:0004420",
          "is_a": "Blood clot"
        },
        "Deep vein thrombosis (DVT)": {
          "text": "Deep vein thrombosis (DVT)",
          "meaning": "HP:0002625",
          "is_a": "Blood clot"
        },
        "Pulmonary embolism (PE)": {
          "text": "Pulmonary embolism (PE)",
          "meaning": "HP:0002204",
          "is_a": "Blood clot"
        },
        "Cardiomyopathy": {
          "text": "Cardiomyopathy",
          "meaning": "HP:0001638"
        },
        "Central nervous system invasion": {
          "text": "Central nervous system invasion",
          "meaning": "MONDO:0024619"
        },
        "Stroke (complication)": {
          "text": "Stroke (complication)",
          "meaning": "HP:0001297"
        },
        "Central Nervous System Vasculitis": {
          "text": "Central Nervous System Vasculitis",
          "meaning": "MONDO:0003346",
          "is_a": "Stroke (complication)"
        },
        "Acute ischemic stroke": {
          "text": "Acute ischemic stroke",
          "meaning": "HP:0002140",
          "is_a": "Stroke (complication)"
        },
        "Coma": {
          "text": "Coma",
          "meaning": "HP:0001259"
        },
        "Convulsions": {
          "text": "Convulsions",
          "meaning": "HP:0011097"
        },
        "COVID-19 associated coagulopathy (CAC)": {
          "text": "COVID-19 associated coagulopathy (CAC)",
          "meaning": "NCIT:C171562"
        },
        "Cystic fibrosis": {
          "text": "Cystic fibrosis",
          "meaning": "MONDO:0009061"
        },
        "Cytokine release syndrome": {
          "text": "Cytokine release syndrome",
          "meaning": "MONDO:0600008"
        },
        "Disseminated intravascular coagulation (DIC)": {
          "text": "Disseminated intravascular coagulation (DIC)",
          "meaning": "MPATH:108"
        },
        "Encephalopathy": {
          "text": "Encephalopathy",
          "meaning": "HP:0001298"
        },
        "Fulminant myocarditis": {
          "text": "Fulminant myocarditis",
          "meaning": "GENEPIO:0100088"
        },
        "Guillain-Barré syndrome": {
          "text": "Guillain-Barré syndrome",
          "meaning": "MONDO:0016218"
        },
        "Internal hemorrhage (complication; internal bleeding)": {
          "text": "Internal hemorrhage (complication; internal bleeding)",
          "meaning": "HP:0011029"
        },
        "Intracerebral haemorrhage": {
          "text": "Intracerebral haemorrhage",
          "meaning": "MONDO:0013792",
          "is_a": "Internal hemorrhage (complication; internal bleeding)"
        },
        "Kawasaki disease": {
          "text": "Kawasaki disease",
          "meaning": "MONDO:0012727"
        },
        "Complete Kawasaki disease": {
          "text": "Complete Kawasaki disease",
          "meaning": "GENEPIO:0100089",
          "is_a": "Kawasaki disease"
        },
        "Incomplete Kawasaki disease": {
          "text": "Incomplete Kawasaki disease",
          "meaning": "GENEPIO:0100090",
          "is_a": "Kawasaki disease"
        },
        "Liver dysfunction": {
          "text": "Liver dysfunction",
          "meaning": "HP:0001410"
        },
        "Acute liver injury": {
          "text": "Acute liver injury",
          "meaning": "GENEPIO:0100091",
          "is_a": "Liver dysfunction"
        },
        "Long COVID-19": {
          "text": "Long COVID-19",
          "meaning": "MONDO:0100233"
        },
        "Meningitis": {
          "text": "Meningitis",
          "meaning": "HP:0001287"
        },
        "Migraine": {
          "text": "Migraine",
          "meaning": "HP:0002076"
        },
        "Miscarriage": {
          "text": "Miscarriage",
          "meaning": "HP:0005268"
        },
        "Multisystem inflammatory syndrome in children (MIS-C)": {
          "text": "Multisystem inflammatory syndrome in children (MIS-C)",
          "meaning": "MONDO:0100163"
        },
        "Multisystem inflammatory syndrome in adults (MIS-A)": {
          "text": "Multisystem inflammatory syndrome in adults (MIS-A)",
          "meaning": "MONDO:0100319"
        },
        "Muscle injury": {
          "text": "Muscle injury",
          "meaning": "GENEPIO:0100093"
        },
        "Myalgic encephalomyelitis (ME)": {
          "text": "Myalgic encephalomyelitis (ME)",
          "meaning": "MONDO:0005404"
        },
        "Myocardial infarction (heart attack)": {
          "text": "Myocardial infarction (heart attack)",
          "meaning": "MONDO:0005068"
        },
        "Acute myocardial infarction": {
          "text": "Acute myocardial infarction",
          "meaning": "MONDO:0004781",
          "is_a": "Myocardial infarction (heart attack)"
        },
        "ST-segment elevation myocardial infarction": {
          "text": "ST-segment elevation myocardial infarction",
          "meaning": "MONDO:0041656",
          "is_a": "Myocardial infarction (heart attack)"
        },
        "Myocardial injury": {
          "text": "Myocardial injury",
          "meaning": "HP:0001700"
        },
        "Neonatal complications": {
          "text": "Neonatal complications",
          "meaning": "NCIT:C168498"
        },
        "Noncardiogenic pulmonary edema": {
          "text": "Noncardiogenic pulmonary edema",
          "meaning": "GENEPIO:0100085"
        },
        "Acute respiratory distress syndrome (ARDS)": {
          "text": "Acute respiratory distress syndrome (ARDS)",
          "meaning": "HP:0033677",
          "is_a": "Noncardiogenic pulmonary edema"
        },
        "COVID-19 associated ARDS (CARDS)": {
          "text": "COVID-19 associated ARDS (CARDS)",
          "meaning": "NCIT:C171551",
          "is_a": "Acute respiratory distress syndrome (ARDS)"
        },
        "Neurogenic pulmonary edema (NPE)": {
          "text": "Neurogenic pulmonary edema (NPE)",
          "meaning": "GENEPIO:0100086",
          "is_a": "Acute respiratory distress syndrome (ARDS)"
        },
        "Organ failure": {
          "text": "Organ failure",
          "meaning": "GENEPIO:0100094"
        },
        "Heart failure": {
          "text": "Heart failure",
          "meaning": "HP:0001635",
          "is_a": "Organ failure"
        },
        "Liver failure": {
          "text": "Liver failure",
          "meaning": "MONDO:0100192",
          "is_a": "Organ failure"
        },
        "Paralysis": {
          "text": "Paralysis",
          "meaning": "HP:0003470"
        },
        "Pneumothorax (collapsed lung)": {
          "text": "Pneumothorax (collapsed lung)",
          "meaning": "HP:0002107"
        },
        "Spontaneous pneumothorax": {
          "text": "Spontaneous pneumothorax",
          "meaning": "HP:0002108",
          "is_a": "Pneumothorax (collapsed lung)"
        },
        "Spontaneous tension pneumothorax": {
          "text": "Spontaneous tension pneumothorax",
          "meaning": "MONDO:0002075",
          "is_a": "Pneumothorax (collapsed lung)"
        },
        "Pneumonia (complication)": {
          "text": "Pneumonia (complication)",
          "meaning": "HP:0002090"
        },
        "COVID-19 pneumonia": {
          "text": "COVID-19 pneumonia",
          "meaning": "NCIT:C171550",
          "is_a": "Pneumonia (complication)"
        },
        "Pregancy complications": {
          "text": "Pregancy complications",
          "meaning": "HP:0001197"
        },
        "Rhabdomyolysis": {
          "text": "Rhabdomyolysis",
          "meaning": "HP:0003201"
        },
        "Secondary infection": {
          "text": "Secondary infection",
          "meaning": "IDO:0000567"
        },
        "Secondary staph infection": {
          "text": "Secondary staph infection",
          "meaning": "GENEPIO:0100095",
          "is_a": "Secondary infection"
        },
        "Secondary strep infection": {
          "text": "Secondary strep infection",
          "meaning": "GENEPIO:0100096",
          "is_a": "Secondary infection"
        },
        "Seizure (complication)": {
          "text": "Seizure (complication)",
          "meaning": "HP:0001250"
        },
        "Motor seizure": {
          "text": "Motor seizure",
          "meaning": "HP:0020219",
          "is_a": "Seizure (complication)"
        },
        "Sepsis/Septicemia": {
          "text": "Sepsis/Septicemia",
          "meaning": "HP:0100806"
        },
        "Sepsis": {
          "text": "Sepsis",
          "meaning": "IDO:0000636",
          "is_a": "Sepsis/Septicemia"
        },
        "Septicemia": {
          "text": "Septicemia",
          "meaning": "NCIT:C3364",
          "is_a": "Sepsis/Septicemia"
        },
        "Shock": {
          "text": "Shock",
          "meaning": "HP:0031273"
        },
        "Hyperinflammatory shock": {
          "text": "Hyperinflammatory shock",
          "meaning": "GENEPIO:0100097",
          "is_a": "Shock"
        },
        "Refractory cardiogenic shock": {
          "text": "Refractory cardiogenic shock",
          "meaning": "GENEPIO:0100098",
          "is_a": "Shock"
        },
        "Refractory cardiogenic plus vasoplegic shock": {
          "text": "Refractory cardiogenic plus vasoplegic shock",
          "meaning": "GENEPIO:0100099",
          "is_a": "Shock"
        },
        "Septic shock": {
          "text": "Septic shock",
          "meaning": "NCIT:C35018",
          "is_a": "Shock"
        },
        "Vasculitis": {
          "text": "Vasculitis",
          "meaning": "HP:0002633"
        }
      }
    },
    "vaccine name menu": {
      "name": "vaccine name menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Astrazeneca (Vaxzevria)": {
          "text": "Astrazeneca (Vaxzevria)",
          "meaning": "GENEPIO:0100308"
        },
        "Johnson & Johnson (Janssen)": {
          "text": "Johnson & Johnson (Janssen)",
          "meaning": "GENEPIO:0100307"
        },
        "Moderna (Spikevax)": {
          "text": "Moderna (Spikevax)",
          "meaning": "GENEPIO:0100304"
        },
        "Pfizer-BioNTech (Comirnaty)": {
          "text": "Pfizer-BioNTech (Comirnaty)",
          "meaning": "GENEPIO:0100305"
        },
        "Pfizer-BioNTech (Comirnaty Pediatric)": {
          "text": "Pfizer-BioNTech (Comirnaty Pediatric)",
          "meaning": "GENEPIO:0100306"
        }
      }
    },
    "anatomical material menu": {
      "name": "anatomical material menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Blood": {
          "text": "Blood",
          "meaning": "UBERON:0000178"
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
        "Tissue": {
          "text": "Tissue",
          "meaning": "UBERON:0000479"
        }
      }
    },
    "anatomical part menu": {
      "name": "anatomical part menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Anus": {
          "text": "Anus",
          "meaning": "UBERON:0001245"
        },
        "Buccal mucosa": {
          "text": "Buccal mucosa",
          "meaning": "UBERON:0006956"
        },
        "Duodenum": {
          "text": "Duodenum",
          "meaning": "UBERON:0002114"
        },
        "Eye": {
          "text": "Eye",
          "meaning": "UBERON:0000970"
        },
        "Intestine": {
          "text": "Intestine",
          "meaning": "UBERON:0000160"
        },
        "Lower respiratory tract": {
          "text": "Lower respiratory tract",
          "meaning": "UBERON:0001558"
        },
        "Bronchus": {
          "text": "Bronchus",
          "meaning": "UBERON:0002185",
          "is_a": "Lower respiratory tract"
        },
        "Lung": {
          "text": "Lung",
          "meaning": "UBERON:0002048",
          "is_a": "Lower respiratory tract"
        },
        "Bronchiole": {
          "text": "Bronchiole",
          "meaning": "UBERON:0002186",
          "is_a": "Lung"
        },
        "Alveolar sac": {
          "text": "Alveolar sac",
          "meaning": "UBERON:0002169",
          "is_a": "Lung"
        },
        "Pleural sac": {
          "text": "Pleural sac",
          "meaning": "UBERON:0009778",
          "is_a": "Lower respiratory tract"
        },
        "Pleural cavity": {
          "text": "Pleural cavity",
          "meaning": "UBERON:0002402",
          "is_a": "Pleural sac"
        },
        "Trachea": {
          "text": "Trachea",
          "meaning": "UBERON:0003126",
          "is_a": "Lower respiratory tract"
        },
        "Rectum": {
          "text": "Rectum",
          "meaning": "UBERON:0001052"
        },
        "Skin": {
          "text": "Skin",
          "meaning": "UBERON:0001003"
        },
        "Stomach": {
          "text": "Stomach",
          "meaning": "UBERON:0000945"
        },
        "Upper respiratory tract": {
          "text": "Upper respiratory tract",
          "meaning": "UBERON:0001557"
        },
        "Anterior Nares": {
          "text": "Anterior Nares",
          "meaning": "UBERON:2001427",
          "is_a": "Upper respiratory tract"
        },
        "Esophagus": {
          "text": "Esophagus",
          "meaning": "UBERON:0001043",
          "is_a": "Upper respiratory tract"
        },
        "Ethmoid sinus": {
          "text": "Ethmoid sinus",
          "meaning": "UBERON:0002453",
          "is_a": "Upper respiratory tract"
        },
        "Nasal Cavity": {
          "text": "Nasal Cavity",
          "meaning": "UBERON:0001707",
          "is_a": "Upper respiratory tract"
        },
        "Middle Nasal Turbinate": {
          "text": "Middle Nasal Turbinate",
          "meaning": "UBERON:0005921",
          "is_a": "Nasal Cavity"
        },
        "Inferior Nasal Turbinate": {
          "text": "Inferior Nasal Turbinate",
          "meaning": "UBERON:0005922",
          "is_a": "Nasal Cavity"
        },
        "Nasopharynx (NP)": {
          "text": "Nasopharynx (NP)",
          "meaning": "UBERON:0001728",
          "is_a": "Upper respiratory tract"
        },
        "Oropharynx (OP)": {
          "text": "Oropharynx (OP)",
          "meaning": "UBERON:0001729",
          "is_a": "Upper respiratory tract"
        }
      }
    },
    "body product menu": {
      "name": "body product menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Breast Milk": {
          "text": "Breast Milk",
          "meaning": "UBERON:0001913"
        },
        "Feces": {
          "text": "Feces",
          "meaning": "UBERON:0001988"
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
    "prior SARS-CoV-2 infection menu": {
      "name": "prior SARS-CoV-2 infection menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Prior infection": {
          "text": "Prior infection",
          "meaning": "GENEPIO:0100037"
        },
        "No prior infection": {
          "text": "No prior infection",
          "meaning": "GENEPIO:0100233"
        }
      }
    },
    "environmental material menu": {
      "name": "environmental material menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Air vent": {
          "text": "Air vent",
          "meaning": "ENVO:03501208"
        },
        "Banknote": {
          "text": "Banknote",
          "meaning": "ENVO:00003896"
        },
        "Bed rail": {
          "text": "Bed rail",
          "meaning": "ENVO:03501209"
        },
        "Building floor": {
          "text": "Building floor",
          "meaning": "ENVO:01000486"
        },
        "Cloth": {
          "text": "Cloth",
          "meaning": "ENVO:02000058"
        },
        "Control panel": {
          "text": "Control panel",
          "meaning": "ENVO:03501210"
        },
        "Door": {
          "text": "Door",
          "meaning": "ENVO:03501220"
        },
        "Door handle": {
          "text": "Door handle",
          "meaning": "ENVO:03501211"
        },
        "Face mask": {
          "text": "Face mask",
          "meaning": "OBI:0002787"
        },
        "Face shield": {
          "text": "Face shield",
          "meaning": "OBI:0002791"
        },
        "Food": {
          "text": "Food",
          "meaning": "FOODON:00002403"
        },
        "Food packaging": {
          "text": "Food packaging",
          "meaning": "FOODON:03490100"
        },
        "Glass": {
          "text": "Glass",
          "meaning": "ENVO:01000481"
        },
        "Handrail": {
          "text": "Handrail",
          "meaning": "ENVO:03501212"
        },
        "Hospital gown": {
          "text": "Hospital gown",
          "meaning": "OBI:0002796"
        },
        "Light switch": {
          "text": "Light switch",
          "meaning": "ENVO:03501213"
        },
        "Locker": {
          "text": "Locker",
          "meaning": "ENVO:03501214"
        },
        "N95 mask": {
          "text": "N95 mask",
          "meaning": "OBI:0002790"
        },
        "Nurse call button": {
          "text": "Nurse call button",
          "meaning": "ENVO:03501215"
        },
        "Paper": {
          "text": "Paper",
          "meaning": "ENVO:03501256"
        },
        "Particulate matter": {
          "text": "Particulate matter",
          "meaning": "ENVO:01000060"
        },
        "Plastic": {
          "text": "Plastic",
          "meaning": "ENVO:01000404"
        },
        "PPE gown": {
          "text": "PPE gown",
          "meaning": "GENEPIO:0100025"
        },
        "Sewage": {
          "text": "Sewage",
          "meaning": "ENVO:00002018"
        },
        "Sink": {
          "text": "Sink",
          "meaning": "ENVO:01000990"
        },
        "Soil": {
          "text": "Soil",
          "meaning": "ENVO:00001998"
        },
        "Stainless steel": {
          "text": "Stainless steel",
          "meaning": "ENVO:03501216"
        },
        "Tissue paper": {
          "text": "Tissue paper",
          "meaning": "ENVO:03501217"
        },
        "Toilet bowl": {
          "text": "Toilet bowl",
          "meaning": "ENVO:03501218"
        },
        "Water": {
          "text": "Water",
          "meaning": "ENVO:00002006"
        },
        "Wastewater": {
          "text": "Wastewater",
          "meaning": "ENVO:00002001",
          "is_a": "Water"
        },
        "Window": {
          "text": "Window",
          "meaning": "ENVO:03501219"
        },
        "Wood": {
          "text": "Wood",
          "meaning": "ENVO:00002040"
        }
      }
    },
    "environmental site menu": {
      "name": "environmental site menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Acute care facility": {
          "text": "Acute care facility",
          "meaning": "ENVO:03501135"
        },
        "Animal house": {
          "text": "Animal house",
          "meaning": "ENVO:00003040"
        },
        "Bathroom": {
          "text": "Bathroom",
          "meaning": "ENVO:01000422"
        },
        "Clinical assessment centre": {
          "text": "Clinical assessment centre",
          "meaning": "ENVO:03501136"
        },
        "Conference venue": {
          "text": "Conference venue",
          "meaning": "ENVO:03501127"
        },
        "Corridor": {
          "text": "Corridor",
          "meaning": "ENVO:03501121"
        },
        "Daycare": {
          "text": "Daycare",
          "meaning": "ENVO:01000927"
        },
        "Emergency room (ER)": {
          "text": "Emergency room (ER)",
          "meaning": "ENVO:03501145"
        },
        "Family practice clinic": {
          "text": "Family practice clinic",
          "meaning": "ENVO:03501186"
        },
        "Group home": {
          "text": "Group home",
          "meaning": "ENVO:03501196"
        },
        "Homeless shelter": {
          "text": "Homeless shelter",
          "meaning": "ENVO:03501133"
        },
        "Hospital": {
          "text": "Hospital",
          "meaning": "ENVO:00002173"
        },
        "Intensive Care Unit (ICU)": {
          "text": "Intensive Care Unit (ICU)",
          "meaning": "ENVO:03501152"
        },
        "Long Term Care Facility": {
          "text": "Long Term Care Facility",
          "meaning": "ENVO:03501194"
        },
        "Patient room": {
          "text": "Patient room",
          "meaning": "ENVO:03501180"
        },
        "Prison": {
          "text": "Prison",
          "meaning": "ENVO:03501204"
        },
        "Production Facility": {
          "text": "Production Facility",
          "meaning": "ENVO:01000536"
        },
        "School": {
          "text": "School",
          "meaning": "ENVO:03501130"
        },
        "Sewage Plant": {
          "text": "Sewage Plant",
          "meaning": "ENVO:00003043"
        },
        "Subway train": {
          "text": "Subway train",
          "meaning": "ENVO:03501109"
        },
        "University campus": {
          "text": "University campus",
          "meaning": "ENVO:00000467"
        },
        "Wet market": {
          "text": "Wet market",
          "meaning": "ENVO:03501198"
        }
      }
    },
    "collection method menu": {
      "name": "collection method menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
        "Washout Tear Collection": {
          "text": "Washout Tear Collection",
          "meaning": "GENEPIO:0100038"
        }
      }
    },
    "collection device menu": {
      "name": "collection device menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Air filter": {
          "text": "Air filter",
          "meaning": "ENVO:00003968"
        },
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
        "Fibrobronchoscope Brush": {
          "text": "Fibrobronchoscope Brush",
          "meaning": "OBI:0002825"
        },
        "Filter": {
          "text": "Filter",
          "meaning": "GENEPIO:0100103"
        },
        "Fine Needle": {
          "text": "Fine Needle",
          "meaning": "OBI:0002827"
        },
        "Microcapillary tube": {
          "text": "Microcapillary tube",
          "meaning": "OBI:0002858"
        },
        "Micropipette": {
          "text": "Micropipette",
          "meaning": "OBI:0001128"
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
        "Urine Collection Tube": {
          "text": "Urine Collection Tube",
          "meaning": "OBI:0002862"
        },
        "Virus Transport Medium": {
          "text": "Virus Transport Medium",
          "meaning": "OBI:0002866"
        }
      }
    },
    "host (scientific name) menu": {
      "name": "host (scientific name) menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Homo sapiens": {
          "text": "Homo sapiens",
          "meaning": "NCBITaxon:9606",
          "exact_mappings": [
            "NML_LIMS:Human"
          ]
        },
        "Bos taurus": {
          "text": "Bos taurus",
          "meaning": "NCBITaxon:9913"
        },
        "Canis lupus familiaris": {
          "text": "Canis lupus familiaris",
          "meaning": "NCBITaxon:9615"
        },
        "Chiroptera": {
          "text": "Chiroptera",
          "meaning": "NCBITaxon:9397"
        },
        "Columbidae": {
          "text": "Columbidae",
          "meaning": "NCBITaxon:8930"
        },
        "Felis catus": {
          "text": "Felis catus",
          "meaning": "NCBITaxon:9685"
        },
        "Gallus gallus": {
          "text": "Gallus gallus",
          "meaning": "NCBITaxon:9031"
        },
        "Manis": {
          "text": "Manis",
          "meaning": "NCBITaxon:9973"
        },
        "Manis javanica": {
          "text": "Manis javanica",
          "meaning": "NCBITaxon:9974"
        },
        "Neovison vison": {
          "text": "Neovison vison",
          "meaning": "NCBITaxon:452646"
        },
        "Panthera leo": {
          "text": "Panthera leo",
          "meaning": "NCBITaxon:9689"
        },
        "Panthera tigris": {
          "text": "Panthera tigris",
          "meaning": "NCBITaxon:9694"
        },
        "Rhinolophidae": {
          "text": "Rhinolophidae",
          "meaning": "NCBITaxon:58055"
        },
        "Rhinolophus affinis": {
          "text": "Rhinolophus affinis",
          "meaning": "NCBITaxon:59477"
        },
        "Sus scrofa domesticus": {
          "text": "Sus scrofa domesticus",
          "meaning": "NCBITaxon:9825"
        },
        "Viverridae": {
          "text": "Viverridae",
          "meaning": "NCBITaxon:9673"
        }
      }
    },
    "host (common name) menu": {
      "name": "host (common name) menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Human": {
          "text": "Human",
          "meaning": "NCBITaxon:9606"
        },
        "Bat": {
          "text": "Bat",
          "meaning": "NCBITaxon:9397"
        },
        "Cat": {
          "text": "Cat",
          "meaning": "NCBITaxon:9685"
        },
        "Chicken": {
          "text": "Chicken",
          "meaning": "NCBITaxon:9031"
        },
        "Civets": {
          "text": "Civets",
          "meaning": "NCBITaxon:9673"
        },
        "Cow": {
          "text": "Cow",
          "meaning": "NCBITaxon:9913",
          "exact_mappings": [
            "CNPHI:bovine"
          ]
        },
        "Dog": {
          "text": "Dog",
          "meaning": "NCBITaxon:9615"
        },
        "Lion": {
          "text": "Lion",
          "meaning": "NCBITaxon:9689"
        },
        "Mink": {
          "text": "Mink",
          "meaning": "NCBITaxon:452646"
        },
        "Pangolin": {
          "text": "Pangolin",
          "meaning": "NCBITaxon:9973"
        },
        "Pig": {
          "text": "Pig",
          "meaning": "NCBITaxon:9825",
          "exact_mappings": [
            "CNPHI:porcine"
          ]
        },
        "Pigeon": {
          "text": "Pigeon",
          "meaning": "NCBITaxon:8930"
        },
        "Tiger": {
          "text": "Tiger",
          "meaning": "NCBITaxon:9694"
        }
      }
    },
    "host health state menu": {
      "name": "host health state menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Asymptomatic": {
          "text": "Asymptomatic",
          "meaning": "NCIT:C3833"
        },
        "Deceased": {
          "text": "Deceased",
          "meaning": "NCIT:C28554"
        },
        "Healthy": {
          "text": "Healthy",
          "meaning": "NCIT:C115935"
        },
        "Recovered": {
          "text": "Recovered",
          "meaning": "NCIT:C49498"
        },
        "Symptomatic": {
          "text": "Symptomatic",
          "meaning": "NCIT:C25269"
        }
      }
    },
    "host health status details menu": {
      "name": "host health status details menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Hospitalized": {
          "text": "Hospitalized",
          "meaning": "NCIT:C25179"
        },
        "Hospitalized (Non-ICU)": {
          "text": "Hospitalized (Non-ICU)",
          "meaning": "GENEPIO:0100045",
          "is_a": "Hospitalized"
        },
        "Hospitalized (ICU)": {
          "text": "Hospitalized (ICU)",
          "meaning": "GENEPIO:0100046",
          "is_a": "Hospitalized"
        },
        "Mechanical Ventilation": {
          "text": "Mechanical Ventilation",
          "meaning": "NCIT:C70909"
        },
        "Medically Isolated": {
          "text": "Medically Isolated",
          "meaning": "GENEPIO:0100047"
        },
        "Medically Isolated (Negative Pressure)": {
          "text": "Medically Isolated (Negative Pressure)",
          "meaning": "GENEPIO:0100048",
          "is_a": "Medically Isolated"
        },
        "Self-quarantining": {
          "text": "Self-quarantining",
          "meaning": "NCIT:C173768"
        }
      }
    },
    "host health outcome menu": {
      "name": "host health outcome menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Deceased": {
          "text": "Deceased",
          "meaning": "NCIT:C28554"
        },
        "Deteriorating": {
          "text": "Deteriorating",
          "meaning": "NCIT:C25254"
        },
        "Recovered": {
          "text": "Recovered",
          "meaning": "NCIT:C49498"
        },
        "Stable": {
          "text": "Stable",
          "meaning": "NCIT:C30103"
        }
      }
    },
    "organism menu": {
      "name": "organism menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Severe acute respiratory syndrome coronavirus 2": {
          "text": "Severe acute respiratory syndrome coronavirus 2",
          "meaning": "NCBITaxon:2697049"
        },
        "RaTG13": {
          "text": "RaTG13",
          "meaning": "NCBITaxon:2709072"
        },
        "RmYN02": {
          "text": "RmYN02",
          "meaning": "GENEPIO:0100000"
        }
      }
    },
    "purpose of sampling menu": {
      "name": "purpose of sampling menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "purpose of sequencing menu": {
      "name": "purpose of sequencing menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
        "Screening for Variants of Concern (VoC)": {
          "text": "Screening for Variants of Concern (VoC)",
          "meaning": "GENEPIO:0100008",
          "is_a": "Priority surveillance project"
        },
        "Sample has epidemiological link to Variant of Concern (VoC)": {
          "text": "Sample has epidemiological link to Variant of Concern (VoC)",
          "meaning": "GENEPIO:0100273",
          "is_a": "Screening for Variants of Concern (VoC)"
        },
        "Sample has epidemiological link to Omicron Variant": {
          "text": "Sample has epidemiological link to Omicron Variant",
          "meaning": "GENEPIO:0100274",
          "is_a": "Sample has epidemiological link to Variant of Concern (VoC)"
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
        "Surveillance of international border crossing by air travel or ground transport": {
          "text": "Surveillance of international border crossing by air travel or ground transport",
          "meaning": "GENEPIO:0100015",
          "is_a": "International travel surveillance"
        },
        "Surveillance of international border crossing by air travel": {
          "text": "Surveillance of international border crossing by air travel",
          "meaning": "GENEPIO:0100016",
          "is_a": "International travel surveillance"
        },
        "Surveillance of international border crossing by ground transport": {
          "text": "Surveillance of international border crossing by ground transport",
          "meaning": "GENEPIO:0100017",
          "is_a": "International travel surveillance"
        },
        "Surveillance from international worker testing": {
          "text": "Surveillance from international worker testing",
          "meaning": "GENEPIO:0100018",
          "is_a": "International travel surveillance"
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
    "specimen processing menu": {
      "name": "specimen processing menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Virus passage": {
          "text": "Virus passage",
          "meaning": "GENEPIO:0100039"
        },
        "RNA re-extraction (post RT-PCR)": {
          "text": "RNA re-extraction (post RT-PCR)",
          "meaning": "GENEPIO:0100040"
        },
        "Specimens pooled": {
          "text": "Specimens pooled",
          "meaning": "OBI:0600016"
        }
      }
    },
    "lab host menu": {
      "name": "lab host menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "293/ACE2 cell line": {
          "text": "293/ACE2 cell line",
          "meaning": "GENEPIO:0100041"
        },
        "Caco2 cell line": {
          "text": "Caco2 cell line",
          "meaning": "BTO:0000195"
        },
        "Calu3 cell line": {
          "text": "Calu3 cell line",
          "meaning": "BTO:0002750"
        },
        "EFK3B cell line": {
          "text": "EFK3B cell line",
          "meaning": "GENEPIO:0100042"
        },
        "HEK293T cell line": {
          "text": "HEK293T cell line",
          "meaning": "BTO:0002181"
        },
        "HRCE cell line": {
          "text": "HRCE cell line",
          "meaning": "GENEPIO:0100043"
        },
        "Huh7 cell line": {
          "text": "Huh7 cell line",
          "meaning": "BTO:0001950"
        },
        "LLCMk2 cell line": {
          "text": "LLCMk2 cell line",
          "meaning": "CLO:0007330"
        },
        "MDBK cell line": {
          "text": "MDBK cell line",
          "meaning": "BTO:0000836"
        },
        "NHBE cell line": {
          "text": "NHBE cell line",
          "meaning": "BTO:0002924"
        },
        "PK-15 cell line": {
          "text": "PK-15 cell line",
          "meaning": "BTO:0001865"
        },
        "RK-13 cell line": {
          "text": "RK-13 cell line",
          "meaning": "BTO:0002909"
        },
        "U251 cell line": {
          "text": "U251 cell line",
          "meaning": "BTO:0002035"
        },
        "Vero cell line": {
          "text": "Vero cell line",
          "meaning": "BTO:0001444"
        },
        "Vero E6 cell line": {
          "text": "Vero E6 cell line",
          "meaning": "BTO:0004755",
          "is_a": "Vero cell line"
        },
        "VeroE6/TMPRSS2 cell line": {
          "text": "VeroE6/TMPRSS2 cell line",
          "meaning": "GENEPIO:0100044",
          "is_a": "Vero E6 cell line"
        }
      }
    },
    "host disease menu": {
      "name": "host disease menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "COVID-19": {
          "text": "COVID-19",
          "meaning": "MONDO:0100096"
        }
      }
    },
    "host age bin menu": {
      "name": "host age bin menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "0 - 9": {
          "text": "0 - 9",
          "meaning": "GENEPIO:0100049"
        },
        "10 - 19": {
          "text": "10 - 19",
          "meaning": "GENEPIO:0100050"
        },
        "20 - 29": {
          "text": "20 - 29",
          "meaning": "GENEPIO:0100051"
        },
        "30 - 39": {
          "text": "30 - 39",
          "meaning": "GENEPIO:0100052"
        },
        "40 - 49": {
          "text": "40 - 49",
          "meaning": "GENEPIO:0100053"
        },
        "50 - 59": {
          "text": "50 - 59",
          "meaning": "GENEPIO:0100054"
        },
        "60 - 69": {
          "text": "60 - 69",
          "meaning": "GENEPIO:0100055"
        },
        "70 - 79": {
          "text": "70 - 79",
          "meaning": "GENEPIO:0100056"
        },
        "80 - 89": {
          "text": "80 - 89",
          "meaning": "GENEPIO:0100057"
        },
        "90 - 99": {
          "text": "90 - 99",
          "meaning": "GENEPIO:0100058",
          "exact_mappings": [
            "VirusSeq_Portal:90+"
          ]
        },
        "100+": {
          "text": "100+",
          "meaning": "GENEPIO:0100059",
          "exact_mappings": [
            "VirusSeq_Portal:90+"
          ]
        }
      }
    },
    "host gender menu": {
      "name": "host gender menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "exposure event menu": {
      "name": "exposure event menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Mass Gathering": {
          "text": "Mass Gathering",
          "meaning": "GENEPIO:0100237"
        },
        "Agricultural Event": {
          "text": "Agricultural Event",
          "meaning": "GENEPIO:0100240",
          "is_a": "Mass Gathering"
        },
        "Convention": {
          "text": "Convention",
          "meaning": "GENEPIO:0100238",
          "is_a": "Mass Gathering"
        },
        "Convocation": {
          "text": "Convocation",
          "meaning": "GENEPIO:0100239",
          "is_a": "Mass Gathering"
        },
        "Recreational Event": {
          "text": "Recreational Event",
          "meaning": "GENEPIO:0100417",
          "is_a": "Mass Gathering"
        },
        "Concert": {
          "text": "Concert",
          "meaning": "GENEPIO:0100418",
          "is_a": "Recreational Event"
        },
        "Sporting Event": {
          "text": "Sporting Event",
          "meaning": "GENEPIO:0100419",
          "is_a": "Recreational Event"
        },
        "Religious Gathering": {
          "text": "Religious Gathering",
          "meaning": "GENEPIO:0100241"
        },
        "Mass": {
          "text": "Mass",
          "meaning": "GENEPIO:0100242",
          "is_a": "Religious Gathering"
        },
        "Social Gathering": {
          "text": "Social Gathering",
          "meaning": "PCO:0000033"
        },
        "Baby Shower": {
          "text": "Baby Shower",
          "meaning": "PCO:0000039",
          "is_a": "Social Gathering"
        },
        "Community Event": {
          "text": "Community Event",
          "meaning": "PCO:0000034",
          "is_a": "Social Gathering"
        },
        "Family Gathering": {
          "text": "Family Gathering",
          "meaning": "GENEPIO:0100243",
          "is_a": "Social Gathering"
        },
        "Family Reunion": {
          "text": "Family Reunion",
          "meaning": "GENEPIO:0100244",
          "is_a": "Family Gathering"
        },
        "Funeral": {
          "text": "Funeral",
          "meaning": "GENEPIO:0100245",
          "is_a": "Social Gathering"
        },
        "Party": {
          "text": "Party",
          "meaning": "PCO:0000035",
          "is_a": "Social Gathering"
        },
        "Potluck": {
          "text": "Potluck",
          "meaning": "PCO:0000037",
          "is_a": "Social Gathering"
        },
        "Wedding": {
          "text": "Wedding",
          "meaning": "PCO:0000038",
          "is_a": "Social Gathering"
        },
        "Other exposure event": {
          "text": "Other exposure event"
        }
      }
    },
    "exposure contact level menu": {
      "name": "exposure contact level menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Contact with infected individual": {
          "text": "Contact with infected individual",
          "meaning": "GENEPIO:0100357"
        },
        "Direct contact (direct human-to-human contact)": {
          "text": "Direct contact (direct human-to-human contact)",
          "meaning": "TRANS:0000001",
          "is_a": "Contact with infected individual"
        },
        "Indirect contact": {
          "text": "Indirect contact",
          "meaning": "GENEPIO:0100246",
          "is_a": "Contact with infected individual"
        },
        "Close contact (face-to-face, no direct contact)": {
          "text": "Close contact (face-to-face, no direct contact)",
          "meaning": "GENEPIO:0100247",
          "is_a": "Indirect contact"
        },
        "Casual contact": {
          "text": "Casual contact",
          "meaning": "GENEPIO:0100248",
          "is_a": "Indirect contact"
        }
      }
    },
    "host role menu": {
      "name": "host role menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Attendee": {
          "text": "Attendee",
          "meaning": "GENEPIO:0100249"
        },
        "Student": {
          "text": "Student",
          "meaning": "OMRSE:00000058",
          "is_a": "Attendee"
        },
        "Patient": {
          "text": "Patient",
          "meaning": "OMRSE:00000030"
        },
        "Inpatient": {
          "text": "Inpatient",
          "meaning": "NCIT:C25182",
          "is_a": "Patient"
        },
        "Outpatient": {
          "text": "Outpatient",
          "meaning": "NCIT:C28293",
          "is_a": "Patient"
        },
        "Passenger": {
          "text": "Passenger",
          "meaning": "GENEPIO:0100250"
        },
        "Resident": {
          "text": "Resident",
          "meaning": "GENEPIO:0100251"
        },
        "Visitor": {
          "text": "Visitor",
          "meaning": "GENEPIO:0100252"
        },
        "Volunteer": {
          "text": "Volunteer",
          "meaning": "GENEPIO:0100253"
        },
        "Work": {
          "text": "Work",
          "meaning": "GENEPIO:0100254"
        },
        "Administrator": {
          "text": "Administrator",
          "meaning": "GENEPIO:0100255",
          "is_a": "Work"
        },
        "Child Care/Education Worker": {
          "text": "Child Care/Education Worker",
          "is_a": "Work"
        },
        "Essential Worker": {
          "text": "Essential Worker",
          "is_a": "Work"
        },
        "First Responder": {
          "text": "First Responder",
          "meaning": "GENEPIO:0100256",
          "is_a": "Work"
        },
        "Firefighter": {
          "text": "Firefighter",
          "meaning": "GENEPIO:0100257",
          "is_a": "First Responder"
        },
        "Paramedic": {
          "text": "Paramedic",
          "meaning": "GENEPIO:0100258",
          "is_a": "First Responder"
        },
        "Police Officer": {
          "text": "Police Officer",
          "meaning": "GENEPIO:0100259",
          "is_a": "First Responder"
        },
        "Healthcare Worker": {
          "text": "Healthcare Worker",
          "meaning": "GENEPIO:0100334",
          "is_a": "Work"
        },
        "Community Healthcare Worker": {
          "text": "Community Healthcare Worker",
          "meaning": "GENEPIO:0100420",
          "is_a": "Healthcare Worker"
        },
        "Laboratory Worker": {
          "text": "Laboratory Worker",
          "meaning": "GENEPIO:0100262",
          "is_a": "Healthcare Worker"
        },
        "Nurse": {
          "text": "Nurse",
          "meaning": "OMRSE:00000014",
          "is_a": "Healthcare Worker"
        },
        "Personal Care Aid": {
          "text": "Personal Care Aid",
          "meaning": "GENEPIO:0100263",
          "is_a": "Healthcare Worker"
        },
        "Pharmacist": {
          "text": "Pharmacist",
          "meaning": "GENEPIO:0100264",
          "is_a": "Healthcare Worker"
        },
        "Physician": {
          "text": "Physician",
          "meaning": "OMRSE:00000013",
          "is_a": "Healthcare Worker"
        },
        "Housekeeper": {
          "text": "Housekeeper",
          "meaning": "GENEPIO:0100260",
          "is_a": "Work"
        },
        "International worker": {
          "text": "International worker",
          "is_a": "Work"
        },
        "Kitchen Worker": {
          "text": "Kitchen Worker",
          "meaning": "GENEPIO:0100261",
          "is_a": "Work"
        },
        "Rotational Worker": {
          "text": "Rotational Worker",
          "meaning": "GENEPIO:0100354",
          "is_a": "Work"
        },
        "Seasonal Worker": {
          "text": "Seasonal Worker",
          "meaning": "GENEPIO:0100355",
          "is_a": "Work"
        },
        "Transport Worker": {
          "text": "Transport Worker",
          "is_a": "Work"
        },
        "Transport Truck Driver": {
          "text": "Transport Truck Driver",
          "is_a": "Transport Worker"
        },
        "Veterinarian": {
          "text": "Veterinarian",
          "meaning": "GENEPIO:0100265",
          "is_a": "Work"
        },
        "Social role": {
          "text": "Social role",
          "meaning": "OMRSE:00000001"
        },
        "Acquaintance of case": {
          "text": "Acquaintance of case",
          "meaning": "GENEPIO:0100266",
          "is_a": "Social role"
        },
        "Relative of case": {
          "text": "Relative of case",
          "meaning": "GENEPIO:0100267",
          "is_a": "Social role"
        },
        "Child of case": {
          "text": "Child of case",
          "meaning": "GENEPIO:0100268",
          "is_a": "Relative of case"
        },
        "Parent of case": {
          "text": "Parent of case",
          "meaning": "GENEPIO:0100269",
          "is_a": "Relative of case"
        },
        "Father of case": {
          "text": "Father of case",
          "meaning": "GENEPIO:0100270",
          "is_a": "Parent of case"
        },
        "Mother of case": {
          "text": "Mother of case",
          "meaning": "GENEPIO:0100271",
          "is_a": "Parent of case"
        },
        "Spouse of case": {
          "text": "Spouse of case",
          "meaning": "GENEPIO:0100272",
          "is_a": "Social role"
        },
        "Other Host Role": {
          "text": "Other Host Role"
        }
      }
    },
    "exposure setting menu": {
      "name": "exposure setting menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Human Exposure": {
          "text": "Human Exposure",
          "meaning": "ECTO:3000005"
        },
        "Contact with Known COVID-19 Case": {
          "text": "Contact with Known COVID-19 Case",
          "meaning": "GENEPIO:0100184",
          "is_a": "Human Exposure"
        },
        "Contact with Patient": {
          "text": "Contact with Patient",
          "meaning": "GENEPIO:0100185",
          "is_a": "Human Exposure"
        },
        "Contact with Probable COVID-19 Case": {
          "text": "Contact with Probable COVID-19 Case",
          "meaning": "GENEPIO:0100186",
          "is_a": "Human Exposure"
        },
        "Contact with Person with Acute Respiratory Illness": {
          "text": "Contact with Person with Acute Respiratory Illness",
          "meaning": "GENEPIO:0100187",
          "is_a": "Human Exposure"
        },
        "Contact with Person with Fever and/or Cough": {
          "text": "Contact with Person with Fever and/or Cough",
          "meaning": "GENEPIO:0100188",
          "is_a": "Human Exposure"
        },
        "Contact with Person who Recently Travelled": {
          "text": "Contact with Person who Recently Travelled",
          "meaning": "GENEPIO:0100189",
          "is_a": "Human Exposure"
        },
        "Occupational, Residency or Patronage Exposure": {
          "text": "Occupational, Residency or Patronage Exposure",
          "meaning": "GENEPIO:0100190"
        },
        "Abbatoir": {
          "text": "Abbatoir",
          "meaning": "ECTO:1000033",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Animal Rescue": {
          "text": "Animal Rescue",
          "meaning": "GENEPIO:0100191",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Childcare": {
          "text": "Childcare",
          "meaning": "GENEPIO:0100192",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Daycare": {
          "text": "Daycare",
          "meaning": "GENEPIO:0100193",
          "is_a": "Childcare"
        },
        "Nursery": {
          "text": "Nursery",
          "meaning": "GENEPIO:0100194",
          "is_a": "Childcare"
        },
        "Community Service Centre": {
          "text": "Community Service Centre",
          "meaning": "GENEPIO:0100195",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Correctional Facility": {
          "text": "Correctional Facility",
          "meaning": "GENEPIO:0100196",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Dormitory": {
          "text": "Dormitory",
          "meaning": "GENEPIO:0100197",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Farm": {
          "text": "Farm",
          "meaning": "ECTO:1000034",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "First Nations Reserve": {
          "text": "First Nations Reserve",
          "meaning": "GENEPIO:0100198",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Funeral Home": {
          "text": "Funeral Home",
          "meaning": "GENEPIO:0100199",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Group Home": {
          "text": "Group Home",
          "meaning": "GENEPIO:0100200",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Healthcare Setting": {
          "text": "Healthcare Setting",
          "meaning": "GENEPIO:0100201",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Ambulance": {
          "text": "Ambulance",
          "meaning": "GENEPIO:0100202",
          "is_a": "Healthcare Setting"
        },
        "Acute Care Facility": {
          "text": "Acute Care Facility",
          "meaning": "GENEPIO:0100203",
          "is_a": "Healthcare Setting"
        },
        "Clinic": {
          "text": "Clinic",
          "meaning": "GENEPIO:0100204",
          "is_a": "Healthcare Setting"
        },
        "Community Healthcare (At-Home) Setting": {
          "text": "Community Healthcare (At-Home) Setting",
          "meaning": "GENEPIO:0100415",
          "is_a": "Healthcare Setting"
        },
        "Community Health Centre": {
          "text": "Community Health Centre",
          "meaning": "GENEPIO:0100205",
          "is_a": "Healthcare Setting"
        },
        "Hospital": {
          "text": "Hospital",
          "meaning": "ECTO:1000035",
          "is_a": "Healthcare Setting"
        },
        "Emergency Department": {
          "text": "Emergency Department",
          "meaning": "GENEPIO:0100206",
          "is_a": "Hospital"
        },
        "ICU": {
          "text": "ICU",
          "meaning": "GENEPIO:0100207",
          "is_a": "Hospital"
        },
        "Ward": {
          "text": "Ward",
          "meaning": "GENEPIO:0100208",
          "is_a": "Hospital"
        },
        "Laboratory": {
          "text": "Laboratory",
          "meaning": "ECTO:1000036",
          "is_a": "Healthcare Setting"
        },
        "Long-Term Care Facility": {
          "text": "Long-Term Care Facility",
          "meaning": "GENEPIO:0100209",
          "is_a": "Healthcare Setting"
        },
        "Pharmacy": {
          "text": "Pharmacy",
          "meaning": "GENEPIO:0100210",
          "is_a": "Healthcare Setting"
        },
        "Physician's Office": {
          "text": "Physician's Office",
          "meaning": "GENEPIO:0100211",
          "is_a": "Healthcare Setting"
        },
        "Household": {
          "text": "Household",
          "meaning": "GENEPIO:0100212",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Insecure Housing (Homeless)": {
          "text": "Insecure Housing (Homeless)",
          "meaning": "GENEPIO:0100213",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Occupational Exposure": {
          "text": "Occupational Exposure",
          "meaning": "GENEPIO:0100214",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Worksite": {
          "text": "Worksite",
          "meaning": "GENEPIO:0100215",
          "is_a": "Occupational Exposure"
        },
        "Office": {
          "text": "Office",
          "meaning": "ECTO:1000037",
          "is_a": "Worksite"
        },
        "Outdoors": {
          "text": "Outdoors",
          "meaning": "GENEPIO:0100216",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Camp/camping": {
          "text": "Camp/camping",
          "meaning": "ECTO:5000009",
          "is_a": "Outdoors"
        },
        "Hiking Trail": {
          "text": "Hiking Trail",
          "meaning": "GENEPIO:0100217",
          "is_a": "Outdoors"
        },
        "Hunting Ground": {
          "text": "Hunting Ground",
          "meaning": "ECTO:6000030",
          "is_a": "Outdoors"
        },
        "Ski Resort": {
          "text": "Ski Resort",
          "meaning": "GENEPIO:0100218",
          "is_a": "Outdoors"
        },
        "Petting zoo": {
          "text": "Petting zoo",
          "meaning": "ECTO:5000008",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Place of Worship": {
          "text": "Place of Worship",
          "meaning": "GENEPIO:0100220",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Church": {
          "text": "Church",
          "meaning": "GENEPIO:0100221",
          "is_a": "Place of Worship"
        },
        "Mosque": {
          "text": "Mosque",
          "meaning": "GENEPIO:0100222",
          "is_a": "Place of Worship"
        },
        "Temple": {
          "text": "Temple",
          "meaning": "GENEPIO:0100223",
          "is_a": "Place of Worship"
        },
        "Restaurant": {
          "text": "Restaurant",
          "meaning": "ECTO:1000040",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Retail Store": {
          "text": "Retail Store",
          "meaning": "ECTO:1000041",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "School": {
          "text": "School",
          "meaning": "GENEPIO:0100224",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Temporary Residence": {
          "text": "Temporary Residence",
          "meaning": "GENEPIO:0100225",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Homeless Shelter": {
          "text": "Homeless Shelter",
          "meaning": "GENEPIO:0100226",
          "is_a": "Temporary Residence"
        },
        "Hotel": {
          "text": "Hotel",
          "meaning": "GENEPIO:0100227",
          "is_a": "Temporary Residence"
        },
        "Veterinary Care Clinic": {
          "text": "Veterinary Care Clinic",
          "meaning": "GENEPIO:0100228",
          "is_a": "Occupational, Residency or Patronage Exposure"
        },
        "Travel Exposure": {
          "text": "Travel Exposure",
          "meaning": "GENEPIO:0100229"
        },
        "Travelled on a Cruise Ship": {
          "text": "Travelled on a Cruise Ship",
          "meaning": "GENEPIO:0100230",
          "is_a": "Travel Exposure"
        },
        "Travelled on a Plane": {
          "text": "Travelled on a Plane",
          "meaning": "GENEPIO:0100231",
          "is_a": "Travel Exposure"
        },
        "Travelled on Ground Transport": {
          "text": "Travelled on Ground Transport",
          "meaning": "GENEPIO:0100232",
          "is_a": "Travel Exposure"
        },
        "Travelled outside Province/Territory": {
          "text": "Travelled outside Province/Territory",
          "meaning": "GENEPIO:0001118",
          "is_a": "Travel Exposure"
        },
        "Travelled outside Canada": {
          "text": "Travelled outside Canada",
          "meaning": "GENEPIO:0001119",
          "is_a": "Travel Exposure"
        },
        "Other Exposure Setting": {
          "text": "Other Exposure Setting",
          "meaning": "GENEPIO:0100235"
        }
      }
    },
    "travel point of entry type menu": {
      "name": "travel point of entry type menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "Air": {
          "text": "Air",
          "meaning": "GENEPIO:0100408"
        },
        "Land": {
          "text": "Land",
          "meaning": "GENEPIO:0100409"
        }
      }
    },
    "border testing test day type menu": {
      "name": "border testing test day type menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "day 1": {
          "text": "day 1",
          "meaning": "GENEPIO:0100410"
        },
        "day 8": {
          "text": "day 8",
          "meaning": "GENEPIO:0100411"
        },
        "day 10": {
          "text": "day 10",
          "meaning": "GENEPIO:0100412"
        }
      }
    },
    "sequencing instrument menu": {
      "name": "sequencing instrument menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "gene name menu": {
      "name": "gene name menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "permissible_values": {
        "E gene (orf4)": {
          "text": "E gene (orf4)",
          "meaning": "GENEPIO:0100151",
          "exact_mappings": [
            "CNPHI:E gene",
            "BIOSAMPLE:E (orf4)"
          ]
        },
        "M gene (orf5)": {
          "text": "M gene (orf5)",
          "meaning": "GENEPIO:0100152",
          "exact_mappings": [
            "BIOSAMPLE:M (orf5)"
          ]
        },
        "N gene (orf9)": {
          "text": "N gene (orf9)",
          "meaning": "GENEPIO:0100153",
          "exact_mappings": [
            "BIOSAMPLE:N (orf9)"
          ]
        },
        "Spike gene (orf2)": {
          "text": "Spike gene (orf2)",
          "meaning": "GENEPIO:0100154",
          "exact_mappings": [
            "BIOSAMPLE:S (orf2)"
          ]
        },
        "orf1ab (rep)": {
          "text": "orf1ab (rep)",
          "meaning": "GENEPIO:0100155",
          "exact_mappings": [
            "BIOSAMPLE:orf1ab (rep)"
          ]
        },
        "orf1a (pp1a)": {
          "text": "orf1a (pp1a)",
          "meaning": "GENEPIO:0100156",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:orf1a (pp1a)"
          ]
        },
        "nsp11": {
          "text": "nsp11",
          "meaning": "GENEPIO:0100157",
          "is_a": "orf1a (pp1a)",
          "exact_mappings": [
            "BIOSAMPLE:nsp11"
          ]
        },
        "nsp1": {
          "text": "nsp1",
          "meaning": "GENEPIO:0100158",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp1"
          ]
        },
        "nsp2": {
          "text": "nsp2",
          "meaning": "GENEPIO:0100159",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp2"
          ]
        },
        "nsp3": {
          "text": "nsp3",
          "meaning": "GENEPIO:0100160",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp3"
          ]
        },
        "nsp4": {
          "text": "nsp4",
          "meaning": "GENEPIO:0100161",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp4"
          ]
        },
        "nsp5": {
          "text": "nsp5",
          "meaning": "GENEPIO:0100162",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp5"
          ]
        },
        "nsp6": {
          "text": "nsp6",
          "meaning": "GENEPIO:0100163",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp6"
          ]
        },
        "nsp7": {
          "text": "nsp7",
          "meaning": "GENEPIO:0100164",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp7"
          ]
        },
        "nsp8": {
          "text": "nsp8",
          "meaning": "GENEPIO:0100165",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp8"
          ]
        },
        "nsp9": {
          "text": "nsp9",
          "meaning": "GENEPIO:0100166",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp9"
          ]
        },
        "nsp10": {
          "text": "nsp10",
          "meaning": "GENEPIO:0100167",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp10"
          ]
        },
        "RdRp gene (nsp12)": {
          "text": "RdRp gene (nsp12)",
          "meaning": "GENEPIO:0100168",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp12 (RdRp)"
          ]
        },
        "hel gene (nsp13)": {
          "text": "hel gene (nsp13)",
          "meaning": "GENEPIO:0100169",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp13 (Hel)"
          ]
        },
        "exoN gene (nsp14)": {
          "text": "exoN gene (nsp14)",
          "meaning": "GENEPIO:0100170",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp14 (ExoN)"
          ]
        },
        "nsp15": {
          "text": "nsp15",
          "meaning": "GENEPIO:0100171",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp15"
          ]
        },
        "nsp16": {
          "text": "nsp16",
          "meaning": "GENEPIO:0100172",
          "is_a": "orf1ab (rep)",
          "exact_mappings": [
            "BIOSAMPLE:nsp16"
          ]
        },
        "orf3a": {
          "text": "orf3a",
          "meaning": "GENEPIO:0100173",
          "exact_mappings": [
            "BIOSAMPLE:orf3a"
          ]
        },
        "orf3b": {
          "text": "orf3b",
          "meaning": "GENEPIO:0100174",
          "exact_mappings": [
            "BIOSAMPLE:orf3b"
          ]
        },
        "orf6 (ns6)": {
          "text": "orf6 (ns6)",
          "meaning": "GENEPIO:0100175",
          "exact_mappings": [
            "BIOSAMPLE:orf6 (ns6)"
          ]
        },
        "orf7a": {
          "text": "orf7a",
          "meaning": "GENEPIO:0100176",
          "exact_mappings": [
            "BIOSAMPLE:orf7a"
          ]
        },
        "orf7b (ns7b)": {
          "text": "orf7b (ns7b)",
          "meaning": "GENEPIO:0100177",
          "exact_mappings": [
            "BIOSAMPLE:orf7b (ns7b)"
          ]
        },
        "orf8 (ns8)": {
          "text": "orf8 (ns8)",
          "meaning": "GENEPIO:0100178",
          "exact_mappings": [
            "BIOSAMPLE:orf8 (ns8)"
          ]
        },
        "orf9b": {
          "text": "orf9b",
          "meaning": "GENEPIO:0100179",
          "exact_mappings": [
            "BIOSAMPLE:orf9b"
          ]
        },
        "orf9c": {
          "text": "orf9c",
          "meaning": "GENEPIO:0100180",
          "exact_mappings": [
            "BIOSAMPLE:orf9c"
          ]
        },
        "orf10": {
          "text": "orf10",
          "meaning": "GENEPIO:0100181",
          "exact_mappings": [
            "BIOSAMPLE:orf10"
          ]
        },
        "orf14": {
          "text": "orf14",
          "meaning": "GENEPIO:0100182",
          "exact_mappings": [
            "BIOSAMPLE:orf14"
          ]
        },
        "SARS-COV-2 5' UTR": {
          "text": "SARS-COV-2 5' UTR",
          "meaning": "GENEPIO:0100183"
        }
      }
    },
    "sequence submitted by menu": {
      "name": "sequence submitted by menu",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
        "Nunuvut": {
          "text": "Nunuvut"
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
          "value": "prov_rona_99"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "third party lab service provider name": {
      "name": "third party lab service provider name",
      "description": "The name of the third party company or laboratory that provided services.",
      "title": "third party lab service provider name",
      "comments": [
        "Provide the full, unabbreviated name of the company or laboratory."
      ],
      "examples": [
        {
          "value": "Switch Health"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:HC_TEXT5"
      ],
      "slot_uri": "GENEPIO:0001202",
      "range": "WhitespaceMinimizedString"
    },
    "third party lab sample ID": {
      "name": "third party lab sample ID",
      "description": "The identifier assigned to a sample by a third party service provider.",
      "title": "third party lab sample ID",
      "comments": [
        "Store the sample identifier supplied by the third party services provider."
      ],
      "examples": [
        {
          "value": "SHK123456"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_ID_NUMBER_PRIMARY"
      ],
      "slot_uri": "GENEPIO:0001149",
      "range": "WhitespaceMinimizedString"
    },
    "case ID": {
      "name": "case ID",
      "description": "The identifier used to specify an epidemiologically detected case of disease.",
      "title": "case ID",
      "comments": [
        "Provide the case identifer. The case ID greatly facilitates linkage between laboratory and epidemiological data. The case ID may be considered identifiable information. Consult the data steward before sharing."
      ],
      "examples": [
        {
          "value": "ABCD1234"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_CASE_ID"
      ],
      "slot_uri": "GENEPIO:0100281",
      "identifier": true,
      "range": "WhitespaceMinimizedString",
      "recommended": true
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Related Specimen ID",
        "CNPHI:Related Specimen Relationship Type",
        "NML_LIMS:PH_RELATED_PRIMARY_ID"
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
    "IRIDA sample name": {
      "name": "IRIDA sample name",
      "description": "The identifier assigned to a sequenced isolate in IRIDA.",
      "title": "IRIDA sample name",
      "comments": [
        "Store the IRIDA sample name. The IRIDA sample name will be created by the individual entering data into the IRIDA platform. IRIDA samples may be linked to metadata and sequence data, or just metadata alone. It is recommended that the IRIDA sample name be the same as, or contain, the specimen collector sample ID for better traceability. It is also recommended that the IRIDA sample name mirror the GISAID accession. IRIDA sample names cannot contain slashes. Slashes should be replaced by underscores. See IRIDA documentation for more information regarding special characters (https://irida.corefacility.ca/documentation/user/user/samples/#adding-a-new-sample)."
      ],
      "examples": [
        {
          "value": "prov_rona_99"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:IRIDA sample name"
      ],
      "slot_uri": "GENEPIO:0001131",
      "range": "WhitespaceMinimizedString"
    },
    "umbrella bioproject accession": {
      "name": "umbrella bioproject accession",
      "description": "The INSDC accession number assigned to the umbrella BioProject for the Canadian SARS-CoV-2 sequencing effort.",
      "title": "umbrella bioproject accession",
      "comments": [
        "Store the umbrella BioProject accession by selecting it from the picklist in the template. The umbrella BioProject accession will be identical for all CanCOGen submitters. Different provinces will have their own BioProjects, however these BioProjects will be linked under one umbrella BioProject."
      ],
      "examples": [
        {
          "value": "PRJNA623807"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:umbrella bioproject accession"
      ],
      "slot_uri": "GENEPIO:0001133",
      "range": "umbrella bioproject accession menu",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
    },
    "bioproject accession": {
      "name": "bioproject accession",
      "description": "The INSDC accession number of the BioProject(s) to which the BioSample belongs.",
      "title": "bioproject accession",
      "comments": [
        "Store the BioProject accession number. BioProjects are an organizing tool that links together raw sequence data, assemblies, and their associated metadata. Each province will be assigned a different bioproject accession number by the National Microbiology Lab. A valid NCBI BioProject accession has prefix PRJN e.g., PRJNA12345, and is created once at the beginning of a new sequencing project."
      ],
      "examples": [
        {
          "value": "PRJNA608651"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:BioProject Accession",
        "NML_LIMS:PH_BIOPROJECT_ACCESSION",
        "BIOSAMPLE:bioproject_accession"
      ],
      "slot_uri": "GENEPIO:0001136",
      "range": "WhitespaceMinimizedString",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
    },
    "biosample accession": {
      "name": "biosample accession",
      "description": "The identifier assigned to a BioSample in INSDC archives.",
      "title": "biosample accession",
      "comments": [
        "Store the accession returned from the BioSample submission. NCBI BioSamples will have the prefix SAMN."
      ],
      "examples": [
        {
          "value": "SAMN14180202"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:BioSample Accession",
        "NML_LIMS:PH_BIOSAMPLE_ACCESSION"
      ],
      "slot_uri": "GENEPIO:0001139",
      "range": "WhitespaceMinimizedString",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
    },
    "SRA accession": {
      "name": "SRA accession",
      "description": "The Sequence Read Archive (SRA) identifier linking raw read data, methodological metadata and quality control metrics submitted to the INSDC.",
      "title": "SRA accession",
      "comments": [
        "Store the accession assigned to the submitted \"run\". NCBI-SRA accessions start with SRR."
      ],
      "examples": [
        {
          "value": "SRR11177792"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:SRA Accession",
        "NML_LIMS:PH_SRA_ACCESSION"
      ],
      "slot_uri": "GENEPIO:0001142",
      "range": "WhitespaceMinimizedString",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
    },
    "GenBank accession": {
      "name": "GenBank accession",
      "description": "The GenBank identifier assigned to the sequence in the INSDC archives.",
      "title": "GenBank accession",
      "comments": [
        "Store the accession returned from a GenBank submission (viral genome assembly)."
      ],
      "examples": [
        {
          "value": "MN908947.3"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:GenBank Accession",
        "NML_LIMS:GenBank accession"
      ],
      "slot_uri": "GENEPIO:0001145",
      "range": "WhitespaceMinimizedString",
      "structured_pattern": {
        "syntax": "{UPPER_CASE}",
        "interpolated": true,
        "partial_match": false
      }
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Originating lab",
        "CNPHI:Lab Name",
        "NML_LIMS:CUSTOMER",
        "BIOSAMPLE:collected_by",
        "VirusSeq_Portal:sample collected by"
      ],
      "slot_uri": "GENEPIO:0001153",
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
      "comments": [
        "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca"
      ],
      "examples": [
        {
          "value": "RespLab@lab.ca"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Address",
        "NML_LIMS:sample collector contact address"
      ],
      "slot_uri": "GENEPIO:0001158",
      "range": "WhitespaceMinimizedString"
    },
    "sequence submitted by": {
      "name": "sequence submitted by",
      "description": "The name of the agency that generated the sequence.",
      "title": "sequence submitted by",
      "comments": [
        "The name of the agency should be written out in full, (with minor exceptions) and be consistent across multple submissions. If submitting specimens rather than sequencing data, please put the \"National Microbiology Laboratory (NML)\"."
      ],
      "examples": [
        {
          "value": "Public Health Ontario (PHO)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Submitting lab",
        "CNPHI:Sequencing Centre",
        "NML_LIMS:PH_SEQUENCING_CENTRE",
        "BIOSAMPLE:sequenced_by",
        "VirusSeq_Portal:sequence submitted by"
      ],
      "slot_uri": "GENEPIO:0001159",
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
      "description": "The email address of the contact responsible for follow-up regarding the sequence.",
      "title": "sequence submitter contact email",
      "comments": [
        "The email address can represent a specific individual or lab e.g. johnnyblogs@lab.ca, or RespLab@lab.ca"
      ],
      "examples": [
        {
          "value": "RespLab@lab.ca"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:sequence submitter contact email"
      ],
      "slot_uri": "GENEPIO:0001165",
      "range": "WhitespaceMinimizedString"
    },
    "sequence submitter contact address": {
      "name": "sequence submitter contact address",
      "description": "The mailing address of the agency submitting the sequence.",
      "title": "sequence submitter contact address",
      "comments": [
        "The mailing address should be in the format: Street number and name, City, Province/Territory, Postal Code, Country"
      ],
      "examples": [
        {
          "value": "123 Sunnybrooke St, Toronto, Ontario, M4P 1L6, Canada"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Collection date",
        "CNPHI:Patient Sample Collected Date",
        "NML_LIMS:HC_COLLECT_DATE",
        "BIOSAMPLE:sample collection date",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "examples": [
        {
          "value": "Canada"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Location",
        "CNPHI:Patient Country",
        "NML_LIMS:HC_COUNTRY",
        "BIOSAMPLE:geo_loc_name",
        "VirusSeq_Portal:geo_loc_name (country)"
      ],
      "slot_uri": "GENEPIO:0001181",
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
      "description": "The province/territory where the sample was collected.",
      "title": "geo_loc_name (state/province/territory)",
      "comments": [
        "Provide the province/territory name from the controlled vocabulary provided."
      ],
      "examples": [
        {
          "value": "Saskatchewan"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Patient Province",
        "NML_LIMS:HC_PROVINCE",
        "BIOSAMPLE:geo_loc_name",
        "VirusSeq_Portal:geo_loc_name (state/province/territory)"
      ],
      "slot_uri": "GENEPIO:0001185",
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
    "geo_loc_name (city)": {
      "name": "geo_loc_name (city)",
      "description": "The city where the sample was collected.",
      "title": "geo_loc_name (city)",
      "comments": [
        "Provide the city name. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz"
      ],
      "examples": [
        {
          "value": "Medicine Hat"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Patient City",
        "NML_LIMS:geo_loc_name (city)"
      ],
      "slot_uri": "GENEPIO:0001189",
      "range": "WhitespaceMinimizedString"
    },
    "organism": {
      "name": "organism",
      "description": "Taxonomic name of the organism.",
      "title": "organism",
      "comments": [
        "Use \"Severe acute respiratory syndrome coronavirus 2\". This value is provided in the template."
      ],
      "examples": [
        {
          "value": "Severe acute respiratory syndrome coronavirus 2"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Pathogen",
        "NML_LIMS:HC_CURRENT_ID",
        "BIOSAMPLE:organism",
        "VirusSeq_Portal:organism"
      ],
      "slot_uri": "GENEPIO:0001191",
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
        "Provide the GISAID virus name, which should be written in the format “hCov-19/CANADA/2 digit provincial ISO code-xxxxx/year”."
      ],
      "examples": [
        {
          "value": "hCov-19/CANADA/BC-prov_rona_99/2020"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Virus name",
        "CNPHI:GISAID Virus Name",
        "NML_LIMS:RESULT - CANCOGEN_SUBMISSIONS",
        "BIOSAMPLE:isolate",
        "BIOSAMPLE:GISAID_virus_name",
        "VirusSeq_Portal:isolate",
        "VirusSeq_Portal:fasta header name"
      ],
      "slot_uri": "GENEPIO:0001195",
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
        "The reason a sample was collected may provide information about potential biases in sampling strategy. Provide the purpose of sampling from the picklist in the template. Most likely, the sample was collected for Diagnostic testing. The reason why a sample was originally collected may differ from the reason why it was selected for sequencing, which should be indicated in the \"purpose of sequencing\" field."
      ],
      "examples": [
        {
          "value": "Diagnostic testing"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Reason for Sampling",
        "NML_LIMS:HC_SAMPLE_CATEGORY",
        "BIOSAMPLE:purpose_of_sampling",
        "VirusSeq_Portal:purpose of sampling"
      ],
      "slot_uri": "GENEPIO:0001198",
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
      "comments": [
        "Provide an expanded description of why the sample was collected using free text. The description may include the importance of the sample for a particular public health investigation/surveillance activity/research question. If details are not available, provide a null value."
      ],
      "examples": [
        {
          "value": "The sample was collected to investigate the prevalence of variants associated with mink-to-human transmission in Canada."
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
          "value": "swab"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Specimen Type",
        "NML_LIMS:PH_SPECIMEN_TYPE"
      ],
      "slot_uri": "GENEPIO:0001204",
      "range": "NML submitted specimen type menu",
      "required": true
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
          "value": "Specimen sampling methods testing"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Related Specimen ID",
        "CNPHI:Related Specimen Relationship Type",
        "NML_LIMS:PH_RELATED_RELATIONSHIP_TYPE"
      ],
      "slot_uri": "GENEPIO:0001209",
      "range": "Related specimen relationship type menu"
    },
    "anatomical material": {
      "name": "anatomical material",
      "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
      "title": "anatomical material",
      "comments": [
        "Provide a descriptor if an anatomical material was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Blood"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "comments": [
        "Provide a descriptor if an anatomical part was sampled. Use the picklist provided in the template. If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Nasopharynx (NP)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "comments": [
        "Provide a descriptor if a body product was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Feces"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
          "range": "body product menu menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "environmental material": {
      "name": "environmental material",
      "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage.",
      "title": "environmental material",
      "comments": [
        "Provide a descriptor if an environmental material was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Face mask"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Environmental Material",
        "NML_LIMS:PH_ENVIRONMENTAL_MATERIAL",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:environmental_material",
        "VirusSeq_Portal:environmental material"
      ],
      "slot_uri": "GENEPIO:0001223",
      "multivalued": true,
      "required": true,
      "any_of": [
        {
          "range": "environmental material menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "environmental site": {
      "name": "environmental site",
      "description": "An environmental location may describe a site in the natural or built environment e.g. contact surface, metal can, hospital, wet market, bat cave.",
      "title": "environmental site",
      "comments": [
        "Provide a descriptor if an environmental site was sampled. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Production Facility"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Specimen source",
        "CNPHI:Environmental Site",
        "NML_LIMS:PH_ENVIRONMENTAL_SITE",
        "BIOSAMPLE:isolation_source",
        "BIOSAMPLE:environmental_site",
        "VirusSeq_Portal:environmental site"
      ],
      "slot_uri": "GENEPIO:0001232",
      "multivalued": true,
      "required": true,
      "any_of": [
        {
          "range": "environmental site menu"
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
      "examples": [
        {
          "value": "Swab"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "comments": [
        "Provide a descriptor if a collection method was used for sampling. Use the picklist provided in the template.  If a desired term is missing from the picklist, contact emma_griffiths@sfu.ca. If not applicable, do not leave blank. Choose a null value."
      ],
      "examples": [
        {
          "value": "Bronchoalveolar lavage (BAL)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "collection protocol": {
      "name": "collection protocol",
      "description": "The name and version of a particular protocol used for sampling.",
      "title": "collection protocol",
      "comments": [
        "Free text."
      ],
      "examples": [
        {
          "value": "BCRonaSamplingProtocol v. 1.2"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:collection protocol"
      ],
      "slot_uri": "GENEPIO:0001243",
      "range": "WhitespaceMinimizedString"
    },
    "specimen processing": {
      "name": "specimen processing",
      "description": "Any processing applied to the sample during or after receiving the sample.",
      "title": "specimen processing",
      "comments": [
        "Critical for interpreting data. Select all the applicable processes from the pick list. If virus was passaged, include information in \"lab host\", \"passage number\", and \"passage method\" fields. If none of the processes in the pick list apply, put \"not applicable\"."
      ],
      "examples": [
        {
          "value": "Virus passage"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Passage details/history",
        "NML_LIMS:specimen processing"
      ],
      "slot_uri": "GENEPIO:0001253",
      "multivalued": true,
      "recommended": true,
      "any_of": [
        {
          "range": "specimen processing menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "specimen processing details": {
      "name": "specimen processing details",
      "description": "Detailed information regarding the processing applied to a sample during or after receiving the sample.",
      "title": "specimen processing details",
      "comments": [
        "Provide a free text description of any processing details applied to a sample."
      ],
      "examples": [
        {
          "value": "25 swabs were pooled and further prepared as a single sample during library prep."
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "slot_uri": "GENEPIO:0100311",
      "range": "WhitespaceMinimizedString"
    },
    "lab host": {
      "name": "lab host",
      "description": "Name and description of the laboratory host used to propagate the source organism or material from which the sample was obtained.",
      "title": "lab host",
      "comments": [
        "Type of cell line used for propagation. Provide the name of the cell line using the picklist in the template. If not passaged, put \"not applicable\"."
      ],
      "examples": [
        {
          "value": "Vero E6 cell line"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Passage details/history",
        "NML_LIMS:lab host",
        "BIOSAMPLE:lab_host"
      ],
      "slot_uri": "GENEPIO:0001255",
      "recommended": true,
      "any_of": [
        {
          "range": "lab host menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "passage number": {
      "name": "passage number",
      "description": "Number of passages.",
      "title": "passage number",
      "comments": [
        "Provide number of known passages. If not passaged, put \"not applicable\""
      ],
      "examples": [
        {
          "value": "3"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Passage details/history",
        "NML_LIMS:passage number",
        "BIOSAMPLE:passage_history"
      ],
      "slot_uri": "GENEPIO:0001261",
      "recommended": true,
      "minimum_value": 0,
      "any_of": [
        {
          "range": "integer"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "passage method": {
      "name": "passage method",
      "description": "Description of how organism was passaged.",
      "title": "passage method",
      "comments": [
        "Free text. Provide a very short description (<10 words). If not passaged, put \"not applicable\"."
      ],
      "examples": [
        {
          "value": "0.25% trypsin + 0.02% EDTA"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Passage details/history",
        "NML_LIMS:passage method",
        "BIOSAMPLE:passage_method"
      ],
      "slot_uri": "GENEPIO:0001264",
      "recommended": true,
      "any_of": [
        {
          "range": "WhitespaceMinimizedString"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "biomaterial extracted": {
      "name": "biomaterial extracted",
      "description": "The biomaterial extracted from samples for the purpose of sequencing.",
      "title": "biomaterial extracted",
      "comments": [
        "Provide the biomaterial extracted from the picklist in the template."
      ],
      "examples": [
        {
          "value": "RNA (total)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:biomaterial extracted"
      ],
      "slot_uri": "GENEPIO:0001266",
      "any_of": [
        {
          "range": "biomaterial extracted menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host (common name)": {
      "name": "host (common name)",
      "description": "The commonly used name of the host.",
      "title": "host (common name)",
      "comments": [
        "Common name or scientific name are required if there was a host. Both can be provided, if known. Use terms from the pick lists in the template. Common name e.g. human, bat. If the sample was environmental, put \"not applicable."
      ],
      "examples": [
        {
          "value": "Human"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Animal Type",
        "NML_LIMS:PH_ANIMAL_TYPE"
      ],
      "slot_uri": "GENEPIO:0001386",
      "any_of": [
        {
          "range": "host (common name) menu"
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
      "comments": [
        "Common name or scientific name are required if there was a host. Both can be provided, if known. Use terms from the pick lists in the template. Scientific name e.g. Homo sapiens, If the sample was environmental, put \"not applicable"
      ],
      "examples": [
        {
          "value": "Homo sapiens"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
    "host health state": {
      "name": "host health state",
      "description": "Health status of the host at the time of sample collection.",
      "title": "host health state",
      "comments": [
        "If known, select a descriptor from the pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Symptomatic"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Patient status",
        "CNPHI:Host Health State",
        "NML_LIMS:PH_HOST_HEALTH",
        "BIOSAMPLE:host_health_state"
      ],
      "slot_uri": "GENEPIO:0001388",
      "any_of": [
        {
          "range": "host health state menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host health status details": {
      "name": "host health status details",
      "description": "Further details pertaining to the health or disease status of the host at time of collection.",
      "title": "host health status details",
      "comments": [
        "If known, select a descriptor from the pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Hospitalized (ICU)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Host Health State Details",
        "NML_LIMS:PH_HOST_HEALTH_DETAILS"
      ],
      "slot_uri": "GENEPIO:0001389",
      "any_of": [
        {
          "range": "host health status details menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host health outcome": {
      "name": "host health outcome",
      "description": "Disease outcome in the host.",
      "title": "host health outcome",
      "comments": [
        "If known, select a descriptor from the pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Recovered"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_HOST_HEALTH_OUTCOME",
        "BIOSAMPLE:host_disease_outcome"
      ],
      "slot_uri": "GENEPIO:0001390",
      "any_of": [
        {
          "range": "host health outcome menu"
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
        "Select \"COVID-19\" from the pick list provided in the template."
      ],
      "examples": [
        {
          "value": "COVID-19"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Host Disease",
        "NML_LIMS:PH_HOST_DISEASE",
        "BIOSAMPLE:host_disease",
        "VirusSeq_Portal:host disease"
      ],
      "slot_uri": "GENEPIO:0001391",
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
    "host age": {
      "name": "host age",
      "description": "Age of host at the time of sampling.",
      "title": "host age",
      "comments": [
        "Enter the age of the host in years. If not available, provide a null value. If there is not host, put \"Not Applicable\"."
      ],
      "examples": [
        {
          "value": "79"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Patient age",
        "CNPHI:Patient Age",
        "NML_LIMS:PH_AGE",
        "BIOSAMPLE:host_age",
        "VirusSeq_Portal:host age"
      ],
      "slot_uri": "GENEPIO:0001392",
      "required": true,
      "minimum_value": 0,
      "maximum_value": 130,
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
      "description": "The unit used to measure the host age, in either months or years.",
      "title": "host age unit",
      "comments": [
        "Indicate whether the host age is in months or years. Age indicated in months will be binned to the 0 - 9 year age bin."
      ],
      "examples": [
        {
          "value": "years"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Age Units",
        "NML_LIMS:PH_AGE_UNIT",
        "VirusSeq_Portal:host age unit"
      ],
      "slot_uri": "GENEPIO:0001393",
      "required": true,
      "any_of": [
        {
          "range": "host age unit menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host age bin": {
      "name": "host age bin",
      "description": "Age of host at the time of sampling, expressed as an age group.",
      "title": "host age bin",
      "comments": [
        "Select the corresponding host age bin from the pick list provided in the template. If not available, provide a null value."
      ],
      "examples": [
        {
          "value": "60 - 69"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Host Age Category",
        "NML_LIMS:PH_AGE_GROUP",
        "VirusSeq_Portal:host age bin"
      ],
      "slot_uri": "GENEPIO:0001394",
      "required": true,
      "any_of": [
        {
          "range": "host age bin menu"
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
        "Select the corresponding host gender from the pick list provided in the template. If not available, provide a null value. If there is no host, put \"Not Applicable\"."
      ],
      "examples": [
        {
          "value": "male"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Gender",
        "CNPHI:Patient Sex",
        "NML_LIMS:VD_SEX",
        "BIOSAMPLE:host_sex",
        "VirusSeq_Portal:host gender"
      ],
      "slot_uri": "GENEPIO:0001395",
      "required": true,
      "structured_pattern": {
        "syntax": "{Title_Case}",
        "interpolated": true,
        "partial_match": false
      },
      "any_of": [
        {
          "range": "host gender menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host residence geo_loc name (country)": {
      "name": "host residence geo_loc name (country)",
      "description": "The country of residence of the host.",
      "title": "host residence geo_loc name (country)",
      "comments": [
        "Select the country name from pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Canada"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_HOST_COUNTRY"
      ],
      "slot_uri": "GENEPIO:0001396",
      "any_of": [
        {
          "range": "geo_loc_name (country) menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host residence geo_loc name (state/province/territory)": {
      "name": "host residence geo_loc name (state/province/territory)",
      "description": "The state/province/territory of residence of the host.",
      "title": "host residence geo_loc name (state/province/territory)",
      "comments": [
        "Select the province/territory name from pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Quebec"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_HOST_PROVINCE"
      ],
      "slot_uri": "GENEPIO:0001397",
      "any_of": [
        {
          "range": "geo_loc_name (state/province/territory) menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host subject ID": {
      "name": "host subject ID",
      "description": "A unique identifier by which each host can be referred to e.g. #131",
      "title": "host subject ID",
      "comments": [
        "Provide the host identifier. Should be a unique, user-defined identifier."
      ],
      "examples": [
        {
          "value": "BCxy123"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:host subject ID",
        "BIOSAMPLE:host_subject_id"
      ],
      "slot_uri": "GENEPIO:0001398",
      "range": "WhitespaceMinimizedString"
    },
    "symptom onset date": {
      "name": "symptom onset date",
      "description": "The date on which the symptoms began or were first noted.",
      "title": "symptom onset date",
      "comments": [
        "ISO 8601 standard \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2020-03-16"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Symptoms Onset Date",
        "NML_LIMS:HC_ONSET_DATE"
      ],
      "slot_uri": "GENEPIO:0001399",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "signs and symptoms": {
      "name": "signs and symptoms",
      "description": "A perceived change in function or sensation, (loss, disturbance or appearance) indicative of a disease, reported by a patient or clinician.",
      "title": "signs and symptoms",
      "comments": [
        "Select all of the symptoms experienced by the host from the pick list."
      ],
      "examples": [
        {
          "value": "Chills (sudden cold sensation)"
        },
        {
          "value": " Cough"
        },
        {
          "value": " Fever"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Symptoms",
        "NML_LIMS:HC_SYMPTOMS"
      ],
      "slot_uri": "GENEPIO:0001400",
      "multivalued": true,
      "any_of": [
        {
          "range": "signs and symptoms menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "pre-existing conditions and risk factors": {
      "name": "pre-existing conditions and risk factors",
      "description": "Patient pre-existing conditions and risk factors. <li>Pre-existing condition: A medical condition that existed prior to the current infection. <li>Risk Factor: A variable associated with an increased risk of disease or infection.",
      "title": "pre-existing conditions and risk factors",
      "comments": [
        "Select all of the pre-existing conditions and risk factors experienced by the host from the pick list. If the desired term is missing, contact the curation team."
      ],
      "examples": [
        {
          "value": "Asthma"
        },
        {
          "value": " Pregnancy"
        },
        {
          "value": " Smoking"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:pre-existing conditions and risk factors"
      ],
      "slot_uri": "GENEPIO:0001401",
      "multivalued": true,
      "any_of": [
        {
          "range": "pre-existing conditions and risk factors menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "complications": {
      "name": "complications",
      "description": "Patient medical complications that are believed to have occurred as a result of host disease.",
      "title": "complications",
      "comments": [
        "Select all of the complications experienced by the host from the pick list. If the desired term is missing, contact the curation team."
      ],
      "examples": [
        {
          "value": "Acute Respiratory Failure"
        },
        {
          "value": " Coma"
        },
        {
          "value": " Septicemia"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:complications"
      ],
      "slot_uri": "GENEPIO:0001402",
      "multivalued": true,
      "any_of": [
        {
          "range": "complications menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host vaccination status": {
      "name": "host vaccination status",
      "description": "The vaccination status of the host (fully vaccinated, partially vaccinated, or not vaccinated).",
      "title": "host vaccination status",
      "comments": [
        "Select the vaccination status of the host from the pick list."
      ],
      "examples": [
        {
          "value": "Fully Vaccinated"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0001404",
      "any_of": [
        {
          "range": "host vaccination status menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "number of vaccine doses received": {
      "name": "number of vaccine doses received",
      "description": "The number of doses of the vaccine recived by the host.",
      "title": "number of vaccine doses received",
      "comments": [
        "Record how many doses of the vaccine the host has received."
      ],
      "examples": [
        {
          "value": "2"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "slot_uri": "GENEPIO:0001406",
      "range": "integer"
    },
    "vaccination dose 1 vaccine name": {
      "name": "vaccination dose 1 vaccine name",
      "description": "The name of the vaccine administered as the first dose of a vaccine regimen.",
      "title": "vaccination dose 1 vaccine name",
      "comments": [
        "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the first dose by selecting a value from the pick list"
      ],
      "examples": [
        {
          "value": "Pfizer-BioNTech (Comirnaty)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100313",
      "any_of": [
        {
          "range": "vaccine name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 1 vaccination date": {
      "name": "vaccination dose 1 vaccination date",
      "description": "The date the first dose of a vaccine was administered.",
      "title": "vaccination dose 1 vaccination date",
      "comments": [
        "Provide the date the first dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2021-03-01"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100314",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 2 vaccine name": {
      "name": "vaccination dose 2 vaccine name",
      "description": "The name of the vaccine administered as the second dose of a vaccine regimen.",
      "title": "vaccination dose 2 vaccine name",
      "comments": [
        "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the second dose by selecting a value from the pick list"
      ],
      "examples": [
        {
          "value": "Pfizer-BioNTech (Comirnaty)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100315",
      "any_of": [
        {
          "range": "vaccine name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 2 vaccination date": {
      "name": "vaccination dose 2 vaccination date",
      "description": "The date the second dose of a vaccine was administered.",
      "title": "vaccination dose 2 vaccination date",
      "comments": [
        "Provide the date the second dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2021-09-01"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100316",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 3 vaccine name": {
      "name": "vaccination dose 3 vaccine name",
      "description": "The name of the vaccine administered as the third dose of a vaccine regimen.",
      "title": "vaccination dose 3 vaccine name",
      "comments": [
        "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the third dose by selecting a value from the pick list"
      ],
      "examples": [
        {
          "value": "Pfizer-BioNTech (Comirnaty)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100317",
      "any_of": [
        {
          "range": "vaccine name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 3 vaccination date": {
      "name": "vaccination dose 3 vaccination date",
      "description": "The date the third dose of a vaccine was administered.",
      "title": "vaccination dose 3 vaccination date",
      "comments": [
        "Provide the date the third dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2021-12-30"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100318",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 4 vaccine name": {
      "name": "vaccination dose 4 vaccine name",
      "description": "The name of the vaccine administered as the fourth dose of a vaccine regimen.",
      "title": "vaccination dose 4 vaccine name",
      "comments": [
        "Provide the name and the corresponding manufacturer of the COVID-19 vaccine administered as the fourth dose by selecting a value from the pick list"
      ],
      "examples": [
        {
          "value": "Pfizer-BioNTech (Comirnaty)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100319",
      "any_of": [
        {
          "range": "vaccine name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination dose 4 vaccination date": {
      "name": "vaccination dose 4 vaccination date",
      "description": "The date the fourth dose of a vaccine was administered.",
      "title": "vaccination dose 4 vaccination date",
      "comments": [
        "Provide the date the fourth dose of COVID-19 vaccine was administered. The date should be provided in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2022-01-15"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100320",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "vaccination history": {
      "name": "vaccination history",
      "description": "A description of the vaccines received and the administration dates of a series of vaccinations against a specific disease or a set of diseases.",
      "title": "vaccination history",
      "comments": [
        "Free text description of the dates and vaccines administered against a particular disease/set of diseases. It is also acceptable to concatenate the individual dose information (vaccine name, vaccination date) separated by semicolons."
      ],
      "examples": [
        {
          "value": "Pfizer-BioNTech (Comirnaty)"
        },
        {
          "value": " 2021-03-01"
        },
        {
          "value": " Pfizer-BioNTech (Comirnaty)"
        },
        {
          "value": " 2022-01-15"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VACCINATION_HISTORY"
      ],
      "slot_uri": "GENEPIO:0100321",
      "range": "WhitespaceMinimizedString"
    },
    "location of exposure geo_loc name (country)": {
      "name": "location of exposure geo_loc name (country)",
      "description": "The country where the host was likely exposed to the causative agent of the illness.",
      "title": "location of exposure geo_loc name (country)",
      "comments": [
        "Select the country name from pick list provided in the template."
      ],
      "examples": [
        {
          "value": "Canada"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_EXPOSURE_COUNTRY"
      ],
      "slot_uri": "GENEPIO:0001410",
      "any_of": [
        {
          "range": "geo_loc_name (country) menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "destination of most recent travel (city)": {
      "name": "destination of most recent travel (city)",
      "description": "The name of the city that was the destination of most recent travel.",
      "title": "destination of most recent travel (city)",
      "comments": [
        "Provide the name of the city that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz"
      ],
      "examples": [
        {
          "value": "New York City"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date",
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001411",
      "range": "WhitespaceMinimizedString"
    },
    "destination of most recent travel (state/province/territory)": {
      "name": "destination of most recent travel (state/province/territory)",
      "description": "The name of the province that was the destination of most recent travel.",
      "title": "destination of most recent travel (state/province/territory)",
      "comments": [
        "Provide the name of the state/province/territory that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz"
      ],
      "examples": [
        {
          "value": "California"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date",
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001412",
      "range": "WhitespaceMinimizedString"
    },
    "destination of most recent travel (country)": {
      "name": "destination of most recent travel (country)",
      "description": "The name of the country that was the destination of most recent travel.",
      "title": "destination of most recent travel (country)",
      "comments": [
        "Provide the name of the country that the host travelled to. Use this look-up service to identify the standardized term: https://www.ebi.ac.uk/ols/ontologies/gaz"
      ],
      "examples": [
        {
          "value": "United Kingdom"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date",
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001413",
      "any_of": [
        {
          "range": "geo_loc_name (country) menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "most recent travel departure date": {
      "name": "most recent travel departure date",
      "description": "The date of a person's most recent departure from their primary residence (at that time) on a journey to one or more other locations.",
      "title": "most recent travel departure date",
      "comments": [
        "Provide the travel departure date."
      ],
      "examples": [
        {
          "value": "2020-03-16"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date",
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001414",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "most recent travel return date": {
      "name": "most recent travel return date",
      "description": "The date of a person's most recent return to some residence from a journey originating at that residence.",
      "title": "most recent travel return date",
      "comments": [
        "Provide the travel return date."
      ],
      "examples": [
        {
          "value": "2020-04-26"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Country of Travel|Province of Travel|City of Travel|Travel start date|Travel End Date",
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001415",
      "any_of": [
        {
          "range": "date"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "travel point of entry type": {
      "name": "travel point of entry type",
      "description": "The type of entry point a traveler arrives through.",
      "title": "travel point of entry type",
      "comments": [
        "Select the point of entry type."
      ],
      "examples": [
        {
          "value": "Air"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_POINT_OF_ENTRY"
      ],
      "recommended": true,
      "any_of": [
        {
          "range": "travel point of entry type menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "border testing test day type": {
      "name": "border testing test day type",
      "description": "The day a traveller was tested on or after arrival at their point of entry.",
      "title": "border testing test day type",
      "comments": [
        "Select the test day."
      ],
      "examples": [
        {
          "value": "day 1"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_DAY"
      ],
      "recommended": true,
      "any_of": [
        {
          "range": "border testing test day type menu"
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
          "value": " USA, Seattle"
        },
        {
          "value": " Italy, Milan"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_TRAVEL"
      ],
      "slot_uri": "GENEPIO:0001416",
      "range": "WhitespaceMinimizedString"
    },
    "exposure event": {
      "name": "exposure event",
      "description": "Event leading to exposure.",
      "title": "exposure event",
      "comments": [
        "Select an exposure event from the pick list provided in the template. If the desired term is missing, contact the curation team."
      ],
      "examples": [
        {
          "value": "Convention"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Additional location information",
        "CNPHI:Exposure Event",
        "NML_LIMS:PH_EXPOSURE"
      ],
      "slot_uri": "GENEPIO:0001417",
      "any_of": [
        {
          "range": "exposure event menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "exposure contact level": {
      "name": "exposure contact level",
      "description": "The exposure transmission contact type.",
      "title": "exposure contact level",
      "comments": [
        "Select direct or indirect exposure from the pick-list."
      ],
      "examples": [
        {
          "value": "Direct"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:exposure contact level"
      ],
      "slot_uri": "GENEPIO:0001418",
      "any_of": [
        {
          "range": "exposure contact level menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "host role": {
      "name": "host role",
      "description": "The role of the host in relation to the exposure setting.",
      "title": "host role",
      "comments": [
        "Select the host's personal role(s) from the pick list provided in the template. If the desired term is missing, contact the curation team."
      ],
      "examples": [
        {
          "value": "Patient"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_HOST_ROLE"
      ],
      "slot_uri": "GENEPIO:0001419",
      "multivalued": true,
      "range": "host role menu"
    },
    "exposure setting": {
      "name": "exposure setting",
      "description": "The setting leading to exposure.",
      "title": "exposure setting",
      "comments": [
        "Select the host exposure setting(s) from the pick list provided in the template. If a desired term is missing, contact the curation team."
      ],
      "examples": [
        {
          "value": "Healthcare Setting"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_EXPOSURE"
      ],
      "slot_uri": "GENEPIO:0001428",
      "multivalued": true,
      "range": "exposure setting menu"
    },
    "exposure details": {
      "name": "exposure details",
      "description": "Additional host exposure information.",
      "title": "exposure details",
      "comments": [
        "Free text description of the exposure."
      ],
      "examples": [
        {
          "value": "Host role - Other: Bus Driver"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_EXPOSURE_DETAILS"
      ],
      "slot_uri": "GENEPIO:0001431",
      "range": "WhitespaceMinimizedString"
    },
    "prior SARS-CoV-2 infection": {
      "name": "prior SARS-CoV-2 infection",
      "description": "Whether there was prior SARS-CoV-2 infection.",
      "title": "prior SARS-CoV-2 infection",
      "comments": [
        "If known, provide information about whether the individual had a previous SARS-CoV-2 infection. Select a value from the pick list."
      ],
      "examples": [
        {
          "value": "Yes"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 infection"
      ],
      "slot_uri": "GENEPIO:0001435",
      "any_of": [
        {
          "range": "prior SARS-CoV-2 infection menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "prior SARS-CoV-2 infection isolate": {
      "name": "prior SARS-CoV-2 infection isolate",
      "description": "The identifier of the isolate found in the prior SARS-CoV-2 infection.",
      "title": "prior SARS-CoV-2 infection isolate",
      "comments": [
        "Provide the isolate name of the most recent prior infection. Structure the \"isolate\" name to be ICTV/INSDC compliant in the following format: \"SARS-CoV-2/host/country/sampleID/date\"."
      ],
      "examples": [
        {
          "value": "SARS-CoV-2/human/USA/CA-CDPH-001/2020"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 infection isolate"
      ],
      "slot_uri": "GENEPIO:0001436",
      "range": "WhitespaceMinimizedString"
    },
    "prior SARS-CoV-2 infection date": {
      "name": "prior SARS-CoV-2 infection date",
      "description": "The date of diagnosis of the prior SARS-CoV-2 infection.",
      "title": "prior SARS-CoV-2 infection date",
      "comments": [
        "Provide the date that the most recent prior infection was diagnosed. Provide the prior SARS-CoV-2 infection date in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2021-01-23"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 infection date"
      ],
      "slot_uri": "GENEPIO:0001437",
      "range": "date"
    },
    "prior SARS-CoV-2 antiviral treatment": {
      "name": "prior SARS-CoV-2 antiviral treatment",
      "description": "Whether there was prior SARS-CoV-2 treatment with an antiviral agent.",
      "title": "prior SARS-CoV-2 antiviral treatment",
      "comments": [
        "If known, provide information about whether the individual had a previous SARS-CoV-2 antiviral treatment. Select a value from the pick list."
      ],
      "examples": [
        {
          "value": "No prior antiviral treatment"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 antiviral treatment"
      ],
      "slot_uri": "GENEPIO:0001438",
      "any_of": [
        {
          "range": "prior SARS-CoV-2 antiviral treatment menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "prior SARS-CoV-2 antiviral treatment agent": {
      "name": "prior SARS-CoV-2 antiviral treatment agent",
      "description": "The name of the antiviral treatment agent administered during the prior SARS-CoV-2 infection.",
      "title": "prior SARS-CoV-2 antiviral treatment agent",
      "comments": [
        "Provide the name of the antiviral treatment agent administered during the most recent prior infection. If no treatment was administered, put \"No treatment\". If multiple antiviral agents were administered, list them all separated by commas."
      ],
      "examples": [
        {
          "value": "Remdesivir"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 antiviral treatment agent"
      ],
      "slot_uri": "GENEPIO:0001439",
      "range": "WhitespaceMinimizedString"
    },
    "prior SARS-CoV-2 antiviral treatment date": {
      "name": "prior SARS-CoV-2 antiviral treatment date",
      "description": "The date treatment was first administered during the prior SARS-CoV-2 infection.",
      "title": "prior SARS-CoV-2 antiviral treatment date",
      "comments": [
        "Provide the date that the antiviral treatment agent was first administered during the most recenrt prior infection. Provide the prior SARS-CoV-2 treatment date in ISO 8601 standard format \"YYYY-MM-DD\"."
      ],
      "examples": [
        {
          "value": "2021-01-28"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:prior SARS-CoV-2 antiviral treatment date"
      ],
      "slot_uri": "GENEPIO:0001440",
      "range": "date"
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
          "value": "Baseline surveillance (random sampling)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Reason for Sequencing",
        "NML_LIMS:PH_REASON_FOR_SEQUENCING",
        "BIOSAMPLE:purpose_of_sequencing",
        "VirusSeq_Portal:purpose of sequencing"
      ],
      "slot_uri": "GENEPIO:0001445",
      "multivalued": true,
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
      "comments": [
        "Provide an expanded description of why the sample was sequenced using free text. The description may include the importance of the sequences for a particular public health investigation/surveillance activity/research question. Suggested standardized descriotions include: Screened for S gene target failure (S dropout), Screened for mink variants, Screened for B.1.1.7 variant, Screened for B.1.135 variant, Screened for P.1 variant, Screened due to travel history, Screened due to close contact with infected individual, Assessing public health control measures, Determining early introductions and spread, Investigating airline-related exposures, Investigating temporary foreign worker, Investigating remote regions, Investigating health care workers, Investigating schools/universities, Investigating reinfection."
      ],
      "examples": [
        {
          "value": "Screened for S gene target failure (S dropout)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_SEQUENCING_DATE"
      ],
      "slot_uri": "GENEPIO:0001447",
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
    "library ID": {
      "name": "library ID",
      "description": "The user-specified identifier for the library prepared for sequencing.",
      "title": "library ID",
      "comments": [
        "The library name should be unique, and can be an autogenerated ID from your LIMS, or modification of the isolate ID."
      ],
      "examples": [
        {
          "value": "XYZ_123345"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:library ID"
      ],
      "slot_uri": "GENEPIO:0001448",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "amplicon size": {
      "name": "amplicon size",
      "description": "The length of the amplicon generated by PCR amplification.",
      "title": "amplicon size",
      "comments": [
        "Provide the amplicon size, including the units."
      ],
      "examples": [
        {
          "value": "300bp"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:amplicon size"
      ],
      "slot_uri": "GENEPIO:0001449",
      "range": "WhitespaceMinimizedString"
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_LIBRARY_PREP_KIT"
      ],
      "slot_uri": "GENEPIO:0001450",
      "range": "WhitespaceMinimizedString"
    },
    "flow cell barcode": {
      "name": "flow cell barcode",
      "description": "The barcode of the flow cell used for sequencing.",
      "title": "flow cell barcode",
      "comments": [
        "Provide the barcode of the flow cell used for sequencing the sample."
      ],
      "examples": [
        {
          "value": "FAB06069"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:flow cell barcode"
      ],
      "slot_uri": "GENEPIO:0001451",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Sequencing technology",
        "CNPHI:Sequencing Instrument",
        "NML_LIMS:PH_INSTRUMENT_CGN",
        "VirusSeq_Portal:sequencing instrument"
      ],
      "slot_uri": "GENEPIO:0001452",
      "multivalued": true,
      "required": true,
      "any_of": [
        {
          "range": "sequencing instrument menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "sequencing protocol name": {
      "name": "sequencing protocol name",
      "description": "The name and version number of the sequencing protocol used.",
      "title": "sequencing protocol name",
      "comments": [
        "Provide the name and version of the sequencing protocol e.g. 1D_DNA_MinION"
      ],
      "examples": [
        {
          "value": "https://www.protocols.io/view/covid-19-artic-v3-illumina-library-construction-an-bibtkann"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Sequencing Protocol Name",
        "NML_LIMS:PH_SEQ_PROTOCOL_NAME"
      ],
      "slot_uri": "GENEPIO:0001453",
      "range": "WhitespaceMinimizedString",
      "recommended": true
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_TESTING_PROTOCOL",
        "VirusSeq_Portal:sequencing protocol"
      ],
      "slot_uri": "GENEPIO:0001454",
      "range": "WhitespaceMinimizedString"
    },
    "sequencing kit number": {
      "name": "sequencing kit number",
      "description": "The manufacturer's kit number.",
      "title": "sequencing kit number",
      "comments": [
        "Alphanumeric value."
      ],
      "examples": [
        {
          "value": "AB456XYZ789"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:sequencing kit number"
      ],
      "slot_uri": "GENEPIO:0001455",
      "range": "WhitespaceMinimizedString"
    },
    "amplicon pcr primer scheme": {
      "name": "amplicon pcr primer scheme",
      "description": "The specifications of the primers (primer sequences, binding positions, fragment size generated etc) used to generate the amplicons to be sequenced.",
      "title": "amplicon pcr primer scheme",
      "comments": [
        "Provide the name and version of the primer scheme used to generate the amplicons for sequencing."
      ],
      "examples": [
        {
          "value": "https://github.com/joshquick/artic-ncov2019/blob/master/primer_schemes/nCoV-2019/V3/nCoV-2019.tsv"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:amplicon pcr primer scheme"
      ],
      "slot_uri": "GENEPIO:0001456",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_RAW_SEQUENCE_METHOD",
        "VirusSeq_Portal:raw sequence data processing method"
      ],
      "slot_uri": "GENEPIO:0001458",
      "range": "WhitespaceMinimizedString",
      "required": true
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_DEHOSTING_METHOD",
        "VirusSeq_Portal:dehosting method"
      ],
      "slot_uri": "GENEPIO:0001459",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "consensus sequence name": {
      "name": "consensus sequence name",
      "description": "The name of the consensus sequence.",
      "title": "consensus sequence name",
      "comments": [
        "Provide the name and version number of the consensus sequence."
      ],
      "examples": [
        {
          "value": "ncov123assembly3"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:consensus sequence name"
      ],
      "slot_uri": "GENEPIO:0001460",
      "range": "WhitespaceMinimizedString"
    },
    "consensus sequence filename": {
      "name": "consensus sequence filename",
      "description": "The name of the consensus sequence file.",
      "title": "consensus sequence filename",
      "comments": [
        "Provide the name and version number of the consensus sequence FASTA file."
      ],
      "examples": [
        {
          "value": "ncov123assembly.fasta"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:consensus sequence filename"
      ],
      "slot_uri": "GENEPIO:0001461",
      "range": "WhitespaceMinimizedString"
    },
    "consensus sequence filepath": {
      "name": "consensus sequence filepath",
      "description": "The filepath of the consesnsus sequence file.",
      "title": "consensus sequence filepath",
      "comments": [
        "Provide the filepath of the consensus sequence FASTA file."
      ],
      "examples": [
        {
          "value": "/User/Documents/RespLab/Data/ncov123assembly.fasta"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:consensus sequence filepath"
      ],
      "slot_uri": "GENEPIO:0001462",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:Coverage",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:depth of coverage threshold"
      ],
      "slot_uri": "GENEPIO:0001475",
      "range": "WhitespaceMinimizedString"
    },
    "r1 fastq filename": {
      "name": "r1 fastq filename",
      "description": "The user-specified filename of the r1 FASTQ file.",
      "title": "r1 fastq filename",
      "comments": [
        "Provide the r1 FASTQ filename."
      ],
      "examples": [
        {
          "value": "ABC123_S1_L001_R1_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:r1 fastq filename"
      ],
      "slot_uri": "GENEPIO:0001476",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "r2 fastq filename": {
      "name": "r2 fastq filename",
      "description": "The user-specified filename of the r2 FASTQ file.",
      "title": "r2 fastq filename",
      "comments": [
        "Provide the r2 FASTQ filename."
      ],
      "examples": [
        {
          "value": "ABC123_S1_L001_R2_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:r2 fastq filename"
      ],
      "slot_uri": "GENEPIO:0001477",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "r1 fastq filepath": {
      "name": "r1 fastq filepath",
      "description": "The location of the r1 FASTQ file within a user's file system.",
      "title": "r1 fastq filepath",
      "comments": [
        "Provide the filepath for the r1 FASTQ file. This information aids in data management."
      ],
      "examples": [
        {
          "value": "/User/Documents/RespLab/Data/ABC123_S1_L001_R1_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:r1 fastq filepath"
      ],
      "slot_uri": "GENEPIO:0001478",
      "range": "WhitespaceMinimizedString"
    },
    "r2 fastq filepath": {
      "name": "r2 fastq filepath",
      "description": "The location of the r2 FASTQ file within a user's file system.",
      "title": "r2 fastq filepath",
      "comments": [
        "Provide the filepath for the r2 FASTQ file. This information aids in data management."
      ],
      "examples": [
        {
          "value": "/User/Documents/RespLab/Data/ABC123_S1_L001_R2_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:r2 fastq filepath"
      ],
      "slot_uri": "GENEPIO:0001479",
      "range": "WhitespaceMinimizedString"
    },
    "fast5 filename": {
      "name": "fast5 filename",
      "description": "The user-specified filename of the FAST5 file.",
      "title": "fast5 filename",
      "comments": [
        "Provide the FAST5 filename."
      ],
      "examples": [
        {
          "value": "rona123assembly.fast5"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:fast5 filename"
      ],
      "slot_uri": "GENEPIO:0001480",
      "range": "WhitespaceMinimizedString"
    },
    "fast5 filepath": {
      "name": "fast5 filepath",
      "description": "The location of the FAST5 file within a user's file system.",
      "title": "fast5 filepath",
      "comments": [
        "Provide the filepath for the FAST5 file. This information aids in data management."
      ],
      "examples": [
        {
          "value": "/User/Documents/RespLab/Data/rona123assembly.fast5"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:fast5 filepath"
      ],
      "slot_uri": "GENEPIO:0001481",
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
          "value": "387566"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:number of base pairs sequenced"
      ],
      "slot_uri": "GENEPIO:0001482",
      "range": "integer",
      "minimum_value": 0
    },
    "consensus genome length": {
      "name": "consensus genome length",
      "description": "Size of the reconstructed genome described as the number of base pairs.",
      "title": "consensus genome length",
      "comments": [
        "Provide a numerical value (no need to include units)."
      ],
      "examples": [
        {
          "value": "38677"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:consensus genome length"
      ],
      "slot_uri": "GENEPIO:0001483",
      "range": "integer",
      "minimum_value": 0
    },
    "Ns per 100 kbp": {
      "name": "Ns per 100 kbp",
      "description": "The number of N symbols present in the consensus fasta sequence, per 100kbp of sequence.",
      "title": "Ns per 100 kbp",
      "comments": [
        "Provide a numerical value (no need to include units)."
      ],
      "examples": [
        {
          "value": "330"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:Ns per 100 kbp"
      ],
      "slot_uri": "GENEPIO:0001484",
      "range": "decimal",
      "minimum_value": 0
    },
    "reference genome accession": {
      "name": "reference genome accession",
      "description": "A persistent, unique identifier of a genome database entry.",
      "title": "reference genome accession",
      "comments": [
        "Provide the accession number of the reference genome."
      ],
      "examples": [
        {
          "value": "NC_045512.2"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:reference genome accession",
        "VirusSeq_Portal:reference genome accession"
      ],
      "slot_uri": "GENEPIO:0001485",
      "range": "WhitespaceMinimizedString"
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Bioinformatics Protocol",
        "NML_LIMS:PH_BIOINFORMATICS_PROTOCOL",
        "VirusSeq_Portal:bioinformatics protocol"
      ],
      "slot_uri": "GENEPIO:0001489",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "lineage/clade name": {
      "name": "lineage/clade name",
      "description": "The name of the lineage or clade.",
      "title": "lineage/clade name",
      "comments": [
        "Provide the Pangolin or Nextstrain lineage/clade name."
      ],
      "examples": [
        {
          "value": "B.1.1.7"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_LINEAGE_CLADE_NAME"
      ],
      "slot_uri": "GENEPIO:0001500",
      "range": "WhitespaceMinimizedString"
    },
    "lineage/clade analysis software name": {
      "name": "lineage/clade analysis software name",
      "description": "The name of the software used to determine the lineage/clade.",
      "title": "lineage/clade analysis software name",
      "comments": [
        "Provide the name of the software used to determine the lineage/clade."
      ],
      "examples": [
        {
          "value": "Pangolin"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_LINEAGE_CLADE_SOFTWARE"
      ],
      "slot_uri": "GENEPIO:0001501",
      "range": "WhitespaceMinimizedString"
    },
    "lineage/clade analysis software version": {
      "name": "lineage/clade analysis software version",
      "description": "The version of the software used to determine the lineage/clade.",
      "title": "lineage/clade analysis software version",
      "comments": [
        "Provide the version of the software used ot determine the lineage/clade."
      ],
      "examples": [
        {
          "value": "2.1.10"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_LINEAGE_CLADE_VERSION"
      ],
      "slot_uri": "GENEPIO:0001502",
      "range": "WhitespaceMinimizedString"
    },
    "variant designation": {
      "name": "variant designation",
      "description": "The variant classification of the lineage/clade i.e. variant, variant of concern.",
      "title": "variant designation",
      "comments": [
        "If the lineage/clade is considered a Variant of Concern, select Variant of Concern from the pick list. If the lineage/clade contains mutations of concern (mutations that increase transmission, clincal severity, or other epidemiological fa ctors) but it not a global Variant of Concern, select Variant. If the lineage/clade does not contain mutations of concern, leave blank."
      ],
      "examples": [
        {
          "value": "Variant of Concern"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VARIANT_DESIGNATION"
      ],
      "slot_uri": "GENEPIO:0001503",
      "any_of": [
        {
          "range": "variant designation menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "variant evidence": {
      "name": "variant evidence",
      "description": "The evidence used to make the variant determination.",
      "title": "variant evidence",
      "comments": [
        "Select whether the sample was screened using RT-qPCR or by sequencing from the pick list."
      ],
      "examples": [
        {
          "value": "RT-qPCR"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VARIANT_EVIDENCE"
      ],
      "slot_uri": "GENEPIO:0001504",
      "any_of": [
        {
          "range": "variant evidence menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "variant evidence details": {
      "name": "variant evidence details",
      "description": "Details about the evidence used to make the variant determination.",
      "title": "variant evidence details",
      "comments": [
        "Provide the assay and list the set of lineage-defining mutations used to make the variant determination. If there are mutations of interest/concern observed in addition to lineage-defining mutations, describe those here."
      ],
      "examples": [
        {
          "value": "Lineage-defining mutations: ORF1ab (K1655N), Spike (K417N, E484K, N501Y, D614G, A701V), N (T205I), E (P71L)."
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "NML_LIMS:PH_VARIANT_EVIDENCE_DETAILS"
      ],
      "slot_uri": "GENEPIO:0001505",
      "range": "WhitespaceMinimizedString"
    },
    "gene name 1": {
      "name": "gene name 1",
      "description": "The name of the gene used in the diagnostic RT-PCR test.",
      "title": "gene name 1",
      "comments": [
        "Provide the full name of the gene used in the test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI"
      ],
      "examples": [
        {
          "value": "E gene (orf4)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 1",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #1",
        "BIOSAMPLE:gene_name_1",
        "VirusSeq_Portal:gene name"
      ],
      "slot_uri": "GENEPIO:0001507",
      "any_of": [
        {
          "range": "gene name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "diagnostic pcr protocol 1": {
      "name": "diagnostic pcr protocol 1",
      "description": "The name and version number of the protocol used for diagnostic marker amplification.",
      "title": "diagnostic pcr protocol 1",
      "comments": [
        "The name and version number of the protocol used for carrying out a diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control."
      ],
      "examples": [
        {
          "value": "EGenePCRTest 2"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "slot_uri": "GENEPIO:0001508",
      "range": "WhitespaceMinimizedString"
    },
    "diagnostic pcr Ct value 1": {
      "name": "diagnostic pcr Ct value 1",
      "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
      "title": "diagnostic pcr Ct value 1",
      "comments": [
        "Provide the CT value of the sample from the diagnostic RT-PCR test."
      ],
      "examples": [
        {
          "value": "21"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 1 CT Value",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #1 CT Value",
        "BIOSAMPLE:diagnostic_PCR_CT_value_1",
        "VirusSeq_Portal:diagnostic pcr Ct value"
      ],
      "slot_uri": "GENEPIO:0001509",
      "any_of": [
        {
          "range": "decimal"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "gene name 2": {
      "name": "gene name 2",
      "description": "The name of the gene used in the diagnostic RT-PCR test.",
      "title": "gene name 2",
      "comments": [
        "Provide the full name of another gene used in an RT-PCR test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI"
      ],
      "examples": [
        {
          "value": "RdRp gene (nsp12)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 2",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #2",
        "BIOSAMPLE:gene_name_2"
      ],
      "slot_uri": "GENEPIO:0001510",
      "any_of": [
        {
          "range": "gene name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "diagnostic pcr protocol 2": {
      "name": "diagnostic pcr protocol 2",
      "description": "The name and version number of the protocol used for diagnostic marker amplification.",
      "title": "diagnostic pcr protocol 2",
      "comments": [
        "The name and version number of the protocol used for carrying out a second diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control."
      ],
      "examples": [
        {
          "value": "RdRpGenePCRTest 3"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "slot_uri": "GENEPIO:0001511",
      "range": "WhitespaceMinimizedString"
    },
    "diagnostic pcr Ct value 2": {
      "name": "diagnostic pcr Ct value 2",
      "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
      "title": "diagnostic pcr Ct value 2",
      "comments": [
        "Provide the CT value of the sample from the second diagnostic RT-PCR test."
      ],
      "examples": [
        {
          "value": "36"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 2 CT Value",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #2 CT Value",
        "BIOSAMPLE:diagnostic_PCR_CT_value_2"
      ],
      "slot_uri": "GENEPIO:0001512",
      "any_of": [
        {
          "range": "decimal"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "gene name 3": {
      "name": "gene name 3",
      "description": "The name of the gene used in the diagnostic RT-PCR test.",
      "title": "gene name 3",
      "comments": [
        "Provide the full name of another gene used in an RT-PCR test. The gene symbol (short form of gene name) can also be provided. Standardized gene names and symbols can be found in the Gene Ontology using this look-up service: https://bit.ly/2Sq1LbI"
      ],
      "examples": [
        {
          "value": "RdRp gene (nsp12)"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 3",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #3"
      ],
      "slot_uri": "GENEPIO:0001513",
      "any_of": [
        {
          "range": "gene name menu"
        },
        {
          "range": "null value menu"
        }
      ]
    },
    "diagnostic pcr protocol 3": {
      "name": "diagnostic pcr protocol 3",
      "description": "The name and version number of the protocol used for diagnostic marker amplification.",
      "title": "diagnostic pcr protocol 3",
      "comments": [
        "The name and version number of the protocol used for carrying out a second diagnostic PCR test. This information can be compared to sequence data for evaluation of performance and quality control."
      ],
      "examples": [
        {
          "value": "RdRpGenePCRTest 3"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "slot_uri": "GENEPIO:0001514",
      "range": "WhitespaceMinimizedString"
    },
    "diagnostic pcr Ct value 3": {
      "name": "diagnostic pcr Ct value 3",
      "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
      "title": "diagnostic pcr Ct value 3",
      "comments": [
        "Provide the CT value of the sample from the second diagnostic RT-PCR test."
      ],
      "examples": [
        {
          "value": "30"
        }
      ],
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "CNPHI:Gene Target 3 CT Value",
        "NML_LIMS:SUBMITTED_RESLT - Gene Target #3 CT Value"
      ],
      "slot_uri": "GENEPIO:0001515",
      "any_of": [
        {
          "range": "decimal"
        },
        {
          "range": "null value menu"
        }
      ]
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
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
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "exact_mappings": [
        "GISAID:DataHarmonizer provenance",
        "CNPHI:Additional Comments",
        "NML_LIMS:HC_COMMENTS"
      ],
      "slot_uri": "GENEPIO:0001518",
      "range": "provenance"
    }
  },
  "classes": {
    "dh_interface": {
      "name": "dh_interface",
      "description": "A DataHarmonizer interface",
      "from_schema": "https://example.com/CanCOGeN_Covid-19"
    },
    "CanCOGeN Covid-19": {
      "name": "CanCOGeN Covid-19",
      "description": "Canadian specification for Covid-19 clinical virus biosample data gathering",
      "from_schema": "https://example.com/CanCOGeN_Covid-19",
      "is_a": "dh_interface",
      "slot_usage": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "rank": 1,
          "slot_group": "Database Identifiers"
        },
        "third party lab service provider name": {
          "name": "third party lab service provider name",
          "rank": 2,
          "slot_group": "Database Identifiers"
        },
        "third party lab sample ID": {
          "name": "third party lab sample ID",
          "rank": 3,
          "slot_group": "Database Identifiers"
        },
        "case ID": {
          "name": "case ID",
          "rank": 4,
          "slot_group": "Database Identifiers"
        },
        "Related specimen primary ID": {
          "name": "Related specimen primary ID",
          "rank": 5,
          "slot_group": "Database Identifiers"
        },
        "IRIDA sample name": {
          "name": "IRIDA sample name",
          "rank": 6,
          "slot_group": "Database Identifiers"
        },
        "umbrella bioproject accession": {
          "name": "umbrella bioproject accession",
          "rank": 7,
          "slot_group": "Database Identifiers"
        },
        "bioproject accession": {
          "name": "bioproject accession",
          "rank": 8,
          "slot_group": "Database Identifiers"
        },
        "biosample accession": {
          "name": "biosample accession",
          "rank": 9,
          "slot_group": "Database Identifiers"
        },
        "SRA accession": {
          "name": "SRA accession",
          "rank": 10,
          "slot_group": "Database Identifiers"
        },
        "GenBank accession": {
          "name": "GenBank accession",
          "rank": 11,
          "slot_group": "Database Identifiers"
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "rank": 12,
          "slot_group": "Database Identifiers"
        },
        "sample collected by": {
          "name": "sample collected by",
          "rank": 13,
          "slot_group": "Sample collection and processing"
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "rank": 14,
          "slot_group": "Sample collection and processing"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "rank": 15,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "rank": 16,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "rank": 17,
          "slot_group": "Sample collection and processing"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "rank": 18,
          "slot_group": "Sample collection and processing"
        },
        "sample collection date": {
          "name": "sample collection date",
          "rank": 19,
          "slot_group": "Sample collection and processing"
        },
        "sample collection date precision": {
          "name": "sample collection date precision",
          "rank": 20,
          "slot_group": "Sample collection and processing"
        },
        "sample received date": {
          "name": "sample received date",
          "rank": 21,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "rank": 22,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "rank": 23,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (city)": {
          "name": "geo_loc_name (city)",
          "rank": 24,
          "slot_group": "Sample collection and processing"
        },
        "organism": {
          "name": "organism",
          "rank": 25,
          "slot_group": "Sample collection and processing"
        },
        "isolate": {
          "name": "isolate",
          "rank": 26,
          "slot_group": "Sample collection and processing"
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "rank": 27,
          "slot_group": "Sample collection and processing"
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "rank": 28,
          "slot_group": "Sample collection and processing"
        },
        "NML submitted specimen type": {
          "name": "NML submitted specimen type",
          "rank": 29,
          "slot_group": "Sample collection and processing"
        },
        "Related specimen relationship type": {
          "name": "Related specimen relationship type",
          "rank": 30,
          "slot_group": "Sample collection and processing"
        },
        "anatomical material": {
          "name": "anatomical material",
          "rank": 31,
          "slot_group": "Sample collection and processing"
        },
        "anatomical part": {
          "name": "anatomical part",
          "rank": 32,
          "slot_group": "Sample collection and processing"
        },
        "body product": {
          "name": "body product",
          "rank": 33,
          "slot_group": "Sample collection and processing"
        },
        "environmental material": {
          "name": "environmental material",
          "rank": 34,
          "slot_group": "Sample collection and processing"
        },
        "environmental site": {
          "name": "environmental site",
          "rank": 35,
          "slot_group": "Sample collection and processing"
        },
        "collection device": {
          "name": "collection device",
          "rank": 36,
          "slot_group": "Sample collection and processing"
        },
        "collection method": {
          "name": "collection method",
          "rank": 37,
          "slot_group": "Sample collection and processing"
        },
        "collection protocol": {
          "name": "collection protocol",
          "rank": 38,
          "slot_group": "Sample collection and processing"
        },
        "specimen processing": {
          "name": "specimen processing",
          "rank": 39,
          "slot_group": "Sample collection and processing"
        },
        "specimen processing details": {
          "name": "specimen processing details",
          "rank": 40,
          "slot_group": "Sample collection and processing"
        },
        "lab host": {
          "name": "lab host",
          "rank": 41,
          "slot_group": "Sample collection and processing"
        },
        "passage number": {
          "name": "passage number",
          "rank": 42,
          "slot_group": "Sample collection and processing"
        },
        "passage method": {
          "name": "passage method",
          "rank": 43,
          "slot_group": "Sample collection and processing"
        },
        "biomaterial extracted": {
          "name": "biomaterial extracted",
          "rank": 44,
          "slot_group": "Sample collection and processing"
        },
        "host (common name)": {
          "name": "host (common name)",
          "rank": 45,
          "slot_group": "Host Information"
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "rank": 46,
          "slot_group": "Host Information"
        },
        "host health state": {
          "name": "host health state",
          "rank": 47,
          "slot_group": "Host Information"
        },
        "host health status details": {
          "name": "host health status details",
          "rank": 48,
          "slot_group": "Host Information"
        },
        "host health outcome": {
          "name": "host health outcome",
          "rank": 49,
          "slot_group": "Host Information"
        },
        "host disease": {
          "name": "host disease",
          "rank": 50,
          "slot_group": "Host Information"
        },
        "host age": {
          "name": "host age",
          "rank": 51,
          "slot_group": "Host Information"
        },
        "host age unit": {
          "name": "host age unit",
          "rank": 52,
          "slot_group": "Host Information"
        },
        "host age bin": {
          "name": "host age bin",
          "rank": 53,
          "slot_group": "Host Information"
        },
        "host gender": {
          "name": "host gender",
          "rank": 54,
          "slot_group": "Host Information"
        },
        "host residence geo_loc name (country)": {
          "name": "host residence geo_loc name (country)",
          "rank": 55,
          "slot_group": "Host Information"
        },
        "host residence geo_loc name (state/province/territory)": {
          "name": "host residence geo_loc name (state/province/territory)",
          "rank": 56,
          "slot_group": "Host Information"
        },
        "host subject ID": {
          "name": "host subject ID",
          "rank": 57,
          "slot_group": "Host Information"
        },
        "symptom onset date": {
          "name": "symptom onset date",
          "rank": 58,
          "slot_group": "Host Information"
        },
        "signs and symptoms": {
          "name": "signs and symptoms",
          "rank": 59,
          "slot_group": "Host Information"
        },
        "pre-existing conditions and risk factors": {
          "name": "pre-existing conditions and risk factors",
          "rank": 60,
          "slot_group": "Host Information"
        },
        "complications": {
          "name": "complications",
          "rank": 61,
          "slot_group": "Host Information"
        },
        "host vaccination status": {
          "name": "host vaccination status",
          "rank": 62,
          "slot_group": "Host vaccination information"
        },
        "number of vaccine doses received": {
          "name": "number of vaccine doses received",
          "rank": 63,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 1 vaccine name": {
          "name": "vaccination dose 1 vaccine name",
          "rank": 64,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 1 vaccination date": {
          "name": "vaccination dose 1 vaccination date",
          "rank": 65,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 2 vaccine name": {
          "name": "vaccination dose 2 vaccine name",
          "rank": 66,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 2 vaccination date": {
          "name": "vaccination dose 2 vaccination date",
          "rank": 67,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 3 vaccine name": {
          "name": "vaccination dose 3 vaccine name",
          "rank": 68,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 3 vaccination date": {
          "name": "vaccination dose 3 vaccination date",
          "rank": 69,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 4 vaccine name": {
          "name": "vaccination dose 4 vaccine name",
          "rank": 70,
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 4 vaccination date": {
          "name": "vaccination dose 4 vaccination date",
          "rank": 71,
          "slot_group": "Host vaccination information"
        },
        "vaccination history": {
          "name": "vaccination history",
          "rank": 72,
          "slot_group": "Host vaccination information"
        },
        "location of exposure geo_loc name (country)": {
          "name": "location of exposure geo_loc name (country)",
          "rank": 73,
          "slot_group": "Host exposure information"
        },
        "destination of most recent travel (city)": {
          "name": "destination of most recent travel (city)",
          "rank": 74,
          "slot_group": "Host exposure information"
        },
        "destination of most recent travel (state/province/territory)": {
          "name": "destination of most recent travel (state/province/territory)",
          "rank": 75,
          "slot_group": "Host exposure information"
        },
        "destination of most recent travel (country)": {
          "name": "destination of most recent travel (country)",
          "rank": 76,
          "slot_group": "Host exposure information"
        },
        "most recent travel departure date": {
          "name": "most recent travel departure date",
          "rank": 77,
          "slot_group": "Host exposure information"
        },
        "most recent travel return date": {
          "name": "most recent travel return date",
          "rank": 78,
          "slot_group": "Host exposure information"
        },
        "travel point of entry type": {
          "name": "travel point of entry type",
          "rank": 79,
          "slot_group": "Host exposure information"
        },
        "border testing test day type": {
          "name": "border testing test day type",
          "rank": 80,
          "slot_group": "Host exposure information"
        },
        "travel history": {
          "name": "travel history",
          "rank": 81,
          "slot_group": "Host exposure information"
        },
        "exposure event": {
          "name": "exposure event",
          "rank": 82,
          "slot_group": "Host exposure information"
        },
        "exposure contact level": {
          "name": "exposure contact level",
          "rank": 83,
          "slot_group": "Host exposure information"
        },
        "host role": {
          "name": "host role",
          "rank": 84,
          "slot_group": "Host exposure information"
        },
        "exposure setting": {
          "name": "exposure setting",
          "rank": 85,
          "slot_group": "Host exposure information"
        },
        "exposure details": {
          "name": "exposure details",
          "rank": 86,
          "slot_group": "Host exposure information"
        },
        "prior SARS-CoV-2 infection": {
          "name": "prior SARS-CoV-2 infection",
          "rank": 87,
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 infection isolate": {
          "name": "prior SARS-CoV-2 infection isolate",
          "rank": 88,
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 infection date": {
          "name": "prior SARS-CoV-2 infection date",
          "rank": 89,
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 antiviral treatment": {
          "name": "prior SARS-CoV-2 antiviral treatment",
          "rank": 90,
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 antiviral treatment agent": {
          "name": "prior SARS-CoV-2 antiviral treatment agent",
          "rank": 91,
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 antiviral treatment date": {
          "name": "prior SARS-CoV-2 antiviral treatment date",
          "rank": 92,
          "slot_group": "Host reinfection information"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "rank": 93,
          "slot_group": "Sequencing"
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "rank": 94,
          "slot_group": "Sequencing"
        },
        "sequencing date": {
          "name": "sequencing date",
          "rank": 95,
          "slot_group": "Sequencing"
        },
        "library ID": {
          "name": "library ID",
          "rank": 96,
          "slot_group": "Sequencing"
        },
        "amplicon size": {
          "name": "amplicon size",
          "rank": 97,
          "slot_group": "Sequencing"
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "rank": 98,
          "slot_group": "Sequencing"
        },
        "flow cell barcode": {
          "name": "flow cell barcode",
          "rank": 99,
          "slot_group": "Sequencing"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "rank": 100,
          "slot_group": "Sequencing"
        },
        "sequencing protocol name": {
          "name": "sequencing protocol name",
          "rank": 101,
          "slot_group": "Sequencing"
        },
        "sequencing protocol": {
          "name": "sequencing protocol",
          "rank": 102,
          "slot_group": "Sequencing"
        },
        "sequencing kit number": {
          "name": "sequencing kit number",
          "rank": 103,
          "slot_group": "Sequencing"
        },
        "amplicon pcr primer scheme": {
          "name": "amplicon pcr primer scheme",
          "rank": 104,
          "slot_group": "Sequencing"
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "rank": 105,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "dehosting method": {
          "name": "dehosting method",
          "rank": 106,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence name": {
          "name": "consensus sequence name",
          "rank": 107,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence filename": {
          "name": "consensus sequence filename",
          "rank": 108,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence filepath": {
          "name": "consensus sequence filepath",
          "rank": 109,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "rank": 110,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "rank": 111,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "rank": 112,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "rank": 113,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "rank": 114,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "r1 fastq filename": {
          "name": "r1 fastq filename",
          "rank": 115,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "r2 fastq filename": {
          "name": "r2 fastq filename",
          "rank": 116,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "r1 fastq filepath": {
          "name": "r1 fastq filepath",
          "rank": 117,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "r2 fastq filepath": {
          "name": "r2 fastq filepath",
          "rank": 118,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "fast5 filename": {
          "name": "fast5 filename",
          "rank": 119,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "fast5 filepath": {
          "name": "fast5 filepath",
          "rank": 120,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "rank": 121,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "consensus genome length": {
          "name": "consensus genome length",
          "rank": 122,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "Ns per 100 kbp": {
          "name": "Ns per 100 kbp",
          "rank": 123,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "reference genome accession": {
          "name": "reference genome accession",
          "rank": 124,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "rank": 125,
          "slot_group": "Bioinformatics and QC metrics"
        },
        "lineage/clade name": {
          "name": "lineage/clade name",
          "rank": 126,
          "slot_group": "Lineage and Variant information"
        },
        "lineage/clade analysis software name": {
          "name": "lineage/clade analysis software name",
          "rank": 127,
          "slot_group": "Lineage and Variant information"
        },
        "lineage/clade analysis software version": {
          "name": "lineage/clade analysis software version",
          "rank": 128,
          "slot_group": "Lineage and Variant information"
        },
        "variant designation": {
          "name": "variant designation",
          "rank": 129,
          "slot_group": "Lineage and Variant information"
        },
        "variant evidence": {
          "name": "variant evidence",
          "rank": 130,
          "slot_group": "Lineage and Variant information"
        },
        "variant evidence details": {
          "name": "variant evidence details",
          "rank": 131,
          "slot_group": "Lineage and Variant information"
        },
        "gene name 1": {
          "name": "gene name 1",
          "rank": 132,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 1": {
          "name": "diagnostic pcr protocol 1",
          "rank": 133,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr Ct value 1": {
          "name": "diagnostic pcr Ct value 1",
          "rank": 134,
          "slot_group": "Pathogen diagnostic testing"
        },
        "gene name 2": {
          "name": "gene name 2",
          "rank": 135,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 2": {
          "name": "diagnostic pcr protocol 2",
          "rank": 136,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr Ct value 2": {
          "name": "diagnostic pcr Ct value 2",
          "rank": 137,
          "slot_group": "Pathogen diagnostic testing"
        },
        "gene name 3": {
          "name": "gene name 3",
          "rank": 138,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 3": {
          "name": "diagnostic pcr protocol 3",
          "rank": 139,
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr Ct value 3": {
          "name": "diagnostic pcr Ct value 3",
          "rank": 140,
          "slot_group": "Pathogen diagnostic testing"
        },
        "authors": {
          "name": "authors",
          "rank": 141,
          "slot_group": "Contributor acknowledgement"
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "rank": 142,
          "slot_group": "Contributor acknowledgement"
        }
      },
      "attributes": {
        "specimen collector sample ID": {
          "name": "specimen collector sample ID",
          "description": "The user-defined name for the sample.",
          "title": "specimen collector sample ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 1,
          "slot_uri": "GENEPIO:0001123",
          "identifier": true,
          "alias": "specimen_collector_sample_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "third party lab service provider name": {
          "name": "third party lab service provider name",
          "description": "The name of the third party company or laboratory that provided services.",
          "title": "third party lab service provider name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 2,
          "slot_uri": "GENEPIO:0001202",
          "alias": "third_party_lab_service_provider_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString"
        },
        "third party lab sample ID": {
          "name": "third party lab sample ID",
          "description": "The identifier assigned to a sample by a third party service provider.",
          "title": "third party lab sample ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 3,
          "slot_uri": "GENEPIO:0001149",
          "alias": "third_party_lab_sample_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString"
        },
        "case ID": {
          "name": "case ID",
          "description": "The identifier used to specify an epidemiologically detected case of disease.",
          "title": "case ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 4,
          "slot_uri": "GENEPIO:0100281",
          "identifier": true,
          "alias": "case_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "Related specimen primary ID": {
          "name": "Related specimen primary ID",
          "description": "The primary ID of a related specimen previously submitted to the repository.",
          "title": "Related specimen primary ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 5,
          "slot_uri": "GENEPIO:0001128",
          "alias": "Related_specimen_primary_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers"
        },
        "IRIDA sample name": {
          "name": "IRIDA sample name",
          "description": "The identifier assigned to a sequenced isolate in IRIDA.",
          "title": "IRIDA sample name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 6,
          "slot_uri": "GENEPIO:0001131",
          "alias": "IRIDA_sample_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString"
        },
        "umbrella bioproject accession": {
          "name": "umbrella bioproject accession",
          "description": "The INSDC accession number assigned to the umbrella BioProject for the Canadian SARS-CoV-2 sequencing effort.",
          "title": "umbrella bioproject accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 7,
          "slot_uri": "GENEPIO:0001133",
          "alias": "umbrella_bioproject_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "umbrella bioproject accession menu",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "bioproject accession": {
          "name": "bioproject accession",
          "description": "The INSDC accession number of the BioProject(s) to which the BioSample belongs.",
          "title": "bioproject accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 8,
          "slot_uri": "GENEPIO:0001136",
          "alias": "bioproject_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "biosample accession": {
          "name": "biosample accession",
          "description": "The identifier assigned to a BioSample in INSDC archives.",
          "title": "biosample accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 9,
          "slot_uri": "GENEPIO:0001139",
          "alias": "biosample_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "SRA accession": {
          "name": "SRA accession",
          "description": "The Sequence Read Archive (SRA) identifier linking raw read data, methodological metadata and quality control metrics submitted to the INSDC.",
          "title": "SRA accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 10,
          "slot_uri": "GENEPIO:0001142",
          "alias": "SRA_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "GenBank accession": {
          "name": "GenBank accession",
          "description": "The GenBank identifier assigned to the sequence in the INSDC archives.",
          "title": "GenBank accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 11,
          "slot_uri": "GENEPIO:0001145",
          "alias": "GenBank_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "structured_pattern": {
            "syntax": "{UPPER_CASE}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "GISAID accession": {
          "name": "GISAID accession",
          "description": "The GISAID accession number assigned to the sequence.",
          "title": "GISAID accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 12,
          "slot_uri": "GENEPIO:0001147",
          "alias": "GISAID_accession",
          "owner": "CanCOGeN Covid-19",
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
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 13,
          "slot_uri": "GENEPIO:0001153",
          "alias": "sample_collected_by",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample collector contact email": {
          "name": "sample collector contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sample.",
          "title": "sample collector contact email",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 14,
          "slot_uri": "GENEPIO:0001156",
          "alias": "sample_collector_contact_email",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "pattern": "^\\S+@\\S+\\.\\S+$"
        },
        "sample collector contact address": {
          "name": "sample collector contact address",
          "description": "The mailing address of the agency submitting the sample.",
          "title": "sample collector contact address",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 15,
          "slot_uri": "GENEPIO:0001158",
          "alias": "sample_collector_contact_address",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitted by": {
          "name": "sequence submitted by",
          "description": "The name of the agency that generated the sequence.",
          "title": "sequence submitted by",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 16,
          "slot_uri": "GENEPIO:0001159",
          "alias": "sequence_submitted_by",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sequence submitter contact email": {
          "name": "sequence submitter contact email",
          "description": "The email address of the contact responsible for follow-up regarding the sequence.",
          "title": "sequence submitter contact email",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 17,
          "slot_uri": "GENEPIO:0001165",
          "alias": "sequence_submitter_contact_email",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sequence submitter contact address": {
          "name": "sequence submitter contact address",
          "description": "The mailing address of the agency submitting the sequence.",
          "title": "sequence submitter contact address",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 18,
          "slot_uri": "GENEPIO:0001167",
          "alias": "sequence_submitter_contact_address",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample collection date": {
          "name": "sample collection date",
          "description": "The date on which the sample was collected.",
          "title": "sample collection date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 19,
          "slot_uri": "GENEPIO:0001174",
          "alias": "sample_collection_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample collection date precision": {
          "name": "sample collection date precision",
          "description": "The precision to which the \"sample collection date\" was provided.",
          "title": "sample collection date precision",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 20,
          "slot_uri": "GENEPIO:0001177",
          "alias": "sample_collection_date_precision",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "sample received date": {
          "name": "sample received date",
          "description": "The date on which the sample was received.",
          "title": "sample received date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 21,
          "slot_uri": "GENEPIO:0001179",
          "alias": "sample_received_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "description": "The country where the sample was collected.",
          "title": "geo_loc_name (country)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 22,
          "slot_uri": "GENEPIO:0001181",
          "alias": "geo_loc_name_(country)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "geo_loc_name (state/province/territory)": {
          "name": "geo_loc_name (state/province/territory)",
          "description": "The province/territory where the sample was collected.",
          "title": "geo_loc_name (state/province/territory)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 23,
          "slot_uri": "GENEPIO:0001185",
          "alias": "geo_loc_name_(state/province/territory)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "geo_loc_name (city)": {
          "name": "geo_loc_name (city)",
          "description": "The city where the sample was collected.",
          "title": "geo_loc_name (city)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 24,
          "slot_uri": "GENEPIO:0001189",
          "alias": "geo_loc_name_(city)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "organism": {
          "name": "organism",
          "description": "Taxonomic name of the organism.",
          "title": "organism",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 25,
          "slot_uri": "GENEPIO:0001191",
          "alias": "organism",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "isolate": {
          "name": "isolate",
          "description": "Identifier of the specific isolate.",
          "title": "isolate",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 26,
          "slot_uri": "GENEPIO:0001195",
          "alias": "isolate",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "purpose of sampling": {
          "name": "purpose of sampling",
          "description": "The reason that the sample was collected.",
          "title": "purpose of sampling",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 27,
          "slot_uri": "GENEPIO:0001198",
          "alias": "purpose_of_sampling",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "purpose of sampling details": {
          "name": "purpose of sampling details",
          "description": "The description of why the sample was collected, providing specific details.",
          "title": "purpose of sampling details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 28,
          "slot_uri": "GENEPIO:0001200",
          "alias": "purpose_of_sampling_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "NML submitted specimen type": {
          "name": "NML submitted specimen type",
          "description": "The type of specimen submitted to the National Microbiology Laboratory (NML) for testing.",
          "title": "NML submitted specimen type",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 29,
          "slot_uri": "GENEPIO:0001204",
          "alias": "NML_submitted_specimen_type",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "NML submitted specimen type menu",
          "required": true
        },
        "Related specimen relationship type": {
          "name": "Related specimen relationship type",
          "description": "The relationship of the current specimen to the specimen/sample previously submitted to the repository.",
          "title": "Related specimen relationship type",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 30,
          "slot_uri": "GENEPIO:0001209",
          "alias": "Related_specimen_relationship_type",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "Related specimen relationship type menu"
        },
        "anatomical material": {
          "name": "anatomical material",
          "description": "A substance obtained from an anatomical part of an organism e.g. tissue, blood.",
          "title": "anatomical material",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 31,
          "slot_uri": "GENEPIO:0001211",
          "multivalued": true,
          "alias": "anatomical_material",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "anatomical part": {
          "name": "anatomical part",
          "description": "An anatomical part of an organism e.g. oropharynx.",
          "title": "anatomical part",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 32,
          "slot_uri": "GENEPIO:0001214",
          "multivalued": true,
          "alias": "anatomical_part",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "body product": {
          "name": "body product",
          "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
          "title": "body product",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 33,
          "slot_uri": "GENEPIO:0001216",
          "multivalued": true,
          "alias": "body_product",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "environmental material": {
          "name": "environmental material",
          "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage.",
          "title": "environmental material",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 34,
          "slot_uri": "GENEPIO:0001223",
          "multivalued": true,
          "alias": "environmental_material",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "environmental site": {
          "name": "environmental site",
          "description": "An environmental location may describe a site in the natural or built environment e.g. contact surface, metal can, hospital, wet market, bat cave.",
          "title": "environmental site",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 35,
          "slot_uri": "GENEPIO:0001232",
          "multivalued": true,
          "alias": "environmental_site",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "collection device": {
          "name": "collection device",
          "description": "The instrument or container used to collect the sample e.g. swab.",
          "title": "collection device",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 36,
          "slot_uri": "GENEPIO:0001234",
          "multivalued": true,
          "alias": "collection_device",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "collection method": {
          "name": "collection method",
          "description": "The process used to collect the sample e.g. phlebotamy, necropsy.",
          "title": "collection method",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 37,
          "slot_uri": "GENEPIO:0001241",
          "multivalued": true,
          "alias": "collection_method",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "required": true
        },
        "collection protocol": {
          "name": "collection protocol",
          "description": "The name and version of a particular protocol used for sampling.",
          "title": "collection protocol",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 38,
          "slot_uri": "GENEPIO:0001243",
          "alias": "collection_protocol",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "specimen processing": {
          "name": "specimen processing",
          "description": "Any processing applied to the sample during or after receiving the sample.",
          "title": "specimen processing",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 39,
          "slot_uri": "GENEPIO:0001253",
          "multivalued": true,
          "alias": "specimen_processing",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "recommended": true
        },
        "specimen processing details": {
          "name": "specimen processing details",
          "description": "Detailed information regarding the processing applied to a sample during or after receiving the sample.",
          "title": "specimen processing details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 40,
          "slot_uri": "GENEPIO:0100311",
          "alias": "specimen_processing_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "lab host": {
          "name": "lab host",
          "description": "Name and description of the laboratory host used to propagate the source organism or material from which the sample was obtained.",
          "title": "lab host",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 41,
          "slot_uri": "GENEPIO:0001255",
          "alias": "lab_host",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "recommended": true
        },
        "passage number": {
          "name": "passage number",
          "description": "Number of passages.",
          "title": "passage number",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 42,
          "slot_uri": "GENEPIO:0001261",
          "alias": "passage_number",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "recommended": true,
          "minimum_value": 0
        },
        "passage method": {
          "name": "passage method",
          "description": "Description of how organism was passaged.",
          "title": "passage method",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 43,
          "slot_uri": "GENEPIO:0001264",
          "alias": "passage_method",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing",
          "recommended": true
        },
        "biomaterial extracted": {
          "name": "biomaterial extracted",
          "description": "The biomaterial extracted from samples for the purpose of sequencing.",
          "title": "biomaterial extracted",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 44,
          "slot_uri": "GENEPIO:0001266",
          "alias": "biomaterial_extracted",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sample collection and processing"
        },
        "host (common name)": {
          "name": "host (common name)",
          "description": "The commonly used name of the host.",
          "title": "host (common name)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 45,
          "slot_uri": "GENEPIO:0001386",
          "alias": "host_(common_name)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "description": "The taxonomic, or scientific name of the host.",
          "title": "host (scientific name)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 46,
          "slot_uri": "GENEPIO:0001387",
          "alias": "host_(scientific_name)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true
        },
        "host health state": {
          "name": "host health state",
          "description": "Health status of the host at the time of sample collection.",
          "title": "host health state",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 47,
          "slot_uri": "GENEPIO:0001388",
          "alias": "host_health_state",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host health status details": {
          "name": "host health status details",
          "description": "Further details pertaining to the health or disease status of the host at time of collection.",
          "title": "host health status details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 48,
          "slot_uri": "GENEPIO:0001389",
          "alias": "host_health_status_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host health outcome": {
          "name": "host health outcome",
          "description": "Disease outcome in the host.",
          "title": "host health outcome",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 49,
          "slot_uri": "GENEPIO:0001390",
          "alias": "host_health_outcome",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host disease": {
          "name": "host disease",
          "description": "The name of the disease experienced by the host.",
          "title": "host disease",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 50,
          "slot_uri": "GENEPIO:0001391",
          "alias": "host_disease",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true
        },
        "host age": {
          "name": "host age",
          "description": "Age of host at the time of sampling.",
          "title": "host age",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 51,
          "slot_uri": "GENEPIO:0001392",
          "alias": "host_age",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true,
          "minimum_value": 0,
          "maximum_value": 130
        },
        "host age unit": {
          "name": "host age unit",
          "description": "The unit used to measure the host age, in either months or years.",
          "title": "host age unit",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 52,
          "slot_uri": "GENEPIO:0001393",
          "alias": "host_age_unit",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true
        },
        "host age bin": {
          "name": "host age bin",
          "description": "Age of host at the time of sampling, expressed as an age group.",
          "title": "host age bin",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 53,
          "slot_uri": "GENEPIO:0001394",
          "alias": "host_age_bin",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true
        },
        "host gender": {
          "name": "host gender",
          "description": "The gender of the host at the time of sample collection.",
          "title": "host gender",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 54,
          "slot_uri": "GENEPIO:0001395",
          "alias": "host_gender",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "required": true,
          "structured_pattern": {
            "syntax": "{Title_Case}",
            "interpolated": true,
            "partial_match": false
          }
        },
        "host residence geo_loc name (country)": {
          "name": "host residence geo_loc name (country)",
          "description": "The country of residence of the host.",
          "title": "host residence geo_loc name (country)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 55,
          "slot_uri": "GENEPIO:0001396",
          "alias": "host_residence_geo_loc_name_(country)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host residence geo_loc name (state/province/territory)": {
          "name": "host residence geo_loc name (state/province/territory)",
          "description": "The state/province/territory of residence of the host.",
          "title": "host residence geo_loc name (state/province/territory)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 56,
          "slot_uri": "GENEPIO:0001397",
          "alias": "host_residence_geo_loc_name_(state/province/territory)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host subject ID": {
          "name": "host subject ID",
          "description": "A unique identifier by which each host can be referred to e.g. #131",
          "title": "host subject ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 57,
          "slot_uri": "GENEPIO:0001398",
          "alias": "host_subject_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information",
          "range": "WhitespaceMinimizedString"
        },
        "symptom onset date": {
          "name": "symptom onset date",
          "description": "The date on which the symptoms began or were first noted.",
          "title": "symptom onset date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 58,
          "slot_uri": "GENEPIO:0001399",
          "alias": "symptom_onset_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "signs and symptoms": {
          "name": "signs and symptoms",
          "description": "A perceived change in function or sensation, (loss, disturbance or appearance) indicative of a disease, reported by a patient or clinician.",
          "title": "signs and symptoms",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 59,
          "slot_uri": "GENEPIO:0001400",
          "multivalued": true,
          "alias": "signs_and_symptoms",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "pre-existing conditions and risk factors": {
          "name": "pre-existing conditions and risk factors",
          "description": "Patient pre-existing conditions and risk factors. <li>Pre-existing condition: A medical condition that existed prior to the current infection. <li>Risk Factor: A variable associated with an increased risk of disease or infection.",
          "title": "pre-existing conditions and risk factors",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 60,
          "slot_uri": "GENEPIO:0001401",
          "multivalued": true,
          "alias": "pre_existing_conditions_and_risk_factors",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "complications": {
          "name": "complications",
          "description": "Patient medical complications that are believed to have occurred as a result of host disease.",
          "title": "complications",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 61,
          "slot_uri": "GENEPIO:0001402",
          "multivalued": true,
          "alias": "complications",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host Information"
        },
        "host vaccination status": {
          "name": "host vaccination status",
          "description": "The vaccination status of the host (fully vaccinated, partially vaccinated, or not vaccinated).",
          "title": "host vaccination status",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 62,
          "slot_uri": "GENEPIO:0001404",
          "alias": "host_vaccination_status",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "number of vaccine doses received": {
          "name": "number of vaccine doses received",
          "description": "The number of doses of the vaccine recived by the host.",
          "title": "number of vaccine doses received",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 63,
          "slot_uri": "GENEPIO:0001406",
          "alias": "number_of_vaccine_doses_received",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information",
          "range": "integer"
        },
        "vaccination dose 1 vaccine name": {
          "name": "vaccination dose 1 vaccine name",
          "description": "The name of the vaccine administered as the first dose of a vaccine regimen.",
          "title": "vaccination dose 1 vaccine name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 64,
          "slot_uri": "GENEPIO:0100313",
          "alias": "vaccination_dose_1_vaccine_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 1 vaccination date": {
          "name": "vaccination dose 1 vaccination date",
          "description": "The date the first dose of a vaccine was administered.",
          "title": "vaccination dose 1 vaccination date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 65,
          "slot_uri": "GENEPIO:0100314",
          "alias": "vaccination_dose_1_vaccination_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 2 vaccine name": {
          "name": "vaccination dose 2 vaccine name",
          "description": "The name of the vaccine administered as the second dose of a vaccine regimen.",
          "title": "vaccination dose 2 vaccine name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 66,
          "slot_uri": "GENEPIO:0100315",
          "alias": "vaccination_dose_2_vaccine_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 2 vaccination date": {
          "name": "vaccination dose 2 vaccination date",
          "description": "The date the second dose of a vaccine was administered.",
          "title": "vaccination dose 2 vaccination date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 67,
          "slot_uri": "GENEPIO:0100316",
          "alias": "vaccination_dose_2_vaccination_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 3 vaccine name": {
          "name": "vaccination dose 3 vaccine name",
          "description": "The name of the vaccine administered as the third dose of a vaccine regimen.",
          "title": "vaccination dose 3 vaccine name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 68,
          "slot_uri": "GENEPIO:0100317",
          "alias": "vaccination_dose_3_vaccine_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 3 vaccination date": {
          "name": "vaccination dose 3 vaccination date",
          "description": "The date the third dose of a vaccine was administered.",
          "title": "vaccination dose 3 vaccination date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 69,
          "slot_uri": "GENEPIO:0100318",
          "alias": "vaccination_dose_3_vaccination_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 4 vaccine name": {
          "name": "vaccination dose 4 vaccine name",
          "description": "The name of the vaccine administered as the fourth dose of a vaccine regimen.",
          "title": "vaccination dose 4 vaccine name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 70,
          "slot_uri": "GENEPIO:0100319",
          "alias": "vaccination_dose_4_vaccine_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination dose 4 vaccination date": {
          "name": "vaccination dose 4 vaccination date",
          "description": "The date the fourth dose of a vaccine was administered.",
          "title": "vaccination dose 4 vaccination date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 71,
          "slot_uri": "GENEPIO:0100320",
          "alias": "vaccination_dose_4_vaccination_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information"
        },
        "vaccination history": {
          "name": "vaccination history",
          "description": "A description of the vaccines received and the administration dates of a series of vaccinations against a specific disease or a set of diseases.",
          "title": "vaccination history",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 72,
          "slot_uri": "GENEPIO:0100321",
          "alias": "vaccination_history",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host vaccination information",
          "range": "WhitespaceMinimizedString"
        },
        "location of exposure geo_loc name (country)": {
          "name": "location of exposure geo_loc name (country)",
          "description": "The country where the host was likely exposed to the causative agent of the illness.",
          "title": "location of exposure geo_loc name (country)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 73,
          "slot_uri": "GENEPIO:0001410",
          "alias": "location_of_exposure_geo_loc_name_(country)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "destination of most recent travel (city)": {
          "name": "destination of most recent travel (city)",
          "description": "The name of the city that was the destination of most recent travel.",
          "title": "destination of most recent travel (city)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 74,
          "slot_uri": "GENEPIO:0001411",
          "alias": "destination_of_most_recent_travel_(city)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "destination of most recent travel (state/province/territory)": {
          "name": "destination of most recent travel (state/province/territory)",
          "description": "The name of the province that was the destination of most recent travel.",
          "title": "destination of most recent travel (state/province/territory)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 75,
          "slot_uri": "GENEPIO:0001412",
          "alias": "destination_of_most_recent_travel_(state/province/territory)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "destination of most recent travel (country)": {
          "name": "destination of most recent travel (country)",
          "description": "The name of the country that was the destination of most recent travel.",
          "title": "destination of most recent travel (country)",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 76,
          "slot_uri": "GENEPIO:0001413",
          "alias": "destination_of_most_recent_travel_(country)",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "most recent travel departure date": {
          "name": "most recent travel departure date",
          "description": "The date of a person's most recent departure from their primary residence (at that time) on a journey to one or more other locations.",
          "title": "most recent travel departure date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 77,
          "slot_uri": "GENEPIO:0001414",
          "alias": "most_recent_travel_departure_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "most recent travel return date": {
          "name": "most recent travel return date",
          "description": "The date of a person's most recent return to some residence from a journey originating at that residence.",
          "title": "most recent travel return date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 78,
          "slot_uri": "GENEPIO:0001415",
          "alias": "most_recent_travel_return_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "travel point of entry type": {
          "name": "travel point of entry type",
          "description": "The type of entry point a traveler arrives through.",
          "title": "travel point of entry type",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 79,
          "alias": "travel_point_of_entry_type",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "recommended": true
        },
        "border testing test day type": {
          "name": "border testing test day type",
          "description": "The day a traveller was tested on or after arrival at their point of entry.",
          "title": "border testing test day type",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 80,
          "alias": "border_testing_test_day_type",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "recommended": true
        },
        "travel history": {
          "name": "travel history",
          "description": "Travel history in last six months.",
          "title": "travel history",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 81,
          "slot_uri": "GENEPIO:0001416",
          "alias": "travel_history",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "exposure event": {
          "name": "exposure event",
          "description": "Event leading to exposure.",
          "title": "exposure event",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 82,
          "slot_uri": "GENEPIO:0001417",
          "alias": "exposure_event",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "exposure contact level": {
          "name": "exposure contact level",
          "description": "The exposure transmission contact type.",
          "title": "exposure contact level",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 83,
          "slot_uri": "GENEPIO:0001418",
          "alias": "exposure_contact_level",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information"
        },
        "host role": {
          "name": "host role",
          "description": "The role of the host in relation to the exposure setting.",
          "title": "host role",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 84,
          "slot_uri": "GENEPIO:0001419",
          "multivalued": true,
          "alias": "host_role",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "host role menu"
        },
        "exposure setting": {
          "name": "exposure setting",
          "description": "The setting leading to exposure.",
          "title": "exposure setting",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 85,
          "slot_uri": "GENEPIO:0001428",
          "multivalued": true,
          "alias": "exposure_setting",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "exposure setting menu"
        },
        "exposure details": {
          "name": "exposure details",
          "description": "Additional host exposure information.",
          "title": "exposure details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 86,
          "slot_uri": "GENEPIO:0001431",
          "alias": "exposure_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host exposure information",
          "range": "WhitespaceMinimizedString"
        },
        "prior SARS-CoV-2 infection": {
          "name": "prior SARS-CoV-2 infection",
          "description": "Whether there was prior SARS-CoV-2 infection.",
          "title": "prior SARS-CoV-2 infection",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 87,
          "slot_uri": "GENEPIO:0001435",
          "alias": "prior_SARS_CoV_2_infection",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 infection isolate": {
          "name": "prior SARS-CoV-2 infection isolate",
          "description": "The identifier of the isolate found in the prior SARS-CoV-2 infection.",
          "title": "prior SARS-CoV-2 infection isolate",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 88,
          "slot_uri": "GENEPIO:0001436",
          "alias": "prior_SARS_CoV_2_infection_isolate",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information",
          "range": "WhitespaceMinimizedString"
        },
        "prior SARS-CoV-2 infection date": {
          "name": "prior SARS-CoV-2 infection date",
          "description": "The date of diagnosis of the prior SARS-CoV-2 infection.",
          "title": "prior SARS-CoV-2 infection date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 89,
          "slot_uri": "GENEPIO:0001437",
          "alias": "prior_SARS_CoV_2_infection_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information",
          "range": "date"
        },
        "prior SARS-CoV-2 antiviral treatment": {
          "name": "prior SARS-CoV-2 antiviral treatment",
          "description": "Whether there was prior SARS-CoV-2 treatment with an antiviral agent.",
          "title": "prior SARS-CoV-2 antiviral treatment",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 90,
          "slot_uri": "GENEPIO:0001438",
          "alias": "prior_SARS_CoV_2_antiviral_treatment",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information"
        },
        "prior SARS-CoV-2 antiviral treatment agent": {
          "name": "prior SARS-CoV-2 antiviral treatment agent",
          "description": "The name of the antiviral treatment agent administered during the prior SARS-CoV-2 infection.",
          "title": "prior SARS-CoV-2 antiviral treatment agent",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 91,
          "slot_uri": "GENEPIO:0001439",
          "alias": "prior_SARS_CoV_2_antiviral_treatment_agent",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information",
          "range": "WhitespaceMinimizedString"
        },
        "prior SARS-CoV-2 antiviral treatment date": {
          "name": "prior SARS-CoV-2 antiviral treatment date",
          "description": "The date treatment was first administered during the prior SARS-CoV-2 infection.",
          "title": "prior SARS-CoV-2 antiviral treatment date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 92,
          "slot_uri": "GENEPIO:0001440",
          "alias": "prior_SARS_CoV_2_antiviral_treatment_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Host reinfection information",
          "range": "date"
        },
        "purpose of sequencing": {
          "name": "purpose of sequencing",
          "description": "The reason that the sample was sequenced.",
          "title": "purpose of sequencing",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 93,
          "slot_uri": "GENEPIO:0001445",
          "multivalued": true,
          "alias": "purpose_of_sequencing",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "required": true
        },
        "purpose of sequencing details": {
          "name": "purpose of sequencing details",
          "description": "The description of why the sample was sequenced providing specific details.",
          "title": "purpose of sequencing details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 94,
          "slot_uri": "GENEPIO:0001446",
          "alias": "purpose_of_sequencing_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "required": true
        },
        "sequencing date": {
          "name": "sequencing date",
          "description": "The date the sample was sequenced.",
          "title": "sequencing date",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 95,
          "slot_uri": "GENEPIO:0001447",
          "alias": "sequencing_date",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "required": true
        },
        "library ID": {
          "name": "library ID",
          "description": "The user-specified identifier for the library prepared for sequencing.",
          "title": "library ID",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 96,
          "slot_uri": "GENEPIO:0001448",
          "alias": "library_ID",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "amplicon size": {
          "name": "amplicon size",
          "description": "The length of the amplicon generated by PCR amplification.",
          "title": "amplicon size",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 97,
          "slot_uri": "GENEPIO:0001449",
          "alias": "amplicon_size",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "library preparation kit": {
          "name": "library preparation kit",
          "description": "The name of the DNA library preparation kit used to generate the library being sequenced.",
          "title": "library preparation kit",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 98,
          "slot_uri": "GENEPIO:0001450",
          "alias": "library_preparation_kit",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "flow cell barcode": {
          "name": "flow cell barcode",
          "description": "The barcode of the flow cell used for sequencing.",
          "title": "flow cell barcode",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 99,
          "slot_uri": "GENEPIO:0001451",
          "alias": "flow_cell_barcode",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "sequencing instrument": {
          "name": "sequencing instrument",
          "description": "The model of the sequencing instrument used.",
          "title": "sequencing instrument",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 100,
          "slot_uri": "GENEPIO:0001452",
          "multivalued": true,
          "alias": "sequencing_instrument",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "required": true
        },
        "sequencing protocol name": {
          "name": "sequencing protocol name",
          "description": "The name and version number of the sequencing protocol used.",
          "title": "sequencing protocol name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 101,
          "slot_uri": "GENEPIO:0001453",
          "alias": "sequencing_protocol_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "sequencing protocol": {
          "name": "sequencing protocol",
          "description": "The protocol used to generate the sequence.",
          "title": "sequencing protocol",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 102,
          "slot_uri": "GENEPIO:0001454",
          "alias": "sequencing_protocol",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "sequencing kit number": {
          "name": "sequencing kit number",
          "description": "The manufacturer's kit number.",
          "title": "sequencing kit number",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 103,
          "slot_uri": "GENEPIO:0001455",
          "alias": "sequencing_kit_number",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "amplicon pcr primer scheme": {
          "name": "amplicon pcr primer scheme",
          "description": "The specifications of the primers (primer sequences, binding positions, fragment size generated etc) used to generate the amplicons to be sequenced.",
          "title": "amplicon pcr primer scheme",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 104,
          "slot_uri": "GENEPIO:0001456",
          "alias": "amplicon_pcr_primer_scheme",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Sequencing",
          "range": "WhitespaceMinimizedString"
        },
        "raw sequence data processing method": {
          "name": "raw sequence data processing method",
          "description": "The names of the software and version number used for raw data processing such as removing barcodes, adapter trimming, filtering etc.",
          "title": "raw sequence data processing method",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 105,
          "slot_uri": "GENEPIO:0001458",
          "alias": "raw_sequence_data_processing_method",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "dehosting method": {
          "name": "dehosting method",
          "description": "The method used to remove host reads from the pathogen sequence.",
          "title": "dehosting method",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 106,
          "slot_uri": "GENEPIO:0001459",
          "alias": "dehosting_method",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "consensus sequence name": {
          "name": "consensus sequence name",
          "description": "The name of the consensus sequence.",
          "title": "consensus sequence name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 107,
          "slot_uri": "GENEPIO:0001460",
          "alias": "consensus_sequence_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "consensus sequence filename": {
          "name": "consensus sequence filename",
          "description": "The name of the consensus sequence file.",
          "title": "consensus sequence filename",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 108,
          "slot_uri": "GENEPIO:0001461",
          "alias": "consensus_sequence_filename",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "consensus sequence filepath": {
          "name": "consensus sequence filepath",
          "description": "The filepath of the consesnsus sequence file.",
          "title": "consensus sequence filepath",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 109,
          "slot_uri": "GENEPIO:0001462",
          "alias": "consensus_sequence_filepath",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "consensus sequence software name": {
          "name": "consensus sequence software name",
          "description": "The name of software used to generate the consensus sequence.",
          "title": "consensus sequence software name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 110,
          "slot_uri": "GENEPIO:0001463",
          "alias": "consensus_sequence_software_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "consensus sequence software version": {
          "name": "consensus sequence software version",
          "description": "The version of the software used to generate the consensus sequence.",
          "title": "consensus sequence software version",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 111,
          "slot_uri": "GENEPIO:0001469",
          "alias": "consensus_sequence_software_version",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "breadth of coverage value": {
          "name": "breadth of coverage value",
          "description": "The percentage of the reference genome covered by the sequenced data, to a prescribed depth.",
          "title": "breadth of coverage value",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 112,
          "slot_uri": "GENEPIO:0001472",
          "alias": "breadth_of_coverage_value",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage value": {
          "name": "depth of coverage value",
          "description": "The average number of reads representing a given nucleotide in the reconstructed sequence.",
          "title": "depth of coverage value",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 113,
          "slot_uri": "GENEPIO:0001474",
          "alias": "depth_of_coverage_value",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "depth of coverage threshold": {
          "name": "depth of coverage threshold",
          "description": "The threshold used as a cut-off for the depth of coverage.",
          "title": "depth of coverage threshold",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 114,
          "slot_uri": "GENEPIO:0001475",
          "alias": "depth_of_coverage_threshold",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "r1 fastq filename": {
          "name": "r1 fastq filename",
          "description": "The user-specified filename of the r1 FASTQ file.",
          "title": "r1 fastq filename",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 115,
          "slot_uri": "GENEPIO:0001476",
          "alias": "r1_fastq_filename",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "r2 fastq filename": {
          "name": "r2 fastq filename",
          "description": "The user-specified filename of the r2 FASTQ file.",
          "title": "r2 fastq filename",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 116,
          "slot_uri": "GENEPIO:0001477",
          "alias": "r2_fastq_filename",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "r1 fastq filepath": {
          "name": "r1 fastq filepath",
          "description": "The location of the r1 FASTQ file within a user's file system.",
          "title": "r1 fastq filepath",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 117,
          "slot_uri": "GENEPIO:0001478",
          "alias": "r1_fastq_filepath",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "r2 fastq filepath": {
          "name": "r2 fastq filepath",
          "description": "The location of the r2 FASTQ file within a user's file system.",
          "title": "r2 fastq filepath",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 118,
          "slot_uri": "GENEPIO:0001479",
          "alias": "r2_fastq_filepath",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "fast5 filename": {
          "name": "fast5 filename",
          "description": "The user-specified filename of the FAST5 file.",
          "title": "fast5 filename",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 119,
          "slot_uri": "GENEPIO:0001480",
          "alias": "fast5_filename",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "fast5 filepath": {
          "name": "fast5 filepath",
          "description": "The location of the FAST5 file within a user's file system.",
          "title": "fast5 filepath",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 120,
          "slot_uri": "GENEPIO:0001481",
          "alias": "fast5_filepath",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "number of base pairs sequenced": {
          "name": "number of base pairs sequenced",
          "description": "The number of total base pairs generated by the sequencing process.",
          "title": "number of base pairs sequenced",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 121,
          "slot_uri": "GENEPIO:0001482",
          "alias": "number_of_base_pairs_sequenced",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "consensus genome length": {
          "name": "consensus genome length",
          "description": "Size of the reconstructed genome described as the number of base pairs.",
          "title": "consensus genome length",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 122,
          "slot_uri": "GENEPIO:0001483",
          "alias": "consensus_genome_length",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "integer",
          "minimum_value": 0
        },
        "Ns per 100 kbp": {
          "name": "Ns per 100 kbp",
          "description": "The number of N symbols present in the consensus fasta sequence, per 100kbp of sequence.",
          "title": "Ns per 100 kbp",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 123,
          "slot_uri": "GENEPIO:0001484",
          "alias": "Ns_per_100_kbp",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "decimal",
          "minimum_value": 0
        },
        "reference genome accession": {
          "name": "reference genome accession",
          "description": "A persistent, unique identifier of a genome database entry.",
          "title": "reference genome accession",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 124,
          "slot_uri": "GENEPIO:0001485",
          "alias": "reference_genome_accession",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString"
        },
        "bioinformatics protocol": {
          "name": "bioinformatics protocol",
          "description": "A description of the overall bioinformatics strategy used.",
          "title": "bioinformatics protocol",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 125,
          "slot_uri": "GENEPIO:0001489",
          "alias": "bioinformatics_protocol",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Bioinformatics and QC metrics",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "lineage/clade name": {
          "name": "lineage/clade name",
          "description": "The name of the lineage or clade.",
          "title": "lineage/clade name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 126,
          "slot_uri": "GENEPIO:0001500",
          "alias": "lineage/clade_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information",
          "range": "WhitespaceMinimizedString"
        },
        "lineage/clade analysis software name": {
          "name": "lineage/clade analysis software name",
          "description": "The name of the software used to determine the lineage/clade.",
          "title": "lineage/clade analysis software name",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 127,
          "slot_uri": "GENEPIO:0001501",
          "alias": "lineage/clade_analysis_software_name",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information",
          "range": "WhitespaceMinimizedString"
        },
        "lineage/clade analysis software version": {
          "name": "lineage/clade analysis software version",
          "description": "The version of the software used to determine the lineage/clade.",
          "title": "lineage/clade analysis software version",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 128,
          "slot_uri": "GENEPIO:0001502",
          "alias": "lineage/clade_analysis_software_version",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information",
          "range": "WhitespaceMinimizedString"
        },
        "variant designation": {
          "name": "variant designation",
          "description": "The variant classification of the lineage/clade i.e. variant, variant of concern.",
          "title": "variant designation",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 129,
          "slot_uri": "GENEPIO:0001503",
          "alias": "variant_designation",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information"
        },
        "variant evidence": {
          "name": "variant evidence",
          "description": "The evidence used to make the variant determination.",
          "title": "variant evidence",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 130,
          "slot_uri": "GENEPIO:0001504",
          "alias": "variant_evidence",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information"
        },
        "variant evidence details": {
          "name": "variant evidence details",
          "description": "Details about the evidence used to make the variant determination.",
          "title": "variant evidence details",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 131,
          "slot_uri": "GENEPIO:0001505",
          "alias": "variant_evidence_details",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Lineage and Variant information",
          "range": "WhitespaceMinimizedString"
        },
        "gene name 1": {
          "name": "gene name 1",
          "description": "The name of the gene used in the diagnostic RT-PCR test.",
          "title": "gene name 1",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 132,
          "slot_uri": "GENEPIO:0001507",
          "alias": "gene_name_1",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 1": {
          "name": "diagnostic pcr protocol 1",
          "description": "The name and version number of the protocol used for diagnostic marker amplification.",
          "title": "diagnostic pcr protocol 1",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 133,
          "slot_uri": "GENEPIO:0001508",
          "alias": "diagnostic_pcr_protocol_1",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing",
          "range": "WhitespaceMinimizedString"
        },
        "diagnostic pcr Ct value 1": {
          "name": "diagnostic pcr Ct value 1",
          "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
          "title": "diagnostic pcr Ct value 1",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 134,
          "slot_uri": "GENEPIO:0001509",
          "alias": "diagnostic_pcr_Ct_value_1",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "gene name 2": {
          "name": "gene name 2",
          "description": "The name of the gene used in the diagnostic RT-PCR test.",
          "title": "gene name 2",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 135,
          "slot_uri": "GENEPIO:0001510",
          "alias": "gene_name_2",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 2": {
          "name": "diagnostic pcr protocol 2",
          "description": "The name and version number of the protocol used for diagnostic marker amplification.",
          "title": "diagnostic pcr protocol 2",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 136,
          "slot_uri": "GENEPIO:0001511",
          "alias": "diagnostic_pcr_protocol_2",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing",
          "range": "WhitespaceMinimizedString"
        },
        "diagnostic pcr Ct value 2": {
          "name": "diagnostic pcr Ct value 2",
          "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
          "title": "diagnostic pcr Ct value 2",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 137,
          "slot_uri": "GENEPIO:0001512",
          "alias": "diagnostic_pcr_Ct_value_2",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "gene name 3": {
          "name": "gene name 3",
          "description": "The name of the gene used in the diagnostic RT-PCR test.",
          "title": "gene name 3",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 138,
          "slot_uri": "GENEPIO:0001513",
          "alias": "gene_name_3",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "diagnostic pcr protocol 3": {
          "name": "diagnostic pcr protocol 3",
          "description": "The name and version number of the protocol used for diagnostic marker amplification.",
          "title": "diagnostic pcr protocol 3",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 139,
          "slot_uri": "GENEPIO:0001514",
          "alias": "diagnostic_pcr_protocol_3",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing",
          "range": "WhitespaceMinimizedString"
        },
        "diagnostic pcr Ct value 3": {
          "name": "diagnostic pcr Ct value 3",
          "description": "The Ct value result from a diagnostic SARS-CoV-2 RT-PCR test.",
          "title": "diagnostic pcr Ct value 3",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 140,
          "slot_uri": "GENEPIO:0001515",
          "alias": "diagnostic_pcr_Ct_value_3",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Pathogen diagnostic testing"
        },
        "authors": {
          "name": "authors",
          "description": "Names of individuals contributing to the processes of sample collection, sequence generation, analysis, and data submission.",
          "title": "authors",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 141,
          "slot_uri": "GENEPIO:0001517",
          "alias": "authors",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Contributor acknowledgement",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "DataHarmonizer provenance": {
          "name": "DataHarmonizer provenance",
          "description": "The DataHarmonizer software version provenance.",
          "title": "DataHarmonizer provenance",
          "from_schema": "https://example.com/CanCOGeN_Covid-19",
          "rank": 142,
          "slot_uri": "GENEPIO:0001518",
          "alias": "DataHarmonizer_provenance",
          "owner": "CanCOGeN Covid-19",
          "slot_group": "Contributor acknowledgement",
          "range": "provenance"
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