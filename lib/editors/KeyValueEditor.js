import Handsontable from 'handsontable';
import { MULTIVALUED_DELIMITER, titleOverText } from '../utils/fields';
import { isEmptyUnitVal } from '../utils/general';

// Derived from: https://jsfiddle.net/handsoncode/f0b41jug/

/**
 * The cell type adds supports for displaing the label value except the key in the key-value
 * dropdown editor type.
 *
 * NOTE — above-mode filtering (oninput handler, _flipAbove branch):
 * When the dropdown is flipped above the cell, filtering uses a single
 * updateSettings({ data, height }) call to update both data and height in one
 * render pass.  If a future HOT upgrade stops routing data changes through
 * updateSettings (some versions only accept data changes via loadData), filtering
 * will silently stop working in above-mode while height updates continue.
 * Symptom: typing narrows the row count correctly but the list content no longer
 * changes.  Fix: split the single call back into loadData(currentSource) followed
 * by updateSettings({ height: newH }).
 */
export default class KeyValueListEditor extends Handsontable.editors
  .HandsontableEditor {
  /**
   * Prepares the editor instance by setting up various options for Handsontable.
   *
   * It appears this instance hangs around for the life of the handsontable!
   * @param {number} row The row index of the cell being edited.
   * @param {number} col The column index of the cell being edited.
   * @param {string} prop The property name or column index of the cell being edited.
   * @param {HTMLElement} td The HTML element for the cell.
   * @param {any} value The value of the cell.
   * @param {object} cellProperties The properties of the cell.
   */
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);

    // fullSource is the complete picklist; currentSource tracks the filtered
    // subset so the cells() depth callback stays in sync with the loaded data.
    const fullSource = cellProperties.source;
    let currentSource = fullSource;
    const controller = this;

    // Filter the inner HOT dropdown data directly against the full source array.
    // The old DOM-based approach (querySelectorAll + CSS classes) only ever saw
    // the initially rendered virtual viewport rows, so items outside that window
    // were never shown or hidden correctly.
    // oninput fires only when the value actually changes (typed character,
    // paste, backspace).  onkeyup would fire on every key release including
    // arrows and modifiers, causing unnecessary filter+render work.
    this.TEXTAREA.oninput = function(e) {
      if (!controller.htEditor) return;
      const text = (e.target || e.srcElement).value.toLowerCase();
      currentSource = text
        ? fullSource.filter(item => (item.label || '').toLowerCase().includes(text))
        : fullSource;

      if (controller._flipAbove && controller.htContainer) {
        // Above-mode: resize and reposition in a single updateSettings call
        // (one render pass) rather than loadData + updateSettings (two passes).
        // This keeps the list bottom-anchored as the filtered row count changes.
        const newH = Math.max(23, Math.min(currentSource.length * 23, controller._dropdownMaxH));
        controller.htEditor.updateSettings({ data: currentSource, height: newH });
        controller.htContainer.style.top = `${controller._cellTop - newH}px`;
      } else {
        controller.htEditor.loadData(currentSource);
      }
    };

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: fullSource,
      colWidths: '250',
      columns: [{data: '_id',},{data: 'label',}],
      hiddenColumns: {
        columns: [0],
      },
      cells: function(row, col) {
        var cellProp = {};
        cellProp.className = 'selectDepth_' + (currentSource[row]?.depth || '0');
        return cellProp
      }
    });
    /*
    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }
    */
  }

  /**
   * Override open() in two phases:
   *
   * Phase 1 (BEFORE super.open() constructs the inner HOT):
   *   Set htOptions.height to cap the dropdown at ~10 scrollable rows, further
   *   capped to the available space in whichever direction we expect to open.
   *
   * Phase 2 (requestAnimationFrame, after HOT renders):
   *   If the dropdown won't fit below the cell, switch htContainer to
   *   position:fixed (viewport-relative) and place it above the cell's TOP edge.
   *   Storing _flipAbove / _cellTop / _dropdownMaxH lets the onkeyup handler
   *   keep the dropdown bottom-anchored as the filtered row count changes.
   */
  open() {
    const ROW_HEIGHT = 23;  // approximate px per row in the inner HOT
    const MAX_ROWS   = 10;

    // Clear any positioning left over from the previous open() on this
    // (shared) instance before we measure anything.
    this._flipAbove   = false;
    this._cellTop     = 0;
    this._dropdownMaxH = 0;
    if (this.htContainer) {
      this.htContainer.style.transform = '';
      this.htContainer.style.position  = '';
      this.htContainer.style.top       = '';
      this.htContainer.style.left      = '';
      this.htContainer.style.width     = '';
      this.htContainer.style.zIndex    = '';
    }

    // --- Phase 1: choose height before the inner HOT is constructed --------
    if (this.TD && this.cellProperties) {
      const cellRect        = this.TD.getBoundingClientRect();
      const viewH           = window.innerHeight || document.documentElement.clientHeight;
      // HOT's container is the real clip boundary when smaller than the viewport.
      const hotBottom       = this.hot.rootElement
        ? this.hot.rootElement.getBoundingClientRect().bottom
        : viewH;
      const effectiveBottom = Math.min(viewH, hotBottom);
      const spaceBelow      = effectiveBottom - cellRect.bottom;
      const spaceAbove      = cellRect.top;
      const wantedH         = Math.min(
        (this.cellProperties.source || []).length, MAX_ROWS
      ) * ROW_HEIGHT;

      const willOpenAbove = spaceBelow < wantedH && spaceAbove > spaceBelow;
      const available     = willOpenAbove ? spaceAbove : spaceBelow;
      const dropdownH     = Math.max(ROW_HEIGHT, Math.min(wantedH, available - 4));
      this._dropdownMaxH    = dropdownH;
      this.htOptions.height = dropdownH;
    }

    super.open();

    // --- Phase 2: flip above the cell if needed ----------------------------
    requestAnimationFrame(() => {
      if (!this.htContainer || !this.TD) return;

      const dropdownRect    = this.htContainer.getBoundingClientRect();
      if (dropdownRect.height === 0) return;

      const cellRect        = this.TD.getBoundingClientRect();
      const viewH           = window.innerHeight || document.documentElement.clientHeight;
      const hotBottom       = this.hot.rootElement
        ? this.hot.rootElement.getBoundingClientRect().bottom
        : viewH;
      const effectiveBottom = Math.min(viewH, hotBottom);
      const spaceBelow      = effectiveBottom - cellRect.bottom;
      const spaceAbove      = cellRect.top;

      if (spaceBelow < this._dropdownMaxH && spaceAbove > spaceBelow) {
        this._flipAbove = true;
        this._cellTop   = cellRect.top;

        // Switch to position:fixed so top is in viewport coords and updates
        // from onkeyup need no knowledge of HOT's internal coordinate system.
        const w = this.htContainer.offsetWidth || 250;
        this.htContainer.style.position = 'fixed';
        this.htContainer.style.zIndex   = '99999';
        this.htContainer.style.width    = `${w}px`;
        this.htContainer.style.left     = `${cellRect.left}px`;
        this.htContainer.style.top      = `${cellRect.top - this._dropdownMaxH}px`;
      }
    });
  }

}

