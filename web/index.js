import { DataHarmonizer, Footer, Toolbar } from '../lib';
import menu from './templates/menu';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  const dhRoot = document.querySelector('#data-harmonizer-grid');
  const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
  const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');

  const dh = new DataHarmonizer(dhRoot, {
    loadingScreenRoot: document.querySelector('body'),
  });

  new Footer(dhFooterRoot, dh);

  new Toolbar(dhToolbarRoot, dh, menu);
});
