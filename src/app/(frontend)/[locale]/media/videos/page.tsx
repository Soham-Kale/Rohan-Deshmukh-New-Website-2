import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { InnerPage } from '@/components/layout/InnerPage'
import { FilterChips, Pagination } from '@/components/ui/Pagination'
import { YouTube } from '@/components/ui/YouTube'
import { formatDate } from '@/lib/utils'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ playlist?: string; page?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('videoGallery') }
}

export default async function VideosPage({ params, searchParams }: P) {
  const { locale } = await params
  const { playlist, page = '1' } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const p = await payload()
  const all = await p.find({ collection: 'videos', limit: 500, locale, depth: 0, select: { playlist: true } })
  const playlists = [...new Set(all.docs.map((v) => v.playlist).filter(Boolean))] as string[]
  const res = await p.find({ collection: 'videos', where: playlist ? { playlist: { equals: playlist } } : {}, limit: 12, page: Number(page) || 1, locale, sort: '-publishedAt' })
  return (
    <InnerPage path="/media/videos" locale={locale} title={t('videoGallery')}>
      {playlists.length > 1 && <FilterChips param="playlist" base="/media/videos" active={playlist} items={[{ label: tc('all'), value: '' }, ...playlists.map((p) => ({ label: p, value: p }))]} />}
      <div className="grid gap-6 md:grid-cols-2">
        {res.docs.map((v) => (
          <div key={v.id}>
            <YouTube url={v.youtubeUrl} />
            <h2 className="mt-3 text-lg text-charcoal-900">{v.title}</h2>
            <p className="text-sm text-muted">{[v.playlist, formatDate(v.publishedAt, locale)].filter(Boolean).join(' · ')}</p>
          </div>
        ))}
      </div>
      {!res.docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
      <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/media/videos" query={{ playlist }} />
    </InnerPage>
  )
}
