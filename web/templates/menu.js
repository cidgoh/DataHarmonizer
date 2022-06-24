export default {
  canada_covid19: {
    'CanCOGeN Covid-19': {
      name: 'CanCOGeN Covid-19',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./canada_covid19/schema.json')).default,
    exportFormats: async () =>
      (await import('./canada_covid19/export.js')).default,
  },
  gisaid: {
    GISAID: {
      name: 'GISAID',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./gisaid/schema.json')).default,
    exportFormats: async () => (await import('./gisaid/export.js')).default,
  },
  pha4ge: {
    PHA4GE: {
      name: 'PHA4GE',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./pha4ge/schema.json')).default,
    exportFormats: async () => (await import('./pha4ge/export.js')).default,
  },
  grdi: {
    GRDI: {
      name: 'GRDI',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./grdi/schema.json')).default,
    exportFormats: async () => (await import('./grdi/export.js')).default,
  },
  phac_dexa: {
    'PHAC Dexa': {
      name: 'PHAC Dexa',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./phac_dexa/schema.json')).default,
    exportFormats: async () => (await import('./phac_dexa/export.js')).default,
  },
  monkeypox: {
    Monkeypox: {
      name: 'Monkeypox',
      status: 'published',
      display: true,
    },
    schema: async () => (await import('./monkeypox/schema.json')).default,
    exportFormats: async () => (await import('./monkeypox/export.js')).default,
  },
};
