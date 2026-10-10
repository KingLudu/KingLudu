import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Trophy,
  History,
  Share2,
  Disc,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Coins,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Users
} from 'lucide-react';
import { UserProfile, ScreenType, AppSettings, MatchHistoryItem } from '../../types';
import { DailyCheckInCard } from '../HomeScreen/DailyCheckInCard';

interface ActivityScreenProps {
  user: UserProfile;
  appSettings?: AppSettings;
  matchHistory?: MatchHistoryItem[];
  onNavigate: (screen: ScreenType) => void;
  onOpenLuckySpinner?: () => void;
  onOpenReferModal?: () => void;
  onClaimDailyReward?: (amount: number, streakDay: number) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  user,
  appSettings,
  matchHistory = [],
  onNavigate,
  onOpenLuckySpinner,
  onOpenReferModal,
  onClaimDailyReward,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'events'>('rewards');

  return (
    <div
      className="min-h-full text-white p-3.5 space-y-4 pb-28 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <Gift className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-1.5">
              <span>অ্যাক্টিভিটি ও রিওয়ার্ডস</span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                ACTIVITY
              </span>
            </h1>
            <p className="text-[11px] text-purple-200/80">দৈনিক রিওয়ার্ড, লাকি স্পিন ও ইভেন্ট হিস্ট্রি</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-300 bg-purple-950/80 border border-purple-600/40 px-3 py-1.5 rounded-xl hover:bg-purple-900/60 transition cursor-pointer"
        >
          হোম
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#052a12] rounded-2xl border border-purple-800/50 text-xs">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>রিওয়ার্ডস</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>হিস্ট্রি</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'events'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>ইভেন্টস</span>
        </button>
      </div>

      {/* Tab 1: Rewards */}
      {activeTab === 'rewards' && (
        <div className="space-y-3.5">
          {/* Daily Check-In Bonus */}
          <DailyCheckInCard
            user={user}
            appSettings={appSettings}
            onClaimDailyReward={onClaimDailyReward || (() => {})}
            onNavigate={onNavigate}
          />

          {/* Lucky Wheel Spinner Action Card */}
          <div
            onClick={onOpenLuckySpinner}
            className="p-4 rounded-3xl bg-gradient-to-r from-[#1c0f3c] via-[#24124d] to-[#150a2e] border-2 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.25)] flex items-center justify-between gap-3 cursor-pointer group active:scale-98 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
                <Disc className="w-6 h-6 animate-spin text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">লাকি হুইল স্পিনার (Lucky Spin)</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black">
                    ফ্রি স্পিন
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-tight mt-0.5">
                  চাকা ঘুরিয়ে প্রতিদিন জিতে নিন নগদ রিওয়ার্ড ও বোনাস!
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow flex items-center gap-1 shrink-0 group-hover:scale-105 transition"
            >
              <span>স্পিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refer & Earn Card */}
          <div
            onClick={onOpenReferModal}
            className="p-4 rounded-3xl bg-gradient-to-r from-[#170e30] via-[#231548] to-[#120a26] border-2 border-pink-500/50 shadow-lg flex items-center justify-between gap-3 cursor-pointer group active:scale-98 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg shrink-0">
                <Share2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">রেফার ও আর্ন বোনাস</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-black">
                    ৳{appSettings?.referralBonus || 100}
                  </span>
                </div>
                <p className="text-[11px] text-pink-200/90 leading-tight mt-0.5">
                  বন্ধুদের ইনভাইট করে প্রতি রেফারে জিতে নিন ইনস্ট্যান্ট বোনাস!
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs shadow flex items-center gap-1 shrink-0 group-hover:scale-105 transition"
            >
              <span>রেফার</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Activity History */}
      {activeTab === 'history' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-purple-200">সাম্প্রতিক ম্যাচের রেকর্ড ({matchHistory.length})</span>
            <button
              onClick={() => onNavigate('match_history')}
              className="text-[11px] text-amber-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
            >
              <span>সম্পূর্ণ ইতিহাস</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {matchHistory.length === 0 ? (
            <div className="p-8 text-center bg-[#052a12] rounded-2xl border border-purple-800/50 text-slate-400 text-xs space-y-2">
              <Clock className="w-8 h-8 text-purple-400/60 mx-auto" />
              <p>এখনও কোনো ম্যাচ খেলা হয়নি।</p>
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                ম্যাচ খেলুন
              </button>
            </div>
          ) : (
            matchHistory.slice(0, 10).map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-3 bg-[#052a12] rounded-2xl border border-purple-800/50 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    m.result === 'win'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {m.result === 'win' ? 'W' : 'L'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.mode || 'কিং লুডো ম্যাচ'}</h4>
                    <span className="text-[10px] text-slate-400">{m.date || 'আজ'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black font-mono block ${
                    m.result === 'win' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {m.result === 'win' ? `+৳${m.winAmount || m.entryFee}` : `-৳${m.entryFee}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {m.result === 'win' ? 'বিজয়ী' : 'পরাজয়'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Events & Tournaments */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1c0f3c] via-[#24124d] to-[#150a2e] border border-purple-500/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/30">
                চলমান টুর্নামেন্ট
              </span>
              <span className="text-xs font-bold text-amber-300">প্রাইজপুল: ৳৫০,০০০</span>
            </div>
            <h3 className="text-sm font-black text-white">দৈনিক মেগা লুডো কাপ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              প্রতিদিন সেরা ৫০ জন প্লেয়ারের জন্য স্পেশাল ক্যাশ প্রাইজপুল। এখনই টুর্নামেন্টে যোগ দিন!
            </p>
            <button
              onClick={() => onNavigate('matchmaking')}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow active:scale-95 transition cursor-pointer"
            >
              টুর্নামেন্টে জয়েন করুন
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#21163b] to-[#120a26] border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-500/30">
                লিডারবোর্ড রেস
              </span>
              <span className="text-xs font-bold text-amber-300">সাপ্তাহিক রিওয়ার্ড</span>
            </div>
            <h3 className="text-sm font-black text-white">সাপ্তাহিক টপ স্কোরার র‍্যাঙ্কিং</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              সাপ্তাহিক লিডারবোর্ডের শীর্ষস্থান অধিকার করে জিতে নিন বিশেষ ক্যাশব্যাক ও ভিআইপি ব্যাজ।
            </p>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs rounded-xl shadow active:scale-95 transition cursor-pointer"
            >
              লিডারবোর্ড দেখুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
