'use client'

import type { DefaultCellComponentProps } from 'payload'
import { useEffect, useState } from 'react'

/** Yes / No instead of "true" / "false" */
export function BooleanCell({ cellData }: DefaultCellComponentProps) {
  return cellData ? <span className="rd-pill rd-pill--yes">✓ Yes</span> : <span className="rd-pill rd-pill--no">—</span>
}

/** Coloured status pill for inbox items */
export function StatusCell({ cellData }: DefaultCellComponentProps) {
  const v = String(cellData || 'new')
  const label: Record<string, string> = { new: 'New', 'in-progress': 'In progress', resolved: 'Resolved', spam: 'Spam' }
  return <span className={`rd-pill rd-pill--${v}`}>{label[v] ?? v}</span>
}

/** Small image preview for upload fields in list views */
export function ThumbCell({ cellData }: DefaultCellComponentProps) {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    // same-site media URLs are made relative so they work on any host/port
    const rel = (u?: string | null) => (u ? u.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : null)
    const pick = (d: any) => rel(d?.sizes?.thumb?.url || d?.thumbnailURL || d?.url)
    if (!cellData) return setSrc(null)
    if (typeof cellData === 'object') return setSrc(pick(cellData))
    let live = true
    fetch(`/api/media/${cellData}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && setSrc(pick(d)))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [cellData])
  if (!cellData) return <span className="rd-thumb rd-thumb--empty" />
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img className="rd-thumb" src={src} alt="" loading="lazy" /> : <span className="rd-thumb rd-thumb--empty" />
}
