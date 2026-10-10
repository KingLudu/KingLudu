import React from 'react';
import { Room, ScreenType, RegionCode, AppSettings } from '../../types';
import { CreateMatchScreen } from './CreateMatchScreen';

interface JoinMatchScreenProps {
  userBalance: number;
  user?: { name: string; avatarUrl: string };
  rooms: Room[];
  onCreateMatch?: (config: {
    playersCount: 2 | 3 | 4;
    entryFee: number;
    totalPrize: number;
    gameType: 'Classic' | 'Quick';
    gameMode: 'vs_ai' | 'pass_n_play' | 'ai_vs_ai';
    aiDifficulty: 'Easy' | 'Medium' | 'Hard';
    playWith: 'Anyone' | 'Friends';
  }) => void;
  onJoinRoom: (code: string) => void;
  onQuickJoin: () => void;
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
  appSettings?: AppSettings;
}

export const JoinMatchScreen: React.FC<JoinMatchScreenProps> = ({
  userBalance,
  user,
  rooms = [],
  onCreateMatch,
  onJoinRoom,
  onNavigate,
  selectedRegion = 'BN',
  appSettings,
}) => {
  return (
    <CreateMatchScreen
      userBalance={userBalance}
      user={user}
      onCreateMatch={onCreateMatch || (() => {})}
      onNavigate={onNavigate}
      selectedRegion={selectedRegion}
      initialTab="join"
      rooms={rooms}
      onJoinRoom={onJoinRoom}
      appSettings={appSettings}
    />
  );
};
