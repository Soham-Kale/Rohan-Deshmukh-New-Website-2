import type { CSSProperties } from 'react'
import { m } from 'motion/react'
import { Compass, GraduationCap, MapPin } from 'lucide-react'
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
 * स्वपरिचय page in the "journey map" layout (edited under Pages in the admin):
 *  - the first Media + text block is the profile (photo, name, intro)
 *  - a Cards block right after it with short items (Born, Birthplace…) becomes small fact tags beside the name
 *  - a Cards block whose items all have a "meta" line becomes the journey: meta = place, title, text;
 *    shown as a route map on a navy band — numbered pins joined by a line that draws itself in (Oct 2026)
 * Every other block renders as usual, in order.
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
    <div>
      {hero && <Profile hero={hero} facts={facts} />}
      {between.length > 0 && <div className="mt-16 md:mt-24"><PageBlocks blocks={between} design="stitch" /></div>}
      {journey && <Journey block={journey} locale={locale} />}
      {after.length > 0 && <div className="mt-16 md:mt-24"><PageBlocks blocks={after} design="stitch" /></div>}
    </div>
  )
}

function Profile({ hero, facts }: { hero: MediaText; facts: Cards | null }) {
  const hasImg = Boolean(mediaUrl(hero.image, 'card'))
  return (
    /* Stitch: portrait card with a name plaque on the left; the intro card and the quick-fact tiles on the right */
    <section className={cn('grid grid-cols-1 items-stretch gap-8 lg:gap-10', hasImg && 'lg:grid-cols-12')}>
      {hasImg && (
        <Reveal className="flex flex-col lg:col-span-5">
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_20px_50px_-12px_rgba(9,20,34,0.18)] transition-shadow hover:shadow-[0_25px_60px_-15px_rgba(9,20,34,0.25)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal-950 lg:aspect-auto lg:min-h-[520px] lg:flex-1">
              <Img media={hero.image} variant="card" alt={mediaAlt(hero.image, hero.heading ?? '')} fill sizes="(max-width:1024px) 92vw, 480px" priority className="object-cover" style={{ objectPosition: mediaPosition(hero.image) }} />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent" />
              {hero.heading && (
                <div className="absolute inset-x-6 bottom-6">
                  <h2 className="font-display text-2xl font-bold tracking-wide text-saffron-100 drop-shadow-md md:text-[1.7rem]">{hero.heading}</h2>
                  <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-saffron-500" />
                </div>
              )}
            </div>
          </div>
        </Reveal>
      )}
      <div className={cn('flex min-w-0 flex-col gap-6', hasImg && 'lg:col-span-7')}>
        <Reveal delay={0.1} className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(9,20,34,0.12)] lg:p-10">
          <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-32 rounded-bl-full bg-gradient-to-bl from-saffron-100/60 to-transparent" />
          <div className="relative mb-5 flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-saffron-600 via-saffron-500 to-[#f97316] text-white shadow-md shadow-orange-950/20">
              <Compass className="size-5" />
            </span>
            {hero.eyebrow && <p className="text-[11px] font-bold uppercase tracking-widest text-saffron-600">{hero.eyebrow}</p>}
            {!hasImg && hero.heading && <h2 className="font-display text-2xl font-bold text-charcoal-950">{hero.heading}</h2>}
          </div>
          <div className="relative">
            <RichText html={hero.body} />
          </div>
        </Reveal>
        {/* quick facts as Stitch tiles */}
        {!!facts?.items?.length && (
          <Stagger as="dl" className={cn('grid grid-cols-2 gap-4', facts.items.length > 2 && 'sm:grid-cols-4')}>
            {facts.items.map((f) => (
              <StaggerItem key={f.id} className="group rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition-all hover:border-saffron-400/60 hover:shadow-md">
                <dt className="mb-1 text-[11px] font-bold uppercase tracking-wider text-saffron-600">{f.title}</dt>
                <dd className="font-display text-xl font-bold leading-snug text-charcoal-950 transition-colors group-hover:text-saffron-600 lg:text-2xl">{f.text}</dd>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}

/** each stop's marker takes the next of the site's accents: kesariya, green, white */
const STOP = [
  { pin: 'bg-gradient-to-br from-saffron-600 via-saffron-500 to-[#f97316] text-white shadow-saffron-500/40', chip: 'bg-saffron-500/15 text-saffron-200', glow: 'group-hover:border-saffron-500/60' },
  { pin: 'bg-leaf-600 text-white shadow-leaf-600/40', chip: 'bg-leaf-600/20 text-leaf-200', glow: 'group-hover:border-leaf-200/50' },
  { pin: 'bg-white text-charcoal-950 shadow-white/20', chip: 'bg-white/10 text-white', glow: 'group-hover:border-white/40' },
]

function Journey({ block, locale }: { block: Cards; locale: 'mr' | 'en' }) {
  const stops = block.items ?? []
  return (
    /* a route map on deep navy: the heading in the middle, the stops in a row joined by a line that draws itself in
       (a column on phones); each stop has a numbered pin, its place, title and text */
    <section className="on-dark relative left-1/2 mt-16 w-screen -translate-x-1/2 overflow-hidden border-y-4 border-y-saffron-500 bg-gradient-to-b from-charcoal-950 via-[#0c1a2e] to-[#10233d] text-white md:mt-24">
      <div aria-hidden className="glow-tl" />
      <div aria-hidden className="glow-br" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.04] [background-size:24px_24px]" />
      <div className="container-x relative py-16 lg:py-24">
        <Reveal className="mx-auto mb-12 max-w-2xl space-y-3 text-center lg:mb-16">
          {block.eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-saffron-200 backdrop-blur-md">
              <GraduationCap aria-hidden className="size-4 text-saffron-500" />
              {block.eyebrow}
            </span>
          )}
          {block.heading && <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{block.heading}</h2>}
          {block.intro && <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{block.intro}</p>}
        </Reveal>

        <div className="relative">
          {/* the route: across the pins on desktop, down the left on phones */}
          <m.span
            aria-hidden
            className="absolute left-7 top-7 bottom-7 w-0.5 origin-top bg-gradient-to-b from-saffron-500 via-leaf-600 to-white/70 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          />
          {stops.length > 1 && (
            <m.span
              aria-hidden
              className="absolute top-7 hidden h-0.5 origin-left bg-[repeating-linear-gradient(90deg,var(--color-saffron-500)_0_10px,transparent_10px_18px)] lg:block"
              style={{ left: `calc(100% / ${stops.length * 2})`, right: `calc(100% / ${stops.length * 2})` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
            />
          )}
          <Stagger as="ol" className="relative grid grid-cols-1 gap-8 lg:grid-cols-[repeat(var(--stops),minmax(0,1fr))]" style={{ '--stops': stops.length } as CSSProperties}>
            {stops.map((s, i) => {
              const a = STOP[i % STOP.length]
              return (
                <StaggerItem as="li" key={s.id} className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center">
                  <span className={cn('relative z-10 grid size-14 shrink-0 place-items-center rounded-full shadow-lg ring-8 ring-charcoal-950 transition-transform duration-300 group-hover:scale-110', a.pin)}>
                    <MapPin aria-hidden className="size-6" />
                    <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-charcoal-950 font-display text-[11px] font-bold text-white ring-2 ring-white/20">
                      {num(i + 1, locale)}
                    </span>
                  </span>
                  <div className={cn('min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/[0.07] lg:w-full lg:p-7', a.glow)}>
                    {s.meta && <span className={cn('inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider', a.chip)}>{s.meta}</span>}
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white lg:text-2xl">{s.title}</h3>
                    {s.text && <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-300">{s.text}</p>}
                  </div>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
