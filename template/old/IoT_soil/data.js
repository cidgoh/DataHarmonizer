var DATA = [
  {
    "fieldName": "sample identification",
    "children": [
      {
        "fieldName": "unique_ID",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:unique",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Unique ID",
        "guidance": "Field REQUIRED for ALL sample submission. Options: IGSN- http://www.geosamples.org/getigsn ; UUID- https://www.uuidgenerator.net/",
        "examples": "{text}"
      },
      {
        "fieldName": "samp_name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Sample Name",
        "guidance": "ID that is present on the shipped sample. Human readable.",
        "examples": "{text}"
      },
      {
        "fieldName": "investigation_type",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Analysis/Data Type",
        "guidance": "This field is constrained to contain only a set of limited terms (listed under Expected value) that indicate the types of data that were generated. Include all the data types, this field can have multiple values separated by a ;",
        "examples": "drop down selection list",
        "schema:ItemList": {
          "chemical speciation/mapping": {},
          "genome": {},
          "imaging- electron": {},
          "imaging- ion": {},
          "imaging- light": {},
          "lipidome": {},
          "metabolome": {},
          "molecular structure": {},
          "organic matter": {},
          "proteome": {},
          "transcriptome": {}
        }
      },
      {
        "fieldName": "package",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Sample Type",
        "guidance": "MIxS Package",
        "examples": "{text}"
      },
      {
        "fieldName": "source_mat_id",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Source Material ID",
        "guidance": "A unique identifier assigned to an original material sample collected or to any derived sub-samples. The source material should be listed as a sample to inform details about parent material relationship.",
        "examples": "{text}"
      }
    ]
  },
  {
    "fieldName": "required where applicable",
    "children": [
      {
        "fieldName": "geo_loc_name",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Geographical Location Name",
        "guidance": "",
        "examples": "country or sea name; region or state; specific location"
      },
      {
        "fieldName": "lat_lon",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "latitude, longitude",
        "guidance": "",
        "examples": "{latitude decimal; longitude decimal}"
      },
      {
        "fieldName": "elev",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "elevation-meters",
        "guidance": "",
        "examples": "{value}"
      },
      {
        "fieldName": "depth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "depth-meters",
        "guidance": "When sample is collected with a ___ depth and homogenized, please report depth as a ____. (example, 0-10cm for soil collected from the surface to 10cm below and homogenized, or 10-20 for soil collected and homogenized from 10cm below the surface to 20cm).",
        "examples": "{range value}"
      },
      {
        "fieldName": "chem_administration",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "chemical administration/addition treatment",
        "guidance": "",
        "examples": "{termLabel} {[termID]}; {timestamp}"
      },
      {
        "fieldName": "watering_regm",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "watering regimen/schedule treatment",
        "guidance": "",
        "examples": "{float} {unit};{Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "air_temp_regm",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "air temperature regimen treatment",
        "guidance": "",
        "examples": "{float} {unit};{Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "gaseous_environment",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "gas evironment/exposure treatment",
        "guidance": "",
        "examples": "{text};{float} {unit};{Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "isotope_exposure",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "isotope exposure/addition treatment",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "climate_environment",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "climate environment treatment",
        "guidance": "",
        "examples": "{text};{Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "humidity_regm",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "humidity regimen/adition treatment",
        "guidance": "",
        "examples": "{float} {unit};{Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "light_regm",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "light regimen treatment",
        "guidance": "",
        "examples": "{text};{float} {unit};{float} {unit}"
      },
      {
        "fieldName": "biotic_regm",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "biotic regimen/addition treatment",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "other",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "treatment-other details",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "sieving",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Sieve Size",
        "guidance": "",
        "examples": "{value}{text}"
      },
      {
        "fieldName": "samp_collect_device",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "sample collection device",
        "guidance": "Report dimensions and details when applicable",
        "examples": "{text} dimensions"
      },
      {
        "fieldName": "alt",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "altitude-meters",
        "guidance": "",
        "examples": "{value}"
      },
      {
        "fieldName": "other",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "treatment-other details",
        "guidance": "",
        "examples": "{text}"
      }
    ]
  },
  {
    "fieldName": "optional",
    "children": [
      {
        "fieldName": "agrochem_addition",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/agrochemical additions",
        "guidance": "",
        "examples": "agrochemical name {text} ;agrochemical amount {value} ;timestamp {date}"
      },
      {
        "fieldName": "al_sat",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/Al saturation",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "al_sat_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/Al saturation method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "annual_precpt",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "mean annual precipitation",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "annual_temp",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "mean annual temperature",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "biotic_relationship",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "biotic relationship",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "commensalism": {},
          "free living": {},
          "mutualism": {},
          "parasitism": {},
          "symbiotic": {}
        }
      },
      {
        "fieldName": "crop_rotation",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/crop rotation",
        "guidance": "",
        "examples": "crop rotation status {boolean}; schedule {Rn/start_time/end_time/duration}"
      },
      {
        "fieldName": "cur_land_use",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "current land use",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "Badlands": {},
          "Cities": {},
          "Conifers (e.g. pine,spruce,fir,cypress)": {},
          "Crop Trees (nuts,fruit,christmas trees,nursery trees)": {},
          "Farmstead": {},
          "Gravel": {},
          "Hardwoods (e.g. oak,hickory,elm,aspen)": {},
          "Hayland": {},
          "Horticultural Plants (e.g. tulips)": {},
          "Industrial Areas": {},
          "Intermixed Hardwood and Conifers": {},
          "Marshlands (grass,sedges,rushes)": {},
          "Meadows (grasses,alfalfa,fescue,bromegrass,timothy)": {},
          "Mines/Quarries": {},
          "Mudflats": {},
          "Oil Waste Areas": {},
          "Pastureland (grasslands used for livestock grazing)": {},
          "Permanent Snow or Ice": {},
          "Rainforest (evergreen forest receiving >406 cm annual rainfall)": {},
          "Rangeland": {},
          "Roads/Railroads": {},
          "Rock": {},
          "Row Crops": {},
          "Saline Seeps": {},
          "Salt Flats": {},
          "Sand": {},
          "Shrub Crops (blueberries,nursery ornamentals,filberts)": {},
          "Shrub Land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)": {},
          "Small Grains": {},
          "Successional Shrub Land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)": {},
          "Swamp (permanent or semi-permanent water body dominated by woody plants)": {},
          "Tropical (e.g. mangrove,palms)": {},
          "Tundra (mosses,lichens)": {},
          "Vegetable Crops": {},
          "Vine Crops (grapes)": {}
        }
      },
      {
        "fieldName": "cur_vegetation",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "current vegetation",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "cur_vegetation_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "current vegetation method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "drainage_class",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "drainage classification",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "Excessively Drained": {},
          "Moderately Well": {},
          "Poorly": {},
          "Somewhat Poorly": {},
          "Very Poorly": {},
          "Well": {}
        }
      },
      {
        "fieldName": "extreme_event",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/extreme events",
        "guidance": "",
        "examples": "{timestamp}"
      },
      {
        "fieldName": "extreme_salinity",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/salinity",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "fao_class",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "soil_taxonomic/FAO classification",
        "guidance": "",
        "examples": "enumeration",
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
        "fieldName": "fire",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/fire",
        "guidance": "",
        "examples": "{timestamp}"
      },
      {
        "fieldName": "flooding",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/flooding",
        "guidance": "",
        "examples": "{timestamp}"
      },
      {
        "fieldName": "heavy_metals",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/heavy metals",
        "guidance": "",
        "examples": "{text};{float} {unit} heavy metal name {text}; measurement value {value} {unit}"
      },
      {
        "fieldName": "heavy_metals_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/heavy metals method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "horizon",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "horizon",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "A Horizon": {},
          "B Horizon": {},
          "C Horizon": {},
          "E Horizon": {},
          "O Horizon": {},
          "Permafrost": {},
          "R Layer": {}
        }
      },
      {
        "fieldName": "horizon_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "horizon method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "link_addit_analys",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "links to additional analysis",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "link_class_info",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "link to classification information",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "link_climate_info",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "link to climate information",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "local_class",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "soil_taxonomic/local classification",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "local_class_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "soil_taxonomic/local classification method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "microbial_biomass",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "microbial biomass",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "microbial_biomass_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "microbial biomass method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "misc_param",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "miscellaneous parameter",
        "guidance": "",
        "examples": "parameter name {text}; measurement value {float} {unit}"
      },
      {
        "fieldName": "oxy_stat_samp",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "oxygenation status of sample",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "aerobic": {},
          "anaerobic": {},
          "anoxic": {},
          "facultative": {},
          "microaerophilic": {},
          "microanaerobe": {},
          "obligate aerobe": {},
          "obligate anaerobe": {}
        }
      },
      {
        "fieldName": "ph",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "pH",
        "guidance": "",
        "examples": "{float}"
      },
      {
        "fieldName": "ph_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "pH method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "previous_land_use",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/previous land use",
        "guidance": "",
        "examples": "{text};{timestamp}"
      },
      {
        "fieldName": "previous_land_use_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/previous land use method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "profile_position",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "profile position",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "Backslope": {},
          "Footslope": {},
          "Shoulder": {},
          "Summit": {},
          "Toeslope": {},
          "profile_position": {}
        }
      },
      {
        "fieldName": "salinity_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "extreme_unusual_properties/salinity method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "season_precpt",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "mean seasonal precipitation",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "season_temp",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "mean seasonal temperature",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "slope_aspect",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "slope aspect",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "slope_gradient",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "slope gradient",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "soil_type",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "soil type",
        "guidance": "",
        "examples": "{text}"
      },
      {
        "fieldName": "soil_type_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "soil type method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "texture",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "texture",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "texture_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "texture method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "tillage",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "history/tillage",
        "guidance": "",
        "examples": "enumeration",
        "schema:ItemList": {
          "Chisel": {},
          "Cutting Disc": {},
          "Disc Plough": {},
          "Drill": {},
          "Mouldboard": {},
          "Ridge Till": {},
          "Strip Tillage": {},
          "Tined": {},
          "Zonal Tillage": {}
        }
      },
      {
        "fieldName": "tot_nitro_content",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "total nitrogen content",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "tot_n_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "total nitrogen content method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "tot_org_c_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "total organic carbon method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      },
      {
        "fieldName": "tot_org_carb",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "total organic carbon",
        "guidance": "",
        "examples": "{float} {unit}",
        "pattern": "^[+-]?([0-9]*[.])?[0-9]+ \\S+$"
      },
      {
        "fieldName": "water_content",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:decimal",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "water content",
        "guidance": "",
        "examples": "{float}"
      },
      {
        "fieldName": "water_cont_soil_meth",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "",
        "description": "water content method",
        "guidance": "",
        "examples": "{PMID}|{DOI}|{URL}"
      }
    ]
  },
  {
    "fieldName": "required",
    "children": [
      {
        "fieldName": "growth_facil",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Growth Facility",
        "guidance": "Type of facility or location form where the sample was harvested",
        "examples": "{text}|{termLabel} {[termID]}",
        "schema:ItemList": {
          "experimental_garden": {},
          "field": {},
          "field_incubation": {},
          "greenhouse": {},
          "growth_chamber": {},
          "lab_incubation": {},
          "open_top_chamber": {},
          "other": {}
        }
      },
      {
        "fieldName": "collection_date",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:date",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Collection Date",
        "guidance": "",
        "examples": "{timestamp}"
      },
      {
        "fieldName": "samp_mat_process",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Material Processing",
        "guidance": "",
        "examples": "{text}|{termLabel} {[termID]}"
      },
      {
        "fieldName": "store_cond",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Storage Condition",
        "guidance": "Informs how your sample was stored",
        "examples": "drop down selection list",
        "schema:ItemList": {
          "fresh": {},
          "frozen": {},
          "lyophilized": {},
          "other": {}
        }
      },
      {
        "fieldName": "samp_store_temp",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "select",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Storage temperature",
        "guidance": "",
        "examples": "drop down selection list",
        "schema:ItemList": {
          "-20 degree Celsius": {},
          "-80 degree Celsius": {},
          "4 degree Celsius": {},
          "other": {},
          "room temperature": {}
        }
      },
      {
        "fieldName": "samp_size",
        "capitalize": "",
        "ontology_id": "",
        "datatype": "xs:token",
        "source": "",
        "dataStatus": null,
        "xs:minInclusive": "",
        "xs:maxInclusive": "",
        "requirement": "required",
        "description": "Sample size",
        "guidance": "",
        "examples": "{value}{text}"
      }
    ]
  }
]