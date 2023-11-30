// rules
// - agg methods for HoT commands/modifiers
// - single methods for non-HoT commands/modifiers

// highly non-performant
// should be replaced in larger rewrite
class DataHarmonizerWrapper {
    
    dataHarmonizers = [];
    constructor(...dataHarmonizers) {
        this.dataHarmonizers = dataHarmonizers; 
    }

    // Implement iterable interface
    *[Symbol.iterator]() {
        for (const dh of this.dataHarmonizers) {
            yield dh;
        }
    }

    // TODO - singular?
    getInferredIndexSlot() {
        return this.dataHarmonizers.map(dh => dh.getInferredIndexSlot())[0] //?;
    }
   
    // TODO - singular?
    // ?
    getDataObjects(options = {}) {
        // aggregation?
        // BOO! different merge semantics because it returns two different types! (AoS/SoA)
        // TODO: refactor the method into pre- and post-process
        return this.dataHarmonizers.flatMap
    }

    // TODO: individual?
    getColumnCoordinates() {
        return this.dataHarmonizers.flatMap(dh => dh.getColumnCoordinates());
    }

    getFlatHeaders() {
        return this.dataHarmonizers.flatMap(dh => dh.getFlatHeaders());
    }

    getTrimmedData() {
        return this.dataHarmonizers.flatMap(dh => dh.getTrimmedData());
    }

    // TODO: duplicates?
    getFields() {
        return this.dataHarmonizers.flatMap(dh => dh.getFields());
    }

    getFieldNameMap(fields) {
        return this.dataHarmonizers.reduce((acc, dh) => {
            return Object.assign(acc, dh.getFieldNameMap(fields));
        }, {})
    }

    getHeaderMap(exportHeaders, fields, prefix) {
        this.dataHarmonizers.forEach(dh => dh.getHeaderMap(exportHeaders, fields, prefix));
    }

    // TODO: merge semantics?
    // TODO: will this result in duplicates?
    getMappedField (
        headerName,
        sourceRow,
        sourcetitles,
        sourceFields,
        titleMap,
        delimiter,
        prefix,
        nullOptionsMap = null,
        skipNull = false        
    ) {
        return this.dataHarmonizers.flatMap(dh => dh.getMappedField(
            headerName,
            sourceRow,
            sourcetitles,
            sourceFields,
            titleMap,
            delimiter,
            prefix,
            nullOptionsMap,
            skipNull
        ))
    }

    getRowMap() {
        this.dataHarmonizers.forEach(dh => dh.getRowMap(sourceRow, sourceFields, RuleDB, fields, titleMap, prefix));
    }

    fixNullOptionCase(element, nullOptionsMap) {
        this.dataHarmonizers.forEach(dh => dh.fixNullOptionCase(element, nullOptionsMap));
    }

    setDateChange(dateGranularity, dateString, dateBlank = '__') {
        this.dataHarmonizers.forEach(dh => dh.setDateChange(dateGranularity, dateString, dateBlank));
    }

    showAllColumns() {
        this.dataHarmonizers.forEach(dh => dh.showAllColumns());
    }

    showRequiredColumns() {
        this.dataHarmonizers.forEach(dh => dh.showRequiredColumns());
    }

    showRecommendedColumns() {
        this.dataHarmonizers.forEach(dh => dh.showRecommendedColumns());
    }

    showColumnsBySectionTitle (sectionTitle, showFirstColumn = true) {
        this.dataHarmonizers.forEach(dh => dh.showColumnsBySectionTitle(sectionTitle, showFirstColumn));
    }

    scrollTo(row, column) {
        this.dataHarmonizers.forEach(dh => dh.scrollTo(row, column));
    }

    changeRowVisbility(targetId) {
        this.dataHarmonizers.forEach(dh => dh.changeRowVisbility(targetId));
    }
    
    runBehindLoadingScreen(process, args) {
        // PROBLEM: run conditions
        this.dataHarmonizers.forEach(dh => dh.runBehindLoadingScreen(process, args));
    }

    changeRowVisbility(targetId) {
        this.dataHarmonizers.forEach(dh => dh.changeRowVisbility(targetId))
    }
    useSchema(schema, exportFormats, template_name) {
        this.dataHarmonizers.forEach(dh => dh.useSchema(schema, exportFormats, template_name));
    }

    addRowsToBottom(numRows) {
        this.dataHarmonizers.forEach(dh => dh.addRowsToBottom(numRows));
    }

    newHotFile() {
        this.dataHarmonizers.forEach(dh => dh.newHotFile());
    }
    render () {
        this.dataHarmonizers.forEach(dh => dh.render());
    }

    // TODO: reference should be a separate component for multiple HoT instances
    renderReference(mystyle = null) {
        this.dataHarmonizers.forEach(dh => dh.renderReference(mystyle))
    }

    openFile (file) {
        this.dataHarmonizers.forEach(dh => dh.openFile(file));
    }

    newHotFile () {
        this.dataHarmonizers.forEach(dh => dh.createHot());
    }

    get template () {
        return this.dataHarmonizers[0].template;
    }

    // hot methods
    // need way of addressing HoTs
    // for now assume first HoT
    get countRows () {
        return this.dataHarmonizers[0].hot.countRows();
    }
    get countEmptyRows () {
        return this.dataHarmonizers[0].hot.countEmptyRows();
    }
    

    get current_selection () {}
    set current_selection (selection) {}

    get invalid_cells () {}
    set invalid_cells (cells) {}

    // object
    get export_formats () {}

    get template () {}
    get template_name () {}
    get table () {}
    get hot() {}

 
}