# Populate https://climatesmartagcollab.github.io/HUB-Harmonization/ schema markup files with
# links to generated LinkML specifications.
#
# From table below load each .md and OCA.json file and convert to LinkML files in {folder}_LinkML/
#
# In .md files look for:
#	[Download ...
#
#	[Download LinkML schema](...) ... (OPTIONAL)
#
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
catg	Kinsella	Kinsella_OCA_schema.md	Kinsella_Cow_Production_OCA_package.json
catg	Soil_Moisture	SoilMoisture_OCA_schema.md	Soil_Moisture_OCA_package.json
catg	SoilData	SoilData_OCA_schema.md	SoilData_OCA_package.json
Cell_cultured	Bioreactor	Bioreactor_OCA_schema.md	Bioreactor_OCA_package.json
Cell_cultured	Bovine	Bovine_Cells_OCA_schema.md	Bovine_Cells_OCA_package.json
Cell_cultured	Chronoamperometry	Chronoamperometry_OCA_schema.md	Chronoamperometry_OCA_package.json
Cell_cultured	Cyclic	Cyclic_OCA_schema.md	Cyclic_OCA_package.json
Cell_cultured	Lactate	Lactate_OCA_schema.md	Lactate_OCA_package.json
Cell_cultured	Lactate_Spec	Lactate_Spec_OCA_schema.md	Lactate_Spec_OCA_package.json
Cell_cultured	qRT-PCR	qRT-PCR_OCA_schema.md	qRT-PCR_OCA_package.json
GG4GHG	Community	Community_OCA_schema.md	Community_OCA_package.json
loop	environmental_DNA	environmental_DNA.md	environmental_DNA.json
NDGP	Calving	Calving_OCA_schema.md	Calving_OCA_package.json
NDGP	Genotype	Genotype_OCA_schema.md
NDGP	Milk	Milk_OCA_schema.md	Milk_OCA_package.json
NDGP	MIR	MIR_OCA_schema.md	MIR_OCA_package.json
NDGP	Pedigree	Pedigree_OCA_schema.md	Pedigree_OCA_package.json
peACE	PeaCE	PeaCE_OCA_schema-Final-1.md	PeaCE_OCA_package_Final.json
JT	GENOME	GENOME_OCA_schema.md	GENOME_OCA_package.json
'''

def process_markdown(row, first_call):
	md_file = f"{SCHEMA_BASE}{row['folder']}/{row['markup']}";
	oca_file = f"{SCHEMA_BASE}{row['folder']}/{row['oca']}";
	if not os.path.isfile(oca_file):
		sys.exit(f"ERROR: Input oca .json file not found: {oca_file}");

	# Ensure file exists (text above is not out of date)
	if not os.path.isfile(md_file):
		sys.exit(f"ERROR: Input markup .md file not found: {md_file}")

	# Markdown for links to newly refreshed linkml yaml, json etc.
	# A special link so files can be viewed in tabular fashion on GitHub
	tsv_view_prefix = f"https://github.com/ClimateSmartAgCollab/HUB-Harmonization/blob/main/library/schemas/{row['folder']}/";
	linkml_links = f"[Download LinkML Schema]({row['prefix']}_LinkML/schema.json) ([yaml]({row['prefix']}_LinkML/schema.yaml); table view: [fields]({tsv_view_prefix}{row['prefix']}_LinkML/schema_slots.tsv), [picklists]({tsv_view_prefix}{row['prefix']}_LinkML/schema_enums.tsv))\n\n";

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
	oca_file_path = f"{SCHEMA_BASE}{row['folder']}/{row['oca']}";

	if not os.path.isdir(linkml_folder):
		os.mkdir(linkml_folder);

	convert_oca_to_linkml(oca_file_path, linkml_folder);

	report_build(row, first_call, linkml_folder + 'schema_slots.tsv', SCHEMA_BASE + 'report_all_schema_fields.tsv');

	report_build(row, first_call, linkml_folder + 'schema_enums.tsv', SCHEMA_BASE + 'report_all_schema_menus.tsv');

	make_linkml_schema(linkml_folder, 'schema');

	print ("LinkML conversion complete.");


def report_build(row, first_call, input_file, output_file):

	# Build cumulative report of slots and enums
	with open(input_file, newline='') as tsvfile:
		reader = csv.DictReader(tsvfile, delimiter='\t');

		slot_field_names = ['folder','prefix'] + reader.fieldnames;

		if first_call == True:
			mode = 'w';
		else:
			mode = 'a';

		with open(output_file, mode=mode, newline='') as report:
			writer = csv.DictWriter(report, fieldnames=slot_field_names, delimiter='\t');
			if first_call == True:
				writer.writeheader();

			# Used to fill in any empty name column value which is inherited
			# from a previous row in file.  Pertains to schema_enums.tsv
			old_name= ""; 
			for slot_row in reader: 
				# Report rows have these additional initial fields:

				if len(slot_row['name'].strip()) > 0:
					old_name = slot_row['name'].strip();
				else:
					slot_row['name'] = old_name;

				row_out = {
					'folder': row['folder'], # Row from config file above.
					'prefix': row['prefix']
				};
				for field in slot_row:
					row_out[field] = slot_row[field].strip();

				writer.writerow(row_out);


###############################################################################
def main():

	# Read above table
	# [ALTERNATE code: keep table in file:] with open('hub_harmonization.tsv', newline='') as f:
	reader = csv.DictReader(io.StringIO(SCHEMA_TABLE_TSV), delimiter='\t');

	first_call = True;
	for row in reader:
		if 'folder' in row:
			if row['oca']:
				process_markdown(row, first_call);
				first_call = False;
			else:
				print(f"WARNING: No OCA .json file for {row['folder']} {row['prefix']} schema.");

###############################################################################
# Only run when accessed by command line.
if __name__ == "__main__":
    main();
