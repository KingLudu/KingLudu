import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Volume2,
  VolumeX,
  Trophy,
  HelpCircle,
  RotateCcw,
  Play,
  Sparkles,
  Clock,
  Pause,
  Crown,
  Shield,
  Star,
  Flame,
  Award,
  Sliders,
  CheckCircle2,
  Users,
  Gamepad2,
  Dices,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GameResult,
  Pawn,
  Player,
  PlayerColor,
  ScreenType,
  ChatMessage,
  LudoRulesConfig,
  DEFAULT_LUDO_RULES,
} from '../../types';
import {
  createInitialPawns,
  getMovablePawns,
  getPawnGlobalPosition,
  isSafePosition,
  selectBestBotPawn,
} from '../../utils/ludoEngine';
import { getPawnGridCoord } from '../../utils/ludoCoordinates';
import { getRandomOpponents } from '../../utils/playerNames';
import { Dice } from '../Ludo/Dice';
import { sounds } from '../../utils/soundEffects';
import { LudoBoard } from '../Ludo/LudoBoard';
import { GameChat } from '../Ludo/GameChat';
import { PinPawn } from '../Ludo/PinPawn';
import { GameRulesModal } from '../Modals/GameRulesModal';
import { requestAppFullscreen } from '../../utils/fullscreen';

export interface LudoGameScreenProps {
  roomCode: string;
  entryFee: number;
  totalPrize: number;
  userPlayer: Player;
  opponentPlayer: Player;
  playersCount?: 2 | 3 | 4;
  gameMode?: 'vs_ai' | 'pass_n_play' | 'ai_vs_ai';
  aiDifficulty?: 'Easy' | 'Medium' | 'Hard';
  companyWinRatePercent?: number;
  playerWinRatePercent?: number;
  platformCommissionPercent?: number;
  gameType?: 'Classic' | 'Quick';
  rules?: LudoRulesConfig;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  isMobileFrame?: boolean;
  onToggleMobileFrame?: () => void;
  onFinishGame: (result: GameResult) => void;
  onNavigate: (screen: ScreenType) => void;
}

// Official Clockwise Ludo Turn Order: Red (Top-Left) → Green (Top-Right) → Yellow (Bottom-Right) → Blue (Bottom-Left)
const LUDO_TURN_ORDER: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

