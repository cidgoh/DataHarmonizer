import $ from 'jquery';
import {deleteEmptyKeyVals, setJSON} from '../lib/utils/general';
import YAML from 'yaml';

export class SchemaEditor {

	/** DH Tab maps to schema.extensions.locales.value[locale][part][key1][part2][key2] 
	* The key names link between locales hierarchy part dictionary keys and the
	* DH row slots that user is focused on.
	* tab: [schema_part, key1, [part2, key2], [attribute_list]
	*/
	TRANSLATABLE = {
	'Schema':   [null, null, null, null, ['description']],
	'Class':    ['classes', 'name', null, null, ['title','description']],
	'Slot':     ['slots', 'name', null, null, ['title','description','comments','examples']],
	'Enum':     ['enums', 'name', null, null, ['title','description']],
	'SlotUsage': ['classes', 'class_id', 'slot_usage', 'slot_id', ['title','description','comments','examples']],
	'PermissibleValue': ['enums', 'enum_id', 'permissible_values', 'text', ['title','description']]
	}

	// These are SchemaEditor dynamically handled menu items: A schema's classes, data types, slots, and slot groups vary.
	// In contrast, the SchemaSlotTypeMenu is constant across all schemas, and so is not in this list.
	SCHEMAMENUS = ['SchemaDataTypeMenu','SchemaClassMenu','SchemaSlotMenu','SchemaSlotGroupMenu','SchemaEnumMenu'];

	constructor(schema, context) {
		this.schema = schema;
		this.context = context;
	}


  initMenus() {
		this.SCHEMAMENUS.forEach((item) => {
			if (!(item in this.schema.enums)) {
				// Permissible_values are computed later when a particular schema is loaded.
				this.schema.enums[item] = {name: item}; 
			}
		});
	}

	/** Schema editor functionality: This function refreshes both the given 
	* enumeration menu (or default list of them), and ALSO updates the slot 
	* select/multiselect lists that reference them, for editing purposes.
	* 
	* 1) Regenerate given menus
	*    CASE A: No schema loaded.  Revert to dh.schema for source of types, 
	*      classes, enums.
	*    CASE B: A schema has been loaded.  In addition to dh.schema data types, 
	*      Use Class & Enum template hot data.
	* 
	* 2) Find any DH class / tab's slot that mentions changed enums, and 
	*      regenerate its "cached" flatVocabulary etc.
	* 
	* @param {Array} enums list of special enumeration menus. Default list
	* covers all menus that schema editor might have changed dynamically.
	*/
	refreshMenus(enums = this.SCHEMAMENUS) {

	 // If an instance of schema editor has been created.
	if (this.context.schemaEditor) {

	  const schema = this.schema;
	  for (const enum_name of enums) {
	    // Initialize TypeMenu, ClassMenu and EnumMenu

	    let user_schema_name = this.getSchemaEditorSelectedSchema();
	    if (!user_schema_name)
	    	user_schema_name = 'DH_LinkML';

	    const permissible_values = {};

	    switch (enum_name) {

	      case 'SchemaDataTypeMenu':

	        // This is list of basic LinkML types imported via DH_LinkML spec
	        // (Including a few - provenance and WhitespaceMinimizedString -
	        // that DH offers).
	        Object.entries(schema.types).forEach(([data_type, type_obj]) => {
	          permissible_values[data_type] = {
	            name: type_obj.name, 
	            text: data_type, 
	            description: type_obj.description || ''
	          };
	        });

	        // FUTURE: Extend above types with menu of user-defined types.
	        break;

	      case 'SchemaClassMenu':
	        // Get the classes from the Classes tab, filtered for schema_name
	        // selected in Schema tab.
	        this.getDynamicMenu(schema, schema.classes, 'Class', user_schema_name, permissible_values);
	        break;

	      case 'SchemaEnumMenu':
	        // Get the enums from the Enums tab, filtered for schema
	        // selected in Schema tab.
	        this.getDynamicMenu(schema, schema.enums, 'Enum', user_schema_name, permissible_values);
	        break;

	      case 'SchemaSlotMenu':
	        // Get the enums from the Enums tab, filtered for schema
	        // selected in Schema tab.
	        this.getDynamicMenu(schema, schema.slots, 'Slot', user_schema_name, permissible_values);
	        break;

	      case 'SchemaSlotGroupMenu':
	        /** Fabricate list of pertinent SchemaSlotGroupMenu. This will be
	         * all distinct slot_group entries mentioned in all schema classes,
	         * or will be filtered by user's selected Table/class tab class.
	         * slot_group values and make menu for it. 
	         * FUTURE: perhaps separate tab for managing possible slot_group
	         */ 

	        const filter = {
	          schema_id: this.getSchemaEditorSelectedSchema(), 
	          //slot_type: 'slot_usage' // FUTURE, allow ['slot_usage','attribute']
	        }

	        // If user selected a class name on Table tab, then Field tab will
	        // focus on just that class, and so menu should filter down to rows
	        // that only mention selected class.
	        const class_name = this.getSchemaEditorSelectedClass();
	        if (class_name > '') {
	          filter.class_name = class_name;
	        }

	        const slot_rows = this.context.crudFindAllRowsByKeyVals('Slot', filter);
	        const slot_dh = this.context.dhs['Slot'];
	        const slot_group_ptr = slot_dh.slot_name_to_column['slot_group'];

	        // Inefficient insofar as every row examined, with many repeated
	        // slot_groups encountered.
	        // Slot group textual name is being used as key in permissible_values object.
	        // FUTURE: organize field group menu by Slot tab Display filters
	        // rather than Table tab selection.
	        // care of situation where users are comparing classes class for situation where 
	        for (let row of slot_rows) {
	        	const slot_group_text = slot_dh.hot.getDataAtCell(row, slot_group_ptr);
	        	if (slot_group_text && !(slot_group_text in permissible_values)) {
	            	permissible_values[slot_group_text] = {text: slot_group_text, title: slot_group_text};
	          	}
	        };

	        //console.log("DYNAMIC", class_name, filter, slot_rows, permissible_values, slot_dh.slots[slot_group_ptr])
	        break;

	    }

	    // ISSUE: Handsontable multiselect elements behaving differently from pulldowns.
	    // CANT dynamically reprogram dropdown single selects
	    // ONLY reprogrammable for multiselects. 
	    // Reset menu's permissible_values to latest.
	    if (! (enum_name in schema.enums)) {
	      //console.log("Adding enumeration", enum_name);
	      schema.enums[enum_name] = {name: enum_name};

	    }
	    schema.enums[enum_name].permissible_values = permissible_values;

	  }

	  // Then trigger update for any slot that has given menu in range.
	  // Requires scanning each dh_template's slots for one that mentions
	  // an enums enum, and updating each one's flatVocabulary if found.
	  for (let tab_dh of Object.values(this.context.dhs)) {
	    const Cols = tab_dh.columns;
	    let change = false;
	    for (let slot_obj of Object.values(tab_dh.slots)) {
	      for (let slot_enum_name of Object.values(slot_obj.sources || {})) {
	        // Found a regenerated enum from above so recalculate slot lookups
	        if (enums.includes(slot_enum_name)) {
	          this.context.setSlotRangeLookup(slot_obj);
	          if (slot_obj.sources) {
	            //FUTURE: tab_dh.hot.propToCol(slot_obj.name) after Handsontable col.data=[slot_name] implemented
	            const meta = tab_dh.hot.getColumnMeta(tab_dh.slot_name_to_column[slot_obj.name]);
	            meta.source = tab_dh.updateSources(slot_obj);
	          }
	          break;
	        }
	      }
	    }
	  }
	}
	}

