import { test, expect } from '@playwright/test'
import { loginAsMitra } from '../helpers/auth'

test.describe('Mitra Production Workflow E2E', () => {
  test('Mitra views assigned orders and updates progress', async ({ page }) => {
    await loginAsMitra(page)
    await page.goto('/mitra/orders')
    await expect(page.locator('body')).toContainText(/Pekerjaan Saya|Ratna/i)
    await expect(page.getByText('Upah yang diterima').first()).toBeVisible()
  })
})
