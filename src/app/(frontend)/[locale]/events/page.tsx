import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import type { Post } from '@/payload-types'
import { payload } from '@/lib/payload'
import { mediaUrl, photoFit } from '@/lib/utils'
import { InnerPage } from '@/components/layout/InnerPage'
import { CardSlider, type SlideCard } from '@/components/ui/CardSlider'
import { NewsCard, SectionTitle } from '@/components/blog/BlogParts'
import { Link } from '@/i18n/navigation'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'events' })
  return { title: t('title'), description: t('intro') }
}

/** All events: Lokmangal initiatives slider, key events/campaigns (incl. New India Manifesto) and the latest blog posts */
export default async function EventsPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tc] = await Promise.all([getTranslations('events'), getTranslations('common')])
  const p = await payload()
  const [initiatives, events, vision, posts] = await Promise.all([
    p.find({ collection: 'initiatives', limit: 200, locale, depth: 1, sort: 'order' }).then((r) => r.docs),
    p.find({ collection: 'events', limit: 50, locale, depth: 1, sort: '-createdAt' }).then((r) => r.docs),
    p.find({ collection: 'pages', where: { path: { equals: '/vision' } }, limit: 1, locale, depth: 1 }).then((r) => r.docs[0]),
    p.find({ collection: 'posts', limit: 3, locale, depth: 1, sort: '-publishedAt', where: { _status: { equals: 'published' } } }).then((r) => r.docs as Post[]),
  ])

  const slides: SlideCard[] = initiatives.map((it) => ({
    href: `/social-work/${it.slug}`,
    title: it.title,
    text: it.excerpt,
    image: mediaUrl(it.heroImage, 'card'),
    imageStyle: photoFit(it.heroImage, 2, 0.6),
  }))

  const featured: SlideCard[] = [
    ...events.map((e) => ({ href: `/events/${e.slug}`, title: e.title, text: e.description, image: mediaUrl(e.coverImage, 'card'), imageStyle: photoFit(e.coverImage, 2, 0.6), meta: t('event') })),
    ...(vision
      ? [{ href: '/vision', title: locale === 'mr' ? 'न्यू इंडिया मॅनिफेस्टो' : 'The New India Manifesto', text: t('manifestoText'), image: mediaUrl(vision.bannerImage, 'card'), imageStyle: photoFit(vision.bannerImage, 2, 0.6), meta: t('campaign') }]
      : []),
  ]

  return (
    <InnerPage path="/events" locale={locale} title={t('title')} subtitle={t('intro')} sideMenu={false} wide>
      <section>
        <SectionTitle>{t('initiatives')}</SectionTitle>
        <p className="mb-7 mt-3 max-w-3xl text-muted">{t('initiativesIntro')}</p>
        <CardSlider cards={slides} readMore={t('readMore')} prevLabel={t('prev')} nextLabel={t('next')} />
      </section>

      {featured.length > 0 && (
        <section className="mt-16">
          <SectionTitle>{t('featured')}</SectionTitle>
          <div className="mt-7">
            <CardSlider cards={featured} readMore={t('readMore')} prevLabel={t('prev')} nextLabel={t('next')} />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mt-16">
          <SectionTitle aside={<Link href="/blog" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-saffron-700 hover:text-saffron-600">{tc('viewAll')} <ArrowRight className="size-4" /></Link>}>
            {t('blog')}
          </SectionTitle>
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <NewsCard key={post.id} post={post} locale={locale} />)}</div>
        </section>
      )}
    </InnerPage>
  )
}