	getSchemaEditorSelectedSchema() {
		const dh = this.context.dhs['Schema'];
		return dh.hot.getDataAtCell(dh.current_selection[0], dh.slot_name_to_column['name']);
	}

	getSchemaEditorSelectedClass() {
		const dh = this.context.dhs['Class'];
		return dh.hot.getDataAtCell(dh.current_selection[0], dh.slot_name_to_column['name']);
	}


	/** For generating permissible_values for SchemaSlotTypeMenu, SchemaClassMenu,
	* SchemaEnumMenu menus from schema editor schema or user schema.
	*/
	getDynamicMenu(schema, schema_focus, template_name, user_schema_name, permissible_values) {   
		// When does this case ever happen?
		if (user_schema_name === 'DH_LinkML') {
		  for (let focus_name of Object.keys(schema_focus)) {
		    permissible_values[focus_name] = {
		      name: focus_name,
		      text: focus_name,
		      description: schema_focus[focus_name].description
		    }
		  }
		}
		else {
		  let focus_dh = this.context.dhs[template_name];
		  let name_col = focus_dh.slot_name_to_column['name'];
		  let description_col = focus_dh.slot_name_to_column['description'];
		  for (let row in this.context.crudFindAllRowsByKeyVals(template_name, {schema_id: user_schema_name})) {
		    let focus_name = focus_dh.hot.getDataAtCell(row, name_col);
		    if (focus_name) {//Ignore empty class_name field
		      permissible_values[focus_name] = {
		        name: focus_name,
		        text: focus_name,
		        description: focus_dh.hot.getDataAtCell(row, description_col)
		      }
		    }
		  }
		}
	}

	translationForm(dh) {

	    const schema = dh.context.dhs.Schema;
	    // Each schema_editor schema has locales object stored in its first
	    // row cell metadata. Issue: if a schema has lost focus, and instead
	    // all schemas are selected ...
	    const schema_row = schema.current_selection[0];
	    if (schema_row < 0) {
	      alert("In order to see the translation form, first select a row with a schema that has locales.")
	      return false;
	    }
	    const locales = schema.hot.getCellMeta(schema_row, 0).locales;
	    if (!locales) {
	      alert("In order to see the translation form, first select a row with a schema that has locales.")
	      return false;
	    }

	    let locale_map = dh.schema.enums?.LanguagesMenu?.permissible_values || {};

	    const locale_field = schema.slot_name_to_column['in_language'];
	    const language_code = schema.hot.getDataAtCell(schema_row, locale_field);
	    const default_language = language_code in locale_map ? locale_map[language_code].title : language_code;

	    // Translation table form for all selected rows.
	    const [schema_part, key_name, sub_part, sub_part_key_name, text_columns] = this.TRANSLATABLE[dh.template_name];

	    let translate_rows = '';

	    // Provide translation forms for user selected range of rows
	    for (let row = dh.current_selection[0]; row <= dh.current_selection[2]; row++) {

	      // 1st content row of table shows english or default translation.
	      let default_row_text = '';
	      let translatable = '';
	      let column_count = 0;
	      for (var column_name of text_columns) {
	        column_count ++;
	        let col = dh.slot_name_to_column[column_name];
	        // Tabular slot_usage may inherit empty values.
	        let text = dh.hot.getSourceDataAtCell(dh.hot.toPhysicalRow(row), col) || '';
	        default_row_text += `<td>${text}</td>`;
	        translatable += text + '\n';
	      }

	      // Key for class, slot, enum:
	      const key = dh.hot.getDataAtCell(row, dh.slot_name_to_column[key_name], 'lookup');
	      let key2 = null;
	      if (sub_part_key_name) {
	        key2 = dh.hot.getDataAtCell(row, dh.slot_name_to_column[sub_part_key_name], 'lookup');
	        if (!key2) {
	          console.log("key2",key2, "lookup from", this.TRANSLATABLE[dh.template_name]);
	          alert("unable to get key2 from lookup of:" + sub_part_key_name)
	        }
	      }

	      if (key) {
	        translate_rows += `<tr class="translate translate_key"><td colspan="${column_count+2}">${key}${key2 ? ' /' + key2 : ''}</td></tr>`;
	      }

	      translate_rows += `<tr class="translate"><td nowrap>${default_language}</td>${default_row_text}<td></td></tr>`; 
	      
	      // DISPLAY locale for each schema in_language menu item
	      for (const [locale, locale_schema] of Object.entries(locales)) {
	        let translate_cells = '';
	        let translate_text = '';
	        let path = '';
	        for (let column_name of text_columns) {
	          // If items are in a component of class, like slot_usage or permissible_values
	          // schema_part='enums', id='enum_id', 'permissible_values', 'name',
	          // Translations can be sparse/incomplete
	          let value = null;
	          if (sub_part) {
	            // Sparse locale files might not have particular fields.
	            value = locale_schema[schema_part]?.[key]?.[sub_part]?.[key2]?.[column_name] || '';
	            path = `${locale}.${schema_part}.${key}.${sub_part}.${key2}.${column_name}`;
	          }
	          else if (schema_part) {
	            value = locale_schema[schema_part]?.[key]?.[column_name] || '';
	            path = `${locale}.${schema_part}.${key}.${column_name}`;
	          }
	          else { // There should always be a locale_schema 
	            value = locale_schema?.[column_name] || '';
	            path = `${locale}.${column_name}`;
	          }

	          if (!!value && Array.isArray(value) && value.length > 0) {
	            // Some inputs are array of [{value: ..., description: ...} etc.
	            if (typeof value[0] === 'object')
	              value = Object.values(value).map((x) => x.value).join(';');
	            else
	              value = value.join(';')
	          }

	          translate_cells += `<td><textarea name="${column_name}" data-path="${path}">${value}</textarea></td>`;
	        }
	        // Because origin is different, we can't bring google 
	        // translate results directly into an iframe.
	        let translate = `<button type="button" onclick="return !window.open('https://translate.google.com/?sl=${schema.schema.in_language}&tl=${locale}&op=translate&text=${encodeURI(translatable)}', 'translate', 'popup, width=1000, height=600, toolbar=no');">google</button>`;
	        const trans_language = locale_map[locale].title;
	        translate_rows += `<tr class="translation-input"><td><b>${trans_language}</b></td>${translate_cells}<td>${translate}</td></tr>`;
	      }
	    };

	    $('#translate-modal-content').html(
	      `<div>
	        <table>
	          <thead>
	            <tr>
	              <th class="locale">locale</th>
	              <th>${this.TRANSLATABLE[dh.template_name][4].join('</th><th>')}</th>
	              <th>translate</th>
	            </tr>
	          </thead>
	          <tbody>
	            ${translate_rows}
	          </tbody>
	        </table>
	      </div>`
	    );
	    $('#translate-modal').modal('show');
	}

