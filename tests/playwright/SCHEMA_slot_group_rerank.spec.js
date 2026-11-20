/* Test: slot_group_rerank
 *
 * Verifies that the Field Key Modal correctly re-ranks a class slot when its
 * Section (slot_group) is changed, placing it at the end of the target section
 * with a contiguous sequential rank ordering across all class slots.
 *
 * Schema : web/templates/grdi_1m/schema.yaml
 * Slot   : presampling_activity (GRDISample)
 *
 * Phase 1 — slot_usage → attribute + slot_group change
 *   Initial state: presampling_activity is slot_usage, rank=11,
 *     slot_group='Sample collection and processing'.
 *   Action: open FKM in expert mode, check "Change type" (→ attribute),
 *     change Section to 'Strain and isolation information', save.
 *   Expected:
 *     • Row becomes type 'attribute'.
 *     • slot_group = 'Strain and isolation information'.
 *     • Rank is the highest (last) among all 'Strain and isolation information' slots
 *       (slot is placed at the end of the target section).
 *     • All GRDISample class slot ranks are unique, non-null integers from 1 to N
 *       (contiguous — no gaps).
 *
 * Phase 2 — attribute → slot_usage (revert)
 *   Action: open FKM for the attribute row, check "Change type" (→ slot_usage), save.
 *   Expected:
 *     • Row becomes type 'slot_usage'.
 *     • All GRDISample class slot ranks remain unique non-null integers.
 *
 * To run:
 *   npx playwright test tests/playwright/SCHEMA_slot_group_rerank.spec.js
 *   npx playwright test tests/playwright/SCHEMA_slot_group_rerank.spec.js --headed
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { slotNameCellLocator, scrollToClassSlotRow } from './playwright_utils.js';

// ── Constants ──────────────────────────────────────────────────────────────────

const SCHEMA_FILE  = 'web/templates/grdi_1m/schema.yaml';
const CLASS_SAMPLE = 'GRDISample';
const SLOT_NAME    = 'presampling_activity';
const INIT_GROUP   = 'Sample collection and processing';
const TARGET_GROUP = 'Strain and isolation information';

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

async function openEditFkm(page, slotTypeTitle, slotName) {
  // Use se.showFieldKeyModal() directly for reliability — the dblclick pattern
  // is fragile because the two-click HOT sequence requires precise timing.
  const slotTypeMap = {
    'Table field (from schema)': 'slot_usage',
    'Table field (stand-alone)': 'attribute',
  };
  const slotTypeValue = slotTypeMap[slotTypeTitle] || slotTypeTitle;
  await page.waitForFunction(
    () => (window._appContext?.dhs?.ClassSlot?.hot?.countSourceRows() ?? 0) > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(200);
  const result = await page.evaluate(([slotName, slotTypeValue]) => {
    const classDH = window._appContext?.dhs?.ClassSlot;
    const se      = window._appContext?.schemaEditor;
    if (!classDH || !se) return { ok: false, reason: 'no classDH or schemaEditor' };
    const hot = classDH.hot;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      const name = hot.getSourceDataAtCell(p, classDH.slot_name_column);
      const type = hot.getSourceDataAtCell(p, classDH.slot_type_column);
      if (name === slotName && type === slotTypeValue) {
        const visualRow = hot.toVisualRow(p);
        if (visualRow !== null && visualRow >= 0) {
          try {
            se.showFieldKeyModal(classDH, visualRow);
            return { ok: true };
          } catch (e) {
            return { ok: false, reason: 'showFieldKeyModal threw: ' + String(e.message) };
          }
        }
        return { ok: false, reason: `visualRow invalid: physRow=${p} visualRow=${hot.toVisualRow(p)}` };
      }
    }
    return { ok: false, reason: `not found: name=${slotName} type=${slotTypeValue}` };
  }, [slotName, slotTypeValue]);
  if (!result.ok) throw new Error(`openEditFkm: ${result.reason}`);
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
 * Trigger se.showChangeTypeModal() for a ClassSlot row (the same path as
 * double-clicking the Type column cell in HOT).  Waits for #dh-dialog-modal
 * to become visible (either "Change field type" success or "Cannot change type"
 * error — both use the same modal).
 */
