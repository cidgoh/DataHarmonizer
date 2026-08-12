# DataHarmonizer Playwright Test Guide

Learnings from writing and debugging Playwright tests against the DataHarmonizer
Schema Editor and main DataHarmonizer grid. Use this as a reference when writing
new tests.

---

## Setup and startup

**Start the dev server before running tests:**
```bash
yarn dev          # typically http://localhost:8080
npx playwright test tests/playwright/some.spec.js
```

**`playwright.config.js`** sets `baseURL` and `headless`. Set `headless: false`
while writing/debugging a test.

**Per-test timeout:** Complex tests need longer timeouts. Set it inside the test:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(60_000);
  ...
});
```

---

## Page load and initial wait

### DataHarmonizer main grid (`/`)
```javascript
await page.goto('/');
await page.waitForSelector('.htCore', { timeout: 15_000 });
```

### Schema Editor (`/schema_editor.html`)
Wait for the loading spinner to disappear, then confirm the HOT grid and a known
column header are rendered:
```javascript
await page.goto('/schema_editor.html');
await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
await page.waitForSelector('.htCore', { timeout: 15_000 });

// Wait until HOT has loaded column headers
await page.waitForFunction(
  () => {
    const spans = document.querySelectorAll('.htCore th span');
    return Array.from(spans).some(s => s.textContent.trim() === 'Schema ID');
  },
  null,
  { timeout: 15_000 }
);
```

### Uploading a schema file to the Schema Editor
```javascript
const sourceFile = path.resolve('web/templates/canada_covid19/schema.yaml');
await page.setInputFiles('#schema_upload', sourceFile);

// Wait for a known class name to appear in the Class tab's frozen left column
await page.waitForFunction(
  () => Array.from(
    document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td')
  ).some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'CanCOGeN_Covid-19'),
  null,
  { timeout: 30_000 }
);
```

### Opening a data file in the main DH grid
Trigger the hidden file input directly — no need to navigate the File menu:
```javascript
await page.setInputFiles('#open-file-input', EXAMPLE_FILE);

// Wait for data to load
await page.waitForFunction(() =>
  document.querySelector('.htCore tbody td')?.textContent?.trim().length > 0
);
```

---

## HOT (Handsontable) DOM structure

### The three clone zones

| Selector | Contents |
|---|---|
| `.ht_clone_left` | Frozen left columns (col 0 in Schema/Class/Slot tabs) |
| `.ht_master`     | Scrollable main area (all unfrozen columns) |
| `.ht_clone_top`  | Frozen header rows |

**Important:** frozen columns rendered in `.ht_clone_left` are NOT interactive
through `.ht_master` — clicking `.ht_master td` for col 0 hits an invisible
placeholder cell.

### Row structure — `<th>` before `<td>`

Every HOT `<tr>` starts with a `<th>` row-number header, then data `<td>`
elements. Always use `td:nth-of-type(N)` (counts only `<td>` siblings) instead
of `td:nth-child(N)` (which counts `<th>` too):

```javascript
// CORRECT — skips the leading <th>
row.locator('td:nth-of-type(2)')

// WRONG — td:nth-child(2) selects the first <td>, not the second
row.locator('td:nth-child(2)')
```

### Schema Editor tab column layouts

**Schema tab** (`#tab-bar-Schema`):

| colIdx | HOT col | Location | Field |
|---|---|---|---|
| 0 | 0 | `.ht_clone_left` | Schema ID (name) |
| 1 | 1 | `.ht_master` td 2 | (first non-frozen col) |
| 2 | 2 | `.ht_master` td 3 | Title |

**Class tab** (`#tab-bar-Class`):

| colIdx | HOT col | Location | Field |
|---|---|---|---|
| 0 | 0 | `.ht_clone_left` | Table ID (name) |
| 1 | 1 | `.ht_master` td 2 | Title |

**Slot (Field) tab** (`#tab-bar-Slot`) — col 0 (`schema_id`) is hidden and
frozen; `.ht_master tds[0]` is an empty placeholder:

| `.ht_master` td index | Field |
|---|---|
| 0 | placeholder (frozen class_id in `.ht_clone_left`) |
| 1 | slot_type ("Type") |
| 2 | slot_group ("Section") |
| 3 | name ("Field ID") |
| 4 | rank ("Ordering") |
| 5 | slot_uri ("Semantic URI") |
| 6 | title ("Title") |
| 7 | description ("Description") |

### Stripping the dropdown arrow character

HOT prepends `▼` (U+25BC) to dropdown/autocomplete cell text. Strip it before
any text comparison:

