
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

'''
Creates section / field / field choice data structure directly off of tabular
data captured from a vocabulary spreadsheet.
'''
with open(r_filename) as tsvfile:
  reader = csv.DictReader(tsvfile, dialect='excel-tab');

  for row in reader:
    # row has keys 'Ontology ID' 'parent class' 'label' 'datatype' 'requirement'

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
	    		parent_label = row['parent class'];
	    		section = next((x for x in DATA if x['fieldName'].strip() == parent_label), None);
	    		if section:
	    			# Convert data status into array of values.
	    			if len(row['data status'])>0:
	    				dataStatus = list(map(lambda x: x.strip(), row['data status'].split(';')));
	    			else:
	    				dataStatus = None;

	    			field = {
	    				'fieldName':   label, 
	    				'capitalize': row['capitalize'],
	    				'ontology_id': row['Ontology ID'],
	    				'datatype':    row['datatype'],
	    				'source': row['source'],
	    				'dataStatus': dataStatus,
	    				'xs:minInclusive': row['min value'],
	    				'xs:maxInclusive': row['max value'],
	    				'requirement': row['requirement'],
	    				'description': row['description'],
	    				'guidance':    row['guidance'],
	    				'examples':    row['examples'],
	    				'GISAID': 	   row['GISAID']
	    			}
	    			
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
	    				choice = collections.OrderedDict();
	    				# Case sensitive index, curators must be exact
	    				CHOICE_INDEX[label] = choice; 
	    				field['vocabulary'] = choice;

	    			section['children'].append(field)
	    			FIELD_INDEX[label.lower()] = field;

	    		else:
	    			parent_label_lc = parent_label.lower();
	    			# Item isn't a section or field, so it must be a select field choice
	    			# find the choice's parent in FIELD_INDEX, if any
	    			# If parent in CHOICE_INDEX, then add it

	    			if parent_label_lc in FIELD_INDEX:
	    				choice = collections.OrderedDict();
	    				if not 'vocabulary' in FIELD_INDEX[parent_label_lc]:
	    					print ("error: field ",parent_label, "not marked as select or multiple but it has child", label)
	    				else:
	    					FIELD_INDEX[parent_label_lc]['vocabulary'][label] = choice;
	    					CHOICE_INDEX[label] = choice;
	    			else:
	    				try:
	    					result = dpath.util.get(CHOICE_INDEX, '*/' + parent_label, separator='/');
	    					result[label] = collections.OrderedDict(); # Add new child
	    				except:
	    					print ("Error: parent class ", parent_label, "doesn't exist as section or field for term. Make sure parent term is trimmed of whitespace.", label);


reference_html += '</table>\n';

with open(w_filename, 'w') as output_handle:
	# DO NOT USE sort_keys=True because this overrides OrderedDict() sort order.
	output_handle.write("const DATA = " + json.dumps(DATA, sort_keys = False, indent = 2, separators = (',', ': ')));

with open('reference_template.html', 'r') as template_handle:
	template = template_handle.read();

	with open('reference.html', 'w') as output_handle:
		output_handle.write(template.format( **{'html': reference_html} ));

