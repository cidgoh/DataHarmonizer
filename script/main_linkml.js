/**
 * @fileOverview Handsontable grid with standardized COVID-19 metadata.
 * Implemented with vanilla JavaScript and locally downloaded libaries.
 * Functionality for uploading, downloading and validating data.
 * 
 * NOTE: If you are using Chrome javascript debugger console: using this
 * tool disables double clicking on HandsonTable cells, so you won't see 
 * column help or cell insert/delete row actions, and it seems to disable 
 * the createHot afterRender event/method.
 */

/* A list of templates available for this app, which will be displayed in a 
 * menu. A template can also be accessed by adding it as a folder name in the
 * URL parameter. This enables testing of a template even if it hasn't been incorporated into the list below.
 *
 * main.html?template=test_template
 *
 * MIxS example schemas are available at:
 * https://github.com/GenomicsStandardsConsortium/mixs-source/tree/main/model/schema
 *
 */
const VERSION = '0.14.3';
const VERSION_TEXT = 'DataHarmonizer provenance: v' + VERSION;
const TEMPLATES = {
  'MIxS soil': {'folder': 'MIxS_soil', 'status': 'published'},
};

// Currently selected cell range[row,col,row2,col2]
CURRENT_SELECTION = [null,null,null,null];

/**
 * Controls what dropdown options are visible depending on grid settings.
 */
const toggleDropdownVisibility = () => {
  $('.hidden-dropdown-item').hide();

  $('#settings-dropdown-btn-group').off()
      .on('show.bs.dropdown', () => {

        const hiddenRows = HOT.getPlugin('hiddenRows').hiddenRows;
        
        if (hiddenRows.length) {
          $('#show-all-rows-dropdown-item').show();
        }

        if (!jQuery.isEmptyObject(INVALID_CELLS)) {
          $('#show-invalid-rows-dropdown-item').show();
        }
        const validRowCount = HOT.countRows() - HOT.countEmptyRows();
        if (validRowCount > Object.keys(INVALID_CELLS).length) {
          $('#show-valid-rows-dropdown-item').show();
        }
      })
      .on('hide.bs.dropdown', () => {
        $('.hidden-dropdown-item').hide();
      });
};


/**
 * Get a flat array of all fields in `data.json`.
 * @param {Object} data See `data.json`.
 * @return {Array<Object>} Array of all objects under `children` in `data.json`.
 */
const getFields = (data) => {
  return Array.prototype.concat.apply([], data.map(parent => parent.children));
};

/**
 * Create a blank instance of Handsontable.
 * @param {Object} data See `data.js`.
 * @return {Object} Handsontable instance.
 */
const createHot = (data) => {
  const fields = getFields(data);
  const hot = Handsontable($('#grid')[0], {
    nestedHeaders: getNestedHeaders(data),
    columns: getColumns(data),
    colHeaders: true,
    rowHeaders: true,
    contextMenu: ["remove_row","row_above","row_below"],
    minRows: 100,
    minSpareRows: 100,
    width: '100%',
    height: '75vh',
    fixedColumnsLeft: 1,
    hiddenColumns: {
      copyPasteEnabled: true,
      indicators: true,
      columns: [],
    },
    hiddenRows: {
      rows: [],
    },
    // Handsontable's validation is extremely slow with large datasets
    invalidCellClassName: '',
    licenseKey: 'non-commercial-and-evaluation',
    // beforeChange source: https://handsontable.com/docs/8.1.0/tutorial-using-callbacks.html#page-source-definition
    beforeChange: function(changes, source) { 
      if (!changes) return;

      // When a change in one field triggers a change in another field.
      var triggered_changes = []; 

      for (const change of changes) {
        const column = change[1];
        // Check field change rules
        fieldChangeRules(change, fields, triggered_changes);
      }
      // Add any indirect field changes onto end of existing changes.
      if (triggered_changes) 
        changes.push(...triggered_changes);
    },
    afterInit: () => {
      $('#next-error-button').hide();
    },
    afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
      window.CURRENT_SELECTION = [row, column, row2, column2];
    },
    afterRender: (isForced) => {
      $('#header-row').css('visibility', 'visible');
      $('#footer-row').css('visibility', 'visible');

      // Bit of a hackey way to RESTORE classes to secondary headers. They are
      // removed by Handsontable when re-rendering main table.
      $('.secondary-header-text').each((_, e) => {
        const $cellElement = $(e).closest('th');
        $cellElement.addClass('secondary-header-cell');
        if ($(e).hasClass('required')) {
          $cellElement.addClass('required');
        } else if ($(e).hasClass('recommended')) {
          $cellElement.addClass('recommended');
        } 
      });

    },
    afterRenderer: (TD, row, col) => {
      if (INVALID_CELLS.hasOwnProperty(row)) {
        if (INVALID_CELLS[row].hasOwnProperty(col)) {
          const msg = INVALID_CELLS[row][col];
          $(TD).addClass(msg ? 'empty-invalid-cell' : 'invalid-cell');
        }
      }
    },
  });

  return enableMultiSelection(hot, data);
};

