/**
 * Oct 2026 restructure: new header menu, footer links and #ConnectWithRohan target.
 * Used by the migration (live site) and by `npm run menu:update` (local database).
 * Only changes navigation — page content, posts and photos are untouched.
 */
import type { Payload } from 'payload'
import { footer, header } from './content-globals'
import { updateGlobalBilingual } from './bilingual'

export async function applyMenu(payload: Payload) {
  await updateGlobalBilingual(payload, 'header', header())
  await updateGlobalBilingual(payload, 'footer', footer())
  for (const locale of ['mr', 'en'] as const) {
    await payload.updateGlobal({ slug: 'site-settings', locale, depth: 0, data: { connectTagUrl: '/contact' } as never })
  }
}
