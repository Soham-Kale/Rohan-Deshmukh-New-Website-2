import type { Metadata, Viewport } from 'next'
// Tiro Devanagari Marathi is self-hosted from /public/fonts/tiro (declared in globals.css); preload the two files every page uses
import { preload } from 'react-dom'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import NextTopLoader from 'nextjs-toploader'
import { routing, type Locale } from '@/i18n/routing'
import { getGlobal } from '@/lib/cms'
import { mediaUrl, siteUrl } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingButtons, SitePopup } from '@/components/layout/Floating'
import '../globals.css'


export const viewport: Viewport = { themeColor: "#fffcf7", width: 'device-width', initialScale: 1 }

export function generateStaticParams() {
  // Pre-render only in production builds: in dev, concurrent page compiles race on
  // .next/prerender-manifest.json (corrupts it on Windows)
  if (process.env.NODE_ENV === 'development') return []
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const s = await getGlobal('site-settings', locale as Locale)
  const image = mediaUrl(s.defaultShareImage)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.siteName, template: `%s | ${s.siteName}` },
    description: s.tagline ?? undefined,
    openGraph: { siteName: s.siteName, locale: 'en_IN', type: 'website', images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image', site: '@rohandeshmukhh' },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  preload('/fonts/tiro/tiro-devanagari-marathi-devanagari-400-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  preload('/fonts/tiro/tiro-devanagari-marathi-latin-400-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  const [settings, popup, t, tn] = await Promise.all([
    getGlobal('site-settings', locale),
    getGlobal('popup', locale),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'nav' }),
  ])
  const now = Date.now()
  const popupActive =
    popup.enabled &&
    (!popup.startDate || new Date(popup.startDate).getTime() <= now) &&
    (!popup.endDate || new Date(popup.endDate).getTime() >= now)

  const { id: _id, ...social } = (settings.social ?? {}) as Record<string, string | null>
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rohan Subhash Deshmukh',
    alternateName: 'रोहन सुभाष देशमुख',
    url: siteUrl(),
    birthPlace: 'Solapur, Maharashtra',
    sameAs: Object.values(social).filter(Boolean),
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
  }

  return (
    <html lang={locale}>
      <body className="min-h-dvh antialiased">
        <NextTopLoader color="#f26b1d" height={3} showSpinner={false} shadow="0 0 10px #f26b1d,0 0 5px #f26b1d" />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-saffron-500 focus:px-5 focus:py-2 focus:text-white">
          {tn('skip')}
        </a>
        <NextIntlClientProvider>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <FloatingButtons labels={{ top: t('backToTop') }} />
          <SitePopup
            closeLabel={t('close')}
            data={
              popupActive
                ? { key: String(popup.updatedAt), image: mediaUrl(popup.image, 'card'), title: popup.title, text: popup.text, linkLabel: popup.linkLabel, linkUrl: popup.linkUrl, delaySeconds: popup.delaySeconds }
                : null
            }
          />
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}</Script>
          </>
        )}
      </body>
    </html>
  )
}
