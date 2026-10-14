import type { Payload } from 'payload'
import { L } from './l10n'
import { image, md, PORTRAITS } from './helpers'
import { HOME_INTRO } from './content-globals'

const gi = (p: Payload, n: string, alt = '') => image(p, `/images/gallery/${n}.webp`, alt)
const rt = (p: Payload, mr: string, en?: string) => L(md(p, mr), en ? md(p, en) : undefined)
const btn = (mr: string, en: string, url: string, newTab = false) => ({ label: L(mr, en), url, newTab })
const appealCta = (p: Payload) => ({
  blockType: 'cta', heading: L('चांगल्या महाराष्ट्राच्या उभारणीसाठी आम्हाला साथ द्या', 'Join us in building a better Maharashtra'),
  image: gi(p, 'tuljapur-sabha-02', 'जनतेशी संवाद साधताना रोहन देशमुख'),
  buttons: [btn('संपर्क साधा', 'Get in touch', '/contact'), btn('आवाहन', 'Appeal', '/appeal')],
})

/** स्वपरिचय — first page of the परिचय menu (facts taken from the biography, homepage and political-career content) */
/*
 * About / Lokmangal pages — content from the client document "New Content RD Web" (Oct 2026).
 * English = the document text; Marathi = translation of it.
 */

/** स्वपरिचय (Biography in the document): personal details, education, social work, vision */
export const introPage = (p: Payload) => ({
  path: '/about/introduction', section: 'about', menuOrder: 0,
  title: L('स्वपरिचय', 'Introduction'),
  subtitle: L('सोलापूरचा नवा आवाज. नव्या भारतासाठी नवा आवाज.', 'A new voice from Solapur. A new voice for a new India.'),
  layout: [
    {
      blockType: 'mediaText', eyebrow: L('स्वपरिचय', 'Biography'), heading: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh'),
      image: image(p, PORTRAITS.introduction, 'रोहन सुभाष देशमुख'), imagePosition: 'left',
      body: rt(p,
        '*सोलापूरचा नवा आवाज. नव्या भारतासाठी नवा आवाज.*\n\n' + HOME_INTRO.mr,
        '*A new voice from Solapur. A new voice for a new India.*\n\n' + HOME_INTRO.en),
    },
    {
      blockType: 'cards', eyebrow: L('स्वपरिचय', 'Biography'), heading: L('वैयक्तिक माहिती', 'Personal Details'), columns: '2',
      items: [
        { icon: '०१', title: L('जन्म', 'Born'), text: L('१२ डिसेंबर १९८७', '12 December 1987') },
        { icon: '०२', title: L('जन्मस्थळ', 'Birthplace'), text: L('सोलापूर, देशमुख परिवारात', 'Solapur, into the Deshmukh family') },
      ],
    },
    {
      blockType: 'cards', eyebrow: L('शिक्षण', 'Education'), heading: L('शिक्षण', 'Education'), columns: '3',
      items: [
        { icon: '०१', title: L('शाळा', 'School'), text: L('लिटल फ्लॉवर कॉन्व्हेंट स्कूल, सोलापूर', 'Little Flower Convent School, Solapur') },
        { icon: '०२', title: L('राष्ट्रीय छात्र सेना (NCC)', 'NCC'), text: L('इयत्ता नववीपासून सक्रिय कॅडेट; नवी दिल्लीतील NCC संचलनासाठी निवड आणि ‘सर्वोत्कृष्ट कॅडेट’ म्हणून गौरव', 'Active cadet from Class 9; selected for the NCC parade in New Delhi and named Best Cadet') },
        { icon: '०३', title: L('महाविद्यालय', 'College'), text: L('संगमेश्वर महाविद्यालय, सोलापूर', 'Sangameshwar College, Solapur') },
        { icon: '०४', title: L('उच्च शिक्षण', 'Higher Studies'), text: L('बारावीनंतर अमेरिकेत जाऊन रोचेस्टर इन्स्टिट्यूट ऑफ टेक्नॉलॉजी (RIT) येथून जैवतंत्रज्ञान व उद्योजकता विकास या विषयात पदवी', 'Moved to the USA after Class 12 and earned a degree in Biotechnology and Entrepreneurship Development from the Rochester Institute of Technology (RIT)') },
        { icon: '०५', title: L('भारतात पुनरागमन', 'Return to India'), text: L('आपल्या माणसांमध्ये काम करण्यासाठी २००९ मध्ये सोलापूरला परतले', 'Came back to Solapur in 2009 to work among his own people') },
      ],
    },
    {
      blockType: 'content', eyebrow: L('सामाजिक कार्य', 'Social Work'), heading: L('लोकमंगल फाऊंडेशनच्या माध्यमातून', 'Through Lokmangal Foundation'),
      body: rt(p,
        'लोकमंगल फाऊंडेशनच्या माध्यमातून रोहन आपल्या कल्पना प्रत्यक्ष जमिनीवर उतरवतात. सोलापूर आणि धाराशिव जिल्ह्यांत फाऊंडेशन विविध सामाजिक उपक्रम राबवते — एकच साधा उद्देश ठेवून: लोकांना जेव्हा सर्वाधिक गरज असते, तेव्हा त्यांच्यासोबत उभे राहणे आणि त्यांना पुढे जाण्यास मदत करणे.',
        'Through Lokmangal Foundation, Rohan turns his ideas into action on the ground. The Foundation runs a range of social initiatives across Solapur and Dharashiv districts with one simple aim: to stand with people when they need it most and help them move forward.'),
    },
    {
      blockType: 'content', eyebrow: L('व्हिजन', 'Vision'), heading: L('न्यू इंडिया मॅनिफेस्टो', 'New India Manifesto'),
      body: rt(p,
        'रोहन हे *न्यू इंडिया मॅनिफेस्टो* या पुस्तकाचे लेखक आहेत. या पुस्तकात त्यांनी नव्या भारताविषयीचे आपले विचार मांडले आहेत. त्यातूनच प्रेरणा घेऊन संपूर्ण महाराष्ट्रात सक्षम स्टार्टअप परिसंस्था उभारण्याचे काम त्यांनी हाती घेतले आहे — जिथे कल्पना असलेल्या प्रत्येक तरुणाला, तो मोठ्या शहरातील असो वा छोट्या गावातील, योग्य मार्गदर्शन, पाठबळ आणि प्रगतीची संधी मिळेल.',
        'Rohan is the author of *New India Manifesto*, a book that sets out his ideas for a new India. Inspired by it, he has set out to build a strong startup ecosystem across Maharashtra, where young people with ideas get the right guidance, support and opportunity to grow, whether they come from a big city or a small town.'),
    },
    { blockType: 'quote', text: L('सोलापूरच्या मातीत रुजलेला आणि भविष्याकडे पाहणारा रोहन यांचा प्रवास एकाच ध्येयाने प्रेरित आहे: पुढच्या पिढीला स्वतःचे काहीतरी उभे करण्याचा आत्मविश्वास आणि संधी देणे.', 'Rooted in Solapur and focused on the future, Rohan’s journey has one clear goal: to give the next generation the confidence and the chance to build something of their own.') },
    {
      blockType: 'cards', eyebrow: L('परिचय', 'About'), heading: L('अधिक जाणून घ्या', 'Know more'), columns: '3',
      items: [
        { title: L('कौटुंबिक पार्श्वभूमी', 'Family Background'), text: L('आजोबा, वडील आणि भाऊ — देशमुख परिवाराची ओळख.', 'Grandfather, father and brother — the Deshmukh family.'), url: '/about/biography' },
        { title: L('लोकमंगल परिवार', 'Lokmangal Parivar'), text: L('बँकिंग, उद्योग, शिक्षण, आरोग्य आणि समाजसेवेतील संस्थांचा परिवार.', 'A family of institutions in banking, industry, education, healthcare and social service.'), url: '/lokmangal/parivar' },
        { title: L('राजकीय कारकीर्द', 'Political Career'), text: L('विवेकानंद विचार यात्रा, भाजयुमो आणि धाराशिव लोकसभा निवडणूक.', 'Vivekananda Vichar Yatra, BJYM and the Dharashiv Lok Sabha election.'), url: '/political-career' },
      ],
    },
  ],
})

