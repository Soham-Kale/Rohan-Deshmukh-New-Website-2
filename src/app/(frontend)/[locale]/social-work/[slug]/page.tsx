import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { localizedHref, mediaPosition, mediaUrl, siteUrl } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { RichText } from '@/components/ui/RichText'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'
import { YouTube } from '@/components/ui/YouTube'
import { Share } from '@/components/ui/Share'
import { NewsCard } from '@/components/blog/BlogParts'
import { Link } from '@/i18n/navigation'
import { CountUp } from '@/components/ui/CountUp'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale; slug: string }> }

const get = cache(async (slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const r = await (await payload()).find({ collection: 'initiatives', where: { slug: { equals: decodeURIComponent(slug) } }, locale, depth: 2, limit: 1, draft })
  return r.docs[0] ?? null
})

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [] // see [locale]/layout.tsx
  try {
    const r = await (await payload()).find({ collection: 'initiatives', limit: 200, depth: 0, select: { slug: true } })
    return r.docs.flatMap((d) => ['mr', 'en'].map((locale) => ({ locale, slug: d.slug })))
  } catch { return [] }
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const d = await get(slug, locale)
  if (!d) return {}
  const img = mediaUrl(d.meta?.image as never) || mediaUrl(d.heroImage, 'card')
  return { title: d.meta?.title || d.title, description: d.meta?.description || d.excerpt || undefined, openGraph: { images: img ? [img] : undefined } }
}

export default async function InitiativePage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const d = await get(slug, locale)
  if (!d) notFound()
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const events = (await (await payload()).find({ collection: 'events', where: { initiative: { equals: d.id } }, locale, depth: 0, limit: 10 })).docs
  const related = (d.relatedPosts ?? []).filter((x): x is Post => typeof x === 'object')
  const url = `${siteUrl()}${localizedHref(`/social-work/${d.slug}`, locale)}`

  return (
    <InnerPage path={`/social-work/${d.slug}`} locale={locale} title={d.title} subtitle={d.excerpt} image={mediaUrl(d.heroImage, 'hero')} imagePosition={mediaPosition(d.heroImage)} crumbs={[{ label: t('socialWork'), href: '/social-work' }, { label: d.title }]}>
      {!!d.counters?.length && (
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {d.counters.map((c) => (
            <div key={c.id} className="rounded-2xl bg-charcoal-900 p-5 text-white">
              <p className="font-display text-3xl text-saffron-300 md:text-4xl"><CountUp value={c.value} /></p>
              <p className="mt-1 text-sm text-white/75">{c.label}</p>
            </div>
          ))}
        </div>
      )}
      <RichText data={d.body} />
      {d.youtubeUrl && <div className="mt-10"><YouTube url={d.youtubeUrl} title={d.title} /></div>}
      {!!d.gallery?.length && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl text-charcoal-900">{tc('photos')}</h2>
          <Gallery images={toGallery(d.gallery as never, d.title)} />
        </section>
      )}
      {events.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl text-charcoal-900">{t('events')}</h2>
          <ul className="flex flex-wrap gap-3">
            {events.map((e) => <li key={e.id}><Link href={`/events/${e.slug}`} className="btn btn-ghost text-charcoal-900">{e.title} →</Link></li>)}
          </ul>
        </section>
      )}
      <div className="mt-12 border-t border-line pt-6"><Share url={url} title={d.title} label={tc('share')} /></div>
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl text-charcoal-900">{tc('relatedPosts')}</h2>
          <div className="grid gap-5 md:grid-cols-2">{related.map((p) => <NewsCard key={p.id} post={p} locale={locale} />)}</div>
        </section>
      )}
    </InnerPage>
  )
}
