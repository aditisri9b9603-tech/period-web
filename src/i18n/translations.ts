export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '✨' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🌸' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish', flag: '💬' },
];

export interface TranslationDictionary {
  // Brand & Navigation
  brandName: string;
  tagline: string;
  home: string;
  cycleTracker: string;
  phaseGuide: string;
  symptoms: string;
  sakhiAi: string;
  talkToSakhi: string;
  forum: string;
  buddy: string;
  products: string;
  findGynac: string;
  sakhiMusic: string;
  productGuide: string;
  compareProducts: string;
  moreCare: string;
  yoga: string;
  doctors: string;
  vibes: string;
  insights: string;
  settings: string;
  signIn: string;
  signOut: string;
  guestUser: string;
  welcomeBack: string;

  // Header & Banner
  cycleCompanion: string;
  headerSub: string;
  todayIs: string;
  currentPhase: string;
  dayOfCycle: string;
  daysRemaining: string;
  estimatedOvulation: string;
  nextPeriodIn: string;
  days: string;
  lowChanceFertility: string;
  highChanceFertility: string;
  peakFertility: string;

  // Cycle Phases
  phaseMenstrual: string;
  phaseMenstrualDesc: string;
  phaseFollicular: string;
  phaseFollicularDesc: string;
  phaseOvulatory: string;
  phaseOvulatoryDesc: string;
  phaseLuteal: string;
  phaseLutealDesc: string;

  // Cycle Actions
  logPeriodStart: string;
  periodStartedToday: string;
  editCycleDetails: string;
  cycleLengthLabel: string;
  periodDurationLabel: string;
  lastPeriodDate: string;
  saveCycleSettings: string;
  savedSuccessfully: string;

  // Symptom Logging
  logSymptoms: string;
  symptomsSub: string;
  flowIntensity: string;
  flowNone: string;
  flowSpotting: string;
  flowLight: string;
  flowMedium: string;
  flowHeavy: string;
  
  crampsLevel: string;
  crampsNone: string;
  crampsMild: string;
  crampsModerate: string;
  crampsSevere: string;

  moodLabel: string;
  moodHappy: string;
  moodCalm: string;
  moodSensitive: string;
  moodAnxious: string;
  moodIrritable: string;
  moodExhausted: string;

  energyLabel: string;
  energyHigh: string;
  energyBalanced: string;
  energyLow: string;
  energyDrained: string;

  otherSymptoms: string;
  bloating: string;
  headache: string;
  backache: string;
  tenderBreasts: string;
  acne: string;
  cravings: string;
  insomnia: string;
  digestiveIssues: string;

  notesPlaceholder: string;
  saveDailyLog: string;
  dailyLogSavedNotice: string;

  // Phase Guidance / Syncing
  phaseGuidanceTitle: string;
  phaseGuidanceSub: string;
  nutritionTitle: string;
  movementTitle: string;
  mindfulnessTitle: string;
  seedCyclingTitle: string;
  suggestedFoods: string;
  suggestedActivities: string;

  // Talk to Sakhi (Didi/Bestie Voice AI)
  talkToSakhiTitle: string;
  talkToSakhiSub: string;
  tapAndTalk: string;
  listeningWave: string;
  sakhiThinking: string;
  sakhiSpeaking: string;
  askByText: string;
  justTalk: string;
  talkToSakhiPlaceholder: string;
  bestieBadge: string;
  ventOrAsk: string;

  // Sakhi AI Chat (Existing)
  sakhiChatTitle: string;
  sakhiChatSub: string;
  sakhiAiBadge: string;
  sakhiAiDisclaimer: string;
  sakhiGreeting: string;
  thinkingModeActive: string;
  lowLatencyMode: string;
  standardMode: string;
  highThinkingMode: string;
  modeSelectLabel: string;
  askSakhiPlaceholder: string;
  sendBtn: string;
  speakBtn: string;
  stopSpeakingBtn: string;
  listeningBtn: string;
  quickPromptsLabel: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  quickPrompt4: string;
  sakhiThinkingNotice: string;
  sakhiErrorNotice: string;
  clearChat: string;
  chatLanguagePrompt: string;

  // Anonymous Forum
  forumTitle: string;
  forumSub: string;
  createPost: string;
  anonymousBadge: string;
  postTopicLabel: string;
  postContentPlaceholder: string;
  postSubmit: string;
  filterAll: string;
  replies: string;
  likeAction: string;

  // Buddy System (WhatsApp)
  buddyTitle: string;
  buddySub: string;
  whatsAppShareTitle: string;
  notifyBuddy: string;
  periodAlertMsg: string;
  crampSosMsg: string;
  cravingChaiMsg: string;
  highEnergyMsg: string;

  // Products & Video Tutorials
  productsTitle: string;
  productsSub: string;
  videoTutorialsTitle: string;
  watchTutorial: string;
  buyOrLearn: string;

  // Yoga & Diet Videos
  yogaTitle: string;
  yogaSub: string;
  watchYogaPractice: string;
  benefits: string;

  // Doctor & Hospitals Directory
  doctorsTitle: string;
  doctorsSub: string;
  verifiedSpecialist: string;
  bookConsultation: string;
  callHospital: string;

  // Spotify Vibes
  vibesTitle: string;
  vibesSub: string;
  listenPlaylist: string;

  // Insights & Calendar
  calendarTitle: string;
  calendarSub: string;
  predictedPeriod: string;
  loggedPeriod: string;
  ovulationWindow: string;
  historicalAverages: string;
  avgCycleLength: string;
  avgPeriodLength: string;
  cycleRegularity: string;
  regular: string;

  // Auth & Profile
  accountTitle: string;
  accountSub: string;
  continueWithGoogle: string;
  continueAsGuest: string;
  syncAccountData: string;
  privacyCommitment: string;
  privacyBody: string;

