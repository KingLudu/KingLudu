import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Briefcase,
  Layers,
  Award,
  KeyRound,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Copy,
  DollarSign,
  Phone,
  Shield,
  Smartphone,
  Globe,
  MapPin,
  Fingerprint,
  Info
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AgentUser, DepositLevel, RolePermission, AdminAccount } from '../../types/adminProgramTypes';
import {
  INITIAL_AGENTS,
  INITIAL_DEPOSIT_LEVELS,
  INITIAL_ROLES,
  INITIAL_ADMINS,
} from '../../data/adminProgramsData';
import { VIPCashbackView } from './VIPCashbackView';
import { UserDeviceDetailsModal } from './UserDeviceDetailsModal';

interface UsersRolesViewProps {
  registeredUsers: UserProfile[];
  onUpdateUserBalance?: (phone: string, newBalance: number) => void;
  onToggleUserBan?: (userIdOrPhone: string) => void;
  subTab?: 'players' | 'agents' | 'deposit_levels' | 'vip_tiers' | 'roles_perms' | 'admins';
  onSubTabChange?: (tab: 'players' | 'agents' | 'deposit_levels' | 'vip_tiers' | 'roles_perms' | 'admins') => void;
}

export const UsersRolesView: React.FC<UsersRolesViewProps> = ({
  registeredUsers = [],
  onUpdateUserBalance,
  onToggleUserBan,
  subTab: externalSubTab,
  onSubTabChange,
}) => {
  const safeUsers = Array.isArray(registeredUsers) ? registeredUsers : [];
  const [internalSubTab, setInternalSubTab] = useState<'players' | 'agents' | 'deposit_levels' | 'vip_tiers' | 'roles_perms' | 'admins'>('players');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: 'players' | 'agents' | 'deposit_levels' | 'vip_tiers' | 'roles_perms' | 'admins') => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State for Agents, Deposit Levels, Roles, Admins
  const [agents, setAgents] = useState<AgentUser[]>(INITIAL_AGENTS);
  const [depositLevels, setDepositLevels] = useState<DepositLevel[]>(INITIAL_DEPOSIT_LEVELS);
  const [roles, setRoles] = useState<RolePermission[]>(INITIAL_ROLES);
  const [admins, setAdmins] = useState<AdminAccount[]>(INITIAL_ADMINS);

  const safeAgents = Array.isArray(agents) ? agents : [];
  const safeDepositLevels = Array.isArray(depositLevels) ? depositLevels : [];
  const safeRoles = Array.isArray(roles) ? roles : [];
  const safeAdmins = Array.isArray(admins) ? admins : [];

  // Quick Balance Modal
  const [balanceModalUser, setBalanceModalUser] = useState<UserProfile | null>(null);
  const [deviceDetailsUser, setDeviceDetailsUser] = useState<UserProfile | null>(null);
  const [balanceAmountInput, setBalanceAmountInput] = useState('');
  const [balanceActionType, setBalanceActionType] = useState<'add' | 'deduct'>('add');

  const totalPlayersCount = safeUsers.length;
  const activePlayersCount = safeUsers.filter((u) => !u.isBanned).length;
  const bannedPlayersCount = safeUsers.filter((u) => !!u.isBanned).length;

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    try {
      navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPlayers = safeUsers.filter((u) => {
    if (statusFilter === 'active' && u.isBanned) return false;
    if (statusFilter === 'banned' && !u.isBanned) return false;
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  const handleBalanceSubmit = () => {
    if (!balanceModalUser) return;
    const amount = Number(balanceAmountInput);
    if (!amount || amount <= 0) {
      alert('সঠিক অ্যামাউন্ট লিখুন');
      return;
    }
    const current = balanceModalUser.balance || 0;
    const newBal = balanceActionType === 'add' ? current + amount : Math.max(0, current - amount);

    if (onUpdateUserBalance) {
      onUpdateUserBalance(balanceModalUser.phone, newBal);
    }
    setBalanceModalUser(null);
    setBalanceAmountInput('');
  };

  const handleToggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' } : a))
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Users className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Users & Roles (ইউজার ও পারমিশন)</h2>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                কন্ট্রোল ম্যানেজমেন্ট
              </span>
            </div>
            <p className="text-xs text-purple-200">
              প্লেয়ার, আঞ্চলিক এজেন্ট, ডিপোজিট লেভেল, ভিআইপি টিয়ার ও এডমিন পারমিশন কন্ট্রোল
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#031e0c]/80 px-3 py-2 rounded-xl border border-purple-800/60 text-xs">
          <span className="text-purple-300">মোট প্লেয়ার:</span>
          <span className="font-mono font-black text-amber-400">{safeUsers.length} জন</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('players')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'players'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>প্লেয়ার্স (Players)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('agents')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'agents'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>এজেন্টস তালিকা (Agents List)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('deposit_levels')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'deposit_levels'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ডিপোজিট লেভেল (Deposit Levels)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('vip_tiers')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'vip_tiers'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ভিআইপি ও ক্যাশব্যাক (VIP & Cashback Tiers)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('roles_perms')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'roles_perms'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>রোলস ও পারমিশন (Roles & Perms)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('admins')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'admins'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>এডমিন্স তালিকা (Admins)</span>
        </button>
      </div>

      {/* View SubTab 1: Players */}
      {activeSubTab === 'players' && (
        <div className="space-y-3">
          <div className="bg-[#052a12] p-3 rounded-2xl border border-purple-800/50 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা ইউজার আইডি দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-xs text-purple-300 shrink-0 font-mono">
                ফলাফল: {filteredPlayers.length} জন
              </span>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-purple-900/40 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-[#031e0c] text-purple-300 hover:text-white border border-purple-800/60'
                  }`}
                >
                  <span>সকল প্লেয়ার</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                    {totalPlayersCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'active'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-[#031e0c] text-emerald-300 hover:text-white border border-emerald-900/60'
                  }`}
                >
                  <span>সক্রিয় (Active)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                    {activePlayersCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('banned')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'banned'
                      ? 'bg-rose-600 text-white shadow'
                      : bannedPlayersCount > 0
                      ? 'bg-rose-950/60 text-rose-300 hover:text-white border border-rose-700/60'
                      : 'bg-[#031e0c] text-purple-300 hover:text-white border border-purple-800/60'
                  }`}
                >
                  <span>ব্যানকৃত (Banned)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-900 text-rose-200 font-mono">
                    {bannedPlayersCount}
                  </span>
                </button>
              </div>

              {statusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer font-bold"
                >
                  ফিল্টার রিসেট
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredPlayers.length === 0 ? (
              <div className="col-span-full bg-[#052a12] p-8 rounded-2xl text-center space-y-2 border border-purple-800/40">
                <Users className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="text-sm font-bold text-white">কোন প্লেয়ার পাওয়া যায়নি</p>
                <p className="text-xs text-purple-300">
                  {statusFilter === 'banned' ? 'বর্তমানে কোনো ব্যানকৃত প্লেয়ার নেই।' : 'অনুসন্ধানের সাথে কোনো মিল নেই।'}
                </p>
              </div>
            ) : (
              filteredPlayers.map((player, pIdx) => (
                <div
                  key={`users-roles-player-${player.id || player.phone || 'player'}-${pIdx}`}
                  className={`p-3.5 rounded-2xl border space-y-2.5 transition relative overflow-hidden ${
                    player.isBanned
                      ? 'bg-rose-950/30 border-rose-600/60 shadow-lg shadow-rose-950/30'
                      : 'bg-[#052a12] border-purple-800/50 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={player.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={player.name}
                          className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                        />
                        {player.isBanned && (
                          <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow" title="Banned">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-white">{player.name}</h4>
                          {player.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {player.isBanned ? (
                            <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded font-black tracking-wider shadow">
                              🚫 ব্যানড (BANNED)
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                              সক্রিয়
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-purple-300">{player.phone}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-purple-300 block">বর্তমান ব্যালেন্স</span>
                      <span className="font-mono font-black text-sm text-emerald-400">
                        ৳{(Number(player.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Device & Network Telemetry Bar */}
                  <div className="p-2 rounded-xl bg-[#031e0c] border border-purple-800/60 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                    <div className="flex flex-wrap items-center gap-1.5 text-purple-200">
                      <span className="flex items-center gap-1 text-cyan-300 font-medium">
                        <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{player.deviceInfo?.deviceModel || 'Android Device'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-emerald-300 font-mono">
                        <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>IP: {player.deviceInfo?.ipAddress || '103.145.74.88'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{player.deviceInfo?.location || 'ঢাকা, বাংলাদেশ'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-purple-300 font-mono">
                        <Fingerprint className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>ID: {player.deviceInfo?.deviceFingerprint || 'DEV-8829F1-BD'}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeviceDetailsUser(player)}
                      className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-amber-300 border border-purple-600/50 font-bold text-[10px] flex items-center gap-1 transition shadow cursor-pointer active:scale-95 ml-auto"
                      title="ইউজারের ডিভাইস ও আইপি তথ্য দেখুন"
                    >
                      <Info className="w-3 h-3 text-amber-400" />
                      <span>ডিভাইস তথ্য</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/50 text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span>ম্যাচ: {player.totalMatches || 0}</span>
                      <span>•</span>
                      <span>উইন রেট: {player.winRate || 0}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBalanceModalUser(player)}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg shadow cursor-pointer"
                      >
                        ব্যালেন্স এডিট
                      </button>

                      {/* Admin User Ban/Unban Toggle Button */}
                      {onToggleUserBan && (
                        <button
                          type="button"
                          onClick={() => onToggleUserBan(player.id || player.phone)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer flex items-center gap-1 transition shadow active:scale-95 ${
                            player.isBanned
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                          }`}
                          title={player.isBanned ? 'আইডি আনব্যান করুন (Unban User)' : 'আইডি ব্যান করুন (Ban User)'}
                        >
                          {player.isBanned ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>আনব্যান</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>ব্যান করুন</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View SubTab 2: Agents List */}
      {activeSubTab === 'agents' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>নিবন্ধিত মাস্টার এজেন্টস তালিকা ({safeAgents.length})</span>
            </h3>
            <span className="text-[11px] text-purple-300">ক্যাশ-ইন ও ক্যাশ-আউট পয়েন্ট</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">এজেন্ট নাম</th>
                  <th className="py-2 px-3">ফোন নম্বর</th>
                  <th className="py-2 px-3">বিভাগ ও এলাকা</th>
                  <th className="py-2 px-3">বর্তমান ফ্লোট ব্যালেন্স</th>
                  <th className="py-2 px-3">কমিশন রেট</th>
                  <th className="py-2 px-3">স্ট্যাটাস</th>
                  <th className="py-2 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {agents.map((ag, aIdx) => (
                  <tr key={`agent-${ag.id || aIdx}-${aIdx}`} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3 font-bold text-white">{ag.name}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">{ag.phone}</td>
                    <td className="py-2.5 px-3 text-slate-300">{ag.district}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-emerald-400">৳{(Number(ag.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">{ag.commissionRate}%</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          ag.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-600/50'
                        }`}
                      >
                        {ag.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleAgentStatus(ag.id)}
                        className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] rounded-lg cursor-pointer"
                      >
                        {ag.status === 'active' ? 'স্থগিত করুন' : 'সক্রিয় করুন'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View SubTab 3: Deposit Levels */}
      {activeSubTab === 'deposit_levels' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>ডিপোজিট লেভেল ও লিমিট কনফিগারেশন</span>
            </h3>
            <span className="text-[11px] text-purple-300">লেভেল অনুযায়ী লিমিট ও এক্সক্লুসিভ পার্সেন্টেজ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {depositLevels.map((dl, dIdx) => (
              <div key={`dep-level-${dl.id || dIdx}-${dIdx}`} className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{dl.title}</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">লেভেল #{dl.level}</span>
                </div>
                <div className="text-xs space-y-1 text-purple-300">
                  <div className="flex justify-between">
                    <span>সীমা:</span>
                    <span className="font-mono text-white">৳{dl.minAmount} - ৳{dl.maxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>দৈনিক লিমিট:</span>
                    <span className="font-mono text-white">৳{dl.dailyLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>বোনাস এক্সট্রা:</span>
                    <span className="font-mono text-emerald-400 font-bold">+{dl.bonusPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ইনস্ট্যান্ট অনুমোদন:</span>
                    <span className="font-bold text-amber-300">{dl.instantApproval ? 'হ্যাঁ' : 'না'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View SubTab 4: VIP & Cashback Tiers embedded */}
      {activeSubTab === 'vip_tiers' && <VIPCashbackView />}

      {/* View SubTab 5: Roles & Perms */}
      {activeSubTab === 'roles_perms' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>এডমিন রোলস ও পারমিশন কন্ট্রোল</span>
            </h3>
            <span className="text-[11px] text-purple-300">প্রতিটি রোলের অ্যাক্সেস রাইটস</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map((r, rIdx) => (
              <div key={`role-perm-${r.id || rIdx}-${rIdx}`} className="bg-slate-900/80 p-3.5 rounded-xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-300">{r.roleName}</h4>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-mono">
                    {r.usersCount} জন ইউজার
                  </span>
                </div>
                <p className="text-[11px] text-purple-300">{r.description}</p>

                <div className="pt-2 border-t border-purple-900/50 grid grid-cols-2 gap-1.5 text-[11px]">
                  <label className="flex items-center gap-1 text-slate-300">
                    <input type="checkbox" checked={r.permissions.canManageFinance} readOnly className="accent-amber-400" />
                    <span>ফাইন্যান্স ম্যানেজমেন্ট</span>
                  </label>
                  <label className="flex items-center gap-1 text-slate-300">
                    <input type="checkbox" checked={r.permissions.canManageUsers} readOnly className="accent-amber-400" />
                    <span>ইউজার ও রোলস</span>
                  </label>
                  <label className="flex items-center gap-1 text-slate-300">
                    <input type="checkbox" checked={r.permissions.canManageGames} readOnly className="accent-amber-400" />
                    <span>গেম কন্ট্রোল</span>
                  </label>
                  <label className="flex items-center gap-1 text-slate-300">
                    <input type="checkbox" checked={r.permissions.canManageSupport} readOnly className="accent-amber-400" />
                    <span>লাইভ সাপোর্ট</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View SubTab 6: Admins */}
      {activeSubTab === 'admins' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>এডমিন একাউন্টস তালিকা ({safeAdmins.length})</span>
            </h3>
            <span className="text-[11px] text-amber-300 font-medium">রুট সিকিউরিটি সক্রিয়</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">ইউজারনেম ও নাম</th>
                  <th className="py-2 px-3">ফোন নম্বর</th>
                  <th className="py-2 px-3">রোল</th>
                  <th className="py-2 px-3">2FA সিকিউরিটি</th>
                  <th className="py-2 px-3">সর্বশেষ লগইন IP</th>
                  <th className="py-2 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {admins.map((adm, admIdx) => (
                  <tr key={`admin-acc-${adm.id || admIdx}-${admIdx}`} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-white block">{adm.name}</span>
                      <span className="font-mono text-[10px] text-purple-400">@{adm.username}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">{adm.phone}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{adm.role}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          adm.twoFactorEnabled ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {adm.twoFactorEnabled ? '2FA সক্রিয়' : 'অফ'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">{adm.ipAddress}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold rounded-full">
                        {adm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Balance Adjust Modal */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#052a12] border border-amber-400/40 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>ব্যালেন্স সমন্বয়: {balanceModalUser.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setBalanceModalUser(null)}
                className="text-purple-300 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between bg-[#031e0c] p-2.5 rounded-xl border border-purple-800/40">
                <span className="text-purple-300">বর্তমান ব্যালেন্স:</span>
                <span className="font-mono font-black text-amber-300">
                  ৳{(Number(balanceModalUser.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBalanceActionType('add')}
                  className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                    balanceActionType === 'add'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-purple-300'
                  }`}
                >
                  টাকা যোগ করুন (+)
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceActionType('deduct')}
                  className={`flex-1 py-2 rounded-xl font-bold transition cursor-pointer ${
                    balanceActionType === 'deduct'
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-slate-900 text-purple-300'
                  }`}
                >
                  টাকা কর্তন (-)
                </button>
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">টাকার পরিমাণ (৳):</label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০০"
                  value={balanceAmountInput}
                  onChange={(e) => setBalanceAmountInput(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBalanceModalUser(null)}
                className="flex-1 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleBalanceSubmit}
                className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-xl shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Device Telemetry Modal */}
      {deviceDetailsUser && (
        <UserDeviceDetailsModal
          user={deviceDetailsUser}
          onClose={() => setDeviceDetailsUser(null)}
          onToggleBan={(phoneOrId) => {
            if (onToggleUserBan) onToggleUserBan(phoneOrId);
            setDeviceDetailsUser(null);
          }}
        />
      )}
    </div>
  );
};
