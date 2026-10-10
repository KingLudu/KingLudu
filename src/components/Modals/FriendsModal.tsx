import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  Trash2,
  X,
  Send,
  Gamepad2,
  Sparkles,
  Check,
  ShieldCheck,
  Copy,
  ArrowLeft,
} from 'lucide-react';
import {
  FriendUser,
  getSavedFriends,
  saveFriend,
  removeSavedFriend,
  searchUsersById
} from '../../utils/friends';
import { requestAppFullscreen } from '../../utils/fullscreen';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoom?: (roomCode?: string) => void;
  onInviteFriendToRoom?: (friend: FriendUser) => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRoom,
  onInviteFriendToRoom
}) => {
  const [activeTab, setActiveTab] = useState<'my_friends' | 'search'>('my_friends');
  const [friendsList, setFriendsList] = useState<FriendUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [invitedId, setInvitedId] = useState<string | null>(null);
  const safeFriendsList = Array.isArray(friendsList) ? friendsList : [];
  const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

  useEffect(() => {
    if (isOpen) {
      setFriendsList(getSavedFriends());
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchUsersById(query);
    setSearchResults(results);
  };

  const handleAddFriend = (user: FriendUser) => {
    const updated = saveFriend(user);
    setFriendsList(updated);
    showToast(`${user.name} কে ফ্রেন্ড লিস্টে যোগ করা হয়েছে! 👥`);
  };

  const handleRemoveFriend = (friendId: string, name: string) => {
    const updated = removeSavedFriend(friendId);
    setFriendsList(updated);
    showToast(`${name} কে ফ্রেন্ড লিস্ট থেকে বাদ দেওয়া হয়েছে।`);
  };

  const handleInviteFriend = (friend: FriendUser) => {
    setInvitedId(friend.id);
    setTimeout(() => setInvitedId(null), 2500);

    if (onInviteFriendToRoom) {
      onInviteFriendToRoom(friend);
    } else if (onNavigateToRoom) {
      showToast(`${friend.name} কে রুম ইনভিটেশন পাঠানো হয়েছে! 🎮`);
      setTimeout(() => {
        onClose();
        onNavigateToRoom();
      }, 800);
    } else {
      showToast(`${friend.name} কে রুম ইনভিটেশন লিঙ্ক পাঠানো হয়েছে! 📩`);
    }
  };

  const isAlreadyFriend = (id: string) => {
    return friendsList.some((f) => f.id.toLowerCase() === id.toLowerCase());
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-gradient-to-b from-[#180a3a] via-[#12072e] to-[#0a031e] flex flex-col overflow-hidden animate-in fade-in duration-200 select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs shadow-xl border border-white/50 flex items-center gap-1.5 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <div className="bg-[#140833]/95 border-b border-purple-800/60 px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md">
              <Users className="w-4 h-4 font-black text-slate-950" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white leading-tight flex items-center gap-1.5">
                <span>Friends Zone</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-3 sm:p-4 max-w-xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-1 bg-purple-950/80 rounded-2xl border border-purple-800/50 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('my_friends')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'my_friends'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>আমার ফ্রেন্ডস ({safeFriendsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>আইডি দিয়ে খুঁজুন</span>
          </button>
        </div>

        {/* TAB 1: MY FRIENDS */}
        {activeTab === 'my_friends' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[220px]">
            {safeFriendsList.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-700/50 mx-auto flex items-center justify-center text-purple-300">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-purple-300">আপনার কোনো ফ্রেন্ড যুক্ত নেই!</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow hover:bg-amber-300 transition"
                >
                  🔍 আইডি দিয়ে নতুন ফ্রেন্ড যোগ করুন
                </button>
              </div>
            ) : (
              safeFriendsList.map((friend, fIdx) => (
                <div
                  key={`friend-item-${friend.id || fIdx}-${fIdx}`}
                  className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-purple-950/60 to-indigo-950/40 border border-purple-700/40 flex items-center justify-between gap-2 shadow-md hover:border-amber-400/50 transition group"
                >
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-purple-500/60 shadow"
                      />
                      {/* Status Dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#12072e] ${
                          friend.status === 'online'
                            ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                            : friend.status === 'in_game'
                            ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-white truncate max-w-[140px] sm:max-w-[170px]">
                          {friend.name}
                        </span>
                        {friend.level && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            Lv.{friend.level}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/60">
                          ID: {friend.id}
                        </span>

                        {/* Status Label */}
                        <span
                          className={`text-[9px] font-extrabold uppercase ${
                            friend.status === 'online'
                              ? 'text-emerald-400'
                              : friend.status === 'in_game'
                              ? 'text-amber-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {friend.status === 'online'
                            ? '🟢 অনলাইন'
                            : friend.status === 'in_game'
                            ? '🎮 খেলায় ব্যস্ত'
                            : '⚪ অফলাইন'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleInviteFriend(friend)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 border ${
                        invitedId === friend.id
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white border-emerald-400/50 shadow-md'
                      }`}
                    >
                      {invitedId === friend.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>পাঠানো হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>ইনভাইট</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(friend.id, friend.name)}
                      className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition"
                      title="ফ্রেন্ড বাদ দিন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SEARCH USER BY ID */}
        {activeTab === 'search' && (
          <div className="space-y-3 min-h-[220px]">
            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="ইউজার ID বা নাম লিখুন (যেমন: LUDO_1001, 01819...)"
                className="w-full bg-purple-950/90 border-2 border-amber-400/60 focus:border-amber-300 text-white placeholder-purple-300/60 text-xs rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300/40 shadow-inner font-mono"
              />
              <Search className="w-4 h-4 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Helper Tips */}
            <p className="text-[10px] text-purple-200/80 px-1 text-left">
              💡 টিপস: যেকোনো প্লেয়ারের ইউনিক ID বা ফোন নম্বর টাইপ করে সহজে ফ্রেন্ড যোগ করতে পারেন।
            </p>

            {/* Search Results Container */}
            <div className="overflow-y-auto space-y-2 max-h-[260px] pr-1 custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-purple-300 text-xs font-semibold">
                  উপরে যেকোনো প্লেয়ার ID লিখে সার্চ বাটনে চাপুন।
                </div>
              ) : safeSearchResults.length === 0 ? (
                <div className="text-center py-8 text-purple-300 text-xs font-semibold">
                  কোনো প্লেয়ার পাওয়া যায়নি। সঠিক ID আবার পরীক্ষা করুন।
                </div>
              ) : (
                safeSearchResults.map((user, uIdx) => {
                  const added = isAlreadyFriend(user.id);
                  return (
                    <div
                      key={`search-user-${user.id || uIdx}-${uIdx}`}
                      className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border border-purple-600/50 flex items-center justify-between gap-2 shadow-lg"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-2xl object-cover border-2 border-amber-400/50"
                        />
                        <div className="text-left min-w-0">
                          <span className="font-extrabold text-xs text-white block truncate max-w-[130px]">
                            {user.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-400/30">
                              ID: {user.id}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-400">🟢 অনলাইন</span>
                          </div>
                        </div>
                      </div>

                      {added ? (
                        <div className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>যুক্ত আছে</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddFriend(user)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1 active:scale-95"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>অ্যাড ফ্রেন্ড</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
