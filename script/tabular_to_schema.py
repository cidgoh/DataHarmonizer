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
# Note, to do command line validation of schema against a json data file, type:
#
# linkml-validate --schema schema.yaml --target-class "CanCOGeN Covid-19" test_good.json
#
# Validating against tabular .tsv or .csv (and can do .json or .xls/xlsx too):
#
# dh-validate.py --schema schema.yaml --target-class "CanCOGeN Covid-19" some_data_file.csv
#
# If an error occurs when processing schema.yaml into schema.json, to debug, 
# one can test if schema.yaml is valid with:
#
# > linkml lint --validate-only schema.yaml
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
import json
import optparse
import os
import urllib
from sys import exit
from functools import reduce
from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper
import subprocess
from collections import OrderedDict
from datetime import datetime 
from dateutil import parser

import yaml as safe_yam # yaml

import ruamel.yaml
from ruamel.yaml import YAML # For better indentation on dump
def doubleQuoted(s):
	return s
#ruDoubleQuoted = ruamel.yaml.scalarstring.DoubleQuotedScalarString
ru_yaml = YAML(typ='rt');# rt is default.  typ="safe" resorts keys for loaded files.  See https://stackoverflow.com/questions/78910274/how-to-maintain-original-order-of-attributes-when-using-ruamel-yaml-dump
#ru_yaml.preserve_quotes = True;
ru_yaml.default_style = None; # '"' quotes everything
ru_yaml.width = 4096;
ru_yaml.indent(mapping=2, sequence=4, offset=2) # Tailored to match javascripts write of same file from schema_editor.

# Locale datastructure mirrors schema only for variable language elements.
# 'name' not included because it is coding name which isn't locale specific.
LOCALE_SLOT_FIELDS = ['title','description','slot_group','comments'];

def validateDateTime(date_text):
    try:
        if date_text != datetime.strptime(date_text, "%Y-%m-%d").strftime('%Y-%m-%d'):
            raise ValueError
        return True
    except ValueError:
        return False

def rm_style_info(d):
    if isinstance(d, dict):
        d.fa._flow_style = None
        for k, v in d.items():
            rm_style_info(k)
            rm_style_info(v)
    elif isinstance(d, list):
        d.fa._flow_style = None
        for elem in d:
            rm_style_info(elem)

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


def set_class_slot(schema_class, slot, slot_name, slot_group, warnings):

	print ("processing SLOT:", schema_class['name'], slot_name);

	if not ('slots' in schema_class):
		schema_class['slots'] = [];

	if not ('slot_usage' in schema_class): 
		schema_class['slot_usage'] = {};

	if slot_name in schema_class['slots']:
		warnings.append(f"{schema_class['name']} {slot_name} is repeated.  Duplicate slot for this class?");

	# Each class lists off its slots in "slots" attribute.
	schema_class['slots'].append(slot_name);

	#### Now initialize slot_usage requirements
	if not (slot_name in schema_class['slot_usage']):
		schema_class['slot_usage'][slot_name] = {'name': slot_name};

	schema_class['slot_usage'][slot_name]['rank'] = len(schema_class['slots']);

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
				value = v.strip();
				# There is no way to remove quotes on this side of python object-to-yaml, so must add them on javascript side somehow. See https://stackoverflow.com/questions/70899177/in-ruamel-how-to-start-a-string-with-with-no-quotes-like-any-other-string
				#if validateDateTime(value):
				#	value = parser.parse(value) ; # YAML preservation of date/time
				#	print("GOT DATE", value)
				examples.append({'value': doubleQuoted(value) });
			else:
				# Capturing description field as [description]:[value] 
				description = v[0:ptr].strip();
				value = v[ptr+1:].strip();
				#if validateDateTime(value):
				#	value = parser.parse(value); # YAML preservation of date/time
				#	print("GOT DATE 2", value)
				examples.append({'description': description, 'value': doubleQuoted(value)}) 

		slot['examples'] = examples;


