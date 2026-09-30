import React, { useState } from 'react';
import { CycleSettings } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { X, Save, Calendar, Sparkles, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CycleSettings;
  onSave: (newSettings: CycleSettings) => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  animationsEnabled,
  onToggleAnimations,
}) => {
  const { t } = useTranslation();
  const [lastPeriodDate, setLastPeriodDate] = useState(settings.lastPeriodDate);
  const [cycleLength, setCycleLength] = useState(settings.cycleLength);
  const [periodDuration, setPeriodDuration] = useState(settings.periodDuration);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      lastPeriodDate,
      cycleLength: Number(cycleLength),
      periodDuration: Number(periodDuration),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#FFFDFB] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#F4DFE2] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F7E7E9] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FCEEE9] text-[#A63A50]">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 id="settings-title" className="font-serif text-xl font-bold text-[#4A1E29]">
              {t.editCycleDetails}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 rounded-full text-[#9E6571] hover:text-[#5C2E38] hover:bg-[#FCEEE9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Last period date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#5C2E38]">
              {t.lastPeriodDate}
            </label>
            <input
              type="date"
              required
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] focus:outline-none focus:border-[#D86B84] focus:ring-1 focus:ring-[#D86B84]"
            />
          </div>

          {/* Average cycle length */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#5C2E38]">
              <span>{t.cycleLengthLabel}</span>
              <span className="text-[#A63A50] font-bold">{cycleLength} {t.days}</span>
            </div>
            <input
              type="range"
              min="21"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-[#C04D68] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#A66F7B]">
              <span>21 {t.days}</span>
              <span>28 (Typical)</span>
              <span>45 {t.days}</span>
            </div>
          </div>

          {/* Period duration */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#5C2E38]">
              <span>{t.periodDurationLabel}</span>
              <span className="text-[#A63A50] font-bold">{periodDuration} {t.days}</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(Number(e.target.value))}
              className="w-full accent-[#C04D68] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#A66F7B]">
              <span>2 {t.days}</span>
              <span>5 (Typical)</span>
              <span>10 {t.days}</span>
            </div>
          </div>

          {/* Floral Petals Motion Toggle */}
          <div className="pt-3 border-t border-[#F7E7E9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A63A50]" />
              <span className="text-xs font-medium text-[#5C2E38]">
                {t.gentleAnimationToggle}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleAnimations}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                animationsEnabled
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}
            >
              {animationsEnabled ? t.animationsEnabled : t.animationsMuted}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-[#7A4B55] hover:bg-[#FCEEE9] transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] text-white hover:from-[#C75A73] hover:to-[#AC3E57] shadow-sm active:scale-95 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.savedSuccessfully}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.saveCycleSettings}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
