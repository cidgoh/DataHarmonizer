/**
 * Download phac_dexa grid mapped to GRDI format.
 * DEXA to GRDI is 3 step process:
 * 1: Normalize DEXA fields
 *  - All input is lowercase at moment except for one term: 'bursa of Fabricius'
 * 2: Merge field values into target fields according to rules. Done in setRuleDB
 * 3: Ontology id addition to merged fields
 * 
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGRDI = (baseName, hot, data, xlsx, fileType) => {
  // Provides a map from each export format field to the linear list of source
  // fields it derives content from.
  const ExportHeaders = new Map([
		// Sample collection and processing
  	['sample_collector_sample_ID',                []], // takes DEXA SPECIMEN_ID, SAMPLE_ID
    ['alternative_sample_ID',                     []], // takes DEXA LFZ_ADDITIONAL_SAMPLE_ID
    ['collected_by_institution_name',             []], // takes DEXA SUBMITTINGORG_1
    ['collected_by_laboratory_name',              []], // takes DEXA SUBMITTINGLAB_1
    ['sample_collection_project_name',            []],
    ['sample_plan_name',                     			[]],
    ['sample_plan_ID',                     				[]],
    ['sample_collector_contact_name',             []],
    ['sample_collector_contact_email',            []], //CIPARS generic email ???
    ['purpose_of_sampling',                     	[]],
    ['experimental_activity',                     []],
    ['experimental_activity_details',             []],
    ['sample_processing',                     		[]],
    ['geo_loc_name (country)',                    []], // takes DEXA COUNTRY_1
    ['geo_loc_name (state/province/region)',      []], // takes DEXA PROVINCE_1
    ['food_product_origin geo_loc_name (country)',[]],
    ['host_origin geo_loc_name (country)',        []],
    ['latitude_of_sample_collection',             []],
    ['longitude_of_sample_collection',            []],
    ['sample_collection_date',                    []], // takes DEXA DATECOLLECTED_1
    ['sample_received_date',                     	[]],
    ['original_sample_description',               []],
    ['environmental_site',                     		[]], // CALCULATED in RuleDB
    ['animal_or_plant_population',                []], // CALCULATED in RuleDB
    ['environmental_material',                    []], // CALCULATED in RuleDB
    ['body_product',                     					[]], // CALCULATED in RuleDB
    ['anatomical_part',                     			[]], // CALCULATED in RuleDB
    ['food_product',                     					[]], // CALCULATED in RuleDB
    ['food_product_properties',                   []], // CALCULATED in RuleDB
    ['animal_source_of_food',                     []],
    ['food_packaging',                     				[]],
    ['collection_device',                     		[]], // CALCULATED in RuleDB
    ['collection_method',                     		[]], // CALCULATED in RuleDB
		//	Host information
    ['host (common name)',                     		[]], // takes DEXA SPECIES BUT ALSO  // CALCULATED in RuleDB
    ['host (scientific name)',                    []],
    ['host_disease',                     					[]],
    
    ['host_developmental_stage',										[]], // CALCULATED in RuleDB

		//	Strain and isolation information
    ['microbiological_method',                    []],
    ['strain',                     								[]],
    ['isolate_ID',                     						[]], // takes DEXA ISOLATE_ID
    ['alternative_isolate_ID',                    []],
    ['progeny_isolate_ID',                     		[]],
    ['IRIDA_isolate_ID',                     			[]],
    ['IRIDA_project_ID',                     			[]],
    ['isolated_by_institution_name',              []],
    ['isolated_by_laboratory_name',               []],
    ['isolated_by_contact_name',                  []],
    ['isolated_by_contact_email',                 []],
    ['isolation_date',                     				[]],
    ['isolate_received_date',                     []],
    ['organism',                     							[]], // takes DEXA FINAL_ID_GENUS, FINAL_ID_SPECIES
    ['serovar',                     							[]], // takes DEXA FINAL_ID_SEROTYPE
    ['serotyping_method',                     		[]], // takes DEXA SA_Serotype_Method
    ['phagetype',                     						[]], // takes DEXA FINAL_ID_PHAGETYPE
		// Sequence information
    ['library_ID',                     						[]],
    ['sequenced_by_institution_name',             []],
    ['sequenced_by_laboratory_name',              []],
    ['sequenced_by_contact_name',                 []],
    ['sequenced_by_contact_email',                []],
    ['purpose_of_sequencing',                     []],
    ['sequencing_project_name',                   []],
    ['sequencing_platform',                     	[]],
    ['sequencing_instrument',                     []],
    ['sequencing_method',                     		[]],
    ['r1_fastq_filename',                     		[]],
    ['r1_fastq_filename',                     		[]],
    ['fast5_filename',                     				[]],
    ['assembly_filename',                     		[]],
		//	Public repository information
    ['publication_ID',                     				[]],
    ['attribute_package',                     		[]],
    ['biosample_accession',                     	[]],
    ['SRA_accession',                     				[]],
    ['GenBank_accession',                     		[]],
    // Antimicrobial Resistance
    // ...

    //['sample_name',                     				[]], NEW FIELD??
    //['collected_by',                    				[]], DIFFERENT FIELD
    ['anatomical_material',             					[]], // MISSING FIELD  // CALCULATED in RuleDB
    //['laboratory_name',                 				[]], --> collected_by_laboratory_name?? // takes SUBMITTINGLAB_1
    ['DataHarmonizer provenance',									[]],
  ]);


  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);

  // Fills in the above mapping of export field to source fields (or just set
  // source fields manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'GRDI');

  // Copy headers to 1st row of new export table
  const outputMatrix = [[...ExportHeaders.keys()]];

	let normalize = initNormalize();
	let category = initCategory();

  const inputMatrix = getTrimmedData(hot);
  for (const inputRow of inputMatrix) {

  	// Does all 
    let RuleDB = setRuleDB(inputRow, sourceFields, sourceFieldNameMap, normalize, category);

    const outputRow = [];
    for (const headerName of ExportHeaders.keys()) {

      // If Export Header field is in RuleDB, set output value from it, and
      // continue.
      if ((headerName in RuleDB) && RuleDB[headerName] && RuleDB[headerName].length > 0) {
        let value = RuleDB[headerName];
        outputRow.push(value);
        continue;
      };

      // Otherwise apply source (many to one) to target field transform:
      const sources = ExportHeaders.get(headerName);
      let value = getMappedField(headerName, inputRow, sources, sourceFields, sourceFieldNameMap, ';', 'GRDI');
      // semicolon-separated list of values.  Issue is terms have come from other source fields. 
      value = map_ontology(value, category, headerName);
      outputRow.push(value);
    };
    outputMatrix.push(outputRow);
  };

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
}

/** Determine if text label for field is in an existing ontology or not.
 * @param {String} labels delimited by semicolons.
 * @param {Object} category dictionary of labe -> field & ontology_id.
 */
