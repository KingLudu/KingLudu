import React from 'react';
import { UserProfile, ScreenType } from '../../types';
import modeSportsBetImg from '../../assets/images/mode_sports_bet_1789079125558.jpg';
import { ComingSoonGameModal } from './ComingSoonGameModal';
import { Trophy, Flame, Zap, ShieldCheck } from 'lucide-react';

interface SportsBettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate?: (screen: ScreenType) => void;
  onUpdateBalance?: (newBalance: number) => void;
}

export const SportsBettingModal: React.FC<SportsBettingModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ComingSoonGameModal
      isOpen={isOpen}
      onClose={onClose}
      gameId="sports"
      title="স্পোর্টস বেটিং"
      enTitle="SPORTS BETTING"
      badge="🏆 স্পোর্টস জোন"
      headline="লাইভ স্পোর্টস বেটিং খুব শীঘ্রই আসছে!"
      description="আন্তর্জাতিক ক্রিকেট, ফুটবল এবং বিপিএল-আইপিএল সহ সকল জনপ্রিয় টুর্নামেন্টের লাইভ ম্যাচ প্রেডিকশন এবং সেরা অডস নিয়ে আমরা শীঘ্রই হাজির হচ্ছি।"
      artwork={modeSportsBetImg}
      features={[
        {
          icon: Trophy,
          title: 'ক্রিকেট ও ফুটবল লাইভ অডস',
          desc: 'টি-২০ বিশ্বকাপ, বিপিএল, আইপিএল ও প্রিমিয়ার লিগ কভারেজ',
        },
        {
          icon: Flame,
          title: 'বল-বাই-বল লাইভ স্কোর ও আপডেট',
          desc: 'রিয়েল-টাইম লাইভ ম্যাচ স্কোরবোর্ড ও স্ট্যাটাস ট্র্যাকিং',
        },
        {
          icon: Zap,
          title: 'ইনস্ট্যান্ট উইনিং ক্যাশআউট',
          desc: 'ম্যাচ শেষ হওয়া মাত্রই সরাসরি বিকাশ ও নগদে টাকা তোলার সুযোগ',
        },
      ]}
      theme={{
        accentGradient: 'from-amber-400 via-orange-400 to-yellow-300',
        borderColor: 'border-amber-400/80',
        glowShadow: 'shadow-[0_0_50px_rgba(245,158,11,0.45)]',
        textGradient: 'from-amber-300 via-yellow-200 to-orange-400',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black',
        iconBg: 'bg-gradient-to-br from-amber-500 via-orange-600 to-purple-700',
        particleColor: 'text-amber-400',
      }}
    />
  );
};
