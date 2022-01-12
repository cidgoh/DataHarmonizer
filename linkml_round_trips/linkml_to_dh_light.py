from linkml_runtime.utils.schemaview import SchemaView
import pandas as pd
import re

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--selected_class', required=True)
@click.option('--default_section', default="default", show_default=True)
@click.option('--default_source', default="", show_default=True)
@click.option('--default_capitalize', default="", show_default=True)
# @click.option('--default_data_status', default="default", show_default=True)
@click.option('--default_data_status', default="", show_default=True)
@click.option('--output_file', type=click.Path(), default="target/data.tsv", show_default=True)
def linkml_to_dh_light(model_file, selected_class, default_section, default_source, default_capitalize,
                       default_data_status, output_file):
    dht_column_order = ["Ontology ID", "label", "parent class", "description", "guidance", "datatype", "pattern",
                        "requirement", "examples", "source", "capitalize", "data status", "max value", "min value",
                        "EXPORT_dev"]

    # see https://github.com/microbiomedata/DataHarmonizer/issues/24
    #   for snapshots of tally results
    # wrap in ^ and $?
    range_data_types = {"date": "xs:date", "timestamp value": "date", "string": "xs:token"}
    # "{timestamp}": "xs:date" is a very approximate mapping
    #   we need to work on time and date constrains in general
    string_ser_data_types = {"{integer}": "xs:nonNegativeInteger", "{timestamp}": "xs:date",
                             "{float}": "xs:decimal"}

    range_regexes = {"quantity value": r"[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? \S+"}
    string_ser_regexes = {"{float} {unit}": r"[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? \S+",
                          "{text};{float} {unit}": r"\S*;[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? \S+",
                          "{termLabel} {[termID]}": r".* \[ENVO:\d+\]", "{text}:{text}": r"[^\:\n\r]+\:[^\:\n\r]+"}

    model_sv = SchemaView(model_file)

    # ----
    # trying to get term requirement within class slot usages
    classes = model_sv.all_classes()
    class_names = list(classes.keys())
    class_names.sort()
    reqs_from_usage = []
    for cc in class_names:
        current_class = classes[cc]
        ccsu = current_class.slot_usage
        ccsu_names = list(ccsu.keys())
        ccsu_names.sort()
        for current_usage in ccsu_names:
            current_row_dict = {"class": cc, "slot": current_usage, "required": ccsu[current_usage].required,
                                "recommended": ccsu[current_usage].recommended}
            reqs_from_usage.append(current_row_dict)

    reqs_from_usage_frame = pd.DataFrame(reqs_from_usage)
    reqs_from_usage_frame['required'] = reqs_from_usage_frame['required'].fillna(False)
    reqs_from_usage_frame['recommended'] = reqs_from_usage_frame['recommended'].fillna(False)
    req_from_usage = list(reqs_from_usage_frame.loc[reqs_from_usage_frame.required, 'slot'])
    rec_from_usage = list(reqs_from_usage_frame.loc[reqs_from_usage_frame.recommended, 'slot'])

    # ----

    model_enums = model_sv.all_enums()
    model_enum_names = list(model_enums.keys())
    model_enum_names.sort()

    blank_row = {i: "" for i in dht_column_order}

    isa_set = set()
    isa_dict = {}
    relevant_slots = model_sv.class_induced_slots(selected_class)
    rs_names = [i.name for i in relevant_slots]
    rs_dict = dict(zip(rs_names, relevant_slots))
    prefix_tally = []
    for i in relevant_slots:
        prefix_portion = ""
        if i.slot_uri is None or i.slot_uri == "":
            # section_prefix = ""
            pass
        else:
            # what if the slot uri is a full uri, not a curie?
            prefix_portion = i.slot_uri.split(":")[0] + ":"
            prefix_tally.append(prefix_portion)
        if i.is_a is None:
            relevant_isa = prefix_portion + default_section
        else:
            relevant_isa = prefix_portion + i.is_a
        isa_dict[i.name] = relevant_isa
        isa_set.add(relevant_isa)
    logger.info("\n")

    isa_list = list(isa_set)
    isa_list = [i for i in isa_list if i]
    isa_list.sort()
    section_list = []
    for i in isa_list:
        current_row = blank_row.copy()
        current_row["label"] = i
        section_list.append(current_row)

    range_tally = []
    string_ser_tally = []

    term_names = list(isa_dict.keys())
    term_names.sort()
    term_list = []
    pv_list = []
    for i in term_names:
        logger.info(f"processing {i}")
        current_row = blank_row.copy()
        current_sd = rs_dict[i]
        current_row["Ontology ID"] = current_sd.slot_uri
        if current_sd.title is not None and len(current_sd.title) > 0:
            current_row["label"] = current_sd.title
        else:
            current_row["label"] = current_sd.name
        # useless parent classes:  attribute, <default>,
        current_row["parent class"] = isa_dict[i]
        # description: quote and or bracket wrappers, TODO, empty
        if current_sd.description is None:
            pass
        else:
            # these are of type linkml_runtime.utils.yamlutils.extended_str
            # even though GOLD sample identifiers ['identifiers for corresponding sample in GOLD'] looks like a list
            # current_row["description"] = current_sd.description[0]
            temp = current_sd.description
            temp = re.sub(r"^[\['\"]*", "", temp)
            temp = re.sub(r"['\]\"]*$", "", temp)
            current_row["description"] = temp
        # guidance: I have moved slot used in...  out of the MIxS comments
        #  Occurrence is still in there
        #   ~ half of the MixS soil/NMDC biosample fields lack comments for "guidance"
        #   Montana provides her own, to be concatenated on
        #   Damion's latest LinkML -> JS approach lays the comments and examples out nicer
        current_row["guidance"] = " | ".join(current_sd.comments)
        # todo refactor
        current_row["datatype"] = "xs:token"
        if current_sd.pattern is not None and current_sd.pattern != "":
            if current_row["guidance"] is not None and current_row["guidance"] != "":
                current_row["guidance"] = current_row[
                                              "guidance"] + " | pattern as regular expression: " + current_sd.pattern
            else:
                current_row["guidance"] = "pattern as regular expression: " + current_sd.pattern
        if current_sd.string_serialization is not None and current_sd.string_serialization != "":
            if current_row["guidance"] is not None and current_row["guidance"] != "":
                current_row["guidance"] = current_row[
                                              "guidance"] + " | pattern generalization: " + current_sd.string_serialization
            else:
                current_row["guidance"] = "pattern generalization: " + current_sd.string_serialization
            # if current_sd.string_serialization == '{float}':
            #     current_row["datatype"] = "xs:decimal"
        # todo map types
        # don't forget selects and multis
        # map selects to terms and indent
        range_tally.append(current_sd.range)
        if current_sd.string_serialization is not None and current_sd.string_serialization != "":
            string_ser_tally.append(current_sd.string_serialization[0:99])
        else:
            string_ser_tally.append("<none>")
        # if current_sd.range == "timestamp value" or current_sd.range == "date":
        #     current_row["datatype"] = "xs:date"
        # other ways to infer pattern (mappings from range?) or string serialization
        # exclude any that reiterate an enum
        # select, multiple, xs:nonNegativeInteger, xs:decimal
        current_row["pattern"] = current_sd.pattern
        # if (current_sd.pattern is None or current_sd.pattern == "") and current_sd.range == "quantity value":
        #     current_row["pattern"] = q_val_pattern
        # todo check for numeric but don't force float when int will do?
        if current_sd.minimum_value is not None and current_sd.minimum_value != "":
            current_row["min value"] = current_sd.minimum_value
        if current_sd.maximum_value is not None and current_sd.maximum_value != "":
            current_row["max value"] = current_sd.maximum_value
        if current_sd.range in model_enum_names:
            # anything else to clear?
            current_row["pattern"] = ""
            # update this once the enums are built
            if current_sd.multivalued:
                current_row["datatype"] = "multiple"
                logger.info(f"    {i} is multi-valued")
            else:
                current_row["datatype"] = "select"
            pvs_obj = model_enums[current_sd.range].permissible_values
            pv_keys = list(pvs_obj.keys())
            pv_keys.sort()
            for pvk in pv_keys:
                pv_row = blank_row.copy()
                pv_row["label"] = pvk
                pv_row["parent class"] = current_sd.title
                # use term meaning as ontology ID if possible
                pv_row["Ontology ID"] = pvs_obj[pvk].meaning
                pv_list.append(pv_row)
        if current_sd.recommended or current_sd.name in rec_from_usage:
            current_row["requirement"] = "recommended"
        elif current_sd.required or current_sd.name in req_from_usage:
            current_row["requirement"] = "required"
        example_list = []
        for exmpl in current_sd.examples:
            # ignoring description which always seems to be None
            if exmpl.value is not None and len(exmpl.value) > 0:
                example_list.append(exmpl.value)
                example_cat = "|".join(example_list)
                current_row["examples"] = example_cat
        current_row["source"] = default_source  # for reuse of enums?
        current_row["capitalize"] = default_capitalize
        current_row["data status"] = default_data_status
        # any other ways to infer min or max, as a supplement to the datatypes?
        current_row["max value"] = current_sd.maximum_value
        current_row["min value"] = current_sd.minimum_value
        # old issue... export menu saves a file but not with the briefer LinkML names (as opposed to titles)
        current_row["EXPORT_dev"] = current_sd.name

        if current_sd.range in range_data_types:
            current_row["datatype"] = range_data_types[current_sd.range]
        elif current_sd.string_serialization in string_ser_data_types:
            current_row["datatype"] = string_ser_data_types[current_sd.string_serialization]

        if current_sd.range in range_regexes:
            current_row["pattern"] = range_regexes[current_sd.range]
        elif current_sd.string_serialization in string_ser_regexes:
            current_row["pattern"] = string_ser_regexes[current_sd.string_serialization]

        if current_sd.identifier:
            current_row["datatype"] = "xs:unique"
            current_row["requirement"] = "required"

        term_list.append(current_row)
    logger.info("\n")

    final_list = section_list + term_list + pv_list
    needs_reordering = pd.DataFrame(final_list)

    slot_review = model_sv.class_induced_slots(selected_class)
    identifier_slots = []
    for i in slot_review:
        if i.identifier:
            identifier_slots.append(i.name)

    identifier_sections = []
    for i in identifier_slots:
        identifier_sections.append(isa_dict[i])

    stolen_label_rows = needs_reordering.loc[needs_reordering["label"].isin(identifier_sections)]
    nr_leftovers = needs_reordering.loc[~needs_reordering["label"].isin(identifier_sections)]
    stolen_parent_rows = needs_reordering.loc[needs_reordering["parent class"].isin(identifier_sections)]
    nr_leftovers = nr_leftovers.loc[~nr_leftovers["parent class"].isin(identifier_sections)]
    cream_of_crop = stolen_parent_rows.loc[stolen_parent_rows["label"].isin(identifier_slots)]
    coc_leftovers = stolen_parent_rows.loc[~ stolen_parent_rows["label"].isin(identifier_slots)]

    reunited = stolen_label_rows.append(cream_of_crop)
    reunited = reunited.append(coc_leftovers)
    reunited = reunited.append(nr_leftovers)

    log_tally(prefix_tally, "TABULATION OF TERM PREFIXES, for prioritizing range->regex conversion")
    log_tally(range_tally, "TABULATION OF SLOT RANGES, for prioritizing range->regex conversion")
    log_tally(string_ser_tally, "TABULATION OF STRING SERIALIZATIONS, for prioritizing serialization->regex conversion")

    reunited.to_csv(output_file, sep="\t", index=False)


def log_tally(tally, message):
    logger.info(message)
    logger.info(pd.Series(tally).value_counts())
    logger.info("\n")
