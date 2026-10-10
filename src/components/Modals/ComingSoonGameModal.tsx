import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Sparkles,
  Bell,
  CheckCircle2,
  Lock,
  Clock,
  Zap,
  Flame,
  ShieldCheck,
  ChevronRight,
  Gamepad2,
  Layers,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { requestAppFullscreen } from '../../utils/fullscreen';

export interface ComingSoonFeature {
  icon: any;
  title: string;
  desc: string;
}

export interface ComingSoonGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: 'slot' | 'live_casino' | 'sports';
  title: string;
  enTitle: string;
  badge: string;
  headline: string;
  description: string;
  artwork: string;
  features: ComingSoonFeature[];
  theme: {
    accentGradient: string;
    borderColor: string;
    glowShadow: string;
    textGradient: string;
    badgeColor: string;
    iconBg: string;
    particleColor: string;
  };
}

export const ComingSoonGameModal: React.FC<ComingSoonGameModalProps> = ({
  isOpen,
  onClose,
  gameId,
  title,
  enTitle,
  badge,
  headline,
  description,
  artwork,
  features,
  theme,
}) => {
  const [isNotified, setIsNotified] = useState(false);
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotifyMe = () => {
    setIsNotified(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 w-full h-full bg-[#09041a] flex flex-col overflow-hidden text-white animate-fadeIn select-none">
        {/* Toast alert when notified */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-60 px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ধন্যবাদ! রিলিজের সাথে সাথে আপনি সবার আগে নোটিফিকেশন পাবেন।</span>
          </motion.div>
        )}

        {/* Top Fullscreen Application Bar with Back Button */}
        <div className="bg-[#12072e]/95 border-b border-purple-700/50 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="হোম পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম পেজে ফিরুন</span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow border border-white/10 ${theme.badgeColor}`}>
                {badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Full-Screen Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col items-center p-4 sm:p-6">
          {/* Ambient Background with Artwork & Dark Vignette */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src={artwork}
              alt={title}
              className="w-full h-full object-cover scale-110 blur-2xl opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09041a]/90 via-[#0d0724]/95 to-[#050212]" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-35 bg-gradient-to-tr from-purple-600 via-amber-400 to-cyan-400" />
          </div>

          {/* Centered Presentation Content Container */}
          <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center space-y-4 my-auto">
            {/* Animated Hero Icon Hub */}
            <div className="relative my-2">
              {/* Pulsing Outer Glow Aura */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.7, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: 'easeInOut',
                }}
                className={`absolute -inset-3 rounded-full blur-xl ${theme.iconBg}`}
              />

              {/* Orbiting Rotating Sparkle Accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute -inset-2 rounded-full border border-dashed border-amber-400/40 pointer-events-none"
              />

              {/* Center Floating Icon Badge */}
              <motion.div
                animate={{
                  y: [-3, 4, -3],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: 'easeInOut',
                }}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl ${theme.iconBg} border-2 border-amber-300/80 p-0.5 shadow-2xl flex items-center justify-center`}
              >
                <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#1c0f3d] to-[#0c051f] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none" />
                  {gameId === 'slot' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-4xl select-none"
                    >
                      🎰
                    </motion.div>
                  )}
                  {gameId === 'live_casino' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-4xl select-none"
                    >
                      🎲
                    </motion.div>
                  )}
                  {gameId === 'sports' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-4xl select-none"
                    >
                      🏆
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Glowing Category Subtitle */}
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300/90 flex items-center justify-center gap-1.5 drop-shadow">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{enTitle} • {title}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              </span>

              {/* Animated Shimmering "COMING SOON" Banner */}
              <div className="py-1">
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: 'linear',
                  }}
                  className={`text-3xl sm:text-4xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r ${theme.textGradient} bg-[length:200%_auto] drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]`}
                >
                  COMING SOON
                </motion.div>
                <div className="flex items-center justify-center gap-2 pt-0.5">
                  <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-xs font-bold text-amber-200">শীঘ্রই আসছে</span>
                  <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-amber-400" />
                </div>
              </div>
            </div>

            {/* Bengali Headline & Friendly Description */}
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-extrabold text-white leading-snug">
                {headline}
              </h3>
              <p className="text-xs text-purple-200/90 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Development Status Radar Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-700/60 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[11px] font-bold text-amber-300">
                উন্নয়ন কাজ চলমান (Under Development)
              </span>
            </div>

            {/* Preview Highlights Cards */}
            <div className="w-full grid grid-cols-1 gap-2 pt-2 text-left">
              {features.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-2xl bg-[#140c33]/70 border border-purple-800/40 flex items-center gap-3 hover:border-amber-400/40 transition shadow"
                  >
                    <div className={`w-8 h-8 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 border border-white/10 shadow text-amber-300 font-bold`}>
                      <FeatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{feat.title}</h4>
                      <p className="text-[10px] text-purple-200/80">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Notify & Action Buttons */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={isNotified}
                className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer ${
                  isNotified
                    ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/50 cursor-default'
                    : `bg-gradient-to-r ${theme.accentGradient} text-slate-950 hover:brightness-110 border border-amber-300/60`
                }`}
              >
                {isNotified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>নোটিফিকেশন অ্যালার্ট সেট করা হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span>রিলিজ নোটিফিকেশন পেতে ক্লিক করুন</span>
                  </>
                )}
              </button>

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
      </div>
    </AnimatePresence>
  );
};
