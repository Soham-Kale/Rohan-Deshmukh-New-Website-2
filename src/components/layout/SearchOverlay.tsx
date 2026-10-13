'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'

type Hit = { id: string; title: string; excerpt?: string; url?: string; doc?: { relationTo: string } }

export function SearchOverlay({ open, onClose, locale, t }: { open: boolean; onClose: () => void; locale: string; t: { placeholder: string; hint: string; noResults: string; close: string } }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (q.trim().length < 2) return setHits([])
    const ctrl = new AbortController()
    const id = setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ locale, limit: '8', depth: '0' })
        params.set('where[or][0][title][like]', q)
        params.set('where[or][1][excerpt][like]', q)
        const res = await fetch(`/api/search?${params}`, { signal: ctrl.signal })
        const data = await res.json()
        setHits(data.docs ?? [])
      } catch {}
      setLoading(false)
    }, 220)
    return () => {
      clearTimeout(id)
      ctrl.abort()
    }
  }, [q, locale])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] bg-charcoal-950/80 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="container-x pt-[12vh]" onClick={(e) => e.stopPropagation()}>
        <form
          className="mx-auto max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault()
            if (q.trim()) {
              router.push(`/search?q=${encodeURIComponent(q.trim())}`)
              onClose()
            }
          }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-2xl">
            <Search className="size-5 text-muted" />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.placeholder} className="flex-1 bg-transparent text-lg outline-none" aria-label={t.placeholder} />
            <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-cream" aria-label={t.close}>
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-2xl empty:hidden">
            {q.trim().length < 2 ? (
              <p className="px-5 py-4 text-sm text-muted">{t.hint}</p>
            ) : hits.length ? (
              <ul className="divide-y divide-line">
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link href={h.url || '/'} onClick={onClose} className="group flex items-start gap-3 px-5 py-3.5 hover:bg-saffron-50">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal-900">{h.title}</p>
                        {h.excerpt && <p className="line-clamp-1 text-sm text-muted">{h.excerpt}</p>}
                      </div>
                      <ArrowRight className="mt-1 size-4 text-saffron-600 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <p className="px-5 py-4 text-sm text-muted">{t.noResults}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
