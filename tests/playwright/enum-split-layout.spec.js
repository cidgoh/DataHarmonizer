/* Verifies the Enum/PermissibleValue split layout in the Schema Editor.
 *
 * Checks every intermediate step so a failure message pinpoints exactly
 * which part of the layout chain is broken.
 *
 * Run:
 *   npx playwright test tests/playwright/enum-split-layout.spec.js
 *   HEADED=1 npx playwright test tests/playwright/enum-split-layout.spec.js
 */

import { test, expect } from '@playwright/test';

test.describe('Enum tab split layout (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/schema_editor.html');
    await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
    // Wait until the Schema HOT is visible — columns include "Schema ID"
    await page.waitForFunction(
      () => {
        const spans = document.querySelectorAll('.htCore th span');
        return Array.from(spans).some(s => s.textContent.trim() === 'Schema ID');
      },
      null,
      { timeout: 15_000 }
    );

    // "Display: All records" enables every tab.  The radio is inside a
    // collapsed toolbar, so trigger it via JS rather than a visible click.
    await page.evaluate(() => {
      const radio = document.getElementById('display-all-records-radio');
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
    });
    // Allow tab-status update to propagate
    await page.waitForFunction(
      () => !document.querySelector('#tab-bar-Enum')?.classList.contains('disabled'),
      null,
      { timeout: 5_000 }
    );
  });

  // ── Diagnostic helper — printed only on failure ───────────────────────────
  async function getDiagnostics(page) {
    return page.evaluate(() => {
      const grid = document.getElementById('data-harmonizer-grid');
      const lp   = document.getElementById('enum-pv-lower-panel');
      const pvHeader = document.getElementById('enum-pv-header');

      // Find the active tab-pane inside the grid
      const activePanes = grid ? [...grid.querySelectorAll(':scope > .tab-pane.active')] : [];
      const activePane  = activePanes[0];

      const lpCss = lp ? window.getComputedStyle(lp) : null;
      const paneCss = activePane ? window.getComputedStyle(activePane) : null;

      return {
        gridExists:        !!grid,
        gridClasses:       grid?.className ?? '(none)',
        gridHasEnumSplit:  grid?.classList.contains('enum-split-active') ?? false,
        gridClientH:       grid?.clientHeight ?? 0,

        lowerPanelExists:  !!lp,
        lowerPanelClasses: lp?.className ?? '(none)',
        lowerPanelVisible: lp?.classList.contains('visible') ?? false,
        lowerPanelDisplay: lpCss?.display ?? '(none)',
        lowerPanelPosition:lpCss?.position ?? '(none)',
        lowerPanelTop:     lpCss?.top ?? '(none)',
        pvHeaderExists:    !!pvHeader,

        activePaneCount:   activePanes.length,
        activePaneId:      activePane?.id ?? '(none)',
        activePaneHeight:  activePane?.clientHeight ?? 0,
        activePaneStyleH:  activePane?.style?.height ?? '(empty)',
        activePaneComputedH: paneCss?.height ?? '(none)',

        // Check if the PV tab-bar item is hidden
        pvTabBarDisplay:
          document.getElementById('tab-bar-PermissibleValue')?.style?.display ?? '(none)',

        // Log all tab-pane IDs inside grid so we know what's there
        gridChildPaneIds:  grid
          ? [...grid.querySelectorAll(':scope > .tab-pane')].map(p => p.id)
          : [],
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  test('1. lower panel is created on schema-editor load', async ({ page }) => {
    // After schema editor loads, _initEnumSplitLayout() should have run via
    // refreshMenus(), inserting #enum-pv-lower-panel into the DOM.
    const lp = page.locator('#enum-pv-lower-panel');
    await expect(lp).toBeAttached({ timeout: 5_000 });

    // PermissibleValue tab-bar item should be hidden
    const pvTabBarDisplay = await page.evaluate(
      () => document.getElementById('tab-bar-PermissibleValue')?.style.display
    );
    expect(pvTabBarDisplay).toBe('none');
  });

  // ─────────────────────────────────────────────────────────────────────────
  test('2. clicking Enum tab shows split and lower panel', async ({ page }) => {
    // ── A. Click Enum tab ────────────────────────────────────────────────
    await page.click('#tab-bar-Enum > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    // Allow the 50 ms setTimeout inside showSplit() to fire
    await page.waitForTimeout(200);

    const diag = await getDiagnostics(page);

    // ── B. #enum-pv-lower-panel must exist ───────────────────────────────
    expect(diag.lowerPanelExists, `lower panel missing; grid children: ${diag.gridChildPaneIds}`)
      .toBe(true);

    // ── C. grid must carry enum-split-active ─────────────────────────────
    expect(diag.gridHasEnumSplit, `grid classes: "${diag.gridClasses}"`)
      .toBe(true);

    // ── D. lower panel must have class 'visible' ─────────────────────────
    expect(diag.lowerPanelVisible, `lower-panel classes: "${diag.lowerPanelClasses}"`)
      .toBe(true);

    // ── E. lower panel must be absolutely positioned ─────────────────────
    expect(diag.lowerPanelPosition, 'lower panel CSS position')
      .toBe('absolute');

    // ── F. the active pane must be ~50 % of the grid height ──────────────
    const { gridClientH, activePaneHeight, activePaneStyleH, activePaneComputedH } = diag;
    expect(gridClientH, 'grid has no height').toBeGreaterThan(100);

    // Active pane should be between 35 % and 65 % of the grid height
    expect(
      activePaneHeight,
      `pane clientHeight ${activePaneHeight}px vs grid ${gridClientH}px ` +
      `(style.height="${activePaneStyleH}", computed="${activePaneComputedH}")`
    ).toBeGreaterThan(gridClientH * 0.35);

    expect(
      activePaneHeight,
      `pane still at ~100% (clientH=${activePaneHeight}, gridH=${gridClientH}) ` +
      `style.height="${activePaneStyleH}" computed="${activePaneComputedH}"`
    ).toBeLessThan(gridClientH * 0.65);

    // ── G. lower panel top should be ~50 % of grid height ────────────────
    const lpTopPx = parseFloat(diag.lowerPanelTop);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`)
      .toBeGreaterThan(gridClientH * 0.35);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`)
      .toBeLessThan(gridClientH * 0.65);

    // ── H. Permissible Values header visible ─────────────────────────────
    await expect(page.locator('#enum-pv-header')).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────
  test('3. switching away from Enum hides the lower panel', async ({ page }) => {
    await page.click('#tab-bar-Enum > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    await page.waitForTimeout(200);

    // Switch to Schema tab
    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    // shown.bs.tab fires after Bootstrap's transition; wait for hideSplit() to run.
    await page.waitForFunction(
      () => !document.getElementById('enum-pv-lower-panel')?.classList.contains('visible'),
      null,
      { timeout: 3_000 }
    );
  });

  // ─────────────────────────────────────────────────────────────────────────
  test('4. switching back to Enum re-shows the lower panel', async ({ page }) => {
    // Go Enum → Schema → Enum
    await page.click('#tab-bar-Enum > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForTimeout(100);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );

    await page.click('#tab-bar-Enum > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForTimeout(200);

    await expect(page.locator('#enum-pv-lower-panel')).toHaveClass(/visible/);
  });

});
