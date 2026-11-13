import { test, expect } from '@playwright/test';
import path from 'path';

test('debug §7b', async ({ page }) => {
  page.on('console', msg => { if (msg.type() !== 'warning') console.log('[BROWSER]', msg.type(), msg.text().substring(0, 200)); });

  await page.goto('/schema_editor.html');
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20_000 });
  await page.waitForSelector('.htCore', { timeout: 15_000 });
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.htCore th span'))
           .some(s => s.textContent.trim() === 'Schema ID'),
    null, { timeout: 15_000 }
  );
  await page.setInputFiles('#schema_upload', path.resolve('web/templates/grdi_1m/schema.yaml'));
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.tab-pane.show .ht_clone_left.handsontable tbody td'))
           .some(td => td.textContent.replace(/\u25bc/g, '').trim() === 'GRDI'),
    null, { timeout: 30_000 }
  );

  // Go to Slot tab
  await page.click('#tab-bar-Slot > a');
  await page.waitForTimeout(1000);

  // Check state before opening modal
  const state = await page.evaluate(() => {
    const slot = window._appContext?.dhs?.Slot;
    const classSlot = window._appContext?.dhs?.ClassSlot;
    const current = window._appContext?.current_data_harmonizer_name;
    return {
      current,
      slotExists: !!slot,
      slotRows: slot?.hot?.countSourceRows(),
      slotIndexSize: slot?.slotDefinitionIndex?.size,
      slotTypeCol: slot?.slot_type_column,
      classSlotExists: !!classSlot,
      classSlotRows: classSlot?.hot?.countSourceRows(),
      classSlotIndexSize: classSlot?.slotDefinitionIndex?.size,
    };
  });
  console.log('State before modal:', JSON.stringify(state));

  // Open modal
  await page.click('#add-row');
  await page.waitForFunction(
    () => document.querySelector('#field-key-modal')?.classList.contains('show'),
    null, { timeout: 5_000 }
  );
  await page.waitForTimeout(200);

  // Select slot_usage type
  await page.selectOption('#fkm-field-type', 'slot_usage');
  await page.waitForTimeout(200);

  // Check state after type select
  const stateAfterType = await page.evaluate(() => {
    const slot = window._appContext?.dhs?.Slot;
    const opts = Array.from(document.querySelectorAll('#fkm-name-select option')).map(o => o.value);
    return {
      slotIndexSize: slot?.slotDefinitionIndex?.size,
      nameSelectOptions: opts.length,
      firstFewOpts: opts.slice(0, 5),
    };
  });
  console.log('State after type select:', JSON.stringify(stateAfterType));

  // Select class
  await page.selectOption('#fkm-class-id', 'GRDISample');
  await page.waitForTimeout(300);

  // Try selecting slot
  const slotExists = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#fkm-name-select option'))
      .some(o => o.value === 'alternative_sample_id');
  });
  console.log('alternative_sample_id option exists:', slotExists);

  if (slotExists) {
    await page.selectOption('#fkm-name-select', 'alternative_sample_id');
    await page.waitForTimeout(300);
    const sgVal = await page.$eval('#fkm-slot-group-new', el => el.value);
    console.log('slot_group value after selection:', sgVal);

    const details = await page.evaluate(() => {
      const slot = window._appContext?.dhs?.Slot;
      const idx = slot?.slotDefinitionIndex;
      const schemaId = document.getElementById('fkm-schema-id')?.value;
      const key = `${schemaId}\0alternative_sample_id`;
      const defPhysRow = idx?.get(key);
      let baseSlotGroup = null;
      if (defPhysRow !== undefined) {
        baseSlotGroup = slot.hot.getSourceDataAtCell(defPhysRow, slot.slot_group_column);
      }
      return {
        schemaId,
        indexSize: idx?.size,
        defPhysRow,
        baseSlotGroup,
        allKeys: idx ? [...idx.keys()].slice(0, 5) : [],
      };
    });
    console.log('Details:', JSON.stringify(details));
  }

  expect(true).toBe(true); // just pass to see output
});
