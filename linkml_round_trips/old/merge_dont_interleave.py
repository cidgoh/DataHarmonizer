# from __future__ import print_function  # In case running on Python 2

from linkml_runtime.linkml_model import (
    SchemaDefinition
)
from linkml_runtime.dumpers import yaml_dumper
from linkml.utils.rawloader import load_raw_schema
import yaml
from linkml_runtime.utils.schemaview import SchemaView
# from strsimpy import Cosine

from deepdiff import DeepDiff
from pprint import pformat, pprint

import click

import logging
import click_log

import pandas as pd

from glom import glom, assign

import ast

logger = logging.getLogger(__name__)
click_log.basic_config(logger)

# over which LinkML root elements should we check and merge
# 'subsets'
all_res = ['classes', 'enums', 'prefixes', 'slots', 'subsets', 'types']
# all_res = ["classes"] # for debugging


diff_type_accumulator = []
overall_accumulator = []
s1_placeholder = "schema_1"
s2_placeholder = "schema_2"

overall_blank = {'linkml_element_type': "", 'element_name': "", 'attribute_name': '', "dd_cat": "", s1_placeholder: "",
                 s2_placeholder: "", "one_choice": None, "curated": ""}


@click.command()
@click_log.simple_verbosity_option(logger)
# use minimal dependency extracted models
@click.option('--model_file1', type=click.Path(exists=True), required=True)
@click.option('--model_file2', type=click.Path(exists=True), required=True)
@click.option('--output', default="target/merged.yaml", type=click.Path(), required=True)
def merge_dont_interleave(model_file1, model_file2, output):
    # all_res.sort()
    # logger.info(all_res)

    sv1 = SchemaView(model_file1)
    name1 = sv1.schema.name
    sv2 = SchemaView(model_file2)
    name2 = sv2.schema.name
    sd2 = sv2.schema

    # schema definition
    merged = merge_schema(sv1, sd2, name1, name2)

    dta_flattened = pd.Series([item for sublist in diff_type_accumulator for item in sublist])
    logger.info("\n")
    logger.info(dta_flattened.value_counts())
    logger.info("\n")

    puredict2 = yaml.safe_load(yaml_dumper.dumps(sv2.schema))

    for acc in overall_accumulator:
        #
        if acc['dd_cat'] == "type_changes" and acc[name1] is None and acc[name2] is not None:
            # print(
            #     f"{name1} {acc['linkml_element_type']} {acc['element_name']}  {acc['attribute_name']} {acc[name1]} ---typechange>>> {name2} {acc[name2]}")
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']] = acc[name2]
        elif acc['dd_cat'] == "type_changes" and acc[name2] is None and acc[name1] is not None:
            pass
        elif acc['dd_cat'] == "values_changed" and acc[name1] is None and acc[name2] is not None:
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']] = acc[name2]
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'is_a' and acc[name2] == "attribute":
            pass
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'range' and acc[name1] in ["string",
                                                                                                       "date",
                                                                                                       "double"]:
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']] = acc[name2]
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'aliases':
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']].append(acc[name2])
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'range' and acc[name1] in list(
                merged['enums'].keys()):
            pass
        # whose slot uri? keeping MIxS form position XXX
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'slot_uri':
            pass
        elif acc['attribute_name'] == "from_schema":
            merged[acc['linkml_element_type']][acc['element_name']][
                acc['attribute_name']] = "https://github.com/turbomam/linkml-round-trips"
        elif acc['dd_cat'] == "iterable_item_added":
            pass
        elif acc['dd_cat'] == "dictionary_item_added":
            pass
        elif acc['dd_cat'] == "iterable_item_removed":
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']].append(acc[name2])
        # assuming th strings are otherwise similar
        elif acc['dd_cat'] == "values_changed" and isinstance(acc[name1], str) and '"' in acc[name2]:
            pass
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == "multivalued":
            merged[acc['linkml_element_type']][acc['element_name']][acc['attribute_name']] = True
        elif acc['dd_cat'] == "values_changed" and acc['attribute_name'] == 'description':
            tidied1 = acc[name1].lower().lstrip().rstrip()
            tidied2 = acc[name2].lower().lstrip().rstrip()
            if tidied1 == tidied2:
                pass
            else:
                logger.info(
                    f"concatenating conflicting descriptions for {acc['linkml_element_type']}|{acc['element_name']}\n\t{name1}:{tidied1}\n\t{name2}:{tidied2}\n")
                merged[acc['linkml_element_type']][acc['element_name']][
                    acc['attribute_name']] = f"{name1}:{acc[name1]}|{name2}:{acc[name2]}"
        elif acc['dd_cat'] == "dictionary_item_removed":
            gpath_pre = acc['linkml_element_type'] + "." + acc['element_name']
            gpath_post = ".".join(ast.literal_eval(acc['attribute_name']))
            gpath = gpath_pre + "." + gpath_post
            logger.info(gpath)
            gres = glom(puredict2, gpath)
            logger.info(f"dictionary_item_removed:{gpath}\n{yaml_dumper.dumps(gres)}")
            logger.info("\n")
            # dest = yaml.safe_load(yaml_dumper.dumps(sv1.schema))
            # _ = assign(dest, gpath, gres, missing=dict)
            # gres = glom(dest, gpath)
            # logger.log(gres)
            # try:
            #     # only getting the last update?
            #     merged = load_raw_schema(dest)
            #     # print(type(merged))
            # except Exception as e:
            #     print(f"exception {e}")
        else:
            logger.info(f"unhandled {acc}")

    # overall_frame = pd.DataFrame(overall_accumulator)
    # # todo shouldn't have duplicate rows in the first place
    # overall_frame.drop_duplicates(inplace=True)
    # # logger.info(overall_frame)
    # overall_frame.sort_values(axis=0, by=['linkml_element_type', 'element_name', 'attribute_name', 'dd_cat'],
    #                           inplace=True)
    # overall_frame.to_csv("overall_frame.tsv", sep="\t", index=False)

    yaml_dumper.dump(merged, output)


