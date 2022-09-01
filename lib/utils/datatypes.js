import { format, parse } from 'date-fns';

function integer(value) {
  const correctPattern = /^[-+]?[0-9]+$/.test(value);
  return correctPattern ? Number(value) : undefined;
}

function nonNegativeInteger(value) {
  const correctPattern = /^\+?[0-9]+$/.test(value);
  return correctPattern ? Number(value) : undefined;
}

function float(value) {
  if (value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

function decimal(value) {
  const correctPattern = /^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(value);
  return correctPattern ? Number(value) : undefined;
}

function bool(value) {
  if (value === '1' || value === 'true') {
    return true;
  } else if (value === '0' || value === 'false') {
    return false;
  } else {
    return undefined;
  }
}

const DATE_FORMAT = 'yyyy-MM-dd';

function parseDate(value) {
  const parsed = parse(value, DATE_FORMAT, new Date());
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

function stringifyDate(value) {
  return format(value, DATE_FORMAT);
}

const PARSERS = {
  'xsd:integer': integer,
  'xsd:nonNegativeInteger': nonNegativeInteger,
  'xsd:float': float,
  'xsd:double': float,
  'xsd:decimal': decimal,
  'xsd:boolean': bool,
  'xsd:date': parseDate,
};

const STRINGIFIERS = {
  'xsd:date': stringifyDate,
};

export function parseDatatype(value, datatype) {
  const parser = PARSERS[datatype];
  const parsed = parser ? parser(value) : value;
  return parsed;
}

export function stringifyDatatype(value, datatype) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  const stringifier = STRINGIFIERS[datatype];
  const stringified = stringifier ? stringifier(value) : String(value);
  return stringified;
}
