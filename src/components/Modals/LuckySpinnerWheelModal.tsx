import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Coins,
  Flame,
  Clock,
  Info,
  Gift,
  HelpCircle,
  Zap,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, AppSettings } from '../../types';
import { requestAppFullscreen } from '../../utils/fullscreen';
import {
  AdminLuckyWheelSlice,
  DEFAULT_ADMIN_WHEEL_SLICES,
  getStoredLuckyWheelConfig,
  LUCKY_WHEEL_UPDATED_EVENT,
  LuckyWheelFullConfig,
} from '../../types/luckyWheelTypes';

export interface DynamicSpinSlice {
  id: string;
  sliceNumber: number;
  label: string;
  subLabel?: string;
  showingFigure: string;
  actualCreditedValue: number;
  isActiveForWinner: boolean;
  type: 'cash' | 'empty' | 'jackpot';
  iconType: 'bag' | 'trophy' | 'star';
  bgColor: string;
}

function mapAdminSlicesToWheel(adminSlices: AdminLuckyWheelSlice[]): DynamicSpinSlice[] {
  const safeList = Array.isArray(adminSlices) && adminSlices.length > 0 ? adminSlices : DEFAULT_ADMIN_WHEEL_SLICES;
  return safeList.map((s, idx) => {
    const numVal = parseFloat(s.showingFigure) || 0;
    const creditVal = parseFloat(s.actualCreditedValue) || 0;
    const isJackpot = numVal >= 1000;
    const isEmpty = numVal <= 0;

    let iconType: 'bag' | 'trophy' | 'star' = 'bag';
    if (isEmpty) iconType = 'star';
    else if (isJackpot) iconType = 'bag';
    else if (numVal >= 10) iconType = 'trophy';

    return {
      id: s.id || `slice_${idx + 1}`,
      sliceNumber: s.sliceNumber || (idx + 1),
      label: isEmpty ? 'আবার চেষ্টা' : `৳ ${s.showingFigure}`,
      subLabel: isEmpty ? 'করুন' : undefined,
      showingFigure: s.showingFigure,
      actualCreditedValue: creditVal,
      isActiveForWinner: s.isActiveForWinner,
      type: isEmpty ? 'empty' : isJackpot ? 'jackpot' : 'cash',
      iconType,
      bgColor: idx % 2 === 0 ? '#FFF2D6' : '#FFFFFF',
    };
  });
}

interface LuckySpinnerWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  appSettings?: AppSettings;
  onClaimReward: (amount: number, rewardTitle: string) => void;
}

