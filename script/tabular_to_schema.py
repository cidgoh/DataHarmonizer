#
# tabular_to_schema.py: A script to generate a LinkML yaml schema from a 
# tabular representation of the schema data structure.
#
# Author: Damion Dooley
# 

import csv
import copy
import sys
import yaml
import json
import optparse
import os
from sys import exit
from functools import reduce
from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper

r_schema_core = 'schema_core.yaml';
r_schema_slots = 'schema_slots.tsv';
r_schema_enums = 'schema_enums.tsv';
w_filename_base = 'schema';

with open(r_schema_core, 'r') as file:
	SCHEMA = yaml.safe_load(file)

'''
settings: not allowed yet.
  lower_case: "^[a-z\\W\\d_]*$"
  UPPER_CASE: "^[A-Z\\W\\d_]*$"
  Title_Case: "^(((?<=\b)[^a-z\\W]\\w*?|[\\W])+)$"
'''
'''
Process each slot given in tabular format.
'''
EXPORT_FORMAT = [];
warnings = [];

with open(r_schema_slots) as tsvfile:

	reader = csv.DictReader(tsvfile, dialect='excel-tab');

  # Row has keys: class_name slot_group slot_uri	title	name range range_2 identifier	
  # multivalued	required	recommended	minimum_value	maximum_value	
  # pattern	structured_pattern description	comments	examples	...

	firstrow = True;
	ranks = {}; #A dictionary holding the current rank for each class.
	schema_class_names = None;

	for row in reader: # Reader strips off first row of headers.

		# Cleanup of cell contents.
		for field in row:
			if field != None and field != '':
				row[field] = row[field].strip();

		# A row may set a list of new class names to cycle through, which remain 
		# pertinent until a subsequent row changes that list. First data row must
		# start with at least one class name.
		row_class_names = row.get('class_name','').strip();
		if row_class_names > '':
			schema_class_names = row_class_names.split(';');

		if schema_class_names is None:
			print ("ERROR: class_name column is missing a class (template) name in first row of schema_slots.tsv")
			sys.exit(0)

		if schema_class_names[len(schema_class_names)-1].strip() == "":
			print ("ERROR: class_name column ",row_class_names," has empty last value.  Remove trailing semicolon and/whitespace?")
			sys.exit(0)

		for class_name in schema_class_names:

			if len(class_name) > 0:
				if not (class_name in SCHEMA['classes']): 
					print ("ERROR: class (template) ", class_name, "is missing in schema_core.yaml")
					sys.exit(0)

				schema_class = SCHEMA['classes'][class_name];
				if not ('slots' in schema_class):
					schema_class['slots'] = []
				if not ('slot_usage' in schema_class):
					schema_class['slot_usage'] = {}

			# Get list of slot (field) export mappings. Each has "EXPORT_" 
			# prefixed into it.
			if (firstrow):
				firstrow = False;
				for key in row:
					if key[0:7] == 'EXPORT_':
						EXPORT_FORMAT.append(key);

			# All slots have a range
			if row.get('range','') > '':
				label = row.get('name',False) or row.get('title','[UNNAMED!!!]')

				print ("processing SLOT:", class_name, label)

				if label in schema_class['slot_usage']:
					warnings.append(f"{class_name} {label} is repeated.  Duplicate slot?")

				# Define basics of slot:
				slot = {
					'name': label
				}

				if row.get('title','') > '':
					slot['title'] = row['title'];

				if row.get('description','') > '':
					slot['description'] = row['description'];
				if row.get('comments','') >'':
					slot['comments'] = row['comments'];

				if row.get('examples','') > '':
					examples = [];
					for v in row['examples'].split(';'):
						# A special trigger to create description is ":  " (2 spaces following)
						ptr = v.find(':  ');
						if ptr == -1:
							examples.append({'value': v.strip() });
						else:
							# Capturing description field as [description]:[value]
							description = v[0:ptr].strip();
							value = v[ptr+1:].strip();
							examples.append({'description': description, 'value': value})

					slot['examples'] = examples;

				if row.get('slot_uri','') > '':
					slot['slot_uri'] = row['slot_uri'];

				if row.get('range','') > '':
					# 2nd range_2 column gets semi-colon separated list of additional ranges
					if row.get('range_2','') > '':
						merged_ranges = [row.get('range')]
						merged_ranges.extend(row.get('range_2').split(';'))
						slot['any_of'] = []
						for x in merged_ranges:
							slot['any_of'].append({'range': x })
					else:
						slot['range'] = row['range'];		

				if row.get('identifier','') == 'TRUE':
					slot['identifier'] = True;
				if row.get('multivalued','') == 'TRUE':
					slot['multivalued'] = True;
				if row.get('required','') == 'TRUE':
					slot['required'] = True;
				if row.get('recommended', '') == 'TRUE':
					slot['recommended'] = True;

				# NEED TO FIX TO ACCEPT Dates, and "{today}". Currently have to stuff
				# comparison in via todos array of things to work on.
				if row.get('minimum_value','') > '':
					if row['minimum_value'].isnumeric():
						slot['minimum_value'] = row['minimum_value'];
					else:
						slot['todos'] = ['>=' + row['minimum_value']];
				if row.get('maximum_value','') > '':
					if row['maximum_value'].isnumeric():
						slot['maximum_value'] = row['maximum_value'];
					else:
						if slot['todos']:
							slot['todos'].append('<=' + row['maximum_value']);
						else:
							slot['todos'] = ['<=' + row['maximum_value']];

				if row.get('pattern','') > '':
					slot['pattern'] = row['pattern'];				
				if row.get('structured_pattern','') > '':
					slot['structured_pattern'] = {
						'syntax': row.get('structured_pattern'),
						'partial_match': False,
						'interpolated': True
					}

				if len(EXPORT_FORMAT) > 0:
					mappings = []
					for export_field in EXPORT_FORMAT:
						if row[export_field] > '':
							prefix = export_field[7:] + ':'
							# Can be multiple targets for an exportable field
							for value in row[export_field].split(';'):
								mappings.append(prefix + value)

					if len(mappings) > 0:
						slot['exact_mappings'] = mappings

				schema_class['slots'].append(slot['name'])

				# Each Class gets its own rank counter.
				if (not (class_name in ranks)):
					ranks[class_name] = 1

				slot_usage = {}

				if row.get('slot_group','') > '':
					slot_usage['slot_group'] = row['slot_group'];

				if slot['name'] in SCHEMA['slots']:
					# If slot has already been set up then compare new slot to existing
					# generic one, and where there are any differences in parameters, 
					# move those differences off to individual class slot_usages, and
					# drop generic_slot parameters
					generic_slot = SCHEMA['slots'][slot['name']]

					field_list = [field for field in row]
					field_list.extend(['any_of','exact_mappings'])
					# block empty field too
					for field in field_list:
						if not (field == None):
							if field in generic_slot:
								# If no generic_slot established, or generic value doesn't match slot value
								if not (field in slot) or slot[field] != generic_slot[field]:
									print ("	Slot param difference:", field)
									if field in slot:
										slot_usage[field] = copy.copy(slot[field])
										#slot_usage[field] = slot[field] # modifying slot_usage
										del slot[field]

									# Find existing class's references to generic_slot and replace 
									# existing class slot_usage[field] = generic_slot[field].
									for class_name2 in SCHEMA['classes']:
										if class_name2 != class_name:
											other_class = SCHEMA['classes'][class_name2]
											if 'slot_usage' in other_class:
												if slot['name'] in other_class['slot_usage']:
													if not (field in other_class['slot_usage'][slot['name']]):
														#print ("here", class_name2, slot['name'], field, generic_slot[field])
														other_class['slot_usage'][slot['name']][field] = copy.copy(generic_slot[field])

									del generic_slot[field]

							# Field never got into generic_slot on previous iteration
							elif field in slot: 
								slot_usage[field] = slot[field]
								del slot[field]

					# Issue is if one slot uses "range" and another uses "any_of" !!!!!

				else:
					# Establish generic slot:
					SCHEMA['slots'][slot['name']] = copy.copy(slot);

				#### Now add particular slot_usage requirements
				slot_usage['rank'] = ranks[class_name];
				ranks[class_name] += 1;

				schema_class['slot_usage'][slot['name']] = slot_usage

