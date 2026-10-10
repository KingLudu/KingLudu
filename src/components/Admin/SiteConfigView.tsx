import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Settings,
  Mail,
  Database,
  Wallet,
  Image,
  Tv,
  Share2,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Gamepad2,
  Crown,
  Sparkles,
  Layers,
  Trophy,
  ExternalLink,
  Flame,
  Volume2,
  RotateCcw,
  Check,
  Lock,
  Unlock,
  Radio,
  Eye,
  Gift,
  HelpCircle,
  Headset,
  Smartphone,
  Laptop,
  Camera,
  X,
  FileImage,
} from 'lucide-react';
import { 
  AppSettings, 
  HomeGameOptionConfig, 
  DEFAULT_HOME_GAME_OPTIONS, 
  ScreenType,
  HomeBannerConfig 
} from '../../types';
import modeKingLudoImg from '../../assets/images/mode_king_ludo_1789079084574.jpg';

export type SiteConfigSubTab =
  | 'home_game_options'
  | 'site_general'
  | 'site_sms_email'
  | 'site_database'
  | 'site_wallet_config'
  | 'site_app_banners'
  | 'site_interstitial_ads'
  | 'site_social_media'
  | 'home_programs_link';

interface SiteConfigViewProps {
  subTab?: SiteConfigSubTab;
  onSubTabChange?: (tab: SiteConfigSubTab) => void;
  appSettings?: AppSettings;
  onUpdateAppSettings?: (newSettings: AppSettings) => void;
  onNavigate?: (screen: ScreenType) => void;
  onClearAllData?: () => void;
}

