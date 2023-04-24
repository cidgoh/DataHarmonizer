import Handsontable from 'handsontable';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';

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

    this.TEXTAREA = this.hot.rootDocument.createElement('input');
    this.TEXTAREA.className = 'handsontableInput';
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);

    this.datePicker = this.hot.rootDocument.createElement('DIV');
    this.datePicker.classList.add('htFlatpickrContainer');
    this.datePickerStyle = this.datePicker.style;
    this.datePickerStyle.position = 'absolute';
    this.datePickerStyle.top = 0;
    this.datePickerStyle.left = 0;
    this.datePickerStyle.zIndex = 9999;

    this.hot.rootDocument.body.appendChild(this.datePicker);

    const config = this.getFlatpickrConfig();
    const mandatoryConfig = {
      appendTo: this.datePicker,
      allowInput: true,
      inline: true,
      onChange: (dates, datestr) => {
        this.setValue(datestr);
      },
      onClose: () => {
        if (!this.parentDestroyed) {
          this.finishEditing(false);
        }
      },
    };
    this.fp = flatpickr(
      this.TEXTAREA,
      Object.assign({}, config, mandatoryConfig)
    );
    const eventManager = new Handsontable.EventManager(this);

    /**
     * Prevent recognizing clicking on datepicker as clicking outside of table
     */
    eventManager.addEventListener(this.datePicker, 'mousedown', (event) =>
      Handsontable.dom.stopPropagation(event)
    );
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

    this.fp.destroy();

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
    this.instance._registerTimeout(() => {
      this.instance._refreshBorders();
    });

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

      if (value !== void 0) {
        this.setValue(value);
      }
    } else {
      // this.fp.formatDate(this.fp.selectedDates[0]
      // this.setValue(, this.fp.config.dateFormat));
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
    const isMouseDown = this.instance.view.isMouseDown();
    const isMeta = event ? Handsontable.helper.isMetaKey(event.keyCode) : false;

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
      this.fp.clear();
      this.fp.setDate();
    }

    this.datePickerStyle.display = 'block';
    this.fp.open()
    this.datePicker.focus();
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