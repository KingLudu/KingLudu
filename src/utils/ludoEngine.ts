import { DEFAULT_LUDO_RULES, LudoRulesConfig, Pawn, PlayerColor } from '../types';

// Standard 52-cell track indexing:
// Red starts at 0, Green starts at 13, Yellow starts at 26, Blue starts at 39.
export const COLOR_START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Safe positions on 52-cell track where pawns cannot be captured (stars)
export const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

/**
 * Calculates global track cell index for a pawn given its color and stepCount.
 * stepCount:
 *  - -1: In Base
 *  - 0..50: On main 52-cell track
 *  - 51..55: On home path (color-specific)
 *  - 56: Finished in Center Goal
 */
export function getPawnGlobalPosition(color: PlayerColor, stepCount: number): number {
  if (stepCount < 0) return -1; // Base
  if (stepCount >= 56) return 999; // Finished Goal

  if (stepCount <= 50) {
    const start = COLOR_START_POSITIONS[color];
    return (start + stepCount) % 52;
  }

  // Home stretch (steps 51 to 55)
  const colorCode: Record<PlayerColor, number> = { green: 100, yellow: 200, blue: 300, red: 400 };
  return colorCode[color] + (stepCount - 51);
}

export function isSafePosition(globalPos: number, rules: LudoRulesConfig = DEFAULT_LUDO_RULES): boolean {
  if (globalPos >= 100) return true; // Home stretch is always safe
  if (!rules.safeStarCells) return false;
  return SAFE_CELLS.includes(globalPos);
}

export function createInitialPawns(): Pawn[] {
  const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  const pawns: Pawn[] = [];

  colors.forEach((color) => {
    for (let i = 0; i < 4; i++) {
      pawns.push({
        id: i,
        color,
        position: -1,
        stepCount: -1,
      });
    }
  });

  return pawns;
}

