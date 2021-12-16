from linkml_runtime.utils.schemaview import SchemaView
import pandas as pd

import click

import logging
import click_log

import urllib.parse

# todo add logger
logger = logging.getLogger(__name__)
click_log.basic_config(logger)


# ordering of sections
# ordering of columns within sections
# id column and it's section should be first
# inferred from identifier attribute

# OK? don't use : as separator in "Ontology ID" if prefix ends with /
# OK? when adding a pattern to "guidance": don't use " | " separator if guidance (comments) is already empty
# OK ? give diagnostic printouts some labels or context

# todo: my quantity_value_pattern "^\d*\.?\d*\s\S*$" is not identical to the pattern \d+[.\d+] \S+
# include option to trust regex patterns from slot's pattern attribute?
# MIxS patterns aren't regexes (right?)

# todo labels (from titles) should be human friendly
#   prefer MIxS label even if slot isn't used in claimed class?
#     but this may be happening in script interleave_classes


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_yaml', type=click.Path(exists=True), help="LinkML YAML input")
@click.option('--tsv_out', type=click.Path(), default="target/data.tsv", show_default=True,
              help="DH template output")
@click.option('--model_class', required=True, help="Which class' slots should become DH columns?")
@click.option('--default_section', default="unknown section", show_default=True,
              help="Put slots with no is_a parent into this DH section")
# add support for other kinds of section inference
@click.option('--default_data_status', default="", show_default=True,
              help="See https://github.com/cidgoh/DataHarmonizer/wiki/DataHarmonizer-Templates. Generally left blank.")
@click.option('--default_capitalize', default="", show_default=True,
              help="See https://github.com/cidgoh/DataHarmonizer/wiki/DataHarmonizer-Templates. Generally left blank.")
@click.option('--default_source', default="", show_default=True,
              help="See https://github.com/cidgoh/DataHarmonizer/wiki/DataHarmonizer-Templates. Generally left blank.")
# where can patterns be found in the LinkML model? Can they be trusted as regex?
# explain relationship between LinkML comments and DH guidance (which can be provided as a LinkML annotation)
@click.option('--add_pattern_to_guidance', is_flag=True,
              help="Should LinkML pattern values be added to the DH guidance?")
@click.option('--patterns_are_regexes', is_flag=True,
              help="LinkML doesn't enforce pattern values as regexes. e.g. MIxS uses non-regex notation.")
