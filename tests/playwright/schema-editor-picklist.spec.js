/* Regression test: no spurious cascade-key-change dialog when naming a new picklist.
 *
 * Steps:
 *   1. Create schema_a
 *   2. Navigate to Picklist (Enum) tab, add PA with three choices a, b, c
 *   3. Return to Picklist tab, add a new empty picklist PB
 *   4. Type the name 'PB' — the system must NOT show a dialog claiming
 *      existing PermissibleValue records will be changed.
 *
 * Bug: the search for affected PermissibleValues used only schema_id (because
 * enum_id was null/empty for the brand-new row), finding PA's a/b/c PVs and
 * triggering a false-positive cascade warning.
 *
 * Run headed to observe dialogs:
 *   npx playwright test tests/playwright/schema-editor-picklist.spec.js --headed
 */

import { test, expect } from '@playwright/test';
import { hotCellLocator } from './playwright_utils.js';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Wait for loading screen to hide and the first HOT column header to appear. */
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

/** Navigate to a tab and wait for its pane to be the only visible one. */
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

// ── test ─────────────────────────────────────────────────────────────────────

test('no spurious cascade dialog when naming a new picklist', async ({ page }) => {

  // Capture browser console output for diagnostics.
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  // ── 1. Load ────────────────────────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await waitForSchemaEditor(page);

  // ── 2. Create schema_a ────────────────────────────────────────────────────
  await typeIntoCell(page, hotCellLocator(page, 0, 0), 'schema_a');
  await waitForCloneCellText(page, 'schema_a');
  // Re-select schema_a so it is the active FK context.
  await hotCellLocator(page, 0, 0).click();

  // ── 3. Go to Enum (Picklist) tab ─────────────────────────────────────────
  await goToTab(page, '#tab-bar-Enum');

  // ── 4. Add picklist PA ───────────────────────────────────────────────────
  await page.click('#add-row');
  await page.waitForTimeout(300);
  await typeIntoCell(page, hotCellLocator(page, 0, 0), 'PA');
  await waitForCloneCellText(page, 'PA');
  // Re-select PA so it is the active FK context for PermissibleValue rows.
  await hotCellLocator(page, 0, 0).click();

  // ── 5. Go to PermissibleValue tab and add choices a, b, c ────────────────
  await goToTab(page, '#tab-bar-PermissibleValue');

  for (const choice of ['a', 'b', 'c']) {
    await page.click('#add-row');
    await page.waitForTimeout(300);
    // Find the last row (newly added) and type the choice name.
    const rowCount = await page.evaluate(
      () => document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody tr').length
    );
    await typeIntoCell(page, hotCellLocator(page, rowCount - 1, 0), choice);
    await waitForCloneCellText(page, choice);
  }

  // ── 6. Return to Enum tab ────────────────────────────────────────────────
  await goToTab(page, '#tab-bar-Enum');
  // PA should still be visible.
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
  // If a confirm/alert dialog appears, Playwright will detect it via the
  // 'dialog' event. We register a handler that records any dialog seen,
  // dismisses it (accept), and lets the test continue.
  const dialogs = [];
  page.once('dialog', async (dialog) => {
    dialogs.push({ type: dialog.type(), message: dialog.message() });
    await dialog.accept();
  });

  await typeIntoCell(page, hotCellLocator(page, pbRowIdx, 0), 'PB');
  // Give the async dialog any time it might need to surface.
  await page.waitForTimeout(500);

  // Log any crudGDR diagnostics that were emitted.
  const diagLogs = consoleLogs.filter(l => l.includes('crudGDR diag'));
  console.log('Diagnostic logs:\n' + (diagLogs.join('\n') || '(none)'));

  // ── 9. Assert ─────────────────────────────────────────────────────────────
  // Detect Bootstrap modal (not a native dialog) — check if #dh-dialog-modal is visible.
  const modalVisible = await page.evaluate(
    () => document.querySelector('#dh-dialog-modal')?.classList.contains('show') ?? false
  );
  expect(
    modalVisible,
    'No cascade-key-change Bootstrap modal should appear when naming a brand-new picklist'
  ).toBe(false);

  // PB should now appear in the Enum grid.
  await waitForCloneCellText(page, 'PB');
});
