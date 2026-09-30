import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { CycleStatus } from '../types/cycle';
import { Heart, MessageSquare, PhoneCall, Share2, Check, Sparkles, Send } from 'lucide-react';

interface BuddySystemProps {
  cycleStatus?: CycleStatus;
}

export const BuddySystem: React.FC<BuddySystemProps> = ({ cycleStatus }) => {
  const { t, language } = useTranslation();

  const [buddyName, setBuddyName] = useState(() => {
    return localStorage.getItem('sakhi_buddy_name') || 'Pooja (Bestie)';
  });
  const [buddyPhone, setBuddyPhone] = useState(() => {
    return localStorage.getItem('sakhi_buddy_phone') || '';
  });
  const [customText, setCustomText] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveBuddy = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sakhi_buddy_name', buddyName);
    localStorage.setItem('sakhi_buddy_phone', buddyPhone);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const openWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    const cleanPhone = buddyPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const templates = [
    {
      title: '🩸 Period Day 1 Alert',
      desc: 'Let your buddy know your bleed started today so they can bring kindness.',
      msg: t.periodAlertMsg,
      icon: '🌸',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    {
      title: '🥺 Cramp SOS & Rest Check-in',
      desc: 'Send a gentle signal when discomfort is high and you are curled up resting.',
      msg: t.crampSosMsg,
      icon: '🍵',
      color: 'bg-pink-50 border-pink-200 text-pink-900',
    },
    {
      title: '☕ Hot Chai & Chocolate Craving',
      desc: 'Share a sweet luteal craving note with your favorite person.',
      msg: t.cravingChaiMsg,
      icon: '🍫',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      title: '✨ Radiant Energy Check-in',
      desc: 'Celebrate your peak spring/summer energy and suggest a meetup or walk.',
      msg: t.highEnergyMsg,
      icon: '🌷',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp Sync & Buddy Care</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.buddyTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.buddySub}</p>
      </div>

      {/* Buddy Profile Configuration */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shadow-xs">
            💬
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#4A1E29]">Your Trusted Sakhi Buddy</h3>
            <p className="text-xs text-[#7A4B55]">
              Save your sister, mom, partner, or best friend's contact for 1-tap WhatsApp care.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveBuddy} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#5C2E38]">Buddy's Name / Relation</label>
            <input
              type="text"
              required
              value={buddyName}
              onChange={(e) => setBuddyName(e.target.value)}
              placeholder="e.g. Diya (Sister) or Rahul"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#5C2E38]">
              WhatsApp Phone Number (with Country Code)
            </label>
            <input
              type="tel"
              value={buddyPhone}
              onChange={(e) => setBuddyPhone(e.target.value)}
              placeholder="e.g. +91 9876543210 (Optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
            >
              Save Buddy Details
            </button>

            {savedNotice && (
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" /> Buddy saved safely!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 1-Tap Caring Templates */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#4A1E29] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C04D68]" />
          <span>{t.whatsAppShareTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl, i) => (
            <div
              key={i}
              className={`rounded-3xl p-5 border shadow-2xs space-y-3 flex flex-col justify-between bg-white/70 backdrop-blur-sm ${tpl.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{tpl.title}</h4>
                  <span className="text-lg">{tpl.icon}</span>
                </div>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">{tpl.desc}</p>
                <div className="mt-3 p-3 rounded-2xl bg-white/90 border border-black/5 text-xs text-[#3D2C2E] italic">
                  "{tpl.msg}"
                </div>
              </div>

              <button
                type="button"
                onClick={() => openWhatsApp(tpl.msg)}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm transition-all active:scale-95 mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send to {buddyName} on WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Note Composer */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#F4DFE2] shadow-sm space-y-3">
        <h4 className="font-semibold text-sm text-[#4A1E29]">Write Your Own Check-in</h4>
        <textarea
          rows={2}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Write anything you want to share with your buddy..."
          className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!customText.trim()}
            onClick={() => {
              openWhatsApp(customText);
              setCustomText('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Custom Note on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
