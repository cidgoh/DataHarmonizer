import { validateUniqueValues } from '@/lib/utils/validation';

describe('validateUniqueValues', () => {
  test('it should pass validation for a single column of unique values', () => {
    let input = [[1, 2, 3]];
    let results = validateUniqueValues(input);
    expect(results).toEqual([true, true, true]);
  });

  test('it should fail validation for a single column of non-unique values', () => {
    let input = [[1, 2, 1]];
    let results = validateUniqueValues(input);
    expect(results).toEqual([false, true, false]);

    input = [[1, 2, 3, 2, 4, 2, 3]];
    results = validateUniqueValues(input);
    expect(results).toEqual([true, false, false, false, true, false, false]);
  });

  test('it should pass validation for multiple columns of unique pair-wise values', () => {
    let input = [
      [1, 2, 1],
      [1, 2, 2],
    ];
    let results = validateUniqueValues(input);
    expect(results).toEqual([true, true, true]);
  });

  test('it should fail validation for multiple columns of non-unique pair-wise values', () => {
    let input = [
      [1, 2, 1, 2],
      [2, 1, 1, 1],
    ];
    let results = validateUniqueValues(input);
    expect(results).toEqual([true, false, true, false]);

    input = [
      [1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3, 3],
      [4, 4, 5, 5, 4, 6],
    ];
    results = validateUniqueValues(input);
    expect(results).toEqual([false, false, false, false, false, true]);
  });

  test('it should handle unequal inner array lengths', () => {
    let input = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5],
    ];
    let results = validateUniqueValues(input);
    expect(results).toEqual([true, true, true, true, true]);
  });

  test('it should handle nulls within a column', () => {
    let validInput = [
      [2, 2, null, 2, 2],
      [1, 2, 2, null, 3],
    ];
    let results = validateUniqueValues(validInput);
    expect(results).toEqual([true, true, true, true, true]);

    let invalidInput = [
      [2, 2, null, null, 2],
      [1, 2, null, null, 3],
    ];
    results = validateUniqueValues(invalidInput);
    expect(results).toEqual([true, true, false, false, true]);
  });
});
