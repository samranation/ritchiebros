import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: 'html',
  use: {
    baseURL: 'https://www.rbauction.com',
    headless: false,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      fullyParallel: true,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
