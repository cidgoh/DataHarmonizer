import pygsheets
import pandas as pd
from linkml_runtime.utils.schemaview import SchemaView
import numpy as np
import yaml

from linkml_runtime.linkml_model import (
    SchemaDefinition, ClassDefinition, SlotDefinition, Example, Prefix
)

from linkml_runtime.dumpers import yaml_dumper

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--selected_class', required=True)
def soil_nmdc_template_compiled(model_file, selected_class):
    pass


if __name__ == '__main__':
    soil_nmdc_template_compiled()

# todo requests for MS:
#   what the difference between To Do and Notes?

# todo MAM make this round-trip-able
#   appending onto lists, doesn't distinguish between exisiting MIxS or NMDC notes
#     vs contributions from Soil-NMDC-Template_Compiled


sntc_bookkeeping = {}


def get_col_vc(frame_name, col_name):
    col_extract = frame_name[col_name]
    col_vc = col_extract.value_counts()
    return col_vc


# sntc to LinkML:
# "" - > non LinkML row index
# Column Header = title ?
# To Do  = to_dos ?

authority_name_cols = ["NMDC_slot_name_schema", "EMSL_slot_Name", "mixs_6_slot_name"]
# NMDC_slot_name_schema
# EMSL_slot_Name
# mixs_6_slot_name

# Definition = description ?
# Guidance = [comments] ?
# syntax = string_serializastion ?
# Expected value = ???
# reqirement status = required + recommended
# Category used like is_a or ??? see also Section
# Associated Packages for mapping between classes and slots
# Origin = owner?
# notes  = notes ? DOESN NOT NEED TO PROGIGATE TO LINKML OR DH
# 'GitHub Ticket' -> an annotation?
# version ???
# Section used like is_a or ??? see also Category
# Example = [examples()]
# Preferred unit reckless use of comments? or annotation?


# are there any term names that appear on multiple rows?
# do they have overlapping associated packages

# there are multiple term name authorities: mixs, nmdc, emsl (jgi?)

# term names in those columns many not exactly match nmdc or mixs terms

# in what cases does MS want to take nmdc or mixs terms as is?
# when does she want to remove an nmdc or mixs term in its entirety?
# when does she want to override an attribute of one of the nmdc or mixs terms
# when does she want to use an nmdc or mixs term in a package what is twas not formally associated with?
#  that's always OK

mixs_model_file = "../../mixs-source/model/schema/mixs.yaml"
mixs_class = "soil"
nmdc_model_file = "../../nmdc-schema/src/schema/nmdc.yaml"
nmdc_class = "biosample"

mixs_view = SchemaView(mixs_model_file)
nmdc_view = SchemaView(nmdc_model_file)

# # get names of slots expected for SELECTED CLASSES from mixs and nmdc
# mixs_class_induced_slots = mixs_view.class_induced_slots(mixs_class)
# mixs_class_induced_slot_names = [i.name for i in mixs_class_induced_slots]
# mixs_class_induced_slot_names.sort()

#
# # get all class names from mixs
# #  todo tease apart package classes from other classes (checklist, utilities, etc.)
# #    based on mixin usage and claimed parents and children
# mixs_classes = mixs_view.all_classes()
# mixs_class_names = list(mixs_classes.keys())
# mixs_class_names.sort()
# # todo could I just trust SchemaView to include slots that are only defined within class slot usage?
# # todo refactor
# # todo slow
# mixs_slots_accumulator = []
# for c in mixs_class_names:
#     class_induced_slots = mixs_view.class_induced_slots(c)
#     class_induced_slot_names = [i.name for i in class_induced_slots]
#     class_induced_slot_names.sort()
#     mixs_slots_accumulator = mixs_slots_accumulator + class_induced_slot_names
#
# mixs_slots_accumulator_vc = pd.Series(mixs_slots_accumulator).value_counts()
# mixs_slots_exhaustive_names = mixs_slots_accumulator_vc.index
#
# nmdc_class_induced_slots = nmdc_view.class_induced_slots(nmdc_class)
# nmdc_class_induced_slot_names = [i.name for i in nmdc_class_induced_slots]
# nmdc_class_induced_slot_names.sort()

