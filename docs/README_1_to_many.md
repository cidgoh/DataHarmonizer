# DataHarmonizer: 1-to-Many Relationships

This document explains how DataHarmonizer presents LinkML schemas that contain multiple classes connected by 1-to-many relationships. Each class is rendered as a separate spreadsheet tab in the browser UI, and the schema's key and foreign-key declarations drive all navigation, filtering, and data-integrity behaviour.

---

## Concept

A **1-to-many** relationship means one row in a parent table can be associated with many rows in a child table. For example:

```
GRDISample (1) ──► GRDIIsolate (many) ──► AMRTest (many)
```

A single sample can yield multiple isolates; each isolate can have multiple antimicrobial resistance (AMR) test results. DataHarmonizer exposes each class as a tab. When a user selects a row in a parent tab, child tabs automatically filter to show only the rows that belong to that parent record.

---

## Schema Mechanisms

The behaviour is driven entirely by three constructs in `schema.yaml` (and the LinkML `SchemaView`-resolved `schema.json`).

### 1. `identifier` on a slot

Setting `identifier: true` on a slot declares that every value in that column must be unique across the table. It is the primary natural key for that class.

```yaml
slots:
  sample_collector_sample_id:
    identifier: true
    range: WhitespaceMinimizedString
    description: The user-defined name for the sample.
```

DH validation enforces uniqueness of this column. It also makes this slot eligible as the target of a `foreign_key` annotation in a child class.

### 2. `unique_keys` on a class

A class may declare one or more named composite keys. Each key names a set of slots whose **combination** of values must be unique across every row of that table. This is the standard LinkML mechanism for multi-column uniqueness constraints.

```yaml
classes:
  GRDIIsolate:
    unique_keys:
      grdiisolate_key:
        description: An isolate is uniquely identified by sample + isolate ID.
        unique_key_slots:
          - sample_collector_sample_id
          - isolate_id
```

Unlike `identifier`, a `unique_keys` entry does not automatically imply a foreign-key relationship; it only constrains row uniqueness.

### 3. `foreign_key` annotation on a slot (DataHarmonizer extension)

This is a DataHarmonizer-specific annotation, not part of the LinkML standard. When a slot in a child class carries a `foreign_key` annotation, DH reads the value as `ParentClassName.parent_slot_name` and treats that slot as a foreign key pointing to the parent table.

```yaml
classes:
  GRDIIsolate:
    slot_usage:
      sample_collector_sample_id:
        annotations:
          foreign_key:
            tag: foreign_key
            value: GRDISample.sample_collector_sample_id
```

This annotation is what causes DH to:
- Link the child tab to its parent tab in the UI.
- Filter the child tab's rows to match the currently selected parent row.
- Populate the foreign-key column automatically when a new child row is created.
- Make the foreign-key column read-only in the child tab (preventing accidental re-assignment).
- Enforce referential integrity during CRUD operations.

---

## The Container Class

Every multi-table schema requires a **Container** class marked as `tree_root: true`. Its attributes list each data class as a multivalued, inlined collection. This is the standard LinkML pattern for grouping top-level collections; DH uses it to discover all classes in the schema.

```yaml
classes:
  Container:
    name: Container
    tree_root: true
    attributes:
      GRDISamples:
        multivalued: true
        range: GRDISample
        inlined_as_list: true
      GRDIIsolates:
        multivalued: true
        range: GRDIIsolate
        inlined_as_list: true
      AMRTests:
        multivalued: true
        range: AMRTest
        inlined_as_list: true
```

The Container class itself has no tab in the UI; it is structural only.

---

## Worked Example: `web/templates/grdi_1m/`

This template implements a three-level hierarchy: Sample → Isolate → AMR Test.

### Class 1 — GRDISample (root parent)

```yaml
GRDISample:
  unique_keys:
    grdisample_key:
      unique_key_slots:
        - sample_collector_sample_id   # must be unique per row
  slot_usage:
    sample_collector_sample_id:
      identifier: true                 # primary natural key
```

No `foreign_key` annotations. This tab is always active and never filtered by another table.

### Class 2 — GRDIIsolate (child of GRDISample)

