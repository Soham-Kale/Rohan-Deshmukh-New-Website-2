'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function YearTabs({ tabs }: { tabs: { key: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key)
  if (!tabs.length) return null
  return (
    <div>
      <div role="tablist" className="no-scrollbar -mx-4 mb-10 flex gap-7 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={active === t.key} onClick={() => setActive(t.key)}
            className={cn('relative shrink-0 py-3.5 font-display text-lg font-semibold transition after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-full', active === t.key ? 'text-charcoal-900 after:bg-saffron-500' : 'text-muted hover:text-charcoal-900')}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => <div key={t.key} role="tabpanel" hidden={active !== t.key}>{t.content}</div>)}
    </div>
  )
}