var map_ontology = (labels, category, field) => {
  value = [];
  for (let label of labels.split(';')) {

    // If it is a selection list picklist item it may have an ontology ID.


    label = label.toLowerCase().trim();

    // Otherwise it may be a compound term
    if (label in category) {
      for (let item of category[label]) {
        if (item.field == field && item.ontology_id) {
          label += ': ' + item.ontology_id;
          break;
        }
      }
    }
    value.push(label);
  }
  return value.join(';');
}

        

/** Rule-based target field value calculation based on given data row
 * @param {Object} dataRow.
 * @param {Object} sourceFields.
 * @param {Object} sourceFieldNameMap.
 * @param {Object} normalize term lookup table.
 * @param {Object} term category lookup table.
 */
var setRuleDB = (dataRow, sourceFields, sourceFieldNameMap, normalize, category) => {

  // RuleDB is a holding bin of target fields/variables to populate with custom
  // rule content. None of these fields receive DEXA field content directly.
  let RuleDB = {
    'anatomical_material':       '',
    'anatomical_part':           '',
    'animal_or_plant_population':'',
    'body_product':              '',
    'collection_device':         '',
    'collection_method':         '', // NEW!
    'environmental_material':    '',
    'environmental_site':        '',
    'food_product':              '',

    'food_product_properties':  	'',
    'host (common name)':					'',
    'host_developmental_stage':   '', // NEW!!!!
		'sample_processing':          ''  // NEW!!!!
    // Source fields and their content added below
  };

  let ruleSourceFieldNames = ['STTYPE', 'STYPE', 'SPECIMENSUBSOURCE_1', 'SUBJECT_DESCRIPTIONS', 'SPECIES', 'COMMODITY'];

  // Loads RuleDB with the additional ruleSourceFieldNames.
  // This will set content of a target field based on data.js vocabulary
  // exportField {'field':[target column],'value':[replacement value]]}
  // mapping if any.
  getRowMap(dataRow, ruleSourceFieldNames, RuleDB, sourceFields, sourceFieldNameMap, 'GRDI');

  for (let sourceField of ruleSourceFieldNames) {
  	// All terms get lowercased in GRDI.
  	if (RuleDB[sourceField]) {
	  	let term = RuleDB[sourceField].toLowerCase(); // just one term

			RuleDB[sourceField] = term;

	  	if (term in normalize) {
	  		// Provide DEXA field with normalized version (concatenated string)
				RuleDB[sourceField] = normalize[term].join(';');

				// Shunt any normalized terms to appropriate anatomical_part etc. field
				// per categories lookup.
	  		for (let normalized_term of normalize[term]) {
	  			if (normalized_term in category) {
	  				let normal_obj = category[normalized_term];
	  				// Not using ontology term label.
	  				// NO ONTOLOGY IDs INSERTED YET.
	  				// Is it true that there is only one value per target field?
						RuleDB[normal_obj.field] = normalized_term;  
					}
	  		}
	  	}
  	}
  };

  // STTYPE: ANIMAL ENVIRONMENT FOOD HUMAN PRODUCT QA UNKNOWN
  switch (RuleDB.STTYPE) {

    case 'animal': {
      // species-> host (common name);
      RuleDB['host (common name)'] = RuleDB.SPECIES;

		  if (RuleDB.collection_device === 'swab' 
		  	&& RuleDB.environmental_site.length > 0 
		  	&& RuleDB.SPECIES) {
		     RuleDB.animal_or_plant_population = RuleDB.SPECIES;
		  };
      break; // prevents advancing to FOOD
      
    };

    case 'food' : {
      // species-> food product
      // Issue, sometimes species = "Other" ????
      RuleDB.food_product = RuleDB.SPECIES;

      if (RuleDB.SUBJECT_DESCRIPTIONS)
        add_item(RuleDB,'food_product', RuleDB.SUBJECT_DESCRIPTIONS);

      if (RuleDB.STYPE && RuleDB.COMMODITY) {
				//add_item(RuleDB.food_product, RuleDB.STYPE);
	  		switch (RuleDB.STYPE) {
	        case 'porcine':
	        case 'avian':
	        case 'crustacean': 
	          add_item(RuleDB,'food_product', RuleDB.COMMODITY);
	      };
      }
      break; // prevents advancing to blank/UNKNOWN
    };

    case 'environment':
      // species-> host (common name);
      RuleDB['host (common name)'] = RuleDB.SPECIES;

    	if (RuleDB.STYPE)
      	add_item(RuleDB,'environmental_material', RuleDB.STYPE);
      break;

    case 'product':
      // species-> food product
      RuleDB.food_product = RuleDB.SPECIES;

      switch (RuleDB.STYPE) {
        case 'feed and ingredients':
        case 'fertilizer': 
					add_item(RuleDB,'food_product', RuleDB.SUBJECT_DESCRIPTIONS);
      };
      break;

    default: // Any other STTYPE Value:
    //case '':
    //case 'unknown': {// no <n/a>
    
  };

  return RuleDB;
};

/**
 * Add a value to a field's existing string value, delimited by semicolon.
 */
var add_item = (RuleDB, field, value) => {
	if (RuleDB[field] === '')
		RuleDB[field] = value;
	else
		RuleDB[field] += '; ' + value;
}

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "Dexa to GRDI": {'method': exportGRDI, 'fileType': 'xls', 'status': 'draft'}
};


/* Initialize lookup table for normalizing DEXA terms: term -> normalized term
 */
var initNormalize = () => {
	let normalize = {};
  for (const line of NORMALIZE.split('\n')) {
    let [key, value] = line.split('\t').map(function(e){return e.trim();});
  	normalize[key] = value.split(';').map(function(e){return e.trim();});
  }
  return normalize;
  //console.log(normalize);
}
/************************************************
 Cut & paste from GRDI Normalization tab of DataHarmonizer Templates: 
 https://docs.google.com/spreadsheets/d/1jPQAIJcL_xa3oBVFEsYRGLGf7ESTOwzsTSjKZ-0CTYE/ 
 MUST BE TAB DELIMITED!
 */
