import Handsontable from 'handsontable';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';
import { format, parse } from 'date-fns';

const REF_DATE = new Date();
REF_DATE.setHours(0, 0, 0, 0);

class FlatpickrEditor extends Handsontable.editors.TextEditor {
  /**
   * @param {Core} hotInstance Handsontable instance
   * @private
   */
  constructor(hotInstance) {
    super(hotInstance);
    this.parentDestroyed = false;
  }

  init() {
    super.init();
    if (this.instance)
      this.instance.addHook('afterDestroy', () => {
        this.parentDestroyed = true;
        this.destroyElements();
      });
  }

  /**
   * Create data picker instance
   */
  createElements() {
    super.createElements();

    this.TEXTAREA.remove();
    this.TEXTAREA = this.hot.rootDocument.createElement('input');
    this.TEXTAREA.className = 'handsontableInput';
    this.TEXTAREA.setAttribute('data-hot-input', true);
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;
    this.TEXTAREA_PARENT.innerText = '';
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);

    this.datePicker = this.hot.rootDocument.createElement('DIV');
    this.datePicker.classList.add('htFlatpickrContainer');
    this.datePickerStyle = this.datePicker.style;
    this.datePickerStyle.position = 'absolute';
    this.datePickerStyle.top = 0;
    this.datePickerStyle.left = 0;
    this.datePickerStyle.zIndex = 9999;
    this.hot.rootDocument.body.appendChild(this.datePicker);

    /**
     * Prevent recognizing clicking on picker as clicking outside of table
     * Prevent recognizing typing in the picker as typing in the table
     */
    const eventManager = new Handsontable.EventManager(this);
    eventManager.addEventListener(this.datePicker, 'mousedown', (event) => {
      event.stopPropagation();
    });
    eventManager.addEventListener(this.datePicker, 'keydown', (event) => {
      event.stopPropagation();
    });
    eventManager.addEventListener(this.TEXTAREA, 'keydown', (event) => {
      if (event.keyCode === Handsontable.helper.KEY_CODES.ENTER) {
        Handsontable.dom.stopImmediatePropagation(event);
      }
    });
    this.hideDatepicker();
  }

  getFlatpickrConfig() {
    return {};
  }

  /**
   * Destroy data picker instance
   */
  destroyElements() {
    const datePickerParentElement = this.datePicker.parentNode;

    if (this.fp?.destroy) {
      this.fp.destroy();
    }

    if (datePickerParentElement) {
      datePickerParentElement.removeChild(this.datePicker);
    }
  }

  /**
   * Prepare editor to appear
   *
   * @param {Number} row Row index
   * @param {Number} col Column index
   * @param {String} prop Property name (passed when datasource is an array of objects)
   * @param {HTMLTableCellElement} td Table cell element
   * @param {*} originalValue Original value
   * @param {Object} cellProperties Object with cell properties ({@see Core#getCellMeta})
   */
  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);
  }

  /**
   * Open editor
   *
   * @param {Event} [event=null]
   */
  open(event = null) {
    super.open();
    this.showDatepicker(event);
    this.addHook('beforeKeyDown', (event) => this.onBeforeKeyDown(event));
  }

  /**
   * Close editor
   */
  close() {
    this._opened = false;
    this.removeHooksByKey('beforeKeyDown');
    super.close();
  }

  /**
   * @param {Boolean} [isCancelled=false]
   * @param {Boolean} [ctrlDown=false]
   */
  finishEditing(isCancelled = false, ctrlDown = false) {
    if (isCancelled) {
      // pressed ESC, restore original value
      // var value = this.instance.getDataAtCell(this.row, this.col);
      const value = this.originalValue;

      if (value !== undefined) {
        this.setValue(value);
      }
    }
    this.hideDatepicker();
    super.finishEditing(isCancelled, ctrlDown);
  }

  /**
   * Show data picker
   *
   * @param {Event} event
   */
  showDatepicker(event) {
    const offset = this.TD.getBoundingClientRect();
    const isMouseDown = this.hot.view.isMouseDown();
    const isMeta = event
      ? Handsontable.helper.isFunctionKey(event.keyCode)
      : false;

    const defaultConfig = this.getFlatpickrConfig();
    const cellConfig =
      this.cellProperties && this.cellProperties.flatpickrConfig
        ? this.cellProperties.flatpickrConfig
        : {};
    const optionalConfig = Object.assign({}, defaultConfig, cellConfig);
    const mandatoryConfig = {
      appendTo: this.datePicker,
      allowInput: true,
      allowInvalidPreload: false,
      inline: true,
      clickOpens: false,
      // Inject date-fns formatter & parser here for better consistency when
      // parsing and formatting of exported data
      formatDate: (dateObj, formatString) => {
        if (!(dateObj instanceof Date && !isNaN(dateObj.getTime()))) {
          return '';
        }
        return format(dateObj, formatString);
      },
      parseDate: (dateString, formatString) => {
        return parse(dateString, formatString, REF_DATE);
      },
      onChange: (dates, datestr) => {
        this.setValue(datestr);
      },
      onClose: () => {
        if (!this.parentDestroyed) {
          this.finishEditing(false);
        }
      },
    };
    if (!Object.prototype.hasOwnProperty.call(optionalConfig, 'time_24hr')) {
      // if no one explicitly said to use 24hr time or not, attempt to derive it from the dateFormat
      const dateFormat = optionalConfig.dateFormat;
      if (dateFormat) {
        mandatoryConfig.time_24hr = !(
          dateFormat.includes('h') || dateFormat.includes('a')
        );
      }
    }
    if (
      !Object.prototype.hasOwnProperty.call(optionalConfig, 'ariaDateFormat')
    ) {
      optionalConfig.ariaDateFormat = 'yyyy-MM-dd';
    }
    this.fp = flatpickr(
      this.TEXTAREA,
      Object.assign({}, optionalConfig, mandatoryConfig)
    );

    // Replace with Popper instance?
    this.datePickerStyle.top = `${
      this.hot.rootWindow.scrollY +
      offset.top +
      Handsontable.dom.outerHeight(this.TD)
    }px`;
    this.datePickerStyle.left = `${
      this.hot.rootWindow.scrollX + offset.left
    }px`;

    if (this.originalValue) {
      this.fp.setDate(this.originalValue);
      if (!isMeta && !isMouseDown) {
        this.setValue('');
      }
    } else if (this.cellProperties.defaultDate) {
      this.fp.setDate(this.cellProperties.defaultDate);
      if (!isMeta && !isMouseDown) {
        this.setValue('');
      }
    } else {
      this.fp.setDate();
    }

    this.datePickerStyle.display = 'block';
  }

  /**
   * Hide data picker
   */
  hideDatepicker() {
    this.datePickerStyle.display = 'none';
  }

  onBeforeKeyDown(event) {
    // Let the datepicker handle certain keys
    switch (event.keyCode) {
      case Handsontable.helper.KEY_CODES.TAB:
      case Handsontable.helper.KEY_CODES.BACKSPACE:
      case Handsontable.helper.KEY_CODES.DELETE:
        Handsontable.dom.stopImmediatePropagation(event);
        break;
    }
  }
}

export default FlatpickrEditor;
