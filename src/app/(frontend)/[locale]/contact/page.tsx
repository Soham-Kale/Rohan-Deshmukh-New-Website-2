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
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <ContactForm offices={offices.map((o) => ({ value: String(o.id), label: o.name }))} />
        <div className="space-y-4">
          <div className="grain on-dark rounded-3xl bg-charcoal-900 p-6 text-white">
            {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 py-2 text-lg hover:text-saffron-300"><Phone className="size-5 text-saffron-300" /> {settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`} className="flex items-center gap-3 py-2 text-lg hover:text-saffron-300"><Mail className="size-5 text-saffron-300" /> {settings.email}</a>}
          </div>
          <h2 className="pt-4 text-2xl text-charcoal-900">{t('officeLocations')}</h2>
          {offices.map((o) => (
            <div key={o.id} className="card">
              {o.mapEmbedUrl && <iframe title={o.name} src={o.mapEmbedUrl} loading="lazy" className="h-48 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />}
              <div className="space-y-2 p-5">
                <h3 className="text-lg text-charcoal-900">{o.name}</h3>
                {o.address && <p className="flex gap-2.5 text-muted"><MapPin className="mt-1 size-4 shrink-0 text-saffron-600" /><span className="whitespace-pre-line">{o.address}</span></p>}
                {o.phone && <p><a className="flex items-center gap-2.5 text-muted hover:text-charcoal-900" href={`tel:${o.phone.replace(/\s/g, '')}`}><Phone className="size-4 text-saffron-600" /> {o.phone}</a></p>}
                {o.email && <p><a className="flex items-center gap-2.5 text-muted hover:text-charcoal-900" href={`mailto:${o.email}`}><Mail className="size-4 text-saffron-600" /> {o.email}</a></p>}
              </div>
            </div>
          ))}
          {!offices.length && <p className="text-muted">{tc('address')}: —</p>}
        </div>
      </div>
    </InnerPage>
  )
}
