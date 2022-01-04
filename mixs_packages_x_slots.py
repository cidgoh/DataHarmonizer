import pandas as pd
from linkml_runtime.utils.schemaview import SchemaView

mixs_yaml = "mixs-source/model/schema/mixs.yaml"
output_file = "target/mixs_packages_x_slots.tsv"

mixs_view = SchemaView(mixs_yaml)


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
    blank_row = {"package": None, "slot": None}
    row_list = []
    for current_package in packages:
        current_slots = get_package_slots(view, current_package)
        for one_slot in current_slots:
            current_row = blank_row.copy()
            current_row["package"] = current_package
            current_row["slot"] = one_slot
            row_list.append(current_row)
    pxs_frame = pd.DataFrame(row_list)
    return pxs_frame


package_classes = get_package_classes(mixs_view)

packages_x_slots = get_packages_x_slots(mixs_view, package_classes)

packages_x_slots.to_csv(output_file, sep="\t", index=False)
