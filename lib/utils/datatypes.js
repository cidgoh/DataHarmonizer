import { format, isDate, parse, parseJSON } from 'date-fns';

const REF_DATE = new Date(0);
const DEFAULT_OPTIONS = {
  dateFormat: 'yyyy-MM-dd',
  datetimeFormat: 'yyyy-MM-dd HH:mm',
  timeFormat: 'HH:mm',
};
const RE_WHITESPACE_MINIMIZED = new RegExp(/\s+/, 'g');
const RE_DECIMAL = new RegExp(/^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/);

export class Datatypes {
  PARSERS = {
    'xsd:integer': this.parseInteger,
    'xsd:nonNegativeInteger': this.parseNonNegativeInteger,
    'xsd:float': this.parseFloat,
    'xsd:double': this.parseFloat,
    'xsd:decimal': this.parseDecimal,
    'xsd:boolean': this.parseBool,
    'xsd:date': this.parseDate,
    'xsd:dateTime': this.parseDateTime,
    'xsd:time': this.parseTime,
    'xsd:token': this.parseToken,
  };
  STRINGIFIERS = {
    'xsd:date': this.stringifyDate,
    'xsd:dateTime': this.stringifyDateTime,
    'xsd:time': this.stringifyTime,
  };

  constructor(options = {}) {
    const mergedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    this.dateFormat = mergedOptions.dateFormat;
    this.datetimeFormat = mergedOptions.datetimeFormat;
    this.timeFormat = mergedOptions.timeFormat;
  }

  parseInteger(value) {
    const correctPattern = /^[-+]?[0-9]+$/.test(value);
    return correctPattern ? Number(value) : undefined;
  }

  parseNonNegativeInteger(value) {
    const correctPattern = /^\+?[0-9]+$/.test(value);
    return correctPattern ? Number(value) : undefined;
  }

  parseFloat(value) {
    if (value.trim() === '') {
      return undefined;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  parseDecimal(value) {
    const correctPattern = RE_DECIMAL.test(value);
    return correctPattern ? Number(value) : undefined;
  }

  parseBool(value) {
    if (value === '1' || value === 'true') {
      return true;
    } else if (value === '0' || value === 'false') {
      return false;
    } else {
      return undefined;
    }
  }

  parseDate(value) {
    const parsed = parse(value, this.dateFormat, REF_DATE);
    if (isNaN(parsed)) {
      return undefined;
    }
    return parsed;
  }

  parseDateTime(value) {
    const parsed = parse(value, this.datetimeFormat, REF_DATE);
    if (isNaN(parsed)) {
      return undefined;
    }
    return parsed;
  }

  parseTime(value) {
    const parsed = parse(value, this.timeFormat, REF_DATE);
    if (isNaN(parsed)) {
      return undefined;
    }
    return parsed;
  }

  // For xsd:token which returns reduced whitespace version
  parseToken(value) {
    return value.replace(RE_WHITESPACE_MINIMIZED, ' ').trim();
  }

  stringifyDate(value) {
    return format(value, this.dateFormat);
  }

  stringifyDateTime(value) {
    return format(value, this.datetimeFormat);
  }

  stringifyTime(value) {
    return format(value, this.timeFormat);
  }

  parse(value, datatype) {
    const parser = this.PARSERS[datatype];
    const parsed = parser ? parser.call(this, value) : value;
    return parsed;
  }

  stringify(value, datatype) {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    const stringifier = this.STRINGIFIERS[datatype];
    const stringified = stringifier
      ? stringifier.call(this, value)
      : String(value);
    return stringified;
  }
}

const JSON_SCHEMA_FORMATS = {
  'xsd:date': 'yyyy-MM-dd',
  'xsd:dateTime': "yyyy-MM-dd'T'HH:mm:ss",
  'xsd:time': 'HH:mm:ss',
};

export function stringifyJsonSchemaDate(dateObject, datatype) {
  const formatString = JSON_SCHEMA_FORMATS[datatype];
  if (!formatString && !isDate(dateObject)) {
    return;
  }
  return format(dateObject, formatString);
}

export function parseJsonSchemaDate(dateString, datatype) {
  const formatString = JSON_SCHEMA_FORMATS[datatype];
  if (!formatString) {
    return;
  }
  return parse(dateString, formatString, REF_DATE);
}

export function parseJsonDate(dateString) {
  return parseJSON(dateString);
}

export function datatypeIsDateOrTime(datatype) {
  return (
    datatype === 'xsd:date' ||
    datatype === 'xsd:dateTime' ||
    datatype === 'xsd:time'
  );
}
