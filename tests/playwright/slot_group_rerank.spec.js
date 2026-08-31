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
 *   npx playwright test tests/playwright/slot_group_rerank.spec.js
 *   npx playwright test tests/playwright/slot_group_rerank.spec.js --headed
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { slotCellLocator, scrollToSlotRow } from './playwright_utils.js';

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

async function waitFkmClosed(page) {
  await page.waitForFunction(
    () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 6_000 }
  );
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
      const dh  = window._appContext?.dhs?.Slot;
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
      const dh  = window._appContext?.dhs?.Slot;
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

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

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
  // ════════════════════════════════════════════════════════════════════════════

  // ── 3. Open FKM for presampling_activity (slot_usage) ────────────────────
  await openEditFkm(page, 'Table field (from schema)', SLOT_NAME);

  // ── 4. Check "Change type" (slot_usage → attribute) ──────────────────────
  await page.check('#fkm-change-type');
  await page.waitForTimeout(200);

  // ── 5. Select target Section from the dropdown (visible for slot_usage edit)
  // The Section control is #fkm-slot-group (select) for slot_usage edit mode.
  const sgSelectVisible = await page.$eval(
    '#fkm-slot-group', el => el.style.display !== 'none'
  );
  expect(sgSelectVisible, '#fkm-slot-group (select) should be visible for slot_usage edit').toBe(true);
  await page.selectOption('#fkm-slot-group', TARGET_GROUP);
  await page.waitForTimeout(100);

  // ── 6. Save and wait for modal to close ──────────────────────────────────
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
  // Phase 2 — revert attribute → slot_usage
  // ════════════════════════════════════════════════════════════════════════════

  // ── 8. Open FKM for presampling_activity (now attribute) ─────────────────
  await openEditFkm(page, 'Table field (stand-alone)', SLOT_NAME);

  // "Change type" checkbox must be enabled (matching schema slot exists).
  const cbEnabled = await page.$eval('#fkm-change-type', el => !el.disabled);
  expect(cbEnabled, 'Phase 2: Change type checkbox should be enabled (schema slot exists)').toBe(true);

  // ── 9. Check "Change type" (attribute → slot_usage) ─────────────────────
  await page.check('#fkm-change-type');
  await page.waitForTimeout(200);

  // ── 10. Save and wait for modal to close ─────────────────────────────────
  await page.click('#fkm-confirm-btn');
  await waitFkmClosed(page);
  await refreshSlotTab(page);

  // ── 11. Verify Phase 2 results ────────────────────────────────────────────

  // 11a. Slot is now slot_usage.
  const p2Info = await getSlotInfo(page, SLOT_NAME, CLASS_SAMPLE);
  expect(p2Info, `${SLOT_NAME} not found after Phase 2`).not.toBeNull();
  expect(p2Info.type, 'Phase 2: type should be slot_usage').toBe('slot_usage');

  // 11b. The copy-base-values block restores the slot_group to the base schema
  //      slot's group (INIT_GROUP), and the new re-rank positions it at the end
  //      of that group.
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
