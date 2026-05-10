/* Claude built this (with some human edits afterward to make it work) in response to request: "is there a way to build some browser based unit testing with simple user actions, for example, 
  - running "yarn dev" or a webserver 
  - then a test to load localhost:8080
  - then to click on "file > Data > Open"
  - select the cancogen exampleInput/canCOGeN-validTestData_3-0-0.xlsx file
  - and perform a further action such as edit a cell's data
  - then "file > Data > Save As" 
  - and be able to compare saved file with some standard file?"

  Note, to see test, modify root folder playwrite.config.js and edit the headless:false attribute
*/
import { test, expect } from '@playwright/test';
  import path from 'path';
  import { readFileSync } from 'fs';
  import { read as xlsxRead, utils as XlsxUtils } from 'xlsx';

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

    //.ht_master.handsontable table > tbody tr:nth-child(1) td:nth-child(5)
    // 3. Click on a specific cell (row 0, col 0 = first data cell) and edit it
    //const firstCell = page.locator('.htCore tbody tr:first-child td:first-child');
    const firstCell = page.locator('.ht_master.handsontable table > tbody tr:nth-child(1) td:nth-child(3)');
    await firstCell.dblclick();                    // enters edit mode
    await page.keyboard.press('Control+A');        // select existing content
    await page.keyboard.type('EDITED_VALUE');
    await page.keyboard.press('Enter');            // commit

    // 4. Save As — open the modal via the dropdown
    await page.click('#file-menu-button');    // navigate File > Data > Save As
    await page.click('#save-as-dropdown-item');    // or navigate File > Data > Save As
    await page.waitForSelector('#save-as-modal.show');
    await page.fill('#base-name-save-as-input', 'test-output');
    await page.selectOption('#file-ext-save-as-select', 'xlsx');

    // 5. Capture the download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#save-as-confirm-btn'),
    ]);

    const savedPath = await download.path();

    // Uncomment to take a peek at downloaded xlsx to see where change was made etc.
    const OUTPUT_FILE = path.resolve('test-results/' + TEST_FILE_NAME);
    await download.saveAs(OUTPUT_FILE);
    console.log(`File saved to: ${OUTPUT_FILE}`);

    // 6. Compare: parse saved xlsx and assert the edited cell value
    const wb = xlsxRead(readFileSync(savedPath));
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XlsxUtils.sheet_to_json(ws, { header: 1 });

    // Find first data row (skip section header + column header rows)
    const dataRow = rows.find(r => r[1] === 'EDITED_VALUE');
    expect(dataRow).toBeTruthy();

    // 7. Optionally compare full output against a known-good fixture
    // const fixture = xlsxRead(readFileSync('tests/fixtures/expected-output.xlsx'));
    // ... cell-by-cell comparison ...
  });
