/**
 * Brings the 23 Lokmangal Foundation projects over from lokmangalfoundation.com (its public data feed), so the website's
 * Lokmangal Projects section (/lokmangal/foundation#projects) and every project page (/social-work/…) show exactly what the
 * foundation's own site shows (Oct 2026):
 *   - title, short text (card), key impact, objective, full details (as formatted text), category, order, video — English and Marathi
 *   - the cover photo and every photo of the project's album, in the same order (converted to WebP with the usual smaller copies)
 *
 *   npm run content:lokmangal-projects
 *   npm run content:lokmangal-projects -- --dry-run      show what would change, change nothing
 *   npm run content:lokmangal-projects -- --no-photos    text only
 *
 * Needs internet access to api.lokmangalfoundation.com and its photo store. Safe to run again: a photo already in Media (same file
 * name) is reused, not downloaded twice. The project texts are replaced by the foundation site's texts on every run — that is the
 * point of the script, so edits made to these 23 projects in the admin are overwritten when it runs again. The website addresses of
 * the projects (/social-work/…) stay as they are.
 */
import path from 'node:path'
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/app.js'
import { collections } from '../src/schema/index.js'

const API = process.env.LMF_API || 'https://api.lokmangalfoundation.com/api'
const args = new Set(process.argv.slice(2))
const DRY = args.has('--dry-run')
const PHOTOS = !args.has('--no-photos')

/** the foundation site's address of a project → this website's (kept, so existing links keep working) */
const SLUGS = {
  'lokmangal-annapurna-yojana': 'annapurna-yojana',
  'jalsandharan-project': 'jalsandharan',
  'vidyadaan-yojana': 'lotus',
  'samudayik-vivah-sohala': 'samudayik-vivah',
  'ek-muth-dhanya-yojana': 'ek-muth-dhanya',
  'lokmangal-sahitya-puraskar': 'sahitya-puraskar',
  'lokmangal-shikshak-ratna-puraskar': 'shikshak-ratna-puraskar',
  'lokmangal-sanjeevani-medical': 'sanjivani-medical',
  'mahaarogya-shibir': 'maha-arogya-shibir',
  'divyang-shibir': 'divyang-shibir',
  'mofat-sarvarog-nidan-shibir': 'sarvarog-nidan-shibir',
  'raktadan-shibir': 'raktadan-shibir',
  'school-supplies-notebook-distribution': 'shaley-sahitya-vatap',
  'balsanskar-shibir': 'balsanskar-shibir',
  'killa-bandhani-spardha': 'killa-bandhani-spardha',
  'rozgar-melava': 'rojgar-melava',
  'mahila-din': 'mahila-din',
  'bhajan-bharud-spardha': 'bhajan-bharud-spardha',
  'yoga-din': 'yog-din',
  'ekal-mahila-upakram': 'ekal-mahila-upakram',
  vruksharopan: 'vrukshaaropan',
  'dandiya-utsav': 'dandiya-utsav',
  'madhyamanchi-dakhal': 'madhyamanchi-dakhal',
}

/** the foundation site's themes → this website's categories (the same seven filters) */
const CATEGORIES = { food: 'food', water: 'agriculture', education: 'education', health: 'health', social: 'community', women_jobs: 'women', culture: 'culture' }

/** the four "Featured Impact Initiatives" of the foundation site's projects page */
const FEATURED = new Set(['samudayik-vivah-sohala', 'lokmangal-annapurna-yojana', 'jalsandharan-project', 'vidyadaan-yojana'])

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clean = (s) => (typeof s === 'string' && s.trim() ? s.trim() : null)

/**
 * The foundation site's plain-text details → HTML: blank lines separate paragraphs, lines starting with • become a list
 * ("Label: text" → bold label), a short line without a full stop right before a list becomes a small heading.
 */
export function detailsToHtml(text) {
  if (!clean(text)) return null
  const lines = text.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean)
  const out = []
  let list = []
  const flush = () => {
    if (list.length) out.push(`<ul>${list.map((li) => `<li>${li}</li>`).join('')}</ul>`)
    list = []
  }
  lines.forEach((line, i) => {
    const bullet = line.match(/^[•\-–*]\s*(.+)$/)
    if (bullet) {
      const m = bullet[1].match(/^([^:：]{2,60})[:：]\s*(.+)$/)
      list.push(m ? `<strong>${esc(m[1])}:</strong> ${esc(m[2])}` : esc(bullet[1]))
      return
    }
    flush()
    const nextIsBullet = /^[•\-–*]/.test(lines[i + 1] ?? '')
    if (nextIsBullet && line.length <= 70 && !/[.!?।:]$/.test(line)) out.push(`<h3>${esc(line)}</h3>`)
    else out.push(`<p>${esc(line)}</p>`)
  })
  flush()
  return out.join('\n')
}

