import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Search } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { PageBanner } from '@/components/layout/PageBanner'
import { Link } from '@/i18n/navigation'

type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  return { title: (await getTranslations({ locale, namespace: 'search' }))('title'), robots: { index: false } }
}

const typeLabel = { pages: { mr: 'पृष्ठ', en: 'Page' }, posts: { mr: 'लेख', en: 'Blog' }, initiatives: { mr: 'उपक्रम', en: 'Initiative' } } as const

export default async function SearchPage({ params, searchParams }: P) {
  const { locale } = await params
  const { q = '' } = await searchParams
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('search'), getTranslations('common')])
  const query = q.trim().slice(0, 100)
  const res = query.length >= 2
    ? await (await payload()).find({ collection: 'search', locale, limit: 40, depth: 0, where: { or: [{ title: { like: query } }, { excerpt: { like: query } }] } })
    : null
  return (
    <>
      <PageBanner title={t('title')} crumbs={[{ label: t('title') }]} />
      <div className="container-x max-w-3xl py-12">
        <form className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-2 shadow-sm">
          <Search className="size-5 text-muted" />
          <input name="q" defaultValue={query} placeholder={t('placeholder')} className="h-12 flex-1 bg-transparent text-lg outline-none" aria-label={t('placeholder')} autoFocus />
          <button className="btn btn-dark">{t('title')}</button>
        </form>
        {res && (
          <div className="mt-8">
            <p className="mb-4 text-muted">{t('results')}: {res.totalDocs}</p>
            <ul className="divide-y divide-line">
              {res.docs.map((d) => {
                const rel = (d.doc as { relationTo: keyof typeof typeLabel }).relationTo
                return (
                  <li key={d.id}>
                    <Link href={(d as { url?: string }).url || '/'} className="group block py-5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-saffron-700">{typeLabel[rel]?.[locale]}</span>
                      <p className="mt-1 text-xl text-charcoal-900 group-hover:text-saffron-700">{d.title}</p>
                      {(d as { excerpt?: string }).excerpt && <p className="mt-1 line-clamp-2 text-muted">{(d as { excerpt?: string }).excerpt}</p>}
                    </Link>
                  </li>
                )
              })}
            </ul>
            {!res.docs.length && <p className="text-muted">{tc('noResults')}</p>}
          </div>
        )}
      </div>
    </>
  )
}
