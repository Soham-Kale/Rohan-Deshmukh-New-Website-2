import { createElement, type ReactNode } from 'react'
import { Building2, Factory, GraduationCap, HeartHandshake, Landmark, Newspaper, type LucideIcon } from 'lucide-react'
import type { Page } from '@/types/cms'
import { cn } from '@/lib/utils'
import { mediaUrl } from '@/lib/media'
import { PageBlocks } from '@/components/blocks/PageBlocks'
import { RichText } from '@/components/ui/RichText'
import { CMSLink } from '@/components/ui/CMSLink'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Motion'

type Block = NonNullable<Page['layout']>[number]
type Content = Extract<Block, { blockType: 'content' }>
type Cards = Extract<Block, { blockType: 'cards' }>

const DEVANAGARI = '०१२३४५६७८९'
const num = (n: number, locale: string, width = 1) => {
  const s = String(n).padStart(width, '0')
  return locale === 'mr' ? s.replace(/\d/g, (d) => DEVANAGARI[Number(d)]) : s
}

/** an icon for each sector, picked from its heading (English or Marathi); a building when nothing matches */
const SECTOR_ICONS: [RegExp, LucideIcon][] = [
  [/financ|bank|वित्त|बँक/i, Landmark],
  [/indust|उद्योग/i, Factory],
  [/educat|शिक्षण/i, GraduationCap],
  [/foundation|social|research|फाऊंडेशन|सामाजिक|संशोधन/i, HeartHandshake],
  [/media|माध्यम/i, Newspaper],
]
const sectorIcon = (heading?: string | null) => SECTOR_ICONS.find(([re]) => re.test(heading ?? ''))?.[1] ?? Building2
const SectorIcon = ({ heading, className }: { heading?: string | null; className?: string }) => createElement(sectorIcon(heading), { className, 'aria-hidden': true })

/** kesariya, green, navy — the site's three accents, one per sector in turn */
const ACCENTS = [
  { text: 'text-saffron-600', soft: 'bg-saffron-500/10 text-saffron-600', solid: 'group-hover:bg-saffron-600 group-hover:text-white', bar: 'bg-saffron-500', ring: 'hover:ring-saffron-300', tile: 'text-saffron-500' },
  { text: 'text-leaf-600', soft: 'bg-leaf-600/10 text-leaf-600', solid: 'group-hover:bg-leaf-600 group-hover:text-white', bar: 'bg-leaf-600', ring: 'hover:ring-leaf-200', tile: 'text-leaf-200' },
  { text: 'text-charcoal-800', soft: 'bg-charcoal-950/[0.07] text-charcoal-900', solid: 'group-hover:bg-charcoal-950 group-hover:text-white', bar: 'bg-charcoal-950', ring: 'hover:ring-charcoal-800/30', tile: 'text-white' },
]

/** splits the intro's rich text into its paragraphs and its list items ("<strong>Title:</strong> text"), so the list can become cards */
function splitIntro(html?: string | null) {
  if (!html) return null
  const items = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => {
    const t = m[1].match(/^\s*<strong>([\s\S]*?)<\/strong>\s*([\s\S]*)$/)
    return t ? { title: t[1].replace(/[:：]\s*$/, ''), body: t[2] } : { title: '', body: m[1] }
  })
  if (!items.length) return null
  const lead = html.replace(/<(ul|ol)>[\s\S]*?<\/\1>/g, '').trim()
  return { lead, items }
}

/**
 * लोकमंगल परिवार page (redesign, Oct 2026) — the page's blocks from Pages in the admin, laid out as:
 *  - the opening Content block: heading + text in a card, its bullet list as numbered value cards beside it
 *  - every Cards block without photos is a sector: a navy overview band lists all sectors (count + name, links to the sector),
 *    then each sector gets its own section — icon, label, heading, intro — with its institutions as numbered cards
 *  - any other block renders as usual, after them
 */
