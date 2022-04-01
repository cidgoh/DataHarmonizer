# linkml.py
# Combines json version of given root LinkML file and its imports into one
# single javascript-readable file in folder where command is run from.  Run
# this in a given DataHarmonizer templates/[template X] folder.
#
# Author: Damion Dooley
#
# Input examples, from template/MIxS/ folder:
#
# > linkml.py -i source/mixs.yaml
# > linkml.py -i https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.yaml
#
# TO DO: Add reference.html generation (Decision: 1 per template?)


# from linkml_runtime.dumpers.json_dumper import JSONDumper
import copy

# import yaml
import json
import optparse
import os
from sys import exit

from linkml_runtime.utils.schemaview import SchemaView

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


# Custom json serializer: see https://pynative.com/make-python-class-json-serializable/
# This simply removes items with None/null values or empty lists/dictionaries
def encoder(encoder_obj):
    # # not used
    # encoder_obj_type = type(encoder_obj)

    simple_dict = copy.copy(encoder_obj.__dict__)
    delete_stack = []
    for i, (k, v) in enumerate(simple_dict.items()):
        if type(v) == list or type(v) == dict:
            if len(v) == 0:
                delete_stack.append(k)
        else:
            if v is None:
                delete_stack.append(k)

    for k in delete_stack:
        simple_dict.pop(k, None)

    return simple_dict


options, args = init_parser()
if not options.linkml_file:
    exit("Input LinkML file not given")

print("Loading LinkML specification for", options.linkml_file)
mixs_sv = SchemaView(options.linkml_file)

# if a specific set of slots is required, add filter here.
# data = mixs_sv.class_induced_slots("soil");

content = {
    "folder": template_folder,
    "specifications": {},  # Includes slots and slot_usage done below
    "enumerations": mixs_sv.all_enums(),
    "slots": mixs_sv.all_slots(),
    "types": mixs_sv.all_types(),
}

# Get all top level classes
for name, class_obj in mixs_sv.all_classes().items():
    # Note classDef["@type"]: "ClassDefinition" is only available in json
    # output

    # Presence of "slots" in class indicates field hierarchy
    # NOTE: Skips special "quantity value" class
    if mixs_sv.class_slots(class_obj.name):

        content["specifications"][name] = class_obj

        # Brings in all induced slot content for each class including all
        # details, rather than just having code referencing shared slot info.
        try:
            slot_defs = {}
            slot_array = mixs_sv.class_induced_slots(name)
            for slot_obj in slot_array:
                slot_defs[slot_obj["name"]] = slot_obj
            content["specifications"][name]["slots"] = slot_defs
        except Exception as e:
            # ISSUE: default slots is array of string, but
            # class_induced_slots(name) is array of dict so this needs
            # reformatting to dict.
            print("Unable to generate induced slots for: ", name, e)

class_names = content["specifications"].keys()

# code block to sort class slots by rank
for cls_name in class_names:

    # NOTE: if conditional to ignore quantity value class
    if cls_name != "quantity value":
        content["specifications"][cls_name]["slots"] = {
            k: v
            for k, v in sorted(
                content["specifications"][cls_name]["slots"].items(),
                key=lambda x: x[1].rank,
            )
        }

# listing classes from merged SchemaView?
print("Created", len(class_names), "specifications:\n", "\n".join(class_names), "\n")

# Output the amalgamated content:
with open("schema.js", "w") as output_handle:
    output_handle.write(
        "var SCHEMA = "
        + json.dumps(
            content, default=encoder, sort_keys=False, indent=2, separators=(",", ": ")
        )
    )

""" Using linkml native dumper, but this escapes output ???
dumper = JSONDumper();

for name, obj in mixs_sv.all_classes().items():
    if 'slots' in obj and len(obj['slots'])>0: 
        content['specifications'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_enums().items(): # all_enums is a dictionary
    content['enumerations'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_slots().items(): # all_types is a dictionary
    content['slots'][name] = dumper.dumps(obj);

for name, obj in mixs_sv.all_types().items(): # all_types is a dictionary
    content['types'][name] = dumper.dumps(obj);

with open('data.js', 'w') as output_handle:
    output_handle.write('var DATA = ' + content );

"""

# Add this folder's content to template menu.  Creating a javascript file
# structure which can be loaded directly into DH:
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

for name in class_names:
    menu[template_folder][name] = {
        "name": name,
        # Future, allow status to be changed by template curation status.
        "status": "published",
    }

with open(MENU, "w") as output_handle:
    output_handle.write(
        js_prefix + json.dumps(menu, sort_keys=False, indent=2, separators=(",", ": "))
    )
