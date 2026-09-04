/* SchemaEditor tests that work with a fresh schema (no file upload):
 *
 *   1. SchemaEditor: create schema with two tables and verify saved YAML
 *      Full end-to-end: create a schema, add two table classes, add fields
 *      (schema slot + table attribute) via the Field Key Modal, add descriptions,
 *      save as YAML, and assert the LinkML structure.
 *
 *   2. SchemaEditor: no spurious cascade dialog when naming a new picklist
 *      Regression: a brand-new Enum row must not trigger a cascade-key-change
 *      dialog because its enum_id is still empty.
 *
 *   3. Schema tab: all typed characters reach the cell (4 input patterns)
 *      Regression: clicking a fresh Schema tab row must not swallow the first
 *      keypress.  Four interaction patterns are each tested in isolation.
 *
 * Run all:
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

// ── Test ──────────────────────────────────────────────────────────────────────

test('SchemaEditor: create schema with two tables and verify saved YAML', async ({ page }) => {
  test.setTimeout(60_000);

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
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

  // ── 9.5. Enable expert user mode ─────────────────────────────────────────
  // Creating a schema-level slot (type = 'slot') in the FKM requires expert
  // mode.  Enable it before opening the modal so the confirm button is active.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 10a. Create base schema slot 'test_field_a' ───────────────────────────
  // The FKM now requires two separate operations to create a schema slot + its
  // slot_usage link.  First: add the base schema slot (type = 'slot').
  // This registers 'test_field_a' in the slot library so step 10b can reference
  // it from the slot_usage strict-picklist dropdown.
  //
  // Clicking #add-row in the Slot tab calls showFieldKeyModal() instead of
  // inserting a raw row.
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  // Scope all interactions to the visible modal (#field-key-modal.show) so that
  // Playwright does not accidentally target one of the other 10 hidden instances.
  {
    const fkm = page.locator('#field-key-modal.show');
    // Switch type to 'slot' (schema-level field, expert only).
    await fkm.locator('#fkm-field-type').selectOption('slot');
    await page.waitForTimeout(300);   // let updateSlotTypeRow show #fkm-name input
    await fkm.locator('#fkm-name').fill('test_field_a');
    await fkm.locator('#fkm-title').fill('Test Field A');
    await fkm.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null,
      { timeout: 5_000 }
    );
  }

  // ── 10b. Add slot_usage of test_field_a to TestTable1 ────────────────────
  // Second: link the base schema slot to TestTable1 as a slot_usage row.
  // The FKM defaults to type='slot_usage' on re-open.  The strict picklist
  // (#fkm-name-select) is populated from the HOT source data and now includes
  // 'test_field_a' from step 10a.
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  {
    const fkm = page.locator('#field-key-modal.show');
    // Type defaults to 'slot_usage' on each FKM open — no explicit set needed.
    await fkm.locator('#fkm-class-id').selectOption('TestTable1');
    await page.waitForTimeout(300);   // let rebuildSlotGroupDropdown settle
    await fkm.locator('#fkm-name-select').selectOption('test_field_a');
    await page.waitForTimeout(200);   // let updateSlotTypeRow pre-fill title
    await fkm.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null,
      { timeout: 5_000 }
    );
  }

  // Wait for the base slot row to exist in the HOT source data.
  // Checking source data directly is more reliable than DOM cell text because
  // it is independent of the concise-view frozen-column layout.
  await page.waitForFunction(
    () => {
      const dh = window._appContext?.dhs?.Slot;
      if (!dh?.hot) return false;
      return dh.hot.getSourceData().some(r => r[dh.slot_name_column] === 'test_field_a');
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

  {
    const fkm2 = page.locator('#field-key-modal.show');
    await fkm2.locator('#fkm-class-id').selectOption('TestTable2');
    // Switch to 'attribute' first — this shows #fkm-name (the free-text input).
    // In the default 'slot_usage' mode #fkm-name is hidden; without switching
    // the type first, the fill() call below would fail with "not visible".
    await fkm2.locator('#fkm-field-type').selectOption('attribute');
    await page.waitForTimeout(300);   // let updateSlotTypeRow show #fkm-name input

    await fkm2.locator('#fkm-name').fill('test_field_b');
    await fkm2.locator('#fkm-title').fill('Test Field B');
    await fkm2.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null,
      { timeout: 5_000 }
    );
  }

  // Wait for the attribute row to exist in HOT source data.
  await page.waitForFunction(
    () => {
      const dh = window._appContext?.dhs?.Slot;
      if (!dh?.hot) return false;
      return dh.hot.getSourceData().some(r => r[dh.slot_name_column] === 'test_field_b');
    },
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // ── 12. Add description to test_field_b attribute row ─────────────────────
  // Attribute row has slot_type title 'Table field (stand-alone)'.
  const attrRowIdx = await findSlotRowIndex(page, 'test_field_b', 'Table field (stand-alone)');
  expect(attrRowIdx).not.toBe(-1);

  // description = ht_master tds[8] → slotCellLocator colIdx=8 → td:nth-of-type(9).
  const fieldBDescCell = slotCellLocator(page, attrRowIdx, 8);
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

  // description = ht_master tds[8] → slotCellLocator colIdx=8 → td:nth-of-type(9).
  const fieldADescCell = slotCellLocator(page, baseSlotRowIdx, 8);
  await fieldADescCell.click();
  await fieldADescCell.dblclick();
  await page.keyboard.type('This is a schema slot which is reused by table');
  await page.keyboard.press('Tab');

  // Editing a base-slot attribute triggers the "Schema field updated" info
  // dialog (dhAlert) that lists the inheriting tables.  It has a single "OK"
  // button — wait for the modal to be visible, then dismiss it.
  try {
    await page.waitForSelector('#dh-dialog-modal.show', { timeout: 3_000 });
    await page.click('#dh-dialog-ok');
    await page.waitForFunction(
      () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
      null,
      { timeout: 5_000 }
    );
  } catch (_) {
    // No propagation dialog appeared — OK to continue.
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

// ── Shared helpers for picklist and typing regression tests ───────────────────

/**
 * Wait for the Schema Editor to finish loading (loading screen hidden,
 * HOT initialised, 'Schema ID' column header visible).
 */
