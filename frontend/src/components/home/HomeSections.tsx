import { ArrowRight, ArrowUpRight, Award, CircleArrowRight, Quote, BookOpen, CalendarDays, Camera, Flag, GraduationCap, HandHeart, Heart, Info, Leaf, Medal, PenLine, Phone, User, Video, Vote } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Event, Home, Page, Post, Video as VideoDoc } from '@/types/cms'
import { useLayout } from '@/lib/layout'
import { LOCALE, useTranslations, type Locale } from '@/lib/i18n'
import { mediaAlt, mediaPosition, mediaSize, mediaUrl, photoFit } from '@/lib/media'
import { cn } from '@/lib/utils'
import { CMSLink } from '../ui/CMSLink'
import { CountUp } from '../ui/CountUp'
import { Img } from '../ui/Img'
import { RichText } from '../ui/RichText'
import { Section } from '../ui/Section'
import { socialLabels } from '@/lib/social'
import { YouTube } from '../ui/YouTube'
import { LatestList, LeadStory } from '../blog/BlogParts'
import { FaqAccordion } from './FaqAccordion'
import { HeroSlider } from './HeroSlider'
import { InstagramReels } from './InstagramReels'
import { Reveal, Stagger, StaggerItem } from '../ui/Motion'

type Block = NonNullable<Home['sections']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>

/** Extra content some homepage sections show (loaded together with the homepage, see pages/Home.tsx) */
export type HomeExtras = { events: Event[]; posts: Post[]; foundationPage: Page | null; videos: VideoDoc[]; ticker?: TickerItem[] }
export type TickerItem = { label: string; url: string }

const icons = { user: User, heart: Heart, book: BookOpen, camera: Camera, video: Video, vote: Vote, pen: PenLine, phone: Phone, info: Info, flag: Flag, leaf: Leaf, award: Award }

/** The homepage: the sections edited under Homepage in the admin, in their order, minus the hidden ones */
export function HomeSections({ sections, extras, locale = LOCALE }: { sections: Block[]; extras: HomeExtras; locale?: Locale }) {
  const visible = sections.filter((s) => !s.hidden)
  return (
    <>
      {visible.map((b, i) => {
        const key = b.id ?? i
        switch (b.blockType) {
          case 'heroSlider': return <Hero key={key} b={b} ticker={extras.ticker ?? []} />
          case 'quickLinks': return <QuickLinksSection key={key} b={b} />
          case 'aboutIntro': return <AboutIntroSection key={key} b={b} />
          case 'homeJourney': return <JourneySection key={key} b={b} locale={locale} />
          case 'family': return <FamilySection key={key} b={b} />
          case 'homeParivar': return <ParivarSection key={key} b={b} />
          case 'homeHighlights': return <HighlightsSection key={key} b={b} />
          case 'homeEvents': return <EventsSection key={key} b={b} events={extras.events} locale={locale} />
          case 'homeVision': return <VisionSection key={key} b={b} />
          case 'homeGallery': return <GallerySection key={key} b={b} />
          case 'biography': return <BiographySection key={key} b={b} />
          case 'featuredVideo': return <FeaturedVideoSection key={key} b={b} />
          case 'workHighlights': return <WorkHighlightsSection key={key} b={b} />
          case 'initiativesShowcase': return <InitiativesSection key={key} b={b} page={extras.foundationPage} />
          case 'homeStats': return <StatsSection key={key} b={b} />
          case 'homeFaq': return <FaqSection key={key} b={b} />
          case 'latestBlog': return <BlogSection key={key} posts={extras.posts} b={b} locale={locale} />
          case 'socialFeeds': return <SocialSection key={key} b={b} videos={extras.videos} />
          case 'appealBand': return <AppealSection key={key} b={b} />
          default: return null
        }
      })}
    </>
  )
}

/**
 * Hero (official-portal layout, after supriyassule.in): the slideshow, then the engagement bar — one wide card that overlaps the
 * bottom of the slideshow (label, line and quote on the left, the button on the right) — and, joined to its bottom edge, a light
 * news ticker that runs the latest articles and the Lokmangal projects from right to left (like the strip on supriyassule.in).
 */
