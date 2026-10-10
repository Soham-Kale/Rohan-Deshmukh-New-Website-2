import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/payload'
import { HomeSections } from '@/components/home/HomeSections'
import { mediaUrl } from '@/lib/utils'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const home = await getGlobal('home', locale)
  const s = await getGlobal('site-settings', locale)
  const meta = (home as { meta?: { title?: string | null; description?: string | null; image?: unknown } }).meta
  return {
    title: { absolute: meta?.title || s.siteName },
    description: meta?.description || s.tagline || undefined,
    openGraph: { images: mediaUrl(meta?.image as never) ? [mediaUrl(meta?.image as never)!] : undefined },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const home = await getGlobal('home', locale)
  return <HomeSections sections={home.sections ?? []} locale={locale} />
}
