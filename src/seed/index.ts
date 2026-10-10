/**
 * Seed the database with content from the current website.
 *   npm run seed            → only seeds an empty database
 *   npm run seed -- --fresh → wipes content collections first
 */
import { getPayload, type CollectionSlug, type Payload } from 'payload'
import config from '@payload-config'
import { englishOver, hasEnglish, pick, resolveDeep, L } from './l10n'
import { image, isOnline } from './helpers'
import * as G from './content-globals'
import * as C from './content-collections'
import { pages } from './content-pages'
import { importBlog } from './legacy-blog'

const strip = (doc: Record<string, unknown>) => {
  const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = doc
  return rest
}

async function createBilingual(payload: Payload, collection: CollectionSlug, source: Record<string, unknown>) {
  const data = await resolveDeep(source)
  const mr = pick(data, 'mr')
  const doc = await payload.create({ collection, locale: 'mr', data: mr as never, depth: 0 })
  if (hasEnglish(data)) {
    const saved = await payload.findByID({ collection, id: doc.id, locale: 'mr', depth: 0 })
    for (const copyMissing of [false, true]) {
      try {
        await payload.update({ collection, id: doc.id, locale: 'en', depth: 0, data: strip(englishOver(data, saved, copyMissing) as Record<string, unknown>) as never })
        break
      } catch (e) {
        if (copyMissing) payload.logger.warn(`English version skipped for ${collection} ${doc.id}: ${(e as Error).message}`)
      }
    }
  }
  return doc
}

async function updateGlobalBilingual(payload: Payload, slug: 'site-settings' | 'header' | 'footer' | 'home' | 'popup', source: Record<string, unknown>) {
  const data = await resolveDeep(source)
  const extra = slug === 'home' ? { _status: 'published' } : {}
  await payload.updateGlobal({ slug, locale: 'mr', data: { ...(pick(data, 'mr') as object), ...extra } as never, depth: 0 })
  if (hasEnglish(data)) {
    const saved = await payload.findGlobal({ slug, locale: 'mr', depth: 0 })
    for (const copyMissing of [false, true]) {
      try {
        await payload.updateGlobal({ slug, locale: 'en', depth: 0, data: { ...(strip(englishOver(data, saved, copyMissing) as Record<string, unknown>) as object), ...extra } as never })
        break
      } catch (e) {
        if (copyMissing) payload.logger.warn(`English version skipped for global ${slug}: ${(e as Error).message}`)
      }
    }
  }
}

const CONTENT: CollectionSlug[] = ['posts', 'categories', 'events', 'initiatives', 'albums', 'videos', 'download-photos', 'quotes', 'leader-meetings', 'awards', 'offices', 'jobs', 'pages', 'media', 'search']

