import React, { useState } from 'react';
import { useTokens } from '../context/TokenContext';
import { CycleStatus } from '../types/cycle';
import {
  Sparkles,
  Droplets,
  Heart,
  BookOpen,
  CheckCircle2,
  X,
  Play,
  Flame,
  Coffee,
  RotateCcw,
} from 'lucide-react';

interface TodaysCareProps {
  cycleStatus: CycleStatus;
  onOpenSymptomLogger?: () => void;
  onOpenPhaseGuide?: () => void;
}

export const TodaysCareCard: React.FC<TodaysCareProps> = ({
  cycleStatus,
  onOpenSymptomLogger,
  onOpenPhaseGuide,
}) => {
  const { completedTasksToday, completeCareTask } = useTokens();

  // Active interactive modal state
  const [activeModal, setActiveModal] = useState<'breathe' | 'hydrate' | 'learn' | null>(null);

  // Breathing exercise timer
  const [breathingSeconds, setBreathingSeconds] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale 🌸' | 'Hold ✨' | 'Exhale 💗'>('Inhale 🌸');

  // Hydration counter
  const [waterGlasses, setWaterGlasses] = useState(3);

  // Start breathing exercise
  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingSeconds(30);

    let sec = 30;
    const interval = setInterval(() => {
      sec -= 1;
      setBreathingSeconds(sec);

      const cycle = sec % 9;
      if (cycle >= 6) setBreathPhase('Inhale 🌸');
      else if (cycle >= 4) setBreathPhase('Hold ✨');
      else setBreathPhase('Exhale 💗');

      if (sec <= 0) {
        clearInterval(interval);
        setIsBreathingActive(false);
        completeCareTask('breathe', 10, 'Mindful Breathing Pranayama 🧘‍♀️');
      }
    }, 1000);
  };

  const handleDrinkWater = () => {
    setWaterGlasses((prev) => prev + 1);
    completeCareTask('hydrate', 5, 'Daily Hydration Check 💧');
    setTimeout(() => setActiveModal(null), 1500);
  };

  const handleFinishLearn = () => {
    completeCareTask('learn', 10, 'Cycle Care Card 📚');
    setActiveModal(null);
    onOpenPhaseGuide?.();
  };

  const handleCheckin = () => {
    completeCareTask('checkin', 5, 'Daily Symptom Log 📝');
    onOpenSymptomLogger?.();
  };

  const tasks = [
    {
      id: 'breathe',
      title: 'Breathe',
      hindiTitle: 'प्राणायाम (Breathe)',
      subtitle: '1-min calming breathwork',
      hindiSubtitle: 'मन को शांत करें',
      tokens: 10,
      icon: '🧘‍♀️',
      completed: completedTasksToday.includes('breathe'),
      onClick: () => setActiveModal('breathe'),
      bgGradient: 'from-pink-50 via-rose-50 to-purple-50',
      borderColor: 'border-pink-200',
    },
    {
      id: 'hydrate',
      title: 'Hydrate',
      hindiTitle: 'जलपान (Hydrate)',
      subtitle: 'Warm water or herbal tea',
      hindiSubtitle: 'गुनगुना पानी पिएं',
      tokens: 5,
      icon: '💧',
      completed: completedTasksToday.includes('hydrate'),
      onClick: () => setActiveModal('hydrate'),
      bgGradient: 'from-blue-50 via-cyan-50 to-indigo-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'checkin',
      title: 'Check-in',
      hindiTitle: 'लक्षण दर्ज (Check-in)',
      subtitle: 'Log flow, mood & cramps',
      hindiSubtitle: 'आज कैसा लग रहा है?',
      tokens: 5,
      icon: '📝',
      completed: completedTasksToday.includes('checkin'),
      onClick: handleCheckin,
      bgGradient: 'from-amber-50 via-rose-50 to-orange-50',
      borderColor: 'border-amber-200',
    },
    {
      id: 'learn',
      title: 'Learn',
      hindiTitle: 'ज्ञान (Learn)',
      subtitle: `${cycleStatus.phase} phase food & rest`,
      hindiSubtitle: 'आज के लिए पौष्टिक सलाह',
      tokens: 10,
      icon: '📚',
      completed: completedTasksToday.includes('learn'),
      onClick: () => setActiveModal('learn'),
      bgGradient: 'from-emerald-50 via-teal-50 to-green-50',
      borderColor: 'border-emerald-200',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💗</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1E29] tracking-tight">
            Today's Care 🌸
          </h2>
        </div>
        <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
          Earn Tokens Daily ✨
        </span>
      </div>

      {/* 4 Cute Interactive Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tasks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={t.onClick}
            className={`text-left p-4 rounded-3xl border ${t.borderColor} bg-gradient-to-br ${t.bgGradient} shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between min-h-[135px] cursor-pointer group`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between w-full">
              <span className="text-2xl p-2 rounded-2xl bg-white/80 shadow-2xs group-hover:scale-110 transition-transform">
                {t.icon}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white/90 px-2 py-0.5 rounded-full border border-pink-100 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>+{t.tokens}</span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-3 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#4A1E29]">
                  {t.title}
                </h3>
                {t.completed && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                )}
              </div>
              <p className="text-[11px] text-[#7A4B55] line-clamp-1">
                {t.subtitle}
              </p>
            </div>

            {t.completed && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                Done ✨
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Breathe Exercise Modal */}
      {activeModal === 'breathe' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-pink-200 shadow-2xl p-6 text-center space-y-5 relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-3xl">🧘‍♀️</span>
              <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1">
                Calming Pranayama 🌸
              </h3>
              <p className="text-xs text-[#7A4B55] mt-1">
                Slow down, release pelvic tension, and let your body soften.
              </p>
            </div>

            {/* Animated Breathing Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-amber-200 flex items-center justify-center text-white font-bold text-lg shadow-inner transition-transform duration-1000 ${
                  isBreathingActive ? 'scale-115 animate-pulse' : 'scale-100'
                }`}
              >
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center text-center p-2 shadow-sm">
                  <span className="text-xs font-bold text-rose-700">
                    {breathPhase}
                  </span>
                  {isBreathingActive && (
                    <span className="text-2xl font-serif font-extrabold text-[#4A1E29] mt-0.5">
                      {breathingSeconds}s
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            {!isBreathingActive ? (
              <button
                type="button"
                onClick={startBreathing}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin 30s Breathe Session (+10 Tokens)</span>
              </button>
            ) : (
              <p className="text-xs text-pink-700 font-bold animate-pulse">
                Breathing with Sakhi... relax your shoulders 💗
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hydration Modal */}
      {activeModal === 'hydrate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-blue-200 shadow-2xl p-6 text-center space-y-4 relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-3xl">💧</span>
              <h3 className="font-serif text-xl font-bold text-[#4A1E29] mt-1">
                Hydration & Cramp Relief
              </h3>
              <p className="text-xs text-[#7A4B55] mt-1">
                Warm water, ajwain water, or chamomile tea relaxes the uterine muscles and relieves bloating.
              </p>
            </div>

            <div className="py-4 flex items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                🥛
              </div>
              <div className="text-left">
                <span className="text-2xl font-extrabold text-[#4A1E29] font-serif">
                  {waterGlasses} / 8
                </span>
                <span className="text-xs text-gray-500 block">glasses today</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDrinkWater}
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Droplets className="w-4 h-4" />
              <span>Log 1 Glass Warm Water (+5 Tokens)</span>
            </button>
          </div>
        </div>
      )}

      {/* Learn Care Card Modal */}
      {activeModal === 'learn' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-emerald-200 shadow-2xl p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Phase Care Wisdom
                </span>
                <h3 className="font-serif text-lg font-bold text-[#4A1E29]">
                  {cycleStatus.phase.toUpperCase()} Phase Guidance
                </h3>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2 text-xs text-[#4A1E29] leading-relaxed">
              <p className="font-bold text-emerald-900">
                ✨ Hormonal Rhythm Note:
              </p>
              <p>
                During this phase, your estrogen and progesterone dance in unique balance. Sip warm ginger cinnamon tea, eat magnesium-rich seeds (pumpkin/sunflower), and honor your body's energy levels.
              </p>
              <p className="text-[11px] text-emerald-800 italic">
                “Be gentle with yourself, Sakhi. Rest is not laziness, it is body wisdom.” 💗
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinishLearn}
              className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Read Full Phase Guide (+10 Tokens)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
