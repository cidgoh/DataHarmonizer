import pandas as pd
import pygsheets
from linkml_runtime.utils.schemaview import SchemaView

pd.options.display.width = 0

mixs_yaml = "mixs-source/model/schema/mixs.yaml"
output_file = "target/mixs_packages_x_slots.tsv"
sntc_id = '1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0'
client_secret_json = "local/client_secret.apps.googleusercontent.com.json"

terms_title = "Terms"
as_is_tab_title = "EXACT MIxS Terms for DH"
new_term_title = "Terms-New Terms"
replaced_term_title = "MIxS Terms Replaced"
skipped_term_tab_title = "MIxS Terms Skipped"

blank_row = {"package": None, "slot": None, "disposition": None}

nmdc_yaml = "nmdc-schema/src/schema/nmdc.yaml"

mixs_view = SchemaView(mixs_yaml)


def get_gsheet_frame(some_google_auth_file, sheet_id, tab_title):
    gc = pygsheets.authorize(client_secret=some_google_auth_file)
    gsheet = gc.open_by_key(sheet_id)
    current_tab = gsheet.worksheet("title", tab_title)
    current_frame = current_tab.get_as_df()
    return current_frame


# I could swear I've already written something like this
def get_package_classes(view: SchemaView):
    # I have observed that the is_a parents of mixs classes are packages
    # also packages don't have mixins
    # also see env_package_enum (hydrocarbon resources-fluids/swabs vs hydrocarbon resources-fluids_swabs)
    parent_classes = set()
    all_classes = view.all_classes()
    all_class_names = [str(k) for k, v in all_classes.items()]
    all_class_names.sort()
    for i in all_class_names:
        current_class = mixs_view.get_class(i)
        parent_classes.add(current_class.is_a)
    parent_classes = list(parent_classes)
    parent_classes = [i for i in parent_classes if i]
    parent_classes.sort()
    return parent_classes


def get_package_slots(view: SchemaView, package, sort=False):
    package_class_slots = view.class_induced_slots(package)
    pcs_names = [i.name for i in package_class_slots]
    if sort:
        pcs_names.sort()
    return pcs_names


def get_packages_x_slots(view, packages):
    row_list = []
    for current_package in packages:
        current_slots = get_package_slots(view, current_package)
        for one_slot in current_slots:
            current_slot_row = blank_row.copy()
            current_slot_row["package"] = current_package
            current_slot_row["slot"] = one_slot
            row_list.append(current_slot_row)
    pxs_frame = pd.DataFrame(row_list)
    return pxs_frame


def package_set_analysis(frame, package, comparison_terms):
    induced_slot_set = set(list(frame['slot'].loc[frame["package"].eq(package)]))
    ct_set = set(comparison_terms)
    comparison_only = ct_set - induced_slot_set
    induced_slots_only = induced_slot_set - ct_set
    term_intersection = induced_slot_set.intersection(ct_set)
    results = {"comparison_only": list(comparison_only), "induced_slots_only": list(induced_slots_only),
               "term_intersection": list(term_intersection)}
    return results


def get_unique_nonblank_col_vals(frame, col, sort=True):
    terms = list(set(list(frame[col])))
    # get rid of blank and non-string values like None
    terms = [i for i in terms if i]
    if sort:
        terms.sort()
    return terms


term_counting = {}

terms_frame = get_gsheet_frame(client_secret_json, sntc_id, terms_title)
term_counting['terms'] = get_unique_nonblank_col_vals(terms_frame, "mixs_6_slot_name")
# terms_mixs_terms = get_unique_nonblank_col_vals(terms_frame, "mixs_6_slot_name")
# print(terms_mixs_terms)

as_is_frame = get_gsheet_frame(client_secret_json, sntc_id, as_is_tab_title)
term_counting['exact'] = get_unique_nonblank_col_vals(as_is_frame, "mixs_6_slot_name")
# as_is_terms = get_unique_nonblank_col_vals(as_is_frame, "mixs_6_slot_name")
# print(as_is_terms)

new_term_frame = get_gsheet_frame(client_secret_json, sntc_id, new_term_title)
term_counting['new'] = get_unique_nonblank_col_vals(new_term_frame, "mixs_6_slot_name")
# new_terms = get_unique_nonblank_col_vals(new_term_frame, "mixs_6_slot_name")
# print(new_terms)

