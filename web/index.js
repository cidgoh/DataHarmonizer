import * as $ from 'jquery';
import 'bootstrap';

import { Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { getGettingStartedMarkup } from '@/lib/toolbarGettingStarted';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';
import { AppContext } from '@/lib/AppContext';

// TODO eliminate need to export
export const dhRoot = document.querySelector('#data-harmonizer-grid');
export const dhTabNav = document.querySelector('#data-harmonizer-tabs');

const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');

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

      console.log('index: ', context);
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
