/**
 * Download phac_dexa grid mapped to GRDI format.
 * @param {String} baseName Basename of downloaded file.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @param {Object} xlsx SheetJS variable.
 */
var exportGRDI = (baseName, hot, data, xlsx, fileType) => {
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
    ['DataHarmonizer provenance',[]]
  ]);

  const sourceFields = getFields(data);
  const sourceFieldNameMap = getFieldNameMap(sourceFields);

  // Fills in the above mapping (or just set manually above) 
  getHeaderMap(ExportHeaders, sourceFields, 'GRDI');


//DEXA to GRDI is 3 step process:

/*
  1: Normalize DEXA fields
  
*/
	let normalize = {};
  for (const line of NORMALIZE.split('\n')) {
    let [key, value] = line.split('\t');
  	if (key in normalize) {
  		normalize[key].push(value)
  	}
  	else
  		normalize[key] = [value];
  }
  console.log(normalize);
/*
  2: Merge field values into target fields according to rules. Done in setRuleDB
  3: Ontology id addition to merged fields

*/
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
      const value = getMappedField(headerName, inputRow, sources, sourceFields, sourceFieldNameMap, ';', 'GRDI');

      outputRow.push(value);
    };
    outputMatrix.push(outputRow);
  };

  runBehindLoadingScreen(exportFile, [outputMatrix, baseName, fileType, xlsx]);
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

  if (RuleDB.collection_device == 'swab' && RuleDB.environmental_site.length > 0) {
     RuleDB.animal_or_plant_population = RuleDB.SPECIES;
  };

  return RuleDB;
};

// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
  "Dexa to GRDI": {'method': exportGRDI, 'fileType': 'xls', 'status': 'draft'}
};

