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
   * @param {number} row The row index of the cell being edited.
   * @param {number} col The column index of the cell being edited.
   * @param {string} prop The property name or column index of the cell being edited.
   * @param {HTMLElement} td The HTML element for the cell.
   * @param {any} value The value of the cell.
   * @param {object} cellProperties The properties of the cell.
   */
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);
    // Setting for pulldown menu display

    // Adding dynamic filter
    // If set outside loop, choices has correct td.innerText and yet strangely
    // no longer has real td elements to reference. so caching inside loop
    let choices = false;
    this.TEXTAREA.addEventListener('keyup',function(e) {
      const text = e.target.value.toLowerCase();// word typed so far.
      
      if (!choices) {
        choices = this.nextElementSibling.querySelectorAll('td');
      }

      for (let choice of choices) {
        if (choice.innerText.toLowerCase().includes(text)) {
          choice.parentNode.classList.remove('hide');
        }
        else {
          choice.parentNode.classList.add('hide');
        }
      };
    });

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      colWidths: '250', 
      columns: [
        {
          data: '_id',
        },
        {
          data: 'label',
        }
      ],
      hiddenColumns: {
        columns: [0],
      },
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

    // These two lines were in the original code provided, yet appear to
    // result in an error. Apparently not necessary so commented out.
    // if (this.htEditor) {
    //   this.htEditor.destroy();
    // }
    // this.htEditor = new Handsontable(this.htContainer, this.htOptions);
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
  // Use the label as the display value but keep the _id as the stored value
  TD.innerHTML = `<div class="htAutocompleteArrow">▼</div>${item ? item.label : ''}`; // This directly sets what is displayed in the cell
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
