import canadaCovid19 from './canada_covid19/schema.json';
import monkeypox from './monkeypox/schema.json';

export default {
  "canada_covid19": {
    "CanCOGeN Covid-19": {
      "name": "CanCOGeN Covid-19",
      "status": "published",
      "display": true
    },
    schema: canadaCovid19
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
    schema: monkeypox
  }
}