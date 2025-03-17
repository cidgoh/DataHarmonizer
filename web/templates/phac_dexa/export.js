// Adds existing functions/methods to DataHarminizer.
export default {
  // NOTE: FUTURE DEV: This has a mixture of sourceFieldNameMap AND sourceFieldTitleMap rules/lookups that should be just moved to sourceFieldNameMap. ALTERNATELY, a new LinkML based vision of converting from source to destination schema class.
  'Dexa to GRDI': {
    fileType: 'xls',
    status: 'published',
    method: function (dh) {
      const self = this;

      // Provides a map from each export format field to the linear list of source
      // fields it derives content from.
      const ExportHeaders = new Map([
        // Sample collection and processing
        ['sample_collector_sample_ID', []], // takes DEXA SPECIMEN_ID, SAMPLE_ID
        ['alternative_sample_ID', []], // takes DEXA LFZ_ADDITIONAL_SAMPLE_ID
        ['sample_collected_by', []], // takes DEXA SUBMITTINGORG_1
        ['sample_collected_by_laboratory_name', []], // takes DEXA SUBMITTINGLAB_1
        ['sample_collection_project_name', []],
        ['sample_plan_name', []],
        ['sample_plan_ID', []],
        ['sample_collector_contact_name', []],
        ['sample_collector_contact_email', []], //CIPARS generic email ???
        ['purpose_of_sampling', []],
        ['experimental_activity', []],
        ['experimental_activity_details', []],
        ['specimen_processing', []],
        ['geo_loc_name (country)', []], // takes DEXA COUNTRY_1
        ['geo_loc_name (state/province/region)', []], // takes DEXA PROVINCE_1
        ['food_product_origin_geo_loc_name (country)', []],
        ['host_origin_geo_loc_name (country)', []],
        ['geo_loc latitude', []],
        ['geo_loc longitude', []],
        ['sample_collection_date', []], // takes DEXA DATECOLLECTED_1
        ['sample_received_date', []],
        ['original_sample_description', []],
        ['environmental_site', []], // CALCULATED in RuleDB
        ['animal_or_plant_population', []], // CALCULATED in RuleDB
        ['environmental_material', []], // CALCULATED in RuleDB
        ['body_product', []], // CALCULATED in RuleDB
        ['anatomical_part', []], // CALCULATED in RuleDB
        ['food_product', []], // CALCULATED in RuleDB
        ['food_product_properties', []], // CALCULATED in RuleDB
        ['animal_source_of_food', []],
        ['food_packaging', []],
        ['collection_device', []], // CALCULATED in RuleDB
        ['collection_method', []], // CALCULATED in RuleDB
        //  Host information
        ['host (common name)', []], // takes DEXA SPECIES BUT ALSO  // CALCULATED in RuleDB
        ['host (scientific name)', []],
        ['host_disease', []],

        ['host_developmental_stage', []], // CALCULATED in RuleDB

        //  Strain and isolation information
        ['microbiological_method', []],
        ['strain', []],
        ['isolate_ID', []], // takes DEXA ISOLATE_ID
        ['alternative_isolate_ID', []],
        ['progeny_isolate_ID', []],
        ['IRIDA_isolate_ID', []],
        ['IRIDA_project_ID', []],
        ['isolated_by', []],
        ['isolated_by_laboratory_name', []],
        ['isolated_by_contact_name', []],
        ['isolated_by_contact_email', []],
        ['isolation_date', []],
        ['isolate_received_date', []],
        ['organism', []], // takes DEXA FINAL_ID_GENUS, FINAL_ID_SPECIES
        ['serovar', []], // takes DEXA FINAL_ID_SEROTYPE
        ['serotyping_method', []], // takes DEXA SA_Serotype_Method
        ['phagetype', []], // takes DEXA FINAL_ID_PHAGETYPE
        // Sequence information
        ['library_ID', []],
        ['sequenced_by', []],
        ['sequenced_by_laboratory_name', []],
        ['sequenced_by_contact_name', []],
        ['sequenced_by_contact_email', []],
        ['purpose_of_sequencing', []],
        ['sequencing_project_name', []],
        ['sequencing_platform', []],
        ['sequencing_instrument', []],
        ['sequencing_protocol', []],
        ['r1_fastq_filename', []],
        ['r1_fastq_filename', []],
        ['fast5_filename', []],
        ['genome_sequence_filename', []],
        //  Public repository information
        ['publication_ID', []],
        ['attribute_package', []],
        ['biosample_accession', []],
        ['SRA_accession', []],
        ['GenBank_accession', []],
        // Antimicrobial Resistance
        // ...

        //['sample_name',                             []], NEW FIELD??
        //['collected_by',                            []], DIFFERENT FIELD
        ['anatomical_material', []], // MISSING FIELD  // CALCULATED in RuleDB
        //['laboratory_name',                         []], --> sample_collected_by_laboratory_name?? // takes SUBMITTINGLAB_1
        ['DataHarmonizer provenance', []],
      ]);

      let preserveCapsFields = [
        'geo_loc_name (country)',
        'geo_loc_name (state/province/region)',
        'sequenced_by_institution_name',
        'sequenced_by_laboratory_name',
        'sequenced_by_contact_name',
      ];

      const sourceFields = dh.slots; //dh.getFields(dh.table);
      const sourceFieldNameMap = dh.getFieldNameMap(sourceFields);
      const sourceFieldTitleMap = dh.getFieldTitleMap(sourceFields);

      // Fills in the above mapping of export field to source fields (or just set
      // source fields manually above)
      dh.getHeaderMap(ExportHeaders, sourceFields, 'GRDI');

      //console.log("Headers", ExportHeaders, sourceFields);

      // Copy headers to 1st row of new export table
      const outputMatrix = [[...ExportHeaders.keys()]];

      let normalize = self.initLookup();

      const inputMatrix = dh.getTrimmedData(dh.hot);
      for (const inputRow of inputMatrix) {
        // Does all
        let RuleDB = self.setRuleDB(
          dh,
          inputRow,
          sourceFields,
          sourceFieldTitleMap, // TITLE Map
          normalize,
          preserveCapsFields
        );


        const outputRow = [];
        for (const headerName of ExportHeaders.keys()) {

          // If Export Header field is in RuleDB, set output value from it, and
          // continue.
          // Sometimes fields have been set to 0 length.
          if (
            (headerName in RuleDB && RuleDB[headerName]) ||
            RuleDB[headerName] === null
          ) {
            let value = RuleDB[headerName];
            if (value !== null) {
              value = self.map_ontology(value, normalize, headerName);
            }
            outputRow.push(value);
            continue;
          }


          
          // Otherwise apply source (many to one) to target field transform:
          const sources = ExportHeaders.get(headerName);

          //console.log("Header", headerName, headerName in RuleDB, inputRow, sources, sourceFields, sourceFieldNameMap)

          let value = dh.getMappedField(
            headerName,
            inputRow,
            sources,
            sourceFields,
            sourceFieldNameMap, // NAME Map
            ';',
            'GRDI'
          );
          // semicolon-separated list of values.  Issue is terms have come from other source fields.
          outputRow.push(value);
        }
        outputMatrix.push(outputRow);
      }

      return outputMatrix;
    },

    /** Determine if text label for field is in an existing ontology or not.
     * @param {String} labels delimited by semicolons.
     * @param {Object} normalize dictionary of label -> field & ontology_id.
     */
    map_ontology: function (labels, normalize) {
      const value = [];
      for (let label of labels.split(';').map(function (e) {
        return e.trim();
      })) {
        // If it is a selection list picklist item it may have an ontology ID.
        let lookup = label.toLowerCase();
        // Otherwise it may be a compound term
        if (lookup in normalize) {
          let ontology_id = normalize[lookup].ontology_id;
          if (ontology_id) {
            label += ': ' + ontology_id;
          }
        }
        value.push(label);
      }

      return value.join(';');
    },


    /**
     * Get a dictionary of empty arrays for each ExportHeader field
     * FUTURE: enable it to work with hierarchic vocabulary lists
     *
     * @param {Array<String>} sourceRow array of values to be exported.
     * @param {Array<String>} sourceFields list of source fields to examine for mappings.
     * @param {Array<Array>} RuleDB list of export fields modified by rules.
     * @param {Array<Array>} fields list of export fields modified by rules.
     * @param {Array<Integer>} titleMap map of field names to column index.
     * @param {String} prefix of export format to examine.
     * @return {Array<Object>} fields Dictionary of all fields.
     */

    getRowMap: function (dh, sourceRow, ruleSourceFieldNames, RuleDB, fields, titleMap, prefix) {
      for (const title of ruleSourceFieldNames) {
        const sourceIndex = titleMap[title];
        let value = sourceRow[sourceIndex]; // All text values.
        // Sets source field to data value so that rules can reference it easily.
        RuleDB[title] = value;
        // Check to see if value is in vocabulary of given select field, and if it
        // has a mapping for export to a GRDI target field above, then set target
        // to value.
        if (value && value.length > 0) {
          let field = fields[sourceIndex];
          const vocab_list = field['flatVocabulary'];
          if (vocab_list && vocab_list.includes(value)) {
            if ('sources' in field) {
              // FUTURE REVISION: Currently ASSUMES first menu contains value (if multiple) menus.
              const menu_name = field['sources'][0];
              const permissible_values = dh.schema.enums[menu_name]['permissible_values'];
              const term = permissible_values[value];
              // Looking for 'GRDI' key in choice for example:
              if ('exportField' in term && prefix in term.exportField) {
                for (let mapping of term.exportField[prefix]) {
                  // Here mapping involves a value substitution
                  if ('value' in mapping) {
                    value = mapping.value;
                    // Changed on a copy of data, not handsongrid table
                    sourceRow[sourceIndex] = value;
                  }
                  if ('field' in mapping && mapping['field'] in RuleDB) {
                    RuleDB[mapping['field']] = value;
                  }
                }
              }
            }
          }
        }
      }
    },


    /** Rule-based target field value calculation based on given data row
     * @param {Object} dataRow.
     * @param {Object} sourceFields.
     * @param {Object} sourceFieldNameMap.
     * @param {Object} normalize term lookup table.
     */
    setRuleDB: function (
      dh,
      dataRow,
      sourceFields,
      sourceFieldNameMap,
      normalize
    ) {
      // RuleDB is a holding bin of target fields/variables to populate with custom
      // rule content. None of these fields receive DEXA field content directly.
      let RuleDB = {
        anatomical_material: '',
        anatomical_part: '',
        animal_or_plant_population: '',
        body_product: '',
        collection_device: '',
        collection_method: '', // NEW!
        environmental_material: '',
        environmental_site: '',
        food_product: '',

        food_product_properties: '',
        'host (common name)': '',
        host_developmental_stage: '', // NEW!!!!
        specimen_processing: '', // NEW!!!!
        // Source fields and their content added below
      };

      let ruleSourceFieldNames = [
        'STTYPE',
        'STYPE',
        'SPECIMENSUBSOURCE_1',
        'SUBJECT_DESCRIPTIONS',
        'SPECIES',
        'COMMODITY',
      ];

      // Loads RuleDB with the additional ruleSourceFieldNames.
      // This will set content of a target field based on data.js vocabulary
      // exportField {'field':[target column],'value':[replacement value]]}
      // mapping if any.
      this.getRowMap(dh,
        dataRow,
        ruleSourceFieldNames,
        RuleDB,
        sourceFields,
        sourceFieldNameMap,
        'GRDI'
      );

      // So all rule field values can be referenced in lower case.
      for (let sourceField of Object.keys(RuleDB)) {
        if (RuleDB[sourceField])
          RuleDB[sourceField] = RuleDB[sourceField].toLowerCase();
      }

      // STTYPE: ANIMAL ENVIRONMENT FOOD HUMAN PRODUCT QA UNKNOWN
      switch (RuleDB.STTYPE) {

        case 'animal': {
          // species-> host (common name);
          RuleDB['host (common name)'] = RuleDB.SPECIES;

          if (
            RuleDB.collection_device === 'swab' &&
            RuleDB.environmental_site.length > 0 &&
            RuleDB.SPECIES
          ) {
            RuleDB.animal_or_plant_population = RuleDB.SPECIES;
          }
          //console.log("TESTING:RuleDB", RuleDB);
          break; // prevents advancing to FOOD
        }

        case 'food': {
          // species-> food product
          // Issue, sometimes species = "Other" ????
          if (RuleDB.SPECIES) RuleDB.food_product = RuleDB.SPECIES;
          RuleDB['host (common name)'] = null; //wHY ISNT THIS WORKING???

          if (RuleDB.SUBJECT_DESCRIPTIONS)
            self.add_item(RuleDB, 'food_product', RuleDB.SUBJECT_DESCRIPTIONS);

          if (RuleDB.STYPE && RuleDB.COMMODITY) {
            //add_item(RuleDB.food_product, RuleDB.STYPE);
            switch (RuleDB.STYPE) {
              case 'porcine':
              case 'avian':
              case 'crustacean':
                self.add_item(RuleDB, 'food_product', RuleDB.COMMODITY);
            }
          }

          // Here a food_product might be a conjunction of animal + food product:
          let merged = RuleDB.food_product.replace('; ', ' ');
          if (merged in normalize) {
            RuleDB.food_product = normalize[merged].label;
          }

          break; // prevents advancing to blank/UNKNOWN
        }

        case 'environment':
          // species-> host (common name);
          RuleDB['host (common name)'] = RuleDB.SPECIES;

          if (RuleDB.STYPE)
            self.add_item(RuleDB, 'environmental_material', RuleDB.STYPE);
          break;

        case 'product':
          // species-> food product
          RuleDB.food_product = RuleDB.SPECIES;

          switch (RuleDB.STYPE) {
            case 'feed and ingredients':
            case 'fertilizer':
              self.add_item(
                RuleDB,
                'food_product',
                RuleDB.SUBJECT_DESCRIPTIONS
              );
          }
          break;

        default: // Any other STTYPE Value:
        //case '':
        //case 'unknown': {// no <n/a>
      }

      return RuleDB;
    },

    /**
     * Add a value to a field's existing string value, delimited by semicolon.
     */
    add_item: function (RuleDB, field, value) {
      if (RuleDB[field] === '') RuleDB[field] = value;
      else RuleDB[field] += '; ' + value;
    },

    /**
     * Initialize lookup table for normalizing DEXA terms: term -> normalized term.
     * NOTE: This lookup doesn't handle one term occuring under different parents.
     *
     * Cut & paste from DataHarmonizer Templates GRDI Normalization tab into LOOKUP
     * https://docs.google.com/spreadsheets/d/1jPQAIJcL_xa3oBVFEsYRGLGf7ESTOwzsTSjKZ-0CTYE/
     * MUST BE TAB DELIMITED!
     *
     * @return {Object} term normalize lookup table.
     */
    initLookup: function () {
      let normalize = {};
      for (const line of this.LOOKUP.split('\n')) {

        let [ontology_id, parent, label, normalization] = line
          .split('\t')
          .map(function (e) {
            return e.trim();
          });

        normalize[label] = {
          ontology_id: ontology_id,
          parent: parent,
          label: label,
        };

        // Various other abnormal/synonym text strings point to normalized record.
        let normalizations = normalization.split(';').map(function (e) {
          return e.trim();
        });
        if (normalizations.length > 0)
          for (const key of normalizations) normalize[key] = normalize[label];
      }
      return normalize;
    },

    LOOKUP: `ENVO_01000925  environmental_site  abattoir  a.a. abattoir; abattior; abattoir af; abattoir ah; abattoir ah-02; abattoir al; abattoir al; abattoir b; abattoir d-02; abattoir dd-02; abattoir g-02; abattoir o; abbatoir; abbatoire; abbattoir; amr abattoir al; amr abattoir dd; amr-abattoir; amr-abattoir-ah; amr-abattoir-b
UBERON_0000916  anatomical_part abdomen 
UBERON_0007358  anatomical_part abomasum  
HP_0025615  anatomical_part abscess 
  environmental_site  air intake  air inlet; air intake
UBERON_0009060  anatomical_part air sac 
FOODON_00002670 food_product  alfalfa sprout  alfalfa sprouts
FOODON_00003523 food_product  almond  
UBERON_0011253  anatomical_part anal gland  
ENVO_01000922 environmental_site  animal cage cage; cage 2,rm 62; cages; cages 1-2; chick hatchery; pullet barn; cages 3; chick hatchery; pullet barn
  environmental_material  animal drinker  
    animal drinker  feeders and drinkers
ENVO_02000047 food_product  animal feed feed; feed and ingredients
    animal feed ingredient  feed and ingredients
  environmental_material  animal feeder   feeders and drinkers
ENVO_00002191 environmental_material  animal litter litter; litter/manure
ENVO_00003031 environmental_material  animal manure litter/manure
  environmental_site  animal pen  
FOODON_00002473 food_product  apple 
    apple (whole or parts)  apple
ENVO_00002196 environmental_material  aquarium  animalerie, aquariums.;aquarium water/tropical fish importer
  environmental_site  artificial wetland  
FOODON_00002426 food_product  arugula greens (raw)  arugula
  food_product  Atlantic shellfish food product atlantic shellfish products
  food_product  back  
FOODON_03302184 food_product  balut 
EOL_0001898 environmental_site  barn  #1barn 2; #1barn 3; #4barn 3,salm1; #4barn 3,salm2; 2-barn 8; 2-barn-5; 2006 barn #1; 2007 barn #c; 3-barn 6; 3-barn-6; barn - ovc; barn #1; barn #12; barn #2; barn #4; barn #5; barn #6; barn #6; mckinley hatchery; barn #7; barn #7 hatchery; barn #8; barn #9 rows c&d; barn 1; barn 1&2; barn 1097a; 1-8; barn 1097a; 9-17; barn 1097a: top; barn 1a; barn 2; barn 3; barn 3&4; barn 6; barn 8; barn a; barn and belts; barn b; barn ovc; barn t.w #4; barn-floor; barn-pig; barn, animal hospital; barn/enviromental; barn#10; barn#4; barn#54; barn#6; barn#7; barn#8; barn2, sample1; barn2, sample2; barn5; barn5 21417; barn6/7; barns 1&2
FOODON_00003044 food_product  basil 
FOODON_00002576 food_product  bean sprout bean sprouts
FOODON_00001041 food_product  beef  beef-10; beef-11; beef-12; beef-13; beef-14; beef-17; beef-21; beef-22; beef-23; beef-24; beef-33; beef-35; beef-38-2011; beef-43-2011; beef-5; beef-65; beef-7; beef-b1-2011; beef-b10-2009; beef-b10-2010; beef-b11-2009; beef-b11-2010; beef-b11-2011; beef-b11-2012; beef-b13-2011; beef-b15-2010; beef-b21-2010; beef-b22-2009; beef-b24-2010; beef-b26-2009; beef-b27-2010; beef-b32-2010; beef-b36-2010; beef-b37-2009; beef-b38-2010; beef-b38-2012; beef-b40-2010; beef-b40-2012; beef-b41-2009; beef-b43-2010; beef-b44-2009; beef-b47-2009; beef-b47-2010; beef-b47-2011; beef-b48-2009; beef-b49-2009; beef-b50-2010; beef-b51-2009; beef-b53-2011; beef-b54-2011; beef-b6-2009; beef-b6a-2009
  food_product  beef (ground or minced, Angus)  ground (angus)
  food_product  beef (ground or minced, boneless) cattle ground boneless
  food_product  beef (ground or minced, extra lean) cattle ground (extra lean); cattle ground (extra-lan); cattle ground (extra-lean); cattle ground( extra lean); cattle ground(extra lean); cattle groundextra lean)
  food_product  beef (ground or minced, lean) cattle ground ( lean); cattle ground (lean); cattle ground-lean; cattle ground(lean)
  food_product  beef (ground or minced, medium) cattle ground (medium); cattle ground( medium); cattle ground(medium)
  food_product  beef (ground or minced, regular)  cattle ground (regular); cattle ground regular; cattle ground-regular; cattle ground(regular)
  food_product  beef (ground or minced, Sirloin)  cattle ground (sirloin)
  food_product  beef (ground or minced) cattle ground
FOODON_00002737 food_product  beef hamburger (dish) 
    beef hamburger (dish) mild italian style burger
  food_product  beef rib (meat cut)   cattle ribs
  food_product  beef rib chop cattle rib chop
  food_product  beef roast  cattle roast
  food_product  beef shoulder (meat cut)  cattle shoulder
  food_product  beef shoulder chop (meat cut) cattle shoulder chop; cattle shoulder chop non-seasoned
  food_product  beef sirloin chop (meat cut)  cattle sirloin chop
  food_product  beef stew chunk stew chunks
  food_product  beef strip (meat cut) cattle strip
  food_product  beef tenderloin (meat cut)  cattle tender loin; cattle tenderloin
NCIT_C49844 environmental_material  belt  belt #7; belt 1-3; belt 4-6; belts 4; belts 6; belt #7 hatchery
  environmental_site  biodome 
ENVO_00002059 environmental_material  biosolids biosolid; biosolid/sludge
  environmental_material  bird feeder 
FOODON_00001650 food_product  black pepper  
UBERON_0000178  anatomical_material blood 
FOODON_00001564 food_product  blood meal  
UBERON_0001981  anatomical_part blood vessel  
UBERON_0006314  anatomical_material bodily fluid  cavity fluid (unspecified); cavity fluid unspecified; swab (tissue fluid-unspecified); body fluid/excretion
    bodily fluid  peritoneal fluid
FMA_260456  anatomical_material body cavity content cecal content; intestinal contents; stomach contents
UBERON_0001474  anatomical_part bone  
UBERON_0002371  anatomical_material bone marrow 
ENVO_02000054 food_product  bone meal 
  environmental_material  boot    boots
OBI_0002806 environmental_material  boot cover  bootie
UBERON_0000955  anatomical_part brain 
FOODON_00001183 food_product  bread cereal/bread/snack
  food_product  breast  
  food_product  breast (back off) breast back off
  food_product  breast (skinless, boneless) breast skinless boneless
  food_product  breast (skinless) breast skinless
  food_product  breast (with skin)  breast with skin
  environmental_site  breeder barn  
  environmental_site  breeder farm  breeder operation
FOODON_03530020 food_product  brisket 
  environmental_site  broiler barn  boiler barn
  environmental_material  broom 
ENVO_00000073 environmental_site  building  
ENVO_01000465 environmental_site  building wall wall; walls
  environmental_site  built environment surface surface - other; surface unspecified; unknown surface; working surface
FOODON_03309390 food_product  bulk grain  grain
  environmental_material  bulk tank 
  food_product  burger  
UBERON_0003903  anatomical_part bursa of Fabricius  bursa of fabricus
  environmental_site  butcher shop  boucherie; butchershop
UBERON_0001153  anatomical_part caecum  cecum; cecal content
FOODON_00002694 food_product  canola meal 
FOODON_00003577 food_product  cantaloupe (whole or parts) cantaloupe; cantelope
UBERON_0008979  anatomical_part carcass carcass (whole); whole carcass
FOODON_00001683 food_product  cardamom  cardemom
  food_product  carinata meal 
FOODON_00001709 food_product  cereal  cereal/bread/snack
FOODON_00001013 food_product  cheese  
  food_product  chia powder flax and chia powder
FOODON_00002961 food_product  chia seed (whole) chia seeds
  food_product  chia sprout chia sprouts
  environmental_material  chick box chick boxes
  environmental_material  chick pad chick pads
  food_product  chicken (ground or minced, boneless)  chicken ground boneless
  food_product  chicken (ground or minced, extra lean)  chicken ground (extra lean); chicken ground (extra-lan); chicken ground (extra-lean); chicken ground( extra lean); chicken ground(extra lean); chicken groundextra lean)
  food_product  chicken (ground or minced, lean)  chicken ground ( lean); chicken ground (lean); chicken ground-lean; chicken ground(lean)
  food_product  chicken (ground or minced, medium)  chicken ground (medium); chicken ground( medium); chicken ground(medium)
  food_product  chicken (ground or minced, regular) chicken ground (regular); chicken ground regular; chicken ground-regular; chicken ground(regular)
  food_product  chicken (ground or minced)  chicken ground
  food_product  chicken breast  
  food_product  chicken breast (back off) chicken breast back off
  food_product  chicken breast (skinless, boneless) chicken breast skinless boneless
  food_product  chicken breast (skinless) chicken breast skinless
  food_product  chicken breast (with skin)  chicken breast with skin
  food_product  chicken breast cutlet breast cutlets
  food_product  chicken breast skinless, boneless 
  food_product  chicken drumstick chicken drumsticks
  food_product  chicken drumstick (skinless)  chicken drumstick skinless
  food_product  chicken drumstick (with skin) chicken drumstick with skin
  food_product  chicken egg 
  food_product  chicken leg (meat cut)  chicken leg
  food_product  chicken leg (with skin) chicken leg with skin-drumstick and thigh
  food_product  chicken neck (meat cut) chicken necks
FOODON_00002672 food_product  chicken nugget  chicken nuggets
  food_product  chicken thigh (meat cut)  chicken thigh
  food_product  chicken thigh (skinless, boneless)  chicken thigh skinless boneless
  food_product  chicken thigh (skinless)  chicken thigh skinless
  food_product  chicken thigh (with skin) chicken thigh with skin
  food_product  chicken upper thigh (meat cut)  chicken upper thigh; chicken upper thight; chicken upperthigh
    chicken upper thigh (with skin) chicken upper thigh with skin
  food_product  chicken wing (meat cut) chicken wing; chicken wings
FOODON_03306811 food_product  chickpea (whole)  chickpea
FOODON_03315873 food_product  chili pepper  chilli pepper
  food_product  chive leaf (whole or parts) chives
  food_product  chop  chops
UBERON_0000162  anatomical_part cloaca  cloacae; cloacal swab
FOODON_03309861 food_product  coconut (whole or parts)  coconut
UBERON_0001155  anatomical_part colon 
UBERON_0001914  anatomical_material colostrum milk/colostrum
  host (common name)  companion animal  pet/zoo
  food_product  complete feed 
ENVO_00002170 environmental_material  compost 
  food_product  compound feed premix  premix
  food_product  compound feed premix (medicated)  premix (medicated)
FOODON_00001763 food_product  coriander 
  food_product  coriander powder  coriander-cumin powder
  food_product  coriander seed (whole)  coriander seeds
FOODON_03310791 food_product  corn (on-the-cob, kernel or parts)  corn
  environmental_site  cottage 
  environmental_site  countertop  animalerie, comptoir
  environmental_material  crate crates
  environmental_site  creek butternut creek, rte.800; canagagigue creek; canagugiue creek
AGRO_00000325 animal_or_plant_population  crop  
  food_product_properties cube  cubes
  food_product  cucumber (whole or parts) cucumber
  food_product  cumin powder  coriander-cumin powder
FOODON_00003396 food_product  cumin seed  cumin seeds
  food_product  curry leaf  curry leaves
FOODON_03301842 food_product  curry powder  currey powder
  food_product_properties cut 
FOODON_00003001 food_product  cutlet  
ENVO_00003862 environmental_site  dairy 
  food_product  dairy product dairy
  environmental_site  dead haul trailer dead haul truck / trailer
  environmental_site  dead haul truck dead haul truck / trailer
FOODON_03401298 food_product  dietary supplement  
UBERON_0001007  anatomical_part digestive system  digestive system (unspecified)
FOODON_03310090 food_product  dill spice  dill
  environmental_material  dumpster  
UBERON_0002114  anatomical_part duodenum  
ENVO_00002008 environmental_material  dust  
UBERON_0001690  anatomical_part ear 
  environmental_material  effluent  
  environmental_material  egg belt  
FOODON_03420194 food_product  egg or egg component  egg
UBERON_0007378  food_product  egg yolk  yolk
UBERON_0000922  anatomical_part embryo  fetus/embryo
  environmental_material  equipment 
UBERON_0001043  anatomical_part esophagus 
UBERON_0000174  anatomical_material excreta body fluid/excretion
UBERON_0000970  anatomical_part eye 
NCIT_C49947 environmental_material  fan 
ENVO_00000078 environmental_site  farm  (reprod) farm baril; (reprod) farm basil; (reprod) farm dan marc; (reprod) farm martineau; (reprod) farm martinenu; (reprod) farm mercier & allard; (reprod) farm ramsay; (reprod) farm val-rainville; (reprod) ferme martineau; (reprod) ferme mercier & allard; (reprod) ferme rainville; (reprod)farm martineau; (reprod)farm ramsay; acre t; acre t farms; acre-t; arand view farms; avitech farm; axisfarms; barber; barber farm; bel royal farm; bert fisher farm; bert fiswer; binning farm; birch tree farm; bourgeois dumont poultry farm; burnbrae farms ltd.; burnbrne farm
  food_product  feather meal  
  environmental_material  fecal slurry  
UBERON_0001988  body_product  feces stool; egg belt; pooled feces
  environmental_material  feed pan  feed pans
FOODON_03309953 food_product  fennel  
UBERON_0000323  anatomical_part / host_developmental_stage  fetus fetus/embryo; fetal tissue
FOODON_03530144 food_product  filet 
ENVO_00000294 environmental_site  fish farm allen's fisheries
FOODON_03301620 food_product  fish meal 
  food_product  flax powder flax and chia powder
ENVO_01000486 environmental_site  floor 
FOODON_00002713 food_product  food (ground) 
  food_product_properties food (non-seasoned) pig shoulder chop non-seasoned; shoulder chop non-seasoned; cattle shoulder chop non-seasoned
FOODON_03311126 food_product_properties food (raw)  raw
  food_product_properties food (soft) soft
UBERON_0002387  anatomical_part foot  
  environmental_material  freezer handle  -20°c freezer handle, rm 252
FOODON_03315615 food_product  fruit fruits and vegetables
UBERON_0002110  anatomical_part gall bladder  gallbladder
UBERON_0000045  anatomical_part ganglion  
FOODON_03301844 food_product  garlic powder 
UBERON_0004786  anatomical_part gastrointestinal system mucosa  mucous membrane (gut)
FOODON_03420102 food_product  germinated or sprouted seed sprouted seeds
FOODON_00001901 food_product  ginger  
UBERON_0005052  anatomical_part gizzard 
FOODON_00002695 food_product  green onion green onions
FOODON_03310765 food_product  greens (raw)  mixed salad/mixed greens
  food_product  ground meat (boneless)  ground boneless
  food_product  ground meat (extra lean)  ground (extra lean); ground (extra lean); ground (extra-lan); ground (extra-lean); ground extra lean; ground( extra lean); ground(extra lean); groundextra lean)
  food_product  ground meat (lean)  ground ( lean); ground (lean); ground (lean); ground-lean; ground(lean)
  food_product  ground meat (medium)  ground (medium); ground (medium); ground( medium); ground(medium)
  food_product  ground meat (regular) ground (regular); ground (regular); ground regular; ground-regular; ground(regular)
  food_product  ground meat (Sirloin) ground (sirloin)
ENVO_01001004 environmental_material  groundwater ground water
FOODON_00002502 food_product  ham 
ENVO_01001873 environmental_site  hatchery  10#56 hatchery; environment swab (hatchery); fluff (hatchery)
FOODON_00002933 food_product  hazelnut  hazelnut / filbert
FOODON_03315658 food_product  head cheese headcheese
UBERON_0000948  anatomical_part heart 
FOODON_03316061 food_product  hen egg (whole) shell egg
UBERON_0015757  anatomical_material heterogeneous tissue  mixed tissues
ENVO_00002173 environmental_site  hospital  ambo hospital
FOODON_00003049 food_product  hummus  
UBERON_0002116  anatomical_part ileum 
UBERON_0000160  anatomical_part intestine intestinal contents
  food_product_properties Italian-style mild italian style burger
UBERON_0002115  anatomical_part jejunum 
FOODON_00003501 food_product  kale leaf kale
  food_product  kalonji seed  kalonji whole seed
UBERON_0002113  anatomical_part kidney  
ENVO_01001406 environmental_site  laboratory facility laboratory
ENVO_00000020 environmental_site  lake  
OBI_0600044 collection_method lavage  levage/peritoneal; levage/tracheal
  food_product  lay ration (animal feed)  lay ration
  food_product  leg (meat cut, with skin) leg with skin-drumstick and thigh
  food_product  leg (meat cut)  leg
  food_product  leg (poultry meat cut, with skin) 
  food_product  leg (poultry meat cut)  
NCIT_C3824  anatomical_material lesion  growth / lesion (unspecified tissue); growth/lesion (unspecified tissue)
FOODON_00001998 food_product  lettuce 
  environmental_site  live hail trailer live haul truck/trailer
  environmental_site  live haul truck live haul truck/trailer
UBERON_0002107  anatomical_part; food_product liver 
  food_product  loin centre chop  loin center chop
  food_product  loin centre chop;food (non-seasoned)  loin center chop non-seasoned
UBERON_0002048  anatomical_part lung  
UBERON_0000029  anatomical_part lymph node  
FOODON_00002020 food_product  mango 
  food_product  mango (whole or parts)  mango
ENVO_01001872 environmental_site  manure pit  
  food_product  meal (animal feed)  unknown meal
FOODON_00001006 food_product  meat  mixed food/meat; muscle/meat
  food_product  meat (ground) ground
  food_product  meat (ribs) ribs
  food_product  meat (roasted)  roast
  food_product  meat (steak)  steak
FOODON_00002738 food_product  meat and bone meal  
  food_product  meat meal meat flour/meal
FOODON_03309475 food_product  meat trim trim
UBERON_0007109  body_product  meconium  
UBERON_0002509  anatomical_part mesenteric lymph node 
UBERON_0001913  anatomical_material milk  milk/colostrum
  food_product  milk, milk product or milk substitute milk
FOODON_00002432 food_product  mint  
  food_product  mixed food  mixed food/meat
  food_product  mixed sprouts 
UBERON_0000165  anatomical_part mouth 
UBERON_0000912  anatomical_material mucus 
FOODON_03301446 food_product  mung bean sprout  mung bean sprouts
UBERON_0002378  anatomical_part muscle of abdomen abdominal muscle
UBERON_0001630  anatomical_part muscle organ  muscle
UBERON_0002385  food_product  muscle tissue muscle/meat
  food_product  mushroom (whole or parts) mushrooms
FOODON_00002912 food_product  mutton  
UBERON_0035612  anatomical_part nasal turbinal  nasal turbinate
  food_product  neck (meat cut) necks
FOODON_03530294 food_product  neck (poultry meat cut) 
UBERON_0000004  anatomical_part nose  swab (nasal)
  food_product  nugget  nuggets
FOODON_00002073 food_product  oregano 
UBERON_0000062  anatomical_part organ organ unspecified; unknown organ; unspecified organ/tissue; organ/tissue
GENEPIO_0001117 anatomical_part organs or organ parts mixed organs
UBERON_0000992  anatomical_part ovary 
UBERON_0000993  anatomical_part oviduct 
UBERON_0002109  anatomical_part pair of nares nasal/naries
  food_product  papaya (whole or parts) papaya
FOODON_03301105 food_product  paprika 
UBERON_0001825  anatomical_part paranasal sinus sinus
ENVO_00000562 environmental_site  park  awash; awash park
FOODON_00002084 food_product  parsley 
  food_product  pea sprout  pea sprouts
FOODON_03306867 food_product  peanut butter 
FOODON_03301526 food_product  pepper (ground) ground pepper
  food_product  pepper powder 
FOODON_03311003 food_product  pepperoni 
UBERON_0002407  anatomical_part pericardium 
UBERON_0002358  anatomical_part peritoneum  levage/tracheal; peritoneal fluid
FOODON_00002682 food_product  pet food  
  environmental_site  pet store animalerie (canari); animalerie, aquariums.; animalerie, comptoir
MICRO_0001594 collection_device petri dish  contact plate; culture plate
  environmental_site  pigsty  "pigsty; (pigsty) a l'engrais; (pigsty) porcherie
UBERON_0001987  anatomical_part placenta  
UBERON_0000977  anatomical_part pleura  
  environmental_material  plucking belt 
NCIT_C45910 sample_processing pooled sample pooled feces
  food_product  pork (ground or minced, boneless) pig ground boneless
  food_product  pork (ground or minced, extra lean) pig ground (extra lean); pig ground (extra-lan); pig ground (extra-lean); pig ground( extra lean); pig ground(extra lean); pig groundextra lean)
  food_product  pork (ground or minced, lean) pig ground ( lean); pig ground (lean); pig ground-lean; pig ground(lean)
  food_product  pork (ground or minced, medium) pig ground (medium); pig ground( medium); pig ground(medium)
  food_product  pork (ground or minced, regular)  pig ground (regular); pig ground regular; pig ground-regular; pig ground(regular)
  food_product  pork (ground or minced, Sirloin)  pig ground (sirloin)
  food_product  pork (ground or minced) pig ground
FOODON_00001049 food_product  pork chop pork chop (cut unknown)
  food_product  pork rib (meat cut)   pork ribs
  food_product  pork rib chop pig rib chop
  food_product  pork roast  pig roast
  food_product  pork shoulder (meat cut)  pig shoulder
  food_product  pork shoulder chop (meat cut) pig shoulder chop; pig shoulder chop non-seasoned
  food_product  pork sirloin chop (meat cut)  pig sirloin chop
  food_product  pork strip (meat cut) pig strip
  food_product  pork tenderloin (meat cut)  pig tender loin; pig tenderloin
FOODON_00003469 food_product  poultry drumstick drumstick; drumsticks
  food_product  poultry drumstick (skinless)  drumstick skinless
  food_product  poultry drumstick (with skin) drumstick with skin
  food_product  poultry egg (shell on)  shell on
  food_product  poultry egg (whole, shell on) in-shell
UBERON_0008291  environmental_material  poultry fluff fluff; fluff (hatchery)
ENVO_01001874 environmental_site  poultry hatchery  atlantic poultry; chick hatchery; barn #7 hatchery; belt #7 hatchery; cages 1-2; chick hatchery; pullet barn; cages 3; chick hatchery; pullet barn
  environmental_material  poultry plucking water  plucking water
  food_product  poultry thigh (meat cut)  thigh
  food_product  poultry thigh (skinless, boneless)  thigh skinless boneless
  food_product  poultry thigh (skinless)  thigh skinless
  food_product  poultry thigh (with skin) thigh with skin
  food_product  poultry upper thigh (meat cut)  upper thigh; upper thight
  food_product  poultry upper thigh (with skin) upper thigh with skin
FOODON_03530157 food_product  poultry wing (meat cut) wing; wings
  food_product  rasam powder  rasam powder spice
UBERON_0001052  anatomical_part rectum  rectal swab; swab (rectal)
  food_product  red veal  
UBERON_0004785  anatomical_part respiratory system mucosa mucous membrane (resp)
  food_product  rib chop  
GENEPIO_0002749 collection method rinse final wash
ENVO_00000022 environmental_site  river river surface; surface - river
UBERON_0007365  anatomical_part rumen 
FOODON_00002217 food_product  sage  
FOODON_03316042 food_product  salad mixed salad/mixed greens
FOODON_03312067 food_product  salami  
FOODON_00001007 food_product  sausage 
  food_product  scallopini squash (whole or parts)  scallopini
ENVO_00002007 environmental_material  sediment  
FOODON_03310306 food_product  sesame seed 
  environmental_site  sheep barn  bergerie; bergerie a saint-cuthbert; bergerie a st-barthelemy; bergerie a st-zenon-du-lac-humqui
  environmental_material  shelf shelf / sill
UBERON_0006612  anatomical_part shell 
FOODON_03411433 food_product  shellfish 
ENVO_00002221 environmental_site  shop  aquarium water/tropical fish importer
FOODON_03530043 food_product  shoulder (meat cut) shoulder
  food_product  shoulder chop (meat cut)  shoulder chop; shoulder chop non-seasoned
  food_product  sirloin chop (meat cut) sirloin chop
UBERON_0000982  anatomical_part skeletal joint  joint
  food_product  skim milk powder  
UBERON_0002097  anatomical_part skin of body  skin
ENVO_00002044 environmental_material  sludge  biosolid/sludge
UBERON_0002108  anatomical_part small intestine 
FOODON_03315013 food_product  snack food  cereal/bread/snack
ENVO_00001998 environmental_material  soil  
FOODON_03301415 food_product  soybean 
FOODON_03302757 food_product  soybean meal  soyabean meal
FOODON_00001242 food_product  spice or herb herb/spice (unspecified); herbs and spices
FOODON_00002269 food_product  spinach 
UBERON_0002240  anatomical_part spinal cord 
UBERON_0002106  anatomical_part spleen  
FOODON_03420183 food_product  sprout  sprouts
EOL_0001903 environmental_site  stall 
  food_product  starter ration (animal feed)  starter ration
UBERON_0000945  anatomical_part stomach stomach contents
  food_product  strip (meat cut)  strip
NCIT_C18066 environmental_site  supermarket supermarket - a; retail outlet; supermarket - b; retail outlet; supermarket - c; retail outlet; supermarket - d; retail outlet; supermarket - e; retail outlet; supermarket - f; retail outlet; supermarket - g; retail outlet; supermarket - h; retail outlet; supermarket - i
  environmental_material  surface runoff  run off
ENVO_00002042 environmental_material  surface water 
OBI_0002820 collection_device swab  environment swab; environment swab (hatchery); swab (nasal); rectal swab; swab (rectal); swab #3; swab #5; swab 1; swab 2; swab 3; swab 4; swab (tissue fluid-unspecified); cloacal swab
UBERON_0001090  anatomical_material synovial fluid  joint fluid
FOODON_03304154 food_product  tahini  
  food_product  tenderloin (meat cut) tender loin; tenderloin
UBERON_0000473  anatomical_part testis  testicle
  food_product  thigh (meat cut)  t. high
UBERON_0000915  anatomical_part thoracic segment of trunk thorax
UBERON_0000479  anatomical_material tissue  fetal tissue; organ/tissue; swab (tissue fluid-unspecified)
  food_product  tomato (whole or parts) tomato
UBERON_0003126  anatomical_part trachea levage/tracheal
  environmental_site  trailer truck / trailer; truck/trailer
  environmental_material  transformer 
  animal_or_plant_population  tropical fish aquarium water/tropical fish importer
ENVO_01000602 environmental_site  truck camion (truck); truck / trailer; truck/trailer
MONDO_0005070 anatomical_material tumour  growth / lesion (unspecified tissue); growth/lesion (unspecified tissue)
FOODON_03414166 food_product  turkey  aviaire dinde
  food_product  turkey (ground or minced, boneless) turkey ground boneless
  food_product  turkey (ground or minced, extra lean) turkey ground (extra lean); turkey ground (extra-lan); turkey ground (extra-lean); turkey ground( extra lean); turkey ground(extra lean); turkey groundextra lean)
  food_product  turkey (ground or minced, lean) turkey ground ( lean); turkey ground (lean); turkey ground-lean; turkey ground(lean)
  food_product  turkey (ground or minced, medium) turkey ground (medium); turkey ground( medium); turkey ground(medium)
  food_product  turkey (ground or minced, regular)  turkey ground (regular); turkey ground regular; turkey ground-regular; turkey ground(regular)
  food_product  turkey (ground or minced) turkey ground
  food_product  turkey breast 
  food_product  turkey breast (back off)  turkey breast back off
  food_product  turkey breast (skinless, boneless)  turkey breast skinless boneless
  food_product  turkey breast (skinless)  turkey breast skinless
  food_product  turkey breast (with skin) turkey breast with skin
  food_product  turkey drumstick  turkey drumsticks
  food_product  turkey drumstick (skinless) turkey drumstick skinless
  food_product  turkey drumstick (with skin)  turkey drumstick with skin
  food_product  turkey egg  
  food_product  turkey leg (meat cut) turkey leg
  food_product  turkey leg (with skin)  turkey leg with skin-drumstick and thigh
  food_product  turkey neck (meat cut)  turkey necks
  food_product  turkey nugget turkey nuggets
  food_product  turkey thigh (meat cut) turkey thigh
  food_product  turkey thigh (skinless, boneless) turkey thigh skinless boneless
  food_product  turkey thigh (skinless) turkey thich skinless
  food_product  turkey thigh (with skin)  turkey thigh with skin
  food_product  turkey upper thigh (meat cut) turkey upper thigh; turkey upper thight; turkey upperthigh
  food_product  turkey upper thigh (with skin)  turkey upper thigh with skin
  food_product  turkey wing (meat cut)  turkey wing; turkey wings
FOODON_00002323 food_product  turmeric  
  food_product  upper thigh (meat cut)  upperthigh
UBERON_0001255  anatomical_part urinary bladder bladder
UBERON_0001088  body_product  urine 
UBERON_0000995  anatomical_part uterus  
UBERON_0000996  anatomical_part vagina  
FOODON_00003083 food_product  veal  
FOODON_00001261 food_product  vegetable fruits and vegetables
  food_product  walnut (whole or parts) walnut; wallnut
ENVO_00002001 environmental_material  wastewater  waste water
CHEBI_15377 environmental_material  water aquarium water/tropical fish importer
ENVO_01001191 environmental_site  water surface river surface; surface - river
  environmental_material  watering bowl   watering bowl/equipment
  environmental_material  weep fluid  weep
FOODON_00002361 food_product  white pepper  
  food_product  white veal  
  environmental_site  window sill shelf / sill
FOODON_03411345 food_product  yeast 
UBERON_0001040  anatomical_part yolk sac  
ENVO_00010625 environmental_site  zoo pet/zoo; calgary zoo`,
  }
};
