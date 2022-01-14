from itertools import dropwhile

import pandas as pd
import pygsheets
import pytest
from linkml.generators.yamlgen import YAMLGenerator
from linkml_runtime.dumpers import yaml_dumper
from linkml_runtime.linkml_model import ClassDefinition
from linkml_runtime.utils.schemaview import SchemaView

import linkml_round_trips.old.just_exacts as je

import pprint

# what is the spirit of these tests, especially the following which are failing
# test_sntc_missing_soil_slots
# test_multi_mentioned_mixs
# test_just_exacts_schema

# no slot name (or title?) should appear more than once on any of the actionable tabs
# mixs_modified_slots
# biosample_identification_slots
# nmdc_biosample_slots
# EMSL_sample_slots
# JGI_sample_slots

# all mixs soil slots (and all nmdc biosample slots?) should be accounted for
# remember that mixs-source only include environmental core terms in its core terms

# also check
# enumerations



# where to put these configuration values?
mixs_yaml = "mixs-source/model/schema/mixs.yaml"
sntc_id = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'
client_secret_json = "local/client_secret.apps.googleusercontent.com.json"

expected_tab_dict = {0: 'SheetIdentification',
                     1: 'Terms',
                     2: 'Terms-New Terms',
                     3: 'Example Use',
                     4: 'OtherPackages',
                     5: 'JGI Terms',
                     6: 'mixs_packages_x_slots',
                     7: 'mixs_modified_slots',
                     8: 'biosample_identification_slots',
                     9: 'nmdc_biosample_slots',
                     10: 'EMSL_sample_slots',
                     11: 'JGI_sample_slots',
                     12: 'enumerations'}

expected_Terms_col_names = ['row_ord', 'Column Header', 'To Do', 'NMDC_slot_name_schema', 'EMSL_slot_Name',
                            'mixs_6_slot_name', 'Definition', 'Guidance', 'syntax', 'Expected value',
                            'requirement status', 'Category', 'Associated Packages', 'Origin', 'Notes',
                            'GitHub Ticket', 'version', 'Section', 'Example', 'Preferred unit']

# order matters
expected_mixs_soil_ind_slot_names = ['lat_lon', 'depth', 'alt', 'elev', 'temp', 'geo_loc_name', 'collection_date',
                                     'env_broad_scale', 'env_local_scale', 'env_medium', 'cur_land_use',
                                     'cur_vegetation', 'cur_vegetation_meth', 'previous_land_use', 'prev_land_use_meth',
                                     'crop_rotation', 'agrochem_addition', 'tillage', 'fire', 'flooding',
                                     'extreme_event', 'soil_horizon', 'horizon_meth', 'sieving', 'water_content',
                                     'water_cont_soil_meth', 'pool_dna_extracts', 'store_cond', 'link_climate_info',
                                     'annual_temp', 'season_temp', 'annual_precpt', 'season_precpt', 'link_class_info',
                                     'fao_class', 'local_class', 'local_class_meth', 'soil_type', 'soil_type_meth',
                                     'slope_gradient', 'slope_aspect', 'profile_position', 'drainage_class',
                                     'soil_text_measure', 'soil_texture_meth', 'ph', 'ph_meth', 'tot_org_carb',
                                     'tot_org_c_meth', 'tot_nitro_content', 'tot_nitro_cont_meth', 'microbial_biomass',
                                     'micro_biomass_meth', 'link_addit_analys', 'extreme_salinity', 'salinity_meth',
                                     'heavy_metals', 'heavy_metals_meth', 'al_sat', 'al_sat_meth', 'misc_param']


@pytest.fixture(scope="module")
def sntc_gsheet():
    soil_nmdc_template_compiled = sntc_id
    some_google_auth_file = client_secret_json
    gc = pygsheets.authorize(client_secret=some_google_auth_file)
    sh = gc.open_by_key(soil_nmdc_template_compiled)
    return sh


@pytest.fixture(scope="module")
def Terms_tab(sntc_gsheet):
    Terms_tab = sntc_gsheet.worksheet("title", 'Terms')
    return Terms_tab


@pytest.fixture(scope="module")
def Terms_frame(Terms_tab):
    Terms_frame = Terms_tab.get_as_df()
    return Terms_frame


@pytest.fixture(scope="module")
def SI_tab(sntc_gsheet):
    SI_tab = sntc_gsheet.worksheet("title", 'SheetIdentification')
    return SI_tab


@pytest.fixture(scope="module")
def SI_frame(SI_tab):
    SI_frame = SI_tab.get_as_df()
    return SI_frame


@pytest.fixture(scope="module")
def Terms_ch(Terms_tab):
    Terms_frame = Terms_tab.get_as_df()
    ch_col = Terms_frame['Column Header']
    return ch_col


