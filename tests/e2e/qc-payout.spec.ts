import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../helpers/auth'

test.describe('Admin QC Queue & Payout Management E2E', () => {
  test('Admin navigates to QC Queue and Payouts list', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/qc')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/QC|Quality Control|Review/i)

    await page.goto('/admin/payouts')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Payout|Pembayaran|Mitra/i)
  })
})
