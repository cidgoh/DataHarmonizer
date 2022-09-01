import { parseDatatype, stringifyDatatype } from '../lib/utils/datatypes';

test.each([
  // value, datatype, expected
  ['13', 'xsd:integer', 13],
  ['13.5', 'xsd:integer', undefined],
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
  ['whatever', 'unknown', 'whatever'],
])('parseDatatype(%s, %s)', (value, datatype, expected) => {
  const actual = parseDatatype(value, datatype);
  expect(actual).toEqual(expected);
});

test.each([
  [103, 'xsd:integer', '103'],
  [33, 'xsd:nonNegativeInteger', '33'],
  [0.1217, 'xsd:float', '0.1217'],
  [-42.19, 'xsd:double', '-42.19'],
  [1.1, 'xsd:decimal', '1.1'],
  [true, 'xsd:boolean', 'true'],
  [new Date(1993, 3, 16), 'xsd:date', '1993-04-16'],
])('stringifyDatatype(%s, %s)', (value, datatype, expected) => {
  const actual = stringifyDatatype(value, datatype);
  expect(actual).toEqual(expected);
});
