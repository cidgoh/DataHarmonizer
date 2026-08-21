/* Test: cancogen_field_type_change
 *
 * Verifies that changing a field's type from slot_usage to attribute via the
 * Edit Field dialog is reflected in the HOT source data immediately after the
 * first-ever use of the dialog in a session — i.e. the fix for the bug where
 * the first FKM save appeared to do nothing visually.
 *
 * Setup mirrors the first five steps of UX_task_1_covid19.spec.js:
 *   1. Load the Schema Editor
 *   2. Upload web/templates/canada_covid19/schema.yaml
 *   3. Enable Expert User mode
 *   4. Navigate to Class tab → select CanCOGeNCovid19
 *   5. Switch to Field (Slot) tab
 *
 * Test action (first-ever FKM use in this session):
 *   6. Find the slot_usage row for specimen_collector_sample_id
 *   7. Click its Field ID cell → Edit Field dialog opens
 *   8. Select "Standalone table attribute (attribute)" radio
 *   9. Save field
 *  10. Assert HOT source data shows slot_type = 'attribute'
 *
 * To run:
 *   npx playwright test tests/playwright/cancogen_field_type_change.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { hotCellLocator, findSlotRowIndex, findRowIndex, scrollToSlotRow } from './playwright_utils.js';

// ── Test ──────────────────────────────────────────────────────────────────────

test('first-use FKM slot_usage → attribute type change is reflected in source data', async ({ page }) => {
  test.setTimeout(90_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ─────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null,
    { timeout: 15_000 }
  );

  // ── 2. Upload canada_covid19/schema.yaml ──────────────────────────────────
  const schemaFile = path.resolve('web/templates/canada_covid19/schema.yaml');
  await page.setInputFiles('#schema_upload', schemaFile);

  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'CanCOGeN_Covid-19'),
    null,
    { timeout: 30_000 }
  );

  // ── 3. Enable Expert User mode ────────────────────────────────────────────
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 4. Switch to Class tab and select CanCOGeNCovid19 ────────────────────
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const classRowIdx = await findRowIndex(page, 0, 'CanCOGeNCovid19');
  expect(classRowIdx, 'CanCOGeNCovid19 class row not found').not.toBe(-1);
  await hotCellLocator(page, classRowIdx, 0).click();
  await page.waitForTimeout(300);

  // ── 5. Switch to Field (Slot) tab ────────────────────────────────────────
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(500);

  // ── 6. Find the slot_usage row for specimen_collector_sample_id ───────────
  // "Table field (from schema)" is the human-readable label rendered in tds[1]
  // for rows with slot_type = 'slot_usage'.
  const rowIdx = await scrollToSlotRow(
    page, 'specimen_collector_sample_id', 'Table field (from schema)'
  );
  expect(rowIdx, 'specimen_collector_sample_id slot_usage row not found').not.toBe(-1);

  // Confirm the source data is slot_usage before the change.
  const slotTypeBefore = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'specimen_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'CanCOGeNCovid19') {
        return hot.getSourceDataAtCell(p, dh.slot_type_column);
      }
    }
    return null;
  });
  expect(slotTypeBefore, 'pre-condition: slot_type should be slot_usage').toBe('slot_usage');

  // ── 7. Click the Field ID cell to open the Edit Field dialog ─────────────
  // tds[3] is the name/Field ID column — a KEY_COLUMN; afterOnCellMouseDown
  // fires and opens the FKM via setTimeout.
  const nameCell = page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIdx)
    .locator('td:nth-of-type(4)'); // tds[3]
  await nameCell.scrollIntoViewIfNeeded();
  await nameCell.click();

  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 8_000 }
  );

  // Sanity-check: in Edit mode the "change type" checkbox starts unchecked
  // (no conversion requested by default).
  const changeTypeChecked = await page.$eval('#fkm-change-type', el => el.checked);
  expect(changeTypeChecked, '"change type" checkbox should be unchecked when editing a slot_usage row').toBe(false);

  // ── 8. Check "change to custom field" checkbox to convert to attribute ────
  await page.check('#fkm-change-type');
  await page.waitForTimeout(200);

  // The "Copy schema-inherited field attributes" checkbox row should appear.
  await page.waitForFunction(
    () => {
      const row = document.querySelector('#fkm-copy-inherited-row');
      return row && row.style.display !== 'none';
    },
    null, { timeout: 3_000 }
  );

  // ── 9. Save field ─────────────────────────────────────────────────────────
  await page.click('#fkm-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(500);

  // ── 10. Assert the HOT source data now shows slot_type = 'attribute' ──────
  // This is the regression check: on first-ever FKM use the slot_type must be
  // committed to source data, not silently reverted.
  const slotTypeAfter = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'specimen_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'CanCOGeNCovid19') {
        return hot.getSourceDataAtCell(p, dh.slot_type_column);
      }
    }
    return null;
  });
  expect(slotTypeAfter, 'slot_type should be "attribute" after first-use FKM save').toBe('attribute');
});
