export type AdminProgramId =
  | 'dashboard'
  | 'vip_cashback'
  | 'spinner_wheel'
  // Finance
  | 'finance_deposits'
  | 'finance_withdrawals'
  | 'finance_all_transactions'
  | 'finance_agent_trans'
  | 'finance_game_trans'
  // Users & Roles
  | 'users_players'
  | 'users_agents'
  | 'users_deposit_levels'
  | 'users_vip_tiers'
  | 'users_roles_perms'
  | 'users_admins'
  // Game System
  | 'game_spinner'
  | 'game_games_v1'
  | 'game_games_v2'
  | 'game_errors'
  | 'game_categories'
  | 'game_providers_v1'
  | 'game_providers_v2'
  // Agent Config
  | 'agent_generic_numbers'
  | 'agent_payment_methods'
  // Affiliate System
  | 'affiliate_settings'
  | 'affiliate_list'
  | 'affiliate_commissions'
  // Site Config
  | 'site_general'
  | 'site_sms_email'
  | 'site_database'
  | 'site_wallet_config'
  | 'site_app_banners'
  | 'site_casino_banners'
  | 'site_interstitial_ads'
  | 'site_social_media'
  // Support
  | 'support';

export interface VIPTier {
  id: string;
  level: number;
  name: string;
  minDeposit: number;
  cashbackPercent: number;
  weeklyBonus: number;
  monthlyBonus: number;
  color: string;
  badge: string;
  perks: string[];
  active: boolean;
}

export interface WheelSlice {
  id: string;
  label: string;
  rewardType: 'cash' | 'coins' | 'diamonds' | 'empty' | 'jackpot';
  amount: number;
  probability: number; // percentage e.g. 15%
  color: string;
  textColor: string;
}

export interface AgentUser {
  id: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  balance: number;
  commissionRate: number; // e.g. 2.5%
  totalCashIn: number;
  totalCashOut: number;
  status: 'active' | 'suspended';
  lastActive: string;
}

export interface DepositLevel {
  id: string;
  level: number;
  title: string;
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  instantApproval: boolean;
  bonusPercent: number;
}

export interface RolePermission {
  id: string;
  roleName: string;
  description: string;
  permissions: {
    canManageFinance: boolean;
    canManageUsers: boolean;
    canManageGames: boolean;
    canManageAgents: boolean;
    canManageAffiliates: boolean;
    canManageSiteConfig: boolean;
    canManageSupport: boolean;
  };
  usersCount: number;
}

export interface AdminAccount {
  id: string;
  username: string;
  name: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  ipAddress: string;
  twoFactorEnabled: boolean;
}

export interface GameItem {
  id: string;
  version: 'v1' | 'v2';
  title: string;
  category: string;
  provider: string;
  type: '2 Player' | '4 Player' | 'Tournament' | 'Team' | 'Speed';
  minBet: number;
  maxBet: number;
  commissionPercent: number;
  status: 'online' | 'maintenance' | 'offline';
  playersOnline: number;
  icon: string;
}

export interface GameErrorLog {
  id: string;
  gameId: string;
  gameName: string;
  roomCode: string;
  userId: string;
  userName: string;
  userPhone: string;
  errorCode: string;
  errorDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  status: 'pending' | 'resolved' | 'refunded';
  refundAmount?: number;
}

export interface GameCategory {
  id: string;
  name: string;
  nameBn: string;
  code?: string;
  icon: string;
  order: number;
  gamesCount: number;
  active: boolean;
  commissionPercent?: number;
  minBet?: number;
  maxBet?: number;
  playersCount?: number;
}

export interface GameProvider {
  id: string;
  name: string;
  version: 'v1' | 'v2';
  type: 'Internal Engine' | 'Cloud Cluster' | 'Relay Server' | 'Third Party API';
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs: number;
  uptime: string;
  activeMatches: number;
  endpoint: string;
}

export interface AgentGenericNumber {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  type: 'Agent' | 'Personal' | 'Merchant';
  number: string;
  instructions: string;
  minAmount: number;
  maxAmount: number;
  active: boolean;
}

export interface AffiliatePartner {
  id: string;
  userId: string;
  name: string;
  phone: string;
  code: string;
  totalReferrals: number;
  activeDepositors: number;
  totalEarned: number;
  pendingPayout: number;
  paidPayout: number;
  status: 'active' | 'blocked';
}

export interface AffiliateCommissionRecord {
  id: string;
  affiliateId: string;
  affiliateName: string;
  referredPlayerName: string;
  event: 'registration_bonus' | 'deposit_commission' | 'wager_rebate';
  amount: number;
  date: string;
  time: string;
  status: 'paid' | 'pending';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  category: 'deposit' | 'withdraw' | 'game' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  lastReply: string;
}
