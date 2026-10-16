/**
 * Removes emoji from all public website content (both languages): pages, blog, initiatives, events, albums,
 * videos and other content collections, media alt text, and the site settings / menu / footer / home / popup globals.
 * Tick marks (✓ ✔) used as bullets go too; typographic marks stay (→ © ™ ·). Visitor messages and admin users are not touched.
 */
import type { Payload } from 'payload'

/* an emoji: a pictograph shown as emoji (🏦 ✅), or any pictograph forced to emoji with U+FE0F (✍\uFE0F), with skin tones / ZWJ joins, or a flag */
const EMOJI =
  /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)(?:[\u{1F3FB}-\u{1F3FF}]|\uFE0F|\u20E3)*(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})(?:[\u{1F3FB}-\u{1F3FF}]|\uFE0F)*)*|\p{Regional_Indicator}{2}|[\u2713\u2714][ \t]?/gu

export function stripEmoji(s: string): string {
  if (!EMOJI.test(s)) return s
  EMOJI.lastIndex = 0
  return s
    .replace(EMOJI, '')
    .replace(/\uFE0F/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^[ \t]+|[ \t]+$/gm, (m, off: number, all: string) => (all.trim() ? '' : m))
}

/* keys that are never display text */
const SKIP = new Set(['id', 'blockType', 'blockName', 'slug', 'path', 'url', 'href', 'filename', 'mimeType', '_status', 'createdAt', 'updatedAt'])

function clean(v: unknown): { v: unknown; changed: boolean } {
  let changed = false
  const walk = (x: unknown, key?: string): unknown => {
    if (typeof x === 'string') {
      if (key && SKIP.has(key)) return x
      const out = stripEmoji(x)
      if (out !== x) changed = true
      return out
    }
    if (Array.isArray(x)) return x.map((i) => walk(i))
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, i]) => [k, walk(i, k)]))
    return x
  }
  return { v: walk(v), changed }
}

const COLLECTIONS = ['pages', 'posts', 'initiatives', 'events', 'categories', 'albums', 'videos', 'download-photos', 'quotes', 'leader-meetings', 'awards', 'offices', 'jobs', 'media', 'documents'] as const
const GLOBALS = ['site-settings', 'header', 'footer', 'home', 'popup'] as const
const LOCALES = ['mr', 'en'] as const

/** Returns a list of "where" lines for everything that was cleaned */
export async function stripEmojiEverywhere(payload: Payload, dryRun = false): Promise<string[]> {
  const report: string[] = []
  const has = (s: string) => payload.collections[s as never] !== undefined

  for (const slug of COLLECTIONS) {
    if (!has(slug)) continue
    const all = await payload.find({ collection: slug as never, limit: 0, pagination: false, depth: 0, locale: 'mr', draft: true })
    for (const d of all.docs as { id: string | number; _status?: string }[]) {
      for (const locale of LOCALES) {
        const doc = (await payload.findByID({ collection: slug as never, id: d.id, locale, depth: 0, draft: true, fallbackLocale: false as never })) as Record<string, unknown>
        const data: Record<string, unknown> = {}
        for (const [k, val] of Object.entries(doc)) {
          if (SKIP.has(k) || k === 'sizes') continue
          const r = clean(val)
          if (r.changed) data[k] = r.v
        }
        if (!Object.keys(data).length) continue
        report.push(`${slug} ${String(doc.slug ?? doc.path ?? doc.title ?? d.id)} [${locale}]: ${Object.keys(data).join(', ')}`)
        if (dryRun) continue
        const published = doc._status === 'published'
        await payload.update({
          collection: slug as never, id: d.id, locale, depth: 0,
          ...(doc._status && !published ? { draft: true } : {}),
          data: { ...data, ...(published ? { _status: 'published' } : {}) } as never,
        })
      }
    }
  }

  for (const slug of GLOBALS) {
    for (const locale of LOCALES) {
      const g = (await payload.findGlobal({ slug: slug as never, locale, depth: 0, fallbackLocale: false as never })) as Record<string, unknown>
      const data: Record<string, unknown> = {}
      for (const [k, val] of Object.entries(g)) {
        if (SKIP.has(k) || k === 'globalType') continue
        const r = clean(val)
        if (r.changed) data[k] = r.v
      }
      if (!Object.keys(data).length) continue
      report.push(`global ${slug} [${locale}]: ${Object.keys(data).join(', ')}`)
      if (dryRun) continue
      await payload.updateGlobal({ slug: slug as never, locale, depth: 0, data: { ...data, ...(g._status ? { _status: 'published' } : {}) } as never })
    }
  }
  for (const l of report) payload.logger.info(`emoji removed: ${l}`)
  return report
}
