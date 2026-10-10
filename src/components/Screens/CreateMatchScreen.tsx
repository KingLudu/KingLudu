import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Share2,
  MessageCircle,
  HelpCircle,
  Mic,
  MicOff,
  Check,
  Trophy,
  MapPin,
  Zap,
  Plus,
  Minus,
  Copy,
  Users,
  Play,
  Bot,
  Sparkles,
  Clock,
  RotateCcw,
  Pause,
} from 'lucide-react';
import { ScreenType, RegionCode, Room, AppSettings } from '../../types';
import { getTranslation } from '../../utils/translations';
import { GameRulesModal } from '../Modals/GameRulesModal';
import { getSavedFriends, FriendUser } from '../../utils/friends';
import { FriendsModal } from '../Modals/FriendsModal';
import { getRandomOpponents } from '../../utils/playerNames';

interface CreateMatchScreenProps {
  userBalance: number;
  user?: {
    name: string;
    avatarUrl: string;
  };
  onCreateMatch: (config: {
    playersCount: 2 | 3 | 4;
    entryFee: number;
    totalPrize: number;
    gameType: 'Classic' | 'Quick';
    gameMode: 'vs_ai' | 'pass_n_play' | 'ai_vs_ai';
    aiDifficulty: 'Easy' | 'Medium' | 'Hard';
    playWith: 'Anyone' | 'Friends';
  }) => void;
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
  initialTab?: 'create' | 'join';
  rooms?: Room[];
  onJoinRoom?: (code: string) => void;
  initialPlayersCount?: 2 | 3 | 4;
  appSettings?: AppSettings;
}

