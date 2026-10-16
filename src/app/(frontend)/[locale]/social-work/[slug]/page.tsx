import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import Image from 'next/image'
import { ArrowLeft, Clapperboard, HeartHandshake, Images, Target } from 'lucide-react'
import { localizedHref, mediaAlt, mediaPosition, mediaSize, mediaUrl, siteUrl, youtubeId } from '@/lib/utils'
import { RichText } from '@/components/ui/RichText'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'
import { YouTube } from '@/components/ui/YouTube'
import { Share } from '@/components/ui/Share'
import { NewsCard } from '@/components/blog/BlogParts'
import { Link } from '@/i18n/navigation'
import { ProjectVideos } from '@/components/social/ProjectVideos'
import { PageBanner } from '@/components/layout/PageBanner'

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

const TEXT = {
  mr: {
    back: 'सर्व उपक्रमांकडे परत जा', tag: 'लोकमंगल उपक्रम', impact: 'प्रमुख उपलब्धी', objective: 'उद्दिष्ट', videos: 'उपक्रमाचा माहितीपट व व्हिडिओ',
    videoCount: (n: number) => `एकूण ${n} व्हिडिओ उपलब्ध`, photos: 'छायाचित्रे', all: 'सर्व उपक्रम पहा', support: 'या उपक्रमास हातभार लावा',
  },
  en: {
    back: 'Back to all initiatives', tag: 'Lokmangal Initiative', impact: 'Key impact', objective: 'Objective', videos: 'Project Video Showcase',
    videoCount: (n: number) => `${n} videos available`, photos: 'Photos', all: 'View all initiatives', support: 'Support this initiative',
  },
}

const DEV = '०१२३४५६७८९'

/** One initiative, laid out like its page on lokmangalfoundation.com: title card → cover photo → objective → story → videos → photos */
export default async function InitiativePage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const d = await get(slug, locale)
  if (!d) notFound()
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const x = TEXT[locale] ?? TEXT.mr
  const num = (n: number) => (locale === 'mr' ? String(n).replace(/\d/g, (c) => DEV[Number(c)]) : String(n))
  const events = (await (await payload()).find({ collection: 'events', where: { initiative: { equals: d.id } }, locale, depth: 0, limit: 10 })).docs
  const related = (d.relatedPosts ?? []).filter((r): r is Post => typeof r === 'object')
  const url = `${siteUrl()}${localizedHref(`/social-work/${d.slug}`, locale)}`
  const cover = mediaUrl(d.heroImage, 'hero') || mediaUrl(d.heroImage)
  const coverSize = mediaSize(d.heroImage)
  const photos = toGallery(d.gallery as never, d.title)
  const files = (d.videos ?? []).filter((v) => !!v.url)
  const hasVideo = !!d.youtubeUrl || files.length > 0

  return (
    <>
      <PageBanner
        eyebrow={x.tag}
        title={d.title}
        path="/social-work"
        crumbs={[{ label: locale === 'mr' ? 'लोकमंगल फाऊंडेशन' : 'Lokmangal Foundation', href: '/lokmangal/foundation' }, { label: locale === 'mr' ? 'प्रकल्प' : 'Projects', href: '/lokmangal/foundation#projects' }, { label: d.title }]}
      >
        {d.stat && (
          <p className="mt-6 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-saffron-500 pl-4">
            <span className="text-[0.95rem] text-highlight">{x.impact}</span>
            <span className="font-display text-xl text-white">{d.stat}</span>
          </p>
        )}
      </PageBanner>

      <div className="container-x pb-20 pt-12 md:pb-28 md:pt-16">
        <Link href="/lokmangal/foundation#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:gap-3 hover:text-charcoal-900">
          <ArrowLeft aria-hidden className="size-4" /> {x.back}
        </Link>

        <article className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-20">
          <div className="min-w-0">
            {cover && (
              <div className="overflow-hidden rounded-[1.75rem] bg-cream">
                <Image src={cover} alt={mediaAlt(d.heroImage, d.title)} width={coverSize.width} height={coverSize.height} sizes="(max-width:1024px) 92vw, 860px" priority className="h-auto max-h-[560px] w-full object-cover" style={{ objectPosition: mediaPosition(d.heroImage) }} />
              </div>
            )}

            {d.objective && (
              /* the objective in a soft cream note — the one highlighted block on the page */
              <section className="mt-10 rounded-[1.5rem] bg-cream p-6 md:p-8">
                <h2 className="flex items-center gap-2.5 text-lg font-semibold text-charcoal-900"><Target aria-hidden className="size-5 text-saffron-600" /> {x.objective}</h2>
                <p className="mt-3 text-[1.08rem] leading-relaxed text-ink">{d.objective}</p>
              </section>
            )}

            <div className="mt-10 max-w-3xl"><RichText data={d.body} /></div>

            {hasVideo && (
              <section className="mt-16 md:mt-20">
                <h2 className="mb-6 flex items-center gap-2.5 text-[1.5rem] leading-tight text-charcoal-900 md:text-[1.8rem]"><Clapperboard aria-hidden className="size-6 text-saffron-600" /> {x.videos}</h2>
                <div className="space-y-6">
                  {d.youtubeUrl && <YouTube url={d.youtubeUrl} title={d.title} />}
                  {files.length > 0 && (files.some((v) => youtubeId(v.url)) ? files.map((v) => <YouTube key={v.url} url={v.url} title={v.title} />) : <ProjectVideos videos={files} countLabel={x.videoCount(files.length)} />)}
                </div>
              </section>
            )}

            {photos.length > 0 && (
              <section className="mt-16 md:mt-20">
                <h2 className="mb-6 flex items-center gap-2.5 text-[1.5rem] leading-tight text-charcoal-900 md:text-[1.8rem]">
                  <Images aria-hidden className="size-6 text-saffron-600" /> {x.photos}
                  <span className="font-display text-base text-saffron-700">({num(photos.length)})</span>
                </h2>
                <Gallery images={photos} />
              </section>
            )}
          </div>

          {/* side column: what to do next, events and sharing — sticks while reading */}
          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-3">
              <Link href="/contact" className="btn btn-primary"><HeartHandshake aria-hidden className="size-4" /> {x.support}</Link>
              <Link href="/lokmangal/foundation#projects" className="btn btn-ghost text-charcoal-900">{x.all}</Link>
            </div>
            {events.length > 0 && (
              <section>
                <h2 className="border-b-2 border-charcoal-900 pb-3 text-lg text-charcoal-900">{t('events')}</h2>
                <ul className="divide-y divide-line">
                  {events.map((e) => <li key={e.id}><Link href={`/events/${e.slug}`} className="flex items-center justify-between gap-3 py-3 font-medium text-charcoal-900 transition hover:text-saffron-700">{e.title} <span aria-hidden>→</span></Link></li>)}
                </ul>
              </section>
            )}
            <div className="border-t border-line pt-6">
              <Share url={url} title={d.title} label={tc('share')} />
            </div>
          </aside>
        </article>

        {related.length > 0 && (
          <section className="mt-24 md:mt-28">
            <h2 className="mb-9 text-[1.7rem] leading-tight text-charcoal-900 md:text-[2.2rem]">{tc('relatedPosts')}</h2>
            <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{related.map((r) => <NewsCard key={r.id} post={r} locale={locale} />)}</div>
          </section>
        )}
      </div>
    </>
  )
}
