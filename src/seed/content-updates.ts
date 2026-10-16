/**
 * Content changes that existing databases need (new databases get them from the seed).
 * Run on the live site by migrations, and locally by `npm run dev` (once per CONTENT_VERSION)
 * or by hand with `npm run content:update`.
 */
import type { Payload } from 'payload'
import { applyMenu } from './menu'
import { image, md, PORTRAITS, remoteImage } from './helpers'
import { LOKMANGAL_MEDIA, LOKMANGAL_PROJECTS, S3 } from './lokmangal-projects'
import { createBilingual, replaceBilingual } from './bilingual'
import { DOC_TEXT_TARGETS, familyPage, foundationPage, introPage, parivarPage, politicalPage } from './content-pages'
import { HOME_INTRO, HOME_TAGLINE } from './content-globals'
import { docEvents } from './content-collections'
import { POSTS } from './legacy-blog'
/** Bump when adding a change below — scripts/dev.mjs reads this line */
export const CONTENT_VERSION = '2026-10-16b'

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

/** Homepage परिचय: name → tagline → description, without the counters (15 Oct 2026) */
export async function applyHomeIntro(payload: Payload) {
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

  await applyHomeIntro(payload)

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

/** 15 Oct 2026: लोकमंगल menu (फाऊंडेशन · कार्यक्रम · प्रकल्प) and the homepage परिचय without counters */
export async function applyLokmangalMenuAndIntro(payload: Payload) {
  await applyMenu(payload)
  await applyHomeIntro(payload)
}

/**
 * Client document, orange-highlighted updates (15 Oct 2026): replaces only the text of six blocks
 * (family introduction, grandfather, Lokmangal Parivar introduction, three political-career sections).
 * Blocks are found by their English heading; everything else on those pages is untouched.
 */
export async function applyDocTextUpdates(payload: Payload, only?: string[]) {
  const all = only ? DOC_TEXT_TARGETS.filter((t) => only.includes(t.heading)) : DOC_TEXT_TARGETS
  for (const path of [...new Set(all.map((t) => t.path))]) {
    const page = (await payload.find({ collection: 'pages', where: { path: { equals: path } }, limit: 1, depth: 0, locale: 'en', fallbackLocale: false as never })).docs[0]
    if (!page) continue
    const headings = ((page.layout ?? []) as { heading?: string | null }[]).map((b) => b.heading ?? '')
    const targets = all.filter((t) => t.path === path).map((t) => ({ ...t, idx: headings.indexOf(t.heading) })).filter((t) => t.idx >= 0)
    if (!targets.length) continue
    for (const locale of ['mr', 'en'] as const) {
      const doc = await payload.findByID({ collection: 'pages', id: page.id, locale, depth: 0, fallbackLocale: false as never })
      const layout = [...((doc.layout ?? []) as Record<string, unknown>[])]
      for (const t of targets) if (layout[t.idx]) layout[t.idx] = { ...layout[t.idx], body: await md(payload, t.text[locale]) }
      await payload.update({ collection: 'pages', id: page.id, locale, depth: 0, data: { layout, _status: 'published' } as never })
    }
  }
}

/** स्वपरिचय page in the journey-map layout: education as places (Solapur → New Delhi → Rochester → Solapur), fact tags without numbers */
export async function applyIntroJourney(payload: Payload) {
  const data = introPage(payload) as unknown as Record<string, unknown> & { path: string }
  const found = (await payload.find({ collection: 'pages', where: { path: { equals: data.path } }, limit: 1, depth: 0 })).docs[0]
  if (found) await replaceBilingual(payload, 'pages', found.id, { ...data, _status: 'published' })
  else await createBilingual(payload, 'pages', { ...data, _status: 'published' })
}

/**
 * लोकमंगल प्रकल्प: the 23 initiatives exactly as on lokmangalfoundation.com/projects — title, category,
 * key-impact line, card text, objective, full description, cover photo, photo gallery and videos, in Marathi and English.
 * Existing initiatives are updated in place (their impact counters stay), missing ones are added.
 * Photos that can't be downloaded are skipped, so the current ones stay instead of a broken image.
 */
const VIDEO_TITLES: Record<string, [string, string][]> = {
  'bhajan-bharud-spardha': [
    ['व्हिडिओ १ : मुख्य कार्यक्रम सोहळा', 'Video 1: Main Event Ceremony'],
    ['व्हिडिओ २ : स्पर्धा क्षणचित्रे (हायलाइट्स)', 'Video 2: Event Highlights'],
    ['व्हिडिओ ३ : कलाकारांचे भारूड सादरीकरण', 'Video 3: Folk Bharud Performance'],
  ],
}

/** "**उद्दिष्ट:** …" / "**Objective:** …" at the top of a description becomes the separate objective box */
const splitObjective = (body: string) => {
  const m = body.match(/^\*\*(?:उद्दिष्ट|Objective):\*\*\s*(.+?)\n\n([\s\S]*)$/)
  return m ? { objective: m[1].trim(), body: m[2] } : { objective: null, body }
}

/** Download several photos, four at a time, keeping their order */
async function remoteImages(payload: Payload, paths: string[], alt: string) {
  const ids: (number | null)[] = new Array(paths.length).fill(null)
  let next = 0
  const worker = async () => {
    while (next < paths.length) {
      const i = next++
      ids[i] = await remoteImage(payload, `${S3}/${paths[i]}`, alt)
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()])
  return ids.filter((id): id is number => id !== null)
}

export async function applyLokmangalProjects(payload: Payload) {
  for (const [i, p] of LOKMANGAL_PROJECTS.entries()) {
    const media = LOKMANGAL_MEDIA[p.slug] ?? { gallery: [], videos: [] }
    const heroImage = p.image ? await remoteImage(payload, p.image, p.mr.title) : null
    const gallery = await remoteImages(payload, media.gallery, p.mr.title)
    const youtube = media.videos.find((v) => v.includes('youtube.com') || v.includes('youtu.be'))
    const files = media.videos.filter((v) => v !== youtube).map((v) => (v.startsWith('http') ? v : `${S3}/${v}`))
    const titles = VIDEO_TITLES[p.slug] ?? []

    const text = async (t: typeof p.mr) => {
      const { objective, body } = splitObjective(t.body)
      return { title: t.title, stat: t.stat ?? null, objective, excerpt: t.summary, body: await md(payload, body) }
    }
    const base = {
      category: p.category, order: i + 1, organisation: 'foundation', _status: 'published',
      ...(heroImage ? { heroImage } : {}),
      // keep the current photos if none of the new ones could be downloaded
      ...(gallery.length ? { gallery } : media.gallery.length ? {} : { gallery: [] }),
      youtubeUrl: youtube ?? null,
    }
    const found = (await payload.find({ collection: 'initiatives', where: { slug: { equals: p.slug } }, limit: 1, depth: 0, draft: true })).docs[0]
    const mr = { ...base, ...(await text(p.mr)), videos: files.map((url, k) => ({ url, title: titles[k]?.[0] ?? null })) }
    const doc = found
      ? await payload.update({ collection: 'initiatives', id: found.id, locale: 'mr', depth: 0, data: mr as never })
      : await payload.create({ collection: 'initiatives', locale: 'mr', depth: 0, data: { ...mr, slug: p.slug, featured: false } as never })
    const saved = (doc as { videos?: { id?: string | null; url: string }[] | null }).videos ?? []
    await payload.update({
      collection: 'initiatives', id: doc.id, locale: 'en', depth: 0,
      data: { _status: 'published', ...(await text(p.en)), videos: saved.map((v, k) => ({ id: v.id, url: v.url, title: titles[k]?.[1] ?? null })) } as never,
    })
  }
}

/** Blog: the Marathi articles had their English title saved as the subtitle, so English showed under the Marathi title */
export async function clearEnglishSubtitles(payload: Payload) {
  for (const post of POSTS as { slug: string; en: string }[]) {
    const doc = (await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } }, limit: 1, depth: 0, locale: 'mr', fallbackLocale: false as never })).docs[0]
    if (!doc || doc.subtitle !== post.en) continue // keep any subtitle written in the admin
    await payload.update({ collection: 'posts', id: doc.id, locale: 'mr', depth: 0, data: { subtitle: null } as never })
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
  await clearEnglishSubtitles(payload)
  await applyDocTextUpdates(payload)
  await applyIntroJourney(payload)
  await applyLokmangalProjects(payload)
}
