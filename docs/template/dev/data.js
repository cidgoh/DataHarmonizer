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
        "dataStatus": null,
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
        "fieldName": "add_date",
        "capitalize": "",
        "ontology_id": "nmdc:add_date",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The date on which the information was added to the database.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "add_date"
            }
          ]
        }
      },
      {
        "fieldName": "alternative identifiers",
        "capitalize": "",
        "ontology_id": "nmdc:alternative identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "A list of alternative identifiers for the entity.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "alternative identifiers"
            }
          ]
        }
      },
      {
        "fieldName": "community",
        "capitalize": "",
        "ontology_id": "nmdc:community",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "community"
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
        "dataStatus": null,
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
        "fieldName": "habitat",
        "capitalize": "",
        "ontology_id": "nmdc:habitat",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "habitat"
            }
          ]
        }
      },
      {
        "fieldName": "host_name",
        "capitalize": "",
        "ontology_id": "nmdc:host_name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "host_name"
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
        "dataStatus": null,
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
        "fieldName": "location",
        "capitalize": "",
        "ontology_id": "nmdc:location",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "location"
            }
          ]
        }
      },
      {
        "fieldName": "mod_date",
        "capitalize": "",
        "ontology_id": "nmdc:mod_date",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The last date on which the database information was modified.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "mod_date"
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
        "dataStatus": null,
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
      },
      {
        "fieldName": "ncbi_taxonomy_name",
        "capitalize": "",
        "ontology_id": "nmdc:ncbi_taxonomy_name",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "ncbi_taxonomy_name"
            }
          ]
        }
      },
      {
        "fieldName": "proport_woa_temperature",
        "capitalize": "",
        "ontology_id": "nmdc:proport_woa_temperature",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "proport_woa_temperature"
            }
          ]
        }
      },
      {
        "fieldName": "salinity_category",
        "capitalize": "",
        "ontology_id": "nmdc:salinity_category",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Categorcial description of the sample's salinity. Examples: halophile, halotolerant, hypersaline, huryhaline",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "salinity_category"
            }
          ]
        }
      },
      {
        "fieldName": "sample_collection_site",
        "capitalize": "",
        "ontology_id": "nmdc:sample_collection_site",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "sample_collection_site"
            }
          ]
        }
      },
      {
        "fieldName": "soluble_iron_micromol",
        "capitalize": "",
        "ontology_id": "nmdc:soluble_iron_micromol",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "soluble_iron_micromol"
            }
          ]
        }
      },
      {
        "fieldName": "subsurface_depth",
        "capitalize": "",
        "ontology_id": "nmdc:subsurface_depth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
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
              "field": "subsurface_depth"
            }
          ]
        }
      },
      {
        "fieldName": "subsurface_depth2",
        "capitalize": "",
        "ontology_id": "nmdc:subsurface_depth2",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
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
              "field": "subsurface_depth2"
            }
          ]
        }
      },
      {
        "fieldName": "type",
        "capitalize": "",
        "ontology_id": "nmdc:type",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "An optional string that specifies the type object.  This is used to allow for searches for different kinds of objects.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "type"
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
        "guidance": "Expected value: agrochemical name;agrochemical amount;timestamp|Preferred unit: gram, mole per liter, milligram per liter",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Aluminum saturation (esp. For tropical soils)",
        "guidance": "Expected value: measurement value|Preferred unit: percentage|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "Expected value: measurement value|Preferred unit: millimeter|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean annual temperature",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius|\\d+[.\\d+] \\S+",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Whether or not crop is rotated, and if yes, rotation schedule",
        "guidance": "Expected value: crop rotation status;schedule",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Present state of sample site",
        "guidance": "Expected value: enumeration|[cities|farmstead|industrial areas|roads\\/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines\\/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage\\-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi\\-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]",
        "examples": "",
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Drainage classification from a standard system such as the USDA system",
        "guidance": "Expected value: enumeration|[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]",
        "examples": "",
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
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
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
        "fieldName": "extreme_unusual_properties/salinity",
        "capitalize": "",
        "ontology_id": "MIXS:0000651",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measured salinity",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "extreme_salinity"
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
        "guidance": "Expected value: enumeration|[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]",
        "examples": "",
        "exportField": {
          "dev": [
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
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "MIxS_soil:Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.|NMDC_biosample:Heavy metals present and concentrationsany drug used by subject and the frequency of usage; can include multiple heavy metals and concentrations",
        "guidance": "Expected value: heavy metal name;measurement value unit|Preferred unit: microgram per gram",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "fieldName": "links to additional analysis",
        "capitalize": "",
        "ontology_id": "MIXS:0000340",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Link to additional analysis results performed on the sample",
        "guidance": "Expected value: PMID,DOI or url",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "link_addit_analys"
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass",
        "guidance": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
        "guidance": "Expected value: measurement value|Preferred unit: ton, kilogram, gram per kilogram soil|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Any other measurement performed or parameter collected, that is not listed here",
        "guidance": "Expected value: parameter name;measurement value",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
        "guidance": "Expected value: measurement value|\\d+[.\\d+]",
        "examples": "",
        "pattern": "\\d+[.\\d+]",
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
        "dataStatus": null,
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
        "fieldName": "pooling of DNA extracts (if done)",
        "capitalize": "",
        "ontology_id": "MIXS:0000325",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Indicate whether multiple DNA extractions were mixed. If the answer yes, the number of extracts that were pooled should be given",
        "guidance": "Expected value: pooling status;number of pooled extracts",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "pool_dna_extracts"
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining previous land use and dates",
        "guidance": "",
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
        "guidance": "Expected value: enumeration|[summit|shoulder|backslope|footslope|toeslope]",
        "examples": "",
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
        "guidance": "Expected value: measurement value|Preferred unit: millimeter|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Mean seasonal temperature",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius|\\d+[.\\d+] \\S+",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
        "guidance": "Expected value: design name and/or size;amount",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
        "guidance": "Expected value: measurement value|Preferred unit: degree|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
        "guidance": "Expected value: measurement value|Preferred unit: percentage|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
        "guidance": "",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
        "guidance": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil texture",
        "guidance": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "MIxS_soil:Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.|NMDC_biosample:Soil series name or other lower-level classification",
        "guidance": "Expected value: ENVO_00001998",
        "examples": "",
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
        "dataStatus": null,
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
        "fieldName": "storage conditions",
        "capitalize": "",
        "ontology_id": "MIXS:0000327",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "MIxS_soil:Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).|NMDC_biosample:Explain how and for how long the soil sample was stored before DNA extraction",
        "guidance": "Expected value: storage condition type;duration",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "store_cond"
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
        "guidance": "Expected value: enumeration|[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the total nitrogen",
        "guidance": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total nitrogen content of the sample",
        "guidance": "Expected value: measurement value|Preferred unit: microgram per liter, micromole per liter, milligram per liter|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
        "guidance": "Expected value: measurement value|Preferred unit: gram Carbon per kilogram sample material|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the water content of soil",
        "guidance": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Water content measurement",
        "guidance": "Expected value: measurement value|Preferred unit: gram per gram or cubic centimeter per cubic centimeter|\\d+[.\\d+] \\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
        "guidance": "Expected value: measurement value|\\d+[.\\d+] \\S+",
        "examples": "",
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
        "fieldName": "collection date",
        "capitalize": "",
        "ontology_id": "MIXS:0000011",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
        "guidance": "Expected value: date and time",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "collection_date"
            }
          ]
        }
      },
      {
        "fieldName": "depth",
        "capitalize": "",
        "ontology_id": "MIXS:0000018",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "MIxS_soil:The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.|NMDC_biosample:Please refer to the definitions of depth in the environmental packages",
        "guidance": "Expected value: measurement value",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "depth"
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
        "guidance": "Expected value: measurement value|\\d+[.\\d+] \\S+",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
        "guidance": "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes.|.* \\S+:\\S+",
        "examples": "",
        "pattern": ".* \\S+:\\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
        "guidance": "Expected value: Environmental entities having causal influences upon the entity at time of sampling.|.* \\S+:\\S+",
        "examples": "",
        "pattern": ".* \\S+:\\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
        "guidance": "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483].|.* \\S+:\\S+",
        "examples": "",
        "pattern": ".* \\S+:\\S+",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
        "guidance": "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name",
        "examples": "",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "MIxS:The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system|NMDC: This is currently a required field but it's not clear if this should be required for human hosts",
        "guidance": "Expected value: decimal degrees,  limit to 8 decimal points|\\d+[.\\d+] \\d+[.\\d+]",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\d+[.\\d+]",
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
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "MIxS_soil:Temperature of the sample at the time of sampling.|NMDC_biosample:Temperature of the sample at the time of sampling",
        "guidance": "Expected value: measurement value|Preferred unit: degree Celsius|\\d+[.\\d+] \\S+",
        "examples": "",
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
        "dataStatus": null,
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
      },
      {
        "fieldName": "part of",
        "capitalize": "",
        "ontology_id": "dcterms:isPartOf",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Links a resource to another resource that either logically or physically includes it.",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "part of"
            }
          ]
        }
      }
    ]
  },
  {
    "fieldName": "nmdc:attribute",
    "children": [
      {
        "fieldName": "alkalinity",
        "capitalize": "",
        "ontology_id": "nmdc:alkalinity",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Alkalinity, the ability of a solution to neutralize acids to the equivalence point of carbonate or bicarbonate\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "alkalinity"
            }
          ]
        }
      },
      {
        "fieldName": "alkalinity_method",
        "capitalize": "",
        "ontology_id": "nmdc:alkalinity_method",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Method used for alkalinity measurement",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "alkalinity_method"
            }
          ]
        }
      },
      {
        "fieldName": "alkyl_diethers",
        "capitalize": "",
        "ontology_id": "nmdc:alkyl_diethers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of alkyl diethers ",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "alkyl_diethers"
            }
          ]
        }
      },
      {
        "fieldName": "aminopept_act",
        "capitalize": "",
        "ontology_id": "nmdc:aminopept_act",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of aminopeptidase activity",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "aminopept_act"
            }
          ]
        }
      },
      {
        "fieldName": "ammonium",
        "capitalize": "",
        "ontology_id": "nmdc:ammonium",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of ammonium in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "ammonium"
            }
          ]
        }
      },
      {
        "fieldName": "bacteria_carb_prod",
        "capitalize": "",
        "ontology_id": "nmdc:bacteria_carb_prod",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of bacterial carbon production",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "bacteria_carb_prod"
            }
          ]
        }
      },
      {
        "fieldName": "bishomohopanol",
        "capitalize": "",
        "ontology_id": "nmdc:bishomohopanol",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of bishomohopanol ",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "bishomohopanol"
            }
          ]
        }
      },
      {
        "fieldName": "bromide",
        "capitalize": "",
        "ontology_id": "nmdc:bromide",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of bromide ",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "bromide"
            }
          ]
        }
      },
      {
        "fieldName": "calcium",
        "capitalize": "",
        "ontology_id": "nmdc:calcium",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of calcium in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "calcium"
            }
          ]
        }
      },
      {
        "fieldName": "carb_nitro_ratio",
        "capitalize": "",
        "ontology_id": "nmdc:carb_nitro_ratio",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Ratio of amount or concentrations of carbon to nitrogen",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "carb_nitro_ratio"
            }
          ]
        }
      },
      {
        "fieldName": "chem_administration",
        "capitalize": "",
        "ontology_id": "nmdc:chem_administration",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi\"",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "chem_administration"
            }
          ]
        }
      },
      {
        "fieldName": "chloride",
        "capitalize": "",
        "ontology_id": "nmdc:chloride",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of chloride in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "chloride"
            }
          ]
        }
      },
      {
        "fieldName": "chlorophyll",
        "capitalize": "",
        "ontology_id": "nmdc:chlorophyll",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of chlorophyll",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "chlorophyll"
            }
          ]
        }
      },
      {
        "fieldName": "density",
        "capitalize": "",
        "ontology_id": "nmdc:density",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Density of the sample, which is its mass per unit volume (aka volumetric mass density)\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "density"
            }
          ]
        }
      },
      {
        "fieldName": "diss_carb_dioxide",
        "capitalize": "",
        "ontology_id": "nmdc:diss_carb_dioxide",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of dissolved carbon dioxide in the sample or liquid portion of the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_carb_dioxide"
            }
          ]
        }
      },
      {
        "fieldName": "diss_hydrogen",
        "capitalize": "",
        "ontology_id": "nmdc:diss_hydrogen",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of dissolved hydrogen",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_hydrogen"
            }
          ]
        }
      },
      {
        "fieldName": "diss_inorg_carb",
        "capitalize": "",
        "ontology_id": "nmdc:diss_inorg_carb",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Dissolved inorganic carbon concentration in the sample, typically measured after filtering the sample using a 0.45 micrometer filter\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_inorg_carb"
            }
          ]
        }
      },
      {
        "fieldName": "diss_inorg_phosp",
        "capitalize": "",
        "ontology_id": "nmdc:diss_inorg_phosp",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of dissolved inorganic phosphorus in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_inorg_phosp"
            }
          ]
        }
      },
      {
        "fieldName": "diss_org_carb",
        "capitalize": "",
        "ontology_id": "nmdc:diss_org_carb",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Concentration of dissolved organic carbon in the sample, liquid portion of the sample, or aqueous phase of the fluid\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_org_carb"
            }
          ]
        }
      },
      {
        "fieldName": "diss_org_nitro",
        "capitalize": "",
        "ontology_id": "nmdc:diss_org_nitro",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Dissolved organic nitrogen concentration measured as; total dissolved nitrogen - NH4 - NO3 - NO2",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_org_nitro"
            }
          ]
        }
      },
      {
        "fieldName": "diss_oxygen",
        "capitalize": "",
        "ontology_id": "nmdc:diss_oxygen",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of dissolved oxygen",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "diss_oxygen"
            }
          ]
        }
      },
      {
        "fieldName": "env_package",
        "capitalize": "",
        "ontology_id": "nmdc:env_package",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"MIxS extension for reporting of measurements and observations obtained from one or more of the environments where the sample was obtained. All environmental packages listed here are further defined in separate subtables. By giving the name of the environmental package, a selection of fields can be made from the subtables and can be reported\"",
        "guidance": "|[air|built environment|host\\-associated|human\\-associated|human\\-skin|human\\-oral|human\\-gut|human\\-vaginal|hydrocarbon resources\\-cores|hydrocarbon resources\\-fluids\\/swabs|microbial mat\\/biofilm|misc environment|plant\\-associated|sediment|soil|wastewater\\/sludge|water]",
        "examples": "",
        "pattern": "[air|built environment|host\\-associated|human\\-associated|human\\-skin|human\\-oral|human\\-gut|human\\-vaginal|hydrocarbon resources\\-cores|hydrocarbon resources\\-fluids\\/swabs|microbial mat\\/biofilm|misc environment|plant\\-associated|sediment|soil|wastewater\\/sludge|water]",
        "exportField": {
          "dev": [
            {
              "field": "env_package"
            }
          ]
        }
      },
      {
        "fieldName": "glucosidase_act",
        "capitalize": "",
        "ontology_id": "nmdc:glucosidase_act",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of glucosidase activity",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "glucosidase_act"
            }
          ]
        }
      },
      {
        "fieldName": "horizon",
        "capitalize": "",
        "ontology_id": "nmdc:horizon",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
        "guidance": "|[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]",
        "examples": "",
        "pattern": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]",
        "exportField": {
          "dev": [
            {
              "field": "horizon"
            }
          ]
        }
      },
      {
        "fieldName": "magnesium",
        "capitalize": "",
        "ontology_id": "nmdc:magnesium",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of magnesium in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "magnesium"
            }
          ]
        }
      },
      {
        "fieldName": "mean_frict_vel",
        "capitalize": "",
        "ontology_id": "nmdc:mean_frict_vel",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of mean friction velocity",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "mean_frict_vel"
            }
          ]
        }
      },
      {
        "fieldName": "mean_peak_frict_vel",
        "capitalize": "",
        "ontology_id": "nmdc:mean_peak_frict_vel",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of mean peak friction velocity",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "mean_peak_frict_vel"
            }
          ]
        }
      },
      {
        "fieldName": "microbial_biomass_meth",
        "capitalize": "",
        "ontology_id": "nmdc:microbial_biomass_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining microbial biomass",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "microbial_biomass_meth"
            }
          ]
        }
      },
      {
        "fieldName": "n_alkanes",
        "capitalize": "",
        "ontology_id": "nmdc:n_alkanes",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of n-alkanes; can include multiple n-alkanes",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "n_alkanes"
            }
          ]
        }
      },
      {
        "fieldName": "nitrate",
        "capitalize": "",
        "ontology_id": "nmdc:nitrate",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of nitrate in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "nitrate"
            }
          ]
        }
      },
      {
        "fieldName": "nitrite",
        "capitalize": "",
        "ontology_id": "nmdc:nitrite",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of nitrite in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "nitrite"
            }
          ]
        }
      },
      {
        "fieldName": "org_matter",
        "capitalize": "",
        "ontology_id": "nmdc:org_matter",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of organic matter ",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "org_matter"
            }
          ]
        }
      },
      {
        "fieldName": "org_nitro",
        "capitalize": "",
        "ontology_id": "nmdc:org_nitro",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of organic nitrogen",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "org_nitro"
            }
          ]
        }
      },
      {
        "fieldName": "organism_count",
        "capitalize": "",
        "ontology_id": "nmdc:organism_count",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Total cell count of any organism (or group of organisms) per gram, volume or area of sample, should include name of organism followed by count. The method that was used for the enumeration (e.g. qPCR, atp, mpn, etc.) Should also be provided. (example: total prokaryotes; 3.5e7 cells per ml; qpcr)\"",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "organism_count"
            }
          ]
        }
      },
      {
        "fieldName": "oxy_stat_samp",
        "capitalize": "",
        "ontology_id": "nmdc:oxy_stat_samp",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Oxygenation status of sample",
        "guidance": "|[aerobic|anaerobic|other]",
        "examples": "",
        "pattern": "[aerobic|anaerobic|other]",
        "exportField": {
          "dev": [
            {
              "field": "oxy_stat_samp"
            }
          ]
        }
      },
      {
        "fieldName": "part_org_carb",
        "capitalize": "",
        "ontology_id": "nmdc:part_org_carb",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of particulate organic carbon",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "part_org_carb"
            }
          ]
        }
      },
      {
        "fieldName": "perturbation",
        "capitalize": "",
        "ontology_id": "nmdc:perturbation",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Type of perturbation, e.g. chemical administration, physical disturbance, etc., coupled with perturbation regimen including how many times the perturbation was repeated, how long each perturbation lasted, and the start and end time of the entire perturbation period; can include multiple perturbation types\"",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "perturbation"
            }
          ]
        }
      },
      {
        "fieldName": "petroleum_hydrocarb",
        "capitalize": "",
        "ontology_id": "nmdc:petroleum_hydrocarb",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of petroleum hydrocarbon",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "petroleum_hydrocarb"
            }
          ]
        }
      },
      {
        "fieldName": "phaeopigments",
        "capitalize": "",
        "ontology_id": "nmdc:phaeopigments",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of phaeopigments; can include multiple phaeopigments",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "phaeopigments"
            }
          ]
        }
      },
      {
        "fieldName": "phosplipid_fatt_acid",
        "capitalize": "",
        "ontology_id": "nmdc:phosplipid_fatt_acid",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of phospholipid fatty acids; can include multiple values",
        "guidance": "",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "phosplipid_fatt_acid"
            }
          ]
        }
      },
      {
        "fieldName": "potassium",
        "capitalize": "",
        "ontology_id": "nmdc:potassium",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of potassium in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "potassium"
            }
          ]
        }
      },
      {
        "fieldName": "pressure",
        "capitalize": "",
        "ontology_id": "nmdc:pressure",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Pressure to which the sample is subject to, in atmospheres\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "pressure"
            }
          ]
        }
      },
      {
        "fieldName": "previous_land_use_meth",
        "capitalize": "",
        "ontology_id": "nmdc:previous_land_use_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining previous land use and dates",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "previous_land_use_meth"
            }
          ]
        }
      },
      {
        "fieldName": "redox_potential",
        "capitalize": "",
        "ontology_id": "nmdc:redox_potential",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Redox potential, measured relative to a hydrogen cell, indicating oxidation or reduction potential\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "redox_potential"
            }
          ]
        }
      },
      {
        "fieldName": "salinity",
        "capitalize": "",
        "ontology_id": "nmdc:salinity",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Salinity is the total concentration of all dissolved salts in a water sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "salinity"
            }
          ]
        }
      },
      {
        "fieldName": "samp_collect_device",
        "capitalize": "",
        "ontology_id": "nmdc:samp_collect_device",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "The method or device employed for collecting the sample",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "samp_collect_device"
            }
          ]
        }
      },
      {
        "fieldName": "samp_mat_process",
        "capitalize": "",
        "ontology_id": "nmdc:samp_mat_process",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Any processing applied to the sample during or after retrieving the sample from environment. This field accepts OBI, for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI\"",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "samp_mat_process"
            }
          ]
        }
      },
      {
        "fieldName": "samp_store_dur",
        "capitalize": "",
        "ontology_id": "nmdc:samp_store_dur",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Duration for which the sample was stored",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "samp_store_dur"
            }
          ]
        }
      },
      {
        "fieldName": "samp_store_loc",
        "capitalize": "",
        "ontology_id": "nmdc:samp_store_loc",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Location at which sample was stored, usually name of a specific freezer/room\"",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "samp_store_loc"
            }
          ]
        }
      },
      {
        "fieldName": "samp_store_temp",
        "capitalize": "",
        "ontology_id": "nmdc:samp_store_temp",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Temperature at which sample was stored, e.g. -80 degree Celsius\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "samp_store_temp"
            }
          ]
        }
      },
      {
        "fieldName": "samp_vol_we_dna_ext",
        "capitalize": "",
        "ontology_id": "nmdc:samp_vol_we_dna_ext",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Volume (ml), weight (g) of processed sample, or surface area swabbed from sample for DNA extraction\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "samp_vol_we_dna_ext"
            }
          ]
        }
      },
      {
        "fieldName": "size_frac_low",
        "capitalize": "",
        "ontology_id": "nmdc:size_frac_low",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "size_frac_low"
            }
          ]
        }
      },
      {
        "fieldName": "size_frac_up",
        "capitalize": "",
        "ontology_id": "nmdc:size_frac_up",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "size_frac_up"
            }
          ]
        }
      },
      {
        "fieldName": "sodium",
        "capitalize": "",
        "ontology_id": "nmdc:sodium",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Sodium concentration in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "sodium"
            }
          ]
        }
      },
      {
        "fieldName": "sulfate",
        "capitalize": "",
        "ontology_id": "nmdc:sulfate",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of sulfate in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "sulfate"
            }
          ]
        }
      },
      {
        "fieldName": "sulfide",
        "capitalize": "",
        "ontology_id": "nmdc:sulfide",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Concentration of sulfide in the sample",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "sulfide"
            }
          ]
        }
      },
      {
        "fieldName": "texture",
        "capitalize": "",
        "ontology_id": "nmdc:texture",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "texture"
            }
          ]
        }
      },
      {
        "fieldName": "texture_meth",
        "capitalize": "",
        "ontology_id": "nmdc:texture_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining soil texture",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "texture_meth"
            }
          ]
        }
      },
      {
        "fieldName": "tidal_stage",
        "capitalize": "",
        "ontology_id": "nmdc:tidal_stage",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Stage of tide",
        "guidance": "|[low tide|ebb tide|flood tide|high tide]",
        "examples": "",
        "pattern": "[low tide|ebb tide|flood tide|high tide]",
        "exportField": {
          "dev": [
            {
              "field": "tidal_stage"
            }
          ]
        }
      },
      {
        "fieldName": "tot_carb",
        "capitalize": "",
        "ontology_id": "nmdc:tot_carb",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Total carbon content",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_carb"
            }
          ]
        }
      },
      {
        "fieldName": "tot_depth_water_col",
        "capitalize": "",
        "ontology_id": "nmdc:tot_depth_water_col",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Measurement of total depth of water column",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_depth_water_col"
            }
          ]
        }
      },
      {
        "fieldName": "tot_diss_nitro",
        "capitalize": "",
        "ontology_id": "nmdc:tot_diss_nitro",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Total dissolved nitrogen concentration, reported as nitrogen, measured by: total dissolved nitrogen = NH4 + NO3NO2 + dissolved organic nitrogen\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_diss_nitro"
            }
          ]
        }
      },
      {
        "fieldName": "tot_nitro_content_meth",
        "capitalize": "",
        "ontology_id": "nmdc:tot_nitro_content_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the total nitrogen",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "tot_nitro_content_meth"
            }
          ]
        }
      },
      {
        "fieldName": "tot_phosp",
        "capitalize": "",
        "ontology_id": "nmdc:tot_phosp",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "\"Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus\"",
        "guidance": "|\\d+[.\\d+] \\S+",
        "examples": "",
        "pattern": "\\d+[.\\d+] \\S+",
        "exportField": {
          "dev": [
            {
              "field": "tot_phosp"
            }
          ]
        }
      },
      {
        "fieldName": "water_content_soil_meth",
        "capitalize": "",
        "ontology_id": "nmdc:water_content_soil_meth",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "Reference or method used in determining the water content of soil",
        "guidance": "",
        "examples": "",
        "exportField": {
          "dev": [
            {
              "field": "water_content_soil_meth"
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "dataStatus": null,
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
        "ontology_id": "nmdc:GOLD sample identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "['identifiers for corresponding sample in GOLD']",
        "guidance": "|^GOLD:Gb[0-9]+$",
        "examples": "",
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
        "ontology_id": "nmdc:INSDC biosample identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "['identifiers for corresponding sample in INSDC']",
        "guidance": "|^biosample:SAM[NED]([A-Z])?[0-9]+$",
        "examples": "",
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
        "ontology_id": "nmdc:INSDC secondary sample identifiers",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "['secondary identifiers for corresponding sample in INSDC']",
        "guidance": "ENA redirects these to primary IDs, e.g. https://www.ebi.ac.uk/ena/browser/view/DRS166340 -> SAMD00212331|MGnify uses these as their primary sample IDs|^biosample:(E|D|S)RS[0-9]{6,}$",
        "examples": "",
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