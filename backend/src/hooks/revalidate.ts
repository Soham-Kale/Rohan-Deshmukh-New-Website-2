import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { frontendUrl, internalSecret } from '../lib/urls'

/**
 * After every edit in the admin, ask the website (frontend tier) to drop its cached pages so the change
 * appears immediately. The website is a separate app now, so this is an HTTP call to its
 * /api/revalidate endpoint, signed with the shared INTERNAL_API_SECRET.
 * A failure is only logged — saving in the admin must never fail because the website is offline
 * (pages also refresh on their own every 5 minutes).
 */
const notifyFrontend = async (log?: (msg: string) => void) => {
  if (process.env.PAYLOAD_SEED === 'true') return // bulk seed: the website rebuilds afterwards anyway
  try {
    const res = await fetch(`${frontendUrl()}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-internal-secret': internalSecret() },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) log?.(`Website cache refresh answered ${res.status}`)
  } catch (e) {
    log?.(`Website cache refresh failed (${(e as Error).message}) — pages update within 5 minutes`)
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await notifyFrontend((m) => req.payload.logger.warn(m))
  return doc
}
export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await notifyFrontend((m) => req.payload.logger.warn(m))
  return doc
}
