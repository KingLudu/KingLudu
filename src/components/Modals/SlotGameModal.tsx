import React from 'react';
import { UserProfile } from '../../types';
import modeSlotGameImg from '../../assets/images/mode_slot_game_1789079098953.jpg';
import { ComingSoonGameModal } from './ComingSoonGameModal';
import { Sparkles, Trophy, Gift, Zap } from 'lucide-react';

interface SlotGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateBalance?: (newBalance: number) => void;
  onNavigateWallet?: () => void;
}

export const SlotGameModal: React.FC<SlotGameModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ComingSoonGameModal
      isOpen={isOpen}
      onClose={onClose}
      gameId="slot"
      title="লাকি স্লট মেশিন"
      enTitle="LUCKY SLOTS"
      badge="🎰 স্লট গেমস"
      headline="লাকি স্লট মেশিন খুব শীঘ্রই যুক্ত হচ্ছে!"
      description="আমরা আপনার জন্য তৈরি করছি রোমাঞ্চকর স্লট মেশিন, মেগা জ্যাকপট এবং দৈনিক আকর্ষণীয় ফ্রি স্পিন সুবিধা। খুব দ্রুত এটি সকল প্লেয়ারের জন্য উন্মুক্ত করা হবে।"
      artwork={modeSlotGameImg}
      features={[
        {
          icon: Sparkles,
          title: '৫০+ আকর্ষণীয় থিম',
          desc: 'ক্লাসিক ফ্রুটস, রয়েল গোল্ড ও ডায়মন্ড স্লট থিমস',
        },
        {
          icon: Trophy,
          title: 'মেগা প্রাইজ জ্যাকপট',
          desc: 'প্রতি স্পিনে ১০,০০০x পর্যন্ত প্রাইজ জেতার সুযোগ',
        },
        {
          icon: Gift,
          title: 'দৈনিক ফ্রি স্পিন বোনাস',
          desc: 'লগইন করলেই ফ্রি স্পিন ও ইনস্ট্যান্ট ক্যাশ রিওয়ার্ড',
        },
      ]}
      theme={{
        accentGradient: 'from-cyan-400 via-teal-300 to-amber-300',
        borderColor: 'border-cyan-400/80',
        glowShadow: 'shadow-[0_0_50px_rgba(6,182,212,0.4)]',
        textGradient: 'from-cyan-300 via-yellow-200 to-amber-400',
        badgeColor: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
        iconBg: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600',
        particleColor: 'text-cyan-400',
      }}
    />
  );
};
