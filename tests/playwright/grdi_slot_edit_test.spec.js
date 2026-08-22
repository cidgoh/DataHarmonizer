/* Test: UX_task_3_grdi_slot_examples
 *
 * Verifies the Expert User mode guard and multiselect (examples column)
 * for the 'sample_plan_name' slot in the GRDI schema.
 *
 * Schema : web/templates/grdi_1m/schema.yaml
 * Slot   : sample_plan_name
 * Column : examples (free-text multivalued, opens multiselect modal on edit)
 *
 * Test flow
 * ─────────
 * Setup (cascade_confirm — bypasses guards):
 *   Set base-slot  sample_plan_name.examples = 'preset_example'
 *   Set GRDISample slot_usage.examples       = 'preset_example'
 *
 *   This ensures that when the non-expert attempts to edit the GRDISample
 *   slot_usage cell, the value it currently holds ('preset_example') matches
 *   the base-slot value, satisfying the inherited-value guard condition.
 *
 * Phase 1 — Non-expert mode
 *   Attempt 1: Open examples multiselect on the Schema field row (slot_type='slot').
 *              Enter "foo", "bar" → click OK.
 *              Expected: "Expert User mode required" dialog appears; cell unchanged.
 *
 *   Attempt 2: Open examples multiselect on the GRDISample slot_usage row.
 *              Enter "foo", "bar" → click OK.
 *              Expected: "Expert User mode required" dialog appears; cell unchanged.
 *
 * Phase 2 — Expert mode
 *   Enable Expert User mode.
 *   Open examples multiselect on the Schema field row.
 *   Clear 'preset_example'; enter "foo", "bar" → click OK.
 *   Expected:
 *     • The multiselect change is committed (no blocking dialog).
 *     • Informational dialog appears listing GRDISample as an inheriting table
 *       and showing the new value "foo;bar".
 *     • Base slot examples = 'foo;bar' in HOT source data.
 *     • GRDISample slot_usage examples still = 'preset_example' (not auto-updated).
 *
 * To run this test:
 *   npx playwright test tests/playwright/UX_task_3_grdi_slot_examples.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Return the visual row index for the first HOT row matching slotName + slotType,
 * or -1 if not found.  Uses HOT source data (no DOM inspection needed).
 */
async function findSlotVisualRow(page, slotName, slotType) {
  return page.evaluate(
    ([slotName, slotType]) => {
      const dh  = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot || !dh) return -1;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_type_column) === slotType &&
            hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName) {
          return hot.toVisualRow(p) ?? -1;
        }
      }
      return -1;
    },
    [slotName, slotType]
  );
}

/**
 * Return the current physical-column value of 'examples' for the given slot row.
 */
async function getExamplesValue(page, slotName, slotType) {
  return page.evaluate(
    ([slotName, slotType]) => {
      const dh  = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot || !dh) return undefined;
      const physCol = dh.slot_name_to_column['examples'];
      if (physCol === undefined) return undefined;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_type_column) === slotType &&
            hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName) {
          return hot.getSourceDataAtCell(p, physCol);
        }
      }
      return undefined;
    },
    [slotName, slotType]
  );
}

/**
 * Scroll the Slot tab to the examples cell of the given visual row, select it,
 * and trigger HOT's beginEditing() — which fires afterBeginEditing and opens
 * the multiselect modal.  Waits until the modal is visible before returning.
 */
async function openExamplesModal(page, vRow) {
  await page.evaluate((vRow) => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const physCol = dh.slot_name_to_column['examples'];
    if (physCol === undefined) return;
    const visCol = hot.toVisualColumn(physCol);
    hot.scrollViewportTo({ row: vRow, col: visCol });
    hot.selectCell(vRow, visCol);
    // Small delay lets HOT prepare the editor before we open it.
    setTimeout(() => hot.getActiveEditor()?.beginEditing(), 50);
  }, vRow);
  await page.waitForFunction(
    () => document.getElementById('multiselect-modal')?.classList.contains('show'),
    null, { timeout: 6_000 }
  );
  // Let Bootstrap animation finish and the 50 ms focus timeout fire.
  await page.waitForTimeout(250);
}