def set_attribute (slot, attribute, content):
	if content > '':
		annotations = {};
		for v in content.split(';'):
			if ':' in v:
				(key, value) = v.split(':');
				key = key.strip();
				value = value.strip();
				if value.lower() == 'true':
					value = bool(value);
				
				if attribute == 'unit' and key != 'ucum_code':
					# FUTURE: do unit conversion here
					annotations['ucum_code'] = value;
				else:
					annotations[key] = value;
			else:
				if attribute == 'unit':
					annotations['ucum_code'] = content;
		slot[attribute] = annotations;


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
# cardinality controls limit on answer count.  Otherwise we would implement the
# slot .all_of, .exactly_one_of, and .none_of options.
def set_range(slot, slot_range, slot_range_2):
	
	# range_2 column gets semi-colon separated list of additional ranges
	ranges = [];
	if len(slot_range): 
		ranges.extend(slot_range.split(';'));
	if len(slot_range_2):
		ranges.extend(slot_range_2.split(';'));

	if len(ranges) > 1:
		slot['any_of'] = [];
		for x in ranges:
			slot['any_of'].append({'range': x });
	
	elif len(ranges) == 1:
		slot['range'] = ranges[0];	


# Currently LinkML minimum_value and maximum_value only validate if they are
# integers.
# FUTURE: ACCEPT Dates, and "{today}". Currently have to stuff
# comparison in via todos array of things to work on.
def set_min_max(slot, slot_minimum_value, slot_maximum_value):

	if slot_minimum_value > '':
		if isInteger(slot_minimum_value):
			slot['minimum_value'] = int(slot_minimum_value);
		elif isDecimal(slot_minimum_value):
			slot['minimum_value'] = float(slot_minimum_value);
		else:
			if not 'todos' in slot:
				slot['todos'] = [];
			slot['todos'] = [doubleQuoted('>=' + slot_minimum_value)];
	if slot_maximum_value > '':
		if isInteger(slot_maximum_value):
			slot['maximum_value'] = int(slot_maximum_value);
		elif isDecimal(slot_maximum_value):
			slot['maximum_value'] = float(slot_maximum_value);
		else:
			if not 'todos' in slot:
				slot['todos'] = [];
			slot['todos'].append(doubleQuoted('<=' + slot_maximum_value));

def isDecimal(x):
    try:
        float(x);
        return True
    except ValueError:
        return False

