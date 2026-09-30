import React from 'react';
import { CycleStatus } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { Sparkles, HeartHandshake, Calendar, Droplets } from 'lucide-react';

interface CycleWheelProps {
  status: CycleStatus;
  onLogPeriodToday: () => void;
  onOpenSettings: () => void;
}

export const CycleWheel: React.FC<CycleWheelProps> = ({
  status,
  onLogPeriodToday,
  onOpenSettings,
}) => {
  const { t } = useTranslation();

  const phaseColors = {
    menstrual: {
      ring: '#E11D48',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      glow: 'shadow-rose-100',
      name: t.phaseMenstrual,
      desc: t.phaseMenstrualDesc,
    },
    follicular: {
      ring: '#F97316',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      glow: 'shadow-amber-100',
      name: t.phaseFollicular,
      desc: t.phaseFollicularDesc,
    },
    ovulatory: {
      ring: '#D97706',
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      glow: 'shadow-yellow-100',
      name: t.phaseOvulatory,
      desc: t.phaseOvulatoryDesc,
    },
    luteal: {
      ring: '#9333EA',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      glow: 'shadow-purple-100',
      name: t.phaseLuteal,
      desc: t.phaseLutealDesc,
    },
  };

  const currentPhaseConfig = phaseColors[status.phase];

  // SVG circular arc progress calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (status.phaseProgress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      {/* Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FCE4EC]/50 via-[#FFEADB]/40 to-[#EDE9FE]/50 blur-2xl -z-10 pointer-events-none" />

      {/* SVG Interactive Wheel */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox="0 0 260 260"
          aria-hidden="true"
        >
          {/* Background circle track */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#F0E3DF"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Menstrual Phase segment hint */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#FECDD3"
            strokeWidth="12"
            strokeDasharray={`${(5 / status.totalDays) * circumference} ${circumference}`}
            strokeDashoffset="0"
            fill="transparent"
          />

          {/* Ovulation window indicator */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#FDE68A"
            strokeWidth="14"
            strokeDasharray={`${(4 / status.totalDays) * circumference} ${circumference}`}
            strokeDashoffset={`-${(11 / status.totalDays) * circumference}`}
            fill="transparent"
            opacity="0.8"
          />

          {/* Active Progress Ring */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke={currentPhaseConfig.ring}
            strokeWidth="13"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Sanctuary Disk */}
        <div
          className={`absolute w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-[#FFFDFB] shadow-lg border border-[#F4DFE2] flex flex-col items-center justify-center p-4 text-center select-none animate-bloom-glow`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66F7B]">
            {t.dayOfCycle}
          </span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-[#4A1E29] tracking-tight">
              {status.currentDay}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#9E6571]">
              / {status.totalDays}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${currentPhaseConfig.bg} ${currentPhaseConfig.text} border ${currentPhaseConfig.border} mt-1`}
          >
            <Sparkles className="w-3 h-3" />
            {currentPhaseConfig.name}
          </span>

          <p className="text-[11px] text-[#7A4B55] mt-2 font-medium">
            {t.nextPeriodIn} <strong className="text-[#A63A50] font-bold">{status.daysUntilNextPeriod}</strong> {t.days}
          </p>
        </div>
      </div>

      {/* Fertility and Phase summary pill */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-md text-center">
        {status.isPeakOvulation ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            ✨ {t.peakFertility}
          </span>
        ) : status.isFertileWindow ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            🌱 {t.highChanceFertility}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5EEE9] text-[#7A4F59]">
            🍃 {t.lowChanceFertility}
          </span>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onLogPeriodToday}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] hover:from-[#C75A73] hover:to-[#AC3E57] text-white shadow-md shadow-[#D86B84]/25 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D86B84]"
        >
          <Droplets className="w-4 h-4 text-rose-100" />
          {t.periodStartedToday}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-[#FFF9F6] hover:bg-[#FFF1EC] text-[#5C2E38] border border-[#ECCACF] transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D86B84]"
        >
          <Calendar className="w-3.5 h-3.5 text-[#9E6571]" />
          {t.editCycleDetails}
        </button>
      </div>
    </div>
  );
};
