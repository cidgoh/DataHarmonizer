import FlatpickrEditor from './FlatpickrEditor';

class DatetimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
    };
  }
}

export default DatetimeEditor;
