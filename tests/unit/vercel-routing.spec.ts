import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

test('Vercel mengirim seluruh /api/* ke satu Fastify function sebelum SPA fallback', () => {
  const projectRoot = resolve(import.meta.dirname, '../..')
  const config = JSON.parse(
    readFileSync(resolve(projectRoot, 'vercel.json'), 'utf8')
  )

  assert.equal(existsSync(resolve(projectRoot, 'api/index.ts')), true)
  assert.equal(config.functions['api/index.ts'].maxDuration, 30)
  assert.deepEqual(config.routes[0], {
    src: '/api/(.*)',
    dest: '/api/index'
  })
  assert.deepEqual(config.routes[1], { handle: 'filesystem' })
  assert.deepEqual(config.routes[2], {
    src: '/(.*)',
    dest: '/index.html'
  })
})
