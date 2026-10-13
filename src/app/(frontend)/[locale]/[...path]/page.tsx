import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { mediaPosition, mediaUrl } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { PageBlocks } from '@/components/blocks/PageBlocks'

export const revalidate = 300

type Params = { params: Promise<{ locale: Locale; path: string[] }> }

const getPage = cache(async (path: string, locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const p = await payload()
  const res = await p.find({ collection: 'pages', where: { path: { equals: path } }, locale, limit: 1, depth: 2, draft })
  return res.docs[0] ?? null
})

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return [] // see [locale]/layout.tsx
  try {
    const p = await payload()
    const res = await p.find({ collection: 'pages', limit: 200, depth: 0, select: { path: true } })
    return res.docs.flatMap((d) => ['mr', 'en'].map((locale) => ({ locale, path: d.path.split('/').filter(Boolean) })))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, path } = await params
  const page = await getPage('/' + path.join('/'), locale)
  if (!page) return {}
  const img = mediaUrl(page.meta?.image as never) || mediaUrl(page.bannerImage, 'card')
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || page.subtitle || undefined,
    openGraph: { images: img ? [img] : undefined },
  }
}

export default async function CmsPage({ params }: Params) {
  const { locale, path } = await params
  setRequestLocale(locale)
  const full = '/' + path.join('/')
  const page = await getPage(full, locale)
  if (!page) notFound()
  return (
    <InnerPage path={full} locale={locale} title={page.title} subtitle={page.subtitle} image={mediaUrl(page.bannerImage, 'hero')} imagePosition={mediaPosition(page.bannerImage)} sideMenu={page.showSideMenu ?? true}>
      <PageBlocks blocks={page.layout} />
    </InnerPage>
  )
}
