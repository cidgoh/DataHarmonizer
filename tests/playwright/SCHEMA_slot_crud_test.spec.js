/* Verifies the Slot tab split layout and CRUD in the Schema Editor.
 *
 * Layout tests (describe 1 – "Slot tab split layout"):
 *   Step-by-step checks of the split-view lifecycle so a failure message
 *   pinpoints exactly which part of the layout chain is broken.
 *     1. lower panel is created on schema-editor load
 *     2. clicking Slot tab shows split and lower panel
 *     3. switching away from Slot hides the lower panel
 *     4. switching back to Slot re-shows the lower panel
 *
 * Slot CRUD tests (describe 2 – "Slot CRUD"):
 *   Create  – add a new Slot row; verify name, title, and description are stored.
 *   Update  – edit title and description of an existing Slot row; verify changes.
 *   Delete  – remove a Slot row via the HOT right-click context menu; verify
 *             the row is gone.
 *
 * ClassSlot CRUD tests (describe 3 – "ClassSlot CRUD"):
 *   Create  – with a parent Class selected and the class-filter dropdown set,
 *             add a ClassSlot via the lower-panel Add button; verify name and
 *             that schema_id/class_id FKs are auto-populated by addRows().
 *   Update  – edit title and description of an existing ClassSlot row; verify.
 *   Delete  – remove a ClassSlot row via the HOT right-click context menu.
 *   Cascade – add 3 ClassSlots to a Class, delete 1 (verify gone), then
 *             navigate to Class tab and delete the Class (via cascade-confirm
 *             dialog); verify the remaining 2 ClassSlots are also gone.
 *
 * Notes:
 *   • ClassSlot is embedded in the Slot tab's lower panel (slot-lower-panel)
 *     and is NOT a standalone Bootstrap tab pane.  The Slot tab also features
 *     a class-filter <select> (.slot-class-filter) that narrows which ClassSlots
 *     are shown; tests set this to the test class name to keep indices small
 *     and avoid HOT virtualization issues with large schemas.
 *   • ClassSlot.addRows() needs BOTH the Schema DH and the Class DH to have a
 *     selected row so it can resolve the schema_id and class_id FKs.
 *   • Slot name must follow ^[a-zA-Z_][a-zA-Z0-9._-]*$ convention.
 *   • Class name must be CamelCase (^([A-Z]+[a-z0-9]*)+$).
 *   • ClassSlot cascade: Class → ClassSlot is a FK dependency (class_id).
 *     Deleting a Class row that has ClassSlot children triggers the cascade-
 *     confirm dialog.  ClassSlot is NOT in Slot.dependents in TAB_MENU_MAP
 *     (that list drives menu refreshes only); the actual cascade is driven by
 *     the class_id FK relationship tracked in context.relations.
 *
 * Run:
 *   npx playwright test tests/playwright/SCHEMA_slot_crud_test.spec.js
 *   HEADED=1 npx playwright test tests/playwright/SCHEMA_slot_crud_test.spec.js
 */

import { test, expect } from '@playwright/test';
import { hotCellLocator, dhColIndex, classSlotCellLocator } from './playwright_utils.js';

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
    () => !document.querySelector('#tab-bar-Slot')?.classList.contains('disabled'),
    null,
    { timeout: 5_000 }
  );
}

async function goToSlotTab(page) {
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  // Allow showSplit()'s internal setTimeout(100) + render to complete
  await page.waitForTimeout(300);
}

async function goToClassTab(page) {
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForTimeout(300);
}

// ── Diagnostic helper (layout tests only) ───────────────────────────────────

