import React from 'react';
import { useTokens } from '../context/TokenContext';
import { X, Sparkles, TrendingUp, ShoppingBag, Flame, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface SakhiWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToCare?: () => void;
}

export const SakhiWalletModal: React.FC<SakhiWalletModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRewards,
  onNavigateToCare,
}) => {
  const { tokens, streak, earnedBreakdown, spentTotal, transactions } = useTokens();

  if (!isOpen) return null;

  const netBalance = tokens;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-pink-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-20 pointer-events-none text-8xl">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👛</span>
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                My Sakhi Wallet
              </h2>
            </div>
            <p className="text-xs text-pink-100 mt-0.5">
              Your self-care currency earned through healthy habits 🌸
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Big Balance Showcase */}
          <div className="bg-gradient-to-tr from-[#FFF3F5] via-[#FFF9FA] to-[#FCEEE9] border-2 border-pink-200 rounded-3xl p-5 text-center shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E6571]">
              Available Balance
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#7A1E34] font-serif">
                ✨ {tokens.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-pink-700">Sakhi Tokens</span>
            </div>
            <p className="text-xs text-[#7A4B55] max-w-xs mx-auto">
              Use tokens to redeem organic pads, cups & cycle treats in the Rewards shop!
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToRewards?.();
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Visit Rewards Shop</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToCare?.();
                }}
                className="px-4 py-2 rounded-full bg-white border border-pink-300 text-pink-700 text-xs font-bold hover:bg-pink-50 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Earn More Tokens</span>
              </button>
            </div>
          </div>

          {/* Earned vs Spent Ledger breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {/* Earned Breakdown */}
            <div className="bg-[#F8FFF9] border border-emerald-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Earned History</span>
              </div>
              <div className="text-[11px] space-y-1 text-emerald-900 font-medium">
                <div className="flex justify-between">
                  <span>Daily Care</span>
                  <span className="font-bold text-emerald-700">+{earnedBreakdown.dailyCare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Care Streaks</span>
                  <span className="font-bold text-emerald-700">+{earnedBreakdown.streak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Cards</span>
                  <span className="font-bold text-emerald-700">+{earnedBreakdown.learning}</span>
                </div>
              </div>
            </div>

            {/* Spent Breakdown */}
            <div className="bg-[#FFF5F7] border border-rose-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                <span>Spent on Rewards</span>
              </div>
              <div className="text-[11px] space-y-1 text-rose-900 font-medium">
                <div className="flex justify-between">
                  <span>Period Products</span>
                  <span className="font-bold text-rose-600">-{spentTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount Perks</span>
                  <span>-0</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-rose-100 text-xs font-bold text-rose-800">
                  <span>Net Left</span>
                  <span>{netBalance} ✨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Care Streak Connection */}
          <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#4A1E29]">
                    {streak} Day Care Streak
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#7A4B55]">
                  You're showing up for yourself! 💗 Next streak bonus: +50 Tokens.
                </p>
              </div>
            </div>
          </div>

          {/* Connected System: CARE -> TOKENS -> STREAK -> BADGES -> REWARDS */}
          <div className="bg-white border border-pink-100 rounded-2xl p-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A63A50]">
              The Sakhi Wellness Loop 🌸
            </span>
            <div className="flex items-center justify-between text-center gap-1 text-[11px] font-semibold text-[#5C2E38]">
              <div className="flex flex-col items-center">
                <span className="text-base">🌸</span>
                <span>Care</span>
              </div>
              <ArrowRight className="w-3 h-3 text-pink-300" />
              <div className="flex flex-col items-center">
                <span className="text-base">✨</span>
                <span>Tokens</span>
              </div>
              <ArrowRight className="w-3 h-3 text-pink-300" />
              <div className="flex flex-col items-center">
                <span className="text-base">🔥</span>
                <span>Streak</span>
              </div>
              <ArrowRight className="w-3 h-3 text-pink-300" />
              <div className="flex flex-col items-center">
                <span className="text-base">🏆</span>
                <span>Badges</span>
              </div>
              <ArrowRight className="w-3 h-3 text-pink-300" />
              <div className="flex flex-col items-center">
                <span className="text-base">🛍️</span>
                <span>Rewards</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Transaction History */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E6571]">
                Recent Ledger
              </span>
              <span className="text-[11px] text-[#7A4B55]">{transactions.length} entries</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#F4DFE2] text-xs hover:border-pink-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{tx.icon}</span>
                    <div>
                      <div className="font-semibold text-[#4A1E29]">{tx.title}</div>
                      <div className="text-[10px] text-[#8A5A66]">{tx.date}</div>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${
                      tx.type === 'earned' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} ✨
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
