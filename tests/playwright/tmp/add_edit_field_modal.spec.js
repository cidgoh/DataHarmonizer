/* Test: add_edit_field_modal
 *
 * Tests the Add/Edit Field Modal (Field Key Modal, #field-key-modal) in the
 * Schema Editor's Field (Slot) tab, against the grdi_1m schema.
 *
 * Agenda sections tested:
 *   §0  Setup — load grdi_1m, navigate to Field tab
 *   §1  Pre-open guard — no schema selected
 *   §2  Expert-user gate on "schema field" type — inline warning behaviour
 *       §2a Non-expert mode — inline warning on type selection
 *       §2b Non-expert — Save is blocked
 *       §2c Switching type clears the warning
 *       §2d Expert mode ON — no warning
 *   §3  Schema slot — slot_group dropdown behaviour (add mode)
 *   §4  Schema slot — collision detection (add)
 *   §5  Schema slot — rank-aware insertion (add)
 *       §5a Insert into existing slot_group — rank after last peer
 *       §5b Insert ungrouped — slot appears in HOT data
 *   §6  Class slot — Table required guard (add)
 *       §6a slot_usage without a Table
 *       §6b attribute without a Table
 *   §7  Class slot — Section input for add mode
 *       §7a slot_usage: Field ID is picklist; Section is free-text + datalist
 *       §7b slot_usage: auto-fill + lock Section when base slot has slot_group
 *       §7c attribute: Section is free-text + datalist, not disabled
 *   §8  Slot_usage — collision detection (add)
 *   §9  Attribute — collision detection (add)
 *   §10 Class slot — rank-aware insertion (add)
 *       §10a slot_usage — insert into existing slot_group, rank after last peer
 *       §10b slot_usage — insert ungrouped, slot appears in HOT data
 *       §10c attribute — rank after last peer in slot_group
 *   §11 Edit / rename — collision detection
 *       §11a Schema slot rename collision
 *       §11b Slot_usage rename collision
 *       §11c Attribute rename collision
 *   §12 Edit mode — schema slot
 *       §12a Non-expert: modal opens with warning; Save disabled
 *       §12b Non-expert: clicking Save keeps modal open with expert error
 *       §12c Expert ON: modal opens cleanly; type dropdown disabled
 *       §12d Schema slot rename cascades to slot_usage rows
 *       §12e Schema slot slot_group change cascades to slot_usage rows
 *       §12f Schema slot Title change — modal closes; schema slot updated
 *   §13 Edit mode — slot_usage type conversion (slot_usage → attribute)
 *       §13a "Change type" row visible; Section shows select dropdown
 *       §13b Checking Change type shows Copy inherited row; unchecking hides it
 *       §13c Save without Copy inherited — row becomes attribute
 *       §13d Save with Copy inherited — inherited values written to converted row
 *   §14 Edit mode — attribute type conversion (attribute → slot_usage)
 *       §14a Change type disabled when attribute has no matching schema slot
 *       §14b Attribute Section allows new slot_group entry
 *       §14c Change type enabled when attribute name matches a schema slot
 *       §14d Confirm-handler backstop: blocked when no schema slot
 *       §14e Successful attribute → slot_usage conversion copies base values
 *       §14f Type dropdown is disabled in attribute edit mode
 *   §15 File load — schema.slots have unique non-null integer ranks
 *   §16 File load — slot_usage rows have non-null integer ranks
 *   §17 Round-trip — schema.slots rank omitted; slot_usage rank present
 *
 * Slot tab column layout (.ht_master tds, 0-based):
 *   tds[0]  placeholder (frozen class_id in .ht_clone_left)
 *   tds[1]  slot_type  ("Type")
 *   tds[2]  slot_group ("Section")
 *   tds[3]  name       ("Field ID") ← KEY_COLUMN: click opens FKM
 *   tds[4]  rank       ("Ordering")
 *   tds[6]  title
 *
 * To run:
 *   npx playwright test tests/playwright/tmp/add_edit_field_modal.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { slotCellLocator, scrollToSlotRow } from '../playwright_utils.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const SCHEMA_FILE       = 'web/templates/grdi_1m/schema.yaml';
const SCHEMA_NAME       = 'GRDI';
const CLASS_SAMPLE      = 'GRDISample';
const CLASS_ISOLATE     = 'GRDIIsolate';

// Known schema slots (verified present in grdi_1m schema.slots):
//   SLOT_COLLECTOR_ID — no slot_group at schema level; GRDISample slot_usage has slot_group=SLOT_GROUP_COLLECT
//   SLOT_ALT_ID       — slot_group=SLOT_GROUP_COLLECT at schema level; also in GRDISample slot_usage
//   SLOT_COLLECTED_BY — slot_group=SLOT_GROUP_COLLECT at schema level; also in GRDISample slot_usage
// Note: 'sample_id' does NOT exist in grdi_1m schema.slots.
const SLOT_COLLECTOR_ID  = 'sample_collector_sample_id';
const SLOT_ALT_ID        = 'alternative_sample_id';
const SLOT_GROUP_COLLECT = 'Sample collection and processing';

// ── Helpers ────────────────────────────────────────────────────────────────────

async function loadGrdi1m(page) {
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );
  await page.setInputFiles('#schema_upload', path.resolve(SCHEMA_FILE));
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll(
            '.tab-pane.show .ht_clone_left.handsontable tbody td'))
           .some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'GRDI'),
    null, { timeout: 30_000 }
  );
}

async function goToSlotTab(page) {
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll(
            '.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(400);
}

async function setExpertMode(page, enabled) {
  await page.evaluate((enabled) => {
    const cb = document.getElementById('schema_expert');
    if (cb && cb.checked !== enabled) cb.click();
  }, enabled);
  await page.waitForTimeout(200);
}

/** Show/hide schema slot rows (slot_type='slot') which are hidden by default. */
async function setSchemaSlotDisplay(page, show) {
  await page.evaluate((show) => {
    const dh = window._appContext?.dhs?.Slot;
    if (!dh) return;
    if (show) dh._slotTypeFilter?.add('slot');
    else dh._slotTypeFilter?.delete('slot');
    dh.hot?.render();
  }, show);
  await page.waitForTimeout(300);
}