function Hero({ b, ticker }: { b: Of<'heroSlider'>; ticker: TickerItem[] }) {
  const { settings } = useLayout()
  const t = useTranslations('common')
  const textOnly = b.heroStyle === 'text'
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
    // "Text only" hero style (admin, from the UX pass): the navy band without the photo — slides then need only words
    .filter((s) => (textOnly ? s.heading || s.kicker || s.subheading : s.image))
  if (!slides.length) return null
  const social = (Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id') as [string, string][]).map(([key, url]) => ({ key, url, label: socialLabels[key] ?? key }))
  return (
    <>
      <HeroSlider slides={slides} autoplay={b.autoplaySeconds ?? 5} social={social} textOnly={textOnly} labels={{ prev: t('prev'), next: t('next') }} />
      <section className="container-x relative z-30 -mt-12 md:-mt-14">
        <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(14,30,52,0.12)]">
          <div className="flex flex-col items-start justify-between gap-5 border-t-4 border-saffron-500 bg-white px-6 py-5 md:flex-row md:items-center lg:gap-10 lg:px-8 lg:py-6">
            <div className="flex min-w-0 flex-col gap-1.5 md:flex-1">
              <span className="self-start text-xs font-bold uppercase tracking-wider text-saffron-600">{t('engageEyebrow')}</span>
              <h2 className="text-lg leading-snug text-charcoal-950 lg:text-xl lg:[text-wrap:wrap]">{t('engageText')}</h2>
              <p className="flex gap-2 text-sm leading-relaxed text-gray-600 lg:[text-wrap:wrap]">
                <Quote aria-hidden className="mt-0.5 size-4 shrink-0 rotate-180 fill-saffron-500 text-saffron-500" />
                <span>{t('engageQuote')}</span>
              </p>
            </div>
            <CMSLink url="https://newindiamanifesto.com/apply/founder" newTab className="btn w-full shrink-0 md:w-auto">
              {t('engageButton')} <ArrowRight className="size-5" />
            </CMSLink>
          </div>
          {ticker.length > 0 && <NewsTicker items={ticker} />}
        </div>
      </section>
    </>
  )
}

/**
 * News ticker (after the strip under the hero on supriyassule.in): a light band whose links run slowly from right to left in a
 * loop. It stops while the pointer or keyboard focus is on it; with "reduce motion" it stands still and scrolls sideways by hand.
 * The list is drawn twice so the loop has no gap; the second copy is hidden from screen readers and the keyboard.
 */
