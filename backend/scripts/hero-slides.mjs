/**
 * Homepage hero (Oct 2026): two slides instead of three — the photo with Hon. Narendra Modi is taken out. Slide 1: the introduction
 * ("I am Rohan Subhash Deshmukh…") on the speech photo; slide 2: "A good leader…" on the rally photo. Each has a desktop photo
 * (1600 × 1067) and a phone photo (360 × 480).
 *
 *   npm run content:hero-slides
 *
 * Changes the hero only while it still uses one of the bundled cover photos of earlier versions (hero-greeting.webp — the photo with
 * Hon. Narendra Modi — or hero-01/02/03.webp) or has no photo at all; slides edited in the admin are left alone.
 * Also, for a hero that already has these slides (both only while untouched): the first slide's subheading about Hon. Narendra Modi is
 * taken out (Oct 2026), and the desktop photos get their focal point near the top so Rohan's face is never cut on wide screens.
 *
 * Safe to run again. Missing photos are added to Media from the bundled content. With MEDIA_FROM_SITE=1 (Vercel) the build already
 * serves the bundled photos from the website, so only their Media records are created — nothing is uploaded to the storage service.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/app.js'
import { collections } from '../src/schema/index.js'
import { createUploads } from '../src/lib/uploads.js'

/** the bundled hero photos of earlier versions: a hero still showing one of them was never edited in the admin */
const OLD = new Set(['hero-greeting.webp', 'hero-01.webp', 'hero-02.webp', 'hero-03.webp'])
const here = path.dirname(fileURLToPath(import.meta.url))
const seedDir = path.join(here, '..', 'src', 'seed')
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))
const idOf = (v) => (v && typeof v === 'object' ? v.id : v)

const { ctx, close } = await createApp({ cfg: loadConfig() })
try {
  const { cfg, db, documents } = ctx
  // MEDIA_FROM_SITE: the files are part of the website (backend/scripts/static-media.mjs) — work out the sizes, store nothing
  const uploads = cfg.storage.mediaFromSite ? createUploads({ storage: { put: async () => {}, remove: async () => {} } }) : ctx.uploads
  const media = collections.find((c) => c.slug === 'media')
  const seedMedia = new Map((await readJson(path.join(seedDir, 'data', 'collections', 'media.json'))).map((m) => [m.id, m]))
  const seedHero = (await readJson(path.join(seedDir, 'data', 'globals', 'home.json'))).sections.find((s) => s.blockType === 'heroSlider')

  const photoFor = async (seedId) => {
    const record = seedMedia.get(seedId)
    if (!record) return null
    const existing = await db.models.media.findOne({ where: { filename: record.filename } })
    if (existing) return existing.id
    const upload = await uploads.ingestImage(media, { filename: record.filename, buffer: await readFile(path.join(seedDir, 'media', record.filename)) })
    const { id: _id, createdAt: _c, updatedAt: _u, filename: _f, mimeType: _m, filesize: _s, width: _w, height: _h, ...input } = record
    return (await documents.create('media', input, { overrideAccess: true, locale: 'all', upload })).id
  }

  const { id: _i, createdAt: _c, updatedAt: _u, ...home } = await documents.getGlobalRaw('home')
  const hero = (home.sections ?? []).find((s) => s.blockType === 'heroSlider')
  // tidy-ups for a hero that already has the new slides — each only while it still reads as the earlier version
  const MODI_LINE = 'Inspired by Prime Minister Narendra Modi’s vision for a developed and self-reliant India, I work towards turning that vision into meaningful change at the grassroots.'
  let tidied = 0
  for (const record of seedMedia.values()) {
    if (!/^hero-(speech|rally)-desktop\.webp$/.test(record.filename)) continue
    const doc = await db.models.media.findOne({ where: { filename: record.filename } })
    if (!doc) continue
    const { id: mid, createdAt: _mc, updatedAt: _mu, ...raw } = await documents.getRaw('media', doc.id)
    if ((raw.focalY ?? 50) === 50 && (raw.focalX ?? 50) === 50 && record.focalY !== 50) {
      await documents.update('media', mid, { ...raw, focalX: record.focalX, focalY: record.focalY }, { overrideAccess: true, locale: 'all' })
      tidied++
    }
  }
  const sub = hero?.slides?.[0]?.subheading
  if (sub && typeof sub === 'object' && sub.en === MODI_LINE) {
    hero.slides[0].subheading = { ...sub, en: null, mr: null }
    await documents.updateGlobal('home', home, { overrideAccess: true, locale: 'all' })
    tidied++
  }
  if (tidied) console.log(`✓ Hero tidied: ${tidied} change(s) (the line about Hon. Narendra Modi removed / photos anchored near the top).`)

  const files = []
  for (const s of hero?.slides ?? []) files.push(s.image ? (await db.models.media.findByPk(idOf(s.image)))?.filename : null)
  const untouched = files.length === 0 || files.every((f) => !f) || files.some((f) => OLD.has(f))
  if (!hero || !untouched) {
    console.log('✓ The homepage hero is already up to date (or was edited in the admin) — nothing to change.')
  } else {
    const slides = []
    for (const s of seedHero.slides) slides.push({ ...s, image: await photoFor(s.image), imageMobile: await photoFor(s.imageMobile) })
    hero.slides = slides
    await documents.updateGlobal('home', home, { overrideAccess: true, locale: 'all' })
    console.log(`✓ The homepage hero now has ${slides.length} slides (the photo with Hon. Narendra Modi is taken out).`)
  }
} catch (err) {
  console.error('\n✖ Could not update the homepage hero:', err.message)
  process.exitCode = 1
} finally {
  await close()
}
