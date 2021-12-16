from linkml_runtime.linkml_model import SchemaDefinition, Prefix, ClassDefinition, TypeDefinition, EnumDefinition
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

    def resolve_dependencies(self):
        if len(self.bookkeeping_dict["pending_ranges"]) > 0:
            iterator = iter(self.bookkeeping_dict["pending_ranges"])
            current_range = next(iterator, None)
            print(current_range)
            for k, v in self.foreign_views.items():
                print(k)
                attempt = v.get_element(current_range)
                if attempt is not None:
                    print(attempt)
                    if isinstance(attempt, ClassDefinition):
                        print("is a class")
                        self.element_dict["classes"].append(attempt)
                        self.resolve_range(current_range, "exhausted_classes")
                    elif isinstance(attempt, EnumDefinition):
                        print("is an enum")
                        self.element_dict["enums"].append(attempt)
                        self.resolve_range(current_range, "exhausted_enums")
                    elif isinstance(attempt, TypeDefinition):
                        print("is a type")
                        self.element_dict["types"].append(attempt)
                        self.resolve_range(current_range, "exhausted_types")
                    # just trust the first schema in which the term appears?
                    break



def main_meth():
    current_resolver = DependencyResolver(
        schema_files=["../../mixs-source/model/schema/mixs.yaml", "../../nmdc-schema/src/schema/nmdc.yaml"])
    print(current_resolver.get_bookeeping())
    current_resolver.add_pending_range("person")
    print(current_resolver.get_bookeeping())
    current_resolver.resolve_dependencies()
    # current_resolver.resolve_range("person", "exhausted_classes")
    print(current_resolver.get_bookeeping())
    cr_fv = current_resolver.foreign_views
    # cr_fv_keys = list(cr_fv.keys())
    # print(cr_fv_keys)


if __name__ == '__main__':
    main_meth()
