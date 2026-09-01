/**
 * Shared Playwright helpers for DataHarmonizer SchemaEditor tests.
 *
 * HOT grid layout quick-reference
 * ─────────────────────────────────────────────────────────────────────────────
 * Schema / Class tabs
 *   Col 0 is frozen in .ht_clone_left (name / Table ID).
 *   All other cols are in .ht_master, 1-based td index = colIdx + 1.
 *
 * Slot (Field) tab — fixedColumnsLeft=2 (in key + concise-view mode).
 *   slot_type (col 1) is frozen in .ht_clone_left AND still rendered in
 *   .ht_master.  schema_id (col 0) may or may not be hidden:
 *
 *   • When schema_id IS hidden by concise view (e.g. loaded GRDI 1M):
 *     HOT 15 removes the td entirely from ht_master.
 *     tds[0] = slot_type, tds[1] = class_id, tds[2] = slot_group,
 *     tds[3] = name ("Field ID"), tds[4] = rank, tds[5] = slot_uri,
 *     tds[6] = title, tds[7] = description
 *
 *   • When schema_id is NOT hidden (e.g. fresh schema with no FK relations):
 *     tds[0] = schema_id, tds[1] = slot_type, tds[2] = class_id,
 *     tds[3] = slot_group, tds[4] = name ("Field ID"), tds[5] = rank,
 *     tds[6] = slot_uri, tds[7] = title, tds[8] = description
 *
 *   To avoid depending on the exact index, use slotNameCellLocator() and
 *   findSlotRowIndex() which identify the name column by the CSS class
 *   "field-id-bold" added by SchemaEditor's cells() callback.
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
 * CAUTION: the td index in .ht_master depends on whether schema_id is hidden
 * by concise view (see header comment).  Prefer slotNameCellLocator() for the
 * name ("Field ID") column, which uses the "field-id-bold" CSS class instead
 * of a fixed index.
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
 * Return a Playwright locator for the name ("Field ID") cell of a slot row in
 * .ht_master, using the "field-id-bold" CSS class added by SchemaEditor's
 * cells() callback.  Works regardless of whether schema_id is hidden.
 *
 * Double-clicking this cell opens the Field Key Modal.
 */
export function slotNameCellLocator(page, rowIndex) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator('td.field-id-bold');
}

/**
 * Find the 0-based DOM row index of a slot row matching both `name` and
 * `slotTypeTitle` in the currently active tab's .ht_master.
 * Returns -1 if not found.
 *
 * Pass the display title:
 *   'Schema field'              → base slot   (slot_type = 'slot')
 *   'Table field (from schema)' → slot_usage  (slot_type = 'slot_usage')
 *   'Table field (stand-alone)' → attribute   (slot_type = 'attribute')
 *
 * The name cell is located by the "field-id-bold" CSS class added by
 * SchemaEditor's cells() callback — this works regardless of whether schema_id
 * is hidden by concise view (HOT 15 removes hidden-column tds from the DOM,
 * so a fixed td index is unreliable across schema configurations).
 *
 * The slot type is matched by the CSS class that SchemaEditor adds to every td
 * in the row (e.g. 'slot_usage', 'slot', 'attribute').  The text content of
 * the first td is used as a fallback for non-SchemaEditor grids.
 */
export async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      // Map display titles to the CSS class added by SchemaEditor's cells() callback.
      const titleToClass = {
        'Schema field':              'slot',
        'Table field (from schema)': 'slot_usage',
        'Table field (stand-alone)': 'attribute',
      };
      const cssClass = titleToClass[slotTypeTitle] || null;
      const scope = document.querySelector('.tab-pane.show');
      const rows  = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds     = rows[i].querySelectorAll('td');
        const tdArr   = Array.from(tds);
        // Locate the name cell by CSS class (robust across schema configurations).
        const nameTd  = tdArr.find(td => td.classList.contains('field-id-bold'));
        if (!nameTd || ht(nameTd) !== name) continue;
        // Primary: CSS class check (SchemaEditor adds slot_type as a class to every td).
        // Fallback: text content of tds[0] (first visible td).
        const matchesCss = cssClass && tdArr.some(td => td.classList.contains(cssClass));
        if (!matchesCss && ht(tds[0]) !== slotTypeTitle) continue;
        return i;
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
 *
 * Always resets scrollTop to 0 first so rows that sort to the top after a
 * tab refresh (re-sort) are found even when the saved scroll position was
 * further down the list.
 */
export async function scrollToSlotRow(page, name, slotTypeTitle, timeout = 20_000) {
  // Reset to the top so we scan from the beginning regardless of the
  // previously-saved scroll position.
  await page.evaluate(() => {
    const holder = document.querySelector('.tab-pane.show .ht_master .wtHolder');
    if (holder) holder.scrollTop = 0;
  });
  await page.waitForTimeout(200);
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
