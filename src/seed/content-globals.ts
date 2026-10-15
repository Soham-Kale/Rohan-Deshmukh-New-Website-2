import type { Payload } from 'payload'
import { L } from './l10n'
import { image, md, PORTRAITS } from './helpers'


export const settings = (p: Payload) => ({
  siteName: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'),
  tagline: L('सोलापूरच्या मातीने घडवलेलं व्यक्तिमत्त्व, संस्कारांनी दिलेली दिशा आणि समाजासाठीची बांधिलकी.', 'Shaped by the soil of Solapur, guided by values, committed to society.'),
  logoLight: image(p, '/images/brand/logo-light.webp', 'रोहन सुभाष देशमुख'),
  defaultShareImage: image(p, '/images/og-default.webp', 'रोहन सुभाष देशमुख'),
  phone: '+91 8208737624',
  email: 'connect@rohandeshmukh.in',
  address: L('सोलापूर, महाराष्ट्र', 'Solapur, Maharashtra'),
  whatsappNumber: '918208737624',
  social: {
    facebook: 'https://www.facebook.com/rohandeshmukh.official/',
    instagram: 'https://www.instagram.com/rohan1942',
    twitter: 'https://twitter.com/rohandeshmukhh',
    youtube: 'https://youtube.com/@rd.connects',
    linkedin: 'https://www.linkedin.com/in/rohan-deshmukh-politician',
  },
  connectTagLabel: '#ConnectWithRohan',
  connectTagUrl: '/contact',
  appealHeading: L('चांगल्या महाराष्ट्राच्या उभारणीसाठी आम्हाला साथ द्या', 'Join us in building a better Maharashtra'),
  appealButtonLabel: L('हो! मी तयार आहे!!!', 'YES! I AM IN!!!'),
  appealButtonUrl: '/contact',
  formNotifyEmails: ['connect@rohandeshmukh.in'],
  formConsentText: L('मी माझी माहिती संपर्कासाठी वापरण्यास संमती देतो/देते.', 'I consent to my details being used to contact me.'),
})

const n = (mr: string, en: string, url?: string, children?: unknown[], newTab = false) => ({ label: L(mr, en), url, newTab, children })

export const header = () => ({
  nav: [
    n('मुख्य पृष्ठ', 'Home', '/'),
    n('परिचय', 'About', '/about/introduction', [
      n('स्वपरिचय', 'Introduction', '/about/introduction'),
      n('कौटुंबिक पार्श्वभूमी', 'Family Background', '/about/biography'),
      n('लोकमंगल परिवार', 'Lokmangal Parivar', '/lokmangal/parivar'),
      n('राजकीय कारकीर्द', 'Political Career', '/political-career'),
    ]),
    // लोकमंगल फाऊंडेशन page has its own tabs: माहिती · कार्यक्रम · प्रकल्प
    n('लोकमंगल', 'Lokmangal', '/lokmangal/foundation', [
      n('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation', '/lokmangal/foundation'),
      n('लोकमंगल कार्यक्रम', 'Lokmangal Events', '/lokmangal/foundation#events'),
      n('लोकमंगल प्रकल्प', 'Lokmangal Projects', '/lokmangal/foundation#projects'),
    ]),
    n('मीडिया', 'Media', '/media/photos', [
      n('गॅलरी', 'Gallery', '/media/photos'),
      n('ब्लॉग', 'Blogs', '/blog'),
      n('व्हिजन', 'Vision', '/vision'),
    ]),
    n('संपर्क', 'Connect', '/contact', [
      n('संपर्क', 'Contact', '/contact'),
    ]),
  ],
})

const lk = (mr: string, en: string, url: string) => ({ label: L(mr, en), url })

