'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** Sticky in-page tabs: jump to a section; the tab of the section being read is highlighted */
export function SectionTabs({ tabs, label }: { tabs: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id)

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (seen[0]) setActive(seen[0].target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))

    // arriving from a menu link like /lokmangal/foundation#projects: jump to that section once the page has laid out
    const jump = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!tabs.some((t) => t.id === id)) return
      setActive(id)
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
    const timer = window.setTimeout(jump, 150)
    window.addEventListener('hashchange', jump)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      window.removeEventListener('hashchange', jump)
    }
  }, [tabs])

  return (
    <nav aria-label={label} className="sticky top-16 z-30 -mx-4 mb-10 border-b border-line bg-paper/95 px-4 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-2">
      <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
        {tabs.map((t) => (
          <li key={t.id} className="shrink-0">
            <a
              href={`#${t.id}`}
              onClick={() => setActive(t.id)}
              aria-current={active === t.id ? 'true' : undefined}
              className={cn(
                'block rounded-full px-5 py-2.5 text-[0.98rem] font-semibold transition',
                active === t.id ? 'bg-charcoal-900 text-white' : 'text-muted hover:bg-cream hover:text-charcoal-900',
              )}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
