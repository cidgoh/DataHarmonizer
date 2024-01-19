import * as $ from 'jquery';
import 'bootstrap';

import i18n from 'i18next';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';
import { deepMerge } from '@/lib/utils/objects';

import menu from '@/web/templates/menu.json';
import tags from 'language-tags';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/web/index.css';

const rootUrl = window.location.host;
console.log('Root URL:', rootUrl);

async function getTemplatePath() {
  let templatePath;
  if (window.URLSearchParams) {
    let params = new URLSearchParams(location.search);
    templatePath = params.get('template');
  } else {
    templatePath = location.search.split('template=')[1];
  }
  if (templatePath === null || typeof templatePath === 'undefined') {
    const menu = (await import(`@/web/templates/menu.json`)).default;
    const schema_name = Object.keys(menu)[0];
    const template_name = Object.keys(menu[schema_name])[0];
    return `${schema_name}/${template_name}`;
  }
  return templatePath;
}

class AppConfig {
  constructor(template_path=null) {
    this.rootUrl = window.location.host;
    this.template_path = template_path;
  }
}

class AppContext {

  constructor(appConfig) {
    this.template = null;
    this.appConfig = appConfig;
  }

  // TODO: memoize?
  async getTypeTree() {
    return (await this.getClasses()).reduce((acc, el) => {
      const key = Object.keys(el)[0];
      const value = Object.values(el)[0];
      return Object.assign(acc, {
        "nodes": {
          [key]: { 
            parents: [ value['is_a'] ]
          }
        }
      })

    }, {});
  }

  // TODO: memoize?
  // setup dependency tree
  // TODO: dh_interface superclass
  /*
  Example Data:
  {
    "nodes": {
      "Sensor1": {"type": "Sensor", "data": 100, "children": ["Processor1"]},
      "Sensor2": {"type": "Sensor", "data": 150, "children": ["Processor1"]},
      "Processor1": {"type": "Processor", "data": 0, "children": ["Display1"]},
      "Display1": {"type": "Display", "data": 0, "children": []}
  }
  */
  async getDependencyTree() {
    return Object.entries(await this.getTypeTree()["nodes"]).reduce((acc, el) => {
      if (!!!acc["nodes"][el[0]]) {
        acc["nodes"][el[0]] = { "data": null, "children": [] };
      }
      el[1].parents.forEach(parent => {
        if(!!!acc["nodes"][parent]) {
          acc["nodes"][parent] = { "data": null, "children": [] };
        };
        acc["nodes"][parent]["children"].push(el[0]);
      });
      return acc;
    }, { "nodes": {} });

  }

  async initializeTemplate(template_path) {
    const [schema_name, template_name] = template_path.split('/');
    if (!this.template) {
      this.template = await Template.create(schema_name);
    }
    return this;
  }
  
  async getSchema() {
    return this.template.current.schema;
  }

