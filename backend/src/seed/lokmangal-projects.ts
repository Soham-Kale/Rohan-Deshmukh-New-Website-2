/**
 * The 23 social initiatives of Lokmangal Foundation, as published on lokmangalfoundation.com/projects
 * (Marathi and English). Each one is stored as an "Initiative" (Social Work → Initiatives in the admin):
 *  - summary → excerpt (card text), stat → "Key impact" line, body → the initiative's own page.
 * Bullets are "- " and section headings "### " (markdown).
 */
export type LokText = { title: string; stat?: string; summary: string; body: string }
export type LokProject = { slug: string; category: 'food' | 'agriculture' | 'education' | 'health' | 'community' | 'women' | 'culture'; image?: string; mr: LokText; en: LokText }

export const S3 = 'https://lokmangal-foundation-uploads.s3.ap-south-1.amazonaws.com'

export const LOKMANGAL_PROJECTS: LokProject[] = [
  {
    slug: 'annapurna-yojana', category: 'food', image: `${S3}/projects/1791525723691-ce3a73a61d98.png`,
    mr: {
      title: 'लोकमंगल अन्नपूर्णा योजना', stat: '५०० लाभार्थी',
      summary: 'अन्न ही प्रत्येक व्यक्तीची मूलभूत गरज आहे. मात्र, आर्थिक अडचणी, शारीरिक मर्यादा किंवा कुटुंबाचा आधार नसल्यामुळे अनेक ज्येष्ठ नागरिकांना दररोजच्या जेवणाची व्यवस्था करणे कठीण जाते. ही गरज लक्षात घेऊन लोकमंगल फाऊंडेशनने ८ मार्च २०१३ रोजी लोकमंगल अन्नपूर्णा योजना सुरू केली.',
      body: `**उद्दिष्ट:** ६० वर्षांपेक्षा जास्त वयाच्या गरजू, निराधार ज्येष्ठ नागरिकांना रोजचे दोन वेळेचे जेवण घरपोच उपलब्ध करून देणे.

अन्न ही प्रत्येक व्यक्तीची मूलभूत गरज आहे. मात्र, आर्थिक अडचणी, शारीरिक मर्यादा किंवा कुटुंबाचा आधार नसल्यामुळे अनेक ज्येष्ठ नागरिकांना दररोजच्या जेवणाची व्यवस्था करणे कठीण जाते. ही गरज लक्षात घेऊन लोकमंगल फाऊंडेशनने ८ मार्च २०१३ रोजी लोकमंगल अन्नपूर्णा योजना सुरू केली.

- सोलापूर शहरातील ६० वर्षांवरील ५०० गरजू ज्येष्ठ नागरिकांना दररोज दोन वेळचे जेवण घरपोच दिले जाते.
- वर्तमानपत्रांमधील जाहिराती आणि इतर माध्यमांतून गरजू नागरिकांची माहिती संकलित करून पात्र लाभार्थ्यांची निवड केली जाते.
- स्वतंत्र आणि स्वच्छ स्वयंपाकघरात आचारी व सहाय्यकांमार्फत दररोज ताजे जेवण तयार केले जाते.
- तयार केलेले जेवण डब्यांमध्ये भरून कर्मचारी आणि स्वयंसेवकांच्या माध्यमातून लाभार्थ्यांच्या घरी पोहोचवले जाते.
- ऊन, पाऊस किंवा इतर कोणत्याही परिस्थितीत ही सेवा वर्षभर नियमितपणे सुरू असते.

या योजनेचा विस्तार करून १,५०० गरजू ज्येष्ठ नागरिकांपर्यंत सेवा पोहोचवण्याचे फाऊंडेशनचे उद्दिष्ट आहे. समाजातील नागरिक आणि संस्थांच्या सहकार्याने अधिक ज्येष्ठ नागरिकांना नियमित जेवणाची सुविधा उपलब्ध करून देण्याचा प्रयत्न आहे, जेणेकरून वृद्धापकाळात त्यांना अन्नासाठी अडचणींचा सामना करावा लागू नये.`,
    },
    en: {
      title: 'Lokmangal Annapurna Yojana', stat: '500 Beneficiaries',
      summary: 'Everyone needs food. But for many senior citizens, getting a meal every day is not easy. Some have no money, some can’t cook or walk to a shop, and some have no one at home to look after them. On 8 March 2013, Lokmangal Foundation started the Lokmangal Annapurna Yojana for these elders.',
      body: `Everyone needs food. But for many senior citizens, getting a meal every day is not easy. Some have no money, some can’t cook or walk to a shop, and some have no one at home to look after them. On 8 March 2013, Lokmangal Foundation started the Lokmangal Annapurna Yojana for these elders.

- Every day, 500 senior citizens above 60 in Solapur city receive two meals delivered to their homes.
- People in need are identified through newspaper ads and other sources, and eligible beneficiaries are carefully selected.
- Fresh meals are cooked daily by cooks and helpers in a separate, clean kitchen.
- The food is packed in tiffins and delivered to each home by our staff and volunteers.
- Rain or shine, this service runs every day of the year without a break.

We now want to reach 1,500 elders. We can only do this with the help of people and organizations in the city. If you can support us, more senior citizens will get a proper meal every day.`,
    },
  },
  {
    slug: 'jalsandharan', category: 'agriculture', image: `${S3}/projects/seed-slider-jalsandharan-project.jpg`,
    mr: {
      title: 'लोकमंगल जलसंधारण योजना | जलसमृद्ध शेती, समृद्ध शेतकरी', stat: '१० लाख घनमीटर गाळ | १०० कोटी लिटर साठा',
      summary: 'भारत हा कृषिप्रधान देश असून शेती हा आपल्या अर्थव्यवस्थेचा कणा आहे. अहोरात्र कष्ट करून संपूर्ण समाजासाठी अन्नधान्य पिकवणाऱ्या शेतकऱ्याच्या जीवनात पाण्याचे अनन्यसाधारण महत्त्व आहे. मात्र, दुष्काळ, पूर आणि अवेळी पाऊस यांसारख्या नैसर्गिक आपत्तींमुळे शेतीचे मोठे नुकसान होते. शेतीसाठी पाण्याची उपलब्धता वाढवून या समस्यांवर मात करण्याच्या उद्देशाने लोकमंगल फाऊंडेशनने जलसंधारण उपक्रम सुरू केला.',
      body: `**उद्दिष्ट:** पाण्याची उपलब्धता सुधारणे, धरणांतील गाळ काढून साठवण क्षमता वाढवणे आणि शेतीसाठी मुबलक पाणी उपलब्ध करून देणे.

भारत हा कृषिप्रधान देश असून शेती हा आपल्या अर्थव्यवस्थेचा कणा आहे. अहोरात्र कष्ट करून संपूर्ण समाजासाठी अन्नधान्य पिकवणाऱ्या शेतकऱ्याच्या जीवनात पाण्याचे अनन्यसाधारण महत्त्व आहे. मात्र, दुष्काळ, पूर आणि अवेळी पाऊस यांसारख्या नैसर्गिक आपत्तींमुळे शेतीचे मोठे नुकसान होते. शेतीसाठी पाण्याची उपलब्धता वाढवून या समस्यांवर मात करण्याच्या उद्देशाने लोकमंगल फाऊंडेशनने जलसंधारण उपक्रम सुरू केला.

धरणे आणि तलावांमध्ये वर्षानुवर्षे साचणाऱ्या गाळामुळे त्यांच्या जलसाठवण क्षमतेत घट होते. ही समस्या दूर करण्यासाठी फाऊंडेशनतर्फे ‘गाळमुक्त धरण, गाळयुक्त शिवार’ हा उपक्रम राबवण्यात येतो. या उपक्रमांतर्गत तलावांतील गाळ काढून तो शेतकऱ्यांना विनामूल्य उपलब्ध करून दिला जातो. त्यामुळे जलसाठवण क्षमता वाढण्यासोबतच शेतजमिनीची सुपीकता सुधारण्यासही मदत होते.

### जलसंधारणातून साधलेली फलनिष्पत्ती

- १० लाख घनमीटर गाळ तलावांतून काढण्यात आला.
- १०० कोटी लिटर पाण्याची अतिरिक्त साठवण क्षमता निर्माण झाली.
- ५० हजार लोकसंख्येला वर्षभर पुरेल, एवढ्या पाणीसाठ्याची क्षमता निर्माण झाली.
- ८०० एकर शेतीला वाढीव पाण्याचा लाभ मिळण्याची क्षमता निर्माण झाली.
- ६५० शेतकऱ्यांनी या उपक्रमाचा लाभ घेतला.

एकरुख मध्यम प्रकल्प, लघुपाटबंधारे तलाव, सोरेगाव, बीबी दारफळ आणि हिप्परगा तलाव येथे जलसंधारणाची कामे करून शेतकऱ्यांना गाळ उपलब्ध करून देण्यात आला आहे. याशिवाय, ग्रामीण भागातील अनेक ठिकाणी ओढ्यांचे खोलीकरण आणि रुंदीकरण करण्यात आले आहे. या कामांमुळे पाणीसाठा वाढण्यास आणि जलस्रोतांचे पुनरुज्जीवन होण्यास मदत झाली आहे. या उपक्रमामुळे शेतीसाठी पाण्याची उपलब्धता वाढण्यास, जमिनीची सुपीकता सुधारण्यास आणि भूजलपातळी उंचावण्यास हातभार लागला आहे. परिणामी, शेतीच्या उत्पादनक्षमतेत वाढ होण्यास आणि शेतकऱ्यांच्या जीवनमानात सुधारणा घडवून आणण्यास मदत झाली आहे.

शेतकऱ्यांना शेतीसाठी पुरेसे पाणी उपलब्ध व्हावे, त्यांच्या कष्टांना बळ मिळावे आणि ग्रामीण भागातील पाणीटंचाई कमी व्हावी, हे लोकमंगल फाऊंडेशनच्या जलसंधारण उपक्रमाचे प्रमुख उद्दिष्ट आहे. जलसंधारणातून शेतीला बळकटी देणे आणि शेतकऱ्यांच्या जीवनात समृद्धी आणणे, हीच या उपक्रमामागील प्रेरणा आहे.`,
    },
    en: {
      title: 'Lokmangal Jalsandharan Yojana | More Water for Farms, Better Lives for Farmers', stat: '10 Lakh cu.m Desilted | 100 Cr Litres Capacity',
      summary: 'Farming is the backbone of India. Our farmers work hard every day to grow food for all of us, and they need water to do it. But droughts, floods and rain at the wrong time often ruin their crops. To help farmers get more water for their fields, Lokmangal Foundation started its water conservation work.',
      body: `Farming is the backbone of India. Our farmers work hard every day to grow food for all of us, and they need water to do it. But droughts, floods and rain at the wrong time often ruin their crops. To help farmers get more water for their fields, Lokmangal Foundation started its water conservation work.

Over time, mud and silt collect at the bottom of dams and lakes. This means they can hold less water. To solve this problem, the Foundation runs the “Galmukt Dharan, Galyukt Shivar” (Clean Dams, Rich Farms) project. We take out the silt from lakes and give it to farmers for free. This way, the lakes hold more water, and farmers get rich soil for their fields.

### What We Have Achieved

- 10 lakh cubic metres of silt removed from lakes
- 100 crore litres of extra water can now be stored
- Enough water for 50,000 people for one full year
- More water for 800 acres of farmland
- 650 farmers have benefited

We have done this work at the Ekrukh Medium Project, the small irrigation lake at Soregaon, and the lakes at Bibi Darphal and Hipparga. We have also made streams deeper and wider in many villages. This helps store more water and brings old water sources back to life.

Because of this work, farmers now have more water, better soil, and higher groundwater levels. Their crops are growing better, and their lives are improving. Our goal is simple: every farmer should have enough water, their hard work should pay off, and no village should face a water shortage. Through water conservation, we want to make farming stronger and help farmers live better lives.`,
    },
  },
  {
    slug: 'lotus', category: 'education', image: `${S3}/projects/1789720177851-6805330574bc.jpg`,
    mr: {
      title: 'LOTUS | शिक्षणाच्या बळावर स्वप्नांना नवी दिशा', stat: '२२५ विद्यार्थी दत्तक | ₹९०,९९,२२६ निधी',
      summary: 'शिक्षण हा प्रत्येक मुलाचा मूलभूत अधिकार आहे. शिक्षणामुळे व्यक्तीला ज्ञान मिळते, आत्मविश्वास वाढतो आणि स्वतःचे भविष्य घडवण्याची संधी मिळते. मात्र, आर्थिक परिस्थिती प्रतिकूल असल्यामुळे अनेक होतकरू आणि मेहनती विद्यार्थ्यांना इच्छा असूनही पुढील शिक्षण घेता येत नाही. आर्थिक अडचणींमुळे त्यांच्या शिक्षणात खंड पडू नये, यासाठी लोकमंगल फाऊंडेशनने LOTUS – Lokmangal Organization for Teaching Underprivileged Students हा उपक्रम सुरू केला आहे.',
      body: `**उद्दिष्ट:** आर्थिक अडचणींमुळे शिक्षण थांबलेल्या होतकरू विद्यार्थ्यांना दत्तक घेऊन त्यांच्या उच्च शिक्षणाचा खर्च उचलणे.

शिक्षण हा प्रत्येक मुलाचा मूलभूत अधिकार आहे. शिक्षणामुळे व्यक्तीला ज्ञान मिळते, आत्मविश्वास वाढतो आणि स्वतःचे भविष्य घडवण्याची संधी मिळते. मात्र, आर्थिक परिस्थिती प्रतिकूल असल्यामुळे अनेक होतकरू आणि मेहनती विद्यार्थ्यांना इच्छा असूनही पुढील शिक्षण घेता येत नाही. आर्थिक अडचणींमुळे त्यांच्या शिक्षणात खंड पडू नये, यासाठी लोकमंगल फाऊंडेशनने LOTUS – Lokmangal Organization for Teaching Underprivileged Students हा उपक्रम सुरू केला आहे.

- आर्थिकदृष्ट्या दुर्बल, गुणवंत आणि होतकरू विद्यार्थ्यांना दत्तक घेऊन त्यांच्या पुढील शिक्षणाचा खर्च फाऊंडेशनतर्फे उचलला जातो.
- दरवर्षी बारावी उत्तीर्ण झालेल्या २०० विद्यार्थ्यांना शिक्षणासाठी मदत केली जाते.
- आतापर्यंत २२५ विद्यार्थ्यांना दत्तक घेण्यात आले आहे.
- आतापर्यंत एकूण ₹९०,९९,२२६ इतके आर्थिक सहकार्य शिष्यवृत्तीच्या स्वरूपात देण्यात आले आहे.

### विद्यार्थ्यांच्या शिक्षणाला आधार देणारा दुवा

शिकण्याची इच्छा असूनही आर्थिक अडचणींमुळे पुढील शिक्षण घेता न येणाऱ्या विद्यार्थ्यांना आणि त्यांच्या शिक्षणासाठी मदत करू इच्छिणाऱ्या दानशूर व्यक्तींना LOTUS एकत्र आणते. देणगीदारांकडून मिळणारे आर्थिक सहकार्य योग्य विद्यार्थ्यांपर्यंत पोहोचवले जाते. ज्या विद्यार्थ्याला देणगीदाराच्या मदतीने शिक्षणासाठी आधार मिळतो, त्याची माहिती देणगीदाराला दिली जाते. त्यामुळे देणगीदार विद्यार्थ्याच्या संपर्कात राहू शकतो आणि त्याच्या शैक्षणिक प्रगतीची माहिती घेऊ शकतो. अशा प्रकारे आर्थिक मदतीसोबतच विद्यार्थ्याला प्रोत्साहन आणि आधारही मिळतो.

विश्वास, पारदर्शकता आणि उत्तरदायित्व या मूल्यांवर LOTUSचे कार्य आधारलेले आहे. विद्यार्थ्याला दिलेली मदत ही केवळ आर्थिक मदत नसून, त्याच्या शिक्षणाला आणि भविष्यातील वाटचालीला दिलेला आधार आहे. आर्थिक परिस्थितीमुळे कोणत्याही विद्यार्थ्याचे शिक्षण थांबू नये, त्याच्या गुणवत्तेला आणि स्वप्नांना योग्य संधी मिळावी आणि प्रत्येक होतकरू विद्यार्थ्याला स्वतःचे भविष्य घडवता यावे, हेच LOTUSचे ध्येय आहे.`,
    },
    en: {
      title: 'LOTUS | Giving Dreams a New Direction Through Education', stat: '225 Students Adopted | ₹90,99,226 Scholarship',
      summary: 'Every child has the right to learn. Education gives a child knowledge, confidence and the chance to shape their own future. But many bright and hardworking students have to give up their studies, even though they want to keep learning, simply because their families cannot afford it. So that money never stands between a student and their education, Lokmangal Foundation started LOTUS – Lokmangal Organization for Teaching Underprivileged Students.',
      body: `Every child has the right to learn. Education gives a child knowledge, confidence and the chance to shape their own future. But many bright and hardworking students have to give up their studies, even though they want to keep learning, simply because their families cannot afford it. So that money never stands between a student and their education, Lokmangal Foundation started LOTUS – Lokmangal Organization for Teaching Underprivileged Students.

- The Foundation adopts bright and hardworking students from poor families and pays for their higher education.
- Each year, up to 200 students who have passed Class 12 receive support for their studies.
- So far, 225 students have been adopted.
- Scholarships worth ₹90,99,226 have been given to date.

### A Bridge Between Students and Supporters

LOTUS brings together two kinds of people: students who want to study but can’t afford it, and kind-hearted people who want to help them. Every rupee donated reaches a student who truly needs it. Donors are told which student their help is supporting. They can stay in touch with that student and follow how they are doing in their studies. This way, the student gets more than money. They also get someone who believes in them and cheers them on.

LOTUS is built on trust, openness and responsibility. The help a student receives is not just money. It is support for their education and for the life they are working to build. The goal of LOTUS is clear: no student should have to stop studying because of money, every talented student should get the chance they deserve, and every young dream should have room to grow.`,
    },
  },
  {
    slug: 'samudayik-vivah', category: 'community', image: `${S3}/projects/1789720268896-0fff235ddace.jpg`,
    mr: {
      title: 'सर्वधर्मीय सामुदायिक विवाह सोहळा | मंगलमय सहजीवनाची नवी सुरुवात', stat: '४८ सोहळे | ३,२२१ जोडपे विवाहबद्ध',
      summary: 'विवाह हा दोन व्यक्तींना आयुष्यभराच्या सहजीवनात बांधणारा आणि दोन कुटुंबांना नात्याच्या बंधात जोडणारा संस्कार आहे. मात्र, आर्थिक अडचणींमुळे अनेक कुटुंबांसाठी विवाहाचा खर्च मोठे आव्हान ठरतो. या कुटुंबांना आधार देण्यासाठी लोकमंगल फाऊंडेशनने ‘सर्वधर्मीय सामुदायिक विवाह सोहळा’ हा उपक्रम सुरू केला आहे.',
      body: `**उद्दिष्ट:** हुंडा प्रथा निर्मूलन, सर्वधर्मीय सामाजिक सलोखा आणि आर्थिकदृष्ट्या दुर्बल कुटुंबांना विवाहाचा संपूर्ण खर्च मोफत उपलब्ध करून देणे.

विवाह हा दोन व्यक्तींना आयुष्यभराच्या सहजीवनात बांधणारा आणि दोन कुटुंबांना नात्याच्या बंधात जोडणारा संस्कार आहे. मात्र, आर्थिक अडचणींमुळे अनेक कुटुंबांसाठी विवाहाचा खर्च मोठे आव्हान ठरतो. या कुटुंबांना आधार देण्यासाठी लोकमंगल फाऊंडेशनने ‘सर्वधर्मीय सामुदायिक विवाह सोहळा’ हा उपक्रम सुरू केला आहे.

या उपक्रमांतर्गत विवाहेच्छुक जोडप्यांना विवाहासाठी आवश्यक सुविधा विनामूल्य उपलब्ध करून दिल्या जातात. त्यामुळे कुटुंबांवरील आर्थिक भार कमी होतो आणि नवदांपत्याला आपल्या नव्या आयुष्याची सुरुवात सन्मानाने करता येते.

### उपक्रमाची वैशिष्ट्ये

- विविध जाती, धर्म आणि पंथांतील जोडप्यांचे विवाह त्यांच्या धार्मिक परंपरा व रीतिरिवाजांनुसार पार पाडले जातात.
- विवाहासाठी मंडप, व्यासपीठ, प्रकाशयोजना, ध्वनिव्यवस्था आणि इतर आवश्यक सुविधांची व्यवस्था केली जाते.
- प्रत्येक जोडप्याला विवाहाचे कपडे, दागिने आणि संसारोपयोगी साहित्य विनामूल्य दिले जाते.
- सोहळ्याच्या दिवशी सुमारे एक लाख पाहुण्यांसाठी भोजनाची व्यवस्था केली जाते.
- मागासवर्गीय समाजातील वधूंना समाजकल्याण विभागाचे ‘कन्यादान अनुदान’ मिळवण्यासाठी सहकार्य केले जाते.
- विवाहाचा अनावश्यक खर्च कमी करणे, हुंडा प्रथेला आळा घालणे आणि विविध धर्मांतील नागरिकांमध्ये सामाजिक सलोखा वाढवणे, हा या उपक्रमाचा मुख्य उद्देश आहे.

### आजवरची कामगिरी

- आतापर्यंत ४८ सामुदायिक विवाह सोहळे आयोजित करण्यात आले आहेत.
- या उपक्रमातून ३,२२१ जोडपी विवाहबद्ध झाली आहेत.
- यामध्ये २,५०८ हिंदू, ६८१ बौद्ध, २१ मुस्लिम, ७ जैन आणि ४ ख्रिस्ती जोडप्यांचा समावेश आहे.`,
    },
    en: {
      title: 'Sarvadharmiya Samudayik Vivah Sohala', stat: '48 Ceremonies | 3,221 Couples Married',
      summary: 'A wedding is one of life’s most special moments. It brings two people together for life and turns two families into one. But for many families, paying for a wedding is a big worry. To help them, Lokmangal Foundation started the Sarvadharmiya Samuhik Vivah Sohala, a community wedding ceremony open to all faiths.',
      body: `**Objective:** To help families in need hold weddings with dignity and no financial burden, stop the dowry system, and bring people of all faiths closer together.

A wedding is one of life’s most special moments. It brings two people together for life and turns two families into one. But for many families, paying for a wedding is a big worry. To help them, Lokmangal Foundation started the Sarvadharmiya Samuhik Vivah Sohala, a community wedding ceremony open to all faiths.

Here, couples get everything they need for their wedding at no cost. Families are spared the money stress, and every couple can start their new life with pride.

### One Ceremony, Many Faiths

- Couples from all castes, religions and communities get married here, each following their own customs and traditions.
- The Foundation takes care of the venue, stage, lights, sound and every other arrangement.
- Each couple gets wedding clothes, jewellery and basic household items for free.
- On the big day, food is served to nearly one lakh guests.
- Brides from backward class communities get help applying for the Kanyadan Anudan, a grant from the Social Welfare Department.
- Our aim is to cut down wasteful wedding spending, stop the dowry system, and bring people of all faiths closer together.

### Where New Journeys Begin

- 48 community wedding ceremonies held so far
- 3,221 couples have started their life together
- Among them are 2,508 Hindu, 681 Buddhist, 21 Muslim, 7 Jain and 4 Christian couples`,
    },
  },
  {
    slug: 'ek-muth-dhanya', category: 'food', image: `${S3}/projects/ek-muth-dhanya-cover.jpg`,
    mr: {
      title: 'एक मूठ धान्य योजना', stat: '७०+ शाळा | २५,०००+ विद्यार्थी',
      summary: 'लहान वयातच मुलांना अन्नदान आणि गरजू व्यक्तींना मदत करण्याची सवय लागावी, हा या उपक्रमाचा मुख्य उद्देश आहे. यासाठी शाळेतील विद्यार्थी आपल्या घरातून धान्य आणून ते जमा करतात आणि हे धान्य अन्नपूर्णा योजनेच्या माध्यमातून गरजू व निराधार ज्येष्ठ नागरिकांसाठी उपयोगात आणले जाते.',
      body: `**उद्दिष्ट:** लहान वयातच मुलांमध्ये अन्नदान, समाजसेवा आणि ज्येष्ठांप्रती संवेदनशीलतेची भावना निर्माण करणे.

लहान वयातच मुलांना अन्नदान आणि गरजू व्यक्तींना मदत करण्याची सवय लागावी, हा या उपक्रमाचा मुख्य उद्देश आहे. यासाठी शाळेतील विद्यार्थी आपल्या घरातून धान्य आणून ते जमा करतात आणि हे धान्य अन्नपूर्णा योजनेच्या माध्यमातून गरजू व निराधार ज्येष्ठ नागरिकांसाठी उपयोगात आणले जाते.

यासोबतच, आई-वडील आणि आजी-आजोबांची आयुष्यभर काळजी घेण्याची आणि त्यांना कधीही निराधार होऊ न देण्याची शपथ विद्यार्थ्यांना दिली जाते.

### उपक्रमाची व्याप्ती

- ७० हून अधिक शाळांमधील सुमारे २५,००० विद्यार्थ्यांपर्यंत हा उपक्रम पोहोचला आहे.
- विद्यार्थ्यांनी जमा केलेले धान्य गरजू व निराधार ज्येष्ठ नागरिकांच्या अन्नाची गरज भागवण्यासाठी वापरले जाते.
- विद्यार्थ्यांमध्ये अन्नदान, सामाजिक जबाबदारी आणि ज्येष्ठांप्रती आदराची भावना रुजवली जाते.`,
    },
    en: {
      title: 'Ek Mooth Dhanya Yojana', stat: '70+ Schools | 25,000+ Students',
      summary: 'This initiative has a simple goal: to teach children, while they are still young, the joy of sharing food and helping others. Students bring a little grain from home and collect it at school. This grain then goes to the Annapurna Yojana, where it becomes a meal for elderly people who are poor or have no one to look after them.',
      body: `**Objective:** To teach children kindness and respect for elders by encouraging them to share food with elderly people in need.

This initiative has a simple goal: to teach children, while they are still young, the joy of sharing food and helping others. Students bring a little grain from home and collect it at school. This grain then goes to the Annapurna Yojana, where it becomes a meal for elderly people who are poor or have no one to look after them.

Students also make a promise: to take care of their parents and grandparents for life, and never let them feel alone or helpless.

### Our Impact So Far

- Around 25,000 students have joined in
- More than 70 schools are part of this initiative
- Each handful of grain fills a hungry elder’s plate
- Every child learns the value of kindness and caring for elders`,
    },
  },
  {
    slug: 'sahitya-puraskar', category: 'culture', image: `${S3}/projects/1789719743620-a3348ae1c99e.jpg`,
    mr: {
      title: 'लोकमंगल साहित्य पुरस्कार', stat: '११ सोहळे | ५० साहित्यिक सन्मानित',
      summary: 'मराठी साहित्य क्षेत्रात उल्लेखनीय योगदान देणाऱ्या साहित्यिकांचा सन्मान करण्यासाठी लोकमंगल साहित्य पुरस्कार सुरू करण्यात आला. सन २०१५ पासून या पुरस्काराचे आयोजन केले जात आहे.',
      body: `**उद्दिष्ट:** साहित्यिकांचा सन्मान करून त्यांच्या साहित्यनिर्मितीला प्रोत्साहन देणे.

मराठी साहित्य क्षेत्रात उल्लेखनीय योगदान देणाऱ्या साहित्यिकांचा सन्मान करण्यासाठी लोकमंगल साहित्य पुरस्कार सुरू करण्यात आला. सन २०१५ पासून या पुरस्काराचे आयोजन केले जात आहे.

- ११ पुरस्कार सोहळ्यांत ५० साहित्यिकांचा सन्मान.
- साहित्यिकांना प्रोत्साहन आणि त्यांच्या योगदानाचा गौरव.`,
    },
    en: {
      title: 'Lokmangal Sahitya Award', stat: '11 Ceremonies | 50 Writers Honored',
      summary: 'Literature reflects our culture, values and way of life. The Lokmangal Sahitya Award was instituted in 2015 to honour writers who have made a notable contribution to the world of literature, and it has been presented every year since.',
      body: `**Objective:** To honour writers for their contribution to literature and encourage them to keep creating meaningful work.

Literature reflects our culture, values and way of life. The Lokmangal Sahitya Award was instituted in 2015 to honour writers who have made a notable contribution to the world of literature, and it has been presented every year since.

- 50 writers honoured across 11 award ceremonies
- Celebrates writers’ contributions and encourages them to keep creating`,
    },
  },
  {
    slug: 'shikshak-ratna-puraskar', category: 'education', image: `${S3}/projects/1789719974207-570423153ff1.jpg`,
    mr: {
      title: 'लोकमंगल शिक्षक रत्न पुरस्कार',
      summary: 'गुणवंत शिक्षकांच्या कार्याचा आणि शैक्षणिक क्षेत्रात उल्लेखनीय योगदान देणाऱ्या आदर्श शाळांचा गौरव करण्यासाठी लोकमंगल शिक्षक रत्न पुरस्कार सुरू करण्यात आला. सन २००७ पासून हा उपक्रम सातत्याने राबवला जात आहे.',
      body: `**उद्दिष्ट:** गुणवंत शिक्षकांच्या कार्याचा आणि शैक्षणिक क्षेत्रात उल्लेखनीय योगदान देणाऱ्या आदर्श शाळांचा गौरव करण्यासाठी लोकमंगल शिक्षक रत्न पुरस्कार सुरू करण्यात आला.

गुणवंत शिक्षकांच्या कार्याचा आणि शैक्षणिक क्षेत्रात उल्लेखनीय योगदान देणाऱ्या आदर्श शाळांचा गौरव करण्यासाठी लोकमंगल शिक्षक रत्न पुरस्कार सुरू करण्यात आला. सन २००७ पासून हा उपक्रम सातत्याने राबवला जात आहे.

या पुरस्कारांतर्गत १२ वर्षांहून अधिक काळ सेवा केलेल्या गुणवंत शिक्षकांचा तसेच उल्लेखनीय कार्य करणाऱ्या शाळांचा सन्मान केला जातो. प्राथमिक, माध्यमिक, कनिष्ठ आणि वरिष्ठ स्तरावरील शिक्षकांसह आदर्श शाळा आणि ए. पी. जे. अब्दुल कलाम पुरस्काराच्या माध्यमातूनही शैक्षणिक क्षेत्रातील उल्लेखनीय कार्याचा गौरव केला जातो.`,
    },
    en: {
      title: 'Lokmangal Shikshak Ratna Award',
      summary: 'Behind every successful student is a teacher who believed in them. The Lokmangal Shikshak Ratna Award was started to say thank you to such teachers, and to the schools that give children the best start in life. Since 2007, we have honoured them every single year.',
      body: `**Objective:** Behind every successful student is a teacher who believed in them. The Lokmangal Shikshak Ratna Award was started to say thank you to such teachers, and to the schools that give children the best start in life.

Behind every successful student is a teacher who believed in them. The Lokmangal Shikshak Ratna Award was started to say thank you to such teachers, and to the schools that give children the best start in life. Since 2007, we have honoured them every single year.

The award celebrates teachers who have given more than 12 years of their lives to teaching, and schools that have gone the extra mile for their students. Teachers from primary school all the way to college are recognised.

Model schools are honoured too, and the A. P. J. Abdul Kalam Award is given for outstanding work in education, in the spirit of the great teacher and leader himself.`,
    },
  },
  {
    slug: 'sanjivani-medical', category: 'health', image: `${S3}/projects/1789719315687-6a83ba558196.jpg`,
    mr: {
      title: 'लोकमंगल संजीवनी मेडिकल', stat: 'रक्तदाब व मधुमेह मोफत औषधोपचार',
      summary: 'लोकमंगल संजीवनी मेडिकलची सुरुवात १२ डिसेंबर २०२५ रोजी करण्यात आली. गरीब, गरजू आणि वंचित घटकांतील रुग्णांना आवश्यक औषधे विनामूल्य उपलब्ध करून देणे, हा या उपक्रमाचा मुख्य उद्देश आहे.',
      body: `**उद्दिष्ट:** गरीब व गरजू रुग्णांना आवश्यक औषधे विनामूल्य उपलब्ध करून देऊन त्यांचे उपचार नियमित सुरू ठेवण्यास मदत करणे.

लोकमंगल संजीवनी मेडिकलची सुरुवात १२ डिसेंबर २०२५ रोजी करण्यात आली. गरीब, गरजू आणि वंचित घटकांतील रुग्णांना आवश्यक औषधे विनामूल्य उपलब्ध करून देणे, हा या उपक्रमाचा मुख्य उद्देश आहे.

- रक्तदाब आणि मधुमेहासारख्या दीर्घकालीन आजारांनी ग्रस्त गरजू रुग्णांना दरमहा मोफत औषधे उपलब्ध करून दिली जातात.
- आर्थिक अडचणींमुळे उपचार थांबू नयेत आणि रुग्णांना नियमित औषधोपचार घेता यावेत, या उपक्रमाचा मुख्य उद्देश आहे.`,
    },
    en: {
      title: 'Lokmangal Sanjeevani Medical', stat: 'Free Chronic & BP/Diabetes Medicines',
      summary: 'Lokmangal Sanjeevani Medical was started on 12 December 2025 with one simple aim: to provide free medicines to poor and needy patients who cannot afford them.',
      body: `**Objective:** To provide free medicines to patients in need, so that no one has to stop treatment because of financial hardship.

Lokmangal Sanjeevani Medical was started on 12 December 2025 with one simple aim: to provide free medicines to poor and needy patients who cannot afford them.

Patients in need who suffer from long-term illnesses like blood pressure and diabetes receive free medicines every month. The main aim is to make sure no one has to stop treatment because of money, and every patient can take their medicines regularly.`,
    },
  },
  {
    slug: 'maha-arogya-shibir', category: 'health', image: `${S3}/projects/1789720677424-e2b5be1df4c7.jpg`,
    mr: {
      title: 'महाआरोग्य शिबीर', stat: '३५,००० रुग्ण | ३,६०० शस्त्रक्रिया',
      summary: 'सोलापूर आणि परिसरातील नागरिकांना मोफत आरोग्य तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा मिळावी, या उद्देशाने ३१ मे २०१६ रोजी महाआरोग्य शिबिराचे आयोजन करण्यात आले. या शिबिराचा सुमारे ३५,००० रुग्णांनी लाभ घेतला.',
      body: `**उद्दिष्ट:** सर्वसामान्य नागरिकांना मोफत आरोग्य तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा उपलब्ध करून देणे.

सोलापूर आणि परिसरातील नागरिकांना मोफत आरोग्य तपासणी, औषधोपचार आणि शस्त्रक्रियेची सुविधा मिळावी, या उद्देशाने ३१ मे २०१६ रोजी महाआरोग्य शिबिराचे आयोजन करण्यात आले. या शिबिराचा सुमारे ३५,००० रुग्णांनी लाभ घेतला.

- सुमारे ३,६०० रुग्णांवर मोफत शस्त्रक्रिया आणि २५० रुग्णांवर मोतीबिंदूच्या शस्त्रक्रिया करण्यात आल्या.
- तज्ज्ञ डॉक्टर, परिचारिका, औषधतज्ज्ञ आणि आरोग्य कर्मचाऱ्यांची सेवा उपलब्ध करून देण्यात आली.
- रुग्णांच्या ने-आणीसाठी रुग्णवाहिका आणि बसची व्यवस्था करण्यात आली.`,
    },
    en: {
      title: 'Maha Arogya Shibir (Mega Health Camp)', stat: '35,000 Patients | 3,600 Surgeries',
      summary: 'On 31 May 2016, Lokmangal Foundation organised a Maha Arogya Shibir so that people in and around Solapur could get free health check-ups, medicines and surgeries. Around 35,000 patients benefited from the camp.',
      body: `**Objective:** To provide free health check-ups, medicines and surgeries to people who cannot afford proper medical care.

On 31 May 2016, Lokmangal Foundation organised a Maha Arogya Shibir so that people in and around Solapur could get free health check-ups, medicines and surgeries. Around 35,000 patients benefited from the camp.

- About 3,600 patients received free surgeries, and 250 people had cataract operations that helped them see clearly again.
- Skilled doctors, nurses, pharmacists and health workers came together to care for every patient.
- Ambulances and buses brought patients to the camp and took them safely back home, so no one missed out on treatment because of distance.`,
    },
  },
  {
    slug: 'divyang-shibir', category: 'health', image: `${S3}/projects/1789726602355-85d910c76eee.jpg`,
    mr: {
      title: 'दिव्यांग शिबीर', stat: '३,२४४ लाभार्थी | ५ जिल्हे',
      summary: 'दिव्यांग बांधवांना दैनंदिन जीवनातील अडचणींवर मात करता यावी आणि त्यांना स्वावलंबी जीवन जगता यावे, या उद्देशाने या शिबिराचे आयोजन करण्यात आले. शिबिरात जयपूर फूट, कॅलिपर्स, कुबड्या, तीनचाकी सायकली, व्हीलचेअर, श्रवणयंत्रे आणि ऑर्थो शूज यांसारखी आवश्यक साधने विनामूल्य उपलब्ध करून देण्यात आली.',
      body: `**उद्दिष्ट:** दिव्यांग बांधवांना आत्मनिर्भर जीवन जगण्यासाठी आवश्यक ती सर्व आधुनिक उपकरणे विनामूल्य प्रदान करणे.

दिव्यांग बांधवांना दैनंदिन जीवनातील अडचणींवर मात करता यावी आणि त्यांना स्वावलंबी जीवन जगता यावे, या उद्देशाने या शिबिराचे आयोजन करण्यात आले. शिबिरात जयपूर फूट, कॅलिपर्स, कुबड्या, तीनचाकी सायकली, व्हीलचेअर, श्रवणयंत्रे आणि ऑर्थो शूज यांसारखी आवश्यक साधने विनामूल्य उपलब्ध करून देण्यात आली.

- **विविध जिल्ह्यांतील सहभाग:** सोलापूर, धाराशिव, लातूर, विजयपूर आणि सांगली येथील दिव्यांग बांधवांनी या शिबिराचा लाभ घेतला.
- **३,२४४ लाभार्थ्यांना मदत:** एकूण ३,२४४ लाभार्थ्यांना त्यांच्या गरजेनुसार विविध प्रकारची सहाय्यक साधने विनामूल्य वितरित करण्यात आली.`,
    },
    en: {
      title: 'Disability Support Camp', stat: '3,244 Beneficiaries | 5 Districts',
      summary: 'For a person with a disability, the right aid can change everything: the freedom to walk, to hear, to work and to live without depending on others. With this belief, Lokmangal Foundation organised this camp to help persons with disabilities overcome everyday challenges and lead independent lives. Essential aids such as Jaipur Foot artificial limbs, callipers, crutches, tricycles, wheelchairs, hearing aids and orthopaedic shoes were provided free of cost.',
      body: `For a person with a disability, the right aid can change everything: the freedom to walk, to hear, to work and to live without depending on others. With this belief, Lokmangal Foundation organised this camp to help persons with disabilities overcome everyday challenges and lead independent lives. Essential aids such as Jaipur Foot artificial limbs, callipers, crutches, tricycles, wheelchairs, hearing aids and orthopaedic shoes were provided free of cost.

- **Support across districts:** Persons with disabilities from Solapur, Dharashiv, Latur, Vijayapur and Sangli benefited from the camp.
- **3,244 lives made easier:** A total of 3,244 beneficiaries received free assistive aids suited to their individual needs.`,
    },
  },
  {
    slug: 'sarvarog-nidan-shibir', category: 'health', image: `${S3}/projects/1789726673682-4db924ef2ac1.jpg`,
    mr: {
      title: 'मोफत सर्वरोग निदान शिबीर', stat: 'मोफत तपासणी व मोतीबिंदू शस्त्रक्रिया',
      summary: 'झोपडपट्टी, कामगार व गरजू भागातील नागरिकांची विविध आजारांसाठी मोफत तपासणी करून त्यांना वेळेवर उपचार उपलब्ध करून दिले जातात. मोतीबिंदू, महिलांची रक्त तपासणी, कर्करोग, दंतविकार व हृदयविकाराची तपासणी केली जाते.',
      body: `**उद्दिष्ट:** वंचित वसाहतींमधील नागरिकांपर्यंत प्राथमिक व प्रगत आरोग्य तपासणी व उपचार पोहोचवणे.

झोपडपट्टी, कामगार व आर्थिकदृष्ट्या दुर्बल भागांतील नागरिकांना मोफत आरोग्य तपासणी आणि वेळेवर उपचारांची सुविधा उपलब्ध करून देणे, हा या उपक्रमाचा मुख्य उद्देश आहे. विविध आरोग्य शिबिरांच्या माध्यमातून गरजू नागरिकांपर्यंत आरोग्यसेवा पोहोचवून आजारांचे वेळीच निदान आणि उपचार करण्यावर भर दिला जातो.

### शिबिरातील आरोग्यसेवा

- **सर्वसाधारण आरोग्य तपासणी:** विविध आजारांचे वेळीच निदान करून आवश्यक उपचारांसाठी मार्गदर्शन केले जाते.
- **मोतीबिंदू तपासणी:** मोतीबिंदूचे निदान झालेल्या गरजू रुग्णांवर आवश्यकतेनुसार मोफत शस्त्रक्रिया केली जाते.
- **महिला व किशोरवयीन मुलींची तपासणी:** रक्तातील हिमोग्लोबिनचे प्रमाण तपासले जाते. रक्ताची कमतरता आढळल्यास आवश्यक औषधे दिली जातात.
- **विविध आजारांची तपासणी:** कर्करोग, दंतविकार, हृदयविकार आणि इतर आजारांसाठी तपासणीची सुविधा उपलब्ध करून दिली जाते.`,
    },
    en: {
      title: 'Free Multi-Disease Diagnostic Camp', stat: 'Free Diagnosis & Cataract Surgery',
      summary: 'The objective of this initiative is to provide free medical check-ups to residents of slum areas, labour settlements and other underserved communities and ensure that they receive timely treatment.',
      body: `Good health should not depend on where you live or how much you earn. This initiative brings free health check-ups and timely treatment to people living in slums, labour colonies and low-income areas. Through regular health camps, we reach people who often cannot visit a doctor, so that illnesses are found early and treated before they become serious.

### Health Services at the Camp

- **General health check-up:** Doctors check for illnesses at an early stage and guide patients on the right treatment.
- **Cataract screening:** Patients diagnosed with cataract receive free surgery when needed, giving them back the gift of clear sight.
- **Check-ups for women and adolescent girls:** Haemoglobin levels are tested, and those found to be anaemic receive the medicines they need.
- **Screening for other diseases:** Check-ups are offered for cancer, dental problems, heart disease and other conditions.`,
    },
  },
  {
    slug: 'raktadan-shibir', category: 'health', image: `${S3}/gallery/1791797939581-4c2bb6440ca6.jpg`,
    mr: {
      title: 'रक्तदान शिबीर', stat: 'सामाजिक जनजागृती व जीवनदान',
      summary: 'रक्ताची निर्मिती कृत्रिम पद्धतीने करता येत नसल्यामुळे गरजू रुग्णांसाठी रक्तदान अत्यंत महत्त्वाचे आहे. विविध दिवसांचे औचित्य साधून रक्तदान शिबिरांचे आयोजन केले जाते व रक्तदानाबाबत जनजागृती केली जाते.',
      body: `**उद्दिष्ट:** आपत्कालीन वेळी रक्ताचा तुटवडा भासू नये म्हणून नियमित रक्तदान शिबिरे आयोजित करून जनजागृती घडवणे.

रक्ताची कृत्रिम निर्मिती शक्य नसल्यामुळे गरजू रुग्णांसाठी रक्तदान अत्यंत महत्त्वाचे आहे. अपघात, शस्त्रक्रिया आणि विविध आजारांवरील उपचारांदरम्यान रुग्णांना रक्ताची गरज भासते. अशा वेळी वेळेवर रक्त उपलब्ध व्हावे, यासाठी लोकमंगल फाऊंडेशनतर्फे विविध महत्त्वाच्या दिवसांचे औचित्य साधून रक्तदान शिबिरांचे आयोजन केले जाते.

### उपक्रमाची वैशिष्ट्ये

- नागरिकांमध्ये रक्तदानाचे महत्त्व आणि त्याबाबत जागरूकता निर्माण करणे.
- गरजू रुग्णांसाठी वेळेवर रक्त उपलब्ध होण्यास मदत करणे.
- रक्तदानासाठी नागरिकांना प्रोत्साहित करून सामाजिक बांधिलकीची भावना दृढ करणे.`,
    },
    en: {
      title: 'Blood Donation Camp', stat: 'Voluntary Donation & Life Saving',
      summary: 'Since blood cannot be artificially manufactured, blood donation plays a vital role in supporting patients in need. Donating blood to someone in need is a direct way of extending support during their treatment.',
      body: `Every drop of blood can give someone another chance at life. Blood cannot be made in any factory or lab. It can only come from people who choose to give. Whether it’s after an accident, during a surgery or while fighting an illness, patients often depend on donated blood to survive. To make sure no patient waits for blood when every minute counts, Lokmangal Foundation organises blood donation camps on special days throughout the year.

### Key Features

- **Spreading awareness:** Helping people understand how one donation can save lives.
- **Blood when it matters most:** Making sure patients in need get blood on time.
- **Building a giving community:** Encouraging people to donate blood and stand by one another as a society.`,
    },
  },
  {
    slug: 'shaley-sahitya-vatap', category: 'education', image: `${S3}/projects/school-supplies-notebook-cover.jpg`,
    mr: {
      title: 'विद्यार्थ्यांना शालेय साहित्य व वही वाटप', stat: 'जिल्हा परिषद शाळा व एकल पालक मुले',
      summary: 'जिल्हा परिषद शाळांमध्ये शिक्षण घेणाऱ्या गरीब, गरजू आणि एकल पालकांच्या मुलांना शिक्षणासाठी आवश्यक साहित्य उपलब्ध करून दिले जाते. वह्या तसेच इतर शालेय साहित्य मोफत पुरवले जाते.',
      body: `**उद्दिष्ट:** आर्थिक अडचणींमुळे गरजू मुलांचे शिक्षण थांबू नये म्हणून शैक्षणिक साहित्याची मदत करणे.

जिल्हा परिषद शाळांमध्ये शिक्षण घेणाऱ्या आर्थिकदृष्ट्या दुर्बल, गरजू आणि एकल पालकांच्या मुलांना शिक्षणासाठी आवश्यक साहित्य उपलब्ध करून देणे, हा या उपक्रमाचा मुख्य उद्देश आहे. आर्थिक अडचणींमुळे विद्यार्थ्यांचे शिक्षण थांबू नये आणि त्यांना शिक्षणाच्या समान संधी मिळाव्यात, यासाठी फाऊंडेशनतर्फे मदत केली जाते.

### उपक्रमाची वैशिष्ट्ये

- गरजू विद्यार्थ्यांना वह्या आणि इतर आवश्यक शालेय साहित्य विनामूल्य दिले जाते.
- आर्थिक अडचणींमुळे विद्यार्थ्यांच्या शिक्षणात अडथळे निर्माण होऊ नयेत, यासाठी सहकार्य केले जाते.
- विद्यार्थ्यांना शिक्षणासाठी प्रोत्साहन देऊन त्यांचा शैक्षणिक प्रवास अधिक सुलभ करण्याचा प्रयत्न केला जातो.`,
    },
    en: {
      title: 'Distribution of School Supplies and Notebooks to Students', stat: 'ZP Schools & Single Parent Kids',
      summary: 'This initiative is undertaken to provide educational materials to children from poor and needy families, as well as children of single parents studying in Zilla Parishad schools.',
      body: `A notebook, a pen, a school bag: small things for many, but for some children, they decide whether they can go to school at all. This initiative supports children in Zilla Parishad schools who come from poor families or are raised by a single parent, by giving them the supplies they need to learn. With the Foundation’s help, no child has to fall behind because of money, and every child gets the same chance to dream, learn and grow.

### Key Features

- **Everything they need to learn:** Children receive notebooks and other school supplies free of cost.
- **Learning without worry:** Families get support so that money troubles never keep a child away from school.
- **Confidence to keep going:** With the right tools in hand, children feel encouraged to study and build a better future.`,
    },
  },
  {
    slug: 'balsanskar-shibir', category: 'culture', image: `${S3}/projects/1789720490360-5ed4c261f926.jpg`,
    mr: {
      title: 'बालसंस्कार शिबीर', stat: 'संस्कृती, योग व मूल्य संवर्धन',
      summary: 'नव्या पिढीमध्ये भारतीय संस्कृतीची ओळख, चांगले संस्कार, शिस्त आणि सकारात्मक विचार रुजावेत, या उद्देशाने निवासी बालसंस्कार शिबिरांचे आयोजन केले जाते. विविध उपक्रमांच्या माध्यमातून मुलांच्या शारीरिक, मानसिक आणि नैतिक विकासाला चालना दिली जाते.',
      body: `**उद्दिष्ट:** नवीन पिढीमध्ये भारतीय संस्कृतीची ओळख, चांगले संस्कार, शिस्त आणि सकारात्मक मूल्ये रुजवून मुलांच्या सर्वांगीण विकासाला चालना देणे.

नव्या पिढीमध्ये भारतीय संस्कृतीची ओळख, चांगले संस्कार, शिस्त आणि सकारात्मक विचार रुजावेत, या उद्देशाने निवासी बालसंस्कार शिबिरांचे आयोजन केले जाते. विविध उपक्रमांच्या माध्यमातून मुलांच्या शारीरिक, मानसिक आणि नैतिक विकासाला चालना दिली जाते.

### शिबिरातील उपक्रम

- **भक्तीपरंपरेची ओळख:** भजन, कीर्तन आणि टाळ वादनाच्या माध्यमातून मुलांना भारतीय भक्तीपरंपरेची माहिती दिली जाते.
- **शारीरिक व मानसिक विकास:** लेझीम, योग, प्राणायाम आणि ध्यान यांसारख्या उपक्रमांतून शारीरिक तंदुरुस्ती व मनाची एकाग्रता वाढवण्याचा प्रयत्न केला जातो.
- **आध्यात्मिक ज्ञान:** भगवद्गीतेतील विचार आणि शिकवणींच्या माध्यमातून जीवनमूल्यांची ओळख करून दिली जाते.
- **शिस्त आणि चांगल्या सवयी:** नियमित दिनचर्या, स्वावलंबन आणि शिस्तीचे महत्त्व मुलांना समजावून सांगितले जाते.
- **व्यक्तिमत्त्व विकास:** मुलांमध्ये आत्मविश्वास, सकारात्मक दृष्टिकोन, नैतिक मूल्ये आणि भारतीय संस्कृतीविषयी आदर निर्माण करणे हा या शिबिराचा मुख्य उद्देश आहे.`,
    },
    en: {
      title: 'Child Values and Development Camp', stat: 'Cultural Heritage & Yoga Training',
      summary: 'Childhood is when the roots of character are planted. What a child learns today shapes the person they become tomorrow. These residential camps give children a chance to step away from screens and daily routines, and connect with Indian culture, good values and a disciplined way of life. Through joyful activities and shared experiences, children grow stronger in body, calmer in mind and richer in spirit.',
      body: `**Objective:** To help children grow into confident, disciplined and value-driven individuals who stay connected to Indian culture.

Childhood is when the roots of character are planted. What a child learns today shapes the person they become tomorrow. These residential camps give children a chance to step away from screens and daily routines, and connect with Indian culture, good values and a disciplined way of life. Through joyful activities and shared experiences, children grow stronger in body, calmer in mind and richer in spirit.

### Activities at the Camp

- **The joy of devotion:** Singing bhajans and kirtans and playing the taal, children experience the beauty of India’s bhakti tradition.
- **Strength and focus:** Lezim, yoga, pranayama and meditation keep their bodies active and their minds calm and focused.
- **Lessons for life:** Simple teachings from the Bhagavad Gita help children understand values like honesty, duty and kindness.
- **Habits that last:** A disciplined daily routine teaches children to be responsible, independent and organised.
- **Growing into confident individuals:** Children leave the camp more confident, positive and proud of their culture, ready to carry these values into their everyday lives.`,
    },
  },
  {
    slug: 'killa-bandhani-spardha', category: 'culture', image: `${S3}/projects/killa-bandhani-spardha-cover.jpg`,
    mr: {
      title: 'किल्ला बांधणी स्पर्धा', stat: 'ऐतिहासिक संस्कृती व परंपरा जतन',
      summary: 'दिवाळीत मुलांनी घरी किल्ले बांधण्याची जुनी परंपरा पुढील पिढीपर्यंत पोहोचावी आणि मुलांना इतिहासाची ओळख व्हावी यासाठी शाळांच्या माध्यमातून भव्य किल्ला बांधणी स्पर्धा आयोजित केली जाते.',
      body: `**उद्दिष्ट:** छत्रपती शिवाजी महाराजांचा जाज्वल्य इतिहास आणि किल्ल्यांची महती शालेय विद्यार्थ्यांपर्यंत पोहोचवणे.

सोलापूर जिल्ह्यात दिवाळीत किल्ले बांधण्याची जुनी परंपरा आहे. ही परंपरा जतन व्हावी आणि मुलांना आपल्या इतिहासाची ओळख व्हावी, या उद्देशाने शाळांमध्ये किल्ला बांधणी स्पर्धेचे आयोजन केले जाते.

### उपक्रमाची वैशिष्ट्ये

- शाळांमधील विद्यार्थ्यांचे गट तयार करून शिक्षकांच्या मार्गदर्शनाखाली किल्ले बांधले जातात.
- विविध गड-किल्ल्यांच्या प्रतिकृती तयार करताना विद्यार्थ्यांना त्यांच्या इतिहासाची आणि ऐतिहासिक महत्त्वाची माहिती मिळते.
- किल्ले बांधण्याच्या माध्यमातून विद्यार्थ्यांच्या कल्पकतेला वाव मिळतो आणि सांघिक कार्याची भावना वाढीस लागते.
- महाराष्ट्राच्या ऐतिहासिक वारशाविषयी विद्यार्थ्यांमध्ये जिज्ञासा आणि आदर निर्माण होण्यास मदत होते.`,
    },
    en: {
      title: 'Killa Bandhani Spardha (Fort-Building Competition)', stat: 'Historical Pride & Fort Models',
      summary: 'In Solapur district, building forts at home during Diwali is a long-standing tradition among children. To preserve this tradition for future generations and help children develop an understanding of their history, a Fort-Building Competition is organised.',
      body: `The forts of Maharashtra stand as proud reminders of courage and history. In Solapur district, building forts during Diwali is an old and much-loved tradition. To keep this tradition alive and help children connect with their glorious past, fort-building competitions are organised in schools.

### Key Features

- **Learning by building:** Students form teams and build forts under the guidance of their teachers.
- **History in their hands:** As they recreate famous forts, students discover the stories and historical importance behind each one.
- **Imagination and teamwork:** Building a fort brings out children’s creativity and teaches them how to work together towards a shared goal.
- **Respect for our heritage:** Children grow curious about Maharashtra’s history and develop a deep sense of pride and respect for it.`,
    },
  },
  {
    slug: 'rojgar-melava', category: 'women', image: `${S3}/gallery/1791798023743-7adf68585a01.jpg`,
    mr: {
      title: 'रोजगार मेळावा', stat: '२,०००+ तरुण | ५ प्रमुख शहरे',
      summary: 'तरुणांना त्यांच्या शैक्षणिक पात्रतेनुसार आणि कौशल्यानुसार रोजगाराच्या संधी उपलब्ध करून देणे, तसेच नोकरीच्या शोधात असलेल्या उमेदवारांना कंपन्यांशी जोडणे, हा या रोजगार मेळाव्याचा मुख्य उद्देश होता.',
      body: `**उद्दिष्ट:** ग्रामीण व निमशहरी तरुणांना प्रतिष्ठित उद्योगांमध्ये थेट रोजगाराच्या संधी उपलब्ध करून देणे.

तरुणांना त्यांच्या शैक्षणिक पात्रतेनुसार आणि कौशल्यानुसार रोजगाराच्या संधी उपलब्ध करून देणे, तसेच नोकरीच्या शोधात असलेल्या उमेदवारांना कंपन्यांशी जोडणे, हा या रोजगार मेळाव्याचा मुख्य उद्देश होता.

### मेळाव्याची वैशिष्ट्ये

- **संयुक्त आयोजन:** ३१ जानेवारी २०२४ रोजी शासकीय औद्योगिक प्रशिक्षण संस्थेत कौशल्य विकास, रोजगार व उद्योजकता विभाग आणि लोकमंगल फाऊंडेशन यांच्या संयुक्त विद्यमाने रोजगार मेळावा आयोजित करण्यात आला.
- **विविध कंपन्यांचा सहभाग:** सोलापूरसह पुणे, कोल्हापूर, अहिल्यानगर आणि छत्रपती संभाजीनगर येथील कंपन्यांनी या मेळाव्यात सहभाग घेतला.
- **तरुणांचा सहभाग:** या मेळाव्यात सुमारे २,००० तरुण सहभागी झाले.
- **रोजगारासाठी व्यासपीठ:** तरुणांना विविध कंपन्यांशी थेट संपर्क साधण्याची आणि रोजगाराच्या संधी मिळवण्याची संधी या मेळाव्याच्या माध्यमातून उपलब्ध झाली.`,
    },
    en: {
      title: 'Employment Fair', stat: '2,000+ Youth | Multi-City Employers',
      summary: 'Finding the right job can change the course of a young person’s life. This job fair was organised to connect young people with jobs that match their education and skills, and to bring job seekers face to face with companies looking for talent.',
      body: `Finding the right job can change the course of a young person’s life. This job fair was organised to connect young people with jobs that match their education and skills, and to bring job seekers face to face with companies looking for talent.

### Highlights of the Job Fair

- **Jointly organised:** Held on 31 January 2024 at the Government Industrial Training Institute (ITI), the fair was jointly organised by the Skill Development, Employment and Entrepreneurship Department and Lokmangal Foundation.
- **Companies from across Maharashtra:** Companies from Solapur, Pune, Kolhapur, Ahilyanagar and Chhatrapati Sambhajinagar took part.
- **Youth participation:** Around 2,000 young people attended the fair.
- **A platform for jobs:** Young people got the chance to meet companies directly and explore job opportunities that suit them.`,
    },
  },
  {
    slug: 'mahila-din', category: 'women', image: `${S3}/projects/1791805557051-9f9e3eee3cd5.jpeg`,
    mr: {
      title: 'महिला दिन', stat: 'कर्तबगार महिला सन्मान व प्रेरणा',
      summary: 'जागतिक महिला दिन आणि अन्नपूर्णा योजनेच्या वर्धापन दिनाचे औचित्य साधून विविध क्षेत्रांत उल्लेखनीय कार्य करणाऱ्या कर्तृत्ववान महिलांचा सन्मान केला जातो. महिलांच्या कार्याची दखल घेऊन त्यांना प्रोत्साहन देणे, त्यांच्या अनुभवांचा इतर महिलांना लाभ करून देणे आणि त्यांच्यामध्ये आत्मविश्वास निर्माण करणे, हा या उपक्रमाचा मुख्य उद्देश आहे.',
      body: `**उद्दिष्ट:** कर्तृत्ववान महिलांचा सन्मान करून महिलांमध्ये आत्मविश्वास, नेतृत्वगुण आणि प्रगतीची प्रेरणा निर्माण करणे.

जागतिक महिला दिन आणि अन्नपूर्णा योजनेच्या वर्धापन दिनाचे औचित्य साधून विविध क्षेत्रांत उल्लेखनीय कार्य करणाऱ्या कर्तृत्ववान महिलांचा सन्मान केला जातो. महिलांच्या कार्याची दखल घेऊन त्यांना प्रोत्साहन देणे, त्यांच्या अनुभवांचा इतर महिलांना लाभ करून देणे आणि त्यांच्यामध्ये आत्मविश्वास निर्माण करणे, हा या उपक्रमाचा मुख्य उद्देश आहे.

### उपक्रमाची वैशिष्ट्ये

- **कर्तृत्वाचा सन्मान:** विविध क्षेत्रांत उल्लेखनीय कार्य करणाऱ्या कर्तृत्ववान महिलांचा सन्मान करून त्यांच्या कार्याचा गौरव केला जातो.
- **विविध उपक्रमांचे आयोजन:** महिलांसाठी सांस्कृतिक खेळ, मनोरंजनात्मक उपक्रम आणि विविध स्पर्धांचे आयोजन करून त्यांचा उत्स्फूर्त सहभाग वाढवला जातो.
- **अनुभवांची देवाणघेवाण:** यशस्वी महिलांचे अनुभव, विचार आणि मार्गदर्शन इतर महिलांपर्यंत पोहोचवले जाते.
- **प्रोत्साहन आणि आत्मविश्वास:** महिलांना आपल्या क्षमतांची जाणीव होऊन आत्मविश्वासाने पुढे जाण्यास प्रेरणा मिळावी, यासाठी असे उपक्रम आयोजित केले जातात.`,
    },
    en: {
      title: "Women's Day", stat: 'Honoring Women Trailblazers',
      summary: 'On 8 March, we celebrate two things close to our heart: International Women’s Day and the anniversary of the Lokmangal Annapurna Yojana. On this special day, we honour women who have done remarkable work in different fields. The aim is to recognise their achievements, share their journeys with other women, and help every woman believe in her own strength.',
      body: `**Objective:** To honour women achievers and inspire other women to believe in themselves and move forward with confidence.

On 8 March, we celebrate two things close to our heart: International Women’s Day and the anniversary of the Lokmangal Annapurna Yojana. On this special day, we honour women who have done remarkable work in different fields. The aim is to recognise their achievements, share their journeys with other women, and help every woman believe in her own strength.

### Key Features

- **Celebrating achievement:** Women who have made a real difference in their fields are honoured for their work and dedication.
- **A day full of joy:** Cultural games, fun activities and competitions bring women together and encourage them to take part with enthusiasm.
- **Sharing stories that inspire:** Successful women share their experiences, ideas and advice, so others can learn from their journeys.
- **Building confidence:** These events help women recognise their own abilities and move forward in life with confidence.`,
    },
  },
  {
    slug: 'bhajan-bharud-spardha', category: 'culture', image: `${S3}/projects/bhajan-bharud-spardha-cover.jpg`,
    mr: {
      title: 'भजन व भारूड स्पर्धा', stat: 'लोककला जतन व संगीत साहित्य वाटप',
      summary: 'धार्मिक आणि सांस्कृतिक लोकपरंपरांचे जतन व संवर्धन करण्यासाठी दरवर्षी भजन-भारूड स्पर्धेचे आयोजन केले जाते. भजन व कीर्तन मंडळांना मृदंग, तबला, पेटी, हार्मोनियम यांसारखे साहित्यही उपलब्ध करून दिले जाते.',
      body: `**उद्दिष्ट:** भजन, भारूड आणि कीर्तन या पारंपरिक लोककलांचे जतन व संवर्धन करून त्यांचा वारसा नव्या पिढीपर्यंत पोहोचवणे आणि कलाकारांना प्रोत्साहन देणे.

धार्मिक आणि सांस्कृतिक परंपरांचे जतन व संवर्धन व्हावे, तसेच नव्या पिढीला महाराष्ट्राच्या समृद्ध लोककलेची ओळख व्हावी, या उद्देशाने लोकमंगल फाऊंडेशनतर्फे दरवर्षी भजन-भारूड स्पर्धेचे आयोजन केले जाते. या माध्यमातून पारंपरिक कलांना प्रोत्साहन देऊन त्यांचा वारसा पुढील पिढीपर्यंत पोहोचवण्याचा प्रयत्न केला जातो.

### उपक्रमाची वैशिष्ट्ये

- **लोककलांना प्रोत्साहन:** भजन, भारूड आणि कीर्तन सादर करणाऱ्या मंडळांना आपली कला सादर करण्यासाठी व्यासपीठ उपलब्ध करून दिले जाते.
- **परंपरांचे जतन:** भजन, भारूड आणि कीर्तन या लोकपरंपरांची ओळख नव्या पिढीला करून दिली जाते.
- **वाद्यसाहित्याची मदत:** भजन-कीर्तन मंडळांना मृदंग, तबला, पेटी आणि हार्मोनियम यांसारखी वाद्ये उपलब्ध करून दिली जातात.
- **सांस्कृतिक वारशाचे संवर्धन:** पारंपरिक लोककला आणि धार्मिक-सांस्कृतिक परंपरा जिवंत ठेवून त्यांचा प्रसार करण्यास हातभार लावला जातो.`,
    },
    en: {
      title: 'Bhajan-Bharud Competition', stat: 'Folk Traditions & Musical Instruments',
      summary: 'A Bhajan and Bharud Competition is organised once a year to preserve and promote religious and cultural traditions.',
      body: `**Objective:** To preserve Maharashtra’s folk arts and pass the tradition of bhajan, bharud and kirtan on to the next generation.

Maharashtra’s folk arts carry the voice of its saints, its people and its centuries-old traditions. To keep these religious and cultural traditions alive, and to introduce the younger generation to this rich heritage, Lokmangal Foundation holds a Bhajan-Bharud competition every year. Through it, we encourage traditional artists and help pass their art on to the next generation.

### Key Features

- **A stage for folk artists:** Bhajan, bharud and kirtan groups get a platform to perform and share their art with a wider audience.
- **Keeping traditions alive:** The younger generation is introduced to the beauty and meaning of bhajan, bharud and kirtan.
- **Support with instruments:** Bhajan and kirtan groups are given instruments such as the mridang, tabla and harmonium.
- **Protecting our heritage:** The competition helps preserve and spread Maharashtra’s folk arts and religious and cultural traditions.`,
    },
  },
  {
    slug: 'yog-din', category: 'health', image: `${S3}/projects/1791798316306-894c23f307a9.jpg`,
    mr: {
      title: 'आंतरराष्ट्रीय योग दिन', stat: '२१ जून | आरोग्य व मनःशांती',
      summary: 'दरवर्षी २१ जून रोजी आंतरराष्ट्रीय योग दिनानिमित्त शाळा, महाविद्यालये व सामाजिक केंद्रांमध्ये योग शिक्षकांच्या मार्गदर्शनाखाली प्रशिक्षण दिले जाते. शारीरिक व मानसिक आरोग्याबाबत जनजागृती केली जाते.',
      body: `**उद्दिष्ट:** योगाविषयी जनजागृती करून नागरिकांना नियमित योगाभ्यासासाठी प्रोत्साहित करणे आणि त्यांचे शारीरिक व मानसिक आरोग्य जपण्यास मदत करणे.

दरवर्षी २१ जून रोजी आंतरराष्ट्रीय योग दिनानिमित्त लोकमंगल फाऊंडेशनतर्फे योगाचे महत्त्व पटवून देण्यासाठी विविध उपक्रम राबवले जातात. शाळा, महाविद्यालये आणि इतर ठिकाणी योगशिक्षकांच्या मार्गदर्शनाखाली योगाभ्यासाचे प्रशिक्षण दिले जाते.

### उपक्रमाची वैशिष्ट्ये

- **योगाविषयी जनजागृती:** नागरिकांना योगाचे महत्त्व आणि दैनंदिन जीवनातील त्याचे फायदे समजावून सांगितले जातात.
- **योगाचे प्रशिक्षण:** योगशिक्षकांच्या मार्गदर्शनाखाली विविध योगासने आणि प्राणायामांचा सराव करून घेतला जातो.
- **आरोग्यविषयक जागरूकता:** योगाच्या माध्यमातून शारीरिक आणि मानसिक आरोग्य जपण्याचे महत्त्व पटवून दिले जाते.
- **नियमित योगाभ्यासाला प्रोत्साहन:** नागरिकांनी दैनंदिन जीवनात योगाचा समावेश करून निरोगी जीवनशैली अंगीकारावी, यासाठी प्रोत्साहित केले जाते.`,
    },
    en: {
      title: 'Yoga Day', stat: 'June 21 | Health & Peace of Mind',
      summary: 'Yoga is India’s gift to the world: a simple practice that brings strength to the body, peace to the mind and balance to everyday life. Every year on 21 June, International Yoga Day, Lokmangal Foundation brings people together to experience its benefits. In schools, colleges and public spaces, experienced yoga teachers guide participants through the practice, step by step.',
      body: `**Objective:** To help people understand the power of yoga and make it a lifelong habit for a healthier body and a calmer mind.

Yoga is India’s gift to the world: a simple practice that brings strength to the body, peace to the mind and balance to everyday life. Every year on 21 June, International Yoga Day, Lokmangal Foundation brings people together to experience its benefits. In schools, colleges and public spaces, experienced yoga teachers guide participants through the practice, step by step.

### Key Features

- **Understanding yoga:** People learn how yoga can reduce stress, improve health and bring more energy to daily life.
- **Learning from experts:** Experienced yoga teachers guide participants through asanas and pranayama, helping them practise the right way.
- **Wellness for body and mind:** Participants discover how a few minutes of yoga each day can keep both the body and mind healthy.
- **A habit for life:** Everyone is encouraged to make yoga a part of their daily routine, not just a one-day event.`,
    },
  },
  {
    slug: 'ekal-mahila-upakram', category: 'women', image: `${S3}/projects/ekal-mahila-upakram-cover.jpg`,
    mr: {
      title: 'एकल महिला उपक्रम', stat: 'आर्थिक, सामाजिक व रोजगार आधार',
      summary: 'पतीचे निधन झालेल्या, घटस्फोटित, पतीपासून विभक्त झालेल्या किंवा निराधार महिलांना स्वावलंबी जीवन जगता यावे, यासाठी लोकमंगल फाऊंडेशनतर्फे आर्थिक व सामाजिक आधार दिला जातो. महिलांच्या शैक्षणिक पात्रतेनुसार रोजगाराच्या संधी मिळवून देण्यासोबतच त्यांच्या मुलांच्या शिक्षणासाठी आर्थिक मदत आणि आवश्यक शालेय साहित्य उपलब्ध करून दिले जाते.',
      body: `**उद्दिष्ट:** निराधार महिलांना आर्थिक व सामाजिक आधार देऊन त्यांना स्वावलंबी बनवणे आणि त्यांच्या मुलांच्या शिक्षणासह कुटुंबाच्या सर्वांगीण प्रगतीसाठी सहकार्य करणे.

पतीचे निधन झालेल्या, घटस्फोटित, पतीपासून विभक्त झालेल्या किंवा निराधार महिलांना स्वावलंबी जीवन जगता यावे, यासाठी लोकमंगल फाऊंडेशनतर्फे आर्थिक व सामाजिक आधार दिला जातो. महिलांच्या शैक्षणिक पात्रतेनुसार रोजगाराच्या संधी मिळवून देण्यासोबतच त्यांच्या मुलांच्या शिक्षणासाठी आर्थिक मदत आणि आवश्यक शालेय साहित्य उपलब्ध करून दिले जाते.

### उपक्रमाची वैशिष्ट्ये

- **रोजगारासाठी सहकार्य:** महिलांना त्यांच्या शैक्षणिक पात्रतेनुसार रोजगाराच्या संधी मिळवून देण्यासाठी मदत केली जाते.
- **मुलांच्या शिक्षणाला आधार:** मुलांच्या शिक्षणासाठी आर्थिक मदत आणि आवश्यक शालेय साहित्य उपलब्ध करून दिले जाते.
- **रोजगार व विवाहासाठी मदत:** मुलांना रोजगाराच्या संधी मिळवून देण्यासाठी तसेच मुला-मुलींच्या विवाहासाठी आवश्यक सहकार्य केले जाते.
- **आर्थिक गरजांसाठी मार्गदर्शन:** महिलांना व्यवसाय सुरू करण्यासाठी किंवा घरासाठी कर्ज मिळवणे आणि संबंधित शासकीय योजनांचा लाभ घेणे यासाठी मार्गदर्शन केले जाते.
- **स्वावलंबनाला प्रोत्साहन:** महिलांना स्वतःच्या आणि कुटुंबाच्या गरजा पूर्ण करता याव्यात, आत्मविश्वासाने जीवन जगता यावे आणि आर्थिकदृष्ट्या स्वावलंबी होता यावे, यासाठी सहकार्य केले जाते.`,
    },
    en: {
      title: 'Support Initiative for Single Women', stat: 'Economic & Social Empowerment',
      summary: 'Losing a husband, going through a divorce or separation, or being left without anyone to depend on can turn a woman’s world upside down. In these difficult moments, Lokmangal Foundation stands by her side. We offer financial and social support to help her rebuild her life with independence and dignity. We help her find work that matches her education, and we support her children’s schooling with financial aid and the school supplies they need.',
      body: `**Objective:** To help women who are left without support rebuild their lives with confidence, dignity and financial independence.

Losing a husband, going through a divorce or separation, or being left without anyone to depend on can turn a woman’s world upside down. In these difficult moments, Lokmangal Foundation stands by her side. We offer financial and social support to help her rebuild her life with independence and dignity. We help her find work that matches her education, and we support her children’s schooling with financial aid and the school supplies they need.

### Key Features

- **A path to work:** Women receive help in finding jobs that suit their education and abilities.
- **A future for their children:** Children receive financial support and school supplies, so their education continues without interruption.
- **Support at every stage:** When the children grow up, the Foundation helps them find work and supports the family with their sons’ and daughters’ weddings.
- **Guidance on loans and schemes:** Women are guided on how to get loans to start a business or build a home, and how to benefit from government schemes.
- **Standing on their own feet:** Every step is aimed at helping women meet their family’s needs, live with confidence and become financially independent.`,
    },
  },
  {
    slug: 'vrukshaaropan', category: 'culture', image: `${S3}/gallery/1791798117228-0e99d3d88fd9.jpg`,
    mr: {
      title: 'वृक्षारोपण व वृक्षसंवर्धन उपक्रम', stat: 'पर्यावरण रक्षण व वृक्ष संवर्धन',
      summary: 'वृक्षारोपण आणि वृक्षसंवर्धनाला प्रोत्साहन देऊन पर्यावरणाचे रक्षण करणे आणि नागरिकांमध्ये पर्यावरणाप्रती जबाबदारीची जाणीव निर्माण करणे.',
      body: `**उद्दिष्ट:** पर्यावरणाचे रक्षण करणे आणि हरित परिसर निर्माण करणे, या उद्देशाने शाळा परिसरात तसेच लोकवस्तींमध्ये वृक्षारोपण केले जाते. झाडे लावण्याबरोबरच त्यांचे नियमित संगोपन करणे आणि त्यांची योग्य वाढ होईपर्यंत काळजी घेणे महत्त्वाचे आहे, हा संदेश या उपक्रमातून दिला जातो.

पर्यावरणाचे रक्षण करणे आणि हरित परिसर निर्माण करणे, या उद्देशाने शाळा परिसरात तसेच लोकवस्तींमध्ये वृक्षारोपण केले जाते. झाडे लावण्याबरोबरच त्यांचे नियमित संगोपन करणे आणि त्यांची योग्य वाढ होईपर्यंत काळजी घेणे महत्त्वाचे आहे, हा संदेश या उपक्रमातून दिला जातो.

### उपक्रमाची वैशिष्ट्ये

- **वृक्षारोपण:** शाळा परिसरात आणि लोकवस्तींमध्ये झाडे लावून हरित क्षेत्र वाढवण्याचा प्रयत्न केला जातो.
- **वृक्षसंवर्धन:** लावलेल्या झाडांना नियमित पाणी देणे आणि त्यांची योग्य काळजी घेणे यावर भर दिला जातो.
- **विद्यार्थ्यांमध्ये पर्यावरणाची जाणीव:** मुलांमध्ये लहानपणापासून झाडांविषयी प्रेम आणि पर्यावरणाच्या रक्षणाची जबाबदारी रुजवली जाते.
- **विशेष प्रसंगी वृक्षारोपण:** वाढदिवस आणि इतर विशेष प्रसंगी किमान एक झाड लावून त्याचे संगोपन करण्याचे आवाहन केले जाते.`,
    },
    en: {
      title: 'Tree Plantation Drive', stat: 'Green Cover & Eco-Preservation',
      summary: 'A tree planted today gives shade, clean air and life for years to come. To protect the environment and create greener surroundings, Lokmangal Foundation plants trees in school campuses and residential areas. But planting is only the first step. Through this initiative, we also spread an important message: every tree needs regular care until it grows strong enough to stand on its own.',
      body: `**Objective:** To create a greener environment by planting trees and nurturing them until they grow strong.

A tree planted today gives shade, clean air and life for years to come. To protect the environment and create greener surroundings, Lokmangal Foundation plants trees in school campuses and residential areas. But planting is only the first step. Through this initiative, we also spread an important message: every tree needs regular care until it grows strong enough to stand on its own.

### Key Features

- **Planting trees:** Trees are planted in school campuses and neighbourhoods to bring more greenery to our surroundings.
- **Caring for every sapling:** Special attention is given to watering and looking after each tree so it grows healthy and strong.
- **Raising young nature lovers:** Children learn, from an early age, to love trees and take responsibility for protecting the environment.
- **A tree for every celebration:** People are encouraged to plant at least one tree on birthdays and other special occasions, and to care for it as it grows.`,
    },
  },
  {
    slug: 'dandiya-utsav', category: 'culture', image: `${S3}/projects/1789726853668-faa6ef92377f.jpg`,
    mr: {
      title: 'दांडिया आणि गरबा स्पर्धा', stat: 'नवरात्रोत्सव | महिला कला व्यासपीठ',
      summary: 'नवरात्रोत्सवाचा उत्साह द्विगुणित करण्यासोबतच महिलांच्या कलागुणांना व्यासपीठ मिळावे आणि त्यांना आपली नृत्यकला सादर करण्याची संधी मिळावी, या उद्देशाने दांडिया व गरबा स्पर्धांचे आयोजन केले जाते. या स्पर्धांमध्ये महिलांना समूहाने किंवा वैयक्तिकरीत्या सहभागी होऊन आपले कौशल्य दाखवता येते.',
      body: `**उद्दिष्ट:** महिलांच्या कलागुणांना व्यासपीठ देणे आणि सुरक्षित, आनंदी वातावरणात सांस्कृतिक सण साजरा करणे.

नवरात्रोत्सवाचा उत्साह द्विगुणित करण्यासोबतच महिलांच्या कलागुणांना व्यासपीठ मिळावे आणि त्यांना आपली नृत्यकला सादर करण्याची संधी मिळावी, या उद्देशाने दांडिया व गरबा स्पर्धांचे आयोजन केले जाते. या स्पर्धांमध्ये महिलांना समूहाने किंवा वैयक्तिकरीत्या सहभागी होऊन आपले कौशल्य दाखवता येते.

### उपक्रमाची वैशिष्ट्ये

- **कलागुणांना वाव:** महिलांना आपली नृत्यकला सादर करण्याची आणि कलागुण विकसित करण्याची संधी मिळते.
- **सांस्कृतिक परंपरांचे जतन:** दांडिया आणि गरब्याच्या माध्यमातून नवरात्रोत्सवातील सांस्कृतिक परंपरा जपल्या जातात.
- **विजेत्यांचा गौरव:** स्पर्धेतील विजेत्या महिलांना सन्मानपत्र, चषक, रोख रक्कम किंवा घरगुती उपयोगाच्या वस्तू देऊन गौरवले जाते.
- **एकात्मता आणि उत्साह:** या उपक्रमातून महिलांमध्ये एकोपा वाढतो आणि सण साजरा करण्याचा आनंद अधिक वृद्धिंगत होतो.
- **आत्मविश्वासाला प्रोत्साहन:** महिलांना आपल्या कलागुणांचे प्रदर्शन करण्यासाठी आणि आत्मविश्वासाने पुढे येण्यासाठी प्रोत्साहन मिळते.`,
    },
    en: {
      title: 'Dandiya Festival', stat: 'Navratri Celebration & Dance Arena',
      summary: 'Navratri is a festival of devotion, colour and celebration. To add to the joy of the festival and give women a stage to show their talent, Lokmangal Foundation holds Dandiya and Garba competitions every year. Women can take part in groups or on their own and dance their hearts out.',
      body: `**Objective:** To celebrate Navratri by giving women a joyful platform to show their talent, preserve tradition and grow in confidence.

Navratri is a festival of devotion, colour and celebration. To add to the joy of the festival and give women a stage to show their talent, Lokmangal Foundation holds Dandiya and Garba competitions every year. Women can take part in groups or on their own and dance their hearts out.

### Key Features

- **A stage for talent:** Women get the chance to perform, show their dance skills and grow as artists.
- **Keeping traditions alive:** Dandiya and Garba help preserve the rich cultural traditions of Navratri.
- **Honouring the winners:** Winners are celebrated with certificates, trophies, cash prizes or useful household gifts.
- **Joy and togetherness:** The competition brings women together, builds friendships and makes the festival even more joyful.
- **Building confidence:** Women are encouraged to step forward, show their talent and shine with confidence.`,
    },
  },
  {
    slug: 'madhyamanchi-dakhal', category: 'community',
    mr: {
      title: 'वृत्तपत्रांतील प्रसिद्धी', stat: 'वृत्तपत्रे व प्रसारमाध्यमांतून गौरव',
      summary: 'संस्थेच्या सामाजिक उपक्रमांचे कार्य व यश प्रसारमाध्यमांद्वारे व्यापक जनसामान्यांपर्यंत पोहोचवणे.',
      body: `लोकमंगल फाऊंडेशनच्या विविध सामाजिक, शैक्षणिक, आरोग्यविषयक, महिला सक्षमीकरण, रोजगार आणि सांस्कृतिक उपक्रमांची दखल विविध वृत्तपत्रांनी घेतली आहे. या प्रसिद्धीमुळे संस्थेच्या कार्याची माहिती समाजातील अधिकाधिक लोकांपर्यंत पोहोचली आहे.

### वृत्तपत्रांमध्ये प्रसिद्ध झालेल्या प्रमुख बातम्या

- साहित्य पुरस्कार आणि साहित्यिकांचा सन्मान
- लोटस योजनेअंतर्गत विद्यार्थ्यांना मदत
- निवासी बालसंस्कार शिबिरांचे आयोजन
- भजन मंडळांना वाद्यसाहित्याचे वाटप
- दिव्यांग व्यक्तींना सहाय्यक साहित्याचे वितरण
- आरोग्य शिबिरे आणि आरोग्यविषयक उपक्रम
- जलसंधारण आणि रोजगार मेळाव्यांचे आयोजन

विविध वृत्तपत्रांतील या बातम्या लोकमंगल फाऊंडेशनच्या सामाजिक कार्याची नोंद घेणारा महत्त्वाचा दस्तऐवज आहेत. त्यातून संस्थेच्या विविध उपक्रमांची व्याप्ती आणि समाजापर्यंत पोहोचलेले कार्य अधोरेखित होते.`,
    },
    en: {
      title: 'Media Coverage', stat: 'Media Recognition & News Coverage',
      summary: 'Lokmangal Foundation’s work in social welfare, education, health, women’s empowerment, employment and culture has been covered by many newspapers. This coverage has helped more people learn about the Foundation and the difference it is making in their communities.',
      body: `Lokmangal Foundation’s work in social welfare, education, health, women’s empowerment, employment and culture has been covered by many newspapers. This coverage has helped more people learn about the Foundation and the difference it is making in their communities.

### Key Highlights in the Press

- Sahitya Award and honouring of writers
- Support for students under the LOTUS scheme
- Residential Bal Sanskar camps
- Musical instruments given to bhajan groups
- Assistive aids given to persons with disabilities
- Health camps and health initiatives
- Water conservation work and job fairs

These news stories are more than headlines. Together, they are a valuable record of the Foundation’s journey, showing how far its work has reached and how many lives it has touched.`,
    },
  },
]

