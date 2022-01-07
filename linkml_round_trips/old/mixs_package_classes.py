import pandas as pd
from linkml_runtime.utils.schemaview import SchemaView

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


@click.command()
@click_log.simple_verbosity_option(logger)
@click.option('--model_file', type=click.Path(exists=True), required=True)
@click.option('--output_file', type=click.Path(), required=True)
def mixs_package_classes(model_file, output_file):
    mixs_view = SchemaView(model_file)
    # should be "MIxS"
    # logger.info(mixs_view.schema.name)
    mixs_classes = mixs_view.all_classes()
    mixs_class_names = list(mixs_classes.keys())
    mixs_class_names.sort()
    blank_class_row = {'class_name': None, 'is_a_parent': None, 'is_mixin': False, 'mixins_used': None}
    class_row_list = []
    for current_class_name in mixs_class_names:
        # logger.info(current_class_name)
        current_cd = mixs_view.get_class(current_class_name)
        # current_is_a = current_cd.is_a
        current_mixin_flag = current_cd.mixin
        mixins_used = current_cd.mixins
        # logger.info(f"{i}\t{current_is_a}\t{current_mixin_flag}\t{mixins_used}")
        current_row = blank_class_row.copy()
        current_row['class_name'] = current_class_name
        if current_cd.is_a is not None:
            current_row['is_a_parent'] = str(current_cd.is_a)
        if current_mixin_flag:
            current_row['is_mixin'] = True
        # current_row['mixins_used'] = str(mixins_used)
        current_row['mixins_used'] = "|".join(mixins_used)
        class_row_list.append(current_row)
    mixs_class_frame = pd.DataFrame(class_row_list)
    # logger.info(mixs_class_frame)
    # for now, it looks like all is_a parents of any other class are the packages

    package_classes = list(mixs_class_frame['is_a_parent'].drop_duplicates())
    package_classes = [current_class for current_class in package_classes if current_class is not None]
    package_classes.sort()
    # logger.info(package_classes)

    # env_package_pvs = mixs_view.get_enum('env_package_enum').permissible_values
    # ep_pvs_names = list(env_package_pvs.keys())
    # ep_pvs_names.sort()
    # logger.info(ep_pvs_names)

    mims_package_classes = mixs_class_frame['class_name'].loc[
        mixs_class_frame['mixins_used'].eq("MIMS") & mixs_class_frame['is_a_parent'].isin(package_classes)
        ]
    mims_package_classes = list(mims_package_classes)
    mims_package_classes.sort()

    selected_classes = ['built environment', 'microbial mat_biofilm', 'miscellaneous natural or artificial environment',
                        'plant-associated', 'sediment', 'soil', 'wastewater_sludge', 'water']

    blank_slot_row = {'class_name': None, 'slot_name': None, 'disposition': None}
    slot_row_list = []
    for current_pc_name in selected_classes:
        # logger.info(current_pc_name)
        induceds = mixs_view.class_induced_slots(current_pc_name)
        induceds_names = [ci.name for ci in induceds]
        induceds_names.sort()
        for current_induced in induceds_names:
            # logger.info(f"{current_pc_name} {current_induced}")
            current_slot_row = blank_slot_row.copy()
            current_slot_row['class_name'] = current_pc_name
            current_slot_row['slot_name'] = current_induced
            slot_row_list.append(current_slot_row)

    slot_frame = pd.DataFrame(slot_row_list)
    # logger.info(slot_frame)
    slot_frame.to_csv(output_file, sep="\t", index=False)
