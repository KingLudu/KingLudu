import React, { useState } from 'react';
import {
  Share2,
  Settings,
  Users,
  History,
  DollarSign,
  Save,
  CheckCircle2,
  Copy,
  Percent,
  TrendingUp,
  Award,
} from 'lucide-react';
import { AffiliatePartner, AffiliateCommissionRecord } from '../../types/adminProgramTypes';
import { INITIAL_AFFILIATES, INITIAL_COMMISSIONS } from '../../data/adminProgramsData';

interface AffiliateSystemViewProps {
  subTab?: 'affiliate_settings' | 'affiliate_list' | 'affiliate_commissions';
  onSubTabChange?: (tab: 'affiliate_settings' | 'affiliate_list' | 'affiliate_commissions') => void;
}

export const AffiliateSystemView: React.FC<AffiliateSystemViewProps> = ({
  subTab: externalSubTab,
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'affiliate_settings' | 'affiliate_list' | 'affiliate_commissions'>('affiliate_list');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: 'affiliate_settings' | 'affiliate_list' | 'affiliate_commissions') => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [affiliates, setAffiliates] = useState<AffiliatePartner[]>(INITIAL_AFFILIATES);
  const [commissions, setCommissions] = useState<AffiliateCommissionRecord[]>(INITIAL_COMMISSIONS);

  const safeAffiliates = Array.isArray(affiliates) ? affiliates : [];
  const safeCommissions = Array.isArray(commissions) ? commissions : [];

  // Settings state
  const [referralBonus, setReferralBonus] = useState(20);
  const [depositCommissionPercent, setDepositCommissionPercent] = useState(5);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(500);
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePayAffiliate = (aff: AffiliatePartner) => {
    if (aff.pendingPayout <= 0) {
      alert('পরিশোধযোগ্য কোনো বকেয়া নেই!');
      return;
    }
    const payAmount = aff.pendingPayout;
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === aff.id
          ? {
              ...a,
              paidPayout: a.paidPayout + payAmount,
              pendingPayout: 0,
            }
          : a
      )
    );
    alert(`অ্যাফিলিয়েট ${aff.name} কে ৳${payAmount} সফলভাবে পরিশোধ করা হয়েছে!`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Share2 className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Affiliate System (রেফারাল ও অ্যাফিলিয়েট)</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                কমিশন নেটওয়ার্ক
              </span>
            </div>
            <p className="text-xs text-purple-200">
              রেফারেল কোড, কমিশন রেট, লিডারবোর্ড ও উত্তোলন হিস্ট্রি
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#031e0c]/80 px-3 py-2 rounded-xl border border-purple-800/60 text-xs">
          <span className="text-purple-300">অ্যাফিলিয়েট পার্টনার:</span>
          <span className="font-mono font-black text-emerald-400">{safeAffiliates.length} জন</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>অ্যাফিলিয়েট সেটিংস সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('affiliate_settings')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'affiliate_settings'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings (সেটিংস)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('affiliate_list')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'affiliate_list'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Affiliates List (পার্টনার্স)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('affiliate_commissions')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'affiliate_commissions'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Commission History (ইতিহাস)</span>
        </button>
      </div>

      {activeSubTab === 'affiliate_settings' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>রেফারেল ও অ্যাফিলিয়েট পলিসি কনফিগারেশন</span>
            </h3>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেটিংস সেভ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1">
              <label className="text-purple-300 font-bold block">রেজিস্ট্রেশন রেফারেল বোনাস (৳):</label>
              <input
                type="number"
                value={referralBonus}
                onChange={(e) => setReferralBonus(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1">
              <label className="text-purple-300 font-bold block">ডিপোজিট কমিশন শতকরা (%):</label>
              <input
                type="number"
                value={depositCommissionPercent}
                onChange={(e) => setDepositCommissionPercent(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-1">
              <label className="text-purple-300 font-bold block">নূন্যতম পে-আউট থ্রেশহোল্ড (৳):</label>
              <input
                type="number"
                value={minPayoutThreshold}
                onChange={(e) => setMinPayoutThreshold(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'affiliate_list' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>অ্যাফিলিয়েট পার্টনার্স ও আয় তালিকা</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-mono">মোট {safeAffiliates.length} জন</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">নাম ও ফোন</th>
                  <th className="py-2 px-3">রেফারেল কোড</th>
                  <th className="py-2 px-3">মোট রেফার</th>
                  <th className="py-2 px-3">মোট আয়</th>
                  <th className="py-2 px-3">বকেয়া পেআউট</th>
                  <th className="py-2 px-3">পরিশোধিত</th>
                  <th className="py-2 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {safeAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-white block">{aff.name}</span>
                      <span className="font-mono text-[10px] text-purple-300">{aff.phone}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-400">{aff.code}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-200">
                      {aff.totalReferrals} জন ({aff.activeDepositors} ডিপোজিটর)
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-emerald-400">৳{aff.totalEarned.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-300">৳{aff.pendingPayout.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">৳{aff.paidPayout.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handlePayAffiliate(aff)}
                        disabled={aff.pendingPayout <= 0}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                      >
                        পেআউট দিন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'affiliate_commissions' && (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>লাইভ কমিশন আর্নিং হিস্ট্রি (Commission Records)</span>
            </h3>
            <span className="text-[11px] text-purple-300">প্লেয়ারদের ডিপোজিট ও অ্যাক্টিভিটি থেকে অর্জিত কমিশন</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-400 text-[10px] uppercase font-bold">
                  <th className="py-2 px-3">অ্যাফিলিয়েট</th>
                  <th className="py-2 px-3">রেফার্ড প্লেয়ার</th>
                  <th className="py-2 px-3">ইভেন্ট</th>
                  <th className="py-2 px-3">কমিশন পরিমাণ</th>
                  <th className="py-2 px-3">তারিখ ও সময়</th>
                  <th className="py-2 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40">
                {safeCommissions.map((c) => (
                  <tr key={c.id} className="hover:bg-purple-900/20">
                    <td className="py-2.5 px-3 font-bold text-white">{c.affiliateName}</td>
                    <td className="py-2.5 px-3 text-purple-300">{c.referredPlayerName}</td>
                    <td className="py-2.5 px-3 text-amber-300 capitalize">{c.event.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-emerald-400">+৳{c.amount}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{c.date} • {c.time}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-bold rounded-full">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
