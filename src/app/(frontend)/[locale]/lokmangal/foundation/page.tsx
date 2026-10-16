import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { mediaAlt, mediaPosition, mediaUrl, photoFit } from '@/lib/utils'
import { INITIATIVE_CATEGORIES } from '@/collections/Content'
import { Link } from '@/i18n/navigation'
import { InnerPage } from '@/components/layout/InnerPage'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { CardSlider, type SlideCard } from '@/components/ui/CardSlider'
import { SectionTabs } from '@/components/ui/SectionTabs'
import { SectionTitle } from '@/components/blog/BlogParts'
import { ProjectsExplorer, type ProjectCard } from '@/components/social/ProjectsExplorer'

export const revalidate = 300
type P = { params: Promise<{ locale: Locale }> }

const PATH = '/lokmangal/foundation'

const TEXT = {
  mr: {
    tabs: 'लोकमंगल फाऊंडेशन विभाग', about: 'माहिती', events: 'कार्यक्रम', projects: 'प्रकल्प', allEvents: 'सर्व कार्यक्रम', eventsIntro: 'लोकमंगल फाऊंडेशनतर्फे आयोजित प्रमुख कार्यक्रम व सोहळे.', soon: 'माहिती लवकरच उपलब्ध होईल.', youth: 'युवा व शिक्षण', sports: 'क्रीडा', other: 'इतर कार्यक्रम',
    projectsEyebrow: 'सर्व प्रकल्प', projectsHeading: (n: string) => `सर्व ${n} सामाजिक उपक्रम`, projectsIntro: 'विषयानुसार निवडा किंवा थेट शोधून प्रत्येक उपक्रमाची सविस्तर माहिती जाणून घ्या.',
    explorer: { all: 'सर्व उपक्रम', search: 'उपक्रम शोधा...', readMore: 'अधिक वाचा', details: 'सविस्तर माहिती', empty: 'या शोधाशी जुळणारा उपक्रम आढळला नाही.', clear: 'सर्व उपक्रम दाखवा', filters: 'विषयानुसार उपक्रम', featured: 'मुख्य उपक्रम', prev: 'मागील', next: 'पुढील', slide: 'उपक्रम' },
  },
  en: {
    tabs: 'Lokmangal Foundation sections', about: 'About', events: 'Events', projects: 'Projects', allEvents: 'All events', eventsIntro: 'Major events and ceremonies organised by Lokmangal Foundation.', soon: 'Details coming soon.', youth: 'Youth & Education', sports: 'Sports', other: 'Other events',
    projectsEyebrow: 'All Projects', projectsHeading: (n: string) => `Explore All ${n} Social Initiatives`, projectsIntro: 'Lokmangal Foundation works to improve the quality of life of people in rural areas. Pick a theme or search to read about each initiative in detail.',
    explorer: { all: 'All Projects', search: 'Search initiatives...', readMore: 'Read More', details: 'View details', empty: 'No initiative matches your search.', clear: 'Show all initiatives', filters: 'Initiatives by theme', featured: 'Main initiatives', prev: 'Previous', next: 'Next', slide: 'Initiative' },
  },
}

