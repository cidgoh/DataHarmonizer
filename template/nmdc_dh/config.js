(function () {
    // a simple data structure to define the relationships between the GOLD ecosystem fields
	const GOLD_FIELDS = {
		ecosystem: {
			upstream: [],
			downstream: ['ecosystem_category', 'ecosystem_type', 'ecosystem_subtype', 'specific_ecosystem'],
		},
		ecosystem_category: {
			upstream: ['ecosystem'],
			downstream: ['ecosystem_type', 'ecosystem_subtype', 'specific_ecosystem'],
		},
		ecosystem_type: {
			upstream: ['ecosystem', 'ecosystem_category'],
			downstream: ['ecosystem_subtype', 'specific_ecosystem'],
		},
		ecosystem_subtype: {
			upstream: ['ecosystem', 'ecosystem_category', 'ecosystem_type'],
			downstream: ['specific_ecosystem'],
		},
		specific_ecosystem: {
			upstream: ['ecosystem', 'ecosystem_category', 'ecosystem_type', 'ecosystem_subtype'],
			downstream: [],
		},
	};

	function getSameRowCellData(dh, columnNames) {
		const [row, rest] = dh.hot.getSelectedLast();
		return columnNames.map(columnName => {
			const col = dh.getFields().findIndex(field => field.name === columnName);
			if (col < 0) {
				return null;
			}
			return dh.hot.getDataAtCell(row, col);
		})
	}

	function getGoldOptions(path = []) {
		// ideally GOLD_ECOSYSTEM_TREE wouldn't be a global variable, but we need a module system first
		let options = window.GOLD_ECOSYSTEM_TREE.children;
		for (let name of path) {
			const item = options.find(child => child.name === name);
			if (!item) {
				options = [];
				break;
			}
			options = item.children;
		}
		return options.map(child => child.name)
	}

	const fieldSettings = {}
	for (let field of Object.keys(GOLD_FIELDS)) {
		fieldSettings[field] = {
			getColumn: function (dh, col) {
				// define a dynamic source field. this function gets the 'upstream' dependent fields,
				// looks up the valid completions in the GOLD classification tree, and provides those
				// as the autocomplete options
				col.source = (_, next) => {
					const dependentRowData = getSameRowCellData(dh, GOLD_FIELDS[field].upstream)
					const options = getGoldOptions(dependentRowData);
					next(options);
				};
				col.type = 'autocomplete';
				col.trimDropdown = false;
				return col;
			},

			onChange: function(change, fields, triggered_changes) {
				// clear downstream fields if the value changes
				if (change[2] !== change[3]) {
					for (let other of GOLD_FIELDS[field].downstream) {
						const otherIdx = fields.findIndex(f => f.title === other)
						triggered_changes.push([change[0], otherIdx, change[2], null])
					}
				}
			}
		}
	}

    // TODO: real modules!
    window.DATA_HARMONIZER_CONFIG = {
        fieldSettings,
    };
})();