function NewsTicker({ items }: { items: TickerItem[] }) {
  const list = (copy: boolean) => (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((it, i) => (
        <li key={`${it.url}-${i}`} className="shrink-0">
          <Link to={it.url} tabIndex={copy ? -1 : undefined} className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-charcoal-900 underline decoration-saffron-300 underline-offset-4 transition-colors hover:text-saffron-700 hover:decoration-saffron-600 md:min-h-10">
            <CircleArrowRight aria-hidden className="size-4 shrink-0 text-saffron-600" />
            {it.label}
          </Link>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="ticker border-t border-saffron-100 bg-saffron-50 px-4 lg:px-6">
      <div className="ticker-track" style={{ ['--ticker-duration' as string]: `${Math.max(30, items.length * 6)}s` }}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  )
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

/**
 * About (official-portal layout, after supriyassule.in): a band about 470px high — the words on the left (eyebrow, name with a short
 * bar, introduction, the pledge as a quote line, two buttons), centred in the band; the portrait on the right, as tall as the band and
 * standing on its bottom edge (no frame, no gap under it).
 */
/** About on phones and tablets: its own portrait of Rohan (frontend/public/images/portraits), shown in a circle */
const MOBILE_PORTRAIT = '/images/portraits/rohan-deshmukh-kurta.webp'

function AboutIntroSection({ b }: { b: Of<'aboutIntro'> }) {
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="overflow-hidden py-12 lg:py-0">
      <div className="container-x grid grid-cols-1 gap-8 lg:min-h-[470px] lg:grid-cols-12 lg:gap-12">
        {/* phones and tablets: a portrait in a circle above the words (as on supriyassule.in) */}
        <div className="mx-auto size-64 overflow-hidden rounded-full bg-gradient-to-b from-white via-cream to-saffron-200 shadow-[0_12px_30px_-12px_rgb(14_30_52/0.35)] ring-4 ring-white sm:size-72 lg:hidden">
          {/* a different portrait from the wide-screen one: the kurta photo, hands folded, framed on the face and shoulders */}
          <img src={MOBILE_PORTRAIT} alt="" width={288} height={288} loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: '50% 12%' }} />
        </div>
        <Reveal className="flex flex-col items-start justify-center gap-4 lg:col-span-7 lg:py-14">
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section sx-bar !mt-0 lg:!text-[2rem] lg:!leading-[2.4rem]">{b.heading}</h2>}
          {b.text && <p className="text-base leading-[1.85] text-gray-700">{b.text}</p>}
          {b.pledge && (
            <blockquote className="font-quote flex gap-3 text-lg leading-relaxed text-charcoal-900 sm:text-xl">
              <Quote aria-hidden className="mt-1 size-6 shrink-0 rotate-180 fill-saffron-500 text-saffron-500" />
              <span>{b.pledge}</span>
            </blockquote>
          )}
          {/* quick facts as small white tiles with a kesariya label */}
          {!!b.stats?.length && (
            <Stagger as="dl" className="grid w-full grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {b.stats.map((f) => (
                <StaggerItem key={f.id} className="rounded-xl border border-saffron-100 bg-white p-3 shadow-sm">
                  <dt className="text-xs font-bold uppercase tracking-wider text-saffron-600">{f.label}</dt>
                  <dd className="mt-1 font-display text-lg font-bold leading-snug text-charcoal-950">{f.value}</dd>
                </StaggerItem>
              ))}
            </Stagger>
          )}
          {b.buttonUrl && (
            <div className="mt-2 flex w-full justify-center lg:justify-start">
              <CMSLink url={b.buttonUrl} className="btn btn-dark">
                {b.buttonLabel} <ArrowRight className="size-5" />
              </CMSLink>
            </div>
          )}
        </Reveal>
        {img && (
          <Reveal className="hidden items-end justify-center lg:col-span-5 lg:flex lg:pt-10" delay={0.1}>
            <Img media={b.image} variant="card" alt={mediaAlt(b.image, b.heading ?? '')} sizes="(max-width:1024px) 80vw, 400px" className="block h-[380px] w-auto max-w-full rounded-t-2xl object-contain object-bottom sm:h-[420px] lg:h-[430px]" />
          </Reveal>
        )}
      </div>
    </section>
  )
}

