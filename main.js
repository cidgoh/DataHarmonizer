$(document).ready(() => {
  new Handsontable($('#grid')[0], {
    data: DATA.data,
    columns: DATA.columns,
    colHeaders: true,
    rowHeaders: true,
    minRows: 1000,
    minSpareRows: 100,
    readOnlyCellClassName: 'read-only',
    cells: (row) => {
      if (row === 0 || row === 1) {
        return {readOnly: true};
      }
    },
  });
});