# Soil-NMDC-Template_Compiled
soil_nmdc_template_compiled = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'

# as downloaded
# after XXX auth process in Google Cloud interface...
some_google_auth_file = "/Users/MAM/Downloads/client_secret_770153802425-idc98ogfj1m89csf9a1deotgnfaobkm4.apps.googleusercontent.com.json"

gc = pygsheets.authorize(client_secret=some_google_auth_file)
# creates sheets.googleapis.com-python.json
# SP was expecting a pickle?

sh = gc.open_by_key(soil_nmdc_template_compiled)

# # wk1 = sh[0] Open first worksheet of spreadsheet
# # # Or
# # wk1 = sh.sheet1 # sheet1 is name of first worksheet
#
# # what are the various sheets for?
# # a list of pygsheets.worksheet.Worksheet s
sntc_bookkeeping['sntc_sheets'] = {}
sh_worksheets = sh.worksheets()
for i in sh.worksheets():
    sntc_bookkeeping['sntc_sheets'][i.index] = i.title

# # 2021-12-10:15:40 ET
# # 0: SheetIdentification
# # 1: Terms
# # 2: Terms-EXCLUDE MIxS Soil EXACT Terms
# # 3: MIxS Skip- new terms / term definition unclear
# # 4: MIxS-Skip
# # 5: OtherPackages
# # 6: Sheet7

wk_terms = sh[1]
# how to get col names?

terms_frame = wk_terms.get_as_df()

# sntc_mixs_columns_claimed = terms_frame["mixs_6_slot_name"]
# claimed_mixs_vc = sntc_mixs_columns_claimed.value_counts()
# unique_claimed_mixs_colnames = claimed_mixs_vc.index
#
# # todo none of this takes the associated_packaged column into consideration.
# #   it's just motivated by the presence of the word soil in the title of the Google Sheet
#
# #  compare against exhaustive list of mixs_slots_exhaustive_names
# mixs_claimed_undefined = list(set(list(unique_claimed_mixs_colnames)) - set(mixs_slots_exhaustive_names))
# mixs_claimed_undefined = [i for i in mixs_claimed_undefined if i is not None and i != ""]
# mixs_claimed_undefined.sort()
#
# # todo refactor
# # now compare against list of claimed mixs slot names mixs_class_induced_slot_names
# mixs_class_claimed_only = list(set(list(unique_claimed_mixs_colnames)) - set(mixs_class_induced_slot_names))
# mixs_class_claimed_only = [i for i in mixs_class_claimed_only if i is not None and i != ""]
#
# mixs_claimed_custom_usage = list(set(mixs_class_claimed_only) - set(mixs_claimed_undefined))
# mixs_claimed_custom_usage.sort()
#
# # same thing for bogus nmdc terms
# # todo refactor
# sntc_nmdc_columns_claimed = terms_frame["NMDC_slot_name_schema"]
# claimed_nmdc_vc = sntc_nmdc_columns_claimed.value_counts()
# unique_claimed_nmdc_colnames = claimed_nmdc_vc.index
#
# # mixs or nmdc: authority terms not mentioned in sntc
# mixs_class_slot_omitted = list(set(mixs_class_induced_slot_names) - (
#     set(list(unique_claimed_mixs_colnames)).union(set(list(unique_claimed_mixs_colnames)))))
# mixs_class_slot_omitted.sort()
#
# nmdc_class_slot_omitted = list(set(nmdc_class) - (
#     set(list(unique_claimed_mixs_colnames)).union(set(list(unique_claimed_mixs_colnames)))))
# nmdc_class_slot_omitted.sort()
#
#
# # all authorities: tabulate names within and across
#
# # check for name (or title) x associated package redundancies
#
# # print(terms_frame)
# #
# # print(terms_frame.columns)
#
# # UserWarning: At least one column name in the data frame is an empty string.
# # If this is a concern, please specify include_tailing_empty=False
# # and/or ensure that each column containing data has a name.

