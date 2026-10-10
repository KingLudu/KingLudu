import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatchHistoryItem, UserProfile } from '../../types';

interface LatestWinnersTickerProps {
  matchHistory?: MatchHistoryItem[];
  user?: UserProfile;
}

interface WinnerRecord {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  timeAgo: string;
  mode: string;
  isUser?: boolean;
}

const banglaFirstNames = [
  'Shakib', 'Rahat', 'Abir', 'Hasan', 'Mahmud', 'Robin', 'Mehedi', 'Arif', 'Sumon', 'Riyad',
  'Shanto', 'Liton', 'Tamim', 'Soumya', 'Mushfiq', 'Rubel', 'Taskin', 'Mustafiz', 'Naim', 'Afif',
  'Saif', 'Mosaddek', 'Shamim', 'Rishad', 'Towhid', 'Nurul', 'Parvez', 'Jaker', 'Anamul', 'Rony',
  'Al-Amin', 'Taijul', 'Mehidy', 'Tanzid', 'Tanzim', 'Nahid', 'Sohel', 'Ariful', 'Zahid', 'Imran',
  'Rayhan', 'Sohag', 'Monir', 'Mizan', 'Masud', 'Mamun', 'Ismail', 'Shahin', 'Nazmul', 'Biplob',
  'Ashraful', 'Enamul', 'Khaled', 'Nazim', 'Tarek', 'Mominul', 'Shadman', 'Saifuddin', 'Sajid',
  'Sohan', 'Zihad', 'Yeasin', 'Rashed', 'Sanjoy', 'Ripon', 'Jewel', 'Kamal', 'Mithun', 'Shahriar',
  'Sajjad', 'Redwan', 'Towfique', 'Ashik', 'Munna', 'Jubayer', 'Sabbir', 'Naimur', 'Rakib', 'Tanvir',
  'Fahim', 'Hamza', 'Habib', 'Farhan', 'Rifat', 'Nipon', 'Rana', 'Arafat', 'Shahadat', 'Kawsar',
  'Faysal', 'Siam', 'Nahian', 'Sazid', 'Shouvik', 'Rohan', 'Bappy', 'Asif', 'Nayeem', 'Tanmoy'
];

const banglaLastNames = [
  'Hossain', 'Rahman', 'Ahmed', 'Islam', 'Anjum', 'Shahriar', 'Chowdhury', 'Khan', 'Siddique', 'Mia',
  'Alam', 'Ali', 'Uddin', 'Sarkar', 'Hasan', 'Mahmud', 'Bhuiyan', 'Miah', 'Kazi'
];

const avatarImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
];

// Generate 100+ dynamic winner records
const generate100Winners = (): WinnerRecord[] => {
  const list: WinnerRecord[] = [];
  const amounts = [120, 180, 250, 360, 450, 500, 720, 900, 1200, 1500, 1800, 2500, 3200];
  const modes = ['2 Player', '4 Player', '1v1 Quick', 'Tournament'];

  for (let i = 0; i < 105; i++) {
    const fName = banglaFirstNames[i % banglaFirstNames.length];
    const lName = banglaLastNames[(i * 3) % banglaLastNames.length];
    const amt = amounts[(i * 7) % amounts.length];
    const mode = modes[(i * 2) % modes.length];
    const avatar = avatarImages[i % avatarImages.length];
    const minsAgo = (i % 58) + 1;

    list.push({
      id: `w_${i + 1}`,
      name: `${fName} ${lName}`,
      avatar,
      amount: amt,
      timeAgo: `${minsAgo} মি. আগে`,
      mode,
    });
  }
  return list;
};

const defaultPlatformWinners: WinnerRecord[] = generate100Winners();

export const LatestWinnersTicker: React.FC<LatestWinnersTickerProps> = ({ matchHistory = [], user }) => {
  const [winnersList, setWinnersList] = useState<WinnerRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Combine real user match history won items with default winners
    const safeHistory = Array.isArray(matchHistory) ? matchHistory : [];
    const userWins: WinnerRecord[] = safeHistory
      .filter((m) => m && m.status === 'won' && m.prizeWon > 0)
      .map((m) => ({
        id: m.id,
        name: user?.name || 'আপনি (You)',
        avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        amount: m.prizeWon,
        timeAgo: m.time || 'Today',
        mode: m.entryFee > 50 ? '4 Player' : '2 Player',
        isUser: true,
      }));

    const combined = [...userWins, ...defaultPlatformWinners];
    setWinnersList(combined);
  }, [matchHistory, user]);

  const safeWinnersList = Array.isArray(winnersList) ? winnersList : [];

  // Cycle spotlight winner every 5.5s for relaxed viewing
  useEffect(() => {
    if (safeWinnersList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeWinnersList.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [safeWinnersList.length]);

  if (safeWinnersList.length === 0) return null;

  const currentWinner = safeWinnersList[currentIndex] || safeWinnersList[0];

  return (
    <div className="bg-gradient-to-r from-[#170a3c] via-[#1f0f4e] to-[#170a3c] rounded-2xl border border-amber-500/40 p-3 shadow-xl relative overflow-hidden space-y-2">
      {/* Background Subtle Glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Ticker Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-amber-300 tracking-tight flex items-center gap-1">
            <span>সাম্প্রতিক বিজয়ী (Latest Winners)</span>
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-300 uppercase">Live Outcome</span>
        </div>
      </div>

      {/* Animated Spotlight Card */}
      <div className="bg-[#110729]/90 rounded-xl p-2.5 border border-purple-700/50 shadow-inner relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`spotlight-winner-${currentWinner?.id || 'winner'}-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              {/* Winner Avatar with Crown/Golden Ring */}
              <div className="relative">
                <img
                  src={currentWinner.avatar}
                  alt={currentWinner.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Name & Match details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white truncate max-w-[120px]">
                    {currentWinner.name}
                  </span>
                  {currentWinner.isUser && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-purple-300">
                  <span className="font-medium text-amber-200/90">{currentWinner.mode}</span>
                  <span>•</span>
                  <span>{currentWinner.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Winning Amount Pill */}
            <div className="text-right">
              <span className="text-[10px] uppercase text-emerald-400/80 font-extrabold tracking-wider block">
                Prize Won
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                +৳{currentWinner.amount}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continuous Live Marquee Bar (Gentle & Slow Scrolling) */}
      <div className="bg-[#090317]/80 rounded-lg p-1.5 border border-purple-800/40 overflow-hidden flex items-center relative">
        <div className="overflow-hidden whitespace-nowrap w-full relative">
          <div className="animate-marquee-slow space-x-6 text-[11px] font-bold text-slate-200">
            {winnersList.slice(0, 25).map((item, idx) => (
              <span key={`winner-mq-${item.id || 'w'}-${idx}`} className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-amber-200 font-extrabold">{item.name}</span>
                <span className="text-emerald-400 font-black">৳{item.amount}</span>
                <span className="text-purple-300 text-[10px]">({item.timeAgo})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
