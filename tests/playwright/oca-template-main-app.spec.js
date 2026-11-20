/* Test: OCA bundle loaded as a DataHarmonizer template (main app, not SchemaEditor)
 *
 *   1. Upload web/templates/oca_test/oca_bundle.json via Template > "... from file"
 *      (#upload-template-input).  Toolbar sniffs the OCA bundle, converts it to
 *      LinkML via ocaToLinkml(), and loads the ChickenGutHealth template.
 *   2. Enter valid values into each field of the first spreadsheet row,
 *      including several entries in each multivalued field.
 *   3. Validate — expect no errors.
 *   4. Save as .json and verify the saved record.
 *
 * Converted ChickenGutHealth fields (from the OCA overlays):
 *   Age       integer, required, pattern [0-9]{3}
 *   BreastWt  decimal
 *   Breed     enum Breed: B (Brahma) | S (Silkie) — dropdown shows labels, stores codes
 *   Farm      string, multivalued, required, pattern ^[A-Za-z]{1,50}$
 *   Glucose   decimal, multivalued (cardinality 1-4), required
 *   Lipase    decimal, recommended
 *   LiveWt    decimal, recommended
 *
 * To run this test:
 *   npx playwright test tests/playwright/oca-template-main-app.spec.js
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { readFileSync } from 'fs';

const OCA_FILE = path.resolve('web/templates/oca_test/oca_bundle.json');
const CLASS_NAME = 'ChickenGutHealth';

test('load OCA bundle as template, edit first row, save and verify', async ({ page }) => {
  test.setTimeout(60_000);

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  // ── 1. Load the app, then upload the OCA bundle as a template ──────────────
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });

  await page.setInputFiles('#upload-template-input', OCA_FILE);

  // Wait for the converted template's DH instance to be built and rendered.
  await page.waitForFunction(
    (className) => !!window._appContext?.dhs?.[className]?.hot,
    CLASS_NAME,
    { timeout: 20_000 }
  );
  await expect(page.locator('#oca-loaded-message')).toBeVisible({ timeout: 5_000 });
  // OCA label overlay "Bird Age" becomes the Age column title.
  await expect(
    page.getByRole('columnheader', { name: 'Bird Age' }).first()
  ).toBeVisible({ timeout: 10_000 });

  // ── 2. Enter valid values in the first row ─────────────────────────────────
  // Cells are filled through the UI.  Handsontable runs cell validators
  // asynchronously before committing a value, so under load a value can land
  // a moment after the edit: each check polls rather than reading once.  A
  // late re-render can also dismiss an editor, so each entry is retried.
  const COMMIT_WAIT = { timeout: 5_000 };
  const selectFirstRowCell = (slotName) => page.evaluate(([className, slotName]) => {
    const dh = window._appContext.dhs[className];
    dh.hot.selectCell(0, dh.slot_name_to_column[slotName]);
  }, [CLASS_NAME, slotName]);

  const getRowValues = () => page.evaluate((className) => {
    const dh = window._appContext.dhs[className];
    return Object.fromEntries(
      Object.entries(dh.slot_name_to_column).map(([name, col]) => [name, dh.hot.getDataAtCell(0, col)])
    );
  }, CLASS_NAME);

  // Multivalued cells may be normalised to '; ' spacing on entry.
  const split = (v) => String(v ?? '').split(';').map(s => s.trim());

  // Plain cells: select the cell, open the editor, type, press Enter.
  const typeIntoCell = async (slotName, value) => {
    await expect(async () => {
      await page.keyboard.press('Escape');       // drop any half-open editor
      await selectFirstRowCell(slotName);
      await page.keyboard.press('Enter');        // open the editor
      await page.keyboard.press('Control+A');
      await page.keyboard.type(value);
      await page.keyboard.press('Enter');        // commit
      await expect.poll(async () => (await getRowValues())[slotName], COMMIT_WAIT).toBe(value);
    }).toPass({ timeout: 30_000 });
  };

  // Multivalued cells open #multiselect-modal (a Selectize chip input) instead
  // of an inline editor.  Free-text multivalued fields allow creating chips:
  // type each entry followed by the ';' delimiter, then click Ok to commit.
  // (Selectize's Enter only creates a chip once its dropdown has opened, which
  // DH delays after the modal is shown; the delimiter key creates it directly.)
  const typeIntoMultivaluedCell = async (slotName, values) => {
    await expect(async () => {
      // Clear the cell so a retry starts with no leftover chips.
      await page.evaluate(([className, slotName]) => {
        const dh = window._appContext.dhs[className];
        dh.hot.setDataAtCell(0, dh.slot_name_to_column[slotName], '');
      }, [CLASS_NAME, slotName]);
      await selectFirstRowCell(slotName);
      await page.keyboard.press('Enter');
      await expect(page.locator('#multiselect-modal.show')).toBeVisible({ timeout: 5_000 });
      await page.locator('#multiselect-text .selectize-input input').click();
      for (const value of values) {
        await page.keyboard.type(value + ';');   // ';' creates the chip
      }
      await page.locator('#multiselect-modal button[data-dismiss="modal"]').first().click();
      // Wait for the modal to finish closing so it can't eat the next keystrokes.
      await expect(page.locator('#multiselect-modal.show')).toHaveCount(0, { timeout: 5_000 });
      await expect(page.locator('.modal-backdrop')).toHaveCount(0, { timeout: 5_000 });
      await expect.poll(async () => split((await getRowValues())[slotName]), COMMIT_WAIT).toEqual(values);
    }).toPass({ timeout: 45_000 });
  };

  // Picklist cells: the dropdown lists labels (Brahma, Silkie) while the cell
  // stores the code (B, S).
  const pickFromDropdown = async (slotName, label, code) => {
    await expect(async () => {
      await page.keyboard.press('Escape');
      await selectFirstRowCell(slotName);
      await page.keyboard.press('Enter');
      const option = page.locator('div.handsontableEditor.listbox td').filter({ hasText: label }).first();
      await expect(option).toBeVisible({ timeout: 2_000 });
      await option.click({ timeout: 2_000 });
      await expect.poll(async () => (await getRowValues())[slotName], COMMIT_WAIT).toBe(code);
    }).toPass({ timeout: 30_000 });
  };

  await typeIntoCell('Age', '120');
  await typeIntoCell('BreastWt', '250.5');
  await pickFromDropdown('Breed', 'Brahma', 'B');
  // Multivalued fields take several entries.  Each Farm entry must match
  // ^[A-Za-z]{1,50}$; Glucose allows 1-4 decimal values.
  await typeIntoMultivaluedCell('Farm', ['Alpha', 'Bravo', 'Charlie']);
  await typeIntoMultivaluedCell('Glucose', ['5.2', '6.15', '4.8']);
  await typeIntoCell('Lipase', '310');
  await typeIntoCell('LiveWt', '1450');

  const rowValues = await getRowValues();
  expect(rowValues).toMatchObject({ Age: '120', BreastWt: '250.5', Breed: 'B', Lipase: '310', LiveWt: '1450' });
  expect(split(rowValues.Farm)).toEqual(['Alpha', 'Bravo', 'Charlie']);
  expect(split(rowValues.Glucose)).toEqual(['5.2', '6.15', '4.8']);

  // ── 3. Validate — the row (including multivalued cells) has no errors ──────
  await page.click('#validate-btn');
  await expect(page.locator('#no-error-button')).toBeVisible({ timeout: 10_000 });
  const invalidCells = await page.evaluate((className) => {
    const dh = window._appContext.dhs[className];
    return dh.invalid_cells ?? null;
  }, CLASS_NAME);
  expect(invalidCells?.[0] ?? {}, 'first row should have no invalid cells').toEqual({});

  // ── 4. Save as JSON and verify the saved record ─────────────────────────────
  await page.click('#file-menu-button');
  await page.click('#save-as-dropdown-item');
  await page.waitForSelector('#save-as-modal.show');
  await page.fill('#base-name-save-as-input', 'oca-test-output');
  await page.selectOption('#file-ext-save-as-select', 'json');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#save-as-confirm-btn'),
  ]);

  // Per-test output path, so parallel/repeated runs don't overwrite each other.
  const outputFile = test.info().outputPath('oca-test-output.json');
  await download.saveAs(outputFile);
  console.log(`Data saved to: ${outputFile}`);

  const saved = JSON.parse(readFileSync(outputFile, 'utf8'));
  expect(saved.schema).toBe('https://example.com/ChickenGutHealth');

  const records = saved.container?.[`${CLASS_NAME}Data`];
  expect(records, 'ChickenGutHealthData records in saved JSON').toHaveLength(1);

  const record = records[0];
  expect(record.Age).toBe(120);
  expect(record.BreastWt).toBe(250.5);
  expect(record.Lipase).toBe(310);
  expect(record.LiveWt).toBe(1450);
  // Multivalued fields are saved as arrays.
  expect(record.Farm).toEqual(['Alpha', 'Bravo', 'Charlie']);
  expect(record.Glucose).toEqual([5.2, 6.15, 4.8]);
  // Picklist value saved as its code.
  expect(record.Breed).toBe('B');
});

// ── Test 2: French overlays become a selectable locale ───────────────────────
// The bundle's "fra" meta/label/information overlays are converted into
// schema.extensions.locales.fr, so selecting French re-labels the columns.

test('OCA bundle French overlays: switch to French and verify column titles', async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[BROWSER error]', msg.text());
  });

  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.setInputFiles('#upload-template-input', OCA_FILE);
  await page.waitForFunction(
    (className) => !!window._appContext?.dhs?.[className]?.hot,
    CLASS_NAME,
    { timeout: 20_000 }
  );
  await expect(page.getByRole('columnheader', { name: 'Bird Age' }).first()).toBeVisible({ timeout: 10_000 });

  // The converted template should advertise the French locale.
  const locales = await page.evaluate(() => window._appContext.template.locales);
  expect(locales).toContain('fr');

  await page.selectOption('#select-translation-localization', 'fr');

  // French label overlay titles replace the English ones.
  await expect(page.getByRole('columnheader', { name: "Age de l'animal" }).first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('columnheader', { name: 'Poids vif' }).first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Bird Age' })).toHaveCount(0);
});

// ── Test 3: units shown in the column help ───────────────────────────────────
// The OCA unit overlay becomes each slot's LinkML unit.ucum_code, which is
// listed as "Unit" in the column help (not in the column header itself).

test('OCA bundle units: shown in column help, not in column header', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.setInputFiles('#upload-template-input', OCA_FILE);
  await page.waitForFunction(
    (className) => !!window._appContext?.dhs?.[className]?.hot,
    CLASS_NAME,
    { timeout: 20_000 }
  );

  // .ht_master's header row is hidden behind Handsontable's top clone, so
  // use whichever copy is visible.
  const glucoseHeader = page
    .locator('th.secondary-header-cell[data-ref="Glucose Concentration"] .secondary-header-text')
    .filter({ visible: true }).first();
  await expect(glucoseHeader).toHaveText('Glucose Concentration');

  // contentModals.html is injected once per DH instance, so ids repeat;
  // scope to the open modal.
  await glucoseHeader.click();
  const help = page.locator('#field-description-modal.show #field-description-text');
  await expect(help).toContainText('Glucose Concentration');
  await expect(help).toContainText('Unit: mmol/L');
});
