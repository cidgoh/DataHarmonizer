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
# > python3 ../../../script/oca_to_linkml.py [-i [oca_bundle_file_name.json]]
#
# Output: 
#
# 	schema_core.yaml 	- the main LinkML upper yaml structure .
#	  schema_slots.tsv 	- the list of column fields added to above yaml.
#	  schema_enums.tsv 	- the list of enumerations (code lists) added to above.
#
# Then in DH context, run "> python3 tabular_to_schema.py" to generate
#
# 	schema.yaml	- yaml version of complete LinkML schema for default language
#	  schema.json - json version of schema.yaml used by DataHarmonizer
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
# integer or decimal number, may begin with + or -	/^[-+]?\d*\.?\d+$
# integer		/^-?[0-9]+$
# 
# See also: https://github.com/agrifooddatacanada/OCA_package_standard


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
in_language: en
imports:
- linkml:types
prefixes:
  linkml: https://w3id.org/linkml/
classes: {}
slots: {}
enums:
  SettingsMenu:
    name: SettingsMenu
    title: Regular Expressions
    permissible_values:
      AllCaps:
        title: AllCaps
        description: Entries of any length with only capital letters
      "AlphaText1-50":
        title: "AlphaText1-50"
        description: Capital or lower case letters only, at least 1 character, and 50 characters max
      "AlphaText0-50":
        title: "AlphaText0-50"
        description: Capital or lower case letters only, 50 characters max
      "FreeText0-50":
        title: "FreeText0-50"
        description: Short text, 50 characters max
      "FreeText0-250":
        title: "FreeText0-250"
        description: Short text, 250 characters max
      "FreeText0-800":
        title: "FreeText0-800"
        description: Long text, 800 characters max
      "FreeText0-4000":
        title: "FreeText0-4000"
        description: Long text, 4000 characters max
      CanadianPostalCode:
        title: CanadianPostalCode
        description: Canadian postal codes (A1A 1A1)
      ZipCode:
        title: ZipCode
        description: USA Zip code
      EmailAddress:
        title: EmailAddress
        description: Email address
      URL:
        title: URL
        description: Secure (https) URL
      PhoneNumber:
        title: PhoneNumber
        description: Phone number with international and area code component.
      Latitude:
        title: Latitude
        description: Latitude in formats S30°15'45.678" or N12°30.999"
      Longitude:
        title: Longitude
        description: Longitude in formats E30°15'45.678" or W90°00.000"

      "ISO_YYYY-MM-DD": 
        title: "ISO_YYYY-MM-DD"
        description: year month day
      ISO_YYYYMMDD:
        title: ISO_YYYYMMDD
      "ISO_YYYY-MM":
        title: "ISO_YYYY-MM"
        description: year month 
      "ISO_YYYY-Www":
        title: "ISO_YYYY-Www"
        description: year week (e.g. W01) 
      ISO_YYYYWww:
        title: ISO_YYYYWww
        description: year week (e.g. W01)  
      "ISO_YYYY-DDD":
        title: "ISO_YYYY-DDD"
        description: Ordinal date (day number from the year)
      ISO_YYYYDDD:
        title: ISO_YYYYDDD
        description: Ordinal date (day number from the year)
      ISO_YYYY: 
        title: ISO_YYYY
        description: year
      ISO_MM:
        title: ISO_MM
        description: month
      ISO_DD:
        title: ISO_DD
        description: day
      "ISO_YYYY-MM-DDTHH.MM.SSZ":
        title: "ISO_YYYY-MM-DDTHH:MM:SSZ"
        description: Date and Time Combined (UTC)
      "ISO_YYYY-MM-DDTHH.MM.SS-hh.mm":
        title: "ISO_YYYY-MM-DDTHH:MM:SS±hh:mm"
        description: Date and Time Combined (with Timezone Offset)
      ISO_PnYnMnDTnHnMnS:
        title: ISO_PnYnMnDTnHnMnS
        description: durations e.g. P3Y6M4DT12H30M5S
      "ISO_HH.MM":
        title: "ISO_HH:MM"
        description: hour, minutes in 24 hour notation
      "ISO_HH.MM.SS":
        title: "ISO_HH:MM:SS"
        description: hour, minutes, seconds in 24 hour notation
      "SLASH_DD_MM_YYYY":
        title: "DD/MM/YYYY"
        description: day, month, year
      "SLASH_DD_MM_YY":
        title: "DD/MM/YY"
        description: day, month, year
      "SLASH_MM_DD_YYYY":
        title: "MM/DD/YYYY"
        description: month, day, year
      DDMMYYYY:
        title: DDMMYYYY
        description: day, month, year
      MMDDYYYY:
        title: MMDDYYYY
        description: month, day, year
      YYYYMMDD:
        title: YYYYMMDD
        description: year, month, day
      "HH.MM.SS":
        title: "HH:MM:SS"
        description: hour, minutes, seconds 12 hour notation AM/PM
      "H.MM_or_HH.MM":
        title: "H:MM or HH:MM"
        description: hour, minutes AM/PM

