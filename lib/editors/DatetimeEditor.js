import FlatpickrEditor from './FlatpickrEditor';

class DatetimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
      time_24hr: true,
    };
  }
}

export default DatetimeEditor;
