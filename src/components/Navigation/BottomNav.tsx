import React from 'react';
import {
  Puzzle,
  Gift,
  ArrowDownToLine,
  Heart,
  User
} from 'lucide-react';
import { ScreenType } from '../../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenMenu?: () => void;
  selectedRegion?: string;
  isLoggedIn?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  // Determine which tab is active based on currentScreen
  const isHomeActive = currentScreen === 'home';
  const isActivityActive = currentScreen === 'activity' || currentScreen === 'match_history';
  const isDepositActive = currentScreen === 'add_money';
  const isFavouriteActive = currentScreen === 'favourite';
  const isAccountActive = currentScreen === 'profile';

  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#04260f]/95 backdrop-blur-xl border-t border-emerald-500/40 select-none shadow-[0_-8px_25px_rgba(4,38,15,0.9)]">
      {/* Top ambient emerald/gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

      {/* Navigation items bar */}
      <div className="max-w-md mx-auto px-2 pt-1.5 pb-1 flex items-center justify-between relative">
        {/* 1. Home Tab */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer py-1 relative ${
            isHomeActive
              ? 'relative rounded-2xl bg-gradient-to-b from-emerald-900/60 to-[#063314] border border-amber-400/50 px-2 py-1 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-emerald-300/70 hover:text-amber-200'
          }`}
        >
          {isHomeActive && (
            <div className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b,0_0_15px_rgba(245,158,11,0.9)]" />
          )}
          <Puzzle
            className={`w-6 h-6 transition-transform ${
              isHomeActive
                ? 'text-amber-400 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] scale-105'
                : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 tracking-wide ${
              isHomeActive
                ? 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                : 'font-medium'
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Activity Tab */}
        <button
          type="button"
          onClick={() => onNavigate('activity')}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer py-1 relative ${
            isActivityActive
              ? 'relative rounded-2xl bg-gradient-to-b from-emerald-900/60 to-[#063314] border border-amber-400/50 px-2 py-1 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-emerald-300/70 hover:text-amber-200'
          }`}
        >
          {isActivityActive && (
            <div className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b,0_0_15px_rgba(245,158,11,0.9)]" />
          )}
          <Gift
            className={`w-6 h-6 transition-transform ${
              isActivityActive
                ? 'text-amber-400 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] scale-105'
                : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 tracking-wide ${
              isActivityActive
                ? 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                : 'font-medium'
            }`}
          >
            Activity
          </span>
        </button>

        {/* 3. Center Floating DEPOSIT Button */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-6 z-20">
          <button
            type="button"
            onClick={() => onNavigate('add_money')}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
          >
            {/* Ambient Gold Aura */}
            <div className="absolute -top-1 w-16 h-16 rounded-full bg-amber-400/25 blur-xl pointer-events-none group-hover:bg-amber-400/40 transition-all" />

            {/* Glowing Circular Button */}
            <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 p-0.5 shadow-[0_0_22px_rgba(245,158,11,0.75),0_0_35px_rgba(234,179,8,0.45)] border-2 border-amber-300 flex items-center justify-center group-hover:scale-105 transition-all">
              <ArrowDownToLine className="w-7 h-7 text-slate-950 stroke-[2.8] drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" />
            </div>

            {/* DEPOSIT Capsule Plate */}
            <div className={`mt-0.5 px-3 py-0.5 rounded-xl bg-[#063314] border shadow-md transition-colors ${
              isDepositActive ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'border-amber-400/70'
            }`}>
              <span className="text-[10px] sm:text-[11px] font-black text-amber-300 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">
                DEPOSIT
              </span>
            </div>
          </button>
        </div>

        {/* 4. Favourite Tab */}
        <button
          type="button"
          onClick={() => onNavigate('favourite')}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer py-1 relative ${
            isFavouriteActive
              ? 'relative rounded-2xl bg-gradient-to-b from-emerald-900/60 to-[#063314] border border-amber-400/50 px-2 py-1 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-emerald-300/70 hover:text-amber-200'
          }`}
        >
          {isFavouriteActive && (
            <div className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b,0_0_15px_rgba(245,158,11,0.9)]" />
          )}
          <Heart
            className={`w-6 h-6 transition-transform ${
              isFavouriteActive
                ? 'text-amber-400 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] scale-105'
                : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 tracking-wide ${
              isFavouriteActive
                ? 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                : 'font-medium'
            }`}
          >
            Favourite
          </span>
        </button>

        {/* 5. Account Tab */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex-1 flex flex-col items-center justify-center transition-all cursor-pointer py-1 relative ${
            isAccountActive
              ? 'relative rounded-2xl bg-gradient-to-b from-emerald-900/60 to-[#063314] border border-amber-400/50 px-2 py-1 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-emerald-300/70 hover:text-amber-200'
          }`}
        >
          {isAccountActive && (
            <div className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b,0_0_15px_rgba(245,158,11,0.9)]" />
          )}
          <User
            className={`w-6 h-6 transition-transform ${
              isAccountActive
                ? 'text-amber-400 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] scale-105'
                : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 tracking-wide ${
              isAccountActive
                ? 'text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                : 'font-medium'
            }`}
          >
            Account
          </span>
        </button>
      </div>

      {/* Android home bar indicator */}
      <div className="w-36 h-1 bg-slate-600/40 rounded-full mx-auto mt-0.5 mb-1 pointer-events-none" />
    </div>
  );
};
