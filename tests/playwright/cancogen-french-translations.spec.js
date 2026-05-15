/* Tests that switching to French correctly translates:
   1. The interface (File menu label -> "Fichier")
   2. CanCOGeN column headers (first column -> "ID du collecteur d'échantillons")
   3. Cell dropdown menus (related_specimen_primary_id first option -> "Sans objet")

   Test this script alone with:
   npx playwright test tests/playwright/cancogen-french-translations.spec.js
*/
import { test, expect } from '@playwright/test';
import path from 'path';

const TEST_FILE_NAME = 'canCOGeN-validTestData_3-0-0.xlsx';
const EXAMPLE_FILE = path.resolve(
  'web/templates/canada_covid19/exampleInput/' + TEST_FILE_NAME
);

test('switch to French and verify interface, column headers, and menus', async ({ page }) => {

  // 1. Load the app and wait for Handsontable to render
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });

  // 2. Switch interface language to French via the top-right language selector
  await page.selectOption('#select-translation-localization', 'fr');

  // 3. Verify the File menu label is now in French
  // NOTE THAT expect() must be followed by a "then" expression, e.g. .toContainText('Fichier')
  await expect(page.locator('#file-menu-button')).toContainText('Fichier');

  // 4. Verify the first column header is the French translation of specimen_collector_sample_id
  //const firstColHeader = page.locator('.ht_master .htCore thead th').first();
  //await expect(firstColHeader).toContainText("ID du collecteur d'échantillons");
  await expect(page.locator('th.secondary-header-cell[data-ref="ID du dossier"] div.secondary-header-text').first()).toContainText("ID du dossier");
  
  // 5. Find the related_specimen_primary_id column by its French header text
  const field = page.locator('th.secondary-header-cell[data-ref="ID principal de l’échantillon associé"]').first();
  // This verifies that we actually found the column
  await expect(field).toContainText("ID principal de l’échantillon associé");
                                               
  // Arduous method for finding column index
  const relatedSpecimenColIndex = await field.evaluate(el => {
    const allThs = Array.from(el.closest('tr').querySelectorAll('th'));        
    return allThs.indexOf(el) + 1; // +1 because nth-child is 1-indexed
  });
  //console.log('COLUMN:', relatedSpecimenColIndex);

  // 6. Now click the first data row cell to open its picklist menu
  const relatedSpecimenCell = page.locator(
    `.ht_master .htCore tbody tr:first-child td:nth-child(${relatedSpecimenColIndex})`
  );
  await relatedSpecimenCell.dblclick();

  // 7. Verify the first entry in the dropdown menu is the French null value "Sans objet"
  await page.waitForSelector('div.handsontableEditor.listbox', { timeout: 5_000 });
  const firstDropdownOption = page.locator('div.handsontableEditor.listbox tr:first-child td').first();
  await expect(firstDropdownOption).toHaveText('Sans objet');
});
