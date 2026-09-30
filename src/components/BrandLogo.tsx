import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'emblem' | 'compact';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  variant = 'compact',
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // If variant is "full", show the complete official logo asset including original calligraphy & artwork
  if (variant === 'full') {
    const fullHeights = {
      sm: 'h-14',
      md: 'h-20',
      lg: 'h-28',
      xl: 'h-36',
    };

    return (
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        className={`inline-flex items-center justify-center select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84] rounded-2xl ${className}`}
        aria-label="Sakhi Cycle - Understand • Track • Thrive - Home"
      >
        <img
          src="/sakhi_cycle_logo.jpg"
          alt="Sakhi Cycle - Official Logo - Understand • Track • Thrive"
          className={`${fullHeights[size]} w-auto max-w-full object-contain rounded-2xl shadow-xs transition-transform duration-300 hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    );
  }

  const emblemSizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-18 w-18',
    xl: 'h-24 w-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`inline-flex items-center gap-3 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84] rounded-2xl p-1 transition-all duration-200 hover:opacity-95 ${className}`}
      aria-label="Sakhi Cycle Home"
    >
      {/* Official emblem with soft glossy border & droplet aura */}
      <div
        className={`relative flex-shrink-0 ${emblemSizes[size]} rounded-full overflow-hidden shadow-sm border border-[#F4D7DB] bg-[#FFF5F2] ring-2 ring-[#FFF0F3]`}
      >
        {!imgError ? (
          <img
            src="/sakhi_cycle_logo.jpg"
            alt="Sakhi Cycle - Holistic Menstrual & Hormonal Wellness Official Logo"
            className="w-full h-full object-cover object-center scale-110"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          /* High-fidelity botanical fallback SVG */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FAD2D8] via-[#FFEADB] to-[#FCEEE9] text-[#A63A50]">
            <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" fill="currentColor">
              <path
                d="M50 15 C45 35, 20 45, 20 65 C20 80, 35 90, 50 90 C65 90, 80 80, 80 65 C80 45, 55 35, 50 15 Z"
                fill="#E28292"
                opacity="0.85"
              />
              <path
                d="M50 30 C45 48, 30 55, 30 70 C30 80, 40 85, 50 85 C60 85, 70 80, 70 70 C70 55, 55 48, 50 30 Z"
                fill="#FFF2F4"
              />
              <circle cx="50" cy="62" r="7" fill="#D97706" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-serif font-bold tracking-tight text-[#4A1E29] ${textSizes[size]}`}>
            Sakhi
          </span>
          <span className={`font-serif font-light tracking-wide text-[#C04D68] ${textSizes[size]}`}>
            Cycle
          </span>
        </div>
        {showSubtitle ? (
          <span className="text-[10px] font-medium tracking-wider text-[#9E6571] uppercase mt-1">
            Understand • Track • Thrive
          </span>
        ) : (
          <span className="text-[10px] text-[#A66F7B] font-normal leading-tight mt-0.5">
            सखी • Wellness Haven
          </span>
        )}
      </div>
    </div>
  );
};
