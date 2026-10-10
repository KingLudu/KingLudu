export type ScreenType = 
  | 'splash' 
  | 'login' 
  | 'home' 
  | 'wallet' 
  | 'add_money' 
  | 'withdraw' 
  | 'create_match' 
  | 'join_match' 
  | 'matchmaking' 
  | 'gameplay' 
  | 'result' 
  | 'match_history' 
  | 'match_replay'
  | 'leaderboard' 
  | 'profile' 
  | 'support'
  | 'admin_panel'
  | 'activity'
  | 'favourite';

export interface HomeBannerConfig {
  id: number;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  targetScreen: ScreenType;
  action: 'navigate' | 'refer';
  enabled: boolean;
}

export interface HomeGameOptionConfig {
  id: 'kingludo' | 'slot' | 'live_casino' | 'sports';
  title: string;
  enTitle: string;
  subtitle: string;
  badge: string;
  hotBadge: string;
  playersCount: string;
  imageUrl?: string;
  enabled: boolean;
  minBet?: number;
  maxBet?: number;
  commissionPercent?: number;
}

export const DEFAULT_HOME_GAME_OPTIONS: HomeGameOptionConfig[] = [
  {
    id: 'kingludo',
    title: 'কিং লুডো',
    enTitle: 'King Ludo',
    subtitle: '২ প্লেয়ার, ৪ প্লেয়ার, ফ্রেন্ডস রুম ও মেগা কাপ টুর্নামেন্ট',
    badge: '👑 ৪টি লুডো মোড',
    hotBadge: '🔥 মোস্ট পপুলার',
    playersCount: '১,৬৫০+ লাইভ প্লেয়ার',
    imageUrl: '',
    enabled: true,
    minBet: 10,
    maxBet: 50000,
    commissionPercent: 20,
  },
];

export interface AppSettings {
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  upayNumber: string;
  minDeposit: number;
  minWithdrawal: number;
  minMatchFee?: number; // সর্বনিম্ন ম্যাচ এন্ট্রি ফি / বেট (৳)
  platformCommissionPercent: number;
  referralBonus: number;
  marqueeNotice: string;
  supportTelegram: string;
  supportWhatsApp: string;
  isMaintenanceMode: boolean;
  botDifficulty: 'Easy' | 'Normal' | 'Hard';
  companyWinRatePercent: number;
  playerWinRatePercent?: number; // Real player win rate vs bot, default 45% (configurable 10% - 90%)

  // Local Payment Gateways Control (বিকাশ, নগদ, রকেট, উপায় ডিপোজিট ও উইথড্র সক্রিয়/নিষ্ক্রিয়)
  enableBkashDeposit?: boolean;
  enableNagadDeposit?: boolean;
  enableRocketDeposit?: boolean;
  enableUpayDeposit?: boolean;

  enableBkashWithdraw?: boolean;
  enableNagadWithdraw?: boolean;
  enableRocketWithdraw?: boolean;
  enableUpayWithdraw?: boolean;

  // Binance Pay & Cryptocurrency Settings (বাইনান্স পে ও ক্রিপ্টো সেটিংস)
  binancePayId?: string;
  binancePayQrUrl?: string;
  cryptoPayId?: string;
  cryptoUsdtTrc20Address?: string;
  cryptoUsdtTrc20QrUrl?: string;
  cryptoUsdtBep20Address?: string;
  cryptoUsdtBep20QrUrl?: string;
  usdtExchangeRate?: number;
  enableBinancePay?: boolean;
  enableCrypto?: boolean;

  // Custom Payment Gateways Logos (এডমিন থেকে বিকাশ, নগদ, রকেট, উপায়, বাইন্যান্স ও ক্রিপ্টো লোগো)
  paymentLogos?: {
    bKash?: string;
    Nagad?: string;
    Rocket?: string;
    Upay?: string;
    BinancePay?: string;
    Cryptocurrency?: string;
    [key: string]: string | undefined;
  };
  paymentLogoFitMode?: 'contain' | 'cover';

