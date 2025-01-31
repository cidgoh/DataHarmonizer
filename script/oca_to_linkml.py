# oca_to_linkml.py
#
# OCA to LinkML via DH schema_core.tsv, schema_slots.tsv and schema_enums.tsv
# tables which can then be used by tabular_to_schema.py to create LinkML / DH
# schema files schema.yaml and schema.json, as well as language variants.
#
# Author: Damion Dooley
#
# Run this in folder where one wants DataHarmonizer schema to be built, so 
# typically, in some DH web/templates/[schema folder]/, which reads by default
# a file called oca_bundle.json
#
# > python3 ../../../script/oca_to_linkml.py [-i oca_bundle_file_name]
#
# Output: 
#
# 	schema_core.yaml 	- the main LinkML upper yaml structure .
#	schema_slots.tsv 	- the list of column fields added to above yaml.
#	schema_enums.tsv 	- the list of enumerations (code lists) added to above.
#
# Then in DH context, run "> python3 tabular_to_schema.py" to generate
#
# 	schema.yaml	- yaml version of complete LinkML schema for default language
#	schema.json - json version of schema.yaml used by DataHarmonizer
#
# Also for any language locale variants, a language overlay file which is 
# layered on top of the above schema.json file:
#
# 	locales/[i18n locale code]/schema.yaml
# 	locales/[i18n locale code]/schema.json
#
# DataHarmonizer can load the complete schema.json file directly via
# "load template" option.  However access to multilingual functionality will
# require adding the complete schema into the schema bundle and menu.js file.
#
# Detecting OCA data types via regular expression Numeric, Text, 
#
# Numeric:
# integer or decimal number, may begin with + or -	/^[-+]?\d*\.?\d+$/gm
# integer		/^-?[0-9]+$/gm
# 
# Textual:
# Entries of any length with only capital letters		^[A-Z]*$
# Capital or lower case letters only, at least 1 character, and 50 characters max		^[A-Za-z]{1,50}$
# Capital or lower case letters only, 50 characters max		^[A-Za-z]{0,50}$
# Short text, 50 characters max		^.{0,50}$
# Short text, 250 characters max		^.{0,250}$
# long text, 800 characters max		^.{0,800}$
# long text, 4000 characters max		^.{0,4000}$
# Canadian postal codes (A1A 1A1)		^[A-Z][0-9][A-Z]\s[0-9][A-Z][0-9]$
# Zip code		^\d{5,6}(?:[-\s]\d{4})?$
# Email address		[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+
# URL	https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}
# Phone number		\+?\(?\d{2,4}\)?[\d\s-]{3,}
# Latitude in formats S30°15'45.678" or N12°30.999"		^[NS]-?(?:[0-8]?\d|90)°(?:\d+(?:\.\d+)?)(?:'(\d+(?:\.\d+)?)")?$
# Longitude in formats E30°15'45.678" or W90°00.000"		^[WE]-?(?:[0-8]?\d|90)°(?:\d+(?:\.\d+)?)(?:'(\d+(?:\.\d+)?)")?$
#
# Date
#
# ISO: YYYY-MM-DD: year month day	^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
# ISO: YYYYMMDD: year month day	^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$
# ISO: YYYY-MM: year month	^(\d{4})-(0[1-9]|1[0-2])$
# ISO: YYYY-Www: year week (e.g. W01)	^(?:\d{4})-W(0[1-9]|[1-4][0-9]|5[0-3])$
# ISO: YYYYWww: year week (e.g. W01)	^(?:\d{4})W(0[1-9]|[1-4][0-9]|5[0-3])$
# ISO: YYYY-DDD: Ordinal date (day number from the year)	^(?:\d{4})-(00[1-9]|0[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-6])$
# ISO: YYYYDDD: Ordinal date (day number from the year)	^(?:\d{4})(00[1-9]|0[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-6])$
# ISO: YYYY: year	^(\d{4})$
# ISO: MM: month	^(0[1-9]|1[0-2])$
# ISO: DD: day	^(0[1-9]|[1-2][0-9]|3[01])$
# ISO: YYYY-MM-DDTHH:MM:SSZ: Date and Time Combined (UTC)	^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$
# ISO: YYYY-MM-DDTHH:MM:SS±hh:mm: Date and Time Combined (with Timezone Offset)	^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\\d)([+-][01]\\d:[0-5]\d)$
# ISO: PnYnMnDTnHnMnS :durations e.g. P3Y6M4DT12H30M5S	^P(?!$)((\d+Y)|(\d+.\d+Y)$)?((\d+M)|(\d+.\d+M)$)?((\d+W)|(\d+.\d+W)$)?((\d+D)|(\d+.\d+D)$)?(T(?=\d)((\d+H)|(\d+.\d+H)$)?((\d+M)|(\d+.\d+M)$)?(\d+(.\d+S)?)?)?$
# ISO: HH:MM: hour, minutes in 24 hour notation	^([01]\d|2[0-3]):([0-5]\d)$
# ISO: HH:MM:SS: hour, minutes, seconds in 24 hour notation	^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$
# DD/MM/YYYY: day, month, year	^(0[1-9]|[12]\d|3[01])/(0[1-9]|1[0-2])/\d{4}$
# DD/MM/YY: day, month, year	^(0[1-9]|[12]\d|3[01])/(0[1-9]|1[0-2])/\d{2}$
# MM/DD/YYYY: month, day, year	^(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])/\d{4}$
# DDMMYYYY: day, month, year	^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{4}$
# MMDDYYYY: month, day, year	^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{4}$
# YYYYMMDD: year, month, day	^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$
# HH:MM:SS: hour, minutes, seconds 12 hour notation AM/PM	^(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] ?[APMapm]{2}$
# H:MM or HH:MM: hour, minutes AM/PM	^(0?[1-9]|1[0-2]):[0-5][0-9] ?[APMapm]{2}$


