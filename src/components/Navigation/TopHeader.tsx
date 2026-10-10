import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  RotateCw,
  Plus,
  Menu,
  UserRound,
  LogIn,
  UserPlus,
  Globe,
  ChevronDown,
  Mail,
} from 'lucide-react';
import { UserProfile, ScreenType, RegionCode, REGIONS, AppSettings } from '../../types';
import { getTranslation } from '../../utils/translations';

interface TopHeaderProps {
  user: UserProfile;
  appSettings?: AppSettings;
  onNavigate: (screen: ScreenType) => void;
  onOpenMenu: () => void;
  onRefreshBalance: () => void;
  onSelectAuthMode?: (mode: 'login' | 'register') => void;
  onOpenLuckySpinner?: () => void;
  selectedRegion?: RegionCode;
  onSelectRegion?: (region: RegionCode) => void;
  onOpenMessageBox?: () => void;
  unreadMessageCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  appSettings,
  onNavigate,
  onOpenMenu,
  onRefreshBalance,
  onSelectAuthMode,
  onOpenLuckySpinner,
  selectedRegion = 'BN',
  onSelectRegion,
  onOpenMessageBox,
  unreadMessageCount = 0,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [floatingBonus, setFloatingBonus] = useState<number | null>(null);

  const prevBalanceRef = useRef(user.balance);
  const isFirstMount = useRef(true);

  const t = getTranslation(selectedRegion);
  const currentRegionInfo = REGIONS[selectedRegion] || REGIONS.BN;

