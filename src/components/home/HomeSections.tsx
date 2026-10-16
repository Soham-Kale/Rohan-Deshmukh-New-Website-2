import type React from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays, Camera, Flag, Heart, Info, Leaf, PenLine, Phone, User, Video, Vote,
} from 'lucide-react'
import type { Home, Post, Video as VideoDoc } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { cn, formatDate, mediaAlt, mediaPosition, mediaSize, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { CMSLink } from '../ui/CMSLink'
import { Section, SectionHead } from '../ui/Section'
import { RichText } from '../ui/RichText'
import { YouTube } from '../ui/YouTube'
import { HeroSlider } from './HeroSlider'
import { LatestList, LeadStory } from '../blog/BlogParts'
import { FaqAccordion } from './FaqAccordion'
import { Marquee } from './Marquee'
import { InstagramEmbeds } from './InstagramEmbeds'
import { CountUp } from '@/components/ui/CountUp'

type Block = NonNullable<Home['sections']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>

const icons = { user: User, heart: Heart, book: BookOpen, camera: Camera, video: Video, vote: Vote, pen: PenLine, phone: Phone, info: Info, flag: Flag, leaf: Leaf, award: Award }

export async function HomeSections({ sections, locale }: { sections: Block[]; locale: Locale }) {
  const visible = sections.filter((s) => !s.hidden)
  return (
    <>
      {visible.map((b, i) => {
        const key = b.id ?? i
        switch (b.blockType) {
          case 'heroSlider': return <Hero key={key} b={b} />
          case 'quickLinks': return <QuickLinksSection key={key} b={b} />
          case 'aboutIntro': return <AboutIntroSection key={key} b={b} />
          case 'homeJourney': return <JourneySection key={key} b={b} locale={locale} />
          case 'family': return <FamilySection key={key} b={b} />
          case 'homeParivar': return <ParivarSection key={key} b={b} />
          case 'homeHighlights': return <HighlightsSection key={key} b={b} />
          case 'homeEvents': return <EventsSection key={key} b={b} locale={locale} />
          case 'homeVision': return <VisionSection key={key} b={b} />
          case 'homeGallery': return <GallerySection key={key} b={b} />
          case 'biography': return <BiographySection key={key} b={b} />
          case 'featuredVideo': return <FeaturedVideoSection key={key} b={b} />
          case 'workHighlights': return <WorkHighlightsSection key={key} b={b} />
          case 'initiativesShowcase': return <InitiativesSection key={key} b={b} locale={locale} />
          case 'homeStats': return <StatsSection key={key} b={b} />
          case 'homeFaq': return <FaqSection key={key} b={b} />
          case 'latestBlog': return <BlogSection key={key} b={b} locale={locale} />
          case 'socialFeeds': return <SocialSection key={key} b={b} locale={locale} />
          case 'appealBand': return <AppealSection key={key} b={b} locale={locale} />
          default: return null
        }
      })}
    </>
  )
}

function Hero({ b }: { b: Of<'heroSlider'> }) {
  const slides = (b.slides ?? [])
    .map((s) => ({
      image: mediaUrl(s.image, 'hero') ?? '',
      position: mediaPosition(s.image),
      mobileImage: mediaUrl(s.imageMobile, 'card'),
      mobilePosition: mediaPosition(s.imageMobile),
      ratio: mediaSize(s.image).width / mediaSize(s.image).height,
      mobileRatio: mediaUrl(s.imageMobile, 'card') ? mediaSize(s.imageMobile).width / mediaSize(s.imageMobile).height : undefined,
      alt: mediaAlt(s.image, s.heading ?? ''),
      kicker: s.kicker,
      heading: s.heading,
      subheading: s.subheading,
      buttons: s.buttons ?? [],
    }))
    .filter((s) => s.image)
  if (!slides.length) return null
  return <HeroSlider slides={slides} autoplay={b.autoplaySeconds ?? 5} />
}

function QuickLinksSection({ b }: { b: Of<'quickLinks'> }) {
  if (!b.items?.length) return null
  return (
    <section className="border-b border-line bg-white">
      <div className="container-x">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-line">
          {b.items.map((it) => {
            const Icon = icons[(it.icon as keyof typeof icons) ?? 'info'] ?? Info
            return (
              <li key={it.id}>
                <CMSLink url={it.url} newTab={it.newTab} className="group flex h-full flex-col items-center gap-3 px-3 py-7 text-center">
                  <Icon className="size-7 text-saffron-600 transition group-hover:-translate-y-0.5" strokeWidth={1.6} />
                  <span className="text-[0.98rem] font-semibold leading-snug text-charcoal-900 transition group-hover:text-saffron-700">{it.label}</span>
                </CMSLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="stat-item">
      <p className="stat-value"><CountUp value={value} /></p>
      <p className="stat-label">{label}</p>
    </div>
  )
}

function AboutIntroSection({ b }: { b: Of<'aboutIntro'> }) {
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="section">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
        {img && (
          /* portrait on a soft saffron block, slightly offset — warmer than an outlined frame */
          <div className="photo-backdrop mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream shadow-[0_30px_60px_-40px_rgb(28_32_38/0.55)]">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" style={photoFit(b.image, 0.8)} />
            </div>
          </div>
        )}
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {/* tagline right under the name, then the description */}
          {b.pledge && <p className="mt-3 font-display text-xl leading-snug text-saffron-700 md:text-2xl">{b.pledge}</p>}
          {b.text && <p className="lead mt-6 md:!text-[1.22rem]">{b.text}</p>}
          {/* quick facts (Born, Studied, Leads, Author) as a plain row, separated by thin rules */}
          {!!b.stats?.length && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
              {b.stats.map((f) => (
                <div key={f.id}>
                  <dt className="text-[0.78rem] font-semibold text-saffron-700">{f.label}</dt>
                  <dd className="mt-0.5 font-semibold leading-snug text-charcoal-900">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-dark mt-9">
              {b.buttonLabel} <ArrowRight className="size-4" />
            </CMSLink>
          )}
        </div>
      </div>
    </section>
  )
}

function BiographySection({ b }: { b: Of<'biography'> }) {
  // full-size original: this photo spans the whole width on tablets (the optimiser still sends phones a small copy)
  const img = mediaUrl(b.image)
  return (
    <section className="section band-cream">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.intro && <p className="mt-6 font-display text-2xl leading-relaxed text-charcoal-800">“{b.intro}”</p>}
          {img && (
            /* full photo at its natural shape — never crop portraits */
            <div className="mt-8 overflow-hidden rounded-3xl bg-cream">
              <Image src={img} alt={mediaAlt(b.image)} width={mediaSize(b.image).width} height={mediaSize(b.image).height} sizes="(max-width:1024px) 100vw, 45vw" className="h-auto w-full" />
            </div>
          )}
        </div>
        <ol className="divide-y divide-charcoal-900/10 self-center border-y border-charcoal-900/10">
          {b.items?.map((it, i) => (
            <li key={it.id}>
              <CMSLink url={it.url} className="tile group flex-row gap-6 py-7">
                <span className="font-display text-3xl leading-none text-saffron-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className="tile-title block text-xl">{it.title}</span>
                  <span className="tile-text block">{it.text}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-saffron-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </CMSLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FeaturedVideoSection({ b }: { b: Of<'featuredVideo'> }) {
  return (
    <Section dark eyebrow={b.eyebrow} heading={b.heading} intro={b.text}>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <YouTube url={b.youtubeUrl} title={b.heading} />
        <ul className="divide-y divide-line self-center border-y border-line">
          {b.links?.map((l) => (
            <li key={l.id}>
              <CMSLink url={l.url} newTab={l.newTab} className="tile group flex-row items-center justify-between gap-4 py-5">
                <span>
                  <span className="tile-title block text-xl">{l.label}</span>
                  {l.description && <span className="tile-text block !mt-1 text-sm">{l.description}</span>}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-saffron-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </CMSLink>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function WorkHighlightsSection({ b }: { b: Of<'workHighlights'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading}>
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {b.items?.map((it, i) => {
          const img = mediaUrl(it.image, 'card')
          return (
            <CMSLink key={it.id} url={it.url} className={cn('tile group', i === 0 && 'lg:col-span-2 lg:row-span-2')}>
              {img && (
                <div className={cn('tile-media', i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]')}>
                  <Image src={img} alt={mediaAlt(it.image, it.title ?? '')} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" style={photoFit(it.image, 1.6)} />
                </div>
              )}
              <div className="tile-body">
                <h3 className={cn('tile-title', i === 0 && 'text-2xl md:text-3xl')}>{it.title}</h3>
                {it.text && <p className="tile-text line-clamp-3">{it.text}</p>}
              </div>
            </CMSLink>
          )
        })}
      </div>
    </Section>
  )
}

/**
 * Home → Lokmangal Foundation: the Foundation's own introduction ("आजची सेवा, उद्याची समृद्धी") and a Read more button
 * (the key areas of work stay on the Foundation page). The text is read from the Lokmangal Foundation page, so editing it there updates both places.
 */
async function InitiativesSection({ b, locale }: { b: Of<'initiativesShowcase'>; locale: Locale }) {
  const t = await getTranslations('common')
  const p = await payload()
  const page = (await p.find({ collection: 'pages', where: { path: { equals: '/lokmangal/foundation' } }, limit: 1, depth: 1, locale })).docs[0]
  const blocks = page?.layout ?? []
  const intro = blocks.find((x) => x.blockType === 'mediaText') as Extract<NonNullable<typeof blocks>[number], { blockType: 'mediaText' }> | undefined
  if (!intro) return null
  const img = mediaUrl(intro.image, 'card')
  const more = b.buttonUrl || '/lokmangal/foundation'
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {img && (
            /* the Foundation at work, on a soft saffron block */
            <div className="photo-backdrop mx-auto w-full max-w-xl lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cream shadow-[0_30px_60px_-40px_rgb(28_32_38/0.55)]">
                <Image src={img} alt={mediaAlt(intro.image, intro.heading ?? '')} fill sizes="(max-width:1024px) 90vw, 46vw" className="object-cover" style={photoFit(intro.image, 4 / 3)} />
              </div>
            </div>
          )}
          <div>
            {(b.eyebrow || intro.eyebrow) && <p className="eyebrow">{b.eyebrow || intro.eyebrow}</p>}
            {intro.heading && <h2 className="h-section">{intro.heading}</h2>}
            <RichText data={intro.body} className="mt-6 text-muted" />
            <CMSLink url={more} className="btn btn-primary mt-8">{t('readMore')} <ArrowRight className="size-4" /></CMSLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** "More →" text link used beside section headings */
function MoreLink({ url, label, dark }: { url?: string | null; label?: string | null; dark?: boolean }) {
  if (!url || !label) return null
  return (
    <CMSLink url={url} className={cn('more-link shrink-0', dark && 'text-highlight')}>
      {label} <ArrowRight className="size-4" />
    </CMSLink>
  )
}

const DEV = '०१२३४५६७८९'
const digits = (n: number, locale: Locale) => (locale === 'mr' ? String(n).replace(/\d/g, (d) => DEV[Number(d)]) : String(n))

function JourneySection({ b, locale }: { b: Of<'homeJourney'>; locale: Locale }) {
  const items = b.items ?? []
  if (!items.length) return null
  return (
    <section className="section band-cream">
      <div className="container-x">
        <div className="section-head-row">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} />
          <MoreLink url={b.buttonUrl} label={b.buttonLabel} />
        </div>
        {/* one route from school to home again: a line through numbered stops (vertical on phones) */}
        <ol className="relative grid gap-10 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ '--n': items.length } as React.CSSProperties}>
          <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-saffron-300 md:bottom-auto md:left-5 md:right-0 md:top-5 md:h-px md:w-auto" />
          {items.map((it, i) => {
            const last = i === items.length - 1
            return (
              <li key={it.id} className="relative pl-16 md:pl-0">
                <span className={cn('absolute left-0 top-0 grid size-10 place-items-center rounded-full font-semibold ring-[6px] ring-cream md:relative', last ? 'bg-saffron-500 text-white' : 'bg-charcoal-900 text-saffron-300')}>{digits(i + 1, locale)}</span>
                <div className="md:mt-6 md:pr-2">
                  {it.place && <p className="tile-kicker">{it.place}</p>}
                  {it.title && <h3 className="mt-1.5 text-[1.2rem] leading-snug text-charcoal-900">{it.title}</h3>}
                  {it.text && <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{it.text}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function FamilySection({ b }: { b: Of<'family'> }) {
  const members = b.members ?? []
  if (!members.length) return null
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.intro} action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      {/* three generations side by side: a proper portrait each, then relation, name and a few words */}
      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {members.map((m) => {
          const img = mediaUrl(m.image, 'card')
          return (
            <li key={m.id} className="tile group max-sm:grid max-sm:grid-cols-[7.5rem_minmax(0,1fr)] max-sm:items-start max-sm:gap-5">
              <div className="tile-media aspect-[4/5] bg-cream">
                {img && <Image src={img} alt={mediaAlt(m.image, m.name ?? '')} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" style={photoFit(m.image, 0.8, 0.55)} />}
                {m.relation && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.85rem] text-saffron-700 shadow-sm max-sm:hidden">{m.relation}</span>}
              </div>
              <div className="tile-body max-sm:!pt-1">
                {m.relation && <p className="tile-kicker mb-1 sm:hidden">{m.relation}</p>}
                {m.name && <h3 className="tile-title">{m.name}</h3>}
                {m.text && <p className="tile-text">{m.text}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function ParivarSection({ b }: { b: Of<'homeParivar'> }) {
  return (
    <section className="section relative overflow-hidden">
      <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full border-[40px] border-saffron-500/[0.06]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.text && <p className="mt-5 font-display text-[1.35rem] leading-[1.6] text-charcoal-900 md:text-[1.6rem]">{b.text}</p>}
          {b.buttonUrl && <div className="mt-8"><MoreLink url={b.buttonUrl} label={b.buttonLabel} /></div>}
        </div>
        {/* the one place the numbers earn a soft raised card */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {b.items?.map((g) => (
            <li key={g.id} className="stat-card">
              <p className="stat-value">{g.value}</p>
              {g.title && <p className="mt-2 leading-snug text-charcoal-900">{g.title}</p>}
              {g.text && <p className="mt-0.5 text-sm leading-snug text-muted">{g.text}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HighlightsSection({ b }: { b: Of<'homeHighlights'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.text} className="band-cream" action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      {/* chapters of the political journey: numbered columns under one shared rule */}
      <ol className="grid gap-10 border-t border-charcoal-900/15 md:grid-cols-3 md:gap-12">
        {b.items?.map((c, i) => (
          <li key={c.id}>
            <CMSLink url={c.url || b.buttonUrl || '#'} className="tile group h-full pt-7">
              <span aria-hidden className="absolute -top-px left-0 h-[3px] w-14 bg-saffron-500 transition-all duration-300 group-hover:w-24" />
              <span className="font-display text-sm text-saffron-700">{String(i + 1).padStart(2, '0')}{c.tag && <span className="text-muted"> · {c.tag}</span>}</span>
              {c.title && <h3 className="tile-title mt-3 text-[1.3rem]">{c.title}</h3>}
              {c.text && <p className="tile-text">{c.text}</p>}
            </CMSLink>
          </li>
        ))}
      </ol>
    </Section>
  )
}

const GROUP: Record<string, Record<string, string>> = { mr: { youth: 'युवा व शिक्षण', sports: 'क्रीडा' }, en: { youth: 'Youth & Education', sports: 'Sports' } }

async function EventsSection({ b, locale }: { b: Of<'homeEvents'>; locale: Locale }) {
  const p = await payload()
  // the events from the client document first (youth & education, sports), then any others
  const all = (await p.find({ collection: 'events', limit: 50, sort: 'createdAt', locale, depth: 1 })).docs
  const ordered = [...all.filter((e) => e.group === 'youth'), ...all.filter((e) => e.group === 'sports'), ...all.filter((e) => !e.group)]
  const events = ordered.slice(0, b.limit ?? 4)
  if (!events.length) return null
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      <ul className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((e) => {
          const img = mediaUrl(e.coverImage, 'card')
          const meta = e.group ? GROUP[locale]?.[e.group] : null
          return (
            <li key={e.id}>
              <Link href={`/events/${e.slug}`} className="tile group h-full">
                <div className="tile-media grid aspect-[4/3] place-items-center">
                  {img ? (
                    <Image src={img} alt={mediaAlt(e.coverImage, e.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover" style={photoFit(e.coverImage, 4 / 3, 0.6)} />
                  ) : (
                    <CalendarDays aria-hidden className="size-9 text-saffron-600" strokeWidth={1.5} />
                  )}
                </div>
                <div className="tile-body">
                  {meta && <p className="tile-kicker">{meta}</p>}
                  <h3 className="tile-title mt-1 line-clamp-2">{e.title}</h3>
                  {e.tagline && <p className="tile-text line-clamp-2">{e.tagline}</p>}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function VisionSection({ b }: { b: Of<'homeVision'> }) {
  const img = mediaUrl(b.image)
  return (
    <section className="section band-cream relative overflow-hidden">
      <div aria-hidden className="absolute -bottom-28 -left-24 size-96 rounded-full border-[40px] border-saffron-500/10" />
      <div className="container-x relative grid items-center gap-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20">
        <div className="flex justify-center">
          {img ? (
            /* the book cover at its own shape, tilted slightly like a book on a shelf */
            <div className="relative w-52 -rotate-2 transition duration-500 hover:rotate-0 sm:w-60 md:w-64 lg:w-72">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} width={mediaSize(b.image).width} height={mediaSize(b.image).height} sizes="(max-width:768px) 240px, 288px" className="h-auto w-full rounded-md shadow-[18px_26px_50px_-18px_rgb(28_32_38/0.55)] ring-1 ring-charcoal-900/10" />
            </div>
          ) : (
            <BookOpen className="size-24 text-saffron-600" />
          )}
        </div>
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="lead mt-5">{b.text}</p>}
          {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn btn-primary mt-9">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
        </div>
      </div>
    </section>
  )
}

function GallerySection({ b }: { b: Of<'homeGallery'> }) {
  const images = (b.images ?? []).filter((m) => typeof m === 'object').slice(0, 9)
  if (!images.length) return null
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((m, i) => {
          const src = mediaUrl(m as never, 'card')
          if (!src) return null
          return (
            <li key={(m as { id: number }).id ?? i} className={cn('relative aspect-square overflow-hidden rounded-2xl bg-cream', i === 0 && 'col-span-2 row-span-2 aspect-auto sm:col-span-1 sm:row-span-1 sm:aspect-square lg:col-span-2 lg:row-span-2 lg:aspect-auto')}>
              <Image src={src} alt={mediaAlt(m as never, b.heading ?? '')} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition duration-700 hover:scale-105" style={photoFit(m as never, 1, 0.5)} />
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function StatsSection({ b }: { b: Of<'homeStats'> }) {
  const img = mediaUrl(b.image, 'hero')
  return (
    <section className="section band-cream relative overflow-hidden">
      {/* the photo stays, faded right back into the warm band so the numbers read cleanly */}
      {img && (
        <>
          <Image src={img} alt="" fill sizes="100vw" className="object-cover opacity-[0.12] grayscale" style={{ objectPosition: mediaPosition(b.image) }} />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/60" />
        </>
      )}
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-primary mt-8">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {b.items?.map((s) => <div key={s.id} className="stat-card"><p className="stat-value"><CountUp value={s.value} /></p><p className="stat-label">{s.label}</p></div>)}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ b }: { b: Of<'homeFaq'> }) {
  return (
    <Section className="band-cream">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="lead mt-4">{b.text}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {b.buttons?.map((l, i) => (
              <CMSLink key={l.id} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-ghost text-charcoal-900')}>{l.label}</CMSLink>
            ))}
          </div>
        </div>
        <FaqAccordion items={(b.items ?? []).map((f) => ({ q: f.question, a: <RichText data={f.answer} className="!text-base !text-muted" /> }))} />
      </div>
    </Section>
  )
}

async function BlogSection({ b, locale }: { b: Of<'latestBlog'>; locale: Locale }) {
  const p = await payload()
  const t = await getTranslations('common')
  const tb = await getTranslations('blog')
  // newspaper layout: one lead story + a list of the next ones
  const posts = (await p.find({ collection: 'posts', limit: Math.max(4, (b.limit ?? 3) + 1), sort: '-publishedAt', locale, depth: 1, where: { _status: { equals: 'published' } } })).docs as Post[]
  if (!posts.length) return null
  const [lead, ...rest] = posts
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<Link href="/blog" className="more-link">{t('viewAll')} <ArrowRight className="size-4" /></Link>}>
      <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
        <LeadStory post={lead} locale={locale} badge={tb('lead')} readFull={tb('readFull')} />
        {rest.length > 0 && <LatestList posts={rest.slice(0, 4)} locale={locale} title={tb('latestUpdates')} />}
      </div>
    </Section>
  )
}

export function PostCard({ post, locale }: { post: Post; locale: string }) {
  const img = mediaUrl(post.coverImage, 'card')
  return (
    <Link href={`/blog/${post.slug}`} className="tile group">
      <div className="tile-media aspect-[16/10]">
        {img && <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" style={photoFit(post.coverImage, 1.6)} />}
      </div>
      <div className="tile-body">
        <p className="text-sm text-muted">{formatDate(post.publishedAt, locale)} · {post.author}</p>
        <h3 className="tile-title mt-2 line-clamp-3 text-xl">{post.title}</h3>
        {post.excerpt && <p className="tile-text line-clamp-3">{post.excerpt}</p>}
      </div>
    </Link>
  )
}

async function SocialSection({ b, locale }: { b: Of<'socialFeeds'>; locale: Locale }) {
  const p = await payload()
  const settings = await p.findGlobal({ slug: 'site-settings', locale })
  const videos = b.showYoutube ? ((await p.find({ collection: 'videos', limit: 3, sort: '-publishedAt', locale })).docs as VideoDoc[]) : []
  const fb = settings.social?.facebook
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.text} className="band-cream"
      action={
        <div className="flex flex-wrap gap-3">
          {settings.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noopener" className="btn btn-dark">Instagram <ArrowUpRight className="size-4" /></a>}
          {fb && <a href={fb} target="_blank" rel="noopener" className="btn btn-ghost text-charcoal-900">Facebook <ArrowUpRight className="size-4" /></a>}
        </div>
      }>
      {!!b.instagramPosts?.length && <InstagramEmbeds urls={b.instagramPosts.map((x) => ({ url: x.url, title: x.title ?? '' }))} />}
      <div className={cn('mt-8 grid gap-8', fb && b.showFacebook ? 'lg:grid-cols-[1fr_380px]' : '')}>
        {videos.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {videos.slice(0, 2).map((v) => <YouTube key={v.id} url={v.youtubeUrl} title={v.title} />)}
            <Link href="/media/videos" className="btn btn-dark self-start sm:col-span-2 sm:justify-self-start">YouTube <ArrowRight className="size-4" /></Link>
          </div>
        )}
        {fb && b.showFacebook && (
          <div className="overflow-hidden rounded-2xl bg-white">
            <iframe
              title="Facebook"
              loading="lazy"
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(fb)}&tabs=timeline&width=380&height=520&small_header=true&hide_cover=false&show_facepile=false`}
              width="100%"
              height="520"
              style={{ border: 0 }}
              allow="encrypted-media"
            />
          </div>
        )}
      </div>
    </Section>
  )
}

async function AppealSection({ b, locale }: { b: Of<'appealBand'>; locale: Locale }) {
  const settings = b.showWhatsapp ? await (await payload()).findGlobal({ slug: 'site-settings', locale, depth: 0 }) : null
  const wa = settings?.whatsappNumber?.replace(/\D/g, '')
  return (
    /* the page closes with one clear call to action on saffron */
    <section className="relative isolate overflow-hidden bg-saffron-600 text-white">
      <div aria-hidden className="absolute -right-20 -top-24 -z-10 size-80 rounded-full border-[40px] border-white/10" />
      <div className="container-x flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          {b.eyebrow && <p className="text-white/85">{b.eyebrow}</p>}
          {b.heading && <h2 className="mt-1 text-[1.8rem] leading-tight text-white md:text-[2.4rem]">{b.heading}</h2>}
          {b.text && <p className="mt-3 text-lg text-white/90">{b.text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn bg-white px-6 py-3 text-charcoal-900 hover:bg-saffron-50">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="btn btn-ghost px-6 py-3 text-white">WhatsApp <ArrowUpRight className="size-4" /></a>}
        </div>
      </div>
    </section>
  )
}

