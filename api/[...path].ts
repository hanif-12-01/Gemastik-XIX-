/**
 * Unified Vercel entrypoint.
 *
 * Keeping the function at the repository root lets the jury-facing Vite app
 * and Fastify API share one public origin, so no cross-project API URL or CORS
 * configuration is required.
 */
export { default } from '../apps/api/api/index'
