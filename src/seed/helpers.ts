import type { Payload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

export const LEGACY = (process.env.LEGACY_SITE_URL || 'https://rohan-deshmukh-website.vercel.app').replace(/\/$/, '')

let editorConfig: Awaited<ReturnType<typeof editorConfigFactory.default>> | null = null

/** Markdown (with optional ![alt](/images/..) lines) → Lexical JSON, uploading inline images */
export async function md(payload: Payload, markdown: string) {
  if (!editorConfig) editorConfig = await editorConfigFactory.default({ config: payload.config })
  const parts = markdown.split(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/m)
  const children: unknown[] = []
  for (let i = 0; i < parts.length; i += 3) {
    const text = parts[i]?.trim()
    if (text) {
      const lex = convertMarkdownToLexical({ editorConfig, markdown: text }) as { root: { children: unknown[] } }
      children.push(...lex.root.children)
    }
    const alt = parts[i + 1]
    const src = parts[i + 2]
    if (src) {
      const id = await image(payload, src, alt)
      if (id) children.push({ type: 'upload', version: 3, format: '', fields: null, relationTo: 'media', value: id })
    }
  }
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}

const cache = new Map<string, Promise<number | null>>()
let online: boolean | null = null

const palette = [
  ['#3a1a26', '#e8731a'], ['#211118', '#c95e0e'], ['#4f1f31', '#f6b26b'], ['#2b1720', '#a14a0b'],
]

async function placeholder(label: string) {
  const [a, b] = palette[Math.abs([...label].reduce((s, c) => s + c.charCodeAt(0), 0)) % palette.length]
  const safe = label.replace(/[<&>]/g, '').slice(0, 40)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1300" cy="200" r="260" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="60"/><text x="80" y="900" font-family="sans-serif" font-size="44" fill="rgba(255,255,255,.75)">${safe}</text></svg>`
  return sharp(Buffer.from(svg)).webp({ quality: 70 }).toBuffer()
}

/** Import an image from the current live site (falls back to a branded placeholder when offline) */
let queue: Promise<unknown> = Promise.resolve()

/** Images are imported one at a time (parallel uploads race on file names) */
export function image(payload: Payload, src: string, alt = ''): Promise<number | null> {
  if (!cache.has(src)) {
    const job = queue.then(() => importImage(payload, src, alt))
    queue = job.catch(() => null)
    cache.set(src, job)
  }
  return cache.get(src)!
}

async function importImage(payload: Payload, src: string, alt: string): Promise<number | null> {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: src.split('/').pop() } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id as number
  let data: Buffer | null = null
  const url = src.startsWith('http') ? src : `${LEGACY}${src}`
  if (online !== false) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
      if (res.ok) {
        data = Buffer.from(await res.arrayBuffer())
        online = true
      } else if (online === null) online = res.status !== 403 ? null : false
    } catch {
      if (online === null) online = false
    }
  }
  if (!data) data = await placeholder(src.split('/').pop()!.replace(/\.\w+$/, ''))
  const name = src.split('/').pop()!.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  const doc = await payload.create({
    collection: 'media',
    data: { alt: alt || undefined },
    file: { data, mimetype: 'image/webp', name, size: data.length },
  })
  return doc.id as number
}

export const isOnline = () => online === true

/** Rich text from plain paragraphs (blank-line separated) */
export const paras = (payload: Payload, text: string) => md(payload, text.trim())
