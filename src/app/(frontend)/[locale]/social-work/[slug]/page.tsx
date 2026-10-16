import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import Image from 'next/image'
import { ArrowLeft, Clapperboard, HeartHandshake, Images, Sparkles, Target } from 'lucide-react'
import { localizedHref, mediaAlt, mediaPosition, mediaSize, mediaUrl, siteUrl, youtubeId } from '@/lib/utils'
import { RichText } from '@/components/ui/RichText'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'
import { YouTube } from '@/components/ui/YouTube'
import { Share } from '@/components/ui/Share'
import { NewsCard } from '@/components/blog/BlogParts'
import { Link } from '@/i18n/navigation'
import { ProjectVideos } from '@/components/social/ProjectVideos'

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
    <div className="bg-paper">
      <div className="container-x max-w-5xl py-8 md:py-12">
        <Link href="/lokmangal/foundation#projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal-900 transition hover:text-saffron-700">
          <ArrowLeft aria-hidden className="size-4" /> {x.back}
        </Link>

        <article className="mt-6 rounded-[2rem] border border-line bg-white p-5 shadow-[0_18px_50px_-34px_rgb(20_33_61/0.35)] sm:p-8 md:p-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-bold text-charcoal-900">
            <Sparkles aria-hidden className="size-3.5 text-saffron-600" /> {x.tag}
          </p>
          <h1 className="mt-4 text-[1.75rem] leading-tight text-charcoal-900 md:text-[2.4rem]">{d.title}</h1>
          {d.stat && (
            <div className="mt-5 inline-block rounded-xl border border-frame bg-saffron-50 px-4 py-2.5 text-center">
              <p className="text-[0.7rem] font-semibold text-saffron-700">{x.impact}</p>
              <p className="mt-0.5 font-bold text-charcoal-900">{d.stat}</p>
            </div>
          )}

          <hr className="my-7 border-line md:my-8" />

          {cover && (
            <div className="overflow-hidden rounded-2xl bg-cream">
              <Image src={cover} alt={mediaAlt(d.heroImage, d.title)} width={coverSize.width} height={coverSize.height} sizes="(max-width:1024px) 92vw, 900px" priority className="h-auto max-h-[560px] w-full object-cover" style={{ objectPosition: mediaPosition(d.heroImage) }} />
            </div>
          )}

          {d.objective && (
            <section className="mt-7 rounded-2xl border border-frame/70 bg-saffron-50/60 p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-charcoal-900"><Target aria-hidden className="size-5 text-saffron-600" /> {x.objective}</h2>
              <p className="mt-2 leading-relaxed text-ink">{d.objective}</p>
            </section>
          )}

          <div className="mt-7"><RichText data={d.body} /></div>

          {hasVideo && (
            <section className="mt-10 rounded-2xl border border-line bg-paper p-4 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-charcoal-900 md:text-xl"><Clapperboard aria-hidden className="size-5 text-saffron-600" /> {x.videos}</h2>
              <div className="space-y-5">
                {d.youtubeUrl && <YouTube url={d.youtubeUrl} title={d.title} />}
                {files.length > 0 && (files.some((v) => youtubeId(v.url)) ? files.map((v) => <YouTube key={v.url} url={v.url} title={v.title} />) : <ProjectVideos videos={files} countLabel={x.videoCount(files.length)} />)}
              </div>
            </section>
          )}

          {photos.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-charcoal-900 md:text-xl">
                <Images aria-hidden className="size-5 text-saffron-600" /> {x.photos}
                <span className="rounded-full bg-cream px-2.5 text-sm font-bold text-saffron-700">{num(photos.length)}</span>
              </h2>
              <Gallery images={photos} />
            </section>
          )}

          {events.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-charcoal-900 md:text-xl">{t('events')}</h2>
              <ul className="flex flex-wrap gap-3">
                {events.map((e) => <li key={e.id}><Link href={`/events/${e.slug}`} className="btn btn-ghost text-charcoal-900">{e.title} →</Link></li>)}
              </ul>
            </section>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link href="/lokmangal/foundation#projects" className="btn btn-dark px-5 py-2.5">{x.all}</Link>
              <Link href="/contact" className="btn btn-primary px-5 py-2.5"><HeartHandshake aria-hidden className="size-4" /> {x.support}</Link>
            </div>
            <Share url={url} title={d.title} label={tc('share')} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl text-charcoal-900">{tc('relatedPosts')}</h2>
            <div className="grid gap-5 md:grid-cols-2">{related.map((r) => <NewsCard key={r.id} post={r} locale={locale} />)}</div>
          </section>
        )}
      </div>
    </div>
  )
}
