/**
 * Local development server entry point.
 * This file is NOT used by Vercel Functions — see api/index.ts for the Vercel handler.
 *
 * Usage: pnpm dev (from apps/api or root)
 */
import { buildApp } from './app'

const PORT = Number(process.env.PORT || 4000)
const HOST = process.env.HOST || '0.0.0.0'

async function start() {
  const fastify = await buildApp()
  try {
    await fastify.listen({ port: PORT, host: HOST })
    console.log(`🚀 EcoThread API running at http://${HOST}:${PORT}`)
    console.log(`📊 Health: http://${HOST}:${PORT}/api/v1/health/live`)
    console.log(`✅ Ready:  http://${HOST}:${PORT}/api/v1/health/ready`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
