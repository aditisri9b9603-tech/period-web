import React from 'react';
import { useTranslation } from '../i18n/context';
import { CycleStatus } from '../types/cycle';
import {
  Sparkles,
  Gamepad2,
  Video,
  ShoppingBag,
  Scale,
  Award,
  Stethoscope,
  Users,
  Music,
  Calendar,
  AlertTriangle,
  BookOpen,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface SakhiToolboxProps {
  onNavigateTab: (tab: any) => void;
  onOpenSettings: () => void;
  cycleStatus?: CycleStatus;
}

export const SakhiToolbox: React.FC<SakhiToolboxProps> = ({
  onNavigateTab,
  onOpenSettings,
}) => {
  const { language } = useTranslation();

  const toolCategories = [
    {
      title: language === 'hi' ? '🎀 माइंडफुल गेम्स व वीडियो' : '🎀 Mindful Play & Media',
      items: [
        {
          id: 'play',
          title: language === 'hi' ? 'सखी प्ले व गेम्स' : 'Sakhi Play',
          desc: language === 'hi' ? 'प्यारे खेल, बबल शांति और दैनिक विचार' : 'Cute mini-games, bubble calm & daily affirmations',
          icon: '🎀',
          color: 'from-pink-500 to-rose-500',
          bg: 'bg-pink-50/80 border-pink-200/80',
          badge: 'Fun Break',
        },
        {
          id: 'videos',
          title: language === 'hi' ? 'सखी वीडियो हब' : 'Sakhi Videos',
          desc: language === 'hi' ? 'डॉक्टर व यूनिसेफ सत्यापित वीडियो गाइड्स' : 'UNICEF & clinician verified health video guides',
          icon: '🎥',
          color: 'from-rose-500 to-pink-600',
          bg: 'bg-rose-50/80 border-rose-200/80',
          badge: 'Doctor Guides',
        },
        {
          id: 'vibes',
          title: language === 'hi' ? 'सखी म्यूज़िक व प्लेलिस्ट' : 'Sakhi Music & Spotify',
          desc: language === 'hi' ? 'क्रैम्प्स के लिए सुखद लो-फाई और मेडिटेशन' : 'Period soothing lo-fi, sleep & healing playlists',
          icon: '🎵',
          color: 'from-purple-500 to-indigo-500',
          bg: 'bg-purple-50/80 border-purple-200/80',
          badge: 'Soothing Lo-Fi',
        },
      ],
    },
    {
      title: language === 'hi' ? '🛍️ प्रोडक्ट व मार्केटप्लेस' : '🛍️ Products & Market',
      items: [
        {
          id: 'marketplace',
          title: language === 'hi' ? 'सखी मार्केटप्लेस' : 'Sakhi Marketplace',
          desc: language === 'hi' ? 'सत्यापित भारतीय स्टार्टअप्स से पैड व कप' : 'Direct ethical period brands & token checkout',
          icon: '🛍️',
          color: 'from-amber-500 to-rose-500',
          bg: 'bg-amber-50/80 border-amber-200/80',
          badge: 'Ethical Pads',
        },
        {
          id: 'products',
          title: language === 'hi' ? 'प्रोडक्ट गाइड व तुलना' : 'Product Compare & Guide',
          desc: language === 'hi' ? 'पैड, मेंस्ट्रुअल कप व पीरियड पैंटी की तुलना' : 'Pads vs Cups vs Underwear comparison with transparent pricing',
          icon: '⚖️',
          color: 'from-pink-500 to-amber-500',
          bg: 'bg-pink-50/80 border-pink-200/80',
          badge: 'Compare',
        },
        {
          id: 'rewards',
          title: language === 'hi' ? 'सखी रिवॉर्ड्स व टोकन्स' : 'Sakhi Rewards',
          desc: language === 'hi' ? 'दैनिक स्ट्रीक टोकन्स रिडीम करें' : 'Redeem daily streaks for health discounts and badges',
          icon: '✨',
          color: 'from-amber-400 to-pink-500',
          bg: 'bg-amber-50/80 border-amber-200/80',
          badge: 'Rewards Shop',
        },
      ],
    },
    {
      title: language === 'hi' ? '🩺 स्वास्थ्य व सिस्टरहुड' : '🩺 Health, Clinic & Sisterhood',
      items: [
        {
          id: 'doctors',
          title: language === 'hi' ? 'गायनैक खोजें' : 'Find a Gynac',
          desc: language === 'hi' ? 'सत्यापित महिला रोग विशेषज्ञ व हॉस्पिटल्स' : 'Verified gynecologists, clinic directory & helplines',
          icon: '🩺',
          color: 'from-rose-500 to-emerald-500',
          bg: 'bg-rose-50/80 border-rose-200/80',
          badge: 'Verified Doctors',
        },
        {
          id: 'forum',
          title: language === 'hi' ? 'सखी सर्कल (Anonymous)' : 'Sakhi Circle',
          desc: language === 'hi' ? '100% गोपनीय व सुरक्षित महिला मंच' : '100% stigma-free confidential sisterhood discussions',
          icon: '💬',
          color: 'from-purple-500 to-pink-500',
          bg: 'bg-purple-50/80 border-purple-200/80',
          badge: '100% Anonymous',
        },
        {
          id: 'buddy',
          title: language === 'hi' ? 'व्हाट्सएप बडी सिंक' : 'WhatsApp Buddy Sync',
          desc: language === 'hi' ? 'अपनी मां, बहन या पार्टनर को अपडेट रखें' : 'Keep your partner, mom, or bestie in the loop automatically',
          icon: '💬',
          color: 'from-emerald-500 to-teal-500',
          bg: 'bg-emerald-50/80 border-emerald-200/80',
          badge: 'WhatsApp',
        },
        {
          id: 'yoga',
          title: language === 'hi' ? 'साइकिल योगा व पोषण' : 'Cycle Yoga & Diet',
          desc: language === 'hi' ? 'क्रैम्प्स के लिए आसान योगासन व स्वस्थ डाइट' : 'Gentle cramp-relief postures and hormone-friendly nutrition',
          icon: '🧘‍♀️',
          color: 'from-teal-500 to-emerald-500',
          bg: 'bg-teal-50/80 border-teal-200/80',
          badge: 'Yoga & Diet',
        },
        {
          id: 'calendar',
          title: language === 'hi' ? 'कैलेंडर व 6-माह ट्रेंड्स' : 'Calendar & Cycle Trends',
          desc: language === 'hi' ? 'साइकिल स्थिरता और लक्षणों का 6-महीने का चार्ट' : '6-month longitudinal cycle lengths and symptom severity charts',
          icon: '📈',
          color: 'from-rose-500 to-indigo-500',
          bg: 'bg-rose-50/80 border-rose-200/80',
          badge: '6-Mo Trends',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Toolbox Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border border-pink-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-rose-800 text-xs font-bold border border-pink-200">
            <span>🧰 All Features Hub</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1E29]">
            {language === 'hi' ? 'सखी टूलबॉक्स 🧰' : 'Sakhi Toolbox 🧰'}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A4B55] max-w-xl leading-relaxed">
            {language === 'hi'
              ? 'आपकी सेहत, विश्राम और सहयोग के लिए सभी सुविधाएं एक ही शांत जगह पर।'
              : 'Everything else you may need 💗 Games, videos, ethical pads, verified doctors, anonymous forum, and music.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-xs font-bold text-[#5C2E38] shadow-2xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
          <span>{language === 'hi' ? 'साइकिल सेटिंग्स' : 'Cycle Settings'}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {toolCategories.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#4A1E29] flex items-center gap-2">
              <span>{cat.title}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  role="button"
                  tabIndex={0}
                  className={`p-5 rounded-3xl border shadow-2xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between space-y-3 ${item.bg}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-rose-900 border border-pink-200 shadow-2xs">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#4A1E29]">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#7A4B55] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-rose-700">
                    <span>{language === 'hi' ? 'खोलें' : 'Open'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
