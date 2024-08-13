#
# tabular_to_schema.py: A script to generate a LinkML yaml schema from a 
# tabular representation of the schema data structure.
#
# Navigate to a particular /web/templates/[template folder]/schema.yaml 
# folder and then run python ../../../script/tabular_to_schema.py to
# generate all schema.yaml, and schema.json and locale/[fr/de/etc.]/ 
# schema files.
#
# > cd web/templates/[template folder]/
# > python ../../../script/tabular_to_schema.py 
#
# or, to generate schema files AND add entries in /web/templates/menu.js
#
# > python ../../../script/tabular_to_schema.py -m
# 
# Note, to do command line validation of schema against a data file, type:
#
# linkml-validate --schema schema.yaml --target-class "CanCOGeN Covid-19" test_good.csv
#
# To prepare tsv or csv files for above validation, first line of a
# DataHarmonizer-generated data file with its section headers must be removed,
# and if 2nd line has spaces in its column/slot names, these must be replaced
# by underscores.  Sed can be used to do this:
#
# > sed '1d;2 s/ /_/g' exampleInput/validTestData_2-1-2.tsv > test_good.tsv
#
# FUTURE: design will be revised to have SLOTS managed as a separate
# list from Class reuse of them, where curators will explicitly show
# which particular attributes are overridden.  I.e. Rather than using
# schema_core.yaml, and schema_slots.tsv and schema_enums.tsv, 
# DataHarmonizer will manage a multi-table schema.yaml representation
# directly. In this way class.slot_usage with its attribute overrides
# can be more clearly layered over standardized slot declarations.
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
import urllib
from sys import exit
from functools import reduce
from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper


def init_parser():
	parser = optparse.OptionParser()

	parser.add_option(
		"-m",
		"--menu",
		dest="menu",
		default=False,
		action="store_true",
		help="A flag which indicates menu entries should be generated or updated for a schema's templates (classes).",
	)

	return parser.parse_args();


def set_class_slot(schema_class, slot, slot_group):

	class_name = schema_class['name'];
	slot_name = slot['name'];

	print ("processing SLOT:", class_name, slot_name);

	if not ('slots' in schema_class):
		schema_class['slots'] = [];

	if not ('slot_usage' in schema_class): 
		schema_class['slot_usage'] = {};

	if slot_name in schema_class['slots']:
		warnings.append(f"{class_name} {slot_name} is repeated.  Duplicate slot for this class?");

	# Each class lists off its slots in "slots" attribute.
	schema_class['slots'].append(slot_name);

	#### Now initialize slot_usage requirements
	schema_class['slot_usage'][slot_name] = {'rank': len(schema_class['slots'])};

	if slot_group > '':	
		schema_class['slot_usage'][slot_name]['slot_group'] = slot_group;


# Parse example_string into slot.examples. Works for multilingual slot locale
def set_examples (slot, example_string):
				
	if example_string > '':
		examples = [];
		for v in example_string.split(';'):
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


# A slot's or enum's exact_mappings array gets populated with all the 
# EXPORT_XYZ column cell values.
def set_mappings(record, row, EXPORT_FORMAT):

	mappings = [];
	for export_field in EXPORT_FORMAT:
		if export_field in row and row[export_field] and row[export_field] > '':
			prefix = export_field[7:] + ':';
			# Can be multiple targets for an exportable field
			for value in row[export_field].split(';'):
				# Value, if it has spaces, | etc, seems to require URL encoding.
				mappings.append(prefix + urllib.parse.quote(value) );

	if len(mappings) > 0:
		record['exact_mappings'] = mappings;


# A single range goes into slot.range; more than one goes into slot.any_of[...]
def set_range(slot, slot_range, slot_range_2):
	
	# range_2 column gets semi-colon separated list of additional ranges
	if slot_range > '':
		if slot_range_2 > '':
			merged_ranges = [slot_range];
			merged_ranges.extend(slot_range_2.split(';'));
			slot['any_of'] = [];
			for x in merged_ranges:
				slot['any_of'].append({'range': x });
		else:
			slot['range'] = slot_range;	


