import FlatpickrEditor from '@/lib/editors/FlatpickrEditor';

class TimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
      noCalendar: true,
    };
  }
}

export default TimeEditor;
