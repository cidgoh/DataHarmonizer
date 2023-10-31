import Handsontable from 'handsontable';
import i18next from 'i18next';
// https://jsfiddle.net/handsoncode/f0b41jug/

/**
 * The cell type adds supports for displaing the label value except the key in the key-value
 * dropdown editor type.
 */
export default class KeyValueListEditor extends Handsontable.editors
  .HandsontableEditor {
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
        console.log(value, row, instance);
        if (instance) {
          const _id = instance.getDataAtRowProp(row, '_id');
          const label = instance.getDataAtRowProp(row, 'label');
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
    if (this.htEditor) {
      this.htEditor.destroy();
    }

    this.htEditor = new Handsontable(this.htContainer, this.htOptions);
  }

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

  getValue() {
    const value = super.getValue();
    console.log(value);

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
    // value = item.label;
    const _id = item._id;
    const label = item.label;
    value = i18next.t(_id) !== _id ? i18next.t(_id) : label;
  }

  // Use the ID as the translation key for the data-i18n attribute
  TD.setAttribute('data-i18n', item ? item._id : '');

  Handsontable.renderers
    .getRenderer('autocomplete')
    .call(hot, hot, TD, row, col, prop, value, cellProperties);
};

// Handsontable.cellTypes.registerCellType('key-value-list', {
//   editor: KeyValueListEditor,
//   validator: keyValueListValidator,
//   renderer: keyValueListRenderer,
// });
