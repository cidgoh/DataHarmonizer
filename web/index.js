import * as $ from 'jquery';
import i18n from 'i18next';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';

import menu from '@/web/templates/menu.json';
import tags from 'language-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

const rootUrl = window.location.host;
console.log('Root URL:', rootUrl);

 // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
 // See comment on ToolBar
function getTemplatePath() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  return templatePath;
}

// const template_path = this.$selectTemplate.val();
// let schema_name;
// [schema_name, template_name] = template_path.split('/');

class AppConfig {
  constructor() {
    this.rootUrl = window.location.host;
  }
}

class AppContext {
  constructor(appConfig) {
    this.template = null;
    this.appConfig = appConfig;
  }

  async initializeTemplate(templateName='test/TEST') {
    if (!this.template) {
      this.template = await Template.create('test');
    }
  }
  
  async getSchema() {
    return this.template.current.schema;
  }

  async getLocaleData() {
    const locales = {
      default: { langcode: 'default', nativeName: 'Default' },
    };
  
    this.template.locales.forEach((locale) => {
      const langcode = locale.split('-')[0];
      const nativeName = tags.language(langcode).data.record.Description[0] || 'Default';
      locales[langcode] = { langcode, nativeName };
    });
  
    return locales;
  }

  async addTranslationResources(template, locales = null) {
    if (locales === null) {
      locales = this.getLocaleData(template);
    }
    // Consolidate function for reducing objects
    function consolidate(iterable, reducer) {
      return Object.entries(iterable).reduce(reducer, {});
    }

    const defaultLocale = {
      langcode: 'default',
      nativeName: 'Default',
    };
    locales = {
      default: defaultLocale,
    };

    template.locales.forEach((locale) => {
      
      const langcode = locale.split('-')[0];
      const nativeName =
        tags.language(langcode).data.record.Description[0] || 'Default';
      locales[langcode] = { langcode, nativeName };

    });

    Object.entries(template.translations).forEach(
      ([langcode, translation]) => {
        const schema_resource = consolidate(
          translation.schema.slots,
          (acc, [slot_symbol, { name }]) => ({
            ...acc,
            [slot_symbol.replace(/ /g, '_')]: name,
          })
        );

        const enum_resource = consolidate(
          translation.schema.enums,
          (acc, [enum_symbol, { permissible_values }]) => {
            for (const [enum_value, { text }] of Object.entries(
              permissible_values
            )) {
              acc[enum_value] = text;
            }
            return acc;
          }
        );

        const translated_sections = consolidate(
          translation.schema.classes[template.default.schema.name].slot_usage,
          (acc, [translation_slot_name, { slot_group }]) => ({
            ...acc,
            [translation_slot_name]: slot_group,
          })
        );

        const default_sections = consolidate(
          template.default.schema.classes[template.default.schema.name]
            .slot_usage,
          (acc, [default_slot_name, { slot_group }]) => ({
            ...acc,
            [default_slot_name]: slot_group,
          })
        );

        const section_resource = consolidate(
          translated_sections,
          (acc, [translation_slot_name]) => ({
            ...acc,
            [default_sections[translation_slot_name]]:
              translated_sections[translation_slot_name],
          })
        );

        i18n.addResources(langcode.split('-')[0], 'translation', {
          ...section_resource,
          ...schema_resource,
          ...enum_resource,
        });
      }
    );
  }

  async getLocales() {
    const locales = this.getLocaleData(this.template);
    // this.addTranslationResources(this.template, locales); // TODO side effect – put elsewhere?
    return locales;
  }

  async getExportFormats(schema) {
    return (await import(`@/web/templates/${schema}/export.js`)).default;
  }
}

// Make the top function asynchronous to allow for a data-loading/IO step?
const main = async function () {

  const context = new AppContext(new AppConfig());
  context.initializeTemplate(getTemplatePath()).then(() => {
    
    const dhRoot = document.querySelector('#data-harmonizer-grid');
    const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
    const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');
  
    const dh = new DataHarmonizer(dhRoot, {
      loadingScreenRoot: document.querySelector('body'),
    });

    // TODO
    // // internationalize
    // // TODO: connect to locale of browser!
    // // Takes `lang` as argument (unused)
    initI18n((lang) => {
      console.log(lang);
      $(document).localize();
      dh.render();
    });
    context.addTranslationResources(context.template, context.getLocaleData());
  
    new Footer(dhFooterRoot, dh);
    
    new Toolbar(dhToolbarRoot, dh, menu, {
      templatePath: 'test/TEST',  // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
      releasesURL: 'https://github.com/cidgoh/pathogen-genomics-package/releases',
      getLanguages: context.getLocaleData.bind(context),
      getSchema:  context.getSchema.bind(context),
      getExportFormats:  context.getExportFormats.bind(context),
    });
  
  });
}

document.addEventListener('DOMContentLoaded', main);
