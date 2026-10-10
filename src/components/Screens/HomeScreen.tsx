import React, { useState } from 'react';
import { 
  Play, 
  X, 
  Users, 
  Crown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Trophy, 
  Gamepad2, 
  Ban, 
  Sparkle,
  Search,
  Key,
  LogIn,
  UserPlus,
  ShieldCheck,
  Settings,
  Volume2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Headphones,
  Flame,
  Zap,
  ArrowLeft,
  Swords,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';
import { 
  UserProfile, 
  ScreenType, 
  MatchHistoryItem, 
  AppSettings, 
  RegionCode, 
  REGIONS, 
  LiveChatMessage, 
  isAdminUser,
  DEFAULT_HOME_GAME_OPTIONS,
  HomeGameOptionConfig
} from '../../types';
import { FriendsModal } from '../Modals/FriendsModal';
import { SpinRewardCelebrationOverlay, SpinRewardCelebrationData } from '../HomeScreen/SpinRewardCelebrationOverlay';
import { BannerSlider } from '../HomeScreen/BannerSlider';
import { LatestWinnersTicker } from '../HomeScreen/LatestWinnersTicker';
import modeKingLudoImg from '../../assets/images/mode_king_ludo_1789079084574.jpg';
import { LudoModesChoiceModal } from '../Modals/LudoModesChoiceModal';
import { AboutModal } from '../Modals/AboutModal';
import { LiveChatModal } from '../Modals/LiveChatModal';

interface HomeScreenProps {
  user: UserProfile;
  matchHistory?: MatchHistoryItem[];
  appSettings?: AppSettings;
  liveChatMessages?: LiveChatMessage[];
  isLiveChatTyping?: boolean;
  onSendLiveChatMessage?: (text: string, imageUrl?: string, imageName?: string) => void;
  onMarkLiveChatAsRead?: () => void;
  onNavigate: (screen: ScreenType) => void;
  onJoinRoom?: (code: string) => void;
  onOpenReferModal: () => void;
  onOpenMenu?: () => void;
  onOpenLuckySpinner?: () => void;
  onClaimSpinReward?: (amount: number, rewardTitle: string) => void;
  onClaimDailyReward?: (amount: number, streakDay: number) => void;
  selectedRegion?: RegionCode;
  spinCelebrationData?: SpinRewardCelebrationData | null;
  onDismissSpinCelebration?: () => void;
  onUpdateBalance?: (newBalance: number) => void;
  onSelectPlayerCount?: (count: 2 | 4) => void;
  onStartBotMatch?: (playersCount: 2 | 4) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  matchHistory = [],
  appSettings,
  liveChatMessages = [],
  isLiveChatTyping = false,
  onSendLiveChatMessage,
  onMarkLiveChatAsRead,
  onNavigate,
  onJoinRoom,
  onOpenReferModal,
  onOpenLuckySpinner,
  onClaimDailyReward,
  spinCelebrationData,
  onDismissSpinCelebration,
  onUpdateBalance,
  onSelectPlayerCount,
  onStartBotMatch,
  selectedRegion = 'BN',
}) => {
  const [showLudoModesModal, setShowLudoModesModal] = useState(false);
  const [showFriendsChoiceModal, setShowFriendsChoiceModal] = useState(false);
  const [showFriendsManagerModal, setShowFriendsManagerModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);
  const [disabledNotice, setDisabledNotice] = useState<string | null>(null);

  const isUnderMaintenance = Boolean(appSettings?.isMaintenanceMode && !isAdminUser(user));

  const unreadChatCount = liveChatMessages.filter(
    (m) => m.userId === user.id && m.senderRole === 'admin' && !m.isReadByUser
  ).length;

  const requireLoginAction = (action: () => void) => {
    if (isUnderMaintenance) {
      setDisabledNotice('প্ল্যাটফর্মে বর্তমানে এডমিন রক্ষণাবেক্ষণ চলছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      setTimeout(() => setDisabledNotice(null), 3500);
      return;
    }
    if (!user.isLoggedIn) {
      onNavigate('login');
      return;
    }
    action();
  };

  // King Ludo option configuration (from appSettings.homeGameOptions or DEFAULT_HOME_GAME_OPTIONS)
  const ludoConfig = (appSettings?.homeGameOptions && appSettings.homeGameOptions.length > 0)
    ? (appSettings.homeGameOptions.find((o) => o.id === 'kingludo') || DEFAULT_HOME_GAME_OPTIONS[0])
    : DEFAULT_HOME_GAME_OPTIONS[0];

  const ludoOption = {
    title: ludoConfig.title || 'কিং লুডো',
    enTitle: ludoConfig.enTitle || 'King Ludo',
    subtitle: ludoConfig.subtitle || '২ প্লেয়ার, ৪ প্লেয়ার, ফ্রেন্ডস রুম ও মেগা কাপ টুর্নামেন্ট',
    badge: ludoConfig.badge || '👑 ৪টি লুডো মোড',
    hotBadge: ludoConfig.hotBadge || '🔥 মোস্ট পপুলার',
    playersCount: ludoConfig.playersCount || '১,৬৫০+ লাইভ প্লেয়ার',
    image: ludoConfig.imageUrl?.trim() ? ludoConfig.imageUrl : modeKingLudoImg,
    enabled: ludoConfig.enabled !== false,
  };

  return (
    <div
      className="min-h-full text-white p-3 space-y-4 pb-24 select-none relative overflow-hidden flex flex-col justify-start"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 left-[-40px] w-64 h-64 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-[-40px] w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Celebration overlay if spin reward claimed */}
      {spinCelebrationData && (
        <SpinRewardCelebrationOverlay
          data={spinCelebrationData}
          onClose={() => onDismissSpinCelebration?.()}
          onNavigateWallet={() => onNavigate('wallet')}
        />
      )}

      {/* Maintenance Mode Alert Banner */}
      {isUnderMaintenance && (
        <div className="relative z-30 p-3.5 bg-gradient-to-r from-red-950/95 via-amber-950/90 to-red-950/95 border-2 border-amber-400 rounded-2xl flex items-center justify-between text-amber-200 text-xs font-bold shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <span className="text-white font-black block">সিস্টেম রক্ষণাবেক্ষণ চলছে (Maintenance Mode)</span>
              <span className="text-[11px] text-amber-300/90 font-normal">এডমিন প্যানেল থেকে রক্ষণাবেক্ষণ সক্রিয় রাখা হয়েছে। সাময়িকভাবে রিয়েল ম্যাচ বন্ধ রয়েছে।</span>
            </div>
          </div>
        </div>
      )}

      {/* Disabled Option Alert Toast */}
      {disabledNotice && (
        <div className="relative z-30 p-3 bg-amber-950/90 border-2 border-amber-400/80 rounded-2xl flex items-center justify-between text-amber-200 text-xs font-bold animate-in fade-in shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{disabledNotice}</span>
          </div>
          <button onClick={() => setDisabledNotice(null)} className="p-1 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Panel Direct Link-Up Bar (দেখা যাবে অ্যাডমিন ও স্টাফদের জন্য) */}
      {isAdminUser(user) && (
        <div className="relative z-20 bg-gradient-to-r from-purple-950/90 via-indigo-950/95 to-purple-950/90 border border-amber-400/60 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300">অ্যাডমিন কন্ট্রোল সেন্টার</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-[9px] font-black text-slate-950 rounded">লিংকড</span>
              </div>
              <p className="text-[10px] text-purple-200">হোম পেজের ৪টি অপশন ও সিস্টেম কনফিগ পরিচালনা করুন</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin_panel')}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
          >
            <span>প্যানেল ওপেন</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Live Scrolling Marquee Notice (যদি অ্যাডমিন চালু রাখেন) */}
      {appSettings?.showMarqueeNotice !== false && appSettings?.marqueeNotice && (
        <div className="relative z-10 bg-slate-950/80 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 overflow-hidden text-xs shadow-inner">
          <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-black shrink-0">
            <Volume2 className="w-3 h-3" />
            <span>{appSettings?.marqueeNoticeBadge || 'নোটিশ'}</span>
          </div>
          <marquee className="text-[11px] text-amber-200 font-medium">
            {appSettings.marqueeNotice}
          </marquee>
        </div>
      )}

      {/* Banned User Alert Banner */}
      {user.isLoggedIn && user.isBanned && (
        <div className="relative z-20 bg-gradient-to-r from-rose-950/90 via-red-900/90 to-rose-950/90 border-2 border-rose-500/80 rounded-2xl p-3 shadow-[0_0_25px_rgba(244,63,94,0.35)] backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400/50 flex items-center justify-center text-rose-300 flex-shrink-0">
              <Ban className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">অ্যাকাউন্ট স্থগিত (Account Banned)</span>
                <span className="px-1.5 py-0.5 bg-rose-600 text-[9px] font-extrabold text-white rounded">ব্লকড</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-tight mt-0.5">
                আপনার অ্যাকাউন্ট থেকে ম্যাচ খেলা সাময়িকভাবে বন্ধ আছে।
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('support')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl flex-shrink-0 transition shadow cursor-pointer"
          >
            আপিল করুন
          </button>
        </div>
      )}

      {/* 2. Top Promotional Banner Slider (অ্যাডমিন নিয়ন্ত্রিত) */}
      {appSettings?.showBanners !== false && (
        <div className="relative z-10">
          <BannerSlider
            onNavigate={onNavigate}
            onOpenReferModal={onOpenReferModal}
            appSettings={appSettings}
          />
        </div>
      )}

      {/* 3. Quick Action Bar - ডিপোজিট ও উইথড্র উভয় অপশন থাকবে */}
      {(appSettings?.showQuickDepositWithdraw !== false) && (
        <div className="relative z-10 grid grid-cols-2 gap-2.5 max-w-lg mx-auto w-full">
          {/* 1. Deposit Button */}
          <button
            type="button"
            onClick={() => requireLoginAction(() => onNavigate('add_money'))}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 active:scale-[0.98] text-white flex items-center justify-between shadow-lg border border-emerald-400/40 cursor-pointer transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 flex items-center justify-center text-emerald-300 border border-emerald-400/40 shrink-0 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-black tracking-wide block">
                  {appSettings?.quickDepositTitle || 'ডিপোজিট'}
                </span>
                <span className="text-[10px] text-emerald-100/90 font-medium block">
                  {appSettings?.quickDepositSubtitle || 'টাকা যোগ করুন'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] text-emerald-200" />
          </button>

          {/* 2. Withdraw Button */}
          <button
            type="button"
            onClick={() => requireLoginAction(() => onNavigate('withdraw'))}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-[0.98] text-slate-950 flex items-center justify-between shadow-lg border border-amber-300/60 cursor-pointer transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-950/40 flex items-center justify-center text-amber-300 border border-amber-400/40 shrink-0 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-black tracking-wide block">
                  উইথড্র
                </span>
                <span className="text-[10px] text-slate-950/90 font-bold block">
                  টাকা উত্তোলন
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] text-slate-950" />
          </button>
        </div>
      )}

      {/* Main Game Zone Title Header */}
      <div className="relative z-10 flex items-center justify-between px-1 pt-1 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md">
            <Crown className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h2 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{appSettings?.gameLobbyTitle || 'গেম নির্বাচন করুন'}</span>
              <span className="text-[10px] text-amber-300 font-normal">
                {appSettings?.gameLobbySubtitle || '(KING LUDO)'}
              </span>
            </h2>
            <p className="text-[11px] text-amber-200/80 font-medium">
              {appSettings?.gameLobbyDescription || 'অফিসিয়াল কিং লুডো টুর্নামেন্ট ও মোডস'}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-sm">
          <Sparkle className="w-3 h-3 text-amber-400 animate-spin" />
          <span>{appSettings?.gameLobbyBadge || 'রিয়েল ক্যাশ'}</span>
        </span>
      </div>

      {/* ================= KING LUDO BANNER & COMING SOON FRAME ================= */}
      <div className="relative z-10 max-w-lg mx-auto w-full space-y-3">
        {/* 1. KING LUDO BANNER / FRAME (একমাত্র সক্রিয় গেম ব্যানার) */}
        <div
          onClick={() => {
            if (!ludoOption.enabled) {
              setDisabledNotice('কিং লুডো বর্তমানে অ্যাডমিন প্যানেল থেকে সাময়িক বন্ধ রাখা হয়েছে।');
              setTimeout(() => setDisabledNotice(null), 3500);
              return;
            }
            requireLoginAction(() => setShowLudoModesModal(true));
          }}
          className={`group relative min-h-[175px] sm:min-h-[190px] rounded-3xl overflow-hidden border-2 ${
            ludoOption.enabled
              ? 'border-red-500/80 shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.6)]'
              : 'border-slate-700/60 opacity-60'
          } active:scale-[0.98] transition-all text-left cursor-pointer flex flex-col justify-between p-4`}
        >
          {/* Card Background Image */}
          <img
            src={ludoOption.image}
            alt={ludoOption.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30" />

          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{ludoOption.badge}</span>
            </span>

            {!ludoOption.enabled ? (
              <span className="text-[10px] font-black bg-rose-600/95 text-white border border-rose-400/60 px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow">
                <Lock className="w-3 h-3" />
                <span>সাময়িক বন্ধ</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow">
                <Sparkle className="w-3 h-3 text-amber-400 animate-spin" />
                <span>{ludoOption.hotBadge}</span>
              </span>
            )}
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 space-y-2 mt-auto pt-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-xl sm:text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight flex items-center gap-2">
                  <span>{ludoOption.title}</span>
                  <span className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider drop-shadow block sm:inline">
                    ({ludoOption.enTitle})
                  </span>
                </h3>
                <p className="text-[11px] font-medium text-slate-200 drop-shadow line-clamp-1 mt-0.5">
                  {ludoOption.subtitle}
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-red-400 transition-all shadow-lg shadow-red-500/50 shrink-0 ml-1">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-amber-200/90 font-mono">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-amber-400" />
                <span>{ludoOption.playersCount}</span>
                <span className="text-amber-300 font-bold bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-500/40">
                  মিনিমাম ৳{appSettings?.minMatchFee ?? appSettings?.homeGameOptions?.[0]?.minBet ?? 10}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/40">
                  {appSettings?.platformCommissionPercent !== undefined ? `${appSettings.platformCommissionPercent}% কমিশন` : '১০% কমিশন'}
                </span>
              </span>
              <span className="font-black text-white flex items-center gap-1 group-hover:underline">
                খেলুন <ChevronRight className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
              </span>
            </div>
          </div>
        </div>

        {/* 2. SLOT, LIVE CASINO & SPORTS-এর জায়গায় COMING SOON ব্যানার/ফ্রেম (শুধু Coming Soon লেখা, কোনো নিচের কালার নেই) */}
        <div
          onClick={() => {
            setDisabledNotice('শীঘ্রই আসছে (Coming Soon)! সাথে থাকুন।');
            setTimeout(() => setDisabledNotice(null), 3500);
          }}
          className="group relative rounded-3xl overflow-hidden border-2 border-dashed border-emerald-500/40 bg-[#04260f]/80 p-6 shadow-lg hover:border-emerald-400/60 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[110px]"
        >
          <div className="flex items-center justify-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-lime-200 to-amber-400 tracking-widest uppercase">
              Coming Soon
            </h3>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 9. Latest Winners Live Ticker (রিসেন্ট ম্যাচ বিজয়ী তালিকা) */}
      {appSettings?.showLatestWinnersTicker !== false && (
        <div className="relative z-10 max-w-lg mx-auto w-full">
          <LatestWinnersTicker matchHistory={matchHistory} user={user} />
        </div>
      )}

      {/* 10. Refer & Earn Promotional Card (রেফার বোনাস) */}
      {appSettings?.showReferEarnBanner !== false && (
        <div className="relative z-10 max-w-lg mx-auto w-full bg-gradient-to-r from-[#042a10] via-[#09421b] to-[#04240d] border-2 border-emerald-500/50 rounded-3xl p-3.5 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <Gift className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  {appSettings?.referEarnTitle || 'রেফার ও ইনভাইট বোনাস'}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded text-[9px] font-black">
                  ৳{appSettings?.referralBonus || 100}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 leading-tight mt-0.5">
                {appSettings?.referBannerPromoText || `বন্ধুদের ইনভাইট করে পেয়ে যান ৳${appSettings?.referralBonus || 100} ইনস্ট্যান্ট বোনাস!`}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReferModal}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-lime-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow shrink-0 flex items-center gap-1 cursor-pointer transition"
          >
            <span>{appSettings?.referEarnButtonText || 'রেফার করুন'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 11. 24/7 Live Chat Support Help Banner */}
      {appSettings?.showLiveChatBanner !== false && (
        <div className="relative z-10 max-w-lg mx-auto w-full bg-gradient-to-r from-[#042a10] via-[#083d18] to-[#04240d] border border-emerald-600/50 rounded-3xl p-3.5 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  {appSettings?.liveChatTitle || '২৪/৭ লাইভ হেল্পলাইন ও সাপোর্ট'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[10px] text-emerald-200/90 leading-tight mt-0.5">
                {appSettings?.liveChatTagline || 'যেকোনো ডিপোজিট বা উইথড্র সমস্যায় সাথে সাথে সাপোর্ট পান'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('support')}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 active:scale-95 text-white font-black text-xs rounded-xl shadow shrink-0 flex items-center gap-1 cursor-pointer transition border border-emerald-400/40"
          >
            <span>{appSettings?.liveChatButtonText || 'সাপোর্ট চ্যাট'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 12. About King Ludo Showcase Banner */}
      <div
        id="home-about-section"
        onClick={() => setShowAboutModal(true)}
        className="relative z-10 max-w-lg mx-auto w-full bg-gradient-to-r from-[#042a10] via-[#083d18] to-[#04240d] border border-amber-400/50 hover:border-amber-400 rounded-3xl p-3.5 shadow-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                {appSettings?.aboutCardTitle || 'আমাদের সম্পর্কে (About King Ludo)'}
              </span>
              <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[9px] font-bold">
                {appSettings?.aboutCardSubtitle || 'Official'}
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/90 leading-tight mt-0.5">
              {appSettings?.aboutCardDesc || 'প্ল্যাটফর্মের নিয়মাবলী, সিকিউরিটি, ফেয়ার-প্লে ও পেমেন্ট পলিসি বিস্তারিত জানুন'}
            </p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-emerald-900/60 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-300 transition shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 1. KING LUDO MODES CHOICE MODAL */}
      <LudoModesChoiceModal
        isOpen={showLudoModesModal}
        onClose={() => setShowLudoModesModal(false)}
        onNavigate={onNavigate}
        onOpenFriendsChoice={() => setShowFriendsChoiceModal(true)}
        appSettings={appSettings}
        onSelectPlayerCount={onSelectPlayerCount}
        onStartBotMatch={onStartBotMatch}
        userBalance={user.balance}
      />



      {/* FRIENDS MODE CHOICE MODAL (Invoked from King Ludo) */}
      {showFriendsChoiceModal && (
        <div
          className="fixed inset-0 z-50 w-full h-full flex flex-col overflow-hidden text-white animate-fadeIn select-none"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.92), rgba(6,51,20,0.95), rgba(3,24,9,0.98)), url('/images/green_abstract_mobile.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-[#063314]/95 border-b border-emerald-700/50 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md z-30">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFriendsChoiceModal(false)}
                className="p-2 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="হোম পেজে ফিরুন"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>হোম পেজে ফিরুন</span>
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full shadow border border-emerald-400/40 bg-emerald-900/60 text-emerald-200">
                  👥 ফ্রেন্ডস মাল্টিপ্লেয়ার
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFriendsChoiceModal(false)}
              className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col items-center justify-center">
            <div className="bg-[#04260f]/95 border-2 border-emerald-500/80 backdrop-blur-md w-full max-w-sm rounded-3xl p-5 space-y-3.5 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-700/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 shadow">
                    <Users className="w-4 h-4 font-black text-slate-950" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">ফ্রেন্ডদের সাথে খেলুন</h3>
                </div>
              </div>

              <p className="text-xs text-emerald-200 leading-relaxed">
                আপনি কী করতে চান নির্বাচন করুন:
              </p>

              <div className="space-y-2 pt-1">
                {/* Option A: Search & Manage Friends */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFriendsChoiceModal(false);
                    setShowFriendsManagerModal(true);
                  }}
                  className="w-full p-3 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:brightness-110 text-white rounded-2xl border border-emerald-500/50 shadow-lg font-bold text-xs flex items-center justify-between active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-400/40">
                      <Search className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-amber-200 text-xs">ফ্রেন্ড সার্চ ও অ্যাড করুন</span>
                      <span className="block text-[10px] text-emerald-200 font-normal">আইডি দিয়ে প্লেয়ার যোগ করুন</span>
                    </div>
                  </div>
                  <Users className="w-4 h-4 text-amber-300" />
                </button>

                {/* Option B: Join Code */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFriendsChoiceModal(false);
                    onNavigate('join_match');
                  }}
                  className="w-full p-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white rounded-2xl border border-emerald-400/50 shadow-lg font-bold text-xs flex items-center justify-between active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-300/40">
                      <Key className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-white text-xs">জয়েন কোড লিখুন</span>
                      <span className="block text-[10px] text-emerald-200 font-normal">ফ্রেন্ডের রুমে প্রবেশ করুন</span>
                    </div>
                  </div>
                  <LogIn className="w-4 h-4 text-emerald-300" />
                </button>

                {/* Option C: Create Room */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFriendsChoiceModal(false);
                    onNavigate('create_match');
                  }}
                  className="w-full p-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:brightness-110 text-slate-950 rounded-2xl border border-amber-300/60 shadow-lg font-bold text-xs flex items-center justify-between active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-200/40">
                      <UserPlus className="w-4 h-4 text-amber-200" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-slate-950 text-xs">নতুন রুম তৈরি করুন</span>
                      <span className="block text-[10px] text-amber-950/80 font-normal">কোড তৈরি করে ফ্রেন্ডকে পাঠান</span>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                </button>
              </div>

              {/* Bottom Return Button */}
              <button
                type="button"
                onClick={() => setShowFriendsChoiceModal(false)}
                className="w-full py-2.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 hover:text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-emerald-700/50 transition active:scale-95 cursor-pointer mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>হোম পেজে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL FRIENDS MANAGER MODAL */}
      <FriendsModal
        isOpen={showFriendsManagerModal}
        onClose={() => setShowFriendsManagerModal(false)}
        onNavigateToRoom={() => onNavigate('create_match')}
      />

      {/* ABOUT KING LUDO MODAL */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        selectedRegion={selectedRegion}
      />

      {/* Floating 24/7 Live Chat Button (অ্যাডমিন নিয়ন্ত্রিত) */}
      {appSettings?.showLiveChatFloating !== false && (
        <button
          type="button"
          onClick={() => setShowLiveChatModal(true)}
          className="fixed bottom-20 right-4 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_4px_25px_rgba(6,182,212,0.6)] border-2 border-cyan-300 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center group"
          title="২৪/৭ লাইভ সাপোর্ট চ্যাট"
        >
          <div className="relative">
            <Headphones className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#09041a] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#09041a] rounded-full" />
          </div>
          {unreadChatCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full border border-white shadow animate-bounce">
              {unreadChatCount}
            </span>
          )}
        </button>
      )}

      {/* LIVE CHAT SUPPORT MODAL */}
      <LiveChatModal
        isOpen={showLiveChatModal}
        onClose={() => setShowLiveChatModal(false)}
        user={user}
        appSettings={appSettings}
        messages={liveChatMessages}
        onSendMessage={onSendLiveChatMessage}
        onMarkAsRead={onMarkLiveChatAsRead}
        isTyping={isLiveChatTyping}
      />
    </div>
  );
};
