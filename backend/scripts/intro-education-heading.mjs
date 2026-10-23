/**
 * Removes the heading "From Solapur to the world, and back" (सोलापूर ते जग, आणि पुन्हा सोलापूर) from the Education section of the
 * Introduction page (/about/introduction, Oct 2026) in a database that already has content. The small "Education" label above it stays.
 * A fresh database gets the section without it from the seed.
 *
 *   npm run content:intro-education-heading
 *
 * Safe to run again, and it never overwrites an edit: the heading is cleared only while it still reads exactly as before.
 */
import { loadConfig } from '../src/config.js'
import { createApp } from '../src/app.js'

const PATH = '/about/introduction'
const OLD = { en: 'From Solapur to the world, and back', mr: 'सोलापूर ते जग, आणि पुन्हा सोलापूर' }

const { ctx, close } = await createApp({ cfg: loadConfig() })
try {
  const { documents } = ctx
  const found = await documents.find('pages', { where: { path: { equals: PATH } }, limit: 1, overrideAccess: true, depth: 0 })
  if (!found.docs.length) {
    console.log(`✓ No ${PATH} page — nothing to change.`)
  } else {
    const { id, createdAt: _c, updatedAt: _u, ...raw } = await documents.getRaw('pages', found.docs[0].id)
    const block = (raw.layout ?? []).find((b) => b.heading?.en?.trim() === OLD.en || b.heading?.mr?.trim() === OLD.mr)
    if (!block) console.log('✓ The Education heading is already gone (or was edited in the admin) — nothing to change.')
    else {
      block.heading = {
        en: block.heading?.en?.trim() === OLD.en ? null : block.heading?.en ?? null,
        mr: block.heading?.mr?.trim() === OLD.mr ? null : block.heading?.mr ?? null,
      }
      await documents.update('pages', id, raw, { overrideAccess: true, locale: 'all' })
      console.log(`✓ Removed the heading "${OLD.en}" from the Education section of ${PATH}.`)
    }
  }
} catch (err) {
  console.error('\n✖ Could not remove the heading:', err.message)
  process.exitCode = 1
} finally {
  await close()
}
