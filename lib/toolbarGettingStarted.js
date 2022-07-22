// TODO: these images add quite a bit of weight to the final bundles. Not
// necessarily a problem for the web bundle because it is designed to be
// loaded locally, but it may cause a bit of concern for users of the
// library bundle. I wonder if this type of documentation should be
// externalized anyway to make it easier to update and customize.
import editCopyPasteDelete from './images/editCopyPasteDelete.gif';
import toggleRequiredCols from './images/toggleRequiredCols.gif';
import doubleClickHeaders from './images/doubleClickHeaders.gif';
import selectingVals from './images/selectingVals.gif';
import validatingCells from './images/validatingCells.gif';
import exportingFiles from './images/exportingFiles.gif';

const slides = [
  {
    image: editCopyPasteDelete,
    caption: [
      `The contextual data collection template and validator
      application enables users to enter data as in an excel
      spreadsheet - type and pick values from dropdowns,
      copy/paste, add rows, etc.`,
    ],
  },
  {
    image: toggleRequiredCols,
    caption: [
      `Fields are colour-coded; required fields (minimal
      metadata) are yellow, strongly recommended fields are
      purple, optional fields are white.`,
      `You can toggle between all, and the required fields,
      by going to “Settings” and selecting “Show Required
      Columns”.`,
    ],
  },
  {
    image: doubleClickHeaders,
    caption: [
      `Double click on field headers to see the definition of
      the field, guidance on filling in the field, and
      examples of how data might look structured according
      to the constraints of the validator.`,
    ],
  },
  {
    image: selectingVals,
    caption: [
      `Picklists of controlled vocabulary are available for
      many fields. There are dropdown menus for some, and
      multi-select options for others (e.g. Signs and
      Symptoms). You can also see the list of terms in
      multi-select columns by clicking once in the
      multi-select box.`,
    ],
  },
  {
    image: validatingCells,
    caption: [
      `When you’re done entering your data, you can validate
      values by clicking on “Validate”. Errors and missing
      information in required fields will be coloured red.`,
    ],
  },
  {
    image: exportingFiles,
    caption: [
      `When you’ve entered and validated your data, you can
      save it as a .xlsx, .xls, .tsv or csv format file, by
      clicking on “File” followed by “Save as”. You can also
      format your data for IRIDA upload (you will need to
      perform the upload yourself), or use your entered data
      to create a GISAID submission form (you will need to
      add additional information, and perform the upload
      yourself), by clicking on "File" followed by "Export
      to".`,
      `If you have questions, or require assistance,
      contact emma.griffiths@bccdc.ca.`,
    ],
  },
];

export function getGettingStartedMarkup() {
  return `
<div
  class="carousel slide"
  id="getting-started-carousel"
  data-interval="false"
>
  <ol class="carousel-indicators">
    ${slides
      .map(
        (slide, idx) =>
          `<li
        data-target="#getting-started-carousel"
        data-slide-to="${idx}"
        ${idx === 0 ? 'class="active"' : ''}
      ></li>`
      )
      .join('')}
  </ol>
  <div class="carousel-inner">
    ${slides
      .map(
        (slide, idx) =>
          `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
        <img
          class="d-block w-100"
          src="${slide.image}"
        />
        <div class="carousel-caption">
          ${slide.caption.map((p) => `<p>${p}</p>`).join('')}
        </div>
      </div>`
      )
      .join('')}
  </div>
  <a
    class="carousel-control-prev"
    href="#getting-started-carousel"
    role="button"
    data-slide="prev"
  >
    <span
      class="carousel-control-prev-icon"
      aria-hidden="true"
    ></span>
    <span class="sr-only">Previous</span>
  </a>
  <a
    class="carousel-control-next"
    href="#getting-started-carousel"
    role="button"
    data-slide="next"
  >
    <span
      class="carousel-control-next-icon"
      aria-hidden="true"
    ></span>
    <span class="sr-only">Next</span>
  </a>
</div>
`;
}
