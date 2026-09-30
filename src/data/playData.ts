import { Affirmation, MoodChoice, WheelItem, MythFactItem, DailyPlayChallenge } from '../types/play';

export const AFFIRMATIONS: Affirmation[] = [
  {
    id: 'aff_1',
    text: 'You deserve rest without guilt. 🌷',
    hindiText: 'आप बिना किसी अपराधबोध के आराम की हकदार हैं। 🌷',
    author: 'Sakhi Didi',
    tags: ['Rest', 'Self-love'],
  },
  {
    id: 'aff_2',
    text: 'Your body is doing its best. Be gentle with it. 💗',
    hindiText: 'आपका शरीर अपना सर्वश्रेष्ठ प्रयास कर रहा है। इसके प्रति कोमल रहें। 💗',
    author: 'Sakhi Care',
    tags: ['Kindness', 'Body Love'],
  },
  {
    id: 'aff_3',
    text: 'You do not have to be productive every single minute. 🌸',
    hindiText: 'आपको हर मिनट कुछ न कुछ साबित करने की ज़रूरत नहीं है। 🌸',
    author: 'Sakhi Mind',
    tags: ['Peace', 'Slow Down'],
  },
  {
    id: 'aff_4',
    text: 'Honor your monthly seasons; winter rest brings spring bloom. ✨',
    hindiText: 'अपने चक्र की हर ऋतु का सम्मान करें; शीत विश्राम ही वसंत लाता है। ✨',
    author: 'Holistic Sakhi',
    tags: ['Cycle Sync', 'Harmony'],
  },
  {
    id: 'aff_5',
    text: 'Cramps are tough, but you are gentle, strong, and deeply resilient. 🦋',
    hindiText: 'दर्द अस्थायी है, पर आपकी शक्ति और धैर्य अपार हैं। 🦋',
    author: 'Sakhi Sisterhood',
    tags: ['Strength', 'Comfort'],
  },
  {
    id: 'aff_6',
    text: 'Take a sip of warm water, soften your shoulders, and smile. Sakhi is with you. 🎀',
    hindiText: 'थोड़ा गुनगुना पानी पिएं, गहरी सांस लें और मुस्कुराएं। सखी आपके साथ है। 🎀',
    author: 'Sakhi Hug',
    tags: ['Warmth', 'Didi Care'],
  },
];

export const MOOD_CHOICES: MoodChoice[] = [
  {
    id: 'happy',
    emoji: '🥰',
    label: 'Happy & Glowing',
    hindiLabel: 'खुश और प्रसन्न',
    response: 'Your joy is radiant today, Sakhi! Celebrate this beautiful energy 🌸',
    hindiResponse: 'आज आपका मन प्रसन्न है सखी! इस खूबसूरत ऊर्जा का आनंद लें 🌸',
    actionTitle: 'Spread the Love',
    actionDesc: 'Write down 3 things you love about yourself today or share a kind word with a friend.',
    actionIcon: '💗',
  },
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm & Centered',
    hindiLabel: 'शांत और सुकून भरा',
    response: 'Such a peaceful mental space. Protect this quiet serenity today 🌷',
    hindiResponse: 'कितना शांत और संतुलित मन है। आज इस सुकून को बनाए रखें 🌷',
    actionTitle: 'Mindful Sip & Melody',
    actionDesc: 'Brew a gentle herbal tea and listen to Sakhi relaxation tracks.',
    actionIcon: '🎵',
  },
  {
    id: 'emotional',
    emoji: '🥺',
    label: 'Emotional & Tender',
    hindiLabel: 'भावुक और संवेदनशील',
    response: 'Hormonal waves are natural. Your feelings are 100% valid, Sakhi 💗',
    hindiResponse: 'हार्मोन्स के उतार-चढ़ाव स्वाभाविक हैं। आपकी भावनाएं बिल्कुल जायज़ हैं 💗',
    actionTitle: '1-Minute Heart Hug',
    actionDesc: 'Place both hands over your heart, breathe in slowly for 4s, and whisper "I am safe and loved."',
    actionIcon: '🌸',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Tired & Low Energy',
    hindiLabel: 'थकान और सुस्त',
    response: "You're feeling tired today 🌷. Please honor your need to slow down.",
    hindiResponse: 'आज आप थकावट महसूस कर रही हैं 🌷। अपने शरीर को पूरा आराम दें।',
    actionTitle: 'Zero-Guilt Nap / Rest',
    actionDesc: 'Lie down, elevate your feet with a pillow, and listen to warm binaural delta waves.',
    actionIcon: '💤',
  },
  {
    id: 'irritated',
    emoji: '😤',
    label: 'Irritated & Sensitive',
    hindiLabel: 'चिड़चिड़ापन',
    response: 'Progesterone drops can heighten sensitivity. You do not have to apologize for needing space 🌸',
    hindiResponse: 'हार्मोनल बदलाव से चिड़चिड़ापन हो सकता है। थोड़ा एकांत लें और खुद को समय दें 🌸',
    actionTitle: 'Cooling Breath (Sheetali)',
    actionDesc: 'Roll your tongue or breathe through teeth, cooling your body from inside out.',
    actionIcon: '🫧',
  },
  {
    id: 'energetic',
    emoji: '✨',
    label: 'Energetic & Creative',
    hindiLabel: 'ऊर्जावान और सक्रिय',
    response: 'Estrogen is giving you wings! Perfect time to create, plan, or dance 🦋',
    hindiResponse: 'एस्ट्रोजन आपको नई ऊर्जा दे रहा है! नए विचार या हल्की वॉक के लिए उत्तम समय 🦋',
    actionTitle: 'Creative Quick Doodle',
    actionDesc: 'Channel this burst of energy into a quick sketch or productive plan.',
    actionIcon: '🎨',
  },
];

