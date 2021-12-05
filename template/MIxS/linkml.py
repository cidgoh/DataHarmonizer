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
from linkml_runtime.dumpers.json_dumper import JSONDumper
import copy


INPUT_FILE = "source/mixs.yaml"
#Test of direct URL fetch
#INPUT_FILE = SchemaView("https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.yaml")


# Custom json serializer: see https://pynative.com/make-python-class-json-serializable/
# This simply removes items with None/null values or empty lists or dictionaries
def encoder(obj):
	obj_type = type(obj);

	simple_dict = copy.copy(obj.__dict__);
	delete_stack = [];
	for i, (k, v) in enumerate(simple_dict.items()):
		if type(v) == list or type(v) == dict:
			if len(v) == 0:
				delete_stack.append(k);
		else:
			if v == None:
				delete_stack.append(k);

	for k in delete_stack:
		simple_dict.pop(k, None);

	return simple_dict


mixs_sv = SchemaView(INPUT_FILE)

#if a specific set of slots is required, add filter here.
#data = mixs_sv.class_induced_slots("soil");

content = {
	"specifications": {}, # Includes slots and slot_usage
	"enumerations": mixs_sv.all_enums(),
	"slots": mixs_sv.all_slots(),
	"types": mixs_sv.all_types()
};

# Get all top level classes
for name, obj in mixs_sv.all_classes().items():
	# Note classDef["@type"]: "ClassDefinition" is only available in json output

	# Slots indicates hierarchy
	# NOTE: Skips special "quantity value" class
	if 'slots' in obj and len(obj['slots'])>0: 
		content['specifications'][name] = mixs_sv.class_induced_slots(name);
		# brings in all induced slot content for each class including all 
		# details, rather than just having code referencing shared slot info.
		#content['specifications'][name] = mixs_sv.class_induced_slots(name);

class_names = content['specifications'].keys();

print ("Created", len(class_names), "specifications:\n", '\n'.join(class_names),'\n');

# Output the amalgamated content:
with open('data.js', 'w') as output_handle:
	output_handle.write("var DATA = " + json.dumps(content, default=encoder, sort_keys = False, indent = 2, separators = (',', ': ')));

""" Using linkml native dumper:
dumper = JSONDumper();

for name, obj in mixs_sv.all_classes().items():
	if 'slots' in obj and len(obj['slots'])>0: 
		content['specifications'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_enums().items(): # all_enums is a dictionary
	content['enumerations'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_slots().items(): # all_types is a dictionary
	content['slots'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_types().items(): # all_types is a dictionary
	content['types'][name] = dumper.dumps(obj);

with open('data.js', 'w') as output_handle:
	output_handle.write('var DATA = ' + content );

"""