async function getDiagnostics(page) {
  return page.evaluate(() => {
    const grid  = document.getElementById('data-harmonizer-grid');
    const lp    = document.getElementById('slot-lower-panel');
    const csLabel = document.querySelector(
      '.dh-lower-panel-label[data-label-template="ClassSlot"]'
    );

    const activePanes = grid ? [...grid.querySelectorAll(':scope > .tab-pane.active')] : [];
    const activePane  = activePanes[0];

    const lpCss   = lp        ? window.getComputedStyle(lp)        : null;
    const paneCss = activePane ? window.getComputedStyle(activePane) : null;

    return {
      gridExists:          !!grid,
      gridClasses:         grid?.className ?? '(none)',
      gridHasSlotSplit:    grid?.classList.contains('dh-split-active') ?? false,
      gridClientH:         grid?.clientHeight ?? 0,

      lowerPanelExists:    !!lp,
      lowerPanelClasses:   lp?.className ?? '(none)',
      lowerPanelVisible:   lp?.classList.contains('visible') ?? false,
      lowerPanelDisplay:   lpCss?.display ?? '(none)',
      lowerPanelPosition:  lpCss?.position ?? '(none)',
      lowerPanelTop:       lpCss?.top ?? '(none)',
      csLabelExists:       !!csLabel,

      activePaneCount:     activePanes.length,
      activePaneId:        activePane?.id ?? '(none)',
      activePaneHeight:    activePane?.clientHeight ?? 0,
      activePaneStyleH:    activePane?.style?.height ?? '(empty)',
      activePaneComputedH: paneCss?.height ?? '(none)',

      csTabBarDisplay:
        document.getElementById('tab-bar-ClassSlot')?.style?.display ?? '(none)',

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
 * (before goToSlotTab / goToClassTab) so the click registers on the visible grid.
 *
 * addRows() on FK-dependent DHs (Slot, ClassSlot, …) calls
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

test.describe('Slot tab split layout (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
  });

  test('1. lower panel is created on schema-editor load', async ({ page }) => {
    const lp = page.locator('#slot-lower-panel');
    await expect(lp).toBeAttached({ timeout: 5_000 });

    // ClassSlot's nav entry is hidden inside the lower panel; the top-bar tab
    // must have display:none so the user cannot navigate to it directly.
    const csTabBarDisplay = await page.evaluate(
      () => document.getElementById('tab-bar-ClassSlot')?.style.display
    );
    expect(csTabBarDisplay).toBe('none');
  });

  test('2. clicking Slot tab shows split and lower panel', async ({ page }) => {
    await goToSlotTab(page);

    const diag = await getDiagnostics(page);

    // B. #slot-lower-panel must exist
    expect(diag.lowerPanelExists, `lower panel missing; grid children: ${diag.gridChildPaneIds}`)
      .toBe(true);

    // C. grid must carry dh-split-active
    expect(diag.gridHasSlotSplit, `grid classes: "${diag.gridClasses}"`)
      .toBe(true);

    // D. lower panel must have class 'visible'
    expect(diag.lowerPanelVisible, `lower-panel classes: "${diag.lowerPanelClasses}"`)
      .toBe(true);

    // E. lower panel must be absolutely positioned
    expect(diag.lowerPanelPosition, 'lower panel CSS position')
      .toBe('absolute');

    // F. active pane must be ~45% of the grid height (splitRatio: '45%')
    const { gridClientH, activePaneHeight, activePaneStyleH, activePaneComputedH } = diag;
    expect(gridClientH, 'grid has no height').toBeGreaterThan(100);
    expect(
      activePaneHeight,
      `pane clientHeight ${activePaneHeight}px vs grid ${gridClientH}px ` +
      `(style.height="${activePaneStyleH}", computed="${activePaneComputedH}")`
    ).toBeGreaterThan(gridClientH * 0.30);
    expect(
      activePaneHeight,
      `pane still at ~100% (clientH=${activePaneHeight}, gridH=${gridClientH}) ` +
      `style.height="${activePaneStyleH}" computed="${activePaneComputedH}"`
    ).toBeLessThan(gridClientH * 0.65);

    // G. lower panel top must be ~45% of grid height
    const lpTopPx = parseFloat(diag.lowerPanelTop);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeGreaterThan(gridClientH * 0.30);
    expect(lpTopPx, `lower panel top: "${diag.lowerPanelTop}"`).toBeLessThan(gridClientH * 0.65);

    // H. ClassSlot tab label must be visible in lower panel
    await expect(
      page.locator('.dh-lower-panel-label[data-label-template="ClassSlot"]')
    ).toBeVisible();
  });

  test('3. switching away from Slot hides the lower panel', async ({ page }) => {
    await goToSlotTab(page);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null,
      { timeout: 5_000 }
    );
    await page.waitForFunction(
      () => !document.getElementById('slot-lower-panel')?.classList.contains('visible'),
      null,
      { timeout: 3_000 }
    );
  });

  test('4. switching back to Slot re-shows the lower panel', async ({ page }) => {
    await goToSlotTab(page);

    await page.click('#tab-bar-Schema > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );

    await page.click('#tab-bar-Slot > a');
    await page.waitForFunction(
      () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
      null, { timeout: 5_000 }
    );
    await page.waitForTimeout(300);

    await expect(page.locator('#slot-lower-panel')).toHaveClass(/visible/);
  });
});

// ── 2. Slot CRUD ──────────────────────────────────────────────────────────────

test.describe('Slot CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    // No seedSchemaRow needed: Slot.addRows() is overridden in SchemaEditor to
    // open the Field Key Modal (see _initSchemaEditorSlotTab, line ~3802), so we
    // bypass it with hot.alter() directly.  "Display: All records" (set in
    // setupSchemaEditor) keeps the Slot DH unfiltered so the new row is visible.
    await goToSlotTab(page);
  });

  /**
   * Insert a Slot row via hot.alter() — bypasses the Field Key Modal that
   * SchemaEditor installs over Slot.addRows().  The new row is inserted above
   * visual row 0 so it appears at index 0 regardless of how many existing
   * schema-level slots are present in the loaded template.
   *
   * Slot name must follow ^[a-zA-Z_][a-zA-Z0-9._-]*$ convention.
   */
  async function addSlotRow(page, name, title, description) {
    // hot.alter() bypasses the overridden addRows (which opens the Field Key Modal).
    await page.evaluate(() => {
      window._appContext.dhs.Slot.hot.alter('insert_row_above', 0, 1);
    });
    await page.waitForTimeout(200);

    // Use 'cascade_confirm' source to bypass the SchemaEditor beforeChange hook that
    // intercepts KEY_COLUMN edits (name, slot_type, class_id, slot_group) and would
    // otherwise open the Field Key Modal and cancel the inline change.
    // Set slot_type='attribute' so removeSelectedFieldsWithConfirmation does not
    // treat the row as a base schema slot (null slot_type defaults to 'slot' there,
    // which disables the Delete button for non-expert users).
    await page.evaluate(([name, title, description]) => {
      const dh = window._appContext.dhs.Slot;
      for (const [slot, value] of [
        ['slot_type', 'attribute'],
        ['name', name],
        ['title', title],
        ['description', description],
      ]) {
        if (!value) continue;
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(0, visCol, value, 'cascade_confirm');
      }
    }, [name, title, description]);
    await page.waitForTimeout(200);

    return 0; // new row at visual index 0
  }

  test('Create: name, title, and description', async ({ page }) => {
    await addSlotRow(page, 'test_slot_create', 'Create Test Title', 'Created by test');

    // Verify by scanning physical source rows — getSourceDataAtCell() takes a
    // physical row index, so we cannot rely on the visual-row return value here.
    const data = await page.evaluate((targetName) => {
      const dh      = window._appContext.dhs.Slot;
      const hot     = dh.hot;
      const nameCol = dh.slot_name_to_column['name'];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, nameCol) === targetName) {
          return {
            name:        hot.getSourceDataAtCell(p, dh.slot_name_to_column['name']),
            title:       hot.getSourceDataAtCell(p, dh.slot_name_to_column['title']),
            description: hot.getSourceDataAtCell(p, dh.slot_name_to_column['description']),
          };
        }
      }
      return null;
    }, 'test_slot_create');

    expect(data, 'slot row not found in source data').not.toBeNull();
    expect(data.name,        'name should be saved'       ).toBe('test_slot_create');
    expect(data.title,       'title should be saved'      ).toBe('Create Test Title');
    expect(data.description, 'description should be saved').toBe('Created by test');
  });

  test('Update: title and description', async ({ page }) => {
    const rowIdx = await addSlotRow(
      page, 'test_slot_update', 'Original Title', 'Original description'
    );

    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.Slot;
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
      const dh = window._appContext.dhs.Slot;
      return {
        title:       dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['title']),
        description: dh.hot.getSourceDataAtCell(row, dh.slot_name_to_column['description']),
      };
    }, [rowIdx]);

    expect(data.title,       'title should be updated'      ).toBe('Updated Title');
    expect(data.description, 'description should be updated').toBe('Updated description');
  });

  test('Delete: remove row via right-click context menu', async ({ page }) => {
    const rowIdx = await addSlotRow(
      page, 'test_slot_delete', 'Delete Me', 'Will be deleted'
    );

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.Slot.hot.countRows()
    );

    // Right-click on the title column (non-frozen, in ht_master).
    // Multiple .htContextMenu elements exist in the DOM (one per HOT instance);
    // filter by text so we target the populated, visible one.
    const titleColIdx = await dhColIndex(page, 'Slot', 'title');
    await hotCellLocator(page, rowIdx, titleColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    // The Slot DH's remove_row callback calls removeSelectedFieldsWithConfirmation(),
    // which shows a dhChoose() modal with a dynamically-inserted "Delete" button
    // (class btn btn-primary, text "Delete").  Wait for and click it.
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 3_000 });
    await page.locator('#dh-dialog-modal button').filter({ hasText: /^Delete$/ }).first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.Slot.hot.countRows()
    );
    expect(countAfter, 'row count should decrease by 1').toBe(countBefore - 1);

    const names = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Slot;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: dh.hot.countRows() }, (_, r) =>
        dh.hot.getSourceDataAtCell(r, col)
      );
    });
    expect(names, 'deleted slot name should not appear').not.toContain('test_slot_delete');
  });
});