def initialize_nlb(name1, name2):
    no_longer_blank = overall_blank.copy()

    old_key = s1_placeholder
    new_key = name1
    no_longer_blank[new_key] = no_longer_blank.pop(old_key)

    old_key = s2_placeholder
    new_key = name2
    no_longer_blank[new_key] = no_longer_blank.pop(old_key)

    no_longer_blank['one_choice'] = no_longer_blank.pop('one_choice')
    no_longer_blank['curated'] = no_longer_blank.pop('curated')
    return no_longer_blank


# def populate_blank(name1, name2, elem_type, elem_name, ):
#     pass


def compare_linkml_root_elem(elem_type, elem_name, elem1, elem2, name1, name2):
    if elem1 != elem2:
        # sing_elem_type = elem_type[:-1]
        # logger.info(f"NOT merging {sing_elem_type} '{elem_name}' from {name1} into {name2}")
        diff = DeepDiff(elem1.__dict__, elem2.__dict__, view="text")
        # what are the types of differences?
        dks = list(diff.keys())
        diff_type_accumulator.append(dks)
        diff = DeepDiff(elem1.__dict__, elem2.__dict__, view="tree")
        # logger.info("\n")
        if 'iterable_item_added' in diff:
            vc = diff['iterable_item_added']
            for i in vc:
                # pprint(i.__dict__)
                no_longer_blank = initialize_nlb(name1, name2)
                no_longer_blank['linkml_element_type'] = elem_type
                no_longer_blank['element_name'] = elem_name
                no_longer_blank['attribute_name'] = i.path(output_format='list')[0]
                no_longer_blank['dd_cat'] = i.report_type
                no_longer_blank[name2] = ""
                no_longer_blank[name1] = str(i.t2)

                overall_accumulator.append(no_longer_blank)
        if 'iterable_item_removed' in diff:
            vc = diff['iterable_item_removed']
            for i in vc:
                # pprint(i.__dict__)
                no_longer_blank = initialize_nlb(name1, name2)
                no_longer_blank['linkml_element_type'] = elem_type
                no_longer_blank['element_name'] = elem_name
                no_longer_blank['attribute_name'] = i.path(output_format='list')[0]
                no_longer_blank['dd_cat'] = i.report_type
                no_longer_blank[name2] = str(i.t1)
                no_longer_blank[name1] = ""

                overall_accumulator.append(no_longer_blank)
        if 'values_changed' in diff:
            # am I assuming a degree of flatness that wouldn't always hold for comparing LinkML elements?
            vc = diff['values_changed']
            vc_paths = [i.path(output_format='list') for i in vc]
            vc_paths = [item for sublist in vc_paths for item in sublist if isinstance(item, str)]
            # some fields are expected to have changed values, like "from_schema"
            # those could be ignored

            for i in range(len(vc_paths)):
                no_longer_blank = initialize_nlb(name1, name2)

                no_longer_blank['linkml_element_type'] = elem_type
                no_longer_blank['element_name'] = elem_name
                no_longer_blank['attribute_name'] = vc_paths[i]
                no_longer_blank['dd_cat'] = vc[i].report_type

                no_longer_blank[name1] = vc[i].t2
                no_longer_blank[name2] = vc[i].t1
                if vc[i].t1 == "" or vc[i].t1 is None:
                    no_longer_blank["one_choice"] = True
                    no_longer_blank["curated"] = vc[i].t2
                    pass
                if vc[i].t2 == "" or vc[i].t2 is None:
                    no_longer_blank["one_choice"] = True
                    no_longer_blank["curated"] = vc[i].t1

                overall_accumulator.append(no_longer_blank)

        if 'type_changes' in diff:
            vc = diff['type_changes']
            vc_paths = [i.path(output_format='list') for i in vc]
            vc_paths = [item for sublist in vc_paths for item in sublist]
            for i in range(len(vc_paths)):
                no_longer_blank = initialize_nlb(name1, name2)

                no_longer_blank['linkml_element_type'] = elem_type
                no_longer_blank['element_name'] = elem_name
                no_longer_blank['attribute_name'] = vc_paths[i]
                no_longer_blank['dd_cat'] = vc[i].report_type

                no_longer_blank[name1] = vc[i].t2
                no_longer_blank[name2] = vc[i].t1

                if vc[i].t1 == "" or vc[i].t1 is None:
                    no_longer_blank["one_choice"] = True
                    no_longer_blank["curated"] = vc[i].t2
                    pass
                if vc[i].t2 == "" or vc[i].t2 is None:
                    no_longer_blank["one_choice"] = True
                    no_longer_blank["curated"] = vc[i].t1

                overall_accumulator.append(no_longer_blank)

        if 'dictionary_item_added' in diff:
            vc = diff['dictionary_item_added']
            vc_paths = [i.path(output_format='list') for i in vc]

            no_longer_blank = initialize_nlb(name1, name2)
            no_longer_blank['linkml_element_type'] = elem_type
            no_longer_blank['element_name'] = elem_name
            no_longer_blank['dd_cat'] = "dictionary_item_added"
            no_longer_blank[name1] = str(vc_paths)
            overall_accumulator.append(no_longer_blank)

        if 'dictionary_item_removed' in diff:
            vc = diff['dictionary_item_removed']
            for i in vc:
                # print(i)
                # print(i.path(output_format='list'))
                # print(yaml_dumper.dumps(i.t1))
                no_longer_blank = initialize_nlb(name1, name2)
                no_longer_blank['linkml_element_type'] = elem_type
                no_longer_blank['element_name'] = elem_name
                no_longer_blank['attribute_name'] = str(i.path(output_format='list'))
                no_longer_blank['dd_cat'] = "dictionary_item_removed"
                no_longer_blank[name2] = str(yaml_dumper.dumps(i.t1))
                overall_accumulator.append(no_longer_blank)

            # vc_paths = [i.path(output_format='list') for i in vc]

            # no_longer_blank = initialize_nlb(name1, name2)
            # no_longer_blank['linkml_element_type'] = elem_type
            # no_longer_blank['element_name'] = elem_name
            # no_longer_blank['dd_cat'] = "dictionary_item_removed"
            # no_longer_blank[name2] = str(vc_paths)
            # overall_accumulator.append(no_longer_blank)


# https://github.com/linkml/linkml-runtime/blob/d762126974e6a8752f7eae1c7a614150a7f346f8/linkml_runtime/utils/schemaview.py#L1173-L1194
def merge_schema(sv: SchemaView, schema: SchemaDefinition, name1, name2) -> SchemaDefinition:
    dest = sv.schema
    for current_re in all_res:
        logger.info(current_re.upper())
        # metamodel elements
        for k, v in schema[current_re].items():
            if k not in dest[current_re]:
                dest[current_re][k] = v
            else:
                a = schema[current_re][k]
                b = dest[current_re][k]
                if a != b:
                    # recursive_compare from https://stackoverflow.com/a/53818532/3860847 nice, too
                    compare_linkml_root_elem(current_re, k, a, b, name1, name2)
                # else:
                #     dest[current_re][k] = v # moot... you don't need to merge in something that's already there

    return dest
