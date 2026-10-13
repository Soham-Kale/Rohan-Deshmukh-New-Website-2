'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function YearTabs({ tabs }: { tabs: { key: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key)
  if (!tabs.length) return null
  return (
    <div>
      <div role="tablist" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={active === t.key} onClick={() => setActive(t.key)}
            className={cn('shrink-0 rounded-full border px-5 py-2 font-display text-lg transition', active === t.key ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-line bg-white text-muted hover:text-charcoal-900')}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => <div key={t.key} role="tabpanel" hidden={active !== t.key}>{t.content}</div>)}
    </div>
  )
}
