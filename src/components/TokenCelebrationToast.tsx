import React from 'react';
import { useTokens } from '../context/TokenContext';
import { Sparkles, Heart } from 'lucide-react';

export const TokenCelebrationToast: React.FC = () => {
  const { celebrations, dismissCelebration } = useTokens();

  if (celebrations.length === 0) return null;

  return (
    <div className="fixed top-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {celebrations.map((c) => (
        <div
          key={c.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 via-pink-50 to-rose-50 border-2 border-pink-300 rounded-2xl shadow-xl shadow-pink-200/50 backdrop-blur-md animate-bounce duration-700 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => dismissCelebration(c.id)}
          role="status"
          aria-live="polite"
        >
          {/* Animated Coin Badge */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-amber-200 flex-shrink-0 animate-spin-slow">
            ✨
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-rose-700 font-serif">
                +{c.amount} Sakhi Tokens
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-[#7A4B55] font-medium max-w-[200px] truncate">
              {c.reason}
            </p>
          </div>

          <Heart className="w-4 h-4 text-pink-500 fill-pink-400 ml-1 animate-pulse" />
        </div>
      ))}
    </div>
  );
};
