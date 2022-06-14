var SCHEMA = {
  "name": "GRDI",
  "description": "",
  "id": "https://example.com/GRDI",
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
  "default_prefix": "https://example.com/GRDI/",
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
    "purpose_of_sampling menu": {
      "name": "purpose_of_sampling menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Cluster/Outbreak investigation": {
          "text": "Cluster/Outbreak investigation"
        },
        "Diagnostic testing": {
          "text": "Diagnostic testing"
        },
        "Research": {
          "text": "Research"
        },
        "Surveillance": {
          "text": "Surveillance"
        },
        "Monitoring": {
          "text": "Monitoring"
        },
        "Field experiment": {
          "text": "Field experiment"
        },
        "Clinical trial": {
          "text": "Clinical trial"
        },
        "Environmental testing": {
          "text": "Environmental testing"
        }
      }
    },
    "purpose_of_sequencing menu": {
      "name": "purpose_of_sequencing menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Cluster/Outbreak investigation": {
          "text": "Cluster/Outbreak investigation"
        },
        "Diagnostic testing": {
          "text": "Diagnostic testing"
        },
        "Research": {
          "text": "Research"
        },
        "Surveillance": {
          "text": "Surveillance"
        },
        "Monitoring": {
          "text": "Monitoring"
        },
        "Field experiment": {
          "text": "Field experiment"
        },
        "Clinical trial": {
          "text": "Clinical trial"
        },
        "Environmental testing": {
          "text": "Environmental testing"
        }
      }
    },
    "sample_processing menu": {
      "name": "sample_processing menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Samples pooled": {
          "text": "Samples pooled"
        },
        "Isolated from single source": {
          "text": "Isolated from single source"
        }
      }
    },
    "attribute_package menu": {
      "name": "attribute_package menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Pathogen.cl": {
          "text": "Pathogen.cl"
        },
        "Pathogen.env": {
          "text": "Pathogen.env"
        }
      }
    },
    "stage_of_production menu": {
      "name": "stage_of_production menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "abattoir": {
          "text": "abattoir"
        }
      }
    },
    "sequencing_platform menu": {
      "name": "sequencing_platform menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Illumina": {
          "text": "Illumina"
        },
        "Pacific Biosciences": {
          "text": "Pacific Biosciences"
        },
        "Ion Torrent": {
          "text": "Ion Torrent"
        },
        "Oxford Nanopore Technologies": {
          "text": "Oxford Nanopore Technologies"
        },
        "BGI Genomics": {
          "text": "BGI Genomics"
        },
        "MGI": {
          "text": "MGI"
        }
      }
    },
    "sequencing_instrument menu": {
      "name": "sequencing_instrument menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Illumina": {
          "text": "Illumina"
        },
        "Illumina Genome Analyzer": {
          "text": "Illumina Genome Analyzer",
          "is_a": "Illumina"
        },
        "Illumina Genome Analyzer II": {
          "text": "Illumina Genome Analyzer II",
          "is_a": "Illumina"
        },
        "Illumina Genome Analyzer IIx": {
          "text": "Illumina Genome Analyzer IIx",
          "is_a": "Illumina"
        },
        "Illumina HiScanSQ": {
          "text": "Illumina HiScanSQ",
          "is_a": "Illumina"
        },
        "Illumina HiSeq": {
          "text": "Illumina HiSeq",
          "is_a": "Illumina"
        },
        "Illumina HiSeq X": {
          "text": "Illumina HiSeq X",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq X Five": {
          "text": "Illumina HiSeq X Five",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq X Ten": {
          "text": "Illumina HiSeq X Ten",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 1000": {
          "text": "Illumina HiSeq 1000",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 1500": {
          "text": "Illumina HiSeq 1500",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 2000": {
          "text": "Illumina HiSeq 2000",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 2500": {
          "text": "Illumina HiSeq 2500",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 3000": {
          "text": "Illumina HiSeq 3000",
          "is_a": "Illumina HiSeq"
        },
        "Illumina HiSeq 4000": {
          "text": "Illumina HiSeq 4000",
          "is_a": "Illumina HiSeq"
        },
        "Illumina iSeq": {
          "text": "Illumina iSeq",
          "is_a": "Illumina"
        },
        "Illumina iSeq 100": {
          "text": "Illumina iSeq 100",
          "is_a": "Illumina iSeq"
        },
        "Illumina NovaSeq": {
          "text": "Illumina NovaSeq",
          "is_a": "Illumina"
        },
        "Illumina NovaSeq 6000": {
          "text": "Illumina NovaSeq 6000",
          "is_a": "Illumina NovaSeq"
        },
        "Illumina MiniSeq": {
          "text": "Illumina MiniSeq",
          "is_a": "Illumina"
        },
        "Illumina MiSeq": {
          "text": "Illumina MiSeq",
          "is_a": "Illumina"
        },
        "Illumina NextSeq": {
          "text": "Illumina NextSeq",
          "is_a": "Illumina"
        },
        "Illumina NextSeq 500": {
          "text": "Illumina NextSeq 500",
          "is_a": "Illumina NextSeq"
        },
        "Illumina NextSeq 550": {
          "text": "Illumina NextSeq 550",
          "is_a": "Illumina NextSeq"
        },
        "Illumina NextSeq 2000": {
          "text": "Illumina NextSeq 2000",
          "is_a": "Illumina NextSeq"
        },
        "PacBio": {
          "text": "PacBio"
        },
        "PacBio RS": {
          "text": "PacBio RS",
          "is_a": "PacBio"
        },
        "PacBio RS II": {
          "text": "PacBio RS II",
          "is_a": "PacBio"
        },
        "PacBio Sequel": {
          "text": "PacBio Sequel",
          "is_a": "PacBio"
        },
        "PacBio Sequel II": {
          "text": "PacBio Sequel II",
          "is_a": "PacBio"
        },
        "Ion Torrent": {
          "text": "Ion Torrent"
        },
        "Ion Torrent PGM": {
          "text": "Ion Torrent PGM",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent Proton": {
          "text": "Ion Torrent Proton",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent S5 XL": {
          "text": "Ion Torrent S5 XL",
          "is_a": "Ion Torrent"
        },
        "Ion Torrent S5": {
          "text": "Ion Torrent S5",
          "is_a": "Ion Torrent"
        },
        "Oxford Nanopore": {
          "text": "Oxford Nanopore"
        },
        "Oxford Nanopore GridION": {
          "text": "Oxford Nanopore GridION",
          "is_a": "Oxford Nanopore"
        },
        "Oxford Nanopore MinION": {
          "text": "Oxford Nanopore MinION",
          "is_a": "Oxford Nanopore"
        },
        "Oxford Nanopore PromethION": {
          "text": "Oxford Nanopore PromethION",
          "is_a": "Oxford Nanopore"
        },
        "BGISEQ": {
          "text": "BGISEQ"
        },
        "BGISEQ-500": {
          "text": "BGISEQ-500",
          "is_a": "BGISEQ"
        },
        "DNBSEQ": {
          "text": "DNBSEQ"
        },
        "DNBSEQ-T7": {
          "text": "DNBSEQ-T7",
          "is_a": "DNBSEQ"
        },
        "DNBSEQ-G400": {
          "text": "DNBSEQ-G400",
          "is_a": "DNBSEQ"
        },
        "DNBSEQ-G400 FAST": {
          "text": "DNBSEQ-G400 FAST",
          "is_a": "DNBSEQ"
        },
        "DNBSEQ-G50": {
          "text": "DNBSEQ-G50",
          "is_a": "DNBSEQ"
        }
      }
    },
    "experimental_activity menu": {
      "name": "experimental_activity menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Antimicrobial pre-treatment": {
          "text": "Antimicrobial pre-treatment"
        },
        "Probiotic pre-treatment": {
          "text": "Probiotic pre-treatment"
        },
        "Microbial pre-treatment": {
          "text": "Microbial pre-treatment"
        },
        "Genetic mutation": {
          "text": "Genetic mutation"
        }
      }
    },
    "experimental_intervention menu": {
      "name": "experimental_intervention menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Addition of substances to food/water": {
          "text": "Addition of substances to food/water"
        },
        "Administration of drug": {
          "text": "Administration of drug"
        },
        "Administration of probiotic": {
          "text": "Administration of probiotic"
        },
        "Change in storage conditions": {
          "text": "Change in storage conditions"
        },
        "Cleaning/disinfection": {
          "text": "Cleaning/disinfection"
        },
        "Extended downtime between activities": {
          "text": "Extended downtime between activities"
        },
        "Logistic slaughter": {
          "text": "Logistic slaughter"
        },
        "Vaccination": {
          "text": "Vaccination"
        }
      }
    },
    "geo_loc_name (state/province/region) menu": {
      "name": "geo_loc_name (state/province/region) menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Alberta": {
          "text": "Alberta"
        },
        "British Columbia": {
          "text": "British Columbia"
        },
        "Manitoba": {
          "text": "Manitoba"
        },
        "New Brunswick": {
          "text": "New Brunswick"
        },
        "Newfoundland and Labrador": {
          "text": "Newfoundland and Labrador"
        },
        "Northwest Territories": {
          "text": "Northwest Territories"
        },
        "Nova Scotia": {
          "text": "Nova Scotia"
        },
        "Nunavut": {
          "text": "Nunavut"
        },
        "Ontario": {
          "text": "Ontario"
        },
        "Prince Edward Island": {
          "text": "Prince Edward Island"
        },
        "Quebec": {
          "text": "Quebec"
        },
        "Saskatchewan": {
          "text": "Saskatchewan"
        },
        "Yukon": {
          "text": "Yukon"
        }
      }
    },
    "geo_loc_name (country) menu": {
      "name": "geo_loc_name (country) menu",
      "from_schema": "https://example.com/GRDI",
      "permissible_values": {
        "Afghanistan": {
          "text": "Afghanistan"
        },
        "Albania": {
          "text": "Albania"
        },
        "Algeria": {
          "text": "Algeria"
        },
        "American Samoa": {
          "text": "American Samoa"
        },
        "Andorra": {
          "text": "Andorra"
        },
        "Angola": {
          "text": "Angola"
        },
        "Anguilla": {
          "text": "Anguilla"
        },
        "Antarctica": {
          "text": "Antarctica"
        },
        "Antigua and Barbuda": {
          "text": "Antigua and Barbuda"
        },
        "Argentina": {
          "text": "Argentina"
        },
        "Armenia": {
          "text": "Armenia"
        },
        "Aruba": {
          "text": "Aruba"
        },
        "Ashmore and Cartier Islands": {
          "text": "Ashmore and Cartier Islands"
        },
        "Australia": {
          "text": "Australia"
        },
        "Austria": {
          "text": "Austria"
        },
        "Azerbaijan": {
          "text": "Azerbaijan"
        },
        "Bahamas": {
          "text": "Bahamas"
        },
        "Bahrain": {
          "text": "Bahrain"
        },
        "Baker Island": {
          "text": "Baker Island"
        },
        "Bangladesh": {
          "text": "Bangladesh"
        },
        "Barbados": {
          "text": "Barbados"
        },
        "Bassas da India": {
          "text": "Bassas da India"
        },
        "Belarus": {
          "text": "Belarus"
        },
        "Belgium": {
          "text": "Belgium"
        },
        "Belize": {
          "text": "Belize"
        },
        "Benin": {
          "text": "Benin"
        },
        "Bermuda": {
          "text": "Bermuda"
        },
        "Bhutan": {
          "text": "Bhutan"
        },
        "Bolivia": {
          "text": "Bolivia"
        },
        "Borneo": {
          "text": "Borneo"
        },
        "Bosnia and Herzegovina": {
          "text": "Bosnia and Herzegovina"
        },
        "Botswana": {
          "text": "Botswana"
        },
        "Bouvet Island": {
          "text": "Bouvet Island"
        },
        "Brazil": {
          "text": "Brazil"
        },
        "British Virgin Islands": {
          "text": "British Virgin Islands"
        },
        "Brunei": {
          "text": "Brunei"
        },
        "Bulgaria": {
          "text": "Bulgaria"
        },
        "Burkina Faso": {
          "text": "Burkina Faso"
        },
        "Burundi": {
          "text": "Burundi"
        },
        "Cambodia": {
          "text": "Cambodia"
        },
        "Cameroon": {
          "text": "Cameroon"
        },
        "Canada": {
          "text": "Canada"
        },
        "Cape Verde": {
          "text": "Cape Verde"
        },
        "Cayman Islands": {
          "text": "Cayman Islands"
        },
        "Central African Republic": {
          "text": "Central African Republic"
        },
        "Chad": {
          "text": "Chad"
        },
        "Chile": {
          "text": "Chile"
        },
        "China": {
          "text": "China"
        },
        "Christmas Island": {
          "text": "Christmas Island"
        },
        "Clipperton Island": {
          "text": "Clipperton Island"
        },
        "Cocos Islands": {
          "text": "Cocos Islands"
        },
        "Colombia": {
          "text": "Colombia"
        },
        "Comoros": {
          "text": "Comoros"
        },
        "Cook Islands": {
          "text": "Cook Islands"
        },
        "Coral Sea Islands": {
          "text": "Coral Sea Islands"
        },
        "Costa Rica": {
          "text": "Costa Rica"
        },
        "Cote d'Ivoire": {
          "text": "Cote d'Ivoire"
        },
        "Croatia": {
          "text": "Croatia"
        },
        "Cuba": {
          "text": "Cuba"
        },
        "Curacao": {
          "text": "Curacao"
        },
        "Cyprus": {
          "text": "Cyprus"
        },
        "Czech Republic": {
          "text": "Czech Republic"
        },
        "Democratic Republic of the Congo": {
          "text": "Democratic Republic of the Congo"
        },
        "Denmark": {
          "text": "Denmark"
        },
        "Djibouti": {
          "text": "Djibouti"
        },
        "Dominica": {
          "text": "Dominica"
        },
        "Dominican Republic": {
          "text": "Dominican Republic"
        },
        "Ecuador": {
          "text": "Ecuador"
        },
        "Egypt": {
          "text": "Egypt"
        },
        "El Salvador": {
          "text": "El Salvador"
        },
        "Equatorial Guinea": {
          "text": "Equatorial Guinea"
        },
        "Eritrea": {
          "text": "Eritrea"
        },
        "Estonia": {
          "text": "Estonia"
        },
        "Eswatini": {
          "text": "Eswatini"
        },
        "Ethiopia": {
          "text": "Ethiopia"
        },
        "Europa Island": {
          "text": "Europa Island"
        },
        "Falkland Islands (Islas Malvinas)": {
          "text": "Falkland Islands (Islas Malvinas)"
        },
        "Faroe Islands": {
          "text": "Faroe Islands"
        },
        "Fiji": {
          "text": "Fiji"
        },
        "Finland": {
          "text": "Finland"
        },
        "France": {
          "text": "France"
        },
        "French Guiana": {
          "text": "French Guiana"
        },
        "French Polynesia": {
          "text": "French Polynesia"
        },
        "French Southern and Antarctic Lands": {
          "text": "French Southern and Antarctic Lands"
        },
        "Gabon": {
          "text": "Gabon"
        },
        "Gambia": {
          "text": "Gambia"
        },
        "Gaza Strip": {
          "text": "Gaza Strip"
        },
        "Georgia": {
          "text": "Georgia"
        },
        "Germany": {
          "text": "Germany"
        },
        "Ghana": {
          "text": "Ghana"
        },
        "Gibraltar": {
          "text": "Gibraltar"
        },
        "Glorioso Islands": {
          "text": "Glorioso Islands"
        },
        "Greece": {
          "text": "Greece"
        },
        "Greenland": {
          "text": "Greenland"
        },
        "Grenada": {
          "text": "Grenada"
        },
        "Guadeloupe": {
          "text": "Guadeloupe"
        },
        "Guam": {
          "text": "Guam"
        },
        "Guatemala": {
          "text": "Guatemala"
        },
        "Guernsey": {
          "text": "Guernsey"
        },
        "Guinea": {
          "text": "Guinea"
        },
        "Guinea-Bissau": {
          "text": "Guinea-Bissau"
        },
        "Guyana": {
          "text": "Guyana"
        },
        "Haiti": {
          "text": "Haiti"
        },
        "Heard Island and McDonald Islands": {
          "text": "Heard Island and McDonald Islands"
        },
        "Honduras": {
          "text": "Honduras"
        },
        "Hong Kong": {
          "text": "Hong Kong"
        },
        "Howland Island": {
          "text": "Howland Island"
        },
        "Hungary": {
          "text": "Hungary"
        },
        "Iceland": {
          "text": "Iceland"
        },
        "India": {
          "text": "India"
        },
        "Indonesia": {
          "text": "Indonesia"
        },
        "Iran": {
          "text": "Iran"
        },
        "Iraq": {
          "text": "Iraq"
        },
        "Ireland": {
          "text": "Ireland"
        },
        "Isle of Man": {
          "text": "Isle of Man"
        },
        "Israel": {
          "text": "Israel"
        },
        "Italy": {
          "text": "Italy"
        },
        "Jamaica": {
          "text": "Jamaica"
        },
        "Jan Mayen": {
          "text": "Jan Mayen"
        },
        "Japan": {
          "text": "Japan"
        },
        "Jarvis Island": {
          "text": "Jarvis Island"
        },
        "Jersey": {
          "text": "Jersey"
        },
        "Johnston Atoll": {
          "text": "Johnston Atoll"
        },
        "Jordan": {
          "text": "Jordan"
        },
        "Juan de Nova Island": {
          "text": "Juan de Nova Island"
        },
        "Kazakhstan": {
          "text": "Kazakhstan"
        },
        "Kenya": {
          "text": "Kenya"
        },
        "Kerguelen Archipelago": {
          "text": "Kerguelen Archipelago"
        },
        "Kingman Reef": {
          "text": "Kingman Reef"
        },
        "Kiribati": {
          "text": "Kiribati"
        },
        "Kosovo": {
          "text": "Kosovo"
        },
        "Kuwait": {
          "text": "Kuwait"
        },
        "Kyrgyzstan": {
          "text": "Kyrgyzstan"
        },
        "Laos": {
          "text": "Laos"
        },
        "Latvia": {
          "text": "Latvia"
        },
        "Lebanon": {
          "text": "Lebanon"
        },
        "Lesotho": {
          "text": "Lesotho"
        },
        "Liberia": {
          "text": "Liberia"
        },
        "Libya": {
          "text": "Libya"
        },
        "Liechtenstein": {
          "text": "Liechtenstein"
        },
        "Line Islands": {
          "text": "Line Islands"
        },
        "Lithuania": {
          "text": "Lithuania"
        },
        "Luxembourg": {
          "text": "Luxembourg"
        },
        "Macau": {
          "text": "Macau"
        },
        "Madagascar": {
          "text": "Madagascar"
        },
        "Malawi": {
          "text": "Malawi"
        },
        "Malaysia": {
          "text": "Malaysia"
        },
        "Maldives": {
          "text": "Maldives"
        },
        "Mali": {
          "text": "Mali"
        },
        "Malta": {
          "text": "Malta"
        },
        "Marshall Islands": {
          "text": "Marshall Islands"
        },
        "Martinique": {
          "text": "Martinique"
        },
        "Mauritania": {
          "text": "Mauritania"
        },
        "Mauritius": {
          "text": "Mauritius"
        },
        "Mayotte": {
          "text": "Mayotte"
        },
        "Mexico": {
          "text": "Mexico"
        },
        "Micronesia": {
          "text": "Micronesia"
        },
        "Midway Islands": {
          "text": "Midway Islands"
        },
        "Moldova": {
          "text": "Moldova"
        },
        "Monaco": {
          "text": "Monaco"
        },
        "Mongolia": {
          "text": "Mongolia"
        },
        "Montenegro": {
          "text": "Montenegro"
        },
        "Montserrat": {
          "text": "Montserrat"
        },
        "Morocco": {
          "text": "Morocco"
        },
        "Mozambique": {
          "text": "Mozambique"
        },
        "Myanmar": {
          "text": "Myanmar"
        },
        "Namibia": {
          "text": "Namibia"
        },
        "Nauru": {
          "text": "Nauru"
        },
        "Navassa Island": {
          "text": "Navassa Island"
        },
        "Nepal": {
          "text": "Nepal"
        },
        "Netherlands": {
          "text": "Netherlands"
        },
        "New Caledonia": {
          "text": "New Caledonia"
        },
        "New Zealand": {
          "text": "New Zealand"
        },
        "Nicaragua": {
          "text": "Nicaragua"
        },
        "Niger": {
          "text": "Niger"
        },
        "Nigeria": {
          "text": "Nigeria"
        },
        "Niue": {
          "text": "Niue"
        },
        "Norfolk Island": {
          "text": "Norfolk Island"
        },
        "North Korea": {
          "text": "North Korea"
        },
        "North Macedonia": {
          "text": "North Macedonia"
        },
        "North Sea": {
          "text": "North Sea"
        },
        "Northern Mariana Islands": {
          "text": "Northern Mariana Islands"
        },
        "Norway": {
          "text": "Norway"
        },
        "Oman": {
          "text": "Oman"
        },
        "Pakistan": {
          "text": "Pakistan"
        },
        "Palau": {
          "text": "Palau"
        },
        "Panama": {
          "text": "Panama"
        },
        "Papua New Guinea": {
          "text": "Papua New Guinea"
        },
        "Paracel Islands": {
          "text": "Paracel Islands"
        },
        "Paraguay": {
          "text": "Paraguay"
        },
        "Peru": {
          "text": "Peru"
        },
        "Philippines": {
          "text": "Philippines"
        },
        "Pitcairn Islands": {
          "text": "Pitcairn Islands"
        },
        "Poland": {
          "text": "Poland"
        },
        "Portugal": {
          "text": "Portugal"
        },
        "Puerto Rico": {
          "text": "Puerto Rico"
        },
        "Qatar": {
          "text": "Qatar"
        },
        "Republic of the Congo": {
          "text": "Republic of the Congo"
        },
        "Reunion": {
          "text": "Reunion"
        },
        "Romania": {
          "text": "Romania"
        },
        "Ross Sea": {
          "text": "Ross Sea"
        },
        "Russia": {
          "text": "Russia"
        },
        "Rwanda": {
          "text": "Rwanda"
        },
        "Saint Helena": {
          "text": "Saint Helena"
        },
        "Saint Kitts and Nevis": {
          "text": "Saint Kitts and Nevis"
        },
        "Saint Lucia": {
          "text": "Saint Lucia"
        },
        "Saint Pierre and Miquelon": {
          "text": "Saint Pierre and Miquelon"
        },
        "Saint Martin": {
          "text": "Saint Martin"
        },
        "Saint Vincent and the Grenadines": {
          "text": "Saint Vincent and the Grenadines"
        },
        "Samoa": {
          "text": "Samoa"
        },
        "San Marino": {
          "text": "San Marino"
        },
        "Sao Tome and Principe": {
          "text": "Sao Tome and Principe"
        },
        "Saudi Arabia": {
          "text": "Saudi Arabia"
        },
        "Senegal": {
          "text": "Senegal"
        },
        "Serbia": {
          "text": "Serbia"
        },
        "Seychelles": {
          "text": "Seychelles"
        },
        "Sierra Leone": {
          "text": "Sierra Leone"
        },
        "Singapore": {
          "text": "Singapore"
        },
        "Sint Maarten": {
          "text": "Sint Maarten"
        },
        "Slovakia": {
          "text": "Slovakia"
        },
        "Slovenia": {
          "text": "Slovenia"
        },
        "Solomon Islands": {
          "text": "Solomon Islands"
        },
        "Somalia": {
          "text": "Somalia"
        },
        "South Africa": {
          "text": "South Africa"
        },
        "South Georgia and the South Sandwich Islands": {
          "text": "South Georgia and the South Sandwich Islands"
        },
        "South Korea": {
          "text": "South Korea"
        },
        "South Sudan": {
          "text": "South Sudan"
        },
        "Spain": {
          "text": "Spain"
        },
        "Spratly Islands": {
          "text": "Spratly Islands"
        },
        "Sri Lanka": {
          "text": "Sri Lanka"
        },
        "State of Palestine": {
          "text": "State of Palestine"
        },
        "Sudan": {
          "text": "Sudan"
        },
        "Suriname": {
          "text": "Suriname"
        },
        "Svalbard": {
          "text": "Svalbard"
        },
        "Swaziland": {
          "text": "Swaziland"
        },
        "Sweden": {
          "text": "Sweden"
        },
        "Switzerland": {
          "text": "Switzerland"
        },
        "Syria": {
          "text": "Syria"
        },
        "Taiwan": {
          "text": "Taiwan"
        },
        "Tajikistan": {
          "text": "Tajikistan"
        },
        "Tanzania": {
          "text": "Tanzania"
        },
        "Thailand": {
          "text": "Thailand"
        },
        "Timor-Leste": {
          "text": "Timor-Leste"
        },
        "Togo": {
          "text": "Togo"
        },
        "Tokelau": {
          "text": "Tokelau"
        },
        "Tonga": {
          "text": "Tonga"
        },
        "Trinidad and Tobago": {
          "text": "Trinidad and Tobago"
        },
        "Tromelin Island": {
          "text": "Tromelin Island"
        },
        "Tunisia": {
          "text": "Tunisia"
        },
        "Turkey": {
          "text": "Turkey"
        },
        "Turkmenistan": {
          "text": "Turkmenistan"
        },
        "Turks and Caicos Islands": {
          "text": "Turks and Caicos Islands"
        },
        "Tuvalu": {
          "text": "Tuvalu"
        },
        "United States of America": {
          "text": "United States of America"
        },
        "Uganda": {
          "text": "Uganda"
        },
        "Ukraine": {
          "text": "Ukraine"
        },
        "United Arab Emirates": {
          "text": "United Arab Emirates"
        },
        "United Kingdom": {
          "text": "United Kingdom"
        },
        "Uruguay": {
          "text": "Uruguay"
        },
        "Uzbekistan": {
          "text": "Uzbekistan"
        },
        "Vanuatu": {
          "text": "Vanuatu"
        },
        "Venezuela": {
          "text": "Venezuela"
        },
        "Viet Nam": {
          "text": "Viet Nam"
        },
        "Virgin Islands": {
          "text": "Virgin Islands"
        },
        "Wake Island": {
          "text": "Wake Island"
        },
        "Wallis and Futuna": {
          "text": "Wallis and Futuna"
        },
        "West Bank": {
          "text": "West Bank"
        },
        "Western Sahara": {
          "text": "Western Sahara"
        },
        "Yemen": {
          "text": "Yemen"
        },
        "Zambia": {
          "text": "Zambia"
        },
        "Zimbabwe": {
          "text": "Zimbabwe"
        }
      }
    }
  },
  "slots": {
    "sample_collector_sample_ID": {
      "name": "sample_collector_sample_ID",
      "description": "The user-defined name for the sample.",
      "title": "sample_collector_sample_ID",
      "comments": [
        "The sample_ID should represent the identifier assigned to the sample at time of collection, for which all the descriptive information applies. If the original sample_ID is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "ABCD123"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001123",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "alternative_sample_ID": {
      "name": "alternative_sample_ID",
      "description": "An alternative sample_ID assigned to the sample by another organization.",
      "title": "alternative_sample_ID",
      "comments": [
        "Provide any alternative identifiers for the sample here, separated by commas. Alternative identifiers assigned to the sample should be tracked along with original IDs to establish chain of custody. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "bvn5567, RA1-HH789"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "sample_collected_by": {
      "name": "sample_collected_by",
      "description": "The name of the agency, organization or institution with which the sample collector is affiliated.",
      "title": "sample_collected_by",
      "comments": [
        "Provide the name of the agency, organization or institution that collected the sample in full (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Public Health Agency of Canada"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001153",
      "range": "WhitespaceMinimizedString"
    },
    "collected_by_laboratory_name": {
      "name": "collected_by_laboratory_name",
      "description": "The specific laboratory affiliation of the sample collector.",
      "title": "collected_by_laboratory_name",
      "comments": [
        "Provide the name of the specific laboratory that collected the sample (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Topp Lab"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sample_collection_project_name": {
      "name": "sample_collection_project_name",
      "description": "The name of the project/initiative/program for which the sample was collected.",
      "title": "sample_collection_project_name",
      "comments": [
        "Provide the name of the project and/or the project ID here. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Watershed Project (HA-120)"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sample_plan_name": {
      "name": "sample_plan_name",
      "description": "The name of the study design for a surveillance project.",
      "title": "sample_plan_name",
      "comments": [
        "Provide the name of the sample plan used for sample collection. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "National Microbiological Baseline Study in Broiler Chicken"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "sample_plan_ID": {
      "name": "sample_plan_ID",
      "description": "The identifier of the study design for a surveillance project.",
      "title": "sample_plan_ID",
      "comments": [
        "Provide the identifier of the sample plan used for sample collection. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "2001_M205"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "sample_collector_contact_name": {
      "name": "sample_collector_contact_name",
      "description": "The name or job title of the contact responsible for follow-up regarding the sample.",
      "title": "sample_collector_contact_name",
      "comments": [
        "Provide the name of an individual or their job title. As personnel turnover may render the contact's name obsolete, it is more preferable to provide a job title for ensuring accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Enterics Lab Manager"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sample_collector_contact_email": {
      "name": "sample_collector_contact_email",
      "description": "The email address of the contact responsible for follow-up regarding the sample.",
      "title": "sample_collector_contact_email",
      "comments": [
        "Provide the email associated with the listed contact. As personnel turnover may render an individual's email obsolete, it is more preferable to provide an address for a position or lab, to ensure accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "johnnyblogs@lab.ca"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "purpose_of_sampling": {
      "name": "purpose_of_sampling",
      "description": "The reason that the sample was collected.",
      "title": "purpose_of_sampling",
      "comments": [
        "The reason a sample was collected may provide information about potential biases in sampling strategy. Provide the purpose of sampling from the picklist in the template. Most likely, the sample was collected for Diagnostic testing. The reason why a sample was originally collected may differ from the reason why it was selected for sequencing, which should be indicated in the \"purpose of sequencing\" field."
      ],
      "examples": [
        {
          "value": "Surveillance"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001198",
      "range": "purpose_of_sampling menu",
      "required": true
    },
    "experimental_activity": {
      "name": "experimental_activity",
      "description": "The experimental activities or variables that affected the sample collected.",
      "title": "experimental_activity",
      "comments": [
        "If there was experimental activity that would affect the sample prior to collection (this is different than sample processing), provide the experimental activities by selecting one or more values from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Antimicrobial Pre-treatment"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "experimental_activity menu"
    },
    "experimental_activity_details": {
      "name": "experimental_activity_details",
      "description": "The details of the experimental activities or variables that affected the sample collected.",
      "title": "experimental_activity_details",
      "comments": [
        "Briefly describe the experimental details using free text."
      ],
      "examples": [
        {
          "value": "Chicken feed containing X amount of novobiocin was fed to chickens for 72 hours prior to collection of litter."
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sample_processing": {
      "name": "sample_processing",
      "description": "The processing applied to samples post-collection, prior to further testing, characterization, or isolation procedures.",
      "title": "sample_processing",
      "comments": [
        "Provide the sample processing information by selecting a value from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Samples pooled"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "sample_processing menu"
    },
    "geo_loc_name (country)": {
      "name": "geo_loc_name (country)",
      "description": "The country of origin of the sample.",
      "title": "geo_loc_name (country)",
      "comments": [
        "Provide the name of the country where the sample was collected. Use the controlled vocabulary provided in the template pick list.  If the information is unknown or cannot be provided, provide a null value."
      ],
      "examples": [
        {
          "value": "Canada"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001181",
      "range": "geo_loc_name (country) menu",
      "required": true
    },
    "geo_loc_name (state/province/region)": {
      "name": "geo_loc_name (state/province/region)",
      "description": "The state/province/territory of origin of the sample.",
      "title": "geo_loc_name (state/province/region)",
      "comments": [
        "Provide the name of the province/state/region where the sample was collected.  If the information is unknown or cannot be provided, provide a null value."
      ],
      "examples": [
        {
          "value": "British Columbia"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001185",
      "range": "geo_loc_name (state/province/region) menu",
      "required": true
    },
    "food_product_origin geo_loc_name (country)": {
      "name": "food_product_origin geo_loc_name (country)",
      "description": "The country of origin of a food product.",
      "title": "food_product_origin geo_loc_name (country)",
      "comments": [
        "If a food product was sampled and the food product was manufactured outside of Canada, provide the name of the country where the food product originated by selecting a value from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "United States of America"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "geo_loc_name (country) menu"
    },
    "host_origin geo_loc_name (country)": {
      "name": "host_origin geo_loc_name (country)",
      "description": "The country of origin of the host.",
      "title": "host_origin geo_loc_name (country)",
      "comments": [
        "If a sample is from a human or animal host that originated from outside of Canada, provide the the name of the country where the host originated by selecting a value from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "South Africa"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "geo_loc_name (country) menu"
    },
    "latitude_of_sample_collection": {
      "name": "latitude_of_sample_collection",
      "description": "The latitude coordinates of the geographical location of sample collection.",
      "title": "latitude_of_sample_collection",
      "comments": [
        "If known, provide the degrees latitude.  Do NOT simply provide latitude of the institution if this is not where the sample was collected, nor the centre of the city/region where the sample was collected as this falsely implicates an existing geographical location and creates data inaccuracies. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "38.98 N"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0100309",
      "range": "WhitespaceMinimizedString"
    },
    "longitude_of_sample_collection": {
      "name": "longitude_of_sample_collection",
      "description": "The longitude coordinates of the geographical location of sample collection.",
      "title": "longitude_of_sample_collection",
      "comments": [
        "If known, provide the degrees longitude.  Do NOT simply provide longitude of the institution if this is not where the sample was collected, nor the centre of the city/region where the sample was collected as this falsely implicates an existing geographical location and creates data inaccuracies. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "77.11 W"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0100310",
      "range": "WhitespaceMinimizedString"
    },
    "sample_collection_date": {
      "name": "sample_collection_date",
      "description": "The date on which the sample was collected.",
      "title": "sample_collection_date",
      "comments": [
        "Provide the date according to the ISO 8601 standard \"YYYY-MM-DD\", \"YYYY-MM\" or \"YYYY\"."
      ],
      "examples": [
        {
          "value": "2020-10-30"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001174",
      "range": "date",
      "required": true
    },
    "sample_received_date": {
      "name": "sample_received_date",
      "description": "The date on which the sample was received.",
      "title": "sample_received_date",
      "comments": [
        "Provide the date according to the ISO 8601 standard \"YYYY-MM-DD\", \"YYYY-MM\" or \"YYYY\"."
      ],
      "examples": [
        {
          "value": "2020-11-15"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001179",
      "range": "date"
    },
    "original_sample_description": {
      "name": "original_sample_description",
      "description": "The original sample description provided by the sample collector.",
      "title": "original_sample_description",
      "comments": [
        "Provide the sample description provided by the original sample collector. The original description is useful as it may provide further details, or can be used to clarify higher level classifications."
      ],
      "examples": [
        {
          "value": "RTE Prosciutto from deli"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "environmental_site": {
      "name": "environmental_site",
      "description": "An environmental location may describe a site in the natural or built environment e.g. hospital, wet market, bat cave.",
      "title": "environmental_site",
      "comments": [
        "If applicable, provide the standardized term and ontology ID for the environmental site. The standardized term can be sourced from these look-up services: https://www.ebi.ac.uk/ols/ontologies/envo or https://www.ebi.ac.uk/ols/ontologies/genepio."
      ],
      "examples": [
        {
          "value": "contact surface, production facility, floor drain, hatchery."
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001232",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "animal_or_plant_population": {
      "name": "animal_or_plant_population",
      "description": "The type of animal or plant population inhabiting an area.",
      "title": "animal_or_plant_population",
      "comments": [
        "This field should be used when a sample is taken from an environmental location inhabited by many individuals of a specific type, rather than describing a sample taken from one particular host. If applicable, provide the standardized term and ontology ID for the animal or plant population name. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/genepio. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "turkey"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "environmental_material": {
      "name": "environmental_material",
      "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage, door handle, bed handrail, face mask.",
      "title": "environmental_material",
      "comments": [
        "If applicable, provide the standardized term and ontology ID for the environmental material. The standardized term can be sourced from these look-up services: https://www.ebi.ac.uk/ols/ontologies/envo or https://www.ebi.ac.uk/ols/ontologies/genepio. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "soil, water, sewage, tractor"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001223",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "body_product": {
      "name": "body_product",
      "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
      "title": "body_product",
      "comments": [
        "If applicable, provide the standardized term and ontology ID for the body product. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/uberon. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "feces, urine, sweat."
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001216",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "anatomical_part": {
      "name": "anatomical_part",
      "description": "An anatomical part of an organism e.g. oropharynx.",
      "title": "anatomical_part",
      "comments": [
        "If applicable, provide the standardized term and ontology ID for the anatomical material. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/uberon. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "tissue, blood"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001214",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "food_product": {
      "name": "food_product",
      "description": "A material consumed and digested for nutritional value or enjoyment.",
      "title": "food_product",
      "comments": [
        "This field includes animal feed. If applicable, provide the standardized term and ontology ID for the anatomical material. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/foodon. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "feather and bone meal, chicken breast"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "food_product_properties": {
      "name": "food_product_properties",
      "description": "Any characteristic of the food product pertaining to its state, processing, a label claim, or implications for consumers.",
      "title": "food_product_properties",
      "comments": [
        "Provide any characteristics of the food product including whether it has been cooked, processed, preserved, any known information about its state (e.g. raw, ready-to-eat), any known information about its containment (e.g. canned), and any information about a label claim (e.g. organic, fat-free)."
      ],
      "examples": [
        {
          "value": "smoked, chopped, ready-to-eat"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "animal_source_of_food": {
      "name": "animal_source_of_food",
      "description": "The animal from which the food product was derived.",
      "title": "animal_source_of_food",
      "comments": [
        "Provide the common name of the animal. If not applicable, leave blank. Multiple entries can be provided, separated by a comma."
      ],
      "examples": [
        {
          "value": "chicken"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "food_packaging": {
      "name": "food_packaging",
      "description": "The type of packaging used to contain a food product.",
      "title": "food_packaging",
      "comments": [
        "If known, provide information regarding how the food product was packaged."
      ],
      "examples": [
        {
          "value": "box, tray"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "collection_device": {
      "name": "collection_device",
      "description": "The instrument or container used to collect the sample e.g. swab.",
      "title": "collection_device",
      "comments": [
        "This field includes animal feed. If applicable, provide the standardized term and ontology ID for the anatomical material. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/genepio. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "swab"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001234",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "collection_method": {
      "name": "collection_method",
      "description": "The process used to collect the sample e.g. phlebotomy, necropsy.",
      "title": "collection_method",
      "comments": [
        "If applicable, provide the standardized term and ontology ID for the anatomical material. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/genepio. If not applicable, leave blank."
      ],
      "examples": [
        {
          "value": "phlebotomy, necropsy, rinsing"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001241",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "host (common name)": {
      "name": "host (common name)",
      "description": "The commonly used name of the host.",
      "title": "host (common name)",
      "comments": [
        "If the sample is directly from a host, either a common or scientific name must be provided (although both can be included, if known).  If known, provide the common name."
      ],
      "examples": [
        {
          "value": "cow, chicken, human"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001386",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "host (scientific name)": {
      "name": "host (scientific name)",
      "description": "The taxonomic, or scientific name of the host.",
      "title": "host (scientific name)",
      "comments": [
        "If the sample is directly from a host, either a common or scientific name must be provided (although both can be included, if known).  If known, provide the scientific name. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/ncbitaxon."
      ],
      "examples": [
        {
          "value": "Bos taurus, Homo sapiens"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001387",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "host_disease": {
      "name": "host_disease",
      "description": "The name of the disease experienced by the host.",
      "title": "host_disease",
      "comments": [
        "This field is only required if the Pathogen.cl package was selected. If the host was sick, provide the name of the disease.The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/doid If the disease is not known, put “missing”."
      ],
      "examples": [
        {
          "value": "mastitis, gastroenteritis"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001391",
      "range": "WhitespaceMinimizedString"
    },
    "microbiological_method": {
      "name": "microbiological_method",
      "description": "The laboratory method used to grow, prepare, and/or isolate the microbial isolate.",
      "title": "microbiological_method",
      "comments": [
        "Provide the name and version number of the microbiological method. The ID of the method is also acceptable if the ID can be linked to the laboratory that created the procedure."
      ],
      "examples": [
        {
          "value": "MFHPB-30"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "strain": {
      "name": "strain",
      "description": "The strain identifier.",
      "title": "strain",
      "comments": [
        "If the isolate represents or is derived from, a lab reference strain or strain from a type culture collection, provide the strain identifier."
      ],
      "examples": [
        {
          "value": "K12"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "isolate_ID": {
      "name": "isolate_ID",
      "description": "The user-defined identifier for the isolate, as provided by the laboratory that originally isolated the isolate.",
      "title": "isolate_ID",
      "comments": [
        "Provide the isolate_ID created by the lab that first isolated the isolate (i.e. the original isolate ID). If the information is unknown or cannot be provided, leave blank or provide a null value. If only an alternate isolate ID is known (e.g. the ID from your lab, if your lab did not isolate the isolate from the original sample), make asure to include it in the alternative_isolate_ID field."
      ],
      "examples": [
        {
          "value": "SA20131043"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "alternative_isolate_ID": {
      "name": "alternative_isolate_ID",
      "description": "An alternative isolate_ID assigned to the isolate by another organization.",
      "title": "alternative_isolate_ID",
      "comments": [
        "If one or more alternative isolate_IDs are available, record them all here, separated by a comma."
      ],
      "examples": [
        {
          "value": "PHAC_45678"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "progeny_isolate_ID": {
      "name": "progeny_isolate_ID",
      "description": "The identifier assigned to a progenitor isolate derived from an isolate that was directly obtained from a sample.",
      "title": "progeny_isolate_ID",
      "comments": [
        "If your sequence data pertains to progeny of an original isolate, provide the progeny_isolate_ID."
      ],
      "examples": [
        {
          "value": "SUB_ON_1526"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "IRIDA_isolate_ID": {
      "name": "IRIDA_isolate_ID",
      "description": "The identifier of the isolate in the IRIDA platform.",
      "title": "IRIDA_isolate_ID",
      "comments": [
        "Provide the \"sample ID\" used to track information linked to the isolate in IRIDA. IRIDA sample IDs should be unqiue to avoid ID clash. This is very important in large Projects, especially when samples are shared from different organizations. Download the IRIDA sample ID and add it to the sample data in your spreadsheet as part of good data management practices."
      ],
      "examples": [
        {
          "value": "GRDI_LL_12345"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "IRIDA_project_ID": {
      "name": "IRIDA_project_ID",
      "description": "The identifier of the Project in the iRIDA platform.",
      "title": "IRIDA_project_ID",
      "comments": [
        "Provide the IRIDA \"project ID\"."
      ],
      "examples": [
        {
          "value": "666"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "isolated_by_institution_name": {
      "name": "isolated_by_institution_name",
      "description": "The name of the agency, organization or institution with which the individual who performed the isolation procedure is affiliated.",
      "title": "isolated_by_institution_name",
      "comments": [
        "Provide the name of the agency, organization or institution that isolated the original isolate in full (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Public Health Agency of Canada"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "isolated_by_laboratory_name": {
      "name": "isolated_by_laboratory_name",
      "description": "The specific laboratory affiliation of the individual who performed the isolation procedure.",
      "title": "isolated_by_laboratory_name",
      "comments": [
        "Provide the name of the specific laboratory that that isolated the original isolate (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Topp Lab"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "isolated_by_contact_name": {
      "name": "isolated_by_contact_name",
      "description": "The name or title of the contact responsible for follow-up regarding the isolate.",
      "title": "isolated_by_contact_name",
      "comments": [
        "Provide the name of an individual or their job title. As personnel turnover may render the contact's name obsolete, it is prefereable to provide a job title for ensuring accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Enterics Lab Manager"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "isolated_by_contact_email": {
      "name": "isolated_by_contact_email",
      "description": "The email address of the contact responsible for follow-up regarding the isolate.",
      "title": "isolated_by_contact_email",
      "comments": [
        "Provide the email associated with the listed contact. As personnel turnover may render an individual's email obsolete, it is more prefereable to provide an address for a position or lab, to ensure accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "enterics@lab.ca"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "isolation_date": {
      "name": "isolation_date",
      "description": "The date on which the isolate was isolated from a sample.",
      "title": "isolation_date",
      "comments": [
        "Provide the date according to the ISO 8601 standard \"YYYY-MM-DD\", \"YYYY-MM\" or \"YYYY\"."
      ],
      "examples": [
        {
          "value": "2020-10-30"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "date"
    },
    "isolate_received_date": {
      "name": "isolate_received_date",
      "description": "The date on which the isolate was received by the laboratory.",
      "title": "isolate_received_date",
      "comments": [
        "Provide the date according to the ISO 8601 standard \"YYYY-MM-DD\", \"YYYY-MM\" or \"YYYY\"."
      ],
      "examples": [
        {
          "value": "2020-11-15"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "organism": {
      "name": "organism",
      "description": "Taxonomic name of the organism.",
      "title": "organism",
      "comments": [
        "Put the genus and species (and subspecies if applicable) of the bacteria, if known. The standardized term can be sourced from this look-up service: https://www.ebi.ac.uk/ols/ontologies/ncbitaxon."
      ],
      "examples": [
        {
          "value": "Salmonella enterica subspecies enterica"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001191",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "serovar": {
      "name": "serovar",
      "description": "The serovar of the organism.",
      "title": "serovar",
      "comments": [
        "Only include this information if it has been determined by traditional serological methods or a validated in silico prediction tool e.g. SISTR."
      ],
      "examples": [
        {
          "value": "Heidelberg"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "serotyping_method": {
      "name": "serotyping_method",
      "description": "The method used to determine the serovar.",
      "title": "serotyping_method",
      "comments": [
        "If the serovar was determined via traditional serotyping methods, put “Traditional serotyping”. If the serovar was determined via in silico methods, provide the name and version number of the software."
      ],
      "examples": [
        {
          "value": "SISTR 1.0.1"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "phagetype": {
      "name": "phagetype",
      "description": "The phagetype of the organism.",
      "title": "phagetype",
      "comments": [
        "Provide if known. If unknown, put “missing”."
      ],
      "examples": [
        {
          "value": "47"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "library_ID": {
      "name": "library_ID",
      "description": "The user-specified identifier for the library prepared for sequencing.",
      "title": "library_ID",
      "comments": [
        "Every \"library ID\" from a single submitter must be unique. It can have any format, but we suggest that you make it concise, unique and consistent within your lab, and as informative as possible."
      ],
      "examples": [
        {
          "value": "LS_2010_NP_123446"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001448",
      "range": "WhitespaceMinimizedString"
    },
    "sequenced_by_institution_name": {
      "name": "sequenced_by_institution_name",
      "description": "The name of the agency, organization or institution responsible for sequencing the isolate's genome.",
      "title": "sequenced_by_institution_name",
      "comments": [
        "Provide the name of the agency, organization or institution that performed the sequencing in full (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Public Health Agency of Canada"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "sequenced_by_laboratory_name": {
      "name": "sequenced_by_laboratory_name",
      "description": "The specific laboratory affiliation of the responsible for sequencing the isolate's genome.",
      "title": "sequenced_by_laboratory_name",
      "comments": [
        "Provide the name of the specific laboratory that that performed the sequencing in full (avoid abbreviations). If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Topp Lab"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sequenced_by_contact_name": {
      "name": "sequenced_by_contact_name",
      "description": "The name or title of the contact responsible for follow-up regarding the sequence.",
      "title": "sequenced_by_contact_name",
      "comments": [
        "Provide the name of an individual or their job title. As personnel turnover may render the contact's name obsolete, it is more prefereable to provide a job title for ensuring accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Enterics Lab Manager"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sequenced_by_contact_email": {
      "name": "sequenced_by_contact_email",
      "description": "The email address of the contact responsible for follow-up regarding the sequence.",
      "title": "sequenced_by_contact_email",
      "comments": [
        "Provide the email associated with the listed contact. As personnel turnover may render an individual's email obsolete, it is more prefereable to provide an address for a position or lab, to ensure accuracy of information and institutional memory. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "enterics@lab.ca"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "required": true
    },
    "purpose_of_sequencing": {
      "name": "purpose_of_sequencing",
      "description": "The reason that the sample was sequenced.",
      "title": "purpose_of_sequencing",
      "comments": [
        "Provide the reason for sequencing by selecting a value from the following pick list: Diagnostic testing, Surveillance, Monitoring, Clinical trial, Field experiment, Environmental testing. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Research"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001445",
      "range": "purpose_of_sequencing menu",
      "required": true
    },
    "sequencing_project_name": {
      "name": "sequencing_project_name",
      "description": "The name of the project/initiative/program for which sequencing was performed.",
      "title": "sequencing_project_name",
      "comments": [
        "Provide the name of the project and/or the project ID here. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "AMR-GRDI (PA-1356)"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sequencing_platform": {
      "name": "sequencing_platform",
      "description": "The platform technology used to perform the sequencing.",
      "title": "sequencing_platform",
      "comments": [
        "Provide the name of the company that created the sequencing instrument by selecting a value from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "Illumina"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "sequencing_platform menu"
    },
    "sequencing_instrument": {
      "name": "sequencing_instrument",
      "description": "The model of the sequencing instrument used.",
      "title": "sequencing_instrument",
      "comments": [
        "Provide the model sequencing instrument by selecting a value from the template pick list. If the information is unknown or cannot be provided, leave blank or provide a null value."
      ],
      "examples": [
        {
          "value": "MiSeq"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001452",
      "range": "sequencing_instrument menu"
    },
    "sequencing_protocol": {
      "name": "sequencing_protocol",
      "description": "The protocol or method used for sequencing.",
      "title": "sequencing_protocol",
      "comments": [
        "Provide the name and version of the procedure or protocol used for sequencing. You can also provide a link to a protocol online."
      ],
      "examples": [
        {
          "value": "https://www.protocols.io/view/ncov-2019-sequencing-protocol-bbmuik6w?version_warning=no"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001454",
      "range": "WhitespaceMinimizedString"
    },
    "r1_fastq_filename": {
      "name": "r1_fastq_filename",
      "description": "The user-specified filename of the r1 FASTQ file.",
      "title": "r1_fastq_filename",
      "comments": [
        "Provide the r1 FASTQ filename."
      ],
      "examples": [
        {
          "value": "ABC123_S1_L001_R1_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001476",
      "range": "WhitespaceMinimizedString"
    },
    "r2_fastq_filename": {
      "name": "r2_fastq_filename",
      "description": "The user-specified filename of the r2 FASTQ file.",
      "title": "r2_fastq_filename",
      "comments": [
        "Provide the r2 FASTQ filename."
      ],
      "examples": [
        {
          "value": "ABC123_S1_L001_R2_001.fastq.gz"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001477",
      "range": "WhitespaceMinimizedString"
    },
    "fast5_filename": {
      "name": "fast5_filename",
      "description": "The user-specified filename of the FAST5 file.",
      "title": "fast5_filename",
      "comments": [
        "Provide the FAST5 filename."
      ],
      "examples": [
        {
          "value": "batch1a_sequences.fast5"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001480",
      "range": "WhitespaceMinimizedString"
    },
    "assembly_filename": {
      "name": "assembly_filename",
      "description": "The user-defined filename of the FASTA file.",
      "title": "assembly_filename",
      "comments": [
        "Provide the FASTA filename."
      ],
      "examples": [
        {
          "value": "pathogenassembly123.fasta"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "publication_ID": {
      "name": "publication_ID",
      "description": "The identifier for a publication.",
      "title": "publication_ID",
      "comments": [
        "If the isolate is associated with a published work which can provide additional information, provide the PubMed identifier of the publication. Other types of identifiers (e.g. DOI) are also acceptable."
      ],
      "examples": [
        {
          "value": "PMID: 33205991"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "attribute_package": {
      "name": "attribute_package",
      "description": "The attribute package used to structure metadata in an INSDC BioSample.",
      "title": "attribute_package",
      "comments": [
        "If the sample is from a specific human or animal, put “Pathogen.cl”. If the sample is from an environmental sample including food, feed, production facility, farm, water source, manure etc, put “Pathogen.env”."
      ],
      "examples": [
        {
          "value": "Pathogen.env"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "attribute_package menu"
    },
    "biosample_accession": {
      "name": "biosample_accession",
      "description": "The identifier assigned to a BioSample in INSDC archives.",
      "title": "biosample_accession",
      "comments": [
        "Store the accession returned from the BioSample submission. NCBI BioSamples will have the prefix SAMN, whileEMBL- EBI BioSamples will have the prefix SAMEA."
      ],
      "examples": [
        {
          "value": "SAMN14180202"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001139",
      "range": "WhitespaceMinimizedString"
    },
    "SRA_accession": {
      "name": "SRA_accession",
      "description": "The Sequence Read Archive (SRA), European Nucleotide Archive (ENA) or DDBJ Sequence Read Archive (DRA) identifier linking raw read data, methodological metadata and quality control metrics submitted to the INSDC.",
      "title": "SRA_accession",
      "comments": [
        "Store the accession assigned to the submitted \"run\". NCBI-SRA accessions start with SRR, EBI-ENA runs start with ERR and DRA accessions start with DRR."
      ],
      "examples": [
        {
          "value": "SRR11177792"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001142",
      "range": "WhitespaceMinimizedString"
    },
    "GenBank_accession": {
      "name": "GenBank_accession",
      "description": "The GenBank/ENA/DDBJ identifier assigned to the sequence in the INSDC archives.",
      "title": "GenBank_accession",
      "comments": [
        "Store the accession returned from a GenBank/ENA/DDBJ submission."
      ],
      "examples": [
        {
          "value": "MN908947.3"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "slot_uri": "GENEPIO:0001145",
      "range": "WhitespaceMinimizedString"
    },
    "prevalence_metrics": {
      "name": "prevalence_metrics",
      "description": "Metrics regarding the prevalence of the pathogen of interest obtained from a surveillance project.",
      "title": "prevalence_metrics",
      "comments": [
        "Risk assessment requires detailed information regarding the quantities of a pathogen in a specified location, commodity, or environment. As such, it is useful for risk assessors to know what types of information are available through documented methods and results. Provide the metric types that are available in the surveillance project sample plan by selecting them from the pick list. The metrics of interest are \" Number of total samples collected\", \"Number of positive samples\", \"Average count of hazard organism\", \"Average count of indicator organism\". You do not need to provide the actual values, just indicate that the information is available."
      ],
      "examples": [
        {
          "value": "Number of total samples collected, Number of positive samples"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "prevalence_metrics_details": {
      "name": "prevalence_metrics_details",
      "description": "The details pertaining to the prevalence metrics from a surveillance project.",
      "title": "prevalence_metrics_details",
      "comments": [
        "If there are details pertaining to samples or organism counts in the sample plan that might be informative, provide details using free text."
      ],
      "examples": [
        {
          "value": "Hazard organism counts (i.e. Salmonella) do not distinguish between serovars."
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "stage_of_production": {
      "name": "stage_of_production",
      "description": "The stage of food production.",
      "title": "stage_of_production",
      "comments": [
        "Provide the stage of food production from which the sample was taken. Select a value form the pick list provided."
      ],
      "examples": [
        {
          "value": "abattoir"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "stage_of_production menu",
      "recommended": true
    },
    "experimental_intervention": {
      "name": "experimental_intervention",
      "description": "The category of the experimental intervention applied in the food production system.",
      "title": "experimental_intervention",
      "comments": [
        "In some surveys, a particular intervention in the food supply chain in studied. If there was an intervention specified in the sample plan, select the intervention category from the pick list provided."
      ],
      "examples": [
        {
          "value": "Vaccination"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "experimental_intervention menu",
      "recommended": true
    },
    "experiment_intervention_details": {
      "name": "experiment_intervention_details",
      "description": "The details of the experimental intervention applied in the food production system.",
      "title": "experiment_intervention_details",
      "comments": [
        "If an experimental intervention was applied in the survey, provide details in this field as free text."
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString",
      "recommended": true
    },
    "AMR_laboratory_typing_method": {
      "name": "AMR_laboratory_typing_method",
      "description": "Type of method used for antibiotic susceptibility testing.",
      "title": "AMR_laboratory_typing_method",
      "comments": [
        "“MIC”, “agar dilution”, “disk diffusion”, or “missing”"
      ],
      "examples": [
        {
          "value": "MIC"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "AMR_laboratory_typing_platform": {
      "name": "AMR_laboratory_typing_platform",
      "description": "The brand/platform used for antibiotic susceptibility testing",
      "title": "AMR_laboratory_typing_platform",
      "comments": [
        "“Microscan”, “Phoenix”, “Sensititre”, or “Vitek”"
      ],
      "examples": [
        {
          "value": "Sensititre"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "AMR_laboratory_typing_platform_version": {
      "name": "AMR_laboratory_typing_platform_version",
      "description": "The specific name and version of the plate, panel, or other platform used for antibiotic susceptibility testing.",
      "title": "AMR_laboratory_typing_platform_version",
      "comments": [
        "Any additional information about the nature of the antimicrobial susceptibility test can go in this field."
      ],
      "examples": [
        {
          "value": "CMV3AGNF"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "AMR_measurement_units": {
      "name": "AMR_measurement_units",
      "description": "Units used for measuring antibiotic susceptibility",
      "title": "AMR_measurement_units",
      "comments": [
        "“mg/L” or “mm”"
      ],
      "examples": [
        {
          "value": "mg/L"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_resistance_phenotype": {
      "name": "amoxicillin-clavulanic_acid_resistance_phenotype",
      "description": "Antimicrobial resistance phenotype, as determined by the antibiotic susceptibility measurement and testing standard for this antibiotic",
      "title": "amoxicillin-clavulanic_acid_resistance_phenotype",
      "comments": [
        "“resistant”, “susceptible”, “intermediate”, “nonsusceptible”, “suceptible-dose dependent”, or “not defined”"
      ],
      "examples": [
        {
          "value": "sensitive"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_measurement_sign": {
      "name": "amoxicillin-clavulanic_acid_measurement_sign",
      "description": "Qualifier associated with the antibiotic susceptibility measurement",
      "title": "amoxicillin-clavulanic_acid_measurement_sign",
      "comments": [
        "“<”, “<=”, “==”, “>=”, or “>\". If the susceptibility measurement for this antibiotic and for this sample is exact, use “==”."
      ],
      "examples": [
        {
          "value": "=="
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_measurement": {
      "name": "amoxicillin-clavulanic_acid_measurement",
      "description": "Antibiotic susceptibility measurement, measured in the units specified in the “AMR_measurement_units” field.",
      "title": "amoxicillin-clavulanic_acid_measurement",
      "comments": [
        "This field should only contain a number (either an integer or a number with decimals)."
      ],
      "examples": [
        {
          "value": "4"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_resistance_phenotype": {
      "name": "ampicillin_resistance_phenotype",
      "title": "ampicillin_resistance_phenotype",
      "examples": [
        {
          "value": "CLSI"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_measurement_sign": {
      "name": "ampicillin_measurement_sign",
      "title": "ampicillin_measurement_sign",
      "examples": [
        {
          "value": "M100"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_measurement": {
      "name": "ampicillin_measurement",
      "title": "ampicillin_measurement",
      "examples": [
        {
          "value": "27th ed. Wayne, PA: Clinical and Laboratory Standards Institute"
        },
        {
          "value": "2017."
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_resistance_phenotype": {
      "name": "azithromycin_resistance_phenotype",
      "title": "azithromycin_resistance_phenotype",
      "examples": [
        {
          "value": "8"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_measurement_sign": {
      "name": "azithromycin_measurement_sign",
      "title": "azithromycin_measurement_sign",
      "examples": [
        {
          "value": "16"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_measurement": {
      "name": "azithromycin_measurement",
      "title": "azithromycin_measurement",
      "examples": [
        {
          "value": "32"
        }
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_resistance_phenotype": {
      "name": "cefoxitin_resistance_phenotype",
      "title": "cefoxitin_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_measurement_sign": {
      "name": "cefoxitin_measurement_sign",
      "title": "cefoxitin_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_measurement": {
      "name": "cefoxitin_measurement",
      "title": "cefoxitin_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_resistance_phenotype": {
      "name": "ceftriaxone_resistance_phenotype",
      "title": "ceftriaxone_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_measurement_sign": {
      "name": "ceftriaxone_measurement_sign",
      "title": "ceftriaxone_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_measurement": {
      "name": "ceftriaxone_measurement",
      "title": "ceftriaxone_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_resistance_phenotype": {
      "name": "chloramphenicol_resistance_phenotype",
      "title": "chloramphenicol_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_measurement_sign": {
      "name": "chloramphenicol_measurement_sign",
      "title": "chloramphenicol_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_measurement": {
      "name": "chloramphenicol_measurement",
      "title": "chloramphenicol_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_resistance_phenotype": {
      "name": "ciprofloxacin_resistance_phenotype",
      "title": "ciprofloxacin_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_measurement_sign": {
      "name": "ciprofloxacin_measurement_sign",
      "title": "ciprofloxacin_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_measurement": {
      "name": "ciprofloxacin_measurement",
      "title": "ciprofloxacin_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_resistance_phenotype": {
      "name": "gentamicin_resistance_phenotype",
      "title": "gentamicin_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_measurement_sign": {
      "name": "gentamicin_measurement_sign",
      "title": "gentamicin_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_measurement": {
      "name": "gentamicin_measurement",
      "title": "gentamicin_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_resistance_phenotype": {
      "name": "meropenem_resistance_phenotype",
      "title": "meropenem_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_measurement_sign": {
      "name": "meropenem_measurement_sign",
      "title": "meropenem_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_measurement": {
      "name": "meropenem_measurement",
      "title": "meropenem_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_resistance_phenotype": {
      "name": "nalidixic_acid_resistance_phenotype",
      "title": "nalidixic_acid_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_measurement_sign": {
      "name": "nalidixic_acid_measurement_sign",
      "title": "nalidixic_acid_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_measurement": {
      "name": "nalidixic_acid_measurement",
      "title": "nalidixic_acid_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_resistance_phenotype": {
      "name": "streptomycin_resistance_phenotype",
      "title": "streptomycin_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_measurement_sign": {
      "name": "streptomycin_measurement_sign",
      "title": "streptomycin_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_measurement": {
      "name": "streptomycin_measurement",
      "title": "streptomycin_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_resistance_phenotype": {
      "name": "sulfisoxazole_resistance_phenotype",
      "title": "sulfisoxazole_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_measurement_sign": {
      "name": "sulfisoxazole_measurement_sign",
      "title": "sulfisoxazole_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_measurement": {
      "name": "sulfisoxazole_measurement",
      "title": "sulfisoxazole_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_resistance_phenotype": {
      "name": "tetracycline_resistance_phenotype",
      "title": "tetracycline_resistance_phenotype",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_measurement_sign": {
      "name": "tetracycline_measurement_sign",
      "title": "tetracycline_measurement_sign",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_measurement": {
      "name": "tetracycline_measurement",
      "title": "tetracycline_measurement",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_testing_standard": {
      "name": "amoxicillin-clavulanic_acid_testing_standard",
      "description": "Testing standard used for determination of resistance phenotype",
      "title": "amoxicillin-clavulanic_acid_testing_standard",
      "comments": [
        "“CLSI”, “NARMS”, “BSAC”, “DIN”, “EUCAST”, “NCCLS”, “SFM”, “SIR”, “WRG”, or “missing”"
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_testing_standard_version": {
      "name": "amoxicillin-clavulanic_acid_testing_standard_version",
      "description": "Version number associated with the testing standard used for determination of resistance phenotype",
      "title": "amoxicillin-clavulanic_acid_testing_standard_version",
      "comments": [
        "If applicable, include a version number for the testing standard used."
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_testing_standard_details": {
      "name": "amoxicillin-clavulanic_acid_testing_standard_details",
      "description": "Additional details associated with the testing standard used for determination of resistance phenotype",
      "title": "amoxicillin-clavulanic_acid_testing_standard_details",
      "comments": [
        "This information may include the year or location where the testing standard was published. If not applicable, leave blank."
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_susceptible_breakpoint": {
      "name": "amoxicillin-clavulanic_acid_susceptible_breakpoint",
      "description": "Maximum measurement, in the units specified in the “AMR_measurement_units” field, for a sample to be considered “sensitive” to this antibiotic",
      "title": "amoxicillin-clavulanic_acid_susceptible_breakpoint",
      "comments": [
        "This field should only contain a number (either an integer or a number with decimals), since the “<=” qualifier is implied."
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_intermediate_breakpoint": {
      "name": "amoxicillin-clavulanic_acid_intermediate_breakpoint",
      "description": "Intermediate measurement(s), in the units specified in the “AMR_measurement_units” field, where a sample would be considered to have an “intermediate” phenotype for this antibiotic",
      "title": "amoxicillin-clavulanic_acid_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "amoxicillin-clavulanic_acid_resistant_breakpoint": {
      "name": "amoxicillin-clavulanic_acid_resistant_breakpoint",
      "description": "Minimum measurement, in the units specified in the “AMR_measurement_units” field, for a sample to be considered “resistant” to this antibiotic",
      "title": "amoxicillin-clavulanic_acid_resistant_breakpoint",
      "comments": [
        "This field should only contain a number (either an integer or a number with decimals), since the “>=” qualifier is implied."
      ],
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_testing_standard": {
      "name": "ampicillin_testing_standard",
      "title": "ampicillin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_testing_standard_version": {
      "name": "ampicillin_testing_standard_version",
      "title": "ampicillin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_testing_standard_details": {
      "name": "ampicillin_testing_standard_details",
      "title": "ampicillin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_susceptible_breakpoint": {
      "name": "ampicillin_susceptible_breakpoint",
      "title": "ampicillin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_intermediate_breakpoint": {
      "name": "ampicillin_intermediate_breakpoint",
      "title": "ampicillin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ampicillin_resistant_breakpoint": {
      "name": "ampicillin_resistant_breakpoint",
      "title": "ampicillin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_testing_standard": {
      "name": "azithromycin_testing_standard",
      "title": "azithromycin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_testing_standard_version": {
      "name": "azithromycin_testing_standard_version",
      "title": "azithromycin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_testing_standard_details": {
      "name": "azithromycin_testing_standard_details",
      "title": "azithromycin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_susceptible_breakpoint": {
      "name": "azithromycin_susceptible_breakpoint",
      "title": "azithromycin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_intermediate_breakpoint": {
      "name": "azithromycin_intermediate_breakpoint",
      "title": "azithromycin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "azithromycin_resistant_breakpoint": {
      "name": "azithromycin_resistant_breakpoint",
      "title": "azithromycin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_testing_standard": {
      "name": "cefoxitin_testing_standard",
      "title": "cefoxitin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_testing_standard_version": {
      "name": "cefoxitin_testing_standard_version",
      "title": "cefoxitin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_testing_standard_details": {
      "name": "cefoxitin_testing_standard_details",
      "title": "cefoxitin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_susceptible_breakpoint": {
      "name": "cefoxitin_susceptible_breakpoint",
      "title": "cefoxitin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_intermediate_breakpoint": {
      "name": "cefoxitin_intermediate_breakpoint",
      "title": "cefoxitin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "cefoxitin_resistant_breakpoint": {
      "name": "cefoxitin_resistant_breakpoint",
      "title": "cefoxitin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_testing_standard": {
      "name": "ceftriaxone_testing_standard",
      "title": "ceftriaxone_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_testing_standard_version": {
      "name": "ceftriaxone_testing_standard_version",
      "title": "ceftriaxone_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_testing_standard_details": {
      "name": "ceftriaxone_testing_standard_details",
      "title": "ceftriaxone_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_susceptible_breakpoint": {
      "name": "ceftriaxone_susceptible_breakpoint",
      "title": "ceftriaxone_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_intermediate_breakpoint": {
      "name": "ceftriaxone_intermediate_breakpoint",
      "title": "ceftriaxone_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ceftriaxone_resistant_breakpoint": {
      "name": "ceftriaxone_resistant_breakpoint",
      "title": "ceftriaxone_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_testing_standard": {
      "name": "chloramphenicol_testing_standard",
      "title": "chloramphenicol_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_testing_standard_version": {
      "name": "chloramphenicol_testing_standard_version",
      "title": "chloramphenicol_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_testing_standard_details": {
      "name": "chloramphenicol_testing_standard_details",
      "title": "chloramphenicol_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_susceptible_breakpoint": {
      "name": "chloramphenicol_susceptible_breakpoint",
      "title": "chloramphenicol_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_intermediate_breakpoint": {
      "name": "chloramphenicol_intermediate_breakpoint",
      "title": "chloramphenicol_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "chloramphenicol_resistant_breakpoint": {
      "name": "chloramphenicol_resistant_breakpoint",
      "title": "chloramphenicol_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_testing_standard": {
      "name": "ciprofloxacin_testing_standard",
      "title": "ciprofloxacin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_testing_standard_version": {
      "name": "ciprofloxacin_testing_standard_version",
      "title": "ciprofloxacin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_testing_standard_details": {
      "name": "ciprofloxacin_testing_standard_details",
      "title": "ciprofloxacin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_susceptible_breakpoint": {
      "name": "ciprofloxacin_susceptible_breakpoint",
      "title": "ciprofloxacin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_intermediate_breakpoint": {
      "name": "ciprofloxacin_intermediate_breakpoint",
      "title": "ciprofloxacin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "ciprofloxacin_resistant_breakpoint": {
      "name": "ciprofloxacin_resistant_breakpoint",
      "title": "ciprofloxacin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_testing_standard": {
      "name": "gentamicin_testing_standard",
      "title": "gentamicin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_testing_standard_version": {
      "name": "gentamicin_testing_standard_version",
      "title": "gentamicin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_testing_standard_details": {
      "name": "gentamicin_testing_standard_details",
      "title": "gentamicin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_susceptible_breakpoint": {
      "name": "gentamicin_susceptible_breakpoint",
      "title": "gentamicin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_intermediate_breakpoint": {
      "name": "gentamicin_intermediate_breakpoint",
      "title": "gentamicin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "gentamicin_resistant_breakpoint": {
      "name": "gentamicin_resistant_breakpoint",
      "title": "gentamicin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_testing_standard": {
      "name": "meropenem_testing_standard",
      "title": "meropenem_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_testing_standard_version": {
      "name": "meropenem_testing_standard_version",
      "title": "meropenem_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_testing_standard_details": {
      "name": "meropenem_testing_standard_details",
      "title": "meropenem_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_susceptible_breakpoint": {
      "name": "meropenem_susceptible_breakpoint",
      "title": "meropenem_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_intermediate_breakpoint": {
      "name": "meropenem_intermediate_breakpoint",
      "title": "meropenem_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "meropenem_resistant_breakpoint": {
      "name": "meropenem_resistant_breakpoint",
      "title": "meropenem_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_testing_standard": {
      "name": "nalidixic_acid_testing_standard",
      "title": "nalidixic_acid_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_testing_standard_version": {
      "name": "nalidixic_acid_testing_standard_version",
      "title": "nalidixic_acid_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_testing_standard_details": {
      "name": "nalidixic_acid_testing_standard_details",
      "title": "nalidixic_acid_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_susceptible_breakpoint": {
      "name": "nalidixic_acid_susceptible_breakpoint",
      "title": "nalidixic_acid_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_intermediate_breakpoint": {
      "name": "nalidixic_acid_intermediate_breakpoint",
      "title": "nalidixic_acid_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "nalidixic_acid_resistant_breakpoint": {
      "name": "nalidixic_acid_resistant_breakpoint",
      "title": "nalidixic_acid_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_testing_standard": {
      "name": "streptomycin_testing_standard",
      "title": "streptomycin_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_testing_standard_version": {
      "name": "streptomycin_testing_standard_version",
      "title": "streptomycin_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_testing_standard_details": {
      "name": "streptomycin_testing_standard_details",
      "title": "streptomycin_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_susceptible_breakpoint": {
      "name": "streptomycin_susceptible_breakpoint",
      "title": "streptomycin_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_intermediate_breakpoint": {
      "name": "streptomycin_intermediate_breakpoint",
      "title": "streptomycin_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "streptomycin_resistant_breakpoint": {
      "name": "streptomycin_resistant_breakpoint",
      "title": "streptomycin_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_testing_standard": {
      "name": "sulfisoxazole_testing_standard",
      "title": "sulfisoxazole_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_testing_standard_version": {
      "name": "sulfisoxazole_testing_standard_version",
      "title": "sulfisoxazole_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_testing_standard_details": {
      "name": "sulfisoxazole_testing_standard_details",
      "title": "sulfisoxazole_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_susceptible_breakpoint": {
      "name": "sulfisoxazole_susceptible_breakpoint",
      "title": "sulfisoxazole_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_intermediate_breakpoint": {
      "name": "sulfisoxazole_intermediate_breakpoint",
      "title": "sulfisoxazole_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "sulfisoxazole_resistant_breakpoint": {
      "name": "sulfisoxazole_resistant_breakpoint",
      "title": "sulfisoxazole_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_testing_standard": {
      "name": "tetracycline_testing_standard",
      "title": "tetracycline_testing_standard",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_testing_standard_version": {
      "name": "tetracycline_testing_standard_version",
      "title": "tetracycline_testing_standard_version",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_testing_standard_details": {
      "name": "tetracycline_testing_standard_details",
      "title": "tetracycline_testing_standard_details",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_susceptible_breakpoint": {
      "name": "tetracycline_susceptible_breakpoint",
      "title": "tetracycline_susceptible_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_intermediate_breakpoint": {
      "name": "tetracycline_intermediate_breakpoint",
      "title": "tetracycline_intermediate_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    },
    "tetracycline_resistant_breakpoint": {
      "name": "tetracycline_resistant_breakpoint",
      "title": "tetracycline_resistant_breakpoint",
      "from_schema": "https://example.com/GRDI",
      "range": "WhitespaceMinimizedString"
    }
  },
  "classes": {
    "dh_interface": {
      "name": "dh_interface",
      "description": "A DataHarmonizer interface",
      "from_schema": "https://example.com/GRDI"
    },
    "GRDI": {
      "name": "GRDI",
      "description": "Specification for GRDI virus biosample data gathering",
      "from_schema": "https://example.com/GRDI",
      "is_a": "dh_interface",
      "slot_usage": {
        "sample_collector_sample_ID": {
          "name": "sample_collector_sample_ID",
          "rank": 1,
          "slot_group": "Sample collection and processing"
        },
        "alternative_sample_ID": {
          "name": "alternative_sample_ID",
          "rank": 2,
          "slot_group": "Sample collection and processing"
        },
        "sample_collected_by": {
          "name": "sample_collected_by",
          "rank": 3,
          "slot_group": "Sample collection and processing"
        },
        "collected_by_laboratory_name": {
          "name": "collected_by_laboratory_name",
          "rank": 4,
          "slot_group": "Sample collection and processing"
        },
        "sample_collection_project_name": {
          "name": "sample_collection_project_name",
          "rank": 5,
          "slot_group": "Sample collection and processing"
        },
        "sample_plan_name": {
          "name": "sample_plan_name",
          "rank": 6,
          "slot_group": "Sample collection and processing"
        },
        "sample_plan_ID": {
          "name": "sample_plan_ID",
          "rank": 7,
          "slot_group": "Sample collection and processing"
        },
        "sample_collector_contact_name": {
          "name": "sample_collector_contact_name",
          "rank": 8,
          "slot_group": "Sample collection and processing"
        },
        "sample_collector_contact_email": {
          "name": "sample_collector_contact_email",
          "rank": 9,
          "slot_group": "Sample collection and processing"
        },
        "purpose_of_sampling": {
          "name": "purpose_of_sampling",
          "rank": 10,
          "slot_group": "Sample collection and processing"
        },
        "experimental_activity": {
          "name": "experimental_activity",
          "rank": 11,
          "slot_group": "Sample collection and processing"
        },
        "experimental_activity_details": {
          "name": "experimental_activity_details",
          "rank": 12,
          "slot_group": "Sample collection and processing"
        },
        "sample_processing": {
          "name": "sample_processing",
          "rank": 13,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "rank": 14,
          "slot_group": "Sample collection and processing"
        },
        "geo_loc_name (state/province/region)": {
          "name": "geo_loc_name (state/province/region)",
          "rank": 15,
          "slot_group": "Sample collection and processing"
        },
        "food_product_origin geo_loc_name (country)": {
          "name": "food_product_origin geo_loc_name (country)",
          "rank": 16,
          "slot_group": "Sample collection and processing"
        },
        "host_origin geo_loc_name (country)": {
          "name": "host_origin geo_loc_name (country)",
          "rank": 17,
          "slot_group": "Sample collection and processing"
        },
        "latitude_of_sample_collection": {
          "name": "latitude_of_sample_collection",
          "rank": 18,
          "slot_group": "Sample collection and processing"
        },
        "longitude_of_sample_collection": {
          "name": "longitude_of_sample_collection",
          "rank": 19,
          "slot_group": "Sample collection and processing"
        },
        "sample_collection_date": {
          "name": "sample_collection_date",
          "rank": 20,
          "slot_group": "Sample collection and processing"
        },
        "sample_received_date": {
          "name": "sample_received_date",
          "rank": 21,
          "slot_group": "Sample collection and processing"
        },
        "original_sample_description": {
          "name": "original_sample_description",
          "rank": 22,
          "slot_group": "Sample collection and processing"
        },
        "environmental_site": {
          "name": "environmental_site",
          "rank": 23,
          "slot_group": "Sample collection and processing"
        },
        "animal_or_plant_population": {
          "name": "animal_or_plant_population",
          "rank": 24,
          "slot_group": "Sample collection and processing"
        },
        "environmental_material": {
          "name": "environmental_material",
          "rank": 25,
          "slot_group": "Sample collection and processing"
        },
        "body_product": {
          "name": "body_product",
          "rank": 26,
          "slot_group": "Sample collection and processing"
        },
        "anatomical_part": {
          "name": "anatomical_part",
          "rank": 27,
          "slot_group": "Sample collection and processing"
        },
        "food_product": {
          "name": "food_product",
          "rank": 28,
          "slot_group": "Sample collection and processing"
        },
        "food_product_properties": {
          "name": "food_product_properties",
          "rank": 29,
          "slot_group": "Sample collection and processing"
        },
        "animal_source_of_food": {
          "name": "animal_source_of_food",
          "rank": 30,
          "slot_group": "Sample collection and processing"
        },
        "food_packaging": {
          "name": "food_packaging",
          "rank": 31,
          "slot_group": "Sample collection and processing"
        },
        "collection_device": {
          "name": "collection_device",
          "rank": 32,
          "slot_group": "Sample collection and processing"
        },
        "collection_method": {
          "name": "collection_method",
          "rank": 33,
          "slot_group": "Sample collection and processing"
        },
        "host (common name)": {
          "name": "host (common name)",
          "rank": 34,
          "slot_group": "Host information"
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "rank": 35,
          "slot_group": "Host information"
        },
        "host_disease": {
          "name": "host_disease",
          "rank": 36,
          "slot_group": "Host information"
        },
        "microbiological_method": {
          "name": "microbiological_method",
          "rank": 37,
          "slot_group": "Strain and isolation information"
        },
        "strain": {
          "name": "strain",
          "rank": 38,
          "slot_group": "Strain and isolation information"
        },
        "isolate_ID": {
          "name": "isolate_ID",
          "rank": 39,
          "slot_group": "Strain and isolation information"
        },
        "alternative_isolate_ID": {
          "name": "alternative_isolate_ID",
          "rank": 40,
          "slot_group": "Strain and isolation information"
        },
        "progeny_isolate_ID": {
          "name": "progeny_isolate_ID",
          "rank": 41,
          "slot_group": "Strain and isolation information"
        },
        "IRIDA_isolate_ID": {
          "name": "IRIDA_isolate_ID",
          "rank": 42,
          "slot_group": "Strain and isolation information"
        },
        "IRIDA_project_ID": {
          "name": "IRIDA_project_ID",
          "rank": 43,
          "slot_group": "Strain and isolation information"
        },
        "isolated_by_institution_name": {
          "name": "isolated_by_institution_name",
          "rank": 44,
          "slot_group": "Strain and isolation information"
        },
        "isolated_by_laboratory_name": {
          "name": "isolated_by_laboratory_name",
          "rank": 45,
          "slot_group": "Strain and isolation information"
        },
        "isolated_by_contact_name": {
          "name": "isolated_by_contact_name",
          "rank": 46,
          "slot_group": "Strain and isolation information"
        },
        "isolated_by_contact_email": {
          "name": "isolated_by_contact_email",
          "rank": 47,
          "slot_group": "Strain and isolation information"
        },
        "isolation_date": {
          "name": "isolation_date",
          "rank": 48,
          "slot_group": "Strain and isolation information"
        },
        "isolate_received_date": {
          "name": "isolate_received_date",
          "rank": 49,
          "slot_group": "Strain and isolation information"
        },
        "organism": {
          "name": "organism",
          "rank": 50,
          "slot_group": "Strain and isolation information"
        },
        "serovar": {
          "name": "serovar",
          "rank": 51,
          "slot_group": "Strain and isolation information"
        },
        "serotyping_method": {
          "name": "serotyping_method",
          "rank": 52,
          "slot_group": "Strain and isolation information"
        },
        "phagetype": {
          "name": "phagetype",
          "rank": 53,
          "slot_group": "Strain and isolation information"
        },
        "library_ID": {
          "name": "library_ID",
          "rank": 54,
          "slot_group": "Sequence information"
        },
        "sequenced_by_institution_name": {
          "name": "sequenced_by_institution_name",
          "rank": 55,
          "slot_group": "Sequence information"
        },
        "sequenced_by_laboratory_name": {
          "name": "sequenced_by_laboratory_name",
          "rank": 56,
          "slot_group": "Sequence information"
        },
        "sequenced_by_contact_name": {
          "name": "sequenced_by_contact_name",
          "rank": 57,
          "slot_group": "Sequence information"
        },
        "sequenced_by_contact_email": {
          "name": "sequenced_by_contact_email",
          "rank": 58,
          "slot_group": "Sequence information"
        },
        "purpose_of_sequencing": {
          "name": "purpose_of_sequencing",
          "rank": 59,
          "slot_group": "Sequence information"
        },
        "sequencing_project_name": {
          "name": "sequencing_project_name",
          "rank": 60,
          "slot_group": "Sequence information"
        },
        "sequencing_platform": {
          "name": "sequencing_platform",
          "rank": 61,
          "slot_group": "Sequence information"
        },
        "sequencing_instrument": {
          "name": "sequencing_instrument",
          "rank": 62,
          "slot_group": "Sequence information"
        },
        "sequencing_protocol": {
          "name": "sequencing_protocol",
          "rank": 63,
          "slot_group": "Sequence information"
        },
        "r1_fastq_filename": {
          "name": "r1_fastq_filename",
          "rank": 64,
          "slot_group": "Sequence information"
        },
        "r2_fastq_filename": {
          "name": "r2_fastq_filename",
          "rank": 65,
          "slot_group": "Sequence information"
        },
        "fast5_filename": {
          "name": "fast5_filename",
          "rank": 66,
          "slot_group": "Sequence information"
        },
        "assembly_filename": {
          "name": "assembly_filename",
          "rank": 67,
          "slot_group": "Sequence information"
        },
        "publication_ID": {
          "name": "publication_ID",
          "rank": 68,
          "slot_group": "Public repository information"
        },
        "attribute_package": {
          "name": "attribute_package",
          "rank": 69,
          "slot_group": "Public repository information"
        },
        "biosample_accession": {
          "name": "biosample_accession",
          "rank": 70,
          "slot_group": "Public repository information"
        },
        "SRA_accession": {
          "name": "SRA_accession",
          "rank": 71,
          "slot_group": "Public repository information"
        },
        "GenBank_accession": {
          "name": "GenBank_accession",
          "rank": 72,
          "slot_group": "Public repository information"
        },
        "prevalence_metrics": {
          "name": "prevalence_metrics",
          "rank": 73,
          "slot_group": "Risk assessment information"
        },
        "prevalence_metrics_details": {
          "name": "prevalence_metrics_details",
          "rank": 74,
          "slot_group": "Risk assessment information"
        },
        "stage_of_production": {
          "name": "stage_of_production",
          "rank": 75,
          "slot_group": "Risk assessment information"
        },
        "experimental_intervention": {
          "name": "experimental_intervention",
          "rank": 76,
          "slot_group": "Risk assessment information"
        },
        "experiment_intervention_details": {
          "name": "experiment_intervention_details",
          "rank": 77,
          "slot_group": "Risk assessment information"
        },
        "AMR_laboratory_typing_method": {
          "name": "AMR_laboratory_typing_method",
          "rank": 78,
          "slot_group": "Antimicrobial resistance"
        },
        "AMR_laboratory_typing_platform": {
          "name": "AMR_laboratory_typing_platform",
          "rank": 79,
          "slot_group": "Antimicrobial resistance"
        },
        "AMR_laboratory_typing_platform_version": {
          "name": "AMR_laboratory_typing_platform_version",
          "rank": 80,
          "slot_group": "Antimicrobial resistance"
        },
        "AMR_measurement_units": {
          "name": "AMR_measurement_units",
          "rank": 81,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_resistance_phenotype": {
          "name": "amoxicillin-clavulanic_acid_resistance_phenotype",
          "rank": 82,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_measurement_sign": {
          "name": "amoxicillin-clavulanic_acid_measurement_sign",
          "rank": 83,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_measurement": {
          "name": "amoxicillin-clavulanic_acid_measurement",
          "rank": 84,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_resistance_phenotype": {
          "name": "ampicillin_resistance_phenotype",
          "rank": 85,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_measurement_sign": {
          "name": "ampicillin_measurement_sign",
          "rank": 86,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_measurement": {
          "name": "ampicillin_measurement",
          "rank": 87,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_resistance_phenotype": {
          "name": "azithromycin_resistance_phenotype",
          "rank": 88,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_measurement_sign": {
          "name": "azithromycin_measurement_sign",
          "rank": 89,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_measurement": {
          "name": "azithromycin_measurement",
          "rank": 90,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_resistance_phenotype": {
          "name": "cefoxitin_resistance_phenotype",
          "rank": 91,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_measurement_sign": {
          "name": "cefoxitin_measurement_sign",
          "rank": 92,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_measurement": {
          "name": "cefoxitin_measurement",
          "rank": 93,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_resistance_phenotype": {
          "name": "ceftriaxone_resistance_phenotype",
          "rank": 94,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_measurement_sign": {
          "name": "ceftriaxone_measurement_sign",
          "rank": 95,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_measurement": {
          "name": "ceftriaxone_measurement",
          "rank": 96,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_resistance_phenotype": {
          "name": "chloramphenicol_resistance_phenotype",
          "rank": 97,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_measurement_sign": {
          "name": "chloramphenicol_measurement_sign",
          "rank": 98,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_measurement": {
          "name": "chloramphenicol_measurement",
          "rank": 99,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_resistance_phenotype": {
          "name": "ciprofloxacin_resistance_phenotype",
          "rank": 100,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_measurement_sign": {
          "name": "ciprofloxacin_measurement_sign",
          "rank": 101,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_measurement": {
          "name": "ciprofloxacin_measurement",
          "rank": 102,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_resistance_phenotype": {
          "name": "gentamicin_resistance_phenotype",
          "rank": 103,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_measurement_sign": {
          "name": "gentamicin_measurement_sign",
          "rank": 104,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_measurement": {
          "name": "gentamicin_measurement",
          "rank": 105,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_resistance_phenotype": {
          "name": "meropenem_resistance_phenotype",
          "rank": 106,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_measurement_sign": {
          "name": "meropenem_measurement_sign",
          "rank": 107,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_measurement": {
          "name": "meropenem_measurement",
          "rank": 108,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_resistance_phenotype": {
          "name": "nalidixic_acid_resistance_phenotype",
          "rank": 109,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_measurement_sign": {
          "name": "nalidixic_acid_measurement_sign",
          "rank": 110,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_measurement": {
          "name": "nalidixic_acid_measurement",
          "rank": 111,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_resistance_phenotype": {
          "name": "streptomycin_resistance_phenotype",
          "rank": 112,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_measurement_sign": {
          "name": "streptomycin_measurement_sign",
          "rank": 113,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_measurement": {
          "name": "streptomycin_measurement",
          "rank": 114,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_resistance_phenotype": {
          "name": "sulfisoxazole_resistance_phenotype",
          "rank": 115,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_measurement_sign": {
          "name": "sulfisoxazole_measurement_sign",
          "rank": 116,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_measurement": {
          "name": "sulfisoxazole_measurement",
          "rank": 117,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_resistance_phenotype": {
          "name": "tetracycline_resistance_phenotype",
          "rank": 118,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_measurement_sign": {
          "name": "tetracycline_measurement_sign",
          "rank": 119,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_measurement": {
          "name": "tetracycline_measurement",
          "rank": 120,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_testing_standard": {
          "name": "amoxicillin-clavulanic_acid_testing_standard",
          "rank": 121,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_testing_standard_version": {
          "name": "amoxicillin-clavulanic_acid_testing_standard_version",
          "rank": 122,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_testing_standard_details": {
          "name": "amoxicillin-clavulanic_acid_testing_standard_details",
          "rank": 123,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_susceptible_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_susceptible_breakpoint",
          "rank": 124,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_intermediate_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_intermediate_breakpoint",
          "rank": 125,
          "slot_group": "Antimicrobial resistance"
        },
        "amoxicillin-clavulanic_acid_resistant_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_resistant_breakpoint",
          "rank": 126,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_testing_standard": {
          "name": "ampicillin_testing_standard",
          "rank": 127,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_testing_standard_version": {
          "name": "ampicillin_testing_standard_version",
          "rank": 128,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_testing_standard_details": {
          "name": "ampicillin_testing_standard_details",
          "rank": 129,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_susceptible_breakpoint": {
          "name": "ampicillin_susceptible_breakpoint",
          "rank": 130,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_intermediate_breakpoint": {
          "name": "ampicillin_intermediate_breakpoint",
          "rank": 131,
          "slot_group": "Antimicrobial resistance"
        },
        "ampicillin_resistant_breakpoint": {
          "name": "ampicillin_resistant_breakpoint",
          "rank": 132,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_testing_standard": {
          "name": "azithromycin_testing_standard",
          "rank": 133,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_testing_standard_version": {
          "name": "azithromycin_testing_standard_version",
          "rank": 134,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_testing_standard_details": {
          "name": "azithromycin_testing_standard_details",
          "rank": 135,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_susceptible_breakpoint": {
          "name": "azithromycin_susceptible_breakpoint",
          "rank": 136,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_intermediate_breakpoint": {
          "name": "azithromycin_intermediate_breakpoint",
          "rank": 137,
          "slot_group": "Antimicrobial resistance"
        },
        "azithromycin_resistant_breakpoint": {
          "name": "azithromycin_resistant_breakpoint",
          "rank": 138,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_testing_standard": {
          "name": "cefoxitin_testing_standard",
          "rank": 139,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_testing_standard_version": {
          "name": "cefoxitin_testing_standard_version",
          "rank": 140,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_testing_standard_details": {
          "name": "cefoxitin_testing_standard_details",
          "rank": 141,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_susceptible_breakpoint": {
          "name": "cefoxitin_susceptible_breakpoint",
          "rank": 142,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_intermediate_breakpoint": {
          "name": "cefoxitin_intermediate_breakpoint",
          "rank": 143,
          "slot_group": "Antimicrobial resistance"
        },
        "cefoxitin_resistant_breakpoint": {
          "name": "cefoxitin_resistant_breakpoint",
          "rank": 144,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_testing_standard": {
          "name": "ceftriaxone_testing_standard",
          "rank": 145,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_testing_standard_version": {
          "name": "ceftriaxone_testing_standard_version",
          "rank": 146,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_testing_standard_details": {
          "name": "ceftriaxone_testing_standard_details",
          "rank": 147,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_susceptible_breakpoint": {
          "name": "ceftriaxone_susceptible_breakpoint",
          "rank": 148,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_intermediate_breakpoint": {
          "name": "ceftriaxone_intermediate_breakpoint",
          "rank": 149,
          "slot_group": "Antimicrobial resistance"
        },
        "ceftriaxone_resistant_breakpoint": {
          "name": "ceftriaxone_resistant_breakpoint",
          "rank": 150,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_testing_standard": {
          "name": "chloramphenicol_testing_standard",
          "rank": 151,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_testing_standard_version": {
          "name": "chloramphenicol_testing_standard_version",
          "rank": 152,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_testing_standard_details": {
          "name": "chloramphenicol_testing_standard_details",
          "rank": 153,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_susceptible_breakpoint": {
          "name": "chloramphenicol_susceptible_breakpoint",
          "rank": 154,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_intermediate_breakpoint": {
          "name": "chloramphenicol_intermediate_breakpoint",
          "rank": 155,
          "slot_group": "Antimicrobial resistance"
        },
        "chloramphenicol_resistant_breakpoint": {
          "name": "chloramphenicol_resistant_breakpoint",
          "rank": 156,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_testing_standard": {
          "name": "ciprofloxacin_testing_standard",
          "rank": 157,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_testing_standard_version": {
          "name": "ciprofloxacin_testing_standard_version",
          "rank": 158,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_testing_standard_details": {
          "name": "ciprofloxacin_testing_standard_details",
          "rank": 159,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_susceptible_breakpoint": {
          "name": "ciprofloxacin_susceptible_breakpoint",
          "rank": 160,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_intermediate_breakpoint": {
          "name": "ciprofloxacin_intermediate_breakpoint",
          "rank": 161,
          "slot_group": "Antimicrobial resistance"
        },
        "ciprofloxacin_resistant_breakpoint": {
          "name": "ciprofloxacin_resistant_breakpoint",
          "rank": 162,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_testing_standard": {
          "name": "gentamicin_testing_standard",
          "rank": 163,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_testing_standard_version": {
          "name": "gentamicin_testing_standard_version",
          "rank": 164,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_testing_standard_details": {
          "name": "gentamicin_testing_standard_details",
          "rank": 165,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_susceptible_breakpoint": {
          "name": "gentamicin_susceptible_breakpoint",
          "rank": 166,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_intermediate_breakpoint": {
          "name": "gentamicin_intermediate_breakpoint",
          "rank": 167,
          "slot_group": "Antimicrobial resistance"
        },
        "gentamicin_resistant_breakpoint": {
          "name": "gentamicin_resistant_breakpoint",
          "rank": 168,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_testing_standard": {
          "name": "meropenem_testing_standard",
          "rank": 169,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_testing_standard_version": {
          "name": "meropenem_testing_standard_version",
          "rank": 170,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_testing_standard_details": {
          "name": "meropenem_testing_standard_details",
          "rank": 171,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_susceptible_breakpoint": {
          "name": "meropenem_susceptible_breakpoint",
          "rank": 172,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_intermediate_breakpoint": {
          "name": "meropenem_intermediate_breakpoint",
          "rank": 173,
          "slot_group": "Antimicrobial resistance"
        },
        "meropenem_resistant_breakpoint": {
          "name": "meropenem_resistant_breakpoint",
          "rank": 174,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_testing_standard": {
          "name": "nalidixic_acid_testing_standard",
          "rank": 175,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_testing_standard_version": {
          "name": "nalidixic_acid_testing_standard_version",
          "rank": 176,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_testing_standard_details": {
          "name": "nalidixic_acid_testing_standard_details",
          "rank": 177,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_susceptible_breakpoint": {
          "name": "nalidixic_acid_susceptible_breakpoint",
          "rank": 178,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_intermediate_breakpoint": {
          "name": "nalidixic_acid_intermediate_breakpoint",
          "rank": 179,
          "slot_group": "Antimicrobial resistance"
        },
        "nalidixic_acid_resistant_breakpoint": {
          "name": "nalidixic_acid_resistant_breakpoint",
          "rank": 180,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_testing_standard": {
          "name": "streptomycin_testing_standard",
          "rank": 181,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_testing_standard_version": {
          "name": "streptomycin_testing_standard_version",
          "rank": 182,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_testing_standard_details": {
          "name": "streptomycin_testing_standard_details",
          "rank": 183,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_susceptible_breakpoint": {
          "name": "streptomycin_susceptible_breakpoint",
          "rank": 184,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_intermediate_breakpoint": {
          "name": "streptomycin_intermediate_breakpoint",
          "rank": 185,
          "slot_group": "Antimicrobial resistance"
        },
        "streptomycin_resistant_breakpoint": {
          "name": "streptomycin_resistant_breakpoint",
          "rank": 186,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_testing_standard": {
          "name": "sulfisoxazole_testing_standard",
          "rank": 187,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_testing_standard_version": {
          "name": "sulfisoxazole_testing_standard_version",
          "rank": 188,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_testing_standard_details": {
          "name": "sulfisoxazole_testing_standard_details",
          "rank": 189,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_susceptible_breakpoint": {
          "name": "sulfisoxazole_susceptible_breakpoint",
          "rank": 190,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_intermediate_breakpoint": {
          "name": "sulfisoxazole_intermediate_breakpoint",
          "rank": 191,
          "slot_group": "Antimicrobial resistance"
        },
        "sulfisoxazole_resistant_breakpoint": {
          "name": "sulfisoxazole_resistant_breakpoint",
          "rank": 192,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_testing_standard": {
          "name": "tetracycline_testing_standard",
          "rank": 193,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_testing_standard_version": {
          "name": "tetracycline_testing_standard_version",
          "rank": 194,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_testing_standard_details": {
          "name": "tetracycline_testing_standard_details",
          "rank": 195,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_susceptible_breakpoint": {
          "name": "tetracycline_susceptible_breakpoint",
          "rank": 196,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_intermediate_breakpoint": {
          "name": "tetracycline_intermediate_breakpoint",
          "rank": 197,
          "slot_group": "Antimicrobial resistance"
        },
        "tetracycline_resistant_breakpoint": {
          "name": "tetracycline_resistant_breakpoint",
          "rank": 198,
          "slot_group": "Antimicrobial resistance"
        }
      },
      "attributes": {
        "sample_collector_sample_ID": {
          "name": "sample_collector_sample_ID",
          "description": "The user-defined name for the sample.",
          "title": "sample_collector_sample_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 1,
          "slot_uri": "GENEPIO:0001123",
          "alias": "sample_collector_sample_ID",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "alternative_sample_ID": {
          "name": "alternative_sample_ID",
          "description": "An alternative sample_ID assigned to the sample by another organization.",
          "title": "alternative_sample_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 2,
          "alias": "alternative_sample_ID",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "sample_collected_by": {
          "name": "sample_collected_by",
          "description": "The name of the agency, organization or institution with which the sample collector is affiliated.",
          "title": "sample_collected_by",
          "from_schema": "https://example.com/GRDI",
          "rank": 3,
          "slot_uri": "GENEPIO:0001153",
          "alias": "sample_collected_by",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "collected_by_laboratory_name": {
          "name": "collected_by_laboratory_name",
          "description": "The specific laboratory affiliation of the sample collector.",
          "title": "collected_by_laboratory_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 4,
          "alias": "collected_by_laboratory_name",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample_collection_project_name": {
          "name": "sample_collection_project_name",
          "description": "The name of the project/initiative/program for which the sample was collected.",
          "title": "sample_collection_project_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 5,
          "alias": "sample_collection_project_name",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample_plan_name": {
          "name": "sample_plan_name",
          "description": "The name of the study design for a surveillance project.",
          "title": "sample_plan_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 6,
          "alias": "sample_plan_name",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "sample_plan_ID": {
          "name": "sample_plan_ID",
          "description": "The identifier of the study design for a surveillance project.",
          "title": "sample_plan_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 7,
          "alias": "sample_plan_ID",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "sample_collector_contact_name": {
          "name": "sample_collector_contact_name",
          "description": "The name or job title of the contact responsible for follow-up regarding the sample.",
          "title": "sample_collector_contact_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 8,
          "alias": "sample_collector_contact_name",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample_collector_contact_email": {
          "name": "sample_collector_contact_email",
          "description": "The email address of the contact responsible for follow-up regarding the sample.",
          "title": "sample_collector_contact_email",
          "from_schema": "https://example.com/GRDI",
          "rank": 9,
          "alias": "sample_collector_contact_email",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "purpose_of_sampling": {
          "name": "purpose_of_sampling",
          "description": "The reason that the sample was collected.",
          "title": "purpose_of_sampling",
          "from_schema": "https://example.com/GRDI",
          "rank": 10,
          "slot_uri": "GENEPIO:0001198",
          "alias": "purpose_of_sampling",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "purpose_of_sampling menu",
          "required": true
        },
        "experimental_activity": {
          "name": "experimental_activity",
          "description": "The experimental activities or variables that affected the sample collected.",
          "title": "experimental_activity",
          "from_schema": "https://example.com/GRDI",
          "rank": 11,
          "alias": "experimental_activity",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "experimental_activity menu"
        },
        "experimental_activity_details": {
          "name": "experimental_activity_details",
          "description": "The details of the experimental activities or variables that affected the sample collected.",
          "title": "experimental_activity_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 12,
          "alias": "experimental_activity_details",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample_processing": {
          "name": "sample_processing",
          "description": "The processing applied to samples post-collection, prior to further testing, characterization, or isolation procedures.",
          "title": "sample_processing",
          "from_schema": "https://example.com/GRDI",
          "rank": 13,
          "alias": "sample_processing",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "sample_processing menu"
        },
        "geo_loc_name (country)": {
          "name": "geo_loc_name (country)",
          "description": "The country of origin of the sample.",
          "title": "geo_loc_name (country)",
          "from_schema": "https://example.com/GRDI",
          "rank": 14,
          "slot_uri": "GENEPIO:0001181",
          "alias": "geo_loc_name_(country)",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "geo_loc_name (country) menu",
          "required": true
        },
        "geo_loc_name (state/province/region)": {
          "name": "geo_loc_name (state/province/region)",
          "description": "The state/province/territory of origin of the sample.",
          "title": "geo_loc_name (state/province/region)",
          "from_schema": "https://example.com/GRDI",
          "rank": 15,
          "slot_uri": "GENEPIO:0001185",
          "alias": "geo_loc_name_(state/province/region)",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "geo_loc_name (state/province/region) menu",
          "required": true
        },
        "food_product_origin geo_loc_name (country)": {
          "name": "food_product_origin geo_loc_name (country)",
          "description": "The country of origin of a food product.",
          "title": "food_product_origin geo_loc_name (country)",
          "from_schema": "https://example.com/GRDI",
          "rank": 16,
          "alias": "food_product_origin_geo_loc_name_(country)",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "geo_loc_name (country) menu"
        },
        "host_origin geo_loc_name (country)": {
          "name": "host_origin geo_loc_name (country)",
          "description": "The country of origin of the host.",
          "title": "host_origin geo_loc_name (country)",
          "from_schema": "https://example.com/GRDI",
          "rank": 17,
          "alias": "host_origin_geo_loc_name_(country)",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "geo_loc_name (country) menu"
        },
        "latitude_of_sample_collection": {
          "name": "latitude_of_sample_collection",
          "description": "The latitude coordinates of the geographical location of sample collection.",
          "title": "latitude_of_sample_collection",
          "from_schema": "https://example.com/GRDI",
          "rank": 18,
          "slot_uri": "GENEPIO:0100309",
          "alias": "latitude_of_sample_collection",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "longitude_of_sample_collection": {
          "name": "longitude_of_sample_collection",
          "description": "The longitude coordinates of the geographical location of sample collection.",
          "title": "longitude_of_sample_collection",
          "from_schema": "https://example.com/GRDI",
          "rank": 19,
          "slot_uri": "GENEPIO:0100310",
          "alias": "longitude_of_sample_collection",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "sample_collection_date": {
          "name": "sample_collection_date",
          "description": "The date on which the sample was collected.",
          "title": "sample_collection_date",
          "from_schema": "https://example.com/GRDI",
          "rank": 20,
          "slot_uri": "GENEPIO:0001174",
          "alias": "sample_collection_date",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "date",
          "required": true
        },
        "sample_received_date": {
          "name": "sample_received_date",
          "description": "The date on which the sample was received.",
          "title": "sample_received_date",
          "from_schema": "https://example.com/GRDI",
          "rank": 21,
          "slot_uri": "GENEPIO:0001179",
          "alias": "sample_received_date",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "date"
        },
        "original_sample_description": {
          "name": "original_sample_description",
          "description": "The original sample description provided by the sample collector.",
          "title": "original_sample_description",
          "from_schema": "https://example.com/GRDI",
          "rank": 22,
          "alias": "original_sample_description",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString"
        },
        "environmental_site": {
          "name": "environmental_site",
          "description": "An environmental location may describe a site in the natural or built environment e.g. hospital, wet market, bat cave.",
          "title": "environmental_site",
          "from_schema": "https://example.com/GRDI",
          "rank": 23,
          "slot_uri": "GENEPIO:0001232",
          "alias": "environmental_site",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "animal_or_plant_population": {
          "name": "animal_or_plant_population",
          "description": "The type of animal or plant population inhabiting an area.",
          "title": "animal_or_plant_population",
          "from_schema": "https://example.com/GRDI",
          "rank": 24,
          "alias": "animal_or_plant_population",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "environmental_material": {
          "name": "environmental_material",
          "description": "A substance obtained from the natural or man-made environment e.g. soil, water, sewage, door handle, bed handrail, face mask.",
          "title": "environmental_material",
          "from_schema": "https://example.com/GRDI",
          "rank": 25,
          "slot_uri": "GENEPIO:0001223",
          "alias": "environmental_material",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "body_product": {
          "name": "body_product",
          "description": "A substance excreted/secreted from an organism e.g. feces, urine, sweat.",
          "title": "body_product",
          "from_schema": "https://example.com/GRDI",
          "rank": 26,
          "slot_uri": "GENEPIO:0001216",
          "alias": "body_product",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "anatomical_part": {
          "name": "anatomical_part",
          "description": "An anatomical part of an organism e.g. oropharynx.",
          "title": "anatomical_part",
          "from_schema": "https://example.com/GRDI",
          "rank": 27,
          "slot_uri": "GENEPIO:0001214",
          "alias": "anatomical_part",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "food_product": {
          "name": "food_product",
          "description": "A material consumed and digested for nutritional value or enjoyment.",
          "title": "food_product",
          "from_schema": "https://example.com/GRDI",
          "rank": 28,
          "alias": "food_product",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "food_product_properties": {
          "name": "food_product_properties",
          "description": "Any characteristic of the food product pertaining to its state, processing, a label claim, or implications for consumers.",
          "title": "food_product_properties",
          "from_schema": "https://example.com/GRDI",
          "rank": 29,
          "alias": "food_product_properties",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "animal_source_of_food": {
          "name": "animal_source_of_food",
          "description": "The animal from which the food product was derived.",
          "title": "animal_source_of_food",
          "from_schema": "https://example.com/GRDI",
          "rank": 30,
          "alias": "animal_source_of_food",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "food_packaging": {
          "name": "food_packaging",
          "description": "The type of packaging used to contain a food product.",
          "title": "food_packaging",
          "from_schema": "https://example.com/GRDI",
          "rank": 31,
          "alias": "food_packaging",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "collection_device": {
          "name": "collection_device",
          "description": "The instrument or container used to collect the sample e.g. swab.",
          "title": "collection_device",
          "from_schema": "https://example.com/GRDI",
          "rank": 32,
          "slot_uri": "GENEPIO:0001234",
          "alias": "collection_device",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "collection_method": {
          "name": "collection_method",
          "description": "The process used to collect the sample e.g. phlebotomy, necropsy.",
          "title": "collection_method",
          "from_schema": "https://example.com/GRDI",
          "rank": 33,
          "slot_uri": "GENEPIO:0001241",
          "alias": "collection_method",
          "owner": "GRDI",
          "slot_group": "Sample collection and processing",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "host (common name)": {
          "name": "host (common name)",
          "description": "The commonly used name of the host.",
          "title": "host (common name)",
          "from_schema": "https://example.com/GRDI",
          "rank": 34,
          "slot_uri": "GENEPIO:0001386",
          "alias": "host_(common_name)",
          "owner": "GRDI",
          "slot_group": "Host information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "host (scientific name)": {
          "name": "host (scientific name)",
          "description": "The taxonomic, or scientific name of the host.",
          "title": "host (scientific name)",
          "from_schema": "https://example.com/GRDI",
          "rank": 35,
          "slot_uri": "GENEPIO:0001387",
          "alias": "host_(scientific_name)",
          "owner": "GRDI",
          "slot_group": "Host information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "host_disease": {
          "name": "host_disease",
          "description": "The name of the disease experienced by the host.",
          "title": "host_disease",
          "from_schema": "https://example.com/GRDI",
          "rank": 36,
          "slot_uri": "GENEPIO:0001391",
          "alias": "host_disease",
          "owner": "GRDI",
          "slot_group": "Host information",
          "range": "WhitespaceMinimizedString"
        },
        "microbiological_method": {
          "name": "microbiological_method",
          "description": "The laboratory method used to grow, prepare, and/or isolate the microbial isolate.",
          "title": "microbiological_method",
          "from_schema": "https://example.com/GRDI",
          "rank": 37,
          "alias": "microbiological_method",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "strain": {
          "name": "strain",
          "description": "The strain identifier.",
          "title": "strain",
          "from_schema": "https://example.com/GRDI",
          "rank": 38,
          "alias": "strain",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "isolate_ID": {
          "name": "isolate_ID",
          "description": "The user-defined identifier for the isolate, as provided by the laboratory that originally isolated the isolate.",
          "title": "isolate_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 39,
          "alias": "isolate_ID",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "alternative_isolate_ID": {
          "name": "alternative_isolate_ID",
          "description": "An alternative isolate_ID assigned to the isolate by another organization.",
          "title": "alternative_isolate_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 40,
          "alias": "alternative_isolate_ID",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "progeny_isolate_ID": {
          "name": "progeny_isolate_ID",
          "description": "The identifier assigned to a progenitor isolate derived from an isolate that was directly obtained from a sample.",
          "title": "progeny_isolate_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 41,
          "alias": "progeny_isolate_ID",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "IRIDA_isolate_ID": {
          "name": "IRIDA_isolate_ID",
          "description": "The identifier of the isolate in the IRIDA platform.",
          "title": "IRIDA_isolate_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 42,
          "alias": "IRIDA_isolate_ID",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "IRIDA_project_ID": {
          "name": "IRIDA_project_ID",
          "description": "The identifier of the Project in the iRIDA platform.",
          "title": "IRIDA_project_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 43,
          "alias": "IRIDA_project_ID",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "isolated_by_institution_name": {
          "name": "isolated_by_institution_name",
          "description": "The name of the agency, organization or institution with which the individual who performed the isolation procedure is affiliated.",
          "title": "isolated_by_institution_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 44,
          "alias": "isolated_by_institution_name",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "isolated_by_laboratory_name": {
          "name": "isolated_by_laboratory_name",
          "description": "The specific laboratory affiliation of the individual who performed the isolation procedure.",
          "title": "isolated_by_laboratory_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 45,
          "alias": "isolated_by_laboratory_name",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "isolated_by_contact_name": {
          "name": "isolated_by_contact_name",
          "description": "The name or title of the contact responsible for follow-up regarding the isolate.",
          "title": "isolated_by_contact_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 46,
          "alias": "isolated_by_contact_name",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "isolated_by_contact_email": {
          "name": "isolated_by_contact_email",
          "description": "The email address of the contact responsible for follow-up regarding the isolate.",
          "title": "isolated_by_contact_email",
          "from_schema": "https://example.com/GRDI",
          "rank": 47,
          "alias": "isolated_by_contact_email",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "isolation_date": {
          "name": "isolation_date",
          "description": "The date on which the isolate was isolated from a sample.",
          "title": "isolation_date",
          "from_schema": "https://example.com/GRDI",
          "rank": 48,
          "alias": "isolation_date",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "date"
        },
        "isolate_received_date": {
          "name": "isolate_received_date",
          "description": "The date on which the isolate was received by the laboratory.",
          "title": "isolate_received_date",
          "from_schema": "https://example.com/GRDI",
          "rank": 49,
          "alias": "isolate_received_date",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "organism": {
          "name": "organism",
          "description": "Taxonomic name of the organism.",
          "title": "organism",
          "from_schema": "https://example.com/GRDI",
          "rank": 50,
          "slot_uri": "GENEPIO:0001191",
          "alias": "organism",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "serovar": {
          "name": "serovar",
          "description": "The serovar of the organism.",
          "title": "serovar",
          "from_schema": "https://example.com/GRDI",
          "rank": 51,
          "alias": "serovar",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "serotyping_method": {
          "name": "serotyping_method",
          "description": "The method used to determine the serovar.",
          "title": "serotyping_method",
          "from_schema": "https://example.com/GRDI",
          "rank": 52,
          "alias": "serotyping_method",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "phagetype": {
          "name": "phagetype",
          "description": "The phagetype of the organism.",
          "title": "phagetype",
          "from_schema": "https://example.com/GRDI",
          "rank": 53,
          "alias": "phagetype",
          "owner": "GRDI",
          "slot_group": "Strain and isolation information",
          "range": "WhitespaceMinimizedString"
        },
        "library_ID": {
          "name": "library_ID",
          "description": "The user-specified identifier for the library prepared for sequencing.",
          "title": "library_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 54,
          "slot_uri": "GENEPIO:0001448",
          "alias": "library_ID",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced_by_institution_name": {
          "name": "sequenced_by_institution_name",
          "description": "The name of the agency, organization or institution responsible for sequencing the isolate's genome.",
          "title": "sequenced_by_institution_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 55,
          "alias": "sequenced_by_institution_name",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "sequenced_by_laboratory_name": {
          "name": "sequenced_by_laboratory_name",
          "description": "The specific laboratory affiliation of the responsible for sequencing the isolate's genome.",
          "title": "sequenced_by_laboratory_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 56,
          "alias": "sequenced_by_laboratory_name",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced_by_contact_name": {
          "name": "sequenced_by_contact_name",
          "description": "The name or title of the contact responsible for follow-up regarding the sequence.",
          "title": "sequenced_by_contact_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 57,
          "alias": "sequenced_by_contact_name",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "sequenced_by_contact_email": {
          "name": "sequenced_by_contact_email",
          "description": "The email address of the contact responsible for follow-up regarding the sequence.",
          "title": "sequenced_by_contact_email",
          "from_schema": "https://example.com/GRDI",
          "rank": 58,
          "alias": "sequenced_by_contact_email",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString",
          "required": true
        },
        "purpose_of_sequencing": {
          "name": "purpose_of_sequencing",
          "description": "The reason that the sample was sequenced.",
          "title": "purpose_of_sequencing",
          "from_schema": "https://example.com/GRDI",
          "rank": 59,
          "slot_uri": "GENEPIO:0001445",
          "alias": "purpose_of_sequencing",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "purpose_of_sequencing menu",
          "required": true
        },
        "sequencing_project_name": {
          "name": "sequencing_project_name",
          "description": "The name of the project/initiative/program for which sequencing was performed.",
          "title": "sequencing_project_name",
          "from_schema": "https://example.com/GRDI",
          "rank": 60,
          "alias": "sequencing_project_name",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "sequencing_platform": {
          "name": "sequencing_platform",
          "description": "The platform technology used to perform the sequencing.",
          "title": "sequencing_platform",
          "from_schema": "https://example.com/GRDI",
          "rank": 61,
          "alias": "sequencing_platform",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "sequencing_platform menu"
        },
        "sequencing_instrument": {
          "name": "sequencing_instrument",
          "description": "The model of the sequencing instrument used.",
          "title": "sequencing_instrument",
          "from_schema": "https://example.com/GRDI",
          "rank": 62,
          "slot_uri": "GENEPIO:0001452",
          "alias": "sequencing_instrument",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "sequencing_instrument menu"
        },
        "sequencing_protocol": {
          "name": "sequencing_protocol",
          "description": "The protocol or method used for sequencing.",
          "title": "sequencing_protocol",
          "from_schema": "https://example.com/GRDI",
          "rank": 63,
          "slot_uri": "GENEPIO:0001454",
          "alias": "sequencing_protocol",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "r1_fastq_filename": {
          "name": "r1_fastq_filename",
          "description": "The user-specified filename of the r1 FASTQ file.",
          "title": "r1_fastq_filename",
          "from_schema": "https://example.com/GRDI",
          "rank": 64,
          "slot_uri": "GENEPIO:0001476",
          "alias": "r1_fastq_filename",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "r2_fastq_filename": {
          "name": "r2_fastq_filename",
          "description": "The user-specified filename of the r2 FASTQ file.",
          "title": "r2_fastq_filename",
          "from_schema": "https://example.com/GRDI",
          "rank": 65,
          "slot_uri": "GENEPIO:0001477",
          "alias": "r2_fastq_filename",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "fast5_filename": {
          "name": "fast5_filename",
          "description": "The user-specified filename of the FAST5 file.",
          "title": "fast5_filename",
          "from_schema": "https://example.com/GRDI",
          "rank": 66,
          "slot_uri": "GENEPIO:0001480",
          "alias": "fast5_filename",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "assembly_filename": {
          "name": "assembly_filename",
          "description": "The user-defined filename of the FASTA file.",
          "title": "assembly_filename",
          "from_schema": "https://example.com/GRDI",
          "rank": 67,
          "alias": "assembly_filename",
          "owner": "GRDI",
          "slot_group": "Sequence information",
          "range": "WhitespaceMinimizedString"
        },
        "publication_ID": {
          "name": "publication_ID",
          "description": "The identifier for a publication.",
          "title": "publication_ID",
          "from_schema": "https://example.com/GRDI",
          "rank": 68,
          "alias": "publication_ID",
          "owner": "GRDI",
          "slot_group": "Public repository information",
          "range": "WhitespaceMinimizedString"
        },
        "attribute_package": {
          "name": "attribute_package",
          "description": "The attribute package used to structure metadata in an INSDC BioSample.",
          "title": "attribute_package",
          "from_schema": "https://example.com/GRDI",
          "rank": 69,
          "alias": "attribute_package",
          "owner": "GRDI",
          "slot_group": "Public repository information",
          "range": "attribute_package menu"
        },
        "biosample_accession": {
          "name": "biosample_accession",
          "description": "The identifier assigned to a BioSample in INSDC archives.",
          "title": "biosample_accession",
          "from_schema": "https://example.com/GRDI",
          "rank": 70,
          "slot_uri": "GENEPIO:0001139",
          "alias": "biosample_accession",
          "owner": "GRDI",
          "slot_group": "Public repository information",
          "range": "WhitespaceMinimizedString"
        },
        "SRA_accession": {
          "name": "SRA_accession",
          "description": "The Sequence Read Archive (SRA), European Nucleotide Archive (ENA) or DDBJ Sequence Read Archive (DRA) identifier linking raw read data, methodological metadata and quality control metrics submitted to the INSDC.",
          "title": "SRA_accession",
          "from_schema": "https://example.com/GRDI",
          "rank": 71,
          "slot_uri": "GENEPIO:0001142",
          "alias": "SRA_accession",
          "owner": "GRDI",
          "slot_group": "Public repository information",
          "range": "WhitespaceMinimizedString"
        },
        "GenBank_accession": {
          "name": "GenBank_accession",
          "description": "The GenBank/ENA/DDBJ identifier assigned to the sequence in the INSDC archives.",
          "title": "GenBank_accession",
          "from_schema": "https://example.com/GRDI",
          "rank": 72,
          "slot_uri": "GENEPIO:0001145",
          "alias": "GenBank_accession",
          "owner": "GRDI",
          "slot_group": "Public repository information",
          "range": "WhitespaceMinimizedString"
        },
        "prevalence_metrics": {
          "name": "prevalence_metrics",
          "description": "Metrics regarding the prevalence of the pathogen of interest obtained from a surveillance project.",
          "title": "prevalence_metrics",
          "from_schema": "https://example.com/GRDI",
          "rank": 73,
          "alias": "prevalence_metrics",
          "owner": "GRDI",
          "slot_group": "Risk assessment information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "prevalence_metrics_details": {
          "name": "prevalence_metrics_details",
          "description": "The details pertaining to the prevalence metrics from a surveillance project.",
          "title": "prevalence_metrics_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 74,
          "alias": "prevalence_metrics_details",
          "owner": "GRDI",
          "slot_group": "Risk assessment information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "stage_of_production": {
          "name": "stage_of_production",
          "description": "The stage of food production.",
          "title": "stage_of_production",
          "from_schema": "https://example.com/GRDI",
          "rank": 75,
          "alias": "stage_of_production",
          "owner": "GRDI",
          "slot_group": "Risk assessment information",
          "range": "stage_of_production menu",
          "recommended": true
        },
        "experimental_intervention": {
          "name": "experimental_intervention",
          "description": "The category of the experimental intervention applied in the food production system.",
          "title": "experimental_intervention",
          "from_schema": "https://example.com/GRDI",
          "rank": 76,
          "alias": "experimental_intervention",
          "owner": "GRDI",
          "slot_group": "Risk assessment information",
          "range": "experimental_intervention menu",
          "recommended": true
        },
        "experiment_intervention_details": {
          "name": "experiment_intervention_details",
          "description": "The details of the experimental intervention applied in the food production system.",
          "title": "experiment_intervention_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 77,
          "alias": "experiment_intervention_details",
          "owner": "GRDI",
          "slot_group": "Risk assessment information",
          "range": "WhitespaceMinimizedString",
          "recommended": true
        },
        "AMR_laboratory_typing_method": {
          "name": "AMR_laboratory_typing_method",
          "description": "Type of method used for antibiotic susceptibility testing.",
          "title": "AMR_laboratory_typing_method",
          "from_schema": "https://example.com/GRDI",
          "rank": 78,
          "alias": "AMR_laboratory_typing_method",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "AMR_laboratory_typing_platform": {
          "name": "AMR_laboratory_typing_platform",
          "description": "The brand/platform used for antibiotic susceptibility testing",
          "title": "AMR_laboratory_typing_platform",
          "from_schema": "https://example.com/GRDI",
          "rank": 79,
          "alias": "AMR_laboratory_typing_platform",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "AMR_laboratory_typing_platform_version": {
          "name": "AMR_laboratory_typing_platform_version",
          "description": "The specific name and version of the plate, panel, or other platform used for antibiotic susceptibility testing.",
          "title": "AMR_laboratory_typing_platform_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 80,
          "alias": "AMR_laboratory_typing_platform_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "AMR_measurement_units": {
          "name": "AMR_measurement_units",
          "description": "Units used for measuring antibiotic susceptibility",
          "title": "AMR_measurement_units",
          "from_schema": "https://example.com/GRDI",
          "rank": 81,
          "alias": "AMR_measurement_units",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_resistance_phenotype": {
          "name": "amoxicillin-clavulanic_acid_resistance_phenotype",
          "description": "Antimicrobial resistance phenotype, as determined by the antibiotic susceptibility measurement and testing standard for this antibiotic",
          "title": "amoxicillin-clavulanic_acid_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 82,
          "alias": "amoxicillin_clavulanic_acid_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_measurement_sign": {
          "name": "amoxicillin-clavulanic_acid_measurement_sign",
          "description": "Qualifier associated with the antibiotic susceptibility measurement",
          "title": "amoxicillin-clavulanic_acid_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 83,
          "alias": "amoxicillin_clavulanic_acid_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_measurement": {
          "name": "amoxicillin-clavulanic_acid_measurement",
          "description": "Antibiotic susceptibility measurement, measured in the units specified in the “AMR_measurement_units” field.",
          "title": "amoxicillin-clavulanic_acid_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 84,
          "alias": "amoxicillin_clavulanic_acid_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_resistance_phenotype": {
          "name": "ampicillin_resistance_phenotype",
          "title": "ampicillin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 85,
          "alias": "ampicillin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_measurement_sign": {
          "name": "ampicillin_measurement_sign",
          "title": "ampicillin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 86,
          "alias": "ampicillin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_measurement": {
          "name": "ampicillin_measurement",
          "title": "ampicillin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 87,
          "alias": "ampicillin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_resistance_phenotype": {
          "name": "azithromycin_resistance_phenotype",
          "title": "azithromycin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 88,
          "alias": "azithromycin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_measurement_sign": {
          "name": "azithromycin_measurement_sign",
          "title": "azithromycin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 89,
          "alias": "azithromycin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_measurement": {
          "name": "azithromycin_measurement",
          "title": "azithromycin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 90,
          "alias": "azithromycin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_resistance_phenotype": {
          "name": "cefoxitin_resistance_phenotype",
          "title": "cefoxitin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 91,
          "alias": "cefoxitin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_measurement_sign": {
          "name": "cefoxitin_measurement_sign",
          "title": "cefoxitin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 92,
          "alias": "cefoxitin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_measurement": {
          "name": "cefoxitin_measurement",
          "title": "cefoxitin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 93,
          "alias": "cefoxitin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_resistance_phenotype": {
          "name": "ceftriaxone_resistance_phenotype",
          "title": "ceftriaxone_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 94,
          "alias": "ceftriaxone_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_measurement_sign": {
          "name": "ceftriaxone_measurement_sign",
          "title": "ceftriaxone_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 95,
          "alias": "ceftriaxone_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_measurement": {
          "name": "ceftriaxone_measurement",
          "title": "ceftriaxone_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 96,
          "alias": "ceftriaxone_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_resistance_phenotype": {
          "name": "chloramphenicol_resistance_phenotype",
          "title": "chloramphenicol_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 97,
          "alias": "chloramphenicol_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_measurement_sign": {
          "name": "chloramphenicol_measurement_sign",
          "title": "chloramphenicol_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 98,
          "alias": "chloramphenicol_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_measurement": {
          "name": "chloramphenicol_measurement",
          "title": "chloramphenicol_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 99,
          "alias": "chloramphenicol_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_resistance_phenotype": {
          "name": "ciprofloxacin_resistance_phenotype",
          "title": "ciprofloxacin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 100,
          "alias": "ciprofloxacin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_measurement_sign": {
          "name": "ciprofloxacin_measurement_sign",
          "title": "ciprofloxacin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 101,
          "alias": "ciprofloxacin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_measurement": {
          "name": "ciprofloxacin_measurement",
          "title": "ciprofloxacin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 102,
          "alias": "ciprofloxacin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_resistance_phenotype": {
          "name": "gentamicin_resistance_phenotype",
          "title": "gentamicin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 103,
          "alias": "gentamicin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_measurement_sign": {
          "name": "gentamicin_measurement_sign",
          "title": "gentamicin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 104,
          "alias": "gentamicin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_measurement": {
          "name": "gentamicin_measurement",
          "title": "gentamicin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 105,
          "alias": "gentamicin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_resistance_phenotype": {
          "name": "meropenem_resistance_phenotype",
          "title": "meropenem_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 106,
          "alias": "meropenem_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_measurement_sign": {
          "name": "meropenem_measurement_sign",
          "title": "meropenem_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 107,
          "alias": "meropenem_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_measurement": {
          "name": "meropenem_measurement",
          "title": "meropenem_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 108,
          "alias": "meropenem_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_resistance_phenotype": {
          "name": "nalidixic_acid_resistance_phenotype",
          "title": "nalidixic_acid_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 109,
          "alias": "nalidixic_acid_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_measurement_sign": {
          "name": "nalidixic_acid_measurement_sign",
          "title": "nalidixic_acid_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 110,
          "alias": "nalidixic_acid_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_measurement": {
          "name": "nalidixic_acid_measurement",
          "title": "nalidixic_acid_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 111,
          "alias": "nalidixic_acid_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_resistance_phenotype": {
          "name": "streptomycin_resistance_phenotype",
          "title": "streptomycin_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 112,
          "alias": "streptomycin_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_measurement_sign": {
          "name": "streptomycin_measurement_sign",
          "title": "streptomycin_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 113,
          "alias": "streptomycin_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_measurement": {
          "name": "streptomycin_measurement",
          "title": "streptomycin_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 114,
          "alias": "streptomycin_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_resistance_phenotype": {
          "name": "sulfisoxazole_resistance_phenotype",
          "title": "sulfisoxazole_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 115,
          "alias": "sulfisoxazole_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_measurement_sign": {
          "name": "sulfisoxazole_measurement_sign",
          "title": "sulfisoxazole_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 116,
          "alias": "sulfisoxazole_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_measurement": {
          "name": "sulfisoxazole_measurement",
          "title": "sulfisoxazole_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 117,
          "alias": "sulfisoxazole_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_resistance_phenotype": {
          "name": "tetracycline_resistance_phenotype",
          "title": "tetracycline_resistance_phenotype",
          "from_schema": "https://example.com/GRDI",
          "rank": 118,
          "alias": "tetracycline_resistance_phenotype",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_measurement_sign": {
          "name": "tetracycline_measurement_sign",
          "title": "tetracycline_measurement_sign",
          "from_schema": "https://example.com/GRDI",
          "rank": 119,
          "alias": "tetracycline_measurement_sign",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_measurement": {
          "name": "tetracycline_measurement",
          "title": "tetracycline_measurement",
          "from_schema": "https://example.com/GRDI",
          "rank": 120,
          "alias": "tetracycline_measurement",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_testing_standard": {
          "name": "amoxicillin-clavulanic_acid_testing_standard",
          "description": "Testing standard used for determination of resistance phenotype",
          "title": "amoxicillin-clavulanic_acid_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 121,
          "alias": "amoxicillin_clavulanic_acid_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_testing_standard_version": {
          "name": "amoxicillin-clavulanic_acid_testing_standard_version",
          "description": "Version number associated with the testing standard used for determination of resistance phenotype",
          "title": "amoxicillin-clavulanic_acid_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 122,
          "alias": "amoxicillin_clavulanic_acid_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_testing_standard_details": {
          "name": "amoxicillin-clavulanic_acid_testing_standard_details",
          "description": "Additional details associated with the testing standard used for determination of resistance phenotype",
          "title": "amoxicillin-clavulanic_acid_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 123,
          "alias": "amoxicillin_clavulanic_acid_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_susceptible_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_susceptible_breakpoint",
          "description": "Maximum measurement, in the units specified in the “AMR_measurement_units” field, for a sample to be considered “sensitive” to this antibiotic",
          "title": "amoxicillin-clavulanic_acid_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 124,
          "alias": "amoxicillin_clavulanic_acid_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_intermediate_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_intermediate_breakpoint",
          "description": "Intermediate measurement(s), in the units specified in the “AMR_measurement_units” field, where a sample would be considered to have an “intermediate” phenotype for this antibiotic",
          "title": "amoxicillin-clavulanic_acid_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 125,
          "alias": "amoxicillin_clavulanic_acid_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "amoxicillin-clavulanic_acid_resistant_breakpoint": {
          "name": "amoxicillin-clavulanic_acid_resistant_breakpoint",
          "description": "Minimum measurement, in the units specified in the “AMR_measurement_units” field, for a sample to be considered “resistant” to this antibiotic",
          "title": "amoxicillin-clavulanic_acid_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 126,
          "alias": "amoxicillin_clavulanic_acid_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_testing_standard": {
          "name": "ampicillin_testing_standard",
          "title": "ampicillin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 127,
          "alias": "ampicillin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_testing_standard_version": {
          "name": "ampicillin_testing_standard_version",
          "title": "ampicillin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 128,
          "alias": "ampicillin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_testing_standard_details": {
          "name": "ampicillin_testing_standard_details",
          "title": "ampicillin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 129,
          "alias": "ampicillin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_susceptible_breakpoint": {
          "name": "ampicillin_susceptible_breakpoint",
          "title": "ampicillin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 130,
          "alias": "ampicillin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_intermediate_breakpoint": {
          "name": "ampicillin_intermediate_breakpoint",
          "title": "ampicillin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 131,
          "alias": "ampicillin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ampicillin_resistant_breakpoint": {
          "name": "ampicillin_resistant_breakpoint",
          "title": "ampicillin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 132,
          "alias": "ampicillin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_testing_standard": {
          "name": "azithromycin_testing_standard",
          "title": "azithromycin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 133,
          "alias": "azithromycin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_testing_standard_version": {
          "name": "azithromycin_testing_standard_version",
          "title": "azithromycin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 134,
          "alias": "azithromycin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_testing_standard_details": {
          "name": "azithromycin_testing_standard_details",
          "title": "azithromycin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 135,
          "alias": "azithromycin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_susceptible_breakpoint": {
          "name": "azithromycin_susceptible_breakpoint",
          "title": "azithromycin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 136,
          "alias": "azithromycin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_intermediate_breakpoint": {
          "name": "azithromycin_intermediate_breakpoint",
          "title": "azithromycin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 137,
          "alias": "azithromycin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "azithromycin_resistant_breakpoint": {
          "name": "azithromycin_resistant_breakpoint",
          "title": "azithromycin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 138,
          "alias": "azithromycin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_testing_standard": {
          "name": "cefoxitin_testing_standard",
          "title": "cefoxitin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 139,
          "alias": "cefoxitin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_testing_standard_version": {
          "name": "cefoxitin_testing_standard_version",
          "title": "cefoxitin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 140,
          "alias": "cefoxitin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_testing_standard_details": {
          "name": "cefoxitin_testing_standard_details",
          "title": "cefoxitin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 141,
          "alias": "cefoxitin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_susceptible_breakpoint": {
          "name": "cefoxitin_susceptible_breakpoint",
          "title": "cefoxitin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 142,
          "alias": "cefoxitin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_intermediate_breakpoint": {
          "name": "cefoxitin_intermediate_breakpoint",
          "title": "cefoxitin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 143,
          "alias": "cefoxitin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "cefoxitin_resistant_breakpoint": {
          "name": "cefoxitin_resistant_breakpoint",
          "title": "cefoxitin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 144,
          "alias": "cefoxitin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_testing_standard": {
          "name": "ceftriaxone_testing_standard",
          "title": "ceftriaxone_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 145,
          "alias": "ceftriaxone_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_testing_standard_version": {
          "name": "ceftriaxone_testing_standard_version",
          "title": "ceftriaxone_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 146,
          "alias": "ceftriaxone_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_testing_standard_details": {
          "name": "ceftriaxone_testing_standard_details",
          "title": "ceftriaxone_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 147,
          "alias": "ceftriaxone_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_susceptible_breakpoint": {
          "name": "ceftriaxone_susceptible_breakpoint",
          "title": "ceftriaxone_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 148,
          "alias": "ceftriaxone_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_intermediate_breakpoint": {
          "name": "ceftriaxone_intermediate_breakpoint",
          "title": "ceftriaxone_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 149,
          "alias": "ceftriaxone_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ceftriaxone_resistant_breakpoint": {
          "name": "ceftriaxone_resistant_breakpoint",
          "title": "ceftriaxone_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 150,
          "alias": "ceftriaxone_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_testing_standard": {
          "name": "chloramphenicol_testing_standard",
          "title": "chloramphenicol_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 151,
          "alias": "chloramphenicol_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_testing_standard_version": {
          "name": "chloramphenicol_testing_standard_version",
          "title": "chloramphenicol_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 152,
          "alias": "chloramphenicol_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_testing_standard_details": {
          "name": "chloramphenicol_testing_standard_details",
          "title": "chloramphenicol_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 153,
          "alias": "chloramphenicol_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_susceptible_breakpoint": {
          "name": "chloramphenicol_susceptible_breakpoint",
          "title": "chloramphenicol_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 154,
          "alias": "chloramphenicol_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_intermediate_breakpoint": {
          "name": "chloramphenicol_intermediate_breakpoint",
          "title": "chloramphenicol_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 155,
          "alias": "chloramphenicol_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "chloramphenicol_resistant_breakpoint": {
          "name": "chloramphenicol_resistant_breakpoint",
          "title": "chloramphenicol_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 156,
          "alias": "chloramphenicol_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_testing_standard": {
          "name": "ciprofloxacin_testing_standard",
          "title": "ciprofloxacin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 157,
          "alias": "ciprofloxacin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_testing_standard_version": {
          "name": "ciprofloxacin_testing_standard_version",
          "title": "ciprofloxacin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 158,
          "alias": "ciprofloxacin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_testing_standard_details": {
          "name": "ciprofloxacin_testing_standard_details",
          "title": "ciprofloxacin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 159,
          "alias": "ciprofloxacin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_susceptible_breakpoint": {
          "name": "ciprofloxacin_susceptible_breakpoint",
          "title": "ciprofloxacin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 160,
          "alias": "ciprofloxacin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_intermediate_breakpoint": {
          "name": "ciprofloxacin_intermediate_breakpoint",
          "title": "ciprofloxacin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 161,
          "alias": "ciprofloxacin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "ciprofloxacin_resistant_breakpoint": {
          "name": "ciprofloxacin_resistant_breakpoint",
          "title": "ciprofloxacin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 162,
          "alias": "ciprofloxacin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_testing_standard": {
          "name": "gentamicin_testing_standard",
          "title": "gentamicin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 163,
          "alias": "gentamicin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_testing_standard_version": {
          "name": "gentamicin_testing_standard_version",
          "title": "gentamicin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 164,
          "alias": "gentamicin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_testing_standard_details": {
          "name": "gentamicin_testing_standard_details",
          "title": "gentamicin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 165,
          "alias": "gentamicin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_susceptible_breakpoint": {
          "name": "gentamicin_susceptible_breakpoint",
          "title": "gentamicin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 166,
          "alias": "gentamicin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_intermediate_breakpoint": {
          "name": "gentamicin_intermediate_breakpoint",
          "title": "gentamicin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 167,
          "alias": "gentamicin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "gentamicin_resistant_breakpoint": {
          "name": "gentamicin_resistant_breakpoint",
          "title": "gentamicin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 168,
          "alias": "gentamicin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_testing_standard": {
          "name": "meropenem_testing_standard",
          "title": "meropenem_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 169,
          "alias": "meropenem_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_testing_standard_version": {
          "name": "meropenem_testing_standard_version",
          "title": "meropenem_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 170,
          "alias": "meropenem_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_testing_standard_details": {
          "name": "meropenem_testing_standard_details",
          "title": "meropenem_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 171,
          "alias": "meropenem_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_susceptible_breakpoint": {
          "name": "meropenem_susceptible_breakpoint",
          "title": "meropenem_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 172,
          "alias": "meropenem_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_intermediate_breakpoint": {
          "name": "meropenem_intermediate_breakpoint",
          "title": "meropenem_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 173,
          "alias": "meropenem_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "meropenem_resistant_breakpoint": {
          "name": "meropenem_resistant_breakpoint",
          "title": "meropenem_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 174,
          "alias": "meropenem_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_testing_standard": {
          "name": "nalidixic_acid_testing_standard",
          "title": "nalidixic_acid_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 175,
          "alias": "nalidixic_acid_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_testing_standard_version": {
          "name": "nalidixic_acid_testing_standard_version",
          "title": "nalidixic_acid_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 176,
          "alias": "nalidixic_acid_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_testing_standard_details": {
          "name": "nalidixic_acid_testing_standard_details",
          "title": "nalidixic_acid_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 177,
          "alias": "nalidixic_acid_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_susceptible_breakpoint": {
          "name": "nalidixic_acid_susceptible_breakpoint",
          "title": "nalidixic_acid_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 178,
          "alias": "nalidixic_acid_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_intermediate_breakpoint": {
          "name": "nalidixic_acid_intermediate_breakpoint",
          "title": "nalidixic_acid_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 179,
          "alias": "nalidixic_acid_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "nalidixic_acid_resistant_breakpoint": {
          "name": "nalidixic_acid_resistant_breakpoint",
          "title": "nalidixic_acid_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 180,
          "alias": "nalidixic_acid_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_testing_standard": {
          "name": "streptomycin_testing_standard",
          "title": "streptomycin_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 181,
          "alias": "streptomycin_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_testing_standard_version": {
          "name": "streptomycin_testing_standard_version",
          "title": "streptomycin_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 182,
          "alias": "streptomycin_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_testing_standard_details": {
          "name": "streptomycin_testing_standard_details",
          "title": "streptomycin_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 183,
          "alias": "streptomycin_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_susceptible_breakpoint": {
          "name": "streptomycin_susceptible_breakpoint",
          "title": "streptomycin_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 184,
          "alias": "streptomycin_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_intermediate_breakpoint": {
          "name": "streptomycin_intermediate_breakpoint",
          "title": "streptomycin_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 185,
          "alias": "streptomycin_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "streptomycin_resistant_breakpoint": {
          "name": "streptomycin_resistant_breakpoint",
          "title": "streptomycin_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 186,
          "alias": "streptomycin_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_testing_standard": {
          "name": "sulfisoxazole_testing_standard",
          "title": "sulfisoxazole_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 187,
          "alias": "sulfisoxazole_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_testing_standard_version": {
          "name": "sulfisoxazole_testing_standard_version",
          "title": "sulfisoxazole_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 188,
          "alias": "sulfisoxazole_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_testing_standard_details": {
          "name": "sulfisoxazole_testing_standard_details",
          "title": "sulfisoxazole_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 189,
          "alias": "sulfisoxazole_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_susceptible_breakpoint": {
          "name": "sulfisoxazole_susceptible_breakpoint",
          "title": "sulfisoxazole_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 190,
          "alias": "sulfisoxazole_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_intermediate_breakpoint": {
          "name": "sulfisoxazole_intermediate_breakpoint",
          "title": "sulfisoxazole_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 191,
          "alias": "sulfisoxazole_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "sulfisoxazole_resistant_breakpoint": {
          "name": "sulfisoxazole_resistant_breakpoint",
          "title": "sulfisoxazole_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 192,
          "alias": "sulfisoxazole_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_testing_standard": {
          "name": "tetracycline_testing_standard",
          "title": "tetracycline_testing_standard",
          "from_schema": "https://example.com/GRDI",
          "rank": 193,
          "alias": "tetracycline_testing_standard",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_testing_standard_version": {
          "name": "tetracycline_testing_standard_version",
          "title": "tetracycline_testing_standard_version",
          "from_schema": "https://example.com/GRDI",
          "rank": 194,
          "alias": "tetracycline_testing_standard_version",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_testing_standard_details": {
          "name": "tetracycline_testing_standard_details",
          "title": "tetracycline_testing_standard_details",
          "from_schema": "https://example.com/GRDI",
          "rank": 195,
          "alias": "tetracycline_testing_standard_details",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_susceptible_breakpoint": {
          "name": "tetracycline_susceptible_breakpoint",
          "title": "tetracycline_susceptible_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 196,
          "alias": "tetracycline_susceptible_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_intermediate_breakpoint": {
          "name": "tetracycline_intermediate_breakpoint",
          "title": "tetracycline_intermediate_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 197,
          "alias": "tetracycline_intermediate_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
          "range": "WhitespaceMinimizedString"
        },
        "tetracycline_resistant_breakpoint": {
          "name": "tetracycline_resistant_breakpoint",
          "title": "tetracycline_resistant_breakpoint",
          "from_schema": "https://example.com/GRDI",
          "rank": 198,
          "alias": "tetracycline_resistant_breakpoint",
          "owner": "GRDI",
          "slot_group": "Antimicrobial resistance",
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