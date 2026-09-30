import React, { useState, useEffect } from 'react';
import { LanguageProvider, useTranslation } from './i18n/context';
import { BrandLogo } from './components/BrandLogo';
import { LanguageSelector } from './components/LanguageSelector';
import { FloralMotionBackdrop } from './components/FloralMotionBackdrop';
import { CycleWheel } from './components/CycleWheel';
import { SymptomLogger } from './components/SymptomLogger';
import { PhaseGuide } from './components/PhaseGuide';
import { SakhiChat } from './components/SakhiChat';
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
  BookOpen
} from 'lucide-react';

const STORAGE_CYCLE_SETTINGS = 'sakhi_cycle_settings_v1';
const STORAGE_DAILY_LOGS = 'sakhi_daily_logs_v1';
const STORAGE_USER_PROFILE = 'sakhi_user_profile_v1';
const STORAGE_ANIMATIONS = 'sakhi_animations_enabled_v1';

function AppContent() {
  const { t, language } = useTranslation();

  // Navigation state
  type NavTab = 'home' | 'phaseGuide' | 'symptoms' | 'sakhiAi' | 'calendar' | 'account';
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  // Cycle Settings State (default: last period started 7 days ago, cycle 28, period 5)
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

  // Daily Logs State (Keyed by YYYY-MM-DD)
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

  // Save changes to localStorage
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

    // Also record a flow log for today
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

  // Calculate current cycle status
  const cycleStatus = calculateCycleStatus(cycleSettings);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs[todayStr];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#F2D7D9] selection:text-[#5F1D38]">
      {/* Background with floral motion */}
      <FloralMotionBackdrop enabled={animationsEnabled} />

      {/* Main App Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDFB]/90 backdrop-blur-md border-b border-[#F4DFE2] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          {/* Official Brand Logo */}
          <BrandLogo
            size="md"
            showSubtitle={true}
            onClick={() => setActiveTab('home')}
            className="hover:opacity-95"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FFF6F3]/80 p-1.5 rounded-full border border-[#F2D6DC]" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              {t.home}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('phaseGuide')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'phaseGuide'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              {t.phaseGuide}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('symptoms')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'symptoms'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              {t.symptoms}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sakhiAi')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'sakhiAi'
                  ? 'bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white shadow-xs'
                  : 'text-[#8B263E] hover:text-[#5C1A29]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.sakhiAi}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#7A1E34] shadow-xs'
                  : 'text-[#6E3C48] hover:text-[#4A1E29]'
              }`}
            >
              {t.insights}
            </button>
          </nav>

          {/* Right Header Tools: Language Selector, Settings, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual Selector */}
            <LanguageSelector />

            {/* Quick Settings Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
              className="p-2 rounded-full border border-[#ECCACF] bg-[#FFFBF8] hover:bg-[#FFF4F0] text-[#7A4B55] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Profile Avatar button */}
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
              className="lg:hidden p-2 rounded-xl text-[#7A4B55] hover:bg-[#FFF4F0]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#F4DFE2] bg-[#FFFDFB] px-4 py-3 space-y-1 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'home' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
              }`}
            >
              {t.home}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('phaseGuide');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'phaseGuide' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
              }`}
            >
              {t.phaseGuide}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('symptoms');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'symptoms' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
              }`}
            >
              {t.symptoms}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('sakhiAi');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeTab === 'sakhiAi'
                  ? 'bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white'
                  : 'text-[#8B263E]'
              }`}
            >
              <span>{t.sakhiAi}</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('calendar');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'calendar' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
              }`}
            >
              {t.insights}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('account');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'account' ? 'bg-[#FCEEE9] text-[#7A1E34]' : 'text-[#5C2E38]'
              }`}
            >
              {t.accountTitle}
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
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

            {/* Central Wheel & Status */}
            <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-10 border border-[#F4DFE2] shadow-sm max-w-3xl mx-auto">
              <CycleWheel
                status={cycleStatus}
                onLogPeriodToday={handleMarkPeriodToday}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>

            {/* Quick Cards Grid: Phase Overview & Today's Care */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Card 1: Phase Syncing Teaser */}
              <div className="bg-[#FFFDFB] rounded-3xl p-6 border border-[#F4DFE2] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A63A50]">
                      {t.currentPhase}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#A63A50] font-semibold border border-[#F7D8DF]">
                      Day {cycleStatus.currentDay}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#4A1E29] mt-1.5 capitalize">
                    {cycleStatus.phase === 'menstrual'
                      ? t.phaseMenstrual
                      : cycleStatus.phase === 'follicular'
                      ? t.phaseFollicular
                      : cycleStatus.phase === 'ovulatory'
                      ? t.phaseOvulatory
                      : t.phaseLuteal}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A4B55] mt-2 leading-relaxed">
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#A63A50] hover:text-[#7A1E34] transition-colors mt-3"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Phase Nutrition & Workouts →</span>
                </button>
              </div>

              {/* Card 2: Sakhi AI Consultation Teaser */}
              <div className="bg-gradient-to-tr from-[#FFF5F2] via-[#FFF9F6] to-[#FDF4FF] rounded-3xl p-6 border border-[#F2D6DC] shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#A63A50]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A63A50]">
                      {t.sakhiAi}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#4A1E29] mt-1.5">
                    How is your body feeling?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A4B55] mt-2 leading-relaxed">
                    {t.chatLanguagePrompt} Ask for instant cramp soothers, tea recipes, or hormone-friendly foods.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('sakhiAi')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] hover:from-[#C75A73] hover:to-[#AC3E57] text-white shadow-xs active:scale-95 transition-all"
                >
                  <MessageCircleHeart className="w-4 h-4" />
                  <span>Talk with Sakhi AI</span>
                </button>
              </div>
            </div>

            {/* Quick Symptom Logger Section on Home */}
            <div className="max-w-4xl mx-auto">
              <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
            </div>
          </div>
        )}

        {/* Tab 2: Phase Syncing Guide */}
        {activeTab === 'phaseGuide' && (
          <div className="animate-in fade-in duration-300">
            <PhaseGuide currentPhase={cycleStatus.phase} />
          </div>
        )}

        {/* Tab 3: Daily Symptom Logger */}
        {activeTab === 'symptoms' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <SymptomLogger initialLog={todayLog} onSaveLog={handleSaveDailyLog} />
          </div>
        )}

        {/* Tab 4: Sakhi AI Companion */}
        {activeTab === 'sakhiAi' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <SakhiChat cycleStatus={cycleStatus} />
          </div>
        )}

        {/* Tab 5: Calendar & Trends */}
        {activeTab === 'calendar' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            <CycleCalendar settings={cycleSettings} status={cycleStatus} logs={dailyLogs} />
          </div>
        )}

        {/* Tab 6: Account & Sanctuary */}
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-t border-[#F4DFE2] px-3 py-2 flex items-center justify-around shadow-lg">
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
          onClick={() => setActiveTab('phaseGuide')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'phaseGuide' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.phaseGuide}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sakhiAi')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'sakhiAi' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.sakhiAi}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('symptoms')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'symptoms' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>{t.symptoms}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'calendar' ? 'text-[#A63A50]' : 'text-[#8A5A66]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.insights}</span>
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
      <footer className="mt-auto border-t border-[#F4DFE2] bg-[#FFFDFB] py-10 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <BrandLogo size="sm" showSubtitle={true} onClick={() => setActiveTab('home')} />

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