export const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({
  userBalance,
  user = { name: 'Player 1', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  onCreateMatch,
  onNavigate,
  selectedRegion = 'BN',
  initialTab = 'create',
  rooms = [],
  onJoinRoom,
  initialPlayersCount = 2,
  appSettings,
}) => {
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const t = getTranslation(selectedRegion);

  // Platform Commission bounded 5% - 20% (Default 10%)
  const commissionPercent = Math.min(20, Math.max(5, appSettings?.platformCommissionPercent ?? 10));
  const userWinPrizeRatio = (100 - commissionPercent) / 100;
  const calculateWinPrize = (fee: number, count: number) => {
    return Math.round(fee * count * userWinPrizeRatio);
  };

  // Active Tab: 'create' or 'join'
  const [activeTab, setActiveTab] = useState<'create' | 'join'>(initialTab);

  // Create Flow Steps:
  // step 1: SELECT LOBBY (Voice chat, entry fee)
  // step 2: SELECT GAME (Classic, Popular, Quick)
  // step 3: ONLINE MULTIPLAYER (Lobby with room code, host avatar, slots)
  const [createStep, setCreateStep] = useState<1 | 2 | 3>(1);

  const minMatchFee = Math.max(1, appSettings?.minMatchFee ?? appSettings?.homeGameOptions?.[0]?.minBet ?? 10);

  // Lobby Configs
  const [voiceChatEnabled, setVoiceChatEnabled] = useState(true);
  const [entryFee, setEntryFee] = useState<number>(() => minMatchFee);
  const [selectedGameMode, setSelectedGameMode] = useState<'CLASSIC' | 'POPULAR' | 'QUICK'>('CLASSIC');
  const [playersCount, setPlayersCount] = useState<2 | 3 | 4>(initialPlayersCount || 2);
  const [playMode, setPlayMode] = useState<'vs_ai' | 'pass_n_play'>('vs_ai');

  useEffect(() => {
    if (initialPlayersCount) {
      setPlayersCount(initialPlayersCount);
    }
  }, [initialPlayersCount]);

  // Generated Room Code for Step 3
  const [roomCode, setRoomCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  // Auto Bot Countdown & Settings
  const [autoBotsEnabled, setAutoBotsEnabled] = useState(true);
  const [autoTimerSeconds, setAutoTimerSeconds] = useState(8);
  const [isAutoTimerRunning, setIsAutoTimerRunning] = useState(true);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Guest slots for Step 3 (Lobby) - dynamically sized based on playersCount
  const [guestSlots, setGuestSlots] = useState<Array<{ id: string; name: string; avatarUrl: string; isBot?: boolean } | null>>([
    null
  ]);
  const [slotPickerIndex, setSlotPickerIndex] = useState<number | null>(null);
  const [showFullFriendsManager, setShowFullFriendsManager] = useState(false);

  // Synchronize guest slots count when playersCount changes
  useEffect(() => {
    const requiredSlots = playersCount === 2 ? 1 : playersCount === 3 ? 2 : 3;
    setGuestSlots((prev) => {
      const newSlots = new Array(requiredSlots).fill(null);
      for (let i = 0; i < requiredSlots; i++) {
        if (prev[i]) newSlots[i] = prev[i];
      }
      return newSlots;
    });
  }, [playersCount]);

  // Join Flow state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showBalanceWarningModal, setShowBalanceWarningModal] = useState(false);
  const [requiredFeeForModal, setRequiredFeeForModal] = useState<number>(100);

  // Auto Bot Filler Helper using 500+ unique name pool
  const getRandomBots = (count: number) => {
    const freshBots = getRandomOpponents(count);
    return freshBots.map((b, i) => ({
      id: `bot_auto_${Date.now()}_${i}_${b.id}`,
      name: b.name,
      avatarUrl: b.avatarUrl,
      isBot: true,
    }));
  };

  // Fee Adjustment Options (starting dynamically from minMatchFee)
  const feeOptions = Array.from(
    new Set([minMatchFee, 20, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000, 25000, 50000])
  )
    .filter((f) => f >= minMatchFee)
    .sort((a, b) => a - b);

  const handleDecreaseFee = () => {
    const currentIndex = feeOptions.indexOf(entryFee);
    if (currentIndex > 0) {
      setEntryFee(feeOptions[currentIndex - 1]);
    } else if (currentIndex === -1) {
      const lower = feeOptions.filter((f) => f < entryFee);
      if (lower.length > 0) {
        setEntryFee(lower[lower.length - 1]);
      } else {
        setEntryFee(feeOptions[0]);
      }
    }
  };

  const handleIncreaseFee = () => {
    const currentIndex = feeOptions.indexOf(entryFee);
    if (currentIndex >= 0 && currentIndex < feeOptions.length - 1) {
      setEntryFee(feeOptions[currentIndex + 1]);
    } else if (currentIndex === -1) {
      const higher = feeOptions.filter((f) => f > entryFee);
      if (higher.length > 0) {
        setEntryFee(higher[0]);
      } else {
        setEntryFee(feeOptions[feeOptions.length - 1]);
      }
    }
  };

  // Step 1 -> Step 2
  const handleLobbyNext = () => {
    const requiredFee = Math.max(minMatchFee, entryFee || minMatchFee);
    if (requiredFee > userBalance) {
      setRequiredFeeForModal(requiredFee);
      setShowBalanceWarningModal(true);
      return;
    }
    setCreateStep(2);
  };

  // Step 2 -> Step 3 (Creates room code & starts auto bot countdown)
  const handleCreateRoomSubmit = () => {
    const requiredFee = Math.max(minMatchFee, entryFee || minMatchFee);
    if (requiredFee > userBalance) {
      setRequiredFeeForModal(requiredFee);
      setShowBalanceWarningModal(true);
      return;
    }
    const generated = Math.floor(10000000 + Math.random() * 90000000).toString();
    setRoomCode(generated);
    setAutoTimerSeconds(8);
    setIsAutoTimerRunning(true);
    setCreateStep(3);
  };

  // Fill all empty slots with bots & start match
  const triggerAutoFillAndStart = useCallback(() => {
    const requiredFee = Math.max(minMatchFee, entryFee || minMatchFee);
    if (requiredFee > userBalance) {
      setRequiredFeeForModal(requiredFee);
      setShowBalanceWarningModal(true);
      return;
    }

    const requiredSlots = playersCount === 2 ? 1 : playersCount === 3 ? 2 : 3;
    const emptyCount = guestSlots.filter((s) => !s).length;
    const generatedBots = getRandomBots(emptyCount || 1);

    let botIdx = 0;
    const filledSlots = guestSlots.slice(0, requiredSlots).map((slot) => {
      if (!slot) {
        const bot = generatedBots[botIdx++];
        return bot;
      }
      return slot;
    });

    setGuestSlots(filledSlots);

    const mappedType: 'Classic' | 'Quick' = selectedGameMode === 'QUICK' ? 'Quick' : 'Classic';
    onCreateMatch({
      playersCount,
      entryFee: requiredFee,
      totalPrize: requiredFee * playersCount,
      gameType: mappedType,
      gameMode: 'vs_ai',
      aiDifficulty: 'Medium',
      playWith: 'Friends',
    });
  }, [entryFee, userBalance, playersCount, guestSlots, selectedGameMode, onCreateMatch]);

  // Auto Countdown in Step 3
  useEffect(() => {
    if (createStep !== 3 || !autoBotsEnabled || !isAutoTimerRunning) {
      return;
    }

    if (autoTimerSeconds <= 0) {
      const startTimer = setTimeout(() => {
        triggerAutoFillAndStart();
      }, 50);
      return () => clearTimeout(startTimer);
    }

    const interval = setInterval(() => {
      setAutoTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [createStep, autoBotsEnabled, isAutoTimerRunning, autoTimerSeconds, triggerAutoFillAndStart]);

  // Copy Room Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`🎮 Join my KingLudo match!\nRoom Code: *${roomCode}*\nEntry Fee: ৳${entryFee}\nMode: ${selectedGameMode}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Add specific Friend or Bot to guest slot
  const handleSelectSlotFriend = (friend: FriendUser) => {
    if (slotPickerIndex === null) return;
    setGuestSlots((prev) => {
      const copy = [...prev];
      copy[slotPickerIndex] = {
        id: friend.id,
        name: friend.name,
        avatarUrl: friend.avatarUrl,
        isBot: false
      };
      return copy;
    });
    setSlotPickerIndex(null);
  };

  const handleAddSlotBot = () => {
    if (slotPickerIndex === null) return;
    const [bot] = getRandomBots(1);

    setGuestSlots((prev) => {
      const copy = [...prev];
      copy[slotPickerIndex] = {
        id: `slot_${Date.now()}_${slotPickerIndex}`,
        name: bot.name,
        avatarUrl: bot.avatarUrl,
        isBot: true
      };
      return copy;
    });
    setSlotPickerIndex(null);
  };

  // Start Actual Game from Step 3
  const handleStartGame = () => {
    const requiredFee = Math.max(minMatchFee, entryFee || minMatchFee);
    if (requiredFee > userBalance) {
      setRequiredFeeForModal(requiredFee);
      setShowBalanceWarningModal(true);
      return;
    }
    // If any slots are empty, auto-fill them
    const hasEmptySlot = guestSlots.some((s) => !s);
    if (hasEmptySlot) {
      triggerAutoFillAndStart();
      return;
    }

    const mappedType: 'Classic' | 'Quick' = selectedGameMode === 'QUICK' ? 'Quick' : 'Classic';
    onCreateMatch({
      playersCount,
      entryFee: requiredFee,
      totalPrize: requiredFee * playersCount,
      gameType: mappedType,
      gameMode: playMode,
      aiDifficulty: 'Medium',
      playWith: 'Friends',
    });
  };

  // Submit Join Code
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const targetRoom = rooms.find((r) => r.code === joinCodeInput.trim());
    const reqFee = targetRoom ? targetRoom.entryFee : minMatchFee;
    if (reqFee > userBalance) {
      setRequiredFeeForModal(reqFee);
      setShowBalanceWarningModal(true);
      return;
    }
    if (onJoinRoom) {
      onJoinRoom(joinCodeInput.trim());
    } else {
      onCreateMatch({
        playersCount: 2,
        entryFee: reqFee,
        totalPrize: reqFee * 2,
        gameType: 'Classic',
        gameMode: 'vs_ai',
        aiDifficulty: 'Medium',
        playWith: 'Anyone',
      });
    }
  };

  return (
    <div
      className="min-h-full text-white p-2 sm:p-4 space-y-3 pb-24 select-none relative font-sans"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Header Back Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => {
            if (activeTab === 'create' && createStep > 1) {
              setCreateStep((prev) => (prev - 1) as 1 | 2);
            } else {
              onNavigate('home');
            }
          }}
          className="p-2 rounded-2xl bg-[#063314] border border-amber-400/40 text-amber-300 hover:bg-emerald-800/60 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="font-black text-base text-amber-300 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          LUDO ROOM SETUP
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMusicOn((p) => !p)}
            className={`p-1.5 rounded-xl border ${musicOn ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSoundOn((p) => !p)}
            className={`p-1.5 rounded-xl border ${soundOn ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Ludo King Style Glossy Frame */}
      <div className="max-w-md mx-auto bg-gradient-to-b from-[#003494] via-[#002166] to-[#001038] rounded-3xl border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)] overflow-hidden relative">

        {/* Glossy Yellow/Gold Top Tabs: Create | Join */}
        <div className="flex items-center bg-[#001440] border-b-2 border-amber-400/60 p-1.5 gap-1.5">
          {/* Tab 1: Create */}
          <button
            onClick={() => {
              setActiveTab('create');
              setCreateStep(1);
            }}
            className={`flex-1 py-2.5 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-200 border-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-b from-[#0055ff] via-[#0038b3] to-[#002277] border-amber-300 text-[#ffea00] shadow-[0_4px_15px_rgba(0,0,0,0.6)] scale-[1.02]'
                : 'bg-[#001d5c] border-amber-400/30 text-amber-200/60 hover:text-amber-200'
            }`}
            style={{ textShadow: activeTab === 'create' ? '0 2px 4px #000' : 'none' }}
          >
            Create
          </button>

          {/* Tab 2: Join */}
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2.5 rounded-2xl font-black text-base uppercase tracking-wider transition-all duration-200 border-2 ${
              activeTab === 'join'
                ? 'bg-gradient-to-b from-[#0055ff] via-[#0038b3] to-[#002277] border-amber-300 text-[#ffea00] shadow-[0_4px_15px_rgba(0,0,0,0.6)] scale-[1.02]'
                : 'bg-[#001d5c] border-amber-400/30 text-amber-200/60 hover:text-amber-200'
            }`}
            style={{ textShadow: activeTab === 'join' ? '0 2px 4px #000' : 'none' }}
          >
            Join
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="p-4 sm:p-5">

          {/* ==================================================== */}
          {/* TAB 1: CREATE FLOW                                  */}
          {/* ==================================================== */}
          {activeTab === 'create' && (
            <div>
              {/* STEP 1: SELECT LOBBY (Player Count is hidden as requested) */}
              {createStep === 1 && (
                <div className="space-y-6 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                  {/* Voice Chat Switch Bar */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVoiceChatEnabled((p) => !p)}
                      className="bg-gradient-to-r from-[#063314] to-[#04240d] border-2 border-amber-400/80 rounded-full pl-1.5 pr-4 py-1 flex items-center gap-2 shadow-lg active:scale-95 transition"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                        voiceChatEnabled ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {voiceChatEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </div>
                      <span className="font-extrabold text-sm text-white drop-shadow">Voice Chat</span>

                      {/* Speech bubble icon */}
                      <div className="relative bg-emerald-600 p-1 rounded-lg text-white border border-emerald-400">
                        <Mic className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  </div>

                  <hr className="border-emerald-500/30 my-4" />

                  {/* Central Entry Fee Box */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-4">
                      {/* Minus Button */}
                      <button
                        type="button"
                        onClick={handleDecreaseFee}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-b from-emerald-600 to-teal-800 border-2 border-amber-400/80 text-amber-300 font-black text-2xl flex items-center justify-center shadow-lg active:scale-90 transition hover:brightness-125 cursor-pointer"
                      >
                        <Minus className="w-6 h-6 stroke-[3]" />
                      </button>

                      {/* Golden Entry Card */}
                      <div className="w-40 sm:w-44 bg-gradient-to-b from-[#fce182] via-[#e5b32e] to-[#99730f] p-1.5 rounded-3xl shadow-2xl border-2 border-amber-300 relative">
                        {/* Inner Content Box */}
                        <div className="bg-gradient-to-b from-[#d9be62] to-[#b39534] p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
                          {/* Coin Stack Illustration */}
                          <div className="flex items-center justify-center gap-1 py-1">
                            <span className="text-2xl animate-bounce">🪙</span>
                          </div>

                          {/* Value Input Box */}
                          <div className="w-full bg-[#3c3d31] py-1 px-2 rounded-xl border-2 border-[#23241d] shadow-inner text-center flex items-center justify-center">
                            <input
                              type="number"
                              min={minMatchFee}
                              max={100000}
                              value={entryFee || ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (isNaN(val)) {
                                  setEntryFee(minMatchFee);
                                } else {
                                  setEntryFee(Math.max(minMatchFee, Math.min(100000, val)));
                                }
                              }}
                              onBlur={() => {
                                if (!entryFee || entryFee < minMatchFee) setEntryFee(minMatchFee);
                              }}
                              className="w-full bg-transparent text-xl sm:text-2xl font-black text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-lg py-0.5"
                              placeholder={String(minMatchFee)}
                            />
                          </div>
                        </div>

                        {/* ENTRY Badge label */}
                        <div className="pt-1.5 pb-0.5 text-center">
                          <span className="text-xs font-black text-amber-950 uppercase tracking-wider drop-shadow-sm block">
                            ENTRY (মিনিমাম ৳{minMatchFee})
                          </span>
                        </div>
                      </div>

                      {/* Plus Button */}
                      <button
                        type="button"
                        onClick={handleIncreaseFee}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-b from-emerald-600 to-teal-800 border-2 border-amber-400/80 text-amber-300 font-black text-2xl flex items-center justify-center shadow-lg active:scale-90 transition hover:brightness-125 cursor-pointer"
                      >
                        <Plus className="w-6 h-6 stroke-[3]" />
                      </button>
                    </div>

                    {/* Entry Deduction & Win Prize Preview Badge */}
                    <div className="max-w-xs mx-auto bg-gradient-to-r from-purple-950/80 via-[#063314] to-purple-950/80 border border-amber-400/50 rounded-2xl p-2.5 shadow-lg flex items-center justify-around text-xs">
                      <div className="text-center">
                        <span className="text-[10px] text-purple-300 block font-bold">ব্যালেন্স থেকে কাটবে</span>
                        <span className="text-rose-400 font-black font-mono text-sm">-৳{entryFee}</span>
                      </div>
                      <div className="w-[1px] h-6 bg-purple-700/60" />
                      <div className="text-center">
                        <span className="text-[10px] text-amber-300 block font-bold">জিতলে মোট পুরস্কার</span>
                        <span className="text-amber-300 font-black font-mono text-sm">৳{entryFee * playersCount}</span>
                      </div>
                      <div className="w-[1px] h-6 bg-purple-700/60" />
                      <div className="text-center">
                        <span className="text-[10px] text-emerald-300 block font-bold">মেইন ওয়ালেটে যোগ ({100 - commissionPercent}%)</span>
                        <span className="text-emerald-400 font-black font-mono text-sm">+৳{calculateWinPrize(entryFee, playersCount)}</span>
                      </div>
                    </div>

                    {/* Insufficient balance hint banner if fee exceeds wallet */}
                    {entryFee > userBalance && (
                      <div className="bg-red-950/80 border border-red-500/60 p-2 rounded-xl text-[11px] font-bold text-red-300 max-w-xs mx-auto flex items-center justify-between gap-1 shadow-md">
                        <span>⚠️ আপনার ওয়ালেটে ৳{userBalance} আছে (প্রয়োজন ৳{entryFee})</span>
                        <button
                          type="button"
                          onClick={() => onNavigate('add_money')}
                          className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow shrink-0"
                        >
                          ডিপোজিট
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Next Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleLobbyNext}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white font-black text-xl rounded-2xl border-2 border-amber-300 shadow-[0_5px_20px_rgba(0,0,0,0.6)] active:scale-95 transition tracking-wider cursor-pointer"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT GAME */}
              {createStep === 2 && (
                <div className="space-y-5 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                  {/* Title & Help Icon */}
                  <div className="flex items-center justify-between px-2">
                    <div className="w-6" />
                    <h3 className="text-xl sm:text-2xl font-black text-[#ffea00] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      SELECT GAME
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="w-8 h-8 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center cursor-pointer"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Game Mode Pill Buttons */}
                  <div className="space-y-3 pt-1">
                    {/* Mode 1: CLASSIC */}
                    <button
                      type="button"
                      onClick={() => setSelectedGameMode('CLASSIC')}
                      className={`w-full p-2.5 rounded-full border-2 transition-all flex items-center justify-between shadow-lg cursor-pointer ${
                        selectedGameMode === 'CLASSIC'
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 border-amber-300 shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-[#04260f]/90 border-emerald-500/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Checkmark Circle */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedGameMode === 'CLASSIC' ? 'bg-amber-400 border-white text-slate-950' : 'border-amber-400/50 bg-black/30'
                      }`}>
                        {selectedGameMode === 'CLASSIC' && <Check className="w-5 h-5 stroke-[3]" />}
                      </div>

                      {/* Mode Name */}
                      <span className="font-black text-lg text-white uppercase tracking-wider drop-shadow">
                        CLASSIC
                      </span>

                      {/* Trophy Badge */}
                      <div className="p-1 bg-amber-400/20 border border-amber-400 rounded-xl text-amber-300 flex items-center gap-1">
                        <Trophy className="w-5 h-5 fill-amber-400" />
                      </div>
                    </button>

                    {/* Mode 2: POPULAR */}
                    <button
                      type="button"
                      onClick={() => setSelectedGameMode('POPULAR')}
                      className={`w-full p-2.5 rounded-full border-2 transition-all flex items-center justify-between shadow-lg cursor-pointer ${
                        selectedGameMode === 'POPULAR'
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 border-amber-300 shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-[#04260f]/90 border-emerald-500/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedGameMode === 'POPULAR' ? 'bg-amber-400 border-white text-slate-950' : 'border-amber-400/50 bg-black/30'
                      }`}>
                        {selectedGameMode === 'POPULAR' && <Check className="w-5 h-5 stroke-[3]" />}
                      </div>

                      <span className="font-black text-lg text-white uppercase tracking-wider drop-shadow">
                        POPULAR
                      </span>

                      <div className="p-1 bg-amber-400/20 border border-amber-400 rounded-xl text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      </div>
                    </button>

                    {/* Mode 3: QUICK */}
                    <button
                      type="button"
                      onClick={() => setSelectedGameMode('QUICK')}
                      className={`w-full p-2.5 rounded-full border-2 transition-all flex items-center justify-between shadow-lg cursor-pointer ${
                        selectedGameMode === 'QUICK'
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 border-amber-300 shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-[#04260f]/90 border-emerald-500/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedGameMode === 'QUICK' ? 'bg-amber-400 border-white text-slate-950' : 'border-amber-400/50 bg-black/30'
                      }`}>
                        {selectedGameMode === 'QUICK' && <Check className="w-5 h-5 stroke-[3]" />}
                      </div>

                      <span className="font-black text-lg text-white uppercase tracking-wider drop-shadow">
                        QUICK
                      </span>

                      <div className="p-1 bg-amber-400/20 border border-amber-400 rounded-xl text-amber-300 flex items-center gap-1">
                        <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                    </button>
                  </div>

                  {/* Action Button: Create Room */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleCreateRoomSubmit}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white font-black text-xl rounded-2xl border-2 border-amber-300 shadow-[0_5px_20px_rgba(0,0,0,0.6)] active:scale-95 transition tracking-wider cursor-pointer"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                    >
                      Create Room
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ONLINE MULTIPLAYER LOBBY */}
              {createStep === 3 && (
                <div className="bg-gradient-to-b from-[#90000e] via-[#6e000a] to-[#3d0006] p-4 rounded-2xl border-2 border-amber-400/80 space-y-4 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
                  {/* Top Ambient Glow */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#ffea00] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    ONLINE MULTIPLAYER
                  </h3>

                  {/* Room Code Display Box */}
                  <div className="bg-[#120002]/90 p-3 rounded-2xl border-2 border-amber-400/60 shadow-xl space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs font-bold text-amber-300 uppercase">Room Code :</span>
                      <span className="text-base sm:text-lg font-black text-amber-400 font-mono tracking-widest bg-black/60 px-2.5 py-0.5 rounded-lg border border-amber-400/40">
                        {roomCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Copy Code */}
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-bold shadow flex items-center gap-1 cursor-pointer active:scale-95 transition"
                          title="কপি করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedCode && <span className="text-[10px]">Copied!</span>}
                        </button>
                        {/* WhatsApp Share */}
                        <button
                          type="button"
                          onClick={handleWhatsAppShare}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white shadow cursor-pointer active:scale-95 transition"
                          title="হোয়াটসঅ্যাপে শেয়ার করুন"
                        >
                          <MessageCircle className="w-4 h-4 fill-white" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-amber-200/80 font-medium">
                      অন্যান্য ফোন থেকে বন্ধুদের এই কোড দিয়ে জয়েন করতে বলুন
                    </p>

                    <div className="flex items-center justify-between text-xs font-black px-1">
                      <span className="text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                        {playersCount === 2 ? '👥 2-Player (1 vs 1)' : '👥 4-Player (Classic)'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-500/40">
                          ফি: -৳{entryFee}
                        </span>
                        <span className="text-emerald-400 font-black bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                          জিতলে: +৳{calculateWinPrize(entryFee, playersCount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Host Avatar & VS Guest Slots */}
                  <div className="py-1 space-y-3">
                    {/* Host Profile Card */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xl bg-[#04260f] relative">
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] font-black text-white py-0.5 text-center">
                          YOU (Host)
                        </span>
                      </div>
                      <span className="mt-1 font-black text-xs text-white drop-shadow">
                        {user.name}
                      </span>
                    </div>

                    {/* VS Emblem */}
                    <div className="flex items-center justify-center my-1">
                      <span className="text-2xl font-black text-amber-300 italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse">
                        VS
                      </span>
                    </div>

                    {/* Guest Cards Grid (1 for 2-player, 3 for 4-player) */}
                    <div className={`grid ${playersCount === 2 ? 'grid-cols-1 max-w-[140px]' : 'grid-cols-3 max-w-xs'} gap-2.5 mx-auto`}>
                      {guestSlots.map((slot, idx) => (
                        <div
                          key={`guest-slot-${idx}-${slot?.id || 'empty'}`}
                          onClick={() => {
                            if (slot) {
                              setGuestSlots((prev) => {
                                const copy = [...prev];
                                copy[idx] = null;
                                return copy;
                              });
                            } else {
                              setSlotPickerIndex(idx);
                            }
                          }}
                          className="bg-[#590008] border-2 border-amber-400/60 rounded-xl p-2 flex flex-col items-center justify-center min-h-[85px] shadow-md cursor-pointer hover:border-amber-300 transition group relative"
                        >
                          {slot ? (
                            <>
                              <div className="relative">
                                <img src={slot.avatarUrl} alt={slot.name} className="w-10 h-10 rounded-lg object-cover border border-amber-300" />
                              </div>
                              <span className="text-[10px] font-bold text-white truncate max-w-[70px] mt-1">{slot.name}</span>
                              <span className="text-[8px] text-amber-200 opacity-80 mt-0.5">ট্যাপ করে সরান</span>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-lg bg-black/40 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                                <Plus className="w-6 h-6 stroke-[3]" />
                              </div>
                              <span className="text-[9px] font-bold text-amber-200/80 mt-1">+ ফ্রেন্ড / প্লেয়ার</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Start Match Button */}
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white font-black text-xl rounded-2xl border-2 border-amber-300 shadow-[0_5px_20px_rgba(0,0,0,0.6)] active:scale-95 transition tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                  >
                    <Play className="w-6 h-6 fill-white" />
                    <span>START MATCH</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: JOIN FLOW                                    */}
          {/* ==================================================== */}
          {activeTab === 'join' && (
            <div className="space-y-5 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <h3 className="text-xl sm:text-2xl font-black text-[#ffea00] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                ENTER PRIVATE CODE
              </h3>

              {/* Private Code Form */}
              <form onSubmit={handleJoinSubmit} className="space-y-4 max-w-sm mx-auto">
                {/* White capsule box with green border */}
                <div className="bg-[#031e0c] rounded-full p-2 border-2 border-emerald-500/80 shadow-xl flex items-center">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="Enter private code here..."
                    className="w-full text-center text-amber-300 font-extrabold text-sm sm:text-base italic placeholder:text-emerald-300/60 placeholder:not-italic focus:outline-none bg-transparent"
                    required
                  />
                </div>

                {/* Join Room Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white font-black text-xl rounded-2xl border-2 border-amber-300 shadow-[0_5px_20px_rgba(0,0,0,0.6)] active:scale-95 transition tracking-wider cursor-pointer"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Join Room
                </button>
              </form>

              {/* Real Cash Match notice */}
              <p className="text-xs font-bold text-amber-300/90 tracking-wide flex items-center justify-center gap-1.5">
                <span>💰 এন্ট্রি ফি ছাড়া কোনো ম্যাচ খেলা যাবে না</span>
              </p>

              {/* Active Public Rooms List */}
              {safeRooms.length > 0 && (
                <div className="pt-3 space-y-2 text-left">
                  <h4 className="text-xs font-bold text-amber-300 uppercase">Available Public Rooms</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-1">
                    {safeRooms.map((rm, rIdx) => (
                      <div
                        key={`public-room-${rm.id || rIdx}-${rm.code || rIdx}-${rIdx}`}
                        className="bg-[#04260f] p-2.5 rounded-xl border border-emerald-500/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img src={rm.hostAvatar} alt={rm.hostName} className="w-8 h-8 rounded-full border border-amber-300 object-cover" />
                          <div>
                            <p className="font-bold text-xs text-white">{rm.hostName}</p>
                            <p className="text-[10px] text-amber-300">Code: {rm.code} • Fee: ৳{rm.entryFee}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onJoinRoom && onJoinRoom(rm.code)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-xs rounded-lg shadow cursor-pointer"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Rules / Help Modal */}
      {showHelpModal && (
        <GameRulesModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* SLOT PICKER MODAL (Add Friend or AI to Slot) */}
      {slotPickerIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#180a3a] border-2 border-amber-400 w-full max-w-sm rounded-3xl p-4 space-y-3.5 shadow-[0_0_50px_rgba(245,158,11,0.35)] relative text-left">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
              <span className="font-extrabold text-sm text-white">স্লটে প্লেয়ার যুক্ত করুন (Slot #{slotPickerIndex + 2})</span>
              <button
                type="button"
                onClick={() => setSlotPickerIndex(null)}
                className="p-1 rounded-xl bg-purple-900/50 text-purple-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-purple-200">
              আপনার অনলাইন ফ্রেন্ড সিলেক্ট করুন অথবা প্লেয়ার যুক্ত করুন:
            </p>

            {/* Quick Match / Player Option Button */}
            <button
              type="button"
              onClick={handleAddSlotBot}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-between shadow-md active:scale-95 transition"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">👥</span>
                <span>প্লেয়ার যুক্ত করুন (Quick Match)</span>
              </span>
              <span className="text-[10px] bg-amber-950/30 px-2 py-0.5 rounded font-bold">ইনস্ট্যান্ট</span>
            </button>

            {/* Saved Friends List Selector */}
            <div className="pt-2 border-t border-purple-800/60 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-200 block">আমার অনলাইন ফ্রেন্ডস:</span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {(() => {
                  const saved = getSavedFriends();
                  const safeList = Array.isArray(saved) ? saved : [];
                  if (safeList.length === 0) {
                    return <p className="text-xs text-purple-300 py-3 text-center">আপনার কোনো সেভ করা ফ্রেন্ড নেই!</p>;
                  }
                  return safeList.map((friend, fIdx) => (
                    <div
                      key={`saved-friend-${friend.id || fIdx}-${fIdx}`}
                      onClick={() => handleSelectSlotFriend(friend)}
                      className="p-2.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 flex items-center justify-between gap-2 cursor-pointer transition active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <img src={friend.avatarUrl} alt={friend.name} className="w-8 h-8 rounded-xl object-cover border border-amber-300" />
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block">{friend.name}</span>
                          <span className="text-[9px] font-mono text-amber-300">ID: {friend.id}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        ইনভাইট
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Button to open full friends search */}
            <button
              type="button"
              onClick={() => {
                setSlotPickerIndex(null);
                setShowFullFriendsManager(true);
              }}
              className="w-full py-2 bg-purple-900/60 hover:bg-purple-800 border border-purple-600 text-purple-200 font-bold text-xs rounded-xl transition"
            >
              🔍 নতুন ফ্রেন্ড আইডি দিয়ে খুঁজুন
            </button>
          </div>
        </div>
      )}

      {/* Full Friends Manager Modal */}
      <FriendsModal
        isOpen={showFullFriendsManager}
        onClose={() => setShowFullFriendsManager(false)}
      />

      {/* Insufficient Balance Modal */}
      {showBalanceWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#120a32] border-2 border-red-500/80 w-full max-w-xs rounded-3xl p-5 space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.4)] relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <span className="text-2xl">⚠️</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">টাকা ছাড়া কোনো গেম খেলা যাবে না!</h3>
              <p className="text-xs text-purple-200">
                King Ludo-তে ম্যাচ খেলতে আপনার ওয়ালেটে এন্ট্রি ফি অনুযায়ী টাকা (ব্যালেন্স) ডিপোজিট থাকতে হবে।
              </p>
            </div>

            <div className="bg-[#0a041f] p-3 rounded-2xl border border-purple-800/60 space-y-1 text-xs">
              <div className="flex items-center justify-between text-purple-300">
                <span>প্রয়োজন (এন্ট্রি ফি):</span>
                <span className="font-extrabold text-amber-400">৳{requiredFeeForModal}</span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span>আপনার ওয়ালেট ব্যালেন্স:</span>
                <span className="font-extrabold text-red-400">৳{userBalance}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowBalanceWarningModal(false);
                  onNavigate('add_money');
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>➕ ওয়ালেটে টাকা অ্যাড করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBalanceWarningModal(false)}
                className="w-full py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-xl transition"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
