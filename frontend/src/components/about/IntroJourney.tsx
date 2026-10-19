import type React from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'
import { cn, mediaAlt, mediaPosition, mediaUrl } from '@/lib/utils'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'

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
 *    shown as a numbered route on a navy band, the last stop highlighted
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
      {between.length > 0 && <div className="mt-14 md:mt-16"><PageBlocks blocks={between} /></div>}
      {journey && <Journey block={journey} locale={locale} />}
      {after.length > 0 && <div className="mt-14 md:mt-16"><PageBlocks blocks={after} /></div>}
    </div>
  )
}

function Profile({ hero, facts }: { hero: MediaText; facts: Cards | null }) {
  const img = mediaUrl(hero.image, 'card')
  return (
    /* photo in a fixed 5:6 frame (about 380 × 456 px on desktop), text centred beside it */
    <section className="grid items-center gap-10 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:gap-16 lg:gap-20">
      {img && (
        <div className="relative mx-auto aspect-[5/6] w-full max-w-[380px] overflow-hidden rounded-3xl bg-cream shadow-[0_24px_60px_-34px_rgb(20_33_61/0.45)]">
          <Image src={img} alt={mediaAlt(hero.image, hero.heading ?? '')} fill sizes="(max-width:768px) 92vw, 380px" priority className="object-cover" style={{ objectPosition: mediaPosition(hero.image) }} />
        </div>
      )}
      <div className="min-w-0">
        {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
        {hero.heading && <h2 className="mt-2 text-[1.9rem] leading-tight text-charcoal-900 md:text-[2.4rem]">{hero.heading}</h2>}
        {/* quick facts as a plain row under the name, divided by a thin rule */}
        {!!facts?.items?.length && (
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 sm:grid-cols-4">
            {facts.items.map((f) => (
              <div key={f.id}>
                <dt className="text-[0.78rem] font-semibold text-saffron-700">{f.title}</dt>
                <dd className="mt-0.5 font-semibold leading-snug text-charcoal-900">{f.text}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-6 max-w-2xl">
          <RichText data={hero.body} />
        </div>
      </div>
    </section>
  )
}

function Journey({ block, locale }: { block: Cards; locale: 'mr' | 'en' }) {
  const stops = block.items ?? []
  const last = stops.length - 1
  return (
    /* full-width warm band breaking out of the page container */
    <section className="band-cream relative left-1/2 mt-16 w-screen -translate-x-1/2 overflow-hidden md:mt-20">
      <div className="container-x relative py-14 md:py-20">
        {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
        {block.heading && <h2 className="h-section">{block.heading}</h2>}
        {block.intro && <p className="lead mt-3 max-w-2xl">{block.intro}</p>}

        <ol className="mt-10 grid md:mt-12 md:grid-cols-[repeat(var(--stops),minmax(0,1fr))] md:gap-6" style={{ '--stops': stops.length } as React.CSSProperties}>
          {stops.map((s, i) => {
            const end = i === last
            return (
              <li key={s.id} className="relative flex gap-5 pb-9 last:pb-0 md:block md:pb-0">
                {/* route: vertical on phones, horizontal from tablet up (dashed line to the next stop) */}
                {!end && <span aria-hidden className="absolute bottom-0 left-[1.2rem] top-11 border-l-2 border-dashed border-saffron-500/40 md:left-12 md:right-[-1.5rem] md:top-[1.2rem] md:bottom-auto md:border-l-0 md:border-t-2" />}
                <span
                  className={cn(
                    'relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-[0.95rem] font-semibold',
                    end ? 'border-saffron-600 bg-saffron-600 text-white shadow-[0_0_0_6px_rgb(232_115_28/0.18)]' : 'border-saffron-500 bg-paper text-saffron-700',
                  )}
                >
                  {num(i + 1, locale)}
                </span>
                <div className="min-w-0 md:mt-5 md:pr-4">
                  {s.meta && <p className="text-[0.85rem] text-saffron-700">{s.meta}</p>}
                  <h3 className="mt-1 text-lg leading-snug text-charcoal-900 md:text-[1.2rem]">{s.title}</h3>
                  {s.text && <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{s.text}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
