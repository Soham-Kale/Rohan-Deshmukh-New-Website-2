import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Where } from 'payload'
import { Search } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { InnerPage } from '@/components/layout/InnerPage'
import { FilterChips, Pagination } from '@/components/ui/Pagination'
import { PostCard } from '@/components/home/HomeSections'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ category?: string; tag?: string; q?: string; page?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('blog') }
}

export default async function BlogPage({ params, searchParams }: P) {
  const { locale } = await params
  const { category, tag, q, page = '1' } = await searchParams
  setRequestLocale(locale)
  const [t, tc, ts] = await Promise.all([getTranslations('pages'), getTranslations('common'), getTranslations('search')])
  const p = await payload()
  const cats = (await p.find({ collection: 'categories', limit: 50, locale })).docs
  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (category) {
    const c = cats.find((x) => x.slug === category)
    if (c) and.push({ categories: { contains: c.id } })
  }
  if (tag) and.push({ tags: { contains: tag } })
  if (q) and.push({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })
  const res = await p.find({ collection: 'posts', where: { and }, limit: 9, page: Number(page) || 1, locale, depth: 1, sort: '-publishedAt' })
  return (
    <InnerPage path="/blog" locale={locale} title={t('blog')} subtitle={`${tc('by')}: ${locale === 'mr' ? 'रोहन देशमुख' : 'Rohan Deshmukh'}`} wide>
      <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {cats.length > 0 && <FilterChips base="/blog" active={category} items={[{ label: tc('all'), value: '' }, ...cats.map((c) => ({ label: c.title, value: c.slug }))]} />}
        <form action="" className="mb-8 flex w-full items-center gap-2 rounded-full border border-line bg-white px-4 md:w-80">
          <Search className="size-4 text-muted" />
          <input name="q" defaultValue={q} placeholder={ts('title')} className="h-11 flex-1 bg-transparent outline-none" aria-label={ts('title')} />
        </form>
      </div>
      {tag && <p className="mb-6 text-muted">#{tag}</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{res.docs.map((post) => <PostCard key={post.id} post={post} locale={locale} />)}</div>
      {!res.docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{tc('noResults')}</p>}
      <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/blog" query={{ category, tag, q }} />
    </InnerPage>
  )
}
