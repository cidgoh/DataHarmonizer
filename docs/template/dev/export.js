/**

Download secondary headers and grid data.
@param {String} baseName Basename of downloaded file.
@param {Object} hot Handonstable grid instance.
@param {Object} data See data.js.
@param {Object} xlsx SheetJS variable.
*/
var exportGeneric = (baseName, hot, data, xlsx, fileType) => {
    // Create an export table with template's headers (2nd row) and remaining rows of data
    const matrix = [getFlatHeaders(data)[1], ...getTrimmedData(hot)];
    runBehindLoadingScreen(exportFile, [matrix, baseName, fileType, xlsx]);
};
// A list of the above functions keyed by the Export menu name they should appear as:
var EXPORT_FORMATS = {
    "EXPORT_dev": {
        'method': exportGeneric,
        'fileType': 'tsv',
        'status': 'published'
    },
    //etc
};