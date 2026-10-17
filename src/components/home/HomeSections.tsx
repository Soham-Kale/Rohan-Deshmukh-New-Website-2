import type React from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight, ArrowUpRight, Award, Quote, BookOpen, CalendarDays, Camera, Flag, Heart, Info, Leaf, PenLine, Phone, User, Video, Vote,
} from 'lucide-react'
import type { Home, Post, Video as VideoDoc } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { getGlobal, payload } from '@/lib/payload'
import { SocialIcon, socialLabels } from '../ui/SocialIcon'
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
import { InstagramReels } from './InstagramReels'
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
          case 'heroSlider': return <Hero key={key} b={b} locale={locale} />
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

/**
 * Hero (official-site layout): the photo slideshow, the follow-us icons standing on its left edge (wide screens),
 * and a navy message bar that overlaps the bottom of the photos — one line on how Rohan works, his quote, one button.
 */
async function Hero({ b, locale }: { b: Of<'heroSlider'>; locale: Locale }) {
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
  const [settings, t] = await Promise.all([getGlobal('site-settings', locale), getTranslations('common')])
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => v && k !== 'id') as [string, string][]
  return (
    <>
      <div className="relative">
        <HeroSlider slides={slides} autoplay={b.autoplaySeconds ?? 5} />
        {!!social.length && (
          <ul aria-label={t('followUs')} className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 xl:flex">
            {social.map(([k, v]) => (
              <li key={k}>
                <a href={v} target="_blank" rel="noopener noreferrer" aria-label={socialLabels[k] ?? k} className="grid size-10 place-items-center rounded-full bg-white text-charcoal-900 shadow-md ring-1 ring-black/5 transition hover:bg-saffron-600 hover:text-white">
                  <SocialIcon name={k === 'whatsappChannel' ? 'whatsapp' : k} className="size-[17px]" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="container-x relative z-10 mt-6 lg:-mt-20">
        <div className="grid gap-5 rounded-lg border-l-4 border-saffron-500 bg-charcoal-900 p-6 text-white shadow-[0_24px_50px_-28px_rgb(20_33_61/0.7)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-8">
          <div>
            <p className="text-[0.95rem] font-semibold tracking-wide text-highlight">{t('engageEyebrow')}</p>
            <p className="mt-1.5 text-[1.12rem] leading-relaxed md:text-[1.3rem]">{t('engageText')}</p>
            <p className="mt-2 text-[1rem] leading-relaxed text-white/75 md:text-[1.05rem]">{t('engageQuote')}</p>
          </div>
          <CMSLink url="https://newindiamanifesto.com/apply/founder" newTab className="btn btn-primary justify-self-start md:justify-self-end">
            {t('engageButton')} <ArrowUpRight className="size-4" />
          </CMSLink>
        </div>
      </div>
    </>
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

function Stat({ value, label }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="stat-item">
      <p className="stat-value"><CountUp value={value} /></p>
      <p className="stat-label">{label}</p>
    </div>
  )
}

async function AboutIntroSection({ b }: { b: Of<'aboutIntro'> }) {
  const img = mediaUrl(b.image, 'card')
  const t = await getTranslations('common')
  return (
    <section className="section">
      {/* official-site "About" block: words on the left, the portrait on the right on a soft panel */}
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
        <div data-reveal className="lg:order-1">
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="mt-6 text-[1.08rem] leading-[1.85] text-ink md:text-[1.15rem]">{b.text}</p>}
          {/* tagline as his own words, with a quote mark */}
          {b.pledge && (
            <p className="mt-6 flex gap-3 font-display text-[1.25rem] leading-snug text-charcoal-900 md:text-[1.4rem]">
              <Quote aria-hidden className="mt-1 size-6 shrink-0 fill-saffron-500 text-saffron-500" />
              {b.pledge}
            </p>
          )}
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
            <div className="mt-9 flex flex-wrap gap-3">
              <CMSLink url={b.buttonUrl} className="btn btn-dark">
                {b.buttonLabel} <ArrowRight className="size-4" />
              </CMSLink>
              <CMSLink url="/contact" className="btn btn-ghost text-charcoal-900">
                {t('getInTouch')}
              </CMSLink>
            </div>
          )}
        </div>
        {img && (
          /* the portrait exactly as photographed — whole picture, no crop, no colour block behind, just a soft shadow */
          <div data-reveal className="mx-auto w-full max-w-md lg:order-2 lg:max-w-[30rem]">
            <Image
              src={img}
              alt={mediaAlt(b.image, b.heading ?? '')}
              width={mediaSize(b.image).width}
              height={mediaSize(b.image).height}
              sizes="(max-width:1024px) 90vw, 480px"
              className="h-auto w-full rounded-2xl shadow-[0_28px_60px_-28px_rgb(20_33_61/0.45)]"
            />
          </div>
        )}
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

/** Home → video, centred like the official site's "Stay connected" block: heading, the video large, one line, button */
function FeaturedVideoSection({ b }: { b: Of<'featuredVideo'> }) {
  const links = b.links ?? []
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead eyebrow={b.eyebrow} heading={b.heading} center />
        <div data-reveal className="mx-auto max-w-4xl">
          <YouTube url={b.youtubeUrl} title={b.heading} />
        </div>
        {b.text && <p className="mx-auto mt-7 max-w-3xl text-center text-[1.05rem] leading-relaxed text-muted md:text-[1.12rem]">{b.text}</p>}
        {links.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {links.map((l, i) => (
              <CMSLink key={l.id ?? i} url={l.url} newTab={l.newTab} className={cn('btn', i === 0 ? 'btn-dark' : 'btn-ghost text-charcoal-900')}>
                {l.label} <ArrowUpRight className="size-4" />
              </CMSLink>
            ))}
          </div>
        )}
      </div>
    </section>
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cream shadow-[0_30px_60px_-40px_rgb(20_33_61/0.55)]">
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
      {label}
      <span aria-hidden className="grid size-6 place-items-center rounded-full ring-[1.5px] ring-current">
        <ArrowRight className="size-3.5" />
      </span>
    </CMSLink>
  )
}

const DEV = '०१२३४५६७८९'
const digits = (n: number, locale: Locale) => (locale === 'mr' ? String(n).replace(/\d/g, (d) => DEV[Number(d)]) : String(n))

/**
 * Journey as an official-site timeline: centred heading, one line across the page with a dot per stop,
 * the stops alternating above and below the line (a vertical list on phones and tablets).
 */
function JourneySection({ b, locale }: { b: Of<'homeJourney'>; locale: Locale }) {
  const items = b.items ?? []
  if (!items.length) return null
  return (
    <section className="section band-cream">
      <div className="container-x">
        <SectionHead eyebrow={b.eyebrow} heading={b.heading} center />
        <ol data-reveal-stagger className="relative lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-6" style={{ '--n': items.length } as React.CSSProperties}>
          <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-saffron-300 lg:inset-x-0 lg:bottom-auto lg:top-1/2 lg:h-0.5 lg:w-auto lg:-translate-y-1/2" />
          {items.map((it, i) => {
            const up = i % 2 === 0
            const last = i === items.length - 1
            return (
              <li key={it.id} className="relative pb-8 pl-12 last:pb-0 lg:grid lg:min-h-[25rem] lg:grid-rows-[1fr_auto_1fr] lg:pb-0 lg:pl-0">
                <span aria-hidden className={cn('absolute left-0 top-5 size-6 rounded-full border-[5px] border-cream ring-2 lg:static lg:row-start-2 lg:mx-auto', last ? 'bg-saffron-500 ring-saffron-500' : 'bg-charcoal-900 ring-charcoal-900')} />
                <div className={cn('relative', up ? 'lg:row-start-1 lg:self-end lg:pb-7' : 'lg:row-start-3 lg:self-start lg:pt-7')}>
                  {/* short stem from the card to the line */}
                  <span aria-hidden className={cn('absolute left-1/2 hidden h-7 w-px bg-saffron-300 lg:block', up ? 'bottom-0' : 'top-0')} />
                  <div className="rounded-lg border-t-[3px] border-saffron-500 bg-white p-5 shadow-[0_14px_30px_-24px_rgb(20_33_61/0.5)]">
                    <p className="text-[0.95rem] text-saffron-700">{digits(i + 1, locale)} · {it.place}</p>
                    {it.title && <h3 className="mt-1 text-[1.2rem] leading-snug text-charcoal-900">{it.title}</h3>}
                    {it.text && <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{it.text}</p>}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        {b.buttonUrl && (
          <div className="mt-10 text-center lg:mt-6">
            <MoreLink url={b.buttonUrl} label={b.buttonLabel} />
          </div>
        )}
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

/** लोकमंगल परिवार: heading row with "View all", the introduction, then one equal card per group of institutions */
function ParivarSection({ b }: { b: Of<'homeParivar'> }) {
  return (
    <section className="section band-cream">
      <div className="container-x">
        <div className="section-head-row">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} intro={b.text} />
          <MoreLink url={b.buttonUrl} label={b.buttonLabel} />
        </div>
        <ul data-reveal-stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {b.items?.map((g) => (
            <li key={g.id}>
              <div className="h-full rounded-lg border-b-[3px] border-saffron-500 bg-white p-5 shadow-[0_14px_30px_-24px_rgb(20_33_61/0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgb(20_33_61/0.5)] md:p-6">
                <p className="font-display text-[2.6rem] leading-none text-saffron-600">{g.value && <CountUp value={g.value} />}</p>
                {g.title && <p className="mt-3 leading-snug text-charcoal-900">{g.title}</p>}
                {g.text && <p className="mt-1 text-[0.92rem] leading-snug text-muted">{g.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** सामाजिक उपक्रम: one card per chapter — photo on top, a soft cream body, a small green label, title and a line of text */
function HighlightsSection({ b }: { b: Of<'homeHighlights'> }) {
  return (
    <section className="section">
      <div className="container-x">
        <div className="section-head-row">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} intro={b.text} />
          <MoreLink url={b.buttonUrl} label={b.buttonLabel} />
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {b.items?.map((c) => {
            const img = mediaUrl(c.image, 'card')
            return (
              <li key={c.id}>
                <CMSLink url={c.url || b.buttonUrl || '#'} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[#fffaf4] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-26px_rgb(20_33_61/0.45)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                    {img && <Image src={img} alt={mediaAlt(c.image, c.title ?? '')} fill sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.06]" style={photoFit(c.image, 1.6)} />}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    {c.tag && <span className="self-start rounded-full bg-leaf-50 px-3 py-0.5 text-[0.88rem] font-semibold text-leaf-600">{c.tag}</span>}
                    {c.title && <h3 className="mt-4 text-[1.35rem] leading-snug text-charcoal-900 transition group-hover:text-saffron-700">{c.title}</h3>}
                    {c.text && <p className="mt-2 text-[1rem] leading-relaxed text-ink">{c.text}</p>}
                  </div>
                </CMSLink>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
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
    <section className="section">
      <div data-reveal-stagger className="container-x grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20">
        <div className="flex justify-center">
          {img ? (
            /* the book cover at its own shape, tilted slightly like a book on a shelf */
            <div className="relative w-52 -rotate-2 transition duration-500 hover:rotate-0 sm:w-60 md:w-64 lg:w-72">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} width={mediaSize(b.image).width} height={mediaSize(b.image).height} sizes="(max-width:768px) 240px, 288px" className="h-auto w-full rounded-md shadow-[18px_26px_50px_-18px_rgb(20_33_61/0.55)] ring-1 ring-charcoal-900/10" />
            </div>
          ) : (
            <BookOpen className="size-24 text-saffron-600" />
          )}
        </div>
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="mt-6 text-[1.08rem] leading-[1.85] text-ink md:text-[1.15rem]">{b.text}</p>}
          {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn btn-dark mt-8">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
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

/**
 * Reels (like the Lokmangal Foundation site): centred heading, then the chosen Instagram reels side by side
 * (a swipeable row on phones), each loading only when it scrolls into view. Facebook / YouTube stay optional below.
 */
async function SocialSection({ b, locale }: { b: Of<'socialFeeds'>; locale: Locale }) {
  const p = await payload()
  const settings = await p.findGlobal({ slug: 'site-settings', locale })
  const t = await getTranslations('common')
  const videos = b.showYoutube ? ((await p.find({ collection: 'videos', limit: 3, sort: '-publishedAt', locale })).docs as VideoDoc[]) : []
  const fb = settings.social?.facebook
  const insta = settings.social?.instagram
  return (
    <section className="section border-t border-line">
      <div className="container-x">
        <SectionHead eyebrow={b.eyebrow} heading={b.heading} intro={b.text} center />
        {!!b.instagramPosts?.length && <InstagramReels reels={b.instagramPosts.map((x) => ({ url: x.url, title: x.title ?? '' }))} />}
        {insta && (
          <p className="mt-8 text-center">
            <a href={`${insta.replace(/\/$/, '')}/reels/`} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              {t('moreReels')} <ArrowUpRight className="size-4" />
            </a>
          </p>
        )}
        {(videos.length > 0 || (fb && b.showFacebook)) && (
          <div className={cn('mt-12 grid gap-8', fb && b.showFacebook ? 'lg:grid-cols-[1fr_380px]' : '')}>
            {videos.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
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
        )}
      </div>
    </section>
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

