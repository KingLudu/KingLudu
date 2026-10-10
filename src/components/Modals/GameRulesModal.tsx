import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Star,
  Trophy,
  Users,
  X,
  Dice6,
  RotateCw,
  AlertTriangle,
  Home,
  Sword,
  Sparkles,
  Monitor,
  Gamepad2,
  Key,
  Clock,
  Shield,
  Flag,
  Globe,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { LudoRulesConfig, DEFAULT_LUDO_RULES } from '../../types';

interface GameRulesModalProps {
  onClose: () => void;
  initialMode?: 2 | 4;
  rulesConfig?: LudoRulesConfig;
  onSaveRules?: (rules: LudoRulesConfig) => void;
}

export const GameRulesModal: React.FC<GameRulesModalProps> = ({
  onClose,
  rulesConfig = DEFAULT_LUDO_RULES,
  onSaveRules,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'modes' | 'gameplay' | 'turns' | 'safe' | 'winlose'>('config');
  const [currentRules, setCurrentRules] = useState<LudoRulesConfig>(rulesConfig);

  const handleToggle = (key: keyof LudoRulesConfig) => {
    const updated = { ...currentRules, [key]: !currentRules[key] };
    setCurrentRules(updated);
    if (onSaveRules) onSaveRules(updated);
  };

  const handleUpdate = <K extends keyof LudoRulesConfig>(key: K, value: LudoRulesConfig[K]) => {
    const updated = { ...currentRules, [key]: value };
    setCurrentRules(updated);
    if (onSaveRules) onSaveRules(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-[#0e0a24] border-2 border-amber-400/80 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-3.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 border-b border-amber-400/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-black text-sm text-amber-300">লুডো নিয়ম ও কনফিগারেশন</h3>
              <p className="text-[10px] text-purple-200">King Ludo Rules & Game Customizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-purple-950/80 text-slate-300 hover:text-white border border-purple-700/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#070514] p-1 border-b border-purple-900/50 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-amber-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>⚙️ নিয়ম সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('modes')}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'modes'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>১. মোড</span>
          </button>

          <button
            onClick={() => setActiveTab('gameplay')}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'gameplay'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Dice6 className="w-3.5 h-3.5" />
            <span>২. গুটি বের করা</span>
          </button>

          <button
            onClick={() => setActiveTab('turns')}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'turns'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>৩. বোনাস</span>
          </button>

          <button
            onClick={() => setActiveTab('safe')}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'safe'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>৪. সেফ জোন</span>
          </button>

          <button
            onClick={() => setActiveTab('winlose')}
            className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'winlose'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>৫. বিজয়</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-3.5 overflow-y-auto space-y-3 text-xs text-slate-200 scrollbar-thin">
          
          {/* TAB 0: INTERACTIVE RULE CUSTOMIZER */}
          {activeTab === 'config' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border border-amber-500/50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-black text-amber-300 text-xs flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>কাস্টমাইজড গেম রুলস (King Rules)</span>
                  </div>
                  <p className="text-[10px] text-amber-200/80">পছন্দমতো নিয়ম চালু বা বন্ধ করে লুডো খেলুন</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentRules(DEFAULT_LUDO_RULES);
                    if (onSaveRules) onSaveRules(DEFAULT_LUDO_RULES);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:text-white bg-purple-950/80 border border-amber-500/40 rounded-lg transition-colors cursor-pointer"
                >
                  রিসেট
                </button>
              </div>

              {/* Rule 1: Open on Six */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Dice6 className="w-3.5 h-3.5 text-amber-400" />
                    <span>নিয়ম ১: গুটি বের হতে ৬ প্রয়োজন</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    বেস থেকে গুটি বের করার জন্য অবশ্যই ডাইসে ৬ পড়তে হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('openOnSixOnly')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.openOnSixOnly ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.openOnSixOnly ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 2: Bonus Turn on 6 */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>নিয়ম ২: ৬ উঠলে অতিরিক্ত বোনাস চাল</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    ডাইসে ৬ উঠলে প্লেয়ার গুটি চালার পর আবারও ডাইস চালার সুযোগ পান।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('bonusOnSix')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.bonusOnSix ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.bonusOnSix ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 3: Consecutive 3 Sixes Penalty */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 space-y-2">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>নিয়ম ৩: পরপর ৩টি ৬ (ছক্কা) পড়লে পেনাল্টি</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    টানা ৩ বার ৬ উঠলে প্লেয়ারের উপর কী ধরণের জরিমানা প্রযোজ্য হবে:
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: 'cancel_turn', label: 'চাল বাতিল (Lose Turn)' },
                    { id: 'skip_next', label: 'পরের চাল স্কিপ' },
                    { id: 'lose_pawn', label: 'গুটি বেসে ফেরত' },
                  ].map((item, pIdx) => (
                    <button
                      key={`rule-penalty-${item.id}-${pIdx}`}
                      type="button"
                      onClick={() => handleUpdate('consecutiveSixPenalty', item.id as any)}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer ${
                        currentRules.consecutiveSixPenalty === item.id
                          ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-400 shadow-md'
                          : 'bg-purple-900/30 text-slate-300 border-purple-800/60 hover:bg-purple-900/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule 5: Landing on Opponent Captures It */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Sword className="w-3.5 h-3.5 text-rose-400" />
                    <span>নিয়ম ৫: বিপক্ষের গুটি কাটা (Capture)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    বিপক্ষের গুটির ঘরে নিজের গুটি পৌঁছালে বিপক্ষের গুটি বেসে ফেরত যাবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('captureOpponent')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.captureOpponent ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.captureOpponent ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 6: Safe Star Cells */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>নিয়ম ৬: স্টার সেফ জোনে গুটি সুরক্ষিত</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    স্টার (★) ও কালার স্টার্টিং ঘরে গুটি অবস্থান করলে কাটা যাবে না।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('safeStarCells')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.safeStarCells ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.safeStarCells ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 7: Bonus Turn on Capture */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>নিয়ম ৭: গুটি কাটলে অতিরিক্ত চাল</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    বিপক্ষের গুটি কাটলে তাৎক্ষণিকভাবে ১টি অতিরিক্ত বোনাস রোল পাওয়া যাবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('bonusOnCapture')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.bonusOnCapture ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.bonusOnCapture ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 8: Exact Home Roll Required */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>নিয়ম ৮: হোমে প্রবেশ করতে হুবহু পয়েন্ট</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    গুটি হোমে পৌঁছানোর জন্য ডাইসে ঠিক নির্দিষ্ট পয়েন্টই তুলতে হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('exactHomeRoll')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.exactHomeRoll ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.exactHomeRoll ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rule 9: Target Pawns to Win (Classic 4 vs Quick 1) */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 space-y-2">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>নিয়ম ৯: জেতার জন্য প্রয়োজনীয় গুটি</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    ক্লাসিক মোডে ৪টি গুটি অথবা কুইক মোডে ১টি গুটি হোমে পৌঁছালে বিজয়ী ঘোষিত হবেন।
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate('pawnsToWin', 4)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      currentRules.pawnsToWin === 4
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-md'
                        : 'bg-purple-900/30 text-slate-300 border-purple-800/60'
                    }`}
                  >
                    👑 Classic (৪টি গুটি)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate('pawnsToWin', 1)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      currentRules.pawnsToWin === 1
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-md'
                        : 'bg-purple-900/30 text-slate-300 border-purple-800/60'
                    }`}
                  >
                    ⚡ Quick (১টি গুটি)
                  </button>
                </div>
              </div>

              {/* Rule 10: Safe Stop Double Pawn Rule */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>নিয়ম ১০: ৮টি স্টপে ডাবল/সব গুটি নিরাপদ</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    বোর্ডের ৮টি নিরাপদ স্টার ও কালার স্টার্টিং স্টপে যেকোনো সংখ্যক ও ডাবল গুটি একসাথে থাকতে পারবে। সাধারণ ঘরে ডাবল ব্লক নিয়ন্ত্রিত।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('noSameColorOverlap')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentRules.noSameColorOverlap !== false ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                      currentRules.noSameColorOverlap !== false ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Game Speed & Turn Timer */}
              <div className="p-2.5 bg-purple-950/50 rounded-2xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>টার্ন টাইমার (Turn Timer)</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[10, 15, 30].map((t, tIdx) => (
                      <button
                        key={`rule-turn-timer-${t}-${tIdx}`}
                        type="button"
                        onClick={() => handleUpdate('turnTimerSeconds', t)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                          currentRules.turnTimerSeconds === t
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-purple-900/40 text-slate-300 border-purple-800/50'
                        }`}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. GAME MODES & ROOM TYPES */}
          {activeTab === 'modes' && (
            <div className="space-y-2.5">
              <div className="p-2 bg-purple-950/80 border border-purple-700/50 rounded-xl text-[11px] text-amber-200 font-bold text-center">
                ১. গেম মোড ও রুম টাইপ (Game Modes)
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-black text-xs">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Online Multiplayer (অনলাইন মাল্টিপ্লেয়ার)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  বিশ্বজুড়ে যেকোনো অনলাইন খেলোয়াড়ের সাথে র্যান্ডম ম্যাচে যুক্ত হওয়া। কয়েন বেট ধরে যেকোনো টাইপের রুমে জয়েন করা যায়।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Key className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Play with Friends (প্রাইভেট রুম)</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 leading-snug pl-1">
                  <p><strong className="text-white">রুম তৈরি:</strong> একজন প্লেয়ার রুম বানিয়ে একটি বিশেষ সিক্রেট কোড (Code) জেনারেট করবেন।</p>
                  <p><strong className="text-white">রুম জয়েন:</strong> অন্য বন্ধুরা 'Join' অপশনে গিয়ে সেই কোডটি বসিয়ে সরাসরি একই রুমে যুক্ত হবেন।</p>
                </div>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                  <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>VS Computer (বনাম কম্পিউটার)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  ইন্টারনেট ছাড়াই কম্পিউটারের বিরুদ্ধে অফলাইনে প্র্যাকটিস ম্যাচ খেলা।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-pink-300 font-black text-xs">
                  <Users className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Pass & Play (Local 2–4 Players)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  একটিমাত্র মোবাইলেই ২ থেকে ৪ জন বন্ধু মুখোমুখি বসে সহজে পাশ অ্যান্ড প্লে মোডে খেলতে পারেন।
                </p>
              </div>
            </div>
          )}

          {/* 2. GAMEPLAY & PAWN UNLOCKING */}
          {activeTab === 'gameplay' && (
            <div className="space-y-2.5">
              <div className="p-2 bg-purple-950/80 border border-purple-700/50 rounded-xl text-[11px] text-amber-200 font-bold text-center">
                ২. গেমপ্লে ও গুটি বের করার লজিক
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-black text-xs">
                  <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>৪টি রঙ ও গুটি বণ্টন</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  বোর্ডে লাল, সবুজ, হলুদ ও নীল—এই চার রঙের বেস (Home Yard) থাকে। প্রতিটি প্লেয়ারের ৪টি করে মোট ৪টি গুটি থাকে।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Dice6 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>গুটি বের করা (Unlocking Pawns)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  খেলা শুরু হলে ঘর/বেস থেকে গুটি বোর্ডে বের করতে ডাইসে <strong className="text-amber-300">৬ (ছক্কা)</strong> তুলতে হয়। স্ট্যান্ডার্ড মোডে ৬ আবশ্যক।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                  <RotateCw className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>গুটি চালানো (Clockwise Movement)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ডাইসে যত পয়েন্ট উঠবে, গুটি বোর্ডের ঘরের ওপর দিয়ে ঘড়ির কাঁটার দিকে (Clockwise) ঠিক তত ঘর সামনে এগোবে।
                </p>
              </div>
            </div>
          )}

          {/* 3. TURN PASSING & BONUS ROLLS */}
          {activeTab === 'turns' && (
            <div className="space-y-2.5">
              <div className="p-2 bg-purple-950/80 border border-purple-700/50 rounded-xl text-[11px] text-amber-200 font-bold text-center">
                ৩. ডাইস টার্ন ও বোনাস চালের ৩টি বিশেষ নিয়ম
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                সাধারণ চাল শেষ হলে টার্ন ঘড়ির কাঁটার দিকে পরবর্তী প্লেয়ারের কাছে চলে যায়। তবে ৩টি বিশেষ ক্ষেত্রে প্লেয়ার বোনাস চাল (Bonus Roll) পান:
              </p>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>১. ৬ (ছক্কা) উঠলে</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ৬ পড়লে গুটি চালার পর প্লেয়ার আবার ডাইস চালার অতিরিক্ত বোনাস সুযোগ পাবেন।
                </p>
                <div className="p-2 bg-rose-950/60 border border-rose-800/60 rounded-xl text-[11px] text-rose-300 flex items-start gap-1.5 mt-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">বিশেষ নিয়ম:</strong> পরপর ৩ বার ৬ উঠলে ৩য় ছক্কার পয়েন্ট বাতিল হয়ে যায় এবং চালের সুযোগ হারিয়ে টার্ন পরবর্তী প্লেয়ারের কাছে চলে যায়।</span>
                </div>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                  <Sword className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>২. বিপক্ষের গুটি কাটলে</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  বিপক্ষের গুটি থাকা ঘরে নিজের গুটি গিয়ে পড়লে বিপক্ষের গুটি কেটে যায় এবং প্লেয়ার সাথে সাথে ১টি বোনাস চাল পান।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                  <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>৩. গুটি হোমে (পাকা) পৌঁছালে</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  কোনো গুটি পুরো বোর্ড ঘুরে কেন্দ্রস্থলে (Home Zone) প্রবেশ করে সম্পূর্ণ 'পাকা' হলে প্লেয়ার ১টি বোনাস চাল পান।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-black text-xs">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>চাল মিস হওয়ার নিয়ম (Time-out)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  কোনো প্লেয়ার নির্ধারিত সময়ের (Timer) মধ্যে চাল না দিলে বা তার কোনো বৈধ চাল না থাকলে ডাইস স্বয়ংক্রিয়ভাবে পরবর্তী প্লেয়ারের কাছে চলে যাবে।
                </p>
              </div>
            </div>
          )}

          {/* 4. CAPTURING & SAFE ZONES */}
          {activeTab === 'safe' && (
            <div className="space-y-2.5">
              <div className="p-2 bg-purple-950/80 border border-purple-700/50 rounded-xl text-[11px] text-amber-200 font-bold text-center">
                ৪. গুটি কাটা ও নিরাপদ ঘর (Safe Zones)
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                  <Sword className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>গুটি কাটা (Pawn Capturing)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  কোনো সাধারণ ঘরে বিপক্ষের গুটি থাকলে এবং আপনার ডাইসের পয়েন্ট ঠিক সেই ঘরে গিয়ে মিললে বিপক্ষের গুটিটি কাটা পড়বে। কাটা পড়া গুটিটি আবার আগের স্টার্টিং ইয়ার্ডে ফেরত যাবে (সেটিকে বের করতে আবার ৬ তুলতে হবে)।
                </p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/50 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-black text-xs">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                  <span>নিরাপদ ঘর (Safe Zones)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed pl-1">
                  <li>বোর্ডে স্টার চিহ্নযুক্ত (<strong className="text-amber-300">★ Safe Spot</strong>) ঘরগুলো নিরাপদ ঘর।</li>
                  <li>প্রতিটি রঙের স্টার্টিং পয়েন্টের রঙ করা ঘরগুলো ও হোম গলি নিরাপদ ঘর।</li>
                  <li>সেফ জোনে একই সাথে একাধিক প্লেয়ারের বা একই প্লেয়ারের একাধিক গুটি বসতে পারে—এখানে কোনো গুটি কাটা যায় না।</li>
                </ul>
              </div>
            </div>
          )}

          {/* 5. WINNING & LOSING CONDITIONS */}
          {activeTab === 'winlose' && (
            <div className="space-y-2.5">
              <div className="p-2 bg-purple-950/80 border border-purple-700/50 rounded-xl text-[11px] text-amber-200 font-bold text-center">
                ৫. জয় ও পরাজয় কীভাবে নির্ধারিত হয়?
              </div>

              <div className="bg-gradient-to-r from-amber-950/80 to-yellow-950/80 p-3 rounded-2xl border border-amber-500/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>বিজয় নির্ধারণ (Winning Rule)</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  যে প্লেয়ার সবার আগে তার সব গুটি (ক্লাসিক মোডে ৪টি, কুইক মোডে ১টি) 'Home'-এ নিয়ে যেতে পারবে, সে প্রথম ও একক বিজয়ী ঘোষিত হবে।
                </p>
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>১ম জন জয়ী হওয়ার সাথে সাথেই ম্যাচ সমাপ্ত—বিজয়ী প্লেয়ার পুরো বিজয়ী প্রাইজ মানি লাভ করবেন!</span>
                </div>
              </div>

              <div className="bg-rose-950/60 p-3 rounded-2xl border border-rose-800/50 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                  <Flag className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>পরাজয় নির্ধারণ (Losing)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed pl-1">
                  <li>যে প্লেয়ার প্রথম বিজয়ী প্লেয়ারের আগে গুটি পাকা করতে পারবে না, সে পরাজিত হিসেবে গণ্য হবে।</li>
                  <li>খেলায় থাকাকালীন কোনো প্লেয়ার ম্যাচ ছেড়ে বের হয়ে গেলে (Quit/Disconnect) তাকে অটো-লস্ট (Auto Loss) ঘোষণা করা হবে।</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#070514] border-t border-purple-900/50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>নিয়ম স্বয়ংক্রিয়ভাবে সংরক্ষিত</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all text-center cursor-pointer"
          >
            ঠিক আছে
          </button>
        </div>
      </motion.div>
    </div>
  );
};


