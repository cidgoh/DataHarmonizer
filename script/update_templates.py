# update_templates.py
#
# This app fetches the Google sheet called "DataHarmonizer Templates", and 
# saves it to a local "dataharmonizer_templates.xlsx" file. It then examines
# the Version Control tab which lists "Pathogen Genomics Package" releases of
# bundles of /web/templates/ DataHarmonizer schemas and their templates. 
#
# Then in the first "Version Control" tab sheet
# it examines last and second last "Pathogen Genomics Templates version"
# entries, looking for any differences in the listed templates version  
# ids, and for those that change, it fetches latest slot and enum tab info.
# It revises schema_core.yaml for appropriate version ids, and saves
# schema_slots.tsv and schema_enums.tsv overtop existing files. It then 
# reruns tabular_to_schema.py on each repo, yeilding schema.yaml and 
# schema.json which can then be included in overall schema.
#
# NOTE: A different approach would just look for changes between Google sheet
# and latest DH repo files, and then act on that, but prompt user to specify
# new version ids for changed files.
#
# PARAMETERS
# 	-m adds all listed repos to menu, which also triggers refreshing all
#      their import slot and enum info.
# 
# Author: Damion Dooley Nov 2025
#
# GOOGLE API SETUP for fetching "DataHarmonizer Templates" spreadsheet
# Uses python modules gspread oauth2client
#	> pip3 install gspread oauth2client
# 1: go to: 
#	> https://console.cloud.google.com/
# 2: select a project (or create one, e.g. dataharmonizer)
#	> https://console.cloud.google.com/home/dashboard?project=dataharmonizer
# 3: Enable the Google Sheets API (can search for "google sheets api")
#	https://console.cloud.google.com/marketplace/product/google/sheets.googleapis.com
# 4: setup credentials (
#	In the Google Cloud console, go to Menu menu > APIs & Services > Credentials 

import pandas as pd
import csv
import optparse
import os
from semver import VersionInfo # pip install python-semver
import math
import yaml
from tabular_to_schema import make_linkml_schema;

DH_TEMPLATE_VERSION_CONTROL_FIELDS = "Pathogen Genomics Templates Release	DH Version	Release Date	Template Name	Template Version x.y.z	x changes (field)	y changes (values/IDs)	z changes (defs/formats/examples)".split("\t");
DH_TEMPLATES_GOOGLENAME    = 'DataHarmonizer Templates';
DH_TEMPLATES_FILENAME      = 'dataharmonizer_templates.xlsx';
DH_TEMPLATES_TAB_RELEASES  = 'Version Control';

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

	parser.add_option(
		"-d",
		"--download",
		dest="download",
		default=False,
		action="store_true",
		help="A parameter which indicates that latest version of google sheet should be downloaded.",
	)

	return parser.parse_args();

def refresh_cache():
	import gspread # pip3 install gspread
	from gspread.utils import ExportFormat

	# 1. Authenticate with Google Sheets (using a service account key file)
	# Replace 'path/to/your/service_account_key.json' with the actual path
	gc = gspread.service_account(filename='google_api_key.json');

	# 2. Open the spreadsheet by its name
	spreadsheet_name = DH_TEMPLATES_GOOGLENAME;
	spreadsheet = gc.open(spreadsheet_name);
	# spreadsheet = gc.open_by_url('SPREADSHEET_URL')

	# Write the exported content to a local file
	export_file = spreadsheet.export(format=ExportFormat.EXCEL);
	with open(DH_TEMPLATES_FILENAME, 'wb') as f:
		f.write(export_file);

def get_value(df, column_name, index):
	#valid_index = df[column_name].iloc[index];
	return df.loc[index, column_name].strip();

# Makes a dictionary of templates and their versions for a give range of
# Version Control tab rows.
def make_dict(df, row_start, row_end, iteration = ''):
	templates = {};
	# print("COLUMNS", df.columns.tolist());

	# Get previous template names and versions:
	for row_ptr in range(row_start, row_end): # 
		template_name = df.loc[row_ptr, "Template Name"];
		# Empty rows get interpreted as float nan.
		if type(template_name) == str and len(template_name): 
			template_version = df.loc[row_ptr, "Template Version x.y.z"];
			if type(template_version) == float and math.isnan(template_version):
				print(f'{iteration}: IGNORING "{template_name}" semantic version "{template_version}" (not a number)');
				continue;
			vt = VersionInfo.parse(template_version);
			if vt != template_version:
				print(f'{iteration}: Check formatting of "{template_name}" semantic version "{template_version}" which is being parsed as {vt}.');

			if template_name and vt:
				templates[template_name] = vt;

	return templates;


def filter_unnamed_columns(col_name):
    return 'Unnamed' not in col_name

