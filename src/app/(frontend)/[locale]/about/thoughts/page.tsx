import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Where } from 'payload'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { siteUrl, localizedHref, mediaUrl } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { FilterChips, Pagination } from '@/components/ui/Pagination'
import { QuoteGrid } from './QuoteGrid'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ page?: string; category?: string }> }

const CATS = [
  { value: 'inspiration', mr: 'प्रेरणा', en: 'Inspiration' },
  { value: 'service', mr: 'समाजसेवा', en: 'Service' },
  { value: 'new-india', mr: 'नवभारत', en: 'New India' },
  { value: 'entrepreneurship', mr: 'उद्योजकता', en: 'Entrepreneurship' },
  { value: 'youth', mr: 'युवा', en: 'Youth' },
]

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('quotes') }
}

export default async function ThoughtsPage({ params, searchParams }: P) {
  const { locale } = await params
  const { page = '1', category } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const where: Where = category ? { category: { equals: category } } : {}
  const res = await (await payload()).find({ collection: 'quotes', where, limit: 18, page: Number(page) || 1, locale, depth: 1, sort: '-publishedAt' })
  return (
    <InnerPage path="/about/thoughts" locale={locale} title={t('quotes')}>
      <FilterChips base="/about/thoughts" active={category} items={[{ label: tc('all'), value: '' }, ...CATS.map((c) => ({ label: c[locale], value: c.value }))]} />
      {res.docs.length ? (
        <QuoteGrid
          shareLabel={tc('share')}
          quotes={res.docs.map((q) => ({
            id: q.id,
            text: q.text,
            image: typeof q.image === 'object' && q.image ? { src: mediaUrl(q.image, 'hero')!, thumb: mediaUrl(q.image, 'card')! } : null,
            url: `${siteUrl()}${localizedHref('/about/thoughts', locale)}#q-${q.id}`,
          }))}
        />
      ) : (
        <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>
      )}
      <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/about/thoughts" query={{ category }} />
    </InnerPage>
  )
}
