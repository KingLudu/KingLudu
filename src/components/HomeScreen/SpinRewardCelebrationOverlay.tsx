import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Sparkles,
  Coins,
  CheckCircle2,
  X,
  Wallet,
  ArrowRight,
  Flame,
  Crown,
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export interface SpinRewardCelebrationData {
  amount: number;
  title: string;
  previousBalance: number;
  newBalance: number;
  timestamp: number;
}

interface SpinRewardCelebrationOverlayProps {
  data: SpinRewardCelebrationData;
  onClose: () => void;
  onNavigateWallet?: () => void;
}

export const SpinRewardCelebrationOverlay: React.FC<SpinRewardCelebrationOverlayProps> = ({
  data,
  onClose,
  onNavigateWallet,
}) => {
  const [coins] = useState(() =>
    Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5, // 5% to 95%
      delay: Math.random() * 1.5, // 0 to 1.5s
      duration: 2.4 + Math.random() * 1.4, // 2.4s to 3.8s
      size: 16 + Math.floor(Math.random() * 14), // 16px to 30px
      type: i % 4, // 0: coin, 1: star, 2: trophy, 3: sparkle
    }))
  );

  const [progress, setProgress] = useState(100);

  // Play fanfare / cash audio sound on mount
  useEffect(() => {
    try {
      sounds.playSuccessFanfare(0.85);
    } catch {
      // Audio safety
    }
  }, []);

  // Auto-dismiss countdown (7 seconds)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 7000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="relative z-30 w-full max-w-lg mx-auto mb-2 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Falling Coins Shower Particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute -top-8 animate-coin-fall text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]"
            style={{
              left: `${coin.left}%`,
              animationDelay: `${coin.delay}s`,
              animationDuration: `${coin.duration}s`,
            }}
          >
            {coin.type === 0 && <Coins style={{ width: coin.size, height: coin.size }} className="text-yellow-300" />}
            {coin.type === 1 && <Sparkles style={{ width: coin.size, height: coin.size }} className="text-amber-200" />}
            {coin.type === 2 && <Trophy style={{ width: coin.size, height: coin.size }} className="text-amber-400" />}
            {coin.type === 3 && <Crown style={{ width: coin.size, height: coin.size }} className="text-yellow-400" />}
          </div>
        ))}
      </div>

      {/* Main Celebration Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#063314] via-[#04260f] to-[#031e0c] border-2 border-amber-400 shadow-[0_12px_45px_rgba(245,158,11,0.55)] p-4 sm:p-5 text-white animate-pulse-gold">
        {/* Background Aura Glows */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-amber-500/25 to-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition active:scale-90 border border-emerald-500/40 cursor-pointer z-20"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-500/25 to-amber-500/25 border border-amber-400/50 text-[11px] font-black text-amber-300 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-bounce" />
            <span>🎉 লাকি স্পিন রিওয়ার্ড সফল!</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ব্যালেন্স আপডেটেড</span>
          </span>
        </div>

        {/* Prize Amount Showcase */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#031e0c]/90 border border-amber-400/40 rounded-2xl p-3 sm:p-3.5 shadow-inner">
          <div className="flex items-center gap-3">
            {/* Spinning Golden Trophy Hub */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.6)] shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#07441b] flex items-center justify-center">
                <Trophy className="w-7 h-7 text-yellow-300 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-emerald-200">
                পুরস্কারের পরিমাণ (Credited):
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight bg-gradient-to-r from-yellow-200 via-amber-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm flex items-baseline gap-1">
                <span>+৳{data.amount.toFixed(2)}</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-sans">
                  ক্যাশ
                </span>
              </div>
            </div>
          </div>

          {/* Visual Balance Step: Before -> After */}
          <div className="flex items-center gap-2 bg-[#090217] px-3 py-2 rounded-xl border border-purple-800/60 text-xs">
            <div className="text-right">
              <div className="text-[9px] text-purple-300 font-medium">পূর্বের ব্যালেন্স</div>
              <div className="font-mono text-[11px] font-bold text-slate-300">
                ৳{data.previousBalance.toFixed(2)}
              </div>
            </div>

            <div className="text-amber-400 font-bold px-0.5">➔</div>

            <div>
              <div className="text-[9px] text-emerald-300 font-semibold">নতুন ব্যালেন্স</div>
              <div className="font-mono text-xs font-black text-emerald-300 flex items-center gap-0.5">
                <span>৳{data.newBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-1">
          <p className="text-[11px] font-medium text-amber-200/90 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>টাকা আপনার ওয়ালেট ব্যালেন্সে সাথে সাথে যোগ হয়েছে!</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateWallet && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateWallet();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Wallet className="w-3 h-3 text-amber-300" />
                <span>ওয়ালেট</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-[11px] shadow-md flex items-center gap-1 transition active:scale-95 cursor-pointer border border-yellow-200"
            >
              <span>✓ ঠিক আছে</span>
            </button>
          </div>
        </div>

        {/* Bottom Auto-Dismiss Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#031e0c]">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
