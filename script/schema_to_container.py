# schema_to_container.py
# Converts schema.yaml LinkML file (and its imports) into one single 
# DataHarmonizer avascript-readable schema.json file in folder where command
# is run from.  Run this in a given DataHarmonizer templates/[template X] 
# folder to convert directly from LinkML yaml to DataHarmonizer json.
#
# Created by: Damion Dooley
#
# Input examples:
#
# > schema_to_container.py -i schema.yaml
# > schema_to_container.py -i https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.yaml
#
# @param -i [linkML schema.yaml file] which is converted to schema.json

import copy

import yaml
import json
import optparse
import os
from sys import exit

from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers.json_dumper import JSONDumper

# Common menu shared with all template folders.
template_folder = os.path.basename(os.getcwd())
w_filename_base = 'container';

def init_parser():
    parser = optparse.OptionParser()

    parser.add_option(
        "-i",
        "--input",
        dest="schema_file",
        default="schema.yaml",
        help="Provide a relative file name and path to root LinkML schema file to read."
    );

    return parser.parse_args();

def write_container(file_path):

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

options, args = init_parser()
if not options.schema_file:
    exit("Input LinkML schema file not given");

print("Loading LinkML schema for", options.schema_file);

schema_view = write_container(options.schema_file);
