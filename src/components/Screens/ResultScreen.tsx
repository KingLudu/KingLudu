import React from 'react';
import { Crown, Trophy, Play, Home, Sparkles } from 'lucide-react';
import { GameResult, ScreenType } from '../../types';
import { motion } from 'motion/react';

interface ResultScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onPlayAgain, onNavigate }) => {
  return (
    <div
      className="min-h-full text-white flex flex-col justify-between p-6 select-none relative overflow-hidden text-center"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="z-10 mt-4 space-y-1">
        <h2 className="text-2xl font-black text-amber-300 uppercase tracking-widest flex items-center justify-center gap-2">
          <Crown className="w-7 h-7 text-amber-400 animate-bounce" />
          <span>{result.isUserWinner ? 'YOU WON!' : 'MATCH OVER'}</span>
        </h2>
        <p className="text-xs text-purple-300">
          {result.isUserWinner ? 'Congratulations! You beat your opponent.' : 'Better luck next time!'}
        </p>
      </div>

      {/* Winner Avatar Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-gradient-to-b from-[#241352] via-[#1c0f42] to-[#140b33] p-6 rounded-3xl border-2 border-amber-400/60 shadow-2xl space-y-4 my-auto relative"
      >
        <div className="relative inline-block mx-auto">
          <img
            src={result.winner.avatarUrl}
            alt={result.winner.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl ring-4 ring-amber-400/40"
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase shadow">
            Winner
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-lg text-white">{result.winner.name}</h3>
          <p className="text-xs text-purple-300 font-medium mt-0.5">Winner of Ludo Match</p>
        </div>

        {/* Prize Money Breakdown */}
        {result.isUserWinner && (
          <div className="bg-[#0f0923] p-4 rounded-2xl border border-purple-700/50 space-y-2 text-xs">
            <div className="flex justify-between items-center text-purple-300">
              <span>Total Prize Pool:</span>
              <span className="font-mono font-bold text-white">৳{result.totalPrize}</span>
            </div>
            <div className="flex justify-between items-center text-purple-400">
              <span>Platform Fee (20%):</span>
              <span className="font-mono">-৳{result.platformFee}</span>
            </div>
            <div className="border-t border-purple-800/80 pt-2 flex justify-between items-center text-sm font-extrabold text-amber-300">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" /> Net Added to Wallet:
              </span>
              <span className="font-mono text-lg text-emerald-400">+৳{result.netPrize}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom Actions */}
      <div className="z-10 space-y-2.5">
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:brightness-110 font-bold text-xs rounded-xl text-white shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Play Next Match</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full py-3 bg-purple-900/40 border border-purple-700/50 hover:bg-purple-800/60 font-bold text-xs rounded-xl text-slate-200 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