export const LuckySpinnerWheelModal: React.FC<LuckySpinnerWheelModalProps> = ({
  isOpen,
  onClose,
  user,
  appSettings,
  onClaimReward,
}) => {
  const [wheelConfig, setWheelConfig] = useState<LuckyWheelFullConfig>(getStoredLuckyWheelConfig);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningSlice, setWinningSlice] = useState<DynamicSpinSlice | null>(null);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatusText, setClaimStatusText] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [chaseLightState, setChaseLightState] = useState(0);

  useEffect(() => {
    if (isOpen) {
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  // Sync when Admin modifies Lucky Wheel configuration
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setWheelConfig(customEvent.detail);
      }
    };
    window.addEventListener(LUCKY_WHEEL_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(LUCKY_WHEEL_UPDATED_EVENT, handleSync);
  }, []);

  const slices = mapAdminSlicesToWheel(wheelConfig.slices);

  // User Cooldown Tracking
  const userStorageKey = `kingludo_last_spin_${user?.phone || user?.id || 'guest'}`;
  const extraSpinsKey = `kingludo_extra_spins_${user?.phone || user?.id || 'guest'}`;

  const [lastSpinTime, setLastSpinTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [extraSpins, setExtraSpins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(extraSpinsKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  const cooldownHours = wheelConfig.settings.cooldownHours;
  const COOLDOWN_MS = cooldownHours * 60 * 60 * 1000;

  // Countdown timer based on admin-configured cooldownHours
  useEffect(() => {
    if (cooldownHours <= 0) {
      setTimeLeft(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = now - lastSpinTime;
      const remaining = COOLDOWN_MS - elapsed;

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastSpinTime, cooldownHours, COOLDOWN_MS]);

  // Bulb chase animation while spinning
  useEffect(() => {
    if (!isSpinning) return;
    const interval = setInterval(() => {
      setChaseLightState((prev) => (prev + 1) % 16);
    }, 120);
    return () => clearInterval(interval);
  }, [isSpinning]);

  const isEnabled = wheelConfig.settings.enableLuckyWheel;
  const minDeposit = wheelConfig.settings.minDepositRequired;
  const hasFreeSpin = cooldownHours <= 0 || timeLeft === null;
  const canSpin = isEnabled && !isSpinning && (hasFreeSpin || extraSpins > 0 || user.balance >= 10);

  const handleStartSpin = () => {
    if (!isEnabled) {
      alert('লাকি হুইল গেম সাময়িকভাবে নিষ্ক্রিয় রয়েছে। এডমিন এটি সক্রিয় করলে খেলতে পারবেন।');
      return;
    }

    if (!canSpin || isSpinning) return;

    // Minimum Deposit check
    if (minDeposit > 0 && user.balance < minDeposit) {
      alert(`লাকি স্পিন খেলতে হলে অন্তত ৳${minDeposit} ডিপোজিট বা ব্যালেন্স থাকতে হবে!`);
      return;
    }

    // Check free spin or fee
    if (!hasFreeSpin && extraSpins === 0) {
      if (user.balance < 10) {
        alert('আপনার ফ্রি স্পিন শেষ হয়েছে। অতিরিক্ত স্পিন করতে ওয়ালেটে অন্তত ৳১০ থাকতে হবে!');
        return;
      }
      onClaimReward(-10, 'লাকি স্পিনার অতিরিক্ত স্পিন ফি');
    } else if (!hasFreeSpin && extraSpins > 0) {
      const nextExtra = extraSpins - 1;
      setExtraSpins(nextExtra);
      localStorage.setItem(extraSpinsKey, nextExtra.toString());
    }

    setIsSpinning(true);
    setWinningSlice(null);
    setShowWinCelebration(false);
    setClaimed(false);
    setIsClaiming(false);
    setClaimStatusText(null);

    // CRITICAL WINNER RULE FROM SCREENSHOT:
    // Only checked "Active for Spin Winner" slices will be chosen during spins!
    const activeIndices = slices
      .map((s, idx) => (s.isActiveForWinner ? idx : -1))
      .filter((idx) => idx !== -1);

    const targetIndex =
      activeIndices.length > 0
        ? activeIndices[Math.floor(Math.random() * activeIndices.length)]
        : 0;

    const pickedSlice = slices[targetIndex];

    // Wheel math: 8 slices, each 45 degrees.
    const sliceAngle = 360 / slices.length; // 45 deg
    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const fullRotations = 360 * 6; // 6 dramatic full spins
    const currentModulo = rotation % 360;
    const targetNormalized = (360 - targetSliceCenter) % 360;
    const additionalDeg = (targetNormalized - currentModulo + 360) % 360;
    const totalNewRotation = rotation + fullRotations + additionalDeg;

    setRotation(totalNewRotation);

    if (hasFreeSpin && cooldownHours > 0) {
      const now = Date.now();
      setLastSpinTime(now);
      localStorage.setItem(userStorageKey, now.toString());
    }

    // Deceleration completes after 4.8s
    setTimeout(() => {
      setIsSpinning(false);
      setWinningSlice(pickedSlice);
      setShowWinCelebration(true);
    }, 4800);
  };

  const handleClaimPrize = () => {
    if (!winningSlice || claimed) return;
    setClaimed(true);
    setIsClaiming(true);

    const creditAmount = winningSlice.actualCreditedValue;

    if (creditAmount > 0) {
      setClaimStatusText(`✓ ৳${creditAmount.toFixed(2)} ব্যালেন্সে যোগ হয়েছে!`);
      onClaimReward(
        creditAmount,
        `লাকি স্পিনার রিওয়ার্ড (৳${winningSlice.showingFigure || creditAmount})`
      );

      // Transition smoothly back to Home Screen after 1.1s so user sees the reward celebration on the home screen!
      setTimeout(() => {
        setIsClaiming(false);
        setShowWinCelebration(false);
        onClose();
      }, 1100);
    } else {
      setClaimStatusText('ধন্যবাদ! পরের স্পিনে আবার চেষ্টা করুন।');
      setTimeout(() => {
        setIsClaiming(false);
        setShowWinCelebration(false);
        onClose();
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-gradient-to-b from-[#140b2e] via-[#0d0722] to-[#080415] flex flex-col overflow-hidden animate-in fade-in duration-200 select-none text-white">
      {/* Background Glowing Ambient Sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-amber-500/20 via-orange-500/25 to-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Top Application Bar */}
      <div className="bg-[#140b2e]/95 border-b border-purple-800/60 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="p-2 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-500/40 transition active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🎡</span>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white leading-tight flex items-center gap-1.5">
                <span>Lucky Spinner</span>
                <span className="text-[10px] text-amber-300 font-extrabold bg-amber-950/90 border border-amber-400/50 px-1.5 py-0.2 rounded-full">
                  স্পিন ও উইন
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition disabled:opacity-40 cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center p-3 sm:p-4 relative">
        <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center select-none text-white my-auto">
          {/* Title Header with Fire Aura */}
          <div className="text-center mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-400/40 text-[10px] font-black text-amber-300 uppercase tracking-widest shadow-inner mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-bounce" />
            <span>লাকি স্পিন অ্যান্ড উইন</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
            LUCKY SPINNER WHEEL
          </h2>
          <p className="text-[11px] font-semibold text-purple-200/90">
            {isEnabled
              ? 'চাকা ঘুরিয়ে জিতে নিন আপনার ভাগ্যের পুরস্কার!'
              : 'লাকি স্পিনার বর্তমানে এডমিন দ্বারা সাময়িকভাবে বন্ধ আছে।'}
          </p>
        </div>

        {/* SPIN STATUS & TIMER PILL */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 bg-[#1a0e3d]/80 border border-purple-800/60 rounded-2xl mb-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-200">
              {cooldownHours === 0 ? 'আনলিমিটেড স্পিন:' : 'ফ্রি স্পিন:'}
            </span>
            {hasFreeSpin ? (
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full animate-pulse">
                ✓ এভেইলেবল
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400">
                ব্যবহৃত হয়েছে
              </span>
            )}
          </div>

          {!hasFreeSpin && timeLeft && (
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-xl border border-purple-700/40">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* WHEEL CONTAINER WITH FIERY FLAME BORDER & BULB LIGHTS                      */}
        {/* ========================================================================= */}
        <div className="relative w-[285px] h-[285px] sm:w-[315px] sm:h-[315px] flex items-center justify-center my-2">
          {/* External Fiery Glow / Sunburst Blaze */}
          <div className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-orange-600/35 via-amber-500/45 to-yellow-500/35 blur-md animate-pulse pointer-events-none" />

          {/* Fiery Corona Radial Rings */}
          <div
            className="absolute -inset-2 rounded-full border-2 border-orange-400/70 shadow-[0_0_25px_rgba(249,115,22,0.65)] pointer-events-none"
            style={{
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.7), inset 0 0 15px rgba(234, 88, 12, 0.5)',
            }}
          />

          {/* Outer Golden Bronze Bezel with 16 Glowing LED Bulbs */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#E5983A] via-[#C97B25] to-[#8E4A0C] border-[6px] border-[#FDE047] shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center justify-center pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const radius = 132;
              const isLit = isSpinning
                ? (i + chaseLightState) % 2 === 0
                : i % 2 === 0;

              return (
                <div
                  key={`bulb-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full transition-all duration-150"
                  style={{
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                    backgroundColor: isLit ? '#FFFBEB' : '#F59E0B',
                    boxShadow: isLit
                      ? '0 0 8px #FFFFFF, 0 0 14px #F59E0B'
                      : '0 0 3px rgba(0,0,0,0.5)',
                  }}
                />
              );
            })}
          </div>

          {/* ======================================================= */}
          {/* ROTATING SVG WHEEL (8 SLICES MATCHING ADMIN CONFIG)     */}
          {/* ======================================================= */}
          <div
            className="w-[250px] h-[250px] sm:w-[276px] sm:h-[276px] rounded-full overflow-hidden shadow-inner relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 4.8s cubic-bezier(0.15, 0.9, 0.25, 1)'
                : 'none',
            }}
          >
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full transform -rotate-90"
            >
              <defs>
                <linearGradient id="sliceDivider" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#CA8A04" />
                  <stop offset="50%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#A16207" />
                </linearGradient>
              </defs>

              {/* Draw 8 Slices */}
              {slices.map((slice, index) => {
                const sliceAngle = 360 / slices.length; // 45 deg
                const startAngle = index * sliceAngle;
                const endAngle = (index + 1) * sliceAngle;
                const midAngle = startAngle + sliceAngle / 2;

                const cx = 150;
                const cy = 150;
                const r = 148;

                const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
                const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
                const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
                const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

                const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

                const textRadius = 96;
                const contentX = cx + textRadius * Math.cos((midAngle * Math.PI) / 180);
                const contentY = cy + textRadius * Math.sin((midAngle * Math.PI) / 180);

                return (
                  <g key={slice.id}>
                    {/* Slice Background */}
                    <path
                      d={pathData}
                      fill={slice.bgColor}
                      stroke="url(#sliceDivider)"
                      strokeWidth="2"
                    />

                    {/* Slice Content (Label + Icon) */}
                    <g
                      transform={`translate(${contentX}, ${contentY}) rotate(${midAngle + 90})`}
                    >
                      {/* Icon */}
                      {slice.iconType === 'bag' && (
                        <g transform="translate(-11, -38) scale(0.9)">
                          <path
                            d="M 12 3 C 8 3 7 6 7 9 L 4 14 C 4 18 8 21 12 21 C 16 21 20 18 20 14 L 17 9 C 17 6 16 3 12 3 Z"
                            fill="#B45309"
                            stroke="#D97706"
                            strokeWidth="1.2"
                          />
                          <ellipse cx="12" cy="9" rx="4" ry="2" fill="#FDE047" />
                          <circle cx="12" cy="14" r="2.5" fill="#FEF08A" />
                        </g>
                      )}

                      {slice.iconType === 'trophy' && (
                        <g transform="translate(-11, -38) scale(0.9)">
                          <path
                            d="M 6 4 L 18 4 L 17 11 C 17 14 14.5 16 12 16 C 9.5 16 7 14 7 11 Z"
                            fill="#D97706"
                            stroke="#B45309"
                            strokeWidth="1.2"
                          />
                          <path d="M 6 6 L 3 7 C 3 10 5 11 6 11 Z" fill="#F59E0B" />
                          <path d="M 18 6 L 21 7 C 21 10 19 11 18 11 Z" fill="#F59E0B" />
                          <rect x="10" y="16" width="4" height="4" fill="#B45309" />
                          <rect x="7" y="19" width="10" height="2.5" rx="1" fill="#78350F" />
                        </g>
                      )}

                      {slice.iconType === 'star' && (
                        <g transform="translate(-10, -38) scale(0.9)">
                          <polygon
                            points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
                            fill="#F59E0B"
                            stroke="#D97706"
                            strokeWidth="1.2"
                          />
                        </g>
                      )}

                      {/* Prize Showing Figure */}
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#0F172A"
                        fontSize={slice.label.length > 7 ? '11' : '13'}
                        fontWeight="900"
                        fontFamily="sans-serif"
                      >
                        {slice.label}
                      </text>

                      {slice.subLabel && (
                        <text
                          x="0"
                          y="8"
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {slice.subLabel}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ======================================================= */}
          {/* CENTER HUB WITH RED-ORANGE BEZEL & "GO" BUTTON          */}
          {/* ======================================================= */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Top Pointer Needle pointing straight UP into active winning slice */}
            <div className="absolute top-1 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '11px solid transparent',
                  borderRight: '11px solid transparent',
                  borderTop: '20px solid #DC2626',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                }}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 -mt-1 shadow-sm" />
            </div>

            {/* Central Round "GO" Button matching screenshot */}
            <button
              id="lucky-wheel-center-go-btn"
              type="button"
              onClick={handleStartSpin}
              disabled={!canSpin || isSpinning}
              className={`pointer-events-auto relative w-[76px] h-[76px] rounded-full bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] border-[5px] border-[#FDE047] shadow-[0_6px_20px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center transition active:scale-95 group z-20 ${
                !canSpin || isSpinning ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:brightness-110'
              }`}
            >
              <div className="absolute top-0.5 inset-x-2 h-4 bg-gradient-to-b from-white/50 to-transparent rounded-t-full pointer-events-none" />

              <span className="font-black text-lg sm:text-xl tracking-wider text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-sans group-hover:scale-110 transition-transform">
                GO
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM GLOWING GOLDEN "CLAIM" / "SPIN NOW" PILL BUTTON                    */}
        {/* ========================================================================= */}
        <div className="w-full mt-2 space-y-2">
          {showWinCelebration && winningSlice ? (
            <button
              id="lucky-wheel-claim-btn"
              type="button"
              onClick={handleClaimPrize}
              disabled={claimed || isClaiming}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-b from-[#FFF2B2] via-[#F6C042] to-[#D97706] hover:brightness-110 text-[#78350F] font-black text-base sm:text-lg tracking-wide shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-2 border-yellow-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <Sparkles className="w-5 h-5 text-amber-900" />
              <span>
                {claimed
                  ? (claimStatusText || '✓ ব্যালেন্সে জমা হয়েছে!')
                  : winningSlice.actualCreditedValue > 0
                  ? `Claim করুন (৳${winningSlice.actualCreditedValue})`
                  : 'Claim (ধন্যবাদ)'}
              </span>
            </button>
          ) : (
            <button
              id="lucky-wheel-spin-now-btn"
              type="button"
              onClick={handleStartSpin}
              disabled={!canSpin || isSpinning}
              className={`w-full py-3.5 px-6 rounded-full bg-gradient-to-b from-[#FFF2B2] via-[#F6C042] to-[#D97706] hover:brightness-110 text-[#78350F] font-black text-base sm:text-lg tracking-wide shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-2 border-yellow-200 active:scale-95 transition-all flex items-center justify-center gap-2 ${
                !canSpin || isSpinning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {!isEnabled ? (
                <>
                  <Lock className="w-5 h-5 text-amber-900" />
                  <span>সাময়িকভাবে বন্ধ রয়েছে</span>
                </>
              ) : isSpinning ? (
                <>
                  <Sparkles className="w-5 h-5 text-amber-900 animate-spin" />
                  <span>চাকা ঘুরছে...</span>
                </>
              ) : hasFreeSpin ? (
                <>
                  <Flame className="w-5 h-5 text-orange-700" />
                  <span>ফ্রি স্পিন করুন (Spin Now)</span>
                </>
              ) : extraSpins > 0 ? (
                <>
                  <Zap className="w-5 h-5 text-amber-900" />
                  <span>বোনাস স্পিন করুন ({extraSpins}টি বাকি)</span>
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5 text-amber-900" />
                  <span>৳১০ দিয়ে স্পিন করুন</span>
                </>
              )}
            </button>
          )}

          {/* Quick Balance & Spin Info */}
          <div className="flex items-center justify-between text-[11px] px-2 text-purple-200/90 font-medium">
            <span>
              আপনার ব্যালেন্স: <strong className="text-amber-300 font-mono">৳{user.balance.toFixed(2)}</strong>
              {claimed && winningSlice && winningSlice.actualCreditedValue > 0 && (
                <span className="ml-1 text-emerald-400 font-bold animate-pulse">
                  (+৳{winningSlice.actualCreditedValue.toFixed(2)} ✓)
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <HelpCircle className="w-3 h-3" />
              <span>শর্ত ও নিয়মাবলী</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLLAPSIBLE RULES & CONDITIONS ACCORDION                                   */}
        {/* ========================================================================= */}
        {showRules && (
          <div className="w-full mt-3 p-3 rounded-2xl bg-[#12082b] border border-amber-500/30 text-[11px] space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-1">
              <span className="font-extrabold text-amber-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>লাকি স্পিন শর্ত ও নিয়মাবলী:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="text-purple-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-amber-200">ফ্রি স্পিন কুলডাউন:</strong> এডমিন নির্ধারিত সময় পরপর (যেমন{' '}
                {cooldownHours} ঘণ্টা) প্লেয়াররা বিনামূল্যে ১টি স্পিন উপভোগ করতে পারেন।
              </li>
              <li>
                <strong className="text-amber-200">সরাসরি ওয়ালেট ক্যাশ:</strong> স্পিনে বিজয়ী হলে প্রাপ্ত পুরস্কার সাথে সাথে মূল ওয়ালেট ব্যালেন্সে যুক্ত হয়ে যায়।
              </li>
              {minDeposit > 0 && (
                <li>
                  <strong className="text-amber-200">নূন্যতম ডিপোজিট:</strong> স্পিন খেলতে হলে অন্তত ৳{minDeposit} ডিপোজিট সম্পন্ন থাকতে হবে।
                </li>
              )}
              <li>
                <strong className="text-amber-200">অতিরিক্ত স্পিন:</strong> ফ্রি স্পিনের সময় শেষ হওয়া পর্যন্ত অপেক্ষা না করে মাত্র ৳১০ ওয়ালেট ব্যালেন্স দিয়ে স্পিন করতে পারেন।
              </li>
            </ul>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CELEBRATION WIN POPUP BANNER AFTER LANDING                                */}
        {/* ========================================================================= */}
        {showWinCelebration && winningSlice && (
          <div className="absolute inset-x-3 top-16 z-40 bg-[#160b33]/95 border-2 border-amber-400 rounded-3xl p-4 shadow-[0_10px_40px_rgba(245,158,11,0.5)] flex flex-col items-center text-center animate-in zoom-in-95 duration-200 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg mb-2">
              {winningSlice.actualCreditedValue > 0 ? (
                <Trophy className="w-8 h-8 text-amber-950 animate-bounce" />
              ) : (
                <Sparkles className="w-8 h-8 text-amber-950" />
              )}
            </div>

            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              {winningSlice.actualCreditedValue > 0 ? '🎉 অভিনন্দন!' : 'পরের বার চেষ্টা করুন'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {winningSlice.actualCreditedValue > 0
                ? `আপনি পেয়েছেন ৳${winningSlice.showingFigure} পুরস্কার!`
                : 'পরের স্পিনে আবার চেষ্টা করুন!'}
            </h3>
            {winningSlice.actualCreditedValue > 0 && (
              <p className="text-xs text-amber-200 font-bold mt-1">
                আপনার ওয়ালেটে জমা হচ্ছে: <span className="font-mono text-emerald-300">৳{winningSlice.actualCreditedValue.toFixed(2)}</span>
              </p>
            )}
            <p className="text-xs text-purple-200 mt-1 max-w-xs">
              {winningSlice.actualCreditedValue > 0
                ? 'টাকা সরাসরি মূল ওয়ালেটে যোগ করার জন্য নিচের বাটনে ট্যাপ করুন।'
                : 'পরবর্তী স্পিনের জন্য অপেক্ষা করুন অথবা অতিরিক্ত স্পিন করুন!'}
            </p>

            <button
              type="button"
              onClick={handleClaimPrize}
              disabled={claimed || isClaiming}
              className="mt-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {claimed ? (
                <span>{claimStatusText || '✓ ব্যালেন্সে যোগ হয়েছে!'}</span>
              ) : (
                <span>{winningSlice.actualCreditedValue > 0 ? '✓ এখনই ব্যালেন্সে নিন' : 'ঠিক আছে'}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
