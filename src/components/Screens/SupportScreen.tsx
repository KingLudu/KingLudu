import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Gamepad2, 
  CreditCard, 
  Banknote, 
  AlertTriangle, 
  MessageSquare, 
  ChevronDown, 
  Send, 
  UserRound, 
  ShieldCheck, 
  Sparkles,
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { ScreenType, RegionCode, UserProfile, AppSettings, LiveChatMessage } from '../../types';
import { getTranslation } from '../../utils/translations';
import { LiveChatModal } from '../Modals/LiveChatModal';
import { AboutModal } from '../Modals/AboutModal';

interface SupportScreenProps {
  user?: UserProfile;
  appSettings?: AppSettings;
  liveChatMessages?: LiveChatMessage[];
  onSendLiveChatMessage?: (text: string, imageUrl?: string, imageName?: string) => void;
  onMarkLiveChatAsRead?: () => void;
  onNavigate: (screen: ScreenType) => void;
  selectedRegion?: RegionCode;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ 
  user,
  appSettings,
  liveChatMessages = [],
  onSendLiveChatMessage,
  onMarkLiveChatAsRead,
  onNavigate, 
  selectedRegion = 'BN' 
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const t = getTranslation(selectedRegion);

  const getWhatsAppUrl = (rawInput?: string) => {
    if (!rawInput) return 'https://wa.me/8801700000000?text=Hello%20KingLudo%20Support';
    const clean = rawInput.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    const numericOnly = clean.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(`হ্যালো কিং লুডো সাপোর্ট! আমার সাহায্য প্রয়োজন। (ইউজার: ${user?.name || 'লুডো প্লেয়ার'})`);
    return `https://wa.me/${numericOnly}?text=${encodedMsg}`;
  };

  const faqs = [
    {
      q: 'কীভাবে ওয়ালেটে টাকা বা ক্রিপ্টো ডিপোজিট করব?',
      a: 'Wallet -> Deposit অপশনে গিয়ে বিকাশ, নগদ, রকেট, উপায় অথবা Binance Pay / USDT নির্বাচন করে টাকা পাঠিয়ে TrxID প্রদান করুন। এডমিন অনুমোদনের সাথে সাথে ব্যালেন্স যুক্ত হবে।'
    },
    {
      q: 'উইথড্র করতে কতক্ষণ সময় লাগে?',
      a: 'উইথড্র রিকোয়েস্ট পাঠানোর পর এডমিন প্যানেল থেকে ভেরিফাই করে দ্রুত সময়ের মধ্যে (সাধারণত ৫ মিনিট থেকে ১ ঘণ্টার মধ্যে) বিকাশ/নগদ নম্বরে পাঠিয়ে দেওয়া হয়।'
    },
    {
      q: 'লাইভ চ্যাটে কীভাবে স্ক্রিনশট বা লোগো পাঠাব?',
      a: 'লাইভ চ্যাটে ঢুকে ইনপুট বক্সের বাম পাশে থাকা 📷 ছবি/গ্যালারি আইকনে ক্লিক করে আপনার পেমেন্ট স্লিপ, লোগো বা যেকোনো ছবি আপলোড করে এডমিনের কাছে পাঠাতে পারেন।'
    },
    {
      q: 'লুডো টুর্নামেন্ট ও ম্যাচের নিয়মাবলি কী?',
      a: '২ প্লেয়ার বা ৪ প্লেয়ার মোডে যেকোনো ম্যাচ ক্রিয়েট করুন বা রুমে জয়েন করুন। বিজয়ী ব্যক্তি মোট পুলের ৮০% প্রাইজ পেয়ে যান এবং ২০% প্লাটফর্ম ফি হিসাব করা হয়।'
    }
  ];

