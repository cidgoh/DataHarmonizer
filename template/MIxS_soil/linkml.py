#linkml.py
# Combines json version of main schema.yaml file and its imports into one 
# single file in same form as multi-part yaml file

import yaml
import json

data = [];

for file in ['schema.yaml','terms.yaml','ranges.yaml']:

	with open(file, 'r') as yaml_handle:
		data.append(yaml.load(yaml_handle, Loader=yaml.FullLoader));

with open('data.js', 'w') as output_handle:
	output_handle.write("var DATA = " + json.dumps(data, sort_keys = False, indent = 2, separators = (',', ': ')));

#var DATA = []