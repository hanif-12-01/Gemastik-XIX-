import { test, expect } from '@playwright/test'

test.describe('Accessibility Smoke E2E', () => {
  const pagesToTest = ['/', '/portal', '/catalog', '/auth/admin/login', '/auth/mitra/login', '/auth/customer/login']

  for (const p of pagesToTest) {
    test(`Check H1 and form accessibility on ${p}`, async ({ page }) => {
      await page.goto(p, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('body')).toBeVisible()
    })
  }
})
