/**
 * Homepage "Social activities" cards get a photo each (Oct 2026), in a database that already has content:
 *   Entrepreneur Presentation Competition → Job Fair (young people in the hall)
 *   Chhota Udyojak – Motha Udyojak       → a local entrepreneur with the vehicle bought through a Lokmangal Bank loan (new photo)
 *   Solapur University Youth Festival    → Dandiya Festival
 *   Yuva Sahitya Sammelan                → Lokmangal Literature Award stage (new photo)
 * These stand in until photos of the events themselves are uploaded in the admin. A fresh database gets them from the seed.
 *
 *   npm run content:social-photos
 *
 * Safe to run again: a card is only given a photo while it has none, so a photo chosen in the admin is never replaced.
 * With MEDIA_FROM_SITE=1 (Vercel) the build already put the photo files on the website, so only their Media entries are made.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/app.js'
import { collections } from '../src/schema/index.js'
import { createUploads } from '../src/lib/uploads.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const seedDir = path.join(here, '..', 'src', 'seed')
const PHOTOS = {
  'Entrepreneur Presentation Competition': '1791798027509-9881505e396e.webp',
  'Chhota Udyojak – Motha Udyojak': 'social-small-business.webp',
  'Solapur University Youth Festival': 'dandiya-utsav.webp',
  'Yuva Sahitya Sammelan': 'social-literature-stage.webp',
}

const { ctx, close } = await createApp({ cfg: loadConfig() })
try {
  const { cfg, db, documents } = ctx
  // MEDIA_FROM_SITE: the files are part of the website (backend/scripts/static-media.mjs) — work out the sizes, store nothing
  const uploads = cfg.storage.mediaFromSite ? createUploads({ storage: { put: async () => {}, remove: async () => {} } }) : ctx.uploads
  const seedMedia = JSON.parse(await readFile(path.join(seedDir, 'data', 'collections', 'media.json'), 'utf8'))
  const media = collections.find((c) => c.slug === 'media')

  // a photo in Media by its file name; added from the seed when it is missing
  const photoId = async (filename) => {
    const existing = await db.models.media.findOne({ where: { filename } })
    if (existing) return existing.id
    const record = seedMedia.find((m) => m.filename === filename)
    if (!record) throw new Error(`${filename} is missing from the seed's media list.`)
    const upload = await uploads.ingestImage(media, { filename, buffer: await readFile(path.join(seedDir, 'media', filename)) })
    const { id: _id, createdAt: _c, updatedAt: _u, filename: _f, mimeType: _m, filesize: _s, width: _w, height: _h, focalX: _x, focalY: _y, ...input } = record
    const doc = await documents.create('media', input, { overrideAccess: true, locale: 'all', upload })
    console.log(`  + added ${filename} to Media (id ${doc.id})`)
    return doc.id
  }

  const { createdAt: _c, updatedAt: _u, ...home } = await documents.getGlobalRaw('home')
  const block = (home.sections ?? []).find((s) => s.blockType === 'homeHighlights')
  let changed = 0
  for (const item of block?.items ?? []) {
    const file = PHOTOS[item.title?.en]
    if (!file || item.image) continue
    item.image = await photoId(file)
    changed++
  }
  if (changed) await documents.updateGlobal('home', home, { overrideAccess: true, locale: 'all' })
  console.log(changed ? `✓ ${changed} Social activities card(s) now show a photo.` : '✓ Nothing to change — the Social activities cards already have their photos (or are not there).')
} catch (err) {
  console.error('\n✖ Could not add the Social activities photos:', err.message)
  process.exitCode = 1
} finally {
  await close()
}
