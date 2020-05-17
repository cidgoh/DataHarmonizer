const createHot = (data) => {
  return new Handsontable($('#grid')[0], {
    data: getRows(DATA),
    columns: getDropdowns(DATA),
    colHeaders: true,
    rowHeaders: true,
    minRows: 1000,
    minSpareRows: 100,
    width: '100%',
    height: '75vh',
    readOnlyCellClassName: 'read-only',
    cells: (row) => {
      if (row === 0 || row === 1) {
        return {readOnly: true};
      }
    },
    afterRender: () => void $('#header-row').css('visibility', 'visible'),
  });
};

const getRows = (data) => {
  const rows = [[], []];
  for (const parent of data) {
    rows[0].push(parent.fieldName);
    rows[0].push(...Array(parent.children.length - 1).fill(''));
    rows[1].push(...parent.children.map(child => child.fieldName));
  }
  return rows;
};

const getDropdowns = (data) => {
  const fields =
      Array.prototype.concat.apply([], data.map(parent => parent.children));
  const vocabularies = fields.map(child => child.vocabulary);
  const ret = [];
  for (const vocabulary of vocabularies) {
    if (Object.keys(vocabulary).length) {
      ret.push({
        type: 'autocomplete',
        source: stringifyNestedVocabulary(vocabulary),
        validator: function(val, callback) {
          let isValid = false;
          for (const validVal of this.source) {
            if (val.trim().toLowerCase() === validVal.trim().toLowerCase()) {
              isValid = true;
              if (val !== validVal) {
                this.instance.setDataAtCell(this.row, this.col, validVal);
              }
              break;
            }
          }
          callback(isValid);
        },
      });
    } else ret.push({});
  }
  return ret;
};

const stringifyNestedVocabulary = (vocabulary, level=0) => {
  if (Object.keys(vocabulary).length === 0) {
    return [];
  }

  let ret = [];
  for (const val of Object.keys(vocabulary)) {
    ret.push('  '.repeat(level) + val);
    ret = ret.concat(stringifyNestedVocabulary(vocabulary[val], level+1));
  }
  return ret;
};

const exportToXlsx = (matrix, baseName, xlsx) => {
  const worksheet = xlsx.utils.aoa_to_sheet(matrix);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  xlsx.writeFile(workbook, `${baseName}.xlsx`);
};

const exportToTsv = (matrix, baseName, xlsx) => {
  const worksheet = xlsx.utils.aoa_to_sheet(matrix);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  xlsx.writeFile(workbook, `${baseName}.tsv`, {bookType: 'csv', FS: '\t'});
};

$(document).ready(() => {
  window.hot = createHot(DATA);

  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    if (e.target.id === 'new-dropdown-item') {
      if ((hot.countRows() - hot.countEmptyRows()) !== 2) {
        $('#clear-data-warning-modal').modal('show');
      }
    } else {
      hot.destroy();
      window.hot = createHot();
    }
  });

  $('#save-as-confirm-btn').click((e) => {
    try {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      if (ext === 'xlsx') {
        exportToXlsx(hot.getData(), baseName, XLSX);
      } else if (ext === 'tsv') {
        exportToTsv(hot.getData(), baseName, XLSX);
      } else if (ext === 'csv') {
        hot.getPlugin('exportFile').downloadFile('csv', {filename: baseName});
      }
      $('#save-as-modal').modal('hide');
    } catch (err) {
      $('#save-as-err-msg').text(err.message);
    }
  });
  $('#save-as-modal').on('hidden.bs.modal', () => {
    $('#save-as-err-msg').text('');
    $('#base-name-save-as-input').val('');
  });
});
