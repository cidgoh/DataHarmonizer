import { Datatypes } from './utils/datatypes';
import { validateUniqueValues } from './utils/validation';
import { rowIsEmpty } from './utils/general';

class Validator {
  #schema;
  #parser;
  #targetClass;
  #targetClassInducedSlots;
  #multivaluedDelimiter;
  #valueValidatorMap;
  #identifiers;
  #uniqueKeys;
  #dependantMinimumValuesMap;
  #dependantMaximumValuesMap;
  #results;

  constructor(schema, multivaluedDelimiter = '; ', datatypeOptions = {}) {
    this.#schema = schema;
    this.#parser = new Datatypes(datatypeOptions);
    this.#multivaluedDelimiter = multivaluedDelimiter;
    this.#targetClass = undefined;
    this.#targetClassInducedSlots = {};
  }

  useTargetClass(className) {
    const classDefinition = this.#schema.classes[className];
    if (classDefinition === undefined) {
      throw new Error(`No class named '${className}'`);
    }

    this.#targetClass = classDefinition;

    // We should just be able to use this.#targetClass.attributes if the JSON-formatted schema
    // was produced with gen-linkml --materialize-attributes, but for some reason that doesn't seem
    // to get all the slot information merged correctly. Need to look at that from the LinkML side.
    // In the meantime, merge everything up manually.
    this.#targetClassInducedSlots = {};
    for (const slotName in this.#targetClass.attributes) {
      this.#targetClassInducedSlots[slotName] = Object.assign(
        {},
        this.#schema.slots?.[slotName],
        this.#targetClass.slot_usage?.[slotName],
        this.#targetClass.attributes[slotName]
      );
    }

    /* LinkML does not yet have support for non-numeric minimum_value and 
    maximum_value. In the meantime, DataHarmonizer has a convention of 
    putting these values in todos with specific prefixes. If a slot has
    any todos, process them here. 

    This has to be defined in runtime since variables like {today} exist
    in todos array.
    */
    const processTodos = (slotDefinition, todos) => {
      if (!todos || !todos.length) {
        return;
      }
      // todos is an array of strings.
      const slotType = this.getSlotType(slotDefinition); // LinkML schema.type object

      // Slot type could be:
      // a number, string, date ...
      // null - if it is only a menu
      // both date and NullValueList
      if (slotType?.uri === 'xsd:date') {
        for (const todo of todos) {
          if (todo.substring(0, 2) === '>=') {
            slotDefinition.minimum_value = todo.substring(2);
          } else if (todo.substring(0, 2) === '<=') {
            slotDefinition.maximum_value = todo.substring(2);
          }
        }
      }

      // Cycle through each slotDefinition any_of etc. object entries and get
      // the datatype of its .range (or recurse) and in LinkML fashion attach
      // minimum_value and maximum_value to the slotDefinition OR its any_of
      // etc array BASED ON top level todos. E.g. inheriting min/max criteria.
      for (const def of slotDefinition.any_of ??
        slotDefinition.all_of ??
        slotDefinition.exactly_one_of ??
        slotDefinition.none_of ??
        []) {
        processTodos(def, todos);
      }
    };