/** Family Background — after Vision in the About section (document: "Family info after vision") */
const DOC_FAMILY = [
  {
    img: '/images/about/family-suresh-deshmukh.webp', relation: L('आजोबा', 'Grandfather'), name: L('कै. सुरेश्चंद्र केशवराव देशमुख', 'Late Sureshchandra Keshavrao Deshmukh'),
    text: L(
      'व्यवसायाने शिक्षक असलेल्या आजोबांनी निवृत्तीनंतर आपले जीवन अध्यात्माला वाहिले. पंढरपूरची वारी, नामस्मरण आणि भजन-कीर्तन हा त्यांच्या दिनचर्येचा भाग होता. शिक्षक म्हणून मुलांना चांगले संस्कार देण्यावर त्यांचा नेहमी भर होता. त्यांनी धाराशिव जिल्ह्यातील येडशी येथे गुरुकुल सुरू केले, जिथे विद्यार्थ्यांना शिक्षणासोबत जीवनमूल्यांचे धडे मिळाले. हे गुरुकुल आजही त्याच भावनेने आणि प्रामाणिकपणे सुरू आहे.',
      'A teacher by profession, he gave his life to spirituality after retirement. The Pandharpur Wari, chanting God’s name, and bhajans and kirtans were part of his daily life. As a teacher, he always believed in giving children good values. He started a gurukul at Yedshi in Dharashiv district, where students received education along with values for life. The gurukul still runs today with the same spirit and honesty.'),
  },
  {
    img: '/images/about/family-subhash-deshmukh.webp', relation: L('वडील', 'Father'), name: L('मा. श्री. सुभाष सुरेश्चंद्र देशमुख, आमदार', 'Hon. Shri Subhash Sureshchandra Deshmukh, MLA'),
    text: L(
      '‘बापूसाहेब’ या नावाने परिचित असलेले ते लोकमंगल समूहाचे संस्थापक अध्यक्ष आहेत. लोकमंगल को-ऑपरेटिव्ह बँक, लोकमंगल साखर कारखाना तसेच छपाई, कुक्कुटपालन, किरकोळ विक्री, मसाले आणि शेती या व्यवसायांच्या माध्यमातून समूहाने हजारो लोकांना रोजगार दिला आणि शेतकरी, कामगार, छोटे व्यावसायिक व ग्रामीण कुटुंबांना आधार दिला. विधानसभा आणि लोकसभेतील लोकप्रतिनिधी म्हणून त्यांनी शेतकरी, मजूर, शेतमजूर, बेरोजगार तरुण, महिला आणि समाजातील इतर घटकांसाठी काम केले आहे.',
      'Popularly known as Bapusaheb, he is the Founder President of the Lokmangal Group. Through Lokmangal Co-operative Bank, Lokmangal Sugar Factory, and businesses in printing, poultry, retail, spices and agriculture, the group has created jobs for thousands of people and supported farmers, workers, small business owners and rural families. As an elected representative in the Legislative Assembly and the Lok Sabha, he has worked for farmers, labourers, farm workers, unemployed youth, women and other sections of society.'),
  },
  {
    img: '/images/about/family-manish-deshmukh.webp', relation: L('भाऊ', 'Brother'), name: L('मनीष देशमुख', 'Manish Deshmukh'),
    text: L(
      'मनीष हे लोकमंगल पतसंस्थेचे अध्यक्ष, लोकमंगल बायोटेकचे चेअरमन आणि लोकमंगल फाऊंडेशनचे उपाध्यक्ष आहेत. ते सोलापूर कृषी उत्पन्न बाजार समितीचे (APMC) संचालक असून लोकमंगल प्रिंट एन पॅकच्या दोन युनिट्सची जबाबदारीही सांभाळतात.',
      'Manish is President of Lokmangal Patsanstha, Chairman of Lokmangal Biotech and Vice President of Lokmangal Foundation. He is also a Director of the Solapur Agricultural Produce Market Committee (APMC) and looks after two units of Lokmangal Print n Pack.'),
  },
]

export const familyPage = (p: Payload) => ({
  path: '/about/biography', section: 'about', menuOrder: 1,
  title: L('कौटुंबिक पार्श्वभूमी', 'Family Background'),
  subtitle: L('आध्यात्मिक मूल्ये आणि समाजाप्रती कर्तव्याची भावना — देशमुख परिवार.', 'Spiritual values and a deep sense of duty towards society — the Deshmukh family.'),
  bannerImage: image(p, PORTRAITS.familyPage, 'रोहन सुभाष देशमुख'),
  layout: [
    {
      blockType: 'content', eyebrow: L('परिवार', 'Family'), heading: L('कौटुंबिक पार्श्वभूमी', 'Family Background'),
      body: rt(p,
        'सोलापूर, मराठवाडा आणि संपूर्ण महाराष्ट्रात देशमुख परिवार सुपरिचित आहे. याच परिवारात रोहन यांचा जन्म झाला. आध्यात्मिक मूल्ये आणि समाजाप्रती कर्तव्याची खोल भावना — या दोन गोष्टींवर हा परिवार नेहमी जगत आला आहे. गरजूंना मदत करणे आणि समाजासाठी काहीतरी करणे, हा परिवाराच्या जीवनशैलीचा भाग राहिला आहे.\n\n' +
        'व्यवसायातही परिवाराने नेहमीच मेहनत आणि प्रामाणिकपणावर विश्वास ठेवला. कष्ट करून आणि एकमेकांना साथ देत देशमुख परिवाराने स्वतःची ओळख निर्माण केली. आजही ते एकत्र कुटुंब म्हणून राहतात आणि समाजसेवा, व्यवसाय व घराच्या जबाबदाऱ्या मिळून सांभाळतात. एकत्र कुटुंब कसे असावे, याचे उदाहरण म्हणून अनेक जण त्यांच्याकडे पाहतात.',
        'The Deshmukh family is well known across Solapur, Marathwada and all of Maharashtra. Rohan was born into this family, which has always lived by two things: spiritual values and a deep sense of duty towards society. Helping people in need and doing something for society has always been part of the family’s way of life.\n\n' +
        'In business too, the family has always believed in hard work and honesty. By working hard and standing by each other, the Deshmukhs built a name of their own. Even today, they live together as a joint family and share the work of social service, business and home. Many people look at them as an example of what a joint family should be.'),
    },
    ...DOC_FAMILY.map((f, i) => ({ blockType: 'mediaText', heading: f.name, eyebrow: f.relation, image: image(p, f.img, ''), imagePosition: i % 2 ? 'right' : 'left', body: rt(p, f.text.mr, f.text.en) })),
    appealCta(p),
  ],
})

