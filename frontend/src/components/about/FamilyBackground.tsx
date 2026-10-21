import type { Page } from '@/types/cms'
import { cn } from '@/lib/utils'
import { mediaAlt, mediaUrl, photoFit } from '@/lib/media'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'
import { Img } from '@/components/ui/Img'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Motion'

type Block = NonNullable<Page['layout']>[number]
type MediaText = Extract<Block, { blockType: 'mediaText' }>
type Content = Extract<Block, { blockType: 'content' }>

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
/** top bar of each generation card: kesariya, green, navy (Stitch) */
const BARS = ['bg-saffron-600', 'bg-leaf-600', 'bg-charcoal-950']

/**
 * कौटुंबिक पार्श्वभूमी page (Stitch design, Oct 2026): the family introduction beside its heading, then the family
 * members (the page's consecutive Media + text blocks, edited under Pages in the admin) as generation cards side by side —
 * coloured top bar, relation badge, portrait, name and story. Blocks before/after render as usual.
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
  const cols = members.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : members.length === 2 ? 'md:grid-cols-2' : ''

  return (
    <div className="space-y-16 md:space-y-24">
      {before.length > 0 && <PageBlocks blocks={before} design="stitch" />}

      <section className="flex flex-col gap-12">
        {intro && (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              {intro.eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron-600">{intro.eyebrow}</p>}
              {intro.heading && <h2 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-charcoal-950 sm:text-4xl">{intro.heading}</h2>}
              <span aria-hidden className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-saffron-600 to-leaf-600" />
            </Reveal>
            <Reveal delay={0.1} className="rounded-xl border-l-4 border-saffron-500 bg-cream p-6 shadow-sm md:p-8 lg:col-span-7">
              <RichText html={intro.body} />
            </Reveal>
          </div>
        )}

        <Stagger className={cn('grid grid-cols-1 items-stretch gap-8', cols)}>
          {members.map((m, i) => (
            <StaggerItem as="article" key={m.id ?? i} className="group relative flex flex-col overflow-hidden rounded-xl bg-white p-6 shadow-md ring-1 ring-stone-200/70 transition-shadow duration-300 hover:shadow-xl md:p-8">
              <span aria-hidden className={cn('absolute inset-x-0 top-0 h-1.5', BARS[i % BARS.length])} />
              <div className="mb-6 flex items-center justify-between gap-2">
                {m.eyebrow ? <span className="inline-block rounded-full bg-cream px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-charcoal-900">{m.eyebrow}</span> : <span />}
                <span aria-hidden className={cn('font-display text-sm font-bold', i % 3 === 1 ? 'text-leaf-600' : 'text-saffron-600')}>{ROMAN[i] ?? i + 1}</span>
              </div>
              {mediaUrl(m.image, 'card') && (
                <div className="relative mb-6 h-72 w-full overflow-hidden rounded-lg bg-cream shadow-sm">
                  <Img media={m.image} variant="card" alt={mediaAlt(m.image, m.heading ?? '')} fill sizes="(max-width:768px) 92vw, (max-width:1024px) 45vw, 380px" className="h-full w-full transition-transform duration-500 group-hover:scale-105" style={photoFit(m.image, 1.3, 0.35)} />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
                </div>
              )}
              {m.heading && <h3 className="mb-4 font-display text-xl font-bold leading-snug text-charcoal-950 md:text-2xl">{m.heading}</h3>}
              <RichText html={m.body} className="!text-[0.98rem]" />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {after.length > 0 && <PageBlocks blocks={after} design="stitch" />}
    </div>
  )
}
