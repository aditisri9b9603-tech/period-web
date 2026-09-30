import React, { useEffect, useState } from 'react';

interface FloralMotionBackdropProps {
  enabled?: boolean;
}

export const FloralMotionBackdrop: React.FC<FloralMotionBackdropProps> = ({ enabled = true }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (!enabled || prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#FFFDF9] via-[#FFF6F3] to-[#FAF5FF]"
        aria-hidden="true"
      />
    );
  }

  // Pre-calculated gentle floating floral and cherry blossom petals
  const petals = [
    { id: 1, left: '6%', top: '8%', delay: '0s', duration: '16s', size: 24, opacity: 0.38, rot: 15, color: '#FDA4AF' },
    { id: 2, left: '88%', top: '14%', delay: '2s', duration: '18s', size: 28, opacity: 0.4, rot: -25, color: '#F472B6' },
    { id: 3, left: '14%', top: '48%', delay: '4.5s', duration: '20s', size: 20, opacity: 0.3, rot: 45, color: '#FDBA74' },
    { id: 4, left: '82%', top: '56%', delay: '1s', duration: '17s', size: 26, opacity: 0.35, rot: 80, color: '#C084FC' },
    { id: 5, left: '38%', top: '78%', delay: '3.5s', duration: '22s', size: 22, opacity: 0.32, rot: -40, color: '#FDA4AF' },
    { id: 6, left: '92%', top: '82%', delay: '5s', duration: '19s', size: 26, opacity: 0.36, rot: 110, color: '#F472B6' },
    { id: 7, left: '26%', top: '22%', delay: '6s', duration: '21s', size: 18, opacity: 0.28, rot: -15, color: '#FBBF24' },
    { id: 8, left: '66%', top: '90%', delay: '2.5s', duration: '23s', size: 24, opacity: 0.3, rot: 60, color: '#FDA4AF' },
  ];

  // Soft dreamy clouds moving very slowly in the background
  const clouds = [
    { id: 'c1', top: '10%', left: '-10%', width: 280, height: 110, duration: '65s', delay: '0s', opacity: 0.4 },
    { id: 'c2', top: '45%', left: '75%', width: 340, height: 130, duration: '80s', delay: '5s', opacity: 0.35 },
    { id: 'c3', top: '75%', left: '-5%', width: 310, height: 120, duration: '70s', delay: '15s', opacity: 0.3 },
  ];

  // Subtle floating butterflies
  const butterflies = [
    { id: 'b1', left: '18%', top: '30%', delay: '0s', duration: '14s', size: 'text-lg', opacity: 0.35 },
    { id: 'b2', left: '84%', top: '40%', delay: '4s', duration: '18s', size: 'text-xl', opacity: 0.3 },
  ];

  // Gentle soft sparkles
  const sparkles = [
    { id: 's1', left: '22%', top: '15%', delay: '1s', duration: '4s', size: 'text-sm' },
    { id: 's2', left: '78%', top: '25%', delay: '2.5s', duration: '5s', size: 'text-base' },
    { id: 's3', left: '45%', top: '65%', delay: '0.5s', duration: '4.5s', size: 'text-xs' },
    { id: 's4', left: '88%', top: '75%', delay: '3s', duration: '6s', size: 'text-sm' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Base warm ivory background with peach, blush and lavender ambient gardens */}
      <div className="absolute inset-0 bg-[#FFFDF9]" />

      {/* Luminous ambient garden orbs */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-[#FFE4E6]/60 via-[#FED7AA]/40 to-transparent blur-3xl opacity-80" />
      <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-bl from-[#F3E8FF]/60 via-[#FCE7F3]/50 to-transparent blur-3xl opacity-80" />
      <div className="absolute -bottom-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#FFF1F2]/70 via-[#FEF3C7]/40 to-[#EDE9FE]/50 blur-3xl opacity-80" />

      {/* Very Soft Floating Clouds */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute will-change-transform"
          style={{
            top: c.top,
            left: c.left,
            width: `${c.width}px`,
            height: `${c.height}px`,
            opacity: c.opacity,
            animation: `float-gentle ${c.duration} ease-in-out infinite alternate`,
            animationDelay: c.delay,
          }}
        >
          <svg viewBox="0 0 200 90" fill="none" className="w-full h-full">
            <path
              d="M30 65 Q10 65 10 45 Q10 25 35 25 Q45 5 75 10 Q105 5 125 22 Q150 15 165 35 Q190 35 190 55 Q190 65 170 65 Z"
              fill="url(#cloudGrad)"
            />
            <defs>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#FFF1F5" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FDE2E8" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Floating Cherry Blossom & Rose Petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-1000 will-change-transform"
          style={{
            left: p.left,
            top: p.top,
            animation: `float-petal ${p.duration} ease-in-out infinite alternate`,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.35}
            viewBox="0 0 24 32"
            fill="none"
            style={{ transform: `rotate(${p.rot}deg)` }}
          >
            <path
              d="M12 0 C4 8 0 16 0 24 C0 28.4 5.4 32 12 32 C18.6 32 24 28.4 24 24 C24 16 20 8 12 0 Z"
              fill={`url(#cherryGrad-${p.id})`}
            />
            <path
              d="M12 0 C11 2 13 2 12 0"
              stroke="#FFF"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <defs>
              <linearGradient id={`cherryGrad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                <stop offset="35%" stopColor={p.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E11D48" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Subtle Floating Butterflies */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          className={`absolute ${b.size} will-change-transform select-none`}
          style={{
            left: b.left,
            top: b.top,
            opacity: b.opacity,
            animation: `float-gentle ${b.duration} ease-in-out infinite alternate`,
            animationDelay: b.delay,
          }}
        >
          🦋
        </div>
      ))}

      {/* Tiny Occasional Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className={`absolute ${s.size} select-none animate-sparkle-twinkle`}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};
