import { Datatypes, stringifyJsonSchemaDate } from '../lib/utils/datatypes';

function getDateObjectForTime(hours, minutes, seconds) {
  const dateObject = new Date(0);
  dateObject.setHours(hours, minutes, seconds);
  return dateObject;
}

test.each([
  // value, datatype, expected
  ['13', 'xsd:integer', 13],
  ['1ß3.5', 'xsd:integer', undefined],
  ['-14', 'xsd:integer', -14],
  ['+2', 'xsd:integer', 2],
  ['0', 'xsd:integer', 0],
  ['asdf', 'xsd:integer', undefined],
  ['-', 'xsd:integer', undefined],
  ['', 'xsd:integer', undefined],
  [' ', 'xsd:integer', undefined],
  ['23Q', 'xsd:integer', undefined],
  // value, datatype, expected
  ['75', 'xsd:nonNegativeInteger', 75],
  ['0.25', 'xsd:nonNegativeInteger', undefined],
  ['-14', 'xsd:nonNegativeInteger', undefined],
  ['+999', 'xsd:nonNegativeInteger', 999],
  ['0', 'xsd:nonNegativeInteger', 0],
  ['asdf', 'xsd:nonNegativeInteger', undefined],
  ['-', 'xsd:nonNegativeInteger', undefined],
  ['', 'xsd:nonNegativeInteger', undefined],
  [' ', 'xsd:nonNegativeInteger', undefined],
  ['60bb', 'xsd:nonNegativeInteger', undefined],
  // value, datatype, expected
  ['75', 'xsd:float', 75],
  ['0.25', 'xsd:float', 0.25],
  ['-14', 'xsd:float', -14],
  ['+999', 'xsd:float', 999],
  ['0', 'xsd:float', 0],
  ['asdf', 'xsd:float', undefined],
  ['-', 'xsd:float', undefined],
  ['', 'xsd:float', undefined],
  [' ', 'xsd:float', undefined],
  ['60bb', 'xsd:float', undefined],
  ['-1.423e2', 'xsd:float', -142.3],
  // value, datatype, expected
  ['75', 'xsd:double', 75],
  ['0.25', 'xsd:double', 0.25],
  ['-14', 'xsd:double', -14],
  ['+999', 'xsd:double', 999],
  ['0', 'xsd:double', 0],
  ['asdf', 'xsd:double', undefined],
  ['-', 'xsd:double', undefined],
  ['', 'xsd:double', undefined],
  [' ', 'xsd:double', undefined],
  ['60bb', 'xsd:double', undefined],
  ['-1.423e2', 'xsd:double', -142.3],
  // value, datatype, expected
  ['75', 'xsd:decimal', 75],
  ['0.25', 'xsd:decimal', 0.25],
  ['-14', 'xsd:decimal', -14],
  ['+999', 'xsd:decimal', 999],
  ['0', 'xsd:decimal', 0],
  ['asdf', 'xsd:decimal', undefined],
  ['-', 'xsd:decimal', undefined],
  ['', 'xsd:decimal', undefined],
  [' ', 'xsd:decimal', undefined],
  ['60bb', 'xsd:decimal', undefined],
  ['-1.423e2', 'xsd:decimal', undefined],
  // value, datatype, expected
  ['1', 'xsd:boolean', true],
  ['0', 'xsd:boolean', false],
  ['true', 'xsd:boolean', true],
  ['false', 'xsd:boolean', false],
  ['', 'xsd:boolean', undefined],
  [' ', 'xsd:boolean', undefined],
  ['asdf', 'xsd:boolean', undefined],
  // value, datatype, expected
  ['1993-04-16', 'xsd:date', new Date(1993, 3, 16)],
  ['1993-13-16', 'xsd:date', undefined],
  ['May 15, 2007', 'xsd:date', undefined],
  ['', 'xsd:date', undefined],
  [' ', 'xsd:date', undefined],
  ['asdf', 'xsd:date', undefined],
  // value, datatype, expected
  ['1993-04-16 15:15', 'xsd:dateTime', new Date(1993, 3, 16, 15, 15)],
  ['1993-13-16 15:15', 'xsd:dateTime', undefined],
  ['1993-04-16 3:15 PM', 'xsd:dateTime', undefined],
  ['May 15, 2007 15:15', 'xsd:dateTime', undefined],
  ['', 'xsd:dateTime', undefined],
  [' ', 'xsd:dateTime', undefined],
  ['asdf', 'xsd:dateTime', undefined],
  // value, datatype, expected
  ['15:15', 'xsd:time', getDateObjectForTime(15, 15, 0)],
  ['3:15 PM', 'xsd:time', undefined],
  ['May 15, 2007 15:15', 'xsd:time', undefined],
  ['', 'xsd:time', undefined],
  [' ', 'xsd:time', undefined],
  ['asdf', 'xsd:time', undefined],
  // value, datatype, expected
  ['whatever', 'unknown', 'whatever'],
])('parse("%s", "%s")', (value, datatype, expected) => {
  const datatypes = new Datatypes();
  const actual = datatypes.parse(value, datatype);
  expect(actual).toEqual(expected);
});

test.each([
  [103, 'xsd:integer', '103'],
  [33, 'xsd:nonNegativeInteger', '33'],
  [0.1217, 'xsd:float', '0.1217'],
  [-42.19, 'xsd:double', '-42.19'],
  [1.1, 'xsd:decimal', '1.1'],
  [true, 'xsd:boolean', 'true'],
  [new Date(1993, 3, 16, 15, 16, 17), 'xsd:date', '1993-04-16'],
  [new Date(1993, 3, 16, 15, 16, 17), 'xsd:dateTime', '1993-04-16 15:16'],
  ['15:16', 'xsd:time', '15:16'],
])('stringify("%s", "%s")', (value, datatype, expected) => {
  const datatypes = new Datatypes();
  const actual = datatypes.stringify(value, datatype);
  expect(actual).toEqual(expected);
});

test('it should accept custom formats', () => {
  const datatypes = new Datatypes({
    dateFormat: 'MMM d, yyyy',
    datetimeFormat: 'dd MMMM yyyy @ h:mm a',
    timeFormat: 'h:mm:ss a',
  });

  expect(datatypes.parseDate('Jan 2, 2022')).toEqual(new Date(2022, 0, 2));
  expect(datatypes.parseDate('2022-01-02')).toEqual(undefined);

  expect(datatypes.parseDateTime('04 Oct 2023 @ 3:33 PM')).toEqual(
    new Date(2023, 9, 4, 15, 33)
  );
  expect(datatypes.parseDate('2023-10-04 15:33')).toEqual(undefined);

  expect(datatypes.parseTime('3:44:55 PM')).toEqual(
    getDateObjectForTime(15, 44, 55)
  );
  expect(datatypes.parseDate('15:44:55')).toEqual(undefined);

  expect(datatypes.stringifyDate(new Date(1999, 4, 15, 15, 35, 22))).toEqual(
    'May 15, 1999'
  );
  expect(datatypes.stringifyDateTime(new Date(1994, 8, 1, 15, 25, 35))).toEqual(
    '01 September 1994 @ 3:25 PM'
  );
});

test('stringifyDateObjectForJsonSchema', () => {
  const input = new Date(2023, 9, 31, 16, 45);
  expect(stringifyJsonSchemaDate(input, 'xsd:date')).toEqual('2023-10-31');
  expect(stringifyJsonSchemaDate(input, 'xsd:dateTime')).toEqual(
    '2023-10-31T16:45:00'
  );
  expect(stringifyJsonSchemaDate(input, 'xsd:time')).toEqual('16:45:00');
});
