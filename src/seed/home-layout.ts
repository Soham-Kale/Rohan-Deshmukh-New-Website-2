/**
 * Homepage layout (Oct 2026, client document "New Content RD Web"): every section after the hero slider.
 * The hero slider itself is never touched — its slides stay exactly as they are on the website.
 * Order (17 Oct 2026): About → Journey → सामाजिक उपक्रम → Vision (New India Manifesto) → Lokmangal Parivar → Video → Reels.
 */
import type { Payload } from 'payload'
import { L } from './l10n'
import { image, PORTRAITS } from './helpers'
import { updateGlobalBilingual } from './bilingual'
import { HOME_INTRO, HOME_TAGLINE } from './content-globals'
import { DOC_FAMILY } from './content-pages'

export const homeSectionsAfterHero = (p: Payload) => [
  {
    blockType: 'aboutIntro', eyebrow: L('परिचय', 'About'), heading: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'),
    image: image(p, PORTRAITS.about, 'रोहन सुभाष देशमुख'),
    pledge: L(HOME_TAGLINE.mr, HOME_TAGLINE.en),
    text: L(HOME_INTRO.mr, HOME_INTRO.en),
    buttonLabel: L('संपूर्ण परिचय वाचा', 'Read full introduction'), buttonUrl: '/about/introduction',
  },
  {
    blockType: 'homeJourney', eyebrow: L('सोलापूर ते जग', 'From Solapur to the world'), heading: L('प्रवास', 'His Journey'),
    items: [
      {
        place: L('सोलापूर, महाराष्ट्र — पायाभरणी', 'Solapur, Maharashtra — The Foundation'), title: L('लिटल फ्लॉवर कॉन्व्हेंट स्कूल', 'Little Flower Convent School'),
        text: L(
          'त्यांच्या प्रवासाची सुरुवात सोलापूरमध्ये झाली, जिथे त्यांनी लिटल फ्लॉवर कॉन्व्हेंट स्कूलमध्ये शालेय शिक्षण घेतले. इयत्ता नववीपासून ते सक्रिय NCC कॅडेट होते — यातून त्यांच्यात शिस्त, नेतृत्व आणि जबाबदारीची भक्कम जाणीव रुजली.',
          'His journey began in Solapur, where he pursued his schooling at Little Flower Convent School. From Class 9, he became an active NCC cadet, developing discipline, leadership and a strong sense of responsibility.',
        ),
      },
      {
        place: L('नवी दिल्ली — अभिमानाचा क्षण', 'New Delhi — A Proud Achievement'), title: L('NCC सर्वोत्कृष्ट कॅडेट', 'NCC Best Cadet'),
        text: L(
          'त्यांच्या निष्ठेमुळे आणि शिस्तीमुळे त्यांना नवी दिल्लीतील NCC संचलनात प्रतिनिधित्व करण्याची संधी मिळाली, जिथे त्यांना ‘सर्वोत्कृष्ट कॅडेट’ हा प्रतिष्ठेचा सन्मान मिळाला.',
          'His dedication and discipline earned him the opportunity to represent at the NCC Parade in New Delhi, where he was honoured with the prestigious distinction of Best Cadet.',
        ),
      },
      {
        place: L('रोचेस्टर, अमेरिका — क्षितिजे विस्तारताना', 'Rochester, USA — Expanding Horizons'), title: L('RIT मध्ये उच्च शिक्षण', 'Higher Education at RIT'),
        text: L(
          'नवनिर्मिती आणि उद्योजकतेच्या ओढीने त्यांनी अमेरिकेतील रोचेस्टर इन्स्टिट्यूट ऑफ टेक्नॉलॉजी (RIT) येथे जैवतंत्रज्ञान आणि उद्योजकता विकास या विषयांत उच्च शिक्षण घेतले.',
          'Driven by a passion for innovation and entrepreneurship, he pursued higher studies in Biotechnology and Entrepreneurship Development at the Rochester Institute of Technology (RIT), USA.',
        ),
      },
      {
        place: L('२०१६ — सेवेचा नवा अध्याय', '2016 — A New Chapter of Service'), title: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'),
        text: L(
          'समाजात अर्थपूर्ण बदल घडवण्याचा ध्यास घेऊन परतल्यानंतर, २०१६ मध्ये त्यांनी लोकमंगल फाऊंडेशनच्या अध्यक्षपदाची जबाबदारी स्वीकारली — समाजविकास आणि सेवेसाठी समर्पित नव्या अध्यायाची ही सुरुवात होती.',
          'Returning with a vision to create meaningful social impact, he took on the responsibility of leading Lokmangal Foundation as its President in 2016, marking the beginning of a new chapter dedicated to community development and social service.',
        ),
      },
    ],
    buttonLabel: L('स्वपरिचय', 'Introduction'), buttonUrl: '/about/introduction',
  },
  {
    blockType: 'homeHighlights', eyebrow: L('सामाजिक उपक्रम', 'Social initiatives'), heading: L('लोकांशी थेट नात्यावर उभे नेतृत्व', 'Leadership built on a direct bond with people'),
    items: [
      { image: image(p, '/images/gallery/political/rd-political-26.webp', ''), tag: L('त्यांची संकल्पना', 'His idea'), title: L('स्वामी विवेकानंद विचार यात्रा', 'Swami Vivekananda Vichar Yatra'), text: L('धाराशिव जिल्ह्यातील शहरे आणि गावांमधील तरुणांपर्यंत स्वामी विवेकानंदांचे विचार पोहोचवले.', 'Carried Vivekananda’s ideas to young people in towns and villages across Dharashiv.'), url: '/political-career' },
      { image: image(p, '/images/gallery/political/rd-political-15.webp', ''), tag: L('सरचिटणीस', 'General Secretary'), title: L('भारतीय जनता युवा मोर्चा', 'Bharatiya Janata Yuva Morcha'), text: L('संपूर्ण महाराष्ट्रात प्रवास करून तरुणांना राजकारणाशी आणि सामाजिक प्रश्नांशी जोडले.', 'Travelled across Maharashtra, connecting youth with politics and social issues.'), url: '/political-career' },
      { image: image(p, '/images/gallery/political/rd-political-12.webp', ''), tag: L('अपक्ष उमेदवार', 'Independent candidate'), title: L('धाराशिव लोकसभा निवडणूक', 'Dharashiv Lok Sabha election'), text: L('पक्ष नाही, फक्त लोक — गावागावात, घराघरात थेट संवाद.', 'No party, only people — village to village, door to door.'), url: '/political-career' },
    ],
    buttonLabel: L('राजकीय कारकीर्द', 'Political career'), buttonUrl: '/political-career',
  },
  {
    blockType: 'homeVision', eyebrow: L('व्हिजन', 'Vision'),
    heading: L('पुढच्या पिढीला स्वतःचे काहीतरी उभे करण्याचा आत्मविश्वास', 'Giving the next generation the confidence to build their own'),
    image: image(p, '/images/vision/new-india-manifesto-cover.webp', 'The New India Manifesto — Rohan Deshmukh'),
    text: L(
      'रोहन यांच्या ‘न्यू इंडिया मॅनिफेस्टो’ या पुस्तकात नव्या भारताविषयीचे विचार मांडले आहेत. त्यातून प्रेरणा घेऊन ते संपूर्ण महाराष्ट्रात सक्षम स्टार्टअप परिसंस्था उभारत आहेत — मोठ्या शहरातील असो वा छोट्या गावातील, प्रत्येक तरुणाला मार्गदर्शन, पाठबळ आणि संधी मिळावी.',
      'Rohan’s book New India Manifesto sets out his ideas for a new India. Inspired by it, he is building a strong startup ecosystem across Maharashtra — so young people from big cities and small towns get guidance, support and opportunity.',
    ),
    buttonLabel: L('व्हिजन वाचा', 'Read the vision'), buttonUrl: '/vision',
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
  // hidden on the homepage — the कौटुंबिक पार्श्वभूमी page (/about/family) reads its content from this section
  {
    blockType: 'family', hidden: true, eyebrow: L('कौटुंबिक पार्श्वभूमी', 'Family background'),
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
    blockType: 'featuredVideo', eyebrow: L('व्हिडिओ', 'Video'),
    heading: L('पुण्याच्या दुधात नेमकं काय मिसळतंय?', 'Milk Adulteration in India: Pune Milk Reality Check'),
    youtubeUrl: 'https://www.youtube.com/watch?v=KN_Pb_Cm8Xs',
    text: L(
      'शेतकऱ्यापासून ग्राहकापर्यंत पुण्याच्या दुधाचा प्रवास — संकलन केंद्र, डेअरी कामगार, विक्रेते, ग्राहक आणि आरोग्य तज्ज्ञांशी संवाद, आणि धाराशिव जिल्ह्यातील बनावट दूध रॅकेटचा रिॲलिटी चेक.',
      'Following Pune’s milk from the farmer to your home — conversations with collection centres, dairy workers, vendors, consumers and health experts, and a reality check on a synthetic-milk racket in Dharashiv district.',
    ),
    links: [{ label: L('YouTube वर पहा', 'Watch on YouTube'), url: 'https://youtu.be/KN_Pb_Cm8Xs', newTab: true }],
  },
  {
    blockType: 'socialFeeds', eyebrow: L('इंस्टाग्राम', 'Instagram'), heading: L('रील्स', 'Reels'),
    text: L('रोहन यांच्या कामाची आणि लोकांसोबतच्या क्षणांची झलक — रील्सच्या स्वरूपात.', 'Glimpses of Rohan’s work and his moments with people, as reels.'),
    instagramPosts: [
      { url: 'https://www.instagram.com/reel/DcoDuGQs7fB/', title: L('रोहन देशमुख — रील', 'Rohan Deshmukh — reel') },
      { url: 'https://www.instagram.com/reel/DeMgK2oOt5i/', title: L('रोहन देशमुख — रील', 'Rohan Deshmukh — reel') },
      { url: 'https://www.instagram.com/reel/Db0vnBzvFn0/', title: L('रोहन देशमुख — रील', 'Rohan Deshmukh — reel') },
    ],
    showFacebook: false, showYoutube: false,
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
  await updateGlobalBilingual(payload, 'home', { sections: [...heroes, ...homeSectionsAfterHero(payload)] })
}
