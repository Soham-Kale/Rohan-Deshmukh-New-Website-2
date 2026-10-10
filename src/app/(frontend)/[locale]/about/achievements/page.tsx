import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Award as AwardIcon } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { mediaAlt, mediaUrl, toMarathiDigits } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Gallery } from '@/components/ui/Gallery'
import { toGallery } from '@/components/ui/toGallery'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages' })
  return { title: t('awards') }
}

export default async function AchievementsPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages')
  const p = await payload()
  const awards = (await p.find({ collection: 'awards', limit: 100, locale, depth: 1, sort: '-year' })).docs
  return (
    <InnerPage path="/about/achievements" locale={locale} title={t('awards')} subtitle={t('awardsIntro')}>
      {awards.length ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-2">
            {awards.map((a) => {
              const img = mediaUrl(a.image, 'card')
              return (
                <li key={a.id} className="card flex gap-4 p-5">
                  {img ? (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream"><Image src={img} alt={mediaAlt(a.image, a.title)} fill sizes="80px" className="object-cover" /></div>
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600"><AwardIcon className="size-7" /></span>
                  )}
                  <div>
                    {a.year && <p className="font-display text-saffron-600">{locale === 'mr' ? toMarathiDigits(a.year) : a.year}</p>}
                    <h2 className="text-lg text-maroon-900">{a.title}</h2>
                    {a.awardingBody && <p className="text-sm text-muted">{a.awardingBody}</p>}
                    {a.description && <p className="mt-2 text-[0.97rem] text-muted">{a.description}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
          <Gallery className="mt-12" images={toGallery(awards.map((a) => a.image) as never)} />
        </>
      ) : (
        <p className="rounded-2xl bg-cream p-8 text-center text-muted">{t('contentComing')}</p>
      )}
      <figure className="mt-12 rounded-3xl bg-maroon-900 p-8 text-white md:p-10">
        <blockquote className="font-display text-2xl leading-relaxed">“{t('thanks')}”</blockquote>
        <figcaption className="mt-6 font-display text-3xl italic text-saffron-300">— रोहन सुभाष देशमुख</figcaption>
      </figure>
    </InnerPage>
  )
}