/**
 * Create a matrix containing the nested headers supplied to Handsontable.
 * These headers are HTML strings, with useful selectors for the primary and
 * secondary header cells.
 * @param {Object} data See `data.js`.
 * @return {Array<Array>} Nested headers for Handontable grid.
 */
const getNestedHeaders = (data) => {
  const rows = [[], []];
  for (const parent of data) {
    rows[0].push({
      label: `<h5 class="pt-2 pl-1">${parent.title}</h5>`,
      colspan: parent.children.length
    });
    for (const child of parent.children) {
      let req = '';
      if (child.required)
        req = 'required';
      else {
        if (child.recommended)
          req = 'recommended';
      }
      rows[1].push(`<div class="secondary-header-text ${req}">${child.title}</div>`);
    }
  }
  return rows;
};

/**
 * Create a matrix containing the grid's headers. Empty strings are used to
 * indicate merged cells.
 * @param {Object} data See `data.js`.
 * @return {Array<Array<String>>} Grid headers.
 */
const getFlatHeaders = (data) => {
  const rows = [[], []];

  for (const parent of data) {
    let min_cols = parent.children.length - 1;
    if (min_cols < 1) {
      // Close current dialog and switch to error message
      //$('specify-headers-modal').modal('hide');
      //$('#unmapped-headers-modal').modal('hide');
      const errMsg = `The template for the loaded file has a configuration error:<br/>
      <strong>${parent.title}</strong><br/>
      This is a field that has no parent, or a section that has no fields.`;
      $('#unmapped-headers-list').html(errMsg);
      $('#unmapped-headers-modal').modal('show');

      return false;
    }
    rows[0].push(parent.title);
    rows[0].push(...Array(min_cols).fill(''));
    rows[1].push(...parent.children.map(child => child.title));
  }
  return rows;
};

/**
 * Create an array of cell properties specifying data type for all grid columns.
 * AVOID EMPLOYING VALIDATION LOGIC HERE -- HANDSONTABLE'S VALIDATION
 * PERFORMANCE IS AWFUL. WE MAKE OUR OWN IN `VALIDATE_GRID`.
 * @param {Object} data See `data.js`.
 * @return {Array<Object>} Cell properties for each grid column.
 */
const getColumns = (data) => {
  let ret = [];
  for (const field of getFields(data)) {
    const col = {};
    if (field.required)
      col.required = field.required;
    if (field.recommended)
      col.recommended = field.recommended;  

    // Compile field's regular expression for quick application.
    if (field.pattern) {
      // Issue with NMDC MIxS "current land use" field pattern: "[ ....(all sorts of things) ]" syntax.
      NMDC_regex = field.pattern.replaceAll("(", "\(").replaceAll(")", "\)").replace("[", "(").replace("]", ")")
      field.pattern = new RegExp(NMDC_regex);
    }

    col.source = null;

    if (field.flatVocabulary) {
        
      col.source = field.flatVocabulary;

      if (field.multivalued === true) {
        col.editor = 'text';
        col.renderer = 'autocomplete';
      }
      else {
        col.type = 'autocomplete';
        col.trimDropdown = false;
      }

    }

    if (field.metadata_status) 
      col.source.push(...field.metadata_status);

    switch (field.datatype) {

      case 'xsd:date': 
        col.type = 'date';
        // This controls calendar popup date format, default is mm/dd/yyyy
        // See https://handsontable.com/docs/8.3.0/Options.html#correctFormat
        col.dateFormat = 'YYYY-MM-DD';
        // If correctFormat = true, then on import and on data
        // entry of cell will convert date values like "2020" to "2020-01-01"
        // automatically.
        col.correctFormat = false; 
        break;

      //case 'xsd:float':
      //case 'xsd:integer':
      //case 'xsd:nonNegativeInteger':
      //case 'xsd:decimal':
      default:
        if (field.metadata_status) {
          col.type = 'autocomplete';
        }
        break;
    }


    ret.push(col);
  }
  return ret;
};