# todo add row_ord
# todo add indicator of corresponding LinkML slot,
#   like 'Column Header` <-> title
sntc_bookkeeping['sntc_Terms_cols'] = [str(i) for i in terms_frame.columns]


# # ['', 'Column Header', 'To Do', 'NMDC_slot_name_schema', 'EMSL_slot_Name',
# #        'mixs_6_slot_name', 'Definition', 'Guidance', 'syntax',
# #        'Expected value', 'reqirement status', 'Category',
# #        'Associated Packages', 'Origin', 'Notes', 'GitHub Ticket', 'version',
# #        'Section', 'Example', 'Preferred unit']
#
# # https://medium.com/game-of-data/play-with-google-spreadsheets-with-python-301dd4ee36eb
# # wk1.set_dataframe(df, 'A9')#Inserts df in worksheet starting from A9
# # # Note: set copy_head =False  if you don't want to add first row of df

def get_col_vc(frame_name, col_name):
    col_extract = frame_name[col_name]
    col_vc = col_extract.value_counts()
    return col_vc


def vc_to_infomrative_list(vc, do_sort=True):
    starting_list = list(vc.index)
    informative = [i for i in starting_list if i is not None and i != ""]
    if do_sort:
        informative.sort()
    return informative


def get_col_informative_list(frame_name, col_name, do_sort=True):
    vc = get_col_vc(frame_name, col_name)
    return vc_to_infomrative_list(vc, do_sort=do_sort)


# def get_view_slot_names(view, attributes=True, sort=True):
#     slots = view.all_slots(attributes=attributes)
#     slot_names = [i.name for i in slots]
#     if sort:
#         slot_names.sort()
#     return slot_names


# slow
# necessary? in terms of pulling out more slots
# for mixs,  gets fewer than sv all slots, even with attributes True
def get_slot_usage_counts(view):
    slots_accumulator = []
    classes = view.all_classes()
    class_names = [i for i in classes]
    for c in class_names:
        class_induced_slots = view.class_induced_slots(c)
        class_induced_slot_names = [i.name for i in class_induced_slots]
        class_induced_slot_names.sort()
        slots_accumulator = slots_accumulator + class_induced_slot_names
    vc = pd.Series(slots_accumulator).value_counts()
    return vc


# slow
def get_slot_usage_frame(view):
    slots_accumulator = []
    classes = view.all_classes()
    class_names = [i for i in classes]
    for c in class_names:
        class_induced_slots = view.class_induced_slots(c)
        class_induced_slot_names = [i.name for i in class_induced_slots]
        for name in class_induced_slot_names:
            slots_accumulator.append({"class": c, "slot": name})
    usage_frame = pd.DataFrame(slots_accumulator)
    return usage_frame


def get_slots_for_class(frame, the_class, class_col_name="class", slot_col_name="slot"):
    return frame[slot_col_name].loc[frame[class_col_name].eq(the_class)].tolist()


def get_classes_for_slot(frame, the_slot, class_col_name="class", slot_col_name="slot"):
    return frame[class_col_name].loc[frame[slot_col_name].eq(the_slot)].tolist()


def get_list_diif(a, b):
    return list(set(a) - set(b))


def get_list_intersection(a, b):
    return list(set(a).intersection(set(b)))


def get_list_union(a, b):
    return list(set(a).union(set(b)))


