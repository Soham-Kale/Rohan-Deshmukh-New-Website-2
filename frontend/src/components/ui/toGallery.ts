import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl, relativize } from '@/lib/utils'
import type { GalleryImage } from './Gallery'

export const toGallery = (items: (number | Media | null | undefined)[] | null | undefined, fallbackAlt = ''): GalleryImage[] =>
  (items ?? [])
    .filter((m): m is Media => Boolean(m && typeof m === 'object' && m.url))
    .map((m) => ({
      src: mediaUrl(m, 'hero') || relativize(m.url)!,
      thumb: mediaUrl(m, 'card') || relativize(m.url)!,
      alt: mediaAlt(m, fallbackAlt),
      caption: m.caption,
      width: m.width,
      height: m.height,
    }))
