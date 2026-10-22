import { m, type Variants } from 'motion/react'
import type { Page } from '@/types/cms'
import { cn } from '@/lib/utils'
import { mediaAlt, mediaUrl } from '@/lib/media'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'
import { Img } from '@/components/ui/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Motion'

type Block = NonNullable<Page['layout']>[number]
type MediaText = Extract<Block, { blockType: 'mediaText' }>
type Content = Extract<Block, { blockType: 'content' }>

/**
 * One colour family per member (kesariya, green, navy — Stitch): the tint of the photo panel, the halo behind the person, the dot on the
 * relation label, the rule under the name and the ring when the card is hovered. The portraits are cut-outs on a transparent
 * background, so the panel colour is what they stand on — every panel ends in its own tint (not white), so each one reads as a tile.
 */
const ACCENTS = [
  { panel: 'from-saffron-100 to-saffron-50', halo: 'bg-saffron-200/60', dot: 'bg-saffron-600', rule: 'bg-saffron-600', ring: 'group-hover:ring-saffron-300' },
  { panel: 'from-leaf-50 to-leaf-50', halo: 'bg-leaf-200/45', dot: 'bg-leaf-600', rule: 'bg-leaf-600', ring: 'group-hover:ring-leaf-200' },
  { panel: 'from-slate-200 to-slate-100', halo: 'bg-slate-300/60', dot: 'bg-charcoal-900', rule: 'bg-charcoal-900', ring: 'group-hover:ring-slate-300' },
] as const

/* What happens inside a card when it scrolls into view: the halo blooms, the person rises into it and the rule under the
   name is drawn. These variants have no `initial` of their own: they follow the card's own hidden → show (see StaggerItem), and `custom` (the
   card's number) staggers them the same way the cards are staggered (a delay written in a variant replaces the one inherited from the card). */
const EASE = [0.22, 1, 0.36, 1] as const
const STEP = 0.08
const bloom: Variants = { hidden: { opacity: 0, scale: 0.82 }, show: (i: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.02 + i * STEP, ease: EASE } }) }
const rise: Variants = { hidden: { opacity: 0, y: 22, scale: 0.97 }, show: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: 0.12 + i * STEP, ease: EASE } }) }
const draw: Variants = { hidden: { scaleX: 0 }, show: (i: number) => ({ scaleX: 1, transition: { duration: 0.7, delay: 0.35 + i * STEP, ease: EASE } }) }

/**
 * कौटुंबिक पार्श्वभूमी page (Stitch design, Oct 2026): the family introduction beside its heading, then the family
 * members (the page's consecutive Media + text blocks, edited under Pages in the admin) as cards — a tinted photo panel with the
 * relation label, then the name and the story. Three or more members sit side by side on wide screens; on tablets each
 * card lies down (photo left, words right) so no card is left alone on a row. Blocks before/after render as usual.
 */
