import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { mediaAlt, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { InnerPage } from '@/components/layout/InnerPage'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('photoGallery') }
}

/** Photo Gallery: one card per album (Family / Celebrity / Political Moments), like supriyassule.in */
export default async function PhotosPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')
  const res = await (await payload()).find({ collection: 'albums', limit: 60, locale, depth: 1, sort: '-date' })
  return (
    <InnerPage path="/media/photos" locale={locale} title={t('photoGallery')}>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {res.docs.map((a) => {
          const cover = mediaUrl(a.cover, 'card') || mediaUrl(a.photos?.[0] as never, 'card')
          return (
            <Link key={a.id} href={`/media/photos/${a.slug}`} className="group block text-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream shadow-sm ring-1 ring-charcoal-900/5 transition group-hover:shadow-lg">
                {cover && <Image src={cover} alt={mediaAlt(a.cover, a.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(a.cover, 4 / 3, 0.7)} />}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-charcoal-900 transition group-hover:text-saffron-700">{a.title}</h2>
            </Link>
          )
        })}
      </div>
      {!res.docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
    </InnerPage>
  )
}
