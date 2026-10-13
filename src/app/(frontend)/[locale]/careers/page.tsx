import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Briefcase, MapPin, CalendarDays } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { formatDate } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { CareerForm } from '@/components/forms/Forms'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('careers') }
}

export default async function CareersPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')
  const jobs = (await (await payload()).find({ collection: 'jobs', where: { active: { equals: true } }, limit: 50, locale })).docs
  return (
    <InnerPage path="/careers" locale={locale} title={t('careers')}>
      <h2 className="mb-5 text-2xl text-charcoal-900">{t('openings')}</h2>
      {jobs.length ? (
        <ul className="mb-12 space-y-4">
          {jobs.map((j) => (
            <li key={j.id} className="card p-6">
              <h3 className="text-xl text-charcoal-900">{j.title}</h3>
              <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1.5"><Briefcase className="size-4" /> {j.type}</span>
                {j.location && <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {j.location}</span>}
                {j.lastDate && <span className="flex items-center gap-1.5"><CalendarDays className="size-4" /> {t('lastDate')}: {formatDate(j.lastDate, locale)}</span>}
              </p>
              {j.description && <p className="mt-3 whitespace-pre-line text-muted">{j.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-10 rounded-2xl bg-cream p-6 text-muted">{t('noOpenings')}</p>
      )}
      <CareerForm jobs={jobs.map((j) => ({ value: String(j.id), label: j.title }))} />
    </InnerPage>
  )
}
