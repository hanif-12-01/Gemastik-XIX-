import { test, expect } from '@playwright/test'

test.describe('Roadmap 9.2: Live Polygon Amoy Testnet Release Gate E2E', () => {

  test('Public DPP page for PRD-2026-0001 renders live Testnet Verified status, Keccak-256 metadata hash, PolygonScan links, and mandatory Indonesian disclaimer', async ({ page }) => {
    await page.goto('/dpp/PRD-2026-0001')
    await page.waitForLoadState('networkidle')

    // 1. Title and product code
    await expect(page.locator('h1')).toContainText('Paspor Sirkular Produk')
    await expect(page.locator('body')).toContainText('PRD-2026-0001')

    // 2. Status cards & badges
    await expect(page.locator('body')).toContainText(/Database & Blockchain Verified|Database Verified/i)
    await expect(page.locator('body')).toContainText('PostgreSQL System of Record')
    await expect(page.locator('body')).toContainText('Polygon Amoy Testnet')

    // 3. On-chain section title & metadata hash
    await expect(page.locator('body')).toContainText('Integritas Hash On-Chain — Polygon Amoy Testnet')
    await expect(page.locator('body')).toContainText('0x1af5f0778b7a5cfcfa469efe177a84650f45de9a3cda30c1da0e8bc205702706')

    // 4. PolygonScan Explorer links
    const txLink = page.locator('a', { hasText: 'Lihat Transaksi di PolygonScan' })
    await expect(txLink).toBeVisible()
    await expect(txLink).toHaveAttribute('href', /amoy\.polygonscan\.com\/tx\/0x6d1fa601a72001228e0a3ef07b515ce6539e4c5e38b5154b8a663cd4358556d4/)

    const contractLink = page.locator('a', { hasText: 'Lihat Smart Contract' })
    await expect(contractLink).toBeVisible()
    await expect(contractLink).toHaveAttribute('href', /amoy\.polygonscan\.com\/address\/0x73f46FE2a87e158d4eDa6aa5cBC464B5fB71b220/)

    // 5. Mandatory Indonesian disclaimer
    await expect(page.locator('body')).toContainText('Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon.')
  })

  test('Public API /blockchain-verification endpoint returns live verified contract evidence', async ({ request }) => {
    const apiBaseUrl = process.env.TEST_API_BASE_URL || 'http://127.0.0.1:4000/api/v1'
    const response = await request.get(`${apiBaseUrl}/public/dpp/PRD-2026-0001/blockchain-verification`)
    expect(response.status()).toBe(200)

    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.data.isVerifiedOnChain).toBe(true)
    expect(json.data.networkName).toBe('Polygon Amoy Testnet')
    expect(json.data.chainId).toBe(80002)
    expect(json.data.contractAddress).toBe('0x73f46FE2a87e158d4eDa6aa5cBC464B5fB71b220')
    expect(json.data.transactionHash).toBe('0x6d1fa601a72001228e0a3ef07b515ce6539e4c5e38b5154b8a663cd4358556d4')
    expect(json.data.metadataHash).toBe('0x1af5f0778b7a5cfcfa469efe177a84650f45de9a3cda30c1da0e8bc205702706')
    expect(json.data.disclaimer).toBe('Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon.')
  })

  test('Role security: Unauthenticated attempt to trigger anchor endpoint returns 401/403 forbidden', async ({ request }) => {
    const apiBaseUrl = process.env.TEST_API_BASE_URL || 'http://127.0.0.1:4000/api/v1'
    const response = await request.post(`${apiBaseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
      data: {}
    })
    expect([401, 403]).toContain(response.status())
  })
})
