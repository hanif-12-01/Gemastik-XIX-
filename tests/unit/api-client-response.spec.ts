import assert from 'node:assert/strict'
import test from 'node:test'
import { EcoThreadApiClient } from '../../packages/api-client/src/index'

const credentials = {
  email: 'admin@ecothread.local',
  password: 'Password123!'
}

async function withMockFetch(
  responseFactory: () => Response,
  assertion: (client: EcoThreadApiClient) => Promise<void>
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => responseFactory()

  try {
    await assertion(new EcoThreadApiClient('/api/v1'))
  } finally {
    globalThis.fetch = originalFetch
  }
}

test('login menampilkan pesan yang jelas saat proxy mengembalikan respons kosong', async () => {
  await withMockFetch(
    () => new Response(null, { status: 502 }),
    async (client) => {
      await assert.rejects(
        client.login(credentials.email, credentials.password),
        /tidak memberikan respons/
      )
    }
  )
})

test('login mengenali halaman HTML sebagai salah rute API', async () => {
  await withMockFetch(
    () => new Response('<!doctype html><title>EcoThread</title>', {
      status: 200,
      headers: { 'content-type': 'text/html' }
    }),
    async (client) => {
      await assert.rejects(
        client.login(credentials.email, credentials.password),
        /belum terhubung ke server API/
      )
    }
  )
})

test('401 saat login tetap menampilkan pesan kredensial dari API', async () => {
  await withMockFetch(
    () => new Response(JSON.stringify({
      success: false,
      error: 'Email atau password tidak valid.'
    }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    }),
    async (client) => {
      client.onUnauthorized(() => {
        throw new Error('callback sesi tidak boleh dipanggil ketika login')
      })

      await assert.rejects(
        client.login(credentials.email, 'password-salah'),
        /Email atau password tidak valid/
      )
    }
  )
})
