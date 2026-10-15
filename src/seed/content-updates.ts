/**
 * Content changes that existing databases need (new databases get them from the seed).
 * Run on the live site by migrations, and locally by `npm run dev` (once per CONTENT_VERSION)
 * or by hand with `npm run content:update`.
 */
import type { Payload } from 'payload'
import { applyMenu } from './menu'
import { image, PORTRAITS } from './helpers'
import { createBilingual, replaceBilingual } from './bilingual'
import { familyPage, foundationPage, introPage, parivarPage, politicalPage } from './content-pages'
import { HOME_INTRO, HOME_TAGLINE } from './content-globals'
import { docEvents } from './content-collections'
import { POSTS } from './legacy-blog'
/** Bump when adding a change below — scripts/dev.mjs reads this line */
export const CONTENT_VERSION = '2026-10-15b'

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

/** New परिचय menu: स्वपरिचय page (created once) + homepage परिचय "Read more" button pointing to it */
export async function applyAboutMenu(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'pages', where: { path: { equals: '/about/introduction' } } })
  if (!totalDocs) await createBilingual(payload, 'pages', { ...introPage(payload), _status: 'published' } as never)
  await applyMenu(payload)
  for (const locale of ['mr', 'en'] as const) {
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: false as never })
    let changed = false
    const sections = ((home.sections ?? []) as (Section & { buttonUrl?: string })[]).map((s) => {
      if (s.blockType !== 'aboutIntro' || s.buttonUrl !== '/about/biography') return s
      changed = true
      return { ...s, buttonUrl: '/about/introduction' }
    })
    if (changed) await payload.updateGlobal({ slug: 'home', locale, depth: 0, data: { sections, _status: 'published' } as never })
  }
}

/**
 * Client document "New Content RD Web" (Oct 2026): homepage परिचय text, the four About pages,
 * Lokmangal Foundation text and its four events. Replaces the text of those pages; other pages are untouched.
 */
export async function applyDocContent(payload: Payload) {
  for (const def of [introPage, familyPage, foundationPage, parivarPage, politicalPage]) {
    const data = def(payload) as unknown as Record<string, unknown> & { path: string }
    const found = (await payload.find({ collection: 'pages', where: { path: { equals: data.path } }, limit: 1, depth: 0 })).docs[0]
    if (found) await replaceBilingual(payload, 'pages', found.id, { ...data, _status: 'published' })
    else await createBilingual(payload, 'pages', { ...data, _status: 'published' })
  }

  const intro = {
    // name → tagline → description, without the counters
    mr: { heading: 'रोहन सुभाष देशमुख', text: HOME_INTRO.mr, pledge: HOME_TAGLINE.mr, stats: [] },
    en: { heading: 'Rohan Subhash Deshmukh', text: HOME_INTRO.en, pledge: HOME_TAGLINE.en, stats: [] },
  }
  for (const locale of ['mr', 'en'] as const) {
    const home = await payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: false as never })
    let changed = false
    const sections = ((home.sections ?? []) as (Section & Record<string, unknown>)[]).map((s) => {
      if (s.blockType !== 'aboutIntro') return s
      changed = true
      return { ...s, ...intro[locale], buttonUrl: '/about/introduction' }
    })
    if (changed) await payload.updateGlobal({ slug: 'home', locale, depth: 0, data: { sections, _status: 'published' } as never })
  }

  for (const e of docEvents()) {
    const { totalDocs } = await payload.count({ collection: 'events', where: { slug: { equals: e.slug } } })
    if (!totalDocs) await createBilingual(payload, 'events', e as never)
  }
}

/** Blog: English summaries (the English versions were saved without one, so the Marathi text showed instead) */
export async function applyBlogExcerpts(payload: Payload) {
  for (const post of POSTS as { slug: string; excerptEn?: string }[]) {
    if (!post.excerptEn) continue
    const doc = (await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } }, limit: 1, depth: 0, locale: 'en', fallbackLocale: false as never })).docs[0]
    if (!doc || doc.excerpt) continue // keep any English summary written in the admin
    await payload.update({ collection: 'posts', id: doc.id, locale: 'en', depth: 0, data: { excerpt: post.excerptEn } as never })
  }
}

/** 14 Oct 2026: Thoughts page removed, Biography → कौटुंबिक पार्श्वभूमी, new portraits, new menu, client document content */
export async function applyContentUpdates(payload: Payload) {
  await renamePages(payload)
  await renameHome(payload)
  await applyPortraits(payload)
  await applyAboutMenu(payload)
  await applyDocContent(payload)
  await applyBlogExcerpts(payload)
}
