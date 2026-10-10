import React from 'react';
import { ScreenType } from '../../types';
import { Layers, Monitor, Smartphone } from 'lucide-react';

interface ScreenInspectorBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const ScreenInspectorBar: React.FC<ScreenInspectorBarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleFrame,
}) => {
  const screens: { id: ScreenType; name: string }[] = [
    { id: 'splash', name: '1. Splash' },
    { id: 'login', name: '2. Login' },
    { id: 'home', name: '3. Home' },
    { id: 'wallet', name: '4. Wallet' },
    { id: 'add_money', name: '5. Deposit' },
    { id: 'withdraw', name: '6. Withdraw' },
    { id: 'create_match', name: '7. Create' },
    { id: 'join_match', name: '8. Join' },
    { id: 'matchmaking', name: '9. Finding' },
    { id: 'gameplay', name: '10. Gameplay' },
    { id: 'result', name: '11. Result' },
    { id: 'match_history', name: '12. History' },
    { id: 'leaderboard', name: '13. Ranks' },
    { id: 'profile', name: '14. Profile' },
    { id: 'support', name: '15. Support' },
  ];

  return (
    <div className="bg-[#04240d] border-b border-emerald-700/60 p-2 px-3 text-white flex flex-wrap items-center justify-between gap-2 z-50 sticky top-0 shadow-lg">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-extrabold text-xs text-amber-300 uppercase tracking-wider hidden sm:inline">
          Ludo Screens (15/15):
        </span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-[70vw] scrollbar-none">
        {screens.map((sc, scIdx) => (
          <button
            key={`inspect-screen-${sc.id}-${scIdx}`}
            id={`inspect-btn-${sc.id}`}
            onClick={() => onSelectScreen(sc.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap border cursor-pointer ${
              currentScreen === sc.id
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-emerald-950/60 text-emerald-200 border-emerald-800/50 hover:bg-emerald-900'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      <button
        onClick={onToggleFrame}
        className="p-1.5 rounded-lg bg-purple-900/60 border border-purple-700/50 text-slate-200 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold shrink-0"
        title="Toggle Frame Mode"
      >
        {isMobileFrame ? <Smartphone className="w-4 h-4 text-amber-400" /> : <Monitor className="w-4 h-4 text-amber-400" />}
        <span className="hidden md:inline">{isMobileFrame ? 'Mobile View' : 'Full Screen'}</span>
      </button>
    </div>
  );
};