export const footer = () => ({
  columns: [
    { title: L('महत्त्वाचे दुवे', 'Quick links'), links: [lk('मुख्य पृष्ठ', 'Home', '/'), lk('कार्यक्रम', 'Events', '/events'), lk('न्यू इंडिया मॅनिफेस्टो', 'New India Manifesto', '/vision'), lk('आवाहन', 'Appeal', '/appeal'), lk('ब्लॉग', 'Blog', '/blog')] },
    { title: L('परिचय', 'About'), links: [lk('कौटुंबिक पार्श्वभूमी', 'Family Background', '/about/biography'), lk('परिवार', 'Family', '/about/family'), lk('राजकीय कारकीर्द', 'Political Career', '/political-career'), lk('फोटो संग्रह', 'Photo Gallery', '/media/photos'), lk('संपर्क', 'Contact', '/contact')] },
    { title: L('सामाजिक उपक्रम', 'Social initiatives'), links: [lk('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation', '/lokmangal/foundation'), lk('अन्नपूर्णा योजना', 'Annapurna Yojana', '/social-work/annapurna-yojana'), lk('लोटस', 'LOTUS', '/social-work/lotus'), lk('सामुदायिक विवाह', 'Community Weddings', '/social-work/samudayik-vivah'), lk('जलसंधारण', 'Water Conservation', '/social-work/jalsandharan'), lk('सर्व उपक्रम', 'All initiatives', '/social-work')] },
  ],
  legalLinks: [lk('गोपनीयता धोरण', 'Privacy Policy', '/privacy-policy'), lk('अटी व शर्ती', 'Terms & Conditions', '/terms'), lk('अस्वीकरण', 'Disclaimer', '/disclaimer')],
  copyright: L('© २०२६. सर्व हक्क राखीव — रोहन देशमुख', '© 2026. All Rights Reserved by Rohan Deshmukh'),
})

/** Homepage परिचय text (client document "New Content RD Web", Oct 2026) — also opens the स्वपरिचय page */
export const HOME_INTRO = {
  mr: 'रोहन सुभाष देशमुख हे सोलापूरचे उद्योजक, लेखक आणि सामाजिक कार्यकर्ते आहेत. स्वामी विवेकानंदांच्या विचारांनी प्रेरित होऊन, आत्मविश्वासू आणि स्वावलंबी तरुणच सशक्त राष्ट्र घडवतात, असा त्यांचा विश्वास आहे. तरुणाई, उद्योजकता आणि स्वावलंबन हे त्यांच्या प्रत्येक कामाच्या केंद्रस्थानी आहेत. त्यांच्यासाठी सामाजिक काम म्हणजे तात्पुरते उपाय नव्हेत; तर लोकांचे ऐकणे, त्यांच्या समस्या समजून घेणे आणि मूळ कारणावर काम करणे होय.',
  en: 'Rohan Subhash Deshmukh is an entrepreneur, author and social worker from Solapur. Inspired by the thoughts of Swami Vivekananda, he believes a strong nation is built by confident, self-reliant young people. Youth, enterprise and self-reliance are at the centre of everything he does. For him, social work is not about quick fixes. It is about listening to people, understanding their problems and working on the root cause.',
}
export const HOME_TAGLINE = { mr: 'सोलापूरचा नवा आवाज. नव्या भारतासाठी नवा आवाज.', en: 'A new voice from Solapur. A new voice for a new India.' }