  // Custom Payment Gateway Account Titles / Labels (যেমন: Official bKash Personal/Agent Account)
  paymentAccountTitles?: {
    bKash?: string;
    Nagad?: string;
    Rocket?: string;
    Upay?: string;
    BinancePay?: string;
    Cryptocurrency?: string;
    [key: string]: string | undefined;
  };

  // Home Page Program Controls (হোম পেজ প্রোগ্রাম নিয়ন্ত্রণ)
  homeGameOptions?: HomeGameOptionConfig[];
  showBanners?: boolean;
  bannersList?: HomeBannerConfig[];
  showMarqueeNotice?: boolean;
  showQuickDepositWithdraw?: boolean;
  showQuickDeposit?: boolean;
  showLiveChatBanner?: boolean;
  showLiveChatFloating?: boolean;
  liveChatTagline?: string;
  enableLiveChatAutoReply?: boolean;
  autoReplyDelayMs?: number;

  // App Branding & Header Customizations (এডমিন প্যানেল থেকে নাম, কালার ও লোগো পরিবর্তন)
  appTitle?: string; // ফাঁকা রাখলে শুধু লোগো শো করবে, নাম দিলে নাম শো করবে
  headerLogoUrl?: string; // কাস্টম লোগো ছবি ইউআরএল (ফাঁকা রাখলে ডিফল্ট ক্রাউন লোগো)
  headerTextColor?: string; // নামের কালার (যেমন: gold, emerald, cyan, white, purple, ইত্যাদি)

  // Home Text Customizations (এডমিন প্যানেল থেকে পরিবর্তনযোগ্য হোমপেজের টেক্সটসমূহ)
  quickDepositTitle?: string;
  quickDepositSubtitle?: string;
  quickDepositBadge?: string;
  marqueeNoticeBadge?: string;
  gameLobbyTitle?: string;
  gameLobbySubtitle?: string;
  gameLobbyDescription?: string;
  gameLobbyBadge?: string;
  luckySpinnerTitle?: string;
  luckySpinnerBadge?: string;
  luckySpinnerSubtitle?: string;
  luckySpinnerButtonText?: string;
  referEarnTitle?: string;
  referEarnButtonText?: string;
  liveChatTitle?: string;
  liveChatButtonText?: string;
  aboutCardTitle?: string;
  aboutCardSubtitle?: string;
  aboutCardDesc?: string;
  
  // Game Modes Controls
  enable2PlayerMode?: boolean;
  mode2PlayerSubtitle?: string;
  enable4PlayerMode?: boolean;
  mode4PlayerSubtitle?: string;
  enablePrivateRoomMode?: boolean;
  modePrivateSubtitle?: string;
  enableTournamentMode?: boolean;
  modeTournamentSubtitle?: string;

  // Additional Home Programs
  showLuckySpinner?: boolean;
  showLatestWinnersTicker?: boolean;
  winnersTickerTitle?: string;
  showReferEarnBanner?: boolean;
  referBannerPromoText?: string;
  showDailyRewardCard?: boolean;
  dailyRewardAmount?: number;

  // Deposit & Withdraw Notification & Audio Tone Settings (ডিপোজিট ও উইথড্র নোটিফিকেশন এবং অডিও টোন)
  enableTransactionAudioNotification?: boolean;
  transactionSoundTone?: 'bell' | 'cash_register' | 'coin_drop' | 'digital_alert' | 'success_fanfare';
  notificationVolume?: number; // 0 to 100
  enableDepositNotificationSound?: boolean;
  enableWithdrawNotificationSound?: boolean;
}

export type RegionCode = 'BN' | 'EN' | 'IN' | 'NP';

export interface RegionInfo {
  code: RegionCode;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  depositMethods: string[];
  withdrawMethods: string[];
}

