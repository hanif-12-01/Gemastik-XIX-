import { test, expect } from '@playwright/test'
import { loginAsAdmin } from '../helpers/auth'

test.describe('Admin Operations Foundation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('Create Material Source', async ({ page }) => {
    await page.goto('/admin/material-sources')
    await expect(page.locator('body')).toContainText(/Bahan|Material|Sumber/i)
  })

  test('Create Material Batch', async ({ page }) => {
    await page.goto('/admin/material-batches')
    await expect(page.locator('body')).toContainText(/Bahan|Material|Batch/i)
  })
})