types:
  WhitespaceMinimizedString:
    name: WhitespaceMinimizedString
    typeof: string
    description: "A string that has all whitespace trimmed off of beginning and end, and all internal whitespace segments reduced to single spaces. Whitespace includes x9 (tab), #xA (linefeed), and #xD (carriage return)."
    base: str
    uri: xsd:token

settings:
  Title_Case: '((?<=\b)[^a-z\W]\w*?|[\W])+'
  UPPER_CASE: '[A-Z\W\d_]*'
  lower_case: '[a-z\W\d_]*'
  AllCaps: '^[A-Z]*$'
  "AlphaText1-50": '^[A-Za-z]{1,50}$'
  "AlphaText0-50": '^[A-Za-z]{0,50}$'
  "FreeText0-50": '^.{0,50}$'
  "FreeText0-250": '^.{0,250}$'
  "FreeText0-800": '^.{0,800}$'
  "FreeText0-4000": '^.{0,4000}$'
  CanadianPostalCode: '^[A-Z][0-9][A-Z]\s[0-9][A-Z][0-9]$'
  ZipCode: '^\d{5,6}(?:[-\s]\d{4})?$'
  EmailAddress: '^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+'
  URL: '^https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$'
  PhoneNumber: '^\+?\(?\d{2,4}\)?[\d\s-]{3,}$'
  Latitude: '^[NS]-?(?:[0-8]?\d|90)°(?:\d+(?:\.\d+)?)(?:''(\d+(?:\.\d+)?)")?$'
  Longitude: '^[WE]-?(?:[0-8]?\d|90)°(?:\d+(?:\.\d+)?)(?:''(\d+(?:\.\d+)?)")?$'

  "ISO_YYYY-MM-DD": '^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'
  "ISO_YYYYMMDD": '^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$'
  "ISO_YYYY-MM": '^(\d{4})-(0[1-9]|1[0-2])$'
  "ISO_YYYY-Www": '^(?:\d{4})-W(0[1-9]|[1-4][0-9]|5[0-3])$'
  ISO_YYYYWww: '^(?:\d{4})W(0[1-9]|[1-4][0-9]|5[0-3])$'
  "ISO_YYYY-DDD": '^(?:\d{4})-(00[1-9]|0[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-6])$'
  ISO_YYYYDDD: '^(?:\d{4})(00[1-9]|0[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-6])$'
  ISO_YYYY: '^(\d{4})$'
  ISO_MM: '^(0[1-9]|1[0-2])$'
  ISO_DD: '^(0[1-9]|[1-2][0-9]|3[01])$'
  "ISO_YYYY-MM-DDTHH.MM.SSZ": '^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$'
  "ISO_YYYY-MM-DDTHH.MM.SS-hh.mm": '^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\\d)([+-][01]\\d:[0-5]\d)$'
  ISO_PnYnMnDTnHnMnS: '^P(?!$)((\d+Y)|(\d+.\d+Y)$)?((\d+M)|(\d+.\d+M)$)?((\d+W)|(\d+.\d+W)$)?((\d+D)|(\d+.\d+D)$)?(T(?=\d)((\d+H)|(\d+.\d+H)$)?((\d+M)|(\d+.\d+M)$)?(\d+(.\d+S)?)?)?$'
  "ISO_HH.MM": '^([01]\d|2[0-3]):([0-5]\d)$'
  "ISO_HH.MM.SS": '^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$'
  "SLASH_DD_MM_YYYY": '^(0[1-9]|[12]\d|3[01])/(0[1-9]|1[0-2])/\d{4}$'
  "SLASH_DD_MM_YY": '^(0[1-9]|[12]\d|3[01])/(0[1-9]|1[0-2])/\d{2}$'
  "SLASH_MM_DD_YYYY": '^(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])/\d{4}$'
  DDMMYYYY: '^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{4}$'
  MMDDYYYY: '^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{4}$'
  YYYYMMDD: '^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$' # DUPLICATE of ISO_YYYYMMDD
  "HH.MM.SS": '^(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] ?[APMapm]{2}$'
  "H.MM_or_HH.MM": '^(0?[1-9]|1[0-2]):[0-5][0-9] ?[APMapm]{2}$'


