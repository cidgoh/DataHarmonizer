
/**************** DataHarmonizer User Profiles stored in Browser **************
 * This script provides a FieldMapper class which manipulates a modal report
 * of all schema single template or 1m template field matches to some incomming
 * dataset. It is designed to be called repeatedly, receiving each tab/table's
 * headers in the appendFieldMappingModal() call, and adding to a table mapping
 * report.  Users have drag/drop access to the incomming headers to align them
 * with the schema's headers, if need be. The report then returns the mapping
 * information which can be acted upon.
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
 * localStorage "DataHarmonizer" stores all objects via a YAML string.
 *    - DataHarmonizer.schema = {} object holding schema name keys. Current
 *        loaded schema name key will be added if working on field-mappings. 
 *       - .schema[schema_name]: (unlikely for schema name to change)
 *           - [profile_name] (user defined; useful to include version)
 *               - schema_version: [schema_version] (optional)
 * // FUTURE     - file: [file1, file2, etc...] (pertinent data file names)
 *               - mapping: {rule1, rule2, ...} use between a schema and target
 *                   filename(s). A default name 
 *                   "[schema_name]_[schema_version] to [data_file_name] is
 *                    suggested if only one file is involved.
 */

import $ from 'jquery'; 
import {readBrowserDHSettings, saveBrowserDHSettings} from './Toolbar';
import YAML from 'yaml';

// A call like fm = new FieldMapper().bind(this), provides caller environment
// variables
export class FieldMapper {
  constructor(context, file_name) {

    // References AppContext as created via Toolbar.js
    this.context = context;
    // For jquery $(button) access to FieldMapper functions below.
    self = this; 
    // The html content of the visual mapping table in the form:
    this.field_mapping_html = ''; 


    /********************** Initialize form elements *************************/
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(file_name);

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
    $('#field-mapping-delete-btn').prop('disabled', true);

    // Provide default value for new mapping profile name
    // This is a suggested name, but users can change it.
    //$('#field-mapping-name').val(`${schema.name}_${schema.version} to ${file_name}`);

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
        // 
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

    // Indicates user is finished with field mapping adjustments, so try
    // loading the file again.
    // Currently we let people get off this screen without pressing "Mapping
    // complete".  Should we?  Data for those tables won't be loaded. Add
    // a cancel button?
    $('#specify-headers-confirm-btn').off('click').on('click', function() {

      $('#field-mapping-modal').modal('hide');

      /*
        self.hot.loadData(
          self.matrixFieldChangeRules(mappedMatrixObj.matrix.slice(2))
        );
        if (mappedMatrixObj.unmappedHeaders.length) {
          const unmappedHeaderDivs = mappedMatrixObj.unmappedHeaders.map(
            (header) => `<li>${header}</li>`
          );
          $('#unmapped-headers-list').html(unmappedHeaderDivs);
          $('#unmapped-headers-modal').modal('show');
        }
       */
    });
  }

  /**
   * Determine if first or second row of a matrix has the same headers as the
   * grid's secondary (2nd row) headers.  If neither, return false.
   * Usually first row is section headers in sparse array, and 2nd row is field
   * names.
   * @param {Array<Array<String>>} matrix
   * @param {Object} data See `data.js`.
   * @return ({Integer}, {Integer}) row that data starts on, and count of exact
   *          matches, or false if no exact header row recognized.
   */
  compareMatrixHeadersToGrid(dh, matrix) {
    //const schemaRow = this.getFlatHeaders(dh)[1];
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

    return [row, schemaRow.length, count];
  };


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
  appendFieldMappingModal(dh, data_fields) {

    // Lookup dictionary
    const data_field_to_row = Object.fromEntries(
      data_fields.map((item, index) => {return [item, index]})
    );

    // FUTURE: PROTECT AGAINST DUPLICATE FIELD NAMES IN DATA FILE.
    // Preliminary scan for all matches via ordered slot_names array
    let slot_matches = new Array(dh.slot_names.length).fill(false);
    let data_matches = new Array(data_fields.length).fill(false);
    let found_by_title = false;
    dh.slot_names.forEach((slot_name, index) => {
      if (slot_name in data_field_to_row) { // JSON data matches on slot.name
        const data_index = data_field_to_row[slot_name]
        slot_matches[index] = data_index;
        data_matches[data_index] = index;
      }
      else {
        // TRYING TITLE as well (default language) and if found flag this.
        let title = dh.slots[dh.slot_name_to_column[slot_name]].title;
        if (title in data_field_to_row) { // Tabular tsv,csv,xls,xlsx matching
          const data_index = data_field_to_row[title]
          slot_matches[index] = data_index;
          data_matches[data_index] = index;
          found_by_title = true;
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
        <tbody class="field-mapping-section" data-template="${dh.template_name}" data-section="${section.title}">
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
    //$('#field-mapping-display').text(YAML.stringify(dh_settings);
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
    const [dh_settings, profile] = this.getProfile(profile_name);
    let mapping = [];
    let template_name = '';
    function get_label (nmstr) {const i = nmstr.indexOf(' ')+1; return (i ? nmstr.slice(i) : '')};
    // In each tbody section that has a template_name, look for any tr which
    // has a "field-mismatch" attribute.  That tr first td will have slot
    // name of schema/template.
    $('table#field-mapping-table tbody').each((t_index, tbody) => {
      const template_name = $(tbody).attr('data-template');
      const template_section = $(tbody).attr('data-section');
      if (template_name) {
        $(tbody).find('td:first-child.field-mismatch').each((index, slot_field) => {
          // Retrieve labels, get past column id) prefix;
          const slot_label = get_label($(slot_field).text()); 
          const data_label = get_label($(slot_field).next('td').text());
          if (data_label.length > 0) // target has a mapping in it.
            mapping.push({
              'template': template_name,
              'section': $(tbody).attr('data-section'),
              'from': slot_label,
              'to': data_label
            });
        })
      }

    });

    profile['mapping'] = mapping;
    saveBrowserDHSettings(dh_settings);
  }

  initFieldMappingModal() { //file_name, field_mapping_html) {
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(this.file_name);
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
   * search and replace on the html.
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
      const [dh_settings, profile] = this.getProfile(profile_name);
      Object.entries(profile.mapping).forEach(([index, mapping]) => {
        // Find mapping.from text. mapping.from td will be accompanied
        // by an empty td.

        const mismatched_rows = $(`table#field-mapping-table tbody[data-template="${mapping.template}"] > tr.field-mismatch`);//[data-section="${mapping.section}"]

        // First fetch the 2nd data file field value
        const schema_data_td = $(mismatched_rows).find('td:eq(1)')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.to)});
        const schema_slot_td = $(mismatched_rows).find('td:first-child')
          .filter(function() {return $(this).text().endsWith(') ' + mapping.from)}); 

        const source_data_td_text = $(schema_data_td).text();
        $(schema_data_td).text(''); // Clear out old data td side.
        $(schema_slot_td).next('td').text(source_data_td_text);

      });
    }


    // To enable drag-drop on newly-created elements in field-mapping-modal
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

  // Provides alot of .schema[schema name][profile] data structure
  // initializations if not yet accessed.
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
        mapping: {}
      }
    }
    return [dh_settings, dh_settings.schema[schema.name][profile_name]];
  };

  // Modal show is outside of renderFieldMappingModal() above because "reset" 
  // button is on form itself, and it needs to render just table content of 
  // form without redoing library component.  
  show() {
    $('#field-mapping-modal').modal('show'); 
  }

}
export default FieldMapper;