import json
import optparse
import os
import sys
from collections import OrderedDict
import yaml
import csv
import re

###############################################################################

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

	parser.add_option(
		"-i",
		"--input",
		dest="input_oca_file",
		default="oca_bundle.json",
		help="Provide an OCA json bundle file path and name to read.",
	)

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
if options.input_oca_file and os.path.isfile(options.input_oca_file):
    with open(options.input_oca_file, "r") as f:
        oca_obj = json.load(f);
else:
	os.exit("- [Input OCA bundle file is required]")

# In parsing input_oca_file, a few attributes are ignored for now in much of
# the structure:
# 	"type": [string absolute/relative URI], 
# 	"capture_base": hash, # Ignore
# ALSO, it is assumed that language variant objects all have the "default" 
# and consistent primary language as first entry.

oca_overlays = oca_obj["bundle"]["overlays"];

# Contains {schema.name,.description,.language} in array 
# Optional?
oca_metas = oca_overlays["meta"][0];

# oca_attributes contains slot.name and slot.datatype
oca_attributes = oca_obj["bundle"]["capture_base"]["attributes"];

# Contains slot.name and slot.pattern
oca_formats = oca_overlays["format"]["attribute_formats"];

# Contains {slot.title,.language} in array
oca_labels = oca_overlays["label"][0]["attribute_labels"];

# Contains {slot.name,.description,.language} in array 
# Optional?
oca_informations = oca_overlays["information"][0]["attribute_information"];

# Contains {"d": "M", "i": "M", "passed": "M"}  # "M" ?
oca_conformance = oca_overlays["conformance"]["attribute_conformance"];

# Contains [enumeration name]:[code,...]
oca_entry_codes = oca_overlays["entry_code"]["attribute_entry_codes"];

# Contains array of {enumeration.language,.attribute_entries} where 
# attribute_entries is dictionary of [enumeration name]: {code, label}
oca_entry_labels = oca_overlays["entry"][0]["attribute_entries"];

SCHEMA = writeSchemaCore();
writeSlots();
writeEnums();

if len(warnings):
	print ("\nWARNING: \n", "\n ".join(warnings));

sys.exit("Finished processing")

