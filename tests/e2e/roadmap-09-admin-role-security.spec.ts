import { test, expect } from '@playwright/test'

test.describe('Roadmap 9.2: Admin Panel & Role-Isolation Playwright E2E', () => {
  const apiBaseUrl = process.env.TEST_API_BASE_URL || 'http://127.0.0.1:4000/api/v1'

  test('Admin logs in, opens pilot DPP, verifies contract & tx hash appear, and status persists on refresh', async ({ page }) => {
    // 1. Admin login via /auth/admin/login
    await page.goto('/auth/admin/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', 'admin@ecothread.local')
    await page.fill('input[type="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    // 2. Open pilot DPP page in public/admin view
    await page.goto('/dpp/PRD-2026-0001')
    await page.waitForLoadState('networkidle')

    // 3. Verified contract & tx hash links appear
    await expect(page.locator('body')).toContainText('PRD-2026-0001')
    await expect(page.locator('body')).toContainText('0x1af5f0778b7a5cfcfa469efe177a84650f45de9a3cda30c1da0e8bc205702706')
    await expect(page.locator('a[href*="0x73f46FE2a87e158d4eDa6aa5cBC464B5fB71b220"]')).toBeVisible()
    await expect(page.locator('a[href*="0x6d1fa601a72001228e0a3ef07b515ce6539e4c5e38b5154b8a663cd4358556d4"]')).toBeVisible()

    // 4. Refresh persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('a[href*="0x73f46FE2a87e158d4eDa6aa5cBC464B5fB71b220"]')).toBeVisible()
    await expect(page.locator('a[href*="0x6d1fa601a72001228e0a3ef07b515ce6539e4c5e38b5154b8a663cd4358556d4"]')).toBeVisible()
  })

  test('Role isolation API tests: Unauthenticated (401), Mitra (403), Customer (403)', async ({ request }) => {
    // Unauthenticated request to Admin anchor endpoint -> 401/403
    const unauthRes = await request.post(`${apiBaseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
      data: {}
    })
    expect([401, 403]).toContain(unauthRes.status())

    // Login as Mitra (mitra@ecothread.local / Password123!)
    const mitraLogin = await request.post(`${apiBaseUrl}/auth/login`, {
      data: { email: 'mitra@ecothread.local', password: 'Password123!' }
    })
    const mitraJson = await mitraLogin.json()
    const mitraToken = mitraJson.token || mitraJson.data?.token

    // Mitra attempt to trigger Admin anchor endpoint -> 403 Forbidden
    const mitraRes = await request.post(`${apiBaseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
      headers: { Authorization: `Bearer ${mitraToken}` },
      data: {}
    })
    expect(mitraRes.status()).toBe(403)

    // Login as Customer (user@ecothread.local / Password123!)
    const customerLogin = await request.post(`${apiBaseUrl}/auth/login`, {
      data: { email: 'user@ecothread.local', password: 'Password123!' }
    })
    const customerJson = await customerLogin.json()
    const customerToken = customerJson.token || customerJson.data?.token

    // Customer attempt to trigger Admin anchor endpoint -> 403 Forbidden
    const customerRes = await request.post(`${apiBaseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
      headers: { Authorization: `Bearer ${customerToken}` },
      data: {}
    })
    expect(customerRes.status()).toBe(403)
  })
})
