import { dataArrayToObject, dataObjectToArray } from '../lib/utils/fields';

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
      b: 21.25,
      f: [5, 18],
    });
  });

  test('includes all values when strict = false', () => {
    const dataArray = ['5.85', '21.25', '', '', '', '5; asdf; 18'];
    const dataObject = dataArrayToObject(dataArray, fields, { strict: false });
    expect(dataObject).toEqual({
      a: '5.85',
      b: '21.25',
      f: ['5', 'asdf', '18'],
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
    expect(dataArray).toEqual(['1', '1.5', 'true', '2018-02-15', '', '']);
  });

  test('returns delimited strings for multivalued fields', () => {
    const dataObject = {
      b: 33.333,
      e: ['a', 'b', 'c'],
      f: 33,
    };
    const dataArray = dataObjectToArray(dataObject, fields);
    expect(dataArray).toEqual(['', '33.333', '', '', 'a; b; c', '33']);
  });
});
