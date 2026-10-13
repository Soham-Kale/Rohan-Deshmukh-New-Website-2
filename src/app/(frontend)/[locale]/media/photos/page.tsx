import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Images } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { ALBUM_CATEGORIES } from '@/collections/Content'
import { formatDate, mediaAlt, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { InnerPage } from '@/components/layout/InnerPage'
import { FilterChips, Pagination } from '@/components/ui/Pagination'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ category?: string; page?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('photoGallery') }
}

export default async function PhotosPage({ params, searchParams }: P) {
  const { locale } = await params
  const { category, page = '1' } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const res = await (await payload()).find({ collection: 'albums', where: category ? { category: { equals: category } } : {}, limit: 12, page: Number(page) || 1, locale, depth: 1, sort: '-date' })
  const cats = ALBUM_CATEGORIES.map((c) => ({ value: c.value, label: c.label.split(' / ')[locale === 'mr' ? 0 : 1] }))
  return (
    <InnerPage path="/media/photos" locale={locale} title={t('photoGallery')}>
      <FilterChips base="/media/photos" active={category} items={[{ label: tc('all'), value: '' }, ...cats]} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {res.docs.map((a) => {
          const cover = mediaUrl(a.cover, 'card') || mediaUrl(a.photos?.[0] as never, 'card')
          return (
            <Link key={a.id} href={`/media/photos/${a.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                {cover && <Image src={cover} alt={mediaAlt(a.cover, a.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(a.cover, 4 / 3, 0.6)} />}
                <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-charcoal-900/85 px-3 py-1 text-sm text-white backdrop-blur">
                  <Images className="size-4" /> {a.photos?.length ?? 0}
                </span>
              </div>
              <h2 className="mt-3 text-lg text-charcoal-900 group-hover:text-saffron-700">{a.title}</h2>
              {a.date && <p className="text-sm text-muted">{formatDate(a.date, locale)}</p>}
            </Link>
          )
        })}
      </div>
      {!res.docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
      <Pagination page={res.page ?? 1} totalPages={res.totalPages} base="/media/photos" query={{ category }} />
    </InnerPage>
  )
}
