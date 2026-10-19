/**
 * Photo Gallery (Oct 2026): three albums like supriyassule.in/media-page/photo-gallery,
 * built from photos on instagram.com/rohan1942 in which Rohan Deshmukh appears
 * (kept in public/images/gallery/…, 30 per album at most).
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

/** the website's own photos (portraits, gallery) live in the frontend tier's public folder */
const FRONTEND_PUBLIC = path.join(process.cwd(), '..', 'frontend', 'public')
import type { Payload } from 'payload'
import { L } from './l10n'
import { createBilingual } from './bilingual'

/** [focalX, focalY] (%) of the faces in each photo, so cropped previews keep faces in view */
const FOCAL: Record<'family' | 'celebrity' | 'political', [number, number][]> = {
  family: [[50, 31], [50, 35], [59, 30], [51, 37], [62, 25], [49, 24], [60, 16], [50, 31], [53, 27], [41, 42], [53, 36], [60, 31], [60, 37], [52, 41], [55, 42], [49, 22], [47, 23], [44, 32], [48, 24], [54, 45], [42, 16], [49, 37], [42, 36], [56, 38], [50, 18], [51, 22], [45, 19], [48, 31], [51, 20], [32, 17]],
  celebrity: [[53, 12], [51, 15], [58, 33], [46, 26], [51, 26]],
  political: [[53, 21], [50, 24], [50, 40], [55, 31], [57, 26], [51, 27], [46, 25], [50, 22], [54, 22], [48, 74], [53, 64], [48, 22], [52, 17], [48, 45], [50, 45], [46, 37], [43, 45], [47, 64], [75, 39], [51, 21], [45, 33], [48, 36], [50, 55], [55, 16], [50, 21], [54, 34], [53, 20], [61, 44], [34, 50], [53, 43]],
}

const ALBUMS = [
  { slug: 'family-moments', folder: 'family', cover: 1, category: 'public', title: L('कौटुंबिक क्षण', 'Family Moments'), date: '2026-10-03' },
  { slug: 'celebrity-moments', folder: 'celebrity', cover: 2, category: 'events', title: L('सेलिब्रिटी क्षण', 'Celebrity Moments'), date: '2026-10-02' },
  { slug: 'political-moments', folder: 'political', cover: 1, category: 'political', title: L('राजकीय क्षण', 'Political Moments'), date: '2026-10-01' },
] as const

async function galleryPhoto(payload: Payload, folder: string, i: number, focal: [number, number], alt: string) {
  const name = `rd-${folder}-${String(i).padStart(2, '0')}.webp`
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id as number
  const file = path.join(FRONTEND_PUBLIC, 'images', 'gallery', folder, name)
  if (!existsSync(file)) return null
  const data = readFileSync(file)
  const doc = await payload.create({
    collection: 'media',
    data: { alt, focalX: focal[0], focalY: focal[1] },
    file: { data, mimetype: 'image/webp', name, size: data.length },
  })
  return doc.id as number
}

export async function applyPhotoGallery(payload: Payload) {
  // Replace every old album with the three new ones
  await payload.delete({ collection: 'albums', where: { id: { exists: true } } })
  // Photos of the first version of these albums (family-001.webp …) are no longer used
  const old = await payload.find({ collection: 'media', where: { filename: { like: '-' } }, limit: 2000, depth: 0, select: { filename: true } })
  const unused = old.docs.filter((d) => /^(family|celebrity|political)-\d{3}(-\d+)?\.webp$/.test(String(d.filename))).map((d) => d.id)
  if (unused.length) await payload.delete({ collection: 'media', where: { id: { in: unused } } })

  for (const a of ALBUMS) {
    const photos: number[] = []
    for (const [i, focal] of FOCAL[a.folder].entries()) {
      const id = await galleryPhoto(payload, a.folder, i + 1, focal, `${a.title.en} – Rohan Deshmukh`)
      if (id) photos.push(id)
    }
    if (!photos.length) continue
    await createBilingual(payload, 'albums', {
      slug: a.slug,
      title: a.title,
      category: a.category,
      date: new Date(`${a.date}T00:00:00.000Z`).toISOString(),
      cover: photos[a.cover - 1] ?? photos[0],
      photos,
    })
  }
}