function BiographySection({ b }: { b: Of<'biography'> }) {
  return (
    <section className="section band-cream">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.intro && <p className="font-quote mt-6 text-2xl leading-relaxed text-charcoal-800">“{b.intro}”</p>}
          {mediaUrl(b.image) && (
            /* full photo at its natural shape — never crop portraits */
            <div className="mt-8 overflow-hidden rounded-3xl bg-cream">
              <Img media={b.image} alt={mediaAlt(b.image)} sizes="(max-width:1024px) 100vw, 45vw" className="h-auto w-full" />
            </div>
          )}
        </div>
        <ol className="divide-y divide-charcoal-900/10 self-center border-y border-charcoal-900/10">
          {b.items?.map((it, i) => (
            <li key={it.id}>
              <CMSLink url={it.url} className="tile group flex-row gap-6 py-7">
                <span className="font-display text-3xl leading-none text-saffron-600">{String(i + 1).padStart(2, '0')}</span>
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

/**
 * Featured video (official-portal layout): the header row — title on the left, the YouTube link on the right — then one white
 * card: the video on the left (thumbnail until it is played), the description on the right.
 */
function FeaturedVideoSection({ b }: { b: Of<'featuredVideo'> }) {
  const links = b.links ?? []
  const [first, ...more] = links
  return (
    <section className="section band-cream">
      <div className="container-x">
        <HeadRow
          eyebrow={b.eyebrow}
          heading={b.heading}
          action={first ? <CMSLink url={first.url} newTab={first.newTab} className="more-link shrink-0">{first.label} <ArrowUpRight className="size-5" /></CMSLink> : null}
        />
        <Reveal className="grid grid-cols-1 overflow-hidden rounded-2xl border border-saffron-100 bg-white shadow-xl lg:grid-cols-12">
          <div className="flex items-center bg-charcoal-950 lg:col-span-8 [&>div]:rounded-none">
            <YouTube url={b.youtubeUrl} title={null} />
          </div>
          <div className="flex flex-col justify-center gap-6 p-6 lg:col-span-4 lg:p-8">
            {b.text && <p className="text-[0.95rem] leading-relaxed text-gray-600">{b.text}</p>}
            {first && (
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <CMSLink url={first.url} newTab={first.newTab} className="btn">{first.label} <ArrowUpRight className="size-5" /></CMSLink>
                {more.map((l, i) => (
                  <CMSLink key={l.id ?? i} url={l.url} newTab={l.newTab} className="btn btn-ghost">{l.label} <ArrowUpRight className="size-5" /></CMSLink>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function WorkHighlightsSection({ b }: { b: Of<'workHighlights'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading}>
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {b.items?.map((it, i) => (
          <CMSLink key={it.id} url={it.url} className={cn('tile group', i === 0 && 'lg:col-span-2 lg:row-span-2')}>
            {mediaUrl(it.image, 'card') && (
              <div className={cn('tile-media', i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]')}>
                <Img media={it.image} variant="card" alt={mediaAlt(it.image, it.title ?? '')} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" style={photoFit(it.image, 1.6)} />
              </div>
            )}
            <div className="tile-body">
              <h3 className={cn('tile-title', i === 0 && 'text-2xl md:text-3xl')}>{it.title}</h3>
              {it.text && <p className="tile-text line-clamp-3">{it.text}</p>}
            </div>
          </CMSLink>
        ))}
      </div>
    </Section>
  )
}

/**
 * Home → Lokmangal Foundation: the Foundation's own introduction ("आजची सेवा, उद्याची समृद्धी") and a Read more button
 * (the key areas of work stay on the Foundation page). The text is read from the Lokmangal Foundation page, so editing it there updates both places.
 */
function InitiativesSection({ b, page }: { b: Of<'initiativesShowcase'>; page: Page | null }) {
  const t = useTranslations('common')
  const intro = (page?.layout ?? []).find((x) => x.blockType === 'mediaText') as Extract<NonNullable<Page['layout']>[number], { blockType: 'mediaText' }> | undefined
  if (!intro) return null
  const more = b.buttonUrl || '/lokmangal/foundation'
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {mediaUrl(intro.image, 'card') && (
            /* the Foundation at work, on a soft saffron block */
            <div className="photo-backdrop mx-auto w-full max-w-xl lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cream shadow-[0_30px_60px_-40px_rgb(20_33_61/0.55)]">
                <Img media={intro.image} variant="card" alt={mediaAlt(intro.image, intro.heading ?? '')} fill sizes="(max-width:1024px) 90vw, 46vw" className="object-cover" style={photoFit(intro.image, 4 / 3)} />
              </div>
            </div>
          )}
          <div>
            {(b.eyebrow || intro.eyebrow) && <p className="eyebrow">{b.eyebrow || intro.eyebrow}</p>}
            {intro.heading && <h2 className="h-section">{intro.heading}</h2>}
            <RichText html={intro.body} className="mt-6 text-muted" />
            <CMSLink url={more} className="btn btn-primary mt-8">{t('readMore')} <ArrowRight className="size-4" /></CMSLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** "More →" text link used beside section headings (Stitch: bold kesariya text with an arrow) */
function MoreLink({ url, label }: { url?: string | null; label?: string | null; dark?: boolean }) {
  if (!url || !label) return null
  return (
    <CMSLink url={url} className="more-link shrink-0">
      {label}
      <ArrowRight className="size-5" />
    </CMSLink>
  )
}

/**
 * Section header (official-portal layout, after supriyassule.in): eyebrow and title on the left with a short kesariya bar under
 * the title, the "View all →" link on the right on the same line. `center` = the title block centred (no link beside it).
 */
function HeadRow({ eyebrow, heading, intro, url, label, center, action }: { eyebrow?: string | null; heading?: string | null; intro?: string | null; url?: string | null; label?: string | null; center?: boolean; action?: ReactNode }) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <Reveal className={cn('sx-head', center && 'is-center')}>
      <div className="sx-head-text">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        {heading && <h2 className="h-section">{heading}</h2>}
        {intro && <p className="lead">{intro}</p>}
      </div>
      {!center && (action ?? <MoreLink url={url} label={label} />)}
    </Reveal>
  )
}

const DEV = '०१२३४५६७८९'
const digits = (n: number, locale: Locale) => (locale === 'mr' ? String(n).replace(/\d/g, (d) => DEV[Number(d)]) : String(n))
const JOURNEY_ICONS = [Medal, Award, GraduationCap, HandHeart]

/**
 * Journey (official-portal layout, after the "Political Journey" timeline on supriyassule.in): a centred heading, then the
 * milestones along one horizontal kesariya line — numbered dots on the line, the milestones above and below it in turn.
 * Phones and tablets get the same milestones down a vertical line. The latest milestone carries a kesariya border.
 */
function JourneySection({ b, locale }: { b: Of<'homeJourney'>; locale: Locale }) {
  const items = b.items ?? []
  if (!items.length) return null
  const num = (i: number) => digits(i + 1, locale).padStart(2, locale === 'mr' ? '०' : '0')
  const card = (it: (typeof items)[number], i: number) => {
    const last = i === items.length - 1
    const [place, sub] = (it.place ?? '').split(/\s+[—–-]\s+/)
    const Icon = JOURNEY_ICONS[i % JOURNEY_ICONS.length]
    return (
      <div className={cn('rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-lg', last ? 'border-2 border-saffron-500' : 'border border-saffron-100')}>
        {place && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-600">{place}</p>}
        {it.title && <h3 className="mb-2 text-lg leading-snug text-charcoal-950">{it.title}</h3>}
        {it.text && <p className="text-sm leading-relaxed text-gray-600">{it.text}</p>}
        {sub && (
          <p className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs font-bold text-charcoal-900">
            <Icon aria-hidden className="size-4 text-saffron-600" /> {sub}
          </p>
        )}
      </div>
    )
  }
  const dot = (i: number) => (
    <span className={cn('relative z-10 grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ring-4 ring-cream', i === items.length - 1 ? 'bg-saffron-600 text-white' : 'border-2 border-saffron-500 bg-white text-saffron-700')}>
      {num(i)}
    </span>
  )
  return (
    <section className="section band-cream">
      <div className="container-x">
        <HeadRow eyebrow={b.eyebrow} heading={b.heading} center />

        {/* wide screens: one horizontal line, milestones above and below it in turn */}
        <div className="relative hidden lg:block">
          <div aria-hidden className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-saffron-200 via-saffron-500 to-leaf-200" />
          <ol className="relative grid gap-x-6" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gridTemplateRows: 'auto auto auto' }}>
            {items.map((it, i) => {
              const up = i % 2 === 0
              return (
                <li key={it.id} className="contents">
                  <div style={{ gridColumn: i + 1, gridRow: up ? 1 : 3 }} className={cn('relative flex flex-col', up ? 'justify-end pb-6' : 'pt-6')}>
                    {/* connector: a short line from the card to its number on the timeline */}
                    <span aria-hidden className={cn('absolute left-1/2 h-6 w-0.5 -translate-x-1/2 bg-saffron-400', up ? 'bottom-0' : 'top-0')} />
                    <Reveal delay={i * 0.08}>{card(it, i)}</Reveal>
                  </div>
                  <div style={{ gridColumn: i + 1, gridRow: 2 }} className="flex justify-center">
                    {dot(i)}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* phones and tablets: the same milestones down a vertical line */}
        <ol className="relative space-y-6 lg:hidden">
          <span aria-hidden className="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-saffron-200 via-saffron-500 to-leaf-200" />
          {items.map((it, i) => (
            <li key={it.id} className="relative flex gap-4">
              {/* connector: a short line from the number to its card */}
              <span aria-hidden className="absolute left-10 top-5 h-0.5 w-4 -translate-y-1/2 bg-saffron-400" />
              {dot(i)}
              <div className="min-w-0 flex-1">{card(it, i)}</div>
            </li>
          ))}
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
        {members.map((m) => (
          <li key={m.id} className="tile group max-sm:grid max-sm:grid-cols-[7.5rem_minmax(0,1fr)] max-sm:items-start max-sm:gap-5">
            <div className="tile-media aspect-[4/5] bg-cream">
              <Img media={m.image} variant="card" alt={mediaAlt(m.image, m.name ?? '')} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" style={photoFit(m.image, 0.8, 0.55)} />
              {m.relation && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.85rem] text-saffron-700 shadow-sm max-sm:hidden">{m.relation}</span>}
            </div>
            <div className="tile-body max-sm:!pt-1">
              {m.relation && <p className="tile-kicker mb-1 sm:hidden">{m.relation}</p>}
              {m.name && <h3 className="tile-title">{m.name}</h3>}
              {m.text && <p className="tile-text">{m.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/**
 * Lokmangal Parivar (official-portal layout, like "Achievements & Awards" on supriyassule.in): the header row — title on the left,
 * "Explore →" on the right — then the groups as one row of equal number tiles with a coloured top bar.
 */
function ParivarSection({ b }: { b: Of<'homeParivar'> }) {
  const bars = ['bg-saffron-500', 'bg-leaf-600', 'bg-charcoal-900', 'bg-saffron-600', 'bg-slate-500']
  const items = b.items ?? []
  return (
    <section className="section">
      <div className="container-x">
        <HeadRow eyebrow={b.eyebrow} heading={b.heading} intro={b.text} url={b.buttonUrl} label={b.buttonLabel} />
        <Stagger as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {items.map((g, i) => (
            <StaggerItem as="li" key={g.id} className={cn('relative flex flex-col overflow-hidden rounded-2xl border border-saffron-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg', i === items.length - 1 && items.length % 2 === 1 && 'col-span-2 md:col-span-1')}>
              <div aria-hidden className={cn('absolute left-0 top-0 h-1.5 w-full', bars[i % bars.length])} />
              <span className="mb-1 block font-display text-3xl font-bold text-charcoal-950 sm:text-4xl">{g.value && <CountUp value={g.value} />}</span>
              {g.title && <span className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">{g.title}</span>}
              {g.text && <p className="mt-3 text-xs text-gray-500">{g.text}</p>}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/**
 * Social activities (official-portal layout, like "Press Note" on supriyassule.in): the header row — title on the left, "View all →"
 * on the right — then one row of equal cards: photo (when there is one), a small label, the title, two lines of text, "Read more".
 */
function HighlightsSection({ b }: { b: Of<'homeHighlights'> }) {
  const t = useTranslations('common')
  const count = b.items?.length ?? 0
  return (
    <section className="section">
      <div className="container-x">
        <HeadRow eyebrow={b.eyebrow} heading={b.heading} intro={b.text} url={b.buttonUrl} label={b.buttonLabel} />
        <Stagger as="ol" className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2', count >= 4 ? 'lg:grid-cols-4' : count === 3 ? 'lg:grid-cols-3' : '')}>
          {b.items?.map((c, i) => {
            const img = mediaUrl(c.image, 'card')
            return (
              <StaggerItem as="li" key={c.id}>
                <CMSLink url={c.url || b.buttonUrl || '#'} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-saffron-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-saffron-500 hover:shadow-lg">
                  {img ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                      <Img media={c.image} variant="card" alt={mediaAlt(c.image, c.title ?? '')} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" style={photoFit(c.image, 1.6)} />
                      {c.tag && <span className="absolute bottom-3 left-3 rounded-md bg-saffron-600 px-2.5 py-1 text-xs font-bold text-white">{c.tag}</span>}
                    </div>
                  ) : (
                    <span aria-hidden className={cn('block h-1.5 w-full', i % 2 ? 'bg-leaf-600' : 'bg-saffron-500')} />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {!img && c.tag && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-saffron-600">{c.tag}</p>}
                    {c.title && <h3 className="mb-2 text-[1.05rem] leading-snug text-charcoal-950 transition-colors group-hover:text-saffron-700">{c.title}</h3>}
                    {c.text && <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{c.text}</p>}
                    <span className="more-link mt-auto pt-4">{t('readMore')} <ArrowRight className="size-4" /></span>
                  </div>
                </CMSLink>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}

const GROUP: Record<string, Record<string, string>> = { mr: { youth: 'युवा व शिक्षण', sports: 'क्रीडा' }, en: { youth: 'Youth & Education', sports: 'Sports' } }

function EventsSection({ b, events: all, locale }: { b: Of<'homeEvents'>; events: Event[]; locale: Locale }) {
  // the events from the client document first (youth & education, sports), then any others
  const ordered = [...all.filter((e) => e.group === 'youth'), ...all.filter((e) => e.group === 'sports'), ...all.filter((e) => !e.group)]
  const events = ordered.slice(0, b.limit ?? 4)
  if (!events.length) return null
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      <ul className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((e) => {
          const meta = e.group ? GROUP[locale]?.[e.group] : null
          return (
            <li key={e.id}>
              <Link to={`/events/${e.slug}`} className="tile group h-full">
                <div className="tile-media grid aspect-[4/3] place-items-center">
                  {mediaUrl(e.coverImage, 'card') ? (
                    <Img media={e.coverImage} variant="card" alt={mediaAlt(e.coverImage, e.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover" style={photoFit(e.coverImage, 4 / 3, 0.6)} />
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

/**
 * Vision (official-portal layout): a deep navy band with a kesariya top edge and soft glows — the eyebrow, heading, text and a
 * kesariya button on the left (centred on phones), the book cover standing straight on the right with a kesariya glow under it (words left, picture right,
 * like the About block above).
 */
function VisionSection({ b }: { b: Of<'homeVision'> }) {
  const img = mediaUrl(b.image)
  return (
    <section className="section on-dark band-navy relative w-full overflow-hidden">
      <div aria-hidden className="glow-tl !right-1/4 !top-0" />
      <div aria-hidden className="glow-br" />
      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="flex flex-col items-start gap-4 lg:col-span-7">
            {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
            {b.heading && <h2 className="h-section sx-bar !text-3xl leading-tight sm:!text-4xl lg:!text-[2.75rem] lg:!leading-[1.15]">{b.heading}</h2>}
            {b.text && <p className="font-quote text-lg leading-relaxed text-slate-200">{b.text}</p>}
            {b.buttonUrl && (
              <div className="mt-2 flex w-full justify-center lg:justify-start">
                <CMSLink url={b.buttonUrl} className="btn px-8">
                  {b.buttonLabel} <ArrowRight className="size-5" />
                </CMSLink>
              </div>
            )}
          </Reveal>
          <Reveal className="flex justify-center lg:col-span-5">
            {img ? (
              <div className="group relative">
                <div className="w-60 overflow-hidden rounded-xl border border-saffron-500/40 shadow-2xl sm:w-72">
                  <Img media={b.image} alt={mediaAlt(b.image, b.heading ?? '')} sizes="288px" className="h-auto w-full" />
                </div>
                <div aria-hidden className="mx-auto mt-2 h-6 w-60 rounded-full bg-saffron-500/30 blur-xl sm:w-72" />
              </div>
            ) : (
              <BookOpen className="size-24 text-saffron-500" />
            )}
          </Reveal>
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
          if (!mediaUrl(m, 'card')) return null
          return (
            <li key={m.id ?? i} className={cn('relative aspect-square overflow-hidden rounded-2xl bg-cream', i === 0 && 'col-span-2 row-span-2 aspect-auto sm:col-span-1 sm:row-span-1 sm:aspect-square lg:col-span-2 lg:row-span-2 lg:aspect-auto')}>
              <Img media={m} variant="card" alt={mediaAlt(m, b.heading ?? '')} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition duration-700 hover:scale-105" style={photoFit(m, 1, 0.5)} />
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function StatsSection({ b }: { b: Of<'homeStats'> }) {
  return (
    <section className="section band-cream relative overflow-hidden">
      {/* the photo stays, faded right back into the warm band so the numbers read cleanly */}
      {mediaUrl(b.image, 'hero') && (
        <>
          <Img media={b.image} variant="hero" alt="" fill sizes="100vw" className="object-cover opacity-[0.12] grayscale" style={{ objectPosition: mediaPosition(b.image) }} />
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
              <CMSLink key={l.id} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-primary' : 'btn-ghost')}>{l.label}</CMSLink>
            ))}
          </div>
        </div>
        <FaqAccordion items={(b.items ?? []).map((f) => ({ q: f.question, a: <RichText html={f.answer} className="!text-base !text-muted" /> }))} />
      </div>
    </Section>
  )
}

function BlogSection({ b, posts, locale }: { b: Of<'latestBlog'>; posts: Post[]; locale: Locale }) {
  const t = useTranslations('common')
  const tb = useTranslations('blog')
  if (!posts.length) return null
  // newspaper layout: one lead story + a list of the next ones
  const [lead, ...rest] = posts
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} action={<Link to="/blog" className="more-link">{t('viewAll')} <ArrowRight className="size-4" /></Link>}>
      <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
        <LeadStory post={lead} locale={locale} badge={tb('lead')} readFull={tb('readFull')} />
        {rest.length > 0 && <LatestList posts={rest.slice(0, 4)} locale={locale} title={tb('latestUpdates')} />}
      </div>
    </Section>
  )
}

/**
 * Reels (official-portal layout, like "Stay connected with …" on supriyassule.in): a centred heading, then the chosen Instagram reels as three tall cards (a swipeable row on
 * phones), each loading only near the screen, and the latest videos / the Facebook page when they are switched on.
 */
function SocialSection({ b, videos: all }: { b: Of<'socialFeeds'>; videos: VideoDoc[] }) {
  const { settings } = useLayout()
  const videos = b.showYoutube ? all.slice(0, 3) : []
  const fb = settings.social?.facebook
  return (
    <section className="section">
      <div className="container-x">
        <HeadRow eyebrow={b.eyebrow} heading={b.heading} intro={b.text} center />
        {!!b.instagramPosts?.length && (
          <Reveal>
            <InstagramReels reels={b.instagramPosts.map((x) => ({ url: x.url, title: x.title ?? '' }))} />
          </Reveal>
        )}
        {(videos.length > 0 || (fb && b.showFacebook)) && (
          <div className={cn('mt-12 grid gap-8', fb && b.showFacebook ? 'lg:grid-cols-[1fr_380px]' : '')}>
            {videos.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {videos.slice(0, 2).map((v) => <YouTube key={v.id} url={v.youtubeUrl} title={v.title} />)}
                <Link to="/media/videos" className="btn btn-dark self-start sm:col-span-2 sm:justify-self-start">YouTube <ArrowRight className="size-4" /></Link>
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
        )}
      </div>
    </section>
  )
}

function AppealSection({ b }: { b: Of<'appealBand'> }) {
  const { settings } = useLayout()
  const wa = b.showWhatsapp ? settings.whatsappNumber?.replace(/\D/g, '') : null
  return (
    /* the page closes with one clear call to action on saffron */
    <section className="on-saffron relative isolate overflow-hidden bg-saffron-600 text-white">
      <div aria-hidden className="absolute -right-20 -top-24 -z-10 size-80 rounded-full border-[40px] border-white/10" />
      <div className="container-x flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          {b.eyebrow && <p className="text-white/85">{b.eyebrow}</p>}
          {b.heading && <h2 className="mt-1 text-[1.8rem] leading-tight text-white md:text-[2.4rem]">{b.heading}</h2>}
          {b.text && <p className="mt-3 text-lg text-white/90">{b.text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn px-6 py-3">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 py-3">WhatsApp <ArrowUpRight className="size-4" /></a>}
        </div>
      </div>
    </section>
  )
}
