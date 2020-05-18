
import csv
import json
import collections

r_filename = 'data.tsv'
w_filename = 'data2.json'
DATA = []
FIELD_INDEX = {}

section = None

with open(r_filename) as tsvfile:
  reader = csv.DictReader(tsvfile, dialect='excel-tab')
  for row in reader:
    # row has keys 'Ontology ID' 'parent class' 'label' 'datatype' 'requirement'

    # Skip second row (a robot directive row)
    if len(row['Ontology ID']) == 0 or row['Ontology ID'] != 'ID': 
    	if row['label'] > '':
	    	if row['parent class'] == '': 
	    		section = {'fieldName': row['label'], 'children': []}
	    		children = section['children']
	    		DATA.append(section)
	    	else:
	    		# find parent class in DATA or in index of its fields
	    		parent_label = row['parent class']
	    		section = next((x for x in DATA if x['fieldName'] == parent_label), None)
	    		if section:
	    			field = {
	    				'fieldName': row['label'], 
	    				'datatype': row['datatype'],
	    				'requirement': row['requirement'],
	    				'vocabulary': collections.OrderedDict()
	    			}
	    			section['children'].append(field)
	    			FIELD_INDEX[row['label'].lower()] = field
	    		else:
	    			# term parent isn't a section so see if it is a field
	    			if parent_label.lower() in FIELD_INDEX:
	    				FIELD_INDEX[parent_label.lower()]['vocabulary'][row['label']] = {}
	    			else:
	    				print ("Error: parent class for term", row['label'], "doesn't exist as section or field:", parent_label)


with open(w_filename, 'w') as output_handle:
	# DO NOT USE sort_keys=True on piclists etc. because this overrides
	# OrderedDict() sort order.
	output_handle.write(json.dumps(DATA, sort_keys = False, indent = 4, separators = (',', ': ')))