/**
 * Enable multiselection on select rows.
 * @param {Object} hot Handonstable grid instance.
 * @param {Object} data See `data.js`.
 * @return {Object} Grid instance with multiselection enabled on columns
 * specified as such in the vocabulary.
 */
const enableMultiSelection = (hot, data) => {
  const fields = getFields(data);
  hot.updateSettings({
    afterBeginEditing: function(row, col) {
      //if (fields[col].datatype === 'multiple') {
      if (fields[col].multivalued === true) {
        const value = this.getDataAtCell(row, col);
        let selections = value && value.split(';') || [];
        selections = selections.map(x => x.trim());
        selections2 = selections.filter(function (el) {return el != ''});
        // Cleanup of empty values that can occur with leading/trailing or double ";"
        if (selections.length != selections2.length)
          this.setDataAtCell(row, col, selections2.join('; '), 'thisChange');
        const self = this;
        let content = '';
        fields[col].flatVocabulary.forEach(function(field, i) {
          const field_trim = field.trim()
          let selected = selections.includes(field_trim) ? 'selected="selected"' : '';
          content += `<option value="${field_trim}" ${selected}'>${field}</option>`;
        })

        $('#field-description-text').html(`${fields[col].title}<select multiple class="multiselect" rows="15">${content}</select>`);
        $('#field-description-modal').modal('show');
        $('#field-description-text .multiselect')
          .chosen() // must be rendered when html is visible
          .change(function () {
            let newValCsv = $('#field-description-text .multiselect').val().join('; ')
            self.setDataAtCell(row, col, newValCsv, 'thisChange');
          }); 
      }
    },
  });
  return hot;
};

/**
 * Get grid data without trailing blank rows.
 * @param {Object} hot Handonstable grid instance.
 * @return {Array<Array<String>>} Grid data without trailing blank rows.
 */
const getTrimmedData = (hot) => {
  const gridData = hot.getData();
  let lastEmptyRow = -1;
  for (let i=gridData.length; i>=0; i--) {
    if (hot.isEmptyRow(i)) {
      lastEmptyRow = i;
    } else {
      break;
    }
  }

  return lastEmptyRow === -1 ? gridData : gridData.slice(0, lastEmptyRow);
};

/**
 * Run void function behind loading screen.
 * Adds function to end of call queue. Does not handle functions with return
 * vals, unless the return value is a promise. Even then, it only waits for the
 * promise to resolve, and does not actually do anything with the value
 * returned from the promise.
 * @param {function} fn - Void function to run.
 * @param {Array} [args=[]] - Arguments for function to run.
 */
const runBehindLoadingScreen = (fn, args=[]) => {
  $('#loading-screen').show('fast', 'swing', function() {
    setTimeout(() => {
      const ret = fn.apply(null, args);
      if (ret && ret.then) {
        ret.then(() => {
          $('#loading-screen').hide();
        });
      } else {
        $('#loading-screen').hide();
      }
    }, 0);
  });
};


/**
 * Modify visibility of columns in grid. This function should only be called
 * after clicking a DOM element used to toggle column visibilities.
 * @param {String} id Id of element clicked to trigger this function. Defaults to show all.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const changeColVisibility = (id = 'show-all-cols-dropdown-item', data, hot) => {
  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
  hot.scrollViewportTo(0, 1);

  // Un-hide all currently hidden cols
  const hiddenColsPlugin = hot.getPlugin('hiddenColumns');
  hiddenColsPlugin.showColumns(hiddenColsPlugin.hiddenColumns);

  // Hide user-specied cols
  const hiddenColumns = [];

  // If accessed by menu, disable that menu item, and enable the others
  const showColsSelectors = '#show-all-cols-dropdown-item, #show-required-cols-dropdown-item, #show-recommended-cols-dropdown-item';
  $(showColsSelectors).removeClass('disabled');
  $('#'+id).addClass('disabled');

  //Request may be for only required fields, or required+recommended fields
  const options = (id === 'show-required-cols-dropdown-item') ? ['required'] : (id === 'show-recommended-cols-dropdown-item') ? ['required','recommended'] : null;
  if (options) {
    getFields(data).forEach(function(field, i) {
      if ((field.required && options.includes('required')) || (field.recommended && options.includes('recommended'))) {}
      else {
        hiddenColumns.push(i);
      }
    });
  }
  hiddenColsPlugin.hideColumns(hiddenColumns);
  hot.render();
};

/**
 * Modify visibility of rows in grid. This function should only be called
 * after clicking a DOM element used to toggle row visibilities.
 * @param {String} id Id of element clicked to trigger this function.
 * @param {Object<Number, Set<Number>>} invalidCells See `getInvalidCells`
 *     return value.
 * @param {Object} hot Handsontable instance of grid.
 */
