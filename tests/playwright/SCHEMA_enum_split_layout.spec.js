/* Verifies the Enum/PermissibleValue split layout and CRUD in the Schema Editor.
 *
 * Layout tests (describe 1 – "Enum tab split layout"):
 *   Step-by-step checks of the split-view lifecycle so a failure message
 *   pinpoints exactly which part of the layout chain is broken.
 *     1. lower panel is created on schema-editor load
 *     2. clicking Enum tab shows split and lower panel
 *     3. switching away from Enum hides the lower panel
 *     4. switching back to Enum re-shows the lower panel
 *
 * Enum CRUD tests (describe 2 – "Enum CRUD"):
 *   Create  – add a new Enum row; verify name, title, and description are stored.
 *   Update  – edit title and description of an existing Enum row; verify changes.
 *   Delete  – remove an Enum row via the HOT right-click context menu; verify
 *             the row is gone.
 *
 * PermissibleValue CRUD tests (describe 3 – "PermissibleValue CRUD"):
 *   Create  – with a parent Enum selected, add a PV via the lower-panel Add
 *             button; verify text/code and that schema_id/enum_id FKs are
 *             auto-populated by addRows().
 *   Update  – edit title, description, is_a, meaning, and exact_mappings.
 *   Delete  – remove a PV row via the HOT right-click context menu; verify
 *             the row is gone.
 *   Cascade – add 3 PVs to an Enum, delete 1 PV (verify gone), then delete the
 *             Enum (via cascade-confirm dialog); verify the remaining 2 PVs are
 *             also gone (cascade-deleted).
 *
 * Run:
 *   npx playwright test tests/playwright/SCHEMA_enum_split_layout.spec.js
 *   HEADED=1 npx playwright test tests/playwright/SCHEMA_enum_split_layout.spec.js
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
    () => !document.querySelector('#tab-bar-Enum')?.classList.contains('disabled'),
    null,
    { timeout: 5_000 }
  );
}

async function goToEnumTab(page) {
  await page.click('#tab-bar-Enum > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  // Allow showSplit()'s internal setTimeout(100) + render to complete
  await page.waitForTimeout(300);
}

/**
 * Cell locator for the PermissibleValue lower-panel HOT.
 * Mirrors hotCellLocator but scoped to #enum-pv-lower-panel instead of
 * .tab-pane.show.
 */
