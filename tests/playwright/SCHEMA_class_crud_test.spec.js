/* Verifies the Class tab split layout and CRUD in the Schema Editor.
 *
 * Layout tests (describe 1 – "Class tab split layout"):
 *   Step-by-step checks of the split-view lifecycle so a failure message
 *   pinpoints exactly which part of the layout chain is broken.
 *     1. lower panel is created on schema-editor load
 *     2. clicking Class tab shows split and lower panel
 *     3. switching away from Class hides the lower panel
 *     4. switching back to Class re-shows the lower panel
 *
 * Class CRUD tests (describe 2 – "Class CRUD"):
 *   Create  – add a new Class row; verify name, title, and description are stored.
 *   Update  – edit title and description of an existing Class row; verify changes.
 *   Delete  – remove a Class row via the HOT right-click context menu; verify
 *             the row is gone.
 *
 * UniqueKey CRUD tests (describe 3 – "UniqueKey CRUD"):
 *   Create  – with a parent Class selected, add a UniqueKey via the lower-panel
 *             Add button; verify name and that schema_id/class_id FKs are
 *             auto-populated by addRows().
 *   Update  – edit name and description of an existing UniqueKey row; verify changes.
 *   Delete  – remove a UniqueKey row via the HOT right-click context menu; verify
 *             the row is gone.
 *   Cascade – add 3 UniqueKeys to a Class, delete 1 (verify gone), then delete the
 *             Class (via cascade-confirm dialog); verify the remaining 2 UniqueKeys
 *             are also gone (cascade-deleted).
 *
 * Notes:
 *   • UniqueKey is embedded in the Class tab's lower panel (class-uk-lower-panel)
 *     and is NOT a standalone Bootstrap tab pane.  Navigating to #tab-bar-UniqueKey
 *     would hide the lower panel, so all UniqueKey interaction happens while the
 *     Class tab is active.
 *   • Class.name must be CamelCase (^([A-Z]+[a-z0-9]*)+$).
 *   • UniqueKey.name must be snake_case (^[a-z]+[a-z0-9_]*$).
 *
 * Run:
 *   npx playwright test tests/playwright/SCHEMA_class_crud_test.spec.js
 *   HEADED=1 npx playwright test tests/playwright/SCHEMA_class_crud_test.spec.js
 */

import { test, expect } from '@playwright/test';
import { hotCellLocator, dhColIndex } from './playwright_utils.js';

// ── Shared setup helpers ─────────────────────────────────────────────────────

