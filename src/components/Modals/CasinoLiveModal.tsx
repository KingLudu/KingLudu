import React from 'react';
import { UserProfile, ScreenType } from '../../types';
import modeCasinoLiveImg from '../../assets/images/mode_casino_live_1789079111833.jpg';
import { ComingSoonGameModal } from './ComingSoonGameModal';
import { Video, ShieldCheck, Zap, Radio } from 'lucide-react';

interface CasinoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate?: (screen: ScreenType) => void;
  onUpdateBalance?: (newBalance: number) => void;
}

export const CasinoLiveModal: React.FC<CasinoLiveModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ComingSoonGameModal
      isOpen={isOpen}
      onClose={onClose}
      gameId="live_casino"
      title="লাইভ ক্যাসিনো"
      enTitle="LIVE CASINO"
      badge="🎲 লাইভ ডিলার"
      headline="রিয়েল ডিলার লাইভ ক্যাসিনো শীঘ্রই আসছে!"
      description="এইচডি লাইভ স্ট্রিমিং ও অভিজ্ঞ ডিলারদের সাথে রুলেট, ব্ল্যাকজ্যাক, ব্যাকারা ও তিন পাত্তি উপভোগ করতে পারবেন অতি শীঘ্রই। লাইভ ইন্টিগ্রেশন চলমান রয়েছে।"
      artwork={modeCasinoLiveImg}
      features={[
        {
          icon: Video,
          title: 'আল্ট্রা এইচডি লাইভ স্ট্রিমিং',
          desc: 'আন্তর্জাতিক ক্যাসিনো ফ্লোর থেকে সরাসরি সম্প্রচার',
        },
        {
          icon: Radio,
          title: 'রিয়েল ডিলার ও মাল্টিপ্লেয়ার টেবিল',
          desc: 'পেশাদার ডিলারদের সাথে সরাসরি চ্যাট ও ইন্টারঅ্যাকশন',
        },
        {
          icon: ShieldCheck,
          title: 'ফেয়ার প্লে ও ইনস্ট্যান্ট পেআউট',
          desc: 'আন্তর্জাতিক সার্টিফাইড ফেয়ারনেসের নিশ্চয়তা',
        },
      ]}
      theme={{
        accentGradient: 'from-emerald-400 via-teal-300 to-amber-300',
        borderColor: 'border-emerald-400/80',
        glowShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]',
        textGradient: 'from-emerald-300 via-teal-200 to-amber-300',
        badgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
        iconBg: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-purple-600',
        particleColor: 'text-emerald-400',
      }}
    />
  );
};