```javascript
function hotText(td) {
  return td.textContent.replace(/\u25bc/g, '').trim();
}
```

---

## Tab switching

### Activating a tab
```javascript
await page.click('#tab-bar-Slot > a');
await page.waitForFunction(
  () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
  null,
  { timeout: 5_000 }
);
```

### Bootstrap 4 fade animation race condition

During tab transitions Bootstrap 4 keeps **both** the old and new pane with
`.show` for the duration of the CSS fade. Queries scoped to `.tab-pane.show`
will hit both panes. Wait for the animation to finish:

```javascript
await page.waitForFunction(
  () => document.querySelectorAll('.tab-pane.show').length === 1,
  null,
  { timeout: 5_000 }
);
```

### Tab switch to make newly inserted rows visible

When a new slot_usage row is inserted via the Field Key Modal, it may still be
hidden by the `tabFilter` from a prior hide/show cycle. Switching away and back
triggers `shown.bs.tab → tabChange → refreshTabDisplay → tabFilter`, which calls
`showRows()` for all rows that pass the current key filter:

```javascript
// Switch away then back to Slot tab to trigger refreshTabDisplay
await page.click('#tab-bar-Schema > a');
await page.waitForFunction(
  () => document.querySelector('#tab-bar-Schema .nav-link')?.classList.contains('active'),
  null, { timeout: 5_000 }
);
await page.waitForTimeout(300);

await page.click('#tab-bar-Slot > a');
await page.waitForFunction(
  () => document.querySelector('#tab-bar-Slot .nav-link')?.classList.contains('active'),
  null, { timeout: 5_000 }
);
await page.waitForTimeout(600); // allow tabFilter + DOM render to complete
```

---

## Cell locator helpers

### `hotCellLocator(page, rowIndex, colIdx)` — Schema and Class tabs

Routes col 0 to `.ht_clone_left` and all other cols to `.ht_master`:

```javascript
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
```

### `slotCellLocator(page, rowIndex, colIdx)` — Slot tab

All Slot tab interaction goes through `.ht_master` using the td index from the
column layout table above:

```javascript
function slotCellLocator(page, rowIndex, colIdx) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}
```

### `findRowIndex(page, colIdx, text)` — visual row index by cell content

```javascript
async function findRowIndex(page, colIdx, text) {
  return page.evaluate(
    ([colIdx, text]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const rows = document.querySelectorAll(
        `.tab-pane.show ${clone}.handsontable tbody tr`
      );
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        const nth = colIdx === 0 ? 0 : colIdx;
        if (tds[nth] && hotText(tds[nth]) === text) return i;
      }
      return -1;
    },
    [colIdx, text]
  );
}
```

### `findSlotRowIndex(page, name, slotTypeTitle)` — Slot tab row by name + type

```javascript
async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show');
      const rows = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds = rows[i].querySelectorAll('td');
        if (tds[3] && hotText(tds[3]) === name &&
            tds[1] && hotText(tds[1]) === slotTypeTitle) return i;
      }
      return -1;
    },
    [name, slotTypeTitle]
  );
}
```

`slotTypeTitle` values for the Slot tab:
- `'Schema field'` — base slot row (class_id = '')
- `'Table field (from schema)'` — slot_usage row
- `'Table field (stand-alone)'` — attribute row

---

## Cell editing

### Entering edit mode

```javascript
// Click to select, then dblclick to enter edit mode
await cell.click();
await cell.dblclick();
await page.keyboard.type('new value');
await page.keyboard.press('Tab');   // commit and move right
// or:
await page.keyboard.press('Enter'); // commit and move down
```

For cells that are already selected (e.g., after a Tab press), a single
`dblclick()` is sufficient to enter edit mode.

### Text field edits

```javascript
await cell.dblclick();
await page.keyboard.press('Control+A'); // select existing text
await page.keyboard.type('EDITED_VALUE');
await page.keyboard.press('Enter');
```

### Dropdown / autocomplete cells

`dblclick()` opens the inline editor. Either `keyboard.type()` to filter, or
wait for the listbox and click an option:

```javascript
await cell.dblclick();
await page.waitForSelector('div.handsontableEditor.listbox', { timeout: 5_000 });
const firstOption = page.locator('div.handsontableEditor.listbox tr:first-child td').first();
await expect(firstOption).toHaveText('Sans objet');
// or click it:
await firstOption.click();
```

### Checkbox cells — use `hot.setDataAtCell()` instead of DOM click

In headless mode, clicking a HOT checkbox `<td>` usually only **selects** the
cell — it does not toggle the value. Use `hot.setDataAtCell()` via
`page.evaluate()`:

