import React, { useState } from 'react';
import { DailySymptomLog } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { Check, Sparkles, Smile, BatteryMedium, AlertCircle, BookmarkCheck } from 'lucide-react';

interface SymptomLoggerProps {
  initialLog?: DailySymptomLog;
  onSaveLog: (log: DailySymptomLog) => void;
}

export const SymptomLogger: React.FC<SymptomLoggerProps> = ({ initialLog, onSaveLog }) => {
  const { t } = useTranslation();
  const todayStr = new Date().toISOString().split('T')[0];

  const [flow, setFlow] = useState<DailySymptomLog['flow']>(initialLog?.flow || 'none');
  const [cramps, setCramps] = useState<DailySymptomLog['cramps']>(initialLog?.cramps || 'none');
  const [mood, setMood] = useState<DailySymptomLog['mood']>(initialLog?.mood || 'calm');
  const [energy, setEnergy] = useState<DailySymptomLog['energy']>(initialLog?.energy || 'balanced');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialLog?.symptoms || []);
  const [notes, setNotes] = useState(initialLog?.notes || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const logData: DailySymptomLog = {
      date: todayStr,
      flow,
      cramps,
      mood,
      energy,
      symptoms: selectedSymptoms,
      notes,
    };
    onSaveLog(logData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3500);
  };

  const symptomsList = [
    { id: 'bloating', label: t.bloating, icon: '🫧' },
    { id: 'headache', label: t.headache, icon: '🤕' },
    { id: 'backache', label: t.backache, icon: '🌿' },
    { id: 'tenderBreasts', label: t.tenderBreasts, icon: '🌸' },
    { id: 'acne', label: t.acne, icon: '✨' },
    { id: 'cravings', label: t.cravings, icon: '🍫' },
    { id: 'insomnia', label: t.insomnia, icon: '🌙' },
    { id: 'digestiveIssues', label: t.digestiveIssues, icon: '🍵' },
  ];

  return (
    <form onSubmit={handleSave} className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#F4DFE2] space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7E7E9] pb-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">{t.logSymptoms}</h3>
          <p className="text-xs sm:text-sm text-[#7A4B55] mt-0.5">{t.symptomsSub}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FCEEE9] text-[#8B263E] self-start sm:self-auto border border-[#F4D7DB]">
          {t.todayIs} {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Flow Intensity */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38]">
          {t.flowIntensity}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(
            [
              { id: 'none', label: t.flowNone },
              { id: 'spotting', label: t.flowSpotting },
              { id: 'light', label: t.flowLight },
              { id: 'medium', label: t.flowMedium },
              { id: 'heavy', label: t.flowHeavy },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFlow(item.id)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border text-center ${
                flow === item.id
                  ? 'bg-[#C04D68] text-white border-[#C04D68] shadow-xs'
                  : 'bg-[#FFF9F6] text-[#5C2E38] border-[#ECCACF] hover:bg-[#FCEEE9]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cramps Level */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38]">
          {t.crampsLevel}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'none', label: t.crampsNone },
              { id: 'mild', label: t.crampsMild },
              { id: 'moderate', label: t.crampsModerate },
              { id: 'severe', label: t.crampsSevere },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCramps(item.id)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border text-center ${
                cramps === item.id
                  ? 'bg-[#9E3B50] text-white border-[#9E3B50] shadow-xs'
                  : 'bg-[#FFF9F6] text-[#5C2E38] border-[#ECCACF] hover:bg-[#FCEEE9]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emotional Landscape / Mood */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38] flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-[#A63A50]" />
          {t.moodLabel}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(
            [
              { id: 'happy', label: t.moodHappy, emoji: '🌸' },
              { id: 'calm', label: t.moodCalm, emoji: '🕊️' },
              { id: 'sensitive', label: t.moodSensitive, emoji: '💧' },
              { id: 'anxious', label: t.moodAnxious, emoji: '🦋' },
              { id: 'irritable', label: t.moodIrritable, emoji: '⚡' },
              { id: 'exhausted', label: t.moodExhausted, emoji: '🍂' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMood(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border ${
                mood === item.id
                  ? 'bg-[#FBE4E8] text-[#7A1E34] border-[#D86B84] font-semibold'
                  : 'bg-[#FFF9F6] text-[#5C2E38] border-[#ECCACF] hover:bg-[#FCEEE9]'
              }`}
            >
              <span>{item.emoji}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38] flex items-center gap-1.5">
          <BatteryMedium className="w-4 h-4 text-[#C04D68]" />
          {t.energyLabel}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'high', label: t.energyHigh, icon: '☀️' },
              { id: 'balanced', label: t.energyBalanced, icon: '🌿' },
              { id: 'low', label: t.energyLow, icon: '🕯️' },
              { id: 'drained', label: t.energyDrained, icon: '🛌' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEnergy(item.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border ${
                energy === item.id
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] font-semibold'
                  : 'bg-[#FFF9F6] text-[#5C2E38] border-[#ECCACF] hover:bg-[#FCEEE9]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Physical Sensations Checklist */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38]">
          {t.otherSymptoms}
        </label>
        <div className="flex flex-wrap gap-2">
          {symptomsList.map((item) => {
            const isChecked = selectedSymptoms.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSymptom(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
                  isChecked
                    ? 'bg-[#FCEEE9] text-[#7A1E34] border-[#D86B84] font-semibold shadow-xs'
                    : 'bg-[#FFF9F6] text-[#5C2E38] border-[#ECCACF] hover:bg-[#FCEEE9]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-[#A63A50]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-1.5">
        <label className="block text-xs sm:text-sm font-semibold text-[#5C2E38]">
          {t.notesPlaceholder}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F6] border border-[#ECCACF] text-xs sm:text-sm text-[#4A262E] placeholder:text-[#B38790] focus:outline-none focus:border-[#D86B84] focus:ring-1 focus:ring-[#D86B84]"
        />
      </div>

      {/* Submit Button & Toast */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#D86B84] to-[#C04D68] hover:from-[#C75A73] hover:to-[#AC3E57] text-white shadow-md shadow-[#D86B84]/20 transition-all duration-200 active:scale-95"
        >
          <BookmarkCheck className="w-4 h-4" />
          {t.saveDailyLog}
        </button>

        {showSavedToast && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            {t.dailyLogSavedNotice}
          </div>
        )}
      </div>
    </form>
  );
};
