import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  Info,
  AlertTriangle,
  Lock,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { PaymentMethod, ScreenType, AppSettings, RegionCode, REGIONS, UserProfile } from '../../types';
import { getPaymentMethodLogo } from '../../utils/paymentLogos';
import { getPaymentMethodsForRegion, isBangladeshUser } from '../../utils/paymentGeo';

interface WithdrawScreenProps {
  balance: number;
  currentUser?: UserProfile;
  appSettings?: AppSettings;
  onWithdrawSubmit: (
    amount: number, 
    method: PaymentMethod, 
    accountPhone: string,
    cryptoDetails?: { cryptoAmount?: number; cryptoNetwork?: string },
    securityInfo?: { withdrawPasswordVerified?: boolean; linkedAccountVerified?: boolean }
  ) => void;
  onUpdateUserWithdrawSecurity?: (
    withdrawalAccounts: {
      bkash?: string;
      nagad?: string;
      rocket?: string;
      upay?: string;
    },
    withdrawPassword: string
  ) => void;
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({
  balance,
  currentUser,
  appSettings,
  onWithdrawSubmit,
  onUpdateUserWithdrawSecurity,
  onNavigate,
  selectedRegion = 'BN',
}) => {
  const isBd = isBangladeshUser(selectedRegion, currentUser);
  const allAvailableMethods: PaymentMethod[] = getPaymentMethodsForRegion(
    selectedRegion,
    currentUser,
    appSettings,
    'withdraw'
  );

  const localMethods = allAvailableMethods.filter(
    (m) => m === 'bKash' || m === 'Nagad' || m === 'Rocket' || m === 'Upay'
  );
  const showBinance = allAvailableMethods.includes('BinancePay');
  const showCrypto = allAvailableMethods.includes('Cryptocurrency');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    allAvailableMethods[0] || (isBd ? 'bKash' : 'BinancePay')
  );

  useEffect(() => {
    if (allAvailableMethods.length > 0 && !allAvailableMethods.includes(selectedMethod)) {
      setSelectedMethod(allAvailableMethods[0]);
    }
  }, [allAvailableMethods, selectedMethod]);

  const [cryptoNetwork, setCryptoNetwork] = useState<'TRC20' | 'BEP20'>('TRC20');
  const [amount, setAmount] = useState<number | ''>('');
  const [accountDestination, setAccountDestination] = useState('');
  const [withdrawPasswordInput, setWithdrawPasswordInput] = useState('');
  const [showWithdrawPasswordInput, setShowWithdrawPasswordInput] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check if user has completed first-time withdrawal security setup
  const hasSecuritySetup = Boolean(
    currentUser?.hasSetWithdrawPassword && 
    currentUser?.withdrawPassword && 
    currentUser.withdrawPassword.trim().length > 0
  );

