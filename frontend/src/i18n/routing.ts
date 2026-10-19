import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // English only (Oct 2026). Pages live at "/" with no prefix; old "/en/…" links redirect to the same page.
  // Marathi content stays in the CMS (admin locale switch) but is no longer published on the site.
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
})

/** 'mr' is kept in the type so existing `locale === 'mr' ? … : …` branches still compile; at runtime it is always 'en' */
export type Locale = 'mr' | 'en'