  return (
    <div
      className="min-h-full text-white p-4 space-y-4 pb-24 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-slate-200 hover:bg-purple-800/60"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base text-white">২৪/৭ কাস্টমার সাপোর্ট (Support)</h2>
        <div className="w-9" />
      </div>

      {/* Main Live Chat Banner CTA with Human Head Icon */}
      <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-[#04260f] p-4 rounded-3xl border-2 border-amber-400/80 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <UserRound className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                <span>২৪/৭ লাইভ কাস্টমার সাপোর্ট</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h3>
              <p className="text-[10px] text-amber-300">এডমিন টিম সবসময় অনলাইনে সক্রিয় আছেন</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
            Online
          </span>
        </div>

        <p className="text-xs text-purple-200 leading-relaxed bg-[#031e0c]/70 p-2.5 rounded-xl border border-purple-800/40">
          ডিপোজিট, উইথড্র, ম্যাচ সমস্যা বা অ্যাকাউন্টের তথ্যের জন্য সরাসরি কথা বলুন। চ্যাটের মাধ্যমে <strong className="text-amber-300">ছবি বা লোগো</strong> পাঠাতে পারেন।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setShowLiveChatModal(true)}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <UserRound className="w-4 h-4 text-slate-950" />
            <span>লাইভ চ্যাট শুরু করুন (Live Chat)</span>
          </button>

          <a
            href={getWhatsAppUrl(appSettings?.supportWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition border border-emerald-400/50"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-900" />
            <span>হোয়াটসঅ্যাপ সাপোর্ট ({appSettings?.supportWhatsApp || '+8801700000000'})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Support Categories */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-purple-300">জনপ্রিয় হেল্প ক্যাটাগরি:</p>

        <button
          onClick={() => setShowLiveChatModal(true)}
          className="w-full bg-[#04260f] p-3 rounded-2xl border border-purple-900/40 flex items-center justify-between hover:border-purple-600 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">ডিপোজিট ও পেমেন্ট সমস্যা</span>
              <span className="text-[10px] text-purple-300">বিকাশ/নগদ/BinancePay ডিপোজিট ভেরিফিকেশন</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-purple-400 -rotate-90" />
        </button>

        <button
          onClick={() => setShowLiveChatModal(true)}
          className="w-full bg-[#04260f] p-3 rounded-2xl border border-purple-900/40 flex items-center justify-between hover:border-purple-600 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">উইথড্র ও ক্যাশআউট হেল্প</span>
              <span className="text-[10px] text-purple-300">টাকা তোলার অবস্থা ও আপডেট</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-purple-400 -rotate-90" />
        </button>

        <button
          onClick={() => setShowLiveChatModal(true)}
          className="w-full bg-[#04260f] p-3 rounded-2xl border border-purple-900/40 flex items-center justify-between hover:border-purple-600 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">লোগো / ছবি আপলোড সহায়তা</span>
              <span className="text-[10px] text-purple-300">প্রোফাইল লোগো বা স্লিপ পাঠিয়ে সমাধান নিন</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-purple-400 -rotate-90" />
        </button>
        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full bg-[#04260f] p-3 rounded-2xl border border-purple-900/40 flex items-center justify-between hover:border-amber-400/80 transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 group-hover:scale-105 transition-transform">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">আমাদের সম্পর্কে (About King Ludo)</span>
              <span className="text-[10px] text-purple-300">প্ল্যাটফর্ম পরিচিতি, নিয়মাবলী ও বিশ্বস্ততা</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-purple-400 -rotate-90 group-hover:text-amber-400 transition" />
        </button>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-2 pt-2">
        <h4 className="font-bold text-xs text-slate-300">সাধারণ প্রশ্নোত্তর (FAQs):</h4>

        {faqs.map((faq, i) => (
          <div key={`faq-item-${i}-${faq.q.slice(0, 15)}`} className="bg-[#04260f] rounded-2xl border border-purple-900/40 overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full p-3.5 text-left font-bold text-xs text-white flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-3.5 pb-3.5 text-xs text-purple-200/90 border-t border-purple-900/30 pt-2 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Chat Modal */}
      <LiveChatModal
        isOpen={showLiveChatModal}
        onClose={() => setShowLiveChatModal(false)}
        user={user}
        appSettings={appSettings}
        messages={liveChatMessages}
        onSendMessage={onSendLiveChatMessage}
        onMarkAsRead={onMarkLiveChatAsRead}
      />

      {/* About King Ludo Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        selectedRegion={selectedRegion}
      />
    </div>
  );
};
