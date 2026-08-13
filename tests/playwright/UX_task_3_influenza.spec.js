/* Test: _influenza
 *
 * Exercises editing workflows on the Influenza schema in the SchemaEditor.
 *
 * Column layout reminder — Slot/Field tab .ht_master tbody tds (0-based):
 *   tds[0]  = placeholder for class_id (frozen in ht_clone_left)
 *   tds[1]  = slot_type   ("Type" – "Schema field" / "Table field (from schema)" / …)
 *   tds[2]  = slot_group  ("Section")
 *   tds[3]  = name        ("Field ID")
 *   tds[4]  = rank        ("Ordering")
 *   tds[5]  = slot_uri
 *   tds[6]  = title
 *   tds[7]  = description
 *   tds[12] = required    (checkbox)
 *   tds[13] = recommended (checkbox)
 *
 * To run this test:
 *   npx playwright test tests/playwright/_influenza.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync, mkdirSync } from 'fs';
import YAML from 'yaml';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Target a cell in the Schema / Class tab HOT grid.
 * Col 0 (name) is frozen in .ht_clone_left; other cols go to .ht_master.
 */
function hotCellLocator(page, rowIndex, colIdx) {
  if (colIdx === 0) {
    return page
      .locator('.tab-pane.show .ht_clone_left.handsontable tbody tr')
      .nth(rowIndex)
      .locator('td:nth-of-type(1)');
  }
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

/**
 * Target a cell in the Slot/Field tab .ht_master grid.
 * colIdx 0 = empty placeholder for frozen class_id; 1 = slot_type; 2 = slot_group;
 * 3 = name; 6 = title; 7 = description; 12 = required; 13 = recommended.
 */
function slotCellLocator(page, rowIndex, colIdx) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}

/**
 * Find the 0-based DOM row index of a slot row matching both `name` (tds[3])
 * and `slotTypeTitle` (tds[1]) in the currently active tab's .ht_master.
 * Returns -1 if not found in the currently rendered DOM.
 */
async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows  = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        if (ht(tds[3]) === name && ht(tds[1]) === slotTypeTitle) return i;
      }
      return -1;
    },
    [name, slotTypeTitle]
  );
}

/**
 * Find a row in Schema/Class tab .ht_master (or .ht_clone_left for col 0)
 * by colIdx + text. Returns -1 if not found.
 */
async function findRowIndex(page, colIdx, text) {
  return page.evaluate(
    ([colIdx, text]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const rows  = document.querySelectorAll(`.tab-pane.show ${clone}.handsontable tbody tr`);
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        const nth = colIdx === 0 ? 0 : colIdx;
        if (tds[nth] && ht(tds[nth]) === text) return i;
      }
      return -1;
    },
    [colIdx, text]
  );
}

/**
 * Scroll the Slot/Field tab HOT down incrementally until the row matching
 * `name` + `slotTypeTitle` appears in the DOM, then return its DOM index.
 */
async function scrollToSlotRow(page, name, slotTypeTitle, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const idx = await findSlotRowIndex(page, name, slotTypeTitle);
    if (idx !== -1) return idx;
    await page.evaluate(() => {
      const holder = document.querySelector('.tab-pane.show .ht_master .wtHolder');
      if (holder) holder.scrollTop += 300;
    });
    await page.waitForTimeout(200);
  }
  return -1;
}

// ── Test ───────────────────────────────────────────────────────────────────────

