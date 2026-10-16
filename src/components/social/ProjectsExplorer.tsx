'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type ProjectCard = {
  id: string | number
  href: string
  title: string
  category: string
  categoryLabel: string
  featured?: boolean | null
  stat?: string | null
  text?: string | null
  image?: string | null
  imageAlt?: string
  imageStyle?: CSSProperties
}

type Labels = { all: string; search: string; readMore: string; details: string; empty: string; clear: string; filters: string; featured: string; prev: string; next: string; slide: string }

const DEVANAGARI = '०१२३४५६७८९'

/**
 * "Featured highlight + grid cards" layout for the 23 Lokmangal initiatives:
 * category chips with counts + search → a large slider of the main (featured) initiatives →
 * a grid of cards (photo, key-impact line + category tag, title, short description, Read more).
 * Filters and search apply to both the slider and the grid.
 */
export function ProjectsExplorer({ items, categories, labels, locale }: { items: ProjectCard[]; categories: { value: string; label: string }[]; labels: Labels; locale: 'mr' | 'en' }) {
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')
  const n = (v: number) => (locale === 'mr' ? String(v).replace(/\d/g, (d) => DEVANAGARI[Number(d)]) : String(v))

  const chips = useMemo(
    () => [{ value: '', label: labels.all, count: items.length }, ...categories.map((c) => ({ ...c, count: items.filter((i) => i.category === c.value).length })).filter((c) => c.count > 0)],
    [items, categories, labels.all],
  )

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter((i) => (!cat || i.category === cat) && (!term || [i.title, i.stat, i.text, i.categoryLabel].some((s) => s?.toLowerCase().includes(term))))
  }, [items, cat, q])

  // main initiatives go in the slider (only when there are at least two cards in view, so a single result still shows as a card)
  const featured = shown.length > 1 ? shown.filter((i) => i.featured) : []
  const grid = featured.length ? shown.filter((i) => !i.featured) : shown

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <div role="group" aria-label={labels.filters} className="flex flex-wrap justify-center gap-2">
          {chips.map((c) => {
            const on = cat === c.value
            return (
              <button
                key={c.value || 'all'}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
                  on ? 'border-saffron-500 bg-saffron-500 text-white shadow-md shadow-saffron-500/25' : 'border-line bg-white text-charcoal-900 hover:border-frame hover:bg-cream',
                )}
              >
                {c.label}
                <span className={cn('grid min-w-6 place-items-center rounded-full px-1.5 text-xs leading-5', on ? 'bg-white/25 text-white' : 'bg-cream text-saffron-700')}>{n(c.count)}</span>
              </button>
            )
          })}
        </div>

        <label className="relative block w-full max-w-md">
          <span className="sr-only">{labels.search}</span>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.search}
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-900 outline-none transition placeholder:text-muted focus:border-saffron-400 focus:ring-4 focus:ring-saffron-100"
          />
        </label>
      </div>

      {shown.length ? (
        <>
          {featured.length > 0 && <FeaturedSlider key={`${cat}|${q}`} items={featured} labels={labels} n={n} />}
          {grid.length > 0 && (
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
              {grid.map((p) => <GridCard key={p.id} p={p} labels={labels} />)}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-2xl bg-cream p-10 text-center">
          <p className="text-muted">{labels.empty}</p>
          <button type="button" onClick={() => { setQ(''); setCat('') }} className="btn btn-light mt-4 border border-line px-5 py-2">
            <X aria-hidden className="size-4" /> {labels.clear}
          </button>
        </div>
      )}
    </div>
  )
}

/** Photo, or a soft placeholder with an icon when an initiative has none */
function Photo({ p, sizes, className }: { p: ProjectCard; sizes: string; className?: string }) {
  return p.image ? (
    <Image src={p.image} alt={p.imageAlt ?? p.title} fill sizes={sizes} className={cn('object-cover', className)} style={p.imageStyle} />
  ) : (
    <div className="absolute inset-0 grid place-items-center bg-cream">
      <Newspaper aria-hidden className="size-11 text-saffron-600" strokeWidth={1.5} />
    </div>
  )
}

