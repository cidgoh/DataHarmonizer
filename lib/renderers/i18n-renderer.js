import Handsontable from 'handsontable';
import i18next from 'i18next';

export function combineRenderer(baseRenderer, customRenderer) {
  return function () //instance, td, row, col, prop, value, cellProperties
  {
    // First, use the base renderer (autocomplete in this case)
    baseRenderer.apply(this, arguments);

    // Then, apply the custom renderer
    customRenderer.apply(this, arguments);
  };
}

// localization renderer for Handsontable
/* eslint-disable */
export function i18nContentRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  const localizedValue = i18next.t(value);
  td.innerHTML = localizedValue;
}
/* eslint-enable */

export const LocalizedAutoCompleteRenderer = combineRenderer(
  Handsontable.renderers.AutocompleteRenderer,
  i18nContentRenderer
);