/**
 * Social activities (Oct 2026), in a database that already has content:
 *   - adds the "Social Activities" page (/social-activities) with its four activities (text only; photos can be added in the admin)
 *   - the homepage "Social initiatives" section becomes "Social activities": four text cards that open the matching part of that
 *     page, and its "Political career" link is replaced by "All social activities"
 * A fresh database gets this from the seed on its own.
 *
 *   npm run content:social-activities
 *
 * Safe to run again: the page is only added when there is no page at /social-activities, and the homepage section is only
 * changed while it is still the old "Social initiatives" one. Every other page and homepage section is left exactly as it is.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/app.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(here, '..', 'src', 'seed', 'data')
const PATH = '/social-activities'

const { ctx, close } = await createApp({ cfg: loadConfig() })
try {
  const { documents } = ctx

  // the page, copied from the seed
  const found = await documents.find('pages', { where: { path: { equals: PATH } }, limit: 1, overrideAccess: true, depth: 0 })
  if (found.docs.length) console.log(`✓ The ${PATH} page is already there — left as it is.`)
  else {
    const seedPages = JSON.parse(await readFile(path.join(dataDir, 'collections', 'pages.json'), 'utf8'))
    const record = seedPages.find((p) => p.path === PATH)
    if (!record) throw new Error(`The seed has no ${PATH} page.`)
    const { id: _id, createdAt: _c, updatedAt: _u, ...input } = record
    const page = await documents.create('pages', input, { overrideAccess: true, locale: 'all' })
    console.log(`✓ Added the "Social Activities" page (${PATH}, id ${page.id}).`)
  }

  // the homepage section, copied from the seed while it is still the old one
  const seedHome = JSON.parse(await readFile(path.join(dataDir, 'globals', 'home.json'), 'utf8'))
  const seedBlock = seedHome.sections.find((s) => s.blockType === 'homeHighlights')
  const { createdAt: _c, updatedAt: _u, ...home } = await documents.getGlobalRaw('home')
  const sections = home.sections ?? []
  const i = sections.findIndex((s) => s.blockType === 'homeHighlights')
  const old = sections[i]
  if (i < 0) console.log('! The homepage has no "Social initiatives" section — nothing changed there.')
  else if (old.eyebrow?.en !== 'Social initiatives') console.log('✓ The homepage section is no longer "Social initiatives" — left as it is.')
  else {
    const { id: _id, ...fresh } = seedBlock
    sections[i] = { ...old, ...fresh, id: old.id, hidden: old.hidden, heading: old.heading, text: old.text }
    await documents.updateGlobal('home', { ...home, sections }, { overrideAccess: true, locale: 'all' })
    console.log('✓ The homepage section is now "Social activities", with four cards linking to the new page (no Political career link).')
  }
} catch (err) {
  console.error('\n✖ Could not add the Social activities:', err.message)
  process.exitCode = 1
} finally {
  await close()
}
