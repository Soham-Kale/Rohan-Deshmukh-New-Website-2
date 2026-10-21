import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/**
 * Rich text from the CMS. The backend stores it as HTML that it has already cleaned (scripts, event handlers and
 * unsafe links removed, see backend/src/lib/sanitize.js), so it can be shown directly.
 * With `anchors`, h2/h3 get ids `sec-1`, `sec-2`… in order (the same order as `articleHeadings()` in lib/blog.ts,
 * used by the article's "key points" box).
 */
export function RichText({ html, className, anchors }: { html?: string | null; className?: string; anchors?: boolean }) {
  const content = useMemo(() => {
    if (!html || !html.trim()) return ''
    if (!anchors) return html
    let n = 0
    return html.replace(/<(h[23])>/g, (_, tag: string) => `<${tag} id="sec-${++n}" class="scroll-mt-28">`)
  }, [html, anchors])
  if (!content) return null
  return <div className={cn('prose-rd', className)} dangerouslySetInnerHTML={{ __html: content }} />
}
