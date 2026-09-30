import React, { useState } from 'react';
import { CycleSettings, CycleStatus, DailySymptomLog } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, TrendingUp } from 'lucide-react';

interface CycleCalendarProps {
  settings: CycleSettings;
  status: CycleStatus;
  logs: Record<string, DailySymptomLog>;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({ settings, status, logs }) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to determine day classification
  const getDayInfo = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const checkDate = new Date(year, month, day);

    // Is there a logged period or symptom?
    const log = logs[dateStr];
    const hasFlow = log && log.flow !== 'none';

    // Calculate diff from lastPeriodDate
    const start = new Date(settings.lastPeriodDate + 'T00:00:00');
    const diffTime = checkDate.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % settings.cycleLength) + settings.cycleLength) % settings.cycleLength + 1;

    // Period days (1 to periodDuration)
    const isPeriodPredicted = cycleDay <= settings.periodDuration;

    // Ovulation window
    const ovulationDay = Math.max(settings.periodDuration + 2, settings.cycleLength - 14);
    const isFertile = cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1;
    const isOvulationDay = cycleDay === ovulationDay;

    // Is today
    const today = new Date();
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    return {
      dateStr,
      hasFlow,
      isPeriodPredicted,
      isFertile,
      isOvulationDay,
      isToday,
      cycleDay,
      log,
    };
  };

  return (
    <div className="space-y-6">
      {/* Trends Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFDFB] rounded-2xl p-4 border border-[#F4DFE2] shadow-2xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66F7B]">
              {t.avgCycleLength}
            </span>
            <div className="text-xl font-serif font-bold text-[#4A1E29]">
              {settings.cycleLength} {t.days}
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDFB] rounded-2xl p-4 border border-[#F4DFE2] shadow-2xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66F7B]">
              {t.avgPeriodLength}
            </span>
            <div className="text-xl font-serif font-bold text-[#4A1E29]">
              {settings.periodDuration} {t.days}
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDFB] rounded-2xl p-4 border border-[#F4DFE2] shadow-2xs flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66F7B]">
              {t.cycleRegularity}
            </span>
            <div className="text-lg font-serif font-bold text-[#2D6A4F]">
              {t.regular}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Card */}
      <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-[#7A4B55] mt-0.5">{t.calendarSub}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-xl text-[#7A4B55] hover:bg-[#FFF4F0] border border-[#F4D7DB] transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-xl text-[#7A4B55] hover:bg-[#FFF4F0] border border-[#F4D7DB] transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A4B55] pt-2 border-t border-[#F7E7E9]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E11D48]" />
            <span>{t.loggedPeriod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-200 border border-rose-400" />
            <span>{t.predictedPeriod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <span>{t.ovulationWindow}</span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-[#A66F7B]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-xl opacity-20" />
          ))}

          {/* Days in Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const info = getDayInfo(day);

            let dayStyle = 'bg-[#FFF9F6] text-[#4A262E] hover:bg-[#FFF2EE]';
            if (info.hasFlow) {
              dayStyle = 'bg-[#E11D48] text-white font-bold shadow-xs';
            } else if (info.isPeriodPredicted) {
              dayStyle = 'bg-rose-100 text-rose-900 border border-rose-300 font-medium';
            } else if (info.isOvulationDay) {
              dayStyle = 'bg-amber-300 text-amber-950 font-bold border border-amber-400 shadow-xs';
            } else if (info.isFertile) {
              dayStyle = 'bg-amber-100 text-amber-900 border border-amber-200';
            }

            return (
              <div
                key={day}
                className={`relative h-12 sm:h-14 rounded-xl flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all cursor-default border border-[#F4DFE2]/60 ${dayStyle} ${
                  info.isToday ? 'ring-2 ring-[#C04D68]' : ''
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs sm:text-sm">{day}</span>
                  {info.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C04D68]" title="Today" />
                  )}
                </div>

                <div className="w-full flex items-center justify-center gap-0.5 text-[9px] sm:text-[10px]">
                  {info.hasFlow && <span>🩸</span>}
                  {info.isOvulationDay && <span>🥚</span>}
                  {info.log && !info.hasFlow && <span>📝</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
