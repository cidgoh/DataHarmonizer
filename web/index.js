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

export function createDataHarmonizerTab(dhId, entity, isActive) {
  const dhTab = document.createElement('li');
  dhTab.className = 'nav-item';
  dhTab.setAttribute('role', 'presentation');

  const dhTabLink = document.createElement('a');
  dhTabLink.className = 'nav-link' + (isActive ? ' active' : '');
  dhTabLink.id = `tab-${dhId}`;
  dhTabLink.href = `#${dhId}`;
  dhTabLink.textContent = entity;
  dhTabLink.dataset.toggle = 'tab';
  dhTabLink.setAttribute('data-bs-toggle', 'tab'); // Bootstrap specific data attribute for tabs
  dhTabLink.setAttribute('data-bs-target', dhTabLink.href);
  dhTabLink.setAttribute('role', 'tab');
  dhTabLink.setAttribute('aria-controls', dhId);

  dhTab.appendChild(dhTabLink);
  dhNavTabs.appendChild(dhTab);
  return dhTab;
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
  context
    .reload(context.appConfig.template_path, { locale: 'en' })
    .then(async (context) => {
      // // internationalize
      // // TODO: connect to locale of browser!
      // // Takes `lang` as argument (unused)
      initI18n((/* lang */) => {
        $(document).localize();

        // HACK: manual content refereshes
        // usually because the HTML is custom generated/not from a template, or has inset translation code
        $('#getting-started-carousel-container').html(
          getGettingStartedMarkup()
        );
        Object.values(context.dhs).forEach((dh) => dh.render());
      });

      new Toolbar(dhToolbarRoot, context, {
        templatePath: context.appConfig.template_path, // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
        releasesURL:
          'https://github.com/cidgoh/pathogen-genomics-package/releases',
        getLanguages: context.getLocaleData.bind(context),
        getExportFormats: context.getExportFormats.bind(context),
        getSchema: async (schema) =>
          Template.create(schema).then((result) => result.current.schema),
      });

      new Footer(dhFooterRoot, context);
      return context;
    })
    .then(async (context) => {
      return setTimeout(
        () =>
          Object.values(context.dhs).forEach((dh) =>
            dh.showColumnsByNames(dh.field_filters)
          ),
        400
      );
    });
};

document.addEventListener('DOMContentLoaded', main);