# allow arbitrary column name in a fixture?
@pytest.fixture(scope="module")
def Terms_mixs(Terms_tab):
    Terms_frame = Terms_tab.get_as_df()
    col_contents = Terms_frame['mixs_6_slot_name']
    return col_contents


@pytest.fixture(scope="module")
def mixs_view():
    mv = SchemaView(mixs_yaml)
    return mv


@pytest.fixture(scope="module")
def mixs_soil_ind_slot_names(mixs_view):
    ind_slots = mixs_view.class_induced_slots("soil")
    ind_slot_names = [i.name for i in ind_slots]
    return ind_slot_names


def get_list_diif(a, b):
    return list(set(a) - set(b))


def get_list_intersection(a, b):
    return list(set(a).intersection(set(b)))


def get_list_union(a, b):
    return list(set(a).union(set(b)))


def informative_check(string_to_test):
    is_informative = string_to_test is not None and string_to_test != ""
    return is_informative


# def make_informative_list(raw_list):
#     informative = [i for i in raw_list if informative_check(i)]
#     return informative


def get_informative_list(raw_list):
    informative = [i for i in raw_list if informative_check(i)]
    return informative


# no error handling yet
def get_tab(sntc_gsheet, selected_tab):
    selected_tab = sntc_gsheet.worksheet("title", selected_tab)
    return selected_tab


# no error handling yet
def get_tab_col(sntc_gsheet, selected_tab, selected_col):
    selected_tab = get_tab(sntc_gsheet, selected_tab)
    selected_frame = selected_tab.get_as_df()
    selected_col = selected_frame[selected_col]
    return selected_col


def get_informative_from_tab_col(sntc_gsheet, selected_tab, selected_col):
    raw_series = get_tab_col(sntc_gsheet, selected_tab, selected_col)
    raw_list = list(raw_series)
    informative_list = get_informative_list(raw_list)
    return informative_list


def get_mixs_class_induced_slot_names(mixs_view, package_class_name):
    ind_slots = mixs_view.class_induced_slots(package_class_name)
    ind_slot_names = [i.name for i in ind_slots]
    return ind_slot_names


def get_mixs_all_slots(mixs_view):
    slots = mixs_view.all_slots()
    slotnames = [str(k) for k, v in slots.items()]
    return slotnames


# has there been any change in the
#   titles or indices of the soil_nmdc_template_compiled tabs?
# order within expected dict shouldn't matter
def test_tab_title_indices(sntc_gsheet):
    sh_tabs = sntc_gsheet.worksheets()
    obs_tab_dict = {tab.index: tab.title for tab in sh_tabs}
    # pprint.pprint(obs_tab_dict)
    # pprint.pprint(expected_tab_dict)
    assert obs_tab_dict == expected_tab_dict


def test_SI_vs_expected(SI_frame):
    documented = dict(zip(list(SI_frame.index), list(SI_frame['sheet_name'])))
    assert documented == expected_tab_dict


# # Moot
# # no longer processing the Terms tab
# def test_Terms_columns(Terms_tab):
#     Terms_mat = Terms_tab.get_all_values(returnas='matrix')
#     expected = expected_Terms_col_names
#     expected_count = len(expected)
#     row1 = Terms_mat[0][0:expected_count]
#     # there may be trailing empty strings
#     # https://www.geeksforgeeks.org/python-remove-trailing-empty-elements-from-given-list/
#     blank_trunc = list(reversed(tuple(dropwhile(lambda x: x == "", reversed(row1)))))
#     assert blank_trunc == expected


# are there any rows in the Terms tab with an empty 'Column Header'
#   should apply to any named column form any named tab
def test_empty_Terms_ch(Terms_ch):
    blank_count = (Terms_ch == "").sum()
    assert blank_count == 0


# are any 'Column Header' values in the Terms tab repeated?
def test_repeated_Term_ch(Terms_ch):
    ch_vc = Terms_ch.value_counts()
    dupes = ch_vc[ch_vc.gt(1)]
    assert len(dupes) == 0


def test_mixs_soil_ind_slot_names(mixs_view):
    ind_slots = mixs_view.class_induced_slots("soil")
    ind_slot_names = [i.name for i in ind_slots]
    assert ind_slot_names == expected_mixs_soil_ind_slot_names


# todo ultimately, SNTC should be seen as describing all package classes,
#   via Terms-> Associated Packages
#   in that case, the static, (soil-oriented?) MIxS Terms Skipped and MIxS Terms Replaced
#   might not be useful

