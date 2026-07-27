const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    // baseURL is set dynamically via environment in support/env.js
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment if you need and want Firefox / WebKit later
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});