export const WHEEL_ITEMS: WheelItem[] = [
  {
    id: 'water',
    label: 'Drink Water',
    hindiLabel: 'पानी पिएं',
    icon: '💧',
    description: 'Sip a warm glass of water with lemon or ajwain to ease cramping.',
    tokens: 5,
    color: '#FFE4E6',
  },
  {
    id: 'stretch',
    label: 'Gentle Stretch',
    hindiLabel: 'हल्का खिंचाव',
    icon: '🧘',
    description: 'Do Butterfly pose (Baddha Konasana) for 2 minutes to relax pelvic tension.',
    tokens: 5,
    color: '#FCE7F3',
  },
  {
    id: 'music',
    label: 'Sakhi Music',
    hindiLabel: 'संगीत सुनें',
    icon: '🎵',
    description: 'Tune into 432Hz healing sound waves for uterine muscle relaxation.',
    tokens: 5,
    color: '#EDE9FE',
  },
  {
    id: 'learn',
    label: 'Learn Something',
    hindiLabel: 'नया सीखें',
    icon: '📚',
    description: 'Read a verified period guide about luteal phase progesterone.',
    tokens: 5,
    color: '#FEF3C7',
  },
  {
    id: 'affirmation',
    label: 'Daily Affirmation',
    hindiLabel: 'सकारात्मक सोच',
    icon: '💗',
    description: 'Say out loud: "My body is worthy of tenderness and care."',
    tokens: 5,
    color: '#FEE2E2',
  },
  {
    id: 'break',
    label: 'Take a Break',
    hindiLabel: 'छोटा ब्रेक',
    icon: '🌸',
    description: 'Step away from screens for 5 minutes and look out a window.',
    tokens: 5,
    color: '#FCEEE9',
  },
  {
    id: 'doodle',
    label: 'Happy Doodle',
    hindiLabel: 'डूडल बनाएं',
    icon: '🎨',
    description: 'Draw a mini flower or butterfly to engage your creative brain.',
    tokens: 5,
    color: '#DCFCE7',
  },
];

