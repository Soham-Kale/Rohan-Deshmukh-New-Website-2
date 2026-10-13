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
  return d ? { title: d.title, description: d.description ?? undefined } : {}
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
    <InnerPage path={`/events/${d.slug}`} locale={locale} title={d.title} subtitle={d.description} image={mediaUrl(d.coverImage, 'hero')} imagePosition={mediaPosition(d.coverImage)}
      crumbs={[{ label: t('socialWork'), href: '/social-work' }, ...(ini ? [{ label: ini.title, href: `/social-work/${ini.slug}` }] : []), { label: d.title }]}>
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
