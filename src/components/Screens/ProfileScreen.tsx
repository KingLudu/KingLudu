import React, { useState } from 'react';
import {
  Pencil,
  Wallet,
  History,
  Headphones,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  X,
  Check,
  Volume2,
  VolumeX,
  Bell,
  Globe,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  Trophy,
  Sparkles,
  Zap,
  Swords,
  Award,
  Lock,
  LogIn,
  Ban,
  Gift,
  ArrowLeft,
  Trash2,
  Info,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, ScreenType, isAdminUser, RegionCode, REGIONS, MatchHistoryItem, AppSettings } from '../../types';
import { getTranslation } from '../../utils/translations';
import { calculatePlayerLevel } from '../../utils/playerLevel';
import { DailyCheckInCard } from '../HomeScreen/DailyCheckInCard';
import { LuckySpinnerBanner } from '../HomeScreen/LuckySpinnerBanner';
import { LuckySpinnerWheelModal } from '../Modals/LuckySpinnerWheelModal';
import { AboutModal } from '../Modals/AboutModal';

interface ProfileScreenProps {
  user: UserProfile;
  matchHistory?: MatchHistoryItem[];
  appSettings?: AppSettings;
  onUpdateName: (newName: string) => void;
  onUpdateLoginPassword?: (newPassword: string) => void;
  onUpdateWithdrawPassword?: (newWithdrawPassword: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  selectedRegion?: RegionCode;
  onClaimDailyReward?: (amount: number, streakDay: number) => void;
  onOpenLuckySpinner?: () => void;
  spinCelebrationData?: { amount: number; timestamp: number } | null;
  onUpdateBalance?: (newBalance: number) => void;
  onClearAllData?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  matchHistory = [],
  appSettings,
  onUpdateName,
  onUpdateLoginPassword,
  onUpdateWithdrawPassword,
  onNavigate,
  onLogout,
  selectedRegion = 'BN',
  onClaimDailyReward,
  onOpenLuckySpinner,
  spinCelebrationData,
  onUpdateBalance,
  onClearAllData,
}) => {
  const t = getTranslation(selectedRegion);
  const regionInfo = REGIONS[selectedRegion] || REGIONS.BN;

  // Calculate Player Level & XP based on totalMatches and totalWon
  const levelInfo = calculatePlayerLevel(user.totalMatches, user.totalWon, user.level);

  // Bonus view and modals state
  const [showBonusView, setShowBonusView] = useState(false);
  const [showLocalSpinnerModal, setShowLocalSpinnerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Password Change Modal state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [passwordTab, setPasswordTab] = useState<'login' | 'withdraw'>('login');

  // ID Login Password fields
  const [oldLoginPass, setOldLoginPass] = useState('');
  const [newLoginPass, setNewLoginPass] = useState('');
  const [confirmLoginPass, setConfirmLoginPass] = useState('');
  const [showOldLoginPass, setShowOldLoginPass] = useState(false);
  const [showNewLoginPass, setShowNewLoginPass] = useState(false);
  const [showConfirmLoginPass, setShowConfirmLoginPass] = useState(false);

  // Withdraw Password fields
  const [oldWithdrawPass, setOldWithdrawPass] = useState('');
  const [newWithdrawPass, setNewWithdrawPass] = useState('');
  const [confirmWithdrawPass, setConfirmWithdrawPass] = useState('');
  const [showOldWithdrawPass, setShowOldWithdrawPass] = useState(false);
  const [showNewWithdrawPass, setShowNewWithdrawPass] = useState(false);
  const [showConfirmWithdrawPass, setShowConfirmWithdrawPass] = useState(false);

  // Feedback state
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveLoginPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // If user has existing login password, old password must be entered and verified
    if (user.password) {
      if (!oldLoginPass.trim()) {
        setPasswordError('অনুগ্রহ করে বর্তমান/আগের লগইন পাসওয়ার্ডটি দিন!');
        return;
      }
      if (oldLoginPass.trim() !== user.password.trim()) {
        setPasswordError('❌ আগের লগইন পাসওয়ার্ডটি ভুল হয়েছে! সঠিক পাসওয়ার্ড দিন।');
        return;
      }
    }

    if (!newLoginPass || newLoginPass.trim().length < 4) {
      setPasswordError('নতুন লগইন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    if (newLoginPass.trim() !== confirmLoginPass.trim()) {
      setPasswordError('❌ নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (user.password && newLoginPass.trim() === user.password.trim()) {
      setPasswordError('নতুন পাসওয়ার্ড অবশ্যই আগের পাসওয়ার্ড থেকে আলাদা হতে হবে!');
      return;
    }

    if (onUpdateLoginPassword) {
      onUpdateLoginPassword(newLoginPass.trim());
    }

    setOldLoginPass('');
    setNewLoginPass('');
    setConfirmLoginPass('');
    setPasswordSuccess('✅ আইডি লগইন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    setTimeout(() => {
      setPasswordSuccess('');
      setShowPasswordChangeModal(false);
    }, 2000);
  };

  const handleSaveWithdrawPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // If user has existing withdraw password, old password must be entered and verified
    if (user.withdrawPassword) {
      if (!oldWithdrawPass.trim()) {
        setPasswordError('অনুগ্রহ করে বর্তমান/আগের উইথড্র পাসওয়ার্ডটি দিন!');
        return;
      }
      if (oldWithdrawPass.trim() !== user.withdrawPassword.trim()) {
        setPasswordError('❌ আগের উইথড্র পাসওয়ার্ডটি ভুল হয়েছে! সঠিক পাসওয়ার্ড দিন।');
        return;
      }
    }

    if (!newWithdrawPass || newWithdrawPass.trim().length < 4) {
      setPasswordError('নতুন উইথড্র পাসওয়ার্ড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে!');
      return;
    }

    if (newWithdrawPass.trim() !== confirmWithdrawPass.trim()) {
      setPasswordError('❌ নতুন উইথড্র পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (user.withdrawPassword && newWithdrawPass.trim() === user.withdrawPassword.trim()) {
      setPasswordError('নতুন উইথড্র পাসওয়ার্ড অবশ্যই আগের পাসওয়ার্ড থেকে আলাদা হতে হবে!');
      return;
    }

    if (onUpdateWithdrawPassword) {
      onUpdateWithdrawPassword(newWithdrawPass.trim());
    }

    setOldWithdrawPass('');
    setNewWithdrawPass('');
    setConfirmWithdrawPass('');
    setPasswordSuccess('✅ উইথড্র পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    setTimeout(() => {
      setPasswordSuccess('');
      setShowPasswordChangeModal(false);
    }, 2000);
  };

  // Edit Profile Form state
  const [nameInput, setNameInput] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl);

  // App Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = () => {
    onUpdateName(nameInput);
    setShowEditModal(false);
  };

  if (!user.isLoggedIn) {
    return (
      <div
        className="min-h-full text-white p-5 flex flex-col select-none relative pb-24"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between py-1 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম</span>
          </button>
          <span className="text-xs text-purple-300 font-bold">লগইন প্রয়োজন</span>
          <div className="w-8" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock / Security Shield Icon */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-900/60 to-[#1b103e] border border-purple-500/40 flex items-center justify-center shadow-2xl">
            <Lock className="w-12 h-12 text-amber-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-400 text-purple-950 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Text Details */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          প্রোফাইল দেখতে লগইন প্রয়োজন
        </h2>
        <p className="text-xs text-purple-200/80 max-w-xs leading-relaxed mb-6 font-medium">
          আইডি লগইন বা রেজিস্ট্রেশন ছাড়া ব্যক্তিগত প্রোফাইল, ব্যালেন্স, প্লেয়ার লেভেল ও ম্যাচ হিস্ট্রি দেখা যাবে না।
        </p>

        {/* Feature Lock Badges */}
        <div className="w-full max-w-xs bg-[#063314]/80 border border-purple-800/40 rounded-2xl p-3.5 mb-6 text-left space-y-2">
          <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
            লক করা তথ্যাবলী (Protected Info):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
            <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-1.5 rounded-lg border border-purple-800/30">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">ব্যালেন্স ও ওয়ালেট</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-1.5 rounded-lg border border-purple-800/30">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">প্লেয়ার লেভেল ও XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-1.5 rounded-lg border border-purple-800/30">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">ম্যাচ হিস্ট্রি ও স্ট্যাটস</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-1.5 rounded-lg border border-purple-800/30">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">প্রোফাইল এডিট ও সেটিংস</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-xs space-y-2.5">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-sm shadow-xl shadow-amber-400/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>আইডি লগইন করুন</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-3 px-4 rounded-2xl bg-purple-900/50 hover:bg-purple-900/80 border border-purple-500/40 text-purple-100 font-bold text-xs active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>নতুন অ্যাকাউন্ট রেজিস্টার করুন</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-xs font-semibold text-purple-400 hover:text-purple-200 transition cursor-pointer"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-24 select-none relative"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      
      {/* Top Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60 transition active:scale-95 cursor-pointer"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-black text-xl text-white tracking-wide">{t.profile}</h2>
        </div>
        <span className="text-xs bg-[#1f1545] border border-purple-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-full">
          ID: #{user.id.slice(0, 8)}
        </span>
      </div>

      {showBonusView ? (
        /* BONUS SECTION VIEW (এই দুইটা প্রোফাইলের ভিতরে বোনাস অপশনে থাকবে) */
        <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#170e3d] via-[#1b1246] to-[#120a33] p-3.5 rounded-2xl border border-amber-400/40 shadow-lg">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowBonusView(false)}
                className="p-2 rounded-xl bg-[#23175c] border border-purple-400/40 text-amber-300 hover:text-white active:scale-95 transition cursor-pointer"
                title="প্রোফাইলে ফিরে যান"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>বোনাস ও রিওয়ার্ডস</span>
                  <span className="text-[10px] bg-gradient-to-r from-red-500 to-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase shadow">
                    ফ্রি রিওয়ার্ড
                  </span>
                </h3>
                <p className="text-[10px] text-purple-200">
                  প্রতিদিন ফ্রি বোনাস ক্যাশ ও লাকি স্পিনার রিওয়ার্ড সংগ্রহ করুন
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-purple-300 block font-medium">বর্তমান ব্যালেন্স</span>
              <span className="text-xs font-black text-amber-300 font-mono">
                {regionInfo.currencySymbol}{(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* 1. DAILY CHECK-IN REWARD CARD */}
          {appSettings?.showDailyRewardCard !== false && (
            <DailyCheckInCard
              user={user}
              appSettings={appSettings}
              onClaimDailyReward={(amount, streakDay) => {
                if (onClaimDailyReward) {
                  onClaimDailyReward(amount, streakDay);
                }
              }}
              onNavigate={onNavigate}
            />
          )}

          {/* 2. LUCKY SPINNER WHEEL FEATURED CARD */}
          {appSettings?.showLuckySpinner !== false && (
            <LuckySpinnerBanner
              onOpenSpinner={() => {
                if (onOpenLuckySpinner) {
                  onOpenLuckySpinner();
                } else {
                  setShowLocalSpinnerModal(true);
                }
              }}
              recentWin={spinCelebrationData}
            />
          )}

          {/* Back to Profile Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowBonusView(false)}
              className="w-full py-3 bg-[#052a12] hover:bg-[#1f134c] border border-purple-500/30 rounded-2xl text-xs font-bold text-purple-200 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>প্রোফাইল মেনুতে ফিরে যান</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* User Info Header Card */}
          <div className="bg-gradient-to-r from-[#170e3d] via-[#1b1246] to-[#120a33] p-4 rounded-2xl border border-purple-500/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={selectedAvatar || user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border border-amber-200 shadow-md">
              LV.{levelInfo.level}
            </span>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow hover:scale-110 transition"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-base text-white flex items-center gap-1">
                {user.name}
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black bg-gradient-to-r ${levelInfo.rankBadgeColor} border ${levelInfo.rankBorderColor} shadow-sm`}>
                {levelInfo.rankTitle}
              </span>
              {user.isBanned && (
                <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-rose-600 border border-rose-400 text-white shadow-sm flex items-center gap-1">
                  <Ban className="w-2.5 h-2.5" /> স্থগিত
                </span>
              )}
            </div>
            <p className="text-xs text-purple-300 font-mono mt-0.5">{user.phone || '+880 1700-000000'}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] bg-purple-900/60 border border-purple-700/40 text-amber-300 px-2 py-0.5 rounded font-extrabold">
                {regionInfo.currencySymbol}{(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 px-2 py-0.5 rounded font-extrabold">
                {levelInfo.winRate}% Win
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="p-2 rounded-xl bg-[#23175c] border border-purple-400/30 text-purple-200 hover:text-white"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Banned Alert Banner */}
      {user.isBanned && (
        <div className="bg-rose-950/80 border-2 border-rose-500/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center flex-shrink-0">
              <Ban className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">অ্যাকাউন্ট সাময়িক স্থগিত (Banned)</p>
              <p className="text-[11px] text-rose-200/90 leading-tight">ম্যাচ খেলা ও লেনদেন সুবিধা সাময়িকভাবে ব্লক করা আছে।</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('support')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-xl flex-shrink-0 transition shadow"
          >
            আপিল করুন
          </button>
        </div>
      )}

      {/* Prominent Player Level & XP Progress Card */}
      <div className="bg-gradient-to-br from-[#180e3d] via-[#1f124a] to-[#120a30] p-4 rounded-3xl border border-amber-400/30 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Top: Level Badge & Rank Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`px-3 py-1.5 rounded-2xl bg-gradient-to-r ${levelInfo.rankBadgeColor} border ${levelInfo.rankBorderColor} flex items-center gap-1.5 shadow-md`}>
              <Award className="w-4 h-4" />
              <span className="font-black text-xs tracking-wider">
                LEVEL {levelInfo.level}
              </span>
            </div>
            <div>
              <h4 className="font-black text-sm text-amber-300 tracking-wide flex items-center gap-1">
                {levelInfo.rankTitle}
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </h4>
              <p className="text-[10px] text-purple-200 font-medium">
                {levelInfo.currentXp} XP • Next level at {levelInfo.nextLevelXp} XP
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-amber-300 block">
              {levelInfo.progressPercent}%
            </span>
            <span className="text-[9px] text-purple-300 font-bold uppercase">XP Progress</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#0a051d] h-2.5 rounded-full overflow-hidden p-0.5 border border-purple-800/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Performance Metrics Sub-Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#0f0828]/80 p-2 rounded-xl border border-purple-900/50 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-300 mb-0.5">
              <Swords className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold">Matches</span>
            </div>
            <span className="font-black text-sm text-white">{levelInfo.totalMatches}</span>
          </div>

          <div className="bg-[#0f0828]/80 p-2 rounded-xl border border-purple-900/50 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-300 mb-0.5">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold">Won</span>
            </div>
            <span className="font-black text-sm text-amber-300">{levelInfo.totalWon}</span>
          </div>

          <div className="bg-[#0f0828]/80 p-2 rounded-xl border border-purple-900/50 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-300 mb-0.5">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold">Win Rate</span>
            </div>
            <span className="font-black text-sm text-emerald-400">{levelInfo.winRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Profile Menu Box matching screenshot exactly */}
      <div className="bg-[#120b2e] rounded-3xl border border-[#2b1f5c] p-3 space-y-2 shadow-2xl">
        
        {/* 0. BONUS OPTION (বোনাস অপশন - দৈনিক চেক-ইন ও লাকি স্পিনার) */}
        <button
          onClick={() => setShowBonusView(true)}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#25164d] to-purple-900/50 hover:from-amber-500/30 hover:to-purple-900/70 flex items-center justify-between transition-all group border border-amber-400/50 shadow-lg relative overflow-hidden active:scale-98 cursor-pointer"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-md group-hover:scale-105 transition">
              <Gift className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-amber-300 tracking-wide">
                  বোনাস (Bonus)
                </span>
                <span className="text-[9px] bg-gradient-to-r from-red-500 to-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase shadow">
                  ফ্রি রিওয়ার্ড
                </span>
              </div>
              <span className="text-[10px] text-purple-200 font-bold block">
                দৈনিক চেক-ইন ও লাকি স্পিনার হুইল
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
            <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              ক্লেম করুন
            </span>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
          </div>
        </button>
        
        {/* 0. ADMIN CONTROL PANEL */}
        {isAdminUser(user) && (
          <button
            onClick={() => onNavigate('admin_panel')}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-900/60 to-amber-500/10 hover:from-amber-500/30 hover:to-purple-900/80 flex items-center justify-between transition-all group border border-amber-400/50 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow group-hover:scale-105 transition">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="font-black text-sm text-amber-300 tracking-wide block">{t.adminPanel}</span>
                <span className="text-[10px] text-purple-200 font-bold block">এডমিন প্যানেল - সকল ওয়েবসাইট নিয়ন্ত্রণ</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                ADMIN
              </span>
              <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition" />
            </div>
          </button>
        )}

        {/* 1. Edit Profile */}
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-purple-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-purple-300 group-hover:scale-105 transition">
              <Pencil className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">{t.profile}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-white transition" />
        </button>

        {/* 2. My Wallet */}
        <button
          onClick={() => onNavigate('wallet')}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-purple-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">{t.wallet}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-white transition" />
        </button>

        {/* 3. Transaction History */}
        <button
          onClick={() => onNavigate('match_history')}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-purple-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <History className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">{t.history}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-white transition" />
        </button>

        {/* 4. Support & Help */}
        <button
          onClick={() => onNavigate('support')}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-purple-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-pink-400 group-hover:scale-105 transition">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">{t.support}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-white transition" />
        </button>

        {/* 5. Password Security (পাসওয়ার্ড পরিবর্তন) */}
        <button
          onClick={() => {
            setShowPasswordChangeModal(true);
            setPasswordError('');
            setPasswordSuccess('');
          }}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-amber-400/40 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-slate-100 tracking-wide block">
                {selectedRegion === 'BN' ? 'পাসওয়ার্ড পরিবর্তন (Change Password)' : 'Change Password'}
              </span>
              <span className="text-[10px] text-purple-300 font-medium block">
                আইডি লগইন ও উইথড্র পাসওয়ার্ড পরিবর্তন করুন
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-amber-400 transition" />
        </button>

        {/* 6. App Settings */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-purple-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-slate-300 group-hover:scale-105 transition">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">{t.settings}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-white transition" />
        </button>

        {/* 6. About King Ludo */}
        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#170e38]/50 hover:bg-[#1f134c] flex items-center justify-between transition-all group border border-transparent hover:border-amber-400/30"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#21164e] flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Info className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 tracking-wide">
              {selectedRegion === 'BN' ? 'আমাদের সম্পর্কে (About King Ludo)' : 'About King Ludo'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#635b91] group-hover:text-amber-400 transition" />
        </button>

        {/* 7. Logout & Switch Account */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#291220]/60 hover:bg-[#3d162d] flex items-center justify-between transition-all group border border-red-500/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#3d1222] border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-105 transition">
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-sm text-red-400 tracking-wide">{t.logout}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-500/70 group-hover:text-red-400 transition" />
        </button>
      </div>
        </>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#04260f] border border-purple-500/30 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-lg text-white">{t.profile}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full bg-purple-900/40 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-300">Choose Profile Picture</label>
              <div className="grid grid-cols-3 gap-2.5">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <button
                    key={`profile-avatar-choice-${idx}`}
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-full overflow-hidden border-2 aspect-square transition ${
                      selectedAvatar === url ? 'border-amber-400 scale-105 ring-2 ring-amber-400/50' : 'border-purple-900 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="avatar" className="w-full h-full object-cover" />
                    {selectedAvatar === url && (
                      <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-amber-300 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-300">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#1b1042] border border-purple-500/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                placeholder="Enter your name"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-purple-900/40 hover:bg-purple-900/60 rounded-xl text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-xs font-extrabold text-slate-950 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= APP SETTINGS MODAL ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#04260f] border border-purple-500/30 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-lg text-white">{t.settings}</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-full bg-purple-900/40 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Sound FX */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1042] border border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">{t.sound}</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Game Music */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1042] border border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <VolumeX className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Background Music</span>
                </div>
                <input
                  type="checkbox"
                  checked={musicEnabled}
                  onChange={(e) => setMusicEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1042] border border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-slate-200">Game Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#180a1c] border border-red-500/40 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white">{t.logout}</h3>
              <p className="text-xs text-red-200/80 mt-1">
                Are you sure you want to log out? You can log in back using your phone number or guest account.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                {t.logout}
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 bg-purple-900/40 hover:bg-purple-900/60 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PASSWORD CHANGE MODAL (LOGIN & WITHDRAW PASSWORDS) ================= */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#04260f] border-2 border-emerald-500/70 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-700/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">পাসওয়ার্ড পরিবর্তন</h3>
                  <p className="text-[10px] text-emerald-300/80">আইডি লগইন ও উইথড্র পাসওয়ার্ড চেঞ্জ</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPasswordChangeModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className="p-1.5 rounded-full bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#02180a] p-1 rounded-2xl border border-emerald-700/50">
              <button
                type="button"
                onClick={() => {
                  setPasswordTab('login');
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className={`py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  passwordTab === 'login'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/30'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন পাসওয়ার্ড</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordTab('withdraw');
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className={`py-2 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  passwordTab === 'withdraw'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/30'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>উইথড্র পাসওয়ার্ড</span>
              </button>
            </div>

            {/* Alert / Feedback messages */}
            {passwordError && (
              <div className="p-3 bg-rose-950/90 border border-rose-500/70 text-rose-200 rounded-xl text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-400 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-bold">{passwordSuccess}</span>
              </div>
            )}

            {/* TAB 1: ID LOGIN PASSWORD CHANGE */}
            {passwordTab === 'login' ? (
              <form onSubmit={handleSaveLoginPassword} className="space-y-3">
                <p className="text-[11px] text-emerald-200/90 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/40">
                  আইডিতে লগইন করার জন্য নতুন পাসওয়ার্ড দিন। আগের পাসওয়ার্ডটি দিয়ে যাচাই করুন।
                </p>

                {/* 1. Old Login Password (উপরে থাকবে) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-300 block">
                    ১. আগের / বর্তমান লগইন পাসওয়ার্ড (Old Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showOldLoginPass ? 'text' : 'password'}
                      value={oldLoginPass}
                      onChange={(e) => {
                        setOldLoginPass(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="বর্তমান লগইন পাসওয়ার্ড লিখুন"
                      className="w-full bg-[#02180a] border border-amber-500/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required={Boolean(user.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldLoginPass(!showOldLoginPass)}
                      className="absolute right-3 top-2.5 text-amber-400/80 hover:text-white"
                    >
                      {showOldLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. New Login Password (নিচে ১ম) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">
                    ২. নতুন লগইন পাসওয়ার্ড (New Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showNewLoginPass ? 'text' : 'password'}
                      value={newLoginPass}
                      onChange={(e) => {
                        setNewLoginPass(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full bg-[#02180a] border border-emerald-600/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewLoginPass(!showNewLoginPass)}
                      className="absolute right-3 top-2.5 text-emerald-400 hover:text-white"
                    >
                      {showNewLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Confirm New Login Password (নিচে ২য় কনফার্ম) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">
                    ৩. কনফার্ম নতুন লগইন পাসওয়ার্ড (Confirm New Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmLoginPass ? 'text' : 'password'}
                      value={confirmLoginPass}
                      onChange={(e) => {
                        setConfirmLoginPass(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="একই নতুন পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full bg-[#02180a] border border-emerald-600/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmLoginPass(!showConfirmLoginPass)}
                      className="absolute right-3 top-2.5 text-emerald-400 hover:text-white"
                    >
                      {showConfirmLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="flex-1 py-2.5 bg-[#02180a] hover:bg-emerald-950/70 border border-emerald-800 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>লগইন পাসওয়ার্ড পরিবর্তন</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: WITHDRAW PASSWORD CHANGE */
              <form onSubmit={handleSaveWithdrawPassword} className="space-y-3">
                <p className="text-[11px] text-emerald-200/90 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/40">
                  টাকা তোলার সময় ব্যবহৃত গোপন উইথড্র পাসওয়ার্ড (পিন) চেঞ্জ করুন।
                </p>

                {/* 1. Old Withdraw Password (উপরে থাকবে) */}
                {user.withdrawPassword ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-300 block">
                      ১. আগের / বর্তমান উইথড্র পাসওয়ার্ড (Old Withdraw Password):
                    </label>
                    <div className="relative">
                      <input
                        type={showOldWithdrawPass ? 'text' : 'password'}
                        value={oldWithdrawPass}
                        onChange={(e) => {
                          setOldWithdrawPass(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        placeholder="বর্তমান উইথড্র পাসওয়ার্ড লিখুন"
                        className="w-full bg-[#02180a] border border-amber-500/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldWithdrawPass(!showOldWithdrawPass)}
                        className="absolute right-3 top-2.5 text-amber-400/80 hover:text-white"
                      >
                        {showOldWithdrawPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* 2. New Withdraw Password (নিচে ১ম) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">
                    {user.withdrawPassword ? '২. নতুন উইথড্র পাসওয়ার্ড (New Password):' : 'নতুন উইথড্র পাসওয়ার্ড:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewWithdrawPass ? 'text' : 'password'}
                      value={newWithdrawPass}
                      onChange={(e) => {
                        setNewWithdrawPass(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="কমপক্ষে ৪ সংখ্যা বা অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full bg-[#02180a] border border-emerald-600/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewWithdrawPass(!showNewWithdrawPass)}
                      className="absolute right-3 top-2.5 text-emerald-400 hover:text-white"
                    >
                      {showNewWithdrawPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Confirm New Withdraw Password (নিচে ২য় কনফার্ম) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 block">
                    {user.withdrawPassword ? '৩. কনফার্ম নতুন উইথড্র পাসওয়ার্ড (Confirm New):' : 'কনফার্ম উইথড্র পাসওয়ার্ড:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmWithdrawPass ? 'text' : 'password'}
                      value={confirmWithdrawPass}
                      onChange={(e) => {
                        setConfirmWithdrawPass(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="একই নতুন পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full bg-[#02180a] border border-emerald-600/60 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmWithdrawPass(!showConfirmWithdrawPass)}
                      className="absolute right-3 top-2.5 text-emerald-400 hover:text-white"
                    >
                      {showConfirmWithdrawPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="flex-1 py-2.5 bg-[#02180a] hover:bg-emerald-950/70 border border-emerald-800 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>উইথড্র পাসওয়ার্ড পরিবর্তন</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Local Lucky Spinner Wheel Modal */}
      {showLocalSpinnerModal && (
        <LuckySpinnerWheelModal
          isOpen={showLocalSpinnerModal}
          onClose={() => setShowLocalSpinnerModal(false)}
          user={user}
          onUpdateBalance={onUpdateBalance}
        />
      )}

      {/* About King Ludo Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        selectedRegion={selectedRegion}
      />
    </div>
  );
};
