import React from 'react';
import { Sparkles, Flame, Trophy, Gift, ArrowRight, Disc } from 'lucide-react';

interface LuckySpinnerBannerProps {
  onOpenSpinner: () => void;
  hasFreeSpin?: boolean;
  recentWin?: { amount: number; timestamp: number } | null;
}

export const LuckySpinnerBanner: React.FC<LuckySpinnerBannerProps> = ({
  onOpenSpinner,
  hasFreeSpin = true,
  recentWin,
}) => {
  const isRecentlyWon = Boolean(recentWin && recentWin.amount > 0);

  return (
    <div
      onClick={onOpenSpinner}
      className={`relative max-w-lg mx-auto w-full bg-gradient-to-r ${
        isRecentlyWon
          ? 'from-[#1b382b] via-[#10243d] to-[#251247] border-2 border-emerald-400 shadow-[0_8px_30px_rgba(52,211,153,0.4)]'
          : 'from-[#2c1458] via-[#1a0c3b] to-[#250f4c] border-2 border-amber-400/60 shadow-[0_8px_25px_rgba(245,158,11,0.25)]'
      } rounded-3xl p-3 sm:p-3.5 hover:border-amber-300 transition-all duration-200 cursor-pointer overflow-hidden group active:scale-98`}
    >
      {/* Background Animated Fiery/Golden Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-24 h-24 bg-orange-500/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left: Mini Glowing Wheel Hub */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* External ring aura */}
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${
              isRecentlyWon
                ? 'from-emerald-400 via-teal-400 to-amber-400 p-0.5 shadow-[0_0_18px_rgba(52,211,153,0.7)]'
                : 'from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
            } group-hover:shadow-[0_0_22px_rgba(245,158,11,0.85)] transition-all`}
          >
            <div className="w-full h-full rounded-[14px] bg-[#140b2e] flex items-center justify-center relative overflow-hidden">
              <Disc className="w-8 h-8 text-amber-300 group-hover:rotate-180 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-black text-white bg-red-600 px-1 py-0.2 rounded-full shadow-sm">
                  GO
                </span>
              </div>
            </div>
          </div>

          {/* Floating Online/Free Pill */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-amber-500 border border-white/80 items-center justify-center text-[7px] font-black text-white">
              ★
            </span>
          </span>
        </div>

        {/* Center: Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 text-amber-300 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
              <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>ডেইলি লাকি রিওয়ার্ড</span>
            </span>
            {isRecentlyWon ? (
              <span className="bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-emerald-400" />
                <span>৳{recentWin?.amount} জিতেছেন!</span>
              </span>
            ) : hasFreeSpin ? (
              <span className="bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                ফ্রি স্পিন!
              </span>
            ) : null}
          </div>

          <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-1 truncate">
            <span>লাকি স্পিনার হুইল (Lucky Spin)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </h3>

          <p className="text-[11px] font-medium text-purple-200/90 truncate">
            {isRecentlyWon ? (
              <span className="text-emerald-300 font-bold">
                ✓ আপনার পুরস্কার ওয়ালেটে যোগ হয়েছে! আবার স্পিন করতে ট্যাপ করুন।
              </span>
            ) : (
              <>
                চাকা ঘুরিয়ে জিতে নিন সর্বোচ্চ <strong className="text-amber-300 font-black font-mono">৳৫০,০০০</strong> পর্যন্ত ক্যাশ!
              </>
            )}
          </p>
        </div>

        {/* Right: Golden Action Button */}
        <div className="shrink-0">
          <button
            type="button"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-[0_4px_15px_rgba(245,158,11,0.5)] flex items-center gap-1 group-hover:scale-105 active:scale-95 transition-all cursor-pointer border border-yellow-200"
          >
            <span>{isRecentlyWon ? 'আবার স্পিন' : 'স্পিন'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
