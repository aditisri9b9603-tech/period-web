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
import { SakhiPlay } from './components/SakhiPlay';
import { SakhiVideoHub } from './components/SakhiVideoHub';
import { SakhiMarketplace } from './components/SakhiMarketplace';
import { useAuth } from './hooks/useAuth';
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
  Video,
  Award,
  Zap,
  ArrowRight,
  Compass,
  Smile,
  LogOut,
  LogIn,
} from 'lucide-react';

const STORAGE_CYCLE_SETTINGS = 'sakhi_cycle_settings_v1';
const STORAGE_DAILY_LOGS = 'sakhi_daily_logs_v1';
const STORAGE_ANIMATIONS = 'sakhi_animations_enabled_v1';
const STORAGE_SPLASH_SEEN = 'sakhi_splash_seen_session';

export type NavTab =
  | 'home'
  | 'cycle'
  | 'care'
  | 'sakhiAi'
  | 'talkToSakhi'
  | 'play'
  | 'videos'
  | 'marketplace'
  | 'doctors'
  | 'forum'
  | 'rewards'
  | 'account'
  | 'products'
  | 'vibes'
  | 'yoga'
  | 'calendar'
  | 'phaseGuide'
  | 'symptoms'
  | 'buddy'
  | 'explore';

function AppContent() {
  const { t, language } = useTranslation();

  // Monitored Firebase user state and profile via custom useAuth hook
  const { userProfile, setUserProfile, user, logout } = useAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
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

  const handleSaveSettings = (newSettings: CycleSettings) => {
    setCycleSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_CYCLE_SETTINGS, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
    // Update user profile cycleSettings as well
    setUserProfile({
      ...userProfile,
      cycleSettings: newSettings,
    });
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#F4DFE2]/80 transition-colors shadow-2xs">
        <div className="w-[96%] max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Official Brand Logo */}
          <BrandLogo
            size="md"
            showSubtitle={true}
            onClick={() => setActiveTab('home')}
            className="hover:scale-[1.02] transition-transform flex-shrink-0"
          />

          {/* ================================================================
              DESKTOP MAIN NAVIGATION: FITS INTO ONE SINGLE HORIZONTAL LINE
              🏠 Home | 🌸 Cycle | 💗 Care | 🤖 Sakhi AI | 🎀 Play | 🎥 Videos | 🛍️ Market | 🩺 Gynac | 💬 Circle | ✨ Rewards | 👤 Profile
          ================================================================ */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#FFF5F8]/95 p-1 rounded-full border border-[#F2D6DC] shadow-xs relative whitespace-nowrap overflow-x-auto no-scrollbar"
            aria-label="Main Navigation"
          >
            {/* 1. 🏠 Home */}
            <button
              type="button"
              onClick={() => { setActiveTab('home'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🏠</span>
              <span>{t.home}</span>
            </button>

            {/* 2. 🌸 Cycle */}
            <button
              type="button"
              onClick={() => { setActiveTab('cycle'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                ['cycle', 'calendar'].includes(activeTab)
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🌸</span>
              <span>{language === 'hi' ? 'साइकिल' : 'Cycle'}</span>
            </button>

            {/* 3. 💗 Care */}
            <button
              type="button"
              onClick={() => { setActiveTab('care'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                ['care', 'phaseGuide', 'symptoms', 'yoga', 'buddy'].includes(activeTab)
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>💗</span>
              <span>{language === 'hi' ? 'केयर' : 'Care'}</span>
            </button>

            {/* 4. 🤖 Sakhi AI */}
            <button
              type="button"
              onClick={() => { setActiveTab('sakhiAi'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                ['sakhiAi', 'talkToSakhi'].includes(activeTab)
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🤖</span>
              <span>Sakhi AI</span>
            </button>

            {/* 5. 🎀 Play */}
            <button
              type="button"
              onClick={() => { setActiveTab('play'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'play'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🎀</span>
              <span>{t.play}</span>
            </button>

            {/* 6. 🎥 Videos */}
            <button
              type="button"
              onClick={() => { setActiveTab('videos'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🎥</span>
              <span>{t.videos}</span>
            </button>

            {/* 7. 🛍️ Market */}
            <button
              type="button"
              onClick={() => { setActiveTab('marketplace'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                ['marketplace', 'products'].includes(activeTab)
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🛍️</span>
              <span>{t.marketplace}</span>
            </button>

            {/* 8. 🩺 Gynac */}
            <button
              type="button"
              onClick={() => { setActiveTab('doctors'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🩺</span>
              <span>{t.gynac}</span>
            </button>

            {/* 9. 💬 Circle */}
            <button
              type="button"
              onClick={() => { setActiveTab('forum'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'forum'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>💬</span>
              <span>{t.circle}</span>
            </button>

            {/* 10. ✨ Rewards */}
            <button
              type="button"
              onClick={() => { setActiveTab('rewards'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'rewards'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>✨</span>
              <span>{t.rewards}</span>
            </button>

            {/* 11. 👤 Profile */}
            <button
              type="button"
              onClick={() => { setActiveTab('account'); setIsMoreMenuOpen(false); }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>👤</span>
              <span>{t.profile}</span>
            </button>

            {/* More / Extra Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`p-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isMoreMenuOpen || ['vibes', 'yoga', 'explore', 'talkToSakhi'].includes(activeTab)
                    ? 'bg-white text-[#7A1E34] shadow-xs'
                    : 'text-[#6E3C48] hover:text-[#4A1E29]'
                }`}
                title="More Sanctuaries"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-pink-200 shadow-xl p-2 z-50 animate-in fade-in space-y-1">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('talkToSakhi'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 text-[#5C2E38]"
                  >
                    <span>🎙️</span>
                    <span>{t.talkToSakhi}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('vibes'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 text-[#5C2E38]"
                  >
                    <span>🎵</span>
                    <span>{t.sakhiMusic}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('yoga'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 text-[#5C2E38]"
                  >
                    <span>🧘‍♀️</span>
                    <span>{t.yoga}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProductSubTab('compare'); setActiveTab('products'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 text-[#5C2E38]"
                  >
                    <span>⚖️</span>
                    <span>{language === 'hi' ? 'प्रोडक्ट तुलना' : 'Product Comparison'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('explore'); setIsMoreMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-pink-50 text-[#5C2E38]"
                  >
                    <span>🧭</span>
                    <span>{language === 'hi' ? 'एक्सप्लोर हब' : 'Explore All Hub'}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Tools */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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

            {/* Notification Center */}
            <NotificationCenter
              cycleStatus={cycleStatus}
              onNavigateTab={(tab) => {
                setActiveTab(tab as NavTab);
                setIsMobileMenuOpen(false);
              }}
            />

            {/* Multilingual Selector */}
            <LanguageSelector />

            {/* Auth Profile / Login Button */}
            {userProfile.isGuest ? (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('welcome');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'साइन इन' : 'Sign In'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100/70 hover:bg-pink-200/80 border border-pink-200 text-[#4A1E29] text-xs font-bold transition-all cursor-pointer"
                title="Account & Profile"
              >
                <User className="w-3.5 h-3.5 text-rose-600" />
                <span className="max-w-[80px] truncate">{userProfile.name}</span>
              </button>
            )}

            {/* Settings Icon */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full text-[#6E3C48] hover:text-[#4A1E29] hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#6E3C48] hover:text-[#4A1E29] hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-pink-100 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
            {/* Quick Hero Banner in Mobile Menu */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-rose-200/80 flex items-center justify-center text-sm font-bold text-rose-800">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#4A1E29]">{userProfile.name}</div>
                  <div className="text-[10px] text-[#7A4B55]">
                    {userProfile.isGuest ? 'Guest Sanctuary' : userProfile.email}
                  </div>
                </div>
              </div>
              {userProfile.isGuest ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthModalMode('welcome');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px]"
                >
                  Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-pink-100 text-rose-800 font-semibold text-[11px] flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Out</span>
                </button>
              )}
            </div>

            {/* Mobile Category Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'home', label: '🏠 Home' },
                { id: 'cycle', label: '🌸 Cycle' },
                { id: 'care', label: '💗 Care' },
                { id: 'sakhiAi', label: '🤖 Sakhi AI' },
                { id: 'talkToSakhi', label: '🎙️ Talk Voice' },
                { id: 'play', label: '🎀 Play' },
                { id: 'videos', label: '🎥 Videos' },
                { id: 'marketplace', label: '🛍️ Market' },
                { id: 'doctors', label: '🩺 Gynac' },
                { id: 'forum', label: '💬 Circle' },
                { id: 'rewards', label: '✨ Rewards' },
                { id: 'vibes', label: '🎵 Music' },
                { id: 'products', label: '🩷 Products' },
                { id: 'yoga', label: '🧘‍♀️ Yoga' },
                { id: 'account', label: '👤 Profile' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as NavTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    activeTab === item.id
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-white border-pink-100 text-[#5C2E38] hover:bg-pink-50/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          MAIN FULL-WIDTH RESPONSIVE DASHBOARD SANCTUARY (90-95% WIDTH)
      ======================================================== */}
      <main className="flex-1 w-[94%] max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-5 sm:py-8 pb-24 lg:pb-8">
        {/* ======================================================
            TAB 1: FULL-SCREEN PINTEREST DASHBOARD (HOME)
        ====================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Top Hero Status Banner */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white/75 backdrop-blur-xl border border-pink-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl animate-pulse">🌸</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-pink-100/70 px-2.5 py-0.5 rounded-full border border-pink-200">
                    {t.cycleCompanion}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A1E29]">
                  {t.welcomeBack}, {userProfile.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#7A4B55]">
                  {language === 'hi'
                    ? `आज साइकिल का दिन ${cycleStatus.currentDay} • ${cycleStatus.phase} फेज़ • अगला पीरियड लगभग ${cycleStatus.daysUntilNextPeriod} दिनों में`
                    : `Day ${cycleStatus.currentDay} of Cycle • ${cycleStatus.phase.toUpperCase()} Phase • Next period in ~${cycleStatus.daysUntilNextPeriod} days`}
                </p>
              </div>

              {/* Quick Action Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('talkToSakhi')}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span>Talk to Sakhi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('play')}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🎀</span>
                  <span>Play Break</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('marketplace')}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-white text-amber-900 border border-amber-200 hover:bg-amber-50 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🛍️</span>
                  <span>Marketplace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🩺</span>
                  <span>Find Gynac</span>
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Bento Layout (90-95% screen width) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Main Column (7 cols on lg/xl) */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-6">
                {/* 1. Interactive Cycle Wheel Sanctuary */}
                <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌸</span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29]">
                        {language === 'hi' ? 'आपका हॉर्मोनल चक्र' : 'Your Cycle Rhythm'}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('cycle')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'विस्तार से देखें' : 'View Full Cycle'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <CycleWheel
                    status={cycleStatus}
                    onLogPeriodToday={handleMarkPeriodToday}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                  />
                </div>

                {/* 2. Today's Care Card: Breathe • Hydrate • Check-in • Learn */}
                <TodaysCareCard
                  cycleStatus={cycleStatus}
                  onOpenSymptomLogger={() => setActiveTab('symptoms')}
                  onOpenPhaseGuide={() => setActiveTab('phaseGuide')}
                />

                {/* 3. Standalone Voice AI Bestie Banner */}
                <div
                  onClick={() => setActiveTab('talkToSakhi')}
                  role="button"
                  tabIndex={0}
                  className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-5 border border-pink-200/90 shadow-2xs cursor-pointer hover:shadow-md hover:scale-[1.005] transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-pink-300 ring-2 ring-pink-100 flex-shrink-0">
                      <img
                        src="/cute_sakhi_avatar.jpg"
                        alt="Talk to Sakhi Bestie"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#4A1E29]">
                          {t.talkToSakhiTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200 text-pink-900">
                          Voice AI Bestie
                        </span>
                      </div>
                      <p className="text-xs text-[#7A4B55] mt-0.5">
                        {language === 'hi'
                          ? 'पीरियड्स, ऐंठन या दिल की बातें अपनी प्यारी सखी दीदी से बोलें 💗'
                          : 'Tap to vent, share cramps, or talk freely with your loving Indian Didi! 💗'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs flex-shrink-0">
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                    <span>{language === 'hi' ? 'अभी बात करें' : 'Talk Now'}</span>
                  </div>
                </div>
              </div>

              {/* Right Companion Column (5 cols on lg/xl) */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-6">
                {/* 1. Sakhi Play & Daily Affirmation Card */}
                <SakhiPlayCard
                  onOpenPlay={() => setActiveTab('play')}
                  onOpenAffirmation={() => setActiveTab('play')}
                />

                {/* 2. Pinterest-Style Quick Explore Bento Grid */}
                <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#4A1E29] flex items-center gap-2">
                      <span>✨</span>
                      <span>{language === 'hi' ? 'सखी वेलनेस हब' : 'Sakhi Wellness Bento'}</span>
                    </h3>
                    <span className="text-[10px] font-bold text-rose-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                      Explore
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Bento Item 1: Gynac */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('doctors')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/70 border border-pink-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🩺</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.gynac}</div>
                      <div className="text-[10px] text-[#7A4B55]">Verified Doctors</div>
                    </button>

                    {/* Bento Item 2: Marketplace */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('marketplace')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50/70 border border-amber-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🛍️</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.marketplace}</div>
                      <div className="text-[10px] text-[#7A4B55]">Ethical Pad Brands</div>
                    </button>

                    {/* Bento Item 3: Videos */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('videos')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50/70 border border-pink-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎥</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.videos}</div>
                      <div className="text-[10px] text-[#7A4B55]">Doctor Video Guides</div>
                    </button>

                    {/* Bento Item 4: Circle */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('forum')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/70 border border-purple-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">💬</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.circle}</div>
                      <div className="text-[10px] text-[#7A4B55]">100% Anonymous</div>
                    </button>

                    {/* Bento Item 5: Music */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('vibes')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎵</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.sakhiMusic}</div>
                      <div className="text-[10px] text-[#7A4B55]">Cramp Calming Lo-Fi</div>
                    </button>

                    {/* Bento Item 6: Rewards */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('rewards')}
                      className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/70 border border-amber-200/80 text-left hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="text-xl mb-1 group-hover:scale-110 transition-transform">✨</div>
                      <div className="font-bold text-xs text-[#4A1E29]">{t.rewards}</div>
                      <div className="text-[10px] text-[#7A4B55]">Streak & Badges</div>
                    </button>
                  </div>
                </div>

                {/* 3. Phase Guidance & Daily Nutrition Snapshot */}
                <div className="p-5 rounded-3xl bg-[#FFFDFB] border border-pink-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      🌸 {cycleStatus.phase.toUpperCase()} PHASE CARE
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('phaseGuide')}
                      className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
                    >
                      Full Guide →
                    </button>
                  </div>
                  <p className="text-xs text-[#7A4B55] leading-relaxed">
                    {cycleStatus.phase === 'menstrual'
                      ? 'Nourish with warm iron-rich soups, ginger chai, and restorative slow stretches.'
                      : cycleStatus.phase === 'follicular'
                      ? 'Rising estrogen brings high focus! Ideal for seed cycling (pumpkin & flax) and creative planning.'
                      : cycleStatus.phase === 'ovulatory'
                      ? 'Peak natural energy and radiance. Sync with social events and vibrant antioxidant fresh salads.'
                      : 'Progesterone calls for grounding comfort: dark chocolate, magnesium, and warm chamomile tea.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom 4-Card Responsive Rhythm Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Card 1: Phase Syncing */}
              <div
                onClick={() => setActiveTab('phaseGuide')}
                role="button"
                tabIndex={0}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-pink-200/80 shadow-2xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      {t.currentPhase}
                    </span>
                    <span className="text-xs">🌸</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#4A1E29] capitalize mt-1">
                    {cycleStatus.phase}
                  </h4>
                  <p className="text-xs text-[#7A4B55] line-clamp-2">
                    {cycleStatus.phase === 'menstrual'
                      ? t.phaseMenstrualDesc
                      : cycleStatus.phase === 'follicular'
                      ? t.phaseFollicularDesc
                      : cycleStatus.phase === 'ovulatory'
                      ? t.phaseOvulatoryDesc
                      : t.phaseLutealDesc}
                  </p>
                </div>
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-2">
                  <span>{t.phaseGuide}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Symptom Logger */}
              <div
                onClick={() => setActiveTab('symptoms')}
                role="button"
                tabIndex={0}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-pink-200/80 shadow-2xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      {t.symptoms}
                    </span>
                    <span className="text-xs">💧</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#4A1E29] mt-1">
                    {todayLog ? 'Check-in Recorded' : 'Log Today'}
                  </h4>
                  <p className="text-xs text-[#7A4B55]">
                    {todayLog
                      ? `Flow: ${todayLog.flow} • Cramps: ${todayLog.cramps} • Mood: ${todayLog.mood}`
                      : 'Track flow, cramps, and emotional state in 10 seconds.'}
                  </p>
                </div>
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-2">
                  <span>{t.logSymptoms}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Yoga & Gentle Movement */}
              <div
                onClick={() => setActiveTab('yoga')}
                role="button"
                tabIndex={0}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-pink-200/80 shadow-2xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      {t.yoga}
                    </span>
                    <span className="text-xs">🧘‍♀️</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#4A1E29] mt-1">
                    Gentle Poses
                  </h4>
                  <p className="text-xs text-[#7A4B55]">
                    Cramp soothing butterfly pose, child pose, and pelvic relaxation.
                  </p>
                </div>
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-2">
                  <span>Start Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 4: 6-Month Cycle Trends */}
              <div
                onClick={() => setActiveTab('calendar')}
                role="button"
                tabIndex={0}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-pink-200/80 shadow-2xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      {t.cycleTrends}
                    </span>
                    <span className="text-xs">📈</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#4A1E29] mt-1">
                    6-Month Patterns
                  </h4>
                  <p className="text-xs text-[#7A4B55]">
                    Interactive charts for cycle lengths, cramp severity and regularity.
                  </p>
                </div>
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-2">
                  <span>Explore Trends</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            TAB 2: DEDICATED CYCLE SANCTUARY & CALENDAR
        ====================================================== */}
        {activeTab === 'cycle' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-800 text-xs font-bold border border-pink-200">
                <span>🌸 Cycle Sanctuary</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">
                {language === 'hi' ? 'मासिक धर्म चक्र व कैलेंडर' : 'Your Hormonal Rhythm & Calendar'}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A4B55]">
                {language === 'hi'
                  ? 'अपने पीरियड के दिन, ओव्यूलेशन विंडो, अगला पीरियड और 6-महीने के ट्रेंड्स देखें।'
                  : 'Track your phase, fertile window, next period countdown, and monthly history.'}
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

        {/* ======================================================
            TAB 3: CALENDAR VIEW DIRECTLY
        ====================================================== */}
        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-300">
            <CycleCalendar settings={cycleSettings} status={cycleStatus} logs={dailyLogs} />
          </div>
        )}

        {/* ======================================================
            TAB 4: DEDICATED CARE HUB
        ====================================================== */}
        {activeTab === 'care' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-nav */}
            <div className="flex items-center justify-center gap-1.5 p-1.5 bg-white/85 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setCareSubTab('phase')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

        {/* ======================================================
            TAB 5: SAKHI AI CHAT
        ====================================================== */}
        {activeTab === 'sakhiAi' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('sakhiAi')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs"
              >
                🤖 Sakhi AI Multi-turn Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('talkToSakhi')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                <span>Talk to Sakhi (Voice Didi)</span>
              </button>
            </div>
            <SakhiChat cycleStatus={cycleStatus} />
          </div>
        )}

        {/* ======================================================
            TAB 6: TALK TO SAKHI (VOICE BESTIE)
        ====================================================== */}
        {activeTab === 'talkToSakhi' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('talkToSakhi')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Talk to Sakhi (Voice Didi)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sakhiAi')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 transition-all cursor-pointer"
              >
                🤖 Text AI Chat
              </button>
            </div>
            <TalkToSakhi cycleStatus={cycleStatus} />
          </div>
        )}

        {/* ======================================================
            TAB 7: SAKHI PLAY & GAMES (Directly Visible!)
        ====================================================== */}
        {activeTab === 'play' && (
          <div className="animate-in fade-in duration-300">
            <SakhiPlay />
          </div>
        )}

        {/* ======================================================
            TAB 8: SAKHI VIDEO HUB (Directly Visible!)
        ====================================================== */}
        {activeTab === 'videos' && (
          <div className="animate-in fade-in duration-300">
            <SakhiVideoHub />
          </div>
        )}

        {/* ======================================================
            TAB 9: SAKHI MARKETPLACE (Directly Visible!)
        ====================================================== */}
        {activeTab === 'marketplace' && (
          <div className="animate-in fade-in duration-300">
            <SakhiMarketplace />
          </div>
        )}

        {/* ======================================================
            TAB 10: DOCTORS & CLINICS
        ====================================================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Sub-navigation tabs */}
            <div className="flex items-center justify-center gap-1.5 max-w-md mx-auto p-1.5 bg-white/85 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setDoctorSubTab('gynac')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

        {/* ======================================================
            TAB 11: SAKHI CIRCLE / ANONYMOUS FORUM
        ====================================================== */}
        {activeTab === 'forum' && (
          <div className="animate-in fade-in duration-300">
            <AnonymousForum />
          </div>
        )}

        {/* ======================================================
            TAB 12: SAKHI REWARDS & BADGES
        ====================================================== */}
        {activeTab === 'rewards' && (
          <div className="animate-in fade-in duration-300">
            <SakhiRewards />
          </div>
        )}

        {/* ======================================================
            TAB 13: PRODUCTS & COMPARISON
        ====================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2 p-1.5 bg-white/85 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setProductSubTab('guide')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  productSubTab === 'compare'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                ⚖️ Compare Products
              </button>
              <button
                type="button"
                onClick={() => setProductSubTab('tutorials')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

        {/* ======================================================
            TAB 14: SAKHI MUSIC & SPOTIFY VIBES
        ====================================================== */}
        {activeTab === 'vibes' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-1.5 max-w-md mx-auto p-1.5 bg-white/85 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setMusicSubTab('sakhiMusic')}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  musicSubTab === 'spotifyVibes'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-[#6E3C48] hover:bg-pink-50'
                }`}
              >
                🎧 All Playlists
              </button>
            </div>

            {musicSubTab === 'sakhiMusic' ? <SakhiMusic /> : <SpotifyVibes />}
          </div>
        )}

        {/* ======================================================
            TAB 15: YOGA & DIET
        ====================================================== */}
        {activeTab === 'yoga' && (
          <div className="animate-in fade-in duration-300">
            <YogaDiet />
          </div>
        )}

        {/* ======================================================
            TAB 16: EXPLORE ALL HUB
        ====================================================== */}
        {activeTab === 'explore' && (
          <div className="animate-in fade-in duration-300">
            <ExploreHub
              initialSection={exploreInitialSection}
              onSelectSection={(sec) => setExploreInitialSection(sec)}
            />
          </div>
        )}

        {/* ======================================================
            TAB 17: ACCOUNT & PROFILE SANCTUARY
        ====================================================== */}
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

        {/* ======================================================
            TAB 18: PHASE GUIDE DIRECTLY
        ====================================================== */}
        {activeTab === 'phaseGuide' && (
          <div className="animate-in fade-in duration-300">
            <PhaseGuide currentPhase={cycleStatus.phase} />
          </div>
        )}

        {/* ======================================================
            TAB 19: SYMPTOMS LOGGER DIRECTLY
        ====================================================== */}
        {activeTab === 'symptoms' && (
          <div className="animate-in fade-in duration-300">
            <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
          </div>
        )}

        {/* ======================================================
            TAB 20: BUDDY SYSTEM DIRECTLY
        ====================================================== */}
        {activeTab === 'buddy' && (
          <div className="animate-in fade-in duration-300">
            <BuddySystem cycleStatus={cycleStatus} />
          </div>
        )}
      </main>

      {/* Sticky Bottom Nav for Mobile with Active Glow Indicator */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#F4DFE2] px-2 py-2 flex items-center justify-around shadow-[0_-4px_24px_rgba(244,114,182,0.18)]"
      >
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Home</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 2. Cycle */}
        <button
          type="button"
          onClick={() => setActiveTab('cycle')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            ['cycle', 'calendar'].includes(activeTab)
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cycle</span>
          {['cycle', 'calendar'].includes(activeTab) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 3. Sakhi AI */}
        <button
          type="button"
          onClick={() => setActiveTab('sakhiAi')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            ['sakhiAi', 'talkToSakhi'].includes(activeTab)
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <MessageCircleHeart className="w-4 h-4" />
          <span>Sakhi AI</span>
          {['sakhiAi', 'talkToSakhi'].includes(activeTab) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 4. Play */}
        <button
          type="button"
          onClick={() => setActiveTab('play')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'play'
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <span className="text-sm leading-none">🎀</span>
          <span>Play</span>
          {activeTab === 'play' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 5. More / Menu */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[10px] font-semibold text-[#8A5A66] hover:text-[#A63A50] transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>

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
          setActiveTab('rewards');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToCare={() => {
          setIsWalletOpen(false);
          setActiveTab('home');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Official Footer with Brand Logo */}
      <footer className="mt-auto border-t border-[#F4DFE2] bg-white/70 backdrop-blur-md py-10 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-10">
        <div className="w-[94%] max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
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
