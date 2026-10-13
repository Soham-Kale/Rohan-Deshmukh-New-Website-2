'use client'

import { useEffect, useState } from 'react'
import { Printer, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

const SIZES = [
  { label: 'A', scale: 1 },
  { label: 'A+', scale: 1.12 },
  { label: 'A++', scale: 1.25 },
]
const KEY = 'rd-article-size'

/** Text size switch (A / A+ / A++) for the article body, plus print — remembered per reader */
export function ArticleTools({ target, sizeLabel, printLabel }: { target: string; sizeLabel: string; printLabel: string }) {
  const [size, setSize] = useState(0)

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(KEY))
      if (saved > 0 && saved < SIZES.length) setSize(saved)
    } catch { /* storage unavailable */ }
  }, [])

  useEffect(() => {
    document.getElementById(target)?.style.setProperty('--article-scale', String(SIZES[size].scale))
    try { localStorage.setItem(KEY, String(size)) } catch { /* storage unavailable */ }
  }, [size, target])

  return (
    <div className="no-print flex items-center gap-1.5 text-sm text-muted">
      <Type className="size-4" aria-hidden />
      <span className="mr-1">{sizeLabel}:</span>
      {SIZES.map((s, i) => (
        <button
          key={s.label}
          type="button"
          onClick={() => setSize(i)}
          aria-pressed={size === i}
          className={cn('h-7 min-w-8 rounded-md px-2 text-xs font-semibold transition', size === i ? 'bg-charcoal-900 text-white' : 'bg-cream text-charcoal-800 hover:bg-line')}
        >
          {s.label}
        </button>
      ))}
      <button type="button" onClick={() => window.print()} aria-label={printLabel} title={printLabel} className="ml-1.5 grid size-8 place-items-center rounded-md text-charcoal-800 transition hover:bg-cream">
        <Printer className="size-4" />
      </button>
    </div>
  )
}