def isInteger(x):
    try: 
        int(x)
    except ValueError:
        return False
    else:
        return True

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

					# Define basics of slot

					# DataHarmonizer Schema Editor saves slot attributes in this order:
					#'name', 'rank','slot_group','inlined','inlined_as_list','slot_uri','title',
					#'range','any_of','ucum_code','required','recommended','description', 'aliases',   
					#'identifier','multivalued','minimum_value','maximum_value','minimum_cardinality',
					#'maximum_cardinality','pattern', 'structured_pattern','todos','equals_expression',
					#'exact_mappings','comments','examples','version','notes'

					slot_name = row.get('name',False) or row.get('title','[UNNAMED!!!]');
					slot = {'name': slot_name};

					slot_rank =			row.get('rank','');
					if slot_rank > '':	slot['slot_rank'] = slot_rank;

					slot_group =		row.get('slot_group','');
					# Slot_group gets attached to class.slot_usage[slot]
					set_class_slot(schema_class, slot, slot_name, slot_group, warnings);

					slot_inlined =			row.get('inlined','');
					if slot_inlined > '':	slot['slot_inlined'] = slot_inlined;

					slot_inlined_as_list =			row.get('inlined_as_list','');
					if slot_inlined_as_list > '':	slot['slot_inlined_as_list'] = slot_inlined_as_list;

					slot_uri =			row.get('slot_uri','');
					if slot_uri > '':	slot['slot_uri'] = slot_uri;

					slot_title =		row.get('title','');
					if slot_title > '':	slot['title'] = slot_title;

					slot_range =			row.get('range','');
					slot_range_2 =			row.get('range_2',''); #Phasing this out.
					set_range(slot, slot_range, slot_range_2); # Includes 'any_of'

					# Only permitting UCUM codes for now.
					slot_unit =				row.get('unit','');
					#if slot_unit > '':		slot['unit'] = slot_unit;
					if slot_unit > '':	
						slot['unit'] = {'ucum_code': slot_unit};
						#Issue: missing has_quantity_kind, e.g. has_quantity_kind: PATO:0000125 ## mass
					#WHAT????
					#set_attribute(slot, "unit", slot_unit);

					slot_required =					bool(row.get('required',''));
					if slot_required == True:		slot['required'] = True;

					slot_recommended =				bool(row.get('recommended', ''));
					if slot_recommended == True:	slot['recommended'] = True;

					slot_description =				row.get('description','');
					if slot_description > '':			slot['description'] = slot_description;

					# Aliases


					slot_identifier =				bool(row.get('identifier',''));
					if slot_identifier == True:		slot['identifier'] = True;

					slot_multivalued =				bool(row.get('multivalued',''));
					if slot_multivalued == True:	slot['multivalued'] = True;

					slot_minimum_value =			row.get('minimum_value','');
					slot_maximum_value =			row.get('maximum_value','');
					set_min_max(slot, slot_minimum_value, slot_maximum_value);

					slot_minimum_cardinality =		row.get('minimum_cardinality','');
					if slot_minimum_cardinality > '':	
						slot['minimum_cardinality'] = int(slot_minimum_cardinality);

					slot_maximum_cardinality =		row.get('maximum_cardinality','');
					if slot_maximum_cardinality > '':	
						slot['maximum_cardinality'] = int(slot_maximum_cardinality);



					slot_pattern = 			row.get('pattern','');
					if slot_pattern > '':	slot['pattern'] = slot_pattern;	

					# https://linkml.io/linkml/schemas/constraints.html#structured-patterns
					slot_structured_pattern = row.get('structured_pattern','');
					if slot_structured_pattern > '':
						slot['structured_pattern'] = {
							'syntax': doubleQuoted(slot_structured_pattern), 
							'partial_match': False,
							'interpolated': True
						}

					#todos

					#equals_expression

					# Exact_mappings
					set_mappings(slot, row, export_format);

					slot_comments =			row.get('comments','');
					if slot_comments > '':	slot['comments'] = [doubleQuoted(slot_comments)];

					slot_examples = 		row.get('examples','');
					set_examples(slot, slot_examples);

					#version  -  Must be an annotation.
					#notes'

					# Not sure which specs are using annotations...
					slot_annotations = 		row.get('annotations','');
					set_attribute(slot, "annotations", slot_annotations);



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
						for lcode in locale_schemas.keys():
							locale_schema = locale_schemas[lcode];
							locale_class = locale_schema['classes'][class_name];
							variant_slot = {'name': slot_name};
							# variant_slot = {};
							variant_slot_group = '';
							for field in LOCALE_SLOT_FIELDS:
								text = row.get(field + '_' + lcode, schema['slots'][slot_name].get(field, '' ));
								if text:
									if field == 'comments':
										variant_slot[field] = [text];
									else:
										variant_slot[field] = text;

									if field == 'slot_group': 
										variant_slot_group = text;

							set_examples(variant_slot, row.get('examples' + '_' + lcode, ''));
							set_class_slot(locale_class, variant_slot, slot_name, variant_slot_group, warnings);

							locale_schema['slots'][slot_name] = variant_slot;
							# if len(variant_slot) > 0: # Some locale attribute(s) added.
							# 	schema['slots'][slot_name].update({
							# 		'extensions': {
							# 			'locale': {
							# 				'tag': 'locale',
							# 				'value': [{lcode: variant_slot}]
							# 			}
							# 		}
							# 	});

		if len(schema['slots']) == 0:
			warnings.append("WARNING: there are no slots in this schema!");


