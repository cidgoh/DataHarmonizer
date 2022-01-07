from linkml_runtime.utils.schemaview import SchemaView
from linkml_runtime.dumpers import yaml_dumper
# Annotation
from linkml_runtime.linkml_model import (
    SchemaDefinition, ClassDefinition, SlotDefinition
)
from deepdiff import DeepDiff
# from pprint import pformat, pprint
import yaml
from linkml_runtime.loaders import yaml_loader

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


# model_file="target/soil_biosample.yaml"
# class1 = "soil"
# class2 = "biosample"
# source_name1 = "MIxS"
# source_name2 = "NMDC"
# output = "target/soil_biosample_interleaved.yaml"


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--class1', required=True)
@click.option('--class2', required=True)
@click.option('--source_name1', required=True)
@click.option('--source_name2', required=True)
@click.option('--output', default="target/interleaved.yaml", type=click.Path(), required=True)
def interleave_mergeds(model_file, class1, class2, source_name1, source_name2, output):
    merged_sv = SchemaView(model_file)

    shared_base = f"{class1}_{class2}"
    shared_schema_name = shared_base + "_schema"
    shared_schema_id = "http://example.com/" + shared_base
    shared_class_name = shared_base + "_class"
    shared_schema_owner = shared_schema_id

    all_res = ['classes', 'enums', 'prefixes', 'slots', 'subsets', 'types']

    class1_ics = merged_sv.class_induced_slots(class1)
    class1_ics_names = [i.name for i in class1_ics]
    class1_ics_dict = dict(zip(class1_ics_names, class1_ics))
    class1_ics_names.sort()

    class2_ics = merged_sv.class_induced_slots(class2)
    class2_ics_names = [i.name for i in class2_ics]
    class2_ics_dict = dict(zip(class2_ics_names, class2_ics))
    class2_ics_names.sort()

    class1_only = list(set(class1_ics_names) - set(class2_ics_names))
    class1_only.sort()
    class2_only = list(set(class2_ics_names) - set(class1_ics_names))
    class2_only.sort()
    both_classes_intersection = list(set(class2_ics_names).intersection(set(class1_ics_names)))
    both_classes_intersection.sort()
    both_classes_disjoint_union = class1_only + class2_only
    both_classes_disjoint_union.sort()
    both_classes_total_union = list(set(class2_ics_names).union(set(class1_ics_names)))
    both_classes_total_union.sort()

    isd = SchemaDefinition(name=shared_schema_name, id=shared_schema_id)
    ic = ClassDefinition(name=shared_class_name)

    for i in both_classes_total_union:
        # print(i)
        if i in class1_only:
            # slot_to_add = class1_ics_dict[i]
            isd.slots[i] = class1_ics_dict[i]
            ic.slots.append(i)
        elif i in class2_only:
            isd.slots[i] = class2_ics_dict[i]
            ic.slots.append(i)
        else:
            print(i)
            # want to compare and edit this as a dict
            from_class1_slotdef = class1_ics_dict[i]
            from_class1_yaml = yaml_dumper.dumps(from_class1_slotdef)
            # print(from_class1_yaml)
            from_class1_yaml_dict = yaml.safe_load(from_class1_yaml)
            # # print(from_class1_yaml_dict)
            # # but how to get back into a SLotDefinition?
            # reloaded = yaml_loader.loads(from_class1_yaml, SlotDefinition)
            # # print(reloaded)

            class1_reload = yaml.safe_load(yaml_dumper.dumps(class1_ics_dict[i]))
            class2_reload = yaml.safe_load(yaml_dumper.dumps(class2_ics_dict[i]))

            uniondef = class1_reload.copy()

            # diff = DeepDiff(class1_reload, class2_reload)
            # pprint(diff)

            diff = DeepDiff(class1_reload, class2_reload, view="tree")
            if 'values_changed' in diff:
                vc = diff['values_changed']
                # print("values_changed")
                for j in vc:
                    current_path = j.path(output_format='list')
                    # print(current_path)
                    if current_path == ["owner"]:
                        # print("action: assert shared owner")
                        uniondef["owner"] = shared_schema_owner
                    elif current_path == ['description']:
                        # print("action: combine conflicting descriptions")
                        desc_union = f"{source_name1}:{j.t1}|{source_name2}: {j.t2}"
                        uniondef["description"] = desc_union
                    else:
                        print(f"unhandled values_changed in {current_path}")
            if 'type_changes' in diff:
                print("unhandled type_changes")
            #     vc = diff['type_changes']
            #     for j in vc:
            #         current_path = j.path(output_format='list')
            #         if current_path == ["required"]:
            #             # this is a dict change now
            #             if j.t1 or j.t2:
            #                 print("required true always wins")
            #                 uniondef["required"] = True
            #             else:
            #                 pass
            #         else:
            #             print(f"unhandled type_changes in {current_path}")

            # one of the iterable changes is irrelevant... which one? class1_reload = 1, class2_reload = 2?
            # use class1_reload as a base
            # ignore added?
            if 'iterable_item_added' in diff:
                print("unhandled iterable_item_added")
            #     # pass
            #     vc = diff['iterable_item_added']
            #     for j in vc:
            #         current_path = j.path(output_format='list')
            #         cp0 = current_path[0]
            #         if cp0 in uniondef:
            #             # this will always be the case since we're using an induced slot definition?
            #             uniondef[cp0].append(j.t2)
            #         else:
            #             print("unhandled empty list {cp0}")
            if 'iterable_item_removed' in diff:
                print("unhandled iterable_item_removed")
            if 'dictionary_item_added' in diff:
                # print("dictionary_item_added")
                vc = diff['dictionary_item_added']
                for j in vc:
                    current_path = j.path(output_format='list')
                    cp0 = current_path[0]
                    val2 = j.t2
                    # print(j.t1)
                    if isinstance(val2, list):
                        if cp0 in uniondef:
                            pass
                            # print("already in there")
                        else:
                            uniondef[cp0] = []
                        for k in val2:
                            # print(f"one item to add: {cp0} {k}")
                            uniondef[cp0].append(k)
                        # pprint(uniondef)
                    elif isinstance(val2, dict):
                        print("need dict handler")
                    else:
                        # dangerous assumption ?
                        uniondef[cp0] = val2
            if 'dictionary_item_removed' in diff:
                pass
                # if this is a case where MIxS has a dict item but NMDC doesn't, not action required?
                # print("unhandled dictionary_item_removed")
            # could be other diff types?
            reloaded = yaml_loader.loads(uniondef, SlotDefinition)
            isd.slots[i] = reloaded
            ic.slots.append(i)

    isd.classes[shared_class_name] = ic

    # all_res = ['classes', 'enums', 'prefixes', 'subsets', 'types']
    for i in all_res:
        print(i)
        source = merged_sv.schema
        dest = isd
        source_elements = source[i]
        sedn = list(source_elements.keys())
        dest_elements = dest[i]
        dedn = list(dest_elements.keys())
        to_move = list(set(sedn) - set(dedn))
        to_move.sort()
        print(to_move)
        for j in to_move:
            print(j)
            isd[i][j] = source_elements[j]

    yaml_dumper.dump(isd, output)
