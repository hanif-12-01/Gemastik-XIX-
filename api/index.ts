/**
 * Unified Vercel API entrypoint.
 *
 * Vercel exposes this file as /api/index. The root routing configuration sends
 * every /api/* request to this one Fastify function while preserving the
 * original request path for Fastify's router.
 */
export { default } from '../apps/api/api/index'
