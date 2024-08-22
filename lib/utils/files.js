import { utils as XlsxUtils, writeFile } from 'xlsx/xlsx.mjs';
import { saveAs } from 'file-saver';

/**
 * Asynchronously accesses and imports a module from a specified folder path.
 *
 * This function dynamically imports a module from a given folder path using
 * the provided `folder_path`. It returns the default export of the module.
 * If the import fails, an error message is logged, and an optional default
 * or fallback value is returned.
 *
 * NOTE: relies on webpack to have made the files
 *
 * @param {string} folder_path - The relative path to the folder containing the module.
 * @returns {Promise<any>} - A promise that resolves with the module's default export
 *                          or the specified default/fallback value on failure.
 */
export async function fetchFileAsync(filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const contentType = response.headers.get('Content-Type');
    if (contentType.includes('json')) return await response.json();
    if (contentType.includes('text')) return await response.text();
    if (contentType.includes('image')) return await response.blob();

    return await response.text();
  } catch (error) {
    console.error(`Failed to load ${filePath}: ${error}`);
    throw error;
  }
}

// const binaryToUtf8 = (binaryString) => {
//   // Create a Uint8Array from the binary string
//   const byteArray = new Uint8Array(binaryString.length);
//   for (let i = 0; i < binaryString.length; i++) {
//     byteArray[i] = binaryString.charCodeAt(i);
//   }

//   // Use TextDecoder to convert the Uint8Array to a UTF-8 string
//   const utf8String = new TextDecoder().decode(byteArray);

//   return utf8String;
// };

const arrayBufferToUtf8 = (arrayBuffer) => {
  // Create a Uint8Array from the ArrayBuffer
  const byteArray = new Uint8Array(arrayBuffer);

  // Use TextDecoder to convert the Uint8Array to a UTF-8 string
  const utf8String = new TextDecoder().decode(byteArray);

  return utf8String;
};

// reads file from local location
export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve({
        binary: reader.result,
        text: arrayBufferToUtf8(reader.result),
      });
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file); // replace deprecated
    // reader.readAsText(file, 'UTF-8');  // special char loading
    // reader.readAsBinaryString(file);
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

const DEFAULT_SHEETNAME = 'Sheet1';

