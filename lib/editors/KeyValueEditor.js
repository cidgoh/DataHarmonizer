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
    let self = this;
    function filter(e, controller) {

      // A change in TD means we need to recalculate choices. Each TD prepare
      // seems to be generating new choices menu with new DOM elements.
      if (!controller.oldTD || controller.oldTD !== controller.TD) {
        controller.oldTD = controller.TD;
        controller.choices = controller.TEXTAREA.nextElementSibling.querySelectorAll('td');
      }

      const text = e.srcElement.value.toLowerCase();// word typed so far.

      controller.choices.forEach((choice, index) => {

        if (choice.innerText.toLowerCase().includes(text)) {
          choice.parentNode.classList.remove('hide');
        }
        else {
          choice.parentNode.classList.add('hide');
        }
      });
    }

    // Setting for pulldown menu display

    // Adding dynamic filter
    // DOM element textarea.handsontableInput , however, we make this relative
    // to event since there are other textareas around
    // It would be better to initialize this event watch on 
    // textarea.handsontableInput somewhere else but not sure where.
    // Done as an onkeyup() since its reset each time user visits a table cell.
    let choices = false;
    let oldTD = false;
    let controller = this;
    this.TEXTAREA.onkeyup = function(e) {filter(e, controller)};

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      colWidths: '250', 
      height: 200,
      columns: [{data: '_id'},{data: 'label'}],
      hiddenColumns: {columns: [0]},
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

