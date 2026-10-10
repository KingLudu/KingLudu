import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Minimize2,
  Maximize2,
  ShieldCheck,
  CheckCheck,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { Transaction } from '../../types';

export interface BulkProgressState {
  isActive: boolean;
  isMinimized: boolean;
  action: 'approve' | 'reject';
  total: number;
  completedCount: number;
  currentId?: string;
  processingIds: string[];
  completedIds: string[];
  failedIds: string[];
  stageMessage: string;
  percentage: number;
  isFinished: boolean;
  successNotice?: string | null;
}

export const initialBulkProgressState: BulkProgressState = {
  isActive: false,
  isMinimized: false,
  action: 'approve',
  total: 0,
  completedCount: 0,
  processingIds: [],
  completedIds: [],
  failedIds: [],
  stageMessage: '',
  percentage: 0,
  isFinished: false,
  successNotice: null,
};

// 1. Transaction Item Skeleton Card for in-progress optimistic updates
export const BulkTransactionSkeletonCard: React.FC<{
  action?: 'approve' | 'reject';
  type?: 'deposit' | 'withdraw';
  amount?: number;
  accountNumber?: string;
  paymentMethod?: string;
}> = ({
  action = 'approve',
  type = 'deposit',
  amount,
  accountNumber,
  paymentMethod = 'Mobile Banking',
}) => {
  const isApprove = action === 'approve';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#170e3a] via-[#241352] to-[#170e3a] p-3.5 rounded-2xl border border-amber-400/40 shadow-lg space-y-2.5 animate-pulse">
      {/* Shimmer sweep animation overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 ${
              type === 'deposit'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                : 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
            }`}
          >
            {type === 'deposit' ? (
              <ArrowDownLeft className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 animate-bounce" />
            )}
            <span>{type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}</span>
          </div>

          <span className="font-extrabold text-xs text-purple-200 bg-purple-950/90 px-2 py-0.5 rounded-lg border border-purple-800/50">
            {paymentMethod}
          </span>
        </div>

        {/* Optimistic Status Tag */}
        <div
          className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${
            isApprove
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
              : 'bg-rose-500/20 text-rose-300 border-rose-400/50'
          }`}
        >
          <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
          <span>{isApprove ? 'অনুমোদন সিঙ্ক হচ্ছে...' : 'বাতিল সিঙ্ক হচ্ছে...'}</span>
        </div>
      </div>

      {/* Middle row details */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-800/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-purple-300 text-[11px]">অ্যাকাউন্ট:</span>
            {accountNumber ? (
              <span className="font-mono text-white font-bold">{accountNumber}</span>
            ) : (
              <div className="h-3 w-24 bg-purple-700/60 rounded animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-[10px]">স্ট্যাটাস সিঙ্ক:</span>
            <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              অপ্টিমিস্টিক আপডেট সক্রিয়
            </span>
          </div>
        </div>

        {/* Amount with pulse */}
        <div className="text-right">
          {amount ? (
            <span className="text-base font-black font-mono text-amber-300">
              ৳{amount.toLocaleString()}
            </span>
          ) : (
            <div className="h-5 w-16 bg-amber-500/30 rounded animate-pulse ml-auto" />
          )}
          <span className="text-[9px] text-purple-400 block mt-0.5">প্রসেসিং চলছে</span>
        </div>
      </div>
    </div>
  );
};

// 2. Floating Top Banner during Bulk Processing
export const BulkProgressFloatingBanner: React.FC<{
  progress: BulkProgressState;
  onMaximize: () => void;
}> = ({ progress, onMaximize }) => {
  if (!progress.isActive) return null;

  const isApprove = progress.action === 'approve';

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg bg-gradient-to-r from-[#10072b] via-[#1c0c45] to-[#10072b] border-2 border-amber-400/80 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.3)] p-3 text-white backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              isApprove
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
            }`}
          >
            {progress.isFinished ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            )}
          </div>
          <div>
            <h5 className="text-xs font-black flex items-center gap-1.5">
              <span>
                {isApprove ? 'বাল্ক অনুমোদন প্রসেসিং' : 'বাল্ক বাতিল প্রসেসিং'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-mono font-bold">
                {progress.completedCount} / {progress.total}
              </span>
            </h5>
            <p className="text-[10px] text-purple-200 truncate max-w-[240px]">
              {progress.stageMessage || 'অপ্টিমিস্টিক আপডেট পরিচালিত হচ্ছে...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-black text-amber-300">
            {progress.percentage}%
          </span>
          <button
            type="button"
            onClick={onMaximize}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] rounded-lg transition active:scale-95 flex items-center gap-1 shadow cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
            <span>বিস্তারিত</span>
          </button>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full bg-purple-950/80 h-2 rounded-full overflow-hidden border border-purple-800/60">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isApprove
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300'
              : 'bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300'
          }`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
};

// 3. Full Visual Progress Indicator Modal
export const BulkProgressModal: React.FC<{
  isOpen: boolean;
  progress: BulkProgressState;
  transactions: Transaction[];
  onMinimize: () => void;
  onClose: () => void;
}> = ({ isOpen, progress, transactions, onMinimize, onClose }) => {
  if (!isOpen || !progress.isActive) return null;

  const isApprove = progress.action === 'approve';

  // Map the transaction objects in the batch
  const batchTrx = (progress.processingIds.length > 0
    ? progress.processingIds
    : progress.completedIds
  )
    .map((id) => transactions.find((t) => t.id === id))
    .filter(Boolean) as Transaction[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1c0c45] via-[#12072e] to-[#0a031c] border-2 border-amber-400/80 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.25)] text-white relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-inner ${
                isApprove
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {progress.isFinished ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>
                  {progress.isFinished
                    ? 'বাল্ক প্রক্রিয়া সফলভাবে সম্পন্ন!'
                    : isApprove
                    ? 'বাল্ক অনুমোদন অগ্রগতি'
                    : 'বাল্ক বাতিল অগ্রগতি'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              </h4>
              <p className="text-[10px] text-purple-300">
                অপ্টিমিস্টিক স্টেট আপডেট ও ব্যালেন্স সিঙ্ক
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-800/60 transition cursor-pointer"
            title="মিনিমাইজ করে পটভূমিতে রাখুন"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Central Progress Visual Gauge */}
        <div className="bg-[#0f0624] p-4 rounded-2xl border border-purple-800/50 text-center space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-purple-300 font-bold">সম্পন্নতার মাত্রা:</span>
            <span className="font-mono font-black text-amber-300 text-base">
              {progress.percentage}%
            </span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full bg-purple-950 h-3 rounded-full overflow-hidden border border-purple-800 p-0.5 shadow-inner">
            <div
              className={`h-full transition-all duration-300 rounded-full shadow-lg ${
                isApprove
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400'
                  : 'bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Counter Status */}
          <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1">
            <span className="flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {progress.completedCount} / {progress.total} টি লেনদেন সিঙ্ক হয়েছে
            </span>
            <span className="font-mono text-amber-200">
              {progress.isFinished
                ? '১০০% ফাইনাল'
                : `বাকি: ${progress.total - progress.completedCount} টি`}
            </span>
          </div>

          {/* Current Stage Message */}
          <div className="bg-purple-950/60 py-1.5 px-3 rounded-xl border border-purple-800/40 text-[11px] text-amber-200 flex items-center justify-center gap-1.5 font-medium">
            {!progress.isFinished ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{progress.stageMessage}</span>
          </div>
        </div>

        {/* Real-time Checklist of Items */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 px-1">
            <span>লেনদেন তালিকা অগ্রগতি:</span>
            <span>{batchTrx.length} টি আইটেম</span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {batchTrx.map((trx, idx) => {
              const isCompleted = progress.completedIds.includes(trx.id);
              const isCurrent = progress.currentId === trx.id;

              return (
                <div
                  key={`progress-item-${trx.id || idx}`}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
                      : isCurrent
                      ? 'bg-amber-950/40 border-amber-400/80 text-amber-200 ring-1 ring-amber-400/40'
                      : 'bg-[#0d0524] border-purple-900/60 text-purple-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Status Icon */}
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white text-[11px] font-bold">
                          {trx.accountNumber || trx.trxId || 'N/A'}
                        </span>
                        <span className="text-[10px] text-purple-400 font-medium">
                          ({trx.paymentMethod || 'Banking'})
                        </span>
                      </div>
                      <p className="text-[9px] text-purple-300">
                        {isCompleted
                          ? isApprove
                            ? 'অনুমোদিত ও ব্যালেন্স জমা হয়েছে'
                            : 'বাতিল ও রিফান্ড সম্পন্ন'
                          : isCurrent
                          ? 'সিঙ্ক ও স্টেট আপডেট হচ্ছে...'
                          : 'অপেক্ষমাণ...'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-amber-300 text-xs block">
                      ৳{trx.amount.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-purple-300">
                      {trx.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-purple-800/40">
          <button
            type="button"
            onClick={onMinimize}
            className="flex-1 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl border border-purple-800/60 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>পটভূমিতে চালান</span>
          </button>

          {progress.isFinished && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>সম্পন্ন (Close)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
