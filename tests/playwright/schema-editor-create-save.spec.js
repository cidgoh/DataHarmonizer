/* Test the SchemaEditor:
 *   - Load schema_editor.html
 *   - Type directly into the first (minRows) Schema row; entering edit mode triggers
 *     DataHarmonizer's afterBeginEditing hook which fills ifabsent defaults including
 *     root_class = "Container" for any completely-empty row
 *   - Enter schema name and title
 *   - Switch to Table tab, add two tables
 *   - Switch to Slot tab:
 *     - Add schema slot test_field_a (slot_usage linked to TestTable1)
 *     - Add table attribute test_field_b (standalone, not in schema library)
 *     - Add descriptions to both fields after modal confirmation
 *   - Save schema YAML and verify Container class, slots, and class attributes
 *
 * To run headfully during development, set headless: false in playwright.config.js.
 * To run this specific test:
 *   npx playwright test tests/playwright/schema-editor-create-save.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync, mkdirSync } from 'fs';
import YAML from 'yaml';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * HOT renders dropdown/autocomplete cells as "▼Value" (U+25BC arrow prepended).
 * Strip it before doing equality checks in browser-side waitForFunction calls.
 *
 * HOT structure notes:
 *  • Each tbody <tr> starts with a <th> row-number header — use td:nth-of-type(N)
 *    instead of td:nth-child(N) to count only <td> siblings.
 *  • ALL tabs (Schema, Class, Slot) use fixedColumnsLeft: 1, freezing the first
 *    data column in .ht_clone_left. The .ht_master col-0 td is an empty placeholder.
 *  • Schema/Class tabs: col 0 is the name/id field. Use hotCellLocator() which
 *    routes col 0 to .ht_clone_left and col 1+ to .ht_master.
 *  • Slot tab: col 0 (schema_id) is frozen in .ht_clone_left; ht_master tds[0] is
 *    an empty placeholder. Data cols 1-N map to ht_master tds[1]-tds[N].
 *    Use slotCellLocator() which always uses .ht_master tds[colIdx].
 */

/**
 * Wait for text to appear in any td inside any HOT grid.
 * Note: pass options as the third argument (never as the second) so Playwright
 * doesn't mistake them for the `arg` parameter.
 */
// async function waitForCellText(page, text, timeout = 10_000) {
//   await page.waitForFunction(
//     (t) => {
//       function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
//       const tds = document.querySelectorAll('.ht_master.handsontable tbody td');
//       return Array.from(tds).some(td => hotText(td) === t);
//     },
//     text,            // ← passed as the `arg` to the page function
//     { timeout }      // ← options (third argument)
//   );
// }

/**
 * Wait for `text` to appear in at least `count` rows of the given column in
 * the currently-visible (.tab-pane.show) HOT grid.
 * Scoping to .tab-pane.show avoids false positives from hidden panes that
 * remain display:block during Bootstrap's fade transition.
 *
 * fixedColumnsLeft:1 note — col 0 is frozen and rendered only in
 * .ht_clone_left.  Its .ht_master counterpart is an empty/zeroed cell.
 * Route col 0 to .ht_clone_left; all other cols stay in .ht_master.
 * For the Slot tab (no fixedColumnsLeft), always use .ht_master.
 */
async function waitForColCellText(page, colIdx, text, count = 1, timeout = 10_000) {
  await page.waitForFunction(
    ([colIdx, text, count]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show') || document;
      // Col 0 data lives in .ht_clone_left (frozen); other cols in .ht_master.
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const nth   = colIdx === 0 ? 1 : colIdx + 1;
      const sel = `${clone}.handsontable tbody td:nth-of-type(${nth})`;
      const cells = scope.querySelectorAll(sel);
      return Array.from(cells).filter(td => hotText(td) === text).length >= count;
    },
    [colIdx, text, count],
    { timeout }
  );
}

/**
 * Find HOT tbody rows (in the active .tab-pane.show) whose column `colIdx`
 * contains the given text.
 * Col 0 is frozen in .ht_clone_left; other cols are in .ht_master.
 */
