/* Test: _canada_covid19 (Translation tab workflow)
 *
 * Uses the CanCOGeN canada_covid19 schema because it already has:
 *   - in_language: en  (default language set → Translation tab renders immediately)
 *   - extensions.locales.value.fr  (French translations for 143 slots and 49 enums)
 *
 * The test exercises the Translation tab workflow introduced when the old
 * #translate-modal was removed:
 *   right-click any entity → "Translations" → Translation tab activates
 *   with the right category filter and that entity's row selected.
 *
 * Steps:
 *   1. Load the Schema Editor and load canada_covid19 via right-click.
 *   2. Verify the schema loaded with French translations (read existing locales).
 *   3. Navigate to Field (Slot) tab with CanCOGeNCovid19 class selected.
 *      Right-click specimen_collector_sample_id slot_usage → "Translations".
 *      Add a French title (new — slot_usage rows only have slot_group so far).
 *   4. Navigate to Enum (Picklist) tab.
 *      Right-click NullValueMenu → "Translations".
 *      Verify the existing French title, then modify it.
 *   5. Save as YAML and verify both changes are present in the saved file.
 *
 * To run this test:
 *   npx playwright test tests/playwright/SCHEMA_UX_task_3_influenza.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync, mkdirSync } from 'fs';
import YAML from 'yaml';
import {
  hotCellLocator,
  findRowIndex,
  scrollToClassSlotRow,
  classSlotCellLocator,
  dhColIndex,
} from './playwright_utils.js';

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Wait for the Translation tab to become active, the filter dropdown to show
 * the expected value, and the HOT to have rows.
 *
 * Passing `filterValue` guards against stale data from a previous filter: when
 * the tab is re-activated (e.g. switching from 'slots' to 'enums'), countRows()
 * is > 0 immediately from old data.  Checking the filter value first ensures
 * activatePivotAndSelect() has run and rebuilt the HOT with the correct rows.
 */
async function waitForTranslationTab(page, filterValue = null, timeout = 15_000) {
  await page.waitForFunction(
    ([fv]) => {
      if (!document.getElementById('translation-tab-btn')?.classList.contains('active'))
        return false;
      if (fv) {
        const sel = document.getElementById('translation-filter-select');
        if (!sel || sel.value !== fv) return false;
      }
      return (window._appContext?.schemaEditor?.translationTabHot?.countRows() ?? 0) > 0;
    },
    [filterValue],
    { timeout }
  );
  await page.waitForTimeout(200);
}

/**
 * In the Translation tab's pivot HOT, find the 'fr' locale row for the entity
 * identified by (key, sub_key).  Returns the first matching row's index, or -1.
 *
 * In pivot mode each entity group has:
 *   base row  (_isBase: true,  key, sub_key)
 *   locale rows (_locale: 'fr', …)  immediately following the base row.
 */
async function findTranslationFrRow(page, key, sub_key = null) {
  return page.evaluate(
    ([key, sub_key]) => {
      const hot = window._appContext?.schemaEditor?.translationTabHot;
      if (!hot) return -1;
      const n = hot.countRows();
      let inGroup = false;
      for (let i = 0; i < n; i++) {
        const row = hot.getSourceDataAtRow(i);
        if (!row) continue;
        if (row._isBase) {
          inGroup = row.key === key &&
                    (sub_key === null ? !row.sub_key : row.sub_key === sub_key);
          continue;
        }
        if (inGroup && row._locale === 'fr') return i;
        if (row._isBase) inGroup = false;
      }
      return -1;
    },
    [key, sub_key]
  );
}

// ── Test ─────────────────────────────────────────────────────────────────────