var NORMALIZE = `-20°C freezer handle, rm 252	freezer handle
"Pigsty	pigsty
(pigsty) a l'engrais	pigsty
(pigsty) porcherie	pigsty
(Reprod) Farm Baril	farm
(Reprod) Farm Basil	farm
(Reprod) Farm DAN Marc	farm
(Reprod) Farm Martineau	farm
(Reprod) Farm Martinenu	farm
(Reprod) Farm Mercier & Allard	farm
(Reprod) Farm Ramsay	farm
(Reprod) Farm Val-Rainville	farm
(Reprod) ferme Martineau	farm
(Reprod) Ferme Mercier & Allard	farm
(reprod) ferme Rainville	farm
(Reprod)Farm Martineau	farm
(reprod)Farm Ramsay	farm
#1Barn 2	barn
#1Barn 3	barn
#4Barn 3,Salm1	barn
#4Barn 3,Salm2	barn
1/2 breast	
10#56 Hatchery	hatchery
2-Barn 8	barn
2-Barn-5	barn
2006 Barn #1	barn
2007 Barn #C	barn
3-Barn 6	barn
3-Barn-6	barn
A.A. Abattoir	abattoir
Abattior	abattoir
Abattoir AF	abattoir
Abattoir AH	abattoir
Abattoir AH-02	abattoir
Abattoir AL	abattoir
Abattoir AL	abattoir
Abattoir B	abattoir
Abattoir D-02	abattoir
Abattoir DD-02	abattoir
Abattoir G-02	abattoir
Abattoir O	abattoir
Abbatoir	abattoir
Abbatoire	abattoir
Abbattoir	abattoir
Abdominal Muscle	muscle of abdomen
ACRE T	farm
ACRE T FARMS	farm
ACRE-T	farm
Air Inlet	air intake
Air Intake	air intake 
Alfalfa Sprouts	alfalfa sprout
Alfalfa sprouts	alfalfa sprout
Allen's Fisheries	fish farm
Ambo Hospital	hospital 
AMR Abattoir AL	abattoir
AMR Abattoir DD	abattoir
AMR-abattoir	abattoir
AMR-Abattoir-AH	abattoir
AMR-Abattoir-B	abattoir
animalerie (canari)	pet store
Animalerie, aquariums.	pet store
Animalerie, aquariums.	aquarium
Animalerie, comptoir	pet store
Animalerie, comptoir	countertop
Apple	apple (whole or parts)
aquarium water/tropical fish importer	shop
aquarium water/tropical fish importer	tropical fish
aquarium water/tropical fish importer	water
aquarium water/tropical fish importer	aquarium
ARAND VIEW FARMS	farm
Arugula	arugula greens (raw)
Atlantic Poultry; Chick Hatchery	poultry hatchery
Atlantic Shellfish Products	Atlantic shellfish food product
aviaire dinde	turkey
Avian Ingredients	
Avitech Farm	farm
Awash	park
Awash Park	park
AxisFarms	farm
BARBER	farm
BARBER FARM	farm
BARN - OVC	barn
Barn #1	barn
Barn #12	barn
Barn #2	barn
Barn #4	barn
Barn #5	barn
Barn #6	barn
Barn #6; McKinley Hatchery	barn
Barn #7	barn
Barn #7 Hatchery	barn
Barn #7 Hatchery	poultry hatchery
Barn #8	barn
Barn #9 Rows C&D	barn
BARN 1	barn
Barn 1&2	barn
Barn 1097a; 1-8	barn
Barn 1097a; 9-17	barn
Barn 1097a: top	barn
Barn 1A	barn
Barn 2	barn
Barn 3	barn
Barn 3&4	barn
Barn 6	barn
Barn 8	barn
Barn A	barn
Barn and belts	barn
Barn B	barn
BARN OVC	barn
Barn T.W #4	barn
Barn-Floor	barn
Barn-Pig	barn
BARN, ANIMAL HOSPITAL	barn
Barn/Enviromental	barn
Barn#10	barn
Barn#4	barn
Barn#54	barn
Barn#6	barn
Barn#7	barn
Barn#8	barn
Barn2, sample1	barn
Barn2, sample2	barn
Barn5	barn
Barn5 21417	barn
Barn6/7	barn
Barns 1&2	barn
Bean Sprouts	bean sprout
Beef-10	beef
Beef-11	beef
BEEF-12	beef
Beef-13	beef
Beef-14	beef
Beef-17	beef
Beef-21	beef
Beef-22	beef
Beef-23	beef
Beef-24	beef
Beef-33	beef
Beef-35	beef
Beef-38-2011	beef
Beef-43-2011	beef
Beef-5	beef
Beef-65	beef
Beef-7	beef
Beef-B1-2011	beef
Beef-B10-2009	beef
Beef-B10-2010	beef
Beef-B11-2009	beef
Beef-B11-2010	beef
Beef-B11-2011	beef
Beef-B11-2012	beef
Beef-B13-2011	beef
Beef-B15-2010	beef
Beef-B21-2010	beef
Beef-B22-2009	beef
Beef-B24-2010	beef
Beef-B26-2009	beef
Beef-B27-2010	beef
Beef-B32-2010	beef
Beef-B36-2010	beef
Beef-B37-2009	beef
Beef-B38-2010	beef
Beef-B38-2012	beef
Beef-B40-2010	beef
Beef-B40-2012	beef
Beef-B41-2009	beef
Beef-B43-2010	beef
Beef-B44-2009	beef
Beef-B47-2009	beef
Beef-B47-2010	beef
Beef-B47-2011	beef
Beef-B48-2009	beef
Beef-B49-2009	beef
Beef-B50-2010	beef
Beef-B51-2009	beef
Beef-B53-2011	beef
Beef-B54-2011	beef
Beef-B6-2009	beef
Beef-B6a-2009	beef
BEL ROYAL FARM	farm
Belt #7	belt
Belt #7 Hatchery	belt;poultry hatchery
Belt 1-3	belt
Belt 4-6	belt
Belts 4	belt
Belts 6	belt
Bergerie	sheep barn
Bergerie a Saint-Cuthbert	sheep barn
Bergerie a St-Barthelemy	sheep barn
Bergerie a St-Zenon-du-lac-Humqui	sheep barn
BERT FISHER FARM	farm
BERT FISWER	farm
BINNING FARM	farm
Biosolid	biosolids
Biosolid/Sludge	biosolids;sludge
BIRCH TREE FARM	farm
Bladder	urinary bladder
Blade Steak	
Body Fluid/Excretion	bodily fluid;excreta
Boiler Barn	broiler barn
Bootie	boot cover
Boots	boot  
Boucherie	butcher shop
Bourgeois Dumont Poultry Farm	farm
Bovine Ingredients	
Breast back off	breast (back off)
Breast cutlets	chicken breast cutlet
Breast Skinless	breast (skinless)
Breast skinless	breast (skinless)
Breast Skinless Boneless	breast (skinless, boneless)
Breast skinless boneless	breast (skinless, boneless)
Breast with Skin	breast (with skin)
Breast with skin	breast (with skin)
Breeder Operation	breeder farm
BURNBRAE FARMS LTD.	farm
Burnbrne Farm	farm
bursa of fabricus	bursa of Fabricius
Butchershop	butcher shop
Butternut Creek, Rte.800	creek
Cage	animal cage
Cage 2,Rm 62	animal cage
Cages	animal cage
Cages 1-2; Chick Hatchery; Pullet barn	poultry hatchery
Cages 1-2; Chick Hatchery; Pullet barn	animal cage
Cages 3; Chick Hatchery; Pullet barn	poultry hatchery
Cages 3; Chick Hatchery; Pullet barn	animal cage
Calgary Zoo	zoo
Camion (truck)	truck
Canagagigue Creek	creek
Canagugiue creek	creek
Cantaloupe	cantaloupe (whole or parts)
Cantelope	cantaloupe (whole or parts)
Carcass (whole)	carcass
Cardemom	cardamom
cattle Ground	beef (ground or minced)
cattle Ground ( lean)	beef (ground or minced, lean)
cattle Ground (Extra Lean)	beef (ground or minced, extra lean)
cattle Ground (extra-lan)	beef (ground or minced, extra lean)
cattle Ground (Extra-Lean)	beef (ground or minced, extra lean)
cattle Ground (Lean)	beef (ground or minced, lean)
cattle Ground (Medium)	beef (ground or minced, medium)
cattle Ground (Regular)	beef (ground or minced, regular)
cattle Ground (Sirloin)	beef (ground or minced, Sirloin)
cattle Ground Boneless	beef (ground or minced, boneless)
cattle Ground regular	beef (ground or minced, regular)
cattle Ground-Lean	beef (ground or minced, lean)
cattle Ground-Regular	beef (ground or minced, regular)
cattle ground( extra lean)	beef (ground or minced, extra lean)
cattle ground( medium)	beef (ground or minced, medium)
cattle Ground(Extra lean)	beef (ground or minced, extra lean)
cattle Ground(Lean)	beef (ground or minced, lean)
cattle Ground(medium)	beef (ground or minced, medium)
cattle ground(regular)	beef (ground or minced, regular)
cattle Groundextra lean)	beef (ground or minced, extra lean)
cattle rib chop	beef rib chop
cattle ribs	beef rib (meat cut) 
cattle roast	beef roast
cattle Shoulder	beef shoulder (meat cut)
cattle shoulder chop	beef shoulder chop (meat cut)
cattle Shoulder chop non-seasoned	beef shoulder chop (meat cut);food (non-seasoned)
cattle sirloin chop	beef sirloin chop (meat cut)
cattle strip	beef strip (meat cut)
cattle tender loin	beef tenderloin (meat cut)
cattle Tenderloin	beef tenderloin (meat cut)
Cavity Fluid (Unspecified)	bodily fluid
Cavity fluid unspecified	bodily fluid
Cecal Content	caecum;body cavity content
Cecum	caecum
Cereal/Bread/Snack	cereal;bread;snack food
Chia Seeds	chia seed (whole)
Chia Sprouts	chia sprout
Chick Boxes	chick box
Chick Pads	chick pad
chicken breast back off	chicken breast (back off)
chicken breast skinless	chicken breast (skinless)
chicken Breast skinless boneless	chicken breast (skinless, boneless)
chicken Breast with skin	chicken breast (with skin)
chicken Drumstick Skinless	chicken drumstick (skinless)
chicken Drumstick with Skin	chicken drumstick (with skin)
chicken Drumsticks	chicken drumstick
chicken Ground	chicken (ground or minced)
chicken Ground ( lean)	chicken (ground or minced, lean)
chicken Ground (Extra Lean)	chicken (ground or minced, extra lean)
chicken Ground (extra-lan)	chicken (ground or minced, extra lean)
chicken Ground (Extra-Lean)	chicken (ground or minced, extra lean)
chicken Ground (Lean)	chicken (ground or minced, lean)
chicken Ground (Medium)	chicken (ground or minced, medium)
chicken Ground (Regular)	chicken (ground or minced, regular)
chicken Ground Boneless	chicken (ground or minced, boneless)
chicken Ground regular	chicken (ground or minced, regular)
chicken Ground-Lean	chicken (ground or minced, lean)
chicken Ground-Regular	chicken (ground or minced, regular)
chicken ground( extra lean)	chicken (ground or minced, extra lean)
chicken ground( medium)	chicken (ground or minced, medium)
chicken Ground(Extra lean)	chicken (ground or minced, extra lean)
chicken Ground(Lean)	chicken (ground or minced, lean)
chicken Ground(medium)	chicken (ground or minced, medium)
chicken ground(regular)	chicken (ground or minced, regular)
chicken Groundextra lean)	chicken (ground or minced, extra lean)
chicken leg	chicken leg (meat cut)
chicken Leg with Skin-Drumstick and Thigh	chicken leg (with skin)
chicken necks	chicken neck (meat cut)
chicken nuggets	chicken nugget
chicken thigh	chicken thigh (meat cut)
chicken thigh skinless	chicken thigh (skinless)
chicken Thigh Skinless Boneless	chicken thigh (skinless, boneless)
chicken Thigh with skin	chicken thigh (with skin)
chicken Thigh with Skin	chicken thigh (with skin)
chicken Upper Thigh	chicken upper thigh (meat cut)
chicken Upper Thigh with Skin	chicken upper thigh (with skin)
chicken upper thight	chicken upper thigh (meat cut)
chicken Upperthigh	chicken upper thigh (meat cut)
chicken Wing	chicken wing (meat cut)
chicken Wings	chicken wing (meat cut)
Chickpea	chickpea (whole)
Chili	
Chilli Pepper	chili pepper
Chives	chive leaf (whole or parts)
Chops	chop
Cloacae	cloaca
Cloacal swab	cloaca;swab
Coconut	coconut (whole or parts)
Confections/Nuts/Condiments	
Contact plate	petri dish
Coriander Seeds	coriander seed (whole)
Coriander-Cumin Powder	coriander powder;cumin powder
Corn	corn (on-the-cob, kernel or parts)
Crates	crate
Cubes	cube
Cucumber	cucumber (whole or parts)
Culture Plate	petri dish
Cumin seeds	cumin seed
Curry Leaves	curry leaf
Curry powder	currey powder
Dairy	dairy product
Dead Haul Truck / Trailer	dead haul truck;dead haul trailer
Digestive System (Unspecified)	digestive system
Dill	dill spice
Drumstick	poultry drumstick
Drumstick Skinless	poultry drumstick (skinless)
Drumstick with Skin	poultry drumstick (with skin)
Drumsticks	poultry drumstick
Egg	egg or egg component
Egg Belt	egg belt;feces
Egg Flour	
Environment Swab	swab
Environment Swab (Hatchery)	hatchery;swab
Feed	animal feed
Feed and Ingredients	animal feed; animal feed ingredient 
Feed Pans	feed pan
Feeders and Drinkers	animal feeder;animal drinker
Fetal Tissue	fetus;tissue
Fetus/Embryo	fetus;embryo
Final Wash	rinse
Fish Ingredients	
Flax and Chia Powder	flax powder; chia powder
Fluff	poultry fluff
Fluff (Hatchery)	poultry fluff;hatchery
Food	
Fruits and Vegetables	fruit;vegetable
Gallbladder	gall bladder
Grain	bulk grain
Green onions	green onion
Ground	meat (ground)
Ground ( lean)	ground meat (lean)
Ground (Angus)	beef (ground or minced, Angus)
Ground (Extra Lean)	ground meat (extra lean)
Ground (extra lean)	ground meat (extra lean)
Ground (extra-lan)	ground meat (extra lean)
Ground (Extra-Lean)	ground meat (extra lean)
Ground (Lean)	ground meat (lean)
Ground (lean)	ground meat (lean)
Ground (Medium)	ground meat (medium)
Ground (medium)	ground meat (medium)
Ground (Regular)	ground meat (regular)
Ground (regular)	ground meat (regular)
Ground (Sirloin)	ground meat (Sirloin)
Ground Boneless	ground meat (boneless)
Ground extra lean	ground meat (extra lean)
ground pepper	pepper (ground)
Ground regular	ground meat (regular)
Ground Water	groundwater
Ground-Lean	ground meat (lean)
Ground-Regular	ground meat (regular)
ground( extra lean)	ground meat (extra lean)
ground( medium)	ground meat (medium)
Ground(Extra lean)	ground meat (extra lean)
Ground(Lean)	ground meat (lean)
Ground(medium)	ground meat (medium)
ground(regular)	ground meat (regular)
Groundextra lean)	ground meat (extra lean)
Growth / lesion (unspecified tissue)	tumour;lesion
Growth/Lesion (Unspecified Tissue)	tumour;lesion
Hazelnut / Filbert	hazelnut
Headcheese	head cheese
Herb/Spice (Unspecified)	spice or herb
Herb/spice (unspecified)	spice or herb
Herbs and Spices	spice or herb
In-Shell	poultry egg (whole, shell on)
Intestinal Contents	intestine;body cavity content
Irrigation	
Joint	skeletal joint
Joint Fluid	synovial fluid
Kale	kale leaf
Kalonji Whole Seed	kalonji seed
Lab Surface	
Laboratory	laboratory facility
Lay Ration	lay ration (animal feed)
Leg	leg (meat cut)
Leg with Skin-Drumstick and Thigh	leg (meat cut, with skin)
Levage/peritoneal	lavage;peritoneum
Levage/Tracheal	lavage;trachea
Liquid whole	
Litter	animal litter
Litter/Manure	animal litter;animal manure
Live Haul Truck/Trailer	live haul truck;live hail trailer
Loin Center Chop	loin centre chop
Loin center chop non-seasoned	loin centre chop;food (non-seasoned)
Mango	mango (whole or parts)
Meat	meat 
Meat Flour/Meal	meat meal
Mild italian style burger	beef hamburger (dish);Italian-style
Milk	milk, milk product or milk substitute
Milk/Colostrum	milk;colostrum
Mixed Food/Meat	mixed food;meat
Mixed Organs	organs or organ parts
Mixed Salad/Mixed Greens	salad;greens (raw)
Mixed Tissues	heterogeneous tissue
Mucous membrane (gut)	gastrointestinal system mucosa
Mucous membrane (resp)	respiratory system mucosa
Mung Bean Sprouts	mung bean sprout
Muscle	muscle organ
Muscle/Meat	muscle tissue;meat
Mushrooms	mushroom (whole or parts)
Nasal Turbinate	nasal turbinal
Nasal/Naries	pair of nares
Necks	neck (meat cut)
Nuggets	nugget
Organ Unspecified	organ
Organ/Tissue	organ;tissue
Other	
Other chicken	
Other cut	
Other cut (not ground)	
Other Cut (Not Ground)	
Other Cut Boneless	
Other Cut Boneless (Not Ground)	
Other variety meats	
Ovine Ingredients	
Papaya	papaya (whole or parts)
Pea Sprouts	pea sprout
Pea sprouts	pea sprout
Pepper	
Peritoneal Fluid	peritoneum;bodily fluid
Pet/Zoo	companion animal;zoo
pig Ground	pork (ground or minced)
pig Ground ( lean)	pork (ground or minced, lean)
pig Ground (Extra Lean)	pork (ground or minced, extra lean)
pig Ground (extra-lan)	pork (ground or minced, extra lean)
pig Ground (Extra-Lean)	pork (ground or minced, extra lean)
pig Ground (Lean)	pork (ground or minced, lean)
pig Ground (Medium)	pork (ground or minced, medium)
pig Ground (Regular)	pork (ground or minced, regular)
pig Ground (Sirloin)	pork (ground or minced, Sirloin)
pig Ground Boneless	pork (ground or minced, boneless)
pig Ground regular	pork (ground or minced, regular)
pig Ground-Lean	pork (ground or minced, lean)
pig Ground-Regular	pork (ground or minced, regular)
pig ground( extra lean)	pork (ground or minced, extra lean)
pig ground( medium)	pork (ground or minced, medium)
pig Ground(Extra lean)	pork (ground or minced, extra lean)
pig Ground(Lean)	pork (ground or minced, lean)
pig Ground(medium)	pork (ground or minced, medium)
pig ground(regular)	pork (ground or minced, regular)
pig Groundextra lean)	pork (ground or minced, extra lean)
pig rib chop	pork rib chop
pig roast	pork roast
pig Shoulder	pork shoulder (meat cut)
pig shoulder chop	pork shoulder chop (meat cut)
pig Shoulder chop non-seasoned	pork shoulder chop (meat cut);food (non-seasoned)
pig sirloin chop	pork sirloin chop (meat cut)
pig strip	pork strip (meat cut)
pig tender loin	pork tenderloin (meat cut)
pig Tenderloin	pork tenderloin (meat cut)
Plucking Water	poultry plucking water
Pooled Feces	feces;pooled sample
Porcine Ingredients	
Pork Chop (Cut Unknown)	pork chop
pork ribs	pork rib (meat cut) 
Premix	compound feed premix
Premix (Medicated)	compound feed premix (medicated)
Processed (Other)	
Rasam Powder Spice	rasam powder
Raw	food (raw)
Rectal Swab	rectum;swab
Ribs	meat (ribs)
River Surface	river;water surface
Roast	meat (roasted)
Run Off	surface runoff
Sausage (Pepper)	
Scallopini	scallopini squash (whole or parts)
Shelf / Sill	shelf;window sill
Shell egg	hen egg (whole)
Shell on	poultry egg (shell on)
Shelled	
Shoulder	shoulder (meat cut)
Shoulder Chop	shoulder chop (meat cut)
Shoulder chop non-seasoned	shoulder chop (meat cut);food (non-seasoned)
Sinus	paranasal sinus
Sirloin Chop	sirloin chop (meat cut)
Skin	skin of body
Soft	food (soft)
Soya Meal	
Soyabean Meal	soybean meal
Soybean	soybean  
Sprouted Seeds	germinated or sprouted seed
Sprouts	sprout
Starter Ration	starter ration (animal feed)
Steak	meat (steak)
Stew Chunks	beef stew chunk
Stomach Contents	stomach;body cavity content
Stool	feces
Strip	strip (meat cut)
Supermarket - A; Retail outlet	supermarket
Supermarket - B; Retail outlet	supermarket
Supermarket - C; Retail outlet	supermarket
Supermarket - D; Retail outlet	supermarket
Supermarket - E; Retail outlet	supermarket
Supermarket - F; Retail outlet	supermarket
Supermarket - G; Retail outlet	supermarket
Supermarket - H; Retail outlet	supermarket
Supermarket - I	supermarket
Surface - Other	built environment surface
Surface - River	river;water surface
Surface unspecified	built environment surface
Swab (Nasal)	nose;swab
Swab (Rectal)	rectum;swab
Swab (Tissue Fluid-Unspecified)	tissue;bodily fluid;swab
Swab #3	swab
Swab #5	swab
Swab 1	swab
Swab 2	swab
Swab 3	swab
Swab 4	swab
T. high	thigh (meat cut)
Tender loin	tenderloin (meat cut)
Tenderloin	tenderloin (meat cut)
Testicle	testis
Thigh	poultry thigh (meat cut)
Thigh Skinless	poultry thigh (skinless)
Thigh Skinless Boneless	poultry thigh (skinless, boneless)
Thigh with skin	poultry thigh (with skin)
Thigh with Skin	poultry thigh (with skin)
Thorax	thoracic segment of trunk
Tomato	tomato (whole or parts)
Trim	meat trim
Truck / Trailer	truck;trailer
Truck/Trailer	truck;trailer
turkey breast back off	turkey breast (back off)
turkey breast skinless	turkey breast (skinless)
turkey Breast skinless boneless	turkey breast (skinless, boneless)
turkey Breast with skin	turkey breast (with skin)
turkey Drumstick Skinless	turkey drumstick (skinless)
turkey Drumstick with Skin	turkey drumstick (with skin)
turkey Drumsticks	turkey drumstick
turkey Ground	turkey (ground or minced)
turkey Ground ( lean)	turkey (ground or minced, lean)
turkey Ground (Extra Lean)	turkey (ground or minced, extra lean)
turkey Ground (extra-lan)	turkey (ground or minced, extra lean)
turkey Ground (Extra-Lean)	turkey (ground or minced, extra lean)
turkey Ground (Lean)	turkey (ground or minced, lean)
turkey Ground (Medium)	turkey (ground or minced, medium)
turkey Ground (Regular)	turkey (ground or minced, regular)
turkey Ground Boneless	turkey (ground or minced, boneless)
turkey Ground regular	turkey (ground or minced, regular)
turkey Ground-Lean	turkey (ground or minced, lean)
turkey Ground-Regular	turkey (ground or minced, regular)
turkey ground( extra lean)	turkey (ground or minced, extra lean)
turkey ground( medium)	turkey (ground or minced, medium)
turkey Ground(Extra lean)	turkey (ground or minced, extra lean)
turkey Ground(Lean)	turkey (ground or minced, lean)
turkey Ground(medium)	turkey (ground or minced, medium)
turkey ground(regular)	turkey (ground or minced, regular)
turkey Groundextra lean)	turkey (ground or minced, extra lean)
turkey leg	turkey leg (meat cut)
turkey Leg with Skin-Drumstick and Thigh	turkey leg (with skin)
turkey necks	turkey neck (meat cut)
turkey nuggets	turkey nugget
turkey thich skinless	turkey thigh (skinless)
turkey thigh	turkey thigh (meat cut)
turkey Thigh Skinless Boneless	turkey thigh (skinless, boneless)
turkey Thigh with skin	turkey thigh (with skin)
turkey Thigh with Skin	turkey thigh (with skin)
turkey Upper Thigh	turkey upper thigh (meat cut)
turkey Upper Thigh with Skin	turkey upper thigh (with skin)
turkey upper thight	turkey upper thigh (meat cut)
turkey Upperthigh	turkey upper thigh (meat cut)
turkey Wing	turkey wing (meat cut)
turkey Wings	turkey wing (meat cut)
Unknown Food	
Unknown Meal	meal (animal feed)
Unknown organ	organ
Unknown Surface	built environment surface
Unspecified Feed/Ingredient	
Unspecified Food	
Unspecified Organ/Tissue	organ
Upper Thigh	poultry upper thigh (meat cut)
Upper Thigh with Skin	poultry upper thigh (with skin)
upper thight	poultry upper thigh (meat cut)
Upperthigh	upper thigh (meat cut)
Vegetable/Spice	
Wall	building wall
Wallnut	walnut (whole or parts)
Walls	building wall
Walnut	walnut (whole or parts)
Waste Water	wastewater
Watering Bowl/Equipment	watering bowl 
Watering bowl/equipment	watering bowl 
Weep	weep fluid
Whole	
Whole Carcass	carcass
Whole with Skin	
Wing	poultry wing (meat cut)
Wings	poultry wing (meat cut)
Working Surface	built environment surface
Yolk	egg yolk`;