  /**
   * Enacts change to a classes' locales with appropriate creation or 
   * deletion.
   */
  setLocales(changes) {
  	const dh_schema = this.context.dhs.Schema;

    let old_langs = changes.locales.old_value 
      ? new Set(changes.locales.old_value.split(';')) 
      : new Set();
    let new_langs = changes.locales.value 
      ? new Set(changes.locales.value.split(';')) 
      : new Set();
    let deleted = Array.from(old_langs.difference(new_langs).keys());
    let created = Array.from(new_langs.difference(old_langs).keys());

    // If old language has been dropped or a new one added, prompt user:
    if (deleted.length || created.length) {
      let locale_map = this.schema.enums?.LanguagesMenu?.permissible_values || {};
      let deleted_titles = deleted.map((item) => locale_map[item]?.title || item);
      let created_titles = created.map((item) => locale_map[item]?.title || item);

      let message = `Please confirm that you would like to: \n\n`;
      if (deleted.length) {
        message += `DELETE A LOCALE AND ALL ITS TRANSLATIONS for: ${deleted_titles.join('; ')}\n\n`;
      }
      if (created.length) {
        message += `ADD LOCALE(s): ${created_titles.join('; ')}`;
      }
      let proceed = confirm(message);
      if (!proceed) return false;

      const locales = dh_schema.getLocales();
      for (const locale of deleted) {
        delete locales[locale];
      }
      // An empty locale branch.
      for (const locale of created) {
        locales[locale] = {};
      }
    }
    return true;
  };

  /* Empty table render will still trigger .cells () for all row 0 columns 
  */
	initTab (dh, class_name, hot_settings) {

		if (class_name === 'Slot') {
		  const slot_table_attribute_column = ['rank','slot_group','inlined','inlined_as_list'].map((x) => dh.slot_name_to_column[x]);

		  // See https://forum.handsontable.com/t/how-to-unhide-columns-after-hiding-them/5086/6
		  hot_settings.contextMenu.items['hidden_columns_hide'] = {};
		  hot_settings.contextMenu.items['hidden_columns_show'] = {};
		  // Could be turning off/on based on expert user
		  hot_settings.hiddenColumns = {
		    // set columns that are hidden by default
		    columns: slot_table_attribute_column,
		    indicators: false
		  }

		  hot_settings.fixedColumnsLeft = 4; // Freeze both schema and slot name.

		  // function(row, col, prop) has prop == column name if implemented; otherwise = col #
		  // In some report views certain kinds of row are readOnly, e.g. Schema
		  // Editor schema slots if looking at a class's slot_usage slots.
		  // Issue: https://forum.handsontable.com/t/gh-6274-best-place-to-set-cell-meta-data/4710
		  // We can't lookup existing .getCellMeta() without causing stack overflow.
		  // ISSUE: We have to disable sorting for 'Slot' table because 
		  // separate reporting controls are at work.

		  // ASSUMES VISUAL alphabetical order with schema fields at top
		  const slot_editable_keys = [dh.slot_type_column, dh.slot_class_name_column, dh.slot_name_column];
		  console.log("KEYS", slot_editable_keys);


		  // ISSUE: user clicking on "toggle expert user mode" doesn't visually
		  // take effect until after dh.render(), so cellProp.readOnly doesn't 
		  // work right away.
		  hot_settings.cells = function(row, col) { 
		    let cellProp = {};
		    let read_only = false;

		    // slot, slot_usage, attribute
		    let slot_type = dh.hot.getSourceDataAtCell(row, dh.slot_type_column);
		    cellProp.className = 'tabFieldTd_' + slot_type; 
		    const visual_row = dh.hot.toVisualRow(row);

				if (col in [dh.schema_name_column]) { // 0th column usually.
					read_only = true;
				}

			  if (slot_type === 'slot' && !dh.context.expert_user) {
			  	read_only = true;
			  }

				if (slot_type === 'slot_usage') {
					//console.log("TESTING", col, slot_editable_keys, slot_editable_keys.includes(col))
					if (slot_editable_keys.includes(col)) {

			    	read_only = false;
					}

					// INHERIT read-only from slot fields.
		    	// If previous row has type 'slot' and same 'name'    
					else
				    if (read_only === false && visual_row > 0) {
				    	// Source data or visual data?
				    	const  this_slot_name = dh.hot.getDataAtCell(visual_row, dh.slot_name_column);
				    	const  prev_slot_name = dh.hot.getDataAtCell(visual_row-1, dh.slot_name_column);
					    if (this_slot_name === prev_slot_name) {
					    	const prev_slot_type = dh.hot.getDataAtCell(visual_row-1, dh.slot_type_column);
					    	const prev_value = dh.hot.getDataAtCell(visual_row-1, col);
					    	if (prev_value && prev_slot_type === 'slot' && slot_type == 'slot_usage') {
					    		read_only = true;
					    		cellProp.className += ' inherited'
					    	}
					    }
					  }
				}

		    /* Handsontable assigns .htDimmed to any cell with .readOnly = true
				 * see https://handsontable.com/docs/javascript-data-grid/disabled-cells/
		     */
		    cellProp.readOnly = read_only;

		    return cellProp;
		  }
      
		  hot_settings.multiColumnSorting = {
		    // let the end user sort data by clicking on the column name (set by default)
		    headerAction: false,
		    // don't sort empty cells – move rows that contain empty cells to the bottom (set by default)
		    sortEmptyCells: false,
		    // enable the sort order icon that appears next to the column name (set by default)
		    indicator: false,
		  }

		  // Somehow putting this into multiColumnSorting.initConfig {} doesn't
		  // enable memory of it, as though init config is being wiped out.
		  dh.defaultMultiColumnSortConfig = [
		    {
		      column: 3, // slot.name
		      sortOrder: 'asc'
		    },
		    /*
				{
			    column: 1, // slot type
			    sortOrder: 'asc'
			  }, 
			  {
			    column: 3, // schema
			    sortOrder: 'asc'
			  }
			  */
	  	];
		}
		else {}
	}

