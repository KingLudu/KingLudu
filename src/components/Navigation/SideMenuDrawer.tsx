import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  User,
  Wallet,
  Plus,
  ArrowUpRight,
  Play,
  History,
  Trophy,
  Gift,
  HelpCircle,
  Volume2,
  VolumeX,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Crown,
  Globe,
  Users,
  Info,
  LogIn,
  Lock,
  Disc,
  Mail,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { UserProfile, ScreenType, isAdminUser, RegionCode, REGIONS } from '../../types';
import { getTranslation } from '../../utils/translations';
import { FriendsModal } from '../Modals/FriendsModal';
import { AboutModal } from '../Modals/AboutModal';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenReferModal: () => void;
  onOpenLuckySpinner?: () => void;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  selectedRegion?: RegionCode;
  onSelectRegion?: (region: RegionCode) => void;
  onOpenMessageBox?: () => void;
  unreadMessageCount?: number;
  onClearAllData?: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  user,
  currentScreen,
  onNavigate,
  onOpenReferModal,
  onOpenLuckySpinner,
  onLogout,
  soundEnabled,
  onToggleSound,
  selectedRegion = 'BN',
  onSelectRegion,
  onOpenMessageBox,
  unreadMessageCount = 0,
  onClearAllData,
}) => {
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const t = getTranslation(selectedRegion);
  const currentRegion = REGIONS[selectedRegion] || REGIONS.BN;

  const handleItemClick = (action: () => void) => {
    onClose();
    action();
  };

  const menuGroups = [
    {
      title: t.home,
      items: [
        {
          id: 'menu-home',
          label: t.home,
          icon: <Home className="w-5 h-5 text-indigo-400" />,
          active: currentScreen === 'home',
          action: () => onNavigate('home'),
        },
        {
          id: 'menu-lucky-spinner',
          label: 'লাকি স্পিনার হুইল (Lucky Spin)',
          icon: <Disc className="w-5 h-5 text-amber-400 animate-spin-slow" />,
          badge: 'FREE SPIN',
          badgeColor: 'bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-[9px] shadow-sm',
          action: () => {
            onClose();
            if (!user.isLoggedIn) {
              onNavigate('login');
              return;
            }
            if (onOpenLuckySpinner) onOpenLuckySpinner();
          },
        },
        {
          id: 'menu-inbox',
          label: 'মেসেজ বক্স (Message Box)',
          icon: <Mail className="w-5 h-5 text-indigo-400" />,
          badge: unreadMessageCount > 0 ? `${unreadMessageCount} NEW` : undefined,
          badgeColor: 'bg-gradient-to-r from-red-500 to-rose-500 text-white font-black text-[9px] shadow-sm',
          action: () => {
            onClose();
            if (!user.isLoggedIn) {
              onNavigate('login');
              return;
            }
            if (onOpenMessageBox) onOpenMessageBox();
          },
        },
        {
          id: 'menu-friends',
          label: 'ফ্রেন্ডস ও সার্চ (Add Friends)',
          icon: <Users className="w-5 h-5 text-amber-400" />,
          badge: 'NEW',
          badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold',
          action: () => {
            if (!user.isLoggedIn) {
              onNavigate('login');
              return;
            }
            setShowFriendsModal(true);
          },
        },
        {
          id: 'menu-profile',
          label: t.profile,
          icon: user.isLoggedIn ? (
            <User className="w-5 h-5 text-purple-400" />
          ) : (
            <Lock className="w-5 h-5 text-amber-400" />
          ),
          badge: !user.isLoggedIn ? 'লগইন প্রয়োজন' : undefined,
          badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40 text-[9px] font-bold',
          active: currentScreen === 'profile',
          action: () => onNavigate('profile'),
        },
        {
          id: 'menu-wallet',
          label: t.wallet,
          icon: <Wallet className="w-5 h-5 text-emerald-400" />,
          badge: `${currentRegion.currencySymbol} ${(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          active: currentScreen === 'wallet',
          action: () => onNavigate('wallet'),
        },
      ],
    },
    ...(isAdminUser(user)
      ? [
          {
            title: t.adminPanel,
            items: [
              {
                id: 'menu-admin-panel',
                label: t.adminPanel,
                icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
                badge: 'MASTER CONTROL',
                badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-black',
                active: currentScreen === 'admin_panel',
                action: () => onNavigate('admin_panel'),
              },
            ],
          },
        ]
      : []),
    {
      title: 'গেম ক্যাটাগরি (Game Categories)',
      items: [
        {
          id: 'menu-cat-kingludo',
          label: '👑 কিং লুডো (King Ludo)',
          icon: <Crown className="w-5 h-5 text-amber-400" />,
          badge: 'লাইভ',
          badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40 text-[9px] font-black',
          action: () => onNavigate('home'),
        },
      ],
    },
    {
      title: `${t.createMatch} & ${t.joinMatch}`,
      items: [
        {
          id: 'menu-play',
          label: t.createMatch,
          icon: <Play className="w-5 h-5 text-amber-400 fill-amber-400/20" />,
          active: currentScreen === 'matchmaking',
          action: () => onNavigate('matchmaking'),
        },
        {
          id: 'menu-create',
          label: t.createMatch,
          icon: <Plus className="w-5 h-5 text-cyan-400" />,
          active: currentScreen === 'create_match',
          action: () => onNavigate('create_match'),
        },
        {
          id: 'menu-join',
          label: t.joinMatch,
          icon: <ChevronRight className="w-5 h-5 text-blue-400" />,
          active: currentScreen === 'join_match',
          action: () => onNavigate('join_match'),
        },
        {
          id: 'menu-history',
          label: t.history,
          icon: <History className="w-5 h-5 text-slate-400" />,
          active: currentScreen === 'match_history',
          action: () => onNavigate('match_history'),
        },
        {
          id: 'menu-leaderboard',
          label: t.leaderboard,
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
          active: currentScreen === 'leaderboard',
          action: () => onNavigate('leaderboard'),
        },
      ],
    },
    {
      title: `${t.deposit} & ${t.withdraw}`,
      items: [
        {
          id: 'menu-add-money',
          label: t.deposit,
          icon: <Plus className="w-5 h-5 text-emerald-400" />,
          active: currentScreen === 'add_money',
          action: () => onNavigate('add_money'),
        },
        {
          id: 'menu-withdraw',
          label: t.withdraw,
          icon: <ArrowUpRight className="w-5 h-5 text-amber-400" />,
          active: currentScreen === 'withdraw',
          action: () => onNavigate('withdraw'),
        },
      ],
    },
    {
      title: `${t.referAndEarn} & ${t.support}`,
      items: [
        {
          id: 'menu-refer',
          label: t.referAndEarn,
          icon: <Gift className="w-5 h-5 text-pink-400" />,
          badge: `${currentRegion.currencySymbol}100 Bonus`,
          badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
          action: () => {
            if (!user.isLoggedIn) {
              onNavigate('login');
              return;
            }
            onOpenReferModal();
          },
        },
        {
          id: 'menu-support',
          label: t.support,
          icon: <HelpCircle className="w-5 h-5 text-teal-400" />,
          active: currentScreen === 'support',
          action: () => onNavigate('support'),
        },
        {
          id: 'menu-about',
          label: selectedRegion === 'BN' ? 'আমাদের সম্পর্কে (About King Ludo)' : 'About King Ludo',
          icon: <Info className="w-5 h-5 text-amber-400" />,
          action: () => {
            setShowAboutModal(true);
          },
        },
      ],
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div key="side-drawer-container" className="fixed inset-0 z-50 flex justify-start">
            {/* Backdrop Blur Overlay */}
            <motion.div
              key="side-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              key="side-drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-4/5 max-w-xs h-full bg-[#04260f]/95 backdrop-blur-xl text-white border-r border-emerald-500/40 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-br from-emerald-950/90 via-[#063314] to-[#04260f] border-b border-emerald-800/40 flex items-center justify-between">
              {user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#04260f] rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1">
                      <span>{user.name || 'Ludo Player'}</span>
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </h3>
                    <p className="text-xs text-emerald-300 font-mono">{user.phone}</p>
                    <div className="mt-1 inline-flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-bold">
                      <span>{t.balance}: {currentRegion.currencySymbol}{(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">গেস্ট প্লেয়ার (Guest)</h3>
                    <p className="text-[11px] text-emerald-300/80">আইডি লগইন করা নেই</p>
                    <button
                      type="button"
                      onClick={() => handleItemClick(() => onNavigate('login'))}
                      className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow transition active:scale-95 cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>লগইন / রেজিস্টার</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
              {menuGroups.map((group, gIdx) => (
                <div key={`menu-group-${group.title}-${gIdx}`} className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/70 px-2 mb-1">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item, iIdx) => (
                      <button
                        key={`menu-item-${item.id}-${iIdx}`}
                        id={item.id}
                        onClick={() => handleItemClick(item.action)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                          item.active
                            ? 'bg-emerald-600/30 border border-emerald-500/50 text-amber-300 shadow-inner'
                            : 'hover:bg-emerald-900/30 text-slate-200 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.badgeColor || 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Settings Controls */}
              <div className="space-y-2 pt-2 border-t border-emerald-900/40">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/70 px-2 mb-1">
                  {t.selectRegion} (Language)
                </p>

                {/* Country Buttons: BN / EN / IN / NP */}
                <div className="grid grid-cols-2 gap-1.5 px-1">
                  {(Object.keys(REGIONS) as RegionCode[]).map((rCode) => {
                    const r = REGIONS[rCode];
                    const isSelected = selectedRegion === rCode;
                    return (
                      <button
                        key={`drawer-region-${rCode}`}
                        onClick={() => {
                          if (onSelectRegion) onSelectRegion(rCode);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-inner'
                            : 'bg-emerald-950/40 text-slate-300 hover:bg-emerald-900/40 hover:text-white border-emerald-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{r.flag}</span>
                          <span>{r.code}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">{r.currencySymbol}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/70 px-2 mt-3 mb-1">
                  {t.settings}
                </p>

                {/* Sound Effect Toggle */}
                <button
                  onClick={onToggleSound}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-emerald-900/30 transition-all border border-transparent"
                >
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-rose-400" />
                    )}
                    <span>{t.sound}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      soundEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer / Logout or Login */}
            <div className="p-3 bg-[#04240d] border-t border-emerald-700/40 space-y-2">
              {user.isLoggedIn ? (
                <button
                  id="menu-logout-btn"
                  onClick={() => handleItemClick(onLogout)}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>{t.logout}</span>
                </button>
              ) : (
                <button
                  id="menu-login-btn"
                  onClick={() => handleItemClick(() => onNavigate('login'))}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>আইডি লগইন বা রেজিস্টার করুন</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-purple-400/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Safe & Verified Ludo Platform</span>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Friends Modal */}
      <FriendsModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        onNavigateToRoom={() => onNavigate('create_match')}
      />

      {/* About King Ludo Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        selectedRegion={selectedRegion}
      />
    </>
  );
};
