import Validator from '../lib/Validator';

const SCHEMA = {
  id: 'test',
  name: 'test',
  types: {
    string: {
      uri: 'xsd:string',
    },
    normalizedString: {
      uri: 'xsd:normalizedString',
    },
    token: {
      uri: 'xsd:token',
    },
    integer: {
      uri: 'xsd:integer',
    },
    nonNegativeInteger: {
      uri: 'xsd:nonNegativeInteger',
    },
    float: {
      uri: 'xsd:float',
    },
    double: {
      uri: 'xsd:double',
    },
    decimal: {
      uri: 'xsd:decimal',
    },
    date: {
      uri: 'xsd:date',
    },
    dateTime: {
      uri: 'xsd:dateTime',
    },
    time: {
      uri: 'xsd:time',
    },
  },
  classes: {
    Test: {
      name: 'Test',
      attributes: {
        a_string: {
          name: 'a_string',
          range: 'string',
        },
        a_normalized_string: {
          name: 'a_normalized_string',
          range: 'normalizedString',
        },
        a_token: {
          name: 'a_token',
          range: 'token',
        },
        an_integer: {
          name: 'an_integer',
          range: 'integer',
        },
        a_non_negative_integer: {
          name: 'a_non_negative_integer',
          range: 'nonNegativeInteger',
        },
        a_float: {
          name: 'a_float',
          range: 'float',
        },
        a_double: {
          name: 'a_double',
          range: 'double',
        },
        a_decimal: {
          name: 'a_decimal',
          range: 'decimal',
        },
        an_enum: {
          name: 'an_enum',
          range: 'Numbers',
        },
        a_date: {
          name: 'a_date',
          range: 'date',
        },
        a_datetime: {
          name: 'a_datetime',
          range: 'dateTime',
        },
        a_time: {
          name: 'a_time',
          range: 'time',
        },
        required_string: {
          name: 'required_string',
          range: 'string',
          required: true,
        },
        a_big_number: {
          name: 'a_big_number',
          range: 'integer',
          minimum_value: 100,
        },
        a_small_number: {
          name: 'a_small_number',
          range: 'integer',
          maximum_value: 10,
        },
        a_medium_number: {
          name: 'a_medium_number',
          range: 'integer',
          minimum_value: 25,
          maximum_value: 75,
        },
        during_vancouver_olympics: {
          name: 'during_vancouver_olympics',
          range: 'date',
          minimum_value: '2010-02-12',
          maximum_value: '2010-02-28',
        },
        // This is not standard LinkML but it is supported while LinkML adds better support
        // for non-numeric minimum and maximum values
        during_vancouver_olympics_todos: {
          name: 'during_vancouver_olympics_todos',
          range: 'date',
          todos: ['>=2010-02-12', '<=2010-02-28'],
        },
        // The special '{today}' value is not standard LinkML, but it is supported as a
        // DataHarmonizer convention
        not_the_future: {
          name: 'not_the_future',
          range: 'date',
          maximum_value: '{today}',
        },
        not_the_future_todos: {
          name: 'not_the_future_todos',
          range: 'date',
          todos: ['<={today}'],
        },
        a_constant: {
          name: 'a_constant',
          range: 'string',
          equals_string: 'const',
        },
        zip_code: {
          name: 'zip_code',
          range: 'string',
          pattern: '\\d{5}(-\\d{4})?',
        },
        an_integer_or_enum: {
          name: 'an_integer_or_enum',
          any_of: [{ range: 'Numbers' }, { range: 'integer' }],
        },
        a_big_or_small_number: {
          name: 'a_big_or_small_number',
          range: 'integer',
          any_of: [{ maximum_value: 10 }, { minimum_value: 100 }],
        },
        an_integer_in_exactly_one_interval: {
          name: 'an_integer_in_exactly_one_interval',
          range: 'integer',
          exactly_one_of: [
            {
              minimum_value: 0,
              maximum_value: 20,
            },
            {
              minimum_value: 10,
              maximum_value: 30,
            },
          ],
        },
        unsatisfiable: {
          name: 'unsatisfiable',
          all_of: [
            {
              range: 'string',
              equals_string: 'zero',
            },
            {
              range: 'integer',
              equals_number: 0,
            },
          ],
        },
        no_bad_words: {
          name: 'no_bad_words',
          range: 'string',
          none_of: [{ equals_string: 'cuss' }, { equals_string: 'swear' }],
        },
        many_strings: {
          name: 'many_strings',
          range: 'string',
          multivalued: true,
        },
        many_enums: {
          name: 'many_enums',
          range: 'Numbers',
          multivalued: true,
        },
        many_small_integers: {
          name: 'many_small_integers',
          range: 'integer',
          multivalued: true,
          maximum_value: 10,
        },
        just_a_few_strings: {
          name: 'just_a_few_strings',
          range: 'string',
          multivalued: true,
          minimum_cardinality: 2,
          maximum_cardinality: 4,
        },
        an_identifier: {
          name: 'an_identifier',
          range: 'string',
          identifier: true,
        },
        unique_key_part_a: {
          name: 'unique_key_part_a',
          range: 'string',
        },
        unique_key_part_b: {
          name: 'unique_key_part_b',
          range: 'string',
        },
        rule_1_precondition_string: {
          name: 'rule_1_precondition_string',
          range: 'string',
        },
        rule_1_postcondition_integer: {
          name: 'rule_1_postcondition_integer',
          range: 'integer',
        },
        rule_1_postcondition_float: {
          name: 'rule_1_postcondition_float',
          range: 'float',
        },
        rule_2_conditional_string: {
          name: 'rule_2_conditional_string',
          range: 'string',
        },
        rule_2_big_number: {
          name: 'rule_2_big_number',
          range: 'integer',
          minimum_value: 100,
        },
        rule_2_small_number: {
          name: 'rule_2_small_number',
          range: 'integer',
          maximum_value: 10,
        },
        rule_3_present_or_absent_string: {
          name: 'rule_3_present_or_absent_string',
          range: 'string',
        },
        rule_3_big_number: {
          name: 'rule_3_big_number',
          range: 'integer',
          minimum_value: 100,
        },
        rule_4_present_or_absent_string: {
          name: 'rule_4_present_or_absent_string',
          range: 'string',
        },
        rule_4_small_number: {
          name: 'rule_4_small_number',
          range: 'integer',
          maximum_value: 10,
        },
      },
      unique_keys: {
        a_two_part_unique_key: {
          unique_key_slots: ['unique_key_part_a', 'unique_key_part_b'],
        },
      },
      rules: [
        {
          title: 'rule 1',
          description:
            'If rule_1_precondition_string is either bingo or bongo then rule_1_postcondition_integer ' +
            'has to be >= 100 and rule_1_postcondition_float has to be <= 0',
          preconditions: {
            slot_conditions: {
              rule_1_precondition_string: {
                name: 'rule_1_precondition_string',
                any_of: [
                  { equals_string: 'bingo' },
                  { equals_string: 'bongo' },
                ],
              },
            },
          },
          postconditions: {
            slot_conditions: {
              rule_1_postcondition_integer: {
                name: 'rule_1_postcondition_integer',
                minimum_value: 100,
              },
              rule_1_postcondition_float: {
                name: 'rule_1_postcondition_float',
                maximum_value: 0,
              },
            },
          },
        },
        {
          title: 'rule 2',
          description:
            "If rule_2_conditional_string is 'big' then rule_2_big_number is required, otherwise rule_2_small_number is required",
          preconditions: {
            slot_conditions: {
              rule_2_conditional_string: {
                name: 'rule_2_conditional_string',
                equals_string: 'big',
              },
            },
          },
          postconditions: {
            slot_conditions: {
              rule_2_big_number: {
                name: 'rule_2_big_number',
                required: true,
              },
            },
          },
          elseconditions: {
            slot_conditions: {
              rule_2_small_number: {
                name: 'rule_2_small_number',
                required: true,
              },
            },
          },
        },
        {
          title: 'rule 3',
          description:
            'If rule_3_present_or_absent_string is present, then rule_3_big_number is required',
          preconditions: {
            slot_conditions: {
              rule_3_present_or_absent_string: {
                name: 'rule_3_present_or_absent_string',
                value_presence: 'PRESENT',
              },
            },
          },
          postconditions: {
            slot_conditions: {
              rule_3_big_number: {
                name: 'rule_3_big_number',
                required: true,
              },
            },
          },
        },
        {
          title: 'rule 4',
          description:
            'If rule_4_present_or_absent_string is absent, then rule_4_small_number is required',
          preconditions: {
            slot_conditions: {
              rule_4_present_or_absent_string: {
                name: 'rule_4_present_or_absent_string',
                value_presence: 'ABSENT',
              },
            },
          },
          postconditions: {
            slot_conditions: {
              rule_4_small_number: {
                name: 'rule_4_small_number',
                required: true,
              },
            },
          },
        },
      ],
    },
  },
  enums: {
    Numbers: {
      name: 'Numbers',
      permissible_values: {
        One: { text: 'One' },
        Two: { text: 'Two' },
        Three: { text: 'Three' },
      },
    },
  },
};