/************************************************
  MUST BE TAB DELIMITED!
*/
var NORMALIZE = `Abdomen	abdomen
Abdominal Muscle	muscle of abdomen
Abomasum	abomasum
Air Sac	air sac
Anal Gland	anal gland
Bladder	urinary bladder
Blood vessel	blood vessel
Brain	brain
Bursa of Fabricus	bursa of Fabricius
Carcass	carcass
Carcass (whole)	carcass
Cecum	caecum
Cloacae	cloaca
Cloacal swab	cloaca
Cloacal swab	swab
Colon	colon
Digestive System (Unspecified)	digestive system
Duodenum	duodenum
Ear	ear
Esophagus	esophagus
Eye	eye
Fetus/Embryo	fetus
Fetus/Embryo	embryo
Foot	foot
Gall Bladder	gall bladder
Gallbladder	gall bladder
Ganglion	ganglion
Gizzard	gizzard
Heart	heart
Ileum	ileum
Intestine	intestine
Jejunum	jejunum
Joint	skeletal joint
Kidney	kidney
Liver	liver
Lung	lung
Lymph Node	lymph node
Mesenteric Lymph Node	mesenteric lymph node
Mixed Organs	organs or organ parts
Mouth	mouth
Mucous membrane (gut)	gastrointestinal system mucosa
Mucous membrane (resp)	respiratory system mucosa
Muscle	muscle organ
Nasal Turbinate	nasal turbinal
Nasal/Naries	pair of nares
Organ	organ
Organ Unspecified	organ
Ovary	ovary
Oviduct	oviduct
Pericardium	pericardium
Peritoneum	peritoneum
Placenta	placenta
Pleura	pleura
Rectal Swab	rectum
Rectal Swab	swab
Rectum	rectum
Rumen	rumen
Sinus	paranasal sinus
Skin	skin of body
Small Intestine	small intestine
Spinal Cord	spinal cord
Spleen	spleen
Stomach	stomach
Swab (Nasal)	nose
Swab (Nasal)	swab
Swab (Rectal)	rectum
Swab (Rectal)	swab
Testicle	testis
Thorax	thoracic segment of trunk
Trachea	trachea
Unknown organ	organ
Unspecified Organ/Tissue	organ
Uterus	uterus
Vagina	vagina
Yolk Sac	yolk sac
Abscess	abscess
Blood	blood
Body Fluid/Excretion	bodily fluid
Body Fluid/Excretion	excreta
Bone	bone
Bone Marrow	bone marrow
Cavity Fluid (Unspecified)	bodily fluid
Cavity fluid unspecified	bodily fluid
Cecal Content	caecum
Cecal Content	body cavity content
Fetal Tissue	fetus
Fetal Tissue	tissue
Growth / lesion (unspecified tissue)	tumour
Growth / lesion (unspecified tissue)	lesion
Growth/Lesion (Unspecified Tissue)	tumour
Growth/Lesion (Unspecified Tissue)	lesion
Intestinal Contents	intestine
Intestinal Contents	body cavity content
Joint Fluid	synovial fluid
Levage/peritoneal	lavage
Levage/peritoneal	peritoneum
Levage/Tracheal	lavage
Levage/Tracheal	trachea
Milk/Colostrum	milk
Milk/Colostrum	colostrum
Mixed Tissues	heterogeneous tissue
Mucus	mucus
Organ/Tissue	organ
Organ/Tissue	tissue
Peritoneal Fluid	peritoneum
Peritoneal Fluid	bodily fluid
Shell	shell
Stomach Contents	stomach
Stomach Contents	body cavity content
Swab (Tissue Fluid-Unspecified)	tissue
Swab (Tissue Fluid-Unspecified)	bodily fluid
Swab (Tissue Fluid-Unspecified)	swab
Tissue	tissue
Feces	feces
Meconium	meconium
Pooled Feces	feces
Pooled Feces	pooled sample
Stool	feces
Urine	urine
Contact plate	petri dish
Culture Plate	petri dish
Environment Swab	swab
Swab	swab
Swab	swab
Swab #3	swab
Swab #5	swab
Swab 1	swab
Swab 2	swab
Swab 3	swab
Swab 4	swab
Biosolids	biosolids
Biosolid	biosolids
Biosolid/Sludge	biosolids
Biosolid/Sludge	sludge
Bootie	boot cover
Boots	boot  
Broom	broom
Chick Pads	chick pad
chick pad	chick pad
Compost	compost
Crop	crop
Dust	dust
Effluent	effluent
Fecal Slurry	fecal slurry
Final Wash	rinse
Fluff	poultry fluff
Fluff (Hatchery)	poultry fluff
Fluff (Hatchery)	hatchery
Ground Water	groundwater
Litter	animal litter
Litter/Manure	animal litter
Litter/Manure	animal manure
Plucking Water	poultry plucking water
Rinse	rinse
Run Off	surface runoff
Sediment	sediment
Soil	soil
Waste Water	wastewater
Water	water
Weep	weep fluid
Air Intake	air intake 
Animal Pen	animal pen
Animal pen	animal pen
Artificial wetland	artificial wetland
Belt	belt
Building	building
Bulk Tank	bulk tank
Cages	animal cage
Chick Boxes	chick box
Cottage	cottage
Cooler Line	Cooler Line
Crates	crate
Dairy	dairy
Dead Haul Truck / Trailer	dead haul truck
Dead Haul Truck / Trailer	dead haul trailer
Dumpster	dumpster
Egg Belt	egg belt
Egg Belt	feces
Environment Swab (Hatchery)	swab
Environment Swab (Hatchery)	hatchery
Equipment	equipment
Fan	fan
Feed Pans	feed pan
Feeders and Drinkers	animal feeder 
Feeders and Drinkers	animal drinker
Floor	floor
Irrigation	
Lab Surface	
Laboratory	laboratory facility
Lake	lake
Live Haul Truck	live haul truck
Live Haul Truck/Trailer	live haul truck
Live Haul Truck/Trailer	live hail trailer
Manure Pit	manure pit
Pet/Zoo	companion animal
Pet/Zoo	zoo
Plucking Belt	plucking belt
River	river
River Surface	river
River Surface	water surface
Shelf / Sill	shelf
Shelf / Sill	window sill
Stall	stall
Surface - Other	built environment surface
Surface - River	river
Surface - River	water surface
Surface unspecified	built environment surface
Surface Water	surface water
Transformer	transformer
Truck / Trailer	truck
Truck / Trailer	trailer
Truck/Trailer	truck
Truck/Trailer	trailer
Unknown Surface	built environment surface
Wall	building wall
Walls	building wall
Watering Bowl/Equipment	watering bowl 
Watering bowl/equipment	watering bowl 
Working Surface	built environment surface
"Pigsty	pigsty
#1Barn 2	barn
#1Barn 3	barn
#4Barn 3,Salm1	barn
#4Barn 3,Salm2	barn
(pigsty) a l'engrais	pigsty
(pigsty) porcherie	pigsty
10#56 Hatchery	hatchery
-20°C freezer handle, rm 252	freezer handle
2006 Barn #1	barn
2007 Barn #C	barn
2-Barn 8	barn
2-Barn-5	barn
3-Barn 6	barn
3-Barn-6	barn
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
A.A. Abattoir	abattoir
Abattior	abattoir
Abattoir	abattoir
Abattoir AL	abattoir
Abattoir AF	abattoir
Abattoir AH	abattoir
Abattoir AH-02	abattoir
Abattoir AL	abattoir
Abattoir B	abattoir
Abattoir D-02	abattoir
Abattoir DD-02	abattoir
Abattoir G-02	abattoir
Abattoir O	abattoir
Abbatoir	abattoir
Abbatoire	abattoir
Abbattoir	abattoir
Air Inlet	air intake
Air Intake	air intake
ACRE T	farm
ACRE T FARMS	farm
ACRE-T	farm
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
aquarium water/tropical fish importer	shop
aquarium water/tropical fish importer	tropical fish
aquarium water/tropical fish importer	water
aquarium water/tropical fish importer	aquarium
ARAND VIEW FARMS	farm
Allen's Fisheries	fish farm
Avitech Farm	farm
Atlantic Poultry; Chick Hatchery	poultry hatchery
Awash	park
Awash Park	park
AxisFarms	farm
BARBER	farm
BARBER FARM	farm
Barn	barn
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
Barn 1097a: top	barn
Barn 1097a; 1-8	barn
Barn 1097a; 9-17	barn
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
Barn#10	barn
Barn#4	barn
Barn#54	barn
Barn#6	barn
Barn#7	barn
Barn#8	barn
BARN, ANIMAL HOSPITAL	barn
Barn/Enviromental	barn
Barn2, sample1	barn
Barn2, sample2	barn
Barn5	barn
Barn5 21417	barn
Barn6/7	barn
Barn-Floor	barn
Barn-Pig	barn
Barns 1&2	barn
BEL ROYAL FARM	farm
Belt #7	belt
Belt #7 Hatchery	belt
	poultry hatchery
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
Biodome	biodome
BIRCH TREE FARM	farm
Bird feeder	bird feeder
Boiler Barn	broiler barn
Boucherie	butcher shop
Bourgeois Dumont Poultry Farm	farm
Breeder Barn	breeder barn
Breeder Farm	breeder farm
Broiler Barn	broiler barn
Breeder Operation	breeder farm
BURNBRAE FARMS LTD.	farm
Burnbrne Farm	farm
Butchershop	butcher shop
Butternut Creek, Rte.800	creek
Cage	animal cage
Cage 2,Rm 62	animal cage
Cages 1-2; Chick Hatchery; Pullet barn	poultry hatchery
Cages 1-2; Chick Hatchery; Pullet barn	animal cage
Cages 3; Chick Hatchery; Pullet barn	poultry hatchery
Cages 3; Chick Hatchery; Pullet barn	animal cage
Calgary Zoo	zoo
Camion (truck)	truck
Canagagigue Creek	creek
Canagugiue creek	creek
Supermarket	supermarket
Supermarket - A; Retail outlet	supermarket
Supermarket - B; Retail outlet	supermarket
Supermarket - C; Retail outlet	supermarket
Supermarket - D; Retail outlet	supermarket
Supermarket - E; Retail outlet	supermarket
Supermarket - F; Retail outlet	supermarket
Supermarket - G; Retail outlet	supermarket
Supermarket - H; Retail outlet	supermarket
Supermarket - I	supermarket
1/2 breast	
Alfalfa Sprouts	alfalfa sprout
Alfalfa sprouts	alfalfa sprout
Almond	almond
Apple	apple
Arugula	arugula greens (raw)
Avian Ingredients	
Back	back
Balut	balut
Basil	basil
Bean Sprouts	bean sprout
Beef	beef
Black Pepper	black pepper
Blade Steak	
Blood Meal	blood meal
Bone Meal	bone meal
Bovine Ingredients	
Breast	breast
Breast back off	breast (back off)
Breast cutlets	chicken breast cutlet
Breast Skinless	breast (skinless)
Breast skinless	breast (skinless)
Breast Skinless Boneless	breast (skinless, boneless)
Breast skinless boneless	breast (skinless, boneless)
Breast with Skin	breast (with skin)
Breast with skin	breast (with skin)
Brisket	brisket
Burger	burger
Canola Meal	canola meal
Cantaloupe	cantaloupe
Cantelope	cantaloupe
Cardemom	cardamom
Carinata Meal	carinata meal
Cereal	cereal
Cereal/Bread/Snack	cereal
Cereal/Bread/Snack	bread
Cereal/Bread/Snack	snack food
Cheese	cheese
Chia Powder	chia powder
Chia Seeds	chia seed (whole)
Chia Sprouts	chia sprout
Chickpea	chickpea (whole)
Chili	
Chilli Pepper	chili pepper
Chives	chive leaf (whole or parts)
Chop	chop
Chops	chop
Coconut	coconut (whole or parts)
Complete Feed	complete feed
Confections/Nuts/Condiments	
Coriander	coriander
Coriander Seeds	coriander seed (whole)
Coriander-Cumin Powder	coriander powder
Coriander-Cumin Powder	cumin powder
Corn	corn (on-the-cob, kernel or parts)
Cubes	cube
Cucumber	cucumber (whole or parts)
Cumin seeds	cumin seed
Curry Leaves	curry leaf
Curry powder	currey powder
Cut	cut
Cutlet	cutlet
Dairy	dairy product
Dill	dill spice
Drumstick	poultry drumstick
Drumstick Skinless	poultry drumstick (skinless)
Drumstick with Skin	poultry drumstick (with skin)
Drumsticks	poultry drumstick
Egg	egg or egg component
Egg Flour	
Feather Meal	feather meal
Feed	animal feed
Feed and Ingredients	animal feed; animal feed ingredient 
Fennel	fennel
Filet	filet
Fish Ingredients	
Fish Meal	fish meal
Flax and Chia Powder	flax powder; chia powder
Flax Powder	flax powder
Food	
Fruit	fruit
Fruits and Vegetables	fruit
Fruits and Vegetables	vegetable
Garlic Powder	garlic powder
Ginger	ginger
Grain	bulk grain
Green Onion	green onion
Green onions	green onion
Ground	meat (ground)
Ground ( lean)	ground meat (lean)
Ground (Angus)	ground beef (Angus)
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
Ground (Sirloin)	ground beef (Sirloin)
Ground Boneless	ground meat (boneless)
Ground extra lean	ground meat (extra lean)
ground pepper	pepper (ground)
Ground regular	ground meat (regular)
Ground-Lean	ground meat (lean)
Ground-Regular	ground meat (regular)
ground( extra lean)	ground meat (extra lean)
ground( medium)	ground meat (medium)
Ground(Extra lean)	ground meat (extra lean)
Ground(Lean)	ground meat (lean)
Ground(medium)	ground meat (medium)
ground(regular)	ground meat (regular)
Groundextra lean)	ground meat (extra lean)
Ham	ham
Hazelnut	hazelnut
Hazelnut / Filbert	hazelnut
Headcheese	head cheese
Herb/Spice (Unspecified)	spice or herb
Herb/spice (unspecified)	spice or herb
Herbs and Spices	spice or herb
Hummus	hummus
In-Shell	poultry egg (whole, shell on)
Kale	kale leaf
Kalonji Whole Seed	kalonji seed
Lay Ration	lay ration (animal feed)
Leg	leg (poultry meat cut)
Leg with Skin-Drumstick and Thigh	leg (poultry meat cut, with skin)
Lettuce	lettuce
Liquid whole	
Loin Center Chop	loin centre chop
Atlantic Shellfish Products	Atlantic shellfish food product
aviaire dinde	turkey
Loin center chop non-seasoned	loin centre chop
Loin center chop non-seasoned	food (non-seasoned)
Mango	mango (whole or parts)
Meat	meat 
Meat and Bone Meal	meat and bone meal
Meat Flour/Meal	meat meal
Meat Meal	meat meal
Mild italian style burger	beef hamburger (dish)
Mild italian style burger	Italian-style
Milk	milk, milk product or milk substitute
Mint	mint
Mixed food	mixed food
Mixed Food/Meat	mixed food
Mixed Food/Meat	meat
Mixed Salad/Mixed Greens	salad
Mixed Salad/Mixed Greens	greens (raw)
Mixed Sprouts	mixed sprouts
Mung Bean Sprouts	mung bean sprout
Muscle/Meat	muscle tissue
Muscle/Meat	meat
Mushrooms	mushroom (whole or parts)
Mutton	mutton
Necks	neck (poultry meat cut)
Nuggets	chicken nugget
Oregano	oregano
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
Paprika	paprika
Parsley	parsley
Pea Sprouts	pea sprout
Pea sprouts	pea sprout
Peanut Butter	peanut butter
Pepper	
Pepper Powder	pepper powder
Pepperoni	pepperoni
Pet Food	pet food
Porcine Ingredients	
Pork Chop (Cut Unknown)	pork chop
Premix	compound feed premix
Premix (Medicated)	compound feed premix (medicated)
Processed (Other)	
Rasam Powder Spice	rasam powder
Raw	food (raw)
Red Veal	red veal
Rib Chop	rib chop
Ribs	meat (ribs)
Roast	meat (roasted)
Sage	sage
Salami	salami
Sausage	sausage
Sausage (Pepper)	
Scallopini	scallopini squash (whole or parts)
Sesame Seed	sesame seed
Shell egg	hen egg (whole)
Shell on	poultry egg (shell on)
Shelled	
Shellfish	shellfish
Shoulder	shoulder (meat cut)
Shoulder Chop	shoulder chop
Shoulder chop non-seasoned	shoulder chop
	food (non-seasoned)
Sirloin Chop	sirloin chop
Skim milk powder	skim milk powder
Soft	food (soft)
Soya Meal	
Soyabean Meal	soybean meal
Soybean	soybean  
Spinach	spinach
Sprouted Seeds	germinated or sprouted seed
Sprouts	sprout
Starter Ration	starter ration (animal feed)
Steak	meat (steak)
Stew Chunks	beef stew chunk
Strip	strip (meat cut)
Supplements	dietary supplement
T. high	thigh (meat cut)
Tahini	tahini
Tender loin	tenderloin (meat cut)
Tenderloin	tenderloin (meat cut)
Thigh	thigh (meat cut)
Thigh Skinless	thigh (skinless)
Thigh Skinless Boneless	thigh (skinless, boneless)
Thigh with skin	thigh (with skin)
Thigh with Skin	thigh (with skin)
Tomato	tomato (whole or parts)
Trim	meat trim
Turkey	turkey
Turmeric	turmeric
Unknown Food	
Unknown Meal	meal (animal feed)
Unspecified Feed/Ingredient	
Unspecified Food	
Upper Thigh	upper thigh (meat cut)
Upper Thigh with Skin	upper thigh (with skin)
upper thight	upper thigh (meat cut)
Upperthigh	upper thigh (meat cut)
Veal	veal
Vegetable/Spice	
Wallnut	walnut (whole or parts)
Walnut	walnut (whole or parts)
White Pepper	white pepper
White Veal	white veal
Whole	
Whole Carcass	carcass
Whole with Skin	
Wing	wing (poultry meat cut)
Wings	wing (poultry meat cut)
Yeast	yeast
Yolk	egg yolk
Beef	beef
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
Beef-B10-2009	beef
Beef-B10-2010	beef
Beef-B11-2009	beef
Beef-B11-2010	beef
Beef-B11-2011	beef
Beef-B11-2012	beef
Beef-B1-2011	beef
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
Beef-B6a-2009	beef`;

/************************************************
  MUST BE TAB DELIMITED!
*/
var MAPPING = `anatomical_material	blood	UBERON_0000178
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
food_product	breast (skinless, boneless)	
food_product	breast (skinless)	
food_product	breast (skinless)	
food_product	breast (with skin)	
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
food_product	poultry drumstick	
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

