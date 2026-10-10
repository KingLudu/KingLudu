import React, { useState } from 'react';
import {
  Gamepad2,
  Disc,
  Layers,
  AlertOctagon,
  Server,
  FolderKanban,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Zap,
  Swords,
  Users,
  Trophy,
  Flame,
  Radio,
  ExternalLink,
  DollarSign,
  Filter,
  Plus,
  X,
  Edit2,
  Crown,
  Sliders,
  Settings2,
} from 'lucide-react';
import {
  GameItem,
  GameErrorLog,
  GameCategory,
  GameProvider,
} from '../../types/adminProgramTypes';
import { ScreenType } from '../../types';
import {
  INITIAL_GAMES_V1,
  INITIAL_GAMES_V2,
  INITIAL_GAME_ERRORS,
  INITIAL_CATEGORIES,
  INITIAL_PROVIDERS_V1,
  INITIAL_PROVIDERS_V2,
} from '../../data/adminProgramsData';
import { SpinnerWheelConfigView } from './SpinnerWheelConfigView';

interface GameSystemViewProps {
  subTab?:
    | 'spinner'
    | 'games_v1'
    | 'games_v2'
    | 'game_errors'
    | 'categories'
    | 'providers_v1'
    | 'providers_v2';
  onSubTabChange?: (tab: any) => void;
  onRefundUser?: (phone: string, amount: number) => void;
  onNavigate?: (screen: ScreenType) => void;
}

