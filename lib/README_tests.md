# DataHarmonizer Playwright Test Guide

Learnings from writing and debugging Playwright tests against the DataHarmonizer
Schema Editor and main DataHarmonizer grid. Use this as a reference when writing
new tests.

---

## Running the tests

```bash
# All tests (headless, default)
npx playwright test

# Single test file
npx playwright test tests/playwright/UX_task_1_covid19.spec.js

# Multiple files
npx playwright test tests/playwright/UX_task_1_covid19.spec.js tests/playwright/UX_task_3_influenza.spec.js

# Watch mode (browser visible)
HEADED=1 npx playwright test

# Watch mode, single file
HEADED=1 npx playwright test tests/playwright/UX_Task_5_create_1m.spec.js
```

`playwright.config.js` auto-starts `yarn dev` (http://localhost:8081) before any
test and reuses an existing server if already running. Default timeout is 120 s;
extend inside individual tests with `test.setTimeout(N)`.

---

## Test file organization

All spec files live in `tests/playwright/`. Shared helpers are in
`tests/playwright/playwright_utils.js`.

### Main application tests (DataHarmonizer grid, not Schema Editor)

| File | Description |
|---|---|
| `cancogen-main-app.spec.js` | Load CanCOGeN COVID-19 xlsx, edit a cell, save and verify; switch to French and verify UI translation |

### Schema Editor — UX task end-to-end workflows

Each UX task file exercises a complete workflow a researcher would perform:

| File | Template | Theme |
|---|---|---|
| `UX_task_1_covid19.spec.js` | CanCOGeN COVID-19 | Load schema, edit a field attribute, remove/restore a field, save, verify diff report |
| `UX_task_2_covid19.spec.js` | GRDI 1M | Set a field to Recommended; verify HOT source data |
| `UX_task_3_influenza.spec.js` | Influenza | Load via right-click context menu, add French title/description/comments via Translation modal, save, verify |
| `UX_Task_4_covid19.spec.js` | CanCOGeN COVID-19 + fresh Test schema | Create Test schema with pre-existing fields, load a second schema, copy a field between schemas, verify Field tab |
| `UX_Task_5_create_1m.spec.js` | Fresh schema (two-table 1M pattern) | Create schema with Samples + Isolates tables, add `sample_id` and `isolate_id` fields, set range, add FK annotation, verify YAML |

### Schema Editor — feature-level regression tests

| File | Theme |
|---|---|
| `schema-editor-create-save.spec.js` | Create schema from scratch, verify YAML; regression for spurious cascade dialog on new Enum |
| `grdi-slot-features.spec.js` | Expert-guard + slot cascade (examples column), UniqueKey multiselect, GRDI 1M schema |
| `slot_group_rerank.spec.js` | FKM slot_group change re-ranks the slot within its new section |
| `add_edit_field_modal.spec.js` | Field Key Modal (FKM) — comprehensive add/edit/convert/cancel/copy-inherited bundles using GRDI 1M |

### Shared helpers — `playwright_utils.js`

| Export | Purpose |
|---|---|
| `hotCellLocator(page, row, colIdx)` | Schema / Class tab cell locator (routes col 0 to `.ht_clone_left`) |
| `slotCellLocator(page, row, colIdx)` | Slot tab `.ht_master` cell locator by DOM td index |
| `slotNameCellLocator(page, row)` | Slot tab name cell via `.field-id-bold` CSS class |
| `findRowIndex(page, colIdx, text)` | DOM row index by column + text (Schema/Class tabs) |
| `findSlotRowIndex(page, name, slotTypeTitle)` | DOM row index for a Slot tab row by name + slot type |
| `scrollToSlotRow(page, name, slotTypeTitle)` | Scroll HOT until a row is rendered, return its DOM index |
| `goToTab(page, tabBarId)` | Click a tab nav-link and wait for Bootstrap transition |

---

## Setup and startup

`playwright.config.js` starts the dev server automatically. For manual runs:

```bash
yarn dev          # http://localhost:8081
npx playwright test tests/playwright/some.spec.js
```

**Per-test timeout:** Complex tests need longer timeouts. Set it inside the test:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(120_000);
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

| colIdx | Location | Field |
|---|---|---|
| 0 | `.ht_clone_left` | Schema ID (name) |
| 1 | `.ht_master` td 2 | (first non-frozen col) |
| 2 | `.ht_master` td 3 | Title |

**Class tab** (`#tab-bar-Class`):

| colIdx | Location | Field |
|---|---|---|
| 0 | `.ht_clone_left` | Table ID (name) |
| 1 | `.ht_master` td 2 | Title |

**Slot (Field) tab** (`#tab-bar-Slot`) — two DOM layouts depending on whether
`schema_id` is hidden by concise view:

*When `schema_id` IS hidden* (concise view active + FK relations present, e.g. GRDI 1M):
HOT 15 removes the td entirely from `.ht_master`.

| `.ht_master` tds[] | HOT col | Field |
|---|---|---|
| tds[0] | 1 | class_id ("Class") |
| tds[1] | 2 | slot_type ("Type") |
| tds[2] | 3 | slot_group ("Section") |
| tds[3] | 4 | name ("Field ID") ← has `field-id-bold` CSS class |
| tds[4] | 5 | rank ("Ordering") |
| tds[5] | 6 | slot_uri |
| tds[6] | 7 | title |
| tds[7] | 8 | description |
| tds[8] | 9 | comments |
| tds[9] | 10 | examples |
| tds[10] | 11 | **range** |

*When `schema_id` is visible* (fresh schema or concise view off):

| `.ht_master` tds[] | HOT col | Field |
|---|---|---|
| tds[0] | 0 | schema_id |
| tds[1] | 1 | class_id |
| tds[2] | 2 | slot_type |
| tds[3] | 3 | slot_group |
| tds[4] | 4 | name ("Field ID") ← has `field-id-bold` CSS class |
| tds[5] | 5 | rank |
| tds[6] | 6 | slot_uri |
| tds[7] | 7 | title |
| tds[8] | 8 | description |
| tds[9] | 9 | comments |
| tds[10] | 10 | examples |
| tds[11] | 11 | **range** |

**Because the DOM td index for any column past `schema_id` shifts by one
depending on visibility, always use one of these layout-independent approaches:**

- Use the `field-id-bold` CSS class to locate the name ("Field ID") column.
- Use the HOT source data API (`dh.slot_name_to_column['range']`) and compute
  the DOM td index by counting non-hidden HOT columns (see "Finding a column
  DOM index dynamically" below).

### `field-id-bold` CSS class

SchemaEditor's `cells()` callback adds `field-id-bold` to every td in the
name ("Field ID") column. Use it to locate the name cell without knowing the
exact td index:

```javascript
const nameTd = Array.from(row.querySelectorAll('td'))
  .find(td => td.classList.contains('field-id-bold'));
```

### Slot type CSS classes

SchemaEditor's `cells()` callback also adds the slot type string as a CSS class
to **every td** in a slot row. Use it to distinguish slot types without reading
the slot_type column value:

```javascript
const isSlotUsage = Array.from(tds).some(td => td.classList.contains('slot_usage'));
const isAttribute = Array.from(tds).some(td => td.classList.contains('attribute'));
const isBaseSlot  = Array.from(tds).some(td => td.classList.contains('slot'));
```

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

Or use the `goToTab` helper from `playwright_utils.js`:
```javascript
await goToTab(page, '#tab-bar-Slot');
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

All Slot tab interaction goes through `.ht_master` using the DOM td index:

```javascript
function slotCellLocator(page, rowIndex, colIdx) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator(`td:nth-of-type(${colIdx + 1})`);
}
```

`colIdx` is the **DOM td index** (0-based), which differs from the HOT column
index when `schema_id` is hidden. Use `slotNameCellLocator` for the name column
and dynamic column computation for other columns (see below).

### `slotNameCellLocator(page, rowIndex)` — name cell by CSS class

```javascript
function slotNameCellLocator(page, rowIndex) {
  return page
    .locator('.tab-pane.show .ht_master.handsontable tbody tr')
    .nth(rowIndex)
    .locator('td.field-id-bold');
}
```

### `findSlotRowIndex(page, name, slotTypeTitle)` — Slot tab row by name + type

Uses `field-id-bold` and slot-type CSS class — layout-independent:

```javascript
async function findSlotRowIndex(page, name, slotTypeTitle) {
  return page.evaluate(
    ([name, slotTypeTitle]) => {
      function ht(td) { return (td?.textContent ?? '').replace(/\u25bc/g, '').trim(); }
      const titleToClass = {
        'Schema field':              'slot',
        'Table field (from schema)': 'slot_usage',
        'Table field (stand-alone)': 'attribute',
      };
      const cssClass = titleToClass[slotTypeTitle] || null;
      const scope = document.querySelector('.tab-pane.show');
      const rows  = (scope || document).querySelectorAll('.ht_master.handsontable tbody tr');
      for (let i = 0; i < rows.length; i++) {
        const tds    = Array.from(rows[i].querySelectorAll('td'));
        const nameTd = tds.find(td => td.classList.contains('field-id-bold'));
        if (!nameTd || ht(nameTd) !== name) continue;
        const matchesCss = cssClass && tds.some(td => td.classList.contains(cssClass));
        if (!matchesCss && ht(rows[i].querySelectorAll('td')[0]) !== slotTypeTitle) continue;
        return i;
      }
      return -1;
    },
    [name, slotTypeTitle]
  );
}
```

`slotTypeTitle` values:
- `'Schema field'` — base slot row (slot_type = 'slot')
- `'Table field (from schema)'` — slot_usage row
- `'Table field (stand-alone)'` — attribute row

### `scrollToSlotRow(page, name, slotTypeTitle)` — scroll until row is rendered

HOT virtual rendering omits off-screen rows. For large schemas (e.g. GRDI 1M),
scroll until the target row appears in the DOM:

```javascript
// From playwright_utils.js
const rowIdx = await scrollToSlotRow(page, 'sample_plan_name', 'Table field (from schema)');
expect(rowIdx, 'row not found').not.toBe(-1);
```

Always call `scrollToSlotRow` (or reset `scrollTop` to 0 manually) before
right-clicking a row to open the context menu — HOT re-renders after tab
switches, which shifts the DOM positions of existing rows.

### `findRowIndex(page, colIdx, text)` — visual row index by cell content

```javascript
async function findRowIndex(page, colIdx, text) {
  return page.evaluate(
    ([colIdx, text]) => {
      function hotText(td) { return td.textContent.replace(/\u25bc/g, '').trim(); }
      const clone = colIdx === 0 ? '.ht_clone_left' : '.ht_master';
      const rows  = document.querySelectorAll(`.tab-pane.show ${clone}.handsontable tbody tr`);
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

### Finding a column DOM index dynamically

When you need to click a column whose DOM index depends on whether `schema_id`
is hidden (e.g. the `range` column), compute it from HOT's `hiddenColumns`
plugin rather than using a hardcoded index:

```javascript
const { rowIdx, rangeColDomIdx } = await page.evaluate(() => {
  const dh  = window._appContext?.dhs?.Slot;
  const hot = dh?.hot;
  if (!hot || !dh) return { rowIdx: -1, rangeColDomIdx: -1 };

  // Find the physical row by class_id + name + slot_type.
  const scope    = document.querySelector('.tab-pane.show');
  const masterRows = scope.querySelectorAll('.ht_master.handsontable tbody tr');
  const ht = el => (el?.textContent ?? '').replace(/\u25bc/g, '').trim();

  let rowIdx = -1;
  for (let i = 0; i < masterRows.length; i++) {
    const tds    = Array.from(masterRows[i].querySelectorAll('td'));
    const nameTd = tds.find(td => td.classList.contains('field-id-bold'));
    if (!nameTd || ht(nameTd) !== 'sample_id') continue;
    if (!tds.some(td => td.classList.contains('slot_usage'))) continue;
    // Verify class_id via HOT source data (DOM index i = HOT visual row i).
    const physRow = hot.toPhysicalRow(i);
    if (physRow == null) continue;
    if (hot.getSourceDataAtCell(physRow, dh.slot_class_id_column) !== 'Isolates') continue;
    rowIdx = i;
    break;
  }
  if (rowIdx === -1) return { rowIdx: -1, rangeColDomIdx: -1 };

  // Count visible columns before 'range' to get its DOM td index.
  const rangeHotCol  = dh.slot_name_to_column['range'];
  const hiddenPlugin = hot.getPlugin('hiddenColumns');
  const hiddenCols   = new Set(hiddenPlugin?.getHiddenColumns() ?? []);
  let domColIdx = 0;
  for (let c = 0; c < rangeHotCol; c++) {
    if (!hiddenCols.has(c)) domColIdx++;
  }
  return { rowIdx, rangeColDomIdx: domColIdx };
});

const rangeCell = slotCellLocator(page, rowIdx, rangeColDomIdx);
```

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
const hot = window._appContext?.dhs?.Slot?.hot;       // Slot tab HOT instance
const hot = window._appContext?.dhs?.Schema?.hot;     // Schema tab HOT instance
const hot = window._appContext?.dhs?.Class?.hot;      // Class tab HOT instance
const hot = window._appContext?.dhs?.Annotation?.hot; // Annotation tab HOT instance
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

// Slot tab shortcut properties
dh.slot_name_column       // HOT column index for 'name'
dh.slot_type_column       // HOT column index for 'slot_type'
dh.slot_class_id_column   // HOT column index for 'class_id'
dh.slot_group_column      // HOT column index for 'slot_group'
dh.schema_name_column     // HOT column index for 'schema_id'
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

// Select field type
await page.selectOption('#fkm-field-type', 'slot_usage'); // or 'slot', 'attribute'

// Free-text field name (shown when type is 'slot' or 'attribute')
await page.fill('#fkm-name', 'my_new_field');

// Strict picklist field name (shown when type is 'slot_usage')
await page.selectOption('#fkm-name-select', 'existing_slot_name');

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

### FKM type behaviour

| `#fkm-field-type` value | Name input | Effect |
|---|---|---|
| `slot_usage` (default) | `#fkm-name-select` (strict picklist) | Inserts base `slot` + `slot_usage` row |
| `attribute` | `#fkm-name` (free text, always enabled) | Inserts single `attribute` row |
| `slot` | `#fkm-name` (free text, **disabled in non-expert mode**) | Inserts base `slot` row only |

**Pre-fill from context row:** When `#add-row` is clicked, the FKM pre-fills the
type from the last selected row. If the selected row is a base `slot`, the FKM
opens with type `slot` — which hides `#fkm-name-select`. Always explicitly set
`#fkm-field-type` if your test depends on a particular type.

**Expert mode required for `slot` type:** In non-expert mode, `#fkm-name` is
disabled when type is `slot`. Enable expert mode before adding base slots.

### Edit mode type conversion

```javascript
// ── Edit mode: convert slot_usage ↔ attribute via the "change type" checkbox ──
await page.waitForFunction(
  () => document.querySelector('#fkm-slot-type-row')?.style.display !== 'none',
  null, { timeout: 3_000 }
);
await page.check('#fkm-change-type'); // tick to convert type
```

| Checkbox state | Effect |
|---|---|
| Unchecked (default) | Keep current type unchanged |
| Checked (slot_usage row) | Convert to `attribute` |
| Checked (attribute row) | Convert to `slot_usage`; inserts base `slot` if not in schema library |

### After FKM confirm — new rows may be hidden

Newly inserted rows may still be hidden from a prior `tabFilter` pass. Trigger
`refreshTabDisplay` with a tab switch (see "Tab switch to make newly inserted
rows visible" above).

---

## Generic alert/confirm dialog (`dh-dialog-modal`)

DH replaces `window.alert()` and `window.confirm()` with a Bootstrap modal
(`#dh-dialog-modal`). It appears after some cell edits (e.g. "Range updated"
when a slot definition change cascades to other usages).

Dismiss a blocking alert:
```javascript
// Wait for dialog (it may appear a moment after the edit commits)
await page.waitForTimeout(300);
const hasDialog = await page.evaluate(
  () => document.querySelector('#dh-dialog-modal')?.classList.contains('show')
);
if (hasDialog) {
  await page.click('#dh-dialog-ok');
  await page.waitForFunction(
    () => !document.querySelector('#dh-dialog-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
}
```

For a confirm dialog (has both OK and Cancel):
```javascript
await page.click('#dh-dialog-ok');     // confirm
// or
await page.click('#dh-dialog-cancel'); // cancel
```

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
  if (msg.type() === 'error' || msg.text().startsWith('[myTag]')) {
    console.log(`[BROWSER ${msg.type()}]`, msg.text());
  }
});
```

---

## Expert mode

Some Schema Editor operations require Expert User mode. The most reliable way to
enable it in tests is via direct DOM manipulation of the checkbox:

```javascript
await page.evaluate(() => {
  const cb = document.getElementById('schema_expert');
  if (cb && !cb.checked) cb.click();
});
await page.waitForTimeout(200);
```

Alternatively, via the Display menu:
```javascript
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

**Expert mode is required to:**
- Add base schema slots (`slot` type) via the FKM
- Edit inherited cell values in slot_usage rows without a cascade dialog
- Override `slot_group` constraints when dragging rows

---

## Internationalization / language switching

Switch the interface language via the top-right selector:

```javascript
await page.selectOption('#select-translation-localization', 'fr');
await expect(page.locator('#file-menu-button')).toContainText('Fichier');
```

### Translation modal

The Translation modal (`#translate-modal`) allows adding per-locale overrides for
field attributes. It is opened by right-clicking a slot row and choosing
"Translate":

```javascript
// Right-click a cell to open the context menu
await cell.click({ button: 'right' });
await page.locator('.htContextMenu .htCore td').filter({ hasText: 'Translate' }).click();
await page.waitForFunction(
  () => document.querySelector('#translate-modal')?.classList.contains('show'),
  null, { timeout: 5_000 }
);

// Edit a textarea (identified by its data-path attribute)
const textarea = page.locator('#translate-modal.show #translate-modal-content textarea')
  .filter({ has: page.locator('[data-path*="description"]') });
await textarea.fill('French description text');

// Confirm
await page.locator('#translate-modal.show .modal-footer button').last().click();
await page.waitForFunction(
  () => !document.querySelector('#translate-modal')?.classList.contains('show'),
  null, { timeout: 5_000 }
);
```

**Stale DOM after Translation modal close:** HOT re-renders after the modal
closes, shifting virtual row positions. Always re-find a slot row using
`scrollToSlotRow` before the next right-click or locator operation:

```javascript
// Re-find the row after modal close
const rowIdx = await scrollToSlotRow(page, 'authors', 'Table field (from schema)');
const cell   = slotCellLocator(page, rowIdx, 2);
await cell.click({ button: 'right' });
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
| Hardcoded `tds[N]` for Slot tab columns breaks on schema_id visibility change | Use `field-id-bold` class for name column; compute other column DOM indices dynamically |
| Right-click on wrong slot row after HOT re-render | Call `scrollToSlotRow` to re-find the DOM row index before each right-click |
| `hot.toVisualRow(physRow)` doesn't match DOM row | For small schemas, scan DOM rows and use `hot.toPhysicalRow(domIdx)` to verify source data |
| FKM opens with wrong type due to pre-fill from selected row | Explicitly set `#fkm-field-type` at the start of FKM interaction |
| `#dh-dialog-modal` intercepts pointer events after a cell edit | Dismiss with `#dh-dialog-ok` before interacting with other elements |
