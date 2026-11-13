/* Verifies the Schema tab split layout and CRUD in the Schema Editor.
 *
 * The Schema lower panel is expert-only (requires the #schema_expert checkbox).
 * It hosts THREE secondary tabs: Prefix, Setting, and Extension.
 * Only Prefix is in Schema.dependents, so only Prefix gets a cascade-delete test.
 *
 * Layout tests (describe 1 – "Schema tab split layout"):
 *     1. lower panel is created on schema-editor load; secondary tabs hidden
 *     2. enabling expert mode on Schema tab shows split and lower panel
 *     3. switching away from Schema hides the lower panel
 *     4. switching back to Schema re-shows the lower panel
 *     5. clicking sub-tab labels switches the active lower-panel DH
 *
 * Schema CRUD tests (describe 2 – "Schema CRUD"):
 *   Create  – add a new Schema row; verify name, title, description.
 *   Update  – edit title and description; verify changes.
 *   Delete  – remove a Schema row (no children) via right-click; verify gone.
 *
 * Prefix CRUD tests (describe 3 – "Prefix CRUD"):
 *   Create  – add Prefix with prefix + reference; verify schema_id FK populated.
 *   Update  – edit prefix and reference; verify changes.
 *   Delete  – remove via right-click; verify gone.
 *   Cascade – add 3 Prefixes, delete 1, delete Schema (confirm dialog), verify
 *             remaining 2 Prefixes are cascade-deleted.
 *
 * Setting CRUD tests (describe 4 – "Setting CRUD"):
 *   Create  – add Setting with name + value; verify schema_id FK populated.
 *   Update  – edit name, value, description.
 *   Delete  – remove via right-click; verify gone.
 *   (No cascade test — Setting is not in Schema.dependents.)
 *
 * Extension CRUD tests (describe 5 – "Extension CRUD"):
 *   Create  – add Extension with name + value; verify schema_id FK populated.
 *   Update  – edit name, value, description.
 *   Delete  – remove via right-click; verify gone.
 *   (No cascade test — Extension is not in Schema.dependents.)
 *
 * Run:
 *   npx playwright test tests/playwright/SCHEMA_schema_crud_test.spec.js
 *   HEADED=1 npx playwright test tests/playwright/SCHEMA_schema_crud_test.spec.js
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

/** Enable expert mode via the #schema_expert checkbox. */
async function enableExpertMode(page) {
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);
}

/**
 * Click a secondary tab label inside #schema-lower-panel.
 * The panel must already be visible (expert mode on, Schema tab active).
 */
async function switchSubTab(page, dhName) {
  await page.locator(
    `#schema-lower-panel .dh-lower-panel-label[data-label-template="${dhName}"]`
  ).click();
  await page.waitForTimeout(200);
}

/**
 * Cell locator for a secondary DH inside #schema-lower-panel.
 * Prefix = body index 0, Setting = 1, Extension = 2 (insertion order).
 */
const DH_BODY_IDX = { Prefix: 0, Setting: 1, Extension: 2 };

