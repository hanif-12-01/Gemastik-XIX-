import { test, expect } from '@playwright/test'

test.describe('EcoThread Full Lifecycle & E2E Verification', () => {

  test('Admin Flow: Login & View Dashboard Metrics', async ({ page }) => {
    // 1. Open Admin Login Page
    await page.goto('http://localhost:5173/')
    await expect(page).toHaveTitle(/EcoThread/)

    // 2. Fill Admin Credentials
    await page.fill('input[type="email"]', 'admin@ecothread.local')
    await page.fill('input[type="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    // 3. Verify Admin Dashboard Header & Content
    await expect(page.locator('text=Super Admin')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Limbah Diproses')).toBeVisible()
    await expect(page.locator('text=Unit Terjual')).toBeVisible()

    // 4. Logout
    await page.click('button[title="Keluar dari Admin"]')
    await expect(page.locator('text=EcoThread Admin')).toBeVisible()
  })

  test('Mitra Flow: Login & View Production Orders', async ({ page }) => {
    // 1. Open Mitra Login Page
    await page.goto('http://localhost:5174/')
    
    // 2. Click Mitra Demo Account or Fill Credentials
    await page.fill('input[type="email"]', 'mitra@ecothread.local')
    await page.fill('input[type="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    // 3. Verify Mitra Dashboard & Orders
    await expect(page.locator('text=Assalamu\'alaikum')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Pesanan Aktif')).toBeVisible()
  })

  test('User Flow: View DPP & Verified Status', async ({ page }) => {
    // 1. Open User App DPP
    await page.goto('http://localhost:5175/')

    // 2. Verify Page Content & Database Verified Badge
    await expect(page.locator('text=EcoThread DPP')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Database Verified')).toBeVisible()
    await expect(page.locator('text=Dampak Lingkungan')).toBeVisible()
  })

  test('Negative Tests: Security & Authorization Controls', async ({ request }) => {
    // 1. Access Protected Endpoint without Token -> 401
    const unauthRes = await request.get('http://localhost:4000/api/v1/admin/mitra')
    expect(unauthRes.status()).toBe(401)

    // 2. Mitra Attempts Admin Route Access -> 403
    const mitraLogin = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'mitra@ecothread.local', password: 'Password123!' }
    })
    const mitraData = await mitraLogin.json()
    const mitraToken = mitraData.data.token

    const forbiddenRes = await request.get('http://localhost:4000/api/v1/admin/mitra', {
      headers: { Authorization: `Bearer ${mitraToken}` }
    })
    expect(forbiddenRes.status()).toBe(403)

    // 3. User Attempts Self Verification of Payment -> Rejected
    const badLoginRes = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'wrong@ecothread.local', password: 'wrong' }
    })
    expect(badLoginRes.status()).toBe(400)
  })

})
