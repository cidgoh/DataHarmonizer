import Handsontable from 'handsontable';
import { MULTIVALUED_DELIMITER, titleOverText } from '../utils/fields';
import { isEmptyUnitVal } from '../utils/general';

// Derived from: https://jsfiddle.net/handsoncode/f0b41jug/

/**
 * The cell type adds supports for displaing the label value except the key in the key-value
 * dropdown editor type.
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
    this.TEXTAREA.onkeyup = function(e) {
      if (!controller.htEditor) return;
      const text = (e.target || e.srcElement).value.toLowerCase();
      currentSource = text
        ? fullSource.filter(item => (item.label || '').toLowerCase().includes(text))
        : fullSource;
      controller.htEditor.loadData(currentSource);
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
   *   capped to the space available in whichever direction we expect to open.
   *   The effective boundary is the smaller of the viewport bottom and the HOT
   *   container bottom (HOT's display area is the real clip boundary).
   *
   * Phase 2 (requestAnimationFrame, after HOT renders):
   *   If the dropdown won't fit below the cell, flip it above the cell's TOP
   *   edge using translateY.  translateY is computed from getBoundingClientRect
   *   so it works regardless of HOT's internal coordinate system.
   */
  open() {
    const ROW_HEIGHT = 23;  // approximate px per row in the inner HOT
    const MAX_ROWS   = 10;
    let   dropdownHeight = 0;  // captured in Phase 1, used in Phase 2 closure

    // Reset any transform left over from a previous open() on this instance.
    if (this.htContainer) {
      this.htContainer.style.transform = '';
    }

    // --- Phase 1 -----------------------------------------------------------
    if (this.TD && this.cellProperties) {
      const cellRect        = this.TD.getBoundingClientRect();
      const viewH           = window.innerHeight || document.documentElement.clientHeight;
      // HOT's own container is the real clipping boundary when it's smaller than
      // the viewport (e.g. a fixed-height table embedded in a page).
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
      dropdownHeight      = Math.max(ROW_HEIGHT, Math.min(wantedH, available - 4));
      this.htOptions.height = dropdownHeight;
    }

    super.open();

    // --- Phase 2 -----------------------------------------------------------
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

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        // translateY shifts the element relative to its current rendered
        // position, avoiding any dependency on TEXTAREA_PARENT's coordinates.
        // Target: dropdown bottom flush with the cell's TOP edge.
        // dropdownRect.top is where the dropdown currently starts; adding
        // dropdownHeight gives the unclipped bottom we are targeting.
        const delta = cellRect.top - (dropdownRect.top + dropdownHeight);
        this.htContainer.style.transform = `translateY(${delta}px)`;
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
