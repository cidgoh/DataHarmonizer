const createHot = (data) => {
  return new Handsontable($('#grid')[0], {
    data: getRows(DATA),
    columns: getDropdowns(DATA),
    colHeaders: true,
    rowHeaders: true,
    fixedRowsTop: 2,
    fixedColumnsLeft: 1,
    minRows: 1000,
    minSpareRows: 100,
    width: '100%',
    height: '75vh',
    hiddenColumns: {
      copyPasteEnabled: true,
      indicators: true,
      columns: []
    },
    licenseKey: 'non-commercial-and-evaluation',
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

const importFile = (file, ext, hot, xlsx) => {
  const fileReader = new FileReader();
  if (ext === 'xlsx') {
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, {type: 'binary'});
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetCsvStr = XLSX.utils.sheet_to_csv(firstSheet);
      HOT.loadData(sheetCsvStr.split('\n').map(line => line.split(',')));
    };
  } else if (ext === 'tsv') {
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      HOT.loadData(e.target.result.split('\n').map(line => line.split('\t')));
    };
  } else if (ext === 'csv') {
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      HOT.loadData(e.target.result.split('\n').map(line => line.split(',')));
    };
  }
};

const validateGrid = (hot) => {
  hot.updateSettings({
    cells: function(row, col, prop) {
      if (row === 0 || row === 1) {
        return {readOnly: true};
      } else {
        if (this.source !== undefined) {
          let valid = false;
          const cellVal = hot.getDataAtCell(row, col);
          if (cellVal !== null) {
            if (this.source.map(sourceVal => sourceVal.trim().toLowerCase())
                .includes(cellVal.trim().toLowerCase())) {
              valid = true;
            }
          }
          if (!valid) hot.setCellMeta(row, col, 'className', 'invalid-cell');
        }
      }
    },
  })
};

$(document).ready(() => {
  window.HOT = createHot(DATA);

  $('#new-dropdown-item, #clear-data-confirm-btn').click((e) => {
    if (e.target.id === 'new-dropdown-item') {
      if ((HOT.countRows() - HOT.countEmptyRows()) !== 2) {
        $('#clear-data-warning-modal').modal('show');
      }
    } else {
      HOT.destroy();
      window.HOT = createHot();
    }
  });

  $('#open-file-input').change(() => {
    const file = $('#open-file-input')[0].files[0];
    const ext = file.name.split('.').pop();
    const acceptedExts = ['xlsx', 'tsv', 'csv'];

    if (!acceptedExts.includes(ext)) {
      const errMsg = `Only ${acceptedExts.join(', ')} files are supported`;
      $('#open-err-msg').text(errMsg);
      $('#open-error-modal').modal('show');
    } else {
      importFile(file, ext, HOT, XLSX);
    }

    $('#open-file-input')[0].value = '';
  });

  $('#save-as-confirm-btn').click((e) => {
    try {
      const baseName = $('#base-name-save-as-input').val();
      const ext = $('#file-ext-save-as-select').val();
      if (ext === 'xlsx') {
        exportToXlsx(HOT.getData(), baseName, XLSX);
      } else if (ext === 'tsv') {
        exportToTsv(HOT.getData(), baseName, XLSX);
      } else if (ext === 'csv') {
        HOT.getPlugin('exportFile').downloadFile('csv', {filename: baseName});
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

  $('#validate-btn').click(() => void validateGrid(HOT));

  $('#view_all_fields, #view_recommended_fields').on('click', function() {

    const hiddenColumns = [1, 2, 9]
    // access to hiddenColumns plugin instance:
    const hiddenColumnsPlugin = hot.getPlugin('hiddenColumns');

    if ($(this).is('#view_all_fields')) {
      hiddenColumnsPlugin.showColumns(hiddenColumns);
    }
    else {
      hiddenColumnsPlugin.hideColumns(hiddenColumns);
    }

    // rerender the table to see all changes
    hot.render();

  })

});
