import FlatpickrEditor from './FlatpickrEditor';

class TimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
      time_24hr: true,
      noCalendar: true,
    };
  }
}

export default TimeEditor;
