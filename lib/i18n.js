import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';

import { labels } from '@/lib/utils/translations';

// TODO: refactor to a package or list of codes
// TODO: map to what's supported for the template?
export const languages = {
  en: {
    nativeName: 'English',
    langcode: 'en',
  },
  fr: {
    nativeName: 'French',
    langcode: 'fr',
  },
};

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $('body').localize();
};

export function initI18n() {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init(
      {
        debug: true,
        fallbackLng: 'en',
        resources: labels,
      },
      (err, t) => {
        if (err) return console.error(err);
        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $, { useOptionsAttr: true });
        rerender();
      },
    );
}

export function changeLanguage(chosenLng) {
  i18next.changeLanguage(chosenLng);
  rerender();
}
