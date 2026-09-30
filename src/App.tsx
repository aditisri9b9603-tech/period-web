import React, { useState, useEffect, useRef } from 'react';
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
import { SosModal } from './components/SosModal';
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
  CheckCircle2,
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
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreDropdownRef = useRef<HTMLDivElement>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCareMenuOpen, setIsCareMenuOpen] = useState(false);
  const [careSubTab, setCareSubTab] = useState<'phase' | 'symptoms' | 'yoga' | 'buddy'>('phase');
  const [exploreInitialSection, setExploreInitialSection] = useState<ExploreSection>('hub');
  const [productSubTab, setProductSubTab] = useState<'guide' | 'compare' | 'tutorials'>('guide');
  const [doctorSubTab, setDoctorSubTab] = useState<'gynac' | 'hospitals'>('gynac');
  const [musicSubTab, setMusicSubTab] = useState<'sakhiMusic' | 'spotifyVibes'>('sakhiMusic');

  // Close explore dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exploreDropdownRef.current &&
        !exploreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sakhi Tokens & Streak system
  const { tokens, streak, completedTasksToday, completeCareTask } = useTokens();
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

      {/* Background with floral motion & water droplets (Subtle atmospheric animation ONLY on homepage) */}
      <FloralMotionBackdrop enabled={animationsEnabled && activeTab === 'home'} />

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
              🏠 Home | 🌸 Cycle | 💗 Care | 🤖 Sakhi AI | 🎙️ Talk to Sakhi | ✨ Explore | 👤 Profile
          ================================================================ */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-[#FFF5F8]/95 p-1 rounded-full border border-[#F2D6DC] shadow-xs relative"
            aria-label="Main Navigation"
          >
            {/* 1. 🏠 Home */}
            <button
              type="button"
              onClick={() => { setActiveTab('home'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              onClick={() => { setActiveTab('cycle'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              onClick={() => { setActiveTab('care'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              onClick={() => { setActiveTab('sakhiAi'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'sakhiAi'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🤖</span>
              <span>Sakhi AI</span>
            </button>

            {/* 5. 🎙️ Talk to Sakhi (Own separate main navigation item!) */}
            <button
              type="button"
              onClick={() => { setActiveTab('talkToSakhi'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'talkToSakhi'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>🎙️</span>
              <span>{t.talkToSakhi}</span>
            </button>

            {/* 6. ✨ Explore Dropdown Submenu */}
            <div className="relative" ref={exploreDropdownRef}>
              <button
                type="button"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isExploreOpen || ['explore', 'play', 'videos', 'marketplace', 'doctors', 'rewards', 'products', 'forum', 'vibes'].includes(activeTab)
                    ? 'bg-white text-[#7A1E34] shadow-xs font-bold ring-1 ring-pink-300/60'
                    : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
                }`}
              >
                <span>✨</span>
                <span>{language === 'hi' ? 'एक्सप्लोर' : 'Explore'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExploreOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 rounded-3xl bg-white/95 backdrop-blur-2xl border border-pink-200 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-rose-800 uppercase tracking-wider border-b border-pink-100 flex items-center justify-between">
                    <span>✨ Explore Sanctuaries</span>
                    <span>🌸</span>
                  </div>

                  {/* 🎀 Sakhi Play */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('play'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">🎀</span>
                      <div>
                        <div className="font-bold">{t.play}</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Fun quizzes & games</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* 🎥 Sakhi Videos */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('videos'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">🎥</span>
                      <div>
                        <div className="font-bold">{t.videos}</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Doctor video guidance</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* 🛍️ Marketplace */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('marketplace'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">🛍️</span>
                      <div>
                        <div className="font-bold">{t.marketplace}</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Ethical period care</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* ⚖️ Product Compare */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('products'); setProductSubTab('compare'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">⚖️</span>
                      <div>
                        <div className="font-bold">Product Compare</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Pads vs cups vs disks</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* 🩺 Find a Gynac */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('doctors'); setDoctorSubTab('gynac'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">🩺</span>
                      <div>
                        <div className="font-bold">{t.gynac}</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Verified specialists</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* ✨ Sakhi Rewards */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('rewards'); setIsExploreOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between hover:bg-pink-50 text-[#4A1E29] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base group-hover:scale-110 transition-transform">✨</span>
                      <div>
                        <div className="font-bold">{t.rewards}</div>
                        <div className="text-[10px] text-[#8A5A66] font-normal">Tokens, streaks & badges</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {/* View All Features Hub */}
                  <div className="pt-1 border-t border-pink-100">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('explore'); setIsExploreOpen(false); }}
                      className="w-full text-center py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-pink-100/60 transition-colors cursor-pointer"
                    >
                      View All Features Hub →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 7. 🚨 SOS */}
            <button
              type="button"
              onClick={() => { setIsSosOpen(true); setIsExploreOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-rose-700 hover:text-rose-900 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/90 shadow-2xs"
              title="Care & Emergency SOS"
            >
              <span>🚨</span>
              <span>SOS</span>
            </button>

            {/* 8. 👤 Profile */}
            <button
              type="button"
              onClick={() => { setActiveTab('account'); setIsExploreOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-white text-[#7A1E34] shadow-xs font-bold'
                  : 'text-[#6E3C48] hover:text-[#4A1E29] hover:bg-white/60'
              }`}
            >
              <span>👤</span>
              <span>{t.profile}</span>
            </button>
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

            {/* Primary Sanctuaries */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider px-1">
                Main Sanctuaries
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'home', label: '🏠 Home' },
                  { id: 'cycle', label: '🌸 Cycle' },
                  { id: 'care', label: '💗 Care' },
                  { id: 'sakhiAi', label: '🤖 Sakhi AI' },
                  { id: 'talkToSakhi', label: '🎙️ Talk to Sakhi' },
                  { id: 'sos', label: '🚨 Care SOS' },
                  { id: 'account', label: '👤 Profile' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'sos') {
                        setIsSosOpen(true);
                      } else {
                        setActiveTab(item.id as NavTab);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-2xl text-xs font-semibold text-left border transition-all ${
                      activeTab === item.id
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-2xs'
                        : 'bg-white border-pink-100 text-[#5C2E38] hover:bg-pink-50/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ✨ Explore Subsection */}
            <div className="space-y-1.5 pt-2 border-t border-pink-100">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                  ✨ Explore Sanctuaries
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('explore');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  All Hub →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'play', label: '🎀 Sakhi Play' },
                  { id: 'videos', label: '🎥 Videos' },
                  { id: 'marketplace', label: '🛍️ Marketplace' },
                  { id: 'doctors', label: '🩺 Find Gynac' },
                  { id: 'rewards', label: '✨ Rewards' },
                  { id: 'forum', label: '💬 Sakhi Circle' },
                  { id: 'vibes', label: '🎵 Lo-Fi Music' },
                  { id: 'yoga', label: '🧘‍♀️ Yoga & Diet' },
                  { id: 'calendar', label: '📈 Cycle Trends' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as NavTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-[11px] font-medium text-left border transition-all ${
                      activeTab === item.id
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-2xs'
                        : 'bg-white/80 border-pink-100/80 text-[#5C2E38] hover:bg-pink-50/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          MAIN FULL-WIDTH RESPONSIVE DASHBOARD SANCTUARY (90-95% WIDTH)
      ======================================================== */}
      <main className="flex-1 w-[94%] max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-5 sm:py-8 pb-24 lg:pb-8">
        {/* ======================================================
            TAB 1: SPACIOUS PINTEREST SANCTUARY (HOME)
        ====================================================== */}
        {activeTab === 'home' && (
          <div className="max-w-4xl lg:max-w-5xl mx-auto py-6 sm:py-10 space-y-10 sm:space-y-12 lg:space-y-14 animate-in fade-in duration-300 relative">
            {/* Atmospheric Homepage Floating Elements: Falling Petals, Clouds & Sparkles (ONLY on Homepage) */}
            <div className="pointer-events-none absolute inset-0 -top-6 -bottom-10 overflow-hidden z-0 select-none" aria-hidden="true">
              {/* Soft Drifting Cloud Silhouettes */}
              <div className="absolute top-6 left-[-5%] w-48 sm:w-64 opacity-30 animate-drift-cloud">
                <svg viewBox="0 0 100 45" fill="none" className="w-full h-auto text-pink-200/50">
                  <path d="M10 35 Q0 35 0 25 Q0 15 15 15 Q20 5 35 7 Q50 5 60 14 Q75 10 80 20 Q95 20 95 32 Q95 35 85 35 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="absolute top-1/2 right-[-6%] w-56 sm:w-72 opacity-25 animate-drift-cloud" style={{ animationDelay: '-15s', animationDuration: '55s' }}>
                <svg viewBox="0 0 100 45" fill="none" className="w-full h-auto text-rose-200/40">
                  <path d="M10 35 Q0 35 0 25 Q0 15 15 15 Q20 5 35 7 Q50 5 60 14 Q75 10 80 20 Q95 20 95 32 Q95 35 85 35 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Slowly Falling Cherry Blossom Petals */}
              <div className="absolute top-4 left-[12%] animate-fall-petal text-xl text-rose-300 opacity-60">🌸</div>
              <div className="absolute top-16 right-[15%] animate-fall-petal text-2xl text-pink-300 opacity-55" style={{ animationDelay: '4.5s', animationDuration: '22s' }}>🌸</div>
              <div className="absolute top-28 left-[48%] animate-fall-petal text-sm text-pink-400 opacity-50" style={{ animationDelay: '9s', animationDuration: '25s' }}>🌸</div>
              <div className="absolute top-6 right-[38%] animate-fall-petal text-lg text-rose-200 opacity-60" style={{ animationDelay: '13s', animationDuration: '20s' }}>🌸</div>
              <div className="absolute top-40 left-[82%] animate-fall-petal text-base text-pink-300 opacity-45" style={{ animationDelay: '2s', animationDuration: '24s' }}>🌸</div>

              {/* Tiny Floating Sparkles & Soft Heart Glows */}
              <div className="absolute top-12 left-[28%] animate-sparkle-twinkle text-sm text-amber-300/80">✨</div>
              <div className="absolute top-48 right-[24%] animate-sparkle-twinkle text-xs text-pink-300/90" style={{ animationDelay: '1.8s' }}>✨</div>
              <div className="absolute bottom-32 left-[8%] animate-heart-beat text-xs text-rose-300/70">💗</div>
              <div className="absolute top-96 right-[8%] animate-float-gentle text-base text-purple-300/60">🦋</div>
            </div>

            {/* 1. 🌸 Welcome / Greeting */}
            <div className="relative z-10 text-center space-y-2.5 pt-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100/70 text-rose-800 text-xs font-semibold border border-pink-200/80 shadow-2xs">
                <span>🎀</span>
                <span>{language === 'hi' ? 'दैनिक वेलनेस अभयारण्य' : 'Daily Sanctuary'}</span>
                <span>🌸</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1E29] tracking-tight">
                {language === 'hi' ? `नमस्ते ${userProfile.name || 'सखी'} 🌸` : `Hi ${userProfile.name || 'Sakhi'} 🌸`}
              </h1>
              <p className="text-sm sm:text-base text-[#7A4B55] font-light">
                {language === 'hi'
                  ? 'आज अपने लिए एक छोटा सा पल निकालें।'
                  : 'Take a little moment for yourself today.'}
              </p>
            </div>

            {/* 2. Primary Balanced Grid: 📅 Cycle Snapshot + 🎙️ Talk to Sakhi (Generous Padding & Breathing Room) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch">
              {/* Card 1: 📅 Cycle Snapshot */}
              <div className="relative rounded-[2rem] bg-white/85 backdrop-blur-xl border border-pink-200/80 p-7 sm:p-9 shadow-[0_12px_36px_rgba(244,114,182,0.08)] hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-100/60 via-rose-100/40 to-transparent blur-xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📅</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        {language === 'hi' ? 'साइकिल स्नैपशॉट' : 'Cycle Snapshot'}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200/70 text-[#7A4B55] font-semibold">
                      🎀 Rhythm
                    </span>
                  </div>

                  <div className="space-y-5 my-3">
                    <div>
                      <div className="text-[11px] font-semibold text-[#8A5A66] uppercase tracking-wider">
                        {language === 'hi' ? 'साइकिल का दिन' : 'Current Cycle Day'}
                      </div>
                      <div className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#4A1E29] mt-1 flex items-baseline gap-2">
                        <span>Day {cycleStatus.currentDay}</span>
                        <span className="text-xs font-normal text-[#8A5A66]">of ~{cycleSettings.cycleLength} days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100/80">
                        <div className="text-[10px] font-bold text-[#8A5A66] uppercase tracking-wider">
                          {language === 'hi' ? 'वर्तमान फेज़' : 'Current Phase'}
                        </div>
                        <div className="font-bold text-sm text-[#4A1E29] capitalize mt-1 flex items-center gap-1.5">
                          <span>🌸</span>
                          <span>{cycleStatus.phase}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100/80">
                        <div className="text-[10px] font-bold text-[#8A5A66] uppercase tracking-wider">
                          {language === 'hi' ? 'अगला पीरियड' : 'Next Period'}
                        </div>
                        <div className="font-bold text-sm text-rose-800 mt-1 flex items-center gap-1.5">
                          <span>🩸</span>
                          <span>in ~{cycleStatus.daysUntilNextPeriod} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-pink-100/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cycle')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'विस्तार से देखें' : 'View Full Cycle'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkPeriodToday}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-white text-rose-800 border border-pink-200 hover:bg-pink-50 shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    {language === 'hi' ? 'आज पीरियड दर्ज करें' : 'Log Period Today'}
                  </button>
                </div>
              </div>

              {/* Card 2: 🎙️ Talk to Sakhi */}
              <div
                onClick={() => setActiveTab('talkToSakhi')}
                role="button"
                tabIndex={0}
                className="relative rounded-[2rem] bg-gradient-to-br from-[#FFF0F4] via-[#FFF7F9] to-[#F9F0FF] backdrop-blur-xl border border-pink-200/90 p-7 sm:p-9 shadow-[0_12px_36px_rgba(244,114,182,0.12)] hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer group overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-lg opacity-40 animate-pulse pointer-events-none">✨</div>
                <div className="absolute bottom-4 left-4 text-sm opacity-30 pointer-events-none">🎀</div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎙️</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        {language === 'hi' ? 'सखी से बात करें' : 'Talk to Sakhi'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-pink-200/80 text-rose-900 border border-pink-300/60 shadow-2xs">
                      Voice Bestie 💗
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5 my-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-rose-300 shadow-md ring-4 ring-pink-100/90 group-hover:scale-105 transition-transform">
                        <img
                          src="/cute_sakhi_avatar.jpg"
                          alt="Sakhi Voice Bestie"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-xs" title="Online" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29] leading-snug">
                        {language === 'hi' ? 'बात करने के लिए कोई चाहिए? 💗' : 'Need someone to talk to? 💗'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed">
                        {language === 'hi' ? 'मैं सुनने के लिए यहीं हूँ।' : "I'm here to listen anytime."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-3">
                  <div className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:from-pink-600 group-hover:to-rose-600 transition-all">
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>{language === 'hi' ? 'सखी दीदी से बोलें' : 'Talk to Sakhi'}</span>
                    <span className="text-xs">→</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Balanced Care Grid: 💗 Today's Care (Spacious 4 Daily Steps) */}
            <div className="relative z-10 rounded-[2rem] bg-white/85 backdrop-blur-xl border border-pink-200/80 p-7 sm:p-9 shadow-[0_12px_36px_rgba(244,114,182,0.08)] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌸</span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29]">
                      {language === 'hi' ? 'आज की केयर' : "Today's Care"}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#7A4B55] mt-1">
                    {language === 'hi' ? 'छोटी-छोटी आदतें मायने रखती हैं।' : 'Small things count.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-pink-50/90 px-3.5 py-1.5 rounded-full border border-pink-200/80 shadow-2xs">
                  4 Daily Steps ✨
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Breathe */}
                <button
                  type="button"
                  onClick={() => {
                    completeCareTask('breathe', 10, 'Mindful Breathing 🧘‍♀️');
                    setActiveTab('yoga');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/70 border border-pink-200/70 text-left hover:scale-[1.02] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🧘</span>
                    {completedTasksToday.includes('breathe') && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="font-bold text-sm text-[#4A1E29]">
                    {language === 'hi' ? 'प्राणायाम' : 'Breathe'}
                  </div>
                  <div className="text-[11px] text-[#7A4B55] mt-1">1-min calming</div>
                </button>

                {/* 2. Hydrate */}
                <button
                  type="button"
                  onClick={() => {
                    completeCareTask('hydrate', 5, 'Daily Hydration 💧');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-pink-50/70 border border-sky-100 text-left hover:scale-[1.02] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl group-hover:scale-110 transition-transform">💧</span>
                    {completedTasksToday.includes('hydrate') && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="font-bold text-sm text-[#4A1E29]">
                    {language === 'hi' ? 'जलपान' : 'Hydrate'}
                  </div>
                  <div className="text-[11px] text-[#7A4B55] mt-1">Warm herbal tea</div>
                </button>

                {/* 3. Check-in */}
                <button
                  type="button"
                  onClick={() => {
                    completeCareTask('checkin', 5, 'Daily Symptom Log 📝');
                    setActiveTab('symptoms');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/70 border border-purple-100 text-left hover:scale-[1.02] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
                    {completedTasksToday.includes('checkin') && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="font-bold text-sm text-[#4A1E29]">
                    {language === 'hi' ? 'चेक-इन' : 'Check-in'}
                  </div>
                  <div className="text-[11px] text-[#7A4B55] mt-1">Log how you feel</div>
                </button>

                {/* 4. Learn */}
                <button
                  type="button"
                  onClick={() => {
                    completeCareTask('learn', 10, 'Phase Wisdom 📚');
                    setActiveTab('phaseGuide');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50/70 border border-amber-100 text-left hover:scale-[1.02] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                    {completedTasksToday.includes('learn') && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="font-bold text-sm text-[#4A1E29]">
                    {language === 'hi' ? 'सीखें' : 'Learn'}
                  </div>
                  <div className="text-[11px] text-[#7A4B55] mt-1">Phase care tip</div>
                </button>
              </div>
            </div>

            {/* 4. Compact Section: 🔥 Streak + ✨ Tokens */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Card A: Streak */}
              <div className="p-6 sm:p-7 rounded-[2rem] bg-white/85 backdrop-blur-xl border border-pink-200/80 shadow-[0_4px_20px_rgba(244,114,182,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-orange-100/80 border border-orange-200 flex items-center justify-center text-2xl shadow-2xs">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#4A1E29]">
                      {streak} Day Streak
                    </h4>
                    <p className="text-xs text-[#7A4B55] mt-0.5">
                      {streak} days strong.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                  Active ✨
                </span>
              </div>

              {/* Card B: Tokens */}
              <div
                onClick={() => setActiveTab('rewards')}
                role="button"
                tabIndex={0}
                className="p-6 sm:p-7 rounded-[2rem] bg-white/85 backdrop-blur-xl border border-pink-200/80 shadow-[0_4px_20px_rgba(244,114,182,0.06)] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-pink-100/80 border border-pink-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    ✨
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#4A1E29]">
                      {tokens.toLocaleString()} Tokens
                    </h4>
                    <p className="text-xs text-[#7A4B55] mt-0.5">
                      {tokens.toLocaleString()} earned.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-pink-50 text-rose-800 border border-pink-200 group-hover:bg-pink-100 transition-colors">
                  Rewards →
                </span>
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
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
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
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
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

        {/* 3. Care */}
        <button
          type="button"
          onClick={() => setActiveTab('care')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            ['care', 'phaseGuide', 'symptoms', 'yoga', 'buddy'].includes(activeTab)
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Care</span>
          {['care', 'phaseGuide', 'symptoms', 'yoga', 'buddy'].includes(activeTab) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 4. Talk to Sakhi */}
        <button
          type="button"
          onClick={() => setActiveTab('talkToSakhi')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            activeTab === 'talkToSakhi'
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <Mic className="w-4 h-4 animate-pulse" />
          <span>Talk</span>
          {activeTab === 'talkToSakhi' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
        </button>

        {/* 5. Explore */}
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-semibold transition-all cursor-pointer ${
            ['explore', 'play', 'videos', 'marketplace', 'doctors', 'rewards', 'products', 'forum', 'sakhiAi'].includes(activeTab)
              ? 'text-[#A63A50] font-bold bg-pink-100/80 shadow-[0_0_12px_rgba(244,114,182,0.45)] ring-1 ring-pink-300/60'
              : 'text-[#8A5A66] hover:text-[#A63A50]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
          {['explore', 'play', 'videos', 'marketplace', 'doctors', 'rewards', 'products', 'forum', 'sakhiAi'].includes(activeTab) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
          )}
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

      {/* Emergency & Distress Care SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onNavigateToGynac={() => {
          setIsSosOpen(false);
          setActiveTab('doctors');
          setDoctorSubTab('gynac');
        }}
        onNavigateToBuddy={() => {
          setIsSosOpen(false);
          setActiveTab('care');
          setCareSubTab('buddy');
        }}
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