# Currently LinkML minimum_value and maximum_value only validate if they are
# integers.
# FUTURE: ACCEPT Dates, and "{today}". Currently have to stuff
# comparison in via todos array of things to work on.
def set_min_max(slot, slot_minimum_value, slot_maximum_value):

	if slot_minimum_value > '':
		if slot_minimum_value.isnumeric():
			slot['minimum_value'] = int(slot_minimum_value);
		else:
			slot['todos'] = ['>=' + slot_minimum_value];
	if slot_maximum_value > '':
		if slot_maximum_value.isnumeric():
			slot['maximum_value'] = int(slot_maximum_value);
		else:
			if slot['todos']:
				slot['todos'].append('<=' + slot_maximum_value);
			else:
				slot['todos'] = ['<=' + slot_maximum_value];


def set_classes(schema_slot_path, schema, locale_schemas, export_format, warnings):

	with open(schema_slot_path) as tsvfile:

		reader = csv.DictReader(tsvfile, dialect='excel-tab');

	  # Row has keys: class_name slot_group slot_uri	title	name range range_2 
	  # identifier multivalued	required	recommended	minimum_value	maximum_value	
	  # pattern	structured_pattern description	comments	examples	...

		firstrow = True;
		schema_class_names = None;

		for row in reader: # Reader strips off first row of headers.

			# Cleanup of cell contents.
			for field in row:
				if field != None and field != '' and row[field]:
					row[field] = row[field].strip();

			# A row may set a list of class names to apply slot definition on that row
			# to.  That list remains active for subsequent rows until a new list is 
			# encountered. First data row must start with at least one class name.
			row_class_names = row.get('class_name','');
			if row_class_names > '':
				schema_class_names = row_class_names.split(';');

			if schema_class_names is None:
				print ("ERROR: class_name column is missing a class (template) name in first row of schema_slots.tsv");
				sys.exit(0);

			if schema_class_names[len(schema_class_names)-1].strip() == "":
				print ("ERROR: class_name column ",row_class_names," has empty last value.  Remove trailing semicolon and/whitespace?");
				sys.exit(0);

			for class_name in schema_class_names:

				if len(class_name) > 0:
					if not (class_name in schema['classes']): 
						print ("ERROR: class (template) ", class_name, "is missing in schema_core.yaml");
						sys.exit(0);

					schema_class = schema['classes'][class_name];

				# Get list of slot (field) export mappings. Each has "EXPORT_" 
				# prefixed into it.
				if (firstrow):
					firstrow = False;
					for key in row:
						if key and key[0:7] == 'EXPORT_':
							export_format.append(key);

				# All slots have a range
				range_col = row.get('range','');
				if range_col and range_col > '':

					# Define basics of slot:
					slot_name = row.get('name',False) or row.get('title','[UNNAMED!!!]');
					slot_title =							row.get('title','');
					slot_group =							row.get('slot_group','');
					slot_description =				row.get('description','');
					slot_comments =						row.get('comments','');
					slot_examples = 					row.get('examples','');
					slot_uri =								row.get('slot_uri','');
					slot_identifier =					row.get('identifier','');
					slot_multivalued =				row.get('multivalued','');
					slot_required =						row.get('required','');
					slot_recommended =				row.get('recommended', '');
					slot_range =							row.get('range','');
					slot_range_2 =						row.get('range_2','');
					slot_pattern = 						row.get('pattern','');
					slot_structured_pattern = row.get('structured_pattern','');
					slot_minimum_value =			row.get('minimum_value','');
					slot_maximum_value =			row.get('maximum_value','');

					slot = {'name': slot_name};

					set_class_slot(schema_class, slot, slot_group);

					if slot_title > '':							slot['title'] = slot_title;
					if slot_description > '':				slot['description'] = slot_description;
					if slot_comments > '':					slot['comments'] = slot_comments;
					if slot_uri > '':								slot['slot_uri'] = slot_uri;
					if slot_identifier == 'TRUE':		slot['identifier'] = True;
					set_range(slot, slot_range, slot_range_2);
					set_min_max(slot, slot_minimum_value, slot_maximum_value);
					if slot_multivalued == 'TRUE':	slot['multivalued'] = True;
					if slot_required == 'TRUE':			slot['required'] = True;
					if slot_recommended == 'TRUE':	slot['recommended'] = True;
					if slot_pattern > '':						slot['pattern'] = slot_pattern;		
					if slot_structured_pattern > '':
																					slot['structured_pattern'] = {
																						'syntax': slot_structured_pattern,
																						'partial_match': False,
																						'interpolated': True
																					}

					set_examples(slot, slot_examples);
					set_mappings(slot, row, export_format);

					# If slot has already been set up in schema['slots'] then compare 
					# each field of new slot to existing generic one, and where there
					# are any differences in parameters, move those differences off to
					# schema[class]['slot_usage'], and drop generic_slot parameters.
					# This honours LinkML's design strategy of generic slots and specific
					# class slots.
					#
					# CURRENTLY MULTI-LINGUAL solution doesn't necessarily work with 
					# multiple templates / classes reusing slots. It would take revision
					# of this conditional to make that work.
					if slot_name in schema['slots']:
						generic_slot = schema['slots'][slot_name];

						field_list = [field for field in row];
						field_list.extend(['any_of','exact_mappings']);
						
						for field in field_list:
							if not (field == None): # skip empty fields
								if field in generic_slot:
									# FUTURE: Do language variant(s) too.
									# If no generic_slot established, or generic value doesn't match slot value
									# then move attribute over to slot_usage.
									if not (field in slot) or slot[field] != generic_slot[field]:
										print ("	Slot param difference:", field);
										if field in slot:
											# Move Slot_usage initially takes ALL attributes of slot field.
											schema_class['slot_usage'][slot_name][field] = copy.deepcopy(slot[field]);
											del slot[field];

										# Find existing class's references to generic_slot and replace 
										# existing class slot_usage[field] = generic_slot[field].
										for class_name2 in schema['classes']:
											if class_name2 != class_name:
												other_class = schema['classes'][class_name2];
												if 'slot_usage' in other_class:
													if slot_name in other_class['slot_usage']:
														if not (field in other_class['slot_usage'][slot_name]):
															other_class['slot_usage'][slot_name][field] = copy.deepcopy(generic_slot[field]);

										del generic_slot[field];

								# Field never got into generic_slot on previous iteration
								elif field in slot: 
									schema_class['slot_usage'][slot_name][field] = slot[field];
									del slot[field];

						# Issue if one class's slot uses "range" and another class's same
						# slot uses "any_of"?

					else:

						# Establish generic slot:
						schema['slots'][slot_name] = copy.deepcopy(slot);

						# Do language variant(s) since we are at a particular slot, with its
						# language translations for "name", "title", "text", "description",
						# "slot_group", "comments", and example "value"]. 
						# Datastructure mirrors schema only for variable language elements.
						variant_fields = ['name','title','description','slot_group','comments'];
						for lcode in locale_schemas.keys():
							locale_schema = locale_schemas[lcode];
							locale_class = locale_schema['classes'][class_name];
							variant_slot = {'name': slot_name};
							variant_slot_group = '';
							for field in variant_fields:
								text = row.get(field + '_' + lcode, schema['slots'][slot_name].get(field, '' ));
								if text:
									variant_slot[field] = text;
									if field == 'slot_group': variant_slot_group = text;

							set_examples(variant_slot, row.get('examples' + '_' + lcode, ''));
							set_class_slot(locale_class, variant_slot, variant_slot_group);

							locale_schema['slots'][slot_name] = variant_slot; # combine into set_examples?
							
		if len(schema['slots']) == 0:
			warnings.append("WARNING: there are no slots in this schema!");


