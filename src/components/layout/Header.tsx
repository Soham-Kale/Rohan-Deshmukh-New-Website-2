import { getTranslations } from 'next-intl/server'
import { Mail, Phone } from 'lucide-react'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { HeaderClient } from './HeaderClient'
import { normalizeNav } from '@/lib/nav'
import { SocialIcon, socialLabels } from '../ui/SocialIcon'

/**
 * Site header, identical on every page:
 * a thin utility strip (phone · email | social links) that scrolls away, then the sticky white main bar
 * (logo · menu · language · "संपर्क साधा" button).
 */
export async function Header({ locale }: { locale: Locale }) {
  const [header, settings, tn, tc] = await Promise.all([getGlobal('header', locale), getGlobal('site-settings', locale), getTranslations('nav'), getTranslations('common')])
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id') as [string, string][]
  return (
    <>
      <div className="hidden border-b border-line bg-cream text-[0.9rem] text-muted md:block">
        <div className="container-x flex h-9 items-center justify-between gap-6">
          <ul className="flex items-center gap-6 pt-[3px]">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 transition hover:text-saffron-700">
                  <Phone aria-hidden className="size-3.5 text-saffron-600" /> {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 transition hover:text-saffron-700">
                  <Mail aria-hidden className="size-3.5 text-saffron-600" /> {settings.email}
                </a>
              </li>
            )}
          </ul>
          {!!social.length && (
            <ul className="flex items-center gap-1" aria-label={tc('followUs')}>
              {social.map(([k, v]) => (
                <li key={k}>
                  <a href={v} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-8 place-items-center rounded-full text-charcoal-700 transition hover:bg-saffron-100 hover:text-saffron-700">
                    <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-[15px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <HeaderClient
        nav={normalizeNav(header.nav as never)}
        locale={locale}
        siteName={settings.siteName}
        logoUrl={mediaUrl(settings.logoLight)}
        logoDarkUrl={mediaUrl(settings.logoDark)}
        cta={{ label: locale === 'mr' ? 'संपर्क साधा' : 'Get in touch', href: '/contact' }}
        t={{ menu: tn('menu'), close: tn('close'), language: tn('language') }}
      />
    </>
  )
}
