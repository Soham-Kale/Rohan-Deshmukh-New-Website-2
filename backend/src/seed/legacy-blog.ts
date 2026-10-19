import type { Payload } from 'payload'
import { parse, type HTMLElement } from 'node-html-parser'
import { LEGACY, image, md } from './helpers'

/** Blog posts on the current site (used as fallback when the site can't be reached) */
export const POSTS = [
  { slug: 'lotus-blog-merit-determination-opportunity', date: '2026-09-04', cover: '/images/gallery/lotus-02.webp', cat: 'social', title: "गुणवत्ता, जिद्द आणि संधी: 'लोटस' घडवतेय विद्यार्थ्यांच्या भविष्याची नवी वाट", en: "Merit, Determination, and Opportunity: How LOTUS is Shaping a New Path for Students' Futures", excerpt: 'समाजातील आर्थिकदृष्ट्या दुर्बल घटकांतील अनेक मुलं गुणवत्तेत कुठेही कमी नसतात. त्यांच्यात बुद्धिमत्ता असते, मेहनत करण्याची तयारी असते आणि मोठी स्वप्नं असतात.', excerptEn: "Many children from economically weaker sections of society are in no way behind in merit. They have intelligence, the willingness to work hard and big dreams." },
  { slug: 'lokmangal-samudayik-vivah-sohala', date: '2026-08-30', cover: '/images/gallery/samudayik-vivah-20.webp', cat: 'social', title: 'विवाहाच्या माध्यमातून सामाजिक परिवर्तन — लोकमंगल सामुदायिक विवाह सोहळा', en: 'Social Change Through Marriage — The Lokmangal Samudayik Vivah Sohala', excerpt: 'लग्न म्हणजे दोन माणसांच्या आयुष्यातला एक नवा टप्पा. पण आई-वडिलांसाठी तो त्याहूनही मोठा क्षण असतो.', excerptEn: "A wedding marks a new chapter in two people’s lives. But for their parents, it is an even bigger moment." },
  { slug: 'lokmangal-annapurna-yojana', date: '2026-08-30', cover: '/images/gallery/annapurna-08.webp', cat: 'social', title: 'एक डबा जेवणाचा, पण त्यामागे माणुसकीचा हात — लोकमंगल अन्नपूर्णा योजना', en: 'A Tiffin Full of Food, But Carried by a Hand Full of Care — The Lokmangal Annapurna Yojana', excerpt: 'वृद्धत्व हा आयुष्याचा असा टप्पा आहे, जिथे माणसाला सर्वाधिक गरज असते ती आधाराची.', excerptEn: "Old age is the stage of life when a person needs support the most." },
  { slug: 'shikshan-rojgar-berojgari', date: '2026-08-29', cover: '/images/blog/inline-00.webp', cat: 'policy', title: 'शिक्षणातून रोजगारापर्यंतचा पूल कुठे तुटतोय? बेरोजगारीच्या मुळाशी नेमकं काय आहे?', en: 'Where Is the Bridge Between Education and Employment Breaking? Getting to the Root of Unemployment', excerpt: 'हजारो तरुण आज म्हणतात की, आम्हाला नोकरी मिळत नाही. आणि दुसरीकडे कंपन्या म्हणतात की, आम्हाला चांगली आणि योग्य माणसं मिळत नाहीत.', excerptEn: "Thousands of young people say today that they cannot find jobs, while companies say they cannot find good, suitable people." },
  { slug: 'pure-milk-safe-future', date: '2026-08-29', cover: '/images/blog/milk-cover.webp', cat: 'policy', title: 'शुद्ध दूध, सुरक्षित भविष्य: महाराष्ट्रातील दूध भेसळीचा वाढता धोका आणि रोहन देशमुख यांचे आवाहन', en: 'Pure Milk, Safe Future: The Rising Threat of Milk Adulteration in Maharashtra', excerpt: 'सकाळचा चहा असो, शाळेत जाण्यापूर्वी मुलाला दिलेला दुधाचा ग्लास असो किंवा रोजच्या स्वयंपाकातील वापर असो — दूध हा प्रत्येक महाराष्ट्रीयन कुटुंबाच्या जीवनाचा महत्त्वाचा भाग आहे.', excerptEn: "Whether it is the morning tea, the glass of milk given to a child before school or everyday cooking — milk is an important part of every Maharashtrian family’s life." },
  { slug: 'shetkari-bajarbhav-mahiti', date: '2026-08-29', cover: '/images/blog/farmer-cover.webp', cat: 'policy', title: 'शेतकरी पिकवतो, बाजार भाव ठरवतो; मग निर्णयाची ताकद त्याच्या हातात कधी येणार?', en: 'The Farmer Grows, the Market Sets the Price — When Will the Power to Decide Be His?', excerpt: 'शेतकरी पिकवतो, पण भाव बाजार ठरवतो. निर्णयाची ताकद शेतकऱ्याच्या हातात कधी येणार?', excerptEn: "The farmer grows the crop, but the market sets the price. When will the power to decide come into the farmer’s hands?" },
  { slug: 'one-nation-one-election', date: '2026-08-29', cover: '/images/blog/one-nation-cover.webp', cat: 'policy', title: 'One Nation, One Election: भारताच्या निवडणूक व्यवस्थेपुढचा नवा विचार', en: 'One Nation, One Election: A New Idea for India’s Electoral System', excerpt: 'एक देश, एक निवडणूक — भारताच्या निवडणूक व्यवस्थेबद्दलचा नवा विचार.', excerptEn: "One Nation, One Election — a new idea for India’s electoral system." },
]

