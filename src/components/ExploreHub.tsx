import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { FindGynac } from './FindGynac';
import { SakhiMusic } from './SakhiMusic';
import { PeriodProductGuide } from './PeriodProductGuide';
import { CompareProducts } from './CompareProducts';
import { AnonymousForum } from './AnonymousForum';
import { SakhiRewards } from './SakhiRewards';
import { SakhiVideoHub } from './SakhiVideoHub';
import { SakhiPlay } from './SakhiPlay';
import { SakhiMarketplace } from './SakhiMarketplace';
import { GmailCareCompanion } from './GmailCareCompanion';
import {
  Sparkles,
  Stethoscope,
  Music,
  Heart,
  Scale,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Headphones,
  ShoppingBag,
  Video,
  Gift,
  Mail,
  Gamepad2,
} from 'lucide-react';

export type ExploreSection =
  | 'hub'
  | 'play'
  | 'marketplace'
  | 'videos'
  | 'doctors'
  | 'music'
  | 'guide'
  | 'compare'
  | 'circle'
  | 'rewards'
  | 'gmail';

interface ExploreHubProps {
  initialSection?: ExploreSection;
  onSelectSection?: (section: ExploreSection) => void;
}

export const ExploreHub: React.FC<ExploreHubProps> = ({
  initialSection = 'hub',
  onSelectSection,
}) => {
  const { t, language } = useTranslation();
  const [activeSection, setActiveSection] = useState<ExploreSection>(initialSection);

  const handleSwitchSection = (section: ExploreSection) => {
    setActiveSection(section);
    if (onSelectSection) onSelectSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreItems = [
    {
      id: 'play' as ExploreSection,
      emoji: '🎀',
      title: 'Sakhi Play',
      hindiTitle: 'सखी प्ले व गेम्स',
      subtitle: 'Cute mini-games, daily affirmations, bubble calm & memory bloom',
      hindiSubtitle: 'मनोरंजक प्यारे खेल, सकारात्मक विचार और माइंडफुलनेस विश्राम',
      accent: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-50/80 border-pink-200/80',
      badge: '🎀 Wholesome Fun',
      badgeColor: 'text-rose-700 bg-pink-100/70 border-pink-200',
    },
    {
      id: 'marketplace' as ExploreSection,
      emoji: '🛍️',
      title: 'Sakhi Marketplace',
      hindiTitle: 'सखी मार्केटप्लेस',
      subtitle: 'Direct ethical period brands, transparent prices & token checkout',
      hindiSubtitle: 'सत्यापित भारतीय स्टार्टअप्स से किफायती पैड, कप और वेलनेस किट',
      accent: 'from-rose-500 to-amber-500',
      bgGlow: 'bg-rose-50/80 border-amber-200/80',
      badge: '🌱 Support Local Brands',
      badgeColor: 'text-amber-800 bg-amber-100/70 border-amber-200',
    },
    {
      id: 'videos' as ExploreSection,
      emoji: '🌸',
      title: 'Sakhi Videos',
      hindiTitle: 'सखी वीडियो हब',
      subtitle: 'Verified period health, PCOS, hygiene & pain relief guides',
      hindiSubtitle: 'सत्यापित पीरियड स्वास्थ्य, पीसीओएस, स्वच्छता और दर्द निवारक वीडियो',
      accent: 'from-pink-500 to-rose-600',
      bgGlow: 'bg-rose-50/80 border-rose-200/80',
      badge: 'UNICEF & Clinic Verified',
      badgeColor: 'text-rose-700 bg-rose-100/70 border-rose-200',
    },
    {
      id: 'doctors' as ExploreSection,
      emoji: '🩺',
      title: 'Find a Gynac',
      hindiTitle: 'गायनैक खोजें',
      subtitle: 'Nearby verified gynecologists & female doctors',
      hindiSubtitle: 'नजदीकी जांची-परखी महिला डॉक्टर और क्लिनिक',
      accent: 'from-rose-500 to-pink-600',
      bgGlow: 'bg-rose-50/80 border-rose-200/80',
      badge: 'Verified Care',
      badgeColor: 'text-rose-700 bg-rose-100/70 border-rose-200',
    },
    {
      id: 'music' as ExploreSection,
      emoji: '🎵',
      title: 'Sakhi Music',
      hindiTitle: 'सखी म्यूज़िक',
      subtitle: 'Period relaxation, sleep waves & Spotify playlists',
      hindiSubtitle: 'ऐंठन राहत, गहरी नींद और सुकून भरी स्पॉटिफाई प्लेलिस्ट्स',
      accent: 'from-purple-500 to-indigo-600',
      bgGlow: 'bg-purple-50/80 border-purple-200/80',
      badge: 'Spotify Connected',
      badgeColor: 'text-purple-700 bg-purple-100/70 border-purple-200',
    },
    {
      id: 'guide' as ExploreSection,
      emoji: '🩷',
      title: 'Product Guide',
      hindiTitle: 'प्रोडक्ट गाइड',
      subtitle: '5-step illustrated tutorials for cups, pads & tampons',
      hindiSubtitle: 'कप, पैड और टैम्पोन के लिए 5-चरणीय सचित्र गाइड',
      accent: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-50/80 border-pink-200/80',
      badge: 'Evidence-Based',
      badgeColor: 'text-pink-700 bg-pink-100/70 border-pink-200',
    },
    {
      id: 'compare' as ExploreSection,
      emoji: '🛍️',
      title: 'Compare & Buy',
      hindiTitle: 'तुलना करें व खरीदें',
      subtitle: 'Side-by-side prices, eco ratings & verified hygiene',
      hindiSubtitle: 'कीमत, सामग्री, इको-फ्रेंडली रेटिंग और सत्यापित उत्पाद',
      accent: 'from-amber-500 to-rose-500',
      bgGlow: 'bg-amber-50/80 border-amber-200/80',
      badge: 'Smart Choices',
      badgeColor: 'text-amber-800 bg-amber-100/70 border-amber-200',
    },
    {
      id: 'circle' as ExploreSection,
      emoji: '💬',
      title: 'Sakhi Circle',
      hindiTitle: 'सखी चौपाल',
      subtitle: '100% anonymous sisterhood forum & safe space',
      hindiSubtitle: '100% गोपनीय बहनचारा चौपाल और सुरक्षित मंच',
      accent: 'from-fuchsia-500 to-pink-600',
      bgGlow: 'bg-fuchsia-50/80 border-fuchsia-200/80',
      badge: 'Anonymous & Safe',
      badgeColor: 'text-fuchsia-800 bg-fuchsia-100/70 border-fuchsia-200',
    },
    {
      id: 'rewards' as ExploreSection,
      emoji: '🎀',
      title: 'Sakhi Rewards',
      hindiTitle: 'सखी रिवॉर्ड्स',
      subtitle: 'Redeem organic pads, cups & wellness kits with Sakhi Tokens',
      hindiSubtitle: 'सखी टोकन से ऑर्गेनिक पैड, कप और वेलनेस किट रिडीम करें',
      accent: 'from-rose-500 to-amber-500',
      bgGlow: 'bg-rose-50/80 border-amber-200/80',
      badge: '✨ Sakhi Tokens Shop',
      badgeColor: 'text-amber-800 bg-amber-100/70 border-amber-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Floating Pill Navigator for Explore */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap p-1.5 max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-full border border-pink-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => handleSwitchSection('hub')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'hub'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>✨</span>
          <span>Explore All</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('play')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'play'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🎀</span>
          <span>Sakhi Play</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('marketplace')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'marketplace'
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-rose-50'
          }`}
        >
          <span>🛍️</span>
          <span>Marketplace</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('videos')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'videos'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🌸</span>
          <span>Sakhi Videos</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('doctors')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'doctors'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🩺</span>
          <span>Find Gynac</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('music')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'music'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-purple-50'
          }`}
        >
          <span>🎵</span>
          <span>Sakhi Music</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('guide')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'guide'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-pink-50'
          }`}
        >
          <span>🩷</span>
          <span>Product Guide</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('compare')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'compare'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-amber-50'
          }`}
        >
          <span>🛍️</span>
          <span>Compare</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('circle')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'circle'
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-fuchsia-50'
          }`}
        >
          <span>💬</span>
          <span>Sakhi Circle</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchSection('rewards')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSection === 'rewards'
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs'
              : 'text-[#6E3C48] hover:bg-rose-50'
          }`}
        >
          <span>🎀</span>
          <span>Sakhi Rewards</span>
        </button>
      </div>

      {/* Main Content Render */}
      {activeSection === 'hub' && (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
          {/* Girly dreamy banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100/90 via-[#FFF0F5] to-purple-100/80 p-8 sm:p-10 border border-pink-200/90 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-rose-700 text-xs font-bold shadow-2xs border border-pink-200">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                <span>Sakhi Discovery World • Explore Care</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1E29] leading-tight">
                “A cute little wellness world made especially for you.” 🌸💗✨
              </h2>
              <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed">
                Discover verified gynecologists, cycle relaxation music on Spotify, complete product guides, smart comparisons, and our anonymous sisterhood circle.
              </p>
            </div>

            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-pink-300 via-rose-300 to-purple-300 p-1 shadow-lg shadow-pink-200/60 rotate-2 hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-[22px] bg-white flex flex-col items-center justify-center p-3 text-center space-y-1">
                  <span className="text-4xl">🌷</span>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    Pure Wellness
                  </span>
                </div>
              </div>
              <span className="absolute -top-2 -left-2 text-xl animate-bounce">✨</span>
              <span className="absolute -bottom-2 -right-2 text-xl animate-pulse">🦋</span>
            </div>
          </div>

          {/* 5 Distinct Explore Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exploreItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSwitchSection(item.id)}
                className={`group cursor-pointer rounded-3xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between space-y-4 bg-white/85 backdrop-blur-md ${item.bgGlow}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white shadow-2xs border border-pink-100 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#4A1E29] group-hover:text-rose-700 transition-colors">
                      {language === 'hi' ? item.hindiTitle : item.title}
                    </h3>
                    <p className="text-xs text-[#7A4B55] mt-1 leading-relaxed">
                      {language === 'hi' ? item.hindiSubtitle : item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#7A1E34] border-t border-pink-100">
                  <span>Open Section</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-section views */}
      {activeSection === 'play' && (
        <div className="animate-in fade-in duration-300">
          <SakhiPlay />
        </div>
      )}

      {activeSection === 'marketplace' && (
        <div className="animate-in fade-in duration-300">
          <SakhiMarketplace />
        </div>
      )}

      {activeSection === 'videos' && (
        <div className="animate-in fade-in duration-300">
          <SakhiVideoHub />
        </div>
      )}

      {activeSection === 'doctors' && (
        <div className="animate-in fade-in duration-300">
          <FindGynac />
        </div>
      )}

      {activeSection === 'music' && (
        <div className="animate-in fade-in duration-300">
          <SakhiMusic />
        </div>
      )}

      {activeSection === 'guide' && (
        <div className="animate-in fade-in duration-300">
          <PeriodProductGuide />
        </div>
      )}

      {activeSection === 'compare' && (
        <div className="animate-in fade-in duration-300">
          <CompareProducts />
        </div>
      )}

      {activeSection === 'circle' && (
        <div className="animate-in fade-in duration-300">
          <AnonymousForum />
        </div>
      )}

      {activeSection === 'rewards' && (
        <div className="animate-in fade-in duration-300">
          <SakhiRewards />
        </div>
      )}
    </div>
  );
};
