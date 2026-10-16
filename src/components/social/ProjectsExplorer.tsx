'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { ArrowRight, ExternalLink, Newspaper, Search, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type ProjectCard = {
  id: string | number
  href: string
  title: string
  category: string
  categoryLabel: string
  stat?: string | null
  text?: string | null
  image?: string | null
  imageAlt?: string
  imageStyle?: CSSProperties
}

type Labels = { all: string; search: string; readMore: string; details: string; empty: string; clear: string; filters: string }

const DEVANAGARI = '०१२३४५६७८९'

/**
 * "Explore all initiatives" — same layout as lokmangalfoundation.com/projects:
 * category chips with counts + search, then a 3-column grid of cards
 * (photo with category tag, title, key-impact line, short description, Read more).
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
                  on ? 'border-charcoal-900 bg-charcoal-900 text-white shadow-md shadow-charcoal-900/15' : 'border-line bg-white text-charcoal-900 hover:border-frame hover:bg-cream',
                )}
              >
                {c.label}
                <span className={cn('grid min-w-6 place-items-center rounded-full px-1.5 text-xs leading-5', on ? 'bg-saffron-500 text-white' : 'bg-cream text-saffron-700')}>{n(c.count)}</span>
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
        <ul className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_16px_rgb(20_33_61/0.05)] transition duration-300 hover:-translate-y-1 hover:border-frame hover:shadow-xl hover:shadow-charcoal-900/10">
              <div className="relative overflow-hidden">
                {p.image ? (
                  <div className="relative aspect-[16/10] bg-cream">
                    <Image src={p.image} alt={p.imageAlt ?? p.title} fill sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" style={p.imageStyle} />
                  </div>
                ) : (
                  <div className="grid aspect-[16/10] place-items-center bg-cream">
                    <Newspaper aria-hidden className="size-11 text-saffron-600" strokeWidth={1.5} />
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[0.7rem] font-bold text-charcoal-900 shadow-sm backdrop-blur-sm">{p.categoryLabel}</span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug text-charcoal-900 transition group-hover:text-saffron-700 sm:text-lg">
                  <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">{p.title}</Link>
                </h3>
                {p.stat && <p className="mt-2.5 self-start rounded-md bg-saffron-50 px-2.5 py-1 text-xs font-bold leading-snug text-saffron-700">{p.stat}</p>}
                {p.text && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{p.text}</p>}
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-line px-5 py-3">
                <Link href={p.href} className="inline-flex items-center gap-1.5 text-sm font-bold text-saffron-700 transition hover:text-saffron-600">
                  {labels.readMore} <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link href={p.href} title={labels.details} aria-label={`${labels.details}: ${p.title}`} className="text-muted transition hover:text-charcoal-900">
                  <ExternalLink aria-hidden className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
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
