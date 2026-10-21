import { Mail, MapPin, Phone } from 'lucide-react'
import { useLayout } from '@/lib/layout'
import { LOCALE, useTranslations } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { isLiveLink } from '@/lib/nav'
import { CMSLink } from '../ui/CMSLink'
import { SocialIcon } from '../ui/SocialIcon'
import { socialLabels } from '@/lib/social'

/** Removed from the footer (Oct 2026) — hidden even if an older footer in the database still lists them */
const HIDDEN_LEGAL = ['/privacy-policy', '/terms', '/disclaimer']

/**
 * Footer (Stitch design, Oct 2026): deep navy with a kesariya top edge — contact details, social links and "More locations"
 * on the left, the footer menus from the CMS beside it, then the copyright line.
 */
export function Footer() {
  const { settings, footer } = useLayout()
  const t = useTranslations('common')
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id')
  const logo = mediaUrl(settings.logoLight)
  const cols = footer.columns ?? []

  return (
    <footer className="on-dark relative z-10 border-t-4 border-saffron-500 bg-charcoal-950 pb-10 pt-16 text-white">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-start gap-4 lg:col-span-5">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-saffron-500">{t('contactUs')}</h4>
            {logo ? <img src={logo} alt={settings.siteName} width={200} height={52} loading="lazy" className="h-12 w-auto" /> : <span className="font-display text-xl font-bold tracking-tight text-white">{settings.siteName}</span>}
            <ul className="space-y-2.5 pt-2 text-sm text-slate-300">
              {settings.address && (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 size-[18px] shrink-0 text-saffron-500" /> <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 transition-colors hover:text-saffron-200">
                    <Mail className="size-[18px] shrink-0 text-saffron-500" /> {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-saffron-200">
                    <Phone className="size-[18px] shrink-0 text-saffron-500" /> {settings.phone}
                  </a>
                </li>
              )}
            </ul>
            {!!social.length && (
              <ul className="mt-1 flex flex-wrap gap-2" aria-label={t('followUs')}>
                {social.map(([k, v]) => (
                  <li key={k}>
                    <a href={v as string} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-10 place-items-center rounded-lg border border-white/10 bg-charcoal-900 text-slate-300 transition-all hover:bg-saffron-600 hover:text-white">
                      <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <CMSLink url="/contact" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-white transition-all hover:border-saffron-600 hover:bg-saffron-600">
              {LOCALE === 'en' ? 'More locations' : 'सर्व कार्यालये'}
            </CMSLink>
          </div>

          {cols.map((col, i) => (
            <div key={col.id} className={i === cols.length - 1 && cols.length < 4 ? 'flex flex-col gap-3 lg:col-span-3' : 'flex flex-col gap-3 lg:col-span-2'}>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-saffron-500">{col.title}</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {col.links?.filter((l) => isLiveLink(l.url)).map((l) => (
                  <li key={l.id}>
                    <CMSLink url={l.url} newTab={l.newTab} className="transition-colors hover:text-saffron-200">
                      {l.label}
                    </CMSLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-400 sm:flex-row">
          <p className="text-center sm:text-left">
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
