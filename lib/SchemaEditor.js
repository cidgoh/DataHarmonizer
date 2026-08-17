import $ from 'jquery';
import Handsontable from 'handsontable';
import {deleteEmptyKeyVals, setJSON} from '../lib/utils/general';
import { getNumericConstraints } from '../lib/utils/fields';
import YAML from 'yaml';
import { dhAlert, dhConfirm, dhChoose } from '../lib/utils/dialog';

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
	'SlotUsage':  ['classes', 'class_id', 'slot_usage',  'name', ['title','description','comments','examples']],
	'Attribute':  ['classes', 'class_id', 'attributes',  'name', ['title','description','comments','examples']],
	'PermissibleValue': ['enums', 'enum_id', 'permissible_values', 'text', ['title','description']]
	}

	// These are SchemaEditor dynamically handled menu items: A schema's classes, data types, slots, and slot groups vary.
	// In contrast, the SchemaSlotTypeMenu is constant across all schemas, and so is not in this list.
	SCHEMAMENUS = ['SchemaMenu','SchemaClassMenu','SchemaSlotMenu','SchemaSlotGroupMenu','SchemaEnumMenu'];

	// Maps each DH tab to the menu it populates (null if none) and the ordered
	// list of dependent tabs whose menus must also be refreshed when this tab's
	// data changes.  Dependents are listed in topological order (parents before
	// children) so that a misconfiguration cannot create an infinite loop.
	// Not every tab has an associated menu.
	TAB_MENU_MAP = {
	  Schema:    { menu: 'SchemaMenu',          dependents: ['Class', 'Slot', 'SlotGroup', 'Enum', 'EnumValue', 'UniqueKey', 'Prefix'] },
	  Class:     { menu: 'SchemaClassMenu',     dependents: ['Slot', 'SlotGroup', 'UniqueKey'] },
	  Slot:      { menu: 'SchemaSlotMenu',      dependents: [] },
	  SlotGroup: { menu: 'SchemaSlotGroupMenu', dependents: [] },
	  Enum:      { menu: 'SchemaEnumMenu',      dependents: ['EnumValue'] },
	  UniqueKey: { menu: null, dependents: [] },
	  EnumValue: { menu: null, dependents: [] },
	  Prefix:    { menu: null, dependents: [] },
	};

	constructor(schema, context) {
		this.schema = schema;
		this.context = context;
		this._injectRootClassSlot();
	}

	/**
	 * Inject the `root_class` slot into the DH_LinkML schema object at runtime.
	 *
	 * `root_class` is a DataHarmonizer UI field (not a real LinkML Schema attribute)
	 * that lets users designate which class gets `tree_root: true` in the saved YAML.
	 * It must not exist in the on-disk schema files (it is not part of the LinkML
	 * specification), but it must exist in the runtime schema so that `useTemplate()`
	 * builds the HOT column for the Schema tab.
	 *
	 * This method is called from the constructor, BEFORE `makeDHsFromRelations()`
	 * creates the individual tab DataHarmonizer instances, so the injected attribute
	 * is picked up naturally by `useTemplate()` without any HOT re-render.
	 */
	_injectRootClassSlot() {
		const schemaClass = this.schema?.classes?.Schema;
		if (!schemaClass) return;                        // guard: wrong schema
		if (schemaClass.attributes?.root_class) return; // guard: already present

		schemaClass.attributes = schemaClass.attributes || {};
		schemaClass.attributes.root_class = {
			name:        'root_class',
			title:       'Root Table',
			description: 'The name of the class that acts as the root table (tree_root: true) '
			           + 'for this schema. There can be at most one per schema. '
			           + 'DataHarmonizer by default uses "Container" as the generic name '
			           + 'of this class.',
			from_schema: this.schema.id || '',
			rank:        11,
			ifabsent:    'string(Container)',
			alias:       'root_class',
			owner:       'Schema',
			domain_of:   ['Schema'],
			slot_group:  'attributes',
			range:       'WhitespaceMinimizedString',
		};

		// slot_usage carries rank/slot_group for completeness (mirrors what
		// schema_induction.js would normally produce from schema.yaml).
		schemaClass.slot_usage = schemaClass.slot_usage || {};
		schemaClass.slot_usage.root_class = {
			name:       'root_class',
			rank:       11,
			slot_group: 'attributes',
		};
	}


  initMenus() {
  	// Ensures all mentioned SCHEMAMENUS have a minimal enumeration. They are
  	// populated later by refreshMenus().
		this.SCHEMAMENUS.forEach((item) => {
			if (!(item in this.schema.enums)) {
				this.schema.enums[item] = {name: item}; 
			}
		});
		// SchemaTypeMenu is built from the static DH_LinkML type list — it never
		// changes at runtime, so populate it once here rather than on every refreshMenus() call.
		const dtPermValues = {};
		Object.entries(this.schema.types || {}).forEach(([data_type, type_obj]) => {
			dtPermValues[data_type] = { name: type_obj.name, text: data_type, description: type_obj.description || '' };
		});
		this.schema.enums['SchemaTypeMenu'] ??= { name: 'SchemaTypeMenu' };
		this.schema.enums['SchemaTypeMenu'].permissible_values = dtPermValues;
		// Update column settings for every slot that references SchemaTypeMenu so the
		// dropdown is populated from the start (getColumns() runs before initMenus()).
		for (const tab_dh of Object.values(this.context.dhs || {})) {
			for (const slot_obj of Object.values(tab_dh.slots)) {
				if (Object.values(slot_obj.sources || {}).includes('SchemaTypeMenu')) {
					this.context.setSlotRangeLookup(slot_obj);
					const colIdx = tab_dh.slot_name_to_column[slot_obj.name];
					if (colIdx !== undefined)
						tab_dh.updateColumnSettings(colIdx, { source: tab_dh.updateSources(slot_obj) });
				}
			}
		}
		// Rebuild menus when Display mode toggles (all records ↔ records by selected key)
		// so SchemaSlotGroupMenu (and SchemaClassMenu) immediately reflect the new filter.
		$('#display-dropdown-btn-group input').off('change.schemaEditor').on('change.schemaEditor', () => {
			this.refreshMenus();
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
	* @param {string} source A convenience conditional for some calls that should
	* regenerate menu(s) but only if triggering event is related.
	*/
	/**
	 * Return a deduped, ordered list of menu names that must be refreshed when
	 * the given tab's data changes: the tab's own menu (if any) followed by the
	 * menus of each dependent tab (if any), in the topological order declared
	 * in TAB_MENU_MAP.  Tabs with no associated menu are silently skipped.
	 *
	 * Falls back to SCHEMAMENUS for unknown tab names so that an unconfigured
	 * tab always triggers a full refresh rather than a silent no-op.
	 */
	getMenusForTab(tab_name) {
	  const entry = this.TAB_MENU_MAP[tab_name];
	  if (!entry) return this.SCHEMAMENUS;
	  const seen = new Set();
	  const result = [];
	  for (const t of [tab_name, ...entry.dependents]) {
	    const m = this.TAB_MENU_MAP[t]?.menu;
	    if (m && !seen.has(m)) { seen.add(m); result.push(m); }
	  }
	  return result;
	}

	/**
	 * Convenience wrapper: refresh all menus associated with the given tab and
	 * its dependents, respecting the source guard in refreshMenus().
	 */
	refreshMenusForTab(tab_name, source = null) {
	  this.refreshMenus(this.getMenusForTab(tab_name), source);
	}

	refreshMenus(enums = this.SCHEMAMENUS, source = null) {

		 // If an instance of schema editor has been created.
		if (this.context.schemaEditor) {
			// An 'upload' source means data set for entire table, so we are in a position to generate the menu.
			if (source && ['updateData', 'batch_updates'].includes(source))
				return;

			// Guard against being called before all DH tabs are registered.
			if (!this.context.dhs['Schema']) return;
			const schema = this.schema;
		  for (const enum_name of enums) {
		    // Initialize TypeMenu, ClassMenu and EnumMenu

		    let user_schema_name = this.getSchemaEditorSelectedSchema();
		    // Here in Schema Editor, user hasn't selected a particular schema.
		    if (!user_schema_name)
		    	user_schema_name = 'DH_LinkML';

		    const permissible_values = {};

		    switch (enum_name) {

		    	// A list of all loaded schemas by name (not sensitive to selected schema)
		      case 'SchemaMenu': {
		        const schema_dh = this.context.dhs['Schema'];
		        const schema_name_ptr = schema_dh.slot_name_to_column['name'];
		        for (let row=0; row < schema_dh.hot.countSourceRows(); row ++) {
		        	const schema_name = schema_dh.hot.getSourceDataAtCell(row, schema_name_ptr);
		        	if (schema_name && !(schema_name in permissible_values)) {
	            	permissible_values[schema_name] = {text: schema_name, title: schema_name};
	          	}
		        };
		      	break;
		      }


		      case 'SchemaClassMenu': {
		        // Read directly from the live Class DH so edits on the Table tab
		        // are reflected immediately — same pattern as SchemaMenu.
		        // "All records" display → include all uniquely-named classes across schemas.
		        // "Records by selected key" display → restrict to the user-selected schema (if any).
		        const class_dh = this.context.dhs['Class'];
		        if (class_dh) {
		          const show_all   = ($('input[name="display-main-type"]:checked').val() ?? '') === 'all';
		          const name_col   = class_dh.slot_name_to_column['name'];
		          const desc_col   = class_dh.slot_name_to_column['description'];
		          const schema_col = class_dh.slot_name_to_column['schema_id'];
		          for (let row = 0; row < class_dh.hot.countSourceRows(); row++) {
		            const row_schema = class_dh.hot.getSourceDataAtCell(row, schema_col);
		            if (!show_all && row_schema !== user_schema_name) continue;
		            const class_name = class_dh.hot.getSourceDataAtCell(row, name_col);
		            if (class_name && !(class_name in permissible_values)) {
		              permissible_values[class_name] = {
		                text: class_name,
		                title: (show_all && row_schema) ? `${row_schema} - ${class_name}` : class_name,
		                description: class_dh.hot.getSourceDataAtCell(row, desc_col) || ''
		              };
		            }
		          }
		        }
		        break;
		      }

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

		      case 'SchemaSlotGroupMenu': {
		        /** Build list of slot groups from the SlotGroup tab (authoritative source).
		         * In "all records" mode: include every slot group across all schemas.
		         * In "records by selected key" mode: filter by the selected schema and,
		         * if a class is also selected on the Table tab, by that class too.
		         */
		        const show_all = ($('input[name="display-main-type"]:checked').val() ?? '') === 'all';
		        const filter = {};
		        if (!show_all) {
		          filter.schema_id = this.getSchemaEditorSelectedSchema();
		          const class_name = this.getSchemaEditorSelectedClass();
		          if (class_name > '') filter.class_id = class_name;
		        }

		        const sg_rows = this.context.crudFindAllRowsByKeyVals('SlotGroup', filter);
		        const sg_dh = this.context.dhs['SlotGroup'];
		        const sg_name_ptr = sg_dh.slot_name_to_column['name'];

		        for (let row of sg_rows) {
		        	const sg_name_text = sg_dh.hot.getSourceDataAtCell(row, sg_name_ptr);
		        	if (sg_name_text && !(sg_name_text in permissible_values)) {
		            	permissible_values[sg_name_text] = {text: sg_name_text, title: sg_name_text};
		          	}
		        };

		        break;
		      }

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
		    for (let slot_obj of Object.values(tab_dh.slots)) {
		      for (let slot_enum_name of Object.values(slot_obj.sources || {})) {
		        // Found a regenerated enum from above so recalculate slot lookups
		        if (enums.includes(slot_enum_name)) {
		          this.context.setSlotRangeLookup(slot_obj);
		          if (slot_obj.sources) {
		            //FUTURE: tab_dh.hot.propToCol(slot_obj.name) after Handsontable col.data=[slot_name] implemented
		            const colIdx = tab_dh.slot_name_to_column[slot_obj.name];
		            const newSource = tab_dh.updateSources(slot_obj);
		            // Use updateColumnSettings (not getColumnMeta().source=) so HOT's
		            // getSettings().columns[col] and the live column-meta prototype stay in
		            // sync. Direct prototype assignment leaves getSettings().columns stale,
		            // causing HOT to restore source=[] on the next settings-related operation.
		            tab_dh.updateColumnSettings(colIdx, { source: newSource });
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
		if (!dh) return null;
		return dh.hot.getDataAtCell(dh.current_selection[0], dh.slot_name_to_column['name']);
	}

	getSchemaEditorSelectedClass() {
		const dh = this.context.dhs['Class'];
		if (!dh) return null;
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
		  for (let row of this.context.crudFindAllRowsByKeyVals(template_name, {schema_id: user_schema_name})) {
		    let focus_name = focus_dh.hot.getSourceDataAtCell(row, name_col);
		    if (focus_name) {//Ignore empty class_name field
		      permissible_values[focus_name] = {
		        name: focus_name,
		        text: focus_name,
		        description: focus_dh.hot.getSourceDataAtCell(row, description_col)
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
	    if (schema_row == null || schema_row < 0) {
	      dhAlert("In order to see the translation form, first select a row with a schema that has locales.");
	      return false;
	    }
	    const locales = schema.hot.getCellMeta(schema_row, 0).locales;
	    if (!locales) {
	      dhAlert("In order to see the translation form, first select a row with a schema that has locales.");
	      return false;
	    }

	    let locale_map = dh.schema.enums?.LanguagesMenu?.permissible_values || {};

	    const locale_field = schema.slot_name_to_column['in_language'];
	    const language_code = schema.hot.getDataAtCell(schema_row, locale_field);
	    const default_language = language_code in locale_map ? locale_map[language_code].title : language_code;

	    // Translation table form for all selected rows.
	    // For the Slot tab, each row may be a base slot ('slot'), a class-specific
	    // override ('slot_usage'), or a standalone attribute ('attribute').
	    // slot_usage rows use the SlotUsage TRANSLATABLE config so translations are
	    // stored at extensions.locales.classes.[class].slot_usage.[name].[attr]
	    // instead of the global extensions.locales.slots.[name].[attr] path.

	    // Guard: translating slot_usage rows requires Expert User mode because the
	    // path is class-scoped and the user should understand the implication.
	    const slotTypeCol = dh.template_name === 'Slot'
	      ? dh.slot_name_to_column['slot_type']
	      : null;
	    if (slotTypeCol != null) {
	      let hasSlotUsage = false;
	      for (let row = dh.current_selection[0]; row <= dh.current_selection[2]; row++) {
	        const physRow = dh.hot.toPhysicalRow(row);
	        if (dh.hot.getSourceDataAtCell(physRow, slotTypeCol) === 'slot_usage') {
	          hasSlotUsage = true;
	          break;
	        }
	      }
	      if (hasSlotUsage && !dh.context.expert_user) {
	        dhAlert('Translating class-specific field overrides (slot_usage) requires Expert User mode. Enable it via the File menu → "Toggle expert user mode".');
	        return false;
	      }
	    }

	    // Use the base config for column count / header (Slot and SlotUsage share
	    // the same text_columns so colPct is identical for both).
	    const base_config = this.TRANSLATABLE[dh.template_name];
	    const text_columns = base_config[4];
	    const colPct = Math.floor(100 / text_columns.length);

	    let translate_rows = '';

	    // Provide translation forms for user selected range of rows
	    for (let row = dh.current_selection[0]; row <= dh.current_selection[2]; row++) {

	      // Resolve per-row TRANSLATABLE config based on slot_type:
	      //   'slot'      → global  fr.slots.[name].[attr]
	      //   'slot_usage'→ scoped  fr.classes.[class].slot_usage.[name].[attr]
	      //   'attribute' → scoped  fr.classes.[class].attributes.[name].[attr]
	      let row_config = base_config;
	      if (slotTypeCol != null) {
	        const physRow = dh.hot.toPhysicalRow(row);
	        const slotType = dh.hot.getSourceDataAtCell(physRow, slotTypeCol);
	        if (slotType === 'slot_usage') {
	          row_config = this.TRANSLATABLE['SlotUsage'];
	        } else if (slotType === 'attribute') {
	          row_config = this.TRANSLATABLE['Attribute'];
	        }
	      }
	      const [schema_part, key_name, sub_part, sub_part_key_name, row_text_cols] = row_config;

	      // 1st content row of table shows english or default translation.
	      let default_row_text = '';
	      let translatable = '';
	      let column_count = 0;
	      for (var column_name of row_text_cols) {
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
	          console.log("key2",key2, "lookup from", row_config);
	          dhAlert("unable to get key2 from lookup of:" + sub_part_key_name);
	        }
	      }

	      if (key) {
	        translate_rows += `<tr class="translate translate_key"><td colspan="${column_count+2}">${key}${key2 ? ' /' + key2 : ''}</td></tr>`;
	      }

	      translate_rows += `<tr class="translate"><td nowrap>${default_language}</td>${default_row_text}<td></td></tr>`;

	      // DISPLAY locale for each schema in_language menu item
	      for (const [locale, locale_schema] of Object.entries(locales)) {
	        let translate_cells = '';
	        let path = '';
	        for (let column_name of row_text_cols) {
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

	          translate_cells += `<td style="width:${colPct}%;max-width:${colPct}%"><textarea name="${column_name}" data-path="${path}">${value}</textarea></td>`;
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
	              ${text_columns.map(col => '<th style="width:' + colPct + '%;max-width:' + colPct + '%">' + col + '</th>').join('')}
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
  setLocales(changes, grid_changes, hot) {
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

      // Block the HOT change; re-apply after confirmation via 'locale_confirm'
      // action so beforeChange skips this check on the second pass.
      dhConfirm(message, { title: 'Confirm locales' }).then((confirmed) => {
        if (confirmed) {
          const locales = dh_schema.getLocales();
          for (const locale of deleted) {
            delete locales[locale];
          }
          for (const locale of created) {
            locales[locale] = {};
          }
          hot.setDataAtCell(
            grid_changes.map(([row, col, , newValue]) => [row, col, newValue]),
            'locale_confirm'
          );
        }
      });
      return false; // block initially; re-applied if user confirms
    }
    return true;
  };

  /* Currently functionality exclusive to Schema Editor tabs:
   *Empty table render will still trigger .cells () for all row 0 columns 
  */
	initTab (dh, class_name, hot_settings) {

    // 
    // At moment we have to rely on handsontable .cells() call in 
    // createHot() hot_settings to apply styling to slot report, so
    // add quick lookup parameters to help that.
    dh.schema_name_column = dh.slot_name_to_column['schema_id'];
    dh.slot_class_id_column = dh.slot_name_to_column['class_id'];
    dh.slot_name_column = dh.slot_name_to_column['name'];
    dh.slot_title_column = dh.slot_name_to_column['title'];
    dh.slot_rank_column = dh.slot_name_to_column['rank'];
    dh.slot_type_column = dh.slot_name_to_column['slot_type'];
    dh.slot_group_column = dh.slot_name_to_column['slot_group'];

		switch (class_name) {
			case 'Schema': {
				this.hotSettingsMenuHooks(dh, hot_settings, 'Schema', ['name']);
				// Refresh dependent-tab menus when the user selects a different schema row.
				// SchemaClassMenu, SchemaSlotMenu, SchemaSlotGroupMenu, and SchemaEnumMenu
				// are schema-scoped (they filter by the selected schema) and are used by
				// Class, Slot, SlotGroup and other tabs — not the Schema tab itself.
				// Without this hook those menus would stay stale until a data-change event
				// in one of the dependent tabs happened to trigger their own refresh.
				let _lastSchemaRow = null;
				dh.hot.addHook('afterSelection', (row, col) => {
					if (row !== _lastSchemaRow) {
						_lastSchemaRow = row;
						// Defer the menu refresh to the next event-loop tick so it does not
						// interfere with HOT's keyboard-listener state on the newly selected
						// row.  Calling refreshMenusForTab synchronously here (combined with
						// the afterSelectionEnd double-fire from crudCalculateDependentKeys)
						// causes multiple hot.updateSettings({columns}) calls that disrupt
						// HOT's key-event handling, silently swallowing the first character
						// the user types into any cell on a freshly selected schema row.
						setTimeout(() => {
							this.refreshMenusForTab('Schema');
							// refreshMenusForTab -> updateColumnSettings -> hot.updateSettings({columns})
							// resets the horizontal scroll position. Re-anchor to the clicked cell.
							dh.hot.scrollViewportTo(row, col);
						}, 0);
					}
				});

				// Validate root_class: the named class must not have its own slot/field
				// definitions. A container (root) class should only reference other tables
				// via auto-generated attributes, not define its own fields.
				const rootClassCol = dh.slot_name_to_column['root_class'];
				if (rootClassCol !== undefined) {
					dh.hot.addHook('afterChange', (changes, source) => {
						if (!changes) return;
						// Skip programmatic fills (ifabsent defaults, file loads, reversions).
						if (['loadData','updateData','upload','add_row','validation_revert'].includes(source)) return;
						for (const [row, col, oldVal, newVal] of changes) {
							if (col !== rootClassCol) continue;
							if (!newVal || newVal === oldVal) continue;
							const slotDh = this.context.dhs['Slot'];
							if (!slotDh) continue;
							const classIdCol = slotDh.slot_class_id_column;
							if (classIdCol === undefined) continue;
							// Scope check to the same schema to avoid false positives from
							// other schemas loaded in the same session.
							const schemaName = dh.hot.getDataAtCell(row, dh.slot_name_column);
							const schemaIdCol = slotDh.schema_name_column;
							const hasSlots = slotDh.hot.getSourceData().some(slotRow => {
								if (slotRow[classIdCol] !== newVal) return false;
								if (schemaName && schemaIdCol !== undefined) {
									return slotRow[schemaIdCol] === schemaName;
								}
								return true;
							});
							if (hasSlots) {
								dhAlert(
									`"${newVal}" already has field definitions and cannot be used ` +
									`as the root table. The root table should only reference other ` +
									`tables via its attributes, not define its own fields.`
								);
								dh.hot.setDataAtCell(row, col, oldVal || '', 'validation_revert');
							}
						}
					});
				}
				break;
			}
			case 'Class': {
				this.hotSettingsMenuHooks(dh, hot_settings, 'Class', ['name', 'schema_id', 'description']);
				const treeRootCol = dh.slot_name_to_column['tree_root'];
				if (treeRootCol !== undefined) {
					// Hide the tree_root column via HOT's hiddenColumns plugin.  The column
					// remains in the HOT config (not removed) and is managed via the Schema
					// tab's "Root Table" (root_class) field, not edited directly.
					hot_settings.hiddenColumns = { columns: [treeRootCol], indicators: false };
					dh._permanentlyHiddenCols = new Set([treeRootCol]);

					// Keep tree_root read-only in case the user reveals the column.
					hot_settings.cells = function(row, col) {
						return col === treeRootCol ? { readOnly: true } : {};
					};
				}

				// In "Records by selected key(s)" mode, hide the root-class row.  The root
				// class is identified by matching "name" against the Schema tab's root_class
				// value for the currently selected schema.
				const nameCol = dh.slot_name_to_column['name'];
				if (nameCol !== undefined) {
					let _hiding = false;
					dh.hot.addHook('afterRender', () => {
						if (_hiding) return;
						_hiding = true;
						this._hideRootClassRows(dh, nameCol);
						_hiding = false;
					});
				}

				// Cascade class-name renames into class_id FK columns on
				// dependent tabs. slot.class_id has no FK enforcement for
				// schema-level slots, so stale references must be fixed up
				// explicitly when a class is renamed.
				const classSchemaIdCol = dh.slot_name_to_column['schema_id'];
				if (nameCol !== undefined && classSchemaIdCol !== undefined) {
					dh.hot.addHook('afterChange', (changes, source) => {
						if (!changes) return;
						if (['loadData', 'updateData', 'upload', 'add_row',
							'validation_revert', 'cascade_rename'].includes(source)) return;
						const nameChanges = changes.filter(([, col, oldVal, newVal]) =>
							col === nameCol && oldVal && newVal && oldVal !== newVal
						);
						if (nameChanges.length === 0) return;

						for (const [row, , oldName, newName] of nameChanges) {
							const physRow = dh.hot.toPhysicalRow(row);
							const schemaId = dh.hot.getSourceDataAtCell(physRow, classSchemaIdCol);
							if (!schemaId) continue;

							for (const depTabName of ['Slot', 'SlotGroup', 'UniqueKey']) {
								const depDh = this.context.dhs[depTabName];
								if (!depDh) continue;
								const depClassIdCol  = depDh.slot_name_to_column['class_id'];
								const depSchemaIdCol = depDh.slot_name_to_column['schema_id'];
								if (depClassIdCol === undefined) continue;

								const updates = [];
								for (let pr = 0; pr < depDh.hot.countSourceRows(); pr++) {
									if (depSchemaIdCol !== undefined &&
										depDh.hot.getSourceDataAtCell(pr, depSchemaIdCol) !== schemaId) continue;
									if (depDh.hot.getSourceDataAtCell(pr, depClassIdCol) !== oldName) continue;
									const vRow = depDh.hot.toVisualRow(pr);
									if (vRow === null) continue;
									updates.push([vRow, depClassIdCol, newName]);
								}
								if (updates.length > 0) {
									depDh.hot.setDataAtCell(updates, 'cascade_rename');
								}
							}
						}
					});
				}
				break;
			}
			case 'SlotGroup':
				this.hotSettingsMenuHooks(dh, hot_settings, 'SlotGroup', ['name', 'schema_id', 'class_id']);
				break;
			case 'Slot':
				this.initSlotTab(dh, hot_settings);
				this.hotSettingsMenuHooks(dh, hot_settings, 'Slot', ['name', 'description']);
				break;
			case 'Enum':
				this.hotSettingsMenuHooks(dh, hot_settings, 'Enum', ['name', 'description']);
				break;
		}
	};

	/**
	 * In "Records by selected key(s)" mode, hide rows whose matchCol value equals
	 * the selected schema's root_class.  Used by afterRender hooks on the Class
	 * tab (matches "name") and the Slot tab (matches "class_id").
	 *
	 * @param {Object} dh       DataHarmonizer instance to operate on.
	 * @param {number} matchCol Column index whose value is compared to root_class.
	 */
	_hideRootClassRows(dh, matchCol) {
	  const schemaDh = this.context.dhs['Schema'];
	  if (!schemaDh) return;
	  const selRow = this.context.selectedTableRow('Schema');
	  if (selRow < 0) return;
	  const rootClassCol = schemaDh.slot_name_to_column['root_class'];
	  if (rootClassCol === undefined) return;
	  const rootClassName = schemaDh.hot.getDataAtCell(selRow, rootClassCol);
	  if (!rootClassName) return;

	  const hrPlugin = dh.hot.getPlugin('hiddenRows');
	  if (!hrPlugin) return;
	  const alreadyHidden = new Set(hrPlugin.getHiddenRows());
	  const toHide = [];
	  for (let p = 0; p < dh.hot.countSourceRows(); p++) {
	    const val = dh.hot.getSourceDataAtCell(p, matchCol);
	    if (val === rootClassName) {
	      const v = dh.hot.toVisualRow(p);
	      if (v !== null && !alreadyHidden.has(v)) toHide.push(v);
	    }
	  }
	  if (toHide.length > 0) hrPlugin.hideRows(toHide);
	}

	/**
	 * Register Handsontable hooks that trigger a menu refresh whenever rows in
	 * this tab are changed or removed.  Accepts a tab_name (key in TAB_MENU_MAP)
	 * so that the correct set of menus — this tab's own menu plus all dependent
	 * tab menus — is refreshed automatically.
	 */
	hotSettingsMenuHooks(dh, hot_settings, tab_name, keyColumns = null) {
	  // Resolve slot names to column indices once at registration time.
	  // afterChange `prop` equals the column index for array-based HOT data.
	  const keyColSet = keyColumns
	    ? new Set(keyColumns.map(n => dh.slot_name_to_column[n]).filter(i => i !== undefined))
	    : null;
	  dh.hot.addHook('afterChange',
	    (changes, source) => {
	      if (!changes) return;
	      // Skip when every change is a no-op (e.g. autocomplete commits the current value).
	      if (changes.every(([, , oldVal, newVal]) => oldVal === newVal)) return;
	      if (keyColSet && !changes.some(([, prop]) => keyColSet.has(prop))) return;
	      this.refreshMenusForTab(tab_name, source);
	    }
	  );
	  // afterCreateRow is omitted: a freshly-added empty row carries no name
	  // value yet so no menu entry would be added anyway.
	  // When the user has selected one or more whole rows (via the row-number
	  // header) and presses Delete/Backspace, remove those rows with a cascade-
	  // confirm dialog instead of HOT's default cell-clearing behaviour.
	  // Individual cell selections let the key through so cell contents can still
	  // be cleared normally.
	  // Note: on macOS the physical Delete key sends e.key='Backspace'; HOT itself
	  // registers both for emptySelectedCells, so both must be handled here.
	  dh.hot.addHook('beforeKeyDown', (e) => {
	    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
	    // If a cell editor is open the user is typing — let the key through.
	    if (dh.hot.getActiveEditor()?.isOpened()) return;
	    // Only intercept when the selection covers all columns (whole-row selection).
	    // A partial cell selection should still clear cell contents as normal.
	    const selected = dh.hot.getSelected() || [];
	    if (!selected.length) return;
	    const nCols = dh.hot.countCols();
	    const isWholeRowSelection = selected.every(([_r1, c1, _r2, c2]) =>
	      Math.min(c1, c2) <= 0 && Math.max(c1, c2) === nCols - 1
	    );
	    if (!isWholeRowSelection) return;
	    // Block HOT's emptySelectedCells shortcut before it runs.
	    e.isImmediatePropagationEnabled = false;
	    e.cancelBubble = true;
	    if (e.repeat) return false;
	    // Remove the selected rows, showing a cascade-confirm dialog when dependents exist.
	    dh.removeSelectedRows();
	    return false;
	  });
	}

	//initSchemaTab (dh, hot_settings) {}
	//initSlotGroupTab (dh, hot_settings) {}

	/**
	 * Build (or rebuild) an index of schema-defined slot rows for the Slot tab.
	 * The index maps `${schema_id}\0${slot_name}` → physical row number for every
	 * row whose slot_type is 'slot'.  Used by the cells() callback so it can look
	 * up inherited values in O(1) instead of walking adjacent visual rows (which
	 * broke under sorting, drag-and-drop, or row deletion).
	 */
	buildSlotDefinitionIndex(dh) {
	  const index = new Map();
	  const sourceData = dh.hot.getSourceData();
	  if (!sourceData) return;
	  for (let physRow = 0; physRow < sourceData.length; physRow++) {
	    const slot_type = dh.hot.getSourceDataAtCell(physRow, dh.slot_type_column);
	    if (slot_type === 'slot') {
	      const schema = dh.hot.getSourceDataAtCell(physRow, dh.schema_name_column);
	      const name   = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column);
	      if (schema != null && schema !== '' && name != null && name !== '') {
	        index.set(`${schema}\0${name}`, physRow);
	      }
	    }
	  }
	  dh.slotDefinitionIndex = index;
	}

	/**
	 * Post-filter validation errors for the Slot tab.
	 * Removes errors on empty cells of slot_usage rows where the corresponding
	 * schema-defined slot row (same schema_id + slot_name) has a non-empty value
	 * for that column.  Those cells are intentionally blank — their value is
	 * supplied by LinkML inheritance — so flagging them as required-but-empty
	 * would be a false positive.  Cells in slot/attribute rows, and non-empty
	 * cells in slot_usage rows, are left untouched.
	 *
	 * @param {Object} dh  DataHarmonizer instance for the Slot tab.
	 * @param {Array}  data  Visual-row data array from hot.getData().
	 * @param {Object} errors  Raw error map {visualRow: {col: message}}.
	 * @returns {Object}  Filtered error map.
	 */
	filterInheritedSlotUsageErrors(dh, data, errors) {
	  if (!dh.slotDefinitionIndex || dh.slotDefinitionIndex.size === 0) return errors;

	  const filtered = {};
	  for (const [vRowStr, colErrors] of Object.entries(errors)) {
	    const vRow = Number(vRowStr);
	    const slotType = data[vRow]?.[dh.slot_type_column];

	    if (slotType !== 'slot_usage') {
	      filtered[vRowStr] = colErrors;
	      continue;
	    }

	    // For slot_usage rows keep only errors on cells that are not inherited.
	    const slotName  = data[vRow][dh.slot_name_column];
	    const schemaName = data[vRow][dh.schema_name_column];
	    const defPhysRow = dh.slotDefinitionIndex.get(`${schemaName}\0${slotName}`);

	    const keptErrors = {};
	    for (const [colStr, message] of Object.entries(colErrors)) {
	      const col = Number(colStr);
	      const cellValue = data[vRow][col];
	      const isEmpty = cellValue === null || cellValue === undefined || cellValue === '';

	      if (isEmpty && defPhysRow !== undefined) {
	        const defValue = dh.hot.getSourceDataAtCell(defPhysRow, col);
	        const defHasValue = defValue !== null && defValue !== undefined && defValue !== '';
	        if (defHasValue) continue; // inherited — suppress error
	      }
	      keptErrors[colStr] = message;
	    }

	    if (Object.keys(keptErrors).length > 0) {
	      filtered[vRowStr] = keptErrors;
	    }
	  }
	  return filtered;
	}

	/**
	 * Add validation errors for `ifabsent` cells that reference an enum name
	 * (CamelCase function call like `SomeEnum(choice)`) that is not defined in
	 * the Enum tab for the same schema.
	 *
	 * @param {Object} dh     DataHarmonizer instance for the Slot tab.
	 * @param {Array}  data   Visual-row data array (hot.getData()).
	 * @param {Object} errors Existing error map {vRowStr: {colStr: message}}.
	 * @returns {Object} Augmented error map.
	 */
	validateIfAbsentEnumRefs(dh, data, errors) {
	  const ifabsent_col = dh.slot_name_to_column['ifabsent'];
	  if (ifabsent_col === undefined) return errors;
	  const enum_dh = this.context.dhs['Enum'];
	  if (!enum_dh) return errors;

	  const ENUM_CALL_RE = /^([A-Z][A-Za-z0-9]*)\(.+\)$/;

	  // Collect rows that have an enum-function ifabsent value.
	  const enumCells = [];
	  for (let vRow = 0; vRow < data.length; vRow++) {
	    const row = data[vRow];
	    if (!row) continue;
	    const ifabsent = row[ifabsent_col];
	    if (!ifabsent) continue;
	    const m = String(ifabsent).trim().match(ENUM_CALL_RE);
	    if (!m) continue;
	    enumCells.push({ vRow, enumName: m[1], schemaId: row[dh.schema_name_column] || '' });
	  }
	  if (!enumCells.length) return errors;

	  // Build a per-schema lookup of known enum names from the Enum tab.
	  const name_col   = enum_dh.slot_name_to_column['name'];
	  const schema_col = enum_dh.slot_name_to_column['schema_id'];
	  const knownEnums = new Map(); // schemaId → Set<enumName>
	  for (let row = 0; row < enum_dh.hot.countSourceRows(); row++) {
	    const schemaId = enum_dh.hot.getSourceDataAtCell(row, schema_col) || '';
	    const enumName = enum_dh.hot.getSourceDataAtCell(row, name_col);
	    if (!enumName) continue;
	    if (!knownEnums.has(schemaId)) knownEnums.set(schemaId, new Set());
	    knownEnums.get(schemaId).add(enumName);
	  }

	  const result = Object.assign({}, errors);
	  for (const { vRow, enumName, schemaId } of enumCells) {
	    const known = knownEnums.get(schemaId) ?? new Set();
	    if (!known.has(enumName)) {
	      const vRowStr = String(vRow);
	      if (!result[vRowStr]) result[vRowStr] = {};
	      result[vRowStr][String(ifabsent_col)] =
	        `Unknown enum: "${enumName}" is not defined in schema "${schemaId || '(unset)'}"`;
	    }
	  }
	  return result;
	}

	initSlotTab (dh, hot_settings) {

	  const slot_table_attribute_column = ['inlined','inlined_as_list'].map((x) => dh.slot_name_to_column[x]);

	  // See https://forum.handsontable.com/t/how-to-unhide-columns-after-hiding-them/5086/6
	  hot_settings.contextMenu.items['hidden_columns_hide'] = {};
	  hot_settings.contextMenu.items['hidden_columns_show'] = {};

	  // Field-tab row removal: always show a typed confirmation dialog.
	  // Schema fields (slot_type='slot') require Expert User mode and cascade-
	  // delete all slot_usage rows that reference them in the same schema.
	  hot_settings.contextMenu.items['remove_row'] = {
	    name: 'Remove row(s)',
	    async callback() {
	      const hot      = dh.hot;
	      const isExpert = !!dh.context.expert_user;

	      // ── 1. Collect selected visual rows ──────────────────────────────────
	      const selectedRanges = hot.getSelected() || [];
	      const visualRowSet   = new Set();
	      for (const [r1, , r2] of selectedRanges) {
	        for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) visualRowSet.add(r);
	      }
	      const visualRows = [...visualRowSet].sort((a, b) => a - b);
	      if (!visualRows.length) return;

	      // ── 2. Build per-row field info ───────────────────────────────────────
	      const TYPE_LABEL = {
	        slot:       'Schema field',
	        slot_usage: 'Table field (from schema)',
	        attribute:  'Table field (stand-alone)',
	      };
	      const fields = visualRows.map(vRow => {
	        const physRow  = hot.toPhysicalRow(vRow);
	        const slotType = hot.getSourceDataAtCell(physRow, dh.slot_type_column)      || 'slot';
	        const name     = hot.getSourceDataAtCell(physRow, dh.slot_name_column)      || '';
	        const title    = hot.getSourceDataAtCell(physRow, dh.slot_title_column)     || '';
	        const schemaId = hot.getSourceDataAtCell(physRow, dh.schema_name_column)    || '';
	        const classId  = hot.getSourceDataAtCell(physRow, dh.slot_class_id_column)  || '';
	        return { vRow, physRow, slotType, name, title, schemaId, classId };
	      });

	      // ── 3. For each schema field, find slot_usage rows that reference it ──
	      // These rows will be cascade-deleted when the base slot is removed.
	      const schemaFieldReuses    = new Map(); // name → [classId, ...]
	      const schemaFieldCascadePs = new Map(); // name → [physRow, ...]
	      for (const f of fields) {
	        if (f.slotType !== 'slot') continue;
	        const reusedIn   = [];
	        const cascadePhys = [];
	        for (let p = 0; p < hot.countSourceRows(); p++) {
	          if (hot.getSourceDataAtCell(p, dh.slot_type_column)   !== 'slot_usage') continue;
	          if (hot.getSourceDataAtCell(p, dh.slot_name_column)   !== f.name)       continue;
	          if (hot.getSourceDataAtCell(p, dh.schema_name_column) !== f.schemaId)   continue;
	          reusedIn.push(hot.getSourceDataAtCell(p, dh.slot_class_id_column) || '(unnamed)');
	          cascadePhys.push(p);
	        }
	        schemaFieldReuses.set(f.name,    reusedIn);
	        schemaFieldCascadePs.set(f.name, cascadePhys);
	      }

	      const hasSchemaFields = fields.some(f => f.slotType === 'slot');
	      const okDisabled      = hasSchemaFields && !isExpert;

	      // ── 4. Build dialog HTML ──────────────────────────────────────────────
	      let tableRows = '';
	      for (const f of fields) {
	        const label     = f.title || f.name || '(unnamed)';
	        const typeLabel = TYPE_LABEL[f.slotType] || f.slotType;
	        const isSchema  = f.slotType === 'slot';
	        const reusedIn  = isSchema ? (schemaFieldReuses.get(f.name) || []) : [];
	        const reusedCell = isSchema
	          ? (reusedIn.length ? `<em>${reusedIn.join(', ')}</em>` : '<em>none</em>')
	          : (f.classId ? `<em>${f.classId}</em>` : '');
	        tableRows += `<tr>
	          <td>${label}</td>
	          <td>${isSchema ? `<strong>${typeLabel}</strong>` : typeLabel}</td>
	          <td>${reusedCell}</td>
	        </tr>`;
	      }

	      const tableHtml = `
	        <table class="table table-sm table-bordered mb-2" style="font-size:0.9em">
	          <thead class="thead-light">
	            <tr><th>Field</th><th>Type</th><th>Used in table</th></tr>
	          </thead>
	          <tbody>${tableRows}</tbody>
	        </table>`;

	      let warningHtml = '';
	      for (const f of fields) {
	        if (f.slotType !== 'slot') continue;
	        const reusedIn = schemaFieldReuses.get(f.name) || [];
	        const label    = f.title || f.name;
	        if (reusedIn.length) {
	          warningHtml +=
	            `<p class="text-danger mb-1"><strong>Warning:</strong> Deleting schema field ` +
	            `<strong>${label}</strong> will also delete its reuse ${reusedIn.length === 1 ? 'entry' : 'entries'} in: ` +
	            `<strong>${reusedIn.join(', ')}</strong>.</p>`;
	        } else {
	          warningHtml +=
	            `<p class="mb-1">Schema field <strong>${label}</strong> ` +
	            `is not reused by any table &mdash; only the library entry will be deleted.</p>`;
	        }
	      }

	      const expertNote = (hasSchemaFields && !isExpert)
	        ? `<p class="text-warning mt-2"><strong>Expert User mode is required</strong> ` +
	          `to delete Schema fields. Enable it via the File menu &rarr; ` +
	          `&ldquo;Toggle expert user mode&rdquo;.</p>`
	        : '';

	      const bodyHtml =
	        `<p class="mb-2">The following field${fields.length > 1 ? 's' : ''} will be removed:</p>` +
	        tableHtml + warningHtml + expertNote;

	      // ── 5. Show confirmation dialog ───────────────────────────────────────
	      const choice = await dhChoose(
	        bodyHtml,
	        ['Delete'],
	        {
	          title:           'Remove field(s)',
	          html:            true,
	          cancelLabel:     'Cancel',
	          disabledIndices: okDisabled ? [0] : [],
	        }
	      );
	      if (choice !== 0) return;

	      // ── 6. Delete selected rows + cascade slot_usage rows for schema fields ─
	      const physRowsToDelete = new Set(fields.map(f => f.physRow));
	      for (const f of fields) {
	        if (f.slotType !== 'slot') continue;
	        for (const p of (schemaFieldCascadePs.get(f.name) || [])) {
	          physRowsToDelete.add(p);
	        }
	      }
	      const newData = hot.getSourceData().filter((_, idx) => !physRowsToDelete.has(idx));
	      hot.loadData(newData);
	      hot.deselectCell();
	      dh.context.schemaEditor.refreshMenusForTab(dh.template_name);
	      dh.context.crudCalculateDependentKeys(dh.template_name);
	      setTimeout(() => dh.context.refreshTabDisplay(), 0);
	    },
	  };
	  // Could be turning off/on based on expert user
	  hot_settings.hiddenColumns = {
	    // set columns that are hidden by default
	    columns: slot_table_attribute_column,
	    indicators: false
	  }

	  // Disable the filter dropdown button on the slot_type column — filtering by
	  // type is handled by the dedicated slot-type filter control, not the column
	  // header menu.  Handsontable has no per-column dropdownMenu:false option;
	  // the only supported way is removing the .changeType button in afterGetColHeader.
	  // Wrap (not replace) the base DataHarmonizer afterGetColHeader so that the
	  // base hook still runs (it sets data-ref and secondary-header-cell on every column).
	  const _baseGetColHeader = hot_settings.afterGetColHeader;
	  hot_settings.afterGetColHeader = (col, TH, headerlev) => {
	    if (_baseGetColHeader) _baseGetColHeader.call(this, col, TH, headerlev);
	    if (col !== dh.slot_type_column) return;
	    const button = TH.querySelector('.changeType');
	    if (button) button.parentElement.removeChild(button);
	  };

	  //hot_settings.fixedColumnsLeft = 4; // Freeze both schema and slot name.

	  // Override getInvalidCells so that empty inherited cells in slot_usage rows
	  // are not reported as validation errors.  The standard validator sees them
	  // as required-but-empty, but they are intentionally blank (values are
	  // supplied by downstream LinkML inheritance from the parent slot definition).
	  const originalGetInvalidCells = dh.getInvalidCells.bind(dh);
	  dh.getInvalidCells = (data) => {
	    const errors = originalGetInvalidCells(data);
	    const filtered = this.filterInheritedSlotUsageErrors(dh, data, errors);
	    return this.validateIfAbsentEnumRefs(dh, data, filtered);
	  };

	  // Maintain the slot-definition index so cells() can do O(1) lookups.
	  // indexDirty starts true so the very first render always attempts a build.
	  // beforeRender fires just before HOT calls cells() for each visible cell.
	  // We stay dirty until a render sees actual source rows, because in HOT 15
	  // afterLoadData fires AFTER the render cycle that follows updateSettings({data}),
	  // so we cannot rely on afterLoadData to mark dirty before the first real render.
	  let indexDirty = true;
	  const markDirty = () => { indexDirty = true; };
	  dh.hot.addHook('afterChange', (changes) => { if (changes) markDirty(); });
	  dh.hot.addHook('afterRemoveRow', markDirty);
	  dh.hot.addHook('afterRowMove', markDirty);
	  dh.hot.addHook('beforeRender', () => {
	    if (indexDirty) {
	      this.buildSlotDefinitionIndex(dh);
	      // Only mark clean once real data is present.  If HOT hasn't loaded its
	      // rows yet the rebuilt index will be empty and we retry next render.
	      const sourceData = dh.hot.getSourceData();
	      if (sourceData && sourceData.length > 0) {
	        indexDirty = false;
	      }
	    }
	  });

	  // function(row, col, prop) has prop == column name if implemented; otherwise = col #
	  // Issue: https://forum.handsontable.com/t/gh-6274-best-place-to-set-cell-meta-data/4710
	  // We can't lookup existing .getCellMeta() without causing stack overflow.
	  // ISSUE: We have to disable sorting for 'Slot' table because
	  // separate reporting controls are at work.

	  // Table ID, Type, and Section are now unconditionally read-only (managed
  // exclusively via the Edit Field modal).  Only Field ID (slot_name_column)
  // remains interactively editable (via the modal click handler).
  const slot_editable_keys = [dh.slot_name_column];

	  // ISSUE: user clicking on "toggle expert user mode" doesn't visually
	  // take effect until after dh.render(), so cellProp.readOnly doesn't
	  // work right away.
	  // NOTE: In HOT 15+, cells() receives PHYSICAL row and column indices
	  // (see dynamicCellMeta.js: cellMeta.cells(physicalRow, physicalColumn, prop)).
	  // All lookups below use getSourceDataAtCell with the physical row directly.
	  hot_settings.cells = function(row, col) {
	    let cellProp = {};
	    let read_only = false;

	    // row is already a physical row index in HOT 15+.
	    const slot_type = dh.hot.getSourceDataAtCell(row, dh.slot_type_column);
	    cellProp.className = 'tabFieldTd ' + slot_type;

			if (col in [dh.schema_name_column]) { // 0th column usually.
				read_only = true;
			}

			if (col === dh.slot_rank_column) { // Ordering — managed by drag-and-drop.
				read_only = true;
			}

		  //if (slot_type === 'slot' && !dh.context.expert_user) {
		  //	read_only = true;
		  //}

			if (slot_type === 'slot_usage') {
				if (slot_editable_keys.includes(col)) {
		    	read_only = false;
				}
				// Apply 'inherited' CSS to cells whose value comes from the schema-level
				// slot definition.  Cells remain editable; the class is a visual cue only.
				// Look up by (schema_id, slot_name) in the pre-built index — O(1) and
				// unaffected by sort order or row position.
				else if (dh.slotDefinitionIndex) {
			    const this_slot_name = dh.hot.getSourceDataAtCell(row, dh.slot_name_column);
			    const this_schema    = dh.hot.getSourceDataAtCell(row, dh.schema_name_column);
			    const defPhysRow = dh.slotDefinitionIndex.get(`${this_schema}\0${this_slot_name}`);
			    if (defPhysRow !== undefined) {
			      const def_value = dh.hot.getSourceDataAtCell(defPhysRow, col);
			      if (def_value !== null && def_value !== undefined && def_value !== '') {
			        cellProp.className += ' inherited';
			      }
			    }
				}
			}

    // Table ID, Type, and Section are managed exclusively through the Edit
    // Field modal.  Force read-only for all slot types so clicking or
    // keyboard-navigating into these cells does not open an inline editor.
    // This overrides any read_only = false set by slot_editable_keys above.
    if (col === dh.slot_class_id_column ||
        col === dh.slot_type_column ||
        col === dh.slot_group_column) {
      read_only = true;
    }

	    /* Handsontable assigns .htDimmed to any cell with .readOnly = true
			 * see https://handsontable.com/docs/javascript-data-grid/disabled-cells/
	     */
	    cellProp.readOnly = read_only;

	    return cellProp;
	  }
    
  // Keep HOT's empty minRows placeholder rows at the bottom of the sorted
  // display. The DataHarmonizer default is sortEmptyCells: true, which causes
  // empty rows to sort to the top when the primary sort key (schema_id) is
  // ascending — they appear above real data rows. Setting false pushes them
  // to the end regardless of sort direction, which is the expected UX.
  hot_settings.multiColumnSorting.sortEmptyCells = false;

	  // ── Slot-type row filter ────────────────────────────────────────────────
	  // Stored on the DH instance so it survives tab switches.
	  // Empty set = no filter (show all types).  Updated by AppContext.refreshTabDisplay()
	  // from the Fields-by-type section in the Display dropdown whenever that tab is active.
	  dh._slotTypeFilter = new Set(['slot_usage', 'attribute']); // hide schema-level slots by default

	
	  // Sort option 1 (default): schema → table → section → rank within section
	  dh.slotSortByStructure = [
	    {column: dh.schema_name_column,   sortOrder: 'asc'}, // schema_id
	    {column: dh.slot_class_id_column, sortOrder: 'asc'}, // class_id (table)
	    {column: dh.slot_group_column,    sortOrder: 'asc'}, // slot_group (section)
	    {column: dh.slot_rank_column,     sortOrder: 'asc'}, // rank within section
	  ];
	  // Sort option 2: field label → schema → table
	  dh.slotSortByLabel = [
	    {column: dh.slot_title_column,    sortOrder: 'asc'}, // title (field label)
	    {column: dh.schema_name_column,   sortOrder: 'asc'}, // schema_id
	    {column: dh.slot_class_id_column, sortOrder: 'asc'}, // class_id (table)
	  ];
	  dh.defaultMultiColumnSortConfig = dh.slotSortByStructure;

	  // Enable drag-and-drop row reordering for the Slot tab.
	  hot_settings.manualRowMove = true;

	  // ── Field Key Modal: intercept Add Row and key-field cell edits ─────────
	  // Replaces Guards 1/2/3.  The modal collects all key fields upfront and
	  // derives slot_type from context.

	  // A. Override addRows for the Slot tab so both the footer "Add" button and
	  //    right-click insert open the modal instead of the FK-parent guard popup.
	  dh.addRows = () => this.showFieldKeyModal(dh, null);

	  // Remove dropdown picklists for columns managed by the Field Key Modal.
	  // Modify hot_settings.columns directly — updateColumnSettings() cannot be
	  // used here because this runs during createHot() before HOT plugins are
	  // fully initialized (hiddenRows plugin index mapper is not yet ready).
	  // Also clear slot.sources so refreshMenus does not repopulate the dropdown.
	  const MODAL_COLS = [
	    dh.schema_name_column,    // schema_id
	    dh.slot_class_id_column,  // class_id
	    dh.slot_type_column,      // slot_type
	    dh.slot_group_column,     // slot_group
	  ];
	  for (const colIdx of MODAL_COLS) {
	    if (colIdx === undefined) continue;
	    if (dh.slots[colIdx]) delete dh.slots[colIdx].sources;
	    if (hot_settings.columns[colIdx]) {
	      hot_settings.columns[colIdx].type = 'text';
	      hot_settings.columns[colIdx].source = null;
	    }
	  }

	  // Fix the Ordering (rank) column to a narrow width — it's read-only and
  // managed by drag-and-drop, so it only needs to show a small integer.
  if (dh.slot_rank_column !== undefined && hot_settings.columns[dh.slot_rank_column]) {
    hot_settings.columns[dh.slot_rank_column].width = 60;
  }

  // Render the slot_type column using the enum's human-readable titles
	  // (e.g. "Schema field" instead of "slot") sourced from merged_permissible_values
	  // so that any locale translations are picked up automatically.
	  const slotTypeCol = dh.slot_type_column;
	  if (slotTypeCol !== undefined && hot_settings.columns[slotTypeCol]) {
	    const pvMap = dh.slots[slotTypeCol]?.merged_permissible_values ?? {};
	    const slotTypeLabels = new Map(
	      Object.values(pvMap).map((pv) => [pv.text, pv.title ?? pv.text])
	    );
	    if (slotTypeLabels.size > 0) {
	      hot_settings.columns[slotTypeCol].renderer = function (hot, TD, row, col, prop, value, cellProperties) {
	        Handsontable.renderers.TextRenderer(hot, TD, row, col, prop, slotTypeLabels.get(value) ?? value, cellProperties);
	      };
	    }
	  }

	  // Only Field ID (slot_name_column) triggers the Edit Field modal on click.
  // Table ID, Type, and Section are read-only and do not open the modal.
  // schema_name_column is a hidden FK column and is already unconditionally read-only.
  const KEY_COLUMNS = new Set([
	    dh.slot_name_column,
	  ]);

	  // B. afterOnCellMouseDown — open modal on the first click on a key-field
	  //    cell.  Intercepting here means the HOT editor never opens for those
	  //    cells, which prevents password-manager extensions (e.g. LastPass)
	  //    from scanning the grid in response to an active editor.
	  dh.hot.addHook('afterOnCellMouseDown', (event, coords) => {
	    if (coords.row < 0) return; // header — ignore
	    if (!KEY_COLUMNS.has(coords.col)) return; // not a key column
	    if (event.button === 2) return; // right-click — let context menu open, not modal
	    if (event.shiftKey || event.ctrlKey || event.metaKey) return; // range-select
	    // Abort any editor HOT may have opened for this click.
	    if (dh.hot.getActiveEditor()?.isOpened()) {
	      dh.hot.getActiveEditor().finishEditing(true); // cancel, no beforeChange
	    }
	    setTimeout(() => this.showFieldKeyModal(dh, coords.row), 0);
	  });

	  // C. beforeChange safety net — catches keyboard-driven edits to key cells
	  //    (arrow-key navigation then Enter/F2 to open editor and commit).
	  dh.hot.addHook('beforeChange', (changes, source) => {
	    if (!changes) return;
	    if (['loadData', 'updateData', 'batch_updates', 'cascade_confirm',
	         'upload', 'field_key_modal', 'drag_section_update'].includes(source)) return;

	    const keyEdit = changes.find(([, col]) => KEY_COLUMNS.has(col));
	    if (!keyEdit) return; // non-key field — let it through

	    const visualRow = keyEdit[0];
	    setTimeout(() => this.showFieldKeyModal(dh, visualRow), 0);
	    return false; // cancel inline edit
	  });

	  // D. afterChange — inherited-cell edit dialog.
	  //    When the user edits a non-key cell in a slot_usage row whose current
	  //    value was inherited from the base schema slot, ask how to apply the
	  //    change:
	  //      0 "Update schema field"    — write newVal to the base slot so all
	  //        tables that reuse this slot inherit the change automatically.
	  //      1 "Override for this table only" — keep newVal in the slot_usage
	  //        row only (current default behaviour, no extra action needed).
	  //     -1 Cancel — revert the slot_usage cell to the original value.
	  //
	  //    The hook is synchronous (no async/await) to avoid returning a Promise
	  //    to HOT's hook runner, which would corrupt the 'changes' argument for
	  //    subsequent hooks.  The dialog is opened via setTimeout so HOT finishes
	  //    processing the current change before the modal appears.
	  //    'cascade_confirm' source tags all programmatic follow-up setDataAtCell
	  //    calls so this hook is not re-entered.
	  let _inheritedEditDialogOpen = false;
	  dh.hot.addHook('afterChange', (changes, source) => {
	    if (!changes) return;
	    if (_inheritedEditDialogOpen) return; // one dialog at a time
	    // Skip all programmatic / internal sources; only intercept real user edits.
	    const _SKIP = new Set([
	      'loadData', 'updateData', 'batch_updates', 'cascade_confirm',
	      'upload', 'field_key_modal', 'drag_section_update',
	    ]);
	    if (_SKIP.has(source)) return;

	    for (const [visualRow, col, oldVal, newVal] of changes) {
	      if (oldVal === newVal) continue;          // no real change
	      if (KEY_COLUMNS.has(col)) continue;       // key columns — FKM handles them

	      const physRow = dh.hot.toPhysicalRow(visualRow);
	      if (physRow == null) continue;

	      const slotType = dh.hot.getSourceDataAtCell(physRow, dh.slot_type_column);
	      if (slotType !== 'slot_usage') continue;  // only slot_usage rows

	      if (!dh.slotDefinitionIndex) continue;
	      const slotName   = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column);
	      const schemaId   = dh.hot.getSourceDataAtCell(physRow, dh.schema_name_column);
	      const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${slotName}`);
	      if (defPhysRow === undefined) continue;   // no base slot — standalone field

	      const baseVal = dh.hot.getSourceDataAtCell(defPhysRow, col);
	      const _empty  = (v) => v === null || v === undefined || v === '';
	      if (_empty(baseVal)) continue;            // base slot has no value for this col
	      if (oldVal !== baseVal) continue;         // was already an explicit override

	      // Find all OTHER slot_usage rows for the same slot+schema so we can
	      // inform the user and hardcode their values when needed.
	      const otherSlotUsages = [];
	      for (let pr = 0; pr < dh.hot.countSourceRows(); pr++) {
	        if (pr === physRow) continue;
	        if (dh.hot.getSourceDataAtCell(pr, dh.slot_type_column) !== 'slot_usage') continue;
	        if (dh.hot.getSourceDataAtCell(pr, dh.slot_name_column) !== slotName)     continue;
	        if (dh.hot.getSourceDataAtCell(pr, dh.schema_name_column) !== schemaId)   continue;
	        otherSlotUsages.push({
	          physRow: pr,
	          classId: dh.hot.getSourceDataAtCell(pr, dh.slot_class_id_column),
	          val:     dh.hot.getSourceDataAtCell(pr, col),
	        });
	      }

	      // Capture everything before the setTimeout fires.
	      const fieldTitle = dh.slots[col]?.title ?? dh.slots[col]?.name ?? `column ${col}`;
	      const captured   = { visualRow, col, oldVal, newVal, defPhysRow, baseVal, otherSlotUsages };

	      // Build the context note for the "Override for this table only" option.
	      let overrideNote;
	      if (otherSlotUsages.length === 0) {
	        overrideNote = `(no other table uses this slot)`;
	      } else {
	        const classNames = otherSlotUsages
	          .map(su => `<em>${su.classId}</em>`)
	          .join(', ');
	        overrideNote =
	          `(other tables use this slot: ${classNames} — their ` +
	          `<strong>${fieldTitle}</strong> value will be 'hardcoded' to the current ` +
	          `schema slot value: <strong>${baseVal}</strong>)`;
	      }

	      const reusingNote = otherSlotUsages.length === 0
	        ? 'currently none'
	        : otherSlotUsages.map(su => `<em>${su.classId}</em>`).join(', ');

	      const isExpert = !!dh.context.expert_user;
	      const expertWarning = isExpert ? '' :
	        `<p class="text-warning mt-2"><strong>Expert User mode is required</strong> ` +
	        `to apply changes to inherited fields. Enable it via the File menu → "Toggle expert user mode" to ` +
	        `unlock these options.</p>`;

	      const body =
	        `<p>You changed <strong>${fieldTitle}</strong> on a field that inherits ` +
	        `its value from the schema field library entry for <strong>${slotName}</strong>.</p>` +
	        `<ul>` +
	        `<li><strong>Update schema field</strong> — Apply the change to the schema ` +
	        `field library. All tables that reuse this field (${reusingNote}) will inherit the new value.</li>` +
	        `<li><strong>Override for this table only</strong> — Store the new value in ` +
	        `this table's field settings only. The schema field value will be cleared so ` +
	        `no LinkML inheritance constraint applies. ${overrideNote}</li>` +
	        `</ul>` +
	        expertWarning;

	      _inheritedEditDialogOpen = true;
	      // Open the dialog after HOT has finished processing the current change.
	      setTimeout(() => {
	        dhChoose(
	          body,
	          ['Update schema field', 'Override for this table only'],
	          {
	            title: 'Inherited field changed',
	            html: true,
	            cancelLabel: 'Cancel (revert change)',
	            disabledIndices: isExpert ? [] : [0, 1],
	          }
	        ).then((choice) => {
	          _inheritedEditDialogOpen = false;
	          if (choice === 0) {
	            // Apply to base slot — all tables inherit the change.
	            // Slot_usage keeps newVal; _buildSchemaYaml dedup strips it when
	            // it matches the updated base slot value.
	            const baseVisualRow = dh.hot.toVisualRow(captured.defPhysRow);
	            dh.hot.setDataAtCell(baseVisualRow, captured.col, captured.newVal, 'cascade_confirm');
	          } else if (choice === 1) {
	            // Override for this table only:
	            //   1. Clear the base slot value (null → removed from YAML by deleteEmptyKeyVals)
	            //      so no LinkML inheritance constraint applies to any table.
	            //   2. Hardcode the old inherited value in every other slot_usage row that
	            //      was still inheriting it, so those tables don't silently lose the value.
	            //   The current slot_usage already holds newVal — no extra write needed.
	            const baseVisualRow = dh.hot.toVisualRow(captured.defPhysRow);
	            dh.hot.setDataAtCell(baseVisualRow, captured.col, null, 'cascade_confirm');
	            for (const other of captured.otherSlotUsages) {
	              // Only hardcode rows that were still showing the inherited value.
	              if (other.val === captured.baseVal) {
	                const otherVisualRow = dh.hot.toVisualRow(other.physRow);
	                dh.hot.setDataAtCell(otherVisualRow, captured.col, captured.baseVal, 'cascade_confirm');
	              }
	            }
	          } else {
	            // Cancel — revert the slot_usage cell to the inherited value.
	            dh.hot.setDataAtCell(captured.visualRow, captured.col, captured.oldVal, 'cascade_confirm');
	          }
	        });
	      }, 0);

	      break; // handle one inherited change per afterChange call
	    }
	  });

	  // E. afterRowMove — after a drag-and-drop:
	  //   1. Auto-update Section if a neighbouring row (same schema+class) has a
	  //      non-empty section that differs from the moved row's current section.
	  //   2. Re-sequence rank values for every affected schema+class group so
	  //      the new visual order is preserved through saves and re-sorts.
	  //
	  // All reads/writes use PHYSICAL rows (toPhysicalRow + getSourceDataAtCell /
	  // setSourceDataAtCell) so that the active sort + manualRowMove index stacks
	  // don't produce stale mappings.  setSourceDataAtCell bypasses beforeChange /
	  // afterChange hooks, so we call hot.render() explicitly at the end to commit
	  // the raw-data changes to the display before any sort re-applies.
	  dh.hot.addHook('afterRowMove', (movedRows, finalIndex, dropIndex, movePossible, orderChanged) => {
	    if (!orderChanged || !movePossible) return;

	    const hot = dh.hot;
	    const totalRows = hot.countRows(); // visible rows only (hidden excluded)

	    // Return slot_group for the row at visual index adjacentVR that shares
	    // the same schema+class as the moved row, or null if not applicable.
	    const sectionOf = (adjacentVR, refSchema, refClass) => {
	      if (adjacentVR < 0 || adjacentVR >= totalRows) return null;
	      const pr = hot.toPhysicalRow(adjacentVR);
	      if (pr == null) return null;
	      if ((hot.getSourceDataAtCell(pr, dh.schema_name_column) ?? '') !== refSchema) return null;
	      if ((hot.getSourceDataAtCell(pr, dh.slot_class_id_column) ?? '') !== refClass) return null;
	      return hot.getSourceDataAtCell(pr, dh.slot_group_column) ?? '';
	    };

	    // Collect [physicalRow, col, value] triples.
	    const physChanges = [];

	    // 1. Section auto-update for each moved row.
	    movedRows.forEach((_, i) => {
	      const vr = finalIndex + i;
	      const pr = hot.toPhysicalRow(vr);
	      if (pr == null) return;

	      const currentSection = hot.getSourceDataAtCell(pr, dh.slot_group_column) ?? '';
	      const refSchema      = hot.getSourceDataAtCell(pr, dh.schema_name_column) ?? '';
	      const refClass       = hot.getSourceDataAtCell(pr, dh.slot_class_id_column) ?? '';

	      const prevSection = sectionOf(vr - 1, refSchema, refClass);
	      const nextSection = sectionOf(vr + 1, refSchema, refClass);

	      const prevDiffers = prevSection !== null && prevSection !== '' && prevSection !== currentSection;
	      const nextDiffers = nextSection !== null && nextSection !== '' && nextSection !== currentSection;

	      // Boundary drop: only one neighbour may be in the target section — use ||.
	      // Prev takes priority (entering from above); fall back to next.
	      if (prevDiffers || nextDiffers) {
	        physChanges.push([pr, dh.slot_group_column, prevDiffers ? prevSection : nextSection]);
	      }
	    });

	    // 2. Re-sequence ranks for all schema+class groups that contain a moved row.
	    const groupsSeen = new Set();
	    movedRows.forEach((_, i) => {
	      const vr = finalIndex + i;
	      const pr = hot.toPhysicalRow(vr);
	      if (pr == null) return;

	      const schema = hot.getSourceDataAtCell(pr, dh.schema_name_column) ?? '';
	      const cls    = hot.getSourceDataAtCell(pr, dh.slot_class_id_column) ?? '';
	      const key    = `${schema}\0${cls}`;
	      if (groupsSeen.has(key)) return;
	      groupsSeen.add(key);

	      let rank = 1;
	      for (let r = 0; r < totalRows; r++) {
	        const rp = hot.toPhysicalRow(r);
	        if (rp == null) continue;
	        if ((hot.getSourceDataAtCell(rp, dh.schema_name_column) ?? '') !== schema) continue;
	        if ((hot.getSourceDataAtCell(rp, dh.slot_class_id_column) ?? '') !== cls) continue;
	        physChanges.push([rp, dh.slot_rank_column, rank++]);
	      }
	    });

	    if (physChanges.length > 0) {
	      // Write directly to source data (physical rows) — bypasses hook
	      // interception and ensures changes land before the next render.
	      for (const [pr, col, val] of physChanges) {
	        hot.setSourceDataAtCell(pr, col, val);
	      }
	      hot.render();
	    }
	  });

	  // In "Records by selected key(s)" mode, hide Slot rows whose class_id matches
	  // the selected schema's root_class (Container rows not intended for direct editing).
	  const classIdCol = dh.slot_name_to_column['class_id'];
	  if (classIdCol !== undefined) {
	    let _hiding = false;
	    dh.hot.addHook('afterRender', () => {
	      if (_hiding) return;
	      _hiding = true;
	      this._hideRootClassRows(dh, classIdCol);
	      _hiding = false;
	    });
	  }
	}

	/**
	 * Show the Field Configuration modal for the Slot tab.
	 * Opens when the user clicks "Add" (visualRow = null) or clicks a key-field
	 * cell in an existing row (visualRow = visual index of that row).
	 *
	 * Three slot_type cases:
	 *   A) No class selected      → slot_type = 'slot'   (schema field library)
	 *   B) Class + field in lib   → radio: slot_usage (default) | attribute
	 *   C) Class + field NOT in lib → radio: slot_usage+auto-create (default) | attribute
	 *
	 * @param {Object}      dh         The Slot-tab DataHarmonizer instance.
	 * @param {number|null} visualRow  null = add new; visual row index = edit existing.
	 */
	showFieldKeyModal(dh, visualRow = null) {
	  const hot = dh.hot;

	  // ── 1. Read existing row data if editing ─────────────────────────────
	  let initSchemaId  = '';
	  let initClassId   = '';
	  let initSlotType  = '';
	  let initName      = '';
	  let initSlotGroup = '';
	  let initTitle     = '';

	  if (visualRow !== null) {
	    const physRow  = hot.toPhysicalRow(visualRow);
	    initSchemaId   = hot.getSourceDataAtCell(physRow, dh.schema_name_column)   || '';
	    initClassId    = hot.getSourceDataAtCell(physRow, dh.slot_class_id_column) || '';
	    initSlotType   = hot.getSourceDataAtCell(physRow, dh.slot_type_column)     || '';
	    initName       = hot.getSourceDataAtCell(physRow, dh.slot_name_column)     || '';
	    initSlotGroup  = hot.getSourceDataAtCell(physRow, dh.slot_group_column)    || '';
	    initTitle      = hot.getSourceDataAtCell(physRow, dh.slot_title_column)    || '';
	  } else {
	    // Default to the schema currently highlighted in the Schema tab.
	    initSchemaId = this.getSchemaEditorSelectedSchema() || '';
	  }

	  // ── 2. Build Schema ID dropdown ──────────────────────────────────────
	  // In "All records" mode the user may choose any loaded schema.
	  // In single-schema (Records by selected key) mode only the active schema
	  // is shown and the dropdown is disabled to prevent accidentally placing a
	  // field into a different schema.
	  const isAllRecords = $('input[name="display-main-type"]:checked').val() === 'all';
	  const schemaDh      = this.context.dhs['Schema'];
	  const schemaNameCol = schemaDh.slot_name_to_column['name'];
	  const $schemaSelect = $('#fkm-schema-id').empty();
	  if (isAllRecords) {
	    for (let r = 0; r < schemaDh.hot.countSourceRows(); r++) {
	      const sn = schemaDh.hot.getSourceDataAtCell(r, schemaNameCol);
	      if (sn) $schemaSelect.append($('<option>').val(sn).text(sn));
	    }
	    $schemaSelect.prop('disabled', false);
	  } else {
	    // Lock the dropdown to the field's own schema.  For new fields initSchemaId
	    // is already set from getSchemaEditorSelectedSchema() (see line above); for
	    // edits it comes from the row data directly — so we never rely on the Schema
	    // tab cursor, which may be pointing at a different schema than the field
	    // being edited (e.g. the user navigated to the Field tab without clicking
	    // the Test schema row after copying fields from another schema).
	    if (initSchemaId) $schemaSelect.append($('<option>').val(initSchemaId).text(initSchemaId));
	    $schemaSelect.prop('disabled', true);
	  }
	  if (initSchemaId) $schemaSelect.val(initSchemaId);

	  // ── 3. Class dropdown builder (filtered by schema) ───────────────────
	  const classDh       = this.context.dhs['Class'];
	  const classNameCol  = classDh?.slot_name_to_column['name'];
	  const classSchemaCol = classDh?.slot_name_to_column['schema_id'];

	  const rebuildClassDropdown = (schemaId, preselect) => {
	    const $cls = $('#fkm-class-id').empty();
	    $cls.append($('<option value="">— none —</option>'));
	    if (classDh && classNameCol !== undefined) {
	      for (let r = 0; r < classDh.hot.countSourceRows(); r++) {
	        const rSchema = classDh.hot.getSourceDataAtCell(r, classSchemaCol);
	        if (rSchema !== schemaId) continue;
	        const cn = classDh.hot.getSourceDataAtCell(r, classNameCol);
	        if (cn && cn !== 'Container') $cls.append($('<option>').val(cn).text(cn));
	      }
	    }
	    if (preselect) $cls.val(preselect);
	  };

	  // ── 4. SlotGroup dropdown builder (filtered by schema) ───────────────
	  const sgDh        = this.context.dhs['SlotGroup'];
	  const sgNameCol   = sgDh?.slot_name_to_column['name'];
	  const sgSchemaCol = sgDh?.slot_name_to_column['schema_id'];
	  const sgClassCol  = sgDh?.slot_name_to_column['class_id'];

	  const rebuildSlotGroupDropdown = (schemaId, classId, preselect) => {
	    const $sg = $('#fkm-slot-group').empty();
	    $sg.append($('<option value="">— none —</option>'));
	    if (sgDh && sgNameCol !== undefined) {
	      for (let r = 0; r < sgDh.hot.countSourceRows(); r++) {
	        const rSchema = sgDh.hot.getSourceDataAtCell(r, sgSchemaCol);
	        if (rSchema !== schemaId) continue;
	        if (classId && sgClassCol !== undefined) {
	          const rClass = sgDh.hot.getSourceDataAtCell(r, sgClassCol) ?? '';
	          if (rClass !== classId) continue;
	        }
	        const sgn = sgDh.hot.getSourceDataAtCell(r, sgNameCol);
	        if (sgn) $sg.append($('<option>').val(sgn).text(sgn));
	      }
	    }
	    if (preselect) $sg.val(preselect);
	  };

	  // ── 4b. Field ID datalist builder (slot names from selected schema) ──
	  const rebuildFieldIdDatalist = (schemaId) => {
	    const $dl = $('#fkm-name-list').empty();
	    for (let r = 0; r < hot.countSourceRows(); r++) {
	      if (hot.getSourceDataAtCell(r, dh.slot_type_column) !== 'slot') continue;
	      if (hot.getSourceDataAtCell(r, dh.schema_name_column) !== schemaId) continue;
	      const name = hot.getSourceDataAtCell(r, dh.slot_name_column);
	      if (name) $dl.append($('<option>').val(name));
	    }
	  };

	  // ── 5. Show/hide "Field reuse" row and update labels ─────────────────
	  // preferred: 'attribute' | 'slot_usage' (anything else treated as slot_usage).
	  // The radio is set unconditionally at the top — before any early return —
	  // so the correct value is always reflected even when the row is hidden.
	  const updateSlotTypeRow = (preferred = 'slot_usage') => {
	    const classId  = $('#fkm-class-id').val();
	    const fieldId  = $('#fkm-name').val().trim();
	    const schemaId = $('#fkm-schema-id').val();
	    const $row    = $('#fkm-slot-type-row');
	    const $label  = $('#fkm-type-slot-usage-label');
	    const $help   = $('#fkm-slot-type-help');
	    const $sectionRow = $('#fkm-slot-group').closest('tr');

	    // Normalise preferred — guards against Event objects when the function is
	    // used directly as a jQuery event handler (e.g. .on('input', fn)).
	    const radio = (preferred === 'attribute') ? 'attribute' : 'slot_usage';
	    $('#fkm-type-attribute').prop('checked', radio === 'attribute');
	    $('#fkm-type-slot-usage').prop('checked', radio === 'slot_usage');

	    if (!classId) {
	      $row.hide();
	      $sectionRow.hide();
	      return;
	    }
	    $sectionRow.show();
	    if (!fieldId) {
	      $row.hide();
	      return;
	    }

	    const fieldInLibrary = dh.slotDefinitionIndex
	      ? dh.slotDefinitionIndex.has(`${schemaId}\0${fieldId}`)
	      : false;

	    $row.show();
	    if (fieldInLibrary) {
	      $label.text('Inherit from schema field library (slot_usage)');
	      $help.text('The field already exists in the library. slot_usage inherits its attributes; attribute overrides them all.');
	    } else {
	      $label.text('Add to schema field library, then link (slot_usage)');
	      $help.text('Field ID not yet in the library. Choosing the first option adds it there automatically.');
	    }

	    // Show "Copy schema-inherited field attributes" checkbox only when the user
	    // is editing an existing slot_usage row and has switched to attribute.
	    const showCopyRow = (visualRow !== null) &&
	                        (initSlotType === 'slot_usage') &&
	                        (radio === 'attribute');
	    $('#fkm-copy-inherited-row').toggle(showCopyRow);
	  };

	  // ── 6. Initial population and change wiring ──────────────────────────
	  rebuildClassDropdown(initSchemaId, initClassId);
	  rebuildSlotGroupDropdown(initSchemaId, initClassId, initSlotGroup);
	  rebuildFieldIdDatalist(initSchemaId);
	  $('#fkm-name').val(initName);
	  $('#fkm-title').val(initTitle);
	  // Pass the row's existing slot_type as the preferred radio value so both
	  // Case B (field in library) and Case C (not in library) honour it.
	  const radioDefault = initSlotType === 'attribute' ? 'attribute' : 'slot_usage';
	  updateSlotTypeRow(radioDefault);

	  // Detach old handlers to avoid stacking across multiple modal opens.
	  $('#fkm-schema-id').off('change.fkm').on('change.fkm', function() {
	    const sid = $(this).val();
	    rebuildClassDropdown(sid, '');
	    rebuildSlotGroupDropdown(sid, '', '');
	    rebuildFieldIdDatalist(sid);
	    updateSlotTypeRow();
	  });
	  $('#fkm-class-id').off('change.fkm').on('change.fkm', function() {
	    const cid = $(this).val();
	    const sid = $('#fkm-schema-id').val();
	    // Restore the original section when the user navigates back to the original table.
	    const preselect = (cid === initClassId) ? initSlotGroup : '';
	    rebuildSlotGroupDropdown(sid, cid, preselect);
	    updateSlotTypeRow();
	  });
	  $('#fkm-name').off('input.fkm').on('input.fkm', () => updateSlotTypeRow('slot_usage'));
  $('input[name="fkm-slot-type"]').off('change.fkm').on('change.fkm', function() {
    updateSlotTypeRow($(this).val());
  });

	  // ── 7. Open the modal ─────────────────────────────────────────────────
	  const $modal = $('#field-key-modal');
	  $('#field-key-modal-title').text(visualRow !== null ? 'Edit Field' : 'Add Field');
	  $('#fkm-error').hide().text('');
	  $modal.modal('show');

	  // ── 8. Confirm handler ───────────────────────────────────────────────
	  $('#fkm-confirm-btn').off('click.fkm').on('click.fkm', () => {
	    const schemaId  = $('#fkm-schema-id').val();
	    const classId   = $('#fkm-class-id').val();
	    const fieldId   = $('#fkm-name').val().trim();
	    // Section is only applicable when a Table is selected; ignore otherwise.
	    const slotGroup = classId ? $('#fkm-slot-group').val() : '';
	    const title     = $('#fkm-title').val().trim();

	    // Validate required fields.
	    if (!schemaId) {
	      $('#fkm-error').show().text('Schema ID is required.');
	      return;
	    }
	    if (!fieldId || !/^[a-z][a-z0-9_]*$/.test(fieldId)) {
	      $('#fkm-error').show().text('Field ID is required and must use lowercase snake_case (e.g. my_field_name).');
	      return;
	    }

	    // Derive slot_type.
	    const slot_type = classId
	      ? $('input[name="fkm-slot-type"]:checked').val() // 'slot_usage' | 'attribute'
	      : 'slot';

	    const fieldInLibrary = dh.slotDefinitionIndex
	      ? dh.slotDefinitionIndex.has(`${schemaId}\0${fieldId}`)
	      : false;

	    // Build [[row, col, value], ...] for setDataAtCell.
	    // omitTitle: skip title when it has already been written to the base slot
	    // so the slot_usage row inherits it rather than overriding it explicitly.
	    const buildCells = (row, omitTitle = false) => {
	      const cells = [
	        [row, dh.slot_type_column,   slot_type],
	        [row, dh.schema_name_column, schemaId],
	        [row, dh.slot_name_column,   fieldId],
	      ];
	      if (classId)             cells.push([row, dh.slot_class_id_column, classId]);
	      if (slotGroup)           cells.push([row, dh.slot_group_column,    slotGroup]);
	      if (title && !omitTitle) cells.push([row, dh.slot_title_column,    title]);
	      return cells;
	    };

	    // Append one row at the end; returns its visual index.
	    const appendOne = (src) => {
	      const n = hot.countRows();
	      if (n === 0) {
	        hot.alter('insert_row_above', 0, 1, src);
	      } else {
	        hot.alter('insert_row_below', n - 1, 1, src);
	      }
	      return hot.countRows() - 1;
	    };

	    if (visualRow === null) {
	      // Case C: slot_usage for a field not yet in the library →
	      // auto-insert a base slot row first, then the slot_usage row.
	      if (slot_type === 'slot_usage' && !fieldInLibrary) {
	        const baseRow = appendOne('field_key_modal');
	        const baseCells = [
	          [baseRow, dh.slot_type_column,   'slot'],
	          [baseRow, dh.schema_name_column, schemaId],
	          [baseRow, dh.slot_name_column,   fieldId],
	        ];
	        // Copy title (and any future descriptive fields) to the base slot so
	        // the slot_usage row inherits them rather than overriding explicitly.
	        if (title) baseCells.push([baseRow, dh.slot_title_column, title]);
	        hot.setDataAtCell(baseCells, 'field_key_modal');
	      }

	      const targetRow = appendOne('field_key_modal');
	      // Omit title from the slot_usage row when it was written to the base
	      // slot above — the slot_usage will inherit it (shown as 'inherited').
	      const omitTitle = slot_type === 'slot_usage' && !fieldInLibrary;
	      hot.setDataAtCell(buildCells(targetRow, omitTitle), 'field_key_modal');
	      hot.selectCell(targetRow, 0);
	      hot.scrollViewportTo(targetRow, 0);
	    } else {
	      // Editing an existing row.
	      const physRow = hot.toPhysicalRow(visualRow);
	      hot.setDataAtCell(buildCells(visualRow), 'field_key_modal');

	      // If switching slot_usage → attribute with "Copy schema-inherited field
	      // attributes" checked, copy any inherited (empty in this row) values from
	      // the base slot so no data is silently lost when inheritance is severed.
	      if (initSlotType === 'slot_usage' && slot_type === 'attribute' &&
	          $('#fkm-copy-inherited').is(':checked') && dh.slotDefinitionIndex) {
	        const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	        if (defPhysRow !== undefined) {
	          const _empty    = (v) => v === null || v === undefined || v === '';
	          const inherited = [];
	          for (let col = 0; col < hot.countCols(); col++) {
	            if (_empty(hot.getSourceDataAtCell(physRow, col))) {
	              const baseVal = hot.getSourceDataAtCell(defPhysRow, col);
	              if (!_empty(baseVal)) inherited.push([visualRow, col, baseVal]);
	            }
	          }
	          if (inherited.length) hot.setDataAtCell(inherited, 'field_key_modal');
	        }
	      }
	    }

	    $modal.modal('hide');
	  });
	}


	// The opposite of loadSchemaYAML!
	/**
	 * Builds the YAML string for the currently selected schema row.
	 * Returns { schema_name, yaml_string } or null if no schema is named/selected.
	 */
	_buildSchemaYaml() {
		const dh_schema = this.context.dhs.Schema;
		const schema_focus_row = dh_schema.current_selection[0];
		const schema_name = dh_schema.hot.getDataAtCell(schema_focus_row, 0);
		if (!schema_name) return null;

		/** Provide defaults here in ordered object prototype so that saved object
		 * is consistent.  At class and slot level ordered object prototypes are
		 * also used, but empty values are cleared out at bottom of save script.
		 */
		let new_schema = new Map([
		  ['id', ''],
		  ['name', ''],
		  ['title', ''],
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
		    token: {
		      name: 'token',
		      typeof: 'string',
		      description: 'Equivalent to an xs:token. A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes #x9 (tab), #xA (linefeed), and #xD (carriage return).',
		      base: 'str',
		      uri: 'xsd:token'
		    },
		    WhitespaceMinimizedString: {
		      name: 'WhitespaceMinimizedString',
		      typeof: 'string',
		      description: 'Equivalent to an xs:token. Name is preserved here for backward compatibility.',
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

		// loop-local variable: the root class name captured from the Schema record.
		let schema_root_class = '';

		// Loop through loaded DH schema and all its dependent child tabs.
		let components = ['Schema', ... Object.keys(this.context.relations['Schema'].child)];
		for (let [, tab_name] of components.entries()) {
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
		      let value = dependent_dh.hot.getSourceDataAtCell(dep_row, dep_col);
		      if (value !== undefined && value !== null && value !== '') { //.length > 0 // took out !!value - was skipping numbers.
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
		          ['id','name','title','description','version','in_language','default_prefix']);
		        schema_root_class = record.root_class || '';

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

		        this.copyAttributes(tab_name, record, target_obj, 
		          ['name','title','description','version','class_uri','is_a','see_also']
		        );

		        break;

		      case 'UniqueKey': {
		        let class_record = this.getClass(new_schema, record.class_id);
		        if (!class_record.get('unique_keys'))
		           class_record.set('unique_keys', {});

		        // Build with description before unique_key_slots for deterministic
		        // save order: description is set first (if present), then
		        // unique_key_slots, then any remaining attributes.
		        target_obj = class_record.get('unique_keys')[record.name] = {};
		        this.copyAttributes(tab_name, record, target_obj, ['description']);
		        target_obj.unique_key_slots = record.unique_key_slots.split(';');
		        this.copyAttributes(tab_name, record, target_obj, ['notes']);
		        break;
		      }

		      case 'Slot':
		        if (record.name) {

		          let slot_name = record.name;
		          let su_class_obj = null;
		          if (['slot_usage','attribute'].includes(record.slot_type)) {
		            if (!record.class_id) {
		              console.warn(`Skipping ${record.slot_type} row "${slot_name}": missing class_id`);
		              break;
		            }
		            su_class_obj = this.getClass(new_schema, record.class_id);
		          }
		          switch (record.slot_type) {

		            // slot_usage and attribute cases are connected to a class
		            case 'slot_usage':
		              su_class_obj.get('slots').push(slot_name);
		              target_obj = su_class_obj.get('slot_usage')[slot_name] ??= this.makeSlotLike(
		                slot_name,
		                Object.keys(su_class_obj.get('slot_usage')).length + 1
		              );
		              break;

		            case 'attribute':
		              // See https://linkml.io/linkml/intro/tutorial02.html for Container objects.
		              // plural attributes
		              target_obj = su_class_obj.get('attributes')[slot_name] ??= this.makeSlotLike(
		                slot_name,
		                Object.keys(su_class_obj.get('attributes')).length + 1
		              );
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
		            record.any_of = ranges.map((x) => ({ range: x }));
		            record.range = '';
		            // Move min/max into the numeric any_of entry (nested pattern)
		            const numericEntry = record.any_of.find((e) => this.schema.types?.[e.range]);
		            if (numericEntry) {
		              if (record.minimum_value != null) { numericEntry.minimum_value = record.minimum_value; delete record.minimum_value; }
		              if (record.maximum_value != null) { numericEntry.maximum_value = record.maximum_value; delete record.maximum_value; }
		            }
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
		          // For slot_usage rows, strip any field values that were inherited
		          // from the base schema slot at load time so only true overrides are
		          // written to YAML.  Base-slot rows are processed first (slots precede
		          // classes in the row ordering), so new_schema.get('slots') already
		          // has the base slot's values when this code runs.
		          if (record.slot_type === 'slot_usage') {
		            const baseSlot = new_schema.get('slots').get(slot_name);
		            if (baseSlot) {
		              const skipKeys = new Set(['name','slot_type','class_id','schema_id','rank','slot_group']);
		              for (const key of Object.keys(record)) {
		                if (skipKeys.has(key)) continue;
		                const baseVal = baseSlot instanceof Map ? baseSlot.get(key) : baseSlot?.[key];
		                if (record[key] === baseVal) delete record[key];
		              }
		            } else {
		              dhAlert(`Schema misconfiguration: slot_usage "${slot_name}" in class "${record.class_id}" has no corresponding entry in the schema's global slots list.`);
		            }
		          }

		          // target_obj .name, .rank, .range, .any_of are handled above.
		          this.copyAttributes(tab_name, record, target_obj, ['name','title','slot_uri','version','slot_group','description','comments','notes','aliases','inlined','inlined_as_list','range','any_of','unit','required','recommended','ifabsent','identifier','multivalued','minimum_value','maximum_value','minimum_cardinality','maximum_cardinality','pattern','structured_pattern','todos','equals_expression','examples','exact_mappings']);

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
		        if (target_obj instanceof Map) {
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

		      case 'Enum': {
		        let enum_obj = new_schema.get('enums')[record.name] ??= {};
		        this.copyAttributes(tab_name, record, enum_obj, ['name','title','enum_uri','description']);
		        break;
		      }

		      case 'PermissibleValue': { // LOOP?????? 'text shouldn't be overwritten.
		        let permissible_values = new_schema.get('enums')[record.enum_id].permissible_values ??= {};
		        target_obj = permissible_values[record.text] ??= {};
		        if (record.exact_mappings) {
		          record.exact_mappings = this.getArrayFromDelimited(record.exact_mappings);
		        }
		        this.copyAttributes(tab_name, record, target_obj, ['text','title','description','meaning', 'is_a','exact_mappings','notes']);
		        break;
		      }

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
		new_schema.get('classes').forEach((class_map) => {
		  deleteEmptyKeyVals(class_map);
		  // slot_usage and attribute entries are pre-initialised plain objects
		  // (see makeSlotLike); clean their empty sentinels too.
		  const slot_usage = class_map.get('slot_usage');
		  if (slot_usage) {
		    Object.values(slot_usage).forEach((su) => deleteEmptyKeyVals(su));
		  }
		  const attributes = class_map.get('attributes');
		  if (attributes) {
		    Object.values(attributes).forEach((attr) => deleteEmptyKeyVals(attr));
		  }
		});

		// Apply tree_root from the Schema row's root_class field.
		// Exactly one class gets tree_root: true; all others have it removed.
		new_schema.get('classes').forEach((class_map, class_name) => {
		  if (schema_root_class && class_name === schema_root_class) {
		    class_map.set('tree_root', true);
		  } else {
		    class_map.delete('tree_root');
		  }
		});

		// Auto-generate the root-class (e.g. "Container") with one attribute per
		// non-root class so the saved YAML always has a valid tree_root container.
		// This completely replaces any Container class already in new_schema so
		// stale Class-tab data cannot leave orphaned or missing attribute entries.
		if (schema_root_class) {
		  const autoAttrs = {};
		  let rank = 1;
		  new_schema.get('classes').forEach((_, class_name) => {
		    if (class_name === schema_root_class) return; // skip the root class itself
		    autoAttrs[class_name] = {
		      name:            class_name,
		      rank:            rank++,
		      inlined_as_list: true,
		      range:           class_name,
		      multivalued:     true,
		    };
		  });
		  new_schema.get('classes').set(schema_root_class, new Map([
		    ['name',       schema_root_class],
		    ['tree_root',  true],
		    ['attributes', autoAttrs],
		  ]));
		}

		console.log("SLOTS", new_schema.get('slots'))
		new_schema.get('slots').forEach((attr_map) => {
		  deleteEmptyKeyVals(attr_map);
		});

		let metadata = dh_schema.hot.getCellMeta(schema_focus_row, 0);
		if (metadata.locales) {
		  console.log("Got Locales", metadata.locales)
		  new_schema.set('extensions', {locales: {tag: 'locales', value: metadata.locales}});
		}

		const yaml_string = YAML.stringify(new_schema, {
		  singleQuote: true,
		  lineWidth: 0,
		  customTags: ['timestamp']
		});

		return { schema_name, yaml_string };
	}

	saveSchema() {
		const result = this._buildSchemaYaml();
		if (!result) {
		  dhAlert("The currently selected schema needs to be named before saving. If you have named your schema please make sure it is selected before saving");
		  return;
		}
		const { schema_name, yaml_string } = result;
		const dh_schema = this.context.dhs.Schema;
		const [, confirm_message] = dh_schema.getChangeReport('Schema');
		const save_prompt = `Provide a name for the ${schema_name} schema YAML file. This will save the following schema parts:\n`;
		const file_name = prompt(save_prompt + confirm_message, 'schema.yaml');
		if (!file_name) return false;

		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([yaml_string], {type: 'text/plain'}));
		a.setAttribute('download', file_name);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		return true;
	}

	/**
	 * Opens a popup window containing a DataHarmonizer instance loaded with
	 * the currently selected schema (same content as saveSchema would export).
	 */
	demoSchema() {
		const result = this._buildSchemaYaml();
		if (!result) {
		  dhAlert("A schema needs to be named and selected before running a demo. If you have named your schema please make sure it is selected.");
		  return;
		}
		const { schema_name, yaml_string } = result;
		// Parse YAML Map → plain JS object suitable for Template.create(forced_schema)
		const schema = YAML.parse(yaml_string);

		// Validate minimum structure: at least one class with at least one field.
		const classes = schema.classes || {};
		const classNames = Object.keys(classes);
		if (classNames.length === 0) {
		  dhAlert('Demo requires at least one table. Please add a table with at least one field before running a demo.');
		  return;
		}
		const hasField = classNames.some(cn => {
		  const cls = classes[cn];
		  return (cls.slots && cls.slots.length > 0)
		      || (cls.slot_usage && Object.keys(cls.slot_usage).length > 0)
		      || (cls.attributes && Object.keys(cls.attributes).length > 0);
		});
		if (!hasField) {
		  dhAlert('Demo requires at least one field in a table. Please add a field to a table before running a demo.');
		  return;
		}

		sessionStorage.setItem(`dh_demo_${schema_name}`, JSON.stringify(schema));
		// &t= timestamp makes the URL unique on every call so window.open always
		// navigates the popup (causing it to reload from the updated sessionStorage).
		// Without it, an already-open popup with the same URL would just be focused
		// without reloading, so schema changes would not appear.
		const demoUrl = `${location.origin}${location.pathname}?demo=${encodeURIComponent(schema_name)}&t=${Date.now()}`;
		// Sanitize schema_name into a valid window target name (no spaces/special chars).
		// window.open reuses an existing window when the target name matches, so the
		// same schema always maps to the same popup instead of spawning a new one.
		const windowName = `dh_demo_${schema_name.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
		window.open(demoUrl, windowName, 'popup,width=1400,height=900,resizable=yes,scrollbars=yes');
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
		for (let [, attr_name] of Object.entries(attribute_list)) {
		  if (attr_name in record) { //No need to create/save empty values
		    if (target instanceof Map) {// Required for Map, preserves order.
		      target.set(attr_name, record[attr_name]);
		    }
		    else {
		      if (!target || !record) {
		        console.log(`Error: Saving ${class_name}, missing parameters:`, record, target, attribute_list)
		        dhAlert(`Software Error: Saving ${class_name} ${attr_name}: no target or record`);
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

	/**
	 * Returns a plain object with every slot-like key pre-initialised to the
	 * same empty sentinel values that getSlot() uses, in the same insertion
	 * order.  Used for slot_usage and attribute entries so their saved key
	 * order is deterministic and matches the canonical getSlot() order.
	 * deleteEmptyKeyVals() removes the sentinels during the save cleanup pass.
	 */
	makeSlotLike(name, rank) {
	  return {
	    name,
	    title:               '',
	    slot_uri:            '',
	    version:             '',
	    slot_group:          '',
	    rank,
	    description:         '',
	    comments:            '',
	    notes:               '',
	    aliases:             '',
	    inlined:             '',
	    inlined_as_list:     '',
	    range:               '',
	    any_of:              '',
	    unit:                {},
	    required:            '',
	    recommended:         '',
	    identifier:          '',
	    multivalued:         '',
	    minimum_value:       '',
	    maximum_value:       '',
	    minimum_cardinality: '',
	    maximum_cardinality: '',
	    pattern:             '',
	    structured_pattern:  {},
	    todos:               '',
	    equals_expression:   '',
	    examples:            '',
	    exact_mappings:      [],
	  };
	}

	getSlot(schema, name) {
		if (!schema.get('slots').has(name)) {
		  schema.get('slots').set(name, new Map([
		    ['name', ''],
		    ['title', ''],
		    ['slot_uri', ''],
		    ['version', ''],
		    ['slot_group', ''],
		    ['rank', ''],
		    ['description', ''],
		    ['comments', ''],
		    ['notes', ''],
		    ['aliases', ''],
		    ['inlined', ''],
		    ['inlined_as_list', ''],
		    ['range', ''],
		    ['any_of', ''],
		    ['unit', {}],
		    ['required', ''],
		    ['recommended', ''],
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
		    ['examples', ''],
		    ['exact_mappings', []],
		    ['attributes', {}]
		  ]) );
		}
		return schema.get('slots').get(name);
	};

  /***************************** LOAD & SAVE SCHEMAS **************************/

  /**
   * Returns true if the currently focused Schema row is empty and safe to
   * load a new schema into.  If it has any data, shows a dhAlert and returns
   * false.  Called by toolbar / menu handlers BEFORE opening a file picker so
   * the user gets the error without having to pick a file first.
   */
  schemaRowFreeForLoad() {
    const dh_schema = this.context.dhs?.Schema;
    if (!dh_schema) return true;

    let focus_row = 0;
    const focus_cell = dh_schema.hot.getSelected();
    if (focus_cell) {
      focus_row = parseInt(focus_cell[0][0]);
      if (focus_row < 0) focus_row = 0;
    }

    if (!dh_schema.hot.isEmptyRow(focus_row)) {
      dhAlert(
        'The selected Schema row already has data in it.\n\n' +
        'Please click on an empty Schema row before loading a schema file.'
      );
      return false;
    }
    return true;
  }

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
      dhAlert(`Unable to open schema.yaml file.  ${name}: ${message}`);
      return false;
    }

    let schema_name = schema.name; // Using this as the identifier field for schema (but not .id uri)
    let loaded_schema_name = schema.name; // In case of loading 2nd version of a given schema.

    let dh_uk = this.context.dhs.UniqueKey;
    let dh_sg = this.context.dhs.SlotGroup;
    let dh_slot = this.context.dhs.Slot;
    let dh_pv = this.context.dhs.PermissibleValue;
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


    const focusRowEmpty = dh_schema.hot.isEmptyRow(focus_row);
    let reload = false;
    if (rows.length > 0) {
      // RELOAD: If focused row is where schema_name is, then consider this a reload
      if (rows[0] == focus_row) {
        reload = true;
      }
      else {
        // Empty row so load schema here under a [schema_x] name
        if (focusRowEmpty) {
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
        // Some other data is in this row — block the load.
        else {
          this.schemaRowFreeForLoad(); return;
        }
      }
    }
    if (!focusRowEmpty) {
      this.schemaRowFreeForLoad(); return;
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
            // Guard: YAML arrays for single-value slots (e.g. in_language: ['en','fr']
            // from an older schema that used multi-select) must be serialised to a
            // semicolon-delimited string so HOT stores a primitive, not an object.
            if (Array.isArray(value)) value = this.getDelimitedString(value);
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

          case 'Enum': {
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
          }

          // Slot table is LinkML "slot_definition".  This same datatype is
          // referenced by class.slot_usage and class.annotation, so those
          // entries are added here.
          case 'Slot': {
            // Setting up empty class name as empty string since human edits to
            // create new generic slots will create same.
            let slot_name = value.name;
            this.addSlotRecord(dh, tables, loaded_schema_name, '', 'slot', slot_name, value);
            this.checkForAnnotations(tables, loaded_schema_name, null, slot_name, 'slot', value);
            break;
          }

          case 'Class': {
            let class_name = value.name;
            this.addRowRecord(dh, tables, {
              schema_id:   loaded_schema_name, 
              name:        class_name, 
              title:       value.title,
              description: value.description,
              version:     value.version,
              class_uri:   value.class_uri,
              is_a:        value.is_a,
              tree_root:   value.tree_root ?? null,
              see_also:    this.getDelimitedString(value.see_also)
            }); 

            this.checkForAnnotations(tables, loaded_schema_name, class_name, null, 'class', value); // i.e. class.annotations = ...

            // FUTURE: could ensure the unique_key_slots are marked required here.
            if (value.unique_keys) {
              for (let [key_name, obj] of Object.entries(value.unique_keys)) {
                this.addRowRecord(dh_uk, tables, {
                  schema_id: loaded_schema_name,
                  class_id:  class_name,
                  name:      key_name,
                  unique_key_slots: this.getDelimitedString(obj.unique_key_slots),
                  description: obj.description,
                  notes:     obj.notes // ??= ''
                });
              };
            };
            // Collect unique slot_group names from slot_usage (in rank order) for the SlotGroup tab.
            if (value.slot_usage) {
              const seen_groups = new Set();
              const sorted_slots = Object.values(value.slot_usage).sort(
                (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
              );
              for (let obj of sorted_slots) {
                if (obj.slot_group && !seen_groups.has(obj.slot_group)) {
                  seen_groups.add(obj.slot_group);
                  this.addRowRecord(dh_sg, tables, {
                    schema_id: loaded_schema_name,
                    class_id:  class_name,
                    name:      obj.slot_group
                  });
                }
              }
            }

            // class.slot_usage holds slot_definitions which are overrides on slots of slot_type 'slot'
            if (value.slot_usage) {
              // pass class_id as value.name into this?!!!!!!!e
              // This is where "table reuse" = [class name] gets to add a row into Field.
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
        }
      };

    };

    // Inherit base-slot content into slot_usage rows so the Field table shows
    // complete field definitions at a glance.  Slots are processed before
    // classes in the conversion loop above, so all base-slot rows are already
    // present in tables['Slot'] by this point.
    {
      const n2c      = dh_slot.slot_name_to_column;
      const typeCol  = n2c['slot_type'];
      const nameCol  = n2c['name'];
      const schemCol = n2c['schema_id'];
      const skipCols = new Set([schemCol, typeCol, n2c['class_id'], nameCol]);

      // Index base-slot rows: "schema_id\0name" → row array
      const baseIndex = new Map();
      for (const row of tables['Slot']) {
        if (row[typeCol] === 'slot') {
          baseIndex.set(`${row[schemCol]}\0${row[nameCol]}`, row);
        }
      }

      for (const row of tables['Slot']) {
        if (row[typeCol] !== 'slot_usage') continue;
        const baseRow = baseIndex.get(`${row[schemCol]}\0${row[nameCol]}`);
        if (!baseRow) continue;
        for (let col = 0; col < row.length; col++) {
          if (skipCols.has(col)) continue;
          if ((row[col] === null || row[col] === undefined || row[col] === '') &&
              baseRow[col] !== null && baseRow[col] !== undefined && baseRow[col] !== '') {
            row[col] = baseRow[col];
          }
        }
      }
    }

    // Clear validation state from the previous schema across all tabs before
    // loading new data.  updateSettings() below replaces the source data but
    // does not touch invalid_cells, so stale error markers would otherwise
    // survive the schema switch.
    for (const dh of Object.values(this.context.dhs)) {
      dh.clearValidationResults();
    }

    // Get all of the DH instances loaded.
    for (let class_name of Object.keys(this.context.relations['Schema'].child)) {
      let dh = this.context.dhs[class_name];
      // AVOID: dh.hot.loadData(...); INNEFICIENT
      dh.hot.updateSettings({data:Object.values(tables[class_name])});
    }

    // Derive root_class from the class that has tree_root: true in the loaded schema.
    {
      const rootEntry = Object.entries(schema.classes || {}).find(([, c]) => c.tree_root === true);
      if (rootEntry) {
        const rootClassCol = dh_schema.slot_name_to_column['root_class'];
        if (rootClassCol !== undefined) {
          dh_schema.hot.setDataAtCell(focus_row, rootClassCol, rootEntry[0], 'upload');
        }
        // The root (Container) class is auto-generated on save and should not
        // be visible to the user. Delete it and all its subordinate rows from
        // every DH grid before the tabs are first rendered (resumeExecution).
        const rootClassName = rootEntry[0];
        const classKeys = { schema_id: loaded_schema_name, class_id: rootClassName };
        this.deleteRowsByKeys('Slot',      classKeys);
        this.deleteRowsByKeys('UniqueKey', classKeys);
        this.deleteRowsByKeys('SlotGroup', classKeys);
        this.deleteRowsByKeys('Class',     { schema_id: loaded_schema_name, name: rootClassName });
      }
    }

    // New data type, class & enumeration items need to be reflected in DH
    // SCHEMAEDITOR menus. Done each time a schema is uploaded or focused on.
    this.context.schemaEditor.refreshMenus();

    // resumeExecution() must run before selectCell and crudCalculateDependentKeys.
    // Operations queued during suspension (including selectCell) are flushed here.
    dh_schema.hot.resumeExecution();

    // Explicitly re-select the loaded row so that getSelected() returns focus_row
    // reliably when crudCalculateDependentKeys reads it below.  Without this,
    // getSelected() may return null or a stale row index in some timing scenarios
    // (e.g. if the file-chooser dialog caused the HOT to deselect), which would
    // leave schema_id=null in the FK cascade and cause the Field tab to show no rows.
    dh_schema.hot.selectCell(focus_row, 0);

    this.context.crudCalculateDependentKeys(dh_schema.template_name);
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

      // For slots associated with a table by slot_usage or attribute
      class_id:    class_name,
      rank:        slot_obj.rank, 
      slot_group:  slot_obj.slot_group || '',
      inlined:     slot_obj.inlined ?? null,
      inlined_as_list: slot_obj.inlined_as_list ?? null,

      slot_uri:    slot_obj.slot_uri,
      title:       slot_obj.title,
      range:       slot_obj.range || this.getDelimitedString(slot_obj.any_of, 'range'),
      unit:        slot_obj.unit?.ucum_code || '', // See https://linkml.io/linkml-model/latest/docs/UnitOfMeasure/
      required:    slot_obj.required ?? null,
      recommended: slot_obj.recommended ?? null,
      description: slot_obj.description,
      aliases:     slot_obj.aliases,
      identifier:  slot_obj.identifier ?? null,
      multivalued: slot_obj.multivalued ?? null,
      ...getNumericConstraints(slot_obj, this.schema),
      minimum_cardinality: slot_obj.minimum_cardinality,
      maximum_cardinality: slot_obj.maximum_cardinality,
      pattern:     slot_obj.pattern,
      //NOTE that structured_pattern's partial_match and interpolated parameters are ignored.
      structured_pattern: slot_obj.structured_pattern?.syntax || '',
      ifabsent:    slot_obj.ifabsent,
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


  setToBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return false;
    return value.toLowerCase() === 'true';
  }

  deleteRowsByKeys(class_name, keys) {
    let rows = this.context.crudFindAllRowsByKeyVals(class_name, keys);
    this.context.crudDeleteRowsByPhysical(class_name, rows);
  };

  /**
   * Open the "Copy to Schema" modal for selected rows in the given DH instance.
   * Populates the target schema selector, analyses dependencies, then shows
   * a summary of what will be copied before the user confirms.
   */
  openCopyToSchemaModal(sourceDh) {
    if (sourceDh.template_name === 'Schema') {
      dhAlert(
        'Copying whole schemas is not supported here. Only parts of a schema (tables, fields, enumerations, etc.) can be copied to another schema.\n\n' +
        'To make a visible copy of an entire schema, load it a second time from its source file — it will appear as a separate row.'
      );
      return;
    }

    // Collect unique non-empty physical rows from all selection ranges.
    const selection = sourceDh.hot.getSelected() || [];
    const physRowSet = new Set();
    for (const [r1, , r2] of selection) {
      const lo = Math.min(r1, r2);
      const hi = Math.max(r1, r2);
      for (let vr = lo; vr <= hi; vr++) {
        const pr = sourceDh.hot.toPhysicalRow(vr);
        if (!sourceDh.hot.isEmptyRow(pr)) physRowSet.add(pr);
      }
    }
    if (physRowSet.size === 0) {
      dhAlert('Please select one or more non-empty rows to copy.');
      return;
    }
    const physRows = [...physRowSet];

    // Collect ALL source schema IDs from the selected rows (usually just one).
    const sourceSchemaIds = new Set();
    if (sourceDh.schema_name_column !== undefined) {
      for (const pr of physRows) {
        const sid = sourceDh.hot.getSourceDataAtCell(pr, sourceDh.schema_name_column);
        if (sid) sourceSchemaIds.add(sid);
      }
    }
    // Use the first source schema ID for dependency lookups.
    const sourceSchemaId = [...sourceSchemaIds][0] ?? null;

    // Collect schema names from the Schema tab.
    const dh_schema = this.context.dhs.Schema;
    const schemaNames = [];
    for (let pr = 0; pr < dh_schema.hot.countSourceRows(); pr++) {
      if (dh_schema.hot.isEmptyRow(pr)) continue;
      const name = dh_schema.hot.getSourceDataAtCell(pr, dh_schema.slot_name_column);
      if (name) schemaNames.push(name);
    }
    if (schemaNames.length === 0) {
      dhAlert('No schemas found. Please create a target schema first.');
      return;
    }

    // Populate the target schema select; disable source schema(s) to prevent
    // copying rows back to the schema they came from.
    const $select = $('#copy-to-schema-select').empty();
    for (const name of schemaNames) {
      const isSource = sourceSchemaIds.has(name);
      const label = isSource ? `${name} (source)` : name;
      const opt = $('<option>').val(name).text(label);
      if (isSource) opt.prop('disabled', true);
      $select.append(opt);
    }
    // Default to the first schema that isn't a source.
    const nonSource = schemaNames.find(n => !sourceSchemaIds.has(n));
    if (nonSource) $select.val(nonSource);

    // If there are no selectable targets, inform the user.
    if (!nonSource) {
      dhAlert('No other schemas available to copy to. Please create a target schema first.');
      return;
    }

    // Show row count + source schema(s) summary above the select.
    const schemaLabel = [...sourceSchemaIds].map(s => `"${s}"`).join(', ');
    const rowWord = physRows.length === 1 ? 'row' : 'rows';
    const schemaWord = sourceSchemaIds.size === 1 ? 'schema' : 'schemas';
    $('#copy-to-schema-summary').text(
      `Copying ${physRows.length} ${rowWord} from ${schemaWord} ${schemaLabel}`
    );

    // Persist state for use when the confirm button is clicked.
    this._copyState = { sourceDh, physRows, sourceSchemaId };

    // Detect whether any selected rows carry a class_id (slot_usage, attribute,
    // SlotGroup, etc.).  If so, show a "Copy to table" selector so the user can
    // pick which class in the target schema should own the copied rows.
    const classIdCol = sourceDh.slot_name_to_column['class_id'];
    const hasClassId = classIdCol !== undefined && physRows.some(pr => {
      const v = sourceDh.hot.getSourceDataAtCell(pr, classIdCol);
      return v != null && v !== '';
    });
    this._copyState.hasClassId = hasClassId;

    const updateClassSelect = (targetSchema) => {
      if (!hasClassId || !targetSchema) {
        $('#copy-to-class-row').hide();
        return;
      }
      // Reset to "assign" mode each time the target schema changes so the
      // dropdown is visible and the user makes an explicit choice.
      $('#copy-class-assign').prop('checked', true);
      $('#copy-to-class-select').show();

      const classDh = this.context.dhs['Class'];
      const classNames = [];
      if (classDh) {
        const nameCol  = classDh.slot_name_to_column['name'];
        const schemaCol = classDh.slot_name_to_column['schema_id'];
        for (let pr = 0; pr < classDh.hot.countSourceRows(); pr++) {
          if (classDh.hot.isEmptyRow(pr)) continue;
          if (schemaCol !== undefined &&
              classDh.hot.getSourceDataAtCell(pr, schemaCol) !== targetSchema) continue;
          const name = nameCol !== undefined
            ? classDh.hot.getSourceDataAtCell(pr, nameCol) : null;
          if (name) classNames.push(name);
        }
      }
      const $classSelect = $('#copy-to-class-select').empty();
      for (const name of classNames) {
        $classSelect.append($('<option>').val(name).text(name));
      }
      if (classNames.length > 0) {
        $classSelect.val(classNames[0]);
        $('#copy-to-class-row').show();
      } else {
        // No classes in target schema; fall back to preserve-only mode.
        $('#copy-class-preserve').prop('checked', true);
        $('#copy-to-class-select').hide();
        $('#copy-to-class-row').show();
      }
    };

    // Refresh the dependency summary whenever the target schema or checkbox changes.
    const updateDeps = () => {
      const targetSchema   = $select.val();
      const copyClassMode  = hasClassId
        ? ($('input[name="copy-class-mode"]:checked').val() || 'assign') : null;
      const targetClass    = (copyClassMode === 'assign')
        ? ($('#copy-to-class-select').val() || null) : null;
      if (!targetSchema) {
        $('#copy-parent-deps-row').hide();
        $('#copy-table-records-section').hide();
        $('#copy-picklists-section').hide();
        return;
      }

      const pvTabName = Object.keys(this.context.relations['Enum']?.child || {})[0] || null;
      const PICKLIST_TABS = new Set(['Picklists', 'Picklist choices']);
      const PICKLIST_TARGET_TABS = new Set(['Enum', pvTabName].filter(Boolean));
      const sourceIsEnum = sourceDh.template_name === 'Enum';
      const isPicklistDep = d => PICKLIST_TABS.has(d.tabName);
      const isPicklistSub = s => PICKLIST_TARGET_TABS.has(s.targetTabName);

      // Deps from directly selected rows.
      const allDeps = this._analyzeCopyDependencies(sourceDh, physRows, sourceSchemaId, targetSchema, { targetClassId: targetClass });
      const parentDepsFromSelected = allDeps.filter(d => !isPicklistDep(d));
      // When copying Enums, their PVs are Section-2 subordinates; for all other
      // source tabs, Enum/PV deps (via `range`) go to Section 3.
      const picklistDepsFromSelected = sourceIsEnum ? [] : allDeps.filter(d => isPicklistDep(d));

      // Subordinate child records.
      const allSubs = this._analyzeSubordinates(sourceDh, physRows, sourceSchemaId, targetSchema);
      const tableSubs = sourceIsEnum ? allSubs : allSubs.filter(s => !isPicklistSub(s));
      const picklistSubsFromSubs = sourceIsEnum ? [] : allSubs.filter(s => isPicklistSub(s));

      // Transitive deps of table-subs (e.g. Enums from child Slot `range` fields).
      const allSubDeps = this._computeSubDeps(tableSubs, sourceSchemaId, targetSchema);

      // Remove back-references to the rows being copied themselves.
      const selectedNamesInSource = new Set();
      const srcNameCol = sourceDh.slot_name_to_column['name'];
      if (srcNameCol !== undefined) {
        for (const pr of physRows) {
          const n = sourceDh.hot.getSourceDataAtCell(pr, srcNameCol);
          if (n) selectedNamesInSource.add(n);
        }
      }
      const filteredSubDeps = allSubDeps.filter(d =>
        !(d.targetTabName === sourceDh.template_name && selectedNamesInSource.has(d.name))
      );
      const parentSubDeps = filteredSubDeps.filter(d => !isPicklistDep(d));
      const picklistSubDeps = filteredSubDeps.filter(d => isPicklistDep(d));

      // Deduplication helper.
      const dedup = (list) => {
        const seen = new Set();
        return list.filter(d => {
          const key = `${d.targetTabName}:${d.name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };

      const allParentDeps = dedup([...parentDepsFromSelected, ...parentSubDeps]);
      const allPicklistDeps = dedup([...picklistDepsFromSelected, ...picklistSubDeps, ...picklistSubsFromSubs]);
      const parentDepKeys = new Set(allParentDeps.map(d => `${d.targetTabName}:${d.name}`));
      const allTableSubs = tableSubs.filter(s => !parentDepKeys.has(`${s.targetTabName}:${s.name}`));

      // Render a table with section headers carrying the count; items show name only.
      // firstSection, if given, is placed at the top of the ordering.
      const renderItemTable = (list, firstSection = null) => {
        const sectionOrder = ['Schema field', 'Table', 'Table section', 'Picklists', 'Picklist choices'];
        if (firstSection && !sectionOrder.includes(firstSection)) sectionOrder.unshift(firstSection);
        else if (firstSection) { sectionOrder.splice(sectionOrder.indexOf(firstSection), 1); sectionOrder.unshift(firstSection); }
        for (const d of list) {
          if (!sectionOrder.includes(d.tabName)) sectionOrder.push(d.tabName);
        }
        const grouped = {};
        for (const d of list) { (grouped[d.tabName] ??= []).push(d); }
        let rows = '';
        for (const section of sectionOrder) {
          if (!grouped[section]) continue;
          const items = grouped[section].sort((a, b) => a.name.localeCompare(b.name));
          const total = items.reduce((sum, d) => sum + d.rowCount, 0);
          rows += `<tr><td><strong>${section}</strong></td><td>${total} row${total !== 1 ? 's' : ''}</td></tr>`;
          for (const d of items) {
            rows += `<tr><td style="padding-left:1em">${d.name}</td><td></td></tr>`;
          }
        }
        return `<table class="table table-sm table-borderless mb-0">${rows}</table>`;
      };

      // Render a table with only section-header rows (count in header, no item rows).
      const renderSummaryTable = (list) => {
        const sectionOrder = ['Schema field', 'Table', 'Table section', 'Picklists', 'Picklist choices'];
        for (const s of list) {
          if (!sectionOrder.includes(s.tabName)) sectionOrder.push(s.tabName);
        }
        const grouped = {};
        for (const s of list) { (grouped[s.tabName] ??= []).push(s); }
        let rows = '';
        for (const section of sectionOrder) {
          if (!grouped[section]) continue;
          const total = grouped[section].reduce((sum, s) => sum + s.rowCount, 0);
          rows += `<tr><td><strong>${section}</strong></td><td>${total} row${total !== 1 ? 's' : ''}</td></tr>`;
        }
        return `<table class="table table-sm table-borderless mb-0">${rows}</table>`;
      };

      // --- Section 1: Selected rows + parent records (always copied, always shown) ---
      // Build one dep entry per selected row so they appear at the top of the list.
      const sourceTabTitle = this.context.template.current.schema.classes[sourceDh.template_name]?.title
        || sourceDh.template_name;
      const selectedDeps = physRows.map(pr => {
        const name = srcNameCol !== undefined
          ? (sourceDh.hot.getSourceDataAtCell(pr, srcNameCol) || `Row ${pr}`)
          : `Row ${pr}`;
        return { tabName: sourceTabTitle, name, rowCount: 1 };
      });
      $('#copy-parent-deps-list').html(renderItemTable([...selectedDeps, ...allParentDeps], sourceTabTitle));
      $('#copy-parent-deps-row').show();

      // --- Section 2: Dependent table records ---
      if (allTableSubs.length === 0) {
        $('#copy-table-records-section').hide();
      } else {
        $('#copy-table-records-list').html(renderSummaryTable(allTableSubs));
        $('#copy-table-records-section').show();
      }

      // --- Section 3: Picklists + per-PV checkboxes ---
      // Hide when Section 2 already contains enums/PVs (e.g. source is the
      // Enum tab — PVs appear as Section-2 subordinates) or when there are
      // simply no picklist deps to display.
      if (allPicklistDeps.length === 0 || allTableSubs.some(s => isPicklistSub(s))) {
        $('#copy-picklists-section').hide();
      } else {
        const enumDeps = allPicklistDeps.filter(d => d.tabName === 'Picklists');
        const pvDepsByEnum = new Map();
        allPicklistDeps.filter(d => d.tabName === 'Picklist choices')
          .forEach(d => pvDepsByEnum.set(d.name, d));

        let html = '';
        for (const enumDep of enumDeps) {
          const enumName = enumDep.name;
          const safeEnum = enumName.replace(/"/g, '&quot;');
          const pvDep = pvDepsByEnum.get(enumName);
          const count = pvDep ? pvDep.records.length : 0;
          html += `<div class="mb-1"><label class="mb-0"><input type="checkbox" class="enum-copy-checkbox" checked data-enum="${safeEnum}"> <strong>${enumName}</strong>${count ? ` (${count})` : ''}</label></div>`;
          if (pvDep) {
            for (const record of pvDep.records) {
              const pvText = record.text ?? '';
              const pvLabel = record.title || pvText;
              const safePv = pvText.replace(/"/g, '&quot;');
              html += `<div class="ml-3"><label class="mb-0"><input type="checkbox" class="pv-copy-checkbox" checked data-enum="${safeEnum}" data-pv="${safePv}"> ${pvLabel}</label></div>`;
            }
          }
        }
        $('#copy-picklists-list').html(html);
        // Unchecking an enum disables and grays its PV checkboxes.
        $('#copy-picklists-list').off('change.enumToggle').on('change.enumToggle', '.enum-copy-checkbox', function () {
          const enumName = $(this).data('enum');
          const on = $(this).is(':checked');
          $('#copy-picklists-list .pv-copy-checkbox')
            .filter(function () { return $(this).data('enum') === enumName; })
            .prop('disabled', !on)
            .closest('label').css('opacity', on ? '' : 0.5);
        });
        $('#copy-picklists-section').show();
      }
    };
    $select.off('change.copySchema').on('change.copySchema', () => {
      updateClassSelect($select.val());
      updateDeps();
    });
    $('#copy-to-class-select').off('change.copyClass').on('change.copyClass', updateDeps);
    $('input[name="copy-class-mode"]').off('change.copyClassMode').on('change.copyClassMode', function () {
      // Toggle the class dropdown visibility based on the selected mode.
      $('#copy-to-class-select').toggle($(this).val() === 'assign');
      updateDeps();
    });
    updateClassSelect(nonSource);
    updateDeps();

    $('#copy-to-schema-modal').modal('show');
  }

  /**
   * Build a { slot_name: value } record dict for a single physical row
   * in a DH instance, omitting null / empty values.
   */
  _gatherRowRecord(dh, physRow) {
    const record = {};
    for (const [colStr, slot] of Object.entries(dh.slots)) {
      const val = dh.hot.getSourceDataAtCell(physRow, parseInt(colStr));
      if (val !== null && val !== undefined && val !== '') {
        record[slot.name] = val;
      }
    }
    return record;
  }

  /**
   * Analyse which dependency rows must accompany the selected rows to the
   * target schema.  Returns an array of dependency descriptors:
   *   { tabName, targetTabName, name, rowCount, records }
   * where `records` are already mutated to use schema_id = targetSchema.
   *
   * Dependencies detected:
   *   - class_id FK → Class row
   *   - enum_id FK  → Enum row + its PermissibleValues
   *   - slot_usage  → base Slot row (slot_type = 'slot')
   *   - range attr  → Enum row + its PermissibleValues (if range names an Enum)
   *   - Enum source → auto-include PermissibleValues for every selected Enum row
   */
  _analyzeCopyDependencies(sourceDh, physRows, sourceSchemaId, targetSchema, options = {}) {
    // Find the permissible-value tab name dynamically from the Enum's child relation.
    const pvTabName = Object.keys(this.context.relations['Enum']?.child || {})[0] || null;

    const deps = [];
    const seenDeps = new Set();
    const seenPVs = new Set();

    // Pre-compute base slot names already present in the selection so they
    // are not duplicated in the dependencies list.
    const selectedBaseSlotNames = new Set();
    if (sourceDh.template_name === 'Slot') {
      const typeCol = sourceDh.slot_name_to_column['slot_type'];
      const nameCol = sourceDh.slot_name_to_column['name'];
      if (typeCol !== undefined && nameCol !== undefined) {
        for (const pr of physRows) {
          if (sourceDh.hot.getSourceDataAtCell(pr, typeCol) === 'slot') {
            const n = sourceDh.hot.getSourceDataAtCell(pr, nameCol);
            if (n) selectedBaseSlotNames.add(n);
          }
        }
      }
    }

    const addClassDep = (className) => {
      const key = `Class:${className}`;
      if (seenDeps.has(key)) return;
      seenDeps.add(key);
      if (this.context.crudFindAllRowsByKeyVals('Class', { schema_id: targetSchema, name: className }).length > 0) return;
      const srcRows = this.context.crudFindAllRowsByKeyVals('Class', { schema_id: sourceSchemaId, name: className });
      if (srcRows.length === 0) return;
      const dh = this.context.dhs['Class'];
      deps.push({
        tabName: 'Table', targetTabName: 'Class', name: className,
        rowCount: srcRows.length,
        records: srcRows.map(pr => { const r = this._gatherRowRecord(dh, pr); r.schema_id = targetSchema; return r; }),
      });
    };

    const addEnumPVsDep = (enumName) => {
      if (!pvTabName) return;
      const key = `PVs:${enumName}`;
      if (seenPVs.has(key)) return;
      seenPVs.add(key);
      // Skip if target already has permissible values for this enum.
      if (this.context.crudFindAllRowsByKeyVals(pvTabName, { schema_id: targetSchema, enum_id: enumName }).length > 0) return;
      const pvDh = this.context.dhs[pvTabName];
      if (!pvDh) return;
      const srcRows = this.context.crudFindAllRowsByKeyVals(pvTabName, { schema_id: sourceSchemaId, enum_id: enumName });
      if (srcRows.length === 0) return;
      deps.push({
        tabName: 'Picklist choices', targetTabName: pvTabName, name: enumName,
        rowCount: srcRows.length,
        records: srcRows.map(pr => { const r = this._gatherRowRecord(pvDh, pr); r.schema_id = targetSchema; return r; }),
      });
    };

    const addEnumDep = (enumName) => {
      const key = `Enum:${enumName}`;
      if (seenDeps.has(key)) return;
      seenDeps.add(key);
      const enumMissing = this.context.crudFindAllRowsByKeyVals('Enum', { schema_id: targetSchema, name: enumName }).length === 0;
      if (enumMissing) {
        const srcRows = this.context.crudFindAllRowsByKeyVals('Enum', { schema_id: sourceSchemaId, name: enumName });
        if (srcRows.length > 0) {
          const dh = this.context.dhs['Enum'];
          deps.push({
            tabName: 'Picklists', targetTabName: 'Enum', name: enumName,
            rowCount: srcRows.length,
            records: srcRows.map(pr => { const r = this._gatherRowRecord(dh, pr); r.schema_id = targetSchema; return r; }),
          });
        }
      }
      // Always bring permissible values along with the enum.
      addEnumPVsDep(enumName);
    };

    const addBaseSlotDep = (slotName) => {
      // Skip if the base slot is already part of the selection being copied.
      if (selectedBaseSlotNames.has(slotName)) return;
      const key = `BaseSlot:${slotName}`;
      if (seenDeps.has(key)) return;
      seenDeps.add(key);
      if (this.context.crudFindAllRowsByKeyVals('Slot', { schema_id: targetSchema, slot_type: 'slot', name: slotName }).length > 0) return;
      const srcRows = this.context.crudFindAllRowsByKeyVals('Slot', { schema_id: sourceSchemaId, slot_type: 'slot', name: slotName });
      if (srcRows.length === 0) return;
      const dh = this.context.dhs['Slot'];
      deps.push({
        tabName: 'Schema field', targetTabName: 'Slot', name: slotName,
        rowCount: srcRows.length,
        records: srcRows.map(pr => { const r = this._gatherRowRecord(dh, pr); r.schema_id = targetSchema; return r; }),
      });
    };

    // Add a SlotGroup dependency only when it is not already present in the
    // target schema for the same class.  The duplicate check uses both class_id
    // and name so that identically-named groups in different classes don't
    // suppress each other.
    const addSlotGroupDep = (slotGroupName, classId) => {
      const key = `SlotGroup:${classId}:${slotGroupName}`;
      if (seenDeps.has(key)) return;
      seenDeps.add(key);
      const targetSearch = { schema_id: targetSchema, name: slotGroupName };
      if (classId) targetSearch.class_id = classId;
      if (this.context.crudFindAllRowsByKeyVals('SlotGroup', targetSearch).length > 0) return;
      const srcSearch = { schema_id: sourceSchemaId, name: slotGroupName };
      if (classId) srcSearch.class_id = classId;
      const srcRows = this.context.crudFindAllRowsByKeyVals('SlotGroup', srcSearch);
      if (srcRows.length === 0) return;
      const dh = this.context.dhs['SlotGroup'];
      deps.push({
        tabName: 'Table section', targetTabName: 'SlotGroup', name: slotGroupName,
        rowCount: srcRows.length,
        records: srcRows.map(pr => { const r = this._gatherRowRecord(dh, pr); r.schema_id = targetSchema; return r; }),
      });
    };

    for (const physRow of physRows) {
      // class_id FK dependency (Slot slot_usage/attribute, SlotGroup, UniqueKey tabs).
      // Use the caller-supplied targetClassId override when provided (the user
      // chose a different class in the target schema via "Copy to table").
      const classIdCol = sourceDh.slot_name_to_column['class_id'];
      if (classIdCol !== undefined) {
        const srcClassId = sourceDh.hot.getSourceDataAtCell(physRow, classIdCol);
        const classId = options.targetClassId ?? srcClassId;
        if (classId) addClassDep(classId);
      }

      // enum_id FK dependency (PermissibleValue tab).
      const enumIdCol = sourceDh.slot_name_to_column['enum_id'];
      if (enumIdCol !== undefined) {
        const enumId = sourceDh.hot.getSourceDataAtCell(physRow, enumIdCol);
        if (enumId) addEnumDep(enumId);
      }

      // Slot-tab-specific dependencies.
      if (sourceDh.template_name === 'Slot') {
        const typeCol = sourceDh.slot_name_to_column['slot_type'];
        const nameCol = sourceDh.slot_name_to_column['name'];
        const classIdCol2 = sourceDh.slot_name_to_column['class_id'];

        // Base slot required for slot_usage rows (suppressed when that base
        // slot is already in the selection).
        if (typeCol !== undefined && nameCol !== undefined) {
          const slotType = sourceDh.hot.getSourceDataAtCell(physRow, typeCol);
          const slotName = sourceDh.hot.getSourceDataAtCell(physRow, nameCol);
          if (slotType === 'slot_usage' && slotName) addBaseSlotDep(slotName);
        }

        // slot_group reference → SlotGroup (Table section) dependency.
        const slotGroupCol = sourceDh.slot_name_to_column['slot_group'];
        if (slotGroupCol !== undefined) {
          const slotGroup = sourceDh.hot.getSourceDataAtCell(physRow, slotGroupCol);
          if (slotGroup) {
            const classId = classIdCol2 !== undefined
              ? sourceDh.hot.getSourceDataAtCell(physRow, classIdCol2) : null;
            addSlotGroupDep(slotGroup, classId);
          }
        }

        // `range` attribute that names an Enum → Enum + PermissibleValues.
        // slot_usage rows often don't set `range` directly — they inherit it
        // from the base slot (slot_type='slot', same name).  Fall back to the
        // base slot's range when the current row has no range of its own.
        const rangeCol = sourceDh.slot_name_to_column['range'];
        if (rangeCol !== undefined) {
          let rangeVal = sourceDh.hot.getSourceDataAtCell(physRow, rangeCol);
          if (!rangeVal && typeCol !== undefined && nameCol !== undefined) {
            const slotType = sourceDh.hot.getSourceDataAtCell(physRow, typeCol);
            const slotName = sourceDh.hot.getSourceDataAtCell(physRow, nameCol);
            if (slotType === 'slot_usage' && slotName) {
              const baseDh = this.context.dhs['Slot'];
              const baseRangeCol = baseDh?.slot_name_to_column['range'];
              if (baseDh && baseRangeCol !== undefined) {
                const baseRows = this.context.crudFindAllRowsByKeyVals('Slot', {
                  schema_id: sourceSchemaId, slot_type: 'slot', name: slotName,
                });
                if (baseRows.length > 0) {
                  rangeVal = baseDh.hot.getSourceDataAtCell(baseRows[0], baseRangeCol);
                }
              }
            }
          }
          if (rangeVal) {
            // The range column may hold a semicolon-delimited list when the
            // slot uses any_of: [{range: A}, {range: B}].  Check each part.
            const rangeNames = rangeVal.split(';').map(s => s.trim()).filter(Boolean);
            for (const rn of rangeNames) {
              const isEnum = sourceSchemaId
                ? this.context.crudFindAllRowsByKeyVals('Enum', { schema_id: sourceSchemaId, name: rn }).length > 0
                : false;
              if (isEnum) addEnumDep(rn);
            }
          }
        }
      }

      // When copying Enum rows directly, auto-include their PermissibleValues.
      if (sourceDh.template_name === 'Enum') {
        const nameCol = sourceDh.slot_name_to_column['name'];
        if (nameCol !== undefined) {
          const enumName = sourceDh.hot.getSourceDataAtCell(physRow, nameCol);
          if (enumName) addEnumPVsDep(enumName);
        }
      }
    }

    return deps;
  }

  /**
   * Find all direct child (subordinate) rows for the selected physRows.
   * Uses relations[srcTab].child to discover which tabs have FK references
   * back to the source tab, then collects those rows grouped by parent key.
   *
   * Returns an array of dep objects in the same shape as _analyzeCopyDependencies
   * so both lists can be rendered and executed identically.
   */
  _analyzeSubordinates(sourceDh, physRows, sourceSchemaId, targetSchema) {
    const srcTabName = sourceDh.template_name;
    const childRelations = this.context.relations[srcTabName]?.child ?? {};
    if (Object.keys(childRelations).length === 0) return [];

    // Canonical display-section names (same as _analyzeCopyDependencies).
    const pvTabName = Object.keys(this.context.relations['Enum']?.child || {})[0] || null;
    const TAB_DISPLAY = {
      Slot:      'Schema field',
      Class:     'Table',
      SlotGroup: 'Table section',
      Enum:      'Picklists',
    };
    if (pvTabName) TAB_DISPLAY[pvTabName] = 'Picklist choices';

    const subordinates = [];
    const seenKeys = new Set();

    for (const [childTabName, fkMapping] of Object.entries(childRelations)) {
      const childDh = this.context.dhs[childTabName];
      if (!childDh) continue;

      // fkMapping: { [parent_slot_name]: child_fk_slot_name }
      // e.g. Class → Slot: { 'name': 'class_id' }

      for (const physRow of physRows) {
        // Resolve the filter that selects child rows belonging to this parent row.
        const childFilter = { schema_id: sourceSchemaId };
        let canSearch = true;

        for (const [parentSlot, childFkSlot] of Object.entries(fkMapping)) {
          const col = sourceDh.slot_name_to_column[parentSlot];
          if (col === undefined) { canSearch = false; break; }
          const val = sourceDh.hot.getSourceDataAtCell(physRow, col);
          if (!val) { canSearch = false; break; }
          childFilter[childFkSlot] = val;
        }
        if (!canSearch) continue;

        const dedupKey = `sub:${childTabName}:${JSON.stringify(childFilter)}`;
        if (seenKeys.has(dedupKey)) continue;
        seenKeys.add(dedupKey);

        const childRows = this.context.crudFindAllRowsByKeyVals(childTabName, childFilter);
        if (childRows.length === 0) continue;

        // Group display name: the non-schema-id FK values joined.
        const groupName = Object.entries(childFilter)
          .filter(([k]) => k !== 'schema_id')
          .map(([, v]) => v)
          .join(' / ');

        const displayName = TAB_DISPLAY[childTabName] ?? childTabName;

        subordinates.push({
          tabName: displayName,
          targetTabName: childTabName,
          name: groupName,
          rowCount: childRows.length,
          _physRows: childRows,
          _childDh: childDh,
          records: childRows.map(pr => {
            const r = this._gatherRowRecord(childDh, pr);
            r.schema_id = targetSchema;
            return r;
          }),
        });
      }
    }

    return subordinates;
  }

  /**
   * For each subordinate returned by _analyzeSubordinates, run
   * _analyzeCopyDependencies on its rows to capture transitive dependencies
   * (e.g. Enums referenced by Slot `range` fields).  Results are deduplicated
   * across all subs and returned as a flat array.
   */
  _computeSubDeps(subs, sourceSchemaId, targetSchema) {
    const subDeps = [];
    const seenKey = new Set();
    for (const sub of subs) {
      if (!sub._childDh || !sub._physRows || sub._physRows.length === 0) continue;
      const childDeps = this._analyzeCopyDependencies(
        sub._childDh, sub._physRows, sourceSchemaId, targetSchema
      );
      for (const d of childDeps) {
        const key = `${d.targetTabName}:${d.name}`;
        if (!seenKey.has(key)) {
          seenKey.add(key);
          subDeps.push(d);
        }
      }
    }
    return subDeps;
  }

  /**
   * Append records (slot_name → value dicts) to a tab by bulk-appending rows
   * to the underlying HOT source data.
   */
  _appendRowsToTab(tabName, records) {
    const dh = this.context.dhs[tabName];
    if (!dh || records.length === 0) return;
    const newRows = records.map(record => {
      const rowArr = new Array(dh.slots.length).fill(null);
      for (const [slotName, value] of Object.entries(record)) {
        if (slotName in dh.slot_name_to_column) {
          rowArr[dh.slot_name_to_column[slotName]] = value;
        }
      }
      return rowArr;
    });
    // getSourceData() can return null/undefined entries for HOT's internal
    // minRows placeholders, or all-null arrays for rows inserted via alter()
    // but never populated.  Filter both out so stale empty rows don't
    // accumulate across repeated loadData calls and then sort to the top.
    // Note: HOT stores rows inserted via alter()+setDataAtCell() as plain
    // objects with numeric string keys (not true Arrays), so we must handle
    // both Array rows and plain-object rows.
    const currentData = dh.hot.getSourceData()
      .filter(row => {
        if (row == null) return false;
        if (Array.isArray(row)) {
          return row.some(cell => cell != null && cell !== '');
        }
        // Plain-object row (alter+setDataAtCell): accept if any value is set.
        return Object.values(row).some(cell => cell != null && cell !== '');
      })
      .map(row => {
        if (Array.isArray(row)) return [...row];
        // Convert plain-object row (numeric string keys) to a dense array.
        const arr = new Array(dh.slots.length).fill(null);
        for (const [k, v] of Object.entries(row)) {
          const idx = +k;
          if (!isNaN(idx) && idx < arr.length) arr[idx] = v;
        }
        return arr;
      });
    // HOT 15: loadData() calls initIndexMappers() which resets the row index
    // mapper to identity order, but the multiColumnSorting plugin's afterLoadData
    // hook only re-sorts on the initial load (initialLoad === true).  Every
    // subsequent loadData leaves rows in insertion order with no sort applied,
    // even though the sort-arrow header indicators remain.  Save the active sort
    // config and re-apply it after loadData so the display stays correctly sorted.
    const sortPlugin = dh.hot.getPlugin('multiColumnSorting');
    const prevSortConfig = sortPlugin?.getSortConfig?.() ?? [];
    dh.hot.loadData([...currentData, ...newRows]);
    if (prevSortConfig.length > 0) {
      sortPlugin.sort(prevSortConfig);
    }
  }

  /**
   * Execute the copy confirmed by the user: write dependency rows first,
   * then the selected rows, all targeting the chosen schema.
   */
  executeCopyToSchema() {
    const state = this._copyState;
    if (!state) return;
    const { sourceDh, physRows, sourceSchemaId } = state;
    const targetSchema = $('#copy-to-schema-select').val();
    if (!targetSchema) return;
    // Read the table-copy mode and target class.
    // "assign"  → override class_id with the chosen target class.
    // "preserve" → keep original class_id; _analyzeCopyDependencies will copy
    //              the class record to the target schema if it is missing there.
    const copyClassMode = state.hasClassId
      ? ($('input[name="copy-class-mode"]:checked').val() || 'assign') : null;
    const targetClass = (copyClassMode === 'assign')
      ? ($('#copy-to-class-select').val() || null) : null;

    const pvTabName = Object.keys(this.context.relations['Enum']?.child || {})[0] || null;
    const PICKLIST_TABS = new Set(['Picklists', 'Picklist choices']);
    const PICKLIST_TARGET_TABS = new Set(['Enum', pvTabName].filter(Boolean));
    const sourceIsEnum = sourceDh.template_name === 'Enum';
    const isPicklistDep = d => PICKLIST_TABS.has(d.tabName);
    const isPicklistSub = s => PICKLIST_TARGET_TABS.has(s.targetTabName);

    const allDeps = this._analyzeCopyDependencies(sourceDh, physRows, sourceSchemaId, targetSchema, { targetClassId: targetClass });
    const parentDepsFromSelected = allDeps.filter(d => !isPicklistDep(d));
    const picklistDepsFromSelected = sourceIsEnum ? [] : allDeps.filter(d => isPicklistDep(d));

    const allSubs = this._analyzeSubordinates(sourceDh, physRows, sourceSchemaId, targetSchema);
    const tableSubs = sourceIsEnum ? allSubs : allSubs.filter(s => !isPicklistSub(s));
    const picklistSubsFromSubs = sourceIsEnum ? [] : allSubs.filter(s => isPicklistSub(s));

    const allSubDeps = this._computeSubDeps(tableSubs, sourceSchemaId, targetSchema);

    const selectedNamesInSource = new Set();
    const srcNameCol = sourceDh.slot_name_to_column['name'];
    if (srcNameCol !== undefined) {
      for (const pr of physRows) {
        const n = sourceDh.hot.getSourceDataAtCell(pr, srcNameCol);
        if (n) selectedNamesInSource.add(n);
      }
    }
    const filteredSubDeps = allSubDeps.filter(d =>
      !(d.targetTabName === sourceDh.template_name && selectedNamesInSource.has(d.name))
    );
    const parentSubDeps = filteredSubDeps.filter(d => !isPicklistDep(d));
    const picklistSubDeps = filteredSubDeps.filter(d => isPicklistDep(d));

    const dedup = (list) => {
      const seen = new Set();
      return list.filter(d => {
        const key = `${d.targetTabName}:${d.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    const allParentDeps = dedup([...parentDepsFromSelected, ...parentSubDeps]);
    const allPicklistDeps = dedup([...picklistDepsFromSelected, ...picklistSubDeps, ...picklistSubsFromSubs]);
    const parentDepKeys = new Set(allParentDeps.map(d => `${d.targetTabName}:${d.name}`));
    const allTableSubs = tableSubs.filter(s => !parentDepKeys.has(`${s.targetTabName}:${s.name}`));

    const includeTableRecords = $('#copy-include-table-records').is(':checked');
    const includePicklists = $('#copy-include-picklists').is(':checked');

    // Gather the selected records HERE — before any _appendRowsToTab call —
    // because each _appendRowsToTab call filters out empty HOT minRows phantom
    // rows and then calls loadData(), which physically re-indexes all rows.
    // If any empty rows existed at physical positions before the selected rows
    // (e.g. HOT's initial minRows=5 phantoms that precede CanCOGeN data loaded
    // via addRowRecord/updateSettings), the physical indices in physRows become
    // stale after the first loadData and _gatherRowRecord would read the wrong
    // row, copying a different CanCOGeN field with schema_id overridden to the
    // target schema.  Reading physRows before any loadData guarantees correct data.
    const tabName = sourceDh.template_name;
    const classIdColIdx = sourceDh.slot_name_to_column['class_id'];
    const selectedRecords = physRows.map(pr => {
      const rec = this._gatherRowRecord(sourceDh, pr);
      rec.schema_id = targetSchema;
      // Override class_id when the user selected a target table and the source
      // row actually has a class_id (slot_usage, attribute, SlotGroup, etc.).
      if (targetClass && classIdColIdx !== undefined) {
        const srcClassId = sourceDh.hot.getSourceDataAtCell(pr, classIdColIdx);
        if (srcClassId) rec.class_id = targetClass;
      }
      return rec;
    });

    // Write order: parent deps → picklists → selected rows → table subs.
    for (const dep of allParentDeps) { this._appendRowsToTab(dep.targetTabName, dep.records); }
    if (includePicklists) {
      for (const dep of allPicklistDeps) {
        // Skip the entire enum (and its PVs) if the enum checkbox is unchecked.
        const enumChecked = $('#copy-picklists-list .enum-copy-checkbox')
          .filter(function () { return $(this).data('enum') === dep.name; })
          .is(':checked');
        if (!enumChecked) continue;

        if (dep.tabName === 'Picklist choices') {
          // Only copy permissible values whose per-row checkboxes are checked.
          const checkedRecords = dep.records.filter(record => {
            const pvText = record.text ?? '';
            return $('#copy-picklists-list .pv-copy-checkbox').filter(function () {
              return $(this).data('enum') === dep.name && $(this).data('pv') === pvText;
            }).is(':checked');
          });
          if (checkedRecords.length > 0) {
            this._appendRowsToTab(dep.targetTabName, checkedRecords);
          }
        } else {
          this._appendRowsToTab(dep.targetTabName, dep.records);
        }
      }
    }

    this._appendRowsToTab(tabName, selectedRecords);

    if (includeTableRecords) {
      for (const sub of allTableSubs) { this._appendRowsToTab(sub.targetTabName, sub.records); }
    }

    this.refreshMenus();
    $('#copy-to-schema-modal').modal('hide');
    this._copyState = null;

    const totalCopied = physRows.length
      + allParentDeps.reduce((sum, d) => sum + d.rowCount, 0)
      + (includePicklists ? allPicklistDeps.reduce((sum, d) => sum + d.rowCount, 0) : 0)
      + (includeTableRecords ? allTableSubs.reduce((sum, s) => sum + s.rowCount, 0) : 0);
    dhAlert(`${totalCopied} row(s) copied to schema "${targetSchema}".`);
  }

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