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
        className="fixed inset-0 pointer-events-none -z-10 bg-[#FAF6F0]"
        aria-hidden="true"
      />
    );
  }

  // Pre-calculated gentle floating floral petal positions
  const petals = [
    { id: 1, left: '6%', top: '8%', delay: '0s', duration: '14s', size: 22, opacity: 0.28, rot: 15 },
    { id: 2, left: '88%', top: '14%', delay: '2s', duration: '18s', size: 26, opacity: 0.32, rot: -25 },
    { id: 3, left: '18%', top: '48%', delay: '5s', duration: '20s', size: 18, opacity: 0.22, rot: 45 },
    { id: 4, left: '78%', top: '56%', delay: '1s', duration: '16s', size: 24, opacity: 0.26, rot: 80 },
    { id: 5, left: '42%', top: '78%', delay: '3.5s', duration: '22s', size: 20, opacity: 0.24, rot: -40 },
    { id: 6, left: '92%', top: '82%', delay: '4s', duration: '17s', size: 25, opacity: 0.30, rot: 110 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Warm ambient glowing orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#FCE4EC]/50 to-[#FFEEDB]/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-bl from-[#EDE9FE]/40 to-[#FCE7F3]/40 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-[#FFF1F2]/50 via-[#FEF3C7]/30 to-transparent blur-3xl" />

      {/* Floating flower petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-1000"
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
            height={p.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            style={{ transform: `rotate(${p.rot}deg)` }}
          >
            <path
              d="M12 0 C4 8 0 16 0 24 C0 28.4 5.4 32 12 32 C18.6 32 24 28.4 24 24 C24 16 20 8 12 0 Z"
              fill="url(#petalGradient)"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9A8D4" />
                <stop offset="60%" stopColor="#FDA4AF" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
};
