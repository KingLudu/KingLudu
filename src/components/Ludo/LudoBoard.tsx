import React from 'react';
import { Crown, Star } from 'lucide-react';
import { Pawn, PlayerColor } from '../../types';
import { getPawnGridCoord } from '../../utils/ludoCoordinates';
import { PinPawn } from './PinPawn';

interface LudoBoardProps {
  pawns: Pawn[];
  activeTurnColor: PlayerColor;
  movablePawns: Pawn[];
  onPawnClick: (pawn: Pawn) => void;
  playersCount?: 2 | 3 | 4;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  pawns,
  activeTurnColor,
  movablePawns,
  onPawnClick,
  playersCount = 4,
}) => {
  const isPawnMovable = (pawn: Pawn) => {
    return movablePawns.some((p) => p.color === pawn.color && p.id === pawn.id);
  };

  // Group pawns by their current grid coordinate to handle stacking
  const pawnsByCoord: Record<string, Pawn[]> = {};
  pawns.forEach((pawn) => {
    const coord = getPawnGridCoord(pawn.color, pawn.id, pawn.stepCount);
    const key = `${coord.row}_${coord.col}`;
    if (!pawnsByCoord[key]) {
      pawnsByCoord[key] = [];
    }
    pawnsByCoord[key].push(pawn);
  });

  return (
    <div className="w-full max-w-[370px] sm:max-w-[420px] aspect-square bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 p-1.5 rounded-3xl shadow-[0_16px_35px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.6)] relative select-none flex items-center justify-center border-2 border-yellow-200">
      
      {/* Outer Royal Gold Inset Frame */}
      <div className="w-full h-full p-1 bg-gradient-to-b from-[#0b0c26] via-[#10143a] to-[#080a1e] rounded-2xl relative shadow-inner">

        {/* 15x15 Standard Ludo Board Grid */}
        <div className="w-full h-full grid grid-cols-15 grid-rows-15 bg-[#0b0f2a] border-2 border-amber-400/80 rounded-xl relative overflow-hidden shadow-2xl">

          {/* ----------------- TOP LEFT BASE: RED (PLAYER 2) ----------------- */}
          <div className="col-span-6 row-span-6 bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#991b1b] rounded-tl-lg p-2 relative border-r-2 border-b-2 border-amber-400/80 flex items-center justify-center shadow-inner">
            {/* Crown Watermark */}
            <Crown className="absolute top-1 left-1 w-4 h-4 text-amber-300/40" />

            {/* Label */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-white tracking-widest pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10 whitespace-nowrap uppercase">
              RED
            </div>

            <div className="w-[82%] h-[82%] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-2xl p-1.5 grid grid-cols-2 grid-rows-2 gap-1.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border-2 border-amber-300">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={`red-socket-${socketIdx}`}
                  className="w-full h-full rounded-full bg-red-100 border-2 border-red-500/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600/40" />
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- TOP TRACK (Cols 7..9, Rows 1..6) ----------------- */}
          <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 bg-slate-900 border-b-2 border-amber-400/80">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const isGreenHome = col === 1;
              const isArrow = row === 0 && col === 1;
              const isGreenStart = row === 1 && col === 2;
              const isSafeStar = row === 2 && col === 0;

              return (
                <div
                  key={`top-track-${i}`}
                  className={`relative flex items-center justify-center border-[0.5px] border-slate-700/60 ${
                    isGreenHome
                      ? 'bg-gradient-to-b from-[#10b981] to-[#059669]'
                      : isGreenStart
                      ? 'bg-gradient-to-b from-[#10b981] to-[#059669]'
                      : 'bg-white'
                  }`}
                >
                  {isArrow && (
                    <span className="text-white font-black text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">↓</span>
                  )}
                  {isSafeStar && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600 drop-shadow" />
                  )}
                  {isGreenStart && (
                    <span className="text-[9px] font-black text-white/90">★</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ----------------- TOP RIGHT BASE: GREEN (PLAYER 3) ----------------- */}
          <div className="col-span-6 row-span-6 bg-gradient-to-bl from-[#10b981] via-[#059669] to-[#064e3b] rounded-tr-lg p-2 relative border-l-2 border-b-2 border-amber-400/80 flex items-center justify-center shadow-inner">
            <Crown className="absolute top-1 right-1 w-4 h-4 text-amber-300/40" />

            <div className="absolute top-1 right-1.5 text-[10px] font-black text-white tracking-widest pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10 whitespace-nowrap uppercase">
              GREEN
            </div>

            <div className="w-[82%] h-[82%] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-2xl p-1.5 grid grid-cols-2 grid-rows-2 gap-1.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border-2 border-amber-300">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={`green-socket-${socketIdx}`}
                  className="w-full h-full rounded-full bg-emerald-100 border-2 border-emerald-500/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600/40" />
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- LEFT TRACK (Cols 1..6, Rows 7..9) ----------------- */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 bg-slate-900 border-r-2 border-amber-400/80">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const isRedHome = row === 1;
              const isArrow = row === 1 && col === 0;
              const isRedStart = row === 0 && col === 1;
              const isSafeStar = row === 2 && col === 2;

              return (
                <div
                  key={`left-track-${i}`}
                  className={`relative flex items-center justify-center border-[0.5px] border-slate-700/60 ${
                    isRedHome
                      ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                      : isRedStart
                      ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                      : 'bg-white'
                  }`}
                >
                  {isArrow && (
                    <span className="text-white font-black text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">→</span>
                  )}
                  {isSafeStar && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600 drop-shadow" />
                  )}
                  {isRedStart && (
                    <span className="text-[9px] font-black text-white/90">★</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ----------------- CENTER ROYAL GOAL CROWN TRIANGLES (3x3) ----------------- */}
          <div className="col-span-3 row-span-3 relative bg-slate-950 overflow-hidden border-2 border-amber-400 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
            {/* Top Triangle - Green */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#10b981] to-[#047857]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }}
            />
            {/* Right Triangle - Yellow */}
            <div
              className="absolute inset-0 bg-gradient-to-l from-[#f59e0b] to-[#b45309]"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}
            />
            {/* Bottom Triangle - Blue */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0284c7] to-[#0369a1]"
              style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }}
            />
            {/* Left Triangle - Red */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#ef4444] to-[#b91c1c]"
              style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }}
            />

            {/* Golden Royal Crown Centerpiece */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 p-0.5 shadow-[0_0_12px_#fde047] flex items-center justify-center border border-amber-600">
                <Crown className="w-4 h-4 text-slate-950 fill-amber-400" />
              </div>
            </div>
          </div>

          {/* ----------------- RIGHT TRACK (Cols 10..15, Rows 7..9) ----------------- */}
          <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 bg-slate-900 border-l-2 border-amber-400/80">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const isYellowHome = row === 1;
              const isArrow = row === 1 && col === 5;
              const isYellowStart = row === 2 && col === 4;
              const isSafeStar = row === 0 && col === 3;

              return (
                <div
                  key={`right-track-${i}`}
                  className={`relative flex items-center justify-center border-[0.5px] border-slate-700/60 ${
                    isYellowHome
                      ? 'bg-gradient-to-l from-[#fbbf24] to-[#f59e0b]'
                      : isYellowStart
                      ? 'bg-gradient-to-l from-[#fbbf24] to-[#f59e0b]'
                      : 'bg-white'
                  }`}
                >
                  {isArrow && (
                    <span className="text-slate-950 font-black text-xs drop-shadow">←</span>
                  )}
                  {isSafeStar && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600 drop-shadow" />
                  )}
                  {isYellowStart && (
                    <span className="text-[9px] font-black text-slate-950">★</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ----------------- BOTTOM LEFT BASE: BLUE (PLAYER 1) ----------------- */}
          <div className="col-span-6 row-span-6 bg-gradient-to-tr from-[#0284c7] via-[#0369a1] to-[#0c4a6e] rounded-bl-lg p-2 relative border-r-2 border-t-2 border-amber-400/80 flex items-center justify-center shadow-inner">
            <Crown className="absolute bottom-1 left-1 w-4 h-4 text-amber-300/40" />

            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-white tracking-widest pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10 whitespace-nowrap uppercase">
              BLUE
            </div>

            <div className="w-[82%] h-[82%] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-2xl p-1.5 grid grid-cols-2 grid-rows-2 gap-1.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border-2 border-amber-300">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={`blue-socket-${socketIdx}`}
                  className="w-full h-full rounded-full bg-blue-100 border-2 border-blue-500/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600/40" />
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- BOTTOM TRACK (Cols 7..9, Rows 10..15) ----------------- */}
          <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 bg-slate-900 border-t-2 border-amber-400/80">
            {Array.from({ length: 18 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const isBlueHome = col === 1;
              const isArrow = row === 5 && col === 1;
              const isBlueStart = row === 4 && col === 0;
              const isSafeStar = row === 3 && col === 2;

              return (
                <div
                  key={`bottom-track-${i}`}
                  className={`relative flex items-center justify-center border-[0.5px] border-slate-700/60 ${
                    isBlueHome
                      ? 'bg-gradient-to-t from-[#0284c7] to-[#0ea5e9]'
                      : isBlueStart
                      ? 'bg-gradient-to-t from-[#0284c7] to-[#0ea5e9]'
                      : 'bg-white'
                  }`}
                >
                  {isArrow && (
                    <span className="text-white font-black text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">↑</span>
                  )}
                  {isSafeStar && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600 drop-shadow" />
                  )}
                  {isBlueStart && (
                    <span className="text-[9px] font-black text-white/90">★</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ----------------- BOTTOM RIGHT BASE: YELLOW (PLAYER 4) ----------------- */}
          <div className="col-span-6 row-span-6 bg-gradient-to-tl from-[#f59e0b] via-[#d97706] to-[#78350f] rounded-br-lg p-2 relative border-l-2 border-t-2 border-amber-400/80 flex items-center justify-center shadow-inner">
            <Crown className="absolute bottom-1 right-1 w-4 h-4 text-amber-300/40" />

            <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black text-slate-950 tracking-widest pointer-events-none drop-shadow z-10 whitespace-nowrap uppercase">
              YELLOW
            </div>

            <div className="w-[82%] h-[82%] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-2xl p-1.5 grid grid-cols-2 grid-rows-2 gap-1.5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border-2 border-amber-300">
              {[0, 1, 2, 3].map((socketIdx) => (
                <div
                  key={`yellow-socket-${socketIdx}`}
                  className="w-full h-full rounded-full bg-amber-100 border-2 border-amber-500/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600/40" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ----------------- DYNAMIC PAWNS OVERLAY ----------------- */}
        <div className="absolute inset-1 pointer-events-none">
          {pawns.map((pawn) => {
            const coord = getPawnGridCoord(pawn.color, pawn.id, pawn.stepCount);
            const coordKey = `${coord.row}_${coord.col}`;
            const pawnListAtCoord = pawnsByCoord[coordKey] || [];
            const isBaseSocket = pawn.stepCount === -1;
            const movable = isPawnMovable(pawn);

            // In base sockets, each pawn sits in its own socket
            if (isBaseSocket) {
              const leftPct = (coord.col / 15) * 100;
              const topPct = (coord.row / 15) * 100;
              return (
                <div
                  key={`pawn-node-${pawn.color}-${pawn.id}`}
                  onClick={movable ? () => onPawnClick(pawn) : undefined}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${(2 / 15) * 100}%`,
                    height: `${(2 / 15) * 100}%`,
                    transition: 'left 0.18s cubic-bezier(0.25, 1, 0.5, 1), top 0.18s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  className={`absolute flex items-center justify-center pointer-events-auto ${
                    movable ? 'z-30 cursor-pointer' : 'z-10'
                  }`}
                >
                  <PinPawn
                    color={pawn.color}
                    size={26}
                    isMovable={movable}
                    onClick={() => onPawnClick(pawn)}
                  />
                </div>
              );
            }

            // On track cells or safe spots: if multiple pawns share the cell, arrange them in a mini cluster so all are visible!
            const idxInCell = pawnListAtCoord.findIndex((p) => p.color === pawn.color && p.id === pawn.id);
            const totalOnCell = pawnListAtCoord.length;

            let offsetX = 0;
            let offsetY = 0;
            let pawnScale = 1;

            if (totalOnCell === 2) {
              pawnScale = 0.88;
              offsetX = idxInCell === 0 ? -15 : 15;
              offsetY = idxInCell === 0 ? -10 : 10;
            } else if (totalOnCell >= 3) {
              pawnScale = 0.78;
              if (idxInCell === 0) { offsetX = -18; offsetY = -15; }
              else if (idxInCell === 1) { offsetX = 18; offsetY = -15; }
              else if (idxInCell === 2) { offsetX = -18; offsetY = 15; }
              else { offsetX = 18; offsetY = 15; }
            }

            const baseLeftPct = (coord.col / 15) * 100;
            const baseTopPct = (coord.row / 15) * 100;
            const cellW = (1 / 15) * 100;
            const cellH = (1 / 15) * 100;

            return (
              <div
                key={`pawn-node-${pawn.color}-${pawn.id}`}
                onClick={movable ? () => onPawnClick(pawn) : undefined}
                style={{
                  left: `${baseLeftPct}%`,
                  top: `${baseTopPct}%`,
                  width: `${cellW}%`,
                  height: `${cellH}%`,
                  transform: `translate(${offsetX}%, ${offsetY}%) scale(${pawnScale})`,
                  transition:
                    'left 0.18s cubic-bezier(0.25, 1, 0.5, 1), top 0.18s cubic-bezier(0.25, 1, 0.5, 1), transform 0.18s ease-out',
                }}
                className={`absolute flex items-center justify-center pointer-events-auto ${
                  movable ? 'z-30 cursor-pointer' : 'z-20'
                }`}
              >
                <PinPawn
                  color={pawn.color}
                  size={22}
                  isMovable={movable}
                  onClick={() => onPawnClick(pawn)}
                  countOverlay={totalOnCell > 1 && idxInCell === 0 ? totalOnCell : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