/**
 * Add free-text entries to the open Selectize control by typing and pressing Enter.
 */
async function addSelectizeItems(page, ...items) {
  const input = page.locator('#multiselect-text .selectize-input input');
  for (const item of items) {
    await input.pressSequentially(item, { delay: 30 });
    await input.press('Enter');
    await page.waitForTimeout(50); // let Selectize process the creation
  }
}

/**
 * Click the OK button in the multiselect modal, then wait for it to close.
 */
async function confirmMultiselect(page) {
  await page.locator('#multiselect-modal button[data-dismiss="modal"]').click();
  await page.waitForFunction(
    () => !document.getElementById('multiselect-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
}

/**
 * Wait for #dh-dialog-modal to appear and return its body text.
 */
async function waitForDhDialog(page) {
  await page.waitForFunction(
    () => document.getElementById('dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 6_000 }
  );
  return page.locator('#dh-dialog-modal .modal-body').textContent();
}

/**
 * Dismiss the open #dh-dialog-modal via the OK button and wait for it to close.
 */
async function dismissDhDialog(page) {
  await page.locator('#dh-dialog-ok').click();
  await page.waitForFunction(
    () => !document.getElementById('dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('UX_task_3: expert guard and multiselect edit of sample_plan_name examples (GRDI)', async ({ page }) => {
  test.setTimeout(120_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );

  // ── 2. Upload grdi_1m/schema.yaml ────────────────────────────────────────
  const sourceFile = path.resolve('web/templates/grdi_1m/schema.yaml');
  await page.setInputFiles('#schema_upload', sourceFile);

  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'GRDI'),
    null, { timeout: 30_000 }
  );

  // ── 3. Enable Expert User mode (needed for setup and final edit) ──────────
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 4. Navigate to Class tab; select GRDISample ──────────────────────────
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  // Click the GRDISample row (col 0, frozen in .ht_clone_left).
  const classRowIdx = await page.evaluate(() => {
    function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
    const rows = document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    );
    for (let i = 0; i < rows.length; i++) {
      if (ht(rows[i].querySelector('td')) === 'GRDISample') return i;
    }
    return -1;
  });
  expect(classRowIdx, 'GRDISample class row not found in Class tab').not.toBe(-1);

  await page.locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
    .nth(classRowIdx).locator('td:nth-of-type(1)').click();
  await page.waitForTimeout(300);

  // ── 5. Navigate to Slot (Field) tab ──────────────────────────────────────
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

  // ── 6. Setup: seed examples on base slot and GRDISample slot_usage ────────
  // The non-expert guard for slot_usage rows fires only when the cell is
  // currently inheriting a value from the base slot (oldVal === baseVal, both
  // non-empty).  We seed both rows so that Attempt 2 (non-expert, slot_usage)
  // is also blocked by the inherited-value check.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const physCol = dh.slot_name_to_column['examples'];
    if (physCol === undefined) return;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const slotType = hot.getSourceDataAtCell(p, dh.slot_type_column);
      const name     = hot.getSourceDataAtCell(p, dh.slot_name_column);
      if (name !== 'sample_plan_name') continue;
      const v = hot.toVisualRow(p);
      if (v === null) continue;
      if (slotType === 'slot') {
        hot.setDataAtCell(v, physCol, 'preset_example', 'cascade_confirm');
      } else if (slotType === 'slot_usage') {
        const classId = hot.getSourceDataAtCell(p, dh.slot_class_id_column);
        if (classId === 'GRDISample') {
          hot.setDataAtCell(v, physCol, 'preset_example', 'cascade_confirm');
        }
      }
    }
  });
  await page.waitForTimeout(300);

  // Sanity check: both seeded values are present.
  const seededBase = await getExamplesValue(page, 'sample_plan_name', 'slot');
  const seededSU   = await getExamplesValue(page, 'sample_plan_name', 'slot_usage');
  expect(seededBase, 'Base slot examples should be seeded').toBe('preset_example');
  expect(seededSU,   'GRDISample slot_usage examples should be seeded').toBe('preset_example');

  // ── 7. Disable Expert User mode for non-expert attempts ──────────────────
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb?.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 8. Find target rows (using HOT source data, not DOM text) ────────────
  const baseSlotVRow = await findSlotVisualRow(page, 'sample_plan_name', 'slot');
  expect(baseSlotVRow, 'sample_plan_name base slot row not found').not.toBe(-1);

  const suVRow = await findSlotVisualRow(page, 'sample_plan_name', 'slot_usage');
  expect(suVRow, 'sample_plan_name GRDISample slot_usage row not found').not.toBe(-1);

  // ── 9. Attempt 1 (non-expert): base slot → expert guard fires ────────────
  // slot_type='slot' rows are always blocked for non-expert users regardless
  // of the cell value; no inherited-value check is needed.
  await openExamplesModal(page, baseSlotVRow);
  await addSelectizeItems(page, 'foo', 'bar');
  await confirmMultiselect(page);

  const expertDialog1 = await waitForDhDialog(page);
  expect(expertDialog1, 'Expert dialog 1 should mention Expert User mode')
    .toContain('Expert User mode');
  expect(expertDialog1, 'Expert dialog 1 should name the slot')
    .toContain('sample_plan_name');
  await dismissDhDialog(page);

  // Cell must be unchanged.
  const baseAfter1 = await getExamplesValue(page, 'sample_plan_name', 'slot');
  expect(baseAfter1, 'Base slot examples must be unchanged after attempt 1')
    .toBe('preset_example');

  // ── 10. Attempt 2 (non-expert): GRDISample slot_usage → guard fires ───────
  // The slot_usage cell currently holds 'preset_example', which equals the base
  // slot value.  The inherited-value guard detects this and blocks the edit.
  await openExamplesModal(page, suVRow);
  await addSelectizeItems(page, 'foo', 'bar');
  await confirmMultiselect(page);

  const expertDialog2 = await waitForDhDialog(page);
  expect(expertDialog2, 'Expert dialog 2 should mention Expert User mode')
    .toContain('Expert User mode');
  expect(expertDialog2, 'Expert dialog 2 should name the slot')
    .toContain('sample_plan_name');
  await dismissDhDialog(page);

  // Cell must be unchanged.
  const suAfter2 = await getExamplesValue(page, 'sample_plan_name', 'slot_usage');
  expect(suAfter2, 'Slot_usage examples must be unchanged after attempt 2')
    .toBe('preset_example');

  // ── 11. Enable Expert User mode ──────────────────────────────────────────
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 12. Expert mode: edit base-slot examples to "foo;bar" ────────────────
  await openExamplesModal(page, baseSlotVRow);

  // Clear the seeded 'preset_example' value, then enter 'foo' and 'bar'.
  await page.evaluate(() => {
    const s = document.querySelector('#multiselect-text .multiselect')?.selectize;
    if (s) s.clear(true); // silent clear — no onChange events
  });
  await page.waitForTimeout(50);
  await addSelectizeItems(page, 'foo', 'bar');
  await confirmMultiselect(page);

  // ── 13. Informational dialog: GRDISample inherits this field ─────────────
  // afterChange fires for the slot_type='slot' row and shows a dialog listing
  // every slot_usage row that reuses the slot (GRDISample in this schema).
  const infoText = await waitForDhDialog(page);
  expect(infoText, 'Informational dialog should mention the new value')
    .toContain('foo;bar');
  expect(infoText, 'Informational dialog should list GRDISample')
    .toContain('GRDISample');
  await dismissDhDialog(page);

  // ── 14. Verify HOT source data reflects the expert edit ──────────────────
  const baseAfterExpert = await getExamplesValue(page, 'sample_plan_name', 'slot');
  expect(baseAfterExpert, 'Base slot examples should be "foo;bar" after expert edit')
    .toBe('foo;bar');

  // The GRDISample slot_usage is NOT auto-updated — the dialog is informational
  // only and propagation is left to the expert user's discretion.
  const suAfterExpert = await getExamplesValue(page, 'sample_plan_name', 'slot_usage');
  expect(suAfterExpert, 'Slot_usage examples should remain "preset_example" (no auto-propagation)')
    .toBe('preset_example');
});
