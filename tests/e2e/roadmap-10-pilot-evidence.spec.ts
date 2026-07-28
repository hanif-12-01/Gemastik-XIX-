import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsMitra, loginAsCustomer } from '../helpers/auth'

test.describe('Roadmap 10: Controlled Pilot Evidence & Competition Submission E2E', () => {
  test('Complete pilot evidence verification across Admin, Mitra, DPP, and Polygon Amoy', async ({ page }) => {
    // 1. Admin logs in and opens Material & Orders
    await loginAsAdmin(page)
    await page.goto('/admin/materials')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Batch|Material/i)

    await page.goto('/admin/orders')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Production Orders|Order/i)

    // 2. Mitra logs in and views production workflow
    await loginAsMitra(page)
    await page.goto('/mitra')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Mitra|Ratna|Proses/i)

    // 3. Public DPP Page displays database & Polygon Amoy testnet status
    await page.goto('/dpp/PRD-2026-0001')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Database|Polygon Amoy|0x73f46FE2/i)
    await expect(page.locator('body')).toContainText(/Diverifikasi di Polygon Amoy Testnet/i)

    // 4. Customer logs in and views account orders
    await loginAsCustomer(page)
    await page.goto('/account/orders')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Pesanan Saya|Order/i)
  })

  test('Public API health and pilot evidence endpoints return valid structures', async ({ request }) => {
    // Health live check
    const healthRes = await request.get('/api/v1/health/live')
    expect(healthRes.status()).toBe(200)

    // Public DPP verification
    const dppRes = await request.get('/api/v1/public/dpp/PRD-2026-0001/blockchain-verification')
    expect(dppRes.status()).toBe(200)
    const json = await dppRes.json()
    expect(json.success).toBe(true)
    expect(json.data.contractAddress.toLowerCase()).toBe('0x73f46fe2a87e158d4eda6aa5cbc464b5fb71b220')
  })
})