/** लोकमंगल फाऊंडेशन — "माहिती" tab (events, projects and gallery tabs are filled from their collections) */
export const foundationPage = (p: Payload) => ({
  path: '/lokmangal/foundation', section: 'lokmangal', menuOrder: 1,
  title: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'),
  subtitle: L('आजची सेवा, उद्याची समृद्धी', 'Serving Today, Building a Prosperous Tomorrow'),
  bannerImage: image(p, '/images/foundation/foundation-intro.webp', 'लोकमंगल फाऊंडेशन'),
  layout: [
    {
      blockType: 'mediaText', eyebrow: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'), heading: L('आजची सेवा, उद्याची समृद्धी', 'Serving Today, Building a Prosperous Tomorrow'),
      image: image(p, '/images/foundation/foundation-intro.webp', 'लोकमंगल फाऊंडेशन'),
      body: rt(p,
        'लोकमंगल फाऊंडेशनचे अध्यक्ष म्हणून रोहन देशमुख फाऊंडेशनचे नेतृत्व करतात आणि नियोजनापासून प्रत्यक्ष अंमलबजावणीपर्यंत प्रत्येक उपक्रमावर लक्ष ठेवतात. मा. श्री. सुभाष (बापू) देशमुख यांनी २००५ मध्ये स्थापन केलेले हे फाऊंडेशन एका स्पष्ट विश्वासावर उभे आहे: प्रत्येक गरजू कुटुंबाला आधार मिळावा, प्रत्येक व्यक्तीला प्रगतीची संधी मिळावी आणि प्रत्येक गाव पुढे जावे.\n\n' +
        'रोहन देशमुख यांच्या नेतृत्वाखाली फाऊंडेशन आधी लोकांचे ऐकते, समाजाची खरी गरज समजून घेते आणि त्यांच्या आयुष्यात खरा, टिकाऊ बदल घडवण्यासाठी काम करते.',
        'As President of Lokmangal Foundation, Rohan Deshmukh leads the Foundation and oversees every initiative, from planning to work on the ground. Founded in 2005 by Hon. Shri Subhash (Bapu) Deshmukh, the Foundation was built on a clear belief: every family in need should find support, every person should get a chance to grow, and every village should move forward.\n\n' +
        'Under Rohan Deshmukh’s leadership, the Foundation listens to people first, understands what communities truly need, and works to bring real, lasting change to their lives.'),
    },
    {
      blockType: 'cards', eyebrow: L('कार्यक्षेत्र', 'What we do'), heading: L('कार्याची प्रमुख क्षेत्रे', 'Key Areas of Work'), columns: '3',
      items: [
        { icon: '📚', title: L('शिक्षण', 'Education'), text: L('गरजू विद्यार्थ्यांना शिक्षण सुरू ठेवण्यासाठी मदत', 'Helping students in need continue their studies'), url: '/social-work/lotus' },
        { icon: '💍', title: L('सामुदायिक विवाह', 'Community Weddings'), text: L('आधाराची गरज असलेल्या कुटुंबांसाठी विवाह सोहळ्यांचे आयोजन', 'Organising weddings for families who need support'), url: '/social-work/samudayik-vivah' },
        { icon: '💧', title: L('शेती व पाणी', 'Agriculture & Water'), text: L('जलसंधारण प्रकल्पांद्वारे शेतकऱ्यांच्या शेतीला अधिक पाणी', 'Helping farmers get more water for their fields through water conservation projects'), url: '/social-work/jalsandharan' },
        { icon: '🍲', title: L('अन्नसेवा', 'Food Service'), text: L('काळजी घेणारे कोणी नसलेल्या ज्येष्ठ नागरिकांना रोजचे जेवण', 'Providing daily meals to elderly people who have no one to care for them'), url: '/social-work/annapurna-yojana' },
        { icon: '🩺', title: L('आरोग्य व समाजकल्याण', 'Healthcare & Social Welfare'), text: L('गरजूंच्या आरोग्य व कल्याणासाठी मदत', 'Supporting the health and well-being of people in need'), url: '/social-work/maha-arogya-shibir' },
      ],
    },
    {
      blockType: 'stats', eyebrow: L('प्रभाव', 'Impact'), heading: L('आतापर्यंतचा प्रभाव', 'Impact So Far'),
      items: [
        { value: L('२३', '23'), label: L('उपक्रम', 'initiatives') },
        { value: L('हजारो', 'Thousands'), label: L('कुटुंबांपर्यंत पोहोच', 'of families reached') },
        { value: L('२', '2'), label: L('ग्रामीण जिल्ह्यांत कार्यरत — सोलापूर व धाराशिव', 'rural districts — Solapur and Dharashiv') },
        { value: L('२००५', '2005'), label: L('स्थापना', 'Founded') },
      ],
    },
    {
      blockType: 'content', heading: L('पुढचे ध्येय', 'The road ahead'),
      body: rt(p,
        'आता हे काम महाराष्ट्रातील आणि देशभरातील गावांपर्यंत पोहोचवण्याचे ध्येय आहे. लोकांच्या खऱ्या गरजांमध्ये रुजलेली सेवा आणि समृद्ध ग्रामीण जीवनाचे स्वप्न फाऊंडेशनच्या प्रवासातील प्रत्येक पावलाला दिशा देत राहील.',
        'The goal now is to take this work further, to villages across Maharashtra and the rest of India. Service rooted in people’s real needs and a vision of a prosperous rural life continue to guide every step of the Foundation’s journey.'),
    },
    appealCta(p),
  ],
})

const group = (count: [string, string], mr: string, en: string, tagMr: string, tagEn: string, items: [string, string][], columns = '2') => ({
  blockType: 'cards', eyebrow: L(count[0], count[1]), heading: L(mr, en), intro: L(tagMr, tagEn), columns,
  items: items.map(([m, e]) => ({ title: L(m, e) })),
})