const getJson = async (url) => {
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(60_000) })
  if (!res.ok) throw new Error(`${url} answered ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : Object.values(data)
}

const { ctx, close } = await createApp({ cfg: loadConfig() })
try {
  const { db, uploads, documents } = ctx
  const media = collections.find((c) => c.slug === 'media')
  console.log(`Reading the projects from ${API} …`)
  const [projects, gallery] = await Promise.all([getJson(`${API}/projects`), getJson(`${API}/gallery`)])
  console.log(`  ${projects.length} projects, ${gallery.length} photos`)

  const albums = new Map()
  for (const g of [...gallery].sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0) || Number(a.id) - Number(b.id))) {
    if (!albums.has(g.category)) albums.set(g.category, [])
    albums.get(g.category).push(g)
  }

  /** a photo address → its Media id (downloaded and added once; the file name decides "already there") */
  let downloaded = 0
  const cache = new Map()
  const photo = async (url, alt) => {
    if (!PHOTOS || !url) return null
    if (cache.has(url)) return cache.get(url)
    const stem = path.parse(new URL(url).pathname).name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
    const existing = await db.models.media.findOne({ where: { filename: `${stem}.webp` } })
    let id = existing?.id ?? null
    if (!id && !DRY) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(90_000) })
        if (!res.ok) throw new Error(`answered ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        const upload = await uploads.saveImage(media, db.models.media, { buffer, originalname: `${stem}${path.extname(new URL(url).pathname) || '.jpg'}` })
        id = (await documents.create('media', { alt: { en: alt?.en ?? null, mr: alt?.mr ?? null } }, { overrideAccess: true, locale: 'all', upload })).id
        downloaded++
        if (downloaded % 25 === 0) console.log(`  … ${downloaded} photos downloaded`)
      } catch (err) {
        console.warn(`  ! could not get ${url}: ${err.message}`)
      }
    }
    cache.set(url, id)
    return id
  }

  let updated = 0
  for (const p of projects.sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))) {
    const slug = SLUGS[p.slug] ?? p.slug
    const found = await documents.find('initiatives', { where: { slug: { equals: slug } }, limit: 1, overrideAccess: true, depth: 0 })
    const title = { en: clean(p.titleEn), mr: clean(p.titleMr) }
    const album = albums.get(p.albumKey) ?? []

    const photos = []
    for (const g of album) {
      const id = await photo(g.imageUrl, { en: clean(g.titleEn) ?? title.en, mr: clean(g.titleMr) ?? title.mr })
      if (id && !photos.includes(id)) photos.push(id)
    }
    // the cover: the project's own cover photo, or (when it has none) the first photo of its album
    const cover = (await photo(p.coverImageUrl, title)) ?? photos[0] ?? null

    const input = {
      title,
      category: CATEGORIES[p.categoryKey] ?? 'community',
      order: Number(p.sortOrder) || 10,
      featured: FEATURED.has(p.slug),
      stat: { en: clean(p.statEn), mr: clean(p.statMr) },
      excerpt: { en: clean(p.summaryEn), mr: clean(p.summaryMr) },
      // the English site shows no objective when it has no English one (the Marathi one would otherwise stand in for it)
      objective: clean(p.objectiveEn) ? { en: clean(p.objectiveEn), mr: clean(p.objectiveMr) } : { en: null, mr: null },
      body: { en: detailsToHtml(p.descriptionEn), mr: detailsToHtml(p.descriptionMr) },
      youtubeUrl: clean(p.videoUrl),
      ...(PHOTOS ? { heroImage: cover, gallery: photos } : {}),
    }

    if (DRY) {
      console.log(`  ${found.docs.length ? '~' : '+'} ${slug}: ${title.en} — ${album.length} photo(s)`)
      continue
    }
    if (found.docs.length) {
      const { id, createdAt: _c, updatedAt: _u, ...raw } = await documents.getRaw('initiatives', found.docs[0].id)
      await documents.update('initiatives', id, { ...raw, ...input, _status: 'published' }, { overrideAccess: true, locale: 'all' })
    } else {
      await documents.create('initiatives', { ...input, slug, organisation: 'foundation', _status: 'published' }, { overrideAccess: true, locale: 'all' })
    }
    updated++
    console.log(`  ✓ ${title.en} (${photos.length} photos)`)
  }
  console.log(DRY ? '\n(dry run — nothing changed)' : `\n✓ ${updated} projects updated, ${downloaded} new photos added to Media.`)
} catch (err) {
  console.error('\n✖ Could not bring over the projects:', err.message)
  process.exitCode = 1
} finally {
  await close()
}
