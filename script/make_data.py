#
# make_data.py: A script to generate a vocabulary JSON-LD data structure from
# a tabular representation of the vocabulary.
#
# FUTURE: Implement as JSON-LD "@graph" https://json-ld.org/spec/latest/json-ld/
# https://json-ld.org/playground/
#
# Author: Damion Dooley
# 

import csv
import json
import collections
import dpath.util

r_filename = 'data.tsv';
w_filename = 'data.js';
DATA = [];
FIELD_INDEX = {} # [field] -> field object in DATA
CHOICE_INDEX = {} # [choice] -> parent choice or field object in DATA
section = None;
reference_html = ''; # Content of a report that details section fields
search_root = '/';

# Consolidates all EXPORT_XYZ terms into one data structure
# exportField: {PREFIX:[[field name],[value rename],...]}
def export_fields (EXPORT_FORMAT, field, row):
	if len(EXPORT_FORMAT) > 0:
		formats = {};
		for export_field in EXPORT_FORMAT:
			prefix = export_field[7:]; # Get rid of "EXPORT_" part.
			if row[export_field] == None:
				print ('Error: ', export_field, 'not found in row with label [',row['label'], ']. Malformed text in row?');
				continue;
			for item in row[export_field].split(";"):
			# an export field may have one or more [field name]:[new field value] mapping.
				item = item.strip();
				if len(item.strip()) > 0:
					binding = item.strip().split(":",1);
					conversion = {}
					if binding[0].strip() > '':
						conversion['field'] = binding[0].strip();
					if len (binding) > 1 and binding[1].strip() > '':
						conversion['value'] = binding[1].strip();
					if not prefix in formats:
						formats[prefix] = [];
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
					DATA.append(section);
					reference_html += '''
						<tr class="section">
							<td colspan="5"><h3>{fieldName}</h3></td>
						</tr>
						'''.format(**section);

				else:
					# Find parent class in DATA or in index of its fields
					parent_label = row['parent class'].strip();
					section = next((x for x in DATA if x['fieldName'].strip() == parent_label), None);
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
						
						export_fields (EXPORT_FORMAT, field, row);

						reference_html += '''
						<tr>
							<td class="label">{fieldName}</td>
							<td>{description}</td>
							<td>{guidance}</td>
							<td>{examples}</td>
							<td>{dataStatus}</td>
						</tr>\n
						'''.format(**field);

						if row['datatype'] == 'select' or row['datatype'] == 'multiple':
							# Use ordered dict to keeps additions in order:
							choice = collections.OrderedDict(); 
							# Top level case-sensitive field index, curators must be exact
							CHOICE_INDEX[label] = choice; 
							field['vocabulary'] = choice;

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

							if not 'vocabulary' in FIELD_INDEX[parent_label_lc]:
								print ("error: field ",parent_label, "not marked as select or multiple but it has child term", label);
							else:
								# Basically top-level entries in field_map:
								choice = collections.OrderedDict();
								FIELD_INDEX[parent_label_lc]['vocabulary'][label] = choice;
	
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
								result[label] = collections.OrderedDict(); # new child {}
							except:
								print ("Error: parent class ", parent_label, "doesn't exist as section or field for term. Make sure parent term is trimmed of whitespace.", label);
								pass


reference_html += '</table>\n';

with open(w_filename, 'w') as output_handle:
	# DO NOT USE sort_keys=True because this overrides OrderedDict() sort order.
	output_handle.write("var DATA = " + json.dumps(DATA, sort_keys = False, indent = 2, separators = (',', ': ')));
	#output_handle.write("var EXPORT_FIELD_MAP = " + json.dumps(export_field_map, sort_keys = False, indent = 2, separators = (',', ': ')));

with open('reference_template.html', 'r') as template_handle:
	template = template_handle.read();

	with open('reference.html', 'w') as output_handle:
		output_handle.write(template.format( **{'html': reference_html} ));

