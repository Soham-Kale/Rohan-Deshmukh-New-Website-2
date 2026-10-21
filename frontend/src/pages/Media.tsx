import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { cms } from '@/lib/api'
import { LOCALE, useTranslations } from '@/lib/i18n'
import { mediaAlt, mediaUrl, photoFit, toGallery } from '@/lib/media'
import { formatDate, pageNumber } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Seo } from '@/components/layout/Seo'
import { Gallery } from '@/components/ui/Gallery'
import { Img } from '@/components/ui/Img'
import { FilterChips, Pagination } from '@/components/ui/Pagination'
import { YouTube } from '@/components/ui/YouTube'
import { notFound, searchOf } from './helpers'

/* ---------------------------------------------------------------- Photo Gallery: one card per album */

export async function photosLoader() {
  return cms.find('albums', { limit: 60, depth: 1, sort: '-date' })
}

export function PhotosPage() {
  const res = useLoaderData<typeof photosLoader>()
  const t = useTranslations('pages')
  return (
    <>
      <Seo title={t('photoGallery')} />
      <InnerPage path="/media/photos" title={t('photoGallery')}>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {res.docs.map((a) => {
            const cover = a.cover ?? (a.photos?.[0] as never)
            return (
              <Link key={a.id} to={`/media/photos/${a.slug}`} className="tile group text-center">
                <div className="tile-media aspect-[4/3]">
                  <Img media={cover} variant="card" alt={mediaAlt(a.cover, a.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" style={photoFit(a.cover, 4 / 3, 0.7)} />
                </div>
                <h2 className="tile-title mt-5 text-[1.35rem]">{a.title}</h2>
              </Link>
            )
          })}
        </div>
        {!res.docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
      </InnerPage>
    </>
  )
}

/* ---------------------------------------------------------------- one album */

export async function albumLoader({ params }: LoaderFunctionArgs) {
  const album = await cms.findOne('albums', { where: { slug: { equals: decodeURIComponent(params.slug ?? '') } }, depth: 1 })
  return album ?? notFound()
}

export function AlbumPage() {
  const a = useLoaderData<typeof albumLoader>()
  const t = useTranslations('pages')
  return (
    <>
      <Seo title={a.title} description={a.description} image={mediaUrl(a.cover, 'card')} />
      <InnerPage path={`/media/photos/${a.slug}`} title={a.title} subtitle={a.description || undefined} crumbs={[{ label: t('media') }, { label: t('photoGallery'), href: '/media/photos' }, { label: a.title }]}>
        <Gallery images={toGallery(a.photos, a.title)} layout="masonry" wide />
      </InnerPage>
    </>
  )
}

/* ---------------------------------------------------------------- Video Gallery */

export async function videosLoader({ request }: LoaderFunctionArgs) {
  const sp = searchOf(request)
  const playlist = sp.get('playlist')
  const page = pageNumber(sp.get('page'))
  const all = await cms.find('videos', { limit: 500, depth: 0 })
  const playlists = [...new Set(all.docs.map((v) => v.playlist).filter(Boolean))] as string[]
  const res = await cms.find('videos', { where: playlist ? { playlist: { equals: playlist } } : undefined, limit: 12, page, sort: '-publishedAt' })
  return { playlists, res, playlist }
}

export function VideosPage() {
  const { playlists, res, playlist } = useLoaderData<typeof videosLoader>()
  const t = useTranslations('pages')
  const tc = useTranslations('common')
  const locale = LOCALE
  return (
    <>
      <Seo title={t('videoGallery')} />
      <InnerPage path="/media/videos" title={t('videoGallery')}>
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
    </>
  )
}
