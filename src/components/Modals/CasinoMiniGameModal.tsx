import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Coins,
  Play,
  RotateCw,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export interface MiniGameConfig {
  id: string;
  category: 'slot' | 'live_casino' | 'sports';
  title: string;
  subtitle: string;
  categoryName: string;
  badge: string;
  image: string;
  rtpOrOdds: string;
}

interface CasinoMiniGameModalProps {
  game: MiniGameConfig | null;
  onClose: () => void;
  userBalance: number;
  onUpdateBalance?: (newBalance: number) => void;
  onNavigateAddMoney: () => void;
}

const BET_AMOUNTS = [10, 20, 50, 100, 200, 500];

const SLOT_SYMBOLS = ['7️⃣', '🍒', '💎', '👑', '⭐', '🔔', '🍇', '🍋'];

export const CasinoMiniGameModal: React.FC<CasinoMiniGameModalProps> = ({
  game,
  onClose,
  userBalance,
  onUpdateBalance,
  onNavigateAddMoney,
}) => {
  if (!game) return null;

  const [selectedBet, setSelectedBet] = useState<number>(20);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [gameResultNote, setGameResultNote] = useState<string | null>(null);

  // Slot specific reels
  const [slotReels, setSlotReels] = useState<string[]>(['7️⃣', '7️⃣', '7️⃣']);

  // Casino specific result
  const [selectedCasinoChoice, setSelectedCasinoChoice] = useState<'red' | 'black'>('red');
  const [casinoCardResult, setCasinoCardResult] = useState<string | null>(null);

  // Sports specific choice
  const [selectedSportsTeam, setSelectedSportsTeam] = useState<'teamA' | 'teamB'>('teamA');
  const [sportsMatchResult, setSportsMatchResult] = useState<string | null>(null);

  const handlePlayGame = () => {
    if (isPlaying) return;

    if (userBalance < selectedBet) {
      alert(`আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! ন্যূনতম ৳${selectedBet} প্রয়োজন। অনুগ্রহ করে টাকা যোগ করুন।`);
      onNavigateAddMoney();
      return;
    }

    setIsPlaying(true);
    setLastWin(null);
    setGameResultNote(null);

    // Deduct bet amount
    const balanceAfterBet = Math.max(0, userBalance - selectedBet);
    if (onUpdateBalance) {
      onUpdateBalance(balanceAfterBet);
    }

    try {
      sounds.playDiceRoll();
    } catch {}

    if (game.category === 'slot') {
      // Animate reels spinning
      let spins = 0;
      const interval = setInterval(() => {
        setSlotReels([
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ]);
        spins++;
        if (spins > 12) {
          clearInterval(interval);
          finalizeSlot();
        }
      }, 100);

      const finalizeSlot = () => {
        // Random outcome with 45% win chance
        const isWin = Math.random() < 0.45;
        let finalReels: string[];
        let multiplier = 0;

        if (isWin) {
          const isJackpot = Math.random() < 0.15;
          if (isJackpot) {
            finalReels = ['7️⃣', '7️⃣', '7️⃣'];
            multiplier = 10;
          } else {
            const sym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
            finalReels = [sym, sym, SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]];
            multiplier = 2.5;
          }
        } else {
          finalReels = [
            SLOT_SYMBOLS[0],
            SLOT_SYMBOLS[1],
            SLOT_SYMBOLS[2],
          ];
          multiplier = 0;
        }

        setSlotReels(finalReels);
        finishOutcome(multiplier, balanceAfterBet);
      };
    } else if (game.category === 'live_casino') {
      setTimeout(() => {
        const isWin = Math.random() < 0.48;
        const color = Math.random() < 0.5 ? 'red' : 'black';
        setCasinoCardResult(color === 'red' ? '🔴 লাল (Red Number 7)' : '⚫ কালো (Black Number 14)');

        const multiplier = (color === selectedCasinoChoice) ? 2 : 0;
        finishOutcome(multiplier, balanceAfterBet);
      }, 1500);
    } else {
      // Sports prediction
      setTimeout(() => {
        const teamAWon = Math.random() < 0.5;
        setSportsMatchResult(teamAWon ? 'দল ক (Team A) জয়ী হয়েছে!' : 'দল খ (Team B) জয়ী হয়েছে!');
        const win = (selectedSportsTeam === 'teamA' && teamAWon) || (selectedSportsTeam === 'teamB' && !teamAWon);
        const multiplier = win ? 1.95 : 0;
        finishOutcome(multiplier, balanceAfterBet);
      }, 1500);
    }
  };

  const finishOutcome = (multiplier: number, currentBalance: number) => {
    setIsPlaying(false);
    if (multiplier > 0) {
      const winAmount = Math.round(selectedBet * multiplier);
      const newBal = currentBalance + winAmount;
      if (onUpdateBalance) {
        onUpdateBalance(newBal);
      }
      setLastWin(winAmount);
      setGameResultNote(`অভিনন্দন! আপনি ৳${winAmount} জিতেছেন (${multiplier}x)!`);
      try {
        sounds.playWinSound();
      } catch {}
    } else {
      setLastWin(0);
      setGameResultNote('দুঃখিত! এবার কোনো পুরস্কার মেলেনি। আবার চেষ্টা করুন!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#180e3a] to-[#0c0621] border-2 border-amber-400/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Artwork Banner */}
        <div className="relative h-32 w-full overflow-hidden shrink-0 border-b border-purple-800/60">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#180e3a] via-[#180e3a]/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Info */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold shadow">
                {game.categoryName}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white drop-shadow mt-1">
                {game.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-300 font-bold block">{game.rtpOrOdds}</span>
              <span className="text-[9px] text-purple-200 block">{game.badge}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* User Balance Display */}
          <div className="flex items-center justify-between bg-[#04260f] p-2.5 rounded-2xl border border-purple-700/50">
            <span className="text-xs text-purple-200 font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              আপনার বর্তমান ব্যালেন্স:
            </span>
            <span className="text-sm font-black font-mono text-amber-400">
              ৳{userBalance.toFixed(2)}
            </span>
          </div>

          {/* Interactive Game Play Area */}
          {game.category === 'slot' && (
            <div className="bg-[#0b051e] p-4 rounded-3xl border-2 border-amber-400/40 shadow-inner text-center space-y-3">
              <div className="text-[11px] font-bold text-amber-300">
                🎰 ৩-রিল লাকি জ্যাকপট স্পিনার
              </div>

              {/* Reels Display */}
              <div className="grid grid-cols-3 gap-2 bg-[#170c38] p-3 rounded-2xl border border-purple-700/60 shadow-lg">
                {slotReels.map((sym, idx) => (
                  <div
                    key={idx}
                    className={`h-16 rounded-xl bg-slate-900/90 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-inner ${
                      isPlaying ? 'animate-bounce' : ''
                    }`}
                  >
                    <span>{sym}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-purple-300">
                ৩টি মিললে ১০x জ্যাকপট • ২টি মিললে ২.৫x প্রাইজ
              </p>
            </div>
          )}

          {game.category === 'live_casino' && (
            <div className="bg-[#0b051e] p-4 rounded-3xl border-2 border-purple-600/50 shadow-inner text-center space-y-3">
              <div className="text-[11px] font-bold text-cyan-300">
                🎲 লাইভ ডিলার চয়েস নির্বাচন করুন
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCasinoChoice('red')}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                    selectedCasinoChoice === 'red'
                      ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400'
                      : 'bg-red-950/60 border border-red-700/50 text-red-200'
                  }`}
                >
                  <span>🔴 লাল (Red) - ২x</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCasinoChoice('black')}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                    selectedCasinoChoice === 'black'
                      ? 'bg-slate-800 text-white shadow-lg ring-2 ring-purple-400'
                      : 'bg-slate-900 border border-slate-700/50 text-slate-300'
                  }`}
                >
                  <span>⚫ কালো (Black) - ২x</span>
                </button>
              </div>

              {casinoCardResult && (
                <div className="text-xs font-bold text-amber-300 bg-[#170c38] p-2 rounded-xl border border-purple-700">
                  ফলাফল: {casinoCardResult}
                </div>
              )}
            </div>
          )}

          {game.category === 'sports' && (
            <div className="bg-[#0b051e] p-4 rounded-3xl border-2 border-emerald-600/50 shadow-inner text-center space-y-3">
              <div className="text-[11px] font-bold text-emerald-300">
                ⚽ লাইভ স্পোর্টস প্রেডিকশন দল নির্বাচন করুন
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedSportsTeam('teamA')}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                    selectedSportsTeam === 'teamA'
                      ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                      : 'bg-emerald-950/60 border border-emerald-700/50 text-emerald-200'
                  }`}
                >
                  <span>🏏 দল ক (১.৯৫x)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSportsTeam('teamB')}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                    selectedSportsTeam === 'teamB'
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-blue-950/60 border border-blue-700/50 text-blue-200'
                  }`}
                >
                  <span>⚽ দল খ (১.৯৫x)</span>
                </button>
              </div>

              {sportsMatchResult && (
                <div className="text-xs font-bold text-amber-300 bg-[#170c38] p-2 rounded-xl border border-purple-700">
                  {sportsMatchResult}
                </div>
              )}
            </div>
          )}

          {/* Outcome Notice */}
          {gameResultNote && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold text-center border animate-in zoom-in-95 duration-200 ${
                lastWin && lastWin > 0
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400'
                  : 'bg-rose-950/90 text-rose-300 border-rose-500'
              }`}
            >
              {gameResultNote}
            </div>
          )}

          {/* Bet Amount Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-purple-200 block">
              বেট / এন্ট্রি ফি নির্বাচন করুন:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {BET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  disabled={isPlaying}
                  onClick={() => setSelectedBet(amt)}
                  className={`py-2 rounded-xl font-mono text-xs font-black transition cursor-pointer ${
                    selectedBet === amt
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-700/50'
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#100729] border-t border-purple-800/60 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs transition cursor-pointer"
          >
            বন্ধ করুন
          </button>

          <button
            type="button"
            onClick={handlePlayGame}
            disabled={isPlaying}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>প্লে হচ্ছে...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {game.category === 'slot'
                    ? `স্পিন করুন (৳${selectedBet})`
                    : game.category === 'live_casino'
                    ? `ডিল করুন (৳${selectedBet})`
                    : `বেট প্লেস করুন (৳${selectedBet})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