// take the struct of arrays and convert to a set of sheets
export function createWorkbookFromJSON(jsonData) {
  const workbook = XlsxUtils.book_new();

  // Loop through each sheet in the data object
  for (const sheetName in jsonData) {
    const sheetData = jsonData[sheetName];

    // Convert data to an array of arrays for xlsx
    const worksheet = XlsxUtils.json_to_sheet(sheetData);

    // Add the worksheet to the workbook
    XlsxUtils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return workbook;
}

function writeWorkbook(workbook, baseName, ext, opt = {}) {
  if (ext === 'xlsx' || ext === 'xls') {
    // can support multiple sheets in one file
    writeFile(workbook, `${baseName}.${ext}`, opt);
  } else {
    // cannot support multiple sheets in one file
    // handle multiple sheeted workbook
    workbook.SheetNames.forEach((sheetName) => {
      const workbook_for_sheet = XlsxUtils.book_new();
      XlsxUtils.book_append_sheet(
        workbook_for_sheet,
        workbook[sheetName],
        sheetName
      );
      writeFile(
        workbook_for_sheet,
        `${baseName}${
          sheetName !== DEFAULT_SHEETNAME ? `_${sheetName}` : ''
        }.${ext}`,
        opt
      );
    });
  }
}

/**
 * Download matrix to file.
 * Note that BOM and UTF-8 can create problems on some systems when importing
 * file.  See "Supported Output Formats" and "UTF-16 Unicode Text" sections of
 * https://reactian.com/sheetjs-community-edition-spreadsheet-data-toolkit/
 * and https://github.com/SheetJS/sheetjs
 * Solution at bottom of: https://github.com/SheetJS/sheetjs/issues/943
 * The "Comma Separated Values" format is actually UTF-8 with BOM prefix.
 * @param {Workbook} workbook workboox to download.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 */
export function exportWorkbook(workbook, baseName, ext) {
  switch (ext) {
    case 'xlsx':
    case 'xls':
      writeWorkbook(workbook, baseName, ext);
      break;
    case 'csv':
      processAndSave(
        workbook,
        baseName,
        'csv',
        ',',
        'text/plain;charset=UTF-8',
      );
      break;

    case 'csv (UTF-16)':
      processAndSave(
        workbook,
        baseName,
        'csv',
        ',',
        'text/plain;charset=UTF-16LE',
      );
      break;

    case 'tsv':
      processAndSave(
        workbook,
        baseName,
        'tsv',
        '\t',
        'text/plain;charset=UTF-8',
      );
      break;

    case 'tsv (UTF-16)':
      processAndSave(
        workbook,
        baseName,
        'tsv',
        '\t',
        'text/plain;charset=UTF-16LE',
      );
      break;

    case 'csv (UTF-8, no BOM)':
      processAndSave(
        workbook,
        baseName,
        'csv',
        ',',
        'text/plain;charset=UTF-8',
        false
      );
      break;

    case 'csv (ASCII)':
      processAndSave(
        workbook,
        baseName,
        'csv',
        ',',
        'text/plain;charset=us-ascii',
        false
      );
      break;
  }
}

function processAndSave(
  workbook,
  baseName,
  ext,
  delimiter,
  mimeType,
  includeBOM = true
) {
  const sheets = workbook.SheetNames;
  sheets.forEach((sheetName) => {
    let data = '';

    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XlsxUtils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(worksheet, sheetData);

    const formattedData = sheetData
      .map((row) => row.join(delimiter))
      .join('\n');
    data += formattedData + '\n';

    if (includeBOM && mimeType.includes('UTF-8')) {
      data = '\uFEFF' + data;
    }

    const blob = new Blob([data], { type: mimeType });
    saveAs(
      blob,
      `${baseName}${sheets.length > 1 ? `_${sheetName}` : ''}.${
        ext.split(' ')[0]
      }`
    );
  });
}

// TODO: refactor to export matrix
export function exportFile(matrix, baseName, ext) {
  const worksheet = XlsxUtils.aoa_to_sheet(matrix);
  const workbook = XlsxUtils.book_new();
  XlsxUtils.book_append_sheet(workbook, worksheet, DEFAULT_SHEETNAME);
  return exportWorkbook(workbook, baseName, ext);
}

/**
 * Download Object to file as JSON.
 * @param {Object} data Object to download as JSON.
 * @param {String} baseName Basename of downloaded file.
 * @param {String} ext Extension of downloaded file.
 */
export function exportJsonFile(data, baseName) {
  // pretty print by default
  let blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  saveAs(blob, `${baseName}.json`);
}

// A function that processes JSON data based on its type (Array or Object)
function processJsonBasedOnType(jsonData, handleObject, handleArray) {
  if (Array.isArray(jsonData)) {
    return handleArray(jsonData);
  } else if (typeof jsonData === 'object' && jsonData !== null) {
    return handleObject(jsonData);
  } else {
    throw new Error(
      'Unexpected JSON type: JSON is neither an object nor an array'
    );
  }
}

// Function to import and process a JSON file
export function importJsonFile(jsonData) {
  return processJsonBasedOnType(
    jsonData,
    (data) => {
      // TODO: this required fields problem is only when loading DH files, not DH templates
      // Loader is doubled up?
      // Check if the object has all required fields
      const requiredFields = ['schema', 'version', 'in_language', 'Container'];
      const requiredFieldTest = (field) => typeof data[field] !== 'undefined';
      const requiredFieldsFilterArray = requiredFields.map(requiredFieldTest);
      if (!requiredFieldsFilterArray.every((id) => id)) {
        const missingFields = requiredFieldsFilterArray.reduce(
          (acc, test, idx) => {
            return !test ? acc.concat(requiredFields[idx]) : acc;
          },
          []
        );
        throw new Error(
          `The JSON file's schema is not compatible for loading! Missing fields: ${missingFields}`
        );
      }
      return {
        container: data.Container,
        schema: data.schema,
        in_language: data.in_language,
      };
    },
    (data) => ({ data, in_language: 'en' }) // Handling JSON arrays
  );
}

// Main function to handle the entire process of prepending row to sheets
// Useful for custom binning headers like sections
// NOTE: in-place function!
export const modifySheetRow = (workbook, sheetName, valueCellPairs, targetRow) => {
  
  // Utility function to read a worksheet and convert it to a 2D array
  const getSheetData = (workbook, sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    return XlsxUtils.sheet_to_json(worksheet, { header: 1 });
  };

  // Utility function to update the worksheet in the workbook
  const updateWorksheet = (workbook, sheetName, data) => {
    const newWorksheet = XlsxUtils.aoa_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;
  };

  // Function to populate or prepend a row in a worksheet
  const populateOrPrependRow = (data, valueCellPairs, targetRow) => {
    if (targetRow === undefined || targetRow < 0 || targetRow >= data.length) {
      data.unshift([]);
      targetRow = 0;
    }

    for (const [colIndex, value] of Object.entries(valueCellPairs)) {
      data[targetRow][Number(colIndex)] = value;
    }
  };

  const data = getSheetData(workbook, sheetName);
  populateOrPrependRow(data, valueCellPairs, targetRow);
  updateWorksheet(workbook, sheetName, data);
};

export const prependToSheet = (workbook, sheetName, valueCellPairs) => modifySheetRow(workbook, sheetName, valueCellPairs);

// Main function to handle the entire process across all sheets
export function prependRowWithValuesAcrossSheets(workbook, valueCellPairs) {
  const newWorkbook = structuredClone(workbook);
  newWorkbook.SheetNames.forEach(sheetName => {
    prependToSheet(newWorkbook, sheetName, valueCellPairs[sheetName]);
  });
  return newWorkbook;
}