export const LudoGameScreen: React.FC<LudoGameScreenProps> = ({
  roomCode,
  entryFee,
  totalPrize,
  userPlayer,
  opponentPlayer,
  playersCount = 4,
  gameMode = 'pass_n_play',
  aiDifficulty = 'Medium',
  companyWinRatePercent = 55,
  playerWinRatePercent = 45,
  platformCommissionPercent = 10,
  gameType = 'Classic',
  rules = DEFAULT_LUDO_RULES,
  soundEnabled = true,
  onToggleSound,
  isMobileFrame,
  onToggleMobileFrame,
  onFinishGame,
  onNavigate,
}) => {
  // Platform profit / commission bounded 5% to 20%
  const effectiveCommission = Math.min(20, Math.max(5, platformCommissionPercent ?? 10));
  const calculatedPlatformFee = Math.round(totalPrize * (effectiveCommission / 100));
  const calculatedNetPrize = totalPrize - calculatedPlatformFee;

  // Real Player 45% default win rate against bot/computer (Adjustable from Admin Panel 10% - 90%)
  const effectivePlayerWinRate = playerWinRatePercent !== undefined
    ? Math.min(90, Math.max(10, playerWinRatePercent))
    : (companyWinRatePercent !== undefined ? Math.min(90, Math.max(10, 100 - companyWinRatePercent)) : 45);

  const isPlayerTargetedWinRef = useRef<boolean>(
    Math.random() * 100 < effectivePlayerWinRate
  );
  // Evaluated per match: if not player targeted, bot has advantage
  const isBotTargetedWinRef = useRef<boolean>(!isPlayerTargetedWinRef.current);
  const [activeRules, setActiveRules] = useState<LudoRulesConfig>({
    ...rules,
    pawnsToWin: gameType === 'Quick' ? 1 : rules.pawnsToWin,
  });

  // Current Game Mode: Pass 'n Play (all human) vs Solo vs AI
  const [currentGameMode, setCurrentGameMode] = useState<'pass_n_play' | 'vs_ai' | 'ai_vs_ai'>(gameMode);
  const isPassNPlay = currentGameMode === 'pass_n_play';
  const isAiVsAi = currentGameMode === 'ai_vs_ai';

  // Opponents Pool
  const [randomOpponents] = useState(() => getRandomOpponents(3));

  // Player Roster
  const activePlayersList: Player[] = React.useMemo(() => {
    const p1: Player = {
      ...userPlayer,
      color: 'blue',
      name: userPlayer.name || (isPassNPlay ? 'Player 1 (Blue)' : 'Player 1'),
      isBot: isAiVsAi,
    };

    const p2: Player = {
      id: randomOpponents[0].id,
      name: isPassNPlay ? 'Player 2 (Red)' : randomOpponents[0].name,
      avatarUrl: randomOpponents[0].avatarUrl,
      color: 'red',
      isBot: !isPassNPlay,
    };

    const p3: Player = {
      id: opponentPlayer.name ? opponentPlayer.id : randomOpponents[1].id,
      name: isPassNPlay ? 'Player 3 (Green)' : (opponentPlayer.name || randomOpponents[1].name),
      avatarUrl: opponentPlayer.avatarUrl || randomOpponents[1].avatarUrl,
      color: 'green',
      isBot: !isPassNPlay,
    };

    const p4: Player = {
      id: randomOpponents[2].id,
      name: isPassNPlay ? 'Player 4 (Yellow)' : randomOpponents[2].name,
      avatarUrl: randomOpponents[2].avatarUrl,
      color: 'yellow',
      isBot: !isPassNPlay,
    };

    if (playersCount === 2) {
      return [p1, p3];
    } else if (playersCount === 3) {
      return [p1, p2, p3];
    } else {
      return [p1, p2, p3, p4];
    }
  }, [userPlayer, opponentPlayer, randomOpponents, isPassNPlay, isAiVsAi, playersCount]);

  const player1 = activePlayersList.find((p) => p.color === 'blue') || {
    ...userPlayer,
    color: 'blue' as PlayerColor,
    name: 'Player 1 (Blue)',
    isBot: isAiVsAi,
  };

  const player2 = activePlayersList.find((p) => p.color === 'red') || {
    id: randomOpponents[0].id,
    name: isPassNPlay ? 'Player 2 (Red)' : randomOpponents[0].name,
    avatarUrl: randomOpponents[0].avatarUrl,
    color: 'red' as PlayerColor,
    isBot: !isPassNPlay,
  };

  const player3 = activePlayersList.find((p) => p.color === 'green') || {
    id: opponentPlayer.id || randomOpponents[1].id,
    name: isPassNPlay ? 'Player 3 (Green)' : (opponentPlayer.name || randomOpponents[1].name),
    avatarUrl: opponentPlayer.avatarUrl || randomOpponents[1].avatarUrl,
    color: 'green' as PlayerColor,
    isBot: !isPassNPlay,
  };

  const player4 = activePlayersList.find((p) => p.color === 'yellow') || {
    id: randomOpponents[2].id,
    name: isPassNPlay ? 'Player 4 (Yellow)' : randomOpponents[2].name,
    avatarUrl: randomOpponents[2].avatarUrl,
    color: 'yellow' as PlayerColor,
    isBot: !isPassNPlay,
  };

  // State
  const [pawns, setPawns] = useState<Pawn[]>(() => {
    const initial = createInitialPawns();
    const activeColors = activePlayersList.map((p) => p.color);
    return initial.filter((p) => activeColors.includes(p.color));
  });

  const [turn, setTurn] = useState<PlayerColor>(() => {
    const activeColors = activePlayersList.map((p) => p.color);
    return LUDO_TURN_ORDER.find((c) => activeColors.includes(c)) || 'red';
  });

  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [movablePawns, setMovablePawns] = useState<Pawn[]>([]);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [turnNotice, setTurnNotice] = useState<string>('King Ludo খেলায় আপনাকে স্বাগতম! 👑');
  const [consecutiveSixCount, setConsecutiveSixCount] = useState<number>(0);
  const [isPawnMoving, setIsPawnMoving] = useState(false);
  const [finishedRankings, setFinishedRankings] = useState<Player[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(activeRules.turnTimerSeconds || 15);
  const [winnerResult, setWinnerResult] = useState<GameResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderName: 'King Ludo', text: 'স্বাগতম রাজকীয় লুডো ম্যাচে! 👑 শুভকামনা!', time: '10:00' },
  ]);

  // ⏱️ Auto-Forfeit on Inactivity (60 Seconds Threshold)
  const [inactiveSeconds, setInactiveSeconds] = useState<number>(0);
  const [isForfeited, setIsForfeited] = useState<boolean>(false);
  const lastUserActivityRef = useRef<number>(Date.now());
  const forfeitTriggeredRef = useRef<boolean>(false);

  const resetUserActivity = useCallback(() => {
    lastUserActivityRef.current = Date.now();
    setInactiveSeconds(0);
  }, []);

  // Listen for user interactions (clicks, taps, keys) to mark user as active
  useEffect(() => {
    const handleActivity = () => {
      if (!isForfeited && !winnerResult) {
        lastUserActivityRef.current = Date.now();
        setInactiveSeconds(0);
      }
    };

    window.addEventListener('pointerdown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isForfeited, winnerResult]);

  // Reset inactivity when bot takes its turn so human user isn't penalized during AI moves
  useEffect(() => {
    const activePlayerObj = activePlayersList.find((p) => p.color === turn);
    if (activePlayerObj?.isBot) {
      lastUserActivityRef.current = Date.now();
      setInactiveSeconds(0);
    }
  }, [turn, activePlayersList]);

  // 60-Second Inactivity Auto-Forfeit Watcher
  useEffect(() => {
    if (winnerResult || isPaused || isForfeited) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastUserActivityRef.current) / 1000);
      setInactiveSeconds(elapsed);

      if (elapsed >= 60 && !forfeitTriggeredRef.current && !winnerResult) {
        forfeitTriggeredRef.current = true;
        setIsForfeited(true);
        if (soundOn) {
          sounds.playPenaltyBuzzer();
        }

        // User forfeited; declare opponent as winner
        const opponentWinner =
          activePlayersList.find((p) => p.color !== player1.color) || opponentPlayer;
        const remainingPlayers = activePlayersList.filter((p) => p.color !== player1.color);
        const forfeitRankings = [
          opponentWinner,
          ...remainingPlayers.filter((p) => p.color !== opponentWinner.color),
          player1,
        ];
        finishedRankingsRef.current = forfeitRankings;
        setFinishedRankings(forfeitRankings);

        const forfeitResult: GameResult = {
          winner: opponentWinner,
          totalPrize,
          platformFee: calculatedPlatformFee,
          netPrize: calculatedNetPrize,
          isUserWinner: false,
        };

        setTurnNotice('❌ নিষ্ক্রিয়তার কারণে ম্যাচ বাজেয়াপ্ত (Auto-Forfeit)! আপনি ৬০ সেকেন্ডের বেশি সময় নিষ্ক্রিয় ছিলেন।');
        setWinnerResult(forfeitResult);
        onFinishGame(forfeitResult);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    winnerResult,
    isPaused,
    isForfeited,
    soundOn,
    activePlayersList,
    player1,
    opponentPlayer,
    totalPrize,
    onFinishGame,
  ]);

  // Fullscreen Display State & Handlers
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenNotice, setFullscreenNotice] = useState<string | null>(null);

  useEffect(() => {
    requestAppFullscreen().catch(() => {});
    const handleFullscreenChange = () => {
      const isDocFull = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );
      setIsFullscreen(isDocFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    try {
      const isCurrentlyFull = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );

      if (!isCurrentlyFull) {
        const docEl = document.documentElement as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void>;
          mozRequestFullScreen?: () => Promise<void>;
          msRequestFullscreen?: () => Promise<void>;
        };

        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
        setIsFullscreen(true);
        setFullscreenNotice('ফুল স্ক্রিন মোড চালু করা হয়েছে 📱✨');
        setTimeout(() => setFullscreenNotice(null), 2500);
      } else {
        const doc = document as Document & {
          webkitExitFullscreen?: () => Promise<void>;
          mozCancelFullScreen?: () => Promise<void>;
          msExitFullscreen?: () => Promise<void>;
        };

        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
        setIsFullscreen(false);
        setFullscreenNotice('নরমাল স্ক্রিন মোডে ফিরে আসা হয়েছে');
        setTimeout(() => setFullscreenNotice(null), 2500);
      }
    } catch (e) {
      console.warn('Fullscreen request failed or restricted in iframe environment', e);
      setIsFullscreen((prev) => !prev);
    }

    if (onToggleMobileFrame) {
      onToggleMobileFrame();
    }
  }, [onToggleMobileFrame]);

  // Synchronized Mutable Refs to eliminate race conditions and stale closures
  const pawnsRef = useRef<Pawn[]>(pawns);
  const turnRef = useRef<PlayerColor>(turn);
  const isPawnMovingRef = useRef(false);
  const isRollingRef = useRef(false);
  const hasRolledRef = useRef(false);
  const diceValueRef = useRef(diceValue);
  const movablePawnsRef = useRef<Pawn[]>([]);
  const consecutiveSixRef = useRef(0);
  const finishedRankingsRef = useRef<Player[]>(finishedRankings);
  const turnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    pawnsRef.current = pawns;
  }, [pawns]);

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  useEffect(() => {
    diceValueRef.current = diceValue;
  }, [diceValue]);

  useEffect(() => {
    finishedRankingsRef.current = finishedRankings;
  }, [finishedRankings]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    setSoundOn(soundEnabled);
  }, [soundEnabled]);

  // Turn Sequence Helper: Red → Green → Yellow → Blue → Red...
  const getNextTurnColor = useCallback(
    (currentColor: PlayerColor): PlayerColor => {
      const activeColors = activePlayersList.map((p) => p.color);
      const finishedColors = finishedRankingsRef.current.map((p) => p.color);
      const availableColors = LUDO_TURN_ORDER.filter(
        (c) => activeColors.includes(c) && !finishedColors.includes(c)
      );

      if (availableColors.length <= 1) return currentColor;

      const currentIdx = LUDO_TURN_ORDER.indexOf(currentColor);
      for (let step = 1; step <= 4; step++) {
        const candidate = LUDO_TURN_ORDER[(currentIdx + step) % 4];
        if (availableColors.includes(candidate)) {
          return candidate;
        }
      }
      return availableColors[0] || currentColor;
    },
    [activePlayersList]
  );

  // Clear all pending timeouts
  const clearPendingTimeouts = useCallback(() => {
    if (turnTimeoutRef.current) {
      clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }
    if (autoMoveTimeoutRef.current) {
      clearTimeout(autoMoveTimeoutRef.current);
      autoMoveTimeoutRef.current = null;
    }
  }, []);

  // Switch Turn to the Next Player
  const switchTurn = useCallback(() => {
    clearPendingTimeouts();

    hasRolledRef.current = false;
    isRollingRef.current = false;
    isPawnMovingRef.current = false;
    movablePawnsRef.current = [];
    consecutiveSixRef.current = 0;

    setHasRolled(false);
    setIsRolling(false);
    setMovablePawns([]);
    setIsPawnMoving(false);
    setConsecutiveSixCount(0);
    setTimeLeft(activeRules.turnTimerSeconds || 15);

    const nextColor = getNextTurnColor(turnRef.current);
    turnRef.current = nextColor;
    setTurn(nextColor);

    const nextPlayerObj = activePlayersList.find((p) => p.color === nextColor);
    if (nextPlayerObj) {
      setTurnNotice(`${nextPlayerObj.name} এর চাল! ডাইস রোল করুন 🎲`);
    }
  }, [clearPendingTimeouts, getNextTurnColor, activePlayersList, activeRules.turnTimerSeconds]);

  // Execute Direct Pawn Move with Step Animation and Rules Check
  const movePawnDirect = useCallback(
    (pawn: Pawn, steps: number) => {
      if (isPawnMovingRef.current || isPausedRef.current) return;
      clearPendingTimeouts();

      isPawnMovingRef.current = true;
      setIsPawnMoving(true);
      movablePawnsRef.current = [];
      setMovablePawns([]);

      const finalizeMove = (finalPawns: Pawn[]) => {
        let captured = false;
        let updatedPawns = [...finalPawns];

        const movedPawn = updatedPawns.find((p) => p.color === pawn.color && p.id === pawn.id);

        // Check Captures (Rule 5 & Rule 6)
        if (activeRules.captureOpponent && movedPawn && movedPawn.stepCount >= 0 && movedPawn.stepCount <= 50) {
          const destGlobalPos = getPawnGlobalPosition(movedPawn.color, movedPawn.stepCount);
          const isSafe = isSafePosition(destGlobalPos, activeRules);

          if (!isSafe) {
            updatedPawns = updatedPawns.map((p) => {
              if (p.color !== movedPawn.color && p.stepCount >= 0 && p.stepCount <= 50) {
                const oppGlobalPos = getPawnGlobalPosition(p.color, p.stepCount);
                if (oppGlobalPos === destGlobalPos) {
                  captured = true;
                  return { ...p, stepCount: -1 }; // Sent back to base!
                }
              }
              return p;
            });
          }
        }

        if (captured && soundOn) {
          sounds.playCaptureSound();
        }

        pawnsRef.current = updatedPawns;
        setPawns(updatedPawns);

        // Check Win Conditions (Rule 9)
        const targetFinishedCount = activeRules.pawnsToWin;
        const playerPawns = updatedPawns.filter((p) => p.color === pawn.color);
        const finishedCount = playerPawns.filter((p) => p.stepCount >= 56).length;
        const playerObj = activePlayersList.find((pl) => pl.color === pawn.color) || player1;

        if (finishedCount >= targetFinishedCount && !finishedRankingsRef.current.some((r) => r.color === pawn.color)) {
          if (soundOn) {
            sounds.playWinSound();
          }
          const newRankings = [...finishedRankingsRef.current, playerObj];
          finishedRankingsRef.current = newRankings;
          setFinishedRankings(newRankings);

          const remainingPlayableCount = activePlayersList.length - newRankings.length;

          if (remainingPlayableCount <= 1 || activePlayersList.length <= 2 || activeRules.pawnsToWin === 1) {
            // Complete Match Win!
            const unfinishedPlayers = activePlayersList.filter((p) => !newRankings.some((r) => r.color === p.color));
            const finalFullRankings = [...newRankings, ...unfinishedPlayers];
            finishedRankingsRef.current = finalFullRankings;
            setFinishedRankings(finalFullRankings);

            const winnerPlayer = finalFullRankings[0];
            const resultObj: GameResult = {
              winner: winnerPlayer,
              totalPrize,
              platformFee: calculatedPlatformFee,
              netPrize: calculatedNetPrize,
              isUserWinner: winnerPlayer.color === 'blue',
            };
            setWinnerResult(resultObj);
            onFinishGame(resultObj);
            isPawnMovingRef.current = false;
            setIsPawnMoving(false);
            return;
          } else {
            setTurnNotice(`👑 ${playerObj.name} #${newRankings.length} Finished! খেলা চলছে...`);
            turnTimeoutRef.current = setTimeout(() => {
              switchTurn();
            }, 1200);
            isPawnMovingRef.current = false;
            setIsPawnMoving(false);
            return;
          }
        }

        // Check Bonus Turns (Rule 2 & Rule 7)
        const rolledSix = steps === 6 && activeRules.bonusOnSix;
        const captureBonus = captured && activeRules.bonusOnCapture;
        const reachedGoal = movedPawn ? movedPawn.stepCount >= 56 && pawn.stepCount < 56 : false;
        const getBonusTurn = rolledSix || captureBonus || reachedGoal;

        if (getBonusTurn) {
          hasRolledRef.current = false;
          isPawnMovingRef.current = false;
          setHasRolled(false);
          setIsPawnMoving(false);
          setMovablePawns([]);
          setTimeLeft(activeRules.turnTimerSeconds || 15);

          if (reachedGoal) {
            if (soundOn) sounds.playHomeReached();
            setTurnNotice('👑 গুটি হোমে প্রবেশ করেছে! অতিরিক্ত বোনাস চাল 🎲');
          } else if (captured) {
            setTurnNotice('⚔️ গুটি কাটা পড়েছে! অতিরিক্ত বোনাস চাল 🎲');
          } else {
            setTurnNotice('🔥 ছক্কা উঠেছে! অতিরিক্ত বোনাস চাল 🎲');
          }
        } else {
          switchTurn();
        }
      };

      // Case 1: Pawn in Base (-1) moving to Start (0) on a 6
      if (pawn.stepCount === -1) {
        if (soundOn) sounds.playPawnStep();
        const updated = pawnsRef.current.map((p) =>
          p.color === pawn.color && p.id === pawn.id ? { ...p, stepCount: 0 } : p
        );
        pawnsRef.current = updated;
        setPawns(updated);
        setTimeout(() => finalizeMove(updated), 240);
        return;
      }

      // Case 2: Smooth step-by-step movement animation
      let currentStepIndex = 0;
      const stepDuration = activeRules.gameSpeed === 'turbo' ? 90 : activeRules.gameSpeed === 'fast' ? 120 : 150;

      const interval = setInterval(() => {
        currentStepIndex += 1;
        if (soundOn) sounds.playPawnStep();

        const nextPawns = pawnsRef.current.map((p) => {
          if (p.color === pawn.color && p.id === pawn.id) {
            return { ...p, stepCount: Math.min(p.stepCount + 1, 56) };
          }
          return p;
        });

        pawnsRef.current = nextPawns;
        setPawns(nextPawns);

        if (currentStepIndex >= steps) {
          clearInterval(interval);
          setTimeout(() => finalizeMove(nextPawns), 140);
        }
      }, stepDuration);
    },
    [
      activeRules,
      clearPendingTimeouts,
      soundOn,
      activePlayersList,
      player1,
      totalPrize,
      onFinishGame,
      switchTurn,
    ]
  );

  // Manual Pawn Click Handler
  const handlePawnClick = useCallback(
    (pawn: Pawn) => {
      if (pawn.color !== turnRef.current || !hasRolledRef.current || isPawnMovingRef.current || isPausedRef.current) {
        return;
      }

      const isMovable = movablePawnsRef.current.some((mp) => mp.id === pawn.id && mp.color === pawn.color);
      if (!isMovable) return;

      resetUserActivity();
      clearPendingTimeouts();
      movePawnDirect(pawn, diceValueRef.current);
    },
    [clearPendingTimeouts, movePawnDirect, resetUserActivity]
  );

  // Roll Dice Action Handler
  const handleRollDice = useCallback(() => {
    const activeColor = turnRef.current;
    const activePlayerObj = activePlayersList.find((p) => p.color === activeColor);
    if (!activePlayerObj) return;
    if (hasRolledRef.current || isRollingRef.current || isPawnMovingRef.current || winnerResult || isPausedRef.current) {
      return;
    }

    resetUserActivity();
    clearPendingTimeouts();

    isRollingRef.current = true;
    setIsRolling(true);

    if (soundOn) sounds.playDiceRoll();

    turnTimeoutRef.current = setTimeout(() => {
      let val = Math.floor(Math.random() * 6) + 1;

      const hasBots = activePlayersList.some((p) => p.isBot);
      const isRiggedForBot = hasBots && isBotTargetedWinRef.current;

      // Smart Assist for Bot Players in vs_ai mode (90% Computer/Bot Win Rate)
      if (activePlayerObj.isBot) {
        const botPawns = pawnsRef.current.filter((p) => p.color === activeColor);
        const allInBase = botPawns.every((p) => p.stepCount === -1);
        const hasInBase = botPawns.some((p) => p.stepCount === -1);
        const activeCount = botPawns.filter((p) => p.stepCount >= 0 && p.stepCount < 56).length;

        // Check if any roll 1..6 immediately finishes a pawn into Home Goal (step 56)
        let winningRoll: number | null = null;
        for (let d = 1; d <= 6; d++) {
          if (botPawns.some((p) => p.stepCount >= 0 && p.stepCount + d === 56)) {
            winningRoll = d;
            break;
          }
        }

        // Check if any roll 1..6 captures an opponent's pawn
        let captureRoll: number | null = null;
        for (let d = 1; d <= 6; d++) {
          const movables = getMovablePawns(pawnsRef.current, activeColor, d, activeRules);
          const canCap = movables.some((p) => {
            if (p.stepCount < 0) return false;
            const destStep = p.stepCount + d;
            if (destStep > 50) return false;
            const destGlobalPos = getPawnGlobalPosition(p.color, destStep);
            if (isSafePosition(destGlobalPos, activeRules)) return false;
            return pawnsRef.current.some((opp) => {
              if (opp.color === p.color || opp.stepCount < 0 || opp.stepCount > 50) return false;
              return getPawnGlobalPosition(opp.color, opp.stepCount) === destGlobalPos;
            });
          });
          if (canCap) {
            captureRoll = d;
            break;
          }
        }

        // Check if any roll reaches safe star or home stretch (steps 51..55)
        let safeOrHomeRoll: number | null = null;
        for (let d = 1; d <= 6; d++) {
          const movables = getMovablePawns(pawnsRef.current, activeColor, d, activeRules);
          const canReachSafe = movables.some((p) => {
            if (p.stepCount < 0) return false;
            const destStep = p.stepCount + d;
            if (destStep >= 51 && destStep <= 55) return true;
            if (destStep <= 50) {
              const destGlobal = getPawnGlobalPosition(p.color, destStep);
              return isSafePosition(destGlobal, activeRules);
            }
            return false;
          });
          if (canReachSafe) {
            safeOrHomeRoll = d;
            break;
          }
        }

        if (consecutiveSixRef.current >= 2) {
          // Never get penalised on 3 consecutive 6s
          val = Math.floor(Math.random() * 5) + 1;
        } else if (winningRoll && (isRiggedForBot ? Math.random() < 0.96 : Math.random() < 0.85)) {
          val = winningRoll;
        } else if (captureRoll && (isRiggedForBot ? Math.random() < 0.94 : Math.random() < 0.75)) {
          val = captureRoll;
        } else if (allInBase && (isRiggedForBot ? Math.random() < 0.90 : Math.random() < 0.7)) {
          val = 6;
        } else if (hasInBase && activeCount < 2 && (isRiggedForBot ? Math.random() < 0.75 : Math.random() < 0.45)) {
          val = 6;
        } else if (safeOrHomeRoll && isRiggedForBot && Math.random() < 0.65) {
          val = safeOrHomeRoll;
        } else if (isRiggedForBot && Math.random() < 0.55) {
          // Accelerate bot forward with 4, 5, or 6
          const highRolls = [4, 5, 6];
          val = highRolls[Math.floor(Math.random() * highRolls.length)];
        }
      } else if (isRiggedForBot) {
        // Human player turn under 90% bot win mode
        const humanPawns = pawnsRef.current.filter((p) => p.color === activeColor);

        // Prevent human from capturing bot pawns in 85% of cases
        const willCaptureBot = () => {
          const movables = getMovablePawns(pawnsRef.current, activeColor, val, activeRules);
          return movables.some((p) => {
            if (p.stepCount < 0) return false;
            const destStep = p.stepCount + val;
            if (destStep > 50) return false;
            const destGlobal = getPawnGlobalPosition(p.color, destStep);
            if (isSafePosition(destGlobal, activeRules)) return false;
            return pawnsRef.current.some((opp) => {
              if (opp.color === p.color || opp.stepCount < 0 || opp.stepCount > 50) return false;
              const oppPlayer = activePlayersList.find((pl) => pl.color === opp.color);
              return oppPlayer?.isBot && getPawnGlobalPosition(opp.color, opp.stepCount) === destGlobal;
            });
          });
        };

        if (willCaptureBot() && Math.random() < 0.85) {
          const nonCaptureRolls = [1, 2, 3, 4, 5, 6].filter((testD) => {
            if (testD === val) return false;
            const movables = getMovablePawns(pawnsRef.current, activeColor, testD, activeRules);
            return !movables.some((p) => {
              if (p.stepCount < 0) return false;
              const destStep = p.stepCount + testD;
              if (destStep > 50) return false;
              const destGlobal = getPawnGlobalPosition(p.color, destStep);
              if (isSafePosition(destGlobal, activeRules)) return false;
              return pawnsRef.current.some((opp) => {
                if (opp.color === p.color || opp.stepCount < 0 || opp.stepCount > 50) return false;
                const oppPlayer = activePlayersList.find((pl) => pl.color === opp.color);
                return oppPlayer?.isBot && getPawnGlobalPosition(opp.color, opp.stepCount) === destGlobal;
              });
            });
          });
          if (nonCaptureRolls.length > 0) {
            val = nonCaptureRolls[Math.floor(Math.random() * nonCaptureRolls.length)];
          }
        }

        // Delay human from finishing the match (step 56) before bot completes
        const willWinMatch = humanPawns.some((p) => p.stepCount >= 0 && p.stepCount + val === 56);
        if (willWinMatch && Math.random() < 0.90) {
          const nonWinRolls = [1, 2, 3, 4, 5].filter(
            (d) => !humanPawns.some((p) => p.stepCount >= 0 && p.stepCount + d === 56)
          );
          if (nonWinRolls.length > 0) {
            val = nonWinRolls[Math.floor(Math.random() * nonWinRolls.length)];
          }
        }

        if (consecutiveSixRef.current >= 2) {
          val = Math.floor(Math.random() * 5) + 1;
        }
      } else if (isPlayerTargetedWinRef.current) {
        // Smart Assist for Real Human Player (45% default win rate against bot)
        const humanPawns = pawnsRef.current.filter((p) => p.color === activeColor);
        const allInBase = humanPawns.every((p) => p.stepCount === -1);
        const hasInBase = humanPawns.some((p) => p.stepCount === -1);
        const activeCount = humanPawns.filter((p) => p.stepCount >= 0 && p.stepCount < 56).length;

        // Check if any roll directly completes a pawn to Home Goal
        let winningRoll: number | null = null;
        for (let d = 1; d <= 6; d++) {
          if (humanPawns.some((p) => p.stepCount >= 0 && p.stepCount + d === 56)) {
            winningRoll = d;
            break;
          }
        }

        // Check if human can capture bot
        let captureRoll: number | null = null;
        for (let d = 1; d <= 6; d++) {
          const movables = getMovablePawns(pawnsRef.current, activeColor, d, activeRules);
          const canCap = movables.some((p) => {
            if (p.stepCount < 0) return false;
            const destStep = p.stepCount + d;
            if (destStep > 50) return false;
            const destGlobalPos = getPawnGlobalPosition(p.color, destStep);
            if (isSafePosition(destGlobalPos, activeRules)) return false;
            return pawnsRef.current.some((opp) => {
              if (opp.color === p.color || opp.stepCount < 0 || opp.stepCount > 50) return false;
              return getPawnGlobalPosition(opp.color, opp.stepCount) === destGlobalPos;
            });
          });
          if (canCap) {
            captureRoll = d;
            break;
          }
        }

        if (consecutiveSixRef.current >= 2) {
          val = Math.floor(Math.random() * 5) + 1;
        } else if (winningRoll && Math.random() < 0.90) {
          val = winningRoll;
        } else if (captureRoll && Math.random() < 0.85) {
          val = captureRoll;
        } else if (allInBase && Math.random() < 0.80) {
          val = 6;
        } else if (hasInBase && activeCount < 2 && Math.random() < 0.60) {
          val = 6;
        }
      }

      diceValueRef.current = val;
      setDiceValue(val);
      isRollingRef.current = false;
      hasRolledRef.current = true;
      setIsRolling(false);
      setHasRolled(true);

      // Handle 6s & Consecutive 3-sixes Penalty (Rule 3)
      let nextSixCount = consecutiveSixRef.current;
      if (val === 6) {
        if (soundOn) sounds.playSixSound();
        nextSixCount = consecutiveSixRef.current + 1;
        consecutiveSixRef.current = nextSixCount;
        setConsecutiveSixCount(nextSixCount);
      } else {
        consecutiveSixRef.current = 0;
        setConsecutiveSixCount(0);
      }

      if (nextSixCount >= 3) {
        if (soundOn) sounds.playPenaltyBuzzer();
        setTurnNotice('⚠️ ৩টি ছক্কা পরপর তোলায় চাল বাতিল! টার্ন পরিবর্তন...');
        consecutiveSixRef.current = 0;
        setConsecutiveSixCount(0);
        movablePawnsRef.current = [];
        setMovablePawns([]);
        turnTimeoutRef.current = setTimeout(() => {
          setTurnNotice('');
          switchTurn();
        }, 1100);
        return;
      }

      const movables = getMovablePawns(pawnsRef.current, activeColor, val, activeRules);
      movablePawnsRef.current = movables;
      setMovablePawns(movables);

      // Case A: No valid move
      if (movables.length === 0) {
        setTurnNotice(`কোনো বৈধ চাল নেই (${val})! টার্ন পরিবর্তন হচ্ছে...`);
        turnTimeoutRef.current = setTimeout(() => {
          setTurnNotice('');
          switchTurn();
        }, 900);
        return;
      }

      // Case B: Exactly 1 valid move
      if (movables.length === 1) {
        const onlyPawn = movables[0];
        if (activePlayerObj.isBot) {
          setTurnNotice(`${activePlayerObj.name} চাল দিচ্ছে (${val})... 👑`);
          turnTimeoutRef.current = setTimeout(() => {
            movePawnDirect(onlyPawn, val);
          }, 600);
        } else {
          setTurnNotice(val === 6 ? `ছক্কা উঠেছে (${val})! গুটি এগিয়ে যাচ্ছে... 🎲` : `গুটি চাল দেওয়া হচ্ছে (${val})... 🎲`);
          // Smooth auto-move fallback after 700ms or instant manual tap
          autoMoveTimeoutRef.current = setTimeout(() => {
            if (hasRolledRef.current && !isPawnMovingRef.current) {
              movePawnDirect(onlyPawn, val);
            }
          }, 700);
        }
        return;
      }

      // Case C: Multiple valid moves (2, 3, or 4 options)
      if (activePlayerObj.isBot) {
        setTurnNotice(`${activePlayerObj.name} চিন্তা করছে (${val})... 👑`);
        turnTimeoutRef.current = setTimeout(() => {
          const selectedPawn = selectBestBotPawn(
            movables,
            pawnsRef.current,
            val,
            isRiggedForBot ? 'Hard' : aiDifficulty,
            activeRules
          );
          if (selectedPawn) {
            if (val === 6 && Math.random() < 0.35) {
              const botChats = ['রাজকীয় ছক্কা! 👑🎲', 'ইয়েস! ৬ পাইলাম 🔥', 'চমৎকার চাল!', 'King Ludo তে আমিই সেরা! 😎'];
              const randomText = botChats[Math.floor(Math.random() * botChats.length)];
              setMessages((prev) => [
                ...prev,
                {
                  id: `msg_${Date.now()}`,
                  senderName: activePlayerObj.name,
                  text: randomText,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }
            movePawnDirect(selectedPawn, val);
          }
        }, 750);
      } else {
        setTurnNotice(
          val === 6
            ? `ছক্কা উঠেছে! যে গুটি চালাতে চান ট্যাপ করুন (${val}) 🎲`
            : `যেকোনো একটি গুটি সিলেক্ট করে চাল দিন (${val}) 🎲`
        );
      }
    }, 450);
  }, [
    activePlayersList,
    activeRules,
    aiDifficulty,
    clearPendingTimeouts,
    movePawnDirect,
    soundOn,
    switchTurn,
    winnerResult,
  ]);

  // Turn Countdown Timer (1s ticks)
  useEffect(() => {
    if (winnerResult || isPawnMoving || isRolling || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, hasRolled, isPawnMoving, isRolling, winnerResult, isPaused]);

  // Handle Timeout (Auto-play when timer hits 0)
  useEffect(() => {
    if (timeLeft === 0 && !winnerResult && !isPawnMoving && !isRolling && !isPaused) {
      if (!hasRolledRef.current) {
        handleRollDice();
      } else if (movablePawnsRef.current.length > 0) {
        const bestPawn = selectBestBotPawn(movablePawnsRef.current, pawnsRef.current, diceValueRef.current, aiDifficulty, activeRules);
        if (bestPawn) {
          movePawnDirect(bestPawn, diceValueRef.current);
        } else {
          switchTurn();
        }
      } else {
        switchTurn();
      }
      setTimeLeft(activeRules.turnTimerSeconds || 15);
    }
  }, [
    timeLeft,
    winnerResult,
    isPawnMoving,
    isRolling,
    isPaused,
    handleRollDice,
    movePawnDirect,
    switchTurn,
    aiDifficulty,
    activeRules,
  ]);

  // Bot Turn Automation (Initial Roll Trigger for AI Players)
  useEffect(() => {
    const activeColor = turn;
    const activePlayerObj = activePlayersList.find((p) => p.color === activeColor);
    if (!activePlayerObj || !activePlayerObj.isBot || winnerResult || isPawnMoving || isPaused) return;

    if (!hasRolled && !isRolling) {
      const rollDelay = Math.floor(650 + Math.random() * 500);
      const timer = setTimeout(() => {
        if (turnRef.current === activeColor && !hasRolledRef.current && !isRollingRef.current) {
          handleRollDice();
        }
      }, rollDelay);
      return () => clearTimeout(timer);
    }
  }, [turn, hasRolled, isRolling, isPawnMoving, winnerResult, isPaused, activePlayersList, handleRollDice]);

  // Restart Match
  const handleRestartGame = () => {
    clearPendingTimeouts();
    hasRolledRef.current = false;
    isRollingRef.current = false;
    isPawnMovingRef.current = false;
    movablePawnsRef.current = [];
    consecutiveSixRef.current = 0;
    finishedRankingsRef.current = [];

    const initial = createInitialPawns();
    const activeColors = activePlayersList.map((p) => p.color);
    const filteredInitial = initial.filter((p) => activeColors.includes(p.color));

    pawnsRef.current = filteredInitial;
    setPawns(filteredInitial);

    const firstColor = LUDO_TURN_ORDER.find((c) => activeColors.includes(c)) || 'red';
    turnRef.current = firstColor;
    setTurn(firstColor);

    setIsForfeited(false);
    forfeitTriggeredRef.current = false;
    lastUserActivityRef.current = Date.now();
    setInactiveSeconds(0);
    setFinishedRankings([]);
    setWinnerResult(null);
    setHasRolled(false);
    setIsRolling(false);
    setIsPawnMoving(false);
    setIsPaused(false);
    setMovablePawns([]);
    setTimeLeft(activeRules.turnTimerSeconds || 15);
    setConsecutiveSixCount(0);
    setTurnNotice('রাজকীয় নতুন ম্যাচ শুরু হয়েছে! 👑');
  };

  const handleSendChatMessage = (text: string, isEmoji?: boolean) => {
    resetUserActivity();
    const activePlayerObj = activePlayersList.find((p) => p.color === turn) || userPlayer;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: activePlayerObj.name,
      text,
      isEmoji,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const activePlayer = activePlayersList.find((p) => p.color === turn) || player1;
  const canActivePlayerRoll = !hasRolled && !isRolling && !isPawnMoving && !isPaused && !activePlayer.isBot;

  // Corner Player Card
  const renderCornerPlayer = (p: Player, position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const cornerBorderStyles: Record<string, string> = {
      'top-left': 'rounded-t-2xl rounded-b-md border-red-500/90 shadow-[0_-4px_12px_rgba(239,68,68,0.25)]',
      'top-right': 'rounded-t-2xl rounded-b-md border-emerald-500/90 shadow-[0_-4px_12px_rgba(16,185,129,0.25)]',
      'bottom-left': 'rounded-b-2xl rounded-t-md border-blue-500/90 shadow-[0_4px_12px_rgba(59,130,246,0.25)]',
      'bottom-right': 'rounded-b-2xl rounded-t-md border-amber-500/90 shadow-[0_4px_12px_rgba(245,158,11,0.25)]',
    };

    if (!activePlayersList.some((ap) => ap.color === p.color)) {
      return (
        <div
          className={`flex items-center justify-center p-1 border border-dashed border-amber-500/20 bg-purple-950/20 text-amber-300/40 text-[10px] font-bold w-full h-[52px] sm:h-[58px] ${cornerBorderStyles[position]}`}
        >
          <span>Slot Empty</span>
        </div>
      );
    }

    const isActiveTurn = turn === p.color;
    const isRightSide = position === 'top-right' || position === 'bottom-right';
    const isFinished = finishedRankings.some((r) => r.color === p.color);
    const finishedRankIdx = finishedRankings.findIndex((r) => r.color === p.color);
    const canClickToRoll = isActiveTurn && !hasRolled && !isRolling && !p.isBot && !isPawnMoving && !isPaused;

    const colorGradients: Record<PlayerColor, string> = {
      blue: 'from-blue-950 via-[#0b1744] to-blue-900',
      red: 'from-rose-950 via-[#3d081b] to-red-900',
      green: 'from-emerald-950 via-[#062919] to-emerald-900',
      yellow: 'from-amber-950 via-[#3d2a04] to-yellow-900',
    };

    return (
      <div className="relative w-full flex items-center justify-center">
        <div
          onClick={canClickToRoll ? handleRollDice : undefined}
          className={`relative flex items-center justify-between p-1 sm:p-1.5 border-2 bg-gradient-to-r ${
            colorGradients[p.color]
          } ${cornerBorderStyles[position]} shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-all w-full h-[52px] sm:h-[58px] ${
            isActiveTurn ? 'ring-3 ring-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-[1.02] z-20' : 'opacity-90'
          } ${canClickToRoll ? 'cursor-pointer active:scale-95 hover:brightness-110' : ''}`}
        >
          {isFinished && (
            <div className="absolute inset-0 z-40 bg-slate-950/85 rounded-xl backdrop-blur-xs flex items-center justify-center border-2 border-amber-400">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                👑 #{finishedRankIdx + 1} Finished
              </span>
            </div>
          )}

          {!isRightSide ? (
            <>
              {/* Left: Avatar & Name */}
              <div className="flex items-center gap-1.5 pl-0.5 overflow-hidden">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                  <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col text-left overflow-hidden max-w-[56px] sm:max-w-[70px]">
                  <span className="text-[10px] sm:text-xs font-black text-white truncate leading-tight">{p.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <PinPawn color={p.color} size={11} />
                    <span className="text-[9px] font-bold text-amber-200 capitalize">{p.color}</span>
                  </div>
                </div>
              </div>

              {/* Right: Dice Slot (Dial) */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 pr-0.5">
                {isActiveTurn ? (
                  <Dice
                    value={diceValue}
                    isRolling={isRolling && isActiveTurn}
                    disabled={!isActiveTurn || hasRolled || p.isBot}
                    onRoll={handleRollDice}
                    color={p.color}
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/80 border border-amber-400/30 flex items-center justify-center shadow-inner">
                    <PinPawn color={p.color} size={18} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Left: Dice Slot (Dial) */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 pl-0.5">
                {isActiveTurn ? (
                  <Dice
                    value={diceValue}
                    isRolling={isRolling && isActiveTurn}
                    disabled={!isActiveTurn || hasRolled || p.isBot}
                    onRoll={handleRollDice}
                    color={p.color}
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/80 border border-amber-400/30 flex items-center justify-center shadow-inner">
                    <PinPawn color={p.color} size={18} />
                  </div>
                )}
              </div>

              {/* Right: Avatar & Name */}
              <div className="flex items-center gap-1.5 pr-0.5 overflow-hidden justify-end">
                <div className="flex flex-col text-right overflow-hidden max-w-[56px] sm:max-w-[70px]">
                  <span className="text-[10px] sm:text-xs font-black text-white truncate leading-tight">{p.name}</span>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-[9px] font-bold text-amber-200 capitalize">{p.color}</span>
                    <PinPawn color={p.color} size={11} />
                  </div>
                </div>
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
                  <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Turn Indicator Pointer */}
        {isActiveTurn && !isFinished && (
          <motion.div
            initial={{ scale: 0.8, x: isRightSide ? 8 : -8 }}
            animate={{ scale: [1, 1.25, 1], x: isRightSide ? [4, 12, 4] : [-4, -12, -4] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            className={`absolute top-1/2 -translate-y-1/2 z-30 ${isRightSide ? '-right-5' : '-left-5'}`}
          >
            <div
              className={`w-0 h-0 border-y-[9px] border-y-transparent ${
                isRightSide
                  ? 'border-r-[15px] border-r-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                  : 'border-l-[15px] border-l-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
              }`}
            />
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`w-full min-h-full h-full flex-1 text-white flex flex-col items-center justify-center relative overflow-hidden select-none ${isFullscreen ? 'p-1 pb-1' : 'p-1 sm:p-2'}`}
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.92), rgba(6,51,20,0.92), rgba(3,24,9,0.96)), url('/images/green_abstract_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Ornament Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NORMAL MODE HEADER BAR (Hidden in Fullscreen) */}
      {!isFullscreen ? (
        <div className="w-full max-w-[370px] sm:max-w-[420px] mx-auto flex items-center justify-between py-1 bg-[#063314]/90 px-3 rounded-2xl border-2 border-amber-400/50 shadow-[0_4px_15px_rgba(0,0,0,0.6)] mb-1 z-20 backdrop-blur-md">
          <button
            onClick={() => setIsPaused(true)}
            className="p-1.5 rounded-xl bg-emerald-950/80 text-amber-300 hover:text-white border border-amber-400/40 flex items-center gap-1 font-bold text-xs transition cursor-pointer"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 fill-amber-300" />
          </button>

          <div className="text-center flex items-center gap-2">
            {/* Real Match Badge */}
            <div
              className="text-[10px] text-amber-300 font-black bg-emerald-950/90 px-2.5 py-1 rounded-xl border border-amber-400/50 flex items-center gap-1 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>রিয়েল ম্যাচ (ফি: ৳{entryFee})</span>
            </div>

            {/* Turn Countdown Timer */}
            <div
              className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl border shadow-md ${
                timeLeft <= 3
                  ? 'bg-red-600 border-red-300 text-white animate-bounce'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-200 text-slate-950'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRestartGame}
              className="p-1.5 rounded-xl bg-purple-950/80 text-slate-200 hover:text-white border border-purple-700/50 transition cursor-pointer"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowRulesModal(true)}
              className="p-1.5 rounded-xl bg-purple-950/80 text-amber-300 hover:text-white border border-amber-400/40 flex items-center gap-1 text-xs font-bold transition cursor-pointer"
              title="King Ludo Rules & Settings"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => {
                if (onToggleSound) onToggleSound();
                setSoundOn((prev) => !prev);
              }}
              className="p-1.5 rounded-xl bg-purple-950/80 text-amber-400 border border-purple-700/50 transition cursor-pointer"
              title="Sound"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-1.5 rounded-xl bg-purple-950/80 text-purple-200 hover:text-amber-300 border border-purple-700/50 relative transition cursor-pointer"
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* FULLSCREEN MINIMAL FLOATING OVERLAY BAR */
        <div className="w-full max-w-md mx-auto flex items-center justify-between py-1 px-2 z-30 mb-0.5">
          <button
            onClick={() => setIsPaused(true)}
            className="p-1.5 rounded-xl bg-purple-950/90 text-amber-300 border border-amber-400/50 shadow-md flex items-center gap-1 font-bold text-xs cursor-pointer active:scale-95 transition"
            title="Pause Menu"
          >
            <Pause className="w-3.5 h-3.5 fill-amber-300" />
            <span className="text-[10px]">পজ</span>
          </button>

          {/* Turn timer badge in Fullscreen */}
          <div
            className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-lg ${
              timeLeft <= 3
                ? 'bg-red-600 border-red-300 text-white animate-bounce'
                : 'bg-amber-400 border-amber-200 text-slate-950'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (onToggleSound) onToggleSound();
                setSoundOn((prev) => !prev);
              }}
              className="p-1.5 rounded-xl bg-purple-950/90 text-amber-400 border border-purple-700/60 shadow-md cursor-pointer active:scale-95 transition"
              title="Sound"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Exit Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/70 shadow-md hover:bg-amber-500/30 flex items-center gap-1 text-[10px] font-black cursor-pointer active:scale-95 transition"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>নরমাল ভিউ</span>
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN NOTIFICATION TOAST */}
      <AnimatePresence>
        {fullscreenNotice && (
          <motion.div
            key="fullscreen-notice-toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-950 via-amber-950 to-purple-950 border border-amber-400 text-amber-200 px-4 py-1.5 rounded-full text-xs font-black shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{fullscreenNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ AUTO-FORFEIT INACTIVITY WARNING BANNER (Alerts when >= 45s inactive, 15s to forfeit) */}
      <AnimatePresence>
        {!winnerResult && !isPaused && !isForfeited && inactiveSeconds >= 45 && (
          <motion.div
            key="inactivity-warning-banner"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-3 rounded-2xl border-2 border-amber-300 shadow-2xl text-white text-center animate-pulse"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-black/40 border border-amber-300 flex items-center justify-center font-black text-amber-300 text-sm">
                  {60 - inactiveSeconds}s
                </div>
                <div>
                  <h4 className="font-black text-xs text-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                    <span>নিষ্ক্রিয়তা সতর্কতা (Auto-Forfeit)</span>
                  </h4>
                  <p className="text-[10px] text-white/90 leading-tight mt-0.5">
                    আর {60 - inactiveSeconds} সেকেন্ড নিষ্ক্রিয় থাকলে ম্যাচ বাজেয়াপ্ত হবে!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetUserActivity}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow active:scale-95 transition whitespace-nowrap cursor-pointer"
              >
                আমি সক্রিয়
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* GAMEPLAY CENTRAL HUB (Directly connects player dial options with the Ludo board houses and fills middle gaps) */}
      <div className="w-full max-w-[370px] sm:max-w-[420px] mx-auto flex flex-col justify-center items-center z-10 px-0.5 py-0 my-0">
        {/* TOP ROW PLAYERS & CENTER MATCH HUB (Directly connected to the board corner houses) */}
        <div className="w-full flex items-center justify-between gap-1 mb-0.5 z-10 px-0.5">
          {/* Top-Left: Player 2 (Red House) Dial */}
          <div className="w-[42%] flex-shrink-0">
            {renderCornerPlayer(player2, 'top-left')}
          </div>

          {/* Center Top: Match Prize & Countdown Dial (Fills the gap between the two top players!) */}
          <div className="w-[16%] flex flex-col items-center justify-center bg-gradient-to-b from-[#180a3a] to-[#0d0522] border-2 border-amber-400/80 rounded-2xl py-1 px-0.5 shadow-lg text-center shrink-0 h-[52px] sm:h-[58px]">
            <span className="text-[8px] font-black text-amber-300 leading-tight flex items-center gap-0.5 justify-center">
              <Trophy className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>৳{totalPrize}</span>
            </span>
            <div
              className={`mt-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-full border shadow-sm ${
                timeLeft <= 3
                  ? 'bg-red-600 text-white border-red-300 animate-bounce'
                  : 'bg-amber-400 text-slate-950 border-amber-300'
              }`}
            >
              {timeLeft}s
            </div>
            <span className="text-[7.5px] text-purple-200 font-mono tracking-tighter mt-0.5 leading-none">
              #{roomCode ? roomCode.substring(0, 4) : 'LIVE'}
            </span>
          </div>

          {/* Top-Right: Player 3 (Green House) Dial */}
          <div className="w-[42%] flex-shrink-0">
            {renderCornerPlayer(player3, 'top-right')}
          </div>
        </div>

        {/* CENTER ROYAL LUDO BOARD */}
        <div className="w-full flex flex-col justify-center items-center relative z-10 my-0">
          <LudoBoard
            pawns={pawns}
            activeTurnColor={turn}
            movablePawns={movablePawns}
            onPawnClick={handlePawnClick}
            playersCount={playersCount}
          />
        </div>

        {/* BOTTOM ROW PLAYERS & CENTER GAME ACTION HUB (Directly connected to the board corner houses) */}
        <div className="w-full flex items-center justify-between gap-1 mt-0.5 z-10 px-0.5">
          {/* Bottom-Left: Player 1 (Blue House) Dial */}
          <div className="w-[42%] flex-shrink-0">
            {renderCornerPlayer(player1, 'bottom-left')}
          </div>

          {/* Center Bottom: In-Game Action Dial (Chat & Turn Indicator) */}
          <div className="w-[16%] flex flex-col items-center justify-center bg-gradient-to-b from-[#180a3a] to-[#0d0522] border-2 border-purple-500/80 rounded-2xl py-1 px-0.5 shadow-lg text-center shrink-0 h-[52px] sm:h-[58px]">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-1 rounded-xl bg-purple-900/80 hover:bg-amber-400 text-amber-300 hover:text-slate-950 transition active:scale-95 shadow cursor-pointer relative"
              title="Quick Chat & Emoji"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
            <span className="text-[7.5px] font-black text-amber-300 mt-0.5 tracking-tight leading-none">
              {turn === userPlayer.color ? 'আপনার চাল' : 'বট চালছে'}
            </span>
          </div>

          {/* Bottom-Right: Player 4 (Yellow House) Dial */}
          <div className="w-[42%] flex-shrink-0">
            {renderCornerPlayer(player4, 'bottom-right')}
          </div>
        </div>
      </div>

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#12082b] border-2 border-amber-400/90 w-full max-w-xs rounded-3xl p-5 space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
              <Pause className="w-6 h-6 fill-amber-300" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">খেলা সাময়িক বিরতি</h3>
              <p className="text-xs text-purple-200">গেম পজ করা হয়েছে। আপনার সিদ্ধান্ত সিলেক্ট করুন:</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>পুনরায় শুরু করুন (Resume)</span>
              </button>

              <button
                type="button"
                onClick={handleRestartGame}
                className="w-full py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-purple-500/40 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>রিস্টার্ট করুন (Restart)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full py-2 bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-red-500/40 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>নতুন গেম / লিভ করুন (Exit)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE CHAT OVERLAY */}
      {showChat && (
        <div className="absolute inset-x-3 bottom-16 z-50">
          <GameChat
            messages={messages}
            onSendMessage={handleSendChatMessage}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      {/* GAME RULES & SETTINGS MODAL */}
      <AnimatePresence>
        {showRulesModal && (
          <GameRulesModal
            key="game-rules-modal-overlay"
            initialMode={playersCount === 3 ? 4 : playersCount}
            rulesConfig={activeRules}
            onSaveRules={(updated) => setActiveRules(updated)}
            onClose={() => setShowRulesModal(false)}
          />
        )}
      </AnimatePresence>

      {/* RULE 10: PREMIUM ROYAL VICTORY CELEBRATION MODAL */}
      {winnerResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-b from-[#1b0a3d] via-[#12072f] to-[#070216] border-2 border-amber-400 w-full max-w-sm rounded-3xl p-6 space-y-4 text-center shadow-[0_0_60px_rgba(245,158,11,0.5)] relative overflow-hidden">
            {/* Animated Royal Glow Backdrop */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Fireworks / Stars Visuals */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-100 p-1 shadow-[0_0_30px_rgba(245,158,11,0.8)]">
                  <div className="w-full h-full rounded-[22px] bg-[#0c0422] flex items-center justify-center border-2 border-amber-400 overflow-hidden relative">
                    <img
                      src={winnerResult.winner.avatarUrl}
                      alt={winnerResult.winner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Crown on top of avatar */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-4 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-1.5 rounded-full shadow-lg border border-yellow-200"
                >
                  <Crown className="w-5 h-5 fill-slate-950 text-slate-950" />
                </motion.div>
              </motion.div>

              {isForfeited ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-300 text-xs font-black uppercase tracking-widest mt-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>MATCH AUTO-FORFEITED</span>
                  </div>

                  <h2 className="font-black text-2xl text-white tracking-tight drop-shadow-md">
                    {winnerResult.winner.name} Wins!
                  </h2>

                  <div className="bg-red-950/60 border border-red-500/50 p-2.5 rounded-xl text-center w-full">
                    <p className="text-xs text-red-300 font-bold">
                      ❌ ৬০ সেকেন্ড নিষ্ক্রিয়তার কারণে ম্যাচ বাজেয়াপ্ত হয়েছে!
                    </p>
                    <p className="text-[10px] text-red-200/80 mt-0.5">
                      খেলার মধ্যে ৬০ সেকেন্ড কোনো চাল না দেওয়ার কারণে ম্যাচ বাজেয়াপ্ত ও প্রতিপক্ষকে বিজয়ী ঘোষণা করা হয়েছে।
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs font-black uppercase tracking-widest mt-1">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>VICTORY CELEBRATION</span>
                  </div>

                  <h2 className="font-black text-2xl text-white tracking-tight drop-shadow-md">
                    {winnerResult.winner.name} Wins!
                  </h2>

                  <p className="text-xs text-amber-200/90 font-medium">
                    {winnerResult.isUserWinner
                      ? '👑 অভিনন্দন! আপনি এই রাজকীয় লুডো ম্যাচে একক চ্যাম্পিয়ন হয়েছেন!'
                      : `${winnerResult.winner.name} এই ম্যাচে চ্যাম্পিয়ন হয়েছেন!`}
                  </p>
                </>
              )}
            </div>

            {/* FULL LEADERBOARD RANKINGS */}
            <div className="bg-[#09031d] p-3.5 rounded-2xl border border-purple-800/60 space-y-2 relative z-10 text-left shadow-inner">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block border-b border-purple-800/60 pb-1 flex items-center justify-between">
                <span>Final Rankings</span>
                <span className="text-purple-300">King Ludo</span>
              </span>

              {finishedRankings.map((p, idx) => (
                <div
                  key={`rank-${p.color}-${p.id || idx}-${idx}`}
                  className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-amber-950/70 to-yellow-950/70 border-amber-500/60 text-amber-200'
                      : 'bg-purple-950/40 border-purple-800/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base w-5">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '4️⃣'}
                    </span>
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-7 h-7 rounded-lg object-cover border border-amber-300/60 shadow"
                    />
                    <span className="font-extrabold text-white text-xs truncate max-w-[120px]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PinPawn color={p.color} size={14} />
                    <span className="text-[10px] font-black text-amber-300 capitalize">{p.color}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10">
              <button
                type="button"
                onClick={handleRestartGame}
                className="py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:brightness-110 text-white rounded-2xl border border-emerald-300/50 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white rounded-2xl border border-purple-400/50 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Game Lobby</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


