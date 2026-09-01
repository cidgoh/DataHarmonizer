/* Test: UX_Task_4_covid19
 *
 * Multi-schema workflow in SchemaEditor:
 *
 *   1. Create "Test" schema on Schema tab row 1
 *      (name="Test", URI="https://example.com/Test.yaml",
 *       title="Test Schema", description="Test Schema description",
 *       version="1.0.0", default_prefix="TEST")
 *   2. Switch to Table tab; add "TestTable" via Add Row button in footer,
 *      then fill in Table ID="TestTable", title="Test Table",
 *      description="Test table description"  (pattern: schema_editor_create_save.spec.js)
 *   3. Return to Schema tab; right-click row 2 (empty) →
 *      "Load LinkML schema.yaml" → web/templates/canada_covid19/schema.yaml
 *   4. Wait for "CanCOGeN_Covid-19" to appear in Schema tab (row 2 highlighted)
 *   5. Switch to Field tab; scrollToSlotRow("organism", "Table field (from schema)")
 *      (No Class selection needed: null class_id FK → "match any" shows all
 *      cancogen fields.  scrollToSlotRow implicitly verifies the tab is not empty.)
 *   6. Right-click organism → "Copy to schema" → select "Test" → confirm
 *      Copying a slot_usage also copies the base slot as a dependency
 *      (_analyzeCopyDependencies → addBaseSlotDep).  Copying a base slot
 *      copies only the slot itself.
 *   7. Return to Schema tab; click Test schema row
 *   8. Switch to Field tab; verify "organism" appears:
 *      - Primary (slot_usage): visible in DOM under the default slot_type filter
 *        (slot_usage + attribute are checked by default).
 *      - Fallback (slot): hidden by default filter; confirmed via HOT source data.
 *
 * Column layout reminder — Slot/Field tab .ht_master tbody tds (0-based):
 *   tds[0]  = placeholder for class_id (frozen in ht_clone_left)
 *   tds[1]  = slot_type   ("Type")
 *   tds[2]  = slot_group  ("Section")
 *   tds[3]  = name        ("Field ID")
 *   tds[4]  = rank        ("Ordering")
 *   tds[5]  = slot_uri
 *   tds[6]  = title
 *   tds[7]  = description
 *
 * Schema tab columns (hotCellLocator colIdx; no hidden cols):
 *   colIdx=0 → clone_left td:1 = name           (frozen, "Schema ID")
 *   colIdx=1 → master    td:2 = id              ("URI")
 *   colIdx=2 → master    td:3 = title
 *   colIdx=3 → master    td:4 = description
 *   colIdx=4 → master    td:5 = version
 *   colIdx=5 → master    td:6 = in_language     (skip)
 *   colIdx=6 → master    td:7 = locales         (skip)
 *   colIdx=7 → master    td:8 = default_prefix
 *
 * Class tab columns (schema_id hidden by concise view):
 *   colIdx=0 → clone_left td:1 = name  (frozen, "Table ID")
 *   colIdx=1 → master    td:2 = title
 *   colIdx=2 → master    td:3 = description
 *
 * To run:
 *   npx playwright test tests/playwright/UX_Task_4_covid19.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import {
  hotCellLocator,
  slotCellLocator,
  findRowIndex,
  scrollToSlotRow,
} from './playwright_utils.js';

test('UX_Task_4: create Test schema, add TestTable, create 3 pre-existing fields, load cancogen on row 2, copy organism to Test, verify in Field tab (pre-existing fields intact)', async ({ page }) => {
  test.setTimeout(180_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ───────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null,
    { timeout: 15_000 }
  );
  await expect(page.locator('#tab-bar-Schema .nav-link')).toHaveClass(/active/);

  // ── 2. Enter "Test" schema name in Schema tab row 1 (HOT index 0) ───────────
  // The Schema HOT starts with empty rows (minRows:5).  Col 0 (name) is frozen
  // in ht_clone_left.  Double-click to open edit mode, type "Test", then Tab.
  const nameCell = hotCellLocator(page, 0, 0);
  await nameCell.click();
  await nameCell.dblclick();
  await page.keyboard.type('Test');
  await page.keyboard.press('Tab');

  // Wait for "Test" to appear in the frozen name column.
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'Test'),
    null,
    { timeout: 10_000 }
  );

  // ── 3. Fill remaining Schema tab fields for row 1 ───────────────────────────
  // URI (id, colIdx 1)
  await hotCellLocator(page, 0, 1).dblclick();
  await page.keyboard.type('https://example.com/Test.yaml');
  await page.keyboard.press('Tab');

  // Title (colIdx 2)
  await hotCellLocator(page, 0, 2).dblclick();
  await page.keyboard.type('Test Schema');
  await page.keyboard.press('Tab');

  // Description (colIdx 3)
  await hotCellLocator(page, 0, 3).dblclick();
  await page.keyboard.type('Test Schema description');
  await page.keyboard.press('Tab');

  // Version (colIdx 4)
  await hotCellLocator(page, 0, 4).dblclick();
  await page.keyboard.type('1.0.0');
  await page.keyboard.press('Tab');

  // Default prefix (colIdx 7 — colIdx 5=in_language, 6=locales are skipped)
  await hotCellLocator(page, 0, 7).dblclick();
  await page.keyboard.type('TEST');
  await page.keyboard.press('Enter');

  // Re-select row 1 (index 0) so downstream FK lookups resolve to "Test" schema.
  await nameCell.click();
  await page.waitForTimeout(300);

  // ── 4. Switch to Table (Class) tab; add "TestTable" via Add Row ─────────────
  // Pattern matches schema_editor_create_save.spec.js: click #add-row, wait for
  // a row to appear in ht_master, then fill in Table ID / title / description.
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Table ID'),
    null,
    { timeout: 10_000 }
  );

  // Click Add Row (footer toolbar button).
  await page.click('#add-row');

  // Wait for at least one row in ht_master (HOT's minRows may pre-populate rows,
  // but click Add Row explicitly ensures the FK-annotated row exists).
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 1,
    null, { timeout: 10_000 }
  );
  await page.waitForTimeout(300);

  // Class tab (schema_id hidden by concise view):
  //   colIdx=0 → clone_left = Table ID (name)
  //   colIdx=1 → master     = title
  //   colIdx=2 → master     = description
  const tableIdCell = hotCellLocator(page, 0, 0);
  await tableIdCell.click();
  await tableIdCell.dblclick();
  await page.keyboard.type('TestTable');
  await page.keyboard.press('Tab');

  await hotCellLocator(page, 0, 1).dblclick();
  await page.keyboard.type('Test Table');
  await page.keyboard.press('Tab');

  await hotCellLocator(page, 0, 2).dblclick();
  await page.keyboard.type('Test table description');
  await page.keyboard.press('Enter');

  // ── 4.5. Create 3 pre-existing Test fields in Field tab ──────────────────────
  // Reproduces the user report: pre-existing Test schema slot_usage fields
  // appeared to disappear after copying a field from CanCOGeN to Test schema.
  // We create these BEFORE loading CanCOGeN so we can verify they survive.
  //
  // In the Slot tab, #add-row is overridden to open the Field Key Modal.
  // When a Table (class_id) is selected, the modal derives slot_type from
  // the "Field reuse" radio: slot_usage (default) or attribute.
  // For a field not yet in the library (Case C), the modal inserts two rows:
  //   1. A base slot (slot_type='slot') — hidden by the default filter
  //   2. A slot_usage row            — visible by the default filter
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
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Field ID'),
    null,
    { timeout: 10_000 }
  );
  await page.waitForTimeout(500);

  // Helper: create one Test field via the Field Key Modal.
  // Uses 'attribute' type so the free-text #fkm-name input is shown — slot_usage
  // type shows a strict picklist (#fkm-name-select) that requires existing base
  // slots, which the fresh "Test" schema does not have yet.
  const createTestField = async (fieldName) => {
    await page.click('#add-row');
    await page.waitForFunction(
      () => document.querySelector('#field-key-modal')?.classList.contains('show'),
      null, { timeout: 8_000 }
    );
    const fkm = page.locator('#field-key-modal.show');
    // schema_id is locked to 'Test' in Records-by-key mode.
    await fkm.locator('#fkm-class-id').selectOption({ label: 'TestTable' });
    await page.waitForTimeout(200);
    // Switch to 'attribute' — this shows #fkm-name (free-text).
    // 'slot_usage' type hides #fkm-name and shows #fkm-name-select (picklist of
    // existing schema slots); the "Test" schema has none at this stage.
    await fkm.locator('#fkm-field-type').selectOption('attribute');
    await page.waitForTimeout(200);
    await fkm.locator('#fkm-name').fill(fieldName);
    await page.waitForTimeout(200);
    await fkm.locator('#fkm-confirm-btn').click();
    await page.waitForFunction(
      () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
      null, { timeout: 8_000 }
    );
    await page.waitForTimeout(300);
  };

  await createTestField('pre_existing_a');
  await createTestField('pre_existing_b');
  await createTestField('pre_existing_c');

  // Verify all 3 slot_usage rows are visible in the Field tab DOM
  // (base slot rows are hidden by the default filter — that is expected).
  const preExistingVisible = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    );
    const found = { pre_existing_a: false, pre_existing_b: false, pre_existing_c: false };
    for (const row of rows) {
      const tds  = Array.from(row.querySelectorAll('td'));
      // Use the field-id-bold class to locate the name column regardless of
      // whether schema_id is hidden (column layout differs between schemas).
      const nameTd = tds.find(td => td.classList.contains('field-id-bold'));
      if (!nameTd) continue;
      const name = nameTd.textContent.replace(/\u25bc/g, '').trim();
      if (name in found) found[name] = true;
    }
    return found;
  });
  expect(
    Object.values(preExistingVisible).every(Boolean),
    `All 3 pre-existing Test fields should be visible before copy: ${JSON.stringify(preExistingVisible)}`
  ).toBe(true);

  // ── 5. Return to Schema tab ──────────────────────────────────────────────────
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    ).length > 0,
    null, { timeout: 10_000 }
  );

  // Click the Test schema row (row 1 / index 0) to set FK context.
  await nameCell.click();
  await page.waitForTimeout(300);

  // ── 6. Right-click Schema row 2 (index 1) → "Load LinkML schema.yaml" ───────
  // Row 2 is the first empty slot after Test (row 1).  Right-clicking it before
  // selecting "Load LinkML schema.yaml" sets focus_row=1 inside loadSchemaYAML
  // so the cancogen data is placed on that row.
  const cancogenFile = path.resolve('web/templates/canada_covid19/schema.yaml');

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 30_000 }),
    (async () => {
      const cancogenSlot = page
        .locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
        .nth(1)
        .locator('td:nth-of-type(1)');
      await cancogenSlot.click();
      await page.waitForTimeout(200);
      await cancogenSlot.click({ button: 'right' });
      const loadItem = page
        .locator('.htItemWrapper')
        .filter({ hasText: 'Load LinkML schema.yaml' })
        .first();
      await loadItem.waitFor({ state: 'visible', timeout: 8_000 });
      await loadItem.click();
    })(),
  ]);
  await fileChooser.setFiles(cancogenFile);

  // Wait for "CanCOGeN_Covid-19" to appear in the Schema tab.
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'CanCOGeN_Covid-19'),
    null,
    { timeout: 30_000 }
  );

  // Verify cancogen landed on row 2 (index 1).
  const cancogenRowIdx = await findRowIndex(page, 0, 'CanCOGeN_Covid-19');
  expect(cancogenRowIdx, 'CanCOGeN_Covid-19 should appear in Schema tab after load').not.toBe(-1);
  expect(cancogenRowIdx, 'CanCOGeN_Covid-19 should be on Schema tab row 2 (index 1)').toBe(1);

  // ── 5. Switch to Field tab; scroll to "organism" ────────────────────────────
  // class_id FK is null (no Class row selected) → null means "match any" so
  // all cancogen fields are visible without needing a Class tab detour.
  // scrollToSlotRow implicitly verifies the Field tab is not empty.
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
    () => document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    ).length > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(500);

  const organismRowIdx = await scrollToSlotRow(
    page, 'organism', 'Table field (from schema)'
  );
  expect(organismRowIdx, '"organism" field not found in CanCOGeNCovid19 Field tab').not.toBe(-1);

  // ── 6. Right-click organism → "Copy to schema" ───────────────────────────────
  // Use the title column (ht_master tds[6] = colIdx 6) — a plain text cell that
  // will not open the Field Key Modal on right-click.
  //
  // HOT virtual rendering: after scrollToSlotRow the row is in DOM, but a
  // subsequent left-click or waitForTimeout can cause HOT to re-render and
  // scroll the row off-screen.  Re-scroll right before each interaction so
  // the row stays in the DOM for the action.
  let organismCell = slotCellLocator(page, organismRowIdx, 6);
  await organismCell.scrollIntoViewIfNeeded();
  await organismCell.click();
  await page.waitForTimeout(300);

  // Re-scroll to keep organism visible before right-click (HOT virtualisation
  // may have shifted the viewport between the left-click and the right-click).
  const latestOrganismIdx = await scrollToSlotRow(
    page, 'organism', 'Table field (from schema)'
  );
  if (latestOrganismIdx !== -1) {
    organismCell = slotCellLocator(page, latestOrganismIdx, 6);
  }
  await organismCell.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await organismCell.click({ button: 'right' });

  const copyItem = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Copy to schema' })
    .first();
  await copyItem.waitFor({ state: 'visible', timeout: 8_000 });
  await copyItem.click();

  // ── 7. Select "Test" in the copy-to-schema modal and confirm ─────────────────
  // The modal lists only non-source schema names; "Test" is the only target here.
  await page.waitForFunction(
    () => document.querySelector('#copy-to-schema-modal')?.classList.contains('show'),
    null, { timeout: 8_000 }
  );

  await page.selectOption('#copy-to-schema-select', { label: 'Test' });
  await page.waitForTimeout(200);

  // The "Copy to table" select is shown for slot_usage/attribute rows and
  // lists the classes in the target schema.  TestTable is the only one here.
  await page.selectOption('#copy-to-class-select', { label: 'TestTable' });
  await page.waitForTimeout(200);

  await page.click('#copy-to-schema-confirm-btn');
  await page.waitForFunction(
    () => !document.querySelector('#copy-to-schema-modal')?.classList.contains('show'),
    null, { timeout: 8_000 }
  );

  // executeCopyToSchema calls dhAlert("N row(s) copied to schema…") which
  // opens #dh-dialog-modal.  Dismiss it before any further tab navigation.
  await page.waitForFunction(
    () => document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 8_000 }
  );

  await page.click('#dh-dialog-ok');
  // Bootstrap removes .show first, then completes the CSS fade (~300 ms) before
  // removing the backdrop.  Using waitForSelector with an ID selector is
  // unreliable here because each DH tab instance appends its own copy of
  // contentModals.html, creating multiple #dh-dialog-modal elements; Playwright
  // may match a different copy than the one actually shown.
  // Instead wait on the modal-backdrop element that Bootstrap inserts into the
  // DOM when any modal is open and removes only after the fade completes.
  await page.waitForFunction(
    () => !document.querySelector('.modal-backdrop'),
    null, { timeout: 8_000 }
  );

  // ── 8. Return to Schema tab → click Test schema ──────────────────────────────
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  // nameCell (row 0, col 0) targets the Test schema row defined at step 2.
  await nameCell.click();
  await page.waitForTimeout(300);

  // ── 9. Switch to Field tab; verify "organism" appears in Test schema ──────────
  // Primary case (slot_usage copied): the slot_usage row is visible under the
  // default slot_type filter (slot_usage + attribute checked by default).
  // Also, _analyzeCopyDependencies automatically copies the base slot as a
  // dependency, so Test schema gains both a slot and a slot_usage organism.
  //
  // Fallback case (base slot copied directly): slot_type='slot' is hidden by
  // the default filter — confirmed via HOT source data instead of DOM.
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
    () => document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    ).length > 0,
    null, { timeout: 15_000 }
  );
  // Scroll to top: copy appends rows at the bottom and HOT may be scrolled down.
  await page.evaluate(() => {
    const holder = document.querySelector('.tab-pane.show .ht_master .wtHolder');
    if (holder) holder.scrollTop = 0;
  });
  await page.waitForTimeout(300);

  const copiedOrganismIdx = await scrollToSlotRow(
    page, 'organism', 'Table field (from schema)'
  );
  if (copiedOrganismIdx === -1) {
    // slot_usage not visible under the default filter; check for a base-slot copy.
    const copiedAsBaseSlot = await page.evaluate(() => {
      const dh  = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot) return false;
      const n2c = dh.slot_name_to_column;
      const schemaIdCol = n2c['schema_id'] ?? n2c['schema_name'] ?? 0;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (
          hot.getSourceDataAtCell(p, n2c['name'])     === 'organism' &&
          hot.getSourceDataAtCell(p, schemaIdCol)      === 'Test'    &&
          hot.getSourceDataAtCell(p, n2c['slot_type']) === 'slot'
        ) return true;
      }
      return false;
    });
    expect(
      copiedAsBaseSlot,
      '"organism" not found in Test schema (checked slot_usage in DOM, slot in source data)'
    ).toBe(true);
  } else {
    // slot_usage found — verify class_id was reassigned to TestTable.
    const classIdCorrect = await page.evaluate(() => {
      const dh  = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot) return false;
      const n2c = dh.slot_name_to_column;
      const schemaIdCol = n2c['schema_id'] ?? n2c['schema_name'] ?? 0;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (
          hot.getSourceDataAtCell(p, n2c['name'])     === 'organism' &&
          hot.getSourceDataAtCell(p, schemaIdCol)      === 'Test'    &&
          hot.getSourceDataAtCell(p, n2c['slot_type']) === 'slot_usage'
        ) {
          return hot.getSourceDataAtCell(p, n2c['class_id']) === 'TestTable';
        }
      }
      return false;
    });
    expect(
      classIdCorrect,
      '"organism" (slot_usage) in Test schema should have class_id "TestTable"'
    ).toBe(true);
  }

  // ── 9b. Verify schema_id displays 'Test' in non-concise view ────────────────
  // The "missing Schema ID" symptom is caused by concise view hiding the
  // schema_id FK column for ALL rows (by design in "Records by key" mode).
  // This step confirms schema_id IS rendered correctly when concise view is off:
  // every visible row in the frozen column (.ht_clone_left td) must show 'Test'.
  //
  // Temporarily disable concise view so schema_id becomes the frozen column.
  // Use native DOM API (not $) so the event fires inside page.evaluate context.
  await page.evaluate(() => {
    const cb = document.getElementById('concise-view-checkbox');
    if (cb) { cb.checked = false; cb.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.waitForTimeout(400); // HOT re-render with schema_id as frozen col.

  const frozenCellSchemaIds = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    );
    return Array.from(rows).map(row =>
      (row.querySelector('td')?.textContent ?? '').replace(/\u25bc/g, '').trim()
    );
  });
  // All visible rows are filtered to Test schema (tabFilter schema_id='Test'),
  // so every frozen cell must show 'Test'.  Expect at least 4 rows:
  // 3 pre-existing slot_usage + organism slot_usage.
  expect(
    frozenCellSchemaIds.length,
    `Expected ≥4 visible rows (3 pre-existing + organism); got ${frozenCellSchemaIds.length}`
  ).toBeGreaterThanOrEqual(4);
  expect(
    frozenCellSchemaIds.every(v => v === 'Test'),
    `All visible rows must show schema_id='Test' in frozen column: ${JSON.stringify(frozenCellSchemaIds)}`
  ).toBe(true);

  // Restore concise view.
  await page.evaluate(() => {
    const cb = document.getElementById('concise-view-checkbox');
    if (cb) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.waitForTimeout(300);

  // ── 10. Verify source (CanCOGeN) organism records were not corrupted ─────────
  // A HOT 15 bug: loadData() resets the row index mapper to natural order but
  // does NOT re-apply the active multiColumnSorting.  This caused the copy to
  // leave rows in insertion order (CanCOGeN interleaved with Test rows visually)
  // and in subsequent _appendRowsToTab calls the wrong physical positions were
  // targeted, corrupting existing CanCOGeN records.
  // Fix: re-apply getSortConfig() after every loadData() in _appendRowsToTab.
  // This assertion detects the corruption: the CanCOGeN organism slot_usage
  // should still exist with its original class_id (not overwritten to 'TestTable').
  const canCoGenOrganismIntact = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot) return { ok: false, reason: 'no Slot DH found' };
    const n2c = dh.slot_name_to_column;
    const schemaIdCol = n2c['schema_id'] ?? n2c['schema_name'] ?? 0;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const schema   = hot.getSourceDataAtCell(p, schemaIdCol);
      const name     = hot.getSourceDataAtCell(p, n2c['name']);
      const slotType = hot.getSourceDataAtCell(p, n2c['slot_type']);
      if (name === 'organism' && schema !== 'Test' && slotType === 'slot_usage') {
        const classId = hot.getSourceDataAtCell(p, n2c['class_id']);
        if (classId === 'TestTable') {
          return { ok: false, reason: `CanCOGeN organism class_id overwritten to 'TestTable' (schema=${schema})` };
        }
        return { ok: true };
      }
    }
    return { ok: false, reason: 'CanCOGeN organism slot_usage not found after copy — possible row displacement' };
  });
  expect(
    canCoGenOrganismIntact.ok,
    `CanCOGeN organism must remain intact after copy: ${canCoGenOrganismIntact.reason}`
  ).toBe(true);

  // ── 11. Verify pre-existing Test fields survived the copy ──────────────────
  // Each pre-existing field should have both a base slot (slot_type='slot')
  // and a slot_usage row (slot_type='slot_usage') in HOT source data after
  // the copy.  If either is missing, the _appendRowsToTab call dropped them.
  const preExistingFieldsIntact = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Slot;
    const hot = dh?.hot;
    if (!hot) return { ok: false, reason: 'no Slot DH found' };
    const n2c = dh.slot_name_to_column;
    const schemaIdCol = n2c['schema_id'] ?? n2c['schema_name'] ?? 0;
    const names = ['pre_existing_a', 'pre_existing_b', 'pre_existing_c'];
    const missingSlot      = [];
    const missingSlotUsage = [];
    for (const want of names) {
      let hasSlot = false, hasSlotUsage = false;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        const schema = hot.getSourceDataAtCell(p, schemaIdCol);
        const name   = hot.getSourceDataAtCell(p, n2c['name']);
        const type   = hot.getSourceDataAtCell(p, n2c['slot_type']);
        if (schema === 'Test' && name === want) {
          // createTestField uses 'attribute' type (no separate base slot row).
          if (type === 'slot' || type === 'attribute')        hasSlot      = true;
          if (type === 'slot_usage' || type === 'attribute')  hasSlotUsage = true;
        }
      }
      if (!hasSlot)      missingSlot.push(want);
      if (!hasSlotUsage) missingSlotUsage.push(want);
    }
    const parts = [];
    if (missingSlot.length)      parts.push(`missing base slot: ${missingSlot.join(', ')}`);
    if (missingSlotUsage.length) parts.push(`missing slot_usage: ${missingSlotUsage.join(', ')}`);
    if (parts.length) return { ok: false, reason: parts.join('; ') };
    return { ok: true };
  });
  expect(
    preExistingFieldsIntact.ok,
    `Pre-existing Test fields must survive the copy: ${preExistingFieldsIntact.reason}`
  ).toBe(true);
});