function pvCellLocator(page, rowIndex, colIdx) {
  if (colIdx === 0) {
    return page
      .locator('#enum-pv-lower-panel .ht_clone_left.handsontable tbody tr')
      .nth(rowIndex)
      .locator('td:nth-of-type(1)');
  }
  return page
    .locator('#enum-pv-lower-panel .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

// ── Diagnostic helper (layout tests only) ───────────────────────────────────

async function getDiagnostics(page) {
  return page.evaluate(() => {
    const grid    = document.getElementById('data-harmonizer-grid');
    const lp      = document.getElementById('enum-pv-lower-panel');
    const pvLabel = document.querySelector(
      '.dh-lower-panel-label[data-label-template="PermissibleValue"]'
    );

    const activePanes = grid ? [...grid.querySelectorAll(':scope > .tab-pane.active')] : [];
    const activePane  = activePanes[0];

    const lpCss   = lp        ? window.getComputedStyle(lp)        : null;
    const paneCss = activePane ? window.getComputedStyle(activePane) : null;

    return {
      gridExists:        !!grid,
      gridClasses:       grid?.className ?? '(none)',
      gridHasEnumSplit:  grid?.classList.contains('dh-split-active') ?? false,
      gridClientH:       grid?.clientHeight ?? 0,

      lowerPanelExists:  !!lp,
      lowerPanelClasses: lp?.className ?? '(none)',
      lowerPanelVisible: lp?.classList.contains('visible') ?? false,
      lowerPanelDisplay: lpCss?.display ?? '(none)',
      lowerPanelPosition:lpCss?.position ?? '(none)',
      lowerPanelTop:     lpCss?.top ?? '(none)',
      pvLabelExists:     !!pvLabel,

      activePaneCount:    activePanes.length,
      activePaneId:       activePane?.id ?? '(none)',
      activePaneHeight:   activePane?.clientHeight ?? 0,
      activePaneStyleH:   activePane?.style?.height ?? '(empty)',
      activePaneComputedH: paneCss?.height ?? '(none)',

      pvTabBarDisplay:
        document.getElementById('tab-bar-PermissibleValue')?.style?.display ?? '(none)',

      gridChildPaneIds: grid
        ? [...grid.querySelectorAll(':scope > .tab-pane')].map(p => p.id)
        : [],
    };
  });
}

// ── 1. Layout tests ──────────────────────────────────────────────────────────

test.describe('Enum tab split layout (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
  });

  test('1. lower panel is created on schema-editor load', async ({ page }) => {
    const lp = page.locator('#enum-pv-lower-panel');
    await expect(lp).toBeAttached({ timeout: 5_000 });

    const pvTabBarDisplay = await page.evaluate(
      () => document.getElementById('tab-bar-PermissibleValue')?.style.display
    );
    expect(pvTabBarDisplay).toBe('none');
  });

  test('2. clicking Enum tab shows split and lower panel', async ({ page }) => {
    await goToEnumTab(page);

    const diag = await getDiagnostics(page);

    // B. #enum-pv-lower-panel must exist
    expect(diag.lowerPanelExists, `lower panel missing; grid children: ${diag.gridChildPaneIds}`)
      .toBe(true);

    // C. grid must carry dh-split-active
    expect(diag.gridHasEnumSplit, `grid classes: "${diag.gridClasses}"`)
      .toBe(true);

    // D. lower panel must have class 'visible'
    expect(diag.lowerPanelVisible, `lower-panel classes: "${diag.lowerPanelClasses}"`)
      .toBe(true);

    // E. lower panel must be absolutely positioned
    expect(diag.lowerPanelPosition, 'lower panel CSS position')
      .toBe('absolute');

    // F. active pane must be ~50 % of the grid height
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
    ).toBeLessThan(gridClientH * 0.65);

    // G. lower panel top must be ~50 % of grid height
    const lpTopPx = parseFloat(diag.lowerPanelTop);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeGreaterThan(gridClientH * 0.35);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeLessThan(gridClientH * 0.65);

    // H. Permissible Values tab label must be visible in lower panel
    await expect(
      page.locator('.dh-lower-panel-label[data-label-template="PermissibleValue"]')
    ).toBeVisible();
  });

  test('3. switching away from Enum hides the lower panel', async ({ page }) => {
    await goToEnumTab(page);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    await page.waitForFunction(
      () => !document.getElementById('enum-pv-lower-panel')?.classList.contains('visible'),
      null,
      { timeout: 3_000 }
    );
  });

  test('4. switching back to Enum re-shows the lower panel', async ({ page }) => {
    await goToEnumTab(page);

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
    await page.waitForTimeout(300);

    await expect(page.locator('#enum-pv-lower-panel')).toHaveClass(/visible/);
  });
});

// ── Shared helper: seed a Schema row so FK-dependent DHs can add rows ────────

