import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, ArrowRight, CalendarDays, CircleCheckBig, Clock, MapPin } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { articleHeadings, primaryCategory, readTimeLabel } from '@/lib/blog'
import { formatDate, localizedHref, mediaAlt, mediaUrl, photoFit, siteUrl, toMarathiDigits } from '@/lib/utils'
import { RichText } from '@/components/ui/RichText'
import { Share } from '@/components/ui/Share'
import { NewsCard, SectionTitle } from '@/components/blog/BlogParts'
import { PageBanner } from '@/components/layout/PageBanner'
import { Link } from '@/i18n/navigation'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale; slug: string }> }

const get = cache(async (slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  return ((await (await payload()).find({ collection: 'posts', where: { slug: { equals: decodeURIComponent(slug) } }, locale, depth: 2, limit: 1, draft })).docs[0] as Post | undefined) ?? null
})

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [] // see [locale]/layout.tsx
  try {
    const r = await (await payload()).find({ collection: 'posts', limit: 200, depth: 0, select: { slug: true } })
    return r.docs.flatMap((d) => ['mr', 'en'].map((locale) => ({ locale, slug: d.slug })))
  } catch { return [] }
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const d = await get(slug, locale)
  if (!d) return {}
  const img = mediaUrl(d.meta?.image as never) || mediaUrl(d.coverImage, 'card')
  return {
    title: d.meta?.title || d.title,
    description: d.meta?.description || d.excerpt || undefined,
    openGraph: { type: 'article', publishedTime: d.publishedAt ?? undefined, images: img ? [img] : undefined },
  }
}

