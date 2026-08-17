/* UX Task 5 – Create a schema with two tables and linked identifier fields,
 * mirroring the GRDI-1M pattern of GRDISample / GRDIIsolate.
 *
 * Pattern (from grdi_1m):
 *   sample_id  is a schema-level slot used by both tables.
 *   Samples.sample_id  — the primary identifier for a sample.
 *   Isolates.sample_id — a foreign-key reference back to Samples
 *                        (slot_usage with range = "Samples").
 *   Isolates.isolate_id — the primary identifier for an isolate.
 *
 * Steps:
 *   1. Load schema_editor.html
 *   2. Create schema "Schema1" with ID, description, version, default prefix
 *   3. Create Tables "Samples" and "Isolates" (name and title both set)
 *   4. Add schema-field "sample_id" (slot + slot_usage) to Samples table
 *   5. Add schema-field "isolate_id" (slot + slot_usage) to Isolates table
 *   6. Add "sample_id" slot_usage to Isolates (the FK linkage step)
 *   7. Set range = "Samples" on Isolates.sample_id via the multiselect modal
 *
 * Results asserted:
 *   - Table tab: two rows with Name and Title = "Samples" / "Isolates"
 *   - Field tab (Samples context): sample_id with class_id = "Samples"
 *   - Field tab (Isolates context): sample_id with class_id = "Isolates"
 *                                   isolate_id with class_id = "Isolates"
 *   - Isolates.sample_id has range = "Samples"  (FK reference to Samples table)
 *
 * Schema tab column layout (name frozen at col 0):
 *   col 0 (frozen): name      col 3: description   col 7: default_prefix
 *   col 1: id (URI)           col 4: version
 *   col 2: title              col 5: in_language
 *
 * Slot tab ht_master column layout (schema_id hidden, class_id frozen):
 *   tds[0]=placeholder  tds[3]=name   tds[6]=title  tds[9]=examples
 *   tds[1]=slot_type    tds[4]=rank   tds[7]=description
 *   tds[2]=slot_group   tds[5]=slot_uri  tds[8]=comments  tds[10]=range
 *
 * Run:
 *   npx playwright test tests/playwright/UX_Task_5_create_1m.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { mkdirSync, readFileSync } from 'fs';
import YAML from 'yaml';
import { hotCellLocator, slotCellLocator } from './playwright_utils.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Wait for loading screen to hide and the Schema HOT header to appear. */
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

/** Click a tab nav-link and wait for the Bootstrap transition to finish. */
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

/** Click a HOT cell, double-click to open the editor, type value, confirm with Tab. */
async function typeIntoCell(page, cell, value) {
  await cell.click();
  await cell.dblclick();
  await page.keyboard.type(value);
  await page.keyboard.press('Tab');
}

/** Wait for `text` to appear in any ht_clone_left cell of the active tab pane. */
async function waitForCloneCellText(page, text, timeout = 8_000) {
  await page.waitForFunction(
    (t) => {
      const ht = el => (el?.textContent ?? '').replace(/\u25bc/g, '').trim();
      const scope = document.querySelector('.tab-pane.show');
      if (!scope) return false;
      return Array.from(scope.querySelectorAll('.ht_clone_left.handsontable tbody td'))
               .some(td => ht(td) === t);
    },
    text, { timeout }
  );
}

/**
 * Open the Field Key Modal (#add-row), select `className`, enter `fieldName`
 * and `title`, choose slot_usage type, then confirm.
 * If the slot already exists in the schema library the slot-type-row may not
 * appear — the function handles both cases gracefully.
 */
