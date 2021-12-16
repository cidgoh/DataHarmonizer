from linkml_runtime.utils.schemaview import SchemaView
import pandas as pd

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


# model_file = "target/soil_biosample_interleaved.yaml"
# selected_class = "soil_biosample_class"
# default_section = "default"
# default_source = ""  # for reuse of enums?
# default_capitalize = ""
# default_data_status = ""
# output_file = "target/data.tsv"

@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--selected_class', required=True)
@click.option('--default_section', default="default")
@click.option('--default_source', default="")
@click.option('--default_capitalize', default="")
@click.option('--default_data_status', default="default")
@click.option('--output_file', type=click.Path(), default="target/data.tsv")
def linkml_to_dh_light(model_file, selected_class, default_section, default_source, default_capitalize,
                       default_data_status, output_file):
    dht_column_order = ["Ontology ID", "label", "parent class", "description", "guidance", "datatype", "pattern",
                        "requirement", "examples", "source", "capitalize", "data status", "max value", "min value",
                        "EXPORT_dev"]

    # wrap in ^ and $?
    q_val_pattern = "\d+[.\d+] \S+"

    model_sv = SchemaView(model_file)

    model_enums = model_sv.all_enums()
    model_enum_names = list(model_enums.keys())
    model_enum_names.sort()

    blank_row = {i: "" for i in dht_column_order}
    # logger.info(blank_row)

    isa_set = set()
    isa_dict = {}
    relevant_slots = model_sv.class_induced_slots(selected_class)
    rs_names = [i.name for i in relevant_slots]
    rs_dict = dict(zip(rs_names, relevant_slots))
    for i in relevant_slots:
        # slotname = i.name
        if i.slot_uri is None or i.slot_uri == "":
            section_prefix = ""
        else:
            # what if the slot uri is a full uri, not a curie?
            prefix_portion = i.slot_uri.split(":")[0] + ":"
            logger.info(prefix_portion)
        if i.is_a is None:
            relevant_isa = prefix_portion + default_section
        else:
            relevant_isa = prefix_portion + i.is_a
        isa_dict[i.name] = relevant_isa
        isa_set.add(relevant_isa)

    isa_list = list(isa_set)
    isa_list = [i for i in isa_list if i]
    isa_list.sort()
    section_list = []
    for i in isa_list:
        current_row = blank_row.copy()
        current_row["label"] = i
        section_list.append(current_row)

    range_tally = []

    term_names = list(isa_dict.keys())
    term_names.sort()
    term_list = []
    pv_list = []
    for i in term_names:
        logger.info(i)
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
        current_row["description"] = current_sd.description
        # guidance: I have moved slot used in... and Occurrence out of the MIxS comments
        #   ~ half of the MixS soil/NMDC biosample fields lack comments for "guidance"
        #   Montana provides her own, to be concatenated on
        #   Damion's latest LinkML -> JS approach lays the comments and examples out nicer
        current_row["guidance"] = "|".join(current_sd.comments)
        if current_sd.pattern is not None and current_sd.pattern != "":
            current_row["guidance"] = current_row["guidance"] + "|" + current_sd.pattern
        # todo map types
        # don't forget selects and multis
        # map selects to terms and indent
        range_tally.append(current_sd.range)
        current_row["datatype"] = "xs:token"
        if current_sd.identifier:
            current_row["datatype"] = "xs:unique"
            current_row["requirement"] = "required"
        if current_sd.range == "timestamp value":
            current_row["datatype"] = "xs:date"
        # other ways to infer pattern (mappings from range?) or string serialization
        # exclude any that reiterate an enum
        # select, multiple, xs:nonNegativeInteger, xs:decimal
        current_row["pattern"] = current_sd.pattern
        if (current_sd.pattern is None or current_sd.pattern == "") and current_sd.range == "quantity value":
            current_row["pattern"] = q_val_pattern
        if current_sd.range in model_enum_names:
            # anything else to clear?
            current_row["pattern"] = ""
            # update this once the enums are built
            if current_sd.multivalued:
                current_row["datatype"] = "multiple"
                logger.info(f"    {i} multiple")
            else:
                current_row["datatype"] = "select"
            pvs_obj = model_enums[current_sd.range].permissible_values
            pv_keys = list(pvs_obj.keys())
            pv_keys.sort()
            for pvk in pv_keys:
                # logger.info(pvk)
                pv_row = blank_row.copy()
                pv_row["label"] = pvk
                pv_row["parent class"] = current_sd.title
                pv_list.append(pv_row)
        # seeing fewer required than I expected
        # current_row["requirement"] = ""
        if current_sd.recommended:
            current_row["requirement"] = "recommended"
        elif current_sd.required:
            current_row["requirement"] = "required"
        # --- examples
        example_list = []
        for exmpl in current_sd.examples:
            # ignoring description which always seems to be None
            if exmpl.value is not None and len(exmpl.value) > 0:
                example_list.append(exmpl.value)
                example_cat = "|".join(example_list)
                current_row["source"] = example_cat
        current_row["source"] = default_source  # for reuse of enums?
        current_row["capitalize"] = default_capitalize
        current_row["data status"] = default_data_status
        # any other ways to infer min or max, as a supplement to the datatypes?
        current_row["max value"] = current_sd.maximum_value
        current_row["min value"] = current_sd.minimum_value
        # old issue... export menu saves a file but not with the briefer LinkML names (as opposed to titles)
        current_row["EXPORT_dev"] = current_sd.name

        term_list.append(current_row)

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

    logger.info(pd.Series(range_tally).value_counts())

    # todo also include source (slot URI prefix?) in sectio0n names?

    # todo make a similar table with the string serialization for each slot

    reunited.to_csv(output_file, sep="\t", index=False)

# # soil biosample
# ranges that could be interpreted as datatypes or patterns
# I already did quantity value
# I have the following rules for any range that is defined as an enum" XXX
# quantity value           74
# text value               34
# string                   21
# controlled term value     5
# timestamp value           4
# cur_land_use_enum         1
# drainage_class_enum       1
# fao_class_enum            1
# geolocation value         1
# named thing               1
# profile_position_enum     1
# soil_horizon_enum         1
# tillage_enum              1
