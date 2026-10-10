import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  Coins, 
  ExternalLink,
  Info,
  DollarSign,
  HelpCircle,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { PaymentMethod, ScreenType, AppSettings, RegionCode, REGIONS, UserProfile } from '../../types';
import { getPaymentMethodLogo } from '../../utils/paymentLogos';
import { getPaymentMethodsForRegion, isBangladeshUser } from '../../utils/paymentGeo';

interface AddMoneyScreenProps {
  appSettings?: AppSettings;
  currentUser?: UserProfile;
  onAddMoneySuccess: (
    amount: number, 
    method: PaymentMethod, 
    senderPhone: string, 
    trxId: string,
    cryptoDetails?: { cryptoAmount?: number; cryptoNetwork?: string },
    userId?: string
  ) => void;
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
}

export const AddMoneyScreen: React.FC<AddMoneyScreenProps> = ({
  appSettings,
  currentUser,
  onAddMoneySuccess,
  onNavigate,
  selectedRegion = 'BN',
}) => {
  const isBd = isBangladeshUser(selectedRegion, currentUser);
  const allAvailableMethods: PaymentMethod[] = getPaymentMethodsForRegion(
    selectedRegion,
    currentUser,
    appSettings,
    'deposit'
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
  const [senderAccount, setSenderAccount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic QR Step & 25-minute timer state
  const [isQrStep, setIsQrStep] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes = 1500 seconds
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exchangeRate = appSettings?.usdtExchangeRate || 125;
  const numAmount = typeof amount === 'number' ? amount : 0;
  const cryptoEquivalent = numAmount > 0 ? (numAmount / exchangeRate).toFixed(2) : '0.00';

  const minDeposit = appSettings?.minDeposit ?? 50;
  const presetAmounts = Array.from(
    new Set([minDeposit, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000])
  )
    .filter((a) => a >= minDeposit)
    .sort((a, b) => a - b);

  const binancePayId = appSettings?.binancePayId || '982736154';
  const trc20Address = appSettings?.cryptoUsdtTrc20Address || 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  const bep20Address = appSettings?.cryptoUsdtBep20Address || '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c';

  const isBinance = selectedMethod === 'BinancePay' || selectedMethod === 'Binance';
  const isCrypto = selectedMethod === 'Cryptocurrency';
  const isCryptoType = isBinance || isCrypto;

  const currentAddressOrNumber = isBinance
    ? binancePayId
    : isCrypto
    ? trc20Address
    : selectedMethod === 'bKash'
    ? appSettings?.bkashNumber || '01700-112233'
    : selectedMethod === 'Nagad'
    ? appSettings?.nagadNumber || '01800-445566'
    : selectedMethod === 'Rocket'
    ? appSettings?.rocketNumber || '01900-778899-1'
    : appSettings?.upayNumber || '01600-990011';

  // 25-minute countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isQrStep && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isQrStep, timeLeft]);

  // Generate dynamic QR code for the exact amount entered
  useEffect(() => {
    if (isQrStep) {
      setQrLoading(true);
      let payload = '';

      if (isBinance) {
        // Binance Pay deep link / payload with exact amount
        payload = `binance://pay?payId=${binancePayId}&amount=${cryptoEquivalent}&currency=USDT&orderId=${orderId}&ref=deposit`;
      } else if (isCrypto) {
        // Crypto USDT TRC20 transfer payload
        payload = `${trc20Address}`;
      } else {
        // Local Mobile Banking format with exact BDT amount
        payload = `${selectedMethod.toLowerCase()}://payment?recipient=${currentAddressOrNumber}&amount=${amount}&ref=${orderId}`;
      }

      QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#031e0c',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrDataUrl(url);
          setQrLoading(false);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
          setQrLoading(false);
        });
    }
  }, [isQrStep, amount, cryptoEquivalent, selectedMethod, isBinance, isCrypto, binancePayId, trc20Address, currentAddressOrNumber, orderId]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // When user clicks Confirm Deposit on amount screen, generate Order ID & open 25-min QR page
  const handleProceedToQr = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = typeof amount === 'number' ? amount : 0;
    if (!finalAmount || finalAmount < minDeposit) {
      alert(`সর্বনিম্ন ডিপোজিট পরিমাণ ৳${minDeposit}। অনুগ্রহ করে টাকার পরিমাণ লিখুন।`);
      return;
    }
    const newOrderId = 'DP' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setTimeLeft(25 * 60); // 25 minutes
    setIsQrStep(true);
  };

  // When user confirms payment on the QR page
  const handleFinalPaymentSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsSuccess(true);
    const finalAmount = typeof amount === 'number' ? amount : minDeposit;
    setTimeout(() => {
      onAddMoneySuccess(
        finalAmount, 
        selectedMethod, 
        senderAccount || (isCryptoType ? (isBinance ? 'Binance Pay User' : 'Crypto Pay User') : (currentUser?.phone || '01700000000')), 
        trxId || orderId || 'TRX' + Math.floor(Math.random() * 1000000),
        isCryptoType ? { cryptoAmount: Number(cryptoEquivalent), cryptoNetwork: isBinance ? 'Binance Pay' : 'Crypto Pay (USDT)' } : undefined,
        currentUser?.id
      );
      onNavigate('wallet');
    }, 1500);
  };

  // Reset 25-minute timer & generate fresh QR
  const handleRegenerateQr = () => {
    const newOrderId = 'DP' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setTimeLeft(25 * 60);
  };

  // Download QR code image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${selectedMethod}-Deposit-${amount}BDT-${orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          onClick={() => {
            if (isQrStep) {
              setIsQrStep(false);
            } else {
              onNavigate('wallet');
            }
          }}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-white">
          {isQrStep ? 'পেমেন্ট কিউআর কোড (Payment QR)' : 'Deposit (ডিপোজিট)'}
        </h2>
        <div className="w-9" />
      </div>

      {isSuccess ? (
        <div className="bg-[#04260f] p-6 rounded-2xl border border-amber-500/50 text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-14 h-14 text-amber-400 mx-auto animate-bounce" />
          <h3 className="font-extrabold text-lg text-amber-300">ডিপোজিট রিকোয়েস্ট জমা হয়েছে!</h3>
          <p className="text-xs text-purple-200 leading-relaxed">
            ৳{amount.toLocaleString()} {isCryptoType && `(≈ $${cryptoEquivalent} USDT)`} ({selectedMethod}) এর ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে। <br />
            <strong className="text-amber-300">এডমিন প্যানেল থেকে ভেরিফাই ও অনুমোদন (Approve) করার সাথে সাথে আপনার ওয়ালেটে ব্যালেন্স যোগ হবে।</strong>
          </p>
        </div>
      ) : isQrStep ? (
        /* ================= STEP 2: 25-MINUTE DYNAMIC QR CODE PAYMENT VIEW ================= */
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* 25-Minute Countdown Timer Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            timeLeft > 300 
              ? 'bg-gradient-to-r from-amber-500/15 via-purple-950/70 to-amber-500/15 border-amber-400/50 shadow-lg' 
              : timeLeft > 0
              ? 'bg-gradient-to-r from-red-500/20 via-purple-950/70 to-red-500/20 border-red-500/60 shadow-lg animate-pulse'
              : 'bg-red-950/60 border-red-500 text-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft > 300 ? 'text-amber-400' : 'text-red-400'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-200">পেমেন্টের অবশিষ্ট সময়:</p>
                  <p className="text-[10px] text-slate-400">এই কিউআর কোডটি ২৫ মিনিট কার্যকর থাকবে</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-mono text-xl font-black px-3 py-1 rounded-xl border ${
                  timeLeft > 300 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                    : 'bg-red-500/20 text-red-300 border-red-400/50'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft > 300 ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (timeLeft / (25 * 60)) * 100))}%` }}
              />
            </div>
          </div>

          {timeLeft === 0 ? (
            /* Expired Alert */
            <div className="bg-red-950/80 border border-red-500/60 p-5 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
              <h4 className="font-extrabold text-base text-red-200">কিউআর কোডের মেয়াদ শেষ হয়ে গেছে!</h4>
              <p className="text-xs text-red-300/80">২৫ মিনিটের নির্ধারিত সময় পার হয়ে গেছে। ডিপোজিট করতে নতুন কিউআর কোড জেনারেট করুন।</p>
              <button
                type="button"
                onClick={handleRegenerateQr}
                className="px-5 py-2.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 mx-auto hover:bg-amber-300 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>নতুন কিউআর কোড তৈরি করুন</span>
              </button>
            </div>
          ) : (
            /* Active Dynamic QR Code Card */
            <div className="bg-gradient-to-b from-[#04260f] to-[#031e0c] p-4 rounded-2xl border-2 border-amber-400/60 space-y-4 shadow-2xl">
              {/* Method & Amount Header */}
              <div className="flex items-center justify-between border-b border-purple-800/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/90 p-1 flex items-center justify-center overflow-hidden border border-white/10 shadow shrink-0">
                    <img
                      src={getPaymentMethodLogo(selectedMethod, appSettings?.paymentLogos)}
                      alt={selectedMethod}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(selectedMethod);
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">
                      {selectedMethod} {isCrypto && '(Crypto Pay)'}
                    </h3>
                    <p className="text-[10px] text-amber-300 font-mono">
                      অর্ডার আইডি: #{orderId}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isCryptoType ? `$${cryptoEquivalent} USDT` : `৳${amount.toLocaleString()}`}
                </span>
              </div>

              {/* QR Image Container */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-2 border-amber-400/90 relative group">
                  {qrLoading ? (
                    <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-800 gap-2">
                      <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                      <span className="text-xs font-bold font-mono">QR কোড তৈরি হচ্ছে...</span>
                    </div>
                  ) : qrDataUrl ? (
                    <div className="relative">
                      <img 
                        src={qrDataUrl} 
                        alt={`${selectedMethod} QR Code`} 
                        className="w-56 h-56 object-contain rounded-lg"
                      />
                      {/* Center Brand Badge on QR */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 border-2 border-amber-400 shadow-xl flex items-center justify-center">
                          <img 
                            src={getPaymentMethodLogo(selectedMethod, appSettings?.paymentLogos)} 
                            alt={selectedMethod} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-red-500 text-xs">
                      QR কোড লোড হতে ব্যর্থ হয়েছে
                    </div>
                  )}
                </div>

                {/* Amount Pill Below QR */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-black text-amber-300 font-mono">
                    ৳{amount.toLocaleString()} BDT {isCryptoType && `≈ $${cryptoEquivalent} USDT`}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    {isBinance 
                      ? 'বাইনান্স অ্যাপ দিয়ে ওপরের কিউআর স্ক্যান করলেই সরাসরি এই পরিমাণ চলে আসবে' 
                      : isCrypto
                      ? 'বাইনান্স বা যেকোনো ক্রিপ্টো ওয়ালেট দিয়ে কিউআর স্ক্যান করে সরাসরি পে করুন'
                      : 'আপনার পেমেন্ট অ্যাপ দিয়ে কিউআর স্ক্যান করে ডিপোজিট সম্পন্ন করুন'}
                  </p>
                </div>

                {/* Download QR Button */}
                {qrDataUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/60 text-xs font-bold text-purple-200 hover:text-white hover:bg-purple-800 flex items-center gap-1.5 transition shadow"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>কিউআর কোড ডাউনলোড করুন</span>
                  </button>
                )}
              </div>

              {/* Payment Summary Box */}
              <div className="bg-[#031e0c] p-3 rounded-xl border border-purple-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-purple-800/40">
                  <span className="text-slate-400">
                    {isBinance ? 'Official Binance Pay ID:' : isCrypto ? 'Official USDT Address:' : `Official ${selectedMethod} Number:`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-300">{currentAddressOrNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAddressOrNumber)}
                      className="p-1 bg-purple-800 hover:bg-amber-400 hover:text-slate-950 text-white rounded text-[10px] flex items-center gap-0.5 transition"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-purple-800/40">
                  <span className="text-slate-400">পাঠানোর সঠিক পরিমাণ:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-400">
                      {isCryptoType ? `$${cryptoEquivalent} USDT (৳${amount})` : `৳${amount.toLocaleString()}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(isCryptoType ? cryptoEquivalent : amount.toString())}
                      className="p-1 bg-purple-800 hover:bg-amber-400 hover:text-slate-950 text-white rounded text-[10px] flex items-center gap-0.5 transition"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">অর্ডার রেফারেন্স:</span>
                  <span className="font-mono font-bold text-purple-300">#{orderId}</span>
                </div>
              </div>

              {/* User Proof / TrxID */}
              <div className="space-y-2 pt-1 border-t border-purple-800/50">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isCryptoType ? 'ক্রিপ্টো ট্রানজাকশন আইডি (TxHash):' : 'ট্রানজাকশন আইডি (TrxID):'}
                  </label>

                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder={isCryptoType ? "e.g. 0x8a92... or TxHash" : "TrxID লিখুন (e.g. 9X721M88)"}
                    className="w-full bg-[#031e0c] border border-purple-700/60 focus:border-amber-400 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none font-mono tracking-wider"
                    required
                  />
                </div>
              </div>

              {/* Confirmation Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleFinalPaymentSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>পেমেন্ট সম্পন্ন করেছি (Confirm Deposit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrStep(false)}
                  className="w-full py-2.5 bg-purple-900/40 hover:bg-purple-800/60 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-purple-700/50 transition text-center"
                >
                  পরিমাণ পরিবর্তন করুন (Change Amount)
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleProceedToQr} className="space-y-4">
          {/* Method Selection Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              <span>১. পেমেন্ট মেথড নির্বাচন করুন (Select Method)</span>
            </label>

            {/* Local Mobile Banking Methods (Strictly for Bangladesh Users / IDs) */}
            {isBd && localMethods.length > 0 && (
              <div className={`grid ${localMethods.length === 1 ? 'grid-cols-1' : localMethods.length === 2 ? 'grid-cols-2' : localMethods.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
                {localMethods.map((m, mIdx) => {
                  const isSelected = selectedMethod === m;
                  const logoUrl = getPaymentMethodLogo(m, appSettings?.paymentLogos);
                  const isCover = appSettings?.paymentLogoFitMode === 'cover';
                  return (
                    <button
                      key={`deposit-local-method-${m}-${mIdx}`}
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

            {/* Global & Crypto Methods (BinancePay ও Cryptocurrency) */}
            {(showBinance || showCrypto) && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300">
                      {isBd 
                        ? 'বাইনান্স ও ক্রিপ্টো পেমেন্ট (Binance & Crypto)'
                        : 'International Payment Gateways (Binance Pay & Crypto USDT)'}
                    </span>
                  </div>
                </div>

                <div className={`grid ${showBinance && showCrypto ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                  {/* Binance Pay Button */}
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

                  {/* Cryptocurrency Button */}
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

            {allAvailableMethods.length === 0 && (
              <div className="p-4 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-center space-y-1.5">
                <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                <p className="text-xs font-bold text-rose-300">সকল ডিপোজিট মেথড বর্তমানে সাময়িকভাবে বন্ধ আছে।</p>
                <p className="text-[10px] text-purple-300">দয়া করে পরবর্তীতে চেষ্টা করুন অথবা সাপোর্টে যোগাযোগ করুন।</p>
              </div>
            )}
          </div>

          {/* ================= OFFICIAL ADDRESS / PAY ID & DETAILS SECTION ================= */}
          {isCryptoType ? (
            <div className="bg-gradient-to-b from-[#04260f] to-[#031e0c] p-4 rounded-2xl border border-amber-400/50 space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/90 p-1 flex items-center justify-center overflow-hidden border border-white/10 shadow shrink-0">
                    <img
                      src={getPaymentMethodLogo(selectedMethod, appSettings?.paymentLogos)}
                      alt={selectedMethod}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(selectedMethod);
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white block">
                      {isBinance ? 'Official Binance Pay ID' : 'Official USDT TRC20 Address'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {isBinance ? 'Direct Binance Pay Transfer' : 'Direct USDT TRC20 Transfer'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  অফিশিয়াল
                </span>
              </div>

              {/* Address / Pay ID info box */}
              <div className="bg-[#031e0c] p-3 rounded-xl border border-purple-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-purple-300 font-bold">
                    {isBinance ? 'অফিশিয়াল Binance Pay ID:' : 'অফিশিয়াল USDT TRC20 Wallet:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentAddressOrNumber)}
                    className="px-2.5 py-1 bg-purple-800 hover:bg-amber-400 hover:text-slate-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono font-black text-amber-300 text-xs break-all select-all bg-black/40 p-2 rounded-lg border border-white/10">
                  {currentAddressOrNumber}
                </p>
              </div>

              {/* Live Rate Box */}
              <div className="p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/50 flex items-center justify-between text-xs">
                <span className="text-purple-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium">বর্তমান কনভার্সন রেট:</span>
                </span>
                <span className="font-extrabold text-amber-300 font-mono">
                  1 USDT = ৳{exchangeRate} BDT
                </span>
              </div>
            </div>
          ) : (
            /* Standard Mobile Banking Details Box */
            <div className="bg-[#04260f] p-3.5 rounded-2xl border border-purple-700/50 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 p-1 flex items-center justify-center overflow-hidden border border-white/10 shadow shrink-0">
                    <img
                      src={getPaymentMethodLogo(selectedMethod, appSettings?.paymentLogos)}
                      alt={selectedMethod}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getPaymentMethodLogo(selectedMethod);
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] text-purple-300 font-medium">
                      {appSettings?.paymentAccountTitles?.[selectedMethod] ||
                        `Official ${selectedMethod} Personal/Agent Account`}
                    </p>
                    <p className="font-mono font-black text-amber-300 text-sm mt-0.5 break-all">
                      {currentAddressOrNumber}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAddressOrNumber)}
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ml-2 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Deposit Amount Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                ২. ডিপোজিট পরিমাণ (৳ BDT Amount)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  সর্বনিম্ন: ৳{minDeposit}
                </span>
                {isCryptoType && (
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    ≈ ${cryptoEquivalent} USDT
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#04260f] border border-emerald-600/50 rounded-xl pl-4 pr-24 py-3 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 placeholder:text-emerald-500/50"
                placeholder={`সর্বনিম্ন ৳${minDeposit}`}
                required
                min={minDeposit}
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-emerald-300">
                ৳ BDT
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {presetAmounts.map((amt, aIdx) => (
                <button
                  key={`preset-amt-${amt}-${aIdx}`}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                    amount === amt
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-500/20 scale-102'
                      : 'bg-[#04260f] border-emerald-700/40 text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-500/60'
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit / Proceed to QR */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all mt-4 active:scale-98 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Confirm Deposit {amount ? `(৳${Number(amount).toLocaleString()} ${isCryptoType ? `≈ $${cryptoEquivalent} USDT` : ''})` : ''}</span>
          </button>
        </form>
      )}
    </div>
  );
};
