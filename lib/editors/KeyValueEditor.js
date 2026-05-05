import Handsontable from 'handsontable';
import { MULTIVALUED_DELIMITER} from '../utils/fields';
import { isEmptyUnitVal } from '../utils/general';

// Derived from: https://jsfiddle.net/handsoncode/f0b41jug/

/**
 * The cell type adds supports for displaying the label value except the key in the key-value
 * dropdown editor type.
 *
 * NOTE on filtering: The hiddenRows plugin is used to filter while keeping all source data
 * in the inner HOT. If filtering stops working after an updateSettings call, call
 * dropdownHotInstance.getPlugin('hiddenRows').enablePlugin() to re-enable the plugin.
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
    let self = this;

    function filter(event) {
      const text = (event.target || event.srcElement).value.toLowerCase();
      const hide = [];
      const show = [];
      self.htOptions.data.forEach((row, index) => {
        if (row.label.toLowerCase().includes(text))
          show.push(index);
        else
          hide.push(index);
      });
      self.hiddenRowsPlugin.showRows(show);
      self.hiddenRowsPlugin.hideRows(hide);

      if (self._flipAbove && self.htContainer) {
        const visibleCount = show.length;
        const newH = Math.max(23, Math.min(visibleCount * 23, self._dropdownMaxH));
        self.dropdownHotInstance.updateSettings({ height: newH });
        // Re-apply hidden rows in case updateSettings reset the plugin state
        self.hiddenRowsPlugin.showRows(show);
        self.hiddenRowsPlugin.hideRows(hide);
        self.dropdownHotInstance.render();
        self.htContainer.style.top = `${self._cellTop - newH}px`;
      } else {
        self.dropdownHotInstance.render();
      }
    }

    // Adding dynamic filter. Done as oninput since it only fires when the value actually
    // changes (not on arrow/modifier keys), and is reset each time user visits a table cell.
    this.TEXTAREA.oninput = filter;

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      rowHeaders: false,
      colWidths: 250,
      height: 200, // Initial height; overridden by open() based on available space.
      columns: [{data: '_id'},{data: 'label'}],
      hiddenColumns: {columns: [0]},
      hiddenRows: {rows: []},
      /*
      renderer: function(instance, td, row, col, prop, value, cellProperties) {
        // This custom renderer controls the appearance of each item in the dropdown list
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        console.log(instance, td, row, col, prop, value)
        td.innerHTML = `<span>⭐ ${value}</span>`; // Add custom HTML, icons, etc.
      },
      */
      cells: function(row, col) {
        var cellProp = {};
        // cellProperties.prop = 12 (column), cellProperties.row = the row.
        cellProp.className = 'selectDepth_' + (cellProperties.source[row]?.depth || '0');
        return cellProp
      },
      beforeValueRender(value, { row, instance }) {
        if (instance) { // i.e. an instance that has data: 'label' above?
          const label = instance.getDataAtRowProp(row, 'label');
          return label;
        }
        return value;
      },
    });

    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }

  }

  /**
   * Opens the dropdown, computing height and position based on available viewport space.
   * Phase 1: sets htOptions.height before super.open() constructs the inner HOT instance.
   * Phase 2: after render, flips above the cell using position:fixed if space below is tight.
   */
  open() {
    const ROW_HEIGHT = 23;
    const MAX_ROWS = 10;

    // Reset previous state
    this._flipAbove = false;
    this._cellTop = 0;
    this._dropdownMaxH = 0;
    if (this.htContainer) {
      this.htContainer.style.transform = '';
      this.htContainer.style.position = '';
      this.htContainer.style.top = '';
      this.htContainer.style.left = '';
      this.htContainer.style.width = '';
      this.htContainer.style.zIndex = '';
    }

    // Phase 1: compute height before inner HOT is constructed by super.open()
    if (this.TD && this.cellProperties) {
      const cellRect = this.TD.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      const hotBottom = this.hot.rootElement
        ? this.hot.rootElement.getBoundingClientRect().bottom : viewH;
      const effectiveBottom = Math.min(viewH, hotBottom);
      const spaceBelow = effectiveBottom - cellRect.bottom;
      const spaceAbove = cellRect.top;
      const wantedH = Math.min(
        (this.cellProperties.source || []).length, MAX_ROWS
      ) * ROW_HEIGHT;
      const willOpenAbove = spaceBelow < wantedH && spaceAbove > spaceBelow;
      const available = willOpenAbove ? spaceAbove : spaceBelow;
      const dropdownH = Math.max(ROW_HEIGHT, Math.min(wantedH, available - 4));
      this._dropdownMaxH = dropdownH;
      this.htOptions.height = dropdownH;
    }

    super.open();

    // Phase 2: flip above cell with position:fixed if space below is insufficient.
    // Use actual rendered height from getBoundingClientRect() (forces a synchronous layout
    // reflow) rather than the Phase 1 estimate, so positioning is accurate on first paint.
    if (this.TD && this.htContainer) {
      const actualH = this.htContainer.getBoundingClientRect().height;
      if (actualH > 0) {
        const cellRect = this.TD.getBoundingClientRect();
        const viewH = window.innerHeight || document.documentElement.clientHeight;
        const hotBottom = this.hot.rootElement
          ? this.hot.rootElement.getBoundingClientRect().bottom : viewH;
        const effectiveBottom = Math.min(viewH, hotBottom);
        const spaceBelow = effectiveBottom - cellRect.bottom;

        if (spaceBelow < actualH && cellRect.top > spaceBelow) {
          this._flipAbove = true;
          this._cellTop = cellRect.top;
          this._dropdownMaxH = actualH; // update to actual for filter resize path
          const w = this.htContainer.offsetWidth || 250;
          this.htContainer.style.position = 'fixed';
          this.htContainer.style.zIndex = '99999';
          this.htContainer.style.width = `${w}px`;
          this.htContainer.style.left = `${cellRect.left}px`;
          this.htContainer.style.top = `${cellRect.top - actualH}px`;
        }
      }
    }
  }

  // Done once each time user clicks on cell and menu is displayed.
  focus() {
    super.focus();

    // Helpers for filter() show/hide of rows via hiddenRows plugin:
    this.dropdownHotInstance = this.hot.getActiveEditor().htEditor;
    this.hiddenRowsPlugin = this.dropdownHotInstance.getPlugin('hiddenRows');
  }

  /**
   * Sets the value of the editor after finding the label associated with the _id key.
   *
   * @param {any} value The value to be set in the editor.
   */
  setValue(value) {
    if (this.htEditor) {
      const _id = this.htEditor.getDataAtProp('_id');
      const index = _id.findIndex((id) => id === value);

      if (index !== -1) {
        value = this.htEditor.getDataAtRowProp(index, 'label');
      }
    }
    super.setValue(value);
  }

  /**
   * Gets the value from the editor, translating the label to its associated _id key.
   *
   * @returns {any} The translated value or the original value if translation is not needed.
   */
  getValue() {
    const value = super.getValue();
    if (this.htEditor) {
      const labels = this.htEditor.getDataAtProp('label');
      const row = labels.indexOf(value);
      if (row !== -1) {
        return this.htEditor.getDataAtRowProp(row, '_id');
      }
    }
    return value;
  }
}