  // React to balance changes safely after render
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (user.balance > prevBalanceRef.current) {
      const diff = Math.round((user.balance - prevBalanceRef.current) * 100) / 100;
      setFloatingBonus(diff);
      setIsSpinning(true);
      const spinTimer = setTimeout(() => setIsSpinning(false), 800);
      const bonusTimer = setTimeout(() => setFloatingBonus(null), 2500);
      prevBalanceRef.current = user.balance;
      return () => {
        clearTimeout(spinTimer);
        clearTimeout(bonusTimer);
      };
    }
    prevBalanceRef.current = user.balance;
  }, [user.balance]);

  const handleRefresh = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    onRefreshBalance();

    // Trigger feedback toast
    setShowToast(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 700);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      <div className="bg-[#063314]/95 backdrop-blur-md border-b border-emerald-500/40 px-2 py-2 flex items-center justify-between relative">
        {/* Toast Notification for Balance Refresh */}
        {showToast && (
          <div className="absolute top-12 right-3 z-50 bg-emerald-600/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-emerald-400/40 flex items-center gap-1.5 animate-bounce">
            <span>✓ {t.balance} Updated!</span>
          </div>
        )}

        {/* LEFT SIDE: Menu Button, Logo, Region Switcher, and Network Indicator */}
        <div className="flex items-center gap-1.5">
          <button
            id="top-hamburger-btn"
            onClick={onOpenMenu}
            className="w-8.5 h-8.5 rounded-xl bg-[#0a4d1f] hover:bg-[#0e6128] active:scale-95 border border-emerald-500/50 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
            title={t.settings}
          >
            <Menu className="w-4.5 h-4.5 text-emerald-100" />
          </button>

          {/* Website Logo & App Title: Dynamic from Admin Panel */}
          {(() => {
            const hasCustomTitle = appSettings?.appTitle !== undefined;
            // If admin explicitly set appTitle to empty string or whitespace, title is hidden and only logo is shown
            const titleText = hasCustomTitle ? appSettings.appTitle?.trim() : 'KingLudu';
            const showTitle = Boolean(titleText);
            const customLogoUrl = appSettings?.headerLogoUrl?.trim();

            // Color preset or direct style
            const colorOption = appSettings?.headerTextColor || 'gold_gradient';
            const getColorClasses = (color: string) => {
              switch (color) {
                case 'gold_gradient':
                  return 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent';
                case 'emerald_gradient':
                  return 'bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent';
                case 'cyan_gradient':
                  return 'bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent';
                case 'rose_gradient':
                  return 'bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent';
                case 'purple_gradient':
                  return 'bg-gradient-to-r from-purple-300 via-fuchsia-200 to-pink-400 bg-clip-text text-transparent';
                case 'white':
                  return 'text-white';
                case 'yellow':
                  return 'text-yellow-400';
                case 'amber':
                  return 'text-amber-400';
                case 'emerald':
                  return 'text-emerald-400';
                case 'cyan':
                  return 'text-cyan-400';
                default:
                  return color.startsWith('#') || color.startsWith('rgb')
                    ? ''
                    : 'bg-gradient-to-r from-amber-300 via-emerald-200 to-yellow-400 bg-clip-text text-transparent';
              }
            };

            const isCustomHex = colorOption.startsWith('#') || colorOption.startsWith('rgb');

            return (
              <div
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 cursor-pointer group select-none"
                title={titleText || 'KingLudu'}
              >
                {/* Logo Icon or Custom Logo Image */}
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Logo"
                    className={`${showTitle ? 'w-7 h-7 sm:w-8 sm:h-8' : 'h-8 sm:h-9 max-w-[130px] w-auto'} rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform`}
                    onError={(e) => {
                      // Fallback if image URL fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={`${showTitle ? 'p-1' : 'p-1.5'} rounded-lg bg-gradient-to-br from-amber-300 to-yellow-500 shadow-sm group-hover:rotate-6 transition-transform flex items-center justify-center`}>
                    <Crown className={`${showTitle ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-950 fill-slate-950`} />
                  </div>
                )}

                {/* If name exists, show it with chosen color; if name is blank, only logo is shown as requested */}
                {showTitle && (
                  <span
                    className={`font-black text-sm sm:text-base tracking-tight drop-shadow-sm font-sans transition-all ${getColorClasses(colorOption)}`}
                    style={isCustomHex ? { color: colorOption } : undefined}
                  >
                    {titleText}
                  </span>
                )}
              </div>
            );
          })()}

          {/* Region / Currency Quick Selector (BN / EN / IN / NP) */}
          <div className="relative">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="flex items-center gap-1 bg-[#04260f]/90 hover:bg-[#073616] border border-emerald-600/50 rounded-xl px-1.5 py-1 text-[11px] font-bold text-amber-200 shadow-inner transition-all active:scale-95 cursor-pointer"
              title={t.selectRegion}
            >
              <span className="text-sm leading-none">{currentRegionInfo.flag}</span>
              <span className="font-mono text-[10px] text-white">{currentRegionInfo.code}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {/* Region Dropdown Menu */}
            {showRegionDropdown && (
              <div className="absolute top-9 left-0 w-36 bg-[#04260f] border border-emerald-500/50 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1 backdrop-blur-md">
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300/70 px-2 py-0.5 border-b border-emerald-800/40">
                  {t.selectRegion}
                </div>
                {(Object.keys(REGIONS) as RegionCode[]).map((rCode) => {
                  const r = REGIONS[rCode];
                  const isSelected = selectedRegion === rCode;
                  return (
                    <button
                      key={`header-region-${rCode}`}
                      onClick={() => {
                        if (onSelectRegion) onSelectRegion(rCode);
                        setShowRegionDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'text-slate-200 hover:bg-emerald-900/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{r.flag}</span>
                        <span className="font-bold">{r.code}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">{r.currencySymbol}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Message Box Button (মেসেজ বক্স) */}
          <button
            id="top-header-message-box-btn"
            type="button"
            onClick={onOpenMessageBox}
            className="relative flex items-center gap-1.5 bg-[#063b17] hover:bg-[#094c1e] border border-amber-400/80 hover:border-amber-300 rounded-2xl px-2 sm:px-2.5 py-1 text-amber-300 shadow-md cursor-pointer active:scale-95 transition-all group"
            title="মেসেজ বক্স (ডিপোজিট, উইথড্র ও বোনাস নোটিফিকেশন)"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black tracking-tight hidden xs:inline">মেসেজ</span>
            {unreadMessageCount > 0 ? (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[9px] shadow animate-pulse">
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            )}
          </button>

          {user.isLoggedIn ? (
          <div className="relative">
            {/* Floating Bonus Alert when spin reward is claimed */}
            {floatingBonus && (
              <div className="absolute -bottom-7 right-0 z-50 animate-float-balance pointer-events-none whitespace-nowrap">
                <span className="bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-0.5">
                  +৳{floatingBonus.toFixed(2)}
                </span>
              </div>
            )}

            {/* Balance Pill Display with Wallet Icon & Refresh */}
            <div
              onClick={handleRefresh}
              className={`flex items-center ${
                floatingBonus ? 'bg-[#0f3b26] border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]' : 'bg-[#04260f] hover:bg-[#073616] border-amber-400 shadow-inner'
              } border rounded-2xl px-2.5 py-1 gap-1.5 cursor-pointer active:scale-95 transition-all`}
              title={t.refreshBalance}
            >
              <span className="text-amber-400 text-xs font-black">{currentRegionInfo.currencySymbol}</span>
              <span className={`font-extrabold text-xs ${floatingBonus ? 'text-emerald-300' : 'text-amber-300'} font-mono tracking-tight`}>
                {(Number(user.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>

              {/* Wallet / Refresh Icon */}
              <div className="flex items-center gap-1 pl-1 border-l border-amber-400/30">
                <RotateCw
                  className={`w-3 h-3 ${floatingBonus ? 'text-emerald-300' : 'text-amber-400'} ${isSpinning ? 'animate-spin' : ''}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Login Button (Emerald Pill) */}
            <button
              onClick={() => {
                if (onSelectAuthMode) {
                  onSelectAuthMode('login');
                } else {
                  onNavigate('login');
                }
              }}
              className="bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 border border-emerald-400/40 text-white font-bold text-xs px-2.5 py-1 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>{t.login}</span>
            </button>

            {/* Register Button (Yellow Pill) */}
            <button
              onClick={() => {
                if (onSelectAuthMode) {
                  onSelectAuthMode('register');
                } else {
                  onNavigate('login');
                }
              }}
              className="bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-yellow-400 border border-amber-200 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3 h-3" />
              <span>{t.register}</span>
            </button>
          </>
        )}
      </div>
    </div>
  </header>
  );
};