replaced_term_frame = get_gsheet_frame(client_secret_json, sntc_id, replaced_term_title)
term_counting['replaced'] = get_unique_nonblank_col_vals(replaced_term_frame, "mixs_6_slot_name")
# replaced_terms = get_unique_nonblank_col_vals(replaced_term_frame, "mixs_6_slot_name")
# print(replaced_terms)

skipped_frame = get_gsheet_frame(client_secret_json, sntc_id, skipped_term_tab_title)
term_counting['skipped'] = get_unique_nonblank_col_vals(skipped_frame, "mixs_6_slot_name")
# skipped_terms = get_unique_nonblank_col_vals(skipped_frame, "mixs_6_slot_name")
# print(skipped_terms)

counting_frame_list = []
for k, v in term_counting.items():
    df = pd.DataFrame(v, columns=["term"])
    df['tab'] = k
    counting_frame_list.append(df)

counting_frame = pd.concat(counting_frame_list)
counting_frame.to_csv("counting_frame.tsv", sep="\t", index=False)

exclude_terms_terms_frame = counting_frame.loc[~ counting_frame['tab'].eq('terms')]
only_terms_terms_frame = counting_frame.loc[counting_frame['tab'].eq('terms')]
only_skip_terms_frame = counting_frame.loc[counting_frame['tab'].eq('skipped')]

# looks like no terms are repeated across as-is/exact, rew, replaced and skipped
# make it a test?
ett_vc = exclude_terms_terms_frame['term'].value_counts()
ett_vc_max = max(ett_vc)
print(ett_vc_max)
ett_vc_labels = list(ett_vc.index)

# ott_vc = only_terms_terms_frame['term'].value_counts()
# ott_vc_max = max(ott_vc)
# print(ott_vc_max)
# ott_vc_labels = list(ott_vc.index)
ott_vc_labels = counting_frame['term'].loc[counting_frame['tab'].eq('terms')]
stt_vc_labels = counting_frame['term'].loc[counting_frame['tab'].eq('skipped')]

ott_only = list(set(ott_vc_labels) - set(ett_vc_labels))
ott_only.sort()
print(ott_only)

# want ett only = ett - ott - skipped terms

ett_only = list(set(ett_vc_labels) - set(ott_vc_labels) - set(stt_vc_labels))
ett_only.sort()
print(ett_only)

# ----

package_classes = get_package_classes(mixs_view)

packages_x_slots = get_packages_x_slots(mixs_view, package_classes)

skippeds_vs_soil = package_set_analysis(packages_x_slots, "soil", list(skipped_frame["mixs_6_slot_name"]))

as_is_vs_soil = package_set_analysis(packages_x_slots, "soil", list(as_is_frame["mixs_6_slot_name"]))

valid_soil_skips = skippeds_vs_soil["term_intersection"]
valid_soil_skips.sort()

extra_soil_skips = skippeds_vs_soil["comparison_only"]
extra_soil_skips.sort()

valid_soil_as_is = as_is_vs_soil["term_intersection"]
valid_soil_as_is.sort()

bogus_soil_as_is = as_is_vs_soil["comparison_only"]
bogus_soil_as_is.sort()

soil_non_as_is = as_is_vs_soil["induced_slots_only"]

soil_skip_reiterated = list(set(valid_soil_skips).intersection(set(soil_non_as_is)))
soil_skip_reiterated.sort()
# print(soil_skip_reiterated)

soil_non_as_is_non_skip = list(set(soil_non_as_is) - set(valid_soil_skips))
soil_non_as_is_non_skip.sort()
# print(soil_non_as_is_non_skip)


packages_x_slots["disposition"].loc[
    packages_x_slots["package"].eq("soil") & packages_x_slots["slot"].isin(valid_soil_skips)] = "skip"

# this means use the slot as defined by mixs for the specified package
packages_x_slots["disposition"].loc[
    packages_x_slots["package"].eq("soil") & packages_x_slots["slot"].isin(valid_soil_as_is)] = "use as-is"

accounted_for = list(packages_x_slots["slot"].loc[packages_x_slots["package"].eq("soil")])

Terms_extras = term_counting['terms']
Terms_extras.sort()