const changeRowVisibility = (id, invalidCells, hot) => {
  // Grid becomes sluggish if viewport outside visible grid upon re-rendering
  hot.scrollViewportTo(0, 1);

  // Un-hide all currently hidden cols
  const hiddenRowsPlugin = hot.getPlugin('hiddenRows');
  hiddenRowsPlugin.showRows(hiddenRowsPlugin.hiddenRows);

  // Hide user-specified rows
  const rows = [...Array(HOT.countRows()).keys()];
  const emptyRows = rows.filter(row => hot.isEmptyRow(row));
  let hiddenRows = [];

  if (id === 'show-valid-rows-dropdown-item') {
    hiddenRows = Object.keys(invalidCells).map(Number);
    hiddenRows = [...hiddenRows, ...emptyRows];
  } 
  else if (id === 'show-invalid-rows-dropdown-item') {
    const invalidRowsSet = new Set(Object.keys(invalidCells).map(Number));
    hiddenRows = rows.filter(row => !invalidRowsSet.has(row));
    hiddenRows = [...hiddenRows, ...emptyRows];
  }

  hiddenRowsPlugin.hideRows(hiddenRows);
  hot.render();
}

/**
 * Get the 0-based y-index of every field on the grid.
 * @param {Object} data See `data.js`.
 * @return {Object<String, Number>} Fields mapped to their 0-based y-index on
 *     the grid.
 */
const getFieldYCoordinates = (data) => {
  const ret = {};
  for (const [i, field] of getFields(data).entries()) {
    ret[field.title] = i;
  }
  return ret;
};

/**
 * Scroll grid to specified column.
 * @param {String} row 0-based index of row to scroll to.
 * @param {String} column 0-based index of column to scroll to.
 * @param {Object} data See `data.js`.
 * @param {Object} hot Handsontable instance of grid.
 */
const scrollTo = (row, column, data, hot) => {

  const hiddenCols = hot.getPlugin('hiddenColumns').hiddenColumns;
  if (hiddenCols.includes(column)) 
    changeColVisibility(undefined, data, hot);

  hot.selectCell(parseInt(row), parseInt(column), parseInt(row), parseInt(column), true);
  //Ensures field is positioned on left side of screen.
  hot.scrollViewportTo(row, column);

};


/**
 * Get an HTML string that describes a field.
 * @param {Object} field Any object under `children` in `data.js`.
 * @return {String} HTML string describing field.
 */
const getComment = (field) => {
  let ret = `<p><strong>Label</strong>: ${field.title}</p>
<p><strong>Description</strong>: ${field.description}</p>`;
  //if (field.guidance) 
  //  ret += `<p><strong>Guidance</strong>: ${field.guidance}</p>`;
  if (field.comments && field.comments.length) {
    ret += `<p><strong>Guidance</strong>: </p><p>${field.comments.join('</p>\n<p>')}</p>`;
  }
  if (field.examples) {
    // Ignoring all but linkml .value now (which can be empty):
    let examples = [];
    for (const [key, item] of Object.entries(field.examples)) {
      if (item.value.trim().length > 0) {
        // Sometimes MIxS examples are separated by ";", but other times its part
        // of a "yes; .... further information ... " format.
        //examples.push(...item.value.split(';')); // 
        examples.push(item.value);
      } 
    }
    if (examples.length)
      ret += `<p><strong>Examples</strong>: </p><ul><li>${examples.join('</li>\n<li>')}</li></ul>`;
  }
  if (field.metadata_status) {
    ret += `<p><strong>Null values</strong>: ${field.metadata_status}</p>`;
  }
  return ret;
};

/**
 * Enable template folder's export.js export options to be loaded dynamically.
 */
const exportOnload = (template_folder) =>  {
  const select = $("#export-to-format-select")[0];
  while (select.options.length > 1) {
    select.remove(1);
  }
  for (const option in EXPORT_FORMATS) {
    select.append(new Option(option, option));
  }
};

