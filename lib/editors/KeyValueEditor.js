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
      const data = self.htOptions.data;

      // First pass: find which optgroups have at least one visible item.
      const visibleGroups = new Set();
      data.forEach(row => {
        if (!row.isGroupHeader && row.label.toLowerCase().includes(text)) {
          visibleGroups.add(row.optgroup);
        }
      });

      const hide = [];
      const show = [];
      data.forEach((row, index) => {
        const visible = row.isGroupHeader
          ? (!text || visibleGroups.has(row.optgroup))
          : row.label.toLowerCase().includes(text);
        if (visible) show.push(index);
        else hide.push(index);
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
      cells: function(row) {
        var cellProp = {};
        const src = cellProperties.source[row];
        if (src?.isGroupHeader) {
          // Group headers are visual only — prevent them from being selected.
          cellProp.className = 'dh-group-header';
          cellProp.readOnly  = true;
        } else {
          cellProp.className = 'selectDepth_' + (src?.depth || '0');
        }
        return cellProp;
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

    // Phase 3: select and scroll to the row matching the cell's current value.
    // Without this, HandsontableEditor.open() always calls deselectCell() (non-strict
    // mode), leaving no row highlighted and causing finishEditing() to fall through
    // to the raw TEXTAREA value (the _id string) rather than using the inner HOT
    // selection — which can result in the wrong value being committed on click-away.
    // Selecting col 1 (the visible label column) gives proper visual row highlighting.
    //
    // Deferred one animation frame: BaseEditor.beginEditing() calls view.render() and
    // focus() synchronously after open() returns, which can trigger a re-render or DOM
    // event on the inner HOT that clears the selection before the first paint.  The rAF
    // fires after all synchronous post-open activity has settled so the selection sticks.
    if (this.originalValue != null && this.originalValue !== '') {
      const htEditor = this.htEditor;
      const originalValue = this.originalValue;
      if (htEditor) {
        const ids = htEditor.getDataAtProp('_id');
        const idx = ids.findIndex(id => id === originalValue);
        if (idx !== -1) {
          requestAnimationFrame(() => {
            if (htEditor && !htEditor.isDestroyed) {
              htEditor.selectCell(idx, 1);
              htEditor.scrollViewportTo({ row: idx, col: 1 });
            }
          });
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
        // Guard: never commit group-header rows as a real value.
        if (this.cellProperties.source[row]?.isGroupHeader) {
          return this.originalValue ?? '';
        }
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
    // Group-header items (isGroupHeader: true) are not valid selections.
    const item = this.source.find(({ _id }) => _id === value);
    callback(item && !item.isGroupHeader ? true : false);
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
  // Just-in-time principle: the renderer shows only a lightweight arrow + label.
  // The inner HOT dropdown is built lazily in KeyValueListEditor.open() when the
  // user actually clicks to edit — nothing heavy happens at render time.
  //
  // Use the text renderer (not 'autocomplete') for base cell styling.
  // The autocomplete renderer sets innerHTML internally, which we would then
  // immediately overwrite — two HTML-parse cycles per cell per render.
  // Chrome Performance trace confirmed this was 630 ms / render on GRDI_1m.
  Handsontable.renderers
    .getRenderer('text')
    .apply(this, [hot, TD, row, col, prop, value, cellProperties]);
  TD.classList.add('htAutocomplete'); // retain autocomplete cell styling

  const item = cellProperties.source.find(_x => _x._id === value);
  const label = item?.label ?? value ?? '';

  // Build cell content with DOM nodes — no innerHTML, no HTML parsing cost.
  const doc = TD.ownerDocument;
  TD.textContent = '';  // clear the value the text renderer placed
  const arrow = doc.createElement('div');
  arrow.className = 'htAutocompleteArrow';
  arrow.textContent = '▼';
  TD.appendChild(arrow);
  TD.appendChild(doc.createTextNode(label));
};

export const multiKeyValueListRenderer = function (hot, TD, row, col, prop, value, cellProperties) {
  // Just-in-time principle: renderer shows a lightweight arrow + translated labels.
  // The inner HOT dropdown is built lazily in KeyValueListEditor.open() on click.
  //
  // text renderer replaces autocomplete renderer — the autocomplete renderer sets
  // innerHTML internally (then we overwrote it with our own TD.innerHTML), causing
  // two HTML-parse cycles per cell per render.  Chrome trace showed 630 ms self
  // time in "set innerHTML" per drag render on GRDI_1m.  DOM nodes avoid this.
  Handsontable.renderers
    .getRenderer('text')
    .apply(this, [hot, TD, row, col, prop, value, cellProperties]);
  TD.classList.add('htAutocomplete'); // retain autocomplete cell styling

  let label = '';
  // Translate multiple stored _id values to their display labels.
  if (!isEmptyUnitVal(value)) {
    const src = cellProperties.source || [];
    label = value
      .split(MULTIVALUED_DELIMITER)
      .map((value_item) => {
        const choice = src.find(({ _id }) => _id === value_item);
        return choice ? choice.label : value_item;
      })
      .join(MULTIVALUED_DELIMITER);
  }

  // Build cell content with DOM nodes — no innerHTML, no HTML parsing cost.
  const doc = TD.ownerDocument;
  TD.textContent = '';  // clear the value the text renderer placed
  const arrow = doc.createElement('div');
  arrow.className = 'htAutocompleteArrow';
  arrow.textContent = '▼';
  TD.appendChild(arrow);
  TD.appendChild(doc.createTextNode(label));
};

