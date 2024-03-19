import shutil
import re

"""
    This script takes in a DH schema.json file as a reference, and a 
    schema.raw_translation.json file mirror of the schema.json file, 
    containing translated text in a particular language - which is only valid
    for an allowed "keys" set of fields below.  The script merges the 
    reference and translated files, ensuring all reference fields are present,
    and outputs a new "adjusted.json" schema that is the translation.

    Note that there are a few sections in schema.json that should be copied
    with no translation content, namely "types" and "prefixes".

"""

re_keyval = re.compile('^(\s*"([^"]+)":)(.+)$');
# So group 1 = leading space plus key plus quotes and colon; group 2 = key; group 3 = remainder


with open('schema.raw_translation.json') as translated, \
    open('adjusted.json', 'w') as new, \
    open('../../schema.json') as schema: 

    schema_lines = schema.readlines();
    # Keys which translation is allowed to revise
    keys = set(["name", "title", "text", "description", "slot_group", "comments", "value"]);

    counter = 0;

    for line in translated:
        schema_line = schema_lines[counter];
        schema_binding = re_keyval.search(schema_line);
        if schema_binding:
            translation =  re_keyval.search(line);
            key = schema_binding.group(2);
            if key in keys: # only some keys can be translated
                line = schema_binding.group(1) + translation.group(3) + '\n';
            else:
                line = schema_line;

        counter +=1;
        new.write(line)

#shutil.move('adjusted.json', 'schema.json')