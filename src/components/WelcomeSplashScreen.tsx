import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/context';

interface WelcomeSplashScreenProps {
  onEnter: () => void;
  autoDismissMs?: number;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onEnter,
  autoDismissMs = 2000, // Quick & snappy initialization (~2.0s)
}) => {
  const { t, language } = useTranslation();
  const [fadingOut, setFadingOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // If user prefers reduced motion, dismiss immediately
    if (mediaQuery.matches) {
      onEnter();
      return;
    }

    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onEnter, 400);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onEnter]);

  const handleInstantSkip = () => {
    setFadingOut(true);
    setTimeout(onEnter, 250);
  };

  if (prefersReducedMotion) return null;

  return (
    <div
      onClick={handleInstantSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF0F4] to-[#F5EEFF] select-none cursor-pointer transition-opacity duration-500 overflow-hidden ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Sakhi Cycle Initializing"
    >
      {/* Luminous Soft Ambient Garden Glow */}
      <div className="absolute w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-[#FDA4AF]/40 via-[#FCE7F3]/60 to-[#DDD6FE]/40 blur-3xl animate-pulse pointer-events-none" />

      {/* Floating Garden Elements Layer: Blossoms 🌸, Flowers 🌷, Butterflies 🦋, Sparkles ✨, Hearts 💗, Leaves 🌿 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 🌸 Cherry blossoms */}
        <div className="absolute top-[12%] left-[10%] text-2xl sm:text-3xl animate-bounce [animation-duration:3.2s] opacity-75">🌸</div>
        <div className="absolute top-[22%] right-[14%] text-3xl sm:text-4xl animate-bounce [animation-duration:3.8s] [animation-delay:0.4s] opacity-80">🌸</div>
        <div className="absolute bottom-[24%] left-[16%] text-2xl sm:text-3xl animate-bounce [animation-duration:3.5s] [animation-delay:0.8s] opacity-70">🌸</div>
        <div className="absolute bottom-[16%] right-[18%] text-3xl sm:text-4xl animate-bounce [animation-duration:4s] [animation-delay:0.2s] opacity-80">🌸</div>

        {/* 🌷 Tiny flowers */}
        <div className="absolute top-[35%] left-[8%] text-xl sm:text-2xl animate-pulse [animation-duration:2.5s] opacity-65">🌷</div>
        <div className="absolute top-[48%] right-[10%] text-xl sm:text-2xl animate-pulse [animation-duration:2.8s] opacity-70">🌷</div>

        {/* 🦋 Small butterflies */}
        <div className="absolute top-[18%] left-[45%] text-2xl animate-bounce [animation-duration:4.5s] [animation-delay:0.5s] opacity-75">🦋</div>
        <div className="absolute bottom-[30%] right-[32%] text-2xl animate-bounce [animation-duration:5s] [animation-delay:1.2s] opacity-70">🦋</div>

        {/* ✨ Sparkles */}
        <div className="absolute top-[28%] left-[26%] text-xl animate-pulse [animation-duration:2s] opacity-80">✨</div>
        <div className="absolute top-[15%] right-[35%] text-lg animate-pulse [animation-duration:2.2s] opacity-75">✨</div>
        <div className="absolute bottom-[20%] left-[42%] text-xl animate-pulse [animation-duration:1.8s] opacity-85">✨</div>

        {/* 💗 Floating hearts */}
        <div className="absolute top-[42%] left-[20%] text-xl animate-bounce [animation-duration:3.6s] [animation-delay:0.3s] opacity-75">💗</div>
        <div className="absolute bottom-[38%] right-[22%] text-xl animate-bounce [animation-duration:3.2s] [animation-delay:0.7s] opacity-80">💗</div>

        {/* 🌿 Very subtle floating leaves */}
        <div className="absolute top-[55%] left-[12%] text-lg opacity-50 animate-pulse [animation-duration:4s]">🌿</div>
        <div className="absolute bottom-[14%] left-[28%] text-lg opacity-50 animate-pulse [animation-duration:3.5s]">🌿</div>
        <div className="absolute top-[20%] right-[25%] text-lg opacity-45 animate-pulse [animation-duration:4.2s]">🌿</div>
      </div>

      {/* Center Animated Bloom Card */}
      <div className="relative z-10 max-w-sm w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/90 shadow-2xl shadow-rose-200/50 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-400">
        {/* Soft animated Sakhi floral logo emblem */}
        <div className="relative">
          <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-pink-300 to-rose-300 blur-md opacity-70 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg ring-4 ring-pink-100 flex items-center justify-center bg-gradient-to-tr from-pink-100 via-white to-purple-50">
            <img
              src="/sakhi_cycle_logo.jpg"
              alt="Sakhi Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback elegant SVG blossom if asset load fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          {/* Floating tiny blossom badge */}
          <div className="absolute -bottom-1 -right-1 text-lg animate-bounce">🌸</div>
        </div>

        {/* Center Title & Tagline as requested */}
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#4A1E29] tracking-tight">
            Sakhi 🌸
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#7A4B55] italic">
            “Taking a little moment to bloom...”
          </p>
        </div>

        {/* Cute Blooming Progress Bar */}
        <div className="w-full max-w-[180px] space-y-1.5">
          <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden p-0.5 border border-pink-200">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
          </div>
          <span className="text-[10px] text-[#A66F7B] font-medium block">
            Tap anywhere to enter
          </span>
        </div>
      </div>
    </div>
  );
};
