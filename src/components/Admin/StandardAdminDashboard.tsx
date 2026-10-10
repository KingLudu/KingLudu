import React, { useMemo } from 'react';
import {
  Users,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  MessageSquare,
  Bell,
  Gamepad2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Check,
  UserCheck,
  Download,
} from 'lucide-react';
import { UserProfile, Transaction, AppSettings } from '../../types';
import { AdminStatisticsCharts } from './AdminStatisticsCharts';
import { getPaymentMethodLogo } from '../../utils/paymentLogos';
import { exportUserTelemetryToCSV } from '../../utils/telemetryExport';

interface StandardAdminDashboardProps {
  currentUser: UserProfile;
  registeredUsers: UserProfile[];
  transactions: Transaction[];
  appSettings: AppSettings;
  pendingDeposits: Transaction[];
  pendingWithdrawals: Transaction[];
  unreadChatCount?: number;
  onNavigateTab: (tab: 'overview' | 'deposits' | 'withdrawals' | 'users' | 'payments' | 'live_chat' | 'notices' | 'game' | 'transactions') => void;
  onApproveTransaction: (trxId: string) => void;
  onRejectTransaction: (trxId: string) => void;
  onNavigatePlayerHome: () => void;
}

export const StandardAdminDashboard: React.FC<StandardAdminDashboardProps> = ({
  currentUser,
  registeredUsers = [],
  transactions = [],
  appSettings,
  pendingDeposits = [],
  pendingWithdrawals = [],
  unreadChatCount = 0,
  onNavigateTab,
  onApproveTransaction,
  onRejectTransaction,
  onNavigatePlayerHome,
}) => {
  const safeRegisteredUsers = Array.isArray(registeredUsers) ? registeredUsers : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safePendingDeposits = Array.isArray(pendingDeposits) ? pendingDeposits : [];
  const safePendingWithdrawals = Array.isArray(pendingWithdrawals) ? pendingWithdrawals : [];

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    try {
      navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations
  const totalUserBalance = useMemo(
    () => safeRegisteredUsers.reduce((sum, u) => sum + (Number(u.balance) || 0), 0),
    [safeRegisteredUsers]
  );

  const totalDepositsVolume = useMemo(
    () =>
      safeTransactions
        .filter((t) => t.type === 'deposit' && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safeTransactions]
  );

  const totalWithdrawalsVolume = useMemo(
    () =>
      safeTransactions
        .filter((t) => t.type === 'withdraw' && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safeTransactions]
  );

  const pendingDepositsAmount = useMemo(
    () => safePendingDeposits.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safePendingDeposits]
  );

  const pendingWithdrawalsAmount = useMemo(
    () => safePendingWithdrawals.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safePendingWithdrawals]
  );

  const activeUsersCount = useMemo(
    () => safeRegisteredUsers.filter((u) => !u.isBanned).length,
    [safeRegisteredUsers]
  );

  const bannedUsersCount = useMemo(
    () => safeRegisteredUsers.filter((u) => u.isBanned).length,
    [safeRegisteredUsers]
  );

  // Combine urgent pending requests (max 6 latest)
  const urgentRequests = useMemo(() => {
    const allPending = [...safePendingDeposits, ...safePendingWithdrawals];
    return allPending.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 6);
  }, [safePendingDeposits, safePendingWithdrawals]);

  // Recent 6 transactions
  const recentTransactions = useMemo(() => {
    return [...safeTransactions]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 6);
  }, [safeTransactions]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Overview Banner */}
      <div className="bg-gradient-to-r from-[#170e3b] via-[#1c1248] to-[#140b33] p-4 sm:p-5 rounded-2xl border-2 border-purple-600/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              সার্ভার লাইভ • এডমিন প্যানেল
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>মাস্টার কন্ট্রোল ড্যাশবোর্ড</span>
            <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black">
              KING LUDO
            </span>
          </h2>
          <p className="text-xs text-purple-200">
            আইডি: <span className="text-amber-300 font-mono font-bold">{currentUser?.phone || currentUser?.id || 'admin'}</span> • আপনার সিস্টেমের সকল কার্যক্রম নিচে সহজে পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 flex-wrap">
          {unreadChatCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('live_chat')}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-bounce transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{unreadChatCount} নতুন চ্যাট মেসেজ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => exportUserTelemetryToCSV(safeRegisteredUsers, 'dashboard_users_telemetry')}
            className="px-3 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/50 font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
            title="সকল নিবন্ধিত ইউজারের সংগৃহীত ডিভাইস টেলিমেট্রি CSV হিসেবে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>টেলিমেট্রি CSV</span>
          </button>

          <button
            type="button"
            onClick={onNavigatePlayerHome}
            className="px-3.5 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 border border-purple-600/60 font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>প্লেয়ার স্ক্রিনে যান</span>
          </button>
        </div>
      </div>

      {/* 4 Standard Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Registered Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-[#052a12] hover:bg-[#1a1042] p-4 rounded-2xl border-2 border-purple-600/40 hover:border-purple-500 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-purple-300">মোট ইউজার / প্লেয়ার</p>
              <h3 className="text-2xl font-black text-white mt-1 group-hover:text-amber-300 transition">
                {safeRegisteredUsers.length} <span className="text-xs font-normal text-purple-400">জন</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-600/50 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-800/40 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">সক্রিয়: {activeUsersCount}</span>
            {bannedUsersCount > 0 ? (
              <span className="text-rose-400 font-bold">ব্যানড: {bannedUsersCount}</span>
            ) : (
              <span className="text-purple-400">০ ব্যানড</span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-amber-300 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Pending Deposits */}
        <div
          onClick={() => onNavigateTab('deposits')}
          className={`p-4 rounded-2xl border-2 transition shadow-lg cursor-pointer group flex flex-col justify-between ${
            safePendingDeposits.length > 0
              ? 'bg-gradient-to-br from-[#1d1230] to-[#25102a] border-emerald-500/80 shadow-emerald-950/40'
              : 'bg-[#052a12] hover:bg-[#1a1042] border-purple-600/40 hover:border-purple-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-emerald-300">পেন্ডিং ডিপোজিট</p>
                {safePendingDeposits.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                {safePendingDeposits.length} <span className="text-xs font-normal text-purple-300">টি আবেদন</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-slate-950 transition">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-800/40 flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 font-bold">মোট: ৳{pendingDepositsAmount}</span>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-0.5">
              চেক করুন <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </div>

        {/* Card 3: Pending Withdrawals */}
        <div
          onClick={() => onNavigateTab('withdrawals')}
          className={`p-4 rounded-2xl border-2 transition shadow-lg cursor-pointer group flex flex-col justify-between ${
            safePendingWithdrawals.length > 0
              ? 'bg-gradient-to-br from-[#240e1f] to-[#1c0c2a] border-rose-500/80 shadow-rose-950/40'
              : 'bg-[#052a12] hover:bg-[#1a1042] border-purple-600/40 hover:border-purple-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-rose-300">পেন্ডিং উইথড্র</p>
                {safePendingWithdrawals.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}
              </div>
              <h3 className="text-2xl font-black text-rose-400 mt-1">
                {safePendingWithdrawals.length} <span className="text-xs font-normal text-purple-300">টি আবেদন</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-800/40 flex items-center justify-between text-[11px]">
            <span className="text-rose-300 font-bold">মোট: ৳{pendingWithdrawalsAmount}</span>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-0.5">
              পরিশোধ করুন <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </div>

        {/* Card 4: Total Approved Deposits Volume */}
        <div
          onClick={() => onNavigateTab('transactions')}
          className="bg-[#052a12] hover:bg-[#1a1042] p-4 rounded-2xl border-2 border-purple-600/40 hover:border-purple-500 transition shadow-lg cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-purple-300">মোট সফল ডিপোজিট</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">
                ৳{totalDepositsVolume}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-800/40 flex items-center justify-between text-[11px]">
            <span className="text-purple-300">উইথড্র সম্পন্ন: ৳{totalWithdrawalsVolume}</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-amber-300 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid (অনান্য এডমিন প্যানেলের মতো স্পষ্ট বাটন) */}
      <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-700/50 shadow-md">
        <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>⚡ কুইক অ্যাকশন মেনু (সরাসরি পেজে যান)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('deposits')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-emerald-950/60 border border-purple-700/40 hover:border-emerald-500/80 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-emerald-300">ডিপোজিট</span>
            {safePendingDeposits.length > 0 && (
              <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                {safePendingDeposits.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('withdrawals')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-rose-950/60 border border-purple-700/40 hover:border-rose-500/80 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-rose-300">উইথড্র</span>
            {safePendingWithdrawals.length > 0 && (
              <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full">
                {safePendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('users')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-purple-900/60 border border-purple-700/40 hover:border-purple-400 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-purple-200">ইউজার্স</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('payments')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-pink-950/60 border border-purple-700/40 hover:border-pink-500 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-pink-300">গেটওয়ে ও লোগো</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('live_chat')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-amber-950/60 border border-purple-700/40 hover:border-amber-400 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-amber-300">লাইভ চ্যাট</span>
            {unreadChatCount > 0 && (
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                {unreadChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('notices')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-cyan-950/60 border border-purple-700/40 hover:border-cyan-400 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-cyan-300">হোম নোটিশ</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('game')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-indigo-950/60 border border-purple-700/40 hover:border-indigo-400 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-indigo-300">কমিশন ফি</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('transactions')}
            className="p-3 rounded-xl bg-[#031e0c] hover:bg-purple-900/60 border border-purple-700/40 hover:border-purple-300 flex flex-col items-center justify-center gap-1.5 transition text-center group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-700/50 text-slate-300 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white group-hover:text-slate-200">সব হিস্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Urgent Pending Requests Section (জরুরি অপেক্ষমান রিকোয়েস্ট সরাসরি ড্যাশবোর্ড থেকেই ১-ক্লিকে Approve / Reject) */}
      <div className="bg-[#052a12] p-4 rounded-2xl border-2 border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-purple-800/50 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <h3 className="text-sm font-black text-white">জরুরি অপেক্ষমান রিকোয়েস্ট (Urgent Requests)</h3>
            {(safePendingDeposits.length + safePendingWithdrawals.length) > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {safePendingDeposits.length + safePendingWithdrawals.length} টি বাকি
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('deposits')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>সকল ডিপোজিট</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-purple-600">•</span>
            <button
              type="button"
              onClick={() => onNavigateTab('withdrawals')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>সকল উইথড্র</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {urgentRequests.length === 0 ? (
          <div className="p-6 text-center bg-[#031e0c] rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-300">কোনো অপেক্ষমান ডিপোজিট বা উইথড্র রিকোয়েস্ট নেই!</p>
            <p className="text-xs text-purple-300">সকল লেনদেন অনুমোদিত ও নিয়মিত রয়েছে।</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {urgentRequests.map((req) => {
              const isDeposit = req.type === 'deposit';
              return (
                <div
                  key={req.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isDeposit
                      ? 'bg-[#11092e] border-emerald-500/40 hover:border-emerald-400'
                      : 'bg-[#160826] border-rose-500/40 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-purple-700/60 p-1 flex items-center justify-center shrink-0 shadow-inner">
                      <img
                        src={getPaymentMethodLogo(req.method || 'bKash')}
                        alt={req.method || ''}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(req.method || 'bKash');
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                            isDeposit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isDeposit ? 'ডিপোজিট' : 'উইথড্র'}
                        </span>
                        <span className="font-bold text-xs text-white">{req.userName || 'ইউজার'}</span>
                        <span className="text-[11px] text-purple-300 font-mono">({req.phone || req.accountNumber})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-purple-300 flex-wrap">
                        <span className="font-mono text-amber-300 font-bold">
                          {req.method} • {req.accountNumber || req.phone}
                        </span>
                        {req.transactionId && (
                          <button
                            type="button"
                            onClick={() => handleCopy(req.id, req.transactionId!)}
                            className="inline-flex items-center gap-1 font-mono text-[10px] bg-[#031e0c] px-1.5 py-0.5 rounded text-purple-300 hover:text-white border border-purple-700/40 cursor-pointer"
                            title="TrxID কপি করুন"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            <span>TrxID: {req.transactionId}</span>
                            {copiedId === req.id && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                          </button>
                        )}
                        <span className="text-[10px] text-purple-400">{req.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-800/40">
                    <div className="text-left sm:text-right">
                      <div className={`text-base font-black ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isDeposit ? '+' : '-'}৳{req.amount}
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold">অপেক্ষমান</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApproveTransaction(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow transition active:scale-95 cursor-pointer"
                        title="অনুমোদন করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>অনুমোদন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRejectTransaction(req.id)}
                        className="px-2.5 py-1.5 bg-rose-900/80 hover:bg-rose-700 text-rose-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
                        title={isDeposit ? 'ডিপোজিট বাতিল করুন' : 'উইথড্র বাতিল করুন (টাকা সাথে সাথে ইউজারের আইডিতে ফেরত চলে যাবে)'}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isDeposit ? 'বাতিল' : 'বাতিল ও রিফান্ড'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Analytics & Charts */}
      <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-700/50 shadow-md">
        <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>আর্থিক ও ইউজার গ্রোথ পরিসংখ্যান (Live Charts)</span>
        </h4>
        <AdminStatisticsCharts
          transactions={transactions}
          users={registeredUsers}
          appSettings={appSettings}
        />
      </div>

      {/* Recent Transactions List Preview */}
      <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-700/50 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-purple-800/50 pb-2">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>সাম্প্রতিক লেনদেনের হিস্ট্রি (Recent Logs)</span>
          </h4>
          <button
            type="button"
            onClick={() => onNavigateTab('transactions')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-800/40 text-[11px] text-purple-300">
                <th className="pb-2">ইউজার ও ফোন</th>
                <th className="pb-2">প্রকার</th>
                <th className="pb-2">মেথড</th>
                <th className="pb-2">পরিমাণ</th>
                <th className="pb-2">স্ট্যাটাস</th>
                <th className="pb-2">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-purple-900/20">
                  <td className="py-2.5 font-bold text-white">{trx.userName || trx.phone || 'ইউজার'}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        trx.type === 'deposit'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : trx.type === 'withdraw'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {trx.type === 'deposit' ? 'ডিপোজিট' : trx.type === 'withdraw' ? 'উইথড্র' : trx.type}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-purple-200">{trx.method || 'N/A'}</td>
                  <td className="py-2.5 font-bold font-mono text-amber-300">৳{trx.amount}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        trx.status === 'Success'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : trx.status === 'Pending'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {trx.status === 'Success' ? 'সফল' : trx.status === 'Pending' ? 'অপেক্ষমান' : 'বাতিল'}
                    </span>
                  </td>
                  <td className="py-2.5 text-purple-400 text-[10px]">{trx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
