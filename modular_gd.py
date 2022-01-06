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

class_slot_dict = {
    "pending_ranges": set(),
    "pending_slots": set(),
    "exhausted_ranges": set(),
    "exhausted_slots": set(),
    "exhausted_enums": set(),
    "exhausted_types": set(),
}


def get_gsheet_frame(some_google_auth_file, sheet_id_arg, tab_title):
    gc = pygsheets.authorize(client_secret=some_google_auth_file)
    gsheet = gc.open_by_key(sheet_id_arg)
    current_tab = gsheet.worksheet("title", tab_title)
    current_frame = current_tab.get_as_df()
    return current_frame


def make_view_helper(schema_yaml_file, schema_alias, class_name):
    current_view = SchemaView(schema_yaml_file)
    current_slots = current_view.all_slots()
    induced_slots = current_view.class_induced_slots(class_name)
    induced_slot_names = [i.name for i in induced_slots]
    is_dict = dict(zip(induced_slot_names, induced_slots))
    all_classes = current_view.all_classes()
    ac_names = [k for k, v in all_classes.items()]
    all_enums = current_view.all_enums()
    ae_names = [k for k, v in all_enums.items()]
    all_types = current_view.all_types()
    at_names = [k for k, v in all_types.items()]
    return {"schema_alias": schema_alias, "view": current_view, "schema_slot_dict": current_slots,
            "schema_class_names": ac_names, "schema_enum_names": ae_names, "schema_type_names": at_names,
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


def construct_schema(schema_name, schema_id, class_name):
    constructed_schema = SchemaDefinition(name=schema_name, id=schema_id)
    constructed_class = ClassDefinition(name=class_name)
    constructed_schema.classes[class_name] = constructed_class
    return constructed_schema


def modular_exhaust_class(dict_to_exhaust, helped_schema):
    # mvp = helped_schema['view'].schema.prefixes
    # mvs = helped_schema['view'].schema.prefixes.all_subsets()
    all_slots_dict = helped_schema['schema_slot_dict']
    all_class_names = helped_schema['schema_class_names']
    all_enum_names = helped_schema['schema_enum_names']
    all_type_names = helped_schema['schema_type_names']

    if (
            len(dict_to_exhaust["pending_ranges"]) == 0
            and len(dict_to_exhaust["pending_slots"]) == 0
    ):
        return dict_to_exhaust
    else:
        class_parents = set()
        usage_ranges = set()
        for pc in dict_to_exhaust["pending_ranges"]:
            dict_to_exhaust["exhausted_ranges"].add(pc)
            i_s = helped_schema['view'].class_induced_slots(pc)
            isnl = [slot.name for slot in i_s]
            isns = set(isnl)
            dict_to_exhaust["pending_slots"] = dict_to_exhaust["pending_slots"].union(
                isns
            )
            class_parents.update(set(helped_schema['view'].class_ancestors(pc)))
            cd = helped_schema['view'].get_class(pc)
            for k, v in cd.slot_usage.items():
                if v.range is not None:
                    usage_ranges.add(v.range)
        dict_to_exhaust["pending_ranges"] = (
                dict_to_exhaust["pending_ranges"] - dict_to_exhaust["exhausted_ranges"]
        )
        for cp in class_parents:
            if cp not in dict_to_exhaust["exhausted_ranges"]:
                dict_to_exhaust["pending_ranges"].add(cp)
        for ur in usage_ranges:
            if ur in all_class_names and ur not in dict_to_exhaust["exhausted_ranges"]:
                dict_to_exhaust["pending_ranges"].add(ur)
            if ur in all_type_names:
                # a typeof could sneak in here?
                dict_to_exhaust["exhausted_types"].add(ur)
        isas = set()
        for ps in dict_to_exhaust["pending_slots"]:
            if ps not in dict_to_exhaust["exhausted_slots"]:
                current_slot_def = all_slots_dict[ps]
                isas.update(set(helped_schema['view'].slot_ancestors(ps)))

                current_slot_range = current_slot_def.range
                if current_slot_range is not None:
                    if current_slot_range in all_type_names:
                        dict_to_exhaust["exhausted_types"].add(current_slot_range)
                        td = helped_schema['view'].get_type(current_slot_range)
                        tdto = td.typeof
                        if tdto is not None:
                            dict_to_exhaust["exhausted_types"].add(tdto)
                    if current_slot_range in all_enum_names:
                        dict_to_exhaust["exhausted_enums"].add(current_slot_range)
                    if current_slot_range in all_class_names:
                        if (
                                current_slot_range
                                not in dict_to_exhaust["exhausted_ranges"]
                        ):
                            dict_to_exhaust["pending_ranges"].add(current_slot_range)

                # refactor?
                current_slot_domain = current_slot_def.domain
                if current_slot_domain is not None:
                    if current_slot_domain not in dict_to_exhaust["exhausted_ranges"]:
                        dict_to_exhaust["pending_ranges"].add(current_slot_domain)

                dict_to_exhaust["exhausted_slots"].add(ps)
        dict_to_exhaust["pending_slots"] = (
                dict_to_exhaust["pending_slots"] - dict_to_exhaust["exhausted_slots"]
        )
        for parent in isas:
            dict_to_exhaust["pending_slots"].add(parent)

        return modular_exhaust_class(dict_to_exhaust, helped_schema)


new_schema = construct_schema(constructed_schema_name, constructed_schema_id, constructed_class_name)

mixs_frame = get_gsheet_frame(client_secret_json, sheet_id, mixs_sheet_title)
soil_frame = mixs_frame.loc[mixs_frame["package"].eq("soil")]
# sf_dispo_vc = soil_frame['disposition'].value_counts()
soil_use_frame = soil_frame.loc[soil_frame["disposition"].eq("use as-is") | soil_frame["disposition"].eq("borrowed")]
soil_use_slots = list(soil_use_frame["slot"])
# soil_use_slots.sort()
mixs_helped = make_view_helper(mixs_yaml, "mixs", "soil")
mixs_soil_provenance = get_slot_provenance(soil_use_slots, mixs_helped)

nmdc_frame = get_gsheet_frame(client_secret_json, sheet_id, nmdc_sheet_title)
non_mixs_frame = nmdc_frame.loc[
    ~(nmdc_frame["from_schema"].eq("https://microbiomedata/schema/mixs") | nmdc_frame["disposition"].eq(
        "skip"))]
non_mixs_frame_slots = list(non_mixs_frame['name'])
nmdc_helped = make_view_helper(nmdc_yaml, "nmdc", "biosample")
nmdc_biosample_provenance = get_slot_provenance(non_mixs_frame_slots, nmdc_helped)

for i in mixs_soil_provenance['schema_other']:
    class_slot_dict['pending_slots'].add(i)
for i in mixs_soil_provenance['class_induced']:
    class_slot_dict['pending_slots'].add(i)
class_slot_dict['pending_ranges'].add('soil')
mixs_exhaustion = modular_exhaust_class(class_slot_dict, mixs_helped)
pprint.pprint(mixs_exhaustion)

# NMDC

for i in mixs_exhaustion['exhausted_types']:
    new_schema.types[i] = nmdc_helped['view'].get_type(i)

# REFACTOR
for i in mixs_exhaustion['exhausted_enums']:
    new_schema.enums[i] = nmdc_helped['view'].get_enum(i)

# remember could handle differently for induces slots/slot usage
for i in mixs_exhaustion['exhausted_slots']:
    new_schema.slots[i] = nmdc_helped['view'].get_slot(i)

for i in mixs_exhaustion['exhausted_ranges']:
    new_schema.classes[i] = nmdc_helped['view'].get_class(i)

#  MIxS

for i in mixs_exhaustion['exhausted_types']:
    new_schema.types[i] = mixs_helped['view'].get_type(i)

# REFACTOR
for i in mixs_exhaustion['exhausted_enums']:
    new_schema.enums[i] = mixs_helped['view'].get_enum(i)

# remember could handle differently for induces slots/slot usage
for i in mixs_exhaustion['exhausted_slots']:
    new_schema.slots[i] = mixs_helped['view'].get_slot(i)

for i in mixs_exhaustion['exhausted_ranges']:
    new_schema.classes[i] = mixs_helped['view'].get_class(i)

# new_schema_yaml_string = yaml_dumper.dumps(new_schema)
# print(new_schema_yaml_string)

yaml_dumper.dump(new_schema, "modular_gd.yaml")

# # refactor
# for i in nmdc_biosample_provenance['schema_other']:
#     class_slot_dict['pending_slots'].add(i)
# for i in nmdc_biosample_provenance['class_induced']:
#     class_slot_dict['pending_slots'].add(i)
# class_slot_dict['pending_ranges'].add('biosample')
# nmdc_exhaustion = modular_exhaust_class(class_slot_dict, nmdc_helped)
# pprint.pprint(nmdc_exhaustion)
