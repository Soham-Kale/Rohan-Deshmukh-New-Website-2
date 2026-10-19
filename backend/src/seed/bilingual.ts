/** Write bilingual (Marathi + English) seed data — shared by the seed script and content migrations */
import type { CollectionSlug, Payload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import { englishOver, hasEnglish, pick, resolveDeep } from './l10n'

const strip = (doc: Record<string, unknown>) => {
  const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = doc
  return rest
}

export async function createBilingual(payload: Payload, collection: CollectionSlug, source: Record<string, unknown>) {
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

export async function updateGlobalBilingual(payload: Payload, slug: 'site-settings' | 'header' | 'footer' | 'home' | 'popup', source: Record<string, unknown>) {
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

/** Replace an existing document's content with bilingual seed data (same Marathi/English pairing as createBilingual) */
export async function replaceBilingual(payload: Payload, collection: CollectionSlug, id: number | string, source: Record<string, unknown>) {
  const data = await resolveDeep(source)
  // empty the page layout first so no old block data is carried into the new blocks
  if ('layout' in data) {
    await payload.update({ collection, id, locale: 'mr', depth: 0, data: { layout: [] } as never })
    // multi-value text fields (card tags) live in a side table that emptying the layout leaves behind
    const db = payload.db as unknown as { drizzle?: { execute: (q: unknown) => Promise<unknown> } }
    try {
      await db.drizzle?.execute(sql.raw(`DELETE FROM "${collection.replace(/-/g, '_')}_texts" WHERE parent_id = ${Number(id)} AND path LIKE 'layout.%'`))
    } catch {
      /* collection without that table — nothing to clean */
    }
  }
  await payload.update({ collection, id, locale: 'mr', depth: 0, data: strip(pick(data, 'mr') as Record<string, unknown>) as never })
  if (!hasEnglish(data)) return
  const saved = await payload.findByID({ collection, id, locale: 'mr', depth: 0 })
  for (const copyMissing of [false, true]) {
    try {
      await payload.update({ collection, id, locale: 'en', depth: 0, data: strip(englishOver(data, saved, copyMissing) as Record<string, unknown>) as never })
      break
    } catch (e) {
      if (copyMissing) payload.logger.warn(`English version skipped for ${collection} ${id}: ${(e as Error).message}`)
    }
  }
}
