# oca_to_linkml.py
#
# OCA to LinkML via DH schema_core.tsv, schema_slots.tsv and schema_enums.tsv
# tables which can then be used by tabular_to_schema.py to create LinkML / DH
# schema files schema.yaml and schema.json, as well as language variants.
#
# Author: Damion Dooley
#

import json
import optparse
import os
import sys
from collections import OrderedDict
import yaml
import csv
import re

###############################################################################

input_oca_file = 'oca_bundle.json';
schema_core_file = 'schema_core.yaml';
warnings = [];
locale_mapping = {}; # Converting OCA language terms to i18n

SCHEMA_CORE = r"""id: https://example.com/
name: ExampleSchema
title: Example Schema
description: An example schema description
version: 0.0.0
in_language: []
imports:
- linkml:types
prefixes:
  linkml: https://w3id.org/linkml/
classes:
  dh_interface:
    name: dh_interface
    description: A DataHarmonizer interface
slots: {}
enums: {}
types:
  WhitespaceMinimizedString:
    name: WhitespaceMinimizedString
    typeof: string
    description: "A string that has all whitespace trimmed off of beginning and end,
      and all internal whitespace segments reduced to single spaces. Whitespace includes
      #x9 (tab), #xA (linefeed), and #xD (carriage return)."
    base: str
    uri: xsd:token
settings:
  Title_Case: '((?<=\b)[^a-z\W]\w*?|[\W])+'
  UPPER_CASE: '[A-Z\W\d_]*'
  lower_case: '[a-z\W\d_]*'
"""

SCHEMA_SLOTS = [
	"class_name",
	"slot_group",
	"slot_uri",
	"name",
	"title",
	"range",
	"range_2",
	"identifier",
	"multivalued",
	"required",
	"recommended",
	"minimum_value",
	"maximum_value",
	"pattern",
	"structured_pattern",
	"description",
	"comments",
	"examples"
];

SCHEMA_ENUMS = [
	"title",
	"name",
	"meaning",
	"menu_1",
	"menu_2",
	"menu_3",
	"menu_4",
	"menu_5",
	"description"
]; # + language variants.

###############################################################################

def init_parser():
	parser = optparse.OptionParser()
	"""
	parser.add_option(
		"-m",
		"--menu",
		dest="menu",
		default=False,
		action="store_true",
		help="A flag which indicates menu entries should be generated or updated for a schema's templates (classes).",
	)
	"""
	return parser.parse_args();

def save_tsv(file_name, headers, data):
	with open(file_name, 'w') as output_handle:
		csvwriter = csv.writer(output_handle,delimiter='\t', lineterminator='\n');
		csvwriter.writerow(headers);
		for row in data:
			if isinstance(row, OrderedDict):
				csvwriter.writerow(row.values());
			else: # row is an array or dict index
				csvwriter.writerow(data[row].values());

def localeLookup (language):
	# Ideally we're just matching i18n 2 or 3 letter language codes.
	match language:
		case "eng": return "en";
		case "fra":	return "fr";
		case _: return language;

def getLookup(overlay, oca_locale, key):
	for obj in oca_obj["bundle"]["overlays"][overlay]:
		if obj['language'] == oca_locale:
			match overlay:
				case "meta": 
					return obj[key];
				case "label":
					return obj["attribute_labels"][key];
				case "information":
					return obj["attribute_information"][key];
				case "entry":
					return obj["attribute_entries"][key]
	return "";

# For those schemas that have multilingual content
def addLocaleHeaders(headers, fields):
	# Ensure given slot or enum table has right language variation
	if len(locale_mapping) > 1:
		for field in fields:
			for locale in list(locale_mapping)[1:]:
				headers.append(field + "_" + locale);

# Make LinkML schema_core.yaml file which is then filled in with slots and 
# enumerations.
def writeSchemaCore():

	#with open("schema_core_template.yaml", 'r') as file:
	SCHEMA = yaml.safe_load(SCHEMA_CORE);

	SCHEMA["name"] = "DefaultSchemaName";
	# Is meta always in spec?
	if "meta" in oca_obj["bundle"]["overlays"]: 
		oca_meta = oca_metas; # FIRST meta is default
		if "name" in oca_meta:
			SCHEMA["title"] = oca_meta["name"]; # e.g. "Chicken gut health"
			# Schema name as PascalCase version of oca meta schema name.
			SCHEMA["name"] = "".join(filter(str.isalnum, oca_meta["name"].title()))

		SCHEMA["description"] = oca_meta["description"];

	# No other way to get/convey URI of schema at moment.
	SCHEMA["id"] = "https://example.com/" + SCHEMA["name"]; # The official URI of schema

	# Assume existence of label overlay means english if no language specified
	if "language" in oca_obj["bundle"]["overlays"]["label"][0]:
		for label_obj in oca_obj["bundle"]["overlays"]["label"]:
			locale = localeLookup(label_obj["language"]);
			SCHEMA["in_language"].append(locale)
			locale_mapping[locale] = label_obj["language"];

		if len(SCHEMA["in_language"]) == 1: # make it a single value
			SCHEMA["in_language"] = SCHEMA["in_language"][0];
	else:
		# Only do multiple languages if "language" parameter is present.
		SCHEMA["in_language"] = "en";

	SCHEMA["classes"][SCHEMA["name"]] =  {
	    'name': SCHEMA["name"],
    	'title': SCHEMA["title"] or SCHEMA["name"],
    	'description': SCHEMA["description"],
    	'is_a': 'dh_interface'
	}
	# ISSUE: Each class may have (meta) title and description fields translated
	# but we don't have a SCHEMA_CLASSES table to handle translations in 
	# tabular_to_schema.py, so can't communicate them.

	with open("schema_core.yaml", 'w') as output_handle:
		yaml.dump(SCHEMA, output_handle, sort_keys=False);

	return SCHEMA;

