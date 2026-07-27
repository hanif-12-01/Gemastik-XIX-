import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsMitra } from '../helpers/auth'

test.describe('Authentication & Session E2E', () => {
  test('Admin valid login and session persistence', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page.locator('body')).toContainText(/Dashboard|Admin|Statistik/i)
    await page.reload()
    await expect(page).toHaveURL(/\/admin/)
  })

  test('Mitra login and navigation', async ({ page }) => {
    await loginAsMitra(page)
    await expect(page.locator('body')).toContainText(/Mitra|Order|Ratna/i)
  })

  test('Customer registration and login flow', async ({ page }) => {
    const timestamp = Date.now()
    const email = `customer_${timestamp}@ecothread.local`

    await page.goto('/auth/customer/register')
    await page.fill('input[placeholder="Nama Anda"]', 'Tester Customer')
    await page.fill('input[placeholder="email@contoh.com"]', email)
    await page.locator('input[type="password"]').first().fill('Password123!')
    await page.locator('input[type="password"]').nth(1).fill('Password123!')
    await page.click('button[type="submit"]')

    await page.waitForTimeout(1500)
    await expect(page.locator('body')).toContainText(/Pelanggan|Masuk|Akun/i)
  })

  test('Unauthenticated user redirected when accessing protected /admin route', async ({ page }) => {
    await page.goto('/portal')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.goto('/admin/dashboard')
    await page.waitForTimeout(1000)
    await expect(page).not.toHaveURL(/\/admin\/dashboard/)
  })
})
