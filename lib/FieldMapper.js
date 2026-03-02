
/**************** DataHarmonizer User Profiles stored in Browser **************
 * This script provides a FieldMapper class which manipulates a modal report
 * of all schema single template or 1m template field matches to some incomming
 * dataset. It is designed to be called repeatedly, receiving each tab/table's
 * headers in the appendFieldMappingModal() call, and adding to a table mapping
 * report.  Users have drag/drop access to the incomming headers to align them
 * with the schema's headers, if need be. They are not forced to specify all 
 * field mappings, some can be left empty and so no data will be loaded for 
 * them. The report returns the mapping information which can be acted upon.
 * 
 * This interface is simple in looks and capability - it only handles changes
 * in ordering and renaming of fields, such that one could upgrade a schema and 
 * discover that if existing data files are read into it directly then
 * columns of info are missing.
 * 
 * Note that https://pypi.org/project/linkml-map/ can effect a comparable
 * mapping specification transform on a data file on the command line.
 * 
 * Multiple mapping profiles (named by a user) for each schema () to some file
 * can exist in browser's long term storage for each user. A browser 
 * localStorage 'dataharmonizer_settings' key holds these and other DH settings 
 * (in future, settings like favoured language, default schema and template).
 * 
 * Not handled: odd case of data having duplicate column names.
 * Incomming data file might not have section headers, so don't make
 * code dependent on them.
 *
 * localStorage "DataHarmonizer" stores all objects via a YAML string.
 *    - DataHarmonizer.schema = {} object holding schema name keys. Current
 *        loaded schema name key will be added if working on field-mappings. 
 *       - .schema[schema_name]: (unlikely for schema name to change)
 *           - [profile_name] (user defined; useful to include version)
 *               - schema_version: [schema_version] (optional)
 * // FUTURE     - file: [file1, file2, etc...] (pertinent data file names)
 *               - tables: list of schema classes (tables) that need 1+ mappings.
 *                  - tables[table name (schema class)]: 
 *                      .map: [{'from': ... , 'to': ...}, ...]
 */

import $ from 'jquery'; 
import {readBrowserDHSettings, saveBrowserDHSettings, clearDH} from './Toolbar';
import YAML from 'yaml';
import { updateSheetRange } from '../lib/utils/files';
import { dataObjectToArray } from '../lib/utils/fields';
import { utils as XlsxUtils } from 'xlsx/xlsx.js';

