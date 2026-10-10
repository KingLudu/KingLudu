import React, { useEffect } from 'react';
import { ShieldAlert, Ban, MessageCircle, LogOut, X, AlertTriangle, User, Phone, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';

interface BannedUserModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onContactSupport: () => void;
  onLogout: () => void;
}

export const BannedUserModal: React.FC<BannedUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onContactSupport,
  onLogout,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-gradient-to-b from-[#1c0a1a] via-[#15071e] to-[#0d0417] border-2 border-rose-600/70 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden flex flex-col text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="banned-modal-title"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 px-5 py-4 border-b border-rose-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/40 border border-rose-400 flex items-center justify-center text-rose-300 shadow">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h3 id="banned-modal-title" className="text-sm sm:text-base font-black text-white tracking-wide">
                অ্যাকাউন্ট স্থগিত (Account Banned)
              </h3>
              <span className="text-[10px] text-rose-300 font-bold block">
                অ্যাক্সেস সাময়িকভাবে সীমাবদ্ধ করা হয়েছে
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Pulsing Visual Icon */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-red-500 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.5)] animate-pulse">
              <ShieldAlert className="w-9 h-9 text-white stroke-[2.5]" />
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              আপনার অ্যাকাউন্টটি ব্যান করা হয়েছে!
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed max-w-sm mx-auto">
              প্ল্যাটফর্মের নীতিমালার সুরক্ষা বজায় রাখতে বা সন্দেহজনক কার্যক্রম পর্যালোচনার জন্য অ্যাডমিন কর্তৃক এই অ্যাকাউন্টটি স্থগিত (Banned) করা হয়েছে।
            </p>
          </div>

          {/* User Account Snapshot */}
          <div className="bg-[#240c21]/70 border border-rose-800/60 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-purple-200">
              <span className="flex items-center gap-1.5 text-rose-300 font-bold">
                <User className="w-3.5 h-3.5" />
                <span>প্লেয়ার নাম:</span>
              </span>
              <span className="font-black text-white">{user.name || 'ইউজার'}</span>
            </div>

            <div className="flex items-center justify-between text-purple-200">
              <span className="flex items-center gap-1.5 text-rose-300 font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>মোবাইল নম্বর / আইডি:</span>
              </span>
              <span className="font-mono font-bold text-amber-300">{user.phone || user.id}</span>
            </div>

            <div className="flex items-center justify-between border-t border-rose-900/50 pt-2">
              <span className="text-rose-300 font-bold">অ্যাকাউন্ট স্ট্যাটাস:</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                নিষিদ্ধ (BANNED)
              </span>
            </div>
          </div>

          {/* Restriction Bullet Points */}
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-3 space-y-1.5 text-[11px] text-rose-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>১v১ বা ৪v৪ কোনো লুডো ম্যাচ ও টুর্নামেন্ট শুরু বা জয়েন করা যাবে না।</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>ওয়ালেট থেকে টাকা উত্তোলন (Withdraw) বা নতুন ডিপোজিট গ্রহণ বন্ধ থাকবে।</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>ভুলবশত ব্যান হলে কাস্টমার সাপোর্ট টিমে যোগাযোগ করে আপিল করতে পারেন।</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#14061a] border-t border-rose-800/60 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onContactSupport();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>সাপোর্ট টিমের সাথে যোগাযোগ (Appeal Ban)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-purple-950/70 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl border border-purple-800/60 transition cursor-pointer text-center"
            >
              বন্ধ করুন
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex-1 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-xs rounded-xl border border-rose-700/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
