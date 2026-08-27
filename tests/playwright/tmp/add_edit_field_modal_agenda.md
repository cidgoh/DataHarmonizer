# Add/Edit Field Modal — Playwright Test Agenda

Target schema: **grdi_1m** (loaded via the schema selector)

Each section maps to a discrete test step or `test()` block.
Mark items **[DONE]** as they are covered in the final spec file.

---

## 0. Setup

- Load the app.
- Open the Schema Editor.
- Load / select the **grdi_1m** schema so the Schema tab has it active.
- Navigate to the **Field** (Slot) tab.

---

## 1. Pre-open guard — no schema selected

- Deselect / clear the active schema (or use a fresh load where nothing is highlighted).
- Click the **Add** button at the bottom of the Field tab.
- Assert: modal does NOT open; instead an alert fires containing "Please select a schema".
- Reselect grdi_1m so subsequent tests can proceed.

---

## 2. Expert-user gate on "schema field" type — inline warning behaviour

The "schema field" option is **always visible** in the Type dropdown. Expert mode is
enforced by an inline error message rather than by hiding or disabling the option.

### 2a. Non-expert mode — inline warning on type selection
- Ensure expert mode is OFF (File menu → Toggle expert user mode unchecked).
- Open the Add field modal.
- Assert: the **Type** dropdown contains the "schema field" option and it is **not** disabled.
- Select Type = "schema field".
- Assert: `#fkm-error` is visible and its text contains "Expert user mode is required".
- Assert: the Section input (`#fkm-slot-group-new`) is shown (schema-slot UI renders normally).
- Assert: the Table row is hidden (schema slots have no class, same as expert mode).

### 2b. Non-expert — Save is blocked
- (Continuing from 2a, with schema field selected and a valid Field ID entered.)
- Click **Save field**.
- Assert: modal stays open; `#fkm-error` still contains the expert-mode message.

### 2c. Switching type clears the warning
- While still in non-expert mode, change Type from "schema field" to "table field (from schema)".
- Assert: `#fkm-error` is hidden / empty (warning is cleared immediately on type change).

### 2d. Expert mode ON — no warning
- Enable expert mode (File menu → Toggle expert user mode checked).
- Open the Add field modal; select Type = "schema field".
- Assert: `#fkm-error` is **not** visible (no expert-mode warning).
- (Leave expert mode ON for schema-slot tests below; turn it OFF for slot_usage/attribute tests.)

---

## 3. Schema slot — slot_group dropdown behaviour

- Expert mode ON.
- Open the Add field modal; select Type = "schema field".
- Assert: the Section row shows the **text input** (`#fkm-slot-group-new`) not the select.
- Assert: the Table row is hidden (schema slots have no class).
- The datalist (`#fkm-slot-group-list`) should contain slot_groups taken from grdi_1m
  **schema.slots** entries only — verify at least one known group is present.
- The user can also type a brand-new section name (free text).

---

## 4. Schema slot — collision detection (add)

- Expert mode ON.
- Pick a Field ID that already exists as a schema slot in grdi_1m (e.g. `sample_id`).
- Set Type = "schema field".
- Click **Save field**.
- Assert: error message contains "already exists as a schema field".
- Modal stays open.

---

## 5. Schema slot — rank-aware insertion (add)

### 5a. Insert into existing slot_group
- Expert mode ON.
- Open Add field modal; Type = "schema field".
- Enter a new Field ID (e.g. `test_slot_grouped`) and a Section that already exists
  in grdi_1m (pick a known slot_group).
- Click **Save field**.
- Assert: the new row appears in the Field tab.
- Assert: its rank places it **after** the last existing slot in that slot_group
  (verify the rank value in the cell is greater than the max rank of peers in that group).
- Assert: slots that previously had rank >= new rank have been shifted up by 1.

### 5b. Insert ungrouped, alphabetical by title
- Expert mode ON.
- Open Add field modal; Type = "schema field"; leave Section empty.
- Enter a Field ID / Title chosen to fall alphabetically in the middle of existing
  ungrouped slots (inspect grdi_1m to pick a suitable title).
- Click **Save field**.
- Assert: the new row appears with a rank that places it correctly between its
  alphabetical neighbours.

---

## 6. Class slot — Table required guard (add)

