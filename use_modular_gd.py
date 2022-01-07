# import pprint
# import pandas as pd
from linkml_runtime.dumpers import yaml_dumper
import linkml_round_trips.modular_gd as mgd
# pd.options.display.width = 0

sheet_id = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'
client_secret_json = "local/client_secret.apps.googleusercontent.com.json"

constructed_schema_name = "soil_biosample"
constructed_schema_id = "http://example.com/soil_biosample"
constructed_class_name = "soil_biosample"

new_schema = mgd.construct_schema(constructed_schema_name, constructed_schema_id, constructed_class_name)

tasks = {"mixs": {"yaml": "mixs-source/model/schema/mixs.yaml", "title": "mixs_packages_x_slots", "focus_class": "soil",
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
"""},
         "nmdc": {"yaml": "nmdc-schema/src/schema/nmdc.yaml", "title": "nmdc_biosample_slots",
                  "focus_class": "biosample",
                  "query": """
SELECT
    name as slot
FROM
    gsheet_frame
where
    from_schema != 'https://microbiomedata/schema/mixs'
    and disposition != 'skip';
"""}}

for title, task in tasks.items():
    pysqldf_slot_list = mgd.subset_slots_from_sheet(client_secret_json, sheet_id, task['title'], task['query'])
    # # pysqldf_slot_list.sort()
    new_schema = mgd.wrapper(task['yaml'], title, task['focus_class'], pysqldf_slot_list, new_schema,
                             constructed_class_name)

yaml_dumper.dump(new_schema, "use_modular_gd.yaml")

# ----

# gen-yaml

#       1 WARNING:Namespaces:MIXS namespace is already mapped to https://w3id.org/gensc/ - Mapping to https://w3id.org/mixs/terms/ ignored
#     276 WARNING:YAMLGenerator:File "<file>" Prefix case mismatch - supplied: MIXS expected: mixs
#       1 WARNING:YAMLGenerator:File "<file>" Unrecognized prefix: UO
#       1 WARNING:YAMLGenerator:File "<file>" Unrecognized prefix: prov
#       1 WARNING:YAMLGenerator:File "<file>" Unrecognized prefix: rdf
#       1 WARNING:YAMLGenerator:File "<file>" Unrecognized prefix: schema
#       1 WARNING:YAMLGenerator:File "<file>" Unrecognized prefix: xsd
#       1 WARNING:YAMLGenerator:Overlapping subset and class names: soil