    for (const slotDefinition of Object.values(this.#targetClassInducedSlots)) {
      processTodos(slotDefinition, slotDefinition.todos);
    }

    /* DataHarmonizer has a convention for using todos to specify that for a 
    given row the value of one column is the min/max value of another column
    (e.g. ">={other slot name}"). Index info about that here.
    */
    this.#dependantMinimumValuesMap = new Map();
    this.#dependantMaximumValuesMap = new Map();
    const RE_TODOS = new RegExp(/^([><])={(.*?)}$/);

    for (const slotDefinition of Object.values(this.#targetClassInducedSlots)) {
      const { todos } = slotDefinition;
      if (!todos || !todos.length) {
        continue;
      }
      for (const todo of todos) {
        const match = todo.match(RE_TODOS);
        if (match == null) {
          continue;
        }
        if (
          !Object.prototype.hasOwnProperty.call(
            this.#targetClassInducedSlots,
            match[2]
          )
        ) {
          continue;
        }
        if (match[1] === '>') {
          this.#dependantMinimumValuesMap.set(slotDefinition.name, match[2]);
        } else if (match[1] === '<') {
          this.#dependantMaximumValuesMap.set(slotDefinition.name, match[2]);
        }
      }
    }

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
    this.#identifiers = Object.values(this.#targetClassInducedSlots)
      .filter((slot) => slot.identifier && slot.identifier === true)
      .map((slot) => slot.name);

    this.#valueValidatorMap = new Map();
  }

  /* This returns a single primitive data type for a slot - a decimal, date,
   string etc. or possibly an enumeration.  Enumerations are handled 
   separately however (by const slotEnum = ...). Slots either use "range"
   attribute, OR they use any_of or exactly_one_of etc. attribute expression
   where an array of [range: x, range: y ...] is given.  This call returns the
   schema.types[] lookup for the FIRST range in the list in that case, which
   may be undefined if that is a menu too.
  */
  getSlotType(slotDefinition) {
    var slotType = this.#schema.types?.[slotDefinition.range];

    if (slotType === undefined) {
      const extended_range = ['any_of', 'all_of', 'exactly_one_of', 'none_of'];
      for (let def of extended_range) {
        if (def in slotDefinition) {
          slotType = this.#schema.types?.[slotDefinition[def][0]['range']];
          break;
        }
      }
    }

    return slotType;
  }

  /* A validation function is prepared and cached for every slot presented, so
   that validation throug rows of data can make use of already established
   validator for each column.  Particular columns may have sensitivity to other
   column values (via min/max references) or special {today} e.g. so 

  */
  getValidatorForSlot(slot, options = {}) {
    const { cacheKey, inheritedRange } = options;
    if (typeof cacheKey === 'string' && this.#valueValidatorMap.has(cacheKey)) {
      return this.#valueValidatorMap.get(cacheKey);
    }

    let slotDefinition;
    if (typeof slot === 'string') {
      slotDefinition = this.#targetClassInducedSlots[slot];
    } else {
      slotDefinition = slot;
    }

    // This digs down into any_of, all_of etc to find first date, number etc.
    // slotType is LinkML schema.type object
    if (!slotDefinition.range && inheritedRange) {
      slotDefinition.range = inheritedRange;
    }

    const slotType = this.getSlotType(slotDefinition); // LinkML schema.type object

    const slotEnum = this.#schema.enums?.[slotDefinition.range];
    const slotPermissibleValues = Object.values(
      slotEnum?.permissible_values ?? {}
    ).map((pv) => pv.text);

    // Issue: if any_of lists a NullValueList enumeration in 2nd range
    // where first range is a date, we don't have a menu control but
    // also a valid "Missing" etc isn't validated as ok.
    // TEST CASE:
    //  if (slotDefinition.name == "sample_collection_date")
    //    console.log("any_of", DEBUG INFO)
    // inheritedRange comes from original slot, so it might be a date or number + menu
    const anyOfValidators = (slotDefinition.any_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      })
    );

