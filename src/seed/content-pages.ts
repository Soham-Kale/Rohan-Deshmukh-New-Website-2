import type { Payload } from 'payload'
import { L } from './l10n'
import { image, md } from './helpers'
import { FAMILY } from './content-globals'
import { OTHER } from './content-collections'

const gi = (p: Payload, n: string, alt = '') => image(p, `/images/gallery/${n}.webp`, alt)
const rt = (p: Payload, mr: string, en?: string) => L(md(p, mr), en ? md(p, en) : undefined)
const btn = (mr: string, en: string, url: string, newTab = false) => ({ label: L(mr, en), url, newTab })
const appealCta = (p: Payload) => ({
  blockType: 'cta', heading: L('चांगल्या महाराष्ट्राच्या उभारणीसाठी आम्हाला साथ द्या', 'Join us in building a better Maharashtra'),
  image: gi(p, 'tuljapur-sabha-02', 'जनतेशी संवाद साधताना रोहन देशमुख'),
  buttons: [btn('संपर्क साधा', 'Get in touch', '/contact'), btn('आवाहन', 'Appeal', '/appeal')],
})

export const pages = (p: Payload) => [
  {
    path: '/about/biography', section: 'about', menuOrder: 1,
    title: L('कौटुंबिक पार्श्वभूमी', 'Family Background'),
    subtitle: L('रोहन सुभाष देशमुख हे एक उमदं व्यक्तिमत्त्व — सोलापूर, महाराष्ट्र.', 'Rohan Subhash Deshmukh — Solapur, Maharashtra.'),
    bannerImage: image(p, '/images/about/portrait-solapur.webp', 'रोहन सुभाष देशमुख'),
    layout: [
      {
        blockType: 'cards', eyebrow: L('कौटुंबिक पार्श्वभूमी', 'Family Background'), heading: L('वैयक्तिक माहिती व शिक्षण', 'Personal details & education'), columns: '2',
        items: [
          { icon: '०१', title: L('वैयक्तिक माहिती', 'Personal'), text: L('जन्म: १२ डिसेंबर १९८७\nजन्मस्थळ: सोलापूर, देशमुख कुटुंब', 'Born: 12 December 1987\nBirthplace: Solapur, Deshmukh family') },
          { icon: '०२', title: L('शालेय शिक्षण', 'Schooling'), text: L('लिटल फ्लॉवर कॉन्व्हेंट स्कूल, सोलापूर\nराष्ट्रीय छात्र सेना (NCC): इयत्ता नववीपासून सक्रिय सहभाग', 'Little Flower Convent School, Solapur\nNational Cadet Corps (NCC): active from Class 9') },
          { icon: '०३', title: L('महाविद्यालयीन शिक्षण', 'College'), text: L('संगमेश्वर महाविद्यालय, सोलापूर', 'Sangameshwar College, Solapur') },
          { icon: '०४', title: L('उच्च शिक्षण', 'Higher education'), text: L('बारावी उत्तीर्ण झाल्यानंतर अमेरिकेतील उच्च शिक्षणासाठी प्रयाण.\nरोचेस्टर इन्स्टिट्यूट ऑफ टेक्नॉलॉजी (RIT): जैवतंत्रज्ञान व उद्योजकता विकास (Biotechnology & Entrepreneurship Development) या विषयात पदवी.', 'Went to the USA after Class 12.\nRochester Institute of Technology (RIT): degree in Biotechnology & Entrepreneurship Development.') },
        ],
      },
      {
        blockType: 'content', eyebrow: L('परिवार', 'Family'), heading: L('कौटुंबिक पार्श्वभूमी', 'Family background'),
        body: rt(p,
          'सोलापूर, मराठवाडा आणि संपूर्ण महाराष्ट्रात देशमुख परिवाराची एक वेगळी ओळख आहे. याच परिवारात माझा जन्म झाला. माझ्या परिवाराला अध्यात्माची शिकवण आणि समाजाप्रती बांधिलकीची मूल्ये लाभली. समाजासाठी काहीतरी करण्याची भावना आणि गरजूंना मदत करण्याची सवय परिवारात कायम जपली गेली. त्याचबरोबर व्यवसायातही मेहनत, कष्ट आणि प्रामाणिकपणाला नेहमीच महत्त्व दिले गेले.\n\nमेहनत, कष्ट आणि एकमेकांना साथ देत माझ्या परिवाराने आपली स्वतंत्र ओळख निर्माण केली. आजही माझा परिवार एकत्र राहून सामाजिक कार्य, व्यवसाय आणि कुटुंबाच्या जबाबदाऱ्या सांभाळताना दिसतो. त्यामुळे एकत्र कुटुंब कसे असावे, याचे एक उदाहरण म्हणून माझ्या परिवाराकडे पाहिले जाते.',
          'The Deshmukh family has a distinct identity across Solapur, Marathwada and Maharashtra. I was born into this family, which values spirituality and commitment to society — the habit of helping those in need has always been nurtured, along with hard work and honesty in business.\n\nEven today the family lives together, managing social work, business and family responsibilities — often seen as an example of what a joint family can be.'),
      },
      ...FAMILY.map((f, i) => ({ blockType: 'mediaText', heading: f.name, eyebrow: f.relation, image: image(p, f.img, ''), imagePosition: i % 2 ? 'right' : 'left', body: L(md(p, f.text.mr), md(p, f.text.en!)) })),
      {
        blockType: 'mediaText', eyebrow: L('लोकमंगल', 'Lokmangal'), heading: L('लोकमंगल परिवार', 'The Lokmangal family'), image: image(p, '/images/about/lokmangal-parivar.webp', 'लोकमंगल परिवार'), imagePosition: 'right',
        body: rt(p,
          'माझे बालपण एका एकत्र कुटुंबात झाले. घरातील मोठ्यांकडून मला एकत्र राहणे, एकमेकांना साथ देणे आणि चांगले संस्कार जपणे शिकायला मिळाले. माझे वडील सुभाष देशमुख यांनी उभा केलेला लोकमंगल समूह हाही माझ्या आयुष्याचा महत्त्वाचा भाग होता.\n\nलोकमंगलच्या कामानिमित्त अनेक कार्यकर्ते, कर्मचारी आणि समाजातील वेगवेगळ्या क्षेत्रांतील लोक सतत घरी येत असत. त्यामुळे लहानपणापासूनच मला समाजातील वेगवेगळ्या लोकांना जवळून पाहता आले आणि त्यांच्या अडचणी समजून घेता आल्या.\n\nलोकमंगल परिवारातील वातावरणामुळे मला समाजाशी जोडून काम करण्याची सवय लहानपणापासूनच लागली. माझा परिवार आणि लोकमंगल परिवार हे दोन्ही एकमेकांशी जोडलेले आहेत.',
          'I grew up in a joint family, learning from elders to live together, support one another and hold on to good values. The Lokmangal Group built by my father was an important part of my life.\n\nWorkers, staff and people from all walks of life constantly visited our home, so from childhood I saw people’s problems up close.\n\nThis environment made working with society a habit. My family and the Lokmangal family are deeply connected.'),
        buttons: [btn('लोकमंगल परिवार', 'Lokmangal Parivar', '/lokmangal/parivar')],
      },
      appealCta(p),
    ],
  },
  {
    path: '/lokmangal/foundation', section: 'lokmangal', menuOrder: 1,
    title: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'),
    subtitle: L('सामाजिक कारकीर्द — ग्रामीण भागाचा विकास आणि नागरिकांचे जीवनमान सुधारणे.', 'Social career — rural development and better lives for citizens.'),
    bannerImage: image(p, '/images/foundation/foundation-intro.webp', 'लोकमंगल फाऊंडेशन'),
    layout: [
      {
        blockType: 'mediaText', eyebrow: L('अध्यक्ष', 'Chairman'), heading: L('लोकमंगल फाउंडेशन (अध्यक्ष)', 'Lokmangal Foundation (Chairman)'),
        image: image(p, '/images/foundation/foundation-intro.webp', 'लोकमंगल फाऊंडेशन'),
        body: rt(p, 'ग्रामीण भागाचा विकास आणि तेथील नागरिकांचे जीवनमान सुधारणे, हे लोकमंगल फाऊंडेशनचे मुख्य उद्दिष्ट आहे. माझे वडील मा. सुभाष (बापू) देशमुख यांनी २००५ मध्ये स्थापन केलेल्या या फाऊंडेशनच्या माध्यमातून शिक्षण, सामुदायिक विवाह, शेतीसाठी पाणी आणि निराधार ज्येष्ठ नागरिकांना अन्न अशा विविध क्षेत्रांत काम केले जात आहे.\n\nफाऊंडेशनचा अध्यक्ष म्हणून, ग्रामीण भागातील गरजू नागरिकांना मदत करण्यासोबतच त्यांना स्वतःच्या पायावर उभे राहण्यासाठी संधी उपलब्ध करून देणे, हा माझा प्रयत्न आहे. या प्रवासात समाजातील प्रत्येकाने आपल्या परीने योगदान द्यावे आणि ग्रामीण भागाच्या प्रगतीत सहभागी व्हावे, हीच माझी अपेक्षा.',
          'The main aim of Lokmangal Foundation is rural development and improving the lives of citizens. Founded in 2005 by my father Subhash (Bapu) Deshmukh, it works in education, community weddings, water for farming and food for destitute senior citizens.\n\nAs chairman, I try not only to help those in need but to give them opportunities to stand on their own feet. I hope everyone contributes in their own way to the progress of rural Maharashtra.'),
      },
      { blockType: 'stats', items: [{ value: '५५०', label: L('रोज जेवणाचे डबे', 'Daily meals') }, { value: '२२५', label: L('लोटस विद्यार्थी', 'LOTUS students') }, { value: '३,२२१', label: L('विवाहित जोडपी', 'Couples married') }, { value: '२००५', label: L('स्थापना', 'Founded') }] },
      {
        blockType: 'cards', eyebrow: L('उपक्रम', 'Initiatives'), heading: L('प्रमुख उपक्रम', 'Key initiatives'), columns: '2',
        items: [
          { image: gi(p, 'annapurna-08'), title: L('लोकमंगल अन्नपूर्णा योजना', 'Annapurna Yojana'), meta: L('लाभधारक : ५५०', 'Beneficiaries: 550'), url: '/social-work/annapurna-yojana' },
          { image: gi(p, 'jalsandharan-01'), title: L('जलसंधारण प्रकल्प', 'Water Conservation'), url: '/social-work/jalsandharan' },
          { image: gi(p, 'lotus-03'), title: L('लोटस', 'LOTUS'), meta: L('लाभधारक : २२५', 'Beneficiaries: 225'), url: '/social-work/lotus' },
          { image: gi(p, 'samudayik-vivah-20'), title: L('सामुदायिक विवाह सोहळा', 'Community Weddings'), meta: L('विवाहित जोडपी : ३२२१', 'Couples: 3221'), url: '/social-work/samudayik-vivah' },
        ],
      },
      {
        blockType: 'cards', eyebrow: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'), heading: L('इतर उपक्रम', 'Other initiatives'), columns: '3',
        items: OTHER.map(([slug, , mr, en, text]) => ({ title: L(mr, en), text: L(text), url: `/social-work/${slug}` })),
      },
      appealCta(p),
    ],
  },
  {
    path: '/lokmangal/parivar', section: 'lokmangal', menuOrder: 2,
    title: L('लोकमंगल परिवार', 'Lokmangal Parivar'),
    subtitle: L('वित्तीय, कृषी, शिक्षण व सेवा क्षेत्रातील उद्योग संस्थांचा समूह', 'A group of institutions in finance, agriculture, education and services'),
    bannerImage: image(p, '/images/blog/subhash-deshmukh.webp', 'मा. सुभाष (बापू) देशमुख'),
    layout: [
      { blockType: 'content', body: rt(p, 'मा. सुभाष (बापू) देशमुख यांनी मेहनत, कष्ट आणि दृढ इच्छाशक्तीच्या जोरावर अनेक संस्था उभारल्या. आज या संस्था हजारो कुटुंबांना रोजगाराच्या आणि आर्थिक प्रगतीच्या संधी उपलब्ध करून देत आहेत. समाजासाठी विविध उपक्रम राबवता यावेत आणि त्यासाठी आवश्यक आर्थिक पाठबळ मिळावे, या उद्देशाने या संस्थांची उभारणी करण्यात आली आहे. या संस्थांमधून मिळणारा नफा सामाजिक कार्यासाठीच वापरला जातो.', 'Through hard work and determination, Subhash (Bapu) Deshmukh built many institutions that today provide employment and economic opportunity to thousands of families. They were built to fund social initiatives — their profits are used for social work.') },
      { blockType: 'stats', items: [{ value: '₹५,६०० कोटी', label: L('ठेवी व व्यवसाय', 'Deposits & business') }, { value: '७५', label: L('नागरी पतसंस्था शाखा', 'Credit society branches') }, { value: '६१', label: L('मल्टीस्टेट पतसंस्था शाखा', 'Multistate branches') }, { value: '२,८८०+', label: L('उद्योजक कर्जवाटप', 'Entrepreneur loans') }] },
      {
        blockType: 'cards', eyebrow: L('४ संस्था', '4 institutions'), heading: L('🏦 वित्तीय संस्था', '🏦 Financial institutions'), columns: '2',
        items: [
          { title: L('लोकमंगल को-ऑप. बँक लि.'), meta: L('स्थापना: २८ एप्रिल १९९८ — “अखंड गतीतून सार्थकता”'), text: L('मा. सुभाष देशमुख यांनी सुरुवातीला वेगवेगळ्या ठिकाणी छोट्या-मोठ्या नोकऱ्या केल्या. त्यानंतर त्यांनी ठेकेदारीच्या व्यवसायात काम सुरू केले. त्यांना सुरुवातीपासूनच सामाजिक कामाची आवड होती.'), tags: L(['ISO 9001:2008 प्रमाणपत्र', 'रिझर्व्ह बँकेचा ग्रेड वन', '३६५ दिवस सेवा', 'ठेवी: ₹901+ कोटी', 'कर्जवाटप: ₹523+ कोटी']) },
          { title: L('लोकमंगल मल्टीस्टेट को-ऑप. सोसायटी लि.'), meta: L('स्थापना: २००४ (कार्य सुरुवात २००८)'), text: L('महाराष्ट्राबाहेरही बँकिंग सेवा देता यावी, या उद्देशाने लोकमंगल मल्टीस्टेट या संस्थेची स्थापना करण्यात आली. आज लोकमंगल मल्टीस्टेटच्या महाराष्ट्र आणि कर्नाटक या दोन राज्यांत मिळून ६१ शाखा आहेत.'), tags: L(['एकत्रित गटाच्या ठेवी ₹3,401+ कोटी', 'एकत्रित कर्जवाटप ₹2,500+ कोटी', 'शाखा: ६१', 'ठेवी: ₹751+ कोटी']) },
          { title: L('लोकमंगल नागरी सहकारी पतसंस्था'), meta: L('स्थापना: सप्टेंबर २००२'), text: L('तळागाळातील आर्थिकदृष्ट्या कमकुवत लोकांना आणि छोट्या व्यावसायिकांना बँकेच्या सेवा मिळाव्यात, या उद्देशाने लोकमंगल बँकेची स्थापना करण्यात आली होती.'), tags: L(['तात्काळ व सुलभ कर्जवाटप', 'शाखा: ७५', 'ठेवी: ₹१,७४९+ कोटी', 'कर्जवाटप: ₹१,२५९ कोटी']) },
          { title: L('लोकमंगल डेव्हलपमेंट फाऊंडेशन'), meta: L('स्थापना: २००२ — “कर्मचारी सहकारी पतसंस्था”'), text: L('लोकमंगल समूहातील कर्मचाऱ्यांना आर्थिक आणि इतर प्रकारची मदत मिळावी, यासाठी २००२ साली लोकमंगल कर्मचारी सहकारी पतसंस्थेची स्थापना करण्यात आली.'), tags: L(['मोफत तीर्थयात्रा', 'आरोग्य व शैक्षणिक मदत', 'गुणवंत कर्मचारी सत्कार', 'आपत्कालीन मदत']) },
        ],
      },
      {
        blockType: 'cards', eyebrow: L('३ संस्था', '3 institutions'), heading: L('🌾 कृषी व औद्योगिक', '🌾 Agriculture & industry'), columns: '3',
        items: [
          { title: L('लोकमंगल ॲग्रो इंडस्ट्रीज लि.'), text: L('या कंपनीअंतर्गत साखर कारखाना, इथेनॉल निर्मिती आणि वीज निर्मितीचे काम केले जाते. या कारखान्याचे बांधकाम फक्त ६ महिने ६ दिवसांत पूर्ण करण्यात आले. या कामाची नोंद लिम्का बुक ऑफ रेकॉर्डमध्ये करण्यात आली आहे.'), tags: L(['लिम्का बुक ऑफ रेकॉर्ड', 'निर्यातक्षम साखर', 'वीजनिर्मिती: ३ मेगावॅट']) },
          { title: L('ॲग्री क्लिनिक अँड ॲग्री बिझनेस सेंटर'), text: L('कृषी विषयात पदव्युत्तर शिक्षण घेतलेले, पदवीधर आणि वेगवेगळ्या वयोगटातील लोकांसाठी स्वतःचा व्यवसाय सुरू करण्यासाठी प्रशिक्षण आणि रोजगाराच्या संधी उपलब्ध करून देण्यात येतात.') },
          { title: L('महाराष्ट्र रिसर्च अँड डेव्हलपमेंट सेंटर'), text: L('पारंपरिक पद्धतीने शेती करणाऱ्या शेतकऱ्यांना नवीन आणि आधुनिक शेती तंत्रज्ञानाची माहिती मिळावी, यासाठी तज्ज्ञांच्या मदतीने या केंद्राची स्थापना करण्यात आली आहे.') },
        ],
      },
      {
        blockType: 'cards', eyebrow: L('३ संस्था', '3 institutions'), heading: L('⚙️ सेवा व उत्पादन', '⚙️ Services & products'), columns: '3',
        items: [
          { title: L('लोकमंगल कन्सल्टन्सी सर्व्हिसेस'), meta: L('मुख्यालय: पुणे'), text: L('ही कंपनी आर्थिक सल्ला, कर्ज मिळवून देणे, आर्थिक अडचणींवर उपाय सांगणे, मार्केटिंग आणि इतर व्यावसायिक कामे करते. तसेच नवीन व्यवसाय सुरू करणाऱ्या लोकांना मार्गदर्शन करते.') },
          { title: L('लोकमंगल बायोटेक प्रा. लि.'), meta: L('स्थापना: २००६'), text: L('ही कंपनी शेतीसाठी लागणारी जैविक आणि इतर कृषी उत्पादने तयार करते. यामध्ये सेंद्रिय खते, जैविक खते, पाण्यात सहज मिसळणारी खते आणि बियाणे यांचा समावेश आहे.'), tags: L(['बायो-फर्टिलायझर्स', 'बायो-फंगिसाईड्स', 'वितरण: ७ राज्ये']) },
          { title: L('लोकमंगल प्रॉडक्ट्स लि. (डेअरी)'), meta: L('स्थापना: २००१'), text: L('शेतकऱ्यांना शेतीसोबत दूध व्यवसायातूनही उत्पन्न मिळावे, या उद्देशाने लोकमंगल डेअरीची स्थापना करण्यात आली. डेअरीसाठी ५०० पेक्षा जास्त दूध संकलन केंद्रे सुरू करण्यात आली.'), tags: L(['संकलन केंद्रे: ५००+']) },
        ],
      },
      {
        blockType: 'cards', eyebrow: L('१ संस्था', '1 institution'), heading: L('🎓 शिक्षण व संशोधन', '🎓 Education & research'), columns: '2',
        items: [{ title: L('लोकमंगल महाविद्यालय'), meta: L('स्थापना: १९९७ — “बाराक ग्रामीण संशोधन व विकास प्रतिष्ठान”'), text: L('बाराक ग्रामीण संशोधन व विकास प्रतिष्ठानची स्थापना १९९७ साली वडाळा येथे करण्यात आली. या संस्थेच्या १६९ एकर जागेवर मोठे शैक्षणिक कॅम्पस उभारण्यात आले आहे. येथे केजीपासून पदव्युत्तर शिक्षणापर्यंत विविध अभ्यासक्रम चालतात.'), tags: L(['बीएससी अ‍ॅग्री', 'एमएससी मायक्रो बायोलॉजी', 'बीएससी नर्सिंग', 'आयटीआय', 'कॅम्पस: १६९ एकर', 'हॉस्पिटल: १०० बेड']) }],
      },
      {
        blockType: 'cards', eyebrow: L('२ संस्था', '2 institutions'), heading: L('🤝 सामुदायिक सेवा', '🤝 Community service'), columns: '2',
        items: [
          { title: L('लोकसंवाद-जनता दरबार'), text: L("मा. आ. सुभाष बापू देशमुख गेल्या २० वर्षांपासून 'लोकसंवाद जनता दरबार' हा उपक्रम घेत आहेत. या उपक्रमातून ते नागरिकांशी थेट बोलतात आणि त्यांच्या अडचणी समजून घेतात. दर सोमवारी नागरिकांच्या समस्या ऐकून त्यावर तात्काळ कार्यवाही केली जाते."), tags: L(['प्रत्येक सोमवारी', 'थेट संवाद', 'सातत्य: २०+ वर्षे']) },
          { title: L('सोलापूर सोशल फाउंडेशन'), meta: L('स्थापना: १८ एप्रिल २०१८'), text: L('व्हिजन — सोलापूर जिल्ह्याचा सर्वांगीण विकास साधत जिल्ह्याला महाराष्ट्रातील पहिल्या ५ क्रमांकांच्या यादीत आणणे.'), tags: L(['प्लेसेस', 'पर्सनॅलिटीज', 'प्रॉडक्ट', 'प्लेसमेंट', 'प्रदूषणमुक्त पर्यावरण']) },
        ],
      },
      appealCta(p),
    ],
  },
  {
    path: '/political-career', section: 'political', menuOrder: 1, showSideMenu: false,
    title: L('राजकीय कारकीर्द', 'Political Career'), subtitle: L('रोहन देशमुख', 'Rohan Deshmukh'),
    bannerImage: image(p, '/images/political/yuva-morcha.webp', 'भारतीय जनता युवा मोर्चा'),
    layout: [
      {
        blockType: 'mediaText', eyebrow: L('राजकीय कारकीर्द', 'Political career'), heading: L('भारतीय जनता युवा मोर्चा', 'Bharatiya Janata Yuva Morcha'), image: image(p, '/images/political/yuva-morcha.webp', 'भारतीय जनता युवा मोर्चा'),
        body: rt(p, 'भारतीय जनता युवा मोर्चाचे सरचिटणीस म्हणून उल्लेखनीय काम. संपूर्ण महाराष्ट्रात प्रवास, युवकांमध्ये राजकीय जागृती घडविण्याचे काम. विविध सामाजिक समस्यांसाठी राजकीय पातळीवर आंदोलने.\n\n२००९ साली अमेरिकेतून नुकतेच परतल्यानंतर माढा लोकसभा मतदार संघात सुभाष देशमुख यांच्या प्रचार कार्यात सहभाग. उस्मानाबाद लोकसभा मतदार संघ संघटनात्मक दृष्ट्या मजबूत करण्यावर भर.',
          'Notable work as General Secretary of the Bharatiya Janata Yuva Morcha — travelling across Maharashtra, building political awareness among youth and leading agitations on social issues.\n\nAfter returning from the USA in 2009, campaigned for Subhash Deshmukh in Madha Lok Sabha constituency and focused on strengthening the organisation in Osmanabad Lok Sabha constituency.'),
      },
      { blockType: 'content', heading: L('स्वामी विवेकानंद विचार यात्रा', 'Swami Vivekananda Vichar Yatra'), body: rt(p, 'तुळजापूर - उमरगा - लोहारा - वाशी - भूम - परांडा - बार्शी - उस्मानाबाद', 'Tuljapur – Umarga – Lohara – Washi – Bhoom – Paranda – Barshi – Osmanabad') },
      { blockType: 'gallery', heading: L('क्षणचित्रे', 'Moments'), images: [...Array.from({ length: 6 }, (_, i) => gi(p, `prachar-sabha-0${i + 1}`)), ...Array.from({ length: 9 }, (_, i) => gi(p, `tuljapur-sabha-0${i + 1}`))] },
      appealCta(p),
    ],
  },
  {
    path: '/vision', section: 'vision', menuOrder: 1, showSideMenu: false,
    title: L('विचार करा. संकल्प करा. कृती करा.', 'Think. Resolve. Act.'),
    subtitle: L('स्वावलंबी भारतासाठीचा जाहीरनामा — ग्रामीण भारताच्या सामर्थ्याला बळ देत नवभारत घडवण्याचा ध्यास; प्रामाणिकपणा, उद्यमशीलता आणि एक लाख नव्या उद्योजकांना घडवण्याचे ध्येय.', 'A manifesto for a self-reliant India — building New India by empowering rural India; honesty, enterprise and a goal of one lakh new entrepreneurs.'),
    bannerImage: image(p, '/images/vision/rohan-portrait.webp', 'रोहन सुभाष देशमुख'),
    layout: [
      { blockType: 'cards', columns: '3', items: [
        { icon: '०१', title: L('वाचा', 'Read'), text: L('जाहीरनामा समजून घ्या', 'Understand the manifesto') },
        { icon: '०२', title: L('संकल्प करा', 'Pledge'), text: L('चळवळीत सहभागी व्हा', 'Join the movement') },
        { icon: '०३', title: L('कृती करा', 'Act'), text: L('बदल घडवण्यास सुरुवात करा', 'Start making change') },
      ] },
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
    layout: [{ blockType: 'content', body: rt(p,
      'हे संकेतस्थळ (rohandeshmukh.in) वापरताना आपण दिलेली माहिती आम्ही जबाबदारीने हाताळतो.\n\n## आम्ही कोणती माहिती गोळा करतो\n\n- संपर्क, तक्रार/सूचना व करिअर फॉर्ममध्ये आपण स्वतः दिलेली माहिती — नाव, मोबाईल, ईमेल, पत्ता, संदेश व जोडलेल्या फाईल्स.\n- संकेतस्थळाच्या वापराची सामान्य आकडेवारी (Google Analytics), जी वैयक्तिक ओळख पटवत नाही.\n\n## माहितीचा वापर\n\nआपली माहिती फक्त आपल्याशी संपर्क साधण्यासाठी, आपल्या तक्रारीवर/सूचनेवर कार्यवाही करण्यासाठी आणि संकेतस्थळ सुधारण्यासाठी वापरली जाते. आम्ही आपली माहिती विकत नाही किंवा तृतीय पक्षाला देत नाही.\n\n## माहितीची सुरक्षा\n\nसर्व माहिती सुरक्षित (HTTPS) जोडणीद्वारे पाठवली जाते आणि फक्त अधिकृत कार्यालयीन कर्मचाऱ्यांना उपलब्ध असते.\n\n## संपर्क\n\nआपल्या माहितीबाबत कोणताही प्रश्न असल्यास connect@rohandeshmukh.in वर संपर्क साधा.',
      'We handle the information you share on this website (rohandeshmukh.in) responsibly.\n\n## What we collect\n\n- Information you submit through the contact, grievance/suggestion and careers forms — name, mobile, email, address, message and attached files.\n- Aggregate usage statistics (Google Analytics) that do not identify you personally.\n\n## How we use it\n\nYour information is used only to contact you, act on your grievance or suggestion, and improve the website. We do not sell or share it with third parties.\n\n## Security\n\nAll data is sent over a secure (HTTPS) connection and is accessible only to authorised office staff.\n\n## Contact\n\nFor any question about your data, write to connect@rohandeshmukh.in.') }],
  },
  {
    path: '/terms', section: 'legal', showSideMenu: true, menuOrder: 2, title: L('अटी व शर्ती', 'Terms & Conditions'),
    layout: [{ blockType: 'content', body: rt(p,
      'हे संकेतस्थळ वापरून आपण खालील अटी मान्य करता.\n\n- संकेतस्थळावरील मजकूर, छायाचित्रे व चिन्हे यांचे हक्क रोहन सुभाष देशमुख यांच्याकडे राखीव आहेत.\n- फॉर्मद्वारे खोटी, आक्षेपार्ह किंवा बेकायदेशीर माहिती पाठवू नये.\n- बाह्य दुव्यांवरील (उदा. सोशल मीडिया, नोंदणी पोर्टल) मजकुरासाठी आम्ही जबाबदार नाही.\n- या अटींमध्ये वेळोवेळी बदल होऊ शकतात.',
      'By using this website you agree to the following terms.\n\n- All text, photographs and marks on this website are owned by Rohan Subhash Deshmukh.\n- Do not submit false, offensive or unlawful content through the forms.\n- We are not responsible for content on external links (e.g. social media, registration portals).\n- These terms may be updated from time to time.') }],
  },
  {
    path: '/disclaimer', section: 'legal', showSideMenu: true, menuOrder: 3, title: L('अस्वीकरण', 'Disclaimer'),
    layout: [{ blockType: 'content', body: rt(p,
      'या संकेतस्थळावरील माहिती सर्वसामान्य माहितीसाठी आहे. ती अचूक व अद्ययावत ठेवण्याचा आमचा प्रयत्न असतो, तरीही त्यातील कोणत्याही त्रुटीसाठी किंवा बाह्य संकेतस्थळांवरील मजकुरासाठी आम्ही जबाबदार राहणार नाही.',
      'Information on this website is for general purposes. We try to keep it accurate and up to date, but we are not responsible for any errors or for the content of external websites linked from here.') }],
  },
]
