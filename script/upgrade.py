#
# update.py: A script to generate a LinkML yaml schema from a tabular 
# representation of the tabular data structure.
#
# Author: Damion Dooley
# 

import csv
import yaml
import collections
import dpath.util

r_filename = 'data.tsv';
w_filename = 'schema.yaml';
SCHEMA = {
	id:				'',
	name:			'',
	description:	'',
	imports:		['linkml:types'],
	prefixes: 		{
						linkml: 'https://w3id.org/linkml/'
					},
	# default_prefix: 'mixs.vocab',
	classes:		{},
	slots:			{},
	enumerations:	{},
	types:			{},
}

FIELD_INDEX = {} # [field] -> field object in SCHEMA
CHOICE_INDEX = {} # [choice] -> parent choice or field object in SCHEMA
section = None;
search_root = '/';

# For a column in input spreadsheet named EXPORT_[EXPORT_FORMAT], add to
# dictionary structure (field) a field.exportField datastructure containing
# transforms to each EXPORT_FORMAT value, or column and value combination.
# e.g.
#	"Confusion": {
#		"exportField": {
#			"NML_LIMS": [
#				{
#					"field": "HC_SYMPTOMS",
#                   "value": "CONFUSION"
#               }
#            ],
#        },
#		 ... other child terms
#
# exportField: {[PREFIX]:[{"field":[value],"value":[value transform],...]}
# input spreadsheet EXPORT_[EXPORT_FORMAT] is coded as:
#    [column1]:[value];[column2]:[value]; // multiple column targets
#    or [value];[value]; // default column target
#
# @param Array<String> EXPORT_FORMAT list of export formats to search for
# @param Dict field Dictionary of vocabulary field details
# @param Dict row containing all field data
# @return Dict field modified

def export_fields (EXPORT_FORMAT, field, row, as_field = False):
	if len(EXPORT_FORMAT) > 0:
		formats = {};
		for export_field in EXPORT_FORMAT:
			prefix = export_field[7:]; # Get rid of "EXPORT_" part.
			if row[export_field] == None:
				print ('Error: ', export_field, 'not found in row with label [',row['label'], ']. Malformed text in row?');
				continue;

			# An export field may have one or more [field name]:[field value] transforms, separated by ";"
			for item in row[export_field].split(";"):
				item = item.strip();
				if len(item) > 0:
					conversion = {};
					# We have a transform of some kind
					if not prefix in formats:
						formats[prefix] = [];

					# A single ":" value enables clearing out of a value.
					if item == ':':
						conversion['value'] = '';

					# A colon indicates a different target field is in play
					elif ":" in item:
						binding = item.split(":",1);
						binding[0] = binding[0].strip();
						binding[1] = binding[1].strip();
						if binding[0] > '':
							conversion['field'] = binding[0];
						if binding[1] > '':
							conversion['value'] = binding[1];

					# No colon
					elif as_field == True:
						conversion['field'] = item;
					else:
						conversion['value'] = item;	

					formats[prefix].append(conversion);

		if formats: # Only if some keys have been added.
			field['exportField'] = formats; # Like skos:exactMatch

