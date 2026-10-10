import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  color = 'default',
  size = 'md',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRolling) {
      timer = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 45);
    } else {
      setDisplayValue(value);
    }
    return () => clearInterval(timer);
  }, [isRolling, value]);

  const renderDots = (val: number) => {
    const dotCommon =
      'w-2.5 h-2.5 rounded-full shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.8)] border border-black/30';
    const blackDot = `${dotCommon} bg-[#0f172a]`;
    const redCenterDot =
      'w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] col-start-2 row-start-2 border border-red-800';

    switch (val) {
      case 1:
        return <div className={redCenterDot} />;
      case 2:
        return (
          <>
            <div className={`${blackDot} col-start-1 row-start-1`} />
            <div className={`${blackDot} col-start-3 row-start-3`} />
          </>
        );
      case 3:
        return (
          <>
            <div className={`${blackDot} col-start-1 row-start-1`} />
            <div className={`${blackDot} col-start-2 row-start-2`} />
            <div className={`${blackDot} col-start-3 row-start-3`} />
          </>
        );
      case 4:
        return (
          <>
            <div className={`${blackDot} col-start-1 row-start-1`} />
            <div className={`${blackDot} col-start-3 row-start-1`} />
            <div className={`${blackDot} col-start-1 row-start-3`} />
            <div className={`${blackDot} col-start-3 row-start-3`} />
          </>
        );
      case 5:
        return (
          <>
            <div className={`${blackDot} col-start-1 row-start-1`} />
            <div className={`${blackDot} col-start-3 row-start-1`} />
            <div className={`${blackDot} col-start-2 row-start-2`} />
            <div className={`${blackDot} col-start-1 row-start-3`} />
            <div className={`${blackDot} col-start-3 row-start-3`} />
          </>
        );
      case 6:
        return (
          <>
            <div className={`${blackDot} col-start-1 row-start-1`} />
            <div className={`${blackDot} col-start-1 row-start-2`} />
            <div className={`${blackDot} col-start-1 row-start-3`} />
            <div className={`${blackDot} col-start-3 row-start-1`} />
            <div className={`${blackDot} col-start-3 row-start-2`} />
            <div className={`${blackDot} col-start-3 row-start-3`} />
          </>
        );
      default:
        return null;
    }
  };

  const activeVal = isRolling ? displayValue : value;

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-15 h-15 rounded-2xl',
  }[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Royal Pulsing Ring when Active & Can Roll */}
      {!disabled && !isRolling && (
        <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse opacity-90 blur-xs pointer-events-none" />
      )}

      <button
        type="button"
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`relative ${sizeClasses} p-1.5 flex items-center justify-center transition-all select-none outline-none ${
          disabled
            ? 'cursor-default bg-white border-2 border-slate-300 shadow-[0_3px_0_#cbd5e1,0_4px_8px_rgba(0,0,0,0.3)]'
            : 'cursor-pointer hover:scale-105 active:scale-95 shadow-[0_5px_0_#b45309,0_8px_16px_rgba(0,0,0,0.5)] border-2 border-amber-400 bg-gradient-to-br from-white via-amber-50 to-white'
        }`}
        style={{
          boxShadow: disabled
            ? '0 3px 0 #cbd5e1, 0 4px 10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,1)'
            : '0 5px 0 #b45309, 0 8px 16px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.9)',
        }}
      >
        {/* Subtle 3D Bevel Edge */}
        <div className="absolute inset-0.5 rounded-lg border border-white pointer-events-none" />

        <motion.div
          key={isRolling ? `rolling-${color}` : `value-${color}-${displayValue}`}
          animate={
            isRolling
              ? {
                  rotate: [0, 90, 180, 270, 360],
                  rotateX: [0, 180, 360],
                  rotateY: [0, 180, 360],
                  scale: [1, 1.2, 0.85, 1.15, 1],
                }
              : {
                  rotate: 0,
                  rotateX: 0,
                  rotateY: 0,
                  scale: [1.3, 1],
                }
          }
          transition={
            isRolling
              ? { repeat: Infinity, duration: 0.28, ease: 'linear' }
              : { type: 'spring', stiffness: 450, damping: 14 }
          }
          className="w-full h-full grid grid-cols-3 grid-rows-3 items-center justify-items-center relative z-10"
        >
          {renderDots(activeVal)}
        </motion.div>
      </button>
    </div>
  );
};
