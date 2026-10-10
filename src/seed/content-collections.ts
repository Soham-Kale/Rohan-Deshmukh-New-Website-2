import type { Payload } from 'payload'
import { L } from './l10n'
import { image, md } from './helpers'

const gi = (p: Payload, name: string, alt = '') => image(p, `/images/gallery/${name}.webp`, alt)
const range = (p: Payload, prefix: string, n: number, alt: string) =>
  Array.from({ length: n }, (_, i) => gi(p, `${prefix}-${String(i + 1).padStart(2, '0')}`, alt))

export const initiatives = (p: Payload) => [
  {
    slug: 'annapurna-yojana', category: 'senior-citizens', featured: true, order: 1,
    title: L('लोकमंगल अन्नपूर्णा योजना', 'Lokmangal Annapurna Yojana'),
    excerpt: L('कुटुंबाकडून दुर्लक्षित किंवा कुटुंब नसलेल्या ६० वर्षांवरील गरजू ज्येष्ठ नागरिकांना दिवसातून दोन वेळा घरपोच जेवण.', 'Two home-delivered meals a day for needy senior citizens above 60 who are neglected or without family.'),
    heroImage: gi(p, 'annapurna-08', 'लोकमंगल अन्नपूर्णा योजना'),
    body: L(
      md(p, 'सदर योजनेअंतर्गत कुटुंबाकडून दुर्लक्षित किंवा कुटुंब नसलेल्या ६० वर्षांवरील गरजू ज्येष्ठ नागरिकांना दिवसातून दोन वेळा घरपोच जेवण दिले जाते. जाहिरातींच्या माध्यमातून गरजू ज्येष्ठ नागरिकांची माहिती गोळा केली जाते. त्यानंतर स्वच्छ ठिकाणी जेवण तयार करून स्वयंसेवकांच्या मदतीने ते डबे संबंधित ज्येष्ठ नागरिकांच्या घरी पोहोचवले जातात.\n\n८ मार्च २०१३ रोजी लोकमंगल फाऊंडेशनच्या माध्यमातून ही योजना सुरू झाली. आज दररोज जवळपास ५०० ते ५५० निराधार आणि गरजू ज्येष्ठ नागरिकांपर्यंत दोन वेळचं जेवण पोहोचवलं जातं. २०१३ पासून आजपर्यंत अंदाजे दहा लाखांहून अधिक टिफिन गरजूंच्या घरापर्यंत पोहोचले आहेत.\n\n> "डबा येतो म्हणून बरं वाटतं, पण खरं सांगायचं तर, कुणीतरी येऊन विचारपूस करतं, हे जास्त बरं वाटतं."\n\nतुमच्या सहकार्याने ५००-५५० डब्यांपासून हा प्रवास १,५०० ज्येष्ठ नागरिकांपर्यंत घेऊन जाण्याचा संकल्प आहे.'),
      md(p, 'Under this scheme, needy senior citizens above 60 who are neglected by family or have no family receive two home-delivered meals a day. Meals are cooked in a clean kitchen and delivered by volunteers.\n\nThe scheme began on 8 March 2013 through Lokmangal Foundation. Today it serves nearly 500–550 senior citizens every day, and more than ten lakh tiffins have been delivered since 2013.\n\n> "It feels good that the tiffin arrives, but honestly, it feels even better that someone comes and asks after me."\n\nWith your support, we aim to grow from 550 tiffins to 1,500 senior citizens.'),
    ),
    counters: [{ value: '५५०', label: L('लाभधारक (दररोज)', 'Beneficiaries (daily)') }, { value: '२०१३', label: L('पासून सुरू', 'Running since') }, { value: '१०,००,०००+', label: L('डबे पोहोचवले', 'Tiffins delivered') }],
    gallery: range(p, 'annapurna', 12, 'लोकमंगल अन्नपूर्णा योजना'),
    youtubeUrl: 'https://www.youtube.com/watch?v=xqe6JKzo11I',
  },
  {
    slug: 'jalsandharan', category: 'agriculture', featured: true, order: 2,
    title: L('जलसंधारण प्रकल्प', 'Water Conservation Project'),
    excerpt: L('लोकमंगल जलसंधारण पॅटर्नच्या माध्यमातून शेतीसाठी पाण्याचे योग्य नियोजन आणि वापर.', 'Planning and using water for farming through the Lokmangal water-conservation pattern.'),
    heroImage: gi(p, 'jalsandharan-01', 'जलसंधारण प्रकल्प'),
    body: L(md(p, 'सोलापूरसारख्या भागात वारंवार दुष्काळ पडतो. त्यामुळे शेतीसाठी पाणी उपलब्ध करून देणे महत्त्वाचे आहे. लोकमंगल जलसंधारण पॅटर्नच्या माध्यमातून पाण्याचे योग्य नियोजन आणि वापर करण्यासाठी काम केले जाते. स्थानिक परिस्थितीचा अभ्यास करून जलसंधारणाची कामे केली जातात, जेणेकरून शेतीला पाणी मिळण्यास मदत होईल.'), md(p, 'Regions like Solapur face frequent droughts, so making water available for farming is vital. Through the Lokmangal water-conservation pattern, work is done to plan and use water well — studying local conditions and building conservation works so that farms get water.')),
    gallery: range(p, 'jalsandharan', 5, 'जलसंधारण प्रकल्प'),
    youtubeUrl: 'https://www.youtube.com/watch?v=DyXdiolI1TI',
  },
  {
    slug: 'lotus', category: 'education', featured: true, order: 3,
    title: L('लोटस (लोकमंगल ऑर्गनायझेशन फॉर टीचिंग अंडरप्रिव्हिलेज्ड स्टुडंट्स)', 'LOTUS (Lokmangal Organisation for Teaching Underprivileged Students)'),
    excerpt: L('आर्थिक अडचणीमुळे कोणत्याही विद्यार्थ्याचे शिक्षण थांबू नये, हा या योजनेचा मुख्य उद्देश.', 'No student’s education should stop because of financial hardship.'),
    heroImage: gi(p, 'lotus-03', 'लोटस'),
    body: L(
      md(p, 'आर्थिक अडचणींमुळे अनेक विद्यार्थ्यांना पुढील शिक्षण घेता येत नाही. ही अडचण लक्षात घेऊन लोकमंगल फाऊंडेशनने विद्यादान योजना सुरू केली. या योजनेला LOTUS (Lokmangal Organisation for Teaching Underprivileged Students) असेही म्हटले जाते. या योजनेत गरजू विद्यार्थ्यांना मदत केली जाते आणि त्यांच्या शिक्षणाचा आवश्यक खर्च फाऊंडेशनकडून केला जातो.\n\n१८ नोव्हेंबर २०१५ रोजी सुरू झालेल्या या योजनेतून आजपर्यंत २२५ विद्यार्थ्यांना मदत मिळाली असून एकूण ९० लाख ९९ हजार २२६ रुपयांची आर्थिक मदत करण्यात आली आहे.'),
      md(p, 'Many students cannot continue their studies due to financial hardship. Lokmangal Foundation started the Vidyadan scheme — LOTUS — to support deserving students and bear the cost of their education.\n\nSince 18 November 2015, 225 students have been supported with a total of ₹90,99,226.'),
    ),
    counters: [{ value: '२२५', label: L('लाभधारक विद्यार्थी', 'Students supported') }, { value: '₹९०.९९ लाख', label: L('एकूण आर्थिक मदत', 'Total assistance') }, { value: '२०१५', label: L('पासून सुरू', 'Running since') }],
    gallery: range(p, 'lotus', 7, 'लोटस'),
    youtubeUrl: 'https://www.youtube.com/watch?v=Mi-1-IPWPmk',
  },
  {
    slug: 'samudayik-vivah', category: 'community', featured: true, order: 4,
    title: L('सामुदायिक विवाह सोहळा', 'Community Wedding Ceremony'),
    excerpt: L('२००७ पासून गरजू वधू-वरांना विवाहासाठी आवश्यक सुविधा मोफत.', 'Since 2007, free wedding facilities for couples from families in need.'),
    heroImage: gi(p, 'samudayik-vivah-20', 'सामुदायिक विवाह सोहळा'),
    body: L(
      md(p, 'विवाहाचा खर्च अनेक गरीब कुटुंबांसाठी मोठी अडचण ठरतो. ही अडचण कमी करण्यासाठी लोकमंगल फाऊंडेशनने २००७ पासून सामुदायिक विवाह सोहळा सुरू केला. या उपक्रमात गरजू वधू-वरांना विवाहासाठी आवश्यक सुविधा मोफत दिल्या जातात.\n\n२००७ पासून आजपर्यंत ३,००० पेक्षा अधिक जोडप्यांनी आपल्या नव्या संसाराची सुरुवात केली असून ४८ सोहळे पार पडले आहेत.\n\n**४९ वा लोकमंगल सामुदायिक विवाह सोहळा — १३ डिसेंबर २०२६.** नोंदणी व अधिक माहितीसाठी संपर्क: ७७२००९६४८८'),
      md(p, 'Wedding costs are a heavy burden for many poor families. Since 2007, Lokmangal Foundation has organised community weddings with all essentials provided free.\n\nMore than 3,000 couples have begun their married lives through 48 ceremonies.\n\n**The 49th Lokmangal Samudayik Vivah Sohala — 13 December 2026.** For registration call 7720096488.'),
    ),
    counters: [{ value: '३,२२१', label: L('विवाहित जोडपी', 'Couples married') }, { value: '४८', label: L('सोहळे', 'Ceremonies') }, { value: '२००७', label: L('पासून सुरू', 'Running since') }],
    gallery: range(p, 'samudayik-vivah', 20, 'सामुदायिक विवाह सोहळा'),
    youtubeUrl: 'https://www.youtube.com/watch?v=pooqDuktVeM',
  },
]

