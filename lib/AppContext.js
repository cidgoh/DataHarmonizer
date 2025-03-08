import * as $ from 'jquery';
import i18n from 'i18next';

import { DataHarmonizer } from '.';
import { findLocalesForLangcodes } from './utils/i18n';
import {
  Template,
  getTemplatePathInScope,
} from '../lib/utils/templates';
import { wait } from '../lib/utils/general';
import { invert, removeNumericKeys, consolidate } from '../lib/utils/objects';
import { createDataHarmonizerContainer, createDataHarmonizerTab } from '../web';
import { getExportFormats } from 'schemas';
import {range as arrayRange} from 'lodash';


class AppConfig {
  constructor(template_path = null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}
export default class AppContext {
  schema_tree = {};
  dhs = {};
  current_data_harmonizer_name = null;
  currentSelection = null;
  template = null;
  export_formats = {};
  oneToManyAppContext = null;

  constructor(appConfig = new AppConfig(getTemplatePathInScope())) {
    this.appConfig = appConfig;
    this.bindEventListeners();
  }

  // Method to bind event listeners
  bindEventListeners() {
    $(document).on('dhTabChange', (event, data) => {
      console.info(
        'dhTabChange',
        this.getCurrentDataHarmonizer().class_assignment,
        '->',
        data.specName
      );
      const { specName } = data;
      this.setCurrentDataHarmonizer(specName);
      // Should trigger Toolbar to refresh sections
      $(document).trigger('dhCurrentChange', {
        dh: this.getCurrentDataHarmonizer(),
      });
    });

    $(document).on('dhCurrentSelectionChange', (event, data) => {
      const { currentSelection } = data;
      this.currentSelection = currentSelection;
    });
  }

  async reload(
    template_path,
    overrides = { locale: null, forced_schema: null }
  ) {
    const isSameTemplatePath = template_path === this.appConfig.template_path;
    const isUploadedTemplate = template_path.startsWith('local');
    const isLocaleChange = overrides.locale !== null;

    // Handle local template refresh case
    if (isSameTemplatePath && isUploadedTemplate) {
      return this.setupDataHarmonizers({dataharmonizers: this.dhs, forced_schema: this.template?.default?.schema});
    }

    // Handle changes in schema template path or locale
    if (!isSameTemplatePath || isLocaleChange) {
      this.appConfig = new AppConfig(template_path);
      return await this.setupDataHarmonizers({locale: overrides.locale});
    }

    // Handle same template path without uploaded template
    if (isSameTemplatePath) {
      return this.setupDataHarmonizers({dataharmonizers: this.dhs});
    }

    // Handle forced schema case
    if (overrides.forced_schema !== null) {
      this.appConfig = new AppConfig(template_path);
      return this.setupDataHarmonizers({forced_schema: overrides.forced_schema});
    }

    // Default case: if no significant changes detected
    return this;
  }

  /**
   * Run void function behind loading screen.
   * Adds function to end of call queue. Does not handle functions with return
   * vals, unless the return value is a promise. Even then, it only waits for the
   * promise to resolve, and does not actually do anything with the value
   * returned from the promise.
   * @param {function} fn - Void function to run.
   * @param {Array} [args=[]] - Arguments for function to run.
   */
  async runBehindLoadingScreen(fn, args = []) {
    await $('#loading-screen').show('fast', 'swing');
    await wait(200); // Enough of a visual cue that something is happening
    if (args.length) {
      await fn.apply(this, args);
    } else {
      await fn.apply(this);
    }
    await $('#loading-screen').hide();
    return;
  }

  getTemplateName() {
    return this.appConfig.template_path.split('/')[1];
  }

  setCurrentDataHarmonizer(data_harmonizer_name) {
    this.current_data_harmonizer_name = data_harmonizer_name;
  }

  getCurrentDataHarmonizer() {
    return this.dhs[this.current_data_harmonizer_name];
  }

  getSchema() {
    return this.template.current.schema;
  }

  getLocaleData(template) {
    let locales = {
      default: { langcode: 'default', nativeName: 'Default' },
      ...findLocalesForLangcodes(template.locales),
    };
    return locales;
  }