def linkml_to_dh_no_annotations(model_yaml, tsv_out, model_class, default_section, default_data_status,
                                default_capitalize, default_source, add_pattern_to_guidance, patterns_are_regexes):
    # some mappings aren't direct. see "indirect mappings below"
    dh_to_linkml_direct = {"min value": "minimum_value", "max value": "maximum_value", "description": "description",
                           "EXPORT_dev": "name"}

    # more columns, like other exports, could be added
    dht_column_order = ["Ontology ID", "label", "parent class", "description", "guidance", "datatype", "pattern",
                        "requirement", "examples", "source", "capitalize", "data status", "max value", "min value",
                        "EXPORT_dev"]

    # would be nice to make these patterns specific for particular units
    # see also the syntax slot
    quantity_value_pattern = "^\d*\.?\d*\s\S*$"

    # How to also consult NMDC slots and requirements etc.?

    def print_list(the_list):
        for i in the_list:
            logger.info(i)
        logger.info('\n')

    # ---

    blank_row = dh_to_linkml_direct.copy()
    for k, v in blank_row.items():
        blank_row[k] = ""
        # or None?

    # add more validity checks
    linkml_to_dh_direct = {v: k for k, v in dh_to_linkml_direct.items() if v != "" and v is not None}
    dh_mapped_cols = [v for k, v in linkml_to_dh_direct.items()]
    dh_mapped_cols.sort()

    model_view = SchemaView(model_yaml)

    temp = len(model_view.schema.default_prefix)
    if model_view.schema.default_prefix[temp - 1] == "/":
        model_def_pref = model_view.schema.default_prefix
    else:
        model_def_pref = model_view.schema.default_prefix + ":"

    model_class_slots = model_view.class_induced_slots(model_class)

    model_class_slot_names = [i['name'] for i in model_class_slots]

    model_class_slot_dict = dict(zip(model_class_slot_names, model_class_slots))

    model_class_slot_names.sort()

    model_enums = model_view.all_enums()
    model_enum_names = list(model_enums.keys())
    model_enum_names.sort()

    range_tally = []
    pattern_tally = []
    filled_row_list = []
    model_parents = set()
    dh_selectors = []
    for i in model_class_slot_names:
        # logger.info(i)
        filled_row = blank_row.copy()
        for j in dh_mapped_cols:
            current_linkml_term = dh_to_linkml_direct[j]
            filled_row[j] = model_class_slot_dict[i][current_linkml_term]
        # indirect mappings below
        # "parent class": "is_a",
        if model_class_slot_dict[i].is_a != "" and model_class_slot_dict[i].is_a is not None:
            filled_row["parent class"] = model_class_slot_dict[i].is_a
        else:
            filled_row["parent class"] = default_section
        # Ontology ID: slot_uri if available
        if model_class_slot_dict[i].slot_uri != "" and model_class_slot_dict[i].slot_uri is not None:
            filled_row["Ontology ID"] = model_class_slot_dict[i].slot_uri
        else:
            # TODO don't use colon separator if model_def_pref is a URI using / separators
            # todo urlencode
            filled_row["Ontology ID"] = f"{model_def_pref}{urllib.parse.quote(model_class_slot_dict[i].name)}"
        # label: title if available
        if model_class_slot_dict[i].title != "" and model_class_slot_dict[i].title is not None:
            filled_row["label"] = model_class_slot_dict[i].title
        else:
            filled_row["label"] = model_class_slot_dict[i].name
        # join comments as guidance
        comments_list = model_class_slot_dict[i].comments
        comments_string = " | ".join(comments_list)
        if add_pattern_to_guidance:
            if model_class_slot_dict[i].pattern is not None:
                # todo don't include " | " if comments string is empty to start with
                if comments_string == "" or comments_string is None:
                    comments_string = model_class_slot_dict[i].pattern
                else:
                    comments_string = comments_string + f" | pattern: {model_class_slot_dict[i].pattern}"
                pattern_tally.append(model_class_slot_dict[i].pattern)
        filled_row["guidance"] = comments_string
        # join examples values as examples
        examples_source = [i for i in model_class_slot_dict[i].examples]
        examples_list = []
        for x in examples_source:
            examples_list.append(x.value)
        examples_string = " | ".join(examples_list)
        filled_row["examples"] = examples_string
        # consider BOTH LinkML recommended and required for DH requirement
        if model_class_slot_dict[i].recommended:
            filled_row["requirement"] = "recommended"
        if model_class_slot_dict[i].required:
            filled_row["requirement"] = "required"
        # types
        # todo set up a data structure to track these rules
        # check model's default range?
        if model_class_slot_dict[i].range != "quantity value":
            filled_row["datatype"] = "xs:token"
        else:
            # what if the pattern value really is a pattern, as opposed to a MIxS syntax
            filled_row["pattern"] = quantity_value_pattern
        if model_class_slot_dict[i].identifier:
            filled_row["datatype"] = "xs:unique"
        if model_class_slot_dict[i].range == "date":
            filled_row["datatype"] = "xs:date"
        if model_class_slot_dict[i].range == "double":
            filled_row["datatype"] = "xs:decimal"
        if model_class_slot_dict[i].range in model_enum_names:
            current_enum = model_enums[model_class_slot_dict[i].range]
            # don't forget to indent
            # and lookup meanings
            current_permissibles = current_enum.permissible_values
            current_selector = {"name": model_class_slot_dict[i].title, "pvs": current_permissibles}
            dh_selectors.append(current_selector)
            if model_class_slot_dict[i].multivalued:
                filled_row["datatype"] = "multiple"
            else:
                filled_row["datatype"] = "select"
        range_tally.append(model_class_slot_dict[i].range)
        # todo elaborate on data status and capitalize
        filled_row["data status"] = default_data_status
        filled_row["capitalize"] = default_capitalize
        filled_row["source"] = default_source
        filled_row_list.append(filled_row)

        if model_class_slot_dict[i].is_a != "" and model_class_slot_dict[i].is_a is not None:
            model_parents.add(model_class_slot_dict[i].is_a)
        else:
            model_parents.add(default_section)

    model_parents = list(model_parents)
    # how do we know what order to put the sections and slots/columns in without user input?
    model_parents.sort()
    parent_rows = []
    logger.info("\n")
    logger.info("Inferred DH sections:")
    for i in model_parents:
        current_parent = blank_row.copy()
        current_parent["label"] = i
        parent_rows.append(current_parent)
        logger.info("  " + i)
    logger.info("\n")

    selector_rows = []
    for i in dh_selectors:
        current_selctions = list(i['pvs'].keys())
        current_selctions.sort()
        for j in current_selctions:
            current_row = blank_row.copy()
            # parent class should be a title not a name
            current_row['parent class'] = i['name']
            current_row['label'] = j
            selector_rows.append(current_row)

    selector_frame = pd.DataFrame(selector_rows)

    parent_frame = pd.DataFrame(parent_rows)

    columns_frame = pd.DataFrame(filled_row_list)
    columns_frame.drop_duplicates(inplace=True)

    filled_frame = pd.concat([parent_frame, columns_frame, selector_frame])

    logger.info("DH template excerpt:")
    logger.info(filled_frame)
    logger.info("\n")

    logger.info("Tally of ranges from the utilized slots->DH columns:")
    logger.info(pd.Series(range_tally).value_counts())
    logger.info("\n")

    # check list patterns against enumeration PVs
    # may only want to look at those with a count of more than 1 here
    # then can work on regex patterns
    pattern_vc = pd.Series(pattern_tally).value_counts()
    pattern_vc = pattern_vc[pattern_vc > 1]

    logger.info("Tally of patterns (appearing at least twice) from the utilized slots->DH columns:")
    logger.info(pattern_vc)
    logger.info("\n")

    filled_frame = filled_frame[dht_column_order]

    filled_frame.to_csv(tsv_out, sep="\t", index=False)