  // First time setup modal / view states
  const [isEditAccountsModalOpen, setIsEditAccountsModalOpen] = useState(false);
  const [setupBkash, setSetupBkash] = useState(currentUser?.withdrawalAccounts?.bkash || currentUser?.phone || '');
  const [setupNagad, setSetupNagad] = useState(currentUser?.withdrawalAccounts?.nagad || '');
  const [setupRocket, setSetupRocket] = useState(currentUser?.withdrawalAccounts?.rocket || '');
  const [setupUpay, setSetupUpay] = useState(currentUser?.withdrawalAccounts?.upay || '');
  const [setupOldPassword, setSetupOldPassword] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupOldPass, setShowSetupOldPass] = useState(false);
  const [showSetupPass, setShowSetupPass] = useState(false);
  const [showSetupConfirmPass, setShowSetupConfirmPass] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [setupSuccessToast, setSetupSuccessToast] = useState('');

  // Keep setup fields in sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.withdrawalAccounts?.bkash) setSetupBkash(currentUser.withdrawalAccounts.bkash);
      if (currentUser.withdrawalAccounts?.nagad) setSetupNagad(currentUser.withdrawalAccounts.nagad);
      if (currentUser.withdrawalAccounts?.rocket) setSetupRocket(currentUser.withdrawalAccounts.rocket);
      if (currentUser.withdrawalAccounts?.upay) setSetupUpay(currentUser.withdrawalAccounts.upay);
    }
  }, [currentUser]);

  // Automatically pre-fill account destination based on selected method
  useEffect(() => {
    if (currentUser?.withdrawalAccounts) {
      if (selectedMethod === 'bKash' && currentUser.withdrawalAccounts.bkash) {
        setAccountDestination(currentUser.withdrawalAccounts.bkash);
      } else if (selectedMethod === 'Nagad' && currentUser.withdrawalAccounts.nagad) {
        setAccountDestination(currentUser.withdrawalAccounts.nagad);
      } else if (selectedMethod === 'Rocket' && currentUser.withdrawalAccounts.rocket) {
        setAccountDestination(currentUser.withdrawalAccounts.rocket);
      } else if (selectedMethod === 'Upay' && currentUser.withdrawalAccounts.upay) {
        setAccountDestination(currentUser.withdrawalAccounts.upay);
      } else if (selectedMethod === 'BinancePay' && currentUser.withdrawalAccounts.binancePayId) {
        setAccountDestination(currentUser.withdrawalAccounts.binancePayId);
      } else if (selectedMethod === 'Cryptocurrency' && currentUser.withdrawalAccounts.cryptoAddress) {
        setAccountDestination(currentUser.withdrawalAccounts.cryptoAddress);
      }
    }
  }, [selectedMethod, currentUser?.withdrawalAccounts]);

  const minWithdrawal = appSettings?.minWithdrawal || 50;
  const exchangeRate = appSettings?.usdtExchangeRate || 125;
  const numAmount = typeof amount === 'number' ? amount : 0;
  const cryptoEquivalent = numAmount > 0 ? (numAmount / exchangeRate).toFixed(2) : '0.00';

  const isBinance = selectedMethod === 'BinancePay' || selectedMethod === 'Binance';
  const isCrypto = selectedMethod === 'Cryptocurrency';
  const isCryptoType = isBinance || isCrypto;

  // Handle First Time or Edit Security Setup Save
  const handleSaveSecuritySetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    // Must have at least one mobile banking number
    if (!setupBkash.trim() && !setupNagad.trim() && !setupRocket.trim() && !setupUpay.trim()) {
      setSetupError('অনুগ্রহ করে অন্তত একটি উইথড্র অ্যাকাউন্ট নম্বর (bKash, Nagad, Rocket অথবা Upay) দিন!');
      return;
    }

    // Verify Old/Current withdraw password if already configured
    if (currentUser?.withdrawPassword) {
      if (!setupOldPassword.trim()) {
        setSetupError('অনুগ্রহ করে বর্তমান/আগের উইথড্র পাসওয়ার্ডটি দিন!');
        return;
      }
      if (setupOldPassword.trim() !== currentUser.withdrawPassword.trim()) {
        setSetupError('❌ বর্তমান/আগের উইথড্র পাসওয়ার্ডটি ভুল হয়েছে! সঠিক পাসওয়ার্ড দিন।');
        return;
      }
    }

    if (!setupPassword || setupPassword.trim().length < 4) {
      setSetupError('নতুন উইথড্র পাসওয়ার্ড অবশ্যই অন্তত ৪ ডিজিট বা অক্ষরের হতে হবে!');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    const accounts = {
      bkash: setupBkash.trim(),
      nagad: setupNagad.trim(),
      rocket: setupRocket.trim(),
      upay: setupUpay.trim(),
    };

    if (onUpdateUserWithdrawSecurity) {
      onUpdateUserWithdrawSecurity(accounts, setupPassword.trim());
    }

    // Auto set destination if matching currently selected method
    if (selectedMethod === 'bKash' && accounts.bkash) setAccountDestination(accounts.bkash);
    if (selectedMethod === 'Nagad' && accounts.nagad) setAccountDestination(accounts.nagad);
    if (selectedMethod === 'Rocket' && accounts.rocket) setAccountDestination(accounts.rocket);
    if (selectedMethod === 'Upay' && accounts.upay) setAccountDestination(accounts.upay);

    setSetupOldPassword('');
    setSetupPassword('');
    setSetupConfirmPassword('');
    setIsEditAccountsModalOpen(false);
    setSetupSuccessToast('উইথড্র অ্যাকাউন্ট ও পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSetupSuccessToast(''), 4000);
  };

  // Helper to check if current input matches saved bound account
  const getBoundNumberForSelectedMethod = (): string | undefined => {
    if (!currentUser?.withdrawalAccounts) return undefined;
    if (selectedMethod === 'bKash') return currentUser.withdrawalAccounts.bkash;
    if (selectedMethod === 'Nagad') return currentUser.withdrawalAccounts.nagad;
    if (selectedMethod === 'Rocket') return currentUser.withdrawalAccounts.rocket;
    if (selectedMethod === 'Upay') return currentUser.withdrawalAccounts.upay;
    return undefined;
  };

  const currentBoundNumber = getBoundNumberForSelectedMethod();
  const isDestinationMatchingBound = Boolean(currentBoundNumber && accountDestination.trim() === currentBoundNumber.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentNumAmount = typeof amount === 'number' ? amount : 0;
    if (!currentNumAmount || currentNumAmount <= 0) {
      setErrorMsg('অনুগ্রহ করে উইথড্রর পরিমাণ লিখুন।');
      return;
    }
    if (currentNumAmount > balance) {
      setErrorMsg(`অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${(Number(balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}। অনুগ্রহ করে উইথড্রর পরিমাণ কমান।`);
      return;
    }
    if (currentNumAmount < minWithdrawal) {
      setErrorMsg(`সর্বনিম্ন উইথড্র পরিমাণ ৳${minWithdrawal}।`);
      return;
    }
    if (!accountDestination.trim()) {
      setErrorMsg(
        isBinance
          ? 'অনুগ্রহ করে আপনার Binance Pay ID বা Email দিন।'
          : isCrypto
          ? 'অনুগ্রহ করে আপনার USDT Wallet Address (TRC20/BEP20) দিন।'
          : 'অনুগ্রহ করে আপনার মোবাইল ব্যাংকিং নম্বর দিন।'
      );
      return;
    }

    // Verify Withdraw Password (if configured on user profile)
    const correctPassword = currentUser?.withdrawPassword;
    if (correctPassword && withdrawPasswordInput.trim()) {
      if (withdrawPasswordInput.trim() !== correctPassword.trim()) {
        setErrorMsg('❌ ভুল উইথড্র পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন বা পাসওয়ার্ড ভুলে গেলে সাপোর্টে যোগাযোগ করুন।');
        return;
      }
    }

    setErrorMsg('');
    setIsSuccess(true);
    setTimeout(() => {
      onWithdrawSubmit(
        currentNumAmount, 
        selectedMethod, 
        accountDestination,
        isCryptoType ? { cryptoAmount: Number(cryptoEquivalent), cryptoNetwork: isBinance ? 'Binance Pay' : 'Crypto Pay (USDT)' } : undefined,
        { withdrawPasswordVerified: true, linkedAccountVerified: isDestinationMatchingBound }
      );
      onNavigate('wallet');
    }, 1500);
  };

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-24 select-none"
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
          onClick={() => onNavigate('wallet')}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-base text-white">Withdraw (উইথড্র)</h2>
          <span className="text-[10px] text-amber-300 font-medium">নিরাপদ ও দ্রুত ক্যাশআউট</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Available Balance Header */}
      <div className="bg-[#04260f] p-4 rounded-2xl border border-purple-900/40 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs text-purple-300">Withdrawable Balance</p>
          <h3 className="text-xl font-extrabold text-amber-300 font-mono">
            ৳ {(Number(balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <span className="text-xs bg-purple-900/60 text-purple-200 px-3 py-1.5 rounded-full font-bold border border-purple-700/40">
          Min ৳{minWithdrawal}
        </span>
      </div>

      {/* Success Toast */}
      {setupSuccessToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{setupSuccessToast}</span>
        </div>
      )}

      {/* ================= FIRST TIME SETUP SCREEN (IF NOT SET YET) ================= */}
      {!hasSecuritySetup ? (
        <div className="bg-gradient-to-b from-[#190f3c] to-[#12082b] p-5 rounded-3xl border border-amber-500/50 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 tracking-wider mb-1">
                Security Verification
              </span>
              <h3 className="text-base font-black text-white">প্রথম উইথড্র নিরাপত্তা ও অ্যাকাউন্ট সেটআপ</h3>
              <p className="text-xs text-purple-200/90 mt-1 leading-relaxed">
                প্রথমবার উইথড্র দেওয়ার পূর্বে আপনার <strong className="text-amber-300">bKash, Nagad, Rocket, Upay</strong> অ্যাকাউন্ট নম্বর যোগ করুন এবং একটি গোপনীয় <strong className="text-amber-300">উইথড্র পাসওয়ার্ড</strong> সেট করুন।
              </p>
            </div>
          </div>

          {setupError && (
            <div className="p-3 bg-rose-950/90 border border-rose-500/60 text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{setupError}</span>
            </div>
          )}

          <form onSubmit={handleSaveSecuritySetup} className="space-y-3.5">
            {/* Quick Fill Button */}
            {currentUser?.phone && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!setupBkash) setSetupBkash(currentUser.phone);
                    if (!setupNagad) setSetupNagad(currentUser.phone);
                    if (!setupRocket) setSetupRocket(currentUser.phone);
                    if (!setupUpay) setSetupUpay(currentUser.phone);
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 bg-purple-900/60 border border-purple-700/50 px-2.5 py-1 rounded-lg transition"
                >
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  <span>প্রোফাইল নম্বর ({currentUser.phone}) দিয়ে পূরণ করুন</span>
                </button>
              </div>
            )}

            {/* Mobile Banking Accounts Inputs */}
            <div className="space-y-2.5 bg-[#0d0622]/80 p-3.5 rounded-2xl border border-purple-800/60">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>১. উইথড্র অ্যাকাউন্ট নম্বর দিন (bKash, Nagad, Rocket, Upay):</span>
              </span>

              {/* bKash */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>bKash নম্বর (বিকাশ পার্সোনাল):</span>
                </label>
                <input
                  type="tel"
                  value={setupBkash}
                  onChange={(e) => setSetupBkash(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-[#04260f] border border-purple-700/50 focus:border-pink-400 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              {/* Nagad */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-orange-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Nagad নম্বর (নগদ পার্সোনাল):</span>
                </label>
                <input
                  type="tel"
                  value={setupNagad}
                  onChange={(e) => setSetupNagad(e.target.value)}
                  placeholder="018xxxxxxxx"
                  className="w-full bg-[#04260f] border border-purple-700/50 focus:border-orange-400 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              {/* Rocket */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Rocket নম্বর (রকেট পার্সোনাল ১২ ডিজিট):</span>
                </label>
                <input
                  type="tel"
                  value={setupRocket}
                  onChange={(e) => setSetupRocket(e.target.value)}
                  placeholder="019xxxxxxxx"
                  className="w-full bg-[#04260f] border border-purple-700/50 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              {/* Upay */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Upay নম্বর (উপায় পার্সোনাল):</span>
                </label>
                <input
                  type="tel"
                  value={setupUpay}
                  onChange={(e) => setSetupUpay(e.target.value)}
                  placeholder="016xxxxxxxx"
                  className="w-full bg-[#04260f] border border-purple-700/50 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Withdraw Password Input */}
            <div className="space-y-2.5 bg-[#0d0622]/80 p-3.5 rounded-2xl border border-purple-800/60">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>২. উইথড্র পাসওয়ার্ড সেট করুন (Withdraw Password):</span>
              </span>
              <p className="text-[10px] text-purple-300 leading-tight">
                প্রতিবার টাকা তোলার সময় এই পাসওয়ার্ডটি প্রয়োজন হবে। এটি আপনার ফান্ড নিরাপদ রাখবে।
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">নতুন উইথড্র পাসওয়ার্ড (কমপক্ষে ৪ সংখ্যা):</label>
                <div className="relative">
                  <input
                    type={showSetupPass ? 'text' : 'password'}
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    placeholder="৪-৮ ডিজিটের গোপন পাসওয়ার্ড বা পিন"
                    className="w-full bg-[#04260f] border border-purple-700/50 focus:border-amber-400 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupPass(!showSetupPass)}
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-white"
                  >
                    {showSetupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">কনফার্ম উইথড্র পাসওয়ার্ড:</label>
                <input
                  type={showSetupPass ? 'text' : 'password'}
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                  className="w-full bg-[#04260f] border border-purple-700/50 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>অ্যাকাউন্ট ও উইথড্র পাসওয়ার্ড সেভ করুন</span>
            </button>
          </form>
        </div>
      ) : isSuccess ? (
        <div className="bg-[#04260f] p-6 rounded-2xl border border-amber-500/40 text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-14 h-14 text-amber-400 mx-auto animate-bounce" />
          <h3 className="font-extrabold text-lg text-amber-300">উইথড্র রিকোয়েস্ট জমা পড়েছে!</h3>
          <p className="text-xs text-purple-200 leading-relaxed">
            ৳{amount} {isCryptoType && `(≈ $${cryptoEquivalent} USDT)`} পাঠানোর রিকোয়েস্ট ({selectedMethod}: <span className="font-mono text-white">{accountDestination}</span>) সফলভাবে এডমিনের কাছে পাঠানো হয়েছে। <br />
            <strong className="text-amber-300">এডমিন প্যানেল থেকে ভেরিফাই ও অনুমোদন করার পর আপনার অ্যাকাউন্টে টাকা/ক্রিপ্টো ক্রেডিট হবে।</strong>
          </p>
          <div className="p-2.5 bg-purple-950/60 rounded-xl border border-purple-800/40 text-[11px] text-purple-300 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>উইথড্র পাসওয়ার্ড দিয়ে ভেরিফাইড রিকোয়েস্ট</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-950/90 border border-rose-500/60 text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Select Method */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              <span>১. উইথড্র মেথড বেছে নিন (Select Method)</span>
            </label>

            {/* Local Mobile Banking Grid (Strictly for Bangladesh Users / IDs) */}
            {isBd && localMethods.length > 0 && (
              <div className={`grid ${localMethods.length === 1 ? 'grid-cols-1' : localMethods.length === 2 ? 'grid-cols-2' : localMethods.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
                {localMethods.map((m, mIdx) => {
                  const isSelected = selectedMethod === m;
                  const logoUrl = getPaymentMethodLogo(m, appSettings?.paymentLogos);
                  const isCover = appSettings?.paymentLogoFitMode === 'cover';
                  
                  // Check if bound
                  let boundNum = '';
                  if (currentUser?.withdrawalAccounts) {
                    if (m === 'bKash') boundNum = currentUser.withdrawalAccounts.bkash || '';
                    if (m === 'Nagad') boundNum = currentUser.withdrawalAccounts.nagad || '';
                    if (m === 'Rocket') boundNum = currentUser.withdrawalAccounts.rocket || '';
                    if (m === 'Upay') boundNum = currentUser.withdrawalAccounts.upay || '';
                  }

                  return (
                    <button
                      key={`wd-local-method-${m}-${mIdx}`}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border flex items-center justify-center transition-all relative overflow-hidden group shadow-md cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900/60 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/60 scale-[1.03]'
                          : 'bg-[#04260f] border border-purple-800/40 hover:border-purple-600 hover:bg-purple-900/30'
                      }`}
                    >
                      {/* Full Box Logo Showcase without text */}
                      <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center p-1.5 bg-slate-950/40 border border-white/10 group-hover:border-white/20 transition-all relative">
                        <img
                          src={logoUrl}
                          alt={m}
                          className={`w-full h-full ${
                            isCover ? 'object-cover' : 'object-contain'
                          } rounded-lg drop-shadow transition-transform duration-200 group-hover:scale-105`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(m);
                          }}
                        />
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 absolute top-2 right-2 shadow-lg ring-2 ring-purple-950 z-10">
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Global & Crypto Methods */}
            {(showBinance || showCrypto) && (
              <div className="pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">
                    {isBd 
                      ? 'আন্তর্জাতিক ও ক্রিপ্টো ক্যাশআউট (Crypto & Binance)'
                      : 'International Cashout (Binance Pay & Crypto USDT)'}
                  </span>
                </div>

                <div className={`grid ${showBinance && showCrypto ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                  {showBinance && (
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('BinancePay')}
                      className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border flex items-center justify-center transition-all relative overflow-hidden group shadow-md cursor-pointer ${
                        selectedMethod === 'BinancePay'
                          ? 'bg-purple-900/60 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/60 scale-[1.03]'
                          : 'bg-[#04260f] border border-purple-800/40 hover:border-purple-600 hover:bg-purple-900/30'
                      }`}
                    >
                      {/* Full Box Logo Showcase without text */}
                      <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center p-1.5 bg-slate-950/40 border border-white/10 group-hover:border-white/20 transition-all relative">
                        <img
                          src={getPaymentMethodLogo('BinancePay', appSettings?.paymentLogos)}
                          alt="Binance Pay"
                          className={`w-full h-full ${
                            appSettings?.paymentLogoFitMode === 'cover' ? 'object-cover' : 'object-contain'
                          } rounded-lg drop-shadow transition-transform duration-200 group-hover:scale-105`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo('BinancePay');
                          }}
                        />
                      </div>
                      {selectedMethod === 'BinancePay' && (
                        <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 absolute top-2 right-2 shadow-lg ring-2 ring-purple-950 z-10">
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  )}

                  {showCrypto && (
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('Cryptocurrency')}
                      className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border flex items-center justify-center transition-all relative overflow-hidden group shadow-md cursor-pointer ${
                        selectedMethod === 'Cryptocurrency'
                          ? 'bg-purple-900/60 border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/60 scale-[1.03]'
                          : 'bg-[#04260f] border border-purple-800/40 hover:border-purple-600 hover:bg-purple-900/30'
                      }`}
                    >
                      {/* Full Box Logo Showcase without text */}
                      <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center p-1.5 bg-slate-950/40 border border-white/10 group-hover:border-white/20 transition-all relative">
                        <img
                          src={getPaymentMethodLogo('Cryptocurrency', appSettings?.paymentLogos)}
                          alt="Cryptocurrency"
                          className={`w-full h-full ${
                            appSettings?.paymentLogoFitMode === 'cover' ? 'object-cover' : 'object-contain'
                          } rounded-lg drop-shadow transition-transform duration-200 group-hover:scale-105`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo('Cryptocurrency');
                          }}
                        />
                      </div>
                      {selectedMethod === 'Cryptocurrency' && (
                        <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center text-slate-950 absolute top-2 right-2 shadow-lg ring-2 ring-purple-950 z-10">
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Exchange Rate Notice for Binance / Crypto */}
          {isCryptoType && (
            <div className="p-2.5 bg-[#052a12] rounded-xl border border-purple-700/50 flex items-center justify-between text-xs">
              <span className="text-purple-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400" />
                <span>উইথড্রল এক্সচেঞ্জ রেট:</span>
              </span>
              <span className="font-bold text-amber-300 font-mono">
                1 USDT = ৳{exchangeRate} BDT
              </span>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                ২. উইথড্রর পরিমাণ দিন (৳ BDT)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  সর্বনিম্ন: ৳{minWithdrawal}
                </span>
                {isCryptoType && (
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    আপনি পাবেন ≈ ${cryptoEquivalent} USDT
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`সর্বনিম্ন ৳${minWithdrawal}`}
                className="w-full bg-[#04260f] border border-emerald-600/50 rounded-xl pl-4 pr-24 py-3 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 placeholder:text-emerald-500/50"
                required
                min={minWithdrawal}
                max={balance}
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-emerald-300">
                ৳ BDT
              </span>
            </div>
          </div>

          {/* Destination Account */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                {isBinance
                  ? '৩. আপনার Binance Pay ID বা Email'
                  : isCrypto
                  ? '৩. আপনার USDT Wallet Address (TRC20 / BEP20)'
                  : `৩. আপনার ${selectedMethod} অ্যাকাউন্ট নম্বর`}
              </label>
              {currentBoundNumber && (
                <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>লিংকড নম্বর</span>
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={accountDestination}
                onChange={(e) => setAccountDestination(e.target.value)}
                placeholder={
                  isBinance
                    ? 'e.g. 987654321 / user@gmail.com'
                    : isCrypto
                    ? 'e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
                    : '017xxxxxxxx'
                }
                className="w-full bg-[#04260f] border border-purple-700/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono tracking-wide"
                required
              />
            </div>
          </div>

          {/* Withdraw Password Input Field (REQUIRED FOR SECURITY) */}
          <div className="space-y-1.5 bg-[#140b30] p-3 rounded-2xl border border-purple-800/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>৪. আপনার উইথড্র পাসওয়ার্ড দিন (Withdraw Password):</span>
              </label>
            </div>

            <div className="relative">
              <input
                type={showWithdrawPasswordInput ? 'text' : 'password'}
                value={withdrawPasswordInput}
                onChange={(e) => setWithdrawPasswordInput(e.target.value)}
                placeholder={currentUser?.withdrawPassword ? "আপনার গোপন উইথড্র পাসওয়ার্ড দিন" : "উইথড্র পাসওয়ার্ড (ঐচ্ছিক)"}
                className="w-full bg-[#0b051e] border border-purple-700/60 focus:border-amber-400 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-mono focus:outline-none"
                required={Boolean(currentUser?.withdrawPassword)}
              />
              <button
                type="button"
                onClick={() => setShowWithdrawPasswordInput(!showWithdrawPasswordInput)}
                className="absolute right-3 top-2.5 text-purple-400 hover:text-white"
                title={showWithdrawPasswordInput ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showWithdrawPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-purple-300/80">
              ফান্ড নিরাপত্তার জন্য প্রতি উইথড্রলে এই পাসওয়ার্ড আবশ্যক।
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all mt-4 active:scale-98 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              উইথড্র রিকোয়েস্ট নিশ্চিত করুন {amount ? `(৳${amount} ${isCryptoType ? `≈ $${cryptoEquivalent} USDT` : ''})` : ''}
            </span>
          </button>
        </form>
      )}

      {/* ================= EDIT SAVED ACCOUNTS & WITHDRAW PASSWORD MODAL ================= */}
      {isEditAccountsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#052a12] border border-purple-700/70 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl relative my-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">উইথড্র অ্যাকাউন্ট ও পাসওয়ার্ড আপডেট</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditAccountsModalOpen(false);
                  setSetupError('');
                }}
                className="p-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {setupError && (
              <div className="p-2.5 bg-rose-950/90 border border-rose-500/60 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{setupError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecuritySetup} className="space-y-3">
              {/* Accounts */}
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-pink-300 block mb-0.5">bKash নম্বর:</label>
                  <input
                    type="tel"
                    value={setupBkash}
                    onChange={(e) => setSetupBkash(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-orange-300 block mb-0.5">Nagad নম্বর:</label>
                  <input
                    type="tel"
                    value={setupNagad}
                    onChange={(e) => setSetupNagad(e.target.value)}
                    placeholder="018xxxxxxxx"
                    className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-purple-300 block mb-0.5">Rocket নম্বর:</label>
                  <input
                    type="tel"
                    value={setupRocket}
                    onChange={(e) => setSetupRocket(e.target.value)}
                    placeholder="019xxxxxxxx"
                    className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-300 block mb-0.5">Upay নম্বর:</label>
                  <input
                    type="tel"
                    value={setupUpay}
                    onChange={(e) => setSetupUpay(e.target.value)}
                    placeholder="016xxxxxxxx"
                    className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Password update */}
              <div className="pt-2 border-t border-purple-800/60 space-y-2.5 text-xs">
                {currentUser?.withdrawPassword ? (
                  <div>
                    <label className="text-[11px] font-bold text-amber-300 block mb-1">
                      ১. আগের উইথড্র পাসওয়ার্ড (Old Withdraw Password):
                    </label>
                    <div className="relative">
                      <input
                        type={showSetupOldPass ? 'text' : 'password'}
                        value={setupOldPassword}
                        onChange={(e) => setSetupOldPassword(e.target.value)}
                        placeholder="বর্তমান/আগের উইথড্র পাসওয়ার্ড লিখুন"
                        className="w-full bg-[#0c0620] border border-amber-500/50 rounded-xl pl-3 pr-10 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSetupOldPass(!showSetupOldPass)}
                        className="absolute right-3 top-2 text-amber-400/80 hover:text-white"
                      >
                        {showSetupOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="text-[11px] font-bold text-slate-200 block mb-1">
                    {currentUser?.withdrawPassword ? '২. নতুন উইথড্র পাসওয়ার্ড (New Password):' : 'উইথড্র পাসওয়ার্ড:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showSetupPass ? 'text' : 'password'}
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪ সংখ্যা বা অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl pl-3 pr-10 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupPass(!showSetupPass)}
                      className="absolute right-3 top-2 text-purple-400 hover:text-white"
                    >
                      {showSetupPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-200 block mb-1">
                    {currentUser?.withdrawPassword ? '৩. কনফার্ম নতুন উইথড্র পাসওয়ার্ড (Confirm):' : 'কনফার্ম পাসওয়ার্ড:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showSetupConfirmPass ? 'text' : 'password'}
                      value={setupConfirmPassword}
                      onChange={(e) => setSetupConfirmPassword(e.target.value)}
                      placeholder="একই নতুন পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full bg-[#0c0620] border border-purple-700/50 rounded-xl pl-3 pr-10 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupConfirmPass(!showSetupConfirmPass)}
                      className="absolute right-3 top-2 text-purple-400 hover:text-white"
                    >
                      {showSetupConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditAccountsModalOpen(false)}
                  className="flex-1 py-2 bg-purple-950 text-purple-300 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>আপডেট করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
