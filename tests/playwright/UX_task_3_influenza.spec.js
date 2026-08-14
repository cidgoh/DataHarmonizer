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
import { hotCellLocator, slotCellLocator, findSlotRowIndex, findRowIndex, scrollToSlotRow } from './playwright_utils.js';

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
  // Enable Expert User mode — required by translationForm() for slot_usage rows
  // because their translations are class-scoped, not global.
  await page.evaluate(() => {
    const cb = document.getElementById('schema_expert');
    if (cb && !cb.checked) cb.click();
  });
  await page.waitForTimeout(200);

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
  // Right-clicking it uses TRANSLATABLE['SlotUsage'] (class-scoped path),
  // so the translation writes to fr.classes.Influenza.slot_usage.authors.title.
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
  // has data-path="fr.classes.Influenza.slot_usage.authors.title".  Fill it with "Auteurs".
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

  // Verify: locales.fr.classes.Influenza.slot_usage.authors.title = 'Auteurs' in the
  // Schema row's cell metadata (where all locale data for the loaded schema is stored).
  const authorsTitle = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.classes?.Influenza?.slot_usage?.authors?.title ?? null;
      }
    }
    return null;
  });
  expect(authorsTitle, 'French title for "authors" should be "Auteurs"').toBe('Auteurs');

  // ── 5. Add French description for "authors" ──────────────────────────────────
  // Still in the Slot tab; authorsGroupCell is still in view from step 4.
  // Open the Translations modal a second time on the same row.
  await authorsGroupCell.scrollIntoViewIfNeeded();
  await authorsGroupCell.click({ button: 'right' });

  const translationsItem2 = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItem2.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItem2.click();

  await page.waitForFunction(
    () => document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  // The title textarea already shows "Auteurs" from step 4 and will be
  // re-saved unchanged; only the description textarea needs filling.
  const frDescription = 'Provenance des versions du logiciel et du modèle DataHarmonizer.';
  const frDescTextarea = page
    .locator('#translate-modal textarea[name="description"][data-path^="fr."]')
    .first();
  await frDescTextarea.waitFor({ state: 'visible', timeout: 5_000 });
  await frDescTextarea.fill(frDescription);

  await page.locator('#translation-save').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // Verify: locales.fr.classes.Influenza.slot_usage.authors.description is the French description.
  const authorsDesc = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.classes?.Influenza?.slot_usage?.authors?.description ?? null;
      }
    }
    return null;
  });
  expect(authorsDesc, 'French description for "authors" should be set').toBe(frDescription);

  // ── 6. Add French comments note for "authors" ────────────────────────────────
  // Re-open the Translations modal on the same authors row and fill the
  // "comments" textarea with a note about how the translation was generated.
  await authorsGroupCell.scrollIntoViewIfNeeded();
  await authorsGroupCell.click({ button: 'right' });

  const translationsItem3 = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItem3.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItem3.click();

  await page.waitForFunction(
    () => document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  const frComments = 'Translation generated via Google Translate.';
  const frCommentsTextarea = page
    .locator('#translate-modal textarea[name="comments"][data-path^="fr."]')
    .first();
  await frCommentsTextarea.waitFor({ state: 'visible', timeout: 5_000 });
  await frCommentsTextarea.fill(frComments);

  await page.locator('#translation-save').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // Verify: locales.fr.classes.Influenza.slot_usage.authors.comments contains the translation note.
  const authorsComments = await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Schema;
    const hot = dh?.hot;
    if (!hot || !dh) return null;
    const nameCol = dh.slot_name_to_column['name'];
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, nameCol) === 'Influenza') {
        const meta = hot.getCellMeta(p, 0);
        return meta?.locales?.fr?.classes?.Influenza?.slot_usage?.authors?.comments ?? null;
      }
    }
    return null;
  });
  expect(authorsComments, 'French comments for "authors" should contain translation note')
    .toBe(frComments);

  // ── 7. Add French title for "organism menu" (OrganismMenu enum) ─────────────
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

  // Use the HOT API to scroll OrganismMenu into the visible viewport.
  // Enum column order: col0=schema_id (frozen in .ht_clone_left), col1=name, col2=title, …
  await page.evaluate(() => {
    const dh  = window._appContext?.dhs?.Enum;
    const hot = dh?.hot;
    if (!hot || !dh) return;
    const n2c = dh.slot_name_to_column;
    for (let p = 0; p < hot.countSourceRows(); p++) {
      if (hot.getSourceDataAtCell(p, n2c['name']) === 'OrganismMenu') {
        const v = hot.toVisualRow(p);
        hot.scrollViewportTo(v, 0, false, false);
        break;
      }
    }
  });

  // Wait for the OrganismMenu row to appear in the rendered DOM.
  // In the Enum tab schema_id (col0) is hidden; 'name' (col1) is frozen in
  // .ht_clone_left — so look there at tds[0].
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

  // Find the DOM row index via .ht_clone_left (colIdx=0 → name column).
  const enumRowIdx = await findRowIndex(page, 0, 'OrganismMenu');
  expect(enumRowIdx, 'OrganismMenu DOM row not found in Enum tab').not.toBe(-1);

  // Right-click the frozen name cell (hotCellLocator col0 → .ht_clone_left td:nth-of-type(1)).
  const enumNameCell = hotCellLocator(page, enumRowIdx, 0);
  await enumNameCell.scrollIntoViewIfNeeded();
  await enumNameCell.click({ button: 'right' });

  // Click the 'Translations' context menu item.
  // The item is enabled because the Influenza Schema row has locales (fr) and
  // 'Enum' is listed in schemaEditor.TRANSLATABLE.
  const translationsItemEnum = page
    .locator('.htItemWrapper')
    .filter({ hasText: 'Translations' })
    .first();
  await translationsItemEnum.waitFor({ state: 'visible', timeout: 8_000 });
  await translationsItemEnum.click();

  await page.waitForFunction(
    () => document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );

  // Fill the French (fr) title textarea — data-path will be "fr.enums.OrganismMenu.title".
  const frEnumTitle = 'menu des organismes';
  const frEnumTitleTextarea = page
    .locator('#translate-modal textarea[name="title"][data-path^="fr."]')
    .first();
  await frEnumTitleTextarea.waitFor({ state: 'visible', timeout: 5_000 });
  await frEnumTitleTextarea.fill(frEnumTitle);

  await page.locator('#translation-save').first().click();
  await page.waitForFunction(
    () => !document.querySelector('#translate-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(300);

  // Verify: locales.fr.enums.OrganismMenu.title = 'menu des organismes' in the Schema row meta.
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
  expect(savedEnumTitle, 'French title for OrganismMenu should be "menu des organismes"').toBe(frEnumTitle);

  // ── 8. Save schema as YAML and verify all French locale entries ──────────────
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

  const influenzaRowIdxFinal = await findRowIndex(page, 0, 'Influenza');
  expect(influenzaRowIdxFinal, 'Influenza row not found in Schema tab for save').not.toBe(-1);

  // Intercept the window.prompt() that saveSchema() uses to collect the filename.
  page.once('dialog', async dialog => { await dialog.accept('schema.yaml'); });

  // Right-click the Influenza row → "Save as LinkML schema.yaml" → intercept download.
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

  // Parse the saved YAML and verify every French locale entry is present.
  // saveSchema() writes: extensions.locales = { tag: 'locales', value: metadata.locales }
  const saved   = YAML.parse(readFileSync(savedPath, 'utf8'));
  const locales = saved?.extensions?.locales?.value;

  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.title,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.title').toBe('Auteurs');
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.description,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.description').toBe(frDescription);
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.comments,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.comments').toBe(frComments);
  expect(locales?.fr?.enums?.OrganismMenu?.title,
    'Saved YAML: fr.enums.OrganismMenu.title').toBe(frEnumTitle);

  // Verify that unfilled translation fields are absent (not saved as empty strings).
  // translationUpdate() must skip nestedProperty.set() when the textarea is empty.
  expect(locales?.fr?.classes?.Influenza?.slot_usage?.authors?.examples,
    'Saved YAML: fr.classes.Influenza.slot_usage.authors.examples should be absent, not ""').toBeUndefined();
  expect(locales?.fr?.enums?.OrganismMenu?.description,
    'Saved YAML: fr.enums.OrganismMenu.description should be absent, not ""').toBeUndefined();
});
