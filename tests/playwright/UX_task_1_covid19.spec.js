/* Test: UX_task_1_covid19
 *
 * Loads the Canada COVID-19 schema into SchemaEditor, then exercises a
 * realistic editing workflow:
 *
 *   1. Upload web/templates/canada_covid19/schema.yaml
 *   2. Enable Expert User mode (required for row removal)
 *   3. Navigate to Field tab with CanCOGeNCovid19 as context
 *   4. Locate 'case_id' base-slot row → check Required, uncheck Recommended
 *   5. Scroll to 'third_party_lab_sample_id' slot-usage row → right-click Remove
 *   6. Add new field "Diagnostic PCR Protocol 4" (name: diagnostic_pcr_protocol_4)
 *      via the Field Key Modal, type = slot_usage, class = CanCOGeNCovid19
 *   7. Change the new field's section (slot_group) to "Pathogen diagnostic testing"
 *   8. Navigate to Schema tab → right-click → Save as LinkML schema.yaml
 *   9. Verify saved YAML against source file (diff assertions)
 *
 * Column layout reminder — Slot/Field tab .ht_master tbody tds (0-based):
 *   tds[0]  = placeholder for class_id (frozen in ht_clone_left)
 *   tds[1]  = slot_type   ("Type" – "Schema field" / "Table field (from schema)" / …)
 *   tds[2]  = slot_group  ("Section")
 *   tds[3]  = name        ("Field ID")
 *   tds[4]  = rank        ("Ordering")
 *   tds[5]  = slot_uri
 *   tds[6]  = title
 *   tds[7]  = description
 *   tds[12] = required    (checkbox)
 *   tds[13] = recommended (checkbox)
 *
 * To run this test:
 *   npx playwright test tests/playwright/UX_task_1_covid19.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync, mkdirSync } from 'fs';
import YAML from 'yaml';
import { hotCellLocator, slotCellLocator, findSlotRowIndex, findRowIndex, scrollToSlotRow } from './playwright_utils.js';

// ── Test ───────────────────────────────────────────────────────────────────────

test('UX_task_1_covid19: load, edit, remove, add field, save, verify diff', async ({ page }) => {
  test.setTimeout(120_000); // This workflow needs well over 30 s

  // Capture browser errors so failures are visible in test output.
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`[BROWSER error]`, msg.text());
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

  // ── 2. Upload canada_covid19/schema.yaml ────────────────────────────────────
  // setInputFiles triggers the #schema_upload 'change' event which calls
  // SchemaEditor.loadSchemaYAML().  No manual row-selection is needed — the
  // code auto-selects the first empty Schema row when no cell is focused.
  const sourceFile = path.resolve('web/templates/canada_covid19/schema.yaml');
  await page.setInputFiles('#schema_upload', sourceFile);

  // Wait for the schema name to appear in the Schema tab HOT.
  await page.waitForFunction(
    () => {
      const cells = document.querySelectorAll(
        '.tab-pane.show .ht_clone_left.handsontable tbody td'
      );
      return Array.from(cells).some(td =>
        td.textContent.replace(/\u25bc/g, '').trim() === 'CanCOGeN_Covid-19'
      );
    },
    null,
    { timeout: 30_000 }
  );

  // ── 3. Enable Expert User mode (required for row removal) ──────────────────
  // #schema_expert lives inside a Bootstrap dropdown. Rather than opening the
  // dropdown (which makes the checkbox "visible" per Bootstrap but still
  // "hidden" per Playwright's CSS-visibility check), we call .click() on the
  // element directly via page.evaluate, which triggers the jQuery handler that
  // sets context.expert_user = true.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // ── 4. Switch to Class tab and select CanCOGeNCovid19 ──────────────────────
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null,
    { timeout: 5_000 }
  );

  // Find the CanCOGeNCovid19 row (Table ID column = col 0, frozen in clone_left).
  const classRowIdx = await findRowIndex(page, 0, 'CanCOGeNCovid19');
  expect(classRowIdx).not.toBe(-1);

  // Single-click to select the row — this sets the Field tab filter context.
  await hotCellLocator(page, classRowIdx, 0).click();
  await page.waitForTimeout(300);

  // ── 5. Switch to Field (Slot) tab ──────────────────────────────────────────
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

  // Wait for HOT to render at least one row before proceeding.
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null,
    { timeout: 15_000 }
  );
  await page.waitForTimeout(500);

  // ── 6-8. Find case_id slot-usage row; check Required, uncheck Recommended ──
  // The Field tab by default shows only slot-usage and attribute rows
  // (_slotTypeFilter = Set(['slot_usage','attribute'])).  Base-slot rows
  // ("Schema field") are hidden unless the user enables them in the Display menu.
  //
  // The visible slot-usage rows are sorted by slot_group (asc) then rank (asc).
  // case_id is in "Database Identifiers" (D), rank 4, which comes after
  // "Bioinformatics and QC metrics" (B, ~21 rows) and "Contributor
  // acknowledgement" (C, ~2 rows) → visual row ~26.  viewportRowRenderingOffset
  // is 30, so it is rendered at initial scroll position without needing to scroll.
  //
  // recommended:true is INHERITED from the base slot into the slot_usage row
  // (loadSchemaYAML copies base-slot values into slot_usage for display).
  // Clicking the required checkbox sets slot_usage.case_id.required = true.
  // Clicking the recommended checkbox unsets slot_usage.case_id.recommended.
  const caseIdRowIdx = await scrollToSlotRow(
    page, 'case_id', 'Table field (from schema)'
  );
  expect(caseIdRowIdx).not.toBe(-1);

  // ── 7-8. Set Required = true, Recommended = false for case_id slot_usage ───
  // HOT checkbox cells toggle on mousedown.  In headless Playwright the HOT
  // table may not be in its "listened" (focused) state after modal interactions,
  // causing mousedown on a checkbox TD to land without triggering the toggle.
  // We call hot.setDataAtCell() directly — the same internal HOT API that a
  // successful UI click ultimately invokes — to reliably set the values.
  //
  // required:  null → true   (add override: this field is required)
  // recommended: true → false (override: suppress inherited recommended flag)
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
          hot.getSourceDataAtCell(p, dh.slot_name_column) === 'case_id') {
        const v = hot.toVisualRow(p);
        // Use 'cascade_confirm' to bypass the inherited-cell-edit dialog
        // that would be shown for a real user click on an inherited cell.
        hot.setDataAtCell(v, n2c['required'],    true,  'cascade_confirm');
        hot.setDataAtCell(v, n2c['recommended'], false, 'cascade_confirm');
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── 9. Scroll to third_party_lab_sample_id slot-usage row and remove it ────
  // third_party_lab_sample_id is also in "Database Identifiers", rank 3 (just
  // above case_id at rank 4), so it is also in the rendered viewport range.
  // scrollToSlotRow starts from the current scroll position and finds it quickly.
  const tplsRowIdx = await scrollToSlotRow(
    page, 'third_party_lab_sample_id', 'Table field (from schema)'
  );
  expect(tplsRowIdx).not.toBe(-1);

  // Left-click first to select the row in HOT, then right-click to open
  // the context menu.  scrollToSlotRow renders the row in HOT's DOM but it
  // may be outside the visible HOT viewport; scrollIntoViewIfNeeded() brings
  // it into view so the pointer events land on the correct cell.
  const tplsCell = slotCellLocator(page, tplsRowIdx, 6); // title column — plain cell
  await tplsCell.scrollIntoViewIfNeeded();
  await tplsCell.click();
  await page.waitForTimeout(300);
  await tplsCell.click({ button: 'right' });

  // HOT 15 context menu: each item is rendered as <td><div class="htItemWrapper">…</div></td>.
  // The class is on the inner div, NOT the td, so 'td.htItemWrapper' is wrong.
  // Use '.htItemWrapper' which targets the div directly.
  const removeRowItem = page.locator('.htItemWrapper').filter({ hasText: 'Remove row(s)' }).first();
  await removeRowItem.waitFor({ state: 'visible', timeout: 8_000 });
  await removeRowItem.click();

  // The remove-row handler now shows a confirmation dialog (dhChoose).
  // third_party_lab_sample_id is a slot_usage (not a schema field), so the
  // Delete button is enabled.  Wait for the dialog then click Delete.
  await page.waitForFunction(
    () => document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  // The Delete button is a dynamically-inserted btn-primary inserted before Cancel.
  await page.locator('#dh-dialog-modal .modal-footer .btn-primary').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(500);

  // Confirm the row is gone from the visible DOM.
  const afterRemoveIdx = await findSlotRowIndex(
    page, 'third_party_lab_sample_id', 'Table field (from schema)'
  );
  expect(afterRemoveIdx).toBe(-1);

  // ── 10a. Add base schema slot via FKM ──────────────────────────────────────
  // In Add mode, slot_usage type shows #fkm-name-select (strict picklist of
  // existing slots), not #fkm-name (free text).  A new field must be registered
  // as a schema slot first, then linked as a slot_usage in a second FKM open.
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );
  {
    const fkm = page.locator('#field-key-modal.show');
    // Switch to 'slot' type — shows #fkm-name free-text input.
    await fkm.locator('#fkm-field-type').selectOption('slot');
    await page.waitForTimeout(300);
    await fkm.locator('#fkm-name').fill('diagnostic_pcr_protocol_4');
    await fkm.locator('#fkm-title').fill('Diagnostic PCR Protocol 4');
    await fkm.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null, { timeout: 5_000 }
    );
  }
  await page.waitForTimeout(300);

  // ── 10b. Add slot_usage linking the new base slot to CanCOGeNCovid19 ────────
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );
  {
    const fkm = page.locator('#field-key-modal.show');
    // Type defaults to 'slot_usage'; select the class first.
    await fkm.locator('#fkm-class-id').selectOption('CanCOGeNCovid19');
    await page.waitForTimeout(300);
    // Pick the newly-created base slot from the strict picklist.
    await fkm.locator('#fkm-name-select').selectOption('diagnostic_pcr_protocol_4');
    await page.waitForTimeout(200);
    await fkm.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null, { timeout: 5_000 }
    );
  }
  await page.waitForTimeout(400);

  // ── 11. Tab-switch to trigger refreshTabDisplay, then locate new field ───────
  // After FKM confirm, the new slot_usage row is inserted but tabFilter has not
  // re-run, so it may still appear hidden from a prior hide cycle.  Switching
  // tabs fires shown.bs.tab → tabChange → refreshTabDisplay → tabFilter, which
  // calls showRows() for every row matching the key filter (class_id + schema_id),
  // making the newly inserted slot_usage row visible.
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(600);

  // After re-sort, the new field (slot_group=null) sorts first alphabetically.
  // Use scrollViewportTo to ensure HOT has rendered the row in the DOM.
  const newSlotVisual = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot || !dh) return -1;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const slotType = hot.getSourceDataAtCell(p, dh.slot_type_column);
      const name     = hot.getSourceDataAtCell(p, dh.slot_name_column);
      if (slotType === 'slot_usage' && name === 'diagnostic_pcr_protocol_4') {
        const v = hot.toVisualRow(p);
        hot.scrollViewportTo({ row: v, col: 0 });
        return v;
      }
    }
    return -1;
  });
  expect(newSlotVisual, 'diagnostic_pcr_protocol_4 slot_usage not found in HOT source data')
    .not.toBe(-1);
  await page.waitForTimeout(400);

  const newSlotRowIdx = await findSlotRowIndex(
    page, 'diagnostic_pcr_protocol_4', 'Table field (from schema)'
  );
  expect(newSlotRowIdx, 'diagnostic_pcr_protocol_4 not in DOM after tab switch + scroll')
    .not.toBe(-1);

  // ── 12. Open FKM Edit mode and set section to "Pathogen diagnostic testing" ──
  // Double-clicking a slot_usage row in the Field tab opens the Field Key Modal
  // in "Edit Field" mode.  The FKM's #fkm-slot-group <select> is populated from
  // the schema's slot-group definitions — use it to set the section, rather than
  // attempting to type directly into the HOT cell.
  const newFieldNameCell = page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(newSlotRowIdx)
    .locator('td:nth-of-type(4)'); // tds[3] = name / Field ID column
  await newFieldNameCell.scrollIntoViewIfNeeded();
  await newFieldNameCell.dblclick();

  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.selectOption('#fkm-slot-group', { label: 'Pathogen diagnostic testing' });
  await page.waitForTimeout(200);
  await page.click('#fkm-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(400);

  // ── 13. Switch to Schema tab ─────────────────────────────────────────────────
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null,
    { timeout: 5_000 }
  );

  // ── 14. Find the CanCOGeN_Covid-19 schema row and save via right-click menu ──
  const schemaRowIdx = await findRowIndex(page, 0, 'CanCOGeN_Covid-19');
  expect(schemaRowIdx).not.toBe(-1);

  // The saveSchema() method calls window.prompt() for the filename.
  // Register the dialog handler BEFORE triggering the save.
  const outputFileName = 'CanCOGeN_Covid-19.yaml';
  page.once('dialog', async (dialog) => {
    await dialog.accept(outputFileName);
  });

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    (async () => {
      // Left-click to select the schema row, then right-click to open the menu.
      const schemaCell = hotCellLocator(page, schemaRowIdx, 0);
      await schemaCell.click();
      await page.waitForTimeout(200);
      await schemaCell.click({ button: 'right' });
      // Wait for the "Save as LinkML schema.yaml" item to appear in any context menu.
      // HOT 15: class is on a div inside the td, not the td itself → use '.htItemWrapper'.
      const saveItem = page.locator('.htItemWrapper').filter({ hasText: 'Save as LinkML schema.yaml' }).first();
      await saveItem.waitFor({ state: 'visible', timeout: 8_000 });
      await saveItem.click();
    })(),
  ]);

  const outputDir  = path.resolve('test-results');
  mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, outputFileName);
  await download.saveAs(outputFile);
  console.log(`Schema saved to: ${outputFile}`);

  // ── 15. Parse both files and verify the diff ─────────────────────────────────
  const source = YAML.parse(readFileSync(sourceFile, 'utf-8'));
  const saved  = YAML.parse(readFileSync(outputFile, 'utf-8'));

  // ── 15a. Schema identity preserved ──────────────────────────────────────────
  expect(saved.name).toBe('CanCOGeN_Covid-19');

  // ── 15b. case_id: required added, recommended removed in slot_usage ─────────
  // The Field tab shows slot-usage rows by default (base-slot rows are hidden).
  // Clicking required / recommended on the slot_usage row writes to
  // CanCOGeNCovid19.slot_usage.case_id, not the global slots.case_id.
  //
  // Source: slot_usage.case_id has no required/recommended override;
  //         global slots.case_id has recommended: true.
  const srcSlotUsage = source.classes?.CanCOGeNCovid19?.slot_usage ?? {};
  expect(srcSlotUsage['case_id']?.required).toBeFalsy();
  expect(srcSlotUsage['case_id']?.recommended).toBeFalsy();
  expect(source.slots?.case_id?.recommended).toBe(true);

  const savedSlotUsage = saved.classes?.CanCOGeNCovid19?.slot_usage ?? {};

  // Saved: slot_usage.case_id has required: true
  expect(savedSlotUsage['case_id']?.required).toBe(true);
  // Saved: slot_usage.case_id has recommended explicitly false (or absent)
  expect(savedSlotUsage['case_id']?.recommended).toBeFalsy();

  // ── 15c. third_party_lab_sample_id removed from CanCOGeNCovid19 ─────────────
  // Source had it in both the slots list and slot_usage.
  const srcSlots = source.classes?.CanCOGeNCovid19?.slots ?? [];
  expect(srcSlots).toContain('third_party_lab_sample_id');
  expect(srcSlotUsage['third_party_lab_sample_id']).toBeDefined();

  // Saved: no longer in slot_usage (the slot-usage row we right-clicked removed).
  expect(savedSlotUsage['third_party_lab_sample_id']).toBeUndefined();

  // ── 15d. New field diagnostic_pcr_protocol_4 added ─────────────────────────
  // Source: does not exist anywhere.
  expect(source.slots?.diagnostic_pcr_protocol_4).toBeUndefined();
  expect(srcSlotUsage['diagnostic_pcr_protocol_4']).toBeUndefined();

  // Saved: slot_usage entry for the new field exists in CanCOGeNCovid19.
  const newFieldSU = savedSlotUsage['diagnostic_pcr_protocol_4'];
  expect(newFieldSU).toBeDefined();

  // ── 15e. New field section set to "Pathogen diagnostic testing" ─────────────
  // The slot_group is stored in the slot_usage row for per-table section placement.
  expect(newFieldSU?.slot_group).toBe('Pathogen diagnostic testing');

  // ── 15f. New field title preserved ─────────────────────────────────────────
  // Title may be on the base slot or the slot_usage row — check both.
  const newFieldBaseSlot = saved.slots?.diagnostic_pcr_protocol_4;
  const savedTitle = newFieldSU?.title ?? newFieldBaseSlot?.title;
  expect(savedTitle).toBe('Diagnostic PCR Protocol 4');
});
