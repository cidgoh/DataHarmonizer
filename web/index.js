import * as $ from 'jquery';
import i18n from 'i18next';
import { DataHarmonizer, Footer, Toolbar } from '@/lib';
import { initI18n } from '@/lib/utils/i18n';
import { Template } from '@/lib/utils/templates';

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
  // Takes `lang` as argument (unused)
  initI18n(() => {
    // localizing twice HACK!
    // $(document).localize();
    dh.hot.render();
    $(document).localize();
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
      // Consolidate function for reducing objects
      function consolidate(iterable, reducer) {
        return Object.entries(iterable).reduce(reducer, {});
      }

      const template = await Template.create(schema);
      const defaultLocale = {
        langcode: 'default',
        nativeName: 'Default',
      };
      const locales = {
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
            /* eslint-disable */
            (acc, [enum_symbol, { permissible_values }]) => {
              for (const [enum_value, { text }] of Object.entries(
                permissible_values
              )) {
                acc[enum_value] = text;
              }
              return acc;
            }
          );
          /* eslint-enable */
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