'''
Process each enumeration provided in tabular tsv format. Enumerations are 
referenced by one or more slots.
Row has keys: title	title_fr	text meaning	menu_1	menu_2	menu_3	menu_4	menu_5 
description ...   
It may also have EXPORT_[field name] columns too, e.g. EXPORT_GISAID	
EXPORT_CNPHI	EXPORT_NML_LIMS	EXPORT_BIOSAMPLE	EXPORT_VirusSeq_Portal
'''
def set_enums(enum_path, schema, locale_schemas, export_format, warnings):

	with open(enum_path) as tsvfile:
		reader = csv.DictReader(tsvfile, dialect='excel-tab');

		if not 'enums' in schema or schema['enums'] == None:
			# print("Note: schema_core.yaml had empty or missing enums list.")
			schema['enums'] = {};

		enumerations = schema['enums'];

		name = ''; # running name for chunks of enumeration rows
		choice_path = [];
		enum = {};

		for row in reader:

			for field in row:
				if field != None and row[field]:
					row[field] = row[field].strip();

			# Each enumeration begins with a row that provides the name of the enum.
			# subsequent rows may not have a name.
			if row.get('name','') > '':

				# Process default language title
				name = row.get('name');
				title = row.get('title');
				#if not name: # For enumerations that don't have separate name field
				#	print("ERROR: enumeration:", title)
				if not (name in enumerations):
					enum = {
						'name': name,
						'title': title,
						'permissible_values': {}
					};
					enumerations[name] = enum;
					print("processing ENUMERATION:", name)

					# Normally a language equivalent will be provided but if it is missing
					# we need placeholder anyways in default language.
					for lcode in locale_schemas.keys():
						locale_schema = locale_schemas[lcode];
						locale_schema['enums'][name] = {
							'name': name, # Acts as key 
							'permissible_values': {}
						};

						# Provide translation title if available for this menu.
						locale_title = row.get('title_' + lcode, '');
						if locale_title > '':
							locale_schema['enums'][name]['title'] = locale_title;

							#local_menu_item = {'title': locale_title};
							locale_description = row.get('description' + lcode, '');
							if locale_description > '':
								locale_schema['enums'][name]['description'] = locale_description;
								#local_menu_item['description'] = locale_description;

						# enumerations[name].update({
						# 	'extensions': {
						# 		'locale': {
						# 			'tag': 'locale',
						# 			'value': [{lcode: local_menu_item}]
						# 		}
						# 	}
						# });

			if name > '':

				# Many menus take default locale (english) label as key, and don't have a value for "text"
				for depth in range(1,6):
					menu_x = 'menu_' + str(depth);
					title = row.get(menu_x);
					if title:
						# Here there is a menu title with possible depth to process
						break;

				# Text is label of a particular menu choice
				# Loop scans through columns until it gets a value
				if 'text' in row and row.get('text') > '':
					choice_text = row.get('text');
				else:
					if title:
						choice_text = title;
					else:
						continue;

				#if title == '': title = choice_text;

				choice = {'text': choice_text};

				if title: choice['title'] = title;

				meaning = row.get('meaning','');
				if meaning: choice['meaning'] = meaning;

				description = row.get('description','');
				if description: choice['description'] = description;

				del choice_path[depth-1:] # Menu path always points to parent
				# IMPLEMENTS FLAT LIST WITH IS_A HIERARCHY
				if len(choice_path) > 0:
					choice['is_a'] = choice_path[-1]; # Last item in path

				# Prepares case where next item is deeper
				choice_path.append(choice_text);

				# Export mappings can be established for any enumeration items too.
				set_mappings(choice, row, export_format);

				enum['permissible_values'][choice_text] = choice;

				# Here there is a menu title with possible depth to process
				if title > '':

					for lcode in locale_schemas.keys():
						translation = row.get(menu_x + '_' + lcode, '');
						if translation > '': # and translation != choice['text'] - don't loose translation entries that happen to have same spelling.

							local_choice = {'title': translation};
							description = row.get(description + '_' + lcode, '');
							if description:
								local_choice['description': description];

							locale_schemas[lcode]['enums'][name]['permissible_values'][choice_text] = local_choice;

							# if len(local_choice) > 0: # Some locale attribute(s) added.
							# 	enum['permissible_values'][choice_text].update({
							# 		'extensions': {
							# 			'locale': {
							# 				'tag': 'locale',
							# 				'value': [{lcode: local_choice}]
							# 			}
							# 		}
							# 	});


		# Generate 'SchemaSlotGroup[schema_class]Menu' so slot and slot_usage
		# attr slot_group can be set.
		# for schema_class in schema['classes']:
		# 			if 'slot_usage'in schema['classes'][schema_class]:
		# 				slot_usage = schema['classes'][schema_class]['slot_usage'];
		# 				for slot_name in slot_usage:
		# 					if 'slot_group' in slot_usage[slot_name]:
		# 						slot_group = slot_usage[slot_name]['slot_group'];
		# 						enum_name = 'SchemaSlotGroup' + schema_class + 'Menu';
		# 						if not (enum_name in enumerations):
		# 							enumerations[enum_name] = {
		# 								'name': enum_name, 
		# 								'permissible_values': {}
		# 							}
		# 						if not (slot_group in enumerations[enum_name]['permissible_values']):
		# 							enumerations[enum_name]['permissible_values'][slot_group] = {
		# 								'title': slot_group
		# 							}

		if len(enumerations) == 0:
			warnings.append("Note: there are no enumerations in this specification!");


