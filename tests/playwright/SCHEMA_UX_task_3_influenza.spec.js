/* Test: SCHEMA_UX_task_3_influenza
 *
 * Exercises the Translation tab workflow on the Influenza schema.
 * Unlike the CanCOGeN canada_covid19 schema (which ships with pre-built French
 * translations), the Influenza schema has NO locale data.  The test therefore
 * covers the full locale-setup → translation-tab workflow:
 *
 *   1. Load the Schema Editor and load influenza via right-click.
 *   2. Add French (fr) locale to the Influenza schema row via the multiselect
 *      modal; set in_language = 'en' so the Translation tab renders data.
 *   3. Navigate to the Field (Slot) tab with the Influenza class selected.
 *      Right-click the "authors" slot_usage → "Translations".
 *      Add French title, description, and comments in the Translation tab.
 *   4. Navigate to the Enum (Picklist) tab.
 *      Right-click OrganismMenu → "Translations".
 *      Add a French title for the enum.
 *   5. Save as YAML and verify all four French locale entries are present.
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

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wait for the Translation tab button to become active, the category filter to
 * show `filterValue`, and the pivot HOT to have rows.
 *
 * The `filterValue` check prevents a race condition: when the tab is
 * re-activated (e.g. after switching from 'slots' to 'enums'), countRows() is
 * immediately > 0 from stale data.  Matching the filter confirms that
 * activatePivotAndSelect() has rebuilt the HOT with the correct rows.
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
 * In the Translation tab's pivot HOT, scan for the 'fr' locale row that
 * belongs to the entity group identified by (key, sub_key).
 * Returns the row index, or -1 if not found.
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

test('_influenza: load, add locale, add translations via Translation tab, save', async ({ page }) => {
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

  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    ).length > 0,
    null,
    { timeout: 10_000 }
  );

  // ── 2. Right-click the first Schema row → Load LinkML schema.yaml ─────────
  const schemaFile = path.resolve('web/templates/influenza/schema.yaml');

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

  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'Influenza'),
    null,
    { timeout: 30_000 }
  );

  const influenzaRowIdx = await findRowIndex(page, 0, 'Influenza');
  expect(influenzaRowIdx, 'Influenza schema row not found after load').not.toBe(-1);

  // ── 3. Add French (fr) locale and set default language ────────────────────
  const localesColIdx = await dhColIndex(page, 'Schema', 'locales');
  const localesCell = hotCellLocator(page, influenzaRowIdx, localesColIdx);
  await localesCell.scrollIntoViewIfNeeded();
  await localesCell.dblclick();

  await page.waitForFunction(
    () => document.querySelector('#multiselect-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  await page.locator('#multiselect-text .selectize-input input').click();
  await page.keyboard.type('French');
  await page.waitForTimeout(200);

  const frenchOption = page
    .locator('#multiselect-text .selectize-dropdown .option')
    .filter({ hasText: 'French (fr)' })
    .first();
  await frenchOption.waitFor({ state: 'visible', timeout: 5_000 });
  await frenchOption.click();

  await page.locator('#multiselect-modal button[data-dismiss="modal"]').first().click();

  // Confirm the "ADD LOCALE(s): French (fr)" dialog.
  await page.waitForFunction(
    () => document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );
  await page.click('#dh-dialog-ok');
  await page.waitForFunction(
    () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // Verify locales = 'fr'.
  const localesValue = await page.evaluate(() => {
    const dh = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol    = dh.slot_name_to_column['name'];
    const localesCol = dh.slot_name_to_column['locales'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        return hot.getSourceDataAtCell(p, localesCol);
      }
    }
    return null;
  });
  expect(localesValue, 'Influenza locales should be "fr" after adding French').toBe('fr');

  // Set in_language = 'en' so the Translation tab can render its HOT.
  // The influenza schema ships without in_language; we set it via the HOT API
  // so that _buildTranslationData() finds a default language and skips the
  // "define a default language" status message.
  await page.evaluate(() => {
    const dh = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const nameCol = dh.slot_name_to_column['name'];
    const langCol = dh.slot_name_to_column['in_language'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        hot.setDataAtCell([[hot.toVisualRow(p), langCol, 'en']]);
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  // ── 4. Add French translations for "authors" via the Translation tab ───────
  // Expert User mode is required for slot_usage translation paths.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

  // Switch to Class tab and select the Influenza class so the lower panel of
  // the Field tab is filtered to Influenza's slot_usage rows.
  await page.click('#tab-bar-Class > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Class .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const influenzaClassRowIdx = await findRowIndex(page, 0, 'Influenza');
  expect(influenzaClassRowIdx, 'Influenza class row not found in Class tab').not.toBe(-1);
  await hotCellLocator(page, influenzaClassRowIdx, 0).click();
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

  // Scroll until the "authors" slot_usage row appears in the lower panel.
  const authorsRowIdx = await scrollToClassSlotRow(
    page, 'authors', 'Table field (from schema)'
  );
  expect(authorsRowIdx, '"authors" slot_usage row not found in Slot tab lower panel')
    .toBeGreaterThanOrEqual(0);

  // Right-click a plain non-KEY column to open the context menu.
  const csSlotGroupColIdx = await dhColIndex(page, 'ClassSlot', 'slot_group');
  const authorsCell = classSlotCellLocator(page, authorsRowIdx, csSlotGroupColIdx);
  await authorsCell.scrollIntoViewIfNeeded();
  await authorsCell.click({ button: 'right' });

  // Click "Translations" — enabled because the Influenza schema row now has
  // locales: fr (set in step 3).
  const translationsItem = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItem.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItem.click();

  // Translation tab activates with filter "Class slots and attributes" (='slots').
  await waitForTranslationTab(page, 'slots');

  // Find the 'fr' locale row for the "authors" slot_usage
  // (key = 'Influenza', sub_key = 'authors').
  const authorsFrRowIdx = await findTranslationFrRow(page, 'Influenza', 'authors');
  expect(authorsFrRowIdx, 'fr locale row for "authors" not found in Translation HOT')
    .toBeGreaterThanOrEqual(0);

  // Set title, description, and comments via the Translation HOT's API.
  // setDataAtRowProp fires afterChange → writeBack() → locales update.
  const frTitle       = 'Auteurs';
  const frDescription = 'Provenance des versions du logiciel et du mod\u00e8le DataHarmonizer.';
  const frComments    = 'Translation generated via Google Translate.';

  const setOk = await page.evaluate(
    ({ rowIdx, frTitle, frDescription, frComments }) => {
      const hot = window._appContext?.schemaEditor?.translationTabHot;
      if (!hot) return false;
      hot.setDataAtRowProp(rowIdx, 'title',       frTitle,       'ui_edit');
      hot.setDataAtRowProp(rowIdx, 'description', frDescription, 'ui_edit');
      hot.setDataAtRowProp(rowIdx, 'comments',    frComments,    'ui_edit');
      return true;
    },
    { rowIdx: authorsFrRowIdx, frTitle, frDescription, frComments }
  );
  expect(setOk, 'setDataAtRowProp for authors should succeed').toBe(true);
  await page.waitForTimeout(300);

  // Verify all three fields are in locales.
  const authorsLocale = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        const a = meta?.locales?.fr?.classes?.Influenza?.slot_usage?.authors;
        return a ? { title: a.title, description: a.description, comments: a.comments } : null;
      }
    }
    return null;
  });
  expect(authorsLocale?.title,       'fr title for "authors"').toBe(frTitle);
  expect(authorsLocale?.description, 'fr description for "authors"').toBe(frDescription);
  expect(authorsLocale?.comments,    'fr comments for "authors"').toBe(frComments);

  // ── 5. Add a French title for the OrganismMenu enum ───────────────────────
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

  // Scroll OrganismMenu into the visible viewport.
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'OrganismMenu') {
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
        if (text === 'OrganismMenu') return true;
      }
      return false;
    },
    null, { timeout: 5_000 }
  );

  const enumRowIdx = await findRowIndex(page, 0, 'OrganismMenu');
  expect(enumRowIdx, 'OrganismMenu row not found in Enum tab').not.toBe(-1);

  // Right-click OrganismMenu → "Translations".
  const enumNameCell = hotCellLocator(page, enumRowIdx, 0);
  await enumNameCell.scrollIntoViewIfNeeded();
  await enumNameCell.click({ button: 'right' });

  const translationsItemEnum = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItemEnum.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItemEnum.click();

  // Translation tab activates with filter "Enumerations" (='enums').
  await waitForTranslationTab(page, 'enums');

  // Find the 'fr' locale row for OrganismMenu enum (key='OrganismMenu', no sub_key).
  const enumFrRowIdx = await findTranslationFrRow(page, 'OrganismMenu', null);
  expect(enumFrRowIdx, 'fr locale row for OrganismMenu not found in Translation HOT')
    .toBeGreaterThanOrEqual(0);

  // Add French title for OrganismMenu.
  const frEnumTitle = 'menu des organismes';
  const enumSetOk = await page.evaluate(
    ({ rowIdx, title }) => {
      const hot = window._appContext?.schemaEditor?.translationTabHot;
      if (!hot) return false;
      hot.setDataAtRowProp(rowIdx, 'title', title, 'ui_edit');
      return true;
    },
    { rowIdx: enumFrRowIdx, title: frEnumTitle }
  );
  expect(enumSetOk, 'setDataAtRowProp for OrganismMenu enum title should succeed').toBe(true);
  await page.waitForTimeout(300);

  // Verify OrganismMenu fr title in locales.
  const savedEnumTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.enums?.OrganismMenu?.title ?? null;
      }
    }
    return null;
  });
  expect(savedEnumTitle, 'fr title for OrganismMenu should be set').toBe(frEnumTitle);

  // ── 6. Save schema as YAML and verify ─────────────────────────────────────
  await page.click('#tab-bar-Schema > a');
  await page.waitForFunction(
    () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
    null, { timeout: 5_000 }
  );
  await page.waitForFunction(
    () => document.querySelectorAll('.tab-pane.show').length === 1,
    null, { timeout: 5_000 }
  );

  const influenzaRowIdxFinal = await findRowIndex(page, 0, 'Influenza');
  expect(influenzaRowIdxFinal, 'Influenza row not found in Schema tab for save').not.toBe(-1);

  page.once('dialog', async dialog => { await dialog.accept('schema.yaml'); });

  const tmpDir = path.resolve('tests/playwright/tmp');
  mkdirSync(tmpDir, { recursive: true });

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    (async () => {
      const influenzaCell = hotCellLocator(page, influenzaRowIdxFinal, 0);
      await influenzaCell.click();
      await page.waitForTimeout(200);
      await influenzaCell.click({ button: 'right' });
      const saveItem = page
        .locator('.htItemWrapper')
        .filter({ hasText: 'Save as LinkML schema.yaml' })
        .first();
      await saveItem.waitFor({ state: 'visible', timeout: 8_000 });
      await saveItem.click();
    })(),
  ]);

  const savedPath = path.join(tmpDir, 'influenza_test.yaml');
  await download.saveAs(savedPath);

  const saved   = YAML.parse(readFileSync(savedPath, 'utf8'));
  const locales = saved?.extensions?.locales?.value;

  // All four French locale entries must be present.
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.title,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.title').toBe(frTitle);
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.description,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.description').toBe(frDescription);
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.comments,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.comments').toBe(frComments);
  expect(locales?.fr?.enums?.OrganismMenu?.title,
    'Saved YAML: fr.enums.OrganismMenu.title').toBe(frEnumTitle);

  // Unfilled fields must be absent, not saved as empty strings.
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.examples,
    'Saved YAML: fr.authors.examples should be absent, not ""').toBeUndefined();
  expect(locales?.fr?.enums?.OrganismMenu?.description,
    'Saved YAML: fr.OrganismMenu.description should be absent, not ""').toBeUndefined();
});
