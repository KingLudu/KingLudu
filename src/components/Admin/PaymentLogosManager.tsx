import React, { useState, useRef } from 'react';
import {
  Image,
  Upload,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  Eye,
  AlertCircle,
  Smartphone,
  Coins,
  ExternalLink,
} from 'lucide-react';
import {
  getPaymentMethodLogo,
  DEFAULT_PAYMENT_LOGOS,
  PAYMENT_BRAND_THEMES,
} from '../../utils/paymentLogos';
import { AppSettings } from '../../types';

interface PaymentLogosManagerProps {
  settingsForm: AppSettings;
  onUpdateForm: (newSettings: AppSettings) => void;
  onSave?: () => void;
}

const PAYMENT_METHODS_LIST = [
  { key: 'bKash', name: 'bKash', bengaliName: 'বিকাশ', type: 'local' },
  { key: 'Nagad', name: 'Nagad', bengaliName: 'নগদ', type: 'local' },
  { key: 'Rocket', name: 'Rocket', bengaliName: 'রকেট', type: 'local' },
  { key: 'Upay', name: 'Upay', bengaliName: 'উপায়', type: 'local' },
  { key: 'BinancePay', name: 'Binance Pay', bengaliName: 'বাইনান্স পে', type: 'crypto' },
  { key: 'Cryptocurrency', name: 'Cryptocurrency', bengaliName: 'ইউএসডিটি ক্রিপ্টো', type: 'crypto' },
];