// A call like fm = new FieldMapper().bind(this), provides caller environment
// variables
export class FieldMapper {
  constructor(context, file, data) {

    // References AppContext as created via Toolbar.js
    this.file = file;
    this.file.ext = this.file.name.split('.').pop()
    this.context = context;
    this.data = data; // Used to map columns on specific DH's on save. 
    // For jquery $(button) access to FieldMapper functions below.
    self = this; 
    // The html content of the visual mapping table in the form:
    this.field_mapping_html = ''; 


    /********************** Initialize form elements *************************/
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(this.file.name);
    $('#field-mapping-display').text('');

    // Populate schema mapping profiles. Keep first option instructions/prompt.
    $('#field-mapping-select option:gt(0)').remove(); 
    const dh_settings = readBrowserDHSettings();
    const schema = this.context.getSchemaRef();
    dh_settings.schema ??= {};
    if (!(schema.name in dh_settings.schema))
      dh_settings.schema[schema.name] = {};
    Object.entries(dh_settings.schema[schema.name]).forEach(([name, value]) => {
      const newOption = new Option(name, name);
      $('#field-mapping-select').append(newOption);
    });
    $('#field-mapping-delete-btn').prop('disabled', true);

    // Provide default value for new mapping profile name
    // This is a suggested name, but users can change it.
    //$('#field-mapping-name').val(`${schema.name}_${schema.version} to ${this.file.name}`);

    /************************* Field Mapping Modal Events *********************
     * Since FieldMapper instances are created each time a user loads a data 
     * file and that has a field missmatch, the following code is run 
     * repeatedly although the DOM html already exists with previous instances
     * established events. Consequently we have to turn off the previously made
     * events and redo them. FUTURE: just recreate the modal HTML?
     */

    /** 
     * If switching to a new profile when on the field-mapping form:
     * - load it in text area
     * - copy it to field-mapping-name
     * - implement it in combined drag & drop table list of data file fields.
     */
    $('#field-mapping-select').off('change').on('change', function(e) {
      const profile_name = $('#field-mapping-select').val();
      $('#field-mapping-delete-btn').prop('disabled', profile_name == '');
      if (profile_name.length > 0) {
        const [dh_settings, profile] = self.getProfile(profile_name);
        self.renderFieldMappingProfile(profile_name, profile);
      }
    });

    $("#field-mapping-concise-checkbox").off('change').on('change', function(){
      self.conciseFieldMappingModal($(this).is(':checked'));
    });

    // "Forgets" selected user-specified profile by erasing it in localStorage.
    // This doesn't affect maping rendered in form.
    $('#field-mapping-delete-btn').off('click').on('click', function() {
      const profile_name = $('#field-mapping-select').val();
      if (profile_name > '') { // we have something to delete.
        const dh_settings = readBrowserDHSettings();
        const schema = self.context.getSchemaRef();
        if (dh_settings.schema[schema.name]?.[profile_name])
          delete(dh_settings.schema[schema.name][profile_name]);
        saveBrowserDHSettings(dh_settings);
        $(`#field-mapping-select option[value="${profile_name}"]`).remove();
        $('#field-mapping-display').text('');
        $('#field-mapping-name').val('')
        $('#field-mapping-delete-btn').prop('disabled', true); // Disable delete button until next selection.
      }

    });

    $('#field-mapping-save-btn').off('click').on('click', function (){
      const profile_name = $('#field-mapping-name').val().trim(); // trim whitespace
      $('#field-mapping-name').val(profile_name)
      if (profile_name) {
        self.updateProfileMapping(profile_name); // profile object updated in-situ.
        const [dh_settings, profile] = self.getProfile(profile_name);
        self.renderFieldMappingProfile(profile_name, profile);
      }
      else {
        alert("Please provide a name for this mapping profile.")
      }
    });

    // A reset button redoes the mapping content back to previous copy.
    $('#field-mapping-reset-btn').off('click').on('click', function() {
      self.renderFieldMappingModal();
    });

    $('#field-mapping-confirm-btn').off('click').on('click', function() {
      self.loadMappedData();
    });
  }

  /** Indicates user is finished with field mapping adjustments, so try
   * loading the appropriate table(s) of the file again. Get mapping straight
   * from user drag-drop HTML table. Guaranteed that mappings are in 
   * consecutive DH template/class sections.
   * 
   * Currently we let people get off this screen without pressing "Mapping
   * complete".  Need to block that. Data for those tables won't be loaded. Add
   * a cancel button? If so does it cancel whole load?
   */
  loadMappedData() {

    const mappings = this.getProfileMapping();

    for (const [template_name, dh] of Object.entries(this.context.dhs)) {

      if (!this.data[template_name] || this.data[template_name].data)
        continue;

      const data_table = this.data[template_name].data; 

      // Do mapping if any needed
      const map_obj = mappings?.tables[template_name];
      if (map_obj) {
        // Might not be any rules for a table that is missing some fields but
        // user has not supplied any mappings.
        Object.entries(map_obj?.map || {}).forEach(([mapping]) => {
          const col_from = dh.slot_title_to_column[mapping.from];
          const col_to = dh.slot_title_to_column[mapping.to];
          // Switch data_table columns here (data_table doesn't itself have headers)
          Object.entries(data_table).forEach((row) => {
            const temp = row[col_to];
            row[col_to] = row[col_from];
            row[col_from] = temp;
          })
        });

      }

      // Extra processing required for .json data?
      if (this.file.ext === 'json') {
        data_table.forEach((row, index) => {
          data_table[index] = dataObjectToArray(row, dh, {
            serializedDateFormat: this.dateExportBehavior,
            dateFormat: this.dateFormat,// Probably NULL!
            datetimeFormat: this.datetimeFormat, // Probably NULL!
            timeFormat: this.timeFormat,// Probably NULL!
          });
        });
      }

      clearDH(dh);  // Does away with dh settings.
      // Load mapping table into dh tab.
      dh.hot.loadData( dh.matrixFieldChangeRules(data_table) );

    };
   
    $('#field-mapping-modal').modal('hide');

  }