export function LokmangalParivar({ blocks, locale }: { blocks?: Block[] | null; locale: 'mr' | 'en' }) {
  const list = (blocks ?? []).filter((b) => !('hidden' in b && b.hidden))
  const intro = list[0]?.blockType === 'content' ? (list[0] as Content) : null
  const sectors = list.filter((b): b is Cards => b.blockType === 'cards' && !b.items?.some((c) => mediaUrl(c.image, 'card')) && (b.items?.length ?? 0) > 0)
  const rest = list.filter((b) => b !== intro && !sectors.includes(b as Cards))
  const parts = splitIntro(intro?.body)

  return (
    <div>
      {intro && (
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(9,20,34,0.12)] md:p-10 lg:col-span-7">
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-40 rounded-bl-full bg-gradient-to-bl from-saffron-100/70 to-transparent" />
            <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-saffron-600 via-saffron-500 to-leaf-600" />
            <div className="relative">
              {intro.eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-saffron-600">{intro.eyebrow}</p>}
              {intro.heading && <h2 className="mb-5 mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-charcoal-950 sm:text-4xl">{intro.heading}</h2>}
              <RichText html={parts ? parts.lead : intro.body} />
            </div>
          </Reveal>
          {parts && (
            <Stagger as="ol" className="flex flex-col gap-3 lg:col-span-5">
              {parts.items.map((it, i) => {
                const a = ACCENTS[i % 2]
                return (
                  <StaggerItem as="li" key={i} className="group flex gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <span aria-hidden className={cn('grid size-10 shrink-0 place-items-center rounded-lg font-display text-sm font-bold transition-colors', a.soft, a.solid)}>{num(i + 1, locale, 2)}</span>
                    <div className="min-w-0">
                      {it.title && <h3 className="font-display text-base font-bold leading-snug text-charcoal-950">{it.title}</h3>}
                      <RichText html={it.body} className="mt-1 !text-[0.92rem] !leading-relaxed [&_p]:!m-0" />
                    </div>
                  </StaggerItem>
                )
              })}
            </Stagger>
          )}
        </section>
      )}

      {sectors.length > 0 && (
        <>
          {/* navy overview: every sector with its number of institutions, each one jumps to its section */}
          <section className="on-dark relative left-1/2 mt-16 w-screen -translate-x-1/2 overflow-hidden border-y-4 border-y-saffron-500 bg-gradient-to-b from-charcoal-950 via-[#0c1a2e] to-[#10233d] text-white md:mt-24">
            <div aria-hidden className="glow-tl" />
            <div aria-hidden className="glow-br" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.035] [background-size:24px_24px]" />
            <Stagger as="ul" className={cn('container-x relative grid grid-cols-2 gap-px py-12 md:py-14', sectors.length >= 5 ? 'md:grid-cols-3 lg:grid-cols-5' : sectors.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3')}>
              {sectors.map((s, i) => {
                const a = ACCENTS[i % ACCENTS.length]
                return (
                  <StaggerItem as="li" key={s.id ?? i} className={cn(sectors.length % 2 === 1 && i === sectors.length - 1 && 'max-md:col-span-2')}>
                    <a href={`#sector-${i}`} className="group flex h-full flex-col gap-2 rounded-xl p-4 transition-colors hover:bg-white/5 md:p-5">
                      <SectorIcon heading={s.heading} className="size-6 text-saffron-500 transition-transform group-hover:-translate-y-0.5" />
                      <span className={cn('font-display text-4xl font-bold leading-none tracking-tight lg:text-5xl', a.tile)}>{num(s.items?.length ?? 0, locale)}</span>
                      <span className="text-sm font-semibold leading-snug text-white">{s.heading}</span>
                      {s.intro && <span className="text-xs leading-snug text-slate-400">{s.intro}</span>}
                    </a>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </section>

          <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
            {sectors.map((s, i) => (
              <Sector key={s.id ?? i} block={s} index={i} locale={locale} />
            ))}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <div className="mt-16 md:mt-24">
          <PageBlocks blocks={rest} design="stitch" />
        </div>
      )}
    </div>
  )
}

/** an institution card is a link when the admin gives it one */
const CardBox = ({ url, className, children }: { url?: string | null; className?: string; children: ReactNode }) =>
  url ? <CMSLink url={url} className={className}>{children}</CMSLink> : <div className={className}>{children}</div>

function Sector({ block, index, locale }: { block: Cards; index: number; locale: 'mr' | 'en' }) {
  const a = ACCENTS[index % ACCENTS.length]
  const items = block.items ?? []
  return (
    <section id={`sector-${index}`} className="grid scroll-mt-28 grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className="relative lg:col-span-4">
        <span aria-hidden className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[7rem] font-bold leading-none text-charcoal-950/[0.04] lg:-right-2">
          {num(index + 1, locale, 2)}
        </span>
        <div className="relative flex flex-col gap-3">
          <span className={cn('grid size-14 place-items-center rounded-2xl shadow-sm', index % ACCENTS.length === 2 ? 'bg-charcoal-950 text-white' : index % ACCENTS.length === 1 ? 'bg-leaf-600 text-white' : 'bg-gradient-to-br from-saffron-600 via-saffron-500 to-[#f97316] text-white')}>
            <SectorIcon heading={block.heading} className="size-7" />
          </span>
          {block.eyebrow && <span className={cn('mt-2 text-[11px] font-bold uppercase tracking-[0.2em]', a.text)}>{block.eyebrow}</span>}
          {block.heading && <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-charcoal-950 sm:text-4xl">{block.heading}</h2>}
          {block.intro && <p className="text-base leading-relaxed text-gray-600">{block.intro}</p>}
          <span aria-hidden className={cn('mt-2 block h-1 w-14 rounded-full', a.bar)} />
        </div>
      </Reveal>
      <Stagger as="ul" className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8', items.length === 1 && 'sm:grid-cols-1')}>
        {items.map((c, k) => (
          <StaggerItem as="li" key={c.id ?? k} className="h-full">
            <CardBox url={c.url} className={cn('group relative flex h-full items-start gap-4 overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:p-6', a.ring)}>
              <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100', a.bar)} />
              <span aria-hidden className={cn('grid size-10 shrink-0 place-items-center rounded-lg font-display text-sm font-bold transition-colors', a.soft, a.solid)}>{num(k + 1, locale, 2)}</span>
              <div className="min-w-0 pt-1.5">
                <h3 className="font-display text-[1.05rem] font-bold leading-snug text-charcoal-950">{c.title}</h3>
                {c.meta && <p className={cn('mt-1 text-[11px] font-bold uppercase tracking-wider', a.text)}>{c.meta}</p>}
                {c.text && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{c.text}</p>}
              </div>
            </CardBox>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
