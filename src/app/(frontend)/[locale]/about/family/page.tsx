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
      <div className="space-y-16 md:space-y-24">
        {members.map((m, i) => {
          const img = mediaUrl(m.image, 'card')
          const paras = (m.text ?? '').split(/\n\s*\n/).filter(Boolean)
          return (
            <article key={m.id ?? i} className={cn('grid items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16', i % 2 === 1 && 'md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]')}>
              {img && (
                <div className={cn('overflow-hidden rounded-[1.75rem] bg-cream', i % 2 === 1 && 'md:order-2')}>
                  <Image src={img} alt={mediaAlt(m.image, m.name ?? '')} width={mediaSize(m.image).width} height={mediaSize(m.image).height} sizes="(max-width:768px) 100vw, 40vw" className="h-auto w-full" />
                </div>
              )}
              <div>
                {m.relation && <p className="eyebrow">{m.relation}</p>}
                <h2 className="mt-2 text-[1.8rem] leading-tight text-charcoal-900 md:text-[2.3rem]">{m.name}</h2>
                <div className="prose-rd mt-5 max-w-2xl">{paras.map((p, k) => <p key={k}>{p}</p>)}</div>
              </div>
            </article>
          )
        })}
      </div>
      <div className="mt-16 border-t border-line pt-10 md:mt-24">
        <Link href="/lokmangal/parivar" className="btn btn-dark">{t('parivar')} <ArrowRight className="size-4" /></Link>
      </div>
    </InnerPage>
  )
}