/** The 18 "other initiatives" from the current Social page */
export const OTHER: [string, string, string, string, string, string?][] = [
  ['ek-muth-dhanya', 'community', 'एक मूठ धान्य योजना', 'Ek Muth Dhanya (A Fistful of Grain)', "लहान वयातच मुलांना गरजू व्यक्तींना मदत करण्याची सवय लागावी, यासाठी 'एक मूठ धान्य' हा उपक्रम राबवला जातो. शाळेतील विद्यार्थी धान्य जमा करून ते गरजूंसाठी उपलब्ध करून देतात.", '/images/foundation/upakram/ek-muth-dhanya.webp'],
  ['sahitya-puraskar', 'culture', 'लोकमंगल साहित्य पुरस्कार', 'Lokmangal Literature Award', 'गुणवंत आणि दर्जेदार साहित्यनिर्मिती करणाऱ्या साहित्यिकांच्या कार्याची दखल घेऊन त्यांचा सन्मान करण्यासाठी २०१५ पासून लोकमंगल साहित्य पुरस्कार दिला जातो.'],
  ['shikshak-ratna-puraskar', 'education', 'लोकमंगल शिक्षक रत्न पुरस्कार', 'Lokmangal Shikshak Ratna Award', 'शिक्षण क्षेत्रात उल्लेखनीय कार्य करणाऱ्या शिक्षकांना आणि आदर्श शाळांना प्रोत्साहन देण्यासाठी २००७ पासून लोकमंगल शिक्षक रत्न पुरस्काराचे आयोजन केले जाते.', '/images/foundation/upakram/shikshak-ratna-puraskar.webp'],
  ['sanjivani-medical', 'health', 'लोकमंगल संजीवनी मेडिकल', 'Lokmangal Sanjivani Medical', 'गरजू रुग्णांना उपचारासाठी आवश्यक औषधे मिळावीत, यासाठी १२ डिसेंबर २०२५ रोजी लोकमंगल संजीवनी मेडिकलची सुरुवात करण्यात आली.', '/images/foundation/upakram/sanjivani-medical.webp'],
  ['maha-arogya-shibir', 'health', 'महाआरोग्य शिबीर', 'Mega Health Camp', 'सोलापूर आणि आसपासच्या नागरिकांसाठी मोफत आरोग्य तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा उपलब्ध करून देण्यासाठी महाआरोग्य शिबिराचे आयोजन करण्यात आले.'],
  ['divyang-shibir', 'health', 'दिव्यांग शिबीर', 'Divyang Camp', 'दिव्यांग बांधवांचे दैनंदिन जीवन अधिक सुलभ व्हावे, यासाठी जयपूर फूट, कॅलिपर्स, कुबड्या, व्हीलचेअर, श्रवणयंत्र आणि ऑर्थो शूज यांसारख्या साहित्याचे मोफत वाटप केले जाते.'],
  ['sarvarog-nidan-shibir', 'health', 'मोफत सर्वरोग निदान शिबीर', 'Free Diagnostic Camp', 'झोपडपट्टी, कामगार आणि गरजू भागातील नागरिकांसाठी विविध आजारांची मोफत तपासणी करण्यासाठी सर्वरोग निदान शिबिरे आयोजित केली जातात.'],
  ['raktadan-shibir', 'health', 'रक्तदान शिबीर', 'Blood Donation Camp', 'रक्ताची निर्मिती कृत्रिम पद्धतीने करता येत नसल्यामुळे गरजू रुग्णांसाठी रक्तदानाचे महत्त्व मोठे आहे.'],
  ['shaley-sahitya-vatap', 'education', 'विद्यार्थ्यांना शालेय साहित्य व वही वाटप', 'School Supplies Distribution', 'गरीब, गरजू आणि एकल पालकांच्या मुलांना शिक्षणासाठी आवश्यक वह्या व शालेय साहित्य मोफत दिले जाते.'],
  ['balsanskar-shibir', 'youth', 'बालसंस्कार शिबीर', 'Balsanskar Camp', 'नवीन पिढीमध्ये चांगल्या सवयी आणि संस्कार निर्माण करण्यासाठी निवासी बालसंस्कार शिबिरांचे आयोजन केले जाते.', '/images/foundation/upakram/balsanskar-shibir.webp'],
  ['killa-bandhani-spardha', 'culture', 'किल्ला बांधणी स्पर्धा', 'Fort-Building Competition', 'दिवाळीत किल्ले बांधण्याची परंपरा पुढील पिढीपर्यंत पोहोचावी आणि मुलांना महाराष्ट्राच्या इतिहासाची ओळख व्हावी, यासाठी किल्ला बांधणी स्पर्धेचे आयोजन केले जाते. शाळांच्या माध्यमातून विद्यार्थ्यांचे गट तयार करून शिक्षकांच्या मार्गदर्शनाखाली किल्ले तयार केले जातात.'],
  ['rojgar-melava', 'youth', 'रोजगार मेळावा', 'Job Fair', 'तरुणांना रोजगाराच्या संधी मिळाव्यात, यासाठी कौशल्य विकास, रोजगार व उद्योजकता विभाग आणि लोकमंगल फाऊंडेशन यांच्या संयुक्त विद्यमाने रोजगार मेळाव्याचे आयोजन करण्यात आले.'],
  ['mahila-din', 'women', 'महिला दिन', "Women's Day", 'जागतिक महिला दिनाच्या निमित्ताने कर्तबगार आणि यशस्वी महिलांचा सन्मान केला जातो. महिलांसाठी सांस्कृतिक खेळ व विविध स्पर्धांचे आयोजन करून त्यांच्या सहभागाला प्रोत्साहन दिले जाते, तसेच यशस्वी महिलांचे अनुभव आणि मार्गदर्शन इतर महिलांपर्यंत पोहोचवले जाते.'],
  ['bhajan-bharud-spardha', 'culture', 'भजन व भारूड स्पर्धा', 'Bhajan & Bharud Competition', 'भजन, भारूड आणि कीर्तनाच्या माध्यमातून सांस्कृतिक परंपरा पुढील पिढीपर्यंत पोहोचाव्यात, यासाठी दरवर्षी भजन-भारूड स्पर्धेचे आयोजन केले जाते.'],
  ['yog-din', 'health', 'योग दिन', 'Yoga Day', 'दरवर्षी २१ जून रोजी आंतरराष्ट्रीय योग दिनानिमित्त शाळा, महाविद्यालये आणि इतर ठिकाणी योग प्रशिक्षण व जनजागृती केली जाते.'],
  ['ekal-mahila-upakram', 'women', 'एकल महिला उपक्रम', 'Single Women Initiative', 'पतीचे निधन झालेल्या, घटस्फोटित, विभक्त किंवा निराधार महिलांना रोजगाराच्या संधी, मुलांच्या शिक्षणासाठी मदत आणि शालेय साहित्य उपलब्ध करून देण्यासाठी हा उपक्रम राबवला जातो.', '/images/foundation/upakram/ekal-mahila-upakram.webp'],
  ['vrukshaaropan', 'agriculture', 'वृक्षारोपण', 'Tree Plantation', 'शाळा परिसर आणि लोकवस्तीमध्ये वृक्षारोपण करून पर्यावरण संवर्धनाचा संदेश दिला जातो. केवळ झाडे लावण्याऐवजी त्यांचे संगोपन करण्यावर भर दिला जातो आणि मुलांमध्ये लहानपणापासून पर्यावरणाप्रती जबाबदारीची भावना निर्माण केली जाते.'],
  ['dandiya-utsav', 'women', 'दांडिया उत्सव', 'Dandiya Festival', 'नवरात्रोत्सवानिमित्त महिलांसाठी दांडिया आणि गरबा स्पर्धांचे आयोजन केले जाते. समूह तसेच वैयक्तिक सहभागातून महिलांना आपली कला सादर करण्याची संधी दिली जाते आणि विजेत्यांना विविध स्वरूपातील बक्षिसे देऊन प्रोत्साहन दिले जाते.', '/images/foundation/upakram/dandiya-utsav.webp'],
]