export const FAMILY = [
  {
    img: '/images/about/family-suresh-deshmukh.webp', relation: L('आजोबा', 'Grandfather'), name: L('कै. सुरेश्चंद्र केशवराव देशमुख', 'Late Sureshchandra Keshavrao Deshmukh'),
    text: L(
      'आजोबा व्यवसायाने शिक्षक होते आणि निवृत्तीनंतर त्यांनी आपले जीवन अध्यात्माला वाहून घेतले. पंढरपूरची वारी करणे, नामस्मरण करणे, भजन-कीर्तनात सहभागी होणे हा त्यांच्या दैनंदिन जीवनाचा भाग होता. शिक्षक असल्यामुळे मुलांमध्ये चांगले संस्कार आणि योग्य मूल्ये रुजवण्याला त्यांनी नेहमी महत्त्व दिले.\n\nनिवृत्तीनंतर त्यांनी आपला बराच वेळ अध्यात्माचा प्रसार आणि समाजातील विद्यार्थ्यांसाठी काम करण्यासाठी देण्यास सुरुवात केली. येडशी, जि. उस्मानाबाद येथे त्यांनी गुरुकुल सुरू केले. या गुरुकुलाच्या माध्यमातून विद्यार्थ्यांना शिक्षणासोबत चांगले संस्कार आणि जीवनमूल्ये देण्याचे काम त्यांनी केले. विद्यार्थ्यांचे भविष्य घडवण्याचे हे काम त्यांनी मनापासून केले.\n\nआजोबांच्या निधनानंतरही हे गुरुकुल त्याच विचाराने आणि प्रामाणिकपणे सुरू आहे. विद्यार्थ्यांना चांगले शिक्षण, संस्कार आणि योग्य दिशा देण्याचे काम आजही येथे केले जाते.',
      'My grandfather was a teacher by profession and, after retirement, devoted his life to spirituality — the Pandharpur wari, naamsmaran and bhajan-kirtan were part of his daily life. As a teacher he always stressed instilling good values in children.\n\nAfter retirement he founded a gurukul at Yedshi, Osmanabad district, giving students education along with values and life skills.\n\nEven after his passing, the gurukul continues in the same spirit, guiding students with education, values and direction.',
    ),
  },
  {
    img: '/images/about/family-subhash-deshmukh.webp', relation: L('वडिल', 'Father'), name: L('सुभाष सुरेश्चंद्र देशमुख', 'Subhash Sureshchandra Deshmukh'),
    text: L(
      'माझे वडील सुभाष देशमुख उर्फ बापूसाहेब हे लोकमंगल समूहाचे संस्थापक अध्यक्ष आहेत. त्यांनी व्यवसायाच्या माध्यमातून अनेक लोकांना रोजगाराच्या संधी उपलब्ध करून दिल्या. लोकमंगल सहकारी बँक, लोकमंगल साखर कारखाना, प्रिंटिंग व्यवसाय, कुक्कुटपालन, शॉपिंग सेंटर, मसाले उद्योग तसेच शेतीशी संबंधित अनेक व्यवसाय लोकमंगल समूहाच्या माध्यमातून सुरू झाले.\n\nया विविध व्यवसायांमुळे हजारो लोकांना रोजगार मिळाला. शेतकरी, कामगार, छोटे व्यावसायिक आणि ग्रामीण भागातील अनेक लोकांना या व्यवसायांचा फायदा झाला.\n\nव्यवसायासोबतच माझ्या वडिलांनी सामाजिक आणि सार्वजनिक जीवनातही काम केले. विधानसभा आणि लोकसभेचे लोकप्रतिनिधी म्हणून काम करताना त्यांनी शेतकरी, कष्टकरी, शेतमजूर, बेरोजगार तरुण, महिला आणि समाजातील इतर घटकांच्या प्रश्नांवर काम केले. व्यवसाय, समाजसेवा आणि सार्वजनिक जीवन या तिन्ही क्षेत्रांत काम करत त्यांनी लोकमंगल समूहाचा विस्तार केला.',
      'My father, Subhash Deshmukh alias Bapusaheb, is the founder-chairman of the Lokmangal Group. Through enterprise he created jobs for many — a cooperative bank, a sugar factory, printing, poultry, a shopping centre, spices and many agriculture-linked businesses.\n\nThese ventures gave employment to thousands — farmers, workers, small traders and rural families.\n\nAlongside business he served in public life as a representative in the Legislative Assembly and the Lok Sabha, working on the issues of farmers, labourers, unemployed youth and women.',
    ),
  },
  {
    img: '/images/about/family-manish-deshmukh.webp', relation: L('भाऊ', 'Brother'), name: L('मनीष देशमुख', 'Manish Deshmukh'),
    text: L(
      'माझे लहान भाऊ, लोकमंगल पतसंस्थेचे अध्यक्ष मनीष देशमुख हे लोकमंगल बायोटेकचे चेअरमन तसेच लोकमंगल फाऊंडेशनचे उपाध्यक्ष आहेत. याव्यतिरिक्त, ते सोलापूर कृषी उत्पन्न बाजार समितीचे संचालक असून लोकमंगल प्रिंट एन पॅकच्या दोन युनिट्सच्या उद्योगांची जबाबदारीदेखील त्यांच्यावर आहे.',
      'My younger brother Manish Deshmukh, president of Lokmangal Patsanstha, is chairman of Lokmangal Biotech and vice-president of Lokmangal Foundation. He is also a director of the Solapur APMC and oversees two units of Lokmangal Print n Pack.',
    ),
  },
]

