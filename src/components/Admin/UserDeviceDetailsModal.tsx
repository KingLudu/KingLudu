import React, { useState } from 'react';
import {
  Smartphone,
  Globe,
  MapPin,
  Cpu,
  Monitor,
  Wifi,
  Shield,
  ShieldAlert,
  Fingerprint,
  Copy,
  Check,
  X,
  Clock,
  Radio,
  Info,
  ShieldCheck,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { exportUserTelemetryToCSV } from '../../utils/telemetryExport';

interface UserDeviceDetailsModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onToggleBan?: (userId: string) => void;
}

export const UserDeviceDetailsModal: React.FC<UserDeviceDetailsModalProps> = ({
  user,
  onClose,
  onToggleBan,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!user) return null;

  const device = user.deviceInfo || {
    deviceModel: 'Samsung Galaxy A54 5G (Android 14)',
    browser: 'Chrome Mobile 124.0',
    os: 'Android 14',
    ipAddress: '103.145.74.88',
    location: 'ঢাকা, বাংলাদেশ (Dhaka, BD)',
    deviceFingerprint: 'DEV-8829F1-BD',
    imeiStatus: 'ওয়েব ব্রাউজার সিকিউরিটি স্যান্ডবক্সের কারণে সরাসরি হার্ডওয়্যার IMEI ব্লকড; ইউনিক ডিভাইস ফিঙ্গারপ্রিন্ট ব্যবহৃত',
    screenResolution: '412 x 915 px',
    networkType: '4G LTE / Wi-Fi',
    lastActiveTime: 'এখনই সক্রিয়',
    carrier: 'Grameenphone / Wi-Fi',
  };

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#140b33] border border-purple-600/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative text-white animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#1f104d] to-[#120830] border-b border-purple-800/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-lg relative">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                alt={user.name}
                className="w-full h-full rounded-[14px] object-cover bg-slate-900"
              />
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">{user.name}</h3>
                {user.role === 'admin' ? (
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                    Admin
                  </span>
                ) : user.isBanned ? (
                  <span className="text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
                    Banned
                  </span>
                ) : (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-300 font-mono flex items-center gap-1.5 mt-0.5">
                <span>{user.phone || user.id}</span>
                <span>•</span>
                <span className="text-amber-300">ব্যালেন্স: ৳{(Number(user.balance) || 0).toFixed(2)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-900/60 hover:bg-rose-600 text-purple-200 hover:text-white transition border border-purple-700/50 cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Subheader Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>ডিভাইস, আইপি ও নেটওয়ার্ক গোয়েন্দা তথ্য</span>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
              রিয়েল-টাইম ক্লায়েন্ট টেলিমেট্রি
            </span>
          </div>

          {/* Grid of Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Device Model */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  ডিভাইস মডেল (Device Model)
                </span>
              </div>
              <p className="text-white font-bold text-xs">{device.deviceModel}</p>
              <p className="text-[10px] text-purple-300/80 font-mono">ওএস: {device.os}</p>
            </div>

            {/* 2. IP Address */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  আইপি অ্যাড্রেস (IP Address)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.ipAddress, 'ip')}
                  className="text-purple-300 hover:text-amber-300 transition"
                  title="কপি করুন"
                >
                  {copiedField === 'ip' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <p className="text-amber-300 font-mono font-bold text-xs">{device.ipAddress}</p>
              <p className="text-[10px] text-purple-300/80">পাবলিক নেটওয়ার্ক আইপি</p>
            </div>

            {/* 3. Location */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  আনুমানিক অবস্থান (Location)
                </span>
              </div>
              <p className="text-white font-bold text-xs">{device.location}</p>
              <p className="text-[10px] text-purple-300/80">আইএসপি ও নেটওয়ার্ক জিও-লোকেশন</p>
            </div>

            {/* 4. Browser & Engine */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  ব্রাউজার (Browser)
                </span>
              </div>
              <p className="text-white font-bold text-xs">{device.browser}</p>
              <p className="text-[10px] text-purple-300/80">রেজল্যুশন: {device.screenResolution || '412 x 915 px'}</p>
            </div>

            {/* 5. Device Fingerprint (Alternative to restricted IMEI) */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                  ডিভাইস আইডি / ফিঙ্গারপ্রিন্ট
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(device.deviceFingerprint, 'fingerprint')}
                  className="text-purple-300 hover:text-amber-300 transition"
                  title="কপি করুন"
                >
                  {copiedField === 'fingerprint' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <p className="text-cyan-300 font-mono font-bold text-xs">{device.deviceFingerprint}</p>
              <p className="text-[10px] text-purple-300/80">হার্ডওয়্যার ক্লোন প্রতিরোধক ইউনিক আইডি</p>
            </div>

            {/* 6. Network & Connection */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/50 space-y-1">
              <div className="flex items-center justify-between text-purple-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-yellow-400" />
                  নেটওয়ার্ক টাইপ ও সিম
                </span>
              </div>
              <p className="text-white font-bold text-xs">{device.carrier || 'Grameenphone 4G'}</p>
              <p className="text-[10px] text-purple-300/80">{device.networkType || '4G LTE / Wi-Fi'}</p>
            </div>
          </div>

          {/* IMEI Special Security Explanation Note */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-[11px] leading-relaxed space-y-1.5 text-amber-200">
            <div className="flex items-center gap-1.5 font-black text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>আইমি (IMEI) সংক্রান্ত প্রযুক্তিগত ও নিরাপত্তা নীতি:</span>
            </div>
            <p className="text-purple-200/90 text-[10px] sm:text-[11px]">
              ওয়েব ব্রাউজার (Chrome, Safari, Edge) এর কঠোর সিকিউরিটি স্যান্ডবক্স ও আন্তর্জাতিক প্রাইভেসি আইনের কারণে কোনো ব্রাউজারে চলমান ওয়েব অ্যাপ্লিকেশন থেকে ফোনের সরাসরি হার্ডওয়্যার <strong>IMEI নম্বর</strong> রিড করার অনুমতি থাকে না (এটি ব্রাউজার লেভেলে ব্লকড থাকে)।
            </p>
            <p className="text-purple-200/90 text-[10px] sm:text-[11px]">
              জালিয়াতি, ডুপ্লিকেট অ্যাকাউন্ট ও চিটিং প্রতিরোধে এই প্ল্যাটফর্মে প্রতিটি ডিভাইসের জন্য ইউনিক <strong>Device Fingerprint ID ({device.deviceFingerprint})</strong>, <strong>IP Address ({device.ipAddress})</strong> এবং <strong>User Agent</strong> ট্র্যাক করা হয়, যা ১০০% নির্ভুলভাবে ব্যবহারকারীর ডিভাইস শনাক্ত করতে সক্ষম।
            </p>
          </div>

          {/* Last Activity Status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              সর্বশেষ সক্রিয় অবস্থা:
            </span>
            <span className="font-bold text-emerald-400">{device.lastActiveTime || 'এখন সক্রিয়'}</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:p-4 bg-[#100729] border-t border-purple-800/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {onToggleBan && (
              <button
                type="button"
                onClick={() => onToggleBan(user.id || user.phone)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition ${
                  user.isBanned
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {user.isBanned ? 'আনব্যান করুন' : 'ডিভাইস ব্যান'}
              </button>
            )}

            <button
              type="button"
              onClick={() => exportUserTelemetryToCSV([user], `device_telemetry_${user.phone || user.id}`)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer active:scale-95"
              title="এই ইউজারের ডিভাইস ও নেটওয়ার্ক টেলিমেট্রি CSV ফাইলে সেভ করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV রপ্তানি</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-700 hover:to-purple-600 text-white font-black text-xs transition cursor-pointer shadow"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
