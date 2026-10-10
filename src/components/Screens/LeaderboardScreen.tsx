import React, { useState } from 'react';
import { ArrowLeft, Crown } from 'lucide-react';
import { LeaderboardUser, ScreenType, RegionCode, REGIONS } from '../../types';
import { getTranslation } from '../../utils/translations';

interface LeaderboardScreenProps {
  users: LeaderboardUser[];
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  users = [],
  onNavigate,
  selectedRegion = 'BN',
}) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const t = getTranslation(selectedRegion);
  const regionInfo = REGIONS[selectedRegion] || REGIONS.BN;

  const top1 = safeUsers[0];
  const top2 = safeUsers[1];
  const top3 = safeUsers[2];
  const restUsers = safeUsers.slice(3);

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-20 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-white">{t.leaderboard}</h2>
        <div className="w-9" />
      </div>

      {/* Timeframe Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#04260f] p-1.5 rounded-xl border border-purple-900/40">
        {(['weekly', 'monthly', 'allTime'] as const).map((tf, tfIdx) => {
          const labels = { weekly: 'Weekly', monthly: 'Monthly', allTime: 'All Time' };
          const isActive = timeframe === tf;
          return (
            <button
              key={`leaderboard-tf-${tf}-${tfIdx}`}
              onClick={() => setTimeframe(tf)}
              className={`py-2 rounded-lg font-bold text-xs transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {labels[tf]}
            </button>
          );
        })}
      </div>

      {/* TOP 3 PODIUM */}
      <div className="flex justify-center items-end gap-3 pt-4 pb-2">
        {/* #2 Rank (Silver) */}
        {top2 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-1">
              <img
                src={top2.avatarUrl}
                alt={top2.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 shadow-lg"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                2
              </span>
            </div>
            <span className="text-[11px] font-bold text-white mt-1 max-w-[70px] truncate">{top2.name}</span>
            <span className="text-[10px] font-mono text-amber-300 font-bold">{regionInfo.currencySymbol}{top2.winnings.toLocaleString()}</span>
          </div>
        )}

        {/* #1 Rank (Gold - Center & Tallest) */}
        {top1 && (
          <div className="flex flex-col items-center -translate-y-2">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-0.5" />
            <div className="relative mb-1">
              <img
                src={top1.avatarUrl}
                alt={top1.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-xl ring-2 ring-amber-400/50"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                1
              </span>
            </div>
            <span className="text-xs font-extrabold text-amber-300 mt-1 max-w-[80px] truncate">{top1.name}</span>
            <span className="text-xs font-mono text-amber-300 font-extrabold">{regionInfo.currencySymbol}{top1.winnings.toLocaleString()}</span>
          </div>
        )}

        {/* #3 Rank (Bronze) */}
        {top3 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-1">
              <img
                src={top3.avatarUrl}
                alt={top3.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-700 shadow-lg"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                3
              </span>
            </div>
            <span className="text-[11px] font-bold text-white mt-1 max-w-[70px] truncate">{top3.name}</span>
            <span className="text-[10px] font-mono text-amber-300 font-bold">{regionInfo.currencySymbol}{top3.winnings.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Rest of Leaderboard List */}
      <div className="space-y-2">
        {restUsers.map((u, idx) => (
          <div
            key={`lb-user-${u.id || u.rank || idx}-${idx}`}
            className="bg-[#04260f] p-3 rounded-2xl border border-purple-900/40 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 w-5 text-center font-mono">
                {u.rank}
              </span>
              <img
                src={u.avatarUrl}
                alt={u.name}
                className="w-9 h-9 rounded-full object-cover border border-purple-700"
              />
              <span className="font-bold text-xs text-white">{u.name}</span>
            </div>

            <span className="font-mono font-bold text-xs text-amber-300">
              {regionInfo.currencySymbol}{u.winnings.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
