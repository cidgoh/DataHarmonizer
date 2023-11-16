import { Datatypes } from './utils/datatypes';
import { validateUniqueValues } from './utils/validation';

class Validator {
  #schema;
  #parser;
  #targetClass;
  #multivaluedDelimiter;
  #valueValidatorMap;
  #identifiers;
  #uniqueKeys;
  #results;

  constructor(schema, multivaluedDelimiter = '; ', datatypeOptions = {}) {
    this.#schema = schema;
    this.#parser = new Datatypes(datatypeOptions);
    this.#multivaluedDelimiter = multivaluedDelimiter;
    this.#targetClass = undefined;
  }

  useTargetClass(className) {
    const classDefinition = this.#schema.classes[className];
    if (classDefinition === undefined) {
      throw new Error(`No class named '${className}'`);
    }

    this.#targetClass = classDefinition;

    this.#uniqueKeys = [];
    if (classDefinition.unique_keys) {
      this.#uniqueKeys = Object.entries(classDefinition.unique_keys).map(
        ([name, definition]) => ({
          ...definition,
          unique_key_name: name,
        })
      );
    }

    // Technically LinkML only allows one `identifier: true` slot per class, but
    // DataHarmonizer is being a little looser here and looking for any.
    // See: https://linkml.io/linkml/schemas/slots.html#identifiers
    this.#identifiers = Object.values(classDefinition.attributes)
      .filter(
        (attribute) => attribute.identifier && attribute.identifier === true
      )
      .map((attribute) => attribute.name);

