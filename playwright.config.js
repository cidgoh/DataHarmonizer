// See docs/README_quality_assurance.md
/* eslint-env node */
// To run a particular test do:  
//    npx playwright test tests/playwright/cancogen-french-translations.spec.js

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  // Starts yarn dev and waits for it before any test runs.
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://localhost:8081',
    headless: false,   // set false while writing tests to watch
  },
});