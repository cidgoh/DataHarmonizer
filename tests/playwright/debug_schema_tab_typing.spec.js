/* Diagnostic: first-character-swallowed regression in the Schema tab.
 *
 * Checks whether every character typed into the Schema ID cell of a fresh row
 * is actually recorded.  The bug: clicking a new schema row triggers
 * afterSelection → (potentially) refreshMenusForTab, which disrupts HOT's
 * keyboard-listener state so the first keypress opens the editor but is
 * not entered as text.
 *
 * Run headed so you can watch the cell:
 *   npx playwright test tests/playwright/debug_schema_tab_typing.spec.js --headed
 */

import { test, expect } from '@playwright/test';
import { hotCellLocator } from './playwright_utils.js';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Read the visible text of the Schema-ID (frozen col-0) cell of row `ri`. */
async function schemaIdCellText(page, ri = 0) {
  return page.evaluate((ri) => {
    function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
    const scope = document.querySelector('.tab-pane.show');
    const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[ri];
    return ht(row?.querySelector('td'));
  }, ri);
}

/** Read HOT's *source* data for row `ri`, col `ci` on the active tab. */
async function hotSourceCell(page, ri = 0, ci = 0) {
  return page.evaluate(([ri, ci]) => {
    // HOT exposes instances via Handsontable.instances (CE ≥ 8) or via the
    // rootElement's __hotInstance property set by the CE wrapper.
    const scope = document.querySelector('.tab-pane.show');
    const wrappers = scope ? scope.querySelectorAll('.handsontable') : [];
    for (const el of wrappers) {
      const hot = el.__hotInstance ?? el.hotInstance;
      if (hot && !hot.isDestroyed) {
        const sd = hot.getSourceData();
        return sd?.[ri]?.[ci] ?? null;
      }
    }
    return '__no_hot_instance__';
  }, [ri, ci]);
}

/** Wait for Schema tab + HOT to be fully loaded. */
async function waitForSchemaTab(page) {
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
            .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );
  await expect(page.locator('#tab-bar-Schema .nav-link')).toHaveClass(/active/);
}

// ── tests ─────────────────────────────────────────────────────────────────────

test.describe('Schema tab: all typed characters reach the cell', () => {

  test('Case A – single click then type "Test" (raw user workflow)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaTab(page);

    const cell = hotCellLocator(page, 0, 0);
    await cell.click();
    await page.keyboard.type('Test');
    await page.keyboard.press('Tab');

    // Wait up to 3 s for any non-empty value to appear.
    await page.waitForFunction(
      () => {
        function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
        const scope = document.querySelector('.tab-pane.show');
        const row = scope?.querySelectorAll('.ht_clone_left.handsontable tbody tr')[0];
        return ht(row?.querySelector('td')).length > 0;
      },
      null, { timeout: 3_000 }
    ).catch(() => {/* cell may still be empty – continue to assertion */});

    const domVal    = await schemaIdCellText(page, 0);
    const sourceVal = await hotSourceCell(page, 0, 0);
    console.log(`Case A  DOM="${domVal}"  HOT source="${sourceVal}"`);

    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case B – double-click then type "Test" (enters edit mode explicitly)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaTab(page);

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

    const domVal    = await schemaIdCellText(page, 0);
    const sourceVal = await hotSourceCell(page, 0, 0);
    console.log(`Case B  DOM="${domVal}"  HOT source="${sourceVal}"`);

    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case C – single click, press Enter to open editor, then type "Test"', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaTab(page);

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

    const domVal    = await schemaIdCellText(page, 0);
    const sourceVal = await hotSourceCell(page, 0, 0);
    console.log(`Case C  DOM="${domVal}"  HOT source="${sourceVal}"`);

    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

  test('Case D – single click, small delay, then type "Test" (lets setTimeout(0) flush first)', async ({ page }) => {
    await page.goto('/schema_editor.html');
    await waitForSchemaTab(page);

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

    const domVal    = await schemaIdCellText(page, 0);
    const sourceVal = await hotSourceCell(page, 0, 0);
    console.log(`Case D  DOM="${domVal}"  HOT source="${sourceVal}"`);

    expect(domVal, 'DOM cell should contain "Test" (all 4 chars)').toBe('Test');
  });

});
