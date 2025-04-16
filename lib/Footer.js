import $ from 'jquery';

const TEMPLATE = `
<div class="input-group">
  <div class="input-group-prepend">
    <button class="btn btn-primary add-rows-button" type="submit" id="add-row"
        data-i18n="add-row">
      Add
    </button>
  </div>
  <input
    type="text"
    class="form-control add-rows-input"
    value="1"
  />
  <div class="input-group-append">
    <span class="input-group-text" id="add-row-text" data-i18n="add-row-text">more rows at the bottom.</span>
  </div>
  <div class="input-group-append" id="record-hierarchy-div" style="margin-left:20px">
    <span class="input-group-text" id="record-path" data-i18n="record-path">Focus</span>
    <span class="input-group-text" style="background-color:#fdfdfd" id="record-hierarchy"></span>
  </div>
  <input type="file" id="schema_upload" style="visibility:hidden" accept="application/yaml" multiple="false"/>
</div>
`;

class Footer {
  constructor(root, context) {
    this.root = $(root);
    this.root.append(TEMPLATE);

    // Load a DH schema.yaml file into this slot.
    // Prompt user for schema file name. Input is hidden in footer.html  
    // 

    $('#schema_upload').on('change', (event) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event2) => {
        if (reader.error) {
          alert("Schema file was not found" + reader.error.code);
          return false;
        }
        else {
          context.getCurrentDataHarmonizer().loadSchemaYAML(event2.target.result);
        }
        // reader.readyState will be 1 here = LOADING
      });
      // reader.readyState should be 0 here.
      // files[0] has .name, .lastModified integer and .lastModifiedDate
      if (event.target.files[0]) {
        reader.readAsText(event.target.files[0]);
      }
      $("#schema_upload").val('');

    });

    this.root.find('.add-rows-button').on('click', () => {
      const numRows = this.root.find('.add-rows-input').val();
      context.getCurrentDataHarmonizer().addRows('insert_row_below', numRows);
    });
  }
}

export default Footer;