function schemaSubTabCellLocator(page, dhName, rowIndex, colIdx) {
  const bodyLocator = page
    .locator('#schema-lower-panel .dh-lower-panel-body')
    .nth(DH_BODY_IDX[dhName]);
  if (colIdx === 0) {
    return bodyLocator
      .locator('.ht_clone_left.handsontable tbody tr')
      .nth(rowIndex)
      .locator('td:nth-of-type(1)');
  }
  return bodyLocator
    .locator('.ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

// ── Diagnostic helper (layout tests only) ───────────────────────────────────

async function getDiagnostics(page) {
  return page.evaluate(() => {
    const grid = document.getElementById('data-harmonizer-grid');
    const lp   = document.getElementById('schema-lower-panel');

    const activePanes = grid ? [...grid.querySelectorAll(':scope > .tab-pane.active')] : [];
    const activePane  = activePanes[0];
    const lpCss   = lp        ? window.getComputedStyle(lp)        : null;
    const paneCss = activePane ? window.getComputedStyle(activePane) : null;

    const lbl = n => document.querySelector(
      `.dh-lower-panel-label[data-label-template="${n}"]`
    );

    return {
      gridExists:           !!grid,
      gridClasses:          grid?.className ?? '(none)',
      gridHasSchemaSplit:   grid?.classList.contains('dh-split-active') ?? false,
      gridClientH:          grid?.clientHeight ?? 0,

      lowerPanelExists:     !!lp,
      lowerPanelClasses:    lp?.className ?? '(none)',
      lowerPanelVisible:    lp?.classList.contains('visible') ?? false,
      lowerPanelDisplay:    lpCss?.display ?? '(none)',
      lowerPanelPosition:   lpCss?.position ?? '(none)',
      lowerPanelTop:        lpCss?.top ?? '(none)',

      prefixLabelActive:    lbl('Prefix')?.classList.contains('active')    ?? false,
      settingLabelActive:   lbl('Setting')?.classList.contains('active')   ?? false,
      extLabelActive:       lbl('Extension')?.classList.contains('active') ?? false,

      activePaneCount:      activePanes.length,
      activePaneId:         activePane?.id ?? '(none)',
      activePaneHeight:     activePane?.clientHeight ?? 0,
      activePaneStyleH:     activePane?.style?.height ?? '(empty)',
      activePaneComputedH:  paneCss?.height ?? '(none)',

      prefixTabBarDisplay:  document.getElementById('tab-bar-Prefix')?.style.display    ?? '(none)',
      settingTabBarDisplay: document.getElementById('tab-bar-Setting')?.style.display   ?? '(none)',
      extTabBarDisplay:     document.getElementById('tab-bar-Extension')?.style.display ?? '(none)',

      gridChildPaneIds: grid
        ? [...grid.querySelectorAll(':scope > .tab-pane')].map(p => p.id)
        : [],
    };
  });
}

// ── Shared helper: seed a Schema row for sub-tab tests ───────────────────────

/**
 * Create a Schema row via hot.alter(), set its name, then click it to establish
 * HOT selection.  Must be called while already on the Schema tab.
 *
 * addRows() on FK-dependent DHs (Prefix, Setting, Extension) calls
 * crudGetForeignKeyValues → hot.getSelected() on Schema DH.  If the Schema DH
 * has no selection the FK is null and addRows() shows the empty-parent-key modal
 * without inserting any row.  Seeding + selecting a Schema row prevents that.
 */
async function createAndSelectSchemaRow(page, schemaName) {
  await page.evaluate(() => {
    const dh = window._appContext.dhs.Schema;
    // insert_row_above at 0 is safe even for a completely empty grid
    dh.hot.alter('insert_row_above', 0, 1);
  });
  await page.waitForTimeout(200);

  const rowIdx = await page.evaluate(
    () => window._appContext.dhs.Schema.hot.countRows() - 1
  );

  await page.evaluate(([row, name]) => {
    const dh      = window._appContext.dhs.Schema;
    const physCol = dh.slot_name_to_column['name'];
    if (physCol !== undefined) {
      const visCol = dh.hot.toVisualColumn(physCol);
      if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, name);
    }
  }, [rowIdx, schemaName]);
  // Allow SchemaEditor's afterChange cascade (tab-bar update, DH reload) to settle
  await page.waitForTimeout(500);

  // Click the Schema row to establish HOT selection (persists while on Schema tab)
  await hotCellLocator(page, rowIdx, 0).click();
  await page.waitForTimeout(200);

  return rowIdx;
}

/**
 * Click the lower-panel Add button to add one row to whichever secondary DH
 * is currently active.  Returns the before-count (new row index).
 */
async function addSubTabRow(page, dhName) {
  const countBefore = await page.evaluate(
    n => window._appContext?.dhs?.[n]?.hot?.countRows() ?? 0, dhName
  );
  await page.locator(
    '#schema-lower-panel .dh-lower-tab-strip .btn.btn-primary.btn-sm'
  ).click();
  await page.waitForTimeout(300);
  return countBefore; // new row was appended at this index
}

// ── 1. Layout tests ──────────────────────────────────────────────────────────

test.describe('Schema tab split layout (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    // Expert mode is NOT enabled here; individual tests manage it
  });

  test('1. lower panel is created on schema-editor load', async ({ page }) => {
    await expect(page.locator('#schema-lower-panel')).toBeAttached({ timeout: 5_000 });

    // All three secondary tab-bar entries must be hidden in the top-level tab bar
    const diag = await getDiagnostics(page);
    expect(diag.prefixTabBarDisplay,  'Prefix nav entry should be hidden'   ).toBe('none');
    expect(diag.settingTabBarDisplay, 'Setting nav entry should be hidden'  ).toBe('none');
    expect(diag.extTabBarDisplay,     'Extension nav entry should be hidden').toBe('none');
  });

  test('2. enabling expert mode on Schema tab shows split and lower panel', async ({ page }) => {
    // Schema tab is already active on page load; enabling expert mode triggers showSplit()
    await enableExpertMode(page);
    await page.waitForTimeout(300);

    const diag = await getDiagnostics(page);

    expect(diag.lowerPanelExists,   'lower panel must exist in DOM'              ).toBe(true);
    expect(diag.gridHasSchemaSplit, `grid classes: "${diag.gridClasses}"`        ).toBe(true);
    expect(diag.lowerPanelVisible,  `panel classes: "${diag.lowerPanelClasses}"` ).toBe(true);
    expect(diag.lowerPanelPosition, 'lower panel CSS position'                   ).toBe('absolute');

    // Active pane must be ~45 % of grid height (splitRatio: '45%')
    const { gridClientH, activePaneHeight, activePaneStyleH, activePaneComputedH } = diag;
    expect(gridClientH, 'grid has no height').toBeGreaterThan(100);
    expect(
      activePaneHeight,
      `pane clientHeight ${activePaneHeight}px vs grid ${gridClientH}px ` +
      `(style="${activePaneStyleH}", computed="${activePaneComputedH}")`
    ).toBeGreaterThan(gridClientH * 0.30);
    expect(
      activePaneHeight,
      `pane still at ~100% (clientH=${activePaneHeight}, gridH=${gridClientH})`
    ).toBeLessThan(gridClientH * 0.65);

    // Lower panel top must be ~45 % of grid height
    const lpTopPx = parseFloat(diag.lowerPanelTop);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeGreaterThan(gridClientH * 0.30);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeLessThan(gridClientH * 0.65);

    // Prefix tab label must be visible and active (first tab, index 0)
    await expect(
      page.locator('.dh-lower-panel-label[data-label-template="Prefix"]')
    ).toBeVisible();
    expect(diag.prefixLabelActive, 'Prefix tab should be active by default').toBe(true);
  });

  test('3. switching away from Schema hides the lower panel', async ({ page }) => {
    await enableExpertMode(page);
    await page.waitForTimeout(300);

    await page.click('#tab-bar-Class > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForFunction(
      () => !document.getElementById('schema-lower-panel')?.classList.contains('visible'),
      null, { timeout: 3_000 }
    );
  });

  test('4. switching back to Schema re-shows the lower panel', async ({ page }) => {
    await enableExpertMode(page);
    await page.waitForTimeout(300);

    await page.click('#tab-bar-Class > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForTimeout(300);

    await expect(page.locator('#schema-lower-panel')).toHaveClass(/visible/);
  });

  test('5. clicking sub-tab labels switches the active lower-panel DH', async ({ page }) => {
    await enableExpertMode(page);
    await page.waitForTimeout(300);

    // Prefix is active by default (index 0)
    const diagInit = await getDiagnostics(page);
    expect(diagInit.prefixLabelActive,  'Prefix should be active initially' ).toBe(true);
    expect(diagInit.settingLabelActive, 'Setting should not be active'      ).toBe(false);
    expect(diagInit.extLabelActive,     'Extension should not be active'    ).toBe(false);

    // Switch to Setting
    await switchSubTab(page, 'Setting');
    const diagSetting = await getDiagnostics(page);
    expect(diagSetting.prefixLabelActive,  'Prefix should not be active' ).toBe(false);
    expect(diagSetting.settingLabelActive, 'Setting should be active'    ).toBe(true);
    expect(diagSetting.extLabelActive,     'Extension should not be active').toBe(false);

    // Switch to Extension
    await switchSubTab(page, 'Extension');
    const diagExt = await getDiagnostics(page);
    expect(diagExt.settingLabelActive, 'Setting should not be active'  ).toBe(false);
    expect(diagExt.extLabelActive,     'Extension should be active'    ).toBe(true);
  });
});