export const otherInitiatives = (p: Payload) =>
  OTHER.map(([slug, category, mr, en, text, img], i) => ({
    slug, category, featured: false, order: 10 + i,
    title: L(mr, en),
    excerpt: L(text),
    heroImage: img ? image(p, img, mr) : undefined,
    body: L(md(p, text)),
  }))

export const ALBUMS: [string, string, string, string, number, string][] = [
  ['annapurna', 'लोकमंगल अन्नपूर्णा योजना', 'Annapurna Yojana', 'social', 12, 'annapurna'],
  ['jalsandharan', 'जलसंधारण प्रकल्प', 'Water Conservation', 'social', 5, 'jalsandharan'],
  ['lotus', 'लोटस', 'LOTUS', 'social', 7, 'lotus'],
  ['samudayik-vivah', 'सामुदायिक विवाह सोहळा', 'Community Weddings', 'events', 20, 'samudayik-vivah'],
  ['tuljapur-sabha', 'तुळजापूर सभा', 'Tuljapur Rally', 'political', 9, 'tuljapur-sabha'],
  ['shikshanratna-puraskar', 'शिक्षणरत्न व आदर्श शाळा पुरस्कार', 'Shikshan Ratna & Model School Awards', 'events', 6, 'shikshanratna-puraskar'],
  ['rakshabandhan', 'रक्षाबंधन कार्यक्रम', 'Raksha Bandhan Programme', 'public', 6, 'rakshabandhan'],
  ['prachar-sabha', 'प्रचार सभा', 'Campaign Rallies', 'political', 6, 'prachar-sabha'],
  ['bakshis-samarambh', 'बक्षीस समारंभ', 'Prize Distribution', 'events', 5, 'bakshis-samarambh'],
  ['cm-chashak', 'CM चषक', 'CM Trophy', 'events', 14, 'cm-chashak'],
]