  /* NOTE: This likely needs to be redone.  Objective is to populate 
   * i18n.addResources() lookup table.  Issue is that forward and reverse
   * translation of enumeration items this code is used primarily to setup the resources for
  // translateObject, translateValue and translateMultivalued in translateData
  // when loading data from a file. as such it is being scoped down to manage enum translations.
  */
  addTranslationResources(template, locales = null) {
    if (locales === null) {
      locales = this.getLocaleData(template);
    }

    const defaultLocale = {
      langcode: 'default',
      nativeName: 'Default',
    };

    // Combine default and found locales
    locales = {
      ...locales,
      default: defaultLocale,
      ...findLocalesForLangcodes(template.locales),
    };

    // Helper function to process ENUMERATION permissible values into a translation map
    // ISSUE: MUST MAKE KEY LOOKUP SENSITIVE TO WHICH ENUMERATION permissible_value
    // is in.
    const getEnumResource = (enumObject) => {
      return consolidate(enumObject, (acc, [, enumObj]) => {
        const { permissible_values } = enumObj || {};
        if (permissible_values) {
          Object.entries(permissible_values).forEach(([, enumData]) => {
            const { title, text } = enumData;
            const key = text; // Enum keys are the 'text'
            const value = title || text; // Use title if available, fallback to text
            acc[key] = value; // Forward translation (text -> title)
            acc[value] = key; // Reverse translation (title -> text)
          });
        }
        return acc;
      });
    };

    // Build translation maps for each language 
    const translationsByLanguage = {};
    // E.g. template.translations{default: {schema en ...}, fr: {schema fr...},...}
    Object.entries(template.translations).forEach(([langcode, translation]) => {

      // Compute the enum resource for this language
      const enumResource = getEnumResource(translation.schema.enums);

      // Store the translations for this language.
      // NOTE: "Use primary language code" - WHY?
      const currentLang = langcode.split('-')[0]; 
      translationsByLanguage[currentLang] = {
        ...enumResource,
      };
    });

    // Generate translation maps between all possible language combinations
    const languageCodes = Object.keys(translationsByLanguage);

    // Loop over each source-destination language pair
    languageCodes.forEach((sourceLang) => {
      languageCodes.forEach((targetLang) => {
        if (sourceLang === targetLang) return; // Skip identical language pairs

        const sourceTranslation = translationsByLanguage[sourceLang];

        // Add resources for the current source-target language pair
        i18n.addResources(
          sourceLang,
          `${sourceLang}_to_${targetLang}`,
          removeNumericKeys(sourceTranslation)
        );

        // Add reverse mapping for this pair (target -> source)
        i18n.addResources(
          targetLang,
          `${targetLang}_to_${sourceLang}`,
          removeNumericKeys(invert(sourceTranslation))
        );
      });
    });
  }

  clearContext() {
    this.schema_tree = {};
    this.dhs = {};
    this.current_data_harmonizer_name = null;
    this.currentSelection = null;
  }

  clearInterface() {
    document.querySelector('#data-harmonizer-tabs').innerHTML = '';

    const pattern = 'data-harmonizer-grid-'; // sub elements
    const matchingElements = document.querySelectorAll(`[id^="${pattern}"]`);

    // Loop through the NodeList and remove each element
    matchingElements.forEach((element) => {
      element.parentNode.removeChild(element);
      element.remove();
    });
  }