// ── 2. Schema CRUD ────────────────────────────────────────────────────────────

test.describe('Schema CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    // Schema tab is active on load; no expert mode needed for Schema DH CRUD
  });

  /**
   * Add a Schema row via addRows(), set name/title/description, return row index.
   * Schema has no parent FK, so addRows() inserts unconditionally.
   * Schema.name pattern: ^[a-zA-Z_][a-zA-Z0-9._-]*$
   */
  async function addSchemaRow(page, name, title, description) {
    const beforeCount = await page.evaluate(
      () => window._appContext?.dhs?.Schema?.hot?.countRows() ?? 0
    );
    await page.evaluate(
      () => window._appContext.dhs.Schema.addRows('insert_row_below', 1)
    );
    await page.waitForTimeout(300);

    const rowIdx = await page.evaluate(
      () => window._appContext.dhs.Schema.hot.countRows() - 1
    );
    expect(rowIdx, 'addRows() should increase row count').toBeGreaterThanOrEqual(beforeCount);

    await page.evaluate(([row, name, title, description]) => {
      const dh = window._appContext.dhs.Schema;
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
    const rowIdx = await addSchemaRow(
      page, 'TestSchemaCreate', 'Create Test Title', 'Created by test'
    );

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.Schema;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { name: get('name'), title: get('title'), description: get('description') };
    }, [rowIdx]);

    expect(data.name,        'name should be saved'       ).toBe('TestSchemaCreate');
    expect(data.title,       'title should be saved'      ).toBe('Create Test Title');
    expect(data.description, 'description should be saved').toBe('Created by test');
  });

  test('Update: title and description', async ({ page }) => {
    const rowIdx = await addSchemaRow(
      page, 'TestSchemaUpdate', 'Original Title', 'Original description'
    );

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Schema;
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
      const dh = window._appContext.dhs.Schema;
      return {
        title:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['title']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.title,       'title should be updated'      ).toBe('Updated Title');
    expect(data.description, 'description should be updated').toBe('Updated description');
  });

  test('Delete: remove row via right-click context menu', async ({ page }) => {
    const rowIdx = await addSchemaRow(
      page, 'TestSchemaDelete', 'Delete Me', 'Will be deleted'
    );

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Schema.hot.countRows()
    );

    // Right-click on the title column (non-frozen, in ht_master).
    // This Schema row has no children so removeSelectedRows() deletes directly —
    // no dhConfirm dialog.
    const titleColIdx = await dhColIndex(page, 'Schema', 'title');
    await hotCellLocator(page, rowIdx, titleColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Schema.hot.countRows()
    );
    expect(countAfter, 'row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Schema;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted schema name should not appear').not.toContain('TestSchemaDelete');
  });
});

