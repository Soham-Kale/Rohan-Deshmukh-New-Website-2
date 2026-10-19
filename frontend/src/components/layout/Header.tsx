import { getTranslations } from 'next-intl/server'
import { getGlobal } from '@/lib/cms'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { HeaderClient } from './HeaderClient'
import { normalizeNav } from '@/lib/nav'

/**
 * Site header, identical on every page (official-site layout): one sticky white bar —
 * logo on the left and the menu (the "Get in touch" button was removed in Oct 2026; Contact stays in the menu).
 * (Phone, email and social links live in the footer and beside the home hero.)
 */
export async function Header({ locale }: { locale: Locale }) {
  const [header, settings, tn] = await Promise.all([getGlobal('header', locale), getGlobal('site-settings', locale), getTranslations('nav')])
  return (
    <>
      <HeaderClient
        nav={normalizeNav(header.nav as never)}
        locale={locale}
        siteName={settings.siteName}
        logoUrl={mediaUrl(settings.logoLight)}
        logoDarkUrl={mediaUrl(settings.logoDark)}
        t={{ menu: tn('menu'), close: tn('close') }}
      />
    </>
  )
}
