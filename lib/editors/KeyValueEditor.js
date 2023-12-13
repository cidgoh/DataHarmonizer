import Handsontable from 'handsontable';
import i18next from 'i18next';

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

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      columns: [
        {
          data: '_id',
        },
        {
          data: 'label',
        },
      ],
      hiddenColumns: {
        columns: [1],
      },
      colWidths: 150,
      beforeValueRender(value, { row, instance }) {
        if (instance) {
          const _id = instance.getDataAtRowProp(row, '_id');
          const label = instance.getDataAtRowProp(row, 'label');
          console.log(`${_id}, ${label}`);
          const translated_value =
            i18next.t(_id) !== _id ? i18next.t(_id) : label;
          return translated_value;
        }
        return value;
      },
    });

    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }

    // HACK: these two lines were in the original code provided, yet appear to result in an error in our code.
    // I've commented them out, they don't appear necessary otherwise. The beforeValueRender function works just fine.
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
  hot,
  TD,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  const item = cellProperties.source.find(({ _id }) => _id === value);

  if (item) {
    const _id = item._id;
    const label = item.label;
    // TODO: use meaning as label instead?
    value = i18next.t(_id) !== _id ? i18next.t(_id) : label;
  }

  // Use the ID as the translation key for the data-i18n attribute
  item ? TD.setAttribute('data-i18n', item._id) : undefined;

  Handsontable.renderers
    .getRenderer('autocomplete')
    .call(hot, hot, TD, row, col, prop, value, cellProperties);
};