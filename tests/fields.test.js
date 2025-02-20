import {
  dataArrayToObject,
  dataObjectToArray,
  parseMultivaluedValue,
  formatMultivaluedValue,
  REMOVE,
  JSON_SCHEMA_FORMAT,
} from '../lib/utils/fields';

const fields = [
  {
    name: 'a',
    datatype: 'xsd:integer',
  },
  {
    name: 'b',
    datatype: 'xsd:float',
  },
  {
    name: 'c',
    datatype: 'xsd:boolean',
  },
  {
    name: 'd',
    datatype: 'xsd:date',
  },
  {
    name: 'e',
    datatype: 'xsd:token',
    multivalued: true,
  },
  {
    name: 'f',
    datatype: 'xsd:float',
    multivalued: true,
  },
  {
    name: 'g',
    datatype: 'xsd:dateTime',
  },
  {
    name: 'h',
    datatype: 'xsd:time',
  },
];

describe('dataArrayToObject', () => {
  test('returns object with correct datatypes', () => {
    const dataArray = ['1', '1.5', '1', '2018-02-15'];
    const dataObject = dataArrayToObject(dataArray, fields);
    expect(dataObject).toEqual({
      a: 1,
      b: 1.5,
      c: true,
      d: new Date(2018, 1, 15),
    });
  });

  test('does not include fields for blank cells', () => {
    const dataArray = ['1', '', 'false', ''];
    const dataObject = dataArrayToObject(dataArray, fields);
    expect(dataObject).toEqual({
      a: 1,
      c: false,
    });
  });

  test('splits multivalued fields', () => {
    const dataArray = ['', '', '', '', 'a; b; c', '34; 33; -1'];
    const dataObject = dataArrayToObject(dataArray, fields);
    expect(dataObject).toEqual({
      e: ['a', 'b', 'c'],
      f: [34, 33, -1],
    });
  });

  test('does not include values which do not conform to datatype', () => {
    const dataArray = ['5.85', '21.25', '', '', '', '5; asdf; 18'];
    const dataObject = dataArrayToObject(dataArray, fields);
    expect(dataObject).toEqual({
      a: '5.85',
      b: 21.25,
      f: [5, 'asdf', 18],
    });
  });

  test('includes all values when parseFailureBehavior = REMOVE', () => {
    const dataArray = ['5.85', '21.25', '', '', '', '5; asdf; 18'];
    const dataObject = dataArrayToObject(dataArray, fields, {
      parseFailureBehavior: REMOVE,
    });
    expect(dataObject).toEqual({
      b: 21.25,
      f: [5, 18],
    });
  });

  test('returns correctly formatted string with dateBehavior = JSON_SCHEMA_FORMAT', () => {
    const dataArray = [
      '',
      '',
      '',
      '2023-05-25',
      '',
      '',
      '2023-05-25 16:30',
      '04:44',
    ];
    const dataObject = dataArrayToObject(dataArray, fields, {
      dateBehavior: JSON_SCHEMA_FORMAT,
    });
    expect(dataObject).toEqual({
      d: '2023-05-25',
      g: '2023-05-25T16:30:00',
      h: '04:44:00',
    });
  });
});

describe('dataObjectToArray', () => {
  test('returns data array with correct elements populated', () => {
    const dataObject = {
      a: 1,
      b: 1.5,
      c: true,
      d: new Date(2018, 1, 15),
    };
    const dataArray = dataObjectToArray(dataObject, fields);
    expect(dataArray).toEqual([
      '1',
      '1.5',
      'true',
      '2018-02-15',
      '',
      '',
      '',
      '',
    ]);
  });

  test('returns delimited strings for multivalued fields', () => {
    const dataObject = {
      b: 33.333,
      e: ['a', 'b', 'c'],
      f: 33,
    };
    const dataArray = dataObjectToArray(dataObject, fields);
    expect(dataArray).toEqual(['', '33.333', '', '', 'a;b;c', '33', '', '']);
  });
});

describe('parseMultivaluedValue', () => {
  test('parses values delimited by "; "', () => {
    const input = 'one two; three; four';
    const parsed = parseMultivaluedValue(input);
    expect(parsed).toEqual(['one two', 'three', 'four']);
  });

  test('parses values delimited by ";"', () => {
    const input = 'one two;three;four';
    const parsed = parseMultivaluedValue(input);
    expect(parsed).toEqual(['one two', 'three', 'four']);
  });

  test('ignores leading and trailing spaces', () => {
    const input = 'one two;three; four ;five';
    const parsed = parseMultivaluedValue(input);
    expect(parsed).toEqual(['one two', 'three', 'four', 'five']);
  });

  test('discards empty entries', () => {
    const input = ';one two;three; ;five;;;';
    const parsed = parseMultivaluedValue(input);
    expect(parsed).toEqual(['one two', 'three', 'five']);
  });

  test('returns empty array for null or empty input', () => {
    expect(parseMultivaluedValue('')).toEqual([]);
    expect(parseMultivaluedValue(null)).toEqual([]);
    expect(parseMultivaluedValue(undefined)).toEqual([]);
  });
});

describe('formatMultivaluedValue', () => {
  test('formats values with correct delimiter and space', () => {
    const input = ['one two', 'three', 'four'];
    const formatted = formatMultivaluedValue(input);
    expect(formatted).toEqual('one two; three; four');
  });

  test('handles non-string values', () => {
    const input = ['one two', 3, 'four'];
    const formatted = formatMultivaluedValue(input);
    expect(formatted).toEqual('one two; 3; four');
  });

  test('discards empty entries', () => {
    const input = ['one two', '', 'three', null, 'four'];
    const formatted = formatMultivaluedValue(input);
    expect(formatted).toEqual('one two; three; four');
  });

  test('returns empty string for null or empty input', () => {
    expect(formatMultivaluedValue([])).toEqual('');
    expect(formatMultivaluedValue(null)).toEqual('');
    expect(formatMultivaluedValue(undefined)).toEqual('');
  });
});
