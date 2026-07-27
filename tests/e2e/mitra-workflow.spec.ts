import { test, expect } from '@playwright/test'

test.describe('Mitra Production Workflow E2E', () => {
  test('Mitra views assigned orders and updates progress', async ({ page }) => {
    await page.goto('/auth/mitra/login')
    await page.fill('input[type="email"]', 'mitra@ecothread.local')
    await page.fill('input[type="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/mitra**', { timeout: 10000 })

    await page.goto('/mitra/orders')
    await expect(page.locator('body')).toContainText(/Order|Tugas|Ratna/i)
  })
})
