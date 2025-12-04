
/**************** DataHarmonizer User Profiles stored in Browser **********
* In the future, a profile can exist for each user with respect to
* DataHarmonizer usage in general by storing/loading that profile in 
* browser's long term storage, to control settings like favoured language,
* default schema and template, etc.
* 
* With respect to particular schemas and data files, the "schema_mapping" 
* part of a profile enables users to craft basic rules about loading 
* single or 1-m DH files in and transforming them so they line up to DH 
* Schema slots.  This is aside from https://pypi.org/project/linkml-map/
* that does this and more on command line.  This interface is simple
* in looks and capability - mainly its here to handle changes in ordering 
* and renaming of fields, such that one could upgrade a schema and 
* discover that if existing data files are read into it directly then
* columns of info are missing.
* 
* A general user-defined profile could have parts that particular DH forms
* etc. are influenced by.  So far we just have a field_mapping section 
* that is responded to.
* 
* localStorage "DataHarmonizer" stores all objects via a YAML string.
*    - DataHarmonizer.schema = {} object holding schema name keys. Current
*        loaded schema name key will be added if working on field-mappings. 
*       - .schema[schema_name]: (unlikely for schema name to change)
*           - [profile_name] (user defined; useful to include version)
* //            - schema_version: [schema_version] (optional)
* // FUTURE     - file: [file1, file2, etc...] (pertinent data file names)
*             - mapping: {rule1, rule2, ...} 
* use between a schema and target filename(s). A default name
*        "[schema_name]_[schema_version] to [data_file_name] is suggested
*        if only one file is involved.
*/

import $ from 'jquery'; 
import {readBrowserDHSettings, saveBrowserDHSettings} from './Toolbar';
import YAML from 'yaml';

// A call like fm = new FieldMapper().bind(this), provides caller environment
// variables
export class FieldMapper {
  constructor(context) {

    // References AppContext as created via Toolbar.js
    this.context = context;
    // For jquery $(button) access to FieldMapper functions below.
    self = this; 
    // The html content of the visual mapping table in the form:
    this.field_mapping_html = ''; 

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
        alert("No mapping profiles are currently set up yet.")
      }
    });

    // A reset button redoes the mapping content back to previous copy.
    $('#field-mapping-reset-btn').off('click').on('click', function() {
      self.renderFieldMappingModal();
    });

    // Indicates user is finished with field mapping adjustments, so try
    // loading the file again.
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
    // In each tbody section that has a template_name, look for any td which
    // has a "field-mismatch" attribute in first column.  That will be slot
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

  initFieldMappingModal(file_name, field_mapping_html) {
    // Indicates uploaded data file name in field mapping modal.
    $('#field-mapping-data-file-name').text(file_name);
    // Store html so user can reset to it.
    this.field_mapping_html = field_mapping_html;
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

}
export default FieldMapper;