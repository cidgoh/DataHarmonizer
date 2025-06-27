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
    <span class="input-group-text" id="add-row-text" data-i18n="add-row-text">row(s)</span>
  </div>

  <div class="input-group-append" id="slot_report_control" style="margin-left:20px">
    <span class="input-group-text" id="record-path" data-i18n="slot-tab-control">Field Display</span>
    <select id="slot_report_select_type" class="btn btn-primary">
      <option value="slot" selected="selected">schema field</option>
      <option value="slot_usage">table field reused from schema</option>
      <option value="attribute">table field (stand-alone)</option>
    </select>
    &nbsp;
    <select id="slot_report_select_table" class="btn btn-primary">
      <option>in focused table</option>
      <option>in all tables</option>
      <option>schema 1: table 1</option>
      <option>schema 1: table 2</option>
      <option>schema 2: table 1</option>  
      <option>schema 2: table 2</option>  
      <option>schema 2: table 3</option>  
    </select>
    &nbsp;
    <select id="slot_report_select_slot" class="btn btn-primary">
      <option>all fields</option>
      <option>schema 1: slot name 1</option>
      <option>schema 1: slot name 2</option>
      <option>schema 2: slot name 1</option>  
      <option>schema 2: slot name 2</option>  
      <option>schema 2: slot name 3</option> 
      <option>...</option>   
    </select>
    &nbsp;
    <select id="slot_report_select_slot_group" class="btn btn-primary">
      <option>all field groups</option>
      <option>schema 1: slot_group 1</option>
      <option>schema 1: slot_group 2</option>
      <option>schema 2: slot_group  1</option>  
      <option>schema 2: slot_group  2</option>  
      <option>schema 2: slot_group  3</option> 
      <option>...</option>   
    </select>


  </div>

</div>
`;

class Footer {
  constructor(root, context) {
    this.root = $(root);
    this.root.append(TEMPLATE);
    this.root.find('.add-rows-button').on('click', () => {
      const numRows = this.root.find('.add-rows-input').val();
      context.getCurrentDataHarmonizer().addRows('insert_row_below', numRows);
    });

    $('#slot_report_select_type').on('change', (event) => {
      let dh = context.getCurrentDataHarmonizer();
      dh.filterByKeys(dh, dh.template_name);
    });


  }
}

export default Footer;