  /**
   * Creates Data Harmonizers from the schema tree.
   * @param {Object} schema_tree - The schema tree from which to create Data Harmonizers.
   * @returns {Object} An object mapping the class names to their respective Data Harmonizer objects.
   */
  makeDHsFromRelations(schema, template_name) {
    let data_harmonizers = {};

    Object.entries(schema.classes)
      // Container class is only used in input and output file coordination.
      .filter(([class_name]) => this.crudIsAncestor([class_name], template_name))
      .forEach((obj, index) => {
        if (obj.length > 0) {
          const [class_name, tree_obj] = obj;

          // if it shares a key with another class which is its parent, this DH must be a child
          const is_child = this.crudGetParents(class_name);

          // Doesn't build if tab id already exists.
          const dhId = `data-harmonizer-grid-${index}`;
          if (!document.getElementById(dhId)) {
            const dhSubroot = createDataHarmonizerContainer(dhId, index === 0);

            const dhTab = createDataHarmonizerTab(dhId, class_name, index === 0);
            dhTab.addEventListener('click', () => {
              $(document).trigger('dhTabChange', {
                specName: class_name,
              });
            });

            // Each selected DataHarmonizer is rendered here. 
            // NOTE: this may be running twice?.
            // in 1-M, different DataHarmonizers have fewer rows to start with
            // Child tables are displayed differently so override the default
            // HoT settings.
            const dh = new DataHarmonizer(dhSubroot, this, {
              loadingScreenRoot: document.body,
              class_assignment: class_name,
              schema: schema, // assign during constructor so validator can init on it.
              hot_override_settings: {
                minRows: is_child ? 0 : 10,
                minSpareRows: 0,
                height: is_child ? '40vh' : '75vh',
                // TODO: Workaround, possibly due to too small section column on child tables
                // colWidths: is_child ? 256 : undefined, 
                colWidths: 200,
              },
            });

            data_harmonizers[class_name] = dh;
            dh.useTemplate(class_name);
            dh.validator.useTargetClass(class_name);

            if (is_child) {
              /* Initialization of each child table is to hide all rows until
               * parent primary key record is selected as a foreign key index.
               * Note: user cut and paste of records doesn't change content of
               * read-only fields, thankfully.
              **/
              dh.filterAll(); // Hides rows.
              this.crudMakeForeignKeysReadOnly(dh, class_name);
            }
            // Top level class, so make it active.  There should only be one
            else { 
              this.setCurrentDataHarmonizer(class_name);
            }
          }
        }
      });
    delete data_harmonizers[undefined]; // How does this occur?
    return data_harmonizers;
  }

  /*
   * Return initialized, rendered dataHarmonizer instances rendered in order
   * of their appearance as classes in schema. If a template name (class name)
   * is provided, only include that one and any dependent tables in its schema.
   * Each class has one or more slots (attributes) which each contain a 
   * foreign_key which determines parent-child relationships.
   *
   * Uses this.relations to construct list of main DH class and its dependant 
   * classes.
   *
   * Processing each class into DataHarmonizer tables:
   * - One DH instance per class: this.dhs[template_name]
   *   - In rendered DH view, filter its table rows by the foreign key slots 
   *     featured in that class.
   * - Navigation: One tab per DH instance.
   */
  async setupDataHarmonizers({
    data_harmonizers = {},
    locale = null,
    forced_schema = null
  }) {
    
    this.clearInterface();

    const [schema_path, template_name] = this.appConfig.template_path.split('/');

    this.template = await Template.create(schema_path, {forced_schema});

    // Empty case will occur when template_path doesn't correspond to a built template
    this.export_formats = forced_schema ? {} : await getExportFormats(schema_path);

    if (locale !== null) {
      this.template.updateLocale(locale);
    }

    const schema =
      locale !== null
        ? this.template.localized.schema
        : this.template.default.schema;

    this.relations = this.crudGetRelations(schema);

    // Merges any existing dataharmonizer instances with the ones newly created.
    this.dhs = {
      ...data_harmonizers,
      ...this.makeDHsFromRelations(schema, template_name),
    };

    return this;

  }

  /**************************** CRUD RELATED METHODS *************************/

    /* Establish an easy bidirectional lookup between schema classes that have
   * foreign keys. Usually one table will have 1 or n slots keyed to one other
   * table's slots.  Sometimes a table may have two slots keyed to respective
   * other tables.  
   * 
   * (Whether a table forces the combination of its foreign key slot values 
   * to be unique or not is a separate validation question controlled by a 
   * classes' unique_keys and slot's "identifier" attributes.)
   *
   * Assumes slot.attribute.annotations.foreign_key is formatted as [class_name].[slot_name]
   * INPUT

    "attributes": {
      "sample_collector_sample_id": {
        "name": "sample_collector_sample_id",
        "annotations": {
          "required": {
            "tag": "required",
            "value": true
          },
          "foreign_key": {
            "tag": "foreign_key",
            "value": "GRDISample.sample_collector_sample_id"
          }
        },
        "range": "GRDISample",

   * Paraphrased example OUTPUT 

    relations.[class_name]: {
      parent: {
        [foreign_class]: {
          [slot_name]: [foreign_slot_name],
          [slot_name_2]: [foreign_slot_name_2]...
        }
      },
      child: {
        [foreign_class]: {
          [slot_name]: [foreign_slot_name],
          [slot_name_2]: [foreign_slot_name_2]...
        }
      }
    }

  */