### 6a. slot_usage without a Table
- Open Add field modal; Type = "table field (from schema)" (slot_usage).
- Assert: the **Field ID** row shows the `<select>` (`#fkm-name-select`) picklist, not the
  free-text input (`#fkm-name`).
- Leave the **Table** dropdown unselected (blank).
- Choose any slot from the Field ID picklist.
- Click **Save field**.
- Assert: error message contains "must be selected" (the Table-required message).
- Modal stays open.

### 6b. attribute without a Table
- Change Type to "custom field" (attribute).
- Assert: the **Field ID** row shows the free-text input (`#fkm-name`), not the select.
- Leave the **Table** dropdown unselected (blank).
- Enter any valid Field ID.
- Click **Save field**.
- Assert: error message contains "must be selected".
- Modal stays open.

---

## 7. Class slot — Section input switches to free-text + datalist (add)

### 7a. slot_usage type — Field ID picklist and Section free-text
- Open Add field modal; Type = "table field (from schema)" (slot_usage).
- Assert: the **Field ID** row shows `#fkm-name-select` (a `<select>` picklist of schema
  slot names) and `#fkm-name` (text input) is hidden.
- Assert: `#fkm-name-select` contains at least one known schema slot from grdi_1m
  (e.g. `sample_id`) plus the blank placeholder option.
- Assert: the **Section** row shows `#fkm-slot-group-new` (free-text input), not the
  `<select>` (`#fkm-slot-group`).
- Assert: `#fkm-slot-group-list` datalist is populated with slot_group values that
  already exist for that class's slot_usage / attribute rows.
- Assert: the Section input is **not** disabled (user can type freely or pick from list).

### 7b. slot_usage — auto-fill + lock when base schema slot has a slot_group
- Select a Table and then pick a Field ID from `#fkm-name-select` that corresponds
  to a schema slot which has a known slot_group in grdi_1m (find one by inspecting the schema).
- Assert: `#fkm-slot-group-new` is pre-filled with that slot_group value.
- Assert: `#fkm-slot-group-new` is **disabled** (user cannot override the inherited section).

### 7c. attribute type
- Open Add field modal; Type = "custom field" (attribute).
- Assert: `#fkm-slot-group-new` is shown and **not** disabled.
- Assert: datalist is populated from the class's existing slot_group values.

---

## 8. Slot_usage — collision detection (add)

- Expert mode OFF (or on; slot_usage is always available).
- Open Add field modal; Type = "table field (from schema)" (slot_usage).
- Select a Table that already has a slot_usage for a known field (e.g. class "GRDI" + field `sample_id`).
- Enter Field ID = `sample_id`.
- Click **Save field**.
- Assert: error message contains "already exists in table".
- Modal stays open.

---

## 9. Attribute — collision detection (add)

- Open Add field modal; Type = "custom field" (attribute).
- Select a Table that already has a known attribute.
- Enter a Field ID matching that existing attribute.
- Click **Save field**.
- Assert: error message contains "already exists as a custom field".
- Modal stays open.

---

## 10. Class slot — rank-aware insertion (add)

### 10a. slot_usage — insert into existing slot_group
- Open Add field modal; Type = "table field (from schema)" (slot_usage).
- Pick a Table and a Field ID / Section (slot_group) that already exists in that class.
- Click **Save field**.
- Assert: the new row appears in the Field tab.
- Assert: its rank is **after** the last existing slot_usage in that slot_group
  (rank > max rank of peers in that group).
- Assert: slot_usage rows that previously had rank >= new rank are shifted up by 1.

### 10b. slot_usage — insert ungrouped, alphabetical by title
- Open Add field modal; Type = "table field (from schema)"; leave Section empty.
- Choose a Field ID / Title that falls alphabetically in the middle of existing
  ungrouped slot_usage rows for that class.
- Click **Save field**.
- Assert: the new row's rank places it correctly between its alphabetical neighbours.

### 10c. attribute — rank-aware insertion into existing slot_group
- Open Add field modal; Type = "custom field" (attribute).
- Pick a Table and Section (slot_group) that already has attribute rows.
- Click **Save field**.
- Assert: rank is after the last attribute in that group; peer ranks shift up.

---

## 11. Edit / rename — collision detection