// ── 3. Prefix CRUD ────────────────────────────────────────────────────────────

test.describe('Prefix CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await enableExpertMode(page);  // shows lower panel with Prefix tab active (index 0)
  });

  /**
   * Collect all Prefix 'prefix' values in the Prefix DH.
   */
  async function getAllPrefixes(page) {
    return page.evaluate(() => {
      const dh  = window._appContext.dhs.Prefix;
      const col = dh.slot_name_to_column['prefix'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
  }

  test('Create: prefix and reference with auto-populated schema_id FK', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'PrefixCreateSchema');
    // Prefix is the first sub-tab (active by default after showSplit)
    const rowIdx = await addSubTabRow(page, 'Prefix');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Prefix;
      for (const [slot, value] of [
        ['prefix',    'test_ns'],
        ['reference', 'http://example.org/test/'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.Prefix;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { prefix: get('prefix'), reference: get('reference'), schema_id: get('schema_id') };
    }, [rowIdx]);

    expect(data.prefix,    'prefix should be saved'                ).toBe('test_ns');
    expect(data.reference, 'reference should be saved'            ).toBe('http://example.org/test/');
    expect(data.schema_id, 'schema_id FK should be auto-populated').toBeTruthy();
  });

  test('Update: prefix and reference', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'PrefixUpdateSchema');
    const rowIdx = await addSubTabRow(page, 'Prefix');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Prefix;
      for (const [slot, value] of [
        ['prefix', 'ns_original'], ['reference', 'http://original.example.org/'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Prefix;
      for (const [slot, value] of [
        ['prefix', 'ns_updated'], ['reference', 'http://updated.example.org/'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Prefix;
      return {
        prefix:    dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['prefix']),
        reference: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['reference']),
      };
    }, [rowIdx]);

    expect(data.prefix,    'prefix should be updated'   ).toBe('ns_updated');
    expect(data.reference, 'reference should be updated').toBe('http://updated.example.org/');
  });

  test('Delete: remove Prefix row via right-click context menu', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'PrefixDeleteSchema');
    const rowIdx = await addSubTabRow(page, 'Prefix');

    await page.evaluate(([row]) => {
      const dh      = window._appContext.dhs.Prefix;
      const physCol = dh.slot_name_to_column['prefix'];
      if (physCol !== undefined) {
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, 'ns_delete');
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Prefix.hot.countRows()
    );

    // Right-click on the reference column (non-frozen, in ht_master).
    const refColIdx = await dhColIndex(page, 'Prefix', 'reference');
    await schemaSubTabCellLocator(page, 'Prefix', rowIdx, refColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Prefix.hot.countRows()
    );
    expect(countAfter, 'Prefix row count should decrease by 1').toBe(countBefore - 1);

    const prefixes = await getAllPrefixes(page);
    expect(prefixes, 'deleted prefix should not appear').not.toContain('ns_delete');
  });

  test('Cascade delete: single Prefix then Schema removes remaining Prefixes', async ({ page }) => {
    // ── 1. Create parent Schema ─────────────────────────────────────────────
    const schemaRowIdx = await createAndSelectSchemaRow(page, 'PrefixCascadeSchema');

    // ── 2. Add three Prefix rows ────────────────────────────────────────────
    const p1Idx = await addSubTabRow(page, 'Prefix');
    const p2Idx = await addSubTabRow(page, 'Prefix');
    const p3Idx = await addSubTabRow(page, 'Prefix');

    for (const [row, val] of [[p1Idx, 'ns_alpha'], [p2Idx, 'ns_beta'], [p3Idx, 'ns_gamma']]) {
      await page.evaluate(([r, v]) => {
        const dh      = window._appContext.dhs.Prefix;
        const physCol = dh.slot_name_to_column['prefix'];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(r, visCol, v);
        }
      }, [row, val]);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(200);

    // ── 3. Verify all three Prefixes are present ────────────────────────────
    const prefixesAfterCreate = await getAllPrefixes(page);
    expect(prefixesAfterCreate, 'ns_alpha should exist').toContain('ns_alpha');
    expect(prefixesAfterCreate, 'ns_beta should exist' ).toContain('ns_beta');
    expect(prefixesAfterCreate, 'ns_gamma should exist').toContain('ns_gamma');

    // ── 4. Delete ns_beta (index 1) via right-click — no confirm dialog ──────
    const refColIdx = await dhColIndex(page, 'Prefix', 'reference');
    await schemaSubTabCellLocator(page, 'Prefix', p2Idx, refColIdx).click({ button: 'right' });
    const removePrefixItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removePrefixItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removePrefixItem.first().click();
    await page.waitForTimeout(300);

    // ── 5. Verify ns_beta gone; ns_alpha and ns_gamma remain ─────────────────
    const prefixesAfterDelete = await getAllPrefixes(page);
    expect(prefixesAfterDelete, 'ns_alpha should remain after ns_beta deletion').toContain('ns_alpha');
    expect(prefixesAfterDelete, 'ns_beta should be gone after deletion'        ).not.toContain('ns_beta');
    expect(prefixesAfterDelete, 'ns_gamma should remain after ns_beta deletion').toContain('ns_gamma');

    // ── 6. Delete Schema row (triggers cascade-confirm since Prefix rows exist) ─
    const schemaTitleColIdx = await dhColIndex(page, 'Schema', 'title');
    await hotCellLocator(page, schemaRowIdx, schemaTitleColIdx).click({ button: 'right' });
    const removeSchemaItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeSchemaItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeSchemaItem.first().click();

    // ── 7. Confirm the cascade-delete dialog (.btn-danger = "Delete") ────────
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 5_000 });
    await page.locator('#dh-dialog-modal .btn-danger').first().click();
    await page.waitForTimeout(500);

    // ── 8. Verify Schema row is gone ─────────────────────────────────────────
    const schemaNames = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Schema;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(schemaNames, 'deleted Schema should not appear').not.toContain('PrefixCascadeSchema');

    // ── 9. Verify remaining Prefixes were cascade-deleted ────────────────────
    const prefixesAfterSchemaDelete = await getAllPrefixes(page);
    expect(prefixesAfterSchemaDelete, 'ns_alpha should be cascade-deleted').not.toContain('ns_alpha');
    expect(prefixesAfterSchemaDelete, 'ns_gamma should be cascade-deleted').not.toContain('ns_gamma');
  });
});

