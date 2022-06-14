// Adds existing functions/methods to DataHarminizer.
Object.assign(DataHarmonizer, {

	/**
	 * Get a collection of all invalid cells in the grid.
	 * @return {Object<Number, Object<Number, String>>} Object with invalid rows as
	 *     keys, and objects containing the invalid cells for the row, along with a
	 *     message explaining why, as values. e.g,
	 *     `{0: {0: 'Required cells cannot be empty'}}`
	 */
	getInvalidCells: function () {
		const invalidCells = {};
		const fields = this.getFields();
 		const columnIndex = this.getFieldYCoordinates();
 		let TODAY = new Date();

		const regexDecimal = /^(-|\+|)(0|[1-9]\d*)(\.\d+)?$/;
		let uniquefield = []; // holds lookup dictionary for any unique columns

		let provenanceChanges = [];

		let bad_pattern = {};

		for (let row=0; row < this.hot.countRows(); row++) {
			if (this.hot.isEmptyRow(row)) 
				continue;

			for (let col=0; col<fields.length; col++) {
				const cellVal = this.hot.getDataAtCell(row, col);
				const field = fields[col];
				const datatype = field.datatype;

				// TODO we could have messages for all types of invalidation, and add
				//  them as tooltips
				let msg = '';

				// 1st row of provenance datatype field is forced to have a 
				// 'DataHarmonizer Version: 0.13.0' etc. value.  Change happens silently. 
				if (datatype === 'Provenance') {
					this.checkProvenance(provenanceChanges, cellVal, row, col);
				};

				let	valid = false;

				if (!cellVal) {
					if (field.required)
						msg = 'Required cells cannot be empty'
					else 
						valid = true;
				}

				// If not an empty field, check its contents against field datatype AND/OR other kind of range
				else {

					switch (datatype) {

						case 'xsd:integer':
							var parsedInt = parseInt(cellVal, 10);
							valid = !isNaN(cellVal);
							valid &= parsedInt.toString()===cellVal;
							valid &= this.testNumericRange(parsedInt, field);
							break;

						case 'xsd:nonNegativeInteger':
							var parsedInt = parseInt(cellVal, 10);
							valid = !isNaN(cellVal) && parsedInt>=0;
							valid &= parsedInt.toString()===cellVal;
							valid &= this.testNumericRange(parsedInt, field);
							break;

						case 'xsd:float':
							var parsedFloat = parseFloat(cellVal);
							valid = !isNaN(cellVal) && parsedFloat == cellVal;
							valid &= this.testNumericRange(parsedFloat, field);
							break;

						case 'xsd:double':
							// NEED DOUBLE RANGE VALIDATION
							var parsedFloat = parseFloat(cellVal);
							//valid = !isNaN(cellVal) && regexDouble.test(cellVal);
							valid &= !isNaN(cellVal) && this.testNumericRange(parsedFloat, field);
							break;

						case 'xsd:decimal':
							const parsedDec = parseFloat(cellVal);
							valid = !isNaN(cellVal) && regexDecimal.test(cellVal);
							valid &= this.testNumericRange(parsedDec, field);
							break;

						// XML Boolean lexical space accepts true, false, and also 1 
						// (for true) and 0 (for false).
						case 'xsd:boolean': 
							valid = !isNaN(cellVal) && ['1','0','true','false'].indexOf(cellVal) >= 0;
							break;

						case 'xsd:date':

							// moment is a date format addon
							valid = moment(cellVal, 'YYYY-MM-DD', true).isValid();

							if (valid) {
              					valid = this.testDateRange(cellVal, field, columnIndex, row, TODAY);
							}
							break;

						case 'xsd:string':
							// Default: any string is valid.
							valid = true;
							break;

						case 'xsd:normalizedString':
							// Default: any string is valid.
							valid = true;
							break;

						case 'xsd:token':
							// Default: any token is valid.
							valid = true;
							break;	
					} // End switch


					// A regular expression can be applied against a string or numeric or date value. It doesn't make sense against a categorical value.
					if (valid && field.pattern) {
						// Pattern shouldn't be anything other than a regular expression object
						try {
							valid = field.pattern.test(cellVal);
						}
						catch (err) {
							if (!(field.pattern in bad_pattern)) {
								bad_pattern[field.pattern] = true;
								console.log(`Regular expression /${field.pattern}/ in ${field.title} failed`, err)
							}
							continue;
						}

					}

					// Now perhaps value is invalid from numeric or date datatype 
					// perspective, or its an xsd:token where anything goes. Check if 
					// there are other enumeration values possible in flatVocabulary.

					else 
						if ((!valid || datatype === 'xsd:token') && field.flatVocabulary) {
							if (field.multivalued === true) {
								[valid, update] = this.validateValsAgainstVocab(cellVal, field);
								if (update) 
									this.hot.setDataAtCell(row, col, update, 'thisChange');
							}
							else {
								[valid, update] = this.validateValAgainstVocab(cellVal, field);
								if (update) {
									this.hot.setDataAtCell(row, col, update, 'thisChange');
								}
							}
							// Hardcoded case: If field is xsd:token, and 1st picklist is 
							// "null value menu" then ignore validation on free-text stuff.
							if (!valid && field.datatype === 'xsd:token' && field.sources.length == 1 && field.sources[0] === 'null value menu')
								valid = true;
							//console.log(field.sources, field.datatype, valid, update, datatype)
						}

				} // End of field-not empty section


				// Unique value field (Usually xsd:token string)
				// CORRECT PLACE FOR THIS? 
				if (field.identifier && field.identifier === true) {

					// Set up dictionary and count for this column's unique values
					if (!uniquefield[col]) {
						uniquefield[col] = {};
						for (let keyrow=0; keyrow < this.hot.countRows(); keyrow++) {
							if (!this.hot.isEmptyRow(keyrow)) {
								let key = this.hot.getDataAtCell(keyrow, col);
								if (key in uniquefield[col])
									uniquefield[col][key] += 1;
								else
									uniquefield[col][key] = 1;
							}
						}
					}
					// Must be only 1 unique value.  Case insensitive comparison
					valid &= uniquefield[col][cellVal] === 1;  
				}

				if (!valid) {
					if (!invalidCells.hasOwnProperty(row)) {
						invalidCells[row] = {};
					}
					invalidCells[row][col] = msg;
				}
			} // column/field loop end
		} // row loop end

		// Here an array of (row, column, value)... is being passed
		if (provenanceChanges.length)
			this.hot.setDataAtCell(provenanceChanges);

		return invalidCells;
	},

	/**
	* Test cellVal against "DataHarmonizer provenance: vX.Y.Z" pattern and if it
	* needs an update, do so.
	* @param {Array} provenanceChanges array of provenance updates
	* @param {Object} cellVal field value to be tested.
	* @param {Integer} row index of data
	* @param {Integer} column index of data
	*/
	checkProvenance: function (provenanceChanges, cellVal, row, col) {

		if (!cellVal) {
			provenanceChanges.push([row, col, VERSION_TEXT]);
			return;
		}
		// Most of the time this is the first return point.
		if (cellVal === VERSION_TEXT)
			return;

		if (cellVal.substring(0,14) !== 'DataHarmonizer') {
			provenanceChanges.push([row, col, VERSION_TEXT + ';' + cellVal]);
			return;
		}
		// At this point we have a leading "DataHarmonizer v..." string
		let splitVal = cellVal.split(';',2);

		if (splitVal.length == 1)
			provenanceChanges.push([row, col, VERSION_TEXT]);
		else
			provenanceChanges.push([row, col, VERSION_TEXT + ';' + splitVal[1]]);

		return
	},


	/**
	* Test a given number against an upper or lower range, if any.
	* @param {Number} number to be compared.
	* @param {Object} field that contains min and max limits.
	* @return {Boolean} validity of field.
	*/
	testNumericRange: function (number, field) {

		if (field.minimum_value !== '') {
			if (number < field.minimum_value) {
				return false
			}
		}
		if (field.maximum_value !== '') {
			if (number > field.maximum_value) 
				return false
		}
		return true
	},

	/**
	* Test a given date against an upper or lower range, if any.
	* @param {Date} date to be compared.
	* @param {Object} field that contains min and max limits.
	* @return {Boolean} validity of field.
	*/
	testDateRange: function (aDate, field, columnIndex, row, TODAY) {
	  const self = this;
	  var jsDate = new Date(aDate);

	  const comparison = [field.minimum_value, field.maximum_value];

	  for (ptr in comparison) {
	    let c_items = comparison[ptr];
	    if (c_items) {
		    // Delimited list allows for test against date AND other fields.
		    for (let c_item of c_items.split(";")) {
		      if (c_item !== '') {

		        // Signals lookup expressions:
		        if (c_item[0] === '{' ) {
		          if (c_item === '{today}') {
		            if (self.itemCompare(jsDate, TODAY, ptr)) return false;
		          }
		          else {
		            let field = c_item.substr(1,c_item.length-2);
		            let col = columnIndex[field];
		            let lookup_item = self.hot.getDataAtCell(row, col);
		            if (lookup_item !== '')
		              if (self.itemCompare(jsDate, new Date(lookup_item), ptr)) return false;
		          }
		        }
		        else {
		          // Assumes this is just a constant date string.
		          if (self.itemCompare(jsDate, new Date(c_item), ptr)) return false;
		        }
		      }
		    }
	    }
	  }

	  return true
	},

	/**
	 * Simplifies logic to compare number or date ranges where test limit
	 * is either min_inclusive or max_inclusive
	 * @param {Date or Number} item_1 First value to compare
	 * @param {Date or Number} item_2 Second value to compare
	 * @param {Boolean} gt Type of comparison: 0 = > , 1 = <
	 * @return {Boolean} Result of comparison
	 */
	itemCompare: function (item_1, item_2, gt) {
	  if (gt == 1) 
	    return item_1 > item_2;
	  return item_1 < item_2;

	},


	/**
	* Validate a value against an array of source values.
	* FUTURE: optimize - to precompile lowercased sources.
	* @param {String} val Cell value.
	* @param {Object} field Field to look for flatVocabulary value in.
	* @return {Array<Boolean><Boolean/String>} 
	*         [false, false] `delimited_string` does not match `source`,
	*         [true, false] `delimited_string` matches `source` exactly, 
	*         [true, string] `delimited_string` matches`source` but formatting needs change
	*/
	validateValAgainstVocab: function (value, field) {
		let valid = false;
		let update = false;
		if (value) {
			const trimmedVal = value.trim().toLowerCase();
			const ptr = field.flatVocabularyLCase.indexOf(trimmedVal);
			if (ptr >= 0 ) {
				valid = true;
				// Normalised value being suggested for update 
				if (value != field.flatVocabulary[ptr])
					update = field.flatVocabulary[ptr];
			}
		}
		return [valid, update];
	},

	/**
	* Validate csv values against an array of source values.  Leading/tailing 
	* whitespace and case are ignored in validation, but returned value will be 
	* a suggested update to one or more values if any differ in capitalization.
	* @param {String} delimited_string of values to validate.
	* @param {Object} field to validate values against.
	* @return {Array<Boolean><Boolean/String>} 
	*         [false, false] If some value in `delimited_string` is not in `source`,
	*         [true, false] If every value in `delimited_string` is exactly in `source`, 
	*         [true, string] If every value in `delimited_string` is in `source` but formatting needs change
	*/
	validateValsAgainstVocab: function (delimited_string, field) {
		const self = this;
		let update_flag = false;
		let value_array = delimited_string.split(';');
		value_array.forEach(function (value, index) {
			[valid, update] = self.validateValAgainstVocab(value, field);
			if (!valid) return [false, false];
			if (update) {
				update_flag = true;
				value_array[index] = update;
			}
		})
		if (update_flag)
			return [true, value_array.join(';')];
		else 
			return [true, false];
	}
});
