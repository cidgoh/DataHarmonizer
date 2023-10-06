import * as $ from 'jquery';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from "@/lib/utils/templates";

import menu from '@/web/templates/menu.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

document.addEventListener('DOMContentLoaded', function () {
  const dhRoot = document.querySelector('#data-harmonizer-grid');
  const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
  const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');

  const dh = new DataHarmonizer(dhRoot, {
    loadingScreenRoot: document.querySelector('body'),
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
    getSchema: async (schema) => {
      const template = await Template.create(schema)
      return template.current.schema;
    },
    // TODO: refactor to Template object
    getExportFormats: async (schema) => {
      return (await import(`@/web/templates/${schema}/export.js`)).default;
    },
    // TODO: Locale changes!
  });

  // internationalize
  // TODO: connect to locale of schema!
  initI18n(lang => {
    $(document).localize();
    dh.hot.render();
  })

});
