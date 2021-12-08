var SCHEMA = {
  "folder": "MIxS_soil",
  "specifications": {
    "soil_biosample_class": {
      "name": "soil_biosample_class",
      "from_schema": "http://example.com/soil_biosample",
      "slots": {
        "GOLD sample identifiers": {
          "name": "GOLD sample identifiers",
          "description": "['identifiers for corresponding sample in GOLD']",
          "examples": [
            {
              "value": "https://identifiers.org/gold:GbTODO"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "sample identifiers",
          "mixins": [
            "GOLD identifiers"
          ],
          "multivalued": true,
          "owner": "soil_biosample_class",
          "pattern": "^GOLD:Gb[0-9]+$"
        },
        "INSDC biosample identifiers": {
          "name": "INSDC biosample identifiers",
          "aliases": [
            "EBI biosample identifiers",
            "NCBI biosample identifiers",
            "DDBJ biosample identifiers"
          ],
          "description": "['identifiers for corresponding sample in INSDC']",
          "examples": [
            {
              "value": "https://identifiers.org/biosample:SAMEA5989477"
            },
            {
              "value": "https://identifiers.org/biosample:SAMD00212331",
              "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "see_also": [
            "https://github.com/bioregistry/bioregistry/issues/108",
            "https://www.ebi.ac.uk/biosamples/",
            "https://www.ncbi.nlm.nih.gov/biosample",
            "https://www.ddbj.nig.ac.jp/biosample/index-e.html"
          ],
          "is_a": "sample identifiers",
          "mixins": [
            "INSDC identifiers"
          ],
          "multivalued": true,
          "owner": "soil_biosample_class",
          "pattern": "^biosample:SAM[NED]([A-Z])?[0-9]+$"
        },
        "INSDC secondary sample identifiers": {
          "name": "INSDC secondary sample identifiers",
          "description": "['secondary identifiers for corresponding sample in INSDC']",
          "comments": [
            "ENA redirects these to primary IDs, e.g. https://www.ebi.ac.uk/ena/browser/view/DRS166340 -> SAMD00212331",
            "MGnify uses these as their primary sample IDs"
          ],
          "examples": [
            {
              "value": "https://identifiers.org/insdc.sra:DRS166340",
              "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "sample identifiers",
          "mixins": [
            "INSDC identifiers"
          ],
          "owner": "soil_biosample_class",
          "pattern": "^biosample:(E|D|S)RS[0-9]{6,}$"
        },
        "add_date": {
          "name": "add_date",
          "description": "The date on which the information was added to the database.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "title": "history/agrochemical additions",
          "aliases": [
            "history/agrochemical additions"
          ],
          "mappings": [
            "mixs:agrochem_addition"
          ],
          "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
          "comments": [
            "Expected value: agrochemical name;agrochemical amount;timestamp",
            "Preferred unit: gram, mole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": "roundup;5 milligram per liter;2018-06-21"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{timestamp}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000639",
          "multivalued": true,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "al_sat": {
          "name": "al_sat",
          "title": "extreme_unusual_properties/Al saturation",
          "aliases": [
            "extreme_unusual_properties/Al saturation"
          ],
          "mappings": [
            "mixs:al_sat"
          ],
          "description": "Aluminum saturation (esp. For tropical soils)",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000607",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "title": "extreme_unusual_properties/Al saturation method",
          "aliases": [
            "extreme_unusual_properties/Al saturation method"
          ],
          "mappings": [
            "mixs:al_sat_meth"
          ],
          "description": "Reference or method used in determining Al saturation",
          "comments": [
            "Expected value: PMID,DOI or URL"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000324",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "alkalinity": {
          "name": "alkalinity",
          "aliases": [
            "alkalinity"
          ],
          "mappings": [
            "mixs:alkalinity"
          ],
          "description": "\"Alkalinity, the ability of a solution to neutralize acids to the equivalence point of carbonate or bicarbonate\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "alkalinity_method": {
          "name": "alkalinity_method",
          "aliases": [
            "alkalinity method"
          ],
          "mappings": [
            "mixs:alkalinity_method"
          ],
          "description": "Method used for alkalinity measurement",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "alkyl_diethers": {
          "name": "alkyl_diethers",
          "aliases": [
            "alkyl diethers"
          ],
          "mappings": [
            "mixs:alkyl_diethers"
          ],
          "description": "Concentration of alkyl diethers ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "alt": {
          "name": "alt",
          "title": "altitude",
          "aliases": [
            "altitude"
          ],
          "mappings": [
            "mixs:alt"
          ],
          "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000094",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "alternative identifiers": {
          "name": "alternative identifiers",
          "description": "A list of alternative identifiers for the entity.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": true,
          "owner": "soil_biosample_class"
        },
        "aminopept_act": {
          "name": "aminopept_act",
          "aliases": [
            "aminopeptidase activity"
          ],
          "mappings": [
            "mixs:aminopept_act"
          ],
          "description": "Measurement of aminopeptidase activity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "ammonium": {
          "name": "ammonium",
          "aliases": [
            "ammonium"
          ],
          "mappings": [
            "mixs:ammonium"
          ],
          "description": "Concentration of ammonium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "title": "mean annual precipitation",
          "aliases": [
            "mean annual precipitation"
          ],
          "mappings": [
            "mixs:annual_precpt"
          ],
          "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000644",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "annual_temp": {
          "name": "annual_temp",
          "title": "mean annual temperature",
          "aliases": [
            "mean annual temperature"
          ],
          "mappings": [
            "mixs:annual_temp"
          ],
          "description": "Mean annual temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "12.5 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000642",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bacteria_carb_prod": {
          "name": "bacteria_carb_prod",
          "aliases": [
            "bacterial carbon production"
          ],
          "mappings": [
            "mixs:bacteria_carb_prod"
          ],
          "description": "Measurement of bacterial carbon production",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bishomohopanol": {
          "name": "bishomohopanol",
          "aliases": [
            "bishomohopanol"
          ],
          "mappings": [
            "mixs:bishomohopanol"
          ],
          "description": "Concentration of bishomohopanol ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bromide": {
          "name": "bromide",
          "aliases": [
            "bromide"
          ],
          "mappings": [
            "mixs:bromide"
          ],
          "description": "Concentration of bromide ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "calcium": {
          "name": "calcium",
          "aliases": [
            "calcium"
          ],
          "mappings": [
            "mixs:calcium"
          ],
          "description": "Concentration of calcium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "carb_nitro_ratio": {
          "name": "carb_nitro_ratio",
          "aliases": [
            "carbon/nitrogen ratio"
          ],
          "mappings": [
            "mixs:carb_nitro_ratio"
          ],
          "description": "Ratio of amount or concentrations of carbon to nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "chem_administration": {
          "name": "chem_administration",
          "aliases": [
            "chemical administration"
          ],
          "mappings": [
            "mixs:chem_administration"
          ],
          "description": "\"List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "controlled term value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "chloride": {
          "name": "chloride",
          "aliases": [
            "chloride"
          ],
          "mappings": [
            "mixs:chloride"
          ],
          "description": "Concentration of chloride in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "chlorophyll": {
          "name": "chlorophyll",
          "aliases": [
            "chlorophyll"
          ],
          "mappings": [
            "mixs:chlorophyll"
          ],
          "description": "Concentration of chlorophyll",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "collection_date": {
          "name": "collection_date",
          "title": "collection date",
          "aliases": [
            "collection date"
          ],
          "mappings": [
            "mixs:collection_date"
          ],
          "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
          "comments": [
            "Expected value: date and time"
          ],
          "examples": [
            {
              "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000011",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "community": {
          "name": "community",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "title": "history/crop rotation",
          "aliases": [
            "history/crop rotation"
          ],
          "mappings": [
            "mixs:crop_rotation"
          ],
          "description": "Whether or not crop is rotated, and if yes, rotation schedule",
          "comments": [
            "Expected value: crop rotation status;schedule"
          ],
          "examples": [
            {
              "value": "yes;R2/2017-01-01/2018-12-31/P6M"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000318",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "title": "current land use",
          "aliases": [
            "current land use"
          ],
          "mappings": [
            "mixs:cur_land_use"
          ],
          "description": "Present state of sample site",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "conifers"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[cities|farmstead|industrial areas|roads/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]",
          "range": "cur_land_use_enum",
          "slot_uri": "MIXS:0001080",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "[cities|farmstead|industrial areas|roads\\/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines\\/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage\\-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi\\-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]"
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "title": "current vegetation",
          "aliases": [
            "current vegetation"
          ],
          "mappings": [
            "mixs:cur_vegetation"
          ],
          "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
          "comments": [
            "Expected value: current vegetation type"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000312",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "title": "current vegetation method",
          "aliases": [
            "current vegetation method"
          ],
          "mappings": [
            "mixs:cur_vegetation_meth"
          ],
          "description": "Reference or method used in vegetation classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000314",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "density": {
          "name": "density",
          "aliases": [
            "density"
          ],
          "mappings": [
            "mixs:density"
          ],
          "description": "\"Density of the sample, which is its mass per unit volume (aka volumetric mass density)\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "depth": {
          "name": "depth",
          "title": "depth",
          "aliases": [
            "depth",
            "geographic location (depth)"
          ],
          "mappings": [
            "mixs:depth"
          ],
          "description": "MIxS:The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.|NMDC:Please refer to the definitions of depth in the environmental packages",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "10 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000018",
          "multivalued": false,
          "required": true,
          "owner": "soil_biosample_class"
        },
        "depth2": {
          "name": "depth2",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "soil_biosample_class"
        },
        "description": {
          "name": "description",
          "description": "a human-readable description of a thing",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "slot_uri": "dcterms:description",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "diss_carb_dioxide": {
          "name": "diss_carb_dioxide",
          "aliases": [
            "dissolved carbon dioxide"
          ],
          "mappings": [
            "mixs:diss_carb_dioxide"
          ],
          "description": "Concentration of dissolved carbon dioxide in the sample or liquid portion of the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_hydrogen": {
          "name": "diss_hydrogen",
          "aliases": [
            "dissolved hydrogen"
          ],
          "mappings": [
            "mixs:diss_hydrogen"
          ],
          "description": "Concentration of dissolved hydrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_inorg_carb": {
          "name": "diss_inorg_carb",
          "aliases": [
            "dissolved inorganic carbon"
          ],
          "mappings": [
            "mixs:diss_inorg_carb"
          ],
          "description": "\"Dissolved inorganic carbon concentration in the sample, typically measured after filtering the sample using a 0.45 micrometer filter\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_inorg_phosp": {
          "name": "diss_inorg_phosp",
          "aliases": [
            "dissolved inorganic phosphorus"
          ],
          "mappings": [
            "mixs:diss_inorg_phosp"
          ],
          "description": "Concentration of dissolved inorganic phosphorus in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_org_carb": {
          "name": "diss_org_carb",
          "aliases": [
            "dissolved organic carbon"
          ],
          "mappings": [
            "mixs:diss_org_carb"
          ],
          "description": "\"Concentration of dissolved organic carbon in the sample, liquid portion of the sample, or aqueous phase of the fluid\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_org_nitro": {
          "name": "diss_org_nitro",
          "aliases": [
            "dissolved organic nitrogen"
          ],
          "mappings": [
            "mixs:diss_org_nitro"
          ],
          "description": "Dissolved organic nitrogen concentration measured as; total dissolved nitrogen - NH4 - NO3 - NO2",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_oxygen": {
          "name": "diss_oxygen",
          "aliases": [
            "dissolved oxygen"
          ],
          "mappings": [
            "mixs:diss_oxygen"
          ],
          "description": "Concentration of dissolved oxygen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "drainage_class": {
          "name": "drainage_class",
          "title": "drainage classification",
          "aliases": [
            "drainage classification"
          ],
          "mappings": [
            "mixs:drainage_class"
          ],
          "description": "Drainage classification from a standard system such as the USDA system",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "well"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]",
          "range": "drainage_class_enum",
          "slot_uri": "MIXS:0001085",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]"
        },
        "ecosystem": {
          "name": "ecosystem",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "soil_biosample_class"
        },
        "ecosystem_category": {
          "name": "ecosystem_category",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "soil_biosample_class"
        },
        "ecosystem_subtype": {
          "name": "ecosystem_subtype",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "soil_biosample_class"
        },
        "ecosystem_type": {
          "name": "ecosystem_type",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "soil_biosample_class"
        },
        "elev": {
          "name": "elev",
          "title": "elevation",
          "aliases": [
            "elevation"
          ],
          "mappings": [
            "mixs:elev"
          ],
          "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000093",
          "multivalued": false,
          "required": true,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "title": "broad-scale environmental context",
          "aliases": [
            "broad-scale environmental context"
          ],
          "mappings": [
            "mixs:env_broad_scale"
          ],
          "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
          "comments": [
            "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
          ],
          "examples": [
            {
              "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000012",
          "multivalued": false,
          "required": true,
          "owner": "soil_biosample_class",
          "pattern": ".* \\S+:\\S+"
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "title": "local environmental context",
          "aliases": [
            "local environmental context"
          ],
          "mappings": [
            "mixs:env_local_scale"
          ],
          "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
          "comments": [
            "Expected value: Environmental entities having causal influences upon the entity at time of sampling."
          ],
          "examples": [
            {
              "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000013",
          "multivalued": false,
          "required": true,
          "owner": "soil_biosample_class",
          "pattern": ".* \\S+:\\S+"
        },
        "env_medium": {
          "name": "env_medium",
          "title": "environmental medium",
          "aliases": [
            "environmental medium"
          ],
          "mappings": [
            "mixs:env_medium"
          ],
          "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
          "comments": [
            "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
          ],
          "examples": [
            {
              "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000014",
          "multivalued": false,
          "required": true,
          "owner": "soil_biosample_class",
          "pattern": ".* \\S+:\\S+"
        },
        "env_package": {
          "name": "env_package",
          "aliases": [
            "environmental package"
          ],
          "mappings": [
            "mixs:env_package"
          ],
          "description": "\"MIxS extension for reporting of measurements and observations obtained from one or more of the environments where the sample was obtained. All environmental packages listed here are further defined in separate subtables. By giving the name of the environmental package, a selection of fields can be made from the subtables and can be reported\"",
          "in_subset": [
            "mixs extension"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "[air|built environment|host\\-associated|human\\-associated|human\\-skin|human\\-oral|human\\-gut|human\\-vaginal|hydrocarbon resources\\-cores|hydrocarbon resources\\-fluids\\/swabs|microbial mat\\/biofilm|misc environment|plant\\-associated|sediment|soil|wastewater\\/sludge|water]"
        },
        "extreme_event": {
          "name": "extreme_event",
          "title": "history/extreme events",
          "aliases": [
            "history/extreme events"
          ],
          "mappings": [
            "mixs:extreme_event"
          ],
          "description": "Unusual physical events that may have affected microbial populations",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000320",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "extreme_salinity": {
          "name": "extreme_salinity",
          "title": "extreme_unusual_properties/salinity",
          "description": "Measured salinity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000651",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "fao_class": {
          "name": "fao_class",
          "title": "soil_taxonomic/FAO classification",
          "aliases": [
            "soil_taxonomic/FAO classification"
          ],
          "mappings": [
            "mixs:fao_class"
          ],
          "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "Luvisols"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]",
          "range": "fao_class_enum",
          "slot_uri": "MIXS:0001083",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]"
        },
        "fire": {
          "name": "fire",
          "title": "history/fire",
          "aliases": [
            "history/fire"
          ],
          "mappings": [
            "mixs:fire"
          ],
          "description": "Historical and/or physical evidence of fire",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0001086",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "flooding": {
          "name": "flooding",
          "title": "history/flooding",
          "aliases": [
            "history/flooding"
          ],
          "mappings": [
            "mixs:flooding"
          ],
          "description": "Historical and/or physical evidence of flooding",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000319",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "geo_loc_name": {
          "name": "geo_loc_name",
          "title": "geographic location (country and/or sea,region)",
          "aliases": [
            "geographic location (country and/or sea,region)"
          ],
          "mappings": [
            "mixs:geo_loc_name"
          ],
          "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
          "comments": [
            "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name"
          ],
          "examples": [
            {
              "value": "USA: Maryland, Bethesda"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{term}: {term}, {text}",
          "range": "text value",
          "slot_uri": "MIXS:0000010",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "glucosidase_act": {
          "name": "glucosidase_act",
          "aliases": [
            "glucosidase activity"
          ],
          "mappings": [
            "mixs:glucosidase_act"
          ],
          "description": "Measurement of glucosidase activity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "habitat": {
          "name": "habitat",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "title": "extreme_unusual_properties/heavy metals",
          "aliases": [
            "extreme_unusual_properties/heavy metals"
          ],
          "mappings": [
            "mixs:heavy_metals"
          ],
          "description": "MIxS:Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.|NMDC:Heavy metals present and concentrationsany drug used by subject and the frequency of usage; can include multiple heavy metals and concentrations",
          "comments": [
            "Expected value: heavy metal name;measurement value unit",
            "Preferred unit: microgram per gram"
          ],
          "examples": [
            {
              "value": "mercury;0.09 micrograms per gram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000652",
          "multivalued": true,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "title": "extreme_unusual_properties/heavy metals method",
          "aliases": [
            "extreme_unusual_properties/heavy metals method"
          ],
          "mappings": [
            "mixs:heavy_metals_meth"
          ],
          "description": "Reference or method used in determining heavy metals",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000343",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "horizon": {
          "name": "horizon",
          "aliases": [
            "horizon"
          ],
          "mappings": [
            "mixs:horizon"
          ],
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]"
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "title": "horizon method",
          "aliases": [
            "horizon method"
          ],
          "mappings": [
            "mixs:horizon_meth"
          ],
          "description": "Reference or method used in determining the horizon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000321",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "host_name": {
          "name": "host_name",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "id": {
          "name": "id",
          "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
          "from_schema": "http://example.com/soil_biosample",
          "multivalued": false,
          "identifier": true,
          "owner": "soil_biosample_class"
        },
        "identifier": {
          "name": "identifier",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "lat_lon": {
          "name": "lat_lon",
          "title": "geographic location (latitude and longitude)",
          "aliases": [
            "geographic location (latitude and longitude)"
          ],
          "mappings": [
            "mixs:lat_lon"
          ],
          "description": "MIxS:The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system|NMDC: This is currently a required field but it's not clear if this should be required for human hosts",
          "comments": [
            "Expected value: decimal degrees,  limit to 8 decimal points"
          ],
          "examples": [
            {
              "value": "50.586825 6.408977"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {float}",
          "range": "geolocation value",
          "slot_uri": "MIXS:0000009",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\d+[.\\d+]"
        },
        "link_addit_analys": {
          "name": "link_addit_analys",
          "title": "links to additional analysis",
          "aliases": [
            "links to additional analysis"
          ],
          "mappings": [
            "mixs:link_addit_analys"
          ],
          "description": "Link to additional analysis results performed on the sample",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000340",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "link_class_info": {
          "name": "link_class_info",
          "title": "link to classification information",
          "aliases": [
            "link to classification information"
          ],
          "mappings": [
            "mixs:link_class_info"
          ],
          "description": "Link to digitized soil maps or other soil classification information",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000329",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "title": "link to climate information",
          "aliases": [
            "link to climate information"
          ],
          "mappings": [
            "mixs:link_climate_info"
          ],
          "description": "Link to climate resource",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000328",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "local_class": {
          "name": "local_class",
          "title": "soil_taxonomic/local classification",
          "aliases": [
            "soil_taxonomic/local classification"
          ],
          "mappings": [
            "mixs:local_class"
          ],
          "description": "Soil classification based on local soil classification system",
          "comments": [
            "Expected value: local classification name"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000330",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "title": "soil_taxonomic/local classification method",
          "aliases": [
            "soil_taxonomic/local classification method"
          ],
          "mappings": [
            "mixs:local_class_meth"
          ],
          "description": "Reference or method used in determining the local soil classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000331",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "location": {
          "name": "location",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "magnesium": {
          "name": "magnesium",
          "aliases": [
            "magnesium"
          ],
          "mappings": [
            "mixs:magnesium"
          ],
          "description": "Concentration of magnesium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "mean_frict_vel": {
          "name": "mean_frict_vel",
          "aliases": [
            "mean friction velocity"
          ],
          "mappings": [
            "mixs:mean_frict_vel"
          ],
          "description": "Measurement of mean friction velocity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "mean_peak_frict_vel": {
          "name": "mean_peak_frict_vel",
          "aliases": [
            "mean peak friction velocity"
          ],
          "mappings": [
            "mixs:mean_peak_frict_vel"
          ],
          "description": "Measurement of mean peak friction velocity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "micro_biomass_meth": {
          "name": "micro_biomass_meth",
          "title": "microbial biomass method",
          "description": "Reference or method used in determining microbial biomass",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000339",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "title": "microbial biomass",
          "aliases": [
            "microbial biomass"
          ],
          "mappings": [
            "mixs:microbial_biomass"
          ],
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: ton, kilogram, gram per kilogram soil"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000650",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "microbial_biomass_meth": {
          "name": "microbial_biomass_meth",
          "aliases": [
            "microbial biomass method"
          ],
          "mappings": [
            "mixs:microbial_biomass_meth"
          ],
          "description": "Reference or method used in determining microbial biomass",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "misc_param": {
          "name": "misc_param",
          "title": "miscellaneous parameter",
          "aliases": [
            "miscellaneous parameter"
          ],
          "mappings": [
            "mixs:misc_param"
          ],
          "description": "Any other measurement performed or parameter collected, that is not listed here",
          "comments": [
            "Expected value: parameter name;measurement value"
          ],
          "examples": [
            {
              "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000752",
          "multivalued": true,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "mod_date": {
          "name": "mod_date",
          "description": "The last date on which the database information was modified.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "n_alkanes": {
          "name": "n_alkanes",
          "aliases": [
            "n-alkanes"
          ],
          "mappings": [
            "mixs:n_alkanes"
          ],
          "description": "Concentration of n-alkanes; can include multiple n-alkanes",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "name": {
          "name": "name",
          "description": "A human readable label for an entity",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "ncbi_taxonomy_name": {
          "name": "ncbi_taxonomy_name",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "nitrate": {
          "name": "nitrate",
          "aliases": [
            "nitrate"
          ],
          "mappings": [
            "mixs:nitrate"
          ],
          "description": "Concentration of nitrate in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "nitrite": {
          "name": "nitrite",
          "aliases": [
            "nitrite"
          ],
          "mappings": [
            "mixs:nitrite"
          ],
          "description": "Concentration of nitrite in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "org_matter": {
          "name": "org_matter",
          "aliases": [
            "organic matter"
          ],
          "mappings": [
            "mixs:org_matter"
          ],
          "description": "Concentration of organic matter ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "org_nitro": {
          "name": "org_nitro",
          "aliases": [
            "organic nitrogen"
          ],
          "mappings": [
            "mixs:org_nitro"
          ],
          "description": "Concentration of organic nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "organism_count": {
          "name": "organism_count",
          "aliases": [
            "organism count"
          ],
          "mappings": [
            "mixs:organism_count"
          ],
          "description": "\"Total cell count of any organism (or group of organisms) per gram, volume or area of sample, should include name of organism followed by count. The method that was used for the enumeration (e.g. qPCR, atp, mpn, etc.) Should also be provided. (example: total prokaryotes; 3.5e7 cells per ml; qpcr)\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit};[qPCR|ATP|MPN|other]",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "oxy_stat_samp": {
          "name": "oxy_stat_samp",
          "aliases": [
            "oxygenation status of sample"
          ],
          "mappings": [
            "mixs:oxy_stat_samp"
          ],
          "description": "Oxygenation status of sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "[aerobic|anaerobic|other]"
        },
        "part of": {
          "name": "part of",
          "aliases": [
            "is part of"
          ],
          "description": "Links a resource to another resource that either logically or physically includes it.",
          "from_schema": "http://example.com/soil_biosample",
          "domain": "named thing",
          "range": "named thing",
          "slot_uri": "dcterms:isPartOf",
          "multivalued": true,
          "owner": "soil_biosample_class"
        },
        "part_org_carb": {
          "name": "part_org_carb",
          "aliases": [
            "particulate organic carbon"
          ],
          "mappings": [
            "mixs:part_org_carb"
          ],
          "description": "Concentration of particulate organic carbon",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "perturbation": {
          "name": "perturbation",
          "aliases": [
            "perturbation"
          ],
          "mappings": [
            "mixs:perturbation"
          ],
          "description": "\"Type of perturbation, e.g. chemical administration, physical disturbance, etc., coupled with perturbation regimen including how many times the perturbation was repeated, how long each perturbation lasted, and the start and end time of the entire perturbation period; can include multiple perturbation types\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "petroleum_hydrocarb": {
          "name": "petroleum_hydrocarb",
          "aliases": [
            "petroleum hydrocarbon"
          ],
          "mappings": [
            "mixs:petroleum_hydrocarb"
          ],
          "description": "Concentration of petroleum hydrocarbon",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "ph": {
          "name": "ph",
          "title": "pH",
          "aliases": [
            "pH"
          ],
          "mappings": [
            "mixs:ph"
          ],
          "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "7.2"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0001001",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+]"
        },
        "ph_meth": {
          "name": "ph_meth",
          "title": "pH method",
          "aliases": [
            "pH method"
          ],
          "mappings": [
            "mixs:ph_meth"
          ],
          "description": "Reference or method used in determining ph",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0001106",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "phaeopigments": {
          "name": "phaeopigments",
          "aliases": [
            "phaeopigments"
          ],
          "mappings": [
            "mixs:phaeopigments"
          ],
          "description": "Concentration of phaeopigments; can include multiple phaeopigments",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "phosplipid_fatt_acid": {
          "name": "phosplipid_fatt_acid",
          "aliases": [
            "phospholipid fatty acid"
          ],
          "mappings": [
            "mixs:phosplipid_fatt_acid"
          ],
          "description": "Concentration of phospholipid fatty acids; can include multiple values",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "pool_dna_extracts": {
          "name": "pool_dna_extracts",
          "title": "pooling of DNA extracts (if done)",
          "aliases": [
            "pooling of DNA extracts (if done)"
          ],
          "mappings": [
            "mixs:pool_dna_extracts"
          ],
          "description": "Indicate whether multiple DNA extractions were mixed. If the answer yes, the number of extracts that were pooled should be given",
          "comments": [
            "Expected value: pooling status;number of pooled extracts"
          ],
          "examples": [
            {
              "value": "yes;5"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{integer}",
          "range": "text value",
          "slot_uri": "MIXS:0000325",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "potassium": {
          "name": "potassium",
          "aliases": [
            "potassium"
          ],
          "mappings": [
            "mixs:potassium"
          ],
          "description": "Concentration of potassium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "pressure": {
          "name": "pressure",
          "aliases": [
            "pressure"
          ],
          "mappings": [
            "mixs:pressure"
          ],
          "description": "\"Pressure to which the sample is subject to, in atmospheres\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "prev_land_use_meth": {
          "name": "prev_land_use_meth",
          "title": "history/previous land use method",
          "description": "Reference or method used in determining previous land use and dates",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000316",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "title": "history/previous land use",
          "aliases": [
            "history/previous land use"
          ],
          "mappings": [
            "mixs:previous_land_use"
          ],
          "description": "Previous land use and dates",
          "comments": [
            "Expected value: land use name;date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{timestamp}",
          "range": "text value",
          "slot_uri": "MIXS:0000315",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "previous_land_use_meth": {
          "name": "previous_land_use_meth",
          "aliases": [
            "history/previous land use method"
          ],
          "mappings": [
            "mixs:previous_land_use_meth"
          ],
          "description": "Reference or method used in determining previous land use and dates",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "profile_position": {
          "name": "profile_position",
          "title": "profile position",
          "aliases": [
            "profile position"
          ],
          "mappings": [
            "mixs:profile_position"
          ],
          "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "summit"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[summit|shoulder|backslope|footslope|toeslope]",
          "range": "profile_position_enum",
          "slot_uri": "MIXS:0001084",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "[summit|shoulder|backslope|footslope|toeslope]"
        },
        "proport_woa_temperature": {
          "name": "proport_woa_temperature",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "redox_potential": {
          "name": "redox_potential",
          "aliases": [
            "redox potential"
          ],
          "mappings": [
            "mixs:redox_potential"
          ],
          "description": "\"Redox potential, measured relative to a hydrogen cell, indicating oxidation or reduction potential\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "salinity": {
          "name": "salinity",
          "aliases": [
            "salinity"
          ],
          "mappings": [
            "mixs:salinity"
          ],
          "description": "\"Salinity is the total concentration of all dissolved salts in a water sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "salinity_category": {
          "name": "salinity_category",
          "description": "Categorcial description of the sample's salinity. Examples: halophile, halotolerant, hypersaline, huryhaline",
          "from_schema": "http://example.com/soil_biosample",
          "see_also": [
            "https://github.com/microbiomedata/nmdc-metadata/pull/297"
          ],
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "title": "salinity method",
          "aliases": [
            "salinity method",
            "extreme_unusual_properties/salinity method"
          ],
          "mappings": [
            "mixs:salinity_meth"
          ],
          "description": "Reference or method used in determining salinity",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000341",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "samp_collect_device": {
          "name": "samp_collect_device",
          "aliases": [
            "sample collection device or method"
          ],
          "mappings": [
            "mixs:samp_collect_device"
          ],
          "description": "The method or device employed for collecting the sample",
          "in_subset": [
            "nucleic acid sequence source"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "samp_mat_process": {
          "name": "samp_mat_process",
          "aliases": [
            "sample material processing"
          ],
          "mappings": [
            "mixs:samp_mat_process"
          ],
          "description": "\"Any processing applied to the sample during or after retrieving the sample from environment. This field accepts OBI, for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI\"",
          "in_subset": [
            "nucleic acid sequence source"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "controlled term value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "samp_store_dur": {
          "name": "samp_store_dur",
          "aliases": [
            "sample storage duration"
          ],
          "mappings": [
            "mixs:samp_store_dur"
          ],
          "description": "Duration for which the sample was stored",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "samp_store_loc": {
          "name": "samp_store_loc",
          "aliases": [
            "sample storage location"
          ],
          "mappings": [
            "mixs:samp_store_loc"
          ],
          "description": "\"Location at which sample was stored, usually name of a specific freezer/room\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "samp_store_temp": {
          "name": "samp_store_temp",
          "aliases": [
            "sample storage temperature"
          ],
          "mappings": [
            "mixs:samp_store_temp"
          ],
          "description": "\"Temperature at which sample was stored, e.g. -80 degree Celsius\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "samp_vol_we_dna_ext": {
          "name": "samp_vol_we_dna_ext",
          "aliases": [
            "sample volume or weight for DNA extraction"
          ],
          "mappings": [
            "mixs:samp_vol_we_dna_ext"
          ],
          "description": "\"Volume (ml), weight (g) of processed sample, or surface area swabbed from sample for DNA extraction\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sample_collection_site": {
          "name": "sample_collection_site",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "season_precpt": {
          "name": "season_precpt",
          "title": "mean seasonal precipitation",
          "aliases": [
            "mean seasonal precipitation"
          ],
          "mappings": [
            "mixs:season_precpt"
          ],
          "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000645",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "season_temp": {
          "name": "season_temp",
          "title": "mean seasonal temperature",
          "aliases": [
            "mean seasonal temperature"
          ],
          "mappings": [
            "mixs:season_temp"
          ],
          "description": "Mean seasonal temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "18 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000643",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sieving": {
          "name": "sieving",
          "title": "composite design/sieving",
          "aliases": [
            "composite design/sieving",
            "composite design/sieving (if any)"
          ],
          "mappings": [
            "mixs:sieving"
          ],
          "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
          "comments": [
            "Expected value: design name and/or size;amount"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000322",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "size_frac_low": {
          "name": "size_frac_low",
          "aliases": [
            "size-fraction lower threshold"
          ],
          "mappings": [
            "mixs:size_frac_low"
          ],
          "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "size_frac_up": {
          "name": "size_frac_up",
          "aliases": [
            "size-fraction upper threshold"
          ],
          "mappings": [
            "mixs:size_frac_up"
          ],
          "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "title": "slope aspect",
          "aliases": [
            "slope aspect"
          ],
          "mappings": [
            "mixs:slope_aspect"
          ],
          "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000647",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "title": "slope gradient",
          "aliases": [
            "slope gradient"
          ],
          "mappings": [
            "mixs:slope_gradient"
          ],
          "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000646",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sodium": {
          "name": "sodium",
          "aliases": [
            "sodium"
          ],
          "mappings": [
            "mixs:sodium"
          ],
          "description": "Sodium concentration in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "soil_horizon": {
          "name": "soil_horizon",
          "title": "soil horizon",
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]",
          "range": "soil_horizon_enum",
          "slot_uri": "MIXS:0001082",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "soil_text_measure": {
          "name": "soil_text_measure",
          "title": "soil texture measurement",
          "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000335",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "soil_texture_meth": {
          "name": "soil_texture_meth",
          "title": "soil texture method",
          "description": "Reference or method used in determining soil texture",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000336",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "soil_type": {
          "name": "soil_type",
          "title": "soil type",
          "aliases": [
            "soil type"
          ],
          "mappings": [
            "mixs:soil_type"
          ],
          "description": "MIxS:Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.|NMDC:Soil series name or other lower-level classification",
          "comments": [
            "Expected value: ENVO_00001998"
          ],
          "examples": [
            {
              "value": "plinthosol [ENVO:00002250]"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "text value",
          "slot_uri": "MIXS:0000332",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "title": "soil type method",
          "aliases": [
            "soil type method"
          ],
          "mappings": [
            "mixs:soil_type_meth"
          ],
          "description": "Reference or method used in determining soil series name or other lower-level classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000334",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "soluble_iron_micromol": {
          "name": "soluble_iron_micromol",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "soil_biosample_class"
        },
        "specific_ecosystem": {
          "name": "specific_ecosystem",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "soil_biosample_class"
        },
        "store_cond": {
          "name": "store_cond",
          "title": "storage conditions",
          "aliases": [
            "storage conditions",
            "storage conditions (fresh/frozen/other)"
          ],
          "mappings": [
            "mixs:store_cond"
          ],
          "description": "MIxS:Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).|NMDC:Explain how and for how long the soil sample was stored before DNA extraction",
          "comments": [
            "Expected value: storage condition type;duration"
          ],
          "examples": [
            {
              "value": "-20 degree Celsius freezer;P2Y10D"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000327",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "subsurface_depth": {
          "name": "subsurface_depth",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "soil_biosample_class"
        },
        "subsurface_depth2": {
          "name": "subsurface_depth2",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "soil_biosample_class"
        },
        "sulfate": {
          "name": "sulfate",
          "aliases": [
            "sulfate"
          ],
          "mappings": [
            "mixs:sulfate"
          ],
          "description": "Concentration of sulfate in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sulfide": {
          "name": "sulfide",
          "aliases": [
            "sulfide"
          ],
          "mappings": [
            "mixs:sulfide"
          ],
          "description": "Concentration of sulfide in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "temp": {
          "name": "temp",
          "title": "temperature",
          "aliases": [
            "temperature"
          ],
          "mappings": [
            "mixs:temp"
          ],
          "description": "MIxS:Temperature of the sample at the time of sampling.|NMDC:Temperature of the sample at the time of sampling",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "25 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000113",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "texture": {
          "name": "texture",
          "aliases": [
            "texture"
          ],
          "mappings": [
            "mixs:texture"
          ],
          "description": "\"The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "texture_meth": {
          "name": "texture_meth",
          "aliases": [
            "texture method"
          ],
          "mappings": [
            "mixs:texture_meth"
          ],
          "description": "Reference or method used in determining soil texture",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "tidal_stage": {
          "name": "tidal_stage",
          "aliases": [
            "tidal stage"
          ],
          "mappings": [
            "mixs:tidal_stage"
          ],
          "description": "Stage of tide",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "[low tide|ebb tide|flood tide|high tide]"
        },
        "tillage": {
          "name": "tillage",
          "title": "history/tillage",
          "aliases": [
            "history/tillage"
          ],
          "mappings": [
            "mixs:tillage"
          ],
          "description": "Note method(s) used for tilling",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "chisel"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]",
          "range": "tillage_enum",
          "slot_uri": "MIXS:0001081",
          "multivalued": true,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]"
        },
        "tot_carb": {
          "name": "tot_carb",
          "aliases": [
            "total carbon"
          ],
          "mappings": [
            "mixs:tot_carb"
          ],
          "description": "Total carbon content",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_depth_water_col": {
          "name": "tot_depth_water_col",
          "aliases": [
            "total depth of water column"
          ],
          "mappings": [
            "mixs:tot_depth_water_col"
          ],
          "description": "Measurement of total depth of water column",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_diss_nitro": {
          "name": "tot_diss_nitro",
          "aliases": [
            "total dissolved nitrogen"
          ],
          "mappings": [
            "mixs:tot_diss_nitro"
          ],
          "description": "\"Total dissolved nitrogen concentration, reported as nitrogen, measured by: total dissolved nitrogen = NH4 + NO3NO2 + dissolved organic nitrogen\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_nitro_cont_meth": {
          "name": "tot_nitro_cont_meth",
          "title": "total nitrogen content method",
          "description": "Reference or method used in determining the total nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000338",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "title": "total nitrogen content",
          "aliases": [
            "total nitrogen content"
          ],
          "mappings": [
            "mixs:tot_nitro_content"
          ],
          "description": "Total nitrogen content of the sample",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: microgram per liter, micromole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000530",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_nitro_content_meth": {
          "name": "tot_nitro_content_meth",
          "aliases": [
            "total nitrogen content method"
          ],
          "mappings": [
            "mixs:tot_nitro_content_meth"
          ],
          "description": "Reference or method used in determining the total nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "title": "total organic carbon method",
          "aliases": [
            "total organic carbon method"
          ],
          "mappings": [
            "mixs:tot_org_c_meth"
          ],
          "description": "Reference or method used in determining total organic carbon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000337",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "title": "total organic carbon",
          "aliases": [
            "total organic carbon"
          ],
          "mappings": [
            "mixs:tot_org_carb"
          ],
          "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram Carbon per kilogram sample material"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000533",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_phosp": {
          "name": "tot_phosp",
          "aliases": [
            "total phosphorus"
          ],
          "mappings": [
            "mixs:tot_phosp"
          ],
          "description": "\"Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "type": {
          "name": "type",
          "description": "An optional string that specifies the type object.  This is used to allow for searches for different kinds of objects.",
          "examples": [
            {
              "value": "nmdc:Biosample"
            },
            {
              "value": "nmdc:Study"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "designates_type": true,
          "owner": "soil_biosample_class"
        },
        "water_cont_soil_meth": {
          "name": "water_cont_soil_meth",
          "title": "water content method",
          "description": "Reference or method used in determining the water content of soil",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000323",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class"
        },
        "water_content": {
          "name": "water_content",
          "title": "water content",
          "aliases": [
            "water content"
          ],
          "mappings": [
            "mixs:water_content"
          ],
          "description": "Water content measurement",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram per gram or cubic centimeter per cubic centimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000185",
          "multivalued": false,
          "required": false,
          "owner": "soil_biosample_class",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "water_content_soil_meth": {
          "name": "water_content_soil_meth",
          "aliases": [
            "water content method"
          ],
          "mappings": [
            "mixs:water_content_soil_meth"
          ],
          "description": "Reference or method used in determining the water content of soil",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "soil_biosample_class"
        }
      }
    },
    "activity": {
      "name": "activity",
      "mappings": [
        "prov:Activity"
      ],
      "description": "a provence-generating activity",
      "from_schema": "http://example.com/soil_biosample",
      "slots": {
        "id": {
          "name": "id",
          "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
          "from_schema": "http://example.com/soil_biosample",
          "multivalued": false,
          "identifier": true,
          "owner": "activity"
        },
        "name": {
          "name": "name",
          "description": "A human readable label for an entity",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": false,
          "owner": "activity"
        },
        "started at time": {
          "name": "started at time",
          "mappings": [
            "prov:startedAtTime"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "owner": "activity"
        },
        "ended at time": {
          "name": "ended at time",
          "mappings": [
            "prov:endedAtTime"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "owner": "activity"
        },
        "was informed by": {
          "name": "was informed by",
          "mappings": [
            "prov:wasInformedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "activity"
        },
        "was associated with": {
          "name": "was associated with",
          "mappings": [
            "prov:wasAssociatedWith"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "agent",
          "owner": "activity"
        },
        "used": {
          "name": "used",
          "mappings": [
            "prov:used"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "domain": "activity",
          "owner": "activity"
        }
      }
    },
    "agent": {
      "name": "agent",
      "mappings": [
        "prov:Agent"
      ],
      "description": "a provence-generating agent",
      "from_schema": "http://example.com/soil_biosample",
      "slots": {
        "acted on behalf of": {
          "name": "acted on behalf of",
          "mappings": [
            "prov:actedOnBehalfOf"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "agent",
          "owner": "agent"
        },
        "was informed by": {
          "name": "was informed by",
          "mappings": [
            "prov:wasInformedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "agent"
        }
      }
    },
    "attribute value": {
      "name": "attribute value",
      "description": "The value for any value of a attribute for a sample. This object can hold both the un-normalized atomic value and the structured value",
      "from_schema": "http://example.com/soil_biosample",
      "slots": {
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "attribute value"
        },
        "was generated by": {
          "name": "was generated by",
          "mappings": [
            "prov:wasGeneratedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "attribute value"
        }
      },
      "slot_usage": {
        "type": {
          "name": "type",
          "description": "An optional string that specified the type of object.",
          "required": false
        }
      }
    },
    "biosample": {
      "name": "biosample",
      "id_prefixes": [
        "GOLD"
      ],
      "aliases": [
        "sample",
        "material sample",
        "specimen",
        "biospecimen"
      ],
      "exact_mappings": [
        "OBI:0000747",
        "NCIT:C43412"
      ],
      "description": "A material sample. It may be environmental (encompassing many organisms) or isolate or tissue.   An environmental sample containing genetic material from multiple individuals is commonly referred to as a biosample.",
      "alt_descriptions": {
        "embl.ena": {
          "source": "embl.ena",
          "description": "A sample contains information about the sequenced source material. Samples are associated with checklists, which define the fields used to annotate the samples. Samples are always associated with a taxon."
        }
      },
      "in_subset": [
        "sample subset"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "named thing",
      "slots": {
        "type": {
          "name": "type",
          "description": "An optional string that specifies the type object.  This is used to allow for searches for different kinds of objects.",
          "examples": [
            {
              "value": "nmdc:Biosample"
            },
            {
              "value": "nmdc:Study"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "designates_type": true,
          "owner": "biosample"
        },
        "alternative identifiers": {
          "name": "alternative identifiers",
          "description": "A list of alternative identifiers for the entity.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": true,
          "owner": "biosample"
        },
        "part of": {
          "name": "part of",
          "aliases": [
            "is part of"
          ],
          "description": "Links a resource to another resource that either logically or physically includes it.",
          "from_schema": "http://example.com/soil_biosample",
          "domain": "named thing",
          "range": "named thing",
          "slot_uri": "dcterms:isPartOf",
          "multivalued": true,
          "owner": "biosample"
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "title": "history/agrochemical additions",
          "aliases": [
            "history/agrochemical additions"
          ],
          "mappings": [
            "mixs:agrochem_addition"
          ],
          "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
          "comments": [
            "Expected value: agrochemical name;agrochemical amount;timestamp",
            "Preferred unit: gram, mole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": "roundup;5 milligram per liter;2018-06-21"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{timestamp}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000639",
          "multivalued": true,
          "required": false,
          "owner": "biosample"
        },
        "alkalinity": {
          "name": "alkalinity",
          "aliases": [
            "alkalinity"
          ],
          "mappings": [
            "mixs:alkalinity"
          ],
          "description": "\"Alkalinity, the ability of a solution to neutralize acids to the equivalence point of carbonate or bicarbonate\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "alkalinity_method": {
          "name": "alkalinity_method",
          "aliases": [
            "alkalinity method"
          ],
          "mappings": [
            "mixs:alkalinity_method"
          ],
          "description": "Method used for alkalinity measurement",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "alkyl_diethers": {
          "name": "alkyl_diethers",
          "aliases": [
            "alkyl diethers"
          ],
          "mappings": [
            "mixs:alkyl_diethers"
          ],
          "description": "Concentration of alkyl diethers ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "alt": {
          "name": "alt",
          "title": "altitude",
          "aliases": [
            "altitude"
          ],
          "mappings": [
            "mixs:alt"
          ],
          "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000094",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "al_sat": {
          "name": "al_sat",
          "title": "extreme_unusual_properties/Al saturation",
          "aliases": [
            "extreme_unusual_properties/Al saturation"
          ],
          "mappings": [
            "mixs:al_sat"
          ],
          "description": "Aluminum saturation (esp. For tropical soils)",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000607",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "title": "extreme_unusual_properties/Al saturation method",
          "aliases": [
            "extreme_unusual_properties/Al saturation method"
          ],
          "mappings": [
            "mixs:al_sat_meth"
          ],
          "description": "Reference or method used in determining Al saturation",
          "comments": [
            "Expected value: PMID,DOI or URL"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000324",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "aminopept_act": {
          "name": "aminopept_act",
          "aliases": [
            "aminopeptidase activity"
          ],
          "mappings": [
            "mixs:aminopept_act"
          ],
          "description": "Measurement of aminopeptidase activity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "ammonium": {
          "name": "ammonium",
          "aliases": [
            "ammonium"
          ],
          "mappings": [
            "mixs:ammonium"
          ],
          "description": "Concentration of ammonium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "title": "mean annual precipitation",
          "aliases": [
            "mean annual precipitation"
          ],
          "mappings": [
            "mixs:annual_precpt"
          ],
          "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000644",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "annual_temp": {
          "name": "annual_temp",
          "title": "mean annual temperature",
          "aliases": [
            "mean annual temperature"
          ],
          "mappings": [
            "mixs:annual_temp"
          ],
          "description": "Mean annual temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "12.5 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000642",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bacteria_carb_prod": {
          "name": "bacteria_carb_prod",
          "aliases": [
            "bacterial carbon production"
          ],
          "mappings": [
            "mixs:bacteria_carb_prod"
          ],
          "description": "Measurement of bacterial carbon production",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bishomohopanol": {
          "name": "bishomohopanol",
          "aliases": [
            "bishomohopanol"
          ],
          "mappings": [
            "mixs:bishomohopanol"
          ],
          "description": "Concentration of bishomohopanol ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "bromide": {
          "name": "bromide",
          "aliases": [
            "bromide"
          ],
          "mappings": [
            "mixs:bromide"
          ],
          "description": "Concentration of bromide ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "calcium": {
          "name": "calcium",
          "aliases": [
            "calcium"
          ],
          "mappings": [
            "mixs:calcium"
          ],
          "description": "Concentration of calcium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "carb_nitro_ratio": {
          "name": "carb_nitro_ratio",
          "aliases": [
            "carbon/nitrogen ratio"
          ],
          "mappings": [
            "mixs:carb_nitro_ratio"
          ],
          "description": "Ratio of amount or concentrations of carbon to nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "chem_administration": {
          "name": "chem_administration",
          "aliases": [
            "chemical administration"
          ],
          "mappings": [
            "mixs:chem_administration"
          ],
          "description": "\"List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "controlled term value",
          "multivalued": false,
          "owner": "biosample"
        },
        "chloride": {
          "name": "chloride",
          "aliases": [
            "chloride"
          ],
          "mappings": [
            "mixs:chloride"
          ],
          "description": "Concentration of chloride in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "chlorophyll": {
          "name": "chlorophyll",
          "aliases": [
            "chlorophyll"
          ],
          "mappings": [
            "mixs:chlorophyll"
          ],
          "description": "Concentration of chlorophyll",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "collection_date": {
          "name": "collection_date",
          "title": "collection date",
          "aliases": [
            "collection date"
          ],
          "mappings": [
            "mixs:collection_date"
          ],
          "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
          "comments": [
            "Expected value: date and time"
          ],
          "examples": [
            {
              "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000011",
          "multivalued": false,
          "owner": "biosample"
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "title": "current land use",
          "aliases": [
            "current land use"
          ],
          "mappings": [
            "mixs:cur_land_use"
          ],
          "description": "Present state of sample site",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "conifers"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[cities|farmstead|industrial areas|roads/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]",
          "range": "cur_land_use_enum",
          "slot_uri": "MIXS:0001080",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "[cities|farmstead|industrial areas|roads\\/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines\\/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage\\-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi\\-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]"
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "title": "current vegetation",
          "aliases": [
            "current vegetation"
          ],
          "mappings": [
            "mixs:cur_vegetation"
          ],
          "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
          "comments": [
            "Expected value: current vegetation type"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000312",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "title": "current vegetation method",
          "aliases": [
            "current vegetation method"
          ],
          "mappings": [
            "mixs:cur_vegetation_meth"
          ],
          "description": "Reference or method used in vegetation classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000314",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "title": "history/crop rotation",
          "aliases": [
            "history/crop rotation"
          ],
          "mappings": [
            "mixs:crop_rotation"
          ],
          "description": "Whether or not crop is rotated, and if yes, rotation schedule",
          "comments": [
            "Expected value: crop rotation status;schedule"
          ],
          "examples": [
            {
              "value": "yes;R2/2017-01-01/2018-12-31/P6M"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000318",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "density": {
          "name": "density",
          "aliases": [
            "density"
          ],
          "mappings": [
            "mixs:density"
          ],
          "description": "\"Density of the sample, which is its mass per unit volume (aka volumetric mass density)\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "depth": {
          "name": "depth",
          "title": "depth",
          "aliases": [
            "depth",
            "geographic location (depth)"
          ],
          "mappings": [
            "mixs:depth"
          ],
          "description": "MIxS:The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.|NMDC:Please refer to the definitions of depth in the environmental packages",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "10 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000018",
          "multivalued": false,
          "required": true,
          "owner": "biosample"
        },
        "diss_carb_dioxide": {
          "name": "diss_carb_dioxide",
          "aliases": [
            "dissolved carbon dioxide"
          ],
          "mappings": [
            "mixs:diss_carb_dioxide"
          ],
          "description": "Concentration of dissolved carbon dioxide in the sample or liquid portion of the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_hydrogen": {
          "name": "diss_hydrogen",
          "aliases": [
            "dissolved hydrogen"
          ],
          "mappings": [
            "mixs:diss_hydrogen"
          ],
          "description": "Concentration of dissolved hydrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_inorg_carb": {
          "name": "diss_inorg_carb",
          "aliases": [
            "dissolved inorganic carbon"
          ],
          "mappings": [
            "mixs:diss_inorg_carb"
          ],
          "description": "\"Dissolved inorganic carbon concentration in the sample, typically measured after filtering the sample using a 0.45 micrometer filter\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_inorg_phosp": {
          "name": "diss_inorg_phosp",
          "aliases": [
            "dissolved inorganic phosphorus"
          ],
          "mappings": [
            "mixs:diss_inorg_phosp"
          ],
          "description": "Concentration of dissolved inorganic phosphorus in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_org_carb": {
          "name": "diss_org_carb",
          "aliases": [
            "dissolved organic carbon"
          ],
          "mappings": [
            "mixs:diss_org_carb"
          ],
          "description": "\"Concentration of dissolved organic carbon in the sample, liquid portion of the sample, or aqueous phase of the fluid\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_org_nitro": {
          "name": "diss_org_nitro",
          "aliases": [
            "dissolved organic nitrogen"
          ],
          "mappings": [
            "mixs:diss_org_nitro"
          ],
          "description": "Dissolved organic nitrogen concentration measured as; total dissolved nitrogen - NH4 - NO3 - NO2",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "diss_oxygen": {
          "name": "diss_oxygen",
          "aliases": [
            "dissolved oxygen"
          ],
          "mappings": [
            "mixs:diss_oxygen"
          ],
          "description": "Concentration of dissolved oxygen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "drainage_class": {
          "name": "drainage_class",
          "title": "drainage classification",
          "aliases": [
            "drainage classification"
          ],
          "mappings": [
            "mixs:drainage_class"
          ],
          "description": "Drainage classification from a standard system such as the USDA system",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "well"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]",
          "range": "drainage_class_enum",
          "slot_uri": "MIXS:0001085",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]"
        },
        "elev": {
          "name": "elev",
          "title": "elevation",
          "aliases": [
            "elevation"
          ],
          "mappings": [
            "mixs:elev"
          ],
          "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000093",
          "multivalued": false,
          "required": true,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "env_package": {
          "name": "env_package",
          "aliases": [
            "environmental package"
          ],
          "mappings": [
            "mixs:env_package"
          ],
          "description": "\"MIxS extension for reporting of measurements and observations obtained from one or more of the environments where the sample was obtained. All environmental packages listed here are further defined in separate subtables. By giving the name of the environmental package, a selection of fields can be made from the subtables and can be reported\"",
          "in_subset": [
            "mixs extension"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "[air|built environment|host\\-associated|human\\-associated|human\\-skin|human\\-oral|human\\-gut|human\\-vaginal|hydrocarbon resources\\-cores|hydrocarbon resources\\-fluids\\/swabs|microbial mat\\/biofilm|misc environment|plant\\-associated|sediment|soil|wastewater\\/sludge|water]"
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "title": "broad-scale environmental context",
          "aliases": [
            "broad-scale environmental context"
          ],
          "mappings": [
            "mixs:env_broad_scale"
          ],
          "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
          "comments": [
            "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
          ],
          "examples": [
            {
              "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000012",
          "multivalued": false,
          "required": true,
          "owner": "biosample",
          "pattern": ".* \\S+:\\S+"
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "title": "local environmental context",
          "aliases": [
            "local environmental context"
          ],
          "mappings": [
            "mixs:env_local_scale"
          ],
          "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
          "comments": [
            "Expected value: Environmental entities having causal influences upon the entity at time of sampling."
          ],
          "examples": [
            {
              "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000013",
          "multivalued": false,
          "required": true,
          "owner": "biosample",
          "pattern": ".* \\S+:\\S+"
        },
        "env_medium": {
          "name": "env_medium",
          "title": "environmental medium",
          "aliases": [
            "environmental medium"
          ],
          "mappings": [
            "mixs:env_medium"
          ],
          "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
          "comments": [
            "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
          ],
          "examples": [
            {
              "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000014",
          "multivalued": false,
          "required": true,
          "owner": "biosample",
          "pattern": ".* \\S+:\\S+"
        },
        "extreme_event": {
          "name": "extreme_event",
          "title": "history/extreme events",
          "aliases": [
            "history/extreme events"
          ],
          "mappings": [
            "mixs:extreme_event"
          ],
          "description": "Unusual physical events that may have affected microbial populations",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000320",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "fao_class": {
          "name": "fao_class",
          "title": "soil_taxonomic/FAO classification",
          "aliases": [
            "soil_taxonomic/FAO classification"
          ],
          "mappings": [
            "mixs:fao_class"
          ],
          "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "Luvisols"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]",
          "range": "fao_class_enum",
          "slot_uri": "MIXS:0001083",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]"
        },
        "fire": {
          "name": "fire",
          "title": "history/fire",
          "aliases": [
            "history/fire"
          ],
          "mappings": [
            "mixs:fire"
          ],
          "description": "Historical and/or physical evidence of fire",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0001086",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "flooding": {
          "name": "flooding",
          "title": "history/flooding",
          "aliases": [
            "history/flooding"
          ],
          "mappings": [
            "mixs:flooding"
          ],
          "description": "Historical and/or physical evidence of flooding",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000319",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "geo_loc_name": {
          "name": "geo_loc_name",
          "title": "geographic location (country and/or sea,region)",
          "aliases": [
            "geographic location (country and/or sea,region)"
          ],
          "mappings": [
            "mixs:geo_loc_name"
          ],
          "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
          "comments": [
            "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name"
          ],
          "examples": [
            {
              "value": "USA: Maryland, Bethesda"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{term}: {term}, {text}",
          "range": "text value",
          "slot_uri": "MIXS:0000010",
          "multivalued": false,
          "owner": "biosample"
        },
        "glucosidase_act": {
          "name": "glucosidase_act",
          "aliases": [
            "glucosidase activity"
          ],
          "mappings": [
            "mixs:glucosidase_act"
          ],
          "description": "Measurement of glucosidase activity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "title": "extreme_unusual_properties/heavy metals",
          "aliases": [
            "extreme_unusual_properties/heavy metals"
          ],
          "mappings": [
            "mixs:heavy_metals"
          ],
          "description": "MIxS:Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.|NMDC:Heavy metals present and concentrationsany drug used by subject and the frequency of usage; can include multiple heavy metals and concentrations",
          "comments": [
            "Expected value: heavy metal name;measurement value unit",
            "Preferred unit: microgram per gram"
          ],
          "examples": [
            {
              "value": "mercury;0.09 micrograms per gram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000652",
          "multivalued": true,
          "required": false,
          "owner": "biosample"
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "title": "extreme_unusual_properties/heavy metals method",
          "aliases": [
            "extreme_unusual_properties/heavy metals method"
          ],
          "mappings": [
            "mixs:heavy_metals_meth"
          ],
          "description": "Reference or method used in determining heavy metals",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000343",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "horizon": {
          "name": "horizon",
          "aliases": [
            "horizon"
          ],
          "mappings": [
            "mixs:horizon"
          ],
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]"
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "title": "horizon method",
          "aliases": [
            "horizon method"
          ],
          "mappings": [
            "mixs:horizon_meth"
          ],
          "description": "Reference or method used in determining the horizon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000321",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "lat_lon": {
          "name": "lat_lon",
          "title": "geographic location (latitude and longitude)",
          "aliases": [
            "geographic location (latitude and longitude)"
          ],
          "mappings": [
            "mixs:lat_lon"
          ],
          "description": "MIxS:The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system|NMDC: This is currently a required field but it's not clear if this should be required for human hosts",
          "comments": [
            "Expected value: decimal degrees,  limit to 8 decimal points"
          ],
          "examples": [
            {
              "value": "50.586825 6.408977"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {float}",
          "range": "geolocation value",
          "slot_uri": "MIXS:0000009",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\d+[.\\d+]"
        },
        "link_addit_analys": {
          "name": "link_addit_analys",
          "title": "links to additional analysis",
          "aliases": [
            "links to additional analysis"
          ],
          "mappings": [
            "mixs:link_addit_analys"
          ],
          "description": "Link to additional analysis results performed on the sample",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000340",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "link_class_info": {
          "name": "link_class_info",
          "title": "link to classification information",
          "aliases": [
            "link to classification information"
          ],
          "mappings": [
            "mixs:link_class_info"
          ],
          "description": "Link to digitized soil maps or other soil classification information",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000329",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "title": "link to climate information",
          "aliases": [
            "link to climate information"
          ],
          "mappings": [
            "mixs:link_climate_info"
          ],
          "description": "Link to climate resource",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000328",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "local_class": {
          "name": "local_class",
          "title": "soil_taxonomic/local classification",
          "aliases": [
            "soil_taxonomic/local classification"
          ],
          "mappings": [
            "mixs:local_class"
          ],
          "description": "Soil classification based on local soil classification system",
          "comments": [
            "Expected value: local classification name"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000330",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "title": "soil_taxonomic/local classification method",
          "aliases": [
            "soil_taxonomic/local classification method"
          ],
          "mappings": [
            "mixs:local_class_meth"
          ],
          "description": "Reference or method used in determining the local soil classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000331",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "magnesium": {
          "name": "magnesium",
          "aliases": [
            "magnesium"
          ],
          "mappings": [
            "mixs:magnesium"
          ],
          "description": "Concentration of magnesium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "mean_frict_vel": {
          "name": "mean_frict_vel",
          "aliases": [
            "mean friction velocity"
          ],
          "mappings": [
            "mixs:mean_frict_vel"
          ],
          "description": "Measurement of mean friction velocity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "mean_peak_frict_vel": {
          "name": "mean_peak_frict_vel",
          "aliases": [
            "mean peak friction velocity"
          ],
          "mappings": [
            "mixs:mean_peak_frict_vel"
          ],
          "description": "Measurement of mean peak friction velocity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "title": "microbial biomass",
          "aliases": [
            "microbial biomass"
          ],
          "mappings": [
            "mixs:microbial_biomass"
          ],
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: ton, kilogram, gram per kilogram soil"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000650",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "microbial_biomass_meth": {
          "name": "microbial_biomass_meth",
          "aliases": [
            "microbial biomass method"
          ],
          "mappings": [
            "mixs:microbial_biomass_meth"
          ],
          "description": "Reference or method used in determining microbial biomass",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "misc_param": {
          "name": "misc_param",
          "title": "miscellaneous parameter",
          "aliases": [
            "miscellaneous parameter"
          ],
          "mappings": [
            "mixs:misc_param"
          ],
          "description": "Any other measurement performed or parameter collected, that is not listed here",
          "comments": [
            "Expected value: parameter name;measurement value"
          ],
          "examples": [
            {
              "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000752",
          "multivalued": true,
          "required": false,
          "owner": "biosample"
        },
        "n_alkanes": {
          "name": "n_alkanes",
          "aliases": [
            "n-alkanes"
          ],
          "mappings": [
            "mixs:n_alkanes"
          ],
          "description": "Concentration of n-alkanes; can include multiple n-alkanes",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample"
        },
        "nitrate": {
          "name": "nitrate",
          "aliases": [
            "nitrate"
          ],
          "mappings": [
            "mixs:nitrate"
          ],
          "description": "Concentration of nitrate in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "nitrite": {
          "name": "nitrite",
          "aliases": [
            "nitrite"
          ],
          "mappings": [
            "mixs:nitrite"
          ],
          "description": "Concentration of nitrite in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "org_matter": {
          "name": "org_matter",
          "aliases": [
            "organic matter"
          ],
          "mappings": [
            "mixs:org_matter"
          ],
          "description": "Concentration of organic matter ",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "org_nitro": {
          "name": "org_nitro",
          "aliases": [
            "organic nitrogen"
          ],
          "mappings": [
            "mixs:org_nitro"
          ],
          "description": "Concentration of organic nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "organism_count": {
          "name": "organism_count",
          "aliases": [
            "organism count"
          ],
          "mappings": [
            "mixs:organism_count"
          ],
          "description": "\"Total cell count of any organism (or group of organisms) per gram, volume or area of sample, should include name of organism followed by count. The method that was used for the enumeration (e.g. qPCR, atp, mpn, etc.) Should also be provided. (example: total prokaryotes; 3.5e7 cells per ml; qpcr)\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit};[qPCR|ATP|MPN|other]",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample"
        },
        "oxy_stat_samp": {
          "name": "oxy_stat_samp",
          "aliases": [
            "oxygenation status of sample"
          ],
          "mappings": [
            "mixs:oxy_stat_samp"
          ],
          "description": "Oxygenation status of sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "[aerobic|anaerobic|other]"
        },
        "part_org_carb": {
          "name": "part_org_carb",
          "aliases": [
            "particulate organic carbon"
          ],
          "mappings": [
            "mixs:part_org_carb"
          ],
          "description": "Concentration of particulate organic carbon",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "perturbation": {
          "name": "perturbation",
          "aliases": [
            "perturbation"
          ],
          "mappings": [
            "mixs:perturbation"
          ],
          "description": "\"Type of perturbation, e.g. chemical administration, physical disturbance, etc., coupled with perturbation regimen including how many times the perturbation was repeated, how long each perturbation lasted, and the start and end time of the entire perturbation period; can include multiple perturbation types\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "petroleum_hydrocarb": {
          "name": "petroleum_hydrocarb",
          "aliases": [
            "petroleum hydrocarbon"
          ],
          "mappings": [
            "mixs:petroleum_hydrocarb"
          ],
          "description": "Concentration of petroleum hydrocarbon",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "ph": {
          "name": "ph",
          "title": "pH",
          "aliases": [
            "pH"
          ],
          "mappings": [
            "mixs:ph"
          ],
          "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "7.2"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0001001",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+]"
        },
        "ph_meth": {
          "name": "ph_meth",
          "title": "pH method",
          "aliases": [
            "pH method"
          ],
          "mappings": [
            "mixs:ph_meth"
          ],
          "description": "Reference or method used in determining ph",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0001106",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "phaeopigments": {
          "name": "phaeopigments",
          "aliases": [
            "phaeopigments"
          ],
          "mappings": [
            "mixs:phaeopigments"
          ],
          "description": "Concentration of phaeopigments; can include multiple phaeopigments",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample"
        },
        "phosplipid_fatt_acid": {
          "name": "phosplipid_fatt_acid",
          "aliases": [
            "phospholipid fatty acid"
          ],
          "mappings": [
            "mixs:phosplipid_fatt_acid"
          ],
          "description": "Concentration of phospholipid fatty acids; can include multiple values",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample"
        },
        "pool_dna_extracts": {
          "name": "pool_dna_extracts",
          "title": "pooling of DNA extracts (if done)",
          "aliases": [
            "pooling of DNA extracts (if done)"
          ],
          "mappings": [
            "mixs:pool_dna_extracts"
          ],
          "description": "Indicate whether multiple DNA extractions were mixed. If the answer yes, the number of extracts that were pooled should be given",
          "comments": [
            "Expected value: pooling status;number of pooled extracts"
          ],
          "examples": [
            {
              "value": "yes;5"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{integer}",
          "range": "text value",
          "slot_uri": "MIXS:0000325",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "potassium": {
          "name": "potassium",
          "aliases": [
            "potassium"
          ],
          "mappings": [
            "mixs:potassium"
          ],
          "description": "Concentration of potassium in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "pressure": {
          "name": "pressure",
          "aliases": [
            "pressure"
          ],
          "mappings": [
            "mixs:pressure"
          ],
          "description": "\"Pressure to which the sample is subject to, in atmospheres\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "title": "history/previous land use",
          "aliases": [
            "history/previous land use"
          ],
          "mappings": [
            "mixs:previous_land_use"
          ],
          "description": "Previous land use and dates",
          "comments": [
            "Expected value: land use name;date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{timestamp}",
          "range": "text value",
          "slot_uri": "MIXS:0000315",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "previous_land_use_meth": {
          "name": "previous_land_use_meth",
          "aliases": [
            "history/previous land use method"
          ],
          "mappings": [
            "mixs:previous_land_use_meth"
          ],
          "description": "Reference or method used in determining previous land use and dates",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "profile_position": {
          "name": "profile_position",
          "title": "profile position",
          "aliases": [
            "profile position"
          ],
          "mappings": [
            "mixs:profile_position"
          ],
          "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "summit"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[summit|shoulder|backslope|footslope|toeslope]",
          "range": "profile_position_enum",
          "slot_uri": "MIXS:0001084",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "[summit|shoulder|backslope|footslope|toeslope]"
        },
        "redox_potential": {
          "name": "redox_potential",
          "aliases": [
            "redox potential"
          ],
          "mappings": [
            "mixs:redox_potential"
          ],
          "description": "\"Redox potential, measured relative to a hydrogen cell, indicating oxidation or reduction potential\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "salinity": {
          "name": "salinity",
          "aliases": [
            "salinity"
          ],
          "mappings": [
            "mixs:salinity"
          ],
          "description": "\"Salinity is the total concentration of all dissolved salts in a water sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "title": "salinity method",
          "aliases": [
            "salinity method",
            "extreme_unusual_properties/salinity method"
          ],
          "mappings": [
            "mixs:salinity_meth"
          ],
          "description": "Reference or method used in determining salinity",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000341",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "samp_collect_device": {
          "name": "samp_collect_device",
          "aliases": [
            "sample collection device or method"
          ],
          "mappings": [
            "mixs:samp_collect_device"
          ],
          "description": "The method or device employed for collecting the sample",
          "in_subset": [
            "nucleic acid sequence source"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "samp_mat_process": {
          "name": "samp_mat_process",
          "aliases": [
            "sample material processing"
          ],
          "mappings": [
            "mixs:samp_mat_process"
          ],
          "description": "\"Any processing applied to the sample during or after retrieving the sample from environment. This field accepts OBI, for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI\"",
          "in_subset": [
            "nucleic acid sequence source"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "controlled term value",
          "multivalued": false,
          "owner": "biosample"
        },
        "samp_store_dur": {
          "name": "samp_store_dur",
          "aliases": [
            "sample storage duration"
          ],
          "mappings": [
            "mixs:samp_store_dur"
          ],
          "description": "Duration for which the sample was stored",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "samp_store_loc": {
          "name": "samp_store_loc",
          "aliases": [
            "sample storage location"
          ],
          "mappings": [
            "mixs:samp_store_loc"
          ],
          "description": "\"Location at which sample was stored, usually name of a specific freezer/room\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "samp_store_temp": {
          "name": "samp_store_temp",
          "aliases": [
            "sample storage temperature"
          ],
          "mappings": [
            "mixs:samp_store_temp"
          ],
          "description": "\"Temperature at which sample was stored, e.g. -80 degree Celsius\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "samp_vol_we_dna_ext": {
          "name": "samp_vol_we_dna_ext",
          "aliases": [
            "sample volume or weight for DNA extraction"
          ],
          "mappings": [
            "mixs:samp_vol_we_dna_ext"
          ],
          "description": "\"Volume (ml), weight (g) of processed sample, or surface area swabbed from sample for DNA extraction\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "season_temp": {
          "name": "season_temp",
          "title": "mean seasonal temperature",
          "aliases": [
            "mean seasonal temperature"
          ],
          "mappings": [
            "mixs:season_temp"
          ],
          "description": "Mean seasonal temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "18 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000643",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "season_precpt": {
          "name": "season_precpt",
          "title": "mean seasonal precipitation",
          "aliases": [
            "mean seasonal precipitation"
          ],
          "mappings": [
            "mixs:season_precpt"
          ],
          "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000645",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sieving": {
          "name": "sieving",
          "title": "composite design/sieving",
          "aliases": [
            "composite design/sieving",
            "composite design/sieving (if any)"
          ],
          "mappings": [
            "mixs:sieving"
          ],
          "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
          "comments": [
            "Expected value: design name and/or size;amount"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000322",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "size_frac_low": {
          "name": "size_frac_low",
          "aliases": [
            "size-fraction lower threshold"
          ],
          "mappings": [
            "mixs:size_frac_low"
          ],
          "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "size_frac_up": {
          "name": "size_frac_up",
          "aliases": [
            "size-fraction upper threshold"
          ],
          "mappings": [
            "mixs:size_frac_up"
          ],
          "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "title": "slope gradient",
          "aliases": [
            "slope gradient"
          ],
          "mappings": [
            "mixs:slope_gradient"
          ],
          "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000646",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "title": "slope aspect",
          "aliases": [
            "slope aspect"
          ],
          "mappings": [
            "mixs:slope_aspect"
          ],
          "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000647",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sodium": {
          "name": "sodium",
          "aliases": [
            "sodium"
          ],
          "mappings": [
            "mixs:sodium"
          ],
          "description": "Sodium concentration in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "soil_type": {
          "name": "soil_type",
          "title": "soil type",
          "aliases": [
            "soil type"
          ],
          "mappings": [
            "mixs:soil_type"
          ],
          "description": "MIxS:Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.|NMDC:Soil series name or other lower-level classification",
          "comments": [
            "Expected value: ENVO_00001998"
          ],
          "examples": [
            {
              "value": "plinthosol [ENVO:00002250]"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "text value",
          "slot_uri": "MIXS:0000332",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "title": "soil type method",
          "aliases": [
            "soil type method"
          ],
          "mappings": [
            "mixs:soil_type_meth"
          ],
          "description": "Reference or method used in determining soil series name or other lower-level classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000334",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "store_cond": {
          "name": "store_cond",
          "title": "storage conditions",
          "aliases": [
            "storage conditions",
            "storage conditions (fresh/frozen/other)"
          ],
          "mappings": [
            "mixs:store_cond"
          ],
          "description": "MIxS:Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).|NMDC:Explain how and for how long the soil sample was stored before DNA extraction",
          "comments": [
            "Expected value: storage condition type;duration"
          ],
          "examples": [
            {
              "value": "-20 degree Celsius freezer;P2Y10D"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000327",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "sulfate": {
          "name": "sulfate",
          "aliases": [
            "sulfate"
          ],
          "mappings": [
            "mixs:sulfate"
          ],
          "description": "Concentration of sulfate in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "sulfide": {
          "name": "sulfide",
          "aliases": [
            "sulfide"
          ],
          "mappings": [
            "mixs:sulfide"
          ],
          "description": "Concentration of sulfide in the sample",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "temp": {
          "name": "temp",
          "title": "temperature",
          "aliases": [
            "temperature"
          ],
          "mappings": [
            "mixs:temp"
          ],
          "description": "MIxS:Temperature of the sample at the time of sampling.|NMDC:Temperature of the sample at the time of sampling",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "25 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000113",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "texture": {
          "name": "texture",
          "aliases": [
            "texture"
          ],
          "mappings": [
            "mixs:texture"
          ],
          "description": "\"The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "texture_meth": {
          "name": "texture_meth",
          "aliases": [
            "texture method"
          ],
          "mappings": [
            "mixs:texture_meth"
          ],
          "description": "Reference or method used in determining soil texture",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "tillage": {
          "name": "tillage",
          "title": "history/tillage",
          "aliases": [
            "history/tillage"
          ],
          "mappings": [
            "mixs:tillage"
          ],
          "description": "Note method(s) used for tilling",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "chisel"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]",
          "range": "tillage_enum",
          "slot_uri": "MIXS:0001081",
          "multivalued": true,
          "required": false,
          "owner": "biosample",
          "pattern": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]"
        },
        "tidal_stage": {
          "name": "tidal_stage",
          "aliases": [
            "tidal stage"
          ],
          "mappings": [
            "mixs:tidal_stage"
          ],
          "description": "Stage of tide",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "[low tide|ebb tide|flood tide|high tide]"
        },
        "tot_carb": {
          "name": "tot_carb",
          "aliases": [
            "total carbon"
          ],
          "mappings": [
            "mixs:tot_carb"
          ],
          "description": "Total carbon content",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_depth_water_col": {
          "name": "tot_depth_water_col",
          "aliases": [
            "total depth of water column"
          ],
          "mappings": [
            "mixs:tot_depth_water_col"
          ],
          "description": "Measurement of total depth of water column",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_diss_nitro": {
          "name": "tot_diss_nitro",
          "aliases": [
            "total dissolved nitrogen"
          ],
          "mappings": [
            "mixs:tot_diss_nitro"
          ],
          "description": "\"Total dissolved nitrogen concentration, reported as nitrogen, measured by: total dissolved nitrogen = NH4 + NO3NO2 + dissolved organic nitrogen\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "title": "total organic carbon",
          "aliases": [
            "total organic carbon"
          ],
          "mappings": [
            "mixs:tot_org_carb"
          ],
          "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram Carbon per kilogram sample material"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000533",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "title": "total organic carbon method",
          "aliases": [
            "total organic carbon method"
          ],
          "mappings": [
            "mixs:tot_org_c_meth"
          ],
          "description": "Reference or method used in determining total organic carbon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000337",
          "multivalued": false,
          "required": false,
          "owner": "biosample"
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "title": "total nitrogen content",
          "aliases": [
            "total nitrogen content"
          ],
          "mappings": [
            "mixs:tot_nitro_content"
          ],
          "description": "Total nitrogen content of the sample",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: microgram per liter, micromole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000530",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_nitro_content_meth": {
          "name": "tot_nitro_content_meth",
          "aliases": [
            "total nitrogen content method"
          ],
          "mappings": [
            "mixs:tot_nitro_content_meth"
          ],
          "description": "Reference or method used in determining the total nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "tot_phosp": {
          "name": "tot_phosp",
          "aliases": [
            "total phosphorus"
          ],
          "mappings": [
            "mixs:tot_phosp"
          ],
          "description": "\"Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus\"",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "multivalued": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "water_content": {
          "name": "water_content",
          "title": "water content",
          "aliases": [
            "water content"
          ],
          "mappings": [
            "mixs:water_content"
          ],
          "description": "Water content measurement",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram per gram or cubic centimeter per cubic centimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000185",
          "multivalued": false,
          "required": false,
          "owner": "biosample",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "water_content_soil_meth": {
          "name": "water_content_soil_meth",
          "aliases": [
            "water content method"
          ],
          "mappings": [
            "mixs:water_content_soil_meth"
          ],
          "description": "Reference or method used in determining the water content of soil",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "attribute",
          "range": "text value",
          "multivalued": false,
          "owner": "biosample"
        },
        "ecosystem": {
          "name": "ecosystem",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "biosample"
        },
        "ecosystem_category": {
          "name": "ecosystem_category",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "biosample"
        },
        "ecosystem_type": {
          "name": "ecosystem_type",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "biosample"
        },
        "ecosystem_subtype": {
          "name": "ecosystem_subtype",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "biosample"
        },
        "specific_ecosystem": {
          "name": "specific_ecosystem",
          "description": "TODO",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "gold_path_field",
          "owner": "biosample"
        },
        "add_date": {
          "name": "add_date",
          "description": "The date on which the information was added to the database.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "community": {
          "name": "community",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "depth2": {
          "name": "depth2",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "biosample"
        },
        "habitat": {
          "name": "habitat",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "host_name": {
          "name": "host_name",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "identifier": {
          "name": "identifier",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "location": {
          "name": "location",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "mod_date": {
          "name": "mod_date",
          "description": "The last date on which the database information was modified.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "ncbi_taxonomy_name": {
          "name": "ncbi_taxonomy_name",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "proport_woa_temperature": {
          "name": "proport_woa_temperature",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "salinity_category": {
          "name": "salinity_category",
          "description": "Categorcial description of the sample's salinity. Examples: halophile, halotolerant, hypersaline, huryhaline",
          "from_schema": "http://example.com/soil_biosample",
          "see_also": [
            "https://github.com/microbiomedata/nmdc-metadata/pull/297"
          ],
          "range": "string",
          "owner": "biosample"
        },
        "sample_collection_site": {
          "name": "sample_collection_site",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "soluble_iron_micromol": {
          "name": "soluble_iron_micromol",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "owner": "biosample"
        },
        "subsurface_depth": {
          "name": "subsurface_depth",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "biosample"
        },
        "subsurface_depth2": {
          "name": "subsurface_depth2",
          "from_schema": "http://example.com/soil_biosample",
          "range": "quantity value",
          "owner": "biosample"
        },
        "GOLD sample identifiers": {
          "name": "GOLD sample identifiers",
          "description": "['identifiers for corresponding sample in GOLD']",
          "examples": [
            {
              "value": "https://identifiers.org/gold:GbTODO"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "sample identifiers",
          "mixins": [
            "GOLD identifiers"
          ],
          "multivalued": true,
          "owner": "biosample",
          "pattern": "^GOLD:Gb[0-9]+$"
        },
        "INSDC biosample identifiers": {
          "name": "INSDC biosample identifiers",
          "aliases": [
            "EBI biosample identifiers",
            "NCBI biosample identifiers",
            "DDBJ biosample identifiers"
          ],
          "description": "['identifiers for corresponding sample in INSDC']",
          "examples": [
            {
              "value": "https://identifiers.org/biosample:SAMEA5989477"
            },
            {
              "value": "https://identifiers.org/biosample:SAMD00212331",
              "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "see_also": [
            "https://github.com/bioregistry/bioregistry/issues/108",
            "https://www.ebi.ac.uk/biosamples/",
            "https://www.ncbi.nlm.nih.gov/biosample",
            "https://www.ddbj.nig.ac.jp/biosample/index-e.html"
          ],
          "is_a": "sample identifiers",
          "mixins": [
            "INSDC identifiers"
          ],
          "multivalued": true,
          "owner": "biosample",
          "pattern": "^biosample:SAM[NED]([A-Z])?[0-9]+$"
        },
        "INSDC secondary sample identifiers": {
          "name": "INSDC secondary sample identifiers",
          "description": "['secondary identifiers for corresponding sample in INSDC']",
          "comments": [
            "ENA redirects these to primary IDs, e.g. https://www.ebi.ac.uk/ena/browser/view/DRS166340 -> SAMD00212331",
            "MGnify uses these as their primary sample IDs"
          ],
          "examples": [
            {
              "value": "https://identifiers.org/insdc.sra:DRS166340",
              "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "sample identifiers",
          "mixins": [
            "INSDC identifiers"
          ],
          "owner": "biosample",
          "pattern": "^biosample:(E|D|S)RS[0-9]{6,}$"
        },
        "id": {
          "name": "id",
          "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
          "from_schema": "http://example.com/soil_biosample",
          "multivalued": false,
          "identifier": true,
          "owner": "biosample"
        },
        "name": {
          "name": "name",
          "description": "A human readable label for an entity",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": false,
          "owner": "biosample"
        },
        "description": {
          "name": "description",
          "description": "a human-readable description of a thing",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "slot_uri": "dcterms:description",
          "multivalued": false,
          "owner": "biosample"
        }
      },
      "slot_usage": {
        "lat_lon": {
          "name": "lat_lon",
          "description": "This is currently a required field but it's not clear if this should be required for human hosts",
          "required": false
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "required": true
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "required": true
        },
        "env_medium": {
          "name": "env_medium",
          "required": true
        }
      }
    },
    "controlled term value": {
      "name": "controlled term value",
      "description": "A controlled term or class from an ontology",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute value",
      "slots": {
        "term": {
          "name": "term",
          "description": "pointer to an ontology class",
          "from_schema": "http://example.com/soil_biosample",
          "domain": "controlled term value",
          "range": "ontology class",
          "slot_uri": "rdf:type",
          "inlined": true,
          "owner": "controlled term value"
        },
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "controlled term value"
        },
        "was generated by": {
          "name": "was generated by",
          "mappings": [
            "prov:wasGeneratedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "controlled term value"
        }
      }
    },
    "geolocation value": {
      "name": "geolocation value",
      "mappings": [
        "schema:GeoCoordinates"
      ],
      "description": "A normalized value for a location on the earth's surface",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute value",
      "slots": {
        "latitude": {
          "name": "latitude",
          "mappings": [
            "schema:latitude"
          ],
          "description": "latitude",
          "from_schema": "http://example.com/soil_biosample",
          "domain": "geolocation value",
          "range": "decimal degree",
          "slot_uri": "wgs:lat",
          "owner": "geolocation value"
        },
        "longitude": {
          "name": "longitude",
          "mappings": [
            "schema:longitude"
          ],
          "description": "longitude",
          "from_schema": "http://example.com/soil_biosample",
          "domain": "geolocation value",
          "range": "decimal degree",
          "slot_uri": "wgs:long",
          "owner": "geolocation value"
        },
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "geolocation value"
        },
        "was generated by": {
          "name": "was generated by",
          "mappings": [
            "prov:wasGeneratedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "geolocation value"
        }
      },
      "slot_usage": {
        "has raw value": {
          "name": "has raw value",
          "description": "The raw value for a  geolocation should follow {lat} {long}"
        }
      }
    },
    "named thing": {
      "name": "named thing",
      "description": "a databased entity or concept/class",
      "from_schema": "http://example.com/soil_biosample",
      "abstract": true,
      "slots": {
        "id": {
          "name": "id",
          "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
          "from_schema": "http://example.com/soil_biosample",
          "multivalued": false,
          "identifier": true,
          "owner": "named thing"
        },
        "name": {
          "name": "name",
          "description": "A human readable label for an entity",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": false,
          "owner": "named thing"
        },
        "description": {
          "name": "description",
          "description": "a human-readable description of a thing",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "slot_uri": "dcterms:description",
          "multivalued": false,
          "owner": "named thing"
        },
        "alternative identifiers": {
          "name": "alternative identifiers",
          "description": "A list of alternative identifiers for the entity.",
          "from_schema": "http://example.com/soil_biosample",
          "range": "string",
          "multivalued": true,
          "owner": "named thing"
        }
      }
    },
    "quantity value": {
      "name": "quantity value",
      "mappings": [
        "schema:QuantityValue"
      ],
      "description": "MIxS:used to record a measurement|NMDC:A simple quantity, e.g. 2cm",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute value",
      "slots": {
        "has unit": {
          "name": "has unit",
          "description": "Example \"m\"",
          "from_schema": "http://example.com/soil_biosample",
          "owner": "quantity value"
        },
        "has numeric value": {
          "name": "has numeric value",
          "from_schema": "http://example.com/soil_biosample",
          "range": "double",
          "owner": "quantity value"
        },
        "has minimum numeric value": {
          "name": "has minimum numeric value",
          "description": "The minimum value part, expressed as number, of the quantity value when the value covers a range.",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "has numeric value",
          "owner": "quantity value"
        },
        "has maximum numeric value": {
          "name": "has maximum numeric value",
          "description": "The maximum value part, expressed as number, of the quantity value when the value covers a range.",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "has numeric value",
          "owner": "quantity value"
        },
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "quantity value"
        },
        "was generated by": {
          "name": "was generated by",
          "mappings": [
            "prov:wasGeneratedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "quantity value"
        }
      },
      "attributes": {
        "has unit": {
          "name": "has unit",
          "description": "Example \"m\"",
          "from_schema": "http://example.com/soil_biosample"
        },
        "has numeric value": {
          "name": "has numeric value",
          "from_schema": "http://example.com/soil_biosample",
          "range": "double"
        },
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}"
        }
      }
    },
    "soil": {
      "name": "soil",
      "description": "soil",
      "from_schema": "http://w3id.org/mixs/soil",
      "slots": {
        "lat_lon": {
          "name": "lat_lon",
          "title": "geographic location (latitude and longitude)",
          "aliases": [
            "geographic location (latitude and longitude)"
          ],
          "mappings": [
            "mixs:lat_lon"
          ],
          "description": "MIxS:The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system|NMDC: This is currently a required field but it's not clear if this should be required for human hosts",
          "comments": [
            "Expected value: decimal degrees,  limit to 8 decimal points"
          ],
          "examples": [
            {
              "value": "50.586825 6.408977"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {float}",
          "range": "geolocation value",
          "slot_uri": "MIXS:0000009",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\d+[.\\d+]"
        },
        "depth": {
          "name": "depth",
          "title": "depth",
          "aliases": [
            "depth",
            "geographic location (depth)"
          ],
          "mappings": [
            "mixs:depth"
          ],
          "description": "MIxS:The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.|NMDC:Please refer to the definitions of depth in the environmental packages",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "10 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000018",
          "multivalued": false,
          "required": true,
          "owner": "soil"
        },
        "alt": {
          "name": "alt",
          "title": "altitude",
          "aliases": [
            "altitude"
          ],
          "mappings": [
            "mixs:alt"
          ],
          "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000094",
          "multivalued": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "elev": {
          "name": "elev",
          "title": "elevation",
          "aliases": [
            "elevation"
          ],
          "mappings": [
            "mixs:elev"
          ],
          "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "100 meter"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000093",
          "multivalued": false,
          "required": true,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "temp": {
          "name": "temp",
          "title": "temperature",
          "aliases": [
            "temperature"
          ],
          "mappings": [
            "mixs:temp"
          ],
          "description": "MIxS:Temperature of the sample at the time of sampling.|NMDC:Temperature of the sample at the time of sampling",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "25 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000113",
          "multivalued": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "geo_loc_name": {
          "name": "geo_loc_name",
          "title": "geographic location (country and/or sea,region)",
          "aliases": [
            "geographic location (country and/or sea,region)"
          ],
          "mappings": [
            "mixs:geo_loc_name"
          ],
          "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
          "comments": [
            "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name"
          ],
          "examples": [
            {
              "value": "USA: Maryland, Bethesda"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{term}: {term}, {text}",
          "range": "text value",
          "slot_uri": "MIXS:0000010",
          "multivalued": false,
          "owner": "soil"
        },
        "collection_date": {
          "name": "collection_date",
          "title": "collection date",
          "aliases": [
            "collection date"
          ],
          "mappings": [
            "mixs:collection_date"
          ],
          "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
          "comments": [
            "Expected value: date and time"
          ],
          "examples": [
            {
              "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000011",
          "multivalued": false,
          "owner": "soil"
        },
        "env_broad_scale": {
          "name": "env_broad_scale",
          "title": "broad-scale environmental context",
          "aliases": [
            "broad-scale environmental context"
          ],
          "mappings": [
            "mixs:env_broad_scale"
          ],
          "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
          "comments": [
            "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
          ],
          "examples": [
            {
              "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000012",
          "multivalued": false,
          "required": true,
          "owner": "soil",
          "pattern": ".* \\S+:\\S+"
        },
        "env_local_scale": {
          "name": "env_local_scale",
          "title": "local environmental context",
          "aliases": [
            "local environmental context"
          ],
          "mappings": [
            "mixs:env_local_scale"
          ],
          "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
          "comments": [
            "Expected value: Environmental entities having causal influences upon the entity at time of sampling."
          ],
          "examples": [
            {
              "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000013",
          "multivalued": false,
          "required": true,
          "owner": "soil",
          "pattern": ".* \\S+:\\S+"
        },
        "env_medium": {
          "name": "env_medium",
          "title": "environmental medium",
          "aliases": [
            "environmental medium"
          ],
          "mappings": [
            "mixs:env_medium"
          ],
          "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
          "comments": [
            "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
          ],
          "examples": [
            {
              "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
            }
          ],
          "in_subset": [
            "environment"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "environment field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "controlled term value",
          "slot_uri": "MIXS:0000014",
          "multivalued": false,
          "required": true,
          "owner": "soil",
          "pattern": ".* \\S+:\\S+"
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "title": "current land use",
          "aliases": [
            "current land use"
          ],
          "mappings": [
            "mixs:cur_land_use"
          ],
          "description": "Present state of sample site",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "conifers"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[cities|farmstead|industrial areas|roads/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]",
          "range": "cur_land_use_enum",
          "slot_uri": "MIXS:0001080",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "[cities|farmstead|industrial areas|roads\\/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines\\/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage\\-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi\\-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]"
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "title": "current vegetation",
          "aliases": [
            "current vegetation"
          ],
          "mappings": [
            "mixs:cur_vegetation"
          ],
          "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
          "comments": [
            "Expected value: current vegetation type"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000312",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "title": "current vegetation method",
          "aliases": [
            "current vegetation method"
          ],
          "mappings": [
            "mixs:cur_vegetation_meth"
          ],
          "description": "Reference or method used in vegetation classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000314",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "title": "history/previous land use",
          "aliases": [
            "history/previous land use"
          ],
          "mappings": [
            "mixs:previous_land_use"
          ],
          "description": "Previous land use and dates",
          "comments": [
            "Expected value: land use name;date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{timestamp}",
          "range": "text value",
          "slot_uri": "MIXS:0000315",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "prev_land_use_meth": {
          "name": "prev_land_use_meth",
          "title": "history/previous land use method",
          "description": "Reference or method used in determining previous land use and dates",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000316",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "title": "history/crop rotation",
          "aliases": [
            "history/crop rotation"
          ],
          "mappings": [
            "mixs:crop_rotation"
          ],
          "description": "Whether or not crop is rotated, and if yes, rotation schedule",
          "comments": [
            "Expected value: crop rotation status;schedule"
          ],
          "examples": [
            {
              "value": "yes;R2/2017-01-01/2018-12-31/P6M"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000318",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "title": "history/agrochemical additions",
          "aliases": [
            "history/agrochemical additions"
          ],
          "mappings": [
            "mixs:agrochem_addition"
          ],
          "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
          "comments": [
            "Expected value: agrochemical name;agrochemical amount;timestamp",
            "Preferred unit: gram, mole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": "roundup;5 milligram per liter;2018-06-21"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit};{timestamp}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000639",
          "multivalued": true,
          "required": false,
          "owner": "soil"
        },
        "tillage": {
          "name": "tillage",
          "title": "history/tillage",
          "aliases": [
            "history/tillage"
          ],
          "mappings": [
            "mixs:tillage"
          ],
          "description": "Note method(s) used for tilling",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "chisel"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]",
          "range": "tillage_enum",
          "slot_uri": "MIXS:0001081",
          "multivalued": true,
          "required": false,
          "owner": "soil",
          "pattern": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]"
        },
        "fire": {
          "name": "fire",
          "title": "history/fire",
          "aliases": [
            "history/fire"
          ],
          "mappings": [
            "mixs:fire"
          ],
          "description": "Historical and/or physical evidence of fire",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0001086",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "flooding": {
          "name": "flooding",
          "title": "history/flooding",
          "aliases": [
            "history/flooding"
          ],
          "mappings": [
            "mixs:flooding"
          ],
          "description": "Historical and/or physical evidence of flooding",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000319",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "extreme_event": {
          "name": "extreme_event",
          "title": "history/extreme events",
          "aliases": [
            "history/extreme events"
          ],
          "mappings": [
            "mixs:extreme_event"
          ],
          "description": "Unusual physical events that may have affected microbial populations",
          "comments": [
            "Expected value: date"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "timestamp value",
          "slot_uri": "MIXS:0000320",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "soil_horizon": {
          "name": "soil_horizon",
          "title": "soil horizon",
          "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]",
          "range": "soil_horizon_enum",
          "slot_uri": "MIXS:0001082",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "title": "horizon method",
          "aliases": [
            "horizon method"
          ],
          "mappings": [
            "mixs:horizon_meth"
          ],
          "description": "Reference or method used in determining the horizon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000321",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "sieving": {
          "name": "sieving",
          "title": "composite design/sieving",
          "aliases": [
            "composite design/sieving",
            "composite design/sieving (if any)"
          ],
          "mappings": [
            "mixs:sieving"
          ],
          "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
          "comments": [
            "Expected value: design name and/or size;amount"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000322",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "water_content": {
          "name": "water_content",
          "title": "water content",
          "aliases": [
            "water content"
          ],
          "mappings": [
            "mixs:water_content"
          ],
          "description": "Water content measurement",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram per gram or cubic centimeter per cubic centimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000185",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "water_cont_soil_meth": {
          "name": "water_cont_soil_meth",
          "title": "water content method",
          "description": "Reference or method used in determining the water content of soil",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000323",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "pool_dna_extracts": {
          "name": "pool_dna_extracts",
          "title": "pooling of DNA extracts (if done)",
          "aliases": [
            "pooling of DNA extracts (if done)"
          ],
          "mappings": [
            "mixs:pool_dna_extracts"
          ],
          "description": "Indicate whether multiple DNA extractions were mixed. If the answer yes, the number of extracts that were pooled should be given",
          "comments": [
            "Expected value: pooling status;number of pooled extracts"
          ],
          "examples": [
            {
              "value": "yes;5"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{boolean};{integer}",
          "range": "text value",
          "slot_uri": "MIXS:0000325",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "store_cond": {
          "name": "store_cond",
          "title": "storage conditions",
          "aliases": [
            "storage conditions",
            "storage conditions (fresh/frozen/other)"
          ],
          "mappings": [
            "mixs:store_cond"
          ],
          "description": "MIxS:Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).|NMDC:Explain how and for how long the soil sample was stored before DNA extraction",
          "comments": [
            "Expected value: storage condition type;duration"
          ],
          "examples": [
            {
              "value": "-20 degree Celsius freezer;P2Y10D"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{duration}",
          "range": "text value",
          "slot_uri": "MIXS:0000327",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "title": "link to climate information",
          "aliases": [
            "link to climate information"
          ],
          "mappings": [
            "mixs:link_climate_info"
          ],
          "description": "Link to climate resource",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000328",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "annual_temp": {
          "name": "annual_temp",
          "title": "mean annual temperature",
          "aliases": [
            "mean annual temperature"
          ],
          "mappings": [
            "mixs:annual_temp"
          ],
          "description": "Mean annual temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "12.5 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000642",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "season_temp": {
          "name": "season_temp",
          "title": "mean seasonal temperature",
          "aliases": [
            "mean seasonal temperature"
          ],
          "mappings": [
            "mixs:season_temp"
          ],
          "description": "Mean seasonal temperature",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree Celsius"
          ],
          "examples": [
            {
              "value": "18 degree Celsius"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000643",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "title": "mean annual precipitation",
          "aliases": [
            "mean annual precipitation"
          ],
          "mappings": [
            "mixs:annual_precpt"
          ],
          "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000644",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "season_precpt": {
          "name": "season_precpt",
          "title": "mean seasonal precipitation",
          "aliases": [
            "mean seasonal precipitation"
          ],
          "mappings": [
            "mixs:season_precpt"
          ],
          "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: millimeter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000645",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "link_class_info": {
          "name": "link_class_info",
          "title": "link to classification information",
          "aliases": [
            "link to classification information"
          ],
          "mappings": [
            "mixs:link_class_info"
          ],
          "description": "Link to digitized soil maps or other soil classification information",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000329",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "fao_class": {
          "name": "fao_class",
          "title": "soil_taxonomic/FAO classification",
          "aliases": [
            "soil_taxonomic/FAO classification"
          ],
          "mappings": [
            "mixs:fao_class"
          ],
          "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "Luvisols"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]",
          "range": "fao_class_enum",
          "slot_uri": "MIXS:0001083",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]"
        },
        "local_class": {
          "name": "local_class",
          "title": "soil_taxonomic/local classification",
          "aliases": [
            "soil_taxonomic/local classification"
          ],
          "mappings": [
            "mixs:local_class"
          ],
          "description": "Soil classification based on local soil classification system",
          "comments": [
            "Expected value: local classification name"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text}",
          "range": "text value",
          "slot_uri": "MIXS:0000330",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "title": "soil_taxonomic/local classification method",
          "aliases": [
            "soil_taxonomic/local classification method"
          ],
          "mappings": [
            "mixs:local_class_meth"
          ],
          "description": "Reference or method used in determining the local soil classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000331",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "soil_type": {
          "name": "soil_type",
          "title": "soil type",
          "aliases": [
            "soil type"
          ],
          "mappings": [
            "mixs:soil_type"
          ],
          "description": "MIxS:Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.|NMDC:Soil series name or other lower-level classification",
          "comments": [
            "Expected value: ENVO_00001998"
          ],
          "examples": [
            {
              "value": "plinthosol [ENVO:00002250]"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{termLabel} {[termID]}",
          "range": "text value",
          "slot_uri": "MIXS:0000332",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "title": "soil type method",
          "aliases": [
            "soil type method"
          ],
          "mappings": [
            "mixs:soil_type_meth"
          ],
          "description": "Reference or method used in determining soil series name or other lower-level classification",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000334",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "title": "slope gradient",
          "aliases": [
            "slope gradient"
          ],
          "mappings": [
            "mixs:slope_gradient"
          ],
          "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000646",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "title": "slope aspect",
          "aliases": [
            "slope aspect"
          ],
          "mappings": [
            "mixs:slope_aspect"
          ],
          "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: degree"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000647",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "profile_position": {
          "name": "profile_position",
          "title": "profile position",
          "aliases": [
            "profile position"
          ],
          "mappings": [
            "mixs:profile_position"
          ],
          "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "summit"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[summit|shoulder|backslope|footslope|toeslope]",
          "range": "profile_position_enum",
          "slot_uri": "MIXS:0001084",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "[summit|shoulder|backslope|footslope|toeslope]"
        },
        "drainage_class": {
          "name": "drainage_class",
          "title": "drainage classification",
          "aliases": [
            "drainage classification"
          ],
          "mappings": [
            "mixs:drainage_class"
          ],
          "description": "Drainage classification from a standard system such as the USDA system",
          "comments": [
            "Expected value: enumeration"
          ],
          "examples": [
            {
              "value": "well"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]",
          "range": "drainage_class_enum",
          "slot_uri": "MIXS:0001085",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]"
        },
        "soil_text_measure": {
          "name": "soil_text_measure",
          "title": "soil texture measurement",
          "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000335",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "soil_texture_meth": {
          "name": "soil_texture_meth",
          "title": "soil texture method",
          "description": "Reference or method used in determining soil texture",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000336",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "ph": {
          "name": "ph",
          "title": "pH",
          "aliases": [
            "pH"
          ],
          "mappings": [
            "mixs:ph"
          ],
          "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
          "comments": [
            "Expected value: measurement value"
          ],
          "examples": [
            {
              "value": "7.2"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0001001",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+]"
        },
        "ph_meth": {
          "name": "ph_meth",
          "title": "pH method",
          "aliases": [
            "pH method"
          ],
          "mappings": [
            "mixs:ph_meth"
          ],
          "description": "Reference or method used in determining ph",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0001106",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "title": "total organic carbon",
          "aliases": [
            "total organic carbon"
          ],
          "mappings": [
            "mixs:tot_org_carb"
          ],
          "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: gram Carbon per kilogram sample material"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000533",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "title": "total organic carbon method",
          "aliases": [
            "total organic carbon method"
          ],
          "mappings": [
            "mixs:tot_org_c_meth"
          ],
          "description": "Reference or method used in determining total organic carbon",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000337",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "title": "total nitrogen content",
          "aliases": [
            "total nitrogen content"
          ],
          "mappings": [
            "mixs:tot_nitro_content"
          ],
          "description": "Total nitrogen content of the sample",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: microgram per liter, micromole per liter, milligram per liter"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000530",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "tot_nitro_cont_meth": {
          "name": "tot_nitro_cont_meth",
          "title": "total nitrogen content method",
          "description": "Reference or method used in determining the total nitrogen",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000338",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "title": "microbial biomass",
          "aliases": [
            "microbial biomass"
          ],
          "mappings": [
            "mixs:microbial_biomass"
          ],
          "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: ton, kilogram, gram per kilogram soil"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000650",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "micro_biomass_meth": {
          "name": "micro_biomass_meth",
          "title": "microbial biomass method",
          "description": "Reference or method used in determining microbial biomass",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "string",
          "slot_uri": "MIXS:0000339",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "link_addit_analys": {
          "name": "link_addit_analys",
          "title": "links to additional analysis",
          "aliases": [
            "links to additional analysis"
          ],
          "mappings": [
            "mixs:link_addit_analys"
          ],
          "description": "Link to additional analysis results performed on the sample",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000340",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "extreme_salinity": {
          "name": "extreme_salinity",
          "title": "extreme_unusual_properties/salinity",
          "description": "Measured salinity",
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "range": "quantity value",
          "slot_uri": "MIXS:0000651",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "title": "salinity method",
          "aliases": [
            "salinity method",
            "extreme_unusual_properties/salinity method"
          ],
          "mappings": [
            "mixs:salinity_meth"
          ],
          "description": "Reference or method used in determining salinity",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000341",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "title": "extreme_unusual_properties/heavy metals",
          "aliases": [
            "extreme_unusual_properties/heavy metals"
          ],
          "mappings": [
            "mixs:heavy_metals"
          ],
          "description": "MIxS:Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.|NMDC:Heavy metals present and concentrationsany drug used by subject and the frequency of usage; can include multiple heavy metals and concentrations",
          "comments": [
            "Expected value: heavy metal name;measurement value unit",
            "Preferred unit: microgram per gram"
          ],
          "examples": [
            {
              "value": "mercury;0.09 micrograms per gram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000652",
          "multivalued": true,
          "required": false,
          "owner": "soil"
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "title": "extreme_unusual_properties/heavy metals method",
          "aliases": [
            "extreme_unusual_properties/heavy metals method"
          ],
          "mappings": [
            "mixs:heavy_metals_meth"
          ],
          "description": "Reference or method used in determining heavy metals",
          "comments": [
            "Expected value: PMID,DOI or url"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000343",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "al_sat": {
          "name": "al_sat",
          "title": "extreme_unusual_properties/Al saturation",
          "aliases": [
            "extreme_unusual_properties/Al saturation"
          ],
          "mappings": [
            "mixs:al_sat"
          ],
          "description": "Aluminum saturation (esp. For tropical soils)",
          "comments": [
            "Expected value: measurement value",
            "Preferred unit: percentage"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000607",
          "multivalued": false,
          "required": false,
          "owner": "soil",
          "pattern": "\\d+[.\\d+] \\S+"
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "title": "extreme_unusual_properties/Al saturation method",
          "aliases": [
            "extreme_unusual_properties/Al saturation method"
          ],
          "mappings": [
            "mixs:al_sat_meth"
          ],
          "description": "Reference or method used in determining Al saturation",
          "comments": [
            "Expected value: PMID,DOI or URL"
          ],
          "examples": [
            {
              "value": ""
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{PMID}|{DOI}|{URL}",
          "range": "text value",
          "slot_uri": "MIXS:0000324",
          "multivalued": false,
          "required": false,
          "owner": "soil"
        },
        "misc_param": {
          "name": "misc_param",
          "title": "miscellaneous parameter",
          "aliases": [
            "miscellaneous parameter"
          ],
          "mappings": [
            "mixs:misc_param"
          ],
          "description": "Any other measurement performed or parameter collected, that is not listed here",
          "comments": [
            "Expected value: parameter name;measurement value"
          ],
          "examples": [
            {
              "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
            }
          ],
          "from_schema": "http://example.com/soil_biosample",
          "is_a": "core field",
          "string_serialization": "{text};{float} {unit}",
          "range": "quantity value",
          "slot_uri": "MIXS:0000752",
          "multivalued": true,
          "required": false,
          "owner": "soil"
        }
      },
      "slot_usage": {
        "samp_name": {
          "name": "samp_name",
          "required": true
        },
        "project_name": {
          "name": "project_name",
          "required": true
        },
        "depth": {
          "name": "depth",
          "required": true
        },
        "elev": {
          "name": "elev",
          "required": true
        },
        "cur_land_use": {
          "name": "cur_land_use",
          "required": false
        },
        "cur_vegetation": {
          "name": "cur_vegetation",
          "required": false
        },
        "cur_vegetation_meth": {
          "name": "cur_vegetation_meth",
          "required": false
        },
        "previous_land_use": {
          "name": "previous_land_use",
          "required": false
        },
        "prev_land_use_meth": {
          "name": "prev_land_use_meth",
          "required": false
        },
        "crop_rotation": {
          "name": "crop_rotation",
          "required": false
        },
        "agrochem_addition": {
          "name": "agrochem_addition",
          "required": false
        },
        "tillage": {
          "name": "tillage",
          "required": false
        },
        "fire": {
          "name": "fire",
          "required": false
        },
        "flooding": {
          "name": "flooding",
          "required": false
        },
        "extreme_event": {
          "name": "extreme_event",
          "required": false
        },
        "soil_horizon": {
          "name": "soil_horizon",
          "required": false
        },
        "horizon_meth": {
          "name": "horizon_meth",
          "required": false
        },
        "sieving": {
          "name": "sieving",
          "required": false
        },
        "water_content": {
          "name": "water_content",
          "required": false
        },
        "water_cont_soil_meth": {
          "name": "water_cont_soil_meth",
          "required": false
        },
        "samp_vol_we_dna_ext": {
          "name": "samp_vol_we_dna_ext",
          "required": false
        },
        "pool_dna_extracts": {
          "name": "pool_dna_extracts",
          "required": false
        },
        "store_cond": {
          "name": "store_cond",
          "required": false
        },
        "link_climate_info": {
          "name": "link_climate_info",
          "required": false
        },
        "annual_temp": {
          "name": "annual_temp",
          "required": false
        },
        "season_temp": {
          "name": "season_temp",
          "required": false
        },
        "annual_precpt": {
          "name": "annual_precpt",
          "required": false
        },
        "season_precpt": {
          "name": "season_precpt",
          "required": false
        },
        "link_class_info": {
          "name": "link_class_info",
          "required": false
        },
        "fao_class": {
          "name": "fao_class",
          "required": false
        },
        "local_class": {
          "name": "local_class",
          "required": false
        },
        "local_class_meth": {
          "name": "local_class_meth",
          "required": false
        },
        "soil_type": {
          "name": "soil_type",
          "required": false
        },
        "soil_type_meth": {
          "name": "soil_type_meth",
          "required": false
        },
        "slope_gradient": {
          "name": "slope_gradient",
          "required": false
        },
        "slope_aspect": {
          "name": "slope_aspect",
          "required": false
        },
        "profile_position": {
          "name": "profile_position",
          "required": false
        },
        "drainage_class": {
          "name": "drainage_class",
          "required": false
        },
        "soil_text_measure": {
          "name": "soil_text_measure",
          "required": false
        },
        "soil_texture_meth": {
          "name": "soil_texture_meth",
          "required": false
        },
        "ph": {
          "name": "ph",
          "required": false
        },
        "ph_meth": {
          "name": "ph_meth",
          "required": false
        },
        "tot_org_carb": {
          "name": "tot_org_carb",
          "required": false
        },
        "tot_org_c_meth": {
          "name": "tot_org_c_meth",
          "required": false
        },
        "tot_nitro_content": {
          "name": "tot_nitro_content",
          "required": false
        },
        "tot_nitro_cont_meth": {
          "name": "tot_nitro_cont_meth",
          "required": false
        },
        "microbial_biomass": {
          "name": "microbial_biomass",
          "required": false
        },
        "micro_biomass_meth": {
          "name": "micro_biomass_meth",
          "required": false
        },
        "link_addit_analys": {
          "name": "link_addit_analys",
          "required": false
        },
        "extreme_salinity": {
          "name": "extreme_salinity",
          "required": false
        },
        "salinity_meth": {
          "name": "salinity_meth",
          "required": false
        },
        "heavy_metals": {
          "name": "heavy_metals",
          "required": false
        },
        "heavy_metals_meth": {
          "name": "heavy_metals_meth",
          "required": false
        },
        "al_sat": {
          "name": "al_sat",
          "required": false
        },
        "al_sat_meth": {
          "name": "al_sat_meth",
          "required": false
        },
        "misc_param": {
          "name": "misc_param",
          "required": false
        }
      }
    },
    "text value": {
      "name": "text value",
      "description": "A basic string value",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute value",
      "slots": {
        "language": {
          "name": "language",
          "description": "Should use ISO 639-1 code e.g. \"en\", \"fr\"",
          "from_schema": "http://example.com/soil_biosample",
          "range": "language code",
          "owner": "text value"
        },
        "has raw value": {
          "name": "has raw value",
          "from_schema": "http://example.com/soil_biosample",
          "string_serialization": "{has numeric value} {has unit}",
          "owner": "text value"
        },
        "was generated by": {
          "name": "was generated by",
          "mappings": [
            "prov:wasGeneratedBy"
          ],
          "from_schema": "http://example.com/soil_biosample",
          "range": "activity",
          "owner": "text value"
        }
      }
    }
  },
  "enumerations": {
    "cur_land_use_enum": {
      "name": "cur_land_use_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "cities": {
          "text": "cities"
        },
        "farmstead": {
          "text": "farmstead"
        },
        "industrial areas": {
          "text": "industrial areas"
        },
        "roads/railroads": {
          "text": "roads/railroads"
        },
        "rock": {
          "text": "rock"
        },
        "sand": {
          "text": "sand"
        },
        "gravel": {
          "text": "gravel"
        },
        "mudflats": {
          "text": "mudflats"
        },
        "salt flats": {
          "text": "salt flats"
        },
        "badlands": {
          "text": "badlands"
        },
        "permanent snow or ice": {
          "text": "permanent snow or ice"
        },
        "saline seeps": {
          "text": "saline seeps"
        },
        "mines/quarries": {
          "text": "mines/quarries"
        },
        "oil waste areas": {
          "text": "oil waste areas"
        },
        "small grains": {
          "text": "small grains"
        },
        "row crops": {
          "text": "row crops"
        },
        "vegetable crops": {
          "text": "vegetable crops"
        },
        "horticultural plants (e.g. tulips)": {
          "text": "horticultural plants (e.g. tulips)"
        },
        "marshlands (grass,sedges,rushes)": {
          "text": "marshlands (grass,sedges,rushes)"
        },
        "tundra (mosses,lichens)": {
          "text": "tundra (mosses,lichens)"
        },
        "rangeland": {
          "text": "rangeland"
        },
        "pastureland (grasslands used for livestock grazing)": {
          "text": "pastureland (grasslands used for livestock grazing)"
        },
        "hayland": {
          "text": "hayland"
        },
        "meadows (grasses,alfalfa,fescue,bromegrass,timothy)": {
          "text": "meadows (grasses,alfalfa,fescue,bromegrass,timothy)"
        },
        "shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)": {
          "text": "shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)"
        },
        "successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)": {
          "text": "successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)"
        },
        "shrub crops (blueberries,nursery ornamentals,filberts)": {
          "text": "shrub crops (blueberries,nursery ornamentals,filberts)"
        },
        "vine crops (grapes)": {
          "text": "vine crops (grapes)"
        },
        "conifers (e.g. pine,spruce,fir,cypress)": {
          "text": "conifers (e.g. pine,spruce,fir,cypress)"
        },
        "hardwoods (e.g. oak,hickory,elm,aspen)": {
          "text": "hardwoods (e.g. oak,hickory,elm,aspen)"
        },
        "intermixed hardwood and conifers": {
          "text": "intermixed hardwood and conifers"
        },
        "tropical (e.g. mangrove,palms)": {
          "text": "tropical (e.g. mangrove,palms)"
        },
        "rainforest (evergreen forest receiving >406 cm annual rainfall)": {
          "text": "rainforest (evergreen forest receiving >406 cm annual rainfall)"
        },
        "swamp (permanent or semi-permanent water body dominated by woody plants)": {
          "text": "swamp (permanent or semi-permanent water body dominated by woody plants)"
        },
        "crop trees (nuts,fruit,christmas trees,nursery trees)": {
          "text": "crop trees (nuts,fruit,christmas trees,nursery trees)"
        }
      }
    },
    "drainage_class_enum": {
      "name": "drainage_class_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "very poorly": {
          "text": "very poorly"
        },
        "poorly": {
          "text": "poorly"
        },
        "somewhat poorly": {
          "text": "somewhat poorly"
        },
        "moderately well": {
          "text": "moderately well"
        },
        "well": {
          "text": "well"
        },
        "excessively drained": {
          "text": "excessively drained"
        }
      }
    },
    "fao_class_enum": {
      "name": "fao_class_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "Acrisols": {
          "text": "Acrisols"
        },
        "Andosols": {
          "text": "Andosols"
        },
        "Arenosols": {
          "text": "Arenosols"
        },
        "Cambisols": {
          "text": "Cambisols"
        },
        "Chernozems": {
          "text": "Chernozems"
        },
        "Ferralsols": {
          "text": "Ferralsols"
        },
        "Fluvisols": {
          "text": "Fluvisols"
        },
        "Gleysols": {
          "text": "Gleysols"
        },
        "Greyzems": {
          "text": "Greyzems"
        },
        "Gypsisols": {
          "text": "Gypsisols"
        },
        "Histosols": {
          "text": "Histosols"
        },
        "Kastanozems": {
          "text": "Kastanozems"
        },
        "Lithosols": {
          "text": "Lithosols"
        },
        "Luvisols": {
          "text": "Luvisols"
        },
        "Nitosols": {
          "text": "Nitosols"
        },
        "Phaeozems": {
          "text": "Phaeozems"
        },
        "Planosols": {
          "text": "Planosols"
        },
        "Podzols": {
          "text": "Podzols"
        },
        "Podzoluvisols": {
          "text": "Podzoluvisols"
        },
        "Rankers": {
          "text": "Rankers"
        },
        "Regosols": {
          "text": "Regosols"
        },
        "Rendzinas": {
          "text": "Rendzinas"
        },
        "Solonchaks": {
          "text": "Solonchaks"
        },
        "Solonetz": {
          "text": "Solonetz"
        },
        "Vertisols": {
          "text": "Vertisols"
        },
        "Yermosols": {
          "text": "Yermosols"
        }
      }
    },
    "profile_position_enum": {
      "name": "profile_position_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "summit": {
          "text": "summit"
        },
        "shoulder": {
          "text": "shoulder"
        },
        "backslope": {
          "text": "backslope"
        },
        "footslope": {
          "text": "footslope"
        },
        "toeslope": {
          "text": "toeslope"
        }
      }
    },
    "soil_horizon_enum": {
      "name": "soil_horizon_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "O horizon": {
          "text": "O horizon"
        },
        "A horizon": {
          "text": "A horizon"
        },
        "E horizon": {
          "text": "E horizon"
        },
        "B horizon": {
          "text": "B horizon"
        },
        "C horizon": {
          "text": "C horizon"
        },
        "R layer": {
          "text": "R layer"
        },
        "Permafrost": {
          "text": "Permafrost"
        }
      }
    },
    "tillage_enum": {
      "name": "tillage_enum",
      "from_schema": "http://example.com/soil_biosample",
      "permissible_values": {
        "drill": {
          "text": "drill"
        },
        "cutting disc": {
          "text": "cutting disc"
        },
        "ridge till": {
          "text": "ridge till"
        },
        "strip tillage": {
          "text": "strip tillage"
        },
        "zonal tillage": {
          "text": "zonal tillage"
        },
        "chisel": {
          "text": "chisel"
        },
        "tined": {
          "text": "tined"
        },
        "mouldboard": {
          "text": "mouldboard"
        },
        "disc plough": {
          "text": "disc plough"
        }
      }
    }
  },
  "slots": {
    "GOLD sample identifiers": {
      "name": "GOLD sample identifiers",
      "description": "['identifiers for corresponding sample in GOLD']",
      "examples": [
        {
          "value": "https://identifiers.org/gold:GbTODO"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "sample identifiers",
      "mixins": [
        "GOLD identifiers"
      ],
      "multivalued": true,
      "owner": "biosample",
      "pattern": "^GOLD:Gb[0-9]+$"
    },
    "INSDC biosample identifiers": {
      "name": "INSDC biosample identifiers",
      "aliases": [
        "EBI biosample identifiers",
        "NCBI biosample identifiers",
        "DDBJ biosample identifiers"
      ],
      "description": "['identifiers for corresponding sample in INSDC']",
      "examples": [
        {
          "value": "https://identifiers.org/biosample:SAMEA5989477"
        },
        {
          "value": "https://identifiers.org/biosample:SAMD00212331",
          "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "see_also": [
        "https://github.com/bioregistry/bioregistry/issues/108",
        "https://www.ebi.ac.uk/biosamples/",
        "https://www.ncbi.nlm.nih.gov/biosample",
        "https://www.ddbj.nig.ac.jp/biosample/index-e.html"
      ],
      "is_a": "sample identifiers",
      "mixins": [
        "INSDC identifiers"
      ],
      "multivalued": true,
      "owner": "biosample",
      "pattern": "^biosample:SAM[NED]([A-Z])?[0-9]+$"
    },
    "INSDC secondary sample identifiers": {
      "name": "INSDC secondary sample identifiers",
      "description": "['secondary identifiers for corresponding sample in INSDC']",
      "comments": [
        "ENA redirects these to primary IDs, e.g. https://www.ebi.ac.uk/ena/browser/view/DRS166340 -> SAMD00212331",
        "MGnify uses these as their primary sample IDs"
      ],
      "examples": [
        {
          "value": "https://identifiers.org/insdc.sra:DRS166340",
          "description": "I13_N_5-10 sample from Soil fungal diversity along elevational gradients"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "sample identifiers",
      "mixins": [
        "INSDC identifiers"
      ],
      "owner": "biosample",
      "pattern": "^biosample:(E|D|S)RS[0-9]{6,}$"
    },
    "add_date": {
      "name": "add_date",
      "description": "The date on which the information was added to the database.",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "agrochem_addition": {
      "name": "agrochem_addition",
      "title": "history/agrochemical additions",
      "aliases": [
        "history/agrochemical additions"
      ],
      "mappings": [
        "mixs:agrochem_addition"
      ],
      "description": "Addition of fertilizers, pesticides, etc. - amount and time of applications",
      "comments": [
        "Expected value: agrochemical name;agrochemical amount;timestamp",
        "Preferred unit: gram, mole per liter, milligram per liter"
      ],
      "examples": [
        {
          "value": "roundup;5 milligram per liter;2018-06-21"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit};{timestamp}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000639",
      "multivalued": true,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "al_sat": {
      "name": "al_sat",
      "title": "extreme_unusual_properties/Al saturation",
      "aliases": [
        "extreme_unusual_properties/Al saturation"
      ],
      "mappings": [
        "mixs:al_sat"
      ],
      "description": "Aluminum saturation (esp. For tropical soils)",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: percentage"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000607",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "al_sat_meth": {
      "name": "al_sat_meth",
      "title": "extreme_unusual_properties/Al saturation method",
      "aliases": [
        "extreme_unusual_properties/Al saturation method"
      ],
      "mappings": [
        "mixs:al_sat_meth"
      ],
      "description": "Reference or method used in determining Al saturation",
      "comments": [
        "Expected value: PMID,DOI or URL"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000324",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "alkalinity": {
      "name": "alkalinity",
      "aliases": [
        "alkalinity"
      ],
      "mappings": [
        "mixs:alkalinity"
      ],
      "description": "\"Alkalinity, the ability of a solution to neutralize acids to the equivalence point of carbonate or bicarbonate\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "alkalinity_method": {
      "name": "alkalinity_method",
      "aliases": [
        "alkalinity method"
      ],
      "mappings": [
        "mixs:alkalinity_method"
      ],
      "description": "Method used for alkalinity measurement",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "alkyl_diethers": {
      "name": "alkyl_diethers",
      "aliases": [
        "alkyl diethers"
      ],
      "mappings": [
        "mixs:alkyl_diethers"
      ],
      "description": "Concentration of alkyl diethers ",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "alt": {
      "name": "alt",
      "title": "altitude",
      "aliases": [
        "altitude"
      ],
      "mappings": [
        "mixs:alt"
      ],
      "description": "Altitude is a term used to identify heights of objects such as airplanes, space shuttles, rockets, atmospheric balloons and heights of places such as atmospheric layers and clouds. It is used to measure the height of an object which is above the earth's surface. In this context, the altitude measurement is the vertical distance between the earth's surface above sea level and the sampled position in the air",
      "comments": [
        "Expected value: measurement value"
      ],
      "examples": [
        {
          "value": "100 meter"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000094",
      "multivalued": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "alternative identifiers": {
      "name": "alternative identifiers",
      "description": "A list of alternative identifiers for the entity.",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "multivalued": true,
      "owner": "biosample"
    },
    "aminopept_act": {
      "name": "aminopept_act",
      "aliases": [
        "aminopeptidase activity"
      ],
      "mappings": [
        "mixs:aminopept_act"
      ],
      "description": "Measurement of aminopeptidase activity",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "ammonium": {
      "name": "ammonium",
      "aliases": [
        "ammonium"
      ],
      "mappings": [
        "mixs:ammonium"
      ],
      "description": "Concentration of ammonium in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "annual_precpt": {
      "name": "annual_precpt",
      "title": "mean annual precipitation",
      "aliases": [
        "mean annual precipitation"
      ],
      "mappings": [
        "mixs:annual_precpt"
      ],
      "description": "The average of all annual precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: millimeter"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000644",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "annual_temp": {
      "name": "annual_temp",
      "title": "mean annual temperature",
      "aliases": [
        "mean annual temperature"
      ],
      "mappings": [
        "mixs:annual_temp"
      ],
      "description": "Mean annual temperature",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: degree Celsius"
      ],
      "examples": [
        {
          "value": "12.5 degree Celsius"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000642",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "bacteria_carb_prod": {
      "name": "bacteria_carb_prod",
      "aliases": [
        "bacterial carbon production"
      ],
      "mappings": [
        "mixs:bacteria_carb_prod"
      ],
      "description": "Measurement of bacterial carbon production",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "bishomohopanol": {
      "name": "bishomohopanol",
      "aliases": [
        "bishomohopanol"
      ],
      "mappings": [
        "mixs:bishomohopanol"
      ],
      "description": "Concentration of bishomohopanol ",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "bromide": {
      "name": "bromide",
      "aliases": [
        "bromide"
      ],
      "mappings": [
        "mixs:bromide"
      ],
      "description": "Concentration of bromide ",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "calcium": {
      "name": "calcium",
      "aliases": [
        "calcium"
      ],
      "mappings": [
        "mixs:calcium"
      ],
      "description": "Concentration of calcium in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "carb_nitro_ratio": {
      "name": "carb_nitro_ratio",
      "aliases": [
        "carbon/nitrogen ratio"
      ],
      "mappings": [
        "mixs:carb_nitro_ratio"
      ],
      "description": "Ratio of amount or concentrations of carbon to nitrogen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "chem_administration": {
      "name": "chem_administration",
      "aliases": [
        "chemical administration"
      ],
      "mappings": [
        "mixs:chem_administration"
      ],
      "description": "\"List of chemical compounds administered to the host or site where sampling occurred, and when (e.g. Antibiotics, n fertilizer, air filter); can include multiple compounds. For chemical entities of biological interest ontology (chebi) (v 163), http://purl.bioontology.org/ontology/chebi\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "controlled term value",
      "multivalued": false,
      "owner": "biosample"
    },
    "chloride": {
      "name": "chloride",
      "aliases": [
        "chloride"
      ],
      "mappings": [
        "mixs:chloride"
      ],
      "description": "Concentration of chloride in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "chlorophyll": {
      "name": "chlorophyll",
      "aliases": [
        "chlorophyll"
      ],
      "mappings": [
        "mixs:chlorophyll"
      ],
      "description": "Concentration of chlorophyll",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "collection_date": {
      "name": "collection_date",
      "title": "collection date",
      "aliases": [
        "collection date"
      ],
      "mappings": [
        "mixs:collection_date"
      ],
      "description": "The time of sampling, either as an instance (single point in time) or interval. In case no exact time is available, the date/time can be right truncated i.e. all of these are valid times: 2008-01-23T19:23:10+00:00; 2008-01-23T19:23:10; 2008-01-23; 2008-01; 2008; Except: 2008-01; 2008 all are ISO8601 compliant",
      "comments": [
        "Expected value: date and time"
      ],
      "examples": [
        {
          "value": "2018-05-11T10:00:00+01:00; 2018-05-11"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "range": "timestamp value",
      "slot_uri": "MIXS:0000011",
      "multivalued": false,
      "owner": "http://example.com/soil_biosample"
    },
    "community": {
      "name": "community",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "crop_rotation": {
      "name": "crop_rotation",
      "title": "history/crop rotation",
      "aliases": [
        "history/crop rotation"
      ],
      "mappings": [
        "mixs:crop_rotation"
      ],
      "description": "Whether or not crop is rotated, and if yes, rotation schedule",
      "comments": [
        "Expected value: crop rotation status;schedule"
      ],
      "examples": [
        {
          "value": "yes;R2/2017-01-01/2018-12-31/P6M"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{boolean};{Rn/start_time/end_time/duration}",
      "range": "text value",
      "slot_uri": "MIXS:0000318",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "cur_land_use": {
      "name": "cur_land_use",
      "title": "current land use",
      "aliases": [
        "current land use"
      ],
      "mappings": [
        "mixs:cur_land_use"
      ],
      "description": "Present state of sample site",
      "comments": [
        "Expected value: enumeration"
      ],
      "examples": [
        {
          "value": "conifers"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[cities|farmstead|industrial areas|roads/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]",
      "range": "cur_land_use_enum",
      "slot_uri": "MIXS:0001080",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "[cities|farmstead|industrial areas|roads\\/railroads|rock|sand|gravel|mudflats|salt flats|badlands|permanent snow or ice|saline seeps|mines\\/quarries|oil waste areas|small grains|row crops|vegetable crops|horticultural plants (e.g. tulips)|marshlands (grass,sedges,rushes)|tundra (mosses,lichens)|rangeland|pastureland (grasslands used for livestock grazing)|hayland|meadows (grasses,alfalfa,fescue,bromegrass,timothy)|shrub land (e.g. mesquite,sage\\-brush,creosote bush,shrub oak,eucalyptus)|successional shrub land (tree saplings,hazels,sumacs,chokecherry,shrub dogwoods,blackberries)|shrub crops (blueberries,nursery ornamentals,filberts)|vine crops (grapes)|conifers (e.g. pine,spruce,fir,cypress)|hardwoods (e.g. oak,hickory,elm,aspen)|intermixed hardwood and conifers|tropical (e.g. mangrove,palms)|rainforest (evergreen forest receiving >406 cm annual rainfall)|swamp (permanent or semi\\-permanent water body dominated by woody plants)|crop trees (nuts,fruit,christmas trees,nursery trees)]"
    },
    "cur_vegetation": {
      "name": "cur_vegetation",
      "title": "current vegetation",
      "aliases": [
        "current vegetation"
      ],
      "mappings": [
        "mixs:cur_vegetation"
      ],
      "description": "Vegetation classification from one or more standard classification systems, or agricultural crop",
      "comments": [
        "Expected value: current vegetation type"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}",
      "range": "text value",
      "slot_uri": "MIXS:0000312",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "cur_vegetation_meth": {
      "name": "cur_vegetation_meth",
      "title": "current vegetation method",
      "aliases": [
        "current vegetation method"
      ],
      "mappings": [
        "mixs:cur_vegetation_meth"
      ],
      "description": "Reference or method used in vegetation classification",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000314",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "density": {
      "name": "density",
      "aliases": [
        "density"
      ],
      "mappings": [
        "mixs:density"
      ],
      "description": "\"Density of the sample, which is its mass per unit volume (aka volumetric mass density)\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "depth": {
      "name": "depth",
      "title": "depth",
      "aliases": [
        "depth",
        "geographic location (depth)"
      ],
      "mappings": [
        "mixs:depth"
      ],
      "description": "MIxS:The vertical distance below local surface, e.g. for sediment or soil samples depth is measured from sediment or soil surface, respectively. Depth can be reported as an interval for subsurface samples.|NMDC:Please refer to the definitions of depth in the environmental packages",
      "comments": [
        "Expected value: measurement value"
      ],
      "examples": [
        {
          "value": "10 meter"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "range": "quantity value",
      "slot_uri": "MIXS:0000018",
      "multivalued": false,
      "required": true,
      "owner": "http://example.com/soil_biosample"
    },
    "depth2": {
      "name": "depth2",
      "from_schema": "http://example.com/soil_biosample",
      "range": "quantity value",
      "owner": "biosample"
    },
    "description": {
      "name": "description",
      "description": "a human-readable description of a thing",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "slot_uri": "dcterms:description",
      "multivalued": false,
      "owner": "biosample"
    },
    "diss_carb_dioxide": {
      "name": "diss_carb_dioxide",
      "aliases": [
        "dissolved carbon dioxide"
      ],
      "mappings": [
        "mixs:diss_carb_dioxide"
      ],
      "description": "Concentration of dissolved carbon dioxide in the sample or liquid portion of the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_hydrogen": {
      "name": "diss_hydrogen",
      "aliases": [
        "dissolved hydrogen"
      ],
      "mappings": [
        "mixs:diss_hydrogen"
      ],
      "description": "Concentration of dissolved hydrogen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_inorg_carb": {
      "name": "diss_inorg_carb",
      "aliases": [
        "dissolved inorganic carbon"
      ],
      "mappings": [
        "mixs:diss_inorg_carb"
      ],
      "description": "\"Dissolved inorganic carbon concentration in the sample, typically measured after filtering the sample using a 0.45 micrometer filter\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_inorg_phosp": {
      "name": "diss_inorg_phosp",
      "aliases": [
        "dissolved inorganic phosphorus"
      ],
      "mappings": [
        "mixs:diss_inorg_phosp"
      ],
      "description": "Concentration of dissolved inorganic phosphorus in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_org_carb": {
      "name": "diss_org_carb",
      "aliases": [
        "dissolved organic carbon"
      ],
      "mappings": [
        "mixs:diss_org_carb"
      ],
      "description": "\"Concentration of dissolved organic carbon in the sample, liquid portion of the sample, or aqueous phase of the fluid\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_org_nitro": {
      "name": "diss_org_nitro",
      "aliases": [
        "dissolved organic nitrogen"
      ],
      "mappings": [
        "mixs:diss_org_nitro"
      ],
      "description": "Dissolved organic nitrogen concentration measured as; total dissolved nitrogen - NH4 - NO3 - NO2",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "diss_oxygen": {
      "name": "diss_oxygen",
      "aliases": [
        "dissolved oxygen"
      ],
      "mappings": [
        "mixs:diss_oxygen"
      ],
      "description": "Concentration of dissolved oxygen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "drainage_class": {
      "name": "drainage_class",
      "title": "drainage classification",
      "aliases": [
        "drainage classification"
      ],
      "mappings": [
        "mixs:drainage_class"
      ],
      "description": "Drainage classification from a standard system such as the USDA system",
      "comments": [
        "Expected value: enumeration"
      ],
      "examples": [
        {
          "value": "well"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]",
      "range": "drainage_class_enum",
      "slot_uri": "MIXS:0001085",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "[very poorly|poorly|somewhat poorly|moderately well|well|excessively drained]"
    },
    "ecosystem": {
      "name": "ecosystem",
      "description": "TODO",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "gold_path_field",
      "owner": "biosample"
    },
    "ecosystem_category": {
      "name": "ecosystem_category",
      "description": "TODO",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "gold_path_field",
      "owner": "biosample"
    },
    "ecosystem_subtype": {
      "name": "ecosystem_subtype",
      "description": "TODO",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "gold_path_field",
      "owner": "biosample"
    },
    "ecosystem_type": {
      "name": "ecosystem_type",
      "description": "TODO",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "gold_path_field",
      "owner": "biosample"
    },
    "elev": {
      "name": "elev",
      "title": "elevation",
      "aliases": [
        "elevation"
      ],
      "mappings": [
        "mixs:elev"
      ],
      "description": "Elevation of the sampling site is its height above a fixed reference point, most commonly the mean sea level. Elevation is mainly used when referring to points on the earth's surface, while altitude is used for points above the surface, such as an aircraft in flight or a spacecraft in orbit.",
      "comments": [
        "Expected value: measurement value"
      ],
      "examples": [
        {
          "value": "100 meter"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000093",
      "multivalued": false,
      "required": true,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "env_broad_scale": {
      "name": "env_broad_scale",
      "title": "broad-scale environmental context",
      "aliases": [
        "broad-scale environmental context"
      ],
      "mappings": [
        "mixs:env_broad_scale"
      ],
      "description": "Report the major environmental system the sample or specimen came from. The system(s) identified should have a coarse spatial grain, to provide the general environmental context of where the sampling was done (e.g. in the desert or a rainforest). We recommend using subclasses of EnvO\u2019s biome class:  http://purl.obolibrary.org/obo/ENVO_00000428. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS",
      "comments": [
        "Expected value: The major environment type(s) where the sample was collected. Recommend subclasses of biome [ENVO:00000428]. Multiple terms can be separated by one or more pipes."
      ],
      "examples": [
        {
          "value": "oceanic epipelagic zone biome [ENVO:01000033] for annotating a water sample from the photic zone in middle of the Atlantic Ocean"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "range": "controlled term value",
      "slot_uri": "MIXS:0000012",
      "multivalued": false,
      "required": true,
      "owner": "http://example.com/soil_biosample",
      "pattern": ".* \\S+:\\S+"
    },
    "env_local_scale": {
      "name": "env_local_scale",
      "title": "local environmental context",
      "aliases": [
        "local environmental context"
      ],
      "mappings": [
        "mixs:env_local_scale"
      ],
      "description": "Report the entity or entities which are in the sample or specimen\u2019s local vicinity and which you believe have significant causal influences on your sample or specimen. We recommend using EnvO terms which are of smaller spatial grain than your entry for env_broad_scale. Terms, such as anatomical sites, from other OBO Library ontologies which interoperate with EnvO (e.g. UBERON) are accepted in this field. EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS.",
      "comments": [
        "Expected value: Environmental entities having causal influences upon the entity at time of sampling."
      ],
      "examples": [
        {
          "value": "litter layer [ENVO:01000338]; Annotating a pooled sample taken from various vegetation layers in a forest consider: canopy [ENVO:00000047]|herb and fern layer [ENVO:01000337]|litter layer [ENVO:01000338]|understory [01000335]|shrub layer [ENVO:01000336]."
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "range": "controlled term value",
      "slot_uri": "MIXS:0000013",
      "multivalued": false,
      "required": true,
      "owner": "http://example.com/soil_biosample",
      "pattern": ".* \\S+:\\S+"
    },
    "env_medium": {
      "name": "env_medium",
      "title": "environmental medium",
      "aliases": [
        "environmental medium"
      ],
      "mappings": [
        "mixs:env_medium"
      ],
      "description": "Report the environmental material(s) immediately surrounding the sample or specimen at the time of sampling. We recommend using subclasses of 'environmental material' (http://purl.obolibrary.org/obo/ENVO_00010483). EnvO documentation about how to use the field: https://github.com/EnvironmentOntology/envo/wiki/Using-ENVO-with-MIxS . Terms from other OBO ontologies are permissible as long as they reference mass/volume nouns (e.g. air, water, blood) and not discrete, countable entities (e.g. a tree, a leaf, a table top).",
      "comments": [
        "Expected value: The material displaced by the entity at time of sampling. Recommend subclasses of environmental material [ENVO:00010483]."
      ],
      "examples": [
        {
          "value": "soil [ENVO:00001998]; Annotating a fish swimming in the upper 100 m of the Atlantic Ocean, consider: ocean water [ENVO:00002151]. Example: Annotating a duck on a pond consider: pond water [ENVO:00002228]|air [ENVO_00002005]"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{termLabel} {[termID]}",
      "range": "controlled term value",
      "slot_uri": "MIXS:0000014",
      "multivalued": false,
      "required": true,
      "owner": "http://example.com/soil_biosample",
      "pattern": ".* \\S+:\\S+"
    },
    "env_package": {
      "name": "env_package",
      "aliases": [
        "environmental package"
      ],
      "mappings": [
        "mixs:env_package"
      ],
      "description": "\"MIxS extension for reporting of measurements and observations obtained from one or more of the environments where the sample was obtained. All environmental packages listed here are further defined in separate subtables. By giving the name of the environmental package, a selection of fields can be made from the subtables and can be reported\"",
      "in_subset": [
        "mixs extension"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "[air|built environment|host\\-associated|human\\-associated|human\\-skin|human\\-oral|human\\-gut|human\\-vaginal|hydrocarbon resources\\-cores|hydrocarbon resources\\-fluids\\/swabs|microbial mat\\/biofilm|misc environment|plant\\-associated|sediment|soil|wastewater\\/sludge|water]"
    },
    "extreme_event": {
      "name": "extreme_event",
      "title": "history/extreme events",
      "aliases": [
        "history/extreme events"
      ],
      "mappings": [
        "mixs:extreme_event"
      ],
      "description": "Unusual physical events that may have affected microbial populations",
      "comments": [
        "Expected value: date"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "timestamp value",
      "slot_uri": "MIXS:0000320",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "extreme_salinity": {
      "name": "extreme_salinity",
      "title": "extreme_unusual_properties/salinity",
      "description": "Measured salinity",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "quantity value",
      "slot_uri": "MIXS:0000651",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "fao_class": {
      "name": "fao_class",
      "title": "soil_taxonomic/FAO classification",
      "aliases": [
        "soil_taxonomic/FAO classification"
      ],
      "mappings": [
        "mixs:fao_class"
      ],
      "description": "Soil classification from the FAO World Reference Database for Soil Resources. The list can be found at http://www.fao.org/nr/land/sols/soil/wrb-soil-maps/reference-groups",
      "comments": [
        "Expected value: enumeration"
      ],
      "examples": [
        {
          "value": "Luvisols"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]",
      "range": "fao_class_enum",
      "slot_uri": "MIXS:0001083",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "[Acrisols|Andosols|Arenosols|Cambisols|Chernozems|Ferralsols|Fluvisols|Gleysols|Greyzems|Gypsisols|Histosols|Kastanozems|Lithosols|Luvisols|Nitosols|Phaeozems|Planosols|Podzols|Podzoluvisols|Rankers|Regosols|Rendzinas|Solonchaks|Solonetz|Vertisols|Yermosols]"
    },
    "fire": {
      "name": "fire",
      "title": "history/fire",
      "aliases": [
        "history/fire"
      ],
      "mappings": [
        "mixs:fire"
      ],
      "description": "Historical and/or physical evidence of fire",
      "comments": [
        "Expected value: date"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "timestamp value",
      "slot_uri": "MIXS:0001086",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "flooding": {
      "name": "flooding",
      "title": "history/flooding",
      "aliases": [
        "history/flooding"
      ],
      "mappings": [
        "mixs:flooding"
      ],
      "description": "Historical and/or physical evidence of flooding",
      "comments": [
        "Expected value: date"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "timestamp value",
      "slot_uri": "MIXS:0000319",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "geo_loc_name": {
      "name": "geo_loc_name",
      "title": "geographic location (country and/or sea,region)",
      "aliases": [
        "geographic location (country and/or sea,region)"
      ],
      "mappings": [
        "mixs:geo_loc_name"
      ],
      "description": "The geographical origin of the sample as defined by the country or sea name followed by specific region name. Country or sea names should be chosen from the INSDC country list (http://insdc.org/country.html), or the GAZ ontology (http://purl.bioontology.org/ontology/GAZ)",
      "comments": [
        "Expected value: country or sea name (INSDC or GAZ): region(GAZ), specific location name"
      ],
      "examples": [
        {
          "value": "USA: Maryland, Bethesda"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{term}: {term}, {text}",
      "range": "text value",
      "slot_uri": "MIXS:0000010",
      "multivalued": false,
      "owner": "http://example.com/soil_biosample"
    },
    "glucosidase_act": {
      "name": "glucosidase_act",
      "aliases": [
        "glucosidase activity"
      ],
      "mappings": [
        "mixs:glucosidase_act"
      ],
      "description": "Measurement of glucosidase activity",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "habitat": {
      "name": "habitat",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "heavy_metals": {
      "name": "heavy_metals",
      "title": "extreme_unusual_properties/heavy metals",
      "aliases": [
        "extreme_unusual_properties/heavy metals"
      ],
      "mappings": [
        "mixs:heavy_metals"
      ],
      "description": "MIxS:Heavy metals present in the sequenced sample and their concentrations. For multiple heavy metals and concentrations, add multiple copies of this field.|NMDC:Heavy metals present and concentrationsany drug used by subject and the frequency of usage; can include multiple heavy metals and concentrations",
      "comments": [
        "Expected value: heavy metal name;measurement value unit",
        "Preferred unit: microgram per gram"
      ],
      "examples": [
        {
          "value": "mercury;0.09 micrograms per gram"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000652",
      "multivalued": true,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "heavy_metals_meth": {
      "name": "heavy_metals_meth",
      "title": "extreme_unusual_properties/heavy metals method",
      "aliases": [
        "extreme_unusual_properties/heavy metals method"
      ],
      "mappings": [
        "mixs:heavy_metals_meth"
      ],
      "description": "Reference or method used in determining heavy metals",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000343",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "horizon": {
      "name": "horizon",
      "aliases": [
        "horizon"
      ],
      "mappings": [
        "mixs:horizon"
      ],
      "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]"
    },
    "horizon_meth": {
      "name": "horizon_meth",
      "title": "horizon method",
      "aliases": [
        "horizon method"
      ],
      "mappings": [
        "mixs:horizon_meth"
      ],
      "description": "Reference or method used in determining the horizon",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000321",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "host_name": {
      "name": "host_name",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "id": {
      "name": "id",
      "description": "A unique identifier for a thing. Must be either a CURIE shorthand for a URI or a complete URI",
      "from_schema": "http://example.com/soil_biosample",
      "multivalued": false,
      "identifier": true,
      "owner": "biosample"
    },
    "identifier": {
      "name": "identifier",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "lat_lon": {
      "name": "lat_lon",
      "title": "geographic location (latitude and longitude)",
      "aliases": [
        "geographic location (latitude and longitude)"
      ],
      "mappings": [
        "mixs:lat_lon"
      ],
      "description": "MIxS:The geographical origin of the sample as defined by latitude and longitude. The values should be reported in decimal degrees and in WGS84 system|NMDC: This is currently a required field but it's not clear if this should be required for human hosts",
      "comments": [
        "Expected value: decimal degrees,  limit to 8 decimal points"
      ],
      "examples": [
        {
          "value": "50.586825 6.408977"
        }
      ],
      "in_subset": [
        "environment"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{float} {float}",
      "range": "geolocation value",
      "slot_uri": "MIXS:0000009",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\d+[.\\d+]"
    },
    "link_addit_analys": {
      "name": "link_addit_analys",
      "title": "links to additional analysis",
      "aliases": [
        "links to additional analysis"
      ],
      "mappings": [
        "mixs:link_addit_analys"
      ],
      "description": "Link to additional analysis results performed on the sample",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000340",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "link_class_info": {
      "name": "link_class_info",
      "title": "link to classification information",
      "aliases": [
        "link to classification information"
      ],
      "mappings": [
        "mixs:link_class_info"
      ],
      "description": "Link to digitized soil maps or other soil classification information",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000329",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "link_climate_info": {
      "name": "link_climate_info",
      "title": "link to climate information",
      "aliases": [
        "link to climate information"
      ],
      "mappings": [
        "mixs:link_climate_info"
      ],
      "description": "Link to climate resource",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000328",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "local_class": {
      "name": "local_class",
      "title": "soil_taxonomic/local classification",
      "aliases": [
        "soil_taxonomic/local classification"
      ],
      "mappings": [
        "mixs:local_class"
      ],
      "description": "Soil classification based on local soil classification system",
      "comments": [
        "Expected value: local classification name"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text}",
      "range": "text value",
      "slot_uri": "MIXS:0000330",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "local_class_meth": {
      "name": "local_class_meth",
      "title": "soil_taxonomic/local classification method",
      "aliases": [
        "soil_taxonomic/local classification method"
      ],
      "mappings": [
        "mixs:local_class_meth"
      ],
      "description": "Reference or method used in determining the local soil classification",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000331",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "location": {
      "name": "location",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "magnesium": {
      "name": "magnesium",
      "aliases": [
        "magnesium"
      ],
      "mappings": [
        "mixs:magnesium"
      ],
      "description": "Concentration of magnesium in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "mean_frict_vel": {
      "name": "mean_frict_vel",
      "aliases": [
        "mean friction velocity"
      ],
      "mappings": [
        "mixs:mean_frict_vel"
      ],
      "description": "Measurement of mean friction velocity",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "mean_peak_frict_vel": {
      "name": "mean_peak_frict_vel",
      "aliases": [
        "mean peak friction velocity"
      ],
      "mappings": [
        "mixs:mean_peak_frict_vel"
      ],
      "description": "Measurement of mean peak friction velocity",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "micro_biomass_meth": {
      "name": "micro_biomass_meth",
      "title": "microbial biomass method",
      "description": "Reference or method used in determining microbial biomass",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "string",
      "slot_uri": "MIXS:0000339",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "microbial_biomass": {
      "name": "microbial_biomass",
      "title": "microbial biomass",
      "aliases": [
        "microbial biomass"
      ],
      "mappings": [
        "mixs:microbial_biomass"
      ],
      "description": "The part of the organic matter in the soil that constitutes living microorganisms smaller than 5-10 micrometer. If you keep this, you would need to have correction factors used for conversion to the final units",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: ton, kilogram, gram per kilogram soil"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000650",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "microbial_biomass_meth": {
      "name": "microbial_biomass_meth",
      "aliases": [
        "microbial biomass method"
      ],
      "mappings": [
        "mixs:microbial_biomass_meth"
      ],
      "description": "Reference or method used in determining microbial biomass",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "misc_param": {
      "name": "misc_param",
      "title": "miscellaneous parameter",
      "aliases": [
        "miscellaneous parameter"
      ],
      "mappings": [
        "mixs:misc_param"
      ],
      "description": "Any other measurement performed or parameter collected, that is not listed here",
      "comments": [
        "Expected value: parameter name;measurement value"
      ],
      "examples": [
        {
          "value": "Bicarbonate ion concentration;2075 micromole per kilogram"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000752",
      "multivalued": true,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "mod_date": {
      "name": "mod_date",
      "description": "The last date on which the database information was modified.",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "n_alkanes": {
      "name": "n_alkanes",
      "aliases": [
        "n-alkanes"
      ],
      "mappings": [
        "mixs:n_alkanes"
      ],
      "description": "Concentration of n-alkanes; can include multiple n-alkanes",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{text};{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample"
    },
    "name": {
      "name": "name",
      "description": "A human readable label for an entity",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "multivalued": false,
      "owner": "biosample"
    },
    "ncbi_taxonomy_name": {
      "name": "ncbi_taxonomy_name",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "nitrate": {
      "name": "nitrate",
      "aliases": [
        "nitrate"
      ],
      "mappings": [
        "mixs:nitrate"
      ],
      "description": "Concentration of nitrate in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "nitrite": {
      "name": "nitrite",
      "aliases": [
        "nitrite"
      ],
      "mappings": [
        "mixs:nitrite"
      ],
      "description": "Concentration of nitrite in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "org_matter": {
      "name": "org_matter",
      "aliases": [
        "organic matter"
      ],
      "mappings": [
        "mixs:org_matter"
      ],
      "description": "Concentration of organic matter ",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "org_nitro": {
      "name": "org_nitro",
      "aliases": [
        "organic nitrogen"
      ],
      "mappings": [
        "mixs:org_nitro"
      ],
      "description": "Concentration of organic nitrogen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "organism_count": {
      "name": "organism_count",
      "aliases": [
        "organism count"
      ],
      "mappings": [
        "mixs:organism_count"
      ],
      "description": "\"Total cell count of any organism (or group of organisms) per gram, volume or area of sample, should include name of organism followed by count. The method that was used for the enumeration (e.g. qPCR, atp, mpn, etc.) Should also be provided. (example: total prokaryotes; 3.5e7 cells per ml; qpcr)\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{text};{float} {unit};[qPCR|ATP|MPN|other]",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample"
    },
    "oxy_stat_samp": {
      "name": "oxy_stat_samp",
      "aliases": [
        "oxygenation status of sample"
      ],
      "mappings": [
        "mixs:oxy_stat_samp"
      ],
      "description": "Oxygenation status of sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "[aerobic|anaerobic|other]"
    },
    "part of": {
      "name": "part of",
      "aliases": [
        "is part of"
      ],
      "description": "Links a resource to another resource that either logically or physically includes it.",
      "from_schema": "http://example.com/soil_biosample",
      "domain": "named thing",
      "range": "named thing",
      "slot_uri": "dcterms:isPartOf",
      "multivalued": true,
      "owner": "biosample"
    },
    "part_org_carb": {
      "name": "part_org_carb",
      "aliases": [
        "particulate organic carbon"
      ],
      "mappings": [
        "mixs:part_org_carb"
      ],
      "description": "Concentration of particulate organic carbon",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "perturbation": {
      "name": "perturbation",
      "aliases": [
        "perturbation"
      ],
      "mappings": [
        "mixs:perturbation"
      ],
      "description": "\"Type of perturbation, e.g. chemical administration, physical disturbance, etc., coupled with perturbation regimen including how many times the perturbation was repeated, how long each perturbation lasted, and the start and end time of the entire perturbation period; can include multiple perturbation types\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "petroleum_hydrocarb": {
      "name": "petroleum_hydrocarb",
      "aliases": [
        "petroleum hydrocarbon"
      ],
      "mappings": [
        "mixs:petroleum_hydrocarb"
      ],
      "description": "Concentration of petroleum hydrocarbon",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "ph": {
      "name": "ph",
      "title": "pH",
      "aliases": [
        "pH"
      ],
      "mappings": [
        "mixs:ph"
      ],
      "description": "Ph measurement of the sample, or liquid portion of sample, or aqueous phase of the fluid",
      "comments": [
        "Expected value: measurement value"
      ],
      "examples": [
        {
          "value": "7.2"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "quantity value",
      "slot_uri": "MIXS:0001001",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+]"
    },
    "ph_meth": {
      "name": "ph_meth",
      "title": "pH method",
      "aliases": [
        "pH method"
      ],
      "mappings": [
        "mixs:ph_meth"
      ],
      "description": "Reference or method used in determining ph",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0001106",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "phaeopigments": {
      "name": "phaeopigments",
      "aliases": [
        "phaeopigments"
      ],
      "mappings": [
        "mixs:phaeopigments"
      ],
      "description": "Concentration of phaeopigments; can include multiple phaeopigments",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{text};{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample"
    },
    "phosplipid_fatt_acid": {
      "name": "phosplipid_fatt_acid",
      "aliases": [
        "phospholipid fatty acid"
      ],
      "mappings": [
        "mixs:phosplipid_fatt_acid"
      ],
      "description": "Concentration of phospholipid fatty acids; can include multiple values",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{text};{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample"
    },
    "pool_dna_extracts": {
      "name": "pool_dna_extracts",
      "title": "pooling of DNA extracts (if done)",
      "aliases": [
        "pooling of DNA extracts (if done)"
      ],
      "mappings": [
        "mixs:pool_dna_extracts"
      ],
      "description": "Indicate whether multiple DNA extractions were mixed. If the answer yes, the number of extracts that were pooled should be given",
      "comments": [
        "Expected value: pooling status;number of pooled extracts"
      ],
      "examples": [
        {
          "value": "yes;5"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{boolean};{integer}",
      "range": "text value",
      "slot_uri": "MIXS:0000325",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "potassium": {
      "name": "potassium",
      "aliases": [
        "potassium"
      ],
      "mappings": [
        "mixs:potassium"
      ],
      "description": "Concentration of potassium in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "pressure": {
      "name": "pressure",
      "aliases": [
        "pressure"
      ],
      "mappings": [
        "mixs:pressure"
      ],
      "description": "\"Pressure to which the sample is subject to, in atmospheres\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "prev_land_use_meth": {
      "name": "prev_land_use_meth",
      "title": "history/previous land use method",
      "description": "Reference or method used in determining previous land use and dates",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "string",
      "slot_uri": "MIXS:0000316",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "previous_land_use": {
      "name": "previous_land_use",
      "title": "history/previous land use",
      "aliases": [
        "history/previous land use"
      ],
      "mappings": [
        "mixs:previous_land_use"
      ],
      "description": "Previous land use and dates",
      "comments": [
        "Expected value: land use name;date"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{timestamp}",
      "range": "text value",
      "slot_uri": "MIXS:0000315",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "previous_land_use_meth": {
      "name": "previous_land_use_meth",
      "aliases": [
        "history/previous land use method"
      ],
      "mappings": [
        "mixs:previous_land_use_meth"
      ],
      "description": "Reference or method used in determining previous land use and dates",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "profile_position": {
      "name": "profile_position",
      "title": "profile position",
      "aliases": [
        "profile position"
      ],
      "mappings": [
        "mixs:profile_position"
      ],
      "description": "Cross-sectional position in the hillslope where sample was collected.sample area position in relation to surrounding areas",
      "comments": [
        "Expected value: enumeration"
      ],
      "examples": [
        {
          "value": "summit"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[summit|shoulder|backslope|footslope|toeslope]",
      "range": "profile_position_enum",
      "slot_uri": "MIXS:0001084",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "[summit|shoulder|backslope|footslope|toeslope]"
    },
    "proport_woa_temperature": {
      "name": "proport_woa_temperature",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "redox_potential": {
      "name": "redox_potential",
      "aliases": [
        "redox potential"
      ],
      "mappings": [
        "mixs:redox_potential"
      ],
      "description": "\"Redox potential, measured relative to a hydrogen cell, indicating oxidation or reduction potential\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "salinity": {
      "name": "salinity",
      "aliases": [
        "salinity"
      ],
      "mappings": [
        "mixs:salinity"
      ],
      "description": "\"Salinity is the total concentration of all dissolved salts in a water sample. While salinity can be measured by a complete chemical analysis, this method is difficult and time consuming. More often, it is instead derived from the conductivity measurement. This is known as practical salinity. These derivations compare the specific conductance of the sample to a salinity standard such as seawater\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "salinity_category": {
      "name": "salinity_category",
      "description": "Categorcial description of the sample's salinity. Examples: halophile, halotolerant, hypersaline, huryhaline",
      "from_schema": "http://example.com/soil_biosample",
      "see_also": [
        "https://github.com/microbiomedata/nmdc-metadata/pull/297"
      ],
      "range": "string",
      "owner": "biosample"
    },
    "salinity_meth": {
      "name": "salinity_meth",
      "title": "salinity method",
      "aliases": [
        "salinity method",
        "extreme_unusual_properties/salinity method"
      ],
      "mappings": [
        "mixs:salinity_meth"
      ],
      "description": "Reference or method used in determining salinity",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000341",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "samp_collect_device": {
      "name": "samp_collect_device",
      "aliases": [
        "sample collection device or method"
      ],
      "mappings": [
        "mixs:samp_collect_device"
      ],
      "description": "The method or device employed for collecting the sample",
      "in_subset": [
        "nucleic acid sequence source"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "samp_mat_process": {
      "name": "samp_mat_process",
      "aliases": [
        "sample material processing"
      ],
      "mappings": [
        "mixs:samp_mat_process"
      ],
      "description": "\"Any processing applied to the sample during or after retrieving the sample from environment. This field accepts OBI, for a browser of OBI (v 2018-02-12) terms please see http://purl.bioontology.org/ontology/OBI\"",
      "in_subset": [
        "nucleic acid sequence source"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "controlled term value",
      "multivalued": false,
      "owner": "biosample"
    },
    "samp_store_dur": {
      "name": "samp_store_dur",
      "aliases": [
        "sample storage duration"
      ],
      "mappings": [
        "mixs:samp_store_dur"
      ],
      "description": "Duration for which the sample was stored",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "samp_store_loc": {
      "name": "samp_store_loc",
      "aliases": [
        "sample storage location"
      ],
      "mappings": [
        "mixs:samp_store_loc"
      ],
      "description": "\"Location at which sample was stored, usually name of a specific freezer/room\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "samp_store_temp": {
      "name": "samp_store_temp",
      "aliases": [
        "sample storage temperature"
      ],
      "mappings": [
        "mixs:samp_store_temp"
      ],
      "description": "\"Temperature at which sample was stored, e.g. -80 degree Celsius\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "samp_vol_we_dna_ext": {
      "name": "samp_vol_we_dna_ext",
      "aliases": [
        "sample volume or weight for DNA extraction"
      ],
      "mappings": [
        "mixs:samp_vol_we_dna_ext"
      ],
      "description": "\"Volume (ml), weight (g) of processed sample, or surface area swabbed from sample for DNA extraction\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "sample_collection_site": {
      "name": "sample_collection_site",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "season_precpt": {
      "name": "season_precpt",
      "title": "mean seasonal precipitation",
      "aliases": [
        "mean seasonal precipitation"
      ],
      "mappings": [
        "mixs:season_precpt"
      ],
      "description": "The average of all seasonal precipitation values known, or an estimated equivalent value derived by such methods as regional indexes or Isohyetal maps.",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: millimeter"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000645",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "season_temp": {
      "name": "season_temp",
      "title": "mean seasonal temperature",
      "aliases": [
        "mean seasonal temperature"
      ],
      "mappings": [
        "mixs:season_temp"
      ],
      "description": "Mean seasonal temperature",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: degree Celsius"
      ],
      "examples": [
        {
          "value": "18 degree Celsius"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000643",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "sieving": {
      "name": "sieving",
      "title": "composite design/sieving",
      "aliases": [
        "composite design/sieving",
        "composite design/sieving (if any)"
      ],
      "mappings": [
        "mixs:sieving"
      ],
      "description": "Collection design of pooled samples and/or sieve size and amount of sample sieved",
      "comments": [
        "Expected value: design name and/or size;amount"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{{text}|{float} {unit}};{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000322",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "size_frac_low": {
      "name": "size_frac_low",
      "aliases": [
        "size-fraction lower threshold"
      ],
      "mappings": [
        "mixs:size_frac_low"
      ],
      "description": "Refers to the mesh/pore size used to pre-filter/pre-sort the sample. Materials larger than the size threshold are excluded from the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "size_frac_up": {
      "name": "size_frac_up",
      "aliases": [
        "size-fraction upper threshold"
      ],
      "mappings": [
        "mixs:size_frac_up"
      ],
      "description": "Refers to the mesh/pore size used to retain the sample. Materials smaller than the size threshold are excluded from the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "slope_aspect": {
      "name": "slope_aspect",
      "title": "slope aspect",
      "aliases": [
        "slope aspect"
      ],
      "mappings": [
        "mixs:slope_aspect"
      ],
      "description": "The direction a slope faces. While looking down a slope use a compass to record the direction you are facing (direction or degrees); e.g., nw or 315 degrees. This measure provides an indication of sun and wind exposure that will influence soil temperature and evapotranspiration.",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: degree"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000647",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "slope_gradient": {
      "name": "slope_gradient",
      "title": "slope gradient",
      "aliases": [
        "slope gradient"
      ],
      "mappings": [
        "mixs:slope_gradient"
      ],
      "description": "Commonly called 'slope'. The angle between ground surface and a horizontal line (in percent). This is the direction that overland water would flow. This measure is usually taken with a hand level meter or clinometer",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: percentage"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000646",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "sodium": {
      "name": "sodium",
      "aliases": [
        "sodium"
      ],
      "mappings": [
        "mixs:sodium"
      ],
      "description": "Sodium concentration in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "soil_horizon": {
      "name": "soil_horizon",
      "title": "soil horizon",
      "description": "Specific layer in the land area which measures parallel to the soil surface and possesses physical characteristics which differ from the layers above and beneath",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[O horizon|A horizon|E horizon|B horizon|C horizon|R layer|Permafrost]",
      "range": "soil_horizon_enum",
      "slot_uri": "MIXS:0001082",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "soil_text_measure": {
      "name": "soil_text_measure",
      "title": "soil texture measurement",
      "description": "The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "range": "quantity value",
      "slot_uri": "MIXS:0000335",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "soil_texture_meth": {
      "name": "soil_texture_meth",
      "title": "soil texture method",
      "description": "Reference or method used in determining soil texture",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "string",
      "slot_uri": "MIXS:0000336",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "soil_type": {
      "name": "soil_type",
      "title": "soil type",
      "aliases": [
        "soil type"
      ],
      "mappings": [
        "mixs:soil_type"
      ],
      "description": "MIxS:Description of the soil type or classification. This field accepts terms under soil (http://purl.obolibrary.org/obo/ENVO_00001998).  Multiple terms can be separated by pipes.|NMDC:Soil series name or other lower-level classification",
      "comments": [
        "Expected value: ENVO_00001998"
      ],
      "examples": [
        {
          "value": "plinthosol [ENVO:00002250]"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{termLabel} {[termID]}",
      "range": "text value",
      "slot_uri": "MIXS:0000332",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "soil_type_meth": {
      "name": "soil_type_meth",
      "title": "soil type method",
      "aliases": [
        "soil type method"
      ],
      "mappings": [
        "mixs:soil_type_meth"
      ],
      "description": "Reference or method used in determining soil series name or other lower-level classification",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000334",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "soluble_iron_micromol": {
      "name": "soluble_iron_micromol",
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "owner": "biosample"
    },
    "specific_ecosystem": {
      "name": "specific_ecosystem",
      "description": "TODO",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "gold_path_field",
      "owner": "biosample"
    },
    "store_cond": {
      "name": "store_cond",
      "title": "storage conditions",
      "aliases": [
        "storage conditions",
        "storage conditions (fresh/frozen/other)"
      ],
      "mappings": [
        "mixs:store_cond"
      ],
      "description": "MIxS:Explain how and for how long the soil sample was stored before DNA extraction (fresh/frozen/other).|NMDC:Explain how and for how long the soil sample was stored before DNA extraction",
      "comments": [
        "Expected value: storage condition type;duration"
      ],
      "examples": [
        {
          "value": "-20 degree Celsius freezer;P2Y10D"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{text};{duration}",
      "range": "text value",
      "slot_uri": "MIXS:0000327",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "subsurface_depth": {
      "name": "subsurface_depth",
      "from_schema": "http://example.com/soil_biosample",
      "range": "quantity value",
      "owner": "biosample"
    },
    "subsurface_depth2": {
      "name": "subsurface_depth2",
      "from_schema": "http://example.com/soil_biosample",
      "range": "quantity value",
      "owner": "biosample"
    },
    "sulfate": {
      "name": "sulfate",
      "aliases": [
        "sulfate"
      ],
      "mappings": [
        "mixs:sulfate"
      ],
      "description": "Concentration of sulfate in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "sulfide": {
      "name": "sulfide",
      "aliases": [
        "sulfide"
      ],
      "mappings": [
        "mixs:sulfide"
      ],
      "description": "Concentration of sulfide in the sample",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "temp": {
      "name": "temp",
      "title": "temperature",
      "aliases": [
        "temperature"
      ],
      "mappings": [
        "mixs:temp"
      ],
      "description": "MIxS:Temperature of the sample at the time of sampling.|NMDC:Temperature of the sample at the time of sampling",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: degree Celsius"
      ],
      "examples": [
        {
          "value": "25 degree Celsius"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "environment field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000113",
      "multivalued": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "texture": {
      "name": "texture",
      "aliases": [
        "texture"
      ],
      "mappings": [
        "mixs:texture"
      ],
      "description": "\"The relative proportion of different grain sizes of mineral particles in a soil, as described using a standard system; express as % sand (50 um to 2 mm), silt (2 um to 50 um), and clay (<2 um) with textural name (e.g., silty clay loam) optional.\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "texture_meth": {
      "name": "texture_meth",
      "aliases": [
        "texture method"
      ],
      "mappings": [
        "mixs:texture_meth"
      ],
      "description": "Reference or method used in determining soil texture",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "tidal_stage": {
      "name": "tidal_stage",
      "aliases": [
        "tidal stage"
      ],
      "mappings": [
        "mixs:tidal_stage"
      ],
      "description": "Stage of tide",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "[low tide|ebb tide|flood tide|high tide]"
    },
    "tillage": {
      "name": "tillage",
      "title": "history/tillage",
      "aliases": [
        "history/tillage"
      ],
      "mappings": [
        "mixs:tillage"
      ],
      "description": "Note method(s) used for tilling",
      "comments": [
        "Expected value: enumeration"
      ],
      "examples": [
        {
          "value": "chisel"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]",
      "range": "tillage_enum",
      "slot_uri": "MIXS:0001081",
      "multivalued": true,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "[drill|cutting disc|ridge till|strip tillage|zonal tillage|chisel|tined|mouldboard|disc plough]"
    },
    "tot_carb": {
      "name": "tot_carb",
      "aliases": [
        "total carbon"
      ],
      "mappings": [
        "mixs:tot_carb"
      ],
      "description": "Total carbon content",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "tot_depth_water_col": {
      "name": "tot_depth_water_col",
      "aliases": [
        "total depth of water column"
      ],
      "mappings": [
        "mixs:tot_depth_water_col"
      ],
      "description": "Measurement of total depth of water column",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "tot_diss_nitro": {
      "name": "tot_diss_nitro",
      "aliases": [
        "total dissolved nitrogen"
      ],
      "mappings": [
        "mixs:tot_diss_nitro"
      ],
      "description": "\"Total dissolved nitrogen concentration, reported as nitrogen, measured by: total dissolved nitrogen = NH4 + NO3NO2 + dissolved organic nitrogen\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "tot_nitro_cont_meth": {
      "name": "tot_nitro_cont_meth",
      "title": "total nitrogen content method",
      "description": "Reference or method used in determining the total nitrogen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "string",
      "slot_uri": "MIXS:0000338",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "tot_nitro_content": {
      "name": "tot_nitro_content",
      "title": "total nitrogen content",
      "aliases": [
        "total nitrogen content"
      ],
      "mappings": [
        "mixs:tot_nitro_content"
      ],
      "description": "Total nitrogen content of the sample",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: microgram per liter, micromole per liter, milligram per liter"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000530",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "tot_nitro_content_meth": {
      "name": "tot_nitro_content_meth",
      "aliases": [
        "total nitrogen content method"
      ],
      "mappings": [
        "mixs:tot_nitro_content_meth"
      ],
      "description": "Reference or method used in determining the total nitrogen",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "tot_org_c_meth": {
      "name": "tot_org_c_meth",
      "title": "total organic carbon method",
      "aliases": [
        "total organic carbon method"
      ],
      "mappings": [
        "mixs:tot_org_c_meth"
      ],
      "description": "Reference or method used in determining total organic carbon",
      "comments": [
        "Expected value: PMID,DOI or url"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "text value",
      "slot_uri": "MIXS:0000337",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample"
    },
    "tot_org_carb": {
      "name": "tot_org_carb",
      "title": "total organic carbon",
      "aliases": [
        "total organic carbon"
      ],
      "mappings": [
        "mixs:tot_org_carb"
      ],
      "description": "Definition for soil: total organic carbon content of the soil, definition otherwise: total organic carbon content",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: gram Carbon per kilogram sample material"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000533",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "tot_phosp": {
      "name": "tot_phosp",
      "aliases": [
        "total phosphorus"
      ],
      "mappings": [
        "mixs:tot_phosp"
      ],
      "description": "\"Total phosphorus concentration in the sample, calculated by: total phosphorus = total dissolved phosphorus + particulate phosphorus\"",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "multivalued": false,
      "owner": "biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "type": {
      "name": "type",
      "description": "An optional string that specifies the type object.  This is used to allow for searches for different kinds of objects.",
      "examples": [
        {
          "value": "nmdc:Biosample"
        },
        {
          "value": "nmdc:Study"
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "range": "string",
      "designates_type": true,
      "owner": "biosample"
    },
    "water_cont_soil_meth": {
      "name": "water_cont_soil_meth",
      "title": "water content method",
      "description": "Reference or method used in determining the water content of soil",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{PMID}|{DOI}|{URL}",
      "range": "string",
      "slot_uri": "MIXS:0000323",
      "multivalued": false,
      "required": false,
      "owner": "soil"
    },
    "water_content": {
      "name": "water_content",
      "title": "water content",
      "aliases": [
        "water content"
      ],
      "mappings": [
        "mixs:water_content"
      ],
      "description": "Water content measurement",
      "comments": [
        "Expected value: measurement value",
        "Preferred unit: gram per gram or cubic centimeter per cubic centimeter"
      ],
      "examples": [
        {
          "value": ""
        }
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "core field",
      "string_serialization": "{float} {unit}",
      "range": "quantity value",
      "slot_uri": "MIXS:0000185",
      "multivalued": false,
      "required": false,
      "owner": "http://example.com/soil_biosample",
      "pattern": "\\d+[.\\d+] \\S+"
    },
    "water_content_soil_meth": {
      "name": "water_content_soil_meth",
      "aliases": [
        "water content method"
      ],
      "mappings": [
        "mixs:water_content_soil_meth"
      ],
      "description": "Reference or method used in determining the water content of soil",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "range": "text value",
      "multivalued": false,
      "owner": "biosample"
    },
    "GOLD identifiers": {
      "name": "GOLD identifiers",
      "from_schema": "http://example.com/soil_biosample",
      "see_also": [
        "https://gold.jgi.doe.gov/"
      ],
      "mixin": true
    },
    "INSDC identifiers": {
      "name": "INSDC identifiers",
      "aliases": [
        "EBI identifiers",
        "NCBI identifiers",
        "DDBJ identifiers"
      ],
      "description": "Any identifier covered by the International Nucleotide Sequence Database Collaboration",
      "comments": [
        "note that we deliberately abstract over which of the partner databases accepted the initial submission",
        "{'the first letter of the accession indicates which partner accepted the initial submission': 'E for ENA, D for DDBJ, or S or N for NCBI.'}"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "see_also": [
        "https://www.insdc.org/",
        "https://ena-docs.readthedocs.io/en/latest/submit/general-guide/accessions.html"
      ],
      "mixin": true
    },
    "acted on behalf of": {
      "name": "acted on behalf of",
      "mappings": [
        "prov:actedOnBehalfOf"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "range": "agent"
    },
    "attribute": {
      "name": "attribute",
      "aliases": [
        "field",
        "property",
        "template field",
        "key",
        "characteristic"
      ],
      "description": "A attribute of a biosample. Examples: depth, habitat, material. For NMDC, attributes SHOULD be mapped to terms within a MIxS template",
      "from_schema": "http://example.com/soil_biosample",
      "abstract": true
    },
    "core field": {
      "name": "core field",
      "description": "basic fields",
      "from_schema": "http://example.com/soil_biosample",
      "abstract": true
    },
    "ended at time": {
      "name": "ended at time",
      "mappings": [
        "prov:endedAtTime"
      ],
      "from_schema": "http://example.com/soil_biosample"
    },
    "environment field": {
      "name": "environment field",
      "description": "field describing environmental aspect of a sample",
      "from_schema": "http://example.com/soil_biosample",
      "abstract": true
    },
    "external database identifiers": {
      "name": "external database identifiers",
      "close_mappings": [
        "skos:closeMatch"
      ],
      "description": "Link to corresponding identifier in external database",
      "comments": [
        "The value of this field is always a registered CURIE"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "alternative identifiers",
      "abstract": true,
      "range": "external identifier",
      "multivalued": true
    },
    "gold_path_field": {
      "name": "gold_path_field",
      "description": "This is a grouping for any of the gold path fields          ",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "attribute",
      "abstract": true,
      "range": "string"
    },
    "has maximum numeric value": {
      "name": "has maximum numeric value",
      "description": "The maximum value part, expressed as number, of the quantity value when the value covers a range.",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "has numeric value"
    },
    "has minimum numeric value": {
      "name": "has minimum numeric value",
      "description": "The minimum value part, expressed as number, of the quantity value when the value covers a range.",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "has numeric value"
    },
    "has numeric value": {
      "name": "has numeric value",
      "from_schema": "http://example.com/soil_biosample",
      "range": "double"
    },
    "has raw value": {
      "name": "has raw value",
      "from_schema": "http://example.com/soil_biosample",
      "string_serialization": "{has numeric value} {has unit}"
    },
    "has unit": {
      "name": "has unit",
      "description": "Example \"m\"",
      "from_schema": "http://example.com/soil_biosample"
    },
    "language": {
      "name": "language",
      "description": "Should use ISO 639-1 code e.g. \"en\", \"fr\"",
      "from_schema": "http://example.com/soil_biosample",
      "range": "language code"
    },
    "latitude": {
      "name": "latitude",
      "mappings": [
        "schema:latitude"
      ],
      "description": "latitude",
      "from_schema": "http://example.com/soil_biosample",
      "domain": "geolocation value",
      "range": "decimal degree",
      "slot_uri": "wgs:lat"
    },
    "longitude": {
      "name": "longitude",
      "mappings": [
        "schema:longitude"
      ],
      "description": "longitude",
      "from_schema": "http://example.com/soil_biosample",
      "domain": "geolocation value",
      "range": "decimal degree",
      "slot_uri": "wgs:long"
    },
    "sample identifiers": {
      "name": "sample identifiers",
      "from_schema": "http://example.com/soil_biosample",
      "is_a": "external database identifiers",
      "abstract": true
    },
    "started at time": {
      "name": "started at time",
      "mappings": [
        "prov:startedAtTime"
      ],
      "from_schema": "http://example.com/soil_biosample"
    },
    "term": {
      "name": "term",
      "description": "pointer to an ontology class",
      "from_schema": "http://example.com/soil_biosample",
      "domain": "controlled term value",
      "range": "ontology class",
      "slot_uri": "rdf:type",
      "inlined": true
    },
    "used": {
      "name": "used",
      "mappings": [
        "prov:used"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "domain": "activity"
    },
    "was associated with": {
      "name": "was associated with",
      "mappings": [
        "prov:wasAssociatedWith"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "range": "agent"
    },
    "was generated by": {
      "name": "was generated by",
      "mappings": [
        "prov:wasGeneratedBy"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "range": "activity"
    },
    "was informed by": {
      "name": "was informed by",
      "mappings": [
        "prov:wasInformedBy"
      ],
      "from_schema": "http://example.com/soil_biosample",
      "range": "activity"
    }
  },
  "types": {
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
    "decimal degree": {
      "name": "decimal degree",
      "description": "A decimal degree expresses latitude or longitude as decimal fractions.",
      "see_also": [
        "https://en.wikipedia.org/wiki/Decimal_degrees"
      ],
      "base": "float",
      "uri": "xsd:decimal"
    },
    "double": {
      "name": "double",
      "description": "A real number that conforms to the xsd:double specification",
      "base": "float",
      "uri": "xsd:double"
    },
    "external identifier": {
      "name": "external identifier",
      "description": "A CURIE representing an external identifier",
      "see_also": [
        "https://microbiomedata.github.io/nmdc-schema/identifiers.html"
      ],
      "typeof": "uriorcurie"
    },
    "float": {
      "name": "float",
      "description": "A real number that conforms to the xsd:float specification",
      "base": "float",
      "uri": "xsd:float"
    },
    "language code": {
      "name": "language code",
      "description": "A language code conforming to ISO_639-1",
      "see_also": [
        "https://en.wikipedia.org/wiki/ISO_639-1"
      ],
      "base": "str",
      "uri": "xsd:language"
    },
    "string": {
      "name": "string",
      "description": "A character string",
      "base": "str",
      "uri": "xsd:string"
    },
    "unit": {
      "name": "unit",
      "mappings": [
        "qud:Unit",
        "UO:0000000"
      ],
      "base": "str",
      "uri": "xsd:string"
    },
    "uriorcurie": {
      "name": "uriorcurie",
      "description": "a URI or a CURIE",
      "base": "URIorCURIE",
      "uri": "xsd:anyURI",
      "repr": "str"
    }
  }
}