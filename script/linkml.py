# linkml.py
# Combines json version of given root LinkML file and its imports into one
# single javascript-readable file in folder where command is run from.  Run
# this in a given DataHarmonizer templates/[template X] folder.
#
# Created by: Damion Dooley
#
# Input examples, from template/MIxS/ folder:
#
# > linkml.py -i source/mixs.yaml
# > linkml.py -i https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.yaml
#

# from linkml_runtime.dumpers.json_dumper import JSONDumper
import copy

# import yaml
import json
import optparse
import os
from sys import exit

from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper

# Common menu shared with all template folders.
MENU = "../menu.js"
template_folder = os.path.basename(os.getcwd())


def init_parser():
    parser = optparse.OptionParser()

    parser.add_option(
        "-i",
        "--input",
        dest="linkml_file",
        help="Provide a relative file name and path to root LinkML to read.",
    )
    # parser.add_option('-o', '--output', dest="output_file",
    #   help="Provide an output file name/path.", default='output');

    # FUTURE: add parameter for published/draft

    return parser.parse_args()

options, args = init_parser()
if not options.linkml_file:
    exit("Input LinkML file not given")

print("Loading LinkML specification for", options.linkml_file)
schema_spec = SchemaView(options.linkml_file)

# Brings in any "imports:" including linkml:types
schema_spec.merge_imports();

# Get all top level classes
for name, class_obj in schema_spec.all_classes().items():
    # Note classDef["@type"]: "ClassDefinition" is only available in json
    # output

    # Presence of "slots" in class indicates field hierarchy
    if schema_spec.class_slots(name):
        # Replace class with its induced version
        # this shifts each slot's content into an attributes dictionary object
        new_obj = schema_spec.induced_class(name)
        schema_spec.add_class(new_obj)

# Output the amalgamated content:
with open("schema.js", "w") as output_handle:
    dumper = JSONDumper();
    output_handle.write("var SCHEMA = " + dumper.dumps(schema_spec.schema) )

# ********* Adjust the menu to include this schema and its classes ******
# Creating a javascript file structure which can be loaded directly into DH:
#
# const TEMPLATES = {
#  'MIxS': {'soil': {'name': 'soil', 'status': 'published'},
#             etc/
#     }
# };

js_prefix = "const TEMPLATES = "

if os.path.isfile(MENU):
    with open(MENU, "r") as f:
        menu_text = f.read()
        # Chops prefix off before interpretation
        menu = json.loads(menu_text[len(js_prefix) :])
else:
    menu = {}

# Overwrite this folder's menu content
menu[template_folder] = {}


# if a specific set of slots is required, add filter here.
# data = schema_spec.class_induced_slots("soil");
class_menu = {}

# Get all top level classes
for name, class_obj in schema_spec.all_classes().items():
    # Note classDef["@type"]: "ClassDefinition" is only available in json
    # output

    # Presence of "slots" in class indicates field hierarchy
    if schema_spec.class_slots(name):

        class_menu[name] = class_obj

print("Created", len(class_menu), "specifications:\n", "\n".join(class_menu.keys() ), "\n")


for name, class_obj in class_menu.items():

    menu[template_folder][name] = {
        "name": name,
        # Future, allow status to be changed by template curation status.
        "status": "published",
        "display": 'is_a' in class_obj and class_obj['is_a'] == 'dh_interface'
    }

with open(MENU, "w") as output_handle:
    output_handle.write(
        js_prefix + json.dumps(menu, sort_keys=False, indent=2, separators=(",", ": "))
    )