// function rowByColText(page, colIdx, text) {
//   const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
//   const nth   = colIdx === 0 ? 1 : colIdx + 1;
//   const scope = page.locator(`.tab-pane.show ${clone}.handsontable tbody tr`);
//   const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   return scope.filter({
//     has: page.locator(`td:nth-of-type(${nth})`, {
//       hasText: new RegExp(escaped),
//     }),
//   });
// }

/**
 * Get the visual row index (0-based) of the first row whose column `colIdx`
 * contains `text`. Returns -1 if not found.
 * Col 0 is frozen in .ht_clone_left; other cols are in .ht_master.
 */
// async function findRowIndex(page, colIdx, text) {
//   return page.evaluate(
//     ([colIdx, text]) => {
//       function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
//       // Col 0 data lives in .ht_clone_left (frozen); other cols in .ht_master.
//       const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
//       const rows = document.querySelectorAll(
//         `.tab-pane.show ${clone}.handsontable tbody tr`
//       );
//       for (let i = 0; i < rows.length; i++) {
//         const tds = rows[i].querySelectorAll('td');
//         // In .ht_clone_left the only column is td[0]; in .ht_master td[N] = col N.
//         const nth = colIdx === 0 ? 0 : colIdx;
//         if (tds[nth] && hotText(tds[nth]) === text) return i;
//       }
//       return -1;
//     },
//     [colIdx, text]
//   );
// }

/**
 * Return a Playwright locator for the cell at (rowIndex, colIdx) that can
 * actually receive pointer events:
 *   - col 0 is frozen in .ht_clone_left → target the left clone
 *   - all other columns are in .ht_master
 *
 * colIdx is 0-based; rowIndex is the 0-based visual row within the active pane.
 * For the Slot tab (no fixedColumnsLeft), use slotCellLocator() instead.
 */