```yaml
GRDIIsolate:
  unique_keys:
    grdiisolate_key:
      unique_key_slots:
        - sample_collector_sample_id   # inherited from parent
        - isolate_id                   # isolate's own key
  slot_usage:
    sample_collector_sample_id:
      annotations:
        foreign_key:
          tag: foreign_key
          value: GRDISample.sample_collector_sample_id   # ← link to parent
    isolate_id:
      identifier: true
```

The `sample_collector_sample_id` column is read-only in this tab; its value is set automatically from the selected parent row. The composite key `(sample_collector_sample_id, isolate_id)` must be unique.

### Class 3 — AMRTest (child of GRDIIsolate)

```yaml
AMRTest:
  unique_keys:
    amrtest_key:
      unique_key_slots:
        - isolate_id
        - antimicrobial_drug
  slot_usage:
    isolate_id:
      annotations:
        foreign_key:
          tag: foreign_key
          value: GRDIIsolate.isolate_id                 # ← link to parent
```

The `isolate_id` column is read-only, inherited from the selected GRDIIsolate row. The combination `(isolate_id, antimicrobial_drug)` must be unique — one test result per drug per isolate.

---

## UI Behaviour

### Tab activation

- A tab with **no foreign-key slots** (i.e. the root parent) is always active.
- A child tab becomes active only after the user selects a row in its parent tab.
- Until a parent row is selected, the child tab is greyed out and cannot accept new rows.

### Row filtering

When a parent row is selected, DH applies a filter on each child tab that matches child rows whose foreign-key column value equals the selected parent key value. Unrelated rows are hidden. Navigating back to the parent tab clears the filter.

### CRUD guards

| Operation | Behaviour |
|-----------|-----------|
| **Create** | New child rows are pre-filled with the parent foreign-key value; the foreign-key column is locked read-only. |
| **Update** | If a parent's primary key is edited, DH cascades the change to all matching foreign-key values in child rows. |
| **Delete** | Deleting a parent row prompts a warning if child rows exist that reference it. Dependent child rows are deleted along with the parent. |
| **Validate** | `identifier` uniqueness and `unique_keys` composite uniqueness are checked. Foreign-key referential integrity (child value exists in parent) is enforced. |

### Read-only foreign-key columns

Columns carrying a `foreign_key` annotation are rendered read-only in the child tab. Their value flows from the parent selection, preventing the user from accidentally re-parenting a child row to a different parent.

---

## More Complex Example: `web/templates/schema_editor/`

The Schema Editor template itself uses the 1-to-many pattern to represent LinkML schema components. Its tables correspond to: Schema (root), Class, Slot, Enum, Prefix, and other schema elements. Each child table has a `foreign_key` pointing to the Schema or Class table. This template also serves as a live editor — users can load an existing `schema.yaml`, edit it across multiple tabs, and save the result. It demonstrates that the 1-to-many pattern extends naturally to schemas with more than three levels of nesting and multiple sibling child tables under one parent.

---

## Building a New 1-to-Many Schema

1. **Define each data class** with its slots. Identify which slot will serve as the primary key for each class.

2. **Add `identifier: true`** to the primary-key slot of each class (or use `unique_keys` for composite keys).

3. **Add a `foreign_key` annotation** to the slot in each child class that references its parent's primary-key slot:
   ```yaml
   slot_usage:
     parent_id_slot:
       annotations:
         foreign_key:
           tag: foreign_key
           value: ParentClassName.parent_id_slot
   ```

4. **Declare `unique_keys`** on each child class. The composite key typically includes both the inherited foreign-key slot(s) and the child's own identifier slot, ensuring that child records are unique within the scope of their parent.

5. **Add a Container class** with `tree_root: true` and multivalued attributes for each data class:
   ```yaml
   Container:
     tree_root: true
     attributes:
       MyParents:
         multivalued: true
         range: MyParent
         inlined_as_list: true
       MyChildren:
         multivalued: true
         range: MyChild
         inlined_as_list: true
   ```

6. Run the schema through the DataHarmonizer build process (`tabular_to_schema.py` or `update_templates.py`) to produce `schema.yaml` and `schema.json`. The `schema.json` file is the SchemaView-resolved representation consumed by the DH JavaScript runtime.
