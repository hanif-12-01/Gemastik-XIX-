import { test, expect } from '@playwright/test'

test.describe('Responsive Viewports E2E', () => {
  const viewports = [
    { name: 'Mobile Small', width: 360, height: 800 },
    { name: 'Mobile Large', width: 390, height: 844 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop Small', width: 1280, height: 800 },
    { name: 'Desktop Large', width: 1440, height: 900 }
  ]

  for (const vp of viewports) {
    test(`Landing page renders cleanly on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})