/** Newspaper-style article: headline, byline, photo, summary, key points, full story, related articles */
export default async function PostPage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await get(slug, locale)
  if (!post) notFound()
  const [t, tb, tc] = await Promise.all([getTranslations('pages'), getTranslations('blog'), getTranslations('common')])
  const p = await payload()
  const catIds = (post.categories ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  const notThis = { id: { not_equals: post.id } }
  const published = { _status: { equals: 'published' } }
  let related = (
    await p.find({ collection: 'posts', limit: 3, locale, depth: 1, sort: '-publishedAt', where: { and: [notThis, published, ...(catIds.length ? [{ categories: { in: catIds } }] : [])] } })
  ).docs as Post[]
  if (related.length < 3) {
    // top up with the latest articles from other sections
    const more = (await p.find({ collection: 'posts', limit: 3, locale, depth: 1, sort: '-publishedAt', where: { and: [notThis, published, { id: { not_in: related.map((r) => r.id) } }] } })).docs as Post[]
    related = [...related, ...more].slice(0, 3)
  }

  const url = `${siteUrl()}${localizedHref(`/blog/${post.slug}`, locale)}`
  const cover = mediaUrl(post.coverImage, 'hero')
  const cat = primaryCategory(post)
  // tags are shared by both languages — on the English site, skip tags written in Marathi
  // a Marathi page never shows an English-only subtitle
  const subtitle = post.subtitle && (locale !== 'mr' || /[\u0900-\u097F]/.test(post.subtitle)) ? post.subtitle : null
  const tags = (post.tags ?? []).filter((tag) => locale === 'mr' || !/[\u0900-\u097F]/.test(tag))
  const headings = articleHeadings(post.content)
  const author = post.author || (locale === 'mr' ? 'रोहन देशमुख' : 'Rohan Deshmukh')
  const num = (n: number) => (locale === 'mr' ? toMarathiDigits(n) : String(n))
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: post.title, datePublished: post.publishedAt, dateModified: post.updatedAt,
    author: { '@type': 'Person', name: 'Rohan Subhash Deshmukh' }, image: cover ? [cover] : undefined, mainEntityOfPage: url,
  }

  return (
    <>
      <PageBanner
        compact
        light
        title={post.title}
        subtitle={subtitle}
        crumbs={[{ label: t('blog'), href: '/blog' }, ...(cat ? [{ label: cat.title, href: `/blog?category=${cat.slug}` }] : [])]}
      >
        {/* byline */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal-900/10 pt-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem] text-muted">
            <span className="inline-flex items-center gap-2.5">
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-saffron-600 text-sm text-white">{author.trim().charAt(0)}</span>
              <span className="text-charcoal-900">{author}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{tb('place')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-saffron-600" /><time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, locale)}</time></span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{readTimeLabel(post, locale)}</span>
          </div>
          <div className="no-print"><Share url={url} title={post.title} label={tc('share')} compact /></div>
        </div>
      </PageBanner>

      <div className="container-x pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-20">
          <article className="min-w-0 max-w-3xl">
            <Link href="/blog" className="no-print inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:gap-3 hover:text-charcoal-900">
              <ArrowLeft className="size-4" /> {tb('back')}
            </Link>

            {cover && (
              <figure className="mt-7">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-cream">
                  <Image src={cover} alt={mediaAlt(post.coverImage, post.title)} fill priority sizes="(max-width:900px) 100vw, 780px" className="object-cover" style={photoFit(post.coverImage, 16 / 9)} />
                </div>
                {typeof post.coverImage === 'object' && post.coverImage?.alt && post.coverImage.alt !== post.title && (
                  <figcaption className="mt-3 text-sm text-muted">{post.coverImage.alt}</figcaption>
                )}
              </figure>
            )}

            {/* summary */}
            {post.excerpt && (
              <p className="mt-10 border-l-4 border-saffron-500 pl-5 font-display text-[1.2rem] leading-relaxed text-charcoal-900 md:pl-7 md:text-[1.35rem]">
                {post.excerpt}
              </p>
            )}

            {/* key points on phones and tablets (desktop: in the side column) */}
            {headings.length >= 2 && (
              <nav aria-label={tb('keyPoints')} className="mt-10 lg:hidden">
                <KeyPoints headings={headings} title={tb('keyPoints')} num={num} />
              </nav>
            )}

            {/* full story */}
            <SectionTitle className="mt-12">{tb('fullStory')}</SectionTitle>
            <div id="article-body" className="article-body mt-7">
              <RichText data={post.content} anchors />
            </div>

            {(!!tags.length || !!post.categories?.length) && (
              <div className="no-print mt-12 flex flex-wrap gap-2 border-t border-line pt-7">
                {post.categories?.map((c) => typeof c === 'object' && <Link key={c.id} href={`/blog?category=${c.slug}`} className="rounded-full bg-charcoal-900 px-3 py-1 text-sm text-white">{c.title}</Link>)}
                {tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-white px-3 py-1 text-sm text-saffron-700 ring-1 ring-line transition hover:ring-saffron-400">#{tag}</Link>)}
              </div>
            )}
            <div className="no-print mt-8 border-t border-line pt-7"><Share url={url} title={post.title} label={tc('share')} /></div>
          </article>

          {headings.length >= 2 && (
            <aside className="no-print hidden lg:sticky lg:top-28 lg:block lg:self-start">
              <nav aria-label={tb('keyPoints')}>
                <KeyPoints headings={headings} title={tb('keyPoints')} num={num} />
              </nav>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section className="no-print mt-24 md:mt-28">
            <SectionTitle aside={<Link href="/blog" className="more-link text-sm">{tb('seeAll')} <ArrowRight className="size-4" /></Link>}>
              {tb('more')}
            </SectionTitle>
            <div className="mt-9 grid gap-x-7 gap-y-12 md:grid-cols-3">{related.map((r) => <NewsCard key={r.id} post={r} locale={locale} />)}</div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    </>
  )
}

/** The article's sub-headings as a numbered jump list */
function KeyPoints({ headings, title, num }: { headings: { id: string; text: string }[]; title: string; num: (n: number) => string }) {
  return (
    <>
      <h2 className="flex items-center gap-2.5 border-b-2 border-charcoal-900 pb-3 text-lg text-charcoal-900"><CircleCheckBig className="size-5 text-saffron-600" /> {title}</h2>
      <ol className="mt-2 divide-y divide-line">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="flex gap-3 py-3 text-[0.97rem] leading-snug text-ink transition hover:text-saffron-700">
              <span className="font-display text-saffron-500">{num(i + 1)}</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </>
  )
}
