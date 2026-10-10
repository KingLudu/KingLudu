import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Crown,
  ShieldCheck,
  Award,
  Users,
  Coins,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Globe,
  HeartHandshake,
  Headphones,
  ArrowLeft,
} from 'lucide-react';
import { RegionCode } from '../../types';
import { requestAppFullscreen } from '../../utils/fullscreen';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion?: RegionCode;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  selectedRegion = 'BN',
}) => {
  const isEn = selectedRegion === 'EN';

  useEffect(() => {
    if (isOpen) {
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 w-full h-full bg-[#0a051b] flex flex-col overflow-hidden select-none text-white animate-fadeIn">
          {/* Header */}
          <div className="relative p-3.5 sm:p-4 bg-gradient-to-r from-purple-950/95 via-indigo-950/90 to-purple-950/95 border-b border-purple-800/50 flex items-center justify-between shrink-0 shadow-md z-30">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="হোম পেজে ফিরুন"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>হোম পেজে ফিরুন</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950">
                  <Crown className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm sm:text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                      King Ludo
                    </h2>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      v2.5 Official
                    </span>
                  </div>
                  <p className="text-[10px] text-purple-200/90 hidden xs:block">
                    {isEn ? 'Bangladesh & Global Real-Money Ludo Platform' : 'বিশ্বস্ত অনলাইন রিয়েল মানি লুডো ও আর্নিং প্ল্যাটফর্ম'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-200 text-xs leading-relaxed custom-scrollbar max-w-2xl mx-auto w-full">
              {/* Introduction Card */}
              <div className="p-3.5 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 rounded-2xl border border-purple-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Welcome to King Ludo' : 'কিং লুডো (King Ludo) তে স্বাগতম'}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isEn
                    ? 'King Ludo is a premier real-time multiplayer board game designed for skill-based gaming. Play classic Ludo matches with friends or real challengers worldwide, enter tournaments, and instantly withdraw your earnings securely.'
                    : 'কিং লুডো হলো বাংলাদেশ এবং আন্তর্জাতিকভাবে দক্ষ লুডো খেলোয়াড়দের জন্য তৈরি একটি প্রিমিয়ার রিয়েল-টাইম মাল্টিপ্লেয়ার গেমিং প্ল্যাটফর্ম। এখানে আপনি বন্ধুবান্ধব কিংবা আসল প্রতিপক্ষের সাথে ক্লাসিক ও কুইক লুডো ম্যাচ খেলে দ্রুততম সময়ে নিরাপদে আপনার বিজয়ী প্রাইজ মানি উত্তোলন করতে পারবেন।'}
                </p>
              </div>

              {/* Core Features Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#170e38] border border-purple-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Instant Payout' : 'ইনস্ট্যান্ট ক্যাশআউট'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isEn ? 'Fast withdrawals via bKash, Nagad, Binance Pay & USDT.' : 'বিকাশ, নগদ, রকেট, উপায় ও বাইন্যান্স পে-তে সুপারফাস্ট উইথড্র সুবিধা।'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#170e38] border border-purple-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? '100% Fair Play' : 'নিরাপদ ও ফেয়ার প্লে'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isEn ? 'Cryptographically secure dice RNG and anti-cheat tracking.' : 'ক্রিপ্টোগ্রাফিক ডাইস অ্যালগরিদম ও নির্ভরযোগ্য অ্যান্টি-চিট সিকিউরিটি।'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#170e38] border border-purple-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? 'Live Matchmaking' : 'লাইভ মাল্টিপ্লেয়ার'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isEn ? '2-Player, 4-Player, private room codes & friendly battles.' : '২ প্লেয়ার, ৪ প্লেয়ার, প্রাইভেট রুম কোড এবং বন্ধুদের সাথে লাইভ ম্যাচ।'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#170e38] border border-purple-800/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-pink-300 font-bold text-[11px]">
                    <Headphones className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isEn ? '24/7 Live Support' : '২৪/৭ লাইভ সাপোর্ট'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isEn ? 'Real-time live chat assistance for deposits, matches & withdrawals.' : 'ডিপোজিট, উইথড্র ও অ্যাকাউন্ট সহায়তায় সার্বক্ষণিক লাইভ চ্যাট সাপোর্ট।'}
                  </p>
                </div>
              </div>

              {/* Game Rules & Integrity Summary */}
              <div className="p-3.5 bg-purple-950/40 rounded-2xl border border-purple-800/50 space-y-2">
                <div className="flex items-center gap-2 text-yellow-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>{isEn ? 'Game Integrity & Rules' : 'গেমের নিয়মাবলী ও সততা'}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isEn ? 'Authentic Ludo King rules with 8 safe spots (stars & start sockets).' : 'বোর্ডের ৮টি নিরাপদ স্পট (৪টি স্টার ও ৪টি কালার স্টার্টিং পয়েন্ট) এ একাধিক গুটি সুরক্ষিত থাকে।'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isEn ? 'Capturing an opponent pawn sends it back to base and awards a bonus roll.' : 'বিপক্ষের গুটি কাটলে বা হোমে পৌঁছালে তাৎক্ষণিক বোনাস চালের সুযোগ।'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isEn ? '3 consecutive sixes penalty skips the 3rd roll and passes the turn.' : 'টানা ৩ বার ছক্কা (৬) উঠলে ৩য় ছক্কার চাল বাতিল হয়ে টার্ন হাতবদল হবে।'}</span>
                  </li>
                </ul>
              </div>

              {/* Supported Payment Channels */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-purple-950/50 to-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Supported Payment Channels' : 'পেমেন্ট ও উইথড্র মাধ্যমসমূহ'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Instant & Secure</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-snug">
                  {isEn
                    ? 'Bangladesh users enjoy seamless bKash, Nagad, Rocket and Upay MFS gateways. International players can deposit and withdraw instantly via Binance Pay and Cryptocurrency USDT (TRC20 / BEP20).'
                    : 'বাংলাদেশি প্লেয়াররা বিকাশ, নগদ, রকেট এবং উপায়ের মাধ্যমে সহজেই লেনদেন করতে পারেন। অন্যদিকে আন্তর্জাতিক প্লেয়ারদের জন্য বাইন্যান্স পে (Binance Pay) এবং ইউএসডিটি ক্রিপ্টোকারেন্সি (USDT TRC20/BEP20) সক্রিয় রয়েছে।'}
                </p>
              </div>

              {/* Legal & Security Badge */}
              <div className="p-3 bg-[#0d0722] rounded-2xl border border-purple-900/60 text-center space-y-1">
                <p className="text-[11px] font-bold text-amber-200">
                  © 2026 King Ludo Entertainment Inc. All Rights Reserved.
                </p>
                <p className="text-[10px] text-purple-300/70">
                  {isEn ? 'Designed with skill-based competitive gaming mechanics. Play responsibly.' : 'শুধুমাত্র ১৮+ প্রাপ্তবয়স্কদের জন্য দক্ষতানির্ভর বিনোদন ও প্রতিযোগিতা। দায়িত্বশীলভাবে খেলুন।'}
                </p>
              </div>

              {/* Bottom Back Button */}
              <div className="pt-2 pb-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-900/80 via-purple-950 to-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 border border-purple-700/60 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>হোম পেজে ফিরে যান (Back to Home)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
  );
};
