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
    { id: 1, left: '5%', top: '6%', delay: '0s', duration: '14s', size: 24, opacity: 0.35, rot: 15, color: '#FDA4AF' },
    { id: 2, left: '88%', top: '12%', delay: '2s', duration: '18s', size: 28, opacity: 0.38, rot: -25, color: '#F472B6' },
    { id: 3, left: '16%', top: '44%', delay: '4.5s', duration: '20s', size: 20, opacity: 0.28, rot: 45, color: '#FDBA74' },
    { id: 4, left: '82%', top: '52%', delay: '1s', duration: '16s', size: 26, opacity: 0.32, rot: 80, color: '#C084FC' },
    { id: 5, left: '40%', top: '75%', delay: '3.5s', duration: '22s', size: 22, opacity: 0.30, rot: -40, color: '#FDA4AF' },
    { id: 6, left: '94%', top: '80%', delay: '5s', duration: '17s', size: 26, opacity: 0.35, rot: 110, color: '#F472B6' },
    { id: 7, left: '28%', top: '18%', delay: '6s', duration: '19s', size: 18, opacity: 0.25, rot: -15, color: '#FBBF24' },
    { id: 8, left: '68%', top: '88%', delay: '2.5s', duration: '21s', size: 24, opacity: 0.28, rot: 60, color: '#FDA4AF' },
  ];

  // Subtle translucent dewy water droplets
  const droplets = [
    { id: 'd1', left: '12%', top: '22%', size: 14, opacity: 0.4 },
    { id: 'd2', left: '76%', top: '30%', size: 18, opacity: 0.35 },
    { id: 'd3', left: '86%', top: '68%', size: 12, opacity: 0.3 },
    { id: 'd4', left: '22%', top: '82%', size: 16, opacity: 0.4 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Base warm ivory background with peach, blush and lavender ambient gardens */}
      <div className="absolute inset-0 bg-[#FFFDF9]" />

      {/* Luminous ambient garden orbs */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-[#FFE4E6]/60 via-[#FED7AA]/40 to-transparent blur-3xl opacity-80" />
      <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-bl from-[#F3E8FF]/60 via-[#FCE7F3]/50 to-transparent blur-3xl opacity-80" />
      <div className="absolute -bottom-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#FFF1F2]/70 via-[#FEF3C7]/40 to-[#EDE9FE]/50 blur-3xl opacity-80" />

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
          {/* Sakura/Petal SVG with natural curve */}
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
            {/* Sakura petal notch */}
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

      {/* Translucent glistening water droplets */}
      {droplets.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: d.left,
            top: d.top,
            width: `${d.size}px`,
            height: `${d.size * 1.25}px`,
            opacity: d.opacity,
            background: 'radial-gradient(ellipse at 35% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.4) 40%, rgba(244, 114, 182, 0.25) 85%, rgba(255, 255, 255, 0.6) 100%)',
            boxShadow: '0 2px 5px rgba(244, 114, 182, 0.2), inset 0 -1px 3px rgba(255, 255, 255, 0.8), inset 0 2px 2px rgba(255, 255, 255, 0.9)',
            transform: 'rotate(-20deg)',
          }}
        />
      ))}
    </div>
  );
};
