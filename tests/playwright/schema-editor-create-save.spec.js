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
import { hotCellLocator, slotCellLocator, findSlotRowIndex } from './playwright_utils.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

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
 * Returns the visible name (frozen clone-left cell text) of the currently
 * selected row in the active tab pane.  Falls back to reading the clone-left
 * cell at the same visual index as the ht_master selected cell.
 */
async function getSelectedRowName(page) {
  return page.evaluate(() => {
    const text = el => (el?.textContent ?? '').replace(/\u25bc/g, '').trim();
    const scope = document.querySelector('.tab-pane.show');
    if (!scope) return null;
    // Frozen clone-left cell carries .current when that column is selected.
    const frozen = scope.querySelector('.ht_clone_left.handsontable tbody td.current');
    if (frozen) return text(frozen);
    // Otherwise find the selected master cell and map back to the clone row.
    const cur = scope.querySelector('.ht_master.handsontable tbody td.current');
    if (!cur) return null;
    const allMasterRows = scope.querySelectorAll('.ht_master.handsontable tbody tr');
    const ri = Array.from(allMasterRows).indexOf(cur.closest('tr'));
    if (ri < 0) return null;
    const cloneRow = scope.querySelectorAll('.ht_clone_left.handsontable tbody tr')[ri];
    return text(cloneRow?.querySelector('td'));
  });
}

/**
 * Click a tab nav-link and wait for the Bootstrap transition to finish so
 * that exactly one .tab-pane carries .show.
 */
async function waitForTabActive(page, tabBarId) {
  await page.waitForFunction(
    (id) => document.querySelector(`${id} .nav-link`)?.classList.contains('active'),
    tabBarId,
    { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null,
    { timeout: 5_000 }
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

  // Type the snake_case field name.  In Add mode the type is set by the
  // #fkm-field-type dropdown (defaults to slot_usage / table field).
  await page.fill('#fkm-name', 'test_field_a');
  // slot_usage is the default — Case C: field not yet in schema library →
  // modal auto-inserts a base 'slot' row + a 'slot_usage' row for TestTable1.

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

  // Choose 'attribute' via the Type dropdown: standalone table field, NOT added
  // to the schema library.  One row is inserted: slot_type='attribute', class_id='TestTable2'.
  await page.selectOption('#fkm-field-type', 'attribute');

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
  // Schema slot rows (slot_type='slot') are hidden by default via _slotTypeFilter;
  // make them visible before searching.  Base slot has slot_type title 'Schema field'.
  await page.evaluate(() => {
    const dh = window._appContext?.dhs?.Slot;
    dh?._slotTypeFilter?.add('slot');
    dh?.hot?.render();
  });
  await page.waitForTimeout(300);
  const baseSlotRowIdx = await findSlotRowIndex(page, 'test_field_a', 'Schema field');
  expect(baseSlotRowIdx).not.toBe(-1);

  // description = ht_master tds[7] → slotCellLocator colIdx=7 → td:nth-of-type(8).
  const fieldADescCell = slotCellLocator(page, baseSlotRowIdx, 7);
  await fieldADescCell.click();
  await fieldADescCell.dblclick();
  await page.keyboard.type('This is a schema slot which is reused by table');
  await page.keyboard.press('Tab');

  // Editing a base-slot attribute triggers the "Schema field updated" propagation
  // dialog (Part C of slot inheritance).  Give it a moment to appear, then
  // dismiss it with "Keep existing table values" so the test can continue.
  await page.waitForTimeout(400);
  const propagateModal = page.locator('#dh-dialog-modal.show');
  if (await propagateModal.count() > 0) {
    await page.locator('#dh-dialog-modal .modal-footer .btn')
      .filter({ hasText: 'Keep existing table values' })
      .click();
    await page.waitForFunction(
      () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
      null,
      { timeout: 5_000 }
    );
  }

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
  // The Field Key Modal writes the title to the BASE slot so that all slot_usage
  // rows inherit it automatically (LinkML semantics).  The slot_usage row does
  // NOT duplicate the title.  The description was typed into the base slot row
  // post-modal (step 13).
  const slots = schema.slots ?? {};
  expect(slots['test_field_a']).toBeDefined();
  expect(slots['test_field_a'].title).toBe('Test Field A');
  expect(slots['test_field_a'].description).toBe('This is a schema slot which is reused by table');

  const table1 = classes['TestTable1'] ?? {};
  expect(Array.isArray(table1.slots)).toBe(true);
  expect(table1.slots).toContain('test_field_a');

  const slotUsage = table1.slot_usage ?? {};
  expect(slotUsage['test_field_a']).toBeDefined();
  expect(slotUsage['test_field_a'].name).toBe('test_field_a');
  // title is inherited from the base slot; slot_usage does not duplicate it.
  expect(slotUsage['test_field_a'].title).toBeUndefined();

  // test_field_b: table-only attribute on TestTable2 — NOT in the schema slots library.
  expect(slots['test_field_b']).toBeUndefined();
  const table2 = classes['TestTable2'] ?? {};
  const table2Attrs = table2.attributes ?? {};
  expect(table2Attrs['test_field_b']).toBeDefined();
  expect(table2Attrs['test_field_b'].title).toBe('Test Field B');
  expect(table2Attrs['test_field_b'].description).toBe('This is a table attribute, and is not in schema');
});