export const albums = (p: Payload) =>
  ALBUMS.map(([slug, mr, en, category, n, prefix], i) => {
    const photos = range(p, prefix, n, mr)
    return { slug, title: L(mr, en), category, cover: photos[0], photos, date: new Date(Date.UTC(2026, 8, 30 - i)).toISOString() }
  })

export const videos = () => [
  { title: L('लोकमंगल अन्नपूर्णा योजना', 'Lokmangal Annapurna Yojana'), youtubeUrl: 'https://www.youtube.com/watch?v=xqe6JKzo11I', playlist: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation'), featured: true },
  { title: L('जलसंधारण प्रकल्प', 'Water Conservation Project'), youtubeUrl: 'https://www.youtube.com/watch?v=DyXdiolI1TI', playlist: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation') },
  { title: L('लोटस शिष्यवृत्ती योजना', 'LOTUS scholarship scheme'), youtubeUrl: 'https://www.youtube.com/watch?v=Mi-1-IPWPmk', playlist: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation') },
  { title: L('सामुदायिक विवाह सोहळा', 'Community Wedding Ceremony'), youtubeUrl: 'https://www.youtube.com/watch?v=pooqDuktVeM', playlist: L('लोकमंगल फाऊंडेशन', 'Lokmangal Foundation') },
]

export const quotes = () => [
  { text: L('नवभारत हा केवळ हॅशटॅग नाही. तो केवळ नारा नाही. तो उद्याच्या भारताचा पाया आहे.', 'New India is not a hashtag. It is not a slogan. It is the foundation of tomorrow’s India.'), category: 'new-india' },
  { text: L('सुरुवात छोटी असली तरी मेहनत, सातत्य आणि योग्य विचार असेल तर मोठं काम उभं करता येतं.', 'Even a small beginning can build something big with hard work, consistency and the right thinking.'), category: 'inspiration' },
  { text: L('समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो.', 'Even a small effort to change society is a big one.'), category: 'service' },
  { text: L('एखाद्याला मदत करणं महत्त्वाचं आहेच; पण त्याला स्वतःच्या पायावर उभं राहता यावं, ही संधी देणंही तितकंच महत्त्वाचं आहे.', 'Helping someone matters — but giving them the chance to stand on their own feet matters just as much.'), category: 'service' },
  { text: L('शिक्षण मिळवण्यासाठी लागणारी सगळ्यात महत्त्वाची गोष्ट म्हणजे जिद्द आणि चिकाटी, आर्थिक पार्श्वभूमी नाही.', 'What education needs most is determination and perseverance — not financial background.'), category: 'youth' },
  { text: L('आपल्याला काहीतरी बदलायचं असेल, तर त्याची सुरुवात दुसऱ्यांकडून होण्याची वाट पाहून उपयोग नाही.', 'If we want to change something, there is no use waiting for others to start.'), category: 'inspiration' },
  { text: L('नव्या भारताची सुरुवातही गावांपासून झाली पाहिजे.', 'New India must begin in our villages.'), category: 'new-india' },
  { text: L('जेवण पोटाची भूक भागवतं; पण आपलेपणाची भावना माणसाचं आयुष्य समृद्ध करते.', 'A meal satisfies hunger, but a sense of belonging enriches a life.'), category: 'service' },
  { text: L('एक लाख नव्या उद्योजकांना घडवणं — हे स्वावलंबी भारताचं ध्येय आहे.', 'Building one lakh new entrepreneurs — that is the goal of a self-reliant India.'), category: 'entrepreneurship' },
]
