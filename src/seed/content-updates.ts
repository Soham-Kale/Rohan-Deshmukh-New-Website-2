/**
 * Content changes that existing databases need (new databases get them from the seed).
 * Run on the live site by migrations, and locally by `npm run dev` (once per CONTENT_VERSION)
 * or by hand with `npm run content:update`.
 */
import type { Payload } from 'payload'
import { applyMenu } from './menu'
import { image, PORTRAITS } from './helpers'
/** Bump when adding a change below — scripts/dev.mjs reads this line */
export const CONTENT_VERSION = '2026-10-14b'

const FB = { mr: 'कौटुंबिक पार्श्वभूमी', en: 'Family Background' }

/** Exact-text replacements per language ("जीवनचरित्र" → "कौटुंबिक पार्श्वभूमी") */
const RENAME: Record<'mr' | 'en', Record<string, string>> = {
  mr: {
    'जीवनचरित्र': FB.mr,
    'श्री. रोहन सुभाष देशमुख यांचे जीवनचरित्र': `श्री. रोहन सुभाष देशमुख यांची ${FB.mr}`,
  },
  en: {
    Biography: FB.en,
    'The life of Shri. Rohan Subhash Deshmukh': 'Family background of Shri. Rohan Subhash Deshmukh',
  },
}

/** Sentences removed from the Terms page (the "Download Official Photos" section no longer exists) */
const CUT = [' "अधिकृत फोटो डाउनलोड" विभागातील छायाचित्रे माध्यमांना श्रेय देऊन वापरता येतील.', ' Photos in the "Download Official Photos" section may be used by media with credit.']

/** Returns a copy with every matching string replaced, and whether anything changed */
function rewrite<T>(value: T, locale: 'mr' | 'en'): { value: T; changed: boolean } {
  let changed = false
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') {
      let out = RENAME[locale][v] ?? v
      for (const c of CUT) if (out.includes(c)) out = out.split(c).join('')
      if (out !== v) changed = true
      return out
    }
    if (Array.isArray(v)) return v.map(walk)
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
    return v
  }
  return { value: walk(value) as T, changed }
}

async function renamePages(payload: Payload) {
  for (const path of ['/about/biography', '/terms']) {
    const found = await payload.find({ collection: 'pages', where: { path: { equals: path } }, limit: 1, depth: 0, locale: 'mr' })
    const id = found.docs[0]?.id
    if (!id) continue
    for (const locale of ['mr', 'en'] as const) {
      const doc = await payload.findByID({ collection: 'pages', id, locale, depth: 0, fallbackLocale: false as never })
      const { value, changed } = rewrite({ title: doc.title, layout: doc.layout }, locale)
      if (changed) await payload.update({ collection: 'pages', id, locale, depth: 0, data: { ...value, _status: 'published' } as never })
    }
  }
}

async function renameHome(payload: Payload) {
  for (const locale of ['mr', 'en'] as const) {
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: false as never })
    const { value, changed } = rewrite({ sections: home.sections }, locale)
    if (changed) await payload.updateGlobal({ slug: 'home', locale, depth: 0, data: { ...value, _status: 'published' } as never })
  }
}

type Section = { blockType?: string; image?: unknown }

/** Latest portraits (Aug 2026): homepage परिचय + कौटुंबिक पार्श्वभूमी section, and the कौटुंबिक पार्श्वभूमी page banner */
export async function applyPortraits(payload: Payload) {
  const alt = 'रोहन सुभाष देशमुख'
  const about = await image(payload, PORTRAITS.about, alt)
  const family = await image(payload, PORTRAITS.family, alt)
  const banner = await image(payload, PORTRAITS.familyPage, alt)
  const pick: Record<string, number | null> = { aboutIntro: about, biography: family }

  for (const locale of ['mr', 'en'] as const) {
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: false as never })
    let changed = false
    const sections = ((home.sections ?? []) as Section[]).map((s) => {
      const id = s.blockType ? pick[s.blockType] : undefined
      if (!id || s.image === id) return s
      changed = true
      return { ...s, image: id }
    })
    if (changed) await payload.updateGlobal({ slug: 'home', locale, depth: 0, data: { sections, _status: 'published' } as never })
  }

  const page = (await payload.find({ collection: 'pages', where: { path: { equals: '/about/biography' } }, limit: 1, depth: 0 })).docs[0]
  if (page && banner && page.bannerImage !== banner)
    await payload.update({ collection: 'pages', id: page.id, depth: 0, data: { bannerImage: banner, _status: 'published' } as never })
}

/** 14 Oct 2026: Thoughts page removed, Biography → कौटुंबिक पार्श्वभूमी, menu without removed pages, new portraits */
export async function applyContentUpdates(payload: Payload) {
  await applyMenu(payload)
  await renamePages(payload)
  await renameHome(payload)
  await applyPortraits(payload)
}
