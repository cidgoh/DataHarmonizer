import FlatpickrEditor from '@/lib/editors/FlatpickrEditor';

class DatetimeEditor extends FlatpickrEditor {
  getFlatpickrConfig() {
    return {
      enableTime: true,
    };
  }
}

export default DatetimeEditor;
