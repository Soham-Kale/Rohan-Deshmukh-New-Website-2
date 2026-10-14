import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight, Images } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { formatDate, mediaAlt, mediaPosition, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { InnerPage } from '@/components/layout/InnerPage'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { CardSlider, type SlideCard } from '@/components/ui/CardSlider'
import { SectionTabs } from '@/components/ui/SectionTabs'
import { SectionTitle } from '@/components/blog/BlogParts'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

const PATH = '/lokmangal/foundation'

const TEXT = {
  mr: { tabs: 'लोकमंगल फाऊंडेशन विभाग', about: 'माहिती', events: 'कार्यक्रम', projects: 'प्रकल्प', gallery: 'गॅलरी', allEvents: 'सर्व कार्यक्रम', allProjects: 'सर्व प्रकल्प', allPhotos: 'संपूर्ण गॅलरी', eventsIntro: 'लोकमंगल फाऊंडेशनतर्फे आयोजित प्रमुख कार्यक्रम व सोहळे.', projectsIntro: 'ग्रामीण समाजाच्या उन्नतीसाठी फाऊंडेशनचे प्रकल्प — शिक्षण, आरोग्य, पाणी, अन्न आणि रोजगार.', galleryIntro: 'फाऊंडेशनच्या कार्यक्रम व प्रकल्पांतील क्षणचित्रे.', soon: 'माहिती लवकरच उपलब्ध होईल.' },
  en: { tabs: 'Lokmangal Foundation sections', about: 'About', events: 'Events', projects: 'Projects', gallery: 'Gallery', allEvents: 'All events', allProjects: 'All projects', allPhotos: 'Full gallery', eventsIntro: 'Major events and ceremonies organised by Lokmangal Foundation.', projectsIntro: 'Foundation projects for rural upliftment — education, health, water, food and livelihoods.', galleryIntro: 'Moments from the Foundation’s events and projects.', soon: 'Details coming soon.' },
}

const getPage = async (locale: Locale) => {
  const { isEnabled: draft } = await draftMode()
  const res = await (await payload()).find({ collection: 'pages', where: { path: { equals: PATH } }, locale, limit: 1, depth: 2, draft })
  return res.docs[0] ?? null
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const page = await getPage(locale)
  if (!page) return {}
  const img = mediaUrl(page.meta?.image as never) || mediaUrl(page.bannerImage, 'card')
  return { title: page.meta?.title || page.title, description: page.meta?.description || page.subtitle || undefined, openGraph: { images: img ? [img] : undefined } }
}

const viewAll = (href: string, label: string) => (
  <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-saffron-700 hover:text-saffron-600">
    {label} <ArrowRight className="size-4" />
  </Link>
)

/**
 * Lokmangal Foundation: माहिती (the page content edited under Pages in the admin) · कार्यक्रम (Events) ·
 * प्रकल्प (Initiatives) · गॅलरी (Photo albums), with sticky tabs to jump between them.
 */
export default async function FoundationPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPage(locale)
  if (!page) notFound()
  const x = TEXT[locale] ?? TEXT.mr
  const te = await getTranslations('events')
  const p = await payload()
  const [events, initiatives, albums] = await Promise.all([
    p.find({ collection: 'events', limit: 12, locale, depth: 1, sort: '-createdAt' }).then((r) => r.docs),
    p.find({ collection: 'initiatives', limit: 200, locale, depth: 1, sort: 'order' }).then((r) => r.docs),
    p.find({ collection: 'albums', limit: 6, locale, depth: 1, sort: '-date' }).then((r) => r.docs),
  ])

  // माहिती = the page's own text blocks; its project cards are replaced by the live प्रकल्प list below, its call-to-action closes the page
  const blocks = page.layout ?? []
  const about = blocks.filter((b) => b.blockType !== 'cards' && b.blockType !== 'cta')
  const closing = blocks.filter((b) => b.blockType === 'cta')

  const eventCards: SlideCard[] = events.map((e) => ({ href: `/events/${e.slug}`, title: e.title, text: e.description, image: mediaUrl(e.coverImage, 'card'), imageStyle: photoFit(e.coverImage, 2, 0.6) }))
  const projectCards: SlideCard[] = initiatives.map((it) => ({ href: `/social-work/${it.slug}`, title: it.title, text: it.excerpt, image: mediaUrl(it.heroImage, 'card'), imageStyle: photoFit(it.heroImage, 2, 0.6) }))
  const slider = { readMore: te('readMore'), prevLabel: te('prev'), nextLabel: te('next') }

  return (
    <InnerPage path={PATH} locale={locale} title={page.title} subtitle={page.subtitle} image={mediaUrl(page.bannerImage, 'hero')} imagePosition={mediaPosition(page.bannerImage)} sideMenu={false} wide>
      <SectionTabs label={x.tabs} tabs={[{ id: 'about', label: x.about }, { id: 'events', label: x.events }, { id: 'projects', label: x.projects }, { id: 'gallery', label: x.gallery }]} />

      <section id="about" className="scroll-mt-36">
        <PageBlocks blocks={about} />
      </section>

      <section id="events" className="mt-16 scroll-mt-36 md:mt-20">
        <SectionTitle aside={viewAll('/events', x.allEvents)}>{x.events}</SectionTitle>
        <p className="mb-7 mt-3 max-w-3xl text-muted">{x.eventsIntro}</p>
        {eventCards.length ? <CardSlider cards={eventCards} {...slider} /> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">{x.soon}</p>}
      </section>

      <section id="projects" className="mt-16 scroll-mt-36 md:mt-20">
        <SectionTitle aside={viewAll('/social-work', x.allProjects)}>{x.projects}</SectionTitle>
        <p className="mb-7 mt-3 max-w-3xl text-muted">{x.projectsIntro}</p>
        {projectCards.length ? <CardSlider cards={projectCards} {...slider} /> : <p className="rounded-2xl bg-cream p-8 text-center text-muted">{x.soon}</p>}
      </section>

      <section id="gallery" className="mt-16 scroll-mt-36 md:mt-20">
        <SectionTitle aside={viewAll('/media/photos', x.allPhotos)}>{x.gallery}</SectionTitle>
        <p className="mb-7 mt-3 max-w-3xl text-muted">{x.galleryIntro}</p>
        {albums.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => {
              const cover = mediaUrl(a.cover, 'card') || mediaUrl(a.photos?.[0] as never, 'card')
              return (
                <Link key={a.id} href={`/media/photos/${a.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                    {cover && <Image src={cover} alt={mediaAlt(a.cover, a.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(a.cover, 4 / 3, 0.6)} />}
                    <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-charcoal-900/85 px-3 py-1 text-sm text-white backdrop-blur">
                      <Images className="size-4" /> {a.photos?.length ?? 0}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg text-charcoal-900 group-hover:text-saffron-700">{a.title}</h3>
                  {a.date && <p className="text-sm text-muted">{formatDate(a.date, locale)}</p>}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="rounded-2xl bg-cream p-8 text-center text-muted">{x.soon}</p>
        )}
      </section>

      {closing.length > 0 && (
        <div className="mt-16 md:mt-20">
          <PageBlocks blocks={closing} />
        </div>
      )}
    </InnerPage>
  )
}
