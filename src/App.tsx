import React, { useState } from 'react';
import {
  Bell,
  Megaphone,
  X,
  ArrowRight,
  Sparkles,
  Wrench,
  Trophy,
  AlertTriangle,
  Gift,
} from 'lucide-react';
import {
  ScreenType,
  UserProfile,
  Transaction,
  Room,
  MatchHistoryItem,
  LeaderboardUser,
  GameResult,
  PaymentMethod,
  Player,
  AppSettings,
  BroadcastNotification,
  LiveChatMessage,
  isAdminUser,
  RegionCode,
  REGIONS,
  UserInboxMessage,
  DEFAULT_HOME_GAME_OPTIONS,
} from './types';
import {
  initialUserProfile,
  initialTransactions,
  initialRooms,
  initialMatchHistory,
  leaderboardWeekly,
} from './data/mockData';
import { calculatePlayerLevel } from './utils/playerLevel';
import { sounds } from './utils/soundEffects';
import { getLiveChatAutoReply, cleanChatText } from './utils/chatAutoReply';
import { DEFAULT_PAYMENT_LOGOS } from './utils/paymentLogos';

import { ScreenInspectorBar } from './components/Navigation/ScreenInspectorBar';
import { TopHeader } from './components/Navigation/TopHeader';
import { BottomNav } from './components/Navigation/BottomNav';

