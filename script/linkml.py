# linkml.py
# Converts schema.yaml LinkML file (and its imports) into one single 
# DataHarmonizer avascript-readable schema.json file in folder where command
# is run from.  Run this in a given DataHarmonizer templates/[template X] 
# folder to convert directly from LinkML yaml to DataHarmonizer json.
#
# Created by: Damion Dooley
#
# Input examples:
#
# > linkml.py -i source/mixs.yaml
# > linkml.py -i https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.yaml
# > linkml.py -i source/mixs.yaml -m
#
# @param -i [linkML schema.yaml file] which is converted to schema.json
# @param -m adds the given schema templates to the DataHarmonizer menu.js

import copy

import yaml
import json
import optparse
import os
from sys import exit

from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper

# Common menu shared with all template folders.
MENU = "../menu.json"
template_folder = os.path.basename(os.getcwd())
w_filename_base = 'schema';

def init_parser():
    parser = optparse.OptionParser()

    parser.add_option(
        "-i",
        "--input",
        dest="linkml_file",
        default="schema.yaml",
        help="Provide a relative file name and path to root LinkML schema file to read."
    );

    parser.add_option(
        "-m",
        "--menu",
        dest="menu",
        default=False,
        action="store_true",
        help="A flag which indicates menu entries should be generated or updated for a schema's templates (classes)."
    );

    return parser.parse_args();

def write_json(file_path):

    # Now create schema.json which browser app can read directly.  Replaces each
    # class with its induced version. This shifts each slot's content into an
    # attributes: {} dictionary object.
    with open(file_path, "r") as schema_handle:
        SCHEMA = yaml.safe_load(schema_handle);

        schema_view = SchemaView(yaml.dump(SCHEMA, sort_keys=False));

        # Brings in any "imports:". This also includes built-in linkml:types
        schema_view.merge_imports();

        # Loop through all top level classes and replace class with its induced 
        # version in attributes dictionary.
        for name, class_obj in schema_view.all_classes().items():
            # Note classDef["@type"]: "ClassDefinition" is only in json output
            # Presence of "slots" in class indicates field hierarchy
            # Error trap is_a reference to non-existent class
            if "is_a" in class_obj and class_obj['is_a'] and (not class_obj['is_a'] in SCHEMA['classes']):
                print("Error: Class ", name, "has an is_a reference to a Class [", class_obj['is_a'], " ]which isn't defined.  This reference needs to be removed.");
                sys.exit(0);

            if schema_view.class_slots(name):
                new_obj = schema_view.induced_class(name);
                schema_view.add_class(new_obj);

        # SchemaView() is coercing "in_language" into a string when it is an array
        # of i18n languages as per official LinkML spec.  We're bending the rules
        # slightly.  Put it back into an array.
        if 'in_language' in SCHEMA:
            schema_view.schema['in_language'] = SCHEMA['in_language'];

        # Output the amalgamated content:
        JSONDumper().dump(schema_view.schema, w_filename_base + '.json');
        
        return schema_view;


# ********* Adjust the menu to include this schema and its classes ******
# Creating a JSON file structure which can be loaded directly into DH:
#
# {
#   "MIxS": {
#     "soil": {
#       "name": 'soil', 
#       "status": "published"
#     },
#     ... etc
#   }
# }
def write_menu(menu_path, schema_folder, schema_view):

    schema_name = schema_view.schema['name'];

    # Work with existing MENU menu.js, or start new one.
    if os.path.isfile(menu_path):
        with open(menu_path, "r") as f:
            menu = json.load(f);
    else:
        menu = {};

    # Reset this folder's menu content
    menu[schema_name] = {
        "folder": schema_folder,
        "id": schema_view.schema['id'],
        "version": schema_view.schema['version'],
        "templates":{}
    };

    print(schema_view.schema and schema_view.schema['in_language'])

    if 'in_language' in schema_view.schema and schema_view.schema['in_language'] != None:
        menu[schema_name]['locales'] = schema_view.schema['in_language'];

    class_menu = {};

    # Get all top level classes
    for class_name, class_obj in schema_view.all_classes().items():

        # Presence of "slots" in class indicates field hierarchy
        if schema_view.class_slots(class_name):
            class_menu[class_name] = class_obj;

    # Now cycle through each template:
    for class_name, class_obj in class_menu.items():
        display = 'is_a' in class_obj and class_obj['is_a'] == 'dh_interface';
        # Old DataHarmonizer <=1.9.1 included class_name in menu via "display"
        # if it had an "is_a" attribute = "dh_interface".
        # DH > 1.9.1 also displays if class is mentined in a "Container" class
        # attribute [Class name 2].range = class_name
        if display == False and 'Container' in schema_view.schema.classes:
            container = schema_view.get_class('Container');
            for container_name, container_obj in container['attributes'].items():
                if container_obj['range'] == class_name:
                    display = True;
                    break;

        menu[schema_name]['templates'][class_name] = {
            "name": class_name,
            "display": display
        };

        annotations = schema_view.annotation_dict(class_name);
        if 'version' in annotations:
            menu[schema_name]['templates'][class_name]['version'] = annotations['version'];

        print("Updated menu for", schema_name+'/' + class_name);

    # Update or create whole menu
    with open(menu_path, "w") as output_handle:
        json.dump(menu, fp=output_handle, sort_keys=False, indent=2, separators=(",", ": "))


# ********* Adjust the menu to include this schema and its classes ******

options, args = init_parser()
if not options.linkml_file:
    exit("Input LinkML schema file not given");

print("Loading LinkML schema for", options.linkml_file);

schema_view = write_json(options.linkml_file);

# Adjust menu.json to include or update entries for given schema's template(s)
if options.menu:
    write_menu('../menu.json', os.path.basename(os.getcwd()), schema_view);