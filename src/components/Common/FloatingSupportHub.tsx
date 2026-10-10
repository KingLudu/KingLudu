import React, { useState } from 'react';
import { MessageCircle, Headset, Sparkles } from 'lucide-react';
import { UserProfile, AppSettings, LiveChatMessage } from '../../types';

interface FloatingSupportHubProps {
  user: UserProfile;
  appSettings?: AppSettings;
  liveChatMessages?: LiveChatMessage[];
  isLiveChatTyping?: boolean;
  onOpenLiveChat: () => void;
}

export const FloatingSupportHub: React.FC<FloatingSupportHubProps> = ({
  user,
  appSettings,
  liveChatMessages = [],
  isLiveChatTyping = false,
  onOpenLiveChat,
}) => {
  const [hoveredButton, setHoveredButton] = useState<'whatsapp' | 'livechat' | null>(null);

  // Calculate unread live chat messages for this user
  const safeLiveChatMessages = Array.isArray(liveChatMessages) ? liveChatMessages : [];
  const currentUserId = user?.id || user?.phone || 'guest_user';
  const currentUserPhone = user?.phone || '01700000000';
  const userThreadMessages = safeLiveChatMessages.filter(
    (m) => m.userId === currentUserId || m.userPhone === currentUserPhone
  );
  const unreadCount = userThreadMessages.filter(
    (m) => m.senderRole === 'agent' && !m.read
  ).length;

  const getWhatsAppUrl = (rawInput?: string) => {
    if (!rawInput) return 'https://wa.me/8801700000000?text=Hello%20KingLudo%20Support';
    const clean = rawInput.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    const numericOnly = clean.replace(/[^0-9]/g, '');
    const currentUserName = user?.name || 'লুডো প্লেয়ার';
    const encodedMsg = encodeURIComponent(
      `হ্যালো কিং লুডো সাপোর্ট! আমার সাহায্য প্রয়োজন। (ইউজার: ${currentUserName}, ফোন: ${currentUserPhone})`
    );
    return `https://wa.me/${numericOnly}?text=${encodedMsg}`;
  };

  return (
    <div
      className="fixed bottom-20 right-3.5 z-40 flex flex-col items-end gap-3 select-none pointer-events-auto"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }}
    >
      {/* 1. WHATSAPP FLOATING BUTTON */}
      <div className="relative flex items-center justify-end group">
        {/* Floating Tooltip / Micro-Label */}
        <div
          className={`absolute right-14 px-2.5 py-1 rounded-xl bg-[#091130]/95 backdrop-blur-md border border-emerald-400/40 text-[11px] font-bold text-emerald-300 shadow-xl pointer-events-none whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
            hoveredButton === 'whatsapp' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>WhatsApp সাপোর্ট</span>
        </div>

        <a
          id="home-whatsapp-floating-btn"
          href={getWhatsAppUrl(appSettings?.supportWhatsApp)}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredButton('whatsapp')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative w-[52px] h-[52px] rounded-[18px] bg-gradient-to-b from-[#25D366] via-[#20BA56] to-[#128C7E] p-0.5 border-2 border-emerald-200/90 shadow-[0_8px_20px_rgba(37,211,102,0.5)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group-hover:shadow-[0_10px_26px_rgba(37,211,102,0.7)]"
          title="WhatsApp Support"
        >
          {/* Subtle Top Glass Gloss Highlight */}
          <div className="absolute top-0.5 inset-x-1.5 h-3.5 bg-gradient-to-b from-white/40 to-transparent rounded-t-[14px] pointer-events-none" />

          {/* WhatsApp Icon */}
          <MessageCircle className="w-7 h-7 text-emerald-950 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] relative z-10" />

          {/* Clean Real-Time Online Status Badge (No dark blurry rings) */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center z-20">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#091130] shadow-sm" />
            </span>
          </div>
        </a>
      </div>

      {/* 2. 24/7 LIVE CHAT FLOATING BUTTON */}
      <div className="relative flex items-center justify-end group">
        {/* Floating Tooltip / Micro-Label */}
        <div
          className={`absolute right-14 px-2.5 py-1 rounded-xl bg-[#091130]/95 backdrop-blur-md border border-amber-400/50 text-[11px] font-bold text-amber-300 shadow-xl pointer-events-none whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
            hoveredButton === 'livechat' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>২৪/৭ লাইভ চ্যাট</span>
        </div>

        <button
          id="home-livechat-floating-btn"
          type="button"
          onClick={onOpenLiveChat}
          onMouseEnter={() => setHoveredButton('livechat')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative w-[52px] h-[52px] rounded-[18px] bg-gradient-to-b from-[#FFE259] via-[#FFA751] to-[#E67E22] p-0.5 border-2 border-amber-200/95 shadow-[0_8px_24px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group-hover:shadow-[0_10px_28px_rgba(245,158,11,0.8)] cursor-pointer"
          title="24/7 Live Chat Support"
        >
          {/* Subtle Top Glass Gloss Highlight */}
          <div className="absolute top-0.5 inset-x-1.5 h-3.5 bg-gradient-to-b from-white/50 to-transparent rounded-t-[14px] pointer-events-none" />

          {/* Headset / Support Icon */}
          <Headset className="w-7 h-7 text-slate-950 stroke-[2.4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] relative z-10" />

          {/* DYNAMIC REAL-TIME UPDATE BADGES */}
          {/* Case A: Agent is actively typing */}
          {isLiveChatTyping ? (
            <div className="absolute -top-3 -left-2 bg-[#091130] text-amber-300 border border-amber-400/90 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5 z-30 animate-bounce">
              <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
              <span>লিখছেন...</span>
            </div>
          ) : null}

          {/* Case B: Unread message from agent exists */}
          {unreadCount > 0 ? (
            <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-amber-100 shadow-[0_2px_10px_rgba(225,29,72,0.85)] z-20 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          ) : (
            /* Case C: Always Active 24/7 Support Beacon */
            <div className="absolute -top-1 -right-1 flex items-center justify-center z-20">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-60" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-[#091130] shadow-sm" />
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