  /**
   * Aligns Schema template fields and their names with incoming data. Presents
   * a two column report of fields, which are sortable on the input file side.
   * 
   * This script is called repeatedly such that successive calls add sections 
   * to the modal that are dedicated to each template where field mismatches occur.
   * 
   * All JSON datasets should be satisfied via name. Tabular data might have
   * locale headers.
   * 
   * file_name can also be used as a key to access browser localStorage
   * predefined mapping to a schema.
   * 
   * @param {Array<Array<String>} matrix Data that user must specify headers for.
   * @param {Integer} header_row which is 1 more than actual row (natural number).
   * @param {String} file_name name of data file user selected for loading.
   */
  appendFieldMappingModal(dh) {

    const data_fields = this.data[dh.template.name].header;

    // Lookup dictionary
    const data_field_to_row = Object.fromEntries(
      data_fields.map((item, index) => {return [item, index]})
    );

    console.log("data_field_to_row", data_field_to_row);

    // FUTURE: PROTECT AGAINST DUPLICATE FIELD NAMES IN DATA FILE.
    // Preliminary scan for all matches via ordered slot_names array
    let slot_matches = new Array(dh.slot_names.length).fill(false);
    let data_matches = new Array(data_fields.length).fill(false);
    //let found_by_title = false;
    dh.slot_names.forEach((slot_name, index) => {
      if (slot_name in data_field_to_row) { // JSON data matches on slot.name
        //console.log("FOUND NAME", slot_name, data_field_to_row[slot_name])
        const data_index = data_field_to_row[slot_name];
        slot_matches[index] = data_index;
        data_matches[data_index] = index;
      }
      else {
        // TRYING TITLE as well (default language) and if found flag this.
        let title = dh.slots[dh.slot_name_to_column[slot_name]].title;
        if (title in data_field_to_row) { // Tabular tsv,csv,xls,xlsx matching
          //console.log("FOUND TITLE", title, data_field_to_row[title])
          const data_index = data_field_to_row[title]
          slot_matches[index] = data_index;
          data_matches[data_index] = index;
          //found_by_title = true;
        }
      } 
    });


    // Display template/tab/class (i.e. this call to extend content is 
    // dedicated to that content.
    let html = `
      <tbody class="field-mapping-template">
        <tr>
          <td colspan="2">${dh.template_name}</td>
        </tr>
      </tbody>`;

    let slot_row = 0; // IMPORTANT - whether matched by .name or .title
    // Loop through each section
    let done_data_row = {};
    Object.entries(dh.sections)
      .forEach(([i, section]) => {

      // Adding template and section to make easier to search and replace content.
      html += `
        <tbody class="field-mapping-section" data-table="${dh.template_name}" data-section="${section.title}">
          <tr>
            <td colspan="2">${section.title}</td>
          </tr>
      `;

      let old_match_data_row = null;
      Object.entries(section.children).forEach(([section_slot_row, slot]) => {

        if (slot_matches[slot_row] !== false && slot_matches[slot_row] >= 0) {
          const data_row = slot_matches[slot_row];
          old_match_data_row = data_row;
          // HERE slots are always displayed by their title (for multilingual sanity?)
          const ordering = (slot_row != data_row) ? `<span class="reordered">${data_row}</span>` : data_row
          html += `
          <tr class="field-match">
            <td>${slot_row}) ${slot.title}</td>
            <td class="field-match">${ordering}) ${data_fields[data_row]}</td>
          </tr>`;

        }
        else {

          // Do slot side's mismatched item.
          html += `
          <tr class="field-mismatch">
            <td class="field-mismatch">${slot_row}) ${slot.title}</td>
            <td class="draggable-mapping-item field-mismatch"></td>
          </tr>`;
        }

        // If we don't have a match, then we have to ensure all the 
        // mismatched field headers for both tables are provided until
        // the next match. (If the data table had columns whose order is 
        // completely different, then semantically the template section
        // slots will have unrelated fields near them, c'est la vie.)

        // Possibility that next data row(s) are not a match so squeeze them
        // in here.
        // Add each data_matches' entry between last match and next one.
        let data_row = (old_match_data_row || -1) + 1;
        while (data_row < data_matches.length 
          && (data_matches[data_row] === false
          && ! done_data_row[data_row])
        ){
            done_data_row[data_row] = true; // Best way to handle this case? 
            const ordering = slot_row != data_row ? 'reordered' : ''
          html += `
          <tr class="field-mismatch">
            <td>&nbsp;</td>
            <td class="draggable-mapping-item field-mismatch">${data_row}) ${data_fields[data_row]}</td>
          </tr>`;
          data_row += 1;
        }

        slot_row += 1;
      });

      html += `
        </tbody>
      `;

    });

    this.field_mapping_html += html;

  }

