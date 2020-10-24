/**
 * Download phac_dexa grid mapped to GRDI format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGRDI = (baseName, hot, data, xlsx) => {
  // Provides a map from each export format field to the linear list of source
  // fields it derives content from.
  const ExportHeaders = new Map([
    ['sample_name',                     []],
    ['alternative_sample_ID',           []],
    ['geo_loc (country)',               []],
    ['geo_loc (state/province/region)', []],
    ['environmental_site',              []],
    ['collection_date',                 []],
    ['collected_by',                    []],
    ['collection_device',               []],
    ['host (common name)',              []],
    ['anatomical_part',                 []],
    ['anatomical_material',             []],
    ['body_product',                    []],
    ['environmental_material',          []],
    ['food_product',                    []],
    ['sample_collector_contact_email',  []], //CIPARS generic email ???
    ['organism',                        []],
    ['animal_or_plant_population',      []],
    ['laboratory_name',                 []],
    ['serovar',                         []],
    ['serotyping_method',               []],
    ['phagetype',                       []],
    ['purpose_of_sampling',             []],
    ['comments']
  ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);

  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'GRDI');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

  const inputMatrix = getTrimmedData(hot);
  for (const inputRow of inputMatrix) {

    let RuleDB = setRuleDB(inputRow, sourceFields, sourceFieldNameMap);

    const outputRow = [];
    for (const headerName of ExportHeaders.keys()) {

      // If Export Header field is in RuleDB, set output value from it, and
      // continue.
      if (headerName in RuleDB) {
        outputRow.push(RuleDB[headerName]);
        continue;
      };

      // Otherwise apply source (many to one) to target field transform:
      const sources = ExportHeaders.get(headerName);
      const value = getMappedField(inputRow, sources, sourceFieldNameMap, ';') 
      outputRow.push(value);
    };
    outputMatrix.push(outputRow);
  };

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, 'xls', xlsx]);
}

/**
 * Download phac_dexa grid mapped to GRDI format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var setRuleDB = (dataRow, sourceFields, sourceFieldNameMap) => {
  // Rule-based target field value calculatio nbased on given data row
  let RuleDB = {
    // Holding bin of target fields/variables to populate with custom rule
    // content
    'anatomical_part':           '',
    'anatomical_material':       '',
    'body_product':              '',
    'environmental_material':    '',
    'environmental_site':        '',
    'food_product':              '',
    'collection_device':         '',
    'animal_or_plant_population':''

    // Source fields and their content added below
  };

  let ruleSourceFieldNames = ['STTYPE', 'STYPE', 'SPECIMENSUBSOURCE_1', 'SUBJECT_DESCRIPTIONS', 'SPECIES', 'COMMODITY'];

  // This will set content of a target field based on data.js vocabulary
  // exportField {'field':[target column],'value':[replacement value]]}
  // mapping if any.
  getRowMap(dataRow, ruleSourceFieldNames, RuleDB, sourceFields, sourceFieldNameMap, 'GRDI');

  // STTYPE: ANIMAL ENVIRONMENT FOOD HUMAN PRODUCT QA UNKNOWN
  switch (RuleDB.STTYPE) {
    // BEGIN ANIMAL
    case 'ANIMAL': {
      // BEGIN SPECIMENSUBSOURCE_1
      switch (RuleDB.SPECIMENSUBSOURCE_1) {
        /*
        case 'Spleen':
        case 'Joint':
        case 'Heart':
        case 'Intestine':
        case 'Mixed organs':
        case 'Cecum':
        case 'Anal gland':
        case 'Yolk sac':
        case 'Cloacae':
        case 'Ileum':
        case 'Colon':
        */
        case 'Liver': // FOOD PRODUCT????
        case 'Crop' : // ENVIRONMENTAL MATERIAL????
          RuleDB.anatomical_part = RuleDB.SPECIMENSUBSOURCE_1;
          break;
        /*
        case 'Feces' : 
        case 'Meconium' :
          RuleDB.body_product = RuleDB.SPECIMENSUBSOURCE_1;
          break;
        */
        case 'Cecal content' : // BODY PRODUCT !!!!
        /*
        case 'Blood' : 
        case 'Joint fluid' :
        */
          RuleDB.anatomical_material = RuleDB.SPECIMENSUBSOURCE_1;
          break;
        /*
        case 'Dust' :
        case 'Fluff' :
        case 'Rinse' :
        case 'Manure' :
          RuleDB.environmental_material = RuleDB.SPECIMENSUBSOURCE_1;
          break;
        */
        /*
        case 'Wall' :
        case 'Feeders and Drinkers' :
        case 'Manure pit' :
        case 'Fan' :
        case 'Egg belt' :
        case 'Chick pad' :
        case 'Watering bowl' :
        case 'Equipment' :
          RuleDB.environmental_site = RuleDB.SPECIMENSUBSOURCE_1;
          break;
        */
        /*
        case 'Environmental swab (Hatchery)':
          RuleDB.collection_device = 'swab';
          RuleDB.environmental_site = 'hatchery';
          break;
        */
        default: 
          break; // Prevents advancing to COMMODITY
      };
      // END SPECIMENSUBSOURCE_1

      // BEGIN COMMODITY
      /*
      switch (RuleDB.COMMODITY) {
        case 'Pet/Zoo' :
          RuleDB.environmental_site = RuleDB.COMMODITY;
      };
      */
      // END COMMODITY

      break; // prevents advancing to FOOD
      
    };
    // END ANIMAL

    // BEGIN FOOD
    case 'FOOD' : {
      switch (RuleDB.SPECIES) {
        // NO BREAK - ENABLE food_product value enhancement 
        case 'Chicken' :
        case 'Turkey' :
        case 'Pig' :
          RuleDB.food_product += (RuleDB.food_product.length > 0 ? ' ':'') + RuleDB.SPECIES;
      };
      /*
      switch (RuleDB.SUBJECT_DESCRIPTIONS) {
        case 'Breast skinless' :
        case 'Ground' :
        case 'Drumstick' :
        case 'Thigh with skin' :
        case 'Wing' :
        case 'Upper thigh' :
          RuleDB.food_product += (' ' + RuleDB.SUBJECT_DESCRIPTIONS);
      };
      */
      break; // prevents advancing to blank/UNKNOWN
    };

    case '':
    case 'UNKNOWN': {// no <n/a>
      /*
      switch (RuleDB.STYPE) {
        case 'Cereal':
          RuleDB.food_product += RuleDB.STYPE;
      };
      */
      break;
    };

    /*
    case 'ENVIRONMENT':
      switch (RuleDB.STYPE) {
        case 'Manure':
          RuleDB.environmental_material = RuleDB.STYPE;
      };
      break;
    */

    case 'PRODUCT':
      switch (RuleDB.STYPE) {
        case 'Feed & ingredients':
        case 'Fertilizer': {
          switch (RuleDB.SUBJECT_DESCRIPTIONS) {
            case 'Fish meal':
            case 'Feather meal':
            case 'Starter ration':
              RuleDB.food_product += RuleDB.SUBJECT_DESCRIPTIONS;
              break;
            case 'Avian ingredients':
              // ISSUE: how to incorporate "feed (food_product)"
              RuleDB.food_product += RuleDB.SUBJECT_DESCRIPTIONS;
              break;
          };
        };
      };
      break;

    default: // Any other STTYPE Value:

      switch (RuleDB.STYPE) {
        case 'Porcine':
        case 'Avian':
        case 'Crustacean': {
          switch (RuleDB.COMMODITY) {
            case 'Beef':
            case 'Broiler':
            case 'Shrimp':
              RuleDB.food_product += RuleDB.COMMODITY;
          };
        };
      };
      break;
  };

  if (RuleDB.collection_device = 'swab' && RuleDB.environmental_site.length > 0) {
     RuleDB.animal_or_plant_population = RuleDB.SPECIES;
  };

  return RuleDB;
};

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "Dexa to GRDI": exportGRDI
};
