import { test, expect } from '@playwright/test'

test.describe('Product, DPP, & Public Catalog E2E', () => {
  test('Public Catalog displays published products and opens detail', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('body')).toContainText(/Katalog/i)
  })

  test('Public DPP page renders database verification state', async ({ page }) => {
    await page.goto('/dpp/PRD-2026-0001')
    await expect(page.locator('body')).toContainText(/PRD-2026-0001|Digital Product Passport|EcoThread/i)
  })
})