# for auth_name in authority_name_cols:
#     the_vc = get_col_vc(terms_frame, auth_name)
#     il = vc_to_infomrative_list(the_vc)
#
# mvas_with = mixs_view.all_slots(attributes=True)
# # 615
#
# mvas_wo = mixs_view.all_slots(attributes=False)
# # 612
#
# # mv_cum_ind_usage_slots = get_view_slot_names(mixs_view)
#
# msuc = get_slot_usage_counts(mixs_view)
# # 609!
#
# msuf = get_slot_usage_frame(mixs_view)
#
# print(get_slots_for_class(msuf, "soil"))
#
# print(get_classes_for_slot(msuf, "lat_lon"))

claimed_mix_slots = get_col_informative_list(terms_frame, "mixs_6_slot_name", do_sort=True)
claimed_mix_slots.sort()

claimed_nmdc_slots = get_col_informative_list(terms_frame, "NMDC_slot_name_schema", do_sort=True)
claimed_nmdc_slots.sort()

actual_mixs_slots = [i for i in mixs_view.all_slots() if i is not None and i != ""]
actual_mixs_slots.sort()

actual_mixs_soil_slots = [str(i.name) for i in mixs_view.class_induced_slots("soil") if
                          str(i.name) is not None and i != ""]
actual_mixs_soil_slots.sort()

actual_nmdc_biosample_slots = [str(i.name) for i in nmdc_view.class_induced_slots("biosample") if
                               str(i.name) is not None and str(i.name) != ""]

undefined_mixs_slots = get_list_diif(claimed_mix_slots, actual_mixs_slots)
undefined_mixs_slots.sort()
sntc_bookkeeping['undefined_mixs_slots'] = undefined_mixs_slots

# todo add package classes that do include the borrowed term
#   also consult Soil-NMDC-Template_Compiled:Terms:Section
#   like org_nitro
borrowed_mixs_slots = get_list_diif(claimed_mix_slots, actual_mixs_soil_slots)
borrowed_mixs_slots = get_list_diif(borrowed_mixs_slots, undefined_mixs_slots)
borrowed_mixs_slots.sort()
sntc_bookkeeping['borrowed_mixs_slots'] = borrowed_mixs_slots

unused_mixs_soil_slots = get_list_diif(actual_mixs_soil_slots, claimed_mix_slots)
unused_mixs_soil_slots.sort()
sntc_bookkeeping['unused_mixs_soil_slots'] = unused_mixs_soil_slots

# unused_mixs_soil_slots:
# - link_addit_analys ACKNOWLEDGED in "MIxS Terms Skipped" tab
# - pool_dna_extracts ACKNOWLEDGED in "MIxS Terms Skipped" tab
# - store_cond ACKNOWLEDGED in 'MIxS Terms Replaced' row with 'MIxS Term' = "storage conditions (fresh/frozen/other)"
# collection_date see
#   'Terms' row with 'Column Header' = "collection date"
#   'Terms-New Terms' row with 'Column Header' = "collection date"
#   'MIxS Terms Replaced' row with 'MIxS Term' = "collection_date"
# - extreme_salinity NOT MENTIONED VERBATIM ANYWHERE, even 'MIxS Terms Skipped' tab

undefined_nmdc_slots = get_list_diif(claimed_nmdc_slots, actual_nmdc_biosample_slots)
undefined_nmdc_slots.sort()
sntc_bookkeeping['undefined_nmdc_slots'] = undefined_nmdc_slots

# todo does NMDC biosample consider any of these required?
claimed_mixs_nmdc_combo = get_list_union(claimed_mix_slots, claimed_nmdc_slots)
unused_nmdc_biosample_slots = get_list_diif(actual_nmdc_biosample_slots, claimed_mixs_nmdc_combo)
unused_nmdc_biosample_slots.sort()
sntc_bookkeeping['unused_nmdc_biosample_slots'] = unused_nmdc_biosample_slots

no_col_header = terms_frame['Column Header'] is None or terms_frame['Column Header'] == ""
nch_vc = no_col_header.value_counts()
nch_vc_trues = 0
if True in nch_vc.index:
    nch_vc_trues = nch_vc[True]