'''
Process each enumeration provided in tabular tsv format. Enumerations are 
referenced by one or more slots.
Row has keys: title	title_fr	meaning	menu_1	menu_2	menu_3	menu_4	menu_5 
description ...   
It may also have EXPORT_[field name] columns too, e.g. EXPORT_GISAID	
EXPORT_CNPHI	EXPORT_NML_LIMS	EXPORT_BIOSAMPLE	EXPORT_VirusSeq_Portal
'''
def set_enums(enum_path, schema, locale_schemas, export_format, warnings):

	with open(enum_path) as tsvfile:
		reader = csv.DictReader(tsvfile, dialect='excel-tab');

		enumerations = schema['enums'];

		title = ''; # running title for chunks of enumeration rows
		menu_path = [];
		enum = {};

		for row in reader:

			for field in row:
				if field != None and row[field]:
					row[field] = row[field].strip();

			# Each enumeration begins with a row that provides the name of the enum.
			if row.get('title','') > '':

				# Process default language title
				title = row.get('title');
				if not (title in enumerations):
					enum = {
						'name': title,
						'permissible_values': {}
					};
					enumerations[title] = enum;
					print("processing ENUMERATION:", title)

					# Normally a language equivalent will be provided but if it is missing
					# we need placeholder anyways in default language.
					for lcode in locale_schemas.keys():
						locale_schema = locale_schemas[lcode];
						locale_schema['enums'][title] = {
							'name': title, # Acts as key 
							'permissible_values': {}
						};

						# Provide translation title if available for this menu.
						locale_title = row.get('title_' + lcode, '');
						if locale_title > '':
							locale_schema['enums'][title]['title'] = row.get('title_' + lcode, title);

			if title > '':
				# Text is label of a particular menu choice
				# Loop scans through columns until it gets a value
				for depth in range(1,6):
					menu_x = 'menu_' + str(depth);
					choice_value = row.get(menu_x);
					# Here there is a menu item to process
					if choice_value > '':
						del menu_path[depth-1:] # Menu path always points to parent

						description = row.get('description','');
						meaning = row.get('meaning','');

						choice = {'text' : choice_value}
						if description > '': choice['description'] = description;
						if meaning > '': choice['meaning'] = meaning;

						# Export mappings can be established for any enumeration items too.
						set_mappings(choice, row, export_format);

						# IMPLEMENTS FLAT LIST WITH IS_A HIERARCHY
						if len(menu_path) > 0:
							choice['is_a'] = menu_path[-1]; # Last item in path

						enum['permissible_values'][choice_value] = choice
						menu_path.append(choice_value)

						for lcode in locale_schemas.keys():
							translation = row.get(menu_x + '_' + lcode, '');
							if translation > '':

								local_choice = copy.deepcopy(choice);
								del local_choice['text']; # in language variant files this isn't needed.
								local_choice['title'] = translation;
								# local_choice['text']  = translation; # in language variant files this isn't needed.

								locale_schemas[lcode]['enums'][title]['permissible_values'][choice_value] = local_choice;

						break;


		if len(enumerations) == 0:
			warnings.append("WARNING: there are no enumerations in this specification!");


