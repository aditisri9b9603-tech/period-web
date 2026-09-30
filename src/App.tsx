import React, { useState, useEffect } from 'react';
import { LanguageProvider, useTranslation } from './i18n/context';
import { BrandLogo } from './components/BrandLogo';
import { LanguageSelector } from './components/LanguageSelector';
import { FloralMotionBackdrop } from './components/FloralMotionBackdrop';
import { WelcomeSplashScreen } from './components/WelcomeSplashScreen';
import { CycleWheel } from './components/CycleWheel';
import { SymptomLogger } from './components/SymptomLogger';
import { PhaseGuide } from './components/PhaseGuide';
import { TalkToSakhi } from './components/TalkToSakhi';
import { SakhiChat } from './components/SakhiChat';
import { AnonymousForum } from './components/AnonymousForum';
import { BuddySystem } from './components/BuddySystem';
import { ProductsTutorials } from './components/ProductsTutorials';
import { PeriodProductGuide } from './components/PeriodProductGuide';
import { CompareProducts } from './components/CompareProducts';
import { YogaDiet } from './components/YogaDiet';
import { DoctorDirectory } from './components/DoctorDirectory';
import { FindGynac } from './components/FindGynac';
import { SpotifyVibes } from './components/SpotifyVibes';
import { SakhiMusic } from './components/SakhiMusic';
import { CycleCalendar } from './components/CycleCalendar';
import { SettingsModal } from './components/SettingsModal';
import { AccountView } from './components/AccountView';
import { CycleSettings, DailySymptomLog, UserProfile, calculateCycleStatus } from './types/cycle';
import {
  Heart,
  Calendar,
  Sparkles,
  MessageCircleHeart,
  SlidersHorizontal,
  User,
  Activity,
  Menu,
  X,
  Droplets,
  BookOpen,
  Mic,
  Users,
  Share2,
  Package,
  Stethoscope,
  Music,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Scale,
} from 'lucide-react';

const STORAGE_CYCLE_SETTINGS = 'sakhi_cycle_settings_v1';
const STORAGE_DAILY_LOGS = 'sakhi_daily_logs_v1';
const STORAGE_USER_PROFILE = 'sakhi_user_profile_v1';
const STORAGE_ANIMATIONS = 'sakhi_animations_enabled_v1';
const STORAGE_SPLASH_SEEN = 'sakhi_splash_seen_session';