/**
 * Create exactly one Schema row via hot.alter(), set its name, then click it
 * to establish HOT selection.  Call this while the Schema tab is still active
 * (before goToEnumTab) so selectCell() works on the visible grid.
 *
 * addRows() on FK-dependent DHs (Enum, PV, …) calls
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

// ── 2. Enum CRUD ─────────────────────────────────────────────────────────────

test.describe('Enum CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await seedSchemaRow(page);  // creates Schema row & selects it
    await goToEnumTab(page);
  });

  /**
   * Add an Enum row via addRows(), set name/title/description, return row index.
   * addRows() auto-populates the schema_id FK using the Schema DH's selection
   * established by seedSchemaRow() in beforeEach.
   */
  async function addEnumRow(page, name, title, description) {
    const beforeCount = await page.evaluate(
      () => window._appContext?.dhs?.Enum?.hot?.countRows() ?? 0
    );

    await page.evaluate(
      () => window._appContext.dhs.Enum.addRows('insert_row_below', 1)
    );
    await page.waitForTimeout(300);

    const rowIdx = await page.evaluate(
      () => (window._appContext.dhs.Enum.hot.countRows() - 1)
    );
    // Guard: ensure a row was actually added
    expect(rowIdx, 'addRows() should increase row count').toBeGreaterThanOrEqual(beforeCount);

    await page.evaluate(([row, name, title, description]) => {
      const dh = window._appContext.dhs.Enum;
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
    const rowIdx = await addEnumRow(
      page, 'TestEnum_Create', 'Create Test Title', 'Created by test'
    );

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Enum;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { name: get('name'), title: get('title'), description: get('description') };
    }, [rowIdx]);

    expect(data.name,        'name should be saved'       ).toBe('TestEnum_Create');
    expect(data.title,       'title should be saved'      ).toBe('Create Test Title');
    expect(data.description, 'description should be saved').toBe('Created by test');
  });

  test('Update: title and description', async ({ page }) => {
    const rowIdx = await addEnumRow(
      page, 'TestEnum_Update', 'Original Title', 'Original description'
    );

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Enum;
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
      const dh = window._appContext.dhs.Enum;
      return {
        title:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['title']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.title,       'title should be updated'      ).toBe('Updated Title');
    expect(data.description, 'description should be updated').toBe('Updated description');
  });

  test('Delete: remove row via right-click context menu', async ({ page }) => {
    const rowIdx = await addEnumRow(
      page, 'TestEnum_Delete', 'Delete Me', 'Will be deleted'
    );

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Enum.hot.countRows()
    );

    // Right-click on the title column (non-frozen, in ht_master).
    // Multiple .htContextMenu elements exist in the DOM (one per HOT instance);
    // filter by text so we target the populated, visible one.
    const titleColIdx = await dhColIndex(page, 'Enum', 'title');
    await hotCellLocator(page, rowIdx, titleColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Enum.hot.countRows()
    );
    expect(countAfter, 'row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh = window._appContext.dhs.Enum;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted enum name should not appear').not.toContain('TestEnum_Delete');
  });
});

// ── 3. PermissibleValue CRUD ─────────────────────────────────────────────────