export const REGIONS: Record<RegionCode, RegionInfo> = {
  BN: {
    code: 'BN',
    name: 'বাংলা (BN)',
    flag: '🇧🇩',
    currencySymbol: '৳',
    currencyCode: 'BDT',
    depositMethods: ['bKash', 'Nagad', 'Rocket', 'Upay'],
    withdrawMethods: ['bKash', 'Nagad', 'Rocket', 'Upay'],
  },
  EN: {
    code: 'EN',
    name: 'English (EN)',
    flag: '🇬🇧',
    currencySymbol: '$',
    currencyCode: 'USD',
    depositMethods: ['BinancePay', 'Cryptocurrency'],
    withdrawMethods: ['BinancePay', 'Cryptocurrency'],
  },
  IN: {
    code: 'IN',
    name: 'हिंदी (IN)',
    flag: '🇮🇳',
    currencySymbol: '$',
    currencyCode: 'USD',
    depositMethods: ['BinancePay', 'Cryptocurrency'],
    withdrawMethods: ['BinancePay', 'Cryptocurrency'],
  },
  NP: {
    code: 'NP',
    name: 'নেপালী (NP)',
    flag: '🇳🇵',
    currencySymbol: '$',
    currencyCode: 'USD',
    depositMethods: ['BinancePay', 'Cryptocurrency'],
    withdrawMethods: ['BinancePay', 'Cryptocurrency'],
  },
};

export type PaymentMethod = 
  | 'bKash' 
  | 'Nagad' 
  | 'Rocket' 
  | 'Upay' 
  | 'BinancePay'
  | 'Cryptocurrency'
  | 'UPI' 
  | 'Paytm' 
  | 'PhonePe' 
  | 'GooglePay' 
  | 'eSewa' 
  | 'Khalti' 
  | 'IME Pay' 
  | 'Bank' 
  | 'PayPal' 
  | 'Binance' 
  | 'Card' 
  | 'Bank Transfer';

export type TransactionType = 'deposit' | 'withdraw' | 'match_won' | 'match_fee' | 'referral_bonus' | 'daily_reward';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  time: string;
  status: 'Success' | 'Pending' | 'Failed';
  paymentMethod?: PaymentMethod;
  accountNumber?: string;
  trxId?: string;
  cryptoAmount?: number;
  cryptoNetwork?: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  withdrawPasswordVerified?: boolean;
  linkedAccountVerified?: boolean;
}

export interface UserDeviceInfo {
  deviceModel: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  imeiStatus?: string;
  screenResolution?: string;
  networkType?: string;
  lastActiveTime?: string;
  carrier?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  password?: string;
  avatarUrl: string;
  balance: number;
  referralCode: string;
  totalWon: number;
  totalMatches: number;
  winRate: number;
  level?: number;
  totalEarnings?: number;
  isLoggedIn?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
  role?: 'user' | 'admin';
  lastCheckInTimestamp?: number;
  checkInStreak?: number;
  deviceInfo?: UserDeviceInfo;
  // Withdrawal Security & Bound Accounts
  withdrawPassword?: string;
  hasSetWithdrawPassword?: boolean;
  withdrawalAccounts?: {
    bkash?: string;
    nagad?: string;
    rocket?: string;
    upay?: string;
    binancePayId?: string;
    cryptoAddress?: string;
    [key: string]: string | undefined;
  };
}