export const parivarPage = (p: Payload) => ({
  path: '/lokmangal/parivar', section: 'lokmangal', menuOrder: 2,
  title: L('लोकमंगल परिवार', 'Lokmangal Parivar'),
  subtitle: L('बँकिंग, उद्योग, शिक्षण, आरोग्य आणि समाजसेवेतील संस्थांचा परिवार', 'A family of institutions in banking, industry, education, healthcare and social service'),
  bannerImage: image(p, '/images/blog/subhash-deshmukh.webp', 'मा. सुभाष (बापू) देशमुख'),
  layout: [
    {
      blockType: 'content', eyebrow: L('लोकमंगल', 'Lokmangal'), heading: L('लोकमंगल परिवार', 'Lokmangal Parivar'),
      body: rt(p,
        'मा. श्री. सुभाष देशमुख यांनी स्थापन केलेल्या लोकमंगल समूहाची सुरुवात एका साध्या विचारातून झाली: एकत्र प्रगती करायची आणि त्यासोबत समाजालाही पुढे न्यायचे. गेल्या काही वर्षांत बँकिंग, उद्योग, शिक्षण, आरोग्य आणि समाजसेवा क्षेत्रांत काम करणाऱ्या संस्थांचा हा एक मोठा परिवार बनला आहे.\n\n' +
        'आज कर्मचारी, स्वयंसेवक, शेतकरी, विद्यार्थी, सभासद आणि सहकारी असे हजारो लोक लोकमंगल परिवाराचा भाग आहेत. रोजगार निर्माण करणे, शेतकरी व ग्रामीण कुटुंबांना आधार देणे, दर्जेदार शिक्षण देणे आणि गरजेच्या वेळी लोकांसोबत उभे राहणे — हा सर्वांचा एकच उद्देश आहे.\n\n' +
        'याच वातावरणात वाढलेल्या रोहन देशमुख यांनी लोकसेवेचे मूल्य जवळून अनुभवले. आज ते लोकमंगल मल्टीस्टेटचे संचालक आणि लोकमंगल फाऊंडेशनचे अध्यक्ष म्हणून हे काम पुढे नेत आहेत; तसेच तरुणाई, उद्योजकता आणि नव्या कल्पनांवर विशेष भर देत फाऊंडेशनचे सामाजिक उपक्रम पुढे नेत आहेत.\n\n' +
        'लोकमंगल हा केवळ संस्थांचा समूह नाही. विश्वास, मेहनत आणि समाजसेवेवर उभा असलेला हा एक परिवार आहे आणि हीच भावना या नावाखालील प्रत्येक संस्थेला दिशा देते.',
        'Founded by Hon. Shri Subhash Deshmukh, the Lokmangal Group began with a simple idea: grow together and help society grow along the way. Over the years, it has become a large family of institutions working in banking, industry, education, healthcare and social service.\n\n' +
        'Today, thousands of people are part of the Lokmangal Parivar, including employees, volunteers, farmers, students, members and partners. Together, they share one purpose: to create jobs, support farmers and rural families, provide quality education and stand with people when they need it most.\n\n' +
        'Growing up in this environment, Rohan Deshmukh learned the value of public service from close quarters. Today, he carries this work forward as the Director of Lokmangal Multistate and President of the Lokmangal Foundation, while also advancing the Foundation’s social initiatives with a special focus on youth, enterprise, and new ideas.\n\n' +
        'Lokmangal is more than a group of organisations. It is a family built on trust, hard work and service to society, and this spirit guides every institution under its name.'),
    },
    group(['४ संस्था', '4 institutions'], '🏦 वित्तीय संस्था', '🏦 Financial Institutions', 'बचत, कर्ज आणि प्रगतीसाठी साथ', 'Helping people save, borrow and grow', [
      ['लोकमंगल को-ऑपरेटिव्ह बँक', 'Lokmangal Co-operative Bank'],
      ['लोकमंगल नागरी सहकारी पतसंस्था', 'Lokmangal Nagari Co-operative Credit Society'],
      ['लोकमंगल कर्मचारी सहकारी पतसंस्था', 'Lokmangal Karmachari Sahakari Patsanstha'],
      ['लोकमंगल मल्टीस्टेट', 'Lokmangal Multistate'],
    ]),
    group(['४ संस्था', '4 institutions'], '🏭 उद्योग', '🏭 Industries', 'रोजगारनिर्मिती आणि शेतमालाचे मूल्यवर्धन', 'Creating jobs and adding value to farm produce', [
      ['लोकमंगल शुगर इथेनॉल अँड को-जनरेशन इंडस्ट्रीज लि. (LSECIL)', 'Lokmangal Sugar Ethanol & Co-generation Industries Ltd (LSECIL)'],
      ['लोकमंगल माऊली इंडस्ट्रीज लि.', 'Lokmangal Mauli Industries Ltd'],
      ['लोकमंगल ॲग्रो इंडस्ट्रीज लि.', 'Lokmangal Agro Industries Ltd'],
      ['लोकमंगल बायो-टेक प्रा. लि.', 'Lokmangal Bio-Tech Pvt Ltd'],
    ]),
    group(['१० संस्था', '10 institutions'], '🎓 शिक्षण', '🎓 Education', 'शाळेपासून व्यावसायिक महाविद्यालयांपर्यंत', 'From school to professional colleges', [
      ['लोकमंगल इंग्लिश मीडियम स्कूल अँड ज्युनियर कॉलेज', 'Lokmangal English Medium School & Junior College'],
      ['लोकमंगल आयटीआय', 'Lokmangal ITI'],
      ['लोकमंगल कृषी तंत्रनिकेतन', 'Lokmangal Agricultural Polytechnic'],
      ['लोकमंगल कृषी महाविद्यालय, वडाळा', 'Lokmangal College of Agriculture, Wadala'],
      ['लोकमंगल कृषी जैवतंत्रज्ञान महाविद्यालय, वडाळा', 'Lokmangal College of Agricultural Biotechnology, Wadala'],
      ['लोकमंगल जैवतंत्रज्ञान महाविद्यालय', 'Lokmangal College of Biotechnology'],
      ['लोकमंगल कृषी व्यवसाय व्यवस्थापन महाविद्यालय (ABM)', 'Lokmangal College of Agri-Business Management (ABM)'],
      ['लोकमंगल उद्योजकता महाविद्यालय', 'Lokmangal College of Entrepreneurship'],
      ['लोकमंगल फार्मसी महाविद्यालय (B.Pharm), वडाळा', 'Lokmangal College of Pharmacy (B.Pharm), Wadala'],
      ['लोकमंगल पशुवैद्यकीय महाविद्यालय', 'Lokmangal Veterinary College'],
    ], '3'),
    group(['५ संस्था', '5 institutions'], '🤝 फाऊंडेशन, संशोधन व समाजकार्य', '🤝 Foundations, Research & Social Work', 'आरोग्य, ग्रामीण विकास आणि गरजूंसाठी कार्य', 'Working for health, rural development and people in need', [
      ['लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'],
      ['लोकमंगल डेव्हलपमेंट फाऊंडेशन (LDF)', 'Lokmangal Development Foundation (LDF)'],
      ['लोकमंगल मेडिकल फाऊंडेशन अँड रिसर्च सेंटर', 'Lokmangal Medical Foundation & Research Centre'],
      ['श्रीराम ग्रामीण संशोधन व विकास प्रतिष्ठान, वडाळा', 'Shriram Gramin Sanshodhan va Vikas Pratishthan, Wadala'],
      ['सोलापूर सोशल फाऊंडेशन / स्वामींचे घर', 'Solapur Social Foundation / Swaminche Ghar'],
    ], '3'),
    group(['१ संस्था', '1 institution'], '📰 माध्यमे', '📰 Media', 'प्रदेशातील बातम्या आणि गोष्टी लोकांपर्यंत', 'Sharing news and stories from across the region', [
      ['लोकमंगल वृत्तांत', 'Lokmangal Vruttant'],
    ]),
    appealCta(p),
  ],
})

