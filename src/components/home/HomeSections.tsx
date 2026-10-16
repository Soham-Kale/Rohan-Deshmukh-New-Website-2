import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays, Camera, Flag, Heart, Info, Leaf, PenLine, Phone, User, Video, Vote,
} from 'lucide-react'
import type { Home, Initiative, Post, Video as VideoDoc } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { payload } from '@/lib/payload'
import { cn, formatDate, mediaAlt, mediaPosition, mediaSize, mediaUrl, photoFit } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { CMSLink } from '../ui/CMSLink'
import { Section } from '../ui/Section'
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
    <section className="relative z-10 -mt-14 md:-mt-16">
      <div className="container-x">
        <ul className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-35px_rgba(20,33,61,.4)] sm:grid-cols-3 lg:grid-cols-6">
          {b.items.map((it) => {
            const Icon = icons[(it.icon as keyof typeof icons) ?? 'info'] ?? Info
            return (
              <li key={it.id} className="border-b border-r border-line last:border-r-0">
                <CMSLink url={it.url} newTab={it.newTab} className="group flex h-full flex-col items-center gap-3 px-3 py-6 text-center transition hover:bg-saffron-50">
                  <span className="grid size-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600 transition group-hover:bg-saffron-500 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-[0.98rem] font-semibold leading-snug text-charcoal-900">{it.label}</span>
                </CMSLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Stat({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div>
      <p className={cn('font-display text-4xl md:text-5xl', dark ? 'text-saffron-300' : 'text-saffron-600')}><CountUp value={value} /></p>
      <p className={cn('mt-1', dark ? 'text-white/70' : 'text-muted')}>{label}</p>
    </div>
  )
}

function AboutIntroSection({ b }: { b: Of<'aboutIntro'> }) {
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="py-16 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border-2 border-frame md:-left-6 md:-top-6" />
          {img && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" style={photoFit(b.image, 0.8)} />
            </div>
          )}
        </div>
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {/* tagline right under the name, then the description */}
          {b.pledge && <p className="mt-3 font-display text-xl leading-snug text-saffron-700 md:text-2xl">{b.pledge}</p>}
          {b.text && <p className="mt-6 text-lg text-muted md:text-xl">{b.text}</p>}
          {/* quick facts (Born, Studied, Leads, Author): label = small orange line, value = the fact */}
          {!!b.stats?.length && (
            <dl className="mt-7 flex flex-wrap gap-2.5">
              {b.stats.map((f) => (
                <div key={f.id} className="rounded-xl border border-line bg-white px-3.5 py-2">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-saffron-700">{f.label}</dt>
                  <dd className="text-[0.95rem] font-semibold leading-snug text-charcoal-900">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-dark mt-8">
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
    <section className="bg-cream py-16 md:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
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
        <ol className="space-y-4 self-center">
          {b.items?.map((it, i) => (
            <li key={it.id}>
              <CMSLink url={it.url} className="card card-hover group flex gap-5 p-6 md:p-7">
                <span className="font-display text-3xl text-saffron-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className="block font-display text-xl text-charcoal-900">{it.title}</span>
                  <span className="mt-2 block text-muted">{it.text}</span>
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
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <YouTube url={b.youtubeUrl} title={b.heading} />
        <ul className="grid gap-4">
          {b.links?.map((l) => (
            <li key={l.id}>
              <CMSLink url={l.url} newTab={l.newTab} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-saffron-300 hover:bg-white/10">
                <span>
                  <span className="block font-display text-xl text-white">{l.label}</span>
                  {l.description && <span className="mt-1 block text-sm text-white/65">{l.description}</span>}
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-saffron-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {b.items?.map((it, i) => {
          const img = mediaUrl(it.image, 'card')
          return (
            <CMSLink key={it.id} url={it.url} className={cn('card card-hover group flex flex-col', i === 0 && 'lg:col-span-2 lg:row-span-2')}>
              {img && (
                <div className={cn('relative overflow-hidden bg-cream', i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:flex-1' : 'aspect-[16/10]')}>
                  <Image src={img} alt={mediaAlt(it.image, it.title ?? '')} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(it.image, 1.6)} />
                </div>
              )}
              <div className="p-6">
                <h3 className={cn('text-charcoal-900', i === 0 ? 'text-2xl md:text-3xl' : 'text-xl')}>{it.title}</h3>
                {it.text && <p className="mt-2 line-clamp-3 text-muted">{it.text}</p>}
              </div>
            </CMSLink>
          )
        })}
      </div>
    </Section>
  )
}

async function InitiativesSection({ b, locale }: { b: Of<'initiativesShowcase'>; locale: Locale }) {
  const t = await getTranslations('common')
  let items = (b.initiatives ?? []).filter((x): x is Initiative => typeof x === 'object')
  if (!items.length) {
    const p = await payload()
    items = (await p.find({ collection: 'initiatives', where: { featured: { equals: true } }, sort: 'order', limit: 4, locale, depth: 1 })).docs
  }
  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          {b.eyebrow && <p className="eyebrow justify-center">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.intro && <p className="mt-4 text-lg text-muted">{b.intro}</p>}
        </div>
        {!!b.stats?.length && (
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {b.stats.map((s, i) => (
              <div key={s.id} className={cn('rounded-2xl border border-frame bg-saffron-50 px-4 py-5 text-center', i === b.stats!.length - 1 && b.stats!.length % 2 === 1 && 'col-span-2 sm:col-span-1')}>
                <dd className="font-display text-3xl leading-tight text-saffron-600 md:text-[2rem]"><CountUp value={s.value} /></dd>
                <dt className="mt-1 text-sm font-medium text-charcoal-900">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const img = mediaUrl(it.heroImage, 'card')
            return (
              <Link key={it.id} href={`/social-work/${it.slug}`} className="card card-hover group flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  {img && <Image src={img} alt={mediaAlt(it.heroImage, it.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(it.heroImage, 1.6, 0.6)} />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {it.stat && <span className="self-start rounded-full bg-saffron-50 px-2.5 py-0.5 text-xs font-bold text-saffron-700">{it.stat}</span>}
                  <h3 className="mt-3 line-clamp-2 text-lg leading-snug text-charcoal-900 group-hover:text-saffron-700">{it.title}</h3>
                  {it.excerpt && <p className="mt-2 line-clamp-2 text-[0.95rem] text-muted">{it.excerpt}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-saffron-700">
                    {t('moreInfo')} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
        {b.buttonUrl && (
          <div className="mt-10 text-center">
            <CMSLink url={b.buttonUrl} className="btn btn-dark">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>
          </div>
        )}
      </div>
    </section>
  )
}

/** "More →" text link used beside section headings */
function MoreLink({ url, label, dark }: { url?: string | null; label?: string | null; dark?: boolean }) {
  if (!url || !label) return null
  return (
    <CMSLink url={url} className={cn('inline-flex shrink-0 items-center gap-1.5 font-semibold', dark ? 'text-saffron-300 hover:text-white' : 'text-saffron-700 hover:text-charcoal-900')}>
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
    <section className="border-y border-line bg-cream py-14 md:py-20">
      <div className="container-x">
        <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
            {b.heading && <h2 className="mt-2 text-[1.7rem] leading-tight text-charcoal-900 md:text-[2.1rem]">{b.heading}</h2>}
          </div>
          <MoreLink url={b.buttonUrl} label={b.buttonLabel} />
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((it, i) => {
            const last = i === items.length - 1
            return (
              <li key={it.id} className="relative rounded-2xl border border-line bg-white p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-full font-semibold', last ? 'bg-saffron-500 text-white shadow-[0_0_0_5px_rgb(242_107_29/0.18)]' : 'bg-charcoal-900 text-saffron-300')}>{digits(i + 1, locale)}</span>
                  {it.place && <span className="text-xs font-bold uppercase tracking-wide text-saffron-700">{it.place}</span>}
                </div>
                {it.title && <h3 className="mt-4 text-lg leading-snug text-charcoal-900">{it.title}</h3>}
                {it.text && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{it.text}</p>}
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
      <ul className="grid gap-5 md:grid-cols-3">
        {members.map((m) => {
          const img = mediaUrl(m.image, 'thumb')
          return (
            <li key={m.id} className="flex gap-4 rounded-3xl border border-line bg-white p-5 md:p-6">
              <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-frame bg-cream">
                {img && <Image src={img} alt={mediaAlt(m.image, m.name ?? '')} fill sizes="72px" className="object-cover object-top" />}
              </div>
              <div className="min-w-0">
                {m.relation && <p className="text-sm font-semibold text-saffron-700">{m.relation}</p>}
                {m.name && <h3 className="mt-0.5 text-[1.05rem] leading-snug text-charcoal-900">{m.name}</h3>}
                {m.text && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{m.text}</p>}
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
    <section className="on-dark grain relative overflow-hidden bg-charcoal-900 py-16 text-white md:py-24">
      <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full border-[40px] border-saffron-500/10" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section text-white">{b.heading}</h2>}
          {b.text && <p className="mt-4 text-lg text-white/75">{b.text}</p>}
          {b.buttonUrl && <div className="mt-6"><MoreLink url={b.buttonUrl} label={b.buttonLabel} dark /></div>}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {b.items?.map((g) => (
            <li key={g.id} className="rounded-2xl border border-white/12 bg-white/5 p-4 md:p-5">
              <p className="font-display text-3xl leading-none text-saffron-300 md:text-4xl">{g.value}</p>
              {g.title && <p className="mt-2.5 font-semibold leading-snug text-white">{g.title}</p>}
              {g.text && <p className="mt-0.5 text-sm text-white/65">{g.text}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HighlightsSection({ b }: { b: Of<'homeHighlights'> }) {
  return (
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.text} className="border-y border-line bg-cream" action={<MoreLink url={b.buttonUrl} label={b.buttonLabel} />}>
      <ul className="grid gap-5 md:grid-cols-3">
        {b.items?.map((c) => (
          <li key={c.id}>
            <CMSLink url={c.url || b.buttonUrl || '#'} className="group block h-full rounded-3xl border-t-[5px] border-saffron-500 bg-white p-6 shadow-[0_14px_40px_-30px_rgb(20_33_61/0.45)] transition hover:-translate-y-1 md:p-7">
              {c.tag && <p className="text-xs font-bold uppercase tracking-wide text-saffron-700">{c.tag}</p>}
              {c.title && <h3 className="mt-2 text-xl leading-snug text-charcoal-900 group-hover:text-saffron-700">{c.title}</h3>}
              {c.text && <p className="mt-2 text-muted">{c.text}</p>}
            </CMSLink>
          </li>
        ))}
      </ul>
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
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((e) => {
          const img = mediaUrl(e.coverImage, 'card')
          const meta = e.group ? GROUP[locale]?.[e.group] : null
          return (
            <li key={e.id}>
              <Link href={`/events/${e.slug}`} className="card card-hover group flex h-full flex-col">
                {img ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                    <Image src={img} alt={mediaAlt(e.coverImage, e.title)} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(e.coverImage, 1.6, 0.6)} />
                  </div>
                ) : (
                  /* no photo yet: a short tinted band with an icon instead of an empty box */
                  <div className="grid h-24 place-items-center bg-cream sm:aspect-[16/10] sm:h-auto">
                    <CalendarDays aria-hidden className="size-9 text-saffron-600" strokeWidth={1.5} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  {meta && <p className="text-xs font-semibold text-saffron-700">{meta}</p>}
                  <h3 className="mt-1 line-clamp-2 text-lg leading-snug text-charcoal-900 group-hover:text-saffron-700">{e.title}</h3>
                  {e.tagline && <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-muted">{e.tagline}</p>}
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
  const img = mediaUrl(b.image, 'card')
  return (
    <section className="on-dark grain relative overflow-hidden bg-charcoal-900 py-16 text-white md:py-24">
      <div className="container-x relative grid items-center gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
        <div className="flex justify-center">
          {img ? (
            <div className="relative w-56 md:w-64">
              <Image src={img} alt={mediaAlt(b.image, b.heading ?? '')} width={mediaSize(b.image).width} height={mediaSize(b.image).height} sizes="256px" className="h-auto w-full rounded-lg shadow-[18px_24px_50px_-20px_rgba(0,0,0,.7)]" />
            </div>
          ) : (
            <BookOpen className="size-24 text-saffron-300" />
          )}
        </div>
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section text-white">{b.heading}</h2>}
          {b.text && <p className="mt-4 text-lg text-white/75">{b.text}</p>}
          {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn btn-primary mt-8">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
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
              <Image src={src} alt={mediaAlt(m as never, b.heading ?? '')} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition duration-500 hover:scale-105" style={photoFit(m as never, 1, 0.5)} />
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
    <section className="on-dark grain relative overflow-hidden bg-charcoal-900 py-20 text-white md:py-28">
      {img && (
        <>
          <Image src={img} alt="" fill sizes="100vw" className="object-cover opacity-20" style={{ objectPosition: mediaPosition(b.image) }} />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 to-charcoal-900/70" />
        </>
      )}
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.buttonUrl && (
            <CMSLink url={b.buttonUrl} className="btn btn-light mt-8">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>
          )}
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {b.items?.map((s) => (
            <div key={s.id} className="border-l-2 border-saffron-500 pl-5">
              <Stat value={s.value} label={s.label} dark />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ b }: { b: Of<'homeFaq'> }) {
  return (
    <Section className="bg-cream">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
          {b.heading && <h2 className="h-section">{b.heading}</h2>}
          {b.text && <p className="mt-4 text-lg text-muted">{b.text}</p>}
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
    <Section eyebrow={b.eyebrow} heading={b.heading} className="bg-cream" action={<Link href="/blog" className="btn btn-dark">{t('viewAll')} <ArrowRight className="size-4" /></Link>}>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <LeadStory post={lead} locale={locale} badge={tb('lead')} readFull={tb('readFull')} />
        {rest.length > 0 && <LatestList posts={rest.slice(0, 4)} locale={locale} title={tb('latestUpdates')} />}
      </div>
    </Section>
  )
}

export function PostCard({ post, locale }: { post: Post; locale: string }) {
  const img = mediaUrl(post.coverImage, 'card')
  return (
    <Link href={`/blog/${post.slug}`} className="card card-hover group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
        {img && <Image src={img} alt={mediaAlt(post.coverImage, post.title)} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" style={photoFit(post.coverImage, 1.6)} />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-muted">{formatDate(post.publishedAt, locale)} · {post.author}</p>
        <h3 className="mt-2 line-clamp-3 text-xl text-charcoal-900 group-hover:text-saffron-700">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-[0.98rem] text-muted">{post.excerpt}</p>}
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
    <Section eyebrow={b.eyebrow} heading={b.heading} intro={b.text} className="bg-cream"
      action={
        <div className="flex flex-wrap gap-3">
          {settings.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noopener" className="btn btn-dark">Instagram <ArrowUpRight className="size-4" /></a>}
          {fb && <a href={fb} target="_blank" rel="noopener" className="btn btn-ghost text-charcoal-900">Facebook <ArrowUpRight className="size-4" /></a>}
        </div>
      }>
      {!!b.instagramPosts?.length && <InstagramEmbeds urls={b.instagramPosts.map((x) => ({ url: x.url, title: x.title ?? '' }))} />}
      <div className={cn('mt-8 grid gap-6', fb && b.showFacebook ? 'lg:grid-cols-[1fr_380px]' : '')}>
        {videos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {videos.slice(0, 2).map((v) => <YouTube key={v.id} url={v.youtubeUrl} title={v.title} />)}
            <Link href="/media/videos" className="btn btn-dark self-start sm:col-span-2 sm:justify-self-start">YouTube <ArrowRight className="size-4" /></Link>
          </div>
        )}
        {fb && b.showFacebook && (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
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
    <section className="py-12 md:py-16">
      <div className="container-x">
        <div className="relative isolate flex flex-col items-start gap-7 overflow-hidden rounded-[2rem] bg-saffron-500 px-6 py-10 text-white sm:px-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
          <div aria-hidden className="absolute -right-16 -top-20 -z-10 size-72 rounded-full border-[36px] border-white/10" />
          <div className="max-w-2xl">
            {b.eyebrow && <p className="font-semibold text-white/85">{b.eyebrow}</p>}
            {b.heading && <h2 className="mt-1 text-[1.7rem] leading-tight text-white md:text-4xl">{b.heading}</h2>}
            {b.text && <p className="mt-3 text-white/90">{b.text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {b.buttonUrl && <CMSLink url={b.buttonUrl} className="btn bg-charcoal-900 px-6 py-3 text-white hover:bg-charcoal-800">{b.buttonLabel} <ArrowRight className="size-4" /></CMSLink>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="btn bg-white px-6 py-3 text-charcoal-900 hover:bg-cream">WhatsApp <ArrowUpRight className="size-4" /></a>}
          </div>
        </div>
      </div>
    </section>
  )
}