const DEV = '०१२३४५६७८९'
const catLabel = (v: string, locale: Locale) => {
  const [mr, en] = (INITIATIVE_CATEGORIES.find((c) => c.value === v)?.label ?? v).split(' / ')
  return locale === 'mr' ? mr : (en ?? mr)
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
 * प्रकल्प (Initiatives), with sticky tabs to jump between them.
 */
export default async function FoundationPage({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPage(locale)
  if (!page) notFound()
  const x = TEXT[locale] ?? TEXT.mr
  const te = await getTranslations('events')
  const p = await payload()
  const [events, initiatives] = await Promise.all([
    p.find({ collection: 'events', limit: 50, locale, depth: 1, sort: 'createdAt' }).then((r) => r.docs),
    p.find({ collection: 'initiatives', limit: 200, locale, depth: 1, sort: 'order' }).then((r) => r.docs),
  ])

  // माहिती = the page's own blocks (edited under Pages in the admin); its call-to-action closes the page
  const blocks = page.layout ?? []
  const about = blocks.filter((b) => b.blockType !== 'cta')
  const closing = blocks.filter((b) => b.blockType === 'cta')

  const toCard = (e: (typeof events)[number]): SlideCard => ({ href: `/events/${e.slug}`, title: e.title, meta: e.tagline, text: e.body || e.description, image: mediaUrl(e.coverImage, 'card'), imageStyle: photoFit(e.coverImage, 2, 0.6) })
  // events grouped as in the client document: Youth & Education, Sports, then any others
  const eventGroups = [
    { label: x.youth, cards: events.filter((e) => e.group === 'youth').map(toCard) },
    { label: x.sports, cards: events.filter((e) => e.group === 'sports').map(toCard) },
    { label: x.other, cards: events.filter((e) => !e.group).map(toCard) },
  ].filter((g) => g.cards.length)
  const projectCards: ProjectCard[] = initiatives.map((it) => ({
    id: it.id, href: `/social-work/${it.slug}`, title: it.title, category: it.category, categoryLabel: catLabel(it.category, locale), featured: it.featured,
    stat: it.stat, text: it.excerpt, image: mediaUrl(it.heroImage, 'card'), imageAlt: mediaAlt(it.heroImage, it.title), imageStyle: photoFit(it.heroImage, 1.6, 0.6),
  }))
  const projectCategories = INITIATIVE_CATEGORIES.map((c) => ({ value: c.value, label: catLabel(c.value, locale) }))
  const total = locale === 'mr' ? String(projectCards.length).replace(/\d/g, (d) => DEV[Number(d)]) : String(projectCards.length)
  const slider = { readMore: te('readMore'), prevLabel: te('prev'), nextLabel: te('next') }

  return (
    <InnerPage path={PATH} locale={locale} title={page.title} subtitle={page.subtitle} image={mediaUrl(page.bannerImage, 'hero')} imagePosition={mediaPosition(page.bannerImage)}>
      <SectionTabs label={x.tabs} tabs={[{ id: 'about', label: x.about }, { id: 'events', label: x.events }, { id: 'projects', label: x.projects }]} />

      <section id="about" className="scroll-mt-36">
        <PageBlocks blocks={about} />
      </section>

      <section id="events" className="mt-20 scroll-mt-36 md:mt-28">
        <SectionTitle aside={viewAll('/events', x.allEvents)}>{x.events}</SectionTitle>
        <p className="lead mb-9 mt-4 max-w-3xl">{x.eventsIntro}</p>
        {eventGroups.length ? (
          <div className="space-y-14">
            {eventGroups.map((g) => (
              <div key={g.label}>
                {eventGroups.length > 1 && <h3 className="mb-6 text-[1.25rem] font-semibold text-charcoal-900 md:text-[1.4rem]">{g.label}</h3>}
                <CardSlider cards={g.cards} {...slider} />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-cream p-8 text-center text-muted">{x.soon}</p>
        )}
      </section>

      <section id="projects" className="mt-20 scroll-mt-36 md:mt-28">
        {/* same layout as lokmangalfoundation.com/projects → "Explore all 23 social initiatives" */}
        <div className="section band-cream relative left-1/2 w-screen -translate-x-1/2">
          <div className="container-x">
            <div className="section-head is-center">
              <p className="eyebrow justify-center">{x.projectsEyebrow}</p>
              <h2 className="h-section">{x.projectsHeading(total)}</h2>
              <p className="lead">{x.projectsIntro}</p>
            </div>
            {projectCards.length ? (
              <ProjectsExplorer items={projectCards} categories={projectCategories} labels={x.explorer} locale={locale} />
            ) : (
              <p className="rounded-2xl bg-cream p-8 text-center text-muted">{x.soon}</p>
            )}
          </div>
        </div>
      </section>


      {closing.length > 0 && (
        <div className="mt-20 md:mt-28">
          <PageBlocks blocks={closing} />
        </div>
      )}
    </InnerPage>
  )
}