async function waitForSchemaEditor(page) {
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
            .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );
  await expect(page.locator('#tab-bar-Schema .nav-link')).toHaveClass(/active/);
}

/**
 * Navigate to a tab and wait for its pane to become the only visible one.
 */
async function goToTab(page, tabBarId) {
  await page.click(`${tabBarId} > a`);
  await page.waitForFunction(
    (id) => document.querySelector(`${id} .nav-link`)?.classList.contains('active'),
    tabBarId, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
}

/** Wait for `text` to appear in clone-left (col 0) of the active tab pane. */
async function waitForCloneCellText(page, text, timeout = 8_000) {
  await page.waitForFunction(
    (t) => {
      const ht = el => (el?.textContent ?? '').replace(/\u25bc/g, '').trim();
      const scope = document.querySelector('.tab-pane.show');
      if (!scope) return false;
      return Array.from(scope.querySelectorAll('.ht_clone_left.handsontable tbody td'))
               .some(td => ht(td) === t);
    },
    text,
    { timeout }
  );
}

/** Click cell, double-click to open editor, type value, confirm with Tab. */
async function typeIntoCell(page, cell, value) {
  await cell.click();
  await cell.dblclick();
  await page.keyboard.type(value);
  await page.keyboard.press('Tab');
}

/** Read the visible text of the Schema-ID (frozen col-0) cell of row `ri`. */
async function schemaIdCellText(page, ri = 0) {
  return page.evaluate((ri) => {
    function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
    const scope = document.querySelector('.tab-pane.show');
    const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[ri];
    return ht(row?.querySelector('td'));
  }, ri);
}


// ── Picklist cascade regression ───────────────────────────────────────────────

test.describe('SchemaEditor: picklist cascade regression', () => {
  /* Regression: no spurious cascade-key-change dialog when naming a new picklist.
   *
   * Steps: create schema_a, add picklist PA with choices a/b/c, then add a new
   * empty picklist PB and type its name.  The system must NOT show a dialog
   * claiming existing PermissibleValue records will be changed (the bug was that
   * the search used only schema_id, finding PA's PVs because PB's enum_id was
   * still empty).
   */
  test('no spurious cascade dialog when naming a new picklist', async ({ page }) => {

    page.on('console', msg => {
      if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
    });

    // ── 1. Load ──────────────────────────────────────────────────────────────
    await page.goto('/schema_editor.html');
    await waitForSchemaEditor(page);

    // ── 2. Create schema_a ───────────────────────────────────────────────────
    await typeIntoCell(page, hotCellLocator(page, 0, 0), 'schema_a');
    await waitForCloneCellText(page, 'schema_a');
    await hotCellLocator(page, 0, 0).click();

    // ── 3. Go to Enum (Picklist) tab ─────────────────────────────────────────
    await goToTab(page, '#tab-bar-Enum');

    // ── 4. Add picklist PA ───────────────────────────────────────────────────
    await page.click('#add-row');
    await page.waitForTimeout(300);
    await typeIntoCell(page, hotCellLocator(page, 0, 0), 'PA');
    await waitForCloneCellText(page, 'PA');
    await hotCellLocator(page, 0, 0).click();

    // ── 5. Go to PermissibleValue tab and add choices a, b, c ────────────────
    await goToTab(page, '#tab-bar-PermissibleValue');

    for (const choice of ['a', 'b', 'c']) {
      await page.click('#add-row');
      await page.waitForTimeout(300);
      const rowCount = await page.evaluate(
        () => document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody tr').length
      );
      await typeIntoCell(page, hotCellLocator(page, rowCount - 1, 0), choice);
      await waitForCloneCellText(page, choice);
    }

    // ── 6. Return to Enum tab ────────────────────────────────────────────────
    await goToTab(page, '#tab-bar-Enum');
    await waitForCloneCellText(page, 'PA');

    // ── 7. Add a new empty picklist PB ───────────────────────────────────────
    await page.click('#add-row');
    await page.waitForFunction(
      () => document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody tr').length >= 2,
      null, { timeout: 10_000 }
    );
    await page.waitForTimeout(300);

    const pbRowIdx = await page.evaluate(
      () => document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody tr').length - 1
    );

    // ── 8. Type 'PB' — must NOT trigger any dialog ───────────────────────────
    const dialogs = [];
    page.once('dialog', async (dialog) => {
      dialogs.push({ type: dialog.type(), message: dialog.message() });
      await dialog.accept();
    });

    await typeIntoCell(page, hotCellLocator(page, pbRowIdx, 0), 'PB');
    await page.waitForTimeout(500);

    // ── 9. Assert: no Bootstrap modal should have appeared ────────────────────
    const modalVisible = await page.evaluate(
      () => document.querySelector('#dh-dialog-modal')?.classList.contains('show') ?? false
    );
    expect(
      modalVisible,
      'No cascade-key-change Bootstrap modal should appear when naming a brand-new picklist'
    ).toBe(false);

    await waitForCloneCellText(page, 'PB');
  });
});

// ── Schema tab typing regression ──────────────────────────────────────────────

test.describe('Schema tab: all typed characters reach the cell', () => {
  /* Regression: first character typed into a fresh Schema tab row was silently
   * dropped.  The cause: clicking a new row triggers afterSelection →
   * refreshMenusForTab, which disrupts HOT's keyboard-listener state so the
   * first keypress opens the editor but is not recorded as text.
   *
   * Four input patterns are each verified in a fresh browser context.
   */

  test('Case A – single click then type "Test" (raw user workflow)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaEditor(page);

    const cell = hotCellLocator(page, 0, 0);
    await cell.click();
    await page.keyboard.type('Test');
    await page.keyboard.press('Tab');

    await page.waitForFunction(
      () => {
        function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
        const scope = document.querySelector('.tab-pane.show');
        const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[0];
        return ht(row?.querySelector('td')).length > 0;
      },
      null, { timeout: 3_000 }
    ).catch(() => {});

    const domVal = await schemaIdCellText(page, 0);
    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case B – double-click then type "Test" (enters edit mode explicitly)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaEditor(page);

    const cell = hotCellLocator(page, 0, 0);
    await cell.dblclick();
    await page.keyboard.type('Test');
    await page.keyboard.press('Tab');

    await page.waitForFunction(
      () => {
        function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
        const scope = document.querySelector('.tab-pane.show');
        const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[0];
        return ht(row?.querySelector('td')).length > 0;
      },
      null, { timeout: 3_000 }
    ).catch(() => {});

    const domVal = await schemaIdCellText(page, 0);
    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case C – single click, press Enter to open editor, then type "Test"', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaEditor(page);

    const cell = hotCellLocator(page, 0, 0);
    await cell.click();
    await page.keyboard.press('Enter');
    await page.keyboard.type('Test');
    await page.keyboard.press('Tab');

    await page.waitForFunction(
      () => {
        function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
        const scope = document.querySelector('.tab-pane.show');
        const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[0];
        return ht(row?.querySelector('td')).length > 0;
      },
      null, { timeout: 3_000 }
    ).catch(() => {});

    const domVal = await schemaIdCellText(page, 0);
    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case D – single click, small delay, then type "Test" (lets setTimeout(0) flush first)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaEditor(page);

    const cell = hotCellLocator(page, 0, 0);
    await cell.click();
    // Give the deferred refreshMenusForTab time to complete before typing.
    await page.waitForTimeout(100);
    await page.keyboard.type('Test');
    await page.keyboard.press('Tab');

    await page.waitForFunction(
      () => {
        function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
        const scope = document.querySelector('.tab-pane.show');
        const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[0];
        return ht(row?.querySelector('td')).length > 0;
      },
      null, { timeout: 3_000 }
    ).catch(() => {});

    const domVal = await schemaIdCellText(page, 0);
    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });
});