export const politicalPage = (p: Payload) => ({
  path: '/political-career', section: 'political', menuOrder: 1, showSideMenu: false,
  title: L('राजकीय कारकीर्द', 'Political Career'), subtitle: L('राजकीय प्रवास — रोहन देशमुख', 'Political Journey — Rohan Deshmukh'),
  bannerImage: image(p, '/images/political/yuva-morcha.webp', 'भारतीय जनता युवा मोर्चा'),
  layout: [
    {
      blockType: 'mediaText', eyebrow: L('राजकीय प्रवास', 'Political Journey'), heading: L('स्वामी विवेकानंद विचार यात्रा', 'Swami Vivekananda Vichar Yatra'),
      image: image(p, '/images/home/work-vivekanand-yatra.webp', 'स्वामी विवेकानंद विचार यात्रा'), imagePosition: 'left',
      body: rt(p,
        'विवेकानंद विचार यात्रा ही रोहन देशमुख यांची संकल्पना होती आणि ती उस्मानाबाद (आताचा धाराशिव) जिल्ह्यात आयोजित करण्यात आली. ही यात्रा जिल्ह्यातील गावांगावांतून आणि शहरांतून फिरली आणि स्वामी विवेकानंदांचे विचार तरुणांपर्यंत पोहोचवले. स्वामी विवेकानंदांच्या विचारांतून तरुणांना प्रेरणा देणे आणि त्यांना आपल्या आयुष्यात सकारात्मक बदल घडवण्यासाठी प्रोत्साहित करणे, हा तिचा साधा उद्देश होता. संपूर्ण यात्रा सुरुवातीपासून शेवटपर्यंत काटेकोर नियोजन आणि शिस्तीने पार पडली.',
        'The Vivekananda Vichar Yatra was Rohan Deshmukh’s idea, organised across Osmanabad (now Dharashiv) district. The yatra travelled through towns and villages across the district, taking the thoughts of Swami Vivekananda to young people. Its aim was simple: to inspire youth through Swami Vivekananda’s ideas and encourage them to bring positive change into their own lives. The entire yatra was carried out with careful planning and discipline from start to finish.'),
    },
    {
      blockType: 'mediaText', eyebrow: L('राजकीय प्रवास', 'Political Journey'), heading: L('भारतीय जनता युवा मोर्चा', 'Bharatiya Janata Yuva Morcha'),
      image: image(p, '/images/political/yuva-morcha.webp', 'भारतीय जनता युवा मोर्चा'), imagePosition: 'right',
      body: rt(p,
        'भारतीय जनता युवा मोर्चाचे सरचिटणीस म्हणून रोहन देशमुख यांनी तरुणांशी संवाद साधण्यासाठी आणि त्यांच्यात राजकीय जागृती निर्माण करण्यासाठी संपूर्ण महाराष्ट्रात प्रवास केला. सर्वसामान्य नागरिकांवर परिणाम करणाऱ्या सामाजिक प्रश्नांवर त्यांनी आंदोलनांचे नेतृत्वही केले.\n\n' +
        '२००९ मध्ये मा. श्री. सुभाष देशमुख यांच्या माढा लोकसभा प्रचारात त्यांनी सक्रिय भूमिका बजावली. उस्मानाबाद लोकसभा मतदारसंघात तळागाळापर्यंत पक्षसंघटना मजबूत करण्याचे कामही त्यांनी केले.',
        'As General Secretary of the Bharatiya Janata Yuva Morcha, Rohan Deshmukh travelled across Maharashtra to connect with young people and build political awareness among them. He also led movements on social issues that affect common citizens.\n\n' +
        'In 2009, he played an active role in the Madha Lok Sabha campaign of Hon. Shri Subhash Deshmukh. He also worked on strengthening the party organisation in the Osmanabad Lok Sabha constituency at the ground level.'),
    },
    {
      blockType: 'content', eyebrow: L('निवडणूक', 'Election'), heading: L('लोकसभा निवडणूक, धाराशिव (उस्मानाबाद)', 'Lok Sabha Election, Dharashiv (Osmanabad)'),
      body: rt(p,
        'रोहन देशमुख यांनी धाराशिव (उस्मानाबाद) लोकसभा निवडणूक अपक्ष उमेदवार म्हणून लढवली. कोणत्याही पक्षाच्या पाठबळाशिवाय त्यांनी आपले विचार थेट लोकांपर्यंत नेले आणि मतदारसंघाच्या कानाकोपऱ्यातील मतदारांपर्यंत ते पोहोचले. या प्रचारामुळे धाराशिवमधील लोकांशी त्यांचे घट्ट, वैयक्तिक नाते निर्माण झाले आणि तेच नाते आजही त्यांच्या कामाला दिशा देते.',
        'Rohan Deshmukh contested the Dharashiv (Osmanabad) Lok Sabha election as an Independent candidate. Without the backing of any party, he took his ideas directly to the people and reached voters in every corner of the constituency. The campaign helped him build a strong, personal connection with people across Dharashiv, and that bond continues to guide his work today.'),
    },
    { blockType: 'gallery', heading: L('क्षणचित्रे', 'Moments'), images: [...Array.from({ length: 6 }, (_, i) => gi(p, `prachar-sabha-0${i + 1}`)), ...Array.from({ length: 9 }, (_, i) => gi(p, `tuljapur-sabha-0${i + 1}`))] },
    appealCta(p),
  ],
})

