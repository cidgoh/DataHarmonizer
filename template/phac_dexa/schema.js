var SCHEMA = {
  "name": "PHAC_Dexa",
  "description": "",
  "id": "https://example.com/PHAC_Dexa",
  "version": "1.0.0",
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
  "default_prefix": "https://example.com/PHAC_Dexa/",
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
    "date_or_datetime": {
      "name": "date_or_datetime",
      "description": "Either a date or a datetime",
      "base": "str",
      "uri": "linkml:DateOrDatetime",
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
    "SUBJECT_DESCRIPTIONS menu": {
      "name": "SUBJECT_DESCRIPTIONS menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "1/2 breast": {
          "text": "1/2 breast",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Avian Ingredients": {
          "text": "Avian Ingredients",
          "meaning": "FOODON:00002616",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Back": {
          "text": "Back",
          "meaning": "PATO:0001901",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Balut": {
          "text": "Balut",
          "meaning": "FOODON:03302184",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Black Pepper": {
          "text": "Black Pepper",
          "meaning": "FOODON:03411191",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Blade Steak": {
          "text": "Blade Steak",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Blood Meal": {
          "text": "Blood Meal",
          "meaning": "FOODON:00001564",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Bone Meal": {
          "text": "Bone Meal",
          "meaning": "ENVO:02000054",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Bovine Ingredients": {
          "text": "Bovine Ingredients",
          "meaning": "FOODON:03414374",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast": {
          "text": "Breast",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast back off": {
          "text": "Breast back off",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast cutlets": {
          "text": "Breast cutlets",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast Skinless": {
          "text": "Breast Skinless",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast Skinless Boneless": {
          "text": "Breast Skinless Boneless",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast with Skin": {
          "text": "Breast with Skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Brisket": {
          "text": "Brisket",
          "meaning": "FOODON:03530020",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Burger": {
          "text": "Burger",
          "meaning": "FOODON:00002737",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Calf": {
          "text": "Calf",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Canola Meal": {
          "text": "Canola Meal",
          "meaning": "FOODON:00002694",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Carinata Meal": {
          "text": "Carinata Meal",
          "meaning": "FOODON:03316468",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chop": {
          "text": "Chop",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chops": {
          "text": "Chops",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "coli": {
          "text": "coli"
        },
        "Complete Feed": {
          "text": "Complete Feed",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Corn": {
          "text": "Corn",
          "meaning": "FOODON:00001765",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cow": {
          "text": "Cow",
          "meaning": "FOODON:03411161",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Cubes": {
          "text": "Cubes",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cutlet": {
          "text": "Cutlet",
          "meaning": "FOODON:00003001",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Drumstick": {
          "text": "Drumstick",
          "meaning": "CURATION:0001378",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Drumstick Skinless": {
          "text": "Drumstick Skinless",
          "meaning": "CURATION:0001378",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Drumstick with Skin": {
          "text": "Drumstick with Skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Drumsticks": {
          "text": "Drumsticks",
          "meaning": "CURATION:0001378",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Egg Flour": {
          "text": "Egg Flour",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Feather Meal": {
          "text": "Feather Meal",
          "meaning": "CURATION:0001357",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Feed": {
          "text": "Feed",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Filet": {
          "text": "Filet",
          "meaning": "FOODON:03530144",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Fish Ingredients": {
          "text": "Fish Ingredients",
          "meaning": "FOODON:03411222",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Fish Meal": {
          "text": "Fish Meal",
          "meaning": "FOODON:03301620",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Grain": {
          "text": "Grain",
          "meaning": "FOODON:03311095",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground": {
          "text": "Ground",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground ( lean)": {
          "text": "Ground ( lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Angus)": {
          "text": "Ground (Angus)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Extra Lean)": {
          "text": "Ground (Extra Lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (extra-lan)": {
          "text": "Ground (extra-lan)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Extra-Lean)": {
          "text": "Ground (Extra-Lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Lean)": {
          "text": "Ground (Lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Medium)": {
          "text": "Ground (Medium)",
          "meaning": "FOODON:03430117",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Regular)": {
          "text": "Ground (Regular)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (Sirloin)": {
          "text": "Ground (Sirloin)",
          "meaning": "CURATION:0001614",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground Boneless": {
          "text": "Ground Boneless",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground extra lean": {
          "text": "Ground extra lean",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground regular": {
          "text": "Ground regular",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "ground( extra lean)": {
          "text": "ground( extra lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "ground( medium)": {
          "text": "ground( medium)",
          "meaning": "FOODON:03430117",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground(Extra lean)": {
          "text": "Ground(Extra lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground(Lean)": {
          "text": "Ground(Lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground(medium)": {
          "text": "Ground(medium)",
          "meaning": "FOODON:03430117",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "ground(regular)": {
          "text": "ground(regular)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Groundextra lean)": {
          "text": "Groundextra lean)",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground-Lean": {
          "text": "Ground-Lean",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground-Regular": {
          "text": "Ground-Regular",
          "meaning": "FOODON:03430136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Heifer": {
          "text": "Heifer",
          "meaning": "FOODON:00002518",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Hummus": {
          "text": "Hummus",
          "meaning": "FOODON:00003049",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "In-Shell": {
          "text": "In-Shell",
          "meaning": "UBERON:0006612",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Lay Ration": {
          "text": "Lay Ration",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Leg": {
          "text": "Leg",
          "meaning": "UBERON:0000978",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Leg with Skin-Drumstick and Thigh": {
          "text": "Leg with Skin-Drumstick and Thigh",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Liver": {
          "text": "Liver",
          "meaning": "UBERON:0002107",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Loin Center Chop": {
          "text": "Loin Center Chop",
          "meaning": "FOODON:03530031",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Meat and Bone Meal": {
          "text": "Meat and Bone Meal",
          "meaning": "FOODON:00002738",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Meat Flour/Meal": {
          "text": "Meat Flour/Meal",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Meat Meal": {
          "text": "Meat Meal",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mild italian style burger": {
          "text": "Mild italian style burger",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Necks": {
          "text": "Necks",
          "meaning": "UBERON:0000974",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Nuggets": {
          "text": "Nuggets",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other": {
          "text": "Other",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Other cut": {
          "text": "Other cut",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other Cut (Not Ground)": {
          "text": "Other Cut (Not Ground)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other Cut Boneless": {
          "text": "Other Cut Boneless",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other Cut Boneless (Not Ground)": {
          "text": "Other Cut Boneless (Not Ground)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ovine Ingredients": {
          "text": "Ovine Ingredients",
          "meaning": "FOODON:03411183",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pet Food": {
          "text": "Pet Food",
          "meaning": "FOODON:00002682",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Porcine Ingredients": {
          "text": "Porcine Ingredients",
          "meaning": "FOODON:03411136",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pork Chop (Cut Unknown)": {
          "text": "Pork Chop (Cut Unknown)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Premix": {
          "text": "Premix",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Premix (Medicated)": {
          "text": "Premix (Medicated)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Processed (Other)": {
          "text": "Processed (Other)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Raw": {
          "text": "Raw",
          "meaning": "FOODON:03311126",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Rib Chop": {
          "text": "Rib Chop",
          "meaning": "UBERON:0002228",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ribs": {
          "text": "Ribs",
          "meaning": "UBERON:0002228",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Roast": {
          "text": "Roast",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Salami": {
          "text": "Salami",
          "meaning": "FOODON:03312067",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sausage": {
          "text": "Sausage",
          "meaning": "FOODON:03315904",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sausage (Pepper)": {
          "text": "Sausage (Pepper)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Scallopini": {
          "text": "Scallopini",
          "meaning": "FOODON:00003017",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shell on": {
          "text": "Shell on",
          "meaning": "UBERON:0006612",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shelled": {
          "text": "Shelled",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shoulder": {
          "text": "Shoulder",
          "meaning": "UBERON:0001467",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shoulder Chop": {
          "text": "Shoulder Chop",
          "meaning": "UBERON:0001467",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sirloin Chop": {
          "text": "Sirloin Chop",
          "meaning": "FOODON:03530027",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Skim milk powder": {
          "text": "Skim milk powder",
          "meaning": "FOODON:03301484",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Soft": {
          "text": "Soft",
          "meaning": "PATO:0000387",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Soyabean Meal": {
          "text": "Soyabean Meal",
          "meaning": "FOODON:03316468",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Starter Ration": {
          "text": "Starter Ration",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Steak": {
          "text": "Steak",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Stew Chunks": {
          "text": "Stew Chunks",
          "meaning": "FOODON:00003140",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Supplements": {
          "text": "Supplements",
          "meaning": "FOODON:00001874",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "T. high": {
          "text": "T. high",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Tahini": {
          "text": "Tahini",
          "meaning": "FOODON:03304154",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Tender loin": {
          "text": "Tender loin",
          "meaning": "FOODON:03530217",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Tenderloin": {
          "text": "Tenderloin",
          "meaning": "FOODON:03530217",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh": {
          "text": "Thigh",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh Skinless": {
          "text": "Thigh Skinless",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh Skinless Boneless": {
          "text": "Thigh Skinless Boneless",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh with Skin": {
          "text": "Thigh with Skin",
          "meaning": "UBERON:0000014",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Trim": {
          "text": "Trim",
          "meaning": "FOODON:00001568",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unknown Meal": {
          "text": "Unknown Meal",
          "meaning": "FOODON:03316468",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unspecified Feed/Ingredient": {
          "text": "Unspecified Feed/Ingredient",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Upper Thigh": {
          "text": "Upper Thigh",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Upper Thigh with Skin": {
          "text": "Upper Thigh with Skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "upper thight": {
          "text": "upper thight",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Upperthigh": {
          "text": "Upperthigh",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "White Pepper": {
          "text": "White Pepper",
          "meaning": "FOODON:03304045",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Whole": {
          "text": "Whole",
          "meaning": "FOODON:03430131",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Whole Carcass": {
          "text": "Whole Carcass",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Whole with Skin": {
          "text": "Whole with Skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Wing": {
          "text": "Wing",
          "meaning": "UBERON:0000023",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Wings": {
          "text": "Wings",
          "meaning": "UBERON:0000023",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        }
      }
    },
    "SPECIES menu": {
      "name": "SPECIES menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "2": {
          "text": "2"
        },
        "4": {
          "text": "4"
        },
        "<=8": {
          "text": "<=8"
        },
        "<n/a>": {
          "text": "<n/a>"
        },
        "Abalone": {
          "text": "Abalone",
          "meaning": "FOODON:03411408"
        },
        "Alfalfa sprouts": {
          "text": "Alfalfa sprouts",
          "meaning": "FOODON:00002670"
        },
        "Alpaca": {
          "text": "Alpaca",
          "meaning": "FOODON:00002693"
        },
        "Amphibian": {
          "text": "Amphibian",
          "meaning": "FOODON:03411624"
        },
        "Apple": {
          "text": "Apple",
          "meaning": "FOODON:00002473"
        },
        "Aquatic mammal": {
          "text": "Aquatic mammal",
          "meaning": "FOODON:03411134"
        },
        "Armadillo": {
          "text": "Armadillo",
          "meaning": "FOODON:03411626"
        },
        "Avian": {
          "text": "Avian",
          "meaning": "FOODON:00002616"
        },
        "Basil": {
          "text": "Basil",
          "meaning": "FOODON:00003044"
        },
        "Bat": {
          "text": "Bat",
          "meaning": "CURATION:0001601"
        },
        "Bear": {
          "text": "Bear",
          "meaning": "FOODON:03412406"
        },
        "Bearded Dragon": {
          "text": "Bearded Dragon",
          "meaning": "NCBITAXON:103695"
        },
        "Bison": {
          "text": "Bison",
          "meaning": "FOODON:03412098"
        },
        "Budgie": {
          "text": "Budgie"
        },
        "Camel": {
          "text": "Camel",
          "meaning": "FOODON:03412103"
        },
        "Camelid": {
          "text": "Camelid",
          "meaning": "FOODON:03412103"
        },
        "Canary": {
          "text": "Canary"
        },
        "Canine": {
          "text": "Canine",
          "meaning": "FOODON:03414847"
        },
        "Cantelope": {
          "text": "Cantelope",
          "meaning": "CURATION:0001383"
        },
        "Caprine": {
          "text": "Caprine",
          "meaning": "FOODON:03411328"
        },
        "Cardemom": {
          "text": "Cardemom"
        },
        "Cardinal": {
          "text": "Cardinal"
        },
        "Cervid": {
          "text": "Cervid",
          "meaning": "FOODON:03411500"
        },
        "Chameleon": {
          "text": "Chameleon",
          "meaning": "CURATION:0001646"
        },
        "Cheetah": {
          "text": "Cheetah"
        },
        "Chicken": {
          "text": "Chicken",
          "meaning": "FOODON:03411457"
        },
        "Chimpanzee": {
          "text": "Chimpanzee"
        },
        "Chinchilla": {
          "text": "Chinchilla"
        },
        "Chinese Water Dragon": {
          "text": "Chinese Water Dragon"
        },
        "Clam": {
          "text": "Clam",
          "meaning": "FOODON:03411331"
        },
        "Coriander": {
          "text": "Coriander",
          "meaning": "FOODON:00001763"
        },
        "Cormorant": {
          "text": "Cormorant"
        },
        "Cougar/Mountain Lion": {
          "text": "Cougar/Mountain Lion"
        },
        "Coyote": {
          "text": "Coyote",
          "meaning": "CURATION:0001607"
        },
        "Crab": {
          "text": "Crab",
          "meaning": "FOODON:03411335"
        },
        "Crane": {
          "text": "Crane"
        },
        "Crow": {
          "text": "Crow"
        },
        "Cumin seeds": {
          "text": "Cumin seeds",
          "meaning": "FOODON:00003024"
        },
        "Cuttlefish": {
          "text": "Cuttlefish",
          "meaning": "FOODON:03411644"
        },
        "Dog": {
          "text": "Dog",
          "meaning": "FOODON:03414847"
        },
        "Dolphin": {
          "text": "Dolphin",
          "meaning": "FOODON:03413363"
        },
        "Domestic Cat": {
          "text": "Domestic Cat",
          "meaning": "NCIT:C14191"
        },
        "Domestic Cattle": {
          "text": "Domestic Cattle",
          "meaning": "FOODON:03411161"
        },
        "Duck": {
          "text": "Duck",
          "meaning": "FOODON:03411316"
        },
        "Dumpster": {
          "text": "Dumpster"
        },
        "Eagle": {
          "text": "Eagle"
        },
        "Eel": {
          "text": "Eel",
          "meaning": "FOODON:03411278"
        },
        "Elephant": {
          "text": "Elephant",
          "meaning": "FOODON:03412129"
        },
        "Falcon": {
          "text": "Falcon"
        },
        "Feline": {
          "text": "Feline",
          "meaning": "NCIT:C14191"
        },
        "Ferret": {
          "text": "Ferret",
          "meaning": "CURATION:0001411"
        },
        "Finch": {
          "text": "Finch"
        },
        "Fish": {
          "text": "Fish",
          "meaning": "FOODON:03411222"
        },
        "Flamingo": {
          "text": "Flamingo"
        },
        "For Unspecified": {
          "text": "For Unspecified"
        },
        "Fox": {
          "text": "Fox",
          "meaning": "CURATION:0001405"
        },
        "Gecko": {
          "text": "Gecko",
          "meaning": "FOODON:03412615"
        },
        "Goat": {
          "text": "Goat",
          "meaning": "FOODON:03411328"
        },
        "Goat and Sheep": {
          "text": "Goat and Sheep"
        },
        "Goose": {
          "text": "Goose",
          "meaning": "FOODON:03411253"
        },
        "Grape": {
          "text": "Grape",
          "meaning": "FOODON:03301123"
        },
        "Green onions": {
          "text": "Green onions",
          "meaning": "FOODON:03411478"
        },
        "Grosbeak": {
          "text": "Grosbeak"
        },
        "ground pepper": {
          "text": "ground pepper",
          "meaning": "FOODON:03301526"
        },
        "Gull": {
          "text": "Gull",
          "meaning": "FOODON:03413503"
        },
        "Hare": {
          "text": "Hare",
          "meaning": "FOODON:03412695"
        },
        "Hazelnut": {
          "text": "Hazelnut",
          "meaning": "FOODON:00002933"
        },
        "Hedgehog": {
          "text": "Hedgehog",
          "meaning": "FOODON:03414548"
        },
        "Herb/spice (unspecified)": {
          "text": "Herb/spice (unspecified)"
        },
        "Heron": {
          "text": "Heron",
          "meaning": "FOODON:00002890"
        },
        "Hippopotamidae": {
          "text": "Hippopotamidae",
          "meaning": "NCBITAXON:9831"
        },
        "Horse": {
          "text": "Horse",
          "meaning": "FOODON:03411229"
        },
        "Iguana": {
          "text": "Iguana",
          "meaning": "FOODON:03412701"
        },
        "Jaguar": {
          "text": "Jaguar"
        },
        "Kangaroo": {
          "text": "Kangaroo",
          "meaning": "FOODON:03412092"
        },
        "Komodo Dragon": {
          "text": "Komodo Dragon"
        },
        "Lapine": {
          "text": "Lapine"
        },
        "Lettuce": {
          "text": "Lettuce",
          "meaning": "FOODON:00001998"
        },
        "Lion": {
          "text": "Lion"
        },
        "Lizard": {
          "text": "Lizard",
          "meaning": "FOODON:03412293"
        },
        "Marsupial": {
          "text": "Marsupial"
        },
        "Mink": {
          "text": "Mink",
          "meaning": "FOODON:00002723"
        },
        "Mint": {
          "text": "Mint",
          "meaning": "FOODON:00002432"
        },
        "Mixed": {
          "text": "Mixed"
        },
        "Mongoose": {
          "text": "Mongoose"
        },
        "Mouse": {
          "text": "Mouse",
          "meaning": "NCIT:C14238"
        },
        "Mushrooms": {
          "text": "Mushrooms",
          "meaning": "FOODON:00001287"
        },
        "Mussel": {
          "text": "Mussel",
          "meaning": "FOODON:03411223"
        },
        "n/a": {
          "text": "n/a"
        },
        "Not Available": {
          "text": "Not Available"
        },
        "Octopus": {
          "text": "Octopus",
          "meaning": "FOODON:03411514"
        },
        "Opossum": {
          "text": "Opossum",
          "meaning": "FOODON:03411450"
        },
        "Oregano": {
          "text": "Oregano",
          "meaning": "FOODON:03301482"
        },
        "Other": {
          "text": "Other"
        },
        "Otter": {
          "text": "Otter",
          "meaning": "CURATION:0001394"
        },
        "Ovine": {
          "text": "Ovine",
          "meaning": "FOODON:03411183"
        },
        "Owl": {
          "text": "Owl",
          "meaning": "NCBITAXON:30458"
        },
        "Oyster": {
          "text": "Oyster",
          "meaning": "FOODON:03411224"
        },
        "Parrot": {
          "text": "Parrot",
          "meaning": "FOODON:00002726"
        },
        "Parsley": {
          "text": "Parsley",
          "meaning": "FOODON:00002942"
        },
        "Partridge": {
          "text": "Partridge",
          "meaning": "FOODON:03411382"
        },
        "Pea sprouts": {
          "text": "Pea sprouts"
        },
        "Peanut Butter": {
          "text": "Peanut Butter",
          "meaning": "FOODON:03306867"
        },
        "Pepper": {
          "text": "Pepper",
          "meaning": "FOODON:00001649"
        },
        "Perdrix": {
          "text": "Perdrix",
          "meaning": "FOODON:03411382"
        },
        "Pheasant": {
          "text": "Pheasant",
          "meaning": "FOODON:03411460"
        },
        "Pickerel": {
          "text": "Pickerel"
        },
        "Pig": {
          "text": "Pig",
          "meaning": "FOODON:03411136"
        },
        "Pigeon": {
          "text": "Pigeon",
          "meaning": "FOODON:03411304"
        },
        "Pine Siskin": {
          "text": "Pine Siskin",
          "meaning": "CURATION:0000439"
        },
        "Pony": {
          "text": "Pony"
        },
        "Porcupine": {
          "text": "Porcupine"
        },
        "Porpoise": {
          "text": "Porpoise",
          "meaning": "FOODON:03413364"
        },
        "Primate": {
          "text": "Primate",
          "meaning": "NCBITAXON:9443"
        },
        "Quail": {
          "text": "Quail",
          "meaning": "FOODON:03411346"
        },
        "Rabbit": {
          "text": "Rabbit",
          "meaning": "FOODON:03411323"
        },
        "Raccoon": {
          "text": "Raccoon",
          "meaning": "FOODON:03411461"
        },
        "Rat": {
          "text": "Rat",
          "meaning": "FOODON:03414848"
        },
        "Ratite": {
          "text": "Ratite",
          "meaning": "FOODON:03414362"
        },
        "Raven": {
          "text": "Raven"
        },
        "Red Deer": {
          "text": "Red Deer",
          "meaning": "FOODON:03414371"
        },
        "Redpoll": {
          "text": "Redpoll"
        },
        "Reptile": {
          "text": "Reptile",
          "meaning": "FOODON:03411625"
        },
        "Rhea": {
          "text": "Rhea",
          "meaning": "FOODON:03414556"
        },
        "Robin": {
          "text": "Robin"
        },
        "Rodent": {
          "text": "Rodent",
          "meaning": "NCBITAXON:9989"
        },
        "Sage": {
          "text": "Sage",
          "meaning": "FOODON:00002217"
        },
        "Salmon": {
          "text": "Salmon",
          "meaning": "FOODON:00002220"
        },
        "Scallop": {
          "text": "Scallop",
          "meaning": "FOODON:03411489"
        },
        "Sea Otter": {
          "text": "Sea Otter",
          "meaning": "CURATION:0000157"
        },
        "Sea Snail": {
          "text": "Sea Snail",
          "meaning": "FOODON:03414639"
        },
        "Seal": {
          "text": "Seal"
        },
        "Sesame Seed": {
          "text": "Sesame Seed",
          "meaning": "FOODON:03310306"
        },
        "Sheep": {
          "text": "Sheep",
          "meaning": "FOODON:03411183"
        },
        "Shrimp": {
          "text": "Shrimp",
          "meaning": "FOODON:03411237"
        },
        "Skink": {
          "text": "Skink",
          "meaning": "FOODON:03412293"
        },
        "Skunk": {
          "text": "Skunk"
        },
        "Snake": {
          "text": "Snake",
          "meaning": "FOODON:03411295"
        },
        "Sparrow": {
          "text": "Sparrow"
        },
        "Spinach": {
          "text": "Spinach",
          "meaning": "FOODON:03301716"
        },
        "Spotted Hyena": {
          "text": "Spotted Hyena"
        },
        "Sprouts": {
          "text": "Sprouts",
          "meaning": "FOODON:03420183"
        },
        "Squid": {
          "text": "Squid",
          "meaning": "FOODON:03411205"
        },
        "Squirrel": {
          "text": "Squirrel",
          "meaning": "FOODON:03411389"
        },
        "Stripped Hyena": {
          "text": "Stripped Hyena"
        },
        "Swan": {
          "text": "Swan"
        },
        "Tantalus Monkey": {
          "text": "Tantalus Monkey",
          "meaning": "FOODON:03412439"
        },
        "Tilapia": {
          "text": "Tilapia",
          "meaning": "FOODON:03412434"
        },
        "Tomato": {
          "text": "Tomato",
          "meaning": "FOODON:03309927"
        },
        "Tortoise": {
          "text": "Tortoise",
          "meaning": "FOODON:00000074"
        },
        "Trout": {
          "text": "Trout",
          "meaning": "FOODON:03411258"
        },
        "Turkey": {
          "text": "Turkey",
          "meaning": "FOODON:03414166"
        },
        "Turtle": {
          "text": "Turtle",
          "meaning": "FOODON:03411242"
        },
        "Unknown": {
          "text": "Unknown"
        },
        "Unspecified Bird": {
          "text": "Unspecified Bird",
          "meaning": "FOODON:00002616"
        },
        "Unspecified Fish": {
          "text": "Unspecified Fish",
          "meaning": "FOODON:03411222"
        },
        "Unspecified Primate": {
          "text": "Unspecified Primate",
          "meaning": "NCBITAXON:9443"
        },
        "Unspecified Reptile": {
          "text": "Unspecified Reptile",
          "meaning": "FOODON:03411625"
        },
        "Unspecified Rodent": {
          "text": "Unspecified Rodent",
          "meaning": "NCBITAXON:9989"
        },
        "Vulture": {
          "text": "Vulture"
        },
        "Wallnut": {
          "text": "Wallnut"
        },
        "Water Dragon": {
          "text": "Water Dragon",
          "meaning": "CHEBI:15377"
        },
        "White Fish": {
          "text": "White Fish",
          "meaning": "FOODON:00003281"
        },
        "Wild Ruminant": {
          "text": "Wild Ruminant",
          "meaning": "FOODON:03530153"
        },
        "Wombat": {
          "text": "Wombat"
        },
        "Woodpecker": {
          "text": "Woodpecker"
        },
        "Zebra": {
          "text": "Zebra",
          "meaning": "FOODON:03412097"
        }
      }
    },
    "STTYPE menu": {
      "name": "STTYPE menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "0": {
          "text": "0"
        },
        "0.5": {
          "text": "0.5"
        },
        "ANIMAL": {
          "text": "ANIMAL",
          "meaning": "FOODON:00003004",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "ENVIRONMENT": {
          "text": "ENVIRONMENT",
          "meaning": "ENVO:01000254",
          "exact_mappings": [
            "GRDI:environmental_material:",
            "GRDI:environmental_site:"
          ]
        },
        "FOOD": {
          "text": "FOOD",
          "meaning": "CHEBI:33290",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "HUMAN": {
          "text": "HUMAN",
          "meaning": "NCBITAXON:9606",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "PRODUCT": {
          "text": "PRODUCT"
        },
        "QA": {
          "text": "QA"
        },
        "UNKNOWN": {
          "text": "UNKNOWN",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "2": {
          "text": "2"
        },
        "<=8": {
          "text": "<=8"
        },
        "<n/a>": {
          "text": "<n/a>"
        },
        "Amphibian": {
          "text": "Amphibian",
          "meaning": "FOODON:03411624",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Aquatic Mammal": {
          "text": "Aquatic Mammal",
          "meaning": "FOODON:03411134",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Armadillo": {
          "text": "Armadillo",
          "meaning": "FOODON:03411626",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Avian": {
          "text": "Avian",
          "meaning": "FOODON:00002616",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Bat": {
          "text": "Bat",
          "meaning": "CURATION:0001601",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Biosolids": {
          "text": "Biosolids",
          "meaning": "ENVO:00002059",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Bovine": {
          "text": "Bovine",
          "meaning": "FOODON:03414374",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Building": {
          "text": "Building",
          "meaning": "ENVO:00000073",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Camelid": {
          "text": "Camelid",
          "meaning": "FOODON:03412103",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Canine": {
          "text": "Canine",
          "meaning": "FOODON:03414847",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Caprine": {
          "text": "Caprine",
          "meaning": "FOODON:03411328",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Caprine and Ovine": {
          "text": "Caprine and Ovine",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Cereal": {
          "text": "Cereal",
          "meaning": "FOODON:00001709",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cereal/Bread/Snack": {
          "text": "Cereal/Bread/Snack",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cervid": {
          "text": "Cervid",
          "meaning": "FOODON:03411500",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Compost": {
          "text": "Compost",
          "meaning": "CURATION:0001527",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Confections/Nuts/Condiments": {
          "text": "Confections/Nuts/Condiments",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Crocuta": {
          "text": "Crocuta",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Crustacean": {
          "text": "Crustacean",
          "meaning": "FOODON:03411374",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Dairy": {
          "text": "Dairy",
          "meaning": "ENVO:00003862",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Dust": {
          "text": "Dust",
          "meaning": "ENVO:00002008",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Egg": {
          "text": "Egg",
          "meaning": "FOODON:00001274",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Elephant": {
          "text": "Elephant",
          "meaning": "FOODON:03412129",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Equine": {
          "text": "Equine",
          "meaning": "CURATION:0001431",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Equipment": {
          "text": "Equipment",
          "meaning": "CURATION:0000348",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "ERROR": {
          "text": "ERROR"
        },
        "Feed and Ingredients": {
          "text": "Feed and Ingredients",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Feline": {
          "text": "Feline",
          "meaning": "NCIT:C14191",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Ferret": {
          "text": "Ferret",
          "meaning": "CURATION:0001411",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Fertilizer": {
          "text": "Fertilizer",
          "meaning": "CHEBI:33287",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Fish": {
          "text": "Fish",
          "meaning": "FOODON:03411222",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Food": {
          "text": "Food",
          "meaning": "CHEBI:33290",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Fruit": {
          "text": "Fruit",
          "meaning": "PO:0009001",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Fruits and Vegetables": {
          "text": "Fruits and Vegetables",
          "meaning": "FOODON:00002141",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Health (medicine)": {
          "text": "Health (medicine)"
        },
        "Herbs and Spices": {
          "text": "Herbs and Spices",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Herpestidae": {
          "text": "Herpestidae",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Hippopotamidae": {
          "text": "Hippopotamidae",
          "meaning": "NCBITAXON:9831",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Lapine": {
          "text": "Lapine",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Litter/Manure": {
          "text": "Litter/Manure",
          "meaning": "CURATION:0001446",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Manure": {
          "text": "Manure",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Marsupial": {
          "text": "Marsupial",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Meat": {
          "text": "Meat",
          "meaning": "FOODON:00001006",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mephitida": {
          "text": "Mephitida",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Mink": {
          "text": "Mink",
          "meaning": "FOODON:00002723",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Mixed food": {
          "text": "Mixed food",
          "meaning": "CHEBI:33290",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mixed Food/Meat": {
          "text": "Mixed Food/Meat",
          "meaning": "FOODON:03315600",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mollusk": {
          "text": "Mollusk",
          "meaning": "FOODON:03412112",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Mustelid": {
          "text": "Mustelid",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "n/a": {
          "text": "n/a",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Other": {
          "text": "Other",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Ovine": {
          "text": "Ovine",
          "meaning": "FOODON:03411183",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Personnel Clothing": {
          "text": "Personnel Clothing",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Porcine": {
          "text": "Porcine",
          "meaning": "FOODON:03411136",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Primate": {
          "text": "Primate",
          "meaning": "NCBITAXON:9443",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Raccoon": {
          "text": "Raccoon",
          "meaning": "FOODON:03411461",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Reptile": {
          "text": "Reptile",
          "meaning": "FOODON:03411625",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Rodent": {
          "text": "Rodent",
          "meaning": "NCBITAXON:9989",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Sewage": {
          "text": "Sewage",
          "meaning": "ENVO:00002018",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Soil": {
          "text": "Soil",
          "meaning": "ENVO:00001998",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Transportation Supplies": {
          "text": "Transportation Supplies",
          "meaning": "ENVO:02000125",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Transportation Vehicles": {
          "text": "Transportation Vehicles",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Turkey": {
          "text": "Turkey",
          "meaning": "FOODON:03414166",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Unknown": {
          "text": "Unknown",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Unknown Food": {
          "text": "Unknown Food",
          "meaning": "CHEBI:33290",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unspecified": {
          "text": "Unspecified"
        },
        "Unspecified Animal": {
          "text": "Unspecified Animal",
          "meaning": "FOODON:00003004",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Unspecified Environmental": {
          "text": "Unspecified Environmental",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Unspecified Food": {
          "text": "Unspecified Food",
          "meaning": "CURATION:0001610",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unspecified Product": {
          "text": "Unspecified Product",
          "meaning": "CHEBI:33290"
        },
        "Ursine": {
          "text": "Ursine",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Vegetable/Spice": {
          "text": "Vegetable/Spice",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Water": {
          "text": "Water",
          "meaning": "CHEBI:15377",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        }
      }
    },
    "COMMODITY menu": {
      "name": "COMMODITY menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "<=16": {
          "text": "<=16"
        },
        "Beef": {
          "text": "Beef",
          "meaning": "FOODON:00001041",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Broiler": {
          "text": "Broiler",
          "meaning": "FOODON:03411198",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Dairy": {
          "text": "Dairy",
          "meaning": "ENVO:00003862",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Domestic/Farmed": {
          "text": "Domestic/Farmed"
        },
        "Egg": {
          "text": "Egg",
          "meaning": "FOODON:00001274",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Laboratory": {
          "text": "Laboratory",
          "meaning": "NCIT:C37984",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Meat": {
          "text": "Meat",
          "meaning": "FOODON:00001006",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mutton": {
          "text": "Mutton",
          "meaning": "FOODON:00002912",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pet": {
          "text": "Pet",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Pet/Zoo": {
          "text": "Pet/Zoo",
          "meaning": "ENVO:00010625",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Red Veal": {
          "text": "Red Veal",
          "meaning": "FOODON:00003083",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unknown": {
          "text": "Unknown",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Veal": {
          "text": "Veal",
          "meaning": "FOODON:00003083",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "White Veal": {
          "text": "White Veal",
          "meaning": "FOODON:00003083",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Wild": {
          "text": "Wild",
          "meaning": "FOODON:03530153"
        }
      }
    },
    "SPECIMENSOURCE_1 menu": {
      "name": "SPECIMENSOURCE_1 menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "2": {
          "text": "2"
        },
        "<=32": {
          "text": "<=32"
        },
        "Aliquote / Portion": {
          "text": "Aliquote / Portion",
          "meaning": "CURATION:0000508"
        },
        "Blood": {
          "text": "Blood",
          "meaning": "UBERON:0000178",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Blood Meal": {
          "text": "Blood Meal",
          "meaning": "FOODON:00001564",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Body Fluid/Excretion": {
          "text": "Body Fluid/Excretion",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Carcass": {
          "text": "Carcass",
          "meaning": "UBERON:0008979",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Check Sample": {
          "text": "Check Sample",
          "meaning": "SEP:00042"
        },
        "Contact plate": {
          "text": "Contact plate",
          "exact_mappings": [
            "GRDI:collection_device:"
          ]
        },
        "Culture": {
          "text": "Culture",
          "meaning": "CURATION:0000488"
        },
        "Dust": {
          "text": "Dust",
          "meaning": "ENVO:00002008",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Egg": {
          "text": "Egg",
          "meaning": "FOODON:00001274",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Environment (Animal)": {
          "text": "Environment (Animal)"
        },
        "Environmental": {
          "text": "Environmental",
          "meaning": "CURATION:0001610",
          "exact_mappings": [
            "GRDI:environmental_material:",
            "GRDI:environmental_site:"
          ]
        },
        "Feces": {
          "text": "Feces",
          "meaning": "UBERON:0001988",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Fetus/Embryo": {
          "text": "Fetus/Embryo",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Organ": {
          "text": "Organ",
          "meaning": "UBERON:0000062",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Organ/Tissue": {
          "text": "Organ/Tissue",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Proficiency Isolate": {
          "text": "Proficiency Isolate",
          "meaning": "NCIT:C53471"
        },
        "Reference Culture": {
          "text": "Reference Culture",
          "meaning": "CURATION:0000488"
        },
        "Rinse": {
          "text": "Rinse",
          "meaning": "CURATION:0001629",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Septage": {
          "text": "Septage",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Soya Meal": {
          "text": "Soya Meal",
          "meaning": "FOODON:03316468",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Stool": {
          "text": "Stool",
          "meaning": "UBERON:0001988",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Swab": {
          "text": "Swab",
          "meaning": "NCIT:C17627",
          "exact_mappings": [
            "GRDI:collection_device:"
          ]
        },
        "Tissue": {
          "text": "Tissue",
          "meaning": "UBERON:0000479",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Unit (Pre-Packaged)": {
          "text": "Unit (Pre-Packaged)",
          "meaning": "UO:0000000"
        },
        "Unknown": {
          "text": "Unknown",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Unspecified": {
          "text": "Unspecified"
        },
        "Urine": {
          "text": "Urine",
          "meaning": "UBERON:0001088",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        }
      }
    },
    "SPECIMENSUBSOURCE_1 menu": {
      "name": "SPECIMENSUBSOURCE_1 menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "0.25": {
          "text": "0.25"
        },
        "<=0.12": {
          "text": "<=0.12"
        },
        "<=16": {
          "text": "<=16"
        },
        "aansarraysubsource": {
          "text": "aansarraysubsource"
        },
        "Abdomen": {
          "text": "Abdomen",
          "meaning": "UBERON:0000916",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Abdominal Muscle": {
          "text": "Abdominal Muscle",
          "meaning": "UBERON:0002378",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Abomasum": {
          "text": "Abomasum",
          "meaning": "UBERON:0007358",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Abscess": {
          "text": "Abscess",
          "meaning": "HP:0025615",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Air Intake": {
          "text": "Air Intake",
          "meaning": "ENVO:00002005",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Air Sac": {
          "text": "Air Sac",
          "meaning": "UBERON:0009060",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Anal Gland": {
          "text": "Anal Gland",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Animal Pen": {
          "text": "Animal Pen",
          "meaning": "FOODON:00003004",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Balut": {
          "text": "Balut",
          "meaning": "FOODON:03302184",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Belt": {
          "text": "Belt",
          "meaning": "CURATION:0000406",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Bladder": {
          "text": "Bladder",
          "meaning": "CURATION:0000504",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Blood": {
          "text": "Blood",
          "meaning": "UBERON:0000178",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Blood vessel": {
          "text": "Blood vessel",
          "meaning": "UBERON:0001981",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Bone": {
          "text": "Bone",
          "meaning": "UBERON:0001474",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Bone Marrow": {
          "text": "Bone Marrow",
          "meaning": "UBERON:0002371",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Bootie": {
          "text": "Bootie",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Boots": {
          "text": "Boots",
          "meaning": "CURATION:0000401",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Brain": {
          "text": "Brain",
          "meaning": "UBERON:0000955",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Bursa of Fabricus": {
          "text": "Bursa of Fabricus",
          "meaning": "CURATION:0000502",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Cages": {
          "text": "Cages",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Cavity Fluid (Unspecified)": {
          "text": "Cavity Fluid (Unspecified)",
          "meaning": "CURATION:0000480",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Cavity fluid unspecified": {
          "text": "Cavity fluid unspecified",
          "meaning": "CURATION:0000480",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Cecal Content": {
          "text": "Cecal Content",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Cecum": {
          "text": "Cecum",
          "meaning": "CURATION:0000495",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Chick Boxes": {
          "text": "Chick Boxes",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Chick Pads": {
          "text": "Chick Pads",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Cloacae": {
          "text": "Cloacae",
          "meaning": "CURATION:0000491",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Cloacal swab": {
          "text": "Cloacal swab",
          "meaning": "NCIT:C17627",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Colon": {
          "text": "Colon",
          "meaning": "UBERON:0001155",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Confirmation": {
          "text": "Confirmation",
          "exact_mappings": [
            "GRDI:?"
          ]
        },
        "Crates": {
          "text": "Crates",
          "meaning": "FOODON:03490213",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Crop": {
          "text": "Crop",
          "meaning": "UBERON:0007356",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Culture Plate": {
          "text": "Culture Plate",
          "exact_mappings": [
            "GRDI:collection_device:"
          ]
        },
        "Digestive System (Unspecified)": {
          "text": "Digestive System (Unspecified)",
          "meaning": "UBERON:0001007",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Duodenum": {
          "text": "Duodenum",
          "meaning": "UBERON:0002114",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Dust": {
          "text": "Dust",
          "meaning": "ENVO:00002008",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Ear": {
          "text": "Ear",
          "meaning": "UBERON:0001690",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Egg Belt": {
          "text": "Egg Belt",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Environment Swab": {
          "text": "Environment Swab",
          "exact_mappings": [
            "GRDI:collection_device:"
          ]
        },
        "Environment Swab (Hatchery)": {
          "text": "Environment Swab (Hatchery)",
          "exact_mappings": [
            "GRDI:environmental_site:hatchery",
            "GRDI:collection_device:swab"
          ]
        },
        "Esophagus": {
          "text": "Esophagus",
          "meaning": "UBERON:0001043",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "External Quality Assurance": {
          "text": "External Quality Assurance",
          "meaning": "BFO:0000019",
          "exact_mappings": [
            "GRDI:?"
          ]
        },
        "Eye": {
          "text": "Eye",
          "meaning": "UBERON:0000970",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Fan": {
          "text": "Fan",
          "meaning": "ENVO:00000104",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Fecal Slurry": {
          "text": "Fecal Slurry",
          "meaning": "UBERON:0001988",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Feces": {
          "text": "Feces",
          "meaning": "UBERON:0001988",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Feed": {
          "text": "Feed",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Feeders and Drinkers": {
          "text": "Feeders and Drinkers",
          "meaning": "CURATION:0000419",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Fetal Tissue": {
          "text": "Fetal Tissue",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Final Wash": {
          "text": "Final Wash",
          "meaning": "CURATION:0001488",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Floor": {
          "text": "Floor",
          "meaning": "CURATION:0000335",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Fluff": {
          "text": "Fluff",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Fluff (Hatchery)": {
          "text": "Fluff (Hatchery)",
          "meaning": "ENVO:01001873",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Foot": {
          "text": "Foot",
          "meaning": "UO:0010013",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Gall Bladder": {
          "text": "Gall Bladder",
          "meaning": "UBERON:0002110",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Gallbladder": {
          "text": "Gallbladder",
          "meaning": "UBERON:0002110",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Ganglion": {
          "text": "Ganglion",
          "meaning": "UBERON:0000045",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Gizzard": {
          "text": "Gizzard",
          "meaning": "UBERON:0005052",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Growth / lesion (unspecified tissue)": {
          "text": "Growth / lesion (unspecified tissue)",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Growth/Lesion (Unspecified Tissue)": {
          "text": "Growth/Lesion (Unspecified Tissue)",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Heart": {
          "text": "Heart",
          "meaning": "UBERON:0000948",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Ileum": {
          "text": "Ileum",
          "meaning": "UBERON:0002116",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "In-House": {
          "text": "In-House",
          "meaning": "ENVO:01000417"
        },
        "Inter-Lab Exchange": {
          "text": "Inter-Lab Exchange",
          "meaning": "NCIT:C37984"
        },
        "Intestinal Contents": {
          "text": "Intestinal Contents",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Intestine": {
          "text": "Intestine",
          "meaning": "UBERON:0000160",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Jejunum": {
          "text": "Jejunum",
          "meaning": "UBERON:0002115",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Joint": {
          "text": "Joint",
          "meaning": "UBERON:0004905",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Joint Fluid": {
          "text": "Joint Fluid",
          "meaning": "UBERON:0001090",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Kidney": {
          "text": "Kidney",
          "meaning": "UBERON:0002113",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Levage/peritoneal": {
          "text": "Levage/peritoneal",
          "meaning": "CURATION:0000463",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Levage/Tracheal": {
          "text": "Levage/Tracheal",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Litter": {
          "text": "Litter",
          "meaning": "CURATION:0001446",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Litter/Manure": {
          "text": "Litter/Manure",
          "meaning": "CURATION:0001446",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Live Haul Truck": {
          "text": "Live Haul Truck",
          "meaning": "ENVO:01000602",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Live Haul Truck/Trailer": {
          "text": "Live Haul Truck/Trailer",
          "meaning": "ENVO:01000602",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Liver": {
          "text": "Liver",
          "meaning": "UBERON:0002107",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Lung": {
          "text": "Lung",
          "meaning": "UBERON:0002048",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Lymph Node": {
          "text": "Lymph Node",
          "meaning": "UBERON:0000029",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Manure Pit": {
          "text": "Manure Pit",
          "meaning": "ENVO:01001872",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Meconium": {
          "text": "Meconium",
          "meaning": "UBERON:0007109",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Mesenteric Lymph Node": {
          "text": "Mesenteric Lymph Node",
          "meaning": "UBERON:0002509",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Milk/Colostrum": {
          "text": "Milk/Colostrum",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Mixed": {
          "text": "Mixed",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Mixed Organs": {
          "text": "Mixed Organs",
          "meaning": "UBERON:0000062",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Mixed Tissues": {
          "text": "Mixed Tissues",
          "meaning": "UBERON:0000479",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Mouth": {
          "text": "Mouth",
          "meaning": "UBERON:0000165",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Mucous membrane (gut)": {
          "text": "Mucous membrane (gut)",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Mucous membrane (resp)": {
          "text": "Mucous membrane (resp)",
          "meaning": "UBERON:0000344",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Mucus": {
          "text": "Mucus",
          "meaning": "UBERON:0000912",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Muscle": {
          "text": "Muscle",
          "meaning": "CURATION:0001428",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Muscle/Meat": {
          "text": "Muscle/Meat",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Nasal Turbinate": {
          "text": "Nasal Turbinate",
          "meaning": "UBERON:0035612",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Nasal/Naries": {
          "text": "Nasal/Naries",
          "meaning": "CURATION:0000466",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Organ Unspecified": {
          "text": "Organ Unspecified",
          "meaning": "UBERON:0000062",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Ovary": {
          "text": "Ovary",
          "meaning": "UBERON:0000992",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Oviduct": {
          "text": "Oviduct",
          "meaning": "UBERON:0000993",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Pericardium": {
          "text": "Pericardium",
          "meaning": "UBERON:0002407",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Peritoneal Fluid": {
          "text": "Peritoneal Fluid",
          "meaning": "UBERON:0001268",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Peritoneum": {
          "text": "Peritoneum",
          "meaning": "UBERON:0002358",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Placenta": {
          "text": "Placenta",
          "meaning": "UBERON:0001987",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Pleura": {
          "text": "Pleura",
          "meaning": "UBERON:0000977",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Plucking Belt": {
          "text": "Plucking Belt",
          "meaning": "CURATION:0000406",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Plucking Water": {
          "text": "Plucking Water",
          "meaning": "CHEBI:15377",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Pooled Feces": {
          "text": "Pooled Feces",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Rectal Swab": {
          "text": "Rectal Swab",
          "meaning": "CURATION:0000457",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Rectum": {
          "text": "Rectum",
          "meaning": "UBERON:0001052",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Research": {
          "text": "Research",
          "meaning": "CURATION:0001536"
        },
        "Rinse": {
          "text": "Rinse",
          "meaning": "CURATION:0001629",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Rumen": {
          "text": "Rumen",
          "meaning": "UBERON:0007365",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Shell": {
          "text": "Shell",
          "meaning": "UBERON:0006612",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Shell egg": {
          "text": "Shell egg",
          "meaning": "UBERON:0005079",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sinus": {
          "text": "Sinus",
          "meaning": "CURATION:0000455",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Skin": {
          "text": "Skin",
          "meaning": "UBERON:0000014",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Small Intestine": {
          "text": "Small Intestine",
          "meaning": "UBERON:0002108",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Soil": {
          "text": "Soil",
          "meaning": "ENVO:00001998",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Spinal Cord": {
          "text": "Spinal Cord",
          "meaning": "UBERON:0002240",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Spleen": {
          "text": "Spleen",
          "meaning": "UBERON:0002106",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Stall": {
          "text": "Stall",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Stomach": {
          "text": "Stomach",
          "meaning": "UBERON:0000945",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Stomach Contents": {
          "text": "Stomach Contents",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Swab": {
          "text": "Swab",
          "meaning": "NCIT:C17627",
          "exact_mappings": [
            "GRDI:collection_device:"
          ]
        },
        "Swab (Nasal)": {
          "text": "Swab (Nasal)",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Swab (Rectal)": {
          "text": "Swab (Rectal)",
          "meaning": "CURATION:0000457",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Swab (Tissue Fluid-Unspecified)": {
          "text": "Swab (Tissue Fluid-Unspecified)",
          "exact_mappings": [
            "GRDI:anatomical_material:"
          ]
        },
        "Testicle": {
          "text": "Testicle",
          "meaning": "UBERON:0000473",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Thorax": {
          "text": "Thorax",
          "meaning": "UBERON:0000915",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Trachea": {
          "text": "Trachea",
          "meaning": "UBERON:0003126",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Unknown organ": {
          "text": "Unknown organ",
          "meaning": "UBERON:0000062",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Unspecified Organ/Tissue": {
          "text": "Unspecified Organ/Tissue",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Urine": {
          "text": "Urine",
          "meaning": "UBERON:0001088",
          "exact_mappings": [
            "GRDI:body_product:"
          ]
        },
        "Uterus": {
          "text": "Uterus",
          "meaning": "UBERON:0000995",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Vagina": {
          "text": "Vagina",
          "meaning": "UBERON:0000996",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Walls": {
          "text": "Walls",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Water": {
          "text": "Water",
          "meaning": "CHEBI:15377",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Watering Bowl/Equipment": {
          "text": "Watering Bowl/Equipment",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Weekly": {
          "text": "Weekly"
        },
        "Weep": {
          "text": "Weep",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Whole": {
          "text": "Whole",
          "meaning": "FOODON:03430131",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Yolk": {
          "text": "Yolk",
          "meaning": "UBERON:2000084",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Yolk Sac": {
          "text": "Yolk Sac",
          "meaning": "UBERON:0001040",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        }
      }
    },
    "SUBJECT_SUBTYPE menu": {
      "name": "SUBJECT_SUBTYPE menu",
      "from_schema": "https://example.com/PHAC_Dexa",
      "permissible_values": {
        "<=32": {
          "text": "<=32"
        },
        "<n/a>": {
          "text": "<n/a>"
        },
        ">32": {
          "text": ">32"
        },
        "Alfalfa Sprouts": {
          "text": "Alfalfa Sprouts",
          "meaning": "FOODON:00002670",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Almond": {
          "text": "Almond",
          "meaning": "FOODON:03301355",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Animal pen": {
          "text": "Animal pen",
          "meaning": "FOODON:00003004",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Artificial wetland": {
          "text": "Artificial wetland",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Arugula": {
          "text": "Arugula",
          "meaning": "FOODON:00002426",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Basil": {
          "text": "Basil",
          "meaning": "FOODON:00003044",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Bean Sprouts": {
          "text": "Bean Sprouts",
          "meaning": "FOODON:00002576",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Biosolid": {
          "text": "Biosolid",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Biosolid/Sludge": {
          "text": "Biosolid/Sludge",
          "meaning": "ENVO:00002044",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Bootie": {
          "text": "Bootie",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Boots": {
          "text": "Boots",
          "meaning": "CURATION:0000401",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Breast": {
          "text": "Breast",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast skinless": {
          "text": "Breast skinless",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast skinless boneless": {
          "text": "Breast skinless boneless",
          "meaning": "UBERON:0000310",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Breast with skin": {
          "text": "Breast with skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Broom": {
          "text": "Broom",
          "meaning": "CURATION:0000397",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Bulk Tank": {
          "text": "Bulk Tank",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Cantaloupe": {
          "text": "Cantaloupe",
          "meaning": "CURATION:0001383",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Carcass (whole)": {
          "text": "Carcass (whole)",
          "exact_mappings": [
            "GRDI:anatomical_part:"
          ]
        },
        "Cheese": {
          "text": "Cheese",
          "meaning": "FOODON:00001013",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chia Powder": {
          "text": "Chia Powder",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chia Seeds": {
          "text": "Chia Seeds",
          "meaning": "CURATION:0001385",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chia Sprouts": {
          "text": "Chia Sprouts",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chick Boxes": {
          "text": "Chick Boxes",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Chick Pads": {
          "text": "Chick Pads",
          "meaning": "UBERON:2001977",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Chickpea": {
          "text": "Chickpea",
          "meaning": "FOODON:03306811",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chili": {
          "text": "Chili",
          "meaning": "FOODON:03301511",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chilli Pepper": {
          "text": "Chilli Pepper",
          "meaning": "FOODON:03315873",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chives": {
          "text": "Chives",
          "meaning": "FOODON:03311167",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Chops": {
          "text": "Chops",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Coconut": {
          "text": "Coconut",
          "meaning": "FOODON:03303085",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Compost": {
          "text": "Compost",
          "meaning": "CURATION:0001527",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Cooler Line": {
          "text": "Cooler Line",
          "meaning": "SIO:000511",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Coriander Seeds": {
          "text": "Coriander Seeds",
          "meaning": "PO:0009010",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Coriander-Cumin Powder": {
          "text": "Coriander-Cumin Powder",
          "meaning": "FOODON:00002976",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cottage": {
          "text": "Cottage",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Cucumber": {
          "text": "Cucumber",
          "meaning": "FOODON:03301545",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Curry Leaves": {
          "text": "Curry Leaves",
          "meaning": "FOODON:03306648",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Curry powder": {
          "text": "Curry powder",
          "meaning": "FOODON:03301842",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Cut": {
          "text": "Cut",
          "meaning": "ENVO:00000474",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Dead Haul Truck / Trailer": {
          "text": "Dead Haul Truck / Trailer",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Dill": {
          "text": "Dill",
          "meaning": "FOODON:00001811",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Drumstick": {
          "text": "Drumstick",
          "meaning": "CURATION:0001378",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Dumpster": {
          "text": "Dumpster",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Effluent": {
          "text": "Effluent",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Egg": {
          "text": "Egg",
          "meaning": "FOODON:00001274",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Egg Belt": {
          "text": "Egg Belt",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Fan": {
          "text": "Fan",
          "meaning": "ENVO:00000104",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Feed Pans": {
          "text": "Feed Pans",
          "meaning": "FOODON:03309997",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Fennel": {
          "text": "Fennel",
          "meaning": "FOODON:03309953",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Filet": {
          "text": "Filet",
          "meaning": "FOODON:03530144",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Flax and Chia Powder": {
          "text": "Flax and Chia Powder",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Flax Powder": {
          "text": "Flax Powder",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Floor": {
          "text": "Floor",
          "meaning": "CURATION:0000335",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "For Avian": {
          "text": "For Avian",
          "meaning": "FOODON:00002616",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Beef Cattle": {
          "text": "For Beef Cattle",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Cats": {
          "text": "For Cats",
          "meaning": "CURATION:0001354",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Cattle (Beef)": {
          "text": "For Cattle (Beef)",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Cattle (Dairy)": {
          "text": "For Cattle (Dairy)",
          "meaning": "FOODON:00002505",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Chicken": {
          "text": "For Chicken",
          "meaning": "FOODON:03411457",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Dairy Cows": {
          "text": "For Dairy Cows",
          "meaning": "FOODON:03411201",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Dogs": {
          "text": "For Dogs",
          "meaning": "CURATION:0001351",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Fish": {
          "text": "For Fish",
          "meaning": "FOODON:03411222",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Goats": {
          "text": "For Goats",
          "meaning": "FOODON:03411328",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Horse": {
          "text": "For Horse",
          "meaning": "FOODON:03411229",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Mink": {
          "text": "For Mink",
          "meaning": "FOODON:00002723",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Others": {
          "text": "For Others"
        },
        "For Poultry": {
          "text": "For Poultry",
          "meaning": "FOODON:00001131",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Swine": {
          "text": "For Swine",
          "meaning": "FOODON:03411136",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Turkeys": {
          "text": "For Turkeys",
          "meaning": "FOODON:03414166",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "For Unknown": {
          "text": "For Unknown"
        },
        "For Unspecified": {
          "text": "For Unspecified",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Garlic Powder": {
          "text": "Garlic Powder",
          "meaning": "FOODON:03301844",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ginger": {
          "text": "Ginger",
          "meaning": "FOODON:00002718",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Green Onion": {
          "text": "Green Onion",
          "meaning": "FOODON:03411478",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground": {
          "text": "Ground",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (extra lean)": {
          "text": "Ground (extra lean)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (lean)": {
          "text": "Ground (lean)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (medium)": {
          "text": "Ground (medium)",
          "meaning": "FOODON:03430117",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground (regular)": {
          "text": "Ground (regular)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Ground Water": {
          "text": "Ground Water",
          "meaning": "ENVO:00002041",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Ham": {
          "text": "Ham",
          "meaning": "FOODON:00002502",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Hazelnut / Filbert": {
          "text": "Hazelnut / Filbert",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Headcheese": {
          "text": "Headcheese",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Herb/Spice (Unspecified)": {
          "text": "Herb/Spice (Unspecified)",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Irrigation": {
          "text": "Irrigation",
          "meaning": "CURATION:0000309",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Kale": {
          "text": "Kale",
          "meaning": "FOODON:03304859",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Kalonji Whole Seed": {
          "text": "Kalonji Whole Seed",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Lab Surface": {
          "text": "Lab Surface",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Lake": {
          "text": "Lake",
          "meaning": "ENVO:00000020",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Leg": {
          "text": "Leg",
          "meaning": "UBERON:0000978",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Lettuce": {
          "text": "Lettuce",
          "meaning": "FOODON:00001998",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Liquid whole": {
          "text": "Liquid whole",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Liver": {
          "text": "Liver",
          "meaning": "UBERON:0002107",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Loin center chop non-seasoned": {
          "text": "Loin center chop non-seasoned",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mango": {
          "text": "Mango",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Meat": {
          "text": "Meat",
          "meaning": "FOODON:00001006",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Milk": {
          "text": "Milk",
          "meaning": "UBERON:0001913",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mint": {
          "text": "Mint",
          "meaning": "FOODON:00002432",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mixed": {
          "text": "Mixed",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Mixed Salad/Mixed Greens": {
          "text": "Mixed Salad/Mixed Greens",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mixed Sprouts": {
          "text": "Mixed Sprouts",
          "meaning": "FOODON:03420183",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Mung Bean Sprouts": {
          "text": "Mung Bean Sprouts",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Oregano": {
          "text": "Oregano",
          "meaning": "FOODON:03301482",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other": {
          "text": "Other",
          "exact_mappings": [
            "GRDI:host (common name):"
          ]
        },
        "Other chicken": {
          "text": "Other chicken",
          "meaning": "FOODON:03411457",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other cut (not ground)": {
          "text": "Other cut (not ground)",
          "meaning": "ENVO:00000474",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Other variety meats": {
          "text": "Other variety meats",
          "meaning": "FOODON:03420218",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Papaya": {
          "text": "Papaya",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Paprika": {
          "text": "Paprika",
          "meaning": "FOODON:03301105",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Parsley": {
          "text": "Parsley",
          "meaning": "FOODON:00002942",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pea Sprouts": {
          "text": "Pea Sprouts",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pepper": {
          "text": "Pepper",
          "meaning": "FOODON:00001649",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pepper Powder": {
          "text": "Pepper Powder",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Pepperoni": {
          "text": "Pepperoni",
          "meaning": "FOODON:03311003",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Rasam Powder Spice": {
          "text": "Rasam Powder Spice",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "River": {
          "text": "River",
          "meaning": "ENVO:00000022",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "River Surface": {
          "text": "River Surface",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Roast": {
          "text": "Roast",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Rolled": {
          "text": "Rolled"
        },
        "Run Off": {
          "text": "Run Off",
          "meaning": "ENVO:00000029",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Sausage": {
          "text": "Sausage",
          "meaning": "FOODON:03315904",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Scallopini": {
          "text": "Scallopini",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sediment": {
          "text": "Sediment",
          "meaning": "ENVO:00002007",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Sesame Seed": {
          "text": "Sesame Seed",
          "meaning": "FOODON:03310306",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shelf / Sill": {
          "text": "Shelf / Sill",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Shellfish": {
          "text": "Shellfish",
          "meaning": "FOODON:03411433",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shoulder": {
          "text": "Shoulder",
          "meaning": "UBERON:0001467",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shoulder Chop": {
          "text": "Shoulder Chop",
          "meaning": "UBERON:0001467",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Shoulder chop non-seasoned": {
          "text": "Shoulder chop non-seasoned",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Soft": {
          "text": "Soft",
          "meaning": "PATO:0000387",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Soybean": {
          "text": "Soybean",
          "meaning": "FOODON:03301415",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Spinach": {
          "text": "Spinach",
          "meaning": "FOODON:03301716",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sprouted Seeds": {
          "text": "Sprouted Seeds",
          "meaning": "FOODON:03420102",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Sprouts": {
          "text": "Sprouts",
          "meaning": "FOODON:03420183",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Stall": {
          "text": "Stall",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Steak": {
          "text": "Steak",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Stew Chunks": {
          "text": "Stew Chunks",
          "meaning": "FOODON:00003140",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Surface - Other": {
          "text": "Surface - Other",
          "meaning": "CURATION:0000247",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Surface - River": {
          "text": "Surface - River",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Surface unspecified": {
          "text": "Surface unspecified",
          "meaning": "CURATION:0000247",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Surface Water": {
          "text": "Surface Water",
          "meaning": "ENVO:00002042",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Tenderloin": {
          "text": "Tenderloin",
          "meaning": "FOODON:03530217",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh": {
          "text": "Thigh",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Thigh with skin": {
          "text": "Thigh with skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Transformer": {
          "text": "Transformer",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Truck / Trailer": {
          "text": "Truck / Trailer",
          "meaning": "ENVO:01000602",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Truck/Trailer": {
          "text": "Truck/Trailer",
          "meaning": "ENVO:01000602",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Turmeric": {
          "text": "Turmeric",
          "meaning": "FOODON:03310841",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Unknown": {
          "text": "Unknown"
        },
        "Unknown Surface": {
          "text": "Unknown Surface",
          "meaning": "CURATION:0000247",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Unspecified": {
          "text": "Unspecified"
        },
        "Upper Thigh": {
          "text": "Upper Thigh",
          "meaning": "UBERON:0000376",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Upper Thigh with Skin": {
          "text": "Upper Thigh with Skin",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Wall": {
          "text": "Wall",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Walnut": {
          "text": "Walnut",
          "meaning": "FOODON:03315233",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Waste Water": {
          "text": "Waste Water",
          "meaning": "ENVO:00002001",
          "exact_mappings": [
            "GRDI:environmental_material:"
          ]
        },
        "Watering bowl/equipment": {
          "text": "Watering bowl/equipment",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Whole": {
          "text": "Whole",
          "meaning": "FOODON:03430131",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Wings": {
          "text": "Wings",
          "meaning": "UBERON:0000023",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        },
        "Working Surface": {
          "text": "Working Surface",
          "meaning": "CURATION:0000247",
          "exact_mappings": [
            "GRDI:environmental_site:"
          ]
        },
        "Yeast": {
          "text": "Yeast",
          "meaning": "FOODON:03411345",
          "exact_mappings": [
            "GRDI:food_product:"
          ]
        }
      }
    }
  },
  "slots": {
    "SPECIMEN_ID": {
      "name": "SPECIMEN_ID",
      "title": "SPECIMEN_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:alternative_sample_ID"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "ISOLATE_ID": {
      "name": "ISOLATE_ID",
      "title": "ISOLATE_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:isolate_ID"
      ],
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "SAMPLE_ID": {
      "name": "SAMPLE_ID",
      "title": "SAMPLE_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:sample_collector_sample_ID"
      ],
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "SENTINEL_SITE": {
      "name": "SENTINEL_SITE",
      "title": "SENTINEL_SITE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "LFZ_ADDITIONAL_SAMPLE_ID": {
      "name": "LFZ_ADDITIONAL_SAMPLE_ID",
      "title": "LFZ_ADDITIONAL_SAMPLE_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "LFZ_ORIGIN_COUNTRY": {
      "name": "LFZ_ORIGIN_COUNTRY",
      "title": "LFZ_ORIGIN_COUNTRY",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SUBJECT_CODE": {
      "name": "SUBJECT_CODE",
      "title": "SUBJECT_CODE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SUBJECT_DESCRIPTIONS": {
      "name": "SUBJECT_DESCRIPTIONS",
      "title": "SUBJECT_DESCRIPTIONS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "SUBJECT_DESCRIPTIONS menu"
    },
    "SUBMITTINGORG_1": {
      "name": "SUBMITTINGORG_1",
      "title": "SUBMITTINGORG_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:collected_by"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "SUBMITTINGLAB_1": {
      "name": "SUBMITTINGLAB_1",
      "title": "SUBMITTINGLAB_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:laboratory_name"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "PROJECT_1": {
      "name": "PROJECT_1",
      "title": "PROJECT_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "COUNTRY_1": {
      "name": "COUNTRY_1",
      "title": "COUNTRY_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:geo_loc_name (country)"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "PROVINCE_1": {
      "name": "PROVINCE_1",
      "title": "PROVINCE_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:geo_loc_name (state/province/region)"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "CENSUSDIVISION_1": {
      "name": "CENSUSDIVISION_1",
      "title": "CENSUSDIVISION_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "REGION": {
      "name": "REGION",
      "title": "REGION",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "YEAR": {
      "name": "YEAR",
      "title": "YEAR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MONTH": {
      "name": "MONTH",
      "title": "MONTH",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "QTR": {
      "name": "QTR",
      "title": "QTR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "DATECOLLECTED_1": {
      "name": "DATECOLLECTED_1",
      "title": "DATECOLLECTED_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:sample_collection_date"
      ],
      "range": "date"
    },
    "DATERECEIVED_1": {
      "name": "DATERECEIVED_1",
      "title": "DATERECEIVED_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "DATESHIPPED_1": {
      "name": "DATESHIPPED_1",
      "title": "DATESHIPPED_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "ESTABLISHMENT_1": {
      "name": "ESTABLISHMENT_1",
      "title": "ESTABLISHMENT_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SPECIES": {
      "name": "SPECIES",
      "title": "SPECIES",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:host (common name):"
      ],
      "range": "SPECIES menu"
    },
    "STTYPE": {
      "name": "STTYPE",
      "title": "STTYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "STTYPE menu"
    },
    "STYPE": {
      "name": "STYPE",
      "title": "STYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "STYPE menu"
    },
    "COMMODITY": {
      "name": "COMMODITY",
      "title": "COMMODITY",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "COMMODITY menu"
    },
    "SPECIMENSOURCE_1": {
      "name": "SPECIMENSOURCE_1",
      "title": "SPECIMENSOURCE_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "SPECIMENSOURCE_1 menu"
    },
    "SPECIMENSUBSOURCE_1": {
      "name": "SPECIMENSUBSOURCE_1",
      "title": "SPECIMENSUBSOURCE_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "SPECIMENSUBSOURCE_1 menu"
    },
    "SUBJECT_SUBTYPE": {
      "name": "SUBJECT_SUBTYPE",
      "title": "SUBJECT_SUBTYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "SUBJECT_SUBTYPE menu"
    },
    "FIELDSTAFF_1": {
      "name": "FIELDSTAFF_1",
      "title": "FIELDSTAFF_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "IN_STORE_PROCESSING": {
      "name": "IN_STORE_PROCESSING",
      "title": "IN_STORE_PROCESSING",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MAYCONTAINFROZENMEAT_1": {
      "name": "MAYCONTAINFROZENMEAT_1",
      "title": "MAYCONTAINFROZENMEAT_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "NOOFCASHREGISTERS_1": {
      "name": "NOOFCASHREGISTERS_1",
      "title": "NOOFCASHREGISTERS_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "PRICEPERKG_1": {
      "name": "PRICEPERKG_1",
      "title": "PRICEPERKG_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "STORETYPE_SAMPLINGSITE_1": {
      "name": "STORETYPE_SAMPLINGSITE_1",
      "title": "STORETYPE_SAMPLINGSITE_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "TEMPERATUREMAX_1": {
      "name": "TEMPERATUREMAX_1",
      "title": "TEMPERATUREMAX_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "TEMPERATUREMIN_1": {
      "name": "TEMPERATUREMIN_1",
      "title": "TEMPERATUREMIN_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "TEMPERATUREARRIVAL_1": {
      "name": "TEMPERATUREARRIVAL_1",
      "title": "TEMPERATUREARRIVAL_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "VETID": {
      "name": "VETID",
      "title": "VETID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "ROOMID": {
      "name": "ROOMID",
      "title": "ROOMID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "PENID": {
      "name": "PENID",
      "title": "PENID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SAMPLING_TYPE": {
      "name": "SAMPLING_TYPE",
      "title": "SAMPLING_TYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "BARN_ID": {
      "name": "BARN_ID",
      "title": "BARN_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "DATE_PACKED": {
      "name": "DATE_PACKED",
      "title": "DATE_PACKED",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_GENUS": {
      "name": "FINAL_ID_GENUS",
      "title": "FINAL_ID_GENUS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:organism"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_SPECIES": {
      "name": "FINAL_ID_SPECIES",
      "title": "FINAL_ID_SPECIES",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:organism"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_SUBSPECIES": {
      "name": "FINAL_ID_SUBSPECIES",
      "title": "FINAL_ID_SUBSPECIES",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_SEROTYPE": {
      "name": "FINAL_ID_SEROTYPE",
      "title": "FINAL_ID_SEROTYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:serovar"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_ANTIGEN": {
      "name": "FINAL_ID_ANTIGEN",
      "title": "FINAL_ID_ANTIGEN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "FINAL_ID_PHAGETYPE": {
      "name": "FINAL_ID_PHAGETYPE",
      "title": "FINAL_ID_PHAGETYPE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:phagetype"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "SA_Serotype_Method": {
      "name": "SA_Serotype_Method",
      "title": "SA_Serotype_Method",
      "from_schema": "https://example.com/PHAC_Dexa",
      "exact_mappings": [
        "GRDI:serotyping_method"
      ],
      "range": "WhitespaceMinimizedString"
    },
    "SEROTYPE_GR": {
      "name": "SEROTYPE_GR",
      "title": "SEROTYPE_GR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_AMC": {
      "name": "MIC_AMC",
      "title": "MIC_AMC",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_AMK": {
      "name": "MIC_AMK",
      "title": "MIC_AMK",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_AMP": {
      "name": "MIC_AMP",
      "title": "MIC_AMP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_AZM": {
      "name": "MIC_AZM",
      "title": "MIC_AZM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_CEP": {
      "name": "MIC_CEP",
      "title": "MIC_CEP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_CHL": {
      "name": "MIC_CHL",
      "title": "MIC_CHL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_CIP": {
      "name": "MIC_CIP",
      "title": "MIC_CIP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_CRO": {
      "name": "MIC_CRO",
      "title": "MIC_CRO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_FOX": {
      "name": "MIC_FOX",
      "title": "MIC_FOX",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_GEN": {
      "name": "MIC_GEN",
      "title": "MIC_GEN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_KAN": {
      "name": "MIC_KAN",
      "title": "MIC_KAN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_MEM": {
      "name": "MIC_MEM",
      "title": "MIC_MEM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_NAL": {
      "name": "MIC_NAL",
      "title": "MIC_NAL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_SSS": {
      "name": "MIC_SSS",
      "title": "MIC_SSS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_STR": {
      "name": "MIC_STR",
      "title": "MIC_STR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_SXT": {
      "name": "MIC_SXT",
      "title": "MIC_SXT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_TET": {
      "name": "MIC_TET",
      "title": "MIC_TET",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MIC_TIO": {
      "name": "MIC_TIO",
      "title": "MIC_TIO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "N_OF_RESISTANCE": {
      "name": "N_OF_RESISTANCE",
      "title": "N_OF_RESISTANCE",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "NBTESTED": {
      "name": "NBTESTED",
      "title": "NBTESTED",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "R_PATTERN": {
      "name": "R_PATTERN",
      "title": "R_PATTERN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "AMR_PA2C": {
      "name": "AMR_PA2C",
      "title": "AMR_PA2C",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RLEAST1": {
      "name": "RLEAST1",
      "title": "RLEAST1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RLEAST2": {
      "name": "RLEAST2",
      "title": "RLEAST2",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RLEAST3": {
      "name": "RLEAST3",
      "title": "RLEAST3",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RLEAST4": {
      "name": "RLEAST4",
      "title": "RLEAST4",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RLEAST5": {
      "name": "RLEAST5",
      "title": "RLEAST5",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_AMC": {
      "name": "SIR_AMC",
      "title": "SIR_AMC",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_AMK": {
      "name": "SIR_AMK",
      "title": "SIR_AMK",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_AMP": {
      "name": "SIR_AMP",
      "title": "SIR_AMP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_AZM": {
      "name": "SIR_AZM",
      "title": "SIR_AZM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_CEP": {
      "name": "SIR_CEP",
      "title": "SIR_CEP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_CHL": {
      "name": "SIR_CHL",
      "title": "SIR_CHL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_CIP": {
      "name": "SIR_CIP",
      "title": "SIR_CIP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_CRO": {
      "name": "SIR_CRO",
      "title": "SIR_CRO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_FOX": {
      "name": "SIR_FOX",
      "title": "SIR_FOX",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_GEN": {
      "name": "SIR_GEN",
      "title": "SIR_GEN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_KAN": {
      "name": "SIR_KAN",
      "title": "SIR_KAN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_MEM": {
      "name": "SIR_MEM",
      "title": "SIR_MEM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_NAL": {
      "name": "SIR_NAL",
      "title": "SIR_NAL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_SSS": {
      "name": "SIR_SSS",
      "title": "SIR_SSS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_STR": {
      "name": "SIR_STR",
      "title": "SIR_STR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_SXT": {
      "name": "SIR_SXT",
      "title": "SIR_SXT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_TET": {
      "name": "SIR_TET",
      "title": "SIR_TET",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "SIR_TIO": {
      "name": "SIR_TIO",
      "title": "SIR_TIO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RAMC": {
      "name": "RAMC",
      "title": "RAMC",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RAMK": {
      "name": "RAMK",
      "title": "RAMK",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RAMP": {
      "name": "RAMP",
      "title": "RAMP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RAZM": {
      "name": "RAZM",
      "title": "RAZM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RCEP": {
      "name": "RCEP",
      "title": "RCEP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RCHL": {
      "name": "RCHL",
      "title": "RCHL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RCIP": {
      "name": "RCIP",
      "title": "RCIP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RCRO": {
      "name": "RCRO",
      "title": "RCRO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RFOX": {
      "name": "RFOX",
      "title": "RFOX",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RGEN": {
      "name": "RGEN",
      "title": "RGEN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RKAN": {
      "name": "RKAN",
      "title": "RKAN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RMEM": {
      "name": "RMEM",
      "title": "RMEM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RNAL": {
      "name": "RNAL",
      "title": "RNAL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RSSS": {
      "name": "RSSS",
      "title": "RSSS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RSTR": {
      "name": "RSTR",
      "title": "RSTR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RSXT": {
      "name": "RSXT",
      "title": "RSXT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RTET": {
      "name": "RTET",
      "title": "RTET",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RTIO": {
      "name": "RTIO",
      "title": "RTIO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "A2C": {
      "name": "A2C",
      "title": "A2C",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CAMC": {
      "name": "CAMC",
      "title": "CAMC",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CAMK": {
      "name": "CAMK",
      "title": "CAMK",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CAMP": {
      "name": "CAMP",
      "title": "CAMP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CAZM": {
      "name": "CAZM",
      "title": "CAZM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CCEP": {
      "name": "CCEP",
      "title": "CCEP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CCHL": {
      "name": "CCHL",
      "title": "CCHL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CCIP": {
      "name": "CCIP",
      "title": "CCIP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CCRO": {
      "name": "CCRO",
      "title": "CCRO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CFOX": {
      "name": "CFOX",
      "title": "CFOX",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CGEN": {
      "name": "CGEN",
      "title": "CGEN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CKAN": {
      "name": "CKAN",
      "title": "CKAN",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CMEM": {
      "name": "CMEM",
      "title": "CMEM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CNAL": {
      "name": "CNAL",
      "title": "CNAL",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CSSS": {
      "name": "CSSS",
      "title": "CSSS",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CSTR": {
      "name": "CSTR",
      "title": "CSTR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CSXT": {
      "name": "CSXT",
      "title": "CSXT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CTET": {
      "name": "CTET",
      "title": "CTET",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "CTIO": {
      "name": "CTIO",
      "title": "CTIO",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "STHY_TESTSRC_ID": {
      "name": "STHY_TESTSRC_ID",
      "title": "STHY_TESTSRC_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "WINN_TESTSRC_ID": {
      "name": "WINN_TESTSRC_ID",
      "title": "WINN_TESTSRC_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "GUEL_TESTSRC_ID": {
      "name": "GUEL_TESTSRC_ID",
      "title": "GUEL_TESTSRC_ID",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RCIP_DANMAP": {
      "name": "RCIP_DANMAP",
      "title": "RCIP_DANMAP",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "EPIDATESTAMP_1": {
      "name": "EPIDATESTAMP_1",
      "title": "EPIDATESTAMP_1",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "ACSSUT": {
      "name": "ACSSUT",
      "title": "ACSSUT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "AKSSUT": {
      "name": "AKSSUT",
      "title": "AKSSUT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "ACKSSUT": {
      "name": "ACKSSUT",
      "title": "ACKSSUT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MDR_A_SSUT": {
      "name": "MDR_A_SSUT",
      "title": "MDR_A_SSUT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "EXCLUSION": {
      "name": "EXCLUSION",
      "title": "EXCLUSION",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RAMINOGLY": {
      "name": "RAMINOGLY",
      "title": "RAMINOGLY",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RBETALACTAM": {
      "name": "RBETALACTAM",
      "title": "RBETALACTAM",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RQUINOLONES": {
      "name": "RQUINOLONES",
      "title": "RQUINOLONES",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "RFOLINHIBITOR": {
      "name": "RFOLINHIBITOR",
      "title": "RFOLINHIBITOR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "MDR": {
      "name": "MDR",
      "title": "MDR",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "specimen_number": {
      "name": "specimen_number",
      "title": "specimen_number",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "EXTERNAL_AGENT": {
      "name": "EXTERNAL_AGENT",
      "title": "EXTERNAL_AGENT",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "FARM_FLAG": {
      "name": "FARM_FLAG",
      "title": "FARM_FLAG",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    },
    "AMIKACINGELET": {
      "name": "AMIKACINGELET",
      "title": "AMIKACINGELET",
      "from_schema": "https://example.com/PHAC_Dexa",
      "range": "WhitespaceMinimizedString"
    }
  },
  "classes": {
    "dh_interface": {
      "name": "dh_interface",
      "description": "A DataHarmonizer interface",
      "from_schema": "https://example.com/PHAC_Dexa"
    },
    "PHAC Dexa": {
      "name": "PHAC Dexa",
      "description": "Specification for PHAC Dexa clinical virus biosample data gathering",
      "from_schema": "https://example.com/PHAC_Dexa",
      "is_a": "dh_interface",
      "slot_usage": {
        "SPECIMEN_ID": {
          "name": "SPECIMEN_ID",
          "rank": 1,
          "slot_group": "Database Identifiers"
        },
        "ISOLATE_ID": {
          "name": "ISOLATE_ID",
          "rank": 2,
          "slot_group": "Database Identifiers"
        },
        "SAMPLE_ID": {
          "name": "SAMPLE_ID",
          "rank": 3,
          "slot_group": "Database Identifiers"
        },
        "SENTINEL_SITE": {
          "name": "SENTINEL_SITE",
          "rank": 4,
          "slot_group": "Fields to put in sections"
        },
        "LFZ_ADDITIONAL_SAMPLE_ID": {
          "name": "LFZ_ADDITIONAL_SAMPLE_ID",
          "rank": 5,
          "slot_group": "Fields to put in sections"
        },
        "LFZ_ORIGIN_COUNTRY": {
          "name": "LFZ_ORIGIN_COUNTRY",
          "rank": 6,
          "slot_group": "Fields to put in sections"
        },
        "SUBJECT_CODE": {
          "name": "SUBJECT_CODE",
          "rank": 7,
          "slot_group": "Fields to put in sections"
        },
        "SUBJECT_DESCRIPTIONS": {
          "name": "SUBJECT_DESCRIPTIONS",
          "rank": 8,
          "slot_group": "Fields to put in sections"
        },
        "SUBMITTINGORG_1": {
          "name": "SUBMITTINGORG_1",
          "rank": 9,
          "slot_group": "Fields to put in sections"
        },
        "SUBMITTINGLAB_1": {
          "name": "SUBMITTINGLAB_1",
          "rank": 10,
          "slot_group": "Fields to put in sections"
        },
        "PROJECT_1": {
          "name": "PROJECT_1",
          "rank": 11,
          "slot_group": "Fields to put in sections"
        },
        "COUNTRY_1": {
          "name": "COUNTRY_1",
          "rank": 12,
          "slot_group": "Fields to put in sections"
        },
        "PROVINCE_1": {
          "name": "PROVINCE_1",
          "rank": 13,
          "slot_group": "Fields to put in sections"
        },
        "CENSUSDIVISION_1": {
          "name": "CENSUSDIVISION_1",
          "rank": 14,
          "slot_group": "Fields to put in sections"
        },
        "REGION": {
          "name": "REGION",
          "rank": 15,
          "slot_group": "Fields to put in sections"
        },
        "YEAR": {
          "name": "YEAR",
          "rank": 16,
          "slot_group": "Fields to put in sections"
        },
        "MONTH": {
          "name": "MONTH",
          "rank": 17,
          "slot_group": "Fields to put in sections"
        },
        "QTR": {
          "name": "QTR",
          "rank": 18,
          "slot_group": "Fields to put in sections"
        },
        "DATECOLLECTED_1": {
          "name": "DATECOLLECTED_1",
          "rank": 19,
          "slot_group": "Fields to put in sections"
        },
        "DATERECEIVED_1": {
          "name": "DATERECEIVED_1",
          "rank": 20,
          "slot_group": "Fields to put in sections"
        },
        "DATESHIPPED_1": {
          "name": "DATESHIPPED_1",
          "rank": 21,
          "slot_group": "Fields to put in sections"
        },
        "ESTABLISHMENT_1": {
          "name": "ESTABLISHMENT_1",
          "rank": 22,
          "slot_group": "Fields to put in sections"
        },
        "SPECIES": {
          "name": "SPECIES",
          "rank": 23,
          "slot_group": "Fields to put in sections"
        },
        "STTYPE": {
          "name": "STTYPE",
          "rank": 24,
          "slot_group": "Fields to put in sections"
        },
        "STYPE": {
          "name": "STYPE",
          "rank": 25,
          "slot_group": "Fields to put in sections"
        },
        "COMMODITY": {
          "name": "COMMODITY",
          "rank": 26,
          "slot_group": "Fields to put in sections"
        },
        "SPECIMENSOURCE_1": {
          "name": "SPECIMENSOURCE_1",
          "rank": 27,
          "slot_group": "Fields to put in sections"
        },
        "SPECIMENSUBSOURCE_1": {
          "name": "SPECIMENSUBSOURCE_1",
          "rank": 28,
          "slot_group": "Fields to put in sections"
        },
        "SUBJECT_SUBTYPE": {
          "name": "SUBJECT_SUBTYPE",
          "rank": 29,
          "slot_group": "Fields to put in sections"
        },
        "FIELDSTAFF_1": {
          "name": "FIELDSTAFF_1",
          "rank": 30,
          "slot_group": "Fields to put in sections"
        },
        "IN_STORE_PROCESSING": {
          "name": "IN_STORE_PROCESSING",
          "rank": 31,
          "slot_group": "Fields to put in sections"
        },
        "MAYCONTAINFROZENMEAT_1": {
          "name": "MAYCONTAINFROZENMEAT_1",
          "rank": 32,
          "slot_group": "Fields to put in sections"
        },
        "NOOFCASHREGISTERS_1": {
          "name": "NOOFCASHREGISTERS_1",
          "rank": 33,
          "slot_group": "Fields to put in sections"
        },
        "PRICEPERKG_1": {
          "name": "PRICEPERKG_1",
          "rank": 34,
          "slot_group": "Fields to put in sections"
        },
        "STORETYPE_SAMPLINGSITE_1": {
          "name": "STORETYPE_SAMPLINGSITE_1",
          "rank": 35,
          "slot_group": "Fields to put in sections"
        },
        "TEMPERATUREMAX_1": {
          "name": "TEMPERATUREMAX_1",
          "rank": 36,
          "slot_group": "Fields to put in sections"
        },
        "TEMPERATUREMIN_1": {
          "name": "TEMPERATUREMIN_1",
          "rank": 37,
          "slot_group": "Fields to put in sections"
        },
        "TEMPERATUREARRIVAL_1": {
          "name": "TEMPERATUREARRIVAL_1",
          "rank": 38,
          "slot_group": "Fields to put in sections"
        },
        "VETID": {
          "name": "VETID",
          "rank": 39,
          "slot_group": "Fields to put in sections"
        },
        "ROOMID": {
          "name": "ROOMID",
          "rank": 40,
          "slot_group": "Fields to put in sections"
        },
        "PENID": {
          "name": "PENID",
          "rank": 41,
          "slot_group": "Fields to put in sections"
        },
        "SAMPLING_TYPE": {
          "name": "SAMPLING_TYPE",
          "rank": 42,
          "slot_group": "Fields to put in sections"
        },
        "BARN_ID": {
          "name": "BARN_ID",
          "rank": 43,
          "slot_group": "Fields to put in sections"
        },
        "DATE_PACKED": {
          "name": "DATE_PACKED",
          "rank": 44,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_GENUS": {
          "name": "FINAL_ID_GENUS",
          "rank": 45,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_SPECIES": {
          "name": "FINAL_ID_SPECIES",
          "rank": 46,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_SUBSPECIES": {
          "name": "FINAL_ID_SUBSPECIES",
          "rank": 47,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_SEROTYPE": {
          "name": "FINAL_ID_SEROTYPE",
          "rank": 48,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_ANTIGEN": {
          "name": "FINAL_ID_ANTIGEN",
          "rank": 49,
          "slot_group": "Fields to put in sections"
        },
        "FINAL_ID_PHAGETYPE": {
          "name": "FINAL_ID_PHAGETYPE",
          "rank": 50,
          "slot_group": "Fields to put in sections"
        },
        "SA_Serotype_Method": {
          "name": "SA_Serotype_Method",
          "rank": 51,
          "slot_group": "Fields to put in sections"
        },
        "SEROTYPE_GR": {
          "name": "SEROTYPE_GR",
          "rank": 52,
          "slot_group": "Fields to put in sections"
        },
        "MIC_AMC": {
          "name": "MIC_AMC",
          "rank": 53,
          "slot_group": "Fields to put in sections"
        },
        "MIC_AMK": {
          "name": "MIC_AMK",
          "rank": 54,
          "slot_group": "Fields to put in sections"
        },
        "MIC_AMP": {
          "name": "MIC_AMP",
          "rank": 55,
          "slot_group": "Fields to put in sections"
        },
        "MIC_AZM": {
          "name": "MIC_AZM",
          "rank": 56,
          "slot_group": "Fields to put in sections"
        },
        "MIC_CEP": {
          "name": "MIC_CEP",
          "rank": 57,
          "slot_group": "Fields to put in sections"
        },
        "MIC_CHL": {
          "name": "MIC_CHL",
          "rank": 58,
          "slot_group": "Fields to put in sections"
        },
        "MIC_CIP": {
          "name": "MIC_CIP",
          "rank": 59,
          "slot_group": "Fields to put in sections"
        },
        "MIC_CRO": {
          "name": "MIC_CRO",
          "rank": 60,
          "slot_group": "Fields to put in sections"
        },
        "MIC_FOX": {
          "name": "MIC_FOX",
          "rank": 61,
          "slot_group": "Fields to put in sections"
        },
        "MIC_GEN": {
          "name": "MIC_GEN",
          "rank": 62,
          "slot_group": "Fields to put in sections"
        },
        "MIC_KAN": {
          "name": "MIC_KAN",
          "rank": 63,
          "slot_group": "Fields to put in sections"
        },
        "MIC_MEM": {
          "name": "MIC_MEM",
          "rank": 64,
          "slot_group": "Fields to put in sections"
        },
        "MIC_NAL": {
          "name": "MIC_NAL",
          "rank": 65,
          "slot_group": "Fields to put in sections"
        },
        "MIC_SSS": {
          "name": "MIC_SSS",
          "rank": 66,
          "slot_group": "Fields to put in sections"
        },
        "MIC_STR": {
          "name": "MIC_STR",
          "rank": 67,
          "slot_group": "Fields to put in sections"
        },
        "MIC_SXT": {
          "name": "MIC_SXT",
          "rank": 68,
          "slot_group": "Fields to put in sections"
        },
        "MIC_TET": {
          "name": "MIC_TET",
          "rank": 69,
          "slot_group": "Fields to put in sections"
        },
        "MIC_TIO": {
          "name": "MIC_TIO",
          "rank": 70,
          "slot_group": "Fields to put in sections"
        },
        "N_OF_RESISTANCE": {
          "name": "N_OF_RESISTANCE",
          "rank": 71,
          "slot_group": "Fields to put in sections"
        },
        "NBTESTED": {
          "name": "NBTESTED",
          "rank": 72,
          "slot_group": "Fields to put in sections"
        },
        "R_PATTERN": {
          "name": "R_PATTERN",
          "rank": 73,
          "slot_group": "Fields to put in sections"
        },
        "AMR_PA2C": {
          "name": "AMR_PA2C",
          "rank": 74,
          "slot_group": "Fields to put in sections"
        },
        "RLEAST1": {
          "name": "RLEAST1",
          "rank": 75,
          "slot_group": "Fields to put in sections"
        },
        "RLEAST2": {
          "name": "RLEAST2",
          "rank": 76,
          "slot_group": "Fields to put in sections"
        },
        "RLEAST3": {
          "name": "RLEAST3",
          "rank": 77,
          "slot_group": "Fields to put in sections"
        },
        "RLEAST4": {
          "name": "RLEAST4",
          "rank": 78,
          "slot_group": "Fields to put in sections"
        },
        "RLEAST5": {
          "name": "RLEAST5",
          "rank": 79,
          "slot_group": "Fields to put in sections"
        },
        "SIR_AMC": {
          "name": "SIR_AMC",
          "rank": 80,
          "slot_group": "Fields to put in sections"
        },
        "SIR_AMK": {
          "name": "SIR_AMK",
          "rank": 81,
          "slot_group": "Fields to put in sections"
        },
        "SIR_AMP": {
          "name": "SIR_AMP",
          "rank": 82,
          "slot_group": "Fields to put in sections"
        },
        "SIR_AZM": {
          "name": "SIR_AZM",
          "rank": 83,
          "slot_group": "Fields to put in sections"
        },
        "SIR_CEP": {
          "name": "SIR_CEP",
          "rank": 84,
          "slot_group": "Fields to put in sections"
        },
        "SIR_CHL": {
          "name": "SIR_CHL",
          "rank": 85,
          "slot_group": "Fields to put in sections"
        },
        "SIR_CIP": {
          "name": "SIR_CIP",
          "rank": 86,
          "slot_group": "Fields to put in sections"
        },
        "SIR_CRO": {
          "name": "SIR_CRO",
          "rank": 87,
          "slot_group": "Fields to put in sections"
        },
        "SIR_FOX": {
          "name": "SIR_FOX",
          "rank": 88,
          "slot_group": "Fields to put in sections"
        },
        "SIR_GEN": {
          "name": "SIR_GEN",
          "rank": 89,
          "slot_group": "Fields to put in sections"
        },
        "SIR_KAN": {
          "name": "SIR_KAN",
          "rank": 90,
          "slot_group": "Fields to put in sections"
        },
        "SIR_MEM": {
          "name": "SIR_MEM",
          "rank": 91,
          "slot_group": "Fields to put in sections"
        },
        "SIR_NAL": {
          "name": "SIR_NAL",
          "rank": 92,
          "slot_group": "Fields to put in sections"
        },
        "SIR_SSS": {
          "name": "SIR_SSS",
          "rank": 93,
          "slot_group": "Fields to put in sections"
        },
        "SIR_STR": {
          "name": "SIR_STR",
          "rank": 94,
          "slot_group": "Fields to put in sections"
        },
        "SIR_SXT": {
          "name": "SIR_SXT",
          "rank": 95,
          "slot_group": "Fields to put in sections"
        },
        "SIR_TET": {
          "name": "SIR_TET",
          "rank": 96,
          "slot_group": "Fields to put in sections"
        },
        "SIR_TIO": {
          "name": "SIR_TIO",
          "rank": 97,
          "slot_group": "Fields to put in sections"
        },
        "RAMC": {
          "name": "RAMC",
          "rank": 98,
          "slot_group": "Fields to put in sections"
        },
        "RAMK": {
          "name": "RAMK",
          "rank": 99,
          "slot_group": "Fields to put in sections"
        },
        "RAMP": {
          "name": "RAMP",
          "rank": 100,
          "slot_group": "Fields to put in sections"
        },
        "RAZM": {
          "name": "RAZM",
          "rank": 101,
          "slot_group": "Fields to put in sections"
        },
        "RCEP": {
          "name": "RCEP",
          "rank": 102,
          "slot_group": "Fields to put in sections"
        },
        "RCHL": {
          "name": "RCHL",
          "rank": 103,
          "slot_group": "Fields to put in sections"
        },
        "RCIP": {
          "name": "RCIP",
          "rank": 104,
          "slot_group": "Fields to put in sections"
        },
        "RCRO": {
          "name": "RCRO",
          "rank": 105,
          "slot_group": "Fields to put in sections"
        },
        "RFOX": {
          "name": "RFOX",
          "rank": 106,
          "slot_group": "Fields to put in sections"
        },
        "RGEN": {
          "name": "RGEN",
          "rank": 107,
          "slot_group": "Fields to put in sections"
        },
        "RKAN": {
          "name": "RKAN",
          "rank": 108,
          "slot_group": "Fields to put in sections"
        },
        "RMEM": {
          "name": "RMEM",
          "rank": 109,
          "slot_group": "Fields to put in sections"
        },
        "RNAL": {
          "name": "RNAL",
          "rank": 110,
          "slot_group": "Fields to put in sections"
        },
        "RSSS": {
          "name": "RSSS",
          "rank": 111,
          "slot_group": "Fields to put in sections"
        },
        "RSTR": {
          "name": "RSTR",
          "rank": 112,
          "slot_group": "Fields to put in sections"
        },
        "RSXT": {
          "name": "RSXT",
          "rank": 113,
          "slot_group": "Fields to put in sections"
        },
        "RTET": {
          "name": "RTET",
          "rank": 114,
          "slot_group": "Fields to put in sections"
        },
        "RTIO": {
          "name": "RTIO",
          "rank": 115,
          "slot_group": "Fields to put in sections"
        },
        "A2C": {
          "name": "A2C",
          "rank": 116,
          "slot_group": "Fields to put in sections"
        },
        "CAMC": {
          "name": "CAMC",
          "rank": 117,
          "slot_group": "Fields to put in sections"
        },
        "CAMK": {
          "name": "CAMK",
          "rank": 118,
          "slot_group": "Fields to put in sections"
        },
        "CAMP": {
          "name": "CAMP",
          "rank": 119,
          "slot_group": "Fields to put in sections"
        },
        "CAZM": {
          "name": "CAZM",
          "rank": 120,
          "slot_group": "Fields to put in sections"
        },
        "CCEP": {
          "name": "CCEP",
          "rank": 121,
          "slot_group": "Fields to put in sections"
        },
        "CCHL": {
          "name": "CCHL",
          "rank": 122,
          "slot_group": "Fields to put in sections"
        },
        "CCIP": {
          "name": "CCIP",
          "rank": 123,
          "slot_group": "Fields to put in sections"
        },
        "CCRO": {
          "name": "CCRO",
          "rank": 124,
          "slot_group": "Fields to put in sections"
        },
        "CFOX": {
          "name": "CFOX",
          "rank": 125,
          "slot_group": "Fields to put in sections"
        },
        "CGEN": {
          "name": "CGEN",
          "rank": 126,
          "slot_group": "Fields to put in sections"
        },
        "CKAN": {
          "name": "CKAN",
          "rank": 127,
          "slot_group": "Fields to put in sections"
        },
        "CMEM": {
          "name": "CMEM",
          "rank": 128,
          "slot_group": "Fields to put in sections"
        },
        "CNAL": {
          "name": "CNAL",
          "rank": 129,
          "slot_group": "Fields to put in sections"
        },
        "CSSS": {
          "name": "CSSS",
          "rank": 130,
          "slot_group": "Fields to put in sections"
        },
        "CSTR": {
          "name": "CSTR",
          "rank": 131,
          "slot_group": "Fields to put in sections"
        },
        "CSXT": {
          "name": "CSXT",
          "rank": 132,
          "slot_group": "Fields to put in sections"
        },
        "CTET": {
          "name": "CTET",
          "rank": 133,
          "slot_group": "Fields to put in sections"
        },
        "CTIO": {
          "name": "CTIO",
          "rank": 134,
          "slot_group": "Fields to put in sections"
        },
        "STHY_TESTSRC_ID": {
          "name": "STHY_TESTSRC_ID",
          "rank": 135,
          "slot_group": "Fields to put in sections"
        },
        "WINN_TESTSRC_ID": {
          "name": "WINN_TESTSRC_ID",
          "rank": 136,
          "slot_group": "Fields to put in sections"
        },
        "GUEL_TESTSRC_ID": {
          "name": "GUEL_TESTSRC_ID",
          "rank": 137,
          "slot_group": "Fields to put in sections"
        },
        "RCIP_DANMAP": {
          "name": "RCIP_DANMAP",
          "rank": 138,
          "slot_group": "Fields to put in sections"
        },
        "EPIDATESTAMP_1": {
          "name": "EPIDATESTAMP_1",
          "rank": 139,
          "slot_group": "Fields to put in sections"
        },
        "ACSSUT": {
          "name": "ACSSUT",
          "rank": 140,
          "slot_group": "Fields to put in sections"
        },
        "AKSSUT": {
          "name": "AKSSUT",
          "rank": 141,
          "slot_group": "Fields to put in sections"
        },
        "ACKSSUT": {
          "name": "ACKSSUT",
          "rank": 142,
          "slot_group": "Fields to put in sections"
        },
        "MDR_A_SSUT": {
          "name": "MDR_A_SSUT",
          "rank": 143,
          "slot_group": "Fields to put in sections"
        },
        "EXCLUSION": {
          "name": "EXCLUSION",
          "rank": 144,
          "slot_group": "Fields to put in sections"
        },
        "RAMINOGLY": {
          "name": "RAMINOGLY",
          "rank": 145,
          "slot_group": "Fields to put in sections"
        },
        "RBETALACTAM": {
          "name": "RBETALACTAM",
          "rank": 146,
          "slot_group": "Fields to put in sections"
        },
        "RQUINOLONES": {
          "name": "RQUINOLONES",
          "rank": 147,
          "slot_group": "Fields to put in sections"
        },
        "RFOLINHIBITOR": {
          "name": "RFOLINHIBITOR",
          "rank": 148,
          "slot_group": "Fields to put in sections"
        },
        "MDR": {
          "name": "MDR",
          "rank": 149,
          "slot_group": "Fields to put in sections"
        },
        "specimen_number": {
          "name": "specimen_number",
          "rank": 150,
          "slot_group": "Fields to put in sections"
        },
        "EXTERNAL_AGENT": {
          "name": "EXTERNAL_AGENT",
          "rank": 151,
          "slot_group": "Fields to put in sections"
        },
        "FARM_FLAG": {
          "name": "FARM_FLAG",
          "rank": 152,
          "slot_group": "Fields to put in sections"
        },
        "AMIKACINGELET": {
          "name": "AMIKACINGELET",
          "rank": 153,
          "slot_group": "Fields to put in sections"
        }
      },
      "attributes": {
        "SPECIMEN_ID": {
          "name": "SPECIMEN_ID",
          "title": "SPECIMEN_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 1,
          "alias": "SPECIMEN_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString"
        },
        "ISOLATE_ID": {
          "name": "ISOLATE_ID",
          "title": "ISOLATE_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 2,
          "alias": "ISOLATE_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "SAMPLE_ID": {
          "name": "SAMPLE_ID",
          "title": "SAMPLE_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 3,
          "alias": "SAMPLE_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Database Identifiers",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "SENTINEL_SITE": {
          "name": "SENTINEL_SITE",
          "title": "SENTINEL_SITE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 4,
          "alias": "SENTINEL_SITE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "LFZ_ADDITIONAL_SAMPLE_ID": {
          "name": "LFZ_ADDITIONAL_SAMPLE_ID",
          "title": "LFZ_ADDITIONAL_SAMPLE_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 5,
          "alias": "LFZ_ADDITIONAL_SAMPLE_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "LFZ_ORIGIN_COUNTRY": {
          "name": "LFZ_ORIGIN_COUNTRY",
          "title": "LFZ_ORIGIN_COUNTRY",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 6,
          "alias": "LFZ_ORIGIN_COUNTRY",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SUBJECT_CODE": {
          "name": "SUBJECT_CODE",
          "title": "SUBJECT_CODE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 7,
          "alias": "SUBJECT_CODE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SUBJECT_DESCRIPTIONS": {
          "name": "SUBJECT_DESCRIPTIONS",
          "title": "SUBJECT_DESCRIPTIONS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 8,
          "alias": "SUBJECT_DESCRIPTIONS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "SUBJECT_DESCRIPTIONS menu"
        },
        "SUBMITTINGORG_1": {
          "name": "SUBMITTINGORG_1",
          "title": "SUBMITTINGORG_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 9,
          "alias": "SUBMITTINGORG_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SUBMITTINGLAB_1": {
          "name": "SUBMITTINGLAB_1",
          "title": "SUBMITTINGLAB_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 10,
          "alias": "SUBMITTINGLAB_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "PROJECT_1": {
          "name": "PROJECT_1",
          "title": "PROJECT_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 11,
          "alias": "PROJECT_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "COUNTRY_1": {
          "name": "COUNTRY_1",
          "title": "COUNTRY_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 12,
          "alias": "COUNTRY_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "PROVINCE_1": {
          "name": "PROVINCE_1",
          "title": "PROVINCE_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 13,
          "alias": "PROVINCE_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CENSUSDIVISION_1": {
          "name": "CENSUSDIVISION_1",
          "title": "CENSUSDIVISION_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 14,
          "alias": "CENSUSDIVISION_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "REGION": {
          "name": "REGION",
          "title": "REGION",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 15,
          "alias": "REGION",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "YEAR": {
          "name": "YEAR",
          "title": "YEAR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 16,
          "alias": "YEAR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MONTH": {
          "name": "MONTH",
          "title": "MONTH",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 17,
          "alias": "MONTH",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "QTR": {
          "name": "QTR",
          "title": "QTR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 18,
          "alias": "QTR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "DATECOLLECTED_1": {
          "name": "DATECOLLECTED_1",
          "title": "DATECOLLECTED_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 19,
          "alias": "DATECOLLECTED_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "date"
        },
        "DATERECEIVED_1": {
          "name": "DATERECEIVED_1",
          "title": "DATERECEIVED_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 20,
          "alias": "DATERECEIVED_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "DATESHIPPED_1": {
          "name": "DATESHIPPED_1",
          "title": "DATESHIPPED_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 21,
          "alias": "DATESHIPPED_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "ESTABLISHMENT_1": {
          "name": "ESTABLISHMENT_1",
          "title": "ESTABLISHMENT_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 22,
          "alias": "ESTABLISHMENT_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SPECIES": {
          "name": "SPECIES",
          "title": "SPECIES",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 23,
          "alias": "SPECIES",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "SPECIES menu"
        },
        "STTYPE": {
          "name": "STTYPE",
          "title": "STTYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 24,
          "alias": "STTYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "STTYPE menu"
        },
        "STYPE": {
          "name": "STYPE",
          "title": "STYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 25,
          "alias": "STYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "STYPE menu"
        },
        "COMMODITY": {
          "name": "COMMODITY",
          "title": "COMMODITY",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 26,
          "alias": "COMMODITY",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "COMMODITY menu"
        },
        "SPECIMENSOURCE_1": {
          "name": "SPECIMENSOURCE_1",
          "title": "SPECIMENSOURCE_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 27,
          "alias": "SPECIMENSOURCE_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "SPECIMENSOURCE_1 menu"
        },
        "SPECIMENSUBSOURCE_1": {
          "name": "SPECIMENSUBSOURCE_1",
          "title": "SPECIMENSUBSOURCE_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 28,
          "alias": "SPECIMENSUBSOURCE_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "SPECIMENSUBSOURCE_1 menu"
        },
        "SUBJECT_SUBTYPE": {
          "name": "SUBJECT_SUBTYPE",
          "title": "SUBJECT_SUBTYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 29,
          "alias": "SUBJECT_SUBTYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "SUBJECT_SUBTYPE menu"
        },
        "FIELDSTAFF_1": {
          "name": "FIELDSTAFF_1",
          "title": "FIELDSTAFF_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 30,
          "alias": "FIELDSTAFF_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "IN_STORE_PROCESSING": {
          "name": "IN_STORE_PROCESSING",
          "title": "IN_STORE_PROCESSING",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 31,
          "alias": "IN_STORE_PROCESSING",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MAYCONTAINFROZENMEAT_1": {
          "name": "MAYCONTAINFROZENMEAT_1",
          "title": "MAYCONTAINFROZENMEAT_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 32,
          "alias": "MAYCONTAINFROZENMEAT_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "NOOFCASHREGISTERS_1": {
          "name": "NOOFCASHREGISTERS_1",
          "title": "NOOFCASHREGISTERS_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 33,
          "alias": "NOOFCASHREGISTERS_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "PRICEPERKG_1": {
          "name": "PRICEPERKG_1",
          "title": "PRICEPERKG_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 34,
          "alias": "PRICEPERKG_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "STORETYPE_SAMPLINGSITE_1": {
          "name": "STORETYPE_SAMPLINGSITE_1",
          "title": "STORETYPE_SAMPLINGSITE_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 35,
          "alias": "STORETYPE_SAMPLINGSITE_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "TEMPERATUREMAX_1": {
          "name": "TEMPERATUREMAX_1",
          "title": "TEMPERATUREMAX_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 36,
          "alias": "TEMPERATUREMAX_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "TEMPERATUREMIN_1": {
          "name": "TEMPERATUREMIN_1",
          "title": "TEMPERATUREMIN_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 37,
          "alias": "TEMPERATUREMIN_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "TEMPERATUREARRIVAL_1": {
          "name": "TEMPERATUREARRIVAL_1",
          "title": "TEMPERATUREARRIVAL_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 38,
          "alias": "TEMPERATUREARRIVAL_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "VETID": {
          "name": "VETID",
          "title": "VETID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 39,
          "alias": "VETID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "ROOMID": {
          "name": "ROOMID",
          "title": "ROOMID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 40,
          "alias": "ROOMID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "PENID": {
          "name": "PENID",
          "title": "PENID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 41,
          "alias": "PENID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SAMPLING_TYPE": {
          "name": "SAMPLING_TYPE",
          "title": "SAMPLING_TYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 42,
          "alias": "SAMPLING_TYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "BARN_ID": {
          "name": "BARN_ID",
          "title": "BARN_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 43,
          "alias": "BARN_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "DATE_PACKED": {
          "name": "DATE_PACKED",
          "title": "DATE_PACKED",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 44,
          "alias": "DATE_PACKED",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_GENUS": {
          "name": "FINAL_ID_GENUS",
          "title": "FINAL_ID_GENUS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 45,
          "alias": "FINAL_ID_GENUS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_SPECIES": {
          "name": "FINAL_ID_SPECIES",
          "title": "FINAL_ID_SPECIES",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 46,
          "alias": "FINAL_ID_SPECIES",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_SUBSPECIES": {
          "name": "FINAL_ID_SUBSPECIES",
          "title": "FINAL_ID_SUBSPECIES",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 47,
          "alias": "FINAL_ID_SUBSPECIES",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_SEROTYPE": {
          "name": "FINAL_ID_SEROTYPE",
          "title": "FINAL_ID_SEROTYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 48,
          "alias": "FINAL_ID_SEROTYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_ANTIGEN": {
          "name": "FINAL_ID_ANTIGEN",
          "title": "FINAL_ID_ANTIGEN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 49,
          "alias": "FINAL_ID_ANTIGEN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FINAL_ID_PHAGETYPE": {
          "name": "FINAL_ID_PHAGETYPE",
          "title": "FINAL_ID_PHAGETYPE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 50,
          "alias": "FINAL_ID_PHAGETYPE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SA_Serotype_Method": {
          "name": "SA_Serotype_Method",
          "title": "SA_Serotype_Method",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 51,
          "alias": "SA_Serotype_Method",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SEROTYPE_GR": {
          "name": "SEROTYPE_GR",
          "title": "SEROTYPE_GR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 52,
          "alias": "SEROTYPE_GR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_AMC": {
          "name": "MIC_AMC",
          "title": "MIC_AMC",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 53,
          "alias": "MIC_AMC",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_AMK": {
          "name": "MIC_AMK",
          "title": "MIC_AMK",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 54,
          "alias": "MIC_AMK",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_AMP": {
          "name": "MIC_AMP",
          "title": "MIC_AMP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 55,
          "alias": "MIC_AMP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_AZM": {
          "name": "MIC_AZM",
          "title": "MIC_AZM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 56,
          "alias": "MIC_AZM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_CEP": {
          "name": "MIC_CEP",
          "title": "MIC_CEP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 57,
          "alias": "MIC_CEP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_CHL": {
          "name": "MIC_CHL",
          "title": "MIC_CHL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 58,
          "alias": "MIC_CHL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_CIP": {
          "name": "MIC_CIP",
          "title": "MIC_CIP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 59,
          "alias": "MIC_CIP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_CRO": {
          "name": "MIC_CRO",
          "title": "MIC_CRO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 60,
          "alias": "MIC_CRO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_FOX": {
          "name": "MIC_FOX",
          "title": "MIC_FOX",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 61,
          "alias": "MIC_FOX",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_GEN": {
          "name": "MIC_GEN",
          "title": "MIC_GEN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 62,
          "alias": "MIC_GEN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_KAN": {
          "name": "MIC_KAN",
          "title": "MIC_KAN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 63,
          "alias": "MIC_KAN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_MEM": {
          "name": "MIC_MEM",
          "title": "MIC_MEM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 64,
          "alias": "MIC_MEM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_NAL": {
          "name": "MIC_NAL",
          "title": "MIC_NAL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 65,
          "alias": "MIC_NAL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_SSS": {
          "name": "MIC_SSS",
          "title": "MIC_SSS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 66,
          "alias": "MIC_SSS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_STR": {
          "name": "MIC_STR",
          "title": "MIC_STR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 67,
          "alias": "MIC_STR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_SXT": {
          "name": "MIC_SXT",
          "title": "MIC_SXT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 68,
          "alias": "MIC_SXT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_TET": {
          "name": "MIC_TET",
          "title": "MIC_TET",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 69,
          "alias": "MIC_TET",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MIC_TIO": {
          "name": "MIC_TIO",
          "title": "MIC_TIO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 70,
          "alias": "MIC_TIO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "N_OF_RESISTANCE": {
          "name": "N_OF_RESISTANCE",
          "title": "N_OF_RESISTANCE",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 71,
          "alias": "N_OF_RESISTANCE",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "NBTESTED": {
          "name": "NBTESTED",
          "title": "NBTESTED",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 72,
          "alias": "NBTESTED",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "R_PATTERN": {
          "name": "R_PATTERN",
          "title": "R_PATTERN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 73,
          "alias": "R_PATTERN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "AMR_PA2C": {
          "name": "AMR_PA2C",
          "title": "AMR_PA2C",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 74,
          "alias": "AMR_PA2C",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RLEAST1": {
          "name": "RLEAST1",
          "title": "RLEAST1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 75,
          "alias": "RLEAST1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RLEAST2": {
          "name": "RLEAST2",
          "title": "RLEAST2",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 76,
          "alias": "RLEAST2",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RLEAST3": {
          "name": "RLEAST3",
          "title": "RLEAST3",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 77,
          "alias": "RLEAST3",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RLEAST4": {
          "name": "RLEAST4",
          "title": "RLEAST4",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 78,
          "alias": "RLEAST4",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RLEAST5": {
          "name": "RLEAST5",
          "title": "RLEAST5",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 79,
          "alias": "RLEAST5",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_AMC": {
          "name": "SIR_AMC",
          "title": "SIR_AMC",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 80,
          "alias": "SIR_AMC",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_AMK": {
          "name": "SIR_AMK",
          "title": "SIR_AMK",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 81,
          "alias": "SIR_AMK",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_AMP": {
          "name": "SIR_AMP",
          "title": "SIR_AMP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 82,
          "alias": "SIR_AMP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_AZM": {
          "name": "SIR_AZM",
          "title": "SIR_AZM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 83,
          "alias": "SIR_AZM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_CEP": {
          "name": "SIR_CEP",
          "title": "SIR_CEP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 84,
          "alias": "SIR_CEP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_CHL": {
          "name": "SIR_CHL",
          "title": "SIR_CHL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 85,
          "alias": "SIR_CHL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_CIP": {
          "name": "SIR_CIP",
          "title": "SIR_CIP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 86,
          "alias": "SIR_CIP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_CRO": {
          "name": "SIR_CRO",
          "title": "SIR_CRO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 87,
          "alias": "SIR_CRO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_FOX": {
          "name": "SIR_FOX",
          "title": "SIR_FOX",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 88,
          "alias": "SIR_FOX",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_GEN": {
          "name": "SIR_GEN",
          "title": "SIR_GEN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 89,
          "alias": "SIR_GEN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_KAN": {
          "name": "SIR_KAN",
          "title": "SIR_KAN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 90,
          "alias": "SIR_KAN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_MEM": {
          "name": "SIR_MEM",
          "title": "SIR_MEM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 91,
          "alias": "SIR_MEM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_NAL": {
          "name": "SIR_NAL",
          "title": "SIR_NAL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 92,
          "alias": "SIR_NAL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_SSS": {
          "name": "SIR_SSS",
          "title": "SIR_SSS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 93,
          "alias": "SIR_SSS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_STR": {
          "name": "SIR_STR",
          "title": "SIR_STR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 94,
          "alias": "SIR_STR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_SXT": {
          "name": "SIR_SXT",
          "title": "SIR_SXT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 95,
          "alias": "SIR_SXT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_TET": {
          "name": "SIR_TET",
          "title": "SIR_TET",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 96,
          "alias": "SIR_TET",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "SIR_TIO": {
          "name": "SIR_TIO",
          "title": "SIR_TIO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 97,
          "alias": "SIR_TIO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RAMC": {
          "name": "RAMC",
          "title": "RAMC",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 98,
          "alias": "RAMC",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RAMK": {
          "name": "RAMK",
          "title": "RAMK",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 99,
          "alias": "RAMK",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RAMP": {
          "name": "RAMP",
          "title": "RAMP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 100,
          "alias": "RAMP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RAZM": {
          "name": "RAZM",
          "title": "RAZM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 101,
          "alias": "RAZM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RCEP": {
          "name": "RCEP",
          "title": "RCEP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 102,
          "alias": "RCEP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RCHL": {
          "name": "RCHL",
          "title": "RCHL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 103,
          "alias": "RCHL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RCIP": {
          "name": "RCIP",
          "title": "RCIP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 104,
          "alias": "RCIP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RCRO": {
          "name": "RCRO",
          "title": "RCRO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 105,
          "alias": "RCRO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RFOX": {
          "name": "RFOX",
          "title": "RFOX",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 106,
          "alias": "RFOX",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RGEN": {
          "name": "RGEN",
          "title": "RGEN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 107,
          "alias": "RGEN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RKAN": {
          "name": "RKAN",
          "title": "RKAN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 108,
          "alias": "RKAN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RMEM": {
          "name": "RMEM",
          "title": "RMEM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 109,
          "alias": "RMEM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RNAL": {
          "name": "RNAL",
          "title": "RNAL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 110,
          "alias": "RNAL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RSSS": {
          "name": "RSSS",
          "title": "RSSS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 111,
          "alias": "RSSS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RSTR": {
          "name": "RSTR",
          "title": "RSTR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 112,
          "alias": "RSTR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RSXT": {
          "name": "RSXT",
          "title": "RSXT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 113,
          "alias": "RSXT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RTET": {
          "name": "RTET",
          "title": "RTET",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 114,
          "alias": "RTET",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RTIO": {
          "name": "RTIO",
          "title": "RTIO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 115,
          "alias": "RTIO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "A2C": {
          "name": "A2C",
          "title": "A2C",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 116,
          "alias": "A2C",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CAMC": {
          "name": "CAMC",
          "title": "CAMC",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 117,
          "alias": "CAMC",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CAMK": {
          "name": "CAMK",
          "title": "CAMK",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 118,
          "alias": "CAMK",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CAMP": {
          "name": "CAMP",
          "title": "CAMP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 119,
          "alias": "CAMP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CAZM": {
          "name": "CAZM",
          "title": "CAZM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 120,
          "alias": "CAZM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CCEP": {
          "name": "CCEP",
          "title": "CCEP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 121,
          "alias": "CCEP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CCHL": {
          "name": "CCHL",
          "title": "CCHL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 122,
          "alias": "CCHL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CCIP": {
          "name": "CCIP",
          "title": "CCIP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 123,
          "alias": "CCIP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CCRO": {
          "name": "CCRO",
          "title": "CCRO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 124,
          "alias": "CCRO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CFOX": {
          "name": "CFOX",
          "title": "CFOX",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 125,
          "alias": "CFOX",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CGEN": {
          "name": "CGEN",
          "title": "CGEN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 126,
          "alias": "CGEN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CKAN": {
          "name": "CKAN",
          "title": "CKAN",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 127,
          "alias": "CKAN",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CMEM": {
          "name": "CMEM",
          "title": "CMEM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 128,
          "alias": "CMEM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CNAL": {
          "name": "CNAL",
          "title": "CNAL",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 129,
          "alias": "CNAL",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CSSS": {
          "name": "CSSS",
          "title": "CSSS",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 130,
          "alias": "CSSS",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CSTR": {
          "name": "CSTR",
          "title": "CSTR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 131,
          "alias": "CSTR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CSXT": {
          "name": "CSXT",
          "title": "CSXT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 132,
          "alias": "CSXT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CTET": {
          "name": "CTET",
          "title": "CTET",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 133,
          "alias": "CTET",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "CTIO": {
          "name": "CTIO",
          "title": "CTIO",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 134,
          "alias": "CTIO",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "STHY_TESTSRC_ID": {
          "name": "STHY_TESTSRC_ID",
          "title": "STHY_TESTSRC_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 135,
          "alias": "STHY_TESTSRC_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "WINN_TESTSRC_ID": {
          "name": "WINN_TESTSRC_ID",
          "title": "WINN_TESTSRC_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 136,
          "alias": "WINN_TESTSRC_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "GUEL_TESTSRC_ID": {
          "name": "GUEL_TESTSRC_ID",
          "title": "GUEL_TESTSRC_ID",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 137,
          "alias": "GUEL_TESTSRC_ID",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RCIP_DANMAP": {
          "name": "RCIP_DANMAP",
          "title": "RCIP_DANMAP",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 138,
          "alias": "RCIP_DANMAP",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "EPIDATESTAMP_1": {
          "name": "EPIDATESTAMP_1",
          "title": "EPIDATESTAMP_1",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 139,
          "alias": "EPIDATESTAMP_1",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "ACSSUT": {
          "name": "ACSSUT",
          "title": "ACSSUT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 140,
          "alias": "ACSSUT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "AKSSUT": {
          "name": "AKSSUT",
          "title": "AKSSUT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 141,
          "alias": "AKSSUT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "ACKSSUT": {
          "name": "ACKSSUT",
          "title": "ACKSSUT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 142,
          "alias": "ACKSSUT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MDR_A_SSUT": {
          "name": "MDR_A_SSUT",
          "title": "MDR_A_SSUT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 143,
          "alias": "MDR_A_SSUT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "EXCLUSION": {
          "name": "EXCLUSION",
          "title": "EXCLUSION",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 144,
          "alias": "EXCLUSION",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RAMINOGLY": {
          "name": "RAMINOGLY",
          "title": "RAMINOGLY",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 145,
          "alias": "RAMINOGLY",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RBETALACTAM": {
          "name": "RBETALACTAM",
          "title": "RBETALACTAM",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 146,
          "alias": "RBETALACTAM",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RQUINOLONES": {
          "name": "RQUINOLONES",
          "title": "RQUINOLONES",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 147,
          "alias": "RQUINOLONES",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "RFOLINHIBITOR": {
          "name": "RFOLINHIBITOR",
          "title": "RFOLINHIBITOR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 148,
          "alias": "RFOLINHIBITOR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "MDR": {
          "name": "MDR",
          "title": "MDR",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 149,
          "alias": "MDR",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "specimen_number": {
          "name": "specimen_number",
          "title": "specimen_number",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 150,
          "alias": "specimen_number",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "EXTERNAL_AGENT": {
          "name": "EXTERNAL_AGENT",
          "title": "EXTERNAL_AGENT",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 151,
          "alias": "EXTERNAL_AGENT",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "FARM_FLAG": {
          "name": "FARM_FLAG",
          "title": "FARM_FLAG",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 152,
          "alias": "FARM_FLAG",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
        },
        "AMIKACINGELET": {
          "name": "AMIKACINGELET",
          "title": "AMIKACINGELET",
          "from_schema": "https://example.com/PHAC_Dexa",
          "rank": 153,
          "alias": "AMIKACINGELET",
          "owner": "PHAC Dexa",
          "slot_group": "Fields to put in sections",
          "range": "WhitespaceMinimizedString"
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