### 11a. Schema slot rename collision
- Expert mode ON.
- Open the Edit modal for an existing schema slot (e.g. `sample_id`).
- Change Field ID to another existing schema slot name.
- Click **Save field**.
- Assert: error message contains "already exists as a schema field".

### 11b. Slot_usage rename collision
- Open the Edit modal for an existing slot_usage row in some class.
- Change Field ID to another slot_usage name in the same class.
- Click **Save field**.
- Assert: error message contains "already exists as a table field".

### 11c. Attribute rename collision
- Open the Edit modal for an existing attribute row.
- Change Field ID to another attribute name in the same class.
- Click **Save field**.
- Assert: error message contains "already exists as a custom field".

---

## 12. Edit mode — schema slot

### 15a. Expert gate — modal opens with warning when non-expert
- Ensure expert mode is OFF.
- Open the Edit modal for an existing schema slot (e.g. `sample_id`).
- Assert: the **Table** row is hidden (schema slots have no class).
- Assert: `#fkm-error` is visible and its text contains "Expert user mode is required".
- Assert: the **Save field** button (`#fkm-confirm-btn`) is disabled.
- Assert: the **Section** row shows `#fkm-slot-group-new` (free-text + datalist), not the select.
- Assert: `#fkm-slot-group-new` is **not** disabled (user can read the current value).

### 15b. Expert gate — Save blocked at confirm handler
- (Continuing from 15a, non-expert mode, schema slot edit modal open.)
- Click **Save field**.
- Assert: modal stays open; error still contains "Expert user mode is required".

### 15c. Expert mode ON — modal opens cleanly
- Enable expert mode.
- Open the Edit modal for the same schema slot.
- Assert: `#fkm-error` is hidden.
- Assert: Save button is enabled.
- Assert: Table row is hidden.
- Assert: `#fkm-slot-group-new` is visible and pre-filled with the slot's current Section value.
- Assert: `#fkm-field-type` dropdown is **disabled** (type cannot be changed in edit mode).

