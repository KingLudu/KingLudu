import React, { useState, useEffect } from 'react';
import { Copy, Check, Share2, X, ArrowLeft, Gift, Sparkles, Users, Award } from 'lucide-react';
import { requestAppFullscreen } from '../../utils/fullscreen';

interface ReferEarnModalProps {
  referralCode: string;
  onClose: () => void;
  referralBonus?: number;
}

export const ReferEarnModal: React.FC<ReferEarnModalProps> = ({
  referralCode,
  onClose,
  referralBonus = 100,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    requestAppFullscreen().catch(() => {});
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#0a051b] flex flex-col overflow-hidden text-white animate-fadeIn select-none">
      {/* Top Application Bar with Back Button */}
      <div className="bg-[#12072e]/95 border-b border-purple-700/50 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full shadow border border-pink-400/30 bg-pink-900/40 text-pink-300">
              🎁 রেফারেল প্রোগ্রাম
            </span>
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

      {/* Main Full-Screen Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-sm space-y-4 text-center my-auto">
          {/* Animated Gift Hub */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl animate-pulse" />
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-600 to-rose-500 border-2 border-pink-300 rounded-3xl flex items-center justify-center shadow-xl relative z-10 text-white">
              <Gift className="w-10 h-10 animate-bounce" />
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-[10px] font-black text-pink-300 uppercase tracking-widest inline-flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              ইনস্ট্যান্ট ৳{referralBonus} ক্যাশ রিওয়ার্ড
            </span>
            <h3 className="font-black text-xl text-white">বন্ধুদের ইনভাইট করুন ও আয় করুন</h3>
            <p className="text-xs text-purple-200/90 mt-1 leading-relaxed">
              আপনার ইউনিক রেফার কোড বন্ধুদের শেয়ার করুন। বন্ধু অ্যাকাউন্ট খুলে গেম খেললেই আপনি ও আপনার বন্ধু উভয়েই পাবেন ইনস্ট্যান্ট বোনাস!
            </p>
          </div>

          {/* Code Box */}
          <div className="bg-[#04260f] p-3.5 rounded-2xl border-2 border-pink-500/50 flex items-center justify-between shadow-inner">
            <div className="text-left">
              <span className="text-[10px] text-pink-300 block font-bold">আপনার রেফার কোড:</span>
              <span className="font-mono font-black text-amber-300 tracking-wider text-lg">
                {referralCode || 'LUDO' + Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs">
            <div className="p-3 bg-[#052a12] rounded-xl border border-purple-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-pink-300 font-bold text-[11px]">
                <Users className="w-3.5 h-3.5" />
                <span>আনলিমিটেড রেফার</span>
              </div>
              <p className="text-[10px] text-slate-400">যত বন্ধুকে ইনভাইট করবেন তত বেশি বোনাস</p>
            </div>
            <div className="p-3 bg-[#052a12] rounded-xl border border-purple-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                <Award className="w-3.5 h-3.5" />
                <span>১০০% ক্যাশআউট</span>
              </div>
              <p className="text-[10px] text-slate-400">উইনিং ব্যালেন্সে কনভার্ট করে দ্রুত উইথড্র</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopy}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 font-black text-xs rounded-2xl text-white shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>কোড শেয়ার ও কপি করুন</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 border border-purple-800/50 transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম পেজে ফিরে যান (Back to Home)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