export function getMovablePawns(
  pawns: Pawn[],
  color: PlayerColor,
  diceValue: number,
  rules: LudoRulesConfig = DEFAULT_LUDO_RULES
): Pawn[] {
  return pawns.filter((p) => {
    if (p.color !== color) return false;

    // Destination step count calculation
    let destStep = -1;
    if (p.stepCount === -1) {
      // Base pawn needs a 6 to open (or any number if openOnSixOnly is off)
      if (rules.openOnSixOnly && diceValue !== 6) return false;
      destStep = 0; // Starts at step 0
    } else {
      // Already in goal
      if (p.stepCount >= 56) return false;
      destStep = p.stepCount + diceValue;

      // Check goal entry rule
      if (rules.exactHomeRoll) {
        if (destStep > 56) return false;
      }
    }

    // Ludo Rule: সেফ স্টপ (৮টি নিরাপদ স্টার ও কালার স্টার্টিং ঘর), হোম গলি এবং সেন্টার গোলে একাধিক/ডাবল গুটি অবস্থান করতে পারবে।
    // সাধারণ অনিরাপদ ট্র্যাকে এক প্লেয়ারের দুটি গুটি একই ঘরে বসবে না যদি noSameColorOverlap সক্রিয় থাকে।
    if (rules.noSameColorOverlap !== false && destStep < 56) {
      const destGlobalPos = getPawnGlobalPosition(color, destStep);
      const isDestSafeStop = isSafePosition(destGlobalPos, rules);

      // If the destination is NOT a safe stop (star / color start / home stretch), enforce no overlap
      if (!isDestSafeStop) {
        const isBlockedBySameColorPawn = pawns.some(
          (otherPawn) =>
            otherPawn.color === color &&
            otherPawn.id !== p.id &&
            otherPawn.stepCount === destStep
        );
        if (isBlockedBySameColorPawn) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Checks if a player has won according to target pawns to win (4 for classic, 1 for quick)
 */
export function checkPlayerWin(
  pawns: Pawn[],
  color: PlayerColor,
  pawnsToWin: number = 4
): boolean {
  const finishedCount = pawns.filter((p) => p.color === color && p.stepCount >= 56).length;
  return finishedCount >= pawnsToWin;
}

/**
 * Calculates circular distance on the 52-cell track from fromPos to toPos in clockwise direction.
 */
export function getTrackDistance(fromPos: number, toPos: number): number {
  return (toPos - fromPos + 52) % 52;
}

/**
 * Calculates the probability (0 to 1) of an opponent capturing a pawn at a specific track position.
 * Takes into account:
 * - Safe cells and home corridor immunity
 * - Relative circular distance (1..6 steps reachable in 1 roll = 1/6 chance per threatening pawn)
 * - Home lane divergence: Opponent turning into home stretch at step 50 will NOT hit target on main track
 */
export function calculateCaptureProbability(
  targetGlobalPos: number,
  targetStep: number,
  allPawns: Pawn[],
  myColor: PlayerColor,
  rules: LudoRulesConfig = DEFAULT_LUDO_RULES
): number {
  // 1. Immunity check: Home stretch, goal, or safe star cells cannot be captured
  if (targetStep >= 51 || targetGlobalPos >= 100 || targetGlobalPos === 999) {
    return 0;
  }
  if (isSafePosition(targetGlobalPos, rules)) {
    return 0;
  }

  // 2. Scan all active opponent pawns on the 52-cell track
  const threateningPawns = allPawns.filter((p) => {
    if (p.color === myColor) return false;
    // Opponent must be on the main track (0..50)
    if (p.stepCount < 0 || p.stepCount > 50) return false;

    const oppStart = COLOR_START_POSITIONS[p.color];
    const oppGlobal = (oppStart + p.stepCount) % 52;
    const dist = getTrackDistance(oppGlobal, targetGlobalPos);

    // Can only attack if distance is within 1..6 steps
    if (dist < 1 || dist > 6) return false;

    // Home entry rule: if opponent reaches their home entry (step 50) before dist,
    // they enter their private home corridor and do NOT continue on the main track!
    if (p.stepCount + dist > 50) {
      return false;
    }

    return true;
  });

  if (threateningPawns.length === 0) {
    // Secondary check: Are any opponents 7..12 steps away (requiring a 6 + next roll)?
    const secondaryThreats = allPawns.filter((p) => {
      if (p.color === myColor || p.stepCount < 0 || p.stepCount > 50) return false;
      const oppStart = COLOR_START_POSITIONS[p.color];
      const oppGlobal = (oppStart + p.stepCount) % 52;
      const dist = getTrackDistance(oppGlobal, targetGlobalPos);
      return dist >= 7 && dist <= 12 && (p.stepCount + dist <= 50);
    });
    return secondaryThreats.length > 0 ? 0.04 * secondaryThreats.length : 0;
  }

  // Combined probability that at least one opponent rolls the exact required number (1 - (5/6)^n)
  const singleRollEscapeChance = Math.pow(5 / 6, threateningPawns.length);
  return 1 - singleRollEscapeChance;
}

/**
 * Evaluates the threat potential of moving to targetGlobalPos.
 * If landing 1..6 steps behind a vulnerable opponent pawn,
 * our bot gains high probability (1/6 = 16.7%) to capture them on the next turn.
 */
export function calculateThreatPotential(
  targetGlobalPos: number,
  targetStep: number,
  allPawns: Pawn[],
  myColor: PlayerColor,
  rules: LudoRulesConfig = DEFAULT_LUDO_RULES
): number {
  if (targetStep >= 51 || targetGlobalPos >= 100 || targetGlobalPos === 999) {
    return 0;
  }

  let totalThreatEV = 0;

  for (const opp of allPawns) {
    if (opp.color === myColor) continue;
    if (opp.stepCount < 0 || opp.stepCount > 50) continue;

    const oppStart = COLOR_START_POSITIONS[opp.color];
    const oppGlobal = (oppStart + opp.stepCount) % 52;

    // Opponent on a safe star cell cannot be captured
    if (isSafePosition(oppGlobal, rules)) continue;

    const dist = getTrackDistance(targetGlobalPos, oppGlobal);
    if (dist >= 1 && dist <= 6) {
      // We are 1..6 steps behind them!
      // Check if our path allows reaching them (we don't enter home corridor before dist)
      if (targetStep + dist <= 50) {
        // Expected Value = (1/6 chance of capturing next turn) * value of captured enemy
        const enemyValue = 280 + opp.stepCount * 4.5;
        totalThreatEV += (1 / 6) * enemyValue;
      }
    }
  }

  return totalThreatEV;
}

/**
 * Intelligent Bot Pawn Selection Algorithm with Probability Calculations
 */
export function selectBestBotPawn(
  movablePawns: Pawn[],
  allPawns: Pawn[],
  diceValue: number,
  difficulty: 'Easy' | 'Medium' | 'Hard' | string = 'Medium',
  rules: LudoRulesConfig = DEFAULT_LUDO_RULES
): Pawn {
  if (movablePawns.length === 1) return movablePawns[0];
  if (difficulty === 'Easy') {
    return movablePawns[Math.floor(Math.random() * movablePawns.length)];
  }

  // Count active pawns currently on board for this bot
  const myColor = movablePawns[0].color;
  const activePawnsOnBoard = allPawns.filter(
    (p) => p.color === myColor && p.stepCount >= 0 && p.stepCount < 56
  ).length;

  let bestScore = -999999;
  let bestPawn = movablePawns[0];

  for (const pawn of movablePawns) {
    let score = 0;
    const isBase = pawn.stepCount === -1;
    const newStep = isBase ? 0 : Math.min(56, pawn.stepCount + diceValue);
    const newGlobalPos = getPawnGlobalPosition(pawn.color, newStep);

    // Current pawn risk assessment
    const currentGlobalPos = isBase ? -1 : getPawnGlobalPosition(pawn.color, pawn.stepCount);
    const currentCaptureProb = isBase
      ? 0
      : calculateCaptureProbability(currentGlobalPos, pawn.stepCount, allPawns, myColor, rules);

    // New destination capture probability
    const newCaptureProb = calculateCaptureProbability(
      newGlobalPos,
      newStep,
      allPawns,
      myColor,
      rules
    );

    // ==========================================
    // 1. SUPREME GOAL / FINISH (Winning Condition)
    // ==========================================
    if (newStep === 56) {
      score += 1500;
    }

    // ==========================================
    // 2. GUARANTEED IMMEDIATE CAPTURE
    // ==========================================
    if (rules.captureOpponent && !isSafePosition(newGlobalPos, rules) && newGlobalPos < 100) {
      const opponentsAtDest = allPawns.filter(
        (p) =>
          p.color !== pawn.color &&
          p.stepCount >= 0 &&
          p.stepCount <= 50 &&
          getPawnGlobalPosition(p.color, p.stepCount) === newGlobalPos
      );

      if (opponentsAtDest.length > 0) {
        // High reward proportional to how much progress the opponent made + bonus turn
        const highestEnemyStep = Math.max(...opponentsAtDest.map((p) => p.stepCount));
        score += 650 + highestEnemyStep * 6.5 + 120;
      }
    }

    // ==========================================
    // 3. ENTERING 100% IMMUNE HOME CORRIDOR
    // ==========================================
    if (newStep >= 51 && pawn.stepCount < 51) {
      score += 420 + (56 - newStep) * 15;
    }

    // ==========================================
    // 4. REACHING SAFE STAR POSITION
    // ==========================================
    if (isSafePosition(newGlobalPos, rules)) {
      score += 220;
    }

    // ==========================================
    // 5. ESCAPING CURRENT IMMINENT DANGER (Risk Mitigation)
    // ==========================================
    if (currentCaptureProb > 0) {
      // Progress loss that would occur if captured
      const progressLossCost = 350 + pawn.stepCount * 5;
      const expectedLossAverted = (currentCaptureProb - newCaptureProb) * progressLossCost;
      score += expectedLossAverted;
    }

    // ==========================================
    // 6. PROBABILITY EXPOSURE PENALTY (Hard Mode)
    // ==========================================
    if (newCaptureProb > 0) {
      const vulnerabilityCost = 380 + newStep * 5.5;
      score -= newCaptureProb * vulnerabilityCost;
    }

    // ==========================================
    // 7. THREAT POSITIONING (Setting up Next-Turn Kill)
    // ==========================================
    const threatEV = calculateThreatPotential(newGlobalPos, newStep, allPawns, myColor, rules);
    score += threatEV;

    // ==========================================
    // 8. OPENING FROM BASE ON A 6
    // ==========================================
    if (isBase) {
      if (activePawnsOnBoard === 0) {
        score += 550; // Urgent need to get at least 1 pawn in play
      } else if (activePawnsOnBoard === 1) {
        score += 320;
      } else if (activePawnsOnBoard === 2) {
        score += 180;
      } else {
        score += 100;
      }

      // Check if start position is threatened
      if (newCaptureProb > 0) {
        score -= newCaptureProb * 300;
      }
    }

    // ==========================================
    // 9. PROGRESS ADVANCEMENT VALUE
    // ==========================================
    // Advancing closer to home is fundamentally positive
    score += newStep * 2.8;

    // Pawns close to home stretch get extra push
    if (newStep > 40 && newStep < 51) {
      score += (newStep - 40) * 8;
    }

    // ==========================================
    // DIFFICULTY ADAPTATION & HARD MODE ENHANCEMENTS
    // ==========================================
    if (difficulty === 'Hard') {
      // 1. Leader Targeting: Prioritize cutting the leading opponent's pawns
      const opponentPawns = allPawns.filter((p) => p.color !== myColor && p.stepCount >= 0);
      const leadingOpponentProgress = opponentPawns.reduce<Record<string, number>>((acc, p) => {
        acc[p.color] = (acc[p.color] || 0) + (p.stepCount >= 56 ? 100 : p.stepCount);
        return acc;
      }, {});
      
      const leaderColor = Object.entries(leadingOpponentProgress).sort((a, b) => b[1] - a[1])[0]?.[0];

      // If this move captures or threatens the leader's pawn, boost priority!
      if (leaderColor && rules.captureOpponent && newGlobalPos < 100 && !isSafePosition(newGlobalPos, rules)) {
        const capturesLeader = allPawns.some(
          (p) => p.color === leaderColor && p.stepCount <= 50 && getPawnGlobalPosition(p.color, p.stepCount) === newGlobalPos
        );
        if (capturesLeader) {
          score += 350; // Decisive tactical strike against the match leader
        }
      }

      // 2. Goal Spacing: Avoid crowding pawns on the same home-stretch step
      if (newStep >= 51 && newStep < 56) {
        const friendlyPawnAtStep = allPawns.some(
          (p) => p.color === myColor && p.id !== pawn.id && p.stepCount === newStep
        );
        if (friendlyPawnAtStep) {
          score -= 80; // Penalize stacking on home path to maximize odds of exact home rolls
        }
      }

      // 3. Consecutive Safe Harbor Strategy: Hard AI loves advancing pawns to safe star checkpoints
      if (isSafePosition(newGlobalPos, rules)) {
        score += 90;
      }
    } else {
      // In Medium mode, add slight random variance
      score += (Math.random() - 0.5) * 60;
    }

    if (score > bestScore) {
      bestScore = score;
      bestPawn = pawn;
    }
  }

  return bestPawn;
}
