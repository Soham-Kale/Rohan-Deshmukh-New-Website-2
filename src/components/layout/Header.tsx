import { getTranslations } from 'next-intl/server'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { HeaderClient } from './HeaderClient'
import { normalizeNav } from '@/lib/nav'

/**
 * Site header, identical on every page (official-site layout): one sticky white bar —
 * logo on the left, the menu centred and a solid "Get in touch" button on the right.
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
        cta={{ label: locale === 'mr' ? 'संपर्क साधा' : 'Get in touch', href: '/contact' }}
        t={{ menu: tn('menu'), close: tn('close') }}
      />
    </>
  )
}
