import * as $ from 'jquery';
// NOTE: do NOT import bootstrap proper – interaction with other events
// just import the precise libraries you need from it
import 'bootstrap/js/dist/tab';
import 'bootstrap/dist/css/bootstrap.min.css';

import { initI18n } from '../lib/utils/i18n';
import { Template } from '../lib/utils/templates';
import { getGettingStartedMarkup } from '../lib/toolbarGettingStarted';
import { Footer, Toolbar, AppContext } from '../lib';

// Order matters: place this at bottom of imports for CSS overrides
import './index.css';

const dhRoot = document.querySelector('#data-harmonizer-grid');
const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');
const dhNavTabs = document.querySelector('#data-harmonizer-tabs');

export function createDataHarmonizerContainer(dhId, isActive) {
  let dhSubroot = document.createElement('div');
  dhSubroot.id = dhId;
  dhSubroot.classList.add('data-harmonizer-grid', 'tab-pane', 'fade');
  if (isActive) {
    dhSubroot.classList.add('show', 'active');
  }
  dhSubroot.setAttribute('aria-labelledby', `tab-${dhId}`);
  // dhRoot
  dhRoot.appendChild(dhSubroot); // Appending to the parent container
  return dhSubroot;
}

export function createDataHarmonizerTab(dhId, tab_title, class_name, tooltip, isActive) {
  const template = document.createElement('template');
  template.innerHTML = `<li role="tab" id="tab-bar-${class_name}" class="nav-item ${tooltip.length ? 'tooltipy' :''}"><a class="nav-link${(isActive ? ' active' : '')}" id="tab-${dhId}" href=#${dhId} data-bs-target="#${dhId}" data-name="${class_name}" data-toggle="tab">${tab_title}</a>${tooltip.length ? '<span class="tooltipytext tinytip">' + tooltip + '</span>' : ''}</li>`;

  const dhTab = template.content.firstChild;

  dhNavTabs.appendChild(dhTab);
  return $(`#tab-bar-${class_name} > a`)[0];
}

// loading screen
$(dhRoot).append(`
    <div class="w-100 h-100 position-fixed fixed-top" id="loading-screen">
      <div class="d-flex h-100 align-items-center justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Please wait...</span>
          </div>
      </div>
    </div>
`);

// Make the top function asynchronous to allow for a data-loading/IO step
const main = async function () {
  const context = new AppContext();

  // Preview popup: schema passed via sessionStorage from the Schema Editor.
  // Skip menu.json / webpack schema loading entirely.
  const previewParam = new URLSearchParams(location.search).get('preview');
  if (previewParam) {
    const stored = sessionStorage.getItem(`dh_preview_${previewParam}`);
    if (stored) {
      const schema = JSON.parse(stored);
      // Container and dh_interface are coordination-only classes — never use as template.
      const EXCLUDED = new Set(['Container', 'dh_interface']);
      // Prefer a non-excluded class with tree_root, then first non-excluded class.
      const firstClass =
        Object.entries(schema.classes || {})
          .find(([name, c]) => c.tree_root && !EXCLUDED.has(name))?.[0] ||
        Object.keys(schema.classes || {})
          .find((name) => !EXCLUDED.has(name));
      const templatePath = `${schema.name}/${firstClass}`;
      context.reload(templatePath, null, schema).then(async (context) => {
        initI18n((/* lang */) => { $(document).localize(); });
        new Toolbar(dhToolbarRoot, context, {
          templatePath,
          forcedSchema: schema,
          getSchema: async (s) =>
            Template.create(s).then((result) => result.current.schema),
        });
        new Footer(dhFooterRoot, context);
      });
    }
    return;
  }

  context.reload(context.appConfig.template_path)
    .then(async (context) => {
    // FUTURE: Connect to locale of browser? Takes `lang` as argument (unused)
    initI18n((/* lang */) => {
      $(document).localize();

      // HACK: manual content refereshes
      // usually because the HTML is custom generated/not from a template, or has inset translation code
      $('#getting-started-carousel-container').html(getGettingStartedMarkup());
    });

    new Toolbar(dhToolbarRoot, context, {
      templatePath: context.appConfig.template_path,
      releasesURL:
        'https://github.com/cidgoh/pathogen-genomics-package/releases',
      // getExportFormats() is an dictionary object of exports available for a given schema
      // The Toolbar constructor will set this to _defaultGetExportFormats() if none given;
      // getExportFormats: context.getExportFormats.bind(context),
      getSchema: async (schema) =>
        Template.create(schema).then((result) => result.current.schema),
    });

    new Footer(dhFooterRoot, context);
    return context;
  });
};

document.addEventListener('DOMContentLoaded', main);
