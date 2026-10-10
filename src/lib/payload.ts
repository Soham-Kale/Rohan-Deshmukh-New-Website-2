import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'

export const payload = cache(async () => getPayload({ config }))

export const getGlobal = cache(async <T extends 'site-settings' | 'header' | 'footer' | 'home' | 'popup'>(slug: T, locale: Locale) => {
  const p = await payload()
  return p.findGlobal({ slug, locale, depth: 2 })
})
