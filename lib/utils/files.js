import { utils as XlsxUtils, writeFile } from 'xlsx/xlsx.mjs';
import { saveAs } from 'file-saver';

export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
}

/**
 * Improve `XLSX.utils.sheet_to_json` performance for Libreoffice Calc files.
 * Ensures sheet range is accurate. See
 * https://github.com/SheetJS/sheetjs/issues/764 for more detail.
 * @param {Object} worksheet SheetJs object.
 * @returns {Object} SheetJs worksheet with correct range.
 */
export function updateSheetRange(worksheet) {
  const range = { s: { r: 20000000, c: 20000000 }, e: { r: 0, c: 0 } };
  Object.keys(worksheet)
    .filter((x) => {
      return x.charAt(0) !== '!';
    })
    .map(XlsxUtils.decode_cell)
    .forEach((x) => {
      range.s.c = Math.min(range.s.c, x.c);
      range.s.r = Math.min(range.s.r, x.r);
      range.e.c = Math.max(range.e.c, x.c);
      range.e.r = Math.max(range.e.r, x.r);
    });
  worksheet['!ref'] = XlsxUtils.encode_range(range);
  return worksheet;
}

/**
 * Download matrix to file.
 * Note that BOM and UTF-8 can create problems on some systems when importing
 * file.  See "Supported Output Formats" and "UTF-16 Unicode Text" sections of
 * https://reactian.com/sheetjs-community-edition-spreadsheet-data-toolkit/
 * and https://github.com/SheetJS/sheetjs
 * Solution at bottom of: https://github.com/SheetJS/sheetjs/issues/943
 * The "Comma Separated Values" format is actually UTF-8 with BOM prefix.
 * @param {Array<Array<String>>} matrix Matrix to download.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 */
export function exportFile(matrix, baseName, ext) {
  const worksheet = XlsxUtils.aoa_to_sheet(matrix);
  const workbook = XlsxUtils.book_new();
  let csv;
  let blob;
  XlsxUtils.book_append_sheet(workbook, worksheet, 'Sheet1');
  switch (ext) {
    case 'xlsx':
      writeFile(workbook, `${baseName}.xlsx`);
      break;
    case 'xls':
      writeFile(workbook, `${baseName}.xls`);
      break;
    case 'tsv':
      writeFile(workbook, `${baseName}.tsv`, {
        bookType: 'csv',
        FS: '\t',
      });
      break;
    case 'csv':
      writeFile(workbook, `${baseName}.csv`, {
        bookType: 'csv',
        FS: ',',
      });
      break;
    case 'tsv (UTF-16)':
      writeFile(workbook, `${baseName}.tsv`, {
        bookType: 'txt',
        FS: '\t',
      });
      break;
    case 'csv (UTF-16)':
      writeFile(workbook, `${baseName}.csv`, {
        bookType: 'txt',
        FS: ',',
      });
      break;
    case 'csv (UTF-8, no BOM)':
      //Customization: skips BOM prefix '\uFEFF'
      csv = XlsxUtils.sheet_to_csv(worksheet, { FS: ',' });
      blob = new Blob([csv], { type: 'text/plain;charset=UTF-8' });
      //A FileSaver module call, avoids {autoBom: true} parameter
      saveAs(blob, `${baseName}.csv`);
      break;
    case 'csv (ASCII)':
      //Customization: skips BOM prefix, as above.
      csv = XlsxUtils.sheet_to_csv(worksheet, { FS: ',' });
      blob = new Blob([csv], { type: 'text/plain;charset=us-ascii' });
      saveAs(blob, `${baseName}.csv`);
      break;
  }
}

/**
 * Download Object to file as JSON.
 * @param {Object} data Object to download as JSON.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 */
export function exportJsonFile(data, baseName) {
  let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  saveAs(blob, `${baseName}.json`);
}
