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

  let preserveCapsFields = [
  	'geo_loc_name (country)',
  	'geo_loc_name (state/province/region)',
  	'sequenced_by_institution_name',
  	'sequenced_by_laboratory_name',
  	'sequenced_by_contact_name'];

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
    let RuleDB = setRuleDB(inputRow, sourceFields, sourceFieldNameMap, normalize, category, preserveCapsFields);

    const outputRow = [];
    for (const headerName of ExportHeaders.keys()) {

      // If Export Header field is in RuleDB, set output value from it, and
      // continue.
      // Sometimes fields have been set to 0 length.
      if ((headerName in RuleDB) && RuleDB[headerName] || RuleDB[headerName] === null) {
        let value = RuleDB[headerName];
        if (value !== null)
      		value = map_ontology(value, category, headerName);
        outputRow.push(value);
        continue;
      };

      // Otherwise apply source (many to one) to target field transform:
      const sources = ExportHeaders.get(headerName);
      let value = getMappedField(headerName, inputRow, sources, sourceFields, sourceFieldNameMap, ';', 'GRDI');
      // semicolon-separated list of values.  Issue is terms have come from other source fields. 
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
    label = label.trim();
    let lookup = label.toLowerCase();
    // Otherwise it may be a compound term
    if (lookup in category) {
      if (category[lookup]) {
        label += ': ' + category[lookup];
        break;
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
var setRuleDB = (dataRow, sourceFields, sourceFieldNameMap, normalize, category,preserveCapsFields) => {

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

  for (let sourceField of Object.keys(RuleDB)) {
  	if (RuleDB[sourceField])
  		RuleDB[sourceField] = RuleDB[sourceField].toLowerCase();
 	};

/*
  for (let sourceField of ruleSourceFieldNames) {
  	// All terms get lowercased in GRDI.
  	if (RuleDB[sourceField]) {
	  	let term = RuleDB[sourceField];

	  	if (term in normalize) {
	  		console.log('setting',sourceField,RuleDB[sourceField],'->',normalize[term].join(';'))
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
	  				if (normal_obj.field in RuleDB)
	  					//if (RuleDB[normal_obj.field].indexOf(normalized_term) == -1)
	  					add_item(RuleDB,normal_obj.field, normalized_term);
								//RuleDB[normal_obj.field] = normalized_term;  
					}
	  		}
	  	}

  	}
  }
*/
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
      RuleDB['host (common name)'] = null; //wHY ISNT THIS WORKING???

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

      let merged = RuleDB.food_product.replace('; ',' ');
      if (merged in normalize) {
      	RuleDB.food_product = normalize[merged].join(';');
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
var NORMALIZE = `-20°c freezer handle, rm 252	freezer handle
"pigsty	pigsty
(pigsty) a l'engrais	pigsty
(pigsty) porcherie	pigsty
(reprod) farm baril	farm
(reprod) farm basil	farm
(reprod) farm dan marc	farm
(reprod) farm martineau	farm
(reprod) farm martinenu	farm
(reprod) farm mercier & allard	farm
(reprod) farm ramsay	farm
(reprod) farm val-rainville	farm
(reprod) ferme martineau	farm
(reprod) ferme mercier & allard	farm
(reprod) ferme rainville	farm
(reprod)farm martineau	farm
(reprod)farm ramsay	farm
#1barn 2	barn
#1barn 3	barn
#4barn 3,salm1	barn
#4barn 3,salm2	barn
1/2 breast	
10#56 hatchery	hatchery
2-barn 8	barn
2-barn-5	barn
2006 barn #1	barn
2007 barn #c	barn
3-barn 6	barn
3-barn-6	barn
a.a. abattoir	abattoir
abattior	abattoir
abattoir af	abattoir
abattoir ah	abattoir
abattoir ah-02	abattoir
abattoir al	abattoir
abattoir al	abattoir
abattoir b	abattoir
abattoir d-02	abattoir
abattoir dd-02	abattoir
abattoir g-02	abattoir
abattoir o	abattoir
abbatoir	abattoir
abbatoire	abattoir
abbattoir	abattoir
abdominal muscle	muscle of abdomen
acre t	farm
acre t farms	farm
acre-t	farm
air inlet	air intake
air intake	air intake 
alfalfa sprouts	alfalfa sprout
alfalfa sprouts	alfalfa sprout
allen's fisheries	fish farm
ambo hospital	hospital 
amr abattoir al	abattoir
amr abattoir dd	abattoir
amr-abattoir	abattoir
amr-abattoir-ah	abattoir
amr-abattoir-b	abattoir
animalerie (canari)	pet store
animalerie, aquariums.	pet store
animalerie, aquariums.	aquarium
animalerie, comptoir	pet store
animalerie, comptoir	countertop
apple	apple (whole or parts)
aquarium water/tropical fish importer	shop
aquarium water/tropical fish importer	tropical fish
aquarium water/tropical fish importer	water
aquarium water/tropical fish importer	aquarium
arand view farms	farm
arugula	arugula greens (raw)
atlantic poultry; chick hatchery	poultry hatchery
atlantic shellfish products	Atlantic shellfish food product
aviaire dinde	turkey
avian ingredients	
avitech farm	farm
awash	park
awash park	park
axisfarms	farm
barber	farm
barber farm	farm
barn - ovc	barn
barn #1	barn
barn #12	barn
barn #2	barn
barn #4	barn
barn #5	barn
barn #6	barn
barn #6; mckinley hatchery	barn
barn #7	barn
barn #7 hatchery	barn
barn #7 hatchery	poultry hatchery
barn #8	barn
barn #9 rows c&d	barn
barn 1	barn
barn 1&2	barn
barn 1097a; 1-8	barn
barn 1097a; 9-17	barn
barn 1097a: top	barn
barn 1a	barn
barn 2	barn
barn 3	barn
barn 3&4	barn
barn 6	barn
barn 8	barn
barn a	barn
barn and belts	barn
barn b	barn
barn ovc	barn
barn t.w #4	barn
barn-floor	barn
barn-pig	barn
barn, animal hospital	barn
barn/enviromental	barn
barn#10	barn
barn#4	barn
barn#54	barn
barn#6	barn
barn#7	barn
barn#8	barn
barn2, sample1	barn
barn2, sample2	barn
barn5	barn
barn5 21417	barn
barn6/7	barn
barns 1&2	barn
bean sprouts	bean sprout
beef-10	beef
beef-11	beef
beef-12	beef
beef-13	beef
beef-14	beef
beef-17	beef
beef-21	beef
beef-22	beef
beef-23	beef
beef-24	beef
beef-33	beef
beef-35	beef
beef-38-2011	beef
beef-43-2011	beef
beef-5	beef
beef-65	beef
beef-7	beef
beef-b1-2011	beef
beef-b10-2009	beef
beef-b10-2010	beef
beef-b11-2009	beef
beef-b11-2010	beef
beef-b11-2011	beef
beef-b11-2012	beef
beef-b13-2011	beef
beef-b15-2010	beef
beef-b21-2010	beef
beef-b22-2009	beef
beef-b24-2010	beef
beef-b26-2009	beef
beef-b27-2010	beef
beef-b32-2010	beef
beef-b36-2010	beef
beef-b37-2009	beef
beef-b38-2010	beef
beef-b38-2012	beef
beef-b40-2010	beef
beef-b40-2012	beef
beef-b41-2009	beef
beef-b43-2010	beef
beef-b44-2009	beef
beef-b47-2009	beef
beef-b47-2010	beef
beef-b47-2011	beef
beef-b48-2009	beef
beef-b49-2009	beef
beef-b50-2010	beef
beef-b51-2009	beef
beef-b53-2011	beef
beef-b54-2011	beef
beef-b6-2009	beef
beef-b6a-2009	beef
bel royal farm	farm
belt #7	belt
belt #7 hatchery	belt;poultry hatchery
belt 1-3	belt
belt 4-6	belt
belts 4	belt
belts 6	belt
bergerie	sheep barn
bergerie a saint-cuthbert	sheep barn
bergerie a st-barthelemy	sheep barn
bergerie a st-zenon-du-lac-humqui	sheep barn
bert fisher farm	farm
bert fiswer	farm
binning farm	farm
biosolid	biosolids
biosolid/sludge	biosolids;sludge
birch tree farm	farm
bladder	urinary bladder
blade steak	
body fluid/excretion	bodily fluid;excreta
boiler barn	broiler barn
bootie	boot cover
boots	boot  
boucherie	butcher shop
bourgeois dumont poultry farm	farm
bovine ingredients	
breast back off	breast (back off)
breast cutlets	chicken breast cutlet
breast skinless	breast (skinless)
breast skinless	breast (skinless)
breast skinless boneless	breast (skinless, boneless)
breast skinless boneless	breast (skinless, boneless)
breast with skin	breast (with skin)
breast with skin	breast (with skin)
breeder operation	breeder farm
burnbrae farms ltd.	farm
burnbrne farm	farm
bursa of fabricus	bursa of Fabricius
butchershop	butcher shop
butternut creek, rte.800	creek
cage	animal cage
cage 2,rm 62	animal cage
cages	animal cage
cages 1-2; chick hatchery; pullet barn	poultry hatchery
cages 1-2; chick hatchery; pullet barn	animal cage
cages 3; chick hatchery; pullet barn	poultry hatchery
cages 3; chick hatchery; pullet barn	animal cage
calgary zoo	zoo
camion (truck)	truck
canagagigue creek	creek
canagugiue creek	creek
cantaloupe	cantaloupe (whole or parts)
cantelope	cantaloupe (whole or parts)
carcass (whole)	carcass
cardemom	cardamom
cattle ground	beef (ground or minced)
cattle ground ( lean)	beef (ground or minced, lean)
cattle ground (extra lean)	beef (ground or minced, extra lean)
cattle ground (extra-lan)	beef (ground or minced, extra lean)
cattle ground (extra-lean)	beef (ground or minced, extra lean)
cattle ground (lean)	beef (ground or minced, lean)
cattle ground (medium)	beef (ground or minced, medium)
cattle ground (regular)	beef (ground or minced, regular)
cattle ground (sirloin)	beef (ground or minced, Sirloin)
cattle ground boneless	beef (ground or minced, boneless)
cattle ground regular	beef (ground or minced, regular)
cattle ground-lean	beef (ground or minced, lean)
cattle ground-regular	beef (ground or minced, regular)
cattle ground( extra lean)	beef (ground or minced, extra lean)
cattle ground( medium)	beef (ground or minced, medium)
cattle ground(extra lean)	beef (ground or minced, extra lean)
cattle ground(lean)	beef (ground or minced, lean)
cattle ground(medium)	beef (ground or minced, medium)
cattle ground(regular)	beef (ground or minced, regular)
cattle groundextra lean)	beef (ground or minced, extra lean)
cattle rib chop	beef rib chop
cattle ribs	beef rib (meat cut) 
cattle roast	beef roast
cattle shoulder	beef shoulder (meat cut)
cattle shoulder chop	beef shoulder chop (meat cut)
cattle shoulder chop non-seasoned	beef shoulder chop (meat cut);food (non-seasoned)
cattle sirloin chop	beef sirloin chop (meat cut)
cattle strip	beef strip (meat cut)
cattle tender loin	beef tenderloin (meat cut)
cattle tenderloin	beef tenderloin (meat cut)
cavity fluid (unspecified)	bodily fluid
cavity fluid unspecified	bodily fluid
cecal content	caecum;body cavity content
cecum	caecum
cereal/bread/snack	cereal;bread;snack food
chia seeds	chia seed (whole)
chia sprouts	chia sprout
chick boxes	chick box
chick pads	chick pad
chicken breast back off	chicken breast (back off)
chicken breast skinless	chicken breast (skinless)
chicken breast skinless boneless	chicken breast (skinless, boneless)
chicken breast with skin	chicken breast (with skin)
chicken drumstick skinless	chicken drumstick (skinless)
chicken drumstick with skin	chicken drumstick (with skin)
chicken drumsticks	chicken drumstick
chicken ground	chicken (ground or minced)
chicken ground ( lean)	chicken (ground or minced, lean)
chicken ground (extra lean)	chicken (ground or minced, extra lean)
chicken ground (extra-lan)	chicken (ground or minced, extra lean)
chicken ground (extra-lean)	chicken (ground or minced, extra lean)
chicken ground (lean)	chicken (ground or minced, lean)
chicken ground (medium)	chicken (ground or minced, medium)
chicken ground (regular)	chicken (ground or minced, regular)
chicken ground boneless	chicken (ground or minced, boneless)
chicken ground regular	chicken (ground or minced, regular)
chicken ground-lean	chicken (ground or minced, lean)
chicken ground-regular	chicken (ground or minced, regular)
chicken ground( extra lean)	chicken (ground or minced, extra lean)
chicken ground( medium)	chicken (ground or minced, medium)
chicken ground(extra lean)	chicken (ground or minced, extra lean)
chicken ground(lean)	chicken (ground or minced, lean)
chicken ground(medium)	chicken (ground or minced, medium)
chicken ground(regular)	chicken (ground or minced, regular)
chicken groundextra lean)	chicken (ground or minced, extra lean)
chicken leg	chicken leg (meat cut)
chicken leg with skin-drumstick and thigh	chicken leg (with skin)
chicken necks	chicken neck (meat cut)
chicken nuggets	chicken nugget
chicken thigh	chicken thigh (meat cut)
chicken thigh skinless	chicken thigh (skinless)
chicken thigh skinless boneless	chicken thigh (skinless, boneless)
chicken thigh with skin	chicken thigh (with skin)
chicken thigh with skin	chicken thigh (with skin)
chicken upper thigh	chicken upper thigh (meat cut)
chicken upper thigh with skin	chicken upper thigh (with skin)
chicken upper thight	chicken upper thigh (meat cut)
chicken upperthigh	chicken upper thigh (meat cut)
chicken wing	chicken wing (meat cut)
chicken wings	chicken wing (meat cut)
chickpea	chickpea (whole)
chili	
chilli pepper	chili pepper
chives	chive leaf (whole or parts)
chops	chop
cloacae	cloaca
cloacal swab	cloaca;swab
coconut	coconut (whole or parts)
confections/nuts/condiments	
contact plate	petri dish
coriander seeds	coriander seed (whole)
coriander-cumin powder	coriander powder;cumin powder
corn	corn (on-the-cob, kernel or parts)
crates	crate
cubes	cube
cucumber	cucumber (whole or parts)
culture plate	petri dish
cumin seeds	cumin seed
curry leaves	curry leaf
curry powder	currey powder
dairy	dairy product
dead haul truck / trailer	dead haul truck;dead haul trailer
digestive system (unspecified)	digestive system
dill	dill spice
drumstick	poultry drumstick
drumstick skinless	poultry drumstick (skinless)
drumstick with skin	poultry drumstick (with skin)
drumsticks	poultry drumstick
egg	egg or egg component
egg belt	egg belt;feces
egg flour	
environment swab	swab
environment swab (hatchery)	hatchery;swab
feed	animal feed
feed and ingredients	animal feed; animal feed ingredient 
feed pans	feed pan
feeders and drinkers	animal feeder;animal drinker
fetal tissue	fetus;tissue
fetus/embryo	fetus;embryo
final wash	rinse
fish ingredients	
flax and chia powder	flax powder; chia powder
fluff	poultry fluff
fluff (hatchery)	poultry fluff;hatchery
food	
fruits and vegetables	fruit;vegetable
gallbladder	gall bladder
grain	bulk grain
green onions	green onion
ground	meat (ground)
ground ( lean)	ground meat (lean)
ground (angus)	beef (ground or minced, Angus)
ground (extra lean)	ground meat (extra lean)
ground (extra lean)	ground meat (extra lean)
ground (extra-lan)	ground meat (extra lean)
ground (extra-lean)	ground meat (extra lean)
ground (lean)	ground meat (lean)
ground (lean)	ground meat (lean)
ground (medium)	ground meat (medium)
ground (medium)	ground meat (medium)
ground (regular)	ground meat (regular)
ground (regular)	ground meat (regular)
ground (sirloin)	ground meat (Sirloin)
ground boneless	ground meat (boneless)
ground extra lean	ground meat (extra lean)
ground pepper	pepper (ground)
ground regular	ground meat (regular)
ground water	groundwater
ground-lean	ground meat (lean)
ground-regular	ground meat (regular)
ground( extra lean)	ground meat (extra lean)
ground( medium)	ground meat (medium)
ground(extra lean)	ground meat (extra lean)
ground(lean)	ground meat (lean)
ground(medium)	ground meat (medium)
ground(regular)	ground meat (regular)
groundextra lean)	ground meat (extra lean)
growth / lesion (unspecified tissue)	tumour;lesion
growth/lesion (unspecified tissue)	tumour;lesion
hazelnut / filbert	hazelnut
headcheese	head cheese
herb/spice (unspecified)	spice or herb
herb/spice (unspecified)	spice or herb
herbs and spices	spice or herb
in-shell	poultry egg (whole, shell on)
intestinal contents	intestine;body cavity content
irrigation	
joint	skeletal joint
joint fluid	synovial fluid
kale	kale leaf
kalonji whole seed	kalonji seed
lab surface	
laboratory	laboratory facility
lay ration	lay ration (animal feed)
leg	leg (meat cut)
leg with skin-drumstick and thigh	leg (meat cut, with skin)
levage/peritoneal	lavage;peritoneum
levage/tracheal	lavage;trachea
liquid whole	
litter	animal litter
litter/manure	animal litter;animal manure
live haul truck/trailer	live haul truck;live hail trailer
loin center chop	loin centre chop
loin center chop non-seasoned	loin centre chop;food (non-seasoned)
mango	mango (whole or parts)
meat	meat 
meat flour/meal	meat meal
mild italian style burger	beef hamburger (dish);Italian-style
milk	milk, milk product or milk substitute
milk/colostrum	milk;colostrum
mixed food/meat	mixed food;meat
mixed organs	organs or organ parts
mixed salad/mixed greens	salad;greens (raw)
mixed tissues	heterogeneous tissue
mucous membrane (gut)	gastrointestinal system mucosa
mucous membrane (resp)	respiratory system mucosa
mung bean sprouts	mung bean sprout
muscle	muscle organ
muscle/meat	muscle tissue;meat
mushrooms	mushroom (whole or parts)
nasal turbinate	nasal turbinal
nasal/naries	pair of nares
necks	neck (meat cut)
nuggets	nugget
organ unspecified	organ
organ/tissue	organ;tissue
other	
other chicken	
other cut	
other cut (not ground)	
other cut (not ground)	
other cut boneless	
other cut boneless (not ground)	
other variety meats	
ovine ingredients	
papaya	papaya (whole or parts)
pea sprouts	pea sprout
pea sprouts	pea sprout
pepper	
peritoneal fluid	peritoneum;bodily fluid
pet/zoo	companion animal;zoo
pig ground	pork (ground or minced)
pig ground ( lean)	pork (ground or minced, lean)
pig ground (extra lean)	pork (ground or minced, extra lean)
pig ground (extra-lan)	pork (ground or minced, extra lean)
pig ground (extra-lean)	pork (ground or minced, extra lean)
pig ground (lean)	pork (ground or minced, lean)
pig ground (medium)	pork (ground or minced, medium)
pig ground (regular)	pork (ground or minced, regular)
pig ground (sirloin)	pork (ground or minced, Sirloin)
pig ground boneless	pork (ground or minced, boneless)
pig ground regular	pork (ground or minced, regular)
pig ground-lean	pork (ground or minced, lean)
pig ground-regular	pork (ground or minced, regular)
pig ground( extra lean)	pork (ground or minced, extra lean)
pig ground( medium)	pork (ground or minced, medium)
pig ground(extra lean)	pork (ground or minced, extra lean)
pig ground(lean)	pork (ground or minced, lean)
pig ground(medium)	pork (ground or minced, medium)
pig ground(regular)	pork (ground or minced, regular)
pig groundextra lean)	pork (ground or minced, extra lean)
pig rib chop	pork rib chop
pig roast	pork roast
pig shoulder	pork shoulder (meat cut)
pig shoulder chop	pork shoulder chop (meat cut)
pig shoulder chop non-seasoned	pork shoulder chop (meat cut);food (non-seasoned)
pig sirloin chop	pork sirloin chop (meat cut)
pig strip	pork strip (meat cut)
pig tender loin	pork tenderloin (meat cut)
pig tenderloin	pork tenderloin (meat cut)
plucking water	poultry plucking water
pooled feces	feces;pooled sample
porcine ingredients	
pork chop (cut unknown)	pork chop
pork ribs	pork rib (meat cut) 
premix	compound feed premix
premix (medicated)	compound feed premix (medicated)
processed (other)	
rasam powder spice	rasam powder
raw	food (raw)
rectal swab	rectum;swab
ribs	meat (ribs)
river surface	river;water surface
roast	meat (roasted)
run off	surface runoff
sausage (pepper)	
scallopini	scallopini squash (whole or parts)
shelf / sill	shelf;window sill
shell egg	hen egg (whole)
shell on	poultry egg (shell on)
shelled	
shoulder	shoulder (meat cut)
shoulder chop	shoulder chop (meat cut)
shoulder chop non-seasoned	shoulder chop (meat cut);food (non-seasoned)
sinus	paranasal sinus
sirloin chop	sirloin chop (meat cut)
skin	skin of body
soft	food (soft)
soya meal	
soyabean meal	soybean meal
soybean	soybean  
sprouted seeds	germinated or sprouted seed
sprouts	sprout
starter ration	starter ration (animal feed)
steak	meat (steak)
stew chunks	beef stew chunk
stomach contents	stomach;body cavity content
stool	feces
strip	strip (meat cut)
supermarket - a; retail outlet	supermarket
supermarket - b; retail outlet	supermarket
supermarket - c; retail outlet	supermarket
supermarket - d; retail outlet	supermarket
supermarket - e; retail outlet	supermarket
supermarket - f; retail outlet	supermarket
supermarket - g; retail outlet	supermarket
supermarket - h; retail outlet	supermarket
supermarket - i	supermarket
surface - other	built environment surface
surface - river	river;water surface
surface unspecified	built environment surface
swab (nasal)	nose;swab
swab (rectal)	rectum;swab
swab (tissue fluid-unspecified)	tissue;bodily fluid;swab
swab #3	swab
swab #5	swab
swab 1	swab
swab 2	swab
swab 3	swab
swab 4	swab
t. high	thigh (meat cut)
tender loin	tenderloin (meat cut)
tenderloin	tenderloin (meat cut)
testicle	testis
thigh	poultry thigh (meat cut)
thigh skinless	poultry thigh (skinless)
thigh skinless boneless	poultry thigh (skinless, boneless)
thigh with skin	poultry thigh (with skin)
thigh with skin	poultry thigh (with skin)
thorax	thoracic segment of trunk
tomato	tomato (whole or parts)
trim	meat trim
truck / trailer	truck;trailer
truck/trailer	truck;trailer
turkey breast back off	turkey breast (back off)
turkey breast skinless	turkey breast (skinless)
turkey breast skinless boneless	turkey breast (skinless, boneless)
turkey breast with skin	turkey breast (with skin)
turkey drumstick skinless	turkey drumstick (skinless)
turkey drumstick with skin	turkey drumstick (with skin)
turkey drumsticks	turkey drumstick
turkey ground	turkey (ground or minced)
turkey ground ( lean)	turkey (ground or minced, lean)
turkey ground (extra lean)	turkey (ground or minced, extra lean)
turkey ground (extra-lan)	turkey (ground or minced, extra lean)
turkey ground (extra-lean)	turkey (ground or minced, extra lean)
turkey ground (lean)	turkey (ground or minced, lean)
turkey ground (medium)	turkey (ground or minced, medium)
turkey ground (regular)	turkey (ground or minced, regular)
turkey ground boneless	turkey (ground or minced, boneless)
turkey ground regular	turkey (ground or minced, regular)
turkey ground-lean	turkey (ground or minced, lean)
turkey ground-regular	turkey (ground or minced, regular)
turkey ground( extra lean)	turkey (ground or minced, extra lean)
turkey ground( medium)	turkey (ground or minced, medium)
turkey ground(extra lean)	turkey (ground or minced, extra lean)
turkey ground(lean)	turkey (ground or minced, lean)
turkey ground(medium)	turkey (ground or minced, medium)
turkey ground(regular)	turkey (ground or minced, regular)
turkey groundextra lean)	turkey (ground or minced, extra lean)
turkey leg	turkey leg (meat cut)
turkey leg with skin-drumstick and thigh	turkey leg (with skin)
turkey necks	turkey neck (meat cut)
turkey nuggets	turkey nugget
turkey thich skinless	turkey thigh (skinless)
turkey thigh	turkey thigh (meat cut)
turkey thigh skinless boneless	turkey thigh (skinless, boneless)
turkey thigh with skin	turkey thigh (with skin)
turkey thigh with skin	turkey thigh (with skin)
turkey upper thigh	turkey upper thigh (meat cut)
turkey upper thigh with skin	turkey upper thigh (with skin)
turkey upper thight	turkey upper thigh (meat cut)
turkey upperthigh	turkey upper thigh (meat cut)
turkey wing	turkey wing (meat cut)
turkey wings	turkey wing (meat cut)
unknown food	
unknown meal	meal (animal feed)
unknown organ	organ
unknown surface	built environment surface
unspecified feed/ingredient	
unspecified food	
unspecified organ/tissue	organ
upper thigh	poultry upper thigh (meat cut)
upper thigh with skin	poultry upper thigh (with skin)
upper thight	poultry upper thigh (meat cut)
upperthigh	upper thigh (meat cut)
vegetable/spice	
wall	building wall
wallnut	walnut (whole or parts)
walls	building wall
walnut	walnut (whole or parts)
waste water	wastewater
watering bowl/equipment	watering bowl 
watering bowl/equipment	watering bowl 
weep	weep fluid
whole	
whole carcass	carcass
whole with skin	
wing	poultry wing (meat cut)
wings	poultry wing (meat cut)
working surface	built environment surface
yolk	egg yolk`;

/**
 * Initialize lookup table for categorizing normalized terms into one or
 * more target fields and corresponding ontology ids: term -> target field,
 * ontology id.
 */
var initCategory = () => {
	let category = {};
  for (const line of CATEGORY.split('\n')) {
    let [field, term, ontology_id] = line.split('\t').map(function(e){return e.trim();});
    /*
    let record = {
    		'field': 				field,			// GRDI target export field
    		'ontology_id': 	ontology_id	// pertinent ontology term
    };

    if (term in category)
    	category[term].push(record)
    else 
    	category[term] = [record];
    */
    if (ontology_id.length > 0)
    	category[term] = ontology_id;
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