  // Accessibility & UI common
  loading: string;
  welcomeHaven: string;
  bloomingSanctuary: string;
  enterSanctuary: string;
  errorGeneric: string;
  retry: string;
  close: string;
  cancel: string;
  confirm: string;
  selectLanguage: string;
  changeLanguage: string;
  gentleAnimationToggle: string;
  animationsEnabled: string;
  animationsMuted: string;
  allRightsReserved: string;
  wellnessCompanionFooter: string;
  medicalEmergencyWarning: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    brandName: "Sakhi Cycle",
    tagline: "Understand • Track • Thrive",
    home: "Today's Circle",
    cycleTracker: "Cycle Tracker",
    phaseGuide: "Phase Syncing",
    symptoms: "Daily Log",
    sakhiAi: "Sakhi AI",
    talkToSakhi: "Talk to Sakhi 🌸",
    forum: "Sisterhood Forum",
    buddy: "Sakhi Buddy",
    products: "Period Products 🩷",
    findGynac: "Find a Gynac 🩺",
    sakhiMusic: "Sakhi Music 🎵",
    productGuide: "Product Guide",
    compareProducts: "Compare & Buy",
    moreCare: "More Care ▾",
    yoga: "Yoga & Diet",
    doctors: "Doctors & Clinics",
    vibes: "Vibes & Spotify",
    insights: "Calendar & Trends",
    settings: "Settings",
    signIn: "Sign In",
    signOut: "Sign Out",
    guestUser: "Sakhi Guest",
    welcomeBack: "Welcome back, dear",

    cycleCompanion: "Gentle Cycle Harmony",
    headerSub: "Nurturing your body through every rhythm and season.",
    todayIs: "Today is",
    currentPhase: "Current Phase",
    dayOfCycle: "Cycle Day",
    daysRemaining: "days remaining",
    estimatedOvulation: "Est. Ovulation",
    nextPeriodIn: "Next Period In",
    days: "days",
    lowChanceFertility: "Low chance of conception",
    highChanceFertility: "Elevated fertility window",
    peakFertility: "Peak fertile ovulation day",

    phaseMenstrual: "Menstrual Phase",
    phaseMenstrualDesc: "A time of release, intuition, and quiet restoration. Your body's inner winter.",
    phaseFollicular: "Follicular Phase",
    phaseFollicularDesc: "Fresh energy arrives as estrogen blooms. Ideal for planning, creativity, and new beginnings.",
    phaseOvulatory: "Ovulatory Phase",
    phaseOvulatoryDesc: "Peak confidence, magnetic communication, and vital radiance. Your inner summer.",
    phaseLuteal: "Luteal Phase",
    phaseLutealDesc: "Progesterone grounds you. Time to nest, wrap up tasks, and honor self-care.",

    logPeriodStart: "Period Started Today",
    periodStartedToday: "Mark Day 1 of Period",
    editCycleDetails: "Adjust Cycle Parameters",
    cycleLengthLabel: "Average Cycle Length (days)",
    periodDurationLabel: "Period Duration (days)",
    lastPeriodDate: "First Day of Last Period",
    saveCycleSettings: "Save Cycle Settings",
    savedSuccessfully: "Saved gently to your health profile.",

    logSymptoms: "Log Today's Wellness",
    symptomsSub: "Check in with your body, mind, and energy.",
    flowIntensity: "Flow Level",
    flowNone: "None",
    flowSpotting: "Spotting",
    flowLight: "Light",
    flowMedium: "Medium",
    flowHeavy: "Heavy",

    crampsLevel: "Cramps & Discomfort",
    crampsNone: "None",
    crampsMild: "Mild / Achy",
    crampsModerate: "Moderate cramps",
    crampsSevere: "Severe discomfort",

    moodLabel: "Emotional Landscape",
    moodHappy: "Content & Joyful",
    moodCalm: "Peaceful",
    moodSensitive: "Gentle / Sensitive",
    moodAnxious: "Anxious / Restless",
    moodIrritable: "Irritable",
    moodExhausted: "Exhausted",

    energyLabel: "Energy Level",
    energyHigh: "Vibrant & Radiant",
    energyBalanced: "Steady & Balanced",
    energyLow: "Low & Cozy",
    energyDrained: "Need Rest",

    otherSymptoms: "Physical Sensations",
    bloating: "Bloating",
    headache: "Headache",
    backache: "Lower Back Ache",
    tenderBreasts: "Breast Tenderness",
    acne: "Skin Breakouts",
    cravings: "Food Cravings",
    insomnia: "Restless Sleep",
    digestiveIssues: "Digestive Sensitivity",

    notesPlaceholder: "Write any heartfelt notes or thoughts for today...",
    saveDailyLog: "Save Daily Entry",
    dailyLogSavedNotice: "Your daily check-in has been lovingly recorded.",

    phaseGuidanceTitle: "Phase-Syncing Lifestyle Guide",
    phaseGuidanceSub: "Harmonize your nutrition, exercise, and mindfulness with your hormones.",
    nutritionTitle: "Nourishing Foods",
    movementTitle: "Mindful Movement",
    mindfulnessTitle: "Rest & Rituals",
    seedCyclingTitle: "Seed Cycling Ritual",
    suggestedFoods: "Suggested Nutrient-Rich Foods",
    suggestedActivities: "Optimal Movement for This Phase",

    // Talk to Sakhi (Voice Bestie)
    talkToSakhiTitle: "Talk to Sakhi 🌸",
    talkToSakhiSub: "Your sweetest supportive Indian bestie & Didi. Vent, ask questions, or just chat!",
    tapAndTalk: "Tap & Talk 🎙️",
    listeningWave: "Listening... 🎧",
    sakhiThinking: "Sakhi is thinking... ✨",
    sakhiSpeaking: "Sakhi is speaking... 💕",
    askByText: "Ask by Text 💬",
    justTalk: "Just Talk 🎙️",
    talkToSakhiPlaceholder: "Type to your Sakhi bestie... (e.g. Aaj mood bahut kharab hai 🥺)",
    bestieBadge: "Your Caring Voice Didi 💗",
    ventOrAsk: "Vent, share your day, ask anything about your cycle or feelings.",

