import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Wallet,
  Users,
  Gamepad2,
  Briefcase,
  Crown,
  Disc,
  Share2,
  Settings,
  Headset,
  Bell,
  Bot,
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  Volume2,
  Image,
  Sliders,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  X
} from 'lucide-react';
import { UserProfile, Transaction, AppSettings, BroadcastNotification, LiveChatMessage, MatchHistoryItem } from '../../types';
import { AdminStatisticsCharts } from './AdminStatisticsCharts';

export interface AllSystemsHomePageViewProps {
  currentUser: UserProfile;
  registeredUsers: UserProfile[];
  transactions: Transaction[];
  appSettings: AppSettings;
  sentNotifications?: BroadcastNotification[];
  liveChatMessages?: LiveChatMessage[];
  matchHistory?: MatchHistoryItem[];
  pendingDeposits: Transaction[];
  pendingWithdrawals: Transaction[];
  onNavigateTab: (
    tab:
      | 'overview'
      | 'vip_cashback'
      | 'spinner_wheel'
      | 'finance'
      | 'users_roles'
      | 'game_system'
      | 'agent_config'
      | 'affiliate_system'
      | 'site_config'
      | 'support'
      | 'requests'
      | 'users'
      | 'payments'
      | 'live_chat'
      | 'notices'
      | 'game'
      | 'home_programs',
    subTab?: string
  ) => void;
  onNavigatePlayerHome: () => void;
  onUpdateAppSettings: (settings: AppSettings) => void;
  onPlayTone?: (toneId?: string) => void;
  setUserSearch: (term: string) => void;
  setTrxFilterType: (type: 'all' | 'deposit' | 'withdraw') => void;
  setTrxFilterStatus: (status: 'all' | 'Pending' | 'Success' | 'Failed') => void;
}

type SystemCategory = 'all' | 'finance' | 'games' | 'users' | 'core';