def write_schema(folder, filename_base, schema):

	with open(folder + filename_base + '.yaml', 'w') as output_handle:
		# Can't use safe_yam because safe_yam sorts the items differently?!
		ru_yaml.dump(schema, output_handle) # 
		#safe_yam.dump(schema, output_handle, sort_keys=False) # 

	# Trap some errors that come up in created schema.yaml before SchemaView()
	# is attempted

	key_errors = False;
	for class_name in schema['classes']:
		a_class = schema['classes'][class_name];
		if 'unique_keys' in a_class:
			for unique_key in a_class['unique_keys']:
				if 'unique_key_slots' in a_class['unique_keys'][unique_key]:
					for slot_name in a_class['unique_keys'][unique_key]['unique_key_slots']:
						if not slot_name in schema['slots']:
							print("Error: Class", class_name, "has unique key", unique_key, "with slot", slot_name, "but this slot doesn't exist in schema.slots.");
							key_errors = True;
				else:
					print("Error: Class ", class_name, "has unique key", unique_key, " but it is missing a unique_key_slots list");
					key_errors = True;
	if key_errors:
		sys.exit(0);


	#with open("temp.yaml", 'w') as output_handle:
		#yaml.dump(schema, output_handle, sort_keys=False)

		# Add primary key / foreign key relational annotations.  SQL table
		# definition output is hidden but could be put in an optional output.
		#subprocess.run(["gen-sqltables", "--no-metadata", "--relmodel-output", filename_base + '.yaml', "temp.yaml"],capture_output=True);
		# Read in schema that is now endowed with relationship annotations:
		#with open(filename_base + '.yaml', "r") as schema_handle:
		#	schema = yaml.safe_load(schema_handle);

	# Now create schema.json which browser app can read directly.  Replaces each
	# class with its induced version. This shifts each slot's content into an
	# attributes: {} dictionary object.
	#print("SCHEMA VIEW",schema)
	schema_view = SchemaView(safe_yam.dump(schema, sort_keys=False));
	#print("SCHEMAVIEW",schema_view)
	# Brings in any "imports:". This also includes built-in linkml:types
	schema_view.merge_imports();

	# Loop through all top level classes and replace class with its induced 
	# version in attributes dictionary.
	for name, class_obj in schema_view.all_classes().items():
		# Note classDef["@type"]: "ClassDefinition" is only in json output
		# Presence of "slots" in class indicates field hierarchy
		# Error trap is_a reference to non-existent class
		if "is_a" in class_obj and class_obj['is_a'] and (not class_obj['is_a'] in schema['classes']):
			print("Error: Class ", name, "has an is_a reference to a Class [", class_obj['is_a'], "] which isn't defined.  This reference needs to be removed.");
			sys.exit(0);

		if schema_view.class_slots(name):
			new_obj = schema_view.induced_class(name);
			schema_view.add_class(new_obj);

	# ADD pass to Report if classes.attributes.slot_group is found by name or
	# title in a slot definition.  We should evolve to have it in slot_group
	# by name, with title being what is displayed via locale.  So warning
	# if slot_group = title of a slot.



	# SchemaView() is coercing "in_language" into a string when it is an array
	# of i18n languages as per official LinkML spec.  
	if 'in_language' in schema:
		schema_view.schema['in_language'] = schema['in_language'];


	# Output amalgamated content. Schema_view is reordering a number of items.
	# Preserve order
	schema_ordered = OrderedDict();
	annotations = schema_view.all_schema()[0];
	for attribute in [
		'id', 
		'name', 
		'description', 
		'version', 
		'in_language', 
		'default_prefix', 
		'imports',
		'prefixes',
		'classes', 
		'slots', 
		'enums',
		'types',
		'settings',
		'extensions']:
		if attribute in annotations and not annotations[attribute] == None :
			schema_ordered[attribute] = annotations[attribute];

	JSONDumper().dump(schema_ordered, folder + filename_base + '.json');
	
	return schema_view;