    // Sakhi AI Chat
    sakhiChatTitle: "Sakhi AI Companion",
    sakhiChatSub: "Caring, confidential conversation for cycle health, nutrition, and comfort.",
    sakhiAiBadge: "AI Wellness Assistant • Not a Doctor",
    sakhiAiDisclaimer: "Sakhi AI offers supportive wellness guidance and lifestyle tips. She is an AI assistant, not a doctor or medical provider. Please seek professional clinical advice for medical diagnoses, severe pain, or health emergencies.",
    sakhiGreeting: "Namaste, dear. I am Sakhi, your AI wellness companion. How is your body feeling today? You can ask me anything about your cycle, hormonal rhythm, comforting remedies, or nutrition.",
    thinkingModeActive: "Deep Reasoning Active (Gemini Pro)",
    lowLatencyMode: "Fast Response (Flash Lite)",
    standardMode: "Balanced (Gemini Flash)",
    highThinkingMode: "Deep Reflection (Pro Thinking)",
    modeSelectLabel: "AI Reflection Mode",
    askSakhiPlaceholder: "Ask Sakhi in English, Hindi, or Hinglish...",
    sendBtn: "Send",
    speakBtn: "Listen Aloud",
    stopSpeakingBtn: "Stop Voice",
    listeningBtn: "Listening...",
    quickPromptsLabel: "Helpful Inquiries",
    quickPrompt1: "How can I naturally ease menstrual cramps today?",
    quickPrompt2: "What should I eat during the luteal phase for cravings?",
    quickPrompt3: "Can you explain seed cycling for hormonal balance?",
    quickPrompt4: "Is an irregular 35-day cycle normal?",
    sakhiThinkingNotice: "Sakhi is reflecting deeply on your inquiry...",
    sakhiErrorNotice: "Sakhi could not connect right now. Please try again in a moment.",
    clearChat: "Clear Conversation",
    chatLanguagePrompt: "Sakhi replies warmly in your chosen language.",

    // Forum
    forumTitle: "Sisterhood Anonymous Forum",
    forumSub: "A safe, gentle haven to ask questions, vent, and share love with fellow women.",
    createPost: "Share in the Circle",
    anonymousBadge: "100% Anonymous & Stigma-Free",
    postTopicLabel: "Category",
    postContentPlaceholder: "Share your heartfelt thoughts, questions or experiences anonymously...",
    postSubmit: "Post to Sisterhood",
    filterAll: "All Topics",
    replies: "Replies",
    likeAction: "Send Love 💗",

    // Buddy System
    buddyTitle: "Sakhi Buddy & WhatsApp Sync",
    buddySub: "Keep your trusted sister, bestie, mom, or partner lovingly in the loop.",
    whatsAppShareTitle: "Send Warm WhatsApp Check-in",
    notifyBuddy: "Share via WhatsApp",
    periodAlertMsg: "🌸 Hey Sakhi! My period just started today. Sending warm hugs and cozy vibes! 🩸🍫",
    crampSosMsg: "🥺 Hey dear, feeling some cramps today. Resting with a warm water bottle and thinking of you! 💕",
    cravingChaiMsg: "☕ Craving some hot ginger chai & dark chocolate in my luteal phase today! How are you feeling?",
    highEnergyMsg: "✨ My follicular energy is blooming today! Let's catch up or take a refreshing walk together! 🌷",

    // Products & Tutorials
    productsTitle: "Period Care & Essentials",
    productsSub: "Curated body-safe period wellness products paired with verified video tutorials.",
    videoTutorialsTitle: "Step-by-Step Video Guides",
    watchTutorial: "Watch Video Guide",
    buyOrLearn: "Learn More",

    // Yoga & Diet
    yogaTitle: "Cycle-Synced Yoga & Daily Nourishment",
    yogaSub: "Gentle restorative movement and nutrient-dense recipes matched to your current cycle phase.",
    watchYogaPractice: "Play Guided Session",
    benefits: "Benefits for your body",

    // Doctor & Hospitals
    doctorsTitle: "Trusted Doctors & Women's Clinics",
    doctorsSub: "Real verified gynecologists, obstetricians, and renowned women's health facilities.",
    verifiedSpecialist: "Verified Gynecologist",
    bookConsultation: "Consultation Info",
    callHospital: "Call Hospital Helpline",

    // Spotify Vibes
    vibesTitle: "Vibes & Soothing Playlists",
    vibesSub: "Immerse yourself in gentle lo-fi, menstrual calm, and soothing sleep soundscapes.",
    listenPlaylist: "Play on Spotify",

    // Insights & Calendar
    calendarTitle: "Cycle Horizon & Predictions",
    calendarSub: "View projected fertile windows, luteal weeks, and future cycles.",
    predictedPeriod: "Predicted Period",
    loggedPeriod: "Logged Flow",
    ovulationWindow: "Fertility Window",
    historicalAverages: "Your Cycle Trends",
    avgCycleLength: "Average Cycle",
    avgPeriodLength: "Average Period",
    cycleRegularity: "Predictability",
    regular: "Healthy & Consistent",

    // Auth & Profile
    accountTitle: "Personal Sanctuary",
    accountSub: "Manage your profile, sync your cycle history, and privacy preferences.",
    continueWithGoogle: "Sign in with Google",
    continueAsGuest: "Continue as Guest",
    syncAccountData: "Keep your cycle history synced securely across your devices.",
    privacyCommitment: "Our Privacy Promise",
    privacyBody: "Your cycle and symptom logs are deeply personal. Sakhi treats your data with utmost confidentiality, never sells health insights, and provides complete control to export or reset your records at any time.",

