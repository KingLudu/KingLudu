import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Coins, 
  ChevronRight, 
  Trophy, 
  HelpCircle, 
  X, 
  PartyPopper,
  CalendarCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { UserProfile, AppSettings, ScreenType } from '../../types';
import { sounds } from '../../utils/soundEffects';

export interface DailyCheckInCardProps {
  user: UserProfile;
  appSettings?: AppSettings;
  onClaimDailyReward: (amount: number, streakDay: number) => void;
  onNavigate?: (screen: ScreenType) => void;
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const STREAK_RESET_MS = 48 * 60 * 60 * 1000; // 48 hours to maintain streak

const DEFAULT_REWARDS = [
  { day: 1, amount: 5, label: 'দিন ১' },
  { day: 2, amount: 10, label: 'দিন ২' },
  { day: 3, amount: 15, label: 'দিন ৩' },
  { day: 4, amount: 20, label: 'দিন ৪' },
  { day: 5, amount: 25, label: 'দিন ৫' },
  { day: 6, amount: 35, label: 'দিন ৬' },
  { day: 7, amount: 50, label: 'দিন ৭', isJackpot: true },
];

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
  user,
  appSettings,
  onClaimDailyReward,
  onNavigate,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState<number>(1);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [claimedCelebration, setClaimedCelebration] = useState<{
    amount: number;
    day: number;
  } | null>(null);

  // Storage key specific to user
  const storageKey = `kingludo_daily_checkin_${user.id || user.phone || 'guest'}`;

  // Evaluate eligibility & remaining countdown
  const evaluateCheckInState = () => {
    try {
      let lastTimestamp = user.lastCheckInTimestamp || 0;
      let streak = user.checkInStreak || 0;

      // Also check device storage for instant persistence
      const localData = localStorage.getItem(storageKey);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.lastTimestamp && parsed.lastTimestamp > lastTimestamp) {
          lastTimestamp = parsed.lastTimestamp;
          streak = parsed.streak || streak;
        }
      }

      if (!lastTimestamp) {
        setCanClaim(true);
        setTimeLeft(0);
        setCurrentStreak(1);
        return;
      }

      const now = Date.now();
      const elapsed = now - lastTimestamp;

