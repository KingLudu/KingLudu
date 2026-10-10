import React from 'react';
import { PlayerColor } from '../../types';

interface PinPawnProps {
  color: PlayerColor;
  size?: number;
  isMovable?: boolean;
  onClick?: () => void;
  countOverlay?: number;
}

export const PinPawn: React.FC<PinPawnProps> = ({
  color,
  size = 28,
  isMovable = false,
  onClick,
  countOverlay,
}) => {
  const colorMap = {
    red: {
      fillStart: '#ff3b30',
      fillMid: '#dc2626',
      fillEnd: '#7f1d1d',
      goldBorder: '#ffd700',
      core: '#ef4444',
      glow: '#ef4444',
    },
    green: {
      fillStart: '#34d399',
      fillMid: '#059669',
      fillEnd: '#064e3b',
      goldBorder: '#ffd700',
      core: '#10b981',
      glow: '#10b981',
    },
    blue: {
      fillStart: '#38bdf8',
      fillMid: '#0284c7',
      fillEnd: '#0c4a6e',
      goldBorder: '#ffd700',
      core: '#0ea5e9',
      glow: '#38bdf8',
    },
    yellow: {
      fillStart: '#fde047',
      fillMid: '#d97706',
      fillEnd: '#78350f',
      goldBorder: '#ffe066',
      core: '#f59e0b',
      glow: '#fbbf24',
    },
  };

  const cfg = colorMap[color];
  const uniqueId = `pin_grad_${color}_${Math.random().toString(36).substring(2, 7)}`;

  return (
    <button
      type="button"
      onClick={isMovable ? onClick : undefined}
      disabled={!isMovable && !onClick}
      className={`relative flex flex-col items-center justify-center transition-all duration-200 outline-none select-none ${
        isMovable ? 'cursor-pointer hover:scale-130 z-40 animate-bounce' : 'cursor-default'
      }`}
      style={{ width: size, height: size * 1.3, transform: 'translateY(-10%)' }}
    >
      <svg
        viewBox="0 0 34 46"
        className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main 3D Jewel Gradient */}
          <linearGradient id={uniqueId} x1="4" y1="2" x2="30" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor={cfg.fillStart} />
            <stop offset="0.5" stopColor={cfg.fillMid} />
            <stop offset="1" stopColor={cfg.fillEnd} />
          </linearGradient>

          {/* Royal Gold Ring Gradient */}
          <linearGradient id={`gold_${uniqueId}`} x1="0" y1="0" x2="34" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffbeb" />
            <stop offset="0.3" stopColor="#fde047" />
            <stop offset="0.7" stopColor="#ca8a04" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>

          <filter id={`shadow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 3D Contact Shadow */}
        <ellipse cx="17" cy="43" rx="10" ry="3" fill="#000000" opacity="0.45" />

        {/* Outer Gold Royal Outline Rim */}
        <path
          d="M17 2C8.716 2 2 8.716 2 17C2 28.5 17 44 17 44C17 44 32 28.5 32 17C32 8.716 25.284 2 17 2Z"
          fill={`url(#gold_${uniqueId})`}
          filter={`url(#shadow_${uniqueId})`}
        />

        {/* Inner Jewel Body */}
        <path
          d="M17 4C10.02 4 4.5 9.52 4.5 16.5C4.5 26 17 39.5 17 39.5C17 39.5 29.5 26 29.5 16.5C29.5 9.52 23.98 4 17 4Z"
          fill={`url(#${uniqueId})`}
        />

        {/* Royal Gold Ring Accent */}
        <circle cx="17" cy="16" r="8" fill={`url(#gold_${uniqueId})`} />
        <circle cx="17" cy="16" r="6" fill={cfg.fillEnd} />
        <circle cx="17" cy="16" r="4.5" fill={cfg.fillStart} />

        {/* Royal Crown Mini Emblem inside Pin */}
        <path
          d="M14 17.5 L14.5 14 L16 15.5 L17 13 L18 15.5 L19.5 14 L20 17.5 Z"
          fill="#fef08a"
          stroke="#ca8a04"
          strokeWidth="0.4"
        />

        {/* Top Gloss Highlights for Realistic 3D Glass Look */}
        <ellipse cx="13" cy="10" rx="3.5" ry="2" fill="#ffffff" opacity="0.65" transform="rotate(-25 13 10)" />
        <circle cx="21" cy="20" r="1" fill="#ffffff" opacity="0.4" />
      </svg>

      {/* Multiple Stack Counter */}
      {countOverlay && countOverlay > 1 && (
        <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
          {countOverlay}
        </span>
      )}

      {/* Glowing Pulsing Aura when Movable */}
      {isMovable && (
        <>
          <span className="absolute -top-3 w-4 h-4 bg-amber-400 rounded-full animate-ping ring-2 ring-amber-200 shadow-[0_0_12px_#fde047]" />
          <span className="absolute -top-4 text-amber-300 font-black text-xs animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            ▼
          </span>
        </>
      )}
    </button>
  );
};
