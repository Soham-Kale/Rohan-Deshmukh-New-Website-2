import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { formatDate, mediaUrl } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale; slug: string }> }

const get = cache(async (slug: string, locale: Locale) =>
  (await (await payload()).find({ collection: 'albums', where: { slug: { equals: decodeURIComponent(slug) } }, locale, depth: 1, limit: 1 })).docs[0] ?? null)

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const a = await get(slug, locale)
  return a ? { title: a.title, description: a.description ?? undefined, openGraph: { images: mediaUrl(a.cover, 'card') ? [mediaUrl(a.cover, 'card')!] : undefined } } : {}
}

export default async function AlbumPage({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const a = await get(slug, locale)
  if (!a) notFound()
  const t = await getTranslations('pages')
  const sub = [a.date ? formatDate(a.date, locale) : null, `${a.photos?.length ?? 0} ${t('photosInAlbum')}`].filter(Boolean).join(' · ')
  return (
    <InnerPage path={`/media/photos/${a.slug}`} locale={locale} title={a.title} subtitle={a.description || sub} wide
      crumbs={[{ label: t('media') }, { label: t('photoGallery'), href: '/media/photos' }, { label: a.title }]}>
      <Gallery images={toGallery(a.photos as never, a.title)} layout="masonry" />
    </InnerPage>
  )
}