test('_influenza: load via right-click menu, edit, save, verify', async ({ page }) => {
  test.setTimeout(180_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the Schema Editor ───────────────────────────────────────────────
  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null,
    { timeout: 15_000 }
  );

  // The Schema tab is active by default. Wait for at least one row to render.
  await page.waitForFunction(
    () => document.querySelectorAll(
      '.tab-pane.show .ht_clone_left.handsontable tbody tr'
    ).length > 0,
    null,
    { timeout: 10_000 }
  );

  // ── 2. Right-click the first Schema row → Load LinkML schema.yaml ──────────
  // The context-menu item calls $('#schema_upload').click() internally.
  // page.waitForEvent('filechooser') intercepts that programmatic file-input click.
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

  // Wait for the Influenza schema name to appear in the Schema tab.
  await page.waitForFunction(
    () => Array.from(
      document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
    ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'Influenza'),
    null,
    { timeout: 30_000 }
  );

  // Verify the Influenza row is present.
  const influenzaRowIdx = await findRowIndex(page, 0, 'Influenza');
  expect(influenzaRowIdx, 'Influenza schema row not found after load').not.toBe(-1);

  // ── 3. Add French (fr) language translation ─────────────────────────────────
  // The "Translations" column (locales, colIdx 6 in Schema tab) is multivalued.
  // Double-clicking it fires HOT's afterBeginEditing → DH opens #multiselect-modal
  // with a selectize.js multi-select populated from LanguagesMenu.
  // After selecting "French (fr)" and clicking Ok, beforeChange intercepts the
  // multiselect_change and calls setLocales(), which shows a dhConfirm dialog
  // before committing the locale.
  const localesCell = hotCellLocator(page, influenzaRowIdx, 6);
  await localesCell.scrollIntoViewIfNeeded();
  await localesCell.dblclick();

  await page.waitForFunction(
    () => document.querySelector('#multiselect-modal')?.classList.contains('show'),
    null,
    { timeout: 5_000 }
  );

  // Type 'French' to filter the selectize dropdown to the French (fr) option.
  await page.locator('#multiselect-text .selectize-input input').click();
  await page.keyboard.type('French');
  await page.waitForTimeout(200);

  const frenchOption = page
    .locator('#multiselect-text .selectize-dropdown .option')
    .filter({ hasText: 'French (fr)' })
    .first();
  await frenchOption.waitFor({ state: 'visible', timeout: 5_000 });
  await frenchOption.click();

  // Click Ok to commit — this triggers setDataAtCell('multiselect_change').
  // #multiselect-modal is injected once per DH tab, so .first() selects the
  // open instance (jQuery's modal('show') always opens the first in the DOM).
  await page.locator('#multiselect-modal button[data-dismiss="modal"]').first().click();

  // beforeChange → setLocales() → dhConfirm "ADD LOCALE(s): French (fr)".
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

  // Verify the locales column now holds 'fr' in the Influenza source row.
  const localesValue = await page.evaluate(() => {
    const dh = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol   = dh.slot_name_to_column['name'];
    const localesCol = dh.slot_name_to_column['locales'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        return hot.getSourceDataAtCell(p, localesCol);
      }
    }
    return null;
  });
  expect(localesValue, 'Influenza locales should be "fr" after adding French').toBe('fr');

  // ── 4. Navigate to Slot tab and add French title for "authors" ──────────────
  // Switch to the Class tab and select the Influenza class so the Slot tab
  // is filtered to Influenza's fields.
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

  // Switch to Slot/Field tab.
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

  // Scroll until the "authors" slot_usage row ("Table field (from schema)") appears.
  // The slot_usage row is always visible when the Influenza class is selected.
  // Right-clicking it in the Slot tab still uses TRANSLATABLE['Slot'] (key_name='name'),
  // so the translation writes to fr.slots.authors.title — the global slot path.
  const authorsRowIdx = await scrollToSlotRow(page, 'authors', 'Table field (from schema)');
  expect(authorsRowIdx, '"authors" slot_usage row not found in Slot tab').not.toBe(-1);

  // KEY_COLUMNS for the Slot tab include slot_group (tds[2]), slot_type (tds[1]),
  // name (tds[3]) and more — a left-click on any of them opens the FKM.
  // However, SchemaEditor's afterOnCellMouseDown guard (event.button === 2)
  // skips the FKM for right-clicks, so go directly to right-click.
  const authorsGroupCell = slotCellLocator(page, authorsRowIdx, 2);
  await authorsGroupCell.scrollIntoViewIfNeeded();
  await authorsGroupCell.click({ button: 'right' });

  // Click the "Translations" context menu item.
  // The item is enabled because the Influenza schema row now has locales (fr).
  const translationsItem = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItem.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItem.click();

  // Wait for #translate-modal to open.
  // contentModals.html is injected once per DH tab so there are multiple
  // #translate-modal elements; jQuery modal('show') targets the first.
  await page.waitForFunction(
    () => document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  // The modal table has one row per locale.  The French (fr) title textarea
  // has data-path="fr.slots.authors.title".  Fill it with "Auteurs".
  const frTitleTextarea = page
    .locator('#translate-modal textarea[name="title"][data-path^="fr."]')
    .first();
  await frTitleTextarea.waitFor({ state: 'visible', timeout: 5_000 });
  await frTitleTextarea.fill('Auteurs');

  // Click Save to commit — translationUpdate() writes via nestedProperty.set().
  await page.locator('#translation-save').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // Verify: locales.fr.slots.authors.title = 'Auteurs' in the Schema row's
  // cell metadata (where all locale data for the loaded schema is stored).
  const authorsTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.slots?.authors?.title ?? null;
      }
    }
    return null;
  });
  expect(authorsTitle, 'French title for "authors" should be "Auteurs"').toBe('Auteurs');
});
