import type { Category, Post } from '@/payload-types'
import { toMarathiDigits } from './utils'

type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }
const rootOf = (content: unknown): LexNode | null =>
  content && typeof content === 'object' && 'root' in content ? ((content as { root: LexNode }).root ?? null) : null

/** Plain text of a Lexical node tree */
export const lexicalText = (n?: LexNode | null): string =>
  !n ? '' : (n.text ?? '') + (n.children ?? []).map((c) => ` ${lexicalText(c)}`).join('')

/** Estimated reading time in minutes (≈180 words a minute for Marathi/English news prose) */
export const readMinutes = (post: Pick<Post, 'content' | 'excerpt'>): number => {
  const words = (lexicalText(rootOf(post.content)) || post.excerpt || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

/** "३ मिनिटे वाचन" / "3 min read" */
export const readTimeLabel = (post: Pick<Post, 'content' | 'excerpt'>, locale: string) => {
  const n = readMinutes(post)
  return locale === 'mr' ? `${toMarathiDigits(n)} मिनिटे वाचन` : `${n} min read`
}

/** Section headings (h2/h3) of an article, in order — used for the "key points" box; ids match RichText anchors */
export const articleHeadings = (content: unknown): { id: string; text: string }[] =>
  (rootOf(content)?.children ?? [])
    .filter((n) => n.type === 'heading' && (n.tag === 'h2' || n.tag === 'h3'))
    .map((n, i) => ({ id: `sec-${i + 1}`, text: lexicalText(n).replace(/\s+/g, ' ').trim() }))
    .filter((h) => h.text)

/** First category of a post (populated), if any */
export const primaryCategory = (post: Post): Category | null => {
  const c = post.categories?.find((x) => typeof x === 'object')
  return (c as Category) ?? null
}

/** Long newspaper date, e.g. "मंगळवार, १३ ऑक्टोबर, २०२६" */
export const longDate = (d: Date, locale: string) =>
  new Intl.DateTimeFormat(locale === 'mr' ? 'mr-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(d)
