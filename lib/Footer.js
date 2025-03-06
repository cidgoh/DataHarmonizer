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
  }
}

export default Footer;
