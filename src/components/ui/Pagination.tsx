import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages, base, query = {} }: { page: number; totalPages: number; base: string; query?: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries({ ...query, page: p > 1 ? String(p) : undefined }).filter(([, v]) => v) as [string, string][])
    const s = q.toString()
    return `${base}${s ? `?${s}` : ''}`
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 && <Link href={href(page - 1)} className="grid size-10 place-items-center rounded-full border border-line hover:bg-cream" aria-label="Previous"><ChevronLeft className="size-4" /></Link>}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <Link href={href(p)} aria-current={p === page ? 'page' : undefined} className={cn('grid size-10 place-items-center rounded-full border font-semibold', p === page ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-line hover:bg-cream')}>{p}</Link>
        </span>
      ))}
      {page < totalPages && <Link href={href(page + 1)} className="grid size-10 place-items-center rounded-full border border-line hover:bg-cream" aria-label="Next"><ChevronRight className="size-4" /></Link>}
    </nav>
  )
}

export function FilterChips({ items, active, base, param = 'category' }: { items: { label: string; value: string }[]; active?: string; base: string; param?: string }) {
  return (
    <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {items.map((it) => {
        const on = (active ?? '') === it.value
        return (
          <Link key={it.value || 'all'} href={it.value ? `${base}?${param}=${encodeURIComponent(it.value)}` : base} aria-current={on ? 'true' : undefined}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-[0.95rem] font-medium transition', on ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-charcoal-900/10 bg-white text-muted hover:border-charcoal-900/30 hover:text-charcoal-900')}>
            {it.label}
          </Link>
        )
      })}
    </div>
  )
}