// ── 4. Setting CRUD ───────────────────────────────────────────────────────────

test.describe('Setting CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await enableExpertMode(page);
  });

  test('Create: name and value with auto-populated schema_id FK', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'SettingCreateSchema');
    await switchSubTab(page, 'Setting');
    const rowIdx = await addSubTabRow(page, 'Setting');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Setting;
      for (const [slot, value] of [
        ['name',  'test_pattern'],
        ['value', '\\d{4}-\\d{2}-\\d{2}'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.Setting;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { name: get('name'), value: get('value'), schema_id: get('schema_id') };
    }, [rowIdx]);

    expect(data.name,      'name should be saved'                 ).toBe('test_pattern');
    expect(data.value,     'value should be saved'                ).toBe('\\d{4}-\\d{2}-\\d{2}');
    expect(data.schema_id, 'schema_id FK should be auto-populated').toBeTruthy();
  });

  test('Update: name, value, and description', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'SettingUpdateSchema');
    await switchSubTab(page, 'Setting');
    const rowIdx = await addSubTabRow(page, 'Setting');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Setting;
      for (const [slot, value] of [['name', 'orig_setting'], ['value', '\\w+']]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Setting;
      for (const [slot, value] of [
        ['name',        'updated_setting'],
        ['value',       '\\d+'],
        ['description', 'Updated setting description'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Setting;
      return {
        name:        dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['name']),
        value:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['value']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.name,        'name should be updated'       ).toBe('updated_setting');
    expect(data.value,       'value should be updated'      ).toBe('\\d+');
    expect(data.description, 'description should be updated').toBe('Updated setting description');
  });

  test('Delete: remove Setting row via right-click context menu', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'SettingDeleteSchema');
    await switchSubTab(page, 'Setting');
    const rowIdx = await addSubTabRow(page, 'Setting');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Setting;
      for (const [slot, value] of [['name', 'del_setting'], ['value', '.*']]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Setting.hot.countRows()
    );

    const descColIdx = await dhColIndex(page, 'Setting', 'description');
    await schemaSubTabCellLocator(page, 'Setting', rowIdx, descColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Setting.hot.countRows()
    );
    expect(countAfter, 'Setting row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Setting;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted Setting name should not appear').not.toContain('del_setting');
  });
});

