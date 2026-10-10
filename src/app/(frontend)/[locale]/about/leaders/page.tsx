import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { InnerPage } from '@/components/layout/InnerPage'
import { Gallery } from '@/components/ui/Gallery'
import { mediaUrl } from '@/lib/utils'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('leaders') }
}

export default async function LeadersPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')
  const docs = (await (await payload()).find({ collection: 'leader-meetings', limit: 200, locale, depth: 1, sort: '-date' })).docs
  const images = docs
    .filter((d) => typeof d.image === 'object' && d.image?.url)
    .map((d) => ({
      src: mediaUrl(d.image, 'hero')!,
      thumb: mediaUrl(d.image, 'card')!,
      alt: d.leaderName,
      caption: [d.leaderName, d.caption].filter(Boolean).join(' — '),
    }))
  return (
    <InnerPage path="/about/leaders" locale={locale} title={t('leaders')}>
      {images.length ? <Gallery images={images} /> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
    </InnerPage>
  )
}
