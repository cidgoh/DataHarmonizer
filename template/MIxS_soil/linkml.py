#linkml.py
# Combines json version of main schema.yaml file and its imports into one 
# single file in same form as multi-part yaml file
#
# Author: Damion Dooley
#
# Future: could just assemble all yaml files in a folder into one json file.
# Or: could be given a single schema yaml file and lookup imports.

import yaml
import json
from linkml_runtime.utils.schemaview import SchemaView


"""data = [];

for file in ['schema.yaml','terms.yaml','ranges.yaml']:

	with open(file, 'r') as yaml_handle:
		data.append(yaml.load(yaml_handle, Loader=yaml.FullLoader));

with open('data.js', 'w') as output_handle:
	output_handle.write("var DATA = " + json.dumps(data, sort_keys = False, indent = 2, separators = (',', ': ')));
"""

mixs_file = "source/mixs.yaml"
mixs_sv = SchemaView(mixs_file)


data = mixs_sv.class_induced_slots("soil");

with open('data.js', 'w') as output_handle:
	output_handle.write("var DATA = " + json.dumps(data, sort_keys = False, indent = 2, separators = (',', ': ')));