export const home = (p: Payload) => {
  const g = (s: string) => image(p, `/images/gallery/${s}.webp`)
  return {
    sections: [
      {
        blockType: 'heroSlider', autoplaySeconds: 5,
        slides: [
          { image: image(p, '/images/gallery/prachar-sabha-03.webp', 'रोहन सुभाष देशमुख'), kicker: L('अध्यक्ष, लोकमंगल फाऊंडेशन', 'Chairman, Lokmangal Foundation'), heading: L('मी रोहन सुभाष देशमुख', 'I am Rohan Subhash Deshmukh'), subheading: L('सोलापूरच्या मातीने घडवलेलं व्यक्तिमत्त्व, संस्कारांनी दिलेली दिशा आणि समाजासाठीची बांधिलकी.', 'Shaped by the soil of Solapur, guided by values, committed to society.'), buttons: [{ label: L('अधिक वाचा', 'Read more'), url: '/about/biography' }, { label: L('संपर्क साधा', 'Get in touch'), url: '/contact' }] },
          { image: image(p, '/images/home/hero-01.webp', 'समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो'), kicker: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'), heading: L('समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो', 'Even a small effort to change society is a big one'), subheading: L('लोकमंगल फाऊंडेशनच्या माध्यमातून ग्रामीण समाजाच्या उन्नतीसाठी काम.', 'Working for rural upliftment through Lokmangal Foundation.'), buttons: [{ label: L('सामाजिक कार्य', 'Social work'), url: '/social-work' }] },
          { image: image(p, '/images/home/hero-02.webp', 'संयम, सातत्य आणि परिश्रम'), kicker: L('शिक्षण · आरोग्य · पाणी · रोजगार', 'Education · Health · Water · Jobs'), heading: L('संयम, सातत्य आणि परिश्रम', 'Patience, consistency and hard work'), subheading: L('शिक्षण, आरोग्य, पाणी आणि रोजगार — प्रत्येक घटकापर्यंत पोहोचणारे काम.', 'Education, health, water and jobs — work that reaches everyone.'), buttons: [{ label: L('राजकीय कारकीर्द', 'Political career'), url: '/political-career' }] },
          { image: image(p, '/images/home/hero-03.webp', 'उत्तम शासकाचा जन्म हा तळागाळातल्या जनतेच्या समस्या आणि गरजा जाणून होतो'), kicker: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'), heading: L('उत्तम शासकाचा जन्म हा तळागाळातल्या जनतेच्या समस्या आणि गरजा जाणून होतो', 'A good leader is born by understanding the needs of people at the grassroots'), buttons: [{ label: L('व्हिजन', 'Vision'), url: '/vision' }] },
        ],
        badge: [{ value: '३,२२१+', label: L('विवाहित जोडपी', 'Couples married') }],
      },
      {
        blockType: 'aboutIntro', eyebrow: L('परिचय', 'About'), heading: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'),
        image: image(p, PORTRAITS.about, 'रोहन सुभाष देशमुख'),
        text: L(HOME_INTRO.mr, HOME_INTRO.en),
        pledge: L(HOME_TAGLINE.mr, HOME_TAGLINE.en),
        stats: [],
        buttonLabel: L('अधिक वाचा', 'Read more'), buttonUrl: '/about/introduction',
      },
      {
        blockType: 'biography', eyebrow: L('कौटुंबिक पार्श्वभूमी', 'Family Background'), heading: L('श्री. रोहन सुभाष देशमुख यांची कौटुंबिक पार्श्वभूमी', 'Family background of Shri. Rohan Subhash Deshmukh'),
        intro: L('उत्तम शासकाचा जन्म हा तळागाळातल्या जनतेच्या समस्या आणि गरजा जाणून होतो.', 'A good leader is born by understanding the problems and needs of people at the grassroots.'),
        image: image(p, PORTRAITS.family, 'रोहन सुभाष देशमुख'),
        items: [
          { title: L('कौटुंबिक पार्श्वभूमी', 'Family background'), text: L('सोलापूर, मराठवाड्यासह संपूर्ण महाराष्ट्राला परिचित असलेल्या परिवारात रोहन यांचा जन्म. या परिवाराला अध्यात्माचा गंध लाभला.', 'Born into a family known across Solapur, Marathwada and Maharashtra, rooted in spirituality.'), url: '/about/biography' },
          { title: L('सामाजिक उपक्रम', 'Social initiatives'), text: L('लोकमंगल मल्टीस्टेटच्या माध्यमातून आतापर्यंत उद्योजकांना पाच कोटी रुपयांचे अर्थसहाय्य.', 'Rs 5 crore in financial support to entrepreneurs through Lokmangal Multistate.'), url: '/social-work' },
          { title: L('सामाजिक कारकीर्द', 'Social career'), text: L('लोकमंगल फाउंडेशन या संस्थेच्या माध्यमातून विविध सामाजिक उपक्रम राबविले जातात.', 'Many social initiatives run through Lokmangal Foundation.'), url: '/lokmangal/foundation' },
        ],
      },
      {
        blockType: 'workHighlights', eyebrow: L('विकास कार्य', 'Work'), heading: L('समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो', 'Even a small effort to change society is a big one'),
        items: [
          { image: image(p, '/images/home/work-yuva-morcha.webp', 'भारतीय जनता युवा मोर्चा'), title: L('भारतीय जनता युवा मोर्चा', 'Bharatiya Janata Yuva Morcha'), text: L('भारतीय जनता युवा मोर्चाचे सरचिटणीस म्हणून उल्लेखनीय काम. संपूर्ण महाराष्ट्रात प्रवास, विविध सामाजिक समस्यांसाठी राजकीय पातळीवर आंदोलने.', 'Notable work as General Secretary of BJYM — travelling across Maharashtra and leading agitations on social issues.'), url: '/political-career' },
          { image: image(p, '/images/home/work-vivekanand-yatra.webp', 'स्वामी विवेकानंद विचार यात्रा'), title: L('स्वामी विवेकानंद विचार यात्रा', 'Swami Vivekananda Vichar Yatra'), text: L('तुळजापूर - उमरगा - लोहारा - वाशी - भूम - परांडा - बार्शी - उस्मानाबाद', 'Tuljapur – Umarga – Lohara – Washi – Bhoom – Paranda – Barshi – Osmanabad'), url: '/political-career' },
          { image: image(p, '/images/vision/book.webp', 'न्यू इंडिया मॅनिफेस्टो'), title: L('न्यू इंडिया मॅनिफेस्टो', 'The New India Manifesto'), text: L('‘न्यू इंडिया मॅनिफेस्टो’ हे पुस्तक मी लिहिलं आहे.', 'I have written the book ‘The New India Manifesto’.'), url: '/vision' },
        ],
      },
      {
        blockType: 'initiativesShowcase', eyebrow: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'), heading: L('लोकमंगल फाऊंडेशनचे उपक्रम', 'Lokmangal Foundation initiatives'),
        intro: L('लोकमंगल फाऊंडेशन ग्रामीण समाजाच्या उन्नतीसाठी काम करते. आम्ही त्यांचे जीवन सुधारण्याचा प्रयत्न करतो.', 'Lokmangal Foundation works for the upliftment of rural communities and to improve their lives.'),
      },
      {
        blockType: 'featuredVideo', eyebrow: L('व्हिडिओ', 'Video'), heading: L('लोकमंगल अन्नपूर्णा योजना — एक डबा, माणुसकीचा हात', 'Annapurna Yojana — a tiffin carried with care'),
        youtubeUrl: 'https://www.youtube.com/watch?v=xqe6JKzo11I',
        text: L('दररोज ५०० ते ५५० निराधार ज्येष्ठ नागरिकांपर्यंत दोन वेळचं जेवण.', 'Two meals a day for 500–550 destitute senior citizens, every day.'),
        links: [
          { label: L('व्हिडिओ संग्रह', 'Video Gallery'), description: L('सर्व व्हिडिओ पहा', 'Watch all videos'), url: '/media/videos' },
          { label: L('YouTube चॅनेल', 'YouTube channel'), description: L('@rd.connects', '@rd.connects'), url: 'https://youtube.com/@rd.connects', newTab: true },
          { label: L('ब्लॉग', 'Blog'), description: L('रोहन देशमुख यांचे लेख', 'Articles by Rohan Deshmukh'), url: '/blog' },
        ],
      },
      { blockType: 'family', eyebrow: L('परिवार', 'Family'), heading: L('कौटुंबिक पार्श्वभूमी', 'Family background'), members: FAMILY.map((f) => ({ image: image(p, f.img, ''), relation: f.relation, name: f.name, text: f.text })) },
      {
        blockType: 'homeGallery', eyebrow: L('लोकमंगल परिवार', 'Lokmangal family'), heading: L('फोटो संग्रह', 'Photo Gallery'),
        images: ['tuljapur-sabha-01', 'samudayik-vivah-13', 'prachar-sabha-02', 'annapurna-03', 'cm-chashak-04', 'lotus-05', 'shikshanratna-puraskar-02', 'rakshabandhan-02', 'jalsandharan-02', 'bakshis-samarambh-01', 'samudayik-vivah-16', 'prachar-sabha-06', 'tuljapur-sabha-05', 'cm-chashak-09'].map(g),
      },
      {
        blockType: 'homeStats', eyebrow: L('न्यू इंडिया मॅनिफेस्टो', 'New India Manifesto'), heading: L('प्रत्यक्ष कामाचे परिणाम', 'Results on the ground'), image: g('cm-chashak-03'),
        items: [{ value: '१,००,०००', label: L('घडवायचे उद्योजक (लक्ष्य) — ग्रामीण भारतातून', 'Entrepreneurs to build (target) — from rural India') }, { value: '३,०००+', label: L('सामुदायिक विवाह आयोजित', 'Community weddings organised') }, { value: '४', label: L('प्रत्यक्ष चालवलेल्या संस्था', 'Institutions led') }],
        buttonLabel: L('व्हिजन', 'Vision'), buttonUrl: '/vision',
      },
      { blockType: 'latestBlog', eyebrow: L('लेखक: रोहन देशमुख', 'By Rohan Deshmukh'), heading: L('ब्लॉग', 'Blog'), limit: 3 },
      {
        blockType: 'socialFeeds', eyebrow: L('सोशल मीडिया', 'Social media'), heading: L('इंस्टाग्रामवरील ताज्या पोस्ट', 'Latest on Instagram'),
        text: L('@rohan1942 • अधिकृत इंस्टाग्राम पेज · @rohandeshmukh.official • अधिकृत फेसबुक पेज', '@rohan1942 • Official Instagram · @rohandeshmukh.official • Official Facebook'),
        instagramPosts: [
          { url: 'https://www.instagram.com/rohan1942/p/CtotJz7ItWS/', title: L('Happy Father\'s Day विशेष पोस्ट', 'Happy Father\'s Day') },
          { url: 'https://www.instagram.com/rohan1942/p/DdY210PvXEg/', title: L('मा. श्री. प्रतापराव जाधव साहेबांची सदिच्छा भेट', 'Courtesy visit with Shri Prataprao Jadhav') },
          { url: 'https://www.instagram.com/rohan1942/reel/DdEk-nVvP7k/', title: L('लोकमंगल परिवार व्यवसायवृद्धी मेळावा', 'Lokmangal business growth meet') },
          { url: 'https://www.instagram.com/rohan1942/p/Dc76No_sC9D/', title: L('सूर्यकुमार यादव यांच्यासोबत भेट', 'Meeting Suryakumar Yadav') },
          { url: 'https://www.instagram.com/rohan1942/reel/DcoDuGQs7fB/', title: L('व्यवसाय वृद्धीसाठी नवा उपक्रम', 'A new initiative for business growth') },
        ],
        showFacebook: true, showYoutube: true,
      },
    ],
  }
}