  // Update field mapping form with user's selected dh_settings.schema[schema_name][profile_name]
  renderFieldMappingProfile(profile_name, profile) {
    $('#field-mapping-name').val(profile_name);

    $('#field-mapping-display').text(YAML.stringify({[profile_name]: profile}));
    if (!$(`#field-mapping-select option[value="${profile_name}"]`).length) {
      const newOption = new Option(profile_name, profile_name);
      $('#field-mapping-select').append(newOption) //.select();
    }
    $('#field-mapping-delete-btn').prop('disabled', false);

    this.renderFieldMappingModal(profile_name);
  }

  /** Updates browser localStorage dataharmonizer_settings.schema.[schema name][profile name]
   * based on form's displayed html resulting from user's drag moves of data fields.
   * 
   */
  updateProfileMapping(profile_name) {
    let [dh_settings] = this.getProfile(profile_name);
    const profile = this.getProfileMapping(); // Its not changing profile in place.
    const schema = this.context.getSchemaRef();
    dh_settings.schema[schema.name][profile_name] = profile;
    saveBrowserDHSettings(dh_settings);
  }

  // Retrieves browser memory dataharmonizer_settings 
  // .schema[schema name][profile] data structure and initializes if not yet
  // accessed.
  getProfile(profile_name) {
    const dh_settings = readBrowserDHSettings();
    const schema = this.context.getSchemaRef();
    if (!('schema' in dh_settings))
      dh_settings.schema = {};
    if (!(schema.name in dh_settings.schema))
      dh_settings.schema[schema.name] = {};
    if (!(profile_name in dh_settings.schema[schema.name])) {
      dh_settings.schema[schema.name][profile_name] = {
        schema_version: schema.version,
        tables: {}
      }
    }
    return [dh_settings, dh_settings.schema[schema.name][profile_name]];
  };

