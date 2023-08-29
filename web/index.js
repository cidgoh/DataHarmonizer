import { DataHarmonizer, Footer, Toolbar } from '@/lib';
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
      return (await import(`@/web/templates/${schema}/schema.json`)).default;
    },
    getExportFormats: async (schema) => {
      return (await import(`@/web/templates/${schema}/export.js`)).default;
    },
  });
});