export const SiteConfigView: React.FC<SiteConfigViewProps> = ({
  subTab: externalSubTab,
  onSubTabChange,
  appSettings,
  onUpdateAppSettings,
  onNavigate,
  onClearAllData,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<SiteConfigSubTab>('home_game_options');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: SiteConfigSubTab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSectionNotice, setSavedSectionNotice] = useState<string | null>(null);

  // 1. Home Game Options (কিং লুডো ব্যানার/ফ্রেম কন্ট্রোল)
  const [homeGameOptions, setHomeGameOptions] = useState<HomeGameOptionConfig[]>(() => {
    if (appSettings?.homeGameOptions && appSettings.homeGameOptions.length > 0) {
      const ludo = appSettings.homeGameOptions.find((opt) => opt.id === 'kingludo');
      if (ludo) return [ludo];
    }
    return DEFAULT_HOME_GAME_OPTIONS;
  });

  // 2. General Settings
  const [siteName, setSiteName] = useState(appSettings?.marqueeNotice ? 'KingLudu - লুডো খেলুন টাকা জিতুন' : 'KingLudu - অফিশিয়াল গেমিং প্ল্যাটফর্ম');
  const [appTitle, setAppTitle] = useState(appSettings?.appTitle !== undefined ? appSettings.appTitle : 'KingLudu');
  const [headerTextColor, setHeaderTextColor] = useState(appSettings?.headerTextColor || 'gold_gradient');
  const [headerLogoUrl, setHeaderLogoUrl] = useState(appSettings?.headerLogoUrl || '');
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isLogoDragOver, setIsLogoDragOver] = useState(false);

  // Device file upload handler (মোবাইল গ্যালারি/ক্যামেরা ও কম্পিউটার ফাইল থেকে লোগো আপলোড)
  const handleLogoFileUpload = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, WEBP, SVG ইত্যাদি) নির্বাচন করুন।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('ছবির সাইজ ১০MB এর বেশি হতে পারবে না। অনুগ্রহ করে ছোট সাইজের ছবি আপলোড করুন।');
      return;
    }

    setLogoUploadLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      if (!rawData) {
        setLogoUploadLoading(false);
        return;
      }

      // If SVG or very lightweight image (< 120KB), store directly
      if (file.type.includes('svg') || file.size < 120 * 1024) {
        setHeaderLogoUrl(rawData);
        setLogoUploadLoading(false);
        return;
      }

      // Automatically optimize raster images with canvas (max 512px dimension)
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDim = 512;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const isPng = file.type.includes('png') || file.type.includes('webp');
            const optimized = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.92);
            setHeaderLogoUrl(optimized);
          } else {
            setHeaderLogoUrl(rawData);
          }
        } catch {
          setHeaderLogoUrl(rawData);
        } finally {
          setLogoUploadLoading(false);
        }
      };
      img.onerror = () => {
        setHeaderLogoUrl(rawData);
        setLogoUploadLoading(false);
      };
      img.src = rawData;
    };
    reader.onerror = () => {
      setLogoUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };
  const [supportPhone, setSupportPhone] = useState(appSettings?.supportWhatsApp || '+8801700000000');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(appSettings?.isMaintenanceMode || false);
  const [welcomeBonusCoins, setWelcomeBonusCoins] = useState(100);

  // 3. SMS & Email
  const [smsGateway, setSmsGateway] = useState('greenweb');
  const [smsApiKey, setSmsApiKey] = useState('GW_LIVE_99812938120');
  const [smsSenderId, setSmsSenderId] = useState('KINGLUDU');

  // 4. Wallet Config
  const [minDeposit, setMinDeposit] = useState(appSettings?.minDeposit ?? 50);
  const [maxDeposit, setMaxDeposit] = useState(25000);
  const [minWithdraw, setMinWithdraw] = useState(appSettings?.minWithdrawal ?? 100);
  const [maxWithdraw, setMaxWithdraw] = useState(15000);
  const [minMatchFee, setMinMatchFee] = useState(appSettings?.minMatchFee ?? 10);
  const [platformCommission, setPlatformCommission] = useState(
    appSettings?.platformCommissionPercent !== undefined
      ? Math.min(20, Math.max(5, appSettings.platformCommissionPercent))
      : 10
  );
  const [playerWinRate, setPlayerWinRate] = useState<number>(
    appSettings?.playerWinRatePercent ?? 45
  );
  const [paymentAccountTitles, setPaymentAccountTitles] = useState<Record<string, string>>(() => ({
    bKash: appSettings?.paymentAccountTitles?.bKash || 'Official bKash Personal/Agent Account',
    Nagad: appSettings?.paymentAccountTitles?.Nagad || 'Official Nagad Personal/Agent Account',
    Rocket: appSettings?.paymentAccountTitles?.Rocket || 'Official Rocket Personal/Agent Account',
    Upay: appSettings?.paymentAccountTitles?.Upay || 'Official Upay Personal/Agent Account',
    BinancePay: appSettings?.paymentAccountTitles?.BinancePay || 'Official Binance Pay ID',
    Cryptocurrency: appSettings?.paymentAccountTitles?.Cryptocurrency || 'Official USDT TRC20/BEP20 Address',
  }));

  // 5. App Banners
  const [banners, setBanners] = useState<HomeBannerConfig[]>(() => {
    if (appSettings?.bannersList && appSettings.bannersList.length > 0) {
      return appSettings.bannersList;
    }
    return [
      { id: 1, title: 'মেগা লুডু টুর্নামেন্ট রেজিস্ট্রেশন চলছে!', subtitle: 'দৈনিক ৫০,০০০ টাকা মেগা প্রাইজপুল জয়ী হোন!', badge: 'মেগা প্রাইজপুল', buttonText: 'অংশ নিন', targetScreen: 'matchmaking', action: 'navigate', enabled: true },
      { id: 2, title: 'বিকাশ ও নগদে ইনস্ট্যান্ট ক্যাশব্যাক অফার', subtitle: 'বিকাশ ও নগদে ইনস্ট্যান্ট ক্যাশআউট সুবিধা!', badge: 'ইনস্ট্যান্ট ক্যাশআউট', buttonText: 'উইথড্র করুন', targetScreen: 'withdraw', action: 'navigate', enabled: true },
    ];
  });

  // 6. Marquee & Social
  const [marqueeNotice, setMarqueeNotice] = useState(appSettings?.marqueeNotice || '🔥 অফিশিয়াল লুডু কিং প্ল্যাটফর্মে স্বাগতম! বিকাশ ও নগদে ডিপোজিট করে ১v১ ও ৪v৪ লুডু খেলুন এবং সাথে সাথে উইথড্র করুন।');
  const [showMarqueeNotice, setShowMarqueeNotice] = useState(appSettings?.showMarqueeNotice !== false);
  const [showBanners, setShowBanners] = useState(appSettings?.showBanners !== false);

  // 7. Home Programs Toggles (অন্যান্য হোম অপশনস)
  const [showQuickDepositWithdraw, setShowQuickDepositWithdraw] = useState(appSettings?.showQuickDepositWithdraw !== false);
  const [showQuickDeposit, setShowQuickDeposit] = useState(appSettings?.showQuickDeposit !== false);
  const [quickDepositTitle, setQuickDepositTitle] = useState(appSettings?.quickDepositTitle || 'ডিপোজিট');
  const [quickDepositSubtitle, setQuickDepositSubtitle] = useState(appSettings?.quickDepositSubtitle || 'টাকা যোগ করুন');
  const [quickDepositBadge, setQuickDepositBadge] = useState(appSettings?.quickDepositBadge || 'ইনস্ট্যান্ট অ্যাড মানি');

  const [marqueeNoticeBadge, setMarqueeNoticeBadge] = useState(appSettings?.marqueeNoticeBadge || 'নোটিশ');

  const [gameLobbyTitle, setGameLobbyTitle] = useState(appSettings?.gameLobbyTitle || 'গেম নির্বাচন করুন');
  const [gameLobbySubtitle, setGameLobbySubtitle] = useState(appSettings?.gameLobbySubtitle || '(GAME LOBBY)');
  const [gameLobbyDescription, setGameLobbyDescription] = useState(appSettings?.gameLobbyDescription || 'আপনার পছন্দের গেম ক্যাটাগরি বেছে নিন');
  const [gameLobbyBadge, setGameLobbyBadge] = useState(appSettings?.gameLobbyBadge || 'রিয়েল ক্যাশ');

  const [showLuckySpinner, setShowLuckySpinner] = useState(appSettings?.showLuckySpinner !== false);
  const [luckySpinnerTitle, setLuckySpinnerTitle] = useState(appSettings?.luckySpinnerTitle || 'লাকি স্পিন অ্যান্ড উইন (Lucky Spin)');
  const [luckySpinnerBadge, setLuckySpinnerBadge] = useState(appSettings?.luckySpinnerBadge || 'ফ্রি স্পিন');
  const [luckySpinnerSubtitle, setLuckySpinnerSubtitle] = useState(appSettings?.luckySpinnerSubtitle || 'দৈনিক লাকি চাকা ঘুরিয়ে জিতে নিন ক্যাশ রিওয়ার্ড ও আকর্ষণীয় মেগা প্রাইজ!');
  const [luckySpinnerButtonText, setLuckySpinnerButtonText] = useState(appSettings?.luckySpinnerButtonText || 'স্পিন করুন');

  const [showDailyRewardCard, setShowDailyRewardCard] = useState(appSettings?.showDailyRewardCard !== false);
  const [enable2PlayerMode, setEnable2PlayerMode] = useState(appSettings?.enable2PlayerMode !== false);
  const [enable4PlayerMode, setEnable4PlayerMode] = useState(appSettings?.enable4PlayerMode !== false);
  const [enablePrivateRoomMode, setEnablePrivateRoomMode] = useState(appSettings?.enablePrivateRoomMode !== false);
  const [enableTournamentMode, setEnableTournamentMode] = useState(appSettings?.enableTournamentMode !== false);
  const [showLatestWinnersTicker, setShowLatestWinnersTicker] = useState(appSettings?.showLatestWinnersTicker !== false);

  const [showReferEarnBanner, setShowReferEarnBanner] = useState(appSettings?.showReferEarnBanner !== false);
  const [referEarnTitle, setReferEarnTitle] = useState(appSettings?.referEarnTitle || 'রেফার ও ইনভাইট বোনাস');
  const [referBannerPromoText, setReferBannerPromoText] = useState(appSettings?.referBannerPromoText || 'বন্ধুদের ইনভাইট করে পেয়ে যান ৳১০০ ইনস্ট্যান্ট বোনাস!');
  const [referEarnButtonText, setReferEarnButtonText] = useState(appSettings?.referEarnButtonText || 'রেফার করুন');

  const [showLiveChatBanner, setShowLiveChatBanner] = useState(appSettings?.showLiveChatBanner !== false);
  const [liveChatTitle, setLiveChatTitle] = useState(appSettings?.liveChatTitle || '২৪/৭ লাইভ হেল্পলাইন ও সাপোর্ট');
  const [liveChatTagline, setLiveChatTagline] = useState(appSettings?.liveChatTagline || 'যেকোনো সমস্যায় সরাসরি এজেন্টের সাথে কথা বলুন');
  const [liveChatButtonText, setLiveChatButtonText] = useState(appSettings?.liveChatButtonText || 'সাপোর্ট চ্যাট');

  const [aboutCardTitle, setAboutCardTitle] = useState(appSettings?.aboutCardTitle || 'আমাদের সম্পর্কে (About King Ludo)');
  const [aboutCardSubtitle, setAboutCardSubtitle] = useState(appSettings?.aboutCardSubtitle || 'Official');
  const [aboutCardDesc, setAboutCardDesc] = useState(appSettings?.aboutCardDesc || 'প্ল্যাটফর্মের নিয়মাবলী, সিকিউরিটি, ফেয়ার-প্লে ও পেমেন্ট পলিসি বিস্তারিত জানুন');

  const [socialLinks, setSocialLinks] = useState({
    telegram: appSettings?.supportTelegram || 'https://t.me/kingludu_official',
    whatsapp: appSettings?.supportWhatsApp || '+8801700000000',
    youtube: 'https://youtube.com/@kingludubd',
    facebook: 'https://facebook.com/kingludubd',
  });

  // Keep state synced if appSettings changes from outside
  useEffect(() => {
    if (appSettings) {
      if (appSettings.homeGameOptions && appSettings.homeGameOptions.length === 4) {
        setHomeGameOptions(appSettings.homeGameOptions);
      }
      if (appSettings.minDeposit !== undefined) setMinDeposit(appSettings.minDeposit);
      if (appSettings.minWithdrawal !== undefined) setMinWithdraw(appSettings.minWithdrawal);
      if (appSettings.platformCommissionPercent !== undefined) {
        setPlatformCommission(Math.min(20, Math.max(5, appSettings.platformCommissionPercent)));
      }
      if (appSettings.playerWinRatePercent !== undefined) {
        setPlayerWinRate(Math.min(90, Math.max(10, appSettings.playerWinRatePercent)));
      }
      if (appSettings.paymentAccountTitles) {
        setPaymentAccountTitles((prev) => ({
          ...prev,
          ...appSettings.paymentAccountTitles,
        }));
      }
      if (appSettings.marqueeNotice) setMarqueeNotice(appSettings.marqueeNotice);
      if (appSettings.showMarqueeNotice !== undefined) setShowMarqueeNotice(appSettings.showMarqueeNotice);
      if (appSettings.marqueeNoticeBadge) setMarqueeNoticeBadge(appSettings.marqueeNoticeBadge);
      if (appSettings.showBanners !== undefined) setShowBanners(appSettings.showBanners);
      if (appSettings.bannersList && appSettings.bannersList.length > 0) setBanners(appSettings.bannersList);
      if (appSettings.showQuickDepositWithdraw !== undefined) setShowQuickDepositWithdraw(appSettings.showQuickDepositWithdraw);
      if (appSettings.showQuickDeposit !== undefined) setShowQuickDeposit(appSettings.showQuickDeposit);
      if (appSettings.quickDepositTitle) setQuickDepositTitle(appSettings.quickDepositTitle);
      if (appSettings.quickDepositSubtitle) setQuickDepositSubtitle(appSettings.quickDepositSubtitle);
      if (appSettings.quickDepositBadge) setQuickDepositBadge(appSettings.quickDepositBadge);
      if (appSettings.gameLobbyTitle) setGameLobbyTitle(appSettings.gameLobbyTitle);
      if (appSettings.gameLobbySubtitle) setGameLobbySubtitle(appSettings.gameLobbySubtitle);
      if (appSettings.gameLobbyDescription) setGameLobbyDescription(appSettings.gameLobbyDescription);
      if (appSettings.gameLobbyBadge) setGameLobbyBadge(appSettings.gameLobbyBadge);
      if (appSettings.showLuckySpinner !== undefined) setShowLuckySpinner(appSettings.showLuckySpinner);
      if (appSettings.luckySpinnerTitle) setLuckySpinnerTitle(appSettings.luckySpinnerTitle);
      if (appSettings.luckySpinnerBadge) setLuckySpinnerBadge(appSettings.luckySpinnerBadge);
      if (appSettings.luckySpinnerSubtitle) setLuckySpinnerSubtitle(appSettings.luckySpinnerSubtitle);
      if (appSettings.luckySpinnerButtonText) setLuckySpinnerButtonText(appSettings.luckySpinnerButtonText);
      if (appSettings.showDailyRewardCard !== undefined) setShowDailyRewardCard(appSettings.showDailyRewardCard);
      if (appSettings.enable2PlayerMode !== undefined) setEnable2PlayerMode(appSettings.enable2PlayerMode);
      if (appSettings.enable4PlayerMode !== undefined) setEnable4PlayerMode(appSettings.enable4PlayerMode);
      if (appSettings.enablePrivateRoomMode !== undefined) setEnablePrivateRoomMode(appSettings.enablePrivateRoomMode);
      if (appSettings.enableTournamentMode !== undefined) setEnableTournamentMode(appSettings.enableTournamentMode);
      if (appSettings.showLatestWinnersTicker !== undefined) setShowLatestWinnersTicker(appSettings.showLatestWinnersTicker);
      if (appSettings.showReferEarnBanner !== undefined) setShowReferEarnBanner(appSettings.showReferEarnBanner);
      if (appSettings.referEarnTitle) setReferEarnTitle(appSettings.referEarnTitle);
      if (appSettings.referBannerPromoText) setReferBannerPromoText(appSettings.referBannerPromoText);
      if (appSettings.referEarnButtonText) setReferEarnButtonText(appSettings.referEarnButtonText);
      if (appSettings.showLiveChatBanner !== undefined) setShowLiveChatBanner(appSettings.showLiveChatBanner);
      if (appSettings.liveChatTitle) setLiveChatTitle(appSettings.liveChatTitle);
      if (appSettings.liveChatTagline) setLiveChatTagline(appSettings.liveChatTagline);
      if (appSettings.liveChatButtonText) setLiveChatButtonText(appSettings.liveChatButtonText);
      if (appSettings.aboutCardTitle) setAboutCardTitle(appSettings.aboutCardTitle);
      if (appSettings.aboutCardSubtitle) setAboutCardSubtitle(appSettings.aboutCardSubtitle);
      if (appSettings.aboutCardDesc) setAboutCardDesc(appSettings.aboutCardDesc);
      if (appSettings.minMatchFee !== undefined) setMinMatchFee(appSettings.minMatchFee);
      if (appSettings.appTitle !== undefined) setAppTitle(appSettings.appTitle);
      if (appSettings.headerTextColor !== undefined) setHeaderTextColor(appSettings.headerTextColor);
      if (appSettings.headerLogoUrl !== undefined) setHeaderLogoUrl(appSettings.headerLogoUrl);
    }
  }, [appSettings]);

  // Master Save Handler
  const handleSaveAll = (customNotice?: string) => {
    const updatedSettings: AppSettings = {
      ...(appSettings || {
        bkashNumber: '01700-112233',
        nagadNumber: '01800-445566',
        rocketNumber: '01900-778899-1',
        upayNumber: '01600-990011',
        referralBonus: 100,
        supportTelegram: socialLinks.telegram,
        supportWhatsApp: socialLinks.whatsapp,
        botDifficulty: 'Normal',
        companyWinRatePercent: 90,
      }),
      homeGameOptions: homeGameOptions.map((g, idx) =>
        idx === 0 ? { ...g, minBet: minMatchFee } : g
      ),
      minDeposit: minDeposit,
      minWithdrawal: minWithdraw,
      minMatchFee: minMatchFee,
      platformCommissionPercent: Math.min(20, Math.max(5, platformCommission)),
      playerWinRatePercent: Math.min(90, Math.max(10, playerWinRate)),
      companyWinRatePercent: 100 - Math.min(90, Math.max(10, playerWinRate)),
      paymentAccountTitles: paymentAccountTitles,
      marqueeNotice: marqueeNotice,
      showMarqueeNotice: showMarqueeNotice,
      marqueeNoticeBadge: marqueeNoticeBadge,
      showBanners: showBanners,
      bannersList: banners,
      showQuickDepositWithdraw: showQuickDepositWithdraw,
      showQuickDeposit: showQuickDeposit,
      quickDepositTitle: quickDepositTitle,
      quickDepositSubtitle: quickDepositSubtitle,
      quickDepositBadge: quickDepositBadge,
      gameLobbyTitle: gameLobbyTitle,
      gameLobbySubtitle: gameLobbySubtitle,
      gameLobbyDescription: gameLobbyDescription,
      gameLobbyBadge: gameLobbyBadge,
      showLuckySpinner: showLuckySpinner,
      luckySpinnerTitle: luckySpinnerTitle,
      luckySpinnerBadge: luckySpinnerBadge,
      luckySpinnerSubtitle: luckySpinnerSubtitle,
      luckySpinnerButtonText: luckySpinnerButtonText,
      showDailyRewardCard: showDailyRewardCard,
      enable2PlayerMode: enable2PlayerMode,
      enable4PlayerMode: enable4PlayerMode,
      enablePrivateRoomMode: enablePrivateRoomMode,
      enableTournamentMode: enableTournamentMode,
      showLatestWinnersTicker: showLatestWinnersTicker,
      showReferEarnBanner: showReferEarnBanner,
      referEarnTitle: referEarnTitle,
      referBannerPromoText: referBannerPromoText,
      referEarnButtonText: referEarnButtonText,
      showLiveChatBanner: showLiveChatBanner,
      liveChatTitle: liveChatTitle,
      liveChatTagline: liveChatTagline,
      liveChatButtonText: liveChatButtonText,
      aboutCardTitle: aboutCardTitle,
      aboutCardSubtitle: aboutCardSubtitle,
      aboutCardDesc: aboutCardDesc,
      appTitle: appTitle,
      headerTextColor: headerTextColor,
      headerLogoUrl: headerLogoUrl,
      isMaintenanceMode: isMaintenanceMode,
      supportTelegram: socialLinks.telegram,
      supportWhatsApp: socialLinks.whatsapp,
    };

    if (onUpdateAppSettings) {
      onUpdateAppSettings(updatedSettings);
    }

    try {
      localStorage.setItem('kingludo_app_settings', JSON.stringify(updatedSettings));
    } catch (e) {
      console.error(e);
    }

    setSaveSuccess(true);
    setSavedSectionNotice(customNotice || 'হোম পেজ ও সাইট কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => {
      setSaveSuccess(false);
      setSavedSectionNotice(null);
    }, 3000);
  };

  const handleUpdateGameOption = (id: string, fields: Partial<HomeGameOptionConfig>) => {
    setHomeGameOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, ...fields } : opt))
    );
  };

  const defaultArtworks: Record<string, string> = {
    kingludo: modeKingLudoImg,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner With Live Home Screen Link */}
      <div className="bg-gradient-to-r from-amber-500/25 via-purple-900/50 to-[#063314] p-4 sm:p-5 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300 shrink-0">
            <Sliders className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">হোম পেজ ও সাইট কনফিগারেশন</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>হোম পেজ লিংকড</span>
              </span>
            </div>
            <p className="text-xs text-purple-200">
              হোম স্ক্রিনের ৪টি অপশন, ব্যানার, নোটিশ, ওয়ালেট লিমিট ও সাইট সেটিংস
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 bg-purple-900/80 hover:bg-purple-800 text-amber-300 border border-amber-400/50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
              title="সরাসরি হোম পেজ খুলুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>হোম পেজ দেখুন</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সব সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedSectionNotice || 'সাইট ও হোম পেজ কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!'}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">লাইভ সিঙ্ক সম্পন্ন</span>
        </div>
      )}

      {/* Sub Navigation Bar - Tabbed interface with 2-column rounded buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <button
          type="button"
          onClick={() => handleSetSubTab('home_game_options')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'home_game_options'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-lg scale-[1.02]'
              : 'bg-[#052a12] text-amber-300 hover:bg-purple-900/60 border-amber-400/40'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>৪টি গেম অপশন</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_general')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_general'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General Settings</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_sms_email')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_sms_email'
              ? 'bg-blue-600 text-white border-blue-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>SMS & Email</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_database')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_database'
              ? 'bg-purple-600 text-white border-purple-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Update</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_wallet_config')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_wallet_config'
              ? 'bg-emerald-600 text-white border-emerald-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet Config</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_app_banners')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_app_banners'
              ? 'bg-pink-600 text-white border-pink-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>App Banners</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_interstitial_ads')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_interstitial_ads'
              ? 'bg-orange-600 text-white border-orange-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Interstitial Ads</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('site_social_media')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'site_social_media'
              ? 'bg-indigo-600 text-white border-indigo-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Media</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetSubTab('home_programs_link')}
          className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
            activeSubTab === 'home_programs_link'
              ? 'bg-rose-600 text-white border-rose-400 font-black shadow-md'
              : 'bg-[#052a12] text-purple-200 hover:bg-purple-900 border-purple-800/40'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>হোম প্রোগ্রাম ও লেখা পরিবর্তন</span>
        </button>
      </div>

      {/* ================= SUBTAB 1: KING LUDO BANNER/FRAME (কিং লুডো ব্যানার/ফ্রেম) ================= */}
      {activeSubTab === 'home_game_options' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-amber-400/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/50 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">হোম পেজ কিং লুডো ব্যানার ও ফ্রেম কন্ট্রোল</h3>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                কিং লুডো ব্যানার/ফ্রেমের টেক্সট, আর্টওয়ার্ক, ব্যাজ ও লাইভ স্ট্যাটাস পরিচালনা করুন (স্লট, ক্যাসিনো ও স্পোর্টস অপশন অপসারিত)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHomeGameOptions(DEFAULT_HOME_GAME_OPTIONS)}
                className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 border border-purple-700/50 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট ডিফল্ট</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAll('কিং লুডো ব্যানার সেটিংস সফলভাবে আপডেট করা হয়েছে!')}
                className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ করুন</span>
              </button>
            </div>
          </div>

          {/* King Ludo Single Dedicated Card */}
          <div className="space-y-4">
            {homeGameOptions.filter((opt) => opt.id === 'kingludo').map((opt) => {
              const defaultImg = defaultArtworks[opt.id] || modeKingLudoImg;
              const currentImg = opt.imageUrl?.trim() ? opt.imageUrl : defaultImg;

              return (
                <div
                  key={opt.id}
                  className={`bg-[#031e0c] rounded-2xl border p-4 space-y-4 relative overflow-hidden transition-all shadow-md ${
                    opt.enabled !== false
                      ? 'border-red-500/60 hover:border-amber-400/60'
                      : 'border-rose-900/50 opacity-75'
                  }`}
                >
                  {/* Top Bar with Number, ID and Toggle */}
                  <div className="flex items-center justify-between border-b border-purple-900/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-red-600/80 text-white font-mono text-xs font-black flex items-center justify-center border border-red-500">
                        👑
                      </span>
                      <div>
                        <span className="text-sm font-black text-white">{opt.title} ব্যানার/ফ্রেম</span>
                        <span className="text-[10px] text-amber-400 font-mono block">({opt.id} - প্রধান সক্রিয় গেম)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <span className={opt.enabled !== false ? 'text-emerald-400' : 'text-rose-400'}>
                          {opt.enabled !== false ? 'সক্রিয়' : 'সাময়িক বন্ধ'}
                        </span>
                        <input
                          type="checkbox"
                          checked={opt.enabled !== false}
                          onChange={(e) => handleUpdateGameOption(opt.id, { enabled: e.target.checked })}
                          className="w-4 h-4 accent-amber-400 cursor-pointer"
                        />
                      </label>

                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('home')}
                          className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-lg text-[10px] font-black flex items-center gap-1 transition cursor-pointer"
                          title="হোম পেজে টেস্ট করুন"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>হোম পেজ দেখুন</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Live Preview & Thumbnail */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center bg-[#052a12] p-3 rounded-xl border border-purple-800/40">
                    <div className="relative w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 border border-purple-700/60">
                      <img
                        src={currentImg}
                        alt={opt.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {opt.enabled === false && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-rose-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 w-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded shadow">
                          {opt.badge}
                        </span>
                        <span className="text-[10px] bg-black/60 text-amber-300 font-bold px-2 py-0.5 rounded border border-white/10">
                          {opt.hotBadge}
                        </span>
                        <span className="text-[10px] bg-purple-900/80 text-purple-200 font-mono px-2 py-0.5 rounded">
                          {opt.playersCount}
                        </span>
                      </div>
                      <p className="text-sm font-black text-white mt-1">{opt.title} ({opt.enTitle})</p>
                      <p className="text-xs text-purple-200">{opt.subtitle}</p>
                    </div>
                  </div>

                  {/* Editable Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">বাংলা নাম (Title):</label>
                      <input
                        type="text"
                        value={opt.title}
                        onChange={(e) => handleUpdateGameOption(opt.id, { title: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">ইংরেজি নাম (English):</label>
                      <input
                        type="text"
                        value={opt.enTitle}
                        onChange={(e) => handleUpdateGameOption(opt.id, { enTitle: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">লাইভ প্লেয়ার টেক্সট:</label>
                      <input
                        type="text"
                        value={opt.playersCount}
                        onChange={(e) => handleUpdateGameOption(opt.id, { playersCount: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-emerald-300 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">বিবরণ (Subtitle):</label>
                      <input
                        type="text"
                        value={opt.subtitle}
                        onChange={(e) => handleUpdateGameOption(opt.id, { subtitle: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">ব্যাজ ১ (Badge):</label>
                      <input
                        type="text"
                        value={opt.badge}
                        onChange={(e) => handleUpdateGameOption(opt.id, { badge: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-amber-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">হট ব্যাজ (Hot Badge):</label>
                      <input
                        type="text"
                        value={opt.hotBadge}
                        onChange={(e) => handleUpdateGameOption(opt.id, { hotBadge: e.target.value })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-amber-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">কমিশন ফি (%):</label>
                      <input
                        type="number"
                        value={opt.commissionPercent ?? 20}
                        onChange={(e) => handleUpdateGameOption(opt.id, { commissionPercent: Number(e.target.value) || 0 })}
                        className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="text-[10px] text-purple-300 font-bold block mb-0.5">কার্ডের ইমেজ ইউআরএল (Image URL):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={opt.imageUrl || ''}
                          placeholder="ফাঁকা রাখলে কিং লুডো অফিশিয়াল ব্যানার ছবি শো করবে..."
                          onChange={(e) => handleUpdateGameOption(opt.id, { imageUrl: e.target.value })}
                          className="flex-1 bg-[#052a12] border border-purple-700/60 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        />
                        {opt.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateGameOption(opt.id, { imageUrl: '' })}
                            className="px-2.5 py-1.5 bg-rose-950 text-rose-300 border border-rose-700/50 rounded-xl text-[10px] font-bold hover:bg-rose-900 transition"
                            title="ডিফল্ট ছবিতে ফিরুন"
                          >
                            রিসেট
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coming Soon Status Notice Card (Slot, Live Casino & Sports) */}
            <div className="bg-[#031e0c] rounded-2xl border-2 border-dashed border-indigo-600/40 p-4 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-900/80 border border-indigo-500/50 text-indigo-300 flex items-center justify-center font-black">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <span>Slot, Live Casino & Sports ফ্রেম স্ট্যাটাস</span>
                      <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-2 py-0.2 rounded-full">
                        Coming Soon সক্রিয়
                      </span>
                    </h4>
                    <p className="text-[11px] text-purple-300 mt-0.5">
                      ব্যবহারকারীর নির্দেশ অনুসারে স্লট, লাইভ ক্যাসিনো ও স্পোর্টস বেটিং অপশন সম্পূর্ণ ডিলিট করা হয়েছে।
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#160d3d] rounded-xl border border-indigo-800/40 text-[11px] text-purple-200">
                ✨ হোম পেজে স্লট, লাইভ ক্যাসিনো ও স্পোর্টস বেটিং এর জায়গায় শুধুমাত্র একটি মার্জিত <strong>"Coming Soon (শীঘ্রই আসছে)"</strong> ব্যানার/ফ্রেম প্রদর্শিত হচ্ছে। কোনো জুয়া বা অপ্রাসঙ্গিক গেমের অপশন রাখা হয়নি।
              </div>
            </div>
          </div>

          {/* Quick Bottom Save Banner */}
          <div className="p-3 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
            <span className="text-xs text-purple-300">
              💡 আপনি যে পরিবর্তন করবেন, সেভ করার সাথে সাথে হোম স্ক্রিনে তা কার্যকর হবে।
            </span>
            <button
              type="button"
              onClick={() => handleSaveAll('কিং লুডো ব্যানার সেটিংস সেভ করা হয়েছে!')}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: GENERAL SETTINGS ================= */}
      {activeSubTab === 'site_general' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div>
              <h3 className="text-xs font-black text-white">অ্যাপ ও প্ল্যাটফর্মের সাধারণ সেটিংস</h3>
              <p className="text-[11px] text-purple-300">সাইটের নাম, অফিসিয়াল হটলাইন ও রক্ষণাবেক্ষণ মোড</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAll('জেনারেল সেটিংস সফলভাবে সেভ করা হয়েছে!')}
              className="px-3.5 py-1.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          {/* Header Branding Control (নাম, কালার ও লোগো পরিবর্তন) */}
          <div className="bg-[#031e0c] p-4 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👑</span>
                <div>
                  <h4 className="text-xs font-black text-amber-300">হেডার ব্র্যান্ডিং: অ্যাপের নাম, কালার ও লোগো সেটিংস</h4>
                  <p className="text-[11px] text-emerald-200/80">নাম পরিবর্তন করুন অথবা নাম ফাঁকা রেখে শুধু লোগো শো করান</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                Top Header Branding
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="bg-[#063314] p-3 rounded-xl border border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">হেডার লাইভ প্রিভিউ:</span>
                <div className="flex items-center gap-2 bg-[#04240d] px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow-inner">
                  {/* TopHeader Hamburger Menu representation */}
                  <div className="w-5 h-5 rounded bg-emerald-950 border border-emerald-600/40 flex flex-col justify-center items-center gap-0.5">
                    <span className="w-2.5 h-0.5 bg-emerald-300 rounded-full" />
                    <span className="w-2.5 h-0.5 bg-emerald-300 rounded-full" />
                    <span className="w-2.5 h-0.5 bg-emerald-300 rounded-full" />
                  </div>

                  {headerLogoUrl?.trim() ? (
                    <img
                      src={headerLogoUrl.trim()}
                      alt="Logo Preview"
                      className={`${appTitle?.trim() ? 'w-6 h-6' : 'h-7 max-w-[110px] w-auto'} rounded-md object-contain`}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-1 rounded-md bg-gradient-to-br from-amber-300 to-yellow-500 shadow-sm flex items-center justify-center">
                      <span className="text-xs leading-none">👑</span>
                    </div>
                  )}
                  {appTitle?.trim() ? (
                    <span
                      className={`font-black text-sm tracking-tight ${
                        headerTextColor === 'gold_gradient'
                          ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent'
                          : headerTextColor === 'emerald_gradient'
                          ? 'bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent'
                          : headerTextColor === 'cyan_gradient'
                          ? 'bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent'
                          : headerTextColor === 'rose_gradient'
                          ? 'bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent'
                          : headerTextColor === 'purple_gradient'
                          ? 'bg-gradient-to-r from-purple-300 via-fuchsia-200 to-pink-400 bg-clip-text text-transparent'
                          : headerTextColor === 'white'
                          ? 'text-white'
                          : headerTextColor === 'yellow'
                          ? 'text-yellow-400'
                          : headerTextColor === 'amber'
                          ? 'text-amber-400'
                          : headerTextColor === 'emerald'
                          ? 'text-emerald-400'
                          : headerTextColor === 'cyan'
                          ? 'text-cyan-400'
                          : 'text-white'
                      }`}
                      style={
                        headerTextColor.startsWith('#') || headerTextColor.startsWith('rgb')
                          ? { color: headerTextColor }
                          : undefined
                      }
                    >
                      {appTitle.trim()}
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300/80 font-bold italic">(শুধুমাত্র লোগো প্রদর্শিত হবে)</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono">স্বয়ংক্রিয়ভাবে হেডারে সিঙ্ক হবে</span>
            </div>

            {/* Custom Logo Upload Section (ফোন বা কম্পিউটার থেকে সরাসরি আপলোড) */}
            <div className="bg-[#04240d] p-3.5 rounded-xl border border-emerald-600/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-amber-300 font-bold block text-xs">
                      কাস্টম লোগো (ফোন বা কম্পিউটার থেকে যুক্ত করুন)
                    </label>
                    <p className="text-[11px] text-emerald-200/80">
                      আপনার ফোন গ্যালারি/ক্যামেরা অথবা কম্পিউটার ফাইল থেকে নিজস্ব লোগো ছবি আপলোড করুন
                    </p>
                  </div>
                </div>
                {headerLogoUrl?.trim() ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/50">
                    <Check className="w-3 h-3 text-emerald-400" /> কাস্টম লোগো সক্রিয়
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                    👑 ডিফল্ট ক্রাউন লোগো
                  </span>
                )}
              </div>

              {/* Hidden File Input for Phone/Computer */}
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleLogoFileUpload(file);
                  }
                  e.target.value = '';
                }}
              />

              {/* Upload Action & Current Logo Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Upload Dropzone / Button */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsLogoDragOver(true);
                  }}
                  onDragLeave={() => setIsLogoDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsLogoDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleLogoFileUpload(file);
                  }}
                  onClick={() => logoFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isLogoDragOver
                      ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                      : 'border-emerald-600/60 bg-[#021708] hover:border-amber-400/80 hover:bg-[#03220c]'
                  }`}
                >
                  {logoUploadLoading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                      <span className="text-xs text-amber-200 font-bold">লোগো অপটিমাইজ করা হচ্ছে...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Smartphone className="w-5 h-5 text-amber-400" />
                        <Laptop className="w-5 h-5 text-cyan-400" />
                        <Camera className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-300">
                          📱 ফোন বা 💻 কম্পিউটার থেকে লোগো বেছে নিন
                        </p>
                        <p className="text-[10px] text-emerald-200/70 mt-0.5">
                          ক্লিক করুন অথবা ছবি টেনে আনুন (PNG, JPG, WEBP, SVG)
                        </p>
                      </div>
                      <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all">
                        <Upload className="w-3.5 h-3.5" /> ফাইল নির্বাচন করুন
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Active Logo Status & Actions */}
                <div className="bg-[#021708] border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-2">
                      বর্তমান সক্রিয় লোগো:
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center p-1.5 shadow-inner overflow-hidden relative">
                        {headerLogoUrl?.trim() ? (
                          <img
                            src={headerLogoUrl.trim()}
                            alt="Uploaded Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center">
                            <Crown className="w-7 h-7 text-slate-950 fill-slate-950" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        {headerLogoUrl?.trim() ? (
                          <>
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              <span className="text-emerald-400 font-black">✓ কাস্টম লোগো</span>
                            </div>
                            <p className="text-[10px] text-emerald-200/70">
                              আপনার নিজস্ব ছবি হেডারে প্রদর্শিত হচ্ছে
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                              <span>কিং লুডো গোল্ডেন ক্রাউন</span>
                            </div>
                            <p className="text-[10px] text-emerald-200/70">
                              ডিফল্ট প্ল্যাটফর্ম লোগো সক্রিয় রয়েছে
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/40 mt-2">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/50 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> অন্য ছবি দিন
                    </button>
                    {headerLogoUrl?.trim() && (
                      <button
                        type="button"
                        onClick={() => setHeaderLogoUrl('')}
                        className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl text-[11px] font-bold transition cursor-pointer"
                        title="কাস্টম লোগো সরিয়ে ডিফল্ট ক্রাউন লোগো ফিরিয়ে নিন"
                      >
                        <Trash2 className="w-3 h-3" /> রিমুভ (ডিফল্ট)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Direct URL input */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-emerald-300 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <span>{showUrlInput ? '▼' : '►'} অথবা সরাসরি ওয়েব ইমেজ লিঙ্ক (URL) দিতে চান?</span>
                </button>

                {showUrlInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={headerLogoUrl}
                      placeholder="যেমন: https://... লোগোর ডাইরেক্ট ইমেজ লিংক"
                      onChange={(e) => setHeaderLogoUrl(e.target.value)}
                      className="flex-1 bg-[#052a12] border border-emerald-600/60 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                    {headerLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setHeaderLogoUrl('')}
                        className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/50 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        রিসেট
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* App Title & Color Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-amber-300 font-bold block mb-1">
                  অ্যাপের নাম (App Title):
                  <span className="text-[10px] text-emerald-300 font-normal ml-1">
                    (নাম না লিখলে/ফাঁকা রাখলে এখানে শুধু লোগো বসবে)
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appTitle}
                    placeholder="যেমন: KingLudu (ফাঁকা রাখলে শুধু লোগো শো করবে)"
                    onChange={(e) => setAppTitle(e.target.value)}
                    className="flex-1 bg-[#052a12] border border-emerald-600/60 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  {appTitle && (
                    <button
                      type="button"
                      onClick={() => setAppTitle('')}
                      className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/50 rounded-xl text-[10px] font-bold cursor-pointer"
                      title="নাম ফাঁকা করে শুধু লোগো রাখতে ক্লিক করুন"
                    >
                      শুধু লোগো
                    </button>
                  )}
                  {appTitle !== 'KingLudu' && (
                    <button
                      type="button"
                      onClick={() => setAppTitle('KingLudu')}
                      className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/50 rounded-xl text-[10px] font-bold cursor-pointer"
                      title="ডিফল্ট KingLudu নামে রিসেট করুন"
                    >
                      ডিফল্ট নাম
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-amber-300 font-bold block mb-1">
                  নামের কালার নির্বাচন (Color Presets):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'gold_gradient', label: 'সোনালী গোল্ড', previewClass: 'from-amber-300 to-yellow-400' },
                    { id: 'emerald_gradient', label: 'এমেরাল্ড গ্রিন', previewClass: 'from-emerald-300 to-teal-400' },
                    { id: 'cyan_gradient', label: 'সায়ান ব্লু', previewClass: 'from-cyan-300 to-blue-400' },
                    { id: 'white', label: 'সাদা (White)', previewClass: 'bg-white' },
                    { id: 'yellow', label: 'হলুদ (Yellow)', previewClass: 'bg-yellow-400' },
                    { id: 'rose_gradient', label: 'রোজ পিঙ্ক', previewClass: 'from-rose-400 to-amber-300' },
                  ].map((colorItem) => {
                    const isSelected = headerTextColor === colorItem.id;
                    return (
                      <button
                        key={colorItem.id}
                        type="button"
                        onClick={() => setHeaderTextColor(colorItem.id)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-white shadow-md font-black scale-102'
                            : 'bg-[#052a12] text-slate-200 border-emerald-700/40 hover:border-amber-400/50'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full border border-black/30 shrink-0 ${
                            colorItem.previewClass.startsWith('bg-')
                              ? colorItem.previewClass
                              : `bg-gradient-to-r ${colorItem.previewClass}`
                          }`}
                        />
                        <span className="truncate">{colorItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-purple-300 font-bold block mb-1">সাইট টাইটেল (Browser / Tab Title):</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">অফিসিয়াল হটলাইন ফোন:</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">সাইন-আপ ওয়েলকাম কয়েন:</label>
              <input
                type="number"
                value={welcomeBonusCoins}
                onChange={(e) => setWelcomeBonusCoins(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
              <div>
                <span className="font-bold text-white block">মেইনটেন্যান্স মোড</span>
                <span className="text-[10px] text-purple-300">চালু থাকলে প্লেয়ারদের রক্ষণাবেক্ষণ নোটিশ দেখাবে</span>
              </div>
              <input
                type="checkbox"
                checked={isMaintenanceMode}
                onChange={(e) => setIsMaintenanceMode(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 3: SMS & EMAIL ================= */}
      {activeSubTab === 'site_sms_email' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div>
              <h3 className="text-xs font-black text-white">এসএমএস ও ওটিপি গেটওয়ে কনফিগারেশন</h3>
              <p className="text-[11px] text-purple-300">Greenweb, Twilio এবং অনলাইনের এসএমএস সেটিংস</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAll('এসএমএস সেটিংস সেভ করা হয়েছে!')}
              className="px-3.5 py-1.5 bg-blue-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-purple-300 font-bold block mb-1">এসএমএস গেটওয়ে:</label>
              <select
                value={smsGateway}
                onChange={(e) => setSmsGateway(e.target.value)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
              >
                <option value="greenweb">Greenweb Bangladesh</option>
                <option value="onnorokom">Onnorokom SMS</option>
                <option value="mimsms">MiMSMS Bangladesh</option>
                <option value="twilio">Twilio Global</option>
              </select>
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">API Key / Token:</label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">Sender ID (Masking):</label>
              <input
                type="text"
                value={smsSenderId}
                onChange={(e) => setSmsSenderId(e.target.value)}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 4: DATABASE UPDATE ================= */}
      {activeSubTab === 'site_database' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="border-b border-purple-800/40 pb-3">
            <h3 className="text-xs font-black text-white">ডাটাবেজ রক্ষণাবেক্ষণ ও অল ডাটা রিসেট</h3>
            <p className="text-[11px] text-purple-300">ক্যাশ ক্লিয়ার, ফ্যাক্টরি রিসেট ও ডাটা ব্যাকআপ ডাউনলোড</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('সতর্কতা: আপনি কি সমস্ত অ্যাপ ডাটা সম্পূর্ণ মুছে ফ্যাক্টরি রিসেট করতে চান?')) {
                  if (onClearAllData) {
                    onClearAllData();
                  } else {
                    localStorage.clear();
                    window.location.reload();
                  }
                }
              }}
              className="p-3 bg-red-950/40 hover:bg-red-900/60 border border-red-600/70 rounded-xl text-left cursor-pointer transition shadow-lg"
            >
              <Trash2 className="w-4 h-4 text-red-400 mb-1" />
              <strong className="text-red-300 block">সব ডেটা ক্লিয়ার করুন</strong>
              <span className="text-[10px] text-red-200/80 leading-tight block mt-0.5">সব ইউজার, ট্রানজাকশন, হিস্ট্রি ও চ্যাট সম্পূর্ণ রিসেট হবে</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  const keysToKeep = ['kingludo_registered_users', 'kingludo_current_user', 'kingludo_user_profile'];
                  for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (k && !keysToKeep.includes(k) && (k.startsWith('kingludo_') || k.startsWith('kingludu_'))) {
                      localStorage.removeItem(k);
                    }
                  }
                } catch (e) {
                  console.error(e);
                }
                alert('সিস্টেম ক্যাশ সফলভাবে ক্লিয়ার করা হয়েছে!');
              }}
              className="p-3 bg-slate-900 hover:bg-purple-900/60 border border-purple-800/60 rounded-xl text-left cursor-pointer transition"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400 mb-1" />
              <strong className="text-white block">ক্যাশ ক্লিয়ার করুন</strong>
              <span className="text-[10px] text-purple-300 leading-tight block mt-0.5">অ্যাপের সাময়িক ফাইল ও ক্যাশ রিসেট হবে</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const data = JSON.stringify(localStorage);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kingludo_backup_${Date.now()}.json`;
                a.click();
              }}
              className="p-3 bg-slate-900 hover:bg-purple-900/60 border border-purple-800/60 rounded-xl text-left cursor-pointer transition"
            >
              <Database className="w-4 h-4 text-emerald-400 mb-1" />
              <strong className="text-white block">ব্যাকআপ ডাউনলোড</strong>
              <span className="text-[10px] text-purple-300 leading-tight block mt-0.5">JSON ফরম্যাটে ডাটাবেজ সংরক্ষণ</span>
            </button>

            <button
              type="button"
              onClick={() => alert('টেবিল ইনডেক্সিং অপ্টিমাইজ সম্পন্ন হয়েছে!')}
              className="p-3 bg-slate-900 hover:bg-purple-900/60 border border-purple-800/60 rounded-xl text-left cursor-pointer transition"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 mb-1" />
              <strong className="text-white block">টেবিল অপ্টিমাইজেশন</strong>
              <span className="text-[10px] text-purple-300 leading-tight block mt-0.5">কোয়েরি গতি বৃদ্ধি ও সূচি সংস্কার</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 5: WALLET CONFIG ================= */}
      {activeSubTab === 'site_wallet_config' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div>
              <h3 className="text-xs font-black text-white">ওয়ালেট লিমিট ও ট্রানজাকশন চার্জ</h3>
              <p className="text-[11px] text-purple-300">ডিপোজিট ও উইথড্রর সর্বনিম্ন ও সর্বোচ্চ পরিমাণ</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAll('ওয়ালেট লিমিট সফলভাবে সেভ করা হয়েছে!')}
              className="px-3.5 py-1.5 bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-emerald-200 font-bold block mb-1">নূন্যতম ডিপোজিট (৳):</label>
              <input
                type="number"
                value={minDeposit}
                onChange={(e) => setMinDeposit(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-emerald-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-emerald-200 font-bold block mb-1">সর্বোচ্চ ডিপোজিট (৳):</label>
              <input
                type="number"
                value={maxDeposit}
                onChange={(e) => setMaxDeposit(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-emerald-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-emerald-200 font-bold block mb-1">নূন্যতম উইথড্র (৳):</label>
              <input
                type="number"
                value={minWithdraw}
                onChange={(e) => setMinWithdraw(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-emerald-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-emerald-200 font-bold block mb-1">সর্বোচ্চ উইথড্র (৳):</label>
              <input
                type="number"
                value={maxWithdraw}
                onChange={(e) => setMaxWithdraw(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-emerald-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-emerald-200 font-bold block mb-1">নূন্যতম ম্যাচ ফি (৳):</label>
              <input
                type="number"
                value={minMatchFee}
                onChange={(e) => setMinMatchFee(Number(e.target.value) || 0)}
                className="w-full bg-[#031e0c] border border-emerald-700/60 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
          </div>

          {/* Requirement 2: Platform Profit Margin (5% to 20%) */}
          <div className="bg-[#031e0c] p-3.5 rounded-2xl border border-purple-800/60 space-y-2.5 mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-emerald-300 font-black text-xs block">
                  প্ল্যাটফর্ম প্রফিট / কমিশন ফি (Platform Profit Margin 5% - 20%):
                </label>
                <span className="text-[10px] text-purple-300">
                  অ্যাডমিন প্যানেল থেকে ৫% থেকে ২০% এর মধ্যে প্রফিট নির্ধারণ করুন
                </span>
              </div>
              <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/50 font-mono shadow-sm">
                {Math.min(20, Math.max(5, platformCommission))}% প্রফিট
              </span>
            </div>

            {/* 5% to 20% Range Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-purple-400 font-mono">৫%</span>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={Math.min(20, Math.max(5, platformCommission))}
                onChange={(e) => {
                  const val = Math.min(20, Math.max(5, Number(e.target.value)));
                  setPlatformCommission(val);
                  onUpdateAppSettings({
                    ...appSettings,
                    platformCommissionPercent: val,
                  });
                }}
                className="flex-1 accent-emerald-400 h-2 bg-purple-950 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-bold text-purple-400 font-mono">২০%</span>
            </div>

            {/* Quick Preset Buttons (5% - 20%) */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[5, 8, 10, 15, 20].map((rate) => (
                <button
                  key={`config-profit-${rate}`}
                  type="button"
                  onClick={() => {
                    setPlatformCommission(rate);
                    onUpdateAppSettings({
                      ...appSettings,
                      platformCommissionPercent: rate,
                    });
                  }}
                  className={`py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                    Math.min(20, Math.max(5, platformCommission)) === rate
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-extrabold'
                      : 'bg-[#052a12] border-purple-800/50 text-purple-300 hover:text-white'
                  }`}
                >
                  {rate}% {rate === 10 ? '(ডিফল্ট)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Requirement 3: Real Player Win Rate vs Bot (Default 45%, Adjustable from Admin Panel) */}
          <div className="bg-[#031e0c] p-3.5 rounded-2xl border border-purple-800/60 space-y-2.5 mt-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-amber-300 font-black text-xs block">
                  রিয়েল প্লেয়ার উইনিং রেট বনাম বট (Real Player Win Rate vs Bot):
                </label>
                <span className="text-[10px] text-purple-300">
                  বট / কম্পিউটার বিজয়ী হবে: {100 - Math.min(90, Math.max(10, playerWinRate))}%
                </span>
              </div>
              <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/50 font-mono shadow-sm">
                {Math.min(90, Math.max(10, playerWinRate))}% রিয়েল প্লেয়ার জয়
              </span>
            </div>

            {/* Win Rate Slider (10% to 90%) */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-purple-400 font-mono">১০%</span>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={Math.min(90, Math.max(10, playerWinRate))}
                onChange={(e) => setPlayerWinRate(Number(e.target.value))}
                className="flex-1 accent-amber-400 h-2 bg-purple-950 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-bold text-purple-400 font-mono">৯০%</span>
            </div>

            {/* Quick Preset Buttons (Default 45%) */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {[20, 30, 45, 55, 65, 75].map((rate) => (
                <button
                  key={`config-winrate-${rate}`}
                  type="button"
                  onClick={() => setPlayerWinRate(rate)}
                  className={`py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                    Math.min(90, Math.max(10, playerWinRate)) === rate
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-extrabold'
                      : 'bg-[#052a12] border-purple-800/50 text-purple-300 hover:text-white'
                  }`}
                >
                  {rate}% {rate === 45 ? '(ডিফল্ট)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              কম্পিউটার/বটের বিরুদ্ধে রিয়েল প্লেয়ারের জয়ের সম্ভাবনা ডিফল্ট ৪৫% থাকে। এডমিন প্যানেল থেকে এই পারসেন্টেজ বাড়ানো বা কমানো যাবে।
            </p>
          </div>

          {/* Quick Save in Wallet Subtab */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveAll('ওয়ালেট, প্রফিট ও প্লেয়ার উইনিং রেট কনফিগারেশন সফলভাবে সেভ হয়েছে!')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস সেভ করুন (Save Settings)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 6: APP BANNERS ================= */}
      {activeSubTab === 'site_app_banners' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div>
              <h3 className="text-xs font-black text-white">হোম অ্যাপ ব্যানার্স</h3>
              <p className="text-[11px] text-purple-300">ব্যানার যোগ, সম্পাদনা ও লিংক পরিচালনা করুন</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newB: HomeBannerConfig = {
                    id: Date.now(),
                    title: 'নতুন স্পেশাল অফার ব্যানার',
                    subtitle: 'এখানে আপনার বিশেষ অফার বা টুর্নামেন্টের বিবরণ দিন',
                    badge: 'অফার',
                    buttonText: 'অংশ নিন',
                    targetScreen: 'matchmaking',
                    action: 'navigate',
                    enabled: true,
                  };
                  setBanners([...banners, newB]);
                }}
                className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ব্যানার যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAll('ব্যানারসমূহ সফলভাবে সেভ করা হয়েছে!')}
                className="px-3.5 py-1.5 bg-pink-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ করুন</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {banners.map((b) => (
              <div key={b.id} className="bg-slate-900/90 p-3 rounded-xl border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">{b.title}</span>
                  <button
                    type="button"
                    onClick={() => setBanners(banners.filter((x) => x.id !== b.id))}
                    className="text-rose-400 hover:text-rose-200 p-1 cursor-pointer"
                    title="ডিলিট"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-300">{b.subtitle}</p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-purple-900/40">
                  <span className="text-amber-300 font-bold">{b.badge}</span>
                  <span className="text-emerald-400 font-mono">Action: {b.targetScreen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 8: INTERSTITIAL ADS ================= */}
      {activeSubTab === 'site_interstitial_ads' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4 text-xs">
          <div className="border-b border-purple-800/40 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white">ইনটারস্টিশিয়াল বিজ্ঞাপন পপ-আপ</h3>
              <p className="text-purple-300">ম্যাচ জয়ের পর বা হোমপেজ ওপেন করার সময় প্রদর্শিত প্রমোশনাল পপআপ</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAll('বিজ্ঞাপন সেটিংস সেভ করা হয়েছে!')}
              className="px-3.5 py-1.5 bg-orange-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-2">
              <span className="font-bold text-white block">ম্যাচ ফিনিশ পপআপ</span>
              <label className="flex items-center gap-2 cursor-pointer text-purple-300">
                <input type="checkbox" defaultChecked className="accent-amber-400" />
                <span>ম্যাচ শেষ হলে বড় ব্যানার দেখাবে</span>
              </label>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40 space-y-2">
              <span className="font-bold text-white block">ডেইলি লগইন অফার</span>
              <label className="flex items-center gap-2 cursor-pointer text-purple-300">
                <input type="checkbox" defaultChecked className="accent-amber-400" />
                <span>প্রথমবার অ্যাপ খুললে অফার পপআপ</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 9: SOCIAL MEDIA ================= */}
      {activeSubTab === 'site_social_media' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4 text-xs">
          <div className="border-b border-purple-800/40 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white">অফিসিয়াল সোশ্যাল মিডিয়া লিংকস</h3>
              <p className="text-purple-300">টেলিগ্রাম, হোয়াটসঅ্যাপ, ফেসবুক ও ইউটিউব সাপোর্ট লিংক</p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveAll('সোশ্যাল মিডিয়া লিংকস সেভ করা হয়েছে!')}
              className="px-3.5 py-1.5 bg-indigo-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সেভ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-purple-300 font-bold block mb-1">Telegram চ্যানেল:</label>
              <input
                type="text"
                value={socialLinks.telegram}
                onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">WhatsApp হেল্পলাইন:</label>
              <input
                type="text"
                value={socialLinks.whatsapp}
                onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">YouTube চ্যানেল:</label>
              <input
                type="text"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-300 font-bold block mb-1">Facebook গ্রুপ:</label>
              <input
                type="text"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                className="w-full bg-[#031e0c] border border-purple-700/60 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 10: HOME PROGRAMS & TEXT CUSTOMIZER ================= */}
      {activeSubTab === 'home_programs_link' && (
        <div className="bg-[#052a12] p-4 sm:p-5 rounded-2xl border border-purple-800/50 space-y-4 text-xs">
          <div className="border-b border-purple-800/40 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <span>হোম পেজ প্রোগ্রামস ও টেক্সট পরিবর্তন কন্ট্রোল হাব</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                  লাইভ সিঙ্ক
                </span>
              </h3>
              <p className="text-purple-300">হোম পেজের সকল লেখা, টাইটেল, সাব-টেক্সট ও বাটন এডমিন প্যানেল থেকে পরিবর্তন করুন</p>
            </div>
            <div className="flex items-center gap-2">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1 border border-purple-700/60 shadow cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>হোম দেখুন</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSaveAll('হোম প্রোগ্রামস ও টেক্সটসমূহ সফলভাবে সেভ করা হয়েছে!')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer active:scale-95 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সব সেভ করুন</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* 1. কুইক অ্যাকশন বার - উইথড্র অপশন ডিলিট ও ডিপোজিট লেখা পরিবর্তন */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-emerald-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-300 text-xs">১. কুইক ডিপোজিট বার (উইথড্র অপশন অপসারিত)</span>
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-600/40 rounded text-[9px] font-black">
                      উইথড্র ডিলিট সম্পন্ন
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300 block mt-0.5">
                    হোম পেজ থেকে উইথড্র অপশন বাদ দেওয়া হয়েছে; শুধুমাত্র ডিপোজিট ও ব্যালেন্স রিচার্জের বাটন প্রদর্শিত হচ্ছে।
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showQuickDeposit}
                  onChange={(e) => setShowQuickDeposit(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </div>

              {showQuickDeposit && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">বাটন টাইটেল (Title):</label>
                    <input
                      type="text"
                      value={quickDepositTitle}
                      onChange={(e) => setQuickDepositTitle(e.target.value)}
                      placeholder="ডিপোজিট"
                      className="w-full bg-[#052a12] border border-emerald-600/50 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">সাব-টেক্সট (Subtitle):</label>
                    <input
                      type="text"
                      value={quickDepositSubtitle}
                      onChange={(e) => setQuickDepositSubtitle(e.target.value)}
                      placeholder="টাকা যোগ করুন ও ব্যালেন্স রিচার্জ করুন"
                      className="w-full bg-[#052a12] border border-emerald-600/50 rounded-xl px-3 py-1.5 text-emerald-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">ব্যাজ টেক্সট (Badge):</label>
                    <input
                      type="text"
                      value={quickDepositBadge}
                      onChange={(e) => setQuickDepositBadge(e.target.value)}
                      placeholder="ইনস্ট্যান্ট অ্যাড মানি"
                      className="w-full bg-[#052a12] border border-emerald-600/50 rounded-xl px-3 py-1.5 text-emerald-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Marquee Notice */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">২. লাইভ স্ক্রোলিং নোটিশ (Marquee Notice)</span>
                  <span className="text-[10px] text-purple-300">হোম স্ক্রিনের চলমান হলুদ নোটিশ বার ও ব্যাজ</span>
                </div>
                <input
                  type="checkbox"
                  checked={showMarqueeNotice}
                  onChange={(e) => setShowMarqueeNotice(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>
              {showMarqueeNotice && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">নোটিশ ব্যাজ লেবেল:</label>
                    <input
                      type="text"
                      value={marqueeNoticeBadge}
                      onChange={(e) => setMarqueeNoticeBadge(e.target.value)}
                      placeholder="নোটিশ"
                      className="w-40 bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-amber-300 text-xs font-bold"
                    />
                  </div>
                  <textarea
                    value={marqueeNotice}
                    onChange={(e) => setMarqueeNotice(e.target.value)}
                    rows={2}
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-2 text-amber-200 text-xs font-medium"
                    placeholder="হোম স্ক্রিনে প্রদর্শিত নোটিশ টেক্সট লিখুন..."
                  />
                </div>
              )}
            </div>

            {/* 3. গেম লবি শিরোনাম ও বিবরণ (Game Zone Title Header) */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-amber-500/40 space-y-2.5">
              <div>
                <span className="font-bold text-amber-300 block">৩. গেম লবি শিরোনাম ও বিবরণ (Game Lobby Header Texts)</span>
                <span className="text-[10px] text-purple-300">হোম পেজের ৪টি গেম অপশনের উপরের হেডলাইন ও ক্যাপশন</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">লবি শিরোনাম (Main Title):</label>
                  <input
                    type="text"
                    value={gameLobbyTitle}
                    onChange={(e) => setGameLobbyTitle(e.target.value)}
                    placeholder="গেম নির্বাচন করুন"
                    className="w-full bg-[#052a12] border border-amber-500/50 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">ইংলিশ সাব-ট্যাগ (English Tag):</label>
                  <input
                    type="text"
                    value={gameLobbySubtitle}
                    onChange={(e) => setGameLobbySubtitle(e.target.value)}
                    placeholder="(GAME LOBBY)"
                    className="w-full bg-[#052a12] border border-amber-500/50 rounded-xl px-3 py-1.5 text-amber-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">ক্যাপশন / বিবরণ (Description):</label>
                  <input
                    type="text"
                    value={gameLobbyDescription}
                    onChange={(e) => setGameLobbyDescription(e.target.value)}
                    placeholder="আপনার পছন্দের গেম ক্যাটাগরি বেছে নিন"
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-purple-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">ক্যাশ ব্যাজ (Right Badge):</label>
                  <input
                    type="text"
                    value={gameLobbyBadge}
                    onChange={(e) => setGameLobbyBadge(e.target.value)}
                    placeholder="রিয়েল ক্যাশ"
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-amber-400 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 4. Slider Banners */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">৪. প্রমোশনাল ব্যানার স্লাইডার (Banner Slider)</span>
                <span className="text-[10px] text-purple-300">হোম স্ক্রিনের টপ ব্যানার স্লাইডার ({banners.length}টি সক্রিয় ব্যানার)</span>
              </div>
              <input
                type="checkbox"
                checked={showBanners}
                onChange={(e) => setShowBanners(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 5. Lucky Spinner Banner & Texts */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">৫. লাকি হুইল স্পিনার ব্যানার ও লেখা (Lucky Spinner Wheel)</span>
                  <span className="text-[10px] text-purple-300">হোম পেজে প্রতিদিন ফ্রি স্পিন ও ক্যাশ প্রাইজ কার্ড</span>
                </div>
                <input
                  type="checkbox"
                  checked={showLuckySpinner}
                  onChange={(e) => setShowLuckySpinner(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>
              {showLuckySpinner && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">স্পিনার টাইটেল:</label>
                    <input
                      type="text"
                      value={luckySpinnerTitle}
                      onChange={(e) => setLuckySpinnerTitle(e.target.value)}
                      placeholder="লাকি স্পিন অ্যান্ড উইন (Lucky Spin)"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">ব্যাজ টেক্সট:</label>
                    <input
                      type="text"
                      value={luckySpinnerBadge}
                      onChange={(e) => setLuckySpinnerBadge(e.target.value)}
                      placeholder="ফ্রি স্পিন"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-amber-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">বিবরণ (Subtitle):</label>
                    <input
                      type="text"
                      value={luckySpinnerSubtitle}
                      onChange={(e) => setLuckySpinnerSubtitle(e.target.value)}
                      placeholder="দৈনিক লাকি চাকা ঘুরিয়ে জিতে নিন ক্যাশ রিওয়ার্ড ও আকর্ষণীয় মেগা প্রাইজ!"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-purple-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">বাটন টেক্সট:</label>
                    <input
                      type="text"
                      value={luckySpinnerButtonText}
                      onChange={(e) => setLuckySpinnerButtonText(e.target.value)}
                      placeholder="স্পিন করুন"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-yellow-300 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 6. Daily Check-In Card */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">৬. ডেইলি রিওয়ার্ড চেক-ইন কার্ড (Daily Check-In Bonus)</span>
                <span className="text-[10px] text-purple-300">৭ দিনের ধারাবাহিক লগইন বোনাস ও কয়েন রিওয়ার্ড</span>
              </div>
              <input
                type="checkbox"
                checked={showDailyRewardCard}
                onChange={(e) => setShowDailyRewardCard(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 7. King Ludo Game Modes Quick Grid */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-3">
              <span className="font-bold text-white block">৭. কিং লুডো গেম মোডস কুইক গ্রিড (Ludo Modes)</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center justify-between p-2.5 bg-[#052a12] rounded-lg border border-purple-800/50 cursor-pointer">
                  <span className="text-slate-200">২ প্লেয়ার মোড (1v1)</span>
                  <input
                    type="checkbox"
                    checked={enable2PlayerMode}
                    onChange={(e) => setEnable2PlayerMode(e.target.checked)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-[#052a12] rounded-lg border border-purple-800/50 cursor-pointer">
                  <span className="text-slate-200">৪ প্লেয়ার মোড (Classic)</span>
                  <input
                    type="checkbox"
                    checked={enable4PlayerMode}
                    onChange={(e) => setEnable4PlayerMode(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-[#052a12] rounded-lg border border-purple-800/50 cursor-pointer">
                  <span className="text-slate-200">প্রাইভেট রুম (Friends)</span>
                  <input
                    type="checkbox"
                    checked={enablePrivateRoomMode}
                    onChange={(e) => setEnablePrivateRoomMode(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-[#052a12] rounded-lg border border-purple-800/50 cursor-pointer">
                  <span className="text-slate-200">টুর্নামেন্ট মোড (Mega Pool)</span>
                  <input
                    type="checkbox"
                    checked={enableTournamentMode}
                    onChange={(e) => setEnableTournamentMode(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 8. Latest Winners Ticker */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">৮. সাম্প্রতিক বিজয়ী তালিকা (Latest Winners Ticker)</span>
                <span className="text-[10px] text-purple-300">রিয়েল-টাইম ম্যাচ জয়ীদের স্ক্রলিং টিকার</span>
              </div>
              <input
                type="checkbox"
                checked={showLatestWinnersTicker}
                onChange={(e) => setShowLatestWinnersTicker(e.target.checked)}
                className="w-4 h-4 accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* 9. Refer & Earn Banner & Texts */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">৯. রেফার ও ইনভাইট বোনাস ব্যানার ও লেখা (Refer & Earn)</span>
                  <span className="text-[10px] text-purple-300">হোম স্ক্রিনে রেফারেল বোনাস কার্ড ও অফার বার্তা</span>
                </div>
                <input
                  type="checkbox"
                  checked={showReferEarnBanner}
                  onChange={(e) => setShowReferEarnBanner(e.target.checked)}
                  className="w-4 h-4 accent-pink-400 cursor-pointer"
                />
              </div>
              {showReferEarnBanner && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">রেফার টাইটেল:</label>
                    <input
                      type="text"
                      value={referEarnTitle}
                      onChange={(e) => setReferEarnTitle(e.target.value)}
                      placeholder="রেফার ও ইনভাইট বোনাস"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">প্রমোশনাল বার্তা:</label>
                    <input
                      type="text"
                      value={referBannerPromoText}
                      onChange={(e) => setReferBannerPromoText(e.target.value)}
                      placeholder="বন্ধুদের ইনভাইট করে পেয়ে যান ৳১০০ ইনস্ট্যান্ট বোনাস!"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-pink-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">বাটন টেক্সট:</label>
                    <input
                      type="text"
                      value={referEarnButtonText}
                      onChange={(e) => setReferEarnButtonText(e.target.value)}
                      placeholder="রেফার করুন"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-rose-300 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 10. Live Chat Support Banner & Texts */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">১০. ২৪/৭ লাইভ চ্যাট সাপোর্ট ব্যানার ও লেখা (Live Chat Help)</span>
                  <span className="text-[10px] text-purple-300">হোম স্ক্রিনে সরাসরি সাপোর্ট হেল্পলাইন কার্ড ও ট্যাগলাইন</span>
                </div>
                <input
                  type="checkbox"
                  checked={showLiveChatBanner}
                  onChange={(e) => setShowLiveChatBanner(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
              {showLiveChatBanner && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">সাপোর্ট টাইটেল:</label>
                    <input
                      type="text"
                      value={liveChatTitle}
                      onChange={(e) => setLiveChatTitle(e.target.value)}
                      placeholder="২৪/৭ লাইভ হেল্পলাইন ও সাপোর্ট"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">সাপোর্ট ট্যাগলাইন:</label>
                    <input
                      type="text"
                      value={liveChatTagline}
                      onChange={(e) => setLiveChatTagline(e.target.value)}
                      placeholder="যেকোনো ডিপোজিট বা সমস্যায় সাথে সাথে সাপোর্ট পান"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-cyan-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-purple-300 font-bold block mb-1">বাটন টেক্সট:</label>
                    <input
                      type="text"
                      value={liveChatButtonText}
                      onChange={(e) => setLiveChatButtonText(e.target.value)}
                      placeholder="সাপোর্ট চ্যাট"
                      className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-cyan-300 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 11. About King Ludo Showcase Banner Texts */}
            <div className="p-3.5 bg-[#031e0c] rounded-xl border border-purple-800/40 space-y-2.5">
              <div>
                <span className="font-bold text-white block">১১. আমাদের সম্পর্কে ব্যানার কার্ডের লেখা (About Section)</span>
                <span className="text-[10px] text-purple-300">হোম স্ক্রিনের নিচে প্ল্যাটফর্ম পলিসি ও পরিচিতি কার্ড</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">টাইটেল (Title):</label>
                  <input
                    type="text"
                    value={aboutCardTitle}
                    onChange={(e) => setAboutCardTitle(e.target.value)}
                    placeholder="আমাদের সম্পর্কে (About King Ludo)"
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">ব্যাজ / সাবটাইটেল:</label>
                  <input
                    type="text"
                    value={aboutCardSubtitle}
                    onChange={(e) => setAboutCardSubtitle(e.target.value)}
                    placeholder="Official"
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-amber-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-purple-300 font-bold block mb-1">বিবরণ (Description):</label>
                  <input
                    type="text"
                    value={aboutCardDesc}
                    onChange={(e) => setAboutCardDesc(e.target.value)}
                    placeholder="প্ল্যাটফর্মের নিয়মাবলী, সিকিউরিটি, ফেয়ার-প্লে ও পেমেন্ট পলিসি বিস্তারিত জানুন"
                    className="w-full bg-[#052a12] border border-purple-700/60 rounded-xl px-3 py-1.5 text-purple-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