// ── 5. Extension CRUD ─────────────────────────────────────────────────────────

test.describe('Extension CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await enableExpertMode(page);
  });

  test('Create: name and value with auto-populated schema_id FK', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'ExtCreateSchema');
    await switchSubTab(page, 'Extension');
    const rowIdx = await addSubTabRow(page, 'Extension');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Extension;
      for (const [slot, value] of [
        ['name',  'test_locale'],
        ['value', 'en'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh  = window._appContext.dhs.Extension;
      const get = slot => dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column[slot]);
      return { name: get('name'), value: get('value'), schema_id: get('schema_id') };
    }, [rowIdx]);

    expect(data.name,      'name should be saved'                 ).toBe('test_locale');
    expect(data.value,     'value should be saved'                ).toBe('en');
    expect(data.schema_id, 'schema_id FK should be auto-populated').toBeTruthy();
  });

  test('Update: name, value, and description', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'ExtUpdateSchema');
    await switchSubTab(page, 'Extension');
    const rowIdx = await addSubTabRow(page, 'Extension');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Extension;
      for (const [slot, value] of [['name', 'orig_ext'], ['value', 'fr']]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Extension;
      for (const [slot, value] of [
        ['name',        'updated_ext'],
        ['value',       'fr-CA'],
        ['description', 'Updated extension description'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const data = await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Extension;
      return {
        name:        dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['name']),
        value:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['value']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.name,        'name should be updated'       ).toBe('updated_ext');
    expect(data.value,       'value should be updated'      ).toBe('fr-CA');
    expect(data.description, 'description should be updated').toBe('Updated extension description');
  });

  test('Delete: remove Extension row via right-click context menu', async ({ page }) => {
    await createAndSelectSchemaRow(page, 'ExtDeleteSchema');
    await switchSubTab(page, 'Extension');
    const rowIdx = await addSubTabRow(page, 'Extension');

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Extension;
      for (const [slot, value] of [['name', 'del_ext'], ['value', 'to_delete']]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol !== undefined) {
          const visCol = dh.hot.toVisualColumn(physCol);
          if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
        }
      }
    }, [rowIdx]);
    await page.waitForTimeout(200);

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Extension.hot.countRows()
    );

    const descColIdx = await dhColIndex(page, 'Extension', 'description');
    await schemaSubTabCellLocator(page, 'Extension', rowIdx, descColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Extension.hot.countRows()
    );
    expect(countAfter, 'Extension row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Extension;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted Extension name should not appear').not.toContain('del_ext');
  });
});