/** Large navy highlight card: photo left, story right; arrows, dots and a gentle auto-advance */
function FeaturedSlider({ items, labels, n }: { items: ProjectCard[]; labels: Labels; n: (v: number) => string }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length
  const go = useCallback((to: number) => setI(((to % count) + count) % count), [count])

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((v) => (v + 1) % count), 6500)
    return () => window.clearInterval(t)
  }, [count, paused])

  const p = items[Math.min(i, count - 1)]
  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.featured}
      className="mt-8 md:mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-[1.6rem] bg-charcoal-900 shadow-[0_24px_60px_-30px_rgb(20_33_61/0.55)]">
        <div key={p.id} aria-roledescription="slide" aria-label={`${n(i + 1)} / ${n(count)}`} className="grid animate-fade-up md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px]">
            <Photo p={p} sizes="(max-width:768px) 100vw, 640px" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <Sparkles aria-hidden className="size-3.5" /> {labels.featured}
            </span>
          </div>

          <div className="on-dark relative flex flex-col p-6 text-white sm:p-8 lg:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full border-[28px] border-white/5" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {p.stat && <span className="inline-flex items-center gap-1.5 font-semibold text-saffron-300"><TrendingUp aria-hidden className="size-4" /> {p.stat}</span>}
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/85">{p.categoryLabel}</span>
            </div>
            <h3 className="mt-3 text-[1.45rem] leading-snug text-white md:text-[1.75rem]">{p.title}</h3>
            {p.text && <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-white/70 md:line-clamp-4">{p.text}</p>}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:mt-auto md:pt-6">
              <Link href={p.href} className="btn btn-primary px-5 py-2.5">
                {labels.readMore} <ArrowRight aria-hidden className="size-4" />
              </Link>
              {count > 1 && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => go(i - 1)} aria-label={labels.prev} className="grid size-10 place-items-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white/10">
                    <ChevronLeft aria-hidden className="size-5" />
                  </button>
                  <button type="button" onClick={() => go(i + 1)} aria-label={labels.next} className="grid size-10 place-items-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white/10">
                    <ChevronRight aria-hidden className="size-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((it, k) => (
            <button
              key={it.id}
              type="button"
              onClick={() => go(k)}
              aria-label={`${labels.slide} ${n(k + 1)}`}
              aria-current={k === i ? 'true' : undefined}
              className={cn('h-2 rounded-full transition-all', k === i ? 'w-7 bg-saffron-500' : 'w-2 bg-frame hover:bg-saffron-400')}
            />
          ))}
        </div>
      )}
    </section>
  )
}

/** Grid card: photo on top (thumbnail beside the text on phones), key impact + category, title, text, Read more */
function GridCard({ p, labels }: { p: ProjectCard; labels: Labels }) {
  return (
    <li className="group relative flex overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_16px_rgb(20_33_61/0.05)] transition duration-300 hover:-translate-y-1 hover:border-frame hover:shadow-xl hover:shadow-charcoal-900/10 md:flex-col">
      <div className="relative w-28 shrink-0 overflow-hidden bg-cream sm:w-36 md:aspect-[16/10] md:w-full">
        <Photo p={p} sizes="(max-width:768px) 144px, (max-width:1024px) 50vw, 400px" className="transition duration-500 group-hover:scale-105" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          {p.stat ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold text-muted">
              <TrendingUp aria-hidden className="size-3.5 shrink-0 text-saffron-600" /> <span className="line-clamp-1">{p.stat}</span>
            </span>
          ) : <span />}
          <span className="shrink-0 rounded-full bg-saffron-50 px-2.5 py-0.5 text-[0.7rem] font-bold text-saffron-700">{p.categoryLabel}</span>
        </div>
        <h3 className="mt-2 text-[0.98rem] font-bold leading-snug text-charcoal-900 transition group-hover:text-saffron-700 md:mt-3 md:text-lg">
          <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">{p.title}</Link>
        </h3>
        {p.text && <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:line-clamp-2 md:line-clamp-3">{p.text}</p>}

        <div className="mt-auto flex items-center justify-between pt-3 md:pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-saffron-700">
            {labels.readMore} <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
          </span>
          <span aria-hidden className="grid size-8 place-items-center rounded-full border border-line text-charcoal-900 transition group-hover:border-saffron-500 group-hover:bg-saffron-500 group-hover:text-white">
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </li>
  )
}