def write_schema(schema):

	with open(w_filename_base + '.yaml', 'w') as output_handle:
		yaml.dump(schema, output_handle, sort_keys=False)

	# Now create schema.json which browser app can read directly.  Replaces each
	# class with its induced version. This shifts each slot's content into an
	# attributes: {} dictionary object.
	schema_view = SchemaView(yaml.dump(schema, sort_keys=False));

	# Brings in any "imports:". This also includes built-in linkml:types
	schema_view.merge_imports();

	# Loop through all top level classes and replace class with its induced 
	# version in attributes dictionary.
	for name, class_obj in schema_view.all_classes().items():
		# Note classDef["@type"]: "ClassDefinition" is only in json output
		# Presence of "slots" in class indicates field hierarchy
		if schema_view.class_slots(name):
			new_obj = schema_view.induced_class(name);
			schema_view.add_class(new_obj);

	# Output the amalgamated content:
	JSONDumper().dump(schema_view.schema, w_filename_base + '.json')
	
	return schema_view;


def write_locales(locale_schemas):
	# Do pretty much the same for any locales
	for lcode in locale_schemas.keys():

		directory = 'locales/' + lcode + '/';
		if not os.path.exists(directory):
			os.makedirs(directory, exist_ok=True);

		locale_schema = locale_schemas[lcode];

		with open(directory + w_filename_base + '.yaml', 'w') as output_handle:
			yaml.dump(locale_schema, output_handle, sort_keys=False)

		# Mirror language variant to match default schema.json structure
		locale_view = SchemaView(yaml.dump(locale_schema, sort_keys=False));

		for name, class_obj in locale_view.all_classes().items():
			if locale_view.class_slots(name): 
				new_obj = locale_view.induced_class(name); # specimen collector sample ID
				locale_view.add_class(new_obj);

		JSONDumper().dump(locale_view.schema, directory + w_filename_base + '.json');



