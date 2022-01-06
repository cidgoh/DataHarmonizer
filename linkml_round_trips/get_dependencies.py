from linkml_runtime.linkml_model import SchemaDefinition \
    # ClassDefinition, SlotDefinition, Annotation
from linkml_runtime.dumpers import yaml_dumper
from linkml_runtime.utils.schemaview import SchemaView

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)

# todo find alternative to globals that doesn't require passing all of this stuff on each iteration
global model_sv, mvp, mvs, all_class_names, all_enum_names, all_slots_dict, all_type_names


# use a dataclass instead of a dict?
# or do better testing of the dict
# todo document what this mysterious dict_to_exhaust should look like
# todo it can also include starting slots and even multiple starting classes or slots
# what about types?
def exhaust_class(dict_to_exhaust):
    global model_sv, mvp, mvs, all_class_names, all_enum_names, all_slots_dict, all_type_names
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
            i_s = model_sv.class_induced_slots(pc)
            isnl = [slot.name for slot in i_s]
            isns = set(isnl)
            dict_to_exhaust["pending_slots"] = dict_to_exhaust["pending_slots"].union(
                isns
            )
            class_parents.update(set(model_sv.class_ancestors(pc)))
            cd = model_sv.get_class(pc)
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
                isas.update(set(model_sv.slot_ancestors(ps)))

                current_slot_range = current_slot_def.range
                if current_slot_range is not None:
                    if current_slot_range in all_type_names:
                        dict_to_exhaust["exhausted_types"].add(current_slot_range)
                        td = model_sv.get_type(current_slot_range)
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

        return exhaust_class(dict_to_exhaust)


def exhausted_to_sd(exhausted, modelname, classname, mod_def_pref):
    global model_sv

    accum_sd = SchemaDefinition(name=modelname + "_" + classname,
                                id="http://example.com/" + modelname + "_" + classname)
    for i in exhausted["exhausted_ranges"]:
        accum_sd.classes[i] = model_sv.get_class(i)
    for i in exhausted["exhausted_slots"]:
        accum_sd.slots[i] = model_sv.get_slot(i)
        # what about whitespace?
        if accum_sd.slots[i].slot_uri is None or accum_sd.slots[i].slot_uri == "":
            new_uri = mod_def_pref + ":" + i
            # logger.info("new: " + new_uri)
            accum_sd.slots[i].slot_uri = new_uri
        else:
            pass
            # logger.info("existing: " + accum_sd.slots[i].slot_uri)

    # need to construct slot uris?

    for i in exhausted["exhausted_types"]:
        accum_sd.types[i] = model_sv.get_type(i)
    for i in exhausted["exhausted_enums"]:
        accum_sd.enums[i] = model_sv.get_enum(i)

    # limit these to those subsets claimed by any element?
    for k, v in mvs.items():
        accum_sd.subsets[k] = v

    # limit these to those prefixes claimed by any element?
    for k, v in mvp.items():
        accum_sd.prefixes[k] = v

    accum_sd.default_prefix = mod_def_pref

    return accum_sd


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--selected_class', required=True)
def get_dependencies(model_file, selected_class):
    logger.info(selected_class)

    global model_sv, mvp, mvs, all_class_names, all_enum_names, all_slots_dict, all_type_names

    model_sv = SchemaView(model_file)

    model_name = model_sv.schema.name
    model_def_pref = model_sv.schema.default_prefix

    mvp = model_sv.schema.prefixes
    mvs = model_sv.all_subsets()

    all_classes = model_sv.all_classes()
    all_class_names = list(all_classes.keys())

    all_enums = model_sv.all_enums()
    all_enum_names = list(all_enums.keys())

    all_slots_dict = model_sv.all_slots()

    all_types = model_sv.all_types()
    all_type_names = list(all_types.keys())

    class_slot_dict = {
        "pending_ranges": set(),
        "pending_slots": set(),
        "exhausted_ranges": set(),
        "exhausted_slots": set(),
        "exhausted_enums": set(),
        "exhausted_types": set(),
    }

    accum = class_slot_dict.copy()
    accum["pending_ranges"].add(selected_class)

    exhausted_result = exhaust_class(accum)

    sd_result = exhausted_to_sd(exhausted_result, model_name, selected_class, model_def_pref)

    print(yaml_dumper.dumps(sd_result))


if __name__ == '__main__':
    get_dependencies()
