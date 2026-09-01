/* Tests for the DataHarmonizer main application (not SchemaEditor) using the
 * CanCOGeN COVID-19 template:
 *
 *   1. load canCOGeN file, edit a cell, save and verify
 *      Loads an example xlsx, edits a cell, saves as xlsx, and verifies the
 *      edited value is present in the downloaded file.
 *
 *   2. switch to French and verify interface, column headers, and menus
 *      Switches the locale to French and confirms the File menu label, a
 *      French column header, and picklist values are all translated.
 *
 * Run all:
 *   npx playwright test tests/playwright/cancogen-main-app.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync } from 'fs';
import { read as xlsxRead, utils as XlsxUtils } from 'xlsx';

// ── Test 1: load, edit, save, verify ─────────────────────────────────────────

const TEST_FILE_NAME = 'canCOGeN-validTestData_3-0-0.xlsx';
const EXAMPLE_FILE = path.resolve(
  'web/templates/canada_covid19/exampleInput/' + TEST_FILE_NAME
);

test('load canCOGeN file, edit a cell, save and verify', async ({ page }) => {

  // 1. Load the app and wait for Handsontable to render
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });

  // 2. Open the file — trigger the hidden file input directly,
  //    no need to navigate through File > Open menu
  await page.setInputFiles('#open-file-input', EXAMPLE_FILE);

  // Wait for data to load (first data cell becomes non-empty)
  await page.waitForFunction(() =>
    document.querySelector('.htCore tbody td')?.textContent?.trim().length > 0
  );

  // 3. Click on a specific cell (row 0, col 2) and edit it
  const firstCell = page.locator('.ht_master.handsontable table > tbody tr:nth-child(1) td:nth-child(3)');
  await firstCell.dblclick();                    // enters edit mode
  await page.keyboard.press('Control+A');        // select existing content
  await page.keyboard.type('EDITED_VALUE');
  await page.keyboard.press('Enter');            // commit

  // 4. Save As — open the modal via the dropdown
  await page.click('#file-menu-button');
  await page.click('#save-as-dropdown-item');
  await page.waitForSelector('#save-as-modal.show');
  await page.fill('#base-name-save-as-input', 'test-output');
  await page.selectOption('#file-ext-save-as-select', 'xlsx');

  // 5. Capture the download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#save-as-confirm-btn'),
  ]);
  const savedPath = await download.path();

  const OUTPUT_FILE = path.resolve('test-results/' + TEST_FILE_NAME);
  await download.saveAs(OUTPUT_FILE);
  console.log(`File saved to: ${OUTPUT_FILE}`);

  // 6. Parse saved xlsx and assert the edited cell value is present
  const wb = xlsxRead(readFileSync(savedPath));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XlsxUtils.sheet_to_json(ws, { header: 1 });

  // Find first data row (skip section header + column header rows)
  const dataRow = rows.find(r => r[1] === 'EDITED_VALUE');
  expect(dataRow).toBeTruthy();
});

// ── Test 2: French locale ─────────────────────────────────────────────────────

test('switch to French and verify interface, column headers, and menus', async ({ page }) => {

  // 1. Load the app and wait for Handsontable to render
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });

  // 2. Switch interface language to French via the top-right language selector
  await page.selectOption('#select-translation-localization', 'fr');

  // 3. Verify the File menu label is now in French
  await expect(page.locator('#file-menu-button')).toContainText('Fichier');

  // 4. Verify a French column header is visible
  await expect(
    page.locator('th.secondary-header-cell[data-ref="ID du dossier"] div.secondary-header-text').first()
  ).toContainText('ID du dossier');

  // 5. Find the related_specimen_primary_id column by its French header text
  const field = page.locator('th.secondary-header-cell[data-ref="ID principal de l\u2019\u00e9chantillon associ\u00e9"]').first();
  await expect(field).toContainText("ID principal de l\u2019\u00e9chantillon associ\u00e9");

  const relatedSpecimenColIndex = await field.evaluate(el => {
    const allThs = Array.from(el.closest('tr').querySelectorAll('th'));
    return allThs.indexOf(el) + 1; // +1 because nth-child is 1-indexed
  });

  // 6. Click the first data row cell to open its picklist menu
  const relatedSpecimenCell = page.locator(
    `.ht_master .htCore tbody tr:first-child td:nth-child(${relatedSpecimenColIndex})`
  );
  await relatedSpecimenCell.dblclick();

  // 7. Verify the French null value "Sans objet" appears in the dropdown menu.
  //    The list is sorted alphabetically so "Sans objet" is not necessarily first.
  await page.waitForSelector('div.handsontableEditor.listbox', { timeout: 5_000 });
  const dropdownOptions = page.locator('div.handsontableEditor.listbox td');
  await expect(dropdownOptions.filter({ hasText: 'Sans objet' }).first()).toBeVisible();
});