def process_release(df):

	# Provids lookup for Template Name,Tab,Folder
	template_schema = pd.read_excel(DH_TEMPLATES_FILENAME, sheet_name = 'Files');
	template_to_tab = template_schema.set_index('Template Name')['Tab'].to_dict();
	template_to_folder = template_schema.set_index('Template Name')['Folder'].to_dict();
	template_to_class = template_schema.set_index('Template Name')['Class'].to_dict();
	#print(template_to_tab); print(template_to_folder); print(template_to_folder); print(template_to_class)

	column_name = DH_TEMPLATE_VERSION_CONTROL_FIELDS[0];
	# Last two occupied values in an array of length 2:
	valid_indexes = df[column_name].dropna().tail(2).index;

	if len(valid_indexes) == 0:
		print(f'Unable to find a version identifier in first column "{column_name}"');
	else:
		if len(valid_indexes) == 1:
			# Case: Single (first) publishing of DataHarmonizer template package
			print(f'Only found 1 version identifier in first column "{column_name}". Not implemented case.');

		else:
			latest_row  = valid_indexes[1];
			latest_value = get_value(df, column_name, latest_row);
			latest_release = VersionInfo.parse(latest_value);

			previoius_row = valid_indexes[0];
			previous_value = get_value(df, column_name, previoius_row );
			previous_release = VersionInfo.parse(previous_value);

			if latest_release > previous_release:
				print(f"Comparing last {latest_release} (line {latest_row} vs. previous {previous_release} (line {previoius_row})");

				old_templates = make_dict(df, previoius_row , latest_row, previous_release);
				templates = make_dict(df, latest_row , df.index[-1]+1, latest_release);
				#print('Old templates \n', old_templates);
				#print('\nNew templates \n', templates);		

				do_template_folders = {};		
				for key, version in templates.items():

					if key in old_templates:
						old_version = old_templates[key];
						if old_version == version:
							# Ignore template since no version change.
							continue;
						else:
							print(f'Updated: {key} from {old_version} to {version}');
					else: 
						print(f'New: {key} template with version {version}');	
					
					template_folder = template_to_folder[key];
					template_class = template_to_class[key];

					do_template_folders[template_folder] = template_to_tab[key];

					# Adjust web/templates/schema_core to include version
					yaml_file_path = f'../web/templates/{template_folder}/schema_core.yaml';
					schema = None;
					try:
						with open(yaml_file_path, 'r') as file:
							schema = yaml.safe_load(file);

					except FileNotFoundError:
						print(f"Error: The file '{yaml_file_path}' was not found.")
						continue;
					except yaml.YAMLError as e:
						print(f"Error parsing YAML file: {e}")
						continue;

					# Update schema's appropriate template class with new version


					if template_class in schema['classes']:
						if not 'annotations' in schema['classes'][template_class]:
							schema['classes'][template_class]['annotations'] = {'version': str(version)}
						else:
							schema['classes'][template_class]['annotations']['version'] = str(version);
					else:
						print(f"Unable to find {template_class} in {schema}/schema_core.yaml'.")
						continue;

					# For now, schema version always takes on highest class version
					schema_version = schema['version'];
					if not schema_version:
						schema['version'] = str(version);
					else:
						if version > VersionInfo.parse(schema_version):	
							schema['version'] = str(version);

					try:
						with open(yaml_file_path, 'w') as file:
							yaml.safe_dump(schema, file, sort_keys=False);
							print(f"Changes saved successfully to '{yaml_file_path}'.");

					except Exception as e:
						print(f"Error saving YAML file: {e}")

					# TESTING SINGLE ITERATION
					break;

				# Now for each todo template folder copy tabs to 
				# schema_slots.tsv and schema_enums.tsv and then
				# run the make_linkml_schema() script
				# Currently there is no "menu" generation option.
				for template_folder in do_template_folders:

					tsv_filepath_prefix = f'../web/templates/{template_folder}/schema_';
					# do_template_folders is a dictionary of template_folder -> tab name.
					tab_prefix = do_template_folders[template_folder];
					# Pandas when reading excel file is supposed to view TRUE, FALSE as boolean
					slots = pd.read_excel(DH_TEMPLATES_FILENAME, sheet_name = tab_prefix + '-slots', usecols=filter_unnamed_columns); # 
					# However here boolean true is being saved as 1.0
					# So replace 1.0 with TRUE.
					for datatype in ['identifier','multivalued','required','recommended']:
						slots[datatype] = slots[datatype].replace({1.0: 'TRUE'});
						# Prevents dates in examples from being reformated:
					
					# slots['examples'] = slots['examples'].astype(str); #????

					slots.to_csv(tsv_filepath_prefix + 'slots.tsv', sep='\t', index=False, lineterminator='\r\n') # , quotechar="'"

					# , lineterminator='\n', quoting=csv.QUOTE_NONE, quotechar="'",escapechar='\\'
					enums = pd.read_excel(DH_TEMPLATES_FILENAME, sheet_name = tab_prefix + '-enums',usecols=filter_unnamed_columns, parse_dates=False);
					enums.to_csv(tsv_filepath_prefix + 'enums.tsv', sep='\t', index=False, lineterminator='\r\n') # , quotechar="'"
					# quoting=csv.QUOTE_NONE,quotechar='"',escapechar='"'

					make_linkml_schema(f"../web/templates/{template_folder}/", 'schema');

			else:
				print(f"PROBLEM: Semantic version of last release section {v1} is less or equal to previous one {v2}.")


	#for row_tuple in df.itertuples():
    #    print(f"Index: {row_tuple.Index}, Col1: {row_tuple.col1}, Col2: {row_tuple.col2}")


if __name__ == "__main__":
	options, args = init_parser();

	if options.download:
		refresh_cache();

	if os.path.isfile(DH_TEMPLATES_FILENAME):
		# create a Pandas "df" dataframe
		df = pd.read_excel(
			DH_TEMPLATES_FILENAME, 
			sheet_name = DH_TEMPLATES_TAB_RELEASES # Load by sheet name
		) 
		# Note: if a column is blank or not a number, pandas by default returns
		# it as nan.
		# Set all the columns from this Releases tab as datatype (class) str
		# might help in some cases but we seemed to have to detect nan anyways
		# so not implementing the parameter below
		#dtype = dict.fromkeys(DH_TEMPLATE_VERSION_CONTROL_FIELDS, str)

		#print("Loaded file", df);
		process_release(df);

	else:
		print(f"Please generate the {DH_TEMPLATES_FILENAME} filename by including the --download parameter.");
	