    // Accessibility & UI common
    loading: "Loading your sanctuary...",
    welcomeHaven: "Welcome to Sakhi Cycle",
    bloomingSanctuary: "Blooming your serene wellness garden...",
    enterSanctuary: "Enter Haven 🌸",
    errorGeneric: "An unexpected hiccup occurred. Please try again.",
    retry: "Try Again",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    selectLanguage: "Select Language",
    changeLanguage: "Change Language",
    gentleAnimationToggle: "Floral Petals & Cherry Blossoms",
    animationsEnabled: "Floating Blossoms On",
    animationsMuted: "Calm View (Motion Muted)",
    allRightsReserved: "All rights reserved. Dedicated to womanhood and hormonal balance.",
    wellnessCompanionFooter: "Sakhi Cycle • Handcrafted with love for your wellbeing.",
    medicalEmergencyWarning: "If you experience unmanageable acute pain, sudden heavy bleeding, or severe symptoms, please visit a healthcare facility immediately."
  },

  hi: {
    brandName: "सखी साइकिल",
    tagline: "Understand • Track • Thrive",
    home: "आज का चक्र",
    cycleTracker: "साइकिल ट्रैकर",
    phaseGuide: "फेज़ गाइड",
    symptoms: "दैनिक डायरी",
    sakhiAi: "सखी AI",
    talkToSakhi: "सखी से बात करें 🌸",
    forum: "सखी चौपाल (Anonymous)",
    buddy: "सखी बडी (WhatsApp)",
    products: "पीरियड प्रोडक्ट्स 🩷",
    findGynac: "गायनैक खोजें 🩺",
    sakhiMusic: "सखी म्यूज़िक 🎵",
    productGuide: "प्रोडक्ट गाइड",
    compareProducts: "तुलना और खरीदें",
    moreCare: "अन्य सुविधाएं ▾",
    yoga: "योग और आहार",
    doctors: "डॉक्टर व अस्पताल",
    vibes: "संगीत व सुकून (Spotify)",
    insights: "कैलेंडर और रुझान",
    settings: "सेटिंग्स",
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    guestUser: "सखी मेहमान",
    welcomeBack: "पुनः स्वागत है, सखी",

    cycleCompanion: "सहज मासिक चक्र सामंजस्य",
    headerSub: "आपके शरीर के हर प्राकृतिक पड़ाव और मौसम का स्नेहमयी ख्याल।",
    todayIs: "आज की तारीख",
    currentPhase: "वर्तमान चरण",
    dayOfCycle: "चक्र का दिन",
    daysRemaining: "दिन शेष",
    estimatedOvulation: "अनुमानित ओव्यूलेशन",
    nextPeriodIn: "अगला पीरियड आने में",
    days: "दिन",
    lowChanceFertility: "गर्भधारण की कम संभावना",
    highChanceFertility: "प्रजनन क्षमता का सक्रिय समय",
    peakFertility: "चरम ओव्यूलेशन का दिन",

    phaseMenstrual: "मासिक धर्म चरण (Menstrual)",
    phaseMenstrualDesc: "विश्राम, शांत चिंतन और शारीरिक शुद्धि का समय। यह आपके शरीर की भीतरी शीत ऋतु है।",
    phaseFollicular: "फॉलिक्युलर चरण (Follicular)",
    phaseFollicularDesc: "एस्ट्रोजन बढ़ने के साथ नई ऊर्जा का आगमन। योजना बनाने और नई शुरुआत के लिए उत्तम समय।",
    phaseOvulatory: "ओव्यूलेटरी चरण (Ovulatory)",
    phaseOvulatoryDesc: "आत्मविश्वास, ऊर्जा और आकर्षण का चरम समय। यह आपकी आंतरिक ग्रीष्म ऋतु है।",
    phaseLuteal: "ल्यूटियल चरण (Luteal)",
    phaseLutealDesc: "प्रोजेस्टेरोन का प्रभाव। आराम करने, कार्य पूरे करने और स्वयं की देखभाल का समय।",

    logPeriodStart: "पीरियड आज शुरू हुआ",
    periodStartedToday: "पीरियड का पहला दिन दर्ज करें",
    editCycleDetails: "साइकिल की जानकारी बदलें",
    cycleLengthLabel: "औसत चक्र की अवधि (दिन)",
    periodDurationLabel: "पीरियड की अवधि (दिन)",
    lastPeriodDate: "पिछले पीरियड का पहला दिन",
    saveCycleSettings: "साइकिल सेटिंग्स सहेजें",
    savedSuccessfully: "आपकी सेहत प्रोफ़ाइल में सुरक्षित दर्ज कर दिया गया।",

    logSymptoms: "आज के स्वास्थ्य का हिसाब",
    symptomsSub: "अपने शरीर, मन और ऊर्जा की स्थिति दर्ज करें।",
    flowIntensity: "रक्तप्रवाह (Flow)",
    flowNone: "कुछ नहीं",
    flowSpotting: "हल्के धब्बे (Spotting)",
    flowLight: "हल्का (Light)",
    flowMedium: "मध्यम (Medium)",
    flowHeavy: "अधिक (Heavy)",

    crampsLevel: "ऐंठन और दर्द",
    crampsNone: "बिल्कुल नहीं",
    crampsMild: "हल्का दर्द",
    crampsModerate: "मध्यम ऐंठन",
    crampsSevere: "तीव्र असुविधा",

    moodLabel: "मन की स्थिति (Mood)",
    moodHappy: "प्रसन्न और आनंदित",
    moodCalm: "शांत व सहज",
    moodSensitive: "भावुक / संवेदनशील",
    moodAnxious: "चिंतित / बेचैन",
    moodIrritable: "चिड़चिड़ापन",
    moodExhausted: "थका हुआ",

    energyLabel: "ऊर्जा का स्तर",
    energyHigh: "उत्साही और ऊर्जावान",
    energyBalanced: "संतुलित",
    energyLow: "कम व सुस्त",
    energyDrained: "आराम की सख्त ज़रूरत",

    otherSymptoms: "शारीरिक लक्षण",
    bloating: "पेट फूलना (Bloating)",
    headache: "सिरदर्द",
    backache: "कमर दर्द",
    tenderBreasts: "स्तनों में संवेदनशीलता",
    acne: "मुंहासे (Acne)",
    cravings: "मीठा/नमकीन खाने की तीव्र इच्छा",
    insomnia: "नींद न आना",
    digestiveIssues: "पाचन संबंधी समस्या",

    notesPlaceholder: "आज के अनुभव या विचार यहाँ लिखें...",
    saveDailyLog: "दैनिक प्रविष्टि सहेजें",
    dailyLogSavedNotice: "आज की प्रविष्टि प्रेमपूर्वक दर्ज कर ली गई है।",

    phaseGuidanceTitle: "चरण-आधारित जीवनशैली गाइड",
    phaseGuidanceSub: "हार्मोनल बदलाव के अनुसार खानपान, योग और दिनचर्या को अनुकूल बनाएं।",
    nutritionTitle: "पौष्टिक आहार",
    movementTitle: "सहज योग व व्यायाम",
    mindfulnessTitle: "विश्राम और ध्यान",
    seedCyclingTitle: "बीज चक्र (Seed Cycling)",
    suggestedFoods: "इस चरण के लिए अनुकूल पौष्टिक भोजन",
    suggestedActivities: "इस चरण के लिए उत्तम शारीरिक गतिविधियाँ",

    // Talk to Sakhi (Hindi)
    talkToSakhiTitle: "सखी से दिल की बात 🌸",
    talkToSakhiSub: "आपकी अपनी प्यारी दीदी और बेस्टी। दिल खोलकर बोलें, शिकायत करें या सवाल पूछें!",
    tapAndTalk: "टैप करें और बोलें 🎙️",
    listeningWave: "सखी सुन रही है... 🎧",
    sakhiThinking: "सखी सोच रही है... ✨",
    sakhiSpeaking: "सखी बोल रही है... 💕",
    askByText: "लिखकर पूछें 💬",
    justTalk: "बस बातें करें 🎙️",
    talkToSakhiPlaceholder: "अपनी सखी दीदी से कुछ भी कहें... (जैसे: आज मन बहुत उदास है 🥺)",
    bestieBadge: "आपकी अपनी प्यारी दीदी 💗",
    ventOrAsk: "दिनभर की बात, मूड या पीरियड्स के बारे में बेझिझक बोलें।",

    // Sakhi AI Chat
    sakhiChatTitle: "सखी AI साथी",
    sakhiChatSub: "मासिक धर्म, हार्मोनल संतुलन और घरेलू नुस्खों के लिए संवेदनशील बातचीत।",
    sakhiAiBadge: "AI स्वास्थ्य सहायिका • डॉक्टर नहीं",
    sakhiAiDisclaimer: "सखी AI केवल सामान्य कल्याण और जीवनशैली सुझाव देती है। यह एक कृत्रिम बुद्धिमत्ता सहायिका है, कोई डॉक्टर या आपातकालीन सेवा नहीं। किसी भी चिकित्सीय समस्या या तीव्र दर्द के लिए कृपया डॉक्टर से परामर्श लें।",
    sakhiGreeting: "नमस्ते सखी! मैं आपकी AI स्वास्थ्य साथी 'सखी' हूँ। आज आपका शरीर और मन कैसा महसूस कर रहा है? आप मुझसे पीरियड, खानपान, दर्द निवारण या हार्मोनल संतुलन से जुड़ा कोई भी सवाल पूछ सकती हैं।",
    thinkingModeActive: "गहन विचार मोड सक्रिय (Gemini Pro)",
    lowLatencyMode: "त्वरित प्रतिक्रिया (Flash Lite)",
    standardMode: "संतुलित (Gemini Flash)",
    highThinkingMode: "गहन विश्लेषण (Pro Thinking)",
    modeSelectLabel: "AI विचार मोड",
    askSakhiPlaceholder: "सखी से हिंदी, हिंग्लिश या अंग्रेज़ी में पूछें...",
    sendBtn: "भेजें",
    speakBtn: "आवाज़ में सुनें",
    stopSpeakingBtn: "आवाज़ रोकें",
    listeningBtn: "सुन रही हूँ...",
    quickPromptsLabel: "अक्सर पूछे जाने वाले सवाल",
    quickPrompt1: "पीरियड के असहनीय दर्द को घरेलू उपाय से कैसे कम करें?",
    quickPrompt2: "ल्यूटियल फेज में क्या खाएं ताकि कमजोरी न लगे?",
    quickPrompt3: "हार्मोन संतुलित रखने के लिए सीड साइकलिंग कैसे करें?",
    quickPrompt4: "क्या 35 दिन का पीरियड साइकिल सामान्य है?",
    sakhiThinkingNotice: "सखी आपके प्रश्न पर विचार कर रही है...",
    sakhiErrorNotice: "सखी से अभी संपर्क नहीं हो पाया। कृपया कुछ क्षण बाद पुनः प्रयास करें।",
    clearChat: "बातचीत मिटाएं",
    chatLanguagePrompt: "सखी आपकी चुनी हुई भाषा में आत्मीयता से उत्तर देती है।",

    // Forum
    forumTitle: "सखी चौपाल (गुमनाम मंच)",
    forumSub: "बिना किसी संकोच के अपने सवाल पूछें, अनुभव साझा करें और बहनों से प्यार पाएं।",
    createPost: "चौपाल में अपनी बात रखें",
    anonymousBadge: "100% सुरक्षित और पूर्णतः गुप्त",
    postTopicLabel: "विषय चुनें",
    postContentPlaceholder: "अपने अनुभव, सवाल या दिल की बात यहाँ बेझिझक लिखें...",
    postSubmit: "चौपाल पर साझा करें",
    filterAll: "सभी विषय",
    replies: "जवाब",
    likeAction: "स्नेह भेजें 💗",

    // Buddy System
    buddyTitle: "सखी बडी व WhatsApp अलर्ट",
    buddySub: "अपनी बहन, सहेली, माँ या साथी को WhatsApp पर एक क्लिक में अपडेट रखें।",
    whatsAppShareTitle: "WhatsApp पर प्यार भरा संदेश भेजें",
    notifyBuddy: "WhatsApp पर शेयर करें",
    periodAlertMsg: "🌸 नमस्ते सखी! मेरा पीरियड आज शुरू हुआ है। बहुत सारा प्यार और थोड़ी सी गर्माहट चाहिए! 🩸🍫",
    crampSosMsg: "🥺 सखी, आज पेट में थोड़ा दर्द है। गर्म पानी की थैली लेकर आराम कर रही हूँ, तुम्हारी याद आई! 💕",
    cravingChaiMsg: "☕ आज गर्म अदरक वाली चाय और डार्क चॉकलेट की तलब हो रही है! तुम कैसी हो?",
    highEnergyMsg: "✨ आज शरीर में बहुत ताज़गी और ऊर्जा है! चलो थोड़ी देर सैर करते हैं या गपशप करते हैं! 🌷",

    // Products & Tutorials
    productsTitle: "पीरियड वेलनेस उत्पाद",
    productsSub: "विश्वसनीय, सुरक्षित उत्पाद और उनके उपयोग के प्रमाणित वीडियो ट्यूटोरियल।",
    videoTutorialsTitle: "वीडियो गाइड (YouTube)",
    watchTutorial: "वीडियो गाइड देखें",
    buyOrLearn: "अधिक जानकारी",

    // Yoga & Diet
    yogaTitle: "मासिक चक्र योग व दैनिक पोषण",
    yogaSub: "दर्द निवारक योग सत्र, मुद्राएं और हार्मोन संतुलन के लिए पौष्टिक भोजन।",
    watchYogaPractice: "योग वीडियो चलाएं",
    benefits: "शरीर को लाभ",

    // Doctor & Hospitals
    doctorsTitle: "विशेषज्ञ स्त्री रोग डॉक्टर व अस्पताल",
    doctorsSub: "सत्यापित अनुभवी महिला रोग विशेषज्ञ और प्रमुख अस्पताल।",
    verifiedSpecialist: "प्रमाणित स्त्री रोग विशेषज्ञ",
    bookConsultation: "परामर्श जानकारी",
    callHospital: "हेल्पलाइन पर कॉल करें",

    // Spotify Vibes
    vibesTitle: "संगीत व सुकून (Spotify)",
    vibesSub: "शांत संगीत, लो-फाइ बीट्स और आरामदायक नींद के लिए ध्वनि तरंगें।",
    listenPlaylist: "Spotify पर सुनें",

    // Insights & Calendar
    calendarTitle: "साइकिल कैलेंडर और भविष्यवाणियां",
    calendarSub: "आगामी पीरियड्स, प्रजनन काल और मासिक रुझान देखें।",
    predictedPeriod: "अनुमानित पीरियड",
    loggedPeriod: "दर्ज पीरियड",
    ovulationWindow: "प्रजनन खिड़की",
    historicalAverages: "आपके औसत रुझान",
    avgCycleLength: "औसत चक्र",
    avgPeriodLength: "औसत पीरियड",
    cycleRegularity: "नियमितता",
    regular: "स्वस्थ और नियमित",

    // Auth & Profile
    accountTitle: "व्यक्तिगत प्रोफ़ाइल",
    accountSub: "अपनी प्रोफ़ाइल, चक्र डेटा और गोपनीयता प्राथमिकताओं को प्रबंधित करें।",
    continueWithGoogle: "Google से साइन इन करें",
    continueAsGuest: "मेहमान के रूप में जारी रखें",
    syncAccountData: "अपने डेटा को सभी डिवाइसों में सुरक्षित रूप से सिंक रखें।",
    privacyCommitment: "हमारा गोपनीयता वचन",
    privacyBody: "आपका स्वास्थ्य डेटा अत्यंत व्यक्तिगत है। सखी आपके डेटा की पूर्ण गोपनीयता बनाए रखती है, इसे कभी किसी को नहीं बेचती और आपको इसे कभी भी मिटाने या डाउनलोड करने का अधिकार देती है।",

    // Accessibility & UI common
    loading: "तैयार हो रहा है...",
    welcomeHaven: "सखी साइकिल में आपका स्वागत है",
    bloomingSanctuary: "आपका सुखद वेलनेस उपवन खिल रहा है...",
    enterSanctuary: "प्रवेश करें 🌸",
    errorGeneric: "एक छोटी सी समस्या आई। कृपया पुनः प्रयास करें।",
    retry: "पुनः प्रयास करें",
    close: "बंद करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    selectLanguage: "भाषा चुनें",
    changeLanguage: "भाषा बदलें",
    gentleAnimationToggle: "चेरी ब्लॉसम व पंखुड़ियों का एनीमेशन",
    animationsEnabled: "पंखुड़ियां चालू",
    animationsMuted: "शांत दृश्य (एनीमेशन बंद)",
    allRightsReserved: "सर्वाधिकार सुरक्षित। स्त्रीत्व और संपूर्ण स्वास्थ्य को समर्पित।",
    wellnessCompanionFooter: "सखी साइकिल • आपके स्वास्थ्य और सुकून के लिए सप्रेम निर्मित।",
    medicalEmergencyWarning: "यदि आपको अचानक बहुत तेज दर्द या अत्यधिक रक्तस्राव हो, तो कृपया तुरंत किसी नज़दीकी डॉक्टर या अस्पताल से संपर्क करें।"
  },

  hinglish: {
    brandName: "Sakhi Cycle",
    tagline: "Understand • Track • Thrive",
    home: "Aaj Ka Circle",
    cycleTracker: "Cycle Tracker",
    phaseGuide: "Phase Syncing",
    symptoms: "Daily Log",
    sakhiAi: "Sakhi AI",
    talkToSakhi: "Talk to Sakhi 🌸",
    forum: "Sisterhood Forum (Anonymous)",
    buddy: "Sakhi Buddy (WhatsApp)",
    products: "Period Products 🩷",
    findGynac: "Find a Gynac 🩺",
    sakhiMusic: "Sakhi Music 🎵",
    productGuide: "Product Guide",
    compareProducts: "Compare & Buy",
    moreCare: "More Care ▾",
    yoga: "Yoga & Diet",
    doctors: "Doctors & Clinics",
    vibes: "Vibes & Spotify",
    insights: "Calendar & Trends",
    settings: "Settings",
    signIn: "Sign In Karein",
    signOut: "Sign Out",
    guestUser: "Sakhi Guest",
    welcomeBack: "Welcome back, dear",

    cycleCompanion: "Gentle Cycle Harmony",
    headerSub: "Aapki body ke har phase aur season ka loving care.",
    todayIs: "Aaj ki date",
    currentPhase: "Current Phase",
    dayOfCycle: "Cycle Ka Din",
    daysRemaining: "din bache hain",
    estimatedOvulation: "Est. Ovulation",
    nextPeriodIn: "Next Period Aane Mein",
    days: "din",
    lowChanceFertility: "Conception ka low chance",
    highChanceFertility: "High fertility window",
    peakFertility: "Peak ovulation day",

    phaseMenstrual: "Menstrual Phase (Periods)",
    phaseMenstrualDesc: "Rest, quiet healing aur energy recharge ka time. Yeh aapki body ka inner winter hai.",
    phaseFollicular: "Follicular Phase",
    phaseFollicularDesc: "Estrogen badhne se fresh energy aati hai. Planning, new habits aur creativity ke liye best.",
    phaseOvulatory: "Ovulatory Phase",
    phaseOvulatoryDesc: "High confidence, glowing skin aur social energy. Yeh aapka inner summer hai.",
    phaseLuteal: "Luteal Phase (PMS Time)",
    phaseLutealDesc: "Progesterone body ko calm karta hai. Cozy rahne, healthy diet lene aur self-care ka time.",

    logPeriodStart: "Period Aaj Shuru Hua",
    periodStartedToday: "Period Ka Day 1 Mark Karein",
    editCycleDetails: "Cycle Details Adjust Karein",
    cycleLengthLabel: "Average Cycle Length (days)",
    periodDurationLabel: "Period Duration (days)",
    lastPeriodDate: "Last Period Ka First Day",
    saveCycleSettings: "Save Settings",
    savedSuccessfully: "Aapki cycle details successfully save ho gayi hain.",

    logSymptoms: "Aaj Ke Symptoms Log Karein",
    symptomsSub: "Apni body, mood aur energy ka daily check-in karein.",
    flowIntensity: "Flow Level",
    flowNone: "None",
    flowSpotting: "Light Spotting",
    flowLight: "Light Flow",
    flowMedium: "Medium Flow",
    flowHeavy: "Heavy Flow",

    crampsLevel: "Cramps & Pain",
    crampsNone: "Koi dard nahi",
    crampsMild: "Mild / halka dard",
    crampsModerate: "Moderate cramps",
    crampsSevere: "Severe pain / discomfort",

    moodLabel: "Mood Kaisa Hai?",
    moodHappy: "Happy & Radiant",
    moodCalm: "Calm & Relaxed",
    moodSensitive: "Emotional / Sensitive",
    moodAnxious: "Anxious / Restless",
    moodIrritable: "Irritable / Chidchida",
    moodExhausted: "Bahut thaka hua",

    energyLabel: "Energy Level",
    energyHigh: "Super Active & Energetic",
    energyBalanced: "Normal & Balanced",
    energyLow: "Low & Cozy",
    energyDrained: "Need Complete Rest",

    otherSymptoms: "Physical Sensations",
    bloating: "Pet phoolna (Bloating)",
    headache: "Sar dard (Headache)",
    backache: "Kamar dard (Backache)",
    tenderBreasts: "Breast Soreness",
    acne: "Pimples / Acne",
    cravings: "Food Cravings",
    insomnia: "Neend na aana (Insomnia)",
    digestiveIssues: "Digestive Issues",

    notesPlaceholder: "Aaj ka koi khaas feeling ya note likhein...",
    saveDailyLog: "Save Daily Entry",
    dailyLogSavedNotice: "Aapka daily check-in lovingly save ho gaya hai.",

    phaseGuidanceTitle: "Phase-Syncing Lifestyle Guide",
    phaseGuidanceSub: "Apne hormones ke sath nutrition, workouts aur sleep ko sync karein.",
    nutritionTitle: "Nourishing Foods",
    movementTitle: "Gentle Workouts",
    mindfulnessTitle: "Rest & Self-Care",
    seedCyclingTitle: "Seed Cycling Tips",
    suggestedFoods: "Is Phase Ke Liye Best Foods",
    suggestedActivities: "Is Phase Ke Liye Recommended Exercise",

    // Talk to Sakhi (Hinglish)
    talkToSakhiTitle: "Talk to Sakhi 🌸",
    talkToSakhiSub: "Aapki sweetest supportive Indian bestie & Didi. Vent karein, poochhein ya bas gup-shup karein!",
    tapAndTalk: "Tap & Talk 🎙️",
    listeningWave: "Sakhi sun rahi hai... 🎧",
    sakhiThinking: "Sakhi soch rahi hai... ✨",
    sakhiSpeaking: "Sakhi bol rahi hai... 💕",
    askByText: "Text Karke Poochhein 💬",
    justTalk: "Just Talk 🎙️",
    talkToSakhiPlaceholder: "Apni Sakhi bestie se dil ki baat bolein... (e.g. Aaj mood bahut kharab hai 🥺)",
    bestieBadge: "Aapki Caring Voice Didi 💗",
    ventOrAsk: "Vent karein, share your day, ask anything about your cycle or feelings.",

    // Sakhi AI Chat
    sakhiChatTitle: "Sakhi AI Companion",
    sakhiChatSub: "Caring, confidential conversation periods, hormones aur diet ke liye.",
    sakhiAiBadge: "AI Wellness Assistant • Not a Doctor",
    sakhiAiDisclaimer: "Sakhi AI helpful wellness suggestions aur lifestyle guidance deti hai. Yeh ek AI assistant hai, doctor nahi. Severe pain ya medical emergency ke liye please healthcare specialist se consult karein.",
    sakhiGreeting: "Namaste! Main aapki AI wellness companion 'Sakhi' hoon. Aaj aapki tabiyat aur body kaisi feel kar rahi hai? Aap mujhse periods, cramps relief, hormone balance ya diet ke baare mein kuch bhi pooch sakti hain.",
    thinkingModeActive: "Deep Reasoning Mode Active (Gemini Pro)",
    lowLatencyMode: "Fast Mode (Flash Lite)",
    standardMode: "Balanced Mode (Flash)",
    highThinkingMode: "Deep Reflection (Pro Thinking)",
    modeSelectLabel: "AI Reflection Mode",
    askSakhiPlaceholder: "Sakhi se Hinglish, Hindi ya English mein poochhein...",
    sendBtn: "Bhejein",
    speakBtn: "Aawaaz Mein Sunein",
    stopSpeakingBtn: "Voice Band Karein",
    listeningBtn: "Sun rahi hoon...",
    quickPromptsLabel: "Popular Questions",
    quickPrompt1: "Period cramps kam karne ke liye gharelu nuskhe kya hain?",
    quickPrompt2: "Luteal phase mein severe sweet cravings kyun hoti hain?",
    quickPrompt3: "Hormonal balance ke liye seed cycling kaise start karein?",
    quickPrompt4: "Kya 35 days ka cycle normal hota hai?",
    sakhiThinkingNotice: "Sakhi aapke question pe dhyan se reflect kar rahi hai...",
    sakhiErrorNotice: "Sakhi connect nahi ho paayi. Please thodi der baad retry karein.",
    clearChat: "Chat Clear Karein",
    chatLanguagePrompt: "Sakhi aapki selected language mein pyaar se reply karti hai.",

    // Forum
    forumTitle: "Sisterhood Anonymous Forum",
    forumSub: "100% stigma-free and confidential space jahan sabhi ladkiyan bina hesitate kiye share karti hain.",
    createPost: "Circle Mein Post Karein",
    anonymousBadge: "100% Anonymous & Private",
    postTopicLabel: "Topic Choose Karein",
    postContentPlaceholder: "Apne doubts, experiences ya feelings freely likhein...",
    postSubmit: "Post to Forum",
    filterAll: "All Topics",
    replies: "Replies",
    likeAction: "Send Love 💗",

    // Buddy System
    buddyTitle: "Sakhi Buddy & WhatsApp Sync",
    buddySub: "Apni sister, mom, bestie ya partner ko WhatsApp pe directly in-the-loop rakhein.",
    whatsAppShareTitle: "Send Warm WhatsApp Check-in",
    notifyBuddy: "WhatsApp Par Share Karein",
    periodAlertMsg: "🌸 Hey Sakhi! Mera period aaj start ho gaya hai. Thode warm hugs aur hot chocolate bhej do! 🩸🍫",
    crampSosMsg: "🥺 Hey dear, thode cramps ho rahe hain. Heating bag ke sath rest kar rahi hoon, bas update dena tha! 💕",
    cravingChaiMsg: "☕ Craving some hot adrak wali chai and dark chocolate today! Tum kaisi ho?",
    highEnergyMsg: "✨ Aaj follicular energy high hai! Chalo sham ko walk ya coffee pe milte hain! 🌷",

    // Products & Tutorials
    productsTitle: "Period Care Essentials",
    productsSub: "Gentle organic pads, menstrual cups aur certified video tutorials.",
    videoTutorialsTitle: "Video Guides (YouTube)",
    watchTutorial: "Watch Video Guide",
    buyOrLearn: "Learn More",

    // Yoga & Diet
    yogaTitle: "Cycle-Synced Yoga & Nourishment",
    yogaSub: "Cramp relief yoga sessions aur hormone-friendly healthy diet recipes.",
    watchYogaPractice: "Play Guided Session",
    benefits: "Benefits for your body",

    // Doctor & Hospitals
    doctorsTitle: "Verified Doctors & Clinics",
    doctorsSub: "Verified gynecologists, top women's hospitals aur emergency contact numbers.",
    verifiedSpecialist: "Verified Gynecologist",
    bookConsultation: "Consultation Info",
    callHospital: "Call Hospital Helpline",

    // Spotify Vibes
    vibesTitle: "Vibes & Soothing Playlists",
    vibesSub: "Period cramps calming lo-fi, peaceful healing aur cozy deep sleep vibes.",
    listenPlaylist: "Play on Spotify",

    // Insights & Calendar
    calendarTitle: "Cycle Horizon & Predictions",
    calendarSub: "Aane wale periods, ovulation window aur cycle patterns dekhein.",
    predictedPeriod: "Predicted Period",
    loggedPeriod: "Logged Flow",
    ovulationWindow: "Fertility Window",
    historicalAverages: "Aapke Cycle Trends",
    avgCycleLength: "Average Cycle",
    avgPeriodLength: "Average Period",
    cycleRegularity: "Predictability",
    regular: "Regular & Healthy",

    // Auth & Profile
    accountTitle: "Personal Sanctuary",
    accountSub: "Profile, cycle history sync aur privacy preferences manage karein.",
    continueWithGoogle: "Sign in with Google",
    continueAsGuest: "Continue as Guest",
    syncAccountData: "Apne cycle data ko sabhi devices mein securely sync rakhein.",
    privacyCommitment: "Hamara Privacy Promise",
    privacyBody: "Aapka health data 100% private hai. Sakhi aapka data kisi ko sell nahi karti aur aapko poora control deti hai kabhi bhi data export ya clear karne ka.",

    // Accessibility & UI common
    loading: "Loading your sanctuary...",
    welcomeHaven: "Welcome to Sakhi Cycle",
    bloomingSanctuary: "Blooming your serene wellness garden...",
    enterSanctuary: "Enter Haven 🌸",
    errorGeneric: "Kuch technical error hua. Please dobara try karein.",
    retry: "Dobara Try Karein",
    close: "Band Karein",
    cancel: "Cancel",
    confirm: "Confirm",
    selectLanguage: "Bhasha Chunein",
    changeLanguage: "Change Language",
    gentleAnimationToggle: "Cherry Blossoms & Petals Animation",
    animationsEnabled: "Petals Animation On",
    animationsMuted: "Calm View (Motion Off)",
    allRightsReserved: "All rights reserved. Dedicated to womanhood and hormonal harmony.",
    wellnessCompanionFooter: "Sakhi Cycle • Handcrafted with love for your wellbeing.",
    medicalEmergencyWarning: "Agar aapko bahut severe sudden pain ya excessive bleeding ho, toh please bina deri kiye doctor ke paas visit karein."
  }
};