function AppContent() {
  const { t, language } = useTranslation();

  // Navigation state
  type NavTab =
    | 'home'
    | 'talkToSakhi'
    | 'phaseGuide'
    | 'symptoms'
    | 'sakhiAi'
    | 'forum'
    | 'buddy'
    | 'products'
    | 'yoga'
    | 'doctors'
    | 'vibes'
    | 'calendar'
    | 'account';

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [productSubTab, setProductSubTab] = useState<'guide' | 'compare' | 'tutorials'>('guide');
  const [doctorSubTab, setDoctorSubTab] = useState<'gynac' | 'hospitals'>('gynac');
  const [musicSubTab, setMusicSubTab] = useState<'sakhiMusic' | 'spotifyVibes'>('sakhiMusic');

  // Splash screen state (shown on initial load)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(STORAGE_SPLASH_SEEN);
    } catch {
      return true;
    }
  });

  const handleDismissSplash = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem(STORAGE_SPLASH_SEEN, 'true');
    } catch {
      // ignore
    }
  };

  // Animations preference
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANIMATIONS);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleAnimations = () => {
    setAnimationsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_ANIMATIONS, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Cycle Settings State
  const [cycleSettings, setCycleSettings] = useState<CycleSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CYCLE_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return {
      lastPeriodDate: d.toISOString().split('T')[0],
      cycleLength: 28,
      periodDuration: 5,
    };
  });

  // Daily Logs State
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailySymptomLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DAILY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: 'usr_guest',
      name: 'Aditi',
      email: 'aditiclearwitssih@gmail.com',
      isGuest: false,
      cycleSettings: {
        lastPeriodDate: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
      },
    };
  });

  const handleSaveSettings = (newSettings: CycleSettings) => {
    setCycleSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_CYCLE_SETTINGS, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  const handleSaveDailyLog = (log: DailySymptomLog) => {
    setDailyLogs((prev) => {
      const updated = { ...prev, [log.date]: log };
      try {
        localStorage.setItem(STORAGE_DAILY_LOGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleMarkPeriodToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = {
      ...cycleSettings,
      lastPeriodDate: todayStr,
    };
    handleSaveSettings(updated);

    const currentTodayLog = dailyLogs[todayStr] || {
      date: todayStr,
      flow: 'medium',
      cramps: 'mild',
      mood: 'sensitive',
      energy: 'low',
      symptoms: [],
      notes: 'Period began today.',
    };
    handleSaveDailyLog({ ...currentTodayLog, flow: 'medium' });
  };

  const cycleStatus = calculateCycleStatus(cycleSettings);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[todayStr];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#FCE7F3] selection:text-[#831843]">
      {/* Blooming Cherry Blossom Loading Splash Screen */}
      {showSplash && <WelcomeSplashScreen onEnter={handleDismissSplash} />}

      {/* Background with floral motion & water droplets */}
      <FloralMotionBackdrop enabled={animationsEnabled} />

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-[#F4DFE2]/80 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          {/* Official Brand Logo */}
          <BrandLogo
            size="md"
            showSubtitle={true}
            onClick={() => setActiveTab('home')}
            className="hover:scale-[1.02] transition-transform"
          />

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-1.5 bg-[#FFF5F8]/85 p-1.5 rounded-full border border-[#F2D6DC] shadow-xs relative"
            aria-label="Main Navigation"
          >
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => { setActiveTab('home'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <span>🌸</span>
              <span>{t.home}</span>
            </button>

            {/* 2. Standalone Voice AI Bestie */}
            <button
              type="button"
              onClick={() => { setActiveTab('talkToSakhi'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeTab === 'talkToSakhi'
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-rose-200'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.talkToSakhi}</span>
            </button>

            {/* 3. Find a Gynac */}
            <button
              type="button"
              onClick={() => { setActiveTab('doctors'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'doctors'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.findGynac}</span>
            </button>

            {/* 4. Sakhi Music */}
            <button
              type="button"
              onClick={() => { setActiveTab('vibes'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'vibes'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.sakhiMusic}</span>
            </button>

            {/* 5. Period Products Guide & Compare */}
            <button
              type="button"
              onClick={() => { setActiveTab('products'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
              <span>{t.products}</span>
            </button>

            {/* 6. Anonymous Forum */}
            <button
              type="button"
              onClick={() => { setActiveTab('forum'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'forum'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-pink-600" />
              <span>{t.forum}</span>
            </button>

            {/* 7. More Care Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  ['phaseGuide', 'symptoms', 'sakhiAi', 'buddy', 'yoga', 'calendar'].includes(activeTab)
                    ? 'bg-white text-[#7A1E34] shadow-xs'
                    : 'text-[#6E3C48] hover:text-[#4A1E29]'
                }`}
              >
                <span>{t.moreCare}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-lg p-2 z-50 animate-in fade-in space-y-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('phaseGuide'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'phaseGuide' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.phaseGuide}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('symptoms'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'symptoms' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-pink-500" />
                    <span>{t.symptoms}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('sakhiAi'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'sakhiAi' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.sakhiAi} Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('buddy'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'buddy' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.buddy}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('yoga'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'yoga' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <span>🧘‍♀️</span>
                    <span>{t.yoga}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('calendar'); setIsMoreMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'calendar' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{t.insights}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
              className="p-2 rounded-full border border-[#ECCACF] bg-white/80 hover:bg-[#FFF4F0] text-[#7A4B55] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('account')}
              aria-label={t.accountTitle}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FAD2D8] via-[#FFEADB] to-[#FCEEE9] border border-[#F4D7DB] flex items-center justify-center font-serif font-bold text-[#A63A50] text-sm shadow-2xs hover:scale-105 transition-transform"
            >
              {userProfile.name.charAt(0).toUpperCase()}
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-[#7A4B55] hover:bg-[#FFF4F0]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-[#F4DFE2] bg-white/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-in fade-in max-h-[80vh] overflow-y-auto">
            {/* Big Prominent Talk to Sakhi Card */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('talkToSakhi');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-md flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Talk to Sakhi 🌸 (Voice Bestie)</span>
            </button>

            {/* Section 1: Quick Care */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 px-2">
                Essential Care
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'home' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'bg-pink-50/50 text-[#5C2E38]'
                  }`}
                >
                  <span>🌸</span>
                  <span>{t.home}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('doctors'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'doctors' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'bg-pink-50/50 text-[#5C2E38]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.findGynac}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('vibes'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'vibes' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'bg-pink-50/50 text-[#5C2E38]'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-purple-500" />
                  <span>{t.sakhiMusic}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'products' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'bg-pink-50/50 text-[#5C2E38]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.products}</span>
                </button>
              </div>
            </div>

            {/* Section 2: Period & Body */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 px-2">
                Cycle & Lifestyle
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('phaseGuide'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'phaseGuide' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.phaseGuide}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('symptoms'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'symptoms' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 text-pink-400" />
                  <span>{t.symptoms}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('yoga'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'yoga' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <span>🧘‍♀️</span>
                  <span>{t.yoga}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'calendar' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.insights}</span>
                </button>
              </div>
            </div>

            {/* Section 3: Sisterhood & Community */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 px-2">
                Sisterhood & Support
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('forum'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'forum' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-pink-500" />
                  <span>{t.forum}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('buddy'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'buddy' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.buddy}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('sakhiAi'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'sakhiAi' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#8B263E]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.sakhiAi}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('account'); setIsMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    activeTab === 'account' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.accountTitle}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Sanctuary Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Tab 1: Home / Today's Circle */}
        {activeTab === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Top Gentle Welcome Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#9E6571]">
                {t.cycleCompanion}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1E29] tracking-tight">
                {t.welcomeBack}, {userProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#7A4B55] max-w-lg mx-auto">
                {t.headerSub}
              </p>
            </div>

            {/* Quick Callout to Talk to Sakhi (Voice Bestie) */}
            <div
              onClick={() => setActiveTab('talkToSakhi')}
              role="button"
              tabIndex={0}
              className="max-w-3xl mx-auto bg-gradient-to-r from-[#FFF0F5] via-[#FFF9FA] to-[#F5EEFF] rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-300 ring-2 ring-pink-100 flex-shrink-0">
                  <img
                    src="/cute_sakhi_avatar.jpg"
                    alt="Talk to Sakhi Bestie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#4A1E29]">
                      {t.talkToSakhiTitle}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200 text-pink-900">
                      New Voice AI
                    </span>
                  </div>
                  <p className="text-xs text-[#7A4B55] mt-0.5">
                    Tap to vent, talk about cramps, or share your day with your sweetest Indian Didi! 💗
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs flex-shrink-0">
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Tap & Talk Now</span>
              </div>
            </div>

            {/* Central Wheel & Status */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-[#F4DFE2] shadow-sm max-w-3xl mx-auto">
              <CycleWheel
                status={cycleStatus}
                onLogPeriodToday={handleMarkPeriodToday}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {/* Card 1: Phase Syncing */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A63A50]">
                      {t.currentPhase}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#A63A50] font-semibold border border-[#F7D8DF]">
                      Day {cycleStatus.currentDay}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5 capitalize">
                    {cycleStatus.phase}
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    {cycleStatus.phase === 'menstrual'
                      ? t.phaseMenstrualDesc
                      : cycleStatus.phase === 'follicular'
                      ? t.phaseFollicularDesc
                      : cycleStatus.phase === 'ovulatory'
                      ? t.phaseOvulatoryDesc
                      : t.phaseLutealDesc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('phaseGuide')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A63A50] hover:text-[#7A1E34] transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Phase Nutrition & Care →</span>
                </button>
              </div>

              {/* Card 2: Sisterhood Forum */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#A63A50] uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>{t.forum}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5">
                    Safe Anonymous Haven
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    Ask questions without shame, share cramp remedies, and receive love from sisters across India.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('forum')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A63A50] hover:text-[#7A1E34] transition-colors"
                >
                  <span>Visit Anonymous Circle →</span>
                </button>
              </div>

              {/* Card 3: WhatsApp Buddy Alert */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <Share2 className="w-4 h-4" />
                    <span>{t.buddy}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5">
                    WhatsApp Check-in
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    Notify your sister or partner with 1-tap caring messages for cramps or cravings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('buddy')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <span>Open WhatsApp Buddy →</span>
                </button>
              </div>

              {/* Card 4: Find a Gynac */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                    <Stethoscope className="w-4 h-4" />
                    <span>{t.findGynac}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5">
                    Nearby Gynecologists
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    Filter verified female doctors, consult online or visit top women's hospitals nearby.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors"
                >
                  <span>Find Care Providers →</span>
                </button>
              </div>

              {/* Card 5: Sakhi Music */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                    <Music className="w-4 h-4" />
                    <span>{t.sakhiMusic}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5">
                    Spotify Soundscapes
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    Cramp soothing, sleep delta waves, and focus lo-fi playlists curated for your cycle.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('vibes')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
                >
                  <span>Listen on Spotify ↗</span>
                </button>
              </div>

              {/* Card 6: Period Product Guide & Compare */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-700 uppercase tracking-wider">
                    <Heart className="w-4 h-4" />
                    <span>{t.products}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1.5">
                    Compare & Product Guide
                  </h3>
                  <p className="text-xs text-[#7A4B55] mt-1.5 leading-relaxed">
                    5-step illustrated tutorials for cups, pads & tampons, plus side-by-side eco comparison.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 hover:text-pink-900 transition-colors"
                >
                  <span>Explore Product Guide →</span>
                </button>
              </div>
            </div>

            {/* Quick Symptom Logger Section on Home */}
            <div className="max-w-4xl mx-auto">
              <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
            </div>
          </div>
        )}

        {/* Tab 2: Talk to Sakhi (Dedicated Voice AI Bestie) */}
        {activeTab === 'talkToSakhi' && (
          <div className="animate-in fade-in duration-300">
            <TalkToSakhi cycleStatus={cycleStatus} />
          </div>
        )}

        {/* Tab 3: Phase Syncing Guide */}
        {activeTab === 'phaseGuide' && (
          <div className="animate-in fade-in duration-300">
            <PhaseGuide currentPhase={cycleStatus.phase} />
          </div>
        )}

        {/* Tab 4: Daily Symptom Logger */}
        {activeTab === 'symptoms' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
          </div>
        )}

        {/* Tab 5: Existing Sakhi AI Chat */}
        {activeTab === 'sakhiAi' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <SakhiChat cycleStatus={cycleStatus} />
          </div>
        )}

        {/* Tab 6: Anonymous Forum */}
        {activeTab === 'forum' && (
          <div className="animate-in fade-in duration-300">
            <AnonymousForum />
          </div>
        )}

        {/* Tab 7: Buddy System */}
        {activeTab === 'buddy' && (
          <div className="animate-in fade-in duration-300">
            <BuddySystem cycleStatus={cycleStatus} />
          </div>
        )}

        {/* Tab 8: Period Care Products, Comparison & Guides */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-navigation tabs */}
            <div className="flex items-center justify-center gap-1.5 max-w-lg mx-auto p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setProductSubTab('guide')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  productSubTab === 'guide'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🩷 Product Guide
              </button>
              <button
                type="button"
                onClick={() => setProductSubTab('compare')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  productSubTab === 'compare'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🛍️ Compare & Buy
              </button>
              <button
                type="button"
                onClick={() => setProductSubTab('tutorials')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  productSubTab === 'tutorials'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🎬 Video Tutorials
              </button>
            </div>

            {productSubTab === 'guide' && <PeriodProductGuide />}
            {productSubTab === 'compare' && <CompareProducts />}
            {productSubTab === 'tutorials' && <ProductsTutorials />}
          </div>
        )}

        {/* Tab 9: Yoga & Daily Nourishment */}
        {activeTab === 'yoga' && (
          <div className="animate-in fade-in duration-300">
            <YogaDiet />
          </div>
        )}

        {/* Tab 10: Doctors & Hospitals */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-navigation tabs */}
            <div className="flex items-center justify-center gap-1.5 max-w-md mx-auto p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setDoctorSubTab('gynac')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  doctorSubTab === 'gynac'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🩺 Find a Gynac
              </button>
              <button
                type="button"
                onClick={() => setDoctorSubTab('hospitals')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  doctorSubTab === 'hospitals'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🏥 Hospitals & Helplines
              </button>
            </div>

            {doctorSubTab === 'gynac' ? <FindGynac /> : <DoctorDirectory />}
          </div>
        )}

        {/* Tab 11: Vibes & Spotify */}
        {activeTab === 'vibes' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-navigation tabs */}
            <div className="flex items-center justify-center gap-1.5 max-w-md mx-auto p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setMusicSubTab('sakhiMusic')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  musicSubTab === 'sakhiMusic'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🎵 Sakhi Music Sanctuary
              </button>
              <button
                type="button"
                onClick={() => setMusicSubTab('spotifyVibes')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  musicSubTab === 'spotifyVibes'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🎧 All Cycle Playlists
              </button>
            </div>

            {musicSubTab === 'sakhiMusic' ? <SakhiMusic /> : <SpotifyVibes />}
          </div>
        )}

        {/* Tab 12: Calendar & Trends */}
        {activeTab === 'calendar' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            <CycleCalendar settings={cycleSettings} status={cycleStatus} logs={dailyLogs} />
          </div>
        )}

        {/* Tab 13: Personal Sanctuary Account */}
        {activeTab === 'account' && (
          <div className="animate-in fade-in duration-300">
            <AccountView
              user={userProfile}
              onUpdateUser={setUserProfile}
              cycleSettings={cycleSettings}
              logsCount={Object.keys(dailyLogs).length}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#F4DFE2] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.home}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('talkToSakhi')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'talkToSakhi' ? 'text-pink-600' : 'text-[#8A5A66]'
          }`}
        >
          <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white -mt-4 shadow-md border-2 border-white">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <span>Talk</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'doctors' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Gynac</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vibes')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'vibes' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Music</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'products' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('forum')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'forum' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Forum</span>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={cycleSettings}
        onSave={handleSaveSettings}
        animationsEnabled={animationsEnabled}
        onToggleAnimations={toggleAnimations}
      />

      {/* Official Footer with Brand Logo */}
      <footer className="mt-auto border-t border-[#F4DFE2] bg-white/70 backdrop-blur-md py-10 px-4 sm:px-6 lg:px-8 pb-24 xl:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <BrandLogo size="md" variant="full" onClick={() => setActiveTab('home')} />

          <p className="text-xs text-[#8A5A66] max-w-md">
            {t.wellnessCompanionFooter}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#7A4B55]">
            <span>{t.allRightsReserved}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