export const pages = (p: Payload) => [
  introPage(p),
  familyPage(p),
  foundationPage(p),
  parivarPage(p),
  politicalPage(p),
  {
    path: '/vision', section: 'vision', menuOrder: 1, showSideMenu: false,
    title: L('विचार करा. संकल्प करा. कृती करा.', 'Think. Resolve. Act.'),
    subtitle: L('स्वावलंबी भारतासाठीचा जाहीरनामा — ग्रामीण भारताच्या सामर्थ्याला बळ देत नवभारत घडवण्याचा ध्यास; प्रामाणिकपणा, उद्यमशीलता आणि एक लाख नव्या उद्योजकांना घडवण्याचे ध्येय.', 'A manifesto for a self-reliant India — building New India by empowering rural India; honesty, enterprise and a goal of one lakh new entrepreneurs.'),
    bannerImage: image(p, '/images/vision/rohan-portrait.webp', 'रोहन सुभाष देशमुख'),
    layout: [
      {
        blockType: 'cards', columns: '3', items: [
          { icon: '०१', title: L('वाचा', 'Read'), text: L('जाहीरनामा समजून घ्या', 'Understand the manifesto') },
          { icon: '०२', title: L('संकल्प करा', 'Pledge'), text: L('चळवळीत सहभागी व्हा', 'Join the movement') },
          { icon: '०३', title: L('कृती करा', 'Act'), text: L('बदल घडवण्यास सुरुवात करा', 'Start making change') },
        ]
      },
      {
        blockType: 'mediaText', eyebrow: L('पुस्तक', 'Book'), heading: L('द न्यू इंडिया मॅनिफेस्टो', 'The New India Manifesto'), image: image(p, '/images/vision/book.webp', 'The New India Manifesto — Going Beyond Possible, Rohan Deshmukh'),
        body: rt(p, '**गोइंग बियॉन्ड पॉसिबल — रोहन देशमुख**\n\nहे आत्मचरित्र नाही, यशाची कथा नाही — हा एक जाहीरनामा आहे. सोलापूरमधून लिहिलेला हा जाहीरनामा वडील सुभाष देशमुख यांचे स्वप्न घेऊन चालतो — भारताच्या युवकांमधून एक लाख उद्योजक घडवण्याचे ध्येय. आर्थिक स्वावलंबन, उद्यमशीलता आणि सामाजिक बांधिलकी यांचा संगम.',
          '**Going Beyond Possible — Rohan Deshmukh**\n\nThis is not a memoir or a success story — it is a manifesto. Written from Solapur, it carries forward the dream of my father Subhash Deshmukh: building one lakh entrepreneurs from India’s youth. A blend of financial self-reliance, enterprise and social commitment.'),
        buttons: [btn('पुस्तक मागवा', 'Order the book', 'https://newindiamanifesto.com/book', true), btn('तुमचा स्टार्टअप नोंदवा', 'Register your startup', 'https://newindiamanifesto.com/apply/founder', true)],
      },
      { blockType: 'stats', eyebrow: L('परिणाम', 'Impact'), heading: L('प्रत्यक्ष कामाचे परिणाम', 'Results on the ground'), items: [{ value: '३,०००+', label: L('सामुदायिक विवाह आयोजित', 'Community weddings') }, { value: '१,००,०००', label: L('घडवायचे उद्योजक (लक्ष्य)', 'Entrepreneurs (target)') }, { value: '४', label: L('प्रत्यक्ष चालवलेल्या संस्था', 'Institutions led') }] },
      {
        blockType: 'cta', eyebrow: L('आमंत्रण', 'Invitation'), heading: L('तुमच्या गावात किंवा शहरात काहीतरी नवीन सुरू करत आहात का?', 'Starting something new in your village or city?'),
        text: L('तुमची कल्पना फक्त एका मिनिटात शेअर करा. आम्ही उद्योजकांना मार्गदर्शक आणि गुंतवणूकदारांशी जोडतो — पारदर्शक, निकषाधारित आणि परिणामकारक पद्धतीने.\n\n✓ शेती, दुग्धव्यवसाय, हस्तकला, दुकान किंवा तंत्रज्ञानाशी संबंधित व्यवसायाची कल्पना आहे.\n✓ तुमच्या परिसरातील एखादी खरी समस्या सोडवण्याची इच्छा आहे.\n✓ व्यवसाय सुरू करण्याची तयारी आहे आणि मार्गदर्शन व आर्थिक मदतीची गरज आहे.', 'Share your idea in a minute. We connect entrepreneurs with mentors and investors — transparently and effectively.'),
        image: gi(p, 'cm-chashak-03'), buttons: [btn('अर्ज करा — आत्ताच', 'Apply now', 'https://newindiamanifesto.com/apply/founder', true)],
      },
      { blockType: 'quote', text: L('नवभारत हा केवळ हॅशटॅग नाही. तो केवळ नारा नाही. तो उद्याच्या भारताचा पाया आहे — नव्या विचारांचा, नव्या दृष्टिकोनाचा आणि ग्रामीण भारतातून घडणाऱ्या नव्या बदलाचा.', 'New India is not a hashtag. It is not a slogan. It is the foundation of tomorrow’s India — of new ideas, new outlook, and new change rising from rural India.'), author: L('रोहन सुभाष देशमुख', 'Rohan Subhash Deshmukh') },
      {
        blockType: 'cards', eyebrow: L('हे कसं काम करतं?', 'How it works'), heading: L('वाचा → संकल्प करा → कृती करा', 'Read → Pledge → Act'), columns: '3',
        items: [
          { icon: '०१', title: L('विचार जाणून घ्या', 'Know the idea'), text: L('नवभारताची दिशा आणि स्वावलंबी भारताच्या उद्योजकतेमागचा विचार समजून घ्या.'), url: 'https://newindiamanifesto.com/book' },
          { icon: '०२', title: L('संकल्पात सहभागी व्हा', 'Take the pledge'), text: L('"होय, मी तयार आहे." नवभारताच्या विचाराशी स्वतःला जोडा — फक्त एका मिनिटात.'), url: 'https://newindiamanifesto.com/pledge' },
          { icon: '०३', title: L('संकल्पाला कृतीची जोड द्या', 'Act on it'), text: L('तुमचा व्यवसाय सुरू करा, मार्गदर्शक बना किंवा एखाद्या उद्योजकाला पाठबळ द्या.'), url: 'https://newindiamanifesto.com/initiative' },
        ],
      },
      { blockType: 'cta', eyebrow: L('न्यू इंडिया मॅनिफेस्टो', 'New India Manifesto'), heading: L('प्रगतीसाठी आजच चळवळीत सामील व्हा', 'Join the movement for progress today'), text: L('स्वावलंबी नव्या भारतासाठी तुमचे नाव नोंदवा — विचार वाचा, संकल्प करा आणि कृती करा.'), buttons: [btn('मोहिमेत सामील व्हा', 'Join the campaign', 'https://newindiamanifesto.com/pledge', true)] },
    ],
  },
  {
    path: '/appeal', section: 'vision', menuOrder: 2, showSideMenu: false,
    title: L('आवाहन', 'Appeal'), subtitle: L('सोलापूरच्या मातीने घडवलेलं व्यक्तिमत्त्व, संस्कारांनी दिलेली दिशा आणि समाजासाठीची बांधिलकी...', 'A New Voice from Solapur. A New Voice for New India.'),
    bannerImage: image(p, '/images/appeal/rohan.webp', 'रोहन सुभाष देशमुख'),
    layout: [
      {
        blockType: 'mediaText', heading: L('मी रोहन सुभाष देशमुख', 'I am Rohan Deshmukh'), image: image(p, '/images/appeal/rohan.webp', 'रोहन सुभाष देशमुख'),
        body: rt(p,
          'माझा जन्म सोलापूरमध्ये झाला आणि माझं बालपणही याच शहरात गेलं. सुभाष बापू देशमुख यांचा मुलगा म्हणून मला अनेक गोष्टी शिकायला मिळाल्या; पण स्वतःच्या मेहनतीने, चिकाटीने आणि काम करण्याच्या इच्छेने पुढे जाण्याचा प्रयत्नही मी केला. वडिलांनी सुरू केलेल्या समाजसेवेच्या कामात आपलाही वाटा असावा, ही भावना मनात आहे.\n\nमाझा आजवरचा प्रवास सोलापूरशी जोडलेला आहे. वस्त्रोद्योग, बीडी उद्योग आणि रेल्वे जंक्शनसाठी ओळख असलेलं सोलापूर माझ्यासाठी फक्त जन्माचं शहर नाही. या शहराने मला माणसं समजून घ्यायला, त्यांच्या अडचणी पाहायला आणि मेहनतीची किंमत जाणून घ्यायला शिकवलं.\n\nसोलापूरची ओळख साधी आहे—कष्ट करणारी माणसं, अडचणींवर मात करण्याची जिद्द आणि पुढे जाण्याची इच्छा. म्हणूनच सोलापूर हे माझ्यासाठी फक्त शहर नाही; माझ्या विचारांना आणि माझ्या कामाला दिशा देणारं माझं घर आहे.',
          'I was born and raised in Solapur, Maharashtra. As the son of Subhash “Bapu” Deshmukh, I carry forward a legacy of grit, enterprise, and service. My journey is deeply rooted in the soil of Solapur — a city once renowned for its textile mills, beedi industry, and as a vital railway junction. More than just my hometown, Solapur shaped my worldview — a melting pot of traditions, resilience, and aspiration.'),
      },
      {
        blockType: 'content', heading: L('०१ — माझी प्रेरणा', 'My inspiration'),
        body: rt(p,
          'माझे वडील, सुभाष बापू देशमुख, यांचा जीवनप्रवास मी अगदी जवळून पाहिला आहे. त्यांचा प्रवास माझ्यासाठी नेहमीच प्रेरणा आणि शिकवण देणारा राहिला आहे. शाळा सोडल्यानंतर त्यांनी एका पोल्ट्री फॅक्टरीत काम करून आपल्या प्रवासाची सुरुवात केली. त्यानंतर त्यांनी स्वतःचा व्यवसाय सुरू केला. किराणा दुकान, डेअरी फार्म, टायर व्यवसाय आणि बांधकाम अशा वेगवेगळ्या क्षेत्रांत त्यांनी काम केलं. प्रत्येक काम करताना त्यांनी मेहनत घेतली, अनेक अडचणींचा सामना केला आणि परिस्थिती कितीही कठीण असली तरी पुढे जाण्याचा प्रयत्न सोडला नाही.\n\nपुढे त्यांनी साखर उद्योगात प्रवेश केला आणि सोलापूरमध्ये मोठा खासगी साखर कारखाना उभा केला. त्यांच्या या कामाची राष्ट्रीय स्तरावरही दखल घेतली गेली. मात्र, त्यांच्या प्रवासाकडे पाहताना मला जाणवतं की त्यांच्यासाठी व्यवसाय हा केवळ पैसा कमावण्याचा मार्ग नव्हता. व्यवसायातून मिळालेला अनुभव आणि संधी समाजासाठी कशी उपयोगी पडेल, याचा त्यांनी नेहमी विचार केला. सोलापूर आणि ग्रामीण भागातील पाणी, शिक्षण, आरोग्य आणि इतर सामाजिक प्रश्नांवर त्यांनी काम केलं.\n\nराजकारणात प्रवेश केल्यानंतरही त्यांचा भर केवळ पदावर किंवा राजकारणावर राहिला नाही. शेतकरी, कामगार, तरुण आणि ग्रामीण भागातील सामान्य माणूस यांच्या अडचणी समजून घेऊन त्यांच्यासाठी काम करण्याचा त्यांनी प्रयत्न केला.\n\nत्यांचा हा संपूर्ण प्रवास माझ्यासाठी खूप काही शिकवणारा आहे. सुरुवात छोटी असली तरी मेहनत, सातत्य आणि योग्य विचार असेल तर मोठं काम उभं करता येतं, हे मी त्यांच्याकडून शिकलो. आज लोकमंगल फाऊंडेशनच्या माध्यमातून काम करताना माझ्या वडिलांकडून मिळालेली हीच शिकवण मला सतत मार्गदर्शन करते.',
          'I grew up inspired by my father’s extraordinary story — a school dropout who began with odd jobs in a poultry factory and went on to become a first-generation entrepreneur. He bootstrapped several start-ups! From a kirana shop and dairy farm to a tyre business and construction ventures, he built enterprises the hard way — with courage, perseverance, and self-belief.\n\nHis foray into the sugar industry eventually led to one of Solapur’s largest privately-owned sugar factories, earning national recognition. Yet beyond business success, he became known for investing in people — funding water projects, education, healthcare, and rural initiatives long before “CSR” became a corporate term. His entry into politics was not born of ambition, but of responsibility — a response to the needs of farmers, workers, and youth who trusted him as their voice.\n\nGrowing up in this environment, I inherited not just ambition, but values: humility in success, resilience in struggle, and the belief that business and leadership exist to serve society. My own journey took me beyond Solapur — across India and overseas — but every step reaffirmed my conviction that transformation begins with intent.'),
      },
      {
        blockType: 'content', heading: L('०२ — माझ्या कामाची भूमिका', 'New India – Our Next Revolution'),
        body: rt(p,
          'माझा विश्वास आहे की नवा भारत हा फक्त एक विचार किंवा घोषवाक्य न राहता, देशाच्या प्रत्येक भागातून घडणारा बदल असला पाहिजे. महात्मा गांधींनी भारताची खरी ताकद गावांमध्ये असल्याचं सांगितलं होतं. त्यामुळे नव्या भारताची सुरुवातही गावांपासून झाली पाहिजे, असं मला वाटतं.\n\n> नवा भारत म्हणजे फक्त हॅशटॅग नाही. तो केवळ एखादं घोषवाक्य नाही. तो फक्त एक कल्पनाही नाही.\n\nनवा भारत म्हणजे नव्या विचारांना स्वीकारणं, नव्या संधी निर्माण करणं आणि पुढे जाण्यासाठी नवी दिशा तयार करणं. गावातील तरुणांना शिक्षण आणि रोजगाराच्या संधी मिळाल्या, शेतकऱ्यांना पाणी आणि शेतीसाठी आवश्यक सुविधा मिळाल्या, महिलांना स्वतःच्या पायावर उभं राहण्याची संधी मिळाली आणि सामान्य नागरिकांचा विकासाच्या प्रक्रियेत सहभाग वाढला, तर ग्रामीण भागही देशाच्या प्रगतीत मोठी भूमिका बजावू शकतो.\n\nलोकमंगल फाऊंडेशनच्या माध्यमातून ग्रामीण भागात काम करताना मला याचा अनुभव येतो. गावातील लोकांमध्ये क्षमता आहे, मेहनत करण्याची तयारी आहे; गरज आहे ती योग्य संधी आणि योग्य मार्गदर्शनाची.',
          'A century ago, in the middle of the British Raj, an idea was born. It was called Swatantra Bharat. At that time, no one could truly imagine what a free India would feel like. Yet someone dared to see it. Someone dared to plant that seed.\n\nToday, history is repeating itself. Just as our forefathers breathed life into the dream of independence, we are now being called to breathe life into a new dream — the dream of a New India. The emergence of a strong and new Bharat. Free to create our own path. Going forward in strength and purpose.'),
      },
      {
        blockType: 'content', heading: L('०३ — माझा विश्वास', 'My Belief'),
        body: rt(p,
          'माझ्या वडिलांकडून मला आयुष्यात काही महत्त्वाच्या गोष्टी शिकायला मिळाल्या. यश मिळालं तरी पाय जमिनीवर ठेवायचे, अडचणी आल्या तरी प्रयत्न सोडायचे नाहीत आणि नेतृत्व म्हणजे लोकांसाठी काम करण्याची जबाबदारी, हे त्यांनी मला शिकवलं.\n\nया संपूर्ण प्रवासातून माझा एक विश्वास अधिक पक्का झाला—आपल्याला काहीतरी बदलायचं असेल, तर त्याची सुरुवात दुसऱ्यांकडून होण्याची वाट पाहून उपयोग नाही. सुरुवात आपल्या विचारातून, चांगल्या हेतूतून आणि त्या हेतूला कृतीची जोड देण्यापासूनच झाली पाहिजे.\n\nमाझ्यासाठी आजही हा प्रवास सुरूच आहे. शिकत राहणं, लोकांना समजून घेणं आणि आपल्या परीने समाजासाठी काहीतरी चांगलं करण्याचा प्रयत्न करत राहणं, हेच माझं ध्येय आहे.',
          'I believe that New India will be a wave — a wave rising from what Mahatma Gandhi once called the Soul of India: our Rural Heartland.\n\n> New India is not a hashtag. It is not a slogan. It is not merely an idea. It is about Your Tomorrow.\n\nIt is New Thinking. A New Vision. It is the clarion Call for Revolution. The Birth of a New Nation.'),
      },
      {
        blockType: 'content', heading: L('०४ — माझी कार्यक्षेत्रे', 'What I Do Today'),
        body: rt(p,
          'मला तीन वेगवेगळ्या संस्थांमध्ये काम करण्याची आणि त्यांच्या माध्यमातून नेतृत्व करण्याची संधी मिळाली. तिन्ही संस्थांचं काम वेगळं असलं, तरी त्यामागचा माझा विचार एकच आहे. लोकांसाठी काम करणं, त्यांना स्वतःच्या पायावर उभं राहण्यासाठी मदत करणं आणि समाजात चांगला बदल घडवण्याचा प्रयत्न करणं.\n\nलोकांसोबत काम करताना मला नेहमी एक गोष्ट जाणवते—एखाद्याला मदत करणं महत्त्वाचं आहेच; पण त्याचबरोबर त्याला पुढे स्वतःच्या पायावर उभं राहता यावं, ही संधी देणंही तितकंच महत्त्वाचं आहे. म्हणूनच माझ्या कामाचा केंद्रबिंदू नेहमी माणूस आणि त्याचा विकास हा राहिला आहे.',
          'I am privileged to head three organizations that embody my belief in service, empowerment, and transformation. Each is not just an institution — it is a movement.\n\n**Lokmangal Foundation** — Built on the principle of dignity and opportunity, the Foundation has organized over 3,000 community weddings — removing barriers, easing burdens, and proving that marriage can be a celebration of unity rather than financial struggle.\n\n**Community Kitchen** — With a vision of building a Hunger-Free Society, our kitchen serves 550 fresh, healthy meals every single day to the sick, the abandoned, and the severely handicapped.\n\n**Lokmangal Multi-State Cooperative** — Creating employment for the unemployable and ensuring financial inclusion for those locked out of the system.\n\n**Shri Ram Prathisthan** — On a 200-acre campus in Wadala, Solapur, we run 7 colleges. Already, 50% of our students are educated free of cost, and one day, I hope this number will be 100%.\n\nThis is not just my work. This is an invitation.'),
      },
      { blockType: 'quote', text: L('आपण सगळे मिळून असा भारत घडवू शकतो, जो फक्त मोठी स्वप्नं पाहणार नाही, तर ती पूर्ण करण्यासाठी पुढेही येईल.', 'Together, we can build a country that does not just dream, but dares. A country that does not just grow, but grows for all.'), author: L('रोहन सुभाष देशमुख', 'Rohan Subash Deshmukh') },
      { blockType: 'cta', heading: L('तुम्ही माझ्यासोबत याल का?', 'Will you join me?'), text: L('माझ्यासोबत म्हणा: हो! मी तयार आहे!!!', 'Say it with me: YES! I AM IN!!!'), buttons: [btn('हो! मी तयार आहे!!!', 'YES! I AM IN!!!', '/contact')] },
    ],
  },
  ...legal(p),
]