export const AllSystemsHomePageView: React.FC<AllSystemsHomePageViewProps> = ({
  currentUser,
  registeredUsers = [],
  transactions = [],
  appSettings,
  sentNotifications = [],
  liveChatMessages = [],
  matchHistory = [],
  pendingDeposits = [],
  pendingWithdrawals = [],
  onNavigateTab,
  onNavigatePlayerHome,
  onUpdateAppSettings,
  onPlayTone,
  setUserSearch,
  setTrxFilterType,
  setTrxFilterStatus,
}) => {
  const safeRegisteredUsers = Array.isArray(registeredUsers) ? registeredUsers : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safePendingDeposits = Array.isArray(pendingDeposits) ? pendingDeposits : [];
  const safePendingWithdrawals = Array.isArray(pendingWithdrawals) ? pendingWithdrawals : [];
  const safeLiveChatMessages = Array.isArray(liveChatMessages) ? liveChatMessages : [];
  const safeSentNotifications = Array.isArray(sentNotifications) ? sentNotifications : [];
  const safeMatchHistory = Array.isArray(matchHistory) ? matchHistory : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SystemCategory>('all');
  const [userSearchText, setUserSearchText] = useState('');
  const [viewAnalytics, setViewAnalytics] = useState(true);

  // Financial calculations
  const totalUsersCount = safeRegisteredUsers.length;
  const totalUserBalance = useMemo(
    () => safeRegisteredUsers.reduce((sum, u) => sum + (Number(u.balance) || 0), 0),
    [safeRegisteredUsers]
  );
  const totalDepositsVolume = useMemo(
    () =>
      safeTransactions
        .filter((t) => t.type === 'deposit' && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safeTransactions]
  );
  const totalWithdrawalsVolume = useMemo(
    () =>
      safeTransactions
        .filter((t) => t.type === 'withdraw' && t.status === 'Success')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [safeTransactions]
  );

  const pendingCount = safePendingDeposits.length + safePendingWithdrawals.length;
  const unreadChatCount = safeLiveChatMessages.filter((m) => !m.isAdmin && m.unread).length;

  // Filtered users for quick search
  const filteredUsers = useMemo(() => {
    if (!userSearchText.trim()) return [];
    const query = userSearchText.toLowerCase();
    return safeRegisteredUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.phone?.includes(query) ||
        u.id?.toLowerCase().includes(query)
    );
  }, [userSearchText, safeRegisteredUsers]);

  // All 13 Systems Directory Data
  const systemsList = useMemo(() => {
    return [
      {
        id: 'finance',
        title: 'ফাইন্যান্স ম্যানেজমেন্ট সিস্টেম',
        enTitle: 'Finance Management System',
        category: 'finance' as SystemCategory,
        icon: Wallet,
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        badge: pendingCount > 0 ? `${pendingCount} রিকোয়েস্ট পেন্ডিং` : 'সক্রিয় (Active)',
        badgeColor: pendingCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        description: 'ডিপোজিট, ক্যাশআউট, ট্রানজাকশন লেজার, এজেন্ট ও গেম লেনদেন নিয়ন্ত্রণ।',
        metrics: [
          { label: 'মোট ডিপোজিট', value: `৳${totalDepositsVolume.toLocaleString()}` },
          { label: 'মোট উইথড্রল', value: `৳${totalWithdrawalsVolume.toLocaleString()}` },
          { label: 'পেন্ডিং', value: `${pendingCount} টি` },
        ],
        subItems: [
          { label: 'ডিপোজিট', key: 'deposits', badge: safePendingDeposits.length > 0 ? safePendingDeposits.length : undefined },
          { label: 'উইথড্রল', key: 'withdrawals', badge: safePendingWithdrawals.length > 0 ? safePendingWithdrawals.length : undefined },
          { label: 'সব লেনদেন', key: 'all_transactions' },
          { label: 'এজেন্ট লেনদেন', key: 'agent_trans' },
          { label: 'গেম লেনদেন', key: 'game_trans' },
        ],
        actionLabel: 'ফাইন্যান্স সিস্টেমে যান',
        onOpen: (sub?: string) => onNavigateTab('finance', sub || 'deposits'),
      },
      {
        id: 'users_roles',
        title: 'ইউজার্স ও রোল ম্যানেজমেন্ট',
        enTitle: 'Users & Roles System',
        category: 'users' as SystemCategory,
        icon: Users,
        iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
        badge: `${totalUsersCount} প্লেয়ার্স`,
        badgeColor: 'bg-indigo-950 text-indigo-300 border border-indigo-700/50',
        description: 'প্লেয়ার প্রোফাইল, ব্যালেন্স এডিট, এজেন্ট একাউন্ট, ডিপোজিট লেভেল ও এডমিন রোলস।',
        metrics: [
          { label: 'মোট প্লেয়ার', value: `${totalUsersCount} জন` },
          { label: 'মোট ব্যালেন্স', value: `৳${totalUserBalance.toLocaleString()}` },
          { label: 'স্ট্যাটাস', value: 'অনলাইন' },
        ],
        subItems: [
          { label: 'প্লেয়ার তালিকা', key: 'players' },
          { label: 'এজেন্ট তালিকা', key: 'agents' },
          { label: 'ডিপোজিট লেভেল', key: 'deposit_levels' },
          { label: 'ভিআইপি টিয়ার্স', key: 'vip_tiers' },
          { label: 'রোল ও পারমিশন', key: 'roles_perms' },
          { label: 'এডমিনস', key: 'admins' },
        ],
        actionLabel: 'ইউজার সিস্টেমে যান',
        onOpen: (sub?: string) => onNavigateTab('users_roles', sub || 'players'),
      },
      {
        id: 'game_system',
        title: 'গেম ক্যাটাগরি ও ইঞ্জিন সিস্টেম',
        enTitle: 'Game Categories & Engine System',
        category: 'games' as SystemCategory,
        icon: Gamepad2,
        iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
        badge: 'kindlud, স্লট, ক্যাসিনো, স্পোর্টস',
        badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700/50',
        description: 'kindlud (কিং লুডো), স্লট, লাইভ ক্যাসিনো ও স্পোর্টস ক্যাটাগরি, গেমস V1/V2, এরর সমাধান ও প্রোভাইডার্স।',
        metrics: [
          { label: 'ক্যাটাগরি', value: '৪টি অফিসিয়াল' },
          { label: 'সচল গেমস', value: '১২+ গেমস' },
          { label: 'ইঞ্জিন ক্লাস্টার', value: 'অনলাইন' },
        ],
        subItems: [
          { label: 'কিং লুডো ইঞ্জিন ক্যাটাগরি', key: 'categories' },
          { label: 'গেমস (V1)', key: 'games_v1' },
          { label: 'গেমস (V2)', key: 'games_v2' },
          { label: 'স্পিনার হুইল', key: 'spinner' },
          { label: 'প্রোভাইডার্স', key: 'providers_v1' },
          { label: 'এরর লগ', key: 'game_errors' },
        ],
        actionLabel: 'গেম সিস্টেমে যান',
        onOpen: (sub?: string) => onNavigateTab('game_system', sub || 'categories'),
      },
      {
        id: 'vip_cashback',
        title: 'ভিআইপি ও ক্যাশব্যাক পলিসি',
        enTitle: 'VIP Loyalty & Cashback Program',
        category: 'finance' as SystemCategory,
        icon: Crown,
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        badge: 'PRO টিয়ার্স',
        badgeColor: 'bg-amber-400 text-slate-950 font-black',
        description: 'ব্রোঞ্জ থেকে ডায়মন্ড ৬টি ভিআইপি লেভেল, রিয়েল-টাইম ক্যাশব্যাক ও লেভেল আপ রিওয়ার্ড।',
        metrics: [
          { label: 'টিয়ার সংখ্যা', value: '৬ টি' },
          { label: 'ক্যাশব্যাক রেঞ্জ', value: '১% - ৫%' },
          { label: 'রিওয়ার্ডস', value: 'দৈনিক ও মাসিক' },
        ],
        subItems: [
          { label: 'ব্রোঞ্জ টিয়ার', key: 'bronze' },
          { label: 'সিলভার টিয়ার', key: 'silver' },
          { label: 'গোল্ড টিয়ার', key: 'gold' },
          { label: 'ডায়মন্ড টিয়ার', key: 'diamond' },
        ],
        actionLabel: 'ভিআইপি ক্যাশব্যাক পলিসি',
        onOpen: () => onNavigateTab('vip_cashback'),
      },
      {
        id: 'spinner_wheel',
        title: 'স্পিনার হুইল / ভাগ্যের চাকা',
        enTitle: 'Lucky Spinner Wheel Config',
        category: 'games' as SystemCategory,
        icon: Disc,
        iconBg: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
        badge: 'HOT রিওয়ার্ড',
        badgeColor: 'bg-pink-500 text-white font-bold',
        description: 'দৈনিক স্পিন স্লাইস, রিওয়ার্ড এমাউন্ট, সম্ভাব্যতা রেট (Probability) ও জ্যাকপট পুরস্কার।',
        metrics: [
          { label: 'স্লাইস সংখ্যা', value: '৮ টি স্লট' },
          { label: 'সর্বোচ্চ উপহার', value: '৳৫,০০০' },
          { label: 'কুলডাউন', value: '২৪ ঘণ্টা' },
        ],
        subItems: [
          { label: 'স্লাইস সেটিংস', key: 'slices' },
          { label: 'প্রোব্যাবিলিটি', key: 'odds' },
          { label: 'জ্যাকপট রেট', key: 'jackpot' },
        ],
        actionLabel: 'স্পিনার কনফিগার করুন',
        onOpen: () => onNavigateTab('spinner_wheel'),
      },
      {
        id: 'agent_config',
        title: 'এজেন্ট ব্যাংকিং কনফিগারেশন',
        enTitle: 'Agent Banking & Numbers Config',
        category: 'finance' as SystemCategory,
        icon: Briefcase,
        iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        badge: 'এজেন্ট নেটওয়ার্ক',
        badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-700/50',
        description: 'ডিপোজিট ও ক্যাশআউটের জন্য অনুমোদিত এজেন্ট নম্বর ও পেমেন্ট মেথড পরিচালনা।',
        metrics: [
          { label: 'বিকাশ নম্বর', value: appSettings.bkashNumber || 'অনুমোদিত' },
          { label: 'নগদ নম্বর', value: appSettings.nagadNumber || 'অনুমোদিত' },
          { label: 'Binance Pay', value: appSettings.binancePayId || 'অ্যাক্টিভ' },
        ],
        subItems: [
          { label: 'এজেন্ট নম্বর', key: 'agent_generic_numbers' },
          { label: 'পেমেন্ট মেথডস', key: 'agent_payment_methods' },
        ],
        actionLabel: 'এজেন্ট কনফিগে যান',
        onOpen: (sub?: string) => onNavigateTab('agent_config', sub || 'agent_generic_numbers'),
      },
      {
        id: 'affiliate_system',
        title: 'অ্যাফিলিয়েট ও রেফারেল নেটওয়ার্ক',
        enTitle: 'Affiliate & Referral System',
        category: 'users' as SystemCategory,
        icon: Share2,
        iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        badge: 'কমিশন হাব',
        badgeColor: 'bg-blue-950 text-blue-300 border border-blue-700/50',
        description: 'রেফারেল বোনাস রেট, অ্যাফিলিয়েট পার্টনার্স তালিকা এবং কমিশন আয়ের হিস্ট্রি।',
        metrics: [
          { label: 'রেফার বোনাস', value: `৳${appSettings.referralBonus}` },
          { label: 'কমিশন মডেল', value: 'লাইফটাইম' },
          { label: 'ট্র্যাকিং', value: 'অটোমেটিক' },
        ],
        subItems: [
          { label: 'অ্যাফিলিয়েট সেটিংস', key: 'affiliate_settings' },
          { label: 'পার্টনার্স তালিকা', key: 'affiliate_list' },
          { label: 'কমিশন হিস্ট্রি', key: 'affiliate_commissions' },
        ],
        actionLabel: 'অ্যাফিলিয়েট সিস্টেমে যান',
        onOpen: (sub?: string) => onNavigateTab('affiliate_system', sub || 'affiliate_list'),
      },
      {
        id: 'support',
        title: '২৪/৭ লাইভ সাপোর্ট ও হেল্পডেস্ক',
        enTitle: 'Customer Support & Helpdesk',
        category: 'core' as SystemCategory,
        icon: Headset,
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        badge: unreadChatCount > 0 ? `${unreadChatCount} নতুন চ্যাট` : '২৪/৭ অনলাইন',
        badgeColor: unreadChatCount > 0 ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50',
        description: 'গ্রাহক সেবা, লাইভ চ্যাট মেসেজিং, ছবি প্রেরণ, কুইক রেসপন্স এবং হেল্পডেস্ক টিকিট।',
        metrics: [
          { label: 'মোট চ্যাট', value: `${safeLiveChatMessages.length} মেসেজ` },
          { label: 'রেসপন্স টাইম', value: '< ১ মিনিট' },
          { label: 'হেল্পডেস্ক', value: 'সক্রিয়' },
        ],
        subItems: [
          { label: 'লাইভ চ্যাট', key: 'live_chat' },
          { label: 'সাপোর্ট টিকিট', key: 'tickets' },
          { label: 'ক্যান্ড রিপ্লাই', key: 'canned_replies' },
        ],
        actionLabel: 'সাপোর্ট সেন্টারে যান',
        onOpen: (sub?: string) => onNavigateTab('support', sub || 'live_chat'),
      },
      {
        id: 'site_config',
        title: 'সাইট ও কোর কনফিগারেশন',
        enTitle: 'Site & Core Infrastructure Config',
        category: 'core' as SystemCategory,
        icon: Settings,
        iconBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        badge: 'সিস্টেম কোর',
        badgeColor: 'bg-slate-900 text-slate-300 border border-slate-700/50',
        description: 'এসএমএস ও ইমেইল গেটওয়ে, ডেটাবেস অপ্টিমাইজেশন, ওয়ালেট লিমিট ও মার্কেটিং ব্যানার।',
        metrics: [
          { label: 'এসএমএস গেটওয়ে', value: 'কানেক্টেড' },
          { label: 'ডেটাবেস', value: 'অপ্টিমাইজড' },
          { label: 'ওয়ালেট কনফিগ', value: 'সক্রিয়' },
        ],
        subItems: [
          { label: 'জেনারেল', key: 'site_general' },
          { label: 'SMS ও ইমেইল', key: 'site_sms_email' },
          { label: 'ডেটাবেস', key: 'site_database' },
          { label: 'ওয়ালেট কনফিগ', key: 'site_wallet_config' },
          { label: 'অ্যাপ ব্যানার', key: 'site_app_banners' },
          { label: 'অ্যাডভার্টাইজমেন্ট', key: 'site_interstitial_ads' },
          { label: 'সোশ্যাল মিডিয়া', key: 'site_social_media' },
        ],
        actionLabel: 'সাইট কনফিগে যান',
        onOpen: (sub?: string) => onNavigateTab('site_config', sub || 'site_general'),
      },
      {
        id: 'home_programs',
        title: 'হোম পেজ ও ব্যানার প্রোগ্রাম',
        enTitle: 'Home Screen Layout & Banners',
        category: 'core' as SystemCategory,
        icon: Image,
        iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        badge: 'লেআউট কন্ট্রোল',
        badgeColor: 'bg-yellow-950 text-yellow-300 border border-yellow-700/50',
        description: 'প্লেয়ার হোম স্ক্রিনের স্লাইডিং ব্যানার, মার্কি নোটিশ, গেম কার্ড শোকেস ও ভিজ্যুয়াল স্টাইল।',
        metrics: [
          { label: 'ব্যানার স্লাইডার', value: appSettings.showBanners !== false ? 'চালু' : 'বন্ধ' },
          { label: 'স্ক্রোল স্পিড', value: `${appSettings.bannerAutoSlideSeconds || 5}s` },
          { label: 'ইউআই মোড', value: 'ভিআইপি ডার্ক' },
        ],
        subItems: [
          { label: 'ব্যানার স্লাইডার', key: 'banners' },
          { label: 'মার্কি টেক্সট', key: 'marquee' },
          { label: 'লেআউট গ্রিড', key: 'grid' },
        ],
        actionLabel: 'হোম প্রোগ্রাম ম্যানেজারে যান',
        onOpen: () => onNavigateTab('home_programs'),
      },
      {
        id: 'notices',
        title: 'পুশ অ্যালার্ট ও নোটিশ সিস্টেম',
        enTitle: 'Push Broadcast & Notice System',
        category: 'core' as SystemCategory,
        icon: Bell,
        iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        badge: 'লাইভ ব্রডকাস্ট',
        badgeColor: 'bg-orange-950 text-orange-300 border border-orange-700/50',
        description: 'সকল প্লেয়ারদের কাছে পপ-আপ মেসেজ পাঠানো, জরুরী ঘোষণা এবং মার্কি স্ক্রল বার্তা।',
        metrics: [
          { label: 'প্রেরিত নোটিশ', value: `${safeSentNotifications.length} টি` },
          { label: 'পপ-আপ সিস্টেম', value: 'সক্রিয়' },
          { label: 'ডেলিভারি', value: 'ইনস্ট্যান্ট' },
        ],
        subItems: [
          { label: 'নতুন নোটিশ প্রেরণ', key: 'create' },
          { label: 'হিস্ট্রি ও ডিলিট', key: 'history' },
        ],
        actionLabel: 'নোটিশ সিস্টেমে যান',
        onOpen: () => onNavigateTab('notices'),
      },
      {
        id: 'game',
        title: 'লুডো ম্যাচ রুলস ও এআই বট ইঞ্জিন',
        enTitle: 'Ludo Match Rules & Bot Engine',
        category: 'games' as SystemCategory,
        icon: Bot,
        iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        badge: `${appSettings.platformCommissionPercent}% ফি`,
        badgeColor: 'bg-rose-950 text-rose-300 border border-rose-700/50',
        description: 'লুডো ২/৪ প্লেয়ার ম্যাচ ফি, কমিশন পার্সেন্টেজ, বট প্লেয়ার ডিফিকাল্টি ও বোর্ড রুলস।',
        metrics: [
          { label: 'কমিশন ফি', value: `${appSettings.platformCommissionPercent}%` },
          { label: 'বট এআই', value: 'স্মার্ট টার্ন' },
          { label: 'ম্যাচ হিস্ট্রি', value: `${safeMatchHistory.length} টি সংরক্ষিত` },
        ],
        subItems: [
          { label: 'কমিশন সেটিংস', key: 'commission' },
          { label: 'এআই বট কন্ট্রোল', key: 'bot' },
          { label: 'ম্যাচ হিস্ট্রি', key: 'history' },
        ],
        actionLabel: 'ম্যাচ রুলস ম্যানেজারে যান',
        onOpen: () => onNavigateTab('game'),
      },
      {
        id: 'requests',
        title: 'পেন্ডিং ও রিকোয়েস্ট হাব',
        enTitle: 'Pending Requests Action Hub',
        category: 'finance' as SystemCategory,
        icon: AlertTriangle,
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        badge: pendingCount > 0 ? `${pendingCount} অ্যাকশন দরকার` : 'সব ক্লিয়ার',
        badgeColor: pendingCount > 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50',
        description: 'ডিপোজিট ও ক্যাশআউট রিকোয়েস্ট যাচাই, এক ক্লিকে এপ্রুভ বা রিজেক্ট এবং ট্রানজাকশন ফিল্টার।',
        metrics: [
          { label: 'পেন্ডিং ডিপোজিট', value: `${safePendingDeposits.length} টি` },
          { label: 'পেন্ডিং উইথড্র', value: `${safePendingWithdrawals.length} টি` },
          { label: 'বাল্ক একশন', value: 'সক্রিয়' },
        ],
        subItems: [
          { label: 'ডিপোজিট রিকোয়েস্ট', key: 'deposits', badge: safePendingDeposits.length },
          { label: 'উইথড্র রিকোয়েস্ট', key: 'withdrawals', badge: safePendingWithdrawals.length },
        ],
        actionLabel: 'রিকোয়েস্ট হাবে যান',
        onOpen: () => onNavigateTab('requests'),
      },
    ];
  }, [
    pendingCount,
    totalUsersCount,
    totalUserBalance,
    totalDepositsVolume,
    totalWithdrawalsVolume,
    appSettings,
    unreadChatCount,
    safeLiveChatMessages.length,
    safeSentNotifications.length,
    safeMatchHistory.length,
    safePendingDeposits.length,
    safePendingWithdrawals.length,
    onNavigateTab,
  ]);

  // Filtered systems based on category & search query
  const filteredSystems = useMemo(() => {
    return systemsList.filter((sys) => {
      const matchesCat = selectedCategory === 'all' || sys.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sys.title.toLowerCase().includes(q) ||
        sys.enTitle.toLowerCase().includes(q) ||
        sys.description.toLowerCase().includes(q) ||
        sys.subItems.some((s) => s.label.toLowerCase().includes(q))
      );
    });
  }, [systemsList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ================= HERO MASTER SYSTEM BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1b0d44] via-[#130733] to-[#0a031e] p-4 sm:p-5 rounded-3xl border border-purple-700/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>মাস্টার কন্ট্রোল প্যানেল</span>
              </span>
              <span className="text-xs text-purple-300 font-mono">
                {systemsList.length}টি সিস্টেম ফুল কানেক্টেড
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>সব সিস্টেম হোম পেজ</span>
              <span className="text-amber-400 text-sm font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-xl border border-amber-500/30">
                All Systems Hub
              </span>
            </h1>

            <p className="text-xs text-purple-200/90 max-w-2xl leading-relaxed">
              লুডো ক্লাব ও গেমিং প্ল্যাটফর্মের ফাইন্যান্স, ইউজার্স, গেম ইঞ্জিন, স্পিনার, ক্যাশব্যাক, এজেন্ট ব্যাংকিং এবং কোর কনফিগারেশন — এক নজরে সমস্ত সিস্টেম মনিটর ও পরিচালনা করুন।
            </p>
          </div>

          {/* Quick Actions at Top */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateTab('requests')}
              className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>পেন্ডিং রিকোয়েস্ট ({pendingCount})</span>
            </button>

            <button
              type="button"
              onClick={onNavigatePlayerHome}
              className="px-3 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white rounded-xl text-xs font-bold border border-purple-700/60 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>প্লেয়ার হোম দেখুন</span>
            </button>
          </div>
        </div>

        {/* Live Server & Microservice Health Status Ribbon */}
        <div className="mt-4 pt-3.5 border-t border-purple-900/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">কোর ডেটাবেস</span>
              <span className="font-bold text-white font-mono">অনলাইন (১২ms)</span>
            </div>
          </div>

          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">পেমেন্ট গেটওয়ে</span>
              <span className="font-bold text-emerald-300">বিকাশ / নগদ সচল</span>
            </div>
          </div>

          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">লুডো রুম ইঞ্জিন</span>
              <span className="font-bold text-cyan-300">লাইভ (Smart Bot)</span>
            </div>
          </div>

          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">লাইভ চ্যাট সিঙ্ক</span>
              <span className="font-bold text-purple-200">অটো রেসপন্স সচল</span>
            </div>
          </div>

          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">ভিআইপি ক্যাশব্যাক</span>
              <span className="font-bold text-amber-300">৬টি লেভেল সক্রিয়</span>
            </div>
          </div>

          <div className="bg-[#031e0c]/80 p-2 rounded-xl border border-purple-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[9px] uppercase">লাকি স্পিনার</span>
              <span className="font-bold text-pink-300">৮টি স্লট অ্যাক্টিভ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KEY PLATFORM METRICS SUMMARY ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div
          onClick={() => onNavigateTab('users_roles', 'players')}
          className="bg-[#052a12] hover:bg-[#1a1142] p-3.5 rounded-2xl border border-purple-700/50 hover:border-purple-500 transition cursor-pointer space-y-1 shadow-lg group"
        >
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[11px] font-bold">মোট নিবন্ধিত ইউজার</span>
            <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-xl font-black text-white font-mono">{totalUsersCount}</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-400">অ্যাক্টিভ প্লেয়ার্স</span>
            <span className="text-purple-400 flex items-center gap-0.5 group-hover:text-amber-300 transition">
              <span>ম্যানেজ</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('users_roles', 'players')}
          className="bg-[#052a12] hover:bg-[#1a1142] p-3.5 rounded-2xl border border-purple-700/50 hover:border-purple-500 transition cursor-pointer space-y-1 shadow-lg group"
        >
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[11px] font-bold">মোট ওয়ালেট ব্যালেন্স</span>
            <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-xl font-black text-amber-300 font-mono">৳{totalUserBalance.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-purple-300">প্লেয়ার ডিপোজিট পুল</span>
            <span className="text-purple-400 flex items-center gap-0.5 group-hover:text-amber-300 transition">
              <span>ডিটেইলস</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            setTrxFilterType('deposit');
            setTrxFilterStatus('Pending');
            onNavigateTab('requests');
          }}
          className="bg-[#052a12] hover:bg-[#1a1142] p-3.5 rounded-2xl border border-purple-700/50 hover:border-emerald-500 transition cursor-pointer space-y-1 shadow-lg group"
        >
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[11px] font-bold">মোট ডিপোজিট ভলিউম</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-xl font-black text-emerald-400 font-mono">৳{totalDepositsVolume.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-400/90">পেন্ডিং: {safePendingDeposits.length} টি</span>
            <span className="text-purple-400 flex items-center gap-0.5 group-hover:text-emerald-300 transition">
              <span>এপ্রুভ করুন</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            setTrxFilterType('withdraw');
            setTrxFilterStatus('Pending');
            onNavigateTab('requests');
          }}
          className="bg-[#052a12] hover:bg-[#1a1142] p-3.5 rounded-2xl border border-purple-700/50 hover:border-rose-500 transition cursor-pointer space-y-1 shadow-lg group"
        >
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-[11px] font-bold">মোট উইথড্রল পেআউট</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
          </div>
          <p className="text-xl font-black text-rose-400 font-mono">৳{totalWithdrawalsVolume.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-rose-400/90">পেন্ডিং: {safePendingWithdrawals.length} টি</span>
            <span className="text-purple-400 flex items-center gap-0.5 group-hover:text-rose-300 transition">
              <span>পেআউট দিন</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & CATEGORY FILTER BAR ================= */}
      <div className="bg-[#11072b] p-3 sm:p-3.5 rounded-2xl border border-purple-800/60 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Real-time System Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="যেকোনো সিস্টেম খুঁজুন (যেমন: ফাইন্যান্স, বিকাশ, স্পিনার, ক্যাশব্যাক, ব্যানার, লুডো, এজেন্ট)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-purple-400/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick System Count Tag */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-purple-300 bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-800/50 font-bold">
              প্রদর্শিত সিস্টেম: <strong className="text-amber-400">{filteredSystems.length}</strong> / {systemsList.length} টি
            </span>
            <button
              type="button"
              onClick={() => setViewAnalytics(!viewAnalytics)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                viewAnalytics
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                  : 'bg-purple-900/60 text-purple-300 border-purple-700/60 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{viewAnalytics ? 'চার্ট হাইড করুন' : 'চার্ট দেখুন'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: '🌟 সমস্ত সিস্টেম (All 13)', count: systemsList.length },
            { id: 'finance', label: '💳 ফাইন্যান্স ও পেমেন্টস', count: systemsList.filter((s) => s.category === 'finance').length },
            { id: 'games', label: '🎮 গেম ও এন্টারটেইনমেন্ট', count: systemsList.filter((s) => s.category === 'games').length },
            { id: 'users', label: '👥 ইউজার্স ও নেটওয়ার্ক', count: systemsList.filter((s) => s.category === 'users').length },
            { id: 'core', label: '⚙️ কোর ও সাপোর্ট', count: systemsList.filter((s) => s.category === 'core').length },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as SystemCategory)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                    : 'bg-[#180e38] text-purple-300 hover:text-white hover:bg-purple-900/40 border border-purple-800/40'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-purple-950 text-purple-300'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ALL SYSTEMS DIRECTORY GRID ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-amber-400" />
            <span>সিস্টেম লঞ্চপ্যাড ডিরেক্টরি (All System Hub)</span>
          </h3>
          <span className="text-[11px] text-purple-400">
            সরাসরি যে কোন সিস্টেমে প্রবেশ করতে কার্ডে ক্লিক করুন
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSystems.map((sys) => {
            const IconComp = sys.icon;
            return (
              <div
                key={sys.id}
                className="bg-[#140b36] hover:bg-[#180e40] rounded-2xl border border-purple-800/50 hover:border-amber-400/60 p-4 transition-all duration-200 shadow-xl flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Light Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-600/30 to-transparent group-hover:via-amber-400/50 transition-all" />

                <div className="space-y-3">
                  {/* Card Header: Icon, Title & Badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${sys.iconBg}`}>
                        <IconComp className="w-5 h-5 group-hover:scale-110 transition" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition">
                          {sys.title}
                        </h4>
                        <p className="text-[10px] text-purple-400 font-mono truncate max-w-[180px]">
                          {sys.enTitle}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg shrink-0 ${sys.badgeColor}`}>
                      {sys.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-purple-200/80 leading-relaxed min-h-[36px]">
                    {sys.description}
                  </p>

                  {/* Metrics Snapshot Bar */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#031e0c] border border-purple-900/60 text-center">
                    {sys.metrics.map((m, mIdx) => (
                      <div key={`sys-metric-${sys.id}-${mIdx}`} className="truncate px-0.5">
                        <span className="text-[9px] text-slate-400 block truncate">{m.label}</span>
                        <span className="text-[11px] font-bold text-amber-300 font-mono truncate block">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Sub-items Quick Links (Chips) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      সরাসরি সাব-প্রোগ্রাম:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sys.subItems.map((sub, sIdx) => (
                        <button
                          key={`sub-chip-${sys.id}-${sub.key || sIdx}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sys.onOpen(sub.key);
                          }}
                          className="px-2 py-1 bg-purple-950/80 hover:bg-purple-800 text-purple-200 hover:text-white rounded-lg text-[10px] font-medium border border-purple-800/40 hover:border-amber-400/50 transition cursor-pointer flex items-center gap-1"
                        >
                          <span>{sub.label}</span>
                          {sub.badge !== undefined && sub.badge > 0 && (
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Main Action Button */}
                <div className="pt-3.5 mt-3.5 border-t border-purple-900/50 flex items-center justify-between">
                  <span className="text-[10px] text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>ফুল কন্ট্রোল</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => sys.onOpen()}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-amber-400 hover:to-amber-500 text-purple-200 hover:text-slate-950 rounded-xl text-xs font-bold border border-purple-700/60 hover:border-amber-400 shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{sys.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= INTERACTIVE CHARTS (CONDITIONAL) ================= */}
      {viewAnalytics && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-purple-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>প্ল্যাটফর্ম ট্রানজাকশন ও অ্যাক্টিভিটি ট্রেন্ড (Platform Analytics)</span>
            </h3>
            <span className="text-[10px] text-purple-400 font-mono">লাইভ ডেটাবেস সিঙ্ক</span>
          </div>
          <AdminStatisticsCharts
            transactions={transactions}
            registeredUsers={registeredUsers}
          />
        </div>
      )}

      {/* ================= QUICK USER SEARCH & PENDING ALERTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1">
        {/* Quick User Search */}
        <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/50 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
              <Search className="w-4 h-4 text-amber-400" />
              <span>নিবন্ধিত ইউজার দ্রুত অনুসন্ধান (Quick Search)</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('users_roles', 'players')}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              সব ইউজার ({safeRegisteredUsers.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ফোন নম্বর, নাম বা ইউজার আইডি লিখুন..."
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-purple-400/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
            />
            {userSearchText && (
              <button
                type="button"
                onClick={() => setUserSearchText('')}
                className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {userSearchText.trim() && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-xs text-purple-400 py-3 bg-[#031e0c]/60 rounded-xl border border-purple-800/30">
                  "{userSearchText}" দিয়ে কোন ইউজার পাওয়া যায়নি।
                </div>
              ) : (
                filteredUsers.slice(0, 5).map((u, uIdx) => (
                  <div
                    key={`home-user-search-${u.id || u.phone || uIdx}-${uIdx}`}
                    className="p-2 bg-[#031e0c] hover:bg-purple-950/60 rounded-xl border border-purple-800/40 flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1">
                          <span>{u.name}</span>
                          {u.isVerified && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                        </p>
                        <span className="text-[10px] text-purple-300 font-mono">{u.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-amber-300">৳{(Number(u.balance) || 0).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUserSearch(u.phone || u.name);
                          onNavigateTab('users_roles', 'players');
                        }}
                        className="px-2 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded text-[10px] font-black cursor-pointer"
                      >
                        ম্যানেজ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Current Core Gateway Numbers */}
        <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/50 space-y-2.5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h4 className="font-bold text-xs text-purple-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>বর্তমান পেমেন্ট গেটওয়ে ও কমিশন রেট</span>
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('agent_config')}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
              >
                এজেন্ট নম্বরে পরিবর্তন
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-[#031e0c] p-2 rounded-xl border border-purple-900/50">
                <span className="text-purple-400 block text-[10px]">বিকাশ নম্বর:</span>
                <strong className="text-amber-300 font-mono text-xs">{appSettings.bkashNumber}</strong>
              </div>
              <div className="bg-[#031e0c] p-2 rounded-xl border border-purple-900/50">
                <span className="text-purple-400 block text-[10px]">নগদ নম্বর:</span>
                <strong className="text-amber-300 font-mono text-xs">{appSettings.nagadNumber}</strong>
              </div>
              <div className="bg-[#031e0c] p-2 rounded-xl border border-purple-900/50">
                <span className="text-yellow-400 block text-[10px]">Binance Pay ID:</span>
                <strong className="text-yellow-300 font-mono text-xs">{appSettings.binancePayId || '982736154'}</strong>
              </div>
              <div className="bg-[#031e0c] p-2 rounded-xl border border-purple-900/50">
                <span className="text-emerald-400 block text-[10px]">ম্যাচ কমিশন:</span>
                <strong className="text-emerald-300 font-mono text-xs">{appSettings.platformCommissionPercent}%</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[10px] text-purple-300">
            <span>রেফার বোনাস: <strong className="text-amber-400">৳{appSettings.referralBonus}</strong></span>
            <span>ইউএসডিটি রেট: <strong className="text-emerald-400 font-mono">1$ = ৳{appSettings.usdtExchangeRate || 125}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
