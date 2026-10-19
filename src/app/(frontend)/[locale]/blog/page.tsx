import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Where } from 'payload'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { localizedHref, siteUrl, toMarathiDigits, cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/Pagination'
import { BlogRow, LatestList, LeadStory, RecentList, SectionTitle, TopicsCard } from '@/components/blog/BlogParts'
import { QuickShare } from '@/components/blog/QuickShare'
import { PageBanner } from '@/components/layout/PageBanner'

export const revalidate = 300
const PER_PAGE = 10
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ category?: string; tag?: string; q?: string; page?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('title'), description: t('intro') }
}

/** Newspaper-style blog front page: masthead + lead story + latest list, then sections, article list and sidebar */
export default async function BlogPage({ params, searchParams }: P) {
  const { locale } = await params
  const { category, tag, q, page = '1' } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('blog'), getTranslations('common')])
  const p = await payload()
  const published: Where = { _status: { equals: 'published' } }

  const [cats, latest] = await Promise.all([
    p.find({ collection: 'categories', limit: 50, locale, sort: 'title' }).then((r) => r.docs),
    p.find({ collection: 'posts', where: published, limit: 6, locale, depth: 1, sort: '-publishedAt' }).then((r) => r.docs as Post[]),
  ])

  const and: Where[] = [published]
  const activeCat = category ? cats.find((x) => x.slug === category) : undefined
  if (activeCat) and.push({ categories: { contains: activeCat.id } })
  if (tag) and.push({ tags: { contains: tag } })
  if (q) and.push({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })
  const pageNo = Number(page) || 1
  const res = await p.find({ collection: 'posts', where: { and }, limit: PER_PAGE, page: pageNo, locale, depth: 1, sort: '-publishedAt' })
  const posts = res.docs as Post[]

  // front page (no filter, first page) opens with the lead story
  const isFront = !activeCat && !tag && !q && pageNo === 1
  const [lead, ...rest] = latest
  const num = (n: number) => (locale === 'mr' ? toMarathiDigits(n) : String(n))
  const shareUrl = (slug: string) => `${siteUrl()}${localizedHref(`/blog/${slug}`, locale)}`
  const listTitle = q ? t('results', { q }) : activeCat ? activeCat.title : tag ? `#${tag}` : t('allList')

  return (
    <>
      <PageBanner title={t('title')} subtitle={t('intro')} crumbs={[{ label: t('title') }]} path="/blog" />

      <div className="container-x pb-20 pt-10 md:pb-24 md:pt-12">
        {/* top stories */}
        {isFront && lead && (
          <section className="pb-16 md:pb-20">
            <SectionTitle
              aside={<span className="hidden items-center gap-1.5 text-xs font-bold tracking-wide text-saffron-700 sm:inline-flex"><Sparkles className="size-3.5" />{t('topBadge')}</span>}
            >
              {t('topStories')}
            </SectionTitle>
            <div className="mt-8 grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
              <LeadStory post={lead} locale={locale} badge={t('lead')} readFull={t('readFull')} />
              {rest.length > 0 && <LatestList posts={rest.slice(0, 4)} locale={locale} title={t('latestUpdates')} footer={t('daily')} />}
            </div>
          </section>
        )}

        {/* sections + search — stays at the top while scrolling */}
        <div className="sticky top-[4.5rem] lg:top-20 z-30 -mx-4 mb-10 border-b border-line bg-paper/95 px-4 backdrop-blur md:mx-0 md:px-0">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="hidden shrink-0 items-center gap-1.5 text-sm text-muted sm:inline-flex"><SlidersHorizontal className="size-4" /> {t('sections')}:</span>
              <div className="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1">
                {[{ slug: '', title: tc('all') }, ...cats].map((c) => {
                  const on = (category ?? '') === c.slug && !tag && !q
                  return (
                    <Link key={c.slug || 'all'} href={c.slug ? `/blog?category=${c.slug}` : '/blog'} aria-current={on ? 'true' : undefined}
                      className={cn('inline-flex min-h-10 shrink-0 items-center rounded-xl px-4 py-1.5 text-sm font-medium transition', on ? 'bg-btn text-white' : 'text-charcoal-800 hover:bg-cream')}>
                      {c.title}
                    </Link>
                  )
                })}
              </div>
            </div>
            <form action={localizedHref('/blog', locale)} className="flex h-10 items-center gap-2 rounded-full bg-white px-4 ring-1 ring-charcoal-900/10 transition focus-within:ring-2 focus-within:ring-saffron-400 md:w-80" role="search">
              <Search className="size-4 shrink-0 text-muted" />
              <input name="q" defaultValue={q} placeholder={t('searchPlaceholder')} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" aria-label={t('searchPlaceholder')} />
            </form>
          </div>
        </div>

        {/* article list + sidebar */}
        <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr] lg:gap-14">
          <section className="min-w-0">
            <SectionTitle aside={<span className="shrink-0 text-xs text-muted">{t('showing', { count: num(posts.length) })}</span>}>
              {listTitle}
            </SectionTitle>
            <div className="divide-y divide-line">
              {posts.map((post) => (
                <BlogRow key={post.id} post={post} locale={locale} readMore={t('readMore')} share={<QuickShare url={shareUrl(post.slug)} title={post.title} label={tc('share')} />} />
              ))}
            </div>
            {!posts.length && <p className="py-14 text-center text-muted">{tc('noResults')}</p>}
            <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/blog" query={{ category, tag, q }} />
          </section>

          <aside className="flex flex-col gap-12 lg:sticky lg:top-44 lg:self-start">
            {cats.length > 0 && <TopicsCard cats={cats} active={category} title={t('topics')} allLabel={t('allTopics')} />}
            <RecentList posts={latest.slice(0, 5)} locale={locale} title={t('recent')} />
          </aside>
        </div>
      </div>
    </>
  )
}
