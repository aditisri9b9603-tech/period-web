export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CycleSettings {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // e.g. 28 days
  periodDuration: number; // e.g. 5 days
}

export interface DailySymptomLog {
  date: string; // YYYY-MM-DD
  flow: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  cramps: 'none' | 'mild' | 'moderate' | 'severe';
  mood: 'happy' | 'calm' | 'sensitive' | 'anxious' | 'irritable' | 'exhausted';
  energy: 'high' | 'balanced' | 'low' | 'drained';
  symptoms: string[];
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  avatar?: string;
  cycleSettings: CycleSettings;
}

export interface CycleStatus {
  currentDay: number;
  totalDays: number;
  phase: CyclePhase;
  phaseProgress: number; // 0 to 100%
  daysUntilNextPeriod: number;
  nextPeriodDate: Date;
  estimatedOvulationDate: Date;
  isFertileWindow: boolean;
  isPeakOvulation: boolean;
  fertilityLevel: 'low' | 'elevated' | 'peak';
}

export function calculateCycleStatus(settings: CycleSettings, targetDate: Date = new Date()): CycleStatus {
  const start = new Date(settings.lastPeriodDate + 'T00:00:00');
  const today = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const cycleLen = Math.max(21, Math.min(45, settings.cycleLength || 28));
  const periodDur = Math.max(2, Math.min(10, settings.periodDuration || 5));

  // Current day in cycle (1-indexed)
  let currentDay = ((diffDays % cycleLen) + cycleLen) % cycleLen + 1;
  if (diffDays < 0) {
    currentDay = 1;
  }

  // Estimated ovulation is typically 14 days before end of cycle
  const estimatedOvulationDay = Math.max(periodDur + 2, cycleLen - 14);

  // Determine Phase
  let phase: CyclePhase = 'follicular';
  if (currentDay <= periodDur) {
    phase = 'menstrual';
  } else if (currentDay < estimatedOvulationDay - 1) {
    phase = 'follicular';
  } else if (currentDay <= estimatedOvulationDay + 1) {
    phase = 'ovulatory';
  } else {
    phase = 'luteal';
  }

  // Next Period calculation
  const daysUntilNextPeriod = cycleLen - currentDay + 1;
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysUntilNextPeriod);

  // Ovulation Date
  const daysUntilOvulation = (estimatedOvulationDay - currentDay + cycleLen) % cycleLen;
  const estimatedOvulationDate = new Date(today);
  estimatedOvulationDate.setDate(today.getDate() + daysUntilOvulation);

  // Fertility window: 5 days before ovulation up to 1 day after
  const isFertileWindow = currentDay >= estimatedOvulationDay - 4 && currentDay <= estimatedOvulationDay + 1;
  const isPeakOvulation = currentDay === estimatedOvulationDay;
  const fertilityLevel = isPeakOvulation ? 'peak' : isFertileWindow ? 'elevated' : 'low';

  const phaseProgress = Math.round((currentDay / cycleLen) * 100);

  return {
    currentDay,
    totalDays: cycleLen,
    phase,
    phaseProgress,
    daysUntilNextPeriod,
    nextPeriodDate,
    estimatedOvulationDate,
    isFertileWindow,
    isPeakOvulation,
    fertilityLevel,
  };
}
