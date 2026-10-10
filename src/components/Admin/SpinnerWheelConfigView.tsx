import React, { useState, useEffect } from 'react';
import {
  Disc,
  Save,
  Settings,
  Eye,
  Wallet,
  CheckCircle2,
  Info,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  AdminLuckyWheelSlice,
  AdminLuckyWheelSettings,
  DEFAULT_ADMIN_WHEEL_SLICES,
  DEFAULT_ADMIN_WHEEL_SETTINGS,
  getStoredLuckyWheelConfig,
  saveStoredLuckyWheelConfig,
  LUCKY_WHEEL_UPDATED_EVENT,
} from '../../types/luckyWheelTypes';
import { ScreenType, UserProfile } from '../../types';
import { LuckySpinnerWheelModal } from '../Modals/LuckySpinnerWheelModal';

interface SpinnerWheelConfigViewProps {
  onNavigate?: (screen: ScreenType) => void;
  currentUser?: UserProfile;
}

export const SpinnerWheelConfigView: React.FC<SpinnerWheelConfigViewProps> = ({
  onNavigate,
  currentUser,
}) => {
  const [slices, setSlices] = useState<AdminLuckyWheelSlice[]>(() => {
    const config = getStoredLuckyWheelConfig();
    return config.slices;
  });

  const [settings, setSettings] = useState<AdminLuckyWheelSettings>(() => {
    const config = getStoredLuckyWheelConfig();
    return config.settings;
  });

  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [showLiveWheelModal, setShowLiveWheelModal] = useState(false);

  // Sync if another tab or component updates the config
  useEffect(() => {
    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setSlices(customEvent.detail.slices);
        setSettings(customEvent.detail.settings);
      }
    };
    window.addEventListener(LUCKY_WHEEL_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(LUCKY_WHEEL_UPDATED_EVENT, handleUpdated);
    };
  }, []);

  const handleToggleActive = (id: string) => {
    setSlices((prev) =>
      prev.map((slice) =>
        slice.id === id
          ? { ...slice, isActiveForWinner: !slice.isActiveForWinner }
          : slice
      )
    );
  };

  const handleUpdateSlice = (
    id: string,
    field: 'showingFigure' | 'actualCreditedValue',
    val: string
  ) => {
    setSlices((prev) =>
      prev.map((slice) =>
        slice.id === id ? { ...slice, [field]: val } : slice
      )
    );
  };

  const handleSave = () => {
    // Validate at least one slice is active
    const activeCount = slices.filter((s) => s.isActiveForWinner).length;
    if (activeCount === 0) {
      alert('সতর্কতা: কমপক্ষে ১টি স্লাইস "Active for Spin Winner" হিসেবে সক্রিয় থাকতে হবে!');
      return;
    }

    saveStoredLuckyWheelConfig({
      slices,
      settings,
    });

    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
    }, 3500);
  };

  const handleResetToScreenshotDefault = () => {
    if (window.confirm('আপনি কি ডিফল্ট কনফিগারেশনে রিসেট করতে চান?')) {
      setSlices(DEFAULT_ADMIN_WHEEL_SLICES);
      setSettings(DEFAULT_ADMIN_WHEEL_SETTINGS);
      saveStoredLuckyWheelConfig({
        slices: DEFAULT_ADMIN_WHEEL_SLICES,
        settings: DEFAULT_ADMIN_WHEEL_SETTINGS,
      });
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3000);
    }
  };

  const activeSlicesCount = slices.filter((s) => s.isActiveForWinner).length;

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 select-none font-sans">
      {/* Toast Notification Banner */}
      {saveSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#00a884] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 border border-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <div>
            <div className="font-bold text-sm">কনফিগারেশন সেভ হয়েছে!</div>
            <div className="text-xs text-emerald-100">
              হোমপেজের লাকি হুইলে সকল পরিবর্তন তাৎক্ষণিক আপডেট হয়েছে।
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER / TITLE */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            LUCKY WHEEL SYSTEM
          </span>
          <div className="flex items-center gap-2.5 mt-0.5">
            {/* Concentric red target icon matching screenshot */}
            <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center shrink-0">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-red-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Spinner / Lucky Wheel Configuration
            </h1>
          </div>
        </div>

        {/* Quick Reset, Homepage Link & Test Status */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            সক্রিয় স্লাইস: <strong className="text-emerald-700 font-black">{activeSlicesCount}/8</strong>
          </span>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-400 hover:brightness-105 border border-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
              title="হোমপেজে যান এবং লাকি স্পিনার দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-900" />
              <span>হোমপেজে স্পিনার দেখুন</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLiveWheelModal(true)}
            className="text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
            title="এডমিন প্যানেলে সরাসরি লাকি হুইল প্রিভিউ টেস্ট করুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>হুইল টেস্ট করুন</span>
          </button>

          <button
            type="button"
            onClick={handleResetToScreenshotDefault}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            title="স্ক্রিনশটের ডিফল্ট ভ্যালু অনুযায়ী রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>
        </div>
      </div>

      {/* CYAN INFO BOX */}
      <div className="bg-[#e0f7fa] border border-[#b2ebf2] rounded-lg p-3.5 sm:p-4 mb-5 flex items-start gap-3 shadow-xs">
        <div className="w-5 h-5 rounded-full bg-[#00acc1] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
          i
        </div>
        <p className="text-xs sm:text-sm text-[#006064] leading-relaxed font-medium">
          <strong className="font-extrabold text-[#004d40]">Wheel Prizes Guide:</strong> Configure the 8 slices of the Lucky Wheel below. Set the prize amount in{' '}
          <strong className="font-extrabold text-[#004d40]">**BDT (৳)**</strong> for each slice. Check the{' '}
          <strong className="font-extrabold text-[#004d40]">"Active for Spin Winner"</strong> checkbox on the slices you want the wheel to land on. Only checked slices will be chosen during spins!
        </p>
      </div>

      {/* BLUE CARD: SPINNER / WHEEL GENERAL SETTINGS */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 shadow-xs">
        <div className="bg-[#1e88e5] text-white px-4 py-2.5 flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide">
          <Settings className="w-4 h-4" />
          <span>Spinner / Wheel General Settings</span>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1: Enable Lucky Wheel Game */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={settings.enableLuckyWheel}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    enableLuckyWheel: !prev.enableLuckyWheel,
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                  settings.enableLuckyWheel ? 'bg-[#1e88e5]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    settings.enableLuckyWheel ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="font-bold text-xs sm:text-sm text-slate-800">
                Enable Lucky Wheel Game
              </span>
            </label>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 ml-0.5 leading-normal">
              If disabled, players cannot spin the wheel.
            </p>
          </div>

          {/* Column 2: Spin Cooldown / Frequency (Hours) */}
          <div>
            <label className="block font-bold text-xs sm:text-sm text-slate-800 mb-1.5">
              Spin Cooldown / Frequency (Hours)
            </label>
            <input
              type="number"
              min="0"
              max="720"
              value={settings.cooldownHours}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  cooldownHours: Math.max(0, Number(e.target.value) || 0),
                }))
              }
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#1e88e5] transition"
            />
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 leading-normal">
              How long ('kotookkhon por') a player must wait before spinning again. Set '24' for Daily Spin, '0' for unlimited.
            </p>
          </div>

          {/* Column 3: Minimum Deposit Required (BDT ৳) */}
          <div>
            <label className="block font-bold text-xs sm:text-sm text-slate-800 mb-1.5">
              Minimum Deposit Required (BDT ৳)
            </label>
            <div className="flex rounded border border-slate-300 overflow-hidden focus-within:border-[#1e88e5] transition">
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 text-xs sm:text-sm font-bold border-r border-slate-300 flex items-center">
                ৳
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.minDepositRequired}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    minDepositRequired: Math.max(0, Number(e.target.value) || 0),
                  }))
                }
                className="w-full bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                placeholder="0.00"
              />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 leading-normal">
              Minimum total deposit required to spin (0 for free for all players).
            </p>
          </div>
        </div>
      </div>

      {/* SLICES SECTION: DARK HEADER BAR */}
      <div className="bg-[#2e384d] text-white px-4 py-2.5 rounded-t-lg flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide">
          <Disc className="w-4 h-4 text-slate-300" />
          <span>Lucky Wheel Slices (8 Slices - Showing Figure vs Actual Credited Value)</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#00a884] hover:bg-[#008f70] text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Wheel Configuration</span>
        </button>
      </div>

      {/* 8 SLICES GRID (4 columns x 2 rows) */}
      <div className="bg-white border-x border-slate-200 p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slices.map((slice) => {
            return (
              <div
                key={slice.id}
                className="bg-white border border-slate-200 rounded-lg p-3 sm:p-3.5 shadow-xs flex flex-col gap-3 hover:border-slate-300 transition"
              >
                {/* Header: Slice Number & Win Prize */}
                <div className="flex items-center justify-between">
                  <span className="bg-[#1e293b] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    Slice #{slice.sliceNumber}
                  </span>
                  <span className="bg-[#0d9488] text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    Win Prize
                  </span>
                </div>

                {/* Active for Spin Winner Card / Checkbox */}
                <div
                  onClick={() => handleToggleActive(slice.id)}
                  className={`p-2 sm:p-2.5 rounded border flex items-center gap-2 cursor-pointer select-none transition-colors ${
                    slice.isActiveForWinner
                      ? 'bg-[#ecfdf5] border-[#86efac] text-[#15803d]'
                      : 'bg-[#fef2f2] border-[#fca5a5] text-[#b91c1c]'
                  }`}
                  title="ক্লিক করে এই স্লাইস বিজয়ী হিসেবে সক্রিয় অথবা নিষ্ক্রিয় করুন"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                      slice.isActiveForWinner
                        ? 'bg-[#15803d] text-white'
                        : 'bg-[#b91c1c] text-white'
                    }`}
                  >
                    {slice.isActiveForWinner ? '✓' : '✕'}
                  </div>
                  <span className="font-bold text-xs">
                    Active for Spin Winner
                  </span>
                </div>

                {/* Field 1: Showing Figure (৳) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#0284c7] mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Showing Figure (৳)</span>
                  </label>
                  <div className="flex rounded border border-slate-300 overflow-hidden focus-within:border-[#0284c7] transition">
                    <span className="bg-[#0284c7] text-white font-bold text-xs px-2.5 py-1.5 flex items-center justify-center">
                      ৳
                    </span>
                    <input
                      type="text"
                      value={slice.showingFigure}
                      onChange={(e) =>
                        handleUpdateSlice(slice.id, 'showingFigure', e.target.value)
                      }
                      className="w-full bg-white px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Field 2: Actual Credited Value (৳) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#059669] mb-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Actual Credited Value (৳)</span>
                  </label>
                  <div className="flex rounded border border-slate-300 overflow-hidden focus-within:border-[#059669] transition">
                    <span className="bg-[#059669] text-white font-bold text-xs px-2.5 py-1.5 flex items-center justify-center">
                      ৳
                    </span>
                    <input
                      type="text"
                      value={slice.actualCreditedValue}
                      onChange={(e) =>
                        handleUpdateSlice(
                          slice.id,
                          'actualCreditedValue',
                          e.target.value
                        )
                      }
                      className="w-full bg-white px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTION BAR: SAVE CHANGES & HOMEPAGE LINK */}
      <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>হোমপেজে ফিরে যান (Go to Homepage)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLiveWheelModal(true)}
            className="text-xs sm:text-sm font-bold text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-300 px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>লাইভ হুইল টেস্ট</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-[#00a884] hover:bg-[#008f70] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* ADMIN LIVE PREVIEW MODAL */}
      {showLiveWheelModal && (
        <LuckySpinnerWheelModal
          isOpen={showLiveWheelModal}
          onClose={() => setShowLiveWheelModal(false)}
          user={
            currentUser || {
              id: 'admin_preview',
              name: 'Admin Test User',
              phone: '01700000000',
              balance: 100,
              totalWon: 0,
              isLoggedIn: true,
              role: 'superadmin',
              status: 'active',
              createdAt: new Date().toISOString(),
            }
          }
          onClaimReward={(amount, title) => {
            alert(`টেস্ট স্পিন সম্পন্ন: ${title} (৳${amount})`);
          }}
        />
      )}
    </div>
  );
};
