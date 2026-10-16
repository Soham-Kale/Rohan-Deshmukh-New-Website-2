/**
 * Homepage layout (Oct 2026, client document "New Content RD Web"): every section after the hero slider.
 * The hero slider itself is never touched — its slides stay exactly as they are on the website.
 * Order: About → Journey → Family → Lokmangal Parivar → Foundation (23 initiatives) → Political journey →
 * Events → Vision → Blog → Photos → Connect.
 */
import type { Payload } from 'payload'
import { L } from './l10n'
import { image, PORTRAITS } from './helpers'
import { updateGlobalBilingual } from './bilingual'
import { HOME_INTRO, HOME_TAGLINE } from './content-globals'
import { DOC_FAMILY } from './content-pages'

const GALLERY = ['tuljapur-sabha-01', 'samudayik-vivah-13', 'prachar-sabha-02', 'annapurna-03', 'cm-chashak-04', 'lotus-05', 'shikshanratna-puraskar-02', 'jalsandharan-02', 'samudayik-vivah-16']

export const homeSectionsAfterHero = (p: Payload, keep: { galleryImages?: number[] } = {}) => [
  {
    blockType: 'aboutIntro', eyebrow: L('परिचय', 'About'), heading: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'),
    image: image(p, PORTRAITS.about, 'रोहन सुभाष देशमुख'),
    pledge: L(HOME_TAGLINE.mr, HOME_TAGLINE.en),
    text: L(HOME_INTRO.mr, HOME_INTRO.en),
    stats: [
      { label: L('जन्म', 'Born'), value: L('१२ डिसेंबर १९८७, सोलापूर', '12 Dec 1987, Solapur') },
      { label: L('शिक्षण', 'Studied'), value: L('RIT, अमेरिका', 'RIT, USA') },
      { label: L('अध्यक्ष', 'President'), value: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation') },
      { label: L('लेखक', 'Author'), value: L('न्यू इंडिया मॅनिफेस्टो', 'New India Manifesto') },
    ],
    buttonLabel: L('संपूर्ण परिचय वाचा', 'Read full introduction'), buttonUrl: '/about/introduction',
  },
  {
    blockType: 'homeJourney', eyebrow: L('प्रवास', 'His journey'), heading: L('सोलापूर ते जग, आणि पुन्हा सोलापूर', 'From Solapur to the world, and back home'),
    items: [
      { place: L('सोलापूर', 'Solapur'), title: L('शाळा आणि NCC', 'School & NCC'), text: L('लिटल फ्लॉवर कॉन्व्हेंट स्कूल; इयत्ता नववीपासून सक्रिय NCC कॅडेट.', 'Little Flower Convent School; active NCC cadet from Class 9.') },
      { place: L('नवी दिल्ली', 'New Delhi'), title: L('सर्वोत्कृष्ट कॅडेट', 'Best Cadet'), text: L('नवी दिल्लीतील NCC संचलनासाठी निवड आणि सर्वोत्कृष्ट कॅडेट पुरस्कार.', 'Selected for the NCC parade in New Delhi and named Best Cadet.') },
      { place: L('रोचेस्टर, अमेरिका', 'Rochester, USA'), title: L('उच्च शिक्षण', 'Higher studies'), text: L('RIT मधून जैवतंत्रज्ञान आणि उद्योजकता विकास या विषयात पदवी.', 'Biotechnology and Entrepreneurship Development at RIT.') },
      { place: L('सोलापूर · २००९', 'Solapur · 2009'), title: L('पुन्हा आपल्या मातीत', 'Back home'), text: L('आपल्या माणसांमध्ये काम करण्यासाठी सोलापूरला परतले.', 'Returned to Solapur to work among his own people.') },
    ],
    buttonLabel: L('स्वपरिचय', 'Introduction'), buttonUrl: '/about/introduction',
  },
  {
    blockType: 'family', eyebrow: L('कौटुंबिक पार्श्वभूमी', 'Family background'), heading: L('देशमुख परिवार', 'The Deshmukh family'),
    intro: L(
      'श्रद्धा, समाजाप्रती कर्तव्याची भावना आणि उद्योजकतेचा वारसा — आजही महाराष्ट्रात एक आदर्श एकत्र कुटुंब म्हणून ओळखला जाणारा परिवार.',
      'Faith, a strong sense of duty towards society and a spirit of enterprise — still seen as a model joint family across Maharashtra.',
    ),
    members: [
      { image: image(p, DOC_FAMILY[0].img, ''), relation: DOC_FAMILY[0].relation, name: DOC_FAMILY[0].name, text: L('शिक्षक आणि श्रद्धावान व्यक्तिमत्त्व; धाराशिव जिल्ह्यातील येडशी येथे गुरुकुलाची स्थापना.', 'Teacher and man of faith; started the gurukul at Yedshi, Dharashiv.') },
      { image: image(p, DOC_FAMILY[1].img, ''), relation: DOC_FAMILY[1].relation, name: DOC_FAMILY[1].name, text: L('‘बापूसाहेब’ — लोकमंगल समूहाचे संस्थापक अध्यक्ष; विधानसभा आणि लोकसभेत लोकप्रतिनिधी.', 'Bapusaheb — Founder President of the Lokmangal Group; elected to the Assembly and the Lok Sabha.') },
      { image: image(p, DOC_FAMILY[2].img, ''), relation: DOC_FAMILY[2].relation, name: DOC_FAMILY[2].name, text: L('लोकमंगल पतसंस्थेचे अध्यक्ष आणि लोकमंगल फाऊंडेशनचे उपाध्यक्ष.', 'President, Lokmangal Patsanstha; Vice President, Lokmangal Foundation.') },
    ],
    buttonLabel: L('संपूर्ण माहिती', 'Full family story'), buttonUrl: '/about/biography',
  },
  {
    blockType: 'homeParivar', eyebrow: L('लोकमंगल परिवार', 'Lokmangal Parivar'),
    heading: L('एकत्र वाढणाऱ्या संस्थांचा परिवार', 'A family of institutions that grow together'),
    text: L(
      'मा. श्री. सुभाष देशमुख यांनी स्थापन केलेला लोकमंगल समूह. रोहन हा वारसा लोकमंगल मल्टीस्टेटचे संचालक आणि लोकमंगल फाऊंडेशनचे अध्यक्ष म्हणून पुढे नेत आहेत.',
      'Founded by Hon. Shri Subhash Deshmukh. Rohan carries the legacy forward as Director of Lokmangal Multistate and President of Lokmangal Foundation.',
    ),
    items: [
      { value: L('४', '4'), title: L('वित्तीय संस्था', 'Financial institutions'), text: L('बचत, कर्ज आणि प्रगती', 'Save, borrow and grow') },
      { value: L('४', '4'), title: L('उद्योग', 'Industries'), text: L('रोजगार आणि शेतमालाचे मूल्यवर्धन', 'Jobs and value for farm produce') },
      { value: L('१०', '10'), title: L('शैक्षणिक संस्था', 'Education'), text: L('शाळेपासून व्यावसायिक महाविद्यालयांपर्यंत', 'School to professional colleges') },
      { value: L('५', '5'), title: L('फाऊंडेशन व संशोधन', 'Foundations & research'), text: L('आरोग्य आणि ग्रामीण विकास', 'Health and rural development') },
      { value: L('१', '1'), title: L('माध्यमे', 'Media'), text: L('लोकमंगल वृत्तांत', 'Lokmangal Vruttant') },
    ],
    buttonLabel: L('लोकमंगल परिवार पहा', 'Explore Lokmangal Parivar'), buttonUrl: '/lokmangal/parivar',
  },
  {
    blockType: 'initiativesShowcase', eyebrow: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'),
    heading: L('२३ उपक्रम. हजारो कुटुंबांपर्यंत पोहोच.', '23 initiatives. Thousands of families reached.'),
    intro: L('आजची सेवा, उद्याची समृद्धी — सोलापूर आणि धाराशिव जिल्ह्यांतील ग्रामीण भागात.', 'Serving today, building a prosperous tomorrow — across rural Solapur and Dharashiv.'),
    stats: [
      { value: L('२३', '23'), label: L('सामाजिक उपक्रम', 'Social initiatives') },
      { value: L('३,२२१', '3,221'), label: L('विवाहबद्ध जोडपी', 'Couples married') },
      { value: L('५००', '500'), label: L('ज्येष्ठांना दररोज जेवण', 'Elders fed daily') },
      { value: L('२२५', '225'), label: L('विद्यार्थी दत्तक', 'Students adopted') },
      { value: L('१०० कोटी लि.', '100 Cr L'), label: L('जलसाठा क्षमता', 'Water storage added') },
    ],
    buttonLabel: L('सर्व २३ उपक्रम पहा', 'View all 23 initiatives'), buttonUrl: '/lokmangal/foundation#projects',
  },
  {
    blockType: 'homeHighlights', eyebrow: L('राजकीय प्रवास', 'Political journey'), heading: L('लोकांशी थेट नात्यावर उभे नेतृत्व', 'Leadership built on a direct bond with people'),
    items: [
      { tag: L('त्यांची संकल्पना', 'His idea'), title: L('स्वामी विवेकानंद विचार यात्रा', 'Swami Vivekananda Vichar Yatra'), text: L('धाराशिव जिल्ह्यातील शहरे आणि गावांमधील तरुणांपर्यंत स्वामी विवेकानंदांचे विचार पोहोचवले.', 'Carried Vivekananda’s ideas to young people in towns and villages across Dharashiv.'), url: '/political-career' },
      { tag: L('सरचिटणीस', 'General Secretary'), title: L('भारतीय जनता युवा मोर्चा', 'Bharatiya Janata Yuva Morcha'), text: L('संपूर्ण महाराष्ट्रात प्रवास करून तरुणांना राजकारणाशी आणि सामाजिक प्रश्नांशी जोडले.', 'Travelled across Maharashtra, connecting youth with politics and social issues.'), url: '/political-career' },
      { tag: L('अपक्ष उमेदवार', 'Independent candidate'), title: L('धाराशिव लोकसभा निवडणूक', 'Dharashiv Lok Sabha election'), text: L('पक्ष नाही, फक्त लोक — गावागावात, घराघरात थेट संवाद.', 'No party, only people — village to village, door to door.'), url: '/political-career' },
    ],
    buttonLabel: L('राजकीय कारकीर्द', 'Political career'), buttonUrl: '/political-career',
  },
  {
    blockType: 'homeEvents', eyebrow: L('कार्यक्रम', 'Events'), heading: L('तरुणाई, क्रीडा आणि कलागुणांसाठी व्यासपीठ', 'A stage for youth, sport and talent'),
    limit: 4, buttonLabel: L('सर्व कार्यक्रम', 'All events'), buttonUrl: '/lokmangal/foundation#events',
  },
  {
    blockType: 'homeVision', eyebrow: L('व्हिजन', 'Vision'),
    heading: L('पुढच्या पिढीला स्वतःचे काहीतरी उभे करण्याचा आत्मविश्वास', 'Giving the next generation the confidence to build their own'),
    image: image(p, '/images/vision/book.webp', 'न्यू इंडिया मॅनिफेस्टो'),
    text: L(
      'रोहन यांच्या ‘न्यू इंडिया मॅनिफेस्टो’ या पुस्तकात नव्या भारताविषयीचे विचार मांडले आहेत. त्यातून प्रेरणा घेऊन ते संपूर्ण महाराष्ट्रात सक्षम स्टार्टअप परिसंस्था उभारत आहेत — मोठ्या शहरातील असो वा छोट्या गावातील, प्रत्येक तरुणाला मार्गदर्शन, पाठबळ आणि संधी मिळावी.',
      'Rohan’s book New India Manifesto sets out his ideas for a new India. Inspired by it, he is building a strong startup ecosystem across Maharashtra — so young people from big cities and small towns get guidance, support and opportunity.',
    ),
    buttonLabel: L('व्हिजन वाचा', 'Read the vision'), buttonUrl: '/vision',
  },
  { blockType: 'latestBlog', eyebrow: L('लेखक: रोहन देशमुख', 'By Rohan Deshmukh'), heading: L('ताजे लेख', 'Latest articles'), limit: 3 },
  {
    blockType: 'homeGallery', eyebrow: L('क्षणचित्रे', 'Moments'), heading: L('फोटो संग्रह', 'Photo gallery'),
    images: keep.galleryImages?.length ? keep.galleryImages : GALLERY.map((s) => image(p, `/images/gallery/${s}.webp`)),
    buttonLabel: L('सर्व फोटो पहा', 'View all photos'), buttonUrl: '/media/photos',
  },
  {
    blockType: 'appealBand', heading: L('नवी कल्पना, स्वयंसेवा किंवा एकत्र काम करायचे आहे?', 'Have an idea, want to volunteer or work together?'),
    text: L('रोहन यांच्या कार्यालयाला लिहा — प्रत्येक संदेश वाचला जातो.', 'Write to Rohan’s office — every message is read.'),
    buttonLabel: L('संपर्क साधा', 'Contact'), buttonUrl: '/contact', showWhatsapp: true,
  },
]

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/** Marathi + English copies of the same saved block → one bilingual structure (L() wherever the two differ) */
function mergeLocales(mr: unknown, en: unknown): unknown {
  if (Array.isArray(mr)) return mr.map((x, i) => mergeLocales(x, Array.isArray(en) ? en[i] : undefined))
  if (isObj(mr)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(mr)) out[k] = mergeLocales(v, isObj(en) ? en[k] : undefined)
    return out
  }
  if (typeof mr === 'string' && en !== mr) return L(mr, (en as string | null | undefined) ?? null)
  return mr
}

/** Rebuild the homepage after the hero slider (the slider's slides stay exactly as saved, in both languages) */
export async function applyHomeLayout(payload: Payload) {
  const read = (locale: 'mr' | 'en') => payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: false as never })
  const [mr, en] = await Promise.all([read('mr'), read('en')])
  const mrSections = (mr.sections ?? []) as Record<string, unknown>[]
  const enSections = (en.sections ?? []) as Record<string, unknown>[]
  const heroes = mrSections.flatMap((b, i) => (b.blockType === 'heroSlider' ? [mergeLocales(b, enSections[i])] : []))
  const gallery = mrSections.find((b) => b.blockType === 'homeGallery')?.images as (number | { id: number })[] | undefined
  const galleryImages = (gallery ?? []).map((m) => (typeof m === 'object' ? m.id : m)).slice(0, 9)
  await updateGlobalBilingual(payload, 'home', { sections: [...heroes, ...homeSectionsAfterHero(payload, { galleryImages })] })
}
