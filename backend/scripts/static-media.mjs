/**
 * Vercel build, only when MEDIA_FROM_SITE=1: writes the bundled photos (backend/src/seed/media) and their smaller copies (thumb, card,
 * hero — exactly the files the Media records name) into frontend/dist/<BLOB_PREFIX>/, so they are served by Vercel's CDN from the
 * website itself instead of the Blob store. Runs after the frontend build (which empties frontend/dist).
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStorage } from '../src/lib/storage.js'
import { createUploads } from '../src/lib/uploads.js'
import { collections } from '../src/schema/index.js'

const on = /^(1|true|yes|on)$/i.test(process.env.MEDIA_FROM_SITE || '')
if (!on) {
  console.log('[static-media] MEDIA_FROM_SITE is off — photos are served from the storage service')
  process.exit(0)
}
const here = path.dirname(fileURLToPath(import.meta.url))
const seedDir = path.join(here, '..', 'src', 'seed')
const prefix = String(process.env.BLOB_PREFIX ?? 'site').replace(/^\/+|\/+$/g, '')
const outDir = path.resolve(here, '..', '..', 'frontend', 'dist', prefix)
const media = collections.find((c) => c.slug === 'media')
const uploads = createUploads({ storage: createStorage({ storage: { driver: 'local', dir: outDir } }) })
const records = JSON.parse(await readFile(path.join(seedDir, 'data', 'collections', 'media.json'), 'utf8'))
const started = Date.now()
let done = 0
for (let i = 0; i < records.length; i += 8) {
  await Promise.all(records.slice(i, i + 8).map(async (r) => {
    await uploads.ingestImage(media, { filename: r.filename, buffer: await readFile(path.join(seedDir, 'media', r.filename)) })
    done++
  }))
}
console.log(`[static-media] ✓ ${done} photos (with their smaller copies) written to frontend/dist/${prefix} in ${Math.round((Date.now() - started) / 1000)} s`)
