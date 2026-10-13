import { getTranslations } from 'next-intl/server'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { HeaderClient } from './HeaderClient'
import { normalizeNav } from '@/lib/nav'

export async function Header({ locale }: { locale: Locale }) {
  const [header, settings, tn] = await Promise.all([getGlobal('header', locale), getGlobal('site-settings', locale), getTranslations('nav')])
  return (
    <HeaderClient
      nav={normalizeNav(header.nav as never)}
      locale={locale}
      siteName={settings.siteName}
      logoUrl={mediaUrl(settings.logoLight)}
      t={{ menu: tn('menu'), close: tn('close'), language: tn('language') }}
    />
  )
}
