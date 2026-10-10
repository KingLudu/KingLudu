import React, { useState } from 'react';
import {
  Mail,
  X,
  Trash2,
  CheckCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Bell,
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  ShieldAlert,
} from 'lucide-react';
import { UserInboxMessage, UserMessageType } from '../../types';
import { requestAppFullscreen } from '../../utils/fullscreen';

export type InboxCategory = 'all' | 'bonus' | 'transaction' | 'system_alert';

/**
 * Automatically categorizes inbox messages into:
 * 1. 'bonus' ('বোনাস')
 * 2. 'transaction' ('লেনদেন')
 * 3. 'system_alert' ('সিস্টেম সতর্কতা')
 */
export const categorizeInboxMessage = (msg: UserInboxMessage): 'bonus' | 'transaction' | 'system_alert' => {
  // 1. Direct type checks
  if (msg.type === 'bonus') return 'bonus';
  if (msg.type === 'deposit' || msg.type === 'withdraw') return 'transaction';
  if (msg.type === 'system') return 'system_alert';

  // 2. Metadata checks
  if (msg.metadata?.bonusType) return 'bonus';
  if (msg.metadata?.trxId || msg.metadata?.method) return 'transaction';

  // 3. Text content keyword analysis (Bengali + English)
  const text = `${msg.title || ''} ${msg.message || ''}`.toLowerCase();

  // Bonus indicators
  if (
    text.includes('বোনাস') ||
    text.includes('bonus') ||
    text.includes('রিওয়ার্ড') ||
    text.includes('reward') ||
    text.includes('স্পিন') ||
    text.includes('spin') ||
    text.includes('রেফার') ||
    text.includes('referral') ||
    text.includes('উপহার') ||
    text.includes('gift') ||
    text.includes('ক্যাশব্যাক') ||
    text.includes('cashback') ||
    text.includes('চেক-ইন') ||
    text.includes('দৈনিক') ||
    text.includes('daily')
  ) {
    return 'bonus';
  }

  // Transaction indicators
  if (
    text.includes('ডিপোজিট') ||
    text.includes('উইথড্র') ||
    text.includes('ক্যাশআউট') ||
    text.includes('লেনদেন') ||
    text.includes('পেমেন্ট') ||
    text.includes('টাকা জমা') ||
    text.includes('টাকা উত্তোলন') ||
    text.includes('ম্যাচ ফি') ||
    text.includes('ফি কর্তন') ||
    text.includes('deposit') ||
    text.includes('withdraw') ||
    text.includes('cashout') ||
    text.includes('transaction') ||
    text.includes('trx') ||
    text.includes('bkash') ||
    text.includes('nagad') ||
    text.includes('rocket') ||
    text.includes('বিকাশ') ||
    text.includes('নগদ') ||
    text.includes('রকেট')
  ) {
    return 'transaction';
  }

  // System alert indicators
  if (
    text.includes('সতর্কতা') ||
    text.includes('সিস্টেম') ||
    text.includes('নোটিশ') ||
    text.includes('আপডেট') ||
    text.includes('alert') ||
    text.includes('warning') ||
    text.includes('system') ||
    text.includes('notice') ||
    text.includes('রক্ষণাবেক্ষণ') ||
    text.includes('সিকিউরিটি') ||
    text.includes('security') ||
    text.includes('নিয়ম')
  ) {
    return 'system_alert';
  }

  // Fallback: If amount exists, classify as transaction; otherwise system alert
  if (msg.amount !== undefined && msg.amount > 0) {
    return 'transaction';
  }

  return 'system_alert';
};

