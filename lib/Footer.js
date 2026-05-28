import $ from 'jquery';

class Footer {
  constructor(root, context, options = {}) {
    this.root = $(root);

    const modeLabel = options.modeLabel || (context.schemaEditor ? 'Schema Editor' : 'DataHarmonizer');

    this.root.append(`
<div style="overflow:auto">
  <div id="dh-mode-badge" class="badge bg-secondary text-white px-3 py-2" style="float:right; font-size:1rem">${modeLabel}</div>
  <div class="input-group" style="width:auto; display:inline-flex">
    <button class="btn btn-primary add-rows-button" type="submit" id="add-row"
        data-i18n="add-row">
      Add
    </button>
    <input
      type="text"
      class="form-control add-rows-input"
      value="1"
    />
    <span class="input-group-text" id="add-row-text" data-i18n="add-row-text">row(s)</span>
  </div>
</div>
`);

    this.root.find('.add-rows-button').on('click', () => {
      const numRows = this.root.find('.add-rows-input').val();
      context.getCurrentDataHarmonizer().addRows('insert_row_below', numRows);
    });
  }
}

export default Footer;
