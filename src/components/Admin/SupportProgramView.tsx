import React, { useState, useEffect } from 'react';
import {
  Headphones,
  MessageSquare,
  Ticket,
  Send,
  CheckCircle2,
  Clock,
  User,
  Phone,
  HelpCircle,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Filter,
  BookmarkPlus,
  X,
} from 'lucide-react';
import { SupportTicket } from '../../types/adminProgramTypes';
import { INITIAL_SUPPORT_TICKETS } from '../../data/adminProgramsData';
import {
  CannedReplyItem,
  CannedCategory,
  CANNED_CATEGORIES,
  getStoredCannedReplies,
  saveCustomCannedReply,
  deleteCustomCannedReply,
} from '../../data/cannedRepliesData';

interface SupportProgramViewProps {
  subTab?: 'tickets' | 'canned_replies';
  onSubTabChange?: (tab: 'tickets' | 'canned_replies') => void;
}

export const SupportProgramView: React.FC<SupportProgramViewProps> = ({
  subTab: externalSubTab,
  onSubTabChange,
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [internalTab, setInternalTab] = useState<'tickets' | 'canned_replies'>('tickets');
  const activeTab = externalSubTab || internalTab;

  const setActiveTab = (tab: 'tickets' | 'canned_replies') => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };
  const [replyInput, setReplyInput] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(() => {
    return INITIAL_SUPPORT_TICKETS.length > 0 ? INITIAL_SUPPORT_TICKETS[0] : null;
  });

  // Comprehensive canned replies state
  const [cannedReplies, setCannedReplies] = useState<CannedReplyItem[]>(getStoredCannedReplies);
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const safeCannedReplies = Array.isArray(cannedReplies) ? cannedReplies : [];
  const [selectedCategory, setSelectedCategory] = useState<CannedCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Custom Reply Modal / Form State
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newReplyText, setNewReplyText] = useState('');
  const [newReplyCategory, setNewReplyCategory] = useState<'deposit' | 'withdraw' | 'gameplay' | 'account' | 'bonus' | 'general'>('deposit');
  const [newReplyTitle, setNewReplyTitle] = useState('');

  // Reload custom replies if storage updates
  useEffect(() => {
    const handleStorage = () => {
      setCannedReplies(getStoredCannedReplies());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }
  };

  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedTicket) return;
    const sentText = replyInput.trim();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: 'in_progress',
              lastReply: `এডমিন: ${sentText}`,
            }
          : t
      )
    );
    if (selectedTicket) {
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: 'in_progress',
              lastReply: `এডমিন: ${sentText}`,
            }
          : null
      );
    }
    setReplyInput('');
    alert('উত্তর সফলভাবে পাঠানো হয়েছে!');
  };

  // Filtered canned replies
  const filteredReplies = cannedReplies.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.shortTitle && item.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectReply = (text: string, id: string) => {
    setReplyInput(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAppendReply = (text: string) => {
    setReplyInput((prev) => (prev ? `${prev}\n${text}` : text));
  };

  const handleCreateCustomReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    const newReply: CannedReplyItem = {
      id: `custom_${Date.now()}`,
      category: newReplyCategory,
      text: newReplyText.trim(),
      shortTitle: newReplyTitle.trim() || undefined,
      badge: 'কাস্টম',
      isCustom: true,
    };

    const updated = saveCustomCannedReply(newReply);
    setCannedReplies(updated);
    setNewReplyText('');
    setNewReplyTitle('');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('আপনি কি এই কাস্টম উত্তরটি মুছে ফেলতে চান?')) {
      const updated = deleteCustomCannedReply(id);
      setCannedReplies(updated);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300 shrink-0">
            <Headphones className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">Support & Canned Replies (গ্রাহক সেবা)</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                ২৪/৭ হেল্পডেস্ক
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {safeCannedReplies.length} টি কুইক টেমপ্লেট
              </span>
            </div>
            <p className="text-xs text-purple-200">
              প্লেয়ারদের টিকিট সমাধান, দ্রুত উত্তর টেমপ্লেট নির্বাচন ও লাইভ চ্যাট মেসেজ সাপোর্ট
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddCustomModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-300" />
            <span>নতুন উত্তর যোগ করুন</span>
          </button>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp সাপোর্ট</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-purple-900/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900/50 border border-purple-800/40'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>সাপোর্ট টিকিট ও চ্যাট ডেস্ক ({safeTickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('canned_replies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'canned_replies'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900/50 border border-purple-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>সব কুইক রিপ্লাই লাইব্রেরি ({safeCannedReplies.length})</span>
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Ticket list */}
          <div className="lg:col-span-5 space-y-2.5">
            <h3 className="text-xs font-black text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>সাপোর্ট টিকিট তালিকা ({safeTickets.length})</span>
              </span>
              <span className="text-[10px] text-purple-300">একটি টিকিট সিলেক্ট করুন</span>
            </h3>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedTicket?.id === tkt.id
                      ? 'bg-purple-950/90 border-amber-400 shadow-lg ring-1 ring-amber-400/40'
                      : 'bg-[#052a12] border-purple-800/50 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{tkt.userName}</span>
                      <span className="font-mono text-[10px] text-purple-300">({tkt.userPhone})</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tkt.status === 'open'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : tkt.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {tkt.status === 'open' ? 'নতুন টিকিট' : tkt.status === 'in_progress' ? 'চলমান' : 'সমাধানকৃত'}
                    </span>
                  </div>

                  <p className="text-xs text-purple-200 font-medium">{tkt.subject}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-purple-900/40">
                    <span>{tkt.createdAt}</span>
                    <span className="text-amber-300 font-mono truncate max-w-[180px]">{tkt.lastReply}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket conversation and full canned replies desk */}
          <div className="lg:col-span-7 bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <span>টিকিট কথোপকথন ও কুইক রিপ্লাই</span>
                {selectedTicket && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    #{selectedTicket.id}
                  </span>
                )}
              </h3>
              {selectedTicket && (
                <button
                  type="button"
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg cursor-pointer transition shadow"
                >
                  সমাধান হিসেবে মার্ক করুন
                </button>
              )}
            </div>

            {selectedTicket ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                {/* User Ticket Info Box */}
                <div className="bg-[#031e0c] p-3 rounded-xl border border-purple-900/40 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-medium">ইউজার: <strong className="text-white">{selectedTicket.userName}</strong> ({selectedTicket.userPhone})</span>
                    <span className="text-[11px] text-amber-300 font-semibold uppercase bg-purple-950 px-2 py-0.5 rounded border border-purple-800/50">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <p className="text-white font-semibold pt-0.5">{selectedTicket.subject}</p>
                  <div className="p-2 bg-purple-950/60 rounded-lg text-purple-200 text-[11px] flex items-center justify-between">
                    <span>সর্বশেষ আপডেট: <span className="text-amber-300 font-mono">{selectedTicket.lastReply}</span></span>
                    <span className="text-[10px] text-slate-400">{selectedTicket.createdAt}</span>
                  </div>
                </div>

                {/* COMPREHENSIVE CANNED REPLIES SECTION (Matching User's Screenshot Exactly with Rich Additions) */}
                <div className="space-y-2 bg-[#031e0c]/80 p-3 rounded-xl border border-purple-800/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] text-amber-300 font-black uppercase">
                        দ্রুত উত্তর টেমপ্লেট (Canned Replies):
                      </span>
                      <span className="text-[10px] text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded-full border border-purple-800">
                        {filteredReplies.length} টি
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAddCustomModal(true)}
                        className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-purple-900/60 hover:bg-purple-900 border border-purple-700/60 px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>কাস্টম যোগ</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                    {CANNED_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer shrink-0 ${
                          selectedCategory === cat.id
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-[#052a12] text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Filter Bar */}
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="টেমপ্লেট খুঁজুন (যেমন: TrxID, বিকাশ, রিফান্ড, উইথড্র, স্ক্রিনশট)..."
                      className="w-full bg-[#052a12] border border-purple-800/60 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
                    />
                    <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-purple-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Canned replies list container (Styled exactly like the rounded boxes in user's screenshot) */}
                  <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                    {filteredReplies.length > 0 ? (
                      filteredReplies.map((item) => {
                        const isSelected = replyInput.trim() === item.text.trim();
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectReply(item.text, item.id)}
                            className={`group relative p-2.5 sm:p-3 rounded-xl border transition cursor-pointer text-left flex items-start justify-between gap-2 shadow-xs ${
                              isSelected
                                ? 'bg-purple-950 border-amber-400 ring-1 ring-amber-400/50 text-white'
                                : 'bg-[#100829] hover:bg-purple-950/70 border-purple-800/50 hover:border-purple-600 text-purple-100 hover:text-white'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.badge && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                      item.badge === 'জরুরি'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        : item.badge === 'সফল'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : item.badge === 'ত্রুটি' || item.badge === 'সতর্কতা'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                {item.shortTitle && (
                                  <span className="text-[10px] font-bold text-amber-300">
                                    {item.shortTitle}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs leading-relaxed font-medium select-none">
                                {item.text}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 pt-0.5">
                              {copiedId === item.id ? (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>সিলেক্টেড</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  title="ইনপুটে যোগ করুন"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppendReply(item.text);
                                  }}
                                  className="p-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-300 hover:text-white transition opacity-80 group-hover:opacity-100"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {item.isCustom && (
                                <button
                                  type="button"
                                  title="কাস্টম রিপ্লাই মুছুন"
                                  onClick={(e) => handleDeleteCustom(item.id, e)}
                                  className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-purple-300 space-y-1">
                        <p>কোনো টেমপ্লেট খুঁজে পাওয়া যায়নি।</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('all');
                            setSearchQuery('');
                          }}
                          className="text-amber-400 hover:underline text-[11px] font-bold cursor-pointer"
                        >
                          সব টেমপ্লেট রিসেট করুন
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Input Form (Matching Screenshot: Input + Yellow Send Button) */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-purple-300 px-1">
                    <span>ইউজার রিপ্লাই বার্তা:</span>
                    {replyInput && (
                      <button
                        type="button"
                        onClick={() => setReplyInput('')}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        ক্লিয়ার করুন
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="ইউজারকে রিপ্লাই লিখুন..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      className="flex-1 bg-[#031e0c] border border-purple-700/60 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/50 focus:outline-none transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={!replyInput.trim()}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4 fill-slate-950" />
                      <span>পাঠান</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-xs text-purple-300 py-16 space-y-2">
                <Ticket className="w-8 h-8 text-purple-500 animate-bounce" />
                <p className="font-bold">বাম পাশের তালিকা থেকে একটি টিকিট নির্বাচন করুন</p>
                <p className="text-[11px] text-purple-400">অথবা সব কুইক রিপ্লাই দেখতে উপরের ট্যাবে যান</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Canned Replies Library Manager View */
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-900/40">
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>সম্পূর্ণ কুইক রিপ্লাই টেমপ্লেট সংগ্রহ ({safeCannedReplies.length} টি)</span>
              </h3>
              <p className="text-xs text-purple-200">
                ডিপোজিট, উইথড্র, গেম রিফান্ড, একাউন্ট ও বোনাস সম্পর্কিত সকল দ্রুত উত্তর ব্যবস্থাপনা
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন উত্তর যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {CANNED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-[#031e0c] text-purple-200 hover:bg-purple-900/60 border border-purple-800/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="যেকোনো শব্দ দিয়ে খুঁজুন..."
                className="w-full bg-[#031e0c] border border-purple-800/60 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-purple-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredReplies.map((item) => (
              <div
                key={item.id}
                className="bg-[#031e0c] p-3.5 rounded-xl border border-purple-800/50 hover:border-amber-400/60 transition space-y-2 flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-300 font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                      {item.category.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustom(item.id, e)}
                          title="মুছুন"
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.shortTitle && (
                    <h5 className="text-xs font-bold text-white">{item.shortTitle}</h5>
                  )}
                  <p className="text-xs text-purple-100 leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                      setCopiedId(item.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="text-[11px] font-bold text-purple-300 hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-400" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReplyInput(item.text);
                      setActiveTab('tickets');
                    }}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>টিকিটে ব্যবহার করুন</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Custom Canned Reply */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#052a12] border border-amber-400/50 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black text-white">নতুন কুইক রিপ্লাই যোগ করুন</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(false)}
                className="text-purple-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomReply} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-purple-200 font-bold mb-1">ক্যাটাগরি নির্বাচন করুন:</label>
                <select
                  value={newReplyCategory}
                  onChange={(e) => setNewReplyCategory(e.target.value as any)}
                  className="w-full bg-[#031e0c] border border-purple-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="deposit">ডিপোজিট ও পেমেন্ট (Deposit)</option>
                  <option value="withdraw">উইথড্র ও ক্যাশআউট (Withdrawal)</option>
                  <option value="gameplay">গেমপ্লে, রুম ও রিফান্ড (Gameplay & Refund)</option>
                  <option value="account">অ্যাকাউন্ট ও ভেরিফিকেশন (Account & KYC)</option>
                  <option value="bonus">বোনাস ও রেফারেল (Bonus & Offers)</option>
                  <option value="general">সাধারণ সহায়তা ও শুভেচ্ছা (General)</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">শিরোনাম (ঐচ্ছিক):</label>
                <input
                  type="text"
                  placeholder="যেমন: TrxID যাচাই হচ্ছে"
                  value={newReplyTitle}
                  onChange={(e) => setNewReplyTitle(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700 rounded-xl px-3 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">সম্পূর্ণ উত্তর / মেসেজের টেক্সট:</label>
                <textarea
                  rows={3}
                  placeholder="ইউজারকে যে মেসেজটি পাঠাতে চান তা লিখুন..."
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                  required
                  className="w-full bg-[#031e0c] border border-purple-700 rounded-xl px-3 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-200 font-bold rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl shadow transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

