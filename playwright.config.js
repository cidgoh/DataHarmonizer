// See docs/README_quality_assurance.md
/* eslint-env node */
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