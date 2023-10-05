import Handsontable from "handsontable";
import i18next from "i18next";

export function combineRenderer(baseRenderer, customRenderer) {
    return function(instance, td, row, col, prop, value, cellProperties) {
        // First, use the base renderer (autocomplete in this case)
        baseRenderer.apply(this, arguments);
        
        // Then, apply the custom renderer
        customRenderer.apply(this, arguments);
    };
}

// localization renderer for Handsontable
export function i18nContentRenderer(instance, td, row, col, prop, value, cellProperties) {
    const localizedValue = i18next.t(value);
    td.innerHTML = localizedValue;
}

function i18nHeaderRenderer(instance, td, row, col, prop, value, cellProperties) {
    const field = fields[col];
    if (field && field.alias && field.alias) {
        td.setAttribute('data-i18n', field.alias);
        $(td).localize();
    }
}

export const LocalizedAutoCompleteRenderer = combineRenderer(Handsontable.renderers.AutocompleteRenderer, i18nContentRenderer);
export const LocalizedHeaderRenderer = combineRenderer(Handsontable.renderers.TextRenderer, i18nHeaderRenderer);

export function getLocalizedColumnLabel(colIndex) {
    const field = fields[colIndex];
    if (field && field.metadata && field.metadata.label) {
        return field.metadata.label;
    }
    // Return default header for this column index if no custom label is found
    return Handsontable.helper.spreadsheetColumnLabel(colIndex);
}
