import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import { CMSLink } from '../ui/CMSLink'
import { SocialIcon, socialLabels } from '../ui/SocialIcon'

export async function Footer({ locale }: { locale: Locale }) {
  const [settings, footer, t] = await Promise.all([getGlobal('site-settings', locale), getGlobal('footer', locale), getTranslations('common')])
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id')
  const logo = mediaUrl(settings.logoLight)

  return (
    <footer className="on-dark grain bg-maroon-950 text-white/80">
      {settings.appealHeading && (
        <div className="border-b border-white/10">
          <div className="container-x flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
            <h2 className="max-w-2xl font-display text-3xl text-white md:text-4xl">{settings.appealHeading}</h2>
            {settings.appealButtonUrl && (
              <CMSLink url={settings.appealButtonUrl} className="btn btn-primary text-lg">
                {settings.appealButtonLabel}
              </CMSLink>
            )}
          </div>
        </div>
      )}

      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          {logo ? <Image src={logo} alt={settings.siteName} width={200} height={52} className="h-12 w-auto" /> : <p className="font-display text-2xl text-white">{settings.siteName}</p>}
          {settings.tagline && <p className="mt-4 max-w-sm text-white/65">{settings.tagline}</p>}
          <ul className="mt-6 space-y-3">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-saffron-300">
                  <Phone className="size-4 text-saffron-300" /> {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-saffron-300">
                  <Mail className="size-4 text-saffron-300" /> {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-saffron-300" /> <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
          </ul>
          <CMSLink url="/contact" className="mt-3 inline-block text-sm font-semibold text-saffron-300 hover:underline">
            {locale === 'mr' ? 'सर्व कार्यालये →' : 'More locations →'}
          </CMSLink>
        </div>

        {footer.columns?.map((col) => (
          <div key={col.id}>
            <p className="eyebrow mb-4">{col.title}</p>
            <ul className="space-y-2">
              {col.links?.map((l) => (
                <li key={l.id}>
                  <CMSLink url={l.url} newTab={l.newTab} className="transition hover:text-saffron-300">
                    {l.label}
                  </CMSLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-5 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="mr-1 text-white/60">{t('followUs')}:</span>
            {social.map(([k, v]) => (
              <a key={k} href={v as string} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-saffron-500 hover:text-white">
                <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-4" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/60">
            <span>{footer.copyright}</span>
            {footer.legalLinks?.map((l) => (
              <CMSLink key={l.id} url={l.url} className="hover:text-white">
                {l.label}
              </CMSLink>
            ))}
            {footer.developerCredit && (
              <span>
                {footer.developerUrl ? (
                  <a href={footer.developerUrl} target="_blank" rel="noopener" className="hover:text-white">
                    {footer.developerCredit}
                  </a>
                ) : (
                  footer.developerCredit
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
