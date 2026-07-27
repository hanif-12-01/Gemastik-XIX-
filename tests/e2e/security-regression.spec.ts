import { test, expect } from '@playwright/test'
import { loginAsCustomer, loginAsMitra } from '../helpers/auth'

test.describe('Security & RBAC Isolation E2E', () => {
  test('Customer cannot access Admin dashboard', async ({ page }) => {
    await loginAsCustomer(page)
    await page.goto('/admin/dashboard')
    await page.waitForTimeout(1000)
    await expect(page).not.toHaveURL(/\/admin\/dashboard/)
  })

  test('Mitra cannot access Admin payments queue', async ({ page }) => {
    await loginAsMitra(page)
    await page.goto('/admin/payments')
    await page.waitForTimeout(1000)
    await expect(page).not.toHaveURL(/\/admin\/payments/)
  })
})
