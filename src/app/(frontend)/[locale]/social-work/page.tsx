import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { INITIATIVE_CATEGORIES } from '@/collections/Content'
import { mediaAlt, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { InnerPage } from '@/components/layout/InnerPage'
import { FilterChips } from '@/components/ui/Pagination'
import { CountUp } from '@/components/ui/CountUp'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ category?: string }> }

const catLabel = (v: string, locale: Locale) => {
  const l = INITIATIVE_CATEGORIES.find((c) => c.value === v)?.label ?? v
  const [mr, en] = l.split(' / ')
  return locale === 'mr' ? mr : en ?? mr
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'pages' }))('socialWork') }
}

export default async function SocialWorkPage({ params, searchParams }: P) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('pages'), getTranslations('common')])
  const docs = (await (await payload()).find({ collection: 'initiatives', limit: 200, locale, depth: 1, sort: 'order' })).docs
  const used = INITIATIVE_CATEGORIES.filter((c) => docs.some((d) => d.category === c.value))
  const groups = used.filter((c) => !category || c.value === category).map((c) => ({ ...c, items: docs.filter((d) => d.category === c.value) }))

  return (
    <InnerPage path="/social-work" locale={locale} title={t('socialWork')} subtitle={locale === 'mr' ? 'लोकमंगल फाऊंडेशनच्या माध्यमातून राबविलेले उपक्रम — विभागानुसार' : 'Initiatives run through Lokmangal Foundation — by category'} wide>
      <FilterChips base="/social-work" active={category} items={[{ label: tc('all'), value: '' }, ...used.map((c) => ({ label: catLabel(c.value, locale), value: c.value }))]} />
      <div className="space-y-20">
        {groups.map((g) => (
          <section key={g.value} aria-labelledby={`cat-${g.value}`}>
            <div className="mb-8 flex items-center gap-4">
              <h2 id={`cat-${g.value}`} className="text-[1.6rem] leading-tight text-charcoal-900 md:text-[2rem]">{catLabel(g.value, locale)}</h2>
              <span className="h-px flex-1 bg-line" />
              <span className="text-sm text-muted">{g.items.length}</span>
            </div>
            <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => {
                const img = mediaUrl(it.heroImage, 'card')
                return (
                  <Link key={it.id} href={`/social-work/${it.slug}`} className="tile group">
                    <div className="tile-media aspect-[16/10]">
                      {img && <Image src={img} alt={mediaAlt(it.heroImage, it.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" style={photoFit(it.heroImage, 1.6, 0.6)} />}
                      {it.counters?.[0] && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-charcoal-900/90 px-3 py-1 text-sm text-white backdrop-blur">
                          <b className="text-saffron-300"><CountUp value={it.counters[0].value} /></b> {it.counters[0].label}
                        </span>
                      )}
                    </div>
                    <div className="tile-body">
                      <h3 className="tile-title text-xl">{it.title}</h3>
                      <p className="tile-text line-clamp-3">{it.excerpt}</p>
                      <span className="more-link mt-auto pt-4">{tc('moreInfo')} <ArrowRight className="size-4" /></span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </InnerPage>
  )
}