	// The opposite of loadSchemaYAML!
	saveSchema () {
		/*
		if (!this.context.schemaEditor) {
		  alert('This option is only available while in the DataHarmonizer schema editor.');
		  return false;
		}
		*/

		// User-focused row gives top-level schema info:
		let dh_schema = this.context.dhs.Schema;
		let schema_focus_row = dh_schema.current_selection[0];
		let schema_name = dh_schema.hot.getDataAtCell(schema_focus_row, 0);
		if (schema_name === null) {
		  alert("The currently selected schema needs to be named before saving.");
		  return;
		}
		let save_prompt = `Provide a name for the ${schema_name} schema YAML file. This will save the following schema parts:\n`;

		let [save_report, confirm_message] = dh_schema.getChangeReport('Schema');

		// prompt() user for schema file name.
		let file_name = prompt(save_prompt + confirm_message, 'schema.yaml');

		if (!file_name) 
		  return false;

		/** Provide defaults here in ordered object prototype so that saved object
		 * is consistent.  At class and slot level ordered object prototypes are
		 * also used, but empty values are cleared out at bottom of save script.
		 */
		let new_schema = new Map([
		  ['id', ''],
		  ['name', ''],
		  ['description', ''],
		  ['version', ''],
		  ['in_language', 'en'],
		  ['default_prefix', ''],
		  ['imports', ['linkml:types']],
		  ['prefixes', {}],
		  ['classes', new Map()],
		  ['slots', new Map()],
		  ['enums', {}],
		  ['types', {
		    WhitespaceMinimizedString: {
		      name: 'WhitespaceMinimizedString',
		      typeof: 'string',
		      description: 'A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).',
		      base: 'str',
		      uri: 'xsd:token'
		    },
		    Provenance: {
		      name: 'Provenance',
		      typeof: 'string',
		      description: 'A field containing a DataHarmonizer versioning marker. It is issued by DataHarmonizer when validation is applied to a given row of data.',
		      base: 'str',
		      uri: 'xsd:token'
		    }   
		  }],
		  ['settings', {}],
		  ['extensions', {}]
		]);

		// Loop through loaded DH schema and all its dependent child tabs.
		let components = ['Schema', ... Object.keys(this.context.relations['Schema'].child)];
		for (let [ptr, tab_name] of components.entries()) {
		  // For Schema, key slot is 'name'; for all other tables it is 
		  // 'schema_id' which has a foreign key relationship to schema
		  let schema_key_slot = (tab_name === 'Schema') ? 'name' : 'schema_id';
		  let rows = this.context.crudFindAllRowsByKeyVals(tab_name, {[schema_key_slot]: schema_name}) 
		  let dependent_dh = this.context.dhs[tab_name];

		  // Schema | Prefix | Class | UniqueKey | Slot | Annotation | Enum | PermissibleValue | Setting | Extension
		  for (let dep_row of rows) {
		    // Convert row slots into an object for easier reference.
		    let record = {};
		    for (let [dep_col, dep_slot] of Object.entries(dependent_dh.slots)) {
		      // 'row_update' attribute may avoid triggering handsontable events
		      let value = dependent_dh.hot.getDataAtCell(dep_row, dep_col, 'reading');
		      if (value !== undefined &&  value !== '') { //.length > 0 // took out !!value - was skipping numbers.
		        // YAML: Quotes need to be stripped from boolean, Integer and decimal values
		        // Expect that this datatype is the first any_of range item.        
		        // ALL multiselect values are converted to appropriate array or
		        // key/value pairs as detailed below.
		        record[dep_slot.name] = setJSON(value, dep_slot.datatype);
		      }
		    }

		    // Do appropriate constructions per schema component
		    let target_obj = null;
		    switch (tab_name) {
		      case 'Schema':
		        //console.log("SCHEMA",tab_name, {... record})
		        this.copyAttributes(tab_name, record, new_schema, 
		          ['id','name','description','version','in_language','default_prefix']);

		        // TODO Ensure each Schema.locales entry exists under Container.extensions.locales...

		        break;

		      case 'Prefix':
		        new_schema.get('prefixes')[record.prefix] = record.reference;
		        break;

		      case 'Class': // Added in order
		        target_obj = this.getClass(new_schema, record.name);
		        // ALL MULTISELECT ';' delimited fields get converted back into lists.
		        if (record.see_also)
		            record.see_also = this.getArrayFromDelimited(record.see_also);
		        if (record.tree_root)
		          record.tree_root = this.setToBoolean(record.tree_root);

		        this.copyAttributes(tab_name, record, target_obj, 
		          ['name','title','description','version','class_uri','is_a','tree_root','see_also']
		        );

		        break;

		      case 'UniqueKey':
		        let class_record = this.getClass(new_schema, record.class_name);
		        if (!class_record.get('unique_keys'))
		           class_record.set('unique_keys', {});

		        target_obj = class_record.get('unique_keys')[record.name] = {
		          unique_key_slots: record.unique_key_slots.split(';') // array of slot_names
		        }
		        this.copyAttributes(tab_name, record, target_obj, 
		          ['description','notes']);
		        break;

		      case 'Slot':
		        if (record.name) {

		          let slot_name = record.name;
		          let su_class_obj = null;
		          if (['slot_usage','attribute'].includes(record.slot_type)) {
		            // Error case if no record.class_name.
		            su_class_obj = this.getClass(new_schema, record.class_name);
		          }
		          switch (record.slot_type) {

		            // slot_usage and attribute cases are connected to a class
		            case 'slot_usage': 
		              su_class_obj.get('slots').push(slot_name);
		              target_obj = su_class_obj.get('slot_usage')[slot_name] ??= {
		                name: slot_name,
		                rank: Object.keys(su_class_obj.get('slot_usage')).length + 1
		              };
		              break;

		            case 'attribute':
		              // See https://linkml.io/linkml/intro/tutorial02.html for Container objects.
		              // plural attributes
		              target_obj = su_class_obj.get('attributes')[slot_name] ??= {
		                name: slot_name,
		                rank: Object.keys(su_class_obj.get('attributes')).length + 1
		              }; 
		              break;

		            // Defined as a Schema slot in case where slot_type is empty:
		            case 'slot':
		            default: 
		              target_obj = this.getSlot(new_schema, slot_name);
		              //target_obj = new_schema.get('slots')[slot_name] ??= {name: slot_name};
		              break;
		          }

		          let ranges = record.range?.split(';') || [];
		          if (ranges.length > 1) {
		            //if (ranges.length == 1)
		              //target_obj.range = record.range;
		              //record.any_of = {};
		            //else { // more than one range here
		              //array of { range: ...}
		              //target_obj.any_of = ranges.map(x => {return {range: x}});
		            record.any_of = ranges.map((x) => {return {'range': x}}); //{return {range: x}});
		            record.range = '';
		            //}
		          };

		          if (record.aliases)
		            record.aliases = this.getArrayFromDelimited(record.aliases);
		          if (record.todos)
		            record.todos = this.getArrayFromDelimited(record.todos);
		          if (record.exact_mappings)
		            record.exact_mappings = this.getArrayFromDelimited(record.exact_mappings);
		          if (record.comments)
		            record.comments = this.getArrayFromDelimited(record.comments);
		          if (record.examples)
		            record.examples = this.getArrayFromDelimited(record.examples, 'value');
		          // Simplifying https://linkml.io/linkml-model/latest/docs/UnitOfMeasure/ to just ucum_unit.
		          if (record.unit)
		            record.unit = {ucum_code: record.unit};
		          if (record.structured_pattern) {
		            //const reg_string = record.structured_pattern;
		            //console.log('structure', reg_string)
		            record.structured_pattern = {
		              'syntax': record.structured_pattern,
		              'partial_match': false,
		              'interpolated': true
		            };
		          }     
		          // target_obj .name, .rank, .range, .any_of are handled above.
		          this.copyAttributes(tab_name, record, target_obj, ['name','slot_group','inlined','inlined_as_list','slot_uri','title','range','any_of','unit','required','recommended','description','aliases','identifier','multivalued','minimum_value','maximum_value','minimum_cardinality','maximum_cardinality','pattern','structured_pattern','todos', 'equals_expression','exact_mappings','comments','examples','version','notes']);

		          //if (slot_name== 'passage_number')
		          //  console.log('passage_number', record.minimum_value, target_obj)
		        }
		        break;

		      case 'Annotation':

		        // If slot type is more specific then switch target to appropriate reference.
		        switch (record.annotation_type) {
		          case 'schema': 
		            target_obj = new_schema;
		            break

		          case 'class':
		            target_obj = this.getClass(new_schema, record.class_name);
		            break;

		          case 'slot':
		            target_obj = new_schema.get('slots').get(record.slot_name);
		            console.log('annotation', target_obj, record.annotation_type, record.slot_name, new_schema)
		            break;

		          case 'slot_usage':
		            target_obj = this.getClass(new_schema, record.class_name);
		            target_obj = target_obj.get('slot_usage')[record.slot_name] ??= {};
		            break;

		          case 'attribute':
		            target_obj = this.getClass(new_schema, record.class_name);
		            target_obj = target_obj.get('attributes')[record.slot_name] ??= {};
		            break;
		        }

		        // And we're just adding annotations[record.name] onto given target_obj:
		        if (typeof target_obj === 'map') {
		          if (!target_obj.has('annotations'))
		            target_obj.set('annotations', {});
		          target_obj = target_obj.get('annotations');
		        }
		        else {
		          if (!('annotations' in target_obj))
		            target_obj['annotations'] =  {};
		          target_obj = target_obj.annotations;
		        }

		        target_obj[record.name] = {
		          key: record.name, // convert name to 'key'
		          value: record.value
		        }

		        //FUTURE: ADD MENU FOR COMMON ANNOTATIONS LIKE 'foreign_key'? Provide help info that way.

		        break;

		      case 'Enum':
		        let enum_obj = new_schema.get('enums')[record.name] ??= {};
		        this.copyAttributes(tab_name, record, enum_obj, ['name','title','enum_uri','description']);
		        break;

		      case 'PermissibleValue': // LOOP?????? 'text shouldn't be overwritten.
		        let permissible_values = new_schema.get('enums')[record.enum_id].permissible_values ??= {};
		        target_obj = permissible_values[record.text] ??= {};
		        if (record.exact_mappings) {
		          record.exact_mappings = this.getArrayFromDelimited(record.exact_mappings);
		        }
		        this.copyAttributes(tab_name, record, target_obj, ['text','title','description','meaning', 'is_a','exact_mappings','notes']);
		        break;

		      case 'EnumSource':

		        // Required field so error situation if it isn't .includes or .minus:
		        if (record.criteria) { 

		          let enum_target_obj = new_schema.get('enums')[record.enum_id] ??= {};
		          enum_target_obj = enum_target_obj[record.criteria] ??= [];

		          if (record.source_nodes) {
		            record.source_nodes = this.getArrayFromDelimited(record.source_nodes);
		          }

		          if (record.relationship_types) {
		            record.relationship_types = this.getArrayFromDelimited(record.relationship_types);
		          }
		          // The .includes and .minus attributes hold arrays of specifications.
		          let target_ptr = enum_target_obj.push({});
		          console.log(target_ptr, enum_target_obj)
		          enum_target_obj = enum_target_obj[target_ptr-1];

		          this.copyAttributes(tab_name, record, enum_target_obj, ['source_ontology','is_direct','source_nodes','include_self','relationship_types']);
		        }
		        break;

		      case 'Setting':
		        new_schema.get('settings')[record.name] = record.value;
		        break;

		      case 'Type':
		        // Coming soon, saving all custom/loaded data types.
		        // Issue: Keep LinkML imported types uncompiled?
		        break;
		    }
		  }
		};

		console.table("SAVING SCHEMA", new_schema);

		// Get rid of empty values.// Remove all class and slot attributes that
		// have empty values "", {}, [].
		new_schema.get('classes').forEach((attr_map) => {
		  deleteEmptyKeyVals(attr_map);
		});

		console.log("SLOTS", new_schema.get('slots'))
		new_schema.get('slots').forEach((attr_map) => {
		  deleteEmptyKeyVals(attr_map);
		});

		let metadata = dh_schema.hot.getCellMeta(schema_focus_row, 0);
		if (metadata.locales) {
		  console.log("Got Locales", metadata.locales)
		  new_schema.set('extensions', {locales: {tag: 'locales', value: metadata.locales}});
		}

		//https://www.yaml.info/learn/quote.html
		const a = document.createElement("a");
		//Save JSON version - except this doesn't yet have schemaView() processing:
		//a.href =  URL.createObjectURL(new Blob([JSON.stringify(schema, null, 2)], {
		// quotingType: '"'
		//YAML.scalarOptions.str.defaultType = 'PLAIN';
		a.href = URL.createObjectURL(new Blob([YAML.stringify(new_schema, 
		  {singleQuote: true,
		  lineWidth: 0,
		  customTags: ['timestamp']
		}
		)], {type: 'text/plain'}));

		//strOptions.fold.lineWidth = 80; // Prevents yaml long strings from wrapping.
		//strOptions.fold.defaultStringType = 'QUOTE_DOUBLE'


		//quotingType: '"'
		a.setAttribute("download", file_name);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);


