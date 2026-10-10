export interface FriendUser {
  id: string; // e.g. "LUDO_1001" or "01812345678"
  name: string;
  avatarUrl: string;
  status: 'online' | 'in_game' | 'offline';
  level?: number;
  winRate?: number;
  addedAt?: string;
}

// Initial Mock Friends Data
export const INITIAL_FRIENDS: FriendUser[] = [
  {
    id: 'LUDO_1008',
    name: 'তানভীর আহমেদ (Tanvir)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 14,
    winRate: 68,
    addedAt: '2026-07-20'
  },
  {
    id: 'LUDO_2044',
    name: 'রাকিব হাসান (Rakib)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'in_game',
    level: 22,
    winRate: 74,
    addedAt: '2026-07-25'
  },
  {
    id: '01819223344',
    name: 'সাকিব আল হাসান (Shakib)',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 19,
    winRate: 82,
    addedAt: '2026-07-28'
  },
  {
    id: 'LUDO_5099',
    name: 'সাব্বির চৌধুরী (Sabbir)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'offline',
    level: 9,
    winRate: 55,
    addedAt: '2026-08-01'
  }
];

// Mock database for ID search
export const SEARCHABLE_DATABASE: FriendUser[] = [
  ...INITIAL_FRIENDS,
  {
    id: 'LUDO_9988',
    name: 'আরিফ রহমান (Arif Boss)',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 30,
    winRate: 85
  },
  {
    id: '01711223344',
    name: 'সুমন হোসাইন (Sumon Pro)',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 18,
    winRate: 64
  },
  {
    id: 'admin_king',
    name: 'এডমিন কিং লুডো (Admin)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    status: 'online',
    level: 50,
    winRate: 98
  },
  {
    id: 'LUDO_7712',
    name: 'মেহেদী হাসান (Mehedi)',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
    status: 'offline',
    level: 11,
    winRate: 60
  },
  {
    id: 'LUDO_3344',
    name: 'ফারহান আহমেদ (Farhan)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    status: 'in_game',
    level: 16,
    winRate: 71
  }
];

const STORAGE_KEY = 'kingludo_friends_list_v1';

// Read friends from local storage
export function getSavedFriends(): FriendUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FRIENDS));
      return INITIAL_FRIENDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return INITIAL_FRIENDS;
  } catch {
    return INITIAL_FRIENDS;
  }
}

// Add friend
export function saveFriend(friend: FriendUser): FriendUser[] {
  const current = getSavedFriends();
  if (current.some((f) => f.id.toLowerCase() === friend.id.toLowerCase())) {
    return current;
  }
  const updated = [{ ...friend, addedAt: new Date().toISOString().split('T')[0] }, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed saving friend to localStorage', e);
  }
  return updated;
}

// Remove friend
export function removeSavedFriend(friendId: string): FriendUser[] {
  const current = getSavedFriends();
  const updated = current.filter((f) => f.id.toLowerCase() !== friendId.toLowerCase());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed deleting friend from localStorage', e);
  }
  return updated;
}

// Search Users by ID or Name
export function searchUsersById(query: string): FriendUser[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matched = SEARCHABLE_DATABASE.filter(
    (u) => u.id.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
  );

  // If searching an exact ID that is not in pre-made list, dynamically construct a playable profile!
  if (matched.length === 0 && (q.length >= 3)) {
    const isNum = /^\d+$/.test(q);
    const generatedId = isNum ? q : q.toUpperCase();
    const generatedAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`;
    
    return [
      {
        id: generatedId,
        name: `খেলোয়াড় (${generatedId})`,
        avatarUrl: generatedAvatar,
        status: 'online',
        level: Math.floor(Math.random() * 15) + 5,
        winRate: Math.floor(Math.random() * 30) + 50
      }
    ];
  }

  return matched;
}