export const isAdminUser = (user?: UserProfile | null): boolean => {
  if (!user || !user.isLoggedIn) return false;
  if (user.role === 'admin') return true;
  const cleanPhone = (user.phone || '').replace(/\D/g, '');
  const cleanId = (user.id || '').trim().toLowerCase();
  
  return (
    cleanPhone === '01910204477' ||
    cleanId === '01910204477' ||
    cleanPhone === '01700000000' ||
    cleanId === 'admin'
  );
};

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface LudoRulesConfig {
  openOnSixOnly: boolean; // Rule 1: Must roll 6 to leave starting base
  bonusOnSix: boolean; // Rule 2: Rolling 6 gives extra turn
  consecutiveSixPenalty: 'cancel_turn' | 'skip_next' | 'lose_pawn'; // Rule 3: 3 consecutive 6s penalty
  captureOpponent: boolean; // Rule 5: Landing on opponent sends them back to base
  safeStarCells: boolean; // Rule 6: Safe star & start cells cannot be captured
  bonusOnCapture: boolean; // Rule 7: Capturing opponent grants extra turn
  exactHomeRoll: boolean; // Rule 8: Exact roll required to reach Home
  pawnsToWin: 1 | 4; // Rule 9: 4 tokens for Classic, 1 for Quick
  noSameColorOverlap: boolean; // Ludo King Rule: এক প্লেয়ারের দুটি গুটি একই ঘরে একসাথে ডাবল/বসবে না
  turnTimerSeconds: number; // 10s, 15s, 30s
  gameSpeed: 'normal' | 'fast' | 'turbo';
}

export const DEFAULT_LUDO_RULES: LudoRulesConfig = {
  openOnSixOnly: true,
  bonusOnSix: true,
  consecutiveSixPenalty: 'cancel_turn',
  captureOpponent: true,
  safeStarCells: true,
  bonusOnCapture: true,
  exactHomeRoll: true,
  pawnsToWin: 4,
  noSameColorOverlap: true, // Default to true following Ludo King official rules
  turnTimerSeconds: 15,
  gameSpeed: 'normal',
};

export interface Player {
  id: string;
  name: string;
  avatarUrl: string;
  color: PlayerColor;
  isBot?: boolean;
}

export interface Pawn {
  id: number; // 0..3
  color: PlayerColor;
  position: number; // -1 = base, 0..51 = main track, 52..56 = home stretch, 57 = finished
  stepCount: number; // how many total steps taken
}

export interface Room {
  id: string;
  code: string;
  hostName: string;
  hostAvatar: string;
  entryFee: number;
  totalPrize: number;
  gameType: '2 Player' | '4 Player';
  mode: 'Classic' | 'Quick';
  playersCount: number;
  maxPlayers: number;
}

export interface GameResult {
  winner: Player;
  totalPrize: number;
  platformFee: number;
  netPrize: number;
  isUserWinner: boolean;
}

export interface ReplayAction {
  id: string;
  turn: PlayerColor;
  diceValue: number;
  pawnId?: number;
  pawnColor?: PlayerColor;
  fromStep?: number;
  toStep?: number;
  isCapture?: boolean;
  capturedColor?: PlayerColor;
  capturedPawnId?: number;
  notice?: string;
  timestamp: number;
}

export interface MatchHistoryItem {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  date: string;
  time: string;
  entryFee: number;
  prizeWon: number;
  status: 'won' | 'lost';
  playersCount?: number;
  players?: Player[];
  replayActions?: ReplayAction[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  winnings: number;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'offer' | 'warning' | 'event' | 'maintenance';
  targetScreen?: ScreenType;
  sentAt: string;
  recipientCount: number;
  showModal?: boolean;
  actionText?: string;
}

export type UserMessageType = 'deposit' | 'withdraw' | 'bonus' | 'system';

export interface UserInboxMessage {
  id: string;
  userId?: string;
  type: UserMessageType;
  title: string;
  message: string;
  amount?: number;
  status?: 'Pending' | 'Success' | 'Failed' | 'Completed';
  timestamp: number;
  timeFormatted: string;
  isRead: boolean;
  metadata?: {
    trxId?: string;
    method?: string;
    bonusType?: 'spin' | 'daily' | 'referral' | 'vip' | 'match';
    accountNumber?: string;
    userId?: string;
  };
}

export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  isEmoji?: boolean;
  time: string;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userAvatar?: string;
  senderRole: 'user' | 'admin' | 'agent';
  text: string;
  imageUrl?: string;
  imageName?: string;
  time: string;
  timestamp: number;
  isReadByAdmin?: boolean;
  isReadByUser?: boolean;
}