export const MYTH_FACT_ITEMS: MythFactItem[] = [
  {
    id: 'mf_1',
    statement: 'Exercise and gentle movement should always be completely avoided during periods.',
    hindiStatement: 'पीरियड्स के दौरान किसी भी प्रकार के व्यायाम या योग से हमेशा बचना चाहिए।',
    isMyth: true,
    explanation:
      'Gentle exercise like walking, stretching, or restorative yoga actually releases beta-endorphins (natural painkillers) and increases pelvic blood circulation, reducing menstrual cramps.',
    hindiExplanation:
      'हल्का व्यायाम, टहलना या बटरफ्लाई आसन एंडोर्फिन (प्राकृतिक दर्द निवारक) रिलीज करता है और ऐंठन को कम करता है। केवल अत्यधिक भारी वजन उठाने से बचना चाहिए।',
    reference: 'American College of Obstetricians and Gynecologists (ACOG)',
  },
  {
    id: 'mf_2',
    statement: 'Menstrual fluid is dirty, toxic blood that must be purged from the body.',
    hindiStatement: 'पीरियड्स का खून अशुद्ध और जहरीला होता है जिसे शरीर से बाहर निकालना ज़रूरी है।',
    isMyth: true,
    explanation:
      'Menstrual fluid is a natural, sterile mix of healthy blood, cervical mucus, and endometrial tissue that was prepared to nurture life. It is not toxic waste.',
    hindiExplanation:
      'पीरियड का रक्त पूरी तरह सामान्य और प्राकृतिक है। यह गर्भाशय की पोषक परत (एंडोमेट्रियम) और रक्त का मिश्रण है, कोई अशुद्धि नहीं।',
    reference: 'World Health Organization (WHO) & UNICEF Guidance',
  },
  {
    id: 'mf_3',
    statement: 'A menstrual cup can easily get lost or travel inside your abdomen.',
    hindiStatement: 'मेन्स्ट्रुअल कप शरीर के अंदर कहीं खो सकता है या पेट में जा सकता है।',
    isMyth: true,
    explanation:
      'Anatomically impossible! The vagina is a closed muscular canal terminating at the cervix. The opening of the cervix is as tiny as a pinhead, through which a cup cannot pass.',
    hindiExplanation:
      'यह शारीरिक रूप से असंभव है! योनि एक बंद नली है जिसका अंत गर्भाशय ग्रीवा (cervix) पर होता है। कप कभी शरीर के अंदर खो नहीं सकता।',
    reference: 'Federation of Obstetric and Gynaecological Societies of India (FOGSI)',
  },
  {
    id: 'mf_4',
    statement: 'Premenstrual syndrome (PMS) physical and emotional symptoms are genuine medical changes.',
    hindiStatement: 'पीरियड्स से पहले होने वाले शारीरिक और भावनात्मक बदलाव (PMS) वास्तविक चिकित्सकीय लक्षण हैं।',
    isMyth: false,
    explanation:
      'Fact! Dramatic drops in progesterone and estrogen 7–10 days before menstruation alter serotonin neurotransmitters, causing verified changes in mood, bloating, and energy.',
    hindiExplanation:
      'सत्य! पीरियड्स से पहले एस्ट्रोजन व प्रोजेस्टेरोन में अचानक गिरावट से सेरोटोनिन प्रभावित होता है, जिससे मूड स्विंग्स और सूजन वास्तविक रूप से होते हैं।',
    reference: 'Mayo Clinic & Harvard Health Menstrual Biology',
  },
  {
    id: 'mf_5',
    statement: 'Warm heat pads or hot water compresses effectively relieve menstrual uterine cramps.',
    hindiStatement: 'गर्म पानी की सिकाई या हीटिंग पैड पीरियड्स के दर्द को कम करने में असरदार है।',
    isMyth: false,
    explanation:
      'Fact! Clinical trials demonstrate that 40°C heat application relaxes myometrial uterine muscle contractions and works as effectively as mild ibuprofen for dysmenorrhea.',
    hindiExplanation:
      'सत्य! गर्माहट गर्भाशय की सिकुड़ी मांसपेशियों को शिथिल करती है और रक्त प्रवाह बढ़ाकर दर्द में तुरंत राहत देती है।',
    reference: 'Journal of Physiotherapy / Evidence-Based Medicine',
  },
];

export const DAILY_CHALLENGES: DailyPlayChallenge[] = [
  {
    id: 'chal_water',
    title: 'Hydration Glow Check 💧',
    hindiTitle: 'पर्याप्त जल का सेवन 💧',
    description: 'Drink at least 4 glasses of room temperature or warm water today.',
    tokens: 10,
    icon: '💧',
  },
  {
    id: 'chal_time',
    title: '5 Minutes for Yourself 🌸',
    hindiTitle: 'खुद के लिए 5 मिनट 🌸',
    description: 'Sit in silence, breathe deeply, and disconnect from all chores for 5 undisturbed minutes.',
    tokens: 10,
    icon: '🌸',
  },
  {
    id: 'chal_learn',
    title: 'Learn One Cycle Fact 📚',
    hindiTitle: 'पीरियड ज्ञान प्राप्त करें 📚',
    description: 'Discover the difference between luteal and follicular phases.',
    tokens: 10,
    icon: '📚',
  },
  {
    id: 'chal_movement',
    title: '3 Minutes Gentle Movement 🧘‍♀️',
    hindiTitle: '3 मिनट कोमल योग 🧘‍♀️',
    description: 'Practice Child pose (Balasana) or Cat-Cow stretch for 3 soothing minutes.',
    tokens: 10,
    icon: '🧘‍♀️',
  },
];