#def write_locales(locale_schemas):
#	# Do pretty much the same for any locales
#	for lcode in locale_schemas.keys():
#
#		directory = 'locales/' + lcode + '/';
#		if not os.path.exists(directory):
#			os.makedirs(directory, exist_ok=True);
#
#		locale_schema = locale_schemas[lcode];
#
#		with open(directory + filename_base + '.yaml', 'w') as output_handle:
#			yaml.dump(locale_schema, output_handle) #, sort_keys=False
#
#		# Mirror language variant to match default schema.json structure
#		locale_view = SchemaView(safe_yam.dump(locale_schema)); #, sort_keys=False
#
#		for name, class_obj in locale_view.all_classes().items():
#			if locale_view.class_slots(name): 
#				new_obj = locale_view.induced_class(name);
#				locale_view.add_class(new_obj);
#
#		JSONDumper().dump(locale_view.schema, directory + filename_base + '.json');



# ********* Adjust the menu to include this schema and its classes ******
def write_menu(folder, menu_path, schema_view):

	schema_name = schema_view.schema['name'];

	# Work with existing MENU menu.js, or start new one.
	if os.path.isfile(folder + menu_path):
	    with open(folder + menu_path, "r") as f:
	        menu = json.load(f);
	else:
	    menu = {};

	# Reset this folder's menu content
	menu[schema_name] = {
		"folder": folder,
		"id": schema_view.schema['id'],
		"version": schema_view.schema['version'],
		"templates":{}
	};

	print(schema_view.schema and schema_view.schema['in_language'])

	if 'in_language' in schema_view.schema and schema_view.schema['in_language'] != None:
		menu[schema_name]['locales'] = schema_view.schema['in_language'];

	class_menu = {};

	# Get all top level classes
	for class_name, class_obj in schema_view.all_classes().items():

    	# Presence of "slots" in class indicates field hierarchy
		if schema_view.class_slots(class_name):
			class_menu[class_name] = class_obj;

	# Now cycle through each template:
	for class_name, class_obj in class_menu.items():
		# Obsoleting this: Old DataHarmonizer <=1.9.1 included class_name in
		# menu via "display" if it had an "is_a" attribute = "dh_interface".
		display = 'is_a' in class_obj and class_obj['is_a'] == 'dh_interface';

		# DH > 1.9.1 displays if class is mentined in a "Container" class
		if display == False and 'Container' in schema_view.schema.classes:
			container = schema_view.get_class('Container');
			for container_name, container_obj in container['attributes'].items():
				if container_obj['range'] == class_name:
					display = True;
					break;

		menu[schema_name]['templates'][class_name] = {
			"name": class_name,
			"display": display
		};

		annotations = schema_view.annotation_dict(class_name);
		if 'version' in annotations:
			menu[schema_name]['templates'][class_name]['version'] = annotations['version'];

		print("Updated menu for", schema_name + '/' + class_name);

	# Update or create whole menu
	with open(folder + menu_path, "w") as output_handle:
	    json.dump(menu, fp=output_handle, sort_keys=False, indent=2, separators=(",", ": "))


