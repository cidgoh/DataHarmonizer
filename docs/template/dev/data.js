var DATA = [
  {
    "fieldName": "nmdc:default",
    "children": [
      {
        "fieldName": "id",
        "capitalize": "",
        "ontology_id": "nmdc:id",
        "datatype": "xs:unique",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "id"
            }
          ]
        }
      },
      {
        "fieldName": "depth2",
        "capitalize": "",
        "ontology_id": "nmdc:depth2",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "depth2"
            }
          ]
        }
      },
      {
        "fieldName": "identifier",
        "capitalize": "",
        "ontology_id": "nmdc:identifier",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "identifier"
            }
          ]
        }
      },
      {
        "fieldName": "name",
        "capitalize": "",
        "ontology_id": "nmdc:name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A human readable label for an entity",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "name"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "MIXS:core field",
    "children": [
      {
        "fieldName": "history/agrochemical additions",
        "capitalize": "",
        "ontology_id": "MIXS:0000639",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
        "guidance": "Expected value: agrochemical name;agrochemical amount;timestamp|Preferred unit: gram, mole per liter, milligram per liter",
        "examples": "roundup;5 milligram per liter;2018-06-21",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Aluminum saturation (esp. For tropical soils)",
        "guidance": "Expected value: measurement value|Preferred unit: percentage",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining Al saturation",
        "guidance": "Expected value: PMID,DOI or URL",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "Expected value: measurement value|Preferred unit: millimeter",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean annual temperature",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius",
        "examples": "12.5 degree Celsius",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Whether or not crop is rotated, and if yes, rotation schedule",
        "guidance": "Expected value: crop rotation status;schedule",
        "examples": "yes;R2/2017-01-01/2018-12-31/P6M",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Present state of sample site",
        "guidance": "Expected value: enumeration",
        "examples": "conifers",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
        "guidance": "Expected value: current vegetation type",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in vegetation classification",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Drainage classification from a standard system such as the USDA system",
        "guidance": "Expected value: enumeration",
        "examples": "well",
        "exportField": {
          "dev": [
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
        "fieldName": "history/extreme events",
        "capitalize": "",
        "ontology_id": "MIXS:0000320",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Unusual physical events that may have affected microbial populations",
        "guidance": "Expected value: date",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
        "guidance": "Expected value: enumeration",
        "examples": "Luvisols",
        "exportField": {
          "dev": [
            {
              "field": "fao_class"
            }
          ]
        },
        "schema:ItemList": {
          "Acrisols": {
            "ontology_id": "ENVO:00002234"
          },
          "Andosols": {
            "ontology_id": "ENVO:00002232"
          },
          "Arenosols": {
            "ontology_id": "ENVO:00002229"
          },
          "Cambisols": {
            "ontology_id": "ENVO:00002235"
          },
          "Chernozems": {
            "ontology_id": "ENVO:00002237"
          },
          "Ferralsols": {
            "ontology_id": "ENVO:00002246"
          },
          "Fluvisols": {
            "ontology_id": "ENVO:00002273"
          },
          "Gleysols": {
            "ontology_id": "ENVO:00002244"
          },
          "Gypsisols": {
            "ontology_id": "ENVO:00002245"
          },
          "Histosols": {
            "ontology_id": "ENVO:00002243"
          },
          "Kastanozems": {
            "ontology_id": "ENVO:00002240"
          },
          "Luvisols": {
            "ontology_id": "ENVO:00002248"
          },
          "Phaeozems": {
            "ontology_id": "ENVO:00002249"
          },
          "Planosols": {
            "ontology_id": "ENVO:00002251"
          },
          "Podzols": {
            "ontology_id": "ENVO:00002257"
          },
          "Regosols": {
            "ontology_id": "ENVO:00002256"
          },
          "Solonchaks": {
            "ontology_id": "ENVO:00002252"
          },
          "Solonetz": {
            "ontology_id": "ENVO:00002255"
          },
          "Vertisols": {
            "ontology_id": "ENVO:00002254"
          }
        }
      },
      {
        "fieldName": "history/fire",
        "capitalize": "",
        "ontology_id": "MIXS:0001086",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Historical and/or physical evidence of fire",
        "guidance": "Expected value: date",
        "examples": "",
        "exportField": {
          "dev": [
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
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Historical and/or physical evidence of flooding",
        "guidance": "Expected value: date",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.",
        "guidance": "Expected value: heavy metal name;measurement value unit|Preferred unit: microgram per gram",
        "examples": "mercury;0.09 micrograms per gram",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining heavy metals",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the horizon",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Link to digitized soil maps or other soil classification information",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Link to climate resource",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Soil classification based on local soil classification system",
        "guidance": "Expected value: local classification name",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the local soil classification",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "local_class_meth"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "micro_biomass_meth"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
        "guidance": "Expected value: measurement value|Preferred unit: ton, kilogram, gram per kilogram soil",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "microbial_biomass"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Any other measurement performed or parameter collected, that is not listed here",
        "guidance": "Expected value: parameter name;measurement value",
        "examples": "Bicarbonate ion concentration;2075 micromole per kilogram",
        "exportField": {
          "dev": [
            {
              "field": "misc_param"
            }
          ]
        }
      },
      {
        "fieldName": "pH",
        "capitalize": "",
        "ontology_id": "MIXS:0001001",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
        "guidance": "Expected value: measurement value",
        "examples": "7.2",
        "exportField": {
          "dev": [
            {
              "field": "ph"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining ph",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ph_meth"
            }
          ]
        }
      },
      {
        "fieldName": "history/previous land use method",
        "capitalize": "",
        "ontology_id": "MIXS:0000316",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining previous land use and dates",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Previous land use and dates",
        "guidance": "Expected value: land use name;date",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
        "guidance": "Expected value: enumeration",
        "examples": "summit",
        "exportField": {
          "dev": [
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
        "fieldName": "salinity method",
        "capitalize": "",
        "ontology_id": "MIXS:0000341",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining salinity",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "salinity_meth"
            }
          ]
        }
      },
      {
        "fieldName": "mean seasonal precipitation",
        "capitalize": "",
        "ontology_id": "MIXS:0000645",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "Expected value: measurement value|Preferred unit: millimeter",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean seasonal temperature",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius",
        "examples": "18 degree Celsius",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "season_temp"
            }
          ]
        }
      },
      {
        "fieldName": "composite design/sieving",
        "capitalize": "",
        "ontology_id": "MIXS:0000322",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
        "guidance": "Expected value: design name and/or size;amount",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "sieving"
            }
          ]
        }
      },
      {
        "fieldName": "slope aspect",
        "capitalize": "",
        "ontology_id": "MIXS:0000647",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
        "guidance": "Expected value: measurement value|Preferred unit: degree",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "slope_aspect"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
        "guidance": "Expected value: measurement value|Preferred unit: percentage",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
        "guidance": "Expected value: enumeration",
        "examples": "A horizon",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
        "guidance": "Expected value: measurement value",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil texture",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.",
        "guidance": "Expected value: ENVO_00001998",
        "examples": "plinthosol [ENVO:00002250]",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil series name or other lower-level classification",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "soil_type_meth"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Note method(s) used for tilling",
        "guidance": "Expected value: enumeration",
        "examples": "chisel",
        "exportField": {
          "dev": [
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
        "fieldName": "total nitrogen content method",
        "capitalize": "",
        "ontology_id": "MIXS:0000338",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the total nitrogen",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "tot_nitro_cont_meth"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total nitrogen content of the sample",
        "guidance": "Expected value: measurement value|Preferred unit: microgram per liter, micromole per liter, milligram per liter",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_nitro_content"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining total organic carbon",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "tot_org_c_meth"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
        "guidance": "Expected value: measurement value|Preferred unit: gram Carbon per kilogram sample material",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_org_carb"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the water content of soil",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "water_cont_soil_meth"
            }
          ]
        }
      },
      {
        "fieldName": "water content",
        "capitalize": "",
        "ontology_id": "MIXS:0000185",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Water content measurement",
        "guidance": "Expected value: measurement value|Preferred unit: gram per gram or cubic centimeter per cubic centimeter",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "water_content"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "MIXS:environment field",
    "children": [
      {
        "fieldName": "altitude",
        "capitalize": "",
        "ontology_id": "MIXS:0000094",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
        "guidance": "Expected value: measurement value",
        "examples": "100 meter",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "alt"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
        "guidance": "Expected value: measurement value",
        "examples": "100 meter",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "elev"
            }
          ]
        }
      },
      {
        "fieldName": "broad-scale environmental context",
        "capitalize": "",
        "ontology_id": "MIXS:0000012",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
        "guidance": "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes.",
        "examples": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean",
        "exportField": {
          "dev": [
            {
              "field": "env_broad_scale"
            }
          ]
        }
      },
      {
        "fieldName": "local environmental context",
        "capitalize": "",
        "ontology_id": "MIXS:0000013",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
        "guidance": "Expected value: Environmental entities having causal influences upon the entity at time of sampling.",
        "examples": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336].",
        "exportField": {
          "dev": [
            {
              "field": "env_local_scale"
            }
          ]
        }
      },
      {
        "fieldName": "environmental medium",
        "capitalize": "",
        "ontology_id": "MIXS:0000014",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
        "guidance": "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483].",
        "examples": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]",
        "exportField": {
          "dev": [
            {
              "field": "env_medium"
            }
          ]
        }
      },
      {
        "fieldName": "geographic location (country and/or sea,region)",
        "capitalize": "",
        "ontology_id": "MIXS:0000010",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
        "guidance": "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name",
        "examples": "USA: Maryland, Bethesda",
        "exportField": {
          "dev": [
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system",
        "guidance": "Expected value: decimal degrees,  limit to 8 decimal points",
        "examples": "50.586825 6.408977",
        "exportField": {
          "dev": [
            {
              "field": "lat_lon"
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
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Temperature of the sample at the time of sampling.",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius",
        "examples": "25 degree Celsius",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "temp"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "dcterms:default",
    "children": [
      {
        "fieldName": "description",
        "capitalize": "",
        "ontology_id": "dcterms:description",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "a human-readable description of a thing",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "description"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "nmdc:gold_path_field",
    "children": [
      {
        "fieldName": "ecosystem",
        "capitalize": "",
        "ontology_id": "nmdc:ecosystem",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "TODO",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ecosystem"
            }
          ]
        }
      },
      {
        "fieldName": "ecosystem_category",
        "capitalize": "",
        "ontology_id": "nmdc:ecosystem_category",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "TODO",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ecosystem_category"
            }
          ]
        }
      },
      {
        "fieldName": "ecosystem_subtype",
        "capitalize": "",
        "ontology_id": "nmdc:ecosystem_subtype",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "TODO",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ecosystem_subtype"
            }
          ]
        }
      },
      {
        "fieldName": "ecosystem_type",
        "capitalize": "",
        "ontology_id": "nmdc:ecosystem_type",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "TODO",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ecosystem_type"
            }
          ]
        }
      },
      {
        "fieldName": "specific_ecosystem",
        "capitalize": "",
        "ontology_id": "nmdc:specific_ecosystem",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "TODO",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "specific_ecosystem"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "nmdc:sample identifiers",
    "children": [
      {
        "fieldName": "GOLD sample identifiers",
        "capitalize": "",
        "ontology_id": "nmdc:GOLD_sample_identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "identifiers for corresponding sample in GOLD",
        "guidance": "|^GOLD:Gb[0-9]+$",
        "examples": "https://identifiers.org/gold:GbTODO",
        "pattern": "^GOLD:Gb[0-9]+$",
        "exportField": {
          "dev": [
            {
              "field": "GOLD sample identifiers"
            }
          ]
        }
      },
      {
        "fieldName": "INSDC biosample identifiers",
        "capitalize": "",
        "ontology_id": "nmdc:INSDC_biosample_identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "identifiers for corresponding sample in INSDC",
        "guidance": "|^biosample:SAM[NED]([A-Z])?[0-9]+$",
        "examples": "https://identifiers.org/biosample:SAMEA5989477|https://identifiers.org/biosample:SAMD00212331",
        "pattern": "^biosample:SAM[NED]([A-Z])?[0-9]+$",
        "exportField": {
          "dev": [
            {
              "field": "INSDC biosample identifiers"
            }
          ]
        }
      },
      {
        "fieldName": "INSDC secondary sample identifiers",
        "capitalize": "",
        "ontology_id": "nmdc:INSDC_secondary_sample_identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": [
          "default"
        ],
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "secondary identifiers for corresponding sample in INSDC",
        "guidance": "ENA redirects these to primary IDs, e.g. https://www.ebi.ac.uk/ena/browser/view/DRS166340 -> SAMD00212331|MGnify uses these as their primary sample IDs|^biosample:(E|D|S)RS[0-9]{6,}$",
        "examples": "https://identifiers.org/insdc.sra:DRS166340",
        "pattern": "^biosample:(E|D|S)RS[0-9]{6,}$",
        "exportField": {
          "dev": [
            {
              "field": "INSDC secondary sample identifiers"
            }
          ]
        }
      }
    ]
  }
]