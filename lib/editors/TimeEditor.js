import FlatpickrEditor from './FlatpickrEditor';

class TimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
      noCalendar: true,
    };
  }
}

export default TimeEditor;