/** Photo galleries and videos from each initiative's own page on lokmangalfoundation.com (paths in the S3 bucket) */
export const LOKMANGAL_MEDIA: Record<string, { gallery: string[]; videos: string[] }> = {
  'annapurna-yojana': {
    videos: ['https://www.youtube.com/watch?v=xqe6JKzo11I'],
    gallery: [
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-01.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-02.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-03.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-04.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-05.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-06.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-07.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-08.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-09.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-10.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-11.jpg',
      'gallery/seed-gallery-lokmangal-annapoorna-yojana-lokmangal-annapoorna-yojana-12.jpg',
    ],
  },
  'jalsandharan': {
    videos: ['https://www.youtube.com/watch?v=DyXdiolI1TI'],
    gallery: [
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-01.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-02.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-03.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-04.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-05.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-06.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-07.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-08.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-09.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-10.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-11.jpg',
      'gallery/seed-gallery-lokmangal-jalsandharan-project-lokmangal-jalsandharan-project-12.jpg',
    ],
  },
  'lotus': {
    videos: ['https://www.youtube.com/watch?v=Mi-1-IPWPmk'],
    gallery: [
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-01.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-02.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-03.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-04.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-05.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-06.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-07.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-08.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-09.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-10.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-11.jpg',
      'gallery/seed-gallery-lokmangal-vidyadaan-yojana-lokmangal-vidyadaan-yojana-12.jpg',
      'gallery/lotus-1791199662907-1-fad69d346360.jpeg',
      'gallery/lotus-1791199662929-2-58fa4f6ce9f8.jpeg',
      'gallery/lotus-1791199662939-3-1cf794d5fe83.jpeg',
      'gallery/lotus-1791199662947-4-b10be9c59af2.jpeg',
      'gallery/lotus-1791199662955-5-7c9a094a2d9e.jpeg',
      'gallery/lotus-1791199662963-6-4ffbe28989e1.jpeg',
      'gallery/lotus-1791199662970-7-75c4fc58b1a5.jpeg',
      'gallery/lotus-1791199662978-8-22cb135fc122.jpeg',
      'gallery/lotus-1791199662984-9-a37f94b0f30c.jpeg',
      'gallery/lotus-1791199662991-10-b46446e8d4b7.jpeg',
      'gallery/lotus-1791199662998-11-d998b38bdcc9.jpeg',
      'gallery/lotus-1791199663006-12-b158a2087a7a.jpeg',
    ],
  },
  'samudayik-vivah': {
    videos: ['https://www.youtube.com/watch?v=pooqDuktVeM'],
    gallery: [
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-01.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-02.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-03.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-04.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-05.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-06.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-07.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-08.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-09.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-10.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-11.jpg',
      'gallery/seed-gallery-lokmangal-samudayik-vivah-lokmangal-samudayik-vivah-12.jpg',
      'gallery/1789720268842-97844565d7e7.jpg',
      'gallery/1789720268865-7a974e738daf.jpg',
    ],
  },
  'ek-muth-dhanya': {
    videos: [],
    gallery: [
      'gallery/ek-muth-dhanya-01.jpg',
      'gallery/ek-muth-dhanya-02.jpg',
      'gallery/ek-muth-dhanya-03.jpg',
      'gallery/ek-muth-dhanya-04.jpg',
      'gallery/ek-muth-dhanya-05.jpg',
      'gallery/ek-muth-dhanya-06.jpg',
      'gallery/ek-muth-dhanya-07.jpg',
      'gallery/ek-muth-dhanya-08.jpg',
      'gallery/ek-muth-dhanya-09.jpg',
      'gallery/ek-muth-dhanya-10.jpg',
    ],
  },
  'sahitya-puraskar': {
    videos: [],
    gallery: [
      'gallery/1789719743549-3216ca99abb1.jpg',
      'gallery/1789719743574-e32fa371b937.jpg',
      'gallery/1789719743592-b88d96a0c556.jpg',
    ],
  },
  'shikshak-ratna-puraskar': {
    videos: [],
    gallery: [
      'gallery/1789719974161-e0b27091df01.jpg',
      'gallery/1789719974177-4c9f05ce922d.jpg',
      'gallery/shikshak-ratna-1791200278452-1-412200ecaefc.jpg',
      'gallery/shikshak-ratna-1791200278505-2-412a75451674.jpg',
      'gallery/shikshak-ratna-1791200278531-3-2a449c1dd698.jpg',
      'gallery/shikshak-ratna-1791200278557-4-b26a7e01c175.jpg',
      'gallery/shikshak-ratna-1791200278580-5-6f7a804a1f76.jpg',
    ],
  },
  'sanjivani-medical': {
    videos: [],
    gallery: [
      'gallery/1789719315615-86ccfcb452ab.jpg',
      'gallery/1789719315638-41573eb72ca1.jpg',
      'gallery/1789719315656-39dc6c69892f.jpg',
    ],
  },
  'maha-arogya-shibir': {
    videos: [],
    gallery: [
      'gallery/1789720677342-1f7848972227.jpg',
      'gallery/1789720677363-b39e1a109779.jpg',
      'gallery/1789720677377-7a32e71087ce.jpg',
      'gallery/1789720677394-a1f4ffa0caf8.jpg',
    ],
  },
  'divyang-shibir': {
    videos: [],
    gallery: [
      'gallery/1789726602249-5839547dcff7.jpg',
      'gallery/1789726602288-49f051b9d551.jpg',
      'gallery/1789726602308-fc8b2b47b471.jpg',
    ],
  },
  'sarvarog-nidan-shibir': {
    videos: [],
    gallery: [
      'gallery/1789726673629-21105a800301.jpg',
      'gallery/1789726673650-7d3a2d108716.jpg',
    ],
  },
  'raktadan-shibir': {
    videos: [],
    gallery: [
      'gallery/1791797939902-a7f46c9f27cb.jpg',
      'gallery/1791797940256-df8a114d73de.jpg',
      'gallery/1791797940473-d019c3cb59fb.jpg',
      'gallery/1791797940692-bd2153c03c26.jpg',
    ],
  },
  'shaley-sahitya-vatap': {
    videos: [],
    gallery: [
      'gallery/school-supplies-notebook-01.jpg',
      'gallery/school-supplies-notebook-02.jpg',
      'gallery/school-supplies-notebook-03.jpg',
      'gallery/school-supplies-notebook-04.jpg',
      'gallery/school-supplies-notebook-05.jpg',
      'gallery/school-supplies-notebook-06.jpg',
      'gallery/school-supplies-notebook-07.jpg',
      'gallery/school-supplies-notebook-08.jpg',
      'gallery/school-supplies-notebook-09.jpg',
      'gallery/school-supplies-notebook-10.jpg',
      'gallery/school-supplies-notebook-11.jpg',
      'gallery/school-supplies-notebook-12.jpg',
      'gallery/school-supplies-notebook-13.jpg',
      'gallery/school-supplies-notebook-14.jpg',
    ],
  },
  'balsanskar-shibir': {
    videos: [],
    gallery: [
      'gallery/1789720490308-dab684c3989a.jpg',
      'gallery/1789720490333-1e55c51c38b5.jpg',
    ],
  },
  'killa-bandhani-spardha': {
    videos: [],
    gallery: [
      'gallery/killa-bandhani-spardha-01.jpg',
      'gallery/killa-bandhani-spardha-02.jpg',
      'gallery/killa-bandhani-spardha-03.jpg',
      'gallery/killa-bandhani-spardha-04.jpg',
      'gallery/killa-bandhani-spardha-05.jpg',
      'gallery/killa-bandhani-spardha-06.jpg',
      'gallery/killa-bandhani-spardha-07.jpg',
      'gallery/killa-bandhani-spardha-08.jpg',
      'gallery/killa-bandhani-spardha-09.jpg',
      'gallery/killa-bandhani-spardha-10.jpg',
      'gallery/killa-bandhani-spardha-11.jpg',
      'gallery/killa-bandhani-spardha-12.jpg',
      'gallery/killa-bandhani-spardha-13.jpg',
      'gallery/killa-bandhani-spardha-14.jpg',
      'gallery/killa-bandhani-spardha-15.jpg',
      'gallery/killa-bandhani-spardha-16.jpg',
      'gallery/killa-bandhani-spardha-17.jpg',
      'gallery/killa-bandhani-spardha-18.jpg',
      'gallery/killa-bandhani-spardha-19.jpg',
      'gallery/killa-bandhani-spardha-20.jpg',
      'gallery/killa-bandhani-spardha-21.jpg',
      'gallery/1789726776357-49c4d1327c59.jpg',
      'gallery/1789726776383-878fccf050d2.jpg',
      'gallery/1789726776401-2a3484b31c04.jpg',
    ],
  },
  'rojgar-melava': {
    videos: [],
    gallery: [
      'gallery/1791798024044-152e513749af.jpg',
      'gallery/1791798024565-dab455ee1c26.jpg',
      'gallery/1791798024881-587ff4680c38.jpg',
      'gallery/1791798025100-a6cdafc371fe.jpg',
      'gallery/1791798025360-c1df5d63adff.jpg',
      'gallery/1791798025667-85662496121a.jpg',
      'gallery/1791798025961-c9ebb340d4f1.jpg',
      'gallery/1791798026230-7cc40462dd9e.jpg',
      'gallery/1791798026496-8b2ff1a6a53a.jpg',
      'gallery/1791798027203-2a4639a98085.jpg',
      'gallery/1791798027509-9881505e396e.jpg',
      'gallery/1791798027842-a40c14b6b956.jpg',
      'gallery/1791798028214-cfae726eed6b.jpg',
      'gallery/1791798028509-010a48aa0a1f.jpg',
      'gallery/1791798028774-f0062e4c513f.jpg',
      'gallery/1791798029326-0589e0d673c4.jpg',
      'gallery/1791798029894-b5a77e9e0162.jpg',
      'gallery/1791798030158-4646e89f30c3.jpg',
      'gallery/1791798030484-7d1085e94dc5.jpg',
      'gallery/1791798030746-039d0ec15be0.jpg',
      'gallery/1791798031349-ddc9f34c1513.jpg',
      'gallery/1791798031635-ce9f6b1a37a4.jpg',
      'gallery/1791798031923-772d44c588e5.jpg',
      'gallery/1791798032488-e1aee83d6877.jpg',
    ],
  },
  'mahila-din': {
    videos: [],
    gallery: [
      'gallery/1789719585519-3e168ad7d50f.jpg',
      'gallery/1791805418186-6bf9b7dd69f6.jpg',
      'gallery/1791805418677-ab729bc56170.jpg',
      'gallery/1791805419073-6dc2eda9bed9.jpg',
      'gallery/1791805419710-1d336091f75d.jpg',
      'gallery/1791805420173-3e9a3316d318.jpg',
      'gallery/1791805420518-16789d714bdd.jpg',
      'gallery/1791805421192-afd5448d9c03.jpg',
      'gallery/1791805421552-793c85fc8566.jpg',
      'gallery/1791805421951-576efe47622e.jpg',
      'gallery/1791805422370-f404981bd4d2.jpg',
      'gallery/1791805422760-a7b9712d04cd.jpg',
      'gallery/1791805423123-57dd9f50d81d.jpg',
      'gallery/1791805423414-c6057ff3b546.jpg',
      'gallery/1791805423636-83a8ed4abe89.jpg',
      'gallery/1791805423955-908cba65f01f.jpg',
    ],
  },
  'bhajan-bharud-spardha': {
    videos: ['projects/bhajan-bharud-spardha-video-01.mp4', 'projects/bhajan-bharud-spardha-video-02.mp4', 'projects/bhajan-bharud-spardha-video-03.mp4'],
    gallery: [
      'gallery/bhajan-bharud-spardha-01.jpg',
      'gallery/bhajan-bharud-spardha-02.jpg',
      'gallery/bhajan-bharud-spardha-03.jpg',
      'gallery/bhajan-bharud-spardha-04.jpg',
      'gallery/bhajan-bharud-spardha-05.jpg',
      'gallery/bhajan-bharud-spardha-06.jpg',
      'gallery/bhajan-bharud-spardha-07.jpg',
      'gallery/bhajan-bharud-spardha-08.jpg',
      'gallery/bhajan-bharud-spardha-09.jpg',
      'gallery/bhajan-bharud-spardha-10.jpg',
      'gallery/bhajan-bharud-spardha-11.jpg',
      'gallery/bhajan-bharud-spardha-12.jpg',
      'gallery/bhajan-bharud-spardha-13.jpg',
      'gallery/bhajan-bharud-spardha-14.jpg',
      'gallery/bhajan-bharud-spardha-15.jpg',
      'gallery/bhajan-bharud-spardha-16.jpg',
      'gallery/bhajan-bharud-spardha-17.jpg',
      'gallery/1789720389031-132c02df162b.jpg',
      'gallery/1789720389054-97c67941c794.jpg',
    ],
  },
  'yog-din': {
    videos: [],
    gallery: [
      'gallery/1791797850127-ae818fa3e151.jpg',
      'gallery/1791797850316-d22bbaaf0964.jpg',
      'gallery/1791797850462-53db851428fd.jpg',
      'gallery/1791797850589-ed90001bd70c.jpg',
      'gallery/1791797850748-a44a7db08b6f.jpg',
      'gallery/1791797851269-5a34692700d3.jpg',
      'gallery/1791797851472-7d8f94986611.jpg',
      'gallery/1791797851692-4431556471c9.jpg',
      'gallery/1791797851874-62b4b4faa168.jpg',
      'gallery/1791797852222-8cb7e3673953.jpg',
      'gallery/1791797852521-a3162f3c907f.jpg',
      'gallery/1791797852742-ae36c1aa49e2.jpg',
      'gallery/1791797853053-6bc7ca23aa3d.jpg',
      'gallery/1791797853467-a0a1743aafb1.jpg',
      'gallery/1791797853590-50a005a43e3f.jpg',
      'gallery/1791797853810-7b6766b464f7.jpg',
      'gallery/1791797854027-01193af94b31.jpg',
      'gallery/1791797854204-7365221db900.jpg',
      'gallery/1791797854458-cd8f184766a7.jpg',
      'gallery/1791797854632-1964f0ef1026.jpg',
      'gallery/1791797854740-dbc940dac4ea.jpg',
      'gallery/1791797854957-854388ca6641.jpg',
      'gallery/1791797855118-1f097e2eec8f.jpg',
      'gallery/1791797855277-fdc76a4f1f7c.jpg',
    ],
  },
  'ekal-mahila-upakram': {
    videos: [],
    gallery: [
      'gallery/ekal-mahila-upakram-01.jpg',
      'gallery/ekal-mahila-upakram-02.jpg',
      'gallery/ekal-mahila-upakram-03.jpg',
    ],
  },
  'vrukshaaropan': {
    videos: [],
    gallery: [
      'gallery/1791798117717-917e4d1266d0.jpg',
      'gallery/1791798117992-8ffec5495ce5.jpg',
      'gallery/1791798118356-d7c25916c80c.jpg',
      'gallery/1791798118734-40fcb3e24f32.jpg',
      'gallery/1791798119409-16fe4d0651a7.jpg',
      'gallery/1791798120085-c70559025e6a.jpg',
      'gallery/1791798120494-55323617e366.jpg',
      'gallery/1791798120900-23a39ce1a883.jpg',
      'gallery/1791798121168-35825f30d905.jpg',
    ],
  },
  'dandiya-utsav': {
    videos: [],
    gallery: [
      'gallery/1789726853592-e3e49bafe9ec.jpg',
      'gallery/1789726853611-03f4e0ed13b3.jpg',
      'gallery/1789726853626-cbe903d63c1f.jpg',
      'gallery/1789726853640-875ec57d6ba0.jpg',
    ],
  },
  'madhyamanchi-dakhal': {
    videos: [],
    gallery: [
    ],
  },
}
