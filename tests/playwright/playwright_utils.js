/**
 * Shared Playwright helpers for DataHarmonizer SchemaEditor tests.
 *
 * HOT grid layout quick-reference
 * ─────────────────────────────────────────────────────────────────────────────
 * Schema / Class tabs
 *   Col 0 is frozen in .ht_clone_left (name / Table ID).
 *   All other cols are in .ht_master, 1-based td index = colIdx + 1.
 *
 * Slot (Field) tab  — fixedColumnsLeft:1; hidden schema_id (col 0) means
 *   class_id (col 1) is the frozen column in .ht_clone_left.
 *   .ht_master tds (0-based):
 *     tds[0]  = placeholder for frozen class_id
 *     tds[1]  = slot_type  ("Type")
 *     tds[2]  = slot_group ("Section")
 *     tds[3]  = name       ("Field ID")   ← KEY_COLUMN: left-click opens FKM
 *     tds[4]  = rank       ("Ordering")
 *     tds[5]  = slot_uri
 *     tds[6]  = title
 *     tds[7]  = description
 *     tds[12] = required   (checkbox)
 *     tds[13] = recommended (checkbox)
 *
 * HOT prepends ▼ (U+25BC) to dropdown/autocomplete cells — strip before
 * any text comparison.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Return a Playwright locator for the cell at (rowIndex, colIdx) in the
 * Schema or Class tab HOT grid:
 *   - col 0 is frozen → targets .ht_clone_left
 *   - other cols → targets .ht_master td:nth-of-type(colIdx + 1)
 *
 * For the Slot tab use slotCellLocator() instead.
 */
export function hotCellLocator(page, rowIndex, colIdx) {
  if (colIdx === 0) {
    return page
      .locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
      .nth(rowIndex)
      .locator('td:nth-of-type(1)');
  }
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

/**
 * Return a Playwright locator for the cell at (rowIndex, colIdx) in the
 * Slot/Field tab .ht_master grid.
 *
 * The Slot tab freezes class_id in .ht_clone_left; .ht_master tds[0] is an
 * empty placeholder.  Pass colIdx as the 0-based .ht_master td index:
 *   0 = placeholder (frozen class_id — don't click)
 *   1 = slot_type, 2 = slot_group, 3 = name, 4 = rank, 5 = slot_uri,
 *   6 = title, 7 = description, 12 = required, 13 = recommended
 *
 * KEY_COLUMNs (slot_type, slot_group, name, class_id, schema_name):
 *   left-click opens the Field Key Modal; right-click opens the context menu.
 */
export function slotCellLocator(page, rowIndex, colIdx) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

/**
 * Find the 0-based DOM row index of a slot row matching both `name` (tds[3])
 * and `slotTypeTitle` (tds[1]) in the currently active tab's .ht_master.
 * Returns -1 if not found.
 *
 * HOT renders enum titles in the slot_type cell; pass the display title:
 *   'Schema field'              → base slot   (slot_type = 'slot')
 *   'Table field (from schema)' → slot_usage  (slot_type = 'slot_usage')
 *   'Table field (stand-alone)' → attribute   (slot_type = 'attribute')
 */
export async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows  = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        if (ht(tds[3]) === name && ht(tds[1]) === slotTypeTitle) return i;
      }
      return -1;
    },
    [name, slotTypeTitle]
  );
}

/**
 * Find the 0-based DOM row index of the first row whose column `colIdx`
 * contains `text` in the active tab's HOT grid.
 * Col 0 is searched in .ht_clone_left; other cols in .ht_master.
 * Returns -1 if not found.
 */
export async function findRowIndex(page, colIdx, text) {
  return page.evaluate(
    ([colIdx, text]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const rows  = document.querySelectorAll(`.tab-pane.show ${clone}.handsontable tbody tr`);
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        const nth = colIdx === 0 ? 0 : colIdx;
        if (tds[nth] && ht(tds[nth]) === text) return i;
      }
      return -1;
    },
    [colIdx, text]
  );
}

/**
 * Scroll the Slot/Field tab HOT down incrementally until the row matching
 * `name` + `slotTypeTitle` appears in the DOM, then return its DOM index.
 * Returns -1 if not found within `timeout` ms.
 *
 * Needed for large schemas where HOT's virtual rendering omits off-screen rows.
 */
export async function scrollToSlotRow(page, name, slotTypeTitle, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const idx = await findSlotRowIndex(page, name, slotTypeTitle);
    if (idx !== -1) return idx;
    // Scroll the HOT master wrapper down 300 px and wait for re-render.
    await page.evaluate(() => {
      const holder = document.querySelector('.tab-pane.show .ht_master .wtHolder');
      if (holder) holder.scrollTop += 300;
    });
    await page.waitForTimeout(200);
  }
  return -1;
}
