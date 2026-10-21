import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { cms } from '@/lib/api'
import { LOCALE, useTranslations } from '@/lib/i18n'
import { mediaAlt, mediaUrl, toGallery } from '@/lib/media'
import { cn, formatDate, pageNumber } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Seo } from '@/components/layout/Seo'
import { Gallery } from '@/components/ui/Gallery'
import { Img } from '@/components/ui/Img'
import { FilterChips, Pagination } from '@/components/ui/Pagination'
import { YouTube } from '@/components/ui/YouTube'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Motion'
import { notFound, searchOf } from './helpers'

/* ---------------------------------------------------------------- Photo Gallery: one card per album */

export async function photosLoader() {
  return cms.find('albums', { limit: 60, depth: 1, sort: '-date' })
}

export function PhotosPage() {
  const res = useLoaderData<typeof photosLoader>()
  const t = useTranslations('pages')
  const albums = res.docs
  return (
    <>
      <Seo title={t('photoGallery')} />
      <InnerPage path="/media/photos" title={t('photoGallery')} variant="navy">
        {/* a mosaic: the newest album large, the others beside and below it */}
        <Stagger className="grid auto-rows-[15rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-3">
          {albums.map((a, i) => {
            const cover = a.cover ?? (a.photos?.[0] as never)
            const big = i === 0 && albums.length > 2
            const sizes = big ? '(max-width:640px) 100vw, 66vw' : '(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw'
            return (
              <StaggerItem key={a.id} className={cn(big && 'sm:col-span-2 sm:row-span-2')}>
                <Link to={`/media/photos/${a.slug}`} className="group relative block h-full overflow-hidden rounded-2xl bg-charcoal-950 shadow-sm ring-1 ring-stone-200/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-saffron-500/60">
                  {/* the whole cover photo, nobody cut off — a soft blurred copy of it fills the rest of the tile */}
                  <Img media={cover} variant={big ? 'hero' : 'card'} alt="" aria-hidden fill sizes={sizes} className="scale-110 object-cover opacity-70 blur-2xl" />
                  <Img media={cover} variant={big ? 'hero' : 'card'} alt={mediaAlt(a.cover, a.title)} fill sizes={sizes} className="object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                    <div className="min-w-0">
                      <span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-saffron-500 transition-all duration-300 group-hover:w-16" />
                      <h2 className={cn('font-display font-bold leading-tight text-white', big ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl')}>{a.title}</h2>
                      {big && a.description && <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-300 md:text-base">{a.description}</p>}
                    </div>
                    <span aria-hidden className="grid size-11 shrink-0 translate-y-2 place-items-center rounded-full bg-saffron-500 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
        {!albums.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
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
      <InnerPage path={`/media/photos/${a.slug}`} title={a.title} subtitle={a.description || undefined} crumbs={[{ label: t('media') }, { label: t('photoGallery'), href: '/media/photos' }, { label: a.title }]} variant="navy">
        <Reveal className="mb-8">
          <Link to="/media/photos" className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-charcoal-950 shadow-sm ring-1 ring-stone-200/80 transition hover:ring-saffron-400">
            <ArrowLeft className="size-4 text-saffron-600 transition-transform group-hover:-translate-x-0.5" />
            {t('photoGallery')}
          </Link>
        </Reveal>
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