sntc_bookkeeping['sntc_num_Terms_rows_with_empty_col_head'] = nch_vc_trues

# how many term names (from any authority) are asserted per row?
name_frame = terms_frame[authority_name_cols]
name_frame.index = terms_frame['Column Header']
namearr = name_frame.to_numpy()
nplen = np.vectorize(len)
len_res = (nplen(namearr))
zero_check = len_res > 0
non_zero_row_count = [int(i) for i in np.sum(zero_check, axis=1)]
sntc_npch = dict(zip(terms_frame['Column Header'], non_zero_row_count))
sntc_bookkeeping['stnc_names_per_col_head'] = sntc_npch

sb_yaml = yaml.dump(sntc_bookkeeping)
print("\n\n")
print(sb_yaml)

# Globally Unique ID has two names
#   NMDC_slot_name_schema: EMSL_slot_Name
#   id: unique_ID
# todo see if any names or column headers are used more than once, especially in
#   if used more than one, what packages are associated
print(terms_frame['mixs_6_slot_name'].value_counts())

back_to_dict = terms_frame.to_dict(orient="records")
# print(back_to_dict)

# b2dd = dict(zip())

# todo default prefix and expansion
my_schema = SchemaDefinition(name="Soil-NMDC-Template_Compiled",
                             id="https://docs.google.com/spreadsheets/d/1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0/edit#gid=0")

my_class = ClassDefinition(name="Soil-NMDC-Template_Compiled")

for i in back_to_dict:
    current_sd = None
    # todo set priority for the rare cases when a row has two or more names from authorities
    #   be prepared toa dd more authorities like JGI
    if (i['mixs_6_slot_name'] is None or i['mixs_6_slot_name'] == "") and (
            i['NMDC_slot_name_schema'] is None or i['NMDC_slot_name_schema'] == "") and (
            i['EMSL_slot_Name'] is None or i['EMSL_slot_Name'] == ""):
        print(f"{i['Column Header']} has no recognized authoritative names")
    else:
        if i['mixs_6_slot_name'] is not None and i['mixs_6_slot_name'] != "":
            current_sd = SlotDefinition(name=i['mixs_6_slot_name'])
            # todo shouldn't be hardcoded
            from_auth = mixs_view.induced_slot(str(current_sd.name), 'soil')
            current_sd.slot_uri = from_auth.slot_uri
            current_sd.comments = from_auth.comments
        elif i['NMDC_slot_name_schema'] is not None and i['NMDC_slot_name_schema'] != "":
            current_sd = SlotDefinition(name=i['NMDC_slot_name_schema'])
            # todo shouldn't be hardcoded
            from_auth = nmdc_view.induced_slot(str(current_sd.name), 'biosample')
            current_sd.slot_uri = from_auth.slot_uri
            current_sd.comments = from_auth.comments
        elif i['EMSL_slot_Name'] is not None and i['EMSL_slot_Name'] != "":
            current_sd = SlotDefinition(name=i['EMSL_slot_Name'])
            # todo create a slot uri for EMSL (JGI)
        current_sd.title = i['Column Header']
        # todo make an annotation out of the row_ord ?
        # split on \n ?
        if i['To Do'] is not None and i['To Do'] != "":
            current_sd.todos.append(i['To Do'])
        # todo save previous description as an annotation?
        #   or just handle with merging and interleaving code?
        #   also still need to review tabs other than Terms
        current_sd.description = i['Definition']
        if i['Guidance'] is not None and i['Guidance'] != "":
            current_sd.comments.append(i['Guidance'])
        if i['syntax'] is not None and i['syntax'] != "":
            current_sd.string_serialization = i['syntax']
        # todo Expected value
        #   already in MAM's mixs-source comments
        #   does sntc override?
        #    how does that relate to ranges?
        # todo include a table of these values in the report?
        #   only other value now is "optional"
        #   see also columns XXX...
        if i['requirement status'] == 'required':
            current_sd.required = True
        elif i['requirement status'] == 'recommended':
            current_sd.required = True
        if i['Category'] is not None and i['Category'] != "":
            current_sd.is_a = i['Category']
            my_schema.slots[i['Category']] = SlotDefinition(name=i['Category'])
        # todo Associated Packages
        #   that would actually be an outer loop
        # conforms_to ? (0 or 1 strings) ? owner (deprecated)?
        #   relation with slot uri prefix?
        if i['Origin'] is not None and i['Origin'] != "":
            current_sd.conforms_to = i['Origin']
        if i['Notes'] is not None and i['Notes'] != "":
            current_sd.notes.append(i['Notes'])
        if i['GitHub Ticket'] is not None and i['GitHub Ticket'] != "":
            # todo \n OR \r
            ghts = str(i['GitHub Ticket']).split("\n")
            for ght in ghts:
                current_sd.see_also.append(ght)
        # todo version
        # todo Section
        if i['Example'] is not None and i['Example'] != "":
            current_sd.examples.append(Example(value=i['Example']))
        # todo Preferred unit
        #   already in MAM's mixs-source comments
        #   does sntc override?
        my_schema.slots[current_sd.name] = current_sd
        my_class.slots.append(current_sd.name)