async function setupSchemaEditor(page) {
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForFunction(
    () => {
      const spans = document.querySelectorAll('.htCore th span');
      return Array.from(spans).some(s => s.textContent.trim() === 'Schema ID');
    },
    null,
    { timeout: 15_000 }
  );
  // "Display: All records" enables every tab.
  await page.evaluate(() => {
    const radio = document.getElementById('display-all-records-radio');
    if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.waitForFunction(
    () => !document.querySelector('#tab-bar-Class')?.classList.contains('disabled'),
    null,
    { timeout: 5_000 }
  );
}

async function goToClassTab(page) {
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  // Allow showSplit()'s internal setTimeout(100) + render to complete
  await page.waitForTimeout(300);
}

/**
 * Cell locator for the UniqueKey lower-panel HOT.
 * Mirrors hotCellLocator but scoped to #class-uk-lower-panel instead of
 * .tab-pane.show.
 */
function ukCellLocator(page, rowIndex, colIdx) {
  if (colIdx === 0) {
    return page
      .locator('#class-uk-lower-panel .ht_clone_left.handsontable tbody tr')
      .nth(rowIndex)
      .locator('td:nth-of-type(1)');
  }
  return page
    .locator('#class-uk-lower-panel .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

// ── Diagnostic helper (layout tests only) ───────────────────────────────────

async function getDiagnostics(page) {
  return page.evaluate(() => {
    const grid    = document.getElementById('data-harmonizer-grid');
    const lp      = document.getElementById('class-uk-lower-panel');
    const ukLabel = document.querySelector(
      '.dh-lower-panel-label[data-label-template="UniqueKey"]'
    );

    const activePanes = grid ? [...grid.querySelectorAll(':scope > .tab-pane.active')] : [];
    const activePane  = activePanes[0];

    const lpCss   = lp        ? window.getComputedStyle(lp)        : null;
    const paneCss = activePane ? window.getComputedStyle(activePane) : null;

    return {
      gridExists:          !!grid,
      gridClasses:         grid?.className ?? '(none)',
      gridHasClassSplit:   grid?.classList.contains('dh-split-active') ?? false,
      gridClientH:         grid?.clientHeight ?? 0,

      lowerPanelExists:    !!lp,
      lowerPanelClasses:   lp?.className ?? '(none)',
      lowerPanelVisible:   lp?.classList.contains('visible') ?? false,
      lowerPanelDisplay:   lpCss?.display ?? '(none)',
      lowerPanelPosition:  lpCss?.position ?? '(none)',
      lowerPanelTop:       lpCss?.top ?? '(none)',
      ukLabelExists:       !!ukLabel,

      activePaneCount:     activePanes.length,
      activePaneId:        activePane?.id ?? '(none)',
      activePaneHeight:    activePane?.clientHeight ?? 0,
      activePaneStyleH:    activePane?.style?.height ?? '(empty)',
      activePaneComputedH: paneCss?.height ?? '(none)',

      ukTabBarDisplay:
        document.getElementById('tab-bar-UniqueKey')?.style?.display ?? '(none)',

      gridChildPaneIds: grid
        ? [...grid.querySelectorAll(':scope > .tab-pane')].map(p => p.id)
        : [],
    };
  });
}

// ── Shared helper: seed a Schema row so FK-dependent DHs can add rows ────────

/**
 * Create exactly one Schema row via hot.alter(), set its name, then click it
 * to establish HOT selection.  Call this while the Schema tab is still active
 * (before goToClassTab) so the click registers on the visible grid.
 *
 * addRows() on FK-dependent DHs (Class, UniqueKey, …) calls
 * crudGetForeignKeyValues → crudGetSelectedTableSlotValue → hot.getSelected().
 * If the Schema HOT has no selection the FK value is null and addRows() shows
 * the empty-parent-key modal without inserting any row.  Seeding + selecting a
 * Schema row once per test avoids that failure.
 */
async function seedSchemaRow(page) {
  await page.evaluate(() => {
    const dh  = window._appContext.dhs.Schema;
    const hot = dh.hot;
    // insert_row_above at 0 is safe even for a completely empty grid (countRows=0)
    hot.alter('insert_row_above', 0, 1);
  });
  await page.waitForTimeout(200);

  await page.evaluate(() => {
    const dh  = window._appContext.dhs.Schema;
    const hot = dh.hot;
    const physCol = dh.slot_name_to_column['name'];
    if (physCol !== undefined) {
      const visCol = hot.toVisualColumn(physCol);
      if (visCol >= 0) hot.setDataAtCell(0, visCol, 'CRUDTestSchema');
    }
  });
  // Allow SchemaEditor's afterChange cascade (DH reload, tab-bar update) to settle
  await page.waitForTimeout(500);

  // Click Schema row 0 to establish HOT selection (persists after tab-switch)
  await hotCellLocator(page, 0, 0).click();
  await page.waitForTimeout(200);
}

// ── 1. Layout tests ──────────────────────────────────────────────────────────

test.describe('Class tab split layout (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
  });

  test('1. lower panel is created on schema-editor load', async ({ page }) => {
    const lp = page.locator('#class-uk-lower-panel');
    await expect(lp).toBeAttached({ timeout: 5_000 });

    // UniqueKey's nav entry is hidden inside the lower panel; the top-bar tab
    // must have display:none so the user cannot navigate to it directly.
    const ukTabBarDisplay = await page.evaluate(
      () => document.getElementById('tab-bar-UniqueKey')?.style.display
    );
    expect(ukTabBarDisplay).toBe('none');
  });

  test('2. clicking Class tab shows split and lower panel', async ({ page }) => {
    await goToClassTab(page);

    const diag = await getDiagnostics(page);

    // B. #class-uk-lower-panel must exist
    expect(diag.lowerPanelExists, `lower panel missing; grid children: ${diag.gridChildPaneIds}`)
      .toBe(true);

    // C. grid must carry dh-split-active
    expect(diag.gridHasClassSplit, `grid classes: "${diag.gridClasses}"`)
      .toBe(true);

    // D. lower panel must have class 'visible'
    expect(diag.lowerPanelVisible, `lower-panel classes: "${diag.lowerPanelClasses}"`)
      .toBe(true);

    // E. lower panel must be absolutely positioned
    expect(diag.lowerPanelPosition, 'lower panel CSS position')
      .toBe('absolute');

    // F. active pane must be ~52 % of the grid height (splitRatio: '52%')
    const { gridClientH, activePaneHeight, activePaneStyleH, activePaneComputedH } = diag;
    expect(gridClientH, 'grid has no height').toBeGreaterThan(100);
    expect(
      activePaneHeight,
      `pane clientHeight ${activePaneHeight}px vs grid ${gridClientH}px ` +
      `(style.height="${activePaneStyleH}", computed="${activePaneComputedH}")`
    ).toBeGreaterThan(gridClientH * 0.35);
    expect(
      activePaneHeight,
      `pane still at ~100% (clientH=${activePaneHeight}, gridH=${gridClientH}) ` +
      `style.height="${activePaneStyleH}" computed="${activePaneComputedH}"`
    ).toBeLessThan(gridClientH * 0.70);

    // G. lower panel top must be ~52 % of grid height
    const lpTopPx = parseFloat(diag.lowerPanelTop);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeGreaterThan(gridClientH * 0.35);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeLessThan(gridClientH * 0.70);

    // H. UniqueKey tab label must be visible in lower panel
    await expect(
      page.locator('.dh-lower-panel-label[data-label-template="UniqueKey"]')
    ).toBeVisible();
  });

  test('3. switching away from Class hides the lower panel', async ({ page }) => {
    await goToClassTab(page);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    await page.waitForFunction(
      () => !document.getElementById('class-uk-lower-panel')?.classList.contains('visible'),
      null,
      { timeout: 3_000 }
    );
  });

  test('4. switching back to Class re-shows the lower panel', async ({ page }) => {
    await goToClassTab(page);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );

    await page.click('#tab-bar-Class > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForTimeout(300);

    await expect(page.locator('#class-uk-lower-panel')).toHaveClass(/visible/);
  });
});

// ── 2. Class CRUD ─────────────────────────────────────────────────────────────

test.describe('Class CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await seedSchemaRow(page);  // creates Schema row & selects it
    await goToClassTab(page);
  });

  /**
   * Add a Class row via addRows(), set name/title/description, return row index.
   * addRows() auto-populates the schema_id FK using the Schema DH's selection
   * established by seedSchemaRow() in beforeEach.
   * Class name must be CamelCase (^([A-Z]+[a-z0-9]*)+$).
   */
  async function addClassRow(page, name, title, description) {
    const beforeCount = await page.evaluate(
      () => window._appContext?.dhs?.Class?.hot?.countRows() ?? 0
    );

    await page.evaluate(
      () => window._appContext.dhs.Class.addRows('insert_row_below', 1)
    );
    await page.waitForTimeout(300);

    const rowIdx = await page.evaluate(
      () => (window._appContext.dhs.Class.hot.countRows() - 1)
    );
    expect(rowIdx, 'addRows() should increase row count').toBeGreaterThanOrEqual(beforeCount);

    await page.evaluate(([row, name, title, description]) => {
      const dh = window._appContext.dhs.Class;
      for (const [slot, value] of [['name', name], ['title', title], ['description', description]]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [rowIdx, name, title, description]);
    await page.waitForTimeout(200);

    return rowIdx;
  }

  test('Create: name, title, and description', async ({ page }) => {
    const rowIdx = await addClassRow(
      page, 'TestClassCreate', 'Create Test Title', 'Created by test'
    );

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.Class;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { name: get('name'), title: get('title'), description: get('description') };
    }, [rowIdx]);

    expect(data.name,        'name should be saved'       ).toBe('TestClassCreate');
    expect(data.title,       'title should be saved'      ).toBe('Create Test Title');
    expect(data.description, 'description should be saved').toBe('Created by test');
  });

  test('Update: title and description', async ({ page }) => {
    const rowIdx = await addClassRow(
      page, 'TestClassUpdate', 'Original Title', 'Original description'
    );

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Class;
      for (const [slot, value] of [
        ['title',       'Updated Title'],
        ['description', 'Updated description'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Class;
      return {
        title:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['title']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.title,       'title should be updated'      ).toBe('Updated Title');
    expect(data.description, 'description should be updated').toBe('Updated description');
  });

  test('Delete: remove row via right-click context menu', async ({ page }) => {
    const rowIdx = await addClassRow(
      page, 'TestClassDelete', 'Delete Me', 'Will be deleted'
    );

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Class.hot.countRows()
    );

    // Right-click on the title column (non-frozen, in ht_master).
    // Multiple .htContextMenu elements exist in the DOM (one per HOT instance);
    // filter by text so we target the populated, visible one.
    const titleColIdx = await dhColIndex(page, 'Class', 'title');
    await hotCellLocator(page, rowIdx, titleColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Class.hot.countRows()
    );
    expect(countAfter, 'row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Class;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted class name should not appear').not.toContain('TestClassDelete');
  });
});