if __name__ == '__main__':
    linkml_to_dh_no_annotations()

# https://github.com/cidgoh/DataHarmonizer/wiki/DataHarmonizer-Templates
# DONE #
#
# requirement
#     Indicates data entry recommended or required status for field,
#         which also controls colour coding and visibility options of column header
#         Options: "required" (header shown in yellow) or "recommended" (header shown in purple).
#           RULE: recommended = True -> recommended
#           RULE: required = True -> required
#
# IN PROGRESS #
#
# datatype
#   ANY LINKML SCHEMA CAN DEFINE ITS OWN TYPES!
#     xs:token
#       An XML string
#       MAKE THIS THE DEFAULT
#     xs:unique
#       A xs:token which should be unique in a dataset. Good for validating sample identifiers for example
#       APPLY TO SLOT WITH identifier = True
#     xs:date
#       An XML date
#     select
#       A field with a pulldown menu of selection options. This will appear as a hierarchy
#         if each selection option listed later in sheet has a parent term in the same list.
#           APPLY WHEN THE RANGE IS IN THE LIST OF ENUMS
#     multiple
#       A field with a popup menu allowing multiple selection/deselection of items in a given hierarchy of terms.
#     xs:nonNegativeInteger
#       An integer >= 0
#     xs:decimal
#       A decimal number
#     provenance
#       Marks a field that when Validated, automatically receives a prefix of "DataHarmonizer provenance: vX.Y.Z"
#         in addition to its existing content.
#
# EXPORT_[export format keyword]
#
# pattern
#
# TODO #
#
# LOW PRIORITY? #
# but still required?
# data status
#   A customizable list of additional metadata select options to include with given (select or numeric or text)
#     input field to indicate if a value was missing, not collected, etc. Format: semicolon separated list of options.
#     Options are also displayed in column help info.
#
# capitalize
#   On data entry or validation, capitalize field content according to setting.
#     Leaves text unchanged when no value is provided. Options: lower / UPPER / Title
