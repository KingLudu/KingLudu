import React, { useState } from 'react';
import {
  Crown,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Percent,
  Coins,
  ShieldCheck,
  Save,
  RotateCcw,
  Edit2
} from 'lucide-react';
import { VIPTier } from '../../types/adminProgramTypes';
import { INITIAL_VIP_TIERS } from '../../data/adminProgramsData';

interface VIPCashbackViewProps {
  onNotify?: (msg: string) => void;
}

export const VIPCashbackView: React.FC<VIPCashbackViewProps> = () => {
  const [tiers, setTiers] = useState<VIPTier[]>(() => {
    const saved = localStorage.getItem('kingludu_admin_vip_tiers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VIP_TIERS;
  });

  const safeTiers = Array.isArray(tiers) ? tiers : INITIAL_VIP_TIERS;

  const [editingTier, setEditingTier] = useState<VIPTier | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cashbackCycle, setCashbackCycle] = useState<'weekly' | 'daily' | 'monthly'>('weekly');
  const [autoCashbackEnabled, setAutoCashbackEnabled] = useState(true);

  const handleSaveTiers = () => {
    localStorage.setItem('kingludu_admin_vip_tiers', JSON.stringify(tiers));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleTierActive = (tierId: string) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, active: !t.active } : t))
    );
  };

  const handleDeleteTier = (tierId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ভিআইপি টিয়ারটি মুছে ফেলতে চান?')) {
      setTiers((prev) => prev.filter((t) => t.id !== tierId));
    }
  };

  const handleSaveEditModal = () => {
    if (!editingTier) return;
    setTiers((prev) =>
      prev.map((t) => (t.id === editingTier.id ? editingTier : t))
    );
    setEditingTier(null);
  };

  const handleAddNewTier = () => {
    const newTier: VIPTier = {
      id: `tier_${Date.now()}`,
      level: safeTiers.length + 1,
      name: `নতুন লেভেল ${safeTiers.length + 1}`,
      minDeposit: (safeTiers[safeTiers.length - 1]?.minDeposit || 1000) * 2,
      cashbackPercent: Math.min(20, (safeTiers[safeTiers.length - 1]?.cashbackPercent || 5) + 2),
      weeklyBonus: 1000,
      monthlyBonus: 4000,
      color: 'from-blue-500 to-indigo-700',
      badge: '🎖️',
      perks: ['দৈনিক স্পিন বোনাস', 'ক্যাশব্যাক রিবেট', 'অগ্রাধিকার সাপোর্ট'],
      active: true,
    };
    setTiers([...safeTiers, newTier]);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Crown className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">VIP & Cashback Tiers</h2>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                ক্যাশব্যাক সিস্টেম
              </span>
            </div>
            <p className="text-xs text-purple-200">
              প্লেয়ারদের ডিপোজিট পরিমাণ অনুযায়ী ভিআইপি লেভেল ও ক্যাশব্যাক পার্সেন্টেজ কনফিগার করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNewTier}
            className="px-3 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white rounded-xl text-xs font-bold border border-purple-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন টিয়ার যোগ করুন</span>
          </button>
          <button
            type="button"
            onClick={handleSaveTiers}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>ভিআইপি ও ক্যাশব্যাক কনফিগারেশন সফলভাবে সেভ করা হয়েছে!</span>
        </div>
      )}

      {/* Global Cashback Engine Rules */}
      <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
        <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <Percent className="w-4 h-4 text-amber-400" />
          <span>ক্যাশব্যাক ইঞ্জিন ও অটোমেশন রুলস</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1.5">
            <span className="text-[11px] text-purple-300 font-bold block">ক্যাশব্যাক বিতরণের সময়</span>
            <select
              value={cashbackCycle}
              onChange={(e) => setCashbackCycle(e.target.value as any)}
              className="w-full bg-[#031e0c] border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="daily">প্রতিদিন রাত ১২:০০ টায় (Daily)</option>
              <option value="weekly">সাপ্তাহিক সোমবার (Weekly Monday)</option>
              <option value="monthly">মাসের ১ম তারিখে (Monthly)</option>
            </select>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1.5">
            <span className="text-[11px] text-purple-300 font-bold block">অটো-ক্যাশব্যাক ক্রেডিট</span>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">সরাসরি ওয়ালেটে জমা হবে</span>
              <input
                type="checkbox"
                checked={autoCashbackEnabled}
                onChange={(e) => setAutoCashbackEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1.5">
            <span className="text-[11px] text-purple-300 font-bold block">মোট সক্রিয় ভিআইপি লেভেল</span>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono font-bold text-amber-400">
                {safeTiers.filter((t) => t.active).length} টি টিয়ার সক্রিয়
              </span>
              <button
                type="button"
                onClick={() => setTiers(INITIAL_VIP_TIERS)}
                className="text-[10px] text-purple-400 hover:text-white underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>রিসেট ডিফল্ট</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Tiers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {safeTiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-[#052a12] rounded-2xl border transition-all p-4 space-y-3 relative overflow-hidden ${
              tier.active
                ? 'border-purple-700/60 shadow-lg hover:border-amber-400/50'
                : 'border-slate-800 opacity-60 bg-slate-950/40'
            }`}
          >
            {/* Top Badge & Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{tier.badge}</span>
                <div>
                  <h4 className="text-sm font-black text-white">{tier.name}</h4>
                  <span className="text-[10px] font-mono text-amber-300">লেভেল #{tier.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingTier(tier)}
                  className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 hover:text-white cursor-pointer"
                  title="এডিট করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTier(tier.id)}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100 cursor-pointer"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 bg-[#031e0c] p-2.5 rounded-xl border border-purple-900/40 text-xs">
              <div>
                <span className="text-[10px] text-purple-300 block">নূন্যতম ডিপোজিট</span>
                <span className="font-mono font-black text-emerald-400">৳{tier.minDeposit.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block">ক্যাশব্যাক পার্সেন্টেজ</span>
                <span className="font-mono font-black text-amber-400">{tier.cashbackPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block">সাপ্তাহিক বোনাস</span>
                <span className="font-mono font-bold text-cyan-300">৳{tier.weeklyBonus}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block">মাসিক বোনাস</span>
                <span className="font-mono font-bold text-purple-300">৳{tier.monthlyBonus}</span>
              </div>
            </div>

            {/* Perks list */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">সুবিধাসমূহ:</span>
              <ul className="text-[11px] text-purple-200 space-y-0.5">
                {tier.perks.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Switch */}
            <div className="pt-2 border-t border-purple-900/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {tier.active ? 'সক্রিয় টিয়ার' : 'নিষ্ক্রিয় করা আছে'}
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="text-[10px] font-bold text-amber-300">সক্রিয় রাখুন</span>
                <input
                  type="checkbox"
                  checked={tier.active}
                  onChange={() => handleToggleTierActive(tier.id)}
                  className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#052a12] border border-amber-400/40 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>ভিআইপি টিয়ার এডিট করুন: {editingTier.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="text-purple-300 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-purple-300 font-bold block mb-1">টিয়ার নাম:</label>
                <input
                  type="text"
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-purple-300 font-bold block mb-1">নূন্যতম ডিপোজিট (৳):</label>
                  <input
                    type="number"
                    value={editingTier.minDeposit}
                    onChange={(e) => setEditingTier({ ...editingTier, minDeposit: Number(e.target.value) || 0 })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-purple-300 font-bold block mb-1">ক্যাশব্যাক (%):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingTier.cashbackPercent}
                    onChange={(e) => setEditingTier({ ...editingTier, cashbackPercent: Number(e.target.value) || 0 })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-purple-300 font-bold block mb-1">সাপ্তাহিক বোনাস (৳):</label>
                  <input
                    type="number"
                    value={editingTier.weeklyBonus}
                    onChange={(e) => setEditingTier({ ...editingTier, weeklyBonus: Number(e.target.value) || 0 })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-purple-300 font-bold block mb-1">মাসিক বোনাস (৳):</label>
                  <input
                    type="number"
                    value={editingTier.monthlyBonus}
                    onChange={(e) => setEditingTier({ ...editingTier, monthlyBonus: Number(e.target.value) || 0 })}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="flex-1 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveEditModal}
                className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-xl shadow"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