# ********* Adjust the menu to include this schema and its classes ******
# Creating a JSON file structure which can be loaded directly into DH:
#
# {
#   "MIxS": {
#     "soil": {
#       "name": 'soil', 
#       "status": "published"
#     },
#     ... etc
#   }
# }
def write_menu(menu_path, schema_folder, schema_spec):

	# Work with existing MENU menu.js, or start new one.
	if os.path.isfile(menu_path):
	    with open(menu_path, "r") as f:
	        menu = json.load(f);
	else:
	    menu = {};

	# Overwrite this folder's menu content
	menu[schema_folder] = {};

	class_menu = {};

	# Get all top level classes
	for name, class_obj in schema_spec.all_classes().items():

    # Presence of "slots" in class indicates field hierarchy
		if schema_spec.class_slots(name):
			class_menu[name] = class_obj;

	for name, class_obj in class_menu.items():

		menu[schema_folder][name] = {
			"name": name,
			"status": "published",
			"display": 'is_a' in class_obj and class_obj['is_a'] == 'dh_interface'
		};

		print("Updated menu for", schema_folder+'/', name);

	# Update or create whole menu
	with open(menu_path, "w") as output_handle:
	    json.dump(menu, fp=output_handle, sort_keys=False, indent=2, separators=(",", ": "))


###############################################################################

r_schema_core = 'schema_core.yaml';
r_schema_slots = 'schema_slots.tsv';
r_schema_enums = 'schema_enums.tsv';
w_filename_base = 'schema';

warnings = [];
locale_schemas = {};
EXPORT_FORMAT = [];

options, args = init_parser();

with open(r_schema_core, 'r') as file:
	SCHEMA = yaml.safe_load(file);

# The schema.in_language locales should be a list (array) of locales beginning
# with the primary language, usually "en" for english. Each local can be from 
# IETF BCP 47.  See https://linkml.io/linkml-model/latest/docs/in_language/
# Copy schema_core object into all array of locales (but skip first default 
# schema since it is the reference.
if 'in_language' in SCHEMA:
	locales = SCHEMA['in_language'];
	print("locales (", len(locales),"):", locales);
	for locale in locales[1:]:
		locale_schemas[locale] = copy.deepcopy(SCHEMA); 
		locale_schemas[locale]['in_language'] = locale;

# Process each slot given in tabular format.
set_classes(r_schema_slots, SCHEMA, locale_schemas, EXPORT_FORMAT, warnings);
set_enums(r_schema_enums, SCHEMA, locale_schemas, EXPORT_FORMAT, warnings);

if len(warnings):
	print ("\nWARNING: \n", "\n ".join(warnings));

print("finished processing.")

schema_view = write_schema(SCHEMA);
write_locales(locale_schemas);

# Adjust menu.json to include or update entries for given schema's template(s)
if options.menu:
	write_menu('../menu.json', os.path.basename(os.getcwd()), schema_view);

