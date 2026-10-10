import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  CheckCheck,
  Plus,
  Minus,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  DollarSign,
  Lock,
  Unlock,
  Smartphone,
  MessageSquare,
  Bot,
  UserCheck,
  UserX,
  AlertTriangle,
  Save,
  Check,
  Copy,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Award,
  Sparkles,
  X,
  Image,
  ImageIcon,
  User,
  Maximize2,
  Ban,
  Send,
  Megaphone,
  Radio,
  Clock,
  Key,
  Eye,
  EyeOff,
  Fingerprint,
  LayoutGrid,
  Layers,
  Flame,
  Trophy,
  Gift,
  Headset,
  UserRound,
  Volume2,
  ExternalLink,
  RotateCcw,
  Coins,
  Wrench,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Crown,
  Disc,
  Gamepad2,
  Share2,
  Server,
  FolderKanban,
  AlertOctagon,
  Briefcase,
  KeyRound,
  FileText,
  Globe,
  MapPin,
  Info,
  Ticket,
  Download,
  Monitor,
  Home,
  ArrowDown,
  ArrowUp,
  List,
  ArrowLeftRight,
  Dices,
  History,
  Mail,
  Database,
  Phone,
  CreditCard,
  Tv,
  MessageCircle,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, Transaction, PaymentMethod, AppSettings, ScreenType, BroadcastNotification, HomeBannerConfig, LiveChatMessage, MatchHistoryItem } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { exportUserTelemetryToCSV } from '../../utils/telemetryExport';
import { AdminConfirmModal, AdminConfirmModalConfig } from '../Modals/AdminConfirmModal';
import { UserDeviceDetailsModal } from '../Admin/UserDeviceDetailsModal';
import { VIPCashbackView } from '../Admin/VIPCashbackView';
import { SpinnerWheelConfigView } from '../Admin/SpinnerWheelConfigView';
import { FinanceProgramView } from '../Admin/FinanceProgramView';
import { UsersRolesView } from '../Admin/UsersRolesView';
import { GameSystemView } from '../Admin/GameSystemView';
import { AgentConfigView } from '../Admin/AgentConfigView';
import { AffiliateSystemView } from '../Admin/AffiliateSystemView';
import { SiteConfigView } from '../Admin/SiteConfigView';
import { SupportProgramView } from '../Admin/SupportProgramView';
import { AdminStatisticsCharts } from '../Admin/AdminStatisticsCharts';
import { AllSystemsHomePageView } from '../Admin/AllSystemsHomePageView';
import { PaymentLogosManager } from '../Admin/PaymentLogosManager';
import { StandardAdminDashboard } from '../Admin/StandardAdminDashboard';
import {
  BulkProgressState,
  initialBulkProgressState,
  BulkTransactionSkeletonCard,
  BulkProgressFloatingBanner,
  BulkProgressModal
} from '../Admin/BulkProgressIndicator';
import {
  CannedReplyItem,
  CannedCategory,
  CANNED_CATEGORIES,
  getStoredCannedReplies,
} from '../../data/cannedRepliesData';

