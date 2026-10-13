import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Where } from 'payload'
import { ChevronRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { localizedHref, siteUrl, toMarathiDigits, cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/Pagination'
import { BlogMasthead, BlogRow, LatestList, LeadStory, RecentList, SectionTitle, TopicsCard } from '@/components/blog/BlogParts'
import { QuickShare } from '@/components/blog/QuickShare'

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
    <div className="bg-cream">
      <BlogMasthead posts={latest} locale={locale} edition={t('edition')} breaking={t('breaking')} />

      {/* page heading */}
      <header className="container-x pb-8 pt-10 md:pb-10 md:pt-14">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="hover:text-charcoal-900">{tc('home')}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-charcoal-900">{t('title')}</span>
        </nav>
        <p className="inline-flex rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-700">{t('kicker')}</p>
        <h1 className="mt-4 text-[2.1rem] leading-tight text-charcoal-900 md:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-muted md:text-lg">{t('intro')}</p>
      </header>

      {/* top stories */}
      {isFront && lead && (
        <section className="container-x pb-10 md:pb-12">
          <SectionTitle
            aside={<span className="hidden items-center gap-1.5 rounded-md bg-saffron-50 px-2.5 py-1 text-xs font-bold tracking-wide text-saffron-700 sm:inline-flex"><Sparkles className="size-3.5" />{t('topBadge')}</span>}
          >
            {t('topStories')}
          </SectionTitle>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
            <LeadStory post={lead} locale={locale} badge={t('lead')} readFull={t('readFull')} />
            {rest.length > 0 && <LatestList posts={rest.slice(0, 4)} locale={locale} title={t('latestUpdates')} footer={t('daily')} />}
          </div>
        </section>
      )}

      {/* sections + search — stays at the top while scrolling */}
      <div className="sticky top-16 z-30 pb-6">
        <div className="container-x">
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_10px_30px_-22px_rgba(0,0,0,.4)] backdrop-blur md:flex-row md:items-center md:p-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="hidden shrink-0 items-center gap-1.5 text-sm text-muted sm:inline-flex"><SlidersHorizontal className="size-4" /> {t('sections')}:</span>
              <div className="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1">
                {[{ slug: '', title: tc('all') }, ...cats].map((c) => {
                  const on = (category ?? '') === c.slug && !tag && !q
                  return (
                    <Link key={c.slug || 'all'} href={c.slug ? `/blog?category=${c.slug}` : '/blog'} aria-current={on ? 'true' : undefined}
                      className={cn('shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition', on ? 'bg-charcoal-900 text-white' : 'bg-cream text-charcoal-800 hover:bg-line')}>
                      {c.title}
                    </Link>
                  )
                })}
              </div>
            </div>
            <form action={localizedHref('/blog', locale)} className="flex h-10 items-center gap-2 rounded-full border border-line bg-cream/60 px-4 md:w-80" role="search">
              <Search className="size-4 shrink-0 text-muted" />
              <input name="q" defaultValue={q} placeholder={t('searchPlaceholder')} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" aria-label={t('searchPlaceholder')} />
            </form>
          </div>
        </div>
      </div>

      {/* article list + sidebar */}
      <div className="container-x grid gap-8 pb-16 md:pb-24 lg:grid-cols-[1.75fr_1fr]">
        <section className="min-w-0 rounded-2xl border border-line bg-white px-5 pt-5 md:px-7 md:pt-6">
          <SectionTitle aside={<span className="shrink-0 text-xs text-muted">{t('showing', { count: num(posts.length) })}</span>}>
            {listTitle}
          </SectionTitle>
          <div className="divide-y divide-line">
            {posts.map((post) => (
              <BlogRow key={post.id} post={post} locale={locale} readMore={t('readMore')} share={<QuickShare url={shareUrl(post.slug)} title={post.title} label={tc('share')} />} />
            ))}
          </div>
          {!posts.length && <p className="py-14 text-center text-muted">{tc('noResults')}</p>}
          <div className="pb-6">
            <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/blog" query={{ category, tag, q }} />
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-40 lg:self-start">
          {cats.length > 0 && <TopicsCard cats={cats} active={category} title={t('topics')} allLabel={t('allTopics')} />}
          <RecentList posts={latest.slice(0, 5)} locale={locale} title={t('recent')} />
        </aside>
      </div>
    </div>
  )
}