async function run() {
  const payload = await getPayload({ config })
  const fresh = process.argv.includes('--fresh')
  const log = (m: string) => payload.logger.info(`🌱 ${m}`)

  if (!fresh) {
    const { totalDocs } = await payload.count({ collection: 'pages' })
    if (totalDocs > 0) {
      log('Database already has content — run "npm run seed:fresh" to reseed.')
      process.exit(0)
    }
  }
  // Clear content (also cleans up after an interrupted earlier seed)
  log('Preparing database…')
  for (const c of CONTENT) await payload.delete({ collection: c, where: { id: { exists: true } } })

  const users = await payload.count({ collection: 'users' })
  if (!users.totalDocs) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@rohandeshmukh.in'
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@123'
    await payload.create({ collection: 'users', data: { email, password, name: 'Super Admin', role: 'super-admin' } })
    log(`Created admin user ${email} (password: ${password}) — change it after first login!`)
  }

  log('Site settings, menu, footer…')
  await updateGlobalBilingual(payload, 'site-settings', G.settings(payload))
  await updateGlobalBilingual(payload, 'header', G.header())
  await updateGlobalBilingual(payload, 'footer', G.footer())
  log(isOnline() ? 'Importing images from the current website…' : 'Current website not reachable — using placeholder images.')

  log('Offices…')
  await createBilingual(payload, 'offices', { name: L('मुख्य कार्यालय, सोलापूर', 'Head Office, Solapur'), address: L('लोकमंगल, सोलापूर, महाराष्ट्र', 'Lokmangal, Solapur, Maharashtra'), phone: '+91 8208737624', email: 'connect@rohandeshmukh.in', notifyEmails: ['connect@rohandeshmukh.in'], order: 1 })
  await createBilingual(payload, 'offices', { name: L('संपर्क कार्यालय, पुणे', 'Contact Office, Pune'), address: L('पत्ता लवकरच अद्ययावत केला जाईल', 'Address to be updated'), notifyEmails: ['connect@rohandeshmukh.in'], order: 2 })

  log('Initiatives…')
  const ini: Record<string, number> = {}
  for (const d of [...C.initiatives(payload), ...C.otherInitiatives(payload)]) {
    const doc = await createBilingual(payload, 'initiatives', { ...d, _status: 'published' })
    ini[d.slug] = doc.id as number
  }

  log('Events…')
  const vivah = Array.from({ length: 20 }, (_, i) => image(payload, `/images/gallery/samudayik-vivah-${String(i + 1).padStart(2, '0')}.webp`, 'सामुदायिक विवाह सोहळा'))
  await createBilingual(payload, 'events', {
    slug: 'samudayik-vivah-sohala', initiative: ini['samudayik-vivah'],
    title: L('लोकमंगल सामुदायिक विवाह सोहळा', 'Lokmangal Community Wedding Ceremony'),
    description: L('२००७ पासून ४८ सोहळे, ३,०००+ जोडपी. ४९ वा सोहळा — १३ डिसेंबर २०२६.', 'Since 2007: 48 ceremonies, 3,000+ couples. 49th ceremony — 13 December 2026.'),
    coverImage: vivah[19],
    editions: [
      { year: 2026, title: L('४९ वा सामुदायिक विवाह सोहळा', '49th ceremony'), text: L('१३ डिसेंबर २०२६ — नोंदणी व अधिक माहितीसाठी संपर्क: ७७२००९६४८८', '13 December 2026 — for registration call 7720096488'), images: vivah.slice(10, 20) },
      { year: 2025, title: L('४८ वा सामुदायिक विवाह सोहळा', '48th ceremony'), images: vivah.slice(0, 10) },
    ],
  })

  log('Photo albums…')
  for (const a of C.albums(payload)) await createBilingual(payload, 'albums', a)

  log('Videos & quotes…')
  for (const v of C.videos()) await createBilingual(payload, 'videos', v)
  for (const q of C.quotes()) await createBilingual(payload, 'quotes', q)

  log('Official download photos…')
  for (const [src, mr, en] of [['/images/vision/rohan-portrait.webp', 'अधिकृत छायाचित्र', 'Official portrait'], ['/images/appeal/rohan.webp', 'अधिकृत छायाचित्र २', 'Official photo 2'], ['/images/about/portrait-solapur.webp', 'सोलापूर — छायाचित्र', 'Solapur portrait']] as const)
    await createBilingual(payload, 'download-photos', { title: L(mr, en), image: image(payload, src, mr) })

  log('Pages…')
  for (const pg of pages(payload)) await createBilingual(payload, 'pages', { ...pg, _status: 'published' })

  log('Blog…')
  const cats: Record<string, number> = {}
  for (const [key, mr, en] of [['social', 'सामाजिक कार्य', 'Social work'], ['policy', 'धोरण व विचार', 'Policy & ideas']] as const)
    cats[key] = (await createBilingual(payload, 'categories', { slug: key, title: L(mr, en) })).id as number
  const fetched = await importBlog(payload, cats)
  log(`Blog posts imported (${fetched} with full text from the current site).`)

  log('Homepage…')
  await updateGlobalBilingual(payload, 'home', G.home(payload))
  await updateGlobalBilingual(payload, 'popup', { enabled: false })

  log('Done ✅  Open /admin to manage content.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