# todo rewrite for new actionable tabs
# # semi-problematic:
# # - store_cond ACKNOWLEDGED in 'MIxS Terms Replaced' row with 'MIxS Term' = "storage conditions (fresh/frozen/other)"
# # collection_date see
# #   'Terms' row with 'Column Header' = "collection date"
# #   'Terms-New Terms' row with 'Column Header' = "collection date"
# #   'MIxS Terms Replaced' row with 'MIxS Term' = "collection_date"
# def test_sntc_missing_soil_slots(sntc_gsheet, mixs_soil_ind_slot_names, mixs_view, Terms_mixs):
#     # sntc_gsheet = raw google sheet object, not data frame
#     # mixs_soil_ind_slot_names = names of soil's induced slots
#     # mixs_view = raw SchemaView
#     # Terms_mixs =Terms_frame['mixs_6_slot_name']... a series
#     pprint.pprint("\n")
#     pprint.pprint(Terms_mixs)
#     # pprint.pprint(mixs_soil_ind_slot_names)
#     from_Terms = get_informative_from_tab_col(sntc_gsheet, selected_tab="Terms", selected_col="mixs_6_slot_name")
#     from_skipped = get_informative_from_tab_col(sntc_gsheet, selected_tab="MIxS Terms Skipped",
#                                                 selected_col="mixs_6_slot_name")
#     from_replaced = get_informative_from_tab_col(sntc_gsheet, selected_tab="MIxS Terms Replaced",
#                                                  selected_col="mixs_6_slot_name")
#     from_either = get_list_union(from_Terms, get_list_union(from_skipped, from_replaced))
#     from_mixs_soil = get_mixs_class_induced_slot_names(mixs_view, 'soil')
#     sntc_missings = get_list_diif(from_mixs_soil, from_either)
#     assert sntc_missings == []


# does SNTC claim any slots that aren't defined for any package class?
def test_undefined_mixs_slots(sntc_gsheet, mixs_view):
    from_mixs = get_mixs_all_slots(mixs_view)
    from_Terms = get_informative_from_tab_col(sntc_gsheet, selected_tab="Terms", selected_col="mixs_6_slot_name")
    sntc_undefineds = get_list_diif(from_Terms, from_mixs)
    assert sntc_undefineds == []


# todo rewrite for new actionable tabs
# # do any mixs terms appear in more than one of
# #   Terms, MIxS Terms Skipped, MIxS Terms Replaced
# # what about 'EXACT MIxS Terms for DH' and Terms-New Terms'
# # yes, samp_vol_we_dna_ext appear twice in MIxS Terms Skipped
# def test_multi_mentioned_mixs(sntc_gsheet):
#     from_Terms = get_informative_from_tab_col(sntc_gsheet, selected_tab="Terms", selected_col="mixs_6_slot_name")
#     from_skipped = get_informative_from_tab_col(sntc_gsheet, selected_tab="MIxS Terms Skipped",
#                                                 selected_col="mixs_6_slot_name")
#     from_replaced = get_informative_from_tab_col(sntc_gsheet, selected_tab="MIxS Terms Replaced",
#                                                  selected_col="mixs_6_slot_name")
#     aggregated = pd.Series(from_Terms + from_skipped + from_replaced).value_counts()
#     print("\n")
#     print(aggregated)
#     # max should be 1

# todo rewrite for new actionable tabs
# # this illustrates the simplest case of making a subset schema
# #   based on mixs terms, to be used as-is, from the SNTC
# def test_just_exacts_schema(mixs_view, sntc_gsheet):
#     sntc_name = "sntc"
#     sntc_id = "http://example.com/sntc"
#     sntc_class = ClassDefinition(name=sntc_name)
#     sntc_scd = je.bootstrap_schema(sname=sntc_name, sid=sntc_id, def_pref=sntc_name, def_expansion=f"{sntc_id}/")
#     sntc_scd.classes[sntc_name] = sntc_class
#
#     as_exacts = get_informative_from_tab_col(sntc_gsheet, selected_tab="EXACT MIxS Terms for DH",
#                                              selected_col="mixs_6_slot_name")
#
#     current_resolver = je.DependencyResolver(
#         schema_files=["mixs-source/model/schema/mixs.yaml", "nmdc-schema/src/schema/nmdc.yaml"])
#
#     for claimed_exact in as_exacts:
#         # todo no error handling yet
#         exact_result = mixs_view.induced_slot(claimed_exact, 'soil')
#         sntc_scd.slots[claimed_exact] = exact_result
#         sntc_scd.classes[sntc_name].slots.append(claimed_exact)
#         current_resolver.add_pending_slot(claimed_exact)
#
#     current_resolver.add_pending_range("soil")
#     current_resolver.resolve_dependencies()
#     with_dependencies = current_resolver.merge_dependencies(sntc_scd, "MIxS")
#
#     scd_yaml = yaml_dumper.dumps(with_dependencies)
#     # print(scd_yaml)
#
#     yaml_dumper.dump(with_dependencies, "target/test_sntc.yaml")
#     validity_check = YAMLGenerator(scd_yaml)
#     assert validity_check

# next test: creating DH TSV
