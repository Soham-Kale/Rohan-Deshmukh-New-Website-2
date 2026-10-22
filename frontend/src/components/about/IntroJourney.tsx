import type { CSSProperties } from 'react'
import { m } from 'motion/react'
import { Calendar, Compass, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import type { Page } from '@/types/cms'
import { cn } from '@/lib/utils'
import { mediaAlt, mediaPosition, mediaUrl } from '@/lib/media'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'
import { Img } from '@/components/ui/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Motion'

type Block = NonNullable<Page['layout']>[number]
type MediaText = Extract<Block, { blockType: 'mediaText' }>
type Cards = Extract<Block, { blockType: 'cards' }>

const DEVANAGARI = '०१२३४५६७८९'
const num = (n: number, locale: string) => (locale === 'mr' ? String(n).replace(/\d/g, (d) => DEVANAGARI[Number(d)]) : String(n))

/**
 * स्वपरिचय page in the "journey map" layout:
 *  - the first Media + text block is the profile (photo, name, intro)
 *  - a Cards block right after it with short items (Born, Birthplace…) becomes quick-fact tiles
 *  - a Cards block whose items have a "meta" line becomes the journey timeline
 * Every other block renders in order.
 */
export function IntroJourney({ blocks, locale }: { blocks?: Block[] | null; locale: 'mr' | 'en' }) {
  const list = (blocks ?? []).filter((b) => !('hidden' in b && b.hidden))
  const heroIdx = list.findIndex((b) => b.blockType === 'mediaText')
  const hero = heroIdx >= 0 ? (list[heroIdx] as MediaText) : null
  const next = list[heroIdx + 1]
  const facts = hero && next?.blockType === 'cards' && (next.items?.length ?? 0) <= 4 && next.items?.every((i) => !i.meta) ? (next as Cards) : null
  const journey = list.find((b): b is Cards => b.blockType === 'cards' && b !== facts && (b.items?.length ?? 0) > 1 && !!b.items?.every((i) => i.meta)) ?? null

  const used = new Set<Block>([hero, facts, journey].filter(Boolean) as Block[])
  const journeyIdx = journey ? list.indexOf(journey) : -1
  const between = list.filter((b, i) => !used.has(b) && (journeyIdx < 0 || i < journeyIdx))
  const after = journeyIdx < 0 ? [] : list.filter((b, i) => !used.has(b) && i > journeyIdx)

  return (
    <div className="space-y-16 md:space-y-24">
      {hero && <Profile hero={hero} facts={facts} locale={locale} />}
      {between.length > 0 && <PageBlocks blocks={between} design="stitch" />}
      {journey && <Journey block={journey} locale={locale} />}
      {after.length > 0 && <PageBlocks blocks={after} design="stitch" />}
    </div>
  )
}

function Profile({ hero, facts, locale }: { hero: MediaText; facts: Cards | null; locale: 'mr' | 'en' }) {
  const hasImg = Boolean(mediaUrl(hero.image, 'card'))
  return (
    <section className={cn('grid grid-cols-1 items-stretch gap-8 lg:gap-10', hasImg && 'lg:grid-cols-12')}>
      {/* Left: Portrait Card */}
      {hasImg && (
        <Reveal className="flex flex-col lg:col-span-5">
          <div className="group relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_24px_55px_-14px_rgba(9,20,34,0.32)] ring-1 ring-black/5 transition-all duration-500 hover:shadow-[0_30px_70px_-16px_rgba(9,20,34,0.4)] hover:border-saffron-300">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal-950 sm:aspect-[3/4] lg:aspect-auto lg:min-h-[540px] lg:flex-1">
              <Img
                media={hero.image}
                variant="card"
                alt={mediaAlt(hero.image, hero.heading ?? '')}
                fill
                sizes="(max-width:1024px) 92vw, 480px"
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                style={{ objectPosition: mediaPosition(hero.image) }}
              />

            </div>
          </div>
        </Reveal>
      )}

      {/* Right: Biography Card & Quick Facts */}
      <div className={cn('flex min-w-0 flex-col justify-between gap-6', hasImg && 'lg:col-span-7')}>
        {/* Main Biography Card */}
        <Reveal delay={0.1} className="relative flex-1 overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-7 shadow-[0_20px_50px_-12px_rgba(9,20,34,0.1)] transition-all duration-300 hover:shadow-xl sm:p-9 lg:p-10">
          <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-40 rounded-bl-full bg-gradient-to-bl from-saffron-100/70 via-amber-50/40 to-transparent" />
          
          <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-saffron-600 via-saffron-500 to-[#f97316] text-white shadow-md shadow-orange-950/20">
                <Compass className="size-5.5" />
              </span>
              <div>
                {hero.eyebrow && <p className="text-[11px] font-bold uppercase tracking-widest text-saffron-600">{hero.eyebrow}</p>}
                {!hasImg && hero.heading && <h2 className="font-display text-2xl font-bold text-charcoal-950">{hero.heading}</h2>}
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200/80 bg-saffron-50/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-700">
              <Sparkles className="size-3 text-saffron-600" />
              <span>{locale === 'mr' ? 'सोलापूरचा नवा आवाज' : 'Solapur'}</span>
            </span>
          </div>

          <div className="relative text-[1.05rem] leading-[1.8] text-charcoal-900/90">
            <RichText html={hero.body} />
          </div>

          {/* Inspirational Pillar Pills */}
          <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-5">
            <span className="rounded-full border border-saffron-200 bg-saffron-50/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-700">
              {locale === 'mr' ? 'तरुणाई • उद्योजकता • स्वावलंबन' : 'Youth • Enterprise • Self-reliance'}
            </span>
            <span className="rounded-full border border-leaf-200 bg-leaf-50/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-leaf-700">
              {locale === 'mr' ? 'स्वामी विवेकानंदांचे विचार' : 'Inspired by Swami Vivekananda'}
            </span>
          </div>
        </Reveal>

        {/* Quick Facts Tiles */}
        {!!facts?.items?.length && (
          <Stagger as="dl" className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', facts.items.length > 2 && 'sm:grid-cols-4')}>
            {facts.items.map((f, i) => (
              <StaggerItem
                key={f.id}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:border-saffron-400 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600 transition-colors group-hover:bg-saffron-500 group-hover:text-white">
                  {i === 0 ? <Calendar className="size-5" /> : <MapPin className="size-5" />}
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{f.title}</dt>
                  <dd className="font-display text-lg font-bold leading-snug text-charcoal-950 transition-colors group-hover:text-saffron-700 lg:text-xl">
                    {f.text}
                  </dd>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

/** Each stop's marker accent styling */
const STOP = [
  { pin: 'bg-gradient-to-br from-saffron-600 via-saffron-500 to-[#f97316] text-white shadow-saffron-500/40', chip: 'bg-saffron-500/15 text-saffron-200 border border-saffron-500/30', glow: 'group-hover:border-saffron-400/80' },
  { pin: 'bg-gradient-to-br from-leaf-600 to-emerald-500 text-white shadow-leaf-600/40', chip: 'bg-leaf-600/20 text-leaf-200 border border-leaf-500/30', glow: 'group-hover:border-leaf-300/80' },
  { pin: 'bg-white text-charcoal-950 shadow-white/30', chip: 'bg-white/10 text-white border border-white/20', glow: 'group-hover:border-white/60' },
]

function Journey({ block, locale }: { block: Cards; locale: 'mr' | 'en' }) {
  const stops = block.items ?? []
  return (
    <section className="on-dark relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-b from-[#060e18] via-[#0a1728] to-[#0c1a2e] text-white">
      {/* Decorative gradient dividers top & bottom */}
      <div aria-hidden className="h-[2px] w-full bg-gradient-to-r from-transparent via-saffron-500 to-transparent" />
      
      <div aria-hidden className="glow-tl" />
      <div aria-hidden className="glow-br" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.04] [background-size:24px_24px]" />
      
      <div className="container-x relative py-16 lg:py-24">
        {/* Section Heading */}
        <Reveal className="mx-auto mb-12 max-w-2xl space-y-3.5 text-center lg:mb-16">
          {block.eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-saffron-200 backdrop-blur-md">
              <GraduationCap aria-hidden className="size-4 text-saffron-400" />
              {block.eyebrow}
            </span>
          )}
          {block.heading && (
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm">
              {block.heading}
            </h2>
          )}
          {block.intro && <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{block.intro}</p>}
        </Reveal>

        <div className="relative">
          {/* Mobile connecting vertical line */}
          <m.span
            aria-hidden
            className="absolute bottom-7 left-7 top-7 w-0.5 origin-top bg-gradient-to-b from-saffron-500 via-leaf-600 to-white/70 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
          />

          {/* Desktop connecting horizontal line */}
          {stops.length > 1 && (
            <m.span
              aria-hidden
              className="absolute top-7 hidden h-0.5 origin-left bg-[repeating-linear-gradient(90deg,var(--color-saffron-500)_0_10px,transparent_10px_18px)] lg:block"
              style={{ left: `calc(100% / ${stops.length * 2})`, right: `calc(100% / ${stops.length * 2})` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
            />
          )}

          {/* Timeline stops */}
          <Stagger as="ol" className="relative grid grid-cols-1 gap-8 lg:grid-cols-[repeat(var(--stops),minmax(0,1fr))]" style={{ '--stops': stops.length } as CSSProperties}>
            {stops.map((s, i) => {
              const a = STOP[i % STOP.length]
              return (
                <StaggerItem as="li" key={s.id} className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center">
                  {/* Waypoint Pin */}
                  <span className={cn('relative z-10 grid size-14 shrink-0 place-items-center rounded-full shadow-xl ring-8 ring-[#0a1728] transition-transform duration-300 group-hover:scale-110', a.pin)}>
                    <MapPin aria-hidden className="size-6" />
                    <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-charcoal-950 font-display text-[11px] font-bold text-white ring-2 ring-white/20">
                      {num(i + 1, locale)}
                    </span>
                  </span>

                  {/* Card Content */}
                  <div
                    className={cn(
                      'min-w-0 flex-1 rounded-2xl border border-white/12 bg-white/[0.05] p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.09] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(255,122,0,0.2)] lg:w-full lg:p-7',
                      a.glow,
                    )}
                  >
                    {s.meta && (
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider', a.chip)}>
                        <MapPin className="size-3" />
                        <span>{s.meta}</span>
                      </span>
                    )}
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white lg:text-2xl">{s.title}</h3>
                    {s.text && <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-300">{s.text}</p>}
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div aria-hidden className="h-[2px] w-full bg-gradient-to-r from-transparent via-leaf-600 to-transparent" />
    </section>
  )
}
