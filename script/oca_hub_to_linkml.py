# Populate https://climatesmartagcollab.github.io/HUB-Harmonization/ schema markup files with
# links to generated LinkML specifications.
#
# From table below load each .md and OCA.json file and convert to LinkML files in {folder}_LinkML/
#
# In .md files look for:
#	[Download ...
#
#	[Download LinkML ...
# OR
#	# Schema quick view
#
# And insert/replace [Download LinkML ... with
#
#	[Download LinkML schema]({prefix}_LinkML/schema.json) ([yaml]({prefix}_LinkML/schema.yaml); table view: [fields](https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{folder}/{prefix}_LinkML/schema_slots.tsv), [picklists](https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{folder}/{prefix}_LinkML/schema_enums.tsv))
#
#schemas/ folder table
#

import csv
import io
import os
import sys
import re
import subprocess
from oca_to_linkml import convert_oca_to_linkml;
from tabular_to_schema import make_linkml_schema;

# Relative path from this script to GitHub repo folder for HUB_Harmonization 
SCHEMA_BASE = "../../HUB-Harmonization/library/schemas/";

# For updating LinkML download links content of markup files
RE_DOWNLOADS = re.compile("(\[Download (Semantic Engine )?Schema]\(.+\)\s*\n\n)(\[Download .*\s*)?(## Schema quick view)",flags=re.MULTILINE|re.IGNORECASE); #

#Update this with latest content for GitHub/HUB_Harmonization/schemas/
SCHEMA_TABLE_TSV = '''folder	prefix	markup	oca
ACTIVATE	ACTIVATE	Activate-act2-3.md	ACTIVATE-act2.3.json
BENEFIT	BENEFIT	BENEFIT_OCA_schema.md	BENEFIT_OCA_package.json
BENEFIT	CCASM	CCASM_OCA_schema.md	CCASM_OCA_package.json
Cell_cultured	Bioreactor	Bioreactor_OCA_schema.md	Bioreactor_OCA_package.json
Cell_cultured	Bovine	Bovine_Cells_OCA_schema.md	Bovine_Cells_OCA_package.json
Cell_cultured	Chronoamperometry	Chronoamperometry_OCA_schema.md	Chronoamperometry_OCA_package.json
Cell_cultured	Cyclic	Cyclic_OCA_schema.md	Cyclic_OCA_package.json
Cell_cultured	Lactate	Lactate_OCA_schema.md	Lactate_OCA_package.json
Cell_cultured	Lactate_Spec	Lactate_Spec_OCA_schema.md	Lactate_Spec_OCA_package.json
Cell_cultured	qRT-PCR	qRT-PCR_OCA_schema.md	qRT-PCR_OCA_package.json
GG4GHG	Community	Community_OCA_schema.md	Community_OCA_package.json
JT	GENOME	GENOME_OCA_schema.md	GENOME_OCA_package.json
NDGP	Calving	Calving_OCA_schema.md	Calving_OCA_package.json
NDGP	Genotype	Genotype_OCA_schema.md
NDGP	Milk	Milk_OCA_schema.md	Milk_OCA_package.json
NDGP	MIR	MIR_OCA_schema.md	MIR_OCA_package.json
NDGP	Pedigree	Pedigree_OCA_schema.md	Pedigree_OCA_package.json
peACE	PeaCE	PeaCE_OCA_schema-Final-1.md	PeaCE_OCA_package_Final.json
'''

def process_markdown(row):
	md_file = f"{SCHEMA_BASE}{row['folder']}/{row['markup']}";
	oca_file = f"{SCHEMA_BASE}{row['folder']}/{row['oca']}";
	if not os.path.isfile(oca_file):
		sys.exit(f"ERROR: Input oca .json file not found: {oca_file}");

	# Ensure file exists (text above is not out of date)
	if not os.path.isfile(md_file):
		sys.exit(f"ERROR: Input markup .md file not found: {md_file}")

	# markdown for links to newly refreshed linkml yaml, json etc.
	linkml_links = f"[Download LinkML Schema]({row['prefix']}_LinkML/schema.json) ([yaml](https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{row['folder']}/{row['prefix']}_LinkML/schema.yaml); table view: [fields](https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{row['folder']}/{row['prefix']}_LinkML/schema_slots.tsv), [picklists](https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{row['folder']}/{row['prefix']}_LinkML/schema_enums.tsv))\n\n";

	with open(md_file, "r") as file_handle:
		text = file_handle.read();

    #print(text);
	match = re.search(RE_DOWNLOADS, text);
	summary = '';
	if (match):
		if match.group(3):
			summary = 'Updating LinkML links in: ';
			text = text.replace(match.group(3), linkml_links);
		else:
			summary = 'New LinkML links in: ';
			text = text.replace(match.group(1), match.group(1) + linkml_links);

		with open(md_file, "w") as file_handle_out:
			print(summary, md_file);
			file_handle_out.write(text);

	else:
		print(f"ERROR: Unable to find Download links section in: {md_file}");

	linkml_folder = f"{SCHEMA_BASE}{row['folder']}/{row['prefix']}_LinkML/";
	oca_file = f"{SCHEMA_BASE}{row['folder']}/{row['oca']}";

	if not os.path.isdir(linkml_folder):
		os.mkdir(linkml_folder);

	convert_oca_to_linkml(oca_file, linkml_folder);
	make_linkml_schema(linkml_folder, 'schema');

	print ("LinkML conversion complete.");


# Read above table
#with open('hub_harmonization.tsv', newline='') as f:
reader = csv.DictReader(io.StringIO(SCHEMA_TABLE_TSV), delimiter='\t')
for row in reader:
	#print(row)
	if 'folder' in row:
		if row['oca']:
			process_markdown(row);
		else:
			print(f"WARNING: No OCA .json file for {row['folder']} {row['prefix']} schema.");