"""

SCHEMA_SLOTS = [
	"class_name",
	"slot_group",
	"slot_uri",
	"name",
	"title",
	"range",
	"range_2",
	"unit",
	"identifier",
	"multivalued",
	"minimum_cardinality",
	"maximum_cardinality",
	"required",
	"recommended",
	"minimum_value",
	"maximum_value",
	"pattern",
	"structured_pattern",
	"description",
	"comments",
	"examples",
  "annotations"
];

SCHEMA_ENUMS = [
	"title",
	"name",
	"text",
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

	parser.add_option(
		"-o",
		"--output",
		dest="file_path",
		default="",
		help="Provide an output folder to save results in.",
	)

	return parser.parse_args();

def save_tsv(file_name, headers, data):
	with open(file_name, 'w') as output_handle:
		csvwriter = csv.writer(output_handle, delimiter='\t', lineterminator='\n');
		csvwriter.writerow(headers);
		for row in data:
			if isinstance(row, OrderedDict):
				csvwriter.writerow(row.values());
			else: # row is an array or dict index
				csvwriter.writerow(data[row].values());

def localeLookup (language):
	# Ideally we're just matching i18n 2 or 3 letter language codes.
	# Converting to i18n code
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
def writeSchemaCore(file_path):

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

	# SCHEMA["in_language"] set to "en" in template above.
	# Only do multiple languages if "language" parameter is present.
	# Assume existence of label overlay means english if no language specified
	if "label" in oca_overlays and "language" in oca_overlays["label"][0]:
		for label_obj in oca_obj["bundle"]["overlays"]["label"]:
			locale = localeLookup(label_obj["language"]);
			locale_mapping[locale] = label_obj["language"];
			# Set up empty extension for tabular_to_schema.py to set up:
			if locale != 'en':
				if not 'extensions' in SCHEMA:
					SCHEMA['extensions'] = {};
					SCHEMA['extensions']['locales'] = {};

				SCHEMA['extensions']['locales'][locale] = None;


	SCHEMA["classes"][SCHEMA["name"]] =  {
	    'name': SCHEMA["name"],
    	'title': SCHEMA["title"] or SCHEMA["name"],
    	'description': SCHEMA["description"],
	}

	# Associate classification keywords with this class (Rather than LinkML schema as a whole)
	if len(oca_classification):
		SCHEMA["classes"][SCHEMA["name"]]["keywords"] = oca_classification;

	# Set up Container class to hold given schema class's data
	SCHEMA['classes']['Container'] = {
    'name': 'Container',
    'tree_root': True,
    'attributes': {
			'name': SCHEMA['name'] + 'Data',
			'multivalued': True,
			'range': SCHEMA['name'],
			'inlined_as_list': True
		}
	}

	# ISSUE: Each class may have (meta) title and description fields translated
	# but we don't have a SCHEMA_CLASSES table to handle translations in 
	# tabular_to_schema.py, so can't communicate them.

	with open(file_path + "/schema_core.yaml", 'w') as output_handle:
		yaml.dump(SCHEMA, output_handle, sort_keys=False);

	return SCHEMA;


################################ SLOT OUTPUT ################################
def writeSlots(file_path):
	# Ensure SCHEMA_SLOTS has language variation
	addLocaleHeaders(SCHEMA_SLOTS, ["slot_group","title","description","comments","examples"]);

	# Start slots as an ordered dictionary {slot name:,...} of DH slot attributes.
	slots = OrderedDict([i, OrderedDict([i,""] for i in SCHEMA_SLOTS) ] for i in oca_attributes)

	for slot_name in oca_attributes:
		slot = slots[slot_name];
		slot['slot_group'] = "General"; #Default; ideally not needed.
		slot['class_name'] = SCHEMA["name"];
		slot['name'] = slot_name;
		if slot_name in oca_labels:
			slot['title'] = oca_labels[slot_name];
		slot['range'] = oca_attributes[slot_name]; # Type is a required field?
		if slot_name in oca_formats:
			slot['pattern'] = oca_formats[slot_name];
		if slot_name in oca_informations:
			slot['description'] = oca_informations[slot_name]; 

		# Minnum and maximum number of values in array of a multivalued field.
		# See https://oca.colossi.network/specification/#cardinality-overlay
		if slot_name in oca_cardinality:  # Format: n, n-, n-m, -m
			card = oca_cardinality[slot_name];
			if '-' in card:
				if '-' == card[0]:
					slot['maximum_cardinality'] = int(card[1:]);
					if (slot['maximum_cardinality'] > 1):
						slot['multivalued'] = True;
				elif '-' == card[-1]:
					slot['minimum_cardinality'] = int(card[0:-1]);
					slot['multivalued'] = True;
				else:
					(min, max) = card.split('-');
					slot['minimum_cardinality'] = int(min);
					slot['maximum_cardinality'] = int(max);
					if (int(max) < int(min)):
						warnings.append("Field " + slot_name + " has maximum_cardinality less than the minimum_cardinality.")
					if int(max) > 1:
						slot['multivalued'] = True;
			else: # A single value so both min and max
				slot['minimum_cardinality'] = slot['maximum_cardinality'] = int(card);
				if int(card) > 1:
					slot['multivalued'] = True;

		# If slot range is "Array[some datatype]",
		if slot['range'][0:5] == "Array":
			slot['multivalued'] = True;
			slot['range'] = re.search('\[(.+)\]', slot['range']).group(1);

		# Range 2 gets any picklist for now.
		if slot_name in oca_entry_codes:
			slots[slot_name]['range_2'] = slot_name;

		if slot_name in oca_conformance:
			match oca_conformance[slot_name]:
				case "M": # Mandatory
					slot['required'] = True;
				case "O": # Optional -> Recommended?!
					slot['recommended'] = True;

		# Flag that this field may have confidentiality compromising content.
		# Field confidentiality https://kantarainitiative.org/download/blinding-identity-taxonomy-pdf/
		# https://lf-toip.atlassian.net/wiki/spaces/HOME/pages/22974595/Blinding+Identity+Taxonomy
		# Currently the only use of slot.attributes:
		if slot_name in oca_identifying_factors:
			slot['annotations'] = 'identifying_factor:True';

		# Conversion of range field from OCA to LinkML data types.
    # See https://github.com/ClimateSmartAgCollab/JSON-Form-Generator/blob/main/src/JsonFormGenerator.js
    # See also: https://oca.colossi.network/specification/#attribute-type
    # There's also a list of file types: https://github.com/agrifooddatacanada/format_options/blob/main/format/binary.md
    # Data types: Text | Numeric | Reference (crypto hash) | Boolean | Binary | DateTime | Array[data type]
		match slot['range']: # case sensitive?

			case "Text":
				# https://github.com/agrifooddatacanada/format_options/blob/main/format/text.md
				slot['range'] = "WhitespaceMinimizedString" # or "string"

			case "Numeric":
        # https://github.com/agrifooddatacanada/format_options/blob/main/format/numeric.md
				# ISSUE: if field is marked as an integer or decimal, then even
				# if regular expression validates, a test against integer or 
				# decimal format will INVALIDATE this slot.
				# Sniff whether it is integer or decimal.
				if re.search("^-?\[0-9\]\{\d+\}$", slot['pattern']):
					slot['range'] = "integer";
				else:
					slot['range'] = "decimal";

			case "DateTime":
				# There are many datatypes that might be matched via the OCA regex expression used to define them.
				pass
			case "Boolean":
				pass

		# OCA mentions a oca_overlays["unit"]["metric_system"] (usually = "SI"),
		# So here is a place to do unit conversion to UCUM if possible.
		# https://ucum.nlm.nih.gov/ucum-lhc/demo.html
		if slot_name in oca_units:
			# slot unit: / ucum_code: cm
			if "metric_system" in oca_overlays["unit"]:
				slot['unit'] = oca_overlays["unit"]["metric_system"] + ":" + oca_units[slot_name];
			else:
				slot['unit'] = oca_units[slot_name];

    # Now convert any slot datatypes where pattern matches OCA-specific data type
		for type_name in SCHEMA["types"]:
			if "pattern" in SCHEMA["types"][type_name]:
				if SCHEMA["types"][type_name]["pattern"] == slot['pattern']:
					#print("PATTERN", type_name, )
					slot['range'] = type_name;
					slot['pattern'] = ''; # Redundant


		# Need access to original oca language parameter, e.g. "eng"
		if len(locale_mapping) > 1:
			for locale in list(locale_mapping)[1:]: # Skips english
				oca_locale = locale_mapping[locale];
				slot['slot_group_'+locale] = "Generic";
				slot['title_'+locale] = getLookup("label", oca_locale, slot_name)
				slot['description_'+locale] = getLookup("information", oca_locale, slot_name)
				#slot['comments_'+locale] # No OCA equivalent
				#slot['examples_'+locale] # No OCA equivalent
	
	save_tsv(file_path + "/schema_slots.tsv", SCHEMA_SLOTS, slots);


################################ ENUM OUTPUT ################################
def writeEnums(file_path):
	addLocaleHeaders(SCHEMA_ENUMS, ["title", "menu_1"]);
	enums = [];
	for enum_name in oca_entry_codes:
		row = OrderedDict([i,""] for i in SCHEMA_ENUMS);
		row["name"] = enum_name;
		row["title"] = enum_name;
		enums.append(row);

		for enum_choice in oca_entry_codes[enum_name]:
			row = OrderedDict([i,""] for i in SCHEMA_ENUMS);
			row["text"] = enum_choice;
			#row["meaning"] = ????;
			row["menu_1"] = oca_entry_labels[enum_name][enum_choice];

			if len(locale_mapping) > 1:
				for locale in list(locale_mapping)[1:]:
					oca_locale = locale_mapping[locale];
					row['menu_1_'+locale] = getLookup("entry", oca_locale, enum_choice)

			enums.append(row);

	save_tsv(file_path + "/schema_enums.tsv", SCHEMA_ENUMS, enums);


###############################################################################

options, args = init_parser();

# Load OCA schema bundle specification
if options.input_oca_file and os.path.isfile(options.input_oca_file):
    with open(options.input_oca_file, "r") as file_handle:
        oca_obj = json.load(file_handle);

    if options.file_path == '':
    	options.file_path = options.input_oca_file.split('.')[0];

    if not os.path.isdir(options.file_path):
    	os.mkdir(options.file_path);

else:
	os.exit("- [Input OCA bundle file is required]")

# In parsing input_oca_file, a few attributes are ignored for now in much of
# the structure:
# 	"type": [string absolute/relative URI], 
# 	"capture_base": hash, # Ignore
# ALSO, it is assumed that language variant objects all have the "default" 
# and consistent primary language as first entry.

# Sniff file to see if it is newer "package" format
if 'type' in oca_obj and oca_obj['type'].split('/')[0] == 'oca_package':
	extensions = oca_obj['extensions'];
	oca_obj = oca_obj['oca_bundle'];
else:
	extensions = {}

if 'dependencies' in oca_obj:
	oca_dependencies = oca_obj['dependencies'];

# oca_attributes contains slot.name and slot.Type (datatype, e.g. Numeric, ...)
oca_attributes = oca_obj["bundle"]["capture_base"]["attributes"];

# Keywords about this schema (class's) subject categorization.
oca_classification = oca_obj["bundle"]["capture_base"]["classification"];

# Fields which likely have personal or institutional confidentiality content:
oca_identifying_factors = oca_obj["bundle"]["capture_base"]["flagged_attributes"];

############################# Overlays #################################
oca_overlays = oca_obj["bundle"]["overlays"];

# Contains {schema.name,.description,.language} in array.  Optional?
oca_metas = oca_overlays["meta"][0];

# Contains slot.name and slot.pattern
if "format" in oca_overlays:
	oca_formats = oca_overlays["format"]["attribute_formats"];
else:
	oca_formats = {};

# Minnum and maximum number of values in array of a multivalued field.
if "cardinality" in oca_overlays:
	oca_cardinality = oca_overlays["cardinality"]["attr_cardinality"];
else:
	oca_cardinality = {};

# Contains {slot.title,.language} in array
if "label" in oca_overlays:
	oca_labels = oca_overlays["label"][0]["attribute_labels"];
else:
	oca_labels = {};

# Contains {slot.name,.description,.language} in array 

if "information" in oca_overlays:
	oca_informations = oca_overlays["information"][0]["attribute_information"];
else:
	oca_informations = {};

# A dictionary for each field indicating required/recommended status:  
# M is mandatory and O is optional.
if "conformance" in oca_overlays:
	oca_conformance = oca_overlays["conformance"]["attribute_conformance"];
else:
	oca_conformance = {};

# Contains [enumeration name]:[code,...]
if "entry_code" in oca_overlays:
	oca_entry_codes = oca_overlays["entry_code"]["attribute_entry_codes"];
else:
	oca_entry_codes = {};

# Contains array of {enumeration.language,.attribute_entries} where 
# attribute_entries is dictionary of [enumeration name]: {code, label}
if "entry" in oca_overlays:
	oca_entry_labels = oca_overlays["entry"][0]["attribute_entries"];
else:
	oca_entry_labels = {};

# Also has   "metric_system": "SI",
# FUTURE: automatically incorporate unit menu: https://github.com/agrifooddatacanada/UCUM_agri-food_units/blob/main/UCUM_ADC_current.csv 
if "unit" in oca_overlays:
	if 'attribute_unit' in oca_overlays["unit"]:
		oca_units = oca_overlays["unit"]["attribute_unit"];
	else: # old package:
		oca_units = oca_overlays["unit"]["attribute_units"];
else:
	oca_units = {}

# TO DO:
#extensions["adc": {
#"overlays": {
#	"ordering": {
#		"type": "community/overlays/adc/ordering/1.1",
#		"attribute_ordering": : ["GCS_ID", "Original_soil_label", ...],
#		"entry_code_ordering": {
#			"Soil_type": ["Bulk", "Rhizosphere"],
#			"Province": ["AB", "BC"...]
#		}
# "sensitive": {
#		"type": "community/overlays/adc/sensitive/1.1",
#		"sensitive_attributes": []
#	}


SCHEMA = writeSchemaCore(options.file_path);
writeSlots(options.file_path);
writeEnums(options.file_path);

if len(warnings):
	print ("\nWARNING: \n", "\n ".join(warnings));

sys.exit("Finished processing")

