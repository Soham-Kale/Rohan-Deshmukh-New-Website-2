import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Mail, MapPin, Phone } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { getGlobal, payload } from '@/lib/payload'
import { InnerPage } from '@/components/layout/InnerPage'
import { ContactForm } from '@/components/forms/Forms'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('contact') }
}

export default async function ContactPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const settings = await getGlobal('site-settings', locale)
  const offices = (await (await payload()).find({ collection: 'offices', limit: 50, locale, sort: 'order' })).docs
  return (
    <InnerPage path="/contact" locale={locale} title={t('contact')} subtitle={settings.tagline} wide>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
        <ContactForm offices={offices.map((o) => ({ value: String(o.id), label: o.name }))} />
        <div>
          {/* direct lines first, then each office: map + address on the page, divided by rules */}
          <ul className="space-y-3 border-b border-line pb-8">
            {settings.phone && <li><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="group inline-flex items-center gap-4 text-xl font-semibold text-charcoal-900"><span className="grid size-11 place-items-center rounded-full bg-saffron-50 text-saffron-600 transition group-hover:bg-saffron-500 group-hover:text-white"><Phone className="size-5" /></span>{settings.phone}</a></li>}
            {settings.email && <li><a href={`mailto:${settings.email}`} className="group inline-flex items-center gap-4 text-lg font-semibold text-charcoal-900 break-all"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-saffron-50 text-saffron-600 transition group-hover:bg-saffron-500 group-hover:text-white"><Mail className="size-5" /></span>{settings.email}</a></li>}
          </ul>
          <h2 className="mt-10 text-[1.6rem] leading-tight text-charcoal-900">{t('officeLocations')}</h2>
          <div className="mt-6 space-y-10">
            {offices.map((o) => (
              <div key={o.id}>
                {o.mapEmbedUrl && <iframe title={o.name} src={o.mapEmbedUrl} loading="lazy" className="h-52 w-full rounded-[1.25rem] border-0 bg-cream" referrerPolicy="no-referrer-when-downgrade" />}
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg text-charcoal-900">{o.name}</h3>
                  {o.address && <p className="flex gap-2.5 text-muted"><MapPin className="mt-1 size-4 shrink-0 text-saffron-600" /><span className="whitespace-pre-line">{o.address}</span></p>}
                  {o.phone && <p><a className="flex items-center gap-2.5 text-muted hover:text-charcoal-900" href={`tel:${o.phone.replace(/\s/g, '')}`}><Phone className="size-4 text-saffron-600" /> {o.phone}</a></p>}
                  {o.email && <p><a className="flex items-center gap-2.5 text-muted hover:text-charcoal-900" href={`mailto:${o.email}`}><Mail className="size-4 text-saffron-600" /> {o.email}</a></p>}
                </div>
              </div>
            ))}
          </div>
          {!offices.length && <p className="mt-4 text-muted">{tc('address')}: —</p>}
        </div>
      </div>
    </InnerPage>
  )
}
