import React, { useState } from 'react';
import { CyclePhase } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { PHASE_GUIDANCE } from '../data/phaseGuidance';
import { Utensils, Activity, Sparkles, Heart, Sun, Moon, Flame, Wind } from 'lucide-react';

interface PhaseGuideProps {
  currentPhase: CyclePhase;
}

export const PhaseGuide: React.FC<PhaseGuideProps> = ({ currentPhase }) => {
  const { t, language } = useTranslation();
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(currentPhase);

  const phaseData = PHASE_GUIDANCE[language]?.[selectedPhase] || PHASE_GUIDANCE.en[selectedPhase];

  const phaseTabs: { id: CyclePhase; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'menstrual',
      label: t.phaseMenstrual,
      icon: <Moon className="w-4 h-4 text-rose-500" />,
      color: 'border-rose-400 text-rose-900 bg-rose-50',
    },
    {
      id: 'follicular',
      label: t.phaseFollicular,
      icon: <Wind className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-400 text-amber-900 bg-amber-50',
    },
    {
      id: 'ovulatory',
      label: t.phaseOvulatory,
      icon: <Sun className="w-4 h-4 text-yellow-600" />,
      color: 'border-yellow-400 text-yellow-900 bg-yellow-50',
    },
    {
      id: 'luteal',
      label: t.phaseLuteal,
      icon: <Flame className="w-4 h-4 text-purple-500" />,
      color: 'border-purple-400 text-purple-900 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="font-serif text-3xl font-bold text-[#4A1E29]">{t.phaseGuidanceTitle}</h2>
        <p className="text-xs sm:text-sm text-[#7A4B55]">{t.phaseGuidanceSub}</p>
      </div>

      {/* Phase Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FFF4EE] rounded-2xl border border-[#F2D6DC] max-w-3xl mx-auto">
        {phaseTabs.map((tab) => {
          const isSelected = selectedPhase === tab.id;
          const isCurrent = currentPhase === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedPhase(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-white shadow-sm border border-[#E9C3CB] text-[#5A192A]'
                  : 'text-[#6E3C48] hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isCurrent && (
                <span className="text-[10px] uppercase tracking-wider bg-[#F9D4DD] text-[#841935] px-1.5 py-0.5 rounded-md font-bold">
                  Now
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Guidance Card */}
      <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-8 animate-in fade-in duration-300">
        {/* Banner with Season Metaphor & Hormones */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#FFF0F3] via-[#FFF6EF] to-[#F5F3FF] border border-[#F5D8DF]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A63A50]">
              {phaseData.seasonMetaphor} • {phaseData.duration}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#4A1E29] mt-0.5">{phaseData.name}</h3>
            <p className="text-xs sm:text-sm text-[#6A3945] mt-1 font-medium">
              ⚡ {phaseData.energyLevel}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#F4D2DA] text-xs text-[#522530] max-w-xs shadow-2xs">
            <span className="font-bold text-[#8B263E] block mb-0.5">Hormone Shift:</span>
            {phaseData.hormones}
          </div>
        </div>

        {/* 3 Pillars Grid: Nutrition, Movement, Self-Care */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Nourishing Foods */}
          <div className="bg-[#FFF8F5] rounded-2xl p-5 border border-[#F4E0D7] space-y-3">
            <div className="flex items-center gap-2 text-[#A64A35]">
              <div className="p-2 rounded-xl bg-orange-100/80">
                <Utensils className="w-5 h-5 text-orange-700" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#4A2620]">{t.nutritionTitle}</h4>
            </div>
            <p className="text-xs text-[#6B3E35] leading-relaxed">{phaseData.nutritionOverview}</p>
            <div className="pt-2 border-t border-[#F2D7CD]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C4D3D] block mb-2">
                {t.suggestedFoods}:
              </span>
              <ul className="space-y-1.5">
                {phaseData.foodsToEmphasize.map((food, i) => (
                  <li key={i} className="text-xs text-[#522922] flex items-start gap-1.5">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Mindful Movement */}
          <div className="bg-[#F8FBF8] rounded-2xl p-5 border border-[#DCEDDB] space-y-3">
            <div className="flex items-center gap-2 text-[#2D6A4F]">
              <div className="p-2 rounded-xl bg-emerald-100/80">
                <Activity className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1B4332]">{t.movementTitle}</h4>
            </div>
            <p className="text-xs text-[#2D5A46] leading-relaxed">{phaseData.movementOverview}</p>
            <div className="pt-2 border-t border-[#D0E5D3]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] block mb-2">
                {t.suggestedActivities}:
              </span>
              <ul className="space-y-1.5">
                {phaseData.recommendedWorkouts.map((workout, i) => (
                  <li key={i} className="text-xs text-[#214334] flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{workout}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Mindful Rituals & Seed Cycling */}
          <div className="bg-[#FAF7FD] rounded-2xl p-5 border border-[#E9DCFA] space-y-3">
            <div className="flex items-center gap-2 text-[#6D28D9]">
              <div className="p-2 rounded-xl bg-purple-100/80">
                <Sparkles className="w-5 h-5 text-purple-700" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3B1261]">{t.mindfulnessTitle}</h4>
            </div>
            <p className="text-xs text-[#532680] leading-relaxed">{phaseData.selfCareRitual}</p>

            <div className="pt-2 border-t border-[#E3D4F5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D28D9] block mb-1">
                {t.seedCyclingTitle}:
              </span>
              <p className="text-xs text-[#481E73] bg-purple-50/80 p-2.5 rounded-xl border border-purple-200">
                🌱 {phaseData.seedCycling}
              </p>
            </div>
          </div>
        </div>

        {/* Warm Caring Tip */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF8FA] border border-[#FAD7E2] text-xs sm:text-sm text-[#732238]">
          <Heart className="w-5 h-5 text-[#C04D68] flex-shrink-0 fill-[#FBE4EC]" />
          <div>
            <strong className="font-semibold text-[#8B1E38]">Sakhi's Heart Whisper: </strong>
            <span>{phaseData.warmTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
