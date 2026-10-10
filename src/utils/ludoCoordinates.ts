import { PlayerColor } from '../types';

export interface GridCoord {
  row: number; // 0..14
  col: number; // 0..14
  isBaseSocket?: boolean;
}

// 52 Main Track coordinates on a 15x15 grid (0-indexed)
// Track 0 starts at Red Start: (6,1)
export const TRACK_COORDINATES: GridCoord[] = [
  /* 0..4 (Red Start to Left-Top Elbow) */
  { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 },
  /* 5..10 (Going UP towards top) */
  { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 }, { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 6 },
  /* 11 (Top Turn) */
  { row: 0, col: 7 },
  /* 12..17 (Going DOWN top-right arm, Green Start at 13 = (1,8)) */
  { row: 0, col: 8 }, { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 },
  /* 18..23 (Going RIGHT top-right arm) */
  { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 }, { row: 6, col: 14 },
  /* 24 (Right Turn) */
  { row: 7, col: 14 },
  /* 25..30 (Going LEFT right-bottom arm, Yellow Start at 26 = (8,13)) */
  { row: 8, col: 14 }, { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9 },
  /* 31..36 (Going DOWN bottom-right arm) */
  { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 }, { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 8 },
  /* 37 (Bottom Turn) */
  { row: 14, col: 7 },
  /* 38..43 (Going UP bottom-left arm, Blue Start at 39 = (13,6)) */
  { row: 14, col: 6 }, { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 }, { row: 10, col: 6 }, { row: 9, col: 6 },
  /* 44..49 (Going LEFT bottom-left arm) */
  { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 }, { row: 8, col: 2 }, { row: 8, col: 1 }, { row: 8, col: 0 },
  /* 50 (Left Turn) */
  { row: 7, col: 0 },
  /* 51 (Final cell before Home turn) */
  { row: 6, col: 0 }
];

// Color start indices on the 52-cell track
export const COLOR_TRACK_START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Home Stretch coordinates (5 steps for each color)
export const HOME_STRETCH_COORDINATES: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }
  ],
  green: [
    { row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }
  ],
  yellow: [
    { row: 7, col: 13 }, { row: 7, col: 12 }, { row: 7, col: 11 }, { row: 7, col: 10 }, { row: 7, col: 9 }
  ],
  blue: [
    { row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 }, { row: 10, col: 7 }, { row: 9, col: 7 }
  ]
};

// Center Goal Coordinates (stepCount >= 56)
export const CENTER_GOAL_COORDINATES: Record<PlayerColor, GridCoord> = {
  red: { row: 7, col: 6 },
  green: { row: 6, col: 7 },
  yellow: { row: 7, col: 8 },
  blue: { row: 8, col: 7 }
};

// Base Socket Coordinates (stepCount === -1) for 4 pawns per color
// Each socket spans a 2x2 grid cell block in the 15x15 board
export const BASE_SOCKET_COORDINATES: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 1, col: 1, isBaseSocket: true }, { row: 1, col: 3, isBaseSocket: true },
    { row: 3, col: 1, isBaseSocket: true }, { row: 3, col: 3, isBaseSocket: true }
  ],
  green: [
    { row: 1, col: 10, isBaseSocket: true }, { row: 1, col: 12, isBaseSocket: true },
    { row: 3, col: 10, isBaseSocket: true }, { row: 3, col: 12, isBaseSocket: true }
  ],
  yellow: [
    { row: 10, col: 10, isBaseSocket: true }, { row: 10, col: 12, isBaseSocket: true },
    { row: 12, col: 10, isBaseSocket: true }, { row: 12, col: 12, isBaseSocket: true }
  ],
  blue: [
    { row: 10, col: 1, isBaseSocket: true }, { row: 10, col: 3, isBaseSocket: true },
    { row: 12, col: 1, isBaseSocket: true }, { row: 12, col: 3, isBaseSocket: true }
  ]
};

/**
 * Calculates (row, col) grid coordinate for a pawn given its color, pawn ID, and stepCount.
 */
export function getPawnGridCoord(color: PlayerColor, pawnId: number, stepCount: number): GridCoord {
  // In Home Base
  if (stepCount < 0) {
    const baseSockets = BASE_SOCKET_COORDINATES[color];
    return baseSockets[pawnId % 4] || baseSockets[0];
  }

  // Reached Center Goal
  if (stepCount >= 56) {
    return CENTER_GOAL_COORDINATES[color];
  }

  // On Home Stretch (steps 51 to 55)
  if (stepCount >= 51) {
    const stretchIndex = stepCount - 51;
    return HOME_STRETCH_COORDINATES[color][stretchIndex];
  }

  // On Main 52-Cell Track (steps 0 to 50)
  const startIndex = COLOR_TRACK_START_INDEX[color];
  const globalTrackIndex = (startIndex + stepCount) % 52;
  return TRACK_COORDINATES[globalTrackIndex];
}