    this.#valueValidatorMap = new Map();
  }

  getValidatorForSlot(slot, inheritedRange) {
    if (typeof slot === 'string' && this.#valueValidatorMap.has(slot)) {
      return this.#valueValidatorMap.get(slot);
    }

    let slotDefinition;
    if (typeof slot === 'string') {
      // This assumes that the schema being passed in has gone through a
      // materialize-attributes step
      slotDefinition = this.#targetClass.attributes[slot];
    } else {
      slotDefinition = slot;
    }

    if (!slotDefinition.range && inheritedRange) {
      slotDefinition.range = inheritedRange;
    }

    const slotType = this.#schema.types?.[slotDefinition.range];
    const slotEnum = this.#schema.enums?.[slotDefinition.range];
    const slotPermissibleValues = Object.values(
      slotEnum?.permissible_values ?? {}
    ).map((pv) => pv.text);

    const anyOfValidators = (slotDefinition.any_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, slotDefinition.range)
    );
    const allOfValidators = (slotDefinition.all_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, slotDefinition.range)
    );
    const exactlyOneOfValidators = (slotDefinition.exactly_one_of ?? []).map(
      (subSlot) => this.getValidatorForSlot(subSlot, slotDefinition.range)
    );
    const noneOfValidators = (slotDefinition.none_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, slotDefinition.range)
    );

    /*
     minimum_value and maximum_value don't technically apply to dates in LinkML,
     but DataHarmonizer will check it anyway. It also supports the special value
     `{today}` in those fields.

     See:
      * https://github.com/linkml/linkml/issues/1384
      * https://github.com/linkml/linkml/issues/751
      * https://github.com/linkml/linkml-model/issues/53
    */
    let slotMinimumValue = this.#parseMinMaxConstraint(
      slotDefinition.minimum_value,
      slotType?.uri
    );
    let slotMaximumValue = this.#parseMinMaxConstraint(
      slotDefinition.maximum_value,
      slotType?.uri
    );

    const validate = (value) => {
      if (slotDefinition.required && !value) {
        return 'This field is required';
      }

      if (slotDefinition.value_presence === 'PRESENT' && !value) {
        return 'Value is not present';
      } else if (slotDefinition.value_presence === 'ABSENT' && value) {
        return 'Value is not absent';
      }

      if (!value) {
        return;
      }

      let splitValues;
      if (slotDefinition.multivalued) {
        splitValues = value.split(this.#multivaluedDelimiter);
        if (
          slotDefinition.minimum_cardinality !== undefined &&
          splitValues.length < slotDefinition.minimum_cardinality
        ) {
          return 'Too few entries';
        }
        if (
          slotDefinition.maximum_cardinality !== undefined &&
          splitValues.length > slotDefinition.maximum_cardinality
        ) {
          return 'Too many entries';
        }
      } else {
        splitValues = [value];
      }

      for (const value of splitValues) {
        if (slotType) {
          const parsed = this.#parser.parse(value, slotType.uri);

          if (parsed === undefined) {
            return `Value does not match format for ${slotType.uri}`;
          }

          if (slotMinimumValue !== undefined && parsed < slotMinimumValue) {
            return 'Value is less than minimum value';
          }

          if (slotMaximumValue !== undefined && parsed > slotMaximumValue) {
            return 'Value is greater than maximum value';
          }

          if (
            (slotDefinition.equals_string !== undefined &&
              parsed !== slotDefinition.equals_string) ||
            (slotDefinition.equals_number !== undefined &&
              parsed !== slotDefinition.equals_number)
          ) {
            return 'Value does not match constant';
          }

          if (
            slotDefinition.pattern !== undefined &&
            !value.match(slotDefinition.pattern)
          ) {
            return 'Value does not match pattern';
          }
        }

        if (slotEnum && !slotPermissibleValues.includes(value)) {
          return 'Value is not allowed';
        }

        if (anyOfValidators.length) {
          const results = anyOfValidators.map((fn) => fn(value));
          const valid = results.some((result) => result === undefined);
          if (!valid) {
            return results.join('\n');
          }
        }

        if (allOfValidators.length) {
          const results = allOfValidators.map((fn) => fn(value));
          const valid = results.every((result) => result === undefined);
          if (!valid) {
            return results.filter((result) => result !== undefined).join('\n');
          }
        }

        if (exactlyOneOfValidators.length) {
          const results = exactlyOneOfValidators.map((fn) => fn(value));
          const valid =
            results.filter((result) => result === undefined).length === 1;
          if (!valid) {
            const messages = results.filter((result) => result !== undefined);
            if (!messages.length) {
              return 'All expressions of exactly_one_of held';
            } else {
              return results
                .filter((result) => result !== undefined)
                .join('\n');
            }
          }
        }

        if (noneOfValidators.length) {
          const results = noneOfValidators.map((fn) => fn(value));
          const valid = results.every((result) => result !== undefined);
          if (!valid) {
            return 'One or more expressions of none_of held';
          }
        }
      }
    };

    if (slotDefinition.name) {
      this.#valueValidatorMap.set(slotDefinition.name, validate);
    }

    return validate;
  }

  validate(data, header) {
    this.#results = {};

    // Iterate over each row and each column performing the validation that can
    // be performed atomically on the value in the cell according to the column's
    // slot. Also while iterating through keep track which rows are empty for
    // use later.
    const nonEmptyRowNumbers = [];
    for (let row = 0; row < data.length; row += 1) {
      let nonEmpty = false;
      for (let column = 0; column < data[row].length; column += 1) {
        const slotName = header[column];
        const valueValidator = this.getValidatorForSlot(slotName);
        const value = data[row][column];
        if (!nonEmpty && value != null && value !== '') {
          nonEmptyRowNumbers.push(row);
          nonEmpty = true;
        }
        const result = valueValidator(data[row][column]);
        if (result !== undefined) {
          this.#addResult(row, column, result);
        }
      }
    }

    // Validate that each column representing an identifier slot contains unique values
    for (const identifier of this.#identifiers) {
      const columns = [header.indexOf(identifier)];
      this.#doUniquenessValidation(
        columns,
        data,
        nonEmptyRowNumbers,
        `Duplicate identifier not allowed`
      );
    }

    // Validate that each group of columns representing unique_keys contains unique values
    for (const uniqueKeysDefinition of this.#uniqueKeys) {
      const columns = uniqueKeysDefinition.unique_key_slots.map((slotName) =>
        header.indexOf(slotName)
      );
      this.#doUniquenessValidation(
        columns,
        data,
        nonEmptyRowNumbers,
        `Duplicate values for unique key ${uniqueKeysDefinition.unique_key_name} not allowed`
      );
    }

    const rules = this.#targetClass.rules ?? [];
    for (const rule of rules) {
      if (rule.deactivated ) {
        continue;
      }

      const preConditions = this.#buildSlotConditionGettersAndValidators(rule.preconditions, header);
      if (preConditions.length === 0) {
        continue;
      }

      const postConditions = this.#buildSlotConditionGettersAndValidators(rule.postconditions, header);
      const elseConditions = this.#buildSlotConditionGettersAndValidators(rule.elseconditions, header);

      for (let row = 0; row < data.length; row += 1) {
        const preConditionsMet = preConditions.every(([getter, validator]) => {
          const [, value] = getter(data[row]);
          return validator(value) === undefined;
        });
        if (preConditionsMet) {
          postConditions.forEach(([getter, validator]) => {
            const [column, value] = getter(data[row]);
            const result = validator(value);
            if (result !== undefined) {
              this.#addResult(row, column, result);
            }
          })
        } else {
          elseConditions.forEach(([getter, validator]) => {
            const [column, value] = getter(data[row]);
            const result = validator(value);
            if (result !== undefined) {
              this.#addResult(row, column, result);
            }
          })
        }
      }
    }

    return this.#results;
  }

  #addResult(row, column, message) {
    if (this.#results === undefined) {
      this.#results = {};
    }
    if (this.#results[row] === undefined) {
      this.#results[row] = {};
    }
    this.#results[row][column] = message;
  }

  #parseMinMaxConstraint(value, type) {
    let parsed;
    if (
      value !== undefined &&
      (type === 'xsd:date' || type === 'xsd:dateTime')
    ) {
      if (value === `{today}`) {
        parsed = new Date();
      } else {
        parsed = this.#parser.parse(value, type);
      }
    } else {
      parsed = value;
    }
    return parsed;
  }

  #doUniquenessValidation(columns, data, nonEmptyRowNumbers, message) {
    if (columns.some((col) => col < 0)) {
      return;
    }
    const columnData = data
      .filter((row, rowNumber) => nonEmptyRowNumbers.includes(rowNumber))
      .map((row) => columns.map((column) => row[column]));
    const isUnique = validateUniqueValues([columnData]);
    for (let idx = 0; idx < isUnique.length; idx += 1) {
      if (isUnique[idx]) {
        continue;
      }
      const row = nonEmptyRowNumbers[idx];
      for (const column of columns) {
        this.#addResult(row, column, message);
      }
    }
  }

  #buildSlotConditionGettersAndValidators(classExpression, header) {
    return Object.values(classExpression?.slot_conditions || {})
      .map((slotCondition) => {
        const column = header.indexOf(slotCondition.name);
        if (column < 0) {
          return;
        }
        const getter = (row) => [column, row[column]];
        let inheritedRange = undefined;
        if (!slotCondition.range) {
          inheritedRange = this.#targetClass.attributes[slotCondition.name].range;
        }
        const validator = this.getValidatorForSlot(slotCondition, inheritedRange);
        return [getter, validator]
      })
      .filter(v => v !== undefined);
  }
}

export default Validator;
