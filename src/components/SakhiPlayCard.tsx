import React from 'react';
import { Sparkles, Heart, Play, Smile } from 'lucide-react';
import { AFFIRMATIONS } from '../data/playData';
import { useTranslation } from '../i18n/context';

interface SakhiPlayCardProps {
  onOpenPlay: () => void;
  onOpenAffirmation: () => void;
}

export const SakhiPlayCard: React.FC<SakhiPlayCardProps> = ({
  onOpenPlay,
  onOpenAffirmation,
}) => {
  const { language } = useTranslation();
  const sampleAffirmation = AFFIRMATIONS[0];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF0F5] via-[#FFF9FA] to-[#F5EEFF] p-6 sm:p-7 border border-pink-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-5">
      {/* Visual illustration / badge */}
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center text-3xl shadow-md flex-shrink-0 animate-pulse">
          🎀
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 text-rose-700 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-pink-500" />
            <span>Sakhi Play</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29] tracking-tight">
            “A tiny happy break for you 💗”
          </h3>
          <p className="text-xs text-[#7A4B55] max-w-md">
            {language === 'hi'
              ? `"${sampleAffirmation.hindiText}" — बबल्स फोड़ें, माइंडफुलनेस खेलें और टोकन पाएं!`
              : `"${sampleAffirmation.text}" — Pop calm bubbles, match petals, and claim daily tokens!`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto justify-center">
        <button
          type="button"
          onClick={onOpenPlay}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>🌸 Play Games</span>
        </button>

        <button
          type="button"
          onClick={onOpenAffirmation}
          className="px-4 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-2xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 text-pink-500" />
          <span>✨ Daily Affirmation</span>
        </button>
      </div>
    </div>
  );
};
