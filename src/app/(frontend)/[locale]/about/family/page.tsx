import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import type { Home } from '@/payload-types'
import { getGlobal } from '@/lib/payload'
import { cn, mediaAlt, mediaSize, mediaUrl } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { Link } from '@/i18n/navigation'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }
type FamilyBlock = Extract<NonNullable<Home['sections']>[number], { blockType: 'family' }>

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'family' })
  return { title: t('title'), description: t('intro') }
}

/** Family page — uses the "Family background" section of the homepage (edit it under Homepage in the admin) */
export default async function FamilyPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('family')
  const home = await getGlobal('home', locale)
  const block = (home.sections ?? []).find((s): s is FamilyBlock => s.blockType === 'family')
  const members = block?.members ?? []

  return (
    <InnerPage path="/about/family" locale={locale} title={block?.heading || t('title')} subtitle={t('intro')}>
      <div className="space-y-14 md:space-y-20">
        {members.map((m, i) => {
          const img = mediaUrl(m.image, 'card')
          const paras = (m.text ?? '').split(/\n\s*\n/).filter(Boolean)
          return (
            <article key={m.id ?? i} className={cn('grid items-start gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-10', i % 2 === 1 && 'md:grid-cols-[1.2fr_0.8fr]')}>
              {img && (
                <div className={cn('overflow-hidden rounded-3xl bg-cream md:sticky md:top-28', i % 2 === 1 && 'md:order-2')}>
                  <Image src={img} alt={mediaAlt(m.image, m.name ?? '')} width={mediaSize(m.image).width} height={mediaSize(m.image).height} sizes="(max-width:768px) 100vw, 40vw" className="h-auto w-full" />
                </div>
              )}
              <div>
                {m.relation && <p className="eyebrow">{m.relation}</p>}
                <h2 className="h-section">{m.name}</h2>
                <div className="prose-rd mt-5">{paras.map((p, k) => <p key={k}>{p}</p>)}</div>
              </div>
            </article>
          )
        })}
      </div>
      <div className="mt-14 flex justify-center">
        <Link href="/lokmangal/parivar" className="btn btn-dark">{t('parivar')} <ArrowRight className="size-4" /></Link>
      </div>
    </InnerPage>
  )
}
