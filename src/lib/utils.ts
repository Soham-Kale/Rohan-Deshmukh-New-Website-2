import type { Media } from '@/payload-types'

export type MaybeMedia = number | Media | null | undefined

export const mediaUrl = (m: MaybeMedia, size?: 'thumb' | 'card' | 'hero'): string | null => {
  if (!m || typeof m === 'number') return null
  const sized = size ? m.sizes?.[size]?.url : null
  return relativize(sized || m.url || null)
}

/**
 * Where a cropped (object-fit: cover) photo is anchored: the focal point chosen in the admin,
 * or — for portrait photos without one — the upper part, so faces are not cut off.
 */
export const mediaPosition = (m: MaybeMedia): string => {
  if (!m || typeof m === 'number') return '50% 50%'
  const fx = m.focalX ?? 50
  const fy = m.focalY ?? 50
  const portrait = Boolean(m.width && m.height && m.height > m.width * 1.1)
  return `${fx}% ${portrait && fy === 50 ? 22 : fy}%`
}

/**
 * Style for a photo filling a box of the given width/height ratio.
 * Normally crops (cover) around the focal point; when the box would cut away more than
 * `maxCrop` of the photo (e.g. a tall book cover in a wide card) the whole photo is shown instead.
 */
export const photoFit = (m: MaybeMedia, boxRatio?: number, maxCrop = 0.5): { objectFit: 'cover' | 'contain'; objectPosition: string } => {
  if (m && typeof m !== 'number' && boxRatio && m.width && m.height) {
    const r = m.width / m.height
    if (1 - Math.min(r / boxRatio, boxRatio / r) > maxCrop) return { objectFit: 'contain', objectPosition: '50% 50%' }
  }
  return { objectFit: 'cover', objectPosition: mediaPosition(m) }
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
