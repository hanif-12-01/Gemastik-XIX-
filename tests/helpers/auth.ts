import { Page, expect } from '@playwright/test'

export async function loginAsAdmin(page: Page) {
  await page.goto('/auth/admin/login')
  await page.fill('input[type="email"]', 'admin@ecothread.local')
  await page.fill('input[type="password"]', 'Password123!')
  await page.click('button[type="submit"]')
  await page.waitForURL(
    url => url.pathname === '/admin' || url.pathname.startsWith('/admin/'),
    { timeout: 15000 }
  ).catch(() => {})
  await page.waitForLoadState('networkidle')
}

export async function loginAsMitra(page: Page) {
  await page.goto('/auth/mitra/login')
  await page.fill('input[type="email"]', 'mitra@ecothread.local')
  await page.fill('input[type="password"]', 'Password123!')
  await page.click('button[type="submit"]')
  await page.waitForURL(
    url => url.pathname === '/mitra' || url.pathname.startsWith('/mitra/'),
    { timeout: 15000 }
  ).catch(() => {})
  await page.waitForLoadState('networkidle')
}

export async function loginAsCustomer(page: Page) {
  await page.goto('/auth/customer/login')
  await page.fill('input[type="email"]', 'pelanggan@ecothread.local')
  await page.fill('input[type="password"]', 'DemoPelanggan2026!')
  await page.click('button[type="submit"]')
  await page.waitForURL(
    url => url.pathname.startsWith('/account') || url.pathname.startsWith('/catalog'),
    { timeout: 15000 }
  ).catch(() => {})
  await page.waitForLoadState('networkidle')
}