# includes bogus_soil_as_is source_mat_id and experimental_factor
#   because they don't come from the environment section or core terms
# includes bogus_soil_as_is org_matter because it's not assigned to the soil package
all_extras = list(set(Terms_extras).union(set(bogus_soil_as_is)))
all_extras.sort()
all_extras_rows = []
for i in all_extras:
    current_row = blank_row.copy()
    current_row["package"] = "soil"
    current_row["slot"] = i
    current_row["disposition"] = "borrowed"
    all_extras_rows.append(current_row)
all_extras_frame = pd.DataFrame(all_extras_rows)
packages_x_slots = packages_x_slots.append(all_extras_frame, ignore_index=True)

# REFACTOR
extra_soil_skip_rows = []
for i in extra_soil_skips:
    current_row = blank_row.copy()
    current_row["package"] = "soil"
    current_row["slot"] = i
    current_row["disposition"] = "verbose skip"
    extra_soil_skip_rows.append(current_row)
extra_soil_skip_frame = pd.DataFrame(extra_soil_skip_rows)
packages_x_slots = packages_x_slots.append(extra_soil_skip_frame, ignore_index=True)

packages_x_slots = packages_x_slots.sort_values(["package", "slot"], ascending=(True, True))

no_disposition = packages_x_slots.loc[packages_x_slots["package"].eq("soil") & packages_x_slots["disposition"].isna()]
print(no_disposition)

mixs_slots = mixs_view.all_slots()
mixs_slots = [str(k) for k, v in mixs_slots.items()]

mixs_undefined = set(all_extras) - set(mixs_slots)
print(len(mixs_undefined))

skipped_frame["package"] = "soil"
merged = pd.merge(packages_x_slots, skipped_frame, how="left", left_on=["package", "slot"],
                  right_on=["package", "mixs_6_slot_name"])
merged.drop(['MIxS Term', 'definition', 'section', 'mixs_6_slot_name'], axis=1, inplace=True)

as_is_frame["package"] = "soil"
# aren't these Column Headers already in the Terms tab?
merged = pd.merge(merged, as_is_frame, how="left", left_on=["package", "slot"],
                  right_on=["package", "mixs_6_slot_name"])
merged.drop(['Order', 'NMDC_slot_name_schema', 'EMSL_slot_Name', 'mixs_6_slot_name'], axis=1, inplace=True)

merged.to_csv(output_file, sep="\t", index=False)

# # ----
#
# # # keeping for documentation
# # # probably won't need to be run again
# # terms_headers = terms_frame.loc[terms_frame["mixs_6_slot_name"].isin(terms_mixs_terms)]
# # terms_headers = terms_headers[['mixs_6_slot_name', 'Column Header']]
# #
# # merged_headers = merged.loc[merged['package'].eq('soil')]
# # merged_headers = merged_headers[['slot', 'Column Header']]
# #
# # header_check = pd.merge(merged_headers, terms_headers, how="left", left_on=["slot"], right_on=["mixs_6_slot_name"],
# #                         suffixes=('_pxs', '_terms'))
# # header_check.drop(['mixs_6_slot_name'], axis=1, inplace=True)
# #
# # header_check['pxs_safe'] = header_check['Column Header_pxs'] == header_check['Column Header_terms']
# # header_check['pxs_safe'].loc[header_check['Column Header_pxs'].isna()] = True
# #
# # header_check.to_csv("header_check.tsv", sep="\t", index=False)
#
#
# # ----


# nmdc_yaml = "nmdc-schema/src/schema/nmdc.yaml"
#
# nmdc_view = SchemaView(nmdc_yaml)
#
# biosample_slots = nmdc_view.class_induced_slots("biosample")
# biosample_slot_names = [i.name for i in biosample_slots]
# # print(biosample_slot_names)
#
# x = biosample_slots[0]
#
# biosample_slot_dict = dict(zip(biosample_slot_names, biosample_slots))
# biosample_slot_names.sort()
#
# row_dict = {'name': None, 'slot_uri': None, 'from_schema': None, 'required': None, 'identifier': None,
#             'description': None}
# row_list = []
# for i in biosample_slot_names:
#     print(i)
#     current_slot = biosample_slot_dict[i]
#     current_row = row_dict.copy()
#     for k, v in row_dict.items():
#         current_row[k] = current_slot[k]
#     row_list.append(current_row)
#
# biosample_slot_frame = pd.DataFrame(row_list)
#
# # print(biosample_slot_frame)
#
# biosample_slot_frame.to_csv("biosample_slot_frame.tsv", sep="\t", index=False)
