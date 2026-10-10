'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FaqAccordion({ items, columns = 1 }: { items: { q: string; a: React.ReactNode }[]; columns?: 1 | 2 }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className={cn('grid gap-3', columns === 2 && 'lg:grid-cols-2 lg:items-start')}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={cn('rounded-2xl border transition', isOpen ? 'border-saffron-300 bg-white shadow-sm' : 'border-line bg-white/60')}>
            <h3 className="font-sans">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-start gap-4 p-5 text-left">
                <span className="font-display text-lg text-saffron-600">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 text-[1.08rem] font-semibold text-maroon-900">{it.q}</span>
                <Plus className={cn('mt-1 size-5 shrink-0 text-saffron-600 transition-transform', isOpen && 'rotate-45')} />
              </button>
            </h3>
            <div className={cn('grid transition-[grid-template-rows] duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pl-[3.6rem] text-muted">{it.a}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
