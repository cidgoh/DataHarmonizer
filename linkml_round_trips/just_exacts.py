from linkml_runtime.linkml_model import SchemaDefinition, Prefix
# ClassDefinition, TypeDefinition, EnumDefinition
from typing import List
from linkml_runtime.utils.schemaview import SchemaView
# from pathlib import Path
from linkml_runtime.dumpers import yaml_dumper

from linkml.generators.yamlgen import YAMLGenerator


# todo sid and def_expansion should really be an uri or curie
def bootstrap_schema(sname: str, sid: str, def_pref: str, def_expansion: str) -> SchemaDefinition:
    p = Prefix(prefix_prefix=def_pref, prefix_reference=def_expansion)
    sd = SchemaDefinition(name=sname, id=sid)
    sd.prefixes[def_pref] = p
    sd.default_prefix = def_pref
    return sd


class DependencyResolver:
    def __init__(self, schema_files: List[str]):
        self.bookkeeping_dict = {
            "pending_ranges": set(),
            "pending_slots": set(),
            "exhausted_classes": set(),
            "exhausted_enums": set(),
            "exhausted_slots": set(),
            "exhausted_types": set(),
        }
        self.element_dict = {
            "classes": [],
            "enums": [],
            "slots": [],
            "types": []
        }
        self.reference_views = {}
        for i in schema_files:
            i_view = SchemaView(i)
            i_name = i_view.schema.name
            self.reference_views[i_name] = i_view

    def add_pending_range(self, range_name: str):
        if range_name not in self.bookkeeping_dict["exhausted_classes"] and range_name not in self.bookkeeping_dict[
            "exhausted_enums"] and range_name not in self.bookkeeping_dict["exhausted_types"]:
            self.bookkeeping_dict["pending_ranges"].add(range_name)

    def resolve_range(self, range_name, destination):
        # fq_destination = f"exhausted_{destination_type}s"
        self.bookkeeping_dict["pending_ranges"].remove(range_name)
        # self.bookkeeping_dict[fq_destination].add(range_name)
        self.bookkeeping_dict[destination].add(range_name)

    def add_pending_slot(self, slot_name: str):
        if slot_name not in self.bookkeeping_dict["exhausted_slots"]:
            self.bookkeeping_dict["pending_slots"].add(slot_name)

    def get_bookeeping(self):
        return self.bookkeeping_dict

    def resolve_slot(self, slot_name):
        self.bookkeeping_dict["pending_slots"].remove(slot_name)
        self.bookkeeping_dict["exhausted_slots"].add(slot_name)

    def get_reference_prefixes(self, schema_name):
        return self.reference_views[schema_name].schema.prefixes

    def get_reference_subsets(self, schema_name):
        return self.reference_views[schema_name].schema.subsets

    def get_reference_schema(self, schema_name):
        return self.reference_views[schema_name]

    # use the methods above as appropriate
    def resolve_dependencies(self):
        if (
                len(self.bookkeeping_dict["pending_ranges"]) == 0
                and len(self.bookkeeping_dict["pending_slots"]) == 0
        ):
            return self.bookkeeping_dict

        # todo recalculate these every iteration?
        all_classes = self.reference_views['MIxS'].all_classes()
        all_class_names = list(all_classes.keys())
        all_enums = self.reference_views['MIxS'].all_enums()
        all_enum_names = list(all_enums.keys())
        all_types = self.reference_views['MIxS'].all_types()
        all_type_names = list(all_types.keys())
        all_slots_dict = self.reference_views['MIxS'].all_slots()

        class_parents = set()
        usage_ranges = set()
        for pc in self.bookkeeping_dict["pending_ranges"]:
            self.bookkeeping_dict["exhausted_classes"].add(pc)
            i_s = self.reference_views['MIxS'].class_induced_slots(pc)
            isnl = [slot.name for slot in i_s]
            isns = set(isnl)
            self.bookkeeping_dict["pending_slots"] = self.bookkeeping_dict["pending_slots"].union(
                isns
            )
            class_parents.update(set(self.reference_views['MIxS'].class_ancestors(pc)))
            cd = self.reference_views['MIxS'].get_class(pc)
            for k, v in cd.slot_usage.items():
                if v.range is not None:
                    usage_ranges.add(v.range)
        self.bookkeeping_dict["pending_ranges"] = (
                self.bookkeeping_dict["pending_ranges"] - self.bookkeeping_dict["exhausted_classes"]
        )
        for cp in class_parents:
            if cp not in self.bookkeeping_dict["exhausted_classes"]:
                self.bookkeeping_dict["pending_ranges"].add(cp)
        for ur in usage_ranges:
            if ur in all_class_names and ur not in self.bookkeeping_dict["exhausted_classes"]:
                self.bookkeeping_dict["pending_ranges"].add(ur)
            if ur in all_type_names:
                # a typeof could sneak in here?
                self.bookkeeping_dict["exhausted_types"].add(ur)
        isas = set()
        for ps in self.bookkeeping_dict["pending_slots"]:
            if ps not in self.bookkeeping_dict["exhausted_slots"]:
                current_slot_def = all_slots_dict[ps]
                isas.update(set(self.reference_views['MIxS'].slot_ancestors(ps)))

                current_slot_range = current_slot_def.range
                if current_slot_range is not None:
                    if current_slot_range in all_type_names:
                        self.bookkeeping_dict["exhausted_types"].add(current_slot_range)
                        td = self.reference_views['MIxS'].get_type(current_slot_range)
                        tdto = td.typeof
                        if tdto is not None:
                            self.bookkeeping_dict["exhausted_types"].add(tdto)
                    if current_slot_range in all_enum_names:
                        self.bookkeeping_dict["exhausted_enums"].add(current_slot_range)
                    if current_slot_range in all_class_names:
                        if (
                                current_slot_range
                                not in self.bookkeeping_dict["exhausted_classes"]
                        ):
                            self.bookkeeping_dict["pending_ranges"].add(current_slot_range)

                # refactor?
                current_slot_domain = current_slot_def.domain
                if current_slot_domain is not None:
                    if current_slot_domain not in self.bookkeeping_dict["exhausted_classes"]:
                        self.bookkeeping_dict["pending_ranges"].add(current_slot_domain)

                self.bookkeeping_dict["exhausted_slots"].add(ps)
        self.bookkeeping_dict["pending_slots"] = (
                self.bookkeeping_dict["pending_slots"] - self.bookkeeping_dict["exhausted_slots"]
        )
        for parent in isas:
            self.bookkeeping_dict["pending_slots"].add(parent)

        return self.resolve_dependencies()

    def merge_dependencies(self, unmerged_schema, pref_reference):
        for i in self.bookkeeping_dict['exhausted_classes']:
            # print(f"merging in class dependency {i}")
            unmerged_schema.classes[i] = self.get_reference_schema(pref_reference).get_class(i)
        for i in self.bookkeeping_dict['exhausted_enums']:
            # print(f"merging in enum dependency {i}")
            unmerged_schema.enums[i] = self.get_reference_schema(pref_reference).get_enum(i)
        for i in self.bookkeeping_dict['exhausted_slots']:
            # print(f"merging in slot dependency {i}")
            unmerged_schema.slots[i] = self.get_reference_schema(pref_reference).get_slot(i)
        for i in self.bookkeeping_dict['exhausted_types']:
            # print(f"merging in type dependency {i}")
            unmerged_schema.types[i] = self.get_reference_schema(pref_reference).get_type(i)

        reference_prefixes = self.get_reference_prefixes(schema_name=pref_reference)

        for k, v in reference_prefixes.items():
            # print(f"{v.prefix_prefix}: {v.prefix_reference}")
            unmerged_schema.prefixes[v.prefix_prefix] = Prefix(prefix_prefix=v.prefix_prefix,
                                                               prefix_reference=v.prefix_reference)
        reference_subsets = self.get_reference_subsets(schema_name="NMDC")
        for k, v in reference_subsets.items():
            unmerged_schema.subsets[v.name] = v

        return unmerged_schema


# def main_meth():
#     current_resolver = DependencyResolver(
#         schema_files=["../mixs-source/model/schema/mixs.yaml", "../nmdc-schema/src/schema/nmdc.yaml"])
#     print(current_resolver.get_bookeeping())
#     # current_resolver.add_pending_range("person")
#     current_resolver.add_pending_range("soil")
#     print(current_resolver.get_bookeeping())
#     current_resolver.resolve_dependencies()
#     bookkeeping_res = current_resolver.get_bookeeping()
#     print(bookkeeping_res)
#
#     je_name = "SNTC_exact_mixs_usages"
#     je_id = f"http://example.com/{je_name}"
#     je_scd = bootstrap_schema(sname=je_name, sid=je_id, def_pref=je_name, def_expansion=f"{je_id}/")
#
#     with_dependencies = current_resolver.merge_dependencies(je_scd, "MIxS")
#
#     # this will fail if with_dependencies has any problems
#     validity_check = YAMLGenerator(with_dependencies)
#
#     yaml_dumper.dump(with_dependencies, "../target/soil.yaml")
#
#
# if __name__ == '__main__':
#     main_meth()
