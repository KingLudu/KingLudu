import React, { useState } from 'react';
import {
  Heart,
  Play,
  Crown,
  Users,
  Swords,
  Trophy,
  Sparkles,
  Key,
  Star,
  ChevronRight,
  ShieldCheck,
  Check,
  Bot
} from 'lucide-react';
import { UserProfile, ScreenType, AppSettings } from '../../types';

interface FavouriteScreenProps {
  user: UserProfile;
  appSettings?: AppSettings;
  onNavigate: (screen: ScreenType) => void;
  onSelectPlayerCount?: (count: 2 | 4) => void;
  onStartBotMatch?: (playersCount: 2 | 4) => void;
}

interface FavItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  players: string;
  icon: any;
  gradient: string;
  borderColor: string;
  isFavorite: boolean;
  action: () => void;
}

export const FavouriteScreen: React.FC<FavouriteScreenProps> = ({
  user,
  appSettings,
  onNavigate,
  onSelectPlayerCount,
  onStartBotMatch,
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'ludo-1v1': true,
    'ludo-4p': true,
    'ludo-bot': true,
    'ludo-friends': true,
    'tournament': true,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const requireLoginAction = (action: () => void) => {
    if (!user.isLoggedIn) {
      onNavigate('login');
      return;
    }
    if ((user.balance || 0) < 100) {
      onNavigate('add_money');
      return;
    }
    action();
  };

  const favItems: FavItem[] = [
    {
      id: 'ludo-1v1',
      title: 'কিং লুডো ১v১ কুইক ম্যাচ',
      subtitle: '২ প্লেয়ার দ্রুত ১ বনাম ১ লাইভ ক্যাশ ম্যাচ',
      badge: '🔥 সর্বাধিক প্রিয়',
      players: '১,২০০+ খেলছেন',
      icon: Swords,
      gradient: 'from-red-950/80 via-[#180a1d] to-[#0d0724]',
      borderColor: 'border-red-500/60',
      isFavorite: favorites['ludo-1v1'] !== false,
      action: () => {
        onSelectPlayerCount?.(2);
        requireLoginAction(() => onNavigate('create_match'));
      },
    },
    {
      id: 'ludo-4p',
      title: 'কিং লুডো ৪ প্লেয়ার ক্লাসিক',
      subtitle: '৪ জন রিয়েল প্লেয়ারের তুমুল ক্লাসিক লড়াই',
      badge: '👑 ক্লাসিক',
      players: '৮৫০+ খেলছেন',
      icon: Users,
      gradient: 'from-emerald-950/80 via-[#0a1e1b] to-[#0d0724]',
      borderColor: 'border-emerald-500/60',
      isFavorite: favorites['ludo-4p'] !== false,
      action: () => {
        onSelectPlayerCount?.(4);
        requireLoginAction(() => onNavigate('create_match'));
      },
    },
    {
      id: 'ludo-bot',
      title: 'কম্পিউটার বনাম প্র্যাকটিস ম্যাচ',
      subtitle: 'এআই বটের সাথে সরাসরি খেলে নিজে টেস্ট ও প্র্যাকটিস করুন',
      badge: '🤖 প্র্যাকটিস ম্যাচ',
      players: '১v১ এআই মোড',
      icon: Bot,
      gradient: 'from-purple-950/80 via-[#1e0a38] to-[#0d0724]',
      borderColor: 'border-purple-500/60',
      isFavorite: favorites['ludo-bot'] !== false,
      action: () => {
        if (onStartBotMatch) {
          onStartBotMatch(2);
        } else {
          onNavigate('create_match');
        }
      },
    },
    {
      id: 'ludo-friends',
      title: 'প্রাইভেট ফ্রেন্ডস রুম',
      subtitle: 'রুম কোড শেয়ার করে বন্ধুদের সাথে প্রাইভেট ম্যাচ',
      badge: '🔑 ফ্রেন্ডস',
      players: 'প্রাইভেট রুম',
      icon: Key,
      gradient: 'from-blue-950/80 via-[#0c182b] to-[#0d0724]',
      borderColor: 'border-blue-500/60',
      isFavorite: favorites['ludo-friends'] !== false,
      action: () => {
        requireLoginAction(() => onNavigate('create_match'));
      },
    },
    {
      id: 'tournament',
      title: 'মেগা প্রাইজ টুর্নামেন্ট',
      subtitle: 'দৈনিক মেগা প্রাইজপুল ও চ্যাম্পিয়নশিপ কাপ',
      badge: '🏆 ৫০,০০০৳ পুল',
      players: '৫০০+ প্লেয়ার',
      icon: Trophy,
      gradient: 'from-amber-950/80 via-[#21160a] to-[#0d0724]',
      borderColor: 'border-amber-500/60',
      isFavorite: favorites['tournament'] !== false,
      action: () => {
        requireLoginAction(() => onNavigate('matchmaking'));
      },
    },
  ];

  const activeFavorites = favItems.filter((item) => item.isFavorite);

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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-1.5">
              <span>ফেভারিট গেমস ও মোডস</span>
              <span className="text-[10px] font-black text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                FAVOURITE
              </span>
            </h1>
            <p className="text-[11px] text-purple-200/80">আপনার বুকমার্ক করা পছন্দের গেম মোড</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-300 bg-purple-950/80 border border-purple-600/40 px-3 py-1.5 rounded-xl hover:bg-purple-900/60 transition cursor-pointer"
        >
          হোম
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-3 rounded-2xl bg-[#052a12] border border-purple-800/50 flex items-center justify-between text-xs">
        <span className="text-slate-300">
          মোট ফেভারিট গেম: <strong className="text-amber-300">{activeFavorites.length} টি</strong>
        </span>
        <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>১-ক্লিকে খেলুন</span>
        </span>
      </div>

      {/* Favorites List */}
      <div className="space-y-3">
        {favItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className={`p-4 rounded-3xl bg-gradient-to-r ${item.gradient} border-2 ${item.borderColor} shadow-lg flex flex-col justify-between gap-3 cursor-pointer group active:scale-98 transition relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-center text-amber-300 shadow">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                        {item.title}
                      </h3>
                      <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-purple-950 border border-purple-500/40 text-amber-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                {/* Heart Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className={`p-2 rounded-xl border transition ${
                    item.isFavorite
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:text-rose-400'
                  }`}
                  title="ফেভারিট টগল"
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bottom Quick Play Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-purple-200/80 font-mono">{item.players}</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow group-hover:scale-105 transition">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>এখনই খেলুন</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