'''
Creates section / field / field choice data structure directly off of tabular
data captured from a vocabulary spreadsheet.
'''
with open(r_filename) as tsvfile:
	reader = csv.DictReader(tsvfile, dialect='excel-tab');

	EXPORT_FORMAT = [];
	firstrow = True;
    # Row has keys 'Ontology ID' 'parent class' 'label' 'datatype' 'requirement' ...	
	for row in reader:

		# Get list of exportable fields, each of which has "EXPORT_" prefixed into it.
		if (firstrow):
			firstrow = False;
			for key in row:
				if key[0:7] == 'EXPORT_':
					EXPORT_FORMAT.append(key);

		# Skip second row (a robot directive row)
		if len(row['Ontology ID']) == 0 or row['Ontology ID'] != 'ID':
			label = row['label'].strip();
			if label > '':
				if row['parent class'] == '': 
					# Define a section of fields
					section = {'fieldName': label, 'children': []}
					SCHEMA.append(section);

				else:
					# Find parent class in SCHEMA or in index of its fields
					parent_label = row['parent class'].strip();
					section = next((x for x in SCHEMA if x['fieldName'].strip() == parent_label), None);
					if section:
						# Convert data status into array of values.
						if len(row['data status'])>0:
							dataStatus = list(map(lambda x: x.strip(), row['data status'].split(';')));
						else:
							dataStatus = None;

						field = {
							'fieldName':   		label, 			# schema:name
							#'schema:codeValue':	label,
							'capitalize': 		row['capitalize'],
							'ontology_id': 		row['Ontology ID'],
							'datatype':			row['datatype'], 	# schema:DataType
							'source': 			row['source'],
							'dataStatus': 		dataStatus,
							'xs:minInclusive': 	row['min value'],
							'xs:maxInclusive': 	row['max value'],
							'requirement': 		row['requirement'],
							'description': 		row['description'], # schema:description
							'guidance':			row['guidance'],
							'examples':			row['examples']
						}
						
						if 'pattern' in row and len(row['pattern']) > 0:
							field['pattern'] = row['pattern'];

						export_fields (EXPORT_FORMAT, field, row, True);

						if row['datatype'] == 'select' or row['datatype'] == 'multiple':
							# Use ordered dict to keeps additions in order:
							choice = collections.OrderedDict(); 
							# Top level case-sensitive field index, curators must be exact
							CHOICE_INDEX[label] = choice; 
							field['schema:ItemList'] = choice;

						section['children'].append(field)
						FIELD_INDEX[label.lower()] = field;

					# Item isn't a section or field, so it must be a select field choice
					else:
						parent_label_lc = parent_label.lower();
						# Find the choice's parent in FIELD_INDEX, if any
						# If parent in CHOICE_INDEX, then add it
						if parent_label_lc in FIELD_INDEX:
							# Always use most recently referenced field for a
							# vocabulary search root in CHOICE_INDEX
							if search_root != parent_label:
								search_root = parent_label;
								print ('vocabulary field:', parent_label);

							if not 'schema:ItemList' in FIELD_INDEX[parent_label_lc]:
								print ("error: field ",parent_label, "not marked as select or multiple but it has child term", label);
							else:
								# Basically top-level entries in field_map:
								choice = collections.OrderedDict();
								
								# Add ontology id to field if available
								if len(row['Ontology ID']) > 0:
									choice['ontology_id'] = row['Ontology ID'];

								FIELD_INDEX[parent_label_lc]['schema:ItemList'][label] = choice;
	
								# Parent_label is top level field name:
								CHOICE_INDEX[parent_label][label] = choice;

								export_fields(EXPORT_FORMAT, choice, row);

						else:
							# If it isn't a field then it is a choice within a 
							# field's vocabulary.  Searches only against 
							# current field's vocabulary. In case a '/' exists
							# in parent label switches that to a wildcard.			

							try:
								result = dpath.util.get(CHOICE_INDEX, '/' + search_root +'/**/' + parent_label.replace('/','?'), separator='/');

								if not 'schema:ItemList' in result:
									result['schema:ItemList'] = {};

								# Prepare new child entry
								choice = collections.OrderedDict(); 
								
								# Add ontology id to field if available
								if len(row['Ontology ID']) > 0:
									choice['ontology_id'] = row['Ontology ID'];

								result['schema:ItemList'][label] = choice; 
								export_fields(EXPORT_FORMAT, choice, row);
							except:
								print ("Error: parent class ", parent_label, "doesn't exist as section or field for term. Make sure parent term is trimmed of whitespace.", label);
								pass


with open(w_filename, 'w') as output_handle:
	yaml.dump(SCHEMA, output_handle)

