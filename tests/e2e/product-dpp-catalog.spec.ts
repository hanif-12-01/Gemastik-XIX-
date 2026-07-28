import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../helpers/auth'

test.describe('Product, DPP, & Public Catalog E2E', () => {
  test('Public Catalog displays published products and opens detail', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('body')).toContainText(/Katalog/i)
    await page.locator('a[href^="/catalog/"]').first().click()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('body')).not.toContainText(/Terjadi Kesalahan Aplikasi|Server Error/i)
  })

  test('Public DPP page renders database verification state', async ({ page }) => {
    await page.goto('/dpp/PRD-2026-0001')
    await expect(page.locator('body')).toContainText(/PRD-2026-0001|Digital Product Passport|EcoThread/i)
  })

  test('Admin opens Product and DPP detail without route error', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/products')
    const detailLink = page.locator('a[href^="/admin/products/"]:not([href="/admin/products/new"])').first()
    await expect(detailLink).toBeVisible()
    await detailLink.click()
    await expect(page).toHaveURL(/\/admin\/products\/[^/]+$/)
    await expect(page.locator('body')).toContainText(/Detail Produk|Digital Product Passport/i)
    await expect(page.locator('body')).not.toContainText(/Terjadi Kesalahan Aplikasi|Server Error/i)
  })
})