my_schema.classes[str(my_class.name)] = my_class
my_schema.prefixes['stnc'] = Prefix(prefix_prefix="stnc",
                                    prefix_reference="https://docs.google.com/spreadsheets/d/1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0/edit#gid=0/")
my_schema.default_prefix = "stnc"

print(yaml_dumper.dumps(my_schema))

yaml_dumper.dump(my_schema, "sntc.yaml")


# meta_view = SchemaView("../../linkml-model/linkml_model/model/schema/meta.yaml")
# temp = meta_view.class_induced_slots("slot_definition")
# t2 = [i.name for i in temp]
# t2.sort()
# for i in t2:
#     print(i)

# len_acc = []
# max_len = 50
# for i in terms_frame.columns:
#     i_vals = terms_frame[i]
#     print(i)
#     ivvc = i_vals.value_counts()
#     print(ivvc)
#     ivvc_len = len(ivvc.index)
#     len_acc.append(ivvc_len)
#     print(ivvc_len)
#     print("\n")
#
# len_acc.sort()
# print(len_acc)

# tabulate
# syntax, requirement status, Category, Origin, version, Section,

# abstract
# alias
# aliases
# all_members
# all_of
# alt_descriptions
# annotations
# any_of
# apply_to
# broad mappings
# close mappings
# comments
# conforms_to
# created_by
# created_on
# definition_uri
# deprecated
# deprecated element has exact replacement
# deprecated element has possible replacement
# description
# designates_type
# domain
# domain_of
# equals_expression
# equals_number
# equals_string
# equals_string_in
# exact mappings
# exactly_one_of
# examples
# extensions
# from_schema
# has_member
# id_prefixes
# identifier
# ifabsent
# imported_from
# in_subset
# inherited
# inlined
# inlined_as_list
# inverse
# is_a
# is_class_field
# is_usage_slot
# key
# last_updated_on
# local_names
# mappings
# maximum_cardinality
# maximum_value
# minimum_cardinality
# minimum_value
# mixin
# mixins
# modified_by
# multivalued
# name
# narrow mappings
# none_of
# notes
# owner
# pattern
# range
# range_expression
# readonly
# recommended
# related mappings
# required
# role
# see_also
# singular_name
# slot_uri
# status
# string_serialization
# subproperty_of
# symmetric
# title
# todos
# usage_slot_name
# values_from

# sid should really be an uri or curie
def just_exacts(sname: str, sid: str) -> SchemaDefinition:
    sd = SchemaDefinition()
    return sd