async function triggerChangeTypeModal(page, slotTypeTitle, slotName) {
  const slotTypeMap = {
    'Table field (from schema)': 'slot_usage',
    'Table field (stand-alone)': 'attribute',
  };
  const slotTypeValue = slotTypeMap[slotTypeTitle] || slotTypeTitle;
  await page.evaluate(([slotName, slotTypeValue]) => {
    const classDH = window._appContext?.dhs?.ClassSlot;
    const se      = window._appContext?.schemaEditor;
    if (!classDH || !se) return;
    const hot = classDH.hot;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, classDH.slot_name_column) === slotName &&
          hot.getSourceDataAtCell(p, classDH.slot_type_column) === slotTypeValue) {
        const visualRow = hot.toVisualRow(p);
        if (visualRow !== null && visualRow >= 0) {
          se.showChangeTypeModal(classDH, visualRow); // intentionally not awaited
        }
        break;
      }
    }
  }, [slotName, slotTypeValue]);
  await page.waitForFunction(
    () => document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(100);
}

async function confirmChangeTypeModal(page) {
  await page.click('#dh-dialog-ok');
  await page.waitForFunction(
    () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(200);
}

/** Switch away from and back to the Slot tab to force tabFilter / row-visibility refresh. */
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

/**
 * Return { type, slotGroup, rank } for the given slot name and class from HOT source data.
 * Returns null if not found.
 */
async function getSlotInfo(page, slotName, classId) {
  return page.evaluate(
    ([slotName, classId]) => {
      const dh  = window._appContext?.dhs?.ClassSlot;
      const hot = dh?.hot;
      if (!hot || !dh) return null;
      const rankCol = dh.slot_name_to_column['rank'];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_name_column)     !== slotName) continue;
        if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) !== classId)  continue;
        return {
          type:      hot.getSourceDataAtCell(p, dh.slot_type_column),
          slotGroup: hot.getSourceDataAtCell(p, dh.slot_group_column) || '',
          rank:      hot.getSourceDataAtCell(p, rankCol),
        };
      }
      return null;
    },
    [slotName, classId]
  );
}

/**
 * Return all { name, type, slotGroup, rank } entries for class slots of classId.
 * Includes both slot_usage and attribute rows.
 */
async function getAllClassSlots(page, classId) {
  return page.evaluate(
    ([classId]) => {
      const dh  = window._appContext?.dhs?.ClassSlot;
      const hot = dh?.hot;
      if (!hot || !dh) return [];
      const rankCol = dh.slot_name_to_column['rank'];
      const result  = [];
      for (let p = 0; p < hot.countSourceRows(); p++) {
        if (hot.getSourceDataAtCell(p, dh.slot_class_id_column) !== classId) continue;
        const t = hot.getSourceDataAtCell(p, dh.slot_type_column);
        if (t !== 'slot_usage' && t !== 'attribute') continue;
        result.push({
          name:      hot.getSourceDataAtCell(p, dh.slot_name_column),
          type:      t,
          slotGroup: hot.getSourceDataAtCell(p, dh.slot_group_column) || '',
          rank:      hot.getSourceDataAtCell(p, rankCol),
        });
      }
      return result;
    },
    [classId]
  );
}

// ── Test ──────────────────────────────────────────────────────────────────────