```javascript
await page.evaluate(() => {
  const dh  = window._appContext?.dhs?.Slot;
  const hot = dh?.hot;
  if (!hot || !dh) return;
  const n2c = dh.slot_name_to_column;
  for (let p = 0; p < hot.countSourceRows(); p++) {
    if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
        hot.getSourceDataAtCell(p, dh.slot_name_column) === 'case_id') {
      const v = hot.toVisualRow(p);
      hot.setDataAtCell(v, n2c['required'],    true,  'cascade_confirm');
      hot.setDataAtCell(v, n2c['recommended'], false, 'cascade_confirm');
      break;
    }
  }
});
await page.waitForTimeout(300);
```

`'cascade_confirm'` source tag bypasses the inherited-cell-edit dialog and other
re-entrant hooks that should only fire on genuine user input.

---

## HOT virtual rendering and scrollViewportTo

HOT only renders rows within ~30 rows of the current scroll position. A row that
exists in the data model may not be in the DOM.

**Problem:** After a tab switch or FKM confirm, the new row may be off-screen.

**Solution:** Use `hot.scrollViewportTo()` to bring it into the rendered range,
then wait briefly for HOT to paint:

```javascript
const visualRow = await page.evaluate(() => {
  const dh  = window._appContext?.dhs?.Slot;
  const hot = dh?.hot;
  if (!hot) return -1;
  for (let p = 0; p < hot.countSourceRows(); p++) {
    if (hot.getSourceDataAtCell(p, dh.slot_type_column) === 'slot_usage' &&
        hot.getSourceDataAtCell(p, dh.slot_name_column) === 'my_field') {
      const v = hot.toVisualRow(p);
      hot.scrollViewportTo({ row: v, col: 0 });
      return v;
    }
  }
  return -1;
});
await page.waitForTimeout(400); // let HOT render newly-visible rows
```

---

## `window._appContext` — test diagnostics

`web/index.js` exposes `window._appContext = context` for Playwright test use.

**Important:** Do not remove this line — several tests depend on it.

Access pattern:
```javascript
const hot = window._appContext?.dhs?.Slot?.hot;     // Slot tab HOT instance
const hot = window._appContext?.dhs?.Schema?.hot;   // Schema tab HOT instance
```

Useful HOT introspection inside `page.evaluate()`:

```javascript
const state = await page.evaluate(() => {
  const dh  = window._appContext?.dhs?.Slot;
  const hot = dh?.hot;
  if (!hot) return { available: false };
  const srcRows = hot.countSourceRows();
  const hiddenPlugin = hot.getPlugin('hiddenRows');
  const hiddenRows   = hiddenPlugin?.getHiddenRows() ?? [];
  return {
    srcRows,
    hiddenCount: hiddenRows.length,
    domRows: document.querySelectorAll(
      '.tab-pane.show .ht_master.handsontable tbody tr'
    ).length,
  };
});
```

Physical vs visual rows:

```javascript
// Physical row = index in source data array (stable, unaffected by sort/hide)
// Visual row   = current rendered row index (changes with sort/filter)
const physRow   = hot.toPhysicalRow(visualRow);
const visualRow = hot.toVisualRow(physRow);

// Source data at physical row (works even for hidden rows)
const value = hot.getSourceDataAtCell(physRow, colIdx);

// Set data using visual row index
hot.setDataAtCell(visualRow, colIdx, newValue, 'cascade_confirm');
```

HOT column lookup via slot name:
```javascript
const dh  = window._appContext?.dhs?.Slot;
const col = dh.slot_name_to_column['required'];
```

---

## Source tags (the `source` argument to `afterChange`)

HOT passes a `source` string to `afterChange` to indicate why a change occurred.
Use source-based guards in custom hooks to prevent re-entrant loops:

| Source tag | When used |
|---|---|
| `'loadData'` | HOT initial load or `loadData()` call |
| `'edit'` | User typed in a cell |
| `'cascade_confirm'` | Custom: programmatic follow-up changes that should bypass dialog hooks |
| `'upload'` | Schema YAML upload / import |
| `'field_key_modal'` | Field Key Modal confirm |
| `'drag_section_update'` | Row drag that updates slot_group |
| `'batch_updates'` | Internal batch |

**Never make `afterChange` hooks async.** HOT's hook runner does not await
Promises. If a hook returns a Promise, HOT may forward that Promise object as
the `changes` argument to the next synchronous hook, causing:
```
TypeError: changes.every is not a function
```