  /** 
   * Build mappings for all of a schema's table(s) based on visual table layout
   * of sections and user's drag/drop of data fields. Only later might a 
   * profile name be associated with this.  Outputs a "mapping" dictionary 
   * containing a "tables" dictionary, with each mapping.tables[table_name].map
   * containing a "from" field lable and "to" field label.
   */
  getProfileMapping() {

    function get_label (nmstr) {
      const i = nmstr.indexOf(' ')+1; 
      return (i ? nmstr.slice(i) : '')
    };
    // In each tbody[data-table] section that has a template_name, look for
    // any tr which has a "field-mismatch" attribute. That tr first td will 
    // have slotname of schema/template.
    // Each 
    const schema = this.context.getSchemaRef();
    let mapping = {
      schema_version: schema.version,
      tables: {} 
    };

    $('table#field-mapping-table tbody[data-table]').each((t_index, tbody) => {

      // A given schema class often has multiple tbody, each for a data-table section
      const table_name = $(tbody).attr('data-table');

      mapping.tables[table_name]??= {}; // init empty value if it doesn't exist.
      $(tbody).find('td:first-child.field-mismatch').each((index, slot_field) => {
        // Retrieve labels, get past column id) prefix;
        const data_label = get_label($(slot_field).next('td').text());
        if (data_label.length > 0) {// target has a mapping in it.
          let row_map = {
            'to': get_label($(slot_field).text()),
            'from': data_label
          };
          const table_section = $(tbody).attr('data-section') || '';
          if (table_section)
            row_map['section'] = table_section;

          // Adds table if it isn't present.
          mapping.tables[table_name].map??= []; // establishes array if not there.
          mapping.tables[table_name].map.push(row_map);
        }
      })
      // The .map attribute exists only if 1+ mappings.

    });
    return mapping;

  }

  initFieldMappingModal() { //file_name, field_mapping_html) {
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(this.file_name);
    $('#field-mapping-display').text('');
    // Store html so user can reset to it.
    //this.field_mapping_html = field_mapping_html;
    // Populate schema mapping profiles. Keep first option instructions/prompt.
    $('#field-mapping-select options').slice(1).remove(); 
    const dh_settings = readBrowserDHSettings();
    const schema = this.context.getSchemaRef();
    if (!dh_settings.schema)
      dh_settings.schema = {};
    if (!(schema.name in dh_settings.schema))
      dh_settings.schema[schema.name] = {};
    Object.entries(dh_settings.schema[schema.name]).forEach(([name, value]) => {
      const newOption = new Option(name, name);
      $('#field-mapping-select').append(newOption);
    });

    // Provide default value for new mapping profile name
    // This is a suggested name, but users can change it.
    $('#field-mapping-delete-btn').prop('disabled', true);
    //$('#field-mapping-name').val(`${schema.name}_${schema.version} to ${file_name}`);
  }


  /**
   * Assumes this.field_mapping_html holds html that can be reset to.
   * profile_name if any, points to browser-in-memory mapping profile
   * to implement.  Currently this is done in a crude way via textual
   * search and replace on the html rather than, say, data-slot-name="..."
   */
  renderFieldMappingModal(profile_name = null) {
    // Clears out previous mapping report
    $('#field-mapping-table tbody').remove();
    $('#field-mapping-table thead').after(this.field_mapping_html);

    // Sets the checkbox status to hide matched fields via CSS.
    this.conciseFieldMappingModal($("#field-mapping-concise-checkbox").is(':checked'));

    // A bit crude, but we recreate the mapping by moving td 
    // content around.  We don't care what the schema source or 
    // data field target rows are (they could have changed across
    // data file versions.  Just the names count.
    if (profile_name) {
      this.applyFieldMapping(profile_name);
    }

    // To enable drag-drop on newly-created elements in field-mapping-modal
    // FUTURE: limit drag to within each dh table.
    $(".draggable-mapping-item").draggable({
      containment: "#field-mapping-table", // but scroll inside field-mapping-container
      helper: 'clone',
      cursor: 'grab',
      axis: "y",
      drag: function(event, ui) { // scroll: true doesn't work on cloned div.
        var $scrollContainer = $("#field-mapping-container");
        var containerOffset = $scrollContainer.offset();
        var containerHeight = $scrollContainer.height();
        var draggableTop = ui.offset.top;
        var scrollAmount = 20; // Adjust scroll speed
        // Scroll down
        if (draggableTop + ui.helper.outerHeight() > containerOffset.top + containerHeight) {
          $scrollContainer.scrollTop($scrollContainer.scrollTop() + scrollAmount);
        }
        // Scroll up
        else if (draggableTop < containerOffset.top) {
          $scrollContainer.scrollTop($scrollContainer.scrollTop() - scrollAmount);
        }
      }
    });

    $(".draggable-mapping-item").droppable({
      accept: ".draggable-mapping-item", // Only accept elements with this class
      //activeClass: "ui-state-active",
      hoverClass: "ui-state-hover",
      drop: function(event, ui) {
        const source_text = ui.draggable[0].innerText;
        ui.draggable[0].innerText = event.target.innerText;
        event.target.innerText = source_text;
        $(this).css("background-color", "lightskyblue");
        ui.draggable.css("background-color", "lightblue"); 
      }
    });
  }

