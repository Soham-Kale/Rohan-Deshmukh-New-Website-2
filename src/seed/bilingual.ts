/** Write bilingual (Marathi + English) seed data — shared by the seed script and content migrations */
import type { CollectionSlug, Payload } from 'payload'
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
