import $ from 'jquery';
import Handsontable from 'handsontable';
import i18next from 'i18next';
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
	SCHEMAMENUS = ['SchemaMenu','SchemaClassMenu','SchemaSlotMenu','SchemaSlotGroupMenu','SchemaEnumMenu','UniqueKeySlotMenu'];

	// Maps each DH tab to the menu it populates (null if none) and the ordered
	// list of dependent tabs whose menus must also be refreshed when this tab's
	// data changes.  Dependents are listed in topological order (parents before
	// children) so that a misconfiguration cannot create an infinite loop.
	// Not every tab has an associated menu.
	TAB_MENU_MAP = {
	  Schema:    { menu: 'SchemaMenu',          dependents: ['Class', 'Slot', 'Enum', 'EnumValue', 'UniqueKey', 'Prefix'] },
	  Class:     { menu: 'SchemaClassMenu',     dependents: ['Slot', 'UniqueKey'] },
	  Slot:      { menu: 'SchemaSlotMenu',          dependents: ['UniqueKey'] },
	  Enum:      { menu: 'SchemaEnumMenu',          dependents: ['EnumValue'] },
	  UniqueKey: { menu: 'UniqueKeySlotMenu',       dependents: [] },
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
		// "Record(s) by selected schema" is a SchemaEditor-only Display option —
		// reveal it now that SchemaEditor is active (hidden by default in plain DH).
		$('#display-records-by-schema-radio').closest('label').show();
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
		        // Build list of slot_groups from Slot tab source data.
		        // (The SlotGroup tab no longer exists; slot_group values live on Slot rows.)
		        const slotDh = this.context.dhs['Slot'];
		        if (slotDh) {
		          const show_all = ($('input[name="display-main-type"]:checked').val() ?? '') === 'all';
		          const schemaId = show_all ? null : user_schema_name;
		          for (let r = 0; r < slotDh.hot.countSourceRows(); r++) {
		            if (schemaId && slotDh.hot.getSourceDataAtCell(r, slotDh.schema_name_column) !== schemaId) continue;
		            const sgName = slotDh.hot.getSourceDataAtCell(r, slotDh.slot_group_column);
		            if (sgName && !(sgName in permissible_values)) {
		              permissible_values[sgName] = { text: sgName, title: sgName };
		            }
		          }
		        }
		        break;
		      }

		      case 'UniqueKeySlotMenu': {
		        // Build entries for every slot_usage and attribute in the Slot tab,
		        // grouped by class in the order classes appear in the Class tab.
		        // Each entry stores the slot name as the value (text) and the slot
		        // title as the display label (title); class_id is stored in
		        // description for per-row filtering in the afterBeginEditing hook.
		        // Class titles are cached in this._ukClassTitles for optgroup labels.
		        const slotDh  = this.context.dhs['Slot'];
		        const classDh = this.context.dhs['Class'];
		        if (slotDh && classDh) {
		          const show_all = ($('input[name="display-main-type"]:checked').val() ?? '') === 'all';

		          // Pass 1 — collect slot info from the Slot tab
		          const slotInfoMap = new Map(); // "classId::slotName" → {name, title, classId, rank, slot_group}
		          for (let row = 0; row < slotDh.hot.countSourceRows(); row++) {
		            const rowSchema = slotDh.hot.getSourceDataAtCell(row, slotDh.schema_name_column);
		            if (!show_all && rowSchema !== user_schema_name) continue;
		            const rowType  = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_type_column);
		            if (rowType !== 'slot_usage' && rowType !== 'attribute') continue;
		            const rowClass = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_class_id_column);
		            const rowName  = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_name_column);
		            const rowTitle = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_title_column);
		            if (!rowClass || !rowName) continue;
		            const key = `${rowClass}::${rowName}`;
		            if (!slotInfoMap.has(key)) {
		              const rowRank  = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_rank_column);
		              const rowGroup = slotDh.hot.getSourceDataAtCell(row, slotDh.slot_group_column);
		              slotInfoMap.set(key, {
		                name:       rowName,
		                title:      rowTitle || rowName,
		                classId:    rowClass,
		                rank:       (rowRank !== null && rowRank !== '') ? parseInt(rowRank) : null,
		                slot_group: rowGroup || '',
		              });
		            }
		          }

		          // Pass 2 — iterate Class tab in source order so optgroups match Class-tab ordering
		          this._ukClassTitles = new Map();
		          const classNameCol   = classDh.slot_name_column;
		          const classTitleCol  = classDh.slot_name_to_column['title'];
		          const classSchemaCol = classDh.schema_name_column;
		          for (let row = 0; row < classDh.hot.countSourceRows(); row++) {
		            const classSchema = classDh.hot.getSourceDataAtCell(row, classSchemaCol);
		            if (!show_all && classSchema !== user_schema_name) continue;
		            const classId    = classDh.hot.getSourceDataAtCell(row, classNameCol);
		            if (!classId) continue;
		            const classTitle = classDh.hot.getSourceDataAtCell(row, classTitleCol) || classId;
		            this._ukClassTitles.set(classId, classTitle);
		            for (const [, info] of slotInfoMap) {
		              if (info.classId !== classId) continue;
		              const pvKey = `${classId}::${info.name}`;
		              if (!(pvKey in permissible_values)) {
		                permissible_values[pvKey] = {
		                  text:        info.name,       // stored value = slot.name
		                  title:       info.title,      // display label = slot.title
		                  description: classId,         // class membership for filtering
		                  slot_group:  info.slot_group, // section label for optgroup header
		                  rank:        info.rank,       // display order within the section
		                };
		              }
		            }
		          }
		        }
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
		// getSelected() returns undefined when deselectCell() has been called,
		// avoiding stale current_selection reads after programmatic deselection.
		if (!dh.hot.getSelected()?.length) return null;
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
							// refreshMenusForTab updates the dropdown sources in dependent tabs
							// (Class, Slot, SlotGroup, Enum …) when the user switches Schema rows.
							// It calls updateColumnSettings only on those dependent DHs, never on
							// the Schema DH itself, so the Schema tab's scroll position is unaffected.
							this.refreshMenusForTab('Schema');
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

							for (const depTabName of ['Slot', 'UniqueKey']) {
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

				// ── Cross-schema paste guard ────────────────────────────────────────
				// Pasting rows copied from a different schema's Class (Table) tab
				// crashes HOT when the grid is empty (viewport calculator not
				// initialised → startRow undefined) and would inject foreign class
				// definitions.  Block it and direct the user to right-click
				// "Copy to schema…" instead.
				if (classSchemaIdCol !== undefined) {
					dh.hot.addHook('beforePaste', (data) => {
						if (!dh.hot.rootElement?.closest('.tab-pane.show')) return; // inactive tab
						if (dh.hot.getActiveEditor()?.isOpened()) return;
						const pastedSchema = data[0]?.[classSchemaIdCol];
						if (!pastedSchema) return; // not DH table data — allow
						const userSchema = this.getSchemaEditorSelectedSchema();
						if (!userSchema || pastedSchema === userSchema) return; // same schema — allow
						dhAlert(
							`The copied table belongs to schema "<b>${pastedSchema}</b>", ` +
							`not the current schema "<b>${userSchema}</b>".<br><br>` +
							`To copy tables between schemas, right-click a row and choose ` +
							`<b>Copy to schema\u2026</b>`,
							{ title: 'Cross-schema paste not allowed', html: true }
						);
						return false;
					});
				}
				break;
			}
			case 'Slot':
				this.initSlotTab(dh, hot_settings);
				this.hotSettingsMenuHooks(dh, hot_settings, 'Slot', ['name', 'description', 'slot_group']);
				break;
			case 'Enum':
				this.hotSettingsMenuHooks(dh, hot_settings, 'Enum', ['name', 'description']);
				break;
			case 'UniqueKey':
				this.initUniqueKeyTab(dh, hot_settings);
				// Note: hotSettingsMenuHooks is intentionally NOT registered for UniqueKey.
				// UniqueKeySlotMenu is rebuilt by the Schema tab's afterSelection hook whenever
				// the user switches schema rows — registering it here too caused spurious
				// rebuilds during loadData (changeRowVisibility) with a stale schema context,
				// which emptied the slot list.  The afterBeginEditing hook in initUniqueKeyTab
				// queries the Slot tab directly so it is immune to menu-rebuild timing.
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
	  if (!hrPlugin || !hrPlugin.enabled) return;
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
	    // For the Slot tab, use the custom field-removal dialog (which names the
	    // fields and handles schema-slot cascade warnings).  Other tabs fall back
	    // to the standard row-removal path (which shows a cascade confirm when
	    // dependent records exist).
	    if (dh._slotFieldRemover) {
	      dh._slotFieldRemover();
	    } else {
	      dh.removeSelectedRows();
	    }
	    return false;
	  });
	}

	//initSchemaTab (dh, hot_settings) {}

	/**
	 * Configure the UniqueKey tab so that the `unique_key_slots` multi-select
	 * picklist shows only the slots that belong to the row's class, grouped
	 * under an optgroup header labelled with the class title.
	 *
	 * DH's enableMultiSelection hook (registered earlier in afterBeginEditing)
	 * initialises Selectize with the flat global UniqueKeySlotMenu source.
	 * Our hook fires immediately after and replaces the option set with the
	 * per-row class-specific subset and a proper Selectize optgroup.
	 *
	 * Note: 'beforeStartEditingCell' is not a valid HOT hook; 'beforeStartEditing'
	 * is, but calling updateColumnSettings() from within it risks aborting the
	 * editing sequence via hot.updateSettings().  Hooking afterBeginEditing and
	 * directly repopulating the already-live Selectize instance is the only
	 * reliable approach.
	 */
	initUniqueKeyTab(dh, hot_settings) {
	  const ukSlotCol   = dh.slot_name_to_column['unique_key_slots'];
	  const classIdCol  = dh.slot_name_to_column['class_id'];
	  const schemaIdCol = dh.slot_name_to_column['schema_id'];
	  if (ukSlotCol === undefined) return;

	  // NOTE: this hook is registered here (inside initTab), which is called BEFORE
	  // enableMultiSelection() registers DH's own afterBeginEditing hook.  Our hook
	  // therefore fires FIRST — before Selectize exists — so all Selectize work is
	  // deferred via setTimeout(0) to run after DH's hook has initialised it.
	  dh.hot.addHook('afterBeginEditing', (row, col) => {
	    if (col !== ukSlotCol) return;

	    // Capture all necessary data synchronously (DH's hook will call finishEditing
	    // shortly after, which cancels the HOT editor and may affect data access).
	    const classId  = dh.hot.getDataAtCell(row, classIdCol);
	    const schemaId = dh.hot.getDataAtCell(row, schemaIdCol);
	    if (!classId || !schemaId) return;

	    // Build the slot list directly from Slot tab source data so the result is
	    // always fresh regardless of when (or whether) refreshMenus last ran for
	    // UniqueKeySlotMenu.  This avoids timing races where the menu was rebuilt
	    // with the wrong schema context (e.g. after switching away from a schema
	    // row and back) and makes the filtering transparent: slots are included
	    // exactly when their schema_id and class_id match the current row.
	    const slotDh    = this.context.dhs['Slot'];
	    const slotItems = [];
	    if (slotDh) {
	      const slotHot = slotDh.hot;
	      for (let sRow = 0; sRow < slotHot.countSourceRows(); sRow++) {
	        if (slotHot.getSourceDataAtCell(sRow, slotDh.schema_name_column) !== schemaId) continue;
	        const rowType = slotHot.getSourceDataAtCell(sRow, slotDh.slot_type_column);
	        if (rowType !== 'slot_usage' && rowType !== 'attribute') continue;
	        if (slotHot.getSourceDataAtCell(sRow, slotDh.slot_class_id_column) !== classId) continue;
	        const rowName  = slotHot.getSourceDataAtCell(sRow, slotDh.slot_name_column);
	        if (!rowName) continue;
	        const rowTitle = slotHot.getSourceDataAtCell(sRow, slotDh.slot_title_column);
	        const rowRank  = slotHot.getSourceDataAtCell(sRow, slotDh.slot_rank_column);
	        const rowGroup = slotHot.getSourceDataAtCell(sRow, slotDh.slot_group_column);
	        slotItems.push({
	          depth: 0,
	          label:    rowTitle || rowName,
	          value:    rowName,
	          _id:      rowName,
	          optgroup: rowGroup || '',
	          rank:     (rowRank !== null && rowRank !== '') ? (parseInt(rowRank) || Infinity) : Infinity,
	        });
	      }
	    }
	    slotItems.sort((a, b) => (a.rank - b.rank) || a.label.localeCompare(b.label));
	    if (slotItems.length === 0) return;

	    // Defer Selectize manipulation until after DH's afterBeginEditing hook has
	    // run and initialised the Selectize instance on #multiselect-text .multiselect.
	    setTimeout(() => {
	      // Update the popup label to the DH_TERMS-translated column title so it
	      // matches the column header (e.g. "Unique key fields" in default mode).
	      const labelSpan = document.querySelector('#multiselect-text > span');
	      if (labelSpan) labelSpan.textContent = this.context.applyDhTerms('{{Unique key slots}}');

	      const selectize = $('#multiselect-text .multiselect')[0]?.selectize;
	      if (!selectize) return;

	      // Save currently-selected items (DH pre-populates from the cell value).
	      const currentItems = [...(selectize.items || [])];

	      // Ensure the optgroup_header renderer is set; DH only sets it when it
	      // initialises Selectize with optgroups, so we add it post-hoc here.
	      if (!selectize.settings.render) selectize.settings.render = {};
	      selectize.settings.render.optgroup_header = (data, escape) =>
	        `<div class="dh-selectize-group-header">${escape(data.label)}</div>`;
	      selectize.renderCache = {};  // flush so the new renderer takes effect

	      selectize.clear(true);    // remove selected chips, silently
	      selectize.clearOptions(); // wipe option dict + dropdown DOM

	      // Register one optgroup per named slot_group, in the order of first
	      // appearance after rank-sorting.  Slots with no slot_group (optgroup='')
	      // are rendered without a header and need no registered optgroup.
	      const groupsSeen = new Set();
	      for (const item of slotItems) {
	        if (item.optgroup && !groupsSeen.has(item.optgroup)) {
	          groupsSeen.add(item.optgroup);
	          selectize.addOptionGroup(item.optgroup, { label: item.optgroup });
	        }
	      }
	      for (const item of slotItems) {
	        selectize.addOption(item);
	      }

	      // Restore previously-selected values that still exist in the filtered set.
	      const valid = currentItems.filter(v => v in selectize.options);
	      if (valid.length > 0) selectize.setValue(valid, true);
	      selectize.refreshOptions(false);
	    }, 0);
	  });

	  // Override addRows: show a class picker instead of the generic
	  // empty-parent-key-modal when no class has been pre-selected as the FK.
	  const originalAddRows = dh.addRows.bind(dh);
	  dh.addRows = (row_where, numRows, startRowIndex = false) => {
	    const parents    = this.context.crudGetParents?.(dh.template_name) ?? {};
	    const hasParents = Object.keys(parents).length > 0;
	    if (!hasParents) { originalAddRows(row_where, numRows, startRowIndex); return; }
	    const [, errors] = this.context.crudGetForeignKeyValues(parents);
	    if (!errors)    { originalAddRows(row_where, numRows, startRowIndex); return; }
	    // Parents not satisfied — show class picker dialog instead of generic modal.
	    this._addUniqueKeyRowDialog(dh, row_where, numRows);
	  };
	}

	/**
	 * Shows a class-picker dialog when the user presses "Add rows" on the UniqueKey
	 * tab but no class has been selected as the parent FK yet.  On confirmation,
	 * adds the requested number of rows pre-filled with the selected schema_id and
	 * class_id.
	 */
	async _addUniqueKeyRowDialog(dh, row_where, numRows) {
	  numRows = parseInt(numRows); // Footer passes a string from the input field.
	  // Determine the active schema_id from the Schema tab selection.
	  const schemaId = this.getSchemaEditorSelectedSchema();
	  if (!schemaId) {
	    await dhAlert(
	      'Select a schema on the Schema tab first before adding a unique key.',
	      { title: 'No Schema Selected' }
	    );
	    return;
	  }

	  // Build class list from the Class tab, filtered to the active schema.
	  const classDh = this.context.dhs['Class'];
	  const classes = [];
	  if (classDh) {
	    const nameCol   = classDh.slot_name_to_column['name'];
	    const schemaCol = classDh.slot_name_to_column['schema_id'];
	    const titleCol  = classDh.slot_name_to_column['title'];
	    for (let row = 0; row < classDh.hot.countSourceRows(); row++) {
	      if (classDh.hot.getSourceDataAtCell(row, schemaCol) !== schemaId) continue;
	      const name = classDh.hot.getSourceDataAtCell(row, nameCol);
	      if (!name) continue;
	      const title = (titleCol !== undefined)
	        ? classDh.hot.getSourceDataAtCell(row, titleCol)
	        : null;
	      classes.push({ name, label: title || name });
	    }
	  }

	  if (classes.length === 0) {
	    await dhAlert(
	      `No classes found for schema "${schemaId}". Add classes on the Class tab first.`,
	      { title: 'No Classes' }
	    );
	    return;
	  }

	  // Build a <select> dropdown of available classes.
	  const selectId = 'uk-add-row-class-picker';
	  const options  = classes
	    .map(c => `<option value="${c.name}">${c.label}</option>`)
	    .join('');
	  const html = [
	    `<label for="${selectId}"><strong>Select a table (class) for the new unique key:</strong></label>`,
	    `<select id="${selectId}" class="form-control mt-2">${options}</select>`,
	  ].join('\n');

	  const ok = await dhConfirm(html, {
	    title:   'Add Unique Key Row',
	    html:    true,
	    okLabel: 'Add Row',
	  });
	  if (!ok) return;

	  const selectedClass = document.getElementById(selectId)?.value;
	  if (!selectedClass) return;

	  const hot         = dh.hot;
	  const schemaIdCol = dh.slot_name_to_column['schema_id'];
	  const classIdCol  = dh.slot_name_to_column['class_id'];
	  const startRow    = hot.countRows();

	  // Register the same ifabsent-defaults hook that addRows() normally registers.
	  const applyIfAbsentDefaults = (index, amount) => {
	    hot.removeHook('afterCreateRow', applyIfAbsentDefaults);
	    if (!dh.slots?.length) return;
	    const changes = [];
	    for (let row = index; row < index + amount; row++) {
	      for (let col = 0; col < dh.slots.length; col++) {
	        const val = dh._evaluateIfAbsent(dh.slots[col]?.ifabsent);
	        if (val !== null) changes.push([row, col, val]);
	      }
	    }
	    if (changes.length) hot.setDataAtCell(changes, 'add_row');
	  };
	  hot.addHook('afterCreateRow', applyIfAbsentDefaults);

	  hot.alter(row_where, startRow, numRows);
	  hot.selectCell(startRow, 0);
	  hot.scrollViewportTo({ row: startRow });

	  // Pre-fill schema_id and class_id on all newly created rows.
	  hot.batchRender(() => {
	    for (let row = startRow; row < startRow + numRows; row++) {
	      if (schemaIdCol !== undefined)
	        hot.setDataAtCell(row, schemaIdCol, schemaId, 'add_row');
	      if (classIdCol  !== undefined)
	        hot.setDataAtCell(row, classIdCol,  selectedClass, 'add_row');
	    }
	  });

	  if (dh._conciseViewActive) this.context.toolbar?._applyConciseView(dh);
	}

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

	/**
	 * Flag slot_usage cells whose non-empty value differs from the corresponding
	 * base-slot value.  An empty slot_usage cell is inheriting (correct); a
	 * non-empty slot_usage value that does not equal the base-slot value signals
	 * data inconsistency — e.g. the base slot was edited but propagation was
	 * declined, or the cell was hand-edited directly.
	 *
	 * boolean `false` is treated as empty (same as null) because HOT may store
	 * unchecked checkboxes as either false or null depending on the code path.
	 *
	 * Skipped columns: primary key (name), foreign keys (schema_id, class_id),
	 * slot_type, rank, and slot_group (class-specific ordering).
	 *
	 * @param {Object} dh     DataHarmonizer instance for the Slot tab.
	 * @param {Array}  data   Visual-row data from hot.getData().
	 * @param {Object} errors Existing error map {vRowStr: {colStr: msg}}.
	 * @returns {Object} Augmented error map.
	 */
	validateSlotUsageMismatch(dh, data, errors) {
	  if (!dh.slotDefinitionIndex || dh.slotDefinitionIndex.size === 0) return errors;

	  const hot = dh.hot;
	  // Treat false identically to null/empty: both mean "unchecked / not set"
	  // for boolean columns, so false vs null must not trigger a mismatch.
	  const _empty = (v) => v === null || v === undefined || v === '' || v === false;

	  const SKIP_COLS = new Set([
	    dh.schema_name_column,
	    dh.slot_class_id_column,
	    dh.slot_type_column,
	    dh.slot_name_column,
	    dh.slot_name_to_column?.['rank'],
	    dh.slot_group_column,
	  ]);

	  const result = { ...errors };

	  for (let vRow = 0; vRow < data.length; vRow++) {
	    const row = data[vRow];
	    if (!row) continue;
	    if (row[dh.slot_type_column] !== 'slot_usage') continue;

	    const slotName   = row[dh.slot_name_column];
	    const schemaId   = row[dh.schema_name_column];
	    const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${slotName}`);
	    if (defPhysRow === undefined) continue; // no base slot — skip

	    const numCols = hot.countCols();
	    for (let col = 0; col < numCols; col++) {
	      if (SKIP_COLS.has(col)) continue;

	      const usageVal = row[col];
	      if (_empty(usageVal)) continue; // empty — inheriting, not an error

	      const baseVal = hot.getSourceDataAtCell(defPhysRow, col);

	      // Normalise to string to handle mixed boolean/string storage across code paths.
	      const usageStr = String(usageVal);
	      const baseStr  = _empty(baseVal) ? '' : String(baseVal);
	      if (usageStr === baseStr) continue; // same value — OK

	      const vRowStr = String(vRow);
	      const colStr  = String(col);
	      if (!result[vRowStr]) result[vRowStr] = {};
	      if (!result[vRowStr][colStr]) { // don't overwrite a more-specific existing error
	        result[vRowStr][colStr] = "Value doesn't match schema field value";
	      }
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
	  // Shared by the context menu right-click and the Cmd-X / Ctrl-X shortcut.
	  const removeSelectedFieldsWithConfirmation = async () => {
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
	      slot:       dh.context.applyDhTerms('{{schema slot}}'),
	      slot_usage: dh.context.applyDhTerms('{{class slot}}'),
	      attribute:  dh.context.applyDhTerms('{{class attribute}}'),
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
	      const reusedIn    = [];
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
	          <tr><th>${dh.context.applyDhTerms('{{Slot}}')}</th><th>Type</th><th>Used in table</th></tr>
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
	          `<p class="text-danger mb-1"><strong>Warning:</strong> Deleting ${dh.context.applyDhTerms('{{schema slot}}')} ` +
	          `<strong>${label}</strong> will also delete its reuse ${reusedIn.length === 1 ? 'entry' : 'entries'} in: ` +
	          `<strong>${reusedIn.join(', ')}</strong>.</p>`;
	      } else {
	        warningHtml +=
	          `<p class="mb-1">${dh.context.applyDhTerms('{{Schema slot}}')} <strong>${label}</strong> ` +
	          `is not reused by any table &mdash; only the library entry will be deleted.</p>`;
	      }
	    }

	    const expertNote = (hasSchemaFields && !isExpert)
	      ? `<p class="text-warning mt-2"><strong>Expert User mode is required</strong> ` +
	        `to delete ${dh.context.applyDhTerms('{{Schema slot}}s')}. Enable it via the File menu &rarr; ` +
	        `&ldquo;Toggle expert user mode&rdquo;.</p>`
	      : '';

	    const bodyHtml =
	      `<p class="mb-2">The following ${dh.context.applyDhTerms('{{slot}}')}${fields.length > 1 ? 's' : ''} will be removed:</p>` +
	      tableHtml + warningHtml + expertNote;

	    // ── 5. Show confirmation dialog ───────────────────────────────────────
	    const choice = await dhChoose(
	      bodyHtml,
	      ['Delete'],
	      {
	        title:           dh.context.applyDhTerms('Remove {{slot}}(s)'),
	        html:            true,
	        cancelLabel:     'Cancel',
	        disabledIndices: okDisabled ? [0] : [],
	      }
	    );
	    if (choice !== 0) return;

	    // ── 6. Delete selected rows + cascade slot_usage rows for schema fields ─
	    // Capture the visual row just above the selection before deletion so we can
	    // re-select it afterwards as a perceptual cue of where the deletion occurred.
	    const anchorVisualRow = Math.max(0, visualRows[0] - 1);

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
	    setTimeout(() => {
	      dh.context.refreshTabDisplay();
	      const rowCount = hot.countRows();
	      if (rowCount > 0) {
	        const targetRow = Math.min(anchorVisualRow, rowCount - 1);
	        hot.selectCell(targetRow, 0, targetRow, hot.countCols() - 1, false);
	      }
	    }, 0);
	  };

	  // Store the Slot-tab remover so hotSettingsMenuHooks can use it for Delete/Backspace.
	  dh._slotFieldRemover = removeSelectedFieldsWithConfirmation;

	  // Cmd-X / Ctrl-X: show the same delete-with-confirmation dialog instead of
	  // the native clipboard cut.
	  //
	  // Two-layer approach:
	  //   1. beforeKeyDown — calls event.preventDefault() on the DOM keydown event,
	  //      which tells the browser not to initiate a clipboard cut and therefore
	  //      suppresses the subsequent 'cut' clipboard event that HOT's CopyPaste
	  //      plugin listens to.  The confirmation dialog is launched here.
	  //   2. beforeCut — safety-net for any cut that still reaches the CopyPaste
	  //      plugin (e.g. browser Edit → Cut menu), so we can cancel it.  The
	  //      _cmdXInProgress flag prevents a double-dialog if the 'cut' event fires
	  //      despite step 1 (which can happen on some browser versions).
	  let _cmdXInProgress = false;
	  dh.hot.addHook('beforeKeyDown', (e) => {
	    if ((e.key !== 'x' && e.key !== 'X') || (!e.metaKey && !e.ctrlKey)) return;
	    if (dh.hot.getActiveEditor()?.isOpened()) return; // typing — let through
	    e.preventDefault();                       // suppress the native cut / 'cut' event
	    e.isImmediatePropagationEnabled = false;  // stop HOT's internal propagation
	    e.cancelBubble = true;
	    _cmdXInProgress = true;
	    removeSelectedFieldsWithConfirmation().finally(() => { _cmdXInProgress = false; });
	    return false;
	  });
	  dh.hot.addHook('beforeCut', () => {
	    if (dh.hot.getActiveEditor()?.isOpened()) return; // typing — let through
	    if (!_cmdXInProgress) removeSelectedFieldsWithConfirmation();
	    return false; // cancel the cut regardless (no clipboard write, no cell clearing)
	  });

	  // ── Cross-schema paste guard ────────────────────────────────────────────
	  // HOT's copyPasteEnabled:true (set on the hiddenColumns plugin) includes
	  // schema_id (physical col 0) in the clipboard even when it is visually
	  // hidden by concise view.  If the user copies rows from one schema's Field
	  // tab and pastes them into a different schema's Field tab, cancel the paste
	  // and direct them to use the right-click "Copy to schema…" dialog instead.
	  dh.hot.addHook('beforePaste', (data) => {
	    // HOT registers paste listeners at the document level, so every HOT instance
	    // on the page receives every paste event.  Only act when this tab is visible.
	    if (!dh.hot.rootElement?.closest('.tab-pane.show')) return;
	    if (dh.hot.getActiveEditor()?.isOpened()) return; // cell editor open — allow
	    // data[row][col] follows physical column order; schema_id is always col 0.
	    const pastedSchema = data[0]?.[dh.schema_name_column];
	    if (!pastedSchema) return; // clipboard did not come from DH — allow paste
	    const userSchema = this.getSchemaEditorSelectedSchema();
	    if (!userSchema || pastedSchema === userSchema) return; // same schema — allow
	    dhAlert(
	      `The copied fields belong to schema "<b>${pastedSchema}</b>", ` +
	      `not the current schema "<b>${userSchema}</b>".<br><br>` +
	      `To copy fields between schemas, right-click a row and choose ` +
	      `<b>Copy to schema\u2026</b>`,
	      { title: 'Cross-schema paste not allowed', html: true }
	    );
	    return false; // cancel the paste
	  });

	  hot_settings.contextMenu.items['remove_row'] = {
	    name() { return i18next.t('context-menu-remove-rows'); },
	    async callback() { await removeSelectedFieldsWithConfirmation(); },
	  };
	  // Could be turning off/on based on expert user
	  hot_settings.hiddenColumns = {
	    // set columns that are hidden by default
	    columns: slot_table_attribute_column,
	    indicators: false
	  }

	  //hot_settings.fixedColumnsLeft = 4; // Freeze both schema and slot name.

	  // Override getInvalidCells so that empty inherited cells in slot_usage rows
	  // are not reported as validation errors.  The standard validator sees them
	  // as required-but-empty, but they are intentionally blank (values are
	  // supplied by downstream LinkML inheritance from the parent slot definition).
	  const originalGetInvalidCells = dh.getInvalidCells.bind(dh);
	  dh.getInvalidCells = (data) => {
	    const errors = originalGetInvalidCells(data);
	    const filtered = this.filterInheritedSlotUsageErrors(dh, data, errors);
	    const withAbsent = this.validateIfAbsentEnumRefs(dh, data, filtered);
	    return this.validateSlotUsageMismatch(dh, data, withAbsent);
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

	    if (col === dh.slot_name_column) cellProp.className += ' field-id-bold';

	    return cellProp;
	  }
    
  // Keep HOT's empty minRows placeholder rows at the bottom of the sorted
  // display. The DataHarmonizer default is sortEmptyCells: true, which causes
  // empty rows to sort to the top when the primary sort key (schema_id) is
  // ascending — they appear above real data rows. Setting false pushes them
  // to the end regardless of sort direction, which is the expected UX.
  hot_settings.multiColumnSorting.sortEmptyCells = false;

  // Custom per-column sort comparator: order class_id by the Class tab's
  // current visual row order instead of alphabetically, so the Field tab
  // groups match the order the user sees on the Table tab.  All other
  // columns fall back to a standard string/number comparator with empty
  // values pushed to the end (matching sortEmptyCells: false behaviour).
  hot_settings.multiColumnSorting.compareFunctionFactory = (sortOrder, columnMeta) => {
    if (columnMeta.col === dh.slot_class_id_column) {
      // Build class-name → Table-tab visual-position map at sort time so it
      // always reflects the current Class tab state (including FK filtering).
      const classDh = this.context.dhs['Class'];
      const classOrder = new Map();
      if (classDh) {
        const nameCol = classDh.slot_name_to_column['name'];
        for (let vr = 0; vr < classDh.hot.countRows(); vr++) {
          const pr = classDh.hot.toPhysicalRow(vr);
          if (pr == null) continue;
          const name = classDh.hot.getSourceDataAtCell(pr, nameCol) ?? '';
          if (name && !classOrder.has(name)) classOrder.set(name, classOrder.size);
        }
      }
      return (valueA, valueB) => {
        const posA = classOrder.has(valueA) ? classOrder.get(valueA) : Infinity;
        const posB = classOrder.has(valueB) ? classOrder.get(valueB) : Infinity;
        if (posA === Infinity && posB === Infinity) return 0;
        if (posA === Infinity) return 1;
        if (posB === Infinity) return -1;
        const diff = posA - posB;
        return sortOrder === 'asc' ? diff : -diff;
      };
    }
    // Fallback for all other columns: numeric when both values are numbers,
    // otherwise locale-aware string comparison; empties always sort to the end.
    const _empty = v => v === null || v === undefined || v === '';
    return (valueA, valueB) => {
      const emptyA = _empty(valueA);
      const emptyB = _empty(valueB);
      if (emptyA && emptyB) return 0;
      if (emptyA) return 1;
      if (emptyB) return -1;
      const numA = Number(valueA);
      const numB = Number(valueB);
      const cmp = (!isNaN(numA) && !isNaN(numB))
        ? numA - numB
        : String(valueA).localeCompare(String(valueB));
      return sortOrder === 'asc' ? cmp : -cmp;
    };
  };

	  // Sort option 1 (default): schema → table → rank → title (tiebreaker)
	  // slot_group ordering is managed separately via SlotGroup tab drag-and-drop.
	  dh.slotSortByTableRank = [
	    {column: dh.schema_name_column,   sortOrder: 'asc'}, // schema_id
	    {column: dh.slot_class_id_column, sortOrder: 'asc'}, // class_id (table)
	    {column: dh.slot_rank_column,     sortOrder: 'asc'}, // rank
	    {column: dh.slot_group_column,    sortOrder: 'asc'}, // slot_group (section)
	    {column: dh.slot_title_column,    sortOrder: 'asc'}, // title (tiebreaker)
	  ];
	  // Sort option 2: field label → schema → table
	  dh.slotSortByLabel = [
	    {column: dh.slot_title_column,    sortOrder: 'asc'}, // title (field label)
	    {column: dh.schema_name_column,   sortOrder: 'asc'}, // schema_id
	    {column: dh.slot_class_id_column, sortOrder: 'asc'}, // class_id (table)
	  ];
	  dh.defaultMultiColumnSortConfig = dh.slotSortByTableRank;

	  // Re-apply the slot sort after any undo operation.
	  // HOT's loadData (used for bulk deletion) clears the sort plugin state, so
	  // a subsequent Cmd-Z would render the data in physical-row order (schema
	  // fields first) instead of the user's chosen sort order.
	  dh.hot.addHook('afterUndo', () => {
	    const sortPlugin = dh.hot.getPlugin('multiColumnSorting');
	    if (!sortPlugin) return;
	    const orderBy = $('input[name="slot-order-type"]:checked').val() ?? 'rank';
	    const sortCfg  = orderBy === 'label' ? dh.slotSortByLabel : dh.slotSortByTableRank;
	    sortPlugin.sort(sortCfg);
	  });

	  // Enable drag-and-drop row reordering for the Slot tab.
	  hot_settings.manualRowMove = true;

	  // ── Field Key Modal: intercept Add Row and key-field cell edits ─────────
	  // Replaces Guards 1/2/3.  The modal collects all key fields upfront and
	  // derives slot_type from context.

	  // A. Override addRows for the Slot tab so both the footer "Add" button and
	  //    right-click insert open the modal instead of the FK-parent guard popup.
	  //    For right-click inserts (startRowIndex is a number), the modal is
	  //    pre-filled from the neighbouring context row: the row above the
	  //    insertion point, or row 0 when inserting at the very top.
	  dh.addRows = (row_where, numRows, startRowIndex) => {
	    let preFillRow = null;
	    if (typeof startRowIndex === 'number') {
	      const totalRows = dh.hot.countRows();
	      if (startRowIndex === 0) {
	        // Inserting above the first row — use current row 0 as context
	        // (it will sit below the new row after insertion).
	        preFillRow = totalRows > 0 ? 0 : null;
	      } else {
	        // Use the row immediately above the insertion point.
	        preFillRow = Math.min(startRowIndex - 1, totalRows - 1);
	      }
	    }
	    // Store insertion context so the save handler can honour the specific
	    // rank position when the saved section matches the context row's section.
	    dh._insertCtx = typeof startRowIndex === 'number'
	      ? { preFillRow, isAboveFirst: startRowIndex === 0 }
	      : null;
	    this.showFieldKeyModal(dh, null, preFillRow);
	  };

	  // Remove dropdown picklists for columns managed by the Field Key Modal.
	  // Modify hot_settings.columns directly — updateColumnSettings() cannot be
	  // used here because this runs during createHot() before HOT plugins are
	  // fully initialized (hiddenRows plugin index mapper is not yet ready).
	  // Also clear slot.sources so refreshMenus does not repopulate the dropdown.
	  const MODAL_COLS = [
	    dh.schema_name_column,    // schema_id
	    dh.slot_name_column,      // name  — modal handles all edits; no inline picklist needed
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

  // Render the slot_type column via the DH terms dictionary so the labels
	  // update when the user switches between default and LinkML terminology.
	  // The mapping mirrors the #fkm-field-type dropdown in showFieldKeyModal.
	  const slotTypeCol = dh.slot_type_column;
	  if (slotTypeCol !== undefined && hot_settings.columns[slotTypeCol]) {
	    const slotTypeTerms = {
	      slot:       '{{schema slot}}',
	      slot_usage: '{{class slot}}',
	      attribute:  '{{class attribute}}',
	    };
	    const context = this.context;
	    hot_settings.columns[slotTypeCol].renderer = function (hot, TD, row, col, prop, value, cellProperties) {
	      const term  = slotTypeTerms[value];
	      const label = term ? context.applyDhTerms(term) : (value ?? '');
	      Handsontable.renderers.TextRenderer(hot, TD, row, col, prop, label, cellProperties);
	    };
	  }

	  // Only Field ID (slot_name_column) triggers the Edit Field modal on click.
  // Table ID, Type, and Section are read-only and do not open the modal.
  // schema_name_column is a hidden FK column and is already unconditionally read-only.
  // KEY_COLUMNS includes the four leading columns whose editing is managed
  // exclusively via the Edit Field modal.  Clicking any of them uses the
  // two-click pattern: first click selects the cell; clicking an already-selected
  // cell opens the Edit Field dialog.
  const KEY_COLUMNS = new Set([
	    dh.slot_class_id_column, // Table ID
	    dh.slot_type_column,     // Type
	    dh.slot_group_column,    // Section
	    dh.slot_name_column,     // Field ID (primary key)
	  ]);

	  // Captures the HOT selection immediately before a mousedown changes it,
	  // so afterOnCellMouseDown can tell whether the clicked cell was already selected.
	  let _preClickSelection = null;

	  dh.hot.addHook('beforeOnCellMouseDown', (_event, coords) => {
	    if (coords.row < 0) return;
	    _preClickSelection = dh.hot.getSelectedLast() ?? null;
	  });

	  // B. afterOnCellMouseDown — two-click-to-edit pattern for key/managed columns.
	  //    First click: select the cell normally (no modal).
	  //    Click on an already-selected key cell: open the Edit Field modal.
	  dh.hot.addHook('afterOnCellMouseDown', (event, coords) => {
	    if (coords.row < 0) return; // header — ignore
	    if (event.button === 2) return; // right-click — let context menu open, not modal
	    if (event.shiftKey || event.ctrlKey || event.metaKey) return; // range-select

	    if (!KEY_COLUMNS.has(coords.col)) return;

	    // The cell was already selected if the pre-click selection was exactly
	    // this single cell (no multi-cell range).
	    const sel = _preClickSelection;
	    const wasAlreadySelected =
	      sel &&
	      sel[0] === coords.row && sel[1] === coords.col &&
	      sel[2] === coords.row && sel[3] === coords.col;

	    // Abort any editor HOT may have opened for this click.
	    if (dh.hot.getActiveEditor()?.isOpened()) {
	      dh.hot.getActiveEditor().finishEditing(true); // cancel, no beforeChange
	    }

	    if (!wasAlreadySelected) {
	      return; // first click: select the cell only, do not open the modal
	    }

	    // Cell was already selected — open the Edit Field modal.
	    setTimeout(() => this.showFieldKeyModal(dh, coords.row), 0);
	  });

	  // C. beforeChange safety net — catches keyboard-driven edits to key cells
	  //    (arrow-key navigation then Enter/F2 to open editor and commit), and
	  //    prevents non-expert users from editing base schema slot rows.
	  dh.hot.addHook('beforeChange', (changes, source) => {
	    if (!changes) return;
	    if (['loadData', 'updateData', 'batch_updates', 'cascade_confirm',
	         'upload', 'field_key_modal', 'drag_section_update'].includes(source)) return;

	    // Redirect key-column edits to the Field Key Modal.
	    // Ignore no-op commits (oldVal === newVal) that HOT generates when an inline
	    // editor closes without any actual change (e.g. clicking outside while FKM is
	    // open) — those must not re-open FKM and clear any error it is showing.
	    const keyEdit = changes.find(([, col, oldVal, newVal]) => KEY_COLUMNS.has(col) && oldVal !== newVal);
	    if (keyEdit) {
	      const visualRow = keyEdit[0];
	      setTimeout(() => this.showFieldKeyModal(dh, visualRow), 0);
	      return false; // cancel inline edit
	    }

	    // Block non-expert users from editing:
	    //   (a) base schema slot (slot_type='slot') rows — they define the field library
	    //       and any change propagates to all tables that inherit the field.
	    //   (b) slot_usage rows whose edited cell currently inherits a value from the
	    //       base schema slot — Expert User mode is required to modify the
	    //       inheritance chain (update schema field, override for table, or convert).
	    if (!dh.context.expert_user) {
	      const _emptyVal = (v) => v === null || v === undefined || v === '' || v === false;
	      for (const [visualRow, col, oldVal, newVal] of changes) {
	        if (oldVal === newVal) continue; // no actual change — nothing to block
	        const physRow = dh.hot.toPhysicalRow(visualRow);
	        if (physRow == null) continue;
	        const slotType = dh.hot.getSourceDataAtCell(physRow, dh.slot_type_column);
	        const slotName = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column) || '(unknown)';

	        if (slotType === 'slot') {
	          const msg = dh.context.applyDhTerms(
	            `<strong>${slotName}</strong> is a {{schema slot}}. ` +
	            `To edit it, you must enable <strong>Expert User</strong> mode.`
	          );
	          setTimeout(() => dhAlert(msg, { title: 'Expert User mode required', html: true }), 0);
	          return false;
	        }

	        if (slotType === 'slot_usage' && dh.slotDefinitionIndex) {
	          const schemaId   = dh.hot.getSourceDataAtCell(physRow, dh.schema_name_column);
	          const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${slotName}`);
	          if (defPhysRow !== undefined) {
	            const baseVal = dh.hot.getSourceDataAtCell(defPhysRow, col);
	            if (!_emptyVal(baseVal) && oldVal === baseVal) {
	              // The cell is currently inheriting from a base schema slot.
	              const colName = Object.keys(dh.slot_name_to_column).find(k => dh.slot_name_to_column[k] === col) ?? String(col);
	              const msg = dh.context.applyDhTerms(
	                `The <strong>${slotName}</strong> {{slot}} property <strong>${colName}</strong> is linked to a {{schema slot}} by the same name which supplies a value to this {{slot}}. ` +
	                `To edit linked {{slots}}, you must enable <strong>Expert User</strong> mode.`
	              );
	              setTimeout(() => dhAlert(msg, { title: 'Expert User mode required', html: true }), 0);
	              return false;
	            }
	          }
	        }
	      }
	    }
	  });

	  // D. afterChange — inherited-cell edit dialog.
	  //    When the user edits a non-key cell in a slot_usage row whose current
	  //    value was inherited from the base schema slot, ask how to apply the
	  //    change:
	  //      0 "Update schema field"    — write newVal to the base slot so all
	  //        tables that reuse this slot inherit the change automatically.
	  //      1 "Override for this table" — keep newVal in the slot_usage
	  //        row only (current default behaviour, no extra action needed).
	  //      2 "Convert to attribute" (expert) — convert this row from slot_usage
	  //        to type=attribute; all attributes of this field are editable
	  //        independently of the schema field specification.
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

	      // ── Base slot (type=slot) edit: inform user which tables inherit this field ──
	      if (slotType === 'slot') {
	        // Defensive guard: beforeChange should have blocked non-expert edits to
	        // slot rows, but a paste or other non-keyboard path could bypass it.
	        // Revert the cell and alert rather than letting the change silently land.
	        if (!dh.context.expert_user) {
	          const slotName = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column) || '(unknown)';
	          const msg = dh.context.applyDhTerms(
	            `<strong>${slotName}</strong> is a {{schema slot}}. ` +
	            `To edit it, you must enable <strong>Expert User</strong> mode.`
	          );
	          setTimeout(() => {
	            dh.hot.setDataAtCell(visualRow, col, oldVal, 'cascade_confirm');
	            dhAlert(msg, { title: 'Expert User mode required', html: true });
	          }, 0);
	          break;
	        }

	        if (!dh.slotDefinitionIndex) continue;
	        const slotName = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column);
	        const schemaId = dh.hot.getSourceDataAtCell(physRow, dh.schema_name_column);

	        // Collect every slot_usage row for this slot+schema together with
	        // their current value for the edited column.
	        const _emptyVal = (v) => v === null || v === undefined || v === '';
	        const inheriting = [];
	        for (let pr = 0; pr < dh.hot.countSourceRows(); pr++) {
	          if (dh.hot.getSourceDataAtCell(pr, dh.slot_type_column) !== 'slot_usage') continue;
	          if (dh.hot.getSourceDataAtCell(pr, dh.slot_name_column) !== slotName)     continue;
	          if (dh.hot.getSourceDataAtCell(pr, dh.schema_name_column) !== schemaId)   continue;
	          const currentVal = dh.hot.getSourceDataAtCell(pr, col);
	          inheriting.push({
	            pr,
	            classId:    dh.hot.getSourceDataAtCell(pr, dh.slot_class_id_column) || '(unnamed)',
	            currentVal,
	          });
	        }
	        if (!inheriting.length) continue; // no slot_usage rows — nothing to report

	        // Cascade the new value to all slot_usage rows that carry a non-empty
	        // value for this column.  Empty slot_usage cells already inherit
	        // implicitly and need no explicit update.  A non-empty slot_usage value
	        // for the same slot+schema is always equal to the base-slot value because
	        // the afterChange guard (below) prevents users from creating a divergent
	        // override.
	        const cascadeCells = [];
	        for (const su of inheriting) {
	          if (_emptyVal(su.currentVal)) continue;
	          const vRow = dh.hot.toVisualRow(su.pr);
	          if (vRow !== null) cascadeCells.push([vRow, col, newVal]);
	        }
	        if (cascadeCells.length) {
	          setTimeout(() => dh.hot.setDataAtCell(cascadeCells, 'cascade_confirm'), 0);
	        }

	        const fieldTitle = dh.slots[col]?.title ?? dh.slots[col]?.name ?? `column ${col}`;

	        const listItems = inheriting
	          .map(su => {
	            const oldVal = (su.currentVal != null && su.currentVal !== '')
	              ? su.currentVal
	              : '(empty)';
	            return `<li><em>${su.classId}</em>: <details><summary>old value</summary>${oldVal}</details></li>`;
	          })
	          .join('');

	        const body = dh.context.applyDhTerms(
	          `<p>You changed the <em>${slotName}</em> {{slot}} attribute ` +
	          `<strong>"${fieldTitle}"</strong> to "${newVal ?? '(cleared)'}". ` +
	          `The following {{classes}} reuse this {{slot}} {{attribute}}:</p>` +
	          `<ul>${listItems}</ul>`
	        );

	        _inheritedEditDialogOpen = true;
	        setTimeout(() => {
	          dhAlert(body, { title: `${slotName}: ${fieldTitle} updated`, html: true })
	            .then(() => { _inheritedEditDialogOpen = false; });
	        }, 0);

	        break; // one dialog at a time
	      }

	      if (slotType !== 'slot_usage') continue;  // only slot_usage rows from here

	      if (!dh.slotDefinitionIndex) continue;
	      const slotName   = dh.hot.getSourceDataAtCell(physRow, dh.slot_name_column);
	      const schemaId   = dh.hot.getSourceDataAtCell(physRow, dh.schema_name_column);
	      const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${slotName}`);
	      if (defPhysRow === undefined) continue;   // no base slot — standalone field

	      const baseVal = dh.hot.getSourceDataAtCell(defPhysRow, col);
	      const _empty  = (v) => v === null || v === undefined || v === '';
	      if (_empty(baseVal)) continue;            // base slot has no value for this col
	      if (oldVal !== baseVal) continue;         // was already an explicit override

	      // Defensive guard: beforeChange should have blocked non-expert edits to
	      // slot_usage rows with inherited values, but paste can bypass it.
	      if (!dh.context.expert_user) {
	        const colName = Object.keys(dh.slot_name_to_column).find(k => dh.slot_name_to_column[k] === col) ?? String(col);
	        const msg = dh.context.applyDhTerms(
	          `The <strong>${slotName}</strong> {{slot}} property <strong>${colName}</strong> is linked to a {{schema slot}} by the same name which supplies a value to this {{slot}}. ` +
	          `To edit linked {{slots}}, you must enable <strong>Expert User</strong> mode.`
	        );
	        setTimeout(() => {
	          dh.hot.setDataAtCell(visualRow, col, oldVal, 'cascade_confirm');
	          dhAlert(msg, { title: 'Expert User mode required', html: true });
	        }, 0);
	        break;
	      }

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

	      // Build reusing-class list (current class + others with same slot+schema).
	      const currentClassId = dh.hot.getSourceDataAtCell(physRow, dh.slot_class_id_column);
	      const reusingNote = [currentClassId, ...otherSlotUsages.map(su => su.classId)]
	        .filter(Boolean)
	        .map(c => `<em>${c}</em>`)
	        .join(', ');

	      // Build append note for "Drop schema slot control" option.
	      let overrideAppend;
	      if (otherSlotUsages.length === 0) {
	        overrideAppend = `(No other {{class}} uses this {{slot}}.)` ;
	      } else {
	        const otherClassNames = otherSlotUsages
	          .map(su => `<em>${su.classId}</em>`)
	          .join(', ');
	        overrideAppend = `(Also used in ${otherClassNames}.)`;
	      }

	      const body = dh.context.applyDhTerms(
	        `<p>You changed the <strong>${fieldTitle}</strong> property of ` +
	        `<strong>${slotName}</strong>, which reuses a {{schema slot}} of the same name. ` +
	        `Choose from the following edit options:</p>` +
	        `<table style="border-collapse:collapse;width:100%"><tbody>` +
	        `<tr>` +
	        `<td style="padding:4px 10px 4px 0;vertical-align:top;white-space:nowrap">` +
	        `<button class="btn btn-primary btn-sm" data-choice="0">Update {{schema slot}}</button></td>` +
	        `<td style="padding:4px 0">Apply the change to the {{schema slot}} library. All {{classes}} ` +
	        `that reuse this {{slot}} (${reusingNote}) will inherit the new value.</td>` +
	        `</tr>` +
	        `<tr>` +
	        `<td style="padding:4px 10px 4px 0;vertical-align:top;white-space:nowrap">` +
	        `<button class="btn btn-primary btn-sm" data-choice="1">Drop {{schema slot}} control of this property</button></td>` +
	        `<td style="padding:4px 0">Clear the {{schema slot}} <strong>${fieldTitle}</strong> value ` +
	        `so it is not reused in any {{class}} {{slots}}. Store the new ` +
	        `<strong>${fieldTitle}</strong> value in this {{slot}} only. ${overrideAppend}</td>` +
	        `</tr>` +
	        `<tr>` +
	        `<td style="padding:4px 10px 4px 0;vertical-align:top;white-space:nowrap">` +
	        `<button class="btn btn-primary btn-sm" data-choice="2">Convert to {{attribute slot}}</button></td>` +
	        `<td style="padding:4px 0">Convert the <strong>${slotName}</strong> {{slot}} from a reused ` +
	        `{{schema}} {{slot}} to a standalone {{class}} {{attribute}}. All properties of this {{slot}} ` +
	        `are editable independently of the {{schema slot}} specification.</td>` +
	        `</tr>` +
	        `</tbody></table>`
	      );

	      _inheritedEditDialogOpen = true;
	      // Open the dialog after HOT has finished processing the current change.
	      setTimeout(() => {
	        const modal     = document.getElementById('dh-dialog-modal');
	        const headerEl  = modal.querySelector('#dh-dialog-header');
	        const titleEl   = modal.querySelector('#dh-dialog-title');
	        const bodyEl    = modal.querySelector('#dh-dialog-body');
	        const okBtn     = modal.querySelector('#dh-dialog-ok');
	        const cancelBtn = modal.querySelector('#dh-dialog-cancel');
	        const ns        = '.dhChoose';

	        titleEl.textContent = dh.context.applyDhTerms('Linked {{slot}} changed property');
	        headerEl.style.display = '';
	        bodyEl.innerHTML = body;
	        bodyEl.style.whiteSpace = '';
	        okBtn.style.display = 'none';
	        cancelBtn.textContent = 'Cancel (revert change)';
	        cancelBtn.style.display = '';

	        $(modal).off(ns);
	        const cleanup = (choice) => {
	          $(modal).off(ns);
	          okBtn.style.display = '';
	          $(modal).modal('hide');
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
	          } else if (choice === 2) {
	            // Convert to attribute — change slot_type from 'slot_usage' to 'attribute'.
	            // Inherited values are already present in the HOT row (copied at load time);
	            // with slot_type='attribute', _buildSchemaYaml writes them all explicitly
	            // into class.attributes instead of class.slot_usage.
	            // newVal is already applied in the edited column — no extra write needed.
	            dh.hot.setDataAtCell(
	              captured.visualRow, dh.slot_type_column, 'attribute', 'cascade_confirm'
	            );
	          } else {
	            // Cancel — revert the slot_usage cell to the inherited value.
	            dh.hot.setDataAtCell(captured.visualRow, captured.col, captured.oldVal, 'cascade_confirm');
	          }
	        };

	        bodyEl.querySelectorAll('[data-choice]').forEach(btn => {
	          btn.addEventListener('click', () => cleanup(parseInt(btn.dataset.choice)));
	        });
	        $(modal).on(`click${ns}`, '#dh-dialog-cancel', () => cleanup(-1));
	        $(modal).on(`hidden.bs.modal${ns}`, () => cleanup(-1));

	        $(modal).modal('show');
	      }, 0);

	      break; // handle one inherited change per afterChange call
	    }
	  });

	  // D.5 beforeRowMove — validate drag-and-drop before HOT applies the move.
  //   A. Cross-schema drag → always blocked.
  //   B. slot_group constraint (non-expert) → blocked with explanation.
  //   C. Cross-class drag (valid) → sets dh._dragState.isCrossClass flag.
  dh.hot.addHook('beforeRowMove', (movedRows, finalIndex, dropIndex, movePossible) => {
    if (!movePossible || !movedRows.length) return;
    // Ignore no-op 'moves' where rows are dropped back onto their own position.
    // HOT fires beforeRowMove on a bare click of the row-move handle inside a
    // selection, reporting the clicked position as finalIndex.  If finalIndex
    // equals the start of the moved range or one past its end, the rows do not
    // actually change position — skip silently to avoid spurious dialogs.
    const minMoved = Math.min(...movedRows);
    const maxMoved = Math.max(...movedRows);
    if (finalIndex === minMoved || finalIndex === maxMoved + 1) return;
    const hot = dh.hot;

    // Capture pre-move source-data snapshot and move metadata for afterRowMove.
    dh._dragState = {
      originalData:  hot.getSourceData().map(r => Array.isArray(r) ? [...r] : r),
      movedRows:     [...movedRows],
      finalIndex,
      isCrossClass:  false,
      targetClass:   null,
      targetSection: '',
    };
    dh._pendingMoveCount = movedRows.length;

    // Helper: walk from dropIndex outward, skipping moved rows, to find the
    // first non-moved row and return its schema/class/section context.
    const movedSet = new Set(movedRows);
    const targetCtx = (() => {
      const count = hot.countRows();
      const candidates = [dropIndex, dropIndex - 1, dropIndex + 1,
                          ...Array.from({length: count}, (_, i) => i)];
      for (const vr of candidates) {
        if (vr < 0 || vr >= count || movedSet.has(vr)) continue;
        const phys = hot.toPhysicalRow(vr);
        if (phys == null) continue;
        return {
          schema:  hot.getSourceDataAtCell(phys, dh.schema_name_column)   || null,
          classId: hot.getSourceDataAtCell(phys, dh.slot_class_id_column) || null,
          section: hot.getSourceDataAtCell(phys, dh.slot_group_column)    || '',
        };
      }
      return null;
    })();

    // ── A. Cross-schema block ──────────────────────────────────────────────
    if (targetCtx?.schema) {
      for (const vr of movedRows) {
        const phys = hot.toPhysicalRow(vr);
        if (phys == null) continue;
        const rowSchema = hot.getSourceDataAtCell(phys, dh.schema_name_column);
        if (rowSchema && rowSchema !== targetCtx.schema) {
          dhAlert(
            'Fields cannot be moved to a different schema.\n' +
            'Use the right-click "Copy to schema…" menu to copy fields between schemas.',
            { title: 'Move blocked — different schema' }
          );
          dh._dragState = null;
          return false;
        }
      }
    }

    // ── B. slot_group constraint check ────────────────────────────────────
    const isExpert = document.getElementById('schema_expert')?.checked;
    if (!isExpert && targetCtx) {
      const violations = [];
      for (const vr of movedRows) {
        const phys = hot.toPhysicalRow(vr);
        if (phys == null) continue;
        const slotType = hot.getSourceDataAtCell(phys, dh.slot_type_column);
        if (slotType !== 'slot_usage') continue; // attributes are decoupled from schema constraints
        const slotName   = hot.getSourceDataAtCell(phys, dh.slot_name_column);
        const slotSchema = hot.getSourceDataAtCell(phys, dh.schema_name_column);
        const basePhys   = dh.slotDefinitionIndex?.get(`${slotSchema}\0${slotName}`);
        if (basePhys == null) continue;
        const baseGroup  = hot.getSourceDataAtCell(basePhys, dh.slot_group_column) || '';
        if (baseGroup && baseGroup !== targetCtx.section) {
          violations.push(slotName);
        }
      }
      if (violations.length) {
        const slotGroupTerm = dh.context.applyDhTerms('{{slot group}}');
        const slotsTerm    = dh.context.applyDhTerms('{{class slot(s)}}');
        dhAlert(
          `The following ${slotsTerm} are constrained by their schema definition and cannot be ` +
          `moved to section "${targetCtx.section || '(none)'}":` +
          `\n\n• ${violations.join('\n• ')}` +
          `\n\nEnable Expert User mode to override schema ${slotGroupTerm} constraints.`,
          { title: `Move blocked — ${slotGroupTerm} constraint` }
        );
        dh._dragState = null;
        return false;
      }
    }

    // ── C. Cross-class flag ───────────────────────────────────────────────
    if (targetCtx?.classId) {
      const firstPhys  = hot.toPhysicalRow(movedRows[0]);
      const movedClass = firstPhys != null
        ? hot.getSourceDataAtCell(firstPhys, dh.slot_class_id_column) : null;
      if (movedClass && movedClass !== targetCtx.classId) {
        dh._dragState.isCrossClass  = true;
        dh._dragState.targetClass   = targetCtx.classId;
        dh._dragState.targetSection = targetCtx.section;
      }
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

	    const hot       = dh.hot;
	    const dragState = dh._dragState;
	    dh._dragState   = null; // consume

	    // ── Cross-class confirmation ────────────────────────────────────────────
	    if (dragState?.isCrossClass) {
	      // HOT 15 bug: movedRows may be [] in afterRowMove; use _pendingMoveCount as fallback.
	      const numMoved = movedRows.length || dh._pendingMoveCount || 1;
	      (async () => {
	        const confirmed = await dhConfirm(
	          `Move ${numMoved} field(s) to class "${dragState.targetClass}"?\n` +
	          `Their class will change from the current class to "${dragState.targetClass}".`,
	          { title: 'Confirm cross-class move' }
	        );
	        if (!confirmed) {
	          // Revert to pre-move order.
	          hot.loadData(dragState.originalData);
	          hot.getPlugin('multiColumnSorting').sort(dh.defaultMultiColumnSortConfig);
	          hot.render();
	          return;
	        }
	        // Update class_id for the moved rows (now at finalIndex..finalIndex+numMoved-1).
	        const changes = [];
	        for (let i = 0; i < numMoved; i++) {
	          const vr   = finalIndex + i;
	          const phys = hot.toPhysicalRow(vr);
	          if (phys != null) changes.push([phys, dh.slot_class_id_column, dragState.targetClass]);
	        }
	        if (changes.length) {
	          hot.batch(() => {
	            for (const [p, c, v] of changes) hot.setSourceDataAtCell(p, c, v);
	          });
	        }
	        // Fall through to section auto-update and re-rank.
	        runMovePostProcessing();
	      })();
	      return; // async IIFE handles post-processing
	    }

	    // ── Same-class: synchronous post-processing ───────────────────────────
	    runMovePostProcessing();

	    function runMovePostProcessing() {
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
	        const key    = `${schema} ${cls}`;
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

	      // Commit rank/section changes and re-sort inside a single hot.batch() call
	      // so that intermediate renders are suppressed.
	      //
	      // Chrome Performance trace confirmed that each setSourceDataAtCell() in HOT
	      // 15 triggers Core.render() internally.  With ~50 fields in a class each
	      // getting a new rank, that was ~50 renders × ~140 ms = 7 s of delay.
	      // hot.batch() suspends execution for the duration of the callback: all
	      // source-data mutations and the sortPlugin.sort() IndexMapper rebuild happen
	      // synchronously with no intermediate redraws.  A single render fires when
	      // the batch ends (via resumeExecution()), then HOT fires its own natural
	      // post-afterRowMove render — two renders total vs. N+1 previously.
	      if (physChanges.length > 0) {
	        hot.batch(() => {
	          for (const [pr, col, val] of physChanges) {
	            hot.setSourceDataAtCell(pr, col, val);
	          }
	          const sortPlugin = hot.getPlugin('multiColumnSorting');
	          if (sortPlugin) {
	            const curConfig = sortPlugin.getSortConfig();
	            sortPlugin.sort(curConfig.length ? curConfig : dh.defaultMultiColumnSortConfig);
	          }
	        });
	      }
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

	  // Slot-type visibility filter: controls whether 'slot' type rows (schema-level
	  // field definitions) are shown or hidden independently of the class-based key
	  // filter.  Toggle visibility by modifying this Set and calling dh.hot.render():
	  //   dh._slotTypeFilter.add('slot')    → make schema slot rows visible
	  //   dh._slotTypeFilter.delete('slot') → hide schema slot rows
	  // Default: {'slot'} — schema slots visible. Remove 'slot' to hide them.
	  dh._slotTypeFilter = new Set(['slot']);
	  let _filteringSlotType = false;
	  dh.hot.addHook('afterRender', () => {
	    if (_filteringSlotType) return;
	    const filter = dh._slotTypeFilter;
	    if (!filter) return;
	    const hrPlugin = dh.hot.getPlugin('hiddenRows');
	    if (!hrPlugin?.enabled) return;
	    const slotVisible = filter.has('slot');
	    // Build current hidden-row set to avoid calling showRows/hideRows when the
	    // state is already correct.  showRows/hideRows internally call render(), and
	    // if that render is deferred (HOT batches renders triggered from afterRender),
	    // _filteringSlotType is false by the time it fires, causing re-entry.
	    // Only changing rows that actually need to change prevents the loop.
	    const hiddenSet = new Set(hrPlugin.getHiddenRows());
	    const toShow = [];
	    const toHide = [];
	    // When un-hiding slot rows, respect the current schema filter so that
	    // cross-schema slot rows hidden by tabFilter are not inadvertently revealed.
	    // In "All records" mode, or when no schema row is selected, there is no
	    // schema restriction and all slot rows may be un-hidden by this filter.
	    const _showAll = ($('input[name="display-main-type"]:checked').val() ?? '') === 'all';
	    const _schemaDh = this.context.dhs['Schema'];
	    const _selSchemaVr = _schemaDh ? (_schemaDh.hot.getSelectedLast()?.[0] ?? -1) : -1;
	    const _selSchemaName = (!_showAll && _selSchemaVr >= 0 && _schemaDh)
	      ? _schemaDh.hot.getDataAtCell(_selSchemaVr, _schemaDh.slot_name_to_column['name'])
	      : null;
	    for (let p = 0; p < dh.hot.countSourceRows(); p++) {
	      if (dh.hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
	      const v = dh.hot.toVisualRow(p);
	      if (v === null) continue;
	      const isHidden = hiddenSet.has(v);
	      if (slotVisible && isHidden) {
	        // Only un-hide if this slot row belongs to the currently selected schema
	        // (or if no schema filter is active), to avoid overriding tabFilter.
	        const rowSchema = dh.hot.getSourceDataAtCell(p, dh.schema_name_column);
	        if (!_selSchemaName || rowSchema === _selSchemaName) toShow.push(v);
	      } else if (!slotVisible && !isHidden) {
	        toHide.push(v);
	      }
	    }
	    if (!toShow.length && !toHide.length) return;
	    _filteringSlotType = true;
	    if (toShow.length) hrPlugin.showRows(toShow);
	    if (toHide.length) hrPlugin.hideRows(toHide);
	    _filteringSlotType = false;
	  });
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
	showFieldKeyModal(dh, visualRow = null, preFillRow = null) {
	  const hot = dh.hot;

	  // ── 1. Read existing row data if editing; or pre-fill from context row ──
	  let initSchemaId  = '';
	  let initClassId   = '';
	  let initSlotType  = '';
	  let initName      = '';
	  let initSlotGroup = '';
	  let initTitle     = '';

	  if (visualRow !== null) {
	    // Edit mode: all init values come from the row being edited.
	    const physRow  = hot.toPhysicalRow(visualRow);
	    initSchemaId   = hot.getSourceDataAtCell(physRow, dh.schema_name_column)   || '';
	    initClassId    = hot.getSourceDataAtCell(physRow, dh.slot_class_id_column) || '';
	    initSlotType   = hot.getSourceDataAtCell(physRow, dh.slot_type_column)     || '';
	    initName       = hot.getSourceDataAtCell(physRow, dh.slot_name_column)     || '';
	    initSlotGroup  = hot.getSourceDataAtCell(physRow, dh.slot_group_column)    || '';
	    initTitle      = hot.getSourceDataAtCell(physRow, dh.slot_title_column)    || '';
	  } else if (preFillRow !== null && preFillRow >= 0 && preFillRow < hot.countRows()) {
	    // Add mode via right-click insert: attempt to pre-fill schema/type/class/
	    // slot_group from the neighbouring context row.  Name and title stay blank.
	    // If the context row itself is empty (no schema_id), fall through to the
	    // plain add-mode default so the user is not presented a blank pre-fill.
	    const physRow     = hot.toPhysicalRow(preFillRow);
	    const ctxSchemaId = hot.getSourceDataAtCell(physRow, dh.schema_name_column) || '';
	    if (ctxSchemaId) {
	      initSchemaId  = ctxSchemaId;
	      initClassId   = hot.getSourceDataAtCell(physRow, dh.slot_class_id_column) || '';
	      initSlotType  = hot.getSourceDataAtCell(physRow, dh.slot_type_column)     || '';
	      initSlotGroup = hot.getSourceDataAtCell(physRow, dh.slot_group_column)    || '';
	    } else {
	      // Context row is empty — behave like a plain Add button press.
	      initSchemaId = this.getSchemaEditorSelectedSchema() || '';
	    }
	  } else {
	    // Add mode via footer Add button: default to Schema-tab selection.
	    initSchemaId = this.getSchemaEditorSelectedSchema() || '';
	  }

	  // In add mode, a schema must already be selected.  Block the dialog
	  // early so the user knows exactly what to do first.
	  if (visualRow === null && !initSchemaId) {
	    dhAlert(this.context.applyDhTerms('Please select a {{schema}} on the {{Schema}} tab first before adding a {{slot}}.'));
	    return;
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
	    let hasClasses = false;
	    if (classDh && classNameCol !== undefined) {
	      for (let r = 0; r < classDh.hot.countSourceRows(); r++) {
	        const rSchema = classDh.hot.getSourceDataAtCell(r, classSchemaCol);
	        if (rSchema !== schemaId) continue;
	        const cn = classDh.hot.getSourceDataAtCell(r, classNameCol);
	        if (cn && cn !== 'Container') {
	          $cls.append($('<option>').val(cn).text(cn));
	          hasClasses = true;
	        }
	      }
	    }
	    if (preselect) $cls.val(preselect);
	    // When no classes exist for this schema, disable the Table picklist and
	    // the table-field type options so the user can't select an impossible state.
	    $cls.prop('disabled', !hasClasses);
	    $('#fkm-field-type option[value="slot_usage"], #fkm-field-type option[value="attribute"]')
	      .prop('disabled', !hasClasses);
	    return hasClasses;
	  };

	  const rebuildAlsoDeriveClassDropdown = (schemaId) => {
	    const $sel = $('#fkm-also-derive-class').empty()
	      .append($('<option value="">').text(this.context.applyDhTerms('— select {{class}} —')));
	    let hasClasses = false;
	    if (classDh && classNameCol !== undefined) {
	      for (let r = 0; r < classDh.hot.countSourceRows(); r++) {
	        const rSchema = classDh.hot.getSourceDataAtCell(r, classSchemaCol);
	        if (rSchema !== schemaId) continue;
	        const cn = classDh.hot.getSourceDataAtCell(r, classNameCol);
	        if (cn && cn !== 'Container') { $sel.append($('<option>').val(cn).text(cn)); hasClasses = true; }
	      }
	    }
	    return hasClasses;
	  };

	  // ── 4. Section (slot_group) dropdown builder ─────────────────────────
	  // Options are drawn only from the current class's slot_usage + attribute rows,
	  // ordered by the minimum rank among slots in each group (matching table display
	  // order — not alphabetical).
	  const rebuildSlotGroupDropdown = (schemaId, classId, preselect) => {
	    const $sg = $('#fkm-slot-group').empty();
	    $sg.append($('<option value="">— none —</option>'));

	    // Collect slot_groups from this class's slot_usage + attribute rows.
	    // Track minimum rank per group so options can be ordered by table position.
	    const groupMinRank = new Map(); // slot_group → minimum rank seen
	    if (classId) {
	      const rankColSG = dh.slot_rank_column;
	      for (let r = 0; r < hot.countSourceRows(); r++) {
	        if (hot.getSourceDataAtCell(r, dh.schema_name_column)    !== schemaId) continue;
	        if ((hot.getSourceDataAtCell(r, dh.slot_class_id_column) ?? '') !== classId) continue;
	        const t = hot.getSourceDataAtCell(r, dh.slot_type_column);
	        if (t !== 'slot_usage' && t !== 'attribute') continue;
	        const sg = hot.getSourceDataAtCell(r, dh.slot_group_column);
	        if (!sg) continue;
	        const rank    = hot.getSourceDataAtCell(r, rankColSG);
	        const numRank = typeof rank === 'number' ? rank : Infinity;
	        if (!groupMinRank.has(sg) || numRank < groupMinRank.get(sg)) {
	          groupMinRank.set(sg, numRank);
	        }
	      }
	    }

	    // Sort groups by minimum rank ascending (matches the table display order).
	    const orderedGroups = [...groupMinRank.entries()]
	      .sort((a, b) => a[1] === Infinity ? 1 : b[1] === Infinity ? -1 : a[1] - b[1])
	      .map(([sg]) => sg);

	    for (const sg of orderedGroups) {
	      $sg.append($('<option>').val(sg).text(sg));
	    }

	    // Ensure the preselected value is selectable even if it isn't in the class's
	    // current group list (e.g. freshly added slot with a novel section name).
	    if (preselect) {
	      const alreadyPresent = $sg.find('option').toArray().some(el => el.value === preselect);
	      if (!alreadyPresent) $sg.append($('<option>').val(preselect).text(preselect));
	      $sg.val(preselect);
	    }
	  };

	  // ── 4c. Schema slot_group datalist builder ─────────────────────────
	  // Populates the free-text datalist (#fkm-slot-group-list) used when the
	  // type is "slot". Only slot_groups from schema.slots rows are listed —
	  // class-defined slot_groups are excluded per spec.
	  const rebuildSchemaSlotGroupList = (schemaId, preselect) => {
	    const groups = new Set();
	    for (let r = 0; r < hot.countSourceRows(); r++) {
	      if (hot.getSourceDataAtCell(r, dh.slot_type_column)   !== 'slot')   continue;
	      if (hot.getSourceDataAtCell(r, dh.schema_name_column) !== schemaId) continue;
	      const sg = hot.getSourceDataAtCell(r, dh.slot_group_column);
	      if (sg) groups.add(sg);
	    }
	    const $dl = $('#fkm-slot-group-list').empty();
	    for (const sg of [...groups].sort()) $dl.append($('<option>').val(sg));
	    if (preselect != null) $('#fkm-slot-group-new').val(preselect);
	  };

	  // Populates the free-text datalist (#fkm-slot-group-list) with slot_group
	  // values that already appear among a class's slot_usage + attribute rows.
	  // Used for class-level slot add mode so the user can pick an existing
	  // section name or type a new one freely.
	  const rebuildClassSlotGroupList = (schemaId, classId, preselect) => {
	    const groups = new Set();
	    if (classId) {
	      for (let r = 0; r < hot.countSourceRows(); r++) {
	        const type = hot.getSourceDataAtCell(r, dh.slot_type_column);
	        if (type !== 'slot_usage' && type !== 'attribute') continue;
	        if (hot.getSourceDataAtCell(r, dh.schema_name_column) !== schemaId) continue;
	        if (hot.getSourceDataAtCell(r, dh.slot_class_id_column) !== classId) continue;
	        const sg = hot.getSourceDataAtCell(r, dh.slot_group_column);
	        if (sg) groups.add(sg);
	      }
	    }
	    const $dl = $('#fkm-slot-group-list').empty();
	    for (const sg of [...groups].sort()) $dl.append($('<option>').val(sg));
	    if (preselect != null) $('#fkm-slot-group-new').val(preselect);
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

	  // Populates the strict picklist (#fkm-name-select) used when adding a
	  // slot_usage row — the Field ID must be an existing schema slot name.
	  const rebuildFieldIdSelect = (schemaId) => {
	    const $sel = $('#fkm-name-select').empty();
	    $sel.append($('<option>').val('').text('— select a schema field —'));
	    const slots = [];
	    for (let r = 0; r < hot.countSourceRows(); r++) {
	      if (hot.getSourceDataAtCell(r, dh.slot_type_column) !== 'slot') continue;
	      if (hot.getSourceDataAtCell(r, dh.schema_name_column) !== schemaId) continue;
	      const name = hot.getSourceDataAtCell(r, dh.slot_name_column);
	      if (!name) continue;
	      const rank  = Number(hot.getSourceDataAtCell(r, dh.slot_rank_column)) || Infinity;
	      const group = hot.getSourceDataAtCell(r, dh.slot_group_column) || '';
	      slots.push({ name, rank, group });
	    }
	    slots.sort((a, b) => a.rank - b.rank);
	    const groupOrder = [];
	    const grouped = Object.create(null);
	    for (const slot of slots) {
	      if (!(slot.group in grouped)) {
	        grouped[slot.group] = [];
	        groupOrder.push(slot.group);
	      }
	      grouped[slot.group].push(slot.name);
	    }
	    if (grouped['']) {
	      for (const name of grouped['']) {
	        $sel.append($('<option>').val(name).text(name));
	      }
	    }
	    for (const g of groupOrder) {
	      if (!g) continue;
	      const $grp = $('<optgroup>').attr('label', g);
	      for (const name of grouped[g]) {
	        $grp.append($('<option>').val(name).text(name));
	      }
	      $sel.append($grp);
	    }
	  };

	  // ── 5. Show/hide "Change type" row and update labels ──────────────────
	  // In Add mode the row is hidden; the #fkm-field-type dropdown drives the
	  // slot type instead.  In Edit mode a single checkbox lets the user convert
	  // the current field between slot_usage and attribute.  Schema slots (type=slot)
	  // cannot be changed here, so the row is hidden for them too.
	  // derivRowInit tracks whether #fkm-also-derive-row has been shown for the
	  // current modal invocation; resets when type changes away from 'slot'.
	  let derivRowInit = false;
	  const updateSlotTypeRow = () => {
	    $('#fkm-info').hide();  // Reset info/warn messages; re-shown below if needed.
    $('#fkm-warn').hide();
	    const classId  = $('#fkm-class-id').val();
	    const fieldId  = $('#fkm-name').val().trim();
	    const schemaId = $('#fkm-schema-id').val();
	    const $row     = $('#fkm-slot-type-row');

	    // Section is always editable: schema.slots entries can have a slot_group,
	    // and slot_usage may legitimately set a different slot_group than the base slot.
	    $('#fkm-slot-group').prop('disabled', false);
	    // Reset Save button; may be re-disabled below for non-expert schema slot edit.
	    $('#fkm-confirm-btn').prop('disabled', false);
	    // Reset field inputs; non-expert gates below may re-disable specific fields.
	    $('#fkm-name').prop('disabled', false);
	    $('#fkm-title').prop('disabled', false);

	    // Mark the Table label required (yellow + bold) when the effective type
	    // requires a class (slot_usage or attribute); plain when type is schema slot.
	    const isAddMode = visualRow === null;
	    const effectiveType = isAddMode
	      ? ($('#fkm-field-type').val() || 'slot_usage')
	      : initSlotType;
	    const tableRequired = effectiveType !== 'slot';
	    $('#fkm-class-id-label').css({
	      background:    tableRequired ? '#fff3cd' : '',
	      'font-weight': tableRequired ? 'bold'    : '',
	    });

	    // In Add mode the "Change type" row is never needed — hide and return early.
	    // Also show/hide the Table row: schema slots don't belong to a class.
	    if (isAddMode) {
	      $row.hide();
	      $('#fkm-copy-inherited-row').hide();
	      const $tableRow = $('#fkm-class-id').closest('tr');
	      const sid = $('#fkm-schema-id').val();
	      if (effectiveType === 'slot') {
	        $tableRow.hide();
	        $('#fkm-class-id').val(''); // clear so classId is not written on confirm
	        // Field ID: free-text input — new schema slot names are allowed.
	        $('#fkm-name-select').hide();
	        $('#fkm-name').show();
	        // Section: free-text + schema slot_group datalist.
	        // Pre-fill from context row (initSlotGroup) when available.
	        rebuildSchemaSlotGroupList(sid, initSlotGroup || null);
	        $('#fkm-slot-group').hide();
	        $('#fkm-slot-group-new').show();
	        // Warn non-expert users they cannot save a schema slot without expert mode.
	        if (!this.context.expert_user) {
	          $('#fkm-error').hide().text('');
	          $('#fkm-warn').show().html(
	            '<strong>Expert user mode is required</strong> ' + this.context.applyDhTerms(
	              'to add a {{schema slot}}. Enable it via File menu → "Toggle expert user mode".')
	          );
	          $('#fkm-name').prop('disabled', true);
	          $('#fkm-title').prop('disabled', true);
	          $('#fkm-slot-group-new').prop('disabled', true);
	          $('#fkm-confirm-btn').prop('disabled', true);
	        } else {
	          $('#fkm-error').hide().text('');
	        }
	        // "Also create derived field" row — add mode + schema slot only.
	        if (isAddMode) {
	          const hasDerivableClasses = rebuildAlsoDeriveClassDropdown(sid);
	          $('#fkm-also-derive-row').show();
	          if (!hasDerivableClasses) {
	            // No tables in this schema yet — disable checkbox and explain.
	            $('#fkm-also-derive').prop('checked', false).prop('disabled', true);
	            $('#fkm-also-derive-class').hide().val('');
	            $('#fkm-also-derive-note').show();
	            derivRowInit = true; // suppress reset-on-first-show
	          } else {
	            $('#fkm-also-derive-note').hide();
	            $('#fkm-also-derive').prop('disabled', !this.context.expert_user);
	            // On first appearance reset the checkbox; keep state on subsequent calls.
	            if (!derivRowInit) {
	              $('#fkm-also-derive').prop('checked', false);
	              $('#fkm-also-derive-class').hide().val('');
	              derivRowInit = true;
	            } else if (!$('#fkm-also-derive').is(':checked')) {
	              $('#fkm-also-derive-class').hide();
	            }
	          }
	        } else {
	          // Edit mode: "Also create derived field" is not applicable.
	          $('#fkm-also-derive-row').hide();
	          $('#fkm-also-derive').prop('checked', false);
	          $('#fkm-also-derive-class').hide().val('');
	          $('#fkm-also-derive-note').hide();
	          derivRowInit = false;
	        }
	      } else {
	        // Clear any expert-mode warning when switching to a class-level type.
	        // Hide "Also create derived field" ─ only valid for schema slot type.
	        $('#fkm-also-derive-row').hide();
	        $('#fkm-also-derive').prop('checked', false);
	        $('#fkm-also-derive-class').hide().val('');
	        $('#fkm-also-derive-note').hide();
	        derivRowInit = false;
	        $('#fkm-error').hide().text('');
	        $tableRow.show();
	        const cid = $('#fkm-class-id').val();
	        if (effectiveType === 'slot_usage') {
	          // Field ID: strict picklist — slot_usage must reference an existing schema slot.
	          // Preserve the current selection across updateSlotTypeRow calls so that
	          // side-effects (class change, etc.) do not reset what the user picked.
	          const prevSelected = $('#fkm-name-select').val();
	          rebuildFieldIdSelect(sid);
	          if (prevSelected) $('#fkm-name-select').val(prevSelected);
	          $('#fkm-name').hide();
	          $('#fkm-name-select').show();
	        } else {
	          // attribute: free-text input — attribute names are independent.
	          $('#fkm-name-select').hide();
	          $('#fkm-name').show();
	        }
	        // Section: free-text + class slot_group datalist.
	        // Pre-fill from context row (initSlotGroup) when available.
	        rebuildClassSlotGroupList(sid, cid, initSlotGroup || null);
	        $('#fkm-slot-group').hide();
	        $('#fkm-slot-group-new').show().prop('disabled', false).val(initSlotGroup || '');
	        // For slot_usage: if the selected schema slot has a title or slot_group,
	        // pre-fill those fields and lock them — the class slot inherits these values.
	        if (effectiveType === 'slot_usage' && dh.slotDefinitionIndex) {
	          const selectedSlot = $('#fkm-name-select').val() || '';
	          if (selectedSlot) {
	            const defPhysRow = dh.slotDefinitionIndex.get(`${sid}\0${selectedSlot}`);
	            if (defPhysRow !== undefined) {
	              const baseTitle     = hot.getSourceDataAtCell(defPhysRow, dh.slot_title_column);
	              const baseSlotGroup = hot.getSourceDataAtCell(defPhysRow, dh.slot_group_column);
	              if (baseTitle) {
	                $('#fkm-title').val(baseTitle).prop('disabled', true);
	              }
	              if (baseSlotGroup) {
	                $('#fkm-slot-group-new').val(baseSlotGroup).prop('disabled', true);
	              }
	            }
	          } else {
	            // No slot selected — clear any previously pre-filled title.
	            $('#fkm-title').val('');
	          }
	        }
	      }
	      return;
	    }

	    // Default for edit mode: hide "Also create derived field".
	    // The schema-slot branch below will conditionally re-show it.
	    $('#fkm-also-derive-row').hide();
	    $('#fkm-also-derive').prop('checked', false);
	    $('#fkm-also-derive-class').hide().val('');
	    $('#fkm-also-derive-note').hide();
	    derivRowInit = false;

	    // Edit mode always uses the text input for Field ID.
	    $('#fkm-name-select').hide();
	    $('#fkm-name').show();

	    // --- Edit mode below ---
	    // Schema slots (no class or initSlotType==='slot') cannot be re-typed here.
	    if (!classId || initSlotType === 'slot') {
	      $row.hide();
	      $('#fkm-copy-inherited-row').hide();
	      // Hide the Table row — schema slots are not scoped to a class.
	      $('#fkm-class-id').closest('tr').hide();
	      // Section: show free-text + datalist (same as add-mode schema slot).
	      rebuildSchemaSlotGroupList(schemaId, initSlotGroup || null);
	      $('#fkm-slot-group').hide();
	      $('#fkm-slot-group-new').show().prop('disabled', false);
	      // Info area: (a) rename-cascade count when Field ID is changing,
	      // (b) list of classes this schema slot appears in as a derived slot.
	      {
	        const infoLines = [];
	        if (visualRow !== null && initName && initSlotType === 'slot' && fieldId && fieldId !== initName) {
	          const affected = hot.getSourceData().filter(r =>
	            r[dh.slot_type_column]   === 'slot_usage' &&
	            r[dh.schema_name_column] === initSchemaId &&
	            r[dh.slot_name_column]   === initName
	          ).length;
	          if (affected > 0) {
	            infoLines.push(
	              `Note: Renaming will also update ${affected} inherited field reference${affected !== 1 ? 's' : ''}.`
	            );
	          }
	        }
	        if (fieldId) {
	          const derivedIn = [];
	          for (const r of hot.getSourceData()) {
	            if (r[dh.slot_type_column]   !== 'slot_usage') continue;
	            if (r[dh.schema_name_column] !== schemaId)     continue;
	            if (r[dh.slot_name_column]   !== fieldId)      continue;
	            const cn = r[dh.slot_class_id_column];
	            if (cn && !derivedIn.includes(cn)) derivedIn.push(cn);
	          }
	          if (derivedIn.length) {
	            infoLines.push(
	              this.context.applyDhTerms('Appears as a derived {{slot}} in: ') + derivedIn.join(', ')
	            );
	          }
	        }
	        if (infoLines.length) $('#fkm-info').show().text(infoLines.join('\n'));
	      }
	      // "Also create derived field" — show in edit mode only when no derived
	      // slot_usage already exists for this schema slot in the same schema.
	      if (fieldId) {
	        const hasDerived = hot.getSourceData().some(r =>
	          r[dh.slot_type_column]   === 'slot_usage' &&
	          r[dh.schema_name_column] === schemaId &&
	          r[dh.slot_name_column]   === fieldId
	        );
	        if (!hasDerived) {
	          const hasDerivableClasses = rebuildAlsoDeriveClassDropdown(schemaId);
	          $('#fkm-also-derive-row').show();
	          if (!hasDerivableClasses) {
	            $('#fkm-also-derive').prop('checked', false).prop('disabled', true);
	            $('#fkm-also-derive-note').show();
	            derivRowInit = true;
	          } else {
	            $('#fkm-also-derive').prop('disabled', !this.context.expert_user);
	            if (!derivRowInit) {
	              $('#fkm-also-derive').prop('checked', false);
	              derivRowInit = true;
	            } else if (!$('#fkm-also-derive').is(':checked')) {
	              $('#fkm-also-derive-class').hide();
	            }
	          }
	        }
	      }
	      // Expert gate: disable Save and all inputs — schema slot fields are
	      // read-only for non-expert users.
	      if (!this.context.expert_user) {
	        $('#fkm-confirm-btn').prop('disabled', true);
	        $('#fkm-name').prop('disabled', true);
	        $('#fkm-title').prop('disabled', true);
	        $('#fkm-slot-group-new').prop('disabled', true);
	      }
	      return;
	    }
	    if (!fieldId) {
	      $row.hide();
	      return;
	    }

	    const fieldInLibrary = dh.slotDefinitionIndex
	      ? dh.slotDefinitionIndex.has(`${schemaId}\0${fieldId}`)
	      : false;

	    // Pre-fill Title from the base slot when the field is already in the library
	    // and the user hasn't typed a title yet.
	    if (fieldInLibrary && !$('#fkm-title').val().trim() && dh.slotDefinitionIndex) {
	      const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	      if (defPhysRow !== undefined) {
	        const baseTitle = dh.hot.getSourceDataAtCell(defPhysRow, dh.slot_title_column);
	        if (baseTitle) $('#fkm-title').val(baseTitle);
	      }
	    }

	    // Reset checkbox to unchecked and configure label/availability by initSlotType.
	    $('#fkm-change-type').prop('checked', false);
	    if (initSlotType === 'slot_usage') {
	      // slot_usage → attribute: always available; Section uses select dropdown.
	      $('#fkm-slot-group-new').hide();
	      $('#fkm-slot-group').show();
	      $('#fkm-change-type').prop('disabled', false);
	      $('#fkm-change-type-label').text(this.context.applyDhTerms('change to {{attribute slot}}'));
	    } else {
	      // attribute → slot_usage: Section as free-text + datalist (allows new slot_groups).
	      // Conversion requires a matching schema slot — gate the checkbox accordingly.
	      rebuildClassSlotGroupList(schemaId, classId, initSlotGroup || null);
	      $('#fkm-slot-group').hide();
	      $('#fkm-slot-group-new').show().prop('disabled', false);
	      if (fieldInLibrary) {
	        $('#fkm-change-type').prop('disabled', false);
	        $('#fkm-change-type-label').text(
	          this.context.applyDhTerms('change to {{class slot}} (from matching {{schema slot}})')
	        );
	      } else {
	        $('#fkm-change-type').prop('disabled', true);
	        $('#fkm-change-type-label').text(
	          this.context.applyDhTerms('change to {{class slot}} — no matching {{schema slot}} found')
	        );
	      }
	    }
	    $('#fkm-copy-inherited-row').hide(); // unchecked on reset
	    $row.show();

	    // Non-expert gate: for slot_usage edit mode, disable fields that are
	    // linked to the base schema slot so they cannot be changed accidentally.
	    // Field ID is always locked (renaming propagates to the schema library).
	    // Title and Section are locked only when the slot_usage holds the same
	    // value as the base slot (i.e. it is an explicit copy of the inherited value).
	    if (!this.context.expert_user && visualRow !== null && initSlotType === 'slot_usage') {
	      $('#fkm-name').prop('disabled', true);
	      const lockedFields = ['Field ID'];
	      if (fieldInLibrary && dh.slotDefinitionIndex) {
	        const _emptyFkm  = (v) => v === null || v === undefined || v === '';
	        const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	        if (defPhysRow !== undefined) {
	          const baseTitle     = hot.getSourceDataAtCell(defPhysRow, dh.slot_title_column);
	          const baseSlotGroup = hot.getSourceDataAtCell(defPhysRow, dh.slot_group_column);
	          if (!_emptyFkm(baseTitle) && initTitle === baseTitle) {
	            $('#fkm-title').prop('disabled', true);
	            lockedFields.push('Title');
	          }
	          if (!_emptyFkm(baseSlotGroup) && initSlotGroup === baseSlotGroup) {
	            $('#fkm-slot-group').prop('disabled', true);
	            $('#fkm-slot-group-new').prop('disabled', true);
	            lockedFields.push('Section');
	          }
	        }
	      }
	      const locked = lockedFields.join(', ');
	      $('#fkm-info').show().html(
	        this.context.applyDhTerms(
	          `<strong>${locked}</strong> are read-only in normal user mode because they ` +
	          'are linked to a {{schema slot}}. Enable <strong>Expert User</strong> mode ' +
	          'via File menu to edit these fields.'
	        )
	      );
	    }
	  };

	  // ── 6. Initial population and change wiring ──────────────────────────
	  rebuildClassDropdown(initSchemaId, initClassId);
	  rebuildSlotGroupDropdown(initSchemaId, initClassId, initSlotGroup);
	  rebuildFieldIdDatalist(initSchemaId);
	  $('#fkm-name').val(initName);
	  $('#fkm-title').val(initTitle);
	  // Type dropdown: shows current type in Edit mode (read-only); in Add mode
	  // the user picks the desired type before saving.
	  $('#fkm-field-type').val(initSlotType || 'slot_usage');
	  // If the selected type option is disabled (no tables in schema), fall back
	  // to 'slot' so the dropdown is not stuck on an unselectable option.
	  if ($('#fkm-field-type option:selected').prop('disabled')) {
	    $('#fkm-field-type').val('slot');
	  }
	  $('#fkm-field-type').prop('disabled', visualRow !== null);
	  updateSlotTypeRow();

	  // Detach old handlers to avoid stacking across multiple modal opens.
	  $('#fkm-schema-id').off('change.fkm').on('change.fkm', function() {
	    const sid = $(this).val();
	    const hasClasses = rebuildClassDropdown(sid, '');
	    rebuildSlotGroupDropdown(sid, '', '');
	    rebuildFieldIdDatalist(sid);
	    rebuildFieldIdSelect(sid);
	    // If the schema has no tables, the table-field type options are now
	    // disabled; reset to 'slot' so the dropdown isn't on a disabled option.
	    if (!hasClasses && ['slot_usage', 'attribute'].includes($('#fkm-field-type').val())) {
	      $('#fkm-field-type').val('slot');
	    }
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
	  $('#fkm-name').off('input.fkm').on('input.fkm', () => updateSlotTypeRow());
	  $('#fkm-name-select').off('change.fkm').on('change.fkm', () => updateSlotTypeRow());
	  $('#fkm-field-type').off('change.fkm').on('change.fkm', () => updateSlotTypeRow());
	  $('#fkm-also-derive').off('change.fkm').on('change.fkm', () => {
	    if ($('#fkm-also-derive').is(':checked')) {
	      rebuildAlsoDeriveClassDropdown($('#fkm-schema-id').val());
	      $('#fkm-also-derive-class').show();
	    } else {
	      $('#fkm-also-derive-class').hide().val('');
	    }
	  });
	  $('#fkm-change-type').off('change.fkm').on('change.fkm', () => {
	    // Show "Copy schema-inherited field attributes" only when switching slot_usage → attribute.
	    const classId = $('#fkm-class-id').val();
	    const isChecked = $('#fkm-change-type').is(':checked');
	    const converting = isChecked && initSlotType === 'slot_usage';
	    const showCopyRow = converting && !!classId;
	    $('#fkm-copy-inherited-row').toggle(showCopyRow);
	    // When a non-expert user converts slot_usage → attribute, unlock Title and
	    // Section so they can be set for the new custom field.  Field ID stays
	    // locked — to rename, delete this field and create a new custom field instead.
	    if (!this.context.expert_user && initSlotType === 'slot_usage') {
	      if (converting) {
	        $('#fkm-title').prop('disabled', false);
	        $('#fkm-slot-group').prop('disabled', false);
	        $('#fkm-slot-group-new').prop('disabled', false);
	        $('#fkm-info').show().html(
	          this.context.applyDhTerms(
	            '<strong>Field ID</strong> is read-only. '
	            + 'Title and Section are editable for the new {{attribute slot}}.'
	          )
	        );
	      } else {
	        // Checkbox unchecked — restore the slot_usage non-expert gate.
	        updateSlotTypeRow();
	      }
	    } else if (initSlotType === 'attribute') {
	      // attribute → slot_usage: adjust Section control and detect conflicting values.
	      if (isChecked) {
	        const fieldId2  = $('#fkm-name').val().trim();
	        const schemaId2 = $('#fkm-schema-id').val();
	        const classId2  = $('#fkm-class-id').val();
	        const inLib = dh.slotDefinitionIndex?.has(`${schemaId2}\0${fieldId2}`) ?? false;
	        let baseSlotGroup = '';
	        if (inLib && dh.slotDefinitionIndex) {
	          const defPhysRow2 = dh.slotDefinitionIndex.get(`${schemaId2}\0${fieldId2}`);
	          if (defPhysRow2 !== undefined) {
	            baseSlotGroup = hot.getSourceDataAtCell(defPhysRow2, dh.slot_group_column) || '';
	            const _emptyC = (v) => v === null || v === undefined || v === '';
	            const SKIP_C = new Set([
	              dh.schema_name_column, dh.slot_class_id_column,
	              dh.slot_type_column,   dh.slot_name_column,
	              dh.slot_name_to_column?.['rank'],
	            ]);
	            // Build reverse map: column index → slot field name.
	            const colToName = {};
	            for (const [sn, ci] of Object.entries(dh.slot_name_to_column || {})) {
	              colToName[ci] = sn;
	            }
	            // physRow is block-scoped above; derive it here from the closure's visualRow.
	            const editPhysRow2 = hot.toPhysicalRow(visualRow);
	            const conflicting = [];
	            for (let col = 0; col < hot.countCols(); col++) {
	              if (SKIP_C.has(col)) continue;
	              const attrVal = hot.getSourceDataAtCell(editPhysRow2, col);
	              const baseVal = hot.getSourceDataAtCell(defPhysRow2, col);
	              if (!_emptyC(attrVal) && !_emptyC(baseVal) && String(attrVal) !== String(baseVal)) {
	                conflicting.push(colToName[col] || `col_${col}`);
	              }
	            }
	            if (conflicting.length) {
	              $('#fkm-warn').show().html(
	                '<strong>Warning:</strong> The following parameter(s) will be reset to '
	                + 'inherited values when saved: '
	                + conflicting.map(n => `<em>${n}</em>`).join(', ') + '.'
	              );
	            } else {
	              $('#fkm-warn').hide();
	            }
	          }
	        }
	        // Section: switch from the attribute free-text input to the slot_usage SELECT.
	        // If the base schema slot defines a slot_group it will be inherited on save
	        // (copy-base-values overwrites it), so lock the SELECT to that single value.
	        // If the base slot has no slot_group, let the user pick from class sections.
	        $('#fkm-slot-group-new').hide();
	        if (baseSlotGroup) {
	          const $sg = $('#fkm-slot-group').empty();
	          $sg.append($('<option>').val(baseSlotGroup).text(baseSlotGroup));
	          $sg.val(baseSlotGroup).prop('disabled', true).show();
	        } else {
	          rebuildSlotGroupDropdown(schemaId2, classId2, initSlotGroup);
	          $('#fkm-slot-group').prop('disabled', false).show();
	        }
	      } else {
	        // Checkbox unchecked — restore the attribute free-text Section and clear warning.
	        const schemaId2 = $('#fkm-schema-id').val();
	        const classId2  = $('#fkm-class-id').val();
	        rebuildClassSlotGroupList(schemaId2, classId2, initSlotGroup || null);
	        $('#fkm-slot-group').hide().prop('disabled', false);
	        $('#fkm-slot-group-new').show().prop('disabled', false).val(initSlotGroup || '');
	        $('#fkm-warn').hide();
	      }
	    }
	  });

	  // ── 7. Open the modal ─────────────────────────────────────────────────
	  const $modal = $('#field-key-modal');
	  $('#field-key-modal-title').text(
	    visualRow !== null
	      ? this.context.applyDhTerms('Edit {{Slot}}') + (initName ? ': ' + initName : '')
	      : this.context.applyDhTerms('Add {{Slot}}')
	  );
	  $('#fkm-field-id-label').text(this.context.applyDhTerms('{{Slot name}}'));
	  // Header description — the "Required" badge is kept as HTML; the SR text follows.
	  $('#fkm-header-desc').html(
	    '<span style="background:#fff3cd;color:#333;padding:1px 4px">Required</span> ' +
	    'fields are highlighted.'
	  );
	  // Type dropdown option labels — update to match active terminology.
	  // All three options are always visible; expert mode is enforced at save time.
	  $('#fkm-field-type option[value="slot"]').text(this.context.applyDhTerms('{{schema slot}}')).prop('disabled', false).css('display', '');
	  $('#fkm-field-type option[value="slot_usage"]').text(this.context.applyDhTerms('{{class slot}}'));
	  $('#fkm-field-type option[value="attribute"]').text(this.context.applyDhTerms('{{class attribute}}'));
	  $('#fkm-schema-id-desc').text(this.context.applyDhTerms('The schema this {{slot}} belongs to.'));
	  $('#fkm-class-id-label').text(this.context.applyDhTerms('{{Class}}'));
	  $('#fkm-slot-group-label').text(this.context.applyDhTerms('{{Section}}'));
	  $('#fkm-also-derive-label').text(this.context.applyDhTerms('Also create {{class slot}} in'));
	  $('#fkm-slot-group-desc').text(this.context.applyDhTerms(
	    'Optional display {{slot group}} for this {{slot}}.'
	  ));
	  $('#fkm-class-id-desc').text(
	    this.context.applyDhTerms('Select a {{class}} that {{slot}} will appear in.')
	  );
	  $('#fkm-field-type-desc').html([
	    this.context.applyDhTerms('{{schema slot}}: located in the {{schema slots}} list.'),
	    this.context.applyDhTerms('{{class slot}}: located in a {{class}} field list, derived from a {{schema slot}}.'),
	    this.context.applyDhTerms('{{class attribute}}: a {{slot}} in a {{class\'s}} custom field list, not connected to a {{schema slot}}.'),
	  ].map(s => '- ' + s).join('<br>'));
	  // Re-apply expert warning if the dialog opens for a schema slot as a non-expert.
	  // updateSlotTypeRow() set it earlier but the label/desc init above clears it
	  // for add mode when initSlotType is '' (e.g. type auto-falls-back to 'slot'
	  // because the schema has no classes yet).
	  const _openAsSlot = initSlotType === 'slot' ||
	    (visualRow === null && $('#fkm-field-type').val() === 'slot');
	  if (_openAsSlot && !this.context.expert_user) {
	    $('#fkm-error').hide().text('');
	    $('#fkm-warn').show().html(
	      '<strong>Expert user mode is required</strong> ' + this.context.applyDhTerms(
	        visualRow !== null
	          ? 'to edit a {{schema slot}}. Enable it via File menu → "Toggle expert user mode".'
	          : 'to add a {{schema slot}}. Enable it via File menu → "Toggle expert user mode".'
	      )
	    );
	  } else {
	    $('#fkm-warn').hide();
	    $('#fkm-error').hide().text('');
	  }
	  // Scrolls vRow to the vertical centre of the HOT viewport (best-effort).
	  const scrollToCenter = (h, vRow) => {
	    const wrapper = h.rootElement?.querySelector('.wtHolder');
	    const rowH    = (wrapper && h.getRowHeight(vRow)) || 23;
	    const halfVis = wrapper ? Math.floor(wrapper.clientHeight / rowH / 2) : 8;
	    h.scrollViewportTo(Math.max(0, vRow - halfVis), 0);
	  };
	  // Physical row to select+scroll to after modal closes; set in confirm handler.
	  // Using physical (not visual) row means it survives any re-sort done during
	  // the confirm handler before the modal hides.
	  let _pendingSelectPhys = null;
	  // After modal fully closes: clear stale insertion context, then select and
	  // scroll to the new/edited field so the user can see where it landed.
	  $modal.off('hidden.bs.modal.fkm').one('hidden.bs.modal.fkm', () => {
	    dh._insertCtx = null;
	    if (_pendingSelectPhys !== null) {
	      const vr = hot.toVisualRow(_pendingSelectPhys);
	      if (vr !== null && vr !== -1) {
	        hot.selectCell(vr, 0);
	        scrollToCenter(hot, vr);
	      }
	      _pendingSelectPhys = null;
	    }
	  });
	  $modal.modal('show');

	  // ── 8. Confirm handler ───────────────────────────────────────────────
	  $('#fkm-confirm-btn').off('click.fkm').on('click.fkm', () => {
	    // Consume the right-click insertion context immediately (prevents stale reuse).
	    const _insertCtx = dh._insertCtx ?? null;
	    dh._insertCtx    = null;
	    const schemaId  = $('#fkm-schema-id').val();
	    const classId   = $('#fkm-class-id').val();
	    const fieldId   = $('#fkm-name-select').is(':visible')
	      ? ($('#fkm-name-select').val() || '')
	      : $('#fkm-name').val().trim();
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
	    // Add mode: use the Type dropdown (#fkm-field-type).
	    // Edit mode: if the "change type" checkbox is checked, flip between
	    // slot_usage ↔ attribute; otherwise keep the original initSlotType.
	    const slot_type = (visualRow === null)
	      ? ($('#fkm-field-type').val() || 'slot_usage')
	      : (classId
	          ? ($('#fkm-change-type').is(':checked')
	              ? (initSlotType === 'slot_usage' ? 'attribute' : 'slot_usage')
	              : initSlotType)
	          : 'slot');

	    const fieldInLibrary = dh.slotDefinitionIndex
	      ? dh.slotDefinitionIndex.has(`${schemaId}\0${fieldId}`)
	      : false;

	    // Read slot_group from whichever input is currently visible.
	    // Add mode (schema or class slot) uses #fkm-slot-group-new (text+datalist).
	    // Edit mode class slots use #fkm-slot-group (select).
	    const slotGroup = $('#fkm-slot-group-new').is(':visible')
	      ? $('#fkm-slot-group-new').val().trim()
	      : ($('#fkm-slot-group').val() || '');

	    // Schema slot creation requires expert user mode.
	    if (slot_type === 'slot' && visualRow === null && !this.context.expert_user) {
	      $('#fkm-error').hide().text('');
	      $('#fkm-warn').show().html(
	        '<strong>Expert user mode is required</strong> ' + this.context.applyDhTerms(
	          'to add a {{schema slot}}. Enable it via File menu → "Toggle expert user mode".')
	      );
	      return;
	    }

	    // Table (class) is required for slot_usage and attribute in add mode.
	    if (visualRow === null && slot_type !== 'slot' && !classId) {
	      $('#fkm-error').show().text(
	        this.context.applyDhTerms('A {{class}} must be selected for this field type.')
	      );
	      return;
	    }

	    // When adding a new schema-level slot (type = slot), the Field ID must not
	    // already exist in this schema's slot library.
	    if (slot_type === 'slot' && visualRow === null && fieldInLibrary) {
	      $('#fkm-error').show().text(`Field ID "${fieldId}" already exists as a schema field in this schema. Choose a different name.`);
	      return;
	    }

	    // When "Also create derived field" is checked a table must be chosen,
	    // and the derived slot_usage must not already exist in that table.
	    if (slot_type === 'slot' && $('#fkm-also-derive').is(':checked')) {
	      const deriveClassId = $('#fkm-also-derive-class').val();
	      if (!deriveClassId) {
	        $('#fkm-error').show().text('Select a table for the derived field.');
	        return;
	      }
	      const srcDataPre = hot.getSourceData();
	      const dupDerived = srcDataPre.some(r =>
	        r[dh.slot_type_column]     === 'slot_usage' &&
	        r[dh.schema_name_column]   === schemaId     &&
	        r[dh.slot_class_id_column] === deriveClassId &&
	        r[dh.slot_name_column]     === fieldId
	      );
	      if (dupDerived) {
	        $('#fkm-error').show().text(`A derived field "${fieldId}" already exists in table "${deriveClassId}".`);
	        return;
	      }
	    }

	    // When adding a slot_usage row, the Field ID must already exist as a schema
	    // slot — slot_usage inherits from a base schema slot by definition.
	    // If the base slot is missing, block and guide the user.
	    if (slot_type === 'slot_usage' && visualRow === null && !fieldInLibrary) {
	      const expertHint = this.context.expert_user
	        ? this.context.applyDhTerms('Switch the Type to "{{schema slot}}" to create it first, then add this {{class slot}} afterwards.')
	        : this.context.applyDhTerms('Enable expert user mode (File menu) to create the {{schema slot}} first, or choose "{{class attribute}}" type instead — it does not require a {{schema slot}}.');
	      $('#fkm-error').show().text(
	        this.context.applyDhTerms(`Field ID "${fieldId}" does not exist as a {{schema slot}} in this {{schema}}. `) + expertHint
	      );
	      return;
	    }

	    // When adding a slot_usage row (type = slot_usage), the Field ID + Class
	    // combination must not already exist in this schema.
	    if (slot_type === 'slot_usage' && visualRow === null && classId) {
	      const srcData = hot.getSourceData();
	      const duplicate = srcData.some(r =>
	        r[dh.slot_type_column]     === 'slot_usage' &&
	        r[dh.schema_name_column]   === schemaId    &&
	        r[dh.slot_class_id_column] === classId     &&
	        r[dh.slot_name_column]     === fieldId
	      );
	      if (duplicate) {
	        $('#fkm-error').show().text(`Field "${fieldId}" already exists in table "${classId}". Choose a different Field ID or table.`);
	        return;
	      }
	    }
	    // When adding a class attribute (type = attribute), the Field ID + Class
	    // combination must not already exist among this class's attributes.
	    if (slot_type === 'attribute' && visualRow === null && classId) {
	      const srcData = hot.getSourceData();
	      const duplicate = srcData.some(r =>
	        r[dh.slot_type_column]     === 'attribute' &&
	        r[dh.schema_name_column]   === schemaId    &&
	        r[dh.slot_class_id_column] === classId     &&
	        r[dh.slot_name_column]     === fieldId
	      );
	      if (duplicate) {
	        $('#fkm-error').show().text(`Field "${fieldId}" already exists as a custom field in table "${classId}". Choose a different Field ID.`);
	        return;
	      }
	    }

	    // Edit mode: when the Field ID is being renamed, check for collisions
	    // in the same scope (schema slots, class slot_usage, or class attributes).
	    if (visualRow !== null && fieldId !== initName) {
	      const editPhysRow = hot.toPhysicalRow(visualRow);
	      const srcData     = hot.getSourceData();
	      let collisionMsg  = null;

	      if (slot_type === 'slot') {
	        // fieldId !== initName so any hit in the index is a different slot.
	        if (dh.slotDefinitionIndex && dh.slotDefinitionIndex.has(`${schemaId}\0${fieldId}`))
	          collisionMsg = `Field ID "${fieldId}" already exists as a schema field in this schema.`;
	      } else {
	        // slot_usage or attribute: must not duplicate within the same class.
	        const duplicate = srcData.some((r, physIdx) =>
	          physIdx !== editPhysRow                    &&
	          r[dh.slot_type_column]     === slot_type  &&
	          r[dh.schema_name_column]   === schemaId   &&
	          r[dh.slot_class_id_column] === classId    &&
	          r[dh.slot_name_column]     === fieldId
	        );
	        if (duplicate) {
	          const scope = slot_type === 'slot_usage' ? 'table field' : 'custom field';
	          collisionMsg = `Field "${fieldId}" already exists as a ${scope} in table "${classId}".`;
	        }
	      }

	      if (collisionMsg) {
	        $('#fkm-error').show().text(collisionMsg);
	        return;
	      }
	    }

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
	      cells.push([row, dh.slot_group_column, slotGroup]); // always write — empty clears existing value
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
	      if (slot_type === 'slot') {
	        // Rank-aware insertion for schema-level slots.
	        // Find all existing schema slots for this schema, sorted by rank.
	        const srcData   = hot.getSourceData();
	        const rankCol   = dh.slot_rank_column;
	        const schemaSlots = [];
	        for (let physIdx = 0; physIdx < srcData.length; physIdx++) {
	          const r = srcData[physIdx];
	          if (r[dh.slot_type_column] !== 'slot')     continue;
	          if (r[dh.schema_name_column] !== schemaId) continue;
	          const rank = typeof r[rankCol] === 'number' ? r[rankCol] : Infinity;
	          schemaSlots.push({
	            physIdx,
	            rank,
	            slot_group: r[dh.slot_group_column] || '',
	            title: (r[dh.slot_title_column] || r[dh.slot_name_column] || '').toLowerCase(),
	          });
	        }
	        schemaSlots.sort((a, b) =>
	          a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank
	        );

	        const maxRank = schemaSlots.reduce(
	          (m, s) => (Number.isFinite(s.rank) ? Math.max(m, s.rank) : m), 0
	        );
	        let newRank;

	        if (slotGroup) {
	          const groupSlots = schemaSlots.filter(s => s.slot_group === slotGroup);
	          // If triggered by right-click insert and the saved section matches the
	          // context row's section, honour the specific rank position.
	          let _usedCtx = false;
	          if (_insertCtx && _insertCtx.preFillRow !== null) {
	            const _ctxPhys = hot.toPhysicalRow(_insertCtx.preFillRow);
	            if (_ctxPhys !== null) {
	              const _ctxGroup  = hot.getSourceDataAtCell(_ctxPhys, dh.slot_group_column)  || '';
	              const _ctxSchema = hot.getSourceDataAtCell(_ctxPhys, dh.schema_name_column) || '';
	              if (_ctxGroup === slotGroup && _ctxSchema === schemaId) {
	                if (_insertCtx.isAboveFirst) {
	                  const _fr = groupSlots.length > 0 ? groupSlots[0].rank : maxRank + 1;
	                  newRank = Number.isFinite(_fr) ? _fr : maxRank + 1;
	                } else {
	                  const _ce = schemaSlots.find(s => s.physIdx === _ctxPhys);
	                  newRank = _ce && Number.isFinite(_ce.rank)
	                    ? _ce.rank + 1
	                    : (groupSlots.length > 0 ? groupSlots[groupSlots.length - 1].rank + 1 : maxRank + 1);
	                }
	                _usedCtx = true;
	              }
	            }
	          }
	          if (!_usedCtx) {
	            newRank = groupSlots.length > 0
	              ? groupSlots[groupSlots.length - 1].rank + 1
	              : maxRank + 1; // new slot_group → append at end
	          }
	        } else {
	          // No slot_group: insert alphabetically by title among ungrouped slots.
	          const ungrouped  = schemaSlots.filter(s => !s.slot_group);
	          const newTitle   = (title || fieldId).toLowerCase();
	          const before     = ungrouped.find(s => s.title > newTitle);
	          if (before) {
	            newRank = before.rank; // will shift this and later slots up
	          } else if (ungrouped.length > 0) {
	            newRank = ungrouped[ungrouped.length - 1].rank + 1;
	          } else {
	            newRank = maxRank + 1; // no ungrouped slots — append
	          }
	        }

	        // Shift all schema slots whose rank >= newRank up by 1.
	        const rankShifts = [];
	        for (const s of schemaSlots) {
	          if (Number.isFinite(s.rank) && s.rank >= newRank) {
	            const vRow = hot.toVisualRow(s.physIdx);
	            if (vRow !== null && vRow !== -1)
	              rankShifts.push([vRow, rankCol, s.rank + 1]);
	          }
	        }
	        if (rankShifts.length) hot.setDataAtCell(rankShifts, 'field_key_modal');

	        // Append the new slot row and write its key cells plus rank.
	        const targetRow = appendOne('field_key_modal');
	        const cells     = buildCells(targetRow);
	        cells.push([targetRow, rankCol, newRank]);
	        hot.setDataAtCell(cells, 'field_key_modal');

	        // ── Also create derived field (slot_usage) ──────────────────────────────────
	        // Insert the derived slot_usage before sorting so a single sort
	        // positions both the schema slot and the derived row correctly.
	        let _physD = null;
	        if ($('#fkm-also-derive').is(':checked')) {
	          const deriveClassId = $('#fkm-also-derive-class').val();
	          if (deriveClassId) {
	            const rankColD    = dh.slot_rank_column;
	            const srcDataD    = hot.getSourceData();
	            const classSlotsD = [];
	            for (let pi = 0; pi < srcDataD.length; pi++) {
	              const rd = srcDataD[pi];
	              const td = rd[dh.slot_type_column];
	              if (td !== 'slot_usage' && td !== 'attribute') continue;
	              if (rd[dh.schema_name_column]   !== schemaId)      continue;
	              if (rd[dh.slot_class_id_column] !== deriveClassId) continue;
	              const rankD = typeof rd[rankColD] === 'number' ? rd[rankColD] : Infinity;
	              classSlotsD.push({ physIdx: pi, rank: rankD, slot_group: rd[dh.slot_group_column] || '' });
	            }
	            classSlotsD.sort((a, b) => a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank);
	            const maxRankD  = classSlotsD.reduce((m, s) => Number.isFinite(s.rank) ? Math.max(m, s.rank) : m, 0);
	            let newRankD;
	            if (slotGroup) {
	              const grpD = classSlotsD.filter(s => s.slot_group === slotGroup);
	              newRankD = grpD.length > 0 ? grpD[grpD.length - 1].rank + 1 : maxRankD + 1;
	            } else {
	              const ungroupedD = classSlotsD.filter(s => !s.slot_group);
	              newRankD = ungroupedD.length > 0 ? ungroupedD[ungroupedD.length - 1].rank + 1 : maxRankD + 1;
	            }
	            // Shift existing class slots with rank >= newRankD.
	            const shiftD = [];
	            for (const s of classSlotsD) {
	              if (Number.isFinite(s.rank) && s.rank >= newRankD) {
	                const vrd = hot.toVisualRow(s.physIdx);
	                if (vrd !== null && vrd !== -1) shiftD.push([vrd, rankColD, s.rank + 1]);
	              }
	            }
	            if (shiftD.length) hot.setDataAtCell(shiftD, 'field_key_modal');
	            // Append the derived slot_usage row (title omitted ─ inherits from base slot).
	            const deriveRow = appendOne('field_key_modal');
	            _physD = hot.toPhysicalRow(deriveRow);
	            hot.setDataAtCell([
	              [deriveRow, dh.slot_type_column,     'slot_usage'],
	              [deriveRow, dh.schema_name_column,   schemaId],
	              [deriveRow, dh.slot_name_column,     fieldId],
	              [deriveRow, dh.slot_class_id_column, deriveClassId],
	              [deriveRow, dh.slot_group_column,    slotGroup],
	              [deriveRow, rankColD,                newRankD],
	            ], 'field_key_modal');
	          }
	        }

	        // Re-sort so all new rows move to their rank-ordered positions.
	        const _physA = hot.toPhysicalRow(targetRow);
	        const _sortA = hot.getPlugin('multiColumnSorting');
	        if (_sortA) {
	          const _cfgA = _sortA.getSortConfig();
	          _sortA.sort(_cfgA.length ? _cfgA : dh.defaultMultiColumnSortConfig);
	        } else { hot.render(); }
	        // Select the derived field if one was created, otherwise the schema slot.
	        // Selection fires after the modal closes (see hidden.bs.modal.fkm handler).
	        _pendingSelectPhys = _physD ?? _physA;

	      } else {
	        // Rank-aware insertion for class-level slots (slot_usage / attribute).
	        // Collect ALL existing class slots (both slot_usage and attribute) because
	        // they share the same rank space within a class.  Collecting only the new
	        // slot's type would miss the other type's ranks, causing rank conflicts and
	        // placing the new row in the wrong section after re-sort.
	        const rankCol    = dh.slot_rank_column;
	        const srcData2   = hot.getSourceData();
	        const classSlots = [];
	        for (let physIdx = 0; physIdx < srcData2.length; physIdx++) {
	          const r  = srcData2[physIdx];
	          const t2 = r[dh.slot_type_column];
	          if (t2 !== 'slot_usage' && t2 !== 'attribute') continue;
	          if (r[dh.schema_name_column]   !== schemaId)   continue;
	          if (r[dh.slot_class_id_column] !== classId)    continue;
	          const rank = typeof r[rankCol] === 'number' ? r[rankCol] : Infinity;
	          classSlots.push({
	            physIdx,
	            rank,
	            slot_group: r[dh.slot_group_column] || '',
	            title: (r[dh.slot_title_column] || r[dh.slot_name_column] || '').toLowerCase(),
	          });
	        }
	        classSlots.sort((a, b) =>
	          a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank
	        );

	        const maxRankC = classSlots.reduce(
	          (m, s) => (Number.isFinite(s.rank) ? Math.max(m, s.rank) : m), 0
	        );
	        let newRankC;

	        if (slotGroup) {
	          const groupSlots = classSlots.filter(s => s.slot_group === slotGroup);
	          // If triggered by right-click insert and the saved section matches the
	          // context row's section and class, honour the specific rank position.
	          let _usedCtxC = false;
	          if (_insertCtx && _insertCtx.preFillRow !== null) {
	            const _ctxPhys = hot.toPhysicalRow(_insertCtx.preFillRow);
	            if (_ctxPhys !== null) {
	              const _ctxGroup   = hot.getSourceDataAtCell(_ctxPhys, dh.slot_group_column)    || '';
	              const _ctxSchema  = hot.getSourceDataAtCell(_ctxPhys, dh.schema_name_column)   || '';
	              const _ctxClassId = hot.getSourceDataAtCell(_ctxPhys, dh.slot_class_id_column) || '';
	              if (_ctxGroup === slotGroup && _ctxSchema === schemaId && _ctxClassId === classId) {
	                if (_insertCtx.isAboveFirst) {
	                  const _fr = groupSlots.length > 0 ? groupSlots[0].rank : maxRankC + 1;
	                  newRankC = Number.isFinite(_fr) ? _fr : maxRankC + 1;
	                } else {
	                  const _ce = classSlots.find(s => s.physIdx === _ctxPhys);
	                  newRankC = _ce && Number.isFinite(_ce.rank)
	                    ? _ce.rank + 1
	                    : (groupSlots.length > 0 ? groupSlots[groupSlots.length - 1].rank + 1 : maxRankC + 1);
	                }
	                _usedCtxC = true;
	              }
	            }
	          }
	          if (!_usedCtxC) {
	            newRankC = groupSlots.length > 0
	              ? groupSlots[groupSlots.length - 1].rank + 1
	              : maxRankC + 1; // new slot_group → append at end
	          }
	        } else {
	          // No slot_group: insert alphabetically by title among ungrouped slots.
	          const ungroupedC = classSlots.filter(s => !s.slot_group);
	          const newTitleC  = (title || fieldId).toLowerCase();
	          const beforeC    = ungroupedC.find(s => s.title > newTitleC);
	          if (beforeC) {
	            newRankC = beforeC.rank;
	          } else if (ungroupedC.length > 0) {
	            newRankC = ungroupedC[ungroupedC.length - 1].rank + 1;
	          } else {
	            newRankC = maxRankC + 1;
	          }
	        }

	        // Shift all class slots whose rank >= newRankC up by 1.
	        const rankShiftsC = [];
	        for (const s of classSlots) {
	          if (Number.isFinite(s.rank) && s.rank >= newRankC) {
	            const vRow = hot.toVisualRow(s.physIdx);
	            if (vRow !== null && vRow !== -1)
	              rankShiftsC.push([vRow, rankCol, s.rank + 1]);
	          }
	        }
	        if (rankShiftsC.length) hot.setDataAtCell(rankShiftsC, 'field_key_modal');

	        // Case C: slot_usage for a field not yet in the library →
	        // auto-insert a base schema slot row first, then the slot_usage row.
	        if (slot_type === 'slot_usage' && !fieldInLibrary) {
	          const baseRow = appendOne('field_key_modal');
	          const baseCells = [
	            [baseRow, dh.slot_type_column,   'slot'],
	            [baseRow, dh.schema_name_column, schemaId],
	            [baseRow, dh.slot_name_column,   fieldId],
	          ];
	          // Copy title to the base slot so the slot_usage row inherits it.
	          if (title) baseCells.push([baseRow, dh.slot_title_column, title]);
	          hot.setDataAtCell(baseCells, 'field_key_modal');
	        }

	        const targetRow = appendOne('field_key_modal');
	        // Capture physical row now; visual index will change after re-sort.
	        const _physB    = hot.toPhysicalRow(targetRow);
	        // Omit title from the slot_usage row when it was written to the base
	        // slot above — the slot_usage will inherit it (shown as 'inherited').
	        const omitTitle = slot_type === 'slot_usage' && !fieldInLibrary;
	        const cells2    = buildCells(targetRow, omitTitle);
	        cells2.push([targetRow, rankCol, newRankC]);
	        hot.setDataAtCell(cells2, 'field_key_modal');

	        // When adding a slot_usage for a field already in the library, copy all
	        // inherited attribute values from the base slot into the new row.
	        // Columns specific to a particular class (rank, slot_group) are skipped.
	        if (slot_type === 'slot_usage' && fieldInLibrary && dh.slotDefinitionIndex) {
	          const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	          if (defPhysRow !== undefined) {
	            const _empty = (v) => v === null || v === undefined || v === '';
	            const SKIP_COLS = new Set([
	              dh.schema_name_column,
	              dh.slot_class_id_column,
	              dh.slot_type_column,
	              dh.slot_name_column,
	              dh.slot_group_column,
	              dh.slot_name_to_column['rank'],
	            ]);
	            const newPhysRow = hot.toPhysicalRow(targetRow);
	            const toCopy = [];
	            for (let col = 0; col < hot.countCols(); col++) {
	              if (SKIP_COLS.has(col)) continue;
	              if (!_empty(hot.getSourceDataAtCell(newPhysRow, col))) continue;
	              const baseVal = hot.getSourceDataAtCell(defPhysRow, col);
	              if (!_empty(baseVal)) toCopy.push([targetRow, col, baseVal]);
	            }
	            if (toCopy.length) hot.setDataAtCell(toCopy, 'field_key_modal');
	          }
	        }

	        // Re-sort so the new field moves to its rank-ordered position within the section.
	        const _sortB = hot.getPlugin('multiColumnSorting');
	        if (_sortB) {
	          const _cfgB = _sortB.getSortConfig();
	          _sortB.sort(_cfgB.length ? _cfgB : dh.defaultMultiColumnSortConfig);
	        } else { hot.render(); }
	        // Select the new row after the modal closes.
	        _pendingSelectPhys = _physB;
	      } // end else (slot_usage / attribute add mode)
	    } else {
	      // Editing an existing row.
	      const physRow = hot.toPhysicalRow(visualRow);
	      // Schedule scroll+select to fire after modal closes (survives any re-sort).
	      _pendingSelectPhys = physRow;

	      if (slot_type === 'slot') {
	        // Schema slot edit: expert gate + cascade name/slot_group to slot_usage rows.
	        if (!this.context.expert_user) {
	          $('#fkm-error').hide().text('');
	          $('#fkm-warn').show().html(
	            '<strong>Expert user mode is required</strong> ' + this.context.applyDhTerms(
	              'to edit a {{schema slot}}. Enable it via File menu → "Toggle expert user mode".')
	          );
	          return;
	        }
	        hot.setDataAtCell(buildCells(visualRow), 'field_key_modal');
	        // Cascade name and/or slot_group to every slot_usage row for this slot.
	        const nameChanged  = fieldId   !== initName;
	        const groupChanged = slotGroup !== initSlotGroup;
	        if (nameChanged || groupChanged) {
	          const cascadeCells = [];
	          const srcData = hot.getSourceData();
	          for (let physIdx = 0; physIdx < srcData.length; physIdx++) {
	            const r = srcData[physIdx];
	            if (r[dh.slot_type_column]   !== 'slot_usage') continue;
	            if (r[dh.schema_name_column] !== schemaId)     continue;
	            if (r[dh.slot_name_column]   !== initName)     continue;
	            const vRow = hot.toVisualRow(physIdx);
	            if (vRow === null || vRow === -1) continue;
	            if (nameChanged)  cascadeCells.push([vRow, dh.slot_name_column,  fieldId]);
	            if (groupChanged) cascadeCells.push([vRow, dh.slot_group_column, slotGroup]);
	          }
	          if (cascadeCells.length) hot.setDataAtCell(cascadeCells, 'field_key_modal');
	        }

	        // Re-rank: when slot_group changes, reposition this schema slot to the end
	        // of the target section and reassign sequential ranks to all schema slots.
	        if (groupChanged) {
	          const rankColS = dh.slot_rank_column;
	          const srcDataS = hot.getSourceData();

	          // Collect all schema slots for this schema.
	          const allSchemaSlots = [];
	          for (let pi = 0; pi < srcDataS.length; pi++) {
	            const r = srcDataS[pi];
	            if (r[dh.slot_type_column]   !== 'slot')   continue;
	            if (r[dh.schema_name_column] !== schemaId) continue;
	            const rank = typeof r[rankColS] === 'number' ? r[rankColS] : Infinity;
	            allSchemaSlots.push({ pi, rank, slot_group: r[dh.slot_group_column] || '' });
	          }

	          // Sort by current rank (unranked rows sort to end).
	          allSchemaSlots.sort((a, b) =>
	            a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank
	          );

	          // Remove the edited slot; find insertion point after last slot in target group.
	          const withoutEditedS = allSchemaSlots.filter(s => s.pi !== physRow);
	          let insertIdxS = withoutEditedS.length; // default: append at end
	          for (let i = withoutEditedS.length - 1; i >= 0; i--) {
	            if (withoutEditedS[i].slot_group === slotGroup) { insertIdxS = i + 1; break; }
	          }

	          // Rebuild ordered list with edited slot at its new position.
	          const newOrderS = [
	            ...withoutEditedS.slice(0, insertIdxS),
	            { pi: physRow },
	            ...withoutEditedS.slice(insertIdxS),
	          ];

	          // Assign sequential ranks (1-based) to every schema slot.
	          const rankCellsS = [];
	          for (let i = 0; i < newOrderS.length; i++) {
	            const { pi } = newOrderS[i];
	            const vr = pi === physRow ? visualRow : hot.toVisualRow(pi);
	            if (vr !== null && vr !== -1) rankCellsS.push([vr, rankColS, i + 1]);
	          }
	          if (rankCellsS.length) hot.setDataAtCell(rankCellsS, 'field_key_modal');
	          // Re-sort so rows move to their new rank positions, then navigate to the slot.
	          const sortPluginS = hot.getPlugin('multiColumnSorting');
	          if (sortPluginS) {
	            const curCfgS = sortPluginS.getSortConfig();
	            sortPluginS.sort(curCfgS.length ? curCfgS : dh.defaultMultiColumnSortConfig);
	          } else {
	            hot.render();
	          }
	        }
	      } else {
	        // Class slot (slot_usage / attribute) edit.

	        // Attribute → slot_usage: a matching schema slot must already exist.
	        if (initSlotType === 'attribute' && slot_type === 'slot_usage' && !fieldInLibrary) {
	          $('#fkm-error').show().text(
	            this.context.applyDhTerms(
	              `Field ID "${fieldId}" has no matching {{schema slot}} in this {{schema}}. ` +
	              'Create a {{schema slot}} with this name first (expert user mode required), then convert this field.'
	            )
	          );
	          return;
	        }

	        // Expert gate: block non-expert users from renaming a slot_usage Field ID
	        // — renaming propagates to the schema library and requires expert mode.
	        if (!this.context.expert_user && slot_type === 'slot_usage' && fieldId !== initName) {
	          $('#fkm-error').show().text(
	            this.context.applyDhTerms(
	              'Expert user mode is required to rename a linked {{schema slot}}. ' +
	              'Enable it via File menu → “Toggle expert user mode”.'
	            )
	          );
	          return;
	        }

	        // Expert gate: block non-expert users from changing a slot_usage title
	        // that is currently an explicit copy of the base schema slot's title —
	        // mirrors the beforeChange hook's inheritance guard for direct cell edits.
	        if (!this.context.expert_user && slot_type === 'slot_usage' &&
	            title !== initTitle && fieldInLibrary && dh.slotDefinitionIndex) {
	          const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	          if (defPhysRow !== undefined) {
	            const _emptyFkm = (v) => v === null || v === undefined || v === '';
	            const baseTitle = hot.getSourceDataAtCell(defPhysRow, dh.slot_title_column);
	            if (!_emptyFkm(baseTitle) && initTitle === baseTitle) {
	              $('#fkm-error').show().text(
	                this.context.applyDhTerms(
	                  `The <strong>${fieldId}</strong> {{slot}} <strong>title</strong> is linked to a {{schema slot}} by the same name which supplies a value to this {{slot}}. ` +
	                  'To edit linked {{slots}}, you must enable <strong>Expert User</strong> mode. ' +
	                  'Enable it via File menu → “Toggle expert user mode”.'
	                )
	              );
	              return;
	            }
	          }
	        }

	        hot.setDataAtCell(buildCells(visualRow), 'field_key_modal');

	        // Re-rank: when slot_group changes within the same class, reposition this
	        // slot to the end of the target section and reassign sequential ranks to
	        // all class slots (attribute + slot_usage share the same rank space).
	        // This applies to all field types (attribute, slot_usage) regardless of
	        // expert mode, since the user explicitly chose the new section via the FKM.
	        if (slotGroup !== initSlotGroup && classId === initClassId) {
	          const rankCol3 = dh.slot_rank_column;
	          const srcData3 = hot.getSourceData();

	          // Collect ALL class slots (attribute + slot_usage) for this schema + class.
	          const allClassSlots = [];
	          for (let pi = 0; pi < srcData3.length; pi++) {
	            const r = srcData3[pi];
	            if (r[dh.schema_name_column]   !== schemaId) continue;
	            if (r[dh.slot_class_id_column] !== classId)  continue;
	            const t = r[dh.slot_type_column];
	            if (t !== 'slot_usage' && t !== 'attribute') continue;
	            const rank = typeof r[rankCol3] === 'number' ? r[rankCol3] : Infinity;
	            allClassSlots.push({ pi, rank, slot_group: r[dh.slot_group_column] || '' });
	          }

	          // Sort by current rank (unranked rows sort to end).
	          allClassSlots.sort((a, b) =>
	            a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank
	          );

	          // Remove the edited slot; find insertion point after last slot in target group.
	          const withoutEdited = allClassSlots.filter(s => s.pi !== physRow);
	          let insertIdx = withoutEdited.length; // default: append at end
	          for (let i = withoutEdited.length - 1; i >= 0; i--) {
	            if (withoutEdited[i].slot_group === slotGroup) { insertIdx = i + 1; break; }
	          }

	          // Rebuild ordered list with edited slot at its new position.
	          const newOrder = [
	            ...withoutEdited.slice(0, insertIdx),
	            { pi: physRow },
	            ...withoutEdited.slice(insertIdx),
	          ];

	          // Assign sequential ranks (1-based) to every class slot.
	          const rankCells3 = [];
	          for (let i = 0; i < newOrder.length; i++) {
	            const { pi } = newOrder[i];
	            const vr = pi === physRow ? visualRow : hot.toVisualRow(pi);
	            if (vr !== null && vr !== -1) rankCells3.push([vr, rankCol3, i + 1]);
	          }
	          if (rankCells3.length) hot.setDataAtCell(rankCells3, 'field_key_modal');
	          // Re-sort so rows move to their new rank positions, then navigate to the slot.
	          const sortPlugin3 = hot.getPlugin('multiColumnSorting');
	          if (sortPlugin3) {
	            const curCfg3 = sortPlugin3.getSortConfig();
	            sortPlugin3.sort(curCfg3.length ? curCfg3 : dh.defaultMultiColumnSortConfig);
	          } else {
	            hot.render();
	          }
	        }

	        // Attribute → slot_usage with existing base slot: copy base slot values into
	        // empty or conflicting cells of the converted row so inherited values are applied.
	        if (initSlotType === 'attribute' && slot_type === 'slot_usage' &&
	            fieldInLibrary && dh.slotDefinitionIndex) {
	          const defPhysRow = dh.slotDefinitionIndex.get(`${schemaId}\0${fieldId}`);
	          if (defPhysRow !== undefined) {
	            const _empty2 = (v) => v === null || v === undefined || v === '';
	            const SKIP_COLS2 = new Set([
	              dh.schema_name_column, dh.slot_class_id_column,
	              dh.slot_type_column,   dh.slot_name_column,
	              dh.slot_name_to_column?.['rank'],
	            ]);
	            // Block 1 (slot_group change re-rank) may have called sortPlugin3.sort(),
	            // changing the visual↔physical mapping.  Recompute the visual row for
	            // physRow so we write to the correct row even after that re-sort.
	            const copyVR = hot.toVisualRow(physRow) ?? visualRow;
	            const toCopy = [];
	            for (let col = 0; col < hot.countCols(); col++) {
	              if (SKIP_COLS2.has(col)) continue;
	              const baseVal = hot.getSourceDataAtCell(defPhysRow, col);
	              if (_empty2(baseVal)) continue;            // nothing to inherit
	              const attrVal = hot.getSourceDataAtCell(physRow, col);
	              // Copy base value if attribute cell is empty OR conflicts with inherited value.
	              if (_empty2(attrVal) || String(attrVal) !== String(baseVal)) {
	                toCopy.push([copyVR, col, baseVal]);
	              }
	            }
	            if (toCopy.length) hot.setDataAtCell(toCopy, 'field_key_modal');
	          }
	        }

	        // Re-rank after attribute → slot_usage conversion, but only when the
	        // copy-base-values block above actually changed the slot_group — meaning
	        // the slot needs to be repositioned in the new section.  If the section
	        // is unchanged, the slot keeps its existing rank.
	        if (initSlotType === 'attribute' && slot_type === 'slot_usage') {
	          const rankCol4  = dh.slot_rank_column;
	          const effGroup4 = hot.getSourceDataAtCell(physRow, dh.slot_group_column) || '';
	          const srcData4  = hot.getSourceData();

	          // Section unchanged — copy-base-values block did not move the slot;
	          // skip re-positioning so the rank stays as-is.
	          if (effGroup4 !== slotGroup) {

	          // Collect ALL class slots (attribute + slot_usage) for this schema + class.
	          const allSlots4 = [];
	          for (let pi = 0; pi < srcData4.length; pi++) {
	            const r = srcData4[pi];
	            if (r[dh.schema_name_column]   !== schemaId) continue;
	            if (r[dh.slot_class_id_column] !== classId)  continue;
	            const t = r[dh.slot_type_column];
	            if (t !== 'slot_usage' && t !== 'attribute') continue;
	            const rank = typeof r[rankCol4] === 'number' ? r[rankCol4] : Infinity;
	            allSlots4.push({ pi, rank, slot_group: r[dh.slot_group_column] || '' });
	          }

	          // Sort by current rank (unranked rows sort to end).
	          allSlots4.sort((a, b) =>
	            a.rank === Infinity ? 1 : b.rank === Infinity ? -1 : a.rank - b.rank
	          );

	          // Remove the edited slot; find insertion point after last slot in effective group.
	          const without4  = allSlots4.filter(s => s.pi !== physRow);
	          let insertIdx4  = without4.length; // default: append at end
	          for (let i = without4.length - 1; i >= 0; i--) {
	            if (without4[i].slot_group === effGroup4) { insertIdx4 = i + 1; break; }
	          }

	          // Rebuild ordered list with the converted slot at its new position.
	          const newOrder4  = [
	            ...without4.slice(0, insertIdx4),
	            { pi: physRow },
	            ...without4.slice(insertIdx4),
	          ];

	          // Assign sequential ranks (1-based) to every class slot.
	          const rankCells4 = [];
	          for (let i = 0; i < newOrder4.length; i++) {
	            const { pi } = newOrder4[i];
	            // Use hot.toVisualRow(pi) for all rows — visualRow may be stale
	            // after Block 1's sortPlugin3.sort() changed the visual↔physical mapping.
	            const vr = hot.toVisualRow(pi);
	            if (vr !== null && vr !== -1) rankCells4.push([vr, rankCol4, i + 1]);
	          }
	          if (rankCells4.length) hot.setDataAtCell(rankCells4, 'field_key_modal');

	          // Re-sort so rows move to their new rank positions, then navigate to the slot.
	          const sortPlugin4 = hot.getPlugin('multiColumnSorting');
	          if (sortPlugin4) {
	            const curCfg4 = sortPlugin4.getSortConfig();
	            sortPlugin4.sort(curCfg4.length ? curCfg4 : dh.defaultMultiColumnSortConfig);
	          } else {
	            hot.render();
	          }
	          } // end if (effGroup4 !== slotGroup)
	        }

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
	    }

	    $modal.modal('hide');
	  });
	}


	// The opposite of loadSchemaYAML!
	/**
	 * Builds the YAML string for the currently selected schema row.
	 * Returns { schema_name, yaml_string } or null if no schema is named/selected.
	 */
	_buildSchemaYaml(schema_name = null) {
		const dh_schema = this.context.dhs.Schema;
		let schema_focus_row;
		if (!schema_name) {
			schema_focus_row = dh_schema.current_selection[0];
			schema_name = dh_schema.hot.getDataAtCell(schema_focus_row, 0);
		} else {
			const name_col = dh_schema.slot_name_to_column['name'];
			schema_focus_row = -1;
			for (let r = 0; r < dh_schema.hot.countSourceRows(); r++) {
				if (dh_schema.hot.getSourceDataAtCell(r, name_col) === schema_name) {
					schema_focus_row = dh_schema.hot.toVisualRow(r);
					break;
				}
			}
		}
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

		  // For the Slot tab, sort rows so that base slot definitions ('slot' type)
		  // come before slot_usage/attribute rows (the dedup logic at line ~2422
		  // requires the base slot to already exist in new_schema when a slot_usage
		  // row is processed), and within each group sort by rank so the YAML output
		  // reflects the user-assigned field order from drag-and-drop reordering.
		  if (tab_name === 'Slot') {
		    const _slotTypCol = dependent_dh.slot_type_column;
		    const _rankCol    = dependent_dh.slot_rank_column;
		    const _classCol   = dependent_dh.slot_class_id_column;
		    const _hot        = dependent_dh.hot;
		    // group 0 = base slot definitions; 1 = class slots (slot_usage + attribute, interleaved by rank)
		    const _grp = (t) => (t === 'slot_usage' || t === 'attribute') ? 1 : 0;
		    rows.sort((a, b) => {
		      const gA = _grp(_hot.getSourceDataAtCell(a, _slotTypCol) ?? '');
		      const gB = _grp(_hot.getSourceDataAtCell(b, _slotTypCol) ?? '');
		      if (gA !== gB) return gA - gB;
		      if (gA > 0) { // slot_usage / attribute: secondary sort by class_id
		        const cA = _hot.getSourceDataAtCell(a, _classCol) ?? '';
		        const cB = _hot.getSourceDataAtCell(b, _classCol) ?? '';
		        if (cA !== cB) return cA < cB ? -1 : 1;
		      }
		      const rA = Number(_hot.getSourceDataAtCell(a, _rankCol)) || Infinity;
		      const rB = Number(_hot.getSourceDataAtCell(b, _rankCol)) || Infinity;
		      return rA - rB;
		    });
		  }

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
		                record.rank > 0 ? record.rank : Object.keys(su_class_obj.get('slot_usage')).length + 1
		              );
		              break;

		            case 'attribute':
		              // See https://linkml.io/linkml/intro/tutorial02.html for Container objects.
		              // plural attributes
		              target_obj = su_class_obj.get('attributes')[slot_name] ??= this.makeSlotLike(
		                slot_name,
		                record.rank > 0 ? record.rank : Object.keys(su_class_obj.get('attributes')).length + 1
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

  /**
   * Open the Compare Schemas modal, populating both dropdowns with loaded
   * schema names and pre-selecting the currently active schema in dropdown A.
   */
  openCompareModal() {
    const schema_dh = this.context.dhs['Schema'];
    if (!schema_dh) { dhAlert('No schemas loaded.'); return; }

    const name_col = schema_dh.slot_name_to_column['name'];
    const schema_names = [];
    for (let row = 0; row < schema_dh.hot.countSourceRows(); row++) {
      const sn = schema_dh.hot.getSourceDataAtCell(row, name_col);
      if (sn) schema_names.push(sn);
    }
    if (schema_names.length < 2) {
      dhAlert('At least two schemas must be loaded to compare.');
      return;
    }

    const $a = $('#compare-schema-a-select').empty();
    const $b = $('#compare-schema-b-select').empty();
    schema_names.forEach(name => {
      $a.append($('<option>').val(name).text(name));
      $b.append($('<option>').val(name).text(name));
    });

    const active = this.getSchemaEditorSelectedSchema();
    if (active && schema_names.includes(active)) {
      $a.val(active);
      $b.val(schema_names.find(n => n !== active) ?? schema_names[1]);
    } else {
      $a.val(schema_names[0]);
      $b.val(schema_names[1]);
    }

    $('#compare-schemas-results').hide().html('');
    $('#compare-schemas-status').hide().text('');
    $('#compare-schemas-modal').modal('show');
  }

  /**
   * Build in-memory JS objects for both named schemas (via the same serialisation
   * path as Save, so edits are reflected) and diff them.
   * Returns { substantive, enrichment, cosmetic } arrays of change entries.
   */
  compareSchemas(schemaNameA, schemaNameB) {
    const build = (name) => {
      const result = this._buildSchemaYaml(name);
      if (!result) throw new Error(`Schema "${name}" could not be built.`);
      return YAML.parse(result.yaml_string);
    };
    return this._analyzeSchemas(build(schemaNameA), build(schemaNameB));
  }

  /**
   * Recursive deep diff of two plain JS objects, ignoring list order.
   * Mirrors the logic of compare_schemas.py's analyze() / DeepDiff call.
   *
   * Change classifications:
   *   ENRICHMENT — title added to a permissible_value entry
   *   COSMETIC   — redundant slot_usage name field; str→single-item-list wrapping
   *   SUBSTANTIVE — everything else (including case-only value changes)
   *
   * Each entry is [path, oldVal, newVal, isCaseOnly].
   */
  _analyzeSchemas(oldObj, newObj) {
    const substantive = [], enrichment = [], cosmetic = [];

    const classify = (path, oldVal, newVal) => {
      if (newVal !== '[ADDED]' && path.includes("permissible_values") && path.endsWith("['title']"))
        return 'ENRICHMENT';
      if (newVal !== '[REMOVED]' && path.includes("slot_usage") && path.endsWith("['name']")
          && typeof newVal === 'string') {
        const m = path.match(/\['([^']+)'\]\['name'\]$/);
        if (m && m[1] === newVal) return 'COSMETIC';
      }
      if (path.endsWith("['rank']")) return 'COSMETIC';
      return 'SUBSTANTIVE';
    };

    const isCaseOnly = (a, b) =>
      typeof a === 'string' && typeof b === 'string' && a !== b && a.toLowerCase() === b.toLowerCase();

    const record = (path, oldVal, newVal) => {
      const kind = classify(path, oldVal, newVal);
      const cap = isCaseOnly(oldVal, newVal);
      const entry = [path, oldVal, newVal, cap];
      if (kind === 'ENRICHMENT') enrichment.push(entry);
      else if (kind === 'COSMETIC') cosmetic.push(entry);
      else substantive.push(entry);
    };

    const diff = (a, b, path) => {
      if (a === b) return;

      const isArr = (v) => Array.isArray(v);
      const typeOf = (v) => isArr(v) ? 'array' : (v === null ? 'null' : typeof v);
      const tA = typeOf(a), tB = typeOf(b);

      if (tA !== tB) {
        // str → single-item list with same content is cosmetic
        if (typeof a === 'string' && isArr(b) && b.length === 1 && a.trim() === String(b[0]).trim())
          cosmetic.push([path, a, b, false]);
        else
          record(path, `${tA}:${JSON.stringify(a)}`, `${tB}:${JSON.stringify(b)}`);
        return;
      }

      if (isArr(a)) {
        // Order-independent: treat each item by its JSON serialisation
        const ser = (v) => JSON.stringify(v);
        const aMap = new Map(a.map(v => [ser(v), v]));
        const bMap = new Map(b.map(v => [ser(v), v]));
        for (const [k, v] of aMap) if (!bMap.has(k)) record(`${path}[item]`, v, '[REMOVED]');
        for (const [k, v] of bMap) if (!aMap.has(k)) record(`${path}[item]`, '[ADDED]', v);
        return;
      }

      if (tA === 'object' && a !== null && b !== null) {
        const keysA = new Set(Object.keys(a));
        const keysB = new Set(Object.keys(b));
        const added = {}, removed = {};

        for (const k of new Set([...keysA, ...keysB])) {
          if (keysA.has(k) && keysB.has(k)) diff(a[k], b[k], `${path}['${k}']`);
          else if (keysA.has(k)) removed[k] = a[k];
          else added[k] = b[k];
        }

        // Detect key-name case-change pairs (removed + added at same parent, same value)
        const matchedA = new Set(), matchedR = new Set();
        for (const [rk, rv] of Object.entries(removed)) {
          for (const [ak, av] of Object.entries(added)) {
            if (matchedA.has(ak)) continue;
            if (ak !== rk && ak.toLowerCase() === rk.toLowerCase()
                && JSON.stringify(av) === JSON.stringify(rv)) {
              substantive.push([path,
                `[KEY CASE CHANGE] '${rk}': ${JSON.stringify(rv)}`,
                `[KEY CASE CHANGE] '${ak}': ${JSON.stringify(av)}`,
                true]);
              matchedA.add(ak); matchedR.add(rk);
              break;
            }
          }
        }
        for (const [k, v] of Object.entries(added))   if (!matchedA.has(k)) record(`${path}['${k}']`, '[ADDED]', v);
        for (const [k, v] of Object.entries(removed)) if (!matchedR.has(k)) record(`${path}['${k}']`, v, '[REMOVED]');
        return;
      }

      // Scalar difference
      record(path, a, b);
    };

    diff(oldObj, newObj, 'root');
    return { substantive, enrichment, cosmetic };
  }

  /** HTML-escape a plain string for safe insertion into innerHTML. */
  _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Render the result of _analyzeSchemas() as an HTML string for display
   * inside the Compare Schemas modal results panel.
   */
  renderCompareReport(results, schemaA, schemaB) {
    const { substantive, enrichment, cosmetic } = results;
    const MAXLEN = 120;
    const esc = (s) => this._escHtml(s);

    const fmt = (val) => {
      if (val === '[ADDED]' || val === '[REMOVED]') return val;
      const s = (typeof val === 'string') ? val : JSON.stringify(val);
      return s.length > MAXLEN ? s.slice(0, MAXLEN) + '…' : s;
    };

    const isEmpty = (v) => v === null || v === undefined || v === '';
    const fmtVal  = (v) => isEmpty(v) ? '<em>empty</em>' : esc(fmt(v));

    const fmtEntry = ([path, oldVal, newVal, cap]) => {
      const tag = cap ? ' <em class="compare-case-tag">[CASE CHANGE]</em>' : '';
      let h = `<div class="compare-entry">`;
      h += `<div class="compare-path">${esc(path)}${tag}</div>`;
      if (oldVal === '[ADDED]') {
        h += `<div class="compare-new is-created">${fmtVal(newVal)}</div>`;
      } else if (newVal === '[REMOVED]') {
        h += `<div class="compare-old is-deleted">${fmtVal(oldVal)}</div>`;
      } else {
        h += `<div class="compare-old">${fmtVal(oldVal)}</div>`;
        h += `<div class="compare-new">${fmtVal(newVal)}</div>`;
      }
      h += `</div>`;
      return h;
    };

    // Compress runs of consecutive rank changes that share the same parent
    // path and delta into a first entry, a "..." placeholder, and a last entry.
    const compressRankRuns = (entries) => {
      const out = [];
      let i = 0;
      while (i < entries.length) {
        const [path, oldVal, newVal] = entries[i];
        if (!path.endsWith("['rank']") ||
            typeof oldVal !== 'number' || typeof newVal !== 'number') {
          out.push(entries[i++]);
          continue;
        }
        // Strip the per-field segment to get the common parent prefix.
        const prefix = path.replace(/\['[^']+'\]\['rank'\]$/, '');
        const delta  = newVal - oldVal;
        let j = i + 1;
        while (j < entries.length) {
          const [p2, o2, n2] = entries[j];
          if (!p2.endsWith("['rank']") ||
              typeof o2 !== 'number' || typeof n2 !== 'number') break;
          if (p2.replace(/\['[^']+'\]\['rank'\]$/, '') !== prefix) break;
          if (n2 - o2 !== delta) break;
          j++;
        }
        const runLen = j - i;
        if (runLen < 3) {
          for (let k = i; k < j; k++) out.push(entries[k]);
        } else {
          out.push(entries[i]);                         // first
          const mid  = runLen - 2;
          const sign = delta >= 0 ? `+${delta}` : `${delta}`;
          out.push([`... (${mid} more rank shift${mid !== 1 ? 's' : ''}, all ${sign})`, '[ADDED]', '[REMOVED]']);
          out.push(entries[j - 1]);                     // last
        }
        i = j;
      }
      return out;
    };

    const fmtSection = (label, entries, open = false) => {
      const openAttr = open ? ' open' : '';
      const detail = entries.length
        ? entries.map(fmtEntry).join('')
        : '<div class="compare-entry text-muted">None.</div>';
      return `<details class="compare-section"${openAttr}>
        <summary class="compare-section-summary">${esc(label)} (${entries.length})</summary>
        <div class="compare-section-body">${detail}</div>
      </details>`;
    };

    let html = `<div class="compare-report">`;
    html += `<p class="compare-header mb-2">
      <strong>A (baseline):</strong> ${esc(schemaA)}<br>
      <strong>B (compare to):</strong> ${esc(schemaB)}</p>`;

    if (!substantive.length && !enrichment.length && !cosmetic.length) {
      html += '<p class="text-success font-weight-bold">No differences found.</p>';
    } else {
      html += fmtSection('SUBSTANTIVE CHANGES', substantive, true);
      html += fmtSection('ENRICHMENT — permissible_value title additions', enrichment);
      const compressedCosmetic = compressRankRuns(cosmetic);
      html += fmtSection('COSMETIC — redundant name fields / list wrapping', compressedCosmetic);
      html += `<p class="compare-summary mt-2">
        <strong>Summary:</strong> ${substantive.length} substantive,
        ${enrichment.length} enrichment,
        ${cosmetic.length} cosmetic</p>`;
    }
    html += '</div>';
    return html;
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
		    // 'rank' intentionally omitted: schema-level slots do not store rank
		    // in the file. Rank is class-specific ordering and lives only in slot_usage.
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


    // Positional rank counter for schema.slots entries.
    // File-stored rank is ignored because rank is class-specific ordering and
    // must not be inherited by class slots.
    let schemaSlotRank = 1;

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
            this.addSlotRecord(dh, tables, loaded_schema_name, '', 'slot', slot_name, { ...value, rank: schemaSlotRank++ });
            this.checkForAnnotations(tables, loaded_schema_name, null, slot_name, 'slot', value);
            break;
          }

          case 'Class': {
            // value.name is the explicit name field inside the class object;
            // fall back to item_name (the YAML dict key) when it is absent,
            // e.g. the Container class has no name: field in schema.yaml.
            let class_name = value.name || item_name;
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

            // class.slot_usage holds slot_definitions which are overrides on slots of slot_type 'slot'
            if (value.slot_usage) {
              // pass class_id as value.name into this?!!!!!!!e
              // This is where "table reuse" = [class name] gets to add a row into Field.
              // Assign positional rank if the file doesn't supply one — rank is
              // class-specific ordering and may be absent from older YAML files.
              let slotUsageRank = 1;
              for (let [slot_name, obj] of Object.entries(value.slot_usage)) {
                const objWithRank = (obj.rank != null) ? obj : { ...obj, rank: slotUsageRank };
                this.addSlotRecord(dh_slot, tables, loaded_schema_name, class_name, 'slot_usage', slot_name, objWithRank);
                slotUsageRank++;
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

    // Remove the root (Container) class and its rows from every table before
    // writing to HOT.  The root class is auto-generated on save and has no
    // use in the editor UI.  Doing this here (on the raw arrays) avoids
    // calling hot.loadData() later, which would reset HOT's HiddenRows plugin
    // state and break tab row-filtering.
    // NOTE: tables[] rows are plain objects at this point (not HOT arrays),
    // so the filters must use string property names, not numeric column indices.
    {
      const rootEntry = Object.entries(schema.classes || {}).find(([, c]) => c.tree_root === true);
      if (rootEntry) {
        const rootClassName = rootEntry[0];
        tables['Slot']      = tables['Slot'].filter(
          row => row['class_id'] !== rootClassName);
        tables['Class']     = tables['Class'].filter(
          row => row['name'] !== rootClassName);
        if (tables['UniqueKey']) tables['UniqueKey'] = tables['UniqueKey'].filter(
          row => row['class_id'] !== rootClassName);
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

    // Set the root_class pseudo-slot on the Schema row from the class that has
    // tree_root: true in the loaded schema.  The class rows themselves were
    // already removed from tables[] above, before updateSettings().
    {
      const rootEntry = Object.entries(schema.classes || {}).find(([, c]) => c.tree_root === true);
      if (rootEntry) {
        const rootClassCol = dh_schema.slot_name_to_column['root_class'];
        if (rootClassCol !== undefined) {
          dh_schema.hot.setDataAtCell(focus_row, rootClassCol, rootEntry[0], 'upload');
        }
      }
    }

    // resumeExecution() must run before selectCell and crudCalculateDependentKeys.
    // Operations queued during suspension (including selectCell) are flushed here.
    dh_schema.hot.resumeExecution();

    // Deselect all child DHs so stale FK selections from the previous schema
    // context (e.g. class_id='TestTable' belonging to a different schema row)
    // don't carry over into the newly-loaded schema and hide its rows in
    // dependent tabs (Slot, UniqueKey, SlotGroup …).  We do this here rather
    // than in crudCalculateDependentKeys so that normal Schema-row tab clicks
    // (where preserving the child selection is correct) are unaffected.
    for (const [name, dh] of Object.entries(this.context.dhs)) {
      if (name === 'Schema') continue;
      dh.hot.deselectCell();
    }

    // Explicitly re-select the loaded row so that getSelected() returns focus_row
    // reliably when crudCalculateDependentKeys reads it below.  Without this,
    // getSelected() may return null or a stale row index in some timing scenarios
    // (e.g. if the file-chooser dialog caused the HOT to deselect), which would
    // leave schema_id=null in the FK cascade and cause the Field tab to show no rows.
    dh_schema.hot.selectCell(focus_row, 0);

    // Refresh schema-scoped menus (SchemaClassMenu, SchemaSlotMenu, etc.) AFTER
    // selectCell so that getSchemaEditorSelectedSchema() reads the correct row and
    // filters class/slot/enum lists to the just-loaded schema.  Calling refreshMenus
    // before selectCell would use current_selection[0] = null, which falls back to
    // 'DH_LinkML' and excludes all loaded-schema classes from SchemaClassMenu —
    // leaving the Class tab's is_a dropdown empty.
    this.context.schemaEditor.refreshMenus();

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

    // On the Field tab, all selected rows must share the same slot_type.
    // Mixing types (e.g. slot_usage + attribute) in one copy operation is not
    // supported — the copy logic treats all rows identically.
    if (sourceDh.template_name === 'Slot' && sourceDh.slot_type_column !== undefined) {
      const types = new Set(
        physRows.map(pr => sourceDh.hot.getSourceDataAtCell(pr, sourceDh.slot_type_column))
          .filter(t => t != null && t !== '')
      );
      if (types.size > 1) {
        dhAlert(
          `The selected fields have mixed types: ${[...types].join(', ')}.\n\n` +
          'Copy fields can only process one field type at a time. ' +
          'Please select only slot_usage rows, only attribute rows, or only slot rows and try again.'
        );
        return;
      }
    }

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

    // Set the field-list header with count and source schema name.
    const schemaLabel = [...sourceSchemaIds].join(', ');
    const slotsWord = this.context.applyDhTerms(physRows.length === 1 ? '{{slot}}' : '{{slots}}');
    $('#copy-parent-deps-label').text(
      `These ${physRows.length} ${slotsWord} will be copied from ${schemaLabel}:`
    );
    $('#copy-to-schema-title').text(this.context.applyDhTerms('Copy {{slots}} to {{schema}}'));
    $('#copy-to-class-label').text(this.context.applyDhTerms('Copy to {{class}}:'));
    $('#copy-include-picklists-label').text(this.context.applyDhTerms('Copy {{enums}} and {{permissible values}}'));
    $('#copy-dependent-records-label').text(this.context.applyDhTerms('Copy dependent {{class}} records'));

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

    // Collect unique source class IDs in the order they appear in the selection.
    const sourceClassIds = [];
    if (classIdCol !== undefined) {
      const seen = new Set();
      for (const pr of physRows) {
        const v = sourceDh.hot.getSourceDataAtCell(pr, classIdCol);
        if (v && !seen.has(v)) { seen.add(v); sourceClassIds.push(v); }
      }
    }

    const updateClassSelect = (targetSchema) => {
      if (!hasClassId || !targetSchema) {
        $('#copy-to-class-row').hide();
        return;
      }
      // Build the set of class names that already exist in the target schema.
      const classDh = this.context.dhs['Class'];
      const targetClassNames = new Set();
      if (classDh) {
        const nameCol   = classDh.slot_name_to_column['name'];
        const schemaCol = classDh.slot_name_to_column['schema_id'];
        for (let pr = 0; pr < classDh.hot.countSourceRows(); pr++) {
          if (classDh.hot.isEmptyRow(pr)) continue;
          if (schemaCol !== undefined &&
              classDh.hot.getSourceDataAtCell(pr, schemaCol) !== targetSchema) continue;
          const name = nameCol !== undefined
            ? classDh.hot.getSourceDataAtCell(pr, nameCol) : null;
          if (name) targetClassNames.add(name);
        }
      }
      const $classSelect = $('#copy-to-class-select').empty();
      const newSuffix = this.context.applyDhTerms(' (new {{class}})');
      // Source class(es) first. If the class doesn't yet exist in the target
      // schema, append "(new table)" (or the active-mode equivalent) so the
      // user knows it will be created alongside the copied rows.
      const sourceClassSet = new Set(sourceClassIds);
      for (const srcClass of sourceClassIds) {
        const label = targetClassNames.has(srcClass) ? srcClass : srcClass + newSuffix;
        $classSelect.append($('<option>').val(srcClass).text(label));
      }
      // Then remaining classes that exist in the target but weren't sources.
      for (const name of targetClassNames) {
        if (!sourceClassSet.has(name)) {
          $classSelect.append($('<option>').val(name).text(name));
        }
      }
      $classSelect.prop('selectedIndex', 0);
      $('#copy-to-class-row').show();
    };

    // Refresh the dependency summary whenever the target schema or class changes.
    const updateDeps = () => {
      const targetSchema = $select.val();
      const targetClass  = hasClassId ? ($('#copy-to-class-select').val() || null) : null;
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

      // Translate a raw tabName (DH-mode key or class title) to a display label.
      const _sectionTermKey = {
        'Schema field':    'schema slot',
        'Table':           'Class',
        'Table section':   'SlotGroup',
        'Picklists':       'Enum',
        'Picklist choices':'PermissibleValue',
      };
      const _terms = this.context.getDhTermVars();
      const _cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      const sectionLabel = s => {
        const key = _sectionTermKey[s];
        const raw = key ? (_terms[key] ?? s) : (_terms[s] ?? s);
        return _cap(String(raw));
      };

      // Render section headers + item names as divs (matches picklist line height).
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
        let html = '';
        for (const section of sectionOrder) {
          if (!grouped[section]) continue;
          const items = grouped[section].sort((a, b) => a.name.localeCompare(b.name));
          const total = items.reduce((sum, d) => sum + d.rowCount, 0);
          html += `<div class="mb-1"><strong>${sectionLabel(section)} (${total})</strong></div>`;
          for (const d of items) {
            html += `<div class="mb-0" style="padding-left:1em">${d.name}</div>`;
          }
        }
        return html;
      };

      // Render section-header divs only (count in header, no item rows).
      const renderSummaryTable = (list) => {
        const sectionOrder = ['Schema field', 'Table', 'Table section', 'Picklists', 'Picklist choices'];
        for (const s of list) {
          if (!sectionOrder.includes(s.tabName)) sectionOrder.push(s.tabName);
        }
        const grouped = {};
        for (const s of list) { (grouped[s.tabName] ??= []).push(s); }
        let html = '';
        for (const section of sectionOrder) {
          if (!grouped[section]) continue;
          const total = grouped[section].reduce((sum, s) => sum + s.rowCount, 0);
          html += `<div class="mb-1"><strong>${sectionLabel(section)} (${total})</strong></div>`;
        }
        return html;
      };

      // --- Section 1: Selected rows + parent records (always copied, always shown) ---
      // Build one dep entry per selected row so they appear at the top of the list.
      const sourceTabTitle = this.context.template.current.schema.classes[sourceDh.template_name]?.title
        || sourceDh.template_name;

      // Detect name conflicts: slot names that already exist in the target schema/class.
      const conflictNames = new Set();
      if (srcNameCol !== undefined) {
        const tSchemaCol = sourceDh.slot_name_to_column['schema_id'];
        const tClassCol  = sourceDh.slot_name_to_column['class_id'];
        for (let pr2 = 0; pr2 < sourceDh.hot.countSourceRows(); pr2++) {
          if (sourceDh.hot.isEmptyRow(pr2)) continue;
          if (tSchemaCol !== undefined &&
              sourceDh.hot.getSourceDataAtCell(pr2, tSchemaCol) !== targetSchema) continue;
          if (targetClass && tClassCol !== undefined &&
              sourceDh.hot.getSourceDataAtCell(pr2, tClassCol) !== targetClass) continue;
          const n = sourceDh.hot.getSourceDataAtCell(pr2, srcNameCol);
          if (n) conflictNames.add(n);
        }
      }

      const selectedDeps = physRows.map(pr => {
        const name = srcNameCol !== undefined
          ? (sourceDh.hot.getSourceDataAtCell(pr, srcNameCol) || `Row ${pr}`)
          : `Row ${pr}`;
        return { tabName: sourceTabTitle, name, rowCount: 1, hasConflict: conflictNames.has(name) };
      });

      // Render selected rows; conflicts get a checked "overwrite" checkbox.
      const selsSorted = [...selectedDeps].sort((a, b) => a.name.localeCompare(b.name));
      let selHtml = `<div class="mb-1"><strong>${sectionLabel(sourceTabTitle)} (${selectedDeps.length})</strong></div>`;
      for (const d of selsSorted) {
        if (d.hasConflict) {
          const safeName = d.name.replace(/"/g, '&quot;');
          selHtml += `<div class="mb-0" style="padding-left:1em">` +
            `<label class="mb-0"><input type="checkbox" class="slot-overwrite-checkbox" checked ` +
            `data-slot="${safeName}"> ${d.name} ` +
            `<span class="text-warning small">(exists — overwrite)</span></label></div>`;
        } else {
          selHtml += `<div class="mb-0" style="padding-left:1em">${d.name}</div>`;
        }
      }
      const parentDepsHtml = allParentDeps.length ? renderItemTable(allParentDeps) : '';
      $('#copy-parent-deps-list').html(selHtml + parentDepsHtml);
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
    // The class select always has a value: either the source class (which
    // _analyzeCopyDependencies will copy to the target if missing) or a class
    // the user explicitly chose from those already in the target schema.
    const targetClass = state.hasClassId
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

    // Collect overwrite/skip decisions from the per-row checkboxes rendered in the modal.
    const overwriteNames = new Set();
    const skipNames = new Set();
    $('#copy-parent-deps-list .slot-overwrite-checkbox').each(function () {
      const slotName = $(this).data('slot');
      if ($(this).is(':checked')) overwriteNames.add(slotName);
      else skipNames.add(slotName);
    });

    // For overwrite: update existing rows in the target schema in-place.
    if (overwriteNames.size > 0) {
      const nameColIdx   = sourceDh.slot_name_to_column['name'];
      const schemaColIdx = sourceDh.slot_name_to_column['schema_id'];
      const classColIdx  = sourceDh.slot_name_to_column['class_id'];
      const recByName    = new Map(selectedRecords.map(r => [r.name, r]));
      const changes      = [];
      for (let pr2 = 0; pr2 < sourceDh.hot.countSourceRows(); pr2++) {
        if (sourceDh.hot.isEmptyRow(pr2)) continue;
        if (schemaColIdx !== undefined &&
            sourceDh.hot.getSourceDataAtCell(pr2, schemaColIdx) !== targetSchema) continue;
        if (targetClass && classColIdx !== undefined &&
            sourceDh.hot.getSourceDataAtCell(pr2, classColIdx) !== targetClass) continue;
        const n = nameColIdx !== undefined
          ? sourceDh.hot.getSourceDataAtCell(pr2, nameColIdx) : null;
        if (!n || !overwriteNames.has(n)) continue;
        const srcRec = recByName.get(n);
        if (!srcRec) continue;
        for (const [colStr, slot] of Object.entries(sourceDh.slots)) {
          const colIdx = parseInt(colStr);
          const newVal = srcRec[slot.name] ?? null;
          const oldVal = sourceDh.hot.getSourceDataAtCell(pr2, colIdx);
          if (newVal !== oldVal) changes.push([pr2, colIdx, newVal]);
        }
      }
      if (changes.length > 0) {
        sourceDh.hot.batch(() => {
          for (const [pr2, col, val] of changes) sourceDh.hot.setSourceDataAtCell(pr2, col, val);
        });
      }
    }

    // Records not overwritten in-place and not explicitly skipped are appended as new rows.
    const recordsToAppend = selectedRecords.filter(r =>
      !overwriteNames.has(r.name) && !skipNames.has(r.name)
    );

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

    if (recordsToAppend.length > 0) this._appendRowsToTab(tabName, recordsToAppend);

    if (includeTableRecords) {
      for (const sub of allTableSubs) { this._appendRowsToTab(sub.targetTabName, sub.records); }
    }

    this.refreshMenus();
    $('#copy-to-schema-modal').modal('hide');
    this._copyState = null;

    const totalCopied = recordsToAppend.length + overwriteNames.size
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