test('_canada_covid19: translation tab workflow — read, add, modify, save', async ({ page }) => {
  test.setTimeout(180_000);

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ─────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null,
    { timeout: 15_000 }
  );

  // Schema tab is active by default.
  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    ).length > 0,
    null,
    { timeout: 10_000 }
  );

  // ── 2. Right-click the first Schema row → Load LinkML schema.yaml ─────────
  const schemaFile = path.resolve('web/templates/canada_covid19/schema.yaml');

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    (async () => {
      const firstSchemaCell = page
        .locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
        .first()
        .locator('td:nth-of-type(1)');
      await firstSchemaCell.click();
      await page.waitForTimeout(200);
      await firstSchemaCell.click({ button: 'right' });
      const loadItem = page
        .locator('.htItemWrapper')
        .filter({ hasText: 'Load LinkML schema.yaml' })
        .first();
      await loadItem.waitFor({ state: 'visible', timeout: 8_000 });
      await loadItem.click();
    })(),
  ]);
  await fileChooser.setFiles(schemaFile);

  // Wait for the CanCOGeN_Covid-19 name to appear in the Schema tab.
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'CanCOGeN_Covid-19'),
    null,
    { timeout: 30_000 }
  );

  const cancogenRowIdx = await findRowIndex(page, 0, 'CanCOGeN_Covid-19');
  expect(cancogenRowIdx, 'CanCOGeN_Covid-19 schema row not found after load').not.toBe(-1);

  // ── 3. Verify existing French translations loaded correctly ────────────────
  // The canada_covid19 schema ships with extensions.locales.value.fr containing
  // 143 schema-level slot translations. Spot-check specimen_collector_sample_id.
  const existingTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'CanCOGeN_Covid-19') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.slots?.specimen_collector_sample_id?.title ?? null;
      }
    }
    return null;
  });
  expect(
    existingTitle,
    'Existing fr schema-slot title for specimen_collector_sample_id should be loaded'
  ).toBe("ID du collecteur d\u2019\u00e9chantillons");

  // Also verify existing slot_usage slot_group translation.
  const existingSlotGroup = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'CanCOGeN_Covid-19') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.classes?.CanCOGeNCovid19
                   ?.slot_usage?.specimen_collector_sample_id?.slot_group ?? null;
      }
    }
    return null;
  });
  expect(
    existingSlotGroup,
    'Existing fr slot_usage slot_group for specimen_collector_sample_id should be loaded'
  ).toBe('Identificateurs de base de donn\u00e9es');

  // ── 4. Add a French title for specimen_collector_sample_id slot_usage ─────
  // Enable Expert User mode — required for slot_usage translation paths.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // Switch to Class tab and select the CanCOGeNCovid19 class so the Slot tab's
  // lower panel is filtered to that class.
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const cancogenClassRowIdx = await findRowIndex(page, 0, 'CanCOGeNCovid19');
  expect(cancogenClassRowIdx, 'CanCOGeNCovid19 class row not found in Class tab').not.toBe(-1);
  await hotCellLocator(page, cancogenClassRowIdx, 0).click();
  await page.waitForTimeout(300);

  // Switch to Field (Slot) tab.
  await page.click('#tab-bar-Slot > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(500);

  // Find specimen_collector_sample_id in the ClassSlot lower panel.
  // It is a slot_usage for CanCOGeNCovid19 and sorts near the top (rank 0).
  const specRowIdx = await scrollToClassSlotRow(
    page, 'specimen_collector_sample_id', 'Table field (from schema)'
  );
  expect(
    specRowIdx,
    '"specimen_collector_sample_id" slot_usage row not found in Slot tab lower panel'
  ).toBeGreaterThanOrEqual(0);

  // Right-click a non-KEY column to open the context menu.
  const csSlotGroupColIdx = await dhColIndex(page, 'ClassSlot', 'slot_group');
  const specCell = classSlotCellLocator(page, specRowIdx, csSlotGroupColIdx);
  await specCell.scrollIntoViewIfNeeded();
  await specCell.click({ button: 'right' });

  // Click "Translations" — enabled because CanCOGeN_Covid-19 has locales: fr.
  const translationsItem = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItem.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItem.click();

  // Translation tab activates with filter "Class slots and attributes" (value='slots').
  await waitForTranslationTab(page, 'slots');

  // Find the 'fr' locale row for specimen_collector_sample_id slot_usage
  // (key = 'CanCOGeNCovid19', sub_key = 'specimen_collector_sample_id').
  const specFrRowIdx = await findTranslationFrRow(
    page, 'CanCOGeNCovid19', 'specimen_collector_sample_id'
  );
  expect(
    specFrRowIdx,
    'fr locale row for specimen_collector_sample_id not found in Translation HOT'
  ).toBeGreaterThanOrEqual(0);

  // Add a French title (slot_usage rows currently only have slot_group translated).
  // setDataAtRowProp fires afterChange → writeBack() → locales update.
  const newSlotUsageTitle = 'ID collecteur (table)';
  const setResult = await page.evaluate(
    ({ rowIdx, title }) => {
      const hot = window._appContext?.schemaEditor?.translationTabHot;
      if (!hot) return false;
      hot.setDataAtRowProp(rowIdx, 'title', title, 'ui_edit');
      return true;
    },
    { rowIdx: specFrRowIdx, title: newSlotUsageTitle }
  );
  expect(setResult, 'setDataAtRowProp should succeed').toBe(true);
  await page.waitForTimeout(300);

  // Verify the new title is in locales.
  const savedSlotUsageTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'CanCOGeN_Covid-19') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.classes?.CanCOGeNCovid19
                   ?.slot_usage?.specimen_collector_sample_id?.title ?? null;
      }
    }
    return null;
  });
  expect(
    savedSlotUsageTitle,
    'New fr title for specimen_collector_sample_id slot_usage should be in locales'
  ).toBe(newSlotUsageTitle);

  // ── 5. Modify the French title for the NullValueMenu enum ─────────────────
  // Navigate to the Enum (Picklist) tab.
  await page.click('#tab-bar-Enum > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Enum .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length > 0,
    null, { timeout: 15_000 }
  );
  await page.waitForTimeout(500);

  // Scroll NullValueMenu into the visible viewport.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'NullValueMenu') {
        hot.scrollViewportTo({ row: hot.toVisualRow(p), col: 0 });
        break;
      }
    }
  });

  await page.waitForFunction(
    () => {
      const scope = document.querySelector('.tab-pane.show');
      const rows  = (scope || document).querySelectorAll('.ht_clone_left.handsontable tbody tr');
      for (const row of rows) {
        const tds  = row.querySelectorAll('td');
        const text = (tds[0]?.textContent ?? '').replace(/\u25bc/g, '').trim();
        if (text === 'NullValueMenu') return true;
      }
      return false;
    },
    null, { timeout: 5_000 }
  );

  const nullValueMenuRowIdx = await findRowIndex(page, 0, 'NullValueMenu');
  expect(nullValueMenuRowIdx, 'NullValueMenu row not found in Enum tab').not.toBe(-1);

  // Verify existing French title for NullValueMenu before modifying.
  const existingEnumTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'CanCOGeN_Covid-19') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.enums?.NullValueMenu?.title ?? null;
      }
    }
    return null;
  });
  expect(existingEnumTitle, 'Existing fr title for NullValueMenu should be loaded')
    .not.toBeNull();

  // Right-click NullValueMenu → "Translations".
  const enumNameCell = hotCellLocator(page, nullValueMenuRowIdx, 0);
  await enumNameCell.scrollIntoViewIfNeeded();
  await enumNameCell.click({ button: 'right' });

  const translationsItemEnum = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItemEnum.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItemEnum.click();

  // Translation tab activates with filter "Enumerations" (value='enums').
  await waitForTranslationTab(page, 'enums');

  // Find the 'fr' locale row for NullValueMenu enum
  // (key = 'NullValueMenu', sub_key = null for enums).
  const enumFrRowIdx = await findTranslationFrRow(page, 'NullValueMenu', null);
  expect(enumFrRowIdx, 'fr locale row for NullValueMenu not found in Translation HOT')
    .toBeGreaterThanOrEqual(0);

  // Modify the French title.
  const modifiedEnumTitle = 'Menu Valeur nulle';
  const enumSetResult = await page.evaluate(
    ({ rowIdx, title }) => {
      const hot = window._appContext?.schemaEditor?.translationTabHot;
      if (!hot) return false;
      hot.setDataAtRowProp(rowIdx, 'title', title, 'ui_edit');
      return true;
    },
    { rowIdx: enumFrRowIdx, title: modifiedEnumTitle }
  );
  expect(enumSetResult, 'setDataAtRowProp for enum title should succeed').toBe(true);
  await page.waitForTimeout(300);

  // Verify the modified enum title is in locales.
  const savedEnumTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'CanCOGeN_Covid-19') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.enums?.NullValueMenu?.title ?? null;
      }
    }
    return null;
  });
  expect(savedEnumTitle, 'Modified fr title for NullValueMenu should be in locales')
    .toBe(modifiedEnumTitle);

  // ── 6. Save schema as YAML and verify ─────────────────────────────────────
  // Navigate back to the Schema tab to trigger the save context menu.
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const cancogenRowIdxFinal = await findRowIndex(page, 0, 'CanCOGeN_Covid-19');
  expect(cancogenRowIdxFinal, 'CanCOGeN_Covid-19 row not found in Schema tab for save')
    .not.toBe(-1);

  // Intercept the filename prompt.
  page.once('dialog', async dialog => { await dialog.accept('schema.yaml'); });

  // Right-click → "Save as LinkML schema.yaml".
  const tmpDir = path.resolve('tests/playwright/tmp');
  mkdirSync(tmpDir, { recursive: true });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    (async () => {
      const cancogenCell = hotCellLocator(page, cancogenRowIdxFinal, 0);
      await cancogenCell.click();
      await page.waitForTimeout(200);
      await cancogenCell.click({ button: 'right' });
      const saveItem = page
        .locator('.htItemWrapper')
        .filter({ hasText: 'Save as LinkML schema.yaml' })
        .first();
      await saveItem.waitFor({ state: 'visible', timeout: 8_000 });
      await saveItem.click();
    })(),
  ]);

  const savedPath = path.join(tmpDir, 'cancogen_test.yaml');
  await download.saveAs(savedPath);

  const saved   = YAML.parse(readFileSync(savedPath, 'utf8'));
  const locales = saved?.extensions?.locales?.value;

  // New slot_usage title was added.
  expect(
    locales?.fr?.classes?.CanCOGeNCovid19?.slot_usage?.specimen_collector_sample_id?.title,
    'Saved YAML: new fr slot_usage title for specimen_collector_sample_id'
  ).toBe(newSlotUsageTitle);

  // Modified enum title.
  expect(
    locales?.fr?.enums?.NullValueMenu?.title,
    'Saved YAML: modified fr enum title for NullValueMenu'
  ).toBe(modifiedEnumTitle);

  // Existing schema-level slot title is unchanged.
  expect(
    locales?.fr?.slots?.specimen_collector_sample_id?.title,
    'Saved YAML: existing fr schema-slot title should be unchanged'
  ).toBe("ID du collecteur d\u2019\u00e9chantillons");

  // Existing slot_usage slot_group is unchanged.
  expect(
    locales?.fr?.classes?.CanCOGeNCovid19?.slot_usage?.specimen_collector_sample_id?.slot_group,
    'Saved YAML: existing fr slot_usage slot_group should be unchanged'
  ).toBe('Identificateurs de base de donn\u00e9es');
});