/**
 * Show available templates, with sensitivity to "view draft template" checkbox
 */
const templateOptions = () =>  {
  // Select menu for available templates
  const select = $("#select-template");
  while (select[0].options.length > 0) {
    select[0].remove(0);
  }
  const view_drafts = $("#view-template-drafts").is(':checked');
  for (const [label, template] of Object.entries(TEMPLATES)) {
    if (view_drafts || template.status == 'published') {
      select.append(new Option(label, template.folder));
    }
  }
};

/************************** APPLICATION LAUNCH ********************/

$(document).ready(() => {

  // Default template
  let template_label = Object.keys(TEMPLATES)[0];
  let template_folder = TEMPLATES[template_label].folder;

  // Allow URL parameter ?template=xxx_yyy to select template on page load.
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    template_folder = params.get('template') || template_folder;
  }
  else {//low-tech way:
    template_folder = location.search.split("template=")[1] || template_folder;
  }

  for (const [label, template] of Object.entries(TEMPLATES)) {
    // Trigger template menu option so it is selected
    if (template_folder == template.folder) {
      setupTemplate(template_folder);
      return;
    }
  }

  // Here template not found in TEMPLATES, so it doesn't have a name
  $('#template_name_display').text(template_folder);
  setupTemplate (template_folder);

});


/**
 * Revise user interface elements to match template path, and trigger
 * load of data.js and export.js scripts.  data_script.onload goes on
 * to trigger launch(DATA).
 * @param {String} template: path of template starting from app's template
 * folder.
 */
const setupTemplate = (template_folder) => {

  // Redo of template triggers new data file
  $('#file_name_display').text('');
  
  // If visible, show this as a selected item in template menu
  $('#select-template').val(template_folder);

  // Lookup name of requested template if possible
  $('#template_name_display').text('');
  for (const [label, template] of Object.entries(TEMPLATES)) {
    if (template.folder == template_folder){
      $('#template_name_display').text(label);
    }
  };

  $("#help_reference").attr('href',`template/${template_folder}/reference.html`);
  $("#help_sop").attr('href',`template/${template_folder}/SOP.pdf`);

  // Change in src triggers load of script and update to reference doc and SOP.
  reloadJs(template_folder, 'data.js', setupData);

};


const setupData = (template_folder) => {

  const table = [];
  const sectionIndex = new Map();
  const newDATA = {'table': table}; // This will hold table sections

  // Convert YAML array to object containing named yaml parts.
  for (ptr in DATA) {
    newDATA[DATA[ptr].name] = DATA[ptr];
  }

  // List of columns
  for (const [key, name] of Object.entries(newDATA.soil.classes.soil.slots)) {
    /* Lookup each column in terms table. A term looks like:
    is_a: "core field", title: "history/fire", slot_uri: "MIXS:0001086"
    comments: (3) ['Expected value: date', 'Occurrence: 1', 'This field is used uniquely in: soil']
    description: "Historical and/or physical evidence of fire"
    examples: [{…}], multivalued: false, range: "date"
    */
    const field = newDATA.terms.slots[name];
    const slot_usage_dict = newDATA.soil.classes.soil.slot_usage;
    if ('is_a' in field) {
      // We have a field positioned within a section (or hierarchy)
      section_title = field.is_a;
      if (! sectionIndex.has(section_title)) {
        sectionIndex.set(section_title, sectionIndex.size);
        table.push({
          'title':section_title, 
          'children':[]}
        );
      }

      section = table[sectionIndex.get(section_title)];
      let new_field = {...field}; // shallow copy

      new_field.datatype = null;
      switch (new_field.range) {
        case "string": 
          // xsd:token means that string cannot have newlines, multiple-tabs
          // or spaces.
          new_field.datatype = "xsd:token"; // was "xs:token",
          break;

        //case "uri":
        //case "uriorcurie"
        //case "datetime"
        //case "time"
        //case "double"
        //case "float"
        //case "boolean"
        //case "ncname"
        //case "objectidentifier"
        //case "nodeidentifier"

        case "decimal":
          new_field.datatype = "xsd:decimal";

        case "integer": // int ???
          new_field.datatype = "xsd:nonNegativeInteger";

        case "quantity value": 
          new_field.datatype = "xsd:decimal";
          // PROBLEM: There are a variety of quantity values specified, some allowing units
          // which would need to go in a second column unless validated as text within column.
          break;

        case "date":
          new_field.datatype = "xsd:date";
          break;

        default:
          // Usually a selection list here, possibly .multivalued = true
          new_field.datatype = "xsd:token"; // was "xs:token"
          if (new_field.range in newDATA.terms.enums) {
            new_field.source = newDATA.terms.enums[new_field.range].permissible_values;
            //This calculates for each categorical field in schema.yaml a 
            // flat list of allowed values
            new_field.flatVocabulary = stringifyNestedVocabulary(new_field.source);

            // points to an object with .permissible_values ORDERED DICT array.
            // FUTURE ???? :
            // it may also have a metadata_values ORDERED DICT array.
            // ISSUE: metadata_status [missing | not applicable etc. ]
            // Allow > 1 range?
            // OR allow {permitted_values: .... , metadata_values: .... }
          }
          // .metadata_status is an ordered dict of permissible_values
          // It is separate so it can be demultipliexed from content values.
          if (new_field.metadata_status) {}
      } 

      // Copying in particular required/ recommended status of a field into
      // this class / form's context
      if (name in slot_usage_dict) {
        Object.assign(new_field, slot_usage_dict[name])
      }

      section['children'].push(new_field);
    }

  }

  setupTriggers(table);

  // DATA is an array of objects, one for each section (or field directly)
  runBehindLoadingScreen(launch, [template_folder, table]);
};


