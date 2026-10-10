export interface PlayerLevelInfo {
  level: number;
  rankTitle: string;
  rankBadgeColor: string;
  rankBorderColor: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
  totalMatches: number;
  totalWon: number;
  winRate: number;
}

/**
 * Calculates Player Level & XP based on totalMatches played and totalWon matches.
 */
export const calculatePlayerLevel = (
  totalMatches: number = 0,
  totalWon: number = 0,
  explicitLevel?: number
): PlayerLevelInfo => {
  const matches = Math.max(0, totalMatches || 0);
  const won = Math.max(0, totalWon || 0);

  // Each match gives 15 XP, each win gives 35 bonus XP
  const xp = (matches * 15) + (won * 35);

  // Level formula: sqrt(xp / 25) + 1
  const calculatedLevel = Math.max(1, Math.floor(Math.sqrt(xp / 25)) + 1);
  const level = explicitLevel && explicitLevel > calculatedLevel ? explicitLevel : calculatedLevel;

  // Level XP thresholds
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 25;
  const nextLevelXp = Math.pow(level, 2) * 25;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpNeededForNext = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  // Rank Titles & Styling Tiers
  let rankTitle = 'Rookie Challenger';
  let rankBadgeColor = 'from-amber-600 to-amber-800 text-amber-100';
  let rankBorderColor = 'border-amber-600/60 shadow-amber-900/40';

  if (level >= 25) {
    rankTitle = 'Crown Grandmaster';
    rankBadgeColor = 'from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black';
    rankBorderColor = 'border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
  } else if (level >= 18) {
    rankTitle = 'Diamond Elite';
    rankBadgeColor = 'from-cyan-400 via-sky-500 to-blue-600 text-white font-black';
    rankBorderColor = 'border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
  } else if (level >= 12) {
    rankTitle = 'Platinum Master';
    rankBadgeColor = 'from-teal-300 via-emerald-400 to-teal-600 text-slate-950 font-black';
    rankBorderColor = 'border-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.4)]';
  } else if (level >= 7) {
    rankTitle = 'Gold Champion';
    rankBadgeColor = 'from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black';
    rankBorderColor = 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]';
  } else if (level >= 4) {
    rankTitle = 'Silver Striker';
    rankBadgeColor = 'from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black';
    rankBorderColor = 'border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.3)]';
  } else if (level >= 2) {
    rankTitle = 'Bronze Warrior';
    rankBadgeColor = 'from-amber-700 via-amber-800 to-yellow-900 text-amber-100 font-extrabold';
    rankBorderColor = 'border-amber-600 shadow-[0_0_10px_rgba(180,83,9,0.3)]';
  }

  const winRate = matches > 0 ? Math.round((won / matches) * 100) : 0;

  return {
    level,
    rankTitle,
    rankBadgeColor,
    rankBorderColor,
    currentXp: xp,
    nextLevelXp,
    progressPercent,
    totalMatches: matches,
    totalWon: won,
    winRate
  };
};