    const allOfValidators = (slotDefinition.all_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      })
    );
    const exactlyOneOfValidators = (slotDefinition.exactly_one_of ?? []).map(
      (subSlot) =>
        this.getValidatorForSlot(subSlot, {
          inheritedRange: slotDefinition.range,
        })
    );
    const noneOfValidators = (slotDefinition.none_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      })
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
      if (!value) {
        if (slotDefinition.required) return 'This field is required';
        // value_presence is subject to dynamic rules?
        if (slotDefinition.value_presence === 'PRESENT')
          return 'Value is not present';
        return;
      }

      if (slotDefinition.value_presence === 'ABSENT')
        return 'Value is not absent';

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

      // For any of the value(s), whether they are valid depends on either
      // an ok primitive data type parsing, OR a categorical menu match.
      // Message needs
      for (const value of splitValues) {
        let parse_error = false;
        if (slotType) {
          // Doesn't pertain to slots which are ONLY enumerations.
          const parsed = this.#parser.parse(value, slotType.uri);

          // Issue: parse can fail on decimal but menu has "Missing"
          if (parsed === undefined) {
            parse_error = `Value does not match format for ${slotType.uri}`;

            //if (!(anyOfValidators.length || allOfValidators.length || exactlyOneOfValidators.length || noneOfValidators.length)) {
            //  return parse_error;
            //}
          }
          // All these cases have encountered an item which matches basic data
          // datatype and so sudden death is ok.
          else {
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

            // Here slotType value tested and is ok!
            continue;
          }

          // Here value didn't parse to slotType
        } else {
          // No basic slot type here so only enumeration handling.
        }

        // Single range for slot given so no need to evaluate all_of, any_of etc.
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

        if (
          anyOfValidators.length ||
          allOfValidators.length ||
          exactlyOneOfValidators.length ||
          noneOfValidators.length
        ) {
          // We passed validation here which means a parse error can be overriden
        } else if (parse_error.length) {
          //There were no other ranges besides basic slotType so
          return parse_error;
        }
      }
    };

    return validate;
  }

  validate(data, header) {
    this.#results = {};

    // Build a record of empty rows for later use
    const nonEmptyRowNumbers = [];
    for (let row = 0; row < data.length; row += 1) {
      if (!rowIsEmpty(data[row])) {
        nonEmptyRowNumbers.push(row);
      }
    }

    // Iterate over each row and each column performing the validation that can
    // be performed atomically on the value in the cell according to the column's
    // slot.
    for (let row = 0; row < data.length; row += 1) {
      if (!nonEmptyRowNumbers.includes(row)) {
        continue;
      }
      for (let column = 0; column < data[row].length; column += 1) {
        const slotName = header[column];
        const valueValidator = this.getValidatorForSlot(slotName, {
          cacheKey: slotName,
        });
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

    this.#doDependantComparisonValidation(
      this.#dependantMinimumValuesMap,
      data,
      header,
      (a, b) => a >= b,
      'is less than'
    );
    this.#doDependantComparisonValidation(
      this.#dependantMaximumValuesMap,
      data,
      header,
      (a, b) => a <= b,
      'is greater than'
    );

    const rules = this.#targetClass.rules ?? [];
    for (let idx = 0; idx < rules.length; idx += 1) {
      const rule = rules[idx];
      if (rule.deactivated) {
        continue;
      }

      const preConditions = this.#buildSlotConditionGettersAndValidators(
        rule.preconditions,
        header,
        `rule-${idx}-preconditions`
      );
      if (preConditions.length === 0) {
        continue;
      }

      const postConditions = this.#buildSlotConditionGettersAndValidators(
        rule.postconditions,
        header,
        `rule-${idx}-postconditions`
      );
      const elseConditions = this.#buildSlotConditionGettersAndValidators(
        rule.elseconditions,
        header,
        `rule-${idx}-elseconditions`
      );

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
          });
        } else {
          elseConditions.forEach(([getter, validator]) => {
            const [column, value] = getter(data[row]);
            const result = validator(value);
            if (result !== undefined) {
              this.#addResult(row, column, result);
            }
          });
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

  #doDependantComparisonValidation(
    dependantMap,
    data,
    header,
    compareFn,
    message
  ) {
    for (const [slotName, compareSlotName] of dependantMap.entries()) {
      const column = header.indexOf(slotName);
      const compareColumn = header.indexOf(compareSlotName);
      if (column < 0 || compareColumn < 0) {
        continue;
      }
      const slotDefinition = this.#targetClassInducedSlots[slotName];
      // This DH convention is also a bit particular about ranges. It looks at either the slot range
      // or the first any_of range.
      const slotRange =
        slotDefinition.range || slotDefinition.any_of?.[0]?.range;
      const slotType = this.#schema.types?.[slotRange];
      for (let row = 0; row < data.length; row += 1) {
        const compareValue = this.#parser.parse(
          data[row][compareColumn],
          slotType.uri
        );
        if (!compareValue) {
          continue;
        }
        const value = this.#parser.parse(data[row][column], slotType.uri);
        if (!value) {
          continue;
        }
        if (!compareFn(value, compareValue)) {
          this.#addResult(
            row,
            column,
            `Value ${message} value of ${compareSlotName} column`
          );
        }
      }
    }
  }

  #buildSlotConditionGettersAndValidators(
    classExpression,
    header,
    cachePrefix
  ) {
    return Object.values(classExpression?.slot_conditions || {})
      .map((slotCondition) => {
        const column = header.indexOf(slotCondition.name);
        if (column < 0) {
          return;
        }
        const getter = (row) => [column, row[column]];
        let inheritedRange = undefined;
        if (!slotCondition.range) {
          inheritedRange =
            this.#targetClassInducedSlots[slotCondition.name].range;
        }
        const validator = this.getValidatorForSlot(slotCondition, {
          inheritedRange,
          cacheKey: `${cachePrefix}-${slotCondition.name}`,
        });
        return [getter, validator];
      })
      .filter((v) => v !== undefined);
  }
}

export default Validator;
