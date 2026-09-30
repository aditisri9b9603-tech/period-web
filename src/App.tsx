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
import { ExploreHub, ExploreSection } from './components/ExploreHub';
import { SettingsModal } from './components/SettingsModal';
import { AccountView } from './components/AccountView';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal, AuthViewMode } from './components/AuthModal';
import { TokenProvider, useTokens } from './context/TokenContext';
import { TokenCelebrationToast } from './components/TokenCelebrationToast';
import { SakhiWalletModal } from './components/SakhiWalletModal';
import { TodaysCareCard } from './components/TodaysCareCard';
import { SakhiPlayCard } from './components/SakhiPlayCard';
import { SakhiRewards } from './components/SakhiRewards';
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
    | 'cycle'
    | 'care'
    | 'talkToSakhi'
    | 'sakhiAi'
    | 'explore'
    | 'doctors'
    | 'vibes'
    | 'products'
    | 'forum'
    | 'phaseGuide'
    | 'symptoms'
    | 'buddy'
    | 'yoga'
    | 'calendar'
    | 'account';

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);
  const [isCareMenuOpen, setIsCareMenuOpen] = useState(false);
  const [careSubTab, setCareSubTab] = useState<'phase' | 'symptoms' | 'yoga' | 'buddy'>('phase');
  const [exploreInitialSection, setExploreInitialSection] = useState<ExploreSection>('hub');
  const [productSubTab, setProductSubTab] = useState<'guide' | 'compare' | 'tutorials'>('guide');
  const [doctorSubTab, setDoctorSubTab] = useState<'gynac' | 'hospitals'>('gynac');
  const [musicSubTab, setMusicSubTab] = useState<'sakhiMusic' | 'spotifyVibes'>('sakhiMusic');

  // Sakhi Tokens & Streak system
  const { tokens, streak } = useTokens();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthViewMode>('welcome');

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
            {/* 1. 🏠 Home */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <span>🏠</span>
              <span>{t.home}</span>
            </button>

            {/* 2. 🌸 Cycle */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('cycle');
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                ['cycle', 'calendar'].includes(activeTab)
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <span>🌸</span>
              <span>Cycle</span>
            </button>

            {/* 3. 💗 Care Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCareMenuOpen(!isCareMenuOpen);
                  setIsExploreMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  ['care', 'phaseGuide', 'symptoms', 'yoga', 'buddy'].includes(activeTab)
                    ? 'bg-white text-[#7A1E34] shadow-xs'
                    : 'text-[#6E3C48] hover:text-[#4A1E29]'
                }`}
              >
                <span>💗</span>
                <span>Care</span>
                <ChevronDown className="w-3 h-3 text-[#A66F7B]" />
              </button>

              {isCareMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-xl p-2 z-50 animate-in fade-in space-y-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('phaseGuide'); setIsCareMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'phaseGuide' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>{t.phaseGuide}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('symptoms'); setIsCareMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'symptoms' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-pink-500" />
                    <span>{t.symptoms}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('yoga'); setIsCareMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'yoga' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <span>🧘‍♀️</span>
                    <span>{t.yoga}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('buddy'); setIsCareMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'buddy' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.buddy}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. 🎙️ Standalone Voice AI Bestie (Talk to Sakhi) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('talkToSakhi');
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeTab === 'talkToSakhi'
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-rose-200'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-rose-500" />
              <span>{t.talkToSakhi}</span>
            </button>

            {/* 5. 🤖 Sakhi AI Chat */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('sakhiAi');
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'sakhiAi'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <span>🤖</span>
              <span>Sakhi AI</span>
            </button>

            {/* 6. ✨ Explore Dropdown (Find a Gynac, Music, Product Guide, Compare, Sakhi Circle) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsExploreMenuOpen(!isExploreMenuOpen);
                  setIsCareMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  ['explore', 'doctors', 'vibes', 'products', 'forum'].includes(activeTab)
                    ? 'bg-white text-[#7A1E34] shadow-xs'
                    : 'text-[#6E3C48] hover:text-[#4A1E29]'
                }`}
              >
                <span>✨</span>
                <span>Explore</span>
                <ChevronDown className="w-3 h-3 text-[#A66F7B]" />
              </button>

              {isExploreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-xl p-2.5 z-50 animate-in fade-in space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('hub');
                      setActiveTab('explore');
                      setIsExploreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-800 bg-pink-50/70 hover:bg-pink-100 flex items-center justify-between"
                  >
                    <span>✨ Explore All Discovery</span>
                    <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('play');
                      setActiveTab('explore');
                      setIsExploreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors text-[#5C2E38]"
                  >
                    <span className="text-sm">🎀</span>
                    <span>Sakhi Play & Games</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('marketplace');
                      setActiveTab('explore');
                      setIsExploreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors text-[#5C2E38]"
                  >
                    <span className="text-sm">🛍️</span>
                    <span>Sakhi Marketplace</span>
                  </button>

                  <div className="h-px bg-pink-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('doctors');
                      setActiveTab('doctors');
                      setIsExploreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'doctors' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                    <span>🩺 Find a Gynac</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('music');
                      setActiveTab('vibes');
                      setIsExploreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'vibes' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5 text-purple-600" />
                    <span>🎵 Sakhi Music</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProductSubTab('guide');
                      setExploreInitialSection('guide');
                      setActiveTab('products');
                      setIsExploreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'products' && productSubTab === 'guide'
                        ? 'bg-[#FFF0F3] text-[#7A1E34]'
                        : 'text-[#5C2E38]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-500" />
                    <span>🩷 Product Guide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProductSubTab('compare');
                      setExploreInitialSection('compare');
                      setActiveTab('products');
                      setIsExploreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'products' && productSubTab === 'compare'
                        ? 'bg-[#FFF0F3] text-[#7A1E34]'
                        : 'text-[#5C2E38]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>🛍️ Compare Products</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExploreInitialSection('circle');
                      setActiveTab('forum');
                      setIsExploreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors ${
                      activeTab === 'forum' ? 'bg-[#FFF0F3] text-[#7A1E34]' : 'text-[#5C2E38]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-pink-600" />
                    <span>💬 Sakhi Circle</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. 👤 Profile */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('account');
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'account'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sakhi Tokens & Streak Pill */}
            <button
              type="button"
              onClick={() => setIsWalletOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200/90 text-amber-900 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Sakhi Wallet & Rewards"
            >
              <span className="text-amber-500 font-bold">✨</span>
              <span className="font-bold text-xs text-[#5C2E38]">{tokens.toLocaleString()}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold hidden sm:inline-flex items-center gap-0.5">
                🔥 {streak}d
              </span>
            </button>

            {/* Simple In-App Notification Center */}
            <NotificationCenter
              cycleStatus={cycleStatus}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
                setIsExploreMenuOpen(false);
                setIsCareMenuOpen(false);
              }}
            />

            <LanguageSelector />

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
              className="p-2 rounded-full border border-[#ECCACF] bg-white/80 hover:bg-[#FFF4F0] text-[#7A4B55] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Quick Sign In / User Profile Button */}
            {userProfile.isGuest ? (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('welcome');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs hover:opacity-95 transition-all"
              >
                <span>🌸</span>
                <span>Sign In</span>
              </button>
            ) : null}

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

            {/* Mobile Sakhi Tokens & Streak Banner */}
            <button
              type="button"
              onClick={() => {
                setIsWalletOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 text-amber-900 shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span>My Sakhi Tokens: <span className="font-extrabold text-[#7A1E34]">{tokens.toLocaleString()}</span></span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
                🔥 {streak} Day Streak
              </span>
            </button>

            {/* Quick Explore Sanctuary Hub */}
            <button
              type="button"
              onClick={() => {
                setExploreInitialSection('hub');
                setActiveTab('explore');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-sm flex items-center justify-center gap-2"
            >
              <span>✨ Explore Discovery Sanctuary (Gynac, Music, Guide)</span>
            </button>

            {/* Quick Play & Marketplace Links */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setExploreInitialSection('play');
                  setActiveTab('explore');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 text-rose-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>🎀</span>
                <span>Sakhi Play</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExploreInitialSection('marketplace');
                  setActiveTab('explore');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-100 to-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>🛍️</span>
                <span>Marketplace</span>
              </button>
            </div>

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

            {/* Today's Care & Sakhi Tokens System */}
            <div className="max-w-3xl mx-auto w-full">
              <TodaysCareCard
                cycleStatus={cycleStatus}
                onOpenSymptomLogger={() => setActiveTab('symptoms')}
                onOpenPhaseGuide={() => setActiveTab('phaseGuide')}
              />
            </div>

            {/* Sakhi Play Home Card: "A tiny happy break for you 💗" */}
            <div className="max-w-3xl mx-auto w-full">
              <SakhiPlayCard
                onOpenPlay={() => {
                  setExploreInitialSection('play');
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAffirmation={() => {
                  setExploreInitialSection('play');
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
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

        {/* Tab 13: Dedicated Cycle Sanctuary */}
        {activeTab === 'cycle' && (
          <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-800 text-xs font-bold border border-pink-200">
                <span>🌸 Cycle Sanctuary</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">
                Your Hormonal Rhythm & Calendar
              </h2>
              <p className="text-xs sm:text-sm text-[#7A4B55]">
                Track your phase, fertile window, next period countdown, and monthly history.
              </p>
            </div>
            <CycleWheel
              status={cycleStatus}
              onLogPeriodToday={handleMarkPeriodToday}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <CycleCalendar settings={cycleSettings} status={cycleStatus} logs={dailyLogs} />
          </div>
        )}

        {/* Tab 14: Dedicated Care Hub */}
        {activeTab === 'care' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            {/* Sub-nav */}
            <div className="flex items-center justify-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setCareSubTab('phase')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  careSubTab === 'phase'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🌸 Phase Guide
              </button>
              <button
                type="button"
                onClick={() => setCareSubTab('symptoms')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  careSubTab === 'symptoms'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                💧 Daily Log
              </button>
              <button
                type="button"
                onClick={() => setCareSubTab('yoga')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  careSubTab === 'yoga'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🧘‍♀️ Yoga & Diet
              </button>
              <button
                type="button"
                onClick={() => setCareSubTab('buddy')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                  careSubTab === 'buddy'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                💬 WhatsApp
              </button>
            </div>

            {careSubTab === 'phase' && <PhaseGuide currentPhase={cycleStatus.phase} />}
            {careSubTab === 'symptoms' && (
              <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
            )}
            {careSubTab === 'yoga' && <YogaDiet />}
            {careSubTab === 'buddy' && <BuddySystem cycleStatus={cycleStatus} />}
          </div>
        )}

        {/* Tab 15: Explore Hub (Find a Gynac, Music, Product Guide, Compare, Sakhi Circle) */}
        {activeTab === 'explore' && (
          <div className="animate-in fade-in duration-300">
            <ExploreHub
              initialSection={exploreInitialSection}
              onSelectSection={(sec) => setExploreInitialSection(sec)}
            />
          </div>
        )}

        {/* Tab 16: Personal Sanctuary Account */}
        {activeTab === 'account' && (
          <div className="animate-in fade-in duration-300">
            <AccountView
              user={userProfile}
              onUpdateUser={setUserProfile}
              cycleSettings={cycleSettings}
              logsCount={Object.keys(dailyLogs).length}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode);
                setIsAuthModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#F4DFE2] px-3 py-2 flex items-center justify-around shadow-lg">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-[#A63A50] font-bold' : 'text-[#8A5A66]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* 2. Cycle */}
        <button
          type="button"
          onClick={() => setActiveTab('cycle')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            ['cycle', 'calendar'].includes(activeTab) ? 'text-[#A63A50] font-bold' : 'text-[#8A5A66]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cycle</span>
        </button>

        {/* 3. Talk to Sakhi (Elevated Voice Bestie Mic) */}
        <button
          type="button"
          onClick={() => setActiveTab('talkToSakhi')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'talkToSakhi' ? 'text-pink-600' : 'text-[#8A5A66]'
          }`}
        >
          <div className="p-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white -mt-5 shadow-lg border-2 border-white ring-2 ring-pink-200">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <span>Talk</span>
        </button>

        {/* 4. Explore */}
        <button
          type="button"
          onClick={() => {
            setExploreInitialSection('hub');
            setActiveTab('explore');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            ['explore', 'doctors', 'vibes', 'products', 'forum'].includes(activeTab)
              ? 'text-[#A63A50] font-bold'
              : 'text-[#8A5A66]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'account' ? 'text-[#A63A50] font-bold' : 'text-[#8A5A66]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
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

      {/* Dedicated Authentication Modal (Welcome, Sign In, Sign Up, Forgot Password, Reset Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={userProfile}
        onUserChange={setUserProfile}
        initialMode={authModalMode}
      />

      {/* Sakhi Token Celebration Toast (Floating Sparkles & Badges) */}
      <TokenCelebrationToast />

      {/* Sakhi Wallet & Rewards Modal */}
      <SakhiWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onNavigateToRewards={() => {
          setIsWalletOpen(false);
          setExploreInitialSection('rewards');
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToCare={() => {
          setIsWalletOpen(false);
          setActiveTab('home');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
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
      <TokenProvider>
        <AppContent />
      </TokenProvider>
    </LanguageProvider>
  );
}
