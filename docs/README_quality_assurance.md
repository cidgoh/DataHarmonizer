# DataHarmonizer Quality Assurance

Browser-based end-to-end (E2E) testing for DataHarmonizer using [Playwright](https://playwright.dev/).

---

## Overview

Playwright drives a real browser against the running webpack dev server, making it possible to test complete user workflows: loading a template, opening a data file, editing cells, saving, and verifying the output file contents. Tests are written in JavaScript and run via `yarn test:e2e`.

---

## Why Playwright

| Feature | Playwright | Cypress | Puppeteer |
|---------|-----------|---------|-----------|
| Auto-starts dev server | ✓ built-in | ✓ plugin | manual |
| File upload (no OS dialog) | `setInputFiles()` | `.selectFile()` | manual |
| Download capture + read | `waitForEvent('download')` | intercept + readFile | manual |
| Browsers | Chrome / Firefox / WebKit | Chrome / Firefox (limited) | Chrome only |
| Handsontable cell interaction | straightforward | straightforward | low-level |

---

## Installation

```bash
yarn add --dev @playwright/test
npx playwright install chromium
```

Chromium alone is sufficient for local development. Add `firefox` and `webkit` for CI coverage.

---

## Configuration

Create `playwright.config.js` at the project root (omit the word "javascript"):

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  // Starts yarn dev and waits for it before any test runs.
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,   // set false while writing tests to watch
  },
});
```

Add a script to `package.json`:

```json
"scripts": {
  "test:playwright": "playwright tests/playwright"
}
```

`yarn playwright test` is then the single command — it starts the dev server, runs all tests, and shuts it down.

---

## Writing Tests

### Basic structure

```javascript
// tests/e2e/example.spec.js
import { test, expect } from '@playwright/test';

test('description of workflow', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  // ... interactions ...
});
```

### File inputs

Playwright intercepts file inputs directly without requiring an OS file dialog:

```javascript
await page.setInputFiles('#open-file-input', '/path/to/file.xlsx');
```

To test the actual menu path and capture the file chooser event:

```javascript
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.click('text=Open'),
]);
await fileChooser.setFiles('/path/to/file.xlsx');
```

### Handsontable cell interaction

```javascript
// Double-click enters edit mode; Enter commits.
const cell = page.locator('.htCore tbody tr:first-child td:first-child');
await cell.dblclick();
await page.keyboard.press('Control+A');
await page.keyboard.type('NEW_VALUE');
await page.keyboard.press('Enter');
```

For picklist cells, wait for the dropdown to appear before typing or clicking an option.

### Capturing downloads

```javascript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#save-as-confirm-btn'),
]);
const savedPath = await download.path();
```

### Comparing xlsx output

The `xlsx` library is already a project dependency:

```javascript
import { readFileSync } from 'fs';
import { read as xlsxRead, utils as XlsxUtils } from 'xlsx';

const wb = xlsxRead(readFileSync(savedPath));
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XlsxUtils.sheet_to_json(ws, { header: 1 });
```

For TSV/CSV, a plain string comparison after normalising line endings is sufficient.

---

## Example Tests

### Load, edit, save, and verify

```javascript
// tests/e2e/cancogen-load-edit-save.spec.js
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

  // 2. Open the example file
  await page.setInputFiles('#open-file-input', EXAMPLE_FILE);
  await page.waitForFunction(() =>
    document.querySelector('.htCore tbody td')?.textContent?.trim().length > 0
  );

  // 3. Edit the first data cell
  const firstCell = page.locator('.ht_master.handsontable table > tbody tr:nth-child(1) td:nth-child(3)');
  await firstCell.dblclick();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('EDITED_VALUE');
  await page.keyboard.press('Enter');

  // 4. Open Save As modal
  await page.click('#file-menu-button');    // navigate File > Data > Save As
  await page.click('#save-as-dropdown-item');
  await page.waitForSelector('#save-as-modal.show');
  await page.fill('#base-name-save-as-input', 'test-output');
  await page.selectOption('#file-ext-save-as-select', 'xlsx');

  // 5. Save and capture the downloaded file
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#save-as-confirm-btn'),
  ]);
  const savedPath = await download.path();

  // Uncomment to take a peek at downloaded xlsx to see where change was made etc.
  const OUTPUT_FILE = path.resolve('test-results/' + TEST_FILE_NAME);
  await download.saveAs(OUTPUT_FILE);
  console.log(`File saved to: ${OUTPUT_FILE}`);

  // 6. Parse and assert
  const wb = xlsxRead(readFileSync(savedPath));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XlsxUtils.sheet_to_json(ws, { header: 1 });

  const editedRow = rows.find(r => r[0] === 'EDITED_VALUE');
  expect(editedRow).toBeTruthy();

  // 7. Full fixture comparison (regenerate with UPDATE_FIXTURES=1 when schema changes)
  // const fixture = xlsxRead(readFileSync('tests/fixtures/expected-output.xlsx'));
  // const fixtureRows = XlsxUtils.sheet_to_json(fixture.Sheets[fixture.SheetNames[0]], { header: 1 });
  // expect(rows).toEqual(fixtureRows);
});
```

### Locale hint on mismatched file language

```javascript
// tests/e2e/locale-hint.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';

const ENGLISH_FILE = path.resolve(
  'web/templates/canada_covid19/exampleInput/canCOGeN-validTestData_3-0-0.xlsx'
);

test('shows locale hint when loading English file in French mode', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.htCore');

  // Switch interface to French
  await page.selectOption('#select-translation-localization', 'fr');
  await page.waitForSelector('.htCore');

  // Load the English example file
  await page.setInputFiles('#open-file-input', ENGLISH_FILE);

  // The alert dialog should appear with a locale hint
  const dialogBody = page.locator('#dh-dialog-body');
  await expect(dialogBody).toContainText('header(s) match the');
  await expect(dialogBody).toContainText('English');
});
```

---

## Fixture Files

Store known-good output files in `tests/fixtures/`. Compare saved output against them to catch regressions.

Regenerate fixtures intentionally when the schema changes:

```bash
UPDATE_FIXTURES=1 yarn test:e2e
```

Implement the regeneration branch inside each test:

```javascript
if (process.env.UPDATE_FIXTURES) {
  fs.copyFileSync(savedPath, 'tests/fixtures/expected-output.xlsx');
} else {
  // compare against fixture
}
```

---

## Authoring Tips

- Run `playwright test --headed --slowmo=500` while writing tests to watch the browser in real time.
- Use `await page.pause()` to drop into Playwright's interactive inspector mid-test.
- The `webServer.reuseExistingServer` option means if `yarn dev` is already running, Playwright will use it rather than starting a second instance — useful during active development.
- Handsontable's grid uses `dblclick()` to enter edit mode for most cell types. Picklist cells may require waiting for the dropdown overlay before interacting.
- For tsv/csv output comparison, normalise line endings (`\r\n` → `\n`) before comparing strings to avoid platform-specific failures.