export const PaymentLogosManager: React.FC<PaymentLogosManagerProps> = ({
  settingsForm,
  onUpdateForm,
  onSave,
}) => {
  const [activeMethodKey, setActiveMethodKey] = useState<string>('bKash');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLogos = settingsForm.paymentLogos || { ...DEFAULT_PAYMENT_LOGOS };
  const currentLogoUrl = getPaymentMethodLogo(activeMethodKey, currentLogos);
  const isCustomLogo = Boolean(
    settingsForm.paymentLogos &&
      settingsForm.paymentLogos[activeMethodKey] &&
      settingsForm.paymentLogos[activeMethodKey] !== DEFAULT_PAYMENT_LOGOS[activeMethodKey]
  );

  const showNotification = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleApplyLogo = (methodKey: string, logoDataOrUrl: string, sourceName = 'কাস্টম লোগো') => {
    const updatedLogos = {
      ...currentLogos,
      [methodKey]: logoDataOrUrl.trim(),
    };
    onUpdateForm({
      ...settingsForm,
      paymentLogos: updatedLogos,
    });
    showNotification(`✓ ${methodKey} এর জন্য ${sourceName} সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, SVG, WebP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ ২MB এর বেশি হতে পারবে না। অনুগ্রহ করে ছোট সাইজের ছবি আপলোড করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleApplyLogo(activeMethodKey, result, 'ডিভাইস থেকে আপলোডকৃত ছবি');
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers change
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleResetToDefault = (methodKey: string) => {
    const defaultLogo = DEFAULT_PAYMENT_LOGOS[methodKey] || '';
    const updatedLogos = {
      ...currentLogos,
      [methodKey]: defaultLogo,
    };
    onUpdateForm({
      ...settingsForm,
      paymentLogos: updatedLogos,
    });
    showNotification(`✓ ${methodKey} এর লোগো অফিশিয়াল ডিফল্টে ফিরিয়ে নেওয়া হয়েছে!`);
  };

  const handleResetAllToDefaults = () => {
    onUpdateForm({
      ...settingsForm,
      paymentLogos: { ...DEFAULT_PAYMENT_LOGOS },
    });
    showNotification('✓ সকল পেমেন্ট সিস্টেমের লোগো অফিশিয়াল ডিফল্ট অবস্থায় সেট করা হয়েছে!');
  };

  const currentTheme = PAYMENT_BRAND_THEMES[activeMethodKey] || PAYMENT_BRAND_THEMES.bKash;

  return (
    <div className="bg-[#052a12] p-3.5 sm:p-5 rounded-2xl border-2 border-pink-500/50 space-y-4 shadow-2xl relative overflow-hidden">
      {/* Background glowing ambient light */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
              <Image className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>পেমেন্ট সিস্টেমের লোগো ম্যানেজমেন্ট (Payment Logos)</span>
              <span className="text-[10px] bg-pink-500/30 text-pink-300 px-2 py-0.5 rounded-full font-bold border border-pink-500/40">
                এডমিন কাস্টমাইজেশন
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-purple-200">
            ডিপোজিট (Add Money) ও উইথড্র (Withdraw) স্ক্রিনের প্রতিটা বাটনের লোগো সরাসরি ডিভাইস থেকে আপলোড করুন বা লিংক বসান
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetAllToDefaults}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>সবগুলো ডিফল্টে নিন</span>
        </button>
      </div>

      {/* Success / Feedback Toast */}
      {feedbackNotice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* ================= SECTION 1: LIVE USER PREVIEW BOX ================= */}
      <div className="bg-[#031e0c] p-3.5 sm:p-4 rounded-2xl border border-purple-700/60 space-y-3 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold text-amber-300">
              লাইভ প্রিভিউ (ইউজাররা ডিপোজিট ও উইথড্র স্ক্রিনে যেমন দেখবে):
            </span>
          </div>

          {/* Logo Fit Mode Switcher: Full Box Cover vs Fit Contain */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-purple-800/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                onUpdateForm({
                  ...settingsForm,
                  paymentLogoFitMode: 'cover',
                });
                showNotification('✓ লোগো ফিট মোড: পুরো ঘর জুড়ে (Full Cover) সেট করা হয়েছে');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                settingsForm.paymentLogoFitMode === 'cover'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🖼️ ফুল ঘর (Cover)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateForm({
                  ...settingsForm,
                  paymentLogoFitMode: 'contain',
                });
                showNotification('✓ লোগো ফিট মোড: ফুল সাইজ ফিট (Full Box Fit) সেট করা হয়েছে');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                settingsForm.paymentLogoFitMode !== 'cover'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🔍 ফিট (Contain)</span>
            </button>
          </div>
        </div>

        {/* Local 4 Buttons Grid - Full Box Showcase */}
        <div className="grid grid-cols-4 gap-2">
          {PAYMENT_METHODS_LIST.filter((m) => m.type === 'local').map((m) => {
            const isSelected = activeMethodKey === m.key;
            const logo = getPaymentMethodLogo(m.key, currentLogos);
            const isCover = settingsForm.paymentLogoFitMode === 'cover';
            return (
              <button
                key={`preview-local-${m.key}`}
                type="button"
                onClick={() => setActiveMethodKey(m.key)}
                className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border flex items-center justify-center transition-all relative overflow-hidden group shadow-md cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/40 border-2 border-amber-400 text-amber-300 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-[#04260f] border border-purple-900/50 text-slate-300 hover:text-white hover:border-purple-600/60'
                }`}
                title={m.name}
              >
                {/* Full Box Logo Showcase Container */}
                <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center p-1 bg-slate-950/40 border border-white/10 group-hover:border-white/20 transition-all relative">
                  <img
                    src={logo}
                    alt={m.name}
                    className={`w-full h-full ${
                      isCover ? 'object-cover' : 'object-contain'
                    } rounded-lg drop-shadow transition-transform duration-200 group-hover:scale-105`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PAYMENT_LOGOS[m.key];
                    }}
                  />
                </div>
                {isSelected && (
                  <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 absolute top-1.5 right-1.5 shadow ring-2 ring-purple-950 z-10">
                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Crypto 2 Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {PAYMENT_METHODS_LIST.filter((m) => m.type === 'crypto').map((m) => {
            const isSelected = activeMethodKey === m.key;
            const logo = getPaymentMethodLogo(m.key, currentLogos);
            const isCover = settingsForm.paymentLogoFitMode === 'cover';
            return (
              <button
                key={`preview-crypto-${m.key}`}
                type="button"
                onClick={() => setActiveMethodKey(m.key)}
                className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border flex items-center justify-center transition-all relative overflow-hidden group shadow-md cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/40 border-2 border-amber-400 text-amber-300 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-[#04260f] border border-purple-900/50 text-slate-300 hover:border-purple-600/60'
                }`}
                title={m.name}
              >
                <div className="w-full h-full rounded-xl bg-slate-950/40 p-1 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/20 transition-all relative">
                  <img
                    src={logo}
                    alt={m.name}
                    className={`w-full h-full ${isCover ? 'object-cover' : 'object-contain'} rounded-lg drop-shadow`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PAYMENT_LOGOS[m.key];
                    }}
                  />
                </div>
                {isSelected && (
                  <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 absolute top-1.5 right-1.5 shadow ring-2 ring-purple-950 z-10">
                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 2: METHOD SELECTION TABS ================= */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {PAYMENT_METHODS_LIST.map((m) => {
          const isSelected = activeMethodKey === m.key;
          const theme = PAYMENT_BRAND_THEMES[m.key] || PAYMENT_BRAND_THEMES.bKash;
          const hasCustom = Boolean(
            settingsForm.paymentLogos &&
              settingsForm.paymentLogos[m.key] &&
              settingsForm.paymentLogos[m.key] !== DEFAULT_PAYMENT_LOGOS[m.key]
          );
          return (
            <button
              key={`tab-${m.key}`}
              type="button"
              onClick={() => setActiveMethodKey(m.key)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md ring-1 ring-white/30'
                  : 'bg-[#031e0c] border border-purple-800/60 text-slate-300 hover:text-white hover:border-purple-600'
              }`}
            >
              <div className="w-4 h-4 rounded-md overflow-hidden bg-slate-900 p-0.5 shrink-0">
                <img
                  src={getPaymentMethodLogo(m.key, currentLogos)}
                  alt={m.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>{m.bengaliName} ({m.name})</span>
              {hasCustom && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" title="কাস্টম লোগো চালু" />
              )}
            </button>
          );
        })}
      </div>

      {/* ================= SECTION 3: CURRENT METHOD LOGO EDITOR ================= */}
      <div className="bg-[#031e0c] p-4 rounded-2xl border-2 border-purple-600/40 space-y-4">
        {/* Active Method Top Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/60 pb-3">
          <div className="flex items-center gap-3">
            {/* Enlarged Logo Card */}
            <div className="w-20 h-20 rounded-2xl bg-slate-950/80 p-1.5 flex items-center justify-center border-2 border-purple-500/50 shadow-xl overflow-hidden shrink-0">
              <img
                src={currentLogoUrl}
                alt={activeMethodKey}
                className={`w-full h-full ${
                  settingsForm.paymentLogoFitMode === 'cover' ? 'object-cover' : 'object-contain'
                } rounded-xl drop-shadow`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_PAYMENT_LOGOS[activeMethodKey];
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-white">
                  {currentTheme.bengaliName} ({activeMethodKey}) লোগো
                </h4>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    isCustomLogo
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {isCustomLogo ? '🟢 কাস্টম লোগো সক্রিয়' : '🔵 অফিশিয়াল ডিফল্ট'}
                </span>
              </div>
              <p className="text-xs text-purple-300 mt-0.5">
                নিচে থেকে আপনার ডিভাইস বা গ্যালারি থেকে পছন্দের লোগো আপলোড করুন
              </p>
            </div>
          </div>

          {/* Quick Reset Button */}
          {isCustomLogo && (
            <button
              type="button"
              onClick={() => handleResetToDefault(activeMethodKey)}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ডিফল্টে ফিরিয়ে নিন</span>
            </button>
          )}
        </div>

        {/* Device File Upload Box */}
        <div className="bg-[#052a12] p-4 rounded-xl border border-purple-700/50 space-y-2.5">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            <label className="text-xs font-extrabold text-amber-300">
              ডিভাইস/গ্যালারি থেকে ছবি আপলোড (Upload File)
            </label>
          </div>
          <p className="text-[11px] text-purple-300">
            আপনার ফোন বা কম্পিউটার থেকে পিএনজি, জেপিজি বা এসভিজি লোগো সিলেক্ট করুন:
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 bg-purple-900/60 hover:bg-purple-800 text-white rounded-xl border border-dashed border-purple-500/70 text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-[1.01] cursor-pointer"
          >
            <Upload className="w-4 h-4 text-pink-400" />
            <span>ছবি পছন্দ করুন (Browse / Choose Image)</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            সমর্থিত ফরম্যাট: PNG (ট্রান্সপারেন্ট ব্যাকগ্রাউন্ড রিকমেন্ডেড), SVG, WebP, JPG
          </p>
        </div>
      </div>

      {/* Save Action Callout */}
      {onSave && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>লোগো পরিবর্তন সেভ করুন (Save Logos)</span>
          </button>
        </div>
      )}
    </div>
  );
};