import { SplashScreen } from './components/Screens/SplashScreen';
import { LoginScreen } from './components/Screens/LoginScreen';
import { HomeScreen } from './components/Screens/HomeScreen';
import { WalletScreen } from './components/Screens/WalletScreen';
import { AddMoneyScreen } from './components/Screens/AddMoneyScreen';
import { WithdrawScreen } from './components/Screens/WithdrawScreen';
import { CreateMatchScreen } from './components/Screens/CreateMatchScreen';
import { JoinMatchScreen } from './components/Screens/JoinMatchScreen';
import { MatchmakingScreen } from './components/Screens/MatchmakingScreen';
import { LudoGameScreen } from './components/Screens/LudoGameScreen';
import { ResultScreen } from './components/Screens/ResultScreen';
import { MatchHistoryScreen } from './components/Screens/MatchHistoryScreen';
import { LeaderboardScreen } from './components/Screens/LeaderboardScreen';
import { ProfileScreen } from './components/Screens/ProfileScreen';
import { SupportScreen } from './components/Screens/SupportScreen';
import { ActivityScreen } from './components/Screens/ActivityScreen';
import { FavouriteScreen } from './components/Screens/FavouriteScreen';
import { AdminPanelScreen } from './components/Screens/AdminPanelScreen';
import { ReferEarnModal } from './components/Modals/ReferEarnModal';
import { LuckySpinnerWheelModal } from './components/Modals/LuckySpinnerWheelModal';
import { BannedUserModal } from './components/Modals/BannedUserModal';
import { UserInboxModal } from './components/Modals/UserInboxModal';
import { SpinRewardCelebrationData } from './components/HomeScreen/SpinRewardCelebrationOverlay';
import { SideMenuDrawer } from './components/Navigation/SideMenuDrawer';
import { getClientDeviceInfo, generateUserDeviceInfo } from './utils/deviceTracker';
import {
  clearAllApplicationStorage,
  getCleanAdminUser,
} from './utils/clearAllData';
import { generateRandomPlayer } from './utils/playerNames';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const savedUserStr = localStorage.getItem('kingludo_current_user');
      if (savedUserStr) {
        const saved = JSON.parse(savedUserStr);
        if (saved && saved.isLoggedIn) {
          if (saved.id === '01910204477' || saved.phone === '01910204477') {
            return 'admin_panel';
          }
        }
      }
    } catch {}
    return 'home';
  });

  // Selected Region State (BN: Bangladesh, EN: Global, IN: India, NP: Nepal)
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(() => {
    try {
      const saved = localStorage.getItem('kingludo_selected_region');
      if (saved && REGIONS[saved as RegionCode]) return saved as RegionCode;
    } catch (e) {
      console.error(e);
    }
    return 'BN';
  });

  const handleSelectRegion = (region: RegionCode) => {
    setSelectedRegion(region);
    try {
      localStorage.setItem('kingludo_selected_region', region);
    } catch (e) {
      console.error(e);
    }
  };

  // Registered users persistence
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    let list: UserProfile[] = [];
    try {
      const saved = localStorage.getItem('kingludo_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // Deduplicate list by unique identifier
    const seen = new Set<string>();
    list = list.filter((u) => {
      const key = u.id || u.phone;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Ensure Master Admin (01910204477, Shahid786567) is properly configured
    const adminIndex = list.findIndex(
      (u) =>
        u.phone === '01910204477' ||
        u.id === '01910204477' ||
        u.phone === '01700000000' ||
        u.id === 'admin'
    );
    if (adminIndex >= 0) {
      list[adminIndex] = {
        ...list[adminIndex],
        id: '01910204477',
        phone: '01910204477',
        password: 'Shahid786567',
        name: list[adminIndex].name || 'Super Admin',
        role: 'admin',
        deviceInfo: list[adminIndex].deviceInfo || getClientDeviceInfo(),
      };
    } else {
      list.unshift(getCleanAdminUser());
    }

    // Attach device telemetry to all registered users
    return list.map((u, idx) => ({
      ...u,
      deviceInfo: u.deviceInfo || generateUserDeviceInfo(u.phone || u.id, idx),
    }));
  });

  // Modal state for banned user notification
  const [showBannedModal, setShowBannedModal] = useState(false);

  // Current user state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('kingludo_current_user');
      const savedUsersStr = localStorage.getItem('kingludo_registered_users');
      let regList: UserProfile[] = [];
      if (savedUsersStr) {
        try {
          regList = JSON.parse(savedUsersStr);
        } catch {}
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isLoggedIn) {
          const matchedReg = regList.find(
            (u) => (parsed.id && u.id === parsed.id) || (parsed.phone && u.phone === parsed.phone)
          );
          const isBanned = Boolean(parsed.isBanned || matchedReg?.isBanned);

          if (parsed.id === '01910204477' || parsed.phone === '01910204477') {
            return {
              ...parsed,
              id: '01910204477',
              phone: '01910204477',
              password: 'Shahid786567',
              name: parsed.name || 'Super Admin',
              role: 'admin',
              isBanned: false,
              deviceInfo: parsed.deviceInfo || matchedReg?.deviceInfo || getClientDeviceInfo(),
            };
          }

          // Authoritative balance: respect active user's saved balance so withdraw deductions are not reverted
          const authoritativeBalance =
            typeof parsed.balance === 'number'
              ? parsed.balance
              : typeof matchedReg?.balance === 'number'
              ? matchedReg.balance
              : 0;

          return {
            ...(matchedReg || {}),
            ...parsed,
            balance: authoritativeBalance,
            totalWon: Math.max(matchedReg?.totalWon || 0, parsed.totalWon || 0),
            isBanned,
            deviceInfo: parsed.deviceInfo || matchedReg?.deviceInfo || getClientDeviceInfo(),
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      ...initialUserProfile,
      deviceInfo: getClientDeviceInfo(),
    };
  });

  // Save registered users list to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  // Synchronize active user's ban status whenever registeredUsers updates
  React.useEffect(() => {
    if (user.isLoggedIn) {
      const matched = registeredUsers.find(
        (u) => u.id === user.id || (u.phone && u.phone === user.phone)
      );
      if (matched && Boolean(matched.isBanned) !== Boolean(user.isBanned)) {
        setUser((prev) => ({ ...prev, isBanned: Boolean(matched.isBanned) }));
        if (matched.isBanned) {
          setShowBannedModal(true);
        }
      }
    }
  }, [registeredUsers, user.id, user.phone, user.isLoggedIn, user.isBanned]);

  // App Settings State for Admin Panel Control
  const initialAppSettings: AppSettings = {
    bkashNumber: '01700-112233',
    nagadNumber: '01800-445566',
    rocketNumber: '01900-778899-1',
    upayNumber: '01600-990011',
    minDeposit: 50,
    minWithdrawal: 100,
    minMatchFee: 10,
    platformCommissionPercent: 10,
    referralBonus: 100,
    marqueeNotice: '🔥 অফিশিয়াল লুডু কিং প্ল্যাটফর্মে স্বাগতম! বিকাশ ও নগদে ডিপোজিট করে ১v১ ও ৪v৪ লুডু খেলুন এবং সাথে সাথে উইথড্র করুন।',
    supportTelegram: 'https://t.me/kingludoofficial',
    supportWhatsApp: '+8801700000000',
    isMaintenanceMode: false,
    botDifficulty: 'Normal',
    companyWinRatePercent: 55,
    playerWinRatePercent: 45,

    // Local Payment Gateways Defaults (বিকাশ, নগদ, রকেট, উপায় অন/অফ)
    enableBkashDeposit: true,
    enableNagadDeposit: true,
    enableRocketDeposit: true,
    enableUpayDeposit: true,
    enableBkashWithdraw: true,
    enableNagadWithdraw: true,
    enableRocketWithdraw: true,
    enableUpayWithdraw: true,

    // Binance Pay & Crypto Settings
    binancePayId: '982736154',
    binancePayQrUrl: '',
    cryptoPayId: '784910265',
    cryptoUsdtTrc20Address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    cryptoUsdtBep20Address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    usdtExchangeRate: 125,
    enableBinancePay: true,
    enableCrypto: true,

    // Custom Payment Gateways Logos (এডমিন থেকে কনফিগারযোগ্য লোগো)
    paymentLogos: {
      ...DEFAULT_PAYMENT_LOGOS,
    },

    // Custom Payment Gateway Account Titles / Labels
    paymentAccountTitles: {
      bKash: 'Official bKash Personal/Agent Account',
      Nagad: 'Official Nagad Personal/Agent Account',
      Rocket: 'Official Rocket Personal/Agent Account',
      Upay: 'Official Upay Personal/Agent Account',
      BinancePay: 'Official Binance Pay ID',
      Cryptocurrency: 'Official USDT TRC20/BEP20 Address',
    },

    // Home Page Program Defaults
    homeGameOptions: DEFAULT_HOME_GAME_OPTIONS,
    showBanners: true,
    bannersList: [
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
    ],
    showMarqueeNotice: true,
    showQuickDepositWithdraw: true,
    showLiveChatBanner: true,
    showLiveChatFloating: true,
    liveChatTagline: 'যেকোনো সমস্যায় সরাসরি এজেন্টের সাথে কথা বলুন',
    enableLiveChatAutoReply: true,
    autoReplyDelayMs: 900,
    
    // Game Modes
    enable2PlayerMode: true,
    mode2PlayerSubtitle: 'Quick 1v1 Match',
    enable4PlayerMode: true,
    mode4PlayerSubtitle: 'Classic Battle',
    enablePrivateRoomMode: true,
    modePrivateSubtitle: 'Play with Friends',
    enableTournamentMode: true,
    modeTournamentSubtitle: 'Big Prize Pool',

    // Additional Sections
    showLatestWinnersTicker: true,
    winnersTickerTitle: 'সাম্প্রতিক বিজয়ী তালিকা',
    showReferEarnBanner: true,
    referBannerPromoText: 'বন্ধুদের ইনভাইট করে পেয়ে যান ৳১০০ বোনাস!',
    showDailyRewardCard: true,
    dailyRewardAmount: 25,

    // Deposit & Withdraw Notification & Audio Tone Settings
    enableTransactionAudioNotification: true,
    transactionSoundTone: 'cash_register',
    notificationVolume: 90,
    enableDepositNotificationSound: true,
    enableWithdrawNotificationSound: true,
  };

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('kingludo_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialAppSettings,
          ...parsed,
          homeGameOptions: parsed.homeGameOptions && parsed.homeGameOptions.length === 4 
            ? parsed.homeGameOptions 
            : DEFAULT_HOME_GAME_OPTIONS,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return initialAppSettings;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_app_settings', JSON.stringify(appSettings));
    } catch (e) {
      console.error(e);
    }
  }, [appSettings]);

  // Push / Broadcast Notifications State
  const [sentNotifications, setSentNotifications] = useState<BroadcastNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kingludo_push_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'notif_init_1',
        title: '🎉 কিং লুডু প্ল্যাটফর্মে স্বাগতম!',
        message: '১v১ ও ৪v৪ লুডু খেলায় অংশ নিন এবং বিকাশ/নগদে ১০০% নিরাপদ পেমেন্ট ও দ্রুত উইথড্র পান!',
        type: 'general',
        targetScreen: 'home',
        sentAt: '১২:৩০ PM',
        recipientCount: 15,
      },
    ];
  });

  const [activePushModal, setActivePushModal] = useState<BroadcastNotification | null>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_push_notifications', JSON.stringify(sentNotifications));
    } catch (e) {
      console.error(e);
    }
  }, [sentNotifications]);

  const handleSendBroadcastNotification = (notification: BroadcastNotification) => {
    setSentNotifications((prev) => [notification, ...prev]);
    setActivePushModal(notification);
    handleAddInboxMessage({
      type: 'system',
      title: `📢 ${notification.title}`,
      message: notification.message,
      status: 'Success',
      metadata: { method: 'System Broadcast' },
    });
  };

  const handleDeleteBroadcastNotification = (id: string) => {
    setSentNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Live Chat Messages (Two-Way Communication with Image/Logo upload support)
  const [liveChatMessages, setLiveChatMessages] = useState<LiveChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('kingludo_live_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((m) => ({
            ...m,
            text: cleanChatText(m.text),
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'msg_seed_1',
        senderRole: 'admin',
        userId: 'system_welcome',
        userName: 'KingLudo Support',
        text: 'আসসালামু আলাইকুম! কিং লুডো অফিসিয়াল লাইভ চ্যাটে স্বাগতম। আপনার যেকোনো প্রশ্ন বা সমস্যার কথা এখানে লিখতে পারেন। পেমেন্ট প্রুফ বা লোগোর ছবিও পাঠাতে পারেন।',
        time: '১২:০০ PM',
        timestamp: Date.now() - 3600000,
        isReadByUser: true,
        isReadByAdmin: true,
      },
      {
        id: 'msg_seed_2',
        senderRole: 'user',
        userId: 'usr_102044',
        userName: 'Rakib Hasan',
        userPhone: '01711223344',
        text: 'ভাই আমি ১০০০ টাকা ডিপোজিট করেছি বিকাশ দিয়ে, TrxID: BKASH99281। দয়া করে ব্যালেন্স যোগ করে দিন। স্ক্রিনশট ও লোগো সাথে দিলাম।',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        imageName: 'payment_screenshot.jpg',
        time: '১২:১৫ PM',
        timestamp: Date.now() - 1800000,
        isReadByUser: true,
        isReadByAdmin: false,
      },
      {
        id: 'msg_seed_3',
        senderRole: 'admin',
        userId: 'usr_102044',
        userName: 'KingLudo Support',
        text: 'ধন্যবাদ রাকিব ভাই! আপনার পেমেন্ট ভেরিফাই করা হয়েছে এবং ব্যালেন্স যোগ করা হয়েছে। হ্যাপি গেমিং!',
        time: '১২:১৭ PM',
        timestamp: Date.now() - 1600000,
        isReadByUser: true,
        isReadByAdmin: true,
      },
      {
        id: 'msg_seed_4',
        senderRole: 'user',
        userId: 'usr_559012',
        userName: 'Tanvir Ahmed',
        userPhone: '01899887766',
        text: 'ভাই আমার টুর্নামেন্ট উইথড্র নিয়ে একটু জানতে চাই। নতুন লোগো ডিজাইন পাঠালাম কেমন লাগছে বলবেন।',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        imageName: 'ludo_custom_logo.png',
        time: '১২:২৫ PM',
        timestamp: Date.now() - 600000,
        isReadByUser: true,
        isReadByAdmin: false,
      },
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_live_chat_messages', JSON.stringify(liveChatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [liveChatMessages]);

  const [isLiveChatTyping, setIsLiveChatTyping] = useState(false);

  // User sends a message (with optional image/logo) - triggers 24/7 intelligent auto-reply
  const handleSendUserLiveMessage = (text: string, imageUrl?: string, imageName?: string) => {
    const trimmedText = text.trim();
    if (!trimmedText && !imageUrl) return;

    const currentUserId = user.id || `usr_${Date.now()}`;
    const currentUserName = user.name || 'কাস্টমার';
    const currentUserPhone = user.phone || '01700000000';

    const newMsg: LiveChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderRole: 'user',
      userId: currentUserId,
      userName: currentUserName,
      userPhone: currentUserPhone,
      userAvatar: user.avatarUrl,
      text: trimmedText,
      imageUrl,
      imageName,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) || 'এখনই',
      timestamp: Date.now(),
      isReadByUser: true,
      isReadByAdmin: false,
    };

    setLiveChatMessages((prev) => [...prev, newMsg]);

    // Live Chat Auto-Reply: user ja likhbe tar oi reply ba answer auto dibe
    if (appSettings.enableLiveChatAutoReply !== false) {
      setIsLiveChatTyping(true);

      const delayMs = Math.max(appSettings.autoReplyDelayMs || 900, 600);

      setTimeout(async () => {
        try {
          const autoAnswer = await getLiveChatAutoReply({
            messageText: trimmedText,
            user,
            appSettings,
            imageUrl,
            imageName,
            recentMessages: liveChatMessages,
          });

          const autoReplyMsg: LiveChatMessage = {
            id: `chat_auto_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            senderRole: 'agent',
            userId: currentUserId,
            userName: 'KingLudo 24/7 AI Support',
            text: autoAnswer,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) || 'এখনই',
            timestamp: Date.now(),
            isReadByUser: true,
            isReadByAdmin: true,
          };

          setLiveChatMessages((prev) => [...prev, autoReplyMsg]);

          // Trigger sound if enabled
          try {
            if (appSettings.enableTransactionAudioNotification) {
              sounds.playNotification();
            }
          } catch {
            // ignore audio
          }
        } catch (err) {
          console.warn('Live chat auto-reply notice:', err);
        } finally {
          setIsLiveChatTyping(false);
        }
      }, delayMs);
    }
  };

  // Admin replies to a user's thread
  const handleSendAdminLiveMessage = (targetUserId: string, text: string, imageUrl?: string, imageName?: string) => {
    const newMsg: LiveChatMessage = {
      id: `chat_admin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderRole: 'admin',
      userId: targetUserId,
      userName: 'KingLudo Admin',
      text: text.trim(),
      imageUrl,
      imageName,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) || 'এখনই',
      timestamp: Date.now(),
      isReadByUser: false,
      isReadByAdmin: true,
    };

    // Mark previous user messages in this thread as read by admin
    setLiveChatMessages((prev) =>
      prev
        .map((m) => (m.userId === targetUserId ? { ...m, isReadByAdmin: true } : m))
        .concat(newMsg)
    );
  };

  // Clear live chat thread for a user
  const handleClearLiveChatThread = (targetUserId: string) => {
    setLiveChatMessages((prev) => prev.filter((m) => m.userId !== targetUserId));
  };

  // Clear all live chat messages across all threads
  const handleClearAllLiveChat = () => {
    setLiveChatMessages([]);
    try {
      localStorage.removeItem('kingludo_live_chat_messages');
    } catch (e) {
      console.error(e);
    }
  };

  // Reset match history across the system
  const handleResetMatchHistory = () => {
    setMatchHistory([]);
    try {
      localStorage.removeItem('kingludo_match_history');
      if (user.id) {
        localStorage.removeItem(`kingludo_history_${user.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete a specific live chat message
  const handleDeleteLiveChatMessage = (messageId: string) => {
    setLiveChatMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // Mark all user's messages as read
  const handleMarkLiveChatAsRead = () => {
    setLiveChatMessages((prev) => {
      const hasUnread = prev.some((m) => m.userId === user.id && !m.isReadByUser);
      if (!hasUnread) return prev;
      return prev.map((m) => (m.userId === user.id ? { ...m, isReadByUser: true } : m));
    });
  };

  // Admin Handler: Update App Settings
  const handleUpdateAppSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
  };

  // Admin Handler: Update target user balance
  const handleUpdateUserBalance = (userId: string, newBalance: number) => {
    if (user.id === userId) {
      setUser((prev) => {
        const next = { ...prev, balance: newBalance };
        try {
          localStorage.setItem('kingludo_current_user', JSON.stringify(next));
          localStorage.setItem('kingludo_user_profile', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
    setRegisteredUsers((prev) => {
      const nextUsers = prev.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u));
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });
  };

  // Admin Handler: Update full user profile (with support for changing user ID)
  const handleSaveFullUser = (updatedUser: UserProfile, oldId?: string) => {
    const targetId = oldId || updatedUser.id;
    if (
      user.id === targetId ||
      user.id === updatedUser.id ||
      (user.phone && user.phone === updatedUser.phone)
    ) {
      setUser((prev) => {
        const next = { ...prev, ...updatedUser };
        try {
          localStorage.setItem('kingludo_current_user', JSON.stringify(next));
          localStorage.setItem('kingludo_user_profile', JSON.stringify(next));
        } catch {}
        return next;
      });
      if (updatedUser.isBanned) {
        setShowBannedModal(true);
      }
    }
    setRegisteredUsers((prev) => {
      const exists = prev.some(
        (u) => u.id === targetId || (u.phone && u.phone === updatedUser.phone)
      );
      let nextUsers: UserProfile[];
      if (exists) {
        nextUsers = prev.map((u) =>
          u.id === targetId || (u.phone && u.phone === updatedUser.phone)
            ? { ...u, ...updatedUser }
            : u
        );
      } else {
        nextUsers = [updatedUser, ...prev];
      }
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });
  };

  // Admin Handler: Toggle User Ban / Unban
  const handleToggleUserBan = (userIdOrPhone: string) => {
    let nextBannedState = false;
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userIdOrPhone || u.phone === userIdOrPhone) {
          nextBannedState = !u.isBanned;
          return { ...u, isBanned: nextBannedState };
        }
        return u;
      })
    );

    if (user.id === userIdOrPhone || user.phone === userIdOrPhone) {
      setUser((prev) => ({ ...prev, isBanned: nextBannedState }));
      if (nextBannedState) {
        setShowBannedModal(true);
      }
    }
  };

  // Admin Handler: Add new user manually
  const handleAddUser = (newUser: UserProfile) => {
    setRegisteredUsers((prev) => [newUser, ...prev]);
  };

  // Admin Handler: Delete user
  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('kingludo_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return initialTransactions;
  });

  // 1. Persist transactions to localStorage immediately whenever state changes
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  // 2. Real-time Deposit & Withdraw Sync across browser tabs & backend server
  React.useEffect(() => {
    // Seed existing transactions to server on mount so server has current records
    if (transactions.length > 0) {
      fetch('/api/transactions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      }).catch(() => {});
    }

    // A. BroadcastChannel for zero-latency instant cross-tab sync
    let syncChannel: BroadcastChannel | null = null;
    try {
      syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.onmessage = (event) => {
        const data = event.data;
        if (!data || !data.type) return;

        if (data.type === 'NEW_TRANSACTION' && data.transaction) {
          const newTrx: Transaction = data.transaction;
          setTransactions((prev) => {
            if (prev.some((t) => t.id === newTrx.id)) return prev;
            return [newTrx, ...prev];
          });

          // Play sound notification if Admin is on screen
          if (user.role === 'admin' || user.id === '01910204477') {
            try {
              sounds.playTransactionAlert(
                newTrx.type === 'withdraw' ? 'withdraw' : 'deposit',
                'cash_register',
                95
              );
            } catch {}
          }
        } else if (data.type === 'UPDATE_TRANSACTION' && data.trxId) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === data.trxId ? { ...t, ...data.updates } : t))
          );
        } else if (data.type === 'DELETE_TRANSACTION' && data.trxId) {
          setTransactions((prev) => prev.filter((t) => t.id !== data.trxId));
        } else if (data.type === 'TRANSACTION_STATUS' && data.trxId && data.status) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === data.trxId ? { ...t, status: data.status } : t))
          );
          const isTarget = Boolean(
            (data.targetUserId && (data.targetUserId === user.id || data.targetUserId === user.phone)) ||
            (data.targetUserPhone && (data.targetUserPhone === user.phone || data.targetUserPhone === user.id))
          );

          if (data.amount && isTarget) {
            if (data.status === 'Success' && data.trxType === 'deposit') {
              setUser((u) => {
                const nextBal = (u.balance || 0) + data.amount;
                const nextU = { ...u, balance: nextBal };
                try {
                  localStorage.setItem('kingludo_current_user', JSON.stringify(nextU));
                  localStorage.setItem('kingludo_user_profile', JSON.stringify(nextU));
                } catch {}
                return nextU;
              });
            } else if (data.status === 'Failed' && data.trxType === 'withdraw') {
              // Withdrawal rejected by Admin in another tab -> refund balance back!
              setUser((u) => {
                const nextBal = (u.balance || 0) + data.amount;
                const nextU = { ...u, balance: nextBal };
                try {
                  localStorage.setItem('kingludo_current_user', JSON.stringify(nextU));
                  localStorage.setItem('kingludo_user_profile', JSON.stringify(nextU));
                } catch {}
                return nextU;
              });
            }
          }
        }
      };
    } catch {}

    // B. Periodic Polling to backend /api/transactions to catch transactions from all users & devices
    const pollInterval = setInterval(() => {
      fetch('/api/transactions')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.transactions)) {
            setTransactions((prev) => {
              const currentIds = new Set(prev.map((t) => t.id));
              const missingFromLocal = data.transactions.filter(
                (srvTrx: Transaction) => !currentIds.has(srvTrx.id)
              );

              if (missingFromLocal.length > 0) {
                // If new transaction came in and user is admin, play alert!
                if (user.role === 'admin' || user.id === '01910204477') {
                  const hasNewPending = missingFromLocal.some((t: Transaction) => t.status === 'Pending');
                  if (hasNewPending) {
                    try {
                      sounds.playTransactionAlert('deposit', 'cash_register', 90);
                    } catch {}
                  }
                }
                return [...missingFromLocal, ...prev];
              }

              // Also check if statuses were updated on server
              let hasStatusChange = false;
              const serverMap = new Map(data.transactions.map((t: Transaction) => [t.id, t]));
              const updated = prev.map((localTrx) => {
                const srv = serverMap.get(localTrx.id) as Transaction | undefined;
                if (srv && srv.status !== localTrx.status) {
                  hasStatusChange = true;
                  return { ...localTrx, status: srv.status };
                }
                return localTrx;
              });

              return hasStatusChange ? updated : prev;
            });
          }
        })
        .catch(() => {});
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      try {
        syncChannel?.close();
      } catch {}
    };
  }, [user.id, user.role]);
  const [rooms] = useState<Room[]>(initialRooms);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kingludo_match_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load match history from localStorage', e);
    }
    return initialMatchHistory;
  });
  const [leaderboard] = useState<LeaderboardUser[]>(leaderboardWeekly);

  // User Message Box (ইনবক্স মেসেজ) State: Deposit, Withdraw, Bonus Notifications
  const [inboxMessages, setInboxMessages] = useState<UserInboxMessage[]>(() => {
    try {
      const saved = localStorage.getItem('kingludo_user_inbox_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load inbox messages from localStorage', e);
    }
    return [
      {
        id: 'msg_welcome_bonus',
        type: 'bonus',
        title: '🎉 কিং লুডুতে স্বাগতম বোনাস (+৳৫০)',
        message: 'কিং লুডু গেমিং প্ল্যাটফর্মে আপনাকে আন্তরিক স্বাগতম! প্রতিদিন ফ্রি লাকি স্পিন ও দৈনিক চেক-ইন বোনাস সংগ্রহ করুন।',
        amount: 50,
        status: 'Success',
        timestamp: Date.now() - 3600000 * 2,
        timeFormatted: 'আজ, ০১:১৫ PM',
        isRead: false,
        metadata: { bonusType: 'daily' },
      },
      {
        id: 'msg_info_deposit',
        type: 'deposit',
        title: '💰 ইনস্ট্যান্ট ডিপোজিট সিস্টেম',
        message: 'বিকাশ, নগদ, রকেট এবং ক্রিপ্টো (USDT) এর মাধ্যমে যেকোনো সময় সহজেই টাকা জমা দিন। অ্যাডমিন দ্রুত ভেরিফাই করে ব্যালেন্স যোগ করবেন।',
        status: 'Completed',
        timestamp: Date.now() - 3600000 * 4,
        timeFormatted: 'আজ, ১১:০০ AM',
        isRead: true,
      },
      {
        id: 'msg_info_withdraw',
        type: 'withdraw',
        title: '📤 ক্যাশআউট সুবিধা',
        message: 'লুডু ম্যাচ জিতে যেকোনো সময় বিকাশ বা নগদ অ্যাকাউন্টে উইথড্র রিকোয়েস্ট করুন।',
        status: 'Completed',
        timestamp: Date.now() - 3600000 * 6,
        timeFormatted: 'গতকাল, ০৯:৩০ PM',
        isRead: true,
      },
    ];
  });

  const [showInboxModal, setShowInboxModal] = useState<boolean>(false);

  // Persist inbox messages to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_user_inbox_messages', JSON.stringify(inboxMessages));
    } catch (e) {
      console.error('Failed to save inbox messages to localStorage', e);
    }
  }, [inboxMessages]);

  // Helper to add a message to user inbox
  const handleAddInboxMessage = (
    msg: Omit<UserInboxMessage, 'id' | 'timestamp' | 'timeFormatted' | 'isRead'>
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const newMsg: UserInboxMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      timeFormatted: `আজ, ${timeFormatted}`,
      isRead: false,
    };
    setInboxMessages((prev) => [newMsg, ...prev]);
  };

  const handleDeleteInboxMessage = (id: string) => {
    setInboxMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAllInboxMessages = () => {
    setInboxMessages([]);
  };

  const handleMarkInboxMessageAsRead = (id: string) => {
    setInboxMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const handleMarkAllInboxMessagesAsRead = () => {
    setInboxMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  // Admin Handler: Approve transaction (Deposit adds money, Withdrawal stays deducted)
  const handleApproveTransaction = (trxId: string) => {
    const targetTrx = transactions.find((t) => t.id === trxId);
    if (targetTrx && targetTrx.type === 'deposit' && targetTrx.status === 'Pending') {
      const isTargetUser = (u: UserProfile) =>
        Boolean(
          (targetTrx.userId && u.id === targetTrx.userId) ||
          (targetTrx.userPhone && u.phone === targetTrx.userPhone) ||
          (targetTrx.accountNumber && u.phone === targetTrx.accountNumber)
        );

      // 1. If currently logged in user is the target, credit their active session balance
      if (isTargetUser(user) || (!targetTrx.userId && !targetTrx.accountNumber)) {
        setUser((u) => {
          const nextBal = (u.balance || 0) + targetTrx.amount;
          const nextProfile = { ...u, balance: nextBal };
          try {
            localStorage.setItem('kingludo_current_user', JSON.stringify(nextProfile));
            localStorage.setItem('kingludo_user_profile', JSON.stringify(nextProfile));
          } catch {}
          return nextProfile;
        });
      }

      // 2. Credit the persistent user in registeredUsers and persist to storage immediately
      setRegisteredUsers((users) => {
        const nextUsers = users.map((u) =>
          isTargetUser(u)
            ? { ...u, balance: (u.balance || 0) + targetTrx.amount }
            : u
        );
        try {
          localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
        } catch {}
        return nextUsers;
      });

      // Notify User Message Box
      handleAddInboxMessage({
        type: 'deposit',
        title: `✅ ডিপোজিট অনুমোদিত হয়েছে! (+৳${targetTrx.amount.toLocaleString()})`,
        message: `আপনার ইউজার আইডিতে (User ID: ${targetTrx.userId || 'N/A'}) ৳${targetTrx.amount.toLocaleString()} ডিপোজিট এডমিন প্যানেল থেকে সফলভাবে অনুমোদিত হয়েছে এবং ওয়ালেটে যুক্ত হয়েছে (${targetTrx.paymentMethod || 'পেমেন্ট'})।`,
        amount: targetTrx.amount,
        status: 'Success',
        metadata: { trxId: targetTrx.id, method: targetTrx.paymentMethod, accountNumber: targetTrx.accountNumber, userId: targetTrx.userId },
      });
    } else if (targetTrx && targetTrx.type === 'withdraw' && targetTrx.status === 'Pending') {
      // Notify User Message Box
      handleAddInboxMessage({
        type: 'withdraw',
        title: `✅ উইথড্র সফল হয়েছে! (-৳${targetTrx.amount.toLocaleString()})`,
        message: `আপনার ৳${targetTrx.amount.toLocaleString()} উইথড্র রিকোয়েস্ট অনুমোদিত হয়েছে এবং ${targetTrx.paymentMethod || 'অ্যাকাউন্টে'} (${targetTrx.accountNumber || ''}) টাকা পাঠানো হয়েছে।`,
        amount: targetTrx.amount,
        status: 'Success',
        metadata: { trxId: targetTrx.id, method: targetTrx.paymentMethod, accountNumber: targetTrx.accountNumber, userId: targetTrx.userId },
      });
    }

    setTransactions((prev) =>
      prev.map((trx) => (trx.id === trxId ? { ...trx, status: 'Success' } : trx))
    );

    // Sync to backend server
    fetch(`/api/transactions/${trxId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Success' }),
    }).catch(console.error);

    // Broadcast update to all other open tabs/windows
    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({
        type: 'TRANSACTION_STATUS',
        trxId,
        status: 'Success',
        amount: targetTrx?.amount,
        targetUserId: targetTrx?.userId,
      });
      syncChannel.close();
    } catch {}
  };

  // Admin Handler: Reject transaction (Withdrawal refunds money back)
  const handleRejectTransaction = (trxId: string, customReason?: string) => {
    const targetTrx = transactions.find((t) => t.id === trxId);
    if (targetTrx && targetTrx.type === 'withdraw' && targetTrx.status === 'Pending') {
      const isTargetUser = (u: UserProfile) =>
        Boolean(
          (targetTrx.userId && u.id === targetTrx.userId) ||
          (targetTrx.userPhone && u.phone === targetTrx.userPhone) ||
          (targetTrx.accountNumber && u.phone === targetTrx.accountNumber)
        );

      if (isTargetUser(user) || (!targetTrx.userId && !targetTrx.accountNumber)) {
        setUser((u) => {
          const nextBal = (u.balance || 0) + targetTrx.amount;
          const nextProfile = { ...u, balance: nextBal };
          try {
            localStorage.setItem('kingludo_current_user', JSON.stringify(nextProfile));
            localStorage.setItem('kingludo_user_profile', JSON.stringify(nextProfile));
          } catch {}
          return nextProfile;
        });
      }
      setRegisteredUsers((users) => {
        const nextUsers = users.map((u) =>
          isTargetUser(u)
            ? { ...u, balance: (u.balance || 0) + targetTrx.amount }
            : u
        );
        try {
          localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
        } catch {}
        return nextUsers;
      });
      // Notify User Message Box about refund
      handleAddInboxMessage({
        type: 'withdraw',
        title: `🔄 উইথড্র বাতিল ও রিফান্ড (+৳${targetTrx.amount.toLocaleString()})`,
        message: customReason
          ? `আপনার ৳${targetTrx.amount.toLocaleString()} উইথড্র রিকোয়েস্ট বাতিল করা হয়েছে। কারণ: "${customReason}"। সম্পূর্ণ টাকা ওয়ালেটে রিফান্ড করা হয়েছে।`
          : `আপনার ৳${targetTrx.amount.toLocaleString()} উইথড্র রিকোয়েস্টটি বাতিল করা হয়েছে এবং পুরো টাকা আপনার ওয়ালেট ব্যালেন্সে ফেরত দেওয়া হয়েছে।`,
        amount: targetTrx.amount,
        status: 'Failed',
        metadata: { trxId: targetTrx.id, method: targetTrx.paymentMethod, accountNumber: targetTrx.accountNumber, userId: targetTrx.userId },
      });
    } else if (targetTrx && targetTrx.type === 'deposit' && targetTrx.status === 'Pending') {
      // Notify User Message Box about deposit rejection
      handleAddInboxMessage({
        type: 'deposit',
        title: `❌ ডিপোজিট বাতিল হয়েছে (৳${targetTrx.amount.toLocaleString()})`,
        message: customReason
          ? `আপনার ইউজার আইডি (ID: ${targetTrx.userId || 'N/A'}) এর ৳${targetTrx.amount.toLocaleString()} ডিপোজিট বাতিল করা হয়েছে। কারণ: "${customReason}"`
          : `আপনার ইউজার আইডি (ID: ${targetTrx.userId || 'N/A'}) এর ৳${targetTrx.amount.toLocaleString()} ডিপোজিট বাতিল করা হয়েছে। ভুল তথ্য বা ট্রানজেকশন আইডি দিলে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।`,
        amount: targetTrx.amount,
        status: 'Failed',
        metadata: { trxId: targetTrx.id, method: targetTrx.paymentMethod, accountNumber: targetTrx.accountNumber, userId: targetTrx.userId },
      });
    }

    setTransactions((prev) =>
      prev.map((trx) => (trx.id === trxId ? { ...trx, status: 'Failed' } : trx))
    );

    // Sync to backend server
    fetch(`/api/transactions/${trxId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Failed' }),
    }).catch(console.error);

    // Broadcast update to all other open tabs/windows
    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({
        type: 'TRANSACTION_STATUS',
        trxId,
        status: 'Failed',
        trxType: targetTrx?.type,
        amount: targetTrx?.amount,
        targetUserId: targetTrx?.userId,
        targetUserPhone: targetTrx?.userPhone || targetTrx?.accountNumber,
      });
      syncChannel.close();
    } catch {}
  };

  // Admin Handler: Edit transaction details
  const handleEditTransaction = (trxId: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((trx) => (trx.id === trxId ? { ...trx, ...updates } : trx))
    );

    fetch(`/api/transactions/${trxId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(console.error);

    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({ type: 'UPDATE_TRANSACTION', trxId, updates });
      syncChannel.close();
    } catch {}
  };

  // Admin Handler: Delete transaction record
  const handleDeleteTransaction = (trxId: string) => {
    setTransactions((prev) => prev.filter((trx) => trx.id !== trxId));

    fetch(`/api/transactions/${trxId}`, {
      method: 'DELETE',
    }).catch(console.error);

    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({ type: 'DELETE_TRANSACTION', trxId });
      syncChannel.close();
    } catch {}
  };

  // Admin Handler: Create direct manual transaction (Deposit credit or Withdraw deduction)
  const handleManualTransaction = (
    userId: string,
    type: 'deposit' | 'withdraw',
    amount: number,
    method: PaymentMethod,
    note?: string
  ) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetUser = registeredUsers.find((u) => u.id === userId || u.phone === userId);
    const targetPhone = targetUser?.phone || userId;
    const targetName = targetUser?.name || 'Player';

    const newTrx: Transaction = {
      id: `trx_adm_${Date.now()}`,
      type,
      title: type === 'deposit' ? 'অ্যাডমিন ম্যানুয়াল ডিপোজিট' : 'অ্যাডমিন ম্যানুয়াল কর্তন (উইথড্র)',
      amount,
      date: 'Today',
      time: formattedTime,
      status: 'Success',
      paymentMethod: method,
      accountNumber: targetPhone,
      trxId: note || `ADM_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      userId,
      userName: targetName,
      userPhone: targetPhone,
    };

    // Update balance
    if (user.id === userId || (user.phone && user.phone === userId)) {
      setUser((prev) => {
        const nextBal = type === 'deposit' ? (prev.balance || 0) + amount : Math.max(0, (prev.balance || 0) - amount);
        const next = { ...prev, balance: nextBal };
        try {
          localStorage.setItem('kingludo_current_user', JSON.stringify(next));
          localStorage.setItem('kingludo_user_profile', JSON.stringify(next));
        } catch {}
        return next;
      });
    }

    setRegisteredUsers((prev) => {
      const nextUsers = prev.map((u) => {
        if (u.id === userId || u.phone === userId) {
          const newBal = type === 'deposit' ? (u.balance || 0) + amount : Math.max(0, (u.balance || 0) - amount);
          return { ...u, balance: newBal };
        }
        return u;
      });
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });

    setTransactions((prev) => [newTrx, ...prev]);

    // Send to backend
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrx),
    }).catch(console.error);

    // Broadcast
    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({ type: 'NEW_TRANSACTION', transaction: newTrx });
      syncChannel.close();
    } catch {}

    // Notify User Inbox
    handleAddInboxMessage({
      type: type === 'deposit' ? 'deposit' : 'withdraw',
      title: type === 'deposit' ? `💰 ব্যালেন্স যোগ হয়েছে (+৳${amount.toLocaleString()})` : `📤 ব্যালেন্স কর্তন (-৳${amount.toLocaleString()})`,
      message: `অ্যাডমিন প্যানেল থেকে আপনার অ্যাকাউন্টে (ID: ${userId}) ৳${amount.toLocaleString()} ${type === 'deposit' ? 'ডিপোজিট যুক্ত' : 'কর্তন'} করা হয়েছে (${method})। নোট: ${note || 'অফিশিয়াল অ্যাডমিন লেনদেন'}`,
      amount,
      status: 'Success',
      metadata: { trxId: newTrx.trxId, method, userId },
    });
  };

  // Admin Handler: Bulk Approve Transactions
  const handleBulkApproveTransactions = (trxIds: string[]) => {
    if (!trxIds || trxIds.length === 0) return;
    const idsSet = new Set(trxIds);

    setTransactions((prev) => {
      let balanceAddedToCurrent = 0;
      const balanceAddedByUserId: Record<string, number> = {};
      const balanceAddedByPhone: Record<string, number> = {};

      const next = prev.map((trx) => {
        if (idsSet.has(trx.id) && trx.status === 'Pending') {
          if (trx.type === 'deposit') {
            const isTarget =
              (trx.userId && user.id === trx.userId) ||
              (trx.userPhone && user.phone === trx.userPhone) ||
              (trx.accountNumber && user.phone === trx.accountNumber) ||
              (!trx.userId && !trx.accountNumber);

            if (isTarget) {
              balanceAddedToCurrent += trx.amount;
            }
            if (trx.userId) {
              balanceAddedByUserId[trx.userId] = (balanceAddedByUserId[trx.userId] || 0) + trx.amount;
            } else if (trx.accountNumber) {
              balanceAddedByPhone[trx.accountNumber] = (balanceAddedByPhone[trx.accountNumber] || 0) + trx.amount;
            }
            handleAddInboxMessage({
              type: 'deposit',
              title: `✅ ডিপোজিট অনুমোদিত হয়েছে! (+৳${trx.amount.toLocaleString()})`,
              message: `আপনার ইউজার আইডিতে (ID: ${trx.userId || 'N/A'}) ৳${trx.amount.toLocaleString()} ডিপোজিট অনুমোদিত হয়েছে এবং ওয়ালেটে যুক্ত হয়েছে।`,
              amount: trx.amount,
              status: 'Success',
              metadata: { trxId: trx.id, method: trx.paymentMethod, userId: trx.userId },
            });
          } else if (trx.type === 'withdraw') {
            handleAddInboxMessage({
              type: 'withdraw',
              title: `✅ উইথড্র সফল হয়েছে! (-৳${trx.amount.toLocaleString()})`,
              message: `আপনার ৳${trx.amount.toLocaleString()} উইথড্র ক্যাশআউট সম্পন্ন হয়েছে।`,
              amount: trx.amount,
              status: 'Success',
              metadata: { trxId: trx.id, method: trx.paymentMethod, userId: trx.userId },
            });
          }
          return { ...trx, status: 'Success' as const };
        }
        return trx;
      });

      if (balanceAddedToCurrent > 0) {
        setUser((u) => ({ ...u, balance: (u.balance || 0) + balanceAddedToCurrent }));
      }
      if (Object.keys(balanceAddedByUserId).length > 0 || Object.keys(balanceAddedByPhone).length > 0) {
        setRegisteredUsers((users) =>
          users.map((u) => {
            const byUid = balanceAddedByUserId[u.id] || 0;
            const byPhone = balanceAddedByPhone[u.phone || ''] || 0;
            const total = byUid + byPhone;
            return total > 0 ? { ...u, balance: (u.balance || 0) + total } : u;
          })
        );
      }

      return next;
    });
  };

  // Admin Handler: Bulk Reject Transactions
  const handleBulkRejectTransactions = (trxIds: string[]) => {
    if (!trxIds || trxIds.length === 0) return;
    const idsSet = new Set(trxIds);

    setTransactions((prev) => {
      let balanceRefundedToCurrent = 0;
      const balanceRefundedByUserId: Record<string, number> = {};
      const balanceRefundedByPhone: Record<string, number> = {};

      const next = prev.map((trx) => {
        if (idsSet.has(trx.id) && trx.status === 'Pending') {
          if (trx.type === 'withdraw') {
            const isTarget =
              (trx.userId && user.id === trx.userId) ||
              (trx.userPhone && user.phone === trx.userPhone) ||
              (trx.accountNumber && user.phone === trx.accountNumber) ||
              (!trx.userId && !trx.accountNumber);

            if (isTarget) {
              balanceRefundedToCurrent += trx.amount;
            }
            if (trx.userId) {
              balanceRefundedByUserId[trx.userId] = (balanceRefundedByUserId[trx.userId] || 0) + trx.amount;
            } else if (trx.accountNumber) {
              balanceRefundedByPhone[trx.accountNumber] = (balanceRefundedByPhone[trx.accountNumber] || 0) + trx.amount;
            }
            handleAddInboxMessage({
              type: 'withdraw',
              title: `🔄 উইথড্র বাতিল ও রিফান্ড (+৳${trx.amount.toLocaleString()})`,
              message: `আপনার ৳${trx.amount.toLocaleString()} উইথড্র বাতিল ও ব্যালেন্স রিফান্ড করা হয়েছে।`,
              amount: trx.amount,
              status: 'Failed',
              metadata: { trxId: trx.id, method: trx.paymentMethod, userId: trx.userId },
            });
          } else if (trx.type === 'deposit') {
            handleAddInboxMessage({
              type: 'deposit',
              title: `❌ ডিপোজিট বাতিল হয়েছে (৳${trx.amount.toLocaleString()})`,
              message: `আপনার ৳${trx.amount.toLocaleString()} ডিপোজিট রিকোয়েস্ট এডমিন বাতিল করেছেন।`,
              amount: trx.amount,
              status: 'Failed',
              metadata: { trxId: trx.id, method: trx.paymentMethod, userId: trx.userId },
            });
          }
          return { ...trx, status: 'Failed' as const };
        }
        return trx;
      });

      if (balanceRefundedToCurrent > 0) {
        setUser((u) => ({ ...u, balance: (u.balance || 0) + balanceRefundedToCurrent }));
      }
      if (Object.keys(balanceRefundedByUserId).length > 0 || Object.keys(balanceRefundedByPhone).length > 0) {
        setRegisteredUsers((users) =>
          users.map((u) => {
            const byUid = balanceRefundedByUserId[u.id] || 0;
            const byPhone = balanceRefundedByPhone[u.phone || ''] || 0;
            const total = byUid + byPhone;
            return total > 0 ? { ...u, balance: (u.balance || 0) + total } : u;
          })
        );
      }

      return next;
    });
  };

  // Save current user session & update user entry in registeredUsers list
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_current_user', JSON.stringify(user));
      localStorage.setItem('kingludo_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    if (user.isLoggedIn && (user.phone || user.id)) {
      const cleanPhone = user.phone ? user.phone.replace(/\D/g, '') : '';
      setRegisteredUsers((prev) => {
        const idx = prev.findIndex((u) => {
          if (user.id && u.id === user.id) return true;
          if (cleanPhone.length >= 6 && u.phone && u.phone.replace(/\D/g, '') === cleanPhone) return true;
          if (user.phone && u.phone === user.phone) return true;
          return false;
        });
        if (idx >= 0) {
          const currentRecord = prev[idx];
          // Protect balance: if registered record has a higher balance (e.g. from an approved deposit or admin credit),
          // never downgrade it!
          const targetBalance =
            typeof currentRecord.balance === 'number' && currentRecord.balance > (user.balance || 0)
              ? currentRecord.balance
              : (user.balance || 0);

          if (targetBalance > (user.balance || 0)) {
            // Sync active user session with approved higher balance
            setTimeout(() => {
              setUser((u) => ({ ...u, balance: targetBalance }));
            }, 0);
          }

          const mergedUser: UserProfile = {
            ...currentRecord,
            ...user,
            balance: targetBalance,
          };

          if (JSON.stringify(prev[idx]) === JSON.stringify(mergedUser)) return prev;
          const updated = [...prev];
          updated[idx] = mergedUser;
          return updated;
        }
        return [...prev, user];
      });
    }
  }, [user]);

  // Dedicated Admin Screen Guard: ensure 01910204477 stays strictly on admin panel
  React.useEffect(() => {
    if (user.isLoggedIn && (user.id === '01910204477' || user.phone === '01910204477')) {
      if (currentScreen !== 'admin_panel' && currentScreen !== 'login') {
        setCurrentScreen('admin_panel');
      }
    }
  }, [user.isLoggedIn, user.id, user.phone, currentScreen]);

  // Load and save user-specific transactions and match history
  // Persist all transactions globally so deposits & approvals are saved across users & sessions
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to persist transactions', e);
    }
  }, [transactions]);

  // Persist match history globally
  React.useEffect(() => {
    try {
      localStorage.setItem('kingludo_match_history', JSON.stringify(matchHistory));
    } catch (e) {
      console.error('Failed to persist match history', e);
    }
  }, [matchHistory]);

  const [activeRoomCode, setActiveRoomCode] = useState<string>('LUDO123');
  const [entryFee, setEntryFee] = useState<number>(0);
  const [isCurrentMatchFeePaid, setIsCurrentMatchFeePaid] = useState<boolean>(false);
  const [totalPrize, setTotalPrize] = useState<number>(100);
  const [activePlayersCount, setActivePlayersCount] = useState<2 | 3 | 4>(2);
  const [activeGameMode, setActiveGameMode] = useState<'vs_ai' | 'pass_n_play' | 'ai_vs_ai'>('pass_n_play');
  const [activeAiDifficulty, setActiveAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [activeGameType, setActiveGameType] = useState<'Classic' | 'Quick'>('Classic');

  const [gameResult, setGameResult] = useState<GameResult | null>({
    winner: { id: user.id, name: user.name, avatarUrl: user.avatarUrl, color: 'green' },
    totalPrize: 200,
    platformFee: 40,
    netPrize: 160,
    isUserWinner: true,
  });

  const [showReferModal, setShowReferModal] = useState(false);
  const [showLuckySpinnerModal, setShowLuckySpinnerModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinCelebrationData, setSpinCelebrationData] = useState<SpinRewardCelebrationData | null>(null);

  // Lucky Spinner claim reward / fee handler
  const handleClaimSpinReward = (amount: number, rewardTitle: string) => {
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }
    if (amount === 0) return;

    const prevBal = user.balance;
    const nextBalance = Math.max(0, Math.round((prevBal + amount) * 100) / 100);
    const nextTotalWon = amount > 0 ? Math.round((user.totalWon + amount) * 100) / 100 : user.totalWon;
    const updated: UserProfile = {
      ...user,
      balance: nextBalance,
      totalWon: nextTotalWon,
    };

    // Update state cleanly
    setUser(updated);

    try {
      const savedUsersStr = localStorage.getItem('kingludo_registered_users');
      if (savedUsersStr) {
        const regUsers: UserProfile[] = JSON.parse(savedUsersStr);
        const updatedUsers = regUsers.map((u) =>
          u.id === user.id || u.phone === user.phone ? updated : u
        );
        localStorage.setItem('kingludo_registered_users', JSON.stringify(updatedUsers));
      }
      localStorage.setItem('kingludo_user_profile', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving updated balance from spin:', e);
    }

    // Trigger Home Screen visual celebration animation when winning a prize
    if (amount > 0) {
      setSpinCelebrationData({
        amount,
        title: rewardTitle,
        previousBalance: prevBal,
        newBalance: nextBalance,
        timestamp: Date.now(),
      });
    }

    const spinTrx: Transaction = {
      id: `trx_spin_${Date.now()}`,
      type: amount > 0 ? 'deposit' : 'withdraw',
      title: rewardTitle,
      amount: Math.abs(amount),
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      accountNumber: user.phone || 'Spin Reward',
    };
    setTransactions((prev) => [spinTrx, ...prev]);

    // Send notification to User Message Box
    if (amount > 0) {
      handleAddInboxMessage({
        type: 'bonus',
        title: `🎡 লাকি স্পিন বোনাস (+৳${amount.toLocaleString()})`,
        message: `অভিনন্দন! আপনি লাকি স্পিন থেকে "${rewardTitle}" জিতেছেন। ৳${amount.toLocaleString()} আপনার ওয়ালেটে জমা হয়েছে!`,
        amount,
        status: 'Success',
        metadata: { bonusType: 'spin' },
      });
    }

    if (soundEnabled && amount > 0) {
      try {
        sounds.playSuccessFanfare(0.85);
      } catch {
        sounds.playWinSound();
      }
    }
  };

  // Daily Check-in claim reward handler (প্রতি ২৪ ঘণ্টায় একবার বোনাস ব্যালেন্স)
  const handleClaimDailyReward = (amount: number, streakDay: number) => {
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }
    if (amount <= 0) return;

    const prevBal = user.balance;
    const nextBalance = Math.max(0, Math.round((prevBal + amount) * 100) / 100);
    const nextTotalWon = Math.round((user.totalWon + amount) * 100) / 100;
    const now = Date.now();

    const updated: UserProfile = {
      ...user,
      balance: nextBalance,
      totalWon: nextTotalWon,
      lastCheckInTimestamp: now,
      checkInStreak: streakDay,
    };

    setUser(updated);

    try {
      const savedUsersStr = localStorage.getItem('kingludo_registered_users');
      if (savedUsersStr) {
        const regUsers: UserProfile[] = JSON.parse(savedUsersStr);
        const updatedUsers = regUsers.map((u) =>
          u.id === user.id || u.phone === user.phone ? updated : u
        );
        localStorage.setItem('kingludo_registered_users', JSON.stringify(updatedUsers));
      }
      localStorage.setItem('kingludo_user_profile', JSON.stringify(updated));
      localStorage.setItem(`kingludo_daily_checkin_${user.id || user.phone}`, JSON.stringify({
        lastTimestamp: now,
        streak: streakDay,
      }));
    } catch (e) {
      console.error('Error saving updated balance from daily check-in:', e);
    }

    const checkInTrx: Transaction = {
      id: `trx_checkin_${Date.now()}`,
      type: 'daily_reward',
      title: `দৈনিক চেক-ইন বোনাস (দিন ${streakDay})`,
      amount: amount,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      accountNumber: user.phone || 'Daily Bonus',
    };
    setTransactions((prev) => [checkInTrx, ...prev]);

    // Send notification to User Message Box
    handleAddInboxMessage({
      type: 'bonus',
      title: `🎁 দৈনিক চেক-ইন বোনাস (+৳${amount.toLocaleString()})`,
      message: `দিন ${streakDay} এর দৈনিক বোনাস ৳${amount.toLocaleString()} সফলভাবে কালেক্ট করেছেন! নিয়মিত প্রতিদিন লগইন করুন।`,
      amount,
      status: 'Success',
      metadata: { bonusType: 'daily' },
    });

    if (soundEnabled) {
      try {
        sounds.playSuccessFanfare(0.85);
      } catch {
        sounds.playCoinDrop();
      }
    }
  };

  // Player configurations
  const userPlayer: Player = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    color: 'green',
  };

  // Dynamic opponentPlayer state randomized each match
  const [opponentPlayer, setOpponentPlayer] = useState<Player>(() => {
    const rnd = generateRandomPlayer('opp_main');
    return {
      id: rnd.id,
      name: rnd.name,
      avatarUrl: rnd.avatarUrl,
      color: 'red',
      isBot: true,
    };
  });

  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [loginNoticeMessage, setLoginNoticeMessage] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState(false);
  const [balanceErrorDetails, setBalanceErrorDetails] = useState<{ required: number; current: number }>({
    required: 100,
    current: 0,
  });

  const handleSelectAuthMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    handleNavigate('login');
  };

  // Navigation handler (Strict Access Control: Only home is public without ID login)
  const handleNavigate = (screen: ScreenType) => {
    setShowLoginNotice(false);

    // Dedicated Master Admin constraint: "A user id diye login korle sudhu admin panel dekhabe"
    if (user.isLoggedIn && (user.id === '01910204477' || user.phone === '01910204477')) {
      if (screen === 'home' || screen === 'login') {
        // Leaving/exiting the admin panel signs the admin out cleanly back to login screen
        handleLogout();
        return;
      }
      if (screen !== 'admin_panel') {
        setCurrentScreen('admin_panel');
        return;
      }
    }

    // Public screens allowed without login
    if (screen === 'home' || screen === 'login' || screen === 'splash') {
      setCurrentScreen(screen);
      return;
    }

    // STRICT ACCESS CONTROL:
    // Without ID login, user CANNOT enter any option other than the home page!
    if (!user.isLoggedIn) {
      setShowLoginNotice(true);
      setLoginNoticeMessage(
        'আইডি লগইন ছাড়া হোম পেজ ব্যতীত অন্য কোনো অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে আপনার আইডি দিয়ে লগইন বা রেজিস্টার করুন।'
      );
      setAuthMode('login');
      setCurrentScreen('login');
      return;
    }

    if (screen === 'admin_panel' && !isAdminUser(user)) {
      setCurrentScreen('home');
      return;
    }

    // Enforce Ban Restriction: Banned users cannot play games, create matches, or access financial features
    if (user.isLoggedIn && user.isBanned) {
      const bannedBlockedScreens: ScreenType[] = [
        'create_match',
        'join_match',
        'matchmaking',
        'gameplay',
        'result',
        'wallet',
        'add_money',
        'withdraw',
        'match_history',
        'match_replay',
        'leaderboard',
      ];

      if (bannedBlockedScreens.includes(screen)) {
        setShowBannedModal(true);
        return;
      }
    }

    setCurrentScreen(screen);
  };

  // Register New Account (Strictly 0 Tk Balance)
  const handleRegisterSuccess = (name: string, phone: string, referralCode?: string, password?: string) => {
    const newUserId = `usr_${Math.floor(100000 + Math.random() * 900000)}`;
    const newProfile: UserProfile = {
      id: newUserId,
      name: name || 'New Player',
      phone: phone || '01700000000',
      password: password || '123456',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      balance: 0, // Fresh 0 Tk Balance for new accounts
      referralCode: referralCode || `LUDO${Math.floor(1000 + Math.random() * 9000)}`,
      totalWon: 0,
      totalMatches: 0,
      winRate: 0,
      isLoggedIn: true,
      isBanned: false,
    };

    setUser(newProfile);
    setRegisteredUsers((prev) => [...prev, newProfile]);
    setTransactions([]);
    setMatchHistory([]);
    setShowLoginNotice(false);
    setCurrentScreen('home');
  };

  // Login Existing Account (Restores user profile & balance and respects ban status)
  const handleLoginSuccess = (userProfile: UserProfile) => {
    const isMasterAdmin =
      userProfile.id === '01910204477' ||
      userProfile.phone === '01910204477' ||
      userProfile.role === 'admin' ||
      isAdminUser(userProfile);

    const registeredMatch = registeredUsers.find(
      (u) => (userProfile.id && u.id === userProfile.id) || (userProfile.phone && u.phone === userProfile.phone)
    );
    const isBanned = Boolean(userProfile.isBanned || registeredMatch?.isBanned);

    const loggedUser: UserProfile = {
      ...userProfile,
      ...(registeredMatch || {}),
      isBanned: isMasterAdmin ? false : isBanned,
      isLoggedIn: true,
      role: isMasterAdmin ? 'admin' : (userProfile.role || registeredMatch?.role || 'user'),
    };

    setUser(loggedUser);
    try {
      localStorage.setItem('kingludo_current_user', JSON.stringify(loggedUser));
      localStorage.setItem('kingludo_user_profile', JSON.stringify(loggedUser));
    } catch {}

    setShowLoginNotice(false);

    if (isBanned && !isMasterAdmin) {
      setShowBannedModal(true);
    }

    // "A user id diye login korle sudhu admin panel dekhabe"
    if (isMasterAdmin || userProfile.id === '01910204477' || userProfile.phone === '01910204477') {
      setCurrentScreen('admin_panel');
    } else {
      setCurrentScreen('home');
    }
  };

  // Logout & Clear Data
  const handleLogout = () => {
    setUser({
      ...initialUserProfile,
      id: `user_${Date.now().toString().slice(-6)}`,
      name: '',
      phone: '',
      balance: 0,
      isLoggedIn: false,
    });
    setTransactions([]);
    setMatchHistory([]);
    setShowLoginNotice(false);
    setCurrentScreen('login');
  };

  // Completely Clear All Application Data (Factory Reset)
  const handleClearAllData = () => {
    clearAllApplicationStorage();
    const cleanAdmin = getCleanAdminUser();
    setRegisteredUsers([cleanAdmin]);
    setUser({
      ...initialUserProfile,
      deviceInfo: getClientDeviceInfo(),
    });
    setTransactions([]);
    setMatchHistory([]);
    setLiveChatMessages([]);
    setInboxMessages([]);
    setSentNotifications([]);
    setShowLoginNotice(false);
    setCurrentScreen('login');
    alert('অ্যাপের সমস্ত ডেটা (ইউজার, ট্রানজাকশন, হিস্ট্রি, লাইভ চ্যাট) সফলভাবে সম্পূর্ণ মুছে ফেলা হয়েছে!');
  };

  // Add deposit money (Requires Admin Panel approval before balance is added)
  const handleAddMoneySuccess = (
    amount: number,
    method: PaymentMethod,
    senderPhone: string,
    trxId: string,
    cryptoDetails?: { cryptoAmount?: number; cryptoNetwork?: string },
    depositUserId?: string
  ) => {
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetUserId = depositUserId || user.id;
    const newTrx: Transaction = {
      id: `trx_${Date.now()}`,
      type: 'deposit',
      title: method === 'BinancePay' ? 'Binance Pay Deposit' : method === 'Cryptocurrency' ? 'Crypto USDT Deposit' : 'Add Money Deposit',
      amount,
      date: 'Today',
      time: formattedTime,
      status: 'Pending',
      paymentMethod: method,
      accountNumber: senderPhone,
      trxId,
      userId: targetUserId,
      userName: user.name || 'Player',
      userPhone: user.phone || senderPhone,
      cryptoAmount: cryptoDetails?.cryptoAmount,
      cryptoNetwork: cryptoDetails?.cryptoNetwork,
    };
    setTransactions((prev) => [newTrx, ...prev]);

    // Send deposit to backend server for real-time admin sync
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrx),
    }).catch(console.error);

    // Broadcast to other tabs so admin panel receives it immediately
    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({ type: 'NEW_TRANSACTION', transaction: newTrx });
      syncChannel.close();
    } catch {}

    // 1. Trigger Notification Audio Tone if enabled
    if (appSettings.enableTransactionAudioNotification !== false && appSettings.enableDepositNotificationSound !== false) {
      sounds.playTransactionAlert(
        'deposit',
        appSettings.transactionSoundTone || 'cash_register',
        appSettings.notificationVolume ?? 90
      );
    }

    // 2. Add to push broadcast notification list so bell icon reflects it
    setSentNotifications((prev) => [
      {
        id: `notif_dep_${Date.now()}`,
        title: `💰 নতুন ${method} ডিপোজিট রিকোয়েস্ট (৳${amount})`,
        message: `ইউজার আইডি: ${targetUserId}, অ্যাকাউন্ট: ${senderPhone}, TrxID: ${trxId}। এডমিন এপ্রুভালের জন্য অপেক্ষমান।`,
        type: 'deposit',
        targetScreen: 'wallet',
        sentAt: formattedTime,
        recipientCount: 1,
      },
      ...prev,
    ]);

    // 3. Add to user message box (ইনবক্স মেসেজ)
    handleAddInboxMessage({
      type: 'deposit',
      title: `💰 ডিপোজিট রিকোয়েস্ট জমা হয়েছে (৳${amount.toLocaleString()})`,
      message: `${method} মাধ্যমে ৳${amount.toLocaleString()} ডিপোজিট রিকোয়েস্ট গৃহীত হয়েছে। TrxID: ${trxId} (User ID: ${targetUserId})। অ্যাডমিন যাচাই শেষে ব্যালেন্স অ্যাকাউন্টে যুক্ত হবে।`,
      amount,
      status: 'Pending',
      metadata: { trxId, method, accountNumber: senderPhone, userId: targetUserId },
    });
  };

  // Update user's bound withdrawal accounts (bKash, Nagad, Rocket, Upay) and withdraw password
  const handleUpdateUserWithdrawSecurity = (
    withdrawalAccounts: {
      bkash?: string;
      nagad?: string;
      rocket?: string;
      upay?: string;
    },
    withdrawPassword: string
  ) => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        hasSetWithdrawPassword: true,
        withdrawPassword,
        withdrawalAccounts: {
          ...(prev.withdrawalAccounts || {}),
          ...withdrawalAccounts,
        },
      };
      try {
        localStorage.setItem('kingludo_current_user', JSON.stringify(updated));
        localStorage.setItem('kingludo_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setRegisteredUsers((prev) => {
      const nextUsers = prev.map((u) => {
        if (u.id === user.id || (user.phone && u.phone === user.phone)) {
          return {
            ...u,
            hasSetWithdrawPassword: true,
            withdrawPassword,
            withdrawalAccounts: {
              ...(u.withdrawalAccounts || {}),
              ...withdrawalAccounts,
            },
          };
        }
        return u;
      });
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });
  };

  // Update user ID login password
  const handleUpdateLoginPassword = (newPassword: string) => {
    setUser((prev) => {
      const updated: UserProfile = { ...prev, password: newPassword };
      try {
        localStorage.setItem('kingludo_current_user', JSON.stringify(updated));
        localStorage.setItem('kingludo_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setRegisteredUsers((prev) => {
      const nextUsers = prev.map((u) => {
        if (u.id === user.id || (user.phone && u.phone === user.phone)) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });
  };

  // Update user withdraw password
  const handleUpdateWithdrawPassword = (newWithdrawPassword: string) => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        hasSetWithdrawPassword: true,
        withdrawPassword: newWithdrawPassword,
      };
      try {
        localStorage.setItem('kingludo_current_user', JSON.stringify(updated));
        localStorage.setItem('kingludo_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setRegisteredUsers((prev) => {
      const nextUsers = prev.map((u) => {
        if (u.id === user.id || (user.phone && u.phone === user.phone)) {
          return {
            ...u,
            hasSetWithdrawPassword: true,
            withdrawPassword: newWithdrawPassword,
          };
        }
        return u;
      });
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });
  };

  // Withdraw money
  const handleWithdrawSubmit = (
    amount: number,
    method: PaymentMethod,
    accountPhone: string,
    cryptoDetails?: { cryptoAmount?: number; cryptoNetwork?: string },
    securityInfo?: { withdrawPasswordVerified?: boolean; linkedAccountVerified?: boolean }
  ) => {
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }
    const nextBalance = Math.max(0, (user.balance || 0) - amount);
    const updatedUser: UserProfile = { ...user, balance: nextBalance };
    setUser(updatedUser);
    try {
      localStorage.setItem('kingludo_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedUser));
    } catch {}

    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id || (user.phone && u.phone === user.phone));
      const nextUsers = exists
        ? prev.map((u) =>
            u.id === user.id || (user.phone && u.phone === user.phone)
              ? { ...u, balance: nextBalance }
              : u
          )
        : [{ ...updatedUser }, ...prev];
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch {}
      return nextUsers;
    });

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTrx: Transaction = {
      id: `trx_${Date.now()}`,
      type: 'withdraw',
      title: method === 'BinancePay' ? 'Binance Pay Withdrawal' : method === 'Cryptocurrency' ? 'Crypto USDT Withdrawal' : 'Withdrawal Request',
      amount,
      date: 'Today',
      time: formattedTime,
      status: 'Pending',
      paymentMethod: method,
      accountNumber: accountPhone,
      userId: user.id,
      userName: user.name || 'Player',
      userPhone: user.phone || accountPhone,
      cryptoAmount: cryptoDetails?.cryptoAmount,
      cryptoNetwork: cryptoDetails?.cryptoNetwork,
      withdrawPasswordVerified: securityInfo?.withdrawPasswordVerified ?? true,
      linkedAccountVerified: securityInfo?.linkedAccountVerified ?? false,
    };
    setTransactions((prev) => [newTrx, ...prev]);

    // Send withdrawal to backend server for real-time admin sync
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrx),
    }).catch(console.error);

    // Broadcast to other tabs so admin panel receives it immediately
    try {
      const syncChannel = new BroadcastChannel('kingludo_trx_sync_channel');
      syncChannel.postMessage({ type: 'NEW_TRANSACTION', transaction: newTrx });
      syncChannel.close();
    } catch {}

    // 1. Trigger Notification Audio Tone if enabled
    if (appSettings.enableTransactionAudioNotification !== false && appSettings.enableWithdrawNotificationSound !== false) {
      sounds.playTransactionAlert(
        'withdraw',
        appSettings.transactionSoundTone || 'cash_register',
        appSettings.notificationVolume ?? 90
      );
    }

    // 2. Add to push broadcast notification list so bell icon reflects it
    setSentNotifications((prev) => [
      {
        id: `notif_with_${Date.now()}`,
        title: `📤 নতুন ${method} উইথড্র রিকোয়েস্ট (৳${amount})`,
        message: `অ্যাকাউন্ট: ${accountPhone} এ ক্যাশআউট রিকোয়েস্ট প্রক্রিয়াধীন রয়েছে।`,
        type: 'withdraw',
        targetScreen: 'wallet',
        sentAt: formattedTime,
        recipientCount: 1,
      },
      ...prev,
    ]);

    // 3. Add to user message box (ইনবক্স মেসেজ)
    handleAddInboxMessage({
      type: 'withdraw',
      title: `📤 উইথড্র রিকোয়েস্ট সাবমিট হয়েছে (-৳${amount.toLocaleString()})`,
      message: `${method} অ্যাকাউন্টে (${accountPhone}) ৳${amount.toLocaleString()} ক্যাশআউট প্রক্রিয়াধীন আছে। অ্যাডমিন অনুমোদন করলে টাকা চলে যাবে।`,
      amount,
      status: 'Pending',
      metadata: { method, accountNumber: accountPhone },
    });
  };

  // Dedicated Match Entry Fee Deductor (Taka sara kuno game khelte parbe na, ebong ja fee ta main balance theke kete nibe)
  const deductEntryFeeFromBalance = (fee: number, description: string): boolean => {
    const amountToDeduct = Math.max(0, fee);
    if ((user.balance || 0) < amountToDeduct) {
      setBalanceErrorDetails({ required: amountToDeduct, current: user.balance || 0 });
      setShowBalanceErrorModal(true);
      return false;
    }

    const nextBalance = Math.max(0, (user.balance || 0) - amountToDeduct);
    const updatedUser: UserProfile = { ...user, balance: nextBalance };

    // 1. Update React state immediately
    setUser(updatedUser);

    // 2. Persist updatedUser to localStorage immediately
    try {
      localStorage.setItem('kingludo_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }

    // 3. Update registeredUsers list in state and localStorage immediately
    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id || (user.phone && u.phone === user.phone));
      const nextUsers = exists
        ? prev.map((u) =>
            u.id === user.id || (user.phone && u.phone === user.phone)
              ? { ...u, balance: nextBalance }
              : u
          )
        : [{ ...updatedUser }, ...prev];
      try {
        localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
      } catch (e) {
        console.error('Failed to save registered users to localStorage', e);
      }
      return nextUsers;
    });

    // 4. Record entry fee deduction in transaction history
    const matchFeeTrx: Transaction = {
      id: `trx_fee_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'withdraw',
      title: description,
      amount: amountToDeduct,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Success',
      userId: user.id,
      userPhone: user.phone,
    };
    setTransactions((prev) => [matchFeeTrx, ...prev]);

    // 5. Add deduction alert to User Inbox Message Box
    handleAddInboxMessage({
      type: 'withdraw',
      title: `🎮 ম্যাচ ফি কর্তন (-৳${amountToDeduct.toLocaleString()})`,
      message: `${description} বাবদ আপনার মেইন ব্যালেন্স থেকে ৳${amountToDeduct.toLocaleString()} কেটে নেওয়া হয়েছে। শুভকামনা!`,
      amount: amountToDeduct,
      status: 'Success',
      metadata: { method: 'King Ludo Match', userId: user.id },
    });

    return true;
  };

  // Create match
  const handleCreateMatch = (config: {
    playersCount: 2 | 3 | 4;
    entryFee: number;
    totalPrize: number;
    gameType: 'Classic' | 'Quick';
    gameMode: 'vs_ai' | 'pass_n_play' | 'ai_vs_ai';
    aiDifficulty: 'Easy' | 'Medium' | 'Hard';
    playWith: 'Anyone' | 'Friends';
  }) => {
    // 0. Check Ban
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }

    // 1. Check Login
    if (!user.isLoggedIn) {
      setShowLoginNotice(true);
      setAuthMode('register');
      setCurrentScreen('login');
      return;
    }

    // 2. Minimum Entry Fee Check (Taka sara kuno game khelte parbe na)
    const effectiveFee = Math.max(10, config.entryFee || 100);

    // 3. Deduct Entry Fee directly from user main balance and persist
    const deducted = deductEntryFeeFromBalance(
      effectiveFee,
      `খেলার এন্ট্রি ফি (${config.gameType} - ${config.playersCount} প্লেয়ার)`
    );
    if (!deducted) {
      return;
    }
    setIsCurrentMatchFeePaid(true);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setActiveRoomCode(code);
    setEntryFee(effectiveFee);
    setTotalPrize(config.totalPrize || effectiveFee * config.playersCount);
    setActivePlayersCount(config.playersCount);
    setActiveGameMode(config.gameMode || 'pass_n_play');
    setActiveAiDifficulty(config.aiDifficulty || 'Medium');
    setActiveGameType(config.gameType || 'Classic');

    // Fresh random opponent from 500+ pool for this match
    const freshOpp = generateRandomPlayer('opp_match');
    setOpponentPlayer({
      id: freshOpp.id,
      name: freshOpp.name,
      avatarUrl: freshOpp.avatarUrl,
      color: 'red',
      isBot: true,
    });

    setCurrentScreen('gameplay');
  };

  // Join match
  const handleJoinRoom = (code: string) => {
    // 0. Check Ban
    if (user.isBanned) {
      setShowBannedModal(true);
      return;
    }

    // 1. Check Login
    if (!user.isLoggedIn) {
      setShowLoginNotice(true);
      setAuthMode('register');
      setCurrentScreen('login');
      return;
    }

    const room = rooms.find((r) => r.code === code);
    const fee = Math.max(10, room ? room.entryFee : 100);

    // 2. Deduct Entry Fee directly from user main balance and persist
    const deducted = deductEntryFeeFromBalance(fee, `রুম জয়েন ফি (#${code})`);
    if (!deducted) {
      return;
    }
    setIsCurrentMatchFeePaid(true);

    setActiveRoomCode(code);
    setEntryFee(fee);
    setTotalPrize(fee * (room?.maxPlayers || 2));
    setActivePlayersCount(room?.gameType === '4 Player' || room?.maxPlayers === 4 ? 4 : 2);

    // Fresh random opponent from 500+ pool
    const freshOpp = generateRandomPlayer('opp_join');
    setOpponentPlayer({
      id: freshOpp.id,
      name: freshOpp.name,
      avatarUrl: freshOpp.avatarUrl,
      color: 'red',
      isBot: true,
    });

    setCurrentScreen('matchmaking');
  };

  // Match found
  const handleMatchFound = (count?: 2 | 4) => {
    const finalCount = count || activePlayersCount || 2;
    setActivePlayersCount(finalCount);
    setActiveGameMode('vs_ai');

    const effectiveFee = Math.max(10, entryFee || 100);
    // Strict balance check & deduction: if fee was not yet deducted for this match, deduct from main balance
    if (!isCurrentMatchFeePaid) {
      const deducted = deductEntryFeeFromBalance(
        effectiveFee,
        `ম্যাচমেকিং এন্ট্রি ফি (${finalCount} প্লেয়ার)`
      );
      if (!deducted) {
        setCurrentScreen('home');
        return;
      }
      setIsCurrentMatchFeePaid(true);
    }

    setEntryFee(effectiveFee);
    setTotalPrize(effectiveFee * finalCount);

    // Fresh random opponent from 500+ pool
    const freshOpp = generateRandomPlayer('opp_radar');
    setOpponentPlayer({
      id: freshOpp.id,
      name: freshOpp.name,
      avatarUrl: freshOpp.avatarUrl,
      color: 'red',
      isBot: true,
    });

    setCurrentScreen('gameplay');
  };

  // Finish game
  const handleFinishGame = (result: GameResult) => {
    setIsCurrentMatchFeePaid(false);
    setGameResult(result);

    if (result.isUserWinner) {
      const nextBal = (user.balance || 0) + result.netPrize;
      const nextTotalWon = (user.totalWon || 0) + result.netPrize;
      const nextTotalMatches = (user.totalMatches || 0) + 1;
      const nextLevelInfo = calculatePlayerLevel(nextTotalMatches, nextTotalWon, user.level);
      const updatedUser: UserProfile = {
        ...user,
        balance: nextBal,
        totalWon: nextTotalWon,
        totalMatches: nextTotalMatches,
        winRate: Math.round(((nextTotalWon > 0 ? nextTotalMatches : 1) / nextTotalMatches) * 100),
        level: nextLevelInfo.level,
      };

      setUser(updatedUser);

      try {
        localStorage.setItem('kingludo_current_user', JSON.stringify(updatedUser));
        localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to save user after win', e);
      }

      setRegisteredUsers((prev) => {
        const nextUsers = prev.map((u) =>
          u.id === user.id || (user.phone && u.phone === user.phone)
            ? { ...u, balance: nextBal, totalWon: nextTotalWon, totalMatches: nextTotalMatches, level: nextLevelInfo.level }
            : u
        );
        try {
          localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
        } catch (e) {
          console.error('Failed to save registered users after win', e);
        }
        return nextUsers;
      });

      const wonTrx: Transaction = {
        id: `trx_${Date.now()}`,
        type: 'match_won',
        title: `Won Match (vs ${opponentPlayer.name})`,
        amount: result.netPrize,
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Success',
        userId: user.id,
        userPhone: user.phone,
      };
      setTransactions((prev) => [wonTrx, ...prev]);

      const historyItem: MatchHistoryItem = {
        id: `mh_${Date.now()}`,
        opponentName: opponentPlayer.name,
        opponentAvatar: opponentPlayer.avatarUrl,
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        entryFee,
        prizeWon: result.netPrize,
        status: 'won',
      };
      setMatchHistory((prev) => [historyItem, ...prev]);
    } else {
      const nextTotalMatches = (user.totalMatches || 0) + 1;
      const nextLevelInfo = calculatePlayerLevel(nextTotalMatches, user.totalWon || 0, user.level);
      const updatedUser: UserProfile = {
        ...user,
        totalMatches: nextTotalMatches,
        level: nextLevelInfo.level,
      };

      setUser(updatedUser);

      try {
        localStorage.setItem('kingludo_current_user', JSON.stringify(updatedUser));
        localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to save user after loss', e);
      }

      setRegisteredUsers((prev) => {
        const nextUsers = prev.map((u) =>
          u.id === user.id || (user.phone && u.phone === user.phone)
            ? { ...u, totalMatches: nextTotalMatches, level: nextLevelInfo.level }
            : u
        );
        try {
          localStorage.setItem('kingludo_registered_users', JSON.stringify(nextUsers));
        } catch (e) {
          console.error('Failed to save registered users after loss', e);
        }
        return nextUsers;
      });

      const historyItem: MatchHistoryItem = {
        id: `mh_${Date.now()}`,
        opponentName: opponentPlayer.name,
        opponentAvatar: opponentPlayer.avatarUrl,
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        entryFee,
        prizeWon: 0,
        status: 'lost',
      };
      setMatchHistory((prev) => [historyItem, ...prev]);
    }

    setCurrentScreen('result');
  };

  // Screen renderer
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => handleNavigate('login')} />;
      case 'login':
        return (
          <LoginScreen
            registeredUsers={registeredUsers}
            onRegisterSuccess={handleRegisterSuccess}
            onLoginSuccess={handleLoginSuccess}
            initialMode={authMode}
          />
        );
      case 'home':
        return (
          <HomeScreen
            user={user}
            matchHistory={matchHistory}
            appSettings={appSettings}
            liveChatMessages={liveChatMessages}
            isLiveChatTyping={isLiveChatTyping}
            onSendLiveChatMessage={handleSendUserLiveMessage}
            onMarkLiveChatAsRead={handleMarkLiveChatAsRead}
            onNavigate={handleNavigate}
            onJoinRoom={handleJoinRoom}
            onOpenReferModal={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া রেফার অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              setShowReferModal(true);
            }}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenLuckySpinner={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া লাকি স্পিন অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              if (user.isBanned) {
                setShowBannedModal(true);
              } else {
                setShowLuckySpinnerModal(true);
              }
            }}
            onClaimSpinReward={handleClaimSpinReward}
            onClaimDailyReward={handleClaimDailyReward}
            selectedRegion={selectedRegion}
            spinCelebrationData={spinCelebrationData}
            onDismissSpinCelebration={() => setSpinCelebrationData(null)}
            onUpdateBalance={(newBal) => handleUpdateUserBalance(user.id, newBal)}
            onSelectPlayerCount={(count) => setActivePlayersCount(count)}
            onStartBotMatch={(playersCount) => {
              const defaultBotFee = 100;
              if (user.balance < defaultBotFee) {
                setBalanceErrorDetails({ required: defaultBotFee, current: user.balance });
                setShowBalanceErrorModal(true);
                return;
              }
              handleCreateMatch({
                playersCount,
                entryFee: defaultBotFee,
                totalPrize: defaultBotFee * playersCount,
                gameType: 'Classic',
                gameMode: 'vs_ai',
                aiDifficulty: 'Medium',
                playWith: 'Anyone',
              });
            }}
          />
        );
      case 'wallet':
        return (
          <WalletScreen
            balance={user.balance}
            transactions={
              isAdminUser(user)
                ? transactions
                : transactions.filter(
                    (t) =>
                      !t.userId ||
                      t.userId === user.id ||
                      (t.userPhone && t.userPhone === user.phone) ||
                      (t.accountNumber && t.accountNumber === user.phone)
                  )
            }
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
            appSettings={appSettings}
            currentUser={user}
          />
        );
      case 'add_money':
        return (
          <AddMoneyScreen
            appSettings={appSettings}
            currentUser={user}
            onAddMoneySuccess={handleAddMoneySuccess}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
          />
        );
      case 'withdraw':
        return (
          <WithdrawScreen
            balance={user.balance}
            currentUser={user}
            appSettings={appSettings}
            onWithdrawSubmit={handleWithdrawSubmit}
            onUpdateUserWithdrawSecurity={handleUpdateUserWithdrawSecurity}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
          />
        );
      case 'create_match':
        return (
          <CreateMatchScreen
            userBalance={user.balance}
            user={{ name: user.name, avatarUrl: user.avatarUrl }}
            onCreateMatch={handleCreateMatch}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
            rooms={rooms}
            onJoinRoom={handleJoinRoom}
            initialPlayersCount={activePlayersCount}
            appSettings={appSettings}
          />
        );
      case 'join_match':
        return (
          <JoinMatchScreen
            userBalance={user.balance}
            user={{ name: user.name, avatarUrl: user.avatarUrl }}
            rooms={rooms}
            onCreateMatch={handleCreateMatch}
            onJoinRoom={handleJoinRoom}
            onQuickJoin={() => handleJoinRoom('AB12CD')}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
            appSettings={appSettings}
          />
        );
      case 'matchmaking':
        return (
          <MatchmakingScreen
            initialPlayersCount={activePlayersCount}
            activeRoomCode={activeRoomCode}
            onMatchFound={handleMatchFound}
            onCancel={() => {
              if (isCurrentMatchFeePaid && entryFee > 0) {
                const refundedBal = (user.balance || 0) + entryFee;
                const updatedUser: UserProfile = { ...user, balance: refundedBal };
                setUser(updatedUser);
                try {
                  localStorage.setItem('kingludo_current_user', JSON.stringify(updatedUser));
                  localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedUser));
                } catch (e) {}
                handleAddInboxMessage({
                  type: 'bonus',
                  title: `🔄 ম্যাচ ফি রিফান্ড (+৳${entryFee.toLocaleString()})`,
                  message: `ম্যাচমেকিং বাতিল করায় আপনার এন্ট্রি ফি ৳${entryFee.toLocaleString()} মূল ব্যালেন্সে ফেরত দেওয়া হয়েছে।`,
                  amount: entryFee,
                  status: 'Success',
                  metadata: { method: 'Match Cancellation Refund', userId: user.id },
                });
                setIsCurrentMatchFeePaid(false);
              }
              handleNavigate('home');
            }}
          />
        );
      case 'gameplay':
        return (
          <LudoGameScreen
            roomCode={activeRoomCode}
            entryFee={entryFee}
            totalPrize={totalPrize}
            userPlayer={userPlayer}
            opponentPlayer={opponentPlayer}
            playersCount={activePlayersCount}
            gameMode={activeGameMode}
            aiDifficulty={activeAiDifficulty}
            gameType={activeGameType}
            platformCommissionPercent={appSettings.platformCommissionPercent}
            companyWinRatePercent={appSettings.companyWinRatePercent}
            playerWinRatePercent={appSettings.playerWinRatePercent}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onFinishGame={handleFinishGame}
            onNavigate={handleNavigate}
          />
        );
      case 'result':
        return (
          gameResult && (
            <ResultScreen
              result={gameResult}
              onPlayAgain={() => handleNavigate('create_match')}
              onNavigate={handleNavigate}
            />
          )
        );
      case 'match_history':
        return (
          <MatchHistoryScreen
            historyItems={matchHistory}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen
            users={leaderboard}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            matchHistory={matchHistory}
            appSettings={appSettings}
            onUpdateName={(name) => setUser((prev) => ({ ...prev, name }))}
            onUpdateLoginPassword={handleUpdateLoginPassword}
            onUpdateWithdrawPassword={handleUpdateWithdrawPassword}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            selectedRegion={selectedRegion}
            onClaimDailyReward={handleClaimDailyReward}
            onOpenLuckySpinner={() => setShowLuckySpinnerModal(true)}
            spinCelebrationData={spinCelebrationData}
            onUpdateBalance={(newBal) => handleUpdateUserBalance(user.id, newBal)}
            onClearAllData={handleClearAllData}
          />
        );
      case 'support':
        return (
          <SupportScreen
            user={user}
            appSettings={appSettings}
            liveChatMessages={liveChatMessages}
            onSendLiveChatMessage={handleSendUserLiveMessage}
            onMarkLiveChatAsRead={handleMarkLiveChatAsRead}
            onNavigate={handleNavigate}
            selectedRegion={selectedRegion}
          />
        );
      case 'admin_panel':
        if (!isAdminUser(user)) {
          return (
            <HomeScreen
              user={user}
              matchHistory={matchHistory}
              appSettings={appSettings}
              liveChatMessages={liveChatMessages}
              onSendLiveChatMessage={handleSendUserLiveMessage}
              onMarkLiveChatAsRead={handleMarkLiveChatAsRead}
              onNavigate={handleNavigate}
              onOpenReferModal={() => setShowReferModal(true)}
              onOpenMenu={() => setIsMenuOpen(true)}
            />
          );
        }
        return (
          <AdminPanelScreen
            currentUser={user}
            registeredUsers={registeredUsers}
            transactions={transactions}
            appSettings={appSettings}
            sentNotifications={sentNotifications}
            liveChatMessages={liveChatMessages}
            matchHistory={matchHistory}
            onUpdateAppSettings={handleUpdateAppSettings}
            onUpdateUserBalance={handleUpdateUserBalance}
            onSaveFullUser={handleSaveFullUser}
            onToggleUserBan={handleToggleUserBan}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onSendBroadcastNotification={handleSendBroadcastNotification}
            onDeleteBroadcastNotification={handleDeleteBroadcastNotification}
            onApproveTransaction={handleApproveTransaction}
            onRejectTransaction={handleRejectTransaction}
            onBulkApproveTransactions={handleBulkApproveTransactions}
            onBulkRejectTransactions={handleBulkRejectTransactions}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onManualTransaction={handleManualTransaction}
            onSendAdminMessage={handleSendAdminLiveMessage}
            onClearLiveChatThread={handleClearLiveChatThread}
            onClearAllLiveChat={handleClearAllLiveChat}
            onResetMatchHistory={handleResetMatchHistory}
            onDeleteLiveChatMessage={handleDeleteLiveChatMessage}
            onClearAllData={handleClearAllData}
            onNavigate={handleNavigate}
          />
        );
      case 'activity':
        return (
          <ActivityScreen
            user={user}
            appSettings={appSettings}
            matchHistory={matchHistory}
            onNavigate={handleNavigate}
            onOpenLuckySpinner={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া লাকি স্পিন অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              if (user.isBanned) {
                setShowBannedModal(true);
              } else {
                setShowLuckySpinnerModal(true);
              }
            }}
            onOpenReferModal={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া রেফার অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              setShowReferModal(true);
            }}
            onClaimDailyReward={handleClaimDailyReward}
          />
        );
      case 'favourite':
        return (
          <FavouriteScreen
            user={user}
            appSettings={appSettings}
            onNavigate={handleNavigate}
            onSelectPlayerCount={(count) => setActivePlayersCount(count)}
            onStartBotMatch={(playersCount) => {
              const defaultBotFee = 100;
              if (user.balance < defaultBotFee) {
                setBalanceErrorDetails({ required: defaultBotFee, current: user.balance });
                setShowBalanceErrorModal(true);
                return;
              }
              handleCreateMatch({
                playersCount,
                entryFee: defaultBotFee,
                totalPrize: defaultBotFee * playersCount,
                gameType: 'Classic',
                gameMode: 'vs_ai',
                aiDifficulty: 'Medium',
                playWith: 'Anyone',
              });
            }}
          />
        );
      default:
        return <HomeScreen user={user} onNavigate={handleNavigate} onOpenReferModal={() => setShowReferModal(true)} />;
    }
  };

  const handleRefreshBalance = () => {
    // Re-trigger balance update and sync safely from local storage
    try {
      // 1. Check kingludo_current_user first
      const savedCurrentStr = localStorage.getItem('kingludo_current_user');
      if (savedCurrentStr) {
        const currentSaved = JSON.parse(savedCurrentStr);
        if (currentSaved && typeof currentSaved.balance === 'number') {
          setUser((prev) => ({
            ...prev,
            ...currentSaved,
            balance: currentSaved.balance,
            totalWon: currentSaved.totalWon ?? prev.totalWon,
          }));
          return;
        }
      }

      // 2. Sync from registered users list
      const savedUsersStr = localStorage.getItem('kingludo_registered_users');
      if (savedUsersStr && (user.id || user.phone)) {
        const regUsers: UserProfile[] = JSON.parse(savedUsersStr);
        if (Array.isArray(regUsers)) {
          const match = regUsers.find(
            (u) => (user.id && u.id === user.id) || (user.phone && u.phone === user.phone)
          );
          if (match && typeof match.balance === 'number') {
            setUser((prev) => ({
              ...prev,
              ...match,
              balance: match.balance,
              totalWon: match.totalWon ?? prev.totalWon,
            }));
            const updatedProfile = { ...user, ...match, balance: match.balance };
            localStorage.setItem('kingludo_current_user', JSON.stringify(updatedProfile));
            localStorage.setItem('kingludo_user_profile', JSON.stringify(updatedProfile));
            return;
          }
        }
      }
    } catch (e) {
      console.error('Failed to refresh balance:', e);
    }
    setUser((prev) => ({ ...prev, balance: prev.balance }));
  };

  const showBottomNav = ['home', 'match_history', 'wallet', 'profile', 'activity', 'favourite', 'add_money'].includes(currentScreen);
  const showTopHeader = !['splash', 'gameplay', 'game_playing', 'admin_panel'].includes(currentScreen);

  return (
    <div
      className="w-full min-h-screen h-screen bg-[#04240d] text-slate-100 flex flex-col font-sans antialiased select-none overflow-hidden relative"
      style={{
        backgroundImage: "url('/images/green_abstract_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Fullscreen Master Container with emerald translucent backdrop */}
      <div className="w-full h-full flex-1 bg-[#04240d]/80 backdrop-blur-[2px] overflow-hidden flex flex-col relative">
        {/* KingLudu Top Navigation Header */}
        {showTopHeader && (
          <TopHeader
            user={user}
            appSettings={appSettings}
            onNavigate={handleNavigate}
            onOpenMenu={() => setIsMenuOpen(true)}
            onRefreshBalance={handleRefreshBalance}
            onSelectAuthMode={handleSelectAuthMode}
            onOpenLuckySpinner={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া লাকি স্পিন অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              setShowLuckySpinnerModal(true);
            }}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            onOpenMessageBox={() => {
              if (!user.isLoggedIn) {
                setShowLoginNotice(true);
                setLoginNoticeMessage('আইডি লগইন ছাড়া ইনবক্স মেসেজ অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
                setAuthMode('login');
                setCurrentScreen('login');
                return;
              }
              setShowInboxModal(true);
            }}
            unreadMessageCount={inboxMessages.filter((m) => !m.isRead).length}
          />
        )}

        {/* Active Screen View - Edge to edge Fullscreen */}
        <div className={`flex-1 overflow-y-auto relative scrollbar-none w-full ${currentScreen === 'gameplay' ? 'flex flex-col h-full' : ''}`}>
          {renderScreenContent()}
        </div>

        {/* Bottom Tab Bar */}
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenMenu={() => setIsMenuOpen(true)}
            selectedRegion={selectedRegion}
            isLoggedIn={user.isLoggedIn}
          />
        )}
      </div>

      {/* Side Navigation Drawer */}
      <SideMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenReferModal={() => {
          if (!user.isLoggedIn) {
            setShowLoginNotice(true);
            setLoginNoticeMessage('আইডি লগইন ছাড়া রেফার অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
            setAuthMode('login');
            setCurrentScreen('login');
            return;
          }
          setShowReferModal(true);
        }}
        onOpenLuckySpinner={() => {
          if (!user.isLoggedIn) {
            setShowLoginNotice(true);
            setLoginNoticeMessage('আইডি লগইন ছাড়া লাকি স্পিন অপশনে প্রবেশ করা যাবে না! অনুগ্রহ করে লগইন করুন।');
            setAuthMode('login');
            setCurrentScreen('login');
            return;
          }
          setShowLuckySpinnerModal(true);
        }}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        onOpenMessageBox={() => setShowInboxModal(true)}
        unreadMessageCount={inboxMessages.filter((m) => !m.isRead).length}
        onClearAllData={handleClearAllData}
      />

      {/* Refer & Earn Modal */}
      {showReferModal && (
        <ReferEarnModal
          referralCode={user.referralCode}
          onClose={() => setShowReferModal(false)}
        />
      )}

      {/* Global Lucky Spinner Wheel Modal */}
      {showLuckySpinnerModal && (
        <LuckySpinnerWheelModal
          isOpen={showLuckySpinnerModal}
          onClose={() => setShowLuckySpinnerModal(false)}
          user={user}
          appSettings={appSettings}
          onClaimReward={handleClaimSpinReward}
        />
      )}

      {/* Floating Global Push Notification Popup Modal */}
      {activePushModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden bg-[#130a32] border-2 ${
              activePushModal.type === 'maintenance'
                ? 'border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)]'
                : activePushModal.type === 'event'
                ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.4)]'
                : activePushModal.type === 'warning'
                ? 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)]'
                : activePushModal.type === 'offer'
                ? 'border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.4)]'
                : 'border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.35)]'
            }`}
          >
            {/* Ambient background glow */}
            <div
              className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
                activePushModal.type === 'maintenance'
                  ? 'bg-amber-500/25'
                  : activePushModal.type === 'event'
                  ? 'bg-cyan-500/25'
                  : activePushModal.type === 'warning'
                  ? 'bg-rose-500/25'
                  : 'bg-amber-500/20'
              }`}
            />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2.5 rounded-2xl text-slate-950 shadow-lg animate-bounce ${
                    activePushModal.type === 'maintenance'
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                      : activePushModal.type === 'event'
                      ? 'bg-gradient-to-br from-cyan-400 to-cyan-600'
                      : activePushModal.type === 'warning'
                      ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                      : activePushModal.type === 'offer'
                      ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600'
                  }`}
                >
                  {activePushModal.type === 'maintenance' ? (
                    <Wrench className="w-5 h-5 fill-slate-950" />
                  ) : activePushModal.type === 'event' ? (
                    <Trophy className="w-5 h-5 fill-slate-950" />
                  ) : activePushModal.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-slate-950" />
                  ) : activePushModal.type === 'offer' ? (
                    <Gift className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Megaphone className="w-5 h-5 fill-slate-950" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-[10px] border px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 w-fit ${
                      activePushModal.type === 'maintenance'
                        ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                        : activePushModal.type === 'event'
                        ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300'
                        : activePushModal.type === 'warning'
                        ? 'bg-rose-400/20 border-rose-400/50 text-rose-300'
                        : activePushModal.type === 'offer'
                        ? 'bg-purple-400/20 border-purple-400/50 text-purple-300'
                        : 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                    }`}
                  >
                    <Bell className="w-3 h-3" />
                    <span>
                      {activePushModal.type === 'maintenance'
                        ? 'সার্ভার মেইনটেন্যান্স বিজ্ঞপ্তি'
                        : activePushModal.type === 'event'
                        ? 'নতুন গেম ইভেন্ট'
                        : activePushModal.type === 'warning'
                        ? 'সিকিউরিটি সতর্কবার্তা'
                        : activePushModal.type === 'offer'
                        ? 'স্পেশাল বোনাস অফার'
                        : 'সিস্টেম ব্রডকাস্ট'}
                    </span>
                  </span>
                  <p className="text-[10px] text-purple-300 font-mono mt-0.5">{activePushModal.sentAt}</p>
                </div>
              </div>

              <button
                onClick={() => setActivePushModal(null)}
                className="p-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="font-extrabold text-base text-white">{activePushModal.title}</h3>
              <p className="text-xs text-purple-200 leading-relaxed bg-[#0a041f] p-3 rounded-2xl border border-purple-800/40 whitespace-pre-line">
                {activePushModal.message}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 relative z-10">
              <button
                onClick={() => {
                  const target = activePushModal.targetScreen || 'home';
                  setActivePushModal(null);
                  handleNavigate(target);
                }}
                className={`flex-1 py-3 text-slate-950 font-black text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-1.5 ${
                  activePushModal.type === 'event'
                    ? 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600'
                    : activePushModal.type === 'warning'
                    ? 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600'
                    : activePushModal.type === 'offer'
                    ? 'bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600'
                }`}
              >
                <span>{activePushModal.actionText || 'এখনই দেখুন (View Now)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePushModal(null)}
                className="px-4 py-3 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-2xl transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Insufficient Wallet Balance Modal */}
      {showBalanceErrorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#120a32] border-2 border-red-500/80 w-full max-w-xs rounded-3xl p-5 space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.4)] relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <span className="text-2xl">⚠️</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">টাকা ছাড়া কোনো গেম খেলা যাবে না!</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                King Ludo-তে ম্যাচ খেলতে ওয়ালেটে পর্যাপ্ত টাকা (ব্যালেন্স) ডিপোজিট করতে হবে।
              </p>
            </div>

            <div className="bg-[#0a041f] p-3 rounded-2xl border border-purple-800/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-purple-300">
                <span>প্রয়োজনীয় এন্ট্রি ফি:</span>
                <span className="font-extrabold text-amber-400">
                  ৳{(Number(balanceErrorDetails.required) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-purple-300">
                <span>আপনার ওয়ালেট ব্যালেন্স:</span>
                <span className="font-extrabold text-red-400">
                  ৳{(Number(balanceErrorDetails.current) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowBalanceErrorModal(false);
                  handleNavigate('add_money');
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>➕ ওয়ালেটে টাকা অ্যাড করুন</span>
              </button>

              <button
                onClick={() => setShowBalanceErrorModal(false)}
                className="w-full py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-xl transition"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Banned User Notification & Action Modal */}
      <BannedUserModal
        isOpen={showBannedModal}
        user={user}
        onClose={() => setShowBannedModal(false)}
        onContactSupport={() => {
          setShowBannedModal(false);
          setCurrentScreen('support');
        }}
        onLogout={handleLogout}
      />

      {/* User Message Box Modal (মেসেজ বক্স - ডিপোজিট/উইথড্র/বোনাস নোটিফিকেশন) */}
      <UserInboxModal
        isOpen={showInboxModal}
        onClose={() => setShowInboxModal(false)}
        messages={inboxMessages}
        onDeleteMessage={handleDeleteInboxMessage}
        onClearAllMessages={handleClearAllInboxMessages}
        onMarkAsRead={handleMarkInboxMessageAsRead}
        onMarkAllAsRead={handleMarkAllInboxMessagesAsRead}
      />
    </div>
  );
}