  async getLocaleData(template) {
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

  getClasses() {
    const classes = Object.entries(this.template.current.schema.classes);
    return classes.map(([key, value]) => ({
      [key]: value
    }));
  }

  getSlotGroups() {
    const schema = this.template.current.schema;
    const slotGroups = new Set();

    if (schema.classes) {
        for (const className in schema.classes) {
            const classInfo = schema.classes[className];
            if (classInfo.slot_usage) {
                for (const slotName in classInfo.slot_usage) {
                    const slotInfo = classInfo.slot_usage[slotName];
                    if (slotInfo.slot_group) {
                        slotGroups.add(slotInfo.slot_group);
                    }
                }
            }
        }
    }

    return Array.from(slotGroups);
  }

  async getLocales() {
    const locales = this.getLocaleData(this.template);
    this.addTranslationResources(this.template, locales); // TODO side effect – put elsewhere?
    return locales;
  }

  async getExportFormats(schema) {
    return (await import(`@/web/templates/${schema}/export.js`)).default;
  }

    /**
   * Run void function behind loading screen.
   * Adds function to end of call queue. Does not handle functions with return
   * vals, unless the return value is a promise. Even then, it only waits for the
   * promise to resolve, and does not actually do anything with the value
   * returned from the promise.
   * @param {function} fn - Void function to run.
   * @param {Array} [args=[]] - Arguments for function to run.
   */
    async runBehindLoadingScreen(fn, args = []) {
      await $('#loading-screen').show('fast', 'swing');
      await wait(200); // Enough of a visual cue that something is happening
      if (args.length) {
        await fn.apply(this, args);
      } else {
        await fn.apply(this);
      }
      await $('#loading-screen').hide();
      return;
    }

}

// Make the top function asynchronous to allow for a data-loading/IO step?
const main = async function () {

  const dhRoot = document.querySelector('#data-harmonizer-grid');
  const dhFooterRoot = document.querySelector('#data-harmonizer-footer');
  const dhToolbarRoot = document.querySelector('#data-harmonizer-toolbar');
  const dhTabNav = document.querySelector("#data-harmonizer-tabs");
  
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

  let dhs = [];

  const context = new AppContext(new AppConfig(await getTemplatePath()));
  context.initializeTemplate(context.appConfig.template_path)
    .then(async (context) => {
      const _template = context.template;

      // dependency in terms of classes
      // TODO: setup in the context
      const sections = context.getSlotGroups();

      // for each section: 
      // 0) create a new holding element for the data harmonizer
      // 1) add the holding element to the data-harmonizer-grid
      // 2) create a new data harmonizer instance
      // 3) add the data harmonizer instance to the application list with the holding element as argument
      // this loading process needs to occur on each change of the application?
      if (sections.length > 0) {

        sections.forEach((section, index) => {
          console.log(section, index);
          const dhId = `data-harmonizer-grid-${index}`;

          const dhSubroot = document.createElement('div');
          dhSubroot.id = dhId;
          dhSubroot.classList.add('data-harmonizer-grid', 'tab-pane', 'fade');
          $(dhSubroot).attr('aria-labelledby', `tab-${dhId}`)
          if(index === 0) dhSubroot.classList.add('show', 'active');
          dhRoot.append(dhSubroot);
          
          const dhTab = document.createElement('li');
          dhTab.classList.add('nav-item');
          $(dhTab).attr("role", "presentation");
          // anchor properties: class="nav-link active" id="<id>-tab" data-toggle="tab" href="#<id>" role="tab" aria-controls="<id>" aria-selected="true"
          const dhTabLink = document.createElement('a');
          dhTabLink.classList.add('nav-link');
          if(index === 0) dhTabLink.classList.add('active');
          dhTabLink.id = `tab-${dhId}`;
          dhTabLink.setAttribute('data-toggle', 'tab');
          dhTabLink.setAttribute('role', 'tab');
          dhTabLink.setAttribute('aria-controls', dhId);
          dhTabLink.setAttribute('href', `#${dhId}`);
          dhTabLink.textContent = section;
          dhTab.append(dhTabLink);
          dhTabNav.append(dhTab);

          const dh = new DataHarmonizer(dhSubroot, {
            context: context,
            loadingScreenRoot: document.querySelector('body'),
            field_filters: [section]
          });
          dhs.push(dh);
          
          // TODO: data harmonizers require initialization code inside of the toolbar to fully render? wut
          new Toolbar(dhToolbarRoot, dhs[index], menu, {
            context: context,
            templatePath: context.appConfig.template_path,  // TODO: a default should be loaded before Toolbar is constructed! then take out all loading in "toolbar" to an outside context
            releasesURL: 'https://github.com/cidgoh/pathogen-genomics-package/releases',
            getLanguages: context.getLocaleData.bind(context),
            getSchema: async (schema) => Template.create(schema).then(result => result.current.schema),
            getExportFormats: context.getExportFormats.bind(context),
          });

        });

      } 

      // // internationalize
      // // TODO: connect to locale of browser!
      // // Takes `lang` as argument (unused)
      initI18n((lang) => {
        console.log(lang);
        $(document).localize();
        dhs.forEach(dh => dh.render());
      });
      context.addTranslationResources(_template, context.getLocaleData());
    
      new Footer(dhFooterRoot, dhs[0]);

      return context;
    
    })
    .then(async () => {
      return setTimeout(() => dhs.forEach(dh => dh.showColumnsBySectionTitle(dh.field_filters[0])), 1000);
    });
    
}

document.addEventListener('DOMContentLoaded', main);
