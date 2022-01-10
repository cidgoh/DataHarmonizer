import linkml.generators.yamlgen as yg
import linkml_round_trips.modular_gd as mgd
from linkml_runtime.linkml_model import Prefix
from linkml_runtime.dumpers import yaml_dumper

sheet_id = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'
client_secret_json = "local/client_secret.apps.googleusercontent.com.json"

constructed_schema_name = "soil_biosample"
constructed_schema_id = "http://example.com/soil_biosample"
constructed_class_name = "soil_biosample"

additional_prefixes = {"prov": "http://www.w3.org/ns/prov#", "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                       "schema": "http://schema.org/", "xsd": "http://www.w3.org/2001/XMLSchema#",
                       "UO": "http://purl.obolibrary.org/obo/UO_"}

new_schema = mgd.construct_schema(constructed_schema_name, constructed_schema_id, constructed_class_name,
                                  additional_prefixes)

# nmdc-schema/src/schema/nmdc.yaml
# mixs-source/model/schema/mixs.yaml
# target/nmdc_generated.yaml
# target/mixs_generated.yaml
# target/mixs_generated_no_imports.yaml
# target/nmdc_generated_no_imports.yaml

tasks = {"nmdc": {"yaml": "target/nmdc_generated_no_imports.yaml", "title": "nmdc_biosample_slots",
                  "focus_class": "biosample",
                  "query": """
SELECT
    name as slot
FROM
    gsheet_frame
where
    from_schema != 'https://microbiomedata/schema/mixs'
    and disposition != 'skip';
"""}, "mixs": {"yaml": "target/mixs_generated_no_imports.yaml", "title": "mixs_packages_x_slots", "focus_class": "soil",
               "query": """
SELECT
    slot as slot
FROM
    gsheet_frame
where
    package = 'soil'
    and (
    disposition = 'use as-is' or disposition = 'borrowed as-is'
    )
"""}, }

for title, task in tasks.items():
    pysqldf_slot_list = mgd.subset_slots_from_sheet(client_secret_json, sheet_id, task['title'], task['query'])
    # # pysqldf_slot_list.sort()
    new_schema = mgd.wrapper(task['yaml'], title, task['focus_class'], pysqldf_slot_list, new_schema,
                             constructed_class_name)

# generated = yg.YAMLGenerator(new_schema)

#   1 WARNING:Namespaces:MIXS namespace is already mapped to https://w3id.org/gensc/ - Mapping to https://w3id.org/mixs/terms/ ignored
# 276 WARNING:YAMLGenerator:File "<file>" Prefix case mismatch - supplied: MIXS expected: mixs
#   1 WARNING:YAMLGenerator:Overlapping subset and class names: soil

# serialized = generated.serialize()

# # todo use the "with" wrapper (if we want to write to a files instead of STDOUT)
# file = open("use_modular_gd.yaml", "w")
# yaml.safe_dump(serialized, file)

dumped = yaml_dumper.dumps(new_schema)

print(dumped)
