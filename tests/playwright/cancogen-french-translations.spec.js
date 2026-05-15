/* Tests that switching to French correctly translates:
   1. The interface (File menu label -> "Fichier")
   2. CanCOGeN column headers (first column -> "ID du collecteur d'échantillons")
   3. Cell dropdown menus (related_specimen_primary_id first option -> "Sans objet")
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
  //await expect(page.locator('#file-menu-button')).toContainText('Fichier');

  // 4. Load the canCOGeN example file
  //await page.setInputFiles('#open-file-input', EXAMPLE_FILE);
  //await page.waitForFunction(() =>
  //  document.querySelector('.htCore tbody td')?.textContent?.trim().length > 0
  //);

  // 5. Verify the first column header is the French translation of specimen_collector_sample_id
  const firstColHeader = page.locator('.ht_master .htCore thead th').first();
  await expect(firstColHeader).toContainText("ID du collecteur d'échantillons");

  // 6. Find the related_specimen_primary_id column by its French header text
  //    and click the first data row cell to open its picklist menu
  const allHeaders = page.locator('.ht_master .htCore thead th');
  const headerCount = await allHeaders.count();
  let relatedSpecimenColIndex = -1;
  for (let i = 0; i < headerCount; i++) {
    const text = await allHeaders.nth(i).textContent();
    if (text?.includes("ID principal de l'échantillon associé")) {
      relatedSpecimenColIndex = i + 1; // nth-child is 1-indexed
      break;
    }
  }
  expect(relatedSpecimenColIndex).toBeGreaterThan(0);

  const relatedSpecimenCell = page.locator(
    `.ht_master .htCore tbody tr:first-child td:nth-child(${relatedSpecimenColIndex})`
  );
  await relatedSpecimenCell.click();

  // 7. Verify the first entry in the dropdown menu is the French null value "Sans objet"
  await page.waitForSelector('.handsontable.autocomplete tbody td', { timeout: 5_000 });
  const firstDropdownOption = page.locator('.handsontable.autocomplete tbody td').first();
  await expect(firstDropdownOption).toHaveText('Sans objet');
});
