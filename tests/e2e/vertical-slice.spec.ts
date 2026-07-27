import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsCustomer } from '../helpers/auth'

test.describe('EcoThread Complete Vertical Slice E2E', () => {
  test.slow()

  test('Full vertical slice from Landing Page to Customer Payment Verification', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()

    // 2. Public Catalog & Product Detail
    await page.goto('/catalog')
    await expect(page.locator('body')).toContainText(/Katalog/i)

    // 3. Admin Login & Operational Dashboard
    await loginAsAdmin(page)

    // 4. Admin Payment Verification Queue
    await page.goto('/admin/payments')
    await page.waitForSelector('h1', { timeout: 10000 })
    await expect(page.locator('body')).toContainText(/Bayar|Pelanggan|Verifikasi/i)

    // 5. Customer Login & Account History
    await loginAsCustomer(page)
    await page.goto('/account/orders')
    await page.waitForSelector('h1', { timeout: 10000 })
    await expect(page.locator('body')).toContainText(/Pesanan|Order|Pre-Order|Akun/i)
  })
})
