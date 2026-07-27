import { test, expect } from '@playwright/test'
import { loginAsCustomer, loginAsAdmin } from '../helpers/auth'

test.describe('Customer Commerce & Payment Verification E2E', () => {
  test('Customer logs in and views account orders', async ({ page }) => {
    await loginAsCustomer(page)
    await page.goto('/account/orders')
    await page.waitForSelector('h1', { timeout: 10000 })
    await expect(page.locator('body')).toContainText(/Pesanan|Order|Pre-Order|Akun/i)
  })

  test('Admin payment verification queue navigation', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/payments')
    await page.waitForSelector('h1', { timeout: 10000 })
    await expect(page.locator('body')).toContainText(/Bayar|Pelanggan|Verifikasi/i)
  })
})
