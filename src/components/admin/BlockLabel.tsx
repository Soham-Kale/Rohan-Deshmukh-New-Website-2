'use client'

import { useRowLabel } from '@payloadcms/ui'

type Data = { heading?: string; eyebrow?: string; text?: string; question?: string; title?: string; hidden?: boolean; slides?: unknown[]; items?: unknown[]; youtubeUrl?: string }

/** Block header: "01 · Hero slider · <section heading> · Hidden" instead of "Untitled" */
export function BlockLabel({ label }: { label: string }) {
  const { data, rowNumber } = useRowLabel<Data>()
  const summary =
    data?.heading || data?.eyebrow || data?.title || data?.question ||
    (data?.slides ? `${data.slides.length} slides` : '') ||
    (data?.text ? String(data.text).slice(0, 70) : '') || data?.youtubeUrl || ''
  return (
    <span className="rd-block-label">
      <span className="rd-block-label__num">{String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
      <span className="rd-block-label__type">{label}</span>
      {summary && <span className="rd-block-label__summary">{summary}</span>}
      {data?.hidden && <span className="rd-pill rd-pill--spam">Hidden</span>}
    </span>
  )
}