/**
 * Custom validator function for the KeyValueListEditor to validate cell values.
 *
 * @param {any} value The value to validate.
 * @param {function} callback A callback function to execute with the result of validation.
 */
export const keyValueListValidator = function (value, callback) {
  // Used AFTER user makes selection in menu. However the DH "Validate" button
  // uses other validation.

  let valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) { // === void 0 ~= undefined
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
  // RENDERER text that is shown is not validated directly.
  Handsontable.renderers
    .getRenderer('autocomplete')
    .apply(this, [hot, TD, row, col, prop, value, cellProperties]);

  const item = cellProperties.source.find(_x => _x._id === value);
  TD.innerHTML = `<div class="htAutocompleteArrow">▼</div>${item?.label || value || ''}`;

};

export const multiKeyValueListRenderer = function (hot, TD, row, col, prop, value, cellProperties) {
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
        //if (!(choice))
        //  console.warn(`"${value_item}" is not in permissible_values for "${cellProperties.name}" slot.`);
        return choice ? choice.label : value_item;
      })
      .join(MULTIVALUED_DELIMITER);
    }

    // This directly sets what is displayed in the cell on render()
    // Uses the label as the display value but keep the _id as the stored value
    TD.innerHTML = `<div class="htAutocompleteArrow">▼</div>${label}`;
    //}
  };