function hotCellLocator(page, rowIndex, colIdx) {
  if (colIdx === 0) {
    // The first data column is frozen and only interactive via .ht_clone_left.
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
 * Target a cell in the Slot tab HOT grid via .ht_master.
 *
 * The Slot tab uses fixedColumnsLeft: 1, but the hidden schema_id (col 0)
 * means the FIRST VISIBLE column is class_id (col 1), which becomes the
 * frozen column rendered in .ht_clone_left.  The .ht_master tds[0] is
 * therefore an empty placeholder for class_id.
 *
 * Pass colIdx as the ht_master td index (0-based):
 *   0 = placeholder for class_id (frozen in clone_left) — don't click
 *   1 = slot_type   ("Type" column)
 *   2 = slot_group  ("Section" column)
 *   3 = name        ("Field ID" column)
 *   4 = rank        ("Ordering" column)
 *   5 = slot_uri    ("Semantic URI" column)
 *   6 = title       ("Title" column)
 *   7 = description ("Description" column)
 */
function slotCellLocator(page, rowIndex, colIdx) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

/**
 * In the Slot tab, find the visual row index of the first row that matches
 * both `name` (ht_master tds[3] = "Field ID" column) and `slotTypeTitle`
 * (ht_master tds[1] = "Type" column display title) in .ht_master.
 *
 * Slot tab ht_master layout (tds[0] is placeholder for frozen class_id):
 *   tds[0]=placeholder, tds[1]=slot_type, tds[2]=slot_group, tds[3]=name
 *
 * HOT renders enum TITLES in the slot_type cell, so pass the display title:
 *   'Schema field'               → base slot row (class_id = '')
 *   'Table field (from schema)'  → slot_usage row
 *   'Table field (stand-alone)'  → attribute row
 *
 * Returns -1 if not found.
 */
async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        // tds[3] = name ("Field ID"), tds[1] = slot_type title ("Type")
        const rowName          = tds[3] ? hotText(tds[3]) : '';
        const rowSlotTypeTitle = tds[1] ? hotText(tds[1]) : '';
        if (rowName === name && rowSlotTypeTitle === slotTypeTitle) return i;
      }
      return -1;
    },
    [name, slotTypeTitle]
  );
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('SchemaEditor: create schema with two tables and verify saved YAML', async ({ page }) => {

  // Capture browser console.log/warn/error for debugging.
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'info') {
      consoleLogs.push(msg.text());
    }
  });

  // ── 1. Load the Schema Editor ────────────────────────────────────────────
  await page.goto('/schema_editor.html');

  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });

  // Wait until HOT has loaded the schema (column header "Schema ID" visible).
  await page.waitForFunction(
    () => {
      const spans = document.querySelectorAll('.htCore th span');
      return Array.from(spans).some(s => s.textContent.trim() === 'Schema ID');
    },
    null,
    { timeout: 15_000 }
  );

  await expect(page.locator('#tab-bar-Schema .nav-link')).toHaveClass(/active/);

  // ── 2. Type schema name directly into the first row ──────────────────────
  // The Schema HOT starts with 5 empty rows (minRows: 5). No need to click
  // Add Row — type directly into row 0, matching the natural spreadsheet
  // workflow a user would follow.
  // Schema ID (name) is the frozen column → use .ht_clone_left (colIdx = 0).
  const nameCell = hotCellLocator(page, 0, 0);
  await nameCell.click();
  await nameCell.dblclick();
  await page.keyboard.type('TestSchema');
  await page.keyboard.press('Tab');

  // ── 3. Verify schema name was accepted ────────────────────────────────────
  await waitForColCellText(page, 0, 'TestSchema', 1, 5_000);

  // ── 4. Type schema title (col 2 in Schema tab, non-frozen → ht_master) ───
  await hotCellLocator(page, 0, 2).dblclick();
  await page.keyboard.type('Test Schema Title');
  await page.keyboard.press('Enter');

  // ── 5. Re-select Schema row so downstream FK lookups find "TestSchema" ────
  await nameCell.click();

  // ── 6. Switch to Table (Class) tab ───────────────────────────────────────
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => {
      const spans = document.querySelectorAll('.htCore th span');
      return Array.from(spans).some(s => s.textContent.trim() === 'Table ID');
    },
    null,
    { timeout: 10_000 }
  );
  // Bootstrap 4 fade animation keeps BOTH panes with .show during the transition.
  // waitForColCellText would find "TestSchema" in the Schema tab's .ht_clone_left
  // (the name field) rather than the Class tab.  Wait for the animation to finish
  // so only the Class pane carries .show before we start querying.
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null,
    { timeout: 5_000 }
  );

  // ── 7. Add first table row ────────────────────────────────────────────────
  await page.click('#add-row');

  // After add-row the FK (schema_id) is set internally in HOT's data model
  // (afterChange fires confirming this), but the frozen col-0 DOM cell may not
  // re-render it immediately.  Wait for the row to appear in the master pane,
  // then type directly into Table ID (col 1) and Title (col 2).
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 1,
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // The Class tab freezes the 'name' (Table ID) column in .ht_clone_left
  // (schema_id at data-col 0 is hidden, so the first visible+frozen col is name).
  // Use colIdx=0 to target clone_left td:nth-of-type(1) = Table ID.
  const tableId1 = hotCellLocator(page, 0, 0);
  await tableId1.click();
  await tableId1.dblclick();
  await page.keyboard.type('TestTable1');
  await page.keyboard.press('Tab');

  // title is the first master column (colIdx=1 → master td:nth-of-type(2)).
  await hotCellLocator(page, 0, 1).dblclick();
  await page.keyboard.type('TestTable1 Title');
  await page.keyboard.press('Enter');

  // ── 8. Add second table row ──────────────────────────────────────────────
  await page.click('#add-row');

  // Wait for a second row to appear in the master pane.
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 2,
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // The new row is appended at the bottom; get its visual index.
  const class2RowIdx = await page.evaluate(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length - 1
  );

  // Same column mapping: colIdx=0 → clone_left (Table ID), colIdx=1 → master (Title).
  await hotCellLocator(page, class2RowIdx, 0).click();
  await hotCellLocator(page, class2RowIdx, 0).dblclick();
  await page.keyboard.type('TestTable2');
  await page.keyboard.press('Tab');

  await hotCellLocator(page, class2RowIdx, 1).dblclick();
  await page.keyboard.type('TestTable2 Title');
  await page.keyboard.press('Enter');

  // ── 9. Switch to Slot (Field) tab ─────────────────────────────────────────
  // TestTable2 remains the active table context (last selected in step 8).
  // The Slot tab filter is set once on first activation: it shows rows where
  // class_id='' (base slots, always visible) OR class_id='TestTable2'.
  // The slot_usage row for TestTable1 (class_id='TestTable1') will be filtered
  // out of the HOT view but still exists in the data model and appears in YAML.
  //
  // Slot tab ht_master column layout (class_id frozen in ht_clone_left):
  //   tds[0]=placeholder, tds[1]=slot_type, tds[2]=slot_group, tds[3]=name,
  //   tds[4]=rank, tds[5]=slot_uri, tds[6]=title, tds[7]=description.
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null,
    { timeout: 5_000 }
  );

  // ── 10. Add schema slot test_field_a via Field Key Modal ──────────────────
  // Clicking #add-row in the Slot tab calls showFieldKeyModal() instead of
  // inserting a raw row — so clicking it opens the Field Key Modal.
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  // Schema ID is pre-filled from the currently selected schema (disabled in
  // single-schema mode). Select table TestTable1 from the class dropdown.
  await page.selectOption('#fkm-class-id', 'TestTable1');
  await page.waitForTimeout(300);  // let rebuildSlotGroupDropdown + updateSlotTypeRow settle

  // Type the snake_case field name — triggers updateSlotTypeRow to show the radio row.
  await page.fill('#fkm-name', 'test_field_a');
  // Wait for the slot-type radio row to appear (field not yet in library → slot_usage default).
  await page.waitForFunction(
    () => document.querySelector('#fkm-slot-type-row')?.style.display !== 'none',
    null,
    { timeout: 3_000 }
  );

  // slot_usage is the default; set explicitly for clarity.
  // Case C: field not yet in schema library → modal auto-inserts a base 'slot'
  // row first, then a 'slot_usage' row linking it to TestTable1.
  await page.check('#fkm-type-slot-usage');

  await page.fill('#fkm-title', 'Test Field A');

  // Confirm: inserts base 'slot' row (schema library entry) + 'slot_usage' row.
  await page.click('#fkm-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  // Wait for the base slot row (class_id='') to appear.
  // The slot_usage row (class_id='TestTable1') is filtered out in the TestTable2
  // context but still exists in the HOT data model and will appear in YAML.
  await page.waitForFunction(
    () => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      let count = 0;
      for (const row of rows) {
        const tds = row.querySelectorAll('td');
        if (tds[3] && hotText(tds[3]) === 'test_field_a') count++;
      }
      return count >= 1;
    },
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // ── 11. Add table-only attribute test_field_b to TestTable2 ─────────────────
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  await page.selectOption('#fkm-class-id', 'TestTable2');
  await page.waitForTimeout(300);

  await page.fill('#fkm-name', 'test_field_b');
  await page.waitForFunction(
    () => document.querySelector('#fkm-slot-type-row')?.style.display !== 'none',
    null,
    { timeout: 3_000 }
  );

  // Choose 'attribute': standalone table field, NOT added to the schema library.
  // One row is inserted: slot_type='attribute', class_id='TestTable2'.
  await page.check('#fkm-type-attribute');

  await page.fill('#fkm-title', 'Test Field B');

  await page.click('#fkm-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  // Wait for the attribute row to appear. tds[3] = name in Slot tab ht_master.
  await page.waitForFunction(
    () => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (const row of rows) {
        const tds = row.querySelectorAll('td');
        if (tds[3] && hotText(tds[3]) === 'test_field_b') return true;
      }
      return false;
    },
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // ── 12. Add description to test_field_b attribute row ─────────────────────
  // Attribute row has slot_type title 'Table field (stand-alone)'.
  const attrRowIdx = await findSlotRowIndex(page, 'test_field_b', 'Table field (stand-alone)');
  expect(attrRowIdx).not.toBe(-1);

  // description = ht_master tds[7] → slotCellLocator colIdx=7 → td:nth-of-type(8).
  const fieldBDescCell = slotCellLocator(page, attrRowIdx, 7);
  await fieldBDescCell.click();
  await fieldBDescCell.dblclick();
  await page.keyboard.type('This is a table attribute, and is not in schema');
  await page.keyboard.press('Tab');

  // ── 13. Add description to test_field_a base slot row ────────────────────
  // Done here (after test_field_b) as a separate action, as required.
  // The base slot row has class_id='' so it is always visible regardless of
  // which table is currently selected (TestTable2 context at this point).
  // Base slot has slot_type title 'Schema field'.
  const baseSlotRowIdx = await findSlotRowIndex(page, 'test_field_a', 'Schema field');
  expect(baseSlotRowIdx).not.toBe(-1);

  // description = ht_master tds[7] → slotCellLocator colIdx=7 → td:nth-of-type(8).
  const fieldADescCell = slotCellLocator(page, baseSlotRowIdx, 7);
  await fieldADescCell.click();
  await fieldADescCell.dblclick();
  await page.keyboard.type('This is a schema slot which is reused by table');
  await page.keyboard.press('Tab');

  // ── 14. Save schema YAML ──────────────────────────────────────────────────
  await page.click('#file-menu-button');

  page.once('dialog', async (dialog) => {
    await dialog.accept('schema.yaml');
  });

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10_000 }),
    page.click('#save-template-button'),
  ]);

  const outputDir = path.resolve('test-results');
  mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, 'test-schema.yaml');
  await download.saveAs(outputFile);
  console.log(`Schema saved to: ${outputFile}`);

  // ── 15. Assert YAML structure ─────────────────────────────────────────────
  const schema = YAML.parse(readFileSync(outputFile, 'utf-8'));

  expect(schema.name).toBe('TestSchema');
  expect(schema.title).toBe('Test Schema Title');

  // Container (root class) is auto-generated with one attribute per non-root class.
  const classes = schema.classes ?? {};
  expect(classes['Container']).toBeDefined();

  const container = classes['Container'];
  expect(container.tree_root).toBe(true);

  const attrs = container.attributes ?? {};
  expect(attrs['TestTable1']).toBeDefined();
  expect(attrs['TestTable2']).toBeDefined();

  expect(attrs['TestTable1'].range).toBe('TestTable1');
  expect(attrs['TestTable1'].multivalued).toBe(true);
  expect(attrs['TestTable1'].inlined_as_list).toBe(true);

  expect(attrs['TestTable2'].range).toBe('TestTable2');
  expect(attrs['TestTable2'].multivalued).toBe(true);
  expect(attrs['TestTable2'].inlined_as_list).toBe(true);

  // test_field_a: added to schema field library (slot) and linked to TestTable1 via slot_usage.
  // The title 'Test Field A' was placed on the slot_usage row by the Field Key Modal;
  // stripping keeps it since the base slot row has no title.
  // The description was added to the base slot row post-modal.
  const slots = schema.slots ?? {};
  expect(slots['test_field_a']).toBeDefined();
  expect(slots['test_field_a'].description).toBe('This is a schema slot which is reused by table');

  const table1 = classes['TestTable1'] ?? {};
  expect(Array.isArray(table1.slots)).toBe(true);
  expect(table1.slots).toContain('test_field_a');

  const slotUsage = table1.slot_usage ?? {};
  expect(slotUsage['test_field_a']).toBeDefined();
  expect(slotUsage['test_field_a'].name).toBe('test_field_a');
  expect(slotUsage['test_field_a'].title).toBe('Test Field A');

  // test_field_b: table-only attribute on TestTable2 — NOT in the schema slots library.
  expect(slots['test_field_b']).toBeUndefined();
  const table2 = classes['TestTable2'] ?? {};
  const table2Attrs = table2.attributes ?? {};
  expect(table2Attrs['test_field_b']).toBeDefined();
  expect(table2Attrs['test_field_b'].title).toBe('Test Field B');
  expect(table2Attrs['test_field_b'].description).toBe('This is a table attribute, and is not in schema');
});
