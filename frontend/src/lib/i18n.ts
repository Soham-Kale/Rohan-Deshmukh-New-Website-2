import en from '@/i18n/messages/en.json'
import mr from '@/i18n/messages/mr.json'
import type { Locale } from './api'

/**
 * The website is English only (Oct 2026): every page is shown in English and addresses carry no language prefix.
 * Marathi text stays in the CMS and in src/i18n/messages/mr.json, so turning a /mr site on later is a routing change,
 * not a rewrite — components already take `locale` where wording differs.
 */
export const LOCALE: Locale = 'en'

const dictionaries: Record<Locale, unknown> = { en, mr }

type Vars = Record<string, string | number>

const lookup = (locale: Locale, ns: string, key: string): string | undefined => {
  const node = (dictionaries[locale] as Record<string, Record<string, string>>)[ns]
  const value = node?.[key]
  return typeof value === 'string' ? value : undefined
}

export interface Translator {
  (key: string, vars?: Vars): string
  has: (key: string) => boolean
}

/** `const t = translations('common'); t('readMore')`, with {placeholders}: t('showing', { count: 3 }) */
export function translations(ns: string, locale: Locale = LOCALE): Translator {
  const t = ((key: string, vars?: Vars) => {
    const text = lookup(locale, ns, key) ?? lookup('en', ns, key) ?? key
    return vars ? text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : text
  }) as Translator
  t.has = (key) => lookup(locale, ns, key) !== undefined
  return t
}

/** Hook form of translations(): the dictionaries never change at runtime, so this is a plain function call */
export const useTranslations = (ns: string, locale: Locale = LOCALE) => translations(ns, locale)

export type { Locale }