describe('Validator', () => {
  it('should validate string types', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('a_string');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('hello')).toBeUndefined();
    expect(fn('')).toBeUndefined();

    fn = validator.getValidatorForSlot('a_normalized_string');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('hello')).toBeUndefined();
    expect(fn('')).toBeUndefined();

    fn = validator.getValidatorForSlot('a_token');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('hello')).toBeUndefined();
    expect(fn('')).toBeUndefined();
  });

  it('should validate numeric types', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('an_integer');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('14')).toBeUndefined();
    expect(fn('-14')).toBeUndefined();
    expect(fn('3.1415')).toEqual('Value does not match format for xsd:integer');

    fn = validator.getValidatorForSlot('a_non_negative_integer');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('14')).toBeUndefined();
    expect(fn('-14')).toEqual(
      'Value does not match format for xsd:nonNegativeInteger'
    );
    expect(fn('3.1415')).toEqual(
      'Value does not match format for xsd:nonNegativeInteger'
    );

    fn = validator.getValidatorForSlot('a_float');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('3.1415')).toBeUndefined();
    expect(fn('-7.1e-2')).toBeUndefined();
    expect(fn('hello')).toEqual('Value does not match format for xsd:float');

    fn = validator.getValidatorForSlot('a_double');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('3.1415')).toBeUndefined();
    expect(fn('-7.1e-2')).toBeUndefined();
    expect(fn('hello')).toEqual('Value does not match format for xsd:double');

    fn = validator.getValidatorForSlot('a_decimal');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('3.1415')).toBeUndefined();
    expect(fn('-0.071')).toBeUndefined();
    expect(fn('hello')).toEqual('Value does not match format for xsd:decimal');
  });

  it('should validate enum types', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('an_enum');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('One')).toBeUndefined();
    expect(fn('Whatever')).toEqual('Value is not allowed');
  });

  it('should validate date and time types', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('a_date');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2022-02-22')).toBeUndefined();
    expect(fn('whoops')).toEqual('Value does not match format for xsd:date');

    fn = validator.getValidatorForSlot('a_datetime');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2022-02-22 02:22')).toBeUndefined();
    expect(fn('whoops')).toEqual(
      'Value does not match format for xsd:dateTime'
    );

    fn = validator.getValidatorForSlot('a_time');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('22:23')).toBeUndefined();
    expect(fn('whoops')).toEqual('Value does not match format for xsd:time');
  });

  it('should validate required fields', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('required_string');
    expect(fn('correct')).toBeUndefined();
    expect(fn('')).toEqual('This field is required');
    expect(fn(undefined)).toEqual('This field is required');
  });

  it('should validate minimum and maximum numeric constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('a_big_number');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('123')).toBeUndefined();
    expect(fn('99')).toEqual('Value is less than minimum value');

    fn = validator.getValidatorForSlot('a_small_number');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('9')).toBeUndefined();
    expect(fn('11')).toEqual('Value is greater than maximum value');

    fn = validator.getValidatorForSlot('a_medium_number');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('50')).toBeUndefined();
    expect(fn('11')).toEqual('Value is less than minimum value');
    expect(fn('82')).toEqual('Value is greater than maximum value');
  });

  it('should validate minimum and maximum date constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('during_vancouver_olympics');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2010-01-01')).toEqual('Value is less than minimum value');
    expect(fn('2010-02-20')).toBeUndefined();
    expect(fn('2010-03-01')).toEqual('Value is greater than maximum value');

    fn = validator.getValidatorForSlot('during_vancouver_olympics_todos');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2010-01-01')).toEqual('Value is less than minimum value');
    expect(fn('2010-02-20')).toBeUndefined();
    expect(fn('2010-03-01')).toEqual('Value is greater than maximum value');

    fn = validator.getValidatorForSlot('not_the_future');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2021-01-01')).toBeUndefined();
    expect(fn('3000-01-01')).toEqual('Value is greater than maximum value');

    fn = validator.getValidatorForSlot('not_the_future_todos');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('2021-01-01')).toBeUndefined();
    expect(fn('3000-01-01')).toEqual('Value is greater than maximum value');
  });

  it('should validate constant constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('a_constant');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('const')).toBeUndefined();
    expect(fn('whoops')).toEqual('Value does not match constant');
  });

  it('should validate pattern constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('zip_code');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('99362')).toBeUndefined();
    expect(fn('99362-1234')).toBeUndefined();
    expect(fn('whatever')).toEqual('Value does not match pattern');
  });

  it('should validate any_of constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('an_integer_or_enum');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('One')).toBeUndefined();
    expect(fn('99')).toBeUndefined();
    expect(fn('99.99')).toEqual(
      'Value is not allowed\nValue does not match format for xsd:integer'
    );

    fn = validator.getValidatorForSlot('a_big_or_small_number');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('9')).toBeUndefined();
    expect(fn('101')).toBeUndefined();
    expect(fn('50')).toEqual(
      'Value is greater than maximum value\nValue is less than minimum value'
    );
    expect(fn('hello')).toEqual('Value does not match format for xsd:integer');
  });

  it('should validate all_of constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('unsatisfiable');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('zero')).toEqual('Value does not match format for xsd:integer');
    expect(fn('0')).toEqual('Value does not match constant');
  });

  it('should validate exactly_one_of constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot(
      'an_integer_in_exactly_one_interval'
    );
    expect(fn(undefined)).toBeUndefined();
    expect(fn('5')).toBeUndefined();
    expect(fn('15')).toEqual('All expressions of exactly_one_of held');
    expect(fn('25')).toBeUndefined();
    expect(fn('35')).toEqual(
      'Value is greater than maximum value\nValue is greater than maximum value'
    );
  });

  it('should validate none_of constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('no_bad_words');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('this is okay')).toBeUndefined();
    expect(fn('cuss')).toEqual('One or more expressions of none_of held');
    expect(fn('swear')).toEqual('One or more expressions of none_of held');
  });

  it('should validate multivalued slots', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('many_strings');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('one')).toBeUndefined();
    expect(fn('one; two; three')).toBeUndefined();

    fn = validator.getValidatorForSlot('many_enums');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('One')).toBeUndefined();
    expect(fn('One; Two; Three')).toBeUndefined();
    expect(fn('One; whoops; Three')).toEqual('Value is not allowed');

    fn = validator.getValidatorForSlot('many_small_integers');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('1')).toBeUndefined();
    expect(fn('1; 2; 3')).toBeUndefined();
    expect(fn('1; 2.2; 3')).toEqual(
      'Value does not match format for xsd:integer'
    );
    expect(fn('1; 2; whoops')).toEqual(
      'Value does not match format for xsd:integer'
    );
    expect(fn('11; 2; 3')).toEqual('Value is greater than maximum value');
  });

  it('should validate multivalued cardinality constraints', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    let fn = validator.getValidatorForSlot('just_a_few_strings');
    expect(fn(undefined)).toBeUndefined();
    expect(fn('one')).toEqual('Too few entries');
    expect(fn('one; two; three')).toBeUndefined();
    expect(fn('one; two; three; four; five')).toEqual('Too many entries');
  });

  it('should validate the columns of each row', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = ['required_string', 'a_string', 'an_integer', 'an_enum'];

    let data = [
      ['hello', 'world', '1', 'One'],
      ['', 'wassup', '2.2', 'Four'],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      1: {
        0: 'This field is required',
        2: 'Value does not match format for xsd:integer',
        3: 'Value is not allowed',
      },
    });
  });

  it('should validate the uniqueness of identifiers', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = ['an_identifier'];
    const data = [['one'], ['two'], [''], [''], [''], ['one'], ['three']];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      0: { 0: 'Duplicate identifier not allowed' },
      5: { 0: 'Duplicate identifier not allowed' },
    });
  });

  it('should validate the uniqueness of unique keys', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = ['unique_key_part_a', 'unique_key_part_b'];
    const data = [
      ['one', 'two'],
      ['three', 'four'],
      ['', ''],
      ['three', ''],
      ['', 'four'],
      ['', ''],
      ['one', 'three'],
      ['two', 'two'],
      ['three', 'four'],
      ['', 'four'],
      ['three', 'three'],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      1: {
        0: 'Duplicate values for unique key a_two_part_unique_key not allowed',
        1: 'Duplicate values for unique key a_two_part_unique_key not allowed',
      },
      4: {
        0: 'Duplicate values for unique key a_two_part_unique_key not allowed',
        1: 'Duplicate values for unique key a_two_part_unique_key not allowed',
      },
      8: {
        0: 'Duplicate values for unique key a_two_part_unique_key not allowed',
        1: 'Duplicate values for unique key a_two_part_unique_key not allowed',
      },
      9: {
        0: 'Duplicate values for unique key a_two_part_unique_key not allowed',
        1: 'Duplicate values for unique key a_two_part_unique_key not allowed',
      },
    });
  });

  it('should validate rules with preconditions and postconditions', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = [
      'rule_1_precondition_string',
      'rule_1_postcondition_integer',
      'rule_1_postcondition_float',
    ];
    const data = [
      ['whatever', '20', '20'],
      ['bingo', '200', '-10'],
      ['bongo', '99', '-30'],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      2: {
        1: 'Value is less than minimum value',
      },
    });
  });

  it('should validate rules with preconditions, postconditions, and elseconditions', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = [
      'rule_2_conditional_string',
      'rule_2_big_number',
      'rule_2_small_number',
    ];
    const data = [
      ['big', '20', ''],
      ['big', '200', ''],
      ['big', '', '3'],
      ['whatever', '', '30'],
      ['whatever', '', '3'],
      ['whatever', '200', ''],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      0: {
        1: 'Value is less than minimum value',
      },
      2: {
        1: 'This field is required',
      },
      3: {
        2: 'Value is greater than maximum value',
      },
      5: {
        2: 'This field is required',
      },
    });
  });

  it('should validate value_presence: PRESENT rules', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = ['rule_3_present_or_absent_string', 'rule_3_big_number'];
    const data = [
      ['', ''],
      ['hello', '200'],
      ['hello', ''],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      2: {
        1: 'This field is required',
      },
    });
  });

  it('should validate value_presence: ABSENT rules', () => {
    const validator = new Validator(SCHEMA);
    validator.useTargetClass('Test');

    const header = ['rule_4_present_or_absent_string', 'rule_4_small_number'];
    const data = [
      ['', ''],
      ['hello', ''],
      ['', '5'],
    ];
    const results = validator.validate(data, header);
    expect(results).toEqual({
      0: {
        1: 'This field is required',
      },
    });
  });
});