'''
Process each enumeration provided in tabular tsv format.
'''
with open(r_schema_enums) as tsvfile:
	reader = csv.DictReader(tsvfile, dialect='excel-tab');

    # Row has keys: meaning	title	permissable_values	permissable_values_2	permissable_values_3	permissable_values_4	permissable_values_5	description		...   EXPORT_GISAID	EXPORT_CNPHI	EXPORT_NML_LIMS	EXPORT_BIOSAMPLE	EXPORT_VirusSeq_Portal

	enumerations = SCHEMA['enums']

	rank = 1;
	title = ''; # running title for chunks of enumeration rows
	menu_path = []
	enum = {}

	for row in reader:

		for field in row:
			if field != None:
				row[field] = row[field].strip();

		if row.get('title','') > '':
			title = row.get('title');

			print("processing ENUMERATION:", title)

			if not (title in enumerations):
				enum = {
					'name': title,
					# from_schema: ...
					'permissible_values': {}
				}
				enumerations[title] = enum

		# Text is label of a particular menu choice
		text = '';
		for depth in range(1,6):
			column = 'menu_' + str(depth)

			if row.get(column,'') > '':
				text = row.get(column);
				del menu_path[depth-1:] # Menu path always points to parent
				break;

		# Here there is a menu item to process
		if text > '':
			choice = {
				'text' : text
			}

			if row.get('description','') > '':
				choice['description'] = row.get('description');

			if row.get('meaning','') > '':
				choice['meaning'] = row.get('meaning');

			# Export mappings can be established for any enumeration items too.
			if len(EXPORT_FORMAT) > 0:
				mappings = []
				for export_field in EXPORT_FORMAT:
					if export_field in row and row[export_field] > '':
						prefix = export_field[7:] + ':'
						for value in row[export_field].split(';'):
							mappings.append(prefix + value)

				if len(mappings) > 0:
					choice['exact_mappings'] = mappings
			


			# FUTURE: Add choice dependency relations on other choices here

			# IMPLEMENTS permissible_values HIERARCHY (not in linkml yet)
			# insert permissible_values in between menu item depth
			#
			#search_path = menu_path.copy()
			#for x in range(len(search_path)):
			#	search_path.insert(2*x, 'permissible_values')
			# This returns parent as a result of dictionary traversal of
			# search_path
			#parent = reduce(dict.get, search_path, enum);
			#if not ('permissible_values' in parent):
			#	parent['permissible_values'] = {}
			#parent['permissible_values'][text] = choice

			# IMPLEMENTS FLAT LIST WITH IS_A HIERARCHY
			if len(menu_path) > 0:
				choice['is_a'] = menu_path[-1] # Last item in path
			enum['permissible_values'][text] = choice
			menu_path.append(text)

	if len(SCHEMA['slots']) == 0:
		print("WARNING: there are no slots in this specification!", title)

	if len(enumerations) == 0:
		print("WARNING: there are no enumerations in this specification!", title)

	if len(warnings):
			print ("\nWARNING: \n", "\n ".join(warnings));

with open(w_filename_base + '.yaml', 'w') as output_handle:
	yaml.dump(SCHEMA, output_handle, sort_keys=False)

schema_spec = SchemaView(yaml.dump(SCHEMA, sort_keys=False));

# Brings in any "imports:". This also includes built-in linkml:types
schema_spec.merge_imports();

# Loop through all top level classes
for name, class_obj in schema_spec.all_classes().items():
    # Note classDef["@type"]: "ClassDefinition" is only available in json
    # output

    # Presence of "slots" in class indicates field hierarchy
    if schema_spec.class_slots(name):
        # Replace class with its induced version. This shifts each slot's
        # content into an attributes dictionary object.
        new_obj = schema_spec.induced_class(name)
        schema_spec.add_class(new_obj)

# Output the amalgamated content:
JSONDumper().dump(schema_spec.schema, w_filename_base + '.json')