/**
 * Wire up user controls which only need to happen once on load of page.
 */
const setupTriggers = (DATA) => {

  $('#version-dropdown-item').text(VERSION);

  // Select menu for available templates
  templateOptions();

  // Enable template to be loaded dynamically
  $('#select-template-load').on('click', (e) => {
    const template_folder = $('#select-template').val()
    setupTemplate (template_folder);
  })
  // Triggers show/hide of draft templates
  $("#view-template-drafts").on('change', templateOptions);

  // File -> New
  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    const isNotEmpty = HOT.countRows() - HOT.countEmptyRows();
    if (e.target.id === 'new-dropdown-item' && isNotEmpty) {
      $('#clear-data-warning-modal').modal('show');
    } 
    else {
      // Clear current file indication
      $('#file_name_display').text('');

      runBehindLoadingScreen(() => {
        window.INVALID_CELLS = {};
        HOT.destroy();
        window.HOT = createHot(DATA);
      });
    }
  });

  // File -> Open
  const $fileInput = $('#open-file-input');

  $fileInput.change(() => {
    const file = $fileInput[0].files[0];
    const ext = file.name.split('.').pop();
    const acceptedExts = ['xlsx', 'xls', 'tsv', 'csv'];
    if (!acceptedExts.includes(ext)) {
      const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
      $('#open-err-msg').text(errMsg);
      $('#open-error-modal').modal('show');
    } else {
      window.INVALID_CELLS = {};
      runBehindLoadingScreen(openFile, [file, HOT, DATA, XLSX]);
    }
    // Allow consecutive uploads of the same file
    $fileInput[0].value = '';

    $('#next-error-button').hide();
    window.CURRENT_SELECTION = [null,null,null,null];

  });
  // Reset specify header modal values when the modal is closed
  $('#specify-headers-modal').on('hidden.bs.modal', () => {
    $('#expected-headers-div').empty();
    $('#actual-headers-div').empty();
    $('#specify-headers-err-msg').hide();
    $('#specify-headers-confirm-btn').unbind();
  });

  // File -> Save
  $('#save-as-dropdown-item').click(() => {
    if (!jQuery.isEmptyObject(INVALID_CELLS)) {
      $('#save-as-invalid-warning-modal').modal('show');
    } else {
      $('#save-as-modal').modal('show');
    }
  });


  $('#save-as-confirm-btn').click(() => {
    try {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      const matrix = [...getFlatHeaders(DATA), ...getTrimmedData(HOT)];
      runBehindLoadingScreen(exportFile, [matrix, baseName, ext, XLSX]);
      $('#save-as-modal').modal('hide');
    } catch (err) {
      $('#save-as-err-msg').text(err.message);
    }
  });
  // Reset save modal values when the modal is closed
  $('#save-as-modal').on('hidden.bs.modal', () => {
    $('#save-as-err-msg').text('');
    $('#base-name-save-as-input').val('');
  });

  // File -> Export to...
  $('#export-to-confirm-btn').click(() => {
    const baseName = $('#base-name-export-to-input').val();
    const exportFormat = $('#export-to-format-select').val();
    if (!exportFormat) {
      $('#export-to-err-msg').text('Select a format');
      return;
    }
    if (exportFormat in EXPORT_FORMATS) {
      const format = EXPORT_FORMATS[exportFormat];
      format['method'](baseName, HOT, DATA, XLSX, format.fileType);
    }
    $('#export-to-modal').modal('hide');
  });
  $("#export-to-format-select").on('change', (e) => {
    const exportFormat = $('#export-to-format-select').val();
    $('#export_file_suffix').text('.' + EXPORT_FORMATS[exportFormat].fileType);
  });

  // Reset export modal values when the modal is closed
  $('#export-to-modal').on('hidden.bs.modal', () => {
    $('#export-to-err-msg').text('');
    $('#base-name-export-to-input').val('');
  });


  // File -> Export
  $('#export-to-dropdown-item').click(() => {
    if (!jQuery.isEmptyObject(INVALID_CELLS)) {
      $('#export-to-invalid-warning-modal').modal('show');
    } else {
      $('#export-to-modal').modal('show');
    }
  });

  // Settings -> Jump to...
  const $jumpToInput = $('#jump-to-input');
  $jumpToInput.bind('focus', () => void $jumpToInput.autocomplete('search'));

  $('#jump-to-modal').on('shown.bs.modal', () => {
    $jumpToInput.val('');
    $jumpToInput.focus();
  });

  // Settings -> Fill column ...
  const $fillValueInput = $('#fill-value-input');
  const $fillColumnInput = $('#fill-column-input');
  $fillColumnInput.bind('focus', () => void $fillColumnInput.autocomplete('search'));
  $('#fill-modal').on('shown.bs.modal', () => {
    $fillColumnInput.val('');
    $fillColumnInput.focus();
  });
  $('#fill-button').on('click', () => {
    runBehindLoadingScreen(() => {
      //const fields = getFields(DATA);
      let value = $fillValueInput.val();
      let colname = $fillColumnInput.val();
      const fieldYCoordinates = getFieldYCoordinates(DATA);
      let changes = [];
      for (let row=0; row<HOT.countRows(); row++) {
        if (!HOT.isEmptyRow(row)) {
          let col = fieldYCoordinates[colname];
          if (HOT.getDataAtCell(row, col) !== value)      
            changes.push([row, col, value]);
        }
      }
      if (changes.length > 0) {
        HOT.setDataAtCell(changes);
        HOT.render();
      }
    });
  });

  // Locate next error based on current cursor cell row and column.
  $('#next-error-button').on('click', () => {
    // We can't use HOT.getSelectedLast() because "Next Error" button click 
    // removes that.
    let focus_row = window.CURRENT_SELECTION[0];
    let focus_col = window.CURRENT_SELECTION[1];

    const all_rows = Object.keys(window.INVALID_CELLS);
    const error1_row = all_rows[0];//0=index of key, not key!
    if (focus_row === null) {
      focus_row = error1_row;
      focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
    }
    else {
      // Get all error rows >= focus row
      const rows = all_rows.filter(row => row >= focus_row);

      // One or more errors on focus row (lax string/numeric comparision):
      if (focus_row == rows[0]) {
        let cols = Object.keys(window.INVALID_CELLS[focus_row])
        cols = cols.filter(col => col > focus_col);
        if (cols.length) {
          focus_col = parseInt(cols[0]);
        }
        else {
          // No next column, so advance to next row or first row
          focus_row = (rows.length > 1) ? rows[1] : error1_row; 
          focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
        }
      }
      else {
        // Advance to next row or first row
        focus_row = rows.length ? rows[0] : error1_row;
        focus_col = Object.keys(window.INVALID_CELLS[focus_row])[0];
      }
    };

    //console.log("trying", focus_row, focus_col);
    window.CURRENT_SELECTION[0] = focus_row;
    window.CURRENT_SELECTION[1] = focus_col;
    window.CURRENT_SELECTION[2] = focus_row;
    window.CURRENT_SELECTION[3] = focus_col;   
    scrollTo(focus_row, focus_col, DATA, HOT);

  });

  // Validate
  $('#validate-btn').on('click', () => {
    runBehindLoadingScreen(() => {
      window.INVALID_CELLS = getInvalidCells(HOT, DATA);
      HOT.render();

      // If any rows have error, show this.
      if (Object.keys(window.INVALID_CELLS).length > 0) {
        $('#next-error-button').show();
      }
      else
        $('#next-error-button').hide();
    });
  });

  // Field descriptions. Need to account for dynamically rendered
  // cells.
  $('#grid').on('dblclick', '.secondary-header-cell', (e) => {
    const innerText = e.target.innerText;
    const field =
        getFields(DATA).filter(field => field.title === innerText)[0];
    $('#field-description-text').html(getComment(field));
    $('#field-description-modal').modal('show');
  });

  // Add more rows
  $('#add-rows-button').click(() => {
    runBehindLoadingScreen(() => {
      const numRows = $('#add-rows-input').val();
      HOT.alter('insert_row', HOT.countRows()-1 + numRows, numRows);
    });
  });

  // Settings -> Show ... columns
  const showColsSelectors = [
      '#show-all-cols-dropdown-item', 
      '#show-required-cols-dropdown-item',
      '#show-recommended-cols-dropdown-item',
      ];
  $(showColsSelectors.join(',')).click((e) => {
    runBehindLoadingScreen(changeColVisibility, [e.target.id, DATA, HOT]);
  });

  // Settings -> Show ... rows
  const showRowsSelectors = [
    '#show-all-rows-dropdown-item',
    '#show-valid-rows-dropdown-item',
    '#show-invalid-rows-dropdown-item',
  ];
  $(showRowsSelectors.join(',')).click((e) => {
    const args = [e.target.id, INVALID_CELLS, HOT];
    runBehindLoadingScreen(changeRowVisibility, args);
  });

}


