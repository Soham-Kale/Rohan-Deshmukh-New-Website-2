import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/utils'

type Node = { type?: string; tag?: string; children?: Node[] }

/**
 * Lexical rich text. With `anchors`, top-level h2/h3 get ids `sec-1`, `sec-2`… in order
 * (same order as `articleHeadings()` in lib/blog.ts, used by the article "key points" box).
 */
export function RichText({ data, className, anchors }: { data?: unknown; className?: string; anchors?: boolean }) {
  if (!data || typeof data !== 'object' || !('root' in (data as object))) return null
  // An image whose media file was deleted is stored as an upload node with value null — skip it instead of crashing
  let converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: (args) => {
      const v = (args.node as { value?: unknown }).value
      if (!v || typeof v !== 'object' || !(v as { url?: string }).url) return null
      const render = defaultConverters.upload
      return typeof render === 'function' ? render(args as never) : null
    },
  })
  if (anchors) {
    const base = converters
    const ids = new WeakMap<object, string>()
    let n = 0
    for (const node of ((data as { root: Node }).root.children ?? []) as Node[]) {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) ids.set(node, `sec-${++n}`)
    }
    converters = (a) => ({
      ...base(a),
      heading: ({ node, nodesToJSX }) => {
        const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h2') as 'h2'
        return <Tag id={ids.get(node)} className="scroll-mt-28">{nodesToJSX({ nodes: node.children })}</Tag>
      },
    })
  }
  return <LexicalRichText data={data as SerializedEditorState} converters={converters} className={cn('prose-rd', className)} />
}