  /* WRT rows with keys pointing to foreign keys, a user:
   * - Can't input directly into foreign key cells.  
   * - Can delete a row with foreign key(s)
   * - Can add a new row only if foreign key(s) table(s) are
   *   focused on key fields that have values.
   *
   * WRT rows which are foreign keys to other tables, a user:
   * - Can update or delete a key field which then cascades to
   *   other child table(s). This might trigger violation of unique_keys!
   * 
   * Note: user cut and paste of records doesn't change read-only
   * fields.
  */ 

  crudGetRelations(schema) {
    let relations = {};
    Object.entries(schema.classes).forEach(([class_name, class_obj]) => {
      Object.entries(class_obj.attributes ?? {}).forEach(([slot_name, attribute]) => {
        if (attribute.annotations?.foreign_key?.value) {

          let foreign_class, foreign_slot_name;
          let key = attribute.annotations.foreign_key.value;
          // Best syntax is that foreign class is dot prefix:
          if (key.includes('.'))
            [foreign_class, foreign_slot_name] = key.split('.',2);
          // UNTESTED: Workaround is that foreign class is in range of slot:
          else if (attribute.range in schema.classes) {
            foreign_slot_name = key;
            foreign_class = attribute.range;
          }
          else {
            console.log("Class", class_name, "has slot", slot_name, "foreign key", attribute.annotations?.foreign_key?.value, "but no target class information in key or slot range.");
            return;
          }
          Object.assign(relations, {[class_name]: {parent: {[foreign_class]: {[slot_name]: foreign_slot_name}}}});
          //And reverse relation
          Object.assign(relations, {[foreign_class]: {child: {[class_name]: {[foreign_slot_name]: slot_name}}}});
        }
      });
    });
    return relations;
  }

  crudGetParents(template_name) {
    return this.relations?.[template_name]?.parent;
  }

  crudGetChildren(template_name) {
    return this.relations?.[template_name]?.child;
  }

  // Determine if parent relationships link class_name to given ancestor
  crudIsAncestor(class_names, ancestor_name) {
    let subject_name = class_names.shift();
    if (!subject_name)
      return false;
    if (subject_name == ancestor_name)
      return true;
    if (this.relations[subject_name]?.parent) {
      if (this.relations[subject_name].parent[ancestor_name])
        return true;
      // Ancestor wasn't one of parents, so try search on all ancestors.
      class_names.push(Object.values(this.relations[subject_name].parent));
    }
    return this.crudIsAncestor(class_names, ancestor_name)
  }

  /* Retrieves ordered list of tables that ultimately have given template as
   * a foreign key.  Whether it is to enact cascading visibility, update or
   * deletion events, this provides the order in which to trigger changes.
   * Issue is that intermediate tables need to be checked in order due to 
   * dependencies by foreign keys. If a table depended on an intermediate that
   * hadn't been refreshed, we'd get a wrong display.
   * Relying on javascript implicit ordering of dictionary added elements.
   */
  crudGetDependents(class_names) {
    // Initialization case
    if (typeof class_names == "string") {
      class_names = {...this.crudGetChildren(class_names)};
    }
    let children = this.crudGetChildren(class_names);
    if (children) {
      class_names = {...children};
      return this.crudGetDependents(class_names);
    }
    return class_names;
  }

  /* For given class, refresh view of all dependent tables that have a direct
   * or indirect foreign key relationship to given class.
   * Performance might show up as an issue later if lots of long dependent
   * tables to re-render.
   */
  crudFilterDependentViews(class_name) {
    Object.entries(this.crudGetDependents(class_name))
      .forEach(([dependent_name, child]) => {
        this.crudFilterByForeignKey(dependent_name);
      });
  };