  // User has dragged one field down to the row of another within a table.
  // Switch the labels of the selected fields.
  // WARNING: THIS TEXT MATCHING ALGORITHM IS VERY SENSITIVE TO spaces etc. 
  // in field label HTML display
  applyFieldMapping(profile_name) {
    const [dh_settings, profile] = this.getProfile(profile_name);

    Object.entries(profile.tables || {}).forEach(([table_name, table_obj]) => {

      const mismatched_rows = $(`table#field-mapping-table tbody[data-table="${table_name}"] > tr.field-mismatch`);
      // Doing table by table; otherwise identical field names in different
      // tables lead to garbled rule implementation.

      Object.entries(table_obj?.map || {}).forEach(([index, mapping]) => {
        // Find mapping.from text. mapping.from td will initially have empty 
        // data field td. First fetch the 2nd data file field value
        const schema_slot_td = $(mismatched_rows).find('td:first-child')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.to)}); 
        const schema_data_td = $(mismatched_rows).find('td:eq(1)')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.from)});

        // Now do the switch of values as mapping dictates:
        const source_data_td_text = $(schema_data_td).text();
        $(schema_data_td).text(''); // Clear out old data td side.
        $(schema_slot_td).next('td').text(source_data_td_text);

      });
    });
  }

  // UI checkbox allows mapping form to be collapsed to just the rows that
  // have mismatch information.
  conciseFieldMappingModal(hide_flag) {
    const elements = $("table#field-mapping-table tr.field-match");
    const sections = $("table#field-mapping-table tbody.field-mapping-section:not(:has(td.field-mismatch))");
    if (hide_flag) {
      elements.hide();
      sections.hide();
    }
    else {
      elements.show();
      sections.show();
    }
  }

  // Modal show is outside of renderFieldMappingModal() above because "reset" 
  // button is on form itself, and it needs to render just table content of 
  // form without redoing library component.  
  async show() {
    $('#field-mapping-modal').modal('show'); 
    return false;
  }

}


/**
 * Determine if first or second row of a matrix has the same headers as the
 * grid's secondary (2nd row) headers.  If neither, return false.
 * Usually first row is section headers in sparse array, and 2nd row is field
 * TITLES (locale/language sensitive).
 * @param {Array<Array<String>>} matrix
 * @param {Object} data See `data.js`.
 * @return ({Integer}, {Integer}, {Integer}) row that data starts on, total schema rows for table, and count of exact matches, or false if no exact header row recognized.
 */
export function findHeaderRow(dh, matrix) {
    const schemaRow = dh.slot_titles;
    const first_row_matches = schemaRow.filter(element => matrix[0].includes(element)).length;
    const second_row_matches = schemaRow.filter(element => matrix[1].includes(element)).length;

    let row = false;
    let count = 0;
    if (first_row_matches && first_row_matches > second_row_matches) {
      row = 1;
      count = first_row_matches;
    }
    // Odd case if 2nd row and 1st row counts actually match.
    if (second_row_matches && second_row_matches >= first_row_matches) {
      row = 2;
      count = second_row_matches;
    }

    return [row, count];
  };


export default FieldMapper;