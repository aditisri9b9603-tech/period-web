import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { useTranslation } from '../i18n/context';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomeSplashScreenProps {
  onEnter: () => void;
  autoDismissMs?: number;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onEnter,
  autoDismissMs = 2800,
}) => {
  const { t } = useTranslation();
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onEnter, 700);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onEnter]);

  const handleManualEnter = () => {
    setFadingOut(true);
    setTimeout(onEnter, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF3F5] to-[#FAF5FF] select-none transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Welcome to Sakhi Cycle"
    >
      {/* Ambient blooming background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#FDA4AF]/40 via-[#FCE7F3]/50 to-[#DDD6FE]/40 blur-3xl animate-pulse-soft pointer-events-none" />

      {/* Cherry blossom floating petals in foreground */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: '15%', top: '20%', size: 30, delay: '0s', dur: '5s' },
          { left: '80%', top: '25%', size: 36, delay: '1s', dur: '6s' },
          { left: '25%', top: '70%', size: 26, delay: '2s', dur: '7s' },
          { left: '75%', top: '75%', size: 32, delay: '0.5s', dur: '5.5s' },
        ].map((petal, idx) => (
          <div
            key={idx}
            className="absolute animate-bounce"
            style={{
              left: petal.left,
              top: petal.top,
              animationDuration: petal.dur,
              animationDelay: petal.delay,
              opacity: 0.65,
            }}
          >
            <span style={{ fontSize: `${petal.size}px` }}>🌸</span>
          </div>
        ))}
      </div>

      {/* Card container with translucent glassmorphism */}
      <div className="relative z-10 max-w-md w-full bg-white/75 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/80 shadow-2xl shadow-rose-200/50 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
        {/* Official Brand Logo */}
        <BrandLogo variant="full" size="lg" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] text-[#A63A50] border border-[#FAD2D8] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C04D68]" />
            <span>{t.welcomeHaven}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#7A4B55] leading-relaxed max-w-xs mx-auto">
            {t.bloomingSanctuary}
          </p>
        </div>

        {/* Pulsing dewy blossom ring indicator */}
        <div className="flex items-center justify-center gap-2 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D86B84] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#FDA4AF] animate-pulse" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D86B84] animate-ping" />
        </div>

        {/* Enter button */}
        <button
          type="button"
          onClick={handleManualEnter}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-[#D86B84] via-[#C04D68] to-[#9E3B50] hover:from-[#C75A73] hover:to-[#8B263E] text-white shadow-lg shadow-rose-300/50 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
        >
          <Heart className="w-4 h-4 fill-white/30" />
          <span>{t.enterSanctuary}</span>
        </button>
      </div>
    </div>
  );
};