		return true;
	}  

  getArrayFromDelimited(value, filter_attribute = null) {
    if (!value || Array.isArray(value))
      return value; // Error case actually.
    return value.split(';')
      .map((item) => filter_attribute ? {[filter_attribute]: item} : item)
  }

	/**
	* Target object gets added/updated the given attribute_list fields, in order.
	* 
	*/
	copyAttributes(class_name, record, target, attribute_list) {
		for (let [ptr, attr_name] of Object.entries(attribute_list)) {
		  if (attr_name in record) { //No need to create/save empty values
		    if (target instanceof Map) {// Required for Map, preserves order.
		      target.set(attr_name, record[attr_name]);
		    }
		    else {
		      if (!target || !record) {
		        console.log(`Error: Saving ${class_name}, missing parameters:`, record, target, attribute_list)
		        alert(`Software Error: Saving ${class_name} ${attr_name}: no target or record`)
		      }
		      else {
		        target[attr_name] = record[attr_name];
		      }
		    }
		  }
		}
	};

	/** 
	* Components of a schema are set up as Maps with all attributes detailed,
	* so order of attributes is preserved. Empty components get removed at end
	* of processing with the deleteEmptyKeyVals() call.
	*/
	getClass(schema, name) {
		if (!schema.get('classes').has(name)) {
		  schema.get('classes').set(name, new Map([
		    ['name', ''],
		    ['title', ''],
		    ['description', ''],
		    ['version', ''],
		    ['class_uri', ''],
		    ['is_a', ''],
		    ['tree_root', ''],
		    ['see_also', []],
		    ['unique_keys', {}],
		    ['slots', []],
		    ['slot_usage', {}],
		    ['attributes', {}]
		  ]) );
		}
		return schema.get('classes').get(name);
	};

	getSlot(schema, name) {
		if (!schema.get('slots').has(name)) {
		  schema.get('slots').set(name, new Map([
		    ['name', ''],
		    ['rank', ''],
		    ['slot_group', ''],
		    ['inlined', ''],
		    ['inlined_as_list', ''],
		    ['slot_uri', ''],
		    ['title', ''],
		    ['range', ''],  
		    ['any_of', ''],      
		    ['unit', {}], 
		    ['required', ''], 
		    ['recommended', ''], 
		    ['description', ''],
		    ['aliases', ''],    
		    ['identifier', ''],  
		    ['multivalued', ''],
		    ['minimum_value', ''],
		    ['maximum_value', ''],
		    ['minimum_cardinality', ''],
		    ['maximum_cardinality', ''],
		    ['pattern', ''],
		    ['structured_pattern', {}],
		    ['todos', ''],
		    ['equals_expression', ''],
		    ['exact_mappings', []],
		    ['comments', ''],
		    ['examples', ''],
		    ['version', ''],
		    ['notes', ''],
		    ['attributes', {}]
		  ]) );
		}
		return schema.get('slots').get(name);
	};

  /***************************** LOAD & SAVE SCHEMAS **************************/

  // Classes & slots (tables & fields) in loaded schema editor schema guide what can be imported.
  // See https://handsontable.com/docs/javascript-data-grid/api/core/#updatedata 
  // Note: setDataAtCell triggers: beforeUpdateData, afterUpdateData, afterChange
  loadSchemaYAML(text) {
    // Critical to ensure focus click work gets data loaded before timing
    // reaction in response to loading data / data sets.
    let dh_schema = this.context.dhs.Schema;
    dh_schema.hot.suspendExecution();

    let schema = null;
    try {
      schema = YAML.parse(text);
      if (schema === null)
        throw new SyntaxError('Schema .yaml file could not be parsed.  Did you select a .json file instead?')
    }
    catch ({ name, message }) {
      alert(`Unable to open schema.yaml file.  ${name}: ${message}`);
      return false;
    }

    let schema_name = schema.name; // Using this as the identifier field for schema (but not .id uri)
    let loaded_schema_name = schema.name; // In case of loading 2nd version of a given schema.

    let dh_uk = this.context.dhs.UniqueKey;
    let dh_slot = this.context.dhs.Slot;
    let dh_pv = this.context.dhs.PermissibleValue;
    let dh_annotation = this.context.dhs.Annotation;
    /** Since user has selected one row/place to load schema at, the Schema table itself
     * is handled differently from all the subordinate tables.
     *
     * If user already has a schema loaded by same name, then:
     *   - If user is focused on row having same schema, then overwrite (reload) it.
     *   - If user is on empty row then load the schema as [schema]_X or schema_[version]
     *     This enables versions of a given schema to be loaded and compared.
     *   - Otherwise let user know to select an empty row.
     * 
     * FUTURE: simplify to having new Schema added to next available row from top.
     */
    let rows = this.context.crudFindAllRowsByKeyVals('Schema', {'name': schema_name});
    let focus_cell = dh_schema.hot.getSelected(); // Might not be one if user just accessed loadSchema by menu
    let focus_row = 0;
    if (focus_cell) {
      focus_row = parseInt(focus_cell[0][0]); // can be -1 row
      if (focus_row < 0)
        focus_row = 0;
    }

    // Find an empty row
    if (!focus_cell) {
      for (focus_row = 0; focus_row < dh_schema.hot.countRows(); focus_row ++) {
        if (dh_schema.hot.isEmptyRow(focus_row)) {
          break;
        }
      }
      // here we have focus_row be next available empty row, or new row # at
      // bottom of full table.
      dh_schema.hot.selectCell(focus_row, 0);
    }


    let focused_schema = dh_schema.hot.getDataAtCell(focus_row, 0) || '';
    let reload = false;
    if (rows.length > 0) {
      // RELOAD: If focused row is where schema_name is, then consider this a reload
      if (rows[0] == focus_row) {
        reload = true;
      }
      else {
        // Empty row so load schema here under a [schema_x] name
        if (!focused_schema) {
          let base_name = schema.name + '_';
          if (schema.version) {
            base_name = base_name + schema.version + '_';
          }
          let ptr = 1;
          while (this.context.crudFindAllRowsByKeyVals('Schema', {'name': base_name + ptr}).length) {
            ptr++;
          }
          loaded_schema_name = base_name + ptr;
        }
        // Some other schema is loaded in this row, so don't toast that.
        else {
          return alert("This schema row is occupied.  Select an empty schema row to upload to.");
        }
      }
    }
    if (focused_schema.length) {
      return alert("This schema row is occupied.  Select an empty schema row to upload to.");
    }

    // If user has requested Schema reload, then delete all existing rows in
    // all tables subordinate to Schema that have given schema_name as their
    // schema_id key. Possible to improve efficiency via delta insert/update?
    // (+Prefix) | Class (+UniqueKey) | Slot (+SlotUsage) | Enum (+PermissableValues)
    if (reload === true) {  
      for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
        this.deleteRowsByKeys(class_name, {'schema_id': schema_name});
      }
    }

    // Now fill in all of Schema simple attribute slots via uploaded schema slots.
    // Allowing setDataAtCell here since performance impact is low.
    for (let [dep_col, dep_slot] of Object.entries(dh_schema.slots)) {
      if (dep_slot.name in schema) {
        let value = null;
        // List of schema slot value exceptions to handle:
        switch (dep_slot.name) {
          // Name change can occur with v.1.2.3_X suffix 
          case 'name':
            value = loaded_schema_name;
            break;
          case 'see_also':
            value = this.getDelimitedString(schema.see_also);
            break;
          case 'imports':
            value = this.getDelimitedString(schema.imports);
            break;

          default:
            value = schema[dep_slot.name] ??= '';
        } 
        dh_schema.hot.setDataAtCell(focus_row, parseInt(dep_col), value, 'upload');
      }
    }

    /* As well, "schema.extensions", may contain a locale.  If so, we add 
     * right-click functionality on textual cells to enable editing of this
     * content, and the local extension is saved.
     * schema.extensions?.locales?.value contains {[locale]:[schema] ...}
     */
    const locales = schema.extensions?.locales?.value;
    if (locales) {
      dh_schema.hot.setCellMeta(focus_row, 0, 'locales', locales);
      const locale_list = Object.keys(locales).join(';');
      console.log("locales", locales, locale_list)
      dh_schema.hot.setDataAtCell(focus_row, dh_schema.slot_name_to_column['locales'], locale_list, 'upload')
    }

    // For each DH instance, tables contains the current table of data for that instance.
    // For efficiency in loading a new schema, we add to end of each existing table.
    let tables = {};
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      const dh_table = this.context.dhs[class_name];
      // Doing console.log(hot.getData()) only returns visible rows.  
      // getSourceData() returns source (visible and hidden) 
      // https://jsfiddle.net/handsoncode/71y9axdj/ 
      tables[dh_table.template_name] = dh_table.hot.getSourceData();

      // Need to RELEASE FILTER?
      //const filtersPlugin = dh_table.hot.getPlugin('filters');
      //filtersPlugin.clearConditions();
      //filtersPlugin.filter();
    }

    this.checkForAnnotations(tables, loaded_schema_name, null, null, 'class', schema);

    // Technical notes: Handsontable appears to get overloaded by inserting data via 
    // setDataAtCell() after loading of subsequent schemas.
    // Now using getData() and setData() as these avoid slowness or crashes
    // involved in adding data row by row via setDataAtCell(). Seems that 
    // events start getting triggered into a downward spiral after a certain
    // size of table reached.
    // 1) Tried using Handsontable dh.hot.alter() to add rows, but this ERRORS
    // with "Assertion failed: Expecting an unsigned number." if alter() is 
    // surrounded by "suspendRender()". Found alter() appears not to be needed
    // since Row added automatically via setDataAtCell().

    // 2nd pass, now start building up table records from core Schema prefixes,
    // enums, slots, classes, settings, extensions entries:
    let conversion = {
      prefixes: 'Prefix',
      enums:    'Enum', // Done before slots and classes so slot.range and
                        //class.slot_usage range can include them. 
      slots:    'Slot', // Done before classes because class.slot_usage and 
                        // class.attributes add items AFTER main inheritable 
                        // slots. FUTURE: ENSURE ORDERING ???
      classes:  'Class',
      settings: 'Setting',
      extensions: 'Extension'
    };

    for (let [schema_part, class_name] of Object.entries(conversion)) {

      let dh = this.context.dhs[class_name];

      // Cycle through parts of uploaded schema's corresponding prefixes /
      // classes / slots / enums
      // value may be a string or an object in its own right.

      for (let [item_name, value] of Object.entries(schema[schema_part] || {})) {

        // Do appropriate constructions per schema component
        switch (class_name) {
          //case 'Schema': //done above
          //  break;

          case 'Prefix':
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              prefix:    item_name, 
              reference: value // In this case value is a string
            }); 
            break;

          case 'Setting':
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              name:    item_name, 
              value:   value // In this case value is a string
            }); 
            break;

          case 'Extension':
            // FUTURE: make this read-only?
            // Each locale entry gets copied to the Extension table/class in a shallow way
            // But also gets copied to the schema locales table held in first cell
            // See "if (locales)" condition above.
            // FUTURE: revise this so Extension's cell metadata holds it?
            this.addRowRecord(dh, tables, {
              schema_id: loaded_schema_name, 
              name:     item_name, 
              value:    value // In this case value is a string or object.  It won't be renderable via DH
            }); 

            break;

          case 'Enum':
            let enum_id = value.name;
            this.addRowRecord(dh, tables, {
              schema_id:   loaded_schema_name, 
              name:        enum_id, 
              title:       value.title,
              description: value.description,
              enum_uri:    value.enum_uri
            }); 
            // If enumeration has permissible values, add them to dh_permissible_value table.
            if (value.permissible_values) {
              for (let [key_name, obj] of Object.entries(value.permissible_values)) {
                this.addRowRecord(dh_pv, tables, {
                  schema_id: loaded_schema_name,
                  enum_id:   enum_id,
                  text:      key_name,
                  title:     obj.title,
                  description: obj.description,
                  meaning:   obj.meaning,
                  exact_mappings: this.getDelimitedString(obj.exact_mappings),
                  is_a:      obj.is_a,
                  notes:     obj.notes // ??= ''
                });
              };
            }
            // Handling the arrays of downloadable / cacheable enumeration inclusion and excluded sources.
            if (value.includes) 
              this.setEnumSource(tables, loaded_schema_name, enum_id, value.includes, 'includes');
            if (value.minus) 
              this.setEnumSource(tables, loaded_schema_name, enum_id, value.minus, 'minus');

            break;

          // Slot table is LinkML "slot_definition".  This same datatype is
          // referenced by class.slot_usage and class.annotation, so those
          // entries are added here.
          case 'Slot':
            // Setting up empty class name as empty string since human edits to
            // create new generic slots will create same.
            let slot_name = value.name;
            this.addSlotRecord(dh, tables, loaded_schema_name, '', 'slot', slot_name, value);
            this.checkForAnnotations(tables, loaded_schema_name, null, slot_name, 'slot', value);
            break;

          case 'Class':
            let class_name = value.name;
            this.addRowRecord(dh, tables, {
              schema_id:   loaded_schema_name, 
              name:        class_name, 
              title:       value.title,
              description: value.description,
              version:     value.version,
              class_uri:   value.class_uri,
              is_a:        value.is_a,
              tree_root:   this.getBoolean(value.tree_root), // Not needed?
              see_also:    this.getDelimitedString(value.see_also)
            }); 

            this.checkForAnnotations(tables, loaded_schema_name, class_name, null, 'class', value); // i.e. class.annotations = ...

            // FUTURE: could ensure the unique_key_slots are marked required here.
            if (value.unique_keys) {
              for (let [key_name, obj] of Object.entries(value.unique_keys)) {
                this.addRowRecord(dh_uk, tables, {
                  schema_id: loaded_schema_name,
                  class_name:  class_name,
                  name:      key_name,
                  unique_key_slots: this.getDelimitedString(obj.unique_key_slots),
                  description: obj.description,
                  notes:     obj.notes // ??= ''
                });
              };
            };
            // class.slot_usage holds slot_definitions which are overrides on slots of slot_type 'slot'
            if (value.slot_usage) { 
              // pass class_id as value.name into this?!!!!!!!e
              for (let [slot_name, obj] of Object.entries(value.slot_usage)) {
                this.addSlotRecord(dh_slot, tables, loaded_schema_name, class_name, 'slot_usage', slot_name, obj);
              };
            }
            // class.attributes holds slot_definitions which are custom (not related to schema slots)


            // IGNORE attributes FOR CONTAINER? 
            if (value.attributes) { 
              for (let [slot_name, obj] of Object.entries(value.attributes)) {
                this.addSlotRecord(dh_slot, tables, loaded_schema_name, class_name, 'attribute', slot_name, obj);
                // dh, tables, schema_name, class_name, slot_type, slot_key, slot_obj
              };
            }

            break;
        }
      };

    };

    // Get all of the DH instances loaded.
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      let dh = this.context.dhs[class_name];
      // AVOID: dh.hot.loadData(...); INNEFICIENT
      dh.hot.updateSettings({data:Object.values(tables[class_name])});
    }

    // New data type, class & enumeration items need to be reflected in DH
    // SCHEMAEDITOR menus. Done each time a schema is uploaded or focused on.
    this.context.schemaEditor.refreshMenus(); 
    this.context.crudCalculateDependentKeys(dh_schema.template_name);

    dh_schema.hot.resumeExecution();
  };

  setEnumSource(tables, loaded_schema_name, enum_id, source_array, criteria) {
    for (let source of source_array) {
      this.addRowRecord(this.dhs.EnumSource, tables, {
        schema_id:        loaded_schema_name,
        enum_id:          enum_id,
        criteria:         criteria,
        source_ontology:  source.source_ontology,
        is_direct:        source.is_direct,
        source_nodes:     this.getDelimitedString(source.source_nodes),
        include_self:     source.include_self, 
        relationship_types: this.getDelimitedString(source.relationship_types)
      });
    }
  }

  /**
   * Annotations are currently possible on schema, class, slot, slot_usage and attribute.
   * source_obj often doesn't have schema_name, class_name, slot_name so they are parameters.
   * 
   */ 
  checkForAnnotations(tables, schema_name, class_name, slot_name, annotation_type, source_obj) {
    // For now DH annotations only apply to slots, slot_usages, and class.attributes
    if (source_obj.annotations) {
      let dh_annotation = this.context.dhs.Annotation;
      let base_record = {
        schema_id: schema_name,
        annotation_type: annotation_type,
      }
      switch (annotation_type) {
      case 'schema':
        break;
      case 'class':
        base_record.class_name = class_name;
        break;
      case 'slot':
        base_record.slot_name = slot_name;
        break;
      case 'slot_usage':
      case 'attribute':
        base_record.class_name = class_name;
        base_record.slot_name = slot_name;
        break;
      }
      for (let [tag, obj] of Object.entries(source_obj.annotations)) {
        let record = Object.assign(base_record, {
          annotation_type: annotation_type,
          name:      tag, // FUTURE tag: ...
          value:    obj.value
        });
        // NORMALLY name: would be key: but current problem is that header in
        // schema_editor tables is using [text] as slot_group for a field
        // yields that if that [text] is a slot name, then title is being
        // looked up as a SLOT rather than as an enumeration - because DH code
        // doesn’t have enumeration yet...
        this.addRowRecord(dh_annotation, tables, record);
      };
    }
  }

  /** The slot object, and the Class.slot_usage object (which gets to enhance
   * add attributes to a slot but not override existing slot attributes) are
   * identical in potential attributes, so construct the same object for both
   * 
   * slot_obj may contain annotations, in which case they get added to
   * annotations table
   */ 
  addSlotRecord(dh, tables, schema_name, class_name, slot_type, slot_key, slot_obj) {

    let slot_record = {
      schema_id:   schema_name,
      slot_type:   slot_type, // slot or slot_usage or annotation
      name:        slot_key,

      // For slots associated with table by slot_usage or annotation
      // Not necessarily a slot_obj.class_name since class_name is a key onto slot_obj
      class_name:  class_name, 
      rank:        slot_obj.rank, 
      slot_group:  slot_obj.slot_group || '',
      inlined:     this.getBoolean(slot_obj.inlined),
      inlined_as_list: this.getBoolean(slot_obj.inlined_as_list),

      slot_uri:    slot_obj.slot_uri,
      title:       slot_obj.title,
      range:       slot_obj.range || this.getDelimitedString(slot_obj.any_of, 'range'),
      unit:        slot_obj.unit?.ucum_code || '', // See https://linkml.io/linkml-model/latest/docs/UnitOfMeasure/
      required:    this.getBoolean(slot_obj.required),
      recommended: this.getBoolean(slot_obj.recommended),
      description: slot_obj.description,
      aliases:     slot_obj.aliases,
      identifier:  this.getBoolean(slot_obj.identifier),
      multivalued: this.getBoolean(slot_obj.multivalued),
      minimum_value: slot_obj.minimum_value,
      maximum_value: slot_obj.maximum_value,
      minimum_cardinality: slot_obj.minimum_cardinality,
      maximum_cardinality: slot_obj.maximum_cardinality,
      pattern:     slot_obj.pattern,
      //NOTE that structured_pattern's partial_match and interpolated parameters are ignored.
      structured_pattern: slot_obj.structured_pattern?.syntax || '', 
      equals_expression: slot_obj.equals_expression,
      todos:       this.getDelimitedString(slot_obj.todos), 
      exact_mappings: this.getDelimitedString(slot_obj.exact_mappings),
      comments:    this.getDelimitedString(slot_obj.comments),
      examples:    this.getDelimitedString(slot_obj.examples, 'value'),
      version:     slot_obj.version,
      notes:       slot_obj.notes
    };
    this.addRowRecord(dh, tables, slot_record);

    // Slot type can be 'slot' or 'slot_usage' or 'attribute' here.
    if (slot_type === 'slot_usage')
      this.checkForAnnotations(tables, schema_name, class_name, slot_key, 'slot_usage', slot_obj);
    else if (slot_type === 'attribute')
      this.checkForAnnotations(tables, schema_name, class_name, slot_key, 'attribute', slot_obj);
  };

  /**
   * Returns value as is if it isn't an array, but if it is, returns it as
   * semi-colon delimited list.
   * @param {Array or String} to convert into semi-colon delimited list.
   * @param {String} filter_attribute: A some lists contain objects 
   */
  getDelimitedString(value, filter_attribute = null) {
    if (Array.isArray(value)) {
      if (filter_attribute) {
        return value.filter((item) => filter_attribute in item)
          .map((obj) => obj[filter_attribute])
          .join(';');
      } 
      return value.join(';');
    }
    return value;
  }


  /** Incomming data has booleans as json true/false; convert to handsontable TRUE / FALSE
   * Return string so validation works on that (validateValAgainstVocab() where picklist
   * is boolean)
   */
  getBoolean(value) {
    if (value === undefined)
      return value; // Allow default / empty-value to be passed along.
    return(!!value).toString().toUpperCase();
  };

  setToBoolean(value) {
    return value?.toLowerCase?.() === 'true';
  }

  deleteRowsByKeys(class_name, keys) {
    let dh = this.context.dhs[class_name];
    let rows = dh.context.crudFindAllRowsByKeyVals(class_name, keys);
    //if (!rows) 
    //  continue;
    let dh_changes = rows.map(x => [x,1]);
    //if (dh_changes.length)
    dh.hot.alter('remove_row', dh_changes);  
  };

  /** Insert new row for corresponding table item in uploaded schema.

   */ 
  addRowRecord(dh, tables, record) {

    let target_record = new Array(dh.slots.length).fill(null);
    for (let [slot_name, value] of Object.entries(record)) {
      if (slot_name in dh.slot_name_to_column) {
        target_record[dh.slot_name_to_column[slot_name]] = value;
      }
      else
        console.error(`Error: Upload of ${dh.template_name} table mentions key:value of (${slot_name}:${value}) but Schema model doesn't include this key`)
    }
    tables[dh.template_name].push(target_record);
  };


// END of SchemaEditor Class
}

export default SchemaEditor;