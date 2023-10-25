import * as $ from 'jquery';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from "@/lib/utils/templates";

import menu from '@/web/templates/menu.json';
import tags from 'language-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

document.addEventListener('DOMContentLoaded', function () {

  
  const dhRoot = document.querySelector('#data-harmonizer-grid');
  const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
  const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');

  const dh = new DataHarmonizer(dhRoot, {
    loadingScreenRoot: document.querySelector('body'),
  });

  // internationalize
  // TODO: connect to locale of schema!
  initI18n(lang => {
    $(document).localize();
    dh.hot.render();
  });

  new Footer(dhFooterRoot, dh);

  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  new Toolbar(dhToolbarRoot, dh, menu, {
    templatePath: templatePath,
    releasesURL: 'https://github.com/cidgoh/pathogen-genomics-package/releases',
    // TODO: reduce duplication of the Template.create(); object
    getLanguages: async (schema) => {
      // TODO: can this logic be hidden even more?
      const template = await Template.create(schema);
      
      let locales;
      // TODO - distinguish between regional localization?
      locales = template.locales.reduce((acc, locale) => {
        const langcode = locale.split('-')[0];
        const nativeName = tags.language(langcode).data.record.Description[0];
        return { 
          ...acc,
          [langcode]: {
            langcode,
            nativeName
          }
        };
      }, {
        // TODO: default value propagation to which functions?
        'default': {
          langcode: 'default',
          nativeName: 'Default'
        }
      });

      Object.entries(template.translations).forEach(([langcode, translation]) => {
        i18n.addResources(langcode, 'translations', translation.schema);
      });
      
      return locales;
    },
    getSchema: async (schema) => {
      const template = await Template.create(schema);
      return template.current.schema;
    },
    // TODO: refactor to Template object
    getExportFormats: async (schema) => {
      return (await import(`@/web/templates/${schema}/export.js`)).default;
    },
    // TODO: Locale changes!
  });

});
