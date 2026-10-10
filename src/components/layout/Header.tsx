import { getTranslations } from 'next-intl/server'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { HeaderClient } from './HeaderClient'
import { normalizeNav } from '@/lib/nav'

export async function Header({ locale }: { locale: Locale }) {
  const [header, settings, tn, ts, tc] = await Promise.all([
    getGlobal('header', locale),
    getGlobal('site-settings', locale),
    getTranslations('nav'),
    getTranslations('search'),
    getTranslations('common'),
  ])
  return (
    <HeaderClient
      nav={normalizeNav(header.nav as never)}
      locale={locale}
      siteName={settings.siteName}
      logoUrl={mediaUrl(settings.logoLight)}
      cta={{ label: settings.ctaLabel, url: settings.ctaUrl }}
      t={{ menu: tn('menu'), close: tn('close'), search: tn('search'), language: tn('language'), searchPlaceholder: ts('placeholder'), searchHint: ts('hint'), noResults: tc('noResults') }}
    />
  )
}
