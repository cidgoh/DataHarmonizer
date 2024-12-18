import FlatpickrEditor from './FlatpickrEditor';

class DateEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: false,
    };
  }
}

export default DateEditor;
