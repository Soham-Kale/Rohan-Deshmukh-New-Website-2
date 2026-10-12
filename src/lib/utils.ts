import type { Media } from '@/payload-types'

export type MaybeMedia = number | Media | null | undefined

export const mediaUrl = (m: MaybeMedia, size?: 'thumb' | 'card' | 'hero'): string | null => {
  if (!m || typeof m === 'number') return null
  const sized = size ? m.sizes?.[size]?.url : null
  return relativize(sized || m.url || null)
}

/** Natural pixel size of an uploaded image (falls back to 4:3) */
export const mediaSize = (m: MaybeMedia): { width: number; height: number } =>
  m && typeof m !== 'number' && m.width && m.height ? { width: m.width, height: m.height } : { width: 1200, height: 900 }

/** Payload returns absolute URLs for local uploads; make same-origin ones relative so next/image treats them as local */
export const relativize = (url: string | null | undefined): string | null => {
  if (!url) return null
  const base = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  if (base && url.startsWith(base + '/')) return url.slice(base.length)
  return url.replace(/^https?:\/\/localhost(:\d+)?(?=\/)/, '')
}

export const mediaAlt = (m: MaybeMedia, fallback = ''): string =>
  (m && typeof m === 'object' && (m.alt || m.caption)) || fallback

export const youtubeId = (url?: string | null): string | null => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/)
  return m ? m[1] : null
}

export const isExternal = (url?: string | null) => Boolean(url && /^(https?:)?\/\//.test(url))

const mrDigits = '०१२३४५६७८९'
export const toMarathiDigits = (s: string | number) => String(s).replace(/\d/g, (d) => mrDigits[+d])

export const formatDate = (iso: string | null | undefined, locale: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat(locale === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const localizedHref = (path: string, locale: string) => {
  if (!path || isExternal(path) || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) return path
  return locale === 'mr' ? path : `/en${path === '/' ? '' : path}`
}
