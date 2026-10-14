import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { mediaPosition, mediaUrl, toMarathiDigits } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'
import { YearTabs } from './YearTabs'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale; slug: string }> }

const get = cache(async (slug: string, locale: Locale) =>
  (await (await payload()).find({ collection: 'events', where: { slug: { equals: decodeURIComponent(slug) } }, locale, depth: 2, limit: 1 })).docs[0] ?? null)

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const d = await get(slug, locale)
  return d ? { title: d.title, description: d.tagline || d.description || undefined } : {}
}

export default async function EventPage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const d = await get(slug, locale)
  if (!d) notFound()
  const t = await getTranslations('pages')
  const editions = [...(d.editions ?? [])].sort((a, b) => b.year - a.year)
  const ini = typeof d.initiative === 'object' && d.initiative ? d.initiative : null
  return (
    <InnerPage path={`/events/${d.slug}`} locale={locale} title={d.title} subtitle={d.tagline || d.description} image={mediaUrl(d.coverImage, 'hero')} imagePosition={mediaPosition(d.coverImage)}
      crumbs={
        ini
          ? [{ label: t('socialWork'), href: '/social-work' }, { label: ini.title, href: `/social-work/${ini.slug}` }, { label: d.title }]
          : [{ label: locale === 'mr' ? 'लोकमंगल फाऊंडेशन' : 'Lokmangal Foundation', href: '/lokmangal/foundation' }, { label: locale === 'mr' ? 'कार्यक्रम' : 'Events', href: '/lokmangal/foundation#events' }, { label: d.title }]
      }>
      {(d.body || d.facts?.length) && (
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {d.body && <div className="prose-rd">{d.body.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</div>}
          {!!d.facts?.length && (
            <dl className="self-start rounded-2xl bg-charcoal-900 p-6 text-white md:p-7">
              {d.facts.map((f, i) => (
                <div key={f.id ?? i} className={i ? 'mt-4 border-t border-white/10 pt-4' : ''}>
                  <dt className="text-sm font-semibold text-highlight">{f.label}</dt>
                  <dd className="mt-1 text-[1.02rem] text-white/90">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
      <YearTabs
        tabs={editions.map((e) => ({
          key: String(e.year),
          label: locale === 'mr' ? toMarathiDigits(e.year) : String(e.year),
          content: (
            <div>
              {e.title && <h2 className="text-2xl text-charcoal-900">{e.title}</h2>}
              {e.text && <p className="mb-6 mt-2 text-muted">{e.text}</p>}
              <Gallery images={toGallery(e.images as never, `${d.title} ${e.year}`)} />
            </div>
          ),
        }))}
      />
    </InnerPage>
  )
}