test('slot_group re-rank: slot_usage→attribute with section change, then revert', async ({ page }) => {
  test.setTimeout(180_000);

  // ── 1. Load schema and navigate to Slot tab ───────────────────────────────
  await loadGrdi1m(page);
  await goToSlotTab(page);
  await setExpertMode(page, true);

  // ── 2. Verify initial state ───────────────────────────────────────────────
  const initInfo = await getSlotInfo(page, SLOT_NAME, CLASS_SAMPLE);
  expect(initInfo, `${SLOT_NAME} not found in ${CLASS_SAMPLE}`).not.toBeNull();
  expect(initInfo.type,      'initial type should be slot_usage').toBe('slot_usage');
  expect(initInfo.rank,      'initial rank should be 11').toBe(11);

  // Capture the initial max rank in the target group so we can confirm the
  // moved slot lands after it.
  const initSlots    = await getAllClassSlots(page, CLASS_SAMPLE);
  const initStrainMax = initSlots
    .filter(s => s.slotGroup === TARGET_GROUP && Number.isFinite(Number(s.rank)))
    .reduce((m, s) => Math.max(m, Number(s.rank)), 0);
  expect(initStrainMax, `no existing slots found in ${TARGET_GROUP}`).toBeGreaterThan(0);

  // ════════════════════════════════════════════════════════════════════════════
  // Phase 1 — convert slot_usage → attribute, change slot_group to TARGET_GROUP
  // In the new UI these are two separate operations:
  //   a) Change Type dialog  (slot_usage → attribute)
  //   b) FKM edit (change Section to TARGET_GROUP)
  // ════════════════════════════════════════════════════════════════════════════

  // ── 3. Convert slot_usage → attribute via the Change Type dialog ──────────
  await triggerChangeTypeModal(page, 'Table field (from schema)', SLOT_NAME);
  // copy-inherited is checked by default for slot_usage → attribute; leave it.
  await confirmChangeTypeModal(page);

  // ── 4. Change Section to TARGET_GROUP via FKM ─────────────────────────────
  // The slot is now 'attribute'; attribute fields use #fkm-slot-group-new
  // (free-text + datalist) for Section in the FKM.
  await openEditFkm(page, 'Table field (stand-alone)', SLOT_NAME);

  const sgNewVisible = await page.$eval(
    '#fkm-slot-group-new', el => el.style.display !== 'none'
  );
  expect(sgNewVisible, '#fkm-slot-group-new should be visible for attribute edit').toBe(true);
  await page.fill('#fkm-slot-group-new', TARGET_GROUP);
  await page.waitForTimeout(100);

  // ── 5. Save and wait for modal to close ──────────────────────────────────
  await page.click('#fkm-confirm-btn');

  await waitFkmClosed(page);
  await refreshSlotTab(page);

  // ── 7. Verify Phase 1 results ─────────────────────────────────────────────

  // 7a. Slot is now an attribute in the target group.
  const p1Info = await getSlotInfo(page, SLOT_NAME, CLASS_SAMPLE);
  expect(p1Info, `${SLOT_NAME} not found after Phase 1`).not.toBeNull();
  expect(p1Info.type,      'Phase 1: type should be attribute').toBe('attribute');
  expect(p1Info.slotGroup, `Phase 1: slot_group should be ${TARGET_GROUP}`).toBe(TARGET_GROUP);

  // 7b. Rank is at the end of TARGET_GROUP — it must be greater than all other
  //     TARGET_GROUP slots.
  const p1Slots = await getAllClassSlots(page, CLASS_SAMPLE);
  const strainRanks = p1Slots
    .filter(s => s.slotGroup === TARGET_GROUP && s.name !== SLOT_NAME)
    .map(s => Number(s.rank))
    .filter(Number.isFinite);
  expect(strainRanks.length, 'should still have other Strain slots').toBeGreaterThan(0);

  const maxOtherStrainRank = Math.max(...strainRanks);
  expect(
    Number(p1Info.rank),
    `Phase 1: rank (${p1Info.rank}) should exceed all other ${TARGET_GROUP} ranks (max=${maxOtherStrainRank})`
  ).toBeGreaterThan(maxOtherStrainRank);

  // 7c. All class slot ranks are unique non-null integers from 1 to N
  //     (contiguous — the sequential renumber must have produced no gaps).
  const p1AllRanks = p1Slots
    .map(s => Number(s.rank))
    .filter(r => Number.isFinite(r));
  expect(p1AllRanks.length, 'all class slots should have finite ranks').toBe(p1Slots.length);

  const p1RankSet = new Set(p1AllRanks);
  expect(p1RankSet.size, 'Phase 1: all ranks must be unique').toBe(p1AllRanks.length);
  expect(Math.min(...p1AllRanks), 'Phase 1: minimum rank must be 1').toBe(1);
  expect(Math.max(...p1AllRanks), 'Phase 1: maximum rank must equal slot count (contiguous)').toBe(p1AllRanks.length);

  // ════════════════════════════════════════════════════════════════════════════
  // Phase 2 — revert attribute → slot_usage, restore slot_group to INIT_GROUP
  // In the new UI these are two separate operations:
  //   a) Change Type dialog  (attribute → slot_usage)
  //   b) FKM edit (change Section back to INIT_GROUP)
  // ════════════════════════════════════════════════════════════════════════════

  // ── 8. Convert attribute → slot_usage via the Change Type dialog ──────────
  await triggerChangeTypeModal(page, 'Table field (stand-alone)', SLOT_NAME);
  await confirmChangeTypeModal(page);

  // ── 9. Change Section back to INIT_GROUP via FKM ─────────────────────────
  // The slot is now 'slot_usage'; slot_usage fields use #fkm-slot-group
  // (select dropdown) for Section in the FKM.
  await openEditFkm(page, 'Table field (from schema)', SLOT_NAME);

  const sgSelectVisible2 = await page.$eval(
    '#fkm-slot-group', el => el.style.display !== 'none'
  );
  expect(sgSelectVisible2, 'Phase 2: #fkm-slot-group (select) should be visible for slot_usage').toBe(true);
  await page.selectOption('#fkm-slot-group', INIT_GROUP);
  await page.waitForTimeout(100);

  // ── 10. Save and wait for modal to close ─────────────────────────────────
  await page.click('#fkm-confirm-btn');
  await waitFkmClosed(page);
  await refreshSlotTab(page);

  // ── 11. Verify Phase 2 results ────────────────────────────────────────────

  // 11a. Slot is now slot_usage.
  const p2Info = await getSlotInfo(page, SLOT_NAME, CLASS_SAMPLE);
  expect(p2Info, `${SLOT_NAME} not found after Phase 2`).not.toBeNull();
  expect(p2Info.type, 'Phase 2: type should be slot_usage').toBe('slot_usage');

  // 11b. The Section was explicitly changed back to INIT_GROUP via FKM above;
  //      the FKM re-rank positions it at the end of that group.
  expect(
    p2Info.slotGroup,
    `Phase 2: slot_group should be restored to base slot's group (${INIT_GROUP})`
  ).toBe(INIT_GROUP);

  // 11c. Rank is the highest (last) among all INIT_GROUP slots — placed at end.
  const p2Slots = await getAllClassSlots(page, CLASS_SAMPLE);
  const initGroupRanks = p2Slots
    .filter(s => s.slotGroup === INIT_GROUP && s.name !== SLOT_NAME)
    .map(s => Number(s.rank))
    .filter(Number.isFinite);
  expect(initGroupRanks.length, `should still have other ${INIT_GROUP} slots`).toBeGreaterThan(0);

  const maxOtherInitRank = Math.max(...initGroupRanks);
  expect(
    Number(p2Info.rank),
    `Phase 2: rank (${p2Info.rank}) should exceed all other ${INIT_GROUP} ranks (max=${maxOtherInitRank})`
  ).toBeGreaterThan(maxOtherInitRank);

  // 11d. All class slot ranks are unique non-null integers from 1 to N (contiguous).
  const p2AllRanks = p2Slots
    .map(s => Number(s.rank))
    .filter(r => Number.isFinite(r));
  expect(p2AllRanks.length, 'Phase 2: all class slots should have finite ranks').toBe(p2Slots.length);

  const p2RankSet = new Set(p2AllRanks);
  expect(p2RankSet.size,           'Phase 2: all ranks must be unique').toBe(p2AllRanks.length);
  expect(Math.min(...p2AllRanks),  'Phase 2: minimum rank must be 1').toBe(1);
  expect(Math.max(...p2AllRanks),  'Phase 2: maximum rank must equal slot count (contiguous)').toBe(p2AllRanks.length);
});
