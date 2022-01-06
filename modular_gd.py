import pprint

import pandas as pd
import pygsheets
from linkml_runtime.dumpers import yaml_dumper
from linkml_runtime.linkml_model import SchemaDefinition, ClassDefinition
from linkml_runtime.utils.schemaview import SchemaView

pd.options.display.width = 0

sheet_id = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'
client_secret_json = "local/client_secret.apps.googleusercontent.com.json"

mixs_yaml = "mixs-source/model/schema/mixs.yaml"
mixs_sheet_title = "mixs_packages_x_slots"

nmdc_yaml = "nmdc-schema/src/schema/nmdc.yaml"
nmdc_sheet_title = "nmdc_biosample_slots"

constructed_schema_name = "soil_biosample"
constructed_schema_id = "http://example.com/soil_biosample"
constructed_class_name = "soil_biosample"


def get_gsheet_frame(some_google_auth_file, sheet_id, tab_title):
    gc = pygsheets.authorize(client_secret=some_google_auth_file)
    gsheet = gc.open_by_key(sheet_id)
    current_tab = gsheet.worksheet("title", tab_title)
    current_frame = current_tab.get_as_df()
    return current_frame


def make_view_helper(schema_yaml_file, schema_alias, class_name):
    current_view = SchemaView(schema_yaml_file)
    current_slots = current_view.all_slots()
    induced_slots = current_view.class_induced_slots(class_name)
    induced_slot_names = [i.name for i in induced_slots]
    is_dict = dict(zip(induced_slot_names, induced_slots))
    return {"schema_alias": schema_alias, "view": current_view, "schema_slot_dict": current_slots,
            "class_name": class_name, "class_slots_dict": is_dict}


def get_slot_provenance(slot_list, helped_schema):
    provenance_dict = {"class_induced": [], "schema_other": [], "non_schema": []}
    for current_slot in slot_list:
        if current_slot in helped_schema["class_slots_dict"]:
            current_provenance = "class_induced"
        elif current_slot in helped_schema["schema_slot_dict"]:
            current_provenance = "schema_other"
        else:
            current_provenance = "non_schema"
        provenance_dict[current_provenance].append(current_slot)
    return provenance_dict


constructed_schema = SchemaDefinition(name=constructed_schema_name, id=constructed_schema_id)
constructed_class = ClassDefinition(name=constructed_class_name)
constructed_schema.classes[constructed_class_name] = constructed_class
constructed_schema_yaml_string = yaml_dumper.dumps(constructed_schema)
print(constructed_schema_yaml_string)

mixs_frame = get_gsheet_frame(client_secret_json, sheet_id, mixs_sheet_title)
soil_frame = mixs_frame.loc[mixs_frame["package"].eq("soil")]
# sf_dispo_vc = soil_frame['disposition'].value_counts()
soil_use_frame = soil_frame.loc[soil_frame["disposition"].eq("use as-is") | soil_frame["disposition"].eq("borrowed")]
soil_use_slots = list(soil_use_frame["slot"])
# soil_use_slots.sort()
mixs_helped = make_view_helper(mixs_yaml, "mixs", "soil")
mixs_soil_provenance = get_slot_provenance(soil_use_slots, mixs_helped)
pprint.pprint(mixs_soil_provenance)

nmdc_frame = get_gsheet_frame(client_secret_json, sheet_id, nmdc_sheet_title)
non_mixs_frame = nmdc_frame.loc[
    ~(nmdc_frame["from_schema"].eq("https://microbiomedata/schema/mixs") | nmdc_frame["disposition"].eq(
        "skip"))]
non_mixs_frame_slots = list(non_mixs_frame['name'])
nmdc_helped = make_view_helper(nmdc_yaml, "nmdc", "biosample")
nmdc_biosample_provenance = get_slot_provenance(non_mixs_frame_slots, nmdc_helped)
pprint.pprint(nmdc_biosample_provenance)
