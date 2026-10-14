import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, CircleCheckBig, Clock, MapPin } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { articleHeadings, primaryCategory, readTimeLabel } from '@/lib/blog'
import { formatDate, localizedHref, mediaAlt, mediaUrl, photoFit, siteUrl, toMarathiDigits } from '@/lib/utils'
import { RichText } from '@/components/ui/RichText'
import { Share } from '@/components/ui/Share'
import { ArticleTools } from '@/components/blog/ArticleTools'
import { CategoryChip, NewsCard, SectionTitle } from '@/components/blog/BlogParts'
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
  const headings = articleHeadings(post.content)
  const author = post.author || (locale === 'mr' ? 'रोहन देशमुख' : 'Rohan Deshmukh')
  const num = (n: number) => (locale === 'mr' ? toMarathiDigits(n) : String(n))
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: post.title, datePublished: post.publishedAt, dateModified: post.updatedAt,
    author: { '@type': 'Person', name: 'Rohan Subhash Deshmukh' }, image: cover ? [cover] : undefined, mainEntityOfPage: url,
  }

  return (
    <div className="bg-cream">
      {/* breadcrumb strip */}
      <div className="no-print border-b border-line bg-white">
        <nav aria-label="Breadcrumb" className="container-x flex items-center gap-1.5 overflow-hidden py-3 text-sm text-muted">
          <Link href="/" className="shrink-0 hover:text-charcoal-900">{tc('home')}</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href="/blog" className="shrink-0 hover:text-charcoal-900">{t('blog')}</Link>
          {cat && (
            <>
              <ChevronRight className="size-3.5 shrink-0" />
              <Link href={`/blog?category=${cat.slug}`} className="truncate font-semibold text-charcoal-900">{cat.title}</Link>
            </>
          )}
        </nav>
      </div>

      <article className="container-x py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/blog" className="no-print inline-flex items-center gap-2 text-sm text-muted hover:text-charcoal-900">
            <ArrowLeft className="size-4" /> {tb('back')}
          </Link>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <CategoryChip cat={cat} />
            <ArticleTools target="article-body" sizeLabel={tb('fontSize')} printLabel={tb('print')} />
          </div>

          <h1 className="mt-4 text-[1.9rem] font-bold leading-[1.3] text-charcoal-900 md:text-[2.6rem]">{post.title}</h1>
          {post.subtitle && <p className="mt-3 text-lg text-muted md:text-xl">{post.subtitle}</p>}

          {/* byline */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-3.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2.5">
                <span aria-hidden className="grid size-8 place-items-center rounded-full bg-charcoal-900 text-sm font-semibold text-white">{author.trim().charAt(0)}</span>
                <span className="font-semibold text-charcoal-900">{author}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{tb('place')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-saffron-600" /><time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt, locale)}</time></span>
              <span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{readTimeLabel(post, locale)}</span>
            </div>
            <div className="no-print"><Share url={url} title={post.title} label={tc('share')} compact /></div>
          </div>

          {cover && (
            <figure className="mt-7">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-white">
                <Image src={cover} alt={mediaAlt(post.coverImage, post.title)} fill priority sizes="(max-width:900px) 100vw, 900px" className="object-cover" style={photoFit(post.coverImage, 16 / 9)} />
              </div>
              {typeof post.coverImage === 'object' && post.coverImage?.alt && post.coverImage.alt !== post.title && (
                <figcaption className="mt-2 text-sm text-muted">{post.coverImage.alt}</figcaption>
              )}
            </figure>
          )}

          {/* summary */}
          {post.excerpt && (
            <p className="mt-8 rounded-r-2xl border-l-4 border-saffron-500 bg-white px-5 py-4 text-[1.1rem] font-medium leading-relaxed text-charcoal-900 md:px-7 md:py-5 md:text-[1.2rem]">
              {post.excerpt}
            </p>
          )}

          {/* key points (from the article's sub-headings) */}
          {headings.length >= 2 && (
            <nav aria-label={tb('keyPoints')} className="mt-6 rounded-2xl border border-line bg-white p-5 md:p-6">
              <h2 className="flex items-center gap-2.5 border-b border-line pb-3 text-lg text-charcoal-900"><CircleCheckBig className="size-5 text-saffron-600" /> {tb('keyPoints')}</h2>
              <ol className="mt-3 space-y-2">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="flex gap-3 rounded-lg px-1 py-1 text-[0.98rem] text-ink hover:bg-cream hover:text-saffron-700">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron-50 text-xs font-semibold text-saffron-700">{num(i + 1)}</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* full story */}
          <SectionTitle className="mt-10">{tb('fullStory')}</SectionTitle>
          <div id="article-body" className="article-body mt-6">
            <RichText data={post.content} anchors />
          </div>

          {(!!post.tags?.length || !!post.categories?.length) && (
            <div className="no-print mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {post.categories?.map((c) => typeof c === 'object' && <Link key={c.id} href={`/blog?category=${c.slug}`} className="rounded-full bg-charcoal-900 px-3 py-1 text-sm text-white">{c.title}</Link>)}
              {post.tags?.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-white px-3 py-1 text-sm text-saffron-700 ring-1 ring-line">#{tag}</Link>)}
            </div>
          )}
          <div className="no-print mt-8 rounded-2xl border border-line bg-white p-4"><Share url={url} title={post.title} label={tc('share')} /></div>
        </div>

        {related.length > 0 && (
          <section className="no-print mx-auto mt-16 max-w-6xl">
            <SectionTitle aside={<Link href="/blog" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-saffron-700 hover:text-saffron-600">{tb('seeAll')} <ArrowRight className="size-4" /></Link>}>
              {tb('more')}
            </SectionTitle>
            <div className="mt-6 grid gap-6 md:grid-cols-3">{related.map((r) => <NewsCard key={r.id} post={r} locale={locale} />)}</div>
          </section>
        )}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    </div>
  )
}