test.describe('PermissibleValue CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await seedSchemaRow(page);  // creates Schema row & selects it
    await goToEnumTab(page);
  });

  /**
   * Add an Enum row named `enumName`, then click it to select it in the Enum
   * DH (which loads the PV panel for that enum).  Returns the Enum row index.
   * Schema row is already seeded + selected by beforeEach, so addRows() can
   * resolve the schema_id FK.
   */
  async function createAndSelectEnum(page, enumName) {
    await page.evaluate(
      () => window._appContext.dhs.Enum.addRows('insert_row_below', 1)
    );
    await page.waitForTimeout(300);

    const rowIdx = await page.evaluate(
      () => (window._appContext.dhs.Enum.hot.countRows() - 1)
    );

    await page.evaluate(([row, name]) => {
      const dh = window._appContext.dhs.Enum;
      const physCol = dh.slot_name_to_column['name'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, name);
      }
    }, [rowIdx, enumName]);
    await page.waitForTimeout(200);

    // Click the Enum row so the PV panel loads its permissible values
    await hotCellLocator(page, rowIdx, 0).click();
    await page.waitForTimeout(300);

    return rowIdx;
  }

  /**
   * Click the lower-panel Add button to add one PV row.
   * addRows() auto-populates schema_id and enum_id FKs from the selected Enum.
   * Returns the new PV row index (before-count).
   */
  async function addPvRow(page) {
    const pvCountBefore = await page.evaluate(
      () => window._appContext?.dhs?.PermissibleValue?.hot?.countRows() ?? 0
    );
    await page.locator(
      '#enum-pv-lower-panel .dh-lower-tab-strip .btn.btn-primary.btn-sm'
    ).click();
    await page.waitForTimeout(300);
    return pvCountBefore; // new row was appended at this index
  }

  test('Create: text/code with auto-populated FKs', async ({ page }) => {
    await createAndSelectEnum(page, 'TestEnum_PV_Create');
    const pvRowIdx = await addPvRow(page);

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const physCol = dh.slot_name_to_column['text'];
      if (physCol === undefined) return;
      const visCol = dh.hot.toVisualColumn(physCol);
      if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'TEST_PV_A');
    }, [pvRowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return {
        text:      get('text'),
        schema_id: get('schema_id'),
        enum_id:   get('enum_id'),
      };
    }, [pvRowIdx]);

    expect(data.text,      'PV text/code should be saved'           ).toBe('TEST_PV_A');
    expect(data.schema_id, 'schema_id FK should be auto-populated'  ).toBeTruthy();
    expect(data.enum_id,   'enum_id FK should be auto-populated'    ).toBeTruthy();
  });

  test('Update: title, description, is_a, meaning, and exact_mappings', async ({ page }) => {
    await createAndSelectEnum(page, 'TestEnum_PV_Update');
    const pvRowIdx = await addPvRow(page);

    // Set initial text/code
    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const physCol = dh.slot_name_to_column['text'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'TEST_PV_B');
      }
    }, [pvRowIdx]);
    await page.waitForTimeout(200);

    // Update all target fields
    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const fields = {
        title:          'Updated PV Title',
        description:    'Updated PV description',
        is_a:           'some_parent_pv',
        meaning:        'http://example.org/meaning',
        exact_mappings: 'SNOMED:12345;LOINC:67890',
      };
      for (const [slot, value] of Object.entries(fields)) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [pvRowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return {
        title:          get('title'),
        description:    get('description'),
        is_a:           get('is_a'),
        meaning:        get('meaning'),
        exact_mappings: get('exact_mappings'),
      };
    }, [pvRowIdx]);

    expect(data.title,          'title should be updated'         ).toBe('Updated PV Title');
    expect(data.description,    'description should be updated'   ).toBe('Updated PV description');
    expect(data.is_a,           'is_a should be updated'          ).toBe('some_parent_pv');
    expect(data.meaning,        'meaning should be updated'       ).toBe('http://example.org/meaning');
    expect(data.exact_mappings, 'exact_mappings should be updated').toBe('SNOMED:12345;LOINC:67890');
  });

  test('Delete: remove PV row via right-click context menu', async ({ page }) => {
    await createAndSelectEnum(page, 'TestEnum_PV_Delete');
    const pvRowIdx = await addPvRow(page);

    // Set text so we can verify it disappears
    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.PermissibleValue;
      const physCol = dh.slot_name_to_column['text'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'TEST_PV_DELETE');
      }
    }, [pvRowIdx]);
    await page.waitForTimeout(200);

    const pvCountBefore = await page.evaluate(
      () => window._appContext.dhs.PermissibleValue.hot.countRows()
    );

    // Right-click on the title column (non-frozen, in ht_master).
    // Multiple .htContextMenu elements exist (one per HOT instance); filter by
    // text to target the populated, visible one.
    const titleColIdx = await dhColIndex(page, 'PermissibleValue', 'title');
    await pvCellLocator(page, pvRowIdx, titleColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const pvCountAfter = await page.evaluate(
      () => window._appContext.dhs.PermissibleValue.hot.countRows()
    );
    expect(pvCountAfter, 'PV row count should decrease by 1').toBe(pvCountBefore - 1);

    const texts = await page.evaluate(() => {
      const dh = window._appContext.dhs.PermissibleValue;
      const col = dh.slot_name_to_column['text'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(texts, 'deleted PV text should not appear').not.toContain('TEST_PV_DELETE');
  });

  /**
   * Collect all PV text/code values currently visible in the PV DH.
   */
  async function getAllPvTexts(page) {
    return page.evaluate(() => {
      const dh  = window._appContext.dhs.PermissibleValue;
      const col = dh.slot_name_to_column['text'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
  }

  test('Cascade delete: single PV then Enum removes remaining PVs', async ({ page }) => {
    // ── 1. Create parent Enum ───────────────────────────────────────────────
    const enumRowIdx = await createAndSelectEnum(page, 'TestEnum_Cascade');

    // ── 2. Add three PVs (pv1Idx=0, pv2Idx=1, pv3Idx=2) ───────────────────
    const pv1Idx = await addPvRow(page);
    const pv2Idx = await addPvRow(page);
    const pv3Idx = await addPvRow(page);

    for (const [row, text] of [[pv1Idx, 'PV_A'], [pv2Idx, 'PV_B'], [pv3Idx, 'PV_C']]) {
      await page.evaluate(([r, t]) => {
        const dh      = window._appContext.dhs.PermissibleValue;
        const physCol = dh.slot_name_to_column['text'];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(r, visCol, t);
        }
      }, [row, text]);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(200);

    // ── 3. Verify all three PVs are present ────────────────────────────────
    const textsAfterCreate = await getAllPvTexts(page);
    expect(textsAfterCreate, 'PV_A should exist after create').toContain('PV_A');
    expect(textsAfterCreate, 'PV_B should exist after create').toContain('PV_B');
    expect(textsAfterCreate, 'PV_C should exist after create').toContain('PV_C');

    // ── 4. Delete PV_B (index 1) via right-click — no confirm dialog ───────
    const pvTitleColIdx = await dhColIndex(page, 'PermissibleValue', 'title');
    await pvCellLocator(page, pv2Idx, pvTitleColIdx).click({ button: 'right' });
    const removePvItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removePvItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removePvItem.first().click();
    await page.waitForTimeout(300);

    // ── 5. Verify PV_B gone; PV_A and PV_C remain ─────────────────────────
    const textsAfterPvDelete = await getAllPvTexts(page);
    expect(textsAfterPvDelete, 'PV_A should remain after PV_B deletion').toContain('PV_A');
    expect(textsAfterPvDelete, 'PV_B should be gone after deletion'     ).not.toContain('PV_B');
    expect(textsAfterPvDelete, 'PV_C should remain after PV_B deletion').toContain('PV_C');

    // ── 6. Delete Enum row via right-click (triggers cascade-confirm dialog) ─
    const enumTitleColIdx = await dhColIndex(page, 'Enum', 'title');
    await hotCellLocator(page, enumRowIdx, enumTitleColIdx).click({ button: 'right' });
    const removeEnumItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeEnumItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeEnumItem.first().click();

    // ── 7. Confirm the cascade-delete dialog (.btn-danger = "Delete") ───────
    // Multiple #dh-dialog-modal elements exist (one per DH instance); use
    // .first() to avoid strict-mode violations and target the visible one.
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 5_000 });
    await page.locator('#dh-dialog-modal .btn-danger').first().click();
    await page.waitForTimeout(500);

    // ── 8. Verify Enum row is gone from the Enum DH ────────────────────────
    const enumNames = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Enum;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(enumNames, 'deleted Enum should not appear in Enum DH').not.toContain('TestEnum_Cascade');

    // ── 9. Verify remaining PVs (PV_A and PV_C) were cascade-deleted ───────
    const textsAfterEnumDelete = await getAllPvTexts(page);
    expect(textsAfterEnumDelete, 'PV_A should be cascade-deleted with Enum').not.toContain('PV_A');
    expect(textsAfterEnumDelete, 'PV_C should be cascade-deleted with Enum').not.toContain('PV_C');
  });
});