### 15d. Schema slot rename — cascade to slot_usage rows
- Expert mode ON.
- Open Edit modal for a schema slot that has at least one slot_usage row in some class
  (e.g. pick a known slot from grdi_1m that appears in a class's slot_usage list).
- Change Field ID to a new unique name (e.g. `sample_id_renamed`).
- Click **Save field**.
- Assert: modal closes.
- Assert: the schema slot row in the Field tab now shows the new Field ID.
- Assert: every slot_usage row that previously referenced the old Field ID now shows
  the new Field ID (slot_name cascaded).

### 15e. Schema slot slot_group change — cascade to slot_usage rows
- Expert mode ON.
- Open Edit modal for a schema slot that has at least one slot_usage row in some class.
- Change the Section value to a different slot_group (or clear it).
- Click **Save field**.
- Assert: modal closes.
- Assert: the schema slot row shows the updated Section.
- Assert: every slot_usage row that references this slot now shows the updated Section.

### 15f. Schema slot Title change — no cascade needed
- Expert mode ON.
- Open Edit modal for a schema slot; change Title only.
- Click **Save field**.
- Assert: modal closes; the schema slot row shows the new title.
- Assert: slot_usage rows for this slot that have an empty title still show the
  inherited title (UI displays inherited value from base slot, no explicit update required).

---

## 13. Edit mode — slot_usage type conversion (slot_usage → attribute)

### 16a. "Change type" checkbox and label
- Open the Edit modal for an existing slot_usage row.
- Assert: the **Change type** row (`#fkm-slot-type-row`) is visible.
- Assert: the checkbox label contains "change to custom field" (or equivalent applyDhTerms text).
- Assert: the **Section** row shows `#fkm-slot-group` (select dropdown), not `#fkm-slot-group-new`.
- Assert: the checkbox is unchecked initially.

### 16b. "Copy inherited" row shown when checkbox checked
- Check the **Change type** checkbox.
- Assert: `#fkm-copy-inherited-row` becomes visible.
- Assert: the copy-inherited checkbox (`#fkm-copy-inherited`) is checked by default.
- Uncheck the Change type checkbox.
- Assert: `#fkm-copy-inherited-row` is hidden again.

### 16c. Save without "Copy inherited" — type changes, no base-slot values copied
- Check **Change type** checkbox; uncheck `#fkm-copy-inherited`.
- Click **Save field**.
- Assert: modal closes.
- Assert: the row's slot_type column now reads `attribute`.
- Assert: cells that were previously empty (inheriting from base slot) remain empty.

### 16d. Save with "Copy inherited" — inherited values written to converted row
- Open Edit modal for a slot_usage row that has at least one empty cell with a
  non-empty value in the corresponding schema slot.
- Check **Change type**; leave **Copy inherited** checked.
- Click **Save field**.
- Assert: modal closes; slot_type is now `attribute`.
- Assert: previously-empty cells that had non-empty base slot values now contain
  those values explicitly.

---

## 14. Edit mode — attribute type conversion (attribute → slot_usage)

### 17a. "Change type" checkbox — disabled when no matching schema slot
- Open Edit modal for an attribute row whose Field ID does NOT exist as a schema slot.
- Assert: **Change type** row is visible.
- Assert: the checkbox is **disabled**.
- Assert: the label contains "no matching schema field found" (or similar text).
- Assert: the **Section** row shows `#fkm-slot-group-new` (free-text input), not the select.

### 17b. Section allows new slot_group entry
- (Continuing from 17a or any attribute edit modal.)
- Assert: `#fkm-slot-group-new` is visible and **not** disabled.
- Type a new slot_group name not present in the datalist.
- Click **Save field** (type unchanged — still attribute).
- Assert: modal closes; the row shows the new Section value.

### 17c. "Change type" checkbox — enabled when a matching schema slot exists
- Open Edit modal for an attribute row whose Field ID **does** exist as a schema slot.
- Assert: the **Change type** checkbox is **enabled**.
- Assert: the label contains "from matching schema field" (or similar text).

### 17d. Save with type change blocked when no schema slot (confirm handler backstop)
- Open Edit modal for an attribute with no matching schema slot.
- Force-enable the checkbox via browser devtools (or simulate the guard bypassed),
  check the checkbox, and click **Save field**.
  *(Alternatively: test that the guard in updateSlotTypeRow prevents the checkbox
  from being checked normally — confirm 17a is sufficient and skip this step.)*
- If testing the backstop: Assert error contains "no matching schema slot".

### 17e. Successful attribute → slot_usage conversion
- Open Edit modal for an attribute whose Field ID exists as a schema slot in grdi_1m.
- Assert: **Change type** checkbox is enabled.
- Check it; click **Save field**.
- Assert: modal closes.
- Assert: the row's slot_type is now `slot_usage`.
- Assert: cells in the converted row that were empty now contain the base schema slot's
  non-empty values (inherited values copied to empty cells).
- Assert: cells that had explicit attribute values are **not** overwritten.

### 17f. Attribute → schema slot type is not possible
- Open Edit modal for any attribute row.
- Assert: the **Type** dropdown (`#fkm-field-type`) is disabled (no type switch in edit mode).
- Assert: there is no UI path to set type = `slot` from an attribute edit.

---

## 15. File load — schema.slots positional rank

- Load grdi_1m.
- On the Field tab, filter / sort to show schema slots (slot_type = slot, no class_id).
- Assert: every schema slot has a non-null integer rank (1, 2, 3 … in file order).
- Assert: no two schema slots for grdi_1m share the same rank.

---

## 16. File load — slot_usage positional rank

- After loading grdi_1m, filter Field tab to slot_usage rows for at least one class.
- Assert: each slot_usage row has a non-null integer rank matching its position
  in the class's slot_usage dictionary (1-based).

---

## 17. File round-trip — schema.slots rank NOT saved

- Load grdi_1m, save the schema (File → Save schema).
- Inspect the downloaded YAML (or capture via SchemaEditor's _buildSchemaYaml).
- Assert: the `slots:` block does NOT contain any `rank:` keys.
- Assert: the `classes[*].slot_usage[*]` block DOES contain `rank:` keys.

---

## Notes

- Helper: use `playwright_utils.js` for common selectors / wait patterns.
- Schema used: grdi_1m — confirm the exact schema name string used in the dropdown.
- For rank assertions, read the HOT cell value via `page.evaluate()` or compare
  the rendered cell text in the Field tab after sorting by rank.
