import React, { useEffect, useState } from 'react';
import {
  X,
  Crown,
  Users,
  Dices,
  Key,
  Trophy,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { ScreenType, AppSettings } from '../../types';
import modeKingLudoImg from '../../assets/images/mode_king_ludo_1789079084574.jpg';
import { requestAppFullscreen } from '../../utils/fullscreen';

interface LudoModesChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenFriendsChoice: () => void;
  appSettings?: AppSettings;
  onSelectPlayerCount?: (count: 2 | 4) => void;
  onStartBotMatch?: (playersCount: 2 | 4) => void;
  userBalance?: number;
}

export const LudoModesChoiceModal: React.FC<LudoModesChoiceModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenFriendsChoice,
  appSettings,
  onSelectPlayerCount,
  onStartBotMatch,
  userBalance = 0,
}) => {
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);

  const minRequiredFee =
    appSettings?.minMatchFee ??
    (appSettings?.homeGameOptions?.[0]?.minBet ?? 10);

  useEffect(() => {
    if (isOpen) {
      // Trigger native browser fullscreen when entering this program
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeSelect = (action: () => void) => {
    if (userBalance < minRequiredFee) {
      setShowBalanceWarning(true);
      return;
    }
    action();
  };

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full flex flex-col overflow-hidden animate-fadeIn select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.92), rgba(6,51,20,0.95), rgba(3,24,9,0.98)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Application Bar */}
      <div className="bg-[#063314]/95 border-b border-emerald-700/50 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md font-black">
              <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white leading-tight flex items-center gap-1.5">
                <span>King Ludu মোড</span>
                <span className="text-[10px] text-amber-300 font-extrabold bg-amber-950/90 border border-amber-400/50 px-1.5 py-0.2 rounded-full">
                  রিয়েল প্লে
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Hero Artwork Banner */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden border-b border-amber-500/30 shrink-0">
          <img
            src={modeKingLudoImg}
            alt="King Ludu"
            className="w-full h-full object-cover object-center brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031e0c] via-[#031e0c]/60 to-transparent" />

          {/* Banner Floating Title Content */}
          <div className="absolute bottom-3 left-4 right-4 max-w-2xl mx-auto flex items-end justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 inline-flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                কিং লুডো স্পেশাল টুর্নামেন্ট
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-white drop-shadow-lg leading-tight">
                আপনার পছন্দের লুডো মোড বেছে নিন
              </h3>
              <p className="text-xs text-amber-200/90 font-medium drop-shadow">
                ১০০% ফেয়ার প্লে • ইনস্ট্যান্ট ক্যাশআউট • লাইভ প্লেয়ার্স
              </p>
            </div>
          </div>
        </div>

        {/* Mode List Options - Max Width Centered on Large Displays, Edge-to-Edge on Mobile */}
        <div className="p-3 sm:p-4 space-y-3 max-w-xl mx-auto w-full flex-1">
          {/* 1. 2 Player Mode */}
          {appSettings?.enable2PlayerMode !== false && (
            <button
              onClick={() => handleModeSelect(() => {
                requestAppFullscreen().catch(() => {});
                if (onSelectPlayerCount) onSelectPlayerCount(2);
                onClose();
                onNavigate('create_match');
              })}
              className="w-full bg-gradient-to-r from-[#c81e3a] via-[#9c132a] to-[#6d091a] hover:brightness-110 p-3.5 sm:p-4 rounded-2xl text-left text-white shadow-xl flex items-center justify-between relative overflow-hidden group active:scale-[0.99] transition border-2 border-red-400/60 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base sm:text-lg text-white">২ প্লেয়ার ব্যাটল</h4>
                    <span className="text-[10px] font-black bg-red-950/90 border border-red-300/40 text-amber-300 px-2 py-0.5 rounded-full">
                      🔥 মোস্ট পপুলার
                    </span>
                  </div>
                  <p className="text-xs text-red-100/95 font-medium mt-0.5">
                    {appSettings?.mode2PlayerSubtitle || `১v১ ফাস্ট ইনস্ট্যান্ট ম্যাচ • সর্বনিম্ন ফি ৳${minRequiredFee}`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-amber-300 group-hover:translate-x-1 transition-transform z-10 flex-shrink-0" />
            </button>
          )}

          {/* 2. 4 Player Mode */}
          {appSettings?.enable4PlayerMode !== false && (
            <button
              onClick={() => handleModeSelect(() => {
                requestAppFullscreen().catch(() => {});
                if (onSelectPlayerCount) onSelectPlayerCount(4);
                onClose();
                onNavigate('create_match');
              })}
              className="w-full bg-gradient-to-r from-[#0e8a5b] via-[#076b45] to-[#03442a] hover:brightness-110 p-3.5 sm:p-4 rounded-2xl text-left text-white shadow-xl flex items-center justify-between relative overflow-hidden group active:scale-[0.99] transition border-2 border-emerald-400/60 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner shrink-0">
                  <Dices className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base sm:text-lg text-white">৪ প্লেয়ার ক্লাসিক</h4>
                    <span className="text-[10px] font-black bg-emerald-950/90 border border-emerald-300/40 text-emerald-200 px-2 py-0.5 rounded-full">
                      ৪ ঘুঁটি চ্যালেঞ্জ
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/95 font-medium mt-0.5">
                    {appSettings?.mode4PlayerSubtitle || 'ক্লাসিক ৪ জন প্লেয়ার • বড় প্রাইজপুল'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-emerald-300 group-hover:translate-x-1 transition-transform z-10 flex-shrink-0" />
            </button>
          )}

          {/* 3. Private Room Mode */}
          {appSettings?.enablePrivateRoomMode !== false && (
            <button
              onClick={() => handleModeSelect(() => {
                requestAppFullscreen().catch(() => {});
                onClose();
                onOpenFriendsChoice();
              })}
              className="w-full bg-gradient-to-r from-[#1d52d8] via-[#153eb0] to-[#0c246e] hover:brightness-110 p-3.5 sm:p-4 rounded-2xl text-left text-white shadow-xl flex items-center justify-between relative overflow-hidden group active:scale-[0.99] transition border-2 border-blue-400/60 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner shrink-0">
                  <Key className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base sm:text-lg text-white">প্রাইভেট রুম (ফ্রেন্ডস)</h4>
                    <span className="text-[10px] font-black bg-blue-950/90 border border-blue-300/40 text-blue-200 px-2 py-0.5 rounded-full">
                      বন্ধুদের সাথে
                    </span>
                  </div>
                  <p className="text-xs text-blue-100/95 font-medium mt-0.5">
                    {appSettings?.modePrivateSubtitle || 'রুম কোড শেয়ার করে কাস্টম বেট খেলুন'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-cyan-300 group-hover:translate-x-1 transition-transform z-10 flex-shrink-0" />
            </button>
          )}

          {/* 4. Tournament Mode */}
          {appSettings?.enableTournamentMode !== false && (
            <button
              onClick={() => handleModeSelect(() => {
                requestAppFullscreen().catch(() => {});
                if (onSelectPlayerCount) onSelectPlayerCount(4);
                onClose();
                onNavigate('create_match');
              })}
              className="w-full bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#78350f] hover:brightness-110 p-3.5 sm:p-4 rounded-2xl text-left text-white shadow-xl flex items-center justify-between relative overflow-hidden group active:scale-[0.99] transition border-2 border-amber-300/70 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-amber-200 shadow-inner shrink-0">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base sm:text-lg text-white">মেগা টুর্নামেন্ট</h4>
                    <span className="text-[10px] font-black bg-amber-950/90 border border-amber-300/50 text-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      ৳৫০,০০০ পুল
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/95 font-medium mt-0.5">
                    {appSettings?.modeTournamentSubtitle || 'মেগা কাপ ও ট্রফি জিতুন'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-amber-300 group-hover:translate-x-1 transition-transform z-10 flex-shrink-0" />
            </button>
          )}

          {/* Return / Back to Home Button */}
          <div className="pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-900/60 via-purple-950 to-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-purple-700/60 transition active:scale-95 cursor-pointer shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম পেজে ফিরে যান (Back to Home)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Fast Join Bar - Edge to Edge */}
      <div className="p-3 sm:p-4 bg-[#12072e]/95 border-t border-purple-700/50 flex items-center justify-center shrink-0 shadow-lg">
        <div className="max-w-xl w-full flex items-center gap-2.5">
          <button
            onClick={() => handleModeSelect(() => {
              requestAppFullscreen().catch(() => {});
              onClose();
              onNavigate('join_match');
            })}
            className="flex-1 py-3 px-3 bg-purple-900/70 hover:bg-purple-800 border border-purple-500/50 text-purple-200 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-300" />
            <span>কোড দিয়ে জয়েন</span>
          </button>
          <button
            onClick={() => handleModeSelect(() => {
              requestAppFullscreen().catch(() => {});
              onClose();
              onNavigate('create_match');
            })}
            className="flex-1 py-3 px-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>কুইক ম্যাচ শুরু</span>
          </button>
        </div>
      </div>

      {/* INSUFFICIENT BALANCE WARNING MODAL (Taka sara kuno game khelte parbe na) */}
      {showBalanceWarning && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#04260f] border-2 border-emerald-500/90 w-full max-w-xs rounded-3xl p-5 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
              <span className="text-3xl">⚠️</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-black text-base text-white">টাকা ছাড়া গেম খেলা যাবে না!</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                King Ludo প্ল্যাটফর্মে কোনো ফ্রি বা বিনা টাকার গেম নেই। যে কোনো ম্যাচ খেলতে অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স থাকতে হবে।
              </p>
            </div>

            <div className="bg-[#031e0c] p-3 rounded-2xl border border-emerald-700/60 space-y-1 text-xs">
              <div className="flex items-center justify-between text-emerald-200">
                <span>সর্বনিম্ন এন্ট্রি ফি:</span>
                <span className="font-black text-amber-400 font-mono">৳{minRequiredFee}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-200">
                <span>আপনার বর্তমান ব্যালেন্স:</span>
                <span className="font-black text-rose-400 font-mono">
                  ৳{(Number(userBalance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowBalanceWarning(false);
                  onClose();
                  onNavigate('add_money');
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>টাকা যোগ করুন (ডিপোজিট)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBalanceWarning(false)}
                className="w-full py-2 bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