const latinRatio = (s: string) => {
  const letters = s.replace(/[^\p{L}]/gu, '')
  if (!letters.length) return 0
  return (letters.match(/[A-Za-z]/g)?.length ?? 0) / letters.length
}

const imgSrc = (el: HTMLElement) => {
  const s = el.getAttribute('src') || ''
  return s.includes('url=') ? decodeURIComponent(s.split('url=')[1].split('&')[0]) : s
}

/** Convert one element of the article body to markdown */
function toMd(el: HTMLElement): string[] {
  const tag = el.tagName
  const text = () => el.text.replace(/\s+/g, ' ').trim()
  if (!tag) return []
  if (/^H[1-6]$/.test(tag)) return text() ? ['#'.repeat(Math.max(2, +tag[1])) + ' ' + text()] : []
  if (tag === 'P') return text() ? [text()] : []
  if (tag === 'BLOCKQUOTE') return text() ? ['> ' + text()] : []
  if (tag === 'UL' || tag === 'OL') return [el.querySelectorAll(':scope > li').map((li, i) => (tag === 'OL' ? `${i + 1}. ` : '- ') + li.text.replace(/\s+/g, ' ').trim()).join('\n')]
  if (tag === 'IMG') return [`![${el.getAttribute('alt') ?? ''}](${imgSrc(el)})`]
  if (tag === 'FIGCAPTION') return text() ? [`_${text()}_`] : []
  return el.childNodes.flatMap((c) => ((c as HTMLElement).tagName ? toMd(c as HTMLElement) : []))
}

/** Fetch a post from the live site and split it into Marathi + English markdown */
async function fetchPost(slug: string) {
  const res = await fetch(`${LEGACY}/blog-footer/${slug}`, { signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const root = parse(await res.text())
  const body = root.querySelector('article .prose-rd') || root.querySelector('article section')
  if (!body) throw new Error('article body not found')
  const blocks = body.childNodes.flatMap((c) => ((c as HTMLElement).tagName ? toMd(c as HTMLElement) : []))
  // English section = first long Latin paragraph after some Marathi content; everything after it
  let split = blocks.length
  let seenMr = 0
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.startsWith('![')) continue
    const r = latinRatio(b)
    if (r < 0.3) seenMr++
    else if (seenMr >= 3 && r > 0.85 && b.replace(/^[#>\s-]+/, '').length > 30) {
      split = i
      break
    }
  }
  const clean = (arr: string[]) => arr.filter((b) => !/^(Author:|लेखक:)/.test(b)).join('\n\n')
  return { mr: clean(blocks.slice(0, split)), en: clean(blocks.slice(split)) }
}

export async function importBlog(payload: Payload, categories: Record<string, number>) {
  let fetched = 0
  for (const post of POSTS) {
    let mrMd = post.excerpt
    let enMd = ''
    try {
      const r = await fetchPost(post.slug)
      mrMd = r.mr
      enMd = r.en
      fetched++
    } catch {
      /* offline — keep excerpt only */
    }
    const cover = await image(payload, post.cover, post.title)
    const doc = await payload.create({
      collection: 'posts',
      locale: 'mr',
      data: {
        title: post.title, slug: post.slug, publishedAt: new Date(post.date).toISOString(),
        author: 'रोहन देशमुख', coverImage: cover ?? undefined, excerpt: post.excerpt,
        categories: [categories[post.cat]].filter(Boolean), tags: post.cat === 'social' ? ['लोकमंगल', 'सामाजिक कार्य'] : ['धोरण', 'विचार'],
        content: (await md(payload, mrMd)) as never, _status: 'published',
      },
    })
    await payload.update({
      collection: 'posts', id: doc.id, locale: 'en',
      data: { title: post.en, subtitle: null as never, author: 'Rohan Deshmukh', excerpt: (post.excerptEn ?? null) as never, content: enMd ? ((await md(payload, enMd)) as never) : null, _status: 'published' },
    })
  }
  return fetched
}
