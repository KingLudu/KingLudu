import React from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, AlertCircle, ArrowLeft, Camera, ArrowRight } from 'lucide-react';
import { AppSettings, Transaction, ScreenType, RegionCode, REGIONS, UserProfile } from '../../types';
import { getTranslation } from '../../utils/translations';
import { getPaymentMethodLogo } from '../../utils/paymentLogos';
import { isBangladeshUser } from '../../utils/paymentGeo';

interface WalletScreenProps {
  balance: number;
  transactions: Transaction[];
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
  appSettings?: AppSettings;
  currentUser?: UserProfile;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  balance,
  transactions = [],
  onNavigate,
  selectedRegion = 'BN',
  appSettings,
  currentUser,
}) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const t = getTranslation(selectedRegion);
  const regionInfo = REGIONS[selectedRegion] || REGIONS.BN;
  const isBd = isBangladeshUser(selectedRegion, currentUser);

  const allPaymentMethodsList = [
    {
      key: 'bKash',
      name: 'bKash',
      tagline: 'তাৎক্ষণিক',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-500/40 hover:border-pink-500/80',
      hoverBg: 'hover:bg-pink-950/30',
    },
    {
      key: 'Nagad',
      name: 'Nagad',
      tagline: '০% চার্জ',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/40 hover:border-orange-500/80',
      hoverBg: 'hover:bg-orange-950/30',
    },
    {
      key: 'Rocket',
      name: 'Rocket',
      tagline: 'DBBL',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/40 hover:border-purple-500/80',
      hoverBg: 'hover:bg-purple-950/30',
    },
    {
      key: 'Upay',
      name: 'Upay',
      tagline: 'UCB Pay',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/40 hover:border-blue-500/80',
      hoverBg: 'hover:bg-blue-950/30',
    },
    {
      key: 'BinancePay',
      name: 'Binance',
      tagline: 'Pay ID',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-400/50 hover:border-amber-400/80',
      hoverBg: 'hover:bg-amber-950/30',
    },
    {
      key: 'Cryptocurrency',
      name: 'Crypto',
      tagline: 'USDT',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/50 hover:border-emerald-400/80',
      hoverBg: 'hover:bg-emerald-950/30',
    },
  ];

  // If outside Bangladesh, only show BinancePay and Cryptocurrency
  const paymentMethodsList = isBd
    ? allPaymentMethodsList
    : allPaymentMethodsList.filter((m) => m.key === 'BinancePay' || m.key === 'Cryptocurrency');

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-20 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-white">{t.wallet}</h2>
        <div className="w-9" />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#2a1660] via-[#1f1049] to-[#04260f] p-5 rounded-2xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-purple-300 font-medium">{t.balance}</p>
            <h1 className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight mt-1">
              {regionInfo.currencySymbol} {(Number(balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          </div>
          <div className="text-4xl p-3 bg-amber-400/10 rounded-2xl border border-amber-400/30">
            🎁
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            id="wallet-add-money-btn"
            onClick={() => onNavigate('add_money')}
            className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.deposit}</span>
          </button>
          <button
            id="wallet-withdraw-btn"
            onClick={() => onNavigate('withdraw')}
            className="py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-900/40 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{t.withdraw}</span>
          </button>
        </div>
      </div>

      {/* Fast QR Scan Deposit Action Banner */}
      <div 
        onClick={() => onNavigate('add_money')}
        className="bg-gradient-to-r from-[#170e3a] via-[#241357] to-[#170e3a] border border-amber-400/50 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg cursor-pointer group transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow group-hover:scale-105 transition-transform shrink-0">
            <Camera className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">পেমেন্ট রসিদ কিউআর স্ক্যান করুন</span>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                Instant TrxID
              </span>
            </div>
            <p className="text-[10px] text-purple-200 mt-0.5">
              {isBd
                ? 'বিকাশ, নগদ বা ক্রিপ্টো রসিদের কিউআর ক্যামেরা দিয়ে স্ক্যান করে এক ক্লিকে ডিপোজিট'
                : 'Scan Binance Pay or Crypto USDT receipt with camera to deposit instantly'}
            </p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-purple-900/60 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-300 transition-colors shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Supported Payment Gateways Bar */}
      <div className="bg-[#140c2e] p-3.5 rounded-2xl border border-purple-800/50 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between text-[11px] text-purple-200 font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>সমর্থিত পেমেন্ট মাধ্যম (Payment Methods):</span>
          </span>
          <button
            onClick={() => onNavigate('add_money')}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-bold bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30 transition cursor-pointer"
          >
            <span>ডিপোজিট করুন</span>
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {paymentMethodsList.map((pm) => {
            const logoSrc = getPaymentMethodLogo(pm.key, appSettings?.paymentLogos);
            return (
              <div
                key={pm.key}
                id={`wallet-pm-${pm.key.toLowerCase()}`}
                onClick={() => onNavigate('add_money')}
                className={`cursor-pointer bg-[#1c1140] ${pm.hoverBg} hover:bg-[#251754] border ${pm.borderColor} p-1.5 sm:p-2 rounded-2xl flex items-center justify-center transition-all duration-200 group shadow-md hover:scale-[1.04] active:scale-[0.96] h-20 sm:h-24`}
                title={`${pm.name} - ডিপোজিট করুন`}
              >
                {/* Full Frame Logo Showcase without text */}
                <div className="w-full h-full rounded-xl bg-slate-950/40 p-1 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner group-hover:border-white/30 transition">
                  <img
                    src={logoSrc}
                    alt={pm.name}
                    className={`w-full h-full ${
                      appSettings?.paymentLogoFitMode === 'cover' ? 'object-cover' : 'object-contain'
                    } rounded-lg transition-transform duration-200 group-hover:scale-105 drop-shadow`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(pm.key);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Header */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="font-bold text-sm text-white">Transaction History</h3>
        <span className="text-xs text-purple-400 font-medium">See All</span>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {safeTransactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-purple-300/70 bg-[#04260f] rounded-2xl border border-purple-900/40">
            কোনো ট্রানজেকশন হিস্ট্রি পাওয়া যায়নি
          </div>
        ) : (
          safeTransactions.map((trx, idx) => {
          const isPositive = trx.type === 'deposit' || trx.type === 'match_won' || trx.type === 'referral_bonus' || trx.type === 'daily_reward';
          return (
            <div
              key={`wallet-trx-${trx.id || idx}-${idx}`}
              className="bg-[#04260f] p-3.5 rounded-2xl border border-purple-900/40 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isPositive
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-red-950/60 border-red-500/40 text-red-400'
                  }`}
                >
                  {isPositive ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-white">{trx.title}</h4>
                    {trx.paymentMethod === 'BinancePay' && (
                      <span className="text-[9px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.2 rounded border border-yellow-500/40 font-mono font-bold">
                        ⬡ Binance
                      </span>
                    )}
                    {trx.paymentMethod === 'Cryptocurrency' && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-mono font-bold">
                        ₮ USDT
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-purple-300 font-mono mt-0.5">
                    {trx.date}, {trx.time} {trx.paymentMethod && !['BinancePay', 'Cryptocurrency'].includes(trx.paymentMethod) && `• ${trx.paymentMethod}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold text-sm ${
                    isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? '+' : '-'}৳{trx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {trx.status === 'Success' && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Success
                    </span>
                  )}
                  {trx.status === 'Pending' && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Pending
                    </span>
                  )}
                  {trx.status === 'Failed' && (
                    <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
