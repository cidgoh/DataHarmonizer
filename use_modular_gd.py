import linkml_round_trips.modular_gd as mgd
from linkml_runtime.linkml_model import SlotDefinition, Example, EnumDefinition
from linkml_runtime.dumpers import yaml_dumper

import click

import logging
import click_log

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


# place in __main__ in root of package

@click.command()
@click_log.simple_verbosity_option()
@click.option('--sheet_id', default='1pSmxX6XGOxmoA7S7rKyj5OaEl3PmAl4jAOlROuNHrU0',
              help='id for Soil-NMDC-Template_CompiledGoogle Sheet.', show_default=True)
@click.option('--client_secret_json', default='local/client_secret.apps.googleusercontent.com.json', show_default=True,
              help='location of Google Sheets authentication file.', type=click.Path(exists=True))
@click.option('--constructed_schema_name', default='soil_biosample', show_default=True,
              help='what should the combined schema be called?')
@click.option('--constructed_schema_id', default='http://example.com/soil_biosample', show_default=True,
              help='URL "id" for combined schema?')
@click.option('--constructed_class_name', default='soil_biosample', show_default=True,
              help='name for combined class within combined schema?')
@click.option('--inc_emsl/--no_emsl', default=False, show_default=True)
@click.option('--jgi', type=click.Choice(['metagenomics', 'metatranscriptomics', 'omit']), default='omit',
              show_default=True)
