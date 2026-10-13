import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Download } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { InnerPage } from '@/components/layout/InnerPage'
import { mediaAlt, mediaUrl, photoFit, relativize } from '@/lib/utils'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('downloads') }
}

export default async function DownloadsPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const docs = (await (await payload()).find({ collection: 'download-photos', limit: 200, locale, depth: 1 })).docs
  return (
    <InnerPage path="/media/downloads" locale={locale} title={t('downloads')} subtitle={locale === 'mr' ? 'माध्यमांसाठी उच्च दर्जाची अधिकृत छायाचित्रे' : 'High-resolution official photographs for media use'}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => {
          const img = typeof d.image === 'object' ? d.image : null
          if (!img?.url) return null
          return (
            <figure key={d.id} className="card">
              <div className="relative aspect-[4/5] bg-cream">
                <Image src={mediaUrl(img, 'card')!} alt={mediaAlt(img, d.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" style={photoFit(img, 0.8)} />
              </div>
              <figcaption className="flex items-center justify-between gap-3 p-4">
                <span>
                  <span className="block font-semibold text-charcoal-900">{d.title}</span>
                  <span className="text-xs text-muted">{img.width}×{img.height} · {Math.round((img.filesize ?? 0) / 1024)} KB</span>
                </span>
                <a href={relativize(img.url)!} download={img.filename ?? true} className="btn btn-primary !px-4 !py-2 text-sm"><Download className="size-4" /> {tc('download')}</a>
              </figcaption>
            </figure>
          )
        })}
      </div>
      {!docs.length && <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>}
    </InnerPage>
  )
}