/**
 * Custom validator function for the KeyValueListEditor to validate cell values.
 *
 * @param {any} value The value to validate.
 * @param {function} callback A callback function to execute with the result of validation.
 */
export const keyValueListValidator = function (value, callback) {
  let valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) {
    valueToValidate = '';
  }

  if (this.allowEmpty && valueToValidate === '') {
    callback(true);
  } else {
    callback(this.source.find(({ _id }) => _id === value) ? true : false);
  }
};

/**
 * Custom renderer function for displaying translated labels in the cells of a Handsontable instance.
 *
 * @param {object} hot Instance of Handsontable.
 * @param {HTMLElement} TD The table cell to render.
 * @param {number} row The row index of the cell.
 * @param {number} col The column index of the cell.
 * @param {string} prop The property name or column index of the cell.
 * @param {any} value The value of the cell.
 * @param {object} cellProperties The properties of the cell.
 */
export const keyValueListRenderer = function (
  hot, TD, row, col, prop, value, cellProperties) {
  // Call the autocomplete renderer to ensure default styles and behavior are applied
  Handsontable.renderers
    .getRenderer('autocomplete')
    .apply(this, [hot, TD, row, col, prop, value, cellProperties]);

  const item = cellProperties.source.find(({ _id }) => _id === value);
  // For multilingual switch, use the label as the display value but keep the
  // _id as the stored value
  TD.innerHTML = `<div class="htAutocompleteArrow">▼</div>${item && item.label || value || ''}`; // This directly sets what is displayed in the cell
};

export const multiKeyValueListRenderer = (field) => {

  return function (hot, TD, row, col, prop, value, cellProperties) {

    // Call the autocomplete renderer to ensure default styles and behavior are applied
    Handsontable.renderers
      .getRenderer('autocomplete')
      .apply(this, [hot, TD, row, col, prop, value, cellProperties]);

    let label = '';

    // Since multiple values, we must compose the labels for the resulting display.
    if (!isEmptyUnitVal(value)) {
      label = value
      .split(MULTIVALUED_DELIMITER)
      .map((value_item) => {
        const choice = cellProperties.source.find(({ _id }) => _id === value_item);
        if (!(choice))
          console.warn(`${value_item} not in permissible_values for ${field.name} slot.`);
        return choice ? choice.label : '';
      })
      .join(MULTIVALUED_DELIMITER);
    }

    // This directly sets what is displayed in the cell on render() 
    // Use the label as the display value but keep the _id as the stored value
    TD.innerHTML = `<div class="htAutocompleteArrow">▼</div>${label}`;
    //}
  };
};
