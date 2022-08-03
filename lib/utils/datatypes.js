import { parse } from 'date-fns';

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

function date(value) {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

const PARSERS = {
  'xsd:integer': integer,
  'xsd:nonNegativeInteger': nonNegativeInteger,
  'xsd:float': float,
  'xsd:double': float,
  'xsd:decimal': decimal,
  'xsd:boolean': bool,
  'xsd:date': date,
};

export function parseDatatype(value, datatype) {
  const parser = PARSERS[datatype];
  const parsed = parser ? parser(value) : value;
  return parsed;
}
