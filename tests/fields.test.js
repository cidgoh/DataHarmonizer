import { dataArrayToObject } from '../lib/utils/fields';

describe('dataArrayToObject', () => {
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
