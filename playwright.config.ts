import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.TEST_WEB_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm --filter "@ecothread/web" dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000
  }
})
