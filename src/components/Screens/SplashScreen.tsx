import React, { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'motion/react';
import splashGraphic from '../../assets/images/ludo_splash_artwork_1785011443830.jpg';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish();
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div 
      onClick={onFinish}
      className="min-h-full text-white flex flex-col justify-between items-center p-5 relative overflow-hidden select-none cursor-pointer"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.7), rgba(6,51,20,0.75), rgba(3,24,9,0.9)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-lime-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Section */}
      <div className="flex flex-col items-center mt-6 z-10 w-full max-w-xs">
        {/* Shiny Golden Crown */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-1 flex items-center justify-center"
        >
          {/* Glowing Aura Behind Crown */}
          <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
          
          <Crown className="w-14 h-14 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.9)] stroke-[2.5]" />
        </motion.div>

        {/* 3D Colorful LUDO Title */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center tracking-tight font-black text-6xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] my-0.5"
          style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
        >
          <span className="text-[#ffcb05] drop-shadow-[0_4px_0_#b38b00]">L</span>
          <span className="text-[#ff2a2a] drop-shadow-[0_4px_0_#a80000]">U</span>
          <span className="text-[#00d26a] drop-shadow-[0_4px_0_#007a3d]">D</span>
          <span className="text-[#00a3ff] drop-shadow-[0_4px_0_#005bb5]">O</span>
        </motion.div>

        {/* Subtitle PLAY & WIN with Gold Accent Lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-3 mt-1"
        >
          <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-amber-400/80" />
          <span className="text-sm font-extrabold tracking-[0.2em] text-slate-100 uppercase drop-shadow">
            PLAY & WIN
          </span>
          <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-amber-400/80" />
        </motion.div>
      </div>

      {/* Center 3D Isometric Ludo Graphic */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full max-w-[270px] aspect-square flex items-center justify-center my-auto"
      >
        <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-2xl pointer-events-none" />
        <img
          src={splashGraphic}
          alt="Ludo 3D Game Graphic"
          className="w-full h-full object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative z-10"
        />
      </motion.div>

      {/* Golden Wreath Tagline Section */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-3 z-10 w-full max-w-xs mb-4"
      >
        {/* Left Golden Laurel SVG */}
        <svg className="w-8 h-12 text-amber-400 flex-shrink-0" viewBox="0 0 24 36" fill="currentColor">
          <path d="M12 2C10 6 7 9 3 10c2 4 4 6 7 8-4 0-8 2-10 6 5-1 9-4 11-8 0 4-1 8-4 11 5-2 8-6 9-11 2 4 5 7 9 8-2-4-5-6-9-6 3-2 5-4 7-8-4 1-7 4-9 10 0-4-2-7-5-10z" />
        </svg>

        <div className="text-center flex flex-col items-center">
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            Enjoy Real Ludo
          </span>
          <span className="text-sm font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Anytime, Anywhere!
          </span>
        </div>

        {/* Right Golden Laurel SVG */}
        <svg className="w-8 h-12 text-amber-400 flex-shrink-0 transform scale-x-[-1]" viewBox="0 0 24 36" fill="currentColor">
          <path d="M12 2C10 6 7 9 3 10c2 4 4 6 7 8-4 0-8 2-10 6 5-1 9-4 11-8 0 4-1 8-4 11 5-2 8-6 9-11 2 4 5 7 9 8-2-4-5-6-9-6 3-2 5-4 7-8-4 1-7 4-9 10 0-4-2-7-5-10z" />
        </svg>
      </motion.div>

      {/* Bottom Loading Bar Section */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center pb-4">
        <span className="text-xs font-semibold text-slate-300 tracking-wider mb-2">
          Loading...
        </span>

        <div className="w-full flex items-center gap-3">
          {/* Progress Bar Container */}
          <div className="flex-1 bg-[#090b2e] border border-cyan-400/50 rounded-full h-3.5 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] relative overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Percentage Indicator */}
          <span className="text-xs font-black text-white min-w-[36px] text-right font-mono">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
