export default {
  "canada_covid19": {
    "CanCOGeN Covid-19": {
      "name": "CanCOGeN Covid-19",
      "status": "published",
      "display": true
    },
    schema: async () => (await import('./canada_covid19/schema.json')).default,
    exportFormats: async () => (await import('./canada_covid19/export.js')).default
  },
  // "gisaid": {
  //   "GISAID": {
  //     "name": "GISAID",
  //     "status": "published",
  //     "display": true
  //   }
  // },
  // "pha4ge": {
  //   "PHA4GE": {
  //     "name": "PHA4GE",
  //     "status": "published",
  //     "display": true
  //   }
  // },
  // "grdi": {
  //   "GRDI": {
  //     "name": "GRDI",
  //     "status": "published",
  //     "display": true
  //   }
  // },
  // "phac_dexa": {
  //   "PHAC Dexa": {
  //     "name": "PHAC Dexa",
  //     "status": "published",
  //     "display": true
  //   }
  // },
  "monkeypox": {
    "Monkeypox": {
      "name": "Monkeypox",
      "status": "published",
      "display": true,
    },
    schema: async () => (await import('./monkeypox/schema.json')).default,
    exportFormats: async () => (await import('./monkeypox/export.js')).default
  }
}