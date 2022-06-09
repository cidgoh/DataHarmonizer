#
# tabular_to_schema.py: A script to generate a LinkML yaml schema from a 
# tabular representation of the schema data structure.
#
# Author: Damion Dooley
# 

import csv
import yaml
from functools import reduce

r_schema_core = 'schema_core.yaml';
r_schema_slots = 'schema_slots.tsv';
r_schema_enums = 'schema_enums.tsv';
w_filename = 'schema.yaml';

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

with open(r_schema_slots) as tsvfile:
	reader = csv.DictReader(tsvfile, dialect='excel-tab');

    # Row has keys: specification slot_uri	is_a	title	range	range_2	identifier	
    # multivalued	required	recommended	minimum_value	maximum_value	
    # capitalize	pattern	description	comments	examples	...

	firstrow = True;
	rank = 1;

	for row in reader:

		# Cleanup of cell contents.
		for field in row:
			row[field] = row[field].strip();

		if row.get('class_name','') > '':
			schema_class = SCHEMA['classes'][row.get('class_name')];
			schema_class['slots'] = []
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

			print ("processing SLOT:", label)

			#Append this slot:
			slot = {
				'name': label
			}

			# from_schema
			# owner

			if row.get('title','') > '':
				slot['title'] = row['title'];

			if row.get('description','') > '':
				slot['description'] = row['description'];
			if row.get('comments','') >'':
				slot['comments'] = row['comments'];
			if row.get('examples','') > '':
				slot['examples'] = [{'value': v} for v in row['examples'].split(';')];

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
					if row.get('todos','') > '':
						slot['todos'].append('<=' + row['maximum_value']);
					else:
						slot['todos'] = '<=' + row['maximum_value'];

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

			SCHEMA['slots'][slot['name']] = slot;

			schema_class['slots'].append(slot['name'])

			# Future: in_subset: The in_subset slot can be used tag your class
			# (or slot) to belong to a pre-defined subset.

			#### Now add particular slot_usage requirements
			slot_usage = {
				#'name': label,
				'rank': rank
			}
			rank += 1;
			if row.get('slot_group','') > '':
				slot_usage['slot_group'] = row['slot_group'];

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

			# At moment linkml doesn't support exact_mappings on 
			if len(EXPORT_FORMAT) > 0:
				mappings = []
				for export_field in EXPORT_FORMAT:
					if row[export_field] > '':
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

with open(w_filename, 'w') as output_handle:
	yaml.dump(SCHEMA, output_handle, sort_keys=False)


