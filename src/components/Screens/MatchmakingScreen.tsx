import React, { useEffect, useState } from 'react';
import { Loader2, Users, Crown, ShieldCheck, X, Copy, Check, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchmakingScreenProps {
  onMatchFound: (count?: 2 | 4) => void;
  onCancel: () => void;
  initialPlayersCount?: 2 | 4;
  activeRoomCode?: string;
}

export const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({
  onMatchFound,
  onCancel,
  initialPlayersCount = 2,
  activeRoomCode,
}) => {
  const [dots, setDots] = useState('');
  const [playersCount, setPlayersCount] = useState<2 | 4>(initialPlayersCount);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!activeRoomCode) return;
    navigator.clipboard.writeText(activeRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    const timer = setTimeout(() => {
      onMatchFound(playersCount);
    }, 3500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [onMatchFound, playersCount]);

  return (
    <div
      className="min-h-full text-white flex flex-col items-center justify-between p-6 select-none relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex justify-between items-center z-10">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fair Play Matchmaking</span>
        </span>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-purple-900/40 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Radar Searching Animation */}
      <div className="flex flex-col items-center z-10 my-auto space-y-6">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Rings */}
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-44 h-44 rounded-full border-2 border-purple-500/40 bg-purple-600/10"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute w-32 h-32 rounded-full border-2 border-amber-400/40"
          />

          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 border-2 border-amber-400 shadow-2xl flex items-center justify-center z-10">
            <Crown className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold text-white">
            Finding Opponent{dots}
          </h2>
          <p className="text-xs text-purple-300 max-w-xs">
            Connecting you to active online players for {playersCount === 2 ? '2-Player (1 vs 1)' : '4-Player'} match.
          </p>
        </div>

        {/* Join Code Display Card for Friend Matches */}
        {activeRoomCode && (
          <div className="bg-[#170e38] border-2 border-amber-400/80 p-3.5 rounded-2xl flex flex-col items-center gap-2 w-full max-w-xs shadow-xl relative z-10">
            <span className="text-[11px] font-black text-amber-300 tracking-wide uppercase flex items-center gap-1">
              <span>🔑 ফ্রেন্ড জয়েন কোড (Room Join Code):</span>
            </span>
            <div className="flex items-center gap-2 w-full justify-center">
              <span className="font-mono font-black text-xl text-amber-300 tracking-widest bg-[#0b061e] px-4 py-1.5 rounded-xl border border-purple-600/80 shadow-inner">
                #{activeRoomCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow active:scale-95 transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </button>
            </div>
            <p className="text-[10px] text-purple-200 text-center leading-tight">
              ফ্রেন্ডকে এই কোডটি পাঠিয়ে অ্যাপের <strong>'জয়েন কোড (Join Code)'</strong> অপশনে প্রবেশ করতে বলুন।
            </p>
          </div>
        )}

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#04260f] p-1.5 rounded-2xl border border-purple-700/60 z-10 shadow-lg">
          <button
            type="button"
            onClick={() => setPlayersCount(2)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              playersCount === 2
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Players (2/2)</span>
          </button>
          <button
            type="button"
            onClick={() => setPlayersCount(4)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              playersCount === 4
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4 Players (4/4)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/60 px-4 py-2 rounded-full border border-purple-800/60 text-xs font-mono text-amber-300">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Searching Servers ({playersCount} Players)...</span>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="w-full z-10">
        <button
          onClick={onCancel}
          className="w-full py-3 bg-purple-900/40 border border-purple-700/50 hover:bg-purple-800/60 text-slate-300 font-bold text-xs rounded-xl"
        >
          Cancel Matchmaking
        </button>
      </div>
    </div>
  );
};
