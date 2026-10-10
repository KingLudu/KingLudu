import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Gift, Users, Headphones, Flame, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { ScreenType, AppSettings, HomeBannerConfig } from '../../types';

interface BannerSliderProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenReferModal?: () => void;
  appSettings?: AppSettings;
}

interface BannerItem {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  buttonText: string;
  bgGradient: string;
  borderColor: string;
  icon: React.ReactNode;
  action: 'navigate' | 'refer';
  targetScreen?: ScreenType;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onNavigate, onOpenReferModal, appSettings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const defaultBanners: BannerItem[] = [
    {
      id: 1,
      badge: 'মেগা প্রাইজপুল',
      badgeColor: 'bg-amber-400 text-slate-950',
      title: 'মেগা লুডু টুর্নামেন্ট',
      subtitle: 'দৈনিক ৫০,০০০ টাকা মেগা প্রাইজপুল জয়ী হোন!',
      buttonText: 'অংশ নিন',
      bgGradient: 'from-amber-600 via-amber-700 to-amber-900',
      borderColor: 'border-amber-400/80',
      icon: <Trophy className="w-10 h-10 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />,
      action: 'navigate',
      targetScreen: 'matchmaking',
    },
    {
      id: 2,
      badge: 'ইনস্ট্যান্ট ক্যাশব্যাক',
      badgeColor: 'bg-emerald-400 text-slate-950',
      title: '১ মিনিটেই ব্যালেন্স রিচার্জ',
      subtitle: 'বিকাশ, নগদ ও রকেটে দ্রুততম ডিপোজিট ও বোনাস!',
      buttonText: 'ডিপোজিট করুন',
      bgGradient: 'from-emerald-600 via-teal-700 to-emerald-900',
      borderColor: 'border-emerald-400/80',
      icon: <Zap className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] fill-emerald-300" />,
      action: 'navigate',
      targetScreen: 'add_money',
    },
    {
      id: 3,
      badge: '১০০% বোনাস অফার',
      badgeColor: 'bg-emerald-400 text-slate-950',
      title: 'প্রথম ডিপোজিট বোনাস',
      subtitle: 'প্রথম ডিপোজিটে ১০০% পর্যন্ত ক্যাশব্যাক বোনাস পান!',
      buttonText: 'ডিপোজিট করুন',
      bgGradient: 'from-emerald-700 via-teal-800 to-emerald-950',
      borderColor: 'border-emerald-400/80',
      icon: <Gift className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />,
      action: 'navigate',
      targetScreen: 'add_money',
    },
    {
      id: 4,
      badge: 'আনলিমিটেড ইনকাম',
      badgeColor: 'bg-rose-400 text-slate-950',
      title: 'রেফার করুন ও আয় করুন',
      subtitle: 'বন্ধুকে ইনভাইট করে প্রতিটি রেফারে বোনাস ক্যাশ জিতুন!',
      buttonText: 'রেফার লিংক নিন',
      bgGradient: 'from-rose-600 via-pink-700 to-rose-950',
      borderColor: 'border-rose-400/80',
      icon: <Users className="w-10 h-10 text-rose-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]" />,
      action: 'refer',
      targetScreen: 'home',
    },
    {
      id: 5,
      badge: '২৪/৭ সাপোর্ট',
      badgeColor: 'bg-cyan-400 text-slate-950',
      title: '২৪ ঘণ্টা লাইভ হেল্পলাইন',
      subtitle: 'যেকোনো সমস্যায় টেলিগ্রাম ও হোয়াটসঅ্যাপে পাশে আছি!',
      buttonText: 'সাপোর্ট পান',
      bgGradient: 'from-cyan-600 via-blue-700 to-slate-900',
      borderColor: 'border-cyan-400/80',
      icon: <Headphones className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />,
      action: 'navigate',
      targetScreen: 'support',
    },
    {
      id: 6,
      badge: 'হট ম্যাচ',
      badgeColor: 'bg-red-500 text-white',
      title: '২ প্লেয়ার ১v১ ব্যাটেল',
      subtitle: 'সরাসরি রিয়েল প্লেয়ারের সাথে দ্রুত ম্যাচ খেলুন!',
      buttonText: 'ম্যাচ খেলুন',
      bgGradient: 'from-red-600 via-rose-700 to-red-950',
      borderColor: 'border-red-400/80',
      icon: <Flame className="w-10 h-10 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.8)] fill-amber-300" />,
      action: 'navigate',
      targetScreen: 'create_match',
    },
  ];

  // Merge with appSettings if configured
  const banners: BannerItem[] = React.useMemo(() => {
    const rawList = appSettings?.bannersList;
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return defaultBanners;
    }

    const enabledList = rawList.filter((b) => b && b.enabled !== false);
    if (enabledList.length === 0) return defaultBanners;

    return enabledList.map((cfg, idx) => {
      const matchDefault = defaultBanners.find((d) => d.id === cfg.id) || defaultBanners[idx % defaultBanners.length] || defaultBanners[0];
      return {
        id: cfg.id || idx + 1,
        badge: cfg.badge || matchDefault?.badge || 'অফার',
        badgeColor: cfg.badgeColor || matchDefault?.badgeColor || 'bg-amber-400 text-slate-950',
        title: cfg.title || matchDefault?.title || 'King Ludo Offer',
        subtitle: cfg.subtitle || matchDefault?.subtitle || '',
        buttonText: cfg.buttonText || matchDefault?.buttonText || 'দেখুন',
        bgGradient: matchDefault?.bgGradient || 'from-purple-900 to-indigo-950',
        borderColor: matchDefault?.borderColor || 'border-purple-600',
        icon: matchDefault?.icon,
        action: cfg.action || matchDefault?.action,
        targetScreen: cfg.targetScreen || matchDefault?.targetScreen,
      };
    });
  }, [appSettings?.bannersList]);

  // Auto slide effect
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handleBannerClick = (banner: BannerItem) => {
    if (banner.action === 'refer') {
      if (onOpenReferModal) onOpenReferModal();
    } else if (banner.targetScreen) {
      onNavigate(banner.targetScreen);
    }
  };

  if (banners.length === 0) return null;

  return (
    <div 
      className="relative z-10 w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Outer Banner Wrapper */}
      <div className="relative overflow-hidden rounded-2xl border shadow-xl">
        {/* Slides Track - Sliding Right to Left */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, bIdx) => (
            <div
              key={`banner-slide-${banner.id}-${bIdx}`}
              className="w-full flex-shrink-0"
            >
              <div
                onClick={() => handleBannerClick(banner)}
                className={`bg-gradient-to-r ${banner.bgGradient} p-3.5 sm:p-4 rounded-2xl border ${banner.borderColor} shadow-lg relative cursor-pointer group flex items-center justify-between min-h-[110px] overflow-hidden`}
              >
                {/* Background Shimmer Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                {/* Left Text & Details */}
                <div className="relative z-10 max-w-[70%] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider ${banner.badgeColor}`}>
                      {banner.badge}
                    </span>
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-white leading-tight drop-shadow-md">
                    {banner.title}
                  </h3>

                  <p className="text-[11px] font-bold text-slate-100/90 leading-tight drop-shadow">
                    {banner.subtitle}
                  </p>

                  <div className="pt-1">
                    <button
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded-lg shadow-md group-hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>{banner.buttonText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Right Icon Graphic */}
                <div className="relative z-10 flex flex-col items-center justify-center pl-2 group-hover:scale-110 transition-transform duration-300">
                  <div className="p-2 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                    {banner.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-black/40 hover:bg-black/70 border border-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition active:scale-90"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-black/40 hover:bg-black/70 border border-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition active:scale-90"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Navigation Indicators (Dots) */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
          {banners.map((banner, idx) => (
            <button
              key={`banner-dot-${banner.id}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-4 h-1.5 bg-amber-400'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