/**
 * Initialize lookup table for categorizing normalized terms into one or
 * more target fields and corresponding ontology ids: term -> target field,
 * ontology id.
 */
var initCategory = () => {
	let category = {};
  for (const line of CATEGORY.split('\n')) {
    let [field, term, ontology_id] = line.split('\t').map(function(e){return e.trim();});
    let record = {
    		'field': 				field,			// GRDI target export field
    		'ontology_id': 	ontology_id	// pertinent ontology term
    };

    if (term in category)
    	category[term].push(record)
    else 
    	category[term] = [record];
  }
  //console.log(category);
  return category;
}
/************************************************
  Cut & paste from GRDI ONTO ID tab of DataHarmonizer Templates: 
  https://docs.google.com/spreadsheets/d/1jPQAIJcL_xa3oBVFEsYRGLGf7ESTOwzsTSjKZ-0CTYE/ 
  MUST BE TAB DELIMITED!
*/
var CATEGORY = `anatomical_material	blood	UBERON_0000178
anatomical_material	bodily fluid	UBERON_0006314
anatomical_material	body cavity content	FMA_260456
anatomical_material	bone marrow	UBERON_0002371
anatomical_material	colostrum	UBERON_0001914
anatomical_material	excreta	UBERON_0000174
anatomical_material	heterogeneous tissue	UBERON_0015757
anatomical_material	lesion	NCIT_C3824
anatomical_material	milk	UBERON_0001913
anatomical_material	mucus	UBERON_0000912
anatomical_material	synovial fluid	UBERON_0001090
anatomical_material	tissue	UBERON_0000479
anatomical_material	tumour	MONDO_0005070
anatomical_part	abdomen	UBERON_0000916
anatomical_part	abomasum	UBERON_0007358
anatomical_part	abscess	HP_0025615
anatomical_part	air sac	UBERON_0009060
anatomical_part	anal gland	UBERON_0011253
anatomical_part	blood vessel	UBERON_0001981
anatomical_part	bone	UBERON_0001474
anatomical_part	brain	UBERON_0000955
anatomical_part	bursa of Fabricius	UBERON_0003903
anatomical_part	caecum	UBERON_0001153
anatomical_part	carcass	UBERON_0008979
anatomical_part	cloaca	UBERON_0000162
anatomical_part	colon	UBERON_0001155
anatomical_part	digestive system	UBERON_0001007
anatomical_part	duodenum	UBERON_0002114
anatomical_part	ear	UBERON_0001690
anatomical_part	embryo	UBERON_0000922
anatomical_part	esophagus	UBERON_0001043
anatomical_part	eye	UBERON_0000970
anatomical_part	fetus	UBERON_0000323
anatomical_part	foot	UBERON_0002387
anatomical_part	gall bladder	UBERON_0002110
anatomical_part	ganglion	UBERON_0000045
anatomical_part	gastrointestinal system mucosa	UBERON_0004786
anatomical_part	gizzard	UBERON_0005052
anatomical_part	heart	UBERON_0000948
anatomical_part	ileum	UBERON_0002116
anatomical_part	intestine	UBERON_0000160
anatomical_part	jejunum	UBERON_0002115
anatomical_part	kidney	UBERON_0002113
anatomical_part	liver	UBERON_0002107
anatomical_part	lung	UBERON_0002048
anatomical_part	lymph node	UBERON_0000029
anatomical_part	mesenteric lymph node	UBERON_0002509
anatomical_part	mouth	UBERON_0000165
anatomical_part	muscle of abdomen	UBERON_0002378
anatomical_part	muscle organ	UBERON_0001630
anatomical_part	nasal turbinal	UBERON_0035612
anatomical_part	nose	UBERON_0000004
anatomical_part	organ	UBERON_0000062
anatomical_part	organs or organ parts	GENEPIO_0001117
anatomical_part	ovary	UBERON_0000992
anatomical_part	oviduct	UBERON_0000993
anatomical_part	pair of nares	UBERON_0002109
anatomical_part	paranasal sinus	UBERON_0001825
anatomical_part	pericardium	UBERON_0002407
anatomical_part	peritoneum	UBERON_0002358
anatomical_part	placenta	UBERON_0001987
anatomical_part	pleura	UBERON_0000977
anatomical_part	rectum	UBERON_0001052
anatomical_part	respiratory system mucosa	UBERON_0004785
anatomical_part	rumen	UBERON_0007365
anatomical_part	shell	UBERON_0006612
anatomical_part	skeletal joint	UBERON_0000982
anatomical_part	skin of body	UBERON_0002097
anatomical_part	small intestine	UBERON_0002108
anatomical_part	spinal cord	UBERON_0002240
anatomical_part	spleen	UBERON_0002106
anatomical_part	stomach	UBERON_0000945
anatomical_part	testis	UBERON_0000473
anatomical_part	thoracic segment of trunk	UBERON_0000915
anatomical_part	trachea	UBERON_0003126
anatomical_part	urinary bladder	UBERON_0001255
anatomical_part	uterus	UBERON_0000995
anatomical_part	vagina	UBERON_0000996
anatomical_part	yolk sac	UBERON_0001040
animal_or_plant_population	crop	AGRO_00000325
animal_or_plant_population	tropical fish	
body_product	feces	UBERON_0001988
body_product	meconium	UBERON_0007109
body_product	urine	UBERON_0001088
collection method	rinse	GENEPIO_0002749
collection_device	petri dish	MICRO_0001594
collection_device	swab	OBI_0002820
collection_method	lavage	OBI_0600044
environmental_material	animal drinker	
environmental_material	animal feeder 	
environmental_material	animal litter	ENVO_00002191
environmental_material	animal manure	ENVO_00003031
environmental_material	aquarium	ENVO_00002196
environmental_material	belt	NCIT_C49844
environmental_material	biosolids	ENVO_00002059
environmental_material	bird feeder	
environmental_material	boot  	
environmental_material	boot cover	OBI_0002806
environmental_material	broom	
environmental_material	bulk tank	
environmental_material	chick box	
environmental_material	chick pad	
environmental_material	compost	ENVO_00002170
environmental_material	crate	
environmental_material	dumpster	
environmental_material	dust	ENVO_00002008
environmental_material	effluent	
environmental_material	egg belt	
environmental_material	equipment	
environmental_material	fan	NCIT_C49947
environmental_material	fecal slurry	
environmental_material	feed pan	
environmental_material	freezer handle	
environmental_material	groundwater	ENVO_01001004
environmental_material	plucking belt	
environmental_material	poultry fluff	UBERON_0008291
environmental_material	poultry plucking water	
environmental_material	sediment	ENVO_00002007
environmental_material	shelf	
environmental_material	sludge	ENVO_00002044
environmental_material	soil	ENVO_00001998
environmental_material	surface runoff	
environmental_material	surface water	ENVO_00002042
environmental_material	transformer	
environmental_material	wastewater	ENVO_00002001
environmental_material	water	CHEBI_15377
environmental_material	watering bowl 	
environmental_material	weep fluid	
environmental_site	abattoir	ENVO_01000925
environmental_site	air intake	
environmental_site	animal cage	ENVO_01000922
environmental_site	animal pen	
environmental_site	artificial wetland	
environmental_site	barn	EOL_0001898
environmental_site	biodome	
environmental_site	breeder barn	
environmental_site	breeder farm	
environmental_site	broiler barn	
environmental_site	building	ENVO_00000073
environmental_site	building wall	ENVO_01000465
environmental_site	built environment surface	
environmental_site	butcher shop	
environmental_site	cottage	
environmental_site	countertop	
environmental_site	creek	
environmental_site	dairy	ENVO_00003862
environmental_site	dead haul trailer	
environmental_site	dead haul truck	
environmental_site	farm	ENVO_00000078
environmental_site	fish farm	ENVO_00000294
environmental_site	floor	ENVO_01000486
environmental_site	hatchery	ENVO_01001873
environmental_site	hospital	ENVO_00002173
environmental_site	laboratory facility	ENVO_01001406
environmental_site	lake	ENVO_00000020
environmental_site	live hail trailer	
environmental_site	live haul truck	
environmental_site	manure pit	ENVO_01001872
environmental_site	park	ENVO_00000562
environmental_site	pet store	
environmental_site	pigsty	
environmental_site	poultry hatchery	ENVO_01001874
environmental_site	river	ENVO_00000022
environmental_site	sheep barn	
environmental_site	shop	ENVO_00002221
environmental_site	stall	EOL_0001903
environmental_site	supermarket	NCIT_C18066
environmental_site	trailer	
environmental_site	truck	ENVO_01000602
environmental_site	water surface	ENVO_01001191
environmental_site	window sill	
environmental_site	zoo	ENVO_00010625
food_product	brisket	FOODON_03530020
food_product	alfalfa sprout	FOODON_00002670
food_product	almond	FOODON_00003523
food_product	animal feed	ENVO_02000047
food_product	apple	FOODON_00002473
food_product	arugula greens (raw)	FOODON_00002426
food_product	Atlantic shellfish food product	
food_product	back	
food_product	balut	FOODON_03302184
food_product	basil	FOODON_00003044
food_product	bean sprout	FOODON_00002576
food_product	beef	FOODON_00001041
food_product	beef hamburger (dish)	FOODON_00002737
food_product	beef stew chunk	
food_product	black pepper	FOODON_00001650
food_product	blood meal	FOODON_00001564
food_product	bone meal	ENVO_02000054
food_product	bread	FOODON_00001183
food_product	breast	
food_product	breast (back off)	
food_product	breast (skinless, boneless)	
food_product	breast (skinless)	
food_product	breast (with skin)	
food_product	bulk grain	FOODON_03309390
food_product	burger	
food_product	canola meal	FOODON_00002694
food_product	cantaloupe	FOODON_00003577
food_product	cardamom	FOODON_00001683
food_product	carinata meal	
food_product	cereal	FOODON_00001709
food_product	cheese	FOODON_00001013
food_product	chia powder	
food_product	chia seed (whole)	FOODON_00002961
food_product	chia sprout	
food_product	chicken breast cutlet	
food_product	chicken nugget	FOODON_00002672
food_product	chickpea (whole)	FOODON_03306811
food_product	chili pepper	FOODON_03315873
food_product	chive leaf (whole or parts)	
food_product	chop	
food_product	coconut (whole or parts)	FOODON_03309861
food_product	complete feed	
food_product	compound feed premix	
food_product	compound feed premix (medicated)	
food_product	coriander	FOODON_00001763
food_product	coriander powder	
food_product	coriander seed (whole)	
food_product	corn (on-the-cob, kernel or parts)	FOODON_03310791
food_product	cucumber (whole or parts)	
food_product	cumin powder	
food_product	cumin seed	FOODON_00003396
food_product	curry leaf	
food_product	curry powder	FOODON_03301842
food_product	cutlet	FOODON_00003001
food_product	dairy product	
food_product	dietary supplement	FOODON_03401298
food_product	dill spice	FOODON_03310090
food_product	egg or egg component	FOODON_03420194
food_product	egg yolk	UBERON_0007378
food_product	feather meal	
food_product	fennel	FOODON_03309953
food_product	filet	FOODON_03530144
food_product	fish meal	FOODON_03301620
food_product	flax powder	
food_product	flax powder; chia powder	
food_product	food (ground)	FOODON_00002713
food_product	fruit	FOODON_03315615
food_product	garlic powder	FOODON_03301844
food_product	germinated or sprouted seed	FOODON_03420102
food_product	ginger	FOODON_00001901
food_product	green onion	FOODON_00002695
food_product	greens (raw)	FOODON_03310765
food_product	ground beef (Angus)	
food_product	ground beef (Sirloin)	
food_product	ground meat (boneless)	
food_product	ground meat (extra lean)	
food_product	ground meat (lean)	
food_product	ground meat (medium)	
food_product	ground meat (regular)	
food_product	ham	FOODON_00002502
food_product	hazelnut	FOODON_00002933
food_product	head cheese	FOODON_03315658
food_product	hen egg (whole)	FOODON_03316061
food_product	hummus	FOODON_00003049
food_product	kale leaf	FOODON_00003501
food_product	kalonji seed	
food_product	lay ration (animal feed)	
food_product	leg (poultry meat cut, with skin)	
food_product	leg (poultry meat cut)	
food_product	lettuce	FOODON_00001998
food_product	liver	UBERON_0002107
food_product	loin centre chop	
food_product	mango	FOODON_00002020
food_product	meal (animal feed)	
food_product	meat	FOODON_00001006
food_product	meat (ribs)	
food_product	meat (roasted)	
food_product	meat (steak)	
food_product	meat and bone meal	FOODON_00002738
food_product	meat meal	
food_product	meat trim	FOODON_03309475
food_product	milk, milk product or milk substitute	
food_product	mint	FOODON_00002432
food_product	mixed food	
food_product	mixed sprouts	
food_product	mung bean sprout	FOODON_03301446
food_product	muscle tissue	UBERON_0002385
food_product	mushroom (whole or parts)	
food_product	mutton	FOODON_00002912
food_product	neck (poultry meat cut)	FOODON_03530294
food_product	oregano	FOODON_00002073
food_product	papaya (whole or parts)	
food_product	paprika	FOODON_03301105
food_product	parsley	FOODON_00002084
food_product	pea sprout	
food_product	peanut butter	FOODON_03306867
food_product	pepper (ground)	FOODON_03301526
food_product	pepper powder	
food_product	pepperoni	FOODON_03311003
food_product	pet food	FOODON_00002682
food_product	pork chop	FOODON_00001049
food_product	poultry drumstick	FOODON_00003469
food_product	poultry drumstick (skinless)	
food_product	poultry drumstick (with skin)	
food_product	poultry egg (shell on)	
food_product	poultry egg (whole, shell on)	
food_product	rasam powder	
food_product	red veal	
food_product	rib chop	
food_product	sage	FOODON_00002217
food_product	salad	FOODON_03316042
food_product	salami	FOODON_03312067
food_product	sausage	FOODON_00001007
food_product	scallopini squash (whole or parts)	
food_product	sesame seed	FOODON_03310306
food_product	shellfish	FOODON_03411433
food_product	shoulder (meat cut)	FOODON_03530043
food_product	shoulder chop	
food_product	sirloin chop	
food_product	skim milk powder	
food_product	snack food	FOODON_03315013
food_product	soybean	FOODON_03301415
food_product	soybean meal	FOODON_03302757
food_product	spice or herb	FOODON_00001242
food_product	spinach	FOODON_00002269
food_product	sprout	FOODON_03420183
food_product	starter ration (animal feed)	
food_product	strip (meat cut)	
food_product	tahini	FOODON_03304154
food_product	tenderloin (meat cut)	
food_product	thigh (meat cut)	
food_product	thigh (skinless, boneless)	
food_product	thigh (skinless)	
food_product	thigh (with skin)	
food_product	tomato (whole or parts)	
food_product	turkey	FOODON_03414166
food_product	turmeric	FOODON_00002323
food_product	upper thigh (meat cut)	
food_product	upper thigh (with skin)	
food_product	veal	FOODON_00003083
food_product	vegetable	FOODON_00001261
food_product	walnut (whole or parts)	
food_product	white pepper	FOODON_00002361
food_product	white veal	
food_product	wing (poultry meat cut)	FOODON_03530157
food_product	yeast	FOODON_03411345
food_product_properties	cube	
food_product_properties	cut	
food_product_properties	food (non-seasoned)	
food_product_properties	food (raw)	FOODON_03311126
food_product_properties	food (soft)	
food_product_properties	Italian-style	
host (common name)	companion animal	
host_developmental_stage	fetus	UBERON_0000323
sample_processing	pooled sample	NCIT_C45910`;