const legal = (p: Payload) => [
  {
    path: '/privacy-policy', section: 'legal', showSideMenu: true, menuOrder: 1, title: L('गोपनीयता धोरण', 'Privacy Policy'),
    layout: [{
      blockType: 'content', body: rt(p,
        'हे संकेतस्थळ (rohandeshmukh.in) वापरताना आपण दिलेली माहिती आम्ही जबाबदारीने हाताळतो.\n\n## आम्ही कोणती माहिती गोळा करतो\n\n- संपर्क, तक्रार/सूचना व करिअर फॉर्ममध्ये आपण स्वतः दिलेली माहिती — नाव, मोबाईल, ईमेल, पत्ता, संदेश व जोडलेल्या फाईल्स.\n- संकेतस्थळाच्या वापराची सामान्य आकडेवारी (Google Analytics), जी वैयक्तिक ओळख पटवत नाही.\n\n## माहितीचा वापर\n\nआपली माहिती फक्त आपल्याशी संपर्क साधण्यासाठी, आपल्या तक्रारीवर/सूचनेवर कार्यवाही करण्यासाठी आणि संकेतस्थळ सुधारण्यासाठी वापरली जाते. आम्ही आपली माहिती विकत नाही किंवा तृतीय पक्षाला देत नाही.\n\n## माहितीची सुरक्षा\n\nसर्व माहिती सुरक्षित (HTTPS) जोडणीद्वारे पाठवली जाते आणि फक्त अधिकृत कार्यालयीन कर्मचाऱ्यांना उपलब्ध असते.\n\n## संपर्क\n\nआपल्या माहितीबाबत कोणताही प्रश्न असल्यास connect@rohandeshmukh.in वर संपर्क साधा.',
        'We handle the information you share on this website (rohandeshmukh.in) responsibly.\n\n## What we collect\n\n- Information you submit through the contact, grievance/suggestion and careers forms — name, mobile, email, address, message and attached files.\n- Aggregate usage statistics (Google Analytics) that do not identify you personally.\n\n## How we use it\n\nYour information is used only to contact you, act on your grievance or suggestion, and improve the website. We do not sell or share it with third parties.\n\n## Security\n\nAll data is sent over a secure (HTTPS) connection and is accessible only to authorised office staff.\n\n## Contact\n\nFor any question about your data, write to connect@rohandeshmukh.in.')
    }],
  },
  {
    path: '/terms', section: 'legal', showSideMenu: true, menuOrder: 2, title: L('अटी व शर्ती', 'Terms & Conditions'),
    layout: [{
      blockType: 'content', body: rt(p,
        'हे संकेतस्थळ वापरून आपण खालील अटी मान्य करता.\n\n- संकेतस्थळावरील मजकूर, छायाचित्रे व चिन्हे यांचे हक्क रोहन सुभाष देशमुख यांच्याकडे राखीव आहेत.\n- फॉर्मद्वारे खोटी, आक्षेपार्ह किंवा बेकायदेशीर माहिती पाठवू नये.\n- बाह्य दुव्यांवरील (उदा. सोशल मीडिया, नोंदणी पोर्टल) मजकुरासाठी आम्ही जबाबदार नाही.\n- या अटींमध्ये वेळोवेळी बदल होऊ शकतात.',
        'By using this website you agree to the following terms.\n\n- All text, photographs and marks on this website are owned by Rohan Subhash Deshmukh.\n- Do not submit false, offensive or unlawful content through the forms.\n- We are not responsible for content on external links (e.g. social media, registration portals).\n- These terms may be updated from time to time.')
    }],
  },
  {
    path: '/disclaimer', section: 'legal', showSideMenu: true, menuOrder: 3, title: L('अस्वीकरण', 'Disclaimer'),
    layout: [{
      blockType: 'content', body: rt(p,
        'या संकेतस्थळावरील माहिती सर्वसामान्य माहितीसाठी आहे. ती अचूक व अद्ययावत ठेवण्याचा आमचा प्रयत्न असतो, तरीही त्यातील कोणत्याही त्रुटीसाठी किंवा बाह्य संकेतस्थळांवरील मजकुरासाठी आम्ही जबाबदार राहणार नाही.',
        'Information on this website is for general purposes. We try to keep it accurate and up to date, but we are not responsible for any errors or for the content of external websites linked from here.')
    }],
  },
]