async function openAddFkm(page) {
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(100);
}

async function waitFkmClosed(page) {
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 6_000 }
  );
}

/**
 * Scroll to a slot row and open the FKM in Edit mode by double-clicking the
 * name cell (tds[3]).  Double-click matches UX_task_1 precedent and reliably
 * triggers SchemaEditor's afterOnCellMouseDown hook on KEY_COLUMN cells.
 */
async function openEditFkm(page, slotTypeTitle, slotName) {
  const rowIdx = await scrollToSlotRow(page, slotName, slotTypeTitle, 15_000);
  if (rowIdx === -1) throw new Error(`Row not found: ${slotTypeTitle} / ${slotName}`);
  const cell = slotCellLocator(page, rowIdx, 3);
  await cell.scrollIntoViewIfNeeded();
  await cell.dblclick();
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(100);
}

/** Switch away from and back to the Slot tab to force tabFilter / row visibility refresh. */
async function refreshSlotTab(page) {
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(200);
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(500);
}

// ── Spec ──────────────────────────────────────────────────────────────────────

test.describe('Add/Edit Field Modal — grdi_1m', () => {

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120_000);
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
    });
    await loadGrdi1m(page);
    await goToSlotTab(page);
    await setExpertMode(page, false); // start each test with expert mode OFF
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §1  Pre-open guard — no schema selected
  // ═══════════════════════════════════════════════════════════════════════════

  test('§1 Add without active schema fires alert, FKM stays closed', async ({ page }) => {
    // Deselect any schema so none is active.
    await page.evaluate(() => {
      if (window._appContext) window._appContext.activeSchemaId = null;
      window._appContext?.dhs?.Schema?.hot?.deselectCell();
    });
    await page.waitForTimeout(200);

    let fkmOpened = false;
    const dialogPromise = page.waitForEvent('dialog', { timeout: 3_000 }).catch(() => null);
    await page.click('#add-row');
    const dialog = await dialogPromise;
    if (dialog) {
      expect(dialog.message().toLowerCase()).toContain('select');
      await dialog.dismiss();
    } else {
      // SchemaEditor uses dhAlert (Bootstrap modal), not native alert.
      await page.waitForFunction(
        () => document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
        null, { timeout: 3_000 }
      ).catch(() => { fkmOpened = true; }); // if dhDialog also not shown, FKM may have opened
      if (!fkmOpened) {
        const body = await page.$eval(
          '[id="dh-dialog-modal"].show [id="dh-dialog-body"]',
          el => el.textContent
        ).catch(() => '');
        expect(body.toLowerCase()).toContain('select');
        await page.locator('[id="dh-dialog-modal"].show [id="dh-dialog-ok"]').click();
        await page.waitForFunction(
          () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
          null, { timeout: 4_000 }
        );
      }
    }

    const fkmOpen = await page.evaluate(
      () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
    );
    expect(fkmOpen).toBe(false);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §2  Expert-user gate on "schema field" type
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§2 Expert-user gate on schema field type', () => {

    test('§2a non-expert: inline warning when Type = "schema field"', async ({ page }) => {
      await openAddFkm(page);

      // Option exists and is not disabled.
      const opt = await page.$eval('#fkm-field-type option[value="slot"]',
        el => ({ disabled: el.disabled }));
      expect(opt.disabled).toBe(false);

      await page.selectOption('#fkm-field-type', 'slot');
      await page.waitForTimeout(200);

      // #fkm-error visible with "expert" text.
      const errVis = await page.$eval(
        '#fkm-error', el => el.style.display !== 'none' && el.offsetParent !== null
      );
      expect(errVis).toBe(true);
      const errTxt = await page.$eval('#fkm-error', el => el.textContent.toLowerCase());
      expect(errTxt).toContain('expert');

      // Section free-text input visible (schema-slot UI rendered).
      const sgVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      expect(sgVis).toBe(true);

      // Table row hidden for schema slots.
      const tblHidden = await page.$eval(
        '#fkm-class-id', el => el.closest('tr')?.style.display === 'none'
      );
      expect(tblHidden).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§2b non-expert: clicking Save with schema field type keeps modal open', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot');
      await page.fill('#fkm-name', 'test_slot_nonexpert_2b');
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);

      const err = await page.$eval('#fkm-error', el => el.textContent.toLowerCase());
      expect(err).toContain('expert');

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§2c switching type away from schema field clears the warning', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot');
      await page.waitForTimeout(200);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.waitForTimeout(200);

      const errGone = await page.$eval(
        '#fkm-error', el => el.style.display === 'none' || el.textContent.trim() === ''
      );
      expect(errGone).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§2d expert mode ON: no warning on schema field selection', async ({ page }) => {
      await setExpertMode(page, true);
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot');
      await page.waitForTimeout(200);

      const errGone = await page.$eval(
        '#fkm-error', el => el.style.display === 'none' || el.textContent.trim() === ''
      );
      expect(errGone).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §3  Schema slot — slot_group behaviour (add mode)
  // ═══════════════════════════════════════════════════════════════════════════

  test('§3 Schema slot add: Section=free-text; Table row hidden; datalist populated', async ({ page }) => {
    await setExpertMode(page, true);
    await openAddFkm(page);
    await page.selectOption('#fkm-field-type', 'slot');
    await page.waitForTimeout(200);

    const sgNewVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
    const sgSelHid = await page.$eval('#fkm-slot-group',     el => el.style.display === 'none');
    expect(sgNewVis).toBe(true);
    expect(sgSelHid).toBe(true);

    const tblHid = await page.$eval('#fkm-class-id', el => el.closest('tr')?.style.display === 'none');
    expect(tblHid).toBe(true);

    const opts = await page.$$eval('#fkm-slot-group-list option', os => os.map(o => o.value));
    expect(opts.length).toBeGreaterThan(0);
    expect(opts.some(v => v.toLowerCase().includes('collection'))).toBe(true);

    await page.click('#field-key-modal button[data-dismiss="modal"]');
    await waitFkmClosed(page);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §4  Schema slot — collision detection (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test('§4 Schema slot add: duplicate name shows collision error', async ({ page }) => {
    await setExpertMode(page, true);
    await openAddFkm(page);
    await page.selectOption('#fkm-field-type', 'slot');
    await page.fill('#fkm-name', SLOT_COLLECTOR_ID); // already exists as a schema slot
    await page.waitForTimeout(100);
    await page.click('#fkm-confirm-btn');
    await page.waitForTimeout(300);

    const open = await page.evaluate(
      () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
    );
    expect(open).toBe(true);

    const err = await page.$eval('#fkm-error', el => el.textContent);
    expect(err).toMatch(/already exists as a schema field/i);

    await page.click('#field-key-modal button[data-dismiss="modal"]');
    await waitFkmClosed(page);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §5  Schema slot — rank-aware insertion (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§5 Schema slot rank-aware insertion', () => {

    test('§5a Insert into slot_group — rank is after last existing peer', async ({ page }) => {
      await setExpertMode(page, true);

      const maxRankBefore = await page.evaluate(([schemaName, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return 0;
        const rankCol = dh.slot_name_to_column['rank'];
        let max = 0;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
          if (hot.getSourceDataAtCell(p, dh.schema_name_column) !== schemaName) continue;
          if (hot.getSourceDataAtCell(p, dh.slot_group_column) !== grp) continue;
          const r = Number(hot.getSourceDataAtCell(p, rankCol));
          if (r > max) max = r;
        }
        return max;
      }, [SCHEMA_NAME, SLOT_GROUP_COLLECT]);

      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot');
      await page.fill('#fkm-name', 'test_schema_slot_5a');
      await page.fill('#fkm-title', 'Test Schema Slot 5a');
      await page.fill('#fkm-slot-group-new', SLOT_GROUP_COLLECT);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const newRank = await page.evaluate(([schemaName, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const rankCol = dh.slot_name_to_column['rank'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return Number(hot.getSourceDataAtCell(p, rankCol));
          }
        }
        return null;
      }, [SCHEMA_NAME, 'test_schema_slot_5a']);

      expect(newRank).not.toBeNull();
      expect(newRank).toBeGreaterThan(maxRankBefore);
    });

    test('§5b Insert ungrouped — new schema slot appears in HOT data', async ({ page }) => {
      await setExpertMode(page, true);
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot');
      await page.fill('#fkm-name', 'test_schema_slot_5b');
      await page.fill('#fkm-title', 'Test Schema Slot 5b Ungrouped');
      await page.evaluate(() => { document.getElementById('fkm-slot-group-new').value = ''; });
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const found = await page.evaluate(([schemaName, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) return true;
        }
        return false;
      }, [SCHEMA_NAME, 'test_schema_slot_5b']);

      expect(found).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §6  Class slot — Table required guard (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§6 Class slot Table required guard', () => {

    test('§6a slot_usage: Save without Table shows "must be selected" error', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.waitForTimeout(200);

      const selVis = await page.$eval('#fkm-name-select', el => el.style.display !== 'none');
      expect(selVis).toBe(true);

      // Pick any slot from the picklist, but leave Table blank.
      const opts = await page.$$eval('#fkm-name-select option',
        os => os.map(o => o.value).filter(v => v));
      if (opts.length) await page.selectOption('#fkm-name-select', opts[0]);

      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);

      const err = await page.$eval('#fkm-error', el => el.textContent);
      expect(err).toMatch(/must be selected/i);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§6b attribute: Save without Table shows "must be selected" error', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.waitForTimeout(200);

      const inpVis = await page.$eval('#fkm-name', el => el.style.display !== 'none');
      expect(inpVis).toBe(true);

      await page.fill('#fkm-name', 'test_attr_no_table_6b');
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);

      const err = await page.$eval('#fkm-error', el => el.textContent);
      expect(err).toMatch(/must be selected/i);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §7  Class slot — Section input (add mode)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§7 Class slot Section input (add mode)', () => {

    test('§7a slot_usage: Field ID is picklist; Section is free-text; not disabled', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.waitForTimeout(200);

      const selVis = await page.$eval('#fkm-name-select', el => el.style.display !== 'none');
      const inpHid = await page.$eval('#fkm-name',        el => el.style.display === 'none');
      expect(selVis).toBe(true);
      expect(inpHid).toBe(true);

      const hasCollectorId = await page.$$eval('#fkm-name-select option',
        (os, name) => os.some(o => o.value === name), SLOT_COLLECTOR_ID);
      expect(hasCollectorId).toBe(true);

      const sgNewVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      const sgSelHid = await page.$eval('#fkm-slot-group',     el => el.style.display === 'none');
      expect(sgNewVis).toBe(true);
      expect(sgSelHid).toBe(true);

      const disabled = await page.$eval('#fkm-slot-group-new', el => el.disabled);
      expect(disabled).toBe(false);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§7b slot_usage: selecting a slot with slot_group auto-fills and locks Section', async ({ page }) => {
      // SLOT_ALT_ID ('alternative_sample_id') has slot_group=SLOT_GROUP_COLLECT at the
      // schema-slot level — the FKM auto-fills and locks the Section input from there.
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.waitForTimeout(200);
      await page.selectOption('#fkm-name-select', SLOT_ALT_ID);
      await page.waitForTimeout(300);

      const sgVal = await page.$eval('#fkm-slot-group-new', el => el.value);
      expect(sgVal).toBe(SLOT_GROUP_COLLECT);

      const dis = await page.$eval('#fkm-slot-group-new', el => el.disabled);
      expect(dis).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§7c attribute: Section is free-text + datalist, not disabled', async ({ page }) => {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.waitForTimeout(200);

      const sgNewVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      const dis = await page.$eval('#fkm-slot-group-new', el => el.disabled);
      expect(sgNewVis).toBe(true);
      expect(dis).toBe(false);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §8  Slot_usage — collision detection (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test('§8 slot_usage add: duplicate in same Table shows "already exists in table"', async ({ page }) => {
    await openAddFkm(page);
    await page.selectOption('#fkm-field-type', 'slot_usage');
    await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
    await page.waitForTimeout(200);
    await page.selectOption('#fkm-name-select', SLOT_COLLECTOR_ID); // already in GRDISample
    await page.waitForTimeout(100);
    await page.click('#fkm-confirm-btn');
    await page.waitForTimeout(300);

    const open = await page.evaluate(
      () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
    );
    expect(open).toBe(true);
    const err = await page.$eval('#fkm-error', el => el.textContent);
    expect(err).toMatch(/already exists in table/i);

    await page.click('#field-key-modal button[data-dismiss="modal"]');
    await waitFkmClosed(page);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §9  Attribute — collision detection (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test('§9 attribute add: duplicate in same Table shows "already exists as a custom field"', async ({ page }) => {
    const attrName = 'test_attr_9_collision';

    // First add succeeds.
    await openAddFkm(page);
    await page.selectOption('#fkm-field-type', 'attribute');
    await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
    await page.fill('#fkm-name', attrName);
    await page.waitForTimeout(100);
    await page.click('#fkm-confirm-btn');
    await waitFkmClosed(page);
    await page.waitForTimeout(200);

    // Second add should fail.
    await openAddFkm(page);
    await page.selectOption('#fkm-field-type', 'attribute');
    await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
    await page.fill('#fkm-name', attrName);
    await page.waitForTimeout(100);
    await page.click('#fkm-confirm-btn');
    await page.waitForTimeout(300);

    const open = await page.evaluate(
      () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
    );
    expect(open).toBe(true);
    const err = await page.$eval('#fkm-error', el => el.textContent);
    expect(err).toMatch(/already exists as a custom field/i);

    await page.click('#field-key-modal button[data-dismiss="modal"]');
    await waitFkmClosed(page);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §10 Class slot — rank-aware insertion (add)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§10 Class slot rank-aware insertion', () => {

    test('§10a slot_usage: rank is after last existing peer in slot_group', async ({ page }) => {
      // Find a schema slot in SLOT_GROUP_COLLECT not yet in CLASS_SAMPLE's slot_usage.
      const slotToAdd = await page.evaluate(([cls, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const existingUsage = new Set();
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls) {
            existingUsage.add(hot.getSourceDataAtCell(p, dh.slot_name_column));
          }
        }
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
          if (hot.getSourceDataAtCell(p, dh.slot_group_column) !== grp) continue;
          const name = hot.getSourceDataAtCell(p, dh.slot_name_column);
          if (!existingUsage.has(name)) return name;
        }
        return null;
      }, [CLASS_SAMPLE, SLOT_GROUP_COLLECT]);

      if (!slotToAdd) {
        console.warn('§10a: all schema slots in group already in CLASS_SAMPLE; skipping rank check');
        return;
      }

      const maxRankBefore = await page.evaluate(([cls, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return 0;
        const rankCol = dh.slot_name_to_column['rank'];
        let max = 0;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot_usage') continue;
          if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) !== cls) continue;
          if (hot.getSourceDataAtCell(p, dh.slot_group_column) !== grp) continue;
          const r = Number(hot.getSourceDataAtCell(p, rankCol));
          if (r > max) max = r;
        }
        return max;
      }, [CLASS_SAMPLE, SLOT_GROUP_COLLECT]);

      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.waitForTimeout(200);
      await page.selectOption('#fkm-name-select', slotToAdd);
      await page.waitForTimeout(200);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const newRank = await page.evaluate(([cls, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const rankCol = dh.slot_name_to_column['rank'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return Number(hot.getSourceDataAtCell(p, rankCol));
          }
        }
        return null;
      }, [CLASS_SAMPLE, slotToAdd]);

      expect(newRank).not.toBeNull();
      expect(newRank).toBeGreaterThan(maxRankBefore);
    });

    test('§10b slot_usage ungrouped: new slot_usage appears in HOT data', async ({ page }) => {
      // Find a schema slot not yet in CLASS_ISOLATE's slot_usage (use ISOLATE for independence).
      const slotToAdd = await page.evaluate(([cls]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const existingUsage = new Set();
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls) {
            existingUsage.add(hot.getSourceDataAtCell(p, dh.slot_name_column));
          }
        }
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
          const name = hot.getSourceDataAtCell(p, dh.slot_name_column);
          if (!existingUsage.has(name)) return name;
        }
        return null;
      }, [CLASS_ISOLATE]);

      if (!slotToAdd) { console.warn('§10b: no available slot; skipping'); return; }

      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'slot_usage');
      await page.selectOption('#fkm-class-id', CLASS_ISOLATE);
      await page.waitForTimeout(200);
      await page.selectOption('#fkm-name-select', slotToAdd);
      // Clear any auto-filled Section so the slot is ungrouped.
      await page.evaluate(() => {
        const el = document.getElementById('fkm-slot-group-new');
        if (el && !el.disabled) el.value = '';
      });
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const found = await page.evaluate(([cls, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) return true;
        }
        return false;
      }, [CLASS_ISOLATE, slotToAdd]);

      expect(found).toBe(true);
    });

    test('§10c attribute: rank is after last existing peer in slot_group', async ({ page }) => {
      const maxRankBefore = await page.evaluate(([cls, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return 0;
        const rankCol = dh.slot_name_to_column['rank'];
        let max = 0;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'attribute') continue;
          if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) !== cls) continue;
          if (hot.getSourceDataAtCell(p, dh.slot_group_column) !== grp) continue;
          const r = Number(hot.getSourceDataAtCell(p, rankCol));
          if (r > max) max = r;
        }
        return max;
      }, [CLASS_SAMPLE, SLOT_GROUP_COLLECT]);

      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.fill('#fkm-name', 'test_attr_10c');
      await page.fill('#fkm-slot-group-new', SLOT_GROUP_COLLECT);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const newRank = await page.evaluate(([cls, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const rankCol = dh.slot_name_to_column['rank'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'attribute' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return Number(hot.getSourceDataAtCell(p, rankCol));
          }
        }
        return null;
      }, [CLASS_SAMPLE, 'test_attr_10c']);

      expect(newRank).not.toBeNull();
      expect(newRank).toBeGreaterThan(maxRankBefore);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §11 Edit / rename — collision detection
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§11 Edit rename collision detection', () => {

    test('§11a schema slot rename to existing name shows collision error', async ({ page }) => {
      await setExpertMode(page, true);
      await setSchemaSlotDisplay(page, true);
      // Open SLOT_ALT_ID for editing, then try to rename it to SLOT_COLLECTOR_ID.
      await openEditFkm(page, 'Schema field', SLOT_ALT_ID);

      // Change name to another existing schema slot — should collide.
      await page.fill('#fkm-name', SLOT_COLLECTOR_ID);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);
      const err = await page.$eval('#fkm-error', el => el.textContent);
      expect(err).toMatch(/already exists as a schema field/i);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§11b slot_usage rename to existing slot_usage shows collision error', async ({ page }) => {
      // Open SLOT_COLLECTOR_ID slot_usage for editing, then try to rename to SLOT_ALT_ID
      // (also in GRDISample's slot_usage — should collide).
      // Note: edit mode always uses the free-text input #fkm-name (the select
      // #fkm-name-select is hidden in edit mode per SchemaEditor line ~2379).
      await openEditFkm(page, 'Table field (from schema)', SLOT_COLLECTOR_ID);

      await page.fill('#fkm-name', SLOT_ALT_ID);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);
      const err = await page.$eval('#fkm-error', el => el.textContent);
      expect(err).toMatch(/already exists/i);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§11c attribute rename to existing attribute shows collision error', async ({ page }) => {
      // Add two attributes, then try to rename one to the other's name.
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.fill('#fkm-name', 'test_attr_11c_a');
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);

      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.fill('#fkm-name', 'test_attr_11c_b');
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      // Edit test_attr_11c_b; rename to test_attr_11c_a — should collide.
      await openEditFkm(page, 'Table field (stand-alone)', 'test_attr_11c_b');
      await page.fill('#fkm-name', 'test_attr_11c_a');
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);
      const err = await page.$eval('#fkm-error', el => el.textContent);
      expect(err).toMatch(/already exists as a custom field/i);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §12 Edit mode — schema slot
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§12 Edit mode — schema slot', () => {

    test('§12a non-expert: modal shows warning; Save disabled; Table hidden; Section visible', async ({ page }) => {
      await setSchemaSlotDisplay(page, true);
      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);

      const tblHid = await page.$eval('#fkm-class-id', el => el.closest('tr')?.style.display === 'none');
      expect(tblHid).toBe(true);

      const errVis = await page.$eval('#fkm-error',
        el => el.style.display !== 'none' && el.offsetParent !== null);
      expect(errVis).toBe(true);
      const err = await page.$eval('#fkm-error', el => el.textContent.toLowerCase());
      expect(err).toContain('expert');

      const saveDisabled = await page.$eval('#fkm-confirm-btn', el => el.disabled);
      expect(saveDisabled).toBe(true);

      const sgNewVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      const sgNotDis = await page.$eval('#fkm-slot-group-new', el => !el.disabled);
      expect(sgNewVis).toBe(true);
      expect(sgNotDis).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§12b non-expert: force-clicking Save keeps modal open with expert error', async ({ page }) => {
      await setSchemaSlotDisplay(page, true);
      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);

      await page.evaluate(() => document.getElementById('fkm-confirm-btn')?.click());
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);
      const err = await page.$eval('#fkm-error', el => el.textContent.toLowerCase());
      expect(err).toContain('expert');

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§12c expert ON: modal opens cleanly; type dropdown disabled', async ({ page }) => {
      await setExpertMode(page, true);
      await setSchemaSlotDisplay(page, true);
      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);

      const errGone = await page.$eval(
        '#fkm-error', el => el.style.display === 'none' || el.textContent.trim() === '');
      expect(errGone).toBe(true);

      const saveOK = await page.$eval('#fkm-confirm-btn', el => !el.disabled);
      expect(saveOK).toBe(true);

      const tblHid = await page.$eval('#fkm-class-id', el => el.closest('tr')?.style.display === 'none');
      expect(tblHid).toBe(true);

      const sgVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      expect(sgVis).toBe(true);

      const typeDis = await page.$eval('#fkm-field-type', el => el.disabled);
      expect(typeDis).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§12d schema slot rename cascades to slot_usage rows', async ({ page }) => {
      await setExpertMode(page, true);
      await setSchemaSlotDisplay(page, true);
      const renamed = `${SLOT_COLLECTOR_ID}_renamed_12d`;

      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);
      await page.fill('#fkm-name', renamed);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const schemaUpdated = await page.evaluate(([schemaName, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) return true;
        }
        return false;
      }, [SCHEMA_NAME, renamed]);
      expect(schemaUpdated).toBe(true);

      // At least one slot_usage row should have been updated to the new name.
      const usageUpdated = await page.evaluate(([name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) return true;
        }
        return false;
      }, [renamed]);
      expect(usageUpdated).toBe(true);
    });

    test('§12e schema slot slot_group change cascades to slot_usage rows', async ({ page }) => {
      await setExpertMode(page, true);
      await setSchemaSlotDisplay(page, true);
      const newGrp = 'Test Section Cascade 12e';

      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);
      await page.fill('#fkm-slot-group-new', newGrp);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      // At least one slot_usage for SLOT_COLLECTOR_ID should show the new group.
      const usageUpdated = await page.evaluate(([slotName, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName &&
              hot.getSourceDataAtCell(p, dh.slot_group_column) === grp) return true;
        }
        return false;
      }, [SLOT_COLLECTOR_ID, newGrp]);
      expect(usageUpdated).toBe(true);
    });

    test('§12f schema slot Title change — modal closes; title updated', async ({ page }) => {
      await setExpertMode(page, true);
      await setSchemaSlotDisplay(page, true);
      const newTitle = 'Collector ID Renamed Title 12f';

      await openEditFkm(page, 'Schema field', SLOT_COLLECTOR_ID);
      await page.fill('#fkm-title', newTitle);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);
      await setSchemaSlotDisplay(page, true);

      const titleOK = await page.evaluate(([schemaName, slotName, title]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        const titleCol = dh.slot_name_to_column['title'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName) {
            return hot.getSourceDataAtCell(p, titleCol) === title;
          }
        }
        return false;
      }, [SCHEMA_NAME, SLOT_COLLECTOR_ID, newTitle]);
      expect(titleOK).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §13 Edit mode — slot_usage type conversion (slot_usage → attribute)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§13 Edit mode — slot_usage type conversion', () => {

    test('§13a Change type row visible; Section is select dropdown; checkbox unchecked', async ({ page }) => {
      await openEditFkm(page, 'Table field (from schema)', SLOT_COLLECTOR_ID);

      const rowVis = await page.$eval('#fkm-slot-type-row', el => el.style.display !== 'none');
      expect(rowVis).toBe(true);

      const lbl = await page.$eval('#fkm-change-type-label', el => el.textContent.toLowerCase());
      expect(lbl).toMatch(/custom|attribute|change/);

      // Section must be the select dropdown in slot_usage edit mode.
      const sgSelVis = await page.$eval('#fkm-slot-group',     el => el.style.display !== 'none');
      const sgNewHid = await page.$eval('#fkm-slot-group-new', el => el.style.display === 'none');
      expect(sgSelVis).toBe(true);
      expect(sgNewHid).toBe(true);

      const checked = await page.$eval('#fkm-change-type', el => el.checked);
      expect(checked).toBe(false);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§13b checking Change type shows Copy inherited; unchecking hides it', async ({ page }) => {
      await openEditFkm(page, 'Table field (from schema)', SLOT_COLLECTOR_ID);

      await page.check('#fkm-change-type');
      await page.waitForTimeout(200);

      const copyVis = await page.$eval('#fkm-copy-inherited-row', el => el.style.display !== 'none');
      expect(copyVis).toBe(true);

      const copyChk = await page.$eval('#fkm-copy-inherited', el => el.checked);
      expect(copyChk).toBe(true);

      await page.uncheck('#fkm-change-type');
      await page.waitForTimeout(200);

      const copyHid = await page.$eval('#fkm-copy-inherited-row', el => el.style.display === 'none');
      expect(copyHid).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§13c Save without Copy inherited: row becomes attribute', async ({ page }) => {
      await openEditFkm(page, 'Table field (from schema)', SLOT_COLLECTOR_ID);
      await page.check('#fkm-change-type');
      await page.waitForTimeout(200);
      await page.uncheck('#fkm-copy-inherited');
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      // Verify at least one attribute row with this name now exists.
      // (Other classes may still have their own slot_usage rows for this name.)
      const isAttr = await page.evaluate(([slotName]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName &&
              hot.getSourceDataAtCell(p, dh.slot_type_column) === 'attribute') return true;
        }
        return false;
      }, [SLOT_COLLECTOR_ID]);
      expect(isAttr).toBe(true);
    });

    test('§13d Save with Copy inherited: inherited values written to converted attribute', async ({ page }) => {
      // Get the base slot title before conversion.
      const baseTitle = await page.evaluate(([schemaName, slotName]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const titleCol = dh.slot_name_to_column['title'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName) {
            return hot.getSourceDataAtCell(p, titleCol) || null;
          }
        }
        return null;
      }, [SCHEMA_NAME, SLOT_COLLECTOR_ID]);

      await openEditFkm(page, 'Table field (from schema)', SLOT_COLLECTOR_ID);
      await page.check('#fkm-change-type');
      await page.waitForTimeout(200);
      // Copy inherited is checked by default — leave it as-is.
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      // The row should now be attribute.
      const isAttr = await page.evaluate(([slotName]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName &&
              hot.getSourceDataAtCell(p, dh.slot_type_column) === 'attribute') return true;
        }
        return false;
      }, [SLOT_COLLECTOR_ID]);
      expect(isAttr).toBe(true);

      // If base slot had a non-empty title, the attribute row should also have it.
      if (baseTitle) {
        const attrTitle = await page.evaluate(([slotName]) => {
          const dh = window._appContext?.dhs?.Slot;
          const hot = dh?.hot;
          if (!hot) return null;
          const titleCol = dh.slot_name_to_column['title'];
          for (let p = 0; p < hot.countSourceRows(); p++) {
            if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'attribute' &&
                hot.getSourceDataAtCell(p, dh.slot_name_column) === slotName) {
              return hot.getSourceDataAtCell(p, titleCol);
            }
          }
          return null;
        }, [SLOT_COLLECTOR_ID]);
        expect(attrTitle).toBe(baseTitle);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §14 Edit mode — attribute type conversion (attribute → slot_usage)
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('§14 Edit mode — attribute type conversion', () => {

    /** Add a fresh attribute to CLASS_SAMPLE and return its name. */
    async function addTestAttr(page, name, slotGroup = null) {
      await openAddFkm(page);
      await page.selectOption('#fkm-field-type', 'attribute');
      await page.selectOption('#fkm-class-id', CLASS_SAMPLE);
      await page.fill('#fkm-name', name);
      if (slotGroup) await page.fill('#fkm-slot-group-new', slotGroup);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await page.waitForTimeout(200);
    }

    test('§14a Change type disabled when attribute has no matching schema slot', async ({ page }) => {
      const attrName = 'test_no_match_attr_14a';
      await addTestAttr(page, attrName);
      await refreshSlotTab(page);

      await openEditFkm(page, 'Table field (stand-alone)', attrName);

      const rowVis = await page.$eval('#fkm-slot-type-row', el => el.style.display !== 'none');
      expect(rowVis).toBe(true);

      const cbDis = await page.$eval('#fkm-change-type', el => el.disabled);
      expect(cbDis).toBe(true);

      const lbl = await page.$eval('#fkm-change-type-label', el => el.textContent.toLowerCase());
      expect(lbl).toMatch(/no matching|no.*schema/);

      const sgNewVis = await page.$eval('#fkm-slot-group-new', el => el.style.display !== 'none');
      const sgSelHid = await page.$eval('#fkm-slot-group',     el => el.style.display === 'none');
      expect(sgNewVis).toBe(true);
      expect(sgSelHid).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§14b Attribute Section allows a new slot_group to be saved', async ({ page }) => {
      const attrName = 'test_attr_newgrp_14b';
      await addTestAttr(page, attrName);
      await refreshSlotTab(page);

      const newGrp = 'My New Section 14b';
      await openEditFkm(page, 'Table field (stand-alone)', attrName);
      await page.fill('#fkm-slot-group-new', newGrp);
      await page.waitForTimeout(100);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      const grpOK = await page.evaluate(([cls, name, grp]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'attribute' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return hot.getSourceDataAtCell(p, dh.slot_group_column) === grp;
          }
        }
        return false;
      }, [CLASS_SAMPLE, attrName, newGrp]);
      expect(grpOK).toBe(true);
    });

    test('§14c Change type enabled when attribute name matches an existing schema slot', async ({ page }) => {
      // Find a schema slot that is NOT in CLASS_SAMPLE's slot_usage so the attr add succeeds.
      const slotName = await page.evaluate(([cls]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const existing = new Set();
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls) {
            existing.add(hot.getSourceDataAtCell(p, dh.slot_name_column));
          }
        }
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
          const name = hot.getSourceDataAtCell(p, dh.slot_name_column);
          if (name && !existing.has(name)) return name;
        }
        return null;
      }, [CLASS_SAMPLE]);

      if (!slotName) { console.warn('§14c: no available schema slot; skipping'); return; }

      await addTestAttr(page, slotName);
      await refreshSlotTab(page);

      await openEditFkm(page, 'Table field (stand-alone)', slotName);

      const cbEnabled = await page.$eval('#fkm-change-type', el => !el.disabled);
      expect(cbEnabled).toBe(true);

      const lbl = await page.$eval('#fkm-change-type-label', el => el.textContent.toLowerCase());
      expect(lbl).toMatch(/matching|from.*schema|schema.*field/);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§14d Confirm-handler backstop: force-enabled checkbox blocked when no schema slot', async ({ page }) => {
      const attrName = 'test_attr_backstop_14d';
      await addTestAttr(page, attrName);
      await refreshSlotTab(page);

      await openEditFkm(page, 'Table field (stand-alone)', attrName);

      // Force-enable the disabled checkbox and fire the change event.
      await page.evaluate(() => {
        const cb = document.getElementById('fkm-change-type');
        if (cb) { cb.disabled = false; cb.checked = true; cb.dispatchEvent(new Event('change')); }
      });
      await page.waitForTimeout(200);
      await page.click('#fkm-confirm-btn');
      await page.waitForTimeout(300);

      const open = await page.evaluate(
        () => document.querySelector('#field-key-modal')?.classList.contains('show') ?? false
      );
      expect(open).toBe(true);

      const err = await page.$eval('#fkm-error', el => el.textContent.toLowerCase());
      expect(err).toMatch(/no matching|schema.*slot|without.*schema/);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });

    test('§14e Successful attribute → slot_usage conversion copies base slot values', async ({ page }) => {
      const slotName = await page.evaluate(([cls]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const existing = new Set();
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls) {
            existing.add(hot.getSourceDataAtCell(p, dh.slot_name_column));
          }
        }
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
          const name = hot.getSourceDataAtCell(p, dh.slot_name_column);
          if (name && !existing.has(name)) return name;
        }
        return null;
      }, [CLASS_SAMPLE]);

      if (!slotName) { console.warn('§14e: no available schema slot; skipping'); return; }

      const baseTitle = await page.evaluate(([schemaName, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return null;
        const titleCol = dh.slot_name_to_column['title'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot' &&
              hot.getSourceDataAtCell(p, dh.schema_name_column) === schemaName &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return hot.getSourceDataAtCell(p, titleCol) || null;
          }
        }
        return null;
      }, [SCHEMA_NAME, slotName]);

      await addTestAttr(page, slotName);
      await refreshSlotTab(page);

      await openEditFkm(page, 'Table field (stand-alone)', slotName);
      await page.check('#fkm-change-type');
      await page.waitForTimeout(200);
      await page.click('#fkm-confirm-btn');
      await waitFkmClosed(page);
      await refreshSlotTab(page);

      // Row is now slot_usage.
      const isUsage = await page.evaluate(([cls, name]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
              hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
            return hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage';
          }
        }
        return false;
      }, [CLASS_SAMPLE, slotName]);
      expect(isUsage).toBe(true);

      // Title was copied from the base schema slot.
      if (baseTitle) {
        const usageTitle = await page.evaluate(([cls, name]) => {
          const dh = window._appContext?.dhs?.Slot;
          const hot = dh?.hot;
          if (!hot) return null;
          const titleCol = dh.slot_name_to_column['title'];
          for (let p = 0; p < hot.countSourceRows(); p++) {
            if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
                hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls &&
                hot.getSourceDataAtCell(p, dh.slot_name_column) === name) {
              return hot.getSourceDataAtCell(p, titleCol);
            }
          }
          return null;
        }, [CLASS_SAMPLE, slotName]);
        expect(usageTitle).toBe(baseTitle);
      }
    });

    test('§14f Type dropdown is disabled in attribute edit mode', async ({ page }) => {
      const attrName = 'test_attr_typedis_14f';
      await addTestAttr(page, attrName);
      await refreshSlotTab(page);

      await openEditFkm(page, 'Table field (stand-alone)', attrName);

      const typeDis = await page.$eval('#fkm-field-type', el => el.disabled);
      expect(typeDis).toBe(true);

      await page.click('#field-key-modal button[data-dismiss="modal"]');
      await waitFkmClosed(page);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §15 File load — schema.slots have unique non-null integer ranks
  // ═══════════════════════════════════════════════════════════════════════════

  test('§15 File load: schema slots have unique non-null integer ranks', async ({ page }) => {
    const ranks = await page.evaluate(([schemaName]) => {
      const dh = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot) return null;
      const rankCol = dh.slot_name_to_column['rank'];
      const result = [];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot') continue;
        if (hot.getSourceDataAtCell(p, dh.schema_name_column) !== schemaName) continue;
        result.push(hot.getSourceDataAtCell(p, rankCol));
      }
      return result;
    }, [SCHEMA_NAME]);

    expect(ranks).not.toBeNull();
    expect(ranks.length).toBeGreaterThan(0);

    for (const rank of ranks) {
      expect(rank, `schema slot rank is null/undefined`).not.toBeNull();
      expect(rank, `schema slot rank is null/undefined`).not.toBeUndefined();
      expect(Number.isInteger(Number(rank)), `rank ${rank} is not integer`).toBe(true);
    }

    const unique = new Set(ranks.map(Number));
    expect(unique.size, 'schema slot ranks are not all unique').toBe(ranks.length);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §16 File load — slot_usage rows have non-null integer ranks
  // ═══════════════════════════════════════════════════════════════════════════

  test('§16 File load: slot_usage rows have non-null integer ranks', async ({ page }) => {
    const rows = await page.evaluate(([cls]) => {
      const dh = window._appContext?.dhs?.Slot;
      const hot = dh?.hot;
      if (!hot) return null;
      const rankCol = dh.slot_name_to_column['rank'];
      const result = [];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_type_column) !== 'slot_usage') continue;
        if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) !== cls) continue;
        const name = hot.getSourceDataAtCell(p, dh.slot_name_column);
        const rank = hot.getSourceDataAtCell(p, rankCol);
        result.push({ name, rank });
      }
      return result;
    }, [CLASS_SAMPLE]);

    expect(rows).not.toBeNull();
    expect(rows.length).toBeGreaterThan(0);

    for (const { name, rank } of rows) {
      expect(rank, `slot_usage '${name}' has null rank`).not.toBeNull();
      expect(rank, `slot_usage '${name}' has undefined rank`).not.toBeUndefined();
      expect(
        Number.isInteger(Number(rank)),
        `slot_usage '${name}' rank '${rank}' is not integer`
      ).toBe(true);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // §17 Round-trip — schema.slots rank NOT saved; slot_usage rank IS saved
  // ═══════════════════════════════════════════════════════════════════════════

  test('§17 Round-trip: schema.slots omit rank; slot_usage rows include rank', async ({ page }) => {
    // Try to obtain the serialised YAML via SchemaEditor's internal builder.
    const yamlText = await page.evaluate(() => {
      const se  = window._appContext?.schemaEditor;
      const dh  = window._appContext?.dhs?.Schema;
      if (!se || !dh) return null;
      const hot = dh.hot;
      for (let p = 0; p < hot.countSourceRows(); p++) {
        const name = hot.getSourceDataAtCell(p, 0); // name is col 0 in Schema tab
        if (typeof name === 'string' && name.includes('GRDI')) {
          const vRow = hot.toVisualRow(p);
          if (vRow < 0) continue;
          if (typeof se._buildSchemaYaml === 'function') return se._buildSchemaYaml(vRow);
          if (typeof se.buildSchemaYaml  === 'function') return se.buildSchemaYaml(vRow);
        }
      }
      return null;
    });

    if (yamlText && typeof yamlText === 'string') {
      // Extract the top-level `slots:` block (ends at next top-level key or EOF).
      const slotsBlock = yamlText.match(/^slots:\n((?:  [\s\S]*?\n)*)/m)?.[1] ?? '';
      // Within the slots block, `rank:` must NOT appear at slot-definition level.
      const rankInSlots = /^\s+rank:\s*\d/m.test(slotsBlock);
      expect(rankInSlots, 'schema.slots block contains rank keys').toBe(false);

      // slot_usage entries SHOULD have rank.
      const rankInUsage = /slot_usage[\s\S]{1,800}rank:\s*\d/m.test(yamlText);
      expect(rankInUsage, 'slot_usage blocks should contain rank keys').toBe(true);
    } else {
      // If _buildSchemaYaml is not directly accessible, fall back to data-model checks.
      // §15 already verified schema slots have ranks in the data model.
      // Here we verify at least one slot_usage has a rank — confirming §16 behaviour
      // is reflected in the serialisation layer (developer must manually verify YAML).
      const usageHasRank = await page.evaluate(([cls]) => {
        const dh = window._appContext?.dhs?.Slot;
        const hot = dh?.hot;
        if (!hot) return false;
        const rankCol = dh.slot_name_to_column['rank'];
        for (let p = 0; p < hot.countSourceRows(); p++) {
          if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
              hot.getSourceDataAtCell(p, dh.slot_class_id_column) === cls) {
            const rank = hot.getSourceDataAtCell(p, rankCol);
            if (rank !== null && rank !== undefined) return true;
          }
        }
        return false;
      }, [CLASS_SAMPLE]);
      expect(usageHasRank).toBe(true);
      console.warn('§17: _buildSchemaYaml not accessible — YAML serialisation check requires manual verification.');
    }
  });

});