async function addSlotUsageField(page, className, fieldName, title) {
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  await page.selectOption('#fkm-class-id', className);
  await page.waitForTimeout(300);

  await page.fill('#fkm-name', fieldName);

  // The slot-type-row appears for new fields (not yet in schema library).
  // For existing fields it may already default to slot_usage without showing.
  const typeRowAppears = await page.waitForFunction(
    () => document.querySelector('#fkm-slot-type-row')?.style.display !== 'none',
    null, { timeout: 3_000 }
  ).then(() => true).catch(() => false);

  if (typeRowAppears) {
    await page.check('#fkm-type-slot-usage');
  }

  if (title) {
    await page.fill('#fkm-title', title);
  }

  await page.click('#fkm-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('UX Task 5: create schema with two tables and identifier fields linked via range', async ({ page }) => {
  test.setTimeout(120_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ──────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await waitForSchemaEditor(page);

  // ── 2. Enter schema details ────────────────────────────────────────────────
  // Schema tab: col 0 (frozen) = name, col 1 = id, col 3 = description,
  //             col 4 = version, col 7 = default_prefix.
  await typeIntoCell(page, hotCellLocator(page, 0, 0), 'Schema1');
  await waitForCloneCellText(page, 'Schema1');

  await typeIntoCell(page, hotCellLocator(page, 0, 1), 'https://example.com/schema1');
  await typeIntoCell(page, hotCellLocator(page, 0, 3), 'A test Schema with three tables');
  await typeIntoCell(page, hotCellLocator(page, 0, 4), '1.0.0');
  await typeIntoCell(page, hotCellLocator(page, 0, 7), 'SCHEMA1');

  // Re-select Schema1 so it is the active FK context for tables.
  await hotCellLocator(page, 0, 0).click();

  // ── 3. Navigate to the Table (Class) tab ──────────────────────────────────
  await goToTab(page, '#tab-bar-Class');
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
            .some(s => s.textContent.trim() === 'Table ID'),
    null, { timeout: 10_000 }
  );

  // ── 4. Create the "Samples" table ─────────────────────────────────────────
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 1,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  await typeIntoCell(page, hotCellLocator(page, 0, 0), 'Samples');
  await waitForCloneCellText(page, 'Samples');
  await typeIntoCell(page, hotCellLocator(page, 0, 1), 'Samples');

  // ── 5. Create the "Isolates" table ────────────────────────────────────────
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 2,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  const isolatesTableRowIdx = await page.evaluate(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length - 1
  );
  await typeIntoCell(page, hotCellLocator(page, isolatesTableRowIdx, 0), 'Isolates');
  await waitForCloneCellText(page, 'Isolates');
  await typeIntoCell(page, hotCellLocator(page, isolatesTableRowIdx, 1), 'Isolates');

  // ── 6. Assert: two Table rows with matching Name and Title ─────────────────
  const tableData = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Class;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol  = dh.slot_name_to_column['name'];
    const titleCol = dh.slot_name_to_column['title'];
    const result = {};
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const name = hot.getSourceDataAtCell(p, nameCol);
      if (name === 'Samples' || name === 'Isolates') {
        result[name] = hot.getSourceDataAtCell(p, titleCol);
      }
    }
    return result;
  });

  expect(tableData, 'Class HOT data not accessible').not.toBeNull();
  expect(tableData['Samples'], '"Samples" row not found in Table tab').toBeDefined();
  expect(tableData['Isolates'], '"Isolates" row not found in Table tab').toBeDefined();
  expect(tableData['Samples'], 'Samples title should equal "Samples"').toBe('Samples');
  expect(tableData['Isolates'], 'Isolates title should equal "Isolates"').toBe('Isolates');

  // ── 7. Select Samples → navigate to Slot (Field) tab ──────────────────────
  const samplesClassRowIdx = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Class;
    const hot = dh?.hot;
    if (!hot || !dh) return 0;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Samples') return hot.toVisualRow(p);
    }
    return 0;
  });
  await hotCellLocator(page, samplesClassRowIdx, 0).click();
  await page.waitForTimeout(200);
  await goToTab(page, '#tab-bar-Slot');

  // ── 8. Add "sample_id" schema-field to Samples table ─────────────────────
  // slot_usage type: creates a base schema-level slot AND a slot_usage row
  // for Samples — mirroring GRDISample.sample_collector_sample_id in GRDI-1M.
  await addSlotUsageField(page, 'Samples', 'sample_id', 'Sample Identifier');

  // Wait for sample_id to appear in the Slot tab DOM (base slot row is always visible).
  await page.waitForFunction(
    () => {
      const ht = td => (td?.textContent ?? '').replace(/\u25bc/g, '').trim();
      const scope = document.querySelector('.tab-pane.show');
      const rows = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (const row of rows) {
        if (ht(row.querySelectorAll('td')[3]) === 'sample_id') return true;
      }
      return false;
    },
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // ── 9. Add "sample_id" slot_usage to Isolates (FK linkage step, rank 1) ────
  // Added first so it gets rank 1 (appears before isolate_id in the Isolates tab).
  // sample_id already exists in the schema library so the FKM only creates a
  // slot_usage row — mirroring GRDIIsolate.sample_collector_sample_id in GRDI-1M.
  await addSlotUsageField(page, 'Isolates', 'sample_id', '');
  await page.waitForTimeout(300);

  // ── 10. Add "isolate_id" schema-field to Isolates table (rank 2) ──────────
  // Added second so it gets rank 2 (appears after sample_id in the Isolates tab).
  // slot_usage type: creates base slot + slot_usage row for Isolates.
  await addSlotUsageField(page, 'Isolates', 'isolate_id', 'Isolate Identifier');
  await page.waitForTimeout(300);

  // ── 11. Navigate to Isolates context in Slot tab ───────────────────────────
  // Switch to the Table tab, select Isolates, then return to the Slot tab so
  // the tab filter shows Isolates fields (including the new sample_id slot_usage).
  await goToTab(page, '#tab-bar-Class');
  const isolatesClassRowIdx = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Class;
    const hot = dh?.hot;
    if (!hot || !dh) return 0;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Isolates') return hot.toVisualRow(p);
    }
    return 0;
  });
  await hotCellLocator(page, isolatesClassRowIdx, 0).click();
  await page.waitForTimeout(200);
  await goToTab(page, '#tab-bar-Slot');

  // Wait for the Isolates context to render fields.
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // ── 12. Find Isolates.sample_id row and set range = "Samples" ─────────────
  // In the Slot tab with Isolates context, find the row where
  // class_id (clone-left) = "Isolates" AND name (tds[3]) = "sample_id".
  const sampleIdIsolatesRowIdx = await page.evaluate(() => {
    const ht = el => (el?.textContent ?? '').replace(/\u25bc/g, '').trim();
    const scope = document.querySelector('.tab-pane.show');
    const cloneRows = scope.querySelectorAll('.ht_clone_left.handsontable tbody tr');
    const masterRows = scope.querySelectorAll('.ht_master.handsontable tbody tr');
    for (let i = 0; i < Math.min(cloneRows.length, masterRows.length); i++) {
      const cloneTd  = cloneRows[i]?.querySelector('td');
      const masterTds = masterRows[i].querySelectorAll('td');
      if (ht(cloneTd) === 'Isolates' && ht(masterTds[3]) === 'sample_id') return i;
    }
    return -1;
  });
  expect(sampleIdIsolatesRowIdx,
    'sample_id slot_usage row for Isolates not found in Slot tab').not.toBe(-1);

  // range is ht_master tds[10] → slotCellLocator colIdx=10.
  // It is a multiselect combining SchemaTypeMenu + SchemaClassMenu + SchemaEnumMenu.
  const rangeCell = slotCellLocator(page, sampleIdIsolatesRowIdx, 10);
  await rangeCell.scrollIntoViewIfNeeded();
  await rangeCell.dblclick();

  await page.waitForFunction(
    () => document.querySelector('#multiselect-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  // Type "Samples" into the selectize filter to locate the class option.
  await page.locator('#multiselect-text .selectize-input input').click();
  await page.keyboard.type('Samples');
  await page.waitForTimeout(200);

  const samplesOption = page
    .locator('#multiselect-text .selectize-dropdown .option')
    .filter({ hasText: 'Samples' })
    .first();
  await samplesOption.waitFor({ state: 'visible', timeout: 5_000 });
  await samplesOption.click();

  // Click OK to commit the range value.
  await page.locator('#multiselect-modal button[data-dismiss="modal"]').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#multiselect-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // ── 13. Enable Expert User mode to expose the Annotation tab ─────────────────
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 13b. Add foreign_key annotation so Isolates appears as a second tab ─────
  // DataHarmonizer needs an explicit foreign_key annotation on
  // Isolates.sample_id to know that Isolates is a child/dependent of Samples.
  // range: Samples alone only describes the data type; it does not establish
  // the parent→child tab hierarchy.  This mirrors the grdi_1m pattern:
  //   GRDIIsolate.sample_collector_sample_id:
  //     annotations.foreign_key.value: GRDISample.sample_collector_sample_id
  //
  // The SchemaEditor's Annotation tab stores these as rows with fields:
  //   annotation_type, class_name, slot_name, name, value.
  await goToTab(page, '#tab-bar-Annotation');

  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 1,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // Use the HOT API to set the annotation fields — the annotation_type and
  // class_name columns are dropdowns and the API is more reliable than
  // simulating keystrokes through HOT's custom dropdown editor.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Annotation;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c   = dh.slot_name_to_column;
    const rowIdx = hot.countSourceRows() - 1; // newly-added row
    hot.setDataAtCell([
      [rowIdx, n2c['annotation_type'], 'slot_usage'],
      [rowIdx, n2c['class_name'],      'Isolates'],
      [rowIdx, n2c['slot_name'],       'sample_id'],
      [rowIdx, n2c['name'],            'foreign_key'],
      [rowIdx, n2c['value'],           'Samples.sample_id'],
    ]);
  });
  await page.waitForTimeout(500);

  // ── 14. Save schema YAML to test-results/ ─────────────────────────────────
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
  const outputFile = path.join(outputDir, 'UX_Task_5_schema.yaml');
  await download.saveAs(outputFile);
  console.log(`Schema saved to: ${outputFile}`);

  // ── 15. Final assertions ───────────────────────────────────────────────────
  const slotData = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol  = dh.slot_name_to_column['name'];
    const classCol = dh.slot_name_to_column['class_id'];
    const rangeCol = dh.slot_name_to_column['range'];
    const rows = [];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const name = hot.getSourceDataAtCell(p, nameCol);
      if (name === 'sample_id' || name === 'isolate_id') {
        rows.push({
          name,
          class_id: hot.getSourceDataAtCell(p, classCol) ?? '',
          range:    hot.getSourceDataAtCell(p, rangeCol) ?? '',
        });
      }
    }
    return rows;
  });

  expect(slotData, 'Slot HOT data not accessible').not.toBeNull();

  // sample_id should exist for Samples (as the primary sample identifier).
  const sampleIdSamples = slotData.find(r => r.name === 'sample_id' && r.class_id === 'Samples');
  expect(sampleIdSamples,
    'sample_id field with Type (class_id) = "Samples" not found').toBeDefined();

  // sample_id should exist for Isolates with range = "Samples" (FK reference).
  const sampleIdIsolates = slotData.find(r => r.name === 'sample_id' && r.class_id === 'Isolates');
  expect(sampleIdIsolates,
    'sample_id field with Type (class_id) = "Isolates" not found').toBeDefined();
  expect(String(sampleIdIsolates?.range ?? ''),
    'Isolates.sample_id range should include "Samples"').toContain('Samples');

  // isolate_id should exist for Isolates (as the primary isolate identifier).
  const isolateIdIsolates = slotData.find(r => r.name === 'isolate_id' && r.class_id === 'Isolates');
  expect(isolateIdIsolates,
    'isolate_id field with Type (class_id) = "Isolates" not found').toBeDefined();

  // Verify the foreign_key annotation made it into the saved YAML.
  // This annotation is what DataHarmonizer reads to show Isolates as a
  // second tab (dependent of Samples) when the schema is loaded for data entry.
  const schema = YAML.parse(readFileSync(outputFile, 'utf-8'));
  const fkAnnotation = schema?.classes?.Isolates?.slot_usage?.sample_id?.annotations?.foreign_key;
  expect(fkAnnotation,
    'foreign_key annotation missing from Isolates.sample_id in saved YAML').toBeDefined();
  expect(String(fkAnnotation?.value ?? ''),
    'foreign_key annotation value should reference Samples.sample_id').toContain('Samples.sample_id');
});