export function FamilyBackground({ blocks }: { blocks?: Block[] | null; locale?: 'mr' | 'en' }) {
  const list = (blocks ?? []).filter((b) => !('hidden' in b && b.hidden))
  const start = list.findIndex((b) => b.blockType === 'mediaText')
  let end = start
  while (end >= 0 && list[end]?.blockType === 'mediaText') end++
  if (start < 0) return <PageBlocks blocks={list} design="stitch" />

  const members = list.slice(start, end) as MediaText[]
  const introIdx = start > 0 && list[start - 1].blockType === 'content' ? start - 1 : -1
  const intro = introIdx >= 0 ? (list[introIdx] as Content) : null
  const before = list.slice(0, introIdx >= 0 ? introIdx : start)
  const after = list.slice(end)
  const count = members.length
  const stacked = count >= 3 // side by side, photo on top, on wide screens
  const cols = count >= 5 ? 'lg:grid-cols-3' : count === 4 ? 'lg:grid-cols-2 xl:grid-cols-4' : count === 3 ? 'lg:grid-cols-3' : count === 2 ? 'lg:grid-cols-2' : ''

  return (
    <div className="space-y-16 md:space-y-24">
      {before.length > 0 && <PageBlocks blocks={before} design="stitch" />}

      <section className="flex flex-col gap-12">
        {intro && (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              {intro.eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron-700">{intro.eyebrow}</p>}
              {intro.heading && <h2 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-charcoal-950 sm:text-4xl">{intro.heading}</h2>}
              <span aria-hidden className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-saffron-600 to-leaf-600" />
            </Reveal>
            <Reveal delay={0.1} className="rounded-xl border-l-4 border-saffron-500 bg-cream p-6 shadow-sm md:p-8 lg:col-span-7">
              <RichText html={intro.body} readMore />
            </Reveal>
          </div>
        )}

        <Stagger className={cn('grid grid-cols-1 items-stretch gap-6 lg:gap-7', cols)}>
          {members.map((member, i) => {
            const a = ACCENTS[i % ACCENTS.length]
            const hasPhoto = Boolean(mediaUrl(member.image, 'card'))
            return (
              <StaggerItem
                as="article"
                key={member.id ?? i}
                className={cn(
                  'group relative flex flex-col gap-1 rounded-3xl bg-white p-3 shadow-[0_18px_40px_-26px_rgba(14,30,52,0.4)] ring-1 ring-stone-200/80',
                  'transition-[box-shadow,translate] duration-300 hover:shadow-[0_28px_56px_-28px_rgba(14,30,52,0.5)] motion-safe:hover:-translate-y-1.5',
                  stacked ? 'md:flex-row md:gap-3 lg:flex-col lg:gap-1' : 'md:flex-row md:gap-3',
                  a.ring,
                )}
              >
                {/* the photo panel: a soft tint, a halo behind the person, the relation label (no numbering — removed Oct 2026) */}
                <div
                  className={cn(
                    'relative isolate aspect-[4/3.7] overflow-hidden rounded-xl bg-gradient-to-b md:aspect-[4/4.4] md:w-[38%] md:shrink-0 md:self-start',
                    stacked ? 'lg:aspect-[4/4.1] lg:w-auto lg:self-auto' : '',
                    a.panel,
                  )}
                >
                  <m.span aria-hidden variants={bloom} custom={i} className={cn('absolute left-1/2 top-[56%] -z-10 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full', a.halo)} />
                  {member.eyebrow && (
                    <span className="absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-charcoal-900 shadow-sm ring-1 ring-black/5">
                      <span aria-hidden className={cn('size-2 rounded-full', a.dot)} />
                      {member.eyebrow}
                    </span>
                  )}
                  {hasPhoto ? (
                    <m.div variants={rise} custom={i} className="absolute inset-x-[8%] bottom-0 top-[11%]">
                      <Img
                        media={member.image}
                        variant="card"
                        alt={mediaAlt(member.image, member.heading ?? '')}
                        fill
                        sizes="(max-width:768px) 80vw, (max-width:1024px) 30vw, 340px"
                        className="origin-bottom object-contain object-bottom transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    </m.div>
                  ) : (
                    <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-7xl font-bold text-charcoal-900/10">
                      {(member.heading ?? member.eyebrow ?? '').trim().charAt(0)}
                    </span>
                  )}
                </div>

                {/* the name and the story */}
                <div className="flex min-w-0 flex-1 flex-col px-3 pb-5 pt-5 md:justify-center md:px-4 md:py-4 lg:justify-start lg:px-3 lg:pb-6 lg:pt-6">
                  {member.heading && <h3 className="font-display text-[1.3rem] font-bold leading-snug tracking-tight text-charcoal-950 md:text-[1.45rem] lg:text-[1.3rem] xl:text-[1.4rem]">{member.heading}</h3>}
                  <m.span aria-hidden variants={draw} custom={i} className={cn('mt-3 block h-1 w-12 origin-left rounded-full', a.rule)} />
                  <RichText readMore html={member.body} className="mt-4 text-[0.97rem] leading-[1.8] text-slate-600" />
                </div>

                {/* a coloured foot, so a card with a shorter story still ends in line with its neighbours */}
                <m.span aria-hidden variants={draw} custom={i} className={cn('absolute inset-x-6 bottom-0 h-1 origin-left rounded-t-full', a.rule)} />
              </StaggerItem>
            )
          })}
        </Stagger>
      </section>

      {after.length > 0 && <PageBlocks blocks={after} design="stitch" />}
    </div>
  )
}
