import React, { useState } from 'react';
import { UserProfile, CycleSettings } from '../types/cycle';
import { useTranslation } from '../i18n/context';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, UserCheck, Heart, Download, RefreshCw, Check, Sparkles } from 'lucide-react';

interface AccountViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  cycleSettings: CycleSettings;
  logsCount: number;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  onUpdateUser,
  cycleSettings,
  logsCount,
}) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    const backup = {
      user,
      cycleSettings,
      exportedAt: new Date().toISOString(),
      logsCount,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sakhi_cycle_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleToggleAuthMode = () => {
    if (user.isGuest) {
      onUpdateUser({
        ...user,
        isGuest: false,
        name: 'Aditi',
        email: 'aditiclearwitssih@gmail.com',
      });
    } else {
      onUpdateUser({
        ...user,
        isGuest: true,
        name: t.guestUser,
        email: '',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Account Card */}
      <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FAD2D8] via-[#FFEADB] to-[#FCEEE9] border-2 border-[#F4D7DB] flex items-center justify-center text-3xl font-serif font-bold text-[#A63A50] shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-xs">
              <Check className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-serif text-2xl font-bold text-[#4A1E29]">{user.name}</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FCEEE9] text-[#8B263E] border border-[#F4D7DB]">
                {user.isGuest ? t.guestUser : 'Protected Profile'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A4B55] mt-1">
              {user.email || 'Local encrypted health storage'}
            </p>
            <p className="text-xs text-[#9E6571] mt-0.5">
              {logsCount} {t.dailyLogSavedNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAuthMode}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-all border border-[#ECCACF] bg-[#FFF9F6] hover:bg-[#FCEEE9] text-[#5C2E38]"
          >
            {user.isGuest ? t.continueWithGoogle : t.signOut}
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 rounded-2xl bg-[#FFF6F3] border border-[#F5D8DF] flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#C04D68] flex-shrink-0" />
          <p className="text-xs text-[#6A3945]">{t.syncAccountData}</p>
        </div>

        {/* Data Backup button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F7E7E9]">
          <span className="text-xs font-medium text-[#7A4B55]">
            Export or download your personal wellness journal:
          </span>
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#FFF9F6] hover:bg-[#FCEEE9] text-[#5C2E38] border border-[#ECCACF] transition-colors"
          >
            {exportDone ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#9E6571]" />
                <span>Download Health Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy Promise Card */}
      <div className="bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 border border-[#F4DFE2] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#8B263E]">
          <ShieldCheck className="w-6 h-6 text-[#A63A50]" />
          <h4 className="font-serif text-xl font-bold text-[#4A1E29]">{t.privacyCommitment}</h4>
        </div>
        <p className="text-xs sm:text-sm text-[#6A3945] leading-relaxed">
          {t.privacyBody}
        </p>
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900 leading-normal">
          {t.medicalEmergencyWarning}
        </div>
      </div>
    </div>
  );
};
