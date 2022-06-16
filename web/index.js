import { DataHarmonizer } from '#lib';
import monkeypox from './templates/monkeypox/schema.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  const dhRoot = document.querySelector('#data-harmonizer-grid');
  const dhFooterRoot = document.querySelector('#data-harmonizer-footer');

  const dh = new DataHarmonizer(dhRoot, dhFooterRoot, {
    schema: monkeypox,
    loadingScreenRoot: document.querySelector('body'),
  });
  dh.processTemplate('Monkeypox');
});
