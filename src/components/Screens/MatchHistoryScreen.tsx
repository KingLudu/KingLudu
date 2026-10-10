import React from 'react';
import { ArrowLeft, History, Trophy, Frown, CheckCircle } from 'lucide-react';
import { MatchHistoryItem, ScreenType, RegionCode, REGIONS } from '../../types';
import { getTranslation } from '../../utils/translations';

interface MatchHistoryScreenProps {
  historyItems: MatchHistoryItem[];
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
}

export const MatchHistoryScreen: React.FC<MatchHistoryScreenProps> = ({
  historyItems = [],
  onNavigate,
  selectedRegion = 'BN',
}) => {
  const safeHistoryItems = Array.isArray(historyItems) ? historyItems : [];
  const t = getTranslation(selectedRegion);
  const regionInfo = REGIONS[selectedRegion] || REGIONS.BN;

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-20 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-white">{t.history}</h2>
        <div className="w-9" />
      </div>

      {safeHistoryItems.length === 0 ? (
        <div className="bg-[#04260f] p-8 rounded-2xl border border-purple-900/40 text-center space-y-3 shadow-lg my-10">
          <History className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="font-extrabold text-sm text-slate-200">No Matches Played Yet</h3>
          <p className="text-xs text-purple-300/80">
            Play your first match to start tracking your wins and earnings history!
          </p>
          <button
            onClick={() => onNavigate('matchmaking')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow mt-2"
          >
            Play First Match
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {safeHistoryItems.map((item, idx) => {
            const isWon = item.status === 'won';
            return (
              <div
                key={`match-hist-${item.id || idx}-${idx}`}
                className="bg-[#04260f] p-3.5 rounded-2xl border border-purple-900/40 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.opponentAvatar}
                    alt={item.opponentName}
                    className="w-10 h-10 rounded-full object-cover border border-purple-700"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">vs {item.opponentName}</h4>
                    <p className="text-[10px] text-purple-300 font-mono mt-0.5">
                      {t.entryFee}: {regionInfo.currencySymbol}{item.entryFee} • {item.date}, {item.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-extrabold text-sm ${isWon ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isWon ? `+${regionInfo.currencySymbol}${item.prizeWon}` : `${regionInfo.currencySymbol}0`}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      isWon
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {isWon ? <CheckCircle className="w-2.5 h-2.5" /> : <Frown className="w-2.5 h-2.5" />}
                    {isWon ? 'WON' : 'LOST'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
