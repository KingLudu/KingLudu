import { UserProfile, Transaction, Room, MatchHistoryItem, LeaderboardUser } from '../types';

// Fresh initial user profile with 0 balance and new account state
export const initialUserProfile: UserProfile = {
  id: 'guest_user',
  name: 'গেস্ট অ্যাকাউন্ট',
  phone: '',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  balance: 0,
  referralCode: 'LUDO0000',
  totalWon: 0,
  totalMatches: 0,
  winRate: 0,
  isLoggedIn: false,
};

export const initialTransactions: Transaction[] = [];

export const initialRooms: Room[] = [
  {
    id: 'room_1',
    code: 'AB12CD',
    hostName: "Ludo Room #1",
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    entryFee: 10,
    totalPrize: 20,
    gameType: '2 Player',
    mode: 'Classic',
    playersCount: 1,
    maxPlayers: 2
  },
  {
    id: 'room_2',
    code: 'CH8899',
    hostName: 'Quick Match',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    entryFee: 50,
    totalPrize: 100,
    gameType: '2 Player',
    mode: 'Quick',
    playersCount: 1,
    maxPlayers: 2
  }
];

export const initialMatchHistory: MatchHistoryItem[] = [];

export const leaderboardWeekly: LeaderboardUser[] = [
  { rank: 1, name: 'Rakib Hasan', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', winnings: 12500 },
  { rank: 2, name: 'Miraj Khan', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', winnings: 10200 },
  { rank: 3, name: 'Shakib Vai', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200', winnings: 9650 },
  { rank: 4, name: 'Tamim Islam', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', winnings: 8700 },
];