export const GameSystemView: React.FC<GameSystemViewProps> = ({
  subTab: externalSubTab,
  onSubTabChange,
  onRefundUser,
  onNavigate,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<
    | 'spinner'
    | 'games_v1'
    | 'games_v2'
    | 'game_errors'
    | 'categories'
    | 'providers_v1'
    | 'providers_v2'
  >('games_v1');

  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: any) => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [gamesV1, setGamesV1] = useState<GameItem[]>(INITIAL_GAMES_V1);
  const [gamesV2, setGamesV2] = useState<GameItem[]>(INITIAL_GAMES_V2);
  const [gameErrors, setGameErrors] = useState<GameErrorLog[]>(INITIAL_GAME_ERRORS);
  const [categories, setCategories] = useState<GameCategory[]>(INITIAL_CATEGORIES);
  const [providersV1] = useState<GameProvider[]>(INITIAL_PROVIDERS_V1);
  const [providersV2] = useState<GameProvider[]>(INITIAL_PROVIDERS_V2);

  // Category filter state for games tabs
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kingludo'>('all');

  // Add game modal state
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameForm, setNewGameForm] = useState({
    title: '',
    category: 'kingludo' as 'kingludo',
    version: 'v1' as 'v1' | 'v2',
    provider: 'KingLudo Native Board Engine',
    type: '2 Player' as '2 Player' | '4 Player' | 'Tournament' | 'Speed',
    minBet: 20,
    maxBet: 10000,
    commissionPercent: 5,
  });

  // Category edit state
  const [editingCategory, setEditingCategory] = useState<GameCategory | null>(null);

  const [errorStatusFilter, setErrorStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'refunded'>('all');

  const handleResolveError = (errorId: string) => {
    setGameErrors((prev) =>
      prev.map((err) => (err.id === errorId ? { ...err, status: 'resolved' } : err))
    );
  };

  const handleRefundError = (err: GameErrorLog) => {
    const refund = err.refundAmount || 50;
    if (onRefundUser && err.userPhone) {
      onRefundUser(err.userPhone, refund);
    }
    setGameErrors((prev) =>
      prev.map((e) => (e.id === err.id ? { ...e, status: 'refunded' } : e))
    );
    alert(`ইউজার ${err.userName} (${err.userPhone}) কে ৳${refund} রিফান্ড প্রদান করা হয়েছে!`);
  };

  const handleToggleGameStatus = (gameId: string, version: 'v1' | 'v2') => {
    const updater = (prev: GameItem[]) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        const nextStatus = g.status === 'online' ? 'maintenance' : 'online';
        return { ...g, status: nextStatus };
      });
    if (version === 'v1') setGamesV1(updater);
    else setGamesV2(updater);
  };

  const handleToggleCategoryActive = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, active: !c.active } : c))
    );
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? editingCategory : c))
    );
    setEditingCategory(null);
  };

  const handleCreateNewGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameForm.title.trim()) return;

    const newGame: GameItem = {
      id: `game_${Date.now()}`,
      version: newGameForm.version,
      title: newGameForm.title.trim(),
      category: newGameForm.category,
      provider: newGameForm.provider,
      type: newGameForm.type,
      minBet: Number(newGameForm.minBet) || 20,
      maxBet: Number(newGameForm.maxBet) || 10000,
      commissionPercent: Number(newGameForm.commissionPercent) || 5,
      status: 'online',
      playersOnline: Math.floor(Math.random() * 400) + 100,
      icon: newGameForm.category === 'kingludo' ? 'Crown' : newGameForm.category === 'slot' ? 'Sparkles' : newGameForm.category === 'live_casino' ? 'Layers' : 'Trophy',
    };

    if (newGameForm.version === 'v1') {
      setGamesV1((prev) => [newGame, ...prev]);
    } else {
      setGamesV2((prev) => [newGame, ...prev]);
    }

    // Update categories count
    setCategories((prev) =>
      prev.map((c) => (c.id === newGameForm.category ? { ...c, gamesCount: (c.gamesCount || 0) + 1 } : c))
    );

    setShowAddGameModal(false);
    setNewGameForm({
      title: '',
      category: 'slot',
      version: 'v1',
      provider: 'Vegas Royale Engine',
      type: 'Speed',
      minBet: 20,
      maxBet: 10000,
      commissionPercent: 5,
    });
  };

  const pendingErrorsCount = gameErrors.filter((e) => e.status === 'pending').length;

  const filteredErrors = gameErrors.filter((e) => {
    if (errorStatusFilter !== 'all' && e.status !== errorStatusFilter) return false;
    return true;
  });

  const getFilteredGames = (gamesList: GameItem[]) => {
    if (categoryFilter === 'all') return gamesList;
    return gamesList.filter((g) => g.category === categoryFilter);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Gamepad2 className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Game System (গেম সিস্টেম ইঞ্জিন)</h2>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                কোর আর্কিটেকচার
              </span>
            </div>
            <p className="text-xs text-purple-200">
              লুডো গেমস (V1 ও V2), লাইভ এরর সমাধান, ক্যাটাগরি ও সার্ভার প্রোভাইডার কনফিগারেশন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#031e0c]/80 px-3 py-2 rounded-xl border border-purple-800/60 text-xs">
          <span className="text-purple-300">পেন্ডিং এরর:</span>
          <span className="font-mono font-black text-rose-400">{pendingErrorsCount} টি</span>
        </div>
      </div>

      {/* Sub Navigation Bar matching user requirements */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('spinner')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'spinner'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>Spinner / Wheel Config</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('games_v1')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'games_v1'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Games (V1)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('games_v2')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'games_v2'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Games (V2)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('game_errors')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'game_errors'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Game Errors</span>
          <span className="bg-rose-500 text-white font-mono px-1.5 py-0.2 rounded-full text-[10px] font-black">
            15
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('categories')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'categories'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Categories</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('providers_v1')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'providers_v1'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Providers (V1)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('providers_v2')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
            activeSubTab === 'providers_v2'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Providers (V2)</span>
        </button>
      </div>

      {/* View SubTab 1: Spinner */}
      {activeSubTab === 'spinner' && <SpinnerWheelConfigView />}

      {/* View SubTab 2 & 3: Games V1 / V2 */}
      {(activeSubTab === 'games_v1' || activeSubTab === 'games_v2') && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>
                  {activeSubTab === 'games_v1' ? 'KingLudu Core Games (V1)' : 'Advanced Multiplayer Games (V2)'}
                </span>
              </h3>
              <p className="text-[11px] text-purple-300">
                লুডো, স্লট, লাইভ ক্যাসিনো ও স্পোর্টস বেটিং ইঞ্জিন কনফিগারেশন
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewGameForm((prev) => ({
                  ...prev,
                  version: activeSubTab === 'games_v1' ? 'v1' : 'v2',
                }));
                setShowAddGameModal(true);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>নতুন গেম যুক্ত করুন</span>
            </button>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs bg-[#0b061d] p-1.5 rounded-xl border border-purple-900/60">
            <span className="text-[10px] text-purple-400 font-bold px-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-purple-400" />
              ক্যাটাগরি ফিল্টার:
            </span>
            {[
              { id: 'all', label: 'সব লুডো গেমস', icon: Gamepad2, color: 'text-white' },
              { id: 'kingludo', label: '👑 কিং লুডো (King Ludo)', icon: Crown, color: 'text-amber-400' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-[#052a12] text-purple-200 hover:text-white hover:bg-purple-900/60 border border-purple-800/40'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Filtered Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {getFilteredGames(activeSubTab === 'games_v1' ? gamesV1 : gamesV2).map((game) => (
              <div
                key={game.id}
                className="bg-slate-900/80 p-4 rounded-2xl border border-purple-800/40 space-y-3 hover:border-amber-400/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white">{game.title}</h4>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {game.category === 'kingludo'
                        ? 'kindlud (কিং লুডো)'
                        : game.category === 'slot'
                        ? 'Slot (স্লট)'
                        : game.category === 'live_casino'
                        ? 'Live Casino (ক্যাসিনো)'
                        : 'Sports (স্পোর্টস)'}{' '}
                      • {game.provider}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      game.status === 'online'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                    }`}
                  >
                    {game.status === 'online' ? 'অনলাইন' : 'রক্ষণাবেক্ষণ'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#031e0c] p-2.5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-[10px] text-purple-400 block">বেট রেঞ্জ:</span>
                    <span className="font-mono text-white">৳{game.minBet} - ৳{game.maxBet}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block">হাউস কমিশন:</span>
                    <span className="font-mono text-amber-300 font-bold">{game.commissionPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block">লাইভ প্লেয়ার:</span>
                    <span className="font-mono text-emerald-400 font-bold">{game.playersOnline} জন</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 block">মোড টাইপ:</span>
                    <span className="text-cyan-300">{game.type}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-900/50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleGameStatus(game.id, activeSubTab === 'games_v1' ? 'v1' : 'v2')}
                    className="w-full py-1.5 rounded-xl text-xs font-bold bg-purple-900/60 hover:bg-purple-800 text-purple-200 transition cursor-pointer"
                  >
                    {game.status === 'online' ? 'মেইনটেন্যান্সে নিন' : 'অনলাইন চালু করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {getFilteredGames(activeSubTab === 'games_v1' ? gamesV1 : gamesV2).length === 0 && (
            <div className="text-center py-10 bg-[#031e0c] rounded-2xl border border-purple-800/40 text-purple-300">
              <Gamepad2 className="w-10 h-10 text-purple-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold">এই ক্যাটাগরিতে কোনো গেম খুঁজে পাওয়া যায়নি।</p>
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className="mt-2 text-xs text-amber-400 underline font-semibold"
              >
                সব গেমস দেখুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* View SubTab 4: Game Errors 15 */}
      {activeSubTab === 'game_errors' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>গেম এরর ও ডিসকানেকশন লগ (১৫ টি রেকর্ড সংরক্ষিত)</span>
              </h3>
              <p className="text-[11px] text-purple-300">
                ম্যাচ ড্রপ, সকেট ডিসকানেক্ট ও রিফান্ড ম্যানেজমেন্ট প্যানেল
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['all', 'pending', 'resolved', 'refunded'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setErrorStatusFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    errorStatusFilter === f
                      ? 'bg-rose-500 text-white font-black shadow'
                      : 'bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                  }`}
                >
                  {f === 'all' ? 'সব' : f === 'pending' ? 'পেন্ডিং' : f === 'resolved' ? 'সমাধানকৃত' : 'রিফান্ডেড'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredErrors.map((err) => (
              <div
                key={err.id}
                className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40 space-y-2 hover:border-purple-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">{err.roomCode}</span>
                    <span className="text-white text-xs font-black">{err.gameName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        err.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-600'
                          : err.severity === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600'
                          : 'bg-blue-950 text-blue-300'
                      }`}
                    >
                      {err.severity}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      err.status === 'pending'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : err.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {err.status === 'pending' ? 'অমীমাংসিত' : err.status === 'resolved' ? 'সমাধানকৃত' : 'রিফান্ডেড'}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2 text-purple-300 font-mono text-[11px]">
                    <span>ইউজার: <strong className="text-white">{err.userName}</strong> ({err.userPhone})</span>
                    <span>•</span>
                    <span className="text-slate-400">{err.time}</span>
                  </div>
                  <p className="text-[11px] text-rose-200 bg-[#031e0c] p-2 rounded-lg border border-purple-900/40">
                    <span className="font-mono font-bold text-amber-300">[{err.errorCode}]</span> {err.errorDescription}
                  </p>
                </div>

                {err.status === 'pending' && (
                  <div className="flex gap-2 pt-1 border-t border-purple-900/50">
                    {err.refundAmount && (
                      <button
                        type="button"
                        onClick={() => handleRefundError(err)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>রিফান্ড দিন (৳{err.refundAmount})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleResolveError(err.id)}
                      className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>রিসল্ভ মার্ক করুন</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View SubTab 5: Categories */}
      {activeSubTab === 'categories' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
                <span>অফিসিয়াল গেমিং ক্যাটাগরি (King Ludo Engine)</span>
              </h3>
              <p className="text-[11px] text-purple-300">
                কিং লুডো গেমিং ইঞ্জিন, কমিশন ও লাইভ নিয়ন্ত্রণ (Slot, Casino ও Sports অপশনসমূহ অপসারিত)
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewGameForm((prev) => ({ ...prev, version: 'v1' }));
                setShowAddGameModal(true);
              }}
              className="px-3 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন গেম অ্যাড করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const isLudo = cat.id === 'kingludo' || cat.code === 'kindlud';
              const isSlot = cat.id === 'slot';
              const isCasino = cat.id === 'live_casino';
              const isSports = cat.id === 'sports';

              return (
                <div
                  key={cat.id}
                  className={`bg-slate-900/90 p-4 rounded-2xl border transition space-y-3.5 relative overflow-hidden ${
                    cat.active
                      ? 'border-purple-800/60 shadow-lg'
                      : 'border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-md ${
                          isLudo
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isSlot
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : isCasino
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {isLudo && <Crown className="w-5 h-5 text-amber-400" />}
                        {isSlot && <Sparkles className="w-5 h-5 text-cyan-400" />}
                        {isCasino && <Layers className="w-5 h-5 text-emerald-400" />}
                        {isSports && <Trophy className="w-5 h-5 text-rose-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{cat.nameBn}</h4>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/50 text-amber-300 font-bold">
                            {cat.code || cat.id}
                          </span>
                        </div>
                        <span className="text-[11px] text-purple-300">{cat.name}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCategoryActive(cat.id)}
                      className={`px-2.5 py-1 text-[10px] font-black rounded-full border transition cursor-pointer ${
                        cat.active
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60'
                          : 'bg-rose-950 text-rose-300 border-rose-600/60'
                      }`}
                    >
                      {cat.active ? '● সক্রিয়' : '○ বন্ধ'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#031e0c] p-2.5 rounded-xl text-[11px]">
                    <div>
                      <span className="text-[10px] text-purple-400 block">কমিশন ফি:</span>
                      <span className="font-mono text-amber-300 font-black">{cat.commissionPercent || 5}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 block">বেট রেঞ্জ:</span>
                      <span className="font-mono text-white font-bold">
                        ৳{cat.minBet || 10} - ৳{cat.maxBet || 10000}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 block">সংযুক্ত গেমস:</span>
                      <span className="font-mono text-cyan-300 font-bold">{cat.gamesCount || 4} টি</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 block">লাইভ প্লেয়ার:</span>
                      <span className="font-mono text-emerald-400 font-bold">{cat.playersCount || 500}+ জন</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat.id as any);
                        handleSetSubTab('games_v1');
                      }}
                      className="text-xs text-purple-300 hover:text-amber-300 underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>গেমস দেখুন ({cat.gamesCount || 4})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('home')}
                          className="px-2.5 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl text-xs font-bold border border-amber-400/40 flex items-center gap-1 cursor-pointer transition"
                          title="হোম পেজে টেস্ট করুন"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>হোম টেস্ট</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        className="px-3 py-1.5 bg-[#170e3d] hover:bg-purple-900/80 text-white rounded-xl text-xs font-bold border border-purple-700/50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>ক্যাটাগরি কনফিগ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View SubTab 6 & 7: Providers V1 / V2 */}
      {(activeSubTab === 'providers_v1' || activeSubTab === 'providers_v2') && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>
                {activeSubTab === 'providers_v1' ? 'Game Providers & Engine (V1)' : 'Cloud Cluster Providers (V2)'}
              </span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>সার্ভার ক্লাস্টার সচল</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(activeSubTab === 'providers_v1' ? providersV1 : providersV2).map((pr) => (
              <div key={pr.id} className="bg-slate-900/80 p-4 rounded-2xl border border-purple-800/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white">{pr.name}</h4>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold rounded-full">
                    {pr.status}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-purple-400 truncate">{pr.endpoint}</p>

                <div className="grid grid-cols-3 gap-2 bg-[#031e0c] p-2 rounded-xl text-[11px] text-center">
                  <div>
                    <span className="text-[9px] text-purple-400 block">লেটেন্সি</span>
                    <span className="font-mono text-emerald-400 font-bold">{pr.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-purple-400 block">আপটাইম</span>
                    <span className="font-mono text-amber-400 font-bold">{pr.uptime}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-purple-400 block">ম্যাচ রানিং</span>
                    <span className="font-mono text-cyan-300 font-bold">{pr.activeMatches}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW GAME ================= */}
      {showAddGameModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#140b33] border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">নতুন গেম তৈরি করুন (Add New Game)</h4>
                  <p className="text-[10px] text-purple-300">ক্যাটাগরি নির্ধারণ করে নতুন গেম লাইভ করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGameModal(false)}
                className="p-1.5 rounded-lg bg-purple-900/60 text-purple-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewGame} className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">গেমের নাম (Title):</label>
                <input
                  type="text"
                  value={newGameForm.title}
                  onChange={(e) => setNewGameForm({ ...newGameForm, title: e.target.value })}
                  placeholder="যেমন: Vegas 777 Deluxe, Speed Roulette"
                  required
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Explicit 4 Game Categories Dropdown */}
              <div>
                <label className="block text-purple-300 font-bold mb-1">
                  গেম ক্যাটাগরি (Game Category):
                </label>
                <select
                  value={newGameForm.category}
                  onChange={(e) =>
                    setNewGameForm({
                      ...newGameForm,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="kingludo">👑 কিং লুডো (kindlud / King Ludo)</option>
                  <option value="slot">🎰 স্লট (Slot)</option>
                  <option value="live_casino">🎲 লাইভ ক্যাসিনো (Live Casino)</option>
                  <option value="sports">🏆 স্পোর্টস (Sports)</option>
                </select>
                <span className="text-[10px] text-purple-400 mt-0.5 block">
                  সিস্টেমের ৪টি অফিসিয়াল ক্যাটাগরির যেকোনো একটি বাছাই করুন
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">ইঞ্জিন ভার্সন:</label>
                  <select
                    value={newGameForm.version}
                    onChange={(e) => setNewGameForm({ ...newGameForm, version: e.target.value as any })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white"
                  >
                    <option value="v1">Games V1 (Core)</option>
                    <option value="v2">Games V2 (Relay)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">কমিশন (%):</label>
                  <input
                    type="number"
                    value={newGameForm.commissionPercent}
                    onChange={(e) => setNewGameForm({ ...newGameForm, commissionPercent: Number(e.target.value) })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">মিনিমাম বেট (৳):</label>
                  <input
                    type="number"
                    value={newGameForm.minBet}
                    onChange={(e) => setNewGameForm({ ...newGameForm, minBet: Number(e.target.value) })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">ম্যাক্স বেট (৳):</label>
                  <input
                    type="number"
                    value={newGameForm.maxBet}
                    onChange={(e) => setNewGameForm({ ...newGameForm, maxBet: Number(e.target.value) })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGameModal(false)}
                  className="flex-1 py-2 bg-purple-900/60 text-purple-200 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl shadow-md"
                >
                  গেম তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CATEGORY ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#140b33] border-2 border-emerald-400/80 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">ক্যাটাগরি কনফিগারেশন</h4>
                  <p className="text-[10px] text-purple-300">{editingCategory.nameBn} ({editingCategory.code || editingCategory.id})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg bg-purple-900/60 text-purple-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">ক্যাটাগরির নাম (বাংলা):</label>
                <input
                  type="text"
                  value={editingCategory.nameBn}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">কমিশন হার (%):</label>
                  <input
                    type="number"
                    value={editingCategory.commissionPercent || 5}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        commissionPercent: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">স্ট্যাটাস:</label>
                  <select
                    value={editingCategory.active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        active: e.target.value === 'active',
                      })
                    }
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="inactive">বন্ধ (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">মিনিমাম বেট (৳):</label>
                  <input
                    type="number"
                    value={editingCategory.minBet || 10}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        minBet: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">ম্যাক্সিমাম বেট (৳):</label>
                  <input
                    type="number"
                    value={editingCategory.maxBet || 25000}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        maxBet: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2 bg-purple-900/60 text-purple-200 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl shadow-md"
                >
                  পরিবর্তন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