Use `setTimeout(..., 0)` + `.then()` for dialog work inside a hook:
```javascript
dh.hot.addHook('afterChange', (changes, source) => {
  if (!changes) return;
  if (SKIP_SOURCES.has(source)) return;
  // ... synchronous checks ...

  setTimeout(() => {
    dhChoose(...)
      .then((choice) => {
        // Apply programmatic changes here
        dh.hot.setDataAtCell(visualRow, col, newVal, 'cascade_confirm');
      });
  }, 0);
});
```

---

## Field Key Modal (FKM)

The FKM (`#field-key-modal`) is used to add or edit fields in the Slot tab.

### Opening for a new field
```javascript
await page.click('#add-row');
await page.waitForFunction(
  () => document.querySelector('#field-key-modal')?.classList.contains('show'),
  null,
  { timeout: 5_000 }
);
```

### Opening in Edit mode (for an existing slot_usage row)
Double-click any cell in the row (the name/Field-ID cell works reliably):
```javascript
await nameCell.scrollIntoViewIfNeeded();
await nameCell.dblclick();
await page.waitForFunction(
  () => document.querySelector('#field-key-modal')?.classList.contains('show'),
  null,
  { timeout: 5_000 }
);
```

### FKM fields

```javascript
// Select which class (table) the field belongs to
await page.selectOption('#fkm-class-id', 'CanCOGeNCovid19');

// Type the snake_case field name — triggers slot-type radio row to appear
await page.fill('#fkm-name', 'my_new_field');

// Wait for slot-type row to appear (only shown when field name is non-empty)
await page.waitForFunction(
  () => document.querySelector('#fkm-slot-type-row')?.style.display !== 'none',
  null, { timeout: 3_000 }
);

// Choose slot type
await page.check('#fkm-type-slot-usage');   // Table field (from schema) — adds base slot
await page.check('#fkm-type-attribute');    // Table field (stand-alone) — no base slot

// Set the title
await page.fill('#fkm-title', 'My New Field');

// Set the section (slot_group)
await page.selectOption('#fkm-slot-group', { label: 'Pathogen diagnostic testing' });

// Confirm
await page.click('#fkm-confirm-btn');
await page.waitForFunction(
  () => !document.querySelector('#field-key-modal')?.classList.contains('show'),
  null, { timeout: 5_000 }
);
await page.waitForTimeout(500); // allow HOT to process row insertion
```

### After FKM confirm — new rows may be hidden

