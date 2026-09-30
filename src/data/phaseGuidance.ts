import { CyclePhase } from '../types/cycle';
import { SupportedLanguage } from '../i18n/translations';

export interface PhaseGuidanceItem {
  phase: CyclePhase;
  name: string;
  seasonMetaphor: string;
  duration: string;
  energyLevel: string;
  hormones: string;
  nutritionOverview: string;
  foodsToEmphasize: string[];
  seedCycling: string;
  movementOverview: string;
  recommendedWorkouts: string[];
  selfCareRitual: string;
  warmTip: string;
}

export const PHASE_GUIDANCE: Record<SupportedLanguage, Record<CyclePhase, PhaseGuidanceItem>> = {
  en: {
    menstrual: {
      phase: 'menstrual',
      name: 'Menstrual Phase (Inner Winter)',
      seasonMetaphor: 'Winter Sanctuary',
      duration: 'Days 1 – 5',
      energyLevel: 'Low, inward, reflective',
      hormones: 'Estrogen and progesterone drop to their lowest baseline.',
      nutritionOverview: 'Warm, slow-cooked, iron-rich meals that gently nourish blood loss and soothe the uterus.',
      foodsToEmphasize: [
        'Warm bone broths or rich lentil dal',
        'Beetroot, dark leafy greens, and spinach (Iron rich)',
        'Ginger-cinnamon tea with raw honey',
        'Warm soaked figs and dates',
        'Dark chocolate (70%+ for magnesium relief)'
      ],
      seedCycling: 'Flaxseeds & Raw Pumpkin Seeds (1 tbsp each daily for estrogen support)',
      movementOverview: 'Gentle, restorative movement. Honor your body’s call to rest.',
      recommendedWorkouts: [
        'Restorative Yin Yoga & Child’s Pose',
        'Slow nature strolls in fresh air',
        'Gentle pelvic tilts and cat-cow stretches',
        'Deep diaphragmatic breathing'
      ],
      selfCareRitual: 'Hot water bag on lower abdomen, warm sesame oil foot massage, and restful early sleep.',
      warmTip: 'Saying no to extra tasks is a sacred act of self-care during your bleed.'
    },
    follicular: {
      phase: 'follicular',
      name: 'Follicular Phase (Inner Spring)',
      seasonMetaphor: 'Spring Awakening',
      duration: 'Days 6 – 12',
      energyLevel: 'Rising, vibrant, creative',
      hormones: 'Estrogen is steadily rising as follicle stimulating hormone (FSH) develops eggs.',
      nutritionOverview: 'Light, vibrant, probiotic-rich foods that assist liver clearance of rising estrogens.',
      foodsToEmphasize: [
        'Fermented foods (homemade dahi / yogurt, kefir)',
        'Broccoli sprouts, cabbage, and crisp fresh salads',
        'Lean proteins, sprouted moong, and chickpeas',
        'Avocado, olive oil, and healthy plant fats',
        'Citrus fruits, berries, and antioxidant boosters'
      ],
      seedCycling: 'Flaxseeds & Pumpkin Seeds continue until ovulation day.',
      movementOverview: 'Fresh cardio, dynamic flows, and joyful experimentation with new exercise styles.',
      recommendedWorkouts: [
        'Vinyasa Flow & Surya Namaskar',
        'Brisk outdoor jogging or cycling',
        'Light strength training & pilates',
        'Dance and rhythm workouts'
      ],
      selfCareRitual: 'Journaling new month goals, initiating creative projects, and scheduling social gatherings.',
      warmTip: 'Your mind is naturally sharp and open to fresh beginnings. Dream big!'
    },
    ovulatory: {
      phase: 'ovulatory',
      name: 'Ovulatory Phase (Inner Summer)',
      seasonMetaphor: 'Summer Radiance',
      duration: 'Days 13 – 16',
      energyLevel: 'Peak radiance, magnetic, communicative',
      hormones: 'Luteinizing Hormone (LH) surges; estrogen peaks right before ovulation.',
      nutritionOverview: 'Hydrating, anti-inflammatory, glutathione-rich foods to support ovulation and egg quality.',
      foodsToEmphasize: [
        'Berries, pomegranate, and brightly colored vegetables',
        'Asparagus, bell peppers, and quinoa bowls',
        'Wild-caught fish or chia seeds for Omega-3s',
        'Fresh coconut water and cooling mint infusions',
        'Turmeric golden almond milk'
      ],
      seedCycling: 'Switch to Sunflower Seeds & Sesame Seeds (1 tbsp each daily for progesterone support).',
      movementOverview: 'High-intensity workouts, heavy lifting, and social group fitness classes.',
      recommendedWorkouts: [
        'HIIT & high-energy circuit training',
        'Challenging strength & weight training',
        'Power Yoga or hot yoga',
        'Group spin or dance classes'
      ],
      selfCareRitual: 'Give presentations, schedule important conversations, and celebrate your natural glow.',
      warmTip: 'Your verbal fluency and social charisma are at their monthly peak.'
    },
    luteal: {
      phase: 'luteal',
      name: 'Luteal Phase (Inner Autumn)',
      seasonMetaphor: 'Autumn Grounding',
      duration: 'Days 17 – 28',
      energyLevel: 'Grounded, nesting, sensitive',
      hormones: 'Progesterone takes center stage, preparing the uterine lining and raising resting metabolic rate.',
      nutritionOverview: 'Complex slow-burning carbohydrates and magnesium to stabilize blood sugar and calm PMS mood swings.',
      foodsToEmphasize: [
        'Sweet potatoes, roasted squash, and brown rice',
        'Roasted chickpeas, walnuts, and pumpkin purees',
        'Bananas (rich in Vitamin B6 to reduce water retention)',
        'Chamomile tea and fennel-ajwain digestive infusion',
        'Warm soups with cumin, coriander, and turmeric'
      ],
      seedCycling: 'Sunflower Seeds & Sesame Seeds (1 tbsp daily) to encourage smooth progesterone balance.',
      movementOverview: 'Moderate strength, grounding yoga, and steady-state cardiovascular movement.',
      recommendedWorkouts: [
        'Gentle Pilates & core stability',
        'Strength training with moderate weights',
        'Brisk calming walks in twilight',
        'Hatha Yoga with prolonged forward folds'
      ],
      selfCareRitual: 'Declutter your sanctuary, take relaxing magnesium Epsom salt baths, and establish firm boundaries.',
      warmTip: 'Your metabolism increases by 100-300 kcal/day in luteal phase—honor your true hunger with complex carbs.'
    }
  },

  hi: {
    menstrual: {
      phase: 'menstrual',
      name: 'मासिक धर्म चरण (भीतरी शीत ऋतु)',
      seasonMetaphor: 'शीतकालीन विश्राम',
      duration: 'दिन 1 से 5',
      energyLevel: 'शांत, भीतरोन्मुख, विश्राम की चाह',
      hormones: 'एस्ट्रोजन और प्रोजेस्टेरोन अपने न्यूनतम स्तर पर होते हैं।',
      nutritionOverview: 'गर्म, सुपाच्य और आयरन से भरपूर भोजन जो गर्भाशय को शांति और खोए हुए रक्त की भरपाई प्रदान करे।',
      foodsToEmphasize: [
        'गर्म मूंग दाल की खिचड़ी और देसी घी',
        'चुकंदर, पालक और हरी पत्तेदार सब्जियां (आयरन प्रचुर)',
        'अदरक और अजवाइन का गर्म काढ़ा या हर्बल चाय',
        'भीगे हुए मुनक्के, अंजीर और बादाम',
        'डार्क चॉकलेट (मैग्नीशियम दर्द निवारण के लिए)'
      ],
      seedCycling: 'अलसी (Flaxseeds) और कद्दू के बीज (Pumpkin seeds) - 1-1 चम्मच प्रतिदिन।',
      movementOverview: 'अत्यंत सहज और आरामदायक योग। शरीर को पूरा आराम दें।',
      recommendedWorkouts: [
        'बालासन (Child Pose) और सुप्त बद्धकोणासन',
        'ताजी हवा में धीमी चहलकदमी',
        'धीमा भ्रामरी प्राणायाम और अनुलोम-विलोम',
        'पेल्विक स्ट्रेच'
      ],
      selfCareRitual: 'पेट के निचले हिस्से पर गर्म पानी की सिकाई, पैरों में तिल के तेल की मालिश और जल्दी सोना।',
      warmTip: 'पीरियड के दौरान काम से थोड़ा विश्राम लेना आपके शरीर का अधिकार है।'
    },
    follicular: {
      phase: 'follicular',
      name: 'फॉलिक्युलर चरण (भीतरी वसंत ऋतु)',
      seasonMetaphor: 'वसंत का आगमन',
      duration: 'दिन 6 से 12',
      energyLevel: 'उत्साही, ऊर्जावान, सृजनात्मक',
      hormones: 'एस्ट्रोजन का स्तर धीरे-धीरे बढ़ता है और अंडाणु विकसित होते हैं।',
      nutritionOverview: 'हल्का, ताजा और प्रोबायोटिक युक्त भोजन जो लिवर को अतिरिक्त हार्मोन साफ़ करने में मदद करे।',
      foodsToEmphasize: [
        'घर का बना ताजा दही और छाछ',
        'अंकुरित मूंग, चना और सलाद',
        'हरी सब्जियां, ब्रोकली और ककड़ी',
        'एवोकाडो और ताजे मौसमी फल',
        'संतरा, आंवला और नींबू पानी'
      ],
      seedCycling: 'अलसी और कद्दू के बीज ओव्यूलेशन तक जारी रखें।',
      movementOverview: 'तेज़ चलना, कार्डियो और नई फिटनेस गतिविधियों को आजमाने का उत्तम समय।',
      recommendedWorkouts: [
        'सूर्य नमस्कार (Surya Namaskar) के 6-12 चक्र',
        'तेज जॉगिंग या साइकिलिंग',
        'पिलेट्स और मध्यम स्ट्रेंथ ट्रेनिंग',
        'ज़ुम्बा या एरोबिक्स'
      ],
      selfCareRitual: 'नए लक्ष्यों की योजना बनाना, रचनात्मक शौक पूरे करना और सहेलियों से मिलना।',
      warmTip: 'आपका दिमाग इस समय बहुत स्पष्ट और सकारात्मक सोचता है। नए काम शुरू करें!'
    },
    ovulatory: {
      phase: 'ovulatory',
      name: 'ओव्यूलेटरी चरण (भीतरी ग्रीष्म ऋतु)',
      seasonMetaphor: 'ग्रीष्मकालीन चमक',
      duration: 'दिन 13 से 16',
      energyLevel: 'चरम ऊर्जा, सामाजिक, आत्मविश्वास से भरपूर',
      hormones: 'ल्यूटिनाइजिंग हार्मोन (LH) और एस्ट्रोजन अपने उच्चतम स्तर पर पहुंचते हैं।',
      nutritionOverview: 'हाइड्रेटिंग और एंटीऑक्सीडेंट से भरपूर भोजन जो ओव्यूलेशन की गुणवत्ता बढ़ाता है।',
      foodsToEmphasize: [
        'अनार, जामुन और रंग-बिरंगी सब्जियां',
        'नारियल पानी और पुदीना की ताज़ा छाछ',
        'अखरोट, बादाम और चिया के बीज',
        'हल्दी वाला बादाम दूध',
        'हल्का पका हुआ किनोआ या दलिया'
      ],
      seedCycling: 'अब तिल (Sesame) और सूरजमुखी के बीज (Sunflower seeds) 1-1 चम्मच प्रतिदिन शुरू करें।',
      movementOverview: 'उच्च तीव्रता वाले वर्कआउट और भारी वजन के व्यायाम।',
      recommendedWorkouts: [
        'HIIT और तेज दौड़ना',
        'स्ट्रेंथ ट्रेनिंग और वेट लिफ्टिंग',
        'पावर योग',
        'ग्रुप डांस या एरोबिक क्लास'
      ],
      selfCareRitual: 'महत्वपूर्ण बातचीत, मीटिंग्स और अपने आकर्षण व आत्मविश्वास का उत्सव मनाएं।',
      warmTip: 'आपकी बातचीत करने की शैली और आकर्षण इस समय स्वाभाविक रूप से सबसे ज्यादा होता है।'
    },
    luteal: {
      phase: 'luteal',
      name: 'ल्यूटियल चरण (भीतरी शरद ऋतु)',
      seasonMetaphor: 'शरद ऋतु का ठहराव',
      duration: 'दिन 17 से 28',
      energyLevel: 'ठहराव, आत्ममंथन, संवेदनशीलता',
      hormones: 'प्रोजेस्टेरोन सक्रिय होता है और शरीर की चयापचय दर थोड़ी बढ़ जाती है।',
      nutritionOverview: 'जटिल कार्बोहाइड्रेट और मैग्नीशियम से भरपूर भोजन जो मूड स्विंग्स और मीठे की तलब को नियंत्रित रखे।',
      foodsToEmphasize: [
        'शकरकंद, भुने हुए चने और भूरे चावल',
        'केला (विटामिन B6 से भरपूर जो सूजन घटाता है)',
        'सौंफ, अजवाइन और जीरे का गुनगुना पानी',
        'कद्दू और लौकी का सूप',
        'मेथी और मूंग की दाल'
      ],
      seedCycling: 'सूरजमुखी और तिल के बीज जारी रखें ताकि प्रोजेस्टेरोन का स्तर संतुलित रहे।',
      movementOverview: 'मध्यम स्तर का व्यायाम, सहज पिलेट्स और मन को शांत करने वाला योग।',
      recommendedWorkouts: [
        'पिलेट्स और कोर स्ट्रेंथ',
        'हल्के वजन के साथ एक्सरसाइज',
        'शाम की शांत सैर',
        'हठ योग और पश्चिमोत्तानासन'
      ],
      selfCareRitual: 'गुनगुने पानी से स्नान, डायरी लिखना, और अपनी व्यक्तिगत सीमाओं का सम्मान करना।',
      warmTip: 'इस समय थोड़ी ज्यादा भूख लगना पूरी तरह सामान्य है। पौष्टिक स्नैक्स चुनें।'
    }
  },

  hinglish: {
    menstrual: {
      phase: 'menstrual',
      name: 'Menstrual Phase (Inner Winter)',
      seasonMetaphor: 'Winter Rest',
      duration: 'Days 1 – 5',
      energyLevel: 'Low, peaceful, body rest mangti hai',
      hormones: 'Estrogen aur progesterone apne baseline lowest level par hote hain.',
      nutritionOverview: 'Warm, comfort soups aur iron-rich foods jo blood loss ko naturally compensate karein.',
      foodsToEmphasize: [
        'Garam Moong Dal Khichdi desi ghee ke sath',
        'Beetroot juice, palak aur spinach (High Iron)',
        'Adrak-ajwain warm concoction ya herbal tea',
        'Bheege munakke, anjeer aur almonds',
        'Dark Chocolate (70%+ magnesium cramps relief)'
      ],
      seedCycling: 'Flaxseeds aur Pumpkin Seeds (1-1 tbsp daily) estrogen support ke liye.',
      movementOverview: 'Slow aur gentle movements. Body ko bilkul strain na karein.',
      recommendedWorkouts: [
        'Restorative Child’s Pose (Balasana)',
        'Fresh air mein easy slow walking',
        'Pelvic stretching aur deep breathing',
        'Gentle Butterfly pose'
      ],
      selfCareRitual: 'Hot water bottle tummy par lagayein, pairon mein warm oil massage karein aur jaldi so jayein.',
      warmTip: 'Periods ke time guilt-free aaram karna aapki health ke liye best medicine hai.'
    },
    follicular: {
      phase: 'follicular',
      name: 'Follicular Phase (Inner Spring)',
      seasonMetaphor: 'Spring Awakening',
      duration: 'Days 6 – 12',
      energyLevel: 'Rising energy, cheerful, super creative',
      hormones: 'Estrogen tezi se badhta hai aur ovaries mein new eggs mature hote hain.',
      nutritionOverview: 'Fresh, light, probiotic-rich food jo liver detox aur hormonal balance mein help kare.',
      foodsToEmphasize: [
        'Fresh homemade dahi / buttermilk (Chaas)',
        'Sprouted moong chat, chana aur fresh salads',
        'Green vegetables, broccoli aur cucumbers',
        'Healthy fats jaise avocado, olive oil aur nuts',
        'Fresh seasonal fruits aur lemon water'
      ],
      seedCycling: 'Flaxseeds aur Pumpkin seeds ovulation day tak continue karein.',
      movementOverview: 'Brisk cardio, dynamic flow aur energy-boosting workouts ka perfect time.',
      recommendedWorkouts: [
        'Surya Namaskar aur Vinyasa Yoga',
        'Outdoor jogging, dancing ya cycling',
        'Pilates aur moderate weight training',
        'Zumba ya high-step workout'
      ],
      selfCareRitual: 'New ideas plan karein, social hangout plan karein aur creative projects shuru karein.',
      warmTip: 'Aapka mind is phase mein best focus aur quick learning state mein hota hai!'
    },
    ovulatory: {
      phase: 'ovulatory',
      name: 'Ovulatory Phase (Inner Summer)',
      seasonMetaphor: 'Summer Glow',
      duration: 'Days 13 – 16',
      energyLevel: 'Peak energy, magnetic personality, glowing skin',
      hormones: 'LH hormone surge karta hai aur estrogen peak par pahunchta hai.',
      nutritionOverview: 'Hydrating, colorful, anti-inflammatory food jo egg health aur ovulation ko boost kare.',
      foodsToEmphasize: [
        'Anar (pomegranate), berries aur colorful veggies',
        'Fresh coconut water aur cooling mint chaas',
        'Chia seeds aur walnuts (Omega-3 rich)',
        'Turmeric almond milk',
        'Lentil soups aur steamed greens'
      ],
      seedCycling: 'Ab Sunflower Seeds aur Sesame Seeds (Til) 1-1 tbsp daily start karein.',
      movementOverview: 'Heavy weights, challenging HIIT aur intense workouts ke liye best window.',
      recommendedWorkouts: [
        'HIIT cardio & circuit sessions',
        'Challenging strength training',
        'Power Yoga',
        'Group spin or dance class'
      ],
      selfCareRitual: 'Important presentations dein, tough discussions karein aur apni radiant energy celebrate karein.',
      warmTip: 'Aapka communication aur confidence is week naturally highest point par rehta hai.'
    },
    luteal: {
      phase: 'luteal',
      name: 'Luteal Phase (Inner Autumn / Pre-Period)',
      seasonMetaphor: 'Autumn Grounding',
      duration: 'Days 17 – 28',
      energyLevel: 'Grounded, nesting, thoda sensitive',
      hormones: 'Progesterone lead karta hai, jisse body temperature aur calorie needs 100-250 kcal badh jaati hain.',
      nutritionOverview: 'Complex slow-release carbs aur magnesium jo mood swings aur cravings ko smoothly control karein.',
      foodsToEmphasize: [
        'Sweet potatoes (Shakarkand), bhune chane aur brown rice',
        'Kela (Vitamin B6 bloating ko reduce karta hai)',
        'Saunf-ajwain-jeera tea digestive comfort ke liye',
        'Kaddu (Pumpkin) aur lauki soups',
        'Warm dal with cumin tadka'
      ],
      seedCycling: 'Sunflower aur Sesame seeds continue karein to support balanced progesterone.',
      movementOverview: 'Moderate strength, relaxing walks aur restorative stretching.',
      recommendedWorkouts: [
        'Gentle Pilates & core stability',
        'Light dumbbells ke sath strength training',
        'Evening calm stroll in nature',
        'Hatha Yoga with deep forward bends'
      ],
      selfCareRitual: 'Warm bath lein, room cozy banayein, journaling karein aur boundary set karein.',
      warmTip: 'Pre-period time cravings normal hain. Processed sugar ke badle dates ya jaggery choose karein.'
    }
  }
};
