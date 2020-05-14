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
      ret.push({type: 'dropdown', source: Object.keys(vocabulary)});
    } else ret.push({});
  }
  return ret;
};

$(document).ready(() => {
  new Handsontable($('#grid')[0], {
    data: getRows(DATA),
    columns: getDropdowns(DATA),
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
