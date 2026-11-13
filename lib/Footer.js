import $ from 'jquery';
import pkg from '../package.json';

const VERSION = pkg.version;

class Footer {
  constructor(root, context, options = {}) {
    this.root = $(root);
    context.footer = this;

    const modeLabel = options.modeLabel || (context.schemaEditor ? 'Schema Editor pre-release' : 'DataHarmonizer');

    this.root.append(`
<div style="overflow:auto">
  <div id="dh-mode-badge" class="badge bg-white text-dark px-3 py-2" style="float:right; font-size:1rem; border:1px solid #adb5bd">${modeLabel} v${VERSION}</div>
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
    <select id="add-row-target" class="form-select form-select-sm"
        style="display:none; width:auto; border-radius:0; border-left:0;"></select>
    <span class="input-group-text" id="add-row-text" data-i18n="add-row-text">row(s)</span>
  </div>
</div>
`);

    this.root.find('.add-rows-button').on('click', () => {
      const numRows = parseInt(this.root.find('.add-rows-input').val()) || 1;
      const targetName = this.root.find('#add-row-target').val();
      const dh = (targetName && context.dhs?.[targetName])
               ?? context.getCurrentDataHarmonizer();
      if (!dh) return;
      dh.addRows('insert_row_below', numRows);
      setTimeout(() => {
        const lastRow = dh.hot?.countRows() - 1;
        if (lastRow >= 0) dh.hot?.scrollViewportTo({ row: lastRow });
      }, 0);
    });
  }

  /**
   * Rebuild the "Add" dropdown with the given targets.
   * @param {Array<{name: string, label: string}>} targets - ordered list of DH options.
   *   Pass an empty array to hide the dropdown entirely.
   * @param {string|null} [selectName] - If provided and present in targets, force-select it.
   */
  updateAddRowTargets(targets, selectName = null) {
    const sel = this.root.find('#add-row-target');
    const prev = sel.val();
    sel.empty();
    targets.forEach(({ name, label }) => {
      sel.append($('<option>', { value: name, text: label }));
    });
    if (selectName && targets.some(t => t.name === selectName)) {
      sel.val(selectName);
    } else if (prev && targets.some(t => t.name === prev)) {
      // Preserve prior selection when the same name is still present.
      sel.val(prev);
    }
    sel.toggle(targets.length > 0);
  }
}

export default Footer;