  /* For given class name (template), show only rows that conform to that 
   * class's foreign key-value constraints.
   * (Could make a touch more efficient by skipping if we can tell that a 
   * given table's foreign key values haven't changed.)
   * POSSIBLE ISSUE: if given class table has one parent table where no 
   * primary key selection has been made! 
   */
  crudFilterByForeignKey(class_name) {
    const hotInstance = this.dhs[class_name].hot;
    const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');

    // Ensure all rows are visible
    const oldHiddenRows = hiddenRowsPlugin.getHiddenRows()

    //Fetch key-values to match
    const parents = this.crudGetParents(class_name);
    let [required_selections, errors] = this.crudGetForeignKeyValues(parents);

    // arrayRange() makes [0, ... n]
    let rowsToHide = arrayRange(0, hotInstance.countSourceRows()) // countSourceRows?
    .filter((row) => {
      for (let [slot_name, value] of Object.entries(required_selections)) {
        const col = this.dhs[class_name].getColumnIndexByFieldName(slot_name);
        const cellValue = hotInstance.getDataAtCell(row, col);
        if (cellValue != value)
          return true;
      }
    });

    if (rowsToHide != oldHiddenRows) {
      //Future: make more efficient by switching state of show/hide deltas?
      hiddenRowsPlugin.showRows(oldHiddenRows); 
      hiddenRowsPlugin.hideRows(rowsToHide); // Hide the calculated rows
      hotInstance.render(); // Render the table to apply changes
    }
  }

  /* Here we deal with adding rows that need foreign keys.  Locate each foreign
   * key and fetch its focused value, and copy into new records below.  
   * If missing key value(s) encountered, prompt user to focus appropriate 
   * tab(s) row and try again. This requires that every parent be synchronized
   * with its parent, etc.  So more simple to handle this by a top-down foreign
   * key synchronization, rather than bottom-up then top-down messaging. 
   * 
   * OUTPUT:
   *   required_selections {dictionary}: [slot_name]:[value] 
   *   errors {String}: If user hasn't made a row selection in one of the 
   *                    parent foreign key, this is returned in a report.
   */
  crudGetForeignKeyValues(parents) {
    let required_selections = {};
    let errors = '';
    Object.entries(parents).forEach(([parent_name, parent]) => {
      Object.entries(parent).forEach(([slot_name, foreign_slot_name]) => {
        const value = this.crudGetSelectedTableSlotValue(parent_name, foreign_slot_name);
        if (value == null) {
          errors += `<li> <b>${parent_name}</b> (${foreign_slot_name})</li>`;
        }
        else {
          required_selections[slot_name] = value;
        }
      });
    });
    return [required_selections, errors];
  }

  /* construct two lookup tables for given parent and dependent tables so
   * we can quickly lookup their respective foreign key slots and values.
   */
  crudGetKeyVals(class_name, dependent_name, row) {
    const pdh = this.dhs[class_name];
    const ddh = this.dhs[dependent_name];
    let linked_slots = this.relations[class_name].child[dependent_name];
    let class_slots = {};
    let child_slots = {};
    Object.entries(linked_slots).forEach(([class_slot, child_slot]) => {
      let col = pdh.getColumnIndexByFieldName(class_slot);
      let value = pdh.hot.getDataAtCell(row, col);
      class_slots[class_slot] = value;
      col = pdh.getColumnIndexByFieldName(child_slot);
      child_slots[child_slot] = value; // linked so must be the same.
    })

    return [class_slots, child_slots]

  };