      if (elapsed >= COOLDOWN_MS) {
        setCanClaim(true);
        setTimeLeft(0);

        // Check if streak was broken (missed > 48h)
        if (elapsed > STREAK_RESET_MS) {
          setCurrentStreak(1);
        } else {
          // Progress streak from 1 to 7 cycle
          const nextStreak = (streak % 7) + 1;
          setCurrentStreak(nextStreak);
        }
      } else {
        setCanClaim(false);
        setTimeLeft(COOLDOWN_MS - elapsed);
        setCurrentStreak(streak > 0 ? ((streak - 1) % 7) + 1 : 1);
      }
    } catch {
      setCanClaim(true);
      setTimeLeft(0);
      setCurrentStreak(1);
    }
  };

  // Run countdown timer every second
  useEffect(() => {
    evaluateCheckInState();

    const timer = setInterval(() => {
      evaluateCheckInState();
    }, 1000);

    return () => clearInterval(timer);
  }, [user.lastCheckInTimestamp, user.checkInStreak, user.id, user.phone]);

  // Format countdown remaining: HH:MM:SS
  const formatCountdown = (ms: number) => {
    if (ms <= 0) return '০০:০০:০০';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Convert English numbers to Bengali numerals for authentic BD experience
  const toBanglaDigits = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
  };

  // Current day's reward amount
  const todayReward = DEFAULT_REWARDS.find((r) => r.day === currentStreak) || DEFAULT_REWARDS[0];
  const todayAmount = appSettings?.dailyRewardAmount && currentStreak === 1
    ? Math.max(5, appSettings.dailyRewardAmount)
    : todayReward.amount;

  const handleClaim = () => {
    if (!canClaim) return;

    const now = Date.now();
    const streakDay = currentStreak;
    const rewardAmount = todayAmount;

    // Persist immediately in localStorage
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          lastTimestamp: now,
          streak: streakDay,
        })
      );
    } catch (e) {
      console.error('Error saving checkin state:', e);
    }

    // Play fanfare / coins sound
    try {
      sounds.playSuccessFanfare(0.9);
      setTimeout(() => {
        sounds.playCoinDrop(1);
      }, 400);
    } catch {
      // Audio safety
    }

    // Trigger parent balance credit & transaction
    onClaimDailyReward(rewardAmount, streakDay);

    // Update local card state immediately
    setCanClaim(false);
    setTimeLeft(COOLDOWN_MS);
    setClaimedCelebration({
      amount: rewardAmount,
      day: streakDay,
    });
  };

  return (
    <div className="relative z-10 max-w-lg mx-auto bg-gradient-to-br from-[#1b1046]/95 via-[#23145a]/95 to-[#160c38]/95 border border-amber-400/40 rounded-3xl p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden">
      {/* Glossy top-right ambient flare */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-purple-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#07441b] rounded-[14px] flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">
                দৈনিক চেক-ইন বোনাস
              </h3>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                <span>দিন {toBanglaDigits(currentStreak)}/৭</span>
              </span>
            </div>
            <p className="text-[10px] text-purple-200/80 font-medium mt-0.5">
              প্রতি ২৪ ঘণ্টায় একবার ফ্রি বোনাস রিওয়ার্ড সংগ্রহ করুন
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRulesModal(true)}
          className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-600/40 transition cursor-pointer"
          title="নিয়মাবলী ও নির্দেশিকা"
        >
          <HelpCircle className="w-4 h-4 text-emerald-300" />
        </button>
      </div>

      {/* 7-Day Visual Progress Track */}
      <div className="mt-3">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {DEFAULT_REWARDS.map((item) => {
            const isCompleted = !canClaim ? item.day <= currentStreak : item.day < currentStreak;
            const isToday = canClaim && item.day === currentStreak;
            const isFuture = item.day > currentStreak;

            return (
              <div
                key={item.day}
                className={`relative flex flex-col items-center justify-between p-1.5 py-2 rounded-2xl border transition-all text-center ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.2)]'
                    : isToday
                    ? 'bg-gradient-to-b from-amber-500/30 to-amber-900/40 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 scale-[1.03] shadow-[0_4px_12px_rgba(245,158,11,0.3)] animate-pulse'
                    : 'bg-[#031e0c]/60 border-emerald-800/40 text-emerald-300/70'
                }`}
              >
                {/* Day label */}
                <span className="text-[8px] sm:text-[9px] font-bold">
                  {item.label}
                </span>

                {/* Center Icon */}
                <div className="my-1">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : item.isJackpot ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                      <Trophy className="w-4 h-4" />
                    </div>
                  ) : isToday ? (
                    <div className="w-6 h-6 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-300">
                      <Gift className="w-4 h-4 animate-bounce" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400/70">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Amount */}
                <span
                  className={`text-[9px] sm:text-[10px] font-black ${
                    isCompleted
                      ? 'text-emerald-300'
                      : isToday
                      ? 'text-amber-200 font-extrabold'
                      : 'text-purple-200/90'
                  }`}
                >
                  ৳{toBanglaDigits(item.amount)}
                </span>

                {/* Jackpot Badge */}
                {item.isJackpot && (
                  <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[6px] px-1 py-0.2 rounded-full shadow">
                    মেগা
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer & Countdown */}
      <div className="mt-3.5 pt-3 border-t border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-purple-200">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] font-medium text-purple-200/90">
              {canClaim ? 'আজকের রিওয়ার্ড প্রস্তুত:' : 'পরবর্তী চেক-ইন বাকি:'}
            </span>
          </div>

          <span
            className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border ${
              canClaim
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 animate-pulse'
                : 'bg-emerald-950/80 text-amber-300 border-emerald-700/50'
            }`}
          >
            {canClaim ? 'এখনই ক্লেইম করুন' : formatCountdown(timeLeft)}
          </span>
        </div>

        {/* Claim Button */}
        <button
          id="daily-checkin-claim-btn"
          type="button"
          onClick={handleClaim}
          disabled={!canClaim}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
            canClaim
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)] border border-amber-300/80 cursor-pointer'
              : 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-300/70 cursor-not-allowed opacity-90'
          }`}
        >
          {canClaim ? (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
              <span>আজকের ৳{toBanglaDigits(todayAmount)} বোনাস নিন</span>
              <Coins className="w-4 h-4 text-slate-950" />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>সংগৃহীত (Claimed)</span>
            </>
          )}
        </button>
      </div>

      {/* Rules & Information Modal */}
      {showRulesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowRulesModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#07441b] border border-amber-400/60 rounded-3xl shadow-2xl p-4 text-left relative animate-in zoom-in-95 duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">দৈনিক চেক-ইন বোনাস নিয়ম</h4>
                  <p className="text-[10px] text-purple-300">KingLudo Daily Check-in Rules</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="p-1.5 rounded-xl bg-emerald-950 hover:bg-rose-600 border border-emerald-700/50 text-emerald-200 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 text-[11px] text-emerald-200/90 leading-relaxed">
              <div className="flex items-start gap-2 bg-[#04260f]/90 p-2.5 rounded-2xl border border-emerald-700/50">
                <span className="text-amber-400 font-bold text-sm shrink-0">১.</span>
                <span>
                  প্রতি <strong>২৪ ঘণ্টায় একবার</strong> আপনি এই বাটনে ক্লিক করে ফ্রি বোনাস কয়েন গ্রহণ করতে পারবেন।
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#04260f]/90 p-2.5 rounded-2xl border border-emerald-700/50">
                <span className="text-emerald-400 font-bold text-sm shrink-0">২.</span>
                <span>
                  ধারাবাহিক ৭ দিনের স্ট্রিকে প্রাইজ মানি বৃদ্ধি পায় (<strong>৳৫ থেকে ৳৫০</strong> পর্যন্ত)। ৭ম দিনে রয়েছে মেগা জ্যাকপট!
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#04260f]/90 p-2.5 rounded-2xl border border-emerald-700/50">
                <span className="text-cyan-400 font-bold text-sm shrink-0">৩.</span>
                <span>
                  টাকা সরাসরি আপনার ওয়ালেট ব্যালেন্সে ইনস্ট্যান্ট যোগ হবে, যা দিয়ে আপনি যেকোনো ম্যাচ খেলতে পারবেন।
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#04260f]/90 p-2.5 rounded-2xl border border-emerald-700/50">
                <span className="text-rose-400 font-bold text-sm shrink-0">৪.</span>
                <span>
                  যদি ৪৮ ঘণ্টার বেশি সময় চেক-ইন না করেন, তবে স্ট্রিক পুনরায় দিন ১ থেকে শুরু হবে।
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow transition"
              >
                বুঝেছি (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Celebration Modal */}
      {claimedCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setClaimedCelebration(null)}
        >
          <div
            className="w-full max-w-sm bg-gradient-to-b from-[#063314] via-[#04260f] to-[#031e0c] border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.4)] p-5 text-center relative animate-in zoom-in-95 duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-400/30 rounded-full blur-2xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setClaimedCelebration(null)}
              className="absolute top-3 right-3 p-1.5 rounded-xl bg-emerald-900/60 hover:bg-rose-600 text-emerald-200 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-[#07441b] rounded-[22px] flex items-center justify-center">
                <PartyPopper className="w-8 h-8 text-amber-300 animate-bounce" />
              </div>
            </div>

            <span className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/40">
              দৈনিক চেক-ইন সফল!
            </span>

            <h3 className="text-xl font-black text-white mt-1">অভিনন্দন!</h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              আপনি আজকের চেক-ইন বোনাস পেয়েছেন
            </p>

            <div className="my-4 p-3 bg-[#031e0c] border border-amber-400/50 rounded-2xl flex items-center justify-center gap-2 shadow-inner">
              <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="text-2xl font-black text-amber-300 font-mono">
                +৳{toBanglaDigits(claimedCelebration.amount)}
              </span>
            </div>

            <div className="text-[11px] text-emerald-300 flex items-center justify-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>
                বর্তমান স্ট্রিক: <strong>দিন {toBanglaDigits(claimedCelebration.day)}</strong> সম্পন্ন হয়েছে!
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setClaimedCelebration(null);
                  if (onNavigate) onNavigate('wallet');
                }}
                className="py-2.5 px-3 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>ওয়ালেট দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setClaimedCelebration(null)}
                className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition active:scale-95"
              >
                দারুণ! ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