def combine_schemas(sheet_id, client_secret_json, constructed_schema_name, constructed_schema_id,
                    constructed_class_name, inc_emsl, jgi):
    additional_prefixes = {"prov": "http://www.w3.org/ns/prov#", "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                           "schema": "http://schema.org/", "xsd": "http://www.w3.org/2001/XMLSchema#",
                           "UO": "http://purl.obolibrary.org/obo/UO_"}

    new_schema = mgd.construct_schema(constructed_schema_name, constructed_schema_id, constructed_class_name,
                                      additional_prefixes)

    tasks = {"nmdc": {"yaml": "target/nmdc_generated_no_imports.yaml", "title": "nmdc_biosample_slots",
                      "focus_class": "biosample",
                      "query": """
                            SELECT
                                name as slot
                            FROM
                                gsheet_frame
                            where
                                from_schema != 'https://microbiomedata/schema/mixs'
                                and disposition != 'skip';
    """},
             "mixs": {"yaml": "target/mixs_generated_no_imports.yaml", "title": "mixs_packages_x_slots",
                      "focus_class": "soil",
                      "query": """
                            SELECT
                                slot as slot
                            FROM
                                gsheet_frame
                            where
                                package = 'soil'
                                and (
                                disposition = 'use as-is' or disposition = 'borrowed as-is'
                                )
    """}, }

    for title, task in tasks.items():
        pysqldf_slot_list = mgd.subset_slots_from_sheet(client_secret_json, sheet_id, task['title'], task['query'])
        # # pysqldf_slot_list.sort()
        new_schema = mgd.wrapper(task['yaml'], title, task['focus_class'], pysqldf_slot_list, new_schema,
                                 constructed_class_name)

    # todo refactor
    enum_sheet = mgd.get_gsheet_frame(client_secret_json, sheet_id, 'enumerations')

    def inject_supplementary(secret, supplementary_id, supplementary_tab_title, schema, prefix, class_name,
                             rule_col=None, rule_val=None, overwrite=False):
        current_sheet = mgd.get_gsheet_frame(secret, supplementary_id, supplementary_tab_title)
        if rule_col != "" and rule_col is not None and rule_val != "" and rule_val is not None:
            logger.info(f"requiring {rule_col} to equal {rule_val}")
            current_sheet = current_sheet.loc[current_sheet[rule_col].eq(rule_val)]
        current_dict = current_sheet.to_dict(orient='records')
        for i in current_dict:
            i_s = i['slot']
            if i_s in schema.slots and not overwrite:
                exit
            else:
                new_slot = SlotDefinition(name=i_s, slot_uri=prefix + ":" + i_s, title=i['name'])
                if i['requirement status'] == "required":
                    new_slot.required = True
                if i['requirement status'] == "recommended":
                    new_slot.recommended = True
                if i['example'] != "" and i['example'] is not None:
                    temp_example = Example(i['example'])
                    new_slot.examples.append(temp_example)
                if i['definition'] != "" and i['definition'] is not None:
                    new_slot.description = i['definition']
                if i['guidance'] != "" and i['guidance'] is not None:
                    new_slot.comments.append(i['guidance'])
                if i['min'] != "" and i['min'] is not None:
                    new_slot.minimum_value = i['min']
                if i['max'] != "" and i['max'] is not None:
                    new_slot.maximum_value = i['max']
                # todo force these to be booleans
                if i['multivalued'] != "" and i['multivalued'] is not None:
                    new_slot.multivalued = bool(i['multivalued'])
                if i['identifier'] != "" and i['identifier'] is not None:
                    new_slot.identifier = bool(i['identifier'])
                if i['syntax'] != "" and i['syntax'] is not None:
                    new_slot.string_serialization = i['syntax']
                    # try to standardize where "enumeration" is expressed... expected value comment/guidance?
                    if i['syntax'] == "enumeration":
                        if i_s in enum_sheet.columns:
                            raw_pvs = list(set(list(enum_sheet[i_s])))
                            raw_pvs = [i for i in raw_pvs if i]
                            if len(raw_pvs) > 0:
                                te_name = i_s + "_enum"
                                temp_enum = EnumDefinition(name=te_name)
                                raw_pvs.sort()
                                for pv in raw_pvs:
                                    temp_enum.permissible_values[pv] = pv
                                new_slot.range = te_name
                                schema.enums[te_name] = temp_enum
                schema.slots[i_s] = new_slot
                schema.classes[class_name].slots.append(i_s)
        return schema

    # override for depth
    new_schema = inject_supplementary(client_secret_json, sheet_id, 'mixs_modified_slots', new_schema, "mixs_modified",
                                      constructed_class_name, overwrite=True)
    # override for env_package
    new_schema = inject_supplementary(client_secret_json, sheet_id, 'biosample_identification_slots', new_schema,
                                      "samp_id",
                                      constructed_class_name, overwrite=True)
    # haven't documented whether anything else comes along with those overrides yet

    if inc_emsl:
        logger.info("including EMSL terms")
        new_schema = inject_supplementary(client_secret_json, sheet_id, 'EMSL_sample_slots', new_schema, "emsl",
                                          constructed_class_name)

    if jgi == "metagenomics":
        logger.info("would extract JGI metagenomics terms")
        new_schema = inject_supplementary(client_secret_json, sheet_id, 'JGI_sample_slots', new_schema, "jgi_gen",
                                          constructed_class_name, rule_col="analyte type", rule_val="metagenomics")
    elif jgi == "metatranscriptomics":
        logger.info("would extract JGI metatranscriptomics terms")
        new_schema = inject_supplementary(client_secret_json, sheet_id, 'JGI_sample_slots', new_schema, "jgi_gen",
                                          constructed_class_name, rule_col="analyte type",
                                          rule_val="metatranscriptomics")
    elif jgi == "omit":
        logger.info("would skip JGI terms")
    else:
        logger.info("unexpected JGI processing option")

    # gen-yaml raises these concerns
    #   1 WARNING:Namespaces:MIXS namespace is already mapped to https://w3id.org/gensc/ - Mapping to https://w3id.org/mixs/terms/ ignored
    # 276 WARNING:YAMLGenerator:File "<file>" Prefix case mismatch - supplied: MIXS expected: mixs
    #   1 WARNING:YAMLGenerator:Overlapping subset and class names: soil

    dumped = yaml_dumper.dumps(new_schema)

    print(dumped)


if __name__ == '__main__':
    combine_schemas()
