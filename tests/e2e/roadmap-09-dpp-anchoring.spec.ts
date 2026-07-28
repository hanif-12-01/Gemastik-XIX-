import { test, expect } from '@playwright/test'

test.describe('Roadmap 9: Polygon Amoy Testnet DPP Anchoring & Verification E2E', () => {

  test('Public DPP page displays verification & testnet disclaimer', async ({ page }) => {
    await page.goto('/dpp/PRD-2026-0001')
    await page.waitForLoadState('networkidle')

    // Page title and headers
    await expect(page.locator('h1')).toContainText('Paspor Sirkular Produk')
    await expect(page.locator('body')).toContainText('PRD-2026-0001')

    // Status Verification Card
    await expect(page.locator('body')).toContainText(/Database Verified|Database & Blockchain Verified/i)
    await expect(page.locator('body')).toContainText('PostgreSQL System of Record')

    // Disclaimer
    await expect(page.locator('body')).toContainText(/Polygon Amoy Testnet|lingkungan pengujian/i)
  })

  test('Public API endpoint /api/v1/public/dpp/:code/blockchain-verification returns valid contract structure', async ({ request }) => {
    const apiBaseUrl = process.env.TEST_API_BASE_URL || 'http://127.0.0.1:4000/api/v1'
    const response = await request.get(`${apiBaseUrl}/public/dpp/PRD-2026-0001/blockchain-verification`)
    expect(response.status()).toBe(200)

    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data.networkName).toBe('Polygon Amoy Testnet')
    expect(json.data.chainId).toBe(80002)
    expect(json.data.disclaimer).toContain('Polygon Amoy Testnet')
  })

  test('Security: Web bundle contains no private key secrets', async ({ page }) => {
    await page.goto('/')
    const content = await page.content()
    expect(content).not.toContain('POLYGON_AMOY_PRIVATE_KEY')
    expect(content).not.toContain('0x0000000000000000000000000000000000000000000000000000000000000001')
  })
})
