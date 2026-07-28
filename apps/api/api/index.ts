/**
 * Vercel Function entrypoint for EcoThread API.
 *
 * Vercel calls this file as a serverless function handler.
 * It MUST export a default handler and must NOT call listen().
 *
 * The buildApp() factory is called once per cold start and
 * the Fastify instance is reused across warm invocations.
 */
import { buildApp } from '../src/app'
import type { IncomingMessage, ServerResponse } from 'http'

// Fastify instance — reused across warm invocations
let _app: Awaited<ReturnType<typeof buildApp>> | undefined

async function getApp() {
  if (!_app) {
    _app = await buildApp()
    // Ready the Fastify instance without binding to a port
    await _app.ready()
  }
  return _app
}

// Vercel Node.js handler
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const app = await getApp()
  app.server.emit('request', req, res)
}
