from linkml_runtime.linkml_model import SchemaDefinition, Prefix
# ClassDefinition, TypeDefinition, EnumDefinition
from typing import List
from linkml_runtime.utils.schemaview import SchemaView
from pathlib import Path


# todo sid and def_expansion should really be an uri or curie
def just_exacts_schema(sname: str, sid: str, def_pref: str, def_expansion: str) -> SchemaDefinition:
    p = Prefix(prefix_prefix=def_pref, prefix_reference=def_expansion)
    sd = SchemaDefinition(name=sname, id=sid)
    sd.prefixes[def_pref] = p
    sd.default_prefix = def_pref
    return sd


class DependencyResolver:
    def __init__(self, schema_files: List[str]):
        self.reference_views = {}
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
        self.foreign_views = {}
        for i in schema_files:
            # print(i)
            i_view = SchemaView(i)
            i_name = Path(i).stem
            self.foreign_views[i_name] = i_view

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

    # use the methods above as appropriate
    def resolve_dependencies(self, model_files):
        # add reference SchemaViews to instance once
        if not self.reference_views:
            for current_file in model_files:
                model_sv = SchemaView(current_file)
                model_name = model_sv.schema.name
                self.reference_views[model_name] = model_sv

        # todo recalculate these every iteration?
        # print(self.reference_views.keys())
        all_classes = self.reference_views['MIxS'].all_classes()
        all_class_names = list(all_classes.keys())
        all_enums = self.reference_views['MIxS'].all_enums()
        all_enum_names = list(all_enums.keys())
        all_types = self.reference_views['MIxS'].all_types()
        all_type_names = list(all_types.keys())
        all_slots_dict = self.reference_views['MIxS'].all_slots()

        # model_def_pref = model_sv.schema.default_prefix
        # mvp = model_sv.schema.prefixes
        # mvs = model_sv.all_subsets()

        if (
                len(self.bookkeeping_dict["pending_ranges"]) == 0
                and len(self.bookkeeping_dict["pending_slots"]) == 0
        ):
            return self.bookkeeping_dict
        else:
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

        return self.resolve_dependencies(self.bookkeeping_dict)


def main_meth():
    current_resolver = DependencyResolver(
        schema_files=["../mixs-source/model/schema/mixs.yaml", "../nmdc-schema/src/schema/nmdc.yaml"])
    print(current_resolver.get_bookeeping())
    # current_resolver.add_pending_range("person")
    current_resolver.add_pending_range("soil")
    print(current_resolver.get_bookeeping())
    current_resolver.resolve_dependencies(
        model_files=["../mixs-source/model/schema/mixs.yaml", "../nmdc-schema/src/schema/nmdc.yaml"])
    # current_resolver.resolve_range("person", "exhausted_classes")
    print(current_resolver.get_bookeeping())
    # cr_fv = current_resolver.foreign_views
    # cr_fv_keys = list(cr_fv.keys())
    # print(cr_fv_keys)


if __name__ == '__main__':
    main_meth()

# iterator = iter(self.bookkeeping_dict["pending_ranges"])
# current_range = next(iterator, None)
# print(current_range)
# for k, v in self.foreign_views.items():
#     print(k)
#     attempt = v.get_element(current_range)
#     if attempt is not None:
#         print(attempt)
#         if isinstance(attempt, ClassDefinition):
#             print("is a class")
#             self.element_dict["classes"].append(attempt)
#             self.resolve_range(current_range, "exhausted_classes")
#         elif isinstance(attempt, EnumDefinition):
#             print("is an enum")
#             self.element_dict["enums"].append(attempt)
#             self.resolve_range(current_range, "exhausted_enums")
#         elif isinstance(attempt, TypeDefinition):
#             print("is a type")
#             self.element_dict["types"].append(attempt)
#             self.resolve_range(current_range, "exhausted_types")
#         # just trust the first schema in which the term appears?
#         break