interface UserInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: UserInboxMessage[];
  onDeleteMessage: (id: string) => void;
  onClearAllMessages: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const UserInboxModal: React.FC<UserInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
  onDeleteMessage,
  onClearAllMessages,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<InboxCategory>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Categorized message counts
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const bonusCount = messages.filter((m) => categorizeInboxMessage(m) === 'bonus').length;
  const transactionCount = messages.filter((m) => categorizeInboxMessage(m) === 'transaction').length;
  const systemAlertCount = messages.filter((m) => categorizeInboxMessage(m) === 'system_alert').length;

  const filteredMessages = messages.filter((msg) => {
    if (activeTab === 'all') return true;
    return categorizeInboxMessage(msg) === activeTab;
  });

  const handleDeleteSingle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setTimeout(() => {
      onDeleteMessage(id);
      setDeletingId(null);
    }, 150);
  };

  const handleConfirmClearAll = () => {
    onClearAllMessages();
    setShowConfirmClear(false);
  };

  const getMessageCategoryIcon = (category: 'bonus' | 'transaction' | 'system_alert', type?: UserMessageType) => {
    if (category === 'bonus') {
      return <Gift className="w-4 h-4 text-amber-400" />;
    }
    if (category === 'transaction') {
      if (type === 'withdraw') {
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      }
      return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
    }
    return <ShieldAlert className="w-4 h-4 text-purple-300" />;
  };

  const getCategoryBadgeLabel = (category: 'bonus' | 'transaction' | 'system_alert') => {
    switch (category) {
      case 'bonus':
        return 'বোনাস';
      case 'transaction':
        return 'লেনদেন';
      case 'system_alert':
        return 'সিস্টেম সতর্কতা';
    }
  };

  const getCategoryBadgeStyle = (category: 'bonus' | 'transaction' | 'system_alert') => {
    switch (category) {
      case 'bonus':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'transaction':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'system_alert':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  const getStatusLabel = (status?: string, type?: UserMessageType) => {
    if (status === 'Success') {
      if (type === 'deposit') return 'অনুমোদিত';
      if (type === 'withdraw') return 'পেমেন্ট সম্পন্ন';
      if (type === 'bonus') return 'কালেক্টেড';
      return 'সফল';
    }
    if (status === 'Pending') return 'পেন্ডিং';
    if (status === 'Failed') return 'বাতিল';
    if (status === 'Completed') return 'সম্পন্ন';
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 select-none text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#140a33] border border-purple-700/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1b0d46] via-[#241058] to-[#1b0d46] px-3.5 sm:px-4 py-3 border-b border-purple-700/50 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shadow-inner">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  মেসেজ বক্স (Inbox)
                </h3>
                {unreadCount > 0 ? (
                  <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow animate-pulse">
                    {unreadCount} নতুন
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    সব পড়া হয়েছে
                  </span>
                )}
              </div>
              <p className="text-[10px] text-purple-300/80">
                বোনাস, লেনদেন ও সিস্টেম সতর্কতার নোটিফিকেশন কেন্দ্র
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation & Filters: 'সব', 'বোনাস', 'লেনদেন', 'সিস্টেম সতর্কতা' */}
        <div className="bg-[#10072b] px-3 pt-2.5 pb-2 border-b border-purple-800/40 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 1. All Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
              }`}
            >
              <span>সব</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'all' ? 'bg-slate-900/20 text-slate-950 font-black' : 'bg-purple-900 text-purple-300'}`}>
                {messages.length}
              </span>
            </button>

            {/* 2. Bonus Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('bonus')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bonus'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                  : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
              }`}
            >
              <Gift className={`w-3.5 h-3.5 ${activeTab === 'bonus' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>বোনাস</span>
              {bonusCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'bonus' ? 'bg-black/20 text-slate-950 font-black' : 'bg-purple-900 text-purple-300'}`}>
                  {bonusCount}
                </span>
              )}
            </button>

            {/* 3. Transaction Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('transaction')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'transaction'
                  ? 'bg-emerald-500 text-white shadow-md font-black'
                  : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
              }`}
            >
              <ArrowLeftRight className={`w-3.5 h-3.5 ${activeTab === 'transaction' ? 'text-white' : 'text-emerald-400'}`} />
              <span>লেনদেন</span>
              {transactionCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'transaction' ? 'bg-black/20 text-white' : 'bg-purple-900 text-purple-300'}`}>
                  {transactionCount}
                </span>
              )}
            </button>

            {/* 4. System Alert Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('system_alert')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'system_alert'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black'
                  : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${activeTab === 'system_alert' ? 'text-white' : 'text-purple-300'}`} />
              <span>সিস্টেম সতর্কতা</span>
              {systemAlertCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'system_alert' ? 'bg-black/20 text-white' : 'bg-purple-900 text-purple-300'}`}>
                  {systemAlertCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Actions (Mark Read / Clear All) */}
          <div className="flex items-center gap-1 shrink-0 pl-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/40 transition flex items-center gap-1 cursor-pointer active:scale-95"
                title="সব মেসেজ পঠিত হিসেবে চিহ্নিত করুন"
              >
                <CheckCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">পড়া হয়েছে</span>
              </button>
            )}

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 transition flex items-center gap-1 cursor-pointer active:scale-95"
                title="সব মেসেজ ডিলিট করুন"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">সব মুছুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Banner for Clear All */}
        {showConfirmClear && (
          <div className="bg-rose-950/90 border-b border-rose-800/80 p-2.5 px-3.5 flex items-center justify-between gap-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-rose-200 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>আপনি কি নিশ্চিত সব মেসেজ ডিলিট করতে চান?</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-900 text-purple-200 hover:bg-purple-800 transition cursor-pointer"
              >
                না
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-600 text-white hover:bg-rose-500 shadow transition cursor-pointer active:scale-95"
              >
                হ্যাঁ, সব মুছুন
              </button>
            </div>
          </div>
        )}

        {/* Message Items Scrollable Container */}
        <div className="p-3 overflow-y-auto space-y-2.5 max-h-[65vh]">
          {filteredMessages.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400">
                <Mail className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">কোনো মেসেজ নেই</h4>
                <p className="text-xs text-purple-300 max-w-xs leading-relaxed">
                  {activeTab === 'all' && 'ডিপোজিট, উইথড্র, বোনাস রিওয়ার্ড বা সিস্টেম সতর্কতা পাওয়ার পর এখানে স্বয়ংক্রিয়ভাবে মেসেজ জমা হবে।'}
                  {activeTab === 'bonus' && 'বর্তমানে কোনো বোনাস মেসেজ নেই। লাকি স্পিন, দৈনিক চেক-ইন বা রেফারেল বোনাস গ্রহণ করলে এখানে দেখাবে।'}
                  {activeTab === 'transaction' && 'বর্তমানে কোনো লেনদেন মেসেজ নেই। ডিপোজিট, উইথড্র বা পেমেন্ট সম্পন্ন হলে এখানে দেখাবে।'}
                  {activeTab === 'system_alert' && 'বর্তমানে কোনো সিস্টেম সতর্কতা নেই। অ্যাপ ও অ্যাকাউন্টের গুরুত্বপূর্ণ নোটিশ এখানে পাওয়া যাবে।'}
                </p>
              </div>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isDeleting = deletingId === msg.id;
              const category = categorizeInboxMessage(msg);
              const statusLabel = getStatusLabel(msg.status, msg.type);

              return (
                <div
                  key={msg.id}
                  onClick={() => onMarkAsRead(msg.id)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer ${
                    isDeleting ? 'opacity-0 scale-95 duration-150' : 'opacity-100 scale-100'
                  } ${
                    msg.isRead
                      ? 'bg-[#10072b]/80 border-purple-800/40 text-slate-300 hover:border-purple-600/60'
                      : 'bg-[#1a0c44] border-amber-400/50 shadow-lg text-white ring-1 ring-amber-400/20 hover:border-amber-400'
                  }`}
                >
                  {/* Top Bar: Icon, Title, Category Badge, Status Badge, Amount & Delete Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Icon Circle */}
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border mt-0.5 ${
                          category === 'bonus'
                            ? 'bg-amber-950/80 border-amber-500/40'
                            : category === 'transaction'
                            ? msg.type === 'withdraw'
                              ? 'bg-rose-950/80 border-rose-500/40'
                              : 'bg-emerald-950/80 border-emerald-500/40'
                            : 'bg-purple-950/80 border-purple-500/40'
                        }`}
                      >
                        {getMessageCategoryIcon(category, msg.type)}
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-xs text-white tracking-tight">
                            {msg.title}
                          </h4>

                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                          )}

                          {/* Automatic Category Tag */}
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${getCategoryBadgeStyle(
                              category
                            )}`}
                          >
                            {getCategoryBadgeLabel(category)}
                          </span>

                          {statusLabel && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                                msg.status === 'Failed'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : msg.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              {statusLabel}
                            </span>
                          )}
                        </div>

                        {/* Formatted Time */}
                        <div className="flex items-center gap-1 text-[10px] text-purple-300/80 mt-0.5 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{msg.timeFormatted}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Amount Tag & Delete Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {msg.amount !== undefined && msg.amount > 0 && (
                        <span
                          className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg border shadow-sm ${
                            msg.type === 'withdraw'
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {msg.type === 'withdraw' ? '-' : '+'}৳{(Number(msg.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      )}

                      {/* Individual Message Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSingle(e, msg.id)}
                        className="p-1.5 rounded-xl bg-purple-950/80 hover:bg-rose-600 border border-purple-700/50 hover:border-rose-500 text-purple-300 hover:text-white transition active:scale-95 cursor-pointer shadow"
                        title="মেসেজটি ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message Body Content */}
                  <div className="mt-2 pl-10.5 pr-1">
                    <p className="text-xs text-purple-100/90 leading-relaxed font-sans">
                      {msg.message}
                    </p>

                    {/* TrxID / Method details if available */}
                    {msg.metadata && (msg.metadata.trxId || msg.metadata.method) && (
                      <div className="mt-1.5 pt-1.5 border-t border-purple-800/30 flex items-center gap-2 text-[10px] font-mono text-purple-300/80">
                        {msg.metadata.method && (
                          <span className="bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-700/40">
                            মেথড: <strong className="text-white">{msg.metadata.method}</strong>
                          </span>
                        )}
                        {msg.metadata.trxId && (
                          <span className="bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-700/40 truncate max-w-[200px]">
                            TrxID: <strong className="text-amber-300">{msg.metadata.trxId}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
