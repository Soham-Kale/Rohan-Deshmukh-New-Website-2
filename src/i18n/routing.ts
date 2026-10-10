import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['mr', 'en'],
  defaultLocale: 'mr',
  localePrefix: 'as-needed', // Marathi at "/", English at "/en"
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
