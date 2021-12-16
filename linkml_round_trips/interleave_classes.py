import pandas as pd
from linkml_runtime.linkml_model import SchemaDefinition, ClassDefinition, SlotDefinition, Annotation
from linkml_runtime.dumpers import yaml_dumper
from linkml_runtime.utils.schemaview import SchemaView
from strsimpy import Cosine

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model1', type=click.Path(exists=True), required=True)
@click.option('--class1', required=True)
@click.option('--scavenge1', is_flag=True,
              help="will take slot attributes from model1 instead of model2, even if they aren't part of class1")
@click.option('--model2', type=click.Path(exists=True), required=True)
@click.option('--class2', required=True)
@click.option('--imodel', type=click.Path(), default="interleaved.yaml", show_default=True)
@click.option('--iclass', default="interleaved_class", show_default=True)
@click.option('--iid', default="http://example.com/interleaved", show_default=True)
@click.option('--iname', default="interleaved", show_default=True)
@click.option('--itsv', type=click.Path(), default="interleaved_for_curation.tsv", show_default=True)
@click.option('--shingle_size', default=3, show_default=True)
def interleave_classes(model1, class1, model2, class2, imodel, iclass, iid, iname, itsv, shingle_size, scavenge1):
    # todo so much to refactor
    sv1 = SchemaView(model1)
    class_slots1 = sv1.class_induced_slots(class1)
    class_slot_names1 = [i.name for i in class_slots1]
    class_slot_dict_1 = dict(zip(class_slot_names1, class_slots1))
    class_slot_names1.sort()

    name1 = sv1.schema.name

    all_slots1 = sv1.all_slots()
    all_slot_names1 = list(all_slots1.keys())
    all_slot_dict_1 = dict(zip(all_slot_names1, all_slots1))
    all_slot_names1.sort()

    if scavenge1:
        print("scavenging")
    else:
        print(f"only using attributes from slots explicitly associated with {class1}")

    sv2 = SchemaView(model2)
    class_slots_2 = sv2.class_induced_slots(class2)
    class_slot_names2 = [i.name for i in class_slots_2]
    class_slot_dict_2 = dict(zip(class_slot_names2, class_slots_2))
    class_slot_names2.sort()

    name2 = sv2.schema.name

    # not giving an option for scavenging 2?
    all_class_slots_2 = sv2.all_slots()
    all_slot_names2 = list(all_class_slots_2.keys())
    all_slot_names2.sort()
    # # print(all_slot_names2)

    slot_names_only_1 = list(set(class_slot_names1) - set(class_slot_names2))
    slot_names_only_1.sort()
    # find slots from schema1 class1 that are in schema2 just not in class2
    newdiff = list(set(class_slot_names1) - set(all_slot_names2))
    print(len(slot_names_only_1))
    print(len(newdiff))

    slot_names_only_2 = list(set(class_slot_names2) - set(class_slot_names1))
    slot_names_only_2.sort()
    newdiff = list(set(class_slot_names2) - set(all_slot_names1))
    print(len(slot_names_only_2))
    print(len(newdiff))

    slot_names_intersection = list(set(class_slot_names1).intersection(set(class_slot_names2)))
    slot_names_intersection.sort()

    interleaved_sd = SchemaDefinition(name=iname, id=iid)

    interleaved_class = ClassDefinition(name=iclass)

    cosine_obj = Cosine(shingle_size)

    empty_row = {"slot": "", "attribute": "", name1: "", name2: "", "cosine_dist": None, "curation": None}

    for i in slot_names_only_1:
        print(i)
        interleaved_class.slots.append(i)
        interleaved_sd.slots[i] = class_slot_dict_1[i]
    print("\n")

    for i in slot_names_only_2:
        print(i)
        interleaved_class.slots.append(i)
        interleaved_sd.slots[i] = class_slot_dict_2[i]
    print("\n")

    # ----

    needs_curation = []
    for i in slot_names_intersection:
        print(i)
        interleaved_class.slots.append(i)
        interleaved_sd.slots[i] = SlotDefinition(name=i)
        attribs1 = class_slot_dict_1[i].__dict__
        keys1 = list(attribs1.keys())
        keys1.sort()
        attribs2 = class_slot_dict_2[i].__dict__
        keys2 = list(attribs2.keys())
        keys2.sort()

        keys_only_1 = list(set(keys1) - set(keys2))
        keys_only_1.sort()
        for j in keys_only_1:
            print(j)
        # print("\n")
        keys_only_2 = list(set(keys2) - set(keys1))
        keys_only_2.sort()
        for j in keys_only_2:
            print(j)
        # print("\n")
        keys_intersection = list(set(keys1).intersection(set(keys2)))
        keys_intersection.sort()

        for j in keys_intersection:
            one_is_empty_string = class_slot_dict_1[i][j] == ""
            one_is_empty_list = class_slot_dict_1[i][j] == []
            one_is_empty_dict = class_slot_dict_1[i][j] == {}
            one_is_none = class_slot_dict_1[i][j] is None
            one_is_empty = one_is_empty_string or one_is_empty_list or one_is_empty_dict or one_is_none

            two_is_empty_string = class_slot_dict_2[i][j] == ""
            two_is_empty_list = class_slot_dict_2[i][j] == []
            two_is_empty_dict = class_slot_dict_2[i][j] == {}
            two_is_none = class_slot_dict_2[i][j] is None
            two_is_empty = two_is_empty_string or two_is_empty_list or two_is_empty_dict or two_is_none

            same_across_schemas = class_slot_dict_1[i][j] == class_slot_dict_2[i][j]
            if same_across_schemas:
                interleaved_sd.slots[i][j] = class_slot_dict_1[i][j]
                # adding indicator that some conflicting attributes may still need to be curated
                interleaved_sd.slots[i].annotations["needs_reconciliation"] = Annotation(tag="needs_reconciliation",
                                                                                         value=True)
            elif one_is_empty and not two_is_empty:
                # print(f"{name1} {i} {j} {class_slot_dict_1[i][j]} is empty but {name2} {class_slot_dict_2[i][j]} is not")
                interleaved_sd.slots[i][j] = class_slot_dict_2[i][j]
                interleaved_sd.slots[i].annotations[j] = Annotation(tag=j, value=f"non-blank {name2} wins")
                # interleaved_sd.slots[i].annotations = Annotation(tag="non_blank_winner",
                #                                                  value=f"{name2} wins over blank {name1}")
            elif two_is_empty and not one_is_empty:
                # print(f"{name2} {i} {j} {class_slot_dict_2[i][j]} is empty but {name1} {class_slot_dict_1[i][j]} is not")
                interleaved_sd.slots[i][j] = class_slot_dict_1[i][j]
                interleaved_sd.slots[i].annotations[j] = Annotation(tag=j, value=f"non-blank {name1} wins")
            else:
                current_row = empty_row.copy()
                current_row["slot"] = i
                current_row["attribute"] = j
                current_row[name1] = class_slot_dict_1[i][j]
                current_row[name2] = class_slot_dict_2[i][j]
                # if type(class_slot_dict_1[i][j]) == str and type(class_slot_dict_2[i][j]) == str:
                current_row["cosine_dist"] = cosine_obj.distance(str(class_slot_dict_1[i][j]),
                                                                 str(class_slot_dict_2[i][j]))
                # print(current_row)
                needs_curation.append(current_row)
        current_frame = pd.DataFrame(needs_curation)

    # current_frame.sort_values(["different", "slot", "attribute"], inplace=True)

    # could be undefined
    current_frame.to_csv(itsv, sep="\t", index=False)

    # ----

    interleaved_sd.classes[iclass] = interleaved_class

    yaml_dumper.dump(interleaved_sd, imodel)

    x = interleaved_sd.slots
    xtally = []
    # print(type(x))
    for k, v in x.items():
        xtally.append(v.range)

    print(pd.Series(xtally).value_counts())


if __name__ == '__main__':
    interleave_classes()
