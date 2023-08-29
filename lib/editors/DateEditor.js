import FlatpickrEditor from '@/lib/editors/FlatpickrEditor';

class DateEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: false,
    };
  }
}

export default DateEditor;
