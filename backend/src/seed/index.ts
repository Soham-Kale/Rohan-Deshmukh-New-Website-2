/**
 * Seed the database with content from the current website.
 *   npm run seed            → only seeds an empty database
 *   npm run seed -- --fresh → wipes content collections first
 */
import { getPayload, type CollectionSlug, type Payload } from 'payload'

// bulk writes: don't ask the website to refresh its cache after every single document
process.env.PAYLOAD_SEED = 'true'
import config from '@payload-config'
import { L } from './l10n'
import { createBilingual, updateGlobalBilingual } from './bilingual'
import { image, isOnline } from './helpers'
import * as G from './content-globals'
import * as C from './content-collections'
import { pages } from './content-pages'
import { importBlog } from './legacy-blog'
import { applyHomeLayout } from './home-layout'
import { applyPhotoGallery } from './photo-gallery'

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

  for (const e of C.docEvents()) await createBilingual(payload, 'events', e)

  log('Photo albums…')
  await applyPhotoGallery(payload)

  log('Videos & quotes…')
  for (const v of C.videos()) await createBilingual(payload, 'videos', v)
  for (const q of C.quotes()) await createBilingual(payload, 'quotes', q)

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
  await applyHomeLayout(payload) // current homepage layout after the hero slider
  await updateGlobalBilingual(payload, 'popup', { enabled: false })

  log('Done ✅  Open /admin to manage content.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
