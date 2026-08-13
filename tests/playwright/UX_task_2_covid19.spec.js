/* Test: UX_task_2_covid19
 *
 * Template editing workflow for the GRDI 1M schema in the Schema Editor.
 *
 * Step 1: Make the "Sample Collector Sample ID" field in the "GRDIIsolate"
 *         table recommended.
 *         Expected: The slot_usage row for sample_collector_sample_id in
 *         GRDIIsolate has Recommended = true in the HOT source data.
 *
 * To run this test:
 *   npx playwright test tests/playwright/UX_task_2_covid19.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync, mkdirSync } from 'fs';
import { spawnSync } from 'child_process';
import YAML from 'yaml';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Target a cell in the Schema / Class tab HOT grid.
 * Col 0 (name) is frozen in .ht_clone_left; other cols go to .ht_master.
 */
function hotCellLocator(page, rowIndex, colIdx) {
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
 * Find the 0-based DOM row index of the first row whose column `colIdx`
 * contains `text` in the active tab's .ht_master (or .ht_clone_left for col 0).
 * Returns -1 if not found.
 */
async function findRowIndex(page, colIdx, text) {
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
 * Find the 0-based DOM row index of a slot row matching both `name` (tds[3])
 * and `slotTypeTitle` (tds[1]) in the active tab's .ht_master.
 * Returns -1 if not found in the currently rendered DOM.
 */
async function findSlotRowIndex(page, name, slotTypeTitle) {
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
 * Scroll the Slot/Field tab HOT down incrementally until the row matching
 * `name` + `slotTypeTitle` appears in the DOM, then return its DOM index.
 * Needed for large schemas where HOT's virtual rendering omits off-screen rows.
 */
async function scrollToSlotRow(page, name, slotTypeTitle, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const idx = await findSlotRowIndex(page, name, slotTypeTitle);
    if (idx !== -1) return idx;
    await page.evaluate(() => {
      const holder = document.querySelector('.tab-pane.show .ht_master .wtHolder');
      if (holder) holder.scrollTop += 300;
    });
    await page.waitForTimeout(200);
  }
  return -1;
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('UX_task_2: GRDI template editing', async ({ page }) => {
  test.setTimeout(120_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ──────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => {
      const spans = document.querySelectorAll('.htCore th span');
      return Array.from(spans).some(s => s.textContent.trim() === 'Schema ID');
    },
    null,
    { timeout: 15_000 }
  );

  // ── 2. Upload grdi_1m/schema.yaml ─────────────────────────────────────────
  const sourceFile = path.resolve('web/templates/grdi_1m/schema.yaml');
  await page.setInputFiles('#schema_upload', sourceFile);

  // Wait for the GRDI schema name to appear in the Schema tab.
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'GRDI'),
    null,
    { timeout: 30_000 }
  );

  // ── 3. Enable Expert User mode ─────────────────────────────────────────────
  // Required for schema-level edits.  The checkbox lives inside a Bootstrap
  // dropdown and is not visible per CSS, so trigger its click handler directly.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 4. Switch to Class tab and select GRDIIsolate ─────────────────────────
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const classRowIdx = await findRowIndex(page, 0, 'GRDIIsolate');
  expect(classRowIdx, 'GRDIIsolate class row not found').not.toBe(-1);

  // Single-click to select the row — sets the Field tab filter context.
  await hotCellLocator(page, classRowIdx, 0).click();
  await page.waitForTimeout(300);

  // ── 5. Switch to Field (Slot) tab ─────────────────────────────────────────
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

  // ── Step 1: Set "Sample Collector Sample ID" recommended = true ────────────
  // sample_collector_sample_id is rank 1 in GRDIIsolate so it should be in
  // the rendered viewport without scrolling, but scrollToSlotRow handles the
  // general case for robustness.
  //
  // The base slot has recommended: null, so the inherited-edit dialog will not
  // fire — no special source tag needed, but we use 'cascade_confirm' for
  // consistency with other programmatic HOT writes in this test suite.
  const scsRowIdx = await scrollToSlotRow(
    page, 'sample_collector_sample_id', 'Table field (from schema)'
  );
  expect(scsRowIdx, 'sample_collector_sample_id slot_usage row not found in GRDIIsolate').not.toBe(-1);

  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)     === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'sample_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'GRDIIsolate') {
        const v = hot.toVisualRow(p);
        hot.setDataAtCell(v, n2c['recommended'], true, 'cascade_confirm');
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── Step 1 result: Recommended column is TRUE for sample_collector_sample_id
  // in GRDIIsolate's field group.
  const recommendedValue = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)     === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'sample_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'GRDIIsolate') {
        return hot.getSourceDataAtCell(p, n2c['recommended']);
      }
    }
    return null;
  });
  expect(recommendedValue, 'Recommended should be true for sample_collector_sample_id in GRDIIsolate').toBe(true);

  // ── Step 2: Set "Sample Collector Sample ID" recommended = true in GRDISample
  // Switch back to Class tab, select GRDISample, then repeat the field edit.

  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const sampleClassRowIdx = await findRowIndex(page, 0, 'GRDISample');
  expect(sampleClassRowIdx, 'GRDISample class row not found').not.toBe(-1);

  await hotCellLocator(page, sampleClassRowIdx, 0).click();
  await page.waitForTimeout(300);

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

  const scsRowIdxSample = await scrollToSlotRow(
    page, 'sample_collector_sample_id', 'Table field (from schema)'
  );
  expect(scsRowIdxSample, 'sample_collector_sample_id slot_usage row not found in GRDISample').not.toBe(-1);

  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    // GRDISample is now the active class filter; iterate source rows to find
    // the slot_usage row whose class_id matches GRDISample.
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)      === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)      === 'sample_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column)  === 'GRDISample') {
        const v = hot.toVisualRow(p);
        hot.setDataAtCell(v, n2c['recommended'], true, 'cascade_confirm');
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── Step 2 result: Recommended column is TRUE for sample_collector_sample_id
  // in GRDISample's field group.
  const recommendedValueSample = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)     === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'sample_collector_sample_id' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'GRDISample') {
        return hot.getSourceDataAtCell(p, n2c['recommended']);
      }
    }
    return null;
  });
  expect(recommendedValueSample, 'Recommended should be true for sample_collector_sample_id in GRDISample').toBe(true);

  // ── Step 3: Change "time" to "time stamp" in the base slot description ─────
  // The description lives on the base slot row (slot_type='slot'), which is
  // hidden by the default slot-type filter in the Slot tab UI.  We write
  // directly to HOT source data via setDataAtCell — no DOM visibility needed.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column) === 'sample_collection_start_time') {
        const v = hot.toVisualRow(p);
        hot.setDataAtCell(
          v, n2c['description'],
          'The time stamp at which sample collection began.',
          'cascade_confirm'
        );
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── Step 3 result: base slot description updated ───────────────────────────
  const updatedDesc = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column) === 'sample_collection_start_time') {
        return hot.getSourceDataAtCell(p, n2c['description']);
      }
    }
    return null;
  });
  expect(updatedDesc, 'Description should contain "time stamp"').toBe(
    'The time stamp at which sample collection began.'
  );

  // ── Step 4: Set Range = "NullValueMenu" on the GRDISample slot_usage row ───
  // The "editable" row is the slot_usage (Table field (from schema)) for
  // GRDISample.  The base slot has range: null (ranges are expressed via
  // any_of), so this override lands cleanly with no inherited-edit dialog.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)     === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'sample_collection_start_time' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'GRDISample') {
        const v = hot.toVisualRow(p);
        hot.setDataAtCell(v, n2c['range'], 'NullValueMenu', 'cascade_confirm');
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── Step 4 result: Range column shows "NullValueMenu" for the slot_usage row
  const rangeVal = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column)     === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column)     === 'sample_collection_start_time' &&
          hot.getSourceDataAtCell(p, dh.slot_class_id_column) === 'GRDISample') {
        return hot.getSourceDataAtCell(p, n2c['range']);
      }
    }
    return null;
  });
  expect(rangeVal, 'Range should be NullValueMenu for sample_collection_start_time in GRDISample').toBe('NullValueMenu');

  // ── Step 5: Add description to the NullValueMenu picklist ─────────────────
  // Navigate to the Enum (Picklist) tab and set a short description on the
  // NullValueMenu row.
  await page.click('#tab-bar-Enum > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
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

  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'NullValueMenu') {
        const v = hot.toVisualRow(p);
        hot.setDataAtCell(
          v, n2c['description'],
          'This is a list of possible states regarding data collection of this field, if a value is not known or available.',
          'cascade_confirm'
        );
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── Step 5 result: NullValueMenu description is non-blank ─────────────────
  const enumDesc = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'NullValueMenu') {
        return hot.getSourceDataAtCell(p, n2c['description']);
      }
    }
    return null;
  });
  expect(enumDesc, 'NullValueMenu description should not be blank').toBeTruthy();

  // ── Step 6: Add "Pending" to the NullValueMenu picklist choices ────────────
  // Select the NullValueMenu row in the Enum tab so that the PermissibleValue
  // (Picklist choices) tab will filter to show only NullValueMenu entries.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'NullValueMenu') {
        const v = hot.toVisualRow(p);
        hot.selectCell(v, 0);   // triggers afterSelectionEnd → FK filter update
        break;
      }
    }
  });
  await page.waitForTimeout(400);

  // Switch to the PermissibleValue (Picklist choices) tab.
  await page.click('#tab-bar-PermissibleValue > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-PermissibleValue .nav-link')?.classList.contains('active'),
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

  // Insert a new row at the end of the visible (filtered) rows and populate it.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.PermissibleValue;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    const n   = hot.countRows();
    if (n === 0) {
      hot.alter('insert_row_above', 0, 1, 'cascade_confirm');
    } else {
      hot.alter('insert_row_below', n - 1, 1, 'cascade_confirm');
    }
    const newRow = hot.countRows() - 1;
    hot.setDataAtCell([
      [newRow, n2c['schema_id'], 'GRDI'],
      [newRow, n2c['enum_id'],   'NullValueMenu'],
      [newRow, n2c['text'],      'Pending'],
      [newRow, n2c['title'],     'Pending'],
    ], 'cascade_confirm');
  });
  await page.waitForTimeout(300);

  // ── Step 6 result: "Pending" row exists; existing 5 entries are unchanged ──
  const pendingRow = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.PermissibleValue;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['enum_id']) === 'NullValueMenu' &&
          hot.getSourceDataAtCell(p, n2c['text'])    === 'Pending') {
        return {
          text:  hot.getSourceDataAtCell(p, n2c['text']),
          title: hot.getSourceDataAtCell(p, n2c['title']),
        };
      }
    }
    return null;
  });
  expect(pendingRow, '"Pending" row should exist in NullValueMenu choices').not.toBeNull();
  expect(pendingRow?.text,  'Code should be "Pending"').toBe('Pending');
  expect(pendingRow?.title, 'Title should be "Pending"').toBe('Pending');

  const pvCount = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.PermissibleValue;
    const hot = dh?.hot;
    if (!hot || !dh) return 0;
    const n2c = dh.slot_name_to_column;
    let count = 0;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['enum_id']) === 'NullValueMenu') count++;
    }
    return count;
  });
  expect(pvCount, 'NullValueMenu should now have 6 choices (5 original + Pending)').toBe(6);

  // ── Step 7: Save the schema to test-results/GRDI.yaml ─────────────────────
  // Navigate to Schema tab, right-click the GRDI row, and trigger the save.
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  const schemaRowIdx = await findRowIndex(page, 0, 'GRDI');
  expect(schemaRowIdx, 'GRDI schema row not found on Schema tab').not.toBe(-1);

  const outputFileName = 'GRDI.yaml';
  page.once('dialog', async (dialog) => {
    await dialog.accept(outputFileName);
  });

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    (async () => {
      const schemaCell = hotCellLocator(page, schemaRowIdx, 0);
      await schemaCell.click();
      await page.waitForTimeout(200);
      await schemaCell.click({ button: 'right' });
      const saveItem = page.locator('.htItemWrapper')
        .filter({ hasText: 'Save as LinkML schema.yaml' }).first();
      await saveItem.waitFor({ state: 'visible', timeout: 8_000 });
      await saveItem.click();
    })(),
  ]);

  const outputDir  = path.resolve('test-results');
  mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, outputFileName);
  await download.saveAs(outputFile);
  console.log(`Schema saved to: ${outputFile}`);

  // ── Step 7: Parse both files and verify the diff ──────────────────────────
  const source = YAML.parse(readFileSync(sourceFile, 'utf-8'));
  const saved  = YAML.parse(readFileSync(outputFile, 'utf-8'));

  // Schema identity
  expect(saved.name, 'Saved schema name should be GRDI').toBe('GRDI');

  // Steps 1+2: sample_collector_sample_id recommended=true in both tables
  const savedSuIsolate = saved.classes?.GRDIIsolate?.slot_usage ?? {};
  const savedSuSample  = saved.classes?.GRDISample?.slot_usage  ?? {};

  expect(
    source.classes?.GRDIIsolate?.slot_usage?.sample_collector_sample_id?.recommended,
    'Source should not have recommended on GRDIIsolate sample_collector_sample_id'
  ).toBeFalsy();
  expect(
    savedSuIsolate?.sample_collector_sample_id?.recommended,
    'Saved GRDIIsolate sample_collector_sample_id should be recommended'
  ).toBe(true);

  expect(
    source.classes?.GRDISample?.slot_usage?.sample_collector_sample_id?.recommended,
    'Source should not have recommended on GRDISample sample_collector_sample_id'
  ).toBeFalsy();
  expect(
    savedSuSample?.sample_collector_sample_id?.recommended,
    'Saved GRDISample sample_collector_sample_id should be recommended'
  ).toBe(true);

  // Step 3: sample_collection_start_time description updated
  expect(
    source.slots?.sample_collection_start_time?.description,
    'Source description should mention "time" not "time stamp"'
  ).toBe('The time at which sample collection began.');
  expect(
    saved.slots?.sample_collection_start_time?.description,
    'Saved description should say "time stamp"'
  ).toBe('The time stamp at which sample collection began.');

  // Step 4: GRDISample slot_usage range=NullValueMenu
  expect(
    source.classes?.GRDISample?.slot_usage?.sample_collection_start_time?.range,
    'Source should not have explicit range on sample_collection_start_time slot_usage'
  ).toBeFalsy();
  expect(
    savedSuSample?.sample_collection_start_time?.range,
    'Saved GRDISample slot_usage should have range=NullValueMenu'
  ).toBe('NullValueMenu');

  // Step 5: NullValueMenu description
  expect(
    source.enums?.NullValueMenu?.description,
    'Source NullValueMenu should have no description'
  ).toBeFalsy();
  expect(
    saved.enums?.NullValueMenu?.description,
    'Saved NullValueMenu should have a description'
  ).toBeTruthy();

  // Step 6: Pending in NullValueMenu.permissible_values; originals preserved
  const srcPVs   = source.enums?.NullValueMenu?.permissible_values ?? {};
  const savedPVs = saved.enums?.NullValueMenu?.permissible_values  ?? {};

  expect(
    'Pending' in savedPVs,
    '"Pending" should be in saved NullValueMenu permissible_values'
  ).toBe(true);
  expect(
    savedPVs['Pending']?.title,
    '"Pending" entry should have title "Pending"'
  ).toBe('Pending');

  for (const origKey of Object.keys(srcPVs)) {
    expect(
      origKey in savedPVs,
      `Original NullValueMenu entry "${origKey}" should still be present`
    ).toBe(true);
  }

  // ── Step 7b: Run script/diff_schemas.py for a human-readable structured diff
  // Uses the existing repo diff tool (YAML object comparison via DeepDiff, not
  // text diff) to print substantive changes between source and saved schemas.
  const diffResult = spawnSync(
    'python3',
    ['script/diff_schemas.py', '--files', sourceFile, outputFile],
    { encoding: 'utf-8', cwd: path.resolve('.') }
  );
  if (diffResult.status === 0) {
    console.log('\n── script/diff_schemas.py output ──────────────────────────────────\n' +
      diffResult.stdout);
  } else {
    console.warn('diff_schemas.py exited with status', diffResult.status,
      diffResult.stderr || diffResult.stdout);
  }
});