  /* If dependent table is connected to key in parent table which is given by
   * selected row (i.e. dependent foreign keys = values on this row) AND that
   * key is unique in this table, then deletion of this row should lead to 
   * deletion of dependent records.  If deletion of dependent records is 
   * entailed, report to user the count of those records.
   *
   * INPUT
   * @do_delete boolean: Flag to go ahead and delete underlying rows/records.
   */ 
  crudGetDependentDeletes(class_name, do_delete = false) {
    let deletes = [];
    let warning_text = 'WARNING: If you proceed, this will include deletion of one\n or more dependent records:\n\n';

    const dependents = this.crudGetDependents(class_name);
    /* 1) Determine if each dependent's foreign keys are satisfied - each must
     *    have a value matching class_name slot's value; ALSO, This set of 
     *    values must be unique to a single row if in parent table. If it 
     *    isn't unique, then no deletions should take place in child table, and
     *    no need to report an error. 
     *    Dependent may depend on more than one table, but regarding deletion,
     *    values of foreign keys to other tables don't matter.
     *
     * 2) Report back how many deletions would occur (often all that are
     *    visible, since child table record visibility would be tuned to 
     *    parent.
     */
    let found_dependent_rows = false;
    for (const dependent_name in dependents) {

      const ddh = this.dhs[dependent_name];
      const parents = this.crudGetParents(dependent_name);
      Object.entries(parents).forEach(([parent_name, parent]) => {
        // Assemble the list of a parent's slots that are foreign keys of this
        // dependent.  Then see if there is more than one parent record which
        // has those key values. If so, no need to delete anything in 
        // dependent.
        const pdh = this.dhs[parent_name];
        const parent_row = pdh.hot.getSelected()?.[0]?.[0];
        // parent-to-child linked key-values
        const [p_KeyVals, d_KeyVals] = this.crudGetKeyVals(parent_name, dependent_name, parent_row);
        // Search below starts with row 0. 
        let found_row = this.crudFindByKeyVals(pdh, p_KeyVals);
        // Looking for another record besides parent being deleted.
        if (found_row == parent_row)
          found_row = this.crudFindByKeyVals(pdh, p_KeyVals, parent_row+1);
        // If at least one other row has the keyVals_p, then no need to delete 
        // dependent records.
        if (found_row == null) {
          let found_rows = [];
          // Now find any DEPENDENT table rows that have to be deleted.
          found_row = this.crudFindByKeyVals(ddh, d_KeyVals);
          while (found_row != null) {
            // https://handsontable.com/docs/javascript-data-grid/api/core/#alter
            // Prepped for alter 'remove rows' [[1,1],[4,1], ...] structure, where each
            found_rows.push([found_row,1]); 
            found_row = this.crudFindByKeyVals(ddh, d_KeyVals, found_row+1);
          }
          if (do_delete) {
            ddh.hot.alter('remove_row', found_rows);
          }
          else if (found_rows.length > 0) {
            found_dependent_rows = true;
            let key_vals = Object.entries(d_KeyVals).join("\n").replace(',',': ');
            warning_text += `- ${found_rows.length} ${dependent_name} records with key:\n      ${key_vals}`;
          }
        }
      });
    }
    return (do_delete || found_dependent_rows == false) ? false : warning_text;
  }


  crudFindByKeyVals(dh, keyVals, row = 0) {
    const total_rows = dh.hot.countSourceRows(); // .countSourceRows();
    while (row < total_rows) {
      // .every() causes return on first break
      if (Object.entries(keyVals).every(([slot_name, value]) => {
          const col = dh.getColumnIndexByFieldName(slot_name); // map to col#
          return (value == dh.hot.getDataAtCell(row,col));
        })
      )
        break; 
      else
        row ++;
    }
    if (row == total_rows) // Nothing found.
      row = null;
    return row;
  };

  crudGetSelectedTableSlotValue(class_name, slot_name) {
    const dh = this.dhs[class_name];
    // getSelected() returns array with each row being a selection range
    // e.g. [[startRow, startCol, endRow, endCol],...].
    const selected = dh.hot.getSelected();
    if (selected) {
      const row = selected[0][0]; // Get first selection's row.
      const col = dh.getColumnIndexByFieldName(slot_name);
      const value = dh.hot.getDataAtCell(row, col);
      if (value && value.length > 0) 
        return value;
    }
    return null // DH doesn't return null for cell, so this flags no selection.
  }

  // All foreign key fields in a table must be read-only. Their contents are
  // controlled by dependent CRUD create and update actions. 
  crudMakeForeignKeysReadOnly(dh, class_name) {
    Object.entries(this.crudGetParents(class_name))
    .forEach(([parent_name, parent]) => {
      Object.entries(parent)
      .forEach(([slot_name, foreign_name]) => {
        let col = dh.getColumnIndexByFieldName(slot_name);
        dh.updateColumnSettings(col, { readOnly: true });
      });
    });
  }

  



}
