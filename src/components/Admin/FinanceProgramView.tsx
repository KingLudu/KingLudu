import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  ArrowLeftRight,
  Gamepad2,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Filter,
  Download,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  CheckSquare,
  Square,
  CheckCheck,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Transaction, PaymentMethod } from '../../types';
import { sounds } from '../../utils/soundEffects';
import {
  BulkProgressState,
  initialBulkProgressState,
  BulkTransactionSkeletonCard,
  BulkProgressFloatingBanner,
  BulkProgressModal
} from './BulkProgressIndicator';

interface FinanceProgramViewProps {
  transactions: Transaction[];
  onApproveTransaction: (trxId: string) => void;
  onRejectTransaction: (trxId: string) => void;
  onBulkApproveTransactions?: (trxIds: string[]) => void;
  onBulkRejectTransactions?: (trxIds: string[]) => void;
  subTab?: 'deposits' | 'withdrawals' | 'all_transactions' | 'agent_trans' | 'game_trans';
  onSubTabChange?: (tab: 'deposits' | 'withdrawals' | 'all_transactions' | 'agent_trans' | 'game_trans') => void;
}

export const FinanceProgramView: React.FC<FinanceProgramViewProps> = ({
  transactions = [],
  onApproveTransaction,
  onRejectTransaction,
  onBulkApproveTransactions,
  onBulkRejectTransactions,
  subTab: externalSubTab,
  onSubTabChange,
}) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const [internalSubTab, setInternalSubTab] = useState<'deposits' | 'withdrawals' | 'all_transactions' | 'agent_trans' | 'game_trans'>('deposits');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: 'deposits' | 'withdrawals' | 'all_transactions' | 'agent_trans' | 'game_trans') => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Success' | 'Failed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Bulk action states
  const [selectedTrxIds, setSelectedTrxIds] = useState<string[]>([]);
  const [bulkConfirmModal, setBulkConfirmModal] = useState<{
    action: 'approve' | 'reject';
    ids: string[];
  } | null>(null);
  const [bulkFinancialSafetyAcknowledged, setBulkFinancialSafetyAcknowledged] = useState(false);
  const [bulkSuccessNotice, setBulkSuccessNotice] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<BulkProgressState>(initialBulkProgressState);

  // Mock agent transactions state
  const [agentTransactions] = useState([
    { id: 'at_1', agentName: 'রাশেদ ট্রেডার্স (মিরপুর)', phone: '01700000000', type: 'Float Refill', amount: 50000, date: 'আজ ০১:১০ PM', status: 'Success' },
    { id: 'at_2', agentName: 'চট্টগ্রাম সুপার ক্যাশ', phone: '01812345678', type: 'Player Cash-In', amount: 12000, date: 'আজ ১২:২৫ PM', status: 'Success' },
    { id: 'at_3', agentName: 'রাজশাহী লুডো এক্সপ্রেস', phone: '01711223344', type: 'Commission Payout', amount: 3500, date: 'গতকাল', status: 'Success' },
  ]);

  // Mock game transactions state (Rake / House commission / Winner payouts)
  const [gameTransactions] = useState([
    { id: 'gt_1', roomCode: 'KL-8821', game: 'কিং লুডো ক্লাসিক ২-প্লেয়ার', stake: 500, winner: 'ইউজার ০১৭১১***', prize: 900, commission: 100, date: 'আজ ০২:১০ PM' },
    { id: 'gt_2', roomCode: 'KL-4490', game: 'কিং লুডো ৪-প্লেয়ার যুদ্ধ', stake: 1000, winner: 'ইউজার ০১৯৮৮***', prize: 3600, commission: 400, date: 'আজ ০১:৫০ PM' },
    { id: 'gt_3', roomCode: 'TOUR-902', game: 'কিং কাপ টুর্নামেন্ট', stake: 2500, winner: 'ইউজার ০১৮৪৪***', prize: 8500, commission: 1500, date: 'আজ ১২:৩০ PM' },
  ]);

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

  // Filter regular transactions based on subTab
  const filteredList = useMemo(() => {
    return safeTransactions.filter((trx) => {
      // Type condition
      if (activeSubTab === 'deposits' && trx.type !== 'deposit') return false;
      if (activeSubTab === 'withdrawals' && trx.type !== 'withdraw') return false;

      // Status condition
      if (statusFilter !== 'all' && trx.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (trx.title || '').toLowerCase().includes(q);
        const matchPhone = (trx.accountNumber || '').includes(q);
        const matchTrx = (trx.trxId || '').toLowerCase().includes(q);
        const matchMethod = (trx.paymentMethod || '').toLowerCase().includes(q);
        if (!matchTitle && !matchPhone && !matchTrx && !matchMethod) return false;
      }

      return true;
    });
  }, [safeTransactions, activeSubTab, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalDeposits = safeTransactions.filter((t) => t.type === 'deposit' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0);
    const totalWithdraws = safeTransactions.filter((t) => t.type === 'withdraw' && t.status === 'Success').reduce((acc, t) => acc + t.amount, 0);
    const pendingDepositsCount = safeTransactions.filter((t) => t.type === 'deposit' && t.status === 'Pending').length;
    const pendingWithdrawsCount = safeTransactions.filter((t) => t.type === 'withdraw' && t.status === 'Pending').length;
    return { totalDeposits, totalWithdraws, pendingDepositsCount, pendingWithdrawsCount };
  }, [safeTransactions]);

  // Pending transactions in current filtered view
  const pendingInFiltered = useMemo(() => filteredList.filter((t) => t.status === 'Pending'), [filteredList]);
  const pendingDepositsInFiltered = useMemo(() => filteredList.filter((t) => t.type === 'deposit' && t.status === 'Pending'), [filteredList]);
  const pendingWithdrawalsInFiltered = useMemo(() => filteredList.filter((t) => t.type === 'withdraw' && t.status === 'Pending'), [filteredList]);

  // Selected transactions details
  const selectedTransactions = useMemo(() => {
    const set = new Set(selectedTrxIds);
    return safeTransactions.filter((t) => set.has(t.id));
  }, [safeTransactions, selectedTrxIds]);

  const selectedStats = useMemo(() => {
    const totalAmount = selectedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const depList = selectedTransactions.filter((t) => t.type === 'deposit');
    const withList = selectedTransactions.filter((t) => t.type === 'withdraw');
    return {
      count: selectedTransactions.length,
      totalAmount,
      depCount: depList.length,
      depTotal: depList.reduce((sum, t) => sum + t.amount, 0),
      withCount: withList.length,
      withTotal: withList.reduce((sum, t) => sum + t.amount, 0),
    };
  }, [selectedTransactions]);

  const handleToggleSelect = (trxId: string) => {
    setSelectedTrxIds((prev) =>
      prev.includes(trxId) ? prev.filter((id) => id !== trxId) : [...prev, trxId]
    );
  };

  const handleSelectAllPending = () => {
    if (selectedTrxIds.length === pendingInFiltered.length && pendingInFiltered.length > 0) {
      setSelectedTrxIds([]);
    } else {
      setSelectedTrxIds(pendingInFiltered.map((t) => t.id));
    }
  };

  const handleSelectAllPendingDeposits = () => {
    const depIds = pendingDepositsInFiltered.map((t) => t.id);
    setSelectedTrxIds(depIds);
  };

  const handleSelectAllPendingWithdrawals = () => {
    const withIds = pendingWithdrawalsInFiltered.map((t) => t.id);
    setSelectedTrxIds(withIds);
  };

  const handleClearSelection = () => {
    setSelectedTrxIds([]);
  };

  const handlePromptBulkAction = (action: 'approve' | 'reject') => {
    if (selectedTrxIds.length === 0) return;
    setBulkFinancialSafetyAcknowledged(false);
    setBulkConfirmModal({ action, ids: [...selectedTrxIds] });
  };

  const executeBulkActionWithProgress = (action: 'approve' | 'reject', targetIds: string[]) => {
    if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) return;
    setBulkConfirmModal(null);

    const total = targetIds.length;
    // Step 1: Initialize optimistic progress state and mark items as processing
    setBulkProgress({
      isActive: true,
      isMinimized: false,
      action,
      total,
      completedCount: 0,
      processingIds: [...targetIds],
      completedIds: [],
      failedIds: [],
      stageMessage: action === 'approve' ? 'অপ্টিমিস্টিক ব্যালেন্স সিঙ্ক শুরু হচ্ছে...' : 'উইথড্র রিফান্ড ও বাতিল শুরু হচ্ছে...',
      percentage: 10,
      isFinished: false,
      successNotice: null,
    });

    // Step 2: Optimistic update in state
    let completed = 0;
    const stepDuration = Math.max(120, Math.min(320, Math.floor(1100 / total)));

    const interval = setInterval(() => {
      completed += 1;
      const currentId = targetIds[completed - 1];
      const pct = Math.min(Math.round((completed / total) * 100), 100);

      setBulkProgress((prev) => ({
        ...prev,
        completedCount: completed,
        percentage: pct,
        currentId,
        completedIds: [...prev.completedIds, currentId],
        stageMessage: action === 'approve'
          ? `অনুমোদন সম্পন্ন হচ্ছে (${completed}/${total}): আইডি ...${currentId.slice(-6)}`
          : `বাতিল ও রিফান্ড হচ্ছে (${completed}/${total}): আইডি ...${currentId.slice(-6)}`,
      }));

      if (completed >= total) {
        clearInterval(interval);

        // Finalize transaction state updates
        if (action === 'approve') {
          if (onBulkApproveTransactions) {
            onBulkApproveTransactions(targetIds);
          } else {
            targetIds.forEach((id) => onApproveTransaction(id));
          }
          try {
            sounds.playTransactionAlert('deposit', 'cash_register');
          } catch (e) {
            console.error(e);
          }
        } else {
          if (onBulkRejectTransactions) {
            onBulkRejectTransactions(targetIds);
          } else {
            targetIds.forEach((id) => onRejectTransaction(id));
          }
          try {
            sounds.playBellTone(0.8);
          } catch (e) {
            console.error(e);
          }
        }

        setBulkProgress((prev) => ({
          ...prev,
          isFinished: true,
          percentage: 100,
          stageMessage: action === 'approve'
            ? `সফলভাবে ${total} টি লেনদেন অনুমোদন সম্পন্ন হয়েছে!`
            : `সফলভাবে ${total} টি লেনদেন বাতিল ও রিফান্ড সম্পন্ন হয়েছে!`,
        }));

        setSelectedTrxIds((prev) => prev.filter((id) => !targetIds.includes(id)));
        setBulkSuccessNotice(`সফলভাবে ${total} টি লেনদেন এক ক্লিকে ${action === 'approve' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে!`);
        setTimeout(() => setBulkSuccessNotice(null), 4000);

        // Auto close after completion
        setTimeout(() => {
          setBulkProgress((prev) => ({ ...prev, isActive: false, processingIds: [] }));
        }, 1200);
      }
    }, stepDuration);
  };

  const executeBulkApprove = (targetIds: string[]) => {
    executeBulkActionWithProgress('approve', targetIds);
  };

  const executeBulkReject = (targetIds: string[]) => {
    executeBulkActionWithProgress('reject', targetIds);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Wallet className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Finance (ফাইন্যান্স কন্ট্রোল)</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                ক্যাশ ও ট্রানজাকশন
              </span>
            </div>
            <p className="text-xs text-purple-200">
              ডিপোজিট, উইথড্রল, এজেন্ট ও গেম লেনদেনের পূর্ণ বিবরণ ও অনুমোদন
            </p>
          </div>
        </div>

        {/* Quick Balance Stats */}
        <div className="flex items-center gap-3 bg-[#031e0c]/80 p-2.5 rounded-xl border border-purple-800/60 text-xs">
          <div>
            <span className="text-[10px] text-emerald-300 block">মোট ডিপোজিট:</span>
            <span className="font-mono font-black text-emerald-400">৳{stats.totalDeposits.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 bg-purple-800/60" />
          <div>
            <span className="text-[10px] text-rose-300 block">মোট উইথড্র:</span>
            <span className="font-mono font-black text-rose-400">৳{stats.totalWithdraws.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Finance Sub-Programs Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('deposits')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'deposits'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-lg'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
          <span>ডিপোজিট (Deposits)</span>
          {stats.pendingDepositsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {stats.pendingDepositsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('withdrawals')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'withdrawals'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-lg'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-300" />
          <span>উইথড্রল (Withdrawals)</span>
          {stats.pendingWithdrawsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {stats.pendingWithdrawsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('all_transactions')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'all_transactions'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-500" />
          <span>সকল লেনদেন (All Transactions)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('agent_trans')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'agent_trans'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-lg'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4 text-blue-300" />
          <span>এজেন্ট ট্রানজাকশন (Agent Trans.)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('game_trans')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'game_trans'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-700 text-white font-black shadow-lg'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-300" />
          <span>গেম ট্রানজাকশন (Game Trans.)</span>
        </button>
      </div>

      {/* Main Content Area based on SubTab */}
      {activeSubTab === 'agent_trans' ? (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-blue-400" />
              <span>এজেন্ট লেনদেন হিস্ট্রি (Agent Transactions)</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-mono">মোট ৩টি রেকর্ড</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">এজেন্ট নাম</th>
                  <th className="py-2 px-3">ফোন নম্বর</th>
                  <th className="py-2 px-3">লেনদেন টাইপ</th>
                  <th className="py-2 px-3">পরিমাণ</th>
                  <th className="py-2 px-3">তারিখ ও সময়</th>
                  <th className="py-2 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {agentTransactions.map((at, atIdx) => (
                  <tr key={`finance-agent-trx-${at.id || atIdx}-${atIdx}`} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3 font-bold text-white">{at.agentName}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">{at.phone}</td>
                    <td className="py-2.5 px-3 font-medium text-amber-300">{at.type}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-emerald-400">৳{at.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{at.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/50 text-[10px] font-black rounded-full">
                        {at.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'game_trans' ? (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>গেম রেজাল্ট ও হাউস কমিশন ট্রানজাকশন (Game Rake & Payouts)</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-mono">লাইভ ম্যাচ রেকর্ড</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">রুম কোড</th>
                  <th className="py-2 px-3">গেম মোড</th>
                  <th className="py-2 px-3">স্টেক ফি</th>
                  <th className="py-2 px-3">বিজয়ী প্লেয়ার</th>
                  <th className="py-2 px-3">উইনিং প্রাইজ</th>
                  <th className="py-2 px-3">হাউস কমিশন (প্ল্যাটফর্ম লাভ)</th>
                  <th className="py-2 px-3">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {gameTransactions.map((gt, gtIdx) => (
                  <tr key={`finance-game-trx-${gt.id || gtIdx}-${gtIdx}`} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{gt.roomCode}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{gt.game}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-300">৳{gt.stake}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{gt.winner}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">৳{gt.prize}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-300 bg-amber-950/40 px-2 rounded">
                      +৳{gt.commission} (১০-১৫%)
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{gt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Regular Transactions: Deposits, Withdrawals, All */
        <div className="space-y-3 relative">
          {/* Toast / Notification Banner for Bulk Actions */}
          {bulkSuccessNotice && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                <span className="text-xs font-black">{bulkSuccessNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setBulkSuccessNotice(null)}
                className="p-1 hover:bg-emerald-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-[#052a12] p-3 rounded-2xl border border-purple-800/50 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="নম্বর, TrxID বা মেথড দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'Pending', 'Success', 'Failed'] as const).map((st, stIdx) => (
                  <button
                    key={`filter-status-${st}-${stIdx}`}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs ${
                      statusFilter === st
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                    }`}
                  >
                    {st === 'all' ? 'সব স্ট্যাটাস' : st === 'Pending' ? 'পেন্ডিং' : st === 'Success' ? 'সফল' : 'বাতিল'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar (Always accessible when there are pending items) */}
          {pendingInFiltered.length > 0 && (
            <div className="bg-gradient-to-r from-[#170a36] via-[#210f4c] to-[#170a36] p-3 rounded-2xl border border-amber-500/40 shadow-lg flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSelectAllPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-white font-bold text-xs border border-purple-700/70 transition cursor-pointer active:scale-95 shadow"
                >
                  {selectedTrxIds.length > 0 && selectedTrxIds.length === pendingInFiltered.length ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-purple-300" />
                  )}
                  <span>
                    {selectedTrxIds.length > 0 && selectedTrxIds.length === pendingInFiltered.length
                      ? 'সব আনচেক করুন'
                      : `সব মুলতুবি নির্বাচন (${pendingInFiltered.length})`}
                  </span>
                </button>

                {pendingDepositsInFiltered.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllPendingDeposits}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>শুধুমাত্র ডিপোজিট ({pendingDepositsInFiltered.length})</span>
                  </button>
                )}

                {pendingWithdrawalsInFiltered.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllPendingWithdrawals}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-700/60 transition cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>শুধুমাত্র উইথড্র ({pendingWithdrawalsInFiltered.length})</span>
                  </button>
                )}

                {selectedTrxIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer"
                  >
                    নির্বাচন রিসেট
                  </button>
                )}
              </div>

              {selectedTrxIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300 font-black bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/50 shadow">
                    নির্বাচিত: {selectedTrxIds.length} টি • ৳{selectedStats.totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="bg-[#052a12] p-8 rounded-2xl text-center text-xs text-purple-300 border border-purple-800/40">
                কোন ট্রানজাকশন রিকোয়েস্ট পাওয়া যায়নি।
              </div>
            ) : (
              filteredList.map((trx, trxIdx) => {
                // If item is actively being processed in bulk, show optimistic skeleton card
                if (bulkProgress.processingIds.includes(trx.id)) {
                  return (
                    <BulkTransactionSkeletonCard
                      key={`finance-skeleton-${trx.id || trxIdx}`}
                      action={bulkProgress.action}
                      type={trx.type}
                      amount={trx.amount}
                      accountNumber={trx.accountNumber}
                      paymentMethod={trx.paymentMethod}
                    />
                  );
                }

                const isSelected = selectedTrxIds.includes(trx.id);
                return (
                  <div
                    key={`finance-trx-${trx.id || trxIdx}-${trxIdx}`}
                    className={`bg-[#052a12] p-3.5 rounded-2xl border space-y-2.5 transition relative ${
                      isSelected
                        ? 'border-amber-400 bg-[#22104a] shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/50'
                        : 'border-purple-800/40 hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Checkbox for Pending Transactions */}
                        {trx.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(trx.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                                : 'bg-[#031e0c] text-purple-400 border-purple-700 hover:border-amber-400/70 hover:text-white'
                            }`}
                            title={isSelected ? 'আনচেক করুন' : 'নির্বাচন করুন'}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-slate-950" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                            <span className="text-[10px] font-black hidden sm:inline">
                              {isSelected ? 'সিলেক্টেড' : 'সিলেক্ট'}
                            </span>
                          </button>
                        )}

                        <span
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                            trx.type === 'deposit'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-700/50'
                          }`}
                        >
                          {trx.type === 'deposit' ? (
                            <>
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                              <span>ডিপোজিট (Deposit)</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>উইথড্র (Withdraw)</span>
                            </>
                          )}
                        </span>
                        <span className="font-extrabold text-xs text-white bg-purple-950 px-2 py-0.5 rounded-lg border border-purple-800/40">
                          {trx.paymentMethod || 'Mobile Banking'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          trx.status === 'Pending'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : trx.status === 'Success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {trx.status === 'Pending' ? 'পেন্ডিং' : trx.status === 'Success' ? 'সফল' : 'বাতিল'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        {trx.userId && (
                          <div className="text-amber-300 font-mono text-[11px] flex items-center gap-1.5 flex-wrap bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/40 w-fit">
                            <span className="text-amber-400 font-bold">ইউজার আইডি (User ID):</span>
                            <strong className="text-white font-black">{trx.userId}</strong>
                            {trx.userName && <span className="text-purple-300 font-sans">({trx.userName})</span>}
                          </div>
                        )}
                        <div className="text-purple-300 font-mono text-[11px] flex items-center gap-1">
                          <span>অ্যাকাউন্ট:</span>
                          <strong className="text-white">{trx.accountNumber || 'N/A'}</strong>
                          {trx.accountNumber && (
                            <button
                              type="button"
                              onClick={() => handleCopy(trx.accountNumber!, `acc_${trx.id}`)}
                              className="text-purple-400 hover:text-white p-0.5 ml-1 cursor-pointer"
                              title="কপি"
                            >
                              {copiedId === `acc_${trx.id}` ? (
                                <span className="text-[9px] text-emerald-400 font-bold">কপি!</span>
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          )}
                        </div>
                        {trx.trxId && (
                          <div className="text-purple-300 font-mono text-[11px] flex items-center gap-1">
                            <span>TrxID:</span>
                            <strong className="text-amber-300">{trx.trxId}</strong>
                            <button
                              type="button"
                              onClick={() => handleCopy(trx.trxId!, `trx_${trx.id}`)}
                              className="text-purple-400 hover:text-white p-0.5 ml-1 cursor-pointer"
                              title="কপি"
                            >
                              {copiedId === `trx_${trx.id}` ? (
                                <span className="text-[9px] text-emerald-400 font-bold">কপি!</span>
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400">{trx.date} • {trx.time}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-purple-300 block">পরিমাণ</span>
                        <span className="font-mono font-black text-base text-amber-400">
                          ৳{trx.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {trx.status === 'Pending' && (
                      <div className="flex gap-2 pt-2 border-t border-purple-900/50">
                        <button
                          type="button"
                          onClick={() => onApproveTransaction(trx.id)}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer transition active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>অনুমোদন (Approve)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectTransaction(trx.id)}
                          className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer transition active:scale-95"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>বাতিল (Reject)</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Floating Bulk Action Command Bar */}
          {selectedTrxIds.length > 0 && (
            <div className="sticky bottom-2 z-30 bg-gradient-to-r from-[#063314] via-[#095220] to-[#063314] border-2 border-amber-400 p-3 sm:p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-extrabold text-sm">
                        {selectedStats.count} টি লেনদেন নির্বাচিত
                      </span>
                      <span className="font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 text-xs">
                        মোট: ৳{selectedStats.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200 mt-0.5">
                      {selectedStats.depCount > 0 && `${selectedStats.depCount}টি ডিপোজিট (৳${selectedStats.depTotal.toLocaleString()})`}
                      {selectedStats.depCount > 0 && selectedStats.withCount > 0 && ' • '}
                      {selectedStats.withCount > 0 && `${selectedStats.withCount}টি উইথড্র (৳${selectedStats.withTotal.toLocaleString()})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePromptBulkAction('approve')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>এক ক্লিকে অনুমোদন ({selectedStats.count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePromptBulkAction('reject')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>এক ক্লিকে বাতিল ({selectedStats.count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="p-2.5 bg-purple-900/60 hover:bg-purple-800 text-purple-300 rounded-xl transition cursor-pointer"
                    title="নির্বাচন মুছুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Action Confirmation Modal */}
          {bulkConfirmModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-[#14092f] border-2 border-amber-400 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        bulkConfirmModal.action === 'approve'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {bulkConfirmModal.action === 'approve' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        {bulkConfirmModal.action === 'approve'
                          ? 'বাল্ক অনুমোদন নিশ্চিতকরণ (Bulk Approval)'
                          : 'বাল্ক প্রত্যাখ্যান নিশ্চিতকরণ (Bulk Rejection)'}
                      </h3>
                      <p className="text-[11px] text-purple-300">
                        এক ক্লিকে একাধিক পেন্ডিং লেনদেন প্রক্রিয়া করুন
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBulkConfirmModal(null)}
                    className="p-1 text-purple-400 hover:text-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#0b041e] p-3 rounded-2xl border border-purple-800/50">
                    <span className="text-[11px] text-purple-300 block">নির্বাচিত লেনদেন</span>
                    <span className="text-lg font-black text-white font-mono">
                      {bulkConfirmModal.ids?.length || 0} টি
                    </span>
                  </div>
                  <div className="bg-[#0b041e] p-3 rounded-2xl border border-purple-800/50">
                    <span className="text-[11px] text-purple-300 block">মোট পরিমাণ</span>
                    <span className="text-lg font-black text-amber-300 font-mono">
                      ৳{selectedStats.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Specifics for deposit vs withdraw */}
                <div className="bg-[#0b041e]/90 p-3 rounded-2xl border border-purple-800/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      ডিপোজিট রিকোয়েস্ট:
                    </span>
                    <span className="font-mono font-bold">
                      {selectedStats.depCount} টি (৳{selectedStats.depTotal.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-rose-300">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      উইথড্র রিকোয়েস্ট:
                    </span>
                    <span className="font-mono font-bold">
                      {selectedStats.withCount} টি (৳{selectedStats.withTotal.toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* List Preview */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-purple-300">লেনদেনের সংক্ষিপ্ত তালিকা:</span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                    {selectedTransactions.map((trx, mIdx) => (
                      <div
                        key={`finance-modal-trx-${trx.id || mIdx}-${mIdx}`}
                        className="p-2 bg-[#0b041e] rounded-xl border border-purple-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              trx.type === 'deposit'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                            }`}
                          >
                            {trx.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                          </span>
                          <span className="font-mono text-white text-[11px]">{trx.accountNumber || trx.trxId || 'N/A'}</span>
                          <span className="text-purple-400 text-[10px]">({trx.paymentMethod})</span>
                        </div>
                        <span className="font-mono font-black text-amber-300 text-xs">৳{trx.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accidental Financial Update Prevention & Warning Box */}
                <div className="bg-red-950/40 border-2 border-red-500/50 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-black">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>দুর্ঘটনাজনিত আর্থিক আপডেট রোধে বিশেষ নিরাপত্তা নিশ্চিতকরণ</span>
                  </div>
                  <p className="text-[11px] text-purple-200 leading-relaxed">
                    {bulkConfirmModal.action === 'approve'
                      ? 'অনুমোদন করলে পেন্ডিং ডিপোজিটের টাকা সরাসরি ইউজারের মূল ব্যালেন্সে যুক্ত হবে এবং উইথড্রল সম্পন্ন হবে।'
                      : 'বাতিল করলে পেন্ডিং উইথড্রলের টাকা ইউজারের ওয়ালেটে ফেরত যাবে এবং ডিপোজিট বাতিল হবে।'}
                  </p>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-xs text-white bg-purple-950/60 p-2 rounded-xl border border-purple-700/50 select-none hover:bg-purple-900/60 transition">
                    <input
                      type="checkbox"
                      checked={bulkFinancialSafetyAcknowledged}
                      onChange={(e) => setBulkFinancialSafetyAcknowledged(e.target.checked)}
                      className="mt-0.5 rounded border-purple-500 bg-purple-950 text-amber-400 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-amber-200 leading-snug">
                      আমি যাচাই করেছি এবং নিশ্চিত করছি যে নির্বাচিত {bulkConfirmModal.ids?.length || 0} টি লেনদেনের আর্থিক হিসাব সঠিক আছে।
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkConfirmModal(null);
                      setBulkFinancialSafetyAcknowledged(false);
                    }}
                    className="flex-1 py-2.5 bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl border border-purple-800/50 transition cursor-pointer"
                  >
                    ফিরে যান (বাতিল)
                  </button>
                  {bulkConfirmModal.action === 'approve' ? (
                    <button
                      type="button"
                      disabled={!bulkFinancialSafetyAcknowledged}
                      onClick={() => executeBulkApprove(bulkConfirmModal.ids)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition ${
                        bulkFinancialSafetyAcknowledged
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white active:scale-95 cursor-pointer shadow-emerald-950/40'
                          : 'bg-purple-950/60 text-purple-400/50 border border-purple-800/40 cursor-not-allowed'
                      }`}
                      title={!bulkFinancialSafetyAcknowledged ? 'প্রথমে উপরের চেকবক্সে টিক চিহ্ন দিন' : 'অনুমোদন নিশ্চিত করুন'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{bulkFinancialSafetyAcknowledged ? 'হ্যাঁ, এক ক্লিকে অনুমোদন করুন' : 'নিরাপত্তা নিশ্চিত করুন'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!bulkFinancialSafetyAcknowledged}
                      onClick={() => executeBulkReject(bulkConfirmModal.ids)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition ${
                        bulkFinancialSafetyAcknowledged
                          ? 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white active:scale-95 cursor-pointer shadow-rose-950/40'
                          : 'bg-purple-950/60 text-purple-400/50 border border-purple-800/40 cursor-not-allowed'
                      }`}
                      title={!bulkFinancialSafetyAcknowledged ? 'প্রথমে উপরের চেকবক্সে টিক চিহ্ন দিন' : 'বাতিল নিশ্চিত করুন'}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{bulkFinancialSafetyAcknowledged ? 'হ্যাঁ, এক ক্লিকে বাতিল করুন' : 'নিরাপত্তা নিশ্চিত করুন'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Top Progress Banner */}
      <BulkProgressFloatingBanner
        progress={bulkProgress}
        onMaximize={() => setBulkProgress((prev) => ({ ...prev, isMinimized: false }))}
      />

      {/* Full Screen Visual Progress Modal */}
      <BulkProgressModal
        isOpen={bulkProgress.isActive && !bulkProgress.isMinimized}
        progress={bulkProgress}
        transactions={safeTransactions}
        onMinimize={() => setBulkProgress((prev) => ({ ...prev, isMinimized: true }))}
        onClose={() => setBulkProgress(initialBulkProgressState)}
      />
    </div>
  );
};