interface AdminPanelScreenProps {
  currentUser: UserProfile;
  registeredUsers: UserProfile[];
  transactions: Transaction[];
  appSettings: AppSettings;
  sentNotifications?: BroadcastNotification[];
  liveChatMessages?: LiveChatMessage[];
  matchHistory?: MatchHistoryItem[];
  onUpdateAppSettings: (newSettings: AppSettings) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onSaveFullUser?: (updatedUser: UserProfile, oldId?: string) => void;
  onAddUser?: (newUser: UserProfile) => void;
  onDeleteUser?: (userId: string) => void;
  onSendBroadcastNotification?: (notification: BroadcastNotification) => void;
  onDeleteBroadcastNotification?: (id: string) => void;
  onApproveTransaction: (trxId: string) => void;
  onRejectTransaction: (trxId: string, reason?: string) => void;
  onBulkApproveTransactions?: (trxIds: string[]) => void;
  onBulkRejectTransactions?: (trxIds: string[]) => void;
  onEditTransaction?: (trxId: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction?: (trxId: string) => void;
  onManualTransaction?: (userId: string, type: 'deposit' | 'withdraw', amount: number, method: PaymentMethod, note?: string) => void;
  onSendAdminMessage?: (userId: string, text: string, imageUrl?: string, imageName?: string) => void;
  onClearLiveChatThread?: (userId: string) => void;
  onClearAllLiveChat?: () => void;
  onResetMatchHistory?: () => void;
  onDeleteLiveChatMessage?: (messageId: string) => void;
  onToggleUserBan?: (userIdOrPhone: string) => void;
  onClearAllData?: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  currentUser,
  registeredUsers = [],
  transactions = [],
  appSettings,
  sentNotifications = [],
  liveChatMessages = [],
  matchHistory = [],
  onUpdateAppSettings,
  onUpdateUserBalance,
  onSaveFullUser,
  onAddUser,
  onDeleteUser,
  onSendBroadcastNotification,
  onDeleteBroadcastNotification,
  onApproveTransaction,
  onRejectTransaction,
  onBulkApproveTransactions,
  onBulkRejectTransactions,
  onEditTransaction,
  onDeleteTransaction,
  onManualTransaction,
  onSendAdminMessage,
  onClearLiveChatThread,
  onClearAllLiveChat,
  onResetMatchHistory,
  onDeleteLiveChatMessage,
  onToggleUserBan,
  onClearAllData,
  onNavigate,
}) => {
  const safeRegisteredUsers = Array.isArray(registeredUsers) ? registeredUsers : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeSentNotifications = Array.isArray(sentNotifications) ? sentNotifications : [];
  const safeLiveChatMessages = Array.isArray(liveChatMessages) ? liveChatMessages : [];
  const safeMatchHistory = Array.isArray(matchHistory) ? matchHistory : [];

  const handleToggleUserBanInternal = (userIdOrPhone: string) => {
    if (onToggleUserBan) {
      onToggleUserBan(userIdOrPhone);
    } else if (onSaveFullUser) {
      const targetUser = safeRegisteredUsers.find(
        (u) => u.id === userIdOrPhone || u.phone === userIdOrPhone
      );
      if (targetUser) {
        onSaveFullUser({ ...targetUser, isBanned: !targetUser.isBanned }, targetUser.id);
      }
    }
  };
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'deposits'
    | 'withdrawals'
    | 'requests'
    | 'users'
    | 'payments'
    | 'live_chat'
    | 'notices'
    | 'game'
    | 'transactions'
    | 'home_programs'
    | 'vip_cashback'
    | 'spinner_wheel'
    | 'finance'
    | 'users_roles'
    | 'game_system'
    | 'agent_config'
    | 'affiliate_system'
    | 'site_config'
    | 'support'
  >('overview');

  // SubTab states for modular programs
  const [financeSubTab, setFinanceSubTab] = useState<'deposits' | 'withdrawals' | 'all_transactions' | 'agent_trans' | 'game_trans'>('deposits');
  const [usersSubTab, setUsersSubTab] = useState<'players' | 'agents' | 'deposit_levels' | 'vip_tiers' | 'roles_perms' | 'admins'>('players');
  const [gameSubTab, setGameSubTab] = useState<'spinner' | 'games_v1' | 'games_v2' | 'game_errors' | 'categories' | 'providers_v1' | 'providers_v2'>('games_v1');
  const [agentSubTab, setAgentSubTab] = useState<'agent_generic_numbers' | 'agent_payment_methods'>('agent_generic_numbers');
  const [affiliateSubTab, setAffiliateSubTab] = useState<'affiliate_settings' | 'affiliate_list' | 'affiliate_commissions'>('affiliate_list');
  const [siteSubTab, setSiteSubTab] = useState<
    | 'home_game_options'
    | 'site_general'
    | 'site_sms_email'
    | 'site_database'
    | 'site_wallet_config'
    | 'site_app_banners'
    | 'site_interstitial_ads'
    | 'site_social_media'
    | 'home_programs_link'
  >('home_game_options');
  const [supportSubTab, setSupportSubTab] = useState<'live_chat' | 'tickets' | 'canned_replies'>('live_chat');

  // Accordion expanded sections state for menu hierarchy
  const [expandedMenuIds, setExpandedMenuIds] = useState<Record<string, boolean>>({
    finance: true,
    game_system: true,
    users_roles: true,
    support: false,
    agent_config: false,
    affiliate_system: false,
    site_config: false,
  });

  const toggleMenuExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setExpandedMenuIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Executive System Switcher Mode: 1) Pro Gaming Master, 2) Enterprise All-Systems ERP, 3) Fast Cashier Terminal
  const [adminSystemMode, setAdminSystemMode] = useState<'pro_gaming' | 'all_systems' | 'cashier_desk'>('pro_gaming');
  const [liveTime, setLiveTime] = useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('bn-BD', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlayTone = () => {
    try {
      sounds.playBellTone(0.8);
    } catch {}
  };

  // Sidebar category accordions
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    finance: true,
    users_roles: false,
    game_system: false,
    agent_config: false,
    affiliate_system: false,
    site_config: false,
    support: false,
  });

  const toggleSubMenu = (menuKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenSubMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };
  
  // Left Sidebar & Menu state (মেনুর অপশনটা চালুর জন্য)
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Admin View Mode: Mobile Version vs Desktop Version (মোবাইল ও ডেস্কটপ দুই ভার্সন)
  const [adminViewMode, setAdminViewMode] = useState<'mobile' | 'desktop'>(() => {
    try {
      const saved = localStorage.getItem('kingludo_admin_view_mode');
      if (saved === 'mobile' || saved === 'desktop') return saved;
      return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'desktop' : 'mobile';
    } catch {
      return 'mobile';
    }
  });

  const handleToggleViewMode = (mode: 'mobile' | 'desktop') => {
    setAdminViewMode(mode);
    try {
      localStorage.setItem('kingludo_admin_view_mode', mode);
    } catch {}
  };

  // Bulk Administrative Action Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<AdminConfirmModalConfig | null>(null);

  // Bulk action trigger: Reset Match History
  const handlePromptResetMatchHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'ম্যাচ হিস্ট্রি সম্পূর্ণ রিসেট করবেন?',
      description: `বর্তমানে সংরক্ষিত মোট ${safeMatchHistory.length} টি ম্যাচের অতীত ফলাফল, গেম হিস্ট্রি ও উইনার রেকর্ড স্থায়ীভাবে মুছে যাবে।`,
      consequence: 'এটি একটি বাল্ক অ্যাকশন। সকল ইউজারের অতীত ম্যাচের হিস্ট্রি ও ডাটা সম্পূর্ণ খালি হয়ে যাবে এবং এটি পুনরুদ্ধার করা সম্ভব নয়।',
      badge: 'ম্যাচ হিস্ট্রি বাল্ক রিসেট',
      targetDetail: `${safeMatchHistory.length} টি সংরক্ষিত ম্যাচ রেকর্ড`,
      confirmText: 'হ্যাঁ, ম্যাচ হিস্ট্রি রিসেট করুন',
      cancelText: 'বাতিল',
      variant: 'danger',
      icon: 'reset',
      onConfirm: () => {
        if (onResetMatchHistory) {
          onResetMatchHistory();
        }
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
      },
    });
  };

  // Administrative action trigger: Clear User Chat Thread
  const handlePromptClearUserChatThread = (threadUserId: string, threadUserName: string, threadPhone: string, count: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'কাস্টমার চ্যাট থ্রেড মুছে ফেলবেন?',
      description: `${threadUserName} (${threadPhone})-এর মোট ${count} টি বার্তা ও সাপোর্ট হিস্ট্রি স্থায়ীভাবে মুছে ফেলা হবে।`,
      consequence: 'এই ইউজারের সাথে থাকা সমস্ত বার্তা ও কথোপকথন রেকর্ড রিসেট হয়ে যাবে এবং এটি পুনরুদ্ধার করা সম্ভব নয়।',
      badge: 'চ্যাট থ্রেড ক্লিয়ার',
      targetDetail: `${threadUserName} (${threadPhone}) • ${count} টি বার্তা`,
      confirmText: 'হ্যাঁ, চ্যাট মুছুন',
      cancelText: 'বাতিল',
      variant: 'danger',
      icon: 'trash',
      onConfirm: () => {
        if (onClearLiveChatThread) {
          onClearLiveChatThread(threadUserId);
        }
      },
    });
  };

  // Bulk action trigger: Clear ALL Live Chat Threads
  const handlePromptClearAllChatThreads = () => {
    setConfirmModal({
      isOpen: true,
      title: 'সকল ইউজারের চ্যাট থ্রেড মুছে ফেলবেন?',
      description: `সিস্টেমে সংরক্ষিত মোট ${safeLiveChatMessages.length} টি কাস্টমার বার্তা ও সাপোর্ট চ্যাট রেকর্ড একবারে মুছে যাবে।`,
      consequence: 'এটি একটি বাল্ক অ্যাকশন। সকল কাস্টমারের চ্যাট হিস্ট্রি রিসেট হয়ে যাবে।',
      badge: 'বাল্ক চ্যাট রিসেট',
      targetDetail: `মোট ${safeLiveChatMessages.length} টি বার্তা`,
      confirmText: 'হ্যাঁ, সকল চ্যাট মুছে ফেলুন',
      cancelText: 'বাতিল',
      variant: 'danger',
      icon: 'trash',
      onConfirm: () => {
        if (onClearAllLiveChat) {
          onClearAllLiveChat();
        }
      },
    });
  };

  // Administrative action trigger: Delete User Account
  const handlePromptDeleteUser = (u: UserProfile) => {
    setConfirmModal({
      isOpen: true,
      title: 'অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলতে চান?',
      description: `${u.name} (${u.phone})-এর প্রোফাইল ও সকল তথ্য স্থায়ীভাবে মুছে ফেলা হবে।`,
      consequence: `এই অ্যাকাউন্টের বর্তমান ব্যালেন্স ৳${u.balance} এবং লগইন অ্যাক্সেস স্থায়ীভাবে ডিলিট হয়ে যাবে।`,
      badge: 'ইউজার অ্যাকাউন্ট ডিলিট',
      targetDetail: `${u.name} • ${u.phone} • ব্যালেন্স: ৳${u.balance}`,
      confirmText: 'হ্যাঁ, অ্যাকাউন্ট মুছুন',
      cancelText: 'বাতিল',
      variant: 'danger',
      icon: 'user',
      onConfirm: () => {
        if (onDeleteUser) {
          onDeleteUser(u.id);
        }
      },
    });
  };

  // Administrative action trigger: Delete Broadcast Notification
  const handlePromptDeleteNotification = (notifId: string, notifTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ব্রডকাস্ট নোটিশটি মুছে ফেলতে চান?',
      description: `"${notifTitle}" নোটিশটি হিস্ট্রি থেকে সরিয়ে ফেলা হবে।`,
      consequence: 'প্লেয়ারদের ব্রডকাস্ট নোটিফিকেশন হিস্ট্রি থেকে এটি স্থায়ীভাবে মুছে যাবে।',
      badge: 'নোটিশ ডিলিট',
      targetDetail: notifTitle,
      confirmText: 'হ্যাঁ, মুছুন',
      cancelText: 'বাতিল',
      variant: 'warning',
      icon: 'trash',
      onConfirm: () => {
        if (onDeleteBroadcastNotification) {
          onDeleteBroadcastNotification(notifId);
        }
      },
    });
  };
  
  // Registered Users Search & Filtering State
  const [userSearch, setUserSearch] = useState('');
  const [selectedDeviceModalUser, setSelectedDeviceModalUser] = useState<UserProfile | null>(null);
  const [userFilterField, setUserFilterField] = useState<'all' | 'name' | 'phone' | 'id'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'verified' | 'banned'>('all');
  const [userSortBy, setUserSortBy] = useState<'default' | 'balance_desc' | 'level_desc' | 'name_asc'>('default');
  const [copiedPhoneUserId, setCopiedPhoneUserId] = useState<string | null>(null);
  const [overviewUserSearch, setOverviewUserSearch] = useState('');
  const [trxSearch, setTrxSearch] = useState('');
  const [trxFilterType, setTrxFilterType] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [trxFilterStatus, setTrxFilterStatus] = useState<'all' | 'Pending' | 'Success' | 'Failed'>('all');
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
  const [copiedTrxPhone, setCopiedTrxPhone] = useState<string | null>(null);

  // Manual Transaction Modal State
  const [showManualTrxModal, setShowManualTrxModal] = useState(false);
  const [manualTrxUserId, setManualTrxUserId] = useState('');
  const [manualTrxType, setManualTrxType] = useState<'deposit' | 'withdraw'>('deposit');
  const [manualTrxAmount, setManualTrxAmount] = useState('');
  const [manualTrxMethod, setManualTrxMethod] = useState<PaymentMethod>('bKash');
  const [manualTrxNote, setManualTrxNote] = useState('');

  // Edit Transaction Modal State
  const [editTrxModal, setEditTrxModal] = useState<{
    id: string;
    amount: number;
    accountNumber: string;
    trxId: string;
    type: string;
  } | null>(null);

  // Reject Transaction Modal with Reason State
  const [rejectTrxModal, setRejectTrxModal] = useState<{
    id: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    userName?: string;
    phone?: string;
    reason: string;
  } | null>(null);

  // Copy helper for transaction
  const handleCopyTrx = (id: string, text: string, type: 'id' | 'phone') => {
    if (!text) return;
    try {
      navigator.clipboard?.writeText(text);
      if (type === 'id') {
        setCopiedTrxId(id);
        setTimeout(() => setCopiedTrxId(null), 2000);
      } else {
        setCopiedTrxPhone(id);
        setTimeout(() => setCopiedTrxPhone(null), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Copy phone helper
  const handleCopyPhone = (userId: string, phone: string) => {
    if (!phone) return;
    try {
      navigator.clipboard?.writeText(phone);
      setCopiedPhoneUserId(userId);
      setTimeout(() => setCopiedPhoneUserId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Live Chat Management State
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>('');
  const [adminReplyInput, setAdminReplyInput] = useState('');
  const [adminAttachedImage, setAdminAttachedImage] = useState<string | null>(null);
  const [adminAttachedImageName, setAdminAttachedImageName] = useState<string | null>(null);
  const [adminZoomPreview, setAdminZoomPreview] = useState<string | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatCannedCategory, setChatCannedCategory] = useState<CannedCategory>('all');
  const [adminCannedReplies] = useState<CannedReplyItem[]>(getStoredCannedReplies);
  const adminFileInputRef = React.useRef<HTMLInputElement>(null);
  const adminMessagesEndRef = React.useRef<HTMLDivElement>(null);

  // Editing state for App Settings
  const [settingsForm, setSettingsForm] = useState<AppSettings>({ ...appSettings });
  const [savedNotice, setSavedNotice] = useState(false);

  // User editing modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingOriginalId, setEditingOriginalId] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showWithdrawPasswords, setShowWithdrawPasswords] = useState<Record<string, boolean>>({});
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEditWithdrawPassword, setShowEditWithdrawPassword] = useState(false);
  const [showNewWithdrawPassword, setShowNewWithdrawPassword] = useState(false);

  const toggleShowPassword = (userId: string) => {
    setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const toggleShowWithdrawPassword = (userId: string) => {
    setShowWithdrawPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const generateRandomPassword = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const generateRandomUserId = () => {
    return `usr_${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<Partial<UserProfile>>({
    id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    phone: '',
    password: 'pass' + Math.floor(1000 + Math.random() * 9000),
    balance: 100,
    level: 1,
    totalMatches: 0,
    winRate: 0,
    totalEarnings: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerified: false,
    isBanned: false,
    role: 'user',
  });

  // Push Notification / Broadcast State
  const [pushTitle, setPushTitle] = useState('🛠️ জরুরি সিস্টেম মেইনটেন্যান্স ও সার্ভার আপগ্রেড');
  const [pushMessage, setPushMessage] = useState('সম্মানিত গ্রাহক, কিং লুডুর সার্ভার পারফরম্যান্স ও সিকিউরিটি আরও উন্নত করার জন্য সাময়িক সিস্টেম মেইনটেন্যান্স চলছে। কিছুক্ষণের মধ্যেই সিস্টেম সম্পূর্ণ সচল হবে।');
  const [pushType, setPushType] = useState<'general' | 'offer' | 'warning' | 'event' | 'maintenance'>('maintenance');
  const [pushTargetScreen, setPushTargetScreen] = useState<ScreenType>('support');
  const [pushActionText, setPushActionText] = useState('সাপোর্টে কথা বলুন');
  const [broadcastNoticeSent, setBroadcastNoticeSent] = useState(false);
  const [showPushPreviewModal, setShowPushPreviewModal] = useState(false);

  const selectPushTemplate = (templateKey: 'maintenance' | 'event' | 'offer' | 'warning') => {
    if (templateKey === 'maintenance') {
      setPushTitle('🛠️ জরুরি সিস্টেম মেইনটেন্যান্স ও সার্ভার আপগ্রেড');
      setPushMessage('সম্মানিত গ্রাহক, কিং লুডুর সার্ভার পারফরম্যান্স ও সিকিউরিটি আরও উন্নত করার জন্য সাময়িক সিস্টেম মেইনটেন্যান্স চলছে। কিছুক্ষণের মধ্যেই সিস্টেম সম্পূর্ণ সচল হবে।');
      setPushType('maintenance');
      setPushTargetScreen('support');
      setPushActionText('সাপোর্টে কথা বলুন');
    } else if (templateKey === 'event') {
      setPushTitle('🏆 নতুন মেগা লুডু টুর্নামেন্ট ইভেন্ট শুরু!');
      setPushMessage('৫০,০০০ টাকা মেগা প্রাইজপুলের বিশেষ লুডু চ্যাম্পিয়নশিপ শুরু হয়েছে! এখনই ম্যাচে অংশ নিন এবং জিতে নিন নগদ পুরস্কার।');
      setPushType('event');
      setPushTargetScreen('matchmaking');
      setPushActionText('ইভেন্টে যোগ দিন');
    } else if (templateKey === 'offer') {
      setPushTitle('🎁 ১০০% ইনস্ট্যান্ট ডিপোজিট ক্যাশব্যাক বোনাস!');
      setPushMessage('বিকাশ, নগদ বা BinancePay-তে ৫০০+ টাকা ডিপোজিট করলেই পাচ্ছেন তাত্ক্ষণিক বোনাস ক্যাশ। সীমিত সময়ের মেগা ধামাকা অফার!');
      setPushType('offer');
      setPushTargetScreen('add_money');
      setPushActionText('ডিপোজিট করুন');
    } else if (templateKey === 'warning') {
      setPushTitle('⚠️ গুরুত্বপূর্ণ প্ল্যাটফর্ম সিকিউরিটি আপডেট');
      setPushMessage('আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে শুধুমাত্র কিং লুডুর অফিশিয়াল বিকাশ/নগদ ও Binance Pay ID ব্যবহার করে লেনদেন করুন।');
      setPushType('warning');
      setPushTargetScreen('home');
      setPushActionText('বুঝেছি');
    }
  };

  const handleSendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) {
      alert('দয়া করে নোটিফিকেশন টাইটেল ও মেসেজ দুটিই লিখুন!');
      return;
    }

    const newNotification: BroadcastNotification = {
      id: `notif_${Date.now()}`,
      title: pushTitle.trim(),
      message: pushMessage.trim(),
      type: pushType,
      targetScreen: pushTargetScreen,
      sentAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) || 'এখনই',
      recipientCount: safeRegisteredUsers.length || 1,
      showModal: true,
      actionText: pushActionText.trim() || undefined,
    };

    if (onSendBroadcastNotification) {
      onSendBroadcastNotification(newNotification);
    }

    setBroadcastNoticeSent(true);
    setTimeout(() => setBroadcastNoticeSent(false), 3500);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
  ];

  // System Stats
  const totalUsersCount = safeRegisteredUsers.length || 1;
  const totalUserBalance = safeRegisteredUsers.reduce((sum, u) => sum + (u.balance || 0), currentUser.balance);
  const pendingDeposits = safeTransactions.filter((t) => t.type === 'deposit' && t.status === 'Pending');
  const pendingWithdrawals = safeTransactions.filter((t) => t.type === 'withdraw' && t.status === 'Pending');
  const totalDepositsVolume = safeTransactions
    .filter((t) => t.type === 'deposit' && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawalsVolume = safeTransactions
    .filter((t) => t.type === 'withdraw' && t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const defaultBannerConfigs: HomeBannerConfig[] = [
    {
      id: 1,
      badge: 'মেগা প্রাইজপুল',
      badgeColor: 'bg-amber-400 text-slate-950',
      title: 'মেগা লুডু টুর্নামেন্ট',
      subtitle: 'দৈনিক ৫০,০০০ টাকা মেগা প্রাইজপুল জয়ী হোন!',
      buttonText: 'অংশ নিন',
      targetScreen: 'matchmaking',
      action: 'navigate',
      enabled: true,
    },
    {
      id: 2,
      badge: 'ইনস্ট্যান্ট ক্যাশআউট',
      badgeColor: 'bg-emerald-400 text-slate-950',
      title: '১ মিনিটেই অটো পেমেন্ট',
      subtitle: 'বিকাশ, নগদ ও রকেটে দ্রুততম ক্যাশআউট সুবিধা!',
      buttonText: 'উইথড্র করুন',
      targetScreen: 'withdraw',
      action: 'navigate',
      enabled: true,
    },
    {
      id: 3,
      badge: '১০০% বোনাস অফার',
      badgeColor: 'bg-purple-400 text-slate-950',
      title: 'প্রথম ডিপোজিট বোনাস',
      subtitle: 'প্রথম ডিপোজিটে ১০০% পর্যন্ত ক্যাশব্যাক বোনাস পান!',
      buttonText: 'ডিপোজিট করুন',
      targetScreen: 'add_money',
      action: 'navigate',
      enabled: true,
    },
    {
      id: 4,
      badge: 'আনলিমিটেড ইনকাম',
      badgeColor: 'bg-rose-400 text-slate-950',
      title: 'রেফার করুন ও আয় করুন',
      subtitle: 'বন্ধুকে ইনভাইট করে প্রতিটি রেফারে বোনাস ক্যাশ জিতুন!',
      buttonText: 'রেফার লিংক নিন',
      targetScreen: 'home',
      action: 'refer',
      enabled: true,
    },
    {
      id: 5,
      badge: '২৪/৭ সাপোর্ট',
      badgeColor: 'bg-cyan-400 text-slate-950',
      title: '২৪ ঘণ্টা লাইভ হেল্পলাইন',
      subtitle: 'যেকোনো সমস্যায় টেলিগ্রাম ও হোয়াটসঅ্যাপে পাশে আছি!',
      buttonText: 'সাপোর্ট পান',
      targetScreen: 'support',
      action: 'navigate',
      enabled: true,
    },
    {
      id: 6,
      badge: 'হট ম্যাচ',
      badgeColor: 'bg-red-500 text-white',
      title: '২ প্লেয়ার ১v১ ব্যাটেল',
      subtitle: 'সরাসরি রিয়েল প্লেয়ারের সাথে দ্রুত ম্যাচ খেলুন!',
      buttonText: 'ম্যাচ খেলুন',
      targetScreen: 'create_match',
      action: 'navigate',
      enabled: true,
    },
  ];

  const currentBanners: HomeBannerConfig[] =
    settingsForm.bannersList && settingsForm.bannersList.length > 0
      ? settingsForm.bannersList
      : defaultBannerConfigs;

  const toggleBannerEnabled = (id: number) => {
    const list = [...currentBanners];
    const index = list.findIndex((b) => b.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], enabled: !list[index].enabled };
      setSettingsForm({ ...settingsForm, bannersList: list });
    }
  };

  const updateBannerField = (id: number, field: keyof HomeBannerConfig, value: any) => {
    const list = [...currentBanners];
    const index = list.findIndex((b) => b.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], [field]: value };
      setSettingsForm({ ...settingsForm, bannersList: list });
    }
  };

  const handleAddNewBanner = () => {
    const nextId = currentBanners.length > 0 ? Math.max(...currentBanners.map((b) => b.id)) + 1 : 1;
    const newBanner: HomeBannerConfig = {
      id: nextId,
      badge: 'নতুন অফার',
      badgeColor: 'bg-amber-400 text-slate-950',
      title: 'নতুন স্পেশাল ব্যানার',
      subtitle: 'এখানে আপনার আকর্ষণীয় অফারের বিবরণ লিখুন',
      buttonText: 'দেখুন',
      targetScreen: 'home',
      action: 'navigate',
      enabled: true,
    };
    setSettingsForm({ ...settingsForm, bannersList: [...currentBanners, newBanner] });
  };

  const handleDeleteBanner = (id: number) => {
    const filtered = currentBanners.filter((b) => b.id !== id);
    setSettingsForm({ ...settingsForm, bannersList: filtered });
  };

  const handleResetBanners = () => {
    setSettingsForm({ ...settingsForm, bannersList: defaultBannerConfigs });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAppSettings(settingsForm);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Normalize phone for flexible searching (strips spaces, dashes, +88, leading 0 issues)
  const normalizePhone = (p: string) => (p || '').replace(/[\s\-\+\(\)]/g, '').replace(/^88/, '');

  const userCounts = useMemo(() => {
    const total = safeRegisteredUsers.length;
    const active = safeRegisteredUsers.filter((u) => !u.isBanned).length;
    const verified = safeRegisteredUsers.filter((u) => u.isVerified).length;
    const banned = safeRegisteredUsers.filter((u) => u.isBanned).length;
    return { total, active, verified, banned };
  }, [safeRegisteredUsers]);

  const filteredUsers = useMemo(() => {
    const rawQuery = userSearch.trim();
    const query = rawQuery.toLowerCase();
    const cleanQueryPhone = normalizePhone(rawQuery);

    return safeRegisteredUsers
      .filter((u) => {
        // Status filter
        if (userStatusFilter === 'verified' && !u.isVerified) return false;
        if (userStatusFilter === 'banned' && !u.isBanned) return false;
        if (userStatusFilter === 'active' && u.isBanned) return false;

        if (!query) return true;

        const userName = (u.name || '').toLowerCase();
        const userPhone = u.phone || '';
        const userCleanPhone = normalizePhone(userPhone);
        const userId = (u.id || '').toLowerCase();

        if (userFilterField === 'name') {
          return userName.includes(query);
        }
        if (userFilterField === 'phone') {
          return (
            userPhone.includes(query) ||
            (cleanQueryPhone.length > 0 && userCleanPhone.includes(cleanQueryPhone))
          );
        }
        if (userFilterField === 'id') {
          return userId.includes(query);
        }

        // 'all' field: check phone, name, or ID
        const matchName = userName.includes(query);
        const matchPhone =
          userPhone.includes(query) ||
          (cleanQueryPhone.length > 0 && userCleanPhone.includes(cleanQueryPhone));
        const matchId = userId.includes(query);

        return matchName || matchPhone || matchId;
      })
      .sort((a, b) => {
        if (userSortBy === 'balance_desc') {
          return (b.balance || 0) - (a.balance || 0);
        }
        if (userSortBy === 'level_desc') {
          return (b.level || 1) - (a.level || 1);
        }
        if (userSortBy === 'name_asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
      });
  }, [safeRegisteredUsers, userSearch, userFilterField, userStatusFilter, userSortBy]);

  // Quick user search for Overview dashboard
  const overviewFilteredUsers = useMemo(() => {
    const raw = overviewUserSearch.trim();
    if (!raw) return [];
    const q = raw.toLowerCase();
    const cleanPhone = normalizePhone(raw);
    return safeRegisteredUsers.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const phone = u.phone || '';
      const cleanUPhone = normalizePhone(phone);
      const id = (u.id || '').toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        (cleanPhone.length > 0 && cleanUPhone.includes(cleanPhone)) ||
        id.includes(q)
      );
    });
  }, [safeRegisteredUsers, overviewUserSearch]);

  const filteredTrx = useMemo(() => {
    return safeTransactions.filter((t) => {
      const q = trxSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.accountNumber && t.accountNumber.includes(q)) ||
        (t.trxId && t.trxId.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q));

      const matchesType = trxFilterType === 'all' || t.type === trxFilterType;
      const matchesStatus = trxFilterStatus === 'all' || t.status === trxFilterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [safeTransactions, trxSearch, trxFilterType, trxFilterStatus]);

  const trxCounts = useMemo(() => {
    const pendingDep = safeTransactions.filter((t) => t.type === 'deposit' && t.status === 'Pending').length;
    const pendingWith = safeTransactions.filter((t) => t.type === 'withdraw' && t.status === 'Pending').length;
    const success = safeTransactions.filter((t) => t.status === 'Success').length;
    const failed = safeTransactions.filter((t) => t.status === 'Failed').length;
    const totalDeposits = safeTransactions.filter((t) => t.type === 'deposit').length;
    const totalWithdraws = safeTransactions.filter((t) => t.type === 'withdraw').length;
    return {
      total: safeTransactions.length,
      pendingDep,
      pendingWith,
      success,
      failed,
      totalDeposits,
      totalWithdraws,
    };
  }, [safeTransactions]);

  // Bulk action states for Tab 2 (Requests)
  const [selectedRequestsTrxIds, setSelectedRequestsTrxIds] = useState<string[]>([]);
  const [requestsBulkModal, setRequestsBulkModal] = useState<{
    action: 'approve' | 'reject';
    ids: string[];
  } | null>(null);
  const [bulkFinancialSafetyAcknowledged, setBulkFinancialSafetyAcknowledged] = useState(false);
  const [requestsBulkSuccessNotice, setRequestsBulkSuccessNotice] = useState<string | null>(null);
  const [requestsBulkProgress, setRequestsBulkProgress] = useState<BulkProgressState>(initialBulkProgressState);
  const [telemetryExportNotice, setTelemetryExportNotice] = useState<string | null>(null);

  const handleExportTelemetry = (usersToExport: UserProfile[], label?: string) => {
    if (!usersToExport || usersToExport.length === 0) {
      alert('রপ্তানি করার মতো কোনো ইউজার পাওয়া যায়নি।');
      return;
    }
    const result = exportUserTelemetryToCSV(usersToExport, label || 'king_ludo_telemetry');
    if (result.success) {
      try {
        sounds?.playCoinDrop?.();
      } catch (e) {
        // silent audio
      }
      setTelemetryExportNotice(`${result.count} জন ইউজারের সংগৃহীত ডিভাইস টেলিমেট্রি CSV সফলভাবে সংরক্ষিত হয়েছে (${result.filename})`);
      setTimeout(() => {
        setTelemetryExportNotice(null);
      }, 5000);
    }
  };

  const pendingInFilteredTrx = useMemo(
    () => filteredTrx.filter((t) => t.status === 'Pending'),
    [filteredTrx]
  );
  const pendingDepositsInFilteredTrx = useMemo(
    () => filteredTrx.filter((t) => t.type === 'deposit' && t.status === 'Pending'),
    [filteredTrx]
  );
  const pendingWithdrawalsInFilteredTrx = useMemo(
    () => filteredTrx.filter((t) => t.type === 'withdraw' && t.status === 'Pending'),
    [filteredTrx]
  );

  const selectedRequestsTrx = useMemo(() => {
    const s = new Set(selectedRequestsTrxIds);
    return transactions.filter((t) => s.has(t.id));
  }, [transactions, selectedRequestsTrxIds]);

  const selectedRequestsStats = useMemo(() => {
    const count = selectedRequestsTrx.length;
    const totalAmount = selectedRequestsTrx.reduce((acc, t) => acc + t.amount, 0);
    const deps = selectedRequestsTrx.filter((t) => t.type === 'deposit');
    const withs = selectedRequestsTrx.filter((t) => t.type === 'withdraw');
    return {
      count,
      totalAmount,
      depCount: deps.length,
      depTotal: deps.reduce((acc, t) => acc + t.amount, 0),
      withCount: withs.length,
      withTotal: withs.reduce((acc, t) => acc + t.amount, 0),
    };
  }, [selectedRequestsTrx]);

  const handleToggleSelectRequest = (trxId: string) => {
    setSelectedRequestsTrxIds((prev) =>
      prev.includes(trxId) ? prev.filter((id) => id !== trxId) : [...prev, trxId]
    );
  };

  const handleSelectAllPendingRequests = () => {
    if (selectedRequestsTrxIds.length === pendingInFilteredTrx.length && pendingInFilteredTrx.length > 0) {
      setSelectedRequestsTrxIds([]);
    } else {
      setSelectedRequestsTrxIds(pendingInFilteredTrx.map((t) => t.id));
    }
  };

  const handleSelectAllPendingDepRequests = () => {
    setSelectedRequestsTrxIds(pendingDepositsInFilteredTrx.map((t) => t.id));
  };

  const handleSelectAllPendingWithRequests = () => {
    setSelectedRequestsTrxIds(pendingWithdrawalsInFilteredTrx.map((t) => t.id));
  };

  const handleClearRequestsSelection = () => {
    setSelectedRequestsTrxIds([]);
  };

  const executeBulkRequestsWithProgress = (action: 'approve' | 'reject', targetIds: string[]) => {
    if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) return;
    setRequestsBulkModal(null);

    const total = targetIds.length;
    // Step 1: Initialize optimistic progress state and mark items as processing
    setRequestsBulkProgress({
      isActive: true,
      isMinimized: false,
      action,
      total,
      completedCount: 0,
      processingIds: [...targetIds],
      completedIds: [],
      failedIds: [],
      stageMessage: action === 'approve' ? 'অপ্টিমিস্টিক ব্যালেন্স সিঙ্ক শুরু হচ্ছে...' : 'উইথড্র রিফান্ড ও বাতিল শুরু হচ্ছে...',
      percentage: 10,
      isFinished: false,
      successNotice: null,
    });

    // Step 2: Optimistic update in state with visual progress steps
    let completed = 0;
    const stepDuration = Math.max(120, Math.min(320, Math.floor(1100 / total)));

    const interval = setInterval(() => {
      completed += 1;
      const currentId = targetIds[completed - 1];
      const pct = Math.min(Math.round((completed / total) * 100), 100);

      setRequestsBulkProgress((prev) => ({
        ...prev,
        completedCount: completed,
        percentage: pct,
        currentId,
        completedIds: [...prev.completedIds, currentId],
        stageMessage: action === 'approve'
          ? `অনুমোদন সম্পন্ন হচ্ছে (${completed}/${total}): আইডি ...${currentId.slice(-6)}`
          : `বাতিল ও রিফান্ড হচ্ছে (${completed}/${total}): আইডি ...${currentId.slice(-6)}`,
      }));

      if (completed >= total) {
        clearInterval(interval);

        // Finalize transaction state updates
        if (action === 'approve') {
          if (onBulkApproveTransactions) {
            onBulkApproveTransactions(targetIds);
          } else {
            targetIds.forEach((id) => onApproveTransaction(id));
          }
          try {
            sounds.playTransactionAlert('deposit', 'cash_register');
          } catch (e) {
            console.error(e);
          }
        } else {
          if (onBulkRejectTransactions) {
            onBulkRejectTransactions(targetIds);
          } else {
            targetIds.forEach((id) => onRejectTransaction(id));
          }
          try {
            sounds.playBellTone(0.8);
          } catch (e) {
            console.error(e);
          }
        }

        setRequestsBulkProgress((prev) => ({
          ...prev,
          isFinished: true,
          percentage: 100,
          stageMessage: action === 'approve'
            ? `সফলভাবে ${total} টি লেনদেন অনুমোদন সম্পন্ন হয়েছে!`
            : `সফলভাবে ${total} টি লেনদেন বাতিল ও রিফান্ড সম্পন্ন হয়েছে!`,
        }));

        setSelectedRequestsTrxIds((prev) => prev.filter((id) => !targetIds.includes(id)));
        setRequestsBulkSuccessNotice(`সফলভাবে ${total} টি লেনদেন এক ক্লিকে ${action === 'approve' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে!`);
        setTimeout(() => setRequestsBulkSuccessNotice(null), 4000);

        // Auto close after completion
        setTimeout(() => {
          setRequestsBulkProgress((prev) => ({ ...prev, isActive: false, processingIds: [] }));
        }, 1200);
      }
    }, stepDuration);
  };

  const executeBulkApproveRequests = (targetIds: string[]) => {
    executeBulkRequestsWithProgress('approve', targetIds);
  };

  const executeBulkRejectRequests = (targetIds: string[]) => {
    executeBulkRequestsWithProgress('reject', targetIds);
  };

  // Transaction Edit Handler
  const handleSaveEditedTrx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTrxModal) return;
    if (onEditTransaction) {
      onEditTransaction(editTrxModal.id, {
        amount: Number(editTrxModal.amount) || 0,
        accountNumber: editTrxModal.accountNumber.trim(),
        trxId: editTrxModal.trxId.trim(),
      });
    }
    setRequestsBulkSuccessNotice('লেনদেনের তথ্য সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => setRequestsBulkSuccessNotice(null), 3000);
    setEditTrxModal(null);
  };

  // Transaction Delete Handler
  const handleDeleteTrxPrompt = (trxId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ট্রানজেকশন রেকর্ড মুছে ফেলবেন?',
      description: 'এই লেনদেনের রেকর্ডটি তালিকা থেকে স্থায়ীভাবে মুছে যাবে।',
      consequence: 'মুছে ফেলা হলে এটি আর রিকভার করা সম্ভব নয়।',
      badge: 'লেনদেন ডিলিট',
      targetDetail: `ID: ${trxId}`,
      confirmText: 'হ্যাঁ, মুছুন',
      cancelText: 'বাতিল',
      variant: 'danger',
      icon: 'trash',
      onConfirm: () => {
        if (onDeleteTransaction) {
          onDeleteTransaction(trxId);
        }
        setRequestsBulkSuccessNotice('লেনদেন রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!');
        setTimeout(() => setRequestsBulkSuccessNotice(null), 3000);
      },
    });
  };

  // Manual Transaction Execution Handler
  const handleExecuteManualTrx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(manualTrxAmount);
    if (!manualTrxUserId) {
      alert('দয়া করে কোনো ইউজার নির্বাচন করুন!');
      return;
    }
    if (!amountNum || amountNum <= 0) {
      alert('দয়া করে সঠিক টাকার পরিমাণ লিখুন!');
      return;
    }
    if (onManualTransaction) {
      onManualTransaction(
        manualTrxUserId,
        manualTrxType,
        amountNum,
        manualTrxMethod,
        manualTrxNote.trim() || undefined
      );
    }
    setShowManualTrxModal(false);
    setManualTrxAmount('');
    setManualTrxNote('');
    setRequestsBulkSuccessNotice(`সফলভাবে ৳${amountNum.toLocaleString()} ${manualTrxType === 'deposit' ? 'ডিপোজিট' : 'কর্তন'} সম্পন্ন হয়েছে!`);
    setTimeout(() => setRequestsBulkSuccessNotice(null), 3500);
  };

  // Reject with Custom Reason Handler
  const handleConfirmRejectTrx = () => {
    if (!rejectTrxModal) return;
    onRejectTransaction(rejectTrxModal.id, rejectTrxModal.reason.trim());
    setRequestsBulkSuccessNotice(`লেনদেনটি বাতিল করা হয়েছে (কারণ: ${rejectTrxModal.reason})`);
    setRejectTrxModal(null);
    setTimeout(() => setRequestsBulkSuccessNotice(null), 3500);
  };

  // Group liveChatMessages into customer threads
  const customerThreads = React.useMemo(() => {
    const map = new Map<string, {
      userId: string;
      userName: string;
      userPhone: string;
      userAvatar?: string;
      lastMessage: LiveChatMessage;
      unreadCount: number;
      messages: LiveChatMessage[];
    }>();

    safeLiveChatMessages.forEach((msg) => {
      const key = msg.userId || msg.userPhone || 'guest_user';
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          userId: key,
          userName: msg.userName || 'কাস্টমার',
          userPhone: msg.userPhone || key,
          userAvatar: msg.userAvatar,
          lastMessage: msg,
          unreadCount: msg.senderRole === 'user' && !msg.isReadByAdmin ? 1 : 0,
          messages: [msg],
        });
      } else {
        existing.messages.push(msg);
        if (msg.timestamp >= existing.lastMessage.timestamp) {
          existing.lastMessage = msg;
        }
        if (msg.senderRole === 'user' && !msg.isReadByAdmin) {
          existing.unreadCount += 1;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  }, [safeLiveChatMessages]);

  const unreadLiveChatTotal = safeLiveChatMessages.filter((m) => m.senderRole === 'user' && !m.isReadByAdmin).length;

  const effectiveSelectedUserId = selectedChatUserId || (customerThreads.length > 0 ? customerThreads[0].userId : '');
  const activeThread = customerThreads.find((t) => t.userId === effectiveSelectedUserId);
  const activeThreadMessages = Array.isArray(activeThread?.messages) ? activeThread.messages : [];

  const filteredChatThreads = customerThreads.filter((t) =>
    (t.userName || '').toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    (t.userPhone || '').includes(chatSearchQuery) ||
    (t.lastMessage?.text || '').toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  const handleAdminSendReply = (customText?: string) => {
    const text = (customText !== undefined ? customText : adminReplyInput).trim();
    if (!text && !adminAttachedImage) return;
    if (!effectiveSelectedUserId) {
      alert('দয়া করে কোনো কাস্টমার চ্যাট থ্রেড নির্বাচন করুন!');
      return;
    }

    if (onSendAdminMessage) {
      onSendAdminMessage(effectiveSelectedUserId, text, adminAttachedImage || undefined, adminAttachedImageName || undefined);
    }

    if (customText === undefined) {
      setAdminReplyInput('');
    }
    setAdminAttachedImage(null);
    setAdminAttachedImageName(null);
  };

  const handleAdminImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির সাইজ ৫MB এর কম হতে হবে!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAdminAttachedImage(event.target?.result as string);
      setAdminAttachedImageName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  interface AdminMenuSubItem {
    id: string;
    label: string;
    sublabel?: string;
    badge?: string | number | null;
    badgeColor?: string;
    onClick: () => void;
    isActive?: boolean;
  }

  interface AdminMenuItem {
    id: typeof activeTab;
    label: string;
    shortLabel: string;
    fullLabel: string;
    sublabel: string;
    category: 'core' | 'finance' | 'gaming' | 'support' | 'enterprise';
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
    badgeColor?: string;
    subItems?: AdminMenuSubItem[];
  }

  const adminMenuItems: AdminMenuItem[] = [
    // 1. CORE & OVERVIEW (কোর ড্যাশবোর্ড ও লেনদেন)
    {
      id: 'overview',
      label: 'মাস্টার ড্যাশবোর্ড',
      shortLabel: 'ড্যাশবোর্ড',
      fullLabel: 'মাস্টার ড্যাশবোর্ড ও সার্বিক পরিসংখ্যান (Dashboard)',
      sublabel: 'Overview, Alerts & Key Stats',
      category: 'core',
      icon: LayoutGrid,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    },
    {
      id: 'deposits',
      label: 'ডিপোজিট রিকোয়েস্ট',
      shortLabel: 'ডিপোজিট',
      fullLabel: 'ডিপোজিট রিকোয়েস্ট ও অনুমোদন (Deposits)',
      sublabel: 'Pending Deposits & Approval',
      category: 'core',
      icon: ArrowDownLeft,
      badge: pendingDeposits.length > 0 ? `${pendingDeposits.length} টি` : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-black animate-pulse',
    },
    {
      id: 'withdrawals',
      label: 'উইথড্র রিকোয়েস্ট',
      shortLabel: 'উইথড্র',
      fullLabel: 'উইথড্র রিকোয়েস্ট ও ক্যাশআউট (Withdrawals)',
      sublabel: 'Pending Withdrawals & Refund',
      category: 'core',
      icon: ArrowUpRight,
      badge: pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} টি` : null,
      badgeColor: 'bg-rose-500 text-white font-black animate-pulse',
    },
    {
      id: 'users',
      label: 'ইউজার ও ব্যালেন্স (+/-)',
      shortLabel: 'ইউজার্স',
      fullLabel: 'ইউজার তালিকা, ব্যালেন্স (+/-) ও ব্যান (Users)',
      sublabel: 'Players, Balance Top-up & Ban',
      category: 'core',
      icon: Users,
      badge: `${safeRegisteredUsers.length}`,
      badgeColor: 'bg-purple-900/80 text-purple-200 border border-purple-700/50',
    },
    {
      id: 'transactions',
      label: 'সকল ট্রানজেকশন',
      shortLabel: 'হিস্ট্রি',
      fullLabel: 'সকল লেনদেনের পূর্ণাঙ্গ হিস্ট্রি ও রেকর্ড (Transactions)',
      sublabel: 'All History & Logs',
      category: 'core',
      icon: FileText,
      badge: `${safeTransactions.length}`,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'payments',
      label: 'পেমেন্ট নম্বর ও লোগো',
      shortLabel: 'পেমেন্ট ও লোগো',
      fullLabel: 'বিকাশ, নগদ, রকেট, লিমিট ও লোগো (Gateways & Logos)',
      sublabel: 'Gateways, Numbers & Custom Logos',
      category: 'core',
      icon: Smartphone,
      badge: 'লোগো',
      badgeColor: 'bg-pink-600 text-white font-bold',
    },

    // 2. FINANCE MANAGEMENT (ফাইন্যান্স ও ব্যাংকিং)
    {
      id: 'finance',
      label: 'ফাইন্যান্স প্রোগ্রাম',
      shortLabel: 'ফাইন্যান্স',
      fullLabel: 'ফাইন্যান্স প্রোগ্রাম ও ব্যালেন্স লেজার (Finance Hub)',
      sublabel: 'ডিপোজিট, উইথড্র ও লেজার হাব',
      category: 'finance',
      icon: Wallet,
      badge: pendingDeposits.length + pendingWithdrawals.length > 0 ? `${pendingDeposits.length + pendingWithdrawals.length}` : 'সক্রিয়',
      badgeColor: pendingDeposits.length + pendingWithdrawals.length > 0 ? 'bg-rose-500 text-white font-black animate-pulse' : 'bg-emerald-600 text-white',
      subItems: [
        {
          id: 'deposits',
          label: 'ডিপোজিট রিকোয়েস্ট',
          badge: pendingDeposits.length > 0 ? `${pendingDeposits.length}` : null,
          badgeColor: 'bg-emerald-500 text-slate-950 font-black animate-pulse',
          isActive: activeTab === 'finance' && financeSubTab === 'deposits',
          onClick: () => {
            setActiveTab('finance');
            setFinanceSubTab('deposits');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'withdrawals',
          label: 'উইথড্রল রিকোয়েস্ট',
          badge: pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length}` : null,
          badgeColor: 'bg-rose-500 text-white font-black animate-pulse',
          isActive: activeTab === 'finance' && financeSubTab === 'withdrawals',
          onClick: () => {
            setActiveTab('finance');
            setFinanceSubTab('withdrawals');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'all_transactions',
          label: 'সব লেনদেন লেজার',
          isActive: activeTab === 'finance' && financeSubTab === 'all_transactions',
          onClick: () => {
            setActiveTab('finance');
            setFinanceSubTab('all_transactions');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'agent_trans',
          label: 'এজেন্ট লেনদেন',
          isActive: activeTab === 'finance' && financeSubTab === 'agent_trans',
          onClick: () => {
            setActiveTab('finance');
            setFinanceSubTab('agent_trans');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'game_trans',
          label: 'গেম লেনদেন লেজার',
          isActive: activeTab === 'finance' && financeSubTab === 'game_trans',
          onClick: () => {
            setActiveTab('finance');
            setFinanceSubTab('game_trans');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },
    {
      id: 'agent_config',
      label: 'এজেন্ট ব্যাংকিং কনফিগ',
      shortLabel: 'এজেন্ট',
      fullLabel: 'এজেন্ট জেনেরিক নম্বর ও মেথড কনফিগ (Agent Config)',
      sublabel: 'Agent Numbers & Gateways',
      category: 'finance',
      icon: Briefcase,
      badge: null,
      badgeColor: '',
      subItems: [
        {
          id: 'agent_generic_numbers',
          label: 'এজেন্ট নম্বর কনফিগারেশন',
          isActive: activeTab === 'agent_config' && agentSubTab === 'agent_generic_numbers',
          onClick: () => {
            setActiveTab('agent_config');
            setAgentSubTab('agent_generic_numbers');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'agent_payment_methods',
          label: 'পেমেন্ট গেটওয়ে মেথডস',
          isActive: activeTab === 'agent_config' && agentSubTab === 'agent_payment_methods',
          onClick: () => {
            setActiveTab('agent_config');
            setAgentSubTab('agent_payment_methods');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },

    // 3. GAMING ENGINE (কিং লুডো গেম ইঞ্জিন)
    {
      id: 'game_system',
      label: 'কিং লুডো গেম ইঞ্জিন',
      shortLabel: 'লুডো ইঞ্জিন',
      fullLabel: 'কিং লুডো গেমিং ইঞ্জিন ও রুলস',
      sublabel: 'কিং লুডো ম্যাচ রুলস, টুর্নামেন্ট ও বোর্ড ইঞ্জিন',
      category: 'gaming',
      icon: Gamepad2,
      badge: 'কিং লুডো',
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      subItems: [
        {
          id: 'categories',
          label: 'কিং লুডো ইঞ্জিন ক্যাটাগরি',
          badge: 'সক্রিয়',
          badgeColor: 'bg-emerald-600 text-white font-bold',
          isActive: activeTab === 'game_system' && gameSubTab === 'categories',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('categories');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'games_v1',
          label: 'গেমস তালিকা (V1)',
          isActive: activeTab === 'game_system' && gameSubTab === 'games_v1',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('games_v1');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'games_v2',
          label: 'গেমস তালিকা (V2)',
          isActive: activeTab === 'game_system' && gameSubTab === 'games_v2',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('games_v2');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'spinner',
          label: 'স্পিনার হুইল ড্র',
          isActive: activeTab === 'game_system' && gameSubTab === 'spinner',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('spinner');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'providers_v1',
          label: 'গেম প্রোভাইডার্স ইঞ্জিন',
          isActive: activeTab === 'game_system' && gameSubTab === 'providers_v1',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('providers_v1');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'game_errors',
          label: 'গেম এরর লগ ও সমাধান',
          badge: '৩ এরর',
          badgeColor: 'bg-rose-500 text-white font-bold animate-pulse',
          isActive: activeTab === 'game_system' && gameSubTab === 'game_errors',
          onClick: () => {
            setActiveTab('game_system');
            setGameSubTab('game_errors');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },
    {
      id: 'game',
      label: 'লুডো কমিশন ও রুলস',
      shortLabel: 'কমিশন ফি',
      fullLabel: 'লুডো ম্যাচ রুলস, বট ও কমিশন ফি (Game Rules)',
      sublabel: 'Platform Commission & Bot AI',
      category: 'gaming',
      icon: Gamepad2,
      badge: `${settingsForm.platformCommissionPercent}%`,
      badgeColor: 'bg-amber-500/20 text-amber-300 font-bold',
    },
    {
      id: 'vip_cashback',
      label: 'ভিআইপি ও ক্যাশব্যাক পলিসি',
      shortLabel: 'ভিআইপি',
      fullLabel: 'ভিআইপি লয়্যালটি ও ক্যাশব্যাক পলিসি (VIP Cashback)',
      sublabel: '৬টি ভিআইপি টিয়ার্স ও ক্যাশব্যাক',
      category: 'gaming',
      icon: Crown,
      badge: 'PRO',
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
    },
    {
      id: 'spinner_wheel',
      label: 'স্পিনার হুইল কনফিগ',
      shortLabel: 'স্পিনার',
      fullLabel: 'লাকি স্পিনার হুইল কনফিগারেশন (Spinner Wheel)',
      sublabel: 'দৈনিক ভাগ্যের চাকা ও পুরস্কার',
      category: 'gaming',
      icon: Disc,
      badge: 'HOT',
      badgeColor: 'bg-pink-600 text-white font-bold',
    },

    // 4. USERS, ROLES & AFFILIATES (ইউজার্স ও রোলস)
    {
      id: 'users_roles',
      label: 'রোল ও পারমিশন সিস্টেম',
      shortLabel: 'রোলস',
      fullLabel: 'ইউজার্স, এজেন্ট ও এডমিন রোল ম্যানেজমেন্ট (Roles & Perms)',
      sublabel: 'Deposit Levels, Agents & Admins',
      category: 'enterprise',
      icon: Shield,
      badge: null,
      badgeColor: '',
      subItems: [
        {
          id: 'players',
          label: 'প্লেয়ার তালিকা (+/- ব্যালেন্স)',
          isActive: activeTab === 'users_roles' && usersSubTab === 'players',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('players');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'agents',
          label: 'অনুমোদিত এজেন্ট তালিকা',
          isActive: activeTab === 'users_roles' && usersSubTab === 'agents',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('agents');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'deposit_levels',
          label: 'ডিপোজিট লেভেলস',
          isActive: activeTab === 'users_roles' && usersSubTab === 'deposit_levels',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('deposit_levels');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'vip_tiers',
          label: 'ভিআইপি টিয়ার্স ও রুলস',
          isActive: activeTab === 'users_roles' && usersSubTab === 'vip_tiers',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('vip_tiers');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'roles_perms',
          label: 'রোল ও পারমিশন ম্যাট্রিক্স',
          isActive: activeTab === 'users_roles' && usersSubTab === 'roles_perms',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('roles_perms');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'admins',
          label: 'এডমিন ও স্টাফ একাউন্টস',
          isActive: activeTab === 'users_roles' && usersSubTab === 'admins',
          onClick: () => {
            setActiveTab('users_roles');
            setUsersSubTab('admins');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },
    {
      id: 'affiliate_system',
      label: 'অ্যাফিলিয়েট প্রোগ্রাম',
      shortLabel: 'অ্যাফিলিয়েট',
      fullLabel: 'অ্যাফিলিয়েট নেটওয়ার্ক ও কমিশন সিস্টেম (Affiliates)',
      sublabel: 'Affiliate Links & Commissions',
      category: 'enterprise',
      icon: Share2,
      badge: null,
      badgeColor: '',
      subItems: [
        {
          id: 'affiliate_settings',
          label: 'অ্যাফিলিয়েট সেটিংস ও রুলস',
          isActive: activeTab === 'affiliate_system' && affiliateSubTab === 'affiliate_settings',
          onClick: () => {
            setActiveTab('affiliate_system');
            setAffiliateSubTab('affiliate_settings');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'affiliate_list',
          label: 'পার্টনার্স তালিকা',
          isActive: activeTab === 'affiliate_system' && affiliateSubTab === 'affiliate_list',
          onClick: () => {
            setActiveTab('affiliate_system');
            setAffiliateSubTab('affiliate_list');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'affiliate_commissions',
          label: 'কমিশন হিস্ট্রি ও রেকর্ড',
          isActive: activeTab === 'affiliate_system' && affiliateSubTab === 'affiliate_commissions',
          onClick: () => {
            setActiveTab('affiliate_system');
            setAffiliateSubTab('affiliate_commissions');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },

    // 5. CUSTOMER SUPPORT & NOTICES (সাপোর্ট ও যোগাযোগ)
    {
      id: 'support',
      label: 'সাপোর্ট সেন্টার ও হেল্পডেস্ক',
      shortLabel: 'সাপোর্ট',
      fullLabel: 'সাপোর্ট প্রোগ্রাম, টিকেট ও ক্যানড রিপ্লাই (Support)',
      sublabel: 'Tickets & Canned Replies',
      category: 'support',
      icon: Headset,
      badge: unreadLiveChatTotal > 0 ? `${unreadLiveChatTotal}` : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-black animate-bounce',
      subItems: [
        {
          id: 'live_chat',
          label: 'লাইভ চ্যাট মেসেজ',
          badge: unreadLiveChatTotal > 0 ? `${unreadLiveChatTotal}` : null,
          badgeColor: 'bg-amber-400 text-slate-950 font-black animate-bounce',
          isActive: activeTab === 'support' && supportSubTab === 'live_chat',
          onClick: () => {
            setActiveTab('support');
            setSupportSubTab('live_chat');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'tickets',
          label: 'সাপোর্ট টিকেট ও হেল্পডেস্ক',
          isActive: activeTab === 'support' && supportSubTab === 'tickets',
          onClick: () => {
            setActiveTab('support');
            setSupportSubTab('tickets');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'canned_replies',
          label: 'ক্যানড কুইক রিপ্লাই',
          isActive: activeTab === 'support' && supportSubTab === 'canned_replies',
          onClick: () => {
            setActiveTab('support');
            setSupportSubTab('canned_replies');
            setIsSidebarOpenOnMobile(false);
          },
        },
      ],
    },
    {
      id: 'live_chat',
      label: 'লাইভ চ্যাট উইন্ডো',
      shortLabel: 'লাইভ চ্যাট',
      fullLabel: '২৪/৭ লাইভ কাস্টমার সাপোর্ট ও চ্যাট (Live Chat)',
      sublabel: 'Player Messages & Replies',
      category: 'support',
      icon: MessageSquare,
      badge: unreadLiveChatTotal > 0 ? `${unreadLiveChatTotal}` : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-black animate-bounce',
    },
    {
      id: 'notices',
      label: 'নোটিশ ও হেল্পলাইন',
      shortLabel: 'নোটিশ',
      fullLabel: 'স্ক্রোল নোটিশ, টেলিগ্রাম ও হেল্পলাইন (Notices)',
      sublabel: 'Marquee Notice & Social Links',
      category: 'support',
      icon: Bell,
      badge: null,
      badgeColor: '',
    },

    // 6. ENTERPRISE & INFRASTRUCTURE CONFIG (সাইট ও কোর কনফিগারেশন)
    {
      id: 'site_config',
      label: 'সাইট কনফিগ ও ব্যাকআপ',
      shortLabel: 'সাইট কনফিগ',
      fullLabel: 'ওয়েবসাইট কনফিগ, ব্যানার ও ডাটাবেস (Site Config)',
      sublabel: 'Banners, Database & Social Links',
      category: 'enterprise',
      icon: Settings,
      badge: 'হোম লিংক',
      badgeColor: 'bg-emerald-500 text-slate-950 font-black',
      subItems: [
        {
          id: 'home_game_options',
          label: 'হোম পেজ ৪টি গেম অপশন',
          badge: '৪ অপশন',
          badgeColor: 'bg-amber-400 text-slate-950 font-black',
          isActive: activeTab === 'site_config' && siteSubTab === 'home_game_options',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('home_game_options');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_general',
          label: 'জেনারেল সিস্টেম ইনফো',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_general',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_general');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_sms_email',
          label: 'SMS ও ইমেইল গেটওয়ে',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_sms_email',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_sms_email');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_database',
          label: 'ডাটাবেস ও স্টোরেজ অপ্টিমাইজ',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_database',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_database');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_wallet_config',
          label: 'ওয়ালেট ব্যালেন্স লিমিট',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_wallet_config',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_wallet_config');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_app_banners',
          label: 'হোম ব্যানার ও স্লাইডার',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_app_banners',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_app_banners');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'home_programs_link',
          label: 'হোম প্রোগ্রামস ও লিংক',
          isActive: activeTab === 'site_config' && siteSubTab === 'home_programs_link',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('home_programs_link');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'site_social_media',
          label: 'সোশ্যাল মিডিয়া ও হেল্পলাইন',
          isActive: activeTab === 'site_config' && siteSubTab === 'site_social_media',
          onClick: () => {
            setActiveTab('site_config');
            setSiteSubTab('site_social_media');
            setIsSidebarOpenOnMobile(false);
          },
        },
        {
          id: 'open_home_screen',
          label: 'সরাসরি হোম পেজ দেখুন',
          badge: 'Live',
          badgeColor: 'bg-emerald-500 text-slate-950 font-black',
          isActive: false,
          onClick: () => {
            onNavigate('home');
          },
        },
      ],
    },
    {
      id: 'home_programs',
      label: 'অল-সিস্টেমস হাব (১৩ মডিউল)',
      shortLabel: 'অল-সিস্টেম',
      fullLabel: 'সকল সিস্টেম হাব ও মডিউল ডিরেক্টরি (All Systems Hub)',
      sublabel: '13 Enterprise Modules Directory',
      category: 'enterprise',
      icon: FolderKanban,
      badge: '13 Systems',
      badgeColor: 'bg-indigo-600 text-white font-bold',
    },
  ];


  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (tabId === 'deposits') {
      setTrxFilterType('deposit');
      setTrxFilterStatus('Pending');
    } else if (tabId === 'withdrawals') {
      setTrxFilterType('withdraw');
      setTrxFilterStatus('Pending');
    } else if (tabId === 'transactions') {
      setTrxFilterType('all');
      setTrxFilterStatus('all');
    }
    setIsSidebarOpenOnMobile(false);
  };

  const currentTabInfo = adminMenuItems.find((m) => m.id === activeTab) || adminMenuItems[0];

  return (
    <div
      className={`w-full min-h-screen bg-[#04240d] text-white select-none ${adminViewMode === 'desktop' ? 'overflow-x-auto' : 'overflow-x-hidden'}`}
      style={{
        backgroundImage: "url('/images/green_abstract_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className={`min-h-screen bg-[#04240d]/85 backdrop-blur-[2px] flex flex-col relative ${adminViewMode === 'desktop' ? 'min-w-[1240px]' : 'w-full max-w-full pb-20'}`}>
        {/* Top Command Bar (মোবাইল ও ডেস্কটপ উভয় উপযোগী) */}
        <header className="sticky top-0 z-40 bg-[#063314]/95 backdrop-blur-md border-b-2 border-emerald-400/50 px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* ১. মেনু অপশন বাটন (Menu Button) */}
            <button
              type="button"
              onClick={() => setIsSidebarOpenOnMobile((prev) => !prev)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer hover:brightness-110 shrink-0 ring-1 ring-amber-300/80"
              title="মেনু অপশন খুলুন / বন্ধ করুন"
            >
              <Menu className="w-4 h-4 stroke-[2.5]" />
              <span className="font-extrabold text-xs">মেনু</span>
              {(pendingDeposits.length + pendingWithdrawals.length + unreadLiveChatTotal) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-black animate-pulse">
                  {pendingDeposits.length + pendingWithdrawals.length + unreadLiveChatTotal}
                </span>
              )}
            </button>

            {/* Desktop Left Menu Collapse Toggle (ডেস্কটপ মোডে সাইডবার সংকোচন) */}
            {adminViewMode === 'desktop' && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="hidden lg:flex p-2 rounded-xl bg-purple-900/60 border border-purple-600/60 text-slate-300 hover:text-amber-400 hover:bg-purple-800 transition active:scale-95 items-center justify-center cursor-pointer shadow-sm"
                title={isSidebarCollapsed ? 'সাইডবার প্রসারিত করুন' : 'সাইডবার সংক্ষিপ্ত করুন'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Brand Logo & Section Title */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0 ring-2 ring-amber-400/40">
                <ShieldCheck className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-black text-xs sm:text-base text-white tracking-wide flex items-center gap-1">
                    <span className="truncate">King Ludo</span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/50 font-mono font-black">
                      ADMIN PRO
                    </span>
                  </h1>
                  <span
                    className={`hidden sm:flex px-2 py-0.5 rounded-lg text-[10px] font-black items-center gap-1 ${
                      adminViewMode === 'desktop'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {adminViewMode === 'desktop' ? '🖥️ ডেস্কটপ মোড' : '📱 মোবাইল মোড'}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-purple-300 font-medium truncate hidden sm:flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-amber-300 font-bold">আইডি: {currentUser?.phone || currentUser?.id || 'admin'}</span>
                  <span className="text-purple-600">•</span>
                  <span className="text-slate-300 font-bold truncate">{currentTabInfo.fullLabel}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ২. মোবাইল ভার্সন ও ডেস্কটপ ভার্সন সুইচার (Version Switcher) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-[#031e0c] p-1 rounded-xl border border-purple-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => handleToggleViewMode('mobile')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  adminViewMode === 'mobile'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md ring-1 ring-cyan-300 font-black'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                }`}
                title="মোবাইল ভার্সন চালু করুন (রেসপন্সিভ টাচ ভিউ)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>মোবাইল</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleViewMode('desktop')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  adminViewMode === 'desktop'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                }`}
                title="ডেস্কটপ ভার্সন চালু করুন (প্রশস্ত কম্পিউটার ভিউ)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>ডেস্কটপ</span>
              </button>
            </div>

            {/* System Switcher (৩টি পূর্ণাঙ্গ সিস্টেম) */}
            <div className="hidden xl:flex items-center gap-1 bg-[#031e0c] p-1 rounded-xl border border-purple-800/80 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setAdminSystemMode('pro_gaming');
                  setActiveTab('overview');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  adminSystemMode === 'pro_gaming' && activeTab === 'overview'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow ring-1 ring-amber-300'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>🕹️ সিস্টেম ১</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminSystemMode('all_systems');
                  setActiveTab('overview');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  adminSystemMode === 'all_systems'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow ring-1 ring-indigo-300'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>🏢 সিস্টেম ২ (ERP)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminSystemMode('cashier_desk');
                  setActiveTab('overview');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  adminSystemMode === 'cashier_desk'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow ring-1 ring-emerald-300'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>💳 সিস্টেম ৩</span>
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {liveTime && (
              <div className="hidden md:flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/80 px-2 py-1 rounded-xl text-[11px] font-mono font-bold text-amber-300 shadow-inner">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{liveTime}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 border border-purple-600/60 font-bold text-xs flex items-center gap-1 shadow transition active:scale-95 cursor-pointer"
              title="প্লেয়ার স্ক্রিনে ফিরে যান"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">প্লেয়ার হোম</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-lg border border-rose-400/40 active:scale-95 transition cursor-pointer"
              title={currentUser?.id === '01910204477' || currentUser?.phone === '01910204477' ? 'লগআউট করে লগইন পেজে ফিরে যান' : 'এডমিন প্যানেল বন্ধ করে গেম হোমে ফিরে যান'}
            >
              <X className="w-4 h-4 stroke-[3]" />
              <span className="text-xs font-black">
                {currentUser?.id === '01910204477' || currentUser?.phone === '01910204477' ? 'লগআউট' : 'বাইর হন'}
              </span>
            </button>
          </div>
        </header>

        {/* ================= ৩. ফুল স্লাইডিং মেনু ড্রয়ার (MOBILE & DESKTOP MENU DRAWER) ================= */}
        {isSidebarOpenOnMobile && (
          <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
            {/* Dark Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsSidebarOpenOnMobile(false)}
            />

            {/* Sliding Drawer Container */}
            <div className="relative z-50 w-80 max-w-[88vw] bg-[#04260f]/98 border-r-2 border-emerald-400/70 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-left duration-200">
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-emerald-800/60 bg-[#063314] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md ring-1 ring-amber-300">
                    <ShieldCheck className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-white">এডমিন মাস্টার মেনু</h3>
                      <span className="text-[8px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-mono font-bold">
                        PRO
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-300 font-mono font-bold truncate">
                      ID: {currentUser?.phone || currentUser?.id || 'মাস্টার এডমিন'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSidebarOpenOnMobile(false)}
                  className="p-1.5 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:text-white hover:bg-rose-900 transition cursor-pointer"
                  title="মেনু বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Mode Toggle in Drawer */}
              <div className="p-3 bg-[#031e0c] border-b border-purple-900/40 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-200">ভার্সন নির্বাচন:</span>
                <div className="flex items-center gap-1 bg-[#052a12] p-1 rounded-xl border border-purple-700/60">
                  <button
                    type="button"
                    onClick={() => handleToggleViewMode('mobile')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      adminViewMode === 'mobile'
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>মোবাইল</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleViewMode('desktop')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      adminViewMode === 'desktop'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>ডেস্কটপ</span>
                  </button>
                </div>
              </div>

              {/* System Switcher inside Drawer */}
              <div className="p-2.5 bg-[#0e082b] border-b border-purple-900/50 space-y-1.5">
                <div className="text-[9px] font-black uppercase text-amber-400 tracking-wider px-1">
                  সিস্টেম সুইচ করুন (৩টি সিস্টেম)
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminSystemMode('pro_gaming');
                      setActiveTab('overview');
                      setIsSidebarOpenOnMobile(false);
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                      adminSystemMode === 'pro_gaming'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-purple-950/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    🕹️ গেমিং প্রো
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminSystemMode('all_systems');
                      setActiveTab('overview');
                      setIsSidebarOpenOnMobile(false);
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                      adminSystemMode === 'all_systems'
                        ? 'bg-indigo-600 text-white font-black'
                        : 'bg-purple-950/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    🏢 অল ERP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminSystemMode('cashier_desk');
                      setActiveTab('overview');
                      setIsSidebarOpenOnMobile(false);
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition cursor-pointer ${
                      adminSystemMode === 'cashier_desk'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-purple-950/60 text-purple-300 hover:text-white'
                    }`}
                  >
                    💳 ক্যাশিয়ার
                  </button>
                </div>
              </div>

              {/* Full Categorized Menu List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
                <div className="px-2 pt-1 pb-1 text-[10px] font-black text-amber-400/90 uppercase tracking-wider flex items-center justify-between border-b border-purple-800/40 pb-0.5">
                  <span>সকল কন্ট্রোল অপশন</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-mono font-bold">
                    {adminMenuItems.length} Modules
                  </span>
                </div>

                {adminMenuItems.map((item, idx) => {
                  const prevItem = idx > 0 ? adminMenuItems[idx - 1] : null;
                  const isNewCategory = !prevItem || prevItem.category !== item.category;
                  const categoryTitles: Record<AdminMenuItem['category'], { title: string; icon: string }> = {
                    core: { title: 'কোর কন্ট্রোল ও লেনদেন', icon: '👑' },
                    finance: { title: 'ফাইন্যান্স ও ব্যাংকিং', icon: '💰' },
                    gaming: { title: 'গেম ক্যাটাগরি ও ইঞ্জিন', icon: '🎮' },
                    enterprise: { title: 'ইউজার্স, রোল ও কনফিগ', icon: '⚙️' },
                    support: { title: 'কাস্টমার সাপোর্ট ও নোটিশ', icon: '🎧' },
                  };
                  const catInfo = categoryTitles[item.category];
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                  const isExpanded = Boolean(expandedMenuIds[item.id]);
                  const hasActiveSub = Boolean(item.subItems?.some((sub) => sub.isActive));

                  return (
                    <React.Fragment key={`drawer-${item.id}`}>
                      {isNewCategory && (
                        <div className="pt-2.5 pb-1 px-1 flex items-center justify-between border-b border-purple-800/30">
                          <span className="text-[10px] font-black text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
                            <span>{catInfo.icon}</span>
                            <span>{catInfo.title}</span>
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div
                          onClick={() => {
                            handleSelectTab(item.id);
                            if (hasSubItems) {
                              setExpandedMenuIds((prev) => ({ ...prev, [item.id]: true }));
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer select-none ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-400/25 via-purple-900/60 to-purple-950 text-amber-300 font-black border-l-4 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                              : hasActiveSub
                              ? 'bg-purple-900/40 text-amber-200 border-l-4 border-amber-400/60'
                              : 'text-purple-200 hover:bg-purple-900/40 hover:text-white border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 ${
                                isActive
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-purple-900/60 text-amber-300 border border-purple-700/40'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold block truncate">{item.label}</span>
                              <span className="text-[9px] text-purple-400 block truncate">{item.sublabel}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {item.badge !== null && item.badge !== undefined && (
                              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full shadow-sm ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}

                            {hasSubItems && (
                              <button
                                type="button"
                                onClick={(e) => toggleMenuExpand(item.id, e)}
                                className="p-1 rounded-md hover:bg-purple-800/60 text-purple-300 hover:text-white transition cursor-pointer"
                              >
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-amber-300" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Drawer Accordion Sub-items */}
                        {hasSubItems && isExpanded && item.subItems && (
                          <div className="ml-5 pl-2.5 border-l-2 border-purple-800/60 space-y-0.5 py-0.5">
                            {item.subItems.map((sub) => (
                              <button
                                key={`drawer-sub-${item.id}-${sub.id}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sub.onClick();
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition cursor-pointer ${
                                  sub.isActive
                                    ? 'bg-amber-400/20 text-amber-300 font-bold border-l-2 border-amber-400'
                                    : 'text-purple-300 hover:bg-purple-900/40 hover:text-white border-l-2 border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      sub.isActive ? 'bg-amber-400 ring-2 ring-amber-400/40' : 'bg-purple-500/60'
                                    }`}
                                  />
                                  <span className="truncate text-[11px]">{sub.label}</span>
                                </div>
                                {sub.badge !== null && sub.badge !== undefined && (
                                  <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full shadow-sm shrink-0 ${sub.badgeColor || 'bg-purple-950 text-purple-300 border border-purple-800'}`}>
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-3 border-t border-purple-800/60 bg-[#031e0c] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpenOnMobile(false);
                    onNavigate('home');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow border border-purple-700/50 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>প্লেয়ার স্ক্রিনে যান</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpenOnMobile(false);
                    onNavigate('home');
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{currentUser?.id === '01910204477' || currentUser?.phone === '01910204477' ? 'লগআউট করুন' : 'বাইর হন'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2-COLUMN WORKSPACE: LEFT MENU + RIGHT CONTENT ================= */}
        <div className="flex-1 flex flex-row relative min-h-0">
          {/* Permanent Desktop Left Sidebar (ডেস্কটপ মোডে স্থায়ী সাইডবার) */}
          {adminViewMode === 'desktop' && (
            <aside
              className={`flex flex-col bg-[#04260f]/95 backdrop-blur-md border-r-2 border-emerald-900/60 shadow-2xl transition-all duration-300 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] select-none ${
                isSidebarCollapsed ? 'w-20' : 'w-72 xl:w-80'
              }`}
            >
              {/* Admin Profile Overview Card */}
              {!isSidebarCollapsed ? (
                <div className="p-3.5 border-b border-emerald-900/50 bg-[#063314]/80">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-base shadow-lg ring-2 ring-amber-300">
                        <ShieldCheck className="w-5 h-5 fill-slate-950" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#063314] animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-black text-white truncate">মাস্টার এডমিন</h3>
                        <span className="text-[8px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-mono font-bold">
                          PRO
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-300 font-mono font-bold truncate">ID: {currentUser?.phone || currentUser?.id || 'মাস্টার এডমিন'}</p>
                      <p className="text-[9px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ডেস্কটপ কন্ট্রোল প্যানেল
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 border-b border-purple-900/50 flex flex-col items-center justify-center">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md ring-2 ring-amber-300">
                    <ShieldCheck className="w-5 h-5 fill-slate-950" />
                  </div>
                </div>
              )}

              {/* Menu Items Section */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
                {!isSidebarCollapsed && (
                  <div className="px-2 pt-1 pb-1 text-[10px] font-black text-amber-400/90 uppercase tracking-wider flex items-center justify-between border-b border-purple-800/30">
                    <span>কন্ট্রোল মেন্যু</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-mono font-bold">
                      {adminMenuItems.length} Modules
                    </span>
                  </div>
                )}

                {adminMenuItems.map((item, idx) => {
                  const prevItem = idx > 0 ? adminMenuItems[idx - 1] : null;
                  const isNewCategory = !prevItem || prevItem.category !== item.category;
                  const categoryTitles: Record<AdminMenuItem['category'], { title: string; icon: string }> = {
                    core: { title: 'কোর কন্ট্রোল ও লেনদেন', icon: '👑' },
                    finance: { title: 'ফাইন্যান্স ও ব্যাংকিং', icon: '💰' },
                    gaming: { title: 'গেম ক্যাটাগরি ও ইঞ্জিন', icon: '🎮' },
                    enterprise: { title: 'ইউজার্স, রোল ও কনফিগ', icon: '⚙️' },
                    support: { title: 'কাস্টমার সাপোর্ট ও নোটিশ', icon: '🎧' },
                  };
                  const catInfo = categoryTitles[item.category];
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                  const isExpanded = Boolean(expandedMenuIds[item.id]);
                  const hasActiveSub = Boolean(item.subItems?.some((sub) => sub.isActive));

                  if (isSidebarCollapsed) {
                    return (
                      <React.Fragment key={`desktop-collapsed-${item.id}`}>
                        {isNewCategory && <div className="my-1.5 border-t border-purple-800/40" />}
                        <button
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer relative group ${
                            isActive || hasActiveSub
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400/50'
                              : 'text-purple-300 hover:bg-purple-900/50 hover:text-white'
                          }`}
                          title={item.fullLabel}
                        >
                          <IconComponent className="w-5 h-5 shrink-0" />
                          {item.badge !== null && item.badge !== undefined && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-[#04260f]" />
                          )}
                        </button>
                      </React.Fragment>
                    );
                  }

                  return (
                    <React.Fragment key={`desktop-item-${item.id}`}>
                      {isNewCategory && (
                        <div className="pt-2.5 pb-1 px-1 flex items-center justify-between border-b border-purple-800/30">
                          <span className="text-[10px] font-black text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
                            <span>{catInfo.icon}</span>
                            <span>{catInfo.title}</span>
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div
                          onClick={() => {
                            handleSelectTab(item.id);
                            if (hasSubItems) {
                              setExpandedMenuIds((prev) => ({ ...prev, [item.id]: true }));
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer select-none group ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-400/25 via-purple-900/60 to-purple-950 text-amber-300 font-black border-l-4 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                              : hasActiveSub
                              ? 'bg-purple-900/40 text-amber-200 border-l-4 border-amber-400/60'
                              : 'text-purple-200 hover:bg-purple-900/40 hover:text-white border-l-4 border-transparent'
                          }`}
                          title={item.fullLabel}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${
                                isActive
                                  ? 'bg-amber-400 text-slate-950 shadow'
                                  : 'bg-purple-900/50 text-amber-300 border border-purple-700/40'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold block truncate">{item.label}</span>
                              <span className="text-[9px] text-purple-400 block truncate">{item.sublabel}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {item.badge !== null && item.badge !== undefined && (
                              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full shadow-sm shrink-0 ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}

                            {hasSubItems && (
                              <button
                                type="button"
                                onClick={(e) => toggleMenuExpand(item.id, e)}
                                className="p-1 rounded-md hover:bg-purple-800/60 text-purple-300 hover:text-white transition cursor-pointer"
                                title={isExpanded ? 'সংকোচন করুন' : 'প্রসারিত করুন'}
                              >
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-amber-300" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Desktop Accordion Sub-items */}
                        {hasSubItems && isExpanded && item.subItems && (
                          <div className="ml-5 pl-2.5 border-l-2 border-purple-800/60 space-y-0.5 py-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                            {item.subItems.map((sub) => (
                              <button
                                key={`desktop-sub-${item.id}-${sub.id}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sub.onClick();
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition cursor-pointer ${
                                  sub.isActive
                                    ? 'bg-amber-400/20 text-amber-300 font-bold border-l-2 border-amber-400 shadow-sm'
                                    : 'text-purple-300 hover:bg-purple-900/40 hover:text-white border-l-2 border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      sub.isActive ? 'bg-amber-400 ring-2 ring-amber-400/40' : 'bg-purple-500/60'
                                    }`}
                                  />
                                  <span className="truncate text-[11px] font-medium">{sub.label}</span>
                                </div>
                                {sub.badge !== null && sub.badge !== undefined && (
                                  <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full shadow-sm shrink-0 ${sub.badgeColor || 'bg-purple-950 text-purple-300 border border-purple-800'}`}>
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Sidebar Bottom Footer Info */}
              {!isSidebarCollapsed ? (
                <div className="p-3 border-t border-purple-900/50 bg-[#031e0c] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-purple-300 px-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>সার্ভার পিং: ১২ms</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">ডেস্কটপ মোড</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="w-full py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-700/60 text-purple-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{currentUser?.id === '01910204477' || currentUser?.phone === '01910204477' ? 'লগআউট করুন' : 'প্লেয়ার হোমে ফিরে যান'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-2 border-t border-purple-900/50 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="p-2 rounded-xl bg-purple-900/60 text-purple-300 hover:text-white transition"
                    title="প্লেয়ার হোমে যান"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </aside>
          )}

        {/* ================= RIGHT CONTENT WORKSPACE ================= */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 overflow-y-auto space-y-4 pb-28">
          {/* Active Tab Breadcrumb & Title Card */}
          <div className="bg-gradient-to-r from-[#140b36] via-[#10082c] to-[#052a12] p-3.5 sm:p-4 rounded-2xl border border-purple-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                {React.createElement(currentTabInfo.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{currentTabInfo.fullLabel}</span>
                  {currentTabInfo.badge !== null && currentTabInfo.badge !== undefined && (typeof currentTabInfo.badge === 'number' ? currentTabInfo.badge > 0 : Boolean(currentTabInfo.badge)) && (
                    <span className={`px-2 py-0.5 text-xs font-black rounded-full ${currentTabInfo.badgeColor}`}>
                      {currentTabInfo.badge}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-purple-300">{currentTabInfo.sublabel}</p>
              </div>
            </div>

            {/* Quick action buttons in tab header */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] bg-purple-900/60 border border-purple-700/50 text-amber-300 font-mono font-bold px-2.5 py-1 rounded-xl">
                মাস্টার কন্ট্রোল
              </span>
            </div>
          </div>

      {/* ================= TAB 1: MASTER PRO GAMING SYSTEM (সিস্টেম ১) ================= */}
      {activeTab === 'overview' && adminSystemMode === 'pro_gaming' && (
        <StandardAdminDashboard
          currentUser={currentUser}
          registeredUsers={registeredUsers}
          transactions={transactions}
          appSettings={appSettings}
          pendingDeposits={pendingDeposits}
          pendingWithdrawals={pendingWithdrawals}
          unreadChatCount={unreadLiveChatTotal}
          onNavigateTab={(tab) => {
            handleSelectTab(tab);
          }}
          onApproveTransaction={onApproveTransaction}
          onRejectTransaction={onRejectTransaction}
          onNavigatePlayerHome={() => onNavigate('home')}
        />
      )}

      {/* ================= TAB 1 (ALT): ALL SYSTEMS ENTERPRISE ERP (সিস্টেম ২) ================= */}
      {activeTab === 'overview' && adminSystemMode === 'all_systems' && (
        <AllSystemsHomePageView
          currentUser={currentUser}
          registeredUsers={registeredUsers}
          transactions={transactions}
          appSettings={appSettings}
          sentNotifications={sentNotifications}
          liveChatMessages={liveChatMessages}
          matchHistory={matchHistory}
          pendingDeposits={pendingDeposits}
          pendingWithdrawals={pendingWithdrawals}
          onNavigateTab={(tab, subTab) => {
            setActiveTab(tab as typeof activeTab);
            if (subTab) {
              if (tab === 'finance') setFinanceSubTab(subTab as any);
              if (tab === 'users_roles') setUsersSubTab(subTab as any);
              if (tab === 'game_system') setGameSubTab(subTab as any);
              if (tab === 'agent_config') setAgentSubTab(subTab as any);
              if (tab === 'affiliate_system') setAffiliateSubTab(subTab as any);
              if (tab === 'site_config') setSiteSubTab(subTab as any);
              if (tab === 'support') setSupportSubTab(subTab as any);
            }
          }}
          onNavigatePlayerHome={() => onNavigate('home')}
          onUpdateAppSettings={onUpdateAppSettings}
          onPlayTone={handlePlayTone}
          setUserSearch={setUserSearch}
          setTrxFilterType={setTrxFilterType}
          setTrxFilterStatus={setTrxFilterStatus}
        />
      )}

      {/* ================= TAB 1 (ALT 2): FAST CASHIER & BANKING TERMINAL (সিস্টেম ৩) ================= */}
      {activeTab === 'overview' && adminSystemMode === 'cashier_desk' && (
        <FinanceProgramView
          transactions={transactions}
          onApproveTransaction={onApproveTransaction}
          onRejectTransaction={onRejectTransaction}
          onBulkApproveTransactions={onBulkApproveTransactions}
          onBulkRejectTransactions={onBulkRejectTransactions}
          subTab={financeSubTab}
          onSubTabChange={setFinanceSubTab}
        />
      )}

      {/* ================= TAB 2: PENDING & COMPLETED REQUESTS ================= */}
      {(activeTab === 'requests' || activeTab === 'deposits' || activeTab === 'withdrawals' || activeTab === 'transactions') && (
        <div className="space-y-3.5 animate-in fade-in duration-200 relative">
          {/* Toast / Notification Banner for Bulk Actions */}
          {requestsBulkSuccessNotice && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                <span className="text-xs font-black">{requestsBulkSuccessNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setRequestsBulkSuccessNotice(null)}
                className="p-1 hover:bg-emerald-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Real-time Pending Requests Alert Banner */}
          {(trxCounts.pendingDep > 0 || trxCounts.pendingWith > 0) && (
            <div className="bg-gradient-to-r from-purple-950 via-[#260f4c] to-purple-950 border-2 border-amber-400/80 p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>জরুরি রিকোয়েস্ট অপেক্ষমান!</span>
                    <span className="bg-rose-600 text-white text-[10px] px-2 py-0.2 rounded-full font-mono font-black">
                      {trxCounts.pendingDep + trxCounts.pendingWith} টি নতুন
                    </span>
                  </h4>
                  <p className="text-[11px] text-purple-200">
                    {trxCounts.pendingDep > 0 && `${trxCounts.pendingDep} টি ডিপোজিট`}
                    {trxCounts.pendingDep > 0 && trxCounts.pendingWith > 0 && ' ও '}
                    {trxCounts.pendingWith > 0 && `${trxCounts.pendingWith} টি উইথড্র`} অনুমোদনের অপেক্ষায়।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {trxCounts.pendingDep > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrxFilterType('deposit');
                      setTrxFilterStatus('Pending');
                    }}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>ডিপোজিট ({trxCounts.pendingDep})</span>
                  </button>
                )}
                {trxCounts.pendingWith > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrxFilterType('withdraw');
                      setTrxFilterStatus('Pending');
                    }}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>উইথড্র ({trxCounts.pendingWith})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Transaction Search & Filter Bar */}
          <div className="bg-[#052a12] p-3 rounded-2xl border border-purple-700/50 space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ফোন নম্বর, TrxID বা মাধ্যম দিয়ে খুঁজুন..."
                  value={trxSearch}
                  onChange={(e) => setTrxSearch(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-amber-400"
                />
                {trxSearch && (
                  <button
                    type="button"
                    onClick={() => setTrxSearch('')}
                    className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white p-0.5 rounded cursor-pointer"
                    title="মুছুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Manual Transaction Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setManualTrxUserId(safeRegisteredUsers[0]?.id || '');
                  setManualTrxType('deposit');
                  setManualTrxAmount('');
                  setManualTrxMethod('bKash');
                  setManualTrxNote('');
                  setShowManualTrxModal(true);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ম্যানুয়াল লেনদেন (New)</span>
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setTrxFilterType('all');
                  setTrxFilterStatus('all');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  trxFilterType === 'all' && trxFilterStatus === 'all'
                    ? 'bg-amber-400 text-slate-950 font-black shadow'
                    : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                }`}
              >
                সব ({trxCounts.total})
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrxFilterType('deposit');
                  setTrxFilterStatus('Pending');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                  trxFilterType === 'deposit' && trxFilterStatus === 'Pending'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'bg-purple-950/80 text-emerald-400 hover:bg-purple-900 border border-purple-800/40'
                }`}
              >
                <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                <span>পেন্ডিং ডিপোজিট</span>
                {trxCounts.pendingDep > 0 && (
                  <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-600/50">
                    {trxCounts.pendingDep}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrxFilterType('withdraw');
                  setTrxFilterStatus('Pending');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                  trxFilterType === 'withdraw' && trxFilterStatus === 'Pending'
                    ? 'bg-rose-500 text-white font-black shadow'
                    : 'bg-purple-950/80 text-rose-400 hover:bg-purple-900 border border-purple-800/40'
                }`}
              >
                <ArrowUpRight className="w-3 h-3 text-rose-400" />
                <span>পেন্ডিং উইথড্র</span>
                {trxCounts.pendingWith > 0 && (
                  <span className="bg-rose-950 text-rose-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full border border-rose-600/50">
                    {trxCounts.pendingWith}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrxFilterType('all');
                  setTrxFilterStatus('Success');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                  trxFilterType === 'all' && trxFilterStatus === 'Success'
                    ? 'bg-emerald-600 text-white font-black shadow'
                    : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>সফল ({trxCounts.success})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrxFilterType('all');
                  setTrxFilterStatus('Failed');
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                  trxFilterType === 'all' && trxFilterStatus === 'Failed'
                    ? 'bg-rose-600 text-white font-black shadow'
                    : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                }`}
              >
                <XCircle className="w-3 h-3 text-rose-400" />
                <span>বাতিল ({trxCounts.failed})</span>
              </button>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-[10px] text-purple-300 pt-0.5 border-t border-purple-800/40">
              <span>
                মোট {safeTransactions.length} টির মধ্যে <strong className="text-amber-300">{filteredTrx.length}</strong> টি রিকোয়েস্ট দেখানো হচ্ছে
              </span>
              {(trxSearch || trxFilterType !== 'all' || trxFilterStatus !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setTrxSearch('');
                    setTrxFilterType('all');
                    setTrxFilterStatus('all');
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                >
                  ফিল্টার মুছুন (Reset)
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Ribbon for Requests */}
          {pendingInFilteredTrx.length > 0 && (
            <div className="bg-gradient-to-r from-[#170a36] via-[#210f4c] to-[#170a36] p-3 rounded-2xl border border-amber-500/40 shadow-lg flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSelectAllPendingRequests}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-white font-bold text-xs border border-purple-700/70 transition cursor-pointer active:scale-95 shadow"
                >
                  {selectedRequestsTrxIds.length > 0 && selectedRequestsTrxIds.length === pendingInFilteredTrx.length ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-purple-300" />
                  )}
                  <span>
                    {selectedRequestsTrxIds.length > 0 && selectedRequestsTrxIds.length === pendingInFilteredTrx.length
                      ? 'সব আনচেক করুন'
                      : `সব মুলতুবি নির্বাচন (${pendingInFilteredTrx.length})`}
                  </span>
                </button>

                {pendingDepositsInFilteredTrx.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllPendingDepRequests}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>ডিপোজিট ({pendingDepositsInFilteredTrx.length})</span>
                  </button>
                )}

                {pendingWithdrawalsInFilteredTrx.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllPendingWithRequests}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-700/60 transition cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>উইথড্র ({pendingWithdrawalsInFilteredTrx.length})</span>
                  </button>
                )}

                {selectedRequestsTrxIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearRequestsSelection}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer"
                  >
                    নির্বাচন রিসেট
                  </button>
                )}
              </div>

              {selectedRequestsTrxIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300 font-black bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/50 shadow">
                    নির্বাচিত: {selectedRequestsTrxIds.length} টি • ৳{selectedRequestsStats.totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* List of Transactions */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filteredTrx.length === 0 ? (
              <div className="bg-[#052a12] p-8 rounded-2xl text-center text-xs text-purple-300 border border-purple-800/40 space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-950 mx-auto flex items-center justify-center text-purple-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <p className="text-white font-bold">কোন ট্রানজাকশন রিকোয়েস্ট পাওয়া যায়নি।</p>
                {(trxSearch || trxFilterType !== 'all' || trxFilterStatus !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrxSearch('');
                      setTrxFilterType('all');
                      setTrxFilterStatus('all');
                    }}
                    className="px-3 py-1.5 bg-purple-900 text-amber-300 text-[11px] font-bold rounded-xl border border-purple-700/50"
                  >
                    সব লেনদেন দেখুন
                  </button>
                )}
              </div>
            ) : (
              filteredTrx.map((trx, tIdx) => {
                // If item is actively being processed in bulk, show optimistic skeleton card
                if (requestsBulkProgress.processingIds.includes(trx.id)) {
                  return (
                    <BulkTransactionSkeletonCard
                      key={`admin-skeleton-${trx.id || tIdx}`}
                      action={requestsBulkProgress.action}
                      type={trx.type}
                      amount={trx.amount}
                      accountNumber={trx.accountNumber}
                      paymentMethod={trx.paymentMethod}
                    />
                  );
                }

                const isSelected = selectedRequestsTrxIds.includes(trx.id);
                return (
                  <div
                    key={`admin-trx-${trx.id || tIdx}-${tIdx}`}
                    className={`bg-[#052a12] p-3 rounded-2xl border space-y-2 shadow-md transition relative ${
                      isSelected
                        ? 'border-amber-400 bg-[#22104a] ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'border-purple-700/40 hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Checkbox for Pending Status */}
                        {trx.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleToggleSelectRequest(trx.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 shrink-0 ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                                : 'bg-[#031e0c] text-purple-400 border-purple-700 hover:border-amber-400/70 hover:text-white'
                            }`}
                            title={isSelected ? 'আনচেক করুন' : 'নির্বাচন করুন'}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-slate-950" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                            <span className="text-[10px] font-black hidden sm:inline">
                              {isSelected ? 'সিলেক্টেড' : 'সিলেক্ট'}
                            </span>
                          </button>
                        )}

                        <span
                          className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                            trx.type === 'deposit' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50' : 'bg-rose-950 text-rose-400 border border-rose-700/50'
                          }`}
                        >
                          {trx.type === 'deposit' ? (
                            <>
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                              <span>ডিপোজিট (Deposit)</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>উইথড্র (Withdraw)</span>
                            </>
                          )}
                        </span>
                        {trx.paymentMethod === 'BinancePay' ? (
                          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-2 py-0.5 rounded-lg font-black text-xs flex items-center gap-1">
                            <span>⬡</span> BinancePay
                          </span>
                        ) : trx.paymentMethod === 'Cryptocurrency' ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-lg font-black text-xs flex items-center gap-1">
                            <span>₮</span> {trx.cryptoNetwork || 'USDT Crypto'}
                          </span>
                        ) : (
                          <span className="font-extrabold text-xs text-white bg-purple-950 px-2 py-0.5 rounded-lg border border-purple-800/40">
                            {trx.paymentMethod || 'Mobile Banking'}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          trx.status === 'Pending'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : trx.status === 'Success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {trx.status === 'Pending' ? 'পেন্ডিং (Pending)' : trx.status === 'Success' ? 'সফল (Success)' : 'বাতিল (Failed)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-900/40">
                      <div className="space-y-1">
                        {trx.userId && (
                          <div className="text-amber-300 font-mono text-[11px] flex items-center gap-1.5 flex-wrap bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/40 w-fit">
                            <span className="text-amber-400 font-bold">ইউজার আইডি (User ID):</span>
                            <strong className="text-white font-black">{trx.userId}</strong>
                            {trx.userName && <span className="text-purple-300 font-sans">({trx.userName})</span>}
                          </div>
                        )}
                        <div className="text-purple-300 font-mono text-[11px] flex items-center gap-1 flex-wrap">
                          <span>
                            {trx.paymentMethod === 'BinancePay'
                              ? 'Binance Pay ID/Email: '
                              : trx.paymentMethod === 'Cryptocurrency'
                              ? 'Crypto Pay ID / Wallet: '
                              : 'অ্যাকাউন্ট নম্বর: '}
                          </span>
                          <strong className="text-white break-all">{trx.accountNumber || 'N/A'}</strong>
                          {trx.accountNumber && (
                            <button
                              type="button"
                              onClick={() => handleCopyTrx(trx.id, trx.accountNumber!, 'phone')}
                              className="text-purple-400 hover:text-white p-0.5 ml-0.5 cursor-pointer"
                              title="নম্বর কপি করুন"
                            >
                              {copiedTrxPhone === trx.id ? (
                                <span className="text-[9px] text-emerald-400 font-sans font-bold">কপি!</span>
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          )}
                        </div>
                        {trx.trxId && (
                          <div className="text-purple-300 font-mono text-[11px] flex items-center gap-1 flex-wrap">
                            <span>{trx.paymentMethod === 'Cryptocurrency' ? 'TxHash: ' : 'TrxID / OrderID: '}</span>
                            <strong className="text-amber-300 break-all">{trx.trxId}</strong>
                            <button
                              type="button"
                              onClick={() => handleCopyTrx(trx.id, trx.trxId!, 'id')}
                              className="text-purple-400 hover:text-white p-0.5 ml-0.5 cursor-pointer"
                              title="TrxID কপি করুন"
                            >
                              {copiedTrxId === trx.id ? (
                                <span className="text-[9px] text-emerald-400 font-sans font-bold">কপি!</span>
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                        {trx.type === 'withdraw' && (() => {
                          const reqUser = safeRegisteredUsers.find(
                            (u) => (trx.userId && u.id === trx.userId) || (trx.userPhone && u.phone === trx.userPhone)
                          );
                          const userAccounts = reqUser?.withdrawalAccounts;
                          const boundNum = trx.paymentMethod === 'bKash' 
                            ? userAccounts?.bkash 
                            : trx.paymentMethod === 'Nagad' 
                            ? userAccounts?.nagad 
                            : trx.paymentMethod === 'Rocket' 
                            ? userAccounts?.rocket 
                            : trx.paymentMethod === 'Upay' 
                            ? userAccounts?.upay 
                            : undefined;

                          const isMatched = Boolean(boundNum && trx.accountNumber && boundNum.trim() === trx.accountNumber.trim());

                          return (
                            <div className="space-y-1 pt-1.5 border-t border-purple-900/40">
                              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  <span>উইথড্র পাসওয়ার্ড যাচাইকৃত</span>
                                </span>

                                {isMatched ? (
                                  <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>লিংকড নম্বর ম্যাচিং ({trx.paymentMethod})</span>
                                  </span>
                                ) : boundNum ? (
                                  <span className="bg-amber-950/80 border border-amber-600/50 text-amber-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    <span>ভিন্ন নম্বর (সেভ করা: {boundNum})</span>
                                  </span>
                                ) : (
                                  <span className="bg-purple-950/80 border border-purple-700/50 text-purple-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                    <span>রেজিস্টার্ড নেই</span>
                                  </span>
                                )}
                              </div>

                              {userAccounts && (userAccounts.bkash || userAccounts.nagad || userAccounts.rocket || userAccounts.upay) && (
                                <div className="text-[9px] font-mono text-purple-300 bg-[#0a041c] p-1.5 rounded-lg border border-purple-800/40 flex items-center gap-2 flex-wrap">
                                  <span className="text-amber-300 font-sans font-bold">ইউজারের সেভ করা নম্বর:</span>
                                  {userAccounts.bkash && <span>bKash: <strong className="text-pink-300">{userAccounts.bkash}</strong></span>}
                                  {userAccounts.nagad && <span>Nagad: <strong className="text-orange-300">{userAccounts.nagad}</strong></span>}
                                  {userAccounts.rocket && <span>Rocket: <strong className="text-purple-300">{userAccounts.rocket}</strong></span>}
                                  {userAccounts.upay && <span>Upay: <strong className="text-amber-300">{userAccounts.upay}</strong></span>}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <p className="text-[10px] text-slate-400">{trx.date} • {trx.time}</p>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className="text-base font-black font-mono text-amber-300 block">
                          ৳{trx.amount}
                        </span>
                        {(trx.paymentMethod === 'BinancePay' || trx.paymentMethod === 'Cryptocurrency' || trx.cryptoAmount) && (
                          <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 block mt-0.5">
                            ≈ ${trx.cryptoAmount || (trx.amount / (appSettings.usdtExchangeRate || 125)).toFixed(2)} USDT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-900/50">
                      {trx.status === 'Pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveTransaction(trx.id)}
                            className="flex-1 min-w-[130px] py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer transition active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন (Approve)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setRejectTrxModal({
                                id: trx.id,
                                type: trx.type,
                                amount: trx.amount,
                                userName: trx.userName,
                                phone: trx.accountNumber || trx.userPhone,
                                reason: trx.type === 'deposit' ? 'ভুল TrxID বা জমা তথ্য' : 'ভুল উইথড্র অ্যাকাউন্ট বা তথ্য',
                              })
                            }
                            className="flex-1 min-w-[110px] py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer transition active:scale-95"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>বাতিল (Reject)</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              trx.status === 'Success'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {trx.status === 'Success' ? '✓ সফলভাবে সম্পন্ন' : '✗ বাতিলকৃত'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() =>
                            setEditTrxModal({
                              id: trx.id,
                              amount: trx.amount,
                              accountNumber: trx.accountNumber || '',
                              trxId: trx.trxId || '',
                              type: trx.type,
                            })
                          }
                          className="py-1 px-2.5 bg-purple-900/70 hover:bg-purple-800 text-purple-200 hover:text-amber-300 font-bold text-[11px] rounded-lg border border-purple-700/50 transition cursor-pointer flex items-center gap-1"
                          title="লেনদেনের তথ্য এডিট করুন"
                        >
                          <Edit className="w-3 h-3" />
                          <span>এডিট</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTrxPrompt(trx.id)}
                          className="py-1 px-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-[11px] rounded-lg border border-rose-800/40 transition cursor-pointer flex items-center gap-1"
                          title="রেকর্ড ডিলিট করুন"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>মুছুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Floating Bulk Command Bar for Requests Tab */}
          {selectedRequestsTrxIds.length > 0 && (
            <div className="sticky bottom-2 z-30 bg-gradient-to-r from-[#063314] via-[#095220] to-[#063314] border-2 border-amber-400 p-3 sm:p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                    <CheckCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-extrabold text-sm">
                        {selectedRequestsStats.count} টি রিকোয়েস্ট নির্বাচিত
                      </span>
                      <span className="font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 text-xs">
                        মোট: ৳{selectedRequestsStats.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200 mt-0.5">
                      {selectedRequestsStats.depCount > 0 && `${selectedRequestsStats.depCount}টি ডিপোজিট (৳${selectedRequestsStats.depTotal.toLocaleString()})`}
                      {selectedRequestsStats.depCount > 0 && selectedRequestsStats.withCount > 0 && ' • '}
                      {selectedRequestsStats.withCount > 0 && `${selectedRequestsStats.withCount}টি উইথড্র (৳${selectedRequestsStats.withTotal.toLocaleString()})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkFinancialSafetyAcknowledged(false);
                      setRequestsBulkModal({ action: 'approve', ids: [...selectedRequestsTrxIds] });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>এক ক্লিকে অনুমোদন ({selectedRequestsStats.count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBulkFinancialSafetyAcknowledged(false);
                      setRequestsBulkModal({ action: 'reject', ids: [...selectedRequestsTrxIds] });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>এক ক্লিকে বাতিল ({selectedRequestsStats.count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearRequestsSelection}
                    className="p-2.5 bg-purple-900/60 hover:bg-purple-800 text-purple-300 rounded-xl transition cursor-pointer"
                    title="নির্বাচন মুছুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Action Confirmation Modal for Requests Tab */}
          {requestsBulkModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-[#14092f] border-2 border-amber-400 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        requestsBulkModal.action === 'approve'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {requestsBulkModal.action === 'approve' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        {requestsBulkModal.action === 'approve'
                          ? 'বাল্ক অনুমোদন নিশ্চিতকরণ (Bulk Approval)'
                          : 'বাল্ক বাতিল নিশ্চিতকরণ (Bulk Rejection)'}
                      </h3>
                      <p className="text-[11px] text-purple-300">
                        এক ক্লিকে একাধিক পেন্ডিং রিকোয়েস্ট সমাধান করুন
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequestsBulkModal(null)}
                    className="p-1 text-purple-400 hover:text-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#0b041e] p-3 rounded-2xl border border-purple-800/50">
                    <span className="text-[11px] text-purple-300 block">নির্বাচিত রিকোয়েস্ট</span>
                    <span className="text-lg font-black text-white font-mono">
                      {requestsBulkModal.ids?.length || 0} টি
                    </span>
                  </div>
                  <div className="bg-[#0b041e] p-3 rounded-2xl border border-purple-800/50">
                    <span className="text-[11px] text-purple-300 block">মোট পরিমাণ</span>
                    <span className="text-lg font-black text-amber-300 font-mono">
                      ৳{selectedRequestsStats.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Specifics for deposit vs withdraw */}
                <div className="bg-[#0b041e]/90 p-3 rounded-2xl border border-purple-800/40 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      ডিপোজিট রিকোয়েস্ট:
                    </span>
                    <span className="font-mono font-bold">
                      {selectedRequestsStats.depCount} টি (৳{selectedRequestsStats.depTotal.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-rose-300">
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      উইথড্র রিকোয়েস্ট:
                    </span>
                    <span className="font-mono font-bold">
                      {selectedRequestsStats.withCount} টি (৳{selectedRequestsStats.withTotal.toLocaleString()})
                    </span>
                  </div>
                </div>

                {/* List Preview */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-purple-300">রিকোয়েস্ট তালিকা:</span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                    {selectedRequestsTrx.map((trx, mIdx) => (
                      <div
                        key={`tab2-modal-trx-${trx.id || mIdx}-${mIdx}`}
                        className="p-2 bg-[#0b041e] rounded-xl border border-purple-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              trx.type === 'deposit'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                            }`}
                          >
                            {trx.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                          </span>
                          <span className="font-mono text-white text-[11px]">{trx.accountNumber || trx.trxId || 'N/A'}</span>
                          <span className="text-purple-400 text-[10px]">({trx.paymentMethod})</span>
                        </div>
                        <span className="font-mono font-black text-amber-300 text-xs">৳{trx.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accidental Financial Update Prevention & Warning Box */}
                <div className="bg-red-950/40 border-2 border-red-500/50 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-black">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>দুর্ঘটনাজনিত আর্থিক আপডেট রোধে বিশেষ নিরাপত্তা নিশ্চিতকরণ</span>
                  </div>
                  <p className="text-[11px] text-purple-200 leading-relaxed">
                    {requestsBulkModal.action === 'approve'
                      ? 'সাবধান: এটি নিশ্চিত করলে নির্বাচিত গ্রাহকদের অ্যাকাউন্টে এক ক্লিকে ডিপোজিটের টাকা যোগ হবে এবং উইথড্রল সম্পন্ন হবে।'
                      : 'সাবধান: এটি নিশ্চিত করলে পেন্ডিং উইথড্রলের টাকা গ্রাহকদের ওয়ালেটে রিফান্ড করা হবে এবং ডিপোজিট বাতিল হবে।'}
                  </p>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-xs text-white bg-purple-950/60 p-2 rounded-xl border border-purple-700/50 select-none hover:bg-purple-900/60 transition">
                    <input
                      type="checkbox"
                      checked={bulkFinancialSafetyAcknowledged}
                      onChange={(e) => setBulkFinancialSafetyAcknowledged(e.target.checked)}
                      className="mt-0.5 rounded border-purple-500 bg-purple-950 text-amber-400 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-amber-200 leading-snug">
                      আমি সতর্কভাবে যাচাই করেছি এবং নিশ্চিত করছি যে নির্বাচিত {requestsBulkModal.ids?.length || 0} টি লেনদেনের আর্থিক হিসাব সঠিক আছে।
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestsBulkModal(null);
                      setBulkFinancialSafetyAcknowledged(false);
                    }}
                    className="flex-1 py-2.5 bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-xs rounded-xl border border-purple-800/50 transition cursor-pointer"
                  >
                    ফিরে যান (বাতিল)
                  </button>
                  {requestsBulkModal.action === 'approve' ? (
                    <button
                      type="button"
                      disabled={!bulkFinancialSafetyAcknowledged}
                      onClick={() => executeBulkApproveRequests(requestsBulkModal.ids)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition ${
                        bulkFinancialSafetyAcknowledged
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white active:scale-95 cursor-pointer shadow-emerald-950/40'
                          : 'bg-purple-950/60 text-purple-400/50 border border-purple-800/40 cursor-not-allowed'
                      }`}
                      title={!bulkFinancialSafetyAcknowledged ? 'প্রথমে উপরের চেকবক্সে টিক চিহ্ন দিন' : 'অনুমোদন নিশ্চিত করুন'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{bulkFinancialSafetyAcknowledged ? 'হ্যাঁ, অনুমোদন নিশ্চিত করুন' : 'নিরাপত্তা নিশ্চিত করুন'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!bulkFinancialSafetyAcknowledged}
                      onClick={() => executeBulkRejectRequests(requestsBulkModal.ids)}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition ${
                        bulkFinancialSafetyAcknowledged
                          ? 'bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white active:scale-95 cursor-pointer shadow-rose-950/40'
                          : 'bg-purple-950/60 text-purple-400/50 border border-purple-800/40 cursor-not-allowed'
                      }`}
                      title={!bulkFinancialSafetyAcknowledged ? 'প্রথমে উপরের চেকবক্সে টিক চিহ্ন দিন' : 'বাতিল নিশ্চিত করুন'}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{bulkFinancialSafetyAcknowledged ? 'হ্যাঁ, বাতিল নিশ্চিত করুন' : 'নিরাপত্তা নিশ্চিত করুন'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Top Progress Banner for Requests Tab */}
          <BulkProgressFloatingBanner
            progress={requestsBulkProgress}
            onMaximize={() => setRequestsBulkProgress((prev) => ({ ...prev, isMinimized: false }))}
          />

          {/* Full Screen Visual Progress Modal for Requests Tab */}
          <BulkProgressModal
            isOpen={requestsBulkProgress.isActive && !requestsBulkProgress.isMinimized}
            progress={requestsBulkProgress}
            transactions={safeTransactions}
            onMinimize={() => setRequestsBulkProgress((prev) => ({ ...prev, isMinimized: true }))}
            onClose={() => setRequestsBulkProgress(initialBulkProgressState)}
          />
        </div>
      )}

      {/* ================= TAB 3: USER MANAGEMENT & CUSTOMIZATION ================= */}
      {activeTab === 'users' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Telemetry Export Success Notification Toast */}
          {telemetryExportNotice && (
            <div className="p-3 bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950 border border-cyan-500/60 rounded-xl text-cyan-200 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-black text-white">{telemetryExportNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setTelemetryExportNotice(null)}
                className="text-cyan-400 hover:text-white p-1"
                title="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main User Search & Filter Control Card */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/50 space-y-3 shadow-lg">
            {/* Search Input and Add User Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={
                    userFilterField === 'phone'
                      ? 'ফোন নম্বর দিয়ে খুঁজুন (যেমন: 017...)'
                      : userFilterField === 'name'
                      ? 'ইউজারের নাম দিয়ে খুঁজুন...'
                      : userFilterField === 'id'
                      ? 'ইউজার আইডি দিয়ে খুঁজুন...'
                      : 'ফোন নম্বর বা নাম দিয়ে খুঁজুন (যেমন: 017... বা Shakil)...'
                  }
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-600/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-purple-400/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition shadow-inner"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch('')}
                    className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white p-0.5 rounded transition cursor-pointer"
                    title="মুছুন (Clear)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Export Telemetry CSV Button */}
              <button
                type="button"
                onClick={() => handleExportTelemetry(filteredUsers, 'telemetry_filtered_users')}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer shrink-0"
                title="ইউজারের সংগৃহীত ডিভাইস টেলিমেট্রি (মডেল, IP, IMEI/ডিভাইস আইডি, অবস্থান) CSV ফাইল হিসেবে ডাউনলোড করুন"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">টেলিমেট্রি CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">নতুন ইউজার</span>
                <span className="sm:hidden">+ ইউজার</span>
              </button>
            </div>

            {/* Filter Pills & Status/Sort Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-800/40 text-[11px]">
              {/* Field Target Selectors */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                <span className="text-[10px] text-purple-400 font-bold mr-1 shrink-0 flex items-center gap-0.5">
                  <Filter className="w-3 h-3 text-amber-400" /> ফিল্টার:
                </span>
                
                <button
                  type="button"
                  onClick={() => setUserFilterField('all')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer ${
                    userFilterField === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow font-black'
                      : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                  }`}
                >
                  সব ফিল্ড
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilterField('phone')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                    userFilterField === 'phone'
                      ? 'bg-emerald-500 text-slate-950 shadow font-black'
                      : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                  }`}
                >
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>ফোন নম্বর</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilterField('name')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                    userFilterField === 'name'
                      ? 'bg-cyan-500 text-slate-950 shadow font-black'
                      : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                  }`}
                >
                  <User className="w-2.5 h-2.5" />
                  <span>নাম</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilterField('id')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer ${
                    userFilterField === 'id'
                      ? 'bg-purple-500 text-white shadow font-black'
                      : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                  }`}
                >
                  <Fingerprint className="w-2.5 h-2.5" />
                  <span>আইডি</span>
                </button>
              </div>

              {/* Status and Sort Controls */}
              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="bg-[#031e0c] border border-purple-700/60 rounded-lg px-2 py-1 text-[10px] font-bold text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">সব স্ট্যাটাস ({userCounts.total})</option>
                  <option value="active">অ্যাক্টিভ ({userCounts.active})</option>
                  <option value="verified">ভেরিফাইড ({userCounts.verified})</option>
                  <option value="banned">ব্যান্ড ({userCounts.banned})</option>
                </select>

                <select
                  value={userSortBy}
                  onChange={(e) => setUserSortBy(e.target.value as any)}
                  className="bg-[#031e0c] border border-purple-700/60 rounded-lg px-2 py-1 text-[10px] font-bold text-purple-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="default">ডিফল্ট ক্রম</option>
                  <option value="balance_desc">সর্বোচ্চ ব্যালেন্স</option>
                  <option value="level_desc">লেভেল (উচ্চ থেকে নিচ)</option>
                  <option value="name_asc">নাম (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Results Count & Quick Reset Tag */}
            <div className="flex items-center justify-between text-[10px] text-purple-300 pt-0.5 px-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>
                  মোট <strong className="text-white">{safeRegisteredUsers.length}</strong> জনের মধ্যে{' '}
                  <strong className="text-amber-400 font-bold">{filteredUsers.length}</strong> জন দেখানো হচ্ছে
                </span>
                {userSearch && (
                  <span className="bg-purple-900/60 border border-purple-700/40 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    "{userSearch}"
                  </span>
                )}
              </div>

              {(userSearch || userFilterField !== 'all' || userStatusFilter !== 'all' || userSortBy !== 'default') && (
                <button
                  type="button"
                  onClick={() => {
                    setUserSearch('');
                    setUserFilterField('all');
                    setUserStatusFilter('all');
                    setUserSortBy('default');
                  }}
                  className="text-rose-400 hover:text-rose-300 text-[10px] font-bold flex items-center gap-0.5 transition underline cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>রিসেট ফিল্টার</span>
                </button>
              )}
            </div>
          </div>

          {/* User Device Telemetry & Off-Platform Audit Panel */}
          <div className="bg-gradient-to-r from-[#11092e] via-[#1a0e44] to-[#120831] p-3 sm:p-3.5 rounded-2xl border border-cyan-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-white text-xs sm:text-sm">ডিভাইস টেলিমেট্রি ও অফ-প্ল্যাটফর্ম অডিট (Device Telemetry Records)</h4>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-600/40">
                    CSV Format
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/90 leading-tight">
                  সংগৃহীত ইউজার ডিভাইস ডেটা (মডেল, IP অ্যাড্রেস, IMEI/ইউনিক হার্ডওয়্যার ফিঙ্গারপ্রিন্ট, অবস্থান ও ক্যারিয়ার) অফ-প্ল্যাটফর্ম রেকর্ড রাখার জন্য CSV ফাইলে এক্সপোর্ট করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleExportTelemetry(filteredUsers, 'telemetry_filtered_users')}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-400/50 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                title="বর্তমানে ফিল্টারকৃত ইউজারদের টেলিমেট্রি CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>ফিল্টারকৃত ({filteredUsers.length} জন)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportTelemetry(safeRegisteredUsers, 'telemetry_all_users')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                title="প্ল্যাটফর্মের সকল নিবন্ধিত ইউজারের টেলিমেট্রি CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>সকল ইউজার ({safeRegisteredUsers.length} জন)</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="bg-[#052a12] p-8 rounded-2xl text-center space-y-3 border border-purple-800/40 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-700/60 flex items-center justify-center mx-auto text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">কোন ইউজার পাওয়া যায়নি</h4>
                  <p className="text-xs text-purple-300">
                    {userSearch
                      ? `"${userSearch}" অনুসন্ধান শব্দের সাথে মিলে এমন কোন নিবন্ধিত ইউজার নেই।`
                      : 'নির্বাচিত ফিল্টারে কোন ইউজার পাওয়া যায়নি।'}
                  </p>
                </div>
                {(userSearch || userFilterField !== 'all' || userStatusFilter !== 'all' || userSortBy !== 'default') && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserSearch('');
                      setUserFilterField('all');
                      setUserStatusFilter('all');
                      setUserSortBy('default');
                    }}
                    className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-amber-300 text-xs font-bold rounded-xl border border-purple-700/50 inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>সব ইউজার দেখুন (Clear Search)</span>
                  </button>
                )}
              </div>
            ) : (
              filteredUsers.map((u, uIdx) => (
                <div
                  key={`admin-user-${u.id || uIdx}-${uIdx}`}
                  className={`p-3.5 rounded-2xl border space-y-2.5 shadow-md relative overflow-hidden ${
                    u.isBanned
                      ? 'bg-rose-950/40 border-rose-500/50'
                      : 'bg-[#052a12] border-purple-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow"
                        />
                        {u.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 border border-slate-900" title="Verified User">
                            <ShieldCheck className="w-3.5 h-3.5 fill-amber-400 stroke-slate-950" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-white">{u.name}</h4>
                          {u.role === 'admin' && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 py-0.2 rounded uppercase">
                              ADMIN
                            </span>
                          )}
                          {u.isBanned && (
                            <span className="text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                              <Ban className="w-2.5 h-2.5" /> BANNED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-mono mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 bg-[#031e0c] px-1.5 py-0.5 rounded border border-purple-800/40">
                            <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <strong className="text-amber-200">{u.phone || 'No phone'}</strong>
                            {u.phone && (
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(u.id, u.phone)}
                                className="text-purple-400 hover:text-white ml-0.5 transition cursor-pointer"
                                title="ফোন নম্বর কপি করুন"
                              >
                                {copiedPhoneUserId === u.id ? (
                                  <span className="text-[9px] text-emerald-400 font-sans font-bold">কপি!</span>
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            )}
                          </span>
                          <span>•</span>
                          <span className="text-purple-300">Lvl {u.level || 1}</span>
                        </div>

                        {/* ID and Password Credentials Display */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] bg-purple-950/90 text-purple-200 font-mono px-1.5 py-0.5 rounded border border-purple-700/60 flex items-center gap-1">
                            <Fingerprint className="w-3 h-3 text-amber-400" />
                            <span>ID: <strong className="text-white">{u.id}</strong></span>
                          </span>

                          <span className="text-[10px] bg-purple-950/90 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-purple-700/60 flex items-center gap-1">
                            <Key className="w-3 h-3 text-cyan-400" />
                            <span>লগইন পাস: <strong>{showPasswords[u.id] ? (u.password || '123456') : '••••••••'}</strong></span>
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(u.id)}
                              className="text-purple-300 hover:text-amber-300 ml-0.5 p-0.5"
                              title={showPasswords[u.id] ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                            >
                              {showPasswords[u.id] ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                            </button>
                          </span>

                          <span className="text-[10px] bg-emerald-950/90 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-700/60 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>উইথড্র পাস: <strong>{showWithdrawPasswords[u.id] ? (u.withdrawPassword || 'সেট নেই') : (u.withdrawPassword ? '••••••••' : 'সেট নেই')}</strong></span>
                            {u.withdrawPassword && (
                              <button
                                type="button"
                                onClick={() => toggleShowWithdrawPassword(u.id)}
                                className="text-emerald-300 hover:text-white ml-0.5 p-0.5 cursor-pointer"
                                title={showWithdrawPasswords[u.id] ? 'উইথড্র পাসওয়ার্ড লুকান' : 'উইথড্র পাসওয়ার্ড দেখুন'}
                              >
                                {showWithdrawPasswords[u.id] ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                              </button>
                            )}
                          </span>
                        </div>

                        {/* Bound Withdrawal Accounts Breakdown */}
                        <div className="mt-1.5 p-2 bg-[#09041a] rounded-xl border border-purple-900/50 space-y-1">
                          <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>উইথড্র অ্যাকাউন্ট নম্বর (Withdrawal Accounts):</span>
                          </span>
                          <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                            <div className="bg-[#12082b] px-1.5 py-0.5 rounded border border-pink-900/40 flex items-center justify-between">
                              <span className="text-pink-300 font-sans font-bold">bKash:</span>
                              <span className="text-white">{u.withdrawalAccounts?.bkash || 'সেট নেই'}</span>
                            </div>
                            <div className="bg-[#12082b] px-1.5 py-0.5 rounded border border-orange-900/40 flex items-center justify-between">
                              <span className="text-orange-300 font-sans font-bold">Nagad:</span>
                              <span className="text-white">{u.withdrawalAccounts?.nagad || 'সেট নেই'}</span>
                            </div>
                            <div className="bg-[#12082b] px-1.5 py-0.5 rounded border border-purple-900/40 flex items-center justify-between">
                              <span className="text-purple-300 font-sans font-bold">Rocket:</span>
                              <span className="text-white">{u.withdrawalAccounts?.rocket || 'সেট নেই'}</span>
                            </div>
                            <div className="bg-[#12082b] px-1.5 py-0.5 rounded border border-amber-900/40 flex items-center justify-between">
                              <span className="text-amber-300 font-sans font-bold">Upay:</span>
                              <span className="text-white">{u.withdrawalAccounts?.upay || 'সেট নেই'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-amber-200/80 font-mono mt-1">
                          <span>ম্যাচ: {u.totalMatches || 0}</span>
                          <span>•</span>
                          <span>উইন রেট: {u.winRate || 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-xs font-black font-mono text-amber-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-700/40 block">
                        ৳{(Number(u.balance) || 0).toFixed(2)}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono block">
                        জিতছেন: ৳{u.totalEarnings || 0}
                      </span>
                    </div>
                  </div>

                  {/* Device & Network Telemetry Strip (ডিভাইস মডেল, আইপি ও লোকেশন) */}
                  <div className="p-2 rounded-xl bg-[#0e0729] border border-purple-800/60 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                    <div className="flex flex-wrap items-center gap-2 text-purple-200">
                      <span className="flex items-center gap-1 text-cyan-300 font-medium">
                        <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{u.deviceInfo?.deviceModel || 'Android Device'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-emerald-300 font-mono">
                        <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>IP: {u.deviceInfo?.ipAddress || '103.145.74.88'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{u.deviceInfo?.location || 'ঢাকা, বাংলাদেশ'}</span>
                      </span>
                      <span className="text-purple-500">•</span>
                      <span className="flex items-center gap-1 text-purple-300 font-mono">
                        <Fingerprint className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>DevID: {u.deviceInfo?.deviceFingerprint || 'DEV-8829F1-BD'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleExportTelemetry([u], `telemetry_${(u.phone || u.id).replace(/\D/g, '') || u.id}`)}
                        className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-[10px] flex items-center gap-1 transition shadow cursor-pointer active:scale-95"
                        title="এই ইউজারের ডিভাইস টেলিমেট্রি CSV আকারে ডাউনলোড করুন"
                      >
                        <Download className="w-3 h-3 text-cyan-400" />
                        <span>CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedDeviceModalUser(u)}
                        className="px-2 py-1 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-amber-300 border border-purple-600/50 font-bold text-[10px] flex items-center gap-1 transition shadow cursor-pointer active:scale-95"
                        title="ইউজারের ডিভাইস, আইপি ও নেটওয়ার্ক গোয়েন্দা তথ্য দেখুন"
                      >
                        <Info className="w-3 h-3 text-amber-400" />
                        <span>সম্পূর্ণ ডিভাইস তথ্য</span>
                      </button>
                    </div>
                  </div>

                  {/* Coin & Custom Edit Controls */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-purple-900/40">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateUserBalance(u.id, u.balance + 100)}
                        className="px-2 py-1 bg-emerald-700/60 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-0.5"
                        title="Add 100 tk"
                      >
                        <Plus className="w-3 h-3" />
                        <span>৳১০০</span>
                      </button>

                      <button
                        onClick={() => onUpdateUserBalance(u.id, Math.max(0, u.balance - 100))}
                        className="px-2 py-1 bg-rose-700/60 hover:bg-rose-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-0.5"
                        title="Deduct 100 tk"
                      >
                        <Minus className="w-3 h-3" />
                        <span>৳১০০</span>
                      </button>

                      {/* Quick Ban/Unban Toggle */}
                      <button
                        onClick={() => handleToggleUserBanInternal(u.id || u.phone)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg flex items-center gap-0.5 cursor-pointer transition shadow ${
                          u.isBanned
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-rose-600 text-white hover:bg-rose-500'
                        }`}
                        title={u.isBanned ? 'আনব্যান করুন' : 'ব্যান করুন'}
                      >
                        {u.isBanned ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        <span>{u.isBanned ? 'আনব্যান' : 'ব্যান'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Full Custom Edit Button */}
                      <button
                        onClick={() => {
                          setEditingUser({ ...u });
                          setEditingOriginalId(u.id);
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black rounded-lg flex items-center gap-1 shadow"
                      >
                        <Edit className="w-3 h-3" />
                        <span>কাস্টমাইজ</span>
                      </button>

                      {/* Delete User */}
                      {onDeleteUser && u.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={() => handlePromptDeleteUser(u)}
                          className="p-1 bg-rose-950 text-rose-400 hover:bg-rose-900 rounded-lg border border-rose-800/40 transition active:scale-95 cursor-pointer"
                          title="ইউজার অ্যাকাউন্ট মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= EDIT USER MODAL (কাস্টমাইজ ইউজার) ================= */}
          {editingUser && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
              <div className="bg-[#04260f] border-2 border-amber-400/80 w-full max-w-md rounded-3xl p-4 space-y-3.5 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-purple-800/60 pb-2.5">
                  <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-400" />
                    <span>ইউজার কাস্টমাইজ প্যানেল ({editingUser.name})</span>
                  </h3>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="p-1 rounded-lg bg-purple-950 text-purple-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Avatar Picker & Preview */}
                  <div>
                    <label className="text-purple-200 font-bold block mb-1">প্রোফাইল ছবি (Avatar):</label>
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={editingUser.avatarUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow"
                      />
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={editingUser.avatarUrl}
                          onChange={(e) => setEditingUser({ ...editingUser, avatarUrl: e.target.value })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-[11px] text-amber-200"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {avatarPresets.map((url, idx) => (
                        <button
                          key={`admin-user-avatar-preset-${idx}`}
                          type="button"
                          onClick={() => setEditingUser({ ...editingUser, avatarUrl: url })}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0 ${
                            editingUser.avatarUrl === url ? 'border-amber-400 scale-110' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User ID & Password Edit Section */}
                  <div className="bg-[#08031d] p-3 rounded-2xl border border-amber-400/40 space-y-2.5">
                    <span className="text-amber-300 font-extrabold text-[11px] flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>আইডি ও পাসওয়ার্ড চেঞ্জ (User Credentials)</span>
                    </span>

                    {/* User ID field */}
                    <div>
                      <label className="text-purple-200 font-bold block mb-1">ইউজার আইডি (User ID):</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Fingerprint className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={editingUser.id}
                            onChange={(e) => setEditingUser({ ...editingUser, id: e.target.value })}
                            className="w-full bg-[#04260f] border border-purple-700/60 rounded-xl pl-8 pr-2 py-1.5 text-white font-mono font-bold"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingUser({ ...editingUser, id: generateRandomUserId() })}
                          className="px-2.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 text-[10px] font-bold rounded-xl flex items-center gap-1"
                          title="নতুন আইডি জেনারেট করুন"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" />
                          <span>নতুন ID</span>
                        </button>
                      </div>
                    </div>

                    {/* User Password field */}
                    <div>
                      <label className="text-purple-200 font-bold block mb-1">পাসওয়ার্ড (Password):</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Key className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
                          <input
                            type={showEditPassword ? 'text' : 'password'}
                            value={editingUser.password || ''}
                            placeholder="নতুন পাসওয়ার্ড লিখুন..."
                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                            className="w-full bg-[#04260f] border border-purple-700/60 rounded-xl pl-8 pr-8 py-1.5 text-amber-300 font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditPassword(!showEditPassword)}
                            className="absolute right-2.5 top-2 text-purple-300 hover:text-amber-300"
                          >
                            {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingUser({ ...editingUser, password: generateRandomPassword() })}
                          className="px-2.5 py-1.5 bg-amber-400/20 border border-amber-400/50 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold rounded-xl flex items-center gap-1"
                          title="অটো পাসওয়ার্ড জেনারেট করুন"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>অটো পাস</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-purple-200 font-bold block mb-1">ইউজারের নাম:</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-purple-200 font-bold block mb-1">ফোন নম্বর:</label>
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-1.5 text-amber-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Balance & Level */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-amber-300 font-bold block mb-1">ওয়ালেট ব্যালেন্স (৳):</label>
                      <input
                        type="number"
                        value={editingUser.balance}
                        onChange={(e) => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-amber-500/50 rounded-xl px-3 py-1.5 text-amber-300 font-mono font-black"
                      />
                    </div>

                    <div>
                      <label className="text-purple-200 font-bold block mb-1">ইউজার লেভেল (Level):</label>
                      <input
                        type="number"
                        value={editingUser.level || 1}
                        onChange={(e) => setEditingUser({ ...editingUser, level: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Matches, Win Rate, Earnings */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-purple-200 font-bold block mb-1">মোট ম্যাচ:</label>
                      <input
                        type="number"
                        value={editingUser.totalMatches || 0}
                        onChange={(e) => setEditingUser({ ...editingUser, totalMatches: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-purple-200 font-bold block mb-1">উইন রেট (%):</label>
                      <input
                        type="number"
                        value={editingUser.winRate || 0}
                        onChange={(e) => setEditingUser({ ...editingUser, winRate: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1.5 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-purple-200 font-bold block mb-1">মোট জয় (৳):</label>
                      <input
                        type="number"
                        value={editingUser.totalEarnings || 0}
                        onChange={(e) => setEditingUser({ ...editingUser, totalEarnings: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1.5 text-emerald-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Badges, Ban & Role Status */}
                  <div className="space-y-2 pt-2 border-t border-purple-900/50">
                    <div className="flex items-center justify-between p-2 bg-[#08031d] rounded-xl border border-purple-800/40">
                      <span className="text-purple-200 font-bold">ভেরিফাইড ব্যাজ (Verified Blue Tick):</span>
                      <input
                        type="checkbox"
                        checked={!!editingUser.isVerified}
                        onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.checked })}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#08031d] rounded-xl border border-purple-800/40">
                      <span className="text-rose-300 font-bold">অ্যাকাউন্ট ব্লক / ব্যান (Account Ban):</span>
                      <input
                        type="checkbox"
                        checked={!!editingUser.isBanned}
                        onChange={(e) => setEditingUser({ ...editingUser, isBanned: e.target.checked })}
                        className="w-4 h-4 accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-[#08031d] rounded-xl border border-purple-800/40">
                      <span className="text-amber-300 font-bold">অ্যাডমিন রোল (Admin Power):</span>
                      <select
                        value={editingUser.role || 'user'}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' })}
                        className="bg-[#04260f] text-amber-300 font-bold border border-purple-600 rounded-lg px-2 py-1"
                      >
                        <option value="user">User (সাধারণ ইউজার)</option>
                        <option value="admin">Admin (এডমিন রোল)</option>
                      </select>
                    </div>
                  </div>

                  {/* Withdrawal Accounts & Security Settings for Admin */}
                  <div className="p-3 bg-[#0a0520] rounded-2xl border border-purple-700/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>উইথড্র অ্যাকাউন্ট ও সিকিউরিটি কনফিগারেশন:</span>
                      </span>
                      <span className="text-[10px] text-purple-300">bKash, Nagad, Rocket, Upay</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-pink-300 block mb-1">bKash উইথড্র নম্বর:</label>
                        <input
                          type="text"
                          value={editingUser.withdrawalAccounts?.bkash || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            withdrawalAccounts: {
                              ...(editingUser.withdrawalAccounts || {}),
                              bkash: e.target.value,
                            }
                          })}
                          placeholder="017xxxxxxxx"
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-orange-300 block mb-1">Nagad উইথড্র নম্বর:</label>
                        <input
                          type="text"
                          value={editingUser.withdrawalAccounts?.nagad || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            withdrawalAccounts: {
                              ...(editingUser.withdrawalAccounts || {}),
                              nagad: e.target.value,
                            }
                          })}
                          placeholder="018xxxxxxxx"
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-purple-300 block mb-1">Rocket উইথড্র নম্বর:</label>
                        <input
                          type="text"
                          value={editingUser.withdrawalAccounts?.rocket || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            withdrawalAccounts: {
                              ...(editingUser.withdrawalAccounts || {}),
                              rocket: e.target.value,
                            }
                          })}
                          placeholder="019xxxxxxxx"
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-amber-300 block mb-1">Upay উইথড্র নম্বর:</label>
                        <input
                          type="text"
                          value={editingUser.withdrawalAccounts?.upay || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            withdrawalAccounts: {
                              ...(editingUser.withdrawalAccounts || {}),
                              upay: e.target.value,
                            }
                          })}
                          placeholder="016xxxxxxxx"
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-300 block mb-1">উইথড্র পাসওয়ার্ড (Withdraw Password):</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Lock className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2" />
                          <input
                            type={showEditWithdrawPassword ? 'text' : 'password'}
                            value={editingUser.withdrawPassword || ''}
                            placeholder="উইথড্র পাসওয়ার্ড..."
                            onChange={(e) => setEditingUser({
                              ...editingUser,
                              withdrawPassword: e.target.value,
                              hasSetWithdrawPassword: Boolean(e.target.value.trim().length > 0)
                            })}
                            className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl pl-8 pr-8 py-1.5 text-amber-300 font-mono font-bold text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditWithdrawPassword(!showEditWithdrawPassword)}
                            className="absolute right-2.5 top-2 text-purple-300 hover:text-amber-300 cursor-pointer"
                          >
                            {showEditWithdrawPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newPass = Math.floor(100000 + Math.random() * 900000).toString();
                            setEditingUser({
                              ...editingUser,
                              withdrawPassword: newPass,
                              hasSetWithdrawPassword: true
                            });
                          }}
                          className="px-2.5 py-1.5 bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
                          title="নতুন ৬ ডিজিটের উইথড্র পাসওয়ার্ড অটো সেট করুন"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>অটো পিন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-purple-800/60">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-2.5 bg-purple-950 text-purple-200 font-bold text-xs rounded-xl"
                  >
                    বাতিল
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!editingUser.id.trim()) {
                        alert('ইউজার আইডি খালি রাখা যাবে না!');
                        return;
                      }
                      if (onSaveFullUser) {
                        onSaveFullUser(editingUser, editingOriginalId);
                      } else {
                        onUpdateUserBalance(editingUser.id, editingUser.balance);
                      }
                      setEditingUser(null);
                    }}
                    className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেভ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= ADD NEW USER MODAL ================= */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
              <div className="bg-[#04260f] border-2 border-emerald-400/80 w-full max-w-md rounded-3xl p-4 space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-purple-800/60 pb-2.5">
                  <h3 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>নতুন ইউজার তৈরি করুন</span>
                  </h3>
                  <button
                    onClick={() => setIsAddUserOpen(false)}
                    className="p-1 rounded-lg bg-purple-950 text-purple-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* User ID field */}
                  <div>
                    <label className="text-purple-200 font-bold block mb-1">ইউজার আইডি (User ID):</label>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <Fingerprint className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={newUserForm.id || ''}
                          onChange={(e) => setNewUserForm({ ...newUserForm, id: e.target.value })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl pl-8 pr-2 py-1.5 text-white font-mono font-bold"
                          placeholder="e.g. usr_100201"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewUserForm({ ...newUserForm, id: generateRandomUserId() })}
                        className="px-2.5 py-1.5 bg-purple-900 text-purple-200 text-[10px] font-bold rounded-xl flex items-center gap-1"
                        title="নতুন আইডি জেনারেট করুন"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>নতুন ID</span>
                      </button>
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="text-purple-200 font-bold block mb-1">পাসওয়ার্ড (Password):</label>
                    <div className="flex gap-1.5">
                      <div className="relative flex-1">
                        <Key className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-2.5" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newUserForm.password || ''}
                          placeholder="ইউজার পাসওয়ার্ড লিখুন..."
                          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl pl-8 pr-8 py-1.5 text-amber-300 font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-2 text-purple-300 hover:text-amber-300"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewUserForm({ ...newUserForm, password: generateRandomPassword() })}
                        className="px-2.5 py-1.5 bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold rounded-xl flex items-center gap-1"
                        title="অটো পাসওয়ার্ড জেনারেট করুন"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>অটো পাস</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-purple-200 font-bold block mb-1">ইউজারের নাম:</label>
                    <input
                      type="text"
                      placeholder="e.g. Shakib Al Hasan"
                      value={newUserForm.name || ''}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-purple-200 font-bold block mb-1">ফোন নম্বর:</label>
                    <input
                      type="text"
                      placeholder="e.g. 01700000000"
                      value={newUserForm.phone || ''}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                      className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-amber-300 font-bold block mb-1">প্রাথমিক ব্যালেন্স (৳):</label>
                      <input
                        type="number"
                        value={newUserForm.balance || 100}
                        onChange={(e) => setNewUserForm({ ...newUserForm, balance: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-black"
                      />
                    </div>

                    <div>
                      <label className="text-purple-200 font-bold block mb-1">লেভেল:</label>
                      <input
                        type="number"
                        value={newUserForm.level || 1}
                        onChange={(e) => setNewUserForm({ ...newUserForm, level: Number(e.target.value) })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Withdrawal Accounts & Security in Add User */}
                  <div className="p-3 bg-[#0a0520] rounded-2xl border border-purple-700/60 space-y-2">
                    <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>উইথড্র অ্যাকাউন্ট ও পাসওয়ার্ড (ঐচ্ছিক):</span>
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-pink-300 block mb-0.5">bKash নম্বর:</label>
                        <input
                          type="text"
                          placeholder="017xxxxxxxx"
                          value={newUserForm.withdrawalAccounts?.bkash || ''}
                          onChange={(e) => setNewUserForm({
                            ...newUserForm,
                            withdrawalAccounts: {
                              ...(newUserForm.withdrawalAccounts || {}),
                              bkash: e.target.value
                            }
                          })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-orange-300 block mb-0.5">Nagad নম্বর:</label>
                        <input
                          type="text"
                          placeholder="018xxxxxxxx"
                          value={newUserForm.withdrawalAccounts?.nagad || ''}
                          onChange={(e) => setNewUserForm({
                            ...newUserForm,
                            withdrawalAccounts: {
                              ...(newUserForm.withdrawalAccounts || {}),
                              nagad: e.target.value
                            }
                          })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-purple-300 block mb-0.5">Rocket নম্বর:</label>
                        <input
                          type="text"
                          placeholder="019xxxxxxxx"
                          value={newUserForm.withdrawalAccounts?.rocket || ''}
                          onChange={(e) => setNewUserForm({
                            ...newUserForm,
                            withdrawalAccounts: {
                              ...(newUserForm.withdrawalAccounts || {}),
                              rocket: e.target.value
                            }
                          })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1 text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-amber-300 block mb-0.5">Upay নম্বর:</label>
                        <input
                          type="text"
                          placeholder="016xxxxxxxx"
                          value={newUserForm.withdrawalAccounts?.upay || ''}
                          onChange={(e) => setNewUserForm({
                            ...newUserForm,
                            withdrawalAccounts: {
                              ...(newUserForm.withdrawalAccounts || {}),
                              upay: e.target.value
                            }
                          })}
                          className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2 py-1 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-amber-300 block mb-0.5">উইথড্র পাসওয়ার্ড:</label>
                      <input
                        type="text"
                        placeholder="উইথড্র পাসওয়ার্ড (পিন)"
                        value={newUserForm.withdrawPassword || ''}
                        onChange={(e) => setNewUserForm({
                          ...newUserForm,
                          withdrawPassword: e.target.value,
                          hasSetWithdrawPassword: Boolean(e.target.value.trim().length > 0)
                        })}
                        className="w-full bg-[#08031d] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-purple-800/60">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="flex-1 py-2.5 bg-purple-950 text-purple-200 font-bold text-xs rounded-xl"
                  >
                    বাতিল
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newUserForm.name || !newUserForm.phone) {
                        alert('দয়া করে নাম ও ফোন নম্বর পূরণ করুন');
                        return;
                      }
                      const createdUser: UserProfile = {
                        id: newUserForm.id?.trim() || `usr_${Date.now()}`,
                        name: newUserForm.name || 'User',
                        phone: newUserForm.phone || '',
                        password: newUserForm.password || '123456',
                        balance: newUserForm.balance || 100,
                        avatarUrl: newUserForm.avatarUrl || avatarPresets[0],
                        referralCode: `KING${Math.floor(1000 + Math.random() * 9000)}`,
                        totalWon: newUserForm.totalEarnings || 0,
                        level: newUserForm.level || 1,
                        totalEarnings: newUserForm.totalEarnings || 0,
                        totalMatches: newUserForm.totalMatches || 0,
                        winRate: newUserForm.winRate || 0,
                        isVerified: !!newUserForm.isVerified,
                        isBanned: !!newUserForm.isBanned,
                        role: newUserForm.role || 'user',
                        isLoggedIn: true,
                        withdrawalAccounts: newUserForm.withdrawalAccounts,
                        withdrawPassword: newUserForm.withdrawPassword,
                        hasSetWithdrawPassword: Boolean(newUserForm.withdrawPassword && newUserForm.withdrawPassword.trim().length > 0),
                      };
                      if (onAddUser) {
                        onAddUser(createdUser);
                      } else if (onSaveFullUser) {
                        onSaveFullUser(createdUser);
                      }
                      setIsAddUserOpen(false);
                      setNewUserForm({
                        id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
                        name: '',
                        phone: '',
                        password: 'pass' + Math.floor(1000 + Math.random() * 9000),
                        balance: 100,
                        level: 1,
                        totalMatches: 0,
                        winRate: 0,
                        totalEarnings: 0,
                        avatarUrl: avatarPresets[0],
                        isVerified: false,
                        isBanned: false,
                        role: 'user',
                      });
                    }}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>তৈরি করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PAYMENT NUMBERS & LIMITS ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Payment Method Official & Custom Logos Manager */}
          <PaymentLogosManager
            settingsForm={settingsForm}
            onUpdateForm={(updated) => {
              setSettingsForm(updated);
              onUpdateAppSettings(updated);
            }}
            onSave={() => {
              onUpdateAppSettings(settingsForm);
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
          />

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            {/* Mobile Banking Gateways & Numbers */}
          <div className="bg-[#052a12] p-3.5 sm:p-4 rounded-2xl border-2 border-purple-600/50 space-y-3.5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/60 pb-2.5">
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>মোবাইল ব্যাংকিং গেটওয়ে ও কন্ট্রোল (Deposit & Withdraw Toggles)</span>
                </h3>
                <p className="text-[10px] text-purple-300">
                  বিকাশ, নগদ, রকেট ও উপায় এর ডিপোজিট এবং উইথড্র অপশন আলাদাভাবে চালু বা বন্ধ রাখুন
                </p>
              </div>

              {/* Quick Action Toggles */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSettingsForm({
                    ...settingsForm,
                    enableBkashDeposit: true,
                    enableNagadDeposit: true,
                    enableRocketDeposit: true,
                    enableUpayDeposit: true,
                    enableBkashWithdraw: true,
                    enableNagadWithdraw: true,
                    enableRocketWithdraw: true,
                    enableUpayWithdraw: true,
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold"
                >
                  সব চালু করুন
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsForm({
                    ...settingsForm,
                    enableBkashDeposit: false,
                    enableNagadDeposit: false,
                    enableRocketDeposit: false,
                    enableUpayDeposit: false,
                    enableBkashWithdraw: false,
                    enableNagadWithdraw: false,
                    enableRocketWithdraw: false,
                    enableUpayWithdraw: false,
                  })}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-[10px] font-bold"
                >
                  সব বন্ধ করুন
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* 1. bKash (বিকাশ) Card */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border-2 border-pink-600/40 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center font-black text-xs border border-pink-500/40">
                      bK
                    </span>
                    <div>
                      <span className="font-black text-white text-xs block">bKash (বিকাশ)</span>
                      <span className="text-[9px] text-pink-300">মোবাইল ফাইন্যান্সিয়াল সার্ভিস</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${
                      (settingsForm.enableBkashDeposit !== false || settingsForm.enableBkashWithdraw !== false)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {(settingsForm.enableBkashDeposit !== false || settingsForm.enableBkashWithdraw !== false) ? '🟢 সক্রিয়' : '🔴 বন্ধ'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-pink-300 font-bold block mb-1">bKash এজেন্ট/মার্চেন্ট নম্বর:</label>
                  <input
                    type="text"
                    value={settingsForm.bkashNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                    className="w-full bg-[#052a12] border border-pink-500/40 rounded-xl px-3 py-1.5 text-pink-300 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-pink-300 font-bold block mb-1">
                    bKash অ্যাকাউন্ট লেখা / টাইটেল (যেমন: Official bKash Personal/Agent Account):
                  </label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccountTitles?.bKash ?? 'Official bKash Personal/Agent Account'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        paymentAccountTitles: {
                          ...(settingsForm.paymentAccountTitles || {}),
                          bKash: e.target.value,
                        },
                      })
                    }
                    placeholder="Official bKash Personal/Agent Account"
                    className="w-full bg-[#052a12] border border-pink-500/40 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                  <p className="text-[10px] text-pink-300/70 mt-0.5">
                    ডিপোজিট পেজে বিকাশ নম্বরের উপরে এই লেখাটি প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableBkashDeposit !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableBkashDeposit !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableBkashDeposit: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-500 bg-[#052a12] border-pink-700"
                    />
                    <span className="text-[10px] font-black">ডিপোজিট {settingsForm.enableBkashDeposit !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableBkashWithdraw !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableBkashWithdraw !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableBkashWithdraw: e.target.checked })}
                      className="w-4 h-4 rounded text-pink-500 bg-[#052a12] border-pink-700"
                    />
                    <span className="text-[10px] font-black">উইথড্র {settingsForm.enableBkashWithdraw !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>
                </div>
              </div>

              {/* 2. Nagad (নগদ) Card */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border-2 border-orange-600/40 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-black text-xs border border-orange-500/40">
                      Ng
                    </span>
                    <div>
                      <span className="font-black text-white text-xs block">Nagad (নগদ)</span>
                      <span className="text-[9px] text-orange-300">ডাক বিভাগ ডিজিটাল ফাইন্যান্স</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${
                      (settingsForm.enableNagadDeposit !== false || settingsForm.enableNagadWithdraw !== false)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {(settingsForm.enableNagadDeposit !== false || settingsForm.enableNagadWithdraw !== false) ? '🟢 সক্রিয়' : '🔴 বন্ধ'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-orange-300 font-bold block mb-1">Nagad এজেন্ট/মার্চেন্ট নম্বর:</label>
                  <input
                    type="text"
                    value={settingsForm.nagadNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                    className="w-full bg-[#052a12] border border-orange-500/40 rounded-xl px-3 py-1.5 text-orange-300 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-orange-300 font-bold block mb-1">
                    Nagad অ্যাকাউন্ট লেখা / টাইটেল (যেমন: Official Nagad Personal/Agent Account):
                  </label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccountTitles?.Nagad ?? 'Official Nagad Personal/Agent Account'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        paymentAccountTitles: {
                          ...(settingsForm.paymentAccountTitles || {}),
                          Nagad: e.target.value,
                        },
                      })
                    }
                    placeholder="Official Nagad Personal/Agent Account"
                    className="w-full bg-[#052a12] border border-orange-500/40 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                  <p className="text-[10px] text-orange-300/70 mt-0.5">
                    ডিপোজিট পেজে নগদ নম্বরের উপরে এই লেখাটি প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableNagadDeposit !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableNagadDeposit !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableNagadDeposit: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-500 bg-[#052a12] border-orange-700"
                    />
                    <span className="text-[10px] font-black">ডিপোজিট {settingsForm.enableNagadDeposit !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableNagadWithdraw !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableNagadWithdraw !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableNagadWithdraw: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-500 bg-[#052a12] border-orange-700"
                    />
                    <span className="text-[10px] font-black">উইথড্র {settingsForm.enableNagadWithdraw !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>
                </div>
              </div>

              {/* 3. Rocket (রকেট) Card */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border-2 border-purple-600/40 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center font-black text-xs border border-purple-500/40">
                      Rk
                    </span>
                    <div>
                      <span className="font-black text-white text-xs block">Rocket (রকেট)</span>
                      <span className="text-[9px] text-purple-300">ডাচ্-বাংলা ব্যাংক মোবাইল ব্যাংকিং</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${
                      (settingsForm.enableRocketDeposit !== false || settingsForm.enableRocketWithdraw !== false)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {(settingsForm.enableRocketDeposit !== false || settingsForm.enableRocketWithdraw !== false) ? '🟢 সক্রিয়' : '🔴 বন্ধ'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1">Rocket অ্যাকাউন্ট নম্বর (১২ ডিজিট):</label>
                  <input
                    type="text"
                    value={settingsForm.rocketNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                    className="w-full bg-[#052a12] border border-purple-500/40 rounded-xl px-3 py-1.5 text-purple-300 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1">
                    Rocket অ্যাকাউন্ট লেখা / টাইটেল (যেমন: Official Rocket Personal/Agent Account):
                  </label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccountTitles?.Rocket ?? 'Official Rocket Personal/Agent Account'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        paymentAccountTitles: {
                          ...(settingsForm.paymentAccountTitles || {}),
                          Rocket: e.target.value,
                        },
                      })
                    }
                    placeholder="Official Rocket Personal/Agent Account"
                    className="w-full bg-[#052a12] border border-purple-500/40 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                  <p className="text-[10px] text-purple-300/70 mt-0.5">
                    ডিপোজিট পেজে রকেট নম্বরের উপরে এই লেখাটি প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableRocketDeposit !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableRocketDeposit !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableRocketDeposit: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-500 bg-[#052a12] border-purple-700"
                    />
                    <span className="text-[10px] font-black">ডিপোজিট {settingsForm.enableRocketDeposit !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableRocketWithdraw !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableRocketWithdraw !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableRocketWithdraw: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-500 bg-[#052a12] border-purple-700"
                    />
                    <span className="text-[10px] font-black">উইথড্র {settingsForm.enableRocketWithdraw !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>
                </div>
              </div>

              {/* 4. Upay (উপায়) Card */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border-2 border-yellow-600/40 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-yellow-600/20 text-yellow-300 flex items-center justify-center font-black text-xs border border-yellow-500/40">
                      Up
                    </span>
                    <div>
                      <span className="font-black text-white text-xs block">Upay (উপায়)</span>
                      <span className="text-[9px] text-yellow-300">ইউসিবি মোবাইল ওয়ালেট</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${
                      (settingsForm.enableUpayDeposit !== false || settingsForm.enableUpayWithdraw !== false)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {(settingsForm.enableUpayDeposit !== false || settingsForm.enableUpayWithdraw !== false) ? '🟢 সক্রিয়' : '🔴 বন্ধ'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-yellow-300 font-bold block mb-1">Upay নম্বর:</label>
                  <input
                    type="text"
                    value={settingsForm.upayNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upayNumber: e.target.value })}
                    className="w-full bg-[#052a12] border border-yellow-500/40 rounded-xl px-3 py-1.5 text-yellow-300 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-yellow-300 font-bold block mb-1">
                    Upay অ্যাকাউন্ট লেখা / টাইটেল (যেমন: Official Upay Personal/Agent Account):
                  </label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccountTitles?.Upay ?? 'Official Upay Personal/Agent Account'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        paymentAccountTitles: {
                          ...(settingsForm.paymentAccountTitles || {}),
                          Upay: e.target.value,
                        },
                      })
                    }
                    placeholder="Official Upay Personal/Agent Account"
                    className="w-full bg-[#052a12] border border-yellow-500/40 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                  <p className="text-[10px] text-yellow-300/70 mt-0.5">
                    ডিপোজিট পেজে উপায় নম্বরের উপরে এই লেখাটি প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableUpayDeposit !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableUpayDeposit !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableUpayDeposit: e.target.checked })}
                      className="w-4 h-4 rounded text-yellow-500 bg-[#052a12] border-yellow-700"
                    />
                    <span className="text-[10px] font-black">ডিপোজিট {settingsForm.enableUpayDeposit !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    settingsForm.enableUpayWithdraw !== false 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/30 border-rose-700/40 text-rose-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableUpayWithdraw !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableUpayWithdraw: e.target.checked })}
                      className="w-4 h-4 rounded text-yellow-500 bg-[#052a12] border-yellow-700"
                    />
                    <span className="text-[10px] font-black">উইথড্র {settingsForm.enableUpayWithdraw !== false ? 'চালু' : 'বন্ধ'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* BinancePay & Cryptocurrency Section */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-amber-500/40 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>বাইনান্স পে ও ক্রিপ্টোকারেন্সি সেটিংস (BinancePay & Crypto)</span>
              </h3>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold border border-yellow-500/40">
                Active Gateway
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Binance Pay ID */}
              <div>
                <label className="text-yellow-300 font-bold block mb-1 flex items-center justify-between">
                  <span>Binance Pay ID (অফিশিয়াল বাইনান্স পে আইডি):</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">Pay ID বা Email</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.binancePayId || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, binancePayId: e.target.value })}
                  placeholder="e.g. 982736154 or pay@kingludo.com"
                  className="w-full bg-[#031e0c] border border-yellow-600/50 rounded-xl px-3 py-2 text-yellow-300 font-mono font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-yellow-300 font-bold block mb-1">
                  Binance Pay অ্যাকাউন্ট টাইটেল / লেখা:
                </label>
                <input
                  type="text"
                  value={settingsForm.paymentAccountTitles?.BinancePay ?? 'Official Binance Pay ID'}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentAccountTitles: {
                        ...(settingsForm.paymentAccountTitles || {}),
                        BinancePay: e.target.value,
                      },
                    })
                  }
                  placeholder="Official Binance Pay ID"
                  className="w-full bg-[#031e0c] border border-yellow-600/50 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              {/* USDT Exchange Rate */}
              <div>
                <label className="text-emerald-300 font-bold block mb-1 flex items-center justify-between">
                  <span>1 USDT = ৳ BDT বিনিময় হার (Exchange Rate):</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">স্বয়ংক্রিয় কনভার্সন</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={settingsForm.usdtExchangeRate || 125}
                    onChange={(e) => setSettingsForm({ ...settingsForm, usdtExchangeRate: Number(e.target.value) })}
                    placeholder="125"
                    className="w-full bg-[#031e0c] border border-emerald-600/50 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-400"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono font-bold text-emerald-400">
                    ৳ BDT / 1 USDT
                  </span>
                </div>
              </div>

              {/* USDT TRC-20 Address */}
              <div>
                <label className="text-purple-300 font-bold block mb-1">
                  USDT (TRC-20 / Tron) Wallet Address:
                </label>
                <input
                  type="text"
                  value={settingsForm.cryptoUsdtTrc20Address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cryptoUsdtTrc20Address: e.target.value })}
                  placeholder="e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
                  className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-purple-200 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* USDT BEP-20 Address */}
              <div>
                <label className="text-purple-300 font-bold block mb-1">
                  USDT (BEP-20 / Binance Smart Chain) Wallet Address:
                </label>
                <input
                  type="text"
                  value={settingsForm.cryptoUsdtBep20Address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, cryptoUsdtBep20Address: e.target.value })}
                  placeholder="e.g. 0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
                  className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-purple-200 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-emerald-300 font-bold block mb-1">
                  Crypto USDT অ্যাকাউন্ট টাইটেল / লেখা:
                </label>
                <input
                  type="text"
                  value={settingsForm.paymentAccountTitles?.Cryptocurrency ?? 'Official USDT TRC20/BEP20 Address'}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentAccountTitles: {
                        ...(settingsForm.paymentAccountTitles || {}),
                        Cryptocurrency: e.target.value,
                      },
                    })
                  }
                  placeholder="Official USDT TRC20/BEP20 Address"
                  className="w-full bg-[#031e0c] border border-emerald-600/50 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#031e0c] border border-purple-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableBinancePay !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableBinancePay: e.target.checked })}
                    className="w-4 h-4 rounded text-yellow-500 focus:ring-0 bg-[#052a12] border-purple-700"
                  />
                  <span className="text-[11px] font-bold text-yellow-300">BinancePay সক্রিয়</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#031e0c] border border-purple-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableCrypto !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableCrypto: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-[#052a12] border-purple-700"
                  />
                  <span className="text-[11px] font-bold text-emerald-300">Crypto সক্রিয়</span>
                </label>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-emerald-700/40 space-y-3">
            <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>সর্বনিম্ন লেনদেন ও ম্যাচ লিমিট (Limits)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-emerald-200 font-bold block mb-1">সর্বনিম্ন ডিপোজিট (৳):</label>
                <input
                  type="number"
                  value={settingsForm.minDeposit}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minDeposit: Number(e.target.value) })}
                  className="w-full bg-[#031e0c] border border-emerald-700/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-emerald-200 font-bold block mb-1">সর্বনিম্ন উইথড্র (৳):</label>
                <input
                  type="number"
                  value={settingsForm.minWithdrawal}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minWithdrawal: Number(e.target.value) })}
                  className="w-full bg-[#031e0c] border border-emerald-700/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-emerald-200 font-bold block mb-1">সর্বনিম্ন ম্যাচ ফি / বেট (৳):</label>
                <input
                  type="number"
                  value={settingsForm.minMatchFee ?? 10}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minMatchFee: Number(e.target.value) })}
                  className="w-full bg-[#031e0c] border border-emerald-700/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন (Save Changes)</span>
          </button>

          {savedNotice && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold text-center animate-bounce">
              ✓ পরিবর্তনসমূহ সফলভাবে সেভ করা হয়েছে!
            </div>
          )}
        </form>
      </div>
    )}

      {/* ================= TAB 5: LIVE CHAT SUPPORT & ADMIN REPLIES ================= */}
      {activeTab === 'live_chat' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-[#052a12] p-3.5 sm:p-4 rounded-2xl border-2 border-cyan-500/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <UserRound className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>লাইভ চ্যাট সাপোর্ট ও কাস্টমার মেসেজ সেন্টার</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                    Admin Active
                  </span>
                </h3>
                <p className="text-[11px] text-cyan-200/80">
                  কাস্টমারদের মেসেজের সরাসরি উত্তর দিন এবং প্রেরিত ছবি/লোগো ভেরিফাই করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/50 text-center">
                <span className="text-[10px] text-purple-300 block">মোট থ্রেড</span>
                <span className="text-xs font-black text-amber-300 font-mono">{customerThreads.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-center">
                <span className="text-[10px] text-rose-300 block">অপঠিত</span>
                <span className="text-xs font-black text-rose-400 font-mono">{unreadLiveChatTotal}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Support Setup Card */}
          <div className="bg-gradient-to-r from-[#072418] via-[#0b3825] to-[#0a261a] p-3.5 rounded-2xl border-2 border-emerald-500/60 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/50 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow">
                  <MessageSquare className="w-4.5 h-4.5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-emerald-300 flex items-center gap-1.5">
                    <span>হোয়াটসঅ্যাপ সাপোর্ট লিঙ্ক ও নম্বর সেটআপ (WhatsApp Setup)</span>
                    <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      লাইভ চ্যাট উইন্ডো সিঙ্ক
                    </span>
                  </h4>
                  <p className="text-[10px] text-emerald-200/80">
                    এখানে নম্বর বা লিঙ্ক সেট করলে ইউজারদের লাইভ চ্যাট উইন্ডোর শীর্ষে সরাসরি WhatsApp বাটন প্রদর্শিত হবে
                  </p>
                </div>
              </div>

              {settingsForm.supportWhatsApp && (
                <a
                  href={
                    settingsForm.supportWhatsApp.startsWith('http')
                      ? settingsForm.supportWhatsApp
                      : `https://wa.me/${settingsForm.supportWhatsApp.replace(/[^0-9]/g, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[11px] font-black flex items-center gap-1.5 self-start sm:self-auto shadow active:scale-95 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>টেস্ট লিঙ্ক ওপেন করুন</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-8">
                <label className="text-[11px] text-emerald-300 font-bold block mb-1">
                  অফিশিয়াল WhatsApp নম্বর অথবা লিঙ্ক:
                </label>
                <input
                  type="text"
                  value={settingsForm.supportWhatsApp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportWhatsApp: e.target.value })}
                  placeholder="e.g. +8801700000000 or https://wa.me/8801700000000"
                  className="w-full bg-[#071912] border border-emerald-600/60 rounded-xl px-3 py-2 text-emerald-200 font-mono text-xs font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-4 flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateAppSettings({ ...settingsForm });
                    setSavedNotice(true);
                    setTimeout(() => setSavedNotice(false), 3000);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>WhatsApp নম্বর সেভ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Auto-Reply System Control Card */}
          <div className="bg-gradient-to-r from-[#1c124a] via-[#211050] to-[#04260f] rounded-2xl border border-amber-400/50 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
                <Bot className="w-6 h-6 text-slate-950" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm text-white">২৪/৭ লাইভ চ্যাট স্মার্ট অটো-রিপ্লাই সিস্টেম</h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    settingsForm.enableLiveChatAutoReply !== false 
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50' 
                      : 'bg-rose-500/25 text-rose-300 border border-rose-400/50'
                  }`}>
                    {settingsForm.enableLiveChatAutoReply !== false ? '● অটো-রিপ্লাই চালু (Active)' : '○ অটো-রিপ্লাই বন্ধ (Disabled)'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200">
                  ইউজার ডিপোজিট, উইথড্র, নিয়মাবলী, বোনাস বা যেকোনো বিষয়ে মেসেজ বা ছবি দিলে স্বয়ংক্রিয়ভাবে নির্ভুল উত্তর চলে যাবে।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = settingsForm.enableLiveChatAutoReply === false ? true : false;
                const updated = { ...settingsForm, enableLiveChatAutoReply: nextVal };
                setSettingsForm(updated);
                onUpdateAppSettings(updated);
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 3000);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer shrink-0 ${
                settingsForm.enableLiveChatAutoReply !== false
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{settingsForm.enableLiveChatAutoReply !== false ? 'অটো-রিপ্লাই সক্রিয় (চালু আছে)' : 'অটো-রিপ্লাই বন্ধ (এখন চালু করুন)'}</span>
            </button>
          </div>

          {/* Main 2-Column Chat Desk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[560px]">
            
            {/* Column 1: Customer Threads List (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-[#04260f] rounded-2xl border border-purple-800/60 p-3 flex flex-col shadow-lg space-y-2.5">
              {/* Search Customer Threads */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder="কাস্টমার নাম, ফোন বা মেসেজ খুঁজুন..."
                  className="w-full bg-[#0b061e] border border-purple-700/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-cyan-400"
                />
                {chatSearchQuery && (
                  <button
                    onClick={() => setChatSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-purple-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Thread List Header */}
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold px-1 pt-1 border-b border-purple-900/40 pb-1.5">
                <span>কাস্টমার চ্যাট থ্রেড ({filteredChatThreads.length})</span>
                {onClearAllLiveChat && safeLiveChatMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePromptClearAllChatThreads}
                    className="px-2 py-0.5 rounded-lg bg-rose-950/90 hover:bg-rose-900 border border-rose-700/60 text-rose-300 hover:text-white text-[9px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-sm"
                    title="সকল ইউজারের চ্যাট ডাটা একসাথে মুছুন (Bulk Action)"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>সব চ্যাট মুছুন</span>
                  </button>
                )}
              </div>

              {/* Scrollable Threads List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[480px] pr-1">
                {filteredChatThreads.length === 0 ? (
                  <div className="text-center py-12 text-purple-400 text-xs space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-purple-500/50" />
                    <p>কোনো চ্যাট মেসেজ পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  filteredChatThreads.map((thread, tIdx) => {
                    const isSelected = thread.userId === effectiveSelectedUserId;
                    return (
                      <div
                        key={`thread-${thread.userId || tIdx}-${tIdx}`}
                        onClick={() => setSelectedChatUserId(thread.userId)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-900/90 to-indigo-950/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                            : 'bg-[#160d38]/70 hover:bg-[#1d1247] border-purple-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-400/50 shadow">
                            {thread.userAvatar ? (
                              <img src={thread.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              thread.userName.charAt(0) || 'U'
                            )}
                          </div>

                          <div className="overflow-hidden space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-white truncate">{thread.userName}</span>
                              {thread.unreadCount > 0 && (
                                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[8px] font-black rounded-full animate-pulse">
                                  {thread.unreadCount} নতুন
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-amber-300/80 font-mono truncate">{thread.userPhone}</p>
                            <p className="text-[11px] text-purple-200/90 truncate flex items-center gap-1">
                              {thread.lastMessage.imageUrl && <Image className="w-3 h-3 text-amber-300 shrink-0" />}
                              <span>{thread.lastMessage.text || 'ছবি/লোগো ফাইল'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-purple-300 font-mono block">{thread.lastMessage.time}</span>
                          <span className="text-[9px] text-cyan-300 font-bold block">{thread.messages?.length || 0}টি মেসেজ</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Active Chat Conversation & Admin Reply Desk (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-[#04260f] rounded-2xl border border-purple-800/60 flex flex-col shadow-xl overflow-hidden">
              {activeThread ? (
                <>
                  {/* Active User Header */}
                  <div className="p-3 bg-gradient-to-r from-[#170e3f] to-[#04260f] border-b border-purple-800/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-sm shadow border border-amber-200">
                        {activeThread.userName.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-white">{activeThread.userName}</h4>
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold rounded-full">
                            কাস্টমার
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-300 font-mono">ফোন: {activeThread.userPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Clear Thread Button */}
                      {onClearLiveChatThread && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePromptClearUserChatThread(
                              activeThread.userId,
                              activeThread.userName,
                              activeThread.userPhone,
                              activeThreadMessages.length
                            )
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-800 border border-rose-700/50 text-rose-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-sm"
                          title="এই কাস্টমারের চ্যাট হিস্ট্রি মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ক্লিয়ার চ্যাট</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-gradient-to-b from-[#031e0c] to-[#04260f] max-h-[380px]">
                    {activeThreadMessages.map((msg, idx) => {
                      const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'agent';
                      return (
                        <div
                          key={`admin-chat-${msg.id || idx}-${idx}`}
                          className={`flex gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isAdmin && (
                            <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-400 shadow mt-1">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md space-y-2 ${
                              isAdmin
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-medium rounded-tr-none shadow-emerald-950/50 border border-emerald-400/40'
                                : 'bg-[#1c1245] text-purple-100 border border-purple-600/50 rounded-tl-none'
                            }`}
                          >
                            {/* Role Banner */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                              <span className="font-extrabold flex items-center gap-1">
                                {msg.senderRole === 'agent' ? (
                                  <span className="text-amber-300 flex items-center gap-1 font-black">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>স্মার্ট অটো-রিপ্লাই (AI Support)</span>
                                  </span>
                                ) : isAdmin ? (
                                  <span className="text-emerald-300 flex items-center gap-1 font-black">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>অফিশিয়াল এডমিন উত্তর</span>
                                  </span>
                                ) : (
                                  <span className="text-cyan-300 font-bold">
                                    কাস্টমার: {msg.userName}
                                  </span>
                                )}
                              </span>
                              <span className="opacity-70 font-mono text-[9px]">{msg.time}</span>
                            </div>

                            {/* Customer Uploaded Photo / Logo Card */}
                            {msg.imageUrl && (
                              <div className="rounded-xl overflow-hidden border border-black/40 bg-black/60 relative group mt-1">
                                <img
                                  src={msg.imageUrl}
                                  alt="Attached"
                                  className="w-full max-h-56 object-contain bg-black/70 rounded-lg cursor-pointer hover:opacity-95 transition"
                                  onClick={() => setAdminZoomPreview(msg.imageUrl || null)}
                                />
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 text-[9px] font-bold text-amber-300 backdrop-blur-sm border border-amber-400/40">
                                  {msg.imageName || 'সংযুক্ত ছবি / লোগো'}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setAdminZoomPreview(msg.imageUrl || null)}
                                  className="absolute bottom-1.5 right-1.5 px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow backdrop-blur-sm"
                                >
                                  <Maximize2 className="w-3 h-3" />
                                  <span>বড় করে দেখুন (Zoom)</span>
                                </button>
                              </div>
                            )}

                            {/* Text Message */}
                            {msg.text && (
                              <p className="whitespace-pre-line text-xs">{msg.text}</p>
                            )}
                          </div>

                          {isAdmin && (
                            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 border border-amber-200 shadow mt-1">
                              <Shield className="w-4 h-4 text-slate-950" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Admin Quick Reply Chips & Category Filter */}
                  <div className="bg-[#031e0c] p-2 border-t border-purple-900/40 space-y-1.5 shrink-0">
                    <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] font-black text-amber-300 shrink-0 mr-1">ক্যাটাগরি:</span>
                        {CANNED_CATEGORIES.map((c) => (
                          <button
                            key={`chat-cat-${c.id}`}
                            type="button"
                            onClick={() => setChatCannedCategory(c.id)}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap transition cursor-pointer ${
                              chatCannedCategory === c.id
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-800/40'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {adminCannedReplies
                        .filter(
                          (item) =>
                            chatCannedCategory === 'all' ||
                            item.category === chatCannedCategory
                        )
                        .map((replyItem) => (
                          <button
                            key={`admin-quick-${replyItem.id}`}
                            type="button"
                            onClick={() => setAdminReplyInput(replyItem.text)}
                            title="ইনপুটে বসাতে ক্লিক করুন"
                            className="px-2.5 py-1 rounded-full bg-purple-950/90 hover:bg-amber-400 hover:text-slate-950 text-purple-200 text-[10px] font-medium border border-purple-700/60 hover:border-amber-400 whitespace-nowrap transition active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            {replyItem.badge && (
                              <span className="text-[8px] px-1 rounded bg-black/40 text-amber-300 font-bold">
                                {replyItem.badge}
                              </span>
                            )}
                            <span className="truncate max-w-[220px]">
                              {replyItem.shortTitle || replyItem.text}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Selected Attachment Preview Box */}
                  {adminAttachedImage && (
                    <div className="bg-[#180f3b] p-2.5 border-t border-amber-400/40 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400 shrink-0 bg-black">
                          <img src={adminAttachedImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{adminAttachedImageName || 'সংযুক্ত ছবি'}</p>
                          <p className="text-[10px] text-amber-300">এডমিন উত্তর হিসেবে পাঠানো হবে</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminAttachedImage(null);
                          setAdminAttachedImageName(null);
                        }}
                        className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Admin Reply Input Box */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAdminSendReply();
                    }}
                    className="p-2.5 bg-[#0b061e] border-t border-purple-800/60 flex items-center gap-2 shrink-0"
                  >
                    {/* Hidden File Input for Admin Attachments */}
                    <input
                      ref={adminFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAdminImageUpload}
                      className="hidden"
                    />

                    {/* Image / Logo Upload Button for Admin */}
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="p-2.5 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-amber-300 border border-purple-600/60 transition shadow shrink-0"
                      title="এডমিন পক্ষ থেকে ছবি বা ভাউচার যুক্ত করুন"
                    >
                      <ImageIcon className="w-4.5 h-4.5" />
                    </button>

                    <input
                      type="text"
                      value={adminReplyInput}
                      onChange={(e) => setAdminReplyInput(e.target.value)}
                      placeholder={adminAttachedImage ? 'ছবির সাথে বিবরণ লিখুন...' : `এখানে ${activeThread.userName}-কে উত্তর লিখুন...`}
                      className="flex-1 bg-[#160d38] border border-purple-700/60 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-cyan-400"
                    />

                    <button
                      type="submit"
                      disabled={!adminReplyInput.trim() && !adminAttachedImage}
                      className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0 flex items-center justify-center gap-1.5 px-4"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold hidden sm:inline">উত্তর পাঠান</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-purple-400 space-y-2">
                  <Headset className="w-12 h-12 text-purple-600" />
                  <h4 className="font-bold text-sm text-white">কোনো চ্যাট থ্রেড নির্বাচিত নেই</h4>
                  <p className="text-xs text-purple-300 max-w-xs">
                    বাম পাশের তালিকা থেকে যেকোনো কাস্টমারের থ্রেড সিলেক্ট করে তাদের মেসেজ এবং প্রেরিত ছবি/লোগো দেখুন ও উত্তর দিন।
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Full-Screen Zoom Lightbox Modal for Admin */}
          {adminZoomPreview && (
            <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3 animate-in fade-in duration-150">
              <div className="w-full max-w-xl flex items-center justify-between pb-3 text-white">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>কাস্টমার প্রেরিত ছবি/লোগো প্রিভিউ (Full Resolution View)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAdminZoomPreview(null)}
                  className="p-2 bg-slate-800 hover:bg-rose-600 rounded-full text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-w-xl max-h-[82vh] overflow-auto rounded-2xl border-2 border-amber-400/80 bg-black flex items-center justify-center p-1 shadow-2xl">
                <img
                  src={adminZoomPreview}
                  alt="Zoomed attachment"
                  className="max-w-full max-h-[80vh] object-contain rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 6: MARQUEE, NOTICES & PUSH BROADCAST ================= */}
      {activeTab === 'notices' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* ================= SECTION 1: GLOBAL PUSH NOTIFICATION BROADCAST ================= */}
          <form onSubmit={handleSendPushNotification} className="bg-[#052a12] p-4 rounded-2xl border-2 border-amber-400/60 space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <Megaphone className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>সিস্টেম-ওয়াইড ব্রডকাস্ট নোটিফিকেশন পাঠান</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">LIVE POPUP</span>
                  </h3>
                  <p className="text-[10px] text-purple-300 font-mono mt-0.5">
                    সমস্ত {safeRegisteredUsers.length || 1} জন ব্যবহারকারীর হোম স্ক্রিনে সরাসরি ফ্লোটিং মডাল পপ-আপ পাঠান।
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[10px] bg-purple-950 px-2 py-1 rounded-lg border border-purple-700/50 text-amber-300 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{safeRegisteredUsers.length} Users Target</span>
              </div>
            </div>

            {/* Quick 1-Click Templates */}
            <div className="space-y-1.5 bg-[#031e0c] p-2.5 rounded-xl border border-purple-800/50">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>তাৎক্ষণিক টেমপ্লেট নির্বাচন করুন (1-Click Presets):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => selectPushTemplate('maintenance')}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-1.5 text-xs font-bold ${
                    pushType === 'maintenance'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                      : 'bg-purple-900/30 border-purple-800/60 text-purple-200 hover:bg-purple-800/50'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block truncate text-[11px]">🛠️ মেইনটেন্যান্স</span>
                    <span className="block text-[9px] text-purple-400 font-normal">সার্ভার আপগ্রেড</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectPushTemplate('event')}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-1.5 text-xs font-bold ${
                    pushType === 'event'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                      : 'bg-purple-900/30 border-purple-800/60 text-purple-200 hover:bg-purple-800/50'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block truncate text-[11px]">🏆 গেম ইভেন্ট</span>
                    <span className="block text-[9px] text-purple-400 font-normal">টুর্নামেন্ট নোটিশ</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectPushTemplate('offer')}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-1.5 text-xs font-bold ${
                    pushType === 'offer'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                      : 'bg-purple-900/30 border-purple-800/60 text-purple-200 hover:bg-purple-800/50'
                  }`}
                >
                  <Gift className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block truncate text-[11px]">🎁 বোনাস অফার</span>
                    <span className="block text-[9px] text-purple-400 font-normal">ডিপোজিট ক্যাশব্যাক</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectPushTemplate('warning')}
                  className={`p-2 rounded-xl text-left border transition flex items-center gap-1.5 text-xs font-bold ${
                    pushType === 'warning'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 ring-1 ring-rose-400'
                      : 'bg-purple-900/30 border-purple-800/60 text-purple-200 hover:bg-purple-800/50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block truncate text-[11px]">⚠️ সিকিউরিটি</span>
                    <span className="block text-[9px] text-purple-400 font-normal">জরুরি সতর্কতা</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Notification Title */}
              <div>
                <label className="text-purple-200 font-bold block mb-1">নোটিফিকেশন টাইটেল (Heading / Title):</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="যেমন: 🛠️ জরুরি সিস্টেম মেইনটেন্যান্স বিজ্ঞপ্তি"
                  className="w-full bg-[#08031d] border border-purple-600/60 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Notification Message */}
              <div>
                <label className="text-purple-200 font-bold block mb-1">নোটিফিকেশন বার্তা (Message Details):</label>
                <textarea
                  rows={2}
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  placeholder="এখানে বিস্তারিত নোটিফিকেশন বার্তা লিখুন..."
                  className="w-full bg-[#08031d] border border-purple-600/60 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Category, Target Screen & Button Label */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-purple-200 font-bold block mb-1">নোটিফিকেশন ক্যাটাগরি:</label>
                  <select
                    value={pushType}
                    onChange={(e) => setPushType(e.target.value as any)}
                    className="w-full bg-[#08031d] border border-purple-600/60 rounded-xl px-3 py-2 text-amber-300 font-bold text-xs focus:outline-none"
                  >
                    <option value="maintenance">🛠️ সার্ভার মেইনটেন্যান্স (Maintenance)</option>
                    <option value="event">🏆 গেম ইভেন্ট ও টুর্নামেন্ট (Event)</option>
                    <option value="offer">🎁 বোনাস / অফার (Offer)</option>
                    <option value="warning">⚠️ জরুরি সতর্কবার্তা (Warning)</option>
                    <option value="general">📢 সাধারণ ঘোষণা (General)</option>
                  </select>
                </div>

                <div>
                  <label className="text-purple-200 font-bold block mb-1">বাটনে ক্লিক করলে যাবে:</label>
                  <select
                    value={pushTargetScreen}
                    onChange={(e) => setPushTargetScreen(e.target.value as ScreenType)}
                    className="w-full bg-[#08031d] border border-purple-600/60 rounded-xl px-3 py-2 text-emerald-400 font-bold text-xs focus:outline-none"
                  >
                    <option value="home">🏠 হোম স্ক্রিন (Home)</option>
                    <option value="support">📞 কাস্টমার সাপোর্ট (Support)</option>
                    <option value="matchmaking">🎮 ম্যাচমেকিং / টুর্নামেন্ট (Matchmaking)</option>
                    <option value="add_money">💳 টাকা জমা (Add Money)</option>
                    <option value="withdraw">💰 টাকা উত্তোলন (Withdraw)</option>
                    <option value="leaderboard">🏆 লিডারবোর্ড (Leaderboard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-purple-200 font-bold block mb-1">অ্যাকশন বাটন টেক্সট:</label>
                  <input
                    type="text"
                    value={pushActionText}
                    onChange={(e) => setPushActionText(e.target.value)}
                    placeholder="যেমন: সাপোর্টে কথা বলুন"
                    className="w-full bg-[#08031d] border border-purple-600/60 rounded-xl px-3 py-2 text-cyan-300 font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="bg-[#0b0422] p-3 rounded-2xl border border-purple-700/50 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Eye className="w-3.5 h-3.5" />
                  <span>লাইভ মডাল প্রিভিউ (User Screen Floating Modal Preview):</span>
                </span>
                <span className="text-[9px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full font-mono">
                  {pushType.toUpperCase()}
                </span>
              </div>

              {/* Rendered Preview Card */}
              <div className="p-3.5 bg-[#140b36] border-2 border-amber-400/80 rounded-2xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {pushType === 'maintenance' ? (
                        <Wrench className="w-4 h-4 text-amber-400" />
                      ) : pushType === 'event' ? (
                        <Trophy className="w-4 h-4 text-cyan-400" />
                      ) : pushType === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : pushType === 'offer' ? (
                        <Gift className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Megaphone className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                        {pushType === 'maintenance' ? '🛠️ SYSTEM MAINTENANCE' : pushType === 'event' ? '🏆 GAME EVENT' : pushType === 'warning' ? '⚠️ SECURITY NOTICE' : '📢 BROADCAST'}
                      </span>
                      <p className="text-[9px] text-purple-400 font-mono">এখনই • সমস্ত প্লেয়ারদের স্ক্রিনে দেখাবে</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-white">{pushTitle || 'নোটিফিকেশন টাইটেল'}</h4>
                  <p className="text-[11px] text-purple-200 leading-relaxed bg-[#0a031d] p-2 rounded-xl border border-purple-800/40">
                    {pushMessage || 'নোটিফিকেশন মেসেজের বিবরণ...'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[11px] rounded-xl text-center shadow">
                    {pushActionText || 'এখনই দেখুন (View Now)'}
                  </div>
                  <div className="px-3 py-2 bg-purple-900/60 text-purple-300 font-bold text-[11px] rounded-xl text-center">
                    বন্ধ করুন
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>সরাসরি ব্রডকাস্ট পাঠান ও হোম স্ক্রিনে মডাল ট্রিগার করুন (Broadcast Now)</span>
            </button>

            {broadcastNoticeSent && (
              <div className="p-2.5 bg-emerald-950/90 border border-emerald-400 text-emerald-200 rounded-xl text-xs font-extrabold text-center animate-bounce shadow-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>সফলভাবে {safeRegisteredUsers.length || 1} জন প্লেয়ারের কাছে ব্রডকাস্ট পাঠানো হয়েছে এবং হোম স্ক্রিন মডাল ট্রিগার করা হয়েছে!</span>
              </div>
            )}
          </form>

          {/* ================= SECTION 2: SENT BROADCAST NOTIFICATIONS HISTORY ================= */}
          {safeSentNotifications.length > 0 && (
            <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>পূর্ববর্তী প্রেরিত পুশ নোটিফিকেশনসমূহ ({safeSentNotifications.length})</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {safeSentNotifications.map((notif, nIdx) => (
                  <div
                    key={`admin-notif-${notif.id || nIdx}-${nIdx}`}
                    className="p-3 bg-[#0c0624] rounded-xl border border-purple-800/50 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-300">{notif.title}</span>
                        <span className="text-[9px] bg-purple-900 text-purple-200 px-1.5 py-0.2 rounded font-mono uppercase">
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-200/90">{notif.message}</p>
                      <p className="text-[9px] text-purple-400 font-mono">
                        সময়: {notif.sentAt} • প্রাপক: {notif.recipientCount} জন প্লেয়ার
                      </p>
                    </div>

                    {onDeleteBroadcastNotification && (
                      <button
                        type="button"
                        onClick={() => handlePromptDeleteNotification(notif.id, notif.title)}
                        className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg transition active:scale-95 cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 2: MARQUEE & SUPPORT SETTINGS ================= */}
          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
              <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>হোম পেজ রানিং নোটিশ (Marquee Text)</span>
              </h3>

              <div>
                <label className="text-purple-300 text-xs font-bold block mb-1">নোটিশ টেক্সট:</label>
                <textarea
                  rows={3}
                  value={settingsForm.marqueeNotice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeNotice: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
              <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>সাপোর্ট ও সোশ্যাল মিডিয়া লিঙ্ক</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-purple-300 font-bold block mb-1">Telegram চ্যানেল লিঙ্ক:</label>
                  <input
                    type="text"
                    value={settingsForm.supportTelegram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportTelegram: e.target.value })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-purple-300 font-bold block mb-1">WhatsApp নম্বর / লিঙ্ক:</label>
                  <input
                    type="text"
                    value={settingsForm.supportWhatsApp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportWhatsApp: e.target.value })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-purple-300 font-bold block mb-1">প্রতি রেফারে বোনাস টাকা (৳):</label>
                  <input
                    type="number"
                    value={settingsForm.referralBonus}
                    onChange={(e) => setSettingsForm({ ...settingsForm, referralBonus: Number(e.target.value) })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>নোটিশ সেভ করুন (Save Notice)</span>
            </button>

            {savedNotice && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold text-center animate-bounce">
                ✓ নোটিশ ও সাপোর্ট লিঙ্ক আপডেট হয়েছে!
              </div>
            )}
          </form>
        </div>
      )}

      {/* ================= TAB 6: GAME & BOT RULES ================= */}
      {activeTab === 'game' && (
        <form onSubmit={handleSaveSettings} className="space-y-3.5 animate-in fade-in duration-200">
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
            <h3 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>লুডু গেম রুলস ও এআই ডিফিকাল্টি</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Requirement 2: 5% to 20% Platform Profit */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-purple-300 font-bold block">
                    প্ল্যাটফর্ম প্রফিট / কমিশন ফি (Platform Profit Margin):
                  </label>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 font-mono">
                    {Math.min(20, Math.max(5, settingsForm.platformCommissionPercent || 10))}% প্রফিট
                  </span>
                </div>
                
                {/* 5% to 20% Range Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-purple-400 font-mono">৫%</span>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={Math.min(20, Math.max(5, settingsForm.platformCommissionPercent || 10))}
                    onChange={(e) => {
                      const newRate = Math.min(20, Math.max(5, Number(e.target.value)));
                      const updated = { ...settingsForm, platformCommissionPercent: newRate };
                      setSettingsForm(updated);
                      onUpdateAppSettings(updated);
                    }}
                    className="flex-1 accent-emerald-400 h-2 bg-purple-950 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-purple-400 font-mono">২০%</span>
                </div>

                {/* Quick Preset Buttons (5% - 20%) */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[5, 8, 10, 15, 20].map((rate) => (
                    <button
                      key={`profit-rate-${rate}`}
                      type="button"
                      onClick={() => {
                        const updated = { ...settingsForm, platformCommissionPercent: rate };
                        setSettingsForm(updated);
                        onUpdateAppSettings(updated);
                      }}
                      className={`py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                        (settingsForm.platformCommissionPercent || 10) === rate
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                          : 'bg-[#052a12] border-purple-800/50 text-purple-300 hover:text-white'
                      }`}
                    >
                      {rate}% {rate === 10 ? '(ডিফল্ট)' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  এডমিন প্যানেল থেকে ৫% থেকে ২০% পর্যন্ত প্ল্যাটফর্ম লাভ রাখতে পারবেন। বিজয়ী প্রাইজপুল থেকে এই শতাংশ কেটে নেওয়া হবে।
                </p>
              </div>

              {/* Bot Difficulty Selector */}
              <div>
                <label className="text-purple-300 font-bold block mb-1">বট ডিফিকাল্টি (Bot Level):</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Normal', 'Hard'] as const).map((lvl, lIdx) => (
                    <button
                      key={`bot-level-${lvl}-${lIdx}`}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, botDifficulty: lvl })}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                        settingsForm.botDifficulty === lvl
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-[#031e0c] border-purple-800/40 text-purple-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement 3: Real Player 45% default win rate vs Bot, adjustable from Admin Panel */}
              <div className="bg-[#031e0c] p-3 rounded-2xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-amber-300 font-bold block">
                      রিয়েল প্লেয়ার উইনিং রেট (Real Player Win Rate vs Bot):
                    </label>
                    <span className="text-[10px] text-purple-300">
                      বট/কম্পিউটার জয়ী হবে: {100 - (settingsForm.playerWinRatePercent ?? 45)}%
                    </span>
                  </div>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-500/40 font-mono">
                    {settingsForm.playerWinRatePercent ?? 45}% প্লেয়ার জয়
                  </span>
                </div>

                {/* Win Rate Slider (10% to 90%) */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-purple-400 font-mono">১০%</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={settingsForm.playerWinRatePercent ?? 45}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSettingsForm({
                        ...settingsForm,
                        playerWinRatePercent: val,
                        companyWinRatePercent: 100 - val,
                      });
                    }}
                    className="flex-1 accent-amber-400 h-2 bg-purple-950 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-purple-400 font-mono">৯০%</span>
                </div>

                {/* Quick Preset Buttons */}
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {[20, 30, 45, 55, 65, 75].map((rate) => (
                    <button
                      key={`player-winrate-${rate}`}
                      type="button"
                      onClick={() =>
                        setSettingsForm({
                          ...settingsForm,
                          playerWinRatePercent: rate,
                          companyWinRatePercent: 100 - rate,
                        })
                      }
                      className={`py-1.5 rounded-xl text-[10px] font-black border transition cursor-pointer ${
                        (settingsForm.playerWinRatePercent ?? 45) === rate
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                          : 'bg-[#052a12] border-purple-800/50 text-purple-300 hover:text-white'
                      }`}
                    >
                      {rate}% {rate === 45 ? '★' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  কম্পিউটার/বটের সাথে খেলায় রিয়েল প্লেয়ার গড়ে ৪৫% ম্যাচে জয়ী হওয়ার সুযোগ পাবে। এডমিন প্যানেল থেকে এই পারসেন্টেজ ইচ্ছামতো বাড়ানো বা কমানো যায়।
                </p>
              </div>

              {/* Active Rules Overview */}
              <div className="p-3 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2">
                <span className="font-extrabold text-xs text-amber-300 block">সক্রিয় অফিশিয়াল লুডো কিং নিয়মাবলী (Ludo King Official Rules):</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                  <li><strong>খেলোয়াড়:</strong> ২–৪ জন খেলতে পারে।</li>
                  <li><strong>গুটি:</strong> প্রত্যেক খেলোয়াড়ের ৪টি গুটি থাকে।</li>
                  <li><strong>খেলা শুরু:</strong> গুটি ঘর থেকে বের করতে ৬ পড়তে হবে।</li>
                  <li><strong>চাল দেওয়া:</strong> ডাইস (ছক্কা) ফেলে যত সংখ্যা আসে, গুটি তত ঘর এগিয়ে যাবে।</li>
                  <li><strong>৬ পড়লে:</strong> গুটি বের করতে পারবেন বা কোনো গুটি ৬ ঘর চালাতে পারবেন। এছাড়া আবার ডাইস ফেলার সুযোগ পাবেন।</li>
                  <li><strong>প্রতিপক্ষকে কাটানো:</strong> আপনার গুটি যদি প্রতিপক্ষের গুটির ঘরে গিয়ে দাঁড়ায়, তাহলে প্রতিপক্ষের গুটি আবার শুরুতে ফিরে যাবে।</li>
                  <li><strong>এক ঘরে ডাবল গুটি নিষিদ্ধ:</strong> একই খেলোয়াড়ের দুটি গুটি কখনো একই ঘরে একসাথে ডাবল বা বসবে না (লুডো কিং রুলস)।</li>
                  <li><strong>সেইফ ঘর:</strong> কিছু নির্দিষ্ট ঘরে (সাধারণত তারকা চিহ্নিত) গুটি কাটতে পারে না।</li>
                  <li><strong>হোমে পৌঁছানো:</strong> পুরো বোর্ড ঘুরে নিজের রঙের হোম পথে ঢুকতে হবে।</li>
                  <li><strong>ঠিক সংখ্যা লাগবে:</strong> হোমে ঢুকতে যত ঘর বাকি, ঠিক তত সংখ্যাই ডাইসে আসতে হবে।</li>
                  <li><strong>বিজয়ী:</strong> যে খেলোয়াড় সবার আগে তার গুটি হোমে পৌঁছে দিতে পারে, সে জয়ী।</li>
                </ol>
              </div>
              {/* Official Game Category Control Card */}
              <div className="p-3.5 bg-gradient-to-r from-purple-950 via-[#1a0a38] to-purple-950 rounded-2xl border-2 border-amber-400/60 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                      <Crown className="w-4 h-4 text-slate-950" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-300">অফিসিয়াল কিং লুডো গেম কন্ট্রোল</h4>
                      <p className="text-[10px] text-purple-300">King Ludo এর সার্বিক নিয়ন্ত্রণ ও লাইভ স্ট্যাটাস (Slot, Live Casino & Sports এর জায়গায় Coming Soon)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('site_config');
                      setSiteSubTab('home_game_options');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 hover:from-amber-400 hover:to-yellow-400 cursor-pointer shrink-0 transition"
                  >
                    <span>কিং লুডো ব্যানার সেটিংস</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#031e0c] border border-amber-500/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <span>👑</span>
                        <span>King Ludo (কিং লুডো ব্যানার/ফ্রেম)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">সক্রিয়</span>
                    </div>
                    <div className="text-[10px] text-purple-300 space-y-0.5">
                      <div>প্ল্যাটফর্ম কমিশন: <span className="font-mono text-amber-300 font-bold">{settingsForm.platformCommissionPercent}%</span></div>
                      <div>বেট রেঞ্জ: <span className="font-mono text-emerald-300 font-bold">৳১০ - ৳৫০,০০০</span></div>
                      <div className="text-slate-400 text-[9px]">২P, ৪P, ফ্রেন্ডস রুম ও টুর্নামেন্ট মোডস</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#031e0c] border border-indigo-700/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Slot, Live Casino & Sports ফ্রেম</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">Coming Soon</span>
                    </div>
                    <div className="text-[10px] text-purple-300 space-y-0.5">
                      <div className="text-emerald-300 font-bold">স্লট, ক্যাসিনো ও স্পোর্টস অপশন অপসারিত</div>
                      <div className="text-slate-300 text-[9px]">হোম পেজে এদের জায়গায় মার্জিত "Coming Soon" ফ্রেম প্রদর্শিত হচ্ছে।</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#031e0c] rounded-xl border border-purple-800/40">
                <div>
                  <span className="font-extrabold text-xs text-rose-400 block">ইমার্জেন্সি মেইনটেনেন্স মোড</span>
                  <span className="text-[10px] text-slate-400">অন করলে সাধারণ ইউজাররা খেলা শুরু করতে পারবে না</span>
                </div>

                <input
                  type="checkbox"
                  checked={settingsForm.isMaintenanceMode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, isMaintenanceMode: e.target.checked })}
                  className="w-5 h-5 accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Bulk Administrative Action: Reset Match History */}
              <div className="p-3 bg-gradient-to-r from-rose-950/40 to-[#031e0c] rounded-xl border border-rose-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-rose-300">ম্যাচ হিস্ট্রি সম্পূর্ণ রিসেট (Reset Match History)</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 text-[9px] font-black border border-rose-700/60 uppercase">
                      বাল্ক অ্যাকশন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    সংরক্ষিত সকল অতীত ম্যাচের ফলাফল, স্কোর হিস্ট্রি ও সাম্প্রতিক উইনার রেকর্ড এক ক্লিকে পরিষ্কার করুন।
                  </p>
                  <div className="text-[10px] text-amber-300 font-mono">
                    বর্তমানে মোট সংরক্ষিত রেকর্ড: <span className="font-bold text-amber-200">{safeMatchHistory.length} টি</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePromptResetMatchHistory}
                  disabled={safeMatchHistory.length === 0}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0 ${
                    safeMatchHistory.length === 0
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/60 cursor-pointer'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ম্যাচ হিস্ট্রি রিসেট</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>গেম রুলস আপডেট করুন</span>
          </button>

          {savedNotice && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold text-center animate-bounce">
              ✓ গেম সেটিংস আপডেট হয়েছে!
            </div>
          )}
        </form>
      )}

      {/* ================= TAB 7: HOME PROGRAMS MANAGER (হোম পেজ প্রোগ্রাম নিয়ন্ত্রণ) ================= */}
      {activeTab === 'home_programs' && (
        <form onSubmit={handleSaveSettings} className="space-y-4 animate-in fade-in duration-200">
          {/* Header & Quick Action */}
          <div className="bg-gradient-to-r from-amber-500/20 via-purple-900/60 to-amber-500/20 p-3.5 rounded-2xl border border-amber-400/40 shadow-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span>হোম পেজ প্রোগ্রাম ম্যানেজার (Home Programs)</span>
              </h3>
              <p className="text-[11px] text-amber-200/90 font-medium">
                হোম স্ক্রিনের ব্যানার, নোটিশ, গেম মোডস, চ্যাট ও রিওয়ার্ড প্রোগ্রাম পরিচালনা করুন
              </p>
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          {/* Program 0: Home Page 4 Master Options & Direct Link */}
          <div className="bg-gradient-to-r from-indigo-950/80 via-purple-900/60 to-indigo-950/80 p-4 rounded-2xl border-2 border-amber-400/50 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-white">হোম পেজের ৪টি প্রধান অপশন (Direct 4 Options)</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                      হোম পেজ লিংকড
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    কিং লুডো, স্লট গেমস, লাইভ ক্যাসিনো ও স্পোর্টস বেটিং কার্ড কাস্টমাইজ করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('site_config');
                    setSiteSubTab('home_game_options');
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>৪ অপশন কনফিগ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-3.5 py-2 bg-purple-900/90 hover:bg-purple-800 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>হোম পেজ খুলুন</span>
                </button>
              </div>
            </div>

            {/* Quick 4 Options status pill summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">কিং লুডো</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400">সক্রিয়</span>
              </div>

              <div className="p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">স্লট গেমস</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400">সক্রিয়</span>
              </div>

              <div className="p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">লাইভ ক্যাসিনো</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400">সক্রিয়</span>
              </div>

              <div className="p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">স্পোর্টস বেটিং</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400">সক্রিয়</span>
              </div>
            </div>
          </div>

          {/* Program 1: Banner Slider Controls */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-amber-300">১. প্রমোশনাল ব্যানার স্লাইডার (Banner Slider)</h4>
                  <p className="text-[10px] text-slate-400">হোম স্ক্রিনের উপরে প্রদর্শিত অটো-স্লাইডিং ব্যানারসমূহ</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#031e0c] px-2.5 py-1.5 rounded-xl border border-purple-700/50">
                <span className="text-[11px] font-bold text-slate-300">
                  {settingsForm.showBanners !== false ? 'চালু আছে' : 'বন্ধ আছে'}
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.showBanners !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showBanners: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Banner Items List */}
            {settingsForm.showBanners !== false && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-bold">মোট ব্যানার: {currentBanners.length} টি</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetBanners}
                      className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-[10px] font-bold border border-purple-700/50 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>রিসেট ডিফল্ট</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewBanner}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[10px] font-black shadow flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন ব্যানার যোগ করুন</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {currentBanners.map((banner, index) => (
                    <div
                      key={`admin-banner-${banner.id || index}-${index}`}
                      className={`p-3 rounded-xl border transition-all ${
                        banner.enabled !== false
                          ? 'bg-[#031e0c] border-purple-700/60 shadow-md'
                          : 'bg-[#0a051d]/60 border-purple-900/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-900/80 text-amber-300 text-[10px] font-bold flex items-center justify-center border border-purple-700">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={banner.badge}
                            onChange={(e) => updateBannerField(banner.id, 'badge', e.target.value)}
                            placeholder="ব্যাজ টেক্সট"
                            className="bg-purple-950/70 border border-purple-700/50 rounded-lg px-2 py-0.5 text-[10px] text-amber-300 font-extrabold w-28"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[10px] font-bold text-slate-300 cursor-pointer">
                            <span>{banner.enabled !== false ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                            <input
                              type="checkbox"
                              checked={banner.enabled !== false}
                              onChange={() => toggleBannerEnabled(banner.id)}
                              className="w-3.5 h-3.5 accent-emerald-400 cursor-pointer"
                            />
                          </label>
                          {currentBanners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition"
                              title="ব্যানার ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                        <div>
                          <label className="text-[10px] text-purple-300 font-bold block mb-0.5">টাইটেল (Title):</label>
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => updateBannerField(banner.id, 'title', e.target.value)}
                            className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-300 font-bold block mb-0.5">সাব-টাইটেল (Subtitle):</label>
                          <input
                            type="text"
                            value={banner.subtitle}
                            onChange={(e) => updateBannerField(banner.id, 'subtitle', e.target.value)}
                            className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-300 font-bold block mb-0.5">বাটন টেক্সট (Button):</label>
                          <input
                            type="text"
                            value={banner.buttonText}
                            onChange={(e) => updateBannerField(banner.id, 'buttonText', e.target.value)}
                            className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-300 font-bold block mb-0.5">টার্গেট স্ক্রিন (Action):</label>
                          <select
                            value={banner.action === 'refer' ? 'refer' : banner.targetScreen}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'refer') {
                                updateBannerField(banner.id, 'action', 'refer');
                                updateBannerField(banner.id, 'targetScreen', 'home');
                              } else {
                                updateBannerField(banner.id, 'action', 'navigate');
                                updateBannerField(banner.id, 'targetScreen', val as ScreenType);
                              }
                            }}
                            className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-medium cursor-pointer"
                          >
                            <option value="matchmaking">টুর্নামেন্ট (Tournament)</option>
                            <option value="create_match">ম্যাচ তৈরি / গেম মোড (Create Match)</option>
                            <option value="add_money">ডিপোজিট / Add Money</option>
                            <option value="withdraw">উইথড্র / Withdraw</option>
                            <option value="support">সাপোর্ট হেল্পলাইন (Support)</option>
                            <option value="refer">রেফারেল ফ্রেন্ডস (Refer Friends)</option>
                            <option value="leaderboard">লিডারবোর্ড (Leaderboard)</option>
                            <option value="match_history">ম্যাচ হিস্ট্রি (History)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Program 2: Live Marquee Notice */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-2.5">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-amber-300">২. লাইভ স্ক্রলিং নোটিশ (Marquee Notice)</h4>
                  <p className="text-[10px] text-slate-400">হোম স্ক্রিনের নোটিশ বার যা চলমান থাকে</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#031e0c] px-2.5 py-1.5 rounded-xl border border-purple-700/50">
                <span className="text-[11px] font-bold text-slate-300">
                  {settingsForm.showMarqueeNotice !== false ? 'চালু আছে' : 'বন্ধ আছে'}
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.showMarqueeNotice !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showMarqueeNotice: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>

            {settingsForm.showMarqueeNotice !== false && (
              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1">নোটিশ বার্তা (Notice Message):</label>
                <textarea
                  value={settingsForm.marqueeNotice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeNotice: e.target.value })}
                  rows={2}
                  className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-amber-200 font-medium"
                  placeholder="হোম স্ক্রিনে স্ক্রল করার মতো বার্তা লিখুন..."
                />
              </div>
            )}
          </div>

          {/* Program 3: Quick Deposit & Withdraw Bar */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-400/20 text-emerald-300">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-amber-300">৩. কুইক ডিপোজিট ও উইথড্র বার (Quick Action Bar)</h4>
                  <p className="text-[10px] text-slate-400">হোম স্ক্রিনে ডিপোজিট ও উইথড্র করার দ্রুত বাটন</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#031e0c] px-2.5 py-1.5 rounded-xl border border-purple-700/50">
                <span className="text-[11px] font-bold text-slate-300">
                  {settingsForm.showQuickDepositWithdraw !== false ? 'চালু আছে' : 'বন্ধ আছে'}
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.showQuickDepositWithdraw !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showQuickDepositWithdraw: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Program 4: Live Chat Support Widgets */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
            <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2">
              <div className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">
                <Headset className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-amber-300">৪. লাইভ চ্যাট সাপোর্ট প্রোগ্রাম (Live Chat Support)</h4>
                <p className="text-[10px] text-slate-400">হোম পেজে ব্যানার ও ফ্লোটিং চ্যাট উইজেট নিয়ন্ত্রণ</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40">
                <div>
                  <span className="font-bold text-slate-200 block">হোম পেজ লাইভ চ্যাট ব্যানার</span>
                  <span className="text-[10px] text-slate-400">ব্যানার প্রেস করলে সরাসরি চ্যাট উইন্ডো খুলবে</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.showLiveChatBanner !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showLiveChatBanner: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              {settingsForm.showLiveChatBanner !== false && (
                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1">চ্যাট ব্যানার ট্যাগলাইন (Tagline):</label>
                  <input
                    type="text"
                    value={settingsForm.liveChatTagline || 'যেকোনো সমস্যায় সরাসরি এজেন্টের সাথে কথা বলুন'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, liveChatTagline: e.target.value })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-cyan-200"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 bg-[#031e0c] rounded-xl border border-purple-800/40">
                <div>
                  <span className="font-bold text-slate-200 block">ফ্লোটিং লাইভ চ্যাট গোল বাটন (Floating Widget)</span>
                  <span className="text-[10px] text-slate-400">স্ক্রিনের নিচে ভাসমান গোল বাটন</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.showLiveChatFloating !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showLiveChatFloating: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Program 5: Game Modes Management */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
            <div className="flex items-center gap-2 border-b border-purple-800/40 pb-2">
              <div className="p-1.5 rounded-lg bg-red-400/20 text-red-300">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-amber-300">৫. গেম মোডস কার্ড ম্যানেজমেন্ট (Game Modes)</h4>
                <p className="text-[10px] text-slate-400">হোম পেজে প্রদর্শিত ৪টি গেম মোড কার্ড নিয়ন্ত্রণ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* 2 Player Mode */}
              <div className="p-3 bg-[#031e0c] rounded-xl border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>2 Player Mode</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.enable2PlayerMode !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enable2PlayerMode: e.target.checked })}
                    className="w-4 h-4 accent-red-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-0.5">সাবটাইটেল:</label>
                  <input
                    type="text"
                    value={settingsForm.mode2PlayerSubtitle || 'Quick 1v1 Match'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mode2PlayerSubtitle: e.target.value })}
                    className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* 4 Player Mode */}
              <div className="p-3 bg-[#031e0c] rounded-xl border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>4 Player Mode</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.enable4PlayerMode !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enable4PlayerMode: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-0.5">সাবটাইটেল:</label>
                  <input
                    type="text"
                    value={settingsForm.mode4PlayerSubtitle || 'Classic Battle'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mode4PlayerSubtitle: e.target.value })}
                    className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Private Room Mode */}
              <div className="p-3 bg-[#031e0c] rounded-xl border border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Private Room</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.enablePrivateRoomMode !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enablePrivateRoomMode: e.target.checked })}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-0.5">সাবটাইটেল:</label>
                  <input
                    type="text"
                    value={settingsForm.modePrivateSubtitle || 'Play with Friends'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, modePrivateSubtitle: e.target.value })}
                    className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Tournament Mode */}
              <div className="p-3 bg-[#031e0c] rounded-xl border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Tournament</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.enableTournamentMode !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableTournamentMode: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-0.5">সাবটাইটেল:</label>
                  <input
                    type="text"
                    value={settingsForm.modeTournamentSubtitle || 'Big Prize Pool'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, modeTournamentSubtitle: e.target.value })}
                    className="w-full bg-[#052a12] border border-purple-700/50 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Program 6: Latest Winners Ticker */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-yellow-400/20 text-yellow-300">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-amber-300">৬. সাম্প্রতিক বিজয়ী টিকার (Latest Winners Ticker)</h4>
                  <p className="text-[10px] text-slate-400">রিয়েল-টাইম ম্যাচ জয়ীদের তালিকা স্ক্রলার</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#031e0c] px-2.5 py-1.5 rounded-xl border border-purple-700/50">
                <span className="text-[11px] font-bold text-slate-300">
                  {settingsForm.showLatestWinnersTicker !== false ? 'চালু আছে' : 'বন্ধ আছে'}
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.showLatestWinnersTicker !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showLatestWinnersTicker: e.target.checked })}
                  className="w-4 h-4 accent-yellow-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Program 7: Refer & Earn Promotion */}
          <div className="bg-[#052a12] p-3.5 rounded-2xl border border-purple-700/40 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-pink-400/20 text-pink-300">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-amber-300">৭. রেফার ও আর্ন ব্যানার (Refer & Earn Banner)</h4>
                  <p className="text-[10px] text-slate-400">হোম স্ক্রিনে রেফারেল বোনাস কার্ড</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#031e0c] px-2.5 py-1.5 rounded-xl border border-purple-700/50">
                <span className="text-[11px] font-bold text-slate-300">
                  {settingsForm.showReferEarnBanner !== false ? 'চালু আছে' : 'বন্ধ আছে'}
                </span>
                <input
                  type="checkbox"
                  checked={settingsForm.showReferEarnBanner !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showReferEarnBanner: e.target.checked })}
                  className="w-4 h-4 accent-pink-400 cursor-pointer"
                />
              </label>
            </div>

            {settingsForm.showReferEarnBanner !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1">রেফারেল বোনাস (৳):</label>
                  <input
                    type="number"
                    value={settingsForm.referralBonus}
                    onChange={(e) => setSettingsForm({ ...settingsForm, referralBonus: Number(e.target.value) })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1">ব্যানার টেক্সট (Promo Text):</label>
                  <input
                    type="text"
                    value={settingsForm.referBannerPromoText || `বন্ধুদের ইনভাইট করে পেয়ে যান ৳${settingsForm.referralBonus || 100} বোনাস!`}
                    onChange={(e) => setSettingsForm({ ...settingsForm, referBannerPromoText: e.target.value })}
                    className="w-full bg-[#031e0c] border border-purple-700/50 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Master Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition"
          >
            <Save className="w-4 h-4" />
            <span>হোম প্রোগ্রাম সেটিংস সেভ করুন (Save Home Programs)</span>
          </button>

          {savedNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold text-center animate-bounce shadow-lg">
              ✓ হোম পেজ প্রোগ্রাম কনফিগারেশন সফলভাবে আপডেট ও সেভ হয়েছে!
            </div>
          )}
        </form>
      )}

      {/* ================= PROGRAM TAB: VIP & CASHBACK TIERS ================= */}
      {activeTab === 'vip_cashback' && (
        <VIPCashbackView />
      )}

      {/* ================= PROGRAM TAB: SPINNER / WHEEL CONFIG ================= */}
      {activeTab === 'spinner_wheel' && (
        <SpinnerWheelConfigView onNavigate={onNavigate} currentUser={currentUser} />
      )}

      {/* ================= PROGRAM TAB: FINANCE (DEPOSITS, WITHDRAWALS & TRANS) ================= */}
      {activeTab === 'finance' && (
        <FinanceProgramView
          transactions={transactions}
          onApproveTransaction={onApproveTransaction}
          onRejectTransaction={onRejectTransaction}
          onBulkApproveTransactions={onBulkApproveTransactions}
          onBulkRejectTransactions={onBulkRejectTransactions}
          subTab={financeSubTab}
          onSubTabChange={setFinanceSubTab}
        />
      )}

      {/* ================= PROGRAM TAB: USERS & ROLES ================= */}
      {activeTab === 'users_roles' && (
        <UsersRolesView
          registeredUsers={registeredUsers}
          onUpdateUserBalance={onUpdateUserBalance}
          onToggleUserBan={handleToggleUserBanInternal}
          subTab={usersSubTab}
          onSubTabChange={setUsersSubTab}
        />
      )}

      {/* ================= PROGRAM TAB: GAME SYSTEM ================= */}
      {activeTab === 'game_system' && (
        <GameSystemView
          subTab={gameSubTab}
          onSubTabChange={setGameSubTab}
          onNavigate={onNavigate}
        />
      )}

      {/* ================= PROGRAM TAB: AGENT CONFIG ================= */}
      {activeTab === 'agent_config' && (
        <AgentConfigView
          subTab={agentSubTab}
          onSubTabChange={setAgentSubTab}
        />
      )}

      {/* ================= PROGRAM TAB: AFFILIATE SYSTEM ================= */}
      {activeTab === 'affiliate_system' && (
        <AffiliateSystemView
          subTab={affiliateSubTab}
          onSubTabChange={setAffiliateSubTab}
        />
      )}

      {/* ================= PROGRAM TAB: SITE CONFIG ================= */}
      {activeTab === 'site_config' && (
        <SiteConfigView
          subTab={siteSubTab}
          onSubTabChange={setSiteSubTab}
          appSettings={settingsForm}
          onUpdateAppSettings={(newS) => {
            setSettingsForm(newS);
            onUpdateAppSettings(newS);
          }}
          onNavigate={onNavigate}
          onClearAllData={onClearAllData}
        />
      )}

      {/* ================= PROGRAM TAB: SUPPORT ================= */}
      {activeTab === 'support' && (
        <SupportProgramView
          subTab={supportSubTab}
          onSubTabChange={setSupportSubTab}
        />
      )}

      {/* Confirmation Modal for Bulk and Critical Administrative Actions */}
      <AdminConfirmModal config={confirmModal} onClose={() => setConfirmModal(null)} />

      {/* Manual Transaction Modal (ডিপোজিট বা উইথড্র সরাসরি অ্যাডমিন থেকে) */}
      {showManualTrxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#14092f] border-2 border-amber-400/90 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">নতুন ম্যানুয়াল লেনদেন (Manual Action)</h3>
                  <p className="text-[11px] text-purple-300">যেকোনো ইউজারের অ্যাকাউন্টে সরাসরি ব্যালেন্স যোগ বা কর্তন করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManualTrxModal(false)}
                className="p-1.5 rounded-xl bg-purple-900/60 text-purple-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteManualTrx} className="space-y-3.5 text-xs">
              {/* Target User Selector */}
              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                  ইউজার নির্বাচন করুন:
                </label>
                <select
                  value={manualTrxUserId}
                  onChange={(e) => setManualTrxUserId(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                  required
                >
                  <option value="" disabled>-- ইউজার বেছে নিন --</option>
                  {safeRegisteredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || 'User'} ({u.phone || u.id}) — বর্তমান ব্যালেন্স: ৳{(Number(u.balance) || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction Type Toggle */}
              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                  লেনদেনের প্রকার:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualTrxType('deposit')}
                    className={`py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      manualTrxType === 'deposit'
                        ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/50'
                        : 'bg-purple-950/70 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    <span>💰 ডিপোজিট (ব্যালেন্স যোগ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManualTrxType('withdraw')}
                    className={`py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      manualTrxType === 'withdraw'
                        ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400/50'
                        : 'bg-purple-950/70 text-purple-300 hover:bg-purple-900 border border-purple-800/40'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    <span>📤 উইথড্র / কর্তন (ব্যালেন্স বিয়োগ)</span>
                  </button>
                </div>
              </div>

              {/* Amount input & Quick Chips */}
              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                  টাকার পরিমাণ (৳):
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 500"
                  value={manualTrxAmount}
                  onChange={(e) => setManualTrxAmount(e.target.value)}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2.5 text-base font-mono font-black text-amber-300 placeholder-purple-500 focus:outline-none focus:border-amber-400"
                  required
                  min="1"
                />
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
                  {[100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setManualTrxAmount(String(val))}
                      className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] font-mono font-bold border border-purple-700/40 transition shrink-0"
                    >
                      +৳{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Gateway Method */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                    পেমেন্ট মেথড:
                  </label>
                  <select
                    value={manualTrxMethod}
                    onChange={(e) => setManualTrxMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Upay">Upay (উপায়)</option>
                    <option value="BinancePay">Binance Pay</option>
                    <option value="Cryptocurrency">USDT Crypto</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                    নোট / TrxID (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    placeholder="নোট বা TrxID"
                    value={manualTrxNote}
                    onChange={(e) => setManualTrxNote(e.target.value)}
                    className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white placeholder-purple-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* New Projected Balance Summary */}
              {manualTrxUserId && manualTrxAmount && Number(manualTrxAmount) > 0 && (() => {
                const targetU = safeRegisteredUsers.find((u) => u.id === manualTrxUserId);
                const currentBal = targetU?.balance || 0;
                const amt = Number(manualTrxAmount);
                const newBal = manualTrxType === 'deposit' ? currentBal + amt : Math.max(0, currentBal - amt);

                return (
                  <div className="p-3 bg-purple-950/80 rounded-xl border border-purple-800/60 flex items-center justify-between font-mono">
                    <span className="text-purple-300 font-sans text-xs">ইউজারের নতুন ব্যালেন্স:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">৳{currentBal} →</span>
                      <strong className={`text-sm ${manualTrxType === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ৳{newBal.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-purple-800/60">
                <button
                  type="button"
                  onClick={() => setShowManualTrxModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black transition active:scale-95 shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editTrxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14092f] border-2 border-purple-500/80 rounded-3xl p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-900 text-amber-400 flex items-center justify-center font-black">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">লেনদেনের তথ্য সংশোধন (Edit)</h3>
                  <p className="text-[10px] text-purple-300 font-mono">ID: {editTrxModal.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTrxModal(null)}
                className="p-1.5 rounded-xl bg-purple-900/60 text-purple-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTrx} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1">টাকার পরিমাণ (৳):</label>
                <input
                  type="number"
                  value={editTrxModal.amount}
                  onChange={(e) => setEditTrxModal({ ...editTrxModal, amount: Number(e.target.value) || 0 })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1">অ্যাকাউন্ট / ফোন নম্বর:</label>
                <input
                  type="text"
                  value={editTrxModal.accountNumber}
                  onChange={(e) => setEditTrxModal({ ...editTrxModal, accountNumber: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1">TrxID / OrderID:</label>
                <input
                  type="text"
                  value={editTrxModal.trxId}
                  onChange={(e) => setEditTrxModal({ ...editTrxModal, trxId: e.target.value })}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-purple-800/60">
                <button
                  type="button"
                  onClick={() => setEditTrxModal(null)}
                  className="flex-1 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition cursor-pointer shadow"
                >
                  পরিবর্তন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Transaction with Reason Modal */}
      {rejectTrxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#14092f] border-2 border-rose-500/80 rounded-3xl p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950 text-rose-400 border border-rose-500/60 flex items-center justify-center font-black">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {rejectTrxModal.type === 'deposit' ? 'ডিপোজিট বাতিল' : 'উইথড্র বাতিল ও রিফান্ড'}
                  </h3>
                  <p className="text-[10px] text-purple-300">
                    {rejectTrxModal.userName || 'ইউজার'} • ৳{rejectTrxModal.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectTrxModal(null)}
                className="p-1.5 rounded-xl bg-purple-900/60 text-purple-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {rejectTrxModal.type === 'withdraw' && (
                <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-700/50 text-[11px] text-rose-200">
                  ℹ️ <strong>স্বয়ংক্রিয় রিফান্ড:</strong> উইথড্র বাতিল করলে ৳{rejectTrxModal.amount.toLocaleString()} সাথে সাথে ইউজারের ওয়ালেট ব্যালেন্সে ফেরত দেওয়া হবে।
                </div>
              )}

              <div>
                <label className="text-[11px] text-purple-300 font-bold block mb-1.5">
                  বাতিলের কারণ নির্বাচন করুন বা লিখুন:
                </label>
                <div className="space-y-1.5 mb-2">
                  {[
                    rejectTrxModal.type === 'deposit' ? 'ভুল বা জাল TrxID নম্বর' : 'ভুল উইথড্র অ্যাকাউন্ট নম্বর',
                    rejectTrxModal.type === 'deposit' ? 'পেমেন্ট অ্যাকাউন্টে টাকা জমা পাওয়া যায়নি' : 'উইথড্র পাসওয়ার্ড বা সিকিউরিটি সমস্যা',
                    'সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন',
                    'ইউজারের অনুরোধে বাতিল করা হলো',
                  ].map((presetReason) => (
                    <button
                      key={presetReason}
                      type="button"
                      onClick={() => setRejectTrxModal({ ...rejectTrxModal, reason: presetReason })}
                      className={`w-full text-left p-2 rounded-xl border text-[11px] transition cursor-pointer ${
                        rejectTrxModal.reason === presetReason
                          ? 'bg-rose-950/80 border-rose-500 text-white font-bold'
                          : 'bg-[#031e0c] border-purple-800/40 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      • {presetReason}
                    </button>
                  ))}
                </div>

                <textarea
                  value={rejectTrxModal.reason}
                  onChange={(e) => setRejectTrxModal({ ...rejectTrxModal, reason: e.target.value })}
                  placeholder="অন্য কোনো নির্দিষ্ট কারণ লিখুন..."
                  rows={2}
                  className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl p-2 text-white placeholder-purple-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-purple-800/60">
                <button
                  type="button"
                  onClick={() => setRejectTrxModal(null)}
                  className="flex-1 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold transition cursor-pointer"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectTrx}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition cursor-pointer shadow flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>হ্যাঁ, বাতিল করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Device & Network Telemetry Modal */}
      {selectedDeviceModalUser && (
        <UserDeviceDetailsModal
          user={selectedDeviceModalUser}
          onClose={() => setSelectedDeviceModalUser(null)}
          onToggleBan={() => {
            handleToggleUserBanInternal(selectedDeviceModalUser.id || selectedDeviceModalUser.phone);
            setSelectedDeviceModalUser(null);
          }}
        />
      )}
    </main>
        </div>

        {/* Mobile Bottom Navigation Bar (মোবাইল ভার্সনে কুইক নেভিগেশন) */}
        {adminViewMode === 'mobile' && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0724]/95 backdrop-blur-md border-t-2 border-purple-800/80 px-2 py-1.5 shadow-2xl flex items-center justify-around select-none">
            <button
              type="button"
              onClick={() => handleSelectTab('overview')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-amber-400 font-black'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">ড্যাশবোর্ড</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('deposits')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl relative transition cursor-pointer ${
                activeTab === 'deposits'
                  ? 'text-emerald-400 font-black'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">ডিপোজিট</span>
              {pendingDeposits.length > 0 && (
                <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] animate-pulse">
                  {pendingDeposits.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('withdrawals')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl relative transition cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'text-rose-400 font-black'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">উইথড্র</span>
              {pendingWithdrawals.length > 0 && (
                <span className="absolute -top-1 right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[9px] animate-pulse">
                  {pendingWithdrawals.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('users')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
                activeTab === 'users'
                  ? 'text-purple-300 font-black'
                  : 'text-purple-300/80 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">ইউজার্স</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpenOnMobile(true)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black transition active:scale-95 shadow-md cursor-pointer hover:brightness-110"
            >
              <Menu className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[10px] mt-0.5">মেনু</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};
