/* Test: unique_key_slots_menu
 *
 * Verifies that when a user edits the `unique_key_slots` cell in the UniqueKey
 * (Table Key) tab, the Selectize multiselect:
 *   • shows exactly ONE optgroup, labelled with the class TITLE (not its name)
 *   • contains only the slots that belong to the row's class
 *   • shows slot TITLES as option labels, stores slot NAMEs as values
 *
 * Schema : web/templates/grdi_1m/schema.yaml
 * Class  : GRDISample  (title: "GRDI Sample")
 * Unique key: grdisample_key — unique_key_slots: [sample_collector_sample_id]
 * Expected slot: sample_collector_sample_id (title: "sample_collector_sample_ID")
 *
 * Run:
 *   npx playwright test tests/playwright/unique_key_slots_menu.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function waitForSchemaEditor(page) {
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );
}

async function goToTab(page, tabBarId) {
  // Use JS click so off-screen / overflow-hidden tabs are reachable.
  await page.evaluate((id) => {
    const a = document.querySelector(`${id} a`);
    if (!a) throw new Error(`Tab not found: ${id}`);
    a.click();
  }, tabBarId);
  await page.waitForFunction(
    (id) => document.querySelector(`${id} .nav-link`)?.classList.contains('active'),
    tabBarId, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('unique_key_slots multiselect shows filtered class optgroup', async ({ page }) => {
  test.setTimeout(120_000);

  page.on('console', msg => {
    const t = msg.type();
    if (t === 'error' || t === 'warn' || t === 'log') console.log(`[BROWSER ${t}]`, msg.text());
  });

  // ── 1. Load Schema Editor ────────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await waitForSchemaEditor(page);

  // ── 2. Upload grdi_1m ───────────────────────────────────────────────────
  const sourceFile = path.resolve('web/templates/grdi_1m/schema.yaml');
  await page.setInputFiles('#schema_upload', sourceFile);

  // Wait until the Schema tab's frozen column shows 'GRDI' (the schema name).
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'GRDI'),
    null, { timeout: 30_000 }
  );

  // Allow refreshMenus (including UniqueKeySlotMenu) to complete.
  await page.waitForTimeout(500);

  // ── 3. Navigate to Class tab and select GRDISample (first class) ─────────
  await goToTab(page, '#tab-bar-Class');
  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    ).length > 0,
    null, { timeout: 10_000 }
  );

  // Confirm first row is GRDISample.
  const firstClassName = await page.evaluate(() => {
    const td = document.querySelector(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr:first-child td'
    );
    return (td?.textContent ?? '').replace(/\u25bc/g, '').trim();
  });
  expect(firstClassName, 'First class row should be GRDISample').toBe('GRDISample');

  await page.locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
    .first().locator('td:nth-of-type(1)').click();
  await page.waitForTimeout(300);

  // ── 4. Navigate to UniqueKey (Table Key) tab ─────────────────────────────
  await goToTab(page, '#tab-bar-UniqueKey');
  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    ).length > 0,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // Verify first visible row has class_id = GRDISample via HOT source data.
  const firstRowClassId = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.UniqueKey;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const classIdCol = dh.slot_name_to_column['class_id'];
    if (classIdCol === undefined) return null;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const v = hot.toVisualRow(p);
      if (v !== null && v >= 0) {
        return hot.getSourceDataAtCell(p, classIdCol);
      }
    }
    return null;
  });
  expect(firstRowClassId, 'First UniqueKey row should be for class GRDISample').toBe('GRDISample');

  // ── 5. Open the unique_key_slots editor on the first row ─────────────────
  const editStarted = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.UniqueKey;
    const hot = dh?.hot;
    if (!hot || !dh) return 'no dh/hot';
    const ukCol = dh.slot_name_to_column['unique_key_slots'];
    if (ukCol === undefined) return 'unique_key_slots column not found';
    const visCol = hot.toVisualColumn(ukCol);
    if (visCol === null || visCol < 0) return 'visCol null';
    // Find first visible row.
    let firstVRow = -1;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const v = hot.toVisualRow(p);
      if (v !== null && v >= 0) { firstVRow = v; break; }
    }
    if (firstVRow < 0) return 'no visible rows';
    hot.scrollViewportTo({ row: firstVRow, col: visCol });
    hot.selectCell(firstVRow, visCol);
    setTimeout(() => hot.getActiveEditor()?.beginEditing(), 100);
    return 'ok';
  });
  expect(editStarted, 'beginEditing setup').toBe('ok');

  // Wait for multiselect modal.
  await page.waitForFunction(
    () => !!document.querySelector('[id="multiselect-modal"].show'),
    null, { timeout: 8_000 }
  );
  // Allow 300 ms for our afterBeginEditing hook to run and DH's dropdown open.
  await page.waitForTimeout(300);

  // ── 6. Read Selectize state ───────────────────────────────────────────────
  const selectizeState = await page.evaluate(() => {
    const modal    = document.querySelector('[id="multiselect-modal"].show');
    const select   = modal?.querySelector('.multiselect');
    const selectize = select?.selectize;
    if (!selectize) return null;
    return {
      optgroups:    Object.values(selectize.optgroups ?? {}).map(g => ({
                      value: g.value,
                      label: g.label,
                    })),
      optionValues: Object.keys(selectize.options ?? {}),
      optionLabels: Object.values(selectize.options ?? {}).map(o => o.label),
    };
  });

  expect(selectizeState, 'Selectize not found in multiselect modal — hook may not have run').not.toBeNull();

  console.log('Selectize state:', JSON.stringify(selectizeState, null, 2));

  // ── 7. Assert optgroup ───────────────────────────────────────────────────

  // A. One optgroup per slot_group found among GRDISample's slots.
  //    grdi_1m has 11 slot_groups used by GRDISample (all global slot_groups
  //    except 'Key', whose only slot — isolate_id — is not in GRDISample).
  //    Slots without a slot_group appear ungrouped (no registered optgroup).
  expect(
    selectizeState.optgroups.length,
    `Expected 11 optgroups (one per slot_group), got ${selectizeState.optgroups.length}: ${JSON.stringify(selectizeState.optgroups)}`
  ).toBe(11);

  // B. Optgroup labels are slot_group names, not the class name/title.
  //    The first optgroup (by rank of first slot appearance) is
  //    "Sample collection and processing" (sample_collector_sample_id, rank=1).
  const optgroupLabels = selectizeState.optgroups.map(g => g.label);
  expect(
    optgroupLabels,
    'First optgroup label should be the leading slot_group, not the class name/title'
  ).toContain('Sample collection and processing');
  expect(
    optgroupLabels,
    'Optgroup labels must not include the class name'
  ).not.toContain('GRDISample');
  expect(
    optgroupLabels,
    'Optgroup labels must not include the class title'
  ).not.toContain('GRDI Sample');

  // ── 8. Assert option content ──────────────────────────────────────────────

  // C. Options must not be empty.
  expect(
    selectizeState.optionValues.length,
    'unique_key_slots dropdown should have at least one option'
  ).toBeGreaterThan(0);

  // D. The key slot for this unique key is present (stored as slot NAME).
  expect(
    selectizeState.optionValues,
    'sample_collector_sample_id should be an option value'
  ).toContain('sample_collector_sample_id');

  // E. Option labels are slot TITLES, not raw slot names.
  //    sample_collector_sample_id has title "sample_collector_sample_ID".
  expect(
    selectizeState.optionLabels,
    'Option labels should include the slot title, not just the raw name'
  ).toContain('sample_collector_sample_ID');

  // F. All option values belong to GRDISample in the Slot tab (no cross-class leakage).
  const allBelongToGRDISample = await page.evaluate(() => {
    const modal    = document.querySelector('[id="multiselect-modal"].show');
    const selectize = modal?.querySelector('.multiselect')?.selectize;
    if (!selectize) return false;
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return false;
    const classIdCol = dh.slot_class_id_column;
    const nameCol    = dh.slot_name_column;
    const typeCol    = dh.slot_type_column;
    const grdiSampleSlots = new Set();
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const cls  = hot.getSourceDataAtCell(p, classIdCol);
      const type = hot.getSourceDataAtCell(p, typeCol);
      if (cls === 'GRDISample' && (type === 'slot_usage' || type === 'attribute')) {
        grdiSampleSlots.add(hot.getSourceDataAtCell(p, nameCol));
      }
    }
    return Object.keys(selectize.options).every(v => grdiSampleSlots.has(v));
  });
  expect(allBelongToGRDISample, 'All dropdown options must come from GRDISample only').toBe(true);

  // ── 9. Close the modal cleanly ────────────────────────────────────────────
  await page.locator('[id="multiselect-modal"].show button[data-dismiss="modal"]').click();
  await page.waitForFunction(
    () => !document.querySelector('[id="multiselect-modal"].show'),
    null, { timeout: 5_000 }
  );
});