###############################################################################

def make_linkml_schema(folder, file_name_base, menu = False):

	r_schema_core = 'schema_core.yaml';
	r_schema_slots = 'schema_slots.tsv';
	r_schema_enums = 'schema_enums.tsv';

	warnings = [];
	locale_schemas = {};
	EXPORT_FORMAT = [];

	with open(folder + r_schema_core, 'r') as file:
		SCHEMA = safe_yam.safe_load(file);

	# The schema.in_language locales should be a list (array) of locales beginning
	# with the primary language, usually "en" for english. Each local can be from 
	# IETF BCP 47.  See https://linkml.io/linkml-model/latest/docs/in_language/
	# Copy schema_core object into all array of locales (but skip first default 
	# schema since it is the reference.
	if 'extensions' in SCHEMA and 'locales' in SCHEMA['extensions']:
		locales = SCHEMA['extensions']['locales'];
		for locale in locales:
			print ('processing locale', locale)
			locale_schemas[locale] = copy.deepcopy(SCHEMA); 
			locale_schemas[locale]['in_language'] = locale;

	# Process each slot given in tabular format.
	set_classes(folder + r_schema_slots, SCHEMA, locale_schemas, EXPORT_FORMAT, warnings);
	set_enums(folder + r_schema_enums, SCHEMA, locale_schemas, EXPORT_FORMAT, warnings);

	if len(locale_schemas) > 0:
		for lcode in locale_schemas.keys():
			print("Doing", lcode)
			lschema = locale_schemas[lcode];
			# These have no translation elements
			lschema.pop('prefixes', None);
			lschema.pop('imports', None);
			lschema.pop('types', None);
			lschema.pop('settings', None);
			lschema.pop('extensions', None);

			if 'Container' in lschema['classes']:
				lschema['classes'].pop('Container');
				print("Ignoring Container")

			for class_name, class_obj in lschema['classes'].items():

				class_obj.pop('name', None); # not translatatble
				class_obj.pop('slots', None); # no translations
				class_obj.pop('unique_keys', None);	# no translations
				class_obj.pop('is_a', None); # no translations

				if 'slot_usage' in class_obj:
					for slot_name, slot_usage in class_obj['slot_usage'].items():
						slot_usage.pop('rank', None);

			for name, slot_obj in lschema['slots'].items():
				slot_obj.pop('name', None); # not translatatble

			for name, enum_obj in lschema['enums'].items():
				enum_obj.pop('name', None); # not translatatble
				#enum_obj.pop('is_a', None);

			# This works for 1 language locale only; For DataHarmonizer 2.0, use 
			# DataHarmonizer Schema Editor (template) instead to manage locale
			# content.
			SCHEMA.update({
				'extensions': {
					'locales': { 
						'tag': 'locales',
						'value': {lcode: lschema}
					}
				}
			});

	if len(warnings):
		print ("\nWARNING: \n", "\n ".join(warnings));

	schema_view = write_schema(folder, file_name_base, SCHEMA);

	# Archaic: locales now kept in SCHEMA.extensions.locales
	#write_locales(locale_schemas);

	# Adjust menu.json to include or update entries for given schema's template(s)
	if menu:
		write_menu(folder, '../menu.json', schema_view);



###############################################################################
# Currently command only runs in context of folder where schema_core.yaml is.
def main():

	folder = os.getcwd() + '/';
	options, args = init_parser();
	make_linkml_schema(folder, 'schema', options.menu); 
	print("Finished processing.")

###############################################################################
# Only run when accessed by command line.
if __name__ == "__main__":
    main();
