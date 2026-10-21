import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import { useLayout } from '@/lib/layout'
import { LOCALE, useTranslations } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { isLiveLink } from '@/lib/nav'
import { CMSLink } from '../ui/CMSLink'
import { SocialIcon } from '../ui/SocialIcon'
import { socialLabels } from '@/lib/social'

/** Removed from the footer (Oct 2026) — hidden even if an older footer in the database still lists them */
const HIDDEN_LEGAL = ['/privacy-policy', '/terms', '/disclaimer']

export function Footer() {
  const { settings, footer } = useLayout()
  const t = useTranslations('common')
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id')
  const logo = mediaUrl(settings.logoLight)

  return (
    <footer className="on-dark bg-charcoal-900 text-white/80">
      {/* four columns, like an official site: contact · then the footer menus (each with › bullets) */}
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:py-16 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <p className="mb-5 text-lg text-white">{t('contactUs')}</p>
          {logo ? <img src={logo} alt={settings.siteName} width={200} height={52} loading="lazy" className="h-12 w-auto" /> : <p className="font-display text-2xl text-white">{settings.siteName}</p>}
          <ul className="mt-5 space-y-2.5 text-[0.98rem]">
            {settings.address && (
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-saffron-300" /> <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-white">
                  <Mail className="size-4 shrink-0 text-saffron-300" /> {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-white">
                  <Phone className="size-4 shrink-0 text-saffron-300" /> {settings.phone}
                </a>
              </li>
            )}
          </ul>
          {!!social.length && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('followUs')}>
              {social.map(([k, v]) => (
                <li key={k}>
                  <a href={v as string} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-10 place-items-center rounded-full ring-1 ring-white/30 transition hover:bg-saffron-600 hover:ring-saffron-600">
                    <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-4 text-white" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <CMSLink url="/contact" className="mt-6 inline-flex min-h-11 items-center rounded-md px-5 text-[0.95rem] text-white ring-1 ring-white/60 transition hover:bg-white hover:text-charcoal-900">
            {LOCALE === 'en' ? 'More locations' : 'सर्व कार्यालये'}
          </CMSLink>
        </div>

        {footer.columns?.map((col) => (
          <div key={col.id}>
            <p className="mb-5 text-lg text-white">{col.title}</p>
            <ul className="space-y-2.5 text-[0.98rem]">
              {col.links?.filter((l) => isLiveLink(l.url)).map((l) => (
                <li key={l.id}>
                  <CMSLink url={l.url} newTab={l.newTab} className="group inline-flex items-start gap-2 transition hover:text-white">
                    <ChevronRight aria-hidden className="mt-[0.4rem] size-3.5 shrink-0 text-saffron-300 transition group-hover:translate-x-0.5" />
                    {l.label}
                  </CMSLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* bottom bar */}
      <div className="bg-charcoal-950">
        <div className="container-x flex flex-col gap-3 py-5 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>
            {footer.copyright}
            {footer.developerCredit && (
              <span>
                {' · '}
                {footer.developerUrl ? (
                  <a href={footer.developerUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-white hover:underline">
                    {footer.developerCredit}
                  </a>
                ) : (
                  footer.developerCredit
                )}
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footer.legalLinks?.filter((l) => isLiveLink(l.url) && !HIDDEN_LEGAL.includes(l.url ?? '')).map((l) => (
              <CMSLink key={l.id} url={l.url} className="underline underline-offset-4 hover:text-white">
                {l.label}
              </CMSLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