Newly inserted rows may still be hidden from a prior `tabFilter` pass. Trigger
`refreshTabDisplay` with a tab switch (see "Tab switch to make newly inserted
rows visible" above).

### FKM slot types and what gets inserted

| Radio | `slot_type` | Result |
|---|---|---|
| `#fkm-type-slot-usage` | `slot_usage` | Inserts a base `slot` row + a `slot_usage` row linking the class |
| `#fkm-type-attribute` | `attribute` | Inserts a single `attribute` row for the class |

---

## Waiting for HOT content

### `waitForCellText` — any cell in any HOT grid
```javascript
async function waitForCellText(page, text, timeout = 10_000) {
  await page.waitForFunction(
    (t) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const tds = document.querySelectorAll('.ht_master.handsontable tbody td');
      return Array.from(tds).some(td => hotText(td) === t);
    },
    text,        // arg passed to page function — NOT an options object
    { timeout }  // options as third argument
  );
}
```

**`waitForFunction` argument passing:** The second parameter is `arg` (passed to
the page function), and the third is `options`. Never pass options as the second
argument or they will be interpreted as `arg`.

### `waitForColCellText` — wait for text in a specific column
```javascript
async function waitForColCellText(page, colIdx, text, count = 1, timeout = 10_000) {
  await page.waitForFunction(
    ([colIdx, text, count]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const scope = document.querySelector('.tab-pane.show') || document;
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const nth   = colIdx === 0 ? 1 : colIdx + 1;
      const sel   = `${clone}.handsontable tbody td:nth-of-type(${nth})`;
      const cells = scope.querySelectorAll(sel);
      return Array.from(cells).filter(td => hotText(td) === text).length >= count;
    },
    [colIdx, text, count],
    { timeout }
  );
}
```

### Waiting for row count to stabilize
```javascript
await page.waitForFunction(
  () => document.querySelectorAll('.tab-pane.show .ht_master.handsontable tbody tr').length >= 1,
  null,
  { timeout: 10_000 }
);
await page.waitForTimeout(300); // extra settle time
```

---

## Column header lookup (for dynamic column index)

When column order may vary, find a column by its header text and derive the
`nth-child` index from its DOM position:

```javascript
const field = page.locator('th.secondary-header-cell[data-ref="My Column"]').first();
const colIndex = await field.evaluate(el => {
  const allThs = Array.from(el.closest('tr').querySelectorAll('th'));
  return allThs.indexOf(el) + 1; // +1 for 1-indexed nth-child
});
const cell = page.locator(
  `.ht_master .htCore tbody tr:first-child td:nth-child(${colIndex})`
);
```

---

## Saving and downloading files

### Schema YAML save (Schema Editor)
```javascript
await page.click('#file-menu-button');

// Handle the native prompt asking for filename
page.once('dialog', async (dialog) => {
  await dialog.accept('schema.yaml');
});

const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 10_000 }),
  page.click('#save-template-button'),
]);

const outputFile = path.join('test-results', 'test-schema.yaml');
await download.saveAs(outputFile);
```

### Save As (main DH grid)
```javascript
await page.click('#file-menu-button');
await page.click('#save-as-dropdown-item');
await page.waitForSelector('#save-as-modal.show');
await page.fill('#base-name-save-as-input', 'test-output');
await page.selectOption('#file-ext-save-as-select', 'xlsx');

const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#save-as-confirm-btn'),
]);

await download.saveAs(path.resolve('test-results/output.xlsx'));
```

### Parsing downloaded XLSX
```javascript
import { read as xlsxRead, utils as XlsxUtils } from 'xlsx';
import { readFileSync } from 'fs';

const wb = xlsxRead(readFileSync(await download.path()));
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XlsxUtils.sheet_to_json(ws, { header: 1 });
const dataRow = rows.find(r => r[1] === 'EDITED_VALUE');
expect(dataRow).toBeTruthy();
```

### Parsing downloaded YAML
```javascript
import YAML from 'yaml';
import { readFileSync, mkdirSync } from 'fs';

const outputFile = path.join('test-results', 'test-schema.yaml');
await download.saveAs(outputFile);
const schema = YAML.parse(readFileSync(outputFile, 'utf-8'));
expect(schema.name).toBe('TestSchema');
```

---

## Console log capture for debugging

Capture browser-side logs (useful for `console.log()` statements added to
`SchemaEditor.js` or app code during debugging):

```javascript
const consoleLogs = [];
page.on('console', msg => {
  if (msg.type() === 'error' || msg.text().includes('[appendOne]')) {
    console.log(`[BROWSER ${msg.type()}]`, msg.text());
  }
});
```

---

## Expert mode

Some Schema Editor operations require Expert User mode. Enable it via the
Display menu in the toolbar:

```javascript
// Open Display menu and check Expert User checkbox
await page.click('#display-menu-button');
await page.waitForSelector('#display-menu.show', { timeout: 5_000 });
await page.check('#expert-mode-check');
await page.click('#display-menu-button'); // close menu
```

Verify via `window._appContext`:
```javascript
const isExpert = await page.evaluate(() => {
  const dh = window._appContext?.dhs?.Slot;
  return !!dh?.context?.expert_user;
});
```

---

## Internationalization / language switching

Switch the interface language via the top-right selector:

```javascript
await page.selectOption('#select-translation-localization', 'fr');
await expect(page.locator('#file-menu-button')).toContainText('Fichier');
```

---

## Common pitfalls

| Pitfall | Fix |
|---|---|
| `.ht_master td:nth-child(N)` selects wrong cell | Use `td:nth-of-type(N)` — the `<th>` row-number header is not counted by `:nth-of-type` |
| Clicking col-0 cell in `.ht_master` has no effect | Col 0 is frozen; use `.ht_clone_left` instead |
| Bootstrap tab fade keeps two panes as `.show` | Wait for `.tab-pane.show` count to be exactly 1 |
| New slot_usage row not visible after FKM confirm | Switch to another tab and back to trigger `tabFilter` |
| Row exists in HOT source data but not in DOM | Use `hot.scrollViewportTo({row: v, col: 0})` then wait 400ms |
| Checkbox click selects cell but doesn't toggle | Use `hot.setDataAtCell(visualRow, col, value, 'cascade_confirm')` |
| `async afterChange` hook causes `changes.every is not a function` | Make hook synchronous; use `setTimeout(0)` + `.then()` for async dialog work |
| `waitForFunction` arg/options confusion | Second arg is the page-function arg, third is `{timeout}` |
| Dropdown text comparison fails | Strip `▼` (U+25BC) with `.replace(/\u25bc/g, '').trim()` |
| `page.evaluate()` can't pass Regexp | Pass as string and reconstruct inside, or use string matching |
