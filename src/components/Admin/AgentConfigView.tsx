import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Copy,
  Edit2,
  QrCode,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { AgentGenericNumber } from '../../types/adminProgramTypes';
import { INITIAL_GENERIC_NUMBERS } from '../../data/adminProgramsData';
import { getPaymentMethodLogo } from '../../utils/paymentLogos';

interface AgentConfigViewProps {
  subTab?: 'agent_generic_numbers' | 'agent_payment_methods';
  onSubTabChange?: (tab: 'agent_generic_numbers' | 'agent_payment_methods') => void;
}

export const AgentConfigView: React.FC<AgentConfigViewProps> = ({
  subTab: externalSubTab,
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'agent_generic_numbers' | 'agent_payment_methods'>('agent_generic_numbers');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: 'agent_generic_numbers' | 'agent_payment_methods') => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [genericNumbers, setGenericNumbers] = useState<AgentGenericNumber[]>(() => {
    const saved = localStorage.getItem('kingludu_admin_generic_numbers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_GENERIC_NUMBERS;
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'pm_1', name: 'bKash (বিকাশ)', code: 'bkash', active: true, min: 100, max: 25000, feePercent: 0 },
    { id: 'pm_2', name: 'Nagad (নগদ)', code: 'nagad', active: true, min: 100, max: 25000, feePercent: 0 },
    { id: 'pm_3', name: 'Rocket (রকেট)', code: 'rocket', active: true, min: 100, max: 15000, feePercent: 0 },
    { id: 'pm_4', name: 'Upay (উপায়)', code: 'upay', active: true, min: 100, max: 20000, feePercent: 0 },
    { id: 'pm_5', name: 'Binance Pay / USDT', code: 'crypto', active: false, min: 500, max: 100000, feePercent: 1.5 },
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingNumber, setEditingNumber] = useState<AgentGenericNumber | null>(null);

  const handleSaveAll = () => {
    localStorage.setItem('kingludu_admin_generic_numbers', JSON.stringify(genericNumbers));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleNumberActive = (id: string) => {
    setGenericNumbers((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const handleDeleteNumber = (id: string) => {
    if (confirm('আপনি কি এই পেমেন্ট নম্বরটি ডিলিট করতে চান?')) {
      setGenericNumbers((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleAddNewNumber = () => {
    const newNum: AgentGenericNumber = {
      id: `agn_${Date.now()}`,
      method: 'bKash',
      type: 'Agent',
      number: '01700000000',
      instructions: 'ক্যাশ ইন করে ট্রানজাকশন আইডি সাবমিট করুন।',
      minAmount: 100,
      maxAmount: 25000,
      active: true,
    };
    setGenericNumbers([...genericNumbers, newNum]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/40 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300">
            <Smartphone className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">Agent Config (এজেন্ট কনফিগারেশন)</h2>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                ক্যাশ গেটওয়ে
              </span>
            </div>
            <p className="text-xs text-purple-200">
              এজেন্ট জেনেরিক নম্বর, পার্সোনাল/মার্চেন্ট মেথড ও নির্দেশনা নিয়ন্ত্রণ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNewNumber}
            className="px-3 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white rounded-xl text-xs font-bold border border-purple-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নম্বর যোগ করুন</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>এজেন্ট কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('agent_generic_numbers')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'agent_generic_numbers'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Agent Generic Numbers</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('agent_payment_methods')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeSubTab === 'agent_payment_methods'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border border-purple-800/40'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Methods</span>
        </button>
      </div>

      {activeSubTab === 'agent_generic_numbers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {genericNumbers.map((num) => (
            <div
              key={num.id}
              className={`bg-[#052a12] p-4 rounded-2xl border transition space-y-3 ${
                num.active ? 'border-purple-800/60 shadow-lg' : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">{num.method}</span>
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold rounded">
                    {num.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingNumber(num)}
                    className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 hover:text-white cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNumber(num.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-[#031e0c] p-2.5 rounded-xl border border-purple-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-400">এজেন্ট ডিপোজিট নম্বর:</span>
                  <strong className="font-mono text-base text-amber-300">{num.number}</strong>
                </div>
                <p className="text-[11px] text-purple-200">{num.instructions}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1 border-t border-purple-900/50">
                <span>লিমিট: ৳{num.minAmount} - ৳{num.maxAmount}</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="font-bold text-slate-300">সক্রিয়</span>
                  <input
                    type="checkbox"
                    checked={num.active}
                    onChange={() => handleToggleNumberActive(num.id)}
                    className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#052a12] p-4 rounded-2xl border border-purple-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>পেমেন্ট মেথড গেটওয়ে কনফিগারেশন ({paymentMethods.length})</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-mono">bKash, Nagad, Rocket, Upay, Crypto</span>
          </div>

          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-purple-700/60 p-1 flex items-center justify-center shrink-0 shadow-inner">
                    <img
                      src={getPaymentMethodLogo(pm.name)}
                      alt={pm.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(pm.name);
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{pm.name}</h4>
                    <span className="text-[10px] text-purple-300 font-mono">
                      সীমা: ৳{pm.min} - ৳{pm.max} • ফি: {pm.feePercent}%
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] text-purple-300 font-bold">{pm.active ? 'চালু' : 'বন্ধ'}</span>
                  <input
                    type="checkbox"
                    checked={pm.active}
                    onChange={() => {
                      setPaymentMethods((prev) =>
                        prev.map((p) => (p.id === pm.id ? { ...p, active: !p.active } : p))
                      );
                    }}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNumber && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#052a12] border border-amber-400/40 rounded-2xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
              <h3 className="text-xs font-black text-white">এজেন্ট নম্বর সম্পাদনা</h3>
              <button
                type="button"
                onClick={() => setEditingNumber(null)}
                className="text-purple-300 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-purple-300 font-bold block mb-1">মেথড:</label>
                <select
                  value={editingNumber.method}
                  onChange={(e) => setEditingNumber({ ...editingNumber, method: e.target.value as any })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
                >
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Upay">Upay (উপায়)</option>
                </select>
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">টাইপ:</label>
                <select
                  value={editingNumber.type}
                  onChange={(e) => setEditingNumber({ ...editingNumber, type: e.target.value as any })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Agent">Agent (ক্যাশ-ইন এজেন্ট)</option>
                  <option value="Personal">Personal (সেন্ড মানি পার্সোনাল)</option>
                  <option value="Merchant">Merchant (মার্চেন্ট পেমেন্ট)</option>
                </select>
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">মোবাইল নম্বর:</label>
                <input
                  type="text"
                  value={editingNumber.number}
                  onChange={(e) => setEditingNumber({ ...editingNumber, number: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">নির্দেশনা টেক্সট:</label>
                <textarea
                  rows={2}
                  value={editingNumber.instructions}
                  onChange={(e) => setEditingNumber({ ...editingNumber, instructions: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNumber(null)}
                className="flex-1 py-2 bg-purple-900/60 text-purple-200 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setGenericNumbers((prev) =>
                    prev.map((n) => (n.id === editingNumber.id ? editingNumber : n))
                  );
                  setEditingNumber(null);
                }}
                className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-xl shadow"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