def writeSlots():
	# Ensure SCHEMA_SLOTS has language variation
	addLocaleHeaders(SCHEMA_SLOTS, ["slot_group","title","description","comments","examples"]);

	# start slots as an ordered dictionary {slot name:,...} of DH slot attributes.
	slots = OrderedDict([i, OrderedDict([i,""] for i in SCHEMA_SLOTS) ] for i in oca_attributes)

	for slot_name in oca_attributes:
		slot = slots[slot_name];
		slot['class_name'] = SCHEMA["name"];
		slot['name'] = slot_name;
		slot['title'] = oca_labels[slot_name];
		slot['range'] = oca_attributes[slot_name]; # ISSUE: Numeric
		slot['pattern'] = oca_formats[slot_name];
		slot['description'] = oca_informations[slot_name];

		# Range 2 gets any picklist for now.
		if slot_name in oca_entry_codes:
			slots[slot_name]['range_2'] = slot_name;

		# post-process range field:
		match slot['range']: # case sensitive?
			case "Text":
				slot['range'] = "WhitespaceMinimizedString" # or "string"
			case "Numeric":
				# ISSUE: if field is marked as an integer or decimal, then even
				# if regular expression validates, a test against integer or 
				# decimal format will INVALIDATE this slot.
				# Sniff whether it is integer or decimal. FUTURE: allow negatives?
				if re.search("^-?\[0-9\]\{\d+\}$", slot['pattern']):
					slot['range'] = "integer";
				else:
					slot['range'] = "decimal";

		# Need access to original oca language parameter, e.g. "eng"
		if len(locale_mapping) > 1:
			for locale in list(locale_mapping)[1:]:
				oca_locale = locale_mapping[locale];
				#slot['slot_group_'+locale]
				slot['title_'+locale] = getLookup("label", oca_locale, slot_name)
				slot['description_'+locale] = getLookup("information", oca_locale, slot_name)
				#slot['comments_'+locale]
				#slot['examples_'+locale]
	
	save_tsv("schema_slots.tsv", SCHEMA_SLOTS, slots);

def writeEnums():
	addLocaleHeaders(SCHEMA_ENUMS, ["title", "menu_1"]);
	enums = [];
	for enum_name in oca_entry_codes:
		defining_row = True;
		for enum_choice in oca_entry_codes[enum_name]:
			row = OrderedDict([i,""] for i in SCHEMA_ENUMS);
			if defining_row == True:
				row["name"] = enum_name;
				row["title"] = enum_name;
				defining_row = False;

			row["meaning"] = enum_choice;
			row["menu_1"] = oca_entry_labels[enum_name][enum_choice];

			if len(locale_mapping) > 1:
				for locale in list(locale_mapping)[1:]:
					oca_locale = locale_mapping[locale];
					row['menu_1_'+locale] = getLookup("entry", oca_locale, enum_choice)

			enums.append(row);

	save_tsv("schema_enums.tsv", SCHEMA_ENUMS, enums);


###############################################################################

options, args = init_parser();

# Load OCA schema bundle specification
if os.path.isfile(input_oca_file):
    with open(input_oca_file, "r") as f:
        oca_obj = json.load(f);

# In parsing input_oca_file, a few attributes are ignored for now in much of
# the structure:
# 	"type": [string absolute/relative URI], 
# 	"capture_base": hash, # Ignore

# Contains {schema.name,.description,.language} in array 
# Optional?
oca_metas = oca_obj["bundle"]["overlays"]["meta"][0];

# oca_attributes contains slot.name and slot.datatype
oca_attributes = oca_obj["bundle"]["capture_base"]["attributes"];

# Contains slot.name and slot.pattern
oca_formats = oca_obj["bundle"]["overlays"]["format"]["attribute_formats"];

# Contains {slot.title,.language} in array
oca_labels = oca_obj["bundle"]["overlays"]["label"][0]["attribute_labels"];

# Contains {slot.name,.description,.language} in array 
# Optional?
oca_informations = oca_obj["bundle"]["overlays"]["information"][0]["attribute_information"];

# Contains {"d": "M", "i": "M", "passed": "M"}  # "M" ?
oca_conformance = oca_obj["bundle"]["overlays"]["conformance"]["attribute_conformance"];

# Contains [enumeration name]:[code,...]
oca_entry_codes = oca_obj["bundle"]["overlays"]["entry_code"]["attribute_entry_codes"];

# Contains array of {enumeration.language,.attribute_entries} where 
# attribute_entries is dictionary of [enumeration name]: {code, label}
oca_entry_labels = oca_obj["bundle"]["overlays"]["entry"][0]["attribute_entries"];

SCHEMA = writeSchemaCore();
writeSlots();
writeEnums();

if len(warnings):
	print ("\nWARNING: \n", "\n ".join(warnings));

sys.exit("Finished processing")