// ── 3. UniqueKey CRUD ─────────────────────────────────────────────────────────

test.describe('UniqueKey CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await seedSchemaRow(page);  // creates Schema row & selects it
    await goToClassTab(page);
  });

  /**
   * Add a Class row named `className`, then click it to select it in the Class
   * DH (which loads the UniqueKey panel for that class).  Returns the Class row index.
   * Schema row is already seeded + selected by beforeEach, so addRows() can
   * resolve the schema_id FK.
   */
  async function createAndSelectClass(page, className) {
    await page.evaluate(
      () => window._appContext.dhs.Class.addRows('insert_row_below', 1)
    );
    await page.waitForTimeout(300);

    const rowIdx = await page.evaluate(
      () => (window._appContext.dhs.Class.hot.countRows() - 1)
    );

    await page.evaluate(([row, name]) => {
      const dh      = window._appContext.dhs.Class;
      const physCol = dh.slot_name_to_column['name'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, name);
      }
    }, [rowIdx, className]);
    await page.waitForTimeout(200);

    // Click the Class row so the UniqueKey panel loads its unique keys
    await hotCellLocator(page, rowIdx, 0).click();
    await page.waitForTimeout(300);

    return rowIdx;
  }

  /**
   * Click the lower-panel Add button to add one UniqueKey row.
   * addRows() auto-populates schema_id and class_id FKs from the selected Class.
   * Returns the new UniqueKey row index (before-count).
   */
  async function addUkRow(page) {
    const ukCountBefore = await page.evaluate(
      () => window._appContext?.dhs?.UniqueKey?.hot?.countRows() ?? 0
    );
    await page.locator(
      '#class-uk-lower-panel .dh-lower-tab-strip .btn.btn-primary.btn-sm'
    ).click();
    await page.waitForTimeout(300);
    return ukCountBefore;  // new row was appended at this index
  }

  test('Create: name and description with auto-populated FKs', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassUkCreate');
    const ukRowIdx = await addUkRow(page);

    await page.evaluate(([row]) => {
      const dh      = window._appContext.dhs.UniqueKey;
      const physCol = dh.slot_name_to_column['name'];
      if (physCol === undefined) return;
      const visCol = dh.hot.toVisualColumn(physCol);
      if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'test_uk_create');
    }, [ukRowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.UniqueKey;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return {
        name:      get('name'),
        schema_id: get('schema_id'),
        class_id:  get('class_id'),
      };
    }, [ukRowIdx]);

    expect(data.name,      'UniqueKey name should be saved'        ).toBe('test_uk_create');
    expect(data.schema_id, 'schema_id FK should be auto-populated' ).toBeTruthy();
    expect(data.class_id,  'class_id FK should be auto-populated'  ).toBeTruthy();
  });

  test('Update: name and description', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassUkUpdate');
    const ukRowIdx = await addUkRow(page);

    // Set initial name
    await page.evaluate(([row]) => {
      const dh      = window._appContext.dhs.UniqueKey;
      const physCol = dh.slot_name_to_column['name'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'test_uk_original');
      }
    }, [ukRowIdx]);
    await page.waitForTimeout(200);

    // Update name and description
    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.UniqueKey;
      for (const [slot, value] of [
        ['name',        'test_uk_updated'],
        ['description', 'Updated UniqueKey description'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [ukRowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.UniqueKey;
      return {
        name:        dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['name']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [ukRowIdx]);

    expect(data.name,        'name should be updated'       ).toBe('test_uk_updated');
    expect(data.description, 'description should be updated').toBe('Updated UniqueKey description');
  });

  test('Delete: remove UniqueKey row via right-click context menu', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassUkDelete');
    const ukRowIdx = await addUkRow(page);

    // Set name so we can verify it disappears
    await page.evaluate(([row]) => {
      const dh      = window._appContext.dhs.UniqueKey;
      const physCol = dh.slot_name_to_column['name'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'test_uk_delete');
      }
    }, [ukRowIdx]);
    await page.waitForTimeout(200);

    const ukCountBefore = await page.evaluate(
      () => window._appContext.dhs.UniqueKey.hot.countRows()
    );

    // Right-click on the description column (non-frozen, non-key, in ht_master).
    // Multiple .htContextMenu elements exist (one per HOT instance); filter by
    // text to target the populated, visible one.
    const descColIdx = await dhColIndex(page, 'UniqueKey', 'description');
    await ukCellLocator(page, ukRowIdx, descColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const ukCountAfter = await page.evaluate(
      () => window._appContext.dhs.UniqueKey.hot.countRows()
    );
    expect(ukCountAfter, 'UniqueKey row count should decrease by 1').toBe(ukCountBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.UniqueKey;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted UniqueKey name should not appear').not.toContain('test_uk_delete');
  });

  /**
   * Collect all UniqueKey name values currently in the UniqueKey DH.
   */
  async function getAllUkNames(page) {
    return page.evaluate(() => {
      const dh  = window._appContext.dhs.UniqueKey;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
  }

  test('Cascade delete: single UniqueKey then Class removes remaining UniqueKeys', async ({ page }) => {
    // ── 1. Create parent Class ──────────────────────────────────────────────
    const classRowIdx = await createAndSelectClass(page, 'TestClassCascade');

    // ── 2. Add three UniqueKeys (uk1Idx=0, uk2Idx=1, uk3Idx=2) ─────────────
    const uk1Idx = await addUkRow(page);
    const uk2Idx = await addUkRow(page);
    const uk3Idx = await addUkRow(page);

    for (const [row, name] of [[uk1Idx, 'uk_alpha'], [uk2Idx, 'uk_beta'], [uk3Idx, 'uk_gamma']]) {
      await page.evaluate(([r, n]) => {
        const dh      = window._appContext.dhs.UniqueKey;
        const physCol = dh.slot_name_to_column['name'];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(r, visCol, n);
        }
      }, [row, name]);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(200);

    // ── 3. Verify all three UniqueKeys are present ──────────────────────────
    const namesAfterCreate = await getAllUkNames(page);
    expect(namesAfterCreate, 'uk_alpha should exist after create').toContain('uk_alpha');
    expect(namesAfterCreate, 'uk_beta should exist after create' ).toContain('uk_beta');
    expect(namesAfterCreate, 'uk_gamma should exist after create').toContain('uk_gamma');

    // ── 4. Delete uk_beta (index 1) via right-click — no confirm dialog ─────
    const descColIdx = await dhColIndex(page, 'UniqueKey', 'description');
    await ukCellLocator(page, uk2Idx, descColIdx).click({ button: 'right' });
    const removeUkItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeUkItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeUkItem.first().click();
    await page.waitForTimeout(300);

    // ── 5. Verify uk_beta gone; uk_alpha and uk_gamma remain ────────────────
    const namesAfterUkDelete = await getAllUkNames(page);
    expect(namesAfterUkDelete, 'uk_alpha should remain after uk_beta deletion').toContain('uk_alpha');
    expect(namesAfterUkDelete, 'uk_beta should be gone after deletion'        ).not.toContain('uk_beta');
    expect(namesAfterUkDelete, 'uk_gamma should remain after uk_beta deletion').toContain('uk_gamma');

    // ── 6. Delete Class row via right-click (triggers cascade-confirm dialog) ─
    const classTitleColIdx = await dhColIndex(page, 'Class', 'title');
    await hotCellLocator(page, classRowIdx, classTitleColIdx).click({ button: 'right' });
    const removeClassItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeClassItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeClassItem.first().click();

    // ── 7. Confirm the cascade-delete dialog (.btn-danger = "Delete") ────────
    // Multiple #dh-dialog-modal elements exist (one per DH instance); use
    // .first() to avoid strict-mode violations and target the visible one.
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 5_000 });
    await page.locator('#dh-dialog-modal .btn-danger').first().click();
    await page.waitForTimeout(500);

    // ── 8. Verify Class row is gone from the Class DH ───────────────────────
    const classNames = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Class;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(classNames, 'deleted Class should not appear in Class DH').not.toContain('TestClassCascade');

    // ── 9. Verify remaining UniqueKeys (uk_alpha and uk_gamma) were cascade-deleted ─
    const namesAfterClassDelete = await getAllUkNames(page);
    expect(namesAfterClassDelete, 'uk_alpha should be cascade-deleted with Class').not.toContain('uk_alpha');
    expect(namesAfterClassDelete, 'uk_gamma should be cascade-deleted with Class').not.toContain('uk_gamma');
  });
});