// ── 3. ClassSlot CRUD ─────────────────────────────────────────────────────────

test.describe('ClassSlot CRUD (Schema Editor)', () => {

  test.beforeEach(async ({ page }) => {
    await setupSchemaEditor(page);
    await seedSchemaRow(page);  // creates Schema row & selects it; still on Schema tab
    await goToClassTab(page);   // navigate to Class tab so we can create + select a Class
  });

  /**
   * Add a Class row named `className` and click it to select it in the Class DH.
   * Schema row is already seeded + selected by beforeEach, so addRows() can
   * resolve the schema_id FK.  Returns the Class row index.
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

    // Click the Class row to establish the class_id FK selection for ClassSlot.addRows()
    await hotCellLocator(page, rowIdx, 0).click();
    await page.waitForTimeout(300);

    return rowIdx;
  }

  /**
   * Wait for `className` to appear in the class-filter <select> inside
   * #slot-lower-panel, then select it.  This filters the ClassSlot lower panel
   * to show only ClassSlots for that class (row count starts at 0 for a new
   * class), avoiding HOT virtualization issues with large schemas.
   *
   * Requires goToSlotTab() to have been called first so the lower panel and its
   * dropdown exist in the DOM.
   */
  async function filterByClass(page, className) {
    // .slot-class-filter is a wrapper <div> created by _ensureSlotClassDropdown();
    // the actual <select> is a child element.  Target it explicitly.
    await page.waitForFunction(
      (name) => {
        const sel = document.querySelector('#slot-lower-panel .slot-class-filter select');
        if (!sel) return false;
        return Array.from(sel.options).some(o => o.value === name);
      },
      className,
      { timeout: 5_000 }
    );
    await page.locator('#slot-lower-panel .slot-class-filter select').selectOption(className);
    await page.waitForTimeout(200);
  }

  /**
   * Insert one ClassSlot row for the currently-selected Schema and Class.
   *
   * ClassSlot's addRows() is overridden by initSlotTab (called at SchemaEditor
   * line ~2738) to open the Field Key Modal instead of inserting a row, so we
   * bypass it entirely.  We read schema_id / class_id from the parent DH
   * selections, build a fully-populated row array, append it via hot.loadData,
   * then re-apply the class filter so only this class's rows are visible.
   *
   * Returns the visual row index of the new row (0-based within the filtered view).
   */
  async function addClassSlotRow(page, name) {
    const newVisRow = await page.evaluate((name) => {
      const dh       = window._appContext.dhs.ClassSlot;
      const hot      = dh.hot;
      const schemaDh = window._appContext.dhs.Schema;
      const classDh  = window._appContext.dhs.Class;
      // window._appContext IS the AppContext instance (exposed by web/index.js).
      const appCtx   = window._appContext;

      // Resolve schema_id from the Schema DH's current selection.
      let schemaId = null;
      const schemaSel = schemaDh?.hot?.getSelectedLast?.();
      if (schemaSel) {
        const p = schemaDh.hot.toPhysicalRow(schemaSel[0]);
        schemaId = schemaDh.hot.getSourceDataAtCell(p, schemaDh.slot_name_to_column['name']);
      }

      // Resolve class_id from the Class DH's current selection.
      let classId = null;
      const classSel = classDh?.hot?.getSelectedLast?.();
      if (classSel) {
        const p = classDh.hot.toPhysicalRow(classSel[0]);
        classId = classDh.hot.getSourceDataAtCell(p, classDh.slot_name_to_column['name']);
      }
      if (!classId) return -1;

      // Build a new row: array of nulls the same length as existing source rows.
      const existing = hot.getSourceData();
      const rowLen   = existing.length > 0 ? existing[0].length : (dh.slots?.length ?? 50);
      const newRow   = new Array(rowLen).fill(null);
      newRow[dh.slot_name_to_column['schema_id']] = schemaId;
      newRow[dh.slot_name_to_column['class_id']]  = classId;
      newRow[dh.slot_name_to_column['name']]       = name;
      newRow[dh.slot_name_to_column['slot_type']]  = 'attribute';

      // Append to source data (loadData source = 'loadData', skipped by hooks).
      hot.loadData([...existing, newRow]);

      // Re-apply the class filter to show only rows for classId.
      appCtx.tabFilter(dh, { class_id: classId });

      // After loadData+tabFilter the new row is the last visible row.
      const nameCol = dh.slot_name_to_column['name'];
      for (let v = hot.countRows() - 1; v >= 0; v--) {
        const p = hot.toPhysicalRow(v);
        if (hot.getSourceDataAtCell(p, nameCol) === name) return v;
      }
      return hot.countRows() - 1; // fallback
    }, name);
    await page.waitForTimeout(300);
    return newVisRow;
  }

  /**
   * Collect all ClassSlot name values currently visible in the ClassSlot DH
   * (respects any active class filter).
   * getSourceDataAtCell() takes a PHYSICAL row; convert each visual row first.
   */
  async function getAllCsNames(page) {
    return page.evaluate(() => {
      const dh  = window._appContext.dhs.ClassSlot;
      const hot = dh.hot;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: hot.countRows() }, (_, v) => {
        const physRow = hot.toPhysicalRow(v);
        return hot.getSourceDataAtCell(physRow, col);
      });
    });
  }

  test('Create: name and description with auto-populated FKs', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassCsCreate');
    await goToSlotTab(page);
    await filterByClass(page, 'TestClassCsCreate');

    // addClassSlotRow() takes the name, populates all FKs, and returns the
    // visual row index — no separate setDataAtCell needed.
    await addClassSlotRow(page, 'test_cs_create');

    // Verify by scanning PHYSICAL source rows — getSourceDataAtCell() takes a
    // physical row index, not a visual row index.
    const data = await page.evaluate((targetName) => {
      const dh      = window._appContext.dhs.ClassSlot;
      const hot     = dh.hot;
      const nameCol = dh.slot_name_to_column['name'];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, nameCol) === targetName) {
          return {
            name:      hot.getSourceDataAtCell(p, dh.slot_name_to_column['name']),
            schema_id: hot.getSourceDataAtCell(p, dh.slot_name_to_column['schema_id']),
            class_id:  hot.getSourceDataAtCell(p, dh.slot_name_to_column['class_id']),
          };
        }
      }
      return null;
    }, 'test_cs_create');

    expect(data, 'ClassSlot row not found in source data').not.toBeNull();
    expect(data.name,      'ClassSlot name should be saved'       ).toBe('test_cs_create');
    expect(data.schema_id, 'schema_id FK should be auto-populated').toBeTruthy();
    expect(data.class_id,  'class_id FK should be auto-populated' ).toBeTruthy();
  });

  test('Update: title and description', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassCsUpdate');
    await goToSlotTab(page);
    await filterByClass(page, 'TestClassCsUpdate');

    // addClassSlotRow() sets name, schema_id, class_id, and slot_type in one go.
    const csRowIdx = await addClassSlotRow(page, 'test_cs_original');

    // Update title and description (not KEY_COLUMNs — no 'cascade_confirm' needed).
    await page.evaluate(([row]) => {
      const dh = window._appContext.dhs.ClassSlot;
      for (const [slot, value] of [
        ['title',       'Updated ClassSlot Title'],
        ['description', 'Updated ClassSlot description'],
      ]) {
        const physCol = dh.slot_name_to_column[slot];
        if (physCol === undefined) continue;
        const visCol = dh.hot.toVisualColumn(physCol);
        if (visCol >= 0) dh.hot.setDataAtCell(row, visCol, value);
      }
    }, [csRowIdx]);
    await page.waitForTimeout(200);

    // getSourceDataAtCell() takes a PHYSICAL row index — convert visual→physical first.
    const data = await page.evaluate(([row]) => {
      const dh      = window._appContext.dhs.ClassSlot;
      const physRow = dh.hot.toPhysicalRow(row);
      return {
        title:       dh.hot.getSourceDataAtCell(physRow, dh.slot_name_to_column['title']),
        description: dh.hot.getSourceDataAtCell(physRow, dh.slot_name_to_column['description']),
      };
    }, [csRowIdx]);

    expect(data.title,       'title should be updated'      ).toBe('Updated ClassSlot Title');
    expect(data.description, 'description should be updated').toBe('Updated ClassSlot description');
  });

  test('Delete: remove ClassSlot row via right-click context menu', async ({ page }) => {
    await createAndSelectClass(page, 'TestClassCsDelete');
    await goToSlotTab(page);
    await filterByClass(page, 'TestClassCsDelete');

    const csRowIdx = await addClassSlotRow(page, 'test_cs_delete');

    const countBefore = await page.evaluate(
      () => window._appContext.dhs.ClassSlot.hot.countRows()
    );

    // Right-click on the description column in the lower-panel HOT.
    // classSlotCellLocator scopes to #slot-lower-panel .ht_master.
    // Multiple .htContextMenu elements exist (one per HOT instance); filter by
    // text to target the populated, visible one.
    const descColIdx = await dhColIndex(page, 'ClassSlot', 'description');
    await classSlotCellLocator(page, csRowIdx, descColIdx).click({ button: 'right' });
    const removeRowItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeRowItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeRowItem.first().click();
    // ClassSlot DH's remove_row callback (set by initSlotTab) calls
    // removeSelectedFieldsWithConfirmation(), which shows a dhChoose() modal
    // with a dynamically-inserted "Delete" button (class btn btn-primary).
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 3_000 });
    await page.locator('#dh-dialog-modal button').filter({ hasText: /^Delete$/ }).first().click();
    await page.waitForTimeout(300);

    const countAfter = await page.evaluate(
      () => window._appContext.dhs.ClassSlot.hot.countRows()
    );
    expect(countAfter, 'ClassSlot row count should decrease by 1').toBe(countBefore - 1);

    const names = await getAllCsNames(page);
    expect(names, 'deleted ClassSlot name should not appear').not.toContain('test_cs_delete');
  });

  test('Cascade delete: single ClassSlot then Class removes remaining ClassSlots', async ({ page }) => {
    // ── 1. Create parent Class ──────────────────────────────────────────────
    const classRowIdx = await createAndSelectClass(page, 'TestClassCsCascade');

    // ── 2. Navigate to Slot tab; filter by this class; add 3 ClassSlots ─────
    // addClassSlotRow() sets name, schema_id, class_id, slot_type for each row.
    await goToSlotTab(page);
    await filterByClass(page, 'TestClassCsCascade');

    const cs1Idx = await addClassSlotRow(page, 'cs_alpha');  // visual row 0
    const cs2Idx = await addClassSlotRow(page, 'cs_beta');   // visual row 1
    const cs3Idx = await addClassSlotRow(page, 'cs_gamma');  // visual row 2

    // ── 3. Verify all three ClassSlots are present ──────────────────────────
    const namesAfterCreate = await getAllCsNames(page);
    expect(namesAfterCreate, 'cs_alpha should exist after create').toContain('cs_alpha');
    expect(namesAfterCreate, 'cs_beta should exist after create' ).toContain('cs_beta');
    expect(namesAfterCreate, 'cs_gamma should exist after create').toContain('cs_gamma');

    // ── 4. Delete cs_beta (visual row 1) via right-click ────────────────────
    const descColIdx = await dhColIndex(page, 'ClassSlot', 'description');
    await classSlotCellLocator(page, cs2Idx, descColIdx).click({ button: 'right' });
    const removeCsItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeCsItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeCsItem.first().click();
    // ClassSlot DH uses removeSelectedFieldsWithConfirmation() — click "Delete".
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 3_000 });
    await page.locator('#dh-dialog-modal button').filter({ hasText: /^Delete$/ }).first().click();
    await page.waitForTimeout(300);

    // ── 5. Verify cs_beta gone; cs_alpha and cs_gamma remain ─────────────────
    const namesAfterCsDelete = await getAllCsNames(page);
    expect(namesAfterCsDelete, 'cs_alpha should remain after cs_beta deletion').toContain('cs_alpha');
    expect(namesAfterCsDelete, 'cs_beta should be gone after deletion'        ).not.toContain('cs_beta');
    expect(namesAfterCsDelete, 'cs_gamma should remain after cs_beta deletion').toContain('cs_gamma');

    // ── 6. Navigate to Class tab; delete Class row (triggers cascade-confirm) ─
    // ClassSlot has a class_id FK → Class, so deleting a Class with ClassSlot
    // children triggers the cascade-confirm dialog.
    await goToClassTab(page);
    const classTitleColIdx = await dhColIndex(page, 'Class', 'title');
    await hotCellLocator(page, classRowIdx, classTitleColIdx).click({ button: 'right' });
    const removeClassItem = page.locator('.htContextMenu td').filter({ hasText: /Remove row/ });
    await removeClassItem.first().waitFor({ state: 'visible', timeout: 3_000 });
    await removeClassItem.first().click();

    // ── 7. Confirm the cascade-delete dialog ────────────────────────────────
    // Class DH uses removeSelectedRows() → dhConfirm(..., { dangerous: true })
    // which renders the OK button as btn-danger (not btn-primary).
    await page.locator('#dh-dialog-modal').first().waitFor({ state: 'visible', timeout: 5_000 });
    await page.locator('#dh-dialog-modal .btn-danger').first().click();
    await page.waitForTimeout(500);

    // ── 8. Verify Class row is gone from the Class DH ────────────────────────
    // getSourceDataAtCell() takes a physical row; convert visual→physical first.
    const classNames = await page.evaluate(() => {
      const dh  = window._appContext.dhs.Class;
      const hot = dh.hot;
      const col = dh.slot_name_to_column['name'];
      return Array.from({ length: hot.countRows() }, (_, v) => {
        const physRow = hot.toPhysicalRow(v);
        return hot.getSourceDataAtCell(physRow, col);
      });
    });
    expect(classNames, 'deleted Class should not appear in Class DH').not.toContain('TestClassCsCascade');

    // ── 9. Verify remaining ClassSlots (cs_alpha and cs_gamma) were cascade-deleted ─
    // getAllCsNames() reads from ClassSlot DH regardless of which tab is active.
    const namesAfterClassDelete = await getAllCsNames(page);
    expect(namesAfterClassDelete, 'cs_alpha should be cascade-deleted with Class').not.toContain('cs_alpha');
    expect(namesAfterClassDelete, 'cs_gamma should be cascade-deleted with Class').not.toContain('cs_gamma');
  });
});
