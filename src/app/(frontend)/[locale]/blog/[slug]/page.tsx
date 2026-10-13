import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { formatDate, localizedHref, mediaAlt, mediaUrl, photoFit, siteUrl } from '@/lib/utils'
import { PageBanner } from '@/components/layout/PageBanner'
import { RichText } from '@/components/ui/RichText'
import { Share } from '@/components/ui/Share'
import { PostCard } from '@/components/home/HomeSections'
import { Link } from '@/i18n/navigation'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale; slug: string }> }

const get = cache(async (slug: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  return (await (await payload()).find({ collection: 'posts', where: { slug: { equals: decodeURIComponent(slug) } }, locale, depth: 2, limit: 1, draft })).docs[0] ?? null
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

export default async function PostPage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await get(slug, locale)
  if (!post) notFound()
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const p = await payload()
  const catIds = (post.categories ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  const related = (
    await p.find({
      collection: 'posts', limit: 3, locale, depth: 1, sort: '-publishedAt',
      where: { and: [{ id: { not_equals: post.id } }, { _status: { equals: 'published' } }, ...(catIds.length ? [{ categories: { in: catIds } }] : [])] },
    })
  ).docs
  const url = `${siteUrl()}${localizedHref(`/blog/${post.slug}`, locale)}`
  const cover = mediaUrl(post.coverImage, 'hero')
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.publishedAt,
    author: { '@type': 'Person', name: 'Rohan Subhash Deshmukh' }, image: cover ? [cover] : undefined, mainEntityOfPage: url,
  }

  return (
    <>
      <PageBanner title={post.title} subtitle={post.subtitle} crumbs={[{ label: t('blog'), href: '/blog' }, { label: post.title }]} />
      <article className="container-x py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <p className="text-muted">{tc('by')}: <b className="text-maroon-900">{post.author}</b> · {formatDate(post.publishedAt, locale)}</p>
            <Share url={url} title={post.title} label={tc('share')} />
          </div>
          {cover && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-cream">
              <Image src={cover} alt={mediaAlt(post.coverImage, post.title)} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" style={photoFit(post.coverImage, 16 / 9)} />
            </div>
          )}
          <RichText data={post.content} />
          {(!!post.tags?.length || !!post.categories?.length) && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {post.categories?.map((c) => typeof c === 'object' && <Link key={c.id} href={`/blog?category=${c.slug}`} className="rounded-full bg-maroon-900 px-3 py-1 text-sm text-white">{c.title}</Link>)}
              {post.tags?.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-saffron-50 px-3 py-1 text-sm text-saffron-700">#{tag}</Link>)}
            </div>
          )}
          <div className="mt-8"><Share url={url} title={post.title} label={tc('share')} /></div>
        </div>
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl text-maroon-900 md:text-3xl">{tc('relatedPosts')}</h2>
            <div className="grid gap-6 md:grid-cols-3">{related.map((r) => <PostCard key={r.id} post={r} locale={locale} />)}</div>
          </section>
        )}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    </>
  )
}