/**
 * Recursively flatten vocabulary into an array of strings, with each string's
 * level of depth in the vocabulary being indicated by leading spaces.
 * e.g., `vocabulary: 'a': {'b':{}},, 'c': {}` becomes `['a', '  b', 'c']`.
 * @param {Object} vocabulary See `vocabulary` fields in `data.js`.
 * @param {number} level Nested level of `vocabulary` we are currently
 *     processing.
 * @return {Array<String>} Flattened vocabulary.
 */
const stringifyNestedVocabulary = (vocab_list, level=0) => {

  let ret = [];
  for (const val of Object.keys(vocab_list)) {
    ret.push('  '.repeat(level) + val);
    if (vocab_list[val].permissible_values) {
      ret = ret.concat(stringifyNestedVocabulary(vocab_list[val].permissible_values, level+1));
    }
  }
  return ret;
};

/**
 * Reloads a given javascript by removing any old script happening to have the
 * same URL, and loading the given one. Only in this way will browsers reload
 * the code. This is mainly designed to load a script that sets global DATA 
 * variable.
 * 
 * @param {String} src_url: path of template starting from app's template folder.
 * @param {Object} onloadfn: function to run when script is loaded. 
 */
const reloadJs = (template_folder, file_name, onloadfn) => {
  const src_url = `./template/${template_folder}/${file_name}`;
  $(`script[src="${src_url}"]`).remove();
  var script = document.createElement('script');
  if (onloadfn) {
    // Trigger onload with indication
    script.onload = function () {onloadfn(template_folder)};
  };
  script.onerror = function() {
    $('#missing-template-msg').text(`Unable to load template file "${src_url}". Is the template name correct?`);
    $('#missing-template-modal').modal('show');
    $('#template_name_display').text('');
  };
  // triggers load
  script.src = src_url;
  document.head.appendChild(script);

}

/**
 * Clears and redraws grid based on DATA json.
 * @param {Object} DATA: hierarchy of field sections and fields to render. 
 */
const launch = (template_folder, DATA) => {

  // Since data.js loaded, export.js should succeed as well
  reloadJs(template_folder, 'export.js', exportOnload);

  runBehindLoadingScreen(() => {
    window.INVALID_CELLS = {};
    if (window.HOT) HOT.destroy(); // handles already existing data
    window.HOT = createHot(DATA);
  });

  toggleDropdownVisibility();

  const fieldYCoordinates = getFieldYCoordinates(DATA);

  // Settings -> Jump to...
  const $jumpToInput = $('#jump-to-input');
  $jumpToInput.autocomplete({
    source: Object.keys(fieldYCoordinates),
    minLength: 0,
    select: (e, ui) => {
      const column = fieldYCoordinates[ui.item.label];
      scrollTo(0, column, DATA, window.HOT);
      $('#jump-to-modal').modal('hide');
    },
  })

  const $fillColumnInput = $('#fill-column-input');
  $fillColumnInput.autocomplete({
    source: Object.keys(fieldYCoordinates),
    minLength: 0
